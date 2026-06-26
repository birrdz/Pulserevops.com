// Pulse Franchises — semantic search + FAQ compete keywords for fr#### entries.
// Applied via _fr_seo_optimize.js + franchises.html hub sync.

const FR_KEYWORD_PHRASES = require('./_fr_keyword_phrases.json');

const FR_HUB_URL = 'https://pulserevops.com/franchises';
const FR_HUB_PAGE = 'franchises.html';
const FR_STATIC_URLS = [FR_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  const q = /\?$/.test(p)
    ? p
    : /^how /i.test(p) || /^should /i.test(p) || /^what /i.test(p) || /^is /i.test(p)
      ? `${p.replace(/\?+$/, '')}?`
      : `What is the ${p.toLowerCase()}?`;
  const a = `Pulse Franchises answers ${q.replace(/\?+$/, '').toLowerCase()} with real FDD numbers, startup costs, unit economics, customer acquisition math, and an operator decision tree for 2027.`;
  return { q: q.replace(/\?+$/, '') + (q.endsWith('?') ? '' : '?'), a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = FR_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Franchise FAQ',
  'Pulse Franchises FAQ structured data',
  'Pulse Franchises semantic search optimization',
  'Pulse Franchises business evaluation',
  'franchise unit economics 2027',
  'franchise FDD review guide',
  'should I open a franchise 2027',
  'best franchises to open or buy',
  'franchise ROI calculator',
  'franchise leaderboard rankings',
  ...FR_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-franchises',
  'franchise',
  'franchises',
  'business-ideas',
  'franchise-investment',
  'franchise-unit-economics',
  'fdd-review',
  'startup-costs',
  'semantic-search-faq',
  'franchise-faq',
  'open-or-buy-2027',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of FR_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/\[[^\]]+\]/g, '').replace(/\?+$/, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 28))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...FR_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = FR_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...FR_KEYWORD_PHRASES.map(slugify)]));
}

function hubDisplayKeywords() {
  return Array.from(
    new Set(COMPETE_DISPLAY_KEYWORDS.map((s) => String(s).trim()).filter(Boolean))
  );
}

function hubMetaKeywords(max = 48) {
  return hubDisplayKeywords().slice(0, max);
}

function semanticFaqForTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const row of SEMANTIC_FAQ_HUB_SCHEMA) {
    const q = row.q.toLowerCase();
    const tokens = q.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 3) hits.push(row.q.replace(/\?+$/, ''));
  }
  if (/should i open|should i buy|open or buy/i.test(t)) hits.push('Should I open a franchise in 2027');
  if (/franchise/i.test(t) && /cost|invest|capital|startup/i.test(t)) hits.push('Franchise initial investment breakdown');
  if (/franchise/i.test(t) && /roi|profit|margin|economics/i.test(t)) hits.push('Franchise unit economics guide');
  if (/franchise/i.test(t) && /fdd|disclosure/i.test(t)) hits.push('Franchise FDD review checklist');
  if (/cleaning|janitorial/i.test(t)) hits.push('Cleaning service franchise guide');
  if (/coffee|cafe|juice|food|restaurant|pizza|burger|ice cream/i.test(t)) hits.push('Best food franchise opportunities 2027');
  if (/gym|fitness|yoga|pilates/i.test(t)) hits.push('Fitness gym franchise opportunities');
  if (/pet|dog|grooming|daycare/i.test(t)) hits.push('Pet grooming franchise opportunities');
  if (/senior|elder|home care/i.test(t)) hits.push('Senior care franchise opportunities');
  if (/child|daycare|tutor/i.test(t)) hits.push('Childcare daycare franchise guide');
  if (/hvac|plumb|lawn|pest|home service/i.test(t)) hits.push('Home services franchise opportunities');
  if (/auto|car wash|oil change/i.test(t)) hits.push('Auto repair franchise guide');
  if (/sba|loan|financ/i.test(t)) hits.push('SBA loan for franchise financing');
  if (/independent|vs\b/i.test(t)) hits.push('Franchise vs independent business');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${FR_HUB_URL}#faq`,
    mainEntity: SEMANTIC_FAQ_HUB_SCHEMA.map((row) => ({
      '@type': 'Question',
      name: row.q,
      acceptedAnswer: { '@type': 'Answer', text: row.a },
    })),
  };
}

function hubKeywordItemListJsonLd(hubUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${hubUrl}#keyword-index`,
    name: 'Pulse Franchises Business Evaluation Search Index',
    description:
      'Semantic FAQ and franchise keyword index for investment analysis, FDD review, unit economics, and open-or-buy decision trees.',
    numberOfItems: FR_KEYWORD_PHRASES.length,
    itemListElement: FR_KEYWORD_PHRASES.map((phrase, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: phrase,
      url: `${hubUrl}#${slugify(phrase)}`,
    })),
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'Pulse Franchises review',
      'Pulse Franchises reviews',
      'Pulse Franchises rating',
      'Pulse Franchises comparison',
      'Pulse Franchises business evaluation',
      'franchise review 2027',
    ])
  );
}

module.exports = {
  FR_HUB_URL,
  FR_HUB_PAGE,
  FR_STATIC_URLS,
  FR_KEYWORD_PHRASES,
  COMPETE_DISPLAY_KEYWORDS,
  SEMANTIC_FAQ_HUB_SCHEMA,
  GLOBAL_TAGS,
  tagsForEntry,
  allKeywordsFlat,
  hubDisplayKeywords,
  hubMetaKeywords,
  semanticFaqForTitle,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  entrySeoBrandKeywords,
};
