// _st_preapprove_rest.js — owner: rest are pre-approved — auto-keep remaining ST faces + face/top same URL.
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
const { queryForSalesTraining, ST_GROUP_QUERIES, PEOPLE_FALLBACK } = require('./_gp_topic_image_queries');
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');

const QA = path.join(WD, 'assets', 'qa');
const STAGE = path.join(QA, '_st_topic_stage');
const STATE_F = path.join(WD, '_st_topic_review_state.json');
const LOG = path.join(WD, '_st_preapprove_rest.log');
const BANK_TARGET = 320;
const PEXELS = process.env.PEXELS_API_KEY || '';
const BOX = 760;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function saveJSON(f, o) { fs.writeFileSync(f, JSON.stringify(o, null, 1)); }
function log(line) {
  const s = String(line);
  console.log(s);
  try { fs.appendFileSync(LOG, s + '\n'); } catch (e) {}
}
try { fs.mkdirSync(STAGE, { recursive: true }); } catch (e) {}

function fileFromSrc(srcUrl) {
  let src = String(srcUrl || '');
  if (src.startsWith('file:///')) {
    src = decodeURIComponent(src.replace(/^file:\/\/\//, '')).replace(/\//g, path.sep);
  }
  return src;
}

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
  const meta = queryForSalesTraining(title) || {};
  const extras = Array.isArray(ST_GROUP_QUERIES) ? ST_GROUP_QUERIES.slice(0, 4) : [];
  const queries = [meta.query, ...extras, PEOPLE_FALLBACK].filter(Boolean);
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

async function ensureBufFromRow(row) {
  const stagePath = path.join(STAGE, row.id + '.jpg');
  if (fs.existsSync(stagePath) && fs.statSync(stagePath).size > 5000) {
    return fs.readFileSync(stagePath);
  }
  const local = fileFromSrc(row.srcUrl);
  if (local && fs.existsSync(local) && fs.statSync(local).size > 5000) {
    return fs.readFileSync(local);
  }
  const url = String(row.srcUrl || '');
  if (/^https?:\/\//i.test(url)) {
    const ir = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!ir.ok) return null;
    const buf = Buffer.from(await ir.arrayBuffer());
    if (buf.length < 8000) return null;
    return buf;
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
  try {
    fs.appendFileSync(path.join(WD, '_st_face_tops_log.jsonl'), JSON.stringify({
      id, at: Date.now(), status: 'face+top-same', to: '/assets/qa/' + id + '.jpg', preapprove: true,
    }) + '\n');
  } catch (e) {}
  return true;
}

(async () => {
  try { fs.writeFileSync(LOG, ''); } catch (e) {}
  const st = loadJSON(STATE_F, {
    approved: {}, trashed: {}, usedPhotos: {}, usedHashes: {}, usedAHashes: [],
    zoomQueue: {}, bank: [], cursor: 0, batch: null, startedAt: Date.now(),
  });
  if (!st.approved) st.approved = {};
  if (!st.usedPhotos) st.usedPhotos = {};
  if (!Array.isArray(st.bank)) st.bank = [];

  const mos = loadJSON(path.join(WD, 'mosaic-pool-st.json'), []);
  const all = (mos.length ? mos : []).map((e) => ({
    id: String(e.id),
    title: e.question || e.title || e.id,
  }));
  if (!all.length) {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    for (const e of (idx.entries || [])) {
      if (e && e.id && /^st\d/i.test(String(e.id))) {
        all.push({ id: String(e.id), title: e.question || e.title || e.id });
      }
    }
    all.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  }

  log('[st-pre] total ' + all.length + ' already approved ' + Object.keys(st.approved).length);

  const stagedMeta = new Map();
  for (const row of st.bank || []) stagedMeta.set(row.id, row);
  if (st.batch && Array.isArray(st.batch.items)) {
    for (const row of st.batch.items) stagedMeta.set(row.id, row);
  }

  let kept = 0;
  for (const e of all) {
    if (st.approved[e.id]) continue;
    const meta = stagedMeta.get(e.id) || { title: e.title };
    let stagePath = path.join(STAGE, e.id + '.jpg');
    if (!fs.existsSync(stagePath) || fs.statSync(stagePath).size < 5000) {
      const buf = await ensureBufFromRow(Object.assign({ id: e.id }, meta));
      if (buf) await writeFramed(e.id, buf);
    }
    if (fs.existsSync(stagePath) && fs.statSync(stagePath).size > 5000) {
      const ok = await keepItem(st, e.id, Object.assign({ title: e.title }, meta));
      if (ok) {
        kept++;
        if (kept % 25 === 0) {
          saveJSON(STATE_F, st);
          log('[st-pre] kept staged ' + kept + ' ' + e.id);
        }
      }
    }
  }
  st.bank = [];
  st.batch = null;
  saveJSON(STATE_F, st);
  log('[st-pre] kept from stage/bank ' + kept + ' · approved now ' + Object.keys(st.approved).length);

  const used = new Set(Object.keys(st.usedPhotos || {}));
  let made = 0, fail = 0;
  for (const e of all) {
    if (st.approved[e.id]) continue;
    process.stdout.write('[st-pre] ' + e.id + ' … ');
    const picked = await pickPhoto(e.title, used);
    if (!picked) { log('FAIL no photo'); fail++; continue; }
    await writeFramed(e.id, picked.buf);
    const ok = await keepItem(st, e.id, {
      title: e.title,
      query: picked.query,
      mode: 'preapprove',
      photoId: picked.photoId,
    });
    if (ok) {
      made++;
      log('ok photo ' + picked.photoId + ' · approved ' + Object.keys(st.approved).length + '/' + all.length);
      if (made % 10 === 0) saveJSON(STATE_F, st);
    } else {
      log('FAIL keep');
      fail++;
    }
    await sleep(200);
  }
  saveJSON(STATE_F, st);
  log('[st-pre] faces done approved ' + Object.keys(st.approved).length + ' new ' + made + ' fail ' + fail);

  // reserve bank for future
  const used2 = new Set(Object.keys(st.usedPhotos || {}));
  let bi = 0;
  const pool = all.slice();
  while ((st.bank || []).length < BANK_TARGET && bi < pool.length * 4) {
    const e = pool[bi % pool.length];
    bi++;
    if (st.bank.some((x) => x.id === e.id)) continue;
    process.stdout.write('[bank] ' + e.id + ' … ');
    const picked = await pickPhoto(e.title, used2);
    if (!picked) { log('FAIL'); continue; }
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
    log('bank ' + st.bank.length + '/' + BANK_TARGET);
    if (st.bank.length % 10 === 0) saveJSON(STATE_F, st);
    await sleep(150);
  }
  saveJSON(STATE_F, st);

  try {
    const index = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    let n = 0;
    for (const ent of index.entries || []) {
      if (!ent || !/^st\d/i.test(String(ent.id))) continue;
      if (!st.approved[ent.id]) continue;
      ent.img = '/assets/qa/' + ent.id + '.jpg';
      ent.cover_src = 'pexels-topic';
      n++;
    }
    await store.setJSON('_index.json', index);
    log('[st-pre] index stamped ' + n);
  } catch (e) {
    log('[st-pre] index stamp fail ' + (e.message || e));
  }

  log('[st-pre] DONE approved ' + Object.keys(st.approved).length + ' bank ' + (st.bank || []).length);
})().catch((e) => { console.error(e); process.exit(1); });
