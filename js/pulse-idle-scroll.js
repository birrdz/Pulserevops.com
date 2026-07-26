/* pulse-idle-scroll.js — after idle, slowly drift down (mobile + desktop). Owner 2026-07-04.
 * Works with endless mosaic loops that keep appending content below the fold.
 * Real user input stops drift and restarts the idle timer.
 * 2026-07-21: sole auto-scroll path (hard page-jump interval removed from index.html). */
(function () {
  if (window.__pulseIdleScroll) return;
  window.__pulseIdleScroll = true;

  var reduce = false;
  try { reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce) return;

  var IDLE_MS = 20000;       // 20s idle before drift
  var SPEED = 10 / 1000;     // ~10px/s — slow readable glide (was 14)
  var LOOP_PAD = 8;
  var lastActive = Date.now();
  var drifting = false;
  var raf = null;
  var prevT = 0;
  var acc = 0;
  var selfTop = -1;
  var looping = false;

  function maxScroll() {
    var h = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    return Math.max(0, h - window.innerHeight);
  }

  function canScroll() {
    return maxScroll() > 8;
  }

  function stop() {
    drifting = false;
    looping = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    prevT = 0;
    acc = 0;
  }

  function reset() {
    lastActive = Date.now();
    if (drifting) stop();
  }

  function step(t) {
    if (!drifting) return;
    if (!prevT) prevT = t;
    var dt = Math.min(48, t - prevT); // clamp so tab-thaw doesn't jump
    prevT = t;
    acc += dt * SPEED;
    if (acc >= 1) {
      var d = Math.floor(acc);
      acc -= d;
      var y = window.scrollY || window.pageYOffset || 0;
      var max = maxScroll();
      if (y + d >= max - LOOP_PAD) {
        // Soft loop to top without a hard snap fight
        if (!looping) {
          looping = true;
          stop();
          try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (e) {
            window.scrollTo(0, 0);
          }
          lastActive = Date.now(); // re-idle after loop settles
          return;
        }
      }
      selfTop = Math.ceil(y) + d;
      // Direct scrollTop — smoother than scrollBy under layout appends
      try {
        var root = document.scrollingElement || document.documentElement;
        root.scrollTop = Math.min(max, y + d);
      } catch (e) {
        window.scrollBy(0, d);
      }
    }
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (drifting || document.hidden) return;
    if (!canScroll()) return;
    drifting = true;
    looping = false;
    prevT = 0;
    acc = 0;
    selfTop = Math.ceil(window.scrollY || 0);
    raf = requestAnimationFrame(step);
  }

  // Meaningful interaction only — omit mousemove so desktop can reach idle.
  ['wheel', 'touchstart', 'touchmove', 'keydown', 'mousedown', 'pointerdown', 'click'].forEach(function (ev) {
    window.addEventListener(ev, reset, { passive: true });
  });

  window.addEventListener('scroll', function () {
    if (drifting && Math.abs(Math.ceil(window.scrollY || 0) - selfTop) > 12) reset();
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else lastActive = Date.now();
  });

  window.addEventListener('resize', function () {
    if (drifting && !canScroll()) stop();
  }, { passive: true });

  setInterval(function () {
    if (drifting || document.hidden) return;
    if (Date.now() - lastActive >= IDLE_MS) start();
  }, 500);

  window.PulseIdleScroll = { reset: reset, stop: stop, start: start };
})();
