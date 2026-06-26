// Pulse Collectibles — semantic search + FAQ compete keywords for co#### entries.
// Applied via _co_seo_optimize.js + collectibles.html hub sync.

const CO_KEYWORD_PHRASES = require('./_co_keyword_phrases.json');

const CO_HUB_URL = 'https://pulserevops.com/collectibles';
const CO_HUB_PAGE = 'collectibles.html';
const CO_STATIC_URLS = [CO_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const topic = String(phrase).replace(/^Top 10 /i, '').trim();
  const q = `What are the top 10 ${topic.toLowerCase()}?`;
  const a = `Pulse Collectibles ranks the ${phrase} with Best Overall and Best Value picks, grading notes, price comps, and a buyer decision tree for collectors in 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = CO_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Collectibles FAQ',
  'Pulse Collectibles FAQ structured data',
  'Pulse Collectibles semantic search optimization',
  'Pulse Collectibles Top-10 Rankings',
  'Best Overall vs Best Value collectibles',
  'collectibles buyer guide 2027',
  'collectibles review 2027',
  'collectibles reviews',
  'collectibles comparison',
  'best collectibles rankings',
  'trading card collecting guide',
  'sports memorabilia rankings',
  ...CO_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-collectibles',
  'collectible',
  'collectibles',
  'trading-cards',
  'memorabilia',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'collectibles-buying-faq',
  'best-overall-best-value',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of CO_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^top 10 /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...CO_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = CO_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...CO_KEYWORD_PHRASES.map(slugify)]));
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
  if (/baseball|mlb|topps|bowman/i.test(t)) hits.push('What are the top 10 vintage baseball cards to collect?');
  if (/basketball|nba|panini prizm/i.test(t)) hits.push('What are the top 10 basketball cards for collectors?');
  if (/football|nfl|panini/i.test(t)) hits.push('What are the top 10 football cards to collect 2027?');
  if (/hockey|nhl/i.test(t)) hits.push('What are the top 10 hockey cards for collectors?');
  if (/pokemon|pokémon|tcg|charizard/i.test(t)) hits.push('What are the top 10 pokemon cards every collector needs?');
  if (/magic|mtg|gathering/i.test(t)) hits.push('What are the top 10 magic the gathering cards to collect?');
  if (/comic|cgc|marvel|dc/i.test(t)) hits.push('What are the top 10 vintage comic books to collect?');
  if (/coin|morgan|pcgs|ngc|silver dollar/i.test(t)) hits.push('What are the top 10 rare coins for collectors 2027?');
  if (/watch|rolex|omega|chrono/i.test(t)) hits.push('What are the top 10 luxury watches to collect?');
  if (/sneaker|jordan|yeezy|stockx/i.test(t)) hits.push('What are the top 10 limited edition sneakers to collect?');
  if (/vinyl|record|beatles|discogs/i.test(t)) hits.push('What are the top 10 vinyl records for collectors?');
  if (/memorabilia|autograph|jersey|signed/i.test(t)) hits.push('What are the top 10 sports memorabilia items to collect?');
  if (/lego|bricklink/i.test(t)) hits.push('What are the top 10 lego sets for collectors?');
  if (/funko/i.test(t)) hits.push('What are the top 10 funko pops worth collecting?');
  if (/video game|nintendo|retro|sealed/i.test(t)) hits.push('What are the top 10 vintage video games to collect?');
  if (/star wars|action figure/i.test(t)) hits.push('What are the top 10 star wars action figures to collect?');
  if (/stamp|philatel/i.test(t)) hits.push('What are the top 10 stamps for philatelists 2027?');
  if (/psa|grading|slab/i.test(t)) hits.push('What is the psa grading cost vs value calculator?');
  if (/sell|auction|heritage|goldin|ebay/i.test(t)) hits.push('How to sell collectibles online?');
  if (/invest|roi|appreciation/i.test(t)) hits.push('What are the best collectibles to invest in 2027?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${CO_HUB_URL}#faq`,
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
    name: 'Pulse Collectibles Top-10 Search Index',
    description:
      'Semantic FAQ and Top-10 collectibles keyword index for trading cards, coins, comics, watches, sneakers, vinyl, and memorabilia.',
    numberOfItems: CO_KEYWORD_PHRASES.length,
    itemListElement: CO_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Collectibles review',
      'Pulse Collectibles reviews',
      'Pulse Collectibles rating',
      'Pulse Collectibles comparison',
      'Pulse Collectibles rankings',
    ])
  );
}

module.exports = {
  CO_HUB_URL,
  CO_HUB_PAGE,
  CO_STATIC_URLS,
  CO_KEYWORD_PHRASES,
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
