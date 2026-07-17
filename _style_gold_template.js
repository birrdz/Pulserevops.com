// _style_gold_template.js — STYLE OUTFIT GUIDE golden template (sy0001).
// Written by Fable 2026-07-15 at Kory's direction — this module was referenced by
// _pulse_gold_template_router.js but never existed, which silently broke the router
// (require threw → callers fell back to generic shapes). This closes that hole.
//
// THE STYLE GOLD SHAPE (owner's law, Kory 2026-07-15):
//   · Cover (hero) image at the top.
//   · THREE men's looks + THREE women's looks — six ## outfit sections,
//     each for a distinct age range, each with ONE image that SHOWS what
//     that section's text is telling you to do (image matches instructions).
//   · Then the standard tail: ## Related questions → ## FAQ (6+ bold Q? pairs)
//     → ## Sources (5-10 named links) → ## Related on PULSE (3-5 internal links).
//   · 2500+ words. Images are Pexels-only (never generated), per image law.
'use strict';

const STYLE_GOLD_ID = 'sy0001';
const STYLE_GOLD_URL = 'https://pulserevops.com/style/sy0001';

// Image contract for the (future) image lane: cover + 3 men + 3 women = 7 slots,
// each body image derived from ITS OWN section's text (concrete nouns → Pexels query).
const STYLE_IMAGE_CONTRACT = {
  cover: 1,
  menSections: 3,
  womenSections: 3,
  rule: 'each section image must depict what that section\'s text instructs; Pexels only; pHash-distinct',
};

const MEN_RE = /^##[^\n]*\b(men|men's|male|him|guys?)\b/gim;
const WOMEN_RE = /^##[^\n]*\b(women|women's|female|her|ladies)\b/gim;

function countMatches(body, re) {
  const m = String(body || '').match(re);
  return m ? m.length : 0;
}

/** Style pillar = sy#### ids, or a body that already carries the outfit-guide shape. */
function appliesStyleGold(id, body, opts) {
  opts = opts || {};
  const entryId = String(id || '').toLowerCase();
  if (entryId === STYLE_GOLD_ID) return false;          // never rewrite the golden reference itself
  if (/^sy\d+$/i.test(entryId)) return true;            // style pillar by id
  const b = String(body || '');
  const t = opts.title != null ? String(opts.title) : '';
  // Body-shape fallback: an outfit/style guide with distinct men's and women's sections
  if (!/\b(outfit|wear|style|dress|wardrobe|look)\b/i.test(t + ' ' + b.slice(0, 800))) return false;
  return countMatches(b, MEN_RE) >= 2 && countMatches(b, WOMEN_RE) >= 2;
}

/** Audit vs the sy0001 gold shape. Returns { ok, failed: [checkNames] }.
 *  Image-slot checks are reported but callers in text-only mode may waive them. */
function auditStyleGoldTemplate(body, title) {
  const b = String(body || '');
  const failed = [];
  const men = countMatches(b, MEN_RE);
  const women = countMatches(b, WOMEN_RE);
  if (men < 3) failed.push('styleMen3');
  if (women < 3) failed.push('styleWomen3');
  if (!/^##\s+FAQ\b/im.test(b) || (b.match(/\*\*[^\n]*\?\*\*/g) || []).length < 6) failed.push('faq6');
  if (!/^##\s+Sources\b/im.test(b)) failed.push('sources5');
  if (!/^##\s+Related on PULSE\b/im.test(b)) failed.push('relatedPulse');
  if (b.split(/\s+/).length < 2000) failed.push('words2000');
  // image slots (cover + 6 section images) — image-lane concern
  const imgs = (b.match(/!\[[^\]]*\]\([^\)]+\)/g) || []).length;
  if (imgs < 7) failed.push('styleImages7');
  return { ok: failed.filter(c => c !== 'styleImages7').length === 0, failed };
}

/** Text the fixer feeds Claude so a Style page is rebuilt in the locked shape. */
const STYLE_TEMPLATE_SPEC =
  'TEMPLATE LAW — STYLE OUTFIT GUIDE (golden reference: ' + STYLE_GOLD_URL + '). ' +
  'Structure: short intro under the cover image, then EXACTLY six outfit ## sections — ' +
  'THREE for men and THREE for women, each targeting a distinct age range (e.g. 20s, 40s, 60+), ' +
  'each section giving concrete what-to-wear instructions (its image must be able to SHOW the outfit described — ' +
  'write instructions a photograph can depict), then ## Related questions → ## FAQ (6+ **bold question?** pairs) ' +
  '→ ## Sources (5-10 named links) → ## Related on PULSE (3-5 internal links). 2500+ words. ' +
  'Keep every existing image ![]() placeholder where it stands.';

module.exports = {
  STYLE_GOLD_ID,
  STYLE_GOLD_URL,
  STYLE_IMAGE_CONTRACT,
  STYLE_TEMPLATE_SPEC,
  appliesStyleGold,
  auditStyleGoldTemplate,
};
