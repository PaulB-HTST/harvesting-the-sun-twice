// consent.js — cookie notice and consent-gated analytics (Google Analytics and Vercel Web Analytics).
// Both are loaded ONLY after the visitor presses Accept. Until then no analytics
// script is requested and no analytics cookies are set. The only thing stored by this file is
// the visitor's choice, in localStorage under 'htst_cookie_consent'.
(function () {
  var GA_ID = 'G-SPCV546Z74';
  var KEY = 'htst_cookie_consent'; // 'accepted' | 'declined'
  var gaLoaded = false;

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { window.localStorage.setItem(KEY, v); } catch (e) { /* choice just won't persist */ }
  }
  function clearStored() {
    try { window.localStorage.removeItem(KEY); } catch (e) {}
  }

  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    // Vercel Web Analytics (cookieless page-view counts), also only after consent.
    var v = document.createElement('script');
    v.defer = true;
    v.src = '/_vercel/insights/script.js';
    document.head.appendChild(v);
  }

  // Remove any Google Analytics cookies (used if someone withdraws consent after accepting).
  function clearGACookies() {
    var names = ['_ga', '_ga_' + GA_ID.replace('G-', ''), '_gid', '_gat'];
    var host = window.location.hostname;
    var parts = host.split('.');
    var domains = ['', host];
    for (var i = 1; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    domains.push('.' + host);
    names.forEach(function (n) {
      domains.forEach(function (d) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function removeBanner() {
    var b = document.getElementById('htst-consent');
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function choose(value) {
    write(value);
    if (value === 'accepted') {
      loadGA();
    } else {
      // Declining always removes any Google Analytics cookies (including ones set before this notice existed).
      clearGACookies();
      // An already-loaded tag can't be unloaded; a reload guarantees nothing further is sent.
      if (gaLoaded) { window.location.reload(); return; }
    }
    removeBanner();
    updateStatus();
  }

  function injectStyles() {
    if (document.getElementById('htst-consent-css')) return;
    var css = '' +
      '#htst-consent{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#1a3a2a;color:#fff;' +
      'font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:14px 16px;' +
      'box-shadow:0 -2px 12px rgba(0,0,0,.25)}' +
      '#htst-consent .htst-c-inner{max-width:1140px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center}' +
      '#htst-consent p{margin:0;flex:1 1 320px}' +
      '#htst-consent a{color:#e0b84e;text-decoration:underline}' +
      '#htst-consent .htst-c-btns{display:flex;gap:10px;flex:0 0 auto}' +
      '#htst-consent button{font:inherit;font-weight:600;min-width:96px;padding:9px 18px;border-radius:4px;cursor:pointer;' +
      'border:2px solid #e0b84e;background:transparent;color:#fff}' +
      '#htst-consent button.htst-c-accept{background:#e0b84e;color:#1a3a2a}' +
      '#htst-consent button:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
      '@media print{#htst-consent{display:none!important}}';
    var st = document.createElement('style');
    st.id = 'htst-consent-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function showBanner() {
    if (document.getElementById('htst-consent')) return;
    injectStyles();
    var b = document.createElement('div');
    b.id = 'htst-consent';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Cookie notice');
    b.innerHTML =
      '<div class="htst-c-inner">' +
      '<p>We would like to use analytics (Google Analytics, which sets cookies, and Vercel Web Analytics) to understand how this site is used. ' +
      'Nothing is loaded unless you accept. <a href="/cookies.html">Find out more about cookies</a>.</p>' +
      '<div class="htst-c-btns">' +
      '<button type="button" class="htst-c-accept">Accept</button>' +
      '<button type="button" class="htst-c-decline">Decline</button>' +
      '</div></div>';
    b.querySelector('.htst-c-accept').addEventListener('click', function () { choose('accepted'); });
    b.querySelector('.htst-c-decline').addEventListener('click', function () { choose('declined'); });
    document.body.appendChild(b);
  }

  // Lets cookies.html show the current choice and let people change it.
  function updateStatus() {
    var el = document.getElementById('htst-consent-status');
    if (!el) return;
    var v = read();
    el.textContent = v === 'accepted' ? 'You have accepted analytics cookies.'
      : v === 'declined' ? 'You have declined analytics cookies.'
      : 'You have not made a choice yet.';
  }

  window.htstConsent = {
    get: read,
    accept: function () { choose('accepted'); },
    decline: function () { choose('declined'); },
    reset: function () { clearStored(); clearGACookies(); window.location.reload(); }
  };

  // Start-up: act on a stored choice, otherwise ask.
  var saved = read();
  if (saved === 'accepted') loadGA();
  else clearGACookies(); // no consent: make sure no analytics cookies linger from earlier visits
  function init() {
    if (saved !== 'accepted' && saved !== 'declined') showBanner();
    updateStatus();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
