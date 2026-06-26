// Overwrite an existing sales-training entry (st####) with fresh content.
// Use when an id is already published but its topic/body must be replaced.
// Usage: node _update_st.js <st####> "<question>" <comma-separated-extra-tags>
// Reads body from C:/Users/koryj/<id>_answer.md. Enforces grade >= 10/12.
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
const EXTRA = (process.argv[4] || '').toLowerCase();
if (!ID || !/^st\d+$/.test(ID) || !QUESTION) {
  console.error('usage: node _update_st.js <st####> "<question>" <comma-separated-extra-tags>');
  process.exit(1);
}
const BODY_PATH = `C:/Users/koryj/${ID}_answer.md`;
const BASE_TAGS = ['sales-training', 'sales-meeting', 'pulse-training', 'sales-enablement', 'sales-coaching'];
const EXTRA_TAGS = EXTRA ? EXTRA.split(',').map(t => t.trim()).filter(Boolean) : [];
const TAGS = Array.from(new Set([...BASE_TAGS, ...EXTRA_TAGS]));
const FORCE = process.argv.includes('--force');

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const body = fs.readFileSync(BODY_PATH, 'utf8');
  const now = Date.now();

  const grade = gradeEntry(ID, body);
  if (grade.score < 10 && !FORCE) {
    console.error('REJECTED: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));
    process.exit(2);
  }
  if (grade.score < 12) console.error('NOTE: ' + ID + ' scored ' + grade.score + '/12. Missing: ' + grade.missing.join(', '));

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  if (!existing) { console.error('ABORT: answers/' + ID + '.json does not exist — use _write_st.js for new entries'); process.exit(2); }

  existing.question = QUESTION;
  existing.answer = body;
  existing.tags = TAGS;
  existing.polished_at = now;
  await store.setJSON(`answers/${ID}.json`, existing);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const e = idx.entries.find(x => x && x.id === ID);
  if (e) { e.question = QUESTION; e.tags = TAGS; e.polished_at = now; }
  await store.setJSON('_index.json', idx);

  try { fs.unlinkSync(BODY_PATH); } catch (e) {}

  let indexed = null;
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: ID })
    });
    indexed = await r.json();
  } catch (e) { indexed = { ok: false, err: String(e.message || e) }; }

  console.log(JSON.stringify({ ok: true, updated: ID, score: grade.score, url: `https://pulserevops.com/sales-trainings/${ID}`, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
