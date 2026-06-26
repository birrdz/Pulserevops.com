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
  const st = (idx.entries || []).filter((e) => e && /^st\d+$/i.test(e.id));
  st.sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));
  const titles = st.map((e) => e.question);
  console.log('count', st.length);
  if (st.length) {
    console.log('first', st[0].id, st[0].question);
    console.log('last', st[st.length - 1].id, st[st.length - 1].question);
    console.log('nextId', 'st' + String(parseInt(st[st.length - 1].id.slice(2), 10) + 1).padStart(4, '0'));
  }
  fs.writeFileSync('C:/Users/koryj/website/_st_existing_titles.json', JSON.stringify(titles, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
