const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get('answers/q12514.json', { type: 'json' });
  if (!e) { console.error('q12514 not found'); return; }
  const before = e.answer;
  // Replace banned word "landscape" -> "competitive map" / "competitive market"
  const after = before
    .replace(/the new competitive landscape/gi, 'the new competitive market')
    .replace(/\blandscape\b/gi, 'competitive market');
  if (before === after) { console.log('no change'); return; }
  e.answer = after;
  e.polished_at = Date.now();
  await s.setJSON('answers/q12514.json', e);
  console.log('patched q12514: removed "landscape"');
})();
