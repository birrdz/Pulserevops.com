// Pulse Sales Book Summaries — semantic search + FAQ compete keywords for bs#### entries.
// Applied via _bs_seo_optimize.js + sales-book-summaries.html hub sync.

const BS_KEYWORD_PHRASES = require('./_bs_keyword_phrases.json');

const BS_HUB_URL = 'https://pulserevops.com/sales-book-summaries';
const BS_HUB_PAGE = 'sales-book-summaries.html';
const BS_STATIC_URLS = [BS_HUB_URL];

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
    .replace(/^Top /i, '')
    .replace(/^How to /i, '')
    .trim();
  const q = `What is the ${phrase.toLowerCase()}?`;
  const a = `Pulse Books delivers ${phrase} with chapter-by-chapter cliff notes, key frameworks, action items, and CRM-ready takeaways for B2B sales and RevOps teams in 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = BS_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Sales Book Summary FAQ',
  'Pulse Books FAQ structured data',
  'Pulse Books semantic search optimization',
  'Pulse Sales Book Summaries',
  'Pulse RevOps book cliff notes',
  'chapter-by-chapter sales book summary',
  'sales book cliff notes 2027',
  'sales book summary vs Blinkist',
  'sales methodology book summaries',
  ...BS_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-books',
  'book-summary',
  'sales-book-summary',
  'cliff-notes',
  'sales-book',
  'sales-leadership',
  'semantic-search-faq',
  'sales-book-buying-faq',
  'chapter-by-chapter-summary',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of BS_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase();
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...BS_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = BS_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...BS_KEYWORD_PHRASES.map(slugify)]));
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
  if (/challenger/i.test(t)) hits.push('What is the Challenger Sale book summary?');
  if (/spin/i.test(t)) hits.push('What is the SPIN Selling book summary?');
  if (/meddic|meddpicc/i.test(t)) hits.push('What is the MEDDIC sales book summary?');
  if (/gap selling|keenan/i.test(t)) hits.push('What is the Gap Selling book summary?');
  if (/predictable revenue|aaron ross/i.test(t)) hits.push('What is the Predictable Revenue book summary?');
  if (/never split|chris voss|negotiat/i.test(t)) hits.push('What is the Never Split the Difference summary?');
  if (/influence|cialdini/i.test(t)) hits.push('What is the Influence Cialdini sales summary?');
  if (/fanatical prospect|jeb blount/i.test(t)) hits.push('What is the Fanatical Prospecting summary?');
  if (/sandler/i.test(t)) hits.push('What is the Sandler Selling System summary?');
  if (/solution selling|bosworth/i.test(t)) hits.push('What is the Solution Selling book summary?');
  if (/command of the message|force management/i.test(t)) hits.push('What is the Command of the Message summary?');
  if (/spiced|vanderkooij/i.test(t)) hits.push('What is the SPICED sales methodology summary?');
  if (/acceleration formula|roberge/i.test(t)) hits.push('What is the Sales Acceleration Formula summary?');
  if (/psychology of selling|brian tracy/i.test(t)) hits.push('What is the Psychology of Selling summary?');
  if (/dale carnegie|win friends/i.test(t)) hits.push('What is the best sales psychology book summaries?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BS_HUB_URL}#faq`,
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
    name: 'Pulse Books Sales Summary Search Index',
    description:
      'Semantic FAQ and sales book summary keyword index for cliff notes, methodology frameworks, and chapter-by-chapter takeaways.',
    numberOfItems: BS_KEYWORD_PHRASES.length,
    itemListElement: BS_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Books review',
      'Pulse Books reviews',
      'Pulse Books cliff notes',
      'Pulse Sales Book Summaries',
      'Pulse RevOps book summary',
    ])
  );
}

module.exports = {
  BS_HUB_URL,
  BS_HUB_PAGE,
  BS_STATIC_URLS,
  BS_KEYWORD_PHRASES,
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
