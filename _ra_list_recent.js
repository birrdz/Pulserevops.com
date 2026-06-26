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
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ra = (idx.entries || []).filter((e) => e && /^ra\d+$/i.test(e.id));
  ra.sort((a, b) => parseInt(a.id.slice(2), 10) - parseInt(b.id.slice(2), 10));
  const tail = ra.slice(-20).map((e) => e.question);
  fs.writeFileSync('C:/Users/koryj/_ra_recent_titles.json', JSON.stringify(tail, null, 2));
  console.log('recent', tail.length);
  tail.forEach((t) => console.log(t));
})();
