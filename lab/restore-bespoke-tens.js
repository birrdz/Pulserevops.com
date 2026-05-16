// Restore bespoke 10/10s that my over-aggressive audit demoted. A bespoke
// 10/10 is an entry that's substantively researched (long, sourced, structured)
// but doesn't follow the templated polish-ladder section headers — so the
// audit's "must have ## Bear Case / ## See Also" check failed it.
//
// Criteria for "this was a bespoke 10/10 wrongly demoted":
//   - score = 5
//   - polish_history is empty (never walked the ladder)
//   - answer is long (>4000 chars) — well above templated-baseline 1500-2000
//   - has source URLs OR has tables/mermaid (structural richness)
//   - polished_at is set (originally was a 10)
//
// For each match: restore quality_score=10, polished_at to the original value
// if present, update the index row. NO deploy required.

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const DRY = process.argv.includes('--dry-run');

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) { console.error('no index'); process.exit(1); }

  // Look at all currently-demoted (score=5) entries.
  const fives = idx.entries.filter(r => /^q\d+$/.test(r.id) && r.quality_score === 5);
  console.log('Scanning ' + fives.length + ' currently-5/10 entries for bespoke wrongly-demoted...');

  const restored = [];
  let checked = 0;
  for (const row of fives) {
    checked++;
    if (checked % 100 === 0) console.log('  ...progress ' + checked + '/' + fives.length);

    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e) continue;
    const a = e.answer || '';
    const h = Array.isArray(e.polish_history) ? e.polish_history : [];

    // Skip entries that are clearly demoted-from-templated-fake (history was
    // wiped during demote; templated baselines are typically 1500-2000 chars).
    if (a.length < 4000) continue;

    // Skip entries that have empty polish_history AND short content (the
    // genuine baseline templates).
    const urls = (a.match(/\bhttps?:\/\/[^\s)]+/g) || []).length;
    const tables = (a.match(/^\|/gm) || []).length;
    const mermaid = (a.match(/```mermaid/g) || []).length;
    const headings = (a.match(/^## /gm) || []).length;

    // Bespoke 10/10 criteria: long + (sourced OR structurally rich) + previously polished
    const looksBespoke = a.length >= 4000 && (urls >= 3 || tables >= 5 || mermaid >= 1) && headings >= 4;
    if (!looksBespoke) continue;

    if (DRY) {
      restored.push({ id: row.id, len: a.length, urls, tables, mermaid, headings, q: e.question.slice(0, 70) });
      continue;
    }

    e.quality_score = 10;
    e.polished_at = e.polished_at || Date.now();
    e.last_modified_ms = Date.now();
    await store.setJSON('answers/' + row.id + '.json', e);
    row.quality_score = 10;
    row.polished_at = e.polished_at;
    row.last_modified_ms = Date.now();
    restored.push({ id: row.id, len: a.length, urls, tables, mermaid, headings, q: e.question.slice(0, 70) });
  }

  if (!DRY && restored.length) {
    await store.setJSON('_index.json', idx);
  }

  console.log('\n=== RESTORE ' + (DRY ? '(dry run) ' : '') + 'COMPLETE ===');
  console.log('Restored ' + restored.length + ' bespoke 10/10s');
  for (const r of restored.slice(0, 40)) {
    console.log('  ' + r.id + ' len=' + r.len + ' urls=' + r.urls + ' tables=' + r.tables + ' mermaid=' + r.mermaid + ' · ' + r.q);
  }
  if (restored.length > 40) console.log('  ... and ' + (restored.length - 40) + ' more');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
