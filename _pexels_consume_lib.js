'use strict';
/**
 * Consume-on-use Pexels library law (owner 2026-07-13):
 * When a library photo is assigned to an entry → DELETE from bank + BLOCK redownload
 * so the site does not over-dupe the same stock photo.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const WD = path.join(__dirname);
const BLOCK_F = path.join(WD, 'assets', 'qa', '_pexels_used_block.json');
const USED_LOG = path.join(WD, 'assets', 'qa', '_pexels_used_log.jsonl');

function readBlock() {
  try {
    const j = JSON.parse(fs.readFileSync(BLOCK_F, 'utf8'));
    return {
      hashes: new Set(j.hashes || []),
      names: new Set(j.names || []),
      pexelsIds: new Set((j.pexelsIds || []).map(String)),
      paths: new Set(j.paths || []),
    };
  } catch (e) {
    return { hashes: new Set(), names: new Set(), pexelsIds: new Set(), paths: new Set() };
  }
}

function writeBlock(b) {
  fs.mkdirSync(path.dirname(BLOCK_F), { recursive: true });
  fs.writeFileSync(BLOCK_F, JSON.stringify({
    at: new Date().toISOString(),
    hashes: [...b.hashes],
    names: [...b.names],
    pexelsIds: [...b.pexelsIds],
    paths: [...b.paths],
    n: b.hashes.size,
  }));
}

function fileHash(file) {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  } catch (e) {
    return null;
  }
}

function pexelsIdFromName(name) {
  const m = String(name || '').match(/(?:pexels[_-]?)(\d{5,})/i)
    || String(name || '').match(/^(\d{6,})\.jpe?g$/i);
  return m ? m[1] : null;
}

function isBlockedPath(file, block) {
  block = block || readBlock();
  const abs = path.resolve(file);
  const base = path.basename(file).toLowerCase();
  if (block.paths.has(abs) || block.names.has(base)) return true;
  const pid = pexelsIdFromName(base);
  if (pid && block.pexelsIds.has(String(pid))) return true;
  const h = fileHash(file);
  if (h && block.hashes.has(h)) return true;
  return false;
}

/** True if a Pexels API photo id / download URL is blocked from redownload. */
function isBlockedPexelsId(idOrUrl) {
  const block = readBlock();
  const s = String(idOrUrl || '');
  const m = s.match(/(\d{5,})/);
  if (m && block.pexelsIds.has(m[1])) return true;
  if (block.names.has(s.toLowerCase())) return true;
  return false;
}

/**
 * After assigning a library donor to an entry: record block + delete bank file.
 * Never delete the destination face file (assets/qa/<id>.jpg).
 */
function consumeLibraryDonor(donorPath, meta) {
  meta = meta || {};
  const abs = path.resolve(donorPath);
  const qaFace = path.resolve(path.join(WD, 'assets', 'qa'));
  // Only delete from banks — never wipe an assigned face/sq
  const base = path.basename(abs).toLowerCase();
  if (/^[a-z]+\d+\.jpe?g$/i.test(base) || /\.sq\.jpe?g$/i.test(base)) {
    // Looks like an entry face — do not delete
    return { ok: false, why: 'skip-entry-face' };
  }
  const bankRoots = [
    path.resolve(path.join(WD, 'assets', 'qa', '_pexels_stored')),
    path.resolve(path.join(WD, 'assets', 'qa', '_pexels_arch')),
    path.resolve(path.join(WD, '_facecard_pool')),
  ];
  const inBank = bankRoots.some((root) => abs === root || abs.startsWith(root + path.sep));
  if (!inBank) return { ok: false, why: 'not-in-bank' };

  const block = readBlock();
  const hash = fileHash(abs);
  const pid = pexelsIdFromName(base) || (meta.pexelsId != null ? String(meta.pexelsId) : null);
  if (hash) block.hashes.add(hash);
  block.names.add(base);
  block.paths.add(abs);
  if (pid) block.pexelsIds.add(String(pid));
  writeBlock(block);

  let deleted = false;
  try {
    fs.unlinkSync(abs);
    deleted = true;
  } catch (e) {
    return { ok: false, why: 'delete-fail', error: String(e.message || e), blocked: true };
  }

  try {
    fs.appendFileSync(USED_LOG, JSON.stringify({
      at: new Date().toISOString(),
      id: meta.id || null,
      donor: abs,
      hash,
      pexelsId: pid,
      via: meta.via || null,
      deleted: true,
    }) + '\n');
  } catch (e) {}

  return { ok: true, deleted, hash, pexelsId: pid, blocked: true };
}

/** Filter a list of donor paths — drop blocked / already-consumed. */
function filterAvailable(files) {
  const block = readBlock();
  return (files || []).filter((f) => {
    try {
      if (!fs.existsSync(f) || fs.statSync(f).size < 8000) return false;
      return !isBlockedPath(f, block);
    } catch (e) { return false; }
  });
}

module.exports = {
  BLOCK_F,
  readBlock,
  isBlockedPath,
  isBlockedPexelsId,
  consumeLibraryDonor,
  filterAvailable,
  pexelsIdFromName,
  fileHash,
};
