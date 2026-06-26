// Pulse Estates — semantic search + FAQ compete keywords for es#### entries.
// Applied via _es_seo_optimize.js + estates.html hub sync.

const ES_KEYWORD_PHRASES = require('./_es_keyword_phrases.json');

const ES_HUB_URL = 'https://pulserevops.com/estates';
const ES_HUB_PAGE = 'estates.html';
const ES_STATIC_URLS = [ES_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  const q = /\?$/.test(p) ? p : `${p}?`;
  const name = q.replace(/\?+$/, '');
  const a = `Pulse Estates ranks ${name.toLowerCase()} with Best Overall and Best Value picks, real price ranges, HOA notes, and a buyer decision tree for luxury real-estate shoppers in 2027.`;
  return { q: name.endsWith('?') ? name : `${name}?`, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = ES_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Luxury Estate FAQ',
  'Pulse Estates FAQ structured data',
  'Pulse Estates semantic search optimization',
  'Pulse Estates Top-10 Rankings',
  'Best Overall vs Best Value luxury estate',
  'luxury real estate buyer guide 2027',
  'gated community rankings 2027',
  'waterfront estate market guide',
  'luxury home builder rankings',
  ...ES_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-estates',
  'estates',
  'luxury-estate',
  'luxury-real-estate',
  'gated-community',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'luxury-estate-buying-faq',
  'best-overall-best-value',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of ES_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^how to /i, '').replace(/^what is /i, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3 && !/^\[.+\]$/.test(w));
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...ES_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = ES_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...ES_KEYWORD_PHRASES.map(slugify)]));
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
  if (/gated|master-planned|planned community/i.test(t)) hits.push('What is the best gated community to buy in [State]');
  if (/waterfront|beach|lake|coastal/i.test(t)) hits.push('Waterfront vs golf course community lifestyle choice');
  if (/golf/i.test(t)) hits.push('Golf communities in [State] rankings');
  if (/builder|custom home/i.test(t)) hits.push('How to vet luxury home builder reputation');
  if (/retire|55-plus|active adult/i.test(t)) hits.push('Active adult vs all-ages luxury community fit');
  if (/vacation|second home/i.test(t)) hits.push('Beach house vs mountain cabin second home decision');
  if (/invest|appreciation|market/i.test(t)) hits.push('Is now a good time to buy luxury real estate 2027');
  if (/ranch|equestrian|horse/i.test(t)) hits.push('Acreage minimum for equestrian estate [Region]');
  if (/condo|high-rise|tower/i.test(t)) hits.push('Should I buy luxury condo or single-family estate');
  if (/ranked|top 10|best overall/i.test(t)) hits.push('Best Overall vs Best Value luxury estate picks');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${ES_HUB_URL}#faq`,
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
    name: 'Pulse Estates Luxury Real Estate Search Index',
    description:
      'Semantic FAQ and luxury estate keyword index for gated communities, waterfront markets, builders, and buyer guides.',
    numberOfItems: ES_KEYWORD_PHRASES.length,
    itemListElement: ES_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Estates review',
      'Pulse Estates reviews',
      'Pulse Estates rating',
      'Pulse Estates comparison',
      'Pulse Estates rankings',
    ])
  );
}

module.exports = {
  ES_HUB_URL,
  ES_HUB_PAGE,
  ES_STATIC_URLS,
  ES_KEYWORD_PHRASES,
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
