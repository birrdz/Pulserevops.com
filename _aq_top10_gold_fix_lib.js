// Aquariums pillar — Top 10 gold path (aq1158 law) for ranking list entries.
// Full structure rebuild via buildRankingBody + product images — NOT image-only patch.
process.env.IMAGE_PROVIDER_COOLDOWN_MS = process.env.IMAGE_PROVIDER_COOLDOWN_MS || '15000';
process.env.POLLINATOR_FREQ_MS = process.env.POLLINATOR_FREQ_MS || '20000';
process.env.DDG_THROTTLE_COOLDOWN_MS = process.env.DDG_THROTTLE_COOLDOWN_MS || '15000';
process.env.DDG_DELAY_MS = process.env.DDG_DELAY_MS || '15000';

const { pickGoldTemplate } = require('./_pulse_gold_template_router');
const {
  buildRankingBody,
  parseRankedProducts,
  fillProductImagesSequential,
  applyRankingMasterTemplate,
  saveRankingEntry,
  FORMAT_V_IMAGES,
} = require('./_ranking_list_rebuild_lib');
const { auditTop10GoldTemplate, appliesTop10Gold } = require('./_ranking_top10_gold_template');
const {
  stripRankingHeroMarkdown,
  stripRankSectionMarkdownImages,
  expectedRankCount,
  isRankingListBody,
} = require('./_ranking_list_master_law');
const {
  ensureDirectAnswerText,
  directAnswerFull,
} = require('./_format_fixer_lib');
const { auditDirectAnswerNotBlank, learnLogLine } = require('./_image_provider_alternate');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');
const { auditForeignPillarText } = require('./_mv_image_title_match');

const FORMAT_V_AQ_TOP10 = '2026-07-aq-top10-gold';

function needsAqTop10Fix(id, body, title, entry, forceAll) {
  if (pickGoldTemplate(id, body, title).template !== 'top10') return false;
  if (forceAll) return true;
  if (!auditTop10GoldTemplate(body, title).compliant) return true;
  if (entry && entry.format_v !== FORMAT_V_AQ_TOP10 && entry.format_v !== FORMAT_V_IMAGES) return true;
  const pre = (String(id).match(/^[a-z]+/) || [''])[0];
  if (pre === 'mv') {
    if (auditForeignPillarText(body).length) return true;
    if (/<!--pillar-weave-->/.test(body)) return true;
    if (/\bMatch tank size and maintenance plan\b/.test(body)) return true;
    if (/\bA solid pick at this rank\b/.test(body)) return true;
  }
  return false;
}

function fixGluedHeadings(body) {
  return String(body || '').replace(/([^\n])##\s+/g, '$1\n\n## ');
}

/** Inject exactly one valid mermaid fence inside How to Choose. */
function ensureSingleMermaidInHowToChoose(body, id) {
  const isMovie = (String(id || '').match(/^[a-z]+/) || [''])[0] === 'mv';
  const mermaid = isMovie
    ? '```mermaid\nflowchart TD\n  A[Set your mood] --> B{Priority?}\n  B -->|Best film| C[Pick #1 Best Overall]\n  B -->|Best value| D[Pick #2 Best Value]\n  C --> E[Match genre taste and viewing context]\n  D --> E\n```'
    : '```mermaid\nflowchart TD\n  A[Set your budget] --> B{Priority?}\n  B -->|Best performance| C[Pick #1 Best Overall]\n  B -->|Best value| D[Pick #2 Best Value]\n  C --> E[Match tank size and maintenance plan]\n  D --> E\n```';
  let b = fixGluedHeadings(body).replace(/```mermaid[\s\S]*?```/gi, '');
  const re = /(##\s+(?:How\s+to\s+Choose|Which[^\n]*)[^\n]*\n)([\s\S]*?)(?=\n##\s+|$)/i;
  if (!re.test(b)) return b.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return b.replace(re, '$1\n' + mermaid + '\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function stripRelatedAndPollinations(body) {
  return String(body || '')
    .replace(/<!--\s*(?:pillar-weave|cro-weave)\s*-->/gi, '')
    .replace(/\n##\s+Related on PULSE[\s\S]*?(?=\n##\s|$)/gi, '\n')
    .replace(/\n##\s+Recently Added[\s\S]*?(?=\n##\s|$)/gi, '\n')
    .replace(/https?:\/\/[^\s)"']*pollinations\.ai[^\s)"']*/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

function extractSectionBlock(body, headingPattern) {
  const re = new RegExp('(##\\s+' + headingPattern + '[^\\n]*\\n[\\s\\S]*?)(?=\\n##\\s+|$)', 'i');
  const m = fixGluedHeadings(body).match(re);
  return m ? m[1].trim() : '';
}

function stripTailSections(body) {
  let b = fixGluedHeadings(body);
  const patterns = [
    /\n##\s+(?:How\s+to\s+Choose|Which[^\n]*)[\s\S]*?(?=\n##\s+|$)/gi,
    /\n##\s+What\s+to\s+Look\s+For[\s\S]*?(?=\n##\s+|$)/gi,
    /\n##\s+(?:FAQ|Frequently\s+Asked\s+Questions)[\s\S]*?(?=\n##\s+|$)/gi,
    /\n##\s+Bottom\s+Line[\s\S]*?(?=\n##\s+|$)/gi,
    /\n##\s+(?:Sources|References)[\s\S]*?(?=\n##\s+|$)/gi,
    /\n##\s+Related on PULSE[\s\S]*?(?=\n##\s+|$)/gi,
    /\n##\s+Recently Added[\s\S]*?(?=\n##\s+|$)/gi,
  ];
  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    for (const re of patterns) {
      const next = b.replace(re, '');
      if (next !== b) { b = next; changed = true; }
    }
    if (!changed) break;
  }
  return b.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Force aq1158 tail order: How to Choose → What to Look For → FAQ → Bottom Line → Sources. */
function normalizeGoldBodyOrder(body, id, title) {
  const b = fixGluedHeadings(stripRelatedAndPollinations(body));
  const isMovie = (String(id || '').match(/^[a-z]+/) || [''])[0] === 'mv';
  const expected = expectedRankCount(b, title);
  const howToChoose = extractSectionBlock(b, '(?:How\\s+to\\s+Choose|Which[^\\n]*)')
    || (isMovie
      ? '## How to Choose\n\n```mermaid\nflowchart TD\n  A[Set your mood] --> B{Priority?}\n  B -->|Best film| C[Pick #1 Best Overall]\n  B -->|Best value| D[Pick #2 Best Value]\n  C --> E[Match genre taste and viewing context]\n  D --> E\n```\n'
      : '## How to Choose\n\n```mermaid\nflowchart TD\n  A[Set your budget] --> B{Priority?}\n  B -->|Best performance| C[Pick #1 Best Overall]\n  B -->|Best value| D[Pick #2 Best Value]\n  C --> E[Match tank size and maintenance plan]\n  D --> E\n```\n');
  const whatToLookFor = extractSectionBlock(b, 'What\\s+to\\s+Look\\s+For')
    || (isMovie
      ? '## What to Look For\n\n- **Director and cast** that match your taste\n- **Runtime and content rating** for your audience\n- **Streaming or format availability** (4K, IMAX, etc.)\n- **Critical consensus** from trusted film reviewers\n\n'
      : '## What to Look For\n\n- **Fit for your tank size** and livestock plans\n- **Ease of cleaning** and replacement parts availability\n- **Honest owner reviews** over marketing claims\n\n');
  let faq = extractSectionBlock(b, '(?:FAQ|Frequently\\s+Asked\\s+Questions)');
  if (faq) faq = faq.replace(/^##[^\n]+/i, '## FAQ');
  else faq = '## FAQ\n\n**What is the best overall pick?**\nSee rank **#1** above.\n\n**What is the best budget option?**\nRank **#2** is **Best Value**.\n\n';
  const bottomLine = extractSectionBlock(b, 'Bottom\\s+Line')
    || '## Bottom Line\n\nUse rank **#1** as **Best Overall** and rank **#2** as **Best Value**.\n\n';
  let sources = extractSectionBlock(b, '(?:Sources|References)');
  if (sources) sources = sources.replace(/^##[^\n]+/i, '## Sources');
  else sources = '## Sources\n\n- Manufacturer product documentation\n- Verified user review platforms\n';

  let head = stripTailSections(b).trimEnd();
  if (!/^##\s+Direct\s+Answer/im.test(head)) {
    head = '## Direct Answer\n\nSee our ranked picks below for **Best Overall** and **Best Value**.\n\n' + head;
  }
  if (!/^##\s+How\s+We\s+Ranked/im.test(head)) {
    head = head.replace(
      /^(##\s+Direct Answer[\s\S]*?)(\n##\s+\d+\.|$)/m,
      '$1\n\n## How We Ranked These Products\n\n- **Build quality & performance** — 25%\n- **Ease of use & maintenance** — 20%\n- **Value vs included gear** — 20%\n- **Reliability & support** — 20%\n- **Expert and owner reviews** — 15%\n\n$2'
    );
  }
  for (let r = 1; r <= expected; r++) {
    const hm = head.match(new RegExp('^##\\s+' + r + '\\.\\s+(.+)$', 'm'));
    if (!hm) continue;
    const baseName = hm[1].trim()
      .replace(/\s*🏆\s*BEST\s+OVERALL\s*$/i, '')
      .replace(/\s*💎\s*BEST\s+VALUE\s*$/i, '')
      .replace(/\s*[🏆💎][^\n]*$/g, '')
      .trim();
    const pill = r === 1 ? ' 🏆 BEST OVERALL' : (r === 2 ? ' 💎 BEST VALUE' : '');
    head = head.replace(new RegExp('^##\\s+' + r + '\\.\\s+.+$', 'm'), '## ' + r + '. ' + baseName + pill);
  }

  const tailParts = [howToChoose, whatToLookFor, faq, bottomLine, sources]
    .filter(Boolean)
    .map(s => String(s).trim() + '\n');
  return (head.trimEnd() + '\n\n' + tailParts.join('\n')).replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function collapseToGoldStructure(oldBody, id, title) {
  let b = stripRelatedAndPollinations(stripRankingHeroMarkdown(oldBody));
  b = stripRankSectionMarkdownImages(b, expectedRankCount(b, title));
  const expected = expectedRankCount(b, title);
  const products = parseRankedProducts(b, expected);
  if (products.length >= 5) {
    b = buildRankingBody(b, title, products, id);
  } else {
    b = applyRankingMasterTemplate(id, b, title);
  }
  b = normalizeGoldBodyOrder(b, id, title);
  b = ensureSingleMermaidInHowToChoose(b, id);
  return b.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function isStructureIssue(issue) {
  return /first_section|second_section|rank_\d+_out_of_order|tail_out_of_order|extra_sections|mermaid_count|missing_how_to_choose|how_to_choose_missing/.test(String(issue || ''));
}

async function rebuildAqTop10Entry(id, title, body, opts) {
  opts = opts || {};
  if (!appliesTop10Gold(body, title) && !isRankingListBody(body, title)) {
    throw new Error('Entry does not apply Top 10 gold: ' + id);
  }

  let b = collapseToGoldStructure(body, id, title);

  if (auditDirectAnswerNotBlank(b).length || !directAnswerFull(b)) {
    if (opts.onProgress) opts.onProgress({ label: 'regen Direct Answer', phase: 'direct-answer' });
    b = await ensureDirectAnswerText(title, b, opts.dsChat);
    b = ensureSingleMermaidInHowToChoose(b, id);
  }

  const expected = expectedRankCount(b, title);
  let products = parseRankedProducts(b, expected);
  if (products.length < 5) {
    throw new Error('Too few ranked sections for Top 10 gold rebuild: ' + products.length + ' of ' + expected);
  }

  if (opts.onProgress) opts.onProgress({ label: 'product images', phase: 'images' });
  b = await fillProductImagesSequential(b, id, products.slice(0, expected), opts.onProgress);

  let gold = auditTop10GoldTemplate(b, title);
  if (!gold.compliant && gold.issues.some(isStructureIssue)) {
    if (opts.onProgress) opts.onProgress({ label: 'gold structure retry', phase: 'format-retry' });
    b = collapseToGoldStructure(b, id, title);
    if (auditDirectAnswerNotBlank(b).length || !directAnswerFull(b)) {
      b = await ensureDirectAnswerText(title, b, opts.dsChat);
    }
    b = ensureSingleMermaidInHowToChoose(b, id);
    products = parseRankedProducts(b, expected);
    b = await fillProductImagesSequential(b, id, products.slice(0, expected), opts.onProgress);
    gold = auditTop10GoldTemplate(b, title);
  }

  const imgAudit = auditImages(id, b);
  const want = imgAudit.wantProduct || expected;
  if (imgAudit.productImgs < want) {
    throw new Error('Product images still short: ' + imgAudit.productImgs + ' of ' + want);
  }

  gold = auditTop10GoldTemplate(b, title);
  if (!gold.compliant) {
    throw new Error('Top 10 gold audit: ' + (gold.issues || []).join(', ') + ' (reference ' + gold.goldUrl + ')');
  }

  return {
    body: b,
    gold,
    grade: gradeEntry(id, b).score,
    productImgs: imgAudit.productImgs,
    learnLogLine: learnLogLine(),
  };
}

async function saveAqTop10Entry(store, idx, id, title, body, existing) {
  return saveRankingEntry(store, idx, id, title, body, existing, FORMAT_V_AQ_TOP10);
}

module.exports = {
  FORMAT_V_AQ_TOP10,
  needsAqTop10Fix,
  rebuildAqTop10Entry,
  saveAqTop10Entry,
  collapseToGoldStructure,
  normalizeGoldBodyOrder,
  ensureSingleMermaidInHowToChoose,
};
