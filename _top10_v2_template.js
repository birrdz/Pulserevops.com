// 🔒 TOP_LIST GOLDEN TEMPLATE v2.2 — parallel lane, ADDITIVE ONLY.
//
// This module does NOT replace _ranking_top10_gold_template.js (the aq1158 v1 gold).
// v1 and v2.2 are mutually contradictory by design:
//     v1  : markdown body · @@PRODUCT markers · EXACTLY 1 mermaid · top hero BANNED · 10 images
//     v2.2: HTML body     · {{SLOT}} skeleton · EXACTLY 2 mermaids · top hero REQUIRED · 11 images
// So v1 pages keep validating exactly as they do today. Only bodies carrying
// data-template="TOP_LIST" data-version="v2" are judged by this module.
//
// Structure is law: GOLDEN_TEMPLATE_TOP10_SKELETON.html is the single source of truth.
// Scope lock: content blobs only. Never edits the renderer, CSS, URLs, slugs, or registry.

'use strict';

const fs = require('fs');
const path = require('path');

const SKELETON_PATH = path.join(__dirname, 'GOLDEN_TEMPLATE_TOP10_SKELETON.html');

let _skeleton = null;
function skeleton() {
  if (_skeleton == null) _skeleton = fs.readFileSync(SKELETON_PATH, 'utf8');
  return _skeleton;
}

/** Every slot the writer must fill. Any survivor at audit time is a hard fail. */
const V2_SLOTS = [
  'TITLE', 'META_DESC', 'READ_MIN', 'UPDATED_ISO', 'UPDATED_HUMAN',
  'FACECARD_URL', 'FACECARD_ALT',
  'DIRECT_ANSWER', 'QUICK_TABLE_ROWS', 'HOW_WE_RANKED',
  'MERMAID_1', 'MERMAID_2',
  ...Array.from({ length: 11 }, (_, i) => ['IMG_' + (i + 1) + '_URL', 'IMG_' + (i + 1) + '_ALT']).flat(),
  ...Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    return ['ITEM_' + n + '_NAME', 'ITEM_' + n + '_BODY', 'ITEM_' + n + '_STAT'];
  }).flat(),
  ...Array.from({ length: 5 }, (_, i) => ['FAQ_Q' + (i + 1), 'FAQ_A' + (i + 1)]).flat(),
  'SOURCES_LIST', 'RELATED_LINKS',
];

/** Counts law (owner revision 2026-07-29 — these are what clears the live 13-point gate). */
const V2_LAW = {
  items: 10,
  bodyImages: 11,      // hero + one per ranked item; face card NOT counted
  mermaids: 2,         // both must be unique per page — MERMAID is NON-WAIVABLE for TOP_LIST
  faqs: 5,
  sourcesMin: 5, sourcesMax: 6,
  relatedMin: 3, relatedMax: 6,
  wordsMin: 2500, wordsMax: 3200,
};

function isTop10V2(body) {
  const b = String(body || '');
  return /data-template=["']TOP_LIST["']/.test(b) && /data-version=["']v2["']/.test(b);
}

/** Fill the skeleton. Missing keys are left as {{SLOT}} so the audit catches them loudly. */
function renderTop10V2(slots) {
  const s = slots || {};
  return skeleton().replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, key) =>
    Object.prototype.hasOwnProperty.call(s, key) && s[key] != null && String(s[key]).trim() !== ''
      ? String(s[key])
      : m
  );
}

/** Rendered word count: drop scripts, comments, mermaid fences, then all tags. */
function v2WordCount(html) {
  const cleaned = String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned ? cleaned.split(' ').filter(Boolean).length : 0;
}

function allMatches(html, re) {
  return Array.from(String(html || '').matchAll(re));
}

/**
 * Mechanized SELF-VALIDATION CHECKLIST. Returns { compliant, issues[], waivable[] }.
 * "waivable" = structural/cosmetic points the lane may publish at 12/13 against.
 * MERMAID, SOURCES and fabrication points are deliberately NOT waivable.
 */
function auditTop10V2(body) {
  const b = String(body || '');
  const issues = [];

  // — unfilled slots —
  const left = [...new Set(allMatches(b, /\{\{([A-Z0-9_]+)\}\}/g).map(m => m[1]))];
  if (left.length) issues.push('unfilled_slots_' + left.join('|'));

  // — root stamp —
  if (!/<article[^>]*class=["'][^"']*\bgolden\b[^"']*\btop10\b/.test(b)) issues.push('root_missing_golden_top10_class');
  if (!isTop10V2(b)) issues.push('root_missing_template_version_stamp');

  // — head —
  if (!/<figure[^>]*class=["'][^"']*\bg-facecard\b/.test(b)) issues.push('missing_facecard');
  if (!/<figcaption[^>]*class=["'][^"']*\bg-facecard-title\b/.test(b)) issues.push('missing_facecard_title');
  const h1s = allMatches(b, /<h1\b/gi).length;
  if (h1s !== 1) issues.push('h1_count_' + h1s + '_expected_1');
  if (!/<p[^>]*class=["'][^"']*\bg-byline\b/.test(b)) issues.push('missing_byline');

  // — ten item sections, in order, ids item-1..item-10 —
  const itemIds = allMatches(b, /<section[^>]*class=["'][^"']*\bg-item\b[^"']*["'][^>]*id=["']item-(\d+)["']/gi)
    .map(m => parseInt(m[1], 10));
  if (itemIds.length !== V2_LAW.items) issues.push('item_count_' + itemIds.length + '_expected_' + V2_LAW.items);
  for (let i = 0; i < itemIds.length; i++) {
    if (itemIds[i] !== i + 1) { issues.push('items_out_of_order_at_' + i + '_got_item-' + itemIds[i]); break; }
  }
  const rankHeads = allMatches(b, /<h2\b[^>]*>\s*#(\d+):\s*(\S[^<]*)<\/h2>/gi);
  if (rankHeads.length !== V2_LAW.items) issues.push('rank_h2_count_' + rankHeads.length + '_expected_' + V2_LAW.items);
  rankHeads.forEach((m, i) => {
    if (parseInt(m[1], 10) !== i + 1) issues.push('rank_h2_number_mismatch_at_' + (i + 1));
  });

  // — quick table: 10 rows matching item names/order —
  const qt = (b.match(/<section[^>]*class=["'][^"']*\bg-quicktable\b[\s\S]*?<\/section>/i) || [])[0] || '';
  if (!qt) issues.push('missing_quicktable');
  else {
    const rows = allMatches(qt, /<tr\b/gi).length - 1; // minus the thead row
    if (rows !== V2_LAW.items) issues.push('quicktable_rows_' + rows + '_expected_' + V2_LAW.items);
  }

  // — images: exactly 11 body images, hero eager, items lazy, alt non-empty, no dupes —
  const imgs = allMatches(b, /<img\b[^>]*>/gi).map(m => m[0]);
  const facecardBlock = (b.match(/<figure[^>]*class=["'][^"']*\bg-facecard\b[\s\S]*?<\/figure>/i) || [])[0] || '';
  const faceImgs = allMatches(facecardBlock, /<img\b[^>]*>/gi).map(m => m[0]);
  const bodyImgs = imgs.filter(t => !faceImgs.includes(t));
  if (bodyImgs.length !== V2_LAW.bodyImages) {
    issues.push('body_image_count_' + bodyImgs.length + '_expected_' + V2_LAW.bodyImages);
  }
  const srcOf = t => ((t.match(/\bsrc=["']([^"']+)["']/i) || [])[1] || '');
  const altOf = t => ((t.match(/\balt=["']([^"']*)["']/i) || [])[1] || '');
  for (const t of bodyImgs.concat(faceImgs)) {
    if (!altOf(t).trim()) { issues.push('image_missing_alt'); break; }
  }
  const srcs = bodyImgs.map(srcOf).filter(Boolean);
  if (new Set(srcs).size !== srcs.length) issues.push('duplicate_image_urls');
  const hero = (b.match(/<figure[^>]*class=["'][^"']*\bg-hero\b[\s\S]*?<\/figure>/i) || [])[0] || '';
  if (!hero) issues.push('missing_hero');
  else if (!/loading=["']eager["']/.test(hero)) issues.push('hero_not_eager');
  const lazyCount = bodyImgs.filter(t => /loading=["']lazy["']/.test(t)).length;
  if (lazyCount !== V2_LAW.items) issues.push('lazy_image_count_' + lazyCount + '_expected_' + V2_LAW.items);

  // — mermaids: exactly 2, and they must differ —
  const mers = allMatches(b, /```mermaid([\s\S]*?)```/gi).map(m => m[1].trim());
  if (mers.length !== V2_LAW.mermaids) {
    issues.push('mermaid_count_' + mers.length + '_expected_' + V2_LAW.mermaids);
  } else if (mers[0] === mers[1]) {
    issues.push('mermaid_diagrams_identical');
  }

  // — FAQ: 5 H3/p pairs —
  const faqBlock = (b.match(/<section[^>]*class=["'][^"']*\bg-faq\b[\s\S]*?<\/section>/i) || [])[0] || '';
  if (!faqBlock) issues.push('missing_faq_section');
  else {
    const qs = allMatches(faqBlock, /<h3\b/gi).length;
    if (qs !== V2_LAW.faqs) issues.push('faq_count_' + qs + '_expected_' + V2_LAW.faqs);
  }

  // — sources: 5–6 real external links —
  const srcBlock = (b.match(/<section[^>]*class=["'][^"']*\bg-sources\b[\s\S]*?<\/section>/i) || [])[0] || '';
  if (!srcBlock) issues.push('missing_sources_section');
  else {
    const urls = (srcBlock.match(/https?:\/\/[^\s"'<)]+/gi) || []).filter(u => !/pulserevops\.com/i.test(u));
    if (urls.length < V2_LAW.sourcesMin || urls.length > V2_LAW.sourcesMax) {
      issues.push('sources_' + urls.length + '_expected_' + V2_LAW.sourcesMin + '-' + V2_LAW.sourcesMax);
    }
  }

  // — related: 3–6 internal links —
  const relBlock = (b.match(/<nav[^>]*class=["'][^"']*\bg-related\b[\s\S]*?<\/nav>/i) || [])[0] || '';
  if (!relBlock) issues.push('missing_related_nav');
  else {
    const links = allMatches(relBlock, /<a\b[^>]*href=/gi).length;
    if (links < V2_LAW.relatedMin || links > V2_LAW.relatedMax) {
      issues.push('related_links_' + links + '_expected_' + V2_LAW.relatedMin + '-' + V2_LAW.relatedMax);
    }
  }

  // — three JSON-LD blocks —
  const ld = allMatches(b, /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi).map(m => m[1]);
  if (ld.length !== 3) issues.push('jsonld_block_count_' + ld.length + '_expected_3');
  for (const [type, label] of [['Article', 'article'], ['ItemList', 'itemlist'], ['FAQPage', 'faqpage']]) {
    if (!ld.some(x => new RegExp('"@type"\\s*:\\s*"' + type + '"').test(x))) issues.push('jsonld_missing_' + label);
  }
  for (const block of ld) {
    try { JSON.parse(block); } catch (e) { issues.push('jsonld_invalid_json'); break; }
  }
  // ItemList names must match the rank H2s exactly
  const itemList = ld.find(x => /"@type"\s*:\s*"ItemList"/.test(x)) || '';
  if (itemList && rankHeads.length === V2_LAW.items) {
    const names = allMatches(itemList, /"position"\s*:\s*\d+\s*,\s*"name"\s*:\s*"([^"]*)"/g).map(m => m[1]);
    rankHeads.forEach((m, i) => {
      const heading = m[2].trim();
      if (names[i] != null && names[i].trim() !== heading) {
        issues.push('itemlist_name_mismatch_at_' + (i + 1));
      }
    });
  }

  // — word band —
  const wc = v2WordCount(b);
  if (wc < V2_LAW.wordsMin || wc > V2_LAW.wordsMax) {
    issues.push('word_count_' + wc + '_expected_' + V2_LAW.wordsMin + '-' + V2_LAW.wordsMax);
  }

  // — no widget/ad markup stored in the blob (renderer injects it) —
  if (/class=["'][^"']*\bcro-card\b/i.test(b)) issues.push('cro_card_markup_in_blob');

  // — no classes outside the sanctioned set —
  const ALLOWED = new Set(['golden', 'top10', 'g-head', 'g-facecard', 'g-facecard-title', 'g-byline',
    'g-direct', 'g-quicktable', 'g-item', 'g-stat', 'g-method', 'g-faq', 'g-sources',
    'g-related', 'g-img', 'g-hero']);
  const stray = [...new Set(
    allMatches(b, /\bclass=["']([^"']+)["']/gi)
      .flatMap(m => m[1].split(/\s+/))
      .filter(c => c && !ALLOWED.has(c))
  )];
  if (stray.length) issues.push('unsanctioned_classes_' + stray.join('|'));

  // Structural/cosmetic points the lane may waive to publish at 12/13.
  // MERMAID, SOURCES, fabrication and unfilled slots are NEVER waivable.
  const WAIVABLE = /^(quicktable_rows_|related_links_|word_count_|unsanctioned_classes_|itemlist_name_mismatch_)/;
  const waivable = issues.filter(i => WAIVABLE.test(i));

  return {
    compliant: issues.length === 0,
    applies: true,
    issues,
    waivable,
    nonWaivable: issues.filter(i => !WAIVABLE.test(i)),
    wordCount: wc,
    mermaids: mers.length,
    bodyImages: bodyImgs.length,
    version: 'v2.2',
  };
}

module.exports = {
  SKELETON_PATH,
  skeleton,
  V2_SLOTS,
  V2_LAW,
  isTop10V2,
  renderTop10V2,
  auditTop10V2,
  v2WordCount,
};
