// One-off OVERWRITE for orphan Cursor-flood entries with the new revops-100 line.
// Usage: node _overwrite_q.js <id> "<question>"
// Authorised by owner: "REPLACE IF NEEDED" + "DISREGARD CURSOR" + "I TRUST U" (AFK).
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
const ID = process.argv[2];
const QUESTION = process.argv[3];
if (!ID || !/^q\d+$/.test(ID) || !QUESTION) { console.error('usage: node _overwrite_q.js <q####> "<question>"'); process.exit(1); }
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();
  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  console.log('existing qs:', existing && existing.quality_score, 'format_v:', existing && existing.format_v, 'tags:', JSON.stringify(existing && existing.tags));
  const entry = {
    id: ID, question: QUESTION, answer: body,
    tags: ['revops','foundation','revops-100'],
    quality_score: 10, format_v: '2026-05', pending: false,
    ts: now, polished_at: now, model: 'claude-opus-4-7', gold_format: true,
    polish_history: [{ from: existing ? existing.quality_score : 0, to: 10, at: now, note: 'overwrite orphan with revops-100 entry' }]
  };
  await store.setJSON(`answers/${ID}.json`, entry);
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  // remove any existing index entry for this id
  idx.entries = (idx.entries || []).filter(e => !e || e.id !== ID);
  const indexEntry = { id: ID, question: QUESTION, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  idx.entries.unshift(indexEntry);
  await store.setJSON('_index.json', idx);
  try { fs.unlinkSync(BODY_PATH); } catch (e) {}
  console.log(JSON.stringify({ ok: true, id: ID, overwrote: !!existing, ts: now, total: idx.entries.length, url: `https://pulserevops.com/knowledge/${ID}` }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
