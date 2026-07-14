'use strict';
// Fast Pexels bank top-off for Industry KPIs (owner: use pexels quickly bank)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const flib = require('./_ddg_facecard_lib');
const { queryForTitle, subjectFromTitle, PEOPLE_FALLBACK } = require('./_gp_topic_image_queries');

const QA = path.join(WD, 'assets', 'qa');
const STAGE = path.join(QA, '_ik_topic_stage');
const STATE_F = path.join(WD, '_ik_topic_review_state.json');
const TARGET = parseInt(process.env.TOPIC_BANK || '320', 10) || 320;
const PEXELS = process.env.PEXELS_API_KEY || '';
const BOX = 760;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try { fs.mkdirSync(STAGE, { recursive: true }); } catch (e) {}

function loadJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function saveJSON(f, o) { fs.writeFileSync(f, JSON.stringify(o, null, 1)); }

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
      .jpeg({ quality: 88, mozjpeg: true }).toBuffer(),
    gravity: 'centre',
  }]).jpeg({ quality: 84, mozjpeg: true }).toFile(stageSq);
  await flib.gradeFaceCardFromBuffer(rotated, stagePath, {
    question: '',
    cropPosition: 'centre',
    fit: 'contain',
  });
}

async function pexelsSearch(query, page) {
  if (!PEXELS) throw new Error('no PEXELS_API_KEY');
  const url = 'https://api.pexels.com/v1/search?per_page=40&orientation=square'
    + '&page=' + page + '&query=' + encodeURIComponent(query);
  const r = await fetch(url, { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(25000) });
  if (!r.ok) return [];
  const j = await r.json();
  const out = [];
  for (const p of j.photos || []) {
    if (!p || !p.id || p.width < 600) continue;
    const u = (p.src && (p.src.large2x || p.src.large || p.src.original)) || '';
    if (u) out.push({ id: String(p.id), url: u });
  }
  return out;
}

async function pickFast(title, used) {
  const meta = queryForTitle(title);
  const subject = meta.subject || subjectFromTitle(title);
  const queries = [
    meta.query,
    subject ? subject + ' people working' : '',
    PEOPLE_FALLBACK,
    'business professionals working office',
    'industry workers professionals',
  ].filter(Boolean);
  for (const q of queries) {
    for (let page = 1; page <= 3; page++) {
      let hits = [];
      try { hits = await pexelsSearch(q, page); } catch (e) { continue; }
      for (const h of hits) {
        if (used.has(h.id)) continue;
        try {
          const ir = await fetch(h.url, { signal: AbortSignal.timeout(25000) });
          if (!ir.ok) continue;
          const buf = Buffer.from(await ir.arrayBuffer());
          if (buf.length < 6000) continue;
          used.add(h.id);
          return { photoId: h.id, srcUrl: h.url, query: q, buf };
        } catch (e) {}
      }
      if (!hits.length) break;
      await sleep(80);
    }
  }
  return null;
}

(async () => {
  if (!PEXELS) { console.error('[ik-bank] NO PEXELS_API_KEY'); process.exit(1); }
  const st = loadJSON(STATE_F, { approved: {}, bank: [], usedPhotos: {} });
  if (!Array.isArray(st.bank)) st.bank = [];
  if (!st.usedPhotos) st.usedPhotos = {};

  const mos = loadJSON(path.join(WD, 'mosaic-pool-ik.json'), []);
  const pool = mos.length ? mos : Object.keys(st.approved || {}).map((id) => ({ id, question: id }));
  const used = new Set(Object.keys(st.usedPhotos));
  for (const row of st.bank) if (row.photoId) used.add(String(row.photoId));

  console.log('[ik-bank] start', st.bank.length, '/', TARGET, '· pool', pool.length);
  let i = 0;
  let failStreak = 0;
  while (st.bank.length < TARGET) {
    const e = pool[i % pool.length];
    i++;
    const id = String(e.id || e);
    const title = e.question || e.title || id;
    if (st.bank.some((x) => x.id === id)) {
      if (i > pool.length * 5) break;
      continue;
    }
    process.stdout.write('[bank] ' + id + ' … ');
    const picked = await pickFast(title, used);
    if (!picked) {
      console.log('FAIL');
      failStreak++;
      if (failStreak > 40) { console.log('[ik-bank] too many fails — stop'); break; }
      continue;
    }
    failStreak = 0;
    await writeFramed(id, picked.buf);
    st.bank.push({
      id,
      title,
      query: picked.query,
      mode: 'pexels-fast-bank',
      photoId: picked.photoId,
      srcUrl: picked.srcUrl,
      proposed: '/stage/' + id + '.jpg',
      browse: '/browse/' + id + '.sq.jpg',
    });
    st.usedPhotos[String(picked.photoId)] = 'bank:' + id;
    console.log('ok', picked.photoId, '·', st.bank.length + '/' + TARGET);
    if (st.bank.length % 10 === 0) saveJSON(STATE_F, st);
    await sleep(100);
  }
  saveJSON(STATE_F, st);
  console.log('[ik-bank] DONE bank', st.bank.length, '/', TARGET);
})().catch((e) => { console.error(e); process.exit(1); });
