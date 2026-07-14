// GTM mockups — match CRO card "Kory White": Georgia 800 + #F6C445
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const OUT = WD + '/_mockups_gtm_title';
fs.mkdirSync(OUT, { recursive: true });

const FILL = '#F6C445'; // cro-card__title
const FONT_FILE = 'C:/Windows/Fonts/georgiab.ttf'; // Georgia Bold
const FONT_FILE2 = 'C:/Windows/Fonts/georgia.ttf';
const fontPath = fs.existsSync(FONT_FILE) ? FONT_FILE : FONT_FILE2;
const fontUrl = 'file:///' + fontPath.replace(/\\/g, '/');

function goldTitle(w, h, text) {
  const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clean = String(text || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
  const words = clean.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  const maxChars = Math.max(w, h) >= 700 ? 34 : 24;
  words.forEach(wd => {
    if ((cur + ' ' + wd).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = wd; }
    else cur = (cur + ' ' + wd).trim();
  });
  if (cur) lines.push(cur);
  const L = lines.slice(0, 3);
  // CRO-card Georgia gold — but mosaic-scale (~half of “Kory White” hero size)
  const F = Math.max(18, Math.min(28, Math.round(h * 0.062)));
  const lh = Math.round(F * 1.16);
  const y0 = h - Math.round(h * 0.055) - (L.length - 1) * lh;
  const cx = Math.round(w / 2);
  const strokeW = Math.max(1.8, Math.round(F * 0.11));
  const ts = L.map((l, i) =>
    '<text x="' + cx + '" y="' + (y0 + i * lh) + '" text-anchor="middle" font-family="PulseGeorgia,Georgia,serif" font-style="normal" font-weight="800" font-size="' + F + '" fill="' + FILL + '" stroke="#000" stroke-width="' + strokeW + '" stroke-linejoin="round" paint-order="stroke fill">' + xesc(l) + '</text>'
  ).join('');
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
    '<defs><style>@font-face{font-family:PulseGeorgia;src:url(\'' + fontUrl + '\');font-weight:800;}</style>' +
    '<linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0.4" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity="0.9"/></linearGradient></defs>' +
    '<rect width="' + w + '" height="' + h + '" fill="url(#gt)"/><g>' + ts + '</g></svg>'
  );
}

const cards = [
  { title: 'How do you build a PLG motion that scales past plateaus?', src: WD + '/assets/qa/_pexels_stored/232.jpg', fallback: WD + '/assets/qa/_gp_pool/007.jpg' },
  { title: 'What is the best partner and VAR channel playbook for 2027?', src: WD + '/assets/qa/_pexels_stored/229.jpg', fallback: WD + '/assets/qa/_gp_pool/004.jpg' },
  { title: 'How should national and expansion GTM teams split demand?', src: WD + '/assets/qa/_pexels_stored/274.jpg', fallback: WD + '/assets/qa/_gp_pool/049.jpg' },
  { title: 'Top 10 GTM plays that actually move pipeline in 2027', src: WD + '/assets/qa/_gp_pool/052.jpg', fallback: WD + '/assets/qa/_gp_pool/097.jpg' },
  { title: 'When should product-led growth hand off to sales-assisted PLG?', src: WD + '/assets/qa/_gp_pool/094.jpg', fallback: WD + '/assets/qa/_gp_pool/184.jpg' },
  { title: 'How do channel partners and VARs expand enterprise deals?', src: WD + '/assets/qa/_gp_pool/187.jpg', fallback: WD + '/assets/qa/_gp_pool/142.jpg' }
];

const W = 1200, H = 400;

async function bakeCard(c, i) {
  const src = fs.existsSync(c.src) ? c.src : c.fallback;
  const base = await sharp(src).resize(W, H, { fit: 'cover', position: 'north' }).jpeg({ quality: 90 }).toBuffer();
  const baked = await sharp(base).composite([{ input: goldTitle(W, H, c.title) }]).jpeg({ quality: 90 }).toBuffer();
  fs.writeFileSync(OUT + '/card_' + String(i + 1).padStart(2, '0') + '.jpg', baked);
  return baked;
}

async function mosaicGrid(bakedBufs, tileW, tileH, cols, label, outName) {
  const rows = Math.ceil(bakedBufs.length / cols);
  const chrome = 56;
  const Wg = tileW * cols;
  const Hg = chrome + tileH * rows;
  const layers = [{
    input: Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + Wg + '" height="' + chrome + '">' +
      '<rect width="' + Wg + '" height="' + chrome + '" fill="#0b0d12"/>' +
      '<text x="14" y="24" font-family="Arial" font-size="12" fill="#9a948c">Same as CRO card · Georgia + #F6C445</text>' +
      '<text x="14" y="44" font-family="Georgia" font-size="15" fill="#F6C445">' + label + '</text></svg>'
    ),
    top: 0, left: 0
  }];
  for (let i = 0; i < bakedBufs.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const tile = await sharp(bakedBufs[i]).resize(tileW, tileH, { fit: 'cover', position: 'centre' }).jpeg({ quality: 90 }).toBuffer();
    layers.push({ input: tile, top: chrome + r * tileH, left: c * tileW });
  }
  await sharp({ create: { width: Wg, height: Hg, channels: 3, background: '#0a0806' } })
    .composite(layers).jpeg({ quality: 92 }).toFile(OUT + '/' + outName);
  console.log('wrote', outName);
}

(async () => {
  console.log('font', fontPath);
  const baked = [];
  for (let i = 0; i < cards.length; i++) baked.push(await bakeCard(cards[i], i));
  await mosaicGrid(baked, 540, 200, 2, 'DESKTOP — Georgia gold like “Kory White”', 'DESKTOP.jpg');
  await mosaicGrid(baked, 390, 148, 1, 'MOBILE — Georgia gold like “Kory White”', 'MOBILE.jpg');
  fs.writeFileSync(OUT + '/index.html', `<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>GTM titles = CRO card look</title>
<style>
body{margin:0;background:#0a0806;color:#e8e6e1;font-family:Inter,system-ui,sans-serif;padding:16px}
h1{font-family:Georgia,serif;color:#F6C445;font-size:1.6rem;margin:0 0 6px}
p{color:#9a948c;margin:0 0 16px;font-size:.9rem}
h2{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:#EAC15C;margin:22px 0 10px}
img{display:block;width:100%;max-width:1100px;border:1px solid #2a2824;border-radius:8px}
.note{color:#7dffb0}
</style></head><body>
<h1>Kory White</h1>
<p>Face titles match the CRO card: <b style="color:#F6C445;font-family:Georgia,serif">Georgia · #F6C445</b> (not italic).</p>
<p class=note>http://192.168.5.68:8911/</p>
<h2>Mobile 1-up</h2><img src="MOBILE.jpg" alt="mobile">
<h2>Desktop 2-up</h2><img src="DESKTOP.jpg" alt="desktop">
</body></html>`);
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
