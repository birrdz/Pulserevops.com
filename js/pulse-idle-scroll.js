/* pulse-idle-scroll.js — after 60s idle, slowly drift down (mobile + desktop). Owner 2026-07-04.
 * Works with endless mosaic loops that keep appending content below the fold.
 * Real user input stops drift and restarts the 60s timer. */
(function () {
  if (window.__pulseIdleScroll) return;
  window.__pulseIdleScroll = true;

  var reduce = false;
  try { reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce) return;

  var IDLE_MS = 15000;  // 15s idle (owner 2026-07-06)
  var SPEED = 14 / 1000; // ~14px/s — slow, readable drift
  var lastActive = Date.now();
  var drifting = false;
  var raf = null;
  var prevT = 0;
  var acc = 0;
  var selfTop = -1;

  function canScroll() {
    return (document.documentElement.scrollHeight || document.body.scrollHeight || 0) > window.innerHeight + 8;
  }

  function stop() {
    drifting = false;
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
    var dt = t - prevT;
    prevT = t;
    acc += dt * SPEED;
    if (acc >= 1) {
      var d = Math.floor(acc);
      acc -= d;
      selfTop = Math.ceil(window.scrollY) + d;
      window.scrollBy({ top: d, left: 0, behavior: 'auto' });
    }
    raf = requestAnimationFrame(step);
  }

  function start() {
    if (drifting || document.hidden) return;
    if (!canScroll()) return;
    drifting = true;
    prevT = 0;
    acc = 0;
    selfTop = Math.ceil(window.scrollY);
    raf = requestAnimationFrame(step);
  }

  // Meaningful interaction only — omit mousemove so desktop can actually reach 60s idle.
  ['wheel', 'touchstart', 'touchmove', 'keydown', 'mousedown', 'pointerdown', 'click'].forEach(function (ev) {
    window.addEventListener(ev, reset, { passive: true });
  });

  window.addEventListener('scroll', function () {
    if (drifting && Math.abs(Math.ceil(window.scrollY) - selfTop) > 6) reset();
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
