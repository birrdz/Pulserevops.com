// Re-escape unescaped control chars inside the JSON string for q1209.
const fs = require('fs');
const raw = fs.readFileSync('lab/cheap-100/q1209.json', 'utf8');

let inStr = false;
let esc = false;
let out = '';

for (let i = 0; i < raw.length; i++) {
  const c = raw[i];
  if (esc) {
    out += c;
    esc = false;
    continue;
  }
  if (c === '\\') {
    out += c;
    esc = true;
    continue;
  }
  if (c === '"') {
    out += c;
    inStr = !inStr;
    continue;
  }
  if (inStr) {
    if (c === '\n') { out += '\\n'; continue; }
    if (c === '\r') { out += '\\r'; continue; }
    if (c === '\t') { out += '\\t'; continue; }
  }
  out += c;
}

try {
  const j = JSON.parse(out);
  fs.writeFileSync('lab/cheap-100/q1209.json', JSON.stringify(j));
  console.log('q1209 repaired · answer len:', (j.answer || '').length, '· mermaid:', /```mermaid/.test(j.answer || ''));
} catch (e) {
  console.log('still broken:', e.message);
}
