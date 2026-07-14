// _gp_face_review_server.js — GTM (gp) face+title approval in batches of 10.
// ✓ = lock in. ✗ = trash + push id into gen rework pool (_gp_face_rework_pool.json).
// After all 10 in the batch are voted, Next 10 loads automatically.
'use strict';
const fs = require('fs');
const http = require('http');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const PORT = 8911;
const QA = path.join(WD, 'assets', 'qa');
const QUEUE_F = path.join(WD, '_gp_face_review_queue.json');
const STATE_F = path.join(WD, '_gp_face_review_state.json'); // { approved:{}, trashed:{}, batchStart:0 }
const REWORK_F = path.join(WD, '_gp_face_rework_pool.json'); // gen pool for ✗ cards
const BATCH = 10;

function loadJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function saveJSON(f, o) { fs.writeFileSync(f, JSON.stringify(o, null, 1)); }

function loadState() {
  const s = loadJSON(STATE_F, { approved: {}, trashed: {}, batchStart: 0 });
  if (!s.approved) s.approved = {};
  if (!s.trashed) s.trashed = {};
  if (typeof s.batchStart !== 'number') s.batchStart = 0;
  return s;
}

function loadRework() {
  const r = loadJSON(REWORK_F, { pillar: 'gp', ids: [], log: [] });
  if (!Array.isArray(r.ids)) r.ids = [];
  if (!Array.isArray(r.log)) r.log = [];
  return r;
}

function pushRework(id, title) {
  const r = loadRework();
  if (!r.ids.includes(id)) r.ids.push(id);
  r.log.unshift({ id, title: String(title || '').slice(0, 120), at: Date.now(), action: 'trashed→gen-pool' });
  r.log = r.log.slice(0, 200);
  r.updatedAt = Date.now();
  saveJSON(REWORK_F, r);
  return r.ids.length;
}

function removeRework(id) {
  const r = loadRework();
  r.ids = r.ids.filter((x) => x !== id);
  r.updatedAt = Date.now();
  saveJSON(REWORK_F, r);
}

async function buildQueue() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const gp = (idx.entries || []).filter((e) => e && e.id && /^gp\d/i.test(String(e.id)));
  gp.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  const entries = gp.map((e) => {
    const id = String(e.id);
    const face = path.join(QA, id + '.jpg');
    let faceOk = false;
    try { faceOk = fs.statSync(face).size > 20000; } catch (z) {}
    return {
      id,
      title: e.question || e.title || id,
      faceOk,
      img: faceOk ? '/img/' + id + '.jpg' : '',
    };
  });
  const q = { at: Date.now(), pillar: 'gp', total: entries.length, entries };
  saveJSON(QUEUE_F, q);
  return q;
}

function pendingEntries(q, st) {
  return q.entries.filter((e) => !st.approved[e.id] && !st.trashed[e.id]);
}

function currentBatch(q, st, advance) {
  const pending = pendingEntries(q, st);
  if (advance) {
    // Owner asked for next 10 — drop already-voted from view by relying on pending filter
    st.batchStart = 0;
    saveJSON(STATE_F, st);
  }
  return pending.slice(0, BATCH);
}

function page(q, st, batch) {
  const pending = pendingEntries(q, st);
  const approvedN = Object.keys(st.approved).length;
  const trashedN = Object.keys(st.trashed).length;
  const reworkN = loadRework().ids.length;
  const doneInBatch = batch.filter((e) => st.approved[e.id] || st.trashed[e.id]).length;
  // batch shown is always first 10 pending, so doneInBatch for display = votes this session on visible cards
  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const batchNum = Math.floor(approvedN + trashedN) / BATCH + 1 | 0;
  return `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">
<title>GTM face approval — 10 at a time</title>
<style>
body{margin:0;background:#000;color:#eee;font:14px/1.4 system-ui;padding:16px 18px 48px}
h1{font:800 1.35rem Georgia,serif;color:#EAC15C;margin:0 0 6px}
.sub{color:#9a958c;margin:0 0 14px;max-width:820px}
.bar{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:0 0 16px;position:sticky;top:0;background:#000;padding:10px 0;z-index:5;border-bottom:1px solid #222}
.bar b{color:#EAC15C}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.card{background:#0a0a0a;border:3px solid #EAC15C;overflow:hidden;display:flex;flex-direction:column}
.card.ok{border-color:#1a8f4c;opacity:.7}
.card.no{border-color:#b01e2e;opacity:.55}
.img{height:180px;background:#111 top center/cover no-repeat}
.miss{height:160px;display:flex;align-items:center;justify-content:center;background:#1a1010;color:#f88;font-size:12px}
.meta{padding:10px}
.id{font:700 .68rem/1 system-ui;letter-spacing:.08em;color:#EAC15C;text-transform:uppercase}
.tt{margin:6px 0 10px;font:800 1.05rem/1.2 Georgia,serif;color:#F6C445;min-height:2.5em}
.acts{display:flex;gap:8px}
button{flex:1;border:0;border-radius:8px;padding:12px 8px;font:800 1rem/1 system-ui;cursor:pointer}
.yes{background:#1a8f4c;color:#fff}.no{background:#7a1520;color:#f5c2c8}
.next{background:#EAC15C;color:#000;padding:12px 18px;border:0;border-radius:8px;font:800 1rem/1 system-ui;cursor:pointer}
.next:disabled{opacity:.35;cursor:default}
.empty{padding:40px;text-align:center;color:#8a8680}
kbd{background:#1a1a1a;border:1px solid #333;padding:1px 6px;border-radius:4px;color:#EAC15C}
</style>
<h1>GTM Playbooks — batch of 10</h1>
<p class=sub><b>✓</b> locks this face+title in. <b>✗</b> trashes it and puts the id back in the <b>gen pool</b> to be reworked. Finish all 10, then <b>Next 10</b> (or it auto-loads).</p>
<div class=bar>
  <span>Batch showing <b>${batch.length}</b></span>
  <span>Pending left <b id=pend>${pending.length}</b></span>
  <span>✓ locked <b id=okn>${approvedN}</b></span>
  <span>✗ → gen pool <b id=non>${trashedN}</b></span>
  <span>Gen pool size <b id=rwn>${reworkN}</b></span>
  <button class=next id=nextBtn type=button onclick="nextBatch()" disabled>Next 10 →</button>
  <span id=waitNote style="color:#9a958c">Vote all 10 — then tell me / hit Next 10</span>
</div>
<div class=grid id=grid>
${batch.length ? batch.map((e) => {
  const vote = st.approved[e.id] ? 'ok' : st.trashed[e.id] ? 'no' : 'pending';
  const img = e.faceOk
    ? `<div class=img style="background-image:url('${e.img}?v=${q.at}')"></div>`
    : `<div class=miss>missing face</div>`;
  return `<div class="card ${vote}" data-id="${esc(e.id)}" data-vote="${vote}">
${img}
<div class=meta>
<div class=id>${esc(e.id)}</div>
<div class=tt>${esc(e.title)}</div>
<div class=acts>
<button class=yes type=button onclick="vote('${esc(e.id)}','yes')">✓</button>
<button class=no type=button onclick="vote('${esc(e.id)}','no')">✗</button>
</div></div></div>`;
}).join('') : '<div class=empty>All GTM faces voted. Gen pool has the ✗ ones for rework.</div>'}
</div>
<script>
async function vote(id,kind){
  const r=await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,kind})});
  const j=await r.json();
  const el=document.querySelector('[data-id="'+id+'"]');
  if(el){el.classList.remove('ok','no','pending');el.classList.add(kind==='yes'?'ok':'no');el.dataset.vote=kind==='yes'?'ok':'no';}
  document.getElementById('okn').textContent=j.approvedN;
  document.getElementById('non').textContent=j.trashedN;
  document.getElementById('pend').textContent=j.pendingN;
  document.getElementById('rwn').textContent=j.reworkN;
  // Stay on this batch until owner says send next 10 (no auto-advance).
  const cards=[].slice.call(document.querySelectorAll('.card'));
  const allVoted=cards.length&&cards.every(c=>c.dataset.vote==='ok'||c.dataset.vote==='no');
  const next=document.getElementById('nextBtn');
  if(next) next.disabled=!allVoted || j.pendingN<=0;
  if(allVoted){
    const note=document.getElementById('waitNote');
    if(note) note.textContent=j.pendingN>0
      ? 'Batch done — tell Cursor to send the next 10 (or hit Next 10).'
      : 'All GTM faces voted.';
  }
}
function nextBatch(){ location.href='/?next=1'; }
addEventListener('keydown',function(e){
  if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
  const pending=[].slice.call(document.querySelectorAll('.card[data-vote="pending"]'));
  if(!pending.length)return;
  const card=pending[0];
  if(e.key==='a'||e.key==='A'||e.key==='Enter'){e.preventDefault();vote(card.dataset.id,'yes');}
  if(e.key==='x'||e.key==='X'){e.preventDefault();vote(card.dataset.id,'no');}
});
</script>`;
}

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname.startsWith('/img/')) {
      const raw = decodeURIComponent(u.pathname.slice('/img/'.length)).replace(/\.jpe?g$/i, '');
      const id = raw.replace(/[^a-z0-9]/gi, '');
      const f = path.join(QA, id + '.jpg');
      if (!id || !fs.existsSync(f)) { res.writeHead(404); return res.end('missing ' + id); }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache' });
      return res.end(fs.readFileSync(f));
    }
    if (u.pathname === '/vote' && req.method === 'POST') {
      let b = '';
      req.on('data', (c) => (b += c));
      req.on('end', () => {
        let d = {};
        try { d = JSON.parse(b || '{}'); } catch (e) {}
        const id = String(d.id || '').replace(/[^a-z0-9]/gi, '');
        const q = loadJSON(QUEUE_F, { entries: [] });
        const ent = (q.entries || []).find((e) => e.id === id) || { id, title: id };
        const st = loadState();
        if (d.kind === 'yes') {
          st.approved[id] = { at: Date.now(), title: ent.title };
          delete st.trashed[id];
          removeRework(id);
        } else if (d.kind === 'no') {
          st.trashed[id] = { at: Date.now(), title: ent.title };
          delete st.approved[id];
          pushRework(id, ent.title);
        }
        saveJSON(STATE_F, st);
        const pendingN = pendingEntries(q, st).length;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          approvedN: Object.keys(st.approved).length,
          trashedN: Object.keys(st.trashed).length,
          pendingN,
          reworkN: loadRework().ids.length,
        }));
      });
      return;
    }
    if (u.pathname === '/rework.json') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(loadRework(), null, 1));
    }
    if (u.pathname === '/' || u.pathname === '/index.html') {
      const q = await buildQueue();
      const st = loadState();
      const batch = currentBatch(q, st);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(page(q, st, batch));
    }
    res.writeHead(404);
    res.end('not found');
  } catch (e) {
    res.writeHead(500);
    res.end(String(e && e.message || e));
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log('[gp-review] http://127.0.0.1:' + PORT + '/  — batches of 10; ✗ → ' + REWORK_F);
});
