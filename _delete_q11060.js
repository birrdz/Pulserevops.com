const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  // Delete blob
  try { await s.delete('answers/q11060.json'); console.log('deleted answers/q11060.json'); } catch (e) { console.log('delete err', e.message); }
  // Remove from index
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const before = idx.entries.length;
  idx.entries = idx.entries.filter(x => !x || x.id !== 'q11060');
  await s.setJSON('_index.json', idx);
  console.log(`removed from _index.json: ${before} -> ${idx.entries.length}`);
})();
