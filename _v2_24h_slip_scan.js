// _v2_24h_slip_scan.js — log-based last-24h false-pass scan + demote to red box (4444).
// Uses engine log timestamps (NOT blob updated_at). Verifies spotCheckEntry @12/13 + all stations.
//
// Usage:
//   node _v2_24h_slip_scan.js              # report only
//   node _v2_24h_slip_scan.js --live       # demote slips → _v2_needs_review.json + sync SEO
//
// Env: V2_TRUE_24H (default 24), V2_SLIP_CONC (default 12)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { spotCheckEntry, MIN_SCORE, WORD_FLOOR } = require('./_v2_publish_verify');

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

const HOURS = parseInt(process.env.V2_TRUE_24H || '24', 10);
const CONC = Math.max(1, parseInt(process.env.V2_SLIP_CONC || '12', 10));
const cutoff = Date.now() - HOURS * 60 * 60 * 1000;

const APPROVED = WD + '/_v2_approved.json';
const REVIEW = WD + '/_v2_needs_review.json';
const CC_APPROVED = WD + '/_v2_cc_approved.json';
const FINAL_APPROVED = WD + '/_v2_final_approved.json';
const QUEUE = WD + '/_v2_redbox_audit_queue.json';
const DUAL = WD + '/_v2_redbox_dual.json';
const REPORT = WD + '/_v2_24h_slip_report.json';
const APPROVED_BACKUP = WD + '/_v2_approved.pre_24h_slip.json';
const REVIEW_BACKUP = WD + '/_v2_needs_review.pre_24h_slip.json';
const CC_BACKUP = WD + '/_v2_cc_approved.pre_24h_slip.json';
const QUEUE_BACKUP = WD + '/_v2_redbox_audit_queue.pre_24h_slip.json';

const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const readDual = () => { try { return JSON.parse(fs.readFileSync(DUAL, 'utf8')); } catch (e) { return {}; } };
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const logln = s => console.log(`[24h-slip] ${s}`);

const LOG_SOURCES = [
  {
    file: '_v2_components.out.log',
    patterns: [
      { re: /STAGE-1\s+([a-z0-9]+)/i, kind: 'stage1' },
      { re: /fixed \+ APPROVED\s+([a-z0-9]+)/i, kind: 'components-approved' },
    ],
  },
  {
    file: '_v2_needs_review.out.log',
    patterns: [
      { re: /CLEARED\s+([a-z0-9]+)/i, kind: 'nr-cleared' },
    ],
  },
  {
    file: '_v2_auditor.out.log',
    patterns: [
      { re: /w\d+\s+([a-z0-9]+)\s+✅\s+CC-SIGNED/i, kind: 'cc-signed' },
      { re: /CC APPROVED[^a-z0-9]*(?:published[^a-z0-9]*)?\s*([a-z0-9]+)/i, kind: 'cc-approved' },
    ],
  },
  {
    file: '_v2_final_gate.out.log',
    patterns: [
      { re: /w\d+\s+([a-z0-9]+)\s+✅\s+FINAL-SIGNED/i, kind: 'final-signed' },
    ],
  },
  {
    file: '_v2_nr_dual_gate.out.log',
    patterns: [
      { re: /✅\s+DUAL-SIGNED\+SPOT OK\s+([a-z0-9]+)/i, kind: 'dual-signed' },
    ],
  },
];

function parseLogEvents() {
  const events = new Map(); // id -> { id, at, kind, source }
  for (const { file, patterns } of LOG_SOURCES) {
    const path = WD + '/' + file;
    if (!fs.existsSync(path)) continue;
    const text = fs.readFileSync(path, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const tm = line.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/);
      if (!tm) continue;
      const at = Date.parse(tm[1]);
      if (Number.isNaN(at) || at < cutoff) continue;
      for (const { re, kind } of patterns) {
        const m = line.match(re);
        if (!m || !m[1]) continue;
        const id = m[1].replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (!/^[a-z]+\d+$/i.test(id)) continue;
        const prev = events.get(id);
        const ev = { id, at: new Date(at).toISOString(), kind, source: file };
        if (!prev || at >= Date.parse(prev.at)) events.set(id, ev);
        // also track all kinds per id
        if (!events.get(id + '::kinds')) events.set(id + '::kinds', { id, kinds: new Set() });
      }
    }
  }
  // second pass: collect all kinds per id
  const kindsById = new Map();
  for (const { file, patterns } of LOG_SOURCES) {
    const path = WD + '/' + file;
    if (!fs.existsSync(path)) continue;
    const text = fs.readFileSync(path, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const tm = line.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/);
      if (!tm) continue;
      const at = Date.parse(tm[1]);
      if (Number.isNaN(at) || at < cutoff) continue;
      for (const { re, kind } of patterns) {
        const m = line.match(re);
        if (!m || !m[1]) continue;
        const id = m[1].replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (!/^[a-z]+\d+$/i.test(id)) continue;
        if (!kindsById.has(id)) kindsById.set(id, new Set());
        kindsById.get(id).add(kind);
      }
    }
  }
  // clean pseudo keys
  const out = new Map();
  for (const [k, v] of events) {
    if (k.endsWith('::kinds')) continue;
    out.set(k, Object.assign({}, v, { kinds: [...(kindsById.get(k) || [])] }));
  }
  return out;
}

function countLogEventsByKind() {
  const counts = {};
  for (const { file, patterns } of LOG_SOURCES) {
    const path = WD + '/' + file;
    if (!fs.existsSync(path)) continue;
    const text = fs.readFileSync(path, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const tm = line.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/);
      if (!tm) continue;
      const at = Date.parse(tm[1]);
      if (Number.isNaN(at) || at < cutoff) continue;
      for (const { re, kind } of patterns) {
        if (re.test(line)) counts[kind] = (counts[kind] || 0) + 1;
      }
    }
  }
  return counts;
}

function bothPassDual(dual, id) {
  const d = dual[id];
  return d && d.a1 && d.a2 && d.a1.pass && d.a2.pass && d.a1.score >= MIN_SCORE && d.a2.score >= MIN_SCORE;
}

function auditGap(id, kinds, inCc, dual) {
  const fromRedBox = kinds.includes('nr-cleared') || kinds.includes('dual-signed');
  const hasCcSign = kinds.includes('cc-signed') || kinds.includes('cc-approved');
  const hasDualSign = kinds.includes('dual-signed');
  if (inCc && fromRedBox && !hasDualSign && !bothPassDual(dual, id)) return 'missingDualAudit';
  if (inCc && !fromRedBox && !hasCcSign && !hasDualSign && !kinds.includes('final-signed')) return 'missingCcAudit';
  return null;
}

function applyDemote(slipIds, before) {
  const approved = new Set(readArr(APPROVED));
  const review = new Set(readArr(REVIEW));
  const cc = new Set(readArr(CC_APPROVED));
  const final = new Set(readArr(FINAL_APPROVED));
  const queue = readArr(QUEUE);
  const queueSet = new Set(queue);

  const removedFromApproved = [];
  const removedFromCc = [];
  const removedFromQueue = [];
  const addedToReview = [];

  for (const id of slipIds) {
    if (approved.has(id)) { approved.delete(id); removedFromApproved.push(id); }
    if (cc.has(id)) { cc.delete(id); removedFromCc.push(id); }
    if (final.has(id)) final.delete(id);
    if (queueSet.has(id)) {
      queueSet.delete(id);
      removedFromQueue.push(id);
    }
    if (!review.has(id)) { review.add(id); addedToReview.push(id); }
  }

  fs.copyFileSync(APPROVED, APPROVED_BACKUP);
  fs.copyFileSync(REVIEW, REVIEW_BACKUP);
  if (fs.existsSync(CC_APPROVED)) fs.copyFileSync(CC_APPROVED, CC_BACKUP);
  if (fs.existsSync(QUEUE)) fs.copyFileSync(QUEUE, QUEUE_BACKUP);

  fs.writeFileSync(APPROVED, JSON.stringify([...approved].sort()));
  fs.writeFileSync(REVIEW, JSON.stringify([...review].sort()));
  fs.writeFileSync(CC_APPROVED, JSON.stringify([...cc].sort()));
  if (fs.existsSync(FINAL_APPROVED)) fs.writeFileSync(FINAL_APPROVED, JSON.stringify([...final].sort()));
  fs.writeFileSync(QUEUE, JSON.stringify([...queueSet].sort()));

  return {
    demoted: slipIds.length,
    removedFromApproved: removedFromApproved.length,
    removedFromCc: removedFromCc.length,
    removedFromQueue: removedFromQueue.length,
    addedToReview: addedToReview.length,
    approvedBefore: before.approved,
    approvedAfter: approved.size,
    reviewBefore: before.review,
    reviewAfter: review.size,
    ccBefore: before.ccApproved,
    ccAfter: cc.size,
    queueBefore: before.queue,
    queueAfter: queueSet.size,
    backups: [APPROVED_BACKUP, REVIEW_BACKUP, CC_BACKUP, QUEUE_BACKUP],
  };
}

(async () => {
  const live = process.argv.includes('--live');
  logln(`mode=${live ? 'LIVE' : 'DRY'} window=${HOURS}h cutoff=${new Date(cutoff).toISOString()} conc=${CONC}`);

  const logEvents = parseLogEvents();
  const logCounts = countLogEventsByKind();
  logln(`log events (unique ids): ${logEvents.size} · byKind=${JSON.stringify(logCounts)}`);

  const approvedSet = new Set(readArr(APPROVED));
  const ccSet = new Set(readArr(CC_APPROVED));
  const finalSet = new Set(readArr(FINAL_APPROVED));
  const reviewSet = new Set(readArr(REVIEW));
  const dual = readDual();

  const before = {
    approved: approvedSet.size,
    review: reviewSet.size,
    ccApproved: ccSet.size,
    queue: readArr(QUEUE).length,
  };

  // Scan targets: log-approved in last 24h AND currently in approved/cc/final ledgers
  const scanIds = [...logEvents.keys()]
    .filter(id => approvedSet.has(id) || ccSet.has(id) || finalSet.has(id))
    .sort();

  // Cross-check: ledger entries with log events (same set, explicit)
  const crossCheckApproved = [...approvedSet].filter(id => logEvents.has(id));
  const crossCheckCc = [...ccSet].filter(id => logEvents.has(id));
  logln(`scanTargets=${scanIds.length} (approved∩log=${crossCheckApproved.length} cc∩log=${crossCheckCc.length})`);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));

  const slips = [];
  const clean = [];
  const noBlob = [];
  let qi = 0;

  async function worker() {
    while (true) {
      const i = qi++;
      if (i >= scanIds.length) return;
      const id = scanIds[i];
      const meta = logEvents.get(id);
      const inApproved = approvedSet.has(id);
      const inCc = ccSet.has(id);
      const inFinal = finalSet.has(id);
      const inReview = reviewSet.has(id);

      const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (!e || !e.answer) {
        noBlob.push(id);
        slips.push({
          id,
          pillar: pillarOf(id),
          reason: 'no-blob',
          reasons: ['no-blob'],
          score: null,
          gaps: ['no-blob'],
          words: 0,
          approvedAt: meta.at,
          logKinds: meta.kinds,
          inApproved,
          inCc,
          inFinal,
          inReview,
        });
        continue;
      }

      const v = spotCheckEntry(id, e.answer, valid);
      const auditReason = auditGap(id, meta.kinds || [], inCc, dual);
      const reasons = [];
      if (!v.pass) reasons.push(...v.gaps);
      if (auditReason) reasons.push(auditReason);

      if (reasons.length) {
        slips.push({
          id,
          pillar: pillarOf(id),
          reason: reasons[0],
          reasons,
          score: v.score,
          gaps: v.gaps,
          words: v.words,
          approvedAt: meta.at,
          logKinds: meta.kinds,
          inApproved,
          inCc,
          inFinal,
          inReview,
          looksPass: v.score >= MIN_SCORE,
        });
      } else {
        clean.push(id);
      }
    }
  }

  await Promise.all(Array.from({ length: CONC }, () => worker()));
  slips.sort((a, b) => a.id.localeCompare(b.id));

  const byReason = {};
  const byReasonAll = {};
  const byPillar = {};
  const scoreHist = {};
  for (const s of slips) {
    byReason[s.reason] = (byReason[s.reason] || 0) + 1;
    byPillar[s.pillar] = (byPillar[s.pillar] || 0) + 1;
    if (s.score != null) scoreHist[String(s.score)] = (scoreHist[String(s.score)] || 0) + 1;
    for (const r of s.reasons) byReasonAll[r] = (byReasonAll[r] || 0) + 1;
  }

  const slipIds = slips.map(s => s.id);
  const report = {
    at: new Date().toISOString(),
    mode: live ? 'live' : 'dry',
    windowHours: HOURS,
    cutoff: new Date(cutoff).toISOString(),
    methodology: 'Log-based approval timestamps from engine logs (NOT blob updated_at). spotCheckEntry @12/13 + all station gates.',
    minScore: MIN_SCORE,
    wordFloor: WORD_FLOOR,
    logEventCountsByKind: logCounts,
    uniqueLogApprovedIds24h: logEvents.size,
    scanTargetCount: scanIds.length,
    crossCheck: {
      approvedInLedgerWithLog24h: crossCheckApproved.length,
      ccInLedgerWithLog24h: crossCheckCc.length,
    },
    slipCount: slips.length,
    slipIds,
    slips: slips.map(s => ({ id: s.id, reason: s.reason, reasons: s.reasons, score: s.score, gaps: s.gaps, words: s.words, approvedAt: s.approvedAt, logKinds: s.logKinds })),
    byReason,
    byReasonAll,
    byPillar: Object.fromEntries(Object.entries(byPillar).sort((a, b) => b[1] - a[1])),
    scoreHist,
    cleanPass: clean.length,
    noBlob: noBlob.length,
    before,
    liveApplied: null,
  };

  if (live && slipIds.length) {
    logln(`LIVE demote: ${slipIds.length} ids → needs-review`);
    report.liveApplied = applyDemote(slipIds, before);
    report.after = {
      approved: report.liveApplied.approvedAfter,
      review: report.liveApplied.reviewAfter,
      ccApproved: report.liveApplied.ccAfter,
      queue: report.liveApplied.queueAfter,
    };
    logln(`LIVE done: approved ${report.liveApplied.approvedBefore}→${report.liveApplied.approvedAfter} review ${report.liveApplied.reviewBefore}→${report.liveApplied.reviewAfter} demoted=${report.liveApplied.demoted}`);
  } else if (live) {
    logln('LIVE: no slips — ledgers unchanged');
  }

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  logln(`wrote ${REPORT}`);

  const topReasons = Object.entries(byReason).sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log(JSON.stringify({
    mode: report.mode,
    slipCount: report.slipCount,
    demoted: report.liveApplied ? report.liveApplied.demoted : 0,
    scanTargets: scanIds.length,
    logApproved24h: logEvents.size,
    topReasons: Object.fromEntries(topReasons),
    scoreHist,
    sampleIds: slipIds.slice(0, 20),
    report: REPORT,
    reviewAfter: report.after ? report.after.review : before.review + (live ? 0 : slipIds.length),
  }, null, 2));
})().catch(e => { console.error('[24h-slip] FATAL', e); process.exit(1); });
