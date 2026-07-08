// 🔒 IMMUTABLE GOLD — General Q&A template locked to live reference q11133.
// https://pulserevops.com/knowledge/q11133
// Structure NEVER strays; each entry uses NEW content and NEW images per entry.
// Ideal law (email template) — not q11133 quirks (numbered Bottom Line, duplicate FAQ).

const { isRankingListBody, entryTitle, titleSuggestsRankingList } = require('./_ranking_list_master_law');
const {
  GOLD_IMAGE_PROVIDER_LAW,
  COOLDOWN_MS,
  DDG_COOLDOWN_MS,
  FLUX_COOLDOWN_MS,
  auditLivePollinationsInBody,
  auditDirectAnswerNotBlank,
} = require('./_image_provider_alternate');

const QA_GOLD_ID = 'q11133';
const QA_GOLD_URL = 'https://pulserevops.com/knowledge/q11133';

const QA_MIN_CONTENT_SECTIONS = 5;

/** Mandatory section sequence (owner 2026-07-06). Text→image rhythm in body; CRO at render time. */
const QA_SECTION_ORDER = [
  { key: 'directAnswer', label: 'Direct Answer (gold border box at render)', match: (h) => /^Direct\s+Answer$/i.test(h) },
  { key: 'contentBody', label: 'Content H2 sections — text block then topical image, repeat', kind: 'contentBody', min: QA_MIN_CONTENT_SECTIONS },
  { key: 'faq', label: 'FAQ', match: (h) => /^FAQ$/i.test(h) },
  { key: 'sources', label: 'Sources', match: (h) => /^Sources$|^References$/i.test(h) },
  { key: 'related', label: 'Related on PULSE', match: (h) => /^Related\s+on\s+PULSE$/i.test(h) },
];

const QA_TEMPLATE_OUTLINE = [
  'GOLD REFERENCE: ' + QA_GOLD_URL + ' (id ' + QA_GOLD_ID + ')',
  '',
  'READING ORDER (live page):',
  '1. Title (page H1 — from question)',
  '2. ## Direct Answer — renders inside gold border box (#C8821E / #FBF3E4); dense answer prose; NO top hero before this',
  '3. Depth-section H2s (minimum 5, target 5–7 topical H2s — NOT ranked ## N. Product):',
  '   - Write a block of text (paragraphs)',
  '   - Then ONE topical image (![alt](url)) that illustrates that block',
  '   - Then more text → image → text → image …',
  '   - NEVER stack two images back-to-back without text between them',
  '4. CRO card — injected at RENDER time only (§0.1): desktop fixed-right; mobile inline after last depth-section H2, before Related — never in blob markdown',
  '5. ## FAQ — single header; 4–6 Q&As (**Question?** then answer)',
  '6. ## Sources — 5–10 bulleted real named sources',
  '7. ## Related on PULSE — internal library link line',
  '',
  'OPTIONAL (rubric may still require): 2 mermaid diagrams · ## Bottom Line before FAQ',
  '',
  GOLD_IMAGE_PROVIDER_LAW,
  '',
  'NEVER: top hero before Direct Answer · stacked images (img then img) · TL;DR · @@PRODUCT / ranking pills · CRO in blob · live pollinations.ai URLs · blank Direct Answer',
  'ALWAYS: text→image rhythm · NEW content per entry · topical library/pool reuse OK when match · DDG↔Pollinator alternation with 15s floor',
].join('\n');

const TAIL_KEYS = ['bottomLine', 'faq', 'sources', 'related'];

function isContentH2Heading(text) {
  if (/^Direct\s+Answer$/i.test(text)) return false;
  const tk = tailKeyForHeading(text);
  if (tk && tk !== 'numbered_bottom_line' && tk !== 'numbered_faq') return false;
  if (/^Bottom\s+Line$/i.test(text)) return false;
  return true;
}

function qaHasImageBeforeDirectAnswer(body) {
  const b = String(body || '').trim();
  const daIdx = b.search(/^##\s+Direct\s+Answer\b/im);
  if (daIdx <= 0) return false;
  const before = b.slice(0, daIdx);
  return /!\[[^\]]*\]\([^)]+\)/.test(before);
}

function qaHasStackedImages(body) {
  const b = String(body || '');
  if (/!\[[^\]]*\]\([^)]+\)\s*\n\s*!\[[^\]]*\]\([^)]+\)/m.test(b)) return true;
  const lines = b.split('\n');
  let prevImg = false;
  for (const line of lines) {
    const isImg = /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(line.trim());
    if (isImg && prevImg) return true;
    prevImg = isImg;
  }
  return false;
}

/** Strip any leading hero images so ## Direct Answer is first content. */
function ensureQaGoldBodyShape(body) {
  let b = String(body || '').replace(/\r\n/g, '\n').trim();
  b = b.replace(/^(\s*!\[[^\]]*\]\([^)]+\)\s*\n+)+/i, '');
  const daM = b.match(/##\s+Direct\s+Answer[\s\S]*?(?=\n##\s|$)/i);
  if (daM) {
    const daBlock = daM[0].trim();
    const rest = b.replace(daM[0], '').replace(/\n{3,}/g, '\n\n').trim();
    if (!/^##\s+Direct\s+Answer/im.test(b)) {
      b = daBlock + (rest ? '\n\n' + rest : '');
    }
  }
  return b.replace(/\n{3,}/g, '\n\n').trim();
}

function extractH2Headings(body) {
  return String(body || '')
    .split('\n')
    .filter((l) => /^##\s+/.test(l))
    .map((l) => l.replace(/^##\s+/, '').trim());
}

function parseNumberedHeading(text) {
  const m = String(text || '').match(/^(\d+)\.\s+(.+)$/);
  if (!m) return null;
  return { rank: parseInt(m[1], 10), rest: m[2].trim() };
}

function isNumberedContentHeading(text) {
  const parsed = parseNumberedHeading(text);
  if (!parsed) return false;
  if (/^Bottom\s+Line$/i.test(parsed.rest)) return false;
  if (/^(?:FAQ|Frequently\s+Asked)/i.test(parsed.rest)) return false;
  if (/^(?:Sources|References)$/i.test(parsed.rest)) return false;
  if (/^Related\s+on\s+PULSE$/i.test(parsed.rest)) return false;
  return true;
}

function tailKeyForHeading(text) {
  const bare = String(text || '').trim();
  if (/^Bottom\s+Line$/i.test(bare)) return 'bottomLine';
  if (/^FAQ$/i.test(bare) || /^Frequently\s+Asked/i.test(bare)) return 'faq';
  if (/^(?:Sources|References)$/i.test(bare)) return 'sources';
  if (/^Related\s+on\s+PULSE$/i.test(bare)) return 'related';
  const numbered = parseNumberedHeading(bare);
  if (numbered && /^Bottom\s+Line$/i.test(numbered.rest)) return 'numbered_bottom_line';
  if (numbered && /^(?:FAQ|Frequently\s+Asked)/i.test(numbered.rest)) return 'numbered_faq';
  return null;
}

function qaHasTopHero(body) {
  return /^﻿?\s*!\[[^\]]*\]\([^)]+\)/.test(String(body || ''));
}

function sectionBlock(body, headingRe) {
  const re = new RegExp(
    '(?:^|\\n)##\\s+' + headingRe + '[\\s\\S]*?(?=\\n##\\s+|$)',
    'i'
  );
  const m = String(body || '').match(re);
  return m ? m[0].replace(/^\n/, '').trim() : '';
}

function numberedSectionBlock(body, n) {
  return sectionBlock(body, n + '\\.[^\\n]*');
}

function countSubsectionsInBlock(block, sectionNum) {
  const re = new RegExp('^###\\s+' + sectionNum + '\\.\\d+', 'gm');
  return (String(block || '').match(re) || []).length;
}

function mermaidSectionIndexes(body, numberedCount) {
  const b = String(body || '');
  const indexes = [];
  for (let n = 1; n <= numberedCount; n++) {
    const block = numberedSectionBlock(b, n);
    if (block && /```mermaid[\s\S]*?```/i.test(block)) indexes.push(n);
  }
  return indexes;
}

function pillarIsQa(id, body, opts) {
  opts = opts || {};
  const entryId = String(id || '').toLowerCase();
  if (entryId === QA_GOLD_ID) return false;
  // mv pillar: Top-10 / poster law only — never GENERAL Q&A gold.
  if (/^mv\d+$/i.test(entryId)) return false;
  const b = String(body || '');
  const t = opts.title != null ? String(opts.title) : entryTitle(b);
  if (titleSuggestsRankingList(t) && isRankingListBody(b, t)) return false;
  if (isRankingListBody(b, t)) return false;
  if (isQaRankingList(b)) return false;
  // Any pillar essay id (ca####, tl####, q####, …) — GENERAL Q&A gold when body is essay shape.
  if (/^[a-z]{1,3}\d+$/i.test(entryId)) return true;
  return /^q\d+$/i.test(entryId);
}

function qaHasRankingMarkers(body) {
  const b = String(body || '');
  const rankHeads = (b.match(/^##\s+\d+[^\n]*/gm) || []).join('\n');
  return /(?:🏆|\bBEST\s+OVERALL\b|💎|\bBEST\s+VALUE\b)/i.test(rankHeads) || /^@@PRODUCT\b/m.test(b);
}

function isQaRankingList(body) {
  const b = String(body || '');
  const numbered = (b.match(/^##\s+\d+\.\s/gm) || []).length;
  return numbered >= 8 && qaHasRankingMarkers(b);
}

function appliesQaGold(id, body, opts) {
  opts = opts || {};
  const entryId = String(id || '').toLowerCase();
  if (entryId === QA_GOLD_ID) return false;
  const b = String(body || '');
  if (!pillarIsQa(entryId, b, { title: opts.title })) return false;
  if (isQaRankingList(b)) return false;
  return true;
}

/** Strict audit: hero → Direct Answer → numbered body → tail order must match q11133 gold law. */
function auditQaGoldTemplate(body, title, id) {
  const b = String(body || '');
  const t = title != null ? String(title) : entryTitle(b);
  const entryId = String(id || '').toLowerCase();

  if (entryId === QA_GOLD_ID) {
    return { compliant: true, issues: [], applies: false, goldId: QA_GOLD_ID, goldUrl: QA_GOLD_URL };
  }

  if (!appliesQaGold(entryId, b, { title: t })) {
    return { compliant: true, issues: [], applies: false, goldId: QA_GOLD_ID, goldUrl: QA_GOLD_URL };
  }

  const issues = [];
  const headings = extractH2Headings(b);

  if (qaHasImageBeforeDirectAnswer(b)) issues.push('image_before_direct_answer');
  if (qaHasTopHero(b) && !/^##\s+Direct\s+Answer/im.test(b.trim())) issues.push('top_hero_without_direct_answer');
  if (qaHasStackedImages(b)) issues.push('stacked_images');

  if (/\bTL;?DR\b/i.test(b)) issues.push('tldr_present');

  if (qaHasRankingMarkers(b)) {
    issues.push('ranking_markers_in_qa');
  }

  const faqHeadingCount = (b.match(/^##\s+(?:FAQ|Frequently\s+Asked)/gim) || []).length;
  if (faqHeadingCount > 1) issues.push('duplicate_faq_headers_' + faqHeadingCount);

  if (headings.length && !/^Direct\s+Answer$/i.test(headings[0])) {
    issues.push('first_h2_not_direct_answer');
  }

  let idx = headings.length && /^Direct\s+Answer$/i.test(headings[0]) ? 1 : 0;
  const contentHeadings = [];
  while (idx < headings.length && isContentH2Heading(headings[idx])) {
    contentHeadings.push(headings[idx]);
    idx++;
  }

  if (contentHeadings.length < QA_MIN_CONTENT_SECTIONS) {
    issues.push('content_sections_' + contentHeadings.length + '_min_' + QA_MIN_CONTENT_SECTIONS);
  }

  const imgCount = (b.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  if (process.env.GOLD_SKIP_IMG_GATE !== '1' && imgCount < 3) issues.push('section_images_' + imgCount + '_min_3'); // image gate skippable for structure-only runs (owner 2026-07-07)

  const tailOrder = TAIL_KEYS.filter(k => k !== 'bottomLine');
  for (let ti = 0; ti < tailOrder.length; ti++) {
    const expected = tailOrder[ti];
    const key = tailKeyForHeading(headings[idx]);
    if (key === 'numbered_faq') {
      issues.push('faq_numbered_not_unnumbered');
      idx++;
      continue;
    }
    if (key === 'bottomLine') {
      idx++;
      continue;
    }
    if (key !== expected) {
      issues.push('tail_out_of_order_expected_' + expected + '_got_' + (key || headings[idx] || 'none'));
      break;
    }
    idx++;
  }

  if (idx < headings.length) {
    const extra = headings.slice(idx).filter(h => !/^Bottom\s+Line$/i.test(h));
    if (extra.length) issues.push('extra_sections_after_tail_' + extra.join('|'));
  }

  issues.push(...auditLivePollinationsInBody(b));
  issues.push(...auditDirectAnswerNotBlank(b));

  return {
    compliant: issues.length === 0,
    issues,
    applies: true,
    goldId: QA_GOLD_ID,
    goldUrl: QA_GOLD_URL,
    headingCount: headings.length,
    contentSectionCount: contentHeadings.length,
    imageCount: imgCount,
  };
}

function needsQaGoldFix(body, title, id) {
  const entryId = String(id || '').toLowerCase();
  if (!appliesQaGold(entryId, body, { title })) return false;
  const audit = auditQaGoldTemplate(body, title, entryId);
  return audit.applies && !audit.compliant;
}

/** Audit the live gold reference (q11133) against corrected law — not exempt from checks. */
function auditGoldReferenceQa(body, title) {
  return auditQaGoldTemplate(body, title, 'q99999');
}

function extractTailSection(body, headingRe) {
  const re = new RegExp(
    '(?:^|\\n)(##\\s+' + headingRe + ')[\\s\\S]*?(?=\\n##\\s+|$)',
    'i'
  );
  const m = String(body || '').match(re);
  return m ? m[0].trim() : '';
}

/** Reorder tail to FAQ → Sources → Related; drop stray Recently Added blocks. */
function fixQaTailOrder(body) {
  let b = String(body || '');
  const bottom = extractTailSection(b, 'Bottom\\s+Line');
  const faq = extractTailSection(b, '(?:FAQ|Frequently\\s+Asked[^\\n]*)');
  const sources = extractTailSection(b, '(?:Sources|References)');
  const related = extractTailSection(b, 'Related\\s+on\\s+PULSE');
  const tailRes = [
    /##\s+Bottom\s+Line[\s\S]*?(?=\n##\s|$)/i,
    /##\s+(?:FAQ|Frequently\s+Asked)[\s\S]*?(?=\n##\s|$)/i,
    /##\s+(?:Sources|References)[\s\S]*?(?=\n##\s|$)/i,
    /##\s+Related\s+on\s+PULSE[\s\S]*?(?=\n##\s|$)/i,
    /##\s+Recently\s+Added[\s\S]*?(?=\n##\s|$)/i,
  ];
  let main = b;
  for (const re of tailRes) main = main.replace(re, '').trim();
  const parts = [main];
  if (bottom) parts.push(bottom);
  if (faq) parts.push(faq);
  if (sources) parts.push(sources);
  if (related) parts.push(related);
  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

function stripQaRankingArtifacts(body) {
  return String(body || '')
    .split('\n')
    .filter((line) => !/^@@PRODUCT\b/.test(line.trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Full blob shape pass: no top hero, no ranking artifacts, tail order, no stacked images. */
function reshapeQaGoldBody(body) {
  let b = stripQaRankingArtifacts(body);
  b = ensureQaGoldBodyShape(b);
  b = fixQaTailOrder(b);
  try {
    const { collapseConsecutiveImages } = require('./_visual_lock_law');
    b = collapseConsecutiveImages(b);
  } catch (e) {}
  return b.replace(/\n{3,}/g, '\n\n').trim();
}

module.exports = {
  QA_GOLD_ID,
  QA_GOLD_URL,
  QA_SECTION_ORDER,
  QA_TEMPLATE_OUTLINE,
  QA_MIN_CONTENT_SECTIONS,
  QA_MIN_NUMBERED: QA_MIN_CONTENT_SECTIONS,
  QA_MAX_NUMBERED: 12,
  GOLD_IMAGE_PROVIDER_LAW,
  IMAGE_PROVIDER_COOLDOWN_MS: COOLDOWN_MS,
  DDG_THROTTLE_COOLDOWN_MS: DDG_COOLDOWN_MS,
  POLLINATOR_FREQ_MS: FLUX_COOLDOWN_MS,
  appliesQaGold,
  auditQaGoldTemplate,
  needsQaGoldFix,
  auditGoldReferenceQa,
  fixQaTailOrder,
  stripQaRankingArtifacts,
  reshapeQaGoldBody,
  extractH2Headings,
  qaHasTopHero,
  qaHasImageBeforeDirectAnswer,
  qaHasStackedImages,
  ensureQaGoldBodyShape,
  numberedSectionBlock,
};
