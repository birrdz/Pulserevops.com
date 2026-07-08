// One-off: list unique movie titles referenced across all mv entries (READ-ONLY).
'use strict';
const fs = require('fs');
for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { enumerateProductSlots, parseMovieSlot } = require('./_mv_image_title_match');
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter((e) => e && /^mv\d+$/i.test(e.id));
  const uniq = new Map();
  let slotTotal = 0;
  for (const row of rows) {
    let a; try { a = await store.get('answers/' + row.id + '.json', { type: 'json' }); } catch (e) { continue; }
    const body = (a && (a.answer || a.body)) || '';
    for (const s of enumerateProductSlots(body)) {
      slotTotal++;
      const p = parseMovieSlot(s.name);
      const key = p.slugYear || p.slug;
      if (key && !uniq.has(key)) uniq.set(key, p.raw);
    }
  }
  console.log('mv entries:', rows.length, '· total slots:', slotTotal, '· UNIQUE movies:', uniq.size);
  fs.writeFileSync('_mv_needed_titles.json', JSON.stringify([...uniq.entries()].map(([k, v]) => ({ slug: k, title: v })), null, 2));
  console.log('wrote _mv_needed_titles.json');
  console.log('sample:', [...uniq.values()].slice(0, 12).join(' | '));
})();
