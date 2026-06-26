// Pulse Resorts — semantic search + FAQ compete keywords for rs#### entries.
const RS_KEYWORD_PHRASES = require('./_rs_keyword_phrases.json');

const RS_HUB_URL = 'https://pulserevops.com/resorts';
const RS_HUB_PAGE = 'resorts.html';
const RS_STATIC_URLS = [RS_HUB_URL];

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
    .replace(/^Where to stay in /i, '')
    .trim();
  const q = /^where/i.test(phrase)
    ? `${phrase.replace(/\?+$/, '')}?`
    : /^top 10/i.test(phrase)
      ? `What are the ${phrase.toLowerCase()}?`
      : `What are the best ${topic.toLowerCase()}?`;
  const a = `Pulse Resorts ranks the ${phrase} with Best Overall and Best Value picks, nightly rates, amenities, and booking tips for 2027 travelers.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = RS_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Resort FAQ',
  'Pulse Resorts FAQ structured data',
  'Pulse Resorts semantic search optimization',
  'Pulse Resorts Top-10 Rankings',
  'Best Overall vs Best Value resorts',
  'resort buyer guide 2027',
  'resort review 2027',
  'resort reviews',
  'resort comparison',
  'best resort rankings',
  'luxury resort guide',
  'all-inclusive resort rankings',
  ...RS_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-resorts',
  'resorts',
  'resort',
  'luxury-resort',
  'all-inclusive',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'resort-travel-faq',
  'best-overall-best-value',
  'travel-and-leisure',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of RS_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^best /, '').replace(/^top 10 /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) hits.push(...RS_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = RS_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...RS_KEYWORD_PHRASES.map(slugify)]));
}

function hubDisplayKeywords() {
  return Array.from(new Set(COMPETE_DISPLAY_KEYWORDS.map((s) => String(s).trim()).filter(Boolean)));
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
  if (/all-inclusive|all inclusive/i.test(t)) hits.push('What are the best all-inclusive resorts in Cancún?');
  if (/luxury|five-star|5-star|ultra/i.test(t)) hits.push('What are the best luxury beach resorts in Maldives?');
  if (/family|kid|children/i.test(t)) hits.push('What are the best family-friendly resorts in Hawaii?');
  if (/ski|snow|winter|mountain/i.test(t)) hits.push('What are the best ski resorts in Colorado?');
  if (/spa|wellness|retreat/i.test(t)) hits.push('What are the best spa resorts in Arizona?');
  if (/beach|tropical|island|ocean/i.test(t)) hits.push('What are the best beach resorts in Caribbean?');
  if (/honeymoon|couples|romantic|adults-only/i.test(t)) hits.push('What are the best honeymoon resorts in Bora Bora?');
  if (/golf/i.test(t)) hits.push('What are the best golf resorts in Scottsdale?');
  if (/overwater|bungalow/i.test(t)) hits.push('What are the best overwater bungalow resorts in Maldives?');
  if (/budget|affordable|cheap/i.test(t)) hits.push('What are the best budget all-inclusive resorts in Mexico?');
  if (/ranked|top 10|best overall/i.test(t)) hits.push('What is the difference between Best Overall and Best Value on Pulse Resorts?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${RS_HUB_URL}#faq`,
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
    name: 'Pulse Resorts Travel Search Index',
    description:
      'Semantic FAQ and Top-10 resort keyword index for all-inclusive, luxury, family, ski, beach, and spa destinations.',
    numberOfItems: RS_KEYWORD_PHRASES.length,
    itemListElement: RS_KEYWORD_PHRASES.map((phrase, i) => ({
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
    '@id': `${hubUrl}#resorts-index`,
    name: 'Pulse Resorts — Resort Rankings Index',
    description:
      'Curated Top-10 resort rankings with Best Overall + Best Value picks across beach, ski, spa, and all-inclusive destinations worldwide.',
    url: hubUrl,
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Mexico' },
      { '@type': 'Country', name: 'Caribbean' },
      { '@type': 'Country', name: 'Maldives' },
    ],
    knowsAbout: [
      'resort rankings',
      'all-inclusive resorts',
      'luxury beach resorts',
      'family resorts',
      'Best Overall resorts',
      'Best Value resorts',
    ],
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'Pulse Resorts review',
      'Pulse Resorts reviews',
      'Pulse Resorts rating',
      'Pulse Resorts comparison',
      'Pulse Resorts rankings',
    ])
  );
}

module.exports = {
  RS_HUB_URL,
  RS_HUB_PAGE,
  RS_STATIC_URLS,
  RS_KEYWORD_PHRASES,
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
