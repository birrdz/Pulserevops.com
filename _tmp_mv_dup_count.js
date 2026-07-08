#!/usr/bin/env node
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });

(async () => {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  let heroMarker = 0, introImg = 0, total = 0;
  for (const row of (idx.entries || [])) {
    if (!row || !/^mv\d/i.test(String(row.id))) continue;
    total++;
    const e = await store.get('answers/' + row.id + '.json', { type: 'json' });
    const b = String(e && e.answer || '');
    if (b.includes('<!--HERO-->')) heroMarker++;
    const lines = b.split('\n');
    let seenHero = false, hitHeading = false;
    for (const line of lines) {
      const t = line.trim();
      if (/^##\s+/.test(t) || /^#\s+/.test(t)) { hitHeading = true; continue; }
      const im = t.match(/^!\[[^\]]*\]\(([^)\s]+)\)/);
      if (im) {
        if (!seenHero) seenHero = true;
        else if (!hitHeading) introImg++;
      }
    }
  }
  console.log({ total, heroMarker, introImg });
})();
