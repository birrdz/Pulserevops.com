'use strict';
// Face card URL → top internal same URL → next. Approved faces only.
// Usage: node _manual_ik_face_top_same.js [startIdx=0] [limit=0]
const fs = require('fs');
const path = require('path');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const QA = path.join(WD, 'assets', 'qa');
const LOG = path.join(WD, '_ik_manual_top_log.jsonl');
const PROG = path.join(WD, '_ik_manual_top_progress.json');
const start = Math.max(0, parseInt(process.argv[2] || '0', 10) || 0);
const limit = Math.max(0, parseInt(process.argv[3] || '0', 10) || 0);

function faceOk(id) {
  try { return fs.statSync(path.join(QA, id + '.jpg')).size > 8000; } catch (e) { return false; }
}

(async () => {
  const mos = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-ik.json'), 'utf8'));
  const st = JSON.parse(fs.readFileSync(path.join(WD, '_ik_topic_review_state.json'), 'utf8'));
  let slice = mos.slice(start);
  if (limit) slice = slice.slice(0, limit);
  let wrote = 0, skip = 0, noFace = 0, errs = 0;
  for (let i = 0; i < slice.length; i++) {
    const id = slice[i].id;
    const url = '/assets/qa/' + id + '.jpg';
    try {
      if (!st.approved[id]) { skip++; continue; }
      if (!faceOk(id)) { noFace++; continue; }
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!cur) { skip++; continue; }
      const q = cur.question || slice[i].question || id;
      // 1) face card path stamped  2) top internal/hero = SAME url
      let body = syncHeroDupesFaceCard(id, q, String(cur.answer || cur.body || ''));
      // also replace first remaining pollinations top-internal with same face url
      const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
      const ms = [...body.matchAll(re)];
      for (const m of ms) {
        const u = m[2].replace(/\?.*$/, '');
        if (u === url || u.endsWith('/' + id + '.jpg')) continue;
        // first non-face → same approved face
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
      fs.appendFileSync(LOG, JSON.stringify({ id, at: Date.now(), status: 'swapped', to: url, mode: 'face+top-same' }) + '\n');
      wrote++;
      if (wrote % 50 === 0) console.log('…', wrote, '/', slice.length, id);
    } catch (e) {
      errs++;
      console.log('ERR', id, String(e.message || e).slice(0, 80));
    }
  }
  const done = mos.filter((e) => faceOk(e.id) && st.approved[e.id]).length;
  const prog = { at: new Date().toISOString(), total: mos.length, wrote, skip, noFace, errs, mode: 'face+top-same-url' };
  fs.writeFileSync(PROG, JSON.stringify(prog, null, 2));
  console.log(JSON.stringify(prog));
})().catch((e) => { console.error(e); process.exit(1); });
