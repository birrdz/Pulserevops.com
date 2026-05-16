// One-shot cleanup: remove all entries with non-standard IDs (i.e. anything
// that doesn't match ^q\d+$). These are visitor-submitted artifacts from an
// older queue format that don't fit the canonical schema. Removes them from
// both the index and the per-entry blobs so the library is uniformly q\d+.

const { getStore } = require('@netlify/blobs');
const TOKEN = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) { console.error('no index'); process.exit(1); }

  const before = idx.entries.length;
  const nonStandard = idx.entries.filter(e => !/^q\d+$/.test(String(e.id)));
  console.log('Non-standard entries to remove:', nonStandard.length);
  if (!nonStandard.length) { console.log('Nothing to do.'); return; }

  // List sample for visibility.
  console.log('\nSample of what is being removed:');
  for (const row of nonStandard.slice(0, 8)) {
    console.log('  ' + row.id + ' — ' + (row.question || '').slice(0, 80));
  }
  if (nonStandard.length > 8) console.log('  ... and ' + (nonStandard.length - 8) + ' more');

  // Delete each blob (best-effort) then prune the index.
  let blobsDeleted = 0, blobsMissing = 0;
  for (const row of nonStandard) {
    try {
      const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
      if (blob) {
        await store.delete('answers/' + row.id + '.json');
        blobsDeleted++;
      } else {
        blobsMissing++;
      }
    } catch (e) {
      console.error('  failed to delete blob ' + row.id + ': ' + e.message);
    }
  }

  // Prune index.
  idx.entries = idx.entries.filter(e => /^q\d+$/.test(String(e.id)));
  await store.setJSON('_index.json', idx);

  const after = idx.entries.length;
  console.log('\n=== CLEANUP DONE ===');
  console.log('Index entries: ' + before + ' → ' + after + ' (removed ' + (before - after) + ')');
  console.log('Answer blobs deleted: ' + blobsDeleted);
  console.log('Answer blobs already missing: ' + blobsMissing);

  // Re-check indexed count on the standardized set.
  let total = 0, indexed = 0;
  for (const e of idx.entries) { total++; if (e.was_indexed_at) indexed++; }
  console.log('\nFinal: ' + indexed + ' / ' + total + ' indexed (' + (indexed/total*100).toFixed(1) + '%)');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
