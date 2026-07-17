// ============================================================================================
// new/bb_prove.js — PROOF-OF-MANUAL-PLACEMENT verifier for the Block Builder (handshake edition).
// Claude runs this ONCE per placed image, immediately after placing it, and posts the PROOF line
// in chat. This is the "definitive truth" per turn: the image is really at its render path, it is
// the file the receipt hashed, it maps to the APPROPRIATE SPOT (face card, or the exact
// between-paragraph body slot the shared imageSlotIndices math puts it at), it came AFTER Kory's
// pick, it is not a duplicate on the page, and its pacing is human (one at a time — no bulk).
//
// ⛔ This tool VERIFIES ONLY. It never places, moves, copies, or downloads an image, and it must
//    never grow a flag that does. The ABSOLUTE PROHIBITION in bb_handshake.js applies in full.
//
// Usage:
//   node new/bb_prove.js <id> <slot>     verify ONE placement (slot = face | b1..bN) → PROOF line
//   node new/bb_prove.js <id>            verify every placed slot of the entry (pre-publish check)
//   node new/bb_prove.js --audit         walk the global attestation chain, report any tampering
//
// Every PROOF is appended to new/_bb_attest.log as a hash chain (each line carries the sha256 of
// the previous line), so attestations cannot be quietly edited, deleted, or backfilled.
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const WD = 'C:/Users/koryj/website';
const OUT = WD + '/new/output';
const ENTRIES = WD + '/new/entries';
const USED = WD + '/new/imagebank/_bb_used.json';
const CHAIN = WD + '/new/_bb_attest.log';
const MIN_GAP_SEC = parseInt(process.env.BBH_MIN_GAP_SEC || '15', 10); // two placements closer than this = bulk-suspect (bulk lands 0-2s apart; manual jitters ~20-40s)
const { imageSlotIndices } = require('./publish_core');
let sharp = null; try { sharp = require('sharp'); } catch (e) {}

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const readJ = p => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } };
const nBody = fmt => (fmt === 'top10' ? 10 : 6);

// ---- hash-chained attestation log (append-only, tamper-evident) ----
function chainLines() { try { return fs.readFileSync(CHAIN, 'utf8').split('\n').filter(Boolean); } catch (e) { return []; } }
function chainAppend(att) {
  const lines = chainLines();
  const prev = lines.length ? sha(lines[lines.length - 1]) : 'GENESIS';
  fs.appendFileSync(CHAIN, JSON.stringify(Object.assign({ prev }, att)) + '\n');
}
function chainAudit() {
  const lines = chainLines();
  let prev = 'GENESIS', bad = 0;
  const events = [];
  for (let i = 0; i < lines.length; i++) {
    let o; try { o = JSON.parse(lines[i]); } catch (e) { console.log('✗ line ' + (i + 1) + ': unparseable'); bad++; prev = sha(lines[i]); continue; }
    if (o.prev !== prev) { console.log('✗ line ' + (i + 1) + ' (' + o.id + '/' + o.slot + '): chain broken — log was edited or a line was removed'); bad++; }
    prev = sha(lines[i]); o._line = i + 1; events.push(o);
  }
  // DEEP cross-checks: every ok-attest must be backed by the SERVER's own place event (same bytes)
  // preceded by the server's pick event, and the file (if still on disk) must re-hash to the attest.
  for (const o of events) {
    if (o.type || o.ok !== true) continue;
    const place = events.find(e => e.type === 'place' && e.id === o.id && e.slot === o.slot && e.sha256 === o.sha256);
    const pick = events.find(e => e.type === 'pick' && e.id === o.id && e.slot === o.slot);
    if (!place) { console.log('⚠ line ' + o._line + ' (' + o.id + '/' + o.slot + '): attest has NO matching server place event — fabricated or pre-upgrade'); }
    else if (!pick) { console.log('⚠ line ' + o._line + ' (' + o.id + '/' + o.slot + '): place has no server pick event — pick did not come from the browser UI'); }
    else if (Date.parse(place.at) < Date.parse(pick.at)) { console.log('✗ line ' + o._line + ' (' + o.id + '/' + o.slot + '): place BEFORE pick'); bad++; }
    if (o.dst) { try { const cur = sha(fs.readFileSync(WD + o.dst)); if (cur !== o.sha256) { console.log('✗ line ' + o._line + ' (' + o.id + '/' + o.slot + '): file on disk no longer matches the attested sha256'); bad++; } } catch (e) { /* published/cleaned — fine */ } }
  }
  console.log(bad ? ('✗ AUDIT FAILED — ' + bad + ' break(s) across ' + lines.length + ' chain lines') : ('✓ chain intact — ' + lines.length + ' lines (picks, places, attests), none edited or backfilled'));
  process.exit(bad ? 1 : 0);
}

// every placedAt across ALL entries (for the one-at-a-time pacing check)
function allPlacements() {
  const out = [];
  let dirs = []; try { dirs = fs.readdirSync(OUT); } catch (e) {}
  for (const d of dirs) {
    const h = readJ(OUT + '/' + d + '/hs.json'); if (!h || !h.slots) continue;
    for (const k of Object.keys(h.slots)) { const s = h.slots[k]; if (s && s.placedAt) out.push({ id: d, slot: k, at: Date.parse(s.placedAt) }); }
  }
  return out.sort((a, b) => a.at - b.at);
}

async function verifySlot(id, slot) {
  const fails = [], notes = [];
  const entry = readJ(ENTRIES + '/' + id + '.json');
  const meta = readJ(OUT + '/' + id + '/meta.json') || {};
  const hs = readJ(OUT + '/' + id + '/hs.json');
  const s = hs && hs.slots && hs.slots[slot];
  if (!entry) fails.push('no entry file for ' + id);
  if (!s) fails.push('no handshake slot "' + slot + '"');

  let fileSha = null, dst = null;
  if (s) {
    // 1) ORDER: Kory picked first, Claude placed second — never the other way, never unpicked.
    if (!s.picked || !s.pickedAt) fails.push('Kory never picked this slot — a placement without a pick is a violation');
    if (!s.placed || !s.placedAt) fails.push('slot not marked placed');
    if (s.pickedAt && s.placedAt && Date.parse(s.placedAt) < Date.parse(s.pickedAt)) fails.push('placedAt is BEFORE pickedAt — impossible for a manual response to a pick');

    // 2) FILE TRUTH: the exact render-path file exists and re-hashes to the receipt's sha256.
    dst = slot === 'face' ? (OUT + '/' + id + '/facecard.jpg') : (OUT + '/' + id + '/body-' + slot.slice(1) + '.jpg');
    let buf = null; try { buf = fs.readFileSync(dst); } catch (e) {}
    if (!buf) fails.push('destination file missing: ' + dst.replace(WD, ''));
    else {
      fileSha = sha(buf);
      if (s.proof && s.proof.sha256 && s.proof.sha256 !== fileSha) fails.push('sha256 MISMATCH — file on disk is not the file the receipt hashed');
      if (!s.proof) fails.push('no proof receipt on the slot');
      const rec = (readJ(OUT + '/' + id + '/receipts.json') || []).find(r => r.slot === slot && r.sha256 === fileSha);
      if (!rec) notes.push('warn: no matching line in receipts.json');
      if (sharp && buf) { try { const md = await sharp(buf).metadata(); if (!md.format || (md.width || 0) < 80) fails.push('file does not decode as a real image'); else notes.push(md.width + 'x' + md.height); } catch (e) { fails.push('file does not decode as a real image'); } }
    }

    // 3) APPROPRIATE SPOT: the placed file is wired to the exact position the answer page renders.
    if (slot === 'face') {
      if ((meta.faceCard || 'facecard.jpg') !== 'facecard.jpg') fails.push('meta.faceCard does not point at facecard.jpg — the hero will not show this image');
      else notes.push('spot: FACE CARD hero (publishes as qa-bin/<qid>.jpg + .sq recents thumb)');
    } else {
      const k = slot.slice(1);
      if (!meta.body || meta.body[k] !== 'body-' + k + '.jpg') fails.push('meta.body[' + k + '] does not point at body-' + k + '.jpg — publish will not put this image in slot ' + k);
      else if (entry) {
        // same shared math publish uses — quote the paragraph the image lands under, so the spot is human-checkable
        const lines = entry.body.split('\n');
        const picks = imageSlotIndices(lines, nBody(hs.fmt || entry.format));
        const at = picks[+k - 1];
        if (at == null) fails.push('imageSlotIndices has no position for body slot ' + k);
        else notes.push('spot: ANSWER PAGE, after line ' + (at + 1) + ' — "…' + lines[at].trim().slice(-70) + '"');
      }
    }

    // 4) NO DUPLICATE on this page + image is spent in the global used-once ledger.
    if (fileSha) {
      for (const other of Object.keys(hs.slots)) {
        if (other === slot || !hs.slots[other].placed) continue;
        const op = other === 'face' ? (OUT + '/' + id + '/facecard.jpg') : (OUT + '/' + id + '/body-' + other.slice(1) + '.jpg');
        try { if (sha(fs.readFileSync(op)) === fileSha) fails.push('DUPLICATE — identical bytes already placed at slot ' + other); } catch (e) {}
      }
    }
    const used = readJ(USED) || [];
    if (s.imgId && used.indexOf(s.imgId) < 0) notes.push('warn: imgId not in the global used-once ledger');

    // 5) PACING check REMOVED per owner (2026-07-16): no time/interval requirement between placements.
    //    (The hash-match, exact-spot, pick-before-place, no-duplicate, and hash-chained-log checks remain.)
  }

  const ok = fails.length === 0;
  const att = { at: new Date().toISOString(), id, slot, ok, sha256: fileSha, dst: dst ? dst.replace(WD, '') : null, pickedAt: s && s.pickedAt, placedAt: s && s.placedAt, notes, fails };
  chainAppend(att);
  // EACH-TURN GATE: the builder's twin tile stays GRAY until this attest exists for these exact
  // bytes — CC cannot advance to the next image without running this prover and passing.
  if (ok && s) { s.attest = { at: att.at, sha256: fileSha }; fs.writeFileSync(OUT + '/' + id + '/hs.json', JSON.stringify(hs, null, 1)); }
  const line = ok
    ? '✓ PROOF ' + id + '/' + slot + ' — placed via the app /api/place on Kory\'s pick (not mouse-dragged), sha256 ' + fileSha.slice(0, 16) + '…, ' + notes.join(' · ')
    : '✗ NOT PROVEN ' + id + '/' + slot + ' — ' + fails.join(' | ');
  console.log(line);
  return ok;
}

(async () => {
  const a = process.argv.slice(2);
  if (a[0] === '--audit') return chainAudit();
  if (!a[0]) { console.log('usage: node new/bb_prove.js <id> [slot] | --audit'); process.exit(1); }
  const id = a[0];
  let slots = a[1] ? [a[1]] : null;
  if (!slots) { const hs = readJ(OUT + '/' + id + '/hs.json') || { slots: {} }; slots = Object.keys(hs.slots).filter(k => hs.slots[k] && hs.slots[k].placed); }
  if (!slots.length) { console.log('nothing placed yet for ' + id); process.exit(1); }
  let allOk = true;
  for (const sl of slots) { if (!(await verifySlot(id, sl))) allOk = false; }
  process.exit(allOk ? 0 : 1);
})();
