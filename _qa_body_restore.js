// _qa_body_restore.js — restore the answer bodies that _qa_body_fix.js stripped,
// from their qabodybak/<id>.json backups. Needed because the new renderMd now
// renders the leading ![cover] image correctly, so the original bodies (with the
// image) should be back. Deploy-free; does NOT touch _index.json.
const fs = require('fs');
for (const f of ['.env.local', '.env']) { try { for (const ln of fs.readFileSync(f,'utf8').split(/\r?\n/)){const m=ln.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');} } catch(e){} }
const { getStore } = require('@netlify/blobs');
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: process.env.SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const { blobs } = await store.list({ prefix: 'qabodybak/' });
  console.log('backups found:', blobs.length);
  let restored = 0, skipped = 0, errors = 0;
  for (const b of blobs) {
    const id = b.key.replace('qabodybak/', '').replace(/\.json$/, '');
    try {
      const bak = await store.get(b.key, { type: 'json' });
      if (!bak || !bak.answer) { skipped++; continue; }
      const a = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!a) { skipped++; continue; }
      if (a.answer === bak.answer && !a.body_fix_at) { skipped++; continue; } // already original
      a.answer = bak.answer;
      delete a.body_fix_at;
      await store.setJSON('answers/' + id + '.json', a);
      restored++;
      if (restored % 50 === 0) console.log('restored', restored);
    } catch (e) { errors++; console.error('ERR', id, e && e.message); }
  }
  console.log(`\nDONE. restored=${restored} skipped=${skipped} errors=${errors}`);
})().catch(e => { console.error('FATAL', e && e.message); process.exit(1); });
