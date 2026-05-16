// ────────────────────────────────────────────────────────────────────────
// intent-beacon — fires once per session, sends path + referrer to the
// intent-track Netlify Function. Server reads IP from headers, queries
// IPinfo for company-level data, logs to the pulse-intent Blob store.
//
// Zero UI. Silent. Safe to fail. Disclosed in /privacy.html.
// ────────────────────────────────────────────────────────────────────────
(function(){
  'use strict';
  var KEY = 'pulse_intent_session_v1';
  try {
    if (sessionStorage.getItem(KEY) === '1') return; // already fired this session
    sessionStorage.setItem(KEY, '1');
  } catch (e) { /* sessionStorage may be blocked; proceed anyway */ }

  var payload = {
    path: location.pathname || '/',
    ref:  document.referrer || ''
  };

  // navigator.sendBeacon is fire-and-forget, survives page unload, no CORS
  // preflight — perfect for analytics pings. Falls back to fetch if absent.
  try {
    if (navigator.sendBeacon) {
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/.netlify/functions/intent-track', blob);
      return;
    }
  } catch (e) {}

  if (window.fetch) {
    fetch('/.netlify/functions/intent-track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit',
    }).catch(function(){ /* silent */ });
  }
})();
