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
      <li><a href="cfd.html">CfD Model</a></li>
      <li><a href="technology.html">Technology</a></li>
      <li><a href="compare.html">Tech Comparison</a></li>
      <li><a href="implementation.html">Implementation</a></li>
      <li><a href="sources.html">Sources</a></li>
      <li><a href="methodology.html">Methodology</a></li>
      <li><a href="library.html">Library</a></li>
      <li><a href="faq.html">FAQ</a></li>
      <li><a href="contact.html" class="nav__cta">Contact Us</a></li>
    </ul>
    <button class="nav__hamburger" id="nav__hamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav__mobile" id="mobileMenu">
  <a href="index.html">Home</a>
  <a href="agriculture.html">Agriculture</a>
  <a href="grid.html">Grid Benefits</a>
  <a href="cfd.html">CfD Model</a>
  <a href="technology.html">Technology</a>
  <a href="compare.html">Tech Comparison</a>
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
        <p>A UK-wide advocacy campaign promoting Vertical Bifacial Photovoltaic (VBPV) agrivoltaic systems as the evidence-based alternative to conventional solar in the UK's solar planning pipeline.</p>
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
          <li><a href="cfd.html">CfD Model</a></li>
          <li><a href="sources.html">Research Sources</a></li>
          <li><a href="methodology.html">Methodology</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4>Campaign</h4>
        <ul>
          <li><a href="implementation.html">Policy Pathway</a></li>
          <li><a href="library.html">Document Library</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="contact.html">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4>Key Research</h4>
        <ul>
          <li><a href="sources.html#york">University of York (2024)</a></li>
          <li><a href="sources.html#szarek">Szarek et al. (2026)</a></li>
          <li><a href="sources.html#next2sun">Next2Sun/Schüler (2026)</a></li>
          <li><a href="sources.html#bloombergnef">BloombergNEF (2025)</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© 2026 Harvesting the Sun Twice. Evidence-based advocacy for UK solar land use policy.</p>
    </div>
  </div>
</footer>`;

// Inject nav and footer
document.getElementById('nav-placeholder').innerHTML = NAV_HTML;
document.getElementById('footer-placeholder').innerHTML = FOOTER_HTML;

// Mobile menu toggle — event delegation works on all pages regardless of DOM re-renders
document.addEventListener('click', function(e) {
  var btn = e.target.closest('#nav__hamburger');
  if (btn) {
    var menu = document.getElementById('mobileMenu');
    if (!menu) return;
    var isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.classList.toggle('is-active', isOpen);
    return;
  }
  if (e.target.closest('#mobileMenu a')) {
    var menu = document.getElementById('mobileMenu');
    var hamburger = document.getElementById('nav__hamburger');
    if (menu) menu.classList.remove('open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('is-active');
    }
  }
});
