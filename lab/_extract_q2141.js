const fs = require('fs');
const b = fs.readFileSync('_q2141_raw.json', 'utf8');
// Find the longest "text" or "answer" string in the embedded JSON
const reText = /"text":"((?:[^"\\]|\\.)*)"/g;
const reAns = /"answer":"((?:[^"\\]|\\.)*)"/g;
let m, longest = '';
while ((m = reText.exec(b)) !== null) { if (m[1].length > longest.length) longest = m[1]; }
while ((m = reAns.exec(b)) !== null) { if (m[1].length > longest.length) longest = m[1]; }
let txt = longest
  .replace(/\\n/g, '\n')
  .replace(/\\"/g, '"')
  .replace(/\\u003c/g, '<')
  .replace(/\\u003e/g, '>')
  .replace(/\\u0026/g, '&')
  .replace(/\\\\/g, '\\');
console.log('chars:', txt.length, 'words:', txt.trim().split(/\s+/).length);
fs.writeFileSync('_q2141_answer.txt', txt);
console.log('--- first 1800 ---');
console.log(txt.slice(0, 1800));
console.log('--- last 1000 ---');
console.log(txt.slice(-1000));
