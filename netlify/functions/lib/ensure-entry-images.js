// Image LAW helpers: audit + ensure cover/product images before publish.
// Top-10 (>=5 numbered ## N. sections): 1 leading cover + 10 @@PRODUCT img= cards.
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

function countProductSections(body) {
  return (String(body || '').match(/^##\s+\d+\.\s/gm) || []).length;
}

function countProductImgs(body) {
  return (String(body || '').match(/@@PRODUCT[^\n]* img=/g) || []).length;
}

function isTop10Body(body) {
  return countProductSections(body) >= 5;
}

function wantedProductImgs(body) {
  const items = countProductSections(body);
  if (items < 5) return 0;
  return Math.min(10, items);
}

function auditImages(id, body) {
  const top10 = isTop10Body(body);
  const productImgs = countProductImgs(body);
  const wantProduct = wantedProductImgs(body);
  const coverMatch = leadingImageMatch(body);
  const coverOk = !!(coverMatch && !isWeakCoverUrl(coverMatch[2]));
  const needs = [];
  if (top10) {
    if (!coverOk) needs.push('cover');
    if (productImgs < 10 && wantProduct >= 10) needs.push('product_imgs');
    else if (productImgs < wantProduct) needs.push('product_imgs');
  } else if (!coverOk) {
    needs.push('cover');
  }
  const compliant = needs.length === 0;
  return { top10, coverOk, productImgs, wantProduct, needs, compliant };
}

function checkImagesLaw(body) {
  return auditImages('', body);
}

function cleanProductName(x) {
  return x
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}⭐️]/gu, ' ')
    .replace(/\bBEST OVERALL\b/gi, '')
    .replace(/\bBEST VALUE\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
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
  if (!hostedOnly) {
    const pick = await searchRealPhoto(name, id, { suffix: 'product photo' });
    if (pick && pick.img) return { img: pick.img, site: pick.site || '', via: pick.via || 'search' };
    const pick2 = await searchRealPhoto(name, id);
    if (pick2 && pick2.img) return { img: pick2.img, site: pick2.site || '', via: pick2.via || 'search' };
  }

  const poll = await pollinationsProductFor(name, id);
  if (poll) return { img: poll, site: '', via: 'pollinations' };

  const grok = await grokProductFor(name, id);
  if (grok) return { img: grok, site: '', via: 'grok' };


  await ensureImagenProbed();
  const gem = await geminiProductFor(name, id, { geminiOnly: true });
  if (gem) return { img: gem, site: '', via: 'gemini-image' };

  return { img: '', site: '', via: 'none' };
}

async function fetchProductImage(it, id, opts = {}) {
  const cacheKey = `${String(id || 'entry').replace(/\d+$/, '')}:${it.q.toLowerCase()}`;
  if (productQueryCache.has(cacheKey)) {
    const c = productQueryCache.get(cacheKey);
    return { idx: it.idx, q: it.q, img: c.img, site: c.site || '' };
  }
  const pick = await pickProductCostOptimized(it.q, id, opts);
  if (pick.img) productQueryCache.set(cacheKey, pick);
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
  const picks = [];
  for (const it of items) {
    picks.push(await fetchProductImage(it, id, opts));
  }
  const missing = picks.filter((p) => !p.img).length;
  if (missing > 0) {
    for (const p of picks) {
      if (!p.img) {
        for (let t = 0; t < 4 && !p.img; t++) {
          const pick = await pickProductCostOptimized(`${p.q} fill ${p.idx} ${t}`, id, opts);
          if (pick.img) {
            p.img = pick.img;
            if (pick.site) p.site = pick.site;
          } else await sleep(Math.floor(DDG_DELAY_MS / 2));
        }
      }
    }
  }
  const seen = new Set();
  for (const p of picks) {
    if (p.img) {
      if (seen.has(p.img)) p.img = '';
      else seen.add(p.img);
    }
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
  if (audit.top10 && audit.productImgs < audit.wantProduct) {
    const rebuilt = await rebuildProductImages(body, id);
    if (rebuilt && rebuilt.imgs > audit.productImgs) {
      body = rebuilt.body;
      changed = true;
    }
    audit = auditImages(id, body);
    if (audit.productImgs < audit.wantProduct) {
      const retry = await rebuildProductImages(body, id, { hostedOnly: true });
      if (retry && retry.imgs > audit.productImgs) {
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
  checkImagesLaw,
  ensureImages,
  isTop10Body,
  countProductImgs,
  countProductSections,
  rebuildProductImages,
};
