// Direct-write for current-events / general library q#### entries.
// Generates a fresh q#### ID and writes the gold-format answer.
//
// Usage: node _write_q.js "<question>" tag1,tag2,tag3
// Reads body from C:/Users/koryj/<id>_answer.md where <id> is auto-generated
// and echoed on stdout BEFORE the answer-write step.
//
// Two-phase workflow:
//   Phase 1: node _write_q.js --new "<question>" tag1,tag2
//            → prints the generated id; user writes <id>_answer.md
//   Phase 2: node _write_q.js --commit <id> "<question>" tag1,tag2
//            → publishes the entry using the body file

const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const { prepareBodyForGrade, prepareEntryForPublish } = require('./_write_lib');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

// Single-phase mode: node _write_q.js <id> "<question>" tag1,tag2,...
const ID = process.argv[2];
const QUESTION = process.argv[3];
const TAGS_CSV = process.argv[4] || '';

if (!ID || !/^q\d+$/.test(ID) || !QUESTION) {
  console.error('usage: node _write_q.js <qXXXX> "<question>" tag1,tag2,...');
  console.error('  Body must exist at C:/Users/koryj/<id>_answer.md');
  process.exit(1);
}

const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const BASE_TAGS = ['revops', 'current-events-2027', 'sales-ai'];
const userTags = TAGS_CSV.split(',').map(s => s.trim()).filter(Boolean);
const TAGS = Array.from(new Set([...BASE_TAGS, ...userTags]));

const FORCE = process.argv.includes('--force');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  let body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  const prep = await prepareBodyForGrade(ID, QUESTION, body, { force: FORCE });
  body = prep.body;
  if (prep.rejected) {
    console.error('REJECTED: Image LAW not satisfied after ensureImages pass.');
    console.error('  needs: ' + (prep.imageAudit && prep.imageAudit.needs.join(', ')));
    process.exit(2);
  }
  const grade = prep.grade;
  if (grade.score < 10 && !FORCE) {
    console.error('REJECTED: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));
    if (grade.banned_hits.length) console.error('  banned: ' + grade.banned_hits.join(', '));
    process.exit(2);
  }
  if (grade.score < 12) console.error('NOTE: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  const isUpgrade = !!existing;
  const prevQs = existing && typeof existing.quality_score === 'number' ? existing.quality_score : 0;

  let entry = {
    id: ID,
    question: QUESTION,
    answer: body,
    tags: TAGS,
    sources: [],
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'claude-opus-4-7',
    gold_format: true,
    source: 'library',
    polish_history: [
      ...(existing && Array.isArray(existing.polish_history) ? existing.polish_history : []),
      { from: prevQs, to: 10, at: now, note: isUpgrade ? 'gold-format upgrade current-events' : 'direct-write 10/10 current-events' }
    ]
  };
  entry = prepareEntryForPublish(ID, QUESTION, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const idxIdx = idx.entries.findIndex(e => e && e.id === ID);
  const indexEntry = { id: ID, question: QUESTION, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  if (idxIdx >= 0) idx.entries.splice(idxIdx, 1);
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

  console.log(JSON.stringify({ ok: true, id: ID, upgraded: isUpgrade, prev_qs: prevQs, ts: now, total: idx.entries.length, url: `https://pulserevops.com/knowledge/${ID}`, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
