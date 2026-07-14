'use strict';
/** One-shot: pull unique library/bookshelf photos into assets/qa/_pexels_stored for BS bank. */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WD = __dirname;
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
}

const INV = path.join(WD, 'assets', 'qa', '_pexels_stored');
const KEY = process.env.PEXELS_API_KEY || '';
if (!KEY) {
  console.error('no PEXELS_API_KEY');
  process.exit(1);
}

const queries = [
  'public library bookshelf reading room',
  'university library aisle bookshelves',
  'library bookshelves rows of books quiet',
  'person browsing library bookshelves',
  'open hardcover book library desk',
  'stack hardcover books library table',
  'quiet reading room library books',
  'bookstore shelf nonfiction books',
  'students studying library books table',
  'library study carrel open books',
];

const st = JSON.parse(fs.readFileSync(path.join(WD, '_bs_topic_review_state.json'), 'utf8'));
const used = new Set(Object.keys(st.usedPhotos || {}));
for (const n of fs.readdirSync(INV)) {
  const m = n.match(/_(\d+)\.jpe?g$/i);
  if (m) used.add(m[1]);
}

async function aHash(buf) {
  const raw = await sharp(buf).rotate().greyscale().resize(8, 8, { fit: 'fill' }).raw().toBuffer();
  let sum = 0;
  for (const v of raw) sum += v;
  const avg = sum / raw.length;
  let bits = '';
  for (const v of raw) bits += v >= avg ? '1' : '0';
  return bits;
}
function ham(a, b) {
  let d = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) d++;
  return d;
}

const ahashes = [];
const TARGET = 90;
let saved = 0;
let skipped = 0;

(async () => {
  for (const q of queries) {
    if (saved >= TARGET) break;
    for (let page = 1; page <= 4 && saved < TARGET; page++) {
      const url =
        'https://api.pexels.com/v1/search?query=' +
        encodeURIComponent(q) +
        '&per_page=30&page=' +
        page +
        '&orientation=landscape';
      const r = await fetch(url, { headers: { Authorization: KEY } });
      if (!r.ok) {
        console.log('api', r.status, q);
        break;
      }
      const j = await r.json();
      for (const ph of j.photos || []) {
        if (saved >= TARGET) break;
        const pid = String(ph.id);
        if (used.has(pid)) continue;
        const src = (ph.src && (ph.src.large2x || ph.src.large || ph.src.original)) || '';
        if (!src) continue;
        try {
          const ir = await fetch(src, { signal: AbortSignal.timeout(30000) });
          if (!ir.ok) continue;
          const buf = Buffer.from(await ir.arrayBuffer());
          if (buf.length < 8000) continue;
          const ah = await aHash(buf);
          if (ahashes.some((prev) => ham(prev, ah) <= 16)) {
            skipped++;
            continue;
          }
          const slug = q
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 48);
          const file = slug + '_' + pid + '.jpg';
          await sharp(buf).rotate().jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(INV, file));
          used.add(pid);
          ahashes.push(ah);
          saved++;
          if (saved % 10 === 0) console.log('saved', saved, file);
        } catch (e) {}
      }
      await new Promise((r) => setTimeout(r, 350));
    }
  }
  console.log(JSON.stringify({ saved, skipped }));
})();
