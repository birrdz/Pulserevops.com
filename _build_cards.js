// Reusable card builder for the Top-10 backfill loop (Serper Google Images).
// Usage: node _build_cards.js <id> ["query context suffix"]
// - fetches the live entry, extracts the 10 "## N. <name>" item names
// - ONE Serper /images batch call -> real Google image + source page per item
// - HEAD-verifies each image (200 + image content-type); tries next candidates
// - writes C:/Users/koryj/<id>_orig.json, <id>_answer.md, <id>_cards.tsv
//   tsv columns: idx \t name \t img \t site(specs/details link) \t buy(empty)
const fs = require('fs');

const id = process.argv[2];
const ctx = process.argv[3] || '';
if (!id) { console.error('usage: node _build_cards.js <id> [ctx]'); process.exit(1); }

// SERPER key from .env.local
let KEY = '';
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  const m = env.match(/^SERPER_API_KEY=(.+)$/m);
  if (m) KEY = m[1].trim();
} catch (e) {}
if (!KEY) { console.error('no SERPER_API_KEY in .env.local'); process.exit(1); }

function clean(name) {
  return name
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu, ' ')
    .replace(/\bBEST OVERALL\b/gi, '')
    .replace(/\bBEST VALUE\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('image/')) return true;
    // some CDNs reject HEAD; try a tiny ranged GET
    if (!r.ok || !ct) {
      const g = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1024' }, redirect: 'follow', signal: AbortSignal.timeout(12000) });
      const ct2 = (g.headers.get('content-type') || '').toLowerCase();
      return g.ok && ct2.startsWith('image/');
    }
    return false;
  } catch (e) { return false; }
}

(async () => {
  // 1) fetch entry
  const res = await fetch('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?id=' + id, { signal: AbortSignal.timeout(20000) });
  const j = await res.json();
  if (!j || !j.answer) { console.error('no entry body for ' + id); process.exit(1); }
  // strip any existing @@PRODUCT lines so this is idempotent / re-runnable
  const cleanBody = j.answer.split(/\r?\n/).filter(l => !/^@@PRODUCT/.test(l)).join('\n');
  fs.writeFileSync('C:/Users/koryj/' + id + '_orig.json', JSON.stringify({ question: j.question, tags: j.tags }));
  fs.writeFileSync('C:/Users/koryj/' + id + '_answer.md', cleanBody);

  // 2) item names
  const names = [];
  for (const line of cleanBody.split(/\r?\n/)) {
    const m = line.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (m) names.push({ idx: m[1], raw: m[2], q: clean(m[2]) });
  }
  if (!names.length) { console.error('no item headers in ' + id); process.exit(1); }

  // 3) Serper images batch
  const body = names.map(n => ({ q: n.q + (ctx ? ' ' + ctx : '') }));
  const sr = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  const data = await sr.json();
  const results = Array.isArray(data) ? data : [data];

  // 4) per item: first image that HEAD-verifies; source page = specs/details link
  const used = new Set();
  const rows = [];
  let imgs = 0, links = 0;
  for (let i = 0; i < names.length; i++) {
    const imgsArr = (results[i] && results[i].images) || [];
    let img = '', site = '';
    for (const cand of imgsArr.slice(0, 6)) {
      const u = cand.imageUrl;
      if (!u || used.has(u)) continue;
      if (await headOk(u)) { img = u; used.add(u); site = cand.link || ''; break; }
    }
    // if no verified image, still capture a source link from the first result
    if (!site && imgsArr[0]) site = imgsArr[0].link || '';
    if (img) imgs++;
    if (site) links++;
    rows.push([names[i].idx, names[i].q, img, site, ''].join('\t'));
  }
  fs.writeFileSync('C:/Users/koryj/' + id + '_cards.tsv', rows.join('\n') + '\n');
  console.log(JSON.stringify({ id, items: names.length, imgs, links }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
