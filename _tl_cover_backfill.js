// 🔒 4444. _tl_cover_backfill.js — give every tl (Pulse Tools / CRO) entry a TOP IMAGE. The DDG lanes
// SKIP the tl pillar (CRO uses a curated cover rotation), so this prepends a real curated cover
// (/assets/cro-cover-1..5.jpg, all live) to any tl entry missing a leading image. Fast, no API.
//   node _tl_cover_backfill.js 1   (lane 1 of 2)   ·   node _tl_cover_backfill.js 2   (lane 2 of 2)
// stop: _tl_cover_stop.flag · log: _tl_cover_backfill.out.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_tl_cover_stop.flag';
const LOG = WD + '/_tl_cover_backfill.out.log';
const LANE = parseInt(process.argv[2] || '1', 10), NLANES = 2;
const log = s => { const l = new Date().toISOString() + ` [tlcover${LANE}] ` + s; try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} console.log(l); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hasTop = b => /!\[[^\]]*\]\([^)]+\)/.test(String(b || '').slice(0, 1000)) || /<img[^>]+src=/i.test(String(b || '').slice(0, 1500));
const hashId = id => { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };

(async () => {
  log(`up — curated tl cover backfill lane ${LANE}/${NLANES}`);
  while (!fs.existsSync(STOP)) {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => ({ entries: [] }));
    const tl = (idx.entries || []).filter(e => e && /^tl\d+$/.test(e.id));
    const titleOf = Object.fromEntries(tl.map(e => [e.id, e.question]));
    let fixed = 0;
    for (const e of tl) {
      if (fs.existsSync(STOP)) break;
      if (hashId(e.id) % NLANES !== (LANE - 1)) continue;
      try {
        const b = await store.get('answers/' + e.id + '.json', { type: 'json' }).catch(() => null);
        if (!b || !b.answer || hasTop(b.answer)) continue;
        const cover = '/assets/cro-cover-' + ((+e.id.slice(2) % 5) + 1) + '.jpg';
        const alt = String(titleOf[e.id] || e.id).replace(/[\[\]"]/g, '').slice(0, 80);
        const nb = '![' + alt + '](' + cover + ')\n\n' + String(b.answer).replace(/^﻿/, '').trimStart();
        await store.setJSON('answers/' + e.id + '.json', Object.assign({}, b, { answer: nb, updated_at: new Date().toISOString() }));
        fixed++;
        if (fixed % 100 === 0) log(`+${fixed} covers added`);
      } catch (x) {}
    }
    log(`pass done — lane ${LANE} added ${fixed} curated covers. idle 4m then re-sweep.`);
    await sleep(240000);
  }
  log('stop flag — exiting');
})().catch(e => { log('FATAL ' + (e && e.message)); process.exit(1); });
