require('./_loadenv.js');
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.NETLIFY_AUTH_TOKEN });
const id = process.argv[2];
(async () => {
  const a = await s.get('answers/' + id + '.json', { type: 'json' });
  a.answer = fs.readFileSync('./_tmp_sy_body.md', 'utf8');
  a.age_band_at = Date.now();
  await s.setJSON('answers/' + id + '.json', a);
  console.log('saved ' + id);
})();
