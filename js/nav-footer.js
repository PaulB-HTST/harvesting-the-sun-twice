// nav-footer.js — injects navigation and footer into every page

const NAV_HTML = `
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="nav__inner">
    <a href="index.html" class="nav__logo">
      <img src="HTST_Logo_transparent.png" alt="Harvesting the Sun Twice" class="nav__logo-img">
    </a>
    <ul class="nav__links">
      <li><a href="index.html">Home</a></li>
      <li><a href="agriculture.html">Agriculture</a></li>
      <li><a href="grid.html">Grid Benefits</a></li>
      <li><a href="technology.html">Technology</a></li>
      <li><a href="compare.html">Technology Comparison</a></li>
      <li><a href="implementation.html">Implementation</a></li>
      <li><a href="sources.html">Sources</a></li>
      <li><a href="methodology.html">Methodology</a></li>
      <li><a href="library.html">Library</a></li>
      <li><a href="faq.html">FAQ</a></li>
      <li><a href="contact.html" class="nav__cta">Contact Us</a></li>
    </ul>
    <button class="nav__hamburger" onclick="toggleMenu()" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav__mobile" id="mobileMenu">
  <a href="index.html">Home</a>
  <a href="agriculture.html">Agriculture</a>
  <a href="grid.html">Grid Benefits</a>
  <a href="technology.html">Technology</a>
  <a href="implementation.html">Implementation</a>
  <a href="sources.html">Sources</a>
  <a href="methodology.html">Methodology</a>
  <a href="library.html">Library</a>
  <a href="faq.html">FAQ</a>
  <a href="contact.html">Contact Us</a>
</div>`;

const FOOTER_HTML = `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <img src="HTST_Logo_Blue_transparent.png" alt="Harvesting the Sun Twice" style="height:80px; margin-bottom:1rem; display:block;">
        <h3>Harvesting the Sun Twice</h3>
        <p>A UK-wide advocacy campaign promoting Vertical Bifacial Photovoltaic (VBPV) agrivoltaic systems as the evidence-based alternative to conventional solar in the UK's planning pipeline.</p>
        <div class="footer__contact">
          <a href="mailto:harvestingthesuntwice@gmail.com">harvestingthesuntwice@gmail.com</a>
          <a href="https://harvestingthesuntwice.org">harvestingthesuntwice.org</a>
        </div>
      </div>
      <div class="footer__col">
        <h4>Evidence</h4>
        <ul>
          <li><a href="technology.html">Technology Comparison</a></li>
          <li><a href="agriculture.html">Agricultural Benefits</a></li>
          <li><a href="grid.html">Grid Benefits</a></li>
          <li><a href="sources.html">Research Sources</a></li>
          <li><a href="methodology.html">Methodology</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4>Campaign</h4>
        <ul>
          <li><a href="implementation.html">Policy Pathway</a></li>
          <li><a href="contact.html">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4>Key Research</h4>
        <ul>
          <li><a href="sources.html#york">University of York (2024)</a></li>
          <li><a href="sources.html#turku">University of Turku (2026)</a></li>
          <li><a href="sources.html#sheffield">Sheffield Spatial (2025)</a></li>
          <li><a href="sources.html#bloombergnef">BloombergNEF (2025)</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© 2026 Harvesting the Sun Twice. Campaign Director: Paul Bird. &nbsp;|&nbsp; <em>Site imagery: AI-generated illustrations. Commercial photography from Next2Sun and UK installations pending.</em></p>
      <p>All data claims sourced from peer-reviewed research and verified 2025 industry benchmarks. <a href="methodology.html">View methodology</a>.</p>
    </div>
  </div>
</footer>`;

function injectNav() {
  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) placeholder.outerHTML = NAV_HTML;
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.outerHTML = FOOTER_HTML;

  // Set active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', injectNav);
