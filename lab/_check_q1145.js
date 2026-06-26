// quick sanity-check word/asset count for q1145
const fs = require('fs');
const src = fs.readFileSync('./lab/rewrite-q1145-deep.js', 'utf8');
function grab(name) {
  const re = new RegExp('const ' + name + ' = `([\\s\\S]*?)`;');
  const m = src.match(re);
  return m ? m[1] : '';
}
const tldr = grab('tldr');
const core = grab('core');
const flow = grab('flow');
const srcBlock = grab('src');
const num = grab('num');
const counter = grab('counter');
const links = grab('links');
const v9 = tldr + core + flow + srcBlock + num + counter + links;
const words = v9.split(/\s+/).filter(Boolean).length;
console.log('v9 words:', words);
console.log('v9 length:', v9.length);
console.log('mermaid blocks:', (v9.match(/mermaid/g) || []).length);
console.log('URLs:', (v9.match(/https?:\/\//g) || []).length);
console.log('pipe table separators:', (v9.match(/\|---/g) || []).length);
console.log('q-IDs:', (v9.match(/q\d+/g) || []).length);
console.log('counter rows:', (num.match(/^\| \d+/gm) || []).length);
console.log('H3 count:', (core.match(/^### /gm) || []).length);
console.log('PART headers:', (core.match(/## .+ PART \d/g) || []).length);
