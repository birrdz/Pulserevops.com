// Audit all ca#### entries for the 11-image LAW: 1 cover + 10 @@PRODUCT img=.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const s = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

(async () => {
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const ids = (idx.entries || []).filter(e => e && /^ca\d+$/i.test(e.id)).map(e => e.id).sort();
  let ok = 0, noCover = 0, needCards = 0, noProduct = 0, partial = 0;
  const needCover = [], needFull = [], needStraggler = [];
  const CONC = 1; // sequential — parallel blob reads caused miscounts on large ca set
  let cur = 0;
  async function worker() {
    while (cur < ids.length) {
      const id = ids[cur++];
      const meta = (idx.entries || []).find(e => e.id === id) || {};
      const e = await s.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
      if (!e || !e.answer) continue;
      const cover = /^﻿?\s*!\[/.test(e.answer);
      const items = (e.answer.match(/^##\s+\d+\.\s/gm) || []).length;
      const imgs = (e.answer.match(/@@PRODUCT[^\n]* img=/g) || []).length;
      const productLines = (e.answer.match(/^@@PRODUCT/gm) || []).length;
      const want = Math.min(10, items || 10);
      if (!cover) { noCover++; needCover.push(id); }
      if (productLines === 0 && imgs < want) { noProduct++; needFull.push({ id, question: meta.question || e.question, imgs, want }); }
      else if (imgs < want) { partial++; needStraggler.push({ id, imgs, want }); needCards++; }
      else if (cover && imgs >= want) ok++;
      else if (!cover) needCards++;
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  const report = {
    total: ids.length,
    ok,
    noCover,
    needCards,
    noProduct,
    partial,
    needCover,
    needFull,
    needStraggler,
  };
  fs.writeFileSync('C:/Users/koryj/website/_ca_img_audit.json', JSON.stringify(report, null, 1));
  console.log(JSON.stringify({
    total: ids.length,
    ok,
    noCover,
    noProduct: noProduct,
    partial,
    needFull: needFull.length,
    needStraggler: needStraggler.length,
  }));
})().catch(e => { console.error(e); process.exit(1); });
