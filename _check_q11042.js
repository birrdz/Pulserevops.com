const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get('answers/q11042.json', { type: 'json' });
  if (!e) { console.log('q11042 NOT IN BLOB'); return; }
  console.log('qs:', e.quality_score, 'gold:', e.gold_format, 'format_v:', e.format_v, 'pending:', e.pending, 'tags:', JSON.stringify(e.tags));
  console.log('first 200 chars:', e.answer ? e.answer.slice(0,200) : '(no answer)');
})();
