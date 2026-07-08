// _sy_year_backfill.js — append " in 2027" to EVERY style (sy) title that lacks a
// year. Style/fashion dates fast, so ALL sy titles carry the year (year-at-end law).
// Updates the index question + the blob (question, # H1, any in-body echo).
// Deploy-free. Idempotent. Adapted from _cro_year_backfill.js.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const DRY = process.argv.includes('--dry');

const yearize = (q) => {
  if (/20\d\d/.test(q)) return q;                              // already has a year
  return /\?\s*$/.test(q)
    ? q.replace(/\?\s*$/, ' in 2027?')                         // "...?" -> "... in 2027?"
    : q.replace(/[\s.]*$/, ' in 2027');                        // "...Meeting" -> "...Meeting in 2027"
};

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const sy = idx.entries.filter(e => /^sy\d+$/.test(e.id) && !/20\d\d/.test(e.question || ''));
  console.log(`sy entries needing year: ${sy.length}`);
  const changed = [];
  let fixed = 0;
  for (const e of sy) {
    const oldQ = e.question;
    const newQ = yearize(oldQ);
    if (newQ === oldQ) continue;
    const a = await store.get(`answers/${e.id}.json`, { type: 'json' });
    if (a) {
      a.question = newQ;
      if (a.answer) a.answer = a.answer.split(oldQ).join(newQ);
      a.year_backfill_at = Date.now();
      if (!DRY) await store.setJSON(`answers/${e.id}.json`, a);
    }
    e.question = newQ; // update index entry
    changed.push(e.id);
    fixed++;
    if (!DRY && fixed % 25 === 0) console.log(`  …fixed ${fixed}`);
  }
  if (!DRY && fixed) await store.setJSON('_index.json', idx);
  // write the changed-id list for IndexNow ping
  if (!DRY && changed.length) fs.writeFileSync('_sy_yearized_ids.json', JSON.stringify(changed));
  console.log(`${DRY ? 'DRY ' : ''}DONE. sy titles yearized: ${fixed} | index ${DRY ? 'NOT ' : ''}written`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
