// 🔒 LAW (owner 2026-06-30): keep DuckDuckGo cover-image lanes running. Run TWO instances:
//   node _img_backfill.js 1    (LANE 1 of 2)
//   node _img_backfill.js 2    (LANE 2 of 2)
// Each lane finds entries MISSING a top image (round-robin split by id) and adds a real DDG cover.
// Every entry needs a top image to be a 12/13. stop: _img_backfill_stop.flag · log: _img_backfill.out.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { fixCover, hasTopImage } = require('./_v2_nr_ddg');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = WD + '/_img_backfill_stop.flag';
const LOG = WD + '/_img_backfill.out.log';
const LANE = parseInt(process.argv[2] || '1', 10);
const NLANES = 2;
const PACE_MS = parseInt(process.env.IMG_PACE_MS || '1200', 10);
const log = s => { const l = new Date().toISOString() + ` [imglane${LANE}] ` + s; try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} console.log(l); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hashId = id => { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };

(async () => {
  log(`up — DDG cover backfill lane ${LANE}/${NLANES}`);
  while (!fs.existsSync(STOP)) {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => ({ entries: [] }));
    const ids = (idx.entries || []).filter(e => e && e.id).map(e => e.id);
    const titleOf = Object.fromEntries((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e.question]));
    let fixed = 0, scanned = 0;
    for (const id of ids) {
      if (fs.existsSync(STOP)) break;
      if (hashId(id) % NLANES !== (LANE - 1)) continue;   // this lane's share
      scanned++;
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (!e || !e.answer || hasTopImage(e.answer)) continue;
        const r = await fixCover(id, titleOf[id] || id);
        if (r === 'fixed') { fixed++; log(`✅ ${id} cover added (${fixed})`); }
        await sleep(PACE_MS);
      } catch (x) {}
    }
    log(`pass done — lane ${LANE} scanned its share, fixed ${fixed} covers. idle 5m then re-sweep.`);
    await sleep(300000);
  }
  log('stop flag — exiting');
})().catch(e => { log('FATAL ' + (e && e.message)); process.exit(1); });
