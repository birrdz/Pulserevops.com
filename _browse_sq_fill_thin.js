// Fill thin pillars up to TARGET untitled .sq.jpg (HTML titles on cards). Dupes light OK.
// Local libs only. Usage: node _browse_sq_fill_thin.js
'use strict';
const fs = require('fs');
const path = require('path');
const { applyBrowseSquareRules, listStored, pillarOf } = require('./_browse_square_rules');

const WD = __dirname;
const QA = path.join(WD, 'assets', 'qa');
const TARGET = Math.max(8, parseInt(process.env.TARGET || '40', 10) || 40);
const ONLY = (process.env.ONLY_PILLARS || '').split(',').map((s) => s.trim()).filter(Boolean);
const SKIP = new Set((process.env.SKIP_PILLARS || 'gp,ik,ra,st,bs,cg').split(',').map((s) => s.trim()).filter(Boolean));

const PILLARS = 'q,sk,sp,cd,tk,tl,sw,ai,er,tc,fr,es,bo,ca,bt,tv,rs,tn,sc,gb,sy,co,mv,dn,cl,nl,ev,ga,lv,wl,hf,dr,gm,aq,fs,cr,pt'
  .split(',');

function countSq(pillar) {
  return fs.readdirSync(QA).filter((f) => new RegExp('^' + pillar + '\\d+\\.sq\\.jpg$', 'i').test(f)).length;
}

async function fetchEntries(pillar, n) {
  const url = 'https://pulserevops.com/.netlify/functions/pulse-machine-library-list?pillar='
    + encodeURIComponent(pillar) + '&recent=' + n + '&mini=1&sort=ts';
  const r = await fetch(url);
  if (!r.ok) throw new Error(pillar + ' http ' + r.status);
  const j = await r.json();
  const ents = j.entries || j.items || [];
  const rx = new RegExp('^' + pillar + '\\d+$', 'i');
  return ents.filter((e) => e && e.id && rx.test(String(e.id)));
}

(async () => {
  console.log('stored donors', listStored().length, 'target', TARGET);
  const used = new Set();
  for (const pillar of PILLARS) {
    if (ONLY.length && !ONLY.includes(pillar)) continue;
    if (SKIP.has(pillar)) continue;
    const have = countSq(pillar);
    if (have >= TARGET) { console.log(pillar, 'ok', have); continue; }
    const need = TARGET - have;
    let ents = [];
    try { ents = await fetchEntries(pillar, Math.max(80, TARGET * 2)); }
    catch (e) { console.log(pillar, 'fetch fail', e.message); continue; }
    let made = 0;
    for (const e of ents) {
      if (made >= need) break;
      const id = String(e.id);
      const dest = path.join(QA, id + '.sq.jpg');
      if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) continue;
      const title = e.question || e.title || id;
      const r = await applyBrowseSquareRules(id, title, { used, stampIndex: false });
      if (r && r.ok) { made++; process.stdout.write('.'); }
    }
    console.log('\n' + pillar, 'was', have, 'made', made, 'now', countSq(pillar));
  }
  console.log('DONE');
})().catch((e) => { console.error(e); process.exit(1); });
