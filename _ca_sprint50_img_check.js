const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const q = JSON.parse(fs.readFileSync('C:/Users/koryj/_ca_sprint50.json', 'utf8'));
  let noCards = 0, noCover = 0, ok = 0;
  for (const row of q) {
    const e = await s.get('answers/' + row.id + '.json', { type: 'json' });
    if (!e || !e.answer) continue;
    const imgs = (e.answer.match(/@@PRODUCT[^\n]* img=/g) || []).length;
    const cover = /^﻿?\s*!\[/.test(e.answer);
    if (imgs < 10) noCards++;
    if (!cover) noCover++;
    if (imgs >= 10 && cover) ok++;
  }
  console.log(JSON.stringify({ sprint50: q.length, ok, needCards: noCards, needCover: noCover }));
})();
