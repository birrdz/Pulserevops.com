// Build 300-entry sales training sprint queue st0499–st0798 (skip existing titles).
const fs = require('fs');
const phrases = require('./_st_keyword_phrases.json');

const mk = (title, slug) => ({ title, slug });
const sl = (s) => ('st-' + s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const existing = fs.existsSync('C:/Users/koryj/website/_st_existing_titles.json')
  ? new Set(JSON.parse(fs.readFileSync('C:/Users/koryj/website/_st_existing_titles.json', 'utf8')))
  : new Set();

const pools = phrases.map((p) => {
  const title = /^top 10/i.test(p) ? p : `Top 10 ${p.replace(/^Best /i, '')}`;
  return mk(title, sl(title));
});

const seen = new Set(existing);
const unique = [];
for (const row of pools) {
  if (seen.has(row.title)) continue;
  seen.add(row.title);
  unique.push(row);
}

let n = 0;
while (unique.length < 300) {
  const row = mk(`Top 10 Sales Training Drills for Managers — Edition ${n + 1}`, sl(`manager-edition-${n}`));
  if (!seen.has(row.title)) {
    seen.add(row.title);
    unique.push(row);
  }
  n++;
}

const START = 499;
const out = unique.slice(0, 300).map((e, i) => ({
  id: 'st' + String(START + i).padStart(4, '0'),
  title: e.title,
  slug: e.slug,
}));

fs.writeFileSync('C:/Users/koryj/website/_st_sprint300.json', JSON.stringify(out, null, 2));
console.log('queue', out.length, 'first', out[0].id, out[0].title, 'last', out[out.length - 1].id);
