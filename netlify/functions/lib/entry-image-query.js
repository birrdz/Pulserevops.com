// entry-image-query.js — derive Pexels/library search queries from entry title + section heading.
// Clone-family entries share the same topic key (location stripped) → one cache bucket per topic.

const { deriveImageSearchQuery, queryCacheKey } = require('./derive-image-search-query');

/** Cache bucket for clone-family image reuse (same topic, different geo). */
function entryTopicKey(title) {
  return queryCacheKey(title);
}

/** 2–4 noun query from entry title/question. */
function entryTopicQuery(title) {
  return deriveImageSearchQuery(title);
}

function tokenSet(s) {
  return new Set(String(s || '').toLowerCase().split(/\s+/).filter(Boolean));
}

/**
 * Section slot search: topic key nouns + section heading nouns (capped at ~6 words).
 * Library / DDG / Pexels paths use this so images match the entry topic, not raw title noise.
 */
function sectionImageSearchQuery(title, sectionHeading) {
  const base = entryTopicQuery(title);
  const sect = deriveImageSearchQuery(sectionHeading || '');
  if (!sect || sect === base) return base;
  const merged = [];
  const seen = new Set();
  for (const w of (base + ' ' + sect).split(/\s+/)) {
    const t = w.trim().toLowerCase();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    merged.push(t);
    if (merged.length >= 6) break;
  }
  return merged.join(' ');
}

/** Score boost helper: registry poolQuery matches entry topic key. */
function topicKeyMatchesPoolQuery(title, poolQuery) {
  if (!poolQuery) return false;
  const key = entryTopicKey(title);
  const pq = String(poolQuery).toLowerCase().trim();
  return pq === key || pq.includes(key) || key.includes(pq);
}

module.exports = {
  entryTopicKey,
  entryTopicQuery,
  sectionImageSearchQuery,
  topicKeyMatchesPoolQuery,
  deriveImageSearchQuery,
  queryCacheKey,
};
