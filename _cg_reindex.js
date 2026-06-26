// Reconcile _index.json against cg#### answer blobs (concurrent writers can
// clobber each other's _index.json read-modify-write). Re-adds any cg blob
// that is missing an index row. Usage: node _cg_reindex.js [maxId=200]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const MAX = parseInt(process.argv[2] || '200', 10);
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const have = new Set((idx.entries || []).filter(e => e && /^cg\d+$/.test(e.id)).map(e => e.id));
  const added = [];
  for (let i = 1; i <= MAX; i++) {
    const id = 'cg' + String(i).padStart(4, '0');
    if (have.has(id)) continue;
    const e = await s.get('answers/' + id + '.json', { type: 'json' });
    if (!e || !e.answer) continue;
    idx.entries.unshift({ id, question: e.question || id, tags: e.tags || [], quality_score: e.quality_score || 10, format_v: e.format_v || '2026-05', pending: false, ts: e.ts || Date.now(), polished_at: e.polished_at || e.ts || Date.now(), model: e.model || 'claude-opus-4-8', was_indexed_at: null });
    added.push(id);
  }
  if (added.length) { await s.setJSON('_index.json', idx); }
  console.log('REINDEX cg — added ' + added.length + (added.length ? ': ' + added.join(',') : ' (index already complete)') + ' | cg rows now ' + (idx.entries.filter(e => /^cg\d+$/.test(e.id)).length));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
