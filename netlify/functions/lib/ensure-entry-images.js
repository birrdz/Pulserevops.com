// Image LAW helpers: audit + ensure cover/product images before publish.
// Every entry: 1 main top hero. Top-10 (>=5 numbered ## N. sections): hero + 10 @@PRODUCT = 11 total.
// Essay/Q&A: 1 topical leading cover (not placeholder.svg or /img/auto/*.svg).
//
// Cost-optimized pipeline (see image-pipeline-law.mdc):
//   topic cache → DuckDuckGo (workhorse, real photos) → Pollinations → Grok → Gemini.
//   Anthropic is NOT used (Claude has no image-generation API).
const {
  leadingImageMatch,
  isWeakCoverUrl,
  stripLeadingImage,
  pickCoverImage,
} = require('./img-cover-lib');
const {
  geminiCoverFor,
  geminiProductFor,
  pollinationsCoverFor,
  pollinationsProductFor,
  ensureImagenProbed,
} = require('./gemini-image-lib');
const { grokCoverFor, grokProductFor } = require('./grok-image-lib');
// Anthropic image gen intentionally NOT used — Claude has no image-gen API.
// Image workhorse = DuckDuckGo (real photos); throttle fallback = Pollinations → Gemini.
const { searchRealPhoto, DDG_DELAY_MS } = require('./img-search-lib');
const {
  topicKeyFromEntry,
  getTopicCachedImage,
  setTopicCachedImage,
  saveManifest,
} = require('./img-topic-cache');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const productQueryCache = new Map();

function logImagePick(id, kind, via) {
  if (via) console.log(`[image-pipeline] ${id || 'entry'} ${kind} via ${via}`);
}

const {
  countProductSections,
  isRankingListBody,
  isTop10Body,
  expectedRankCount,
  entryTitle,
} = require('../../../_ranking_list_master_law');

function countProductImgs(body) {
  return (String(body || '').match(/@@PRODUCT[^\n]* img=/g) || []).length;
}

function wantedProductImgs(body) {
  if (!isRankingListBody(body)) return 0;
  return expectedRankCount(body, entryTitle(body));
}

function cleanProductName(x) {
  return x
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu, ' ')
    .replace(/\bBEST OVERALL\b/gi, '')
    .replace(/\bBEST VALUE\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function normTop10Key(s) {
  return cleanProductName(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function top10NamesMatch(heading, productName) {
  const h = normTop10Key(heading);
  const p = normTop10Key(productName);
  if (!h || !p) return !p || h === p;
  if (h === p) return true;
  if (h.includes(p) || p.includes(h)) return true;
  const stop = new Set(['the', 'a', 'an', 'for', 'and', 'or', 'of', 'in', 'to', 'best', 'top']);
  const hw = h.split(' ').filter(w => w.length > 2 && !stop.has(w));
  const pw = p.split(' ').filter(w => w.length > 2 && !stop.has(w));
  if (!hw.length || !pw.length) return false;
  if (hw[0] === pw[0]) return true;
  return hw.slice(0, 2).join(' ') === pw.slice(0, 2).join(' ');
}

function parseTop10Items(body) {
  const lines = String(body || '').split(/\r?\n/);
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/);
    if (!hm) continue;
    const idx = hm[1];
    const heading = cleanProductName(hm[2]);
    let productName = '';
    let img = '';
    let site = '';
    for (let j = i + 1; j < lines.length && j <= i + 5; j++) {
      const pm = lines[j].match(/@@PRODUCT\s+name="([^"]*)"(?:\s+img="([^"]*)")?(?:\s+site="([^"]*)")?/);
      if (pm) {
        productName = cleanProductName(pm[1]);
        img = (pm[2] || '').trim();
        site = (pm[3] || '').trim();
        break;
      }
      if (/^##\s+\d+\./.test(lines[j])) break;
    }
    items.push({ idx, heading, productName, img, site });
  }
  return items;
}

function auditTop10ProductLaw(body) {
  const items = parseTop10Items(body);
  const dupes = [];
  const mismatches = [];
  const missing = [];
  let heroDupe = false;
  const seen = new Map();
  const coverMatch = leadingImageMatch(body);
  const heroUrl = coverMatch ? String(coverMatch[2] || '').trim() : '';

  for (const it of items) {
    if (!it.img) {
      missing.push(it.idx);
      continue;
    }
    if (seen.has(it.img)) {
      dupes.push({ idx: it.idx, url: it.img, dupeOf: seen.get(it.img) });
    } else {
      seen.set(it.img, it.idx);
    }
    if (heroUrl && it.img === heroUrl) heroDupe = true;
    if (it.heading && it.productName && !top10NamesMatch(it.heading, it.productName)) {
      mismatches.push({ idx: it.idx, heading: it.heading, productName: it.productName });
    }
  }
  return { items, dupes, mismatches, missing, heroDupe };
}

function auditImages(id, body) {
  const top10 = isTop10Body(body);
  const productImgs = countProductImgs(body);
  const wantProduct = wantedProductImgs(body);
  const coverMatch = leadingImageMatch(body);
  const coverOk = !!(coverMatch && !isWeakCoverUrl(coverMatch[2]));
  const needs = [];
  let top10Law = null;
  if (top10) {
    // No top hero on ranking lists (owner 2026-07-06) — product @@PRODUCT imgs only.
    if (productImgs < 10 && wantProduct >= 10) needs.push('product_imgs');
    else if (productImgs < wantProduct) needs.push('product_imgs');
    top10Law = auditTop10ProductLaw(body);
    if (top10Law.dupes.length) needs.push('product_img_dupes');
    if (top10Law.mismatches.length) needs.push('product_title_mismatch');
    if (top10Law.heroDupe) needs.push('product_hero_dupe');
    if (top10Law.missing.length) needs.push('product_imgs');
  } else if (!coverOk) {
    needs.push('cover');
  }
  const compliant = needs.length === 0;
  return { top10, coverOk, productImgs, wantProduct, needs, compliant, top10Law };
}

function checkImagesLaw(body) {
  return auditImages('', body);
}

/** Cost-first cover pick: cache → DDG real photo → pollinations → grok → gemini (no anthropic) */
async function pickCoverCostOptimized(title, id) {
  const topicKey = topicKeyFromEntry(title, id);
  const cached = getTopicCachedImage(topicKey);
  if (cached && cached.url) {
    return { img: cached.url, via: 'topic-cache', site: '' };
  }

  let pick = await searchRealPhoto(title, id);
  if (!pick) {
    const ddgLegacy = await pickCoverImage(title, id);
    if (ddgLegacy && ddgLegacy.img) pick = { img: ddgLegacy.img, site: '', via: ddgLegacy.via || 'ddg' };
  }
  if (pick && pick.img) {
    setTopicCachedImage(topicKey, pick.img);
    return pick;
  }

  const poll = await pollinationsCoverFor(title, id);
  if (poll) {
    setTopicCachedImage(topicKey, poll);
    return { img: poll, via: 'pollinations', site: '' };
  }

  const grok = await grokCoverFor(title, id);
  if (grok) {
    setTopicCachedImage(topicKey, grok);
    return { img: grok, via: 'grok', site: '' };
  }

  await ensureImagenProbed();
  const gem = await geminiCoverFor(title, id, { geminiOnly: true });
  if (gem) {
    setTopicCachedImage(topicKey, gem);
    return { img: gem, via: 'gemini-image', site: '' };
  }

  return null;
}

/** Cost-first product pick: DDG real photo → pollinations → grok → gemini (no anthropic) */
async function pickProductCostOptimized(name, id, opts = {}) {
  const hostedOnly = !!opts.hostedOnly;
  const exclude = new Set((opts.excludeUrls || []).map(u => String(u || '').trim()).filter(Boolean));
  const suffixes = [
    opts.suffix || 'official product photo',
    'screenshot cover art',
    'box art official',
    'gameplay screenshot',
    'official photo',
  ];
  const queries = [name];
  for (let t = 0; t < (opts.attempts || 5); t++) {
    queries.push(`${name} ${suffixes[t % suffixes.length]} ${opts.salt != null ? opts.salt : t}`);
  }

  async function accept(pick) {
    if (!pick || !pick.img) return null;
    if (exclude.has(pick.img)) return null;
    return pick;
  }

  if (!hostedOnly) {
    for (const q of queries) {
      let pick = await accept(await searchRealPhoto(q, id, { suffix: 'product photo' }));
      if (pick) return pick;
      pick = await accept(await searchRealPhoto(q, id));
      if (pick) return pick;
    }
  }

  for (const q of queries) {
    const poll = await accept({ img: await pollinationsProductFor(q, id), site: '', via: 'pollinations' });
    if (poll) return poll;
  }

  for (const q of queries) {
    const grok = await accept({ img: await grokProductFor(q, id), site: '', via: 'grok' });
    if (grok) return grok;
  }

  await ensureImagenProbed();
  for (const q of queries) {
    const gem = await accept({ img: await geminiProductFor(q, id, { geminiOnly: true }), site: '', via: 'gemini-image' });
    if (gem) return gem;
  }

  return { img: '', site: '', via: 'none' };
}

async function fetchProductImage(it, id, opts = {}) {
  const cacheKey = `${id}:${it.idx}:${it.q.toLowerCase()}`;
  if (!opts.skipCache && productQueryCache.has(cacheKey)) {
    const c = productQueryCache.get(cacheKey);
    if (!opts.excludeUrls || !opts.excludeUrls.includes(c.img)) {
      return { idx: it.idx, q: it.q, img: c.img, site: c.site || '' };
    }
  }
  const pick = await pickProductCostOptimized(it.q, id, Object.assign({ salt: it.idx }, opts));
  if (pick.img && !opts.skipCache) productQueryCache.set(cacheKey, pick);
  return { idx: it.idx, q: it.q, img: pick.img || '', site: pick.site || '' };
}

async function rebuildProductImages(answer, id, opts = {}) {
  productQueryCache.clear();
  const lines = String(answer || '').split(/\r?\n/).filter((l) => !/^@@PRODUCT/.test(l));
  const items = [];
  for (const l of lines) {
    const m = l.match(/^##\s+(\d+)\.\s+(.+)$/);
    if (m) items.push({ idx: m[1], q: cleanProductName(m[2]) });
  }
  if (items.length < 5) return null;

  const law = auditTop10ProductLaw(answer);
  const forceIdx = new Set();
  if (opts.forceAll) items.forEach(it => forceIdx.add(it.idx));
  (law.dupes || []).forEach(d => forceIdx.add(d.idx));
  (law.missing || []).forEach(idx => forceIdx.add(idx));
  (law.mismatches || []).forEach(m => forceIdx.add(m.idx));
  if (law.heroDupe) items.forEach(it => forceIdx.add(it.idx));

  const existing = parseTop10Items(answer);
  const existingByIdx = Object.fromEntries(existing.map(it => [it.idx, it]));

  const picks = [];
  const seen = new Set();
  const coverMatch = leadingImageMatch(answer);
  const heroUrl = coverMatch ? String(coverMatch[2] || '').trim() : '';
  if (heroUrl) seen.add(heroUrl);

  for (const it of items) {
    const prev = existingByIdx[it.idx];
    const mustRefetch = opts.forceAll || forceIdx.has(it.idx) || !prev || !prev.img;
    if (!mustRefetch && prev && prev.img && !seen.has(prev.img)) {
      picks.push({ idx: it.idx, q: it.q, img: prev.img, site: prev.site || '' });
      seen.add(prev.img);
      continue;
    }
    let got = null;
    // Fail fast (owner 2026-07-08): 2 outer × 2 inner DDG attempts, not 6×4 — so a slot DDG can't
    // source quickly falls through to the poster-library / Pollinator fill instead of hanging ~15 min.
    for (let t = 0; t < 2 && !got; t++) {
      const pick = await fetchProductImage(it, id, {
        skipCache: true,
        excludeUrls: [...seen],
        salt: `${it.idx}-${t}`,
        attempts: 2,
      });
      if (pick.img && !seen.has(pick.img)) {
        got = pick;
        seen.add(pick.img);
      } else {
        await sleep(Math.floor(DDG_DELAY_MS / 2));
      }
    }
    picks.push(got || { idx: it.idx, q: it.q, img: '', site: '' });
  }

  const card = {};
  let imgs = 0;
  for (const p of picks) {
    let str = `@@PRODUCT name="${p.q.replace(/"/g, '')}"`;
    if (p.img) {
      str += ` img="${p.img.replace(/"/g, '')}"`;
      imgs++;
    }
    if (p.site) str += ` site="${p.site.replace(/"/g, '')}"`;
    card[p.idx] = str;
  }
  const out = [];
  for (const l of lines) {
    out.push(l);
    const m = l.match(/^##\s+(\d+)\.\s/);
    if (m && card[m[1]]) out.push(card[m[1]]);
  }
  return { body: out.join('\n'), imgs, items: items.length };
}

async function ensureCoverImage(title, id, body) {
  const audit = auditImages(id, body);
  if (audit.coverOk) return body;

  const pick = await pickCoverCostOptimized(title, id);
  if (!pick || !pick.img) return body;

  logImagePick(id, 'cover', pick.via);
  saveManifest();
  const stripped = stripLeadingImage(body);
  return `![${title}](${pick.img})\n\n${stripped}`;
}

async function ensureImages(id, title, body) {
  let changed = false;
  let audit = auditImages(id, body);
  if (audit.compliant) return { body, audit, changed };

  if (!audit.coverOk) {
    const withCover = await ensureCoverImage(title, id, body);
    if (withCover !== body) {
      body = withCover;
      changed = true;
    }
  }

  audit = auditImages(id, body);
  const top10NeedsRebuild = audit.top10 && audit.needs.some(n =>
    ['product_imgs', 'product_img_dupes', 'product_title_mismatch', 'product_hero_dupe'].includes(n));
  if (top10NeedsRebuild) {
    const rebuilt = await rebuildProductImages(body, id, {
      forceAll: audit.needs.includes('product_img_dupes') || audit.needs.includes('product_hero_dupe'),
      hostedOnly: false,
    });
    if (rebuilt && (rebuilt.imgs > audit.productImgs || rebuilt.body !== body)) {
      body = rebuilt.body;
      changed = true;
    }
    audit = auditImages(id, body);
    if (audit.productImgs < audit.wantProduct || audit.needs.some(n =>
      ['product_img_dupes', 'product_title_mismatch', 'product_hero_dupe'].includes(n))) {
      const retry = await rebuildProductImages(body, id, { forceAll: true, hostedOnly: true });
      if (retry && retry.body !== body) {
        body = retry.body;
        changed = true;
      }
    }
  }

  audit = auditImages(id, body);
  saveManifest();
  return { body, audit, changed };
}

module.exports = {
  auditImages,
  auditTop10ProductLaw,
  checkImagesLaw,
  ensureImages,
  isTop10Body,
  countProductImgs,
  countProductSections,
  parseTop10Items,
  rebuildProductImages,
  top10NamesMatch,
  pickProductCostOptimized,
  fetchProductImage,
};
