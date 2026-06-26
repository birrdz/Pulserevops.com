// Direct-write OVERWRITE for the Industry KPIs pillar.
// Unlike _write_st.js (create-only), this script allows overwriting an
// existing ik#### entry so we can upgrade the legacy qs=5 plain-text
// entries to qs=10 gold format (1,200 words + 2 mermaids).
//
// Usage: node _write_ik.js <id> "<question>" <industry-slug>
// Reads body from C:/Users/koryj/<id>_answer.md
//
// GOLD-FORMAT GATE: refuses to publish if the body scores < 10/12 on the
// shared grader. Use --force to override (rarely needed). 2026-05-27 rule.
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
const QUESTION = process.argv[3];
const INDUSTRY_SLUG = (process.argv[4] || '').toLowerCase();
if (!ID || !/^ik\d+$/.test(ID) || !QUESTION) {
  console.error('usage: node _write_ik.js <ik####> "<question>" <industry-slug>');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;

const BASE_TAGS = ['industry-kpi', 'kpi-guide', 'sales-kpi', 'benchmarks', 'revenue-operations'];
if (INDUSTRY_SLUG) BASE_TAGS.push(INDUSTRY_SLUG);
const TAGS = Array.from(new Set(BASE_TAGS));

const FORCE = process.argv.includes('--force');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  // GOLD-FORMAT GATE — refuse to publish if score < 10/12 unless --force.
  const grade = gradeEntry(ID, body);
  if (grade.score < 10 && !FORCE) {
    console.error('REJECTED: ' + ID + ' scored ' + grade.score + '/12 on gold-format grader.');
    console.error('  pillar: ' + grade.pillar + '  word_count: ' + grade.word_count + ' (floor ' + grade.word_floor + ')');
    console.error('  missing: ' + grade.missing.join(', '));
    if (grade.banned_hits.length) console.error('  banned: ' + grade.banned_hits.join(', '));
    console.error('Fix the body file at ' + BODY_PATH + ' and re-run. Override only if absolutely needed: add --force flag.');
    process.exit(2);
  }
  if (grade.score < 12) {
    console.error('NOTE: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));
  }

  // Read existing entry (overwrite mode — entry SHOULD exist as qs=5 legacy)
  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  const isUpgrade = !!existing;
  const prevQs = existing && typeof existing.quality_score === 'number' ? existing.quality_score : 0;

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
    polish_history: [
      ...(existing && Array.isArray(existing.polish_history) ? existing.polish_history : []),
      { from: prevQs, to: 10, at: now, note: isUpgrade ? 'gold-format upgrade industry-kpi' : 'direct-write 10/10 industry-kpi' }
    ]
  };

  entry = prepareEntryForPublish(ID, QUESTION, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  // Update _index.json entry (replace, don't duplicate)
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const existingIdx = idx.entries.findIndex(e => e && e.id === ID);
  const indexEntry = { id: ID, question: QUESTION, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  if (existingIdx >= 0) {
    idx.entries.splice(existingIdx, 1);
  }
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

  console.log(JSON.stringify({ ok: true, id: ID, upgraded: isUpgrade, prev_qs: prevQs, ts: now, total: idx.entries.length, url: `https://pulserevops.com/industry-kpis/${ID}`, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
