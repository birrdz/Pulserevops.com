// Apply owner-curated hero picks (_cat_reference*.json, keepers) → /assets/qa/<id>.jpg + _index.json img
// ⚠️ PAUSED 2026-07-04: crossover IMAGE LAW requires Pollinator flux face-cards (cover_src:'flux').
// Curated DDG URLs must NOT overwrite heroes — use _image_scrub.js (flux cover + DDG sections) instead.
// Skips _cat_reference5.json for sp/tv/sw/sk (superseded by _cat_reference6.json). Fishing keepers = section idx (skip).
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
process.chdir(WD);
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { storeGradedImage, coverPath, stampDdgProvenance } = require('./_ddg_facecard_lib');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const SKIP5 = new Set(['sp', 'tv', 'sw', 'sk']);
const REF_FILES = [
  '_cat_reference.json', '_cat_reference2.json', '_cat_reference3.json', '_cat_reference4.json',
  '_cat_reference5.json', '_cat_reference6.json', '_movies_keepers.json',
];
const DRY = process.argv.includes('--dry');
const LIMIT = parseInt(process.argv.find(a => /^\d+$/.test(a)) || '99999', 10);

async function grab(u) {
  try {
    const r = await fetch(u, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'PulseImageApply/1.0' } });
    if (!r.ok) return null;
    const b = Buffer.from(await r.arrayBuffer());
    return b.length > 4000 ? b : null;
  } catch (e) { return null; }
}

function loadPicks() {
  const picks = {};
  for (const f of REF_FILES) {
    if (!fs.existsSync(f)) continue;
    let j = {}; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { continue; }
    for (const [id, v] of Object.entries(j)) {
      if (!v || typeof v !== 'object') continue;
      if (f === '_cat_reference5.json' && SKIP5.has((String(id).match(/^[a-z]+/) || [''])[0])) continue;
      const url = v.url;
      if (!url || typeof url !== 'string') continue;
      picks[id] = url;
    }
  }
  return picks;
}

(async () => {
  const picks = loadPicks();
  const ids = Object.keys(picks).slice(0, LIMIT);
  console.log('[apply-covers] picks=' + Object.keys(picks).length + ' applying=' + ids.length + (DRY ? ' DRY' : ''));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let ok = 0, fail = 0, idxCh = 0;
  for (const id of ids) {
    const url = picks[id];
    const dest = coverPath(id);
    if (DRY) { console.log('  would', id, url.slice(0, 72)); ok++; continue; }
    const raw = await grab(url);
    if (!raw) { console.log('  FAIL fetch', id); fail++; continue; }
    try {
      if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
      await storeGradedImage(raw, dest, { square: 760, bright: false });
      const rel = '/assets/qa/' + id + '.jpg';
      const en = (idx.entries || []).find(e => e && e.id === id);
      if (en && en.img !== rel) { en.img = rel; idxCh++; }
      await stampDdgProvenance(id, store);
      ok++;
      if (ok % 10 === 0) console.log('[apply-covers]', ok + '/' + ids.length, id);
    } catch (e) {
      console.log('  FAIL grade', id, e.message);
      fail++;
    }
  }
  if (idxCh && !DRY) await store.setJSON('_index.json', idx);
  console.log('[apply-covers] DONE ok=' + ok + ' fail=' + fail + ' index_updated=' + idxCh);
})().catch(e => { console.error('[apply-covers] FATAL', e); process.exit(1); });
