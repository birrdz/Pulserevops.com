// Inject pulse-ambient (+ idle scroll / endless helpers via ambient) into public HTML pages.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname);
const SKIP = new Set(['lab', '_site_deploy', 'derby', 'node_modules']);

function walk(dir, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name) || ent.name.startsWith('_tmp') || ent.name.startsWith('_live')) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html') && !ent.name.startsWith('_')) out.push(p);
  }
}

const files = [];
walk(ROOT, files);
let ambientAdded = 0, idleAdded = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (!html.includes('pulse-ambient.js')) {
    const tag = '<script src="/pulse-ambient.js" defer></script>\n';
    if (html.includes('</body>')) {
      html = html.replace('</body>', tag + '</body>');
      ambientAdded++;
      changed = true;
    }
  }
  if (!html.includes('pulse-idle-scroll.js') && !html.includes('pulse-ambient.js')) {
    const tag = '<script src="/js/pulse-idle-scroll.js" defer></script>\n';
    if (html.includes('</body>')) {
      html = html.replace('</body>', tag + '</body>');
      idleAdded++;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, html);
}

console.log('Scanned', files.length, 'html files');
console.log('Added pulse-ambient:', ambientAdded);
console.log('Added pulse-idle-scroll (no ambient):', idleAdded);
