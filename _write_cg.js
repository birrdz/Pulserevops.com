// Direct-write for the Coaching pillar — cg####.
// Top-10 sales coaching rankings with Best Overall + Best Value highlights.
// Usage: node _write_cg.js <cg####> "<title>" [topic-slug]
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
if (!ID || !/^cg\d+$/.test(ID) || !TITLE) {
  console.error('usage: node _write_cg.js <cg####> "<title>" [topic-slug]');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const FORCE = process.argv.includes('--force');
// LAW (2026-06-23): build/deploy text FIRST, images later via Claude Code.
// --text-first publishes without images and stamps images_deferred_at so the
// grader won't cap the score at 9, and a later Claude image pass fills them in.
const TEXT_FIRST = process.argv.includes('--text-first');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  let body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  // cg is DUAL (1:1 Top-10 + general Q&A) — tag by detected body shape.
  const numberedSections = (body.match(/^#{2,3}\s+(?:\d+\.|#?\d+\s+[—-])/gm) || []).length;
  const isTop10 = numberedSections >= 8;
  const BASE_TAGS = isTop10
    ? ['sales-coaching', 'coaching', 'top-10', 'best-of-2027', 'coaching-playbook']
    : ['sales-coaching', 'coaching', 'coaching-qa', 'operator-qa', 'coaching-playbook'];
  if (TOPIC_SLUG) BASE_TAGS.push(TOPIC_SLUG);
  const TAGS = Array.from(new Set(BASE_TAGS));

  const prep = await prepareBodyForGrade(ID, TITLE, body, { force: FORCE, skipImages: TEXT_FIRST });
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
    model: 'deepseek-chat',
    gold_format: true,
    ...(TEXT_FIRST ? { images_deferred_at: now, images_pending: true } : {}),
    polish_history: [
      ...(existing && Array.isArray(existing.polish_history) ? existing.polish_history : []),
      { from: prevQs, to: 10, at: now, note: isUpgrade ? 'gold-format upgrade coaching' : 'direct-write 10/10 coaching' },
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
    model: 'deepseek-chat',
    was_indexed_at: null,
    seo_optimized_at: entry.seo_optimized_at || now,
    ...(TEXT_FIRST ? { images_pending: true } : {}),
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
      url: `https://pulserevops.com/coaching/${ID}`,
      indexnow: indexed,
    })
  );
})().catch((e) => {
  console.error('ERR', e && e.message);
  process.exit(1);
});
