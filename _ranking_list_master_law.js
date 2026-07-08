// 🔒 4444 LOCKED (owner 2026-07-06) — Ranking List Master Template Law.
// Applies to ALL ranking lists regardless of title wording:
//   "Top 10", "Best 10", "Best 5", "Best [N]", "The Best …", etc.
// Live order: title → word count → Direct Answer gold box → How We Ranked →
// 1..N picks + @@PRODUCT DDG photos → CRO after #3 → tail sections.
// NO top hero image (owner 2026-07-06) — product photos only; avoids wsrv/mobile hero failures.
// NO writer, scrub pass, grader tweak, or renderer change may bypass this without explicit owner passcode 4444.

const { auditTop10GoldTemplate, appliesTop10Gold } = require('./_ranking_top10_gold_template');
const RANKING_LIST_BYPASS_CODE = '4444';
/** Ranking lists never carry a top hero — N product @@PRODUCT imgs only. */
const RANKING_LIST_NO_TOP_HERO = true;

const TITLE_RANKING_PATTERNS = [
  /\btop\s*(?:10|ten)\b/i,
  /\bbest\s*(?:10|ten)\b/i,
  /\bbest\s*(?:five|5)\b/i,
  /\bbest\s+\d+\b/i,
  /\btop\s+\d+\b/i,
  /\bthe\s+best\b/i,
  /\bbest\s+of\b/i,
];

const SKIP_HEADINGS = /^#{2,3}\s+(?:How\s+We\s+Ranked(?:\s+These|\s+the\s+Top\s+10|\s+These\s+Products)?|How\s+We\s+Chose|How\s+We\s+Tested|How\s+We\s+Compared|FAQ|Sources|References|Related(?:\s+on\s+PULSE)?|Direct\s+Answer|TL;DR|Frequently|When\s+to\s+See|How\s+to\s+Choose|How\s+to|Key\s+Takeaway|Bottom\s+Line|What\s+to\s+Look\s+For|What\s+to)/i;

const REQUIRED_TAIL = [
  { key: 'howToChoose', re: /^#{2,3}\s+(?:How\s+to\s+Choose|Which\b)/im },
  { key: 'whatToLookFor', re: /^#{2,3}\s+What\s+to\s+Look\s+For/im },
  { key: 'faq', re: /^#{2,3}\s+FAQ/im },
  { key: 'bottomLine', re: /^#{2,3}\s+Bottom\s+Line/im },
  { key: 'sources', re: /^#{2,3}\s+(?:Sources|References)/im },
];

function countProductSections(body) {
  return (String(body || '').match(/^##\s+\d+\.\s/gm) || []).length;
}

function entryTitle(body) {
  const m = String(body || '').match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

function rankCountFromTitle(title) {
  const t = String(title || '');
  if (/\b(?:top|best)\s*(?:10|ten)\b/i.test(t)) return 10;
  if (/\b(?:best\s*(?:five|5)|top\s*5)\b/i.test(t)) return 5;
  const m = t.match(/\b(?:best|top)\s+(\d+)\b/i);
  if (m) return Math.min(10, Math.max(3, parseInt(m[1], 10)));
  if (/\bbest\s+of\b/i.test(t) || /\bthe\s+best\b/i.test(t)) return 10;
  return null;
}

function titleSuggestsRankingList(title) {
  return TITLE_RANKING_PATTERNS.some((re) => re.test(String(title || '')));
}

function hasRankMarkers(body) {
  return /(?:🏆|\bBEST\s+OVERALL\b|💎|\bBEST\s+VALUE\b|@@PRODUCT)/i.test(String(body || ''));
}

/** True for Top 10, Best 5, Best N, and any numbered ranking list body shape. */
function isRankingListBody(body, title) {
  const t = title != null ? String(title) : entryTitle(body);
  const numbered = countProductSections(body);
  if (numbered >= 5) return true;
  if (numbered >= 3 && hasRankMarkers(body)) return true;
  if (titleSuggestsRankingList(t) && (numbered >= 3 || hasRankMarkers(body))) return true;
  return false;
}

/** Back-compat alias used across the codebase. */
function isTop10Body(body) {
  return isRankingListBody(body);
}

function expectedRankCount(body, title) {
  const t = title != null ? String(title) : entryTitle(body);
  const fromTitle = rankCountFromTitle(t);
  const fromBody = countProductSections(body);
  if (fromTitle != null) return fromTitle;
  if (fromBody >= 3) return Math.min(10, fromBody);
  return 10;
}

function rankingImageTotal(body, title) {
  return expectedRankCount(body, title);
}

function stripRankingHeroMarkdown(body) {
  let b = String(body || '');
  if (!RANKING_LIST_NO_TOP_HERO) return b;
  b = b.replace(/^﻿?\s*!\[[^\]]*\]\([^)]+\)\s*\n+/m, '');
  return b.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function rankingListHasTopHero(body) {
  return /^﻿?\s*!\[[^\]]*\]\([^)]+\)/.test(String(body || ''));
}

const RANK_MD_IMAGE_LINE = /^!\[[^\]]*\]\([^)]+\)\s*$/;
const RANK_LINKED_MD_IMAGE_LINE = /^\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)\s*$/;

function isRankMarkdownImageLine(line) {
  const t = String(line || '').trim();
  return RANK_MD_IMAGE_LINE.test(t) || RANK_LINKED_MD_IMAGE_LINE.test(t);
}

/** One image per rank: first @@PRODUCT img= only — strip dupes + markdown inside ## 1.–## N. */
function stripRankSectionMarkdownImages(body, expected) {
  const n = expected != null ? expected : expectedRankCount(body);
  const lines = String(body || '').split('\n');
  const out = [];
  let inRank = false;
  let seenProductInRank = false;
  for (const line of lines) {
    const hm = line.match(/^##\s+(\d+)\.\s+/);
    if (hm) {
      const rank = parseInt(hm[1], 10);
      inRank = rank >= 1 && rank <= n;
      seenProductInRank = false;
      out.push(line);
      continue;
    }
    if (/^##\s+/.test(line)) {
      inRank = false;
      seenProductInRank = false;
      out.push(line);
      continue;
    }
    if (inRank) {
      const t = String(line || '').trim();
      if (isRankMarkdownImageLine(line)) continue;
      if (/^@@PRODUCT\b/.test(t)) {
        if (seenProductInRank) continue;
        seenProductInRank = true;
      }
    }
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function countRankSectionImageMarkers(block) {
  let count = 0;
  for (const line of String(block || '').split('\n')) {
    const t = line.trim();
    if (/^@@PRODUCT\b/.test(t)) count++;
    else if (isRankMarkdownImageLine(t)) count++;
  }
  return count;
}

function auditRankSectionImageLaw(body, rank) {
  const issues = [];
  const re = new RegExp('##\\s+' + rank + '\\.[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s+|$)', 'i');
  const block = (String(body || '').match(re) || [])[1] || '';
  const hasProduct = /^@@PRODUCT\b/m.test(block);
  const mdCount = (block.match(/^!\[[^\]]*\]\([^)]+\)\s*$/gm) || []).length;
  const linkedCount = (block.match(/^\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)\s*$/gm) || []).length;
  const markers = countRankSectionImageMarkers(block);
  if (mdCount + linkedCount > 0) issues.push('rank' + rank + '_markdown_image');
  if (hasProduct && mdCount + linkedCount > 0) issues.push('rank' + rank + '_duplicate_image');
  if (markers > 1) issues.push('rank' + rank + '_duplicate_image');
  return issues;
}

function auditRankingListMaster(body, title) {
  const b = String(body || '');
  const t = title != null ? String(title) : entryTitle(b);
  if (!isRankingListBody(b, t)) {
    return { compliant: true, issues: [], expectedCount: 0, applies: false };
  }
  const expected = expectedRankCount(b, t);
  const issues = [];
  if (!/^#{2,3}\s+Direct\s+Answer/im.test(b)) issues.push('missing_direct_answer');
  if (!/^#{2,3}\s+How\s+We\s+Ranked/im.test(b)) issues.push('missing_how_we_ranked');
  const numbered = countProductSections(b);
  if (numbered < expected) issues.push('numbered_sections_' + numbered + '_of_' + expected);
  if (!/(?:🏆|\bBEST\s+OVERALL\b)/i.test(b)) issues.push('missing_best_overall');
  if (!/(?:💎|\bBEST\s+VALUE\b)/i.test(b)) issues.push('missing_best_value');
  const productLines = (b.match(/^@@PRODUCT\b/gm) || []).length;
  if (productLines < expected) issues.push('product_lines_' + productLines + '_of_' + expected);
  if (RANKING_LIST_NO_TOP_HERO && rankingListHasTopHero(b)) issues.push('unexpected_top_hero');
  for (const sec of REQUIRED_TAIL) {
    if (!sec.re.test(b)) issues.push('missing_' + sec.key);
  }
  if (!/```mermaid[\s\S]*?```/i.test(b)) issues.push('missing_mermaid');
  for (let r = 1; r <= expected; r++) {
    issues.push(...auditRankSectionImageLaw(b, r));
  }

  const result = { compliant: issues.length === 0, issues, expectedCount: expected, applies: true };
  if (appliesTop10Gold(b, t)) {
    const gold = auditTop10GoldTemplate(b, t);
    if (gold.applies && !gold.compliant) {
      result.compliant = false;
      for (const gi of gold.issues) {
        if (!result.issues.includes('gold_' + gi)) result.issues.push('gold_' + gi);
      }
    }
    result.goldAudit = gold;
  }
  return result;
}

/** Deterministic structure fix: numbering, pills, @@PRODUCT stubs. ER pillar only unless force. */
function ensureRankingListFormat(id, body, title, opts) {
  opts = opts || {};
  const t = title != null ? String(title) : entryTitle(body);
  if (!isRankingListBody(body, t)) return body;
  if (opts.pillarOf && !opts.force) {
    try { if (opts.pillarOf(id, body) !== 'electronicreview') return body; } catch (e) { return body; }
  }
  const expected = expectedRankCount(body, t);
  const lines = String(body).split('\n');
  const prodRows = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^##\s+(?:\d+\.\s*)?(.+)$/);
    if (!m) continue;
    const rawTitle = m[1].trim();
    const probe = '## ' + rawTitle;
    if (SKIP_HEADINGS.test(probe)) {
      if (/^##\s+\d+\.\s+/.test(lines[i])) lines[i] = '## ' + rawTitle;
      continue;
    }
    prodRows.push({ i, title: rawTitle.replace(/^\d+\.\s*/, '') });
  }
  prodRows.slice(0, expected).forEach((row, idx) => {
    lines[row.i] = '## ' + (idx + 1) + '. ' + row.title;
  });
  let out = lines.join('\n');
  if (!/(?:🏆|\bBEST\s+OVERALL\b)/i.test(out)) {
    out = out.replace(/^(##\s+1\.\s+.+)$/m, '$1\n\n🏆 **BEST OVERALL**');
  }
  if (!/(?:💎|\bBEST\s+VALUE\b)/i.test(out)) {
    out = out.replace(/^(##\s+2\.\s+.+)$/m, '$1\n\n💎 **BEST VALUE**');
  }
  out = ensureRankingProductLines(out, expected);
  if (!/^#{2,3}\s+How\s+We\s+Ranked/im.test(out) && /^#{2,3}\s+Direct\s+Answer/im.test(out)) {
    out = out.replace(
      /^(#{2,3}\s+Direct\s+Answer[\s\S]*?)(\n#{2,3}\s)/m,
      '$1\n\n## How We Ranked These Products\n\n- **Quality and performance** — weighted against real buyer priorities\n- **Value for money** — street price vs. features you will actually use\n- **Reliability and support** — warranty, returns, and owner satisfaction\n- **Ease of use** — setup, daily operation, and learning curve\n- **Expert and owner reviews** — patterns from trusted review outlets\n\n$2'
    );
  }
  out = stripRankSectionMarkdownImages(out, expected);
  return out;
}

function rankBlockHasProduct(lines, startIdx) {
  for (let j = startIdx + 1; j < lines.length; j++) {
    if (/^##\s+/.test(lines[j])) break;
    if (/^@@PRODUCT\b/.test(String(lines[j] || '').trim())) return true;
  }
  return false;
}

function ensureRankingProductLines(body, expected) {
  const n = expected != null ? expected : expectedRankCount(body);
  const lines = String(body).split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    const hm = lines[i].match(/^##\s+(\d+)\.\s+(.+)$/);
    if (!hm) continue;
    if (parseInt(hm[1], 10) > n) continue;
    if (rankBlockHasProduct(lines, i)) continue;
    let name = hm[2]
      .replace(/\s*🏆\s*BEST\s+OVERALL\s*$/i, '')
      .replace(/\s*💎\s*BEST\s+VALUE\s*$/i, '')
      .replace(/\s*-\s*(Top Pick|Good Value|Best Value|Best Overall)\s*$/i, '')
      .replace(/\s*[🏆💎].*$/, '')
      .trim();
    if (name) out.push('@@PRODUCT name="' + name.replace(/"/g, '') + '"');
  }
  return out.join('\n');
}

module.exports = {
  RANKING_LIST_BYPASS_CODE,
  RANKING_LIST_NO_TOP_HERO,
  TITLE_RANKING_PATTERNS,
  countProductSections,
  entryTitle,
  rankCountFromTitle,
  titleSuggestsRankingList,
  isRankingListBody,
  isTop10Body,
  expectedRankCount,
  rankingImageTotal,
  stripRankingHeroMarkdown,
  stripRankSectionMarkdownImages,
  rankingListHasTopHero,
  isRankMarkdownImageLine,
  countRankSectionImageMarkers,
  auditRankSectionImageLaw,
  auditRankingListMaster,
  ensureRankingListFormat,
  ensureRankingProductLines,
};
