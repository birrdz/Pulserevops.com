const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

(async () => {
  const e = await store.get('answers/aq1160.json', { type: 'json' });
  if (!e) { console.log('NOT FOUND'); return; }
  const body = e.answer || e.body || '';
  const title = e.question || e.title || '';
  console.log('TITLE:', title);
  console.log('format_v:', e.format_v, 'cover_src:', e.cover_src);
  const imgs = [...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m => m[1]);
  console.log('IMAGES:', JSON.stringify(imgs, null, 2));
  const pol = imgs.filter(u => /pollinations/i.test(u));
  console.log('POLLINATIONS:', pol.length, pol);
  const ext = imgs.filter(u => /^https?:\/\//i.test(u));
  console.log('EXTERNAL:', ext.length, ext);
  for (const u of imgs) {
    const local = u.startsWith('/assets/qa/');
    let size = 'n/a';
    if (local) {
      try { size = fs.statSync(WD + u).size; } catch (err) { size = 'MISSING'; }
    }
    console.log('  ', u, 'size=', size);
  }
})().catch(e => { console.error(e); process.exit(1); });
