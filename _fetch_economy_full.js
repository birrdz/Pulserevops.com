const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const e = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of e.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}
(async () => {
  const s = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN,
  });
  const st = await s.get('_economy_cro_infinite_state.json', { type: 'json' });
  const hb = await s.get('_economy_cro_infinite_heartbeat.json', { type: 'json' });
  console.log('=== STATE ===');
  console.log(JSON.stringify(st, null, 2));
  console.log('=== HEARTBEAT ===');
  console.log(JSON.stringify(hb, null, 2));
})();
