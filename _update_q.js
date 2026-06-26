// Overwrite an existing q entry's answer from C:/Users/koryj/<id>_answer.md.
// Enforces the LAWS (no TL;DR, 1200-word min, 2+ mermaids). Re-pings IndexNow.
//   node _update_q.js <q####>
const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const ID = process.argv[2];
if (!ID || !/^q\d+$/.test(ID)) { console.error('usage: node _update_q.js <q####>'); process.exit(1); }
const BODY = 'C:/Users/koryj/' + ID + '_answer.md';

(async () => {
  const body = fs.readFileSync(BODY, 'utf8');
  const wc = body.split(/\s+/).filter(Boolean).length;
  const mer = (body.match(/```mermaid/g) || []).length;
  if (/#{2,3}\s*TL;?DR/i.test(body)) { console.error(ID, 'ABORT (LAW): TL;DR present'); process.exit(3); }
  if (wc < 1200) { console.error(ID, 'ABORT (LAW):', wc, 'words (<1200)'); process.exit(3); }
  if (mer < 2) { console.error(ID, 'ABORT (LAW):', mer, 'mermaids (<2)'); process.exit(3); }
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const e = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!e) { console.error(ID, 'not found'); process.exit(2); }
  e.answer = body; e.polished_at = Date.now();
  await store.setJSON('answers/' + ID + '.json', e);
  try { await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: ID }) }); } catch (_e) {}
  try { fs.unlinkSync(BODY); } catch (_e) {}
  console.log(ID, 'UPDATED ·', wc, 'words ·', mer, 'mermaids');
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
