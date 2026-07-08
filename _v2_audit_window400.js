// One-shot: audit catalog window (offset-400 .. offset) — deterministic stationGaps only
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
const winStart = Math.max(0, offset - 400);
const winEnd = offset;

const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const approved = new Set(readArr(WD + '/_v2_approved.json'));
const ccApproved = new Set(readArr(WD + '/_v2_cc_approved.json'));
const needsReview = new Set(readArr(WD + '/_v2_needs_review.json'));

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

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const allEntries = (idx.entries || []).filter(e => e && e.id);
  const valid = new Set(allEntries.map(e => e.id));
  const windowIds = allEntries.slice(winStart, winEnd).map(e => e.id);

  const gapCounts = {};
  const failByGap = {};
  let pass = 0, fail = 0, noBlob = 0;
  const failIds = [];
  const passIds = [];
  const results = [];

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

      const entry = {
        id, idxPos,
        stage1: approved.has(id),
        ccSigned: ccApproved.has(id),
        needsReview: needsReview.has(id),
        score, words,
        gaps,
        passAll: gaps.length === 0,
      };
      results.push(entry);

      if (gaps.length === 0) { pass++; passIds.push(id); }
      else {
        fail++;
        failIds.push(id);
        for (const g of gaps) {
          gapCounts[g] = (gapCounts[g] || 0) + 1;
          if (!failByGap[g]) failByGap[g] = [];
          if (failByGap[g].length < 5) failByGap[g].push(id);
        }
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  results.sort((a, b) => a.idxPos - b.idxPos);

  const stage1InWindow = windowIds.filter(id => approved.has(id)).length;
  const ccInWindow = windowIds.filter(id => ccApproved.has(id)).length;
  const lackCcInWindow = windowIds.filter(id => approved.has(id) && !ccApproved.has(id)).length;

  const out = {
    at: new Date().toISOString(),
    cursorOffset: offset,
    window: { startIdx: winStart, endIdx: winEnd, count: windowIds.length },
    ids: windowIds,
    minScore: MIN_SCORE,
    wordFloor: WORD_FLOOR,
    totals: { pass, fail, noBlob, stage1InWindow, ccInWindow, lackCcInWindow },
    gapCounts,
    failByGapSample: failByGap,
    passIds,
    failIds,
    results,
  };

  fs.writeFileSync(WD + '/_v2_audit_window400_result.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify({
    window: `${winStart}-${winEnd}`,
    count: windowIds.length,
    pass, fail, noBlob,
    stage1InWindow, ccInWindow, lackCcInWindow,
    gapCounts,
    first10: windowIds.slice(0, 10),
    last10: windowIds.slice(-10),
  }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
