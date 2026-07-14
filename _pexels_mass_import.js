// _pexels_mass_import.js — every 5 min, mass-import 100 UNIQUE real car photos from Pexels into the image
// room (assets/qa/_gp_pool + manifest → gallery :8905). HARD NO-DUPLICATES: skip any Pexels URL already
// imported AND content-hash every image (shared _gp_pool_hashes.json ledger) so identical bytes never repeat.
// Keeps fetching until it has 100 genuinely-new images. Runs forever. (owner 2026-07-10)
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { grade } = require('./_gp_grade.js');
const PEXELS = process.env.PEXELS_API_KEY;
const POOL = WD + '/assets/qa/_gp_pool';
const MANI = WD + '/_gp_pool_manifest.json';
const HASHES_F = WD + '/_gp_pool_hashes.json';       // shared byte-hash ledger (same as the pool generators)
const URLS_F = WD + '/_pexels_import_urls.json';       // Pexels URLs already pulled
const BATCH = parseInt(process.env.IMPORT_BATCH || '100', 10);
const EVERY_MS = parseInt(process.env.IMPORT_EVERY_MS || '300000', 10);
const SLOT_BASE = parseInt(process.env.IMPORT_SLOT_BASE || '30000', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const MAKES = ['Ford F-150', 'Chevrolet Silverado', 'Ram 1500', 'Jeep Wrangler', 'Toyota Tacoma', 'Ford Bronco', 'Tesla Model 3', 'Ford Mustang', 'Chevrolet Corvette', 'Toyota Camry', 'Honda Civic', 'Jeep Grand Cherokee', 'Toyota 4Runner', 'GMC Sierra', 'Dodge Charger', 'Subaru Outback', 'Honda CR-V', 'Toyota RAV4', 'Chevrolet Tahoe', 'Land Rover Defender', 'Porsche 911', 'BMW M3', 'classic muscle car', 'lifted pickup truck', 'sports car', 'luxury SUV', 'Nissan Altima', 'Kia Telluride', 'Hyundai Santa Fe', 'Chevrolet Camaro', 'Dodge Challenger', 'Ford Explorer', 'Mazda CX-5', 'Volkswagen Golf', 'Audi Q5', 'Mercedes G-Wagon'];
const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2016, 2014, 2012, 2010];
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };

const seenHashes = new Set(loadJSON(HASHES_F, []));
const seenUrls = new Set(loadJSON(URLS_F, []));
const saveHashes = () => { try { fs.writeFileSync(HASHES_F, JSON.stringify([...seenHashes])); } catch (e) {} };
const saveUrls = () => { try { fs.writeFileSync(URLS_F, JSON.stringify([...seenUrls].slice(-50000))); } catch (e) {} };
const hashBuf = b => crypto.createHash('sha256').update(b).digest('hex');
let qi = 0, pg = {};

async function nextNewUrls(need) {
  const out = [];
  let tries = 0;
  while (out.length < need && tries < MAKES.length * 4) {
    tries++;
    const make = MAKES[qi % MAKES.length]; const year = YEARS[(qi >> 2) % YEARS.length]; qi++;
    const q = year + ' ' + make;
    pg[q] = (pg[q] || 0) + 1;                 // paginate this query each time we revisit → fresh photos, not repeats
    try {
      const r = await fetch('https://api.pexels.com/v1/search?per_page=80&page=' + pg[q] + '&query=' + encodeURIComponent(q), { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
      if (r.ok) { for (const p of ((await r.json()).photos || [])) { const u = p.src && (p.src.large2x || p.src.large); if (u && !seenUrls.has(u)) { out.push({ u, q }); if (out.length >= need) break; } } }
    } catch (e) {}
    await sleep(1400);
  }
  return out;
}
async function importBatch() {
  const mani = loadJSON(MANI, { slots: [] });
  const used = new Set(mani.slots.map(s => s.slot));
  let slot = SLOT_BASE; const nextSlot = () => { while (used.has(slot)) slot++; used.add(slot); return slot; };
  let n = 0, dupUrl = 0, dupHash = 0, guard = 0;
  while (n < BATCH && guard < 8) {
    guard++;
    const cands = await nextNewUrls(BATCH - n);
    if (!cands.length) break;
    for (const { u, q } of cands) {
      if (n >= BATCH) break;
      if (seenUrls.has(u)) { dupUrl++; continue; }
      seenUrls.add(u);
      try {
        const ir = await fetch(u, { signal: AbortSignal.timeout(30000) }); if (!ir.ok) continue;
        const buf = Buffer.from(await ir.arrayBuffer()); if (buf.length < 3000) continue;
        const h = hashBuf(buf);
        if (seenHashes.has(h)) { dupHash++; continue; }   // identical bytes already in the room → skip
        seenHashes.add(h);
        const s = nextSlot();
        await grade(buf, POOL + '/' + String(s).padStart(3, '0') + '.jpg', { w: 760, h: 760, pass: 0 });
        mani.slots.push({ slot: s, ok: true, scene: q, provider: 'pexels-import', hash: h.slice(0, 12) });
        n++;
      } catch (e) {}
    }
  }
  try { fs.writeFileSync(MANI, JSON.stringify(mani, null, 1)); } catch (e) {}
  saveHashes(); saveUrls();
  console.log('[mass-import] ' + new Date().toISOString() + ' imported ' + n + ' NEW (skipped ' + dupUrl + ' dup-url + ' + dupHash + ' dup-bytes) → gallery');
}
(async () => {
  console.log('[mass-import] no-dupes mode — ' + BATCH + ' UNIQUE Pexels car photos every ' + (EVERY_MS / 60000) + ' min. seen: ' + seenHashes.size + ' hashes / ' + seenUrls.size + ' urls');
  for (;;) { try { await importBatch(); } catch (e) { console.log('[mass-import] batch err ' + e.message); } await sleep(EVERY_MS); }
})();
