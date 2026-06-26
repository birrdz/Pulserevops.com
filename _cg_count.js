const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const cg = (idx.entries || []).filter((e) => e && /^cg\d+$/i.test(e.id));
  cg.sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));
  console.log('count', cg.length);
  if (cg.length) console.log('first', cg[0].id, cg[0].question);
  if (cg.length) console.log('last', cg[cg.length - 1].id, cg[cg.length - 1].question);
})();
