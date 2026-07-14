// Mockups: title UNDER image + Georgia gold (#F6C445 like “Kory White”)
// Two layouts: A) mosaic bands  B) small squares like Recently Added
'use strict';
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const OUT = WD + '/_mockups_gtm_title';
fs.mkdirSync(OUT, { recursive: true });

const GOLD = '#F6C445';
const CAT = '#EAC15C';
const BG = '#130a10';
const FONT = fs.existsSync('C:/Windows/Fonts/georgiab.ttf')
  ? 'C:/Windows/Fonts/georgiab.ttf'
  : 'C:/Windows/Fonts/georgia.ttf';
const fontUrl = 'file:///' + FONT.replace(/\\/g, '/');

const cards = [
  { cat: 'GTM PLAYBOOKS', title: 'How do you build a PLG motion that scales past plateaus?', src: WD + '/assets/qa/_pexels_stored/232.jpg', fallback: WD + '/assets/qa/_gp_pool/007.jpg' },
  { cat: 'GTM PLAYBOOKS', title: 'What is the best partner and VAR channel playbook for 2027?', src: WD + '/assets/qa/_pexels_stored/229.jpg', fallback: WD + '/assets/qa/_gp_pool/004.jpg' },
  { cat: 'INDUSTRY KPIS', title: 'Top 10 Coffee Shop Chain Revenue KPIs in 2027', src: WD + '/assets/qa/_gp_pool/052.jpg', fallback: WD + '/assets/qa/_gp_pool/097.jpg' },
  { cat: 'CARS', title: 'What is the best way to approach Cars in 2027?', src: WD + '/assets/qa/_gp_pool/094.jpg', fallback: WD + '/assets/qa/_gp_pool/184.jpg' },
  { cat: 'SALES TRAININGS', title: 'Top 10 Sales Trainings strategies for 2027', src: WD + '/assets/qa/_gp_pool/187.jpg', fallback: WD + '/assets/qa/_gp_pool/142.jpg' },
  { cat: 'RESORTS', title: 'Top 10 best Resorts options in 2027', src: WD + '/assets/qa/_gp_pool/049.jpg', fallback: WD + '/assets/qa/_gp_pool/007.jpg' }
];

function wrap(title, maxChars, maxLines) {
  const words = String(title).split(/\s+/);
  const lines = []; let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + ' ' + w).trim();
  });
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

async function makeCard(c, imgW, imgH, bodyH, titlePx, maxChars) {
  const src = fs.existsSync(c.src) ? c.src : c.fallback;
  const photo = await sharp(src).resize(imgW, imgH, { fit: 'cover', position: 'north' }).jpeg({ quality: 88 }).toBuffer();
  const lines = wrap(c.title, maxChars, 3);
  const lh = Math.round(titlePx * 1.22);
  const cat = '<text x="11" y="15" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="800" letter-spacing="1.1" fill="' + CAT + '">' + c.cat + '</text>';
  const ts = lines.map((l, i) =>
    '<text x="11" y="' + (30 + i * lh) + '" font-family="PulseGeorgia,Georgia,serif" font-weight="800" font-size="' + titlePx + '" fill="' + GOLD + '">' +
    String(l).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>'
  ).join('');
  const bodySvg = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + imgW + '" height="' + bodyH + '">' +
    '<defs><style>@font-face{font-family:PulseGeorgia;src:url(\'' + fontUrl + '\');font-weight:800;}</style></defs>' +
    '<rect width="' + imgW + '" height="' + bodyH + '" fill="' + BG + '"/>' + cat + ts + '</svg>'
  );
  const body = await sharp(bodySvg).png().toBuffer();
  return sharp({ create: { width: imgW, height: imgH + bodyH, channels: 3, background: BG } })
    .composite([{ input: photo, top: 0, left: 0 }, { input: body, top: imgH, left: 0 }])
    .extend({ top: 1, bottom: 1, left: 1, right: 1, background: '#3a2a18' })
    .jpeg({ quality: 90 }).toBuffer();
}

async function grid(bufs, cols, label, outName, gap) {
  gap = gap == null ? 12 : gap;
  const rows = Math.ceil(bufs.length / cols);
  const meta = await sharp(bufs[0]).metadata();
  const cw = meta.width, ch = meta.height;
  const chrome = 54;
  const Wg = 16 + cols * cw + (cols - 1) * gap + 16;
  const Hg = chrome + rows * ch + (rows - 1) * gap + 16;
  const layers = [{
    input: Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + Wg + '" height="' + chrome + '">' +
      '<rect width="' + Wg + '" height="' + chrome + '" fill="#0a0806"/>' +
      '<text x="14" y="22" font-family="Arial" font-size="11" fill="#9a948c">Title under · Georgia gold = Kory White</text>' +
      '<text x="14" y="42" font-family="Georgia,serif" font-size="15" font-weight="800" fill="#F6C445">' + label + '</text></svg>'
    ), top: 0, left: 0
  }];
  for (let i = 0; i < bufs.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    layers.push({ input: bufs[i], top: chrome + r * (ch + gap), left: 16 + c * (cw + gap) });
  }
  await sharp({ create: { width: Wg, height: Hg, channels: 3, background: '#0a0806' } })
    .composite(layers).jpeg({ quality: 92 }).toFile(OUT + '/' + outName);
  console.log('wrote', outName);
}

(async () => {
  // A) Wide mosaic bands (2-up desktop / 1-up mobile)
  const wide = [];
  for (const c of cards) wide.push(await makeCard(c, 400, 150, 72, 15, 40));
  await grid(wide.slice(0, 6), 2, 'A · WIDE bands — Georgia gold under', 'DESKTOP_WIDE.jpg');

  const wideMob = [];
  for (const c of cards) wideMob.push(await makeCard(c, 360, 140, 72, 15, 34));
  await grid(wideMob, 1, 'A · MOBILE wide — Georgia gold under', 'MOBILE_WIDE.jpg');

  // B) Small squares like Recently Added (212×132 img + text under)
  const sq = [];
  for (const c of cards) sq.push(await makeCard(c, 212, 132, 70, 13, 26));
  await grid(sq, 4, 'B · SMALL SQUARES like Recently Added', 'SQUARES.jpg', 12);
  await grid(sq.slice(0, 3), 1, 'B · MOBILE small squares (stack)', 'MOBILE_SQUARES.jpg', 12);

  fs.writeFileSync(OUT + '/index.html', `<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>Title under + Kory White gold</title>
<style>
body{margin:0;background:#0a0806;color:#e8e6e1;font-family:Inter,system-ui,sans-serif;padding:16px}
h1{font-family:Georgia,serif;color:#F6C445;font-size:1.35rem;margin:0 0 6px;font-weight:800}
p{color:#9a948c;font-size:.9rem;line-height:1.4;margin:0 0 14px}
h2{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:#EAC15C;margin:22px 0 8px}
img{display:block;width:100%;max-width:920px;border:1px solid #2a2824;border-radius:8px;margin:0 0 6px}
.note{color:#7dffb0}
</style></head><body>
<h1 style="font-family:Georgia,serif">Kory White</h1>
<p>Title <b>under</b> the photo · <span style="font-family:Georgia,serif;color:#F6C445;font-weight:800">Georgia + #F6C445</span> (same as your name). Pick A (wide) or B (small squares — easier, matches Recents).</p>
<p class=note>http://localhost:8911/ · phone http://192.168.5.68:8911/</p>
<h2>B — Small squares (Recent style)</h2>
<img src="SQUARES.jpg?v=gw1" alt="squares">
<img src="MOBILE_SQUARES.jpg?v=gw1" alt="squares mobile">
<h2>A — Wide mosaic bands</h2>
<img src="DESKTOP_WIDE.jpg?v=gw1" alt="wide desk">
<img src="MOBILE_WIDE.jpg?v=gw1" alt="wide mob">
</body></html>`);
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
