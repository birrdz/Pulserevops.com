// Rewrite an existing industry-kpi entry to the ik0035 LOCKED template.
// Usage: node _rewrite_ik.js <id> "<question>" <industry-slug>
// Reads body from C:/Users/koryj/<id>_answer.md and OVERWRITES the existing
// answers/<id>.json. Updates the _index.json entry IN PLACE (preserves original
// ts/position; does not push to top of feed like _write_ik.js does).
//
// Gates on grade-entry.js (10/12 required for KPI pillar with ik0035 checks);
// --force overrides.
//
// Counterpart to _write_ik.js (which pushes to front of feed).
const fs = require('fs');
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
  console.error('usage: node _rewrite_ik.js <ik####> "<question>" <industry-slug>');
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

  // IK0035-TEMPLATE GATE
  const grade = gradeEntry(ID, body);
  if (grade.score < 10 && !FORCE) {
    console.error('REJECTED: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));
    if (typeof grade.ik_section_count === 'number') {
      console.error('  ik0035_section_count: ' + grade.ik_section_count + '/6 (need 5+)');
    }
    if (grade.banned_hits.length) console.error('  banned: ' + grade.banned_hits.join(', '));
    process.exit(2);
  }
  if (grade.score < 12) console.error('NOTE: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  const originalTs = existing && existing.ts ? existing.ts : now;
  const originalPolishHistory = (existing && Array.isArray(existing.polish_history)) ? existing.polish_history.slice(0, 20) : [];
  const prevQs = existing && typeof existing.quality_score === 'number' ? existing.quality_score : 0;

  const entry = {
    id: ID,
    question: QUESTION,
    answer: body,
    tags: TAGS,
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    ts: originalTs,
    polished_at: now,
    model: 'claude-opus-4-7',
    gold_format: true,
    polish_history: [
      ...originalPolishHistory,
      { from: prevQs, to: 10, at: now, note: 'rewrite-to-ik0035-template' }
    ]
  };

  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const existingIdx = idx.entries.findIndex(e => e && e.id === ID);
  const indexEntry = { id: ID, question: QUESTION, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: originalTs, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  if (existingIdx >= 0) {
    idx.entries[existingIdx] = indexEntry;
  } else {
    idx.entries.unshift(indexEntry);
  }
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

  console.log(JSON.stringify({ ok: true, id: ID, ts: originalTs, polished_at: now, total: idx.entries.length, url: `https://pulserevops.com/industry-kpis/${ID}`, indexnow: indexed, prev_score: prevQs, new_score: 10, ik_sections: grade.ik_section_count }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
