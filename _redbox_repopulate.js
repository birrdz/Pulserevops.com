// _redbox_repopulate.js — OWNER (2026-06-30): move genuinely sub-bar APPROVED entries → red box.
// "approved q&as that are not 12 or higher" = a REAL gap (score<12 OR words<2000 OR a real station gap).
// EXCLUDES the croCard flag — the CRO card is injected at render-time (pulse-machine-entry.js), never
// stored in the blob, so it falsely trips on every entry. The stock _v2_sitewide_slip_scan.js --live
// would demote all 19k because of that; this script does NOT.
//
//   node _redbox_repopulate.js            # DRY — scan + report only
//   node _redbox_repopulate.js --live     # back up ledgers, then demote slips green→red (1:1)
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { C } = require('./_v2_components');
const { pushSeoCounts } = require('./_seo_monitor_sync_lib');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const AP = WD + '/_v2_approved.json';
const NR = WD + '/_v2_needs_review.json';
const CC = WD + '/_v2_cc_approved.json';
const RESULT = WD + '/_redbox_repopulate_result.json';
const MIN_SCORE = 12, WORD_FLOOR = 2000;
const CONC = 14;
const LIVE = process.argv.includes('--live');

const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
const writeArr = (f, a) => fs.writeFileSync(f, JSON.stringify(a));
const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

// real station gaps — croCard intentionally EXCLUDED (render-time only)
function realGaps(b, valid) {
  const f = [];
  const score = gradeEntry('x', b, { imagesDeferred: true }).score;
  if (score < MIN_SCORE) f.push('score<12');
  if (wordCount(b) < WORD_FLOOR) f.push('words<2000');
  if (!C.directAnswer(b)) f.push('directAnswer');
  if (!C.faq5(b)) f.push('faq6');
  if (!C.twoMermaid(b)) f.push('mermaid2');
  if (!C.mermaidClean(b)) f.push('mermaidDirty');
  if (!C.sources5(b)) f.push('sources5');
  if (!C.related(b)) f.push('related');
  if (!C.linksClean(b, valid)) f.push('links');
  return { score, words: wordCount(b), gaps: f };
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const approved = readArr(AP);
  const nrSet = new Set(readArr(NR));
  const scanList = approved.filter(id => !nrSet.has(id));   // skip ones already in red
  console.log(`[repop] scanning ${scanList.length} approved (skipping ${approved.length - scanList.length} already in red) · mode=${LIVE ? 'LIVE' : 'DRY'}`);

  const slips = [];
  const byReason = {}; const byPillar = {}; const scoreHist = {};
  let done = 0, noBlob = 0;
  let qi = 0;
  async function worker() {
    while (qi < scanList.length) {
      const id = scanList[qi++];
      try {
        const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
        if (!e || !e.answer) { noBlob++; continue; }
        const { score, words, gaps } = realGaps(e.answer, valid);
        if (gaps.length) {
          slips.push({ id, score, words, gaps });
          byReason[gaps[0]] = (byReason[gaps[0]] || 0) + 1;
          byPillar[pillarOf(id)] = (byPillar[pillarOf(id)] || 0) + 1;
          scoreHist[String(score)] = (scoreHist[String(score)] || 0) + 1;
        }
      } catch (x) {}
      if (++done % 2000 === 0) console.log(`[repop] ${done}/${scanList.length} · slips=${slips.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));

  slips.sort((a, b) => (a.score - b.score) || a.id.localeCompare(b.id));   // worst first
  const result = {
    scanned: scanList.length, noBlob, slipCount: slips.length,
    byReason, scoreHist,
    byPillar: Object.fromEntries(Object.entries(byPillar).sort((a, b) => b[1] - a[1])),
    slipIds: slips.map(s => s.id),
    sample: slips.slice(0, 30),
    at: new Date().toISOString(), live: LIVE,
  };
  writeArr(RESULT, result);
  console.log(`[repop] DONE scanned=${scanList.length} slips=${slips.length} noBlob=${noBlob}`);
  console.log(`[repop] byReason(primary)=${JSON.stringify(byReason)}`);
  console.log(`[repop] scoreHist=${JSON.stringify(scoreHist)}`);
  console.log(`[repop] topPillars=${JSON.stringify(Object.fromEntries(Object.entries(result.byPillar).slice(0, 12)))}`);

  if (!LIVE) { console.log('[repop] DRY — no ledgers changed. Re-run with --live to demote.'); return; }

  // ── LIVE demote: back up, then move slips green→red, clobber-safe ──
  const slipSet = new Set(result.slipIds);
  fs.writeFileSync(AP + '.pre_repop.json', fs.readFileSync(AP));
  fs.writeFileSync(NR + '.pre_repop.json', fs.readFileSync(NR));
  fs.writeFileSync(CC + '.pre_repop.json', fs.readFileSync(CC));
  const apBefore = readArr(AP), nrBefore = readArr(NR), ccBefore = readArr(CC);
  const apAfter = apBefore.filter(id => !slipSet.has(id));
  const ccAfter = ccBefore.filter(id => !slipSet.has(id));
  const nrAfter = [...new Set([...nrBefore, ...result.slipIds])];
  writeArr(AP, apAfter); writeArr(CC, ccAfter); writeArr(NR, nrAfter);
  console.log(`[repop] LIVE demoted ${result.slipCount}: green ${apBefore.length}→${apAfter.length} · red ${nrBefore.length}→${nrAfter.length} · cc ${ccBefore.length}→${ccAfter.length}`);
  try { await pushSeoCounts(store, { lastRepopAt: new Date().toISOString(), note: 'repopulate red box from sub-bar approved' }); } catch (x) {}
  console.log('[repop] seo counts pushed.');
})().catch(e => { console.log('[repop] FATAL', e && e.message); process.exit(1); });
