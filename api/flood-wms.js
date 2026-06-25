// api/flood-wms.js
// Vercel serverless proxy: converts Leaflet EPSG:3857 WMS tile requests to
// EPSG:27700 (British National Grid) for the EA Flood Map for Planning WMS.
//
// Background: the EA flood WMS only supports EPSG:27700 and CRS:84 — not
// EPSG:3857. Leaflet always requests tiles in EPSG:3857. This proxy:
//   1. Receives the Leaflet BBOX in EPSG:3857 (metres, Web Mercator)
//   2. Converts SW and NE corners → WGS84 geodetic → OSGB36 / EPSG:27700
//   3. Forwards to the EA WMS with CRS=EPSG:27700 using WMS 1.3.0
//   4. Streams the PNG tile back to Leaflet
//
// The EA WMS only renders tiles where the bbox is roughly ≤ 5 km wide (BNG).
// Set minZoom:13 on the Leaflet layer to ensure tiles stay within that limit.
//
// No npm dependencies required — all transform maths is inline.

export const config = { maxDuration: 20 };

// ── EPSG:3857 → WGS84 ────────────────────────────────────────────────────────
function merc2latlon(x, y) {
  const R = 6378137.0; // WGS84 semi-major axis
  const lon = (x / R) * (180 / Math.PI);
  const lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
  return [lat, lon]; // degrees
}

// ── WGS84 geodetic → EPSG:27700 (BNG) ────────────────────────────────────────
// Method: WGS84 geodetic → 3D Cartesian → Helmert → OSGB36 3D → TM projection
// Parameters from OS "Guide to Coordinate Systems in Great Britain" v2.3 §6.6
function wgs84ToBNG(latDeg, lonDeg) {
  const deg = Math.PI / 180;

  // WGS84 ellipsoid
  const a  = 6378137.0;
  const b  = 6356752.3142;
  const e2 = (a * a - b * b) / (a * a);

  const phi = latDeg * deg;
  const lam = lonDeg * deg;

  // WGS84 geodetic → 3D Cartesian
  const v = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2);
  const X = v * Math.cos(phi) * Math.cos(lam);
  const Y = v * Math.cos(phi) * Math.sin(lam);
  const Z = v * (1 - e2) * Math.sin(phi);

  // Helmert transform: WGS84 → OSGB36 (OS parameters)
  const tx = -446.448,  ty = 125.157,  tz = -542.060; // metres
  const s  = 20.4894e-6;                               // scale factor (ppm)
  const sec = deg / 3600;                              // 1 arc-second in radians
  const rx = -0.1502 * sec;
  const ry = -0.2470 * sec;
  const rz = -0.8421 * sec;

  const X2 = tx + (1 + s) * X - rz * Y + ry * Z;
  const Y2 = ty + rz * X + (1 + s) * Y - rx * Z;
  const Z2 = tz - ry * X + rx * Y + (1 + s) * Z;

  // OSGB36 (Airy 1830) ellipsoid
  const a2  = 6377563.396;
  const b2  = 6356256.909;
  const e22 = (a2 * a2 - b2 * b2) / (a2 * a2);

  // 3D Cartesian → OSGB36 geodetic (iterative)
  const p = Math.sqrt(X2 * X2 + Y2 * Y2);
  let ph = Math.atan2(Z2, p * (1 - e22));
  for (let i = 0; i < 10; i++) {
    const v2 = a2 / Math.sqrt(1 - e22 * Math.sin(ph) ** 2);
    ph = Math.atan2(Z2 + e22 * v2 * Math.sin(ph), p);
  }
  const lm = Math.atan2(Y2, X2);

  // Transverse Mercator: OSGB36 geodetic → BNG (E, N)
  // National Grid constants
  const F0   = 0.9996012717;    // central meridian scale factor
  const phi0 = 49.0 * deg;      // true origin latitude
  const lam0 = -2.0 * deg;      // true origin longitude (2°W)
  const N0   = -100000.0;       // northing of true origin (m)
  const E0   =  400000.0;       // easting of false origin (m)

  const n  = (a2 - b2) / (a2 + b2);
  const n2 = n * n;
  const n3 = n * n * n;

  const v3  = a2 * F0 / Math.sqrt(1 - e22 * Math.sin(ph) ** 2);
  const rho = a2 * F0 * (1 - e22) / Math.pow(1 - e22 * Math.sin(ph) ** 2, 1.5);
  const eta2 = v3 / rho - 1;
  const t  = Math.tan(ph);
  const t2 = t * t;
  const dl = lm - lam0;

  // Meridional arc M
  const M = b2 * F0 * (
    (1 + n + 5 / 4 * n2 + 5 / 4 * n3) * (ph - phi0)
    - (3 * n + 3 * n2 + 21 / 8 * n3) * Math.sin(ph - phi0) * Math.cos(ph + phi0)
    + (15 / 8 * n2 + 15 / 8 * n3) * Math.sin(2 * (ph - phi0)) * Math.cos(2 * (ph + phi0))
    - 35 / 24 * n3 * Math.sin(3 * (ph - phi0)) * Math.cos(3 * (ph + phi0))
  );

  const I    = M + N0;
  const II   = v3 / 2 * Math.sin(ph) * Math.cos(ph);
  const III  = v3 / 24 * Math.sin(ph) * Math.cos(ph) ** 3 * (5 - t2 + 9 * eta2);
  const IIIA = v3 / 720 * Math.sin(ph) * Math.cos(ph) ** 5 * (61 - 58 * t2 + t2 * t2);
  const IV   = v3 * Math.cos(ph);
  const V    = v3 / 6 * Math.cos(ph) ** 3 * (v3 / rho - t2);
  const VI   = v3 / 120 * Math.cos(ph) ** 5 * (5 - 18 * t2 + t2 * t2 + 14 * eta2 - 58 * t2 * eta2);

  const N_coord = I  + II * dl ** 2 + III * dl ** 4 + IIIA * dl ** 6;
  const E_coord = E0 + IV * dl      + V   * dl ** 3 + VI   * dl ** 5;

  return [E_coord, N_coord];
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Allow Leaflet on any origin to fetch this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { BBOX, WIDTH = '256', HEIGHT = '256' } = req.query;

  if (!BBOX) {
    return res.status(400).json({ error: 'BBOX query parameter required' });
  }

  // Leaflet sends: minX,minY,maxX,maxY in EPSG:3857 (Web Mercator metres)
  const parts = BBOX.split(',').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) {
    return res.status(400).json({ error: 'BBOX must be four comma-separated numbers' });
  }
  const [x1, y1, x2, y2] = parts;

  // Convert SW and NE corners to WGS84, then to BNG (EPSG:27700)
  const [lat1, lon1] = merc2latlon(x1, y1);
  const [lat2, lon2] = merc2latlon(x2, y2);
  const [e1, n1] = wgs84ToBNG(lat1, lon1);
  const [e2, n2] = wgs84ToBNG(lat2, lon2);

  // BNG bbox: ensure min/max ordering (TM projection is nearly rectilinear
  // at UK extents so corner-only conversion is sufficiently accurate)
  const minE = Math.min(e1, e2);
  const minN = Math.min(n1, n2);
  const maxE = Math.max(e1, e2);
  const maxN = Math.max(n1, n2);

  const bngBbox = `${minE},${minN},${maxE},${maxN}`;

  // EA Flood Map for Planning WMS — requires WMS 1.3.0 + CRS:27700
  const EA_WMS =
    'https://environment.data.gov.uk/spatialdata/flood-map-for-planning-flood-zones/wms?' +
    'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap' +
    '&LAYERS=Flood_Zones_2_3_Rivers_and_Sea' +
    `&CRS=EPSG:27700&BBOX=${bngBbox}` +
    `&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}` +
    '&FORMAT=image/png&TRANSPARENT=true&STYLES=';

  try {
    const upstream = await fetch(EA_WMS, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'HTST-Map/1.0 (harvestingthesuntwice.org)' }
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `EA WMS returned ${upstream.status}` });
    }

    const contentType = upstream.headers.get('content-type') || 'image/png';
    const buf = Buffer.from(await upstream.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(buf);
  } catch (err) {
    // Return a 1×1 transparent PNG so Leaflet doesn't log a tile error
    const transparentPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(transparentPng);
  }
}
