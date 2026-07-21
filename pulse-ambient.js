/* pulse-ambient.js — site script bootstrap ONLY (music removed, owner 2026-07-21).
 * Loads shared mosaic / idle-scroll helpers. No Web Audio, no ♪ toggle. */
(function () {
  if (window.__pulseAmbient) return;
  window.__pulseAmbient = true;

  // Kill any prior music preference so a stale cached build cannot autoplay.
  try {
    localStorage.setItem('pulseAudio', 'off');
  } catch (e) {}

  // Remove leftover music toggle if an older build left one in the DOM.
  try {
    [].slice
      .call(document.querySelectorAll('button[aria-label="Toggle background music"]'))
      .forEach(function (b) {
        b.remove();
      });
  } catch (e) {}

  function loadSiteScripts() {
    [
      '/js/pulse-face-img.js?v=tile-fix-20260721b',
      '/js/pulse-home-mosaic.js?v=tile-fix-20260721b',
      '/js/pulse-idle-scroll.js?v=smooth-scroll-20260721',
      '/js/pulse-endless-loop.js',
      '/js/pulse-mosaic-endless.js?v=tile-fix-20260721b',
    ].forEach(function (src) {
      var bare = src.split('?')[0];
      if (document.querySelector('script[src^="' + bare + '"]')) return;
      var s = document.createElement('script');
      s.src = src;
      s.defer = true;
      document.head.appendChild(s);
    });
  }

  function init() {
    loadSiteScripts();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
