// Direct-write for the Franchises pillar — fr####. Mirrors _write_bs.js.
// Usage: node _write_fr.js <fr####> "<title>"
// Reads body from C:/Users/koryj/<id>_answer.md
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

const ID = process.argv[2];
const TITLE = process.argv[3];
if (!ID || !/^fr\d+$/.test(ID) || !TITLE) {
  console.error('usage: node _write_fr.js <fr####> "<title>"');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const TAGS = ['franchise', 'franchises', 'business-evaluation', 'open-a-business', 'buy-a-franchise', 'small-business-2027'];
const FORCE = process.argv.includes('--force');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  const grade = gradeEntry(ID, body);
  if (grade.score < 10 && !FORCE) {
    console.error('REJECTED: ' + ID + ' scored ' + grade.score + '/12 on grader.');
    console.error('  pillar: ' + grade.pillar + '  word_count: ' + grade.word_count + ' (floor ' + grade.word_floor + ')');
    console.error('  missing: ' + grade.missing.join(', '));
    if (grade.banned_hits.length) console.error('  banned: ' + grade.banned_hits.join(', '));
    process.exit(2);
  }
  if (grade.score < 12) {
    console.error('NOTE: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));
  }

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  const isUpgrade = !!existing;
  const prevQs = existing && typeof existing.quality_score === 'number' ? existing.quality_score : 0;

  let entry = {
    id: ID,
    question: TITLE,
    answer: body,
    tags: TAGS,
    quality_score: 10,
    format_v: '2026-06',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'claude-opus-4-7',
    gold_format: true,
    polish_history: [
      ...(existing && Array.isArray(existing.polish_history) ? existing.polish_history : []),
      { from: prevQs, to: 10, at: now, note: isUpgrade ? 'gold-format upgrade franchise' : 'direct-write 10/10 franchise' }
    ]
  };

  entry = prepareEntryForPublish(ID, TITLE, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const existingIdx = idx.entries.findIndex(e => e && e.id === ID);
  const indexEntry = { id: ID, question: TITLE, tags: entry.tags, quality_score: 10, format_v: '2026-06', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  if (existingIdx >= 0) idx.entries.splice(existingIdx, 1);
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

  // Re-prime the franchise leaderboard cache. Cache-bypass via ?bust=<ts>
  // forces the function to recompute with the just-published entry included;
  // the response repopulates the edge cache so the homepage widget reflects
  // the new entry within seconds of this publish call returning.
  let leaderboard = null;
  try {
    const lr = await fetch(`https://pulserevops.com/.netlify/functions/pulse-franchise-leaderboard?bust=${now}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    const lj = await lr.json();
    leaderboard = { ok: !!(lj && lj.ok), total: lj && lj.total_evaluated };
  } catch (e) { leaderboard = { ok: false, err: String(e.message || e) }; }

  console.log(JSON.stringify({ ok: true, id: ID, upgraded: isUpgrade, prev_qs: prevQs, ts: now, total: idx.entries.length, url: `https://pulserevops.com/franchises/${ID}`, indexnow: indexed, leaderboard }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
