// _v2_sitewide_slip_scan.js — deterministic sitewide slip-through scan (4444 2026-06-30).
// Low-cost: gradeEntry + stationGaps only — NO DeepSeek/Claude per entry.
//
// Usage:
//   node _v2_sitewide_slip_scan.js --dry              # scan only (default)
//   node _v2_sitewide_slip_scan.js --live             # demote slips → needs-review
//   node _v2_sitewide_slip_scan.js --dry --exempt-cc  # skip cc-signed from main scan
//   node _v2_sitewide_slip_scan.js --dry --scan-cc    # also audit cc_approved (report only)
//   node _v2_sitewide_slip_scan.js --dry --24h-only --looks-pass   # cheap: last-24h blobs that grade 12/13+ but fail station gates
//   node _v2_sitewide_slip_scan.js --live --24h-only --looks-pass  # demote only those → needs-review
//
// Env: V2_SLIP_CONC (default 12), V2C_MIN_SCORE, V2C_WORDS, V2_SLIP_RECENT (optional tail limit on ledger ids)
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { C } = require('./_v2_components');

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

const APPROVED = WD + '/_v2_approved.json';
const REVIEW = WD + '/_v2_needs_review.json';
const CC_APPROVED = WD + '/_v2_cc_approved.json';
const FINAL_APPROVED = WD + '/_v2_final_approved.json';
const RESULT = WD + '/_v2_slip_scan_result.json';
const APPROVED_BACKUP = WD + '/_v2_approved.pre_slip_scan.json';
const REVIEW_BACKUP = WD + '/_v2_needs_review.pre_slip_scan.json';
const CC_BACKUP = WD + '/_v2_cc_approved.pre_slip_scan.json';
const HOURS_24 = 24 * 60 * 60 * 1000;
const cutoff24h = () => Date.now() - HOURS_24;

const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);
const WORD_FLOOR = parseInt(process.env.V2C_WORDS || '2000', 10);
const CONC = Math.max(1, parseInt(process.env.V2_SLIP_CONC || '12', 10));
const LOG_EVERY = 500;

const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];
const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;
const logln = s => console.log(`[slip-scan] ${s}`);

// stationGaps aligned to _v2_auditor.js
const stationGaps = (b, valid, idForGrade) => {
  const f = [];
  const gid = idForGrade || 'x';
  const score = gradeEntry(gid, b, { imagesDeferred: true }).score;
  if (score < MIN_SCORE) f.push(`score<${MIN_SCORE}`);
  if (wordCount(b) < WORD_FLOOR) f.push('words<2000');
  if (!C.directAnswer(b)) f.push('directAnswer');
  if (!C.faq5(b)) f.push('faq5');
  if (!C.twoMermaid(b)) f.push('twoMermaid');
  if (!C.mermaidClean(b)) f.push('mermaidClean');
  if (!C.sources5(b)) f.push('sources5');
  if (!C.related(b)) f.push('related');
  if (!C.linksClean(b, valid)) f.push('linksClean');
  if (!/class=["']cro-ad/.test(b)) f.push('croCard');
  return f;
};

function bump(map, key, n = 1) { map[key] = (map[key] || 0) + n; }

async function scanIds(ids, valid, label, opts = {}) {
  const { only24h = false, looksPass = false, skipNot24h = false } = opts;
  const total = ids.length;
  let scanned = 0, pass = 0, skipped24h = 0;
  const slips = [];
  const slips24h = [];
  const byReason = {};
  const byReasonAll = {};   // count every gap (entries can have multiple)
  const byPillar = {};
  const scoreHist = {};
  const samplesByReason = {};
  const c24 = cutoff24h();

  let qi = 0;
  async function worker() {
    while (true) {
      const i = qi++;
      if (i >= total) return;
      const id = ids[i];
      let entry = { id, pillar: pillarOf(id), score: null, words: null, gaps: [], primaryReason: null, updated_at: null, leak24h: false };

      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (!e || !e.answer) {
          entry.gaps = ['no-blob'];
          entry.primaryReason = 'no-blob';
        } else {
          entry.updated_at = e.updated_at || null;
          entry.words = wordCount(e.answer);
          entry.score = gradeEntry(id, e.answer, { imagesDeferred: true }).score;
          entry.gaps = stationGaps(e.answer, valid, id);
          entry.primaryReason = entry.gaps[0] || null;
        }
      } catch (x) {
        entry.gaps = ['fetch-err'];
        entry.primaryReason = 'fetch-err';
      }

      if (entry.updated_at) {
        const t = Date.parse(entry.updated_at);
        if (!Number.isNaN(t) && t >= c24) entry.leak24h = true;
      }

      scanned++;
      if (skipNot24h && !entry.leak24h) {
        skipped24h++;
        continue;
      }
      const looksLikePass = entry.score != null && entry.score >= MIN_SCORE;
      if (entry.gaps.length === 0) {
        pass++;
      } else if (only24h && !entry.leak24h) {
        // out of 24h window — ignore for slip counts / demote
      } else if (looksPass && !looksLikePass) {
        // grader below 12/13 — not a false pass
      } else {
        slips.push(entry);
        if (entry.leak24h) slips24h.push(entry.id);
        bump(byReason, entry.primaryReason);
        bump(byPillar, entry.pillar);
        if (entry.score != null) bump(scoreHist, String(entry.score));
        for (const g of entry.gaps) {
          bump(byReasonAll, g);
          if (!samplesByReason[g]) samplesByReason[g] = [];
          if (samplesByReason[g].length < 8) samplesByReason[g].push(id);
        }
      }

      if (scanned % LOG_EVERY === 0 || scanned === total) {
        logln(`${label}: ${scanned}/${total} scanned · pass=${pass} slip=${slips.length}${skipNot24h ? ` skippedNot24h=${skipped24h}` : ''}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONC }, () => worker()));
  slips.sort((a, b) => a.id.localeCompare(b.id));

  return {
    label,
    total,
    scanned,
    pass,
    slipCount: slips.length,
    skipped24h,
    slip24hCount: slips24h.length,
    slip24hIds: slips24h,
    byReason,
    byReasonAll,
    byPillar: Object.fromEntries(Object.entries(byPillar).sort((a, b) => b[1] - a[1])),
    scoreHist: Object.fromEntries(Object.entries(scoreHist).sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10))),
    samplesByReason,
    sampleSlips: slips.slice(0, 40),
    slipIds: slips.map(s => s.id),
  };
}

function applyDemote(slipIds, before) {
  const approved = new Set(readArr(APPROVED));
  const review = new Set(readArr(REVIEW));
  const cc = new Set(readArr(CC_APPROVED));
  const final = new Set(readArr(FINAL_APPROVED));
  const toMove = slipIds.filter(id => approved.has(id) || cc.has(id) || final.has(id));
  for (const id of slipIds) {
    approved.delete(id);
    cc.delete(id);
    final.delete(id);
    review.add(id);
  }
  fs.copyFileSync(APPROVED, APPROVED_BACKUP);
  fs.copyFileSync(REVIEW, REVIEW_BACKUP);
  if (fs.existsSync(CC_APPROVED)) fs.copyFileSync(CC_APPROVED, CC_BACKUP);
  fs.writeFileSync(APPROVED, JSON.stringify([...approved].sort()));
  fs.writeFileSync(REVIEW, JSON.stringify([...review].sort()));
  fs.writeFileSync(CC_APPROVED, JSON.stringify([...cc].sort()));
  if (fs.existsSync(FINAL_APPROVED)) fs.writeFileSync(FINAL_APPROVED, JSON.stringify([...final].sort()));
  return {
    moved: toMove.length,
    removedFromApproved: slipIds.filter(id => before.approvedSet && before.approvedSet.has(id)).length,
    removedFromCc: slipIds.filter(id => before.ccSet && before.ccSet.has(id)).length,
    approvedBefore: before.approved,
    approvedAfter: approved.size,
    reviewBefore: before.review,
    reviewAfter: review.size,
    ccBefore: before.ccApproved,
    ccAfter: cc.size,
    backups: [APPROVED_BACKUP, REVIEW_BACKUP, CC_BACKUP],
  };
}

(async () => {
  const args = new Set(process.argv.slice(2));
  const live = args.has('--live');
  const dry = args.has('--dry') || !live;
  const exemptCc = args.has('--exempt-cc');
  const exemptFinal = args.has('--exempt-final');
  const only24h = args.has('--24h-only');
  const looksPass = args.has('--looks-pass');
  const scanCc = args.has('--scan-cc') || (!only24h && !looksPass);
  const recentTail = parseInt(process.env.V2_SLIP_RECENT || '0', 10);
  const scanOpts = { only24h, looksPass, skipNot24h: only24h };

  logln(`mode=${live ? 'LIVE' : 'DRY'} conc=${CONC} minScore=${MIN_SCORE} wordFloor=${WORD_FLOOR} only24h=${only24h} looksPass=${looksPass} recentTail=${recentTail || 'all'}`);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));

  let approvedIds = readArr(APPROVED);
  const ccIds = readArr(CC_APPROVED);
  const ccSet = new Set(ccIds);
  const finalSet = new Set(readArr(FINAL_APPROVED));
  const exemptSet = new Set();
  if (exemptCc) for (const id of ccSet) exemptSet.add(id);
  if (exemptFinal) for (const id of finalSet) exemptSet.add(id);

  const tailSlice = ids => (recentTail > 0 && ids.length > recentTail ? ids.slice(-recentTail) : ids);
  let scanTargets;
  if (only24h) {
    scanTargets = [...new Set([
      ...approvedIds.filter(id => !exemptSet.has(id)),
      ...ccIds.filter(id => !exemptSet.has(id)),
    ])];
  } else {
    scanTargets = tailSlice(approvedIds.filter(id => !exemptSet.has(id)));
  }
  logln(`approved=${approvedIds.length} cc=${ccIds.length} scanTargets=${scanTargets.length} exempt=${exemptSet.size}`);

  const before = {
    approved: approvedIds.length,
    review: readArr(REVIEW).length,
    ccApproved: ccSet.size,
    approvedSet: new Set(approvedIds),
    ccSet,
  };

  const main = await scanIds(scanTargets, valid, only24h ? '24h-false-pass' : 'main-approved', scanOpts);

  let ccAudit = null;
  if (scanCc && ccSet.size && !only24h) {
    logln(`cc-audit pass (report only, no demote): ${ccSet.size} ids`);
    ccAudit = await scanIds(tailSlice([...ccSet]), valid, 'cc-approved-report-only', scanOpts);
  }

  const out = {
    at: new Date().toISOString(),
    mode: live ? 'live' : 'dry',
    only24h,
    looksPass,
    recentTail: recentTail || null,
    minScore: MIN_SCORE,
    wordFloor: WORD_FLOOR,
    concurrency: CONC,
    before,
    main,
    ccAudit,
    liveApplied: null,
  };

  if (live && (main.slipCount > 0 || (ccAudit && ccAudit.slipCount > 0))) {
    const allSlipIds = [...new Set([...main.slipIds, ...(ccAudit ? ccAudit.slipIds : [])])];
    logln(`LIVE demote: moving ${allSlipIds.length} slip ids → needs-review (main=${main.slipCount} cc=${ccAudit ? ccAudit.slipCount : 0})`);
    out.liveApplied = applyDemote(allSlipIds, before);
    out.after = {
      approved: out.liveApplied.approvedAfter,
      review: out.liveApplied.reviewAfter,
    };
    logln(`LIVE done: approved ${out.liveApplied.approvedBefore}→${out.liveApplied.approvedAfter} · review ${out.liveApplied.reviewBefore}→${out.liveApplied.reviewAfter} · moved=${out.liveApplied.moved}`);
  } else if (live) {
    logln('LIVE: no slips — ledgers unchanged');
  } else {
    logln(`DRY complete: would demote ${main.slipCount} ids`);
  }

  fs.writeFileSync(RESULT, JSON.stringify(out, null, 2));
  logln(`wrote ${RESULT}`);

  console.log(JSON.stringify({
    mode: out.mode,
    totalScanned: main.total,
    pass: main.pass,
    slipCount: main.slipCount,
    slip24hCount: main.slip24hCount,
    byReason: main.byReason,
    topPillars: Object.entries(main.byPillar).slice(0, 10),
    scoreHistSlips: main.scoreHist,
    beforeReview: before.review,
    afterReview: out.liveApplied ? out.liveApplied.reviewAfter : before.review + main.slipCount,
    sampleSlips: main.sampleSlips.slice(0, 15).map(s => ({ id: s.id, score: s.score, reason: s.primaryReason, gaps: s.gaps })),
    ccAuditFails: ccAudit ? ccAudit.slipCount : null,
    liveRan: !!out.liveApplied,
  }, null, 2));
})().catch(e => { console.error('[slip-scan] FATAL', e.message); process.exit(1); });
