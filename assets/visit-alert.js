// ───────────────────────────────────────────────────────────────────────────
// Visit alert client — fires /.netlify/functions/visit-alert once per session
// so Kory gets pinged when someone new lands on pulserevops.com.
// Server-side dedupes per IP per day; sessionStorage prevents per-tab reloads.
// ───────────────────────────────────────────────────────────────────────────
(function () {
  try {
    if (sessionStorage.getItem('pulse_visit_alerted')) return;
    sessionStorage.setItem('pulse_visit_alerted', '1');
  } catch (e) { return; }

  var payload = JSON.stringify({
    referrer: document.referrer || '',
    path: location.pathname + location.search,
  });

  var url = '/.netlify/functions/visit-alert';

  // sendBeacon is best — fires reliably even if user navigates away immediately
  if (navigator.sendBeacon) {
    try {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      return;
    } catch (e) { /* fall through to fetch */ }
  }
  if (window.fetch) {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(function () {});
  }
})();

// ───────────────────────────────────────────────────────────────────────────
// HUMAN alert — fires a SECOND beacon (human:true) only after we're highly
// confident a real person is on the page. The previous version fired on a
// single mousemove/scroll, which was tripped by browser scroll-restoration,
// lazy-load triggers, cursor jitter, and headless Chrome interactions —
// so every crawler/bot looked human. This rewrite requires:
//   1. navigator.webdriver === false (rejects Puppeteer/Playwright/Selenium)
//   2. tab is visible AND document has focus
//   3. minimum dwell time of 1500ms since page load (bots fire immediately)
//   4. removed 'scroll' from triggers (auto-scroll-restoration + lazy-load
//      fire it without a human)
//   5. for mousemove, first event just records position; we need a SECOND
//      mousemove with >50px movement (filters cursor settling/jitter)
//   6. require 2+ DIFFERENT interaction types OR 5+ total events
// Once per session.
// ───────────────────────────────────────────────────────────────────────────
(function () {
  try {
    if (sessionStorage.getItem('pulse_human_alerted')) return;
  } catch (e) { return; }

  // navigator.webdriver === true is set by Selenium/Puppeteer/Playwright by
  // default. Real browsers report false (or undefined on older builds).
  if (navigator.webdriver === true) return;

  var EVENTS = ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart', 'pointerdown'];
  var OPTS = { passive: true, capture: true };
  var MIN_DWELL_MS = 1500;
  var MIN_MOVE_PX = 50;
  var pageLoadAt = Date.now();
  var lastMousePos = null;
  var typesSeen = {};
  var totalCount = 0;
  var fired = false;

  function cleanup() {
    for (var i = 0; i < EVENTS.length; i++) {
      try { window.removeEventListener(EVENTS[i], onInteract, OPTS); } catch (e) {}
    }
  }

  function fireHuman(reason) {
    if (fired) return;
    fired = true;
    cleanup();
    try { sessionStorage.setItem('pulse_human_alerted', '1'); } catch (e) {}

    var dwell = Date.now() - pageLoadAt;
    var types = Object.keys(typesSeen);
    var payload = JSON.stringify({
      human: true,
      reason: reason,
      dwell_ms: dwell,
      types: types,
      type_count: types.length,
      event_count: totalCount,
      focused: !!(document.hasFocus && document.hasFocus()),
      referrer: document.referrer || '',
      path: location.pathname + location.search,
    });
    var url = '/.netlify/functions/visit-alert';
    if (navigator.sendBeacon) {
      try { navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' })); return; } catch (e) {}
    }
    if (window.fetch) {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(function () {});
    }
  }

  function onInteract(e) {
    if (fired) return;
    if (document.visibilityState && document.visibilityState !== 'visible') return;
    if (document.hasFocus && !document.hasFocus()) return;

    var dwell = Date.now() - pageLoadAt;
    if (dwell < MIN_DWELL_MS) return;

    if (e.type === 'mousemove') {
      if (!lastMousePos) {
        lastMousePos = { x: e.clientX, y: e.clientY };
        return;
      }
      var dx = Math.abs(e.clientX - lastMousePos.x);
      var dy = Math.abs(e.clientY - lastMousePos.y);
      if (dx + dy < MIN_MOVE_PX) return;
    }

    typesSeen[e.type] = (typesSeen[e.type] || 0) + 1;
    totalCount++;

    var typeCount = Object.keys(typesSeen).length;
    if (typeCount >= 2) {
      fireHuman('multi-type');
    } else if (totalCount >= 5) {
      fireHuman('sustained');
    }
  }

  for (var i = 0; i < EVENTS.length; i++) {
    try { window.addEventListener(EVENTS[i], onInteract, OPTS); } catch (e) {}
  }
})();
