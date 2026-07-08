// Regenerate app icons (black bg, white bulb) from app-icon-master.svg using sharp.
const sharp = require('sharp');
const fs = require('fs');
const src = fs.readFileSync('app-icon-master.svg');
const jobs = [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
];
(async () => {
  for (const [out, size] of jobs) {
    await sharp(src, { density: 384 }).resize(size, size).png().toFile(out);
    console.log('wrote', out, size + 'x' + size);
  }
  console.log('done');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
