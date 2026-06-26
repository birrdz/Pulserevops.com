// Repair _index.json after concurrent _write_nil.js races dropped NIL entries.
// Checks every id in _nil_sprint200.json: if its answer blob exists but it is
// missing from _index.json, re-add the index record from the blob. Idempotent.
//   node _nil_index_reconcile.js
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try { const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8'); for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); } } catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const queue = require(process.argv[2] || 'C:/Users/koryj/_nil_sprint200.json');
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const inIndex = new Set(idx.entries.filter(e => e && e.id).map(e => e.id));

  let added = 0, noBlob = 0;
  for (const item of queue) {
    if (inIndex.has(item.id)) continue;
    const rec = await store.get('answers/' + item.id + '.json', { type: 'json' }).catch(() => null);
    if (!rec) { noBlob++; continue; }
    idx.entries.unshift({
      id: item.id,
      question: rec.question || item.question,
      tags: rec.tags || ['nil', 'nil-2027', item.sport === 'wbb' ? 'nil-wbb' : 'nil-mbb', 'd1', 'college-athletics'],
      quality_score: typeof rec.quality_score === 'number' ? rec.quality_score : 10,
      format_v: rec.format_v || '2026-05',
      pending: false,
      ts: rec.ts || Date.now(),
      polished_at: rec.polished_at || rec.ts || Date.now(),
      model: rec.model || 'claude-opus-4-7',
      was_indexed_at: null,
    });
    added++;
  }
  if (added) await store.setJSON('_index.json', idx);
  const have = queue.filter(it => inIndex.has(it.id) || true); // recompute below
  // final tally
  const finalSet = new Set(idx.entries.filter(e => e && e.id).map(e => e.id));
  const published = queue.filter(it => finalSet.has(it.id)).length;
  const missing = queue.filter(it => !finalSet.has(it.id));
  console.log('reconcile: added', added, 'to index | still no answer blob:', noBlob);
  console.log('NIL SPRINT:', published, '/', queue.length, 'in index');
  if (missing.length) console.log('missing (need rewrite):', missing.map(m => m.id + ':' + m.team + ':' + m.sport).join(', '));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
