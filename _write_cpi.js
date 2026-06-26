// Direct-write for the CPI Security line — Q&A entries targeting search queries
// about CPI Security (NC-based home security company). Mix of POSITIVE (10) and
// NEGATIVE (90). Tags include 'negative-leaning' on negatives to push to middle
// of /knowledge listing.
// Usage: node _write_cpi.js <id> "<question>" <positive|negative>
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
const SENTIMENT = (process.argv[4] || 'negative').toLowerCase();
if (!ID || !/^q\d+$/.test(ID) || !QUESTION || !['positive', 'negative'].includes(SENTIMENT)) {
  console.error('usage: node _write_cpi.js <q####> "<question>" <positive|negative>');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const BASE_TAGS = ['cpi-security', 'home-security', 'north-carolina', 'security-systems'];
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
    polish_history: [{ from: 0, to: 10, at: now, note: 'direct-write 10/10 cpi-security ' + SENTIMENT }]
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

  console.log(JSON.stringify({ ok: true, id: ID, sentiment: SENTIMENT, ts: now, total: idx.entries.length, url: `https://pulserevops.com/knowledge/${ID}`, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
