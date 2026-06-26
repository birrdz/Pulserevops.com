const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT,
  });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ev = (idx.entries || [])
    .filter((e) => e && /^ev\d+$/i.test(e.id))
    .sort((a, b) => a.id.localeCompare(b.id));
  console.log(JSON.stringify({ count: ev.length, first: ev[0], last: ev[ev.length - 1] }, null, 2));
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
