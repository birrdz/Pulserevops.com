'use strict';
/** One-shot: strip baked gold titles from face cards for given ids (or recent sk from fix_progress). */
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sharp = require('sharp');
const { getStore } = require('@netlify/blobs');
const flib = require('./_ddg_facecard_lib');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN
});

function walkJpg(root, out) {
  if (!fs.existsSync(root)) return;
  for (const n of fs.readdirSync(root)) {
    const p = root + '/' + n;
    try {
      const st = fs.statSync(p);
      if (st.isDirectory()) walkJpg(p, out);
      else if (/\.jpe?g$/i.test(n) && st.size > 8000) out.push(p);
    } catch (e) {}
  }
}
const pexels = [];
walkJpg(WD + '/assets/qa/_pexels_stored', pexels);
const pool = [];
walkJpg(WD + '/assets/qa/_facecard_pool', pool);
const donorsAll = pexels.length ? pexels : pool;

async function hasBake(file) {
  try {
    const { data, info } = await sharp(file).resize(120, 160, { fit: 'fill' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let gold = 0, n = 0;
    const y0 = Math.floor(info.height * 0.55);
    for (let y = y0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      n++;
      if (r > 160 && g > 120 && b < 100 && r > b + 60) gold++;
    }
    return (gold / Math.max(1, n)) > 0.05;
  } catch (e) { return true; }
}

async function fixOne(id) {
  const cp = flib.coverPath(id);
  let need = false;
  try { if (fs.statSync(cp).size < 8000) need = true; } catch (e) { need = true; }
  if (!need) need = await hasBake(cp);
  if (!need) return 'clean';
  if (!donorsAll.length) return 'no-donors';
  const prefix = String(id).replace(/\d.*$/, '').toLowerCase();
  let donors = pool.filter(f => f.replace(/\\/g, '/').includes('/' + prefix + '/'));
  if (!donors.length) donors = donorsAll;
  const seed = [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const buf = fs.readFileSync(donors[seed % donors.length]);
  await flib.gradeFaceCardFromBuffer(buf, cp, { question: '', goldTitle: '' });
  try {
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cover_src: 'pexels-stored', face_title_baked: false }));
  } catch (e) {}
  try {
    const idx = await store.get('_index.json', { type: 'json' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent) {
      ent.img = '/assets/qa/' + id + '.jpg';
      ent.cover_src = 'pexels-stored';
      ent.face_title_baked = false;
      await store.setJSON('_index.json', idx);
    }
  } catch (e) {}
  const still = await hasBake(cp);
  return still ? 'replaced-but-still-gold?' : 'replaced';
}

(async () => {
  let ids = process.argv.slice(2);
  if (!ids.length) {
    const prog = JSON.parse(fs.readFileSync(WD + '/sim/fix_progress.json', 'utf8'));
    ids = Object.keys(prog).filter(k => /^sk/i.test(k) && prog[k] && (prog[k].status === 'approved' || prog[k].status === 'fixing'));
  }
  console.log('donors pexels=' + pexels.length + ' pool=' + pool.length + ' ids=' + ids.length);
  for (const id of ids) {
    const r = await fixOne(id);
    console.log(id + ' ' + r);
  }
})().catch(e => { console.error(e); process.exit(1); });
