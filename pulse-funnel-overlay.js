// ════════════════════════════════════════════════════════════════════════
// pulse-funnel-overlay — site-wide newsletter + sponsor surfaces only.
// One drop-in script that injects:
//   1. Exit-intent newsletter modal (Beehiiv-wired)
//   (Hire-Kory + Fractional CRO CTAs REMOVED 2026-06-02 per owner: "CRO
//   Syndicate contractor — no service pricing, no implied fractional offer.")
//
// Idempotent — safe to load twice. Dismissable per-session via sessionStorage.
// ════════════════════════════════════════════════════════════════════════
(function () {
  'use strict';
  if (window.__pulseFunnelOverlay) return;
  window.__pulseFunnelOverlay = true;

  // Hide on admin / internal paths
  var pathname = location.pathname || '/';
  var hide = /\/(admin|queue|dashboard|intent|sports|teams|cities|reps|emails|feedback)(\b|\/|\.html)/i.test(pathname);
  if (hide) return;

  var css = ''
    + '#pfo-eim,.pfo-stick{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}'
    + '#pfo-eim-backdrop{position:fixed;inset:0;z-index:99998;background:rgba(8,11,16,0.78);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:20px;}'
    + '#pfo-eim-backdrop.is-open{display:flex;animation:pfoFadeIn .25s ease;}'
    + '@keyframes pfoFadeIn{from{opacity:0;}to{opacity:1;}}'
    + '#pfo-eim{position:relative;max-width:520px;width:100%;background:linear-gradient(155deg,rgba(17,21,28,0.98),rgba(10,14,20,0.99));border:1px solid rgba(255,107,48,0.45);border-radius:18px;padding:32px 30px 26px;box-shadow:0 28px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,107,48,0.08);color:#EDE5D8;}'
    + '#pfo-eim-close{position:absolute;top:14px;right:16px;background:none;border:none;color:rgba(237,229,216,0.5);font-size:24px;line-height:1;cursor:pointer;padding:4px 8px;}'
    + '#pfo-eim-close:hover{color:#FFB870;}'
    + '#pfo-eim .e-eyebrow{font-size:0.62rem;font-weight:900;letter-spacing:0.22em;text-transform:uppercase;color:#FF6B30;margin-bottom:14px;}'
    + '#pfo-eim h3{font-size:1.42rem;font-weight:800;line-height:1.22;margin:0 0 12px;color:#fff;letter-spacing:-0.01em;}'
    + '#pfo-eim p{font-size:0.93rem;line-height:1.55;color:rgba(237,229,216,0.72);margin:0 0 22px;}'
    + '#pfo-eim form{display:flex;gap:8px;flex-wrap:wrap;}'
    + '#pfo-eim input[type=email]{flex:1 1 240px;min-width:0;background:rgba(0,0,0,0.45);border:1px solid rgba(237,229,216,0.18);border-radius:10px;color:#fff;font-family:inherit;font-size:0.95rem;padding:13px 14px;outline:none;}'
    + '#pfo-eim input[type=email]:focus{border-color:#FF6B30;box-shadow:0 0 0 3px rgba(255,107,48,0.18);}'
    + '#pfo-eim button[type=submit]{background:linear-gradient(135deg,#FF6B30,#D95520);color:#0a0e14;border:none;border-radius:10px;font-family:inherit;font-size:0.84rem;font-weight:900;letter-spacing:0.06em;text-transform:uppercase;padding:13px 22px;cursor:pointer;box-shadow:0 8px 22px rgba(255,107,48,0.32);transition:transform .1s,box-shadow .15s;}'
    + '#pfo-eim button[type=submit]:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(255,107,48,0.4);}'
    + '#pfo-eim .e-foot{margin-top:16px;font-size:0.72rem;color:rgba(237,229,216,0.45);letter-spacing:0.04em;}'
    + '#pfo-eim .e-msg{margin-top:12px;font-size:0.85rem;color:#FFB870;min-height:1.2em;}';

  var styleEl = document.createElement('style');
  styleEl.id = 'pfo-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── EXIT-INTENT NEWSLETTER MODAL ─────────────────────────────────────
  function buildEimDom() {
    var bd = document.createElement('div');
    bd.id = 'pfo-eim-backdrop';
    bd.innerHTML =
      '<div id="pfo-eim" role="dialog" aria-modal="true" aria-labelledby="pfo-eim-title">' +
        '<button id="pfo-eim-close" aria-label="Close">&times;</button>' +
        '<div class="e-eyebrow">&#10070; The RevOps Operator&apos;s Weekly</div>' +
        '<h3 id="pfo-eim-title">Before you go &mdash; one email a week, no fluff.</h3>' +
        '<p>The 5 best RevOps reads of the week plus one operator-grade take. No spam. No upsell. Just the work.</p>' +
        '<form id="pfo-eim-form">' +
          '<input type="email" name="email" placeholder="you@company.com" required autocomplete="email">' +
          '<button type="submit">Subscribe &rarr;</button>' +
        '</form>' +
        '<div class="e-msg" id="pfo-eim-msg"></div>' +
        '<div class="e-foot">Free. Unsubscribe anytime. Read by RevOps leaders at SaaS, services, and PE-backed teams.</div>' +
      '</div>';
    document.body.appendChild(bd);
    return bd;
  }

  var eimShown = false;
  var EIM_KEY = 'pulse_eim_dismissed';
  function shouldShowEim() {
    if (eimShown) return false;
    try { if (sessionStorage.getItem(EIM_KEY)) return false; } catch (_) {}
    return true;
  }
  function showEim() {
    if (!shouldShowEim()) return;
    eimShown = true;
    var bd = document.getElementById('pfo-eim-backdrop') || buildEimDom();
    bd.classList.add('is-open');
    var input = bd.querySelector('input[type=email]');
    setTimeout(function () { try { input.focus(); } catch (_) {} }, 100);
  }
  function dismissEim() {
    var bd = document.getElementById('pfo-eim-backdrop');
    if (bd) bd.classList.remove('is-open');
    try { sessionStorage.setItem(EIM_KEY, '1'); } catch (_) {}
  }
  document.addEventListener('mouseout', function (e) {
    if (e.relatedTarget || e.toElement) return;
    if (e.clientY > 30) return;
    showEim();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var bd = document.getElementById('pfo-eim-backdrop');
      if (bd && bd.classList.contains('is-open')) dismissEim();
    }
  });
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'pfo-eim-close') return dismissEim();
    if (e.target && e.target.id === 'pfo-eim-backdrop') return dismissEim();
  });
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'pfo-eim-form') return;
    e.preventDefault();
    var input = e.target.querySelector('input[type=email]');
    var msg = document.getElementById('pfo-eim-msg');
    var email = (input && input.value || '').trim();
    if (!email) return;
    msg.textContent = 'Subscribing…';
    fetch('/.netlify/functions/pulse-subscribe-relay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'exit-intent', page: location.pathname }),
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        msg.textContent = '✓ You\'re in. First email lands Monday.';
        if (input) input.value = '';
        setTimeout(dismissEim, 2400);
      })
      .catch(function () {
        msg.textContent = 'Saved. We\'ll catch you up.';
        setTimeout(dismissEim, 2000);
      });
  });
})();
