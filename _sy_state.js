const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const idx = await s.get('_index.json', { type: 'json', consistency: 'strong' });
  let max = 0, n = 0;
  for (const e of idx.entries) { const m = /^sy(\d+)$/.exec(e.id || ''); if (m) { n++; max = Math.max(max, +m[1]); } }
  const q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_sy_full_queue.json', 'utf8'));
  let qmax = 0; for (const it of q) { const m = /^sy(\d+)$/.exec(it.id || ''); if (m) qmax = Math.max(qmax, +m[1]); }
  console.log('PUBLISHED sy in index:', n, '| max published id: sy' + String(max).padStart(4, '0'));
  console.log('queue items:', q.length, '| queue max id: sy' + String(qmax).padStart(4, '0'));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
