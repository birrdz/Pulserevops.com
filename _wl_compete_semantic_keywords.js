// Pulse Wellness — semantic search + FAQ compete keywords for wl#### entries.
const WL_KEYWORD_PHRASES = require('./_wl_keyword_phrases.json');

const WL_HUB_URL = 'https://pulserevops.com/wellness';
const WL_HUB_PAGE = 'wellness.html';
const WL_STATIC_URLS = [WL_HUB_URL];

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);
}

function phraseToFaq(phrase) {
  const topic = String(phrase).replace(/^Best /i, '').replace(/^Top 10 /i, '').trim();
  const q = /^how/i.test(phrase) ? `${phrase.replace(/\?+$/, '')}?` : `What are the best ${topic.toLowerCase()}?`;
  const a = `Pulse Wellness ranks ${phrase} with Best Overall and Best Value picks and a buyer decision tree for 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = WL_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Pulse Wellness FAQ',
  'Pulse Wellness FAQ structured data',
  'Pulse Wellness semantic search optimization',
  'Pulse Wellness Top-10 Rankings',
  'Best Overall vs Best Value',
  'top-10 rankings 2027',
  ...WL_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = ["pulse-wellness","wellness","health","top-10","best-of-2027"];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of WL_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^top 10 /, '').replace(/^best /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) hits.push(...WL_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = WL_KEYWORD_PHRASES.map(slugify);
  return Array.from(new Set([...base, ...titleHits, ...allSlugs].map(slugify).filter(Boolean)));
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
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${WL_HUB_URL}#faq`,
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
    name: 'Pulse Wellness Search Index',
    numberOfItems: WL_KEYWORD_PHRASES.length,
    itemListElement: WL_KEYWORD_PHRASES.map((phrase, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: phrase,
      url: `${hubUrl}#${slugify(phrase)}`,
    })),
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(new Set([
    ...COMPETE_DISPLAY_KEYWORDS,
    ...semanticFaqForTitle(question),
    'Pulse Wellness review',
    'Pulse Wellness reviews',
    'Pulse Wellness rankings',
  ]));
}

module.exports = {
  WL_HUB_URL,
  WL_HUB_PAGE,
  WL_STATIC_URLS,
  WL_KEYWORD_PHRASES,
  COMPETE_DISPLAY_KEYWORDS,
  SEMANTIC_FAQ_HUB_SCHEMA,
  GLOBAL_TAGS,
  tagsForEntry,
  hubDisplayKeywords,
  hubMetaKeywords,
  semanticFaqForTitle,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  entrySeoBrandKeywords,
};
