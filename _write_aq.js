// Direct-write for the Aquariums pillar — aq####.
// Top-10 aquarium ranking guides ("Top 10 Nano Aquariums 2027", "Top 10
// Aquarium Filters 2027", "Top 10 Beginner Freshwater Fish 2027", etc.).
// Reuses the Electronic-Reviews Top-10 skeleton + grader ruleset: 1800-word
// floor, 10 numbered picks, 🏆 BEST OVERALL + 💎 BEST VALUE pills, 1 mermaid,
// FAQ, Sources, no banned phrases.
// GOLD-FORMAT GATE + Image LAW: _write_lib.prepareBodyForGrade ensures cover +
// product imgs before grading; refuses publish below 10/12.
//
// Usage: node _write_aq.js <aq####> "<title>" [topic-slug]
// Reads body from C:/Users/koryj/<id>_answer.md
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

const ID = process.argv[2];
const TITLE = process.argv[3];
const TOPIC_SLUG = (process.argv[4] || '').toLowerCase();
if (!ID || !/^aq\d+$/.test(ID) || !TITLE) {
  console.error('usage: node _write_aq.js <aq####> "<title>" [topic-slug]');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const BASE_TAGS = ['aquarium', 'top-10', 'aquariums', 'fishkeeping', 'best-of-2027'];
if (TOPIC_SLUG) BASE_TAGS.push(TOPIC_SLUG);
const TAGS = Array.from(new Set(BASE_TAGS));

const FORCE = process.argv.includes('--force');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  let body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  const prep = await prepareBodyForGrade(ID, TITLE, body, { force: FORCE });
  body = prep.body;
  if (prep.rejected) {
    console.error('REJECTED: Image LAW not satisfied after ensureImages pass.');
    console.error('  needs: ' + (prep.imageAudit && prep.imageAudit.needs.join(', ')));
    process.exit(2);
  }
  const grade = prep.grade;
  if (grade.score < 10 && !FORCE) {
    console.error('REJECTED: ' + ID + ' scored ' + grade.score + '/12 on gold-format grader.');
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
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'claude-opus-4-8',
    gold_format: true,
    polish_history: [
      ...(existing && Array.isArray(existing.polish_history) ? existing.polish_history : []),
      { from: prevQs, to: 10, at: now, note: isUpgrade ? 'gold-format upgrade aquarium' : 'direct-write 10/10 aquarium' }
    ]
  };

  entry = prepareEntryForPublish(ID, TITLE, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const existingIdx = idx.entries.findIndex(e => e && e.id === ID);
  const indexEntry = { id: ID, question: TITLE, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-8', was_indexed_at: null };
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

  console.log(JSON.stringify({ ok: true, id: ID, upgraded: isUpgrade, prev_qs: prevQs, ts: now, total: idx.entries.length, url: `https://pulserevops.com/aquariums/${ID}`, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
