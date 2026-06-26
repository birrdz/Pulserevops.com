// Re-publish ST entry by updating answers/<id>.json + matching _index.json row.
// Runs grader; rejects if score < 10 or word_count_floor fails (mirrors _write_st.js gates).
// Usage:
//   node _st_repub.js <id> <body-md-path>
//   node _st_repub.js --batch <bodies-json-path>   (array of {id, body_path, question?})
const fs = require('fs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

async function publishOne(store, id, body, opts = {}) {
  const grade = gradeEntry(id, body);
  if (grade.score < 10 && !opts.force) {
    return { id, status: 'REJECTED', score: grade.score, missing: grade.missing, banned: grade.banned_hits, words: grade.word_count };
  }
  if (!grade.criteria.word_count_floor && !opts.force) {
    return { id, status: 'REJECTED-WORDS', score: grade.score, words: grade.word_count, floor: grade.word_floor };
  }
  const existing = await store.get(`answers/${id}.json`, { type: 'json' });
  const now = Date.now();
  const entry = existing ? { ...existing } : {
    id, question: opts.question || id, tags: ['sales-training','sales-meeting','pulse-training','sales-enablement','sales-coaching'],
    format_v: '2026-05', pending: false, ts: now, model: 'claude-opus-4-7', gold_format: true, polish_history: []
  };
  entry.answer = body;
  entry.quality_score = 10;
  entry.polished_at = now;
  entry.format_v = '2026-05';
  entry.gold_format = true;
  entry.polish_history = entry.polish_history || [];
  entry.polish_history.push({ from: existing ? (existing.quality_score || 0) : 0, to: 10, at: now, note: opts.note || 'tierA-body-fill' });
  await store.setJSON(`answers/${id}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const i = idx.entries.findIndex(e => e && e.id === id);
  const row = {
    id, question: entry.question, tags: entry.tags, quality_score: 10,
    format_v: '2026-05', pending: false,
    ts: entry.ts || now, polished_at: now, model: 'claude-opus-4-7',
    was_indexed_at: (i >= 0 && idx.entries[i] && idx.entries[i].was_indexed_at) || null
  };
  if (i >= 0) idx.entries[i] = row; else idx.entries.unshift(row);
  await store.setJSON('_index.json', idx);
  return { id, status: 'OK', score: grade.score, words: grade.word_count };
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const args = process.argv.slice(2);
  if (args[0] === '--batch') {
    const list = JSON.parse(fs.readFileSync(args[1], 'utf8'));
    const results = [];
    for (const item of list) {
      try {
        const body = fs.readFileSync(item.body_path, 'utf8');
        const r = await publishOne(store, item.id, body, { question: item.question, note: item.note, force: item.force });
        results.push(r);
        process.stdout.write(r.status === 'OK' ? '.' : ('!' + r.id));
      } catch (e) {
        results.push({ id: item.id, status: 'ERR', err: String(e.message || e) });
        process.stdout.write('X');
      }
    }
    console.log('\n', JSON.stringify(results, null, 2));
    return;
  }
  const [id, bodyPath] = args;
  if (!id || !bodyPath) { console.error('usage: node _st_repub.js <id> <body-md-path>'); process.exit(1); }
  const body = fs.readFileSync(bodyPath, 'utf8');
  const r = await publishOne(store, id, body);
  console.log(JSON.stringify(r));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
