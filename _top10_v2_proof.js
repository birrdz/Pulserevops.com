// PROOF — convert ONE real live entry and score it. Writes nothing to blobs.
// Renders to the scratchpad so the HTML can be eyeballed.
//   node _top10_v2_proof.js [pillarPrefix]
'use strict';
require('./_loadenv');
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { emitTop10V2 } = require('./_top10_v2_emit');
const { gateScore } = require('./new/content_gate');
const { appliesTop10Gold, auditTop10GoldTemplate } = require('./_ranking_top10_gold_template');

const prefix = (process.argv[2] || '').toLowerCase();
const OUT = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/6d6c3142-0b9a-4ef9-88be-a2f8183c4284/scratchpad/v22_proof.html';

function theStore() {
  return getStore({
    name: 'pulse-machine-library',
    siteID: process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
}

(async () => {
  const s = theStore();
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  const all = (Array.isArray(idx) ? idx : (idx && idx.entries) || [])
    .filter(e => (!prefix || String(e.id || '').toLowerCase().startsWith(prefix)))
    .filter(e => /\b(top\s*10|top\s*ten|best\b)/i.test(String(e.title || e.question || '')));

  for (const e of all.slice(0, 400)) {
    let blob;
    try { blob = await s.get('answers/' + e.id + '.json', { type: 'json', consistency: 'strong' }); } catch (err) { continue; }
    if (!blob) continue;
    const body = String(blob.body || blob.answer || '');
    if (!appliesTop10Gold(body, String(blob.title || e.title || ''))) continue;

    // First pass: what's missing?
    const probe = emitTop10V2(Object.assign({ id: e.id }, blob), { gateScore });
    const rest = probe.missing.filter(m => !/^hero_image$|^mermaid_2$/.test(m));
    if (probe.ok || rest.length) continue;   // want a clean near-miss

    // Supply ONLY the two systematic gaps, so the proof shows the mechanism end to end.
    //   hero  — placeholder URL. Claude never places images (IMAGE_PLACEMENT_LAW);
    //           the sanctioned image drip fills this slot for real.
    //   mermaid_2 — a criteria-weighting diagram built from THIS entry's own ranked names.
    const names = (body.match(/^##\s+\d+\.\s+(.+)$/gm) || []).slice(0, 3)
      .map(h => h.replace(/^##\s+\d+\.\s+/, '').replace(/[🏆💎]/g, '').replace(/\bBEST\s+(?:OVERALL|VALUE)\b/gi, '').replace(/["\[\]()]/g, '').trim().slice(0, 28));
    const m2 = '```mermaid\nflowchart LR\n  C[Ranking criteria] --> W[Weighting]\n' +
      names.map((n, i) => `  W --> P${i + 1}["${n}"]`).join('\n') + '\n```';

    const r = emitTop10V2(Object.assign({ id: e.id }, blob), {
      gateScore,
      extraImage: { url: 'https://pulserevops.com/assets/qa/' + e.id + '-b1.jpg', alt: String(blob.title || e.title) + ' overview' },
      extraMermaid: m2,
    });

    console.log('\n=== PROOF: ' + e.id + ' ===');
    console.log('title : ' + r.report.title);
    console.log('ok    : ' + r.ok);
    console.log('gate  : ' + r.report.gate);
    console.log('words : ' + r.report.words + '   images: ' + r.report.images + '   mermaids: ' + r.report.mermaids);
    if (r.report.nonWaivable && r.report.nonWaivable.length) console.log('BLOCK : ' + r.report.nonWaivable.join(', '));
    if (r.report.waivable && r.report.waivable.length) console.log('waive : ' + r.report.waivable.join(', '));

    if (r.html) {
      fs.writeFileSync(OUT, r.html, 'utf8');
      console.log('html  : ' + OUT + ' (' + r.html.length + ' bytes)');
      const routed = auditTop10GoldTemplate(r.html);
      console.log('router: version=' + routed.version + ' compliant=' + routed.compliant);
      console.log('\nBEFORE (v1 markdown, first 3 lines):');
      body.split('\n').filter(Boolean).slice(0, 3).forEach(l => console.log('  | ' + l.slice(0, 88)));
      console.log('AFTER  (v2.2 HTML, first 3 lines):');
      r.html.split('\n').filter(Boolean).slice(0, 3).forEach(l => console.log('  | ' + l.slice(0, 88)));
    }
    console.log('\nNOTHING WRITTEN. Live entry ' + e.id + ' is untouched.\n');
    return;
  }
  console.log('No clean near-miss found in the sampled range.');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
