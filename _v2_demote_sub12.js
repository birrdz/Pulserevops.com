// _v2_demote_sub12.js — one-shot slip-through remediation (4444 2026-06-30).
// Scan _v2_approved.json; demote entries with live score<12 or failing station gates.
// Usage:
//   node _v2_demote_sub12.js              # sample 500 newest-first (default)
//   node _v2_demote_sub12.js --all        # full approved set (slow)
//   node _v2_demote_sub12.js --window 19900 20400
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { C } = require('./_v2_components');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const APPROVED = WD + '/_v2_approved.json';
const REVIEW = WD + '/_v2_needs_review.json';
const FINAL = WD + '/_v2_cc_approved.json';
const MIN_SCORE = parseInt(process.env.V2C_MIN_SCORE || '12', 10);
const WORD_FLOOR = parseInt(process.env.V2C_WORDS || '2000', 10);
const BATCH = parseInt(process.env.DEMOTE_BATCH || '25', 10);
const readArr = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return []; } };
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
  const args = process.argv.slice(2);
  let ids = readArr(APPROVED);
  const finalSet = new Set(readArr(FINAL));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));

  if (args[0] === '--ids') {
    ids = args.slice(1).filter(x => !x.startsWith('-'));
    console.log(`[demote] explicit ids: ${ids.length} entries`);
  } else if (args[0] === '--window' && args[1] != null && args[2] != null) {
    const lo = parseInt(args[1], 10), hi = parseInt(args[2], 10);
    ids = ids.filter((_, i) => i >= lo && i < hi);
    console.log(`[demote] window ${lo}-${hi}: ${ids.length} approved entries`);
  } else if (args[0] === '--all') {
    console.log(`[demote] full approved set: ${ids.length} entries`);
  } else {
    const sample = parseInt(process.env.DEMOTE_SAMPLE || '500', 10);
    ids = ids.slice(-sample).reverse();
    console.log(`[demote] sample ${sample} newest-first: ${ids.length} entries`);
  }

  let scanned = 0, demoted = 0, ok = 0, noBlob = 0, alreadyFinal = 0;
  const reasons = {};
  const approved = new Set(readArr(APPROVED));
  const review = new Set(readArr(REVIEW));

  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH);
    await Promise.all(chunk.map(async id => {
      scanned++;
      if (finalSet.has(id)) { alreadyFinal++; return; }
      const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (!e || !e.answer) { noBlob++; approved.delete(id); review.add(id); demoted++; reasons['no-blob'] = (reasons['no-blob'] || 0) + 1; return; }
      const gaps = stationGaps(e.answer, valid);
      if (gaps.length) {
        demoted++;
        approved.delete(id);
        review.add(id);
        const key = gaps[0];
        reasons[key] = (reasons[key] || 0) + 1;
      } else ok++;
    }));
    if ((i + BATCH) % 100 === 0 || i + BATCH >= ids.length) console.log(`[demote] progress ${Math.min(i + BATCH, ids.length)}/${ids.length} demoted=${demoted}`);
  }

  fs.writeFileSync(APPROVED, JSON.stringify([...approved]));
  fs.writeFileSync(REVIEW, JSON.stringify([...review]));
  console.log(JSON.stringify({ scanned, ok, demoted, noBlob, alreadyFinal, approvedLeft: approved.size, reviewSize: review.size, reasons }, null, 2));
})().catch(e => { console.error('[demote] FATAL', e.message); process.exit(1); });
