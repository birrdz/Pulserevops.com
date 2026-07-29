// DRY RUN against the LIVE blob library. Reads only — writes nothing, publishes nothing.
//   node _top10_v2_dryrun_blobs.js [pillarPrefix] [sampleSize]
'use strict';
require('./_loadenv');
const { getStore } = require('@netlify/blobs');
const { emitTop10V2 } = require('./_top10_v2_emit');
const { gateScore } = require('./new/content_gate');
const { appliesTop10Gold } = require('./_ranking_top10_gold_template');

const prefix = (process.argv[2] || '').toLowerCase();
const SAMPLE = parseInt(process.argv[3] || '400', 10);

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
  const all = Array.isArray(idx) ? idx : (idx && idx.entries) || [];
  console.log(`Index: ${all.length} entries`);

  // Title-level pre-filter so we only pull bodies for likely Top-10 pages.
  const candidates = all.filter(e => {
    const id = String(e.id || '');
    if (prefix && !id.toLowerCase().startsWith(prefix)) return false;
    return /\b(top\s*10|top\s*ten|best\b)/i.test(String(e.title || e.question || ''));
  });
  console.log(`Ranked-intent titles${prefix ? ` in "${prefix}"` : ''}: ${candidates.length}`);

  const pick = candidates.slice(0, SAMPLE);
  console.log(`Pulling ${pick.length} bodies...\n`);

  let topList = 0, wouldConvert = 0, pulled = 0, nearMiss = 0, closeMiss = 0;
  const blockers = new Map();
  const examples = [];

  for (const e of pick) {
    let blob;
    try { blob = await s.get('answers/' + e.id + '.json', { type: 'json', consistency: 'strong' }); }
    catch (err) { continue; }
    if (!blob) continue;
    pulled++;
    const body = String(blob.body || blob.answer || '');
    const title = String(blob.title || e.title || '');
    if (!appliesTop10Gold(body, title)) continue;
    topList++;

    const r = emitTop10V2(Object.assign({ id: e.id }, blob), { gateScore });
    if (r.ok) { wouldConvert++; if (examples.length < 5) examples.push(r.report); continue; }
    // How close is it? Bucket by what remains once the two SYSTEMATIC v1→v2.2 gaps
    // (no hero, only 1 mermaid) are set aside — those have owners already.
    const rest = r.missing.filter(m => !/^hero_image$|^mermaid_2$/.test(m));
    if (rest.length === 0) nearMiss++;
    else if (rest.length <= 2) closeMiss++;
    for (const m of r.missing) {
      const key = String(m).replace(/_have_\d+/, '_have_N').replace(/_\d+_/g, '_N_').replace(/_\d+$/, '_N');
      blockers.set(key, (blockers.get(key) || 0) + 1);
    }
  }

  console.log(`Bodies pulled:            ${pulled}`);
  console.log(`  TOP_LIST (in scope):    ${topList}`);
  console.log(`  Would convert NOW:      ${wouldConvert}`);
console.log(`  Need ONLY hero+mermaid: ${nearMiss}   <- drip fills hero, DeepSeek fills mermaid`);
console.log(`  Need those + 1-2 more:  ${closeMiss}`);
  console.log(`\nBlockers (slot v1 doesn't carry), most common first:`);
  [...blockers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
    .forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}×  ${k}   (${Math.round(v / Math.max(1, topList) * 100)}% of in-scope)`));
  if (examples.length) {
    console.log(`\nSample clean conversions:`);
    examples.forEach(x => console.log(`  ${x.id} — ${x.words}w, ${x.images} imgs, ${x.mermaids} mermaid, gate ${x.gate}`));
  }
  console.log('\nRead-only. No blobs written. No entry modified.\n');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
