// _pexels_stored_lib.js — approved Pexels land here for the fix machine (fast, no API).
// Folder: assets/qa/_pexels_stored/<slot>.jpg
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const POOL = WD + '/assets/qa/_gp_pool';
const STORED = WD + '/assets/qa/_pexels_stored';
const MANI = WD + '/_gp_pool_manifest.json';
const APPROVAL = WD + '/_gp_pool_approval.json';
const OK = new Set([true, 1, 'ok', 'approve', 'approved', 'yes']);

function ensureDir() {
  try { fs.mkdirSync(STORED, { recursive: true }); } catch (e) {}
}
function slotPath(slot) {
  return STORED + '/' + String(slot).padStart(3, '0') + '.jpg';
}
function poolPath(slot) {
  return POOL + '/' + String(slot).padStart(3, '0') + '.jpg';
}
function isPexelsSlot(slot) {
  try {
    const man = JSON.parse(fs.readFileSync(MANI, 'utf8'));
    const s = (man.slots || []).find(x => Number(x.slot) === Number(slot));
    return !!(s && String(s.provider || '').toLowerCase() === 'pexels');
  } catch (e) { return false; }
}
/** On gallery ✓ — copy into _pexels_stored (Pexels slots always; others if provider missing but file exists). */
function onApprove(slot) {
  ensureDir();
  const src = poolPath(slot);
  if (!fs.existsSync(src)) return { ok: false, why: 'missing-pool' };
  // Prefer Pexels; still store any approved face-card so the folder stays the single donor source.
  try {
    fs.copyFileSync(src, slotPath(slot));
    return { ok: true, path: slotPath(slot), pexels: isPexelsSlot(slot) };
  } catch (e) { return { ok: false, why: e.message }; }
}
/** On gallery ✗ — remove from stored folder so fix machine won't reuse it. */
function onReject(slot) {
  const p = slotPath(slot);
  try { if (fs.existsSync(p)) fs.unlinkSync(p); return { ok: true, removed: true }; } catch (e) { return { ok: false, why: e.message }; }
}
/** List every file currently in the stored folder (ready for ensureQuality). */
function listStored() {
  ensureDir();
  try {
    return fs.readdirSync(STORED)
      .filter(n => /\.jpe?g$/i.test(n))
      .map(n => STORED + '/' + n)
      .filter(f => { try { return fs.statSync(f).size > 3000; } catch (e) { return false; } });
  } catch (e) { return []; }
}
/** One-time / resume: copy every already-approved Pexels slot into _pexels_stored. */
function backfillApprovedPexels() {
  ensureDir();
  let n = 0;
  try {
    const man = JSON.parse(fs.readFileSync(MANI, 'utf8'));
    const appr = JSON.parse(fs.readFileSync(APPROVAL, 'utf8'));
    for (const s of (man.slots || [])) {
      if (!s || !s.ok) continue;
      if (String(s.provider || '').toLowerCase() !== 'pexels') continue;
      if (!OK.has(appr[s.slot]) && !OK.has(appr[String(s.slot)])) continue;
      const src = poolPath(s.slot);
      if (!fs.existsSync(src) || fs.statSync(src).size < 3000) continue;
      fs.copyFileSync(src, slotPath(s.slot));
      n++;
    }
  } catch (e) {}
  return n;
}

module.exports = { STORED, POOL, ensureDir, onApprove, onReject, listStored, backfillApprovedPexels, isPexelsSlot, slotPath };
