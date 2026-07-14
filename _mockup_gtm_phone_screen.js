// Phone-frame mosaic mockup: 2-up grid like live mobile GTM page.
'use strict';
const fs = require('fs');
const sharp = require('sharp');
const DIR = 'C:/Users/koryj/website/_mockups_gtm_title';
const OUT = DIR + '/PHONE_SCREEN_after.jpg';
const OUTB = DIR + '/PHONE_SCREEN_before.jpg';

async function phoneScreen(pairs, outPath, label) {
  // iPhone-ish content width ~390, mosaic 2-up tiles ~195x148
  const W = 390, chrome = 88, tileH = 148, rows = 3;
  const H = chrome + tileH * rows + 24;
  const layers = [];
  // chrome bar
  layers.push({
    input: Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + chrome + '">' +
      '<rect width="' + W + '" height="' + chrome + '" fill="#0b0d12"/>' +
      '<text x="12" y="28" font-family="Arial" font-size="13" fill="#9a948c">6:54</text>' +
      '<text x="' + (W / 2) + '" y="52" text-anchor="middle" font-family="Arial" font-size="12" fill="#cfc7bd">pulserevops.com</text>' +
      '<text x="' + (W / 2) + '" y="74" text-anchor="middle" font-family="Arial" font-size="11" fill="' + (label === 'AFTER' ? '#39FF14' : '#ff8a9a') + '">' + label + ' — mobile 2-up</text>' +
      '</svg>'
    ),
    top: 0, left: 0
  });
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < 2; c++) {
      const src = pairs[r][c];
      const tile = await sharp(src).resize(Math.floor(W / 2), tileH, { fit: 'cover', position: 'center' }).jpeg({ quality: 90 }).toBuffer();
      layers.push({ input: tile, top: chrome + r * tileH, left: c * Math.floor(W / 2) });
    }
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0a0806' } })
    .composite(layers)
    .jpeg({ quality: 92 })
    .toFile(outPath);
  console.log('wrote', outPath);
}

(async () => {
  await phoneScreen([
    [DIR + '/01_phone_BEFORE.jpg', DIR + '/02_phone_BEFORE.jpg'],
    [DIR + '/03_phone_BEFORE.jpg', DIR + '/01_phone_BEFORE.jpg'],
    [DIR + '/02_phone_BEFORE.jpg', DIR + '/03_phone_BEFORE.jpg']
  ], OUTB, 'BEFORE');
  await phoneScreen([
    [DIR + '/01_phone_AFTER.jpg', DIR + '/02_phone_AFTER.jpg'],
    [DIR + '/03_phone_AFTER.jpg', DIR + '/01_phone_AFTER.jpg'],
    [DIR + '/02_phone_AFTER.jpg', DIR + '/03_phone_AFTER.jpg']
  ], OUT, 'AFTER');
})().catch(e => { console.error(e); process.exit(1); });
