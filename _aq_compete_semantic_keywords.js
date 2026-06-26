// Pulse Aquariums — semantic search + FAQ compete keywords for aq#### entries.
// Applied via _aq_seo_optimize.js + aquariums.html hub sync.

const AQ_KEYWORD_PHRASES = require('./_aq_keyword_phrases.json');

const AQ_HUB_URL = 'https://pulserevops.com/aquariums';
const AQ_HUB_PAGE = 'aquariums.html';
const AQ_STATIC_URLS = [AQ_HUB_URL];

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
  const a = `Pulse Aquariums ranks the ${phrase} with Best Overall and Best Value picks, specs, care notes, and a buyer decision tree for 2027 fishkeepers.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = AQ_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Aquarium FAQ',
  'Pulse Aquariums FAQ structured data',
  'Pulse Aquariums semantic search optimization',
  'Pulse Aquariums Top-10 Rankings',
  'Best Overall vs Best Value aquarium gear',
  'fishkeeping buyer guide 2027',
  'aquarium review 2027',
  'aquarium reviews',
  'aquarium comparison',
  'best aquarium rankings',
  ...AQ_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-aquariums',
  'aquarium',
  'aquariums',
  'fishkeeping',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'aquarium-buying-faq',
  'best-overall-best-value',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of AQ_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^top 10 /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...AQ_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = AQ_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...AQ_KEYWORD_PHRASES.map(slugify)]));
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
  if (/filter|canister|hob|hang-on/i.test(t)) hits.push('What are the top 10 freshwater aquarium filters?');
  if (/heater/i.test(t)) hits.push('What are the top 10 aquarium heater brands?');
  if (/plant|planted|carpet/i.test(t)) hits.push('What are the top 10 low light aquarium plants?');
  if (/fish|betta|tetra|cichlid|goldfish|shrimp|snail/i.test(t)) hits.push('What are the top 10 aquarium fish for beginners?');
  if (/tank|gallon|nano|rimless|acrylic/i.test(t)) hits.push('What are the top 10 aquarium tanks under 20 gallons?');
  if (/light|led|lighting/i.test(t)) hits.push('What are the top 10 aquarium lighting systems?');
  if (/salt|reef|marine|clown/i.test(t)) hits.push('What are the top 10 saltwater starter fish?');
  if (/test kit|water test/i.test(t)) hits.push('What are the top 10 aquarium water test kits?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${AQ_HUB_URL}#faq`,
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
    name: 'Pulse Aquariums Top-10 Search Index',
    description: 'Semantic FAQ and Top-10 aquarium keyword index for fishkeeping gear, species, plants, and maintenance.',
    numberOfItems: AQ_KEYWORD_PHRASES.length,
    itemListElement: AQ_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Aquariums review',
      'Pulse Aquariums reviews',
      'Pulse Aquariums rating',
      'Pulse Aquariums comparison',
      'Pulse Aquariums rankings',
    ])
  );
}

module.exports = {
  AQ_HUB_URL,
  AQ_HUB_PAGE,
  AQ_STATIC_URLS,
  AQ_KEYWORD_PHRASES,
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
