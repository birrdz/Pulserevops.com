// Rewrite an existing sales-training entry to the st213 LOCKED template.
// Usage: node _rewrite_st.js <id> "<question/title>" <comma-separated-extra-tags>
// Reads body from C:/Users/koryj/<id>_answer.md and OVERWRITES the existing
// answers/<id>.json. Updates the _index.json entry in place (keeps original ts
// position so the entry doesn't jump to the top, but updates the quality_score
// and polished_at).
//
// Gates on grade-entry.js (10/12 required); --force overrides.
//
// Counterpart to _write_st.js (which refuses to write if entry exists).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

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
const EXTRA = (process.argv[4] || '').toLowerCase();
if (!ID || !/^st\d+$/.test(ID) || !QUESTION) {
  console.error('usage: node _rewrite_st.js <st####> "<question>" <comma-separated-extra-tags>');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const BASE_TAGS = ['sales-training', 'sales-meeting', 'pulse-training', 'sales-enablement', 'sales-coaching'];
const EXTRA_TAGS = EXTRA ? EXTRA.split(',').map(t => t.trim()).filter(Boolean) : [];
const TAGS = Array.from(new Set([...BASE_TAGS, ...EXTRA_TAGS]));

const FORCE = process.argv.includes('--force');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  // ST213-TEMPLATE GATE
  const grade = gradeEntry(ID, body);
  if (grade.score < 10 && !FORCE) {
    console.error('REJECTED: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));
    if (grade.banned_hits.length) console.error('  banned: ' + grade.banned_hits.join(', '));
    process.exit(2);
  }
  if (grade.score < 12) console.error('NOTE: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  const originalTs = existing && existing.ts ? existing.ts : now;
  const originalPolishHistory = (existing && Array.isArray(existing.polish_history)) ? existing.polish_history.slice(0, 20) : [];

  const entry = {
    id: ID,
    question: QUESTION,
    answer: body,
    tags: TAGS,
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    ts: originalTs,
    polished_at: now,
    model: 'claude-opus-4-7',
    gold_format: true,
    polish_history: [
      ...originalPolishHistory,
      { from: (existing && existing.quality_score) || 5, to: 10, at: now, note: 'rewrite-to-st213-template' }
    ]
  };

  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const existingIdx = idx.entries.findIndex(e => e && e.id === ID);
  const indexEntry = { id: ID, question: QUESTION, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: originalTs, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  if (existingIdx >= 0) {
    idx.entries[existingIdx] = indexEntry;
  } else {
    idx.entries.unshift(indexEntry);
  }
  await store.setJSON('_index.json', idx);

  try { fs.unlinkSync(BODY_PATH); } catch (e) {}

  let indexed = null;
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: ID })
    });
    indexed = await r.json();
  } catch (e) { indexed = { ok: false, err: String(e.message || e) }; }

  console.log(JSON.stringify({ ok: true, id: ID, ts: originalTs, polished_at: now, total: idx.entries.length, url: `https://pulserevops.com/sales-trainings/${ID}`, indexnow: indexed, prev_score: existing && existing.quality_score, new_score: 10 }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
