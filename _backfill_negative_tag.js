// Backfill 'negative-leaning' tag onto all entries that have 'chief-alternative'
// tag (the Chief Q&A line). Library list pushes negative-leaning entries to the
// middle band on page 1.
const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const chiefEntries = (idx.entries || []).filter(e => Array.isArray(e.tags) && e.tags.includes('chief-alternative'));
  console.log('Found chief-alternative entries:', chiefEntries.length);

  let patched = 0;
  for (const row of chiefEntries) {
    if (row.tags.includes('negative-leaning')) continue;
    // Update _index.json row
    row.tags = [...row.tags, 'negative-leaning'];
    // Update the actual answer blob
    try {
      const blob = await s.get('answers/' + row.id + '.json', { type: 'json' });
      if (blob && Array.isArray(blob.tags) && !blob.tags.includes('negative-leaning')) {
        blob.tags = [...blob.tags, 'negative-leaning'];
        await s.setJSON('answers/' + row.id + '.json', blob);
      }
    } catch (_) {}
    patched++;
  }
  await s.setJSON('_index.json', idx);
  console.log('Patched:', patched, 'entries with negative-leaning tag.');
})();
