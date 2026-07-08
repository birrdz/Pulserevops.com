// _index_img_backfill — stamp each index entry with its face-card hero URL (img) so the pillar
// inventory / mosaic can show it without re-reading every blob (owner 2026-07-02). Only stamps REAL
// rendering photos (skips flaky Pollinations — the face lane upgrades those first). MERGE-ON-WRITE per
// batch (re-reads the index fresh before each write) so it never clobbers concurrent certify additions.
// Loops until every entry has a real img. Stop: _index_img_backfill_stop.flag
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const GENERIC = /placeholder|og-preview|pulse-og|no-?image/i;
const heroOf = b => { const m = String(b || '').slice(0, 1200).match(/!\[[^\]]*\]\(([^)\s]+)/); return m ? m[1] : null; };
const isReal = u => u && !/pollinations/i.test(u) && !/\/assets\/cro-cover-\d/i.test(u) && !GENERIC.test(u);   // cro-cover = replaceable (owner: CRO covers are bad)
const sleep = ms => new Promise(r => setTimeout(r, ms));
const BATCH = 1500;

(async () => {
  let round = 0;
  while (!fs.existsSync(WD + '/_index_img_backfill_stop.flag')) {
    round++;
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const need = (idx.entries || []).filter(e => e && e.id && /^[a-z]{2,3}\d/.test(e.id) && !isReal(e.img)).map(e => e.id);
    console.log('[img-backfill] round ' + round + ' · ' + need.length + ' entries still need a real img');
    if (!need.length) { console.log('[img-backfill] ALL entries carry a real face-card img · done'); break; }
    let stamped = 0;
    for (let i = 0; i < need.length; i += BATCH) {
      if (fs.existsSync(WD + '/_index_img_backfill_stop.flag')) break;
      const slice = need.slice(i, i + BATCH);
      const found = {};
      for (const id of slice) { const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null); const h = e && e.answer ? heroOf(e.answer) : null; if (isReal(h)) found[id] = h; }
      // MERGE-ON-WRITE: re-read fresh, apply img only, write back
      const fresh = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      let changed = 0;
      for (const e of (fresh.entries || [])) { if (e && found[e.id] && !isReal(e.img)) { e.img = found[e.id]; changed++; } }
      if (changed) { await store.setJSON('_index.json', fresh); stamped += changed; }
      console.log('[img-backfill] batch ' + (i / BATCH + 1) + ' · +' + changed + ' (total ' + stamped + '/' + need.length + ')');
      await sleep(500);
    }
    if (!stamped) { console.log('[img-backfill] no new real heroes this round — waiting for the face lane…'); await sleep(60000); }
  }
})().catch(e => { console.log('[img-backfill] FATAL', e && e.message); process.exit(1); });
