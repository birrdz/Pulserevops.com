// One-off: re-title tk0001-tk0005 from "...software stack to run a..." to the
// standardized "best tech stack for a [Industry] in 2027?" pattern. Updates the
// question field in answers/<id>.json AND _index.json (renderer + hub read these
// live, so the change is instant — no deploy needed). Body content untouched.
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

const NEW = {
  tk0001: 'What is the best tech stack for a commercial security & alarm monitoring company in 2027?',
  tk0002: 'What is the best tech stack for a B2B SaaS company in 2027?',
  tk0003: 'What is the best tech stack for a small-to-midsize manufacturing company in 2027?',
  tk0004: 'What is the best tech stack for a multi-provider medical practice in 2027?',
  tk0005: 'What is the best tech stack for a residential real estate brokerage in 2027?',
};

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const out = [];
  for (const [id, q] of Object.entries(NEW)) {
    const entry = await store.get(`answers/${id}.json`, { type: 'json' });
    if (!entry) { out.push(`${id}: MISSING`); continue; }
    entry.question = q;
    await store.setJSON(`answers/${id}.json`, entry);
    const i = idx.entries.findIndex(e => e && e.id === id);
    if (i >= 0) idx.entries[i].question = q;
    out.push(`${id}: retitled`);
  }
  await store.setJSON('_index.json', idx);
  console.log(JSON.stringify({ ok: true, results: out }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
