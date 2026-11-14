// Updated 24/06/2026 — full REPD Q1 2026 dataset (7,228 entries) deployed
// Updated 23/06/2026 — commit this separately to trigger Vercel auto-deploy.
// nav-footer.js — Updated 19/06/2026
// Added: Pipeline Map as standard nav link
// Added: Analysis Tool nav link (dashboard.html)
// Fixed: class names corrected to match style.css BEM conventions
// Fixed: logo src paths corrected (logo files are at repo root, not /images/)
// This file is loaded by all pages via <script src="/js/nav-footer.js"></script>

(function() {
// ── Determine current page for active state ──
const path = window.location.pathname.replace(/\/$/, '') || '/index';
const page = path.split('/').pop().replace('.html', '') || 'index';

// ── Navigation items ──
const navItems = [
{ href: '/index.html', label: 'Home', id: 'index' },
{ href: '/technology.html', label: 'Technology', id: 'technology' },
{ href: '/compare.html', label: 'Compare', id: 'compare' },
{ href: '/dashboard.html', label: 'Analysis Tool', id: 'dashboard', badge: 'New' },
{ href: '/sources.html', label: 'Evidence', id: 'sources' },
{ href: '/library.html', label: 'Library', id: 'library' },
{ href: '/faq.html', label: 'FAQ', id: 'faq' },
{ href: '/map.html', label: 'Pipeline Map', id: 'map' },
];

// ── Build nav HTML ──
const navLinks = navItems.map(item => {
const isActive = page === item.id || (page === '' && item.id === 'index');
const badge = item.badge ? `<span style="background:#C9A227;color:#fff;font-size:9px;font-weight:600;padding:1px 5px;border-radius:3px;margin-left:5px;vertical-align:middle;letter-spacing:0.03em">${item.badge}</span>` : '';
return `<a href="${item.href}"${isActive ? ' class="active"' : ''}>${item.label}${badge}</a>`;
}).join('');

// ── Inject nav ──
const navEl = document.getElementById('site-nav') || document.getElementById('nav-placeholder');
if (navEl) {
navEl.className = 'nav';
navEl.innerHTML = `
<div class="nav__inner">
<a href="/index.html" class="nav__logo">
<img src="/HTST_Logo_transparent.png" alt="Harvesting the Sun Twice" class="nav__logo-img">
</a>
<div class="nav__links" aria-label="Main navigation">
${navLinks}
</div>
<a href="mailto:harvestingthesuntwice@gmail.com" class="nav__cta">Contact</a>
</div>
`;
}

// ── Inject footer ──
const footerEl = document.getElementById('site-footer') || document.getElementById('footer-placeholder');
if (footerEl) {
footerEl.innerHTML = `
<footer class="footer">
<div class="container">
<div class="footer__grid">
<div class="footer__brand">
<img src="/HTST_Logo_Blue_transparent.png" alt="Harvesting the Sun Twice" height="56" style="margin-bottom:1rem;background:var(--chalk);border-radius:var(--radius);padding:6px 10px">
<p>A UK campaign advocating for Vertical Bifacial PV agrivoltaic systems on Best and Most Versatile agricultural land.</p>
</div>
<div class="footer__col">
<h4>Explore</h4>
<ul>
<li><a href="/technology.html">Technology</a></li>
<li><a href="/compare.html">Compare</a></li>
<li><a href="/sources.html">Evidence</a></li>
<li><a href="/library.html">Library</a></li>
<li><a href="/faq.html">FAQ</a></li>
</ul>
</div>
<div class="footer__col">
<h4>Tools</h4>
<ul>
<li><a href="/dashboard.html">Analysis Tool</a></li>
<li><a href="/map.html">Pipeline Map</a></li>
</ul>
</div>
<div class="footer__col footer__contact">
<h4>Contact</h4>
<a href="mailto:harvestingthesuntwice@gmail.com">harvestingthesuntwice@gmail.com</a>
<p style="font-size:0.8rem;color:var(--stone);margin:0.75rem 0 0.15rem">Campaign Director: Paul Bird</p>
<p style="font-size:0.8rem;color:var(--stone);margin:0">Sawtry, Cambridgeshire</p>
</div>
</div>
<div class="footer__bottom">
<p>© 2026 Harvesting the Sun Twice · <a href="/cookies.html">Cookies</a></p>
<p>All figures indicative — not a substitute for a site-specific EYA</p>
</div>
</div>
</footer>
`;
}
})();
