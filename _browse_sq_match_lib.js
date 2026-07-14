// Title-match local library → untitled .sq.jpg (no face bake, no approval gate)
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const WD = __dirname;
const QA = path.join(WD, 'assets', 'qa');
const POOL = path.join(QA, '_gp_pool');
const PEXELS = path.join(QA, '_pexels_stored');
const POSTER = path.join(QA, '_poster-lib');
const LIMIT = 10;
const MAX_USES = 2;

const PILLARS = [
  'gp','ik','ra','st','bs','cg','q','sk','sp','cd',
  'tk','tl','sw','ai','er','tc','fr','es','bo','ca','bt',
  'tv','rs','tn','sc','gb','sy','co','mv','dn','cl','nl',
  'ev','ga','lv','wl','hf','dr','gm','aq','fs','cr','pt'
];

const STOP = new Set(('a an the of to in for on with and or is are was were be how what when where why who top best common mistakes getting started before investing worth it cost options strategies 2026 2027 you i do does').split(' '));

function tokens(s) {
  return String(s || '').toLowerCase()
    .replace(/[^a-z0-9\s&]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

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
  for (const [re, fn] of rules) {
    const m = t.match(re);
    if (m) { t = fn(...m); break; }
  }
  t = t.replace(/\s+/g, ' ').trim();
  if (!t) t = raw;
  t = t.charAt(0).toUpperCase() + t.slice(1);
  const limit = Math.max(12, max - year.length);
  if (t.length <= limit) return (t + year).trim();
  let cut = t.slice(0, limit);
  const sp = cut.lastIndexOf(' ');
  if (sp >= 8) cut = cut.slice(0, sp);
  return (cut.replace(/[,:;\-\s]+$/g, '') + year).trim();
}

function loadPoolIndex() {
  const items = [];
  // gp pool with scene text
  let man = { slots: [] };
  try { man = JSON.parse(fs.readFileSync(path.join(WD, '_gp_pool_manifest.json'), 'utf8')); } catch (e) {}
  for (const s of (man.slots || [])) {
    if (!s || !s.ok) continue;
    const n = String(s.slot).padStart(3, '0') + '.jpg';
    const p = path.join(POOL, n);
    if (!fs.existsSync(p)) continue;
    const text = String(s.scene || s.sourceTitle || '');
    items.push({ path: p, text, toks: tokens(text), kind: 'gp' });
  }
  // pexels stored — filenames often include keywords
  if (fs.existsSync(PEXELS)) {
    for (const f of fs.readdirSync(PEXELS)) {
      if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
      const p = path.join(PEXELS, f);
      try { if (fs.statSync(p).size < 8000) continue; } catch (e) { continue; }
      const text = f.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
      items.push({ path: p, text, toks: tokens(text), kind: 'pexels' });
    }
  }
  // poster lib filenames
  if (fs.existsSync(POSTER)) {
    for (const f of fs.readdirSync(POSTER)) {
      if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
      const p = path.join(POSTER, f);
      try { if (fs.statSync(p).size < 8000) continue; } catch (e) { continue; }
      const text = f.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
      items.push({ path: p, text, toks: tokens(text), kind: 'poster' });
    }
  }
  return items;
}

function score(item, wantToks) {
  if (!wantToks.length) return 0;
  let hit = 0;
  const set = new Set(item.toks);
  for (const w of wantToks) if (set.has(w)) hit++;
  // also substring in text
  const blob = item.text.toLowerCase();
  for (const w of wantToks) if (w.length > 4 && blob.includes(w)) hit += 0.5;
  return hit;
}

function pickBest(items, title, uses, pillarUsed) {
  const want = tokens(title);
  let best = null, bestScore = -1;
  // prefer unique / low-use
  for (const it of items) {
    if (pillarUsed.has(it.path)) continue;
    if ((uses[it.path] || 0) >= MAX_USES) continue;
    const sc = score(it, want) - ((uses[it.path] || 0) * 0.25);
    if (sc > bestScore) { bestScore = sc; best = it; }
  }
  if (best && bestScore >= 1) return { item: best, score: bestScore, matched: true };
  // fallback: unused random-ish from low use
  for (const it of items) {
    if (pillarUsed.has(it.path)) continue;
    if ((uses[it.path] || 0) >= 1) continue;
    return { item: it, score: 0, matched: false };
  }
  for (const it of items) {
    if (pillarUsed.has(it.path)) continue;
    if ((uses[it.path] || 0) >= MAX_USES) continue;
    return { item: it, score: 0, matched: false, dupe: true };
  }
  return null;
}

async function fetchEntries(pillar) {
  const url = 'https://pulserevops.com/.netlify/functions/pulse-machine-library-list?pillar='
    + encodeURIComponent(pillar) + '&recent=20&sort=ts&mini=1';
  const r = await fetch(url);
  if (!r.ok) throw new Error(pillar + ' ' + r.status);
  const j = await r.json();
  return j.entries || j.items || j.results || [];
}

(async () => {
  const items = loadPoolIndex();
  console.log('indexed', items.length);
  const uses = Object.create(null);
  const out = {};
  let made = 0, matched = 0;

  for (const pillar of PILLARS) {
    let entries = [];
    try { entries = await fetchEntries(pillar); }
    catch (e) { console.log('skip', pillar, e.message); continue; }

    const cards = [];
    const seen = new Set();
    for (const e of entries) {
      if (!e || !e.id || seen.has(e.id)) continue;
      if (!String(e.id).toLowerCase().startsWith(pillar)) continue;
      seen.add(e.id);
      const q = e.question || e.title || '';
      cards.push({ id: e.id, q, t: shortTitle(q, 36) });
      if (cards.length >= LIMIT) break;
    }
    if (!cards.length) { console.log(pillar, 'no entries'); continue; }

    const pillarUsed = new Set();
    const rows = [];
    for (const card of cards) {
      const dest = path.join(QA, card.id + '.sq.jpg');
      // refresh weak/missing; keep strong existing if already good size unless FORCE
      const exists = fs.existsSync(dest) && fs.statSync(dest).size > 12000;
      if (exists && process.env.FORCE !== '1') {
        rows.push({ ...card, kept: true });
        continue;
      }
      const pick = pickBest(items, card.t + ' ' + card.q, uses, pillarUsed);
      if (!pick) { console.log('NO', card.id); continue; }
      pillarUsed.add(pick.item.path);
      uses[pick.item.path] = (uses[pick.item.path] || 0) + 1;
      const tmp = dest + '.tmp';
      await sharp(pick.item.path)
        .rotate()
        .resize(900, 900, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(tmp);
      fs.renameSync(tmp, dest);
      made++;
      if (pick.matched) matched++;
      rows.push({
        id: card.id, t: card.t, matched: !!pick.matched, score: pick.score,
        src: path.basename(pick.item.path), kind: pick.item.kind, dupe: !!pick.dupe
      });
      console.log((pick.matched ? 'MATCH' : 'FILL'), card.id, 'sc=' + pick.score, pick.item.kind, path.basename(pick.item.path), '—', card.t);
    }
    out[pillar] = rows;
    console.log('pillar', pillar, rows.length);
  }
  fs.writeFileSync(path.join(WD, '_browse_sq_match_manifest.json'), JSON.stringify(out, null, 2));
  console.log('DONE made=', made, 'matched=', matched);
})().catch((e) => { console.error(e); process.exit(1); });
