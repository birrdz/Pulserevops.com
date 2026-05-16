// Sync polished_at flag from per-entry blobs into _index.json so the
// library renderer can show the 10/10 badge without fetching each entry.
//
// Reads the live index, walks each entry, fetches answers/<id>.json,
// adds polished_at if present, writes index back.
//
// Usage:
//   BLOBS_PAT=<token> node lab/sync-polished-index.js
const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOKEN = process.env.BLOBS_PAT;
if (!TOKEN) { console.error('BLOBS_PAT required'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOKEN });

async function fetchWithRetry(store, key, maxAttempts = 4) {
  let lastErr = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try { return await store.get(key, { type: 'json' }); }
    catch (e) {
      lastErr = e;
      // Backoff: 500ms, 1.5s, 4s — also helps with 401 transient auth drops
      const wait = 500 * Math.pow(3, attempt - 1);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr || new Error('fetchWithRetry failed');
}

(async () => {
  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) {
    console.error('No index found'); process.exit(1);
  }
  console.log('index entries:', idx.entries.length);

  // Checkpoint: only process entries that DON'T already have polished_at in
  // the live index. Saves 80%+ of API calls on re-runs after partial failures.
  const todo = idx.entries.filter(e => !e.polished_at);
  const alreadyPolished = idx.entries.length - todo.length;
  console.log('already-polished in index:', alreadyPolished, '| todo:', todo.length);

  let scanned = 0, polished = 0, skipped_no_blob = 0, errs = 0;
  const CONCURRENCY = 2;
  const queue = [...todo];
  const updates = new Map(); // id → patched entry

  async function worker() {
    while (queue.length) {
      const e = queue.shift();
      scanned++;
      try {
        const blob = await fetchWithRetry(store, 'answers/' + e.id + '.json');
        if (!blob) { skipped_no_blob++; continue; }
        const updated = { ...e };
        let mutated = false;
        if (blob.polished_at) { updated.polished_at = blob.polished_at; polished++; mutated = true; }
        if (Array.isArray(blob.sources)) { updated.sources_count = blob.sources.length; mutated = true; }
        if (mutated) updates.set(e.id, updated);
      } catch (err) { errs++; }
      if (scanned % 50 === 0) console.log('  scanned', scanned, '/ found polished', polished, '/ errs', errs);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  // Apply updates to the original index in-place
  const newIndex = idx.entries.map(e => updates.get(e.id) || e);

  // Preserve original sort (the index was already sorted descending by q-id)
  newIndex.sort((a, b) => {
    const na = parseInt(String(a.id).match(/\d+/)?.[0] || '0', 10);
    const nb = parseInt(String(b.id).match(/\d+/)?.[0] || '0', 10);
    if (nb !== na) return nb - na;
    return (b.ts || 0) - (a.ts || 0);
  });

  await store.setJSON('_index.json', { entries: newIndex });
  console.log('done:', { scanned, polished, skipped_no_blob, errs, written: newIndex.length });
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
