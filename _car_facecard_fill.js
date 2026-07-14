// _car_facecard_fill.js — give each CARS entry a face-card cover made from ITS OWN approved car photos.
// Uses the per-question importer's manifest tags (slot.entry / slot.model) so ca0001 gets a Kia Telluride /
// its #1 pick — not a random image. Only entries that have an APPROVED car-question photo are covered.
// Same grading method as _facecard_fill_approved.js. Covers are static → live after the next deploy. owner 2026-07-10
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const flib = require('./_ddg_facecard_lib');
const POOL = WD + '/assets/qa/_gp_pool';
const DONE_F = WD + '/_car_facecard_done.json';
const okVals = new Set([true, 1, 'ok', 'approve', 'approved', 'yes']);

async function main() {
  const mani = JSON.parse(fs.readFileSync(WD + '/_gp_pool_manifest.json', 'utf8'));
  const approval = JSON.parse(fs.readFileSync(WD + '/_gp_pool_approval.json', 'utf8'));
  // entry -> approved car-question slots, in import order (first = #1 ranked model)
  const byEntry = {};
  for (const s of mani.slots) {
    if (s.provider !== 'car-question') continue;
    // newer slots have s.entry/s.model; older ones only have scene "Model · caID"
    let entry = s.entry, model = s.model;
    if ((!entry || !model) && s.scene && s.scene.includes(' · ')) { const parts = s.scene.split(' · '); model = model || parts[0]; entry = entry || parts[1]; }
    if (!entry || !/^ca\d/.test(entry)) continue;
    if (!okVals.has(approval[s.slot]) && !okVals.has(approval[String(s.slot)])) continue;
    const f = POOL + '/' + String(s.slot).padStart(3, '0') + '.jpg';
    try { if (fs.statSync(f).size < 3000) continue; } catch (e) { continue; }
    // prefer a specific model name over the generic category ("Mid", "Compact SUV") for the #1 cover
    const generic = /^(Mid|Compact|Full|Electric|Hybrid|Luxury|Small|Large)\b/i.test(model || '');
    (byEntry[entry] = byEntry[entry] || []).push({ slot: s.slot, model: model, file: f, generic });
  }
  for (const k of Object.keys(byEntry)) byEntry[k].sort((a, b) => (a.generic - b.generic) || (a.slot - b.slot));  // specific-model shot first
  const ids = Object.keys(byEntry).sort();
  console.log('[car-facecard] cars entries with approved photos: ' + ids.length);
  if (!ids.length) { console.log('HALT: no approved car-question photos yet — approve some first.'); return; }
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const byId = Object.fromEntries((idx.entries || []).map(e => [e.id, e]));
  const done = (() => { try { return new Set(JSON.parse(fs.readFileSync(DONE_F, 'utf8'))); } catch (e) { return new Set(); } })();
  let n = 0, fail = 0;
  for (const id of ids) {
    if (done.has(id)) continue;
    const pick = byEntry[id][0];   // #1 ranked model's approved shot
    const e = byId[id]; if (!e) continue;
    try {
      const buf = fs.readFileSync(pick.file);
      await flib.gradeFaceCardFromBuffer(buf, flib.coverPath(id), { question: e.question || e.title || id });
      try { const cur = await store.get('answers/' + id + '.json', { type: 'json' }); if (cur) await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, { cover_src: 'car-approved', face_title_baked: false })); } catch (z) {}
      e.img = '/assets/qa/' + id + '.jpg'; e.cover_src = 'car-approved';
      done.add(id); n++;
      console.log('  ✓ ' + id + ' ← ' + pick.model + ' (slot ' + pick.slot + ')');
    } catch (x) { fail++; console.log('  ✗ ' + id + ' ' + x.message); }
  }
  fs.writeFileSync(DONE_F, JSON.stringify([...done]));
  try { await store.setJSON('_index.json', idx); } catch (z) {}
  console.log('[car-facecard] DONE covered=' + n + ' failed=' + fail + '  (covers are static — live after next deploy)');
}
main().catch(e => { console.error('[car-facecard] FATAL', e.message); process.exit(1); });
