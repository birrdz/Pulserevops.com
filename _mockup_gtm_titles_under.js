// GTM mockups — titles UNDER the image, like Recently Added (.rcard .rt)
'use strict';
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const OUT = WD + '/_mockups_gtm_title';
fs.mkdirSync(OUT, { recursive: true });

// Match CRO "Kory White" + Recent layout (title under image)
const TITLE_COLOR = '#F6C445';
const CAT_COLOR = '#EAC15C';
const BG = '#130a10';
const BORDER = '#3a2a18';
const FONT_FILE = fs.existsSync('C:/Windows/Fonts/georgiab.ttf') ? 'C:/Windows/Fonts/georgiab.ttf' : 'C:/Windows/Fonts/georgia.ttf';
const fontUrl = 'file:///' + FONT_FILE.replace(/\\/g, '/');

const cards = [
  { cat: 'GTM PLAYBOOKS', title: 'How do you build a PLG motion that scales past plateaus?', src: WD + '/assets/qa/_pexels_stored/232.jpg', fallback: WD + '/assets/qa/_gp_pool/007.jpg' },
  { cat: 'GTM PLAYBOOKS', title: 'What is the best partner and VAR channel playbook for 2027?', src: WD + '/assets/qa/_pexels_stored/229.jpg', fallback: WD + '/assets/qa/_gp_pool/004.jpg' },
  { cat: 'GTM PLAYBOOKS', title: 'How should national and expansion GTM teams split demand?', src: WD + '/assets/qa/_pexels_stored/274.jpg', fallback: WD + '/assets/qa/_gp_pool/049.jpg' },
  { cat: 'GTM PLAYBOOKS', title: 'Top 10 GTM plays that actually move pipeline in 2027', src: WD + '/assets/qa/_gp_pool/052.jpg', fallback: WD + '/assets/qa/_gp_pool/097.jpg' },
  { cat: 'GTM PLAYBOOKS', title: 'When should product-led growth hand off to sales-assisted PLG?', src: WD + '/assets/qa/_gp_pool/094.jpg', fallback: WD + '/assets/qa/_gp_pool/184.jpg' },
  { cat: 'GTM PLAYBOOKS', title: 'How do channel partners and VARs expand enterprise deals?', src: WD + '/assets/qa/_gp_pool/187.jpg', fallback: WD + '/assets/qa/_gp_pool/142.jpg' }
];

function wrapTitle(title, maxChars, maxLines) {
  const words = String(title).split(/\s+/);
  const lines = [];
  let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + ' ' + w).trim();
  });
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

async function makeCard(c, imgW, imgH, bodyH, titleSize) {
  const src = fs.existsSync(c.src) ? c.src : c.fallback;
  const photo = await sharp(src).resize(imgW, imgH, { fit: 'cover', position: 'north' }).jpeg({ quality: 88 }).toBuffer();
  const lines = wrapTitle(c.title, imgW > 400 ? 42 : 34, 3);
  const lineH = Math.round(titleSize * 1.28);
  let textY = 28;
  const cat = '<text x="12" y="16" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="1.2" fill="' + CAT_COLOR + '">' + c.cat + '</text>';
  const ts = lines.map((l, i) =>
    '<text x="12" y="' + (textY + i * lineH) + '" font-family="PulseGeorgia,Georgia,serif" font-size="' + titleSize + '" font-weight="800" fill="' + TITLE_COLOR + '">' +
    String(l).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>'
  ).join('');
  const bodySvg = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + imgW + '" height="' + bodyH + '">' +
    '<defs><style>@font-face{font-family:PulseGeorgia;src:url(\'' + fontUrl + '\');font-weight:800;}</style></defs>' +
    '<rect width="' + imgW + '" height="' + bodyH + '" fill="' + BG + '"/>' + cat + ts + '</svg>'
  );
  const body = await sharp(bodySvg).png().toBuffer();
  return sharp({
    create: { width: imgW, height: imgH + bodyH, channels: 3, background: BG }
  }).composite([
    { input: photo, top: 0, left: 0 },
    { input: body, top: imgH, left: 0 }
  ]).extend({
    top: 1, bottom: 1, left: 1, right: 1, background: BORDER
  }).jpeg({ quality: 90 }).toBuffer();
}

async function grid(cardBufs, cols, label, outName, cardW) {
  const gap = 10;
  const rows = Math.ceil(cardBufs.length / cols);
  const meta = await sharp(cardBufs[0]).metadata();
  const cw = meta.width, ch = meta.height;
  const chrome = 52;
  const Wg = cols * cw + (cols - 1) * gap + 24;
  const Hg = chrome + rows * ch + (rows - 1) * gap + 16;
  const layers = [{
    input: Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + Wg + '" height="' + chrome + '">' +
      '<rect width="' + Wg + '" height="' + chrome + '" fill="#0a0806"/>' +
      '<text x="12" y="22" font-family="Arial" font-size="12" fill="#9a948c">Like Recently Added — title under image</text>' +
      '<text x="12" y="42" font-family="Georgia,serif" font-size="15" fill="#F6C445">' + label + '</text></svg>'
    ), top: 0, left: 0
  }];
  for (let i = 0; i < cardBufs.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    layers.push({
      input: cardBufs[i],
      top: chrome + r * (ch + gap),
      left: 12 + c * (cw + gap)
    });
  }
  await sharp({ create: { width: Wg, height: Hg, channels: 3, background: '#0a0806' } })
    .composite(layers).jpeg({ quality: 92 }).toFile(OUT + '/' + outName);
  console.log('wrote', outName, 'cardW~', cardW);
}

(async () => {
  // Desktop 2-up — wider cards, title under
  const desk = [];
  for (const c of cards) desk.push(await makeCard(c, 420, 160, 78, 13));
  await grid(desk, 2, 'DESKTOP — title under (Recent style)', 'DESKTOP.jpg', 420);

  // Mobile 1-up
  const mob = [];
  for (const c of cards) mob.push(await makeCard(c, 360, 148, 78, 13));
  await grid(mob, 1, 'MOBILE — title under (Recent style)', 'MOBILE.jpg', 360);

  fs.writeFileSync(OUT + '/index.html', `<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>Mosaic = Recent style</title>
<style>
body{margin:0;background:#0a0806;color:#e8e6e1;font-family:Inter,system-ui,sans-serif;padding:16px}
h1{font-family:Georgia,serif;color:#F6C445;font-size:1.25rem;margin:0 0 6px}
p{color:#9a948c;font-size:.9rem;margin:0 0 14px;line-height:1.4}
h2{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:#EAC15C;margin:20px 0 8px}
img{display:block;width:100%;max-width:900px;border-radius:8px;border:1px solid #2a2824}
.note{color:#7dffb0}
</style></head><body>
<h1>Title under image</h1>
<p>Same pattern as <b>Recently Added</b>: photo on top · small gold category · cream title text under (Inter, ~.82rem feel) · no title baked on the photo.</p>
<p class=note>http://localhost:8911/ · phone http://192.168.5.68:8911/</p>
<h2>Mobile</h2><img src="MOBILE.jpg?v=under1" alt="mobile">
<h2>Desktop</h2><img src="DESKTOP.jpg?v=under1" alt="desktop">
</body></html>`);
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
