/* pulse-square-drift.js — gentle continuous "circling" motion for the homepage square rows.
 * Each horizontal row slowly drifts (ping-pong, no jumps), pauses on hover/touch/scroll, resumes
 * after idle. Standalone add-on (owner 2026-07-14). Respects reduced-motion; pauses when hidden. */
(function () {
  if (window.__pulseSquareDrift) return;
  window.__pulseSquareDrift = true;
  try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}

  var SPEED = 16 / 1000;   // px per ms — slow, readable
  var RESUME_MS = 2600;    // idle time before drift resumes after interaction
  var SCROLLER_SEL = '.psq-scroll, .recentscroll';

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < vh;
  }

  function wire(sc) {
    if (sc.__psqDrift) return;
    sc.__psqDrift = { dir: 1, paused: 0, acc: 0 };
    var st = sc.__psqDrift;
    function bump() { st.paused = Date.now() + RESUME_MS; }
    ['pointerdown', 'touchstart', 'wheel', 'mouseenter', 'keydown'].forEach(function (ev) {
      sc.addEventListener(ev, bump, { passive: true });
    });
  }

  var prev = 0;
  function frame(t) {
    if (!prev) prev = t;
    var dt = Math.min(50, t - prev); prev = t;
    if (!document.hidden) {
      var scrollers = document.querySelectorAll(SCROLLER_SEL);
      for (var i = 0; i < scrollers.length; i++) {
        var sc = scrollers[i];
        var max = sc.scrollWidth - sc.clientWidth;
        if (max <= 8 || !inViewport(sc)) continue;   // nothing to scroll / off-screen → skip
        wire(sc);
        var st = sc.__psqDrift;
        if (Date.now() < st.paused) continue;          // recently touched → hold
        st.acc += dt * SPEED * st.dir;
        if (Math.abs(st.acc) >= 1) {
          var d = st.acc | 0; st.acc -= d;
          sc.scrollLeft += d;
          if (sc.scrollLeft >= max - 1) st.dir = -1;   // ping-pong at the ends (no jump)
          else if (sc.scrollLeft <= 1) st.dir = 1;
        }
      }
    }
    requestAnimationFrame(frame);
  }

  function start() { requestAnimationFrame(frame); }
  // let the mosaic paint rows first
  setTimeout(start, 3000);
})();
