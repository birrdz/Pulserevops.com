// _tv_year_backfill.js — append " in 2027" to EVERY travel (tv) title that lacks a
// year. Travel rankings/resorts/towns date fast → year-at-end law. Updates the index
// question + the blob (question, # H1, cover image alt, any in-body echo).
// Deploy-free. Idempotent. Adapted from _sy_year_backfill.js.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const DRY = process.argv.includes('--dry');

// Normalize ANY trailing-year form to a clean "... in 2027" suffix:
//   "...Runners (2027)"  -> "...Runners in 2027"
//   "...States for 2027" -> "...States in 2027"
//   "...Greece (2026)"   -> "...Greece in 2027"  (also fixes stale years)
//   "...America"         -> "...America in 2027" (no year -> append)
//   "... in 2027"        -> unchanged (already clean)
const yearize = (q0) => {
  let q = q0.trim();
  const hadQ = /\?\s*$/.test(q);
  if (hadQ) q = q.replace(/\?\s*$/, '').trim();
  if (/\bin 2027$/.test(q)) return q0;                         // already clean
  q = q.replace(/[\s,;:–—-]*\(?(?:for\s+|in\s+)?(?:19|20)\d\d\)?\s*$/i, '').trim(); // strip any trailing year form
  q = q + ' in 2027';
  return hadQ ? q + '?' : q;
};

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tv = idx.entries.filter(e => /^tv\d+$/.test(e.id) && !/\bin 2027\??\s*$/.test((e.question || '').trim()));
  console.log(`tv entries needing year: ${tv.length}`);
  const changed = [];
  let fixed = 0;
  for (const e of tv) {
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
    if (!DRY && fixed % 40 === 0) console.log(`  …fixed ${fixed}`);
  }
  if (!DRY && fixed) await store.setJSON('_index.json', idx);
  if (!DRY && changed.length) fs.writeFileSync('_tv_yearized_ids.json', JSON.stringify(changed));
  console.log(`${DRY ? 'DRY ' : ''}DONE. tv titles yearized: ${fixed} | index ${DRY ? 'NOT ' : ''}written`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
