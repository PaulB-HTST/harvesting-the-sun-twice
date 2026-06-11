// nav-footer.js — Updated 10/06/2026
// Added: Analysis Tool nav link (dashboard.html)
// This file is loaded by all pages via <script src="/nav-footer.js"></script>

(function() {
  // ── Determine current page for active state ──
  const path = window.location.pathname.replace(/\/$/, '') || '/index';
  const page = path.split('/').pop().replace('.html', '') || 'index';

  // ── Navigation items ──
  const navItems = [
    { href: '/index.html',      label: 'Home',          id: 'index' },
    { href: '/technology.html', label: 'Technology',    id: 'technology' },
    { href: '/compare.html',    label: 'Compare',       id: 'compare' },
    { href: '/dashboard.html',  label: 'Analysis Tool', id: 'dashboard', badge: 'New' },
    { href: '/sources.html',    label: 'Evidence',      id: 'sources' },
    { href: '/library.html',    label: 'Library',       id: 'library' },
    { href: '/faq.html',        label: 'FAQ',           id: 'faq' },
  ];

  // ── Build nav HTML ──
  const navLinks = navItems.map(item => {
    const isActive = page === item.id || (page === '' && item.id === 'index');
    const badge = item.badge ? `<span style="background:#C9A227;color:#fff;font-size:9px;font-weight:600;padding:1px 5px;border-radius:3px;margin-left:5px;vertical-align:middle;letter-spacing:0.03em">${item.badge}</span>` : '';
    return `<a href="${item.href}" class="nav-link${isActive ? ' nav-link--active' : ''}">${item.label}${badge}</a>`;
  }).join('');

  // ── Inject nav ──
  const navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.innerHTML = `
      <div class="nav-inner">
        <a href="/index.html" class="nav-logo">
          <img src="/images/htst-logo-3colour.png" alt="Harvesting the Sun Twice" height="36">
        </a>
        <nav class="nav-links" aria-label="Main navigation">
          ${navLinks}
        </nav>
        <a href="https://harvestingthesuntwice@gmail.com" class="nav-cta">Contact</a>
      </div>
    `;
  }

  // ── Inject footer ──
  const footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML = `
      <div class="footer-inner">
        <div class="footer-col">
          <img src="/images/htst-logo-blue-mono.png" alt="Harvesting the Sun Twice" height="28" style="margin-bottom:10px;opacity:0.7">
          <p style="font-size:12px;color:#888;line-height:1.6">A UK campaign advocating for Vertical Bifacial PV agrivoltaic systems on Best and Most Versatile agricultural land.</p>
        </div>
        <div class="footer-col">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#666;margin-bottom:8px">Pages</div>
          <div style="display:flex;flex-direction:column;gap:5px">
            <a href="/technology.html" class="footer-link">Technology</a>
            <a href="/compare.html" class="footer-link">Compare</a>
            <a href="/dashboard.html" class="footer-link">Analysis Tool</a>
            <a href="/sources.html" class="footer-link">Evidence</a>
            <a href="/library.html" class="footer-link">Library</a>
            <a href="/faq.html" class="footer-link">FAQ</a>
          </div>
        </div>
        <div class="footer-col">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#666;margin-bottom:8px">Contact</div>
          <a href="mailto:harvestingthesuntwice@gmail.com" class="footer-link">harvestingthesuntwice@gmail.com</a>
          <div style="margin-top:8px;font-size:11px;color:#888">Campaign Director: Paul Bird</div>
          <div style="font-size:11px;color:#888">Sawtry, Cambridgeshire</div>
        </div>
      </div>
      <div class="footer-base">
        <span>© 2026 Harvesting the Sun Twice</span>
        <span>All figures indicative — not a substitute for a site-specific EYA</span>
      </div>
    `;
  }
})();
