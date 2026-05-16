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
