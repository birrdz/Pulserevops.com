// Pulse Clubs — semantic search + FAQ compete keywords for cl#### entries.
// Applied via _cl_seo_optimize.js + clubs.html hub sync.

const CL_KEYWORD_PHRASES = require('./_cl_keyword_phrases.json');

const CL_HUB_URL = 'https://pulserevops.com/clubs';
const CL_HUB_PAGE = 'clubs.html';
const CL_STATIC_URLS = [CL_HUB_URL];

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
    .replace(/^What is /i, '')
    .trim();
  const q = /^(what|how|why|do|are|difference)/i.test(phrase)
    ? `${phrase.replace(/\?+$/, '')}?`
    : `What are the best ${topic.toLowerCase()}?`;
  const a = `Pulse Clubs ranks ${phrase} with Best Overall and Best Value picks, real initiation fees, monthly dues, amenities, reciprocal access, and membership insider notes for 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = CL_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Clubs FAQ',
  'Pulse Clubs FAQ structured data',
  'Pulse Clubs semantic search optimization',
  'Pulse Clubs Top-10 Rankings',
  'Best Overall vs Best Value private clubs',
  'private club buyer guide 2027',
  'social club review 2027',
  'social club reviews',
  'private club comparison',
  'best social club rankings',
  'membership club guide',
  'private member clubs near me',
  'best social clubs ranked',
  ...CL_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-clubs',
  'clubs',
  'social-club',
  'private-club',
  'member-club',
  'country-club',
  'city-club',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'social-club-faq',
  'best-overall-best-value',
  'third-space',
  'membership-club',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of CL_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^best /, '').replace(/^top 10 /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...CL_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = CL_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...CL_KEYWORD_PHRASES.map(slugify)]));
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
  if (/golf|country/i.test(t)) hits.push('What are the best country clubs for networking?');
  if (/city club|downtown/i.test(t)) hits.push('What are the best private city clubs?');
  if (/yacht|marina|waterfront/i.test(t)) hits.push('What are the best yacht clubs with reciprocal access?');
  if (/wellness|spa|fitness/i.test(t)) hits.push('What are the wellness-integrated social clubs?');
  if (/network|professional|business/i.test(t)) hits.push('What are the best networking clubs for business?');
  if (/initiation|dues|fee|cost/i.test(t)) hits.push('What is the average cost of private club membership?');
  if (/family|kids|multi/i.test(t)) hits.push('What are the best social clubs for modern families?');
  if (/cowork|work|remote/i.test(t)) hits.push('What are social clubs with co-working spaces?');
  if (/dining|restaurant|chef/i.test(t)) hits.push('What are the best social clubs for dining?');
  if (/ranked|top 10|best overall/i.test(t)) hits.push('What is the difference between Best Overall and Best Value on Pulse Clubs?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${CL_HUB_URL}#faq`,
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
    name: 'Pulse Clubs Social Club Search Index',
    description:
      'Semantic FAQ and Top-10 private club keyword index for membership clubs, networking, amenities, and third-space lifestyle guides.',
    numberOfItems: CL_KEYWORD_PHRASES.length,
    itemListElement: CL_KEYWORD_PHRASES.map((phrase, i) => ({
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
    '@id': `${hubUrl}#clubs-index`,
    name: 'Pulse Clubs — Private Club Rankings Index',
    description:
      'Curated Top-10 private and social club rankings with Best Overall + Best Value picks, dues, amenities, and membership guides across US cities.',
    url: hubUrl,
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'AdministrativeArea', name: '[City]' },
    ],
    knowsAbout: [
      'private club rankings',
      'social club membership',
      'country club guides',
      'city club networking',
      'Best Overall private clubs',
      'Best Value membership clubs',
    ],
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'Pulse Clubs review',
      'Pulse Clubs reviews',
      'Pulse Clubs rating',
      'Pulse Clubs comparison',
      'Pulse Clubs rankings',
    ])
  );
}

module.exports = {
  CL_HUB_URL,
  CL_HUB_PAGE,
  CL_STATIC_URLS,
  CL_KEYWORD_PHRASES,
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
