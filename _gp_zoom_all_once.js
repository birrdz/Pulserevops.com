'use strict';
// One-shot: zoom-out all GTM new previews from .raw.jpg → 760 square contain
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const flib = require('./_ddg_facecard_lib');
const NEW_DIR = path.join(WD, 'assets', 'qa', '_gp_new_preview');
const STAGE = path.join(WD, 'assets', 'qa', '_gp_topic_stage');
const BOX = 760;

async function writeSquare(dest, buf) {
  const rotated = await sharp(buf).rotate().toBuffer();
  await sharp({
    create: { width: BOX, height: BOX, channels: 3, background: { r: 0, g: 0, b: 0 } },
  }).composite([{
    input: await sharp(rotated).resize(BOX, BOX, { fit: 'inside', withoutEnlargement: false }).jpeg({ quality: 90 }).toBuffer(),
    gravity: 'centre',
  }]).jpeg({ quality: 86, mozjpeg: true }).toFile(dest);
}

(async () => {
  const ids = fs.readdirSync(NEW_DIR)
    .filter((n) => /^gp\d+\.jpg$/i.test(n))
    .map((n) => n.replace(/\.jpg$/i, ''));
  console.log('[zoom-all] ' + ids.length);
  let ok = 0, fail = 0;
  for (const id of ids) {
    try {
      let raw = path.join(NEW_DIR, id + '.raw.jpg');
      if (!fs.existsSync(raw) || fs.statSync(raw).size < 5000) {
        const alt = path.join(STAGE, id + '.raw.jpg');
        if (fs.existsSync(alt)) raw = alt;
      }
      if (!fs.existsSync(raw) || fs.statSync(raw).size < 5000) {
        // fall back to current new file as source
        raw = path.join(NEW_DIR, id + '.jpg');
      }
      const buf = fs.readFileSync(raw);
      await writeSquare(path.join(NEW_DIR, id + '.jpg'), buf);
      ok++;
      if (ok % 50 === 0) console.log('  … ' + ok + '/' + ids.length);
    } catch (e) {
      fail++;
      console.log('  fail ' + id + ' ' + e.message);
    }
  }
  console.log(JSON.stringify({ ok, fail, done: true }));
})().catch((e) => { console.error(e); process.exit(1); });
