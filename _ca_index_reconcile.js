// Repair _index.json after concurrent _write_ca.js races dropped entries.
// Lists every answers/ca####.json blob and ensures each has an _index.json
// record. Answer blobs are uniquely keyed (race-safe); only the shared index
// loses updates under concurrency. Idempotent. Single final write.
//   node _ca_index_reconcile.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  // List every ca answer blob.
  const ids = [];
  let cursor;
  do {
    const res = await store.list({ prefix: 'answers/ca', cursor });
    for (const b of res.blobs) { const m = b.key.match(/^answers\/(ca\d+)\.json$/); if (m) ids.push(m[1]); }
    cursor = res.cursor;
  } while (cursor);
  console.log('ca answer blobs found:', ids.length);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const inIndex = new Set(idx.entries.filter(e => e && e.id).map(e => e.id));
  const missing = ids.filter(id => !inIndex.has(id));
  console.log('in index:', inIndex.size, '| ca missing from index:', missing.length);
  if (!missing.length) { console.log('NOTHING TO REPAIR.'); return; }

  let added = 0;
  for (const id of missing) {
    const rec = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!rec) { console.log('  skip (no blob read):', id); continue; }
    idx.entries.unshift({
      id,
      question: rec.question || id,
      tags: rec.tags || ['car-review', 'top-10', 'vehicle'],
      quality_score: typeof rec.quality_score === 'number' ? rec.quality_score : 10,
      format_v: rec.format_v || '2026-05',
      pending: false,
      ts: rec.ts || Date.now(),
      polished_at: rec.polished_at || rec.ts || Date.now(),
      model: rec.model || 'claude-opus-4-8',
      was_indexed_at: null,
    });
    added++;
  }
  await store.setJSON('_index.json', idx);
  console.log('REPAIRED. added', added, 'entries to index. new index size:', idx.entries.length);
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
