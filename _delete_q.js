// Delete entries from the pulse-machine-library blob store.
// Usage: node _delete_q.js <id1> [<id2> ...]
const fs = require('fs');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

const IDS = process.argv.slice(2);
if (!IDS.length) {
  console.error('usage: node _delete_q.js <id1> [<id2> ...]');
  process.exit(1);
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const before = idx.entries.length;
  for (const id of IDS) {
    try { await store.delete(`answers/${id}.json`); } catch (_e) {}
    idx.entries = idx.entries.filter(e => e && e.id !== id);
    console.log('deleted', id);
  }
  await store.setJSON('_index.json', idx);
  console.log(JSON.stringify({ ok: true, removed: IDS, before, after: idx.entries.length }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
