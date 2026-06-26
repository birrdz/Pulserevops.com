// Bulk IndexNow ping for all cg#### entries (run AFTER the /coaching deploy, so
// pulse-indexnow-target.js has the cg URL mapping). Pings each live cg entry.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOK });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).map(e => e.id).filter(id => /^cg\d+$/.test(id)).sort();
  let ok = 0, fail = 0;
  for (const id of ids) {
    try {
      const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pulsemachine-writer-2026', id }), signal: AbortSignal.timeout(12000)
      });
      const j = await r.json().catch(() => ({}));
      if (j && j.ok) ok++; else { fail++; if (fail <= 5) console.log('  ping not-ok', id, JSON.stringify(j).slice(0, 120)); }
    } catch (e) { fail++; }
    await sleep(150);
  }
  console.log(`IndexNow cg ping — total ${ids.length} | ok ${ok} | fail ${fail}`);
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
