const fs = require('fs');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { C } = require('./_v2_components');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const WORD_FLOOR = 2000;
const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);
const wc = b => (String(b || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(/[A-Za-z0-9'-]+/g) || []).length;
const ids = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_v2_needs_review.json', 'utf8'));
const counts = { total: ids.length, noBlob: 0, scoreLow: 0, words: 0, noAnswer: 0, noFaq: 0, faqLt6: 0, mermaidLt2: 0, mermaidDirty: 0, noSources: 0, sourcesLt5: 0, noRelated: 0, noCro: 0, badLinks: 0, wouldPassNow: 0 };
const byPillar = {};
const scoreHist = {};
(async () => {
  for (const id of ids) {
    const p = (String(id).match(/^[a-z]+/) || ['?'])[0];
    byPillar[p] = (byPillar[p] || 0) + 1;
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) { counts.noBlob++; continue; }
    const b = e.answer;
    const g = gradeEntry(id, b, { imagesDeferred: true });
    scoreHist[g.score] = (scoreHist[g.score] || 0) + 1;
    if (g.score < MIN_SCORE) counts.scoreLow++;
    if (wc(b) < WORD_FLOOR) counts.words++;
    if (!C.directAnswer(b)) counts.noAnswer++;
    if (!C.faq(b)) counts.noFaq++;
    else if (!C.faq5(b)) counts.faqLt6++;
    if (!C.twoMermaid(b)) counts.mermaidLt2++;
    if (!C.mermaidClean(b)) counts.mermaidDirty++;
    if (!C.sources(b)) counts.noSources++;
    else if (!C.sources5(b)) counts.sourcesLt5++;
    if (!C.related(b)) counts.noRelated++;
    if (!/class=["']cro-ad/.test(b)) counts.noCro++;
    const ok = g.score >= MIN_SCORE && wc(b) >= WORD_FLOOR && C.directAnswer(b) && C.faq5(b) && C.twoMermaid(b) && C.mermaidClean(b) && C.sources5(b) && C.related(b) && /class=["']cro-ad/.test(b);
    if (ok) counts.wouldPassNow++;
  }
  const topPillars = Object.entries(byPillar).sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log(JSON.stringify({ MIN_SCORE, counts, scoreHist, topPillars }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
