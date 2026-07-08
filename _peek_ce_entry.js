const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const id = process.argv[2] || 'ce0003';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
(async () => {
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  const body = e.answer || '';
  const heads = body.split('\n').filter(l => /^#{1,3}\s/.test(l)).slice(0, 25);
  console.log('id', id, 'format_v', e.format_v, 'cover_src', e.cover_src);
  console.log('headings:', heads.join(' | '));
  console.log('img count', (body.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length);
  console.log('--- first 1200 chars ---\n' + body.slice(0, 1200));
})().catch(err => { console.error(err); process.exit(1); });
