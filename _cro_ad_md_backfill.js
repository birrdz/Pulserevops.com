// _cro_ad_md_backfill.js — backfill the deploy-free MARKDOWN CRO ad into EXISTING
// answer blobs (every pillar). Uses the same insertCroAdMd() as the live writer,
// so new + old share one idempotency marker (no double-insert). Only writes
// answers/<id>.json — NEVER _index.json — so zero clobber risk to the progress bar.
// Backs up the original body to entry.answer_pread (one-time) so --remove can undo.
//
// Usage:
//   node _cro_ad_md_backfill.js --limit 5        # do next 5 without the ad, verify each live
//   node _cro_ad_md_backfill.js --limit 200      # next 200
//   node _cro_ad_md_backfill.js                  # all remaining (background)
//   node _cro_ad_md_backfill.js --conc 8         # concurrency (default 6)
//   node _cro_ad_md_backfill.js --remove <id>    # restore one entry
//   node _cro_ad_md_backfill.js --remove-all     # restore everything (from answer_pread)
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { insertCroAdMd, MARK } = require('./_cro_ad_md');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const STOP = 'C:/Users/koryj/website/_cro_backfill_stop.flag';
const PROG = 'C:/Users/koryj/website/_cro_backfill.log';
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k)); if (!a) return d; const v = a.split('=')[1] || process.argv[process.argv.indexOf(a) + 1]; return (v && !v.startsWith('--')) ? v : true; };
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(PROG, line + '\n'); } catch (e) {} console.log(line); };

async function injectOne(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e || !e.answer) return { id, skip: 'no-blob' };
  // Always rebuild from the CLEAN original (answer_pread) when present, so we
  // replace any older text ad in place instead of stacking.
  const base = (e.answer_pread != null) ? e.answer_pread : e.answer;
  const out = insertCroAdMd(base, id);
  if (out === base) return { id, skip: 'too-short' };        // no suitable insert point / already-marked
  if (e.answer === out) return { id, skip: 'already-card' }; // already exactly this
  if (e.answer_pread == null) e.answer_pread = e.answer;     // one-time backup of original
  e.answer = out; e.cro_ad_md_at = Date.now();
  await store.setJSON('answers/' + id + '.json', e);
  return { id, ok: true };
}
async function removeOne(id) {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e) return { id, skip: 'no-blob' };
  if (e.answer_pread == null) return { id, skip: 'no-backup' };
  e.answer = e.answer_pread; delete e.answer_pread; delete e.cro_ad_md_at;
  await store.setJSON('answers/' + id + '.json', e);
  return { id, ok: true, restored: true };
}

(async () => {
  if (arg('remove') && arg('remove') !== true) { console.log(JSON.stringify(await removeOne(arg('remove')))); return; }
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let ids = (idx.entries || []).map(e => e && e.id).filter(Boolean)
    .filter(id => !/^tl90\d\d$|^tl91\d\d$/.test(id));  // skip the CRO landing pages

  if (arg('remove-all')) {
    logln('[backfill] REMOVE-ALL start over ' + ids.length);
    let r = 0; for (const id of ids) { try { const x = await removeOne(id); if (x.restored) r++; } catch (e) {} if (r % 200 === 0 && r) logln('[backfill] removed ' + r); }
    logln('[backfill] REMOVE-ALL done: ' + r); return;
  }

  const limit = arg('limit') ? parseInt(arg('limit'), 10) : Infinity;
  const conc = arg('conc') ? parseInt(arg('conc'), 10) : 6;
  logln('[backfill] start: ' + ids.length + ' entries, limit=' + (limit === Infinity ? 'ALL' : limit) + ' conc=' + conc);

  let i = 0, done = 0, skipped = 0, failed = 0;
  async function worker() {
    while (i < ids.length && done < limit) {
      if (fs.existsSync(STOP)) return;
      const id = ids[i++];
      try {
        const r = await injectOne(id);
        if (r.ok) { done++; if (done <= 25 || done % 100 === 0) logln('[backfill] ' + done + ' ✓ ' + id); }
        else skipped++;
      } catch (e) { failed++; if (failed <= 20) logln('[backfill] ERR ' + id + ' ' + e.message); }
    }
  }
  await Promise.all(Array.from({ length: conc }, worker));
  logln('[backfill] DONE injected=' + done + ' skipped=' + skipped + ' failed=' + failed);
})().catch(e => { logln('[backfill] FATAL ' + e.message); process.exit(1); });
