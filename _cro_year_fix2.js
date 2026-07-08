// Deploy-free in-place year-law + banned-word fix for CRO tl batch 2 (tl10159-10198).
// Patches question/title + H1/heading + image alt for year; replaces banned "deep dive into".
const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

const YEAR = {
  tl10160: 'How do I hire a fractional head of revenue in San Antonio in 2027?',
  tl10171: 'What should I look for in a fractional CRO in Tucson in 2027?',
  tl10177: 'Where do I find a fractional head of revenue in South Dakota in 2027?',
  tl10180: 'How do I hire a fractional revenue leader in Tucson in 2027?',
  tl10181: 'How do I hire a fractional VP of Sales in Omaha in 2027?',
  tl10189: 'Should a PE-backed medical device company hire a fractional CRO in 2027?',
  tl10190: 'Should a $5M to $10M ARR biotech company hire a fractional CRO in 2027?',
  tl10192: 'What should I look for in a fractional CRO in San Mateo in 2027?',
  tl10197: 'Where do I find a fractional head of revenue in Montana in 2027?',
};
const BANNED = ['tl10174', 'tl10191']; // "deep dive into" / "Deep-dive into"

function fixBanned(body) {
  return body
    .replace(/deep dive into/gi, 'deep review of')
    .replace(/Deep-dive into/g, 'Review of')
    .replace(/deep-dive into/g, 'review of');
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK, consistency: 'strong' });
  const ids = new Set([...Object.keys(YEAR), ...BANNED]);
  for (const id of ids) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!e) { console.log(id, 'MISSING'); continue; }
    let body = e.answer || '';
    let changed = [];
    if (YEAR[id]) {
      const oldQ = e.question || e.title || '';
      const oldEsc = oldQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // H1 (rare here) and ### Direct Answer entries have title only in image alt + question field.
      body = body.replace(new RegExp('^# ' + oldEsc + '\\s*$', 'm'), '# ' + YEAR[id]);
      body = body.replace(new RegExp('(!\\[)' + oldEsc + '(\\])'), '$1' + YEAR[id] + '$2');
      e.question = YEAR[id];
      if (e.title) e.title = YEAR[id];
      changed.push('year');
    }
    if (BANNED.includes(id)) {
      const before = body;
      body = fixBanned(body);
      if (body !== before) changed.push('banned');
    }
    e.answer = body;
    e.ts = Date.now();
    e.audit_fixed_at = Date.now();
    await store.setJSON('answers/' + id + '.json', e);
    const stillBanned = /\bdive\b|\bdelve\b/i.test(body) ? ' [STILL HAS dive/delve]' : '';
    console.log(id, 'fixed:', changed.join('+') || 'none', '| q:', e.question, stillBanned);
  }
  // index titles
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    const arr = idx && (idx.entries || idx);
    if (Array.isArray(arr)) {
      let n = 0;
      for (const it of arr) if (YEAR[it.id]) { it.question = YEAR[it.id]; if (it.title) it.title = YEAR[it.id]; n++; }
      if (n) { await store.setJSON('_index.json', idx); console.log('index updated for', n); }
    }
  } catch (e) { console.log('index skip:', e.message); }
})();
