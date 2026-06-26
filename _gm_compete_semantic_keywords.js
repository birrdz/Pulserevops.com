// Pulse Gaming — semantic search + FAQ compete keywords for gm#### entries.
// Applied via _gm_seo_optimize.js + gaming.html hub sync.

const GM_KEYWORD_PHRASES = require('./_gm_keyword_phrases.json');

const GM_HUB_URL = 'https://pulserevops.com/gaming';
const GM_HUB_PAGE = 'gaming.html';
const GM_STATIC_URLS = [GM_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  const q = /^(how|what|why|are|is|can|should|do|does)/i.test(p)
    ? (/\?$/.test(p) ? p : `${p}?`)
    : `What are the best ${p.toLowerCase()}?`;
  const a = `Pulse Gaming ranks ${phrase} with Best Overall and Best Value picks, specs, prices, and player-tested verdicts for 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = GM_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Gaming FAQ',
  'Pulse Gaming FAQ structured data',
  'Pulse Gaming semantic search optimization',
  'Pulse Gaming Top-10 Rankings',
  'Best Overall vs Best Value gaming gear',
  'gaming buyer guide 2027',
  'gaming review 2027',
  'gaming reviews',
  'gaming comparison',
  'best gaming rankings',
  'esports gear guide',
  'cloud gaming comparison 2027',
  ...GM_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-gaming',
  'gaming',
  'video-games',
  'esports',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'gaming-buying-faq',
  'best-overall-best-value',
  'game-rankings',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of GM_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^best /, '').replace(/^top 10 /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...GM_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = GM_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...GM_KEYWORD_PHRASES.map(slugify)]));
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
  if (/console|playstation|xbox|nintendo/i.test(t)) hits.push('What are the best gaming consoles 2027?');
  if (/pc|gpu|graphics card|rtx/i.test(t)) hits.push('What is the best gaming PC setup for 2027?');
  if (/headset|audio|spatial/i.test(t)) hits.push('What are the best gaming headsets for spatial audio?');
  if (/monitor|refresh|144hz|240hz/i.test(t)) hits.push('What are the best gaming monitors for high refresh rates?');
  if (/keyboard|mechanical|switches/i.test(t)) hits.push('What are the best gaming keyboards for mechanical feel?');
  if (/mouse|dpi|sensitivity/i.test(t)) hits.push('What is the best gaming mouse for precision shooters?');
  if (/chair|desk|ergonomic/i.test(t)) hits.push('What are the best gaming chairs for long-term comfort?');
  if (/stream|twitch|obs|broadcast/i.test(t)) hits.push('How to stream gameplay on multiple platforms?');
  if (/esports|competitive|pro gamer/i.test(t)) hits.push('What is a beginner guide to competitive esports?');
  if (/cloud gaming|geforce now|xcloud/i.test(t)) hits.push('What are the best cloud gaming services 2027?');
  if (/vr|virtual reality|ar\b/i.test(t)) hits.push('What is virtual reality (VR) and augmented reality (AR) 2027?');
  if (/indie|game dev|studio/i.test(t)) hits.push('How to launch an indie gaming studio?');
  if (/lag|latency|ping|fps/i.test(t)) hits.push('Why is my game lagging on high-end PC?');
  if (/ranked|top 10|best overall/i.test(t)) hits.push('What is the difference between Best Overall and Best Value on Pulse Gaming?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${GM_HUB_URL}#faq`,
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
    name: 'Pulse Gaming Search Index',
    description:
      'Semantic FAQ and Top-10 gaming keyword index for hardware, esports, cloud gaming, indie dev, and player how-to guides.',
    numberOfItems: GM_KEYWORD_PHRASES.length,
    itemListElement: GM_KEYWORD_PHRASES.map((phrase, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: phrase,
      url: `${hubUrl}#${slugify(phrase)}`,
    })),
  };
}

function hubVideoGameNotesJsonLd(hubUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${hubUrl}#gaming-index`,
    name: 'Pulse Gaming — Top-10 Rankings Index',
    description:
      'Curated Top-10 gaming rankings for consoles, PCs, peripherals, and games with Best Overall + Best Value picks and player-tested verdicts.',
    url: hubUrl,
    about: [
      { '@type': 'Thing', name: 'video games' },
      { '@type': 'Thing', name: 'esports' },
      { '@type': 'Thing', name: 'gaming hardware' },
      { '@type': 'Thing', name: 'cloud gaming' },
    ],
    knowsAbout: [
      'gaming rankings',
      'esports gear',
      'PC gaming setup',
      'Best Overall gaming picks',
      'Best Value gaming picks',
    ],
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'Pulse Gaming review',
      'Pulse Gaming reviews',
      'Pulse Gaming rating',
      'Pulse Gaming comparison',
      'Pulse Gaming rankings',
    ])
  );
}

module.exports = {
  GM_HUB_URL,
  GM_HUB_PAGE,
  GM_STATIC_URLS,
  GM_KEYWORD_PHRASES,
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
  hubVideoGameNotesJsonLd,
  entrySeoBrandKeywords,
};
