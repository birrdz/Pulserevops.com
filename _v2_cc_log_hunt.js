// _v2_cc_log_hunt.js — log-based hunt for false cc_approved slips (auditor-down / missing signoff).
// Usage: node _v2_cc_log_hunt.js [--live]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { spotCheckEntry, MIN_SCORE } = require('./_v2_publish_verify');
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

const AUDITOR_DOWN = Date.parse('2026-06-30T03:04:40.000Z');
const CONC = Math.max(1, parseInt(process.env.V2_SLIP_CONC || '12', 10));
const APPROVED = WD + '/_v2_approved.json';
const CC = WD + '/_v2_cc_approved.json';
const NR = WD + '/_v2_needs_review.json';
const QUEUE = WD + '/_v2_redbox_audit_queue.json';
const REPORT = WD + '/_v2_cc_log_hunt_result.json';
const BACKUP_SUFFIX = '.pre_cc_log_hunt.json';

const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const logln = s => console.log(`[cc-hunt] ${s}`);

function parseLogIds(file, patterns, afterTs = 0) {
  const ids = new Set();
  const path = WD + '/' + file;
  if (!fs.existsSync(path)) return ids;
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    const tm = line.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/);
    if (!tm) continue;
    const at = Date.parse(tm[1]);
    if (Number.isNaN(at) || (afterTs && at < afterTs)) continue;
    for (const { re } of patterns) {
      const m = line.match(re);
      if (!m || !m[1]) continue;
      const id = m[1].replace(/[^a-z0-9]/gi, '').toLowerCase();
      if (/^[a-z]+\d+$/i.test(id)) ids.add(id);
    }
  }
  return ids;
}

function hasBlobSignoff(e) {
  if (!e) return false;
  if (e.dual_audit && e.final_signed) return true;
  if (e.cc_signed) return true;
  if (e.final_signed && e.final_gate) return true;
  return false;
}

function hasLogSignoff(id, dual, cc, fin) {
  return dual.has(id) || cc.has(id) || fin.has(id);
}

function applyDemote(slipIds) {
  const approved = new Set(readArr(APPROVED));
  const cc = new Set(readArr(CC));
  const review = new Set(readArr(NR));
  const queue = new Set(readArr(QUEUE));
  let fromAp = 0, fromCc = 0;
  for (const id of slipIds) {
    if (approved.has(id)) { approved.delete(id); fromAp++; }
    if (cc.has(id)) { cc.delete(id); fromCc++; }
    queue.delete(id);
    review.add(id);
  }
  fs.copyFileSync(APPROVED, APPROVED + BACKUP_SUFFIX);
  fs.copyFileSync(CC, CC + BACKUP_SUFFIX);
  fs.copyFileSync(NR, NR + BACKUP_SUFFIX);
  fs.writeFileSync(APPROVED, JSON.stringify([...approved].sort()));
  fs.writeFileSync(CC, JSON.stringify([...cc].sort()));
  fs.writeFileSync(NR, JSON.stringify([...review].sort()));
  fs.writeFileSync(QUEUE, JSON.stringify([...queue].sort()));
  return { demoted: slipIds.length, fromAp, fromCc, ccAfter: cc.size, reviewAfter: review.size };
}

(async () => {
  const live = process.argv.includes('--live');
  logln(`mode=${live ? 'LIVE' : 'DRY'} auditorDown=${new Date(AUDITOR_DOWN).toISOString()}`);

  const ccIds = readArr(CC);
  const dualLog = parseLogIds('_v2_nr_dual_gate.out.log', [{ re: /✅\s+DUAL-SIGNED\+SPOT OK\s+([a-z0-9]+)/i }]);
  const ccLog = parseLogIds('_v2_auditor.out.log', [{ re: /w\d+\s+([a-z0-9]+)\s+✅\s+CC-SIGNED/i }]);
  const finalLog = parseLogIds('_v2_final_gate.out.log', [{ re: /w\d+\s+([a-z0-9]+)\s+✅\s+FINAL-SIGNED/i }]);
  const compAfterDown = parseLogIds('_v2_components.out.log', [
    { re: /✅\s+APPROVED\s+([a-z0-9]+)/i },
    { re: /STAGE-1\s+([a-z0-9]+)/i },
  ], AUDITOR_DOWN);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));

  const slips = new Map();
  const add = (id, reason) => {
    if (!slips.has(id)) slips.set(id, new Set());
    slips.get(id).add(reason);
  };

  let qi = 0;
  async function worker() {
    while (true) {
      const i = qi++;
      if (i >= ccIds.length) return;
      const id = ccIds[i];
      const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      const blobOk = hasBlobSignoff(e);
      const logOk = hasLogSignoff(id, dualLog, ccLog, finalLog);
      const spot = spotCheckEntry(id, e && e.answer, valid);
      const dualOk = !!(e && e.dual_audit && e.final_signed) || dualLog.has(id);

      if (!blobOk && !logOk) add(id, 'no-signoff-trail');
      if (logOk && !blobOk) add(id, 'log-but-no-blob-stamp');
      if (!dualOk && !logOk && compAfterDown.has(id)) add(id, 'components-no-audit-log');
      if (!spot.pass && spot.score < MIN_SCORE) add(id, `score<${MIN_SCORE}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));

  const slipIds = [...slips.keys()].sort();
  const byReason = {};
  for (const [, reasons] of slips) for (const r of reasons) byReason[r] = (byReason[r] || 0) + 1;

  const report = {
    at: new Date().toISOString(),
    mode: live ? 'live' : 'dry',
    ccTotal: ccIds.length,
    slipCount: slipIds.length,
    slipIds,
    byReason,
    logCounts: { dual: dualLog.size, cc: ccLog.size, final: finalLog.size, compAfterDown: compAfterDown.size },
    liveApplied: null,
  };

  if (live && slipIds.length) {
    report.liveApplied = applyDemote(slipIds);
    await pushSeoCounts(store, { ccLogHuntAt: new Date().toISOString(), demoted: slipIds.length }).catch(() => {});
    logln(`LIVE demoted=${report.liveApplied.demoted}`);
  }

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ mode: report.mode, slipCount: report.slipCount, demoted: report.liveApplied ? report.liveApplied.demoted : 0, byReason }, null, 2));
})().catch(e => { console.error('[cc-hunt] FATAL', e); process.exit(1); });
