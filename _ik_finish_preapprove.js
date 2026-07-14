'use strict';
// Keep remaining IK faces from stage/bank (owner: pre-approved)
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const flib = require('./_ddg_facecard_lib');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const QA = path.join(WD, 'assets', 'qa');
const STAGE = path.join(QA, '_ik_topic_stage');
const STATE_F = path.join(WD, '_ik_topic_review_state.json');
const mos = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-ik.json'), 'utf8'));
const st = JSON.parse(fs.readFileSync(STATE_F, 'utf8'));
if (!st.approved) st.approved = {};
const bankById = new Map((st.bank || []).map((r) => [r.id, r]));

(async () => {
  let kept = 0, skip = 0;
  for (const e of mos) {
    const id = e.id;
    if (st.approved[id]) continue;
    const stagePath = path.join(STAGE, id + '.jpg');
    const livePath = path.join(QA, id + '.jpg');
    let src = null;
    if (fs.existsSync(stagePath) && fs.statSync(stagePath).size > 5000) src = stagePath;
    else if (fs.existsSync(livePath) && fs.statSync(livePath).size > 20000) src = livePath;
    if (!src) { skip++; continue; }
    fs.copyFileSync(src, flib.coverPath(id));
    const sqStage = path.join(STAGE, id + '.sq.jpg');
    if (fs.existsSync(sqStage)) fs.copyFileSync(sqStage, path.join(QA, id + '.sq.jpg'));
    const meta = bankById.get(id) || {};
    st.approved[id] = {
      at: Date.now(),
      query: meta.query || '',
      mode: meta.mode || 'preapprove-finish',
      photoId: meta.photoId || '',
      preapproved: true,
    };
    try {
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      if (cur) {
        let body = cur.answer || cur.body || '';
        body = syncHeroDupesFaceCard(id, cur.question || e.question || id, body);
        await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
          answer: body,
          cover_src: 'pexels-topic',
          face_title_baked: false,
          img: '/assets/qa/' + id + '.jpg',
        }));
      }
    } catch (err) {}
    kept++;
  }
  // keep bank intact for future
  fs.writeFileSync(STATE_F, JSON.stringify(st, null, 1));
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    let n = 0;
    for (const ent of idx.entries || []) {
      if (!ent || !/^ik\d/i.test(String(ent.id))) continue;
      if (!st.approved[ent.id]) continue;
      ent.img = '/assets/qa/' + ent.id + '.jpg';
      ent.cover_src = 'pexels-topic';
      n++;
    }
    await store.setJSON('_index.json', idx);
    console.log('[ik-finish] index stamped', n);
  } catch (e) { console.log('[ik-finish] index', e.message); }
  console.log('[ik-finish] kept', kept, 'skip', skip, 'approved', Object.keys(st.approved).length, 'bank', (st.bank || []).length);
})().catch((e) => { console.error(e); process.exit(1); });
