// Replace the old inline "pulse squiggle" data-URI favicon (and any lightbulb SVG
// favicon links) with the new gold Pulse News favicon block, across live HTML pages.
const fs = require('fs'), path = require('path');

const NEWBLOCK =
  '<link rel="icon" href="/favicon.ico" sizes="any">\n' +
  '  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">\n' +
  '  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">\n' +
  '  <link rel="apple-touch-icon" href="/apple-touch-icon.png">';

// old inline data-URI favicon (orange pulse squiggle) — exact string used sitewide
const OLD_DATAURI = /<link rel="icon" href="data:image\/svg\+xml,[^"]*E8710A[^"]*"\s*\/?>/g;
// lightbulb svg favicon links
const OLD_SVGFAV = /\s*<link rel="icon" type="image\/svg\+xml" href="\/(?:icon-192|icon-512|pulse-icon)\.svg">/g;
const OLD_PNGSVG = /\s*<link rel="icon"[^>]*href="\/pulse-icon\.svg"[^>]*>/g;

const EXCLUDE = /(_site_deploy|backup|preview|old|_tmp|_live|_home|_seo|home-v2|pulse-new|dark_backup|index_dark)/i;

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) { if (!/node_modules|\.git|_site_deploy|_brand_backup|_logo_backup|_DEPLOY_PARK/.test(fp)) walk(fp, acc); }
    else if (e.name.endsWith('.html') && !EXCLUDE.test(fp)) acc.push(fp);
  }
  return acc;
}

const files = walk(process.cwd(), []);
let changed = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8'); const orig = s;
  if (OLD_DATAURI.test(s)) { s = s.replace(OLD_DATAURI, NEWBLOCK); }
  s = s.replace(OLD_SVGFAV, '').replace(OLD_PNGSVG, '');
  if (s !== orig) { fs.writeFileSync(f, s); changed++; console.log('updated', path.relative(process.cwd(), f)); }
}
console.log(`\n${changed} file(s) updated of ${files.length} scanned`);
