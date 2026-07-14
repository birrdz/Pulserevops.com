// Pull 10 fresh title-matched Pexels photos → untitled .sq.jpg for GTM browse cards.
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
if (!API_KEY) {
  console.error('Missing PEXELS_API_KEY');
  process.exit(1);
}

const STORED = path.join(WD, 'assets', 'qa', '_pexels_stored');
const QA = path.join(WD, 'assets', 'qa');
const OUT_MAP = path.join(WD, '_preview_gtm10_pexels.json');

/** Each card: id, short title for HTML, Pexels search query that fits the topic. */
const CARDS = [
  {
    id: 'gp515',
    t: 'Getting Started with GTM 2027',
    q: 'How do you get started with GTM Playbooks in 2027?',
    search: 'business team planning whiteboard strategy meeting'
  },
  {
    id: 'gp514',
    t: 'Is GTM Playbooks Worth It 2027',
    q: 'Is GTM Playbooks worth it in 2027?',
    search: 'business handshake deal agreement office success'
  },
  {
    id: 'gp0511',
    t: 'Inbound Demand-Capture GTM 2027',
    q: 'Inbound demand-capture GTM playbook in 2027',
    search: 'digital marketing analytics laptop dashboard leads'
  },
  {
    id: 'gp0510',
    t: 'Sales-Assisted PLG for 2027',
    q: 'Sales-assisted PLG for mid-market in 2027',
    search: 'sales meeting client consultation laptop office'
  },
  {
    id: 'gp0509',
    t: 'Reseller and VAR Channel GTM',
    q: 'Reseller and VAR channel GTM playbook in 2027',
    search: 'business partners handshake partnership corporate'
  },
  {
    id: 'gp0508',
    t: 'International Geo-Expansion GTM',
    q: 'International and geo-expansion GTM playbook in 2027',
    search: 'world globe international business travel airport'
  },
  {
    id: 'gp0507',
    t: 'Vertical SaaS GTM for Healthcare',
    q: 'Vertical SaaS go-to-market playbook for healthcare in 2027',
    search: 'doctor hospital healthcare medical professional clinic'
  },
  {
    id: 'gp0506',
    t: 'Usage-Based Pricing GTM Motion',
    q: 'Usage-based pricing GTM motion in 2027',
    search: 'pricing calculator finance spreadsheet money business'
  },
  {
    id: 'gp0505',
    t: 'ABM GTM Playbook for Enterprise',
    q: 'Account-based marketing (ABM) GTM playbook for enterprise in 2027',
    search: 'corporate boardroom executives skyscraper enterprise office'
  },
  {
    id: 'gp0504',
    t: 'Event-Led Field-Marketing GTM',
    q: 'Event-led and field-marketing GTM playbook in 2027',
    search: 'business conference stage speaker audience event marketing'
  }
];

async function pexelsSearch(query, page) {
  const url = 'https://api.pexels.com/v1/search?query=' + encodeURIComponent(query)
    + '&per_page=15&page=' + page + '&orientation=landscape';
  const r = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!r.ok) throw new Error('Pexels ' + r.status + ' ' + (await r.text()).slice(0, 120));
  return (await r.json()).photos || [];
}

async function downloadBuf(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('dl ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

async function toSquareJpg(buf, dest) {
  await sharp(buf)
    .rotate()
    .resize(760, 760, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
}

(async () => {
  const usedIds = new Set();
  const results = [];
  for (const card of CARDS) {
    let picked = null;
    for (let page = 1; page <= 3 && !picked; page++) {
      const photos = await pexelsSearch(card.search, page);
      for (const photo of photos) {
        const pid = String(photo.id);
        if (usedIds.has(pid)) continue;
        const src = photo.src && (photo.src.large2x || photo.src.large || photo.src.original);
        if (!src) continue;
        try {
          const buf = await downloadBuf(src);
          if (buf.length < 8000) continue;
          const sqPath = path.join(QA, card.id + '.sq.jpg');
          const libName = 'gtm-' + card.id + '_' + pid + '.jpg';
          const libPath = path.join(STORED, libName);
          await toSquareJpg(buf, sqPath);
          await toSquareJpg(buf, libPath);
          usedIds.add(pid);
          picked = {
            id: card.id,
            t: card.t,
            q: card.q,
            pexelsId: pid,
            photographer: photo.photographer || '',
            search: card.search,
            sq: '/assets/qa/' + card.id + '.sq.jpg',
            bytes: fs.statSync(sqPath).size
          };
          console.log('OK', card.id, 'pexels', pid, card.search.slice(0, 40), 'bytes', picked.bytes);
          break;
        } catch (e) {
          console.log('skip', card.id, pid, e.message);
        }
      }
    }
    if (!picked) throw new Error('No photo for ' + card.id + ' (' + card.search + ')');
    results.push(picked);
  }
  fs.writeFileSync(OUT_MAP, JSON.stringify(results, null, 2));
  console.log('Wrote', OUT_MAP);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
