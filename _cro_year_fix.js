// Deploy-free in-place year-law fix for CRO tl titles. Patches question/title + H1 only.
// Usage: node -r ./_loadenv.js _cro_year_fix.js
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

// id -> new exact title (must already end "in 2027?")
const FIXES = {
  tl10012: 'When should a telecom company hire a fractional CRO in 2027?',
  tl10015: 'Where do I find a fractional revenue leader in Georgia in 2027?',
  tl10016: 'Where do I find a fractional VP of Sales in Florida in 2027?',
  tl10019: 'How do I hire a fractional head of revenue in San Jose in 2027?',
  tl10036: 'Where do I find a fractional head of revenue in Vermont in 2027?',
  tl10039: 'How do I hire a fractional revenue leader in Oakland in 2027?',
  tl10040: 'How do I hire a fractional VP of Sales in Tulsa in 2027?',
};

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK, consistency: 'strong' });
  for (const [id, newTitle] of Object.entries(FIXES)) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!e) { console.log(id, 'MISSING'); continue; }
    const oldQ = e.question || e.title || '';
    let body = e.answer || '';
    // Replace H1 (# ...) and the leading image alt text that mirrors the question.
    const oldEsc = oldQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    body = body.replace(new RegExp('^# ' + oldEsc + '\\s*$', 'm'), '# ' + newTitle);
    body = body.replace(new RegExp('(!\\[)' + oldEsc + '(\\])'), '$1' + newTitle + '$2');
    e.question = newTitle;
    if (e.title) e.title = newTitle;
    e.answer = body;
    e.ts = Date.now();
    e.year_fixed_at = Date.now();
    await store.setJSON('answers/' + id + '.json', e);
    console.log(id, 'fixed ->', newTitle, '| H1 ok:', body.includes('# ' + newTitle));
  }
  // Update _index.json titles too (deploy-free) so cards/search show fixed title.
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    if (idx && Array.isArray(idx.entries || idx)) {
      const arr = idx.entries || idx;
      let n = 0;
      for (const it of arr) {
        if (FIXES[it.id]) { it.question = FIXES[it.id]; if (it.title) it.title = FIXES[it.id]; n++; }
      }
      if (n) { await store.setJSON('_index.json', idx); console.log('index updated for', n, 'entries'); }
    }
  } catch (e) { console.log('index update skipped:', e.message); }
})();
