/* PULSE Visitor Alert (every-visitor mode, re-enabled 2026-06-19)
 * Owner opted back IN to being emailed on EVERY visit — any visitor and any
 * JS-running bot/crawler — deduped server-side to one email per IP per day
 * (see netlify/functions/visitor-alert.js).
 *
 * Fires once per page session, shortly after load, regardless of clicks. A
 * brief window lets a mousemove flag the visit as "human" vs "visitor/bot";
 * the label is informational only — the email sends either way.
 */
(function () {
  if (window.__pulseHumanGate) return;
  window.__pulseHumanGate = true;

  var LOAD_TIME = Date.now();
  var FIRE_DELAY = 1200;     // ms after load before we beacon (lets a human move the mouse)
  var moved = false;         // a non-zero mousemove path was observed
  var fired = false;         // one alert per session
  var lastX = null, lastY = null;

  // Mouse movement = human signal (informational label only).
  document.addEventListener('mousemove', function (e) {
    if (lastX !== null && (e.clientX !== lastX || e.clientY !== lastY)) moved = true;
    lastX = e.clientX; lastY = e.clientY;
  }, { passive: true });

  function notify() {
    if (fired) return;
    fired = true;
    try {
      var payload = JSON.stringify({
        human: !!moved,
        dwell_ms: Date.now() - LOAD_TIME,
        page: location.pathname + location.search,
        ref: document.referrer || '',
        ua: navigator.userAgent || '',
        ts: Date.now()
      });
      var url = '/.netlify/functions/visitor-alert';
      var blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon && navigator.sendBeacon(url, blob)) return;
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(function () {});
    } catch (_e) {}
  }

  // Fire shortly after load for EVERY visit. Also flush on tab-hide in case the
  // delay hasn't elapsed yet (short visits / bots that bounce immediately).
  setTimeout(notify, FIRE_DELAY);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') notify();
  });
  window.addEventListener('pagehide', notify);
})();
