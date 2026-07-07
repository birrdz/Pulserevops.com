// _mv_strip_filler.js — maintenance repair: remove the appended generic stub Pros/Cons/Verdict block from
// already-baked mv blobs (the C15b duplicate-filler defect). Structural + idempotent. Re-saves only entries
// that actually change. READ the blob, strip, WRITE back preserving every other field.
//   node _mv_strip_filler.js            → all mv entries
//   node _mv_strip_filler.js mv0001 ... → only those ids
//   node _mv_strip_filler.js --dry      → report what WOULD change, write nothing
'use strict';
const fs = require('fs');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { stripDuplicateFillerBlock, auditDuplicateFiller } = require('./_mv_image_title_match');
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

(async () => {
  const dry = process.argv.includes('--dry');
  const want = process.argv.slice(2).filter((a) => /^mv\d+$/i.test(a));
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let rows = (idx.entries || []).filter((e) => e && /^mv\d+$/i.test(e.id));
  if (want.length) rows = rows.filter((e) => want.includes(e.id));
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  let changed = 0, clean = 0;
  for (const row of rows) {
    let a; try { a = await store.get('answers/' + row.id + '.json', { type: 'json' }); } catch (e) { console.log('✗ ' + row.id + ' load error'); continue; }
    if (!a) { console.log('✗ ' + row.id + ' missing'); continue; }
    const before = a.answer || a.body || '';
    const after = stripDuplicateFillerBlock(before);
    if (after === before) { clean++; continue; }
    const beforeFails = auditDuplicateFiller(before).length;
    const afterFails = auditDuplicateFiller(after).length;
    console.log((dry ? '· WOULD strip ' : '✓ stripped ') + row.id + '  C15b ' + beforeFails + '→' + afterFails + '  (−' + (before.length - after.length) + ' chars)');
    if (!dry) {
      const key = a.answer != null ? 'answer' : 'body';
      a[key] = after;
      a.polished_at = Date.now();
      await store.setJSON('answers/' + row.id + '.json', a);
    }
    changed++;
  }
  console.log('\n=== strip-filler ' + (dry ? '(dry) ' : '') + '· changed ' + changed + ' · already-clean ' + clean + ' · total ' + rows.length + ' ===');
})().catch((e) => { console.error('FATAL', e && e.message); process.exitCode = 1; });
