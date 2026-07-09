/* howtos-track.js — emails Kory (via pulse-click-notify → Resend) when a visitor
   clicks a link, CTA, or tile on a PULSE how-to page. Per-session dedup by
   kind+label so one visitor clicking the same thing twice = one notification.
   Bots are filtered server-side in pulse-click-notify.js. */
(function () {
  function send(kind, label) {
    var key = 'htclk_' + kind + '_' + label;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch (e) {}
    var payload = JSON.stringify({
      kind: kind,
      label: label,
      page: location.pathname + location.search,
      url: location.href,
      title: document.title
    });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/.netlify/functions/pulse-click-notify', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/.netlify/functions/pulse-click-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
      }
    } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest && e.target.closest('a[href], [data-pulse-click], button, .vtile');
    if (!el) return;
    var kind = el.getAttribute('data-pulse-click') || (el.tagName === 'A' ? 'howto-link' : 'howto-click');
    var label = (el.getAttribute('aria-label') || (el.textContent || '').trim() || el.getAttribute('href') || 'element')
      .replace(/\s+/g, ' ').slice(0, 80);
    send(kind, label);
  }, true);
})();
