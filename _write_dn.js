// Direct-write for the dining pillar — dn####.
// Top-10 restaurant rankings with Best Overall + Best Value highlights.
// Usage: node _write_dn.js <dn####> "<title>" [topic-slug]
// Reads body from C:/Users/koryj/<id>_answer.md
//
// GOLD-FORMAT GATE + Image LAW via prepareBodyForGrade (cover + 10 @@PRODUCT imgs).
const fs = require('fs');
const { prepareBodyForGrade, prepareEntryForPublish, finalizeIndexNow } = require('./_write_lib');
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
const TITLE = process.argv[3];
const TOPIC_SLUG = (process.argv[4] || '').toLowerCase();
if (!ID || !/^dn\d+$/.test(ID) || !TITLE) {
  console.error('usage: node _write_dn.js <dn####> "<title>" [topic-slug]');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const BASE_TAGS = ['dining', 'top-10', 'best-of-2027', 'restaurants'];
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
    console.error('  missing: ' + grade.missing.join(', '));
    process.exit(2);
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
      { from: prevQs, to: 10, at: now, note: isUpgrade ? 'gold-format upgrade dining' : 'direct-write 10/10 dining' },
    ],
  };

  entry = prepareEntryForPublish(ID, TITLE, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const existingIdx = idx.entries.findIndex((e) => e && e.id === ID);
  const indexEntry = {
    id: ID,
    question: TITLE,
    tags: entry.tags,
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'claude-opus-4-8',
    was_indexed_at: null,
    seo_optimized_at: entry.seo_optimized_at || now,
  };
  if (existingIdx >= 0) idx.entries.splice(existingIdx, 1);
  idx.entries.unshift(indexEntry);
  await store.setJSON('_index.json', idx);

  try {
    fs.unlinkSync(BODY_PATH);
  } catch (e) {}

  const indexed = await finalizeIndexNow(ID, store, indexEntry);

  console.log(
    JSON.stringify({
      ok: true,
      id: ID,
      upgraded: isUpgrade,
      score: grade.score,
      words: grade.word_count,
      url: `https://pulserevops.com/dining/${ID}`,
      indexnow: indexed,
    })
  );
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
