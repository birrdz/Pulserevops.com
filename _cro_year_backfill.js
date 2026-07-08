// _cro_year_backfill.js — append " in 2027" to EVERY fractional-CRO tl title that
// lacks a year (find/hire/look-for pages; "cost ... in 2027" already have it).
// Updates the index question + the blob (question, image alt, # H1, any in-body
// echo). Deploy-free. Idempotent. Also rewrites the queue files for unpublished ids.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const DRY = process.argv.includes('--dry');

// Append/insert " in 2027" on ANY title mentioning CRO / Chief Revenue Officer.
const isCro = (q) => /(\bCRO\b|chief revenue officer)/i.test(q || '');
const yearize = (q) => {
  if (/20\d\d/.test(q)) return q;                              // already has a year
  return /\?\s*$/.test(q)
    ? q.replace(/\?\s*$/, ' in 2027?')                         // "...state?" -> "...state in 2027?"
    : q.replace(/[\s.]*$/, ' in 2027');                        // "...sources" -> "...sources in 2027"
};

(async () => {
  // 1) Queue files (future writes) ----------------------------------------
  for (const f of ['_cro_market_queue.json', '_cro_ds_queue.json', '_cro_cc_queue.json', '_cro_more_queue.json']) {
    try {
      const arr = JSON.parse(fs.readFileSync(f, 'utf8'));
      let n = 0;
      arr.forEach(it => { if (it.title && isCro(it.title)) { const t = yearize(it.title); if (t !== it.title) { it.title = t; n++; } } });
      if (!DRY) fs.writeFileSync(f, JSON.stringify(arr));
      console.log(`${f}: yearized ${n} titles`);
    } catch (e) { console.log(`${f}: skip (${e.message})`); }
  }

  // 2) Published blobs + index --------------------------------------------
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tl = idx.entries.filter(e => /^tl\d+$/.test(e.id) && isCro(e.question) && !/20\d\d/.test(e.question || ''));
  console.log(`CRO tl entries needing year: ${tl.length}`);
  let fixed = 0;
  for (const e of tl) {
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
    fixed++;
    if (!DRY && fixed % 40 === 0) console.log(`  …fixed ${fixed}`);
  }
  if (!DRY && fixed) await store.setJSON('_index.json', idx);
  console.log(`${DRY ? 'DRY ' : ''}DONE. titles yearized: ${fixed} | index ${DRY ? 'NOT ' : ''}written`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
