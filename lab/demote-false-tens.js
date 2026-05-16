// One-shot: demote false-positive 10/10 entries that walked the SaaS-themed
// polish ladder but whose topic is actually small-business / "How to start a X
// business in 2027?". The SaaS source/number/counter blocks are off-topic so
// the entry is functionally 5/10 even though the ladder mechanically completed.
//
// Strategy:
//   1. Read each target's blob.
//   2. Strip everything from the first ladder marker onward (sources, numbers,
//      counter-args, cross-links, plus stale notes appended after them).
//   3. Reset quality_score=5, polish_history=[], polished_at=null.
//   4. Update the index row to match.
//
// Usage: BLOBS_PAT=... node lab/demote-false-tens.js q9616 q9615

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const TARGETS = process.argv.slice(2);
if (!TARGETS.length) { console.error('usage: node lab/demote-false-tens.js <id1> <id2> ...'); process.exit(1); }

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

function stripLadder(answer) {
  if (!answer) return answer;
  let firstIdx = answer.length;
  for (const m of STRIP_MARKERS) {
    const i = answer.indexOf(m);
    if (i >= 0 && i < firstIdx) firstIdx = i;
  }
  if (firstIdx === answer.length) return answer;
  let cut = answer.slice(0, firstIdx).replace(/\s*---\s*$/, '').trimEnd();
  return cut;
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) { console.error('no index'); process.exit(1); }

  for (const id of TARGETS) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!e) { console.log('  MISSING ' + id); continue; }
    const before = (e.answer || '').length;
    e.answer = stripLadder(e.answer || '');
    e.quality_score = 5;
    e.polish_history = [];
    e.polished_at = null;
    e.last_modified_ms = Date.now();
    await store.setJSON('answers/' + id + '.json', e);

    const row = idx.entries.find(x => x.id === id);
    if (row) {
      row.quality_score = 5;
      row.polished_at = null;
      row.last_modified_ms = Date.now();
    }
    console.log('  ' + id + ' demoted · answer ' + before + ' -> ' + e.answer.length + ' chars');
  }

  await store.setJSON('_index.json', idx);
  console.log('\nDONE — index updated. Cycle will re-polish these on next fire (once templates are topic-correct).');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
