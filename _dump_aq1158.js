const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const e = await store.get('answers/aq1158.json', { type: 'json' });
  console.log('title:', e.question);
  console.log('score:', e.quality_score, 'cover:', e.cover_src);
  console.log('--- numbered ---');
  const heads = [...(e.answer || '').matchAll(/^##\s+(\d+)\.\s+(.+)$/gm)];
  heads.forEach(m => console.log(m[1] + '. ' + m[2].slice(0, 70)));
})();
