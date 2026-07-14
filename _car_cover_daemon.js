// _car_cover_daemon.js — topic-wide, hands-free CAR face cards. Every 10 min: (1) auto-approve any new
// car-question photos in the room, (2) fill each Cars entry's missing cover from a whole-car shot of ITS #1
// model (entry-matched via manifest scene "Model · caID"), (3) log how many covers are now done. Resume-safe
// (_car_facecard_done.json). Covers are static → live after the next deploy. Runs forever. owner 2026-07-10
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const flib = require('./_ddg_facecard_lib');
const POOL = WD + '/assets/qa/_gp_pool';
const MANI = WD + '/_gp_pool_manifest.json';
const APPROVAL = WD + '/_gp_pool_approval.json';
const DONE_F = WD + '/_car_facecard_done.json';
const EVERY_MS = parseInt(process.env.CAR_COVER_EVERY_MS || '150000', 10);   // every 2.5 min
const AUTO_APPROVE = process.env.CAR_COVER_AUTO_APPROVE === '1';              // OFF by default — only fill covers from GREAT shots the owner approved (owner: "wait for great ones")
const okVals = new Set([true, 1, 'ok', 'approve', 'approved', 'yes']);
const loadJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const GENERIC = /^(Mid|Compact|Full|Electric|Hybrid|Luxury|Small|Large)\b/i;

async function pass() {
  const mani = loadJSON(MANI, { slots: [] });
  const approval = loadJSON(APPROVAL, {});
  // 1) auto-approve new car-question photos
  let newlyApproved = 0;
  if (AUTO_APPROVE) {
    for (const s of mani.slots) { if (s.provider === 'car-question' && !okVals.has(approval[s.slot])) { approval[s.slot] = 'ok'; newlyApproved++; } }
    if (newlyApproved) { try { fs.writeFileSync(APPROVAL, JSON.stringify(approval)); } catch (e) {} }
  }
  // 2) entry -> approved car photos (prefer a specific-model shot for the cover)
  const byEntry = {};
  for (const s of mani.slots) {
    if (s.provider !== 'car-question') continue;
    let entry = s.entry, model = s.model;
    if ((!entry || !model) && s.scene && s.scene.includes(' · ')) { const p = s.scene.split(' · '); model = model || p[0]; entry = entry || p[1]; }
    if (!entry || !/^ca\d/.test(entry)) continue;
    if (!okVals.has(approval[s.slot])) continue;
    const f = POOL + '/' + String(s.slot).padStart(3, '0') + '.jpg';
    try { if (fs.statSync(f).size < 3000) continue; } catch (e) { continue; }
    (byEntry[entry] = byEntry[entry] || []).push({ slot: s.slot, model, file: f, generic: GENERIC.test(model || '') });
  }
  for (const k of Object.keys(byEntry)) byEntry[k].sort((a, b) => (a.generic - b.generic) || (a.slot - b.slot));
  // 3) fill covers for entries not done yet
  const done = new Set(loadJSON(DONE_F, []));
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = Object.fromEntries((idx.entries || []).map(e => [e.id, e]));
  let filled = 0, fail = 0;
  for (const id of Object.keys(byEntry).sort()) {
    if (done.has(id)) continue;
    const e = byId[id]; if (!e) continue;
    const pick = byEntry[id][0];
    try {
      await flib.gradeFaceCardFromBuffer(fs.readFileSync(pick.file), flib.coverPath(id), { question: e.question || e.title || id });
      try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cover_src: 'car-approved', face_title_baked: false })); } catch (z) {}
      e.img = '/assets/qa/' + id + '.jpg'; e.cover_src = 'car-approved';
      done.add(id); filled++;
    } catch (x) { fail++; }
  }
  if (filled) { fs.writeFileSync(DONE_F, JSON.stringify([...done])); try { await store.setJSON('_index.json', idx); } catch (z) {} }
  console.log('[car-cover] ' + new Date().toISOString().slice(11, 19) + '  approved+' + newlyApproved + '  covers+' + filled + ' (fail ' + fail + ')  total done=' + done.size);
}
(async () => {
  console.log('[car-cover] topic-wide car cover daemon — every ' + (EVERY_MS / 60000) + ' min. auto-approve=' + AUTO_APPROVE);
  for (;;) { try { await pass(); } catch (e) { console.log('[car-cover] err ' + e.message); } await sleep(EVERY_MS); }
})();
