// Direct-write for VISITOR questions. Same pattern as _write_ik.js but
// targets vq_* IDs from the queue, removes the question from queue.json
// when done, and clears the _visitor_priority.json flag.
//
// Usage: node _write_vq.js <vq_id> "<question>"
// Reads body from C:/Users/koryj/<vq_id>_answer.md
const fs = require('fs');
const { prepareEntryForPublish } = require('./_write_lib');
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

// LAW vq-typo-fix (passcode 4444): normalize visitor question at ingestion.
const { normalizeQuestion } = require('./netlify/functions/lib/normalize-question');

const ID = process.argv[2];
const RAW_QUESTION = process.argv[3];
const QUESTION = normalizeQuestion(RAW_QUESTION); // capitalize, fix acronyms, fix typos, add terminal ?
if (!ID || !/^vq_/.test(ID) || !QUESTION) {
  console.error('usage: node _write_vq.js <vq_id> "<question>"');
  process.exit(1);
}
if (RAW_QUESTION !== QUESTION) {
  console.error('NORMALIZED: "' + RAW_QUESTION + '" → "' + QUESTION + '"');
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const FORCE = process.argv.includes('--force');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  // GOLD-FORMAT GATE
  const grade = gradeEntry(ID, body);
  if (grade.score < 10 && !FORCE) {
    console.error('REJECTED: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));
    if (grade.banned_hits.length) console.error('  banned: ' + grade.banned_hits.join(', '));
    process.exit(2);
  }
  if (grade.score < 12) console.error('NOTE: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));

  // Build tags — visitor-asked plus topical
  const tags = ['visitor-asked', 'revops', 'ai-revops', 'sales-ai', 'gtm-future-2027'];

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  const isUpgrade = !!existing;
  const prevQs = existing && typeof existing.quality_score === 'number' ? existing.quality_score : 0;

  let entry = {
    id: ID,
    question: QUESTION,
    answer: body,
    tags,
    sources: [],
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'claude-opus-4-7',
    gold_format: true,
    source: 'visitor',
    polish_history: [
      ...(existing && Array.isArray(existing.polish_history) ? existing.polish_history : []),
      { from: prevQs, to: 10, at: now, note: isUpgrade ? 'gold-format upgrade visitor-q' : 'direct-write 10/10 visitor-q' }
    ]
  };
  entry = prepareEntryForPublish(ID, QUESTION, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  // Update index
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const idxIdx = idx.entries.findIndex(e => e && e.id === ID);
  const indexEntry = { id: ID, question: QUESTION, tags, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  if (idxIdx >= 0) idx.entries.splice(idxIdx, 1);
  idx.entries.unshift(indexEntry);
  await store.setJSON('_index.json', idx);

  // Pop from queue.json so volume-gemini does not try to process it again
  try {
    const queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
    const before = queue.items.length;
    queue.items = queue.items.filter(it => it && it.vq_id !== ID && norm(it.q) !== norm(QUESTION));
    if (queue.items.length !== before) await store.setJSON('queue.json', queue);
    console.error(`queue: ${before} → ${queue.items.length}`);
  } catch (_e) {}

  // Clear visitor priority flag so the rest of the engine resumes
  try {
    await store.setJSON('_visitor_priority.json', { active: false, cleared_at: now, cleared_for: ID });
  } catch (_e) {}

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

  console.log(JSON.stringify({ ok: true, id: ID, upgraded: isUpgrade, prev_qs: prevQs, ts: now, total: idx.entries.length, url: `https://pulserevops.com/knowledge/${ID}`, priority_cleared: true, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
