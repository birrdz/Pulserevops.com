// pulse-qa-trivia — 25s dismissible trivia on Knowledge Q&A pages (q####).
// Answer click (right or wrong) → email owner → navigate to similar Q&A.
(function () {
  var CFG = window.__pulseTrivia;
  if (!CFG || !CFG.sourceId) return;

  var DELAY_MS = 25000;
  var SESSION_KEY = 'pulse_trivia_dismiss_' + CFG.sourceId;
  var NOTIFY_URL = '/.netlify/functions/pulse-trivia-click-notify';

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function shortQ(q) {
    q = String(q || '').replace(/\?+$/, '').trim();
    return q.length > 110 ? q.slice(0, 107) + '…' : q;
  }

  function tokens(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(function (w) {
      return w.length > 2 && !/^(how|what|why|when|where|does|do|the|and|for|with|you|your|our|are|can|should|will|from|into|that|this|have|has|was|were)$/.test(w);
    });
  }

  function jaccard(a, b) {
    var A = new Set(tokens(a));
    var B = new Set(tokens(b));
    if (!A.size || !B.size) return 0;
    var inter = 0;
    A.forEach(function (t) { if (B.has(t)) inter++; });
    return inter / (A.size + B.size - inter);
  }

  function pickTarget(pool) {
    pool = (pool || []).filter(function (c) { return c && c.id && c.id !== CFG.sourceId; });
    if (!pool.length) return null;
    var scored = pool.map(function (c) {
      return { c: c, score: jaccard(CFG.sourceQuestion, c.question) };
    }).sort(function (x, y) { return y.score - x.score; });
    return scored[0].c;
  }

  function buildOptions(target, pool) {
    var wrong = pool.filter(function (c) { return c.id !== target.id; });
    wrong = shuffle(wrong).slice(0, 3);
    return shuffle([{ label: shortQ(target.question), correct: true, target: target }]
      .concat(wrong.map(function (w) {
        return { label: shortQ(w.question), correct: false, target: target };
      })));
  }

  function notifyClick(target, pickedLabel, correct) {
    try {
      var payload = {
        sourceId: CFG.sourceId,
        sourceQuestion: CFG.sourceQuestion,
        sourceUrl: CFG.sourceUrl || location.href,
        targetId: target.id,
        targetQuestion: target.question,
        targetUrl: target.url,
        picked: pickedLabel,
        correct: !!correct,
        ua: String(navigator.userAgent || '').slice(0, 280),
      };
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(NOTIFY_URL, new Blob([body], { type: 'application/json' }));
        return;
      }
      fetch(NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true,
      }).catch(function () {});
    } catch (e) {}
  }

  function navigateTo(target, pickedLabel, correct) {
    notifyClick(target, pickedLabel, correct);
    window.location.href = target.url;
  }

  var root, lastFocus;

  function trapFocus(e) {
    if (!root || e.key !== 'Tab') return;
    var panel = root.querySelector('.pqt-card');
    if (!panel) return;
    var focusable = panel.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function closeModal() {
    if (!root) return;
    document.removeEventListener('keydown', onKey);
    var r = root;
    root = null;
    // Slide it back out, then remove. Passive — no focus restore (don't yank
    // the viewport around on a low-key card).
    r.classList.remove('pqt-in');
    setTimeout(function () { try { r.remove(); } catch (e) {} }, 420);
  }

  function dismiss() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    closeModal();
  }

  function onKey(e) {
    if (e.key === 'Escape') dismiss();
  }

  function injectStyles() {
    if (document.getElementById('pulse-qa-trivia-css')) return;
    var style = document.createElement('style');
    style.id = 'pulse-qa-trivia-css';
    style.textContent = [
      // Low-key, non-blocking slide-in card anchored to the bottom-left — no
      // dimming backdrop, no scroll lock, no focus steal. Slides up + in.
      '#pulse-qa-trivia-root{position:fixed;left:0;bottom:0;z-index:95000;pointer-events:none;padding:0 0 max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));}',
      '#pulse-qa-trivia-root .pqt-card{pointer-events:auto;width:min(360px,calc(100vw - 28px));max-height:min(80vh,560px);overflow:auto;background:#FAF8F4;border:1px solid rgba(192,83,31,.35);border-radius:14px;box-shadow:0 16px 44px rgba(20,20,30,.20);padding:16px 16px 14px;font-family:Inter,system-ui,sans-serif;color:#16161D;-webkit-overflow-scrolling:touch;transform:translateY(140%);opacity:0;transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .45s ease;}',
      '#pulse-qa-trivia-root.pqt-in .pqt-card{transform:translateY(0);opacity:1;}',
      '#pulse-qa-trivia-root .pqt-badge{display:inline-block;font-size:.62rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#C0531F;background:rgba(192,83,31,.1);border:1px solid rgba(192,83,31,.28);border-radius:99px;padding:5px 10px;margin-bottom:10px;}',
      '#pulse-qa-trivia-root .pqt-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px;}',
      '#pulse-qa-trivia-root .pqt-title{margin:0;font-size:1.05rem;line-height:1.35;font-weight:800;color:#16161D;}',
      '#pulse-qa-trivia-root .pqt-x{flex:0 0 auto;min-width:44px;min-height:44px;border:none;background:transparent;color:#8A8BA0;font-size:1.4rem;line-height:1;cursor:pointer;border-radius:8px;}',
      '#pulse-qa-trivia-root .pqt-x:focus-visible,#pulse-qa-trivia-root .pqt-opt:focus-visible,#pulse-qa-trivia-root .pqt-skip:focus-visible{outline:2px solid #C0531F;outline-offset:2px;}',
      '#pulse-qa-trivia-root .pqt-lead{margin:0 0 14px;font-size:1rem;line-height:1.5;color:#23232e;}',
      '#pulse-qa-trivia-root .pqt-opts{display:flex;flex-direction:column;gap:10px;}',
      '#pulse-qa-trivia-root .pqt-opt{min-height:44px;text-align:left;padding:12px 14px;border-radius:10px;border:1px solid rgba(20,20,30,.12);background:#fff;color:#16161D;font:inherit;font-size:1rem;line-height:1.35;font-weight:600;cursor:pointer;}',
      '#pulse-qa-trivia-root .pqt-opt:hover{border-color:rgba(192,83,31,.55);}',
      '#pulse-qa-trivia-root .pqt-foot{margin-top:14px;display:flex;justify-content:flex-end;}',
      '#pulse-qa-trivia-root .pqt-skip{min-height:44px;padding:10px 14px;border:none;background:transparent;color:#8A8BA0;font:inherit;font-size:.86rem;font-weight:700;cursor:pointer;border-radius:8px;}',
      '@media(max-width:600px){#pulse-qa-trivia-root{left:0;right:0;padding:0;}#pulse-qa-trivia-root .pqt-card{width:100%;max-width:none;border-radius:14px 14px 0 0;max-height:78vh;padding-bottom:max(16px,env(safe-area-inset-bottom));}}',
      '@media(prefers-reduced-motion:reduce){#pulse-qa-trivia-root .pqt-card{transition:none!important;transform:none!important;opacity:1!important;}}',
    ].join('');
    document.head.appendChild(style);
  }

  function showModal(target, options) {
    injectStyles();
    lastFocus = document.activeElement;
    root = document.createElement('div');
    root.id = 'pulse-qa-trivia-root';
    root.setAttribute('role', 'complementary');
    root.setAttribute('aria-label', 'Related question');

    var html = '<div class="pqt-card">'
      + '<div class="pqt-head"><div><span class="pqt-badge">Quick check</span>'
      + '<h2 class="pqt-title" id="pqt-title">Which related RevOps question is next?</h2></div>'
      + '<button type="button" class="pqt-x" aria-label="Dismiss trivia">×</button></div>'
      + '<p class="pqt-lead">Pick the best match — we\'ll open the full answer either way.</p>'
      + '<div class="pqt-opts">';
    options.forEach(function (opt, i) {
      html += '<button type="button" class="pqt-opt" data-idx="' + i + '">' + esc(opt.label) + '</button>';
    });
    html += '</div><div class="pqt-foot"><button type="button" class="pqt-skip">Skip for now</button></div></div>';

    root.innerHTML = html;
    document.body.appendChild(root);
    // Trigger the slide-in on the next frame (so the transition runs). No scroll
    // lock, no focus trap, no focus steal — it's a passive, low-key card.
    requestAnimationFrame(function () { if (root) root.classList.add('pqt-in'); });
    document.addEventListener('keydown', onKey);

    root.querySelector('.pqt-x').addEventListener('click', dismiss);
    root.querySelector('.pqt-skip').addEventListener('click', dismiss);

    root.querySelectorAll('.pqt-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        var opt = options[idx];
        if (!opt || btn.disabled) return;
        btn.disabled = true;
        navigateTo(target, opt.label, opt.correct);
      });
    });

  }

  function start() {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch (e) { return; }

    var pool = (CFG.candidates || []).filter(function (c) { return c && c.id && c.id !== CFG.sourceId; });
    if (pool.length < 3) return;

    var target = pickTarget(pool);
    if (!target) return;
    var options = buildOptions(target, pool);
    if (options.length < 4) return;

    setTimeout(function () {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return;
      } catch (e) { return; }
      showModal(target, options);
    }, DELAY_MS);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
