const fs = require('fs');
const indexPath = 'C:\\Users\\koryj\\website\\index.html';
const scriptPath = 'C:\\Users\\koryj\\website\\_restore_mosaic_script.txt';
let html = fs.readFileSync(indexPath, 'utf8');
const script = fs.readFileSync(scriptPath, 'utf8');
const start = html.indexOf('<link rel="stylesheet" href="/css/pulse-mosaic.css">');
const end = html.indexOf('<!-- IDLE AUTO-SCROLL', start);
if (start < 0 || end < 0) {
  console.error('markers not found', start, end);
  process.exit(1);
}
const replacement = '<link rel="stylesheet" href="/css/pulse-mosaic.css">\n' + script + '\n';
html = html.slice(0, start) + replacement + html.slice(end);
fs.writeFileSync(indexPath, html);
console.log('patched index.html');
