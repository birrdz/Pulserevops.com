// Pulse Electronic Reviews — semantic search + FAQ compete keywords for er#### entries.
// Applied via _er_seo_optimize.js + electronic-reviews.html hub sync.

const ER_KEYWORD_PHRASES = require('./_er_keyword_phrases.json');

const ER_HUB_URL = 'https://pulserevops.com/electronic-reviews';
const ER_HUB_PAGE = 'electronic-reviews.html';
const ER_STATIC_URLS = [ER_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const topic = String(phrase).replace(/^Best /i, '').replace(/\s+2027$/i, '').trim();
  const q = `What is the best ${topic.toLowerCase()}?`;
  const a = `Pulse Reviews ranks the top 10 ${topic} with Best Overall and Best Value picks, hands-on testing notes, price tiers, and a buyer decision tree for 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = ER_KEYWORD_PHRASES.slice(0, 80).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Electronic Reviews FAQ',
  'Pulse Reviews FAQ structured data',
  'Pulse Reviews semantic search optimization',
  'Pulse Electronic Reviews Top-10 Rankings',
  'Best Overall vs Best Value electronics',
  'consumer electronics buyer guide 2027',
  'product review 2027',
  'product reviews',
  'electronics comparison',
  'best electronics rankings',
  'gadget reviews 2027',
  'tech product rankings',
  ...ER_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-reviews',
  'electronic-reviews',
  'reviews-mirror-index',
  'electronic-review',
  'consumer-electronics',
  'product-review',
  'gadget-review',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'electronics-buying-faq',
  'best-overall-best-value',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of ER_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^best /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 20))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...ER_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = ER_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...ER_KEYWORD_PHRASES.map(slugify)]));
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
  if (/headphone|earbud|airpod|bose|sony wh/i.test(t)) hits.push('What are the best wireless earbuds in 2027?');
  if (/tv|oled|qled|hisense|samsung tv|lg tv/i.test(t)) hits.push('What is the best smart TV in 2027?');
  if (/laptop|macbook|chromebook|ultrabook/i.test(t)) hits.push('What is the best laptop for work in 2027?');
  if (/monitor|display|screen/i.test(t)) hits.push('What is the best 4K monitor in 2027?');
  if (/keyboard|mouse|desk|chair|office/i.test(t)) hits.push('What is the best home office setup gear in 2027?');
  if (/camera|lens|drone|gimbal|webcam/i.test(t)) hits.push('What is the best camera for content creators in 2027?');
  if (/vacuum|mop|cleaner|purifier|humidifier/i.test(t)) hits.push('What is the best smart home cleaning device in 2027?');
  if (/coffee|espresso|air fryer|kitchen|blender/i.test(t)) hits.push('What is the best kitchen appliance in 2027?');
  if (/gaming|console|ps5|xbox|switch|steam deck/i.test(t)) hits.push('What is the best gaming gear in 2027?');
  if (/router|wifi|mesh|nas|ssd|hub|dock/i.test(t)) hits.push('What is the best home networking gear in 2027?');
  if (/security|doorbell|camera|lock|alarm/i.test(t)) hits.push('What is the best home security device in 2027?');
  if (/fitness|treadmill|bike|tracker|watch|scale/i.test(t)) hits.push('What is the best fitness tech in 2027?');
  if (/car|dash cam|obd|tire|jump starter|ev charger/i.test(t)) hits.push('What is the best car electronics in 2027?');
  if (/baby|kids|pet/i.test(t)) hits.push('What is the best family tech gadget in 2027?');
  if (/budget|under \$|cheap|affordable|value/i.test(t)) hits.push('What is the best value electronics pick in 2027?');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${ER_HUB_URL}#faq`,
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
    name: 'Pulse Reviews Top-10 Electronics Search Index',
    description:
      'Semantic FAQ and Top-10 consumer electronics keyword index for TVs, laptops, headphones, smart home, kitchen, fitness, and car tech.',
    numberOfItems: ER_KEYWORD_PHRASES.length,
    itemListElement: ER_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Reviews review',
      'Pulse Reviews reviews',
      'Pulse Reviews rating',
      'Pulse Reviews comparison',
      'Pulse Reviews rankings',
      'Pulse Electronic Reviews',
    ])
  );
}

module.exports = {
  ER_HUB_URL,
  ER_HUB_PAGE,
  ER_STATIC_URLS,
  ER_KEYWORD_PHRASES,
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
