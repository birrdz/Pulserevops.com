// Pulse Reviews mirror SEO — shared keyword corpus for er#### + /reviews mirror entries.
// Applied via _reviews_mirror_seo_optimize.js; er#### also uses _er_compete_semantic_keywords.js.

const MIRROR_KEYWORD_PHRASES = require('./_reviews_mirror_keyword_phrases.json');
const {
  ER_KEYWORD_PHRASES,
  COMPETE_DISPLAY_KEYWORDS,
  SEMANTIC_FAQ_HUB_SCHEMA,
  entrySeoBrandKeywords: erEntrySeoBrandKeywords,
  semanticFaqForTitle: erSemanticFaqForTitle,
  tagsForEntry: erTagsForEntry,
  ER_HUB_URL,
  ER_STATIC_URLS,
} = require('./_er_compete_semantic_keywords');

const REVIEWS_HUB_URL = 'https://pulserevops.com/reviews';
const ER_HUB_PAGE = 'electronic-reviews.html';

const MIRROR_STATIC_URLS = [
  REVIEWS_HUB_URL,
  ...ER_STATIC_URLS,
  'https://pulserevops.com/home/reviews',
  'https://pulserevops.com/knowledge/reviews',
  'https://pulserevops.com/sales-trainings/reviews',
  'https://pulserevops.com/industry-kpis/reviews',
  'https://pulserevops.com/electronic-reviews',
  'https://pulserevops.com/dashboard/reviews',
  'https://pulserevops.com/matrix/reviews',
  'https://pulserevops.com/schedule/reviews',
  'https://pulserevops.com/bins/reviews',
  'https://pulserevops.com/answers/reviews',
  'https://pulserevops.com/machine/reviews',
];

const MIRROR_GLOBAL_TAGS = [
  'pulse-reviews',
  'electronic-reviews',
  'reviews-mirror-index',
  'reviews-expert-analysis',
  'product-review',
  'reviews-2027',
  'semantic-search-faq',
];

const MIRROR_DISPLAY_KEYWORDS = Array.from(
  new Set([
    'Pulse Reviews mirror index',
    'Pulse Reviews expert analysis 2027',
    'reviews and expert analysis',
    'Pulse RevOps reviews',
    'Pulse Electronic Reviews',
    'reviews mirror SEO index',
    ...MIRROR_KEYWORD_PHRASES,
    ...COMPETE_DISPLAY_KEYWORDS.slice(0, 24),
  ])
);

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function isErEntry(id) {
  return /^er\d+$/i.test(String(id || ''));
}

function titleVariantsFromQuestion(question) {
  const q = String(question || '').replace(/\?+$/, '').trim();
  if (!q) return [];
  const topic = q
    .replace(/^(How (do|does|is|are|can|should|will|would) (you |i |a |the )?)/i, '')
    .replace(/^(What (is|are|does|do|should) (the |a |an )?)/i, '')
    .replace(/^(Why (is|are|does|do|should) (the |a |an )?)/i, '')
    .replace(/[.?!,]+$/g, '')
    .trim();
  if (!topic) return [];
  return [
    topic + ' reviews',
    topic + ' review 2027',
    topic + ' reviews 2027',
    topic + ' expert analysis',
    'review of ' + topic,
  ];
}

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of MIRROR_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^best /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 20))) hits.push(slugify(phrase));
  }
  if (!hits.length) hits.push(...MIRROR_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  return hits;
}

function mirrorTagsForEntry(id, question, existingTags = []) {
  const base = [...MIRROR_GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const phraseSlugs = MIRROR_KEYWORD_PHRASES.map(slugify);
  if (isErEntry(id)) {
    return erTagsForEntry(id, question, base);
  }
  const merged = [...base, ...titleHits, ...phraseSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function mirrorSemanticFaqForTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const row of SEMANTIC_FAQ_HUB_SCHEMA) {
    const q = row.q.toLowerCase();
    const tokens = q.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 3) hits.push(row.q.replace(/\?+$/, ''));
  }
  const titleVars = titleVariantsFromQuestion(title).map((s) => s.replace(/\?+$/, ''));
  hits.push(...titleVars);
  if (/revops|pipeline|forecast|crm|sales|gtm|quota|meddpicc/i.test(t)) {
    hits.push('What are the best RevOps operator reviews in 2027?');
    hits.push('What is the best sales process review guide in 2027?');
  }
  if (/review|reviews|rating|ranking|top-10|best overall|best value/i.test(t)) {
    hits.push('What is the best product review ranking in 2027?');
    hits.push('What are expert analysis reviews for this topic?');
  }
  if (!hits.length) {
    hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  }
  return Array.from(new Set(hits)).slice(0, 16);
}

function mirrorEntrySeoBrandKeywords(id, question) {
  const titleVars = titleVariantsFromQuestion(question);
  if (isErEntry(id)) {
    return Array.from(new Set([...erEntrySeoBrandKeywords(question), ...MIRROR_DISPLAY_KEYWORDS.slice(0, 40)]));
  }
  return Array.from(
    new Set([
      ...MIRROR_DISPLAY_KEYWORDS,
      ...mirrorSemanticFaqForTitle(question),
      ...titleVars,
      'Pulse Reviews review',
      'Pulse Reviews reviews',
      'Pulse Reviews expert analysis',
      'Pulse Reviews ratings',
      'Pulse Reviews comparison',
      'Pulse Reviews mirror index',
    ])
  );
}

function matchReviewsInventoryEntry(row, entry) {
  const id = String((row && row.id) || (entry && entry.id) || '');
  if (!id) return null;

  const tags = (row && row.tags) || (entry && entry.tags) || [];
  const question = String((row && row.question) || (entry && entry.question) || '');
  const tagStr = tags.map((t) => String(t).toLowerCase()).join(' ');

  if (/^er\d+$/i.test(id)) return { bucket: 'er', reason: 'er#### electronic reviews pillar' };
  if (/review/.test(tagStr)) return { bucket: 'tagged', reason: 'reviews tag' };
  if (/\breviews?\b/i.test(question)) return { bucket: 'title', reason: 'review/reviews in question' };

  if (/^[a-z]{1,3}\d+$/i.test(id) || /^vq_/i.test(id)) {
    return { bucket: 'mirror', reason: '/reviews mirror URL' };
  }
  return null;
}

module.exports = {
  MIRROR_KEYWORD_PHRASES,
  MIRROR_GLOBAL_TAGS,
  MIRROR_DISPLAY_KEYWORDS,
  MIRROR_STATIC_URLS,
  REVIEWS_HUB_URL,
  ER_HUB_URL,
  ER_HUB_PAGE,
  ER_KEYWORD_PHRASES,
  isErEntry,
  mirrorTagsForEntry,
  mirrorEntrySeoBrandKeywords,
  mirrorSemanticFaqForTitle,
  matchReviewsInventoryEntry,
  slugify,
};
