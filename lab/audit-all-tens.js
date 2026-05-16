// One-shot audit — walk every entry in the library, verify each 10/10 is
// legitimate, and demote fakes back to 5/10. Fakes are entries that:
//   (a) lack one of the 4 content markers (Sources / Numbers / Bear Case / See Also)
//   (b) have polish_history missing one of the 5 expected bumps (to 6,7,8,9,10)
//   (c) have answer < 2500 chars (typical polished entry is 3500-4500)
//
// Each demote: strip ladder content, reset score+history+polished_at, update
// the index row. Blob-only — no deploy required. Runs in ~5-10 min on 1600
// entries.
//
// Usage: BLOBS_PAT=... node lab/audit-all-tens.js [--dry-run]

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }
const DRY = process.argv.includes('--dry-run');

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

const STRIP_MARKERS = [
  '## Primary Sources & Benchmarks',
  '## Sources & Citations',
  '## Anchor Citations',
  '## Source Stack',
  '## Primary References',
  '## Verified Industry Benchmarks',
  '## Real Numbers, Not Round Numbers',
  '## Operator Benchmarks (2025 Data)',
  '## Verified Financial Benchmarks (2024-2025)',
  '## Cited Benchmarks (Replace Generic %s)',
  '## The Bear Case',
  '## See Also (related library entries)'
];

const SOURCE_RE = /## Primary Sources|## Sources & Citations|## Anchor Citations|## Source Stack|## Primary References/;
const NUMBER_RE = /## Verified.*Benchmarks|## Real Numbers|## Operator Benchmarks|## Cited Benchmarks/;
const COUNTER_RE = /## The Bear Case/;
const LINKS_RE = /## See Also/;

function stripLadder(answer) {
  if (!answer) return answer;
  let firstIdx = answer.length;
  for (const m of STRIP_MARKERS) {
    const i = answer.indexOf(m);
    if (i >= 0 && i < firstIdx) firstIdx = i;
  }
  if (firstIdx === answer.length) return answer;
  return answer.slice(0, firstIdx).replace(/\s*---\s*$/, '').trimEnd();
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) { console.error('no index'); process.exit(1); }

  const tens = idx.entries.filter(r => /^q\d+$/.test(r.id) && r.quality_score === 10);
  console.log('Library: ' + idx.entries.length + ' total · ' + tens.length + ' at 10/10');
  console.log('Auditing all 10/10s' + (DRY ? ' (DRY RUN — no writes)' : '') + '...\n');

  let checked = 0, demoted = 0, kept = 0;
  const demotedIds = [];
  const reasons = {};
  const t0 = Date.now();

  // Write initial progress blob so the UI bar can render 0% immediately.
  async function writeProgress(done) {
    try {
      await store.setJSON('_audit_progress.json', {
        total_tens: tens.length,
        audited: checked,
        demoted,
        kept,
        in_progress: !done,
        last_run_ms: Date.now(),
      });
    } catch (_e) {}
  }
  await writeProgress(false);

  for (const row of tens) {
    checked++;
    if (checked % 50 === 0) {
      console.log('  ...progress ' + checked + '/' + tens.length + ' · demoted ' + demoted + ' · ' + ((Date.now()-t0)/1000).toFixed(0) + 's elapsed');
      await writeProgress(false);
    }

    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e) { reasons['missing-blob'] = (reasons['missing-blob']||0)+1; continue; }
    const a = e.answer || '';
    const hasS = SOURCE_RE.test(a);
    const hasN = NUMBER_RE.test(a);
    const hasC = COUNTER_RE.test(a);
    const hasL = LINKS_RE.test(a);
    const h = Array.isArray(e.polish_history) ? e.polish_history : [];
    const hasAllBumps = [6,7,8,9,10].every(s => h.some(x => x && x.to === s));
    const longEnough = a.length >= 2500;

    const ok = hasS && hasN && hasC && hasL && hasAllBumps && longEnough;
    if (ok) { kept++; continue; }

    // Determine why it failed
    const why = [];
    if (!hasS) why.push('no-sources');
    if (!hasN) why.push('no-numbers');
    if (!hasC) why.push('no-counter');
    if (!hasL) why.push('no-see-also');
    if (!hasAllBumps) why.push('history-' + h.length + 'of5');
    if (!longEnough) why.push('short-' + a.length);
    const reasonKey = why.join('+');
    reasons[reasonKey] = (reasons[reasonKey]||0)+1;

    if (DRY) {
      demoted++;
      demotedIds.push(row.id);
      continue;
    }

    // Demote: strip ladder content, reset to 5
    e.answer = stripLadder(a);
    e.quality_score = 5;
    e.polish_history = [];
    e.polished_at = null;
    e.last_modified_ms = Date.now();
    await store.setJSON('answers/' + row.id + '.json', e);

    row.quality_score = 5;
    row.polished_at = null;
    row.last_modified_ms = Date.now();
    demoted++;
    demotedIds.push(row.id);
  }

  if (!DRY && demoted > 0) {
    await store.setJSON('_index.json', idx);
    console.log('\nIndex updated with ' + demoted + ' demotions.');
  }

  // Final progress write — bar reaches 100% (or whatever fraction we got through).
  await writeProgress(true);

  console.log('\n=== AUDIT COMPLETE ' + (DRY ? '(dry run) ' : '') + '===');
  console.log('Checked: ' + checked + ' 10/10 entries');
  console.log('Kept (legit 10/10): ' + kept);
  console.log('Demoted (fake → 5): ' + demoted);
  console.log('Elapsed: ' + ((Date.now()-t0)/1000).toFixed(0) + 's');
  console.log('\nReason breakdown:');
  Object.entries(reasons).sort((a,b) => b[1]-a[1]).slice(0, 20).forEach(([k,v]) => {
    console.log('  ' + v.toString().padStart(4) + '  ' + k);
  });
  if (demoted > 0 && demoted <= 30) {
    console.log('\nDemoted IDs: ' + demotedIds.join(', '));
  } else if (demoted > 30) {
    console.log('\nFirst 30 demoted IDs: ' + demotedIds.slice(0,30).join(', '));
  }
})().catch(e => { console.error('FATAL', e); process.exit(1); });
