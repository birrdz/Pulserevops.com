// Direct-write for the D1 NIL line — Q&A entries on each program's 2027 NIL needs + strategy.
// Usage: node _write_nil.js <id> "<question>" <team-slug> <football|mbb|wbb> [positive|negative]
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
// Back-compat: support both old 3-arg form (id, question, sport)
// and new 5-arg form (id, question, team-slug, sport, sentiment).
const A4 = (process.argv[4] || '').toLowerCase();
const A5 = (process.argv[5] || '').toLowerCase();
const A6 = (process.argv[6] || '').toLowerCase();
let TEAM_SLUG = '';
let SPORT = '';
let SENTIMENT = '';
if (['football', 'mbb', 'wbb'].includes(A4)) {
  SPORT = A4;
  SENTIMENT = ['positive', 'negative'].includes(A5) ? A5 : '';
} else {
  TEAM_SLUG = A4;
  SPORT = A5;
  SENTIMENT = ['positive', 'negative'].includes(A6) ? A6 : '';
}
if (!ID || !/^q\d+$/.test(ID) || !QUESTION || !['football', 'mbb', 'wbb'].includes(SPORT)) {
  console.error('usage: node _write_nil.js <q####> "<question>" <team-slug> <football|mbb|wbb> [positive|negative]');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const SPORT_TAG = { football: 'nil-football', mbb: 'nil-mbb', wbb: 'nil-wbb' }[SPORT];
const BASE_TAGS = ['nil', 'nil-2027', SPORT_TAG, 'd1', 'college-athletics'];
if (TEAM_SLUG) BASE_TAGS.push(TEAM_SLUG);
const TAGS = SENTIMENT === 'negative' ? [...BASE_TAGS, 'negative-leaning'] : BASE_TAGS;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  if (existing) { console.error('ABORT: answers/' + ID + '.json already exists'); process.exit(2); }

  let entry = {
    id: ID,
    question: QUESTION,
    answer: body,
    tags: TAGS,
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'claude-opus-4-7',
    gold_format: true,
    polish_history: [{ from: 0, to: 10, at: now, note: 'direct-write 10/10 nil-d1 ' + (SENTIMENT || 'neutral') + (TEAM_SLUG ? ' ' + TEAM_SLUG : '') }]
  };

  entry = prepareEntryForPublish(ID, QUESTION, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  if (idx.entries.some(e => e && e.id === ID)) { console.error('ABORT: _index.json already has ' + ID); process.exit(2); }
  const indexEntry = { id: ID, question: QUESTION, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  idx.entries.unshift(indexEntry);
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

  console.log(JSON.stringify({ ok: true, id: ID, ts: now, total: idx.entries.length, url: `https://pulserevops.com/knowledge/${ID}`, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
