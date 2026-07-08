// _pool10_pick.js <topic> — keep the BEST 10 images in a topic's pool (sharpest by Laplacian variance), delete the rest.
'use strict';
const fs = require('fs');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
const t = process.argv[2];
const dir = WD + '/assets/pool10/' + t;
async function lapvar(fp) {
  const g = await sharp(fp).greyscale().resize(320, 320, { fit: 'inside' }).convolve({ width: 3, height: 3, kernel: [0, -1, 0, -1, 4, -1, 0, -1, 0] }).raw().toBuffer();
  let sum = 0, sum2 = 0, n = g.length; for (let i = 0; i < n; i++) { const v = g[i]; sum += v; sum2 += v * v; }
  const m = sum / n; return sum2 / n - m * m;
}
(async () => {
  const files = fs.readdirSync(dir).filter(f => /\.jpg$/i.test(f));
  if (files.length <= 10) { console.log('only ' + files.length + ' — keeping all'); return; }
  const scored = [];
  for (const f of files) { try { scored.push({ f, v: await lapvar(dir + '/' + f) }); } catch (e) { scored.push({ f, v: 0 }); } }
  scored.sort((a, b) => b.v - a.v);
  const keep = new Set(scored.slice(0, 10).map(x => x.f));
  for (const f of files) { if (!keep.has(f)) { try { fs.unlinkSync(dir + '/' + f); } catch (e) {} } }
  console.log('kept BEST 10 for ' + t + ': ' + [...keep].sort().join(',') + ' | dropped ' + (files.length - 10));
})();
