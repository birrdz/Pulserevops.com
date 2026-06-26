// Pulse Dining — semantic search + FAQ compete keywords for dn#### entries.
// Applied via _dn_seo_optimize.js + dining.html hub sync.

const DN_KEYWORD_PHRASES = require('./_dn_keyword_phrases.json');

const DN_HUB_URL = 'https://pulserevops.com/dining';
const DN_HUB_PAGE = 'dining.html';
const DN_STATIC_URLS = [DN_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const topic = String(phrase)
    .replace(/^Best /i, '')
    .replace(/^Top 10 /i, '')
    .replace(/^How to /i, '')
    .trim();
  const q = /^how/i.test(phrase)
    ? `${phrase.replace(/\?+$/, '')}?`
    : `What are the best ${topic.toLowerCase()}?`;
  const a = `Pulse Dining ranks the ${phrase} with Best Overall and Best Value picks, menus, price ranges, reservation tips, and local insider notes for 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = DN_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Dining FAQ',
  'Pulse Dining FAQ structured data',
  'Pulse Dining semantic search optimization',
  'Pulse Dining Top-10 Rankings',
  'Best Overall vs Best Value restaurants',
  'restaurant buyer guide 2027',
  'restaurant review 2027',
  'restaurant reviews',
  'restaurant comparison',
  'best restaurant rankings',
  'local dining guide',
  'where to eat near me',
  'best restaurants ranked',
  ...DN_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-dining',
  'dining',
  'restaurant',
  'restaurants',
  'local-food',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'restaurant-dining-faq',
  'best-overall-best-value',
  'food-and-drink',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of DN_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^best /, '').replace(/^top 10 /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...DN_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = DN_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...DN_KEYWORD_PHRASES.map(slugify)]));
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
  if (/brunch|breakfast/i.test(t)) hits.push('What are the best brunch in Baltimore?');
  if (/sushi|japanese|ramen|omakase/i.test(t)) hits.push('What are the best authentic Japanese restaurants in Baltimore?');
  if (/seafood|crab|oyster|lobster|fish/i.test(t)) hits.push('What are the best seafood restaurants in Chesapeake Bay?');
  if (/pizza|italian|pasta/i.test(t)) hits.push('What are the best authentic Italian restaurants in Baltimore?');
  if (/steak|fine dining|upscale|luxury/i.test(t)) hits.push('What are the best fine dining in Washington DC?');
  if (/mexican|taco|latin/i.test(t)) hits.push('What are the best authentic Mexican restaurants in Washington DC?');
  if (/vegan|vegetarian|plant|gluten/i.test(t)) hits.push('What are the vegan-friendly restaurants in Baltimore?');
  if (/date|romantic|anniversary/i.test(t)) hits.push('What are the romantic date night restaurants in Annapolis?');
  if (/family|kid|children/i.test(t)) hits.push('What are the family-friendly restaurants with playgrounds in Baltimore?');
  if (/bbq|barbecue|southern/i.test(t)) hits.push('What are the best BBQ restaurants in Maryland?');
  if (/rooftop|waterfront|patio|outdoor/i.test(t)) hits.push('What are the restaurants with rooftop dining in Washington DC?');
  if (/late night|24 hour|midnight/i.test(t)) hits.push('What are the best late night food in Baltimore?');
  if (/ranked|top 10|best overall/i.test(t)) hits.push('What is the difference between Best Overall and Best Value on Pulse Dining?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${DN_HUB_URL}#faq`,
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
    name: 'Pulse Dining Restaurant Search Index',
    description:
      'Semantic FAQ and Top-10 restaurant keyword index for local dining, cuisines, occasions, and reservation how-to guides.',
    numberOfItems: DN_KEYWORD_PHRASES.length,
    itemListElement: DN_KEYWORD_PHRASES.map((phrase, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: phrase,
      url: `${hubUrl}#${slugify(phrase)}`,
    })),
  };
}

function hubLocalBusinessNotesJsonLd(hubUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${hubUrl}#dining-index`,
    name: 'Pulse Dining — Restaurant Rankings Index',
    description:
      'Curated Top-10 restaurant rankings and local dining guides with Best Overall + Best Value picks across US cities and neighborhoods.',
    url: hubUrl,
    areaServed: [
      { '@type': 'State', name: 'Maryland' },
      { '@type': 'City', name: 'Baltimore' },
      { '@type': 'City', name: 'Annapolis' },
      { '@type': 'City', name: 'Washington DC' },
      { '@type': 'Country', name: 'United States' },
    ],
    knowsAbout: [
      'restaurant rankings',
      'local dining guides',
      'reservation tips',
      'Best Overall restaurants',
      'Best Value restaurants',
    ],
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'Pulse Dining review',
      'Pulse Dining reviews',
      'Pulse Dining rating',
      'Pulse Dining comparison',
      'Pulse Dining rankings',
    ])
  );
}

module.exports = {
  DN_HUB_URL,
  DN_HUB_PAGE,
  DN_STATIC_URLS,
  DN_KEYWORD_PHRASES,
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
  hubLocalBusinessNotesJsonLd,
  entrySeoBrandKeywords,
};
