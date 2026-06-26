// Pulse Events — semantic search + FAQ compete keywords for ev#### entries.
// Applied via _ev_seo_optimize.js + events.html hub sync.

const EV_KEYWORD_PHRASES = require('./_ev_keyword_phrases.json');

const EV_HUB_URL = 'https://pulserevops.com/events';
const EV_HUB_PAGE = 'events.html';
const EV_STATIC_URLS = [EV_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function normalizePhrase(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  const q = /[?.!]$/.test(p) ? p : `${p}?`;
  const a = `Pulse Events covers ${p} with Best Overall and Best Value picks, venue notes, production guidance, and a decision tree for corporate, experiential, and city happenings in 2026.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = EV_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Events FAQ',
  'Pulse Events FAQ structured data',
  'Pulse Events semantic search optimization',
  'Pulse Events Top-10 Rankings',
  'Best Overall vs Best Value events',
  'festival buyer guide 2026',
  'event review 2026',
  'event reviews',
  'event comparison',
  'best event rankings',
  'music festival rankings',
  'corporate event planning guide',
  ...EV_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-events',
  'events',
  'event',
  'festivals',
  'concerts',
  'top-10',
  'best-of-2026',
  'semantic-search-faq',
  'events-buying-faq',
  'best-overall-best-value',
];

function keywordsFromTitle(title) {
  const t = normalizePhrase(title);
  const hits = [];
  for (const phrase of EV_KEYWORD_PHRASES) {
    const p = normalizePhrase(phrase);
    if (t.includes(p) || p.includes(t)) {
      hits.push(slugify(phrase));
      continue;
    }
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= Math.min(3, tokens.length)) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...EV_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = EV_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...EV_KEYWORD_PHRASES.map(slugify)]));
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
  const t = normalizePhrase(title);
  const hits = [];
  for (const phrase of EV_KEYWORD_PHRASES) {
    const p = normalizePhrase(phrase);
    if (t.includes(p) || p.includes(t)) hits.push(phrase);
  }
  for (const row of SEMANTIC_FAQ_HUB_SCHEMA) {
    const q = normalizePhrase(row.q);
    if (t.includes(q.replace(/\?$/, '')) || q.includes(t)) {
      hits.push(row.q.replace(/\?+$/, ''));
      continue;
    }
    const tokens = q.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 3) hits.push(row.q.replace(/\?+$/, ''));
  }
  if (/music|festival|concert|coachella|bonnaroo|lollapalooza/i.test(t))
    hits.push('What are the best music festivals in [City] 2026?');
  if (/food|wine|beer|culinary|taste/i.test(t))
    hits.push('What are the top food festivals in [City] this year?');
  if (/day of the dead|dia de los muertos|cultural|heritage/i.test(t))
    hits.push('What are the cultural festivals in [City] 2026?');
  if (/sport|marathon|game|championship/i.test(t))
    hits.push('What is the sporting events calendar [City] 2026?');
  if (/christmas|holiday|winter|new year|fourth of july|halloween|pride|st patrick/i.test(t))
    hits.push('What are the best holiday events in [City]?');
  if (/corporate|conference|trade show|summit|networking/i.test(t))
    hits.push('What are the corporate event venues in [City]?');
  if (/wedding|gala|venue/i.test(t))
    hits.push('What are the wedding venues in [City] with catering?');
  if (/free|family|kids|date night/i.test(t))
    hits.push('What are the family-friendly events in [City]?');
  if (/ticket|price|cost/i.test(t))
    hits.push('How much does event planning cost?');
  if (/venue|staging|lighting|av|design|experience/i.test(t))
    hits.push('What are the event venue design trends 2026?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${EV_HUB_URL}#faq`,
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
    name: 'Pulse Events Top-10 Search Index',
    description:
      'Semantic FAQ and Top-10 events keyword index for festivals, concerts, corporate gatherings, venue design, and city happenings.',
    numberOfItems: EV_KEYWORD_PHRASES.length,
    itemListElement: EV_KEYWORD_PHRASES.map((phrase, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: phrase,
      url: `${hubUrl}#${slugify(phrase)}`,
    })),
  };
}

function hubEventSeriesJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${EV_HUB_URL}#pulse-events-series`,
    name: 'Pulse Events Top-10 Rankings Library',
    description:
      'Curated Top-10 event rankings covering music festivals, food festivals, cultural happenings, and city calendars — each entry maps to schema.org Event-style picks with dates, venues, and ticket guidance.',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: '[City]',
      address: { '@type': 'PostalAddress', addressLocality: '[City]' },
    },
    organizer: { '@type': 'Organization', name: 'Pulse RevOps', url: 'https://pulserevops.com' },
    isAccessibleForFree: false,
    keywords: EV_KEYWORD_PHRASES.slice(0, 12).join(', '),
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'Pulse Events review',
      'Pulse Events reviews',
      'Pulse Events rating',
      'Pulse Events comparison',
      'Pulse Events rankings',
    ])
  );
}

module.exports = {
  EV_HUB_URL,
  EV_HUB_PAGE,
  EV_STATIC_URLS,
  EV_KEYWORD_PHRASES,
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
  hubEventSeriesJsonLd,
  entrySeoBrandKeywords,
};
