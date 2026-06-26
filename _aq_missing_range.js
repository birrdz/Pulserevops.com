const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const start = parseInt(process.argv[2] || '1', 10);
const end = parseInt(process.argv[3] || '450', 10);
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = new Set((idx.entries || []).filter((e) => e && /^aq\d+$/i.test(e.id)).map((e) => e.id.toLowerCase()));
  const miss = [];
  for (let i = start; i <= end; i++) {
    const id = 'aq' + String(i).padStart(4, '0');
    if (!ids.has(id)) miss.push(id);
  }
  console.log(JSON.stringify({ start, end, missing: miss.length, ids: miss }));
})();
