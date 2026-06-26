// Pulse Boats — semantic search + FAQ compete keywords for bt#### entries.
// Applied via _bt_seo_optimize.js + boats.html hub sync.

const BT_KEYWORD_PHRASES = require('./_bt_keyword_phrases.json');

const BT_HUB_URL = 'https://pulserevops.com/boats';
const BT_HUB_PAGE = 'boats.html';
const BT_STATIC_URLS = [BT_HUB_URL];

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
    .replace(/^The /i, '')
    .trim();
  const q = /^top 10/i.test(phrase)
    ? `What are the ${phrase.toLowerCase()}?`
    : `What are the ${topic.toLowerCase()}?`;
  const a = `Pulse Boats ranks the ${phrase} with Best Overall and Best Value picks, real prices, specs, and a buyer decision tree for 2027 boat shoppers.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = BT_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Boat FAQ',
  'Pulse Boats FAQ structured data',
  'Pulse Boats semantic search optimization',
  'Pulse Boats Top-10 Rankings',
  'Best Overall vs Best Value boats',
  'boat buyer guide 2027',
  'boat review 2027',
  'boat reviews',
  'boat comparison',
  'best boat rankings',
  'marine boat rankings 2027',
  ...BT_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-boats',
  'boat',
  'boats',
  'marine',
  'boating',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'boat-buying-faq',
  'best-overall-best-value',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of BT_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^top 10 /, '').replace(/^best /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...BT_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = BT_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...BT_KEYWORD_PHRASES.map(slugify)]));
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
  if (/pontoon|tritoon/i.test(t)) hits.push('What are the top 10 pontoon boats 2027?');
  if (/bowrider|runabout/i.test(t)) hits.push('What are the top 10 bowrider boats 2027?');
  if (/center console|dual console/i.test(t)) hits.push('What are the top 10 center console boats 2027?');
  if (/fishing|bass|offshore|bay boat/i.test(t)) hits.push('What are the top 10 fishing boats ranked 2027?');
  if (/wake|ski|watersport/i.test(t)) hits.push('What are the best boats for watersports and tubing?');
  if (/cabin|cruiser|yacht/i.test(t)) hits.push('What are the top 10 cabin cruiser boats 2027?');
  if (/jet boat|pwc|jet ski/i.test(t)) hits.push('What are the top 10 jet boats 2027?');
  if (/used|under \$|budget|affordable/i.test(t)) hits.push('What are the best used boats under $20,000 in 2027?');
  if (/beginner|first-time|family/i.test(t)) hits.push('What are the best boats for beginners 2027?');
  if (/saltwater|offshore|coastal/i.test(t)) hits.push('What are the best boats for offshore fishing?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BT_HUB_URL}#faq`,
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
    name: 'Pulse Boats Top-10 Search Index',
    description:
      'Semantic FAQ and Top-10 boat keyword index for buying, recreational use, maintenance, and marine comparisons.',
    numberOfItems: BT_KEYWORD_PHRASES.length,
    itemListElement: BT_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Boats review',
      'Pulse Boats reviews',
      'Pulse Boats rating',
      'Pulse Boats comparison',
      'Pulse Boats rankings',
    ])
  );
}

module.exports = {
  BT_HUB_URL,
  BT_HUB_PAGE,
  BT_STATIC_URLS,
  BT_KEYWORD_PHRASES,
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
