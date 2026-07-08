// _link_tan_css.js — inject the shared light-tan stylesheet link into every
// public HTML page's <head> (idempotent). Skips junk/backup/preview/node_modules.
// Usage: node _link_tan_css.js <rootDir>
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2];
if (!ROOT) { console.error('usage: node _link_tan_css.js <rootDir>'); process.exit(1); }
const LINK = '<link rel="stylesheet" href="/assets/pulse-tan.css">';
const SKIP_DIR = /(^|[\\/])(node_modules|archive|\.netlify|\.git)([\\/]|$)/i;
const SKIP_FILE = /(backup|preview|-old|_old|googlee[0-9a-f]+\.html$|tslib)/i;
const isTemp = (b) => b.startsWith('_'); // _knowledge_head.html, _audit_*, etc.

let injected = 0, already = 0, skipped = 0, scanned = 0;
function walk(dir) {
  let ents;
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  for (const e of ents) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIR.test(full)) walk(full); continue; }
    if (!e.name.toLowerCase().endsWith('.html')) continue;
    scanned++;
    if (SKIP_FILE.test(e.name) || isTemp(e.name)) { skipped++; continue; }
    let html;
    try { html = fs.readFileSync(full, 'utf8'); } catch (e2) { continue; }
    if (!/<\/head>/i.test(html)) { skipped++; continue; }
    if (html.includes('pulse-tan.css')) { already++; continue; }
    // inject before the FIRST </head>
    html = html.replace(/<\/head>/i, '  ' + LINK + '\n</head>');
    try { fs.writeFileSync(full, html); injected++; } catch (e3) { skipped++; }
  }
}
walk(ROOT);
console.log(`root=${ROOT}\nscanned=${scanned} injected=${injected} already=${already} skipped=${skipped}`);
