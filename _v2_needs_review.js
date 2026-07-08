// _v2_needs_review.js — dedicated DeepSeek lane for _v2_needs_review.json backlog (4444).
// 1 worker re-runs fixEntry (FAQ, CRO card, mermaid, sources, etc.) → Stage-1 _v2_approved.json;
// Stage-2 CC auditor (_v2_auditor.js) personal-reads + IndexNow before publish-ready.
// Pass law: MIN_SCORE>=12 (12/13 or 13/13) + all stations; sub-12 stays in needs-review.
// Watchdog: _v2_supervisor.js · stop: _v2_needs_review_stop.flag · log: _v2_needs_review.out.log
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
if (!process.env.V2C_MIN_SCORE) process.env.V2C_MIN_SCORE = '12';
const { getStore } = require('@netlify/blobs');
const { fixEntry } = require('./_v2_components');
const { spotCheckEntry } = require('./_v2_publish_verify');
const { dsChat } = require('./_ds_lib');
const { pushSeoCounts } = require('./_seo_monitor_sync_lib');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_v2_needs_review_stop.flag';
const NR = WD + '/_v2_needs_review.json';
const AP = WD + '/_v2_approved.json';
const AUDIT_Q = WD + '/_v2_redbox_audit_queue.json';
const LOG = WD + '/_v2_needs_review.out.log';
const NR_CONC = Math.max(1, parseInt(process.env.NR_DS_CONC || '3', 10));
const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);   // pass@12: 13 ideal, 12 minimum
const PACE_MS = parseInt(process.env.NR_PACE_MS || '200', 10);
const IDLE_MS = parseInt(process.env.NR_IDLE_MS || '60000', 10);
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} if (process.stdout.isTTY) console.log(line); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const writeArr = (f, arr) => { fs.writeFileSync(f, JSON.stringify(arr)); };
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

let signOffLock = Promise.resolve();
function signOffFromReview(id, store) {
  signOffLock = signOffLock.then(async () => {
    const nrBefore = readArr(NR);
    const apBefore = readArr(AP);
    const patch = { lastRedboxClear: id, lastRedboxClearAt: new Date().toISOString() };
    if (apBefore.includes(id)) {
      const nrAfter = nrBefore.filter(x => x !== id);
      if (nrAfter.length < nrBefore.length) {
        writeArr(NR, nrAfter);
        await pushSeoCounts(store, Object.assign(patch, { note: 'nr-dedupe-already-approved' }));
      }
      return false;
    }
    if (!nrBefore.includes(id)) return false;
    const nrAfter = nrBefore.filter(x => x !== id);
    const apAfter = [...new Set([...apBefore, id])];
    const redDrop = nrBefore.length - nrAfter.length;
    const greenRise = apAfter.length - apBefore.length;
    writeArr(AP, apAfter);
    writeArr(NR, nrAfter);
    if (redDrop !== greenRise) {
      logln(`[v2nr] ⚠ accounting ${id} red−${redDrop} green+${greenRise} — expected 1:1`);
    }
    const q = readArr(AUDIT_Q);
    if (!q.includes(id)) q.push(id);
    writeArr(AUDIT_Q, q);
    await pushSeoCounts(store, patch);
    return redDrop === 1 && greenRise === 1;
  });
  return signOffLock;
}

if (require.main === module) (async () => {
  logln(`[v2nr] up — ${NR_CONC} DeepSeek worker(s) on needs-review backlog (MIN_SCORE=${MIN_SCORE}, pass@12/13)`);
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const titleOf = Object.fromEntries((idx.entries || []).filter(e => e && e.id).map(e => [e.id, e.question]));
  const byPillar = {};
  for (const e of idx.entries || []) if (e && e.id) (byPillar[pillarOf(e.id)] = byPillar[pillarOf(e.id)] || []).push({ id: e.id, title: e.question });

  let cleared = 0;
  while (!fs.existsSync(STOP)) {
    const ids = readArr(NR);
    const approved = new Set(readArr(AP));
    const todo = ids.filter(id => !approved.has(id));
    if (!todo.length) {
      logln(`[v2nr] idle — needs-review ${ids.length}, nothing to retry`);
      await sleep(IDLE_MS);
      continue;
    }
    logln(`[v2nr] pass — retrying ${todo.length} needs-review entries`);
    let qi = 0;
    async function worker(wid) {
      while (!fs.existsSync(STOP)) {
        const i = qi++;
        if (i >= todo.length) return;
        const id = todo[i];
        if (readArr(AP).includes(id)) continue;
        logln(`[v2nr] w${wid} fixing ${id}`);
        try {
          const sibs = (byPillar[pillarOf(id)] || []).filter(s => s.id !== id);
          const r = await fixEntry(id, titleOf[id] || id, sibs, valid, dsChat);
          const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
          const spot = spotCheckEntry(id, e && e.answer, valid);
          if (r && r.approved && r.score >= MIN_SCORE && spot.pass && await signOffFromReview(id, store)) {
            cleared++;
            logln(`[v2nr] ✅ STAGE-1 ${id} ${r.score}/13 — cleared red box → dual-audit queue (total ${cleared})`);
          } else if (r && r.approved && r.score >= MIN_SCORE && !spot.pass) {
            logln(`[v2nr] ✗ BLOCK ${id} — fixEntry ok but spot-check FAIL score=${spot.score} ${spot.gaps.join(',')} (need ≥${MIN_SCORE}/13 + all stations)`);
          } else if (r && r.approved && r.score >= MIN_SCORE) {
            logln(`[v2nr] ↻ ${id} already approved — NR deduped if present`);
          } else if (r && !r.approved) {
            logln(`[v2nr] ↻ ${id} still stuck (score ${r.score || '?'}, need ≥${MIN_SCORE}/13 + all stations)`);
          } else if (r && r.score != null && r.score < MIN_SCORE) {
            logln(`[v2nr] ↻ ${id} sub-${MIN_SCORE} score ${r.score}/13 — stays in red box`);
          }
        } catch (e) {
          logln(`[v2nr] ERR ${id} ${String(e.message).slice(0, 120)}`);
        }
        if (PACE_MS) await sleep(PACE_MS);
      }
    }
    await Promise.all(Array.from({ length: NR_CONC }, (_, i) => worker(i + 1)));
    await sleep(5000);
  }
  logln('[v2nr] stop flag — exiting');
})().catch(e => { logln('[v2nr] FATAL ' + (e && e.message)); process.exit(1); });
