'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

function head(p) {
  return new Promise((res) => {
    https.request({ hostname: 'pulserevops.com', path: p, method: 'HEAD' }, (r) => {
      res({ path: p, status: r.statusCode });
    }).on('error', (e) => res({ path: p, err: e.message })).end();
  });
}

(async () => {
  const ids = ['ra0645', 'ra653', 'ra648', 'ra100', 'ra200', 'ra300'];
  for (const id of ids) {
    console.log(await head('/assets/qa/' + id + '.sq.jpg'));
    console.log(await head('/assets/qa/' + id + '.jpg'));
  }
  const idx = await store.get('_index.json', { type: 'json' });
  const ra = (idx.entries || []).filter((e) => e && /^ra\d+$/i.test(String(e.id)));
  let noImg = 0, noSq = 0, noQ = 0, ok = 0;
  for (const e of ra) {
    const q = String(e.question || e.title || '').trim();
    if (!q) noQ++;
    if (!e.img) noImg++;
    if (!e.imgSq) noSq++;
    if (q && e.img && e.imgSq) ok++;
  }
  console.log(JSON.stringify({
    indexRa: ra.length,
    okBothImg: ok,
    noQ,
    noImg,
    noSq,
    sample: ra.filter((e) => !e.imgSq).slice(0, 8).map((e) => ({
      id: e.id,
      q: String(e.question || '').slice(0, 50),
      img: e.img || null,
      imgSq: e.imgSq || null,
    })),
  }, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });
