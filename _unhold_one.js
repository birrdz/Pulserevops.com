// _unhold_one.js — clear the noindex/held flag on an entry whose body is ALREADY
// complete (qs=10, gold_format). NO text regeneration, NO DeepSeek spend.
// Held entries have a full answer already; they were merely flagged noindex.
// This: (1) deletes entry.noindex on the blob, (2) ensures a minimal index row
// exists (matching the shape _ds_publish.js writes), (3) pings IndexNow.
//   node _unhold_one.js <id>
const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const { getStore } = require('@netlify/blobs');
const { finalizeIndexNow } = require('./_write_lib');

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

async function unholdOne(id, store) {
  store = store || getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const entry = await store.get(`answers/${id}.json`, { type: 'json' });
  if (!entry) return { ok: false, id, reason: 'no_blob' };
  if (!entry.answer || entry.answer.length < 500) return { ok: false, id, reason: 'thin_body', len: (entry.answer || '').length };
  if ((entry.quality_score || 0) < 10) return { ok: false, id, reason: 'low_score', qs: entry.quality_score };

  const wasHeld = entry.noindex === true;
  if (wasHeld) delete entry.noindex;
  await store.setJSON(`answers/${id}.json`, entry);

  // Ensure index row (minimal shape, same fields _ds_publish.js writes).
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const now = Date.now();
  const indexEntry = {
    id, question: entry.question, tags: entry.tags || [],
    quality_score: entry.quality_score || 10, format_v: entry.format_v || '2026-05',
    pending: false, ts: entry.ts || now, polished_at: entry.polished_at || now,
    model: entry.model || 'deepseek-chat', was_indexed_at: null,
    seo_optimized_at: entry.seo_optimized_at || now,
    images_pending: !!entry.images_pending,
  };
  const ix = idx.entries.findIndex((e) => e && e.id === id);
  const inIndex = ix >= 0;
  if (ix >= 0) idx.entries.splice(ix, 1);
  idx.entries.unshift(indexEntry);
  await store.setJSON('_index.json', idx);

  let indexed = null;
  try { indexed = await finalizeIndexNow(id, store, indexEntry); } catch (e) {}
  return { ok: true, id, wasHeld, wasInIndex: inIndex, indexnow: indexed };
}

module.exports = { unholdOne };

if (require.main === module) {
  const id = process.argv[2];
  if (!id) { console.error('usage: node _unhold_one.js <id>'); process.exit(1); }
  unholdOne(id).then((r) => { console.log(JSON.stringify(r)); process.exit(r.ok ? 0 : 2); })
    .catch((e) => { console.error('ERR', e && e.message); process.exit(1); });
}
