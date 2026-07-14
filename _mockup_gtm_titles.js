// One-shot GTM title bake mockups (BEFORE old cursive vs AFTER new sans).
// Source photos: assets/qa/_pexels_stored. Does NOT touch live covers.
'use strict';
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const STORED = WD + '/assets/qa/_pexels_stored';
const OUT = WD + '/_mockups_gtm_title';
fs.mkdirSync(OUT, { recursive: true });

function goldNew(w, h, text) {
  const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clean = String(text || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
  const words = clean.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  const maxChars = Math.max(w, h) >= 700 ? 34 : 24;
  words.forEach(wd => {
    if ((cur + ' ' + wd).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = wd; }
    else cur = (cur + ' ' + wd).trim();
  });
  if (cur) lines.push(cur);
  const L = lines.slice(-3);
  const F = Math.max(16, Math.min(32, Math.round(h * 0.072)));
  const lh = Math.round(F * 1.12);
  const y0 = h - Math.round(h * 0.055) - (L.length - 1) * lh;
  const pad = Math.round(w * 0.04);
  const strokeW = Math.max(1.5, Math.round(F * 0.09));
  const ts = L.map((l, i) => '<text x="' + pad + '" y="' + (y0 + i * lh) + '" font-family="Arial,Helvetica,sans-serif" font-style="normal" font-weight="700" font-size="' + F + '" fill="#FFD54F" stroke="#000" stroke-width="' + strokeW + '" stroke-linejoin="round" paint-order="stroke fill">' + xesc(l) + '</text>').join('');
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.78"/></linearGradient></defs><rect width="' + w + '" height="' + h + '" fill="url(#gt)"/><g>' + ts + '</g></svg>');
}

function goldOld(w, h, text) {
  const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clean = String(text || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
  const words = clean.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  const maxChars = Math.max(w, h) >= 700 ? 28 : 20;
  words.forEach(wd => {
    if ((cur + ' ' + wd).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = wd; }
    else cur = (cur + ' ' + wd).trim();
  });
  if (cur) lines.push(cur);
  const L = lines.slice(-3);
  const F = Math.max(28, Math.min(58, Math.round(h * 0.125)));
  const lh = Math.round(F * 1.08);
  const y0 = h - Math.round(h * 0.06) - (L.length - 1) * lh;
  const pad = Math.round(w * 0.035);
  const strokeW = Math.max(2, Math.round(F * 0.11));
  const ts = L.map((l, i) => '<text x="' + pad + '" y="' + (y0 + i * lh) + '" font-family="Georgia,\'Playfair Display\',serif" font-style="italic" font-weight="900" font-size="' + F + '" fill="#FFD54F" stroke="#000" stroke-width="' + strokeW + '" stroke-linejoin="round" paint-order="stroke fill">' + xesc(l) + '</text>').join('');
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.88"/></linearGradient></defs><rect width="' + w + '" height="' + h + '" fill="url(#gt)"/><g>' + ts + '</g></svg>');
}

const titles = [
  'How do you build a PLG motion that scales past product-led growth plateaus?',
  'What is the best partner and VAR channel playbook for 2027?',
  'How should national and expansion GTM teams split demand capture?'
];

(async () => {
  const files = fs.readdirSync(STORED).filter(f => /\.jpe?g$/i.test(f)).slice(0, 3);
  if (files.length < 3) throw new Error('need 3+ pexels stored images, found ' + files.length);
  const W = 1200, H = 400;
  for (let i = 0; i < 3; i++) {
    const src = STORED + '/' + files[i];
    const title = titles[i];
    const base = await sharp(src).resize(W, H, { fit: 'cover', position: 'attention' }).jpeg({ quality: 88 }).toBuffer();
    const before = await sharp(base).composite([{ input: goldOld(W, H, title) }]).jpeg({ quality: 88 }).toBuffer();
    const after = await sharp(base).composite([{ input: goldNew(W, H, title) }]).jpeg({ quality: 88 }).toBuffer();
    const n = String(i + 1).padStart(2, '0');
    fs.writeFileSync(OUT + '/' + n + '_BEFORE_old-cursive.jpg', before);
    fs.writeFileSync(OUT + '/' + n + '_AFTER_new-sans.jpg', after);
    const phoneW = 360, phoneH = 148;
    fs.writeFileSync(OUT + '/' + n + '_phone_BEFORE.jpg', await sharp(before).resize(phoneW, phoneH, { fit: 'cover', position: 'center' }).jpeg({ quality: 90 }).toBuffer());
    fs.writeFileSync(OUT + '/' + n + '_phone_AFTER.jpg', await sharp(after).resize(phoneW, phoneH, { fit: 'cover', position: 'center' }).jpeg({ quality: 90 }).toBuffer());
    console.log('ok', files[i], '->', title.slice(0, 56));
  }
  const label = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="736" height="40"><text x="10" y="26" font-family="Arial" font-size="16" fill="#ff8a9a">BEFORE (live now)</text><text x="386" y="26" font-family="Arial" font-size="16" fill="#39FF14">AFTER (proposed)</text></svg>');
  await sharp({ create: { width: 736, height: 188, channels: 3, background: '#0a0806' } })
    .composite([
      { input: label, top: 0, left: 0 },
      { input: OUT + '/01_phone_BEFORE.jpg', top: 40, left: 0 },
      { input: OUT + '/01_phone_AFTER.jpg', top: 40, left: 376 }
    ])
    .jpeg({ quality: 92 })
    .toFile(OUT + '/COMPARE_phone_01.jpg');
  await sharp({ create: { width: 736, height: 188, channels: 3, background: '#0a0806' } })
    .composite([
      { input: label, top: 0, left: 0 },
      { input: OUT + '/02_phone_BEFORE.jpg', top: 40, left: 0 },
      { input: OUT + '/02_phone_AFTER.jpg', top: 40, left: 376 }
    ])
    .jpeg({ quality: 92 })
    .toFile(OUT + '/COMPARE_phone_02.jpg');
  await sharp({ create: { width: 736, height: 188, channels: 3, background: '#0a0806' } })
    .composite([
      { input: label, top: 0, left: 0 },
      { input: OUT + '/03_phone_BEFORE.jpg', top: 40, left: 0 },
      { input: OUT + '/03_phone_AFTER.jpg', top: 40, left: 376 }
    ])
    .jpeg({ quality: 92 })
    .toFile(OUT + '/COMPARE_phone_03.jpg');
  console.log('wrote', OUT);
})().catch(e => { console.error(e); process.exit(1); });
