const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT,
  });
  const idx = await s.get('_index.json', { type: 'json' });
  const co = (idx.entries || []).filter((e) => e && /^co\d+$/i.test(e.id));
  co.sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));
  console.log(
    JSON.stringify({
      count: co.length,
      first: co[0] ? { id: co[0].id, question: co[0].question } : null,
      last: co[co.length - 1] ? { id: co[co.length - 1].id, question: co[co.length - 1].question } : null,
    })
  );
})();
