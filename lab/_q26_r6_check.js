const fs = require('fs');
const src = fs.readFileSync('lab/_q26_r6.js','utf8');
const m = src.match(/= `([\s\S]*)`;\s*$/);
const body = m[1];
const words = body.split(/\s+/).filter(Boolean).length;
console.log('word count:', words);
console.log('chars:', body.length);
const tickerRe = /\$[A-Z][A-Z0-9\-]+/g;
const tickers = body.match(tickerRe) || [];
console.log('ticker matches:', tickers.length);
console.log('unique tickers:', [...new Set(tickers)].slice(0, 30));

const checks = {
  'Direct Answer H3': /### Direct Answer/.test(body),
  'TLDR': /TL;DR/.test(body),
  'H2 banners (>=5)': (body.match(/^## /gm) || []).length >= 5,
  'Numbered subsections': /### \d+\.\d+/.test(body),
  'Bold-in-bullets': /\*\*[^*]+\*\*/.test(body),
  'Named operators+tickers': tickers.length >= 3,
  'Mermaid': /mermaid/.test(body),
  '6+ pipe tables (60+ rows)': (body.match(/^\|/gm) || []).length >= 60,
  'Counter-case': /counter-case/i.test(body),
  'Cross-links': /\[\[q\d+\]\]/.test(body),
  'Sources block': /Sources/i.test(body),
  'format_v 2026-05 stamp': /2026-05/.test(body),
};
console.log('--- 10-element gold check ---');
let pass = 0;
for (const [k, v] of Object.entries(checks)) {
  console.log(v ? 'OK ' : 'XX ', k);
  if (v) pass++;
}
console.log(`gold: ${pass}/${Object.keys(checks).length}`);
console.log('word floor 5500:', words >= 5500 ? 'PASS' : `FAIL by ${5500 - words}`);
console.log('H2 count:', (body.match(/^## /gm) || []).length);
console.log('Table row count:', (body.match(/^\|/gm) || []).length);
console.log('q-link count:', (body.match(/\[\[q\d+\]\]/g) || []).length);
console.log('Mermaid blocks:', (body.match(/```mermaid/g) || []).length);
