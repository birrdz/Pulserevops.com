const fs = require('fs');
const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get('answers/q10800.json', { type: 'json' });
  const body = (e && e.answer) || '';
  const mermaid = (body.match(/```mermaid/g) || []).length;
  const cleaned = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\|.*$/gm, ' ')
    .replace(/[#>*`_\[\]\(\)\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned ? cleaned.split(' ').length : 0;
  console.log('q10800 polished_at:', e && new Date(e.polished_at).toISOString());
  console.log('q10800 prose words:', words, 'mermaid count:', mermaid);
  console.log('first 200 chars:', body.slice(0, 200));
})();
