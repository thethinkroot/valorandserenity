(function () {
  if (!location.hash) return;
  var id = location.hash.slice(1);

  function reScroll() {
    var target = document.getElementById(id);
    if (target) target.scrollIntoView();
  }

  // Google Fonts load asynchronously and can reflow the page after the
  // browser's own initial fragment-scroll already fired, leaving anchor
  // links landing above their real target once layout settles. Re-scroll
  // once fonts are confirmed loaded, and again after load as a fallback
  // for browsers without the Font Loading API.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(reScroll);
  }
  window.addEventListener('load', reScroll);
  setTimeout(reScroll, 350);
})();
