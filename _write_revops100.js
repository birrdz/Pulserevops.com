// Reusable direct-write for the revops-100 line.
// Usage:  node _write_revops100.js <id> "<question>"
// Reads body from C:\Users\koryj\<id>_answer.md
// Writes answers/<id>.json (qs10+gold) and prepends to _index.json.
const fs = require('fs');
const { prepareEntryForPublish } = require('./_write_lib');
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
if (!ID || !/^q\d+$/.test(ID) || !QUESTION) {
  console.error('usage: node _write_revops100.js <q####> "<question>"');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const body = fs.readFileSync(BODY_PATH, 'utf8');

  // ── LAWS (enforced, not reminded) ──────────────────────────────────────
  // q11133 template: NO TL;DR · 1,200-word minimum · 2+ mermaid diagrams.
  const _wc = body.split(/\s+/).filter(Boolean).length;
  const _mer = (body.match(/```mermaid/g) || []).length;
  if (/#{2,3}\s*TL;?DR/i.test(body)) { console.error('ABORT (LAW): TL;DR is not allowed in the library.'); process.exit(3); }
  if (_wc < 1200) { console.error('ABORT (LAW): ' + _wc + ' words — minimum is 1200.'); process.exit(3); }
  if (_mer < 2) { console.error('ABORT (LAW): ' + _mer + ' mermaid diagram(s) — need at least 2.'); process.exit(3); }

  const now = Date.now();

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  if (existing) { console.error('ABORT: answers/' + ID + '.json already exists'); process.exit(2); }

  let entry = {
    id: ID,
    question: QUESTION,
    answer: body,
    tags: ['revops', 'foundation', 'revops-100'],
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'claude-opus-4-7',
    gold_format: true,
    polish_history: [{ from: 0, to: 10, at: now, note: 'direct-write 10/10 revops-100' }]
  };

  entry = prepareEntryForPublish(ID, QUESTION, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  if (idx.entries.some(e => e && e.id === ID)) { console.error('ABORT: _index.json already has ' + ID); process.exit(2); }
  const indexEntry = { id: ID, question: QUESTION, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  idx.entries.unshift(indexEntry);
  await store.setJSON('_index.json', idx);

  // best-effort cleanup of the answer file
  try { fs.unlinkSync(BODY_PATH); } catch (e) {}

  // best-effort IndexNow ping (Bing/Yandex/Seznam) — never block on failure
  let indexed = null;
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: ID })
    });
    indexed = await r.json();
  } catch (e) { indexed = { ok: false, err: String(e.message || e) }; }

  console.log(JSON.stringify({ ok: true, id: ID, ts: now, total: idx.entries.length, url: `https://pulserevops.com/knowledge/${ID}`, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
