// delete the recent (2026-07-15) ACG + Chief company batch — blob + _index, no deploy
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN });
const DAY = '2026-07-15';
(async () => {
  const cand = JSON.parse(fs.readFileSync(WD + '/new/_del_candidates.json', 'utf8'));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = Object.fromEntries(idx.entries.map(e => [e.id, e]));
  const all = [...cand.acg, ...cand.chief];
  const del = all.filter(id => { const e = byId[id]; return e && new Date(e.ts || 0).toISOString().slice(0, 10) === DAY; });
  console.log('deleting', del.length, 'entries dated', DAY);
  let ok = 0;
  for (const id of del) {
    try { await store.delete('answers/' + id + '.json'); } catch (e) {}
    try { await store.delete('qa-bin/' + id + '.jpg'); } catch (e) {}
    try { await store.delete('qa-bin/' + id + '.sq.jpg'); } catch (e) {}
    ok++;
  }
  const before = idx.entries.length;
  const set = new Set(del);
  idx.entries = idx.entries.filter(e => !(e && set.has(e.id)));
  await store.setJSON('_index.json', idx);
  console.log('blobs removed:', ok, '· _index', before, '→', idx.entries.length);
  fs.writeFileSync(WD + '/new/_deleted_' + DAY + '.json', JSON.stringify(del, null, 1));
  console.log('deleted id list saved → new/_deleted_' + DAY + '.json');
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
