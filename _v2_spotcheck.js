// _v2_spotcheck.js — INDEPENDENT spot-check of recently publish-ready entries.
// Usage: node _v2_spotcheck.js [N]           # N newest from _v2_cc_approved.json (default 12)
//        node _v2_spotcheck.js --approved [N] # stage-1 approved instead
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { spotCheckEntry, MIN_SCORE } = require('./_v2_publish_verify');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const args = process.argv.slice(2);
const useApproved = args[0] === '--approved';
const N = parseInt(useApproved ? (args[1] || '12') : (args[0] || '12'), 10);
const ledger = useApproved ? '_v2_approved.json' : '_v2_cc_approved.json';

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const valid = new Set((idx.entries || []).filter(e => e && e.id).map(e => e.id));
  const ids = JSON.parse(fs.readFileSync(WD + '/' + ledger, 'utf8'));
  const sample = ids.slice(-N);
  console.log(`\nSPOT-CHECK ${sample.length} newest from ${ledger} (min ${MIN_SCORE}/13 + all stations)\n`);
  let pass = 0, fail = 0;
  for (const id of sample) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    const v = spotCheckEntry(id, e && e.answer, valid);
    if (v.pass) { console.log(`${id}  ✅ ${v.score}/13 words=${v.words}`); pass++; }
    else { console.log(`${id}  ❌ score=${v.score} words=${v.words} MISSING: ${v.gaps.join(', ')}`); fail++; }
  }
  console.log(`\nRESULT: ${pass} pass · ${fail} fail (of ${sample.length})\n`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
