// _car_question_images.js — walk the CARS pillar in question-ID order. Every 5 minutes, take the NEXT car
// question, figure out the vehicle it's about, and drop 5 WHOLE-CAR photos (no crop) into the approval room
// (assets/qa/_gp_pool + manifest → gallery :8905). Advances one question per tick; wraps at the end.
// HARD no-duplicates (shared url + byte-hash ledgers). Whole car only (contain, landscape source). owner 2026-07-10
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
const HASHES_F = WD + '/_gp_pool_hashes.json';         // shared byte-hash ledger (never repeat an image)
const URLS_F = WD + '/_pexels_import_urls.json';       // shared Pexels-URL ledger
const CURSOR_F = WD + '/_car_qimg_cursor.json';        // which question we're on
const PER_Q = parseInt(process.env.CAR_IMG_PER_Q || '50', 10);      // deep pool of the #1 model per question (find the GREAT one)
const EVERY_MS = parseInt(process.env.CAR_IMG_EVERY_MS || '15000', 10);   // short pause between questions — near back-to-back
const SLOT_BASE = parseInt(process.env.CAR_IMG_SLOT_BASE || '40000', 10);  // own slot range (not the mass-import's 30000)
const sleep = ms => new Promise(r => setTimeout(r, ms));
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const hashBuf = b => crypto.createHash('sha256').update(b).digest('hex');
const seenHashes = new Set(loadJSON(HASHES_F, []));
const seenUrls = new Set(loadJSON(URLS_F, []));
const saveHashes = () => { try { fs.writeFileSync(HASHES_F, JSON.stringify([...seenHashes])); } catch (e) {} };
const saveUrls = () => { try { fs.writeFileSync(URLS_F, JSON.stringify([...seenUrls].slice(-50000))); } catch (e) {} };

// "Top 10 Mid-Size SUVs 2027 — Best Overall + Best Value" → "Mid-Size SUV" (the vehicle the question is about).
// If a specific year+make+model is present (e.g. "1995 Ford Mustang …"), keep that instead.
const MAKES = 'Ford|Chevrolet|Chevy|Ram|Dodge|Jeep|Toyota|Honda|Tesla|GMC|Nissan|Subaru|Kia|Hyundai|Mazda|Volkswagen|VW|Audi|BMW|Mercedes|Porsche|Lexus|Acura|Cadillac|Buick|Chrysler|Land Rover|Range Rover|Volvo|Rivian|Lucid';
function deriveCarQuery(e) {
  const raw = String(e.question || e.title || '').trim();
  const spec = raw.match(new RegExp('\\b((?:19|20)\\d{2})\\s+(' + MAKES + ')\\s+([A-Za-z0-9\\-]+)', 'i'));
  if (spec) return spec[1] + ' ' + spec[2] + ' ' + spec[3];           // specific model-year car
  // strip "Top 10", then cut only on a spaced em/en-dash or a colon separator (NOT internal hyphens like "Mid-Size")
  let t = raw.replace(/^\s*Top\s*10\s*/i, '').replace(/\s+[—–].*$/, '').replace(/:\s.*$/, '').replace(/\b(19|20)\d{2}\b/g, '').trim();
  t = t.replace(/\bSUVs\b/i, 'SUV').replace(/\bTrucks\b/i, 'Truck').replace(/\bPickups\b/i, 'Pickup').replace(/\bCars\b/i, 'Car').replace(/\bSedans\b/i, 'Sedan').replace(/\bVans\b/i, 'Van').replace(/\s+/g, ' ').trim();
  return (t || 'car').trim();                                          // vehicle type, e.g. "Mid-Size SUV"
}
// the EXACT models the question ranks, pulled from the body's @@PRODUCT markers (e.g. "Kia Telluride")
function extractModels(body) {
  const out = []; const re = /@@PRODUCT\s+name="([^"]+)"/g; let m;
  while ((m = re.exec(body))) { const n = m[1].trim(); if (n && !out.includes(n)) out.push(n); }
  return out.slice(0, 10);
}

// WHOLE car — letterbox onto a 760x760 tile (contain), never crop. Landscape source preferred at fetch time.
async function saveWhole(buf, outPath, scene) {
  await sharp(buf, { animated: false })
    .resize(760, 760, { fit: 'contain', background: { r: 12, g: 12, b: 14 } })
    .modulate({ brightness: 1.03 })
    .jpeg({ quality: 90 })
    .toFile(outPath);
}

async function pexelsWholeCar(q, need) {
  const out = []; let page = (loadJSON(CURSOR_F, {}).pg || {})[q] || 0;
  let tries = 0;
  while (out.length < need && tries < 12) {   // deep fishing — page far enough to find a great one
    tries++; page++;
    try {
      // orientation=landscape → wide shots = the whole car, not a cropped detail
      const r = await fetch('https://api.pexels.com/v1/search?per_page=80&orientation=landscape&page=' + page + '&query=' + encodeURIComponent(q + ' car exterior'), { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
      if (r.ok) { for (const p of ((await r.json()).photos || [])) { const u = p.src && (p.src.large2x || p.src.large); if (u && !seenUrls.has(u)) { out.push(u); if (out.length >= need) break; } } }
    } catch (e) {}
    await sleep(1200);
  }
  return { urls: out, page };
}

async function tick() {
  const idx = await store.get('_index.json', { type: 'json' });
  const cars = (idx.entries || []).filter(e => /^ca\d/.test(e.id)).sort((a, b) => a.id.localeCompare(b.id));
  if (!cars.length) { console.log('[car-qimg] no cars entries'); return; }
  const cur = loadJSON(CURSOR_F, { i: 0, pg: {} });
  const e = cars[cur.i % cars.length];
  // pull the exact ranked models from the body; fall back to the vehicle-type query for non-Top10 entries
  let body = ''; try { const be = await store.get('answers/' + e.id + '.json', { type: 'json' }); body = (be && (be.answer || be.body)) || ''; } catch (er) {}
  const models = extractModels(body);
  // FOCUS mode (default): go DEEP on the #1 model — that's the cover subject — so there are plenty of shots to
  // find a GREAT one (owner: "send 100 of the image you need, keep fishing til you find the one").
  const FOCUS = process.env.CAR_IMG_FOCUS !== '0';
  const queries = FOCUS && models.length ? [models[0]] : (models.length ? models : [deriveCarQuery(e)]);
  console.log('[car-qimg] ' + new Date().toISOString() + ' Q#' + ((cur.i % cars.length) + 1) + '/' + cars.length + ' ' + e.id + ' → ' + queries.length + ' exact models: ' + queries.join(', ').slice(0, 90));
  const mani = loadJSON(MANI, { slots: [] });
  const used = new Set(mani.slots.map(s => s.slot));
  let slot = SLOT_BASE; const nextSlot = () => { while (used.has(slot)) slot++; used.add(slot); return slot; };
  cur.pg = cur.pg || {};
  const perModel = Math.max(2, Math.ceil(PER_Q / queries.length));     // spread 20 across the ranked models
  let n = 0;
  for (const q of queries) {
    if (n >= PER_Q) break;
    const { urls, page } = await pexelsWholeCar(q, perModel * 3);
    cur.pg[q] = page;
    let got = 0;
    for (const u of urls) {
      if (n >= PER_Q || got >= perModel) break;
      if (seenUrls.has(u)) continue; seenUrls.add(u);
      try {
        const ir = await fetch(u, { signal: AbortSignal.timeout(30000) }); if (!ir.ok) continue;
        const buf = Buffer.from(await ir.arrayBuffer()); if (buf.length < 3000) continue;
        const h = hashBuf(buf); if (seenHashes.has(h)) continue; seenHashes.add(h);
        const s = nextSlot();
        await saveWhole(buf, POOL + '/' + String(s).padStart(3, '0') + '.jpg', q);
        mani.slots.push({ slot: s, ok: true, scene: q + ' · ' + e.id, provider: 'car-question', hash: h.slice(0, 12), src: u, model: q, entry: e.id });
        n++; got++;
      } catch (err) {}
    }
  }
  try { fs.writeFileSync(MANI, JSON.stringify(mani, null, 1)); } catch (e2) {}
  saveHashes(); saveUrls();
  cur.i = (cur.i % cars.length) + 1;   // advance to next question
  try { fs.writeFileSync(CURSOR_F, JSON.stringify(cur)); } catch (e2) {}
  console.log('[car-qimg]   sent ' + n + ' whole-car photos across ' + queries.length + ' exact models → gallery · next up Q#' + ((cur.i % cars.length) + 1));
}

(async () => {
  console.log('[car-qimg] per-question car photos — ' + PER_Q + ' whole-car shots every ' + (EVERY_MS / 60000) + ' min, walking Cars in ID order. seen: ' + seenHashes.size + ' hashes');
  for (;;) { try { await tick(); } catch (e) { console.log('[car-qimg] tick err ' + e.message); } await sleep(EVERY_MS); }
})();
