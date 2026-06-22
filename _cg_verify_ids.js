const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of e.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}
const ids = process.argv.slice(2);
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const live = new Set((idx.entries || []).filter((e) => /^cg\d+$/i.test(e.id)).map((e) => e.id));
  for (const id of ids) console.log(id, live.has(id) ? 'LIVE' : 'MISSING');
})();
