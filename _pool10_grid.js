// _pool10_grid.js <topic> <outfile> — build a spot-check HTML grid of a topic's 10 applied cover images
// (base64-embedded so it works as a self-contained Artifact). Body content only (Artifact wraps head/body).
'use strict';
const fs = require('fs');
const t = process.argv[2];
const out = process.argv[3];
const dir = 'C:/Users/koryj/website/assets/pool10/' + t;
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.jpg$/i.test(f)).sort() : [];
let figs = '';
for (const f of files) {
  const b64 = fs.readFileSync(dir + '/' + f).toString('base64');
  figs += '<figure><img loading="lazy" src="data:image/jpeg;base64,' + b64 + '"><figcaption>' + t + ' / ' + f.replace(/\.jpg$/i, '') + '</figcaption></figure>';
}
const css = 'body{margin:0;background:#0f0f12;color:#eef1f6;font-family:system-ui,Arial}'
  + 'h1{padding:18px 22px 4px;margin:0;font-size:1.4rem;color:#EAC15C}p.sub{padding:0 22px 12px;margin:0;color:#9aa0ad;font-size:.9rem}'
  + '.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;padding:16px}'
  + 'figure{margin:0;position:relative;border:1px solid #2a2d35;border-radius:10px;overflow:hidden;background:#000}'
  + 'img{width:100%;aspect-ratio:1;object-fit:cover;display:block}'
  + 'figcaption{position:absolute;top:6px;left:6px;background:rgba(0,0,0,.72);color:#EAC15C;font-weight:700;padding:2px 8px;border-radius:6px;font-size:.8rem}';
const body = '<style>' + css + '</style>'
  + '<h1>Spot check — ' + t + ' (' + files.length + ' covers applied)</h1>'
  + '<p class=sub>These 10 are now the face cards spread ~10% each across the whole ' + t + ' topic.</p>'
  + '<div class=g>' + figs + '</div>';
fs.writeFileSync(out, body);
console.log('wrote ' + out + ' with ' + files.length + ' images');
