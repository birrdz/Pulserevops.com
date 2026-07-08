// pulse-trivia-game — site-wide PULSE Trivia. A question pops up at a random
// interval between 5 and 15 minutes (persisted across navigation), styled to the
// site. Mix of Pulse/business questions + pop culture. Tracks a running score and
// posts to a cloud leaderboard (/.netlify/functions/pulse-trivia-score).
// QA: append ?trivia=now to any URL to trigger immediately.
(function () {
  'use strict';
  if (window.__pulseTriviaGame) return; window.__pulseTriviaGame = 1;

  var SCORE_URL = '/.netlify/functions/pulse-trivia-score';
  var MIN_MS = 5 * 60 * 1000, MAX_MS = 15 * 60 * 1000;
  var LS_NEXT = 'pulse_trivia_next', LS_SCORE = 'pulse_trivia_score', LS_NAME = 'pulse_trivia_name', LS_DONE = 'pulse_trivia_done', LS_SCORE_DAY = 'pulse_trivia_score_day';
  function lday() { return new Date().toLocaleDateString('en-CA'); } // local YYYY-MM-DD

  // ── Question bank — [question, [4 options], correctIndex, category] ──────
  var BANK = [
    // Pulse / business
    ['What does “CRO” stand for in business?', ['Chief Revenue Officer', 'Customer Relations Officer', 'Chief Risk Officer', 'Client Retention Operator'], 0, 'Pulse'],
    ['“NRR” measures a company’s…', ['Net Revenue Retention', 'New Reps Ratio', 'Net Refund Rate', 'Nominal Run Rate'], 0, 'Pulse'],
    ['“GTM” is short for…', ['Go-To-Market', 'Gross Total Margin', 'Growth Tracking Model', 'Global Trade Metric'], 0, 'Pulse'],
    ['What does “SaaS” stand for?', ['Software as a Service', 'Sales and Support', 'Systems and Servers', 'Scalable App Stack'], 0, 'Pulse'],
    ['In sales, an “SDR” is a…', ['Sales Development Rep', 'Senior Data Reviewer', 'Service Desk Rep', 'Sales Director'], 0, 'Pulse'],
    ['“ARR” stands for…', ['Annual Recurring Revenue', 'Average Revenue Rate', 'Annual Return Ratio', 'Active Rep Roster'], 0, 'Pulse'],
    ['A “fractional” executive typically works…', ['Part-time across companies', 'Only weekends', 'For free', 'Only at startups'], 0, 'Pulse'],
    ['“KPI” stands for…', ['Key Performance Indicator', 'Known Profit Index', 'Key Pipeline Input', 'Core Priority Item'], 0, 'Pulse'],
    ['“CAC” is the cost to…', ['Acquire a customer', 'Audit a contract', 'Calculate ARR', 'Close a quarter'], 0, 'Pulse'],
    ['In RevOps, “churn” refers to…', ['Customers who cancel', 'New signups', 'Upsells', 'Refund delays'], 0, 'Pulse'],
    ['Which Pulse category covers Cars, Boats & Electronics?', ['Buying Guides', 'Living', 'Watch & Play', 'Home & Property'], 0, 'Pulse'],
    ['“MRR” means…', ['Monthly Recurring Revenue', 'Maximum Rep Rate', 'Mid Range Revenue', 'Monthly Refund Rate'], 0, 'Pulse'],
    ['“B2B” means selling primarily to…', ['Other businesses', 'Babies', 'Brokers only', 'Banks only'], 0, 'Pulse'],
    ['A sales “pipeline” tracks…', ['Deals in progress', 'Office plumbing', 'Server uptime', 'Payroll'], 0, 'Pulse'],
    // Pop culture / general
    ['Which planet is known as the Red Planet?', ['Mars', 'Venus', 'Jupiter', 'Saturn'], 0, 'Pop'],
    ['How many strings does a standard guitar have?', ['6', '4', '5', '7'], 0, 'Pop'],
    ['Who painted the Mona Lisa?', ['Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Michelangelo'], 0, 'Pop'],
    ['What is the largest ocean on Earth?', ['Pacific', 'Atlantic', 'Indian', 'Arctic'], 0, 'Pop'],
    ['In Star Wars, Han Solo’s ship is the…', ['Millennium Falcon', 'X-Wing', 'Star Destroyer', 'Slave I'], 0, 'Pop'],
    ['Which company makes the iPhone?', ['Apple', 'Samsung', 'Google', 'Sony'], 0, 'Pop'],
    ['How many players per team are on a basketball court?', ['5', '6', '7', '9'], 0, 'Pop'],
    ['Mixing blue and yellow paint makes…', ['Green', 'Purple', 'Orange', 'Brown'], 0, 'Pop'],
    ['Which superhero is the “Caped Crusader”?', ['Batman', 'Superman', 'Spider-Man', 'Iron Man'], 0, 'Pop'],
    ['Chemical symbol for gold?', ['Au', 'Gd', 'Go', 'Ag'], 0, 'Pop'],
    ['Which show features the “Upside Down”?', ['Stranger Things', 'The Witcher', 'Dark', 'Lost'], 0, 'Pop'],
    ['The Summer Olympics are held every…', ['4 years', '2 years', '3 years', '5 years'], 0, 'Pop'],
    ['What is the tallest land animal?', ['Giraffe', 'Elephant', 'Horse', 'Moose'], 0, 'Pop'],
    ['Which chain has the “Golden Arches”?', ['McDonald’s', 'Burger King', 'Wendy’s', 'Subway'], 0, 'Pop'],
    ['How many continents are there?', ['7', '5', '6', '8'], 0, 'Pop'],
    ['What gas do plants mainly absorb?', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Helium'], 0, 'Pop']
  ];

  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function shuffleIdx(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); for (var i2 = n - 1; i2 > 0; i2--) { var j = Math.floor(Math.random() * (i2 + 1)); var t = a[i2]; a[i2] = a[j]; a[j] = t; } return a; }
  function getScore() { try { if (localStorage.getItem(LS_SCORE_DAY) !== lday()) { localStorage.setItem(LS_SCORE_DAY, lday()); localStorage.setItem(LS_SCORE, '0'); } } catch (e) {} return parseInt(localStorage.getItem(LS_SCORE) || '0', 10) || 0; }
  function setScore(v) { try { localStorage.setItem(LS_SCORE, String(v)); } catch (e) {} }
  function doneSet() { try { return new Set(JSON.parse(localStorage.getItem(LS_DONE) || '[]')); } catch (e) { return new Set(); } }
  function markDone(i) { try { var s = doneSet(); s.add(i); if (s.size >= BANK.length) s = new Set([i]); localStorage.setItem(LS_DONE, JSON.stringify([].concat.apply([], [Array.from(s)]))); } catch (e) {} }

  function pickQuestion() {
    var done = doneSet();
    var avail = [];
    for (var i = 0; i < BANK.length; i++) if (!done.has(i)) avail.push(i);
    if (!avail.length) { for (var k = 0; k < BANK.length; k++) avail.push(k); }
    return avail[Math.floor(Math.random() * avail.length)];
  }

  // ── styles ──────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('pulse-trivia-css')) return;
    var s = document.createElement('style'); s.id = 'pulse-trivia-css';
    s.textContent = [
      '#pulse-trivia-root{position:fixed;right:0;bottom:0;z-index:96000;pointer-events:none;padding:0 max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) 0;font-family:Inter,system-ui,sans-serif}',
      '#pulse-trivia-root .ptg{pointer-events:auto;width:min(380px,calc(100vw - 28px));max-height:min(86vh,640px);overflow:auto;background:#ECE3D2;border:1px solid rgba(203,161,53,.5);border-radius:16px;box-shadow:0 18px 50px rgba(29,23,17,.30);padding:18px;color:#1d1711;transform:translateY(140%);opacity:0;transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .4s ease}',
      '#pulse-trivia-root.in .ptg{transform:translateY(0);opacity:1}',
      '#pulse-trivia-root .ptg-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}',
      '#pulse-trivia-root .ptg-badge{font-family:Fraunces,Georgia,serif;font-size:.66rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:linear-gradient(135deg,#C8821E,#CBA135);border-radius:99px;padding:5px 11px}',
      '#pulse-trivia-root .ptg-score{font-size:.74rem;font-weight:700;color:#8a7a63}',
      '#pulse-trivia-root .ptg-x{min-width:34px;min-height:34px;border:none;background:transparent;color:#8a7a63;font-size:1.4rem;line-height:1;cursor:pointer;border-radius:8px}',
      '#pulse-trivia-root h2.ptg-q{font-family:Fraunces,Georgia,serif;margin:2px 0 14px;font-size:1.18rem;line-height:1.3;font-weight:700;color:#1d1711}',
      '#pulse-trivia-root .ptg-opts{display:flex;flex-direction:column;gap:9px}',
      '#pulse-trivia-root .ptg-opt{text-align:left;min-height:44px;padding:11px 13px;border-radius:11px;border:1px solid rgba(29,23,17,.14);background:#FBF8F1;color:#1d1711;font:inherit;font-size:.96rem;font-weight:600;cursor:pointer;transition:border-color .12s,background .12s}',
      '#pulse-trivia-root .ptg-opt:hover{border-color:#C8821E;background:#fff}',
      '#pulse-trivia-root .ptg-opt.right{border-color:#3C8C3F;background:#e8f3e6;color:#1f5121}',
      '#pulse-trivia-root .ptg-opt.wrong{border-color:#B23A2E;background:#f6e4e1;color:#7a241b}',
      '#pulse-trivia-root .ptg-opt:disabled{cursor:default}',
      '#pulse-trivia-root .ptg-result{font-size:1rem;font-weight:700;margin:2px 0 12px}',
      '#pulse-trivia-root .ptg-result .pts{color:#C8821E}',
      '#pulse-trivia-root .ptg-row{display:flex;gap:8px;margin:12px 0 4px}',
      '#pulse-trivia-root .ptg-name{flex:1;min-height:42px;padding:9px 12px;border-radius:10px;border:1px solid rgba(29,23,17,.18);background:#fff;font:inherit;font-size:.95rem;color:#1d1711}',
      '#pulse-trivia-root .ptg-save{min-height:42px;padding:9px 16px;border:none;border-radius:10px;background:#1d1711;color:#fff;font:inherit;font-weight:700;cursor:pointer}',
      '#pulse-trivia-root .ptg-lb{margin-top:12px;border-top:1px solid rgba(29,23,17,.12);padding-top:10px}',
      '#pulse-trivia-root .ptg-lb h3{font-family:Fraunces,Georgia,serif;margin:0 0 8px;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:#C8821E}',
      '#pulse-trivia-root .ptg-lb ol{margin:0;padding:0;list-style:none;counter-reset:lb}',
      '#pulse-trivia-root .ptg-lb li{counter-increment:lb;display:flex;justify-content:space-between;gap:10px;font-size:.9rem;padding:3px 0;color:#4a3f30}',
      '#pulse-trivia-root .ptg-lb li::before{content:counter(lb) ".";color:#8a7a63;font-weight:700;margin-right:6px}',
      '#pulse-trivia-root .ptg-lb li .nm{flex:1;font-weight:600;color:#1d1711;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#pulse-trivia-root .ptg-lb li.me{color:#C8821E}',
      '#pulse-trivia-root .ptg-foot{margin-top:12px;text-align:right}',
      '#pulse-trivia-root .ptg-close{min-height:40px;padding:9px 14px;border:none;background:transparent;color:#8a7a63;font:inherit;font-size:.86rem;font-weight:700;cursor:pointer}',
      '@media(max-width:600px){#pulse-trivia-root{left:0;right:0;padding:0}#pulse-trivia-root .ptg{width:100%;border-radius:16px 16px 0 0;max-height:82vh}}',
      '@media(prefers-reduced-motion:reduce){#pulse-trivia-root .ptg{transition:none!important;transform:none!important;opacity:1!important}}'
    ].join('');
    document.head.appendChild(s);
  }

  var root;
  function close() { if (!root) return; var r = root; root = null; r.classList.remove('in'); setTimeout(function () { try { r.remove(); } catch (e) {} }, 420); }

  function render(inner) {
    injectStyles();
    if (!root) { root = document.createElement('div'); root.id = 'pulse-trivia-root'; root.setAttribute('role', 'complementary'); root.setAttribute('aria-label', 'Pulse Trivia'); document.body.appendChild(root); }
    root.innerHTML = '<div class="ptg">' + inner + '</div>';
    requestAnimationFrame(function () { if (root) root.classList.add('in'); });
    var x = root.querySelector('.ptg-x'); if (x) x.addEventListener('click', close);
    var c = root.querySelector('.ptg-close'); if (c) c.addEventListener('click', close);
  }

  function showQuestion() {
    var qi = pickQuestion(); var item = BANK[qi];
    var order = shuffleIdx(4);
    var head = '<div class="ptg-head"><span class="ptg-badge">Pulse Trivia · ' + esc(item[3]) + '</span>'
      + '<span class="ptg-score">Score ' + getScore() + '</span>'
      + '<button class="ptg-x" type="button" aria-label="Close">×</button></div>';
    var opts = '<div class="ptg-opts">';
    order.forEach(function (oi) { opts += '<button class="ptg-opt" type="button" data-oi="' + oi + '">' + esc(item[1][oi]) + '</button>'; });
    opts += '</div>';
    render(head + '<h2 class="ptg-q">' + esc(item[0]) + '</h2>' + opts);
    var btns = root.querySelectorAll('.ptg-opt');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var oi = parseInt(btn.getAttribute('data-oi'), 10);
        var correct = oi === item[2];
        btns.forEach(function (b) { b.disabled = true; var bi = parseInt(b.getAttribute('data-oi'), 10); if (bi === item[2]) b.classList.add('right'); else if (b === btn) b.classList.add('wrong'); });
        markDone(qi);
        var gained = correct ? 10 : 0;
        if (correct) setScore(getScore() + gained);
        setTimeout(function () { showResult(correct, gained); }, 850);
      });
    });
  }

  function showResult(correct, gained) {
    var total = getScore();
    var name = '';
    try { name = localStorage.getItem(LS_NAME) || ''; } catch (e) {}
    var head = '<div class="ptg-head"><span class="ptg-badge">' + (correct ? 'Correct! +' + gained : 'Good try') + '</span>'
      + '<span class="ptg-score">Score ' + total + '</span>'
      + '<button class="ptg-x" type="button" aria-label="Close">×</button></div>';
    var body = '<div class="ptg-result">' + (correct ? 'Nice — <span class="pts">+' + gained + ' points</span>.' : 'No points this time.') + ' Your total: <span class="pts">' + total + '</span></div>'
      + '<div class="ptg-row"><input class="ptg-name" maxlength="14" placeholder="Your name / initials" value="' + esc(name) + '"><button class="ptg-save" type="button">Save</button></div>'
      + '<div class="ptg-lb"><h3>Today’s leaderboard</h3><div class="ptg-lb-body">Loading…</div></div>'
      + '<div class="ptg-foot"><button class="ptg-close" type="button">Another in a few min →</button></div>';
    render(head + body);
    var saveBtn = root.querySelector('.ptg-save');
    var nameEl = root.querySelector('.ptg-name');
    saveBtn.addEventListener('click', function () { submit((nameEl.value || '').trim()); });
    loadBoard(null);
  }

  function loadBoard(myName) {
    var box = root && root.querySelector('.ptg-lb-body'); if (!box) return;
    fetch(SCORE_URL, { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!root) return; box = root.querySelector('.ptg-lb-body'); if (!box) return;
      var top = (d && d.top) || [];
      if (!top.length) { box.innerHTML = '<div style="font-size:.86rem;color:#8a7a63">Be the first on the board — save your score!</div>'; return; }
      var mine = (myName || '').toLowerCase();
      box.innerHTML = '<ol>' + top.slice(0, 8).map(function (s) {
        var me = mine && s.name.toLowerCase() === mine ? ' class="me"' : '';
        return '<li' + me + '><span class="nm">' + esc(s.name) + '</span><span>' + s.score + '</span></li>';
      }).join('') + '</ol>';
    }).catch(function () {});
  }

  function submit(name) {
    if (!name) { var el = root.querySelector('.ptg-name'); if (el) el.focus(); return; }
    try { localStorage.setItem(LS_NAME, name); } catch (e) {}
    var btn = root.querySelector('.ptg-save'); if (btn) { btn.disabled = true; btn.textContent = 'Saved'; }
    fetch(SCORE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, score: getScore() }) })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.top && root) { var box = root.querySelector('.ptg-lb-body'); if (box) { var mine = name.toLowerCase(); box.innerHTML = '<ol>' + d.top.slice(0, 8).map(function (s) { var me = s.name.toLowerCase() === mine ? ' class="me"' : ''; return '<li' + me + '><span class="nm">' + esc(s.name) + '</span><span>' + s.score + '</span></li>'; }).join('') + '</ol>' + (d.rank ? '<div style="font-size:.82rem;color:#C8821E;margin-top:6px;font-weight:700">Your rank: #' + d.rank + '</div>' : ''); } } })
      .catch(function () {});
  }

  // ── scheduling: a question every 5–15 min, persisted across navigation ───
  function scheduleNext(fromNow) { var at = Date.now() + (fromNow != null ? fromNow : rand(MIN_MS, MAX_MS)); try { localStorage.setItem(LS_NEXT, String(at)); } catch (e) {} return at; }
  function tick() {
    var next = parseInt(localStorage.getItem(LS_NEXT) || '0', 10) || 0;
    var now = Date.now();
    if (!next) { scheduleNext(); return setTimeout(tick, 30000); }
    if (now >= next) { if (!root) { showQuestion(); scheduleNext(); } return setTimeout(tick, 30000); }
    var wait = Math.min(next - now, 30000);
    return setTimeout(tick, wait);
  }

  function boot() {
    if (/[?&]trivia=now\b/.test(location.search)) { setTimeout(showQuestion, 800); scheduleNext(); }
    if (!localStorage.getItem(LS_NEXT)) scheduleNext();
    setTimeout(tick, 2000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
