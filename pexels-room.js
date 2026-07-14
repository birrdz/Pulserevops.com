#!/usr/bin/env node
/**
 * PEXELS ROOM — grab → review → library
 * Port 7100 (NOT Kory fixer 8904, NOT gallery 8905)
 *
 * 1. Type a query → GO
 * 2. Downloads 100 unique photos to a STAGING folder (not library yet)
 * 3. Shows all 100 at once — ✓ keeps, ✗ deletes
 * 4. ✓ → copy into assets/qa/_pexels_stored (the real library)
 *
 * Fail-safes:
 *  - Never re-download a Pexels id already seen on this machine
 *  - Never save a file that already exists in library or staging
 *  - If a candidate is a dupe, skip it and keep fetching until 100 unique land
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 7100;
const LAN = process.env.RUN_DASH_LAN || '192.168.5.68';
const BATCH = 100;
const WD = __dirname;
const LIBRARY = path.join(WD, 'assets', 'qa', '_pexels_stored');
const STAGING = path.join(WD, 'assets', 'qa', '_pexels_staging');
const STATE_FILE = path.join(WD, 'pexels_room_state.json');
const BATCH_FILE = path.join(WD, 'pexels_room_batch.json');

try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const API_KEY = process.env.PEXELS_API_KEY || '';

function ensureDirs() {
  try { fs.mkdirSync(LIBRARY, { recursive: true }); } catch (e) {}
  try { fs.mkdirSync(STAGING, { recursive: true }); } catch (e) {}
}
function loadJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function saveJSON(f, o) { try { fs.writeFileSync(f, JSON.stringify(o, null, 1)); } catch (e) {} }

function loadState() {
  const s = loadJSON(STATE_FILE, { downloaded: {}, totals: { saved: 0, skipped: 0, rejected: 0 }, log: [] });
  if (!s.downloaded) s.downloaded = {};
  if (!s.totals) s.totals = { saved: 0, skipped: 0, rejected: 0 };
  if (!s.log) s.log = [];
  return s;
}
const state = loadState();
function saveState() { saveJSON(STATE_FILE, state); }

let running = null; // progress while downloading
let batch = loadJSON(BATCH_FILE, null); // { id, query, items:[{pexelsId,file,vote}], created }

function log(msg) {
  const line = new Date().toLocaleTimeString() + ' · ' + msg;
  state.log.unshift(line);
  state.log = state.log.slice(0, 50);
  saveState();
  console.log('[pexels-room] ' + msg);
}

const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** All Pexels ids / filenames already on this machine (library + staging + state). */
function knownOnMachine() {
  const ids = new Set(Object.keys(state.downloaded).map(String));
  const files = new Set();
  for (const dir of [LIBRARY, STAGING]) {
    try {
      for (const n of fs.readdirSync(dir)) {
        if (!/\.jpe?g$/i.test(n)) continue;
        files.add(n.toLowerCase());
        const m = n.match(/_(\d+)\.jpe?g$/i);
        if (m) ids.add(m[1]);
      }
    } catch (e) {}
  }
  return { ids, files };
}

async function pexelsSearch(query, perPage, page) {
  const url = 'https://api.pexels.com/v1/search?query=' + encodeURIComponent(query)
    + '&per_page=' + perPage + '&page=' + page + '&orientation=landscape';
  const r = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    throw new Error('Pexels ' + r.status + ': ' + t.slice(0, 140));
  }
  return (await r.json()).photos || [];
}

async function downloadStaging(photo, query, known) {
  const id = String(photo.id);
  if (known.ids.has(id)) return { skip: 'id' };
  const file = slug(query) + '_' + id + '.jpg';
  if (known.files.has(file.toLowerCase())) return { skip: 'file' };
  // also block if same id already in library under any name
  const src = photo.src && (photo.src.large2x || photo.src.large || photo.src.original);
  if (!src) return { skip: 'nosrc' };
  const r = await fetch(src);
  if (!r.ok) return { skip: 'http' };
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 4000) return { skip: 'tiny' };
  // content-hash de-dupe vs library (cheap size+sha of first 64kb)
  const sig = crypto.createHash('sha1').update(buf.subarray(0, Math.min(buf.length, 65536))).digest('hex');
  if (known.hashes && known.hashes.has(sig)) return { skip: 'hash' };
  fs.writeFileSync(path.join(STAGING, file), buf);
  known.ids.add(id);
  known.files.add(file.toLowerCase());
  if (known.hashes) known.hashes.add(sig);
  return { file, pexelsId: id, bytes: buf.length, sig };
}

function buildHashIndex() {
  const hashes = new Set();
  for (const dir of [LIBRARY, STAGING]) {
    try {
      for (const n of fs.readdirSync(dir)) {
        if (!/\.jpe?g$/i.test(n)) continue;
        try {
          const fd = fs.openSync(path.join(dir, n), 'r');
          const buf = Buffer.alloc(65536);
          const got = fs.readSync(fd, buf, 0, 65536, 0);
          fs.closeSync(fd);
          hashes.add(crypto.createHash('sha1').update(buf.subarray(0, got)).digest('hex'));
        } catch (e) {}
      }
    } catch (e) {}
  }
  return hashes;
}

/** Download until `target` unique staging files (skip dupes, keep fetching replacements). */
async function grabBatch(query, target) {
  if (!API_KEY) throw new Error('No PEXELS_API_KEY in .env.local');
  target = Math.max(1, Math.min(200, target || BATCH));
  ensureDirs();
  // clear previous unreviewed staging batch files listed in old batch
  if (batch && Array.isArray(batch.items)) {
    for (const it of batch.items) {
      if (it.vote) continue; // already decided
      try { fs.unlinkSync(path.join(STAGING, it.file)); } catch (e) {}
    }
  }
  const known = knownOnMachine();
  known.hashes = buildHashIndex();
  running = { query, saved: 0, skipped: 0, target, page: 1 };
  log('GO · fetching ' + target + ' unique for "' + query + '" (dupes skipped → keep looking)');
  const items = [];
  let page = 1, emptyPages = 0;
  while (items.length < target && page <= 40) {
    running.page = page;
    let photos;
    try {
      photos = await pexelsSearch(query, 80, page);
    } catch (e) {
      if (/429/.test(String(e.message))) {
        log('rate limited — wait 60s');
        await sleep(60000);
        continue;
      }
      throw e;
    }
    if (!photos.length) { emptyPages++; if (emptyPages >= 3) break; page++; continue; }
    emptyPages = 0;
    for (const p of photos) {
      if (items.length >= target) break;
      const r = await downloadStaging(p, query, known);
      if (r.skip) {
        running.skipped++;
        state.totals.skipped++;
        continue;
      }
      items.push({ pexelsId: r.pexelsId, file: r.file, vote: '', bytes: r.bytes });
      // mark id seen so we never pull it again on this machine
      state.downloaded[r.pexelsId] = { file: r.file, query, at: Date.now(), staged: true };
      running.saved = items.length;
      if (items.length % 10 === 0) {
        saveState();
        log(items.length + '/' + target + ' staged…');
      }
    }
    page++;
    if (items.length < target) await sleep(1100);
  }
  saveState();
  batch = {
    id: Date.now().toString(36),
    query,
    created: new Date().toISOString(),
    target,
    items
  };
  saveJSON(BATCH_FILE, batch);
  running = null;
  log('ready for review · ' + items.length + '/' + target + ' unique for "' + query + '"');
  return { ok: true, count: items.length, target, query };
}

/** ✓ → library now and leave screen. ✗ → delete forever (nowhere else) and leave screen. */
function applyVote(file, vote) {
  if (!batch || !Array.isArray(batch.items)) return { ok: false, error: 'no batch' };
  const ix = batch.items.findIndex(x => x.file === file);
  if (ix < 0) return { ok: false, error: 'not found' };
  const it = batch.items[ix];
  const src = path.join(STAGING, it.file);
  ensureDirs();
  if (vote === 'ok') {
    try {
      fs.copyFileSync(src, path.join(LIBRARY, it.file));
      try { fs.unlinkSync(src); } catch (e) {}
      if (state.downloaded[it.pexelsId]) {
        state.downloaded[it.pexelsId].staged = false;
        state.downloaded[it.pexelsId].file = it.file;
        state.downloaded[it.pexelsId].library = true;
      }
      state.totals.saved++;
      batch.items.splice(ix, 1);
      saveState();
      finishBatchIfEmpty();
      return { ok: true, action: 'kept' };
    } catch (e) { return { ok: false, error: e.message }; }
  }
  if (vote === 'no') {
    // Disapproved = gone. Not copied to library, Downloads, or anywhere else.
    try { fs.unlinkSync(src); } catch (e) {}
    state.totals.rejected++;
    batch.items.splice(ix, 1);
    saveState();
    finishBatchIfEmpty();
    return { ok: true, action: 'dumped' };
  }
  return { ok: true };
}

function finishBatchIfEmpty() {
  if (batch && batch.items && batch.items.length) {
    saveJSON(BATCH_FILE, batch);
    return;
  }
  batch = null;
  try { fs.unlinkSync(BATCH_FILE); } catch (e) {}
  purgeStaging(); // after you're done, staging is emptied — only library keeps ✓
}

/** Wipe staging folder (disapproved + orphans). Library is untouched. */
function purgeStaging() {
  ensureDirs();
  let n = 0;
  try {
    for (const name of fs.readdirSync(STAGING)) {
      if (!/\.jpe?g$/i.test(name)) continue;
      try { fs.unlinkSync(path.join(STAGING, name)); n++; } catch (e) {}
    }
  } catch (e) {}
  if (n) log('staging cleared · ' + n + ' leftover file(s) deleted (not saved)');
  return n;
}

function approveAll() {
  if (!batch) return { ok: false, error: 'no batch' };
  for (const it of batch.items) if (!it.vote) it.vote = 'ok';
  saveJSON(BATCH_FILE, batch);
  return commitBatch();
}

function rejectAll() {
  if (!batch) return { ok: false, error: 'no batch' };
  for (const it of batch.items) it.vote = 'no';
  saveJSON(BATCH_FILE, batch);
  return commitBatch();
}

/** Move ✓ into library, delete ✗ from staging. Undecided stay in staging. */
function commitBatch() {
  if (!batch) return { ok: false, error: 'no batch' };
  ensureDirs();
  let kept = 0, dumped = 0, left = 0;
  const remain = [];
  for (const it of batch.items) {
    const src = path.join(STAGING, it.file);
    if (it.vote === 'ok') {
      try {
        fs.copyFileSync(src, path.join(LIBRARY, it.file));
        try { fs.unlinkSync(src); } catch (e) {}
        if (state.downloaded[it.pexelsId]) {
          state.downloaded[it.pexelsId].staged = false;
          state.downloaded[it.pexelsId].file = it.file;
          state.downloaded[it.pexelsId].library = true;
        }
        state.totals.saved++;
        kept++;
      } catch (e) { left++; remain.push(it); }
    } else if (it.vote === 'no') {
      try { fs.unlinkSync(src); } catch (e) {}
      state.totals.rejected++;
      dumped++;
    } else {
      left++;
      remain.push(it);
    }
  }
  saveState();
  if (left) {
    batch.items = remain;
    saveJSON(BATCH_FILE, batch);
  } else {
    batch = null;
    try { fs.unlinkSync(BATCH_FILE); } catch (e) {}
    purgeStaging();
  }
  log('commit · ✓ ' + kept + ' → library · ✗ ' + dumped + ' deleted forever' + (left ? ' · ' + left + ' still pending' : ''));
  return { ok: true, kept, dumped, left };
}

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const PANEL = `<!doctype html><html><head><meta charset=utf-8><title>Pexels Room</title>
<meta name=viewport content="width=device-width,initial-scale=1">
<style>
:root{--ok:#3ec46d;--no:#ff5566;--teal:#05a081}
*{box-sizing:border-box}
body{margin:0;background:#0b0d10;color:#e8eef2;font:15px/1.4 -apple-system,Segoe UI,Roboto,sans-serif}
header{position:sticky;top:0;z-index:5;background:#0b0d10;border-bottom:1px solid #222a31;padding:14px 16px}
.wrap{max-width:1100px;margin:0 auto}
h1{margin:0;font-size:1.2rem;color:var(--teal)}
.dim{color:#7b8794;font-size:12px;margin-top:4px}
.row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
input{flex:1;min-width:180px;background:#0e1216;border:1px solid #2a333b;color:#e8eef2;border-radius:10px;padding:12px 14px;font-size:15px}
button{border:0;border-radius:10px;padding:12px 16px;font-weight:800;cursor:pointer;background:var(--teal);color:#04231d}
button:disabled{opacity:.45;cursor:wait}
button.ghost{background:#1a2129;color:#cdd6df;border:1px solid #2a333b}
button.ok{background:var(--ok);color:#04210f}
button.no{background:var(--no);color:#2a0000}
.job{margin-top:10px;color:var(--teal);font-weight:700;min-height:1.3em}
.stat{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
.stat span{background:#12161b;border:1px solid #222a31;border-radius:8px;padding:6px 10px;font-size:12px}
.stat b{color:var(--teal)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;padding:14px 16px 40px}
.card{background:#12161b;border:2px solid #222a31;border-radius:12px;overflow:hidden}
.card.ok{border-color:var(--ok)}
.card.no{border-color:var(--no);opacity:.4}
.card img{width:100%;height:110px;object-fit:cover;display:block;background:#000}
.btns{display:flex;gap:6px;padding:8px}
.btns button{flex:1;padding:10px;font-size:1.05rem}
.empty{padding:40px 16px;text-align:center;color:#877}
pre{margin:0 16px 20px;background:#0e1216;border:1px solid #222a31;border-radius:10px;padding:10px;font-size:11px;max-height:140px;overflow:auto;color:#9fb0bd;white-space:pre-wrap}
</style></head><body>
<header><div class=wrap>
  <h1>Pexels Room</h1>
  <div class=dim>✓ = saved to library and disappears. ✗ = deleted forever (not saved anywhere) and disappears. What’s left = not clicked yet.</div>
  <div class=row>
    <input id=q placeholder="e.g. cars" autofocus onkeydown="if(event.key==='Enter')go()">
    <button id=btn onclick="go()">GO · 100</button>
    <button class="ghost ok" onclick="approveAll()">✓ Approve rest → library</button>
    <button class="ghost no" onclick="rejectAll()">✗ Reject rest</button>
  </div>
  <div class=job id=job></div>
  <div class=stat>
    <span>Staged <b id=nStaged>0</b></span>
    <span>✓ <b id=nOk>0</b></span>
    <span>✗ <b id=nNo>0</b></span>
    <span>Library lifetime <b id=tSaved>0</b></span>
    <span>Dupes skipped <b id=tSkip>0</b></span>
  </div>
</div></header>
<div class=grid id=grid></div>
<pre id=log>—</pre>
<script>
var busy=false;
function go(){
  var q=document.getElementById('q').value.trim();
  if(!q||busy)return;
  busy=true;document.getElementById('btn').disabled=true;
  document.getElementById('job').textContent='Downloading 100 unique… hang tight';
  document.getElementById('grid').innerHTML='';
  fetch('/api/go',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q,n:100})})
    .then(function(r){return r.json()}).then(function(j){
      if(!j.ok){document.getElementById('job').textContent=j.error||'failed';return;}
      document.getElementById('job').textContent='Ready — '+j.count+' left to review. ✓ = library · ✗ = gone.';
      load();
    }).catch(function(e){document.getElementById('job').textContent=e.message;})
    .finally(function(){busy=false;document.getElementById('btn').disabled=false;});
}
function pick(file,v){
  fetch('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({file:file,vote:v})}).then(load);
}
function approveAll(){fetch('/api/approve-all',{method:'POST'}).then(function(r){return r.json()}).then(function(j){document.getElementById('job').textContent='✓ '+(j.kept||0)+' → library';load();});}
function rejectAll(){if(!confirm('Reject ALL remaining and delete?'))return;fetch('/api/reject-all',{method:'POST'}).then(function(r){return r.json()}).then(function(j){document.getElementById('job').textContent='✗ '+(j.dumped||0)+' removed';load();});}
function load(){
  fetch('/api/status').then(function(r){return r.json()}).then(function(s){
    document.getElementById('tSaved').textContent=s.totals.saved||0;
    document.getElementById('tSkip').textContent=s.totals.skipped||0;
    document.getElementById('log').textContent=(s.log||[]).join('\\n')||'—';
    if(s.running){
      document.getElementById('job').textContent='Downloading '+s.running.saved+'/'+s.running.target+' (page '+s.running.page+') · skipped '+s.running.skipped+' dupes';
      document.getElementById('btn').disabled=true;busy=true;
      return;
    }
    var items=(s.batch&&s.batch.items)||[];
    document.getElementById('nStaged').textContent=items.length;
    document.getElementById('nOk').textContent=s.totals.saved||0;
    document.getElementById('nNo').textContent=s.totals.rejected||0;
    var g=document.getElementById('grid');
    if(!items.length){g.innerHTML='<div class=empty>Nothing left to review — type a subject and hit GO for another 100.</div>';return;}
    g.innerHTML=items.map(function(it){
      return '<div class="card" id="c'+it.pexelsId+'"><img loading=lazy src="/img/'+encodeURIComponent(it.file)+'"><div class=btns><button class=ok onclick="pick(\\''+it.file.replace(/'/g,"\\\\'")+'\\',\\'ok\\')">✓</button><button class=no onclick="pick(\\''+it.file.replace(/'/g,"\\\\'")+'\\',\\'no\\')">✗</button></div></div>';
    }).join('');
  }).catch(function(){});
}
setInterval(load,2000);load();
</script></body></html>`;

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    const readBody = () => new Promise(r => {
      let b = '';
      req.on('data', c => b += c);
      req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (e) { r({}); } });
    });

    if (u.pathname === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(JSON.stringify({
        key: !!API_KEY,
        totals: state.totals,
        running,
        batch,
        library: LIBRARY,
        staging: STAGING,
        log: state.log
      }));
    }

    if (u.pathname.startsWith('/img/')) {
      const file = decodeURIComponent(u.pathname.slice(5).split('?')[0]);
      if (file.includes('..') || file.includes('/') || file.includes('\\')) { res.writeHead(400); return res.end(); }
      const p = path.join(STAGING, file);
      if (fs.existsSync(p)) { res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' }); return res.end(fs.readFileSync(p)); }
      const lib = path.join(LIBRARY, file);
      if (fs.existsSync(lib)) { res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' }); return res.end(fs.readFileSync(lib)); }
      res.writeHead(404); return res.end();
    }

    if (u.pathname === '/api/go' && req.method === 'POST') {
      const d = await readBody();
      const query = String(d.query || '').trim();
      if (!query) { res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, error: 'type what you want' })); }
      if (running) { res.writeHead(409, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, error: 'already downloading' })); }
      try {
        const r = await grabBatch(query, Number(d.n) || BATCH);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(r));
      } catch (e) {
        running = null;
        log('ERROR: ' + e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: String(e.message || e) }));
      }
    }

    if (u.pathname === '/api/vote' && req.method === 'POST') {
      const d = await readBody();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(applyVote(d.file, d.vote)));
    }
    if (u.pathname === '/api/approve-all' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(approveAll()));
    }
    if (u.pathname === '/api/reject-all' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(rejectAll()));
    }
    if (u.pathname === '/api/commit' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(commitBatch()));
    }
    if (u.pathname === '/api/purge-staging' && req.method === 'POST') {
      const n = purgeStaging();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, deleted: n }));
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(PANEL);
  } catch (e) {
    res.writeHead(500);
    res.end(esc(e.message));
  }
}).listen(PORT, '0.0.0.0', () => {
  ensureDirs();
  console.log('[pexels-room] http://localhost:' + PORT + '  ·  http://' + LAN + ':' + PORT);
  console.log('[pexels-room] staging → ' + STAGING);
  console.log('[pexels-room] library → ' + LIBRARY + (API_KEY ? '  · key ✓' : '  · MISSING KEY'));
});
