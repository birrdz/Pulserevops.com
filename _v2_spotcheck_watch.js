// _v2_spotcheck_watch.js — post-publish spot-check watcher (4444).
// Re-verifies each newly dual-signed id in _v2_cc_approved.json; demotes failures → needs-review.
// Stop: _v2_spotcheck_watch_stop.flag · log: _v2_spotcheck_watch.out.log
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { spotCheckEntry } = require('./_v2_publish_verify');
const { pushSeoCounts } = require('./_seo_monitor_sync_lib');

const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const STOP = WD + '/_v2_spotcheck_watch_stop.flag';
const FINAL = WD + '/_v2_cc_approved.json';
const NR = WD + '/_v2_needs_review.json';
const AP = WD + '/_v2_approved.json';
const LOG = WD + '/_v2_spotcheck_watch.out.log';
const FAIL_LOG = WD + '/_v2_spotcheck_fails.json';
const CURSOR = WD + '/_v2_spotcheck_seen.json';
const INTERVAL_MS = parseInt(process.env.SPOTCHECK_INTERVAL_MS || '45000', 10);
const ENGINE = WD + '/_v2_redbox_complete.flag';

const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };
const engineMode = () => fs.existsSync(ENGINE);

function demote(id, reason, detail) {
  if (engineMode()) {
    // SEO engine: drop cc sign-off only; keep stage-1 approved count monotonic.
    fs.writeFileSync(FINAL, JSON.stringify(readArr(FINAL).filter(x => x !== id)));
    const fails = (() => { try { return JSON.parse(fs.readFileSync(FAIL_LOG, 'utf8')); } catch (e) { return []; } })();
    fails.unshift({ id, reason, detail, engineMode: true, at: new Date().toISOString() });
    fs.writeFileSync(FAIL_LOG, JSON.stringify(fails.slice(0, 500), null, 2));
    pushSeoCounts(store, { lastSpotcheckUncc: id, lastSpotcheckUnccAt: new Date().toISOString() }).catch(() => {});
    return;
  }
  const nr = new Set(readArr(NR));
  nr.add(id);
  fs.writeFileSync(NR, JSON.stringify([...nr].sort()));
  fs.writeFileSync(AP, JSON.stringify(readArr(AP).filter(x => x !== id)));
  fs.writeFileSync(FINAL, JSON.stringify(readArr(FINAL).filter(x => x !== id)));
  const fails = (() => { try { return JSON.parse(fs.readFileSync(FAIL_LOG, 'utf8')); } catch (e) { return []; } })();
  fails.unshift({ id, reason, detail, at: new Date().toISOString() });
  fs.writeFileSync(FAIL_LOG, JSON.stringify(fails.slice(0, 500), null, 2));
  pushSeoCounts(store, { lastRedboxReturn: id, lastRedboxReturnAt: new Date().toISOString() }).catch(() => {});
}

function loadSeen() {
  try { return new Set(JSON.parse(fs.readFileSync(CURSOR, 'utf8'))); } catch (e) { return new Set(); }
}
function saveSeen(seen) { fs.writeFileSync(CURSOR, JSON.stringify([...seen].sort())); }

if (require.main === module) (async () => {
  logln('[spotwatch] up — post-publish verify on every new final-signed id');
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  let seen = loadSeen();
  for (const id of readArr(FINAL)) seen.add(id);
  saveSeen(seen);

  while (!fs.existsSync(STOP)) {
    const final = readArr(FINAL);
    const newIds = final.filter(id => !seen.has(id));
    if (newIds.length) {
      logln(`[spotwatch] checking ${newIds.length} newly published`);
      for (const id of newIds) {
        seen.add(id);
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        const v = spotCheckEntry(id, e && e.answer, valid);
        if (v.pass) {
          logln(`[spotwatch] ✅ ${id} ${v.score}/13 words=${v.words} all stations pass`);
        } else if (engineMode()) {
          logln(`[spotwatch] ❌ ${id} score=${v.score} gaps=${v.gaps.join(',')} — un-cc (engine, stays approved)`);
          demote(id, 'spotcheck-fail', { score: v.score, gaps: v.gaps, words: v.words });
        } else {
          logln(`[spotwatch] ❌ ${id} score=${v.score} gaps=${v.gaps.join(',')} — DEMOTED to red box`);
          demote(id, 'spotcheck-fail', { score: v.score, gaps: v.gaps, words: v.words });
        }
      }
      saveSeen(seen);
    }
    await new Promise(r => setTimeout(r, INTERVAL_MS));
  }
  logln('[spotwatch] stop flag — exiting');
})().catch(e => { logln('[spotwatch] FATAL ' + e.message); process.exit(1); });

module.exports = { spotCheckEntry, demote };
