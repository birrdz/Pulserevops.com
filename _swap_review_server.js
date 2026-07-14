// _swap_review_server.js — BEFORE/AFTER swap review room (:8907). For each Cars Top-10 whose new car photos
// you've APPROVED in the image room, show every ranked model's CURRENT internal image next to the best NEW
// approved photo. Default is KEEP the old one. You click SWAP only when the new one is clearly better; anything
// you don't touch stays. Internal @@PRODUCT image swaps go live instantly via the blob (no deploy). The face
// card is deploy-gated, so an approved cover swap is staged for the next deploy. owner 2026-07-10
'use strict';
const fs = require('fs');
const http = require('http');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PORT = 8907;
const POOL = WD + '/assets/qa/_gp_pool';
const MANI = WD + '/_gp_pool_manifest.json';
const APPROVAL = WD + '/_gp_pool_approval.json';
const REVIEWED_F = WD + '/_swap_reviewed.json';      // slots already acted on (swapped or kept) — never re-shown
const STAGED_COVERS_F = WD + '/_swap_staged_covers.json';   // cover swaps waiting for the next deploy
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const saveJSON = (f, o) => { try { fs.writeFileSync(f, JSON.stringify(o)); } catch (e) {} };
const OK = new Set([true, 1, 'ok', 'approve', 'approved', 'yes']);

// approved car-question photos, grouped by entry → model → [slots]
function approvedByEntry() {
  const mani = loadJSON(MANI, { slots: [] });
  const appr = loadJSON(APPROVAL, {});
  const reviewed = new Set(loadJSON(REVIEWED_F, []));
  const out = {};
  for (const s of mani.slots) {
    if (s.provider !== 'car-question' || !s.entry || !s.model) continue;
    if (!OK.has(appr[s.slot]) && !OK.has(appr[String(s.slot)])) continue;   // only ones you approved
    if (reviewed.has(s.slot)) continue;
    ((out[s.entry] = out[s.entry] || {})[s.model] = (out[s.entry][s.model] || [])).push(s);
  }
  return out;
}

async function entryProducts(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e) return null;
  const body = e.answer || e.body || '';
  const prods = []; const re = /@@PRODUCT\s+name="([^"]+)"\s+img="([^"]*)"/g; let m;
  while ((m = re.exec(body))) prods.push({ name: m[1].trim(), img: m[2] });
  return { e, body, prods, cover_src: e.cover_src, question: e.question || e.h1 || id };
}

async function buildQueue() {
  const grp = approvedByEntry();
  const q = [];
  for (const id of Object.keys(grp).sort()) {
    const ep = await entryProducts(id).catch(() => null);
    if (!ep) continue;
    const rows = [];
    for (const p of ep.prods) {
      const slots = grp[id][p.name] || grp[id][Object.keys(grp[id]).find(k => k.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(k.toLowerCase())) || ''] || [];
      if (slots.length) rows.push({ model: p.name, current: p.img, slot: slots[0].slot });
    }
    if (rows.length) q.push({ id, question: ep.question, rows });   // only entries that actually have approved upgrades
  }
  return q;
}

async function doSwap(id, model, slot) {
  const mani = loadJSON(MANI, { slots: [] });
  const s = mani.slots.find(x => x.slot == slot);
  if (!s || !s.src) return { ok: false, msg: 'no source url for slot' };
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e) return { ok: false, msg: 'no entry' };
  let body = e.answer || e.body || '';
  const esc = model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(@@PRODUCT\\s+name="' + esc + '"\\s+img=")([^"]*)(")');
  if (!re.test(body)) return { ok: false, msg: 'model not found in body' };
  body = body.replace(re, '$1' + s.src + '$3');
  await store.setJSON('answers/' + id + '.json', Object.assign({}, e, { answer: body }));
  const reviewed = new Set(loadJSON(REVIEWED_F, [])); reviewed.add(Number(slot)); saveJSON(REVIEWED_F, [...reviewed]);
  return { ok: true };
}
function markKept(slot) { const r = new Set(loadJSON(REVIEWED_F, [])); r.add(Number(slot)); saveJSON(REVIEWED_F, [...r]); }
function markEntryKept(slots) { const r = new Set(loadJSON(REVIEWED_F, [])); slots.forEach(s => r.add(Number(s))); saveJSON(REVIEWED_F, [...r]); }

const page = (q) => `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">
<title>Car Image Swap Review</title><style>
body{background:#0a0806;color:#eee;font:15px/1.5 system-ui;margin:0;padding:18px;max-width:1000px;margin:0 auto}
h1{font-size:20px}.sub{color:#8a8680;margin-bottom:16px}
.entry{background:#15110d;border:1px solid #2a2118;border-radius:12px;padding:14px;margin:14px 0}
.eh{font-weight:700;color:#FFB81C;margin-bottom:4px}.eq{color:#c8c2b8;font-size:13px;margin-bottom:10px}
.row{display:grid;grid-template-columns:150px 1fr 1fr auto;gap:12px;align-items:center;padding:8px 0;border-top:1px solid #221a12}
.model{font-weight:600}.lab{font-size:11px;color:#8a8680;text-transform:uppercase}
img{width:100%;max-width:220px;height:132px;object-fit:contain;background:#000;border-radius:8px}
button{border:0;border-radius:8px;padding:9px 14px;font-weight:700;cursor:pointer;margin:2px}
.swap{background:#1a7f4b;color:#fff}.keep{background:#2a2118;color:#c8c2b8}.skip{background:#4a1520;color:#f2b8c0}
.done{opacity:.4}.empty{color:#8a8680;padding:40px;text-align:center}
</style>
<h1>🚗 Car image swap review</h1>
<div class=sub>Before → After. Default is <b>KEEP</b>. Hit <b>Swap</b> only when the new shot is clearly better. Internal swaps go live instantly. ${q.length} ${q.length === 1 ? 'entry' : 'entries'} with approved upgrades.</div>
${q.length ? q.map(en => `<div class=entry id="e-${en.id}"><div class=eh>${en.id}</div><div class=eq>${en.question}</div>
${en.rows.map(r => `<div class=row id="r-${en.id}-${r.slot}">
<div class=model>${r.model}</div>
<div><div class=lab>current</div><img src="${r.current || ''}" onerror="this.style.opacity=.2"></div>
<div><div class=lab>new (approved)</div><img src="/pool/${r.slot}"></div>
<div><button class=swap onclick="act('swap','${en.id}','${encodeURIComponent(r.model)}',${r.slot})">✓ Swap</button>
<button class=keep onclick="act('keep','${en.id}','',${r.slot})">Keep</button></div></div>`).join('')}
<div style="margin-top:10px"><button class=skip onclick="skipEntry('${en.id}',[${en.rows.map(r => r.slot).join(',')}])">Skip whole entry — new ones aren't better</button></div>
</div>`).join('') : '<div class=empty>No entries to review yet. Approve a Top-10 crop of car photos in the image room and it will show up here.</div>'}
<script>
async function act(kind,id,model,slot){const r=document.getElementById('r-'+id+'-'+slot);r.classList.add('done');
await fetch('/'+kind,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,model:decodeURIComponent(model),slot})});}
async function skipEntry(id,slots){document.getElementById('e-'+id).classList.add('done');
await fetch('/skip-entry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slots})});
setTimeout(()=>location.reload(),400);}
</script>`;

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/' ) { const q = await buildQueue(); res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(page(q)); }
    if (u.pathname.startsWith('/pool/')) { const slot = u.pathname.slice(6).replace(/\D/g, ''); const f = POOL + '/' + String(slot).padStart(3, '0') + '.jpg'; if (fs.existsSync(f)) { res.writeHead(200, { 'Content-Type': 'image/jpeg' }); return res.end(fs.readFileSync(f)); } res.writeHead(404); return res.end(); }
    if (req.method === 'POST') {
      let b = ''; req.on('data', c => b += c); req.on('end', async () => {
        let d = {}; try { d = JSON.parse(b || '{}'); } catch (e) {}
        if (u.pathname === '/swap') { const r = await doSwap(d.id, d.model, d.slot); res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(r)); }
        if (u.pathname === '/keep') { markKept(d.slot); res.writeHead(200); return res.end('{}'); }
        if (u.pathname === '/skip-entry') { markEntryKept(d.slots || []); res.writeHead(200); return res.end('{}'); }
        res.writeHead(404); res.end();
      });
      return;
    }
    res.writeHead(404); res.end();
  } catch (e) { res.writeHead(500); res.end(String(e.message)); }
}).listen(PORT, '0.0.0.0', () => console.log('[swap-review] http://localhost:' + PORT + '  (and http://192.168.5.68:' + PORT + ')'));
