// One-shot: audit catalog window (offset-500 .. offset) — slip-through detection
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

const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);
const WORD_FLOOR = parseInt(process.env.V2C_WORDS || '2000', 10);
const cursor = JSON.parse(fs.readFileSync(WD + '/_v2_components_cursor.json', 'utf8'));
const offset = cursor.offset || 20400;

const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const approved = new Set(readArr(WD + '/_v2_approved.json'));
const ccApproved = new Set(readArr(WD + '/_v2_cc_approved.json'));
const needsReview = new Set(readArr(WD + '/_v2_needs_review.json'));
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;

const stationGaps = (b, valid) => {
  const f = [];
  if (gradeEntry('x', b, { imagesDeferred: true }).score < MIN_SCORE) f.push(`score<${MIN_SCORE}`);
  if (wordCount(b) < WORD_FLOOR) f.push('words<2000');
  if (!C.directAnswer(b)) f.push('directAnswer');
  if (!C.faq5(b)) f.push('faq');
  if (!C.twoMermaid(b)) f.push('mermaid2');
  if (!C.mermaidClean(b)) f.push('mermaidDirty');
  if (!C.sources5(b)) f.push('sources5');
  if (!C.related(b)) f.push('related');
  if (!C.linksClean(b, valid)) f.push('links');
  if (!/class=["']cro-ad/.test(b)) f.push('croCard');
  return f;
};

async function auditWindow(allEntries, valid, winStart, winEnd, label) {
  const windowIds = allEntries.slice(winStart, winEnd).map(e => e.id);
  const gapCounts = {};
  const failByGap = {};
  const scoreHist = {};
  let pass = 0, fail = 0, noBlob = 0;
  const results = [];
  const slipThrough = [];       // stage1 approved + score < 12
  const approvedFailGate = [];  // stage1 approved + any station gap
  const slipByPillar = {};

  const CONC = 8;
  let qi = 0;
  async function worker() {
    while (true) {
      const i = qi++;
      if (i >= windowIds.length) return;
      const id = windowIds[i];
      const idxPos = winStart + i;
      let gaps = ['no-blob'];
      let score = null;
      let words = null;
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (e && e.answer) {
          gaps = stationGaps(e.answer, valid);
          score = gradeEntry(id, e.answer, { imagesDeferred: true }).score;
          words = wordCount(e.answer);
        } else {
          noBlob++;
        }
      } catch (x) {
        gaps = ['fetch-err'];
      }

      if (score != null) scoreHist[score] = (scoreHist[score] || 0) + 1;

      const stage1 = approved.has(id);
      const entry = {
        id, idxPos, pillar: pillarOf(id),
        stage1,
        ccSigned: ccApproved.has(id),
        needsReview: needsReview.has(id),
        score, words,
        gaps,
        passAll: gaps.length === 0,
      };
      results.push(entry);

      if (gaps.length === 0) pass++;
      else {
        fail++;
        for (const g of gaps) {
          gapCounts[g] = (gapCounts[g] || 0) + 1;
          if (!failByGap[g]) failByGap[g] = [];
          if (failByGap[g].length < 8) failByGap[g].push(id);
        }
      }

      if (stage1 && score != null && score < MIN_SCORE) {
        slipThrough.push({ id, idxPos, score, gaps, pillar: pillarOf(id) });
        const p = pillarOf(id);
        slipByPillar[p] = (slipByPillar[p] || 0) + 1;
      }
      if (stage1 && gaps.length > 0) {
        approvedFailGate.push({ id, idxPos, score, gaps, pillar: pillarOf(id) });
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  results.sort((a, b) => a.idxPos - b.idxPos);

  const stage1InWindow = windowIds.filter(id => approved.has(id)).length;
  const ccInWindow = windowIds.filter(id => ccApproved.has(id)).length;
  const lackCcInWindow = windowIds.filter(id => approved.has(id) && !ccApproved.has(id)).length;

  return {
    label,
    window: { startIdx: winStart, endIdx: winEnd, count: windowIds.length },
    firstId: windowIds[0] || null,
    lastId: windowIds[windowIds.length - 1] || null,
    minScore: MIN_SCORE,
    wordFloor: WORD_FLOOR,
    totals: { pass, fail, noBlob, stage1InWindow, ccInWindow, lackCcInWindow },
    scoreHist,
    gapCounts,
    failByGapSample: failByGap,
    slipThrough: {
      count: slipThrough.length,
      byPillar: slipByPillar,
      ids: slipThrough.map(x => x.id),
      sample: slipThrough.slice(0, 30),
    },
    approvedFailGate: {
      count: approvedFailGate.length,
      sample: approvedFailGate.slice(0, 30),
    },
    results,
  };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const allEntries = (idx.entries || []).filter(e => e && e.id);
  const valid = new Set(allEntries.map(e => e.id));
  const catalogSize = allEntries.length;

  // Primary: 500 entries ending at cursor [offset-500, offset)
  const primaryStart = Math.max(0, offset - 500);
  const primaryEnd = offset;
  const primary = await auditWindow(allEntries, valid, primaryStart, primaryEnd, 'primary-500');

  // Secondary: "400-500 back" band [offset-500, offset-400) = oldest 100 of the lookback
  const secondaryStart = Math.max(0, offset - 500);
  const secondaryEnd = Math.max(0, offset - 400);
  const secondary = secondaryStart < secondaryEnd
    ? await auditWindow(allEntries, valid, secondaryStart, secondaryEnd, 'secondary-400to500back')
    : null;

  const out = {
    at: new Date().toISOString(),
    cursorOffset: offset,
    catalogSize,
    primary,
    secondary,
    remediation: null,
  };

  const slipCount = primary.slipThrough.count;
  if (slipCount > 50) {
    out.remediation = {
      action: 'owner_review_required',
      note: `${slipCount} stage-1 approved entries score < ${MIN_SCORE} — wrote _v2_slipthrough_reject.json for review (NOT auto-modified ledgers)`,
      slipIds: primary.slipThrough.ids,
    };
    fs.writeFileSync(WD + '/_v2_slipthrough_reject.json', JSON.stringify({
      at: out.at,
      window: primary.window,
      count: slipCount,
      ids: primary.slipThrough.ids,
      entries: primary.slipThrough.sample,
    }, null, 2));
  } else if (slipCount > 0) {
    out.remediation = {
      action: 'manual_triage',
      note: `${slipCount} slip-through entries — below 50 threshold; owner should remove from _v2_approved.json and add to _v2_needs_review.json`,
      slipIds: primary.slipThrough.ids,
    };
  } else {
    out.remediation = { action: 'none', note: 'No stage-1 approved entries with score < 12 in window' };
  }

  fs.writeFileSync(WD + '/_v2_audit_window500_result.json', JSON.stringify(out, null, 2));

  console.log(JSON.stringify({
    catalogSize,
    cursorOffset: offset,
    primary: {
      window: `${primaryStart}-${primaryEnd}`,
      count: primary.window.count,
      firstId: primary.firstId,
      lastId: primary.lastId,
      pass: primary.totals.pass,
      fail: primary.totals.fail,
      scoreHist: primary.scoreHist,
      stage1: primary.totals.stage1InWindow,
      ccSigned: primary.totals.ccInWindow,
      slipThrough: primary.slipThrough.count,
      approvedFailGate: primary.approvedFailGate.count,
      slipByPillar: primary.slipThrough.byPillar,
      gapCounts: primary.gapCounts,
    },
    secondary: secondary ? {
      window: `${secondaryStart}-${secondaryEnd}`,
      count: secondary.window.count,
      slipThrough: secondary.slipThrough.count,
      scoreHist: secondary.scoreHist,
    } : null,
    remediation: out.remediation,
  }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
