import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/alc.js';

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

function mockRes() {
  return {
    headers: {}, statusCode: null, body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
  };
}
const feats = (n) => Array.from({ length: n }, (_, i) => ({ type: 'Feature', properties: { ALC_GRADE: 'Grade 3' }, id: i }));
const okJson = (body) => ({ ok: true, json: async () => body });

test('sets CORS and cache headers', async () => {
  globalThis.fetch = async () => okJson({ features: [] });
  const res = mockRes();
  await handler({}, res);
  assert.equal(res.headers['Access-Control-Allow-Origin'], '*');
  assert.match(res.headers['Cache-Control'], /s-maxage=86400/);
});

test('single short page returns a FeatureCollection', async () => {
  const calls = [];
  globalThis.fetch = async (url) => { calls.push(url); return okJson({ features: feats(3) }); };
  const res = mockRes();
  await handler({}, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.type, 'FeatureCollection');
  assert.equal(res.body.features.length, 3);
  assert.equal(calls.length, 1);
  assert.match(calls[0], /resultOffset=0/);
});

test('paginates while pages are full, stops on a short page', async () => {
  const pages = [feats(1000), feats(1000), feats(5)];
  const calls = [];
  globalThis.fetch = async (url) => { calls.push(url); return okJson({ features: pages.shift() }); };
  const res = mockRes();
  await handler({}, res);
  assert.equal(res.body.features.length, 2005);
  assert.equal(calls.length, 3);
  assert.match(calls[1], /resultOffset=1000/);
  assert.match(calls[2], /resultOffset=2000/);
});

test('stops at the 10-page safety cap', async () => {
  let n = 0;
  globalThis.fetch = async () => { n++; return okJson({ features: feats(1000) }); };
  const res = mockRes();
  await handler({}, res);
  assert.equal(n, 10);
  assert.equal(res.body.features.length, 10000);
});

test('upstream non-OK yields 502 with error message', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  const res = mockRes();
  await handler({}, res);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.error, 'Upstream 503');
});

test('fetch rejection yields 502', async () => {
  globalThis.fetch = async () => { throw new Error('boom'); };
  const res = mockRes();
  await handler({}, res);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.error, 'boom');
});

test('ArcGIS 200 with error body yields 502', async () => {
  globalThis.fetch = async () => okJson({ error: { code: 400, message: 'bad' } });
  const res = mockRes();
  await handler({}, res);
  assert.equal(res.statusCode, 502);
  assert.match(res.body.error, /bad/);
});

test('abort timer is cleared when fetch rejects', async () => {
  const realClear = globalThis.clearTimeout;
  let cleared = 0;
  globalThis.clearTimeout = (id) => { cleared++; return realClear(id); };
  globalThis.fetch = async () => { throw new Error('boom'); };
  try { await handler({}, mockRes()); } finally { globalThis.clearTimeout = realClear; }
  assert.equal(cleared, 1);
});
