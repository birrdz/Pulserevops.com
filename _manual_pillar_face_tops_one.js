'use strict';
// PILLAR X FACE/TOPS — ONE entry only (no shortcuts).
// Usage: node _manual_pillar_face_tops_one.js <pillar> <id>
// Bulk whole-pillar: only with passcode 4444 as 4th arg (owner override).
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const { assertNoShortcuts } = require('./_no_shortcuts_image_law');

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

const pillar = String(process.argv[2] || '').toLowerCase().replace(/[^a-z]/g, '');
const idArg = String(process.argv[3] || '').trim();
const pass = String(process.argv[4] || '');

if (!pillar || !idArg) {
  console.error('Usage: node _manual_pillar_face_tops_one.js <pillar> <id>');
  console.error('  (one id only — no shortcuts)');
  process.exit(2);
}

assertNoShortcuts({ id: idArg, passcode: pass });

const id = idArg;
const QA = path.join(WD, 'assets', 'qa');
const LOG = path.join(WD, '_' + pillar + '_face_tops_log.jsonl');
const facePath = path.join(QA, id + '.jpg');
const url = '/assets/qa/' + id + '.jpg';

function faceOk() {
  try { return fs.statSync(facePath).size > 8000; } catch (e) { return false; }
}

(async () => {
  if (!faceOk()) {
    console.error('NO_FACE', id);
    process.exit(4);
  }
  const cur = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!cur) {
    console.error('NO_BLOB', id);
    process.exit(5);
  }
  const q = cur.question || cur.title || id;
  let body = syncHeroDupesFaceCard(id, q, String(cur.answer || cur.body || ''));
  const ms = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  for (const m of ms) {
    const u = m[2].replace(/\?.*$/, '');
    if (u === url || u.endsWith('/' + id + '.jpg')) continue;
    const alt = m[1] || q;
    const idx = body.indexOf(m[0]);
    if (idx >= 0) {
      body = body.slice(0, idx) + '![' + alt + '](' + url + ')' + body.slice(idx + m[0].length);
    }
    break;
  }
  await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
    answer: body,
    img: url,
    cover_src: cur.cover_src || 'pexels-topic',
    face_title_baked: false,
  }));
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const ent = (idx.entries || []).find((x) => x && String(x.id) === id);
    if (ent) {
      ent.img = url;
      ent.cover_src = 'pexels-topic';
      await store.setJSON('_index.json', idx);
    }
  } catch (e) {}
  fs.appendFileSync(LOG, JSON.stringify({ id, at: Date.now(), status: 'face+top-same', to: url, manual: true }) + '\n');
  console.log(JSON.stringify({ ok: true, id, title: String(q).slice(0, 100), face: url }));
})().catch((e) => { console.error(e); process.exit(1); });
