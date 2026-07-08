// image-relevance-gate.js — IMAGE RELEVANCE GATE + deterministic fallback chain.
// Source of truth: CLAUDE_CODE_PEXELS_IMAGE_RUN.md › "SPEC PATCH — IMAGE RELEVANCE GATE" (owner 2026-07-08).
// WHY: stock providers return their CLOSEST match even when nothing relevant exists; the old pipeline accepted
// it blindly → unrelated images. Fix = validate relevance BEFORE accepting any candidate. Deterministic chain,
// a relevance gate at each step, NEVER random provider alternation, NEVER DDG (DDG scraping = the original problem).
'use strict';

// SYNONYM MAP — extend as misses are reviewed (no-re-coaching rule; keep in sync with the spec file).
const SYNONYM_MAP = {
  crm: ['computer', 'laptop', 'office', 'screen', 'technology', 'business'],
  software: ['computer', 'laptop', 'office', 'screen', 'technology', 'business'],
  saas: ['computer', 'laptop', 'office', 'screen', 'technology', 'business'],
  platform: ['computer', 'laptop', 'office', 'screen', 'technology', 'business'],
  dashboard: ['computer', 'laptop', 'office', 'screen', 'technology', 'business'],
  sales: ['business', 'meeting', 'handshake', 'office', 'chart'],
  revenue: ['business', 'meeting', 'handshake', 'office', 'chart'],
  quota: ['business', 'meeting', 'handshake', 'office', 'chart'],
  training: ['presentation', 'whiteboard', 'meeting', 'classroom'],
  coaching: ['presentation', 'whiteboard', 'meeting', 'classroom'],
};

// Modifiers/adjectives that are never "core" nouns — stripped when isolating core terms.
const MODIFIERS = new Set([
  'best', 'top', 'good', 'great', 'cheap', 'affordable', 'premium', 'pro', 'mini', 'max', 'plus', 'ultra',
  'wireless', 'wired', 'portable', 'noise', 'cancelling', 'canceling', 'smart', 'new', 'small', 'large',
  'for', 'and', 'the', 'with', 'in', 'on', 'of', 'to', 'a', 'an', 'your', 'my',
]);

/** CORE TERMS: the 1–3 most specific nouns in the derived query (head nouns preferred). */
function extractCoreTerms(query) {
  const words = String(query || '').toLowerCase().replace(/[^a-z0-9\s]+/g, ' ').split(/\s+/).filter(Boolean);
  const nouns = words.filter((w) => w.length > 1 && !MODIFIERS.has(w));
  const pool = nouns.length ? nouns : words;
  // prefer terms that are keys in the synonym map, then the head (last) nouns
  const mapped = pool.filter((w) => SYNONYM_MAP[w]);
  const rest = pool.filter((w) => !SYNONYM_MAP[w]);
  const ordered = [...mapped, ...rest.slice(-3)];
  return [...new Set(ordered)].slice(0, 3);
}

/** Simplify a query to core terms only (Pexels retry step). */
function simplifyQuery(query) {
  const core = extractCoreTerms(query);
  return core.join(' ') || String(query || '').trim();
}

/** Accept set for a core term = the term itself + its mapped synonyms. */
function acceptTermsFor(coreTerms) {
  const acc = new Set();
  for (const t of coreTerms) {
    acc.add(t);
    for (const s of SYNONYM_MAP[t] || []) acc.add(s);
  }
  return acc;
}

/** Does a candidate's descriptive text contain any accepted term? (case-insensitive substring on word-ish match) */
function textMatchesCore(text, acceptSet) {
  const hay = ' ' + String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ';
  for (const term of acceptSet) if (hay.includes(' ' + term + ' ') || hay.includes(term)) return true;
  return false;
}

/**
 * RELEVANCE GATE for Pexels. Requires total_results >= 3 AND a candidate whose alt text matches a core term.
 * @returns {{pass:boolean, photo?:object}} the first passing photo (caller still applies quality rules).
 */
function gatePexels(coreTerms, totalResults, photos) {
  if (!(totalResults >= 3)) return { pass: false, reason: 'thin_results:' + totalResults };
  const accept = acceptTermsFor(coreTerms);
  const passers = (photos || []).filter((p) => p && textMatchesCore(p.alt, accept));
  return passers.length ? { pass: true, passers } : { pass: false, reason: 'no_alt_match' };
}

/** RELEVANCE GATE for Pixabay — same idea, using the `tags` field. */
function gatePixabay(coreTerms, totalHits, hits) {
  if (!(totalHits >= 3)) return { pass: false, reason: 'thin_results:' + totalHits };
  const accept = acceptTermsFor(coreTerms);
  const passers = (hits || []).filter((h) => h && textMatchesCore(h.tags, accept));
  return passers.length ? { pass: true, passers } : { pass: false, reason: 'no_tag_match' };
}

/** Quality rule: width ≥ 1200, landscape, highest resolution among passers. */
function bestByQuality(passers, widthOf, heightOf) {
  const ok = (passers || []).filter((p) => widthOf(p) >= 1200 && widthOf(p) >= heightOf(p));
  const pool = ok.length ? ok : (passers || []);
  pool.sort((a, b) => (widthOf(b) * heightOf(b)) - (widthOf(a) * heightOf(a)));
  return pool[0] || null;
}

module.exports = {
  SYNONYM_MAP, MODIFIERS,
  extractCoreTerms, simplifyQuery, acceptTermsFor, textMatchesCore,
  gatePexels, gatePixabay, bestByQuality,
};
