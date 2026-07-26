/**
 * Shared CRO Pulse Tools image kits — used by finish drip (with-page) and optional bulk.
 * Face card === hero (dupes OK). Body kits rotate by id.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { croCoverForId, loadFaces, faceAndHeroForId } = require('/workspace/_tl_cover_lock_lib');

const POOL_FILE = process.env.CRO_DECK_POOL || '/tmp/tl-cro-internal100.json';
const KITS_FILE = process.env.CRO_KITS_FILE || '/tmp/tl-cro-kits.json';
const KIT_COUNT = Math.max(5, Math.min(10, Number(process.env.KIT_COUNT || 8) || 8));
const BODY_PER_KIT = Math.max(4, Math.min(6, Number(process.env.BODY_PER_KIT || 5) || 5));

function idNum(id) {
  return Math.abs(parseInt(String(id).replace(/\D/g, ''), 10) || 0);
}

function kitIndex(id) {
  return idNum(id) % KIT_COUNT;
}

function isProtectedImg(url) {
  return /cro-syndicate-logo|kory-white|\/assets\/kory/i.test(String(url || ''));
}

function isBodyQaImg(url) {
  const u = String(url || '').split('?')[0];
  if (!/^\/assets\/qa\//i.test(u)) return false;
  if (isProtectedImg(u)) return false;
  if (/cro-cover-/i.test(u)) return false;
  return true;
}

function loadBodyPool() {
  try {
    const raw = JSON.parse(fs.readFileSync(POOL_FILE, 'utf8'));
    return (raw.available || raw.pool || [])
      .map((x) => (typeof x === 'string' ? x : x && x.img))
      .filter((u) => u && /^\/assets\//.test(u));
  } catch (_e) {
    return loadFaces().filter((u) => /pool-tl|\/tl\d+-b/i.test(u));
  }
}

function buildKits(pool) {
  if (fs.existsSync(KITS_FILE)) {
    try {
      const prev = JSON.parse(fs.readFileSync(KITS_FILE, 'utf8'));
      if (prev.kits && prev.kits.length === KIT_COUNT && prev.bodyPerKit === BODY_PER_KIT) return prev.kits;
    } catch (_e) {}
  }
  let bodyPool = (pool && pool.length ? pool : loadBodyPool()).slice();
  if (!bodyPool.length) bodyPool = loadFaces().slice();
  if (bodyPool.length < KIT_COUNT * BODY_PER_KIT) {
    const ext = [];
    while (ext.length < KIT_COUNT * BODY_PER_KIT) ext.push(...bodyPool);
    bodyPool = ext;
  }
  const kits = [];
  for (let i = 0; i < KIT_COUNT; i++) {
    kits.push({ kit: i + 1, body: bodyPool.slice(i * BODY_PER_KIT, i * BODY_PER_KIT + BODY_PER_KIT) });
  }
  try {
    fs.writeFileSync(
      KITS_FILE,
      JSON.stringify(
        {
          at: new Date().toISOString(),
          kitCount: KIT_COUNT,
          bodyPerKit: BODY_PER_KIT,
          faces: loadFaces().length,
          rule: 'with-drip: face=hero from 50-pool; body kit by id%KIT_COUNT',
          kits,
        },
        null,
        2
      )
    );
  } catch (_e) {}
  return kits;
}

let _kits = null;
function getKits() {
  if (!_kits) _kits = buildKits(loadBodyPool());
  return _kits;
}

function isProseLine(line) {
  const t = String(line || '').trim();
  if (!t) return false;
  if (/^#{1,6}\s/.test(t)) return false;
  if (/^```/.test(t)) return false;
  if (/^!\[[^\]]*\]\(/.test(t)) return false;
  if (/^\[!\[/.test(t)) return false;
  if (/^👉\s/.test(t)) return false;
  if (/^[-*_]{3,}$/.test(t)) return false;
  if (/^(?:[-*+]|\d+\.)\s/.test(t) && t.length < 50) return false;
  return t.length >= 40;
}

function inProtectedZone(sectionHead) {
  return /CRO Businesses Near You|FAQ|Sources|Related on PULSE/i.test(String(sectionHead || ''));
}

/** Place kit body images; does not change hero (caller sets face===hero). */
function applyKitBody(answer, kit) {
  let body = String(answer || '').replace(/\r\n/g, '\n');

  // strip prior body qa only (keep logos/kory)
  body = body.replace(/!\[([^\]]*)\]\(([^)]+)\)\n?/g, (full, _alt, url) => {
    if (!isBodyQaImg(url)) return full;
    return '';
  });
  body = body.replace(/\n{3,}/g, '\n\n');

  const queue = (kit.body || []).slice();
  const placed = [];
  const lines = body.split('\n');
  const out = [];
  let paraCount = 0;
  let inFence = false;
  let sectionHead = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (/^```/.test(t)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (/^#{1,4}\s+/.test(t)) {
      sectionHead = t;
      out.push(line);
      continue;
    }
    out.push(line);
    if (inFence || inProtectedZone(sectionHead)) continue;
    if (!isProseLine(line)) continue;
    paraCount++;
    if (paraCount % 2 === 0 && queue.length) {
      const img = queue.shift();
      placed.push(img);
      out.push('');
      out.push('![CRO revenue operations — figure ' + placed.length + '](' + img + ')');
      out.push('');
    }
  }

  body = out.join('\n');
  if (queue.length) {
    const block =
      '\n\n' +
      queue
        .map((img) => {
          placed.push(img);
          return '![CRO revenue operations — figure ' + placed.length + '](' + img + ')';
        })
        .join('\n\n') +
      '\n\n';
    if (/\n##\s*FAQ\b/i.test(body)) body = body.replace(/\n##\s*FAQ\b/i, block + '## FAQ');
    else if (/\n##\s*Sources\b/i.test(body)) body = body.replace(/\n##\s*Sources\b/i, block + '## Sources');
    else if (/\n##\s*CRO Businesses Near You\b/i.test(body)) {
      body = body.replace(/\n##\s*CRO Businesses Near You\b/i, block + '## CRO Businesses Near You');
    } else body = body.trim() + block;
  }

  body = body.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return { body, placed: (kit.body || []).slice(), kit: kit.kit };
}

/**
 * Full with-drip image assign: face===hero from 50-pool + body kit.
 * Returns { answer, img, face, cover, kit, bodyImgs }.
 */
function assignCroKitToEntry(entry, id) {
  const kits = getKits();
  const kit = kits[kitIndex(id)];
  const fh = faceAndHeroForId(id);
  const hero = fh.hero;
  const { body, placed } = applyKitBody(entry.answer || '', kit);
  return {
    answer: body,
    img: hero,
    cover: hero,
    face: hero, // face card === hero (dupe OK)
    cover_src: 'cro-face-pool',
    face_title_baked: false,
    cro_kit: kit.kit,
    cro_kit_body: placed,
    cro_kit_assigned_at: new Date().toISOString(),
    bodyImgs: placed,
  };
}

module.exports = {
  KIT_COUNT,
  BODY_PER_KIT,
  kitIndex,
  getKits,
  applyKitBody,
  assignCroKitToEntry,
  croCoverForId,
  faceAndHeroForId,
};
