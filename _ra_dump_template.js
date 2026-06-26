const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const id = process.argv[2] || 'q12243';
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const e = await s.get(`answers/${id}.json`, { type: 'json' });
  if (!e) {
    console.error('missing', id);
    process.exit(1);
  }
  fs.writeFileSync(`C:/Users/koryj/website/_ra_template_${id}.md`, e.answer);
  console.log(id, e.question, 'words', e.answer.split(/\s+/).length);
})();
