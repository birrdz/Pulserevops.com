// Apply browse-square rules to ALL Q&As in every topic pillar.
// Untitled .sq.jpg only — NO face-card / baked-title code.
// Sources: local libs first (match title when possible). Light dupes OK (max 2), never twice in same pillar row-batch.
// Usage: node _browse_sq_all_pillars.js
// Env: ONLY_PILLARS=gp,ik  SKIP_PILLARS=  FORCE=1  MAX_PER_PILLAR=0 (0=all)
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {
  pickApplicablePexels,
  writeUntitledSquare,
  listStored,
  pillarOf
} = require('./_browse_square_rules');

const WD = __dirname;
const QA = path.join(WD, 'assets', 'qa');
const MANIFEST = path.join(WD, '_browse_sq_all_manifest.json');
const MAX_USES = 2;

const PILLARS = [
  'gp','ik','ra','st','bs','cg','q','sk','sp','cd',
  'tk','tl','sw','ai','er','tc','fr','es','bo','ca','bt',
  'tv','rs','tn','sc','gb','sy','co','mv','dn','cl','nl',
  'ev','ga','lv','wl','hf','dr','gm','aq','fs','cr','pt'
];

const SKIP = new Set((process.env.SKIP_PILLARS || '').split(',').map((s) => s.trim()).filter(Boolean));
const ONLY = (process.env.ONLY_PILLARS || '').split(',').map((s) => s.trim()).filter(Boolean);
const MAX_PER = Math.max(0, parseInt(process.env.MAX_PER_PILLAR || '0', 10) || 0);
const FORCE = process.env.FORCE === '1';

function shortTitle(s, max) {
  max = max || 36;
  let raw = String(s || '').replace(/\s+/g, ' ').trim().replace(/[?]+$/g, '');
  let t = raw, year = '', ym = t.match(/\b(20\d{2})\s*$/);
  if (ym) { year = ' ' + ym[1]; t = t.slice(0, -ym[1].length).trim(); }
  t = t.replace(/^(what(?:'s| is| are| do| does)|how(?: to| do| does| can| should)|is|are|top\s+\d+\s+(?:best\s+)?)/i, '');
  t = t.replace(/\s+/g, ' ').trim() || raw;
  t = t.charAt(0).toUpperCase() + t.slice(1);
  const limit = Math.max(12, max - year.length);
  if (t.length <= limit) return (t + year).trim();
  let cut = t.slice(0, limit);
  const sp = cut.lastIndexOf(' ');
  if (sp >= 8) cut = cut.slice(0, sp);
  return (cut.replace(/[,:;\-\s]+$/g, '') + year).trim();
}

async function fetchAll(pillar) {
  // mini index — pull a large recent window per pillar
  const url = 'https://pulserevops.com/.netlify/functions/pulse-machine-library-list?pillar='
    + encodeURIComponent(pillar) + '&recent=25000&sort=ts&mini=1';
  const r = await fetch(url);
  if (!r.ok) throw new Error(pillar + ' HTTP ' + r.status);
  const j = await r.json();
  return j.entries || j.items || j.results || [];
}

(async () => {
  const stored = listStored();
  console.log('[browse-sq-all] pexels_stored=', stored.length);
  const uses = Object.create(null); // donor path -> count
  const out = { started: new Date().toISOString(), pillars: {} };
  let made = 0, kept = 0, skipped = 0;

  const list = (ONLY.length ? PILLARS.filter((p) => ONLY.includes(p)) : PILLARS)
    .filter((p) => !SKIP.has(p));

  for (const pillar of list) {
    let entries = [];
    try { entries = await fetchAll(pillar); }
    catch (e) { console.log('SKIP', pillar, e.message); continue; }

    const cards = [];
    const seen = new Set();
    for (const e of entries) {
      if (!e || !e.id) continue;
      const id = String(e.id);
      if (pillarOf(id) !== pillar) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      const q = e.question || e.title || '';
      cards.push({ id, q, t: shortTitle(q, 36) });
      if (MAX_PER && cards.length >= MAX_PER) break;
    }
    console.log('pillar', pillar, 'entries', cards.length);

    const pillarUsed = new Set();
    const rows = [];
    for (const card of cards) {
      const dest = path.join(QA, card.id + '.sq.jpg');
      const exists = fs.existsSync(dest) && fs.statSync(dest).size > 12000;
      if (exists && !FORCE) {
        kept++;
        rows.push({ id: card.id, t: card.t, kept: true });
        continue;
      }
      // Prefer rules helper (title/pillar hints) then fall back across unused pool
      let donor = pickApplicablePexels(card.id, card.t + ' ' + card.q, uses);
      if (donor && pillarUsed.has(donor)) donor = null;
      if (donor && (uses[donor] || 0) >= MAX_USES) donor = null;
      if (!donor) {
        for (const f of stored) {
          if (pillarUsed.has(f)) continue;
          if ((uses[f] || 0) >= MAX_USES) continue;
          donor = f;
          break;
        }
      }
      if (!donor) { skipped++; rows.push({ id: card.id, t: card.t, error: 'no-donor' }); continue; }

      pillarUsed.add(donor);
      uses[donor] = (uses[donor] || 0) + 1;
      await writeUntitledSquare(card.id, donor);
      made++;
      rows.push({ id: card.id, t: card.t, donor: path.basename(donor) });
      if (made % 25 === 0) console.log('… made', made, 'kept', kept, 'last', card.id);
    }
    out.pillars[pillar] = { count: cards.length, rows: rows.length, sample: rows.slice(0, 5) };
  }

  out.finished = new Date().toISOString();
  out.made = made;
  out.kept = kept;
  out.skipped = skipped;
  fs.writeFileSync(MANIFEST, JSON.stringify(out, null, 2));
  console.log('DONE made=', made, 'kept=', kept, 'skipped=', skipped);
})().catch((e) => { console.error(e); process.exit(1); });
