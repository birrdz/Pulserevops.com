// Pulse Nightlife — semantic search + FAQ compete keywords for nl#### entries.
const NL_KEYWORD_PHRASES = require('./_nl_keyword_phrases.json');

const NL_HUB_URL = 'https://pulserevops.com/nightlife';
const NL_HUB_PAGE = 'nightlife.html';
const NL_STATIC_URLS = [NL_HUB_URL];

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
    .trim();
  const q = /^how/i.test(phrase)
    ? `${phrase.replace(/\?+$/, '')}?`
    : `What are the best ${topic.toLowerCase()}?`;
  const a = `Pulse Nightlife ranks ${phrase} with Best Overall and Best Value picks, cover charges, dress codes, reservation tips, and a buyer decision tree for 2027 nights out.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = NL_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Nightlife FAQ',
  'Pulse Nightlife FAQ structured data',
  'Pulse Nightlife semantic search optimization',
  'Pulse Nightlife Top-10 Rankings',
  'Best Overall vs Best Value nightlife',
  'nightlife buyer guide 2027',
  'nightlife review 2027',
  'nightlife reviews',
  'nightlife comparison',
  'best bars and clubs rankings',
  'where to go out tonight',
  'best nightlife near me',
  ...NL_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-nightlife',
  'nightlife',
  'bars',
  'clubs',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'nightlife-going-out-faq',
  'best-overall-best-value',
  'going-out',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of NL_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^top 10 /, '').replace(/^best /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) hits.push(...NL_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = NL_KEYWORD_PHRASES.map(slugify);
  return Array.from(new Set([...base, ...titleHits, ...allSlugs].map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...NL_KEYWORD_PHRASES.map(slugify)]));
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
  if (/rooftop|skyline|view/i.test(t)) hits.push('What are the best rooftop bars with views?');
  if (/speakeasy|hidden|password/i.test(t)) hits.push('What are the best speakeasies in America?');
  if (/nightclub|club|dj|dance/i.test(t)) hits.push('What are the best nightclubs in America?');
  if (/jazz|live music|blues/i.test(t)) hits.push('What are the best jazz clubs for live music?');
  if (/cocktail|mixology|craft/i.test(t)) hits.push('What are the best cocktail bars for craft drinks?');
  if (/date|romantic|couple/i.test(t)) hits.push('What are the best nightlife spots for date night?');
  if (/vegas|las vegas/i.test(t)) hits.push('What is the best nightlife in Las Vegas?');
  if (/miami|south beach/i.test(t)) hits.push('What is the best nightlife in Miami?');
  if (/cover|no cover|free entry/i.test(t)) hits.push('What nightlife spots have no cover charge?');
  if (/ranked|top 10|best overall/i.test(t)) hits.push('What is the difference between Best Overall and Best Value on Pulse Nightlife?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${NL_HUB_URL}#faq`,
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
    name: 'Pulse Nightlife Search Index',
    description: 'Semantic FAQ and Top-10 nightlife keyword index for bars, clubs, and going-out guides.',
    numberOfItems: NL_KEYWORD_PHRASES.length,
    itemListElement: NL_KEYWORD_PHRASES.map((phrase, i) => ({
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
    '@id': `${hubUrl}#nightlife-index`,
    name: 'Pulse Nightlife — Bars and Clubs Rankings Index',
    description: 'Curated Top-10 nightlife rankings with Best Overall + Best Value picks across US and global cities.',
    url: hubUrl,
    areaServed: { '@type': 'Country', name: 'United States' },
    knowsAbout: ['nightlife', 'bars', 'clubs', 'rooftop bars', 'speakeasies', 'Best Overall nightlife'],
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'Pulse Nightlife review',
      'Pulse Nightlife reviews',
      'Pulse Nightlife rating',
      'Pulse Nightlife comparison',
      'Pulse Nightlife rankings',
    ])
  );
}

module.exports = {
  NL_HUB_URL,
  NL_HUB_PAGE,
  NL_STATIC_URLS,
  NL_KEYWORD_PHRASES,
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
