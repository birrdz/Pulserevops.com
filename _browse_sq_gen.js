// Browse squares ONLY — untitled /assets/qa/{id}.sq.jpg
// Providers: Pollinations → Cloudflare → DDG (NO Pexels, NO face-card bake)
// Serial: ONE image at a time, GAP_MS between each (default 60000)
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const WD = __dirname;
try {
  for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const QA = path.join(WD, 'assets', 'qa');
const STORED = path.join(QA, '_gen_stored');
const MANIFEST = path.join(WD, '_browse_sq_gen_manifest.json');
const HASH_FILE = path.join(WD, '_browse_sq_gen_hashes.json');
fs.mkdirSync(STORED, { recursive: true });

const GAP_MS = Math.max(60000, parseInt(process.env.GAP_MS || '60000', 10) || 60000);
const LIMIT = Math.max(1, parseInt(process.env.PER_PILLAR || '10', 10) || 10);
const ONLY = (process.env.ONLY_PILLARS || '').split(',').map((s) => s.trim()).filter(Boolean);
const FORCE = process.env.FORCE === '1';
const PTOK = process.env.POLLINATIONS_TOKEN || process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_API_KEY || '';

const PILLARS = [
  'ra','st','bs','cg','q','sk','sp','cd',
  'tk','tl','sw','ai','er','tc',
  'fr','es','bo','ca','bt',
  'tv','rs','tn','sc',
  'gb','sy','co','mv',
  'dn','cl','nl','ev','ga','lv','wl',
  'hf','dr','gm','aq','fs','cr','pt'
];
// gp + ik already approved — skip unless ONLY forces them
const SKIP = new Set((process.env.SKIP_PILLARS || 'gp,ik').split(',').map((s) => s.trim()).filter(Boolean));

const THEME = {
  ra: 'revenue operations strategy meeting office',
  st: 'sales training coaching presentation team',
  bs: 'business books reading desk',
  cg: 'executive coaching leadership mentor',
  q: 'business research knowledge desk',
  sk: 'professional skills workshop training',
  sp: 'public speaking stage microphone',
  cd: 'business contract signing documents',
  tk: 'technology software laptop dashboard',
  tl: 'business productivity tools laptop',
  sw: 'software developer computer screen',
  ai: 'artificial intelligence data technology',
  er: 'electronics gadgets smartphone',
  tc: 'telecom smartphone network communication',
  fr: 'franchise retail storefront business',
  es: 'luxury estate mansion property',
  bo: 'commercial interior buildout construction',
  ca: 'luxury car automobile dealership',
  bt: 'yacht boat marina ocean',
  tv: 'travel destination vacation suitcase',
  rs: 'luxury resort hotel pool',
  tn: 'small town main street downtown',
  sc: 'school campus university students',
  gb: 'graphic design creative studio',
  sy: 'fashion style clothing menswear',
  co: 'collectibles vintage collection',
  mv: 'cinema movie theater film',
  dn: 'fine dining restaurant food',
  cl: 'private club lounge upscale',
  nl: 'nightlife city lights evening',
  ev: 'event conference celebration crowd',
  ga: 'gathering dinner party friends',
  lv: 'luxury living room modern home',
  wl: 'wellness spa yoga calm',
  hf: 'high school football stadium',
  dr: 'sports training drills practice',
  gm: 'gaming console esports setup',
  aq: 'aquarium fish reef underwater',
  fs: 'fishing boat rod outdoors',
  cr: 'crabbing seafood crabs dock',
  pt: 'pets dog cat companion animal'
};

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

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

function promptOf(pillar, title, question) {
  const theme = THEME[pillar] || 'professional business';
  const subj = String(title || question || theme)
    .replace(/\b20\d{2}\b/g, '')
    .replace(/[^\w\s&-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
  return 'candid documentary editorial photograph of ' + subj + ', ' + theme
    + ', real scene, natural light, sharp focus, no text, no words, no letters, no watermark, no logo, no caption';
}

function loadJSON(f, d) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; }
}

const hashes = new Set(loadJSON(HASH_FILE, []));
const manifest = loadJSON(MANIFEST, {});
function saveHashes() { fs.writeFileSync(HASH_FILE, JSON.stringify([...hashes])); }
function saveManifest() { fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2)); }

async function pollinations(prompt, seed) {
  const url = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt)
    + '?width=900&height=900&nologo=true&enhance=true&model=flux&seed=' + (seed % 99999);
  const headers = PTOK ? { Authorization: 'Bearer ' + PTOK } : { 'User-Agent': 'Mozilla/5.0' };
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(url, { headers, signal: AbortSignal.timeout(90000) });
      if (r.status === 429) { console.log('  pollinations 429 — wait'); await sleep(GAP_MS); continue; }
      const ct = r.headers.get('content-type') || '';
      if (r.ok && ct.startsWith('image')) {
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length > 8000) return b;
      }
    } catch (e) { console.log('  pollinations err', e.message); }
    await sleep(3000 * (a + 1));
  }
  return null;
}

async function cloudflare(prompt, seed) {
  const CF = process.env.CLOUDFLARE_API_KEY;
  const ACCT = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!CF || !ACCT) return null;
  try {
    const r = await fetch(
      'https://api.cloudflare.com/client/v4/accounts/' + ACCT + '/ai/run/@cf/black-forest-labs/flux-1-schnell',
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + CF, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, steps: 6, seed: seed || 0 }),
        signal: AbortSignal.timeout(60000)
      }
    );
    const j = await r.json();
    if (j && j.result && j.result.image) {
      const b = Buffer.from(j.result.image, 'base64');
      if (b.length > 8000) return b;
    }
  } catch (e) { console.log('  cloudflare err', e.message); }
  return null;
}

async function ddgSearch(query) {
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  const tp = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iax=images&ia=images', {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(20000)
  });
  const html = await tp.text();
  const m = html.match(/vqd=["']?([\d-]+)/);
  if (!m) return [];
  const r = await fetch(
    'https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + m[1] + '&f=,,,&p=1',
    { headers: { 'User-Agent': UA, Referer: 'https://duckduckgo.com/', Accept: 'application/json' }, signal: AbortSignal.timeout(20000) }
  );
  if (!r.ok) throw new Error('ddg ' + r.status);
  const j = await r.json();
  return j.results || [];
}

async function ddg(query) {
  try {
    const results = await ddgSearch(query + ' photograph photo -cartoon -illustration -vector -clipart');
    for (const item of results.slice(0, 8)) {
      const src = item.image || item.url || item.thumbnail;
      if (!src || !/^https?:/i.test(src)) continue;
      try {
        const r = await fetch(src, {
          headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://duckduckgo.com/' },
          signal: AbortSignal.timeout(25000)
        });
        const ct = r.headers.get('content-type') || '';
        if (!r.ok || !ct.startsWith('image')) continue;
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length > 8000) return b;
      } catch (e) {}
    }
  } catch (e) { console.log('  ddg err', e.message); }
  return null;
}

async function generateBuf(pillar, card, attempt) {
  const prompt = promptOf(pillar, card.t, card.q);
  const seed = (crypto.createHash('sha1').update(card.id + ':' + attempt).digest().readUInt32BE(0)) >>> 0;
  let buf = await pollinations(prompt, seed);
  if (buf) return { buf, provider: 'pollinations' };
  buf = await cloudflare(prompt, seed);
  if (buf) return { buf, provider: 'cloudflare' };
  buf = await ddg(card.t + ' ' + (THEME[pillar] || 'business'));
  if (buf) return { buf, provider: 'ddg' };
  return null;
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

function needsWrite(id) {
  const dest = path.join(QA, id + '.sq.jpg');
  if (FORCE) return true;
  try { return !fs.existsSync(dest) || fs.statSync(dest).size < 12000; }
  catch (e) { return true; }
}

(async () => {
  let list = PILLARS.filter((p) => !SKIP.has(p));
  if (ONLY.length) list = list.filter((p) => ONLY.includes(p));
  console.log('gen browse squares — providers pollinations|cloudflare|ddg');
  console.log('gap_ms', GAP_MS, 'pillars', list.join(','), 'per', LIMIT);

  let made = 0;
  let lastAt = 0;

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
      cards.push({ id: e.id, q, t: shortTitle(q, 36) });
      if (cards.length >= LIMIT) break;
    }
    if (!cards.length) { console.log('no entries', pillar); continue; }

    const out = manifest[pillar] || [];
    for (const card of cards) {
      if (!needsWrite(card.id)) {
        console.log('EXISTS', card.id, card.t);
        continue;
      }

      const wait = Math.max(0, GAP_MS - (Date.now() - lastAt));
      if (lastAt && wait > 0) {
        console.log('  wait', Math.round(wait / 1000) + 's (1-min gap)');
        await sleep(wait);
      }

      let picked = null;
      for (let attempt = 0; attempt < 3 && !picked; attempt++) {
        const got = await generateBuf(pillar, card, attempt);
        if (!got) continue;
        const h = crypto.createHash('sha256').update(got.buf).digest('hex');
        if (hashes.has(h)) { console.log('  dup hash', card.id, got.provider); continue; }
        picked = { ...got, hash: h };
      }
      lastAt = Date.now();
      if (!picked) { console.log('NO IMAGE', card.id); continue; }

      const dest = path.join(QA, card.id + '.sq.jpg');
      const tmp = dest + '.tmp';
      await sharp(picked.buf)
        .rotate()
        .resize(900, 900, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(tmp);
      fs.renameSync(tmp, dest);
      fs.copyFileSync(dest, path.join(STORED, pillar + '-' + card.id + '_' + picked.provider + '.jpg'));
      hashes.add(picked.hash);
      saveHashes();
      const row = { id: card.id, t: card.t, q: card.q, provider: picked.provider, bytes: fs.statSync(dest).size, at: new Date().toISOString() };
      out.push(row);
      manifest[pillar] = out;
      saveManifest();
      made++;
      console.log('OK', card.id, picked.provider, card.t);
    }
    console.log('pillar', pillar, 'done');
  }
  console.log('\nDONE made=', made, 'total_hashes=', hashes.size);
})().catch((e) => { console.error(e); process.exit(1); });
