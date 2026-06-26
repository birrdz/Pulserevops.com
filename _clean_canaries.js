const fs = require('fs');
const P = 'C:/Users/koryj/website/netlify.toml';
let lines = fs.readFileSync(P, 'utf8').split('\n');
const out = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '[[redirects]]') {
    const from = lines[i + 1] || '';
    if (/from = "\/(zztestpillar|coachzztest)\/:id"/.test(from)) { i += 3; continue; }
  }
  out.push(lines[i]);
}
fs.writeFileSync(P, out.join('\n'));
const s = out.join('\n');
console.log('cleaned. /coaching/:id=' + (s.match(/from = "\/coaching\/:id"/g) || []).length +
  ' zztestpillar=' + (s.match(/zztestpillar/g) || []).length +
  ' coachzztest=' + (s.match(/coachzztest/g) || []).length +
  ' total redirects=' + (s.match(/^\[\[redirects\]\]/gm) || []).length);
