// Cross-page fade ("bring the lights up"). Intro fade-in is pure CSS on .page-fade;
// this only handles the fade-OUT before navigating to an internal .html page.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function leave(href) {
    var f = document.querySelector('.page-fade');
    if (reduce || !f) { window.location.href = href; return; }
    f.style.animation = 'none';
    f.style.transition = 'none';
    f.style.opacity = '0';
    f.style.pointerEvents = 'auto';
    void f.offsetWidth;                 // force reflow so the next change animates
    f.style.transition = 'opacity 500ms ease';
    f.style.opacity = '1';              // dim to black
    setTimeout(function () { window.location.href = href; }, 500);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target === '_blank') return;
    if (href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('http') === 0) return;
    if (!/\.html?($|\?|#)/.test(href)) return;   // only internal page navigations
    e.preventDefault();
    leave(href);
  });
})();
