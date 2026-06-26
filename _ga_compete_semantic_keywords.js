// Pulse Gatherings — semantic search + FAQ compete keywords for ga#### entries.
// Applied via _ga_seo_optimize.js + gatherings.html hub sync.

const GA_KEYWORD_PHRASES = require('./_ga_keyword_phrases.json');

const GA_HUB_URL = 'https://pulserevops.com/gatherings';
const GA_HUB_PAGE = 'gatherings.html';
const GA_STATIC_URLS = [GA_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  if (/^(how|why|are|what|when|where|can|should|is)\b/i.test(p)) {
    const q = p.replace(/\?+$/, '') + '?';
    return {
      q,
      a: `Pulse Gatherings covers ${p.replace(/\?+$/, '')} with Top-10 venue and caterer rankings, Best Overall + Best Value picks, hosting guides, and intentional community-building ideas for 2027.`,
    };
  }
  const q = `What are the best ${p.toLowerCase()}?`;
  return {
    q,
    a: `Pulse Gatherings ranks and guides ${p} with real venue details, hosting logistics, atmosphere tips, and curated Top-10 picks for weddings, parties, and community events in 2027.`,
  };
}

const SEMANTIC_FAQ_HUB_SCHEMA = GA_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Gatherings FAQ',
  'Pulse Gatherings FAQ structured data',
  'Pulse Gatherings semantic search optimization',
  'Pulse Gatherings Top-10 Rankings',
  'Best Overall vs Best Value gathering venues',
  'intentional hosting guide 2027',
  'gathering venue review 2027',
  'gathering venue reviews',
  'party venue comparison',
  'best wedding venue rankings',
  'community architecture hosting',
  'purpose-driven gathering ideas',
  ...GA_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-gatherings',
  'gathering',
  'gatherings',
  'hosting',
  'party-venue',
  'wedding-venue',
  'event-space',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'gathering-hosting-faq',
  'best-overall-best-value',
  'intentional-hosting',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of GA_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^best /, '').replace(/^top 10 /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...GA_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = GA_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...GA_KEYWORD_PHRASES.map(slugify)]));
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
  if (/wedding|bridal|ceremony|reception/i.test(t)) hits.push('What are the best wedding venue rankings?');
  if (/cater|food|menu|dining/i.test(t)) hits.push('What are the best catering options for gatherings?');
  if (/party|birthday|celebration/i.test(t)) hits.push('What are the best party venue rankings?');
  if (/corporate|networking|professional/i.test(t)) hits.push('What are purposeful networking gathering formats?');
  if (/intimate|small|salon|dinner/i.test(t)) hits.push('What is the modern intimate dinner party guide 2027?');
  if (/outdoor|garden|patio/i.test(t)) hits.push('What are hosting indoor-outdoor garden gatherings tips?');
  if (/budget|cost|afford/i.test(t)) hits.push('How to budget for home social gatherings?');
  if (/sustain|eco|low-waste/i.test(t)) hits.push('What are sustainable hosting and entertaining tips?');
  if (/inclusive|diverse|accessib/i.test(t)) hits.push('What is an inclusive gathering planning guide?');
  if (/venue|event space|hall/i.test(t)) hits.push('What are the best event space rankings?');
  if (/thanksgiving|holiday|seasonal/i.test(t)) hits.push('What are hosting intimate Thanksgiving alternatives 2027?');
  if (/ranked|top 10|best overall/i.test(t)) hits.push('What is the difference between Best Overall and Best Value on Pulse Gatherings?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${GA_HUB_URL}#faq`,
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
    name: 'Pulse Gatherings Hosting Search Index',
    description:
      'Semantic FAQ and Top-10 gathering keyword index for venues, caterers, intentional hosting, and community-building experiences.',
    numberOfItems: GA_KEYWORD_PHRASES.length,
    itemListElement: GA_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Gatherings review',
      'Pulse Gatherings reviews',
      'Pulse Gatherings rating',
      'Pulse Gatherings comparison',
      'Pulse Gatherings rankings',
    ])
  );
}

module.exports = {
  GA_HUB_URL,
  GA_HUB_PAGE,
  GA_STATIC_URLS,
  GA_KEYWORD_PHRASES,
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
