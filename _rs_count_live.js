const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const { getStore } = require('@netlify/blobs');
(async () => {
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN,
  });
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const rs = (idx.entries || [])
    .filter((e) => e && /^rs\d+$/i.test(e.id))
    .map((e) => e.id)
    .sort((a, b) => parseInt(a.slice(2), 10) - parseInt(b.slice(2), 10));
  const titles = rs.map((id) => {
    const row = idx.entries.find((e) => e.id === id);
    return row && row.question;
  });
  console.log(JSON.stringify({ count: rs.length, max: rs[rs.length - 1] || null, min: rs[0] || null, next: rs.length ? 'rs' + String(parseInt(rs[rs.length - 1].slice(2), 10) + 1).padStart(4, '0') : 'rs0001' }));
  fs.writeFileSync('C:/Users/koryj/website/_rs_existing_titles.json', JSON.stringify(titles.filter(Boolean), null, 2));
})();
