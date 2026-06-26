const { getStore } = require('@netlify/blobs');
const { needsCoverImage } = require('./netlify/functions/lib/img-cover-lib');
const fs = require('fs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const entries = idx.entries || [];
  let need = 0;
  let cur = 0;
  const miss = [];
  async function w() {
    while (cur < entries.length) {
      const e0 = entries[cur++];
      const e = await s.get(`answers/${e0.id}.json`, { type: 'json' }).catch(() => null);
      if (!e || !e.answer) continue;
      if (needsCoverImage(e.answer)) {
        need++;
        if (miss.length < 15) miss.push(e0.id);
      }
    }
  }
  await Promise.all(Array.from({ length: 16 }, w));
  console.log(JSON.stringify({ total: entries.length, stillNeedCover: need, sample: miss }));
})();
