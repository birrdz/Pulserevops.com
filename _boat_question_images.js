// _boat_question_images.js — same play as the car importer, but for the BOATS pillar. Reads the current boats
// question, pulls its exact ranked models (@@PRODUCT), and drops 20 WHOLE-BOAT photos (no crop) into the image
// room. ONE_SHOT=1 → do just the current question then exit (owner: "stop after enough for the first Q&A").
// Otherwise loops one question every CAR_IMG_EVERY_MS. HARD no-duplicates (shared ledgers). owner 2026-07-10
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const PEXELS = process.env.PEXELS_API_KEY;
const POOL = WD + '/assets/qa/_gp_pool';
const MANI = WD + '/_gp_pool_manifest.json';
const HASHES_F = WD + '/_gp_pool_hashes.json';
const URLS_F = WD + '/_pexels_import_urls.json';
const CURSOR_F = WD + '/_boat_qimg_cursor.json';
const PER_Q = parseInt(process.env.BOAT_IMG_PER_Q || '20', 10);
const EVERY_MS = parseInt(process.env.BOAT_IMG_EVERY_MS || '300000', 10);
const SLOT_BASE = parseInt(process.env.BOAT_IMG_SLOT_BASE || '50000', 10);   // own slot range
const ONE_SHOT = process.env.BOAT_ONE_SHOT === '1';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const hashBuf = b => crypto.createHash('sha256').update(b).digest('hex');
const seenHashes = new Set(loadJSON(HASHES_F, []));
const seenUrls = new Set(loadJSON(URLS_F, []));
const saveHashes = () => { try { fs.writeFileSync(HASHES_F, JSON.stringify([...seenHashes])); } catch (e) {} };
const saveUrls = () => { try { fs.writeFileSync(URLS_F, JSON.stringify([...seenUrls].slice(-50000))); } catch (e) {} };

function deriveBoatQuery(e) {
  let t = String(e.question || e.title || '').replace(/^\s*Top\s*10\s*/i, '').replace(/\s+[—–].*$/, '').replace(/:\s.*$/, '').replace(/\b(19|20)\d{2}\b/g, '').trim();
  t = t.replace(/\bBoats\b/i, 'Boat').replace(/\s+/g, ' ').trim();
  return (t || 'boat').trim();
}
function extractModels(body) {
  const out = []; const re = /@@PRODUCT\s+name="([^"]+)"/g; let m;
  while ((m = re.exec(body))) { const n = m[1].trim(); if (n && !out.includes(n)) out.push(n); }
  return out.slice(0, 10);
}
async function saveWhole(buf, outPath) {
  await sharp(buf, { animated: false }).resize(760, 760, { fit: 'contain', background: { r: 12, g: 12, b: 14 } }).modulate({ brightness: 1.03 }).jpeg({ quality: 90 }).toFile(outPath);
}
async function pexelsWholeBoat(q, need) {
  const out = []; let page = (loadJSON(CURSOR_F, {}).pg || {})[q] || 0; let tries = 0;
  while (out.length < need && tries < 6) {
    tries++; page++;
    try {
      const r = await fetch('https://api.pexels.com/v1/search?per_page=80&orientation=landscape&page=' + page + '&query=' + encodeURIComponent(q + ' boat'), { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
      if (r.ok) { for (const p of ((await r.json()).photos || [])) { const u = p.src && (p.src.large2x || p.src.large); if (u && !seenUrls.has(u)) { out.push(u); if (out.length >= need) break; } } }
    } catch (e) {}
    await sleep(1200);
  }
  return { urls: out, page };
}
async function tick() {
  const idx = await store.get('_index.json', { type: 'json' });
  const boats = (idx.entries || []).filter(e => /^bt\d/.test(e.id)).sort((a, b) => a.id.localeCompare(b.id));
  if (!boats.length) { console.log('[boat-qimg] no boats entries'); return; }
  const cur = loadJSON(CURSOR_F, { i: 0, pg: {} });
  const e = boats[cur.i % boats.length];
  let body = ''; try { const be = await store.get('answers/' + e.id + '.json', { type: 'json' }); body = (be && (be.answer || be.body)) || ''; } catch (er) {}
  const models = extractModels(body);
  const queries = models.length ? models : [deriveBoatQuery(e)];
  console.log('[boat-qimg] ' + new Date().toISOString() + ' Q#' + ((cur.i % boats.length) + 1) + '/' + boats.length + ' ' + e.id + ' → ' + queries.length + ' exact models: ' + queries.join(', ').slice(0, 90));
  const mani = loadJSON(MANI, { slots: [] });
  const used = new Set(mani.slots.map(s => s.slot));
  let slot = SLOT_BASE; const nextSlot = () => { while (used.has(slot)) slot++; used.add(slot); return slot; };
  cur.pg = cur.pg || {};
  const perModel = Math.max(2, Math.ceil(PER_Q / queries.length));
  let n = 0;
  for (const q of queries) {
    if (n >= PER_Q) break;
    const { urls, page } = await pexelsWholeBoat(q, perModel * 3);
    cur.pg[q] = page; let got = 0;
    for (const u of urls) {
      if (n >= PER_Q || got >= perModel) break;
      if (seenUrls.has(u)) continue; seenUrls.add(u);
      try {
        const ir = await fetch(u, { signal: AbortSignal.timeout(30000) }); if (!ir.ok) continue;
        const buf = Buffer.from(await ir.arrayBuffer()); if (buf.length < 3000) continue;
        const h = hashBuf(buf); if (seenHashes.has(h)) continue; seenHashes.add(h);
        const s = nextSlot();
        await saveWhole(buf, POOL + '/' + String(s).padStart(3, '0') + '.jpg');
        mani.slots.push({ slot: s, ok: true, scene: q + ' · ' + e.id, provider: 'boat-question', hash: h.slice(0, 12), src: u, model: q, entry: e.id });
        n++; got++;
      } catch (err) {}
    }
  }
  try { fs.writeFileSync(MANI, JSON.stringify(mani, null, 1)); } catch (e2) {}
  saveHashes(); saveUrls();
  cur.i = (cur.i % boats.length) + 1;
  try { fs.writeFileSync(CURSOR_F, JSON.stringify(cur)); } catch (e2) {}
  console.log('[boat-qimg]   sent ' + n + ' whole-boat photos across ' + queries.length + ' exact models → gallery' + (ONE_SHOT ? ' · ONE-SHOT done, stopping' : ' · next up Q#' + ((cur.i % boats.length) + 1)));
}
(async () => {
  console.log('[boat-qimg] boats' + (ONE_SHOT ? ' (ONE-SHOT: first Q&A only)' : ' — ' + PER_Q + ' every ' + (EVERY_MS / 60000) + ' min') + '. seen: ' + seenHashes.size + ' hashes');
  if (ONE_SHOT) { try { await tick(); } catch (e) { console.log('[boat-qimg] err ' + e.message); } process.exit(0); }
  for (;;) { try { await tick(); } catch (e) { console.log('[boat-qimg] tick err ' + e.message); } await sleep(EVERY_MS); }
})();
