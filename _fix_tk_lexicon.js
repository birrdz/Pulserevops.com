// One-off: align body lexicon in tk0001-tk0005 — "software stack" → "tech stack"
// (case-preserving for the common variants). Leaves generic "stack"/"Core Stack"
// alone. Body lives in answers/<id>.json .answer; index has no body. No deploy
// needed (renderer reads the body live from the store).
const fs = require('fs');
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
const IDS = ['tk0001', 'tk0002', 'tk0003', 'tk0004', 'tk0005'];

function swap(s) {
  return String(s || '')
    .replace(/Software Stack/g, 'Tech Stack')
    .replace(/software stack/g, 'tech stack')
    .replace(/software-stack/g, 'tech-stack')
    .replace(/SOFTWARE STACK/g, 'TECH STACK');
}

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const out = [];
  for (const id of IDS) {
    const entry = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!entry) { out.push(`${id}: MISSING`); continue; }
    const before = (entry.answer.match(/software stack/gi) || []).length;
    entry.answer = swap(entry.answer);
    await store.setJSON(`answers/${id}.json`, entry);
    out.push(`${id}: ${before} swapped`);
  }
  console.log(JSON.stringify({ ok: true, results: out }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
