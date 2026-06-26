/* Pulse Yup/Nope — theatrical IP-based voting (25/day). Keeps popular entries
 * front-and-center: a Yup bubbles an entry up its category list.
 *
 * Public API (used by pillar-page.js for card buttons + re-sorting):
 *   PulseVote.ready(cb)          — cb() once scores+remaining loaded
 *   PulseVote.score(id)          — community score (yups - nopes) from cache
 *   PulseVote.remaining()        — votes left today
 *   PulseVote.cast(id, dir, el)  — POST a vote, play the show, update cache
 *   document 'pulse-vote' event  — { detail:{id, dir, y, n, score, remaining} }
 *
 * Auto-renders a Yup/Nope bar into any [data-pulse-vote="<id>"] container
 * (entry pages), and a floating "votes left" HUD.
 */
(function () {
  var API = '/.netlify/functions/pulse-vote';
  var scores = {};        // { id: {y,n} }
  var remain = 25, CAP = 25;
  var loaded = false, readyCbs = [];
  var ORANGE = '#E25C29';

  function $(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function scoreOf(id) { var s = scores[id]; return s ? (s.y || 0) - (s.n || 0) : 0; }

  function injectCSS() {
    if (document.getElementById('pulse-vote-css')) return;
    var css =
      '.pv-bar{display:inline-flex;gap:10px;align-items:center;flex-wrap:wrap}' +
      '.pv-btn{display:inline-flex;align-items:center;gap:7px;border:2px solid;border-radius:999px;padding:9px 16px;font:800 13px/1 "Plus Jakarta Sans",system-ui,sans-serif;cursor:pointer;background:#fff;transition:transform .1s,box-shadow .15s,background .15s;-webkit-tap-highlight-color:transparent;user-select:none}' +
      '.pv-btn:active{transform:scale(.92)}' +
      '.pv-yup{border-color:#16A34A;color:#16A34A}.pv-yup:hover{background:#16A34A;color:#fff;box-shadow:0 6px 18px rgba(22,163,74,.3)}' +
      '.pv-nope{border-color:#DC2626;color:#DC2626}.pv-nope:hover{background:#DC2626;color:#fff;box-shadow:0 6px 18px rgba(220,38,38,.3)}' +
      '.pv-btn[disabled]{opacity:.4;cursor:not-allowed}' +
      '.pv-cnt{font-variant-numeric:tabular-nums;min-width:1.2em;text-align:center}' +
      '.pv-score{display:inline-flex;align-items:center;gap:5px;font:800 12px/1 "Plus Jakarta Sans",system-ui,sans-serif;color:' + ORANGE + ';background:rgba(226,92,41,.10);border:1px solid rgba(226,92,41,.25);border-radius:999px;padding:5px 11px}' +
      '.pv-hud{position:fixed;right:14px;bottom:14px;z-index:9998;display:inline-flex;align-items:center;gap:8px;background:#16161D;color:#fff;border-radius:999px;padding:9px 15px;font:800 12px/1 "Plus Jakarta Sans",system-ui,sans-serif;box-shadow:0 8px 26px rgba(0,0,0,.32);cursor:default}' +
      '.pv-hud .pv-fire{font-size:15px;filter:drop-shadow(0 0 4px rgba(255,140,0,.7))}' +
      '.pv-hud b{color:#FFB870}' +
      '.pv-fly{position:fixed;z-index:9999;pointer-events:none;font:900 15px/1 "Plus Jakarta Sans",system-ui,sans-serif;will-change:transform,opacity}' +
      '@keyframes pv-rise{0%{transform:translate(-50%,0) scale(.6);opacity:0}15%{opacity:1}100%{transform:translate(-50%,-90px) scale(1.25);opacity:0}}' +
      '.pv-burst{position:fixed;z-index:9999;left:0;top:0;pointer-events:none;font-size:22px;will-change:transform,opacity}' +
      '@keyframes pv-shout{0%{transform:translate(-50%,-50%) scale(.3) rotate(-8deg);opacity:0}25%{transform:translate(-50%,-50%) scale(1.25) rotate(3deg);opacity:1}70%{opacity:1}100%{transform:translate(-50%,-130%) scale(1) rotate(0);opacity:0}}' +
      '.pv-shout{position:fixed;z-index:10000;pointer-events:none;font:900 42px/1 "Plus Jakarta Sans",system-ui,sans-serif;text-shadow:0 4px 18px rgba(0,0,0,.25);animation:pv-shout 1s cubic-bezier(.2,.9,.2,1) forwards}' +
      '@keyframes pv-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}' +
      '.pv-shake{animation:pv-shake .5s}' +
      '.pv-flash{position:fixed;inset:0;z-index:9997;pointer-events:none;opacity:0}' +
      '@keyframes pv-flash{0%{opacity:.0}30%{opacity:.18}100%{opacity:0}}';
    var st = $('style'); st.id = 'pulse-vote-css'; st.textContent = css; document.head.appendChild(st);
  }

  function hud() {
    var el = document.getElementById('pv-hud');
    if (!el) { el = $('div', 'pv-hud'); el.id = 'pv-hud'; document.body.appendChild(el); }
    if (remain > 0) el.innerHTML = '<span class="pv-fire">🔥</span> <b>' + remain + '</b>&nbsp;Yup/Nope votes left today';
    else el.innerHTML = '<span class="pv-fire">😴</span> Out of votes — <b>+25</b>&nbsp;tomorrow!';
  }

  function confetti(x, y, up) {
    var emojis = up ? ['🎉', '👍', '🔥', '⭐', '✅', '🟢'] : ['💥', '👎', '🔻', '🟥'];
    for (var i = 0; i < 14; i++) {
      (function (i) {
        var p = $('div', 'pv-burst', emojis[i % emojis.length]);
        p.style.left = x + 'px'; p.style.top = y + 'px';
        document.body.appendChild(p);
        var ang = (Math.PI * (up ? -1 : 1)) * (0.15 + Math.random() * 0.7) - (up ? 0 : 0);
        var dist = 60 + Math.random() * 120;
        var dx = (Math.random() - 0.5) * 220;
        var dy = (up ? -1 : 1) * dist;
        var rot = (Math.random() - 0.5) * 360;
        p.animate(
          [{ transform: 'translate(-50%,-50%) rotate(0deg)', opacity: 1 },
           { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg)', opacity: 0 }],
          { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' }
        ).onfinish = function () { p.remove(); };
      })(i);
    }
  }

  function show(dir, originEl) {
    injectCSS();
    var r = originEl && originEl.getBoundingClientRect ? originEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var up = dir === 'yup';
    // screen flash
    var fl = $('div', 'pv-flash'); fl.style.background = up ? '#16A34A' : '#DC2626';
    fl.style.animation = 'pv-flash .6s forwards'; document.body.appendChild(fl);
    setTimeout(function () { fl.remove(); }, 650);
    // big shout
    var sh = $('div', 'pv-shout', up ? 'YUP! 👍' : 'NOPE! 👎');
    sh.style.left = cx + 'px'; sh.style.top = cy + 'px'; sh.style.color = up ? '#16A34A' : '#DC2626';
    document.body.appendChild(sh); setTimeout(function () { sh.remove(); }, 1000);
    // +1 float
    var fly = $('div', 'pv-fly', up ? '+1 🔼' : '−1 🔽');
    fly.style.left = cx + 'px'; fly.style.top = (cy - 8) + 'px'; fly.style.color = up ? '#16A34A' : '#DC2626';
    fly.style.animation = 'pv-rise 1s forwards'; document.body.appendChild(fly);
    setTimeout(function () { fly.remove(); }, 1000);
    confetti(cx, cy, up);
    if (!up && originEl) { originEl.classList.add('pv-shake'); setTimeout(function () { originEl.classList.remove('pv-shake'); }, 500); }
  }

  function cast(id, dir, originEl) {
    if (remain <= 0) { show('nope', originEl); hud(); flashHud('No votes left — come back tomorrow!'); return Promise.resolve(null); }
    // optimistic
    var s = scores[id] || { y: 0, n: 0 }; if (dir === 'yup') s.y++; else s.n++; scores[id] = s;
    remain = Math.max(0, remain - 1);
    show(dir, originEl); hud();
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, dir: dir }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && typeof j.remaining === 'number') remain = j.remaining;
        if (j && j.ok) { scores[id] = { y: j.y, n: j.n }; }
        else if (j && j.reason === 'limit') { remain = 0; }
        hud();
        document.dispatchEvent(new CustomEvent('pulse-vote', { detail: { id: id, dir: dir, score: scoreOf(id), remaining: remain } }));
        return j;
      })
      .catch(function () { hud(); return null; });
  }

  function flashHud(msg) {
    var el = document.getElementById('pv-hud'); if (!el) return;
    var old = el.innerHTML; el.innerHTML = '<span class="pv-fire">⚡</span> ' + msg;
    setTimeout(hud, 1800);
  }

  function renderBar(container) {
    var id = container.getAttribute('data-pulse-vote'); if (!id || container.__pv) return; container.__pv = 1;
    injectCSS();
    var bar = $('div', 'pv-bar');
    var sc = $('span', 'pv-score', '🔥 <span class="pv-scv">' + scoreOf(id) + '</span> score');
    var y = $('button', 'pv-btn pv-yup', '👍 Yup <span class="pv-cnt">' + ((scores[id] || {}).y || 0) + '</span>');
    var n = $('button', 'pv-btn pv-nope', '👎 Nope <span class="pv-cnt">' + ((scores[id] || {}).n || 0) + '</span>');
    y.onclick = function (ev) { if (ev) { ev.preventDefault(); ev.stopPropagation(); } cast(id, 'yup', y).then(function () { sync(); }); };
    n.onclick = function (ev) { if (ev) { ev.preventDefault(); ev.stopPropagation(); } cast(id, 'nope', n).then(function () { sync(); }); };
    function sync() {
      var s = scores[id] || { y: 0, n: 0 };
      y.querySelector('.pv-cnt').textContent = s.y || 0;
      n.querySelector('.pv-cnt').textContent = s.n || 0;
      sc.querySelector('.pv-scv').textContent = scoreOf(id);
      if (remain <= 0) { y.disabled = true; n.disabled = true; }
    }
    bar.appendChild(y); bar.appendChild(n); bar.appendChild(sc);
    container.appendChild(bar);
    document.addEventListener('pulse-vote', sync);
  }

  function scanBars() { document.querySelectorAll('[data-pulse-vote]').forEach(renderBar); }

  var PulseVote = {
    ready: function (cb) { if (loaded) cb(); else readyCbs.push(cb); },
    score: scoreOf,
    counts: function (id) { return scores[id] || { y: 0, n: 0 }; },
    remaining: function () { return remain; },
    cast: cast,
  };
  window.PulseVote = PulseVote;

  fetch(API, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
    if (j && j.scores) scores = j.scores;
    if (j && typeof j.remaining === 'number') remain = j.remaining;
    if (j && j.cap) CAP = j.cap;
  }).catch(function () {}).then(function () {
    loaded = true; hud(); scanBars();
    readyCbs.forEach(function (cb) { try { cb(); } catch (e) {} }); readyCbs = [];
    // re-scan in case content renders late
    setTimeout(scanBars, 800); setTimeout(scanBars, 2000);
  });
})();
