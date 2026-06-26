const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env.local');
for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const eq = line.indexOf('=');
  if (eq < 0) continue;
  const k = line.slice(0, eq).trim();
  let v = line.slice(eq + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  if (!process.env[k]) process.env[k] = v;
}

const { getStore } = require('@netlify/blobs');
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = await store.get('_index.json', { type: 'json' });
  const row = (idx.entries || []).find(e => e && e.id === 'q489');
  console.log('idx row q489:', JSON.stringify(row, null, 2));
  const blob = await store.get('answers/q489.json', { type: 'json' });
  console.log('blob format_v:', blob.format_v, 'qs:', blob.quality_score);
})();
