// Browse squares only: Pexels → untitled /assets/qa/{id}.sq.jpg
// NO face-card / mosaic / baked-title logic.
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
const USED_FILE = path.join(WD, '_browse_sq_used_pexels.json');
const MANIFEST = path.join(WD, '_browse_sq_manifest.json');
fs.mkdirSync(STORED, { recursive: true });

const SKIP = new Set((process.env.SKIP_PILLARS || 'gp,ik').split(',').map((s) => s.trim()).filter(Boolean));
const ONLY = (process.env.ONLY_PILLARS || '').split(',').map((s) => s.trim()).filter(Boolean);
const LIMIT = Math.max(1, parseInt(process.env.PER_PILLAR || '10', 10) || 10);

const PILLARS = [
  'ra','st','bs','cg','q','sk','sp','cd',
  'tk','tl','sw','ai','er','tc',
  'fr','es','bo',
  'ca','bt',
  'tv','rs','tn','sc',
  'gb','sy','co','mv',
  'dn','cl','nl','ev','ga','lv','wl',
  'hf','dr',
  'gm','aq','fs','cr','pt'
];

const THEME = {
  ra: 'revenue operations business strategy meeting',
  st: 'sales training presentation coaching team',
  bs: 'business books reading desk library',
  cg: 'executive coaching leadership mentor meeting',
  q: 'business knowledge library research desk',
  sk: 'professional skills training workshop',
  sp: 'public speaking stage presentation microphone',
  cd: 'business contract signing handshake documents',
  tk: 'technology software dashboard laptop office',
  tl: 'business tools calculator laptop productivity',
  sw: 'software developer computer screen code',
  ai: 'artificial intelligence technology data server',
  er: 'electronics gadgets smartphone tech product',
  tc: 'telecom network smartphone communication tower',
  fr: 'franchise retail store business storefront',
  es: 'luxury estate mansion property architecture',
  bo: 'commercial buildout construction interior renovation',
  ca: 'luxury car automobile dealership vehicle',
  bt: 'yacht boat marina ocean luxury',
  tv: 'travel destination suitcase airport vacation',
  rs: 'resort hotel pool luxury vacation',
  tn: 'small town main street downtown america',
  sc: 'school campus university education students',
  gb: 'graphic design creative studio branding',
  sy: 'fashion style clothing menswear luxury',
  co: 'collectibles vintage collection display',
  mv: 'cinema movie theater film projector',
  dn: 'fine dining restaurant food plate',
  cl: 'private club lounge upscale interior',
  nl: 'nightlife city lights bar evening',
  ev: 'event conference crowd celebration',
  ga: 'gathering friends dinner party celebration',
  lv: 'luxury living room modern home interior',
  wl: 'wellness spa yoga fitness calm',
  hf: 'high school football stadium game',
  dr: 'sports training drills practice field',
  gm: 'gaming console esports controller setup',
  aq: 'aquarium fish reef underwater coral',
  fs: 'fishing boat rod lake outdoors',
  cr: 'crabbing seafood crabs dock maryland',
  pt: 'pets dog cat companion animal'
};

function shortTitle(s, max) {
  max = max || 36;
  let raw = String(s || '').replace(/\s+/g, ' ').trim().replace(/[?]+$/g, '');
  let t = raw, year = '', ym = t.match(/\b(20\d{2})\s*$/);
  if (ym) { year = ' ' + ym[1]; t = t.slice(0, -ym[1].length).trim(); }
  const rules = [
    [/^top\s+(\d+)\s+best\s+(.+?)(?:\s+options)?$/i, (_, n, r) => 'Top ' + n + ' ' + r],
    [/^top\s+(\d+)\s+(.+)$/i, (_, n, r) => 'Top ' + n + ' ' + r],
    [/^what are the most common mistakes (?:in|with|for)\s+(.+)$/i, (_, r) => 'Common Mistakes in ' + r],
    [/^what should you know before investing in\s+(.+)$/i, (_, r) => 'Before Investing in ' + r],
    [/^how much does\s+(.+?)\s+cost(?:\s+in)?$/i, (_, r) => r + ' Cost'],
    [/^is\s+(.+?)\s+worth it(?:\s+in)?$/i, (_, r) => 'Is ' + r + ' Worth It'],
    [/^how do you get started with\s+(.+)$/i, (_, r) => 'Getting Started with ' + r],
    [/^how to\s+(.+)$/i, (_, r) => 'How to ' + r],
    [/^how do you\s+(.+)$/i, (_, r) => 'How to ' + r]
  ];
  let hit = false;
  for (const [re, fn] of rules) {
    const m = t.match(re);
    if (m) { t = fn(...m); hit = true; break; }
  }
  if (!hit) {
    t = t.replace(/^(what(?:'s| is| are| do| does| did| should| can| will)|how(?: to| do| does| can| should| much| many)|why(?: do| does| is| are)?|which|when|where|who)\s+/i, '');
    t = t.replace(/^(the|a|an)\s+/i, '');
  }
  t = t.replace(/\s+/g, ' ').trim();
  if (!t) t = raw.replace(/\b(20\d{2})\s*$/, '').trim();
  t = t.charAt(0).toUpperCase() + t.slice(1);
  const limit = Math.max(12, max - year.length);
  if (t.length <= limit) return (t + year).trim();
  let cut = t.slice(0, limit);
  const sp = cut.lastIndexOf(' ');
  if (sp >= 8) cut = cut.slice(0, sp);
  return (cut.replace(/[,:;.\-\u2013\u2014\s]+$/g, '') + year).trim();
}

function searchOf(pillar, question, title) {
  const base = String(title || question || '')
    .replace(/\b20\d{2}\b/g, '')
    .replace(/[^\w\s&]/g, ' ')
    .replace(/\b(top|best|how|what|worth|cost|common|mistakes|getting|started|before|investing|options|strategies)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
  const theme = THEME[pillar] || 'business professional';
  return (base + ' ' + theme).replace(/\s+/g, ' ').trim();
}

function loadUsed() {
  try { return new Set(JSON.parse(fs.readFileSync(USED_FILE, 'utf8'))); }
  catch (e) { return new Set(); }
}
function saveUsed(used) {
  fs.writeFileSync(USED_FILE, JSON.stringify([...used], null, 2));
}
function loadManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); }
  catch (e) { return {}; }
}

async function pexelsSearch(query, page) {
  const url = 'https://api.pexels.com/v1/search?query=' + encodeURIComponent(query)
    + '&per_page=15&page=' + page + '&orientation=landscape';
  const r = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!r.ok) throw new Error('Pexels ' + r.status + ' ' + query);
  return (await r.json()).photos || [];
}

async function dl(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('dl ' + r.status);
  return Buffer.from(await r.arrayBuffer());
}

async function fetchPillarEntries(pillar) {
  const url = 'https://pulserevops.com/.netlify/functions/pulse-machine-library-list?pillar='
    + encodeURIComponent(pillar) + '&recent=' + (LIMIT + 8) + '&sort=ts&mini=1';
  const r = await fetch(url);
  if (!r.ok) throw new Error('library ' + pillar + ' ' + r.status);
  const j = await r.json();
  const es = j.entries || j.items || j.results || j;
  return Array.isArray(es) ? es : [];
}

async function pickPhoto(search, used, theme) {
  const queries = [search, theme, theme + ' professional'];
  for (const q of queries) {
    for (let page = 1; page <= 4; page++) {
      let photos;
      try { photos = await pexelsSearch(q, page); }
      catch (e) {
        console.log('  pexels err', e.message);
        await new Promise((r) => setTimeout(r, 1200));
        continue;
      }
      for (const photo of photos) {
        const pid = String(photo.id);
        if (used.has(pid)) continue;
        const src = photo.src && (photo.src.large2x || photo.src.large || photo.src.original);
        if (!src) continue;
        try {
          const buf = await dl(src);
          if (buf.length < 8000) continue;
          return { pid, buf };
        } catch (e) {
          console.log('  skip dl', pid, e.message);
        }
      }
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return null;
}

(async () => {
  const used = loadUsed();
  const manifest = loadManifest();
  let list = PILLARS.filter((p) => !SKIP.has(p));
  if (ONLY.length) list = list.filter((p) => ONLY.includes(p));

  console.log('pillars', list.join(','), 'per=', LIMIT, 'usedPexels=', used.size);

  for (const pillar of list) {
    console.log('\n===', pillar, '===');
    let entries;
    try { entries = await fetchPillarEntries(pillar); }
    catch (e) { console.log('FAIL fetch', pillar, e.message); continue; }

    const seen = new Set();
    const cards = [];
    for (const e of entries) {
      if (!e || !e.id || seen.has(e.id)) continue;
      if (!String(e.id).toLowerCase().startsWith(pillar)) continue;
      seen.add(e.id);
      const q = e.question || e.title || '';
      const t = shortTitle(q, 36);
      cards.push({ id: e.id, q, t, search: searchOf(pillar, q, t) });
      if (cards.length >= LIMIT) break;
    }
    if (!cards.length) { console.log('no entries', pillar); continue; }

    const out = [];
    for (const card of cards) {
      const dest = path.join(QA, card.id + '.sq.jpg');
      if (fs.existsSync(dest) && fs.statSync(dest).size > 12000 && process.env.FORCE !== '1') {
        console.log('EXISTS', card.id, card.t);
        out.push({ ...card, skipped: true });
        continue;
      }
      const picked = await pickPhoto(card.search, used, THEME[pillar] || 'business');
      if (!picked) { console.log('NO PHOTO', card.id, card.search); continue; }
      await sharp(picked.buf)
        .rotate()
        .resize(900, 900, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(dest);
      const lib = path.join(STORED, pillar + '-' + card.id + '_' + picked.pid + '.jpg');
      fs.copyFileSync(dest, lib);
      used.add(picked.pid);
      out.push({ ...card, pexelsId: picked.pid, bytes: fs.statSync(dest).size });
      console.log('OK', card.id, 'pexels', picked.pid, card.t);
      await new Promise((r) => setTimeout(r, 200));
    }
    manifest[pillar] = out;
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    saveUsed(used);
    console.log('done', pillar, out.length);
  }
  console.log('\nALL DONE used=', used.size);
})().catch((e) => { console.error(e); process.exit(1); });
