'use strict';
/**
 * Apply already-approved RA faces → top (same URL). NO Pexels.
 * Faces already in assets/qa/{id}.jpg from owner approval.
 */
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
const mos = JSON.parse(fs.readFileSync(path.join(WD, 'mosaic-pool-ra.json'), 'utf8'));
const st = JSON.parse(fs.readFileSync(path.join(WD, '_ra_topic_review_state.json'), 'utf8'));
const approved = st.approved || {};
const LOG = path.join(WD, '_ra_apply_approved_log.jsonl');
const PROG = path.join(WD, '_ra_apply_approved_progress.json');

function faceOk(id) {
  try { return fs.statSync(path.join(QA, id + '.jpg')).size > 8000; } catch (e) { return false; }
}

(async () => {
  let wrote = 0, noFace = 0, noAp = 0, skip = 0, errs = 0;
  const t0 = Date.now();
  console.log('[RA APPLY] approved', Object.keys(approved).length, 'mosaic', mos.length);
  for (const e of mos) {
    const id = e.id;
    const url = '/assets/qa/' + id + '.jpg';
    try {
      if (!approved[id]) { noAp++; continue; }
      if (!faceOk(id)) { noFace++; continue; }
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!cur) { skip++; continue; }
      const q = cur.question || e.question || id;
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
      fs.appendFileSync(LOG, JSON.stringify({ id, at: Date.now(), to: url }) + '\n');
      wrote++;
      if (wrote % 50 === 0) {
        const sec = ((Date.now() - t0) / 1000).toFixed(0);
        console.log('…', wrote + '/' + mos.length, id, sec + 's');
      }
    } catch (err) {
      errs++;
      console.log('ERR', id, String(err.message || err).slice(0, 80));
    }
  }
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    let changed = 0;
    for (const e of mos) {
      if (!approved[e.id] || !faceOk(e.id)) continue;
      const ent = (idx.entries || []).find((x) => x && String(x.id) === e.id);
      if (ent) {
        const url = '/assets/qa/' + e.id + '.jpg';
        if (ent.img !== url) { ent.img = url; ent.cover_src = 'pexels-topic'; changed++; }
      }
    }
    if (changed) await store.setJSON('_index.json', idx);
    console.log('index img sync', changed);
  } catch (e) {
    console.log('index err', e.message);
  }
  const prog = {
    at: new Date().toISOString(),
    wrote, noFace, noAp, skip, errs,
    sec: Math.round((Date.now() - t0) / 1000),
  };
  fs.writeFileSync(PROG, JSON.stringify(prog, null, 2));
  console.log(JSON.stringify(prog));
})().catch((e) => { console.error(e); process.exit(1); });
