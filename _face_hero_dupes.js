// Ensure every Q&A has a face-card hero /assets/qa/<id>.jpg for answer-page tops.
// Dupes OK — copy from same-pillar faces (owner 2026-07-12).
// Usage: node _face_hero_dupes.js
'use strict';
const fs = require('fs');
const path = require('path');

const WD = __dirname;
const QA = path.join(WD, 'assets', 'qa');
const ONLY = (process.env.ONLY_PILLARS || '').split(',').map((s) => s.trim()).filter(Boolean);
const TARGET = Math.max(1, parseInt(process.env.TARGET_PER_PILLAR || '40', 10) || 40);

const PILLARS = 'gp,ik,ra,st,bs,cg,q,sk,sp,cd,tk,tl,sw,ai,er,tc,fr,es,bo,ca,bt,tv,rs,tn,sc,gb,sy,co,mv,dn,cl,nl,ev,ga,lv,wl,hf,dr,gm,aq,fs,cr,pt'
  .split(',');

function listFaces(pillar) {
  return fs.readdirSync(QA)
    .filter((f) => new RegExp('^' + pillar + '\\d+\\.jpg$', 'i').test(f))
    .map((f) => path.join(QA, f))
    .filter((p) => {
      try { return fs.statSync(p).size > 12000; } catch (e) { return false; }
    });
}

function listNeedIds(pillar) {
  // Prefer ids that already have browse squares (homepage) but any face gap in pillar pool
  const ids = new Set();
  for (const f of fs.readdirSync(QA)) {
    const m = f.match(new RegExp('^(' + pillar + '\\d+)\\.(?:sq\\.)?jpg$', 'i'));
    if (m) ids.add(m[1].toLowerCase());
  }
  return [...ids];
}

async function fetchMoreIds(pillar) {
  try {
    const url = 'https://pulserevops.com/.netlify/functions/pulse-machine-library-list?pillar='
      + encodeURIComponent(pillar) + '&recent=80&mini=1&sort=ts';
    const r = await fetch(url);
    if (!r.ok) return [];
    const j = await r.json();
    const ents = j.entries || j.items || [];
    const rx = new RegExp('^' + pillar + '\\d+$', 'i');
    return ents.map((e) => String(e.id || '').toLowerCase()).filter((id) => rx.test(id));
  } catch (e) {
    return [];
  }
}

(async () => {
  let copied = 0, skipped = 0, pillars = 0;
  for (const pillar of PILLARS) {
    if (ONLY.length && !ONLY.includes(pillar)) continue;
    const donors = listFaces(pillar);
    if (!donors.length) {
      console.log(pillar, 'no donor faces — skip');
      continue;
    }
    pillars++;
    const local = listNeedIds(pillar);
    const remote = await fetchMoreIds(pillar);
    const ids = [...new Set(local.concat(remote))].slice(0, Math.max(TARGET, local.length));
    let made = 0;
    for (const id of ids) {
      const dest = path.join(QA, id + '.jpg');
      if (fs.existsSync(dest) && fs.statSync(dest).size > 12000) { skipped++; continue; }
      const donor = donors[made % donors.length];
      fs.copyFileSync(donor, dest);
      copied++;
      made++;
    }
    console.log(pillar, 'donors', donors.length, 'ids', ids.length, 'copied', made);
  }
  console.log('DONE copied=', copied, 'skipped=', skipped, 'pillars=', pillars);
})().catch((e) => { console.error(e); process.exit(1); });
