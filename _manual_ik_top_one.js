'use strict';
// Manual ONE entry: set top internal (first non-face md image) = face card URL.
// Usage: node _manual_ik_top_one.js <id>
const fs = require('fs');
const path = require('path');
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
const id = String(process.argv[2] || '').trim();
if (!/^ik\d+/i.test(id)) {
  console.error('Usage: node _manual_ik_top_one.js <ikNNNN>');
  process.exit(1);
}
const faceUrl = '/assets/qa/' + id + '.jpg';
const facePath = path.join(WD, 'assets', 'qa', id + '.jpg');
const LOG = path.join(WD, '_ik_manual_top_log.jsonl');

(async () => {
  if (!fs.existsSync(facePath) || fs.statSync(facePath).size < 8000) {
    console.error('NO_FACE', id);
    process.exit(2);
  }
  const cur = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!cur) { console.error('NO_BLOB', id); process.exit(3); }
  let body = String(cur.answer || cur.body || '');
  const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = [...body.matchAll(re)];
  if (!matches.length) { console.error('NO_IMGS', id); process.exit(4); }
  let target = null;
  for (const m of matches) {
    const url = m[2].replace(/\?.*$/, '');
    if (url === faceUrl || url.endsWith('/' + id + '.jpg')) continue; // skip face hero
    target = m;
    break;
  }
  if (!target) {
    // no non-face image — insert face as top internal after first para/heading block
    console.log(id, 'NO_TOP_SLOT — will not invent without look; skip');
    process.exit(5);
  }
  const oldUrl = target[2];
  if (oldUrl.replace(/\?.*$/, '') === faceUrl) {
    console.log(id, 'ALREADY_FACE_DUPE');
    fs.appendFileSync(LOG, JSON.stringify({ id, at: Date.now(), status: 'already' }) + '\n');
    process.exit(0);
  }
  const alt = target[1] || (cur.question || id);
  const newMd = '![' + alt + '](' + faceUrl + ')';
  const idx = body.indexOf(target[0]);
  if (idx < 0) { console.error('INDEX', id); process.exit(6); }
  body = body.slice(0, idx) + newMd + body.slice(idx + target[0].length);
  await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { answer: body }));
  const row = { id, at: Date.now(), status: 'swapped', from: oldUrl.slice(0, 80), to: faceUrl, faceBytes: fs.statSync(facePath).size };
  fs.appendFileSync(LOG, JSON.stringify(row) + '\n');
  console.log(JSON.stringify(row));
})().catch((e) => { console.error(e); process.exit(1); });
