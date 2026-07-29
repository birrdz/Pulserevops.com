// 🔒 IMMUTABLE GOLD — Top 10 ranking list template locked to live reference aq1158.
// https://pulserevops.com/aquariums/aq1158
// Structure NEVER strays; each entry uses NEW content and NEW images per rank.
// Do not alter aq1158 blob. Bypass only with owner passcode 4444 via master law.

const {
  GOLD_IMAGE_PROVIDER_LAW,
  COOLDOWN_MS,
  DDG_COOLDOWN_MS,
  FLUX_COOLDOWN_MS,
  auditLivePollinationsInBody,
  auditDirectAnswerNotBlank,
} = require('./_image_provider_alternate');

// v2.2 TOP_LIST lane (parallel template). Soft-required so a missing/broken v2 module
// can never take down the v1 audit that 25 files depend on.
let V2 = null;
try { V2 = require('./_top10_v2_template'); } catch (e) { V2 = null; }

const TOP10_GOLD_ID = 'aq1158';
const TOP10_GOLD_URL = 'https://pulserevops.com/aquariums/aq1158';

/** Mandatory section sequence (aq1158). optionalMidBody = 0+ contextual H2s after last rank, before tail. */
const TOP10_SECTION_ORDER = [
  { key: 'directAnswer', label: 'Direct Answer', match: (h) => /^Direct\s+Answer$/i.test(h) },
  { key: 'howWeRanked', label: 'How We Ranked …', match: (h) => /^How\s+We\s+Ranked/i.test(h) },
  { key: 'rank1', label: '## 1. … 🏆 BEST OVERALL', kind: 'rank', rank: 1, pill: 'bestOverall' },
  { key: 'rank2', label: '## 2. … 💎 BEST VALUE', kind: 'rank', rank: 2, pill: 'bestValue' },
  { key: 'rank3', kind: 'rank', rank: 3 },
  { key: 'rank4', kind: 'rank', rank: 4 },
  { key: 'rank5', kind: 'rank', rank: 5 },
  { key: 'rank6', kind: 'rank', rank: 6 },
  { key: 'rank7', kind: 'rank', rank: 7 },
  { key: 'rank8', kind: 'rank', rank: 8 },
  { key: 'rank9', kind: 'rank', rank: 9 },
  { key: 'rank10', kind: 'rank', rank: 10 },
  { key: 'optionalMidBody', label: 'Optional contextual H2s (0+)', kind: 'optionalMidBody' },
  { key: 'howToChoose', label: 'How to Choose (+ mermaid)', match: (h) => /^(?:How\s+to\s+Choose|Which\b)/i.test(h), mermaid: true },
  { key: 'whatToLookFor', label: 'What to Look For', match: (h) => /^What\s+to\s+Look\s+For\b/i.test(h) },
  { key: 'faq', label: 'FAQ', match: (h) => /^FAQ$/i.test(h) },
  { key: 'bottomLine', label: 'Bottom Line', match: (h) => /^Bottom\s+Line$/i.test(h) },
  { key: 'sources', label: 'Sources', match: (h) => /^Sources$|^References$/i.test(h) },
];

const TOP10_TEMPLATE_OUTLINE = [
  'GOLD REFERENCE: ' + TOP10_GOLD_URL + ' (id ' + TOP10_GOLD_ID + ')',
  '',
  '1. ## Direct Answer — gold-box nuts-and-bolts (names Best Overall + Best Value with prices)',
  '2. ## How We Ranked These Products — weighted criteria bullets (never numbered as ## 1.)',
  '3. ## 1.–10. ranked picks in strict order:',
  '   - #1 heading includes 🏆 BEST OVERALL',
  '   - #2 heading includes 💎 BEST VALUE',
  '   - Each rank: @@PRODUCT name="…" img="…" site="…" on the line immediately after heading',
  '   - Body: narrative paragraphs, then Price/Pros/Cons bullets, **Verdict:** line',
  '   - Exactly ONE image per rank — @@PRODUCT img= only; NO ![…](…) markdown inside ## 1.–## 10.',
  '4. [Optional] 0+ contextual mid-body H2s between rank 10 and tail (e.g. Essential Upgrades, Common Pitfalls)',
  '5. ## How to Choose — single ```mermaid flowchart``` block',
  '6. ## What to Look For — bullet checklist',
  '7. ## FAQ — Q&A pairs (**Question?** then answer paragraph)',
  '8. ## Bottom Line — Best Overall + Best Value recap',
  '9. ## Sources — bullet list (+ optional People also search for line)',
  '',
  GOLD_IMAGE_PROVIDER_LAW,
  '',
  'NEVER: top hero image · stray section order · reuse aq1158 copy/images · extra mermaid outside How to Choose · markdown ![…](…) images inside ranked sections · live pollinations.ai URLs · blank Direct Answer',
  'ALWAYS: NEW content and NEW @@PRODUCT images per entry; template shape is fixed; DDG↔Pollinator alternation with 20s cooldown.',
].join('\n');

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

function countProductSections(body) {
  return (String(body || '').match(/^##\s+\d+\.\s/gm) || []).length;
}

function expectedRankCount(body, title) {
  const t = title != null ? String(title) : entryTitle(body);
  const fromTitle = rankCountFromTitle(t);
  const fromBody = countProductSections(body);
  if (fromTitle != null) return fromTitle;
  if (fromBody >= 3) return Math.min(10, fromBody);
  return 10;
}

function isRankingListBody(body, title) {
  const t = title != null ? String(title) : entryTitle(body);
  const numbered = countProductSections(body);
  if (numbered >= 5) return true;
  if (numbered >= 3 && /(?:🏆|\bBEST\s+OVERALL\b|💎|\bBEST\s+VALUE\b|@@PRODUCT)/i.test(String(body || ''))) return true;
  if (/\btop\s*(?:10|ten)\b|\bbest\s*(?:10|ten)\b/i.test(t) && (numbered >= 3 || /@@PRODUCT/.test(String(body || '')))) return true;
  return false;
}

function rankingListHasTopHero(body) {
  return /^﻿?\s*!\[[^\]]*\]\([^)]+\)/.test(String(body || ''));
}

function extractH2Headings(body) {
  return String(body || '')
    .split('\n')
    .filter((l) => /^##\s+/.test(l))
    .map((l) => l.replace(/^##\s+/, '').trim());
}

function parseRankHeading(text) {
  const m = String(text || '').match(/^(\d+)\.\s+(.+)$/);
  if (!m) return null;
  return { rank: parseInt(m[1], 10), rest: m[2].trim() };
}

function isOptionalMidBodyHeading(text) {
  if (parseRankHeading(text)) return false;
  const bare = String(text || '').trim();
  if (/^Direct\s+Answer$/i.test(bare)) return false;
  if (/^How\s+We\s+Ranked/i.test(bare)) return false;
  if (/^(?:How\s+to\s+Choose|Which\b)/i.test(bare)) return false;
  if (/^What\s+to\s+Look\s+For\b/i.test(bare)) return false;
  if (/^FAQ$/i.test(bare)) return false;
  if (/^Bottom\s+Line$/i.test(bare)) return false;
  if (/^(?:Sources|References)$/i.test(bare)) return false;
  return true;
}

function tailKeyForHeading(text) {
  const bare = String(text || '').trim();
  if (/^(?:How\s+to\s+Choose|Which\b)/i.test(bare)) return 'howToChoose';
  if (/^What\s+to\s+Look\s+For\b/i.test(bare)) return 'whatToLookFor';
  if (/^FAQ$/i.test(bare)) return 'faq';
  if (/^Bottom\s+Line$/i.test(bare)) return 'bottomLine';
  if (/^(?:Sources|References)$/i.test(bare)) return 'sources';
  // '## Related on PULSE' is REQUIRED by content_gate point 8 and sits after Sources. The audit used to
  // stop at Sources and then report it as 'extra_sections_after_sources' on every single page.
  if (/^Related\s+on\s+PULSE/i.test(bare)) return 'relatedPulse';
  return null;
}

function sectionBlock(body, headingRe) {
  const re = new RegExp(
    '(##\\s+' + headingRe + '[\\s\\S]*?)(?=\\n##\\s|$)',
    'i'
  );
  const m = String(body || '').match(re);
  return m ? m[1] : '';
}

function auditRankSection(body, rank) {
  const issues = [];
  const re = new RegExp('^##\\s+' + rank + '\\.\\s+(.+)$', 'm');
  const hm = String(body || '').match(re);
  if (!hm) {
    issues.push('missing_rank_' + rank);
    return issues;
  }
  const heading = hm[1];
  if (rank === 1 && !/(?:🏆|\bBEST\s+OVERALL\b)/i.test(heading)) issues.push('rank1_missing_best_overall');
  if (rank === 2 && !/(?:💎|\bBEST\s+VALUE\b)/i.test(heading)) issues.push('rank2_missing_best_value');

  const blockRe = new RegExp(
    '##\\s+' + rank + '\\.[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s+|$)',
    'i'
  );
  const block = (String(body || '').match(blockRe) || [])[1] || '';
  const lines = block.split('\n');
  const firstNonEmpty = lines.map((l) => l.trim()).find((l) => l.length > 0) || '';
  if (!/^@@PRODUCT\b/.test(firstNonEmpty)) issues.push('rank' + rank + '_product_not_first_line');
  if (!/^@@PRODUCT\s+name="/.test(firstNonEmpty)) issues.push('rank' + rank + '_product_missing_name');
  if (!/\bimg="/.test(firstNonEmpty)) issues.push('rank' + rank + '_product_missing_img');
  if (!/\bsite="/.test(firstNonEmpty)) issues.push('rank' + rank + '_product_missing_site');
  const mdCount = (block.match(/^!\[[^\]]*\]\([^)]+\)\s*$/gm) || []).length;
  const linkedCount = (block.match(/^\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)\s*$/gm) || []).length;
  if (mdCount + linkedCount > 0) issues.push('rank' + rank + '_markdown_image');
  const markers = (block.match(/^@@PRODUCT\b|^!\[[^\]]*\]\([^)]+\)\s*$|^\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)\s*$/gm) || []).length;
  if (markers > 1) issues.push('rank' + rank + '_duplicate_image');
  if (/^@@PRODUCT\b/m.test(block) && mdCount + linkedCount > 0) {
    issues.push('rank' + rank + '_duplicate_image');
  }
  return issues;
}

function appliesTop10Gold(body, title) {
  const t = title != null ? String(title) : entryTitle(body);
  if (!isRankingListBody(body, t)) return false;
  return expectedRankCount(body, t) === 10;
}

/** Strict audit: section order and per-rank @@PRODUCT shape must match aq1158 gold. */
function auditTop10GoldTemplate(body, title) {
  const b = String(body || '');
  const t = title != null ? String(title) : entryTitle(b);

  // ── v2.2 DISPATCH (additive, 2026-07-29) ──────────────────────────────────
  // Bodies stamped data-template="TOP_LIST" data-version="v2" are judged by the
  // v2.2 skeleton instead of the aq1158 v1 gold. The two are contradictory by
  // design (v1: 1 mermaid, no hero, @@PRODUCT · v2.2: 2 mermaids, hero, 11 imgs),
  // so they must never be audited by each other's rules. Every existing v1 body
  // falls straight through to the unchanged path below — this is the ONLY hook,
  // which is why new/_drip.js and new/improve_content.js inherit v2.2 untouched.
  if (V2 && V2.isTop10V2(b)) {
    const r = V2.auditTop10V2(b);
    return {
      compliant: r.compliant,
      issues: r.issues,
      applies: true,
      version: 'v2.2',
      waivable: r.waivable,
      nonWaivable: r.nonWaivable,
      wordCount: r.wordCount,
      mermaids: r.mermaids,
      bodyImages: r.bodyImages,
      goldId: 'TOP_LIST_v2',
      goldUrl: 'GOLDEN_TEMPLATE_TOP10_SKELETON.html',
    };
  }
  // ──────────────────────────────────────────────────────────────────────────

  if (!appliesTop10Gold(b, t)) {
    return { compliant: true, issues: [], applies: false, goldId: TOP10_GOLD_ID, goldUrl: TOP10_GOLD_URL };
  }

  const issues = [];
  const headings = extractH2Headings(b);

  if (headings.length < 15) issues.push('too_few_h2_headings_' + headings.length);

  if (!headings.length || !/^Direct\s+Answer$/i.test(headings[0])) {
    issues.push('first_section_not_direct_answer');
  }
  if (headings.length < 2 || !/^How\s+We\s+Ranked/i.test(headings[1])) {
    issues.push('second_section_not_how_we_ranked');
  }

  let idx = 2;
  for (let r = 1; r <= 10; r++) {
    const parsed = parseRankHeading(headings[idx]);
    if (!parsed || parsed.rank !== r) {
      issues.push('rank_' + r + '_out_of_order_at_index_' + idx);
      break;
    }
    idx++;
  }

  while (idx < headings.length && isOptionalMidBodyHeading(headings[idx])) {
    idx++;
  }

  const tailOrder = ['howToChoose', 'whatToLookFor', 'faq', 'bottomLine', 'sources', 'relatedPulse'];
  for (let ti = 0; ti < tailOrder.length; ti++) {
    const expected = tailOrder[ti];
    const key = tailKeyForHeading(headings[idx]);
    if (key !== expected) {
      issues.push('tail_out_of_order_expected_' + expected + '_got_' + (key || headings[idx] || 'none'));
      break;
    }
    idx++;
  }

  if (idx < headings.length) {
    issues.push('extra_sections_after_sources_' + headings.slice(idx).join('|'));
  }

  for (let r = 1; r <= 10; r++) {
    issues.push(...auditRankSection(b, r));
  }

  const howChoose = sectionBlock(b, '(?:How\\s+to\\s+Choose|Which[^\\n]*)');
  if (!howChoose) {
    issues.push('missing_how_to_choose_block');
  } else if (!/```mermaid[\s\S]*?```/i.test(howChoose)) {
    issues.push('how_to_choose_missing_mermaid');
  }

  const mermaidCount = (b.match(/```mermaid/gi) || []).length;
  // 🔧 1 → 2 (owner 2026-07-29: "do a mermaid at the top and a mermaid at the bottom"). This audit
  // demanded exactly ONE while new/content_gate.js — the actual 12/13 publish bar — demands exactly
  // TWO, so every Top-10 was guaranteed to fail one of the two rulebooks no matter what it did.
  // One diagram near the top in "How We Ranked These", one near the bottom in "How to Choose".
  if (mermaidCount !== 2) issues.push('mermaid_count_' + mermaidCount + '_expected_2');

  if (rankingListHasTopHero(b)) issues.push('unexpected_top_hero');

  issues.push(...auditLivePollinationsInBody(b));
  issues.push(...auditDirectAnswerNotBlank(b));

  return {
    compliant: issues.length === 0,
    issues,
    applies: true,
    goldId: TOP10_GOLD_ID,
    goldUrl: TOP10_GOLD_URL,
    headingCount: headings.length,
  };
}

module.exports = {
  TOP10_GOLD_ID,
  TOP10_GOLD_URL,
  TOP10_SECTION_ORDER,
  TOP10_TEMPLATE_OUTLINE,
  GOLD_IMAGE_PROVIDER_LAW,
  IMAGE_PROVIDER_COOLDOWN_MS: COOLDOWN_MS,
  DDG_THROTTLE_COOLDOWN_MS: DDG_COOLDOWN_MS,
  POLLINATOR_FREQ_MS: FLUX_COOLDOWN_MS,
  appliesTop10Gold,
  auditTop10GoldTemplate,
  extractH2Headings,
  // v2.2 TOP_LIST lane — re-exported so callers reach it through this one module.
  isTop10V2: (b) => !!(V2 && V2.isTop10V2(b)),
  renderTop10V2: (slots) => (V2 ? V2.renderTop10V2(slots) : null),
  auditTop10V2: (b) => (V2 ? V2.auditTop10V2(b) : null),
  TOP10_V2_SLOTS: V2 ? V2.V2_SLOTS : null,
  TOP10_V2_LAW: V2 ? V2.V2_LAW : null,
};
