/* pulse-endless-loop.js — at scroll bottom, re-append the same block forever (hire/hub tiles recycle). */
(function () {
  if (window.__pulseEndlessLoop) return;
  window.__pulseEndlessLoop = true;

  function boot(el) {
    if (!el || el.__pulseEndless) return;
    el.__pulseEndless = true;
    // Snapshot only the original tiles — not anything appended later.
    var html = el.innerHTML.trim();
    if (!html) return;
    var sent = document.createElement('div');
    sent.className = 'pulse-endless-sentinel';
    sent.setAttribute('aria-hidden', 'true');
    sent.style.cssText = 'grid-column:1/-1;height:1px;width:100%;pointer-events:none;';
    el.appendChild(sent);
    var margin = el.getAttribute('data-endless-margin') || '600px';
    var io = new IntersectionObserver(function (en) {
      if (en[0] && en[0].isIntersecting) {
        // Recycle: same tiles again and again — page never ends.
        sent.insertAdjacentHTML('beforebegin', html);
      }
    }, { rootMargin: margin });
    io.observe(sent);
  }

  function scan() {
    document.querySelectorAll('[data-pulse-endless-loop], .pulse-endless-loop').forEach(boot);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
})();
