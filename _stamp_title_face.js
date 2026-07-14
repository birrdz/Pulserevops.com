'use strict';
/**
 * Always-on title + face + browse-square stamps for Daily Driver + Fixer.
 * Owner 2026-07-13 (wired):
 *   - Images ON SITE only → prefer /assets/qa/_live_bank/*
 *   - Unique when possible (unused bank slot); worst case DUPE an on-site bank URL (free)
 *   - No architecture / off-site fallback
 *   - Top hero markdown = real photo URL (never Pulse brand card)
 *   - Browse sq from donor (accumulates for big deploy)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { putQaAsset } = require('./_live_qa_asset');

const WD = path.join(__dirname);
const QA = path.join(WD, 'assets', 'qa');
const LIVE_BANK = path.join(QA, '_live_bank');
const USED_F = path.join(LIVE_BANK, '_used_by_entry.json');
const MANI = path.join(LIVE_BANK, '_manifest.json');

function facePath(id) {
  return path.join(QA, String(id) + '.jpg');
}
function faceUrl(id) {
  return '/assets/qa/' + String(id) + '.jpg';
}
function sqPath(id) {
  return path.join(QA, String(id) + '.sq.jpg');
}
function sqUrl(id) {
  return '/assets/qa/' + String(id) + '.sq.jpg';
}
function bankUrl(file) {
  return '/assets/qa/_live_bank/' + path.basename(file);
}
function faceOk(id) {
  try {
    return fs.statSync(facePath(id)).size > 8000;
  } catch (e) {
    return false;
  }
}
function sqOk(id) {
  try {
    return fs.statSync(sqPath(id)).size > 8000;
  } catch (e) {
    return false;
  }
}
function pillarOf(id) {
  const m = String(id || '').match(/^([a-z]+)/i);
  return m ? m[1].toLowerCase() : 'q';
}

function readJSON(f, d) {
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (e) {
    return d;
  }
}
function writeJSON(f, o) {
  try {
    fs.mkdirSync(path.dirname(f), { recursive: true });
  } catch (e) {}
  fs.writeFileSync(f, JSON.stringify(o, null, 2));
}

function listLiveBankFiles() {
  const out = [];
  try {
    for (const n of fs.readdirSync(LIVE_BANK)) {
      if (!/\.jpe?g$/i.test(n)) continue;
      const p = path.join(LIVE_BANK, n);
      try {
        if (fs.statSync(p).size > 8000) out.push(p);
      } catch (e) {}
    }
  } catch (e) {}
  return out;
}

/** Existing on-site face cards (for worst-case dupe when bank empty). */
function listLiveFaceFiles() {
  const out = [];
  try {
    for (const n of fs.readdirSync(QA)) {
      if (!/^[a-z]+\d+\.jpg$/i.test(n)) continue;
      const p = path.join(QA, n);
      try {
        const st = fs.statSync(p);
        // brand OG cards tend to be smaller/wide; require a real photo weight
        if (st.size > 40000) out.push(p);
      } catch (e) {}
    }
  } catch (e) {}
  return out;
}

function titleKeywords(title) {
  try {
    const { deriveImageSearchQuery } = require('./netlify/functions/lib/derive-image-search-query');
    return String(deriveImageSearchQuery(title || '') || '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  } catch (e) {
    return String(title || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3)
      .slice(0, 6);
  }
}

function scoreDonor(file, keywords) {
  const name = path.basename(file).toLowerCase();
  let score = 0;
  for (const k of keywords) {
    if (k && name.includes(k)) score += 4;
  }
  // soft boost for office/industry-ish filenames from our drip queries
  for (const h of ['office', 'building', 'shop', 'meeting', 'team', 'store', 'farm', 'warehouse', 'clinic']) {
    if (name.includes(h)) score += 1;
  }
  return score;
}

/**
 * Pick on-site image: unused live_bank first (unique), else any bank (dupe), else live face (dupe).
 */
function pickOnSiteDonor(id, title, opts) {
  opts = opts || {};
  const usedMap = readJSON(USED_F, {});
  const usedFiles = new Set(Object.values(usedMap).map((v) => (v && v.file) || v).filter(Boolean));
  const keywords = titleKeywords(title);
  const bank = listLiveBankFiles();
  const seed = [...String(id) + String(opts.slot || '')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);

  const rank = (files) =>
    files
      .map((f) => ({ f, score: scoreDonor(f, keywords), base: path.basename(f) }))
      .sort((a, b) => b.score - a.score || a.base.localeCompare(b.base));

  const unused = bank.filter((f) => !usedFiles.has(path.basename(f)));
  if (unused.length) {
    const ranked = rank(unused);
    const hits = ranked.filter((x) => x.score >= 4);
    const pool = hits.length ? hits : ranked;
    const pick = pool[seed % pool.length];
    return { path: pick.f, file: path.basename(pick.f), url: bankUrl(pick.f), via: 'live-bank-unique', dupe: false };
  }
  if (bank.length) {
    const ranked = rank(bank);
    const pick = ranked[seed % ranked.length];
    return { path: pick.f, file: path.basename(pick.f), url: bankUrl(pick.f), via: 'live-bank-dupe', dupe: true };
  }
  const faces = listLiveFaceFiles().filter((f) => path.basename(f) !== String(id) + '.jpg');
  if (faces.length) {
    const pick = faces[seed % faces.length];
    const file = path.basename(pick);
    return { path: pick, file, url: '/assets/qa/' + file, via: 'live-face-dupe', dupe: true };
  }
  return null;
}

function markUsed(id, donor, slot) {
  const usedMap = readJSON(USED_F, {});
  usedMap[String(id) + (slot ? ':' + slot : '')] = {
    file: donor.file,
    url: donor.url,
    via: donor.via,
    dupe: !!donor.dupe,
    at: new Date().toISOString(),
  };
  writeJSON(USED_F, usedMap);
}

/**
 * Forever workflow: title keywords → Pexels search → download → putQaAsset(/assets/qa/<id>.jpg).
 * Used when library miss or weak keyword match.
 */
async function pexelsSearchDownloadFace(id, title) {
  const { fetchPexels } = require('./_image_provider_rotate');
  let q = '';
  try {
    const { deriveImageSearchQuery } = require('./netlify/functions/lib/derive-image-search-query');
    q = deriveImageSearchQuery(title);
  } catch (e) {}
  if (!q) q = titleKeywords(title).join(' ');
  if (!q || q.length < 3) q = String(title || 'professional photo').slice(0, 80);
  const buf = await fetchPexels(q);
  if (!buf) return null;
  fs.mkdirSync(QA, { recursive: true });
  const faceBuf = await sharp(buf)
    .rotate()
    .resize(1200, 1200, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  const sqBuf = await sharp(buf)
    .rotate()
    .resize(760, 760, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  await putQaAsset(String(id) + '.jpg', faceBuf);
  await putQaAsset(String(id) + '.sq.jpg', sqBuf);
  if (!faceOk(id)) fs.writeFileSync(facePath(id), faceBuf);
  if (!sqOk(id)) fs.writeFileSync(sqPath(id), sqBuf);
  return {
    path: facePath(id),
    file: String(id) + '.jpg',
    url: faceUrl(id),
    via: 'pexels-search',
    dupe: false,
    query: q,
  };
}

/** Write face/sq local + live blob (instant /assets/qa URL — no per-image deploy). */
async function materializeFaceSq(id, donorPath) {
  fs.mkdirSync(QA, { recursive: true });
  const faceBuf = await sharp(donorPath)
    .rotate()
    .resize(1200, 1200, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  const sqBuf = await sharp(donorPath)
    .rotate()
    .resize(760, 760, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  try {
    await putQaAsset(String(id) + '.jpg', faceBuf);
  } catch (e) {
    fs.writeFileSync(facePath(id), faceBuf);
  }
  try {
    await putQaAsset(String(id) + '.sq.jpg', sqBuf);
  } catch (e) {
    fs.writeFileSync(sqPath(id), sqBuf);
  }
  return { faceOk: faceOk(id), sqOk: sqOk(id) };
}

function setTopHeroMarkdown(body, title, url) {
  const alt = String(title || '').replace(/[\[\]]/g, '').slice(0, 120) || 'photo';
  const hero = '![' + alt + '](' + url + ')\n\n';
  let s = String(body || '');
  // strip leading hero / brand card markdown
  s = s.replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n+/m, '');
  if (/^##\s+Direct Answer\b/im.test(s)) {
    return hero + s;
  }
  return hero + s;
}

/**
 * @param {object} store Netlify blobs store
 * @param {string} id
 * @param {object} opts
 */
async function stampTitleFaceTop(store, id, opts) {
  opts = opts || {};
  const title = String(opts.title || '').trim();
  const surface = opts.surface !== false;
  const quality = opts.quality != null ? Number(opts.quality) : 10;
  const now = Date.now();
  const force = opts.force !== false; // default: always refresh from on-site bank
  const out = { id, ok: false, face: null, sq: null, surfaced: false, body: opts.body || null };

  let blob = null;
  try {
    blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
  } catch (e) {}
  if (!blob) {
    out.why = 'no-blob';
    return out;
  }

  const q = title || String(blob.question || blob.h1 || blob.title || id).trim();
  let body = String(opts.body != null ? opts.body : blob.answer || blob.body || '');

  // 1) Library by title keywords  2) If miss/weak → Pexels search → download → /assets/qa/
  const keywords = titleKeywords(q);
  let donor = pickOnSiteDonor(id, q, { slot: 'face' });
  const bankScore = donor && donor.path ? scoreDonor(donor.path, keywords) : 0;
  if (!donor || bankScore < 4) {
    try {
      const pex = await pexelsSearchDownloadFace(id, q);
      if (pex) donor = pex;
    } catch (e) {
      out.pexelsErr = String(e.message || e);
    }
  }
  if (!donor) {
    out.why = 'no-library-and-pexels-miss';
    return out;
  }

  // Always materialize local face+sq for mosaic/browse (big-deploy batch later)
  let mat = { faceOk: false, sqOk: false };
  try {
    if (donor.via === 'pexels-search' && faceOk(id)) {
      mat = { faceOk: true, sqOk: sqOk(id) };
    } else {
      mat = await materializeFaceSq(id, donor.path);
    }
  } catch (e) {
    out.matErr = String(e.message || e);
  }

  // Live URL policy: only point at paths already on CDN.
  // Until big deploy ships _live_bank, LIVE_BANK_ON_CDN=0 → use live face dupes for img URL
  // (still materialize unique bank pixels locally for the eventual ship).
  // Prefer unique face URL once live blob put is on (owner 2026-07-13).
  // Top internals dupe face by default (STAMP_UNIQUE_TOPS=1 to opt out).
  const bankOnCdn = process.env.LIVE_BANK_ON_CDN !== '0';
  let imgOnSite = donor.url;
  if (mat && mat.faceOk) {
    imgOnSite = faceUrl(id);
  } else if (!bankOnCdn && String(donor.via || '').startsWith('live-bank')) {
    const facePaths = listLiveFaceFiles().filter((f) => path.basename(f) !== String(id) + '.jpg');
    if (facePaths.length) {
      const seed = [...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
      const fp = facePaths[seed % facePaths.length];
      imgOnSite = '/assets/qa/' + path.basename(fp);
      out.cdnDupe = true;
    } else {
      imgOnSite = faceUrl(id);
    }
  }

  const imgFaceLocal = faceUrl(id);
  const imgSqLocal = sqUrl(id);

  markUsed(id, donor, 'face');

  // Owner 2026-07-13: essay TOP may / should dupe the face card URL (same as manual face/tops law).
  // Unique tops only if STAMP_UNIQUE_TOPS=1 (opt-in).
  let topUrl = imgOnSite;
  let topVia = donor.via + '+top-dupe-face';
  if (process.env.STAMP_UNIQUE_TOPS === '1') {
    const topDonor = pickOnSiteDonor(id, q, { slot: 'top' });
    if (topDonor && topDonor.file !== donor.file) {
      topUrl = topDonor.url;
      topVia = topDonor.via;
      markUsed(id, topDonor, 'top');
    }
  }
  // Ranking lists: NO top hero (product @@PRODUCT imgs only)
  const skipHero = !!opts.skipHero;
  if (!skipHero) body = setTopHeroMarkdown(body, q, topUrl);
  out.body = body;
  out.skipHero = skipHero;

  // Prefer materialized face/sq once live-put is on (blob-backed /assets/qa).
  const liveImg = bankOnCdn && mat.faceOk ? imgFaceLocal : imgOnSite;
  const liveSq = bankOnCdn && mat.sqOk ? imgSqLocal : imgOnSite;

  const patch = {
    question: q,
    h1: blob.h1 || q,
    title: blob.title || q,
    answer: body,
    img: liveImg,
    imgSq: liveSq,
    cover_src: donor.dupe ? 'onsite-dupe' : 'live-bank',
    face_title_baked: false,
    face_local_ready: !!mat.faceOk,
    face_path: imgFaceLocal,
    face_via: donor.via,
    top_via: topVia,
    top_url: topUrl,
    quality_score: Number.isFinite(quality) ? quality : 10,
    updated_at: new Date().toISOString(),
  };
  if (surface) patch.polished_at = now;

  await store.setJSON('answers/' + id + '.json', Object.assign({}, blob, patch));

  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    if (idx && Array.isArray(idx.entries)) {
      let ent = idx.entries.find((x) => x && String(x.id) === String(id));
      if (!ent) {
        ent = { id, has_answer: true };
        idx.entries.unshift(ent);
      }
      const tags = Array.isArray(ent.tags) ? ent.tags.slice() : [];
      const pfx = pillarOf(id);
      // Always dual-surface: pillar membership + Recents (owner 2026-07-13)
      if (pfx && !tags.includes(pfx)) tags.unshift(pfx);
      if (surface && !tags.includes('pulse-recent')) tags.push('pulse-recent');
      ent.tags = tags;
      ent.question = q;
      ent.h1 = ent.h1 || q;
      ent.img = patch.img;
      ent.imgSq = patch.imgSq;
      ent.cover_src = patch.cover_src;
      ent.face_title_baked = false;
      ent.quality_score = patch.quality_score;
      if (surface) {
        ent.ts = now;
        ent.polished_at = now;
        idx.entries = [ent].concat(idx.entries.filter((x) => x && String(x.id) !== String(id)));
      }
      await store.setJSON('_index.json', idx);
      out.surfaced = !!surface;
    }
  } catch (e) {
    out.indexErr = String(e.message || e);
  }

  if (surface) {
    try {
      const pfx = pillarOf(id);
      const poolF = path.join(WD, 'mosaic-pool-' + pfx + '.json');
      let pool = [];
      try {
        pool = JSON.parse(fs.readFileSync(poolF, 'utf8'));
      } catch (e) {
        pool = [];
      }
      if (!Array.isArray(pool)) pool = [];
      const row = {
        id,
        question: q,
        img: patch.imgSq,
        imgSq: patch.imgSq,
        cover_src: patch.cover_src,
        quality_score: patch.quality_score,
        ts: now,
      };
      // Keep pillar browse headroom in sync with Recents max (1000)
      pool = [row].concat(pool.filter((x) => x && x.id !== id)).slice(0, 1000);
      fs.writeFileSync(poolF, JSON.stringify(pool));
      out.pillarPool = poolF;
    } catch (e) {
      out.poolErr = String(e.message || e);
    }
  }

  out.ok = true;
  out.img = patch.img;
  out.imgSq = patch.imgSq;
  out.topUrl = topUrl;
  out.question = q;
  out.dupe = !!donor.dupe;
  out.via = donor.via;
  out.force = force;
  return out;
}

module.exports = {
  stampTitleFaceTop,
  pickOnSiteDonor,
  listLiveBankFiles,
  LIVE_BANK,
  faceUrl,
  sqUrl,
  faceOk,
  sqOk,
};
