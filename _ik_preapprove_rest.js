// _ik_preapprove_rest.js — owner: rest are pre-approved — auto-keep all remaining IK faces, then top bank to 320.
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const flib = require('./_ddg_facecard_lib');
const { queryForTitle, subjectFromTitle, PEOPLE_FALLBACK } = require('./_gp_topic_image_queries');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');

const QA = path.join(WD, 'assets', 'qa');
const STAGE = path.join(QA, '_ik_topic_stage');
const STATE_F = path.join(WD, '_ik_topic_review_state.json');
const BANK_TARGET = 320;
const PEXELS = process.env.PEXELS_API_KEY || '';
const BOX = 760;

function loadJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function saveJSON(f, o) { fs.writeFileSync(f, JSON.stringify(o, null, 1)); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try { fs.mkdirSync(STAGE, { recursive: true }); } catch (e) {}

async function writeFramed(id, buf) {
  const stagePath = path.join(STAGE, id + '.jpg');
  const stageSq = path.join(STAGE, id + '.sq.jpg');
  const rawPath = path.join(STAGE, id + '.raw.jpg');
  fs.writeFileSync(rawPath, buf);
  const rotated = await sharp(buf).rotate().toBuffer();
  await sharp({
    create: { width: BOX, height: BOX, channels: 3, background: { r: 0, g: 0, b: 0 } },
  }).composite([{
    input: await sharp(rotated).resize(BOX, BOX, { fit: 'inside', withoutEnlargement: false })
      .jpeg({ quality: 90, mozjpeg: true }).toBuffer(),
    gravity: 'centre',
  }]).jpeg({ quality: 86, mozjpeg: true }).toFile(stageSq);
  await flib.gradeFaceCardFromBuffer(rotated, stagePath, {
    question: '',
    cropPosition: 'centre',
    fit: 'contain',
  });
  return { stagePath, stageSq };
}

async function pexelsSearch(query, page) {
  if (!PEXELS) return [];
  const url = 'https://api.pexels.com/v1/search?per_page=30&orientation=square'
    + '&page=' + page + '&query=' + encodeURIComponent(query);
  const r = await fetch(url, { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) return [];
  const j = await r.json();
  const out = [];
  for (const p of j.photos || []) {
    if (!p || !p.id || p.width < 800) continue;
    const u = (p.src && (p.src.original || p.src.large2x || p.src.large)) || '';
    if (u) out.push({ id: String(p.id), url: u });
  }
  return out;
}

async function pickPhoto(title, used) {
  const meta = queryForTitle(title);
  const subject = meta.subject || subjectFromTitle(title);
  const queries = [meta.query, subject ? subject + ' people working' : '', PEOPLE_FALLBACK].filter(Boolean);
  for (const q of queries) {
    for (let page = 1; page <= 4; page++) {
      const hits = await pexelsSearch(q, page);
      for (const h of hits) {
        if (used.has(h.id)) continue;
        try {
          const ir = await fetch(h.url, { signal: AbortSignal.timeout(30000) });
          if (!ir.ok) continue;
          const buf = Buffer.from(await ir.arrayBuffer());
          if (buf.length < 8000) continue;
          used.add(h.id);
          return { photoId: h.id, srcUrl: h.url, query: q, buf };
        } catch (e) {}
      }
      if (!hits.length) break;
    }
  }
  return null;
}

async function keepItem(st, id, meta) {
  const stagePath = path.join(STAGE, id + '.jpg');
  const stageSq = path.join(STAGE, id + '.sq.jpg');
  if (!fs.existsSync(stagePath) || fs.statSync(stagePath).size < 5000) return false;
  fs.copyFileSync(stagePath, flib.coverPath(id));
  if (fs.existsSync(stageSq)) fs.copyFileSync(stageSq, path.join(QA, id + '.sq.jpg'));
  st.approved[id] = {
    at: Date.now(),
    query: (meta && meta.query) || '',
    mode: (meta && meta.mode) || 'preapprove',
    photoId: (meta && meta.photoId) || '',
    preapproved: true,
  };
  if (meta && meta.photoId) st.usedPhotos[String(meta.photoId)] = id;
  delete st.trashed[id];
  delete st.zoomQueue[id];
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) {
      let body = cur.answer || cur.body || '';
      body = syncHeroDupesFaceCard(id, cur.question || (meta && meta.title) || id, body);
      await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
        answer: body,
        cover_src: 'pexels-topic',
        face_title_baked: false,
        img: '/assets/qa/' + id + '.jpg',
      }));
    }
  } catch (e) {}
  return true;
}

(async () => {
  const st = loadJSON(STATE_F, {
    approved: {}, trashed: {}, usedPhotos: {}, usedHashes: {}, usedAHashes: [],
    zoomQueue: {}, bank: [], cursor: 0, batch: null, startedAt: Date.now(),
  });
  if (!st.approved) st.approved = {};
  if (!st.usedPhotos) st.usedPhotos = {};
  if (!Array.isArray(st.bank)) st.bank = [];

  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const all = (idx.entries || [])
    .filter((e) => e && e.id && /^ik\d/i.test(String(e.id)))
    .map((e) => ({ id: String(e.id), title: e.question || e.title || e.id }))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  console.log('[ik-pre] total', all.length, 'already approved', Object.keys(st.approved).length);

  // 1) Keep anything already staged (bank + leftover stage files)
  const stagedMeta = new Map();
  for (const row of st.bank || []) stagedMeta.set(row.id, row);
  if (st.batch && Array.isArray(st.batch.items)) {
    for (const row of st.batch.items) stagedMeta.set(row.id, row);
  }

  let kept = 0;
  for (const e of all) {
    if (st.approved[e.id]) continue;
    const meta = stagedMeta.get(e.id) || { title: e.title };
    const stagePath = path.join(STAGE, e.id + '.jpg');
    if (fs.existsSync(stagePath) && fs.statSync(stagePath).size > 5000) {
      const ok = await keepItem(st, e.id, Object.assign({ title: e.title }, meta));
      if (ok) { kept++; if (kept % 25 === 0) console.log('[ik-pre] kept staged', kept, e.id); }
    }
  }
  st.bank = [];
  st.batch = null;
  saveJSON(STATE_F, st);
  console.log('[ik-pre] kept from stage', kept, '· approved now', Object.keys(st.approved).length);

  // 2) Stage + keep remaining faces
  const used = new Set(Object.keys(st.usedPhotos || {}));
  let made = 0, fail = 0;
  for (const e of all) {
    if (st.approved[e.id]) continue;
    process.stdout.write('[ik-pre] ' + e.id + ' … ');
    const picked = await pickPhoto(e.title, used);
    if (!picked) { console.log('FAIL no photo'); fail++; continue; }
    await writeFramed(e.id, picked.buf);
    const ok = await keepItem(st, e.id, {
      title: e.title,
      query: picked.query,
      mode: 'preapprove',
      photoId: picked.photoId,
    });
    if (ok) {
      made++;
      console.log('ok photo', picked.photoId, '· approved', Object.keys(st.approved).length + '/' + all.length);
      if (made % 10 === 0) saveJSON(STATE_F, st);
    } else {
      console.log('FAIL keep');
      fail++;
    }
    await sleep(200);
  }
  saveJSON(STATE_F, st);
  console.log('[ik-pre] faces done approved', Object.keys(st.approved).length, 'new', made, 'fail', fail);

  // 3) Top bank to 320 for future (stage only — not approved)
  const needBank = Math.max(0, BANK_TARGET - (st.bank || []).length);
  console.log('[ik-pre] topping bank need', needBank);
  // Prefer unused ik ids first; if all approved, restage from approved titles for generator feed
  const bankPool = all.filter((e) => !stagedMeta.has(e.id));
  const pool = bankPool.length ? bankPool : all;
  let bi = 0;
  while ((st.bank || []).length < BANK_TARGET && bi < pool.length * 3) {
    const e = pool[bi % pool.length];
    bi++;
    if (st.bank.some((x) => x.id === e.id)) continue;
    process.stdout.write('[bank] ' + e.id + ' … ');
    const picked = await pickPhoto(e.title, used);
    if (!picked) { console.log('FAIL'); continue; }
    await writeFramed(e.id, picked.buf);
    st.bank.push({
      id: e.id,
      title: e.title,
      query: picked.query,
      mode: 'bank-reserve',
      photoId: picked.photoId,
      srcUrl: picked.srcUrl,
      proposed: '/stage/' + e.id + '.jpg',
      browse: '/browse/' + e.id + '.sq.jpg',
    });
    st.usedPhotos[String(picked.photoId)] = 'bank:' + e.id;
    console.log('bank', st.bank.length + '/' + BANK_TARGET);
    if (st.bank.length % 10 === 0) saveJSON(STATE_F, st);
    await sleep(150);
  }
  saveJSON(STATE_F, st);

  // index stamp (one write)
  try {
    const index = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    let n = 0;
    for (const ent of index.entries || []) {
      if (!ent || !/^ik\d/i.test(String(ent.id))) continue;
      if (!st.approved[ent.id]) continue;
      ent.img = '/assets/qa/' + ent.id + '.jpg';
      ent.cover_src = 'pexels-topic';
      n++;
    }
    await store.setJSON('_index.json', index);
    console.log('[ik-pre] index stamped', n);
  } catch (e) {
    console.log('[ik-pre] index stamp fail', e.message || e);
  }

  console.log('[ik-pre] DONE approved', Object.keys(st.approved).length, 'bank', (st.bank || []).length);
})().catch((e) => { console.error(e); process.exit(1); });
