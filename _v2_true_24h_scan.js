// _v2_true_24h_scan.js — true last-24h false-pass count (log-based approval times, not blob updated_at)
// Usage: node _v2_true_24h_scan.js
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
const CONC = parseInt(process.env.V2_SLIP_CONC || '12', 10);
const HOURS = parseInt(process.env.V2_TRUE_24H || '24', 10);
const cutoff = Date.now() - HOURS * 60 * 60 * 1000;
const RESULT = WD + '/_v2_true_24h_result.json';

const wordCount = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

const stationGaps = (b, valid, id) => {
  const f = [];
  const score = gradeEntry(id, b, { imagesDeferred: true }).score;
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
  return { score, gaps: f };
};

function parseLogEvents(file, patterns) {
  const events = new Map(); // id -> { at, source, line }
  if (!fs.existsSync(file)) return events;
  const text = fs.readFileSync(file, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    let at = null;
    const tm = line.match(/^(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/);
    if (tm) at = Date.parse(tm[1]);
    else continue;
    if (Number.isNaN(at) || at < cutoff) continue;
    for (const { re, source } of patterns) {
      const m = line.match(re);
      if (m && m[1]) {
        const id = m[1].replace(/[^a-z0-9]/gi, '');
        if (!/^[a-z]+\d+$/i.test(id)) continue;
        const prev = events.get(id);
        if (!prev || at >= prev.at) events.set(id, { id, at: new Date(at).toISOString(), source });
      }
    }
  }
  return events;
}

function mergeEvents(...maps) {
  const out = new Map();
  for (const m of maps) {
    for (const [id, ev] of m) {
      const prev = out.get(id);
      if (!prev || Date.parse(ev.at) >= Date.parse(prev.at)) out.set(id, ev);
    }
  }
  return out;
}

(async () => {
  const stage1 = parseLogEvents(WD + '/_v2_components.out.log', [
    { re: /STAGE-1\s+([a-z0-9]+)/i, source: 'stage1' },
  ]);
  const nrClear = parseLogEvents(WD + '/_v2_needs_review.out.log', [
    { re: /CLEARED\s+([a-z0-9]+)/i, source: 'needs-review-cleared' },
  ]);
  const finalSigned = parseLogEvents(WD + '/_v2_final_gate.out.log', [
    { re: /FINAL-SIGNED\s+(\d+\/\d+|\d+)\s+publish-ready|w\d+\s+([a-z0-9]+)\s+✅\s+FINAL-SIGNED/i, source: 'final' },
  ]);
  // fix final regex - actual line: w2 st383 ✅ FINAL-SIGNED
  const final2 = parseLogEvents(WD + '/_v2_final_gate.out.log', [
    { re: /w\d+\s+([a-z0-9]+)\s+✅\s+FINAL-SIGNED/i, source: 'final-gate' },
  ]);
  const ccSigned = parseLogEvents(WD + '/_v2_auditor.out.log', [
    { re: /w\d+\s+([a-z0-9]+)\s+✅\s+CC-SIGNED/i, source: 'cc-audit' },
  ]);

  const approved24h = mergeEvents(stage1, nrClear);
  const final24h = mergeEvents(final2, ccSigned);

  console.log(`[true-24h] cutoff=${new Date(cutoff).toISOString()}`);
  console.log(`[true-24h] log events: stage1=${stage1.size} nr-cleared=${nrClear.size} final=${final2.size} cc=${ccSigned.size} → unique stage1/nr=${approved24h.size}`);

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const review = new Set(JSON.parse(fs.readFileSync(WD + '/_v2_needs_review.json', 'utf8')));
  const approved = new Set(JSON.parse(fs.readFileSync(WD + '/_v2_approved.json', 'utf8')));
  const cc = new Set(JSON.parse(fs.readFileSync(WD + '/_v2_cc_approved.json', 'utf8')));

  const ids = [...approved24h.keys()].sort();
  const falsePasses = [];
  const clean = [];
  const sub12 = [];
  const noBlob = [];
  let qi = 0;

  async function worker() {
    while (true) {
      const i = qi++;
      if (i >= ids.length) return;
      const id = ids[i];
      const meta = approved24h.get(id);
      const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (!e || !e.answer) { noBlob.push(id); continue; }
      const { score, gaps } = stationGaps(e.answer, valid, id);
      const row = { id, pillar: pillarOf(id), score, gaps, approvedAt: meta.at, source: meta.source, inReview: review.has(id), inApproved: approved.has(id), inFinal: cc.has(id) };
      if (score >= MIN_SCORE && gaps.length) falsePasses.push(row);
      else if (gaps.length) sub12.push(row);
      else clean.push(id);
    }
  }

  await Promise.all(Array.from({ length: CONC }, () => worker()));

  // final-gate signoffs in 24h that NOW fail station gates
  const finalFalse = [];
  for (const [id, meta] of final24h) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) continue;
    const { score, gaps } = stationGaps(e.answer, valid, id);
    if (gaps.length) finalFalse.push({ id, score, gaps, signedAt: meta.at, source: meta.source });
  }

  const byReason = {};
  const byPillar = {};
  const scoreHist = {};
  for (const r of falsePasses) {
    const reason = r.gaps[0];
    byReason[reason] = (byReason[reason] || 0) + 1;
    byPillar[r.pillar] = (byPillar[r.pillar] || 0) + 1;
    scoreHist[String(r.score)] = (scoreHist[String(r.score)] || 0) + 1;
  }

  const out = {
    at: new Date().toISOString(),
    windowHours: HOURS,
    cutoff: new Date(cutoff).toISOString(),
    methodology: 'Log-based: STAGE-1 + needs-review CLEARED timestamps from engine logs (NOT blob updated_at)',
    stage1Approvals24h: stage1.size,
    nrCleared24h: nrClear.size,
    uniqueApprovedEvents24h: approved24h.size,
    finalSigned24h: final2.size,
    ccSigned24h: ccSigned.size,
    falsePassLooks12or13: {
      count: falsePasses.length,
      scoreHist,
      byReason,
      byPillar: Object.fromEntries(Object.entries(byPillar).sort((a, b) => b[1] - a[1])),
      ids: falsePasses.map(r => r.id),
      sample: falsePasses.slice(0, 25),
    },
    sub12WithGaps: sub12.length,
    cleanPass: clean.length,
    noBlob: noBlob.length,
    finalGateNowFailing: { count: finalFalse.length, sample: finalFalse.slice(0, 15) },
    ledgerNow: { inNeedsReview: falsePasses.filter(r => r.inReview).length, stillInApproved: falsePasses.filter(r => r.inApproved).length },
  };

  fs.writeFileSync(RESULT, JSON.stringify(out, null, 2));
  console.log(JSON.stringify({
    true24hStage1Approvals: out.uniqueApprovedEvents24h,
    falsePassLooks12or13: out.falsePassLooks12or13.count,
    scoreHist: out.falsePassLooks12or13.scoreHist,
    byReason: out.falsePassLooks12or13.byReason,
    topPillars: Object.entries(out.falsePassLooks12or13.byPillar).slice(0, 8),
    alreadyDemotedToReview: out.ledgerNow.inNeedsReview,
    stillInApproved: out.ledgerNow.stillInApproved,
    finalGateSlipped: out.finalGateNowFailing.count,
    wrote: RESULT,
  }, null, 2));
})().catch(e => { console.error('[true-24h] FATAL', e); process.exit(1); });
