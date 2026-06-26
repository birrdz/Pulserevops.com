/* pulse-engage — answer-page engagement: "Was this helpful? 👍/👎" + an
   "Ask a follow-up" box. Vote logs to entry-feedback (no cost). Follow-up sends
   the visitor to The Machine (/themachine) with their question prefilled, which
   feeds the visitor-question pipeline (a question becomes a new answer page).
   No open comment thread → nothing to moderate, no spam surface. */
(function () {
  var sec = document.querySelector('.pulse-engage[data-eid]');
  if (!sec) return;
  var id = sec.getAttribute('data-eid');

  // --- helpful vote ---
  var voteKey = 'pulse_vote_' + id;
  var msg = sec.querySelector('.pe-vote-msg');
  var voted = false;
  try { voted = !!sessionStorage.getItem(voteKey); } catch (e) {}
  if (voted && msg) msg.textContent = 'Thanks for the feedback!';
  sec.querySelectorAll('.pe-vote').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (voted) return;
      voted = true;
      try { sessionStorage.setItem(voteKey, '1'); } catch (e) {}
      var v = btn.getAttribute('data-v');
      if (msg) msg.textContent = v === 'yes' ? 'Glad it helped! 🙌' : 'Thanks — we’ll keep improving it.';
      sec.querySelectorAll('.pe-vote').forEach(function (b) { b.disabled = true; b.style.opacity = '.55'; });
      try {
        var payload = JSON.stringify({ id: id, vote: v });
        if (navigator.sendBeacon) navigator.sendBeacon('/.netlify/functions/entry-feedback', new Blob([payload], { type: 'application/json' }));
        else fetch('/.netlify/functions/entry-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
      } catch (e) {}
    });
  });

  // --- follow-up question ---
  var form = sec.querySelector('.pe-follow');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('.pe-q');
      var q = (input && input.value || '').trim();
      if (q.length < 4) { if (input) input.focus(); return; }
      // Email the owner that a visitor submitted a follow-up (with the question
      // + the page they were on). Beacon so it fires even as we navigate away.
      try {
        var notify = JSON.stringify({ kind: 'followup', note: q, id: id, url: location.href, title: document.title });
        if (navigator.sendBeacon) navigator.sendBeacon('/.netlify/functions/pulse-click-notify', new Blob([notify], { type: 'application/json' }));
        else fetch('/.netlify/functions/pulse-click-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: notify, keepalive: true });
      } catch (e) {}
      // Hand off to The Machine with the question prefilled — it answers live
      // via DeepSeek (pay-as-you-go) and the question enters the pipeline.
      window.location.href = '/themachine?q=' + encodeURIComponent(q);
    });
  }
})();
