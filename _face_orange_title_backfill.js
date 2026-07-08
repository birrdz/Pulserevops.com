// _face_orange_title_backfill.js — bake orange Q&A titles onto every face-card cover missing them.
// Uses rebakeFaceCardTitle (no flux re-fetch). Resumable via index face_title_baked flag.
//   node _face_orange_title_backfill.js           (all entries)
//   node _face_orange_title_backfill.js tl         (one pillar prefix)
//   node _face_orange_title_backfill.js --dry     (count only)
// stop: _face_orange_title_stop.flag · log: _face_orange_title_backfill.log
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
try {
  for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const { getStore } = require('@netlify/blobs');
const { coverFileOk, rebakeFaceCardTitle } = require('./_ddg_facecard_lib');
const STOP = WD + '/_face_orange_title_stop.flag';
const LOG = WD + '/_face_orange_title_backfill.log';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const prefix = args.find(a => a && !a.startsWith('-')) || '';
const log = s => {
  const line = new Date().toISOString() + ' ' + s;
  try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {}
  console.log(line);
};
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

(async () => {
  log('▶ face-card orange title backfill' + (prefix ? (' · pillar ' + prefix) : '') + (DRY ? ' · DRY' : ''));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let rows = (idx.entries || []).filter(e => e && e.id && /^[a-z]+\d+$/i.test(e.id));
  if (prefix) rows = rows.filter(e => e.id.startsWith(prefix));
  const need = rows.filter(e => !e.face_title_baked && coverFileOk(e.id));
  log('index rows=' + rows.length + ' · local cover ok=' + rows.filter(e => coverFileOk(e.id)).length + ' · need title=' + need.length);
  if (DRY) return;
  let done = 0, skip = 0, fail = 0;
  const SAVE_EVERY = 50;
  for (const e of need) {
    if (fs.existsSync(STOP)) { log('stop flag — exiting at ' + done); break; }
    const q = e.question || e.id;
    const ok = await rebakeFaceCardTitle(e.id, q);
    if (ok) {
      e.face_title_baked = true;
      e.img = '/assets/qa/' + e.id + '.jpg';
      done++;
      if (done % 25 === 0) log('✓ ' + done + '/' + need.length + ' — last ' + e.id);
      if (done % SAVE_EVERY === 0) await store.setJSON('_index.json', idx);
    } else if (!coverFileOk(e.id)) skip++;
    else { fail++; log('✗ ' + e.id); }
  }
  if (done) await store.setJSON('_index.json', idx);
  log('done — baked=' + done + ' skip=' + skip + ' fail=' + fail);
})().catch(e => { log('FATAL ' + (e && e.message)); process.exit(1); });
