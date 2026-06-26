// One-off: remove the "## TL;DR" section from the recent RevOps Q&As (keep all
// other content). The locked template (q11133) has no TL;DR. Re-pings IndexNow.
const fs = require('fs');
const path = require('path');
try {
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const l of env.split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
} catch (e) {}
const { getStore } = require('@netlify/blobs');
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const IDS = (process.argv[2] || '').split(',').filter(Boolean);

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  for (const id of IDS) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!e || !e.answer) { console.log(id, 'MISSING'); continue; }
    const before = e.answer;
    // Remove a "## TL;DR" (or "## TLDR") heading and its body up to the next H2.
    const after = before.replace(/\n#{2,3}\s*TL;?DR[ \t]*\r?\n[\s\S]*?(?=\r?\n#{2,3}\s)/i, '\n');
    if (after === before) { console.log(id, 'no TL;DR found'); continue; }
    e.answer = after.replace(/\n{3,}/g, '\n\n');
    e.polished_at = Date.now();
    await store.setJSON('answers/' + id + '.json', e);
    let r = null;
    try {
      r = await (await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pulsemachine-writer-2026', id })
      })).json();
    } catch (_e) {}
    console.log(id, 'TL;DR removed', '· had mermaids:', (after.match(/```mermaid/g) || []).length, '· words:', after.split(/\s+/).length, '· indexnow:', r && r.ok);
  }
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
