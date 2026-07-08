// _seo_monitor_sync_lib.js — merge engine ledger counts into seo-monitor/content.json
// so audit/autoheal writers never wipe approved/catalogTotal (was showing 0 on /seo).
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };

function readLedger() {
  const approvedIds = readArr(WD + '/_v2_approved.json');
  const reviewIds = readArr(WD + '/_v2_needs_review.json');
  const ccIds = readArr(WD + '/_v2_cc_approved.json');
  let slipIds = [];
  try {
    slipIds = ((JSON.parse(fs.readFileSync(WD + '/_v2_slip_scan_result.json', 'utf8')) || {}).main || {}).slipIds || [];
  } catch (e) {}
  return {
    approved: approvedIds.length,
    approvedIds,
    ccApproved: ccIds.length,
    ccApprovedIds: ccIds,
    needsReview: reviewIds.length,
    needsReviewIds: reviewIds,
    redboxSlipCount: slipIds.length,
    redboxAuditQueue: readArr(WD + '/_v2_redbox_audit_queue.json').length,
    redboxMode: fs.existsSync(WD + '/_v2_redbox_complete.flag') ? 'seo-engine' : 'red-box',
    engineMode: fs.existsSync(WD + '/_v2_redbox_complete.flag'),
    slipScanAt: (() => { try { return JSON.parse(fs.readFileSync(WD + '/_v2_slip_scan_result.json', 'utf8')).at; } catch (e) { return null; } })(),
  };
}

// Reconcile: each catalog id is in exactly one bucket when ledgers are clean.
//   catalogTotal = unprocessed + needsReview + approved − overlap(NR∩AP)
//   ccApproved ⊆ approved (dual-sign is stage-2 only; stage-1 clear already moved red→green)
//   unprocessed = in catalog but not yet in NR or AP (main engine pipeline)
function reconcileLedger(idx) {
  const { approvedIds, needsReviewIds, ccApprovedIds } = readLedger();
  const nrSet = new Set(needsReviewIds);
  const apSet = new Set(approvedIds);
  const catalogIds = new Set((idx && idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const overlap = needsReviewIds.filter(id => apSet.has(id));
  const ccNotAp = ccApprovedIds.filter(id => !apSet.has(id));
  const staleInLedger = [...new Set([...needsReviewIds, ...approvedIds])].filter(id => !catalogIds.has(id));
  const unprocessed = [...catalogIds].filter(id => !nrSet.has(id) && !apSet.has(id)).length;
  const accounted = needsReviewIds.length + approvedIds.length - overlap.length;
  const r = {
    catalogTotal: catalogIds.size,
    needsReview: needsReviewIds.length,
    approved: approvedIds.length,
    ccApproved: ccApprovedIds.length,
    unprocessed,
    overlap: overlap.length,
    ccNotInApproved: ccNotAp.length,
    staleInLedger: staleInLedger.length,
    accounted,
    ok: overlap.length === 0 && ccNotAp.length === 0,
    formula: 'catalogTotal ≈ unprocessed + needsReview + approved − overlap; ccApproved ⊆ approved',
  };
  if (!r.ok || staleInLedger.length) {
    const msg = `[seo-reconcile] drift overlap=${r.overlap} ccNotAp=${r.ccNotInApproved} stale=${r.staleInLedger} unprocessed=${r.unprocessed} catalog=${r.catalogTotal} red=${r.needsReview} green=${r.approved} cc=${r.ccApproved}`;
    console.warn(msg);
  }
  return r;
}

const PRESERVE_KEYS = [
  'fixesPerMin', 'fixesPerHour', 'indexedToday', 'mode', 'total', 'counts',
  'batchOffset', 'batchSize', 'coveragePct', 'crewPhase', 'reviewNote', 'recentlyFixed',
];

function preserveFromCur(cur, patch) {
  const kept = {};
  for (const k of PRESERVE_KEYS) {
    if (patch && patch[k] != null) kept[k] = patch[k];
    else if (cur && cur[k] != null) kept[k] = cur[k];
  }
  return kept;
}

function enrichContent(cur, patch, idx) {
  const ledger = readLedger();
  const { approvedIds, ccApprovedIds, ...ledgerPublic } = ledger;
  const entries = (idx && idx.entries) || [];
  const catalogTotal = entries.length || (patch && patch.catalogTotal) || (cur && cur.catalogTotal) || 0;
  const approved = ledger.approved || (cur && cur.approved) || 0;
  const ccApproved = ledger.ccApproved || (cur && cur.ccApproved) || 0;
  const needsReview = ledger.needsReview != null ? ledger.needsReview : ((cur && cur.needsReview) || 0);
  const indexed = entries.length
    ? entries.filter(e => e && e.was_indexed_at).length
    : ((cur && cur.indexed) != null ? cur.indexed : 0);
  const preserved = preserveFromCur(cur, patch);
  return Object.assign({}, cur || {}, patch || {}, ledgerPublic, preserved, {
    approved,
    ccApproved,
    needsReview,
    catalogTotal,
    remaining: (patch && patch.remaining != null) ? patch.remaining
      : (cur && cur.remaining != null) ? cur.remaining
      : Math.max(0, catalogTotal - approved),
    perfectPct: catalogTotal ? Math.round(approved / catalogTotal * 1000) / 10 : 0,
    indexed,
    notIndexed: Math.max(0, catalogTotal - indexed),
    auditedAt: (patch && patch.auditedAt) || new Date().toISOString(),
  });
}

async function pushSeoCounts(store, patch) {
  if (!store) return null;
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }).catch(() => null);
  const reconcile = reconcileLedger(idx);
  const cur = await store.get('seo-monitor/content.json', { type: 'json' }).catch(() => null) || {};
  const ledger = readLedger();
  const prevNeedsReview = cur.needsReview != null ? cur.needsReview : ledger.needsReview;
  const prevApproved = cur.approved != null ? cur.approved : ledger.approved;
  const prevCcApproved = cur.ccApproved != null ? cur.ccApproved : ledger.ccApproved;
  const deltaNeedsReview = ledger.needsReview - prevNeedsReview;
  const deltaApproved = ledger.approved - prevApproved;
  const deltaCcApproved = ledger.ccApproved - prevCcApproved;
  const moved = deltaNeedsReview !== 0 || deltaApproved !== 0 || deltaCcApproved !== 0;
  const deltaPatch = {
    prevNeedsReview,
    prevApproved,
    prevCcApproved,
    deltaNeedsReview,
    deltaApproved,
    deltaCcApproved,
    deltaAt: moved ? new Date().toISOString() : (cur.deltaAt || null),
  };
  if (moved && deltaNeedsReview + deltaApproved !== 0) {
    console.warn(`[pushSeoCounts] ledger drift redΔ=${deltaNeedsReview} greenΔ=${deltaApproved} (expect 1:1 on stage-1 clear)`);
  }
  const out = enrichContent(cur, Object.assign({ auditedAt: new Date().toISOString(), reconcile }, deltaPatch, patch || {}), idx);
  await store.setJSON('seo-monitor/content.json', out);
  try {
    fs.mkdirSync(WD + '/_seo_audit', { recursive: true });
    fs.writeFileSync(WD + '/_seo_audit/content.json', JSON.stringify(Object.assign({}, out, { needsReviewIds: (out.needsReviewIds || []).slice(0, 300) }), null, 1));
  } catch (e) {}
  return out;
}

module.exports = { readLedger, reconcileLedger, enrichContent, pushSeoCounts, WD };
