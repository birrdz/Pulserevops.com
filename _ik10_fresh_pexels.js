// Industry KPIs first 10 — title-matched Pexels → untitled .sq.jpg
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WD = __dirname;
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const API_KEY = process.env.PEXELS_API_KEY || '';
if (!API_KEY) { console.error('Missing PEXELS_API_KEY'); process.exit(1); }

const QA = path.join(WD, 'assets', 'qa');
const STORED = path.join(QA, '_pexels_stored');

const CARDS = [
  { id: 'ik0719', t: 'Solar Panel Installation KPIs 2027', q: 'Top 10 Solar Panel Installation Revenue KPIs in 2027', search: 'solar panel installation rooftop renewable energy' },
  { id: 'ik0718', t: 'Car Rental Company KPIs 2027', q: 'Top 10 Car Rental Company Revenue KPIs in 2027', search: 'car rental keys dealership vehicles row' },
  { id: 'ik0717', t: 'Cruise Line Revenue KPIs 2027', q: 'Top 10 Cruise Line Revenue KPIs in 2027', search: 'cruise ship ocean luxury liner' },
  { id: 'ik0716', t: 'University Revenue KPIs 2027', q: 'Top 10 University Revenue KPIs in 2027', search: 'university campus college students library' },
  { id: 'ik0715', t: 'Real Estate Agency KPIs 2027', q: 'Top 10 Real Estate Agency Revenue KPIs in 2027', search: 'real estate agent house keys home sale' },
  { id: 'ik0714', t: 'Oil & Gas Upstream KPIs 2027', q: 'Top 10 Oil & Gas Upstream Revenue KPIs in 2027', search: 'oil gas industry refinery energy workers' },
  { id: 'ik0713', t: 'Cloud Computing KPIs 2027', q: 'Top 10 Cloud Computing Provider Revenue KPIs in 2027', search: 'data center servers cloud computing technology' },
  { id: 'ik0712', t: 'Fitness Center Revenue KPIs 2027', q: 'Top 10 Fitness Center Revenue KPIs in 2027', search: 'fitness gym workout training center' },
  { id: 'ik0711', t: 'Coffee Shop Chain KPIs 2027', q: 'Top 10 Coffee Shop Chain Revenue KPIs in 2027', search: 'coffee shop barista cafe espresso' },
  { id: 'ik0710', t: 'Brewery Revenue KPIs 2027', q: 'Top 10 Brewery Revenue KPIs in 2027', search: 'brewery beer taps craft brewing' }
];

async function pexelsSearch(query, page) {
  const url = 'https://api.pexels.com/v1/search?query=' + encodeURIComponent(query)
    + '&per_page=12&page=' + page + '&orientation=landscape';
  const r = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!r.ok) throw new Error('Pexels ' + r.status);
  return (await r.json()).photos || [];
}

async function dl(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('dl ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

(async () => {
  const used = new Set();
  const out = [];
  for (const card of CARDS) {
    let picked = null;
    for (let page = 1; page <= 3 && !picked; page++) {
      const photos = await pexelsSearch(card.search, page);
      for (const photo of photos) {
        const pid = String(photo.id);
        if (used.has(pid)) continue;
        const src = photo.src && (photo.src.large2x || photo.src.large || photo.src.original);
        if (!src) continue;
        try {
          const buf = await dl(src);
          if (buf.length < 8000) continue;
          const dest = path.join(QA, card.id + '.sq.jpg');
          await sharp(buf)
            .rotate()
            .resize(900, 900, { fit: 'cover', position: 'attention' })
            .jpeg({ quality: 88, mozjpeg: true })
            .toFile(dest);
          const lib = path.join(STORED, 'ik-' + card.id + '_' + pid + '.jpg');
          fs.copyFileSync(dest, lib);
          used.add(pid);
          picked = {
            id: card.id,
            t: card.t,
            q: card.q,
            pexelsId: pid,
            search: card.search,
            bytes: fs.statSync(dest).size
          };
          console.log('OK', card.id, 'pexels', pid, card.t);
          break;
        } catch (e) {
          console.log('skip', card.id, pid, e.message);
        }
      }
    }
    if (!picked) throw new Error('No photo for ' + card.id);
    out.push(picked);
  }
  fs.writeFileSync(path.join(WD, '_preview_ik10.json'), JSON.stringify(out, null, 2));
  console.log('done', out.length);
})().catch((e) => { console.error(e); process.exit(1); });
