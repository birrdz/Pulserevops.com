// Rebuild GTM 10 untitled squares from known title-matched Pexels IDs (head-safe crop).
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WD = __dirname;
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const API_KEY = process.env.PEXELS_API_KEY || '';
if (!API_KEY) { console.error('Missing PEXELS_API_KEY'); process.exit(1); }

const QA = path.join(WD, 'assets', 'qa');
const STORED = path.join(QA, '_pexels_stored');
const MAP = JSON.parse(fs.readFileSync(path.join(WD, '_preview_gtm10_pexels.json'), 'utf8'));

async function photoById(id) {
  const r = await fetch('https://api.pexels.com/v1/photos/' + id, { headers: { Authorization: API_KEY } });
  if (!r.ok) throw new Error('photo ' + id + ' ' + r.status);
  return r.json();
}

async function dl(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('dl ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

(async () => {
  for (const card of MAP) {
    const photo = await photoById(card.pexelsId);
    const src = photo.src && (photo.src.large2x || photo.src.large || photo.src.original);
    const buf = await dl(src);
    // attention crop keeps faces/subjects in frame (no aggressive zoom later in CSS)
    const dest = path.join(QA, card.id + '.sq.jpg');
    await sharp(buf)
      .rotate()
      .resize(900, 900, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(dest);
    const lib = path.join(STORED, 'gtm-' + card.id + '_' + card.pexelsId + '.jpg');
    fs.copyFileSync(dest, lib);
    console.log('OK', card.id, fs.statSync(dest).size, card.t);
  }
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
