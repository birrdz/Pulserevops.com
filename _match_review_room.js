'use strict';
/**
 * Title↔image match room — 200 at a time, SHOW AS SITE.
 * ✓ keep · ✗ better (optional suggestion) → requeues as RECHECK (looks different).
 * Pillars: st → ik → ra → bs → gp
 *
 * http://127.0.0.1:8930/
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const PORT = parseInt(process.env.MATCH_PORT || '8930', 10);
const BATCH = parseInt(process.env.MATCH_BATCH || '200', 10);
const QA = path.join(WD, 'assets', 'qa');
const STATE_F = path.join(WD, '_match_review_state.json');
const LOG_F = path.join(WD, '_match_review_log.jsonl');

const PILLARS = [
  { pfx: 'st', name: 'Sales Trainings', chip: 'SALES TRAININGS', mosaic: 'mosaic-pool-st.json' },
  { pfx: 'ik', name: 'Industry KPIs', chip: 'INDUSTRY KPIS', mosaic: 'mosaic-pool-ik.json' },
  { pfx: 'ra', name: 'Rev Architecture', chip: 'REVENUE ARCHITECTURE', mosaic: 'mosaic-pool-ra.json' },
  { pfx: 'bs', name: 'Book Summaries', chip: 'BOOK SUMMARIES', mosaic: 'mosaic-pool-bs.json' },
  { pfx: 'gp', name: 'GTM Playbooks', chip: 'GTM PLAYBOOKS', mosaic: 'mosaic-pool-gp.json' },
];

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_F, 'utf8'));
  } catch (e) {
    return {
      queue: [],
      batchStart: 0,
      keep: {},
      pendingRecheck: {}, // id -> { suggestion, at, from }
      suggestions: {},
      at: null,
    };
  }
}
function writeState(st) {
  st.at = new Date().toISOString();
  fs.writeFileSync(STATE_F, JSON.stringify(st, null, 2));
}
function logLine(obj) {
  fs.appendFileSync(LOG_F, JSON.stringify(Object.assign({ at: new Date().toISOString() }, obj)) + '\n');
}
function faceOk(id) {
  try {
    return fs.statSync(path.join(QA, id + '.jpg')).size > 8000;
  } catch (e) {
    return false;
  }
}
function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

async function buildQueue() {
  const idx = await store.get('_index.json', { type: 'json' });
  const byId = new Map((idx.entries || []).map((e) => [e && e.id, e]));
  const queue = [];
  for (const P of PILLARS) {
    let ids = [];
    const mf = path.join(WD, P.mosaic);
    if (fs.existsSync(mf)) {
      try {
        ids = JSON.parse(fs.readFileSync(mf, 'utf8'))
          .map((x) => x.id || x)
          .filter(Boolean);
      } catch (e) {}
    }
    if (!ids.length) {
      ids = [...byId.keys()].filter((id) => new RegExp('^' + P.pfx + '\\d+$', 'i').test(String(id)));
      ids.sort(
        (a, b) =>
          (parseInt(String(a).replace(/\D/g, ''), 10) || 0) - (parseInt(String(b).replace(/\D/g, ''), 10) || 0)
      );
    }
    for (const id of ids) {
      const e = byId.get(id) || {};
      queue.push({
        id: String(id),
        pfx: P.pfx,
        pillar: P.name,
        chip: P.chip,
        title: String(e.question || e.title || id).trim(),
        face: '/assets/qa/' + id + '.jpg',
        hasFace: faceOk(id),
      });
    }
  }
  return queue;
}

function undecided(st) {
  const keep = st.keep || {};
  const pending = st.pendingRecheck || {};
  // First-pass: not kept, not waiting recheck
  const first = (st.queue || []).filter((r) => !keep[r.id] && !pending[r.id]);
  // Recheck pass (after we swap images later — for now show pending ones in a separate batch mode)
  const recheck = (st.queue || [])
    .filter((r) => pending[r.id] && !keep[r.id])
    .map((r) =>
      Object.assign({}, r, {
        recheck: true,
        suggestion: pending[r.id].suggestion || (st.suggestions && st.suggestions[r.id]) || '',
      })
    );
  return { first, recheck };
}

function currentBatch(st) {
  const { first, recheck } = undecided(st);
  // Prefer finishing first-pass; when first empty, serve recheck queue
  const pool = first.length ? first : recheck;
  const mode = first.length ? 'first' : 'recheck';
  const start = Math.min(st.batchStart || 0, Math.max(0, pool.length - 1));
  const slice = pool.slice(start, start + BATCH);
  return { mode, pool, slice, start, totalPool: pool.length, firstLeft: first.length, recheckLeft: recheck.length };
}

function page(st) {
  const kept = Object.keys(st.keep || {}).length;
  const pendingN = Object.keys(st.pendingRecheck || {}).length;
  const qn = (st.queue || []).length;
  const donePct = qn ? Math.round((kept / qn) * 1000) / 10 : 0;
  const bat = currentBatch(st);
  const t = Date.now();

  const cards = bat.slice
    .map((r) => {
      const tip = esc(r.title);
      const isR = !!r.recheck || bat.mode === 'recheck';
      const sug = esc(r.suggestion || (st.suggestions && st.suggestions[r.id]) || '');
      const img = r.hasFace
        ? `<img class=mm-img src="${r.face}?t=${t}" alt="${tip}" loading="lazy">`
        : `<div class=miss>NO FACE</div>`;
      return `<article class="card ${isR ? 'recheck' : 'first'}" data-id="${esc(r.id)}">
      <div class="mm">
        ${img}
        <div class="mm-scrim"></div>
        <span class="mm-cat">${esc(r.chip)}${isR ? ' · RECHECK' : ''}</span>
        <h4>${tip}</h4>
      </div>
      <div class="id">${esc(r.id)}${isR ? ' · round 2' : ''}</div>
      <textarea class=sug placeholder="optional — what image should this be?">${sug}</textarea>
      <div class="btns">
        <button type=button class="yes" data-v="keep">✓</button>
        <button type=button class="no" data-v="reject">✗</button>
      </div>
    </article>`;
    })
    .join('\n');

  return `<!doctype html>
<meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Match · ${bat.mode} · ${bat.slice.length}/${BATCH}</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#0a0806;color:#f5e6c8;font-family:Georgia,serif}
header{position:sticky;top:0;z-index:20;background:#0a0806f2;padding:12px 16px;border-bottom:1px solid rgba(234,193,92,.3);display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center}
header b{color:#FFEB3B;font-size:1.1rem}
.meta{font:600 12px/1.35 system-ui;color:#8a8680}
.nav{display:flex;gap:8px;flex-wrap:wrap}
.nav button,.nav a{font:800 12px system-ui;padding:10px 12px;border:2px solid #EAC15C;background:#000;color:#F6C445;text-decoration:none;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;padding:14px 14px 40px}
.card{background:#120a10;border:2px solid rgba(234,193,92,.35);padding:8px;display:flex;flex-direction:column;gap:8px}
.card.first{border-color:rgba(234,193,92,.45)}
.card.recheck{border-color:#FF6B00;box-shadow:0 0 0 2px rgba(255,107,0,.25),0 8px 24px rgba(255,107,0,.12);background:#1a0c00}
.card.recheck .mm{border-color:#FF6B00}
.card.recheck .mm-cat{background:#FF6B00;color:#1a0a00}
.card.done-keep{opacity:.35;pointer-events:none;filter:grayscale(.4)}
.card.done-rej{opacity:.5;outline:2px dashed #FF6B00}
.mm{position:relative;aspect-ratio:1/1;overflow:hidden;background:#000;border:3px solid #EAC15C}
.mm-img{width:100%;height:100%;object-fit:cover;display:block}
.mm-scrim{position:absolute;inset:auto 0 0 0;height:55%;background:linear-gradient(transparent,#000d);pointer-events:none}
.mm-cat{position:absolute;top:8px;left:8px;z-index:2;background:#000a;color:#FFE566;font:800 9px/1 system-ui;letter-spacing:.05em;padding:4px 6px}
.mm h4{position:absolute;left:8px;right:8px;bottom:8px;z-index:2;margin:0;color:#FFEB3B;font:800 13px/1.2 Georgia,serif;max-height:4.8em;overflow:hidden}
.id{font:700 11px system-ui;color:#EAC15C}
.sug{width:100%;min-height:40px;background:#0a0806;border:1px solid rgba(234,193,92,.25);color:#f5e6c8;font:600 12px/1.3 system-ui;padding:6px 8px;resize:vertical}
.card.recheck .sug{border-color:#FF6B00;background:#140800}
.btns{display:flex;gap:8px}
.btns button{flex:1;font:900 18px system-ui;padding:12px 0;border:2px solid #EAC15C;background:#000;color:#F6C445;cursor:pointer}
.btns .yes{border-color:#1a7f4b;color:#6BC88A}
.btns .no{border-color:#B91C3F;color:#ff8a8a}
.miss{padding:40px 8px;text-align:center;color:#f66;font:800 12px system-ui}
.banner-recheck{width:100%;background:#FF6B00;color:#1a0a00;font:800 13px/1.3 system-ui;padding:8px 12px;text-align:center}
</style>
<header>
  <div>
    <b>Match review · ${BATCH}/batch</b>
    <div class=meta>${donePct}% kept · keep ${kept} · recheck queue ${pendingN} · pool ${bat.totalPool} · showing ${bat.start + 1}–${bat.start + bat.slice.length}</div>
  </div>
  <div class=nav>
    <button type=button id=prev>← prev ${BATCH}</button>
    <button type=button id=next>next ${BATCH} →</button>
    <a href="/export">export rechecks</a>
  </div>
</header>
${bat.mode === 'recheck' ? '<div class=banner-recheck>RECHECK PASS — these were ✗ earlier. New image should be on disk; ✓ if it matches the title now.</div>' : ''}
<div class=grid id=grid>${cards || '<p style="padding:40px;color:#8a8680">Batch empty — next batch or recheck pass.</p>'}</div>
<script>
(function(){
  function vote(id, v, sug){
    return fetch('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,vote:v,suggestion:sug||''})})
      .then(function(r){return r.json();});
  }
  document.getElementById('grid').addEventListener('click',function(e){
    var btn=e.target.closest('button[data-v]');
    if(!btn) return;
    var card=btn.closest('.card');
    if(!card) return;
    var id=card.getAttribute('data-id');
    var sug=(card.querySelector('.sug')&&card.querySelector('.sug').value||'').trim();
    var v=btn.getAttribute('data-v');
    card.remove();
    vote(id,v,sug).then(function(j){
      if(!j||!j.ok){alert((j&&j.error)||'fail');location.reload();return;}
      if(!document.querySelector('#grid .card')){
        fetch('/api/batch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dir:0,reset:1})})
          .then(function(){location.reload();});
      }
    }).catch(function(err){alert(String(err));location.reload();});
  });
  document.getElementById('prev').onclick=function(){fetch('/api/batch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dir:-1})}).then(function(){location.reload();});};
  document.getElementById('next').onclick=function(){fetch('/api/batch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dir:1})}).then(function(){location.reload();});};
})();
</script>`;
}

(async () => {
  let st = readState();
  if (!st.queue || !st.queue.length) {
    console.log('[match] building queue…');
    st.queue = await buildQueue();
    st.batchStart = 0;
    st.keep = st.keep || {};
    st.pendingRecheck = st.pendingRecheck || {};
    st.suggestions = st.suggestions || {};
    writeState(st);
  }
  // migrate old reject → pendingRecheck once
  if (st.reject && Object.keys(st.reject).length) {
    st.pendingRecheck = st.pendingRecheck || {};
    for (const [id, v] of Object.entries(st.reject)) {
      if (!st.pendingRecheck[id]) st.pendingRecheck[id] = v;
    }
    delete st.reject;
    writeState(st);
  }
  console.log('[match] queue', st.queue.length, 'batch', BATCH);

  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    if (u.pathname === '/api/vote' && req.method === 'POST') {
      let raw = '';
      for await (const c of req) raw += c;
      let d = {};
      try {
        d = JSON.parse(raw || '{}');
      } catch (e) {}
      st = readState();
      const id = String(d.id || '');
      const vote = String(d.vote || '');
      const suggestion = String(d.suggestion || '').trim();
      if (!id || (vote !== 'keep' && vote !== 'reject')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: 'bad vote' }));
      }
      if (suggestion) st.suggestions[id] = suggestion;
      if (vote === 'keep') {
        st.keep[id] = { at: new Date().toISOString(), suggestion: suggestion || null };
        delete st.pendingRecheck[id];
      } else {
        // ✗ → park in recheck rotation (not gone forever)
        st.pendingRecheck[id] = {
          at: new Date().toISOString(),
          suggestion: suggestion || (st.suggestions && st.suggestions[id]) || null,
          from: 'reject',
        };
        delete st.keep[id];
      }
      writeState(st);
      const row = (st.queue || []).find((x) => x.id === id) || {};
      logLine({ id, vote, suggestion: suggestion || null, pillar: row.pfx, requeue: vote === 'reject' });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }
    if (u.pathname === '/api/batch' && req.method === 'POST') {
      let raw = '';
      for await (const c of req) raw += c;
      let d = {};
      try {
        d = JSON.parse(raw || '{}');
      } catch (e) {}
      st = readState();
      if (d.reset) {
        // Voted items drop out of the undecided pool — always show next 200 from the front
        st.batchStart = 0;
      } else {
        const bat = currentBatch(st);
        const dir = Number(d.dir);
        const step = Number.isFinite(dir) ? dir : 1;
        let next = (st.batchStart || 0) + step * BATCH;
        if (next < 0) next = 0;
        if (next >= bat.totalPool) next = 0;
        st.batchStart = next;
      }
      writeState(st);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, batchStart: st.batchStart }));
    }
    if (u.pathname === '/export') {
      st = readState();
      const rejects = Object.entries(st.pendingRecheck || {}).map(([id, v]) => {
        const row = (st.queue || []).find((x) => x.id === id) || { id };
        return {
          id,
          title: row.title,
          pillar: row.pillar,
          suggestion: (v && v.suggestion) || (st.suggestions && st.suggestions[id]) || null,
        };
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ at: new Date().toISOString(), n: rejects.length, rejects }, null, 2));
    }
    if (u.pathname.startsWith('/assets/qa/')) {
      const file = path.join(QA, path.basename(u.pathname));
      if (!fs.existsSync(file)) {
        res.writeHead(404);
        return res.end('missing');
      }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
      return fs.createReadStream(file).pipe(res);
    }
    if (u.pathname === '/' || u.pathname === '/index.html') {
      st = readState();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(page(st));
    }
    if (u.pathname === '/reset-batch') {
      st = readState();
      st.batchStart = 0;
      writeState(st);
      res.writeHead(302, { Location: '/' });
      return res.end();
    }
    res.writeHead(404);
    res.end('no');
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log('[match] http://127.0.0.1:' + PORT + '/');
    console.log('[match] http://192.168.5.68:' + PORT + '/');
  });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
