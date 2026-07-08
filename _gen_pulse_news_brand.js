// Generate Pulse News brand assets from the gold logo mockup (_pulse-news-src.png).
// - pulse-news-logo.png       : dark rounded badge (news-channel bug) for the header
// - pulse-news-logo-flat.png  : transparent gold wordmark (alternate, for light bgs)
// - icon-512/192.png, apple-touch-icon.png, favicon.ico, pulse-icon.png : black Pulse News badge (square)
// - pulse-og.png              : 1200x630 social card (cover-crop of the brand art)
const fs = require('fs');
const sharp = require('sharp');
const SRC = '_pulse-news-src.png';
const BADGE = 'pulse-news-logo.png';

// full lockup WITH dark bg, sparkle (right of ~1360) excluded
const LOCK = { left: 286, top: 236, width: 1074, height: 398 };
// gold-content bbox for the transparent wordmark (no sparkle)
const GB = { left: 308, top: 253, width: 1032, height: 349 };

// rounded-rect alpha mask svg
const roundMask = (w, h, r) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#fff"/></svg>`
);

// minimal single-image .ico embedding a 32x32 PNG (valid in all modern browsers)
function icoFromPng(png32) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
  const ent = Buffer.alloc(16);
  ent[0] = 32; ent[1] = 32;
  ent.writeUInt16LE(1, 4); ent.writeUInt16LE(32, 6);
  ent.writeUInt32LE(png32.length, 8); ent.writeUInt32LE(22, 12);
  return Buffer.concat([head, ent, png32]);
}

async function squareBadgeIcon(size) {
  const pad = Math.max(10, Math.round(size * 0.08));
  const inner = size - pad * 2;
  return sharp(BADGE)
    .resize(inner, inner, { fit: 'inside' })
    .extend({
      top: pad, bottom: pad, left: pad, right: pad,
      background: { r: 10, g: 12, b: 17, alpha: 1 },
    })
    .png()
    .toBuffer();
}

(async () => {
  // 1) header badge — dark rounded lockup
  const lock = await sharp(SRC).extract(LOCK).png().toBuffer();
  const lm = await sharp(lock).metadata();
  await sharp(lock)
    .composite([{ input: roundMask(lm.width, lm.height, 44), blend: 'dest-in' }])
    .png().toFile(BADGE);

  // 2) transparent gold wordmark (alternate) — alpha from luminance
  const crop = await sharp(SRC).extract(GB).raw().toBuffer({ resolveWithObject: true });
  const { data, info } = crop; const { width: W, height: H, channels: C } = info;
  const out = Buffer.alloc(W * H * 4);
  const LO = 34, HI = 108;
  for (let p = 0, q = 0; p < data.length; p += C, q += 4) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const L = 0.299 * r + 0.587 * g + 0.114 * b;
    let a = Math.round(((L - LO) / (HI - LO)) * 255);
    a = a < 0 ? 0 : a > 255 ? 255 : a;
    out[q] = r; out[q + 1] = g; out[q + 2] = b; out[q + 3] = a;
  }
  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .trim({ threshold: 1 }).png().toFile('pulse-news-logo-flat.png');

  // 3) black Pulse News badge -> favicon, PWA, Google site icon, share chip
  const icon512 = await squareBadgeIcon(512);
  const icon192 = await squareBadgeIcon(192);
  const icon180 = await squareBadgeIcon(180);
  await sharp(icon512).toFile('icon-512.png');
  await sharp(icon192).toFile('icon-192.png');
  await sharp(icon180).toFile('apple-touch-icon.png');
  await sharp(icon512).toFile('pulse-icon.png');
  const png32 = await sharp(icon192).resize(32, 32).png().toBuffer();
  fs.writeFileSync('favicon.ico', icoFromPng(png32));

  // Legacy SVG favicon slots now point at the PNG badge (no lightbulb).
  const svgWrap = (size, href) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Pulse News">
  <image href="${href}" width="${size}" height="${size}"/>
</svg>`;
  fs.writeFileSync('icon-192.svg', svgWrap(192, '/icon-192.png'));
  fs.writeFileSync('pulse-favicon-adaptive.svg', svgWrap(192, '/icon-192.png'));

  // 4) social card 1200x630 — cover-crop of the brand art (seamless)
  await sharp(SRC).resize(1200, 630, { fit: 'cover', position: 'centre' }).png().toFile('pulse-og.png');

  console.log('pulse-news brand assets generated (black badge icons, no lightbulb)');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
