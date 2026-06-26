const fs = require('fs');
const path = 'C:/Users/koryj/website/lab/rewrite-q2139-deep.js';
let s = fs.readFileSync(path, 'utf8');
const bt = String.fromCharCode(96);
const triple = bt + bt + bt;
const escTriple = '\\' + bt + '\\' + bt + '\\' + bt;
const startMarker = 'const flow = ' + bt;
const endMarker = bt + ';\n\n\n\nconst src';
const startIdx = s.indexOf(startMarker);
const endIdx = s.indexOf(endMarker, startIdx);
console.log('start', startIdx, 'end', endIdx);
if (startIdx < 0 || endIdx < 0) { console.error('markers not found'); process.exit(1); }
const before = s.slice(0, startIdx + startMarker.length);
const middle = s.slice(startIdx + startMarker.length, endIdx);
const after = s.slice(endIdx);
const tripleCount = (middle.match(new RegExp(triple, 'g')) || []).length;
const fixedMiddle = middle.split(triple).join(escTriple);
fs.writeFileSync(path, before + fixedMiddle + after);
console.log('replaced', tripleCount, 'triple-backticks');
