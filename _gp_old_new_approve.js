'use strict';
// GTM old vs new — START OVER.
// Square face cards like the site. Dupes OK when the photo matches the title.
const fs = require('fs');
const http = require('http');
const path = require('path');
const https = require('https');
const sharp = require('sharp');
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
const flib = require('./_ddg_facecard_lib');
const { queryForTitle, subjectFromTitle, PEOPLE_FALLBACK } = require('./_gp_topic_image_queries');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');

const PORT = 8916;
const QA = path.join(WD, 'assets', 'qa');
const OLD_DIR = path.join(QA, '_gp_old_backup');
const NEW_DIR = path.join(QA, '_gp_new_preview'); // working "new" squares for this board
const STATE_F = path.join(WD, '_gp_old_new_approve_state.json');
const REVIEW_F = path.join(WD, '_gp_topic_review_state.json');
const PROD = 'https://pulserevops.com';
const PEXELS = process.env.PEXELS_API_KEY || '';
const BOX = 760;

try { fs.mkdirSync(OLD_DIR, { recursive: true }); } catch (e) {}
try { fs.mkdirSync(NEW_DIR, { recursive: true }); } catch (e) {}

function loadJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function saveJSON(f, o) { fs.writeFileSync(f, JSON.stringify(o, null, 1)); }
function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}
function freshVote() { return { kept: {}, reverted: {}, meta: {} }; }

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : require('http');
    const req = mod.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuf(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

/** Site face-card square: 760×760 contain (whole photo), black letterbox. */
async function writeSquare(dest, buf) {
  const rotated = await sharp(buf).rotate().toBuffer();
  await sharp({
    create: { width: BOX, height: BOX, channels: 3, background: { r: 0, g: 0, b: 0 } },
  }).composite([{
    input: await sharp(rotated).resize(BOX, BOX, {
      fit: 'inside',
      withoutEnlargement: false,
    }).jpeg({ quality: 90, mozjpeg: true }).toBuffer(),
    gravity: 'centre',
  }]).jpeg({ quality: 86, mozjpeg: true }).toFile(dest);
}

async function ensureOldSquare(id) {
  const dest = path.join(OLD_DIR, id + '.jpg');
  if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
    const m = await sharp(dest).metadata();
    if (m.width === BOX && m.height === BOX) return dest;
  }
  let buf;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) buf = fs.readFileSync(dest);
  else buf = await fetchBuf(PROD + '/assets/qa/' + id + '.jpg');
  await writeSquare(dest, buf);
  return dest;
}

async function ensureNewSquare(id) {
  const dest = path.join(NEW_DIR, id + '.jpg');
  const live = path.join(QA, id + '.jpg');
  if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
    const m = await sharp(dest).metadata();
    if (m.width === BOX && m.height === BOX) return dest;
  }
  if (!fs.existsSync(live) || fs.statSync(live).size < 5000) throw new Error('no new face');
  await writeSquare(dest, fs.readFileSync(live));
  return dest;
}

async function pexelsSearch(query, page) {
  if (!PEXELS) return [];
  const url = 'https://api.pexels.com/v1/search?per_page=30&orientation=square'
    + '&page=' + page
    + '&query=' + encodeURIComponent(query);
  const r = await fetch(url, { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) return [];
  const j = await r.json();
  const out = [];
  for (const p of j.photos || []) {
    if (!p || !p.id || p.width < 800) continue;
    const u = (p.src && (p.src.original || p.src.large2x || p.src.large)) || '';
    if (u) out.push({ id: String(p.id), url: u });
  }
  return out;
}

/** Pick a new photo. DUPES ALLOWED when title-matched (owner). Skip only same photo already on THIS card. */
async function pickNewForTitle(id, title, meta) {
  const avoid = new Set();
  if (meta && meta.photoId) avoid.add(String(meta.photoId));
  const qMeta = queryForTitle(title);
  const subject = qMeta.subject || subjectFromTitle(title);
  const queries = [
    qMeta.query,
    subject ? subject + ' people working' : '',
    subject ? subject + ' professionals' : '',
    PEOPLE_FALLBACK,
  ].filter(Boolean);

  for (const q of queries) {
    for (let page = 1; page <= 4; page++) {
      const hits = await pexelsSearch(q, page);
      for (const h of hits) {
        if (avoid.has(h.id)) continue; // only skip the one currently showing on this card
        try {
          const ir = await fetch(h.url, { signal: AbortSignal.timeout(30000) });
          if (!ir.ok) continue;
          const buf = Buffer.from(await ir.arrayBuffer());
          if (buf.length < 8000) continue;
          const dest = path.join(NEW_DIR, id + '.jpg');
          const raw = path.join(NEW_DIR, id + '.raw.jpg');
          fs.writeFileSync(raw, buf);
          await writeSquare(dest, buf);
          return {
            photoId: h.id,
            srcUrl: h.url,
            query: q,
            zoomLevel: 0,
          };
        } catch (e) {}
      }
      if (!hits.length) break;
    }
  }
  return null;
}

/** Zoom out = reframe SAME original as full square contain. */
async function zoomOutNew(id, meta) {
  const raw = path.join(NEW_DIR, id + '.raw.jpg');
  let buf;
  if (fs.existsSync(raw) && fs.statSync(raw).size > 5000) buf = fs.readFileSync(raw);
  else if (meta && meta.srcUrl) buf = await fetchBuf(meta.srcUrl);
  else {
    const cur = path.join(NEW_DIR, id + '.jpg');
    if (fs.existsSync(cur)) buf = fs.readFileSync(cur);
  }
  if (!buf) throw new Error('no source for zoom');
  const dest = path.join(NEW_DIR, id + '.jpg');
  fs.writeFileSync(raw, buf);
  await writeSquare(dest, buf);
  return { zoomLevel: (meta.zoomLevel || 0) + 1 };
}

function rcard(label, imgSrc, title, tone) {
  return `<div class="slot">
  <div class="lab ${tone}">${esc(label)}</div>
  <div class="rcard">
    <span class="rcard-imgwrap"><img src="${esc(imgSrc)}" alt=""></span>
    <div class="rc">GTM PLAYBOOKS</div>
    <div class="rt"><span>${esc(title)}</span></div>
  </div>
</div>`;
}

(async () => {
  // Fresh vote state every start-over
  let vote = freshVote();
  saveJSON(STATE_F, vote);

  const review = loadJSON(REVIEW_F, { approved: {} });
  const ids = Object.keys(review.approved || {}).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }));

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = {};
  for (const e of (idx && idx.entries) || []) if (e && e.id) byId[e.id] = e;

  console.log('[old-new] preparing ' + ids.length + ' square pairs…');
  const rows = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const e = byId[id] || {};
    const title = e.question || e.title || e.h1 || id;
    const meta = Object.assign({}, review.approved[id] || {});
    try {
      await ensureOldSquare(id);
      await ensureNewSquare(id);
      // keep raw for zoom if stage raw exists
      const stageRaw = path.join(QA, '_gp_topic_stage', id + '.raw.jpg');
      const newRaw = path.join(NEW_DIR, id + '.raw.jpg');
      if (fs.existsSync(stageRaw) && !fs.existsSync(newRaw)) {
        fs.copyFileSync(stageRaw, newRaw);
      }
      vote.meta[id] = {
        photoId: meta.photoId || '',
        srcUrl: meta.srcUrl || '',
        query: meta.query || '',
        zoomLevel: 0,
        title,
      };
      rows.push({ id, title, query: meta.query || '' });
    } catch (err) {
      console.log('  skip ' + id + ' ' + err.message);
    }
    if ((i + 1) % 40 === 0) console.log('  … ' + (i + 1) + '/' + ids.length);
  }
  saveJSON(STATE_F, vote);
  console.log('[old-new] ready ' + rows.length);

  async function applyKeepNew(id) {
    const src = path.join(NEW_DIR, id + '.jpg');
    fs.copyFileSync(src, path.join(QA, id + '.jpg'));
    vote.kept[id] = { at: Date.now() };
    delete vote.reverted[id];
    saveJSON(STATE_F, vote);
    try {
      const blob = await store.get('answers/' + id + '.json', { type: 'json' });
      if (blob && blob.answer) {
        const q = blob.question || blob.h1 || blob.title || id;
        blob.answer = syncHeroDupesFaceCard(id, q, blob.answer);
        blob.img = '/assets/qa/' + id + '.jpg';
        blob.cover_src = 'pexels-topic';
        await store.setJSON('answers/' + id + '.json', blob);
      }
    } catch (e) {}
    return { ok: true };
  }

  async function applyKeepOld(id) {
    const src = path.join(OLD_DIR, id + '.jpg');
    fs.copyFileSync(src, path.join(QA, id + '.jpg'));
    vote.reverted[id] = { at: Date.now() };
    delete vote.kept[id];
    const rev = loadJSON(REVIEW_F, {});
    if (rev.approved) delete rev.approved[id];
    saveJSON(REVIEW_F, rev);
    saveJSON(STATE_F, vote);
    try {
      const blob = await store.get('answers/' + id + '.json', { type: 'json' });
      if (blob && blob.answer) {
        const q = blob.question || blob.h1 || blob.title || id;
        blob.answer = syncHeroDupesFaceCard(id, q, blob.answer);
        blob.img = '/assets/qa/' + id + '.jpg';
        blob.cover_src = 'kept-old';
        await store.setJSON('answers/' + id + '.json', blob);
      }
    } catch (e) {}
    return { ok: true };
  }

  async function applyZoom(id) {
    const meta = vote.meta[id] || {};
    const z = await zoomOutNew(id, meta);
    vote.meta[id] = Object.assign({}, meta, z);
    saveJSON(STATE_F, vote);
    return { ok: true, v: Date.now() };
  }

  async function applyTryNew(id) {
    const row = rows.find((r) => r.id === id);
    const title = (vote.meta[id] && vote.meta[id].title) || (row && row.title) || id;
    const meta = vote.meta[id] || {};
    const picked = await pickNewForTitle(id, title, meta);
    if (!picked) return { ok: false, msg: 'no new photo found' };
    vote.meta[id] = Object.assign({}, meta, picked);
    saveJSON(STATE_F, vote);
    return { ok: true, v: Date.now(), query: picked.query };
  }

  function pageHtml() {
    const pending = rows.filter((r) => !vote.kept[r.id] && !vote.reverted[r.id]);
    const keptN = Object.keys(vote.kept).length;
    const revN = Object.keys(vote.reverted).length;
    const v = Date.now();
    return `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">
<title>GTM — old vs new</title>
<style>
html,body{margin:0;background:#000;color:#eee;font:14px/1.4 system-ui}
body{padding:14px clamp(12px,3vw,28px) 48px}
h1{font:800 1.15rem Georgia,serif;color:#F6C445;margin:0 0 6px}
.sub{color:#9a958c;margin:0 0 12px}
.bar{display:flex;gap:14px;flex-wrap:wrap;margin:0 0 16px;position:sticky;top:0;background:#000;padding:10px 0;z-index:20;border-bottom:1px solid #222}
.bar b{color:#EAC15C}
.list{display:flex;flex-direction:column;gap:28px}
.card{padding:4px 0 18px;border-bottom:1px solid #1a1a1a}
.qid{font:700 .7rem/1 ui-monospace,Consolas,monospace;color:#666;margin:0 0 10px}
.pair{display:flex;gap:22px;flex-wrap:wrap;align-items:flex-start}
.slot{width:220px;display:flex;flex-direction:column;gap:6px}
.lab{font:800 .65rem/1 system-ui;letter-spacing:.08em;text-transform:uppercase;text-align:center}
.lab.old{color:#f88}.lab.new{color:#8d8}
.rcard{display:flex;flex-direction:column;width:220px;height:362px;background:#000;border:7px solid #EAC15C;box-sizing:border-box;overflow:hidden;
  box-shadow:inset 0 0 0 2px rgba(8,6,4,.92),inset 0 0 0 6px rgba(234,193,92,.55),0 6px 18px rgba(0,0,0,.45)}
.rcard-imgwrap{display:block;width:100%;height:220px;flex:0 0 220px;overflow:hidden;background:#000;border-bottom:1px solid rgba(234,193,92,.35)}
.rcard-imgwrap img{width:100%;height:100%;object-fit:contain;object-position:center center;display:block;background:#000}
.rc{padding:8px 10px 0;color:#EAC15C;font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;font-weight:800;text-align:center}
.rt{padding:8px 12px 16px;color:#F6C445;font-family:Georgia,serif;font-size:1.2rem;line-height:1.16;font-weight:800;text-align:center;
  display:flex;align-items:center;justify-content:center;flex:1;min-height:0}
.rt>span{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;width:100%}
.acts{display:grid;grid-template-columns:1fr 1fr;gap:6px;width:462px;max-width:100%;margin-top:12px}
button{border:0;border-radius:8px;padding:12px 8px;font:800 .78rem/1.1 system-ui;cursor:pointer;color:#fff}
.yes{background:#1a8f4c}.no{background:#7a1520}.zoom{background:#1a4a7a}.try{background:#6b4a12}
button:disabled{opacity:.45;cursor:wait}
</style>
<h1>GTM — old vs new</h1>
<p class=sub>Site square face cards. Left = old · Right = new. Dupes OK if they match the title. <b>✓ Keep new</b> · <b>✗ Keep old</b> · <b>Zoom out</b> · <b>Try a new one</b>.</p>
<div class=bar>
  <span>Left <b id=leftn>${pending.length}</b></span>
  <span>✓ new <b id=okn>${keptN}</b></span>
  <span>✗ old <b id=non>${revN}</b></span>
</div>
<div class=list id=list>
${pending.map((r) => `<div class="card" data-id="${esc(r.id)}">
<div class=qid>${esc(r.id)}</div>
<div class=pair>
  ${rcard('Old', '/old/' + r.id + '.jpg?v=' + v, r.title, 'old')}
  ${rcard('New', '/new/' + r.id + '.jpg?v=' + v, r.title, 'new')}
</div>
<div class=acts>
  <button type=button class=yes data-id="${esc(r.id)}" data-act="keep-new">✓ Keep new</button>
  <button type=button class=no data-id="${esc(r.id)}" data-act="keep-old">✗ Keep old</button>
  <button type=button class=zoom data-id="${esc(r.id)}" data-act="zoom">Zoom out</button>
  <button type=button class=try data-id="${esc(r.id)}" data-act="try">Try a new one</button>
</div>
</div>`).join('\n')}
</div>
<script>
async function act(id, action) {
  const card = document.querySelector('.card[data-id="'+id+'"]');
  card.querySelectorAll('button').forEach(b => b.disabled = true);
  try {
    const j = await (await fetch('/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,act:action})})).json();
    if (!j.ok) { alert(j.msg||'fail'); card.querySelectorAll('button').forEach(b => b.disabled = false); return; }
    if (action === 'zoom' || action === 'try') {
      const img = card.querySelector('.lab.new')?.parentElement?.querySelector('img')
        || card.querySelectorAll('img')[1];
      if (img) img.src = '/new/'+id+'.jpg?v='+(j.v||Date.now());
      card.querySelectorAll('button').forEach(b => b.disabled = false);
      return;
    }
    card.remove();
    document.getElementById('leftn').textContent = document.querySelectorAll('.card').length;
    document.getElementById('okn').textContent = j.keptN;
    document.getElementById('non').textContent = j.revertedN;
  } catch (e) {
    alert(String(e));
    card.querySelectorAll('button').forEach(b => b.disabled = false);
  }
}
document.getElementById('list').onclick = function(e){
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  act(b.getAttribute('data-id'), b.getAttribute('data-act'));
};
</script>`;
  }

  http.createServer((req, res) => {
    try {
      const u = new URL(req.url, 'http://127.0.0.1');
      if (u.pathname === '/' || u.pathname === '/index.html') {
        vote = loadJSON(STATE_F, vote);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(pageHtml());
      }
      if (u.pathname.startsWith('/old/')) {
        const id = u.pathname.slice(5).replace(/\.jpe?g$/i, '').replace(/[^a-z0-9]/gi, '');
        const f = path.join(OLD_DIR, id + '.jpg');
        if (!fs.existsSync(f)) { res.writeHead(404); return res.end('missing'); }
        res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
        return fs.createReadStream(f).pipe(res);
      }
      if (u.pathname.startsWith('/new/')) {
        const id = u.pathname.slice(5).replace(/\.jpe?g$/i, '').replace(/[^a-z0-9]/gi, '');
        const f = path.join(NEW_DIR, id + '.jpg');
        if (!fs.existsSync(f)) { res.writeHead(404); return res.end('missing'); }
        res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
        return fs.createReadStream(f).pipe(res);
      }
      if (u.pathname === '/vote' && req.method === 'POST') {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', async () => {
          try {
            vote = loadJSON(STATE_F, vote);
            const d = JSON.parse(body || '{}');
            const id = String(d.id || '').replace(/[^a-z0-9]/gi, '');
            let out = { ok: false };
            if (d.act === 'keep-new') out = await applyKeepNew(id);
            else if (d.act === 'keep-old') out = await applyKeepOld(id);
            else if (d.act === 'zoom') out = await applyZoom(id);
            else if (d.act === 'try') out = await applyTryNew(id);
            else out = { ok: false, msg: 'bad act' };
            vote = loadJSON(STATE_F, vote);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(Object.assign({
              keptN: Object.keys(vote.kept || {}).length,
              revertedN: Object.keys(vote.reverted || {}).length,
            }, out)));
          } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, msg: String(e.message || e) }));
          }
        });
        return;
      }
      res.writeHead(404); res.end('not found');
    } catch (e) {
      res.writeHead(500); res.end(String(e.message || e));
    }
  }).listen(PORT, '127.0.0.1', () => {
    console.log('[old-new] http://127.0.0.1:' + PORT + '/  · square cards · dupes OK if title match');
  });
})().catch((e) => { console.error(e); process.exit(1); });
