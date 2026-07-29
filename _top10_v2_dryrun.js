// DRY RUN — reports what the v2.2 lane WOULD do. Writes nothing, publishes nothing.
//   node _top10_v2_dryrun.js            → all local entries
//   node _top10_v2_dryrun.js aq          → one pillar prefix
'use strict';
const fs = require('fs');
const path = require('path');
const { emitTop10V2 } = require('./_top10_v2_emit');
const { gateScore } = require('./new/content_gate');
const { appliesTop10Gold } = require('./_ranking_top10_gold_template');

const DIR = path.join(__dirname, 'new', 'entries');
const prefix = (process.argv[2] || '').toLowerCase();

const files = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.json'))
  .filter(f => !prefix || f.toLowerCase().startsWith(prefix));

let total = 0, topList = 0, converted = 0;
const blockers = new Map();
const examples = [];

for (const f of files) {
  let e;
  try { e = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (err) { continue; }
  total++;
  const body = String(e.body || e.answer || '');
  const title = String(e.title || '');
  if (!appliesTop10Gold(body, title)) continue;   // GENERAL → skipped per scope lock
  topList++;

  const r = emitTop10V2(e, { gateScore });
  if (r.ok) { converted++; if (examples.length < 3) examples.push(r.report); continue; }
  for (const m of r.missing) {
    const key = String(m).replace(/_have_\d+/, '_have_N').replace(/_\d+_/g, '_N_').replace(/_\d+$/, '_N');
    blockers.set(key, (blockers.get(key) || 0) + 1);
  }
}

console.log(`\nScanned ${total} local entries${prefix ? ` (prefix "${prefix}")` : ''}`);
console.log(`  TOP_LIST (in scope):        ${topList}`);
console.log(`  GENERAL (skipped, untouched): ${total - topList}`);
console.log(`  Would convert cleanly NOW:  ${converted}`);
console.log(`\nBlockers, most common first — each is a slot v1 simply doesn't carry:`);
[...blockers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
  .forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}×  ${k}`));
if (examples.length) {
  console.log(`\nSample clean conversions:`);
  examples.forEach(x => console.log(`  ${x.id} — ${x.words}w, ${x.images} imgs, ${x.mermaids} mermaid, gate ${x.gate}`));
}
console.log('\nNo blobs written. No entry modified.\n');
