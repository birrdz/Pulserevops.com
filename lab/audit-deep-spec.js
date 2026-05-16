// Audit all entries in _claude_opus_progress.json (the "rewritten by me" list)
// against the 10K-word + 2-mermaid-diagram spec.
//
// Output: tabular summary of which entries are compliant vs need rewrite,
// plus shortlist of next ~20 to fix sorted by lowest word count.

const { getStore } = require('@netlify/blobs');

function countWords(raw) {
  const cleaned = String(raw || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_`~|\-=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned ? cleaned.split(' ').filter(Boolean).length : 0;
}

function countMermaids(raw) {
  const matches = String(raw || '').match(/```mermaid/g);
  return matches ? matches.length : 0;
}

(async () => {
  const TOKEN = process.env.BLOBS_PAT;
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const tracker = await store.get('_claude_opus_progress.json', { type: 'json' });
  if (!tracker || !Array.isArray(tracker.rewritten)) {
    console.error('tracker missing or empty');
    process.exit(1);
  }

  const ids = tracker.rewritten;
  console.log('Total tracker entries: ' + ids.length);
  console.log('');

  const rows = [];
  let i = 0;
  for (const id of ids) {
    i++;
    if (i % 50 === 0) console.error('  audited ' + i + ' / ' + ids.length);
    try {
      const entry = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!entry) { rows.push({ id, words: 0, mermaids: 0, score: null, missing: true }); continue; }
      const words = countWords(entry.answer);
      const mermaids = countMermaids(entry.answer);
      rows.push({ id, words, mermaids, score: entry.quality_score, question: (entry.question || '').slice(0, 60) });
    } catch (err) {
      rows.push({ id, words: 0, mermaids: 0, score: null, error: err.message });
    }
  }

  const compliant = rows.filter(r => r.words >= 10000 && r.mermaids >= 2);
  const needsWords = rows.filter(r => r.words < 10000);
  const needsMermaids = rows.filter(r => r.mermaids < 2);
  const needsBoth = rows.filter(r => r.words < 10000 && r.mermaids < 2);

  console.log('=== AUDIT SUMMARY ===');
  console.log('Total rewritten entries:        ' + rows.length);
  console.log('Compliant (>=10K words + 2 merms): ' + compliant.length);
  console.log('Below 10K words:                ' + needsWords.length);
  console.log('Below 2 mermaids:               ' + needsMermaids.length);
  console.log('Below BOTH thresholds:          ' + needsBoth.length);
  console.log('');

  console.log('=== WORD COUNT DISTRIBUTION ===');
  const buckets = { '0-2K': 0, '2-4K': 0, '4-6K': 0, '6-8K': 0, '8-10K': 0, '10K+': 0 };
  for (const r of rows) {
    if (r.words < 2000) buckets['0-2K']++;
    else if (r.words < 4000) buckets['2-4K']++;
    else if (r.words < 6000) buckets['4-6K']++;
    else if (r.words < 8000) buckets['6-8K']++;
    else if (r.words < 10000) buckets['8-10K']++;
    else buckets['10K+']++;
  }
  for (const [k, v] of Object.entries(buckets)) console.log('  ' + k.padEnd(8) + ': ' + v);
  console.log('');

  console.log('=== MERMAID DIAGRAM DISTRIBUTION ===');
  const merms = { '0': 0, '1': 0, '2': 0, '3+': 0 };
  for (const r of rows) {
    if (r.mermaids === 0) merms['0']++;
    else if (r.mermaids === 1) merms['1']++;
    else if (r.mermaids === 2) merms['2']++;
    else merms['3+']++;
  }
  for (const [k, v] of Object.entries(merms)) console.log('  ' + k.padEnd(4) + ': ' + v);
  console.log('');

  console.log('=== LATEST 21 ENTRIES (my deep-dive batch this session) ===');
  const lastBatch = ids.slice(-21);
  for (const id of lastBatch) {
    const r = rows.find(x => x.id === id);
    if (!r) continue;
    const flag = (r.words >= 10000 && r.mermaids >= 2) ? '✓' : '✗';
    console.log('  ' + flag + ' ' + id.padEnd(6) + ' words=' + String(r.words).padStart(5) + ' mermaids=' + r.mermaids + ' score=' + r.score);
  }
  console.log('');

  console.log('=== LOWEST WORD COUNT ENTRIES (top 30 needing rewrite first) ===');
  const sorted = rows.filter(r => !r.missing && r.words > 0).sort((a, b) => a.words - b.words).slice(0, 30);
  for (const r of sorted) {
    console.log('  ' + r.id.padEnd(6) + ' words=' + String(r.words).padStart(5) + ' mermaids=' + r.mermaids + '  ' + (r.question || ''));
  }
})();
