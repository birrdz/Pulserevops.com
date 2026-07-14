'use strict';
/**
 * DD + Fixer image law (owner 2026-07-13):
 *   Best images = generic of the industry / product / activity / thing
 *   (chess → chessboard; anemone → reef anemone; brunch → brunch table)
 *   Essay: top + 2 from title keywords (generic thematic OK)
 *   Top 10: each ## N. title → keyword search for that thing (not brand logos)
 */
const fs = require('fs');
const path = require('path');
const { mustReplaceImageUrl, scrubBannedUrlsFromBody, assertAllowedImageUrl } = require('./_image_hard_bans');

const WD = __dirname;

const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const { isTop10Body, parseTop10Items } = (() => {
  try {
    return require('./netlify/functions/lib/ensure-entry-images');
  } catch (e) {
    return { isTop10Body: () => false, parseTop10Items: () => [] };
  }
})();
const {
  pickOnSiteDonor,
  listLiveBankFiles,
  stampTitleFaceTop,
} = require('./_stamp_title_face');

let deriveImageSearchQuery = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3).slice(0, 5).join(' ');
let sectionImageSearchQuery = (title, sect) => [deriveImageSearchQuery(title), deriveImageSearchQuery(sect)].filter(Boolean).join(' ').split(/\s+/).slice(0, 6).join(' ');
try {
  ({ deriveImageSearchQuery } = require('./netlify/functions/lib/derive-image-search-query'));
  ({ sectionImageSearchQuery } = require('./netlify/functions/lib/entry-image-query'));
} catch (e) {}

/** Min topical score to prefer local bank. Low = generic bank photos OK (owner). */
const BANK_MATCH_MIN = parseInt(process.env.IMG_BANK_MATCH_MIN || '1', 10);
/** When true, skip Pexels search if any unused bank file exists (generic OK). */
const GENERIC_BANK_FIRST = process.env.IMG_GENERIC_BANK !== '0';
/** Top-10 bank reuse only when filename/query score clears this (thematic). */
const TOP10_BANK_MATCH_MIN = parseInt(process.env.IMG_TOP10_BANK_MIN || '4', 10) || 4;

/** Build keyword search from entry title + rank heading + product name.
 *  Aim: industry / product / activity / thing — strip brand/SKU noise. */
function rankImageSearchQuery(entryTitle, rankHeading, productName) {
  const rawRank = String(productName || rankHeading || '').trim();
  const page = String(entryTitle || '').trim();
  const rankClean = rawRank
    .replace(/\b[A-Z]{0,4}\d{2,}[A-Za-z0-9\-]*\b/g, ' ')
    .replace(/\b(AP|MP|OW|GF|HP|MJ)\-?\d+\w*\b/gi, ' ')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  let q = '';
  try {
    q = sectionImageSearchQuery(page, rankClean || rawRank);
  } catch (e) {
    q = deriveImageSearchQuery((rankClean || rawRank) + ' ' + page);
  }
  if (!q || q.split(/\s+/).length < 2) {
    q = deriveImageSearchQuery(rankClean || rawRank) ||
      (rankClean || rawRank).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2).slice(0, 5).join(' ');
  }
  q = String(q || '')
    .replace(/\b(logo|screenshot|box art|official)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (q && !/\b(photo|photograph)\b/i.test(q)) q = q + ' photo';
  return String(q || rankClean || page).trim().slice(0, 120);
}

/** Essay Q&A: stay on title keywords only (industry / activity / thing). */
function essayTitleSearchQuery(title) {
  let q = '';
  try { q = deriveImageSearchQuery(title); } catch (e) { q = ''; }
  if (!q) {
    q = String(title || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter((w) => w.length > 3 && !/^(what|wear|best|how|worth|approach|2027|with|from|much|does|cost)$/.test(w))
      .slice(0, 5).join(' ');
  }
  q = String(q || '').replace(/\b(logo|screenshot)\b/gi, ' ').replace(/\s+/g, ' ').trim();
  if (q && !/\b(photo|photograph)\b/i.test(q)) q = q + ' photo';
  return q.slice(0, 120);
}

function scoreBankFile(file, query) {
  const name = path.basename(file || '').toLowerCase();
  // Prefer manifest query text when available
  let hay = name;
  try {
    const mani = JSON.parse(fs.readFileSync(path.join(WD, 'assets', 'qa', '_live_bank', '_manifest.json'), 'utf8'));
    const slot = (mani.slots || []).find((s) => s && s.file === path.basename(file));
    if (slot && slot.query) hay = (slot.query + ' ' + name).toLowerCase();
  } catch (e) {}
  const words = String(query || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !/^(photo|photograph|product|official)$/.test(w));
  let score = 0;
  for (const w of words) {
    if (hay.includes(w)) score += 4;
  }
  for (const h of ['chess', 'aquarium', 'anemone', 'moss', 'pump', 'reef', 'office', 'laptop', 'meeting', 'dashboard', 'store', 'restaurant', 'wedding', 'fashion']) {
    if (hay.includes(h) && String(query || '').toLowerCase().includes(h)) score += 3;
  }
  return score;
}

function bestBankMatch(query, exclude) {
  exclude = exclude || new Set();
  const bank = listLiveBankFiles();
  let best = null;
  for (const f of bank) {
    const url = '/assets/qa/_live_bank/' + path.basename(f);
    if (exclude.has(url)) continue;
    const score = scoreBankFile(f, query);
    if (!best || score > best.score) best = { path: f, file: path.basename(f), url, score };
  }
  return best;
}

function countMdImages(body) {
  return (String(body || '').match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
}

function countProductImgs(body) {
  return (String(body || '').match(/@@PRODUCT[^\n]* img="[^"]+"/g) || []).length;
}

function weakProductImg(url, searchQuery) {
  const u = String(url || '').trim();
  if (!u) return true;
  // Known junk / AI placeholders / logos — always rewrite
  if (mustReplaceImageUrl(u)) return true;
  if (/catbox\.moe|cro-syndicate|kory-white|usgv65/i.test(u)) return true;
  // Generic bank without topical keyword overlap → treat as weak (refill)
  if (searchQuery && /_live_bank\//i.test(u)) {
    const base = path.basename(u);
    const score = scoreBankFile(path.join(WD, 'assets', 'qa', '_live_bank', base), searchQuery);
    if (score < TOP10_BANK_MATCH_MIN) return true;
  }
  return false;
}

/** Essay top / face: rewrite only if missing or known-bad (keep fine photos). */
function weakTopImg(url, title) {
  const u = String(url || '').trim();
  if (!u) return true;
  if (mustReplaceImageUrl(u)) return true;
  if (/catbox\.moe|cro-syndicate|kory-white|usgv65/i.test(u)) return true;
  // Untitled face bake leftover: old yellow outline stamps marked in blob elsewhere;
  // URL-only: treat random bank as weak when title keywords miss hard
  if (title && /_live_bank\//i.test(u)) {
    const base = path.basename(u);
    const score = scoreBankFile(path.join(WD, 'assets', 'qa', '_live_bank', base), title);
    if (score < Math.max(BANK_MATCH_MIN, 2)) return true;
  }
  return false;
}

function sectionTargets(body) {
  const SKIP = /^##\s+(?:Direct\s+Answer|FAQ|Sources|References|Related|Bottom\s+Line|How\s+We\s+Ranked|TL;DR|How\s+to\s+Choose|What\s+to\s+Look\s+For)/i;
  const lines = String(body || '').split('\n');
  const h2 = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^##\s+\S/.test(lines[i])) continue;
    if (SKIP.test(lines[i])) continue;
    if (/^##\s+\d+\.\s/.test(lines[i])) continue;
    h2.push(i);
  }
  if (!h2.length) return [];
  if (h2.length <= 2) return h2.slice(0, 2);
  // spread two depth sections
  return [h2[0], h2[Math.floor(h2.length / 2)]].slice(0, 2);
}

function sectionHasImage(lines, headingIdx) {
  for (let j = headingIdx + 1; j < lines.length; j++) {
    if (/^#{1,3}\s/.test(lines[j])) break;
    if (/!\[[^\]]*\]\([^)]+\)/.test(lines[j])) return true;
  }
  return false;
}

function bodyImageUrls(body) {
  const set = new Set();
  const s = String(body || '');
  for (const m of s.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) set.add(m[1]);
  for (const m of s.matchAll(/@@PRODUCT[^\n]* img="([^"]+)"/g)) set.add(m[1]);
  return set;
}

/**
 * SHARED ladder for DD + Fixer (essay + Top 10):
 *   1) Pexels library (live bank) — keyword/thematic match
 *   2) Pexels search only (download → /assets/qa/) — NEVER pollinations
 * Essay: title keywords; looser bank match OK; generic bank last resort
 * Top 10: each ## 1–10 title keywords; bank only if thematic; no random bank dump
 */
async function pickLadderUrl(id, title, slotKey, exclude, queryHint, opts) {
  opts = opts || {};
  const specific = !!opts.specific; // Top-10 product slots
  exclude = exclude || new Set();
  const q = String(queryHint || title || id).trim();
  const bank = listLiveBankFiles();
  const unused = bank.filter((f) => !exclude.has('/assets/qa/_live_bank/' + path.basename(f)));
  const seed = [...String(id) + String(slotKey)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const hit = bestBankMatch(q, exclude);
  const bankMin = specific ? TOP10_BANK_MATCH_MIN : Math.max(BANK_MATCH_MIN, 4);

  // 1) Pexels library (on-site bank)
  if (hit && hit.score >= bankMin && !exclude.has(hit.url)) {
    return {
      url: hit.url,
      via: 'library:' + hit.score,
      path: hit.path,
      file: hit.file,
      score: hit.score,
      query: q,
      provider: 'library',
    };
  }

  // 2–7) Same serial rotate for DD + Fixer
  try {
    const { rotateFetchProductImage } = require('./_image_provider_rotate');
    const slotNum = Math.abs(seed % 900) + 50;
    const got = await rotateFetchProductImage(id, slotNum, q);
    if (got && got.url && !exclude.has(got.url)) {
      return {
        url: got.url,
        via: got.via || 'rotate',
        score: 99,
        provider: got.provider,
        query: q,
      };
    }
  } catch (e) {}

  // Essay only: generic unused bank last (Top 10 leaves empty for retry)
  if (!specific && GENERIC_BANK_FIRST && unused.length) {
    const f = unused[seed % unused.length];
    return {
      url: '/assets/qa/_live_bank/' + path.basename(f),
      via: 'library-generic',
      path: f,
      file: path.basename(f),
      query: q,
      provider: 'library',
    };
  }
  if (!specific && bank.length) {
    const f = bank[seed % bank.length];
    const url = '/assets/qa/_live_bank/' + path.basename(f);
    if (!exclude.has(url)) {
      return { url, via: 'library-dupe-last', path: f, file: path.basename(f), provider: 'library' };
    }
  }
  if (!specific) {
    const donor = pickOnSiteDonor(id, q, { slot: slotKey });
    if (donor && donor.url && !exclude.has(donor.url)) {
      return { url: donor.url, via: (donor.via || 'onsite') + '-fallback', path: donor.path, file: donor.file };
    }
  }
  return { url: null, via: 'none', query: q };
}

async function fillEssayTopPlusTwo(store, id, opts) {
  opts = opts || {};
  const title = String(opts.title || '').trim();
  let body = String(opts.body || '');
  const out = { id, kind: 'qa', ok: false, top: null, sections: 0, via: [] };

  // Existing leading hero — keep if fine; else prefer face-card dupe; else stamp/search.
  const lead = String(body).match(/^﻿?\s*!\[[^\]]*\]\(([^)\s]+)\)/);
  const leadUrl = lead && lead[1] ? lead[1] : '';
  const faceUrlExisting = String(opts.img || '').trim();
  const faceFine = faceUrlExisting && !weakTopImg(faceUrlExisting, title);
  const leadFine = leadUrl && !weakTopImg(leadUrl, title);
  const faceNeeds = !!opts.forceAll || !faceFine;
  // Top OK if lead is fine OR (face fine and lead already equals face)
  const topAlreadyFace = !!(faceFine && leadUrl && leadUrl === faceUrlExisting);
  const topNeeds = !!opts.forceAll || (!leadFine && !topAlreadyFace);

  let stamped = null;
  if (faceNeeds) {
    // New face → top dupe same URL (owner law)
    stamped = await stampTitleFaceTop(store, id, {
      title,
      body,
      surface: !!opts.surface,
      quality: opts.quality != null ? opts.quality : 10,
      force: true,
      skipHero: false,
    });
    if (stamped && stamped.body) body = stamped.body;
    out.via.push('top:' + (stamped && stamped.via ? stamped.via : 'stamp'));
  } else if (topNeeds && faceFine) {
    // Face fine, top missing/weak → dupe face into hero (no second search)
    const alt = title.replace(/[\[\]]/g, '').slice(0, 120) || 'photo';
    body = setTopHeroIfNeeded(body, alt, faceUrlExisting);
    stamped = { ok: true, via: 'top-dupe-face', img: faceUrlExisting, imgSq: opts.imgSq || faceUrlExisting };
    out.via.push('top:dupe-face');
  } else {
    stamped = { ok: true, via: 'keep-fine', img: faceUrlExisting || leadUrl, imgSq: opts.imgSq };
    out.via.push('top:keep-fine');
  }
  out.top = stamped;
  out.topRewrote = !!(faceNeeds || (topNeeds && faceFine));

  function setTopHeroIfNeeded(bodyIn, alt, url) {
    const hero = '![' + alt + '](' + url + ')\n\n';
    let s = String(bodyIn || '');
    s = s.replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n+/m, '');
    return hero + s;
  }

  // Two section images — stay on TITLE keywords only (not section headings)
  const titleKeywords = essayTitleSearchQuery(title) || deriveImageSearchQuery(title) || title;
  const lines = body.split('\n');
  const targets = sectionTargets(body);
  const exclude = bodyImageUrls(body);
  if (stamped && stamped.img) exclude.add(stamped.img);
  if (stamped && stamped.topUrl) exclude.add(stamped.topUrl);
  if (leadUrl) exclude.add(leadUrl);

  // Owner rhythm: top (face dupe) + exactly 2 more section images = text→image→text→image
  const forceSecs = !!opts.forceAll;
  let filled = 0;
  const inserts = [];
  for (const idx of targets) {
    if (filled >= 2) break;
    if (!forceSecs && sectionHasImage(lines, idx)) continue;
    const heading = lines[idx].replace(/^##\s+/, '').replace(/[\[\]"]/g, '').trim();
    const searchQ = titleKeywords; // locked: essay stays on title keywords
    const pick = await pickLadderUrl(id, title, 'sec' + idx, exclude, searchQ, { specific: false });
    if (!pick.url) continue;
    exclude.add(pick.url);
    out.via.push('sec:' + pick.via + ' q=' + String(searchQ).slice(0, 36));
    const cap = heading.slice(0, 80) || title.slice(0, 80);
    inserts.push({ idx, line: '![' + cap + '](' + pick.url + ')', replace: forceSecs && sectionHasImage(lines, idx) });
    filled++;
  }
  inserts.sort((a, b) => b.idx - a.idx).forEach((p) => {
    if (p.replace) {
      // Overwrite first markdown image in this section
      for (let j = p.idx + 1; j < lines.length; j++) {
        if (/^##\s/.test(lines[j])) break;
        if (/^!\[[^\]]*\]\([^)]+\)/.test(lines[j])) {
          lines[j] = p.line;
          return;
        }
      }
    }
    if (sectionHasImage(lines, p.idx)) return;
    lines.splice(p.idx + 1, 0, '', p.line, '');
  });
  body = lines.join('\n').replace(/\n{3,}/g, '\n\n');
  out.sections = filled;

  // Persist body
  try {
    const blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
    if (blob) {
      await store.setJSON('answers/' + id + '.json', Object.assign({}, blob, {
        answer: body,
        img: (stamped && stamped.img) || blob.img,
        imgSq: (stamped && stamped.imgSq) || blob.imgSq,
        updated_at: new Date().toISOString(),
      }));
    }
  } catch (e) {
    out.persistErr = String(e.message || e);
  }

  out.body = body;
  out.img = stamped && stamped.img;
  out.imgSq = stamped && stamped.imgSq;
  out.ok = !!(stamped && stamped.ok) && countMdImages(body) >= 3;
  out.mdImages = countMdImages(body);
  return out;
}

async function fillTop10ProductImgs(store, id, opts) {
  opts = opts || {};
  const title = String(opts.title || '').trim();
  let body = String(opts.body || '');
  const out = { id, kind: 'top10', ok: false, filled: 0, want: 0, via: [] };

  // Face/browse stamp ONLY — no top hero on ranking lists
  const stamped = await stampTitleFaceTop(store, id, {
    title,
    body,
    surface: !!opts.surface,
    quality: opts.quality != null ? opts.quality : 10,
    force: opts.force !== false,
    skipHero: true,
  });
  if (stamped && stamped.body) body = stamped.body;
  out.top = stamped;

  const items = typeof parseTop10Items === 'function' ? parseTop10Items(body) : [];
  out.want = Math.max(items.length, 10);
  const exclude = bodyImageUrls(body);
  const lines = body.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/);
    if (!hm) continue;
    const rank = hm[1];
    const heading = hm[2].replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}🏆💎⭐️]/gu, ' ').replace(/\bBEST OVERALL\b|\bBEST VALUE\b/gi, '').replace(/\s+/g, ' ').trim();
    let prodLine = -1;
    let name = heading;
    let site = '';
    let img = '';
    for (let j = i + 1; j < lines.length && j <= i + 5; j++) {
      const pm = lines[j].match(/^@@PRODUCT\s+name="([^"]*)"(?:\s+img="([^"]*)")?(?:\s+site="([^"]*)")?/);
      if (pm) {
        prodLine = j;
        name = (pm[1] || heading).trim() || heading;
        img = (pm[2] || '').trim();
        site = (pm[3] || '').trim();
        break;
      }
      if (/^##\s+\d+\./.test(lines[j])) break;
    }
    // Search from THIS rank's ## N. title (1–10)
    const searchQ = rankImageSearchQuery(title, heading, name);
    const keep = !opts.forceAll && img && !weakProductImg(img, searchQ) && !exclude.has(img);
    if (keep) {
      exclude.add(img);
      out.via.push(rank + ':keep-fine');
      continue;
    }
    const pick = await pickLadderUrl(id, title, 'p' + rank, exclude, searchQ, { specific: true });
    if (!pick.url) {
      if (prodLine < 0) {
        lines.splice(i + 1, 0, '@@PRODUCT name="' + name.replace(/"/g, '') + '" img="" site="' + site.replace(/"/g, '') + '"');
      }
      out.via.push(rank + ':miss q=' + searchQ.slice(0, 40));
      continue;
    }
    exclude.add(pick.url);
    out.via.push(rank + ':' + pick.via + ' q=' + searchQ.slice(0, 36));
    const line = '@@PRODUCT name="' + name.replace(/"/g, '') + '" img="' + pick.url.replace(/"/g, '') + '" site="' + site.replace(/"/g, '') + '"';
    if (prodLine >= 0) lines[prodLine] = line;
    else lines.splice(i + 1, 0, line);
    out.filled++;
  }

  body = lines.join('\n');
  try {
    const blob = await store.get('answers/' + id + '.json', { type: 'json', consistency: 'strong' });
    if (blob) {
      await store.setJSON('answers/' + id + '.json', Object.assign({}, blob, {
        answer: body,
        img: (stamped && stamped.img) || blob.img,
        imgSq: (stamped && stamped.imgSq) || blob.imgSq,
        updated_at: new Date().toISOString(),
      }));
    }
  } catch (e) {
    out.persistErr = String(e.message || e);
  }

  out.body = body;
  out.img = stamped && stamped.img;
  out.imgSq = stamped && stamped.imgSq;
  out.productImgs = countProductImgs(body);
  out.ok = out.productImgs >= Math.min(10, out.want || 10);
  return out;
}

/**
 * Main entry for DD + Fixer image stage.
 */
async function ensureDdFixerImages(store, id, opts) {
  opts = opts || {};
  let body = scrubBannedUrlsFromBody(String(opts.body || ''));
  const title = String(opts.title || '').trim();
  if (!body) {
    try {
      const blob = await store.get('answers/' + id + '.json', { type: 'json' });
      body = scrubBannedUrlsFromBody((blob && (blob.answer || blob.body)) || '');
      if (!opts.title && blob) opts.title = blob.question || blob.h1 || blob.title || '';
    } catch (e) {}
  }
  // Force-replace if face is pulse-og / pollinations
  if (mustReplaceImageUrl(opts.img)) opts.forceAll = true;
  if (mustReplaceImageUrl(opts.img)) opts.img = '';
  const route = pickGoldTemplate(id, body, title || opts.title);
  // CONTRACT-BINDING (2026-07-14): the caller's RECORDED type wins — never auto-detect.
  // opts.templateType / opts.typeHint: 'GENERAL'|'qa' = hero+2, 'TOP_LIST'|'top10' = hero+10.
  // Auto-detection (pickGoldTemplate/isRankingListBody/isTop10Body) is ONLY a fallback when
  // the caller supplies no type. Fixes the "Q&A entry filled as top10, 0 body images" bug.
  const hint = String(opts.templateType || opts.typeHint || '').trim().toUpperCase();
  let top10;
  if (hint === 'TOP_LIST' || hint === 'TOP10' || hint === 'TOPLIST') {
    top10 = true;
    route.bound = 'TOP_LIST';
  } else if (hint === 'GENERAL' || hint === 'QA' || hint === 'Q&A' || hint === 'ESSAY') {
    top10 = false;
    route.bound = 'GENERAL';
  } else {
    // No recorded type → fall back to auto-detect (legacy behavior).
    // Image path: real ranking BODY → fill 10 product imgs (forceAll rewrites all).
    // Title-only "Top 10" with essay body stays Q&A (gold law) — cannot invent 10 products.
    top10 = route.template === 'top10';
    try {
      const { isRankingListBody } = require('./_ranking_list_master_law');
      if (isRankingListBody(body, title || opts.title)) top10 = true;
    } catch (e) {}
    if (!top10 && typeof isTop10Body === 'function' && isTop10Body(body)) top10 = true;
    route.bound = 'auto';
  }
  if (top10) {
    const r = await fillTop10ProductImgs(store, id, Object.assign({}, opts, {
      title: title || opts.title,
      body,
      forceAll: opts.forceAll !== false, // image stage: fill/overwrite all 10
    }));
    r.template = 'top10';
    r.route = route;
    return r;
  }
  const r = await fillEssayTopPlusTwo(store, id, Object.assign({}, opts, { title: title || opts.title, body }));
  r.template = 'qa';
  r.route = route;
  return r;
}

module.exports = {
  ensureDdFixerImages,
  fillEssayTopPlusTwo,
  fillTop10ProductImgs,
  pickLadderUrl,
  rankImageSearchQuery,
  essayTitleSearchQuery,
  countMdImages,
  countProductImgs,
  weakProductImg,
  weakTopImg,
};
