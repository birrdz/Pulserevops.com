// Fill missing homepage browse .sq.jpg from local libraries (no API gen).
// Prefer unique; allow light reuse (max 2 uses) if needed — never twice in same pillar.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const WD = __dirname;
const QA = path.join(WD, 'assets', 'qa');
const LIBS = [
  path.join(QA, '_gp_pool'),
  path.join(QA, '_pexels_stored'),
  path.join(QA, '_poster-lib'),
  path.join(QA, '_prev')
];
const LIMIT = 10;
const MAX_USES = 2; // light dupes only

const NEED = {
  cd: 10, sy: 10, co: 10, mv: 10, dn: 10, cl: 10, ev: 10, lv: 10,
  wl: 10, hf: 10, dr: 10, gm: 10, aq: 10, fs: 10, cr: 10, pt: 10
};

function shortTitle(s, max) {
  max = max || 36;
  let raw = String(s || '').replace(/\s+/g, ' ').trim().replace(/[?]+$/g, '');
  let t = raw, year = '', ym = t.match(/\b(20\d{2})\s*$/);
  if (ym) { year = ' ' + ym[1]; t = t.slice(0, -ym[1].length).trim(); }
  t = t.replace(/^(what(?:'s| is| are| do| does)|how(?: to| do| does| can| should)|is|are|top\s+\d+\s+(?:best\s+)?)/i, '');
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

function listLib() {
  const out = [];
  for (const dir of LIBS) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
      const p = path.join(dir, f);
      try {
        if (fs.statSync(p).size > 8000) out.push(p);
      } catch (e) {}
    }
  }
  // shuffle
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
}

function existingSq(pillar) {
  return fs.readdirSync(QA)
    .filter((f) => new RegExp('^' + pillar + '.+\\.sq\\.jpg$', 'i').test(f))
    .map((f) => f.replace(/\.sq\.jpg$/i, ''));
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
  const pool = listLib();
  const uses = Object.create(null); // path -> count
  console.log('library images', pool.length);

  let cursor = 0;
  function claim(pillarUsed) {
    // first pass: unused
    for (let n = 0; n < pool.length; n++) {
      const p = pool[(cursor + n) % pool.length];
      if (pillarUsed.has(p)) continue;
      if ((uses[p] || 0) >= 1) continue;
      cursor = (cursor + n + 1) % pool.length;
      uses[p] = (uses[p] || 0) + 1;
      pillarUsed.add(p);
      return p;
    }
    // light dupe pass
    for (let n = 0; n < pool.length; n++) {
      const p = pool[(cursor + n) % pool.length];
      if (pillarUsed.has(p)) continue;
      if ((uses[p] || 0) >= MAX_USES) continue;
      cursor = (cursor + n + 1) % pool.length;
      uses[p] = (uses[p] || 0) + 1;
      pillarUsed.add(p);
      return { path: p, dupe: true };
    }
    return null;
  }

  let made = 0, dupes = 0;
  for (const [pillar, want] of Object.entries(NEED)) {
    const haveIds = new Set(existingSq(pillar));
    let need = Math.max(0, want - haveIds.size);
    if (!need) { console.log(pillar, 'ok', haveIds.size); continue; }

    let entries = [];
    try { entries = await fetchEntries(pillar); }
    catch (e) { console.log(pillar, 'fetch fail', e.message); }

    const cards = [];
    const seen = new Set(haveIds);
    for (const e of entries) {
      if (!e || !e.id || seen.has(e.id)) continue;
      if (!String(e.id).toLowerCase().startsWith(pillar)) continue;
      seen.add(e.id);
      cards.push({ id: e.id, t: shortTitle(e.question || e.title || e.id) });
      if (cards.length >= need) break;
    }

    // if API short, synthesize placeholder ids only if we have nothing — skip
    if (!cards.length) {
      console.log(pillar, 'no new entries to attach (have', haveIds.size + ')');
      continue;
    }

    const pillarUsed = new Set();
    for (const card of cards) {
      const dest = path.join(QA, card.id + '.sq.jpg');
      if (fs.existsSync(dest) && fs.statSync(dest).size > 12000) continue;
      let got = claim(pillarUsed);
      if (!got) { console.log('pool empty', card.id); break; }
      let src = got, isDupe = false;
      if (typeof got === 'object') { src = got.path; isDupe = !!got.dupe; }
      const tmp = dest + '.tmp';
      await sharp(src)
        .rotate()
        .resize(900, 900, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(tmp);
      fs.renameSync(tmp, dest);
      made++;
      if (isDupe) dupes++;
      console.log('OK', card.id, isDupe ? 'dupe' : 'uniq', path.basename(src), card.t);
    }
    console.log(pillar, 'now', existingSq(pillar).length);
  }
  console.log('DONE made=', made, 'light_dupes=', dupes);
})().catch((e) => { console.error(e); process.exit(1); });
