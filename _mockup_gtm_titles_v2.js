// Redo GTM mockups: bottom-CENTER titles (survive mosaic side-crop) + matching business photos + headroom crop.
'use strict';
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const OUT = WD + '/_mockups_gtm_title';
fs.mkdirSync(OUT, { recursive: true });

/** Title sits bottom-center — only the middle ~50% of a 3:1 face card is visible on mobile 2-up. */
function goldTitle(w, h, text) {
  const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clean = String(text || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  const words = clean.split(/\s+/).filter(Boolean);
  // Keep lines short so they stay inside the mosaic crop window
  const maxChars = 22;
  const lines = [];
  let cur = '';
  words.forEach(wd => {
    if ((cur + ' ' + wd).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = wd; }
    else cur = (cur + ' ' + wd).trim();
  });
  if (cur) lines.push(cur);
  const L = lines.slice(0, 3);
  const F = Math.max(15, Math.min(28, Math.round(h * 0.065)));
  const lh = Math.round(F * 1.18);
  const y0 = h - Math.round(h * 0.07) - (L.length - 1) * lh;
  const cx = Math.round(w / 2);
  const strokeW = Math.max(1.4, Math.round(F * 0.1));
  const ts = L.map((l, i) =>
    '<text x="' + cx + '" y="' + (y0 + i * lh) + '" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-style="normal" font-weight="700" font-size="' + F + '" fill="#FFD54F" stroke="#000" stroke-width="' + strokeW + '" stroke-linejoin="round" paint-order="stroke fill">' + xesc(l) + '</text>'
  ).join('');
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
    '<defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0.55" stop-color="#000" stop-opacity="0"/>' +
    '<stop offset="1" stop-color="#000" stop-opacity="0.82"/></linearGradient></defs>' +
    '<rect width="' + w + '" height="' + h + '" fill="url(#gt)"/>' +
    '<g>' + ts + '</g></svg>'
  );
}

const cards = [
  {
    title: 'How do you build a PLG motion that scales past plateaus?',
    src: WD + '/assets/qa/_pexels_stored/232.jpg', // sales team celebrating
    fallback: WD + '/assets/qa/_gp_pool/007.jpg'
  },
  {
    title: 'What is the best partner and VAR channel playbook for 2027?',
    src: WD + '/assets/qa/_pexels_stored/229.jpg', // handshake / partners
    fallback: WD + '/assets/qa/_gp_pool/004.jpg'
  },
  {
    title: 'How should national and expansion GTM teams split demand?',
    src: WD + '/assets/qa/_pexels_stored/274.jpg', // team handshake
    fallback: WD + '/assets/qa/_gp_pool/049.jpg'
  },
  {
    title: 'Top 10 GTM plays that actually move pipeline in 2027',
    src: WD + '/assets/qa/_gp_pool/052.jpg',
    fallback: WD + '/assets/qa/_gp_pool/097.jpg'
  },
  {
    title: 'When should product-led growth hand off to sales-assisted PLG?',
    src: WD + '/assets/qa/_gp_pool/094.jpg',
    fallback: WD + '/assets/qa/_gp_pool/184.jpg'
  },
  {
    title: 'How do channel partners and VARs expand enterprise deals?',
    src: WD + '/assets/qa/_gp_pool/187.jpg',
    fallback: WD + '/assets/qa/_gp_pool/142.jpg'
  }
];

const W = 1200, H = 400;

async function bakeCard(c, i) {
  const src = fs.existsSync(c.src) ? c.src : c.fallback;
  if (!fs.existsSync(src)) throw new Error('missing ' + src);
  // north = headroom / no chopped heads on wide crop
  const base = await sharp(src).resize(W, H, { fit: 'cover', position: 'north' }).jpeg({ quality: 90 }).toBuffer();
  const baked = await sharp(base).composite([{ input: goldTitle(W, H, c.title) }]).jpeg({ quality: 90 }).toBuffer();
  const n = String(i + 1).padStart(2, '0');
  fs.writeFileSync(OUT + '/card_' + n + '.jpg', baked);
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
      '<text x="14" y="24" font-family="Arial" font-size="12" fill="#9a948c">pulserevops.com · GTM</text>' +
      '<text x="14" y="44" font-family="Arial" font-size="14" fill="#39FF14">' + label + '</text></svg>'
    ),
    top: 0, left: 0
  }];
  for (let i = 0; i < bakedBufs.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const tile = await sharp(bakedBufs[i]).resize(tileW, tileH, { fit: 'cover', position: 'centre' }).jpeg({ quality: 90 }).toBuffer();
    layers.push({ input: tile, top: chrome + r * tileH, left: c * tileW });
  }
  await sharp({ create: { width: Wg, height: Hg, channels: 3, background: '#0a0806' } })
    .composite(layers)
    .jpeg({ quality: 92 })
    .toFile(OUT + '/' + outName);
  console.log('wrote', outName);
}

(async () => {
  const baked = [];
  for (let i = 0; i < cards.length; i++) baked.push(await bakeCard(cards[i], i));
  // Desktop: 2-up, ~540x200 tiles (typical half of 1100 mosaic)
  await mosaicGrid(baked, 540, 200, 2, 'DESKTOP — 2-up mosaic', 'DESKTOP.jpg');
  // Mobile: 2-up, 195x148
  await mosaicGrid(baked, 195, 148, 2, 'MOBILE — 2-up mosaic', 'MOBILE.jpg');
  // Full face card strip for detail
  await sharp({
    create: { width: W, height: H * 3 + 40, channels: 3, background: '#0a0806' }
  }).composite([
    { input: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="40"><text x="16" y="28" font-family="Arial" font-size="16" fill="#F6C445">Full face cards (bake source)</text></svg>'), top: 0, left: 0 },
    { input: baked[0], top: 40, left: 0 },
    { input: baked[1], top: 40 + H, left: 0 },
    { input: baked[2], top: 40 + H * 2, left: 0 }
  ]).jpeg({ quality: 90 }).toFile(OUT + '/FULL_CARDS.jpg');

  const html = `<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>GTM title mockups v2</title>
<style>
body{margin:0;background:#0a0806;color:#e8e6e1;font-family:Inter,system-ui,Arial,sans-serif;padding:16px}
h1{font-size:1.15rem;margin:0 0 6px}p{color:#9a948c;margin:0 0 18px;font-size:.9rem;line-height:1.4}
h2{font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:#F6C445;margin:22px 0 10px}
img{display:block;width:100%;max-width:1100px;border:1px solid #2a2824;border-radius:8px;margin:0 0 8px}
.note{font-size:.8rem;color:#7dffb0;margin-bottom:16px}
</style></head><body>
<h1>GTM face titles — v2</h1>
<p>Bottom-center small sans (survives mosaic side-crop) · north crop for headroom · business/team photos matched to titles.</p>
<div class=note>Open on phone too: same Wi-Fi → http://192.168.5.68:8911/</div>
<h2>Mobile</h2>
<img src="MOBILE.jpg" alt="mobile mosaic">
<h2>Desktop</h2>
<img src="DESKTOP.jpg" alt="desktop mosaic">
<h2>Full face cards</h2>
<img src="FULL_CARDS.jpg" alt="full cards">
</body></html>`;
  fs.writeFileSync(OUT + '/index.html', html);
  console.log('done', OUT);
})().catch(e => { console.error(e); process.exit(1); });
