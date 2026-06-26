// Reusable @@PRODUCT inserter for the Top-10 backfill loop.
// Usage: node _insert_cards.js <id>
// Reads  C:/Users/koryj/<id>_cards.tsv  (idx \t name \t img \t site \t buy  per line)
//   and  C:/Users/koryj/<id>_answer.md
// Inserts one @@PRODUCT line under each "## N." header. Guards double-insert.
const fs = require('fs');
const id = process.argv[2];
if (!id) { console.error('usage: node _insert_cards.js <id>'); process.exit(1); }
const md = `C:/Users/koryj/${id}_answer.md`;
const tsv = `C:/Users/koryj/${id}_cards.tsv`;
let body = fs.readFileSync(md, 'utf8');
if (body.includes('@@PRODUCT')) { console.log('ALREADY HAS @@PRODUCT - aborting'); process.exit(1); }
const cards = {};
for (const line of fs.readFileSync(tsv, 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue;
  const [idx, name, img, site, buy] = line.split('\t');
  let s = '@@PRODUCT';
  if (name) s += ` name="${name.replace(/"/g, '')}"`;
  if (img)  s += ` img="${img.replace(/"/g, '')}"`;
  if (site) s += ` site="${site.replace(/"/g, '')}"`;
  if (buy)  s += ` buy="${buy.replace(/"/g, '')}"`;
  cards[idx] = s;
}
const out = [];
let n = 0;
for (const line of body.split(/\r?\n/)) {
  out.push(line);
  const m = line.match(/^##\s+(\d+)\.\s/);
  if (m && cards[m[1]]) { out.push(cards[m[1]]); n++; }
}
fs.writeFileSync(md, out.join('\n'));
const imgs = Object.values(cards).filter(c => c.includes(' img=')).length;
const links = Object.values(cards).filter(c => c.includes(' site=') || c.includes(' buy=')).length;
console.log(JSON.stringify({ inserted: n, imgs, links }));
