// Dump a library entry's raw answer markdown to C:/Users/koryj/<id>_answer.md
// so it can be edited and re-published via the pillar writer.
// Usage: node _dump_entry.js <id>
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const ID = process.argv[2];
if (!ID) { console.error('usage: node _dump_entry.js <id>'); process.exit(1); }
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const e = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!e || !e.answer) { console.error('NOT FOUND or empty:', ID); process.exit(2); }
  const out = `C:/Users/koryj/${ID}_answer.md`;
  fs.writeFileSync(out, e.answer);
  console.log(JSON.stringify({ ok: true, id: ID, title: e.question, words: e.answer.split(/\s+/).length, file: out }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
