#!/usr/bin/env node
// EMERGENCY ROLLBACK — restore the last known-good Netlify deploy (undo the 08:11 regression).
// Run: node rollback.js
'use strict';
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const TOK = process.env.NETLIFY_AUTH_TOKEN, SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const sleep = ms => new Promise(r => setTimeout(r, ms));
// most-recent READY deploys BEFORE the broken 6a51faccf, newest first — try each until an entry page renders
const CANDIDATES = ['6a51bea709a90ed9087f3eee', '6a5117892c86e00a616017ab'];
const CHECK = 'https://pulserevops.com/software/sw115';

(async () => {
  for (const id of CANDIDATES) {
    console.log('[rollback] restoring deploy ' + id + ' …');
    const r = await fetch('https://api.netlify.com/api/v1/sites/' + SITE + '/deploys/' + id + '/restore', { method: 'POST', headers: { Authorization: 'Bearer ' + TOK } });
    console.log('[rollback]   restore -> ' + r.status);
    if (!r.ok) { console.log('[rollback]   ' + (await r.text()).slice(0, 160)); continue; }
    await sleep(6000);
    const s = await fetch(CHECK).then(x => x.status).catch(() => 0);
    console.log('[rollback]   verify ' + CHECK + ' -> ' + s);
    if (s === 200) { console.log('\n✅ ROLLED BACK — entry pages render again (restored ' + id + '). Site is back.'); return; }
    console.log('[rollback]   still 404 — trying next-older deploy…');
  }
  console.log('\n❌ Rollback candidates did not restore rendering. STOP and tell Claude — need to pick an older deploy from the Netlify dashboard (Deploys tab → a "ready" one with a green Published badge → Publish deploy).');
  process.exit(1);
})().catch(e => { console.log('[rollback] ERROR ' + e.message); process.exit(1); });
