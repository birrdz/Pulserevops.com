'use strict';
// Force-overwrite all KEPT GTM faces from stage .raw → clean untitled 760 square → assets/qa + deploy-clean
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
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');

const QA = path.join(WD, 'assets', 'qa');
const STAGE = path.join(QA, '_gp_topic_stage');
const NEW = path.join(QA, '_gp_new_preview');
const DEPLOY = 'C:/Users/koryj/pulse-deploy-clean/assets/qa';
const BOX = 760;
const vote = JSON.parse(fs.readFileSync(path.join(WD, '_gp_old_new_approve_state.json'), 'utf8'));
const ids = Object.keys(vote.kept || {}).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

try { fs.mkdirSync(DEPLOY, { recursive: true }); } catch (e) {}
try { fs.mkdirSync(NEW, { recursive: true }); } catch (e) {}

async function writeCleanSquare(dest, buf) {
  const rotated = await sharp(buf).rotate().toBuffer();
  // Untitled square — whole photo contain, black letterbox. NO gold title bake.
  await sharp({
    create: { width: BOX, height: BOX, channels: 3, background: { r: 0, g: 0, b: 0 } },
  }).composite([{
    input: await sharp(rotated).resize(BOX, BOX, { fit: 'inside', withoutEnlargement: false }).jpeg({ quality: 90, mozjpeg: true }).toBuffer(),
    gravity: 'centre',
  }]).jpeg({ quality: 86, mozjpeg: true }).toFile(dest);
}

(async () => {
  console.log('[gtm-overwrite] kept=' + ids.length);
  let ok = 0, fail = 0, blobN = 0;
  for (const id of ids) {
    try {
      const rawPath = path.join(STAGE, id + '.raw.jpg');
      const stagePath = path.join(STAGE, id + '.jpg');
      let buf;
      if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 5000) buf = fs.readFileSync(rawPath);
      else if (fs.existsSync(stagePath)) buf = fs.readFileSync(stagePath);
      else throw new Error('no source');

      const live = path.join(QA, id + '.jpg');
      const preview = path.join(NEW, id + '.jpg');
      const dep = path.join(DEPLOY, id + '.jpg');
      await writeCleanSquare(live, buf);
      fs.copyFileSync(live, preview);
      fs.copyFileSync(live, dep);
      ok++;

      // hero markdown = same face path (no second image)
      try {
        const blob = await store.get('answers/' + id + '.json', { type: 'json' });
        if (blob && blob.answer) {
          const q = blob.question || blob.h1 || blob.title || id;
          blob.answer = syncHeroDupesFaceCard(id, q, blob.answer);
          blob.img = '/assets/qa/' + id + '.jpg';
          blob.cover_src = 'pexels-topic';
          blob.face_title_baked = false;
          await store.setJSON('answers/' + id + '.json', blob);
          blobN++;
        }
      } catch (e) {}

      if (ok % 40 === 0) console.log('  … ' + ok + '/' + ids.length);
    } catch (e) {
      fail++;
      console.log('  FAIL ' + id + ' ' + e.message);
    }
  }

  // stamp index img paths
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    let n = 0;
    for (const e of (idx.entries || [])) {
      if (e && e.id && vote.kept[e.id]) {
        e.img = '/assets/qa/' + e.id + '.jpg';
        e.cover_src = 'pexels-topic';
        e.face_title_baked = false;
        n++;
      }
    }
    await store.setJSON('_index.json', idx);
    console.log('[gtm-overwrite] index stamped', n);
  } catch (e) {
    console.log('[gtm-overwrite] index warn', e.message);
  }

  console.log(JSON.stringify({ ok, fail, blobN, done: true }));
})().catch((e) => { console.error(e); process.exit(1); });
