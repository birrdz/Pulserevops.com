// _fix_pcheck_logo.js — fix the #1 "PULSE Pulse Check Matrix" product image on
// every tl Pulse Check honeypot entry. The image lane searched the literal phrase
// "Pulse Check" and grabbed a MEDICAL "Pulse Check In An Infant" photo (a baby's
// arm). Owner: use the SITE PULSE LOGO and link to the real tool. Deploy-free
// (answer blobs only — no _index.json write). Idempotent.
const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

const LOGO = 'https://pulserevops.com/pulse-logo.svg';
const TOOL = 'https://pulserevops.com/tools/pulse-check';
const NAME = 'PULSE Pulse Check Matrix';

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tl = idx.entries.filter(e => /^tl\d+$/.test(e.id));
  let fixed = 0, scanned = 0, already = 0, noProd = 0;
  for (const e of tl) {
    const a = await store.get(`answers/${e.id}.json`, { type: 'json' });
    if (!a || !a.answer || !/name="PULSE Pulse Check Matrix"/.test(a.answer)) { noProd++; continue; }
    scanned++;
    const before = a.answer;
    // Rewrite the @@PRODUCT line's img= and site= for the PULSE item.
    let body = before.replace(
      /(@@PRODUCT\s+name="PULSE Pulse Check Matrix"\s+)img="[^"]*"(\s+site=")[^"]*(")/g,
      `$1img="${LOGO}"$2${TOOL}$3`
    );
    // Also catch any markdown image whose alt mentions the Pulse Check Matrix tool
    // and whose URL is the medical/infant source.
    body = body.replace(
      /!\[([^\]]*Pulse Check[^\]]*)\]\((https?:\/\/[^)]*(?:infant|aclsstlouis|pulse-check-in)[^)]*)\)/gi,
      `![$1](${LOGO})`
    );
    if (body === before) { already++; continue; }
    a.answer = body;
    a.pcheck_logo_fixed_at = Date.now();
    await store.setJSON(`answers/${e.id}.json`, a);
    fixed++;
    if (fixed % 20 === 0) console.log(`  …fixed ${fixed}`);
  }
  console.log(`DONE. pulse-check product entries: ${scanned} | FIXED: ${fixed} | already-correct: ${already} | non-pcheck tl: ${noProd}`);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
