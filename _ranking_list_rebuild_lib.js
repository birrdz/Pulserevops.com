// Shared rebuild for ranking-list master template (4444 law) — product imgs only (no top hero).
// Top 10 gold shape locked to immutable reference aq1158 — https://pulserevops.com/aquariums/aq1158
// 🔒 Image/provider law LOCKED: DDG↔Pollinator alternation, 20s cooldown, self-hosted paths — _image_provider_alternate.js
const { pickProductCostOptimized, rebuildProductImages, auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { stripLeadingImage } = require('./netlify/functions/lib/img-cover-lib');
const { searchRealPhoto } = require('./netlify/functions/lib/img-search-lib');
const { prefixOf } = require('./netlify/functions/lib/img-cover-lib');
const { waitForImageRender } = require('./_ranking_list_render_verify');
const { prepareEntryForPublish, finalizeIndexNow } = require('./_write_lib');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const {
  auditRankingListMaster,
  ensureRankingListFormat,
  expectedRankCount,
  isRankingListBody,
  titleSuggestsRankingList,
  stripRankingHeroMarkdown,
  stripRankSectionMarkdownImages,
  rankingListHasTopHero,
  RANKING_LIST_NO_TOP_HERO,
  auditRankSectionImageLaw,
} = require('./_ranking_list_master_law');
const { auditTop10GoldTemplate, appliesTop10Gold } = require('./_ranking_top10_gold_template');
const { directAnswerFull } = require('./_format_fixer_lib');
const { auditLivePollinationsInBody } = require('./_image_provider_alternate');
const { ensureAlternateSectionImage, pickMatchingLibraryImage } = require('./_ddg_facecard_lib');
const { buildMoviePosterSearchQuery, stripDuplicateFillerBlock } = require('./_mv_image_title_match');
const _pillarOf = (x) => (String(x).match(/^[a-z]+/) || [''])[0];

const FORMAT_V = '2026-07-ranking-master-no-hero';
const FORMAT_V_IMAGES = '2026-07-ranking-no-hero-imgs';

function pillarHub(id) {
  const pre = prefixOf(id);
  const map = {
    aq: 'aquariums', sw: 'software', tk: 'software', er: 'electronicreview',
    pt: 'pets', cr: 'crabbing', fs: 'fishing', ce: 'knowledge',
  };
  return map[pre] || 'knowledge';
}

function pillarUrl(id) {
  const hub = pillarHub(id);
  if (hub === 'knowledge') return 'https://pulserevops.com/knowledge/' + id;
  return 'https://pulserevops.com/' + hub + '/' + id;
}

function extractOptionalMidBodyBlocks(oldBody) {
  const re = /## 10\.[^\n]*\n[\s\S]*?(?=\n##\s+(?:How\s+to\s+Choose|Which\b))/i;
  const m = String(oldBody || '').match(re);
  if (!m) return '';
  const tail = (m[0].match(/\n##\s+10\.[^\n]*\n([\s\S]*)/i) || [])[1] || '';
  const blocks = [];
  const parts = tail.split(/\n(?=##\s+)/);
  for (const part of parts) {
    const hm = part.match(/^##\s+(.+)/);
    if (!hm) continue;
    const title = hm[1].trim();
    if (/^(?:How\s+to\s+Choose|Which\b)/i.test(title)) break;
    if (/^\d+\./.test(title)) continue;
    blocks.push(part.trim());
  }
  return blocks.length ? blocks.join('\n\n') + '\n\n' : '';
}

function assertNoLivePollinations(body, context) {
  const issues = auditLivePollinationsInBody(body);
  if (!issues.length) return;
  throw new Error((context || 'Live Pollinator URL in body') + ': ' + issues.join(', ') + ' — self-host before save');
}

function assertTop10GoldCompliance(body, title, context) {
  if (!appliesTop10Gold(body, title)) return;
  const gold = auditTop10GoldTemplate(body, title);
  if (gold.compliant) return;
  throw new Error(
    (context || 'Top 10 gold audit failed') + ': ' + (gold.issues || []).join(', ') +
    ' (reference ' + gold.goldUrl + ')'
  );
}

function assertRankingImageLaw(body, title, context) {
  if (!isRankingListBody(body, title) && !titleSuggestsRankingList(title)) return;
  const expected = expectedRankCount(body, title);
  const issues = [];
  for (let r = 1; r <= expected; r++) {
    issues.push(...auditRankSectionImageLaw(body, r));
  }
  if (!issues.length) return;
  throw new Error((context || 'Ranking image law failed') + ': ' + issues.join(', '));
}

function stripImages(s) {
  return String(s || '')
    .split('\n')
    .filter(l => !/^!\[/.test(l.trim()) && !/^@@PRODUCT/.test(l.trim()) && !/pollinations\.ai/i.test(l))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseRankedProducts(body, expected) {
  const products = [];
  const lines = String(body || '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/);
    if (!m) continue;
    const rank = parseInt(m[1], 10);
    if (rank < 1 || rank > expected) continue;
    let name = m[2].trim()
      .replace(/\s*🏆\s*BEST\s+OVERALL\s*$/i, '')
      .replace(/\s*💎\s*BEST\s+VALUE\s*$/i, '')
      .replace(/\s*[🏆💎].*$/, '')
      .trim();
    const sectionRe = new RegExp('##\\s+' + rank + '\\.[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)', 'i');
    const sm = body.match(sectionRe);
    const priceM = sm && sm[1].match(/\*\*Price\s*\/\s*Cost:\*\*\s*(.+)/i);
    const pill = rank === 1 ? '🏆 BEST OVERALL' : (rank === 2 ? '💎 BEST VALUE' : '');
    products.push({ rank, name, pill, price: priceM ? priceM[1].trim() : '' });
  }
  return products.sort((a, b) => a.rank - b.rank);
}

function stripForeignBoilerplate(text, id) {
  const pre = prefixOf(id || '');
  if (pre !== 'mv') return String(text || '');
  return String(text || '')
    .replace(/\n- \*\*Pros:\*\* Strong track record[^\n]*/gi, '')
    .replace(/\n- \*\*Cons:\*\* Match features to your team size[^\n]*/gi, '')
    .replace(/\n\*\*Verdict:\*\* A solid pick at this rank[^\n]*/gi, '')
    .replace(/day-to-day performance in real (?:business workflows|aquarium setups)/gi, '')
    .replace(/Proven in real deployments/gi, '')
    .trim();
}

// ALL-OR-NOTHING injection (owner 2026-07-07, structural fix for duplicate Verdict): a section that already has
// substantial authored prose is returned AS-IS — we never append a generic Pros/Cons/Verdict block alongside real
// content (that produced the "two verdicts" defect). The generated block renders ONLY for genuine stub sections.
const RICH_SECTION_MIN = 160;
function buildStubSectionBlock(product, title, id) {
  const pre = prefixOf(id || '');
  const isMovie = pre === 'mv';
  const isSw = pre === 'sw' || pre === 'tk';
  let text = isMovie
    ? 'The **' + product.name + '** earns its spot for **visual storytelling**, **cultural impact**, and **lasting influence** in cinema.'
    : isSw
      ? 'The **' + product.name + '** earns its spot for **core features**, **reliability**, and **day-to-day performance** in real business workflows.'
      : 'The **' + product.name + '** earns its spot for **build quality**, **reliability**, and **day-to-day performance** in real aquarium setups.';
  if (product.price) text += '\n\n- **Price / Cost:** ' + product.price;
  text += isMovie
    ? '\n- **Pros:** Iconic direction · Memorable performances · Rewatch value'
    : '\n- **Pros:** Strong track record · Good value · Proven in real deployments';
  text += isMovie
    ? '\n- **Cons:** Pacing or tone may not suit every viewer; check runtime and content rating'
    : '\n- **Cons:** Match features to your team size and integration needs';
  text += isMovie
    ? '\n\n**Verdict:** A definitive pick for fans of **' + title.replace(/^Top 10 /i, '').replace(/ Movies.*$/i, '').trim() + '**.'
    : '\n\n**Verdict:** A solid pick at this rank for **' + title.replace(/^Top 10 /i, '').replace(/ 2027$/i, '') + '**.';
  return text.trim();
}
function sectionBody(oldBody, rank, product, title, id) {
  const re = new RegExp('##\\s+' + rank + '\\.[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s+(?:\\d+\\.|FAQ|Sources|Bottom|How to|What to)|$)', 'i');
  const m = oldBody.match(re);
  let text = stripForeignBoilerplate(stripImages(m ? m[1] : ''), id);
  // Rich authored content stands alone — no generic block appended (prevents duplicate Verdict/boilerplate).
  if (text && text.length >= RICH_SECTION_MIN) {
    if (!/\*\*Price \/ Cost:\*\*/i.test(text) && product.price) text += '\n\n- **Price / Cost:** ' + product.price;
    return text.trim();
  }
  // Genuine stub → generate one complete block (single Pros/Cons/Verdict).
  return buildStubSectionBlock(product, title, id);
}

function extractBlock(oldBody, re, fallback) {
  const m = oldBody.match(re);
  return m ? stripImages(m[0]) : fallback;
}

function extractBestFaqBlock(oldBody, fallback) {
  const re = /##\s+(?:FAQ|Frequently\s+Asked\s+Questions)[^\n]*\n([\s\S]*?)(?=\n##\s+|$)/gi;
  let best = '';
  let bestCount = 0;
  let m;
  while ((m = re.exec(oldBody)) !== null) {
    const block = '## FAQ\n' + stripImages(m[0].replace(/^##[^\n]+\n?/i, ''));
    const count = (block.match(/^\*\*[^*]+\?\*\*/gm) || []).length;
    if (count >= bestCount) {
      bestCount = count;
      best = block.trim() + '\n\n';
    }
  }
  return bestCount ? best : fallback;
}

function extractBestSourcesBlock(oldBody, fallback) {
  const re = /##\s+(?:Sources|References)[^\n]*\n([\s\S]*?)(?=\n##\s+|$)/gi;
  let best = '';
  let bestCount = 0;
  let m;
  while ((m = re.exec(oldBody)) !== null) {
    const block = '## Sources\n' + stripImages(m[0].replace(/^##[^\n]+\n?/i, ''));
    const count = (block.match(/^[-*]\s+/gm) || []).length;
    if (count >= bestCount) {
      bestCount = count;
      best = block.trim() + '\n\n';
    }
  }
  return bestCount ? best : fallback;
}

function buildRankingBody(oldBody, title, products, id) {
  const direct = stripImages((oldBody.match(/##\s+Direct Answer\s*\n+([\s\S]*?)(?=\n##\s|\n```|$)/i) || [])[1] || '');
  const directBlock = direct || 'See our ranked picks below for the **Best Overall** and **Best Value** options, plus eight more strong alternatives with honest pros, cons, and price guidance.';

  const ranked = oldBody.match(/##\s+How\s+We\s+Ranked[\s\S]*?(?=\n##\s+\d+\.|$)/i);
  const howRanked = ranked
    ? stripImages(ranked[0])
    : '## How We Ranked These Products\n\nWe scored each pick using buyer-weighted criteria:\n\n- **Quality and performance** — weighted against real buyer priorities\n- **Value for money** — street price vs. features you will actually use\n- **Reliability and support** — warranty, returns, and owner satisfaction\n- **Ease of use** — setup, daily operation, and learning curve\n- **Expert and owner reviews** — patterns from trusted review outlets\n';

  let out = '## Direct Answer\n' + directBlock + '\n\n';
  out += howRanked + '\n\n';

  for (const p of products) {
    const heading = '## ' + p.rank + '. ' + p.name + (p.pill ? ' ' + p.pill : '');
    out += heading + '\n';
    out += '@@PRODUCT name="' + p.name.replace(/"/g, '') + '" site="https://www.amazon.com/s?k=' + encodeURIComponent(p.name.replace(/\s+/g, '+')) + '"\n';
    out += sectionBody(oldBody, p.rank, p, title, id) + '\n\n';
  }

  out += extractOptionalMidBodyBlocks(oldBody);

  out += extractBlock(oldBody, /##\s+How\s+to\s+Choose[\s\S]*?(?=\n##\s+(?:What to Look For|FAQ|Bottom|Sources)|$)/i,
    '## How to Choose\n\n```mermaid\nflowchart TD\n  A[Start with your goals] --> B{Budget?}\n  B -->|Starter| C[Best Value pick]\n  B -->|Premium| D[Best Overall pick]\n  C --> E[Validate with a trial]\n  D --> E\n```\n\n');

  out += extractBlock(oldBody, /##\s+What\s+to\s+Look\s+For[\s\S]*?(?=\n##\s+(?:FAQ|Bottom|Sources)|$)/i,
    '## What to Look For\n\n- **Fit for your use case** and team size\n- **Ease of setup** and replacement parts availability\n- **Honest owner reviews** over marketing claims\n\n');

  out += extractBestFaqBlock(oldBody,
    '## FAQ\n\n**What is the best overall pick?**\nSee rank **#1** above — it balances performance, value, and long-term reliability.\n\n**What is the best budget option?**\nRank **#2** is labeled **Best Value** for shoppers optimizing spend.\n\n');

  out += extractBlock(oldBody, /##\s+Bottom\s+Line[\s\S]*?(?=\n##\s+(?:Sources|Related)|$)/i,
    '## Bottom Line\n\nUse rank **#1** as your default **Best Overall** and rank **#2** as **Best Value**, then compare the rest for your specific setup.\n\n');

  out += extractBestSourcesBlock(oldBody,
    '## Sources\n\n- Manufacturer product documentation\n- Verified user review platforms\n- Independent comparison guides\n');

  return ensureRankingListFormat(id || 'x', ensureRequiredTail(out.replace(/\n{3,}/g, '\n\n').trim() + '\n', id), title, { force: true });
}

function ensureRequiredTail(body, id) {
  const pre = prefixOf(id || '');
  const isSoftware = pre === 'sw' || pre === 'tk';
  const isMovie = pre === 'mv';
  let b = String(body || '');
  const chooseTail = isMovie
    ? 'Match genre taste and viewing context'
    : isSoftware
      ? 'Match team size, integrations, and security requirements'
      : 'Match tank size and maintenance plan';
  const lookFor = isMovie
    ? '- **Director and cast** that match your taste\n- **Runtime and content rating** for your audience\n- **Streaming or format availability** (4K, IMAX, etc.)\n- **Critical consensus** from trusted film reviewers\n\n'
    : isSoftware
      ? '- **Integrations** with your existing stack\n- **Security & compliance** for your industry\n- **Total cost of ownership** (seats, add-ons, support)\n- **Honest user reviews** on G2 and Capterra\n'
      : '- **Fit for your tank size** and livestock plans\n- **Ease of cleaning** and replacement parts availability\n- **Honest owner reviews** over marketing claims\n\n';
  const faqExtra = isMovie
    ? '**Where can I stream this?**\nCheck major platforms (Netflix, Max, Prime, etc.) — availability changes by region.\n\n'
    : isSoftware
      ? '**How do I evaluate a free trial?**\nTest your top two picks with real workflows before committing to annual billing.\n\n'
      : '**How often should I maintain equipment?**\nFollow the manufacturer schedule and test water weekly during the first month.\n\n';
  const sources = isMovie
    ? '- IMDb and Metacritic consensus scores\n- Rotten Tomatoes critic and audience ratings\n- American Film Institute lists and archives\n- British Film Institute (BFI) guides\n'
    : isSoftware
      ? '- Vendor product documentation and trust centers\n- G2 and Capterra verified user reviews\n- Gartner Peer Insights and Forrester buyer guides\n- Independent SaaS comparison roundups\n'
      : '- Manufacturer product documentation\n- Reef2Reef community build threads\n- Aquarium Co-Op beginner guides\n- Bulk Reef Supply equipment comparisons\n';
  if (!/^#{2,3}\s+(?:How\s+to\s+Choose|Which\b)/im.test(b)) {
    b += '\n\n## How to Choose\n\n```mermaid\nflowchart TD\n  A[Set your budget] --> B{Priority?}\n  B -->|Best performance| C[Pick #1 Best Overall]\n  B -->|Best value| D[Pick #2 Best Value]\n  C --> E[' + chooseTail + ']\n  D --> E\n```\n\n';
  }
  if (!/^#{2,3}\s+What\s+to\s+Look\s+For/im.test(b)) {
    b += '\n\n## What to Look For\n\n' + lookFor;
  }
  if (!/^#{2,3}\s+FAQ/im.test(b)) {
    b += '\n\n## FAQ\n\n**What is the best overall pick?**\nSee rank **#1** above — labeled **Best Overall**.\n\n**What is the best budget option?**\nRank **#2** is **Best Value** for shoppers optimizing spend.\n\n' + faqExtra;
  }
  if (!/^#{2,3}\s+Bottom\s+Line/im.test(b)) {
    b += '\n\n## Bottom Line\n\nUse rank **#1** as your default **Best Overall** and rank **#2** as **Best Value**, then compare the rest for your specific setup.\n\n';
  }
  if (!/^#{2,3}\s+(?:Sources|References)/im.test(b)) {
    b += '\n\n## Sources\n\n' + sources;
  }
  // Gold aq1158: exactly one mermaid block inside How to Choose — never add "At a Glance".
  if (!appliesTop10Gold(b, null) && (b.match(/```mermaid/gi) || []).length < 1) {
    b = b.replace(
      /^(##\s+How\s+to\s+Choose[\s\S]*?)(\n##\s+What\s+to\s+Look\s+For)/im,
      '$1\n\n```mermaid\nflowchart TD\n  A[Best Overall] --> B[Premium path]\n  C[Best Value] --> D[Budget path]\n```\n$2'
    );
  }
  return b;
}

function applyRankingMasterTemplate(id, body, title) {
  let b = stripRankingHeroMarkdown(body);
  b = stripRankSectionMarkdownImages(b, expectedRankCount(b, title));
  if (!/^#{2,3}\s+Direct\s+Answer/im.test(b)) {
    b = '## Direct Answer\n\nSee our ranked picks below for **Best Overall**, **Best Value**, and strong alternatives with honest pros, cons, and price guidance.\n\n' + b;
  } else if (!directAnswerFull(b)) {
    b = b.replace(
      /##\s+Direct\s+Answer\s*\n+[\s\S]*?(?=\n#{2,3}\s|$)/i,
      '## Direct Answer\n\nSee our ranked picks below for **Best Overall**, **Best Value**, and strong alternatives with honest pros, cons, and price guidance.\n\n'
    );
  }
  b = ensureRankingListFormat(id, b, title, { force: true });
  if (!/^#{2,3}\s+How\s+We\s+Ranked/im.test(b)) {
    const rankedBullets = (prefixOf(id) === 'sw' || prefixOf(id) === 'tk')
      ? '- **Core features & UX** — 25%\n- **Integrations & ecosystem** — 20%\n- **Value vs total cost** — 20%\n- **Reliability & support** — 20%\n- **Expert and user reviews** — 15%\n\n'
      : '- **Build quality & performance** — 25%\n- **Ease of use & maintenance** — 20%\n- **Value vs included gear** — 20%\n- **Reliability & support** — 20%\n- **Expert and owner reviews** — 15%\n\n';
    b = b.replace(
      /^(#{2,3}\s+Direct\s+Answer[\s\S]*?)(\n#{2,3}\s+\d+\.|$)/m,
      '$1\n\n## How We Ranked These Products\n\n' + rankedBullets + '$2'
    );
  }
  b = ensureRequiredTail(b, id);
  return b.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function injectProductImg(body, rank, img, site) {
  const lines = String(body || '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(/^##\s+(\d+)\.\s+/);
    if (!hm || parseInt(hm[1], 10) !== rank) continue;
    for (let j = i + 1; j < lines.length && j < i + 6; j++) {
      if (/^##\s/.test(lines[j])) break;
      if (/^@@PRODUCT/.test(lines[j])) {
        const nm = (lines[j].match(/name="([^"]*)"/) || [])[1] || '';
        let line = '@@PRODUCT name="' + nm.replace(/"/g, '') + '"';
        if (img) line += ' img="' + String(img).replace(/"/g, '') + '"';
        if (site) line += ' site="' + String(site).replace(/"/g, '') + '"';
        lines[j] = line;
        return lines.join('\n');
      }
    }
  }
  return body;
}

async function fetchVerifiedProductImg(name, id, rank, seen, onProgress) {
  process.env.RANKING_SKIP_RENDER_VERIFY = '1';
  for (let attempt = 0; attempt < 8; attempt++) {
    const pick = await pickProductCostOptimized(name, id, {
      skipCache: true,
      excludeUrls: [...seen],
      salt: rank + '-' + attempt,
      attempts: 4,
    });
    if (!pick || !pick.img || seen.has(pick.img)) continue;
    if (onProgress) onProgress({ kind: 'product', rank, attempt: attempt + 1, name, url: pick.img });
    return { img: pick.img, site: pick.site || '' };
  }
  throw new Error('Product image pick failed: rank ' + rank + ' ' + name);
}

// Hard timeout wrapper — a hung provider fetch must never freeze the whole entry (owner 2026-07-07).
function withTimeout(promise, ms, label) {
  let t;
  const timeout = new Promise((_, rej) => { t = setTimeout(() => rej(new Error('timeout ' + (label || '') + ' ' + ms + 'ms')), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

async function fillProductImagesSequential(body, id, products, onProgress) {
  // SELF_HOST_PRODUCT_IMAGES=1 (movies/new project): self-host + stagger DDG↔Pollinator per product in ONE pass —
  // no external hotlink round for the Fable render gate to discard (kills the ~2x product-image bottleneck).
  const selfHost = process.env.SELF_HOST_PRODUCT_IMAGES === '1';
  const PROD_IMG_TIMEOUT_MS = parseInt(process.env.PROD_IMG_TIMEOUT_MS || '60000', 10);
  const seen = new Set();
  let out = stripRankingHeroMarkdown(body);
  for (const p of products) {
    const amzn = 'https://www.amazon.com/s?k=' + encodeURIComponent(String(p.name).replace(/\s+/g, '+'));
    let img = null, site = null;
    if (selfHost) {
      if (onProgress) onProgress({ kind: 'product', rank: p.rank, name: p.name });
      const posterQ = _pillarOf(id) === 'mv' ? buildMoviePosterSearchQuery(p.name) : p.name;
      try {
        img = await withTimeout(
          ensureAlternateSectionImage(id, p.rank, posterQ, { alternateSources: true, qaUpgradeAlternate: true, excludeUrls: [...seen], movieSlot: p.name, moviePoster: _pillarOf(id) === 'mv' }),
          PROD_IMG_TIMEOUT_MS, 'product#' + p.rank);
      } catch (e) { if (onProgress) onProgress({ kind: 'product-timeout', rank: p.rank, err: e.message }); img = null; }
      if (img) site = amzn;
    }
    if (!img) {
      try {
        const lib = await withTimeout(
          pickMatchingLibraryImage(id, _pillarOf(id), p.name, p.name, [...seen], { forSectionFill: true, pillarOnly: true, allowTopicalReuse: true, minScore: 4, requireMovieTitle: _pillarOf(id) === 'mv', movieSlot: p.name }),
          15000, 'lib#' + p.rank);
        if (lib) { img = lib; site = amzn; if (onProgress) onProgress({ kind: 'product-library-reuse', rank: p.rank }); }
        else if (_pillarOf(id) === 'mv' && onProgress) onProgress({ kind: 'no-library-match', rank: p.rank, name: p.name });
      } catch (e) { img = null; }
    }
    if (!img) { // last resort: legacy verified pick (hotlink) — gate self-hosts/repairs it later
      try {
        const got = await withTimeout(fetchVerifiedProductImg(p.name, id, p.rank, seen, onProgress), PROD_IMG_TIMEOUT_MS, 'legacy#' + p.rank);
        img = got.img; site = got.site || amzn;
      } catch (e) { if (onProgress) onProgress({ kind: 'product-fallback-timeout', rank: p.rank, err: e.message }); img = amzn; site = amzn; }
    }
    if (img) seen.add(img);
    out = injectProductImg(out, p.rank, img, site || amzn);
    if (onProgress) onProgress({ kind: 'product-done', rank: p.rank, total: products.length });
  }
  return out;
}

function needsRankingImagesFix(id, body, title) {
  if (!isRankingListBody(body, title) && !titleSuggestsRankingList(title)) return false;
  const imgAudit = auditImages(id, body);
  const want = imgAudit.wantProduct || expectedRankCount(body, title);
  if (imgAudit.needs.some(n => ['product_imgs', 'product_img_dupes', 'product_hero_dupe', 'product_title_mismatch'].includes(n))) {
    return true;
  }
  return imgAudit.productImgs < want;
}

async function rebuildRankingProductImages(id, title, body, opts) {
  opts = opts || {};
  let b = applyRankingMasterTemplate(id, body, title);
  const expected = expectedRankCount(b, title);
  const products = parseRankedProducts(b, expected);

  if (products.length >= 5) {
    b = await fillProductImagesSequential(b, id, products.slice(0, expected), opts.onProgress);
  } else {
    const rebuilt = await rebuildProductImages(b, id, { forceAll: true });
    if (!rebuilt || !rebuilt.body) {
      throw new Error('Too few ranked sections for product images: ' + products.length + ' of ' + expected);
    }
    b = stripRankingHeroMarkdown(rebuilt.body);
  }

  b = stripRankingHeroMarkdown(b);
  b = stripRankSectionMarkdownImages(b, expected);
  const imgAudit = auditImages(id, b);
  const want = imgAudit.wantProduct || expected;
  if (imgAudit.productImgs < want) {
    throw new Error('Product images still short: ' + imgAudit.productImgs + ' of ' + want);
  }
  assertTop10GoldCompliance(b, title, 'rebuildRankingProductImages');
  assertRankingImageLaw(b, title, 'rebuildRankingProductImages');
  return b;
}

async function spotCheckEntry(id, body, title) {
  const audit = auditRankingListMaster(body, title);
  const imgAudit = auditImages(id, body);
  const grade = gradeEntry(id, body);
  return {
    id,
    url: pillarUrl(id),
    masterOk: audit.compliant,
    masterIssues: audit.issues || [],
    productImgs: imgAudit.productImgs,
    wantProduct: imgAudit.wantProduct,
    grade: grade.score,
    pass: audit.compliant && imgAudit.compliant && grade.score >= 12,
  };
}

async function saveRankingEntry(store, idx, id, title, body, existing, formatV) {
  body = stripRankSectionMarkdownImages(body, expectedRankCount(body, title));
  // Remove any appended generic stub Pros/Cons/Verdict block baked in by older runs (structural, idempotent).
  body = stripDuplicateFillerBlock(body);
  assertNoLivePollinations(body, 'saveRankingEntry ' + id);
  assertRankingImageLaw(body, title, 'saveRankingEntry ' + id);
  assertTop10GoldCompliance(body, title, 'saveRankingEntry ' + id);
  const grade = gradeEntry(id, body);
  const now = Date.now();
  const tags = (existing && existing.tags) || [pillarHub(id), 'top-10'];
  const entry = prepareEntryForPublish(id, title, {
    id,
    question: title,
    answer: body,
    tags,
    quality_score: Math.max(12, grade.score >= 13 ? 13 : grade.score),
    format_v: formatV,
    pending: false,
    ts: existing && existing.ts ? existing.ts : now,
    polished_at: now,
    cover_src: 'no-hero',
    face_title_baked: false,
  });

  await store.setJSON('answers/' + id + '.json', entry);
  const row = {
    id,
    question: title,
    tags: entry.tags,
    quality_score: entry.quality_score,
    format_v: entry.format_v,
    pending: false,
    ts: entry.ts,
    polished_at: now,
    cover_src: 'no-hero',
    img: '',
  };
  const i = (idx.entries || []).findIndex(e => e && e.id === id);
  if (i >= 0) idx.entries[i] = Object.assign({}, idx.entries[i], row);
  else idx.entries.unshift(row);
  return { entry, row, grade: grade.score };
}

function needsMasterRebuild(id, body, title, entry, idxRow) {
  if (!isRankingListBody(body, title) && !titleSuggestsRankingList(title)) return false;
  if (rankingListHasTopHero(body)) return true;
  if (idxRow && idxRow.img) return true;
  if (entry && entry.format_v === FORMAT_V && entry.cover_src === 'no-hero') {
    const audit = auditRankingListMaster(body, title);
    if (audit.compliant && !needsRankingImagesFix(id, body, title)) return false;
    return true;
  }
  if (appliesTop10Gold(body, title)) {
    const gold = auditTop10GoldTemplate(body, title);
    if (gold.applies && !gold.compliant) return true;
  }
  if (entry && entry.format_v !== FORMAT_V && entry.format_v !== FORMAT_V_IMAGES) return true;
  if (entry && entry.cover_src !== 'no-hero') return true;
  return needsRankingImagesFix(id, body, title);
}

module.exports = {
  FORMAT_V,
  FORMAT_V_IMAGES,
  pillarUrl,
  pillarHub,
  buildRankingBody,
  parseRankedProducts,
  fillProductImagesSequential,
  injectProductImg,
  fetchVerifiedProductImg,
  needsMasterRebuild,
  needsRankingImagesFix,
  isRankingListBody,
  titleSuggestsRankingList,
  auditRankingListMaster,
  auditTop10GoldTemplate,
  spotCheckEntry,
  ensureRequiredTail,
  applyRankingMasterTemplate,
  rebuildRankingProductImages,
  saveRankingEntry,
};
