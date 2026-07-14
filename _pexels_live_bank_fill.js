'use strict';
/**
 * Fill assets/qa/_live_bank/ from Pexels — local CDN bank for DD/fixer.
 * Target: BANK_TARGET (default 1000) new unique JPGs.
 * Hard throttle via pexels-throttle (≥18s). Does NOT write live face cards.
 *
 * Usage: node _pexels_live_bank_fill.js
 *        BANK_TARGET=1000 node _pexels_live_bank_fill.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const WD = __dirname;
for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { pexelsRequest } = require('./netlify/functions/lib/pexels-throttle');
const { isBlockedPexelsId } = require('./_pexels_consume_lib');

const BANK = path.join(WD, 'assets', 'qa', '_live_bank');
const MANI = path.join(BANK, '_manifest.json');
const HASH_F = path.join(BANK, '_hashes.json');
const LOG = path.join(WD, '_pexels_live_bank_fill.log');
const TARGET = parseInt(process.env.BANK_TARGET || '1000', 10) || 1000;
const KEY = process.env.PEXELS_API_KEY || '';

fs.mkdirSync(BANK, { recursive: true });

const QUERIES = [
  // buildings / offices
  'modern office building exterior', 'glass office building', 'corporate headquarters',
  'city skyline architecture', 'office lobby interior', 'open office workspace',
  'conference room meeting', 'business office desk', 'coworking space',
  // people / work
  'business people meeting', 'sales team meeting', 'professional handshake',
  'woman working laptop office', 'man presenting whiteboard', 'team collaboration office',
  // venues
  'conference venue hall', 'hotel ballroom event', 'convention center',
  'restaurant dining room', 'retail store interior', 'warehouse logistics',
  // industry / services / agriculture
  'factory manufacturing floor', 'construction site workers', 'farm agriculture field',
  'butcher shop meat counter', 'bakery shop display', 'auto repair garage',
  'medical clinic reception', 'dental office', 'salon barbershop',
  'plumbing service van', 'electrician work', 'landscaping crew',
  'shipping docks trucks', 'data center servers', 'call center office',
  // revops-ish
  'crm dashboard laptop', 'startup office', 'boardroom executives',
  'bookstore library shelves', 'training classroom workshop',
];

function log(m) {
  const line = new Date().toISOString() + ' ' + m;
  console.log(line);
  try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {}
}
function readJSON(f, d) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; }
}
function writeJSON(f, o) {
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
}
function countBank() {
  try {
    return fs.readdirSync(BANK).filter((n) => /\.jpe?g$/i.test(n) && fs.statSync(path.join(BANK, n)).size > 8000).length;
  } catch (e) { return 0; }
}

async function search(query, page) {
  const url =
    'https://api.pexels.com/v1/search?per_page=15&orientation=landscape&page=' +
    page +
    '&query=' +
    encodeURIComponent(query);
  const r = await pexelsRequest(async () => {
    const res = await fetch(url, {
      headers: { Authorization: KEY },
      signal: AbortSignal.timeout(30000),
    });
    const buf = Buffer.from(await res.arrayBuffer());
    return { status: res.status, body: buf };
  });
  if (r.status !== 200) throw new Error('pexels ' + r.status);
  return JSON.parse(r.body.toString('utf8'));
}

async function downloadToBank(photo, query) {
  const id = String(photo.id);
  if (isBlockedPexelsId(id)) return null;
  const src = (photo.src && (photo.src.large2x || photo.src.large || photo.src.original)) || '';
  if (!src) return null;
  const dl = await fetch(src, { signal: AbortSignal.timeout(60000) });
  if (!dl.ok) return null;
  const buf = Buffer.from(await dl.arrayBuffer());
  if (buf.length < 8000) return null;
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  const hashes = new Set(readJSON(HASH_F, []));
  if (hashes.has(hash)) return null;
  const name = 'pexels_' + id + '.jpg';
  const dest = path.join(BANK, name);
  if (fs.existsSync(dest)) return null;
  await sharp(buf)
    .rotate()
    .resize(1400, 1400, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(dest);
  hashes.add(hash);
  writeJSON(HASH_F, [...hashes]);
  const mani = readJSON(MANI, { slots: [] });
  mani.slots.push({
    file: name,
    pexelsId: id,
    query,
    hash,
    at: new Date().toISOString(),
    w: photo.width,
    h: photo.height,
  });
  writeJSON(MANI, mani);
  return name;
}

(async () => {
  if (!KEY) {
    log('FATAL no PEXELS_API_KEY');
    process.exit(2);
  }
  let have = countBank();
  log('start have=' + have + ' target=' + TARGET);
  let qi = 0;
  const pages = {};
  let added = 0;
  let misses = 0;
  while (have + added < TARGET) {
    const q = QUERIES[qi % QUERIES.length];
    pages[q] = (pages[q] || 0) + 1;
    qi++;
    try {
      const data = await search(q, pages[q]);
      const photos = data.photos || [];
      if (!photos.length) {
        misses++;
        log('empty q=' + q + ' page=' + pages[q]);
        continue;
      }
      for (const p of photos) {
        if (have + added >= TARGET) break;
        try {
          const name = await downloadToBank(p, q);
          if (name) {
            added++;
            if (added % 25 === 0 || have + added >= TARGET) {
              log('added ' + added + ' total~' + (have + added) + '/' + TARGET + ' last=' + name + ' q=' + q);
            }
          }
        } catch (e) {
          log('dl-fail ' + (e && e.message));
        }
      }
    } catch (e) {
      log('search-fail ' + q + ' · ' + (e && e.message));
      misses++;
      if (misses > 40) {
        log('too many misses — pause');
        break;
      }
    }
  }
  log('DONE added=' + added + ' bank=' + countBank());
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
