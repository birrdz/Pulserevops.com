// _build_og_card.js — generate a clean 1200x630 branded LinkedIn/OG share card (pulse-og.jpg).
// Gold pulse logo + PULSE RevOps wordmark on warm-dark ground with a gold frame (matches the CRO card).
const sharp = require('sharp');
const W = 1200, H = 630;
const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1b120b"/><stop offset="0.55" stop-color="#120b0c"/><stop offset="1" stop-color="#0a0708"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.26" cy="0.42" r="0.55">
      <stop offset="0" stop-color="#EAC15C" stop-opacity="0.16"/><stop offset="1" stop-color="#EAC15C" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="16" y="16" width="${W - 32}" height="${H - 32}" fill="none" stroke="#EAC15C" stroke-opacity="0.6" stroke-width="3" rx="10"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#EAC15C" stroke-opacity="0.18" stroke-width="1" rx="6"/>
  <text x="482" y="272" font-family="Georgia,'Times New Roman',serif" font-size="80" font-weight="bold" fill="#F6C445">PULSE RevOps</text>
  <text x="486" y="330" font-family="Arial,Helvetica,sans-serif" font-size="31" font-weight="bold" fill="#EAC15C" letter-spacing="3">THE REVOPS AUTHORITY</text>
  <text x="486" y="386" font-family="Arial,Helvetica,sans-serif" font-size="29" fill="#cabfb2">Fractional CRO insights, benchmarks &amp; playbooks</text>
  <text x="486" y="474" font-family="Arial,Helvetica,sans-serif" font-size="25" fill="#8f857a" letter-spacing="1">pulserevops.com</text>
</svg>`;

(async () => {
  const logo = await sharp('icon-512.png').resize(310, 310, { fit: 'cover' }).png().toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: 120, top: 160 }])
    .jpeg({ quality: 88 })
    .toFile('pulse-og.jpg');
  const m = await sharp('pulse-og.jpg').metadata();
  console.log('wrote pulse-og.jpg ' + m.width + 'x' + m.height + ' ' + Math.round(require('fs').statSync('pulse-og.jpg').size / 1024) + 'KB');
})().catch(e => { console.error(e.message); process.exit(1); });
