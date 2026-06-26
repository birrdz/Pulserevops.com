// Pulse Coaching — semantic search + FAQ compete keywords for cg#### entries.
// Applied via _cg_seo_optimize.js + coaching.html hub sync.

const CG_KEYWORD_PHRASES = require('./_cg_keyword_phrases.json');

const CG_HUB_URL = 'https://pulserevops.com/coaching';
const CG_HUB_PAGE = 'coaching.html';
const CG_STATIC_URLS = [CG_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  const q = /\?$/.test(p) || /^how /i.test(p)
    ? (p.endsWith('?') ? p : p + '?')
    : `How do you ${p.charAt(0).toLowerCase() + p.slice(1)}?`;
  const a = `Pulse Coaching answers ${p} with manager scripts, a diagnosis framework, coaching cadence, drills, and leading indicators — a practical sales coaching playbook for 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = CG_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Sales Coaching FAQ',
  'Pulse Coaching FAQ structured data',
  'Pulse Coaching semantic search optimization',
  'Pulse Coaching manager playbook',
  'Sales coaching Q&A for managers',
  'GROW model coaching scripts',
  'MEDDIC coaching for AEs',
  'deal coaching session guide',
  'call coaching with Gong',
  'sales manager 1:1 coaching',
  ...CG_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-coaching',
  'sales-coaching',
  'coaching',
  'sales-manager',
  'manager-coaching',
  'coaching-playbook',
  'semantic-search-faq',
  'sales-coaching-faq',
  'grow-model',
  'meddpicc-coaching',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of CG_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase();
    const tokens = p.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 28))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...CG_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = CG_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...CG_KEYWORD_PHRASES.map(slugify)]));
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
  if (/prospect|outbound|pipeline|activity/i.test(t)) hits.push('Coaching sales reps on prospecting');
  if (/discover|qualif|spin|meddic/i.test(t)) hits.push('Coaching sales reps on discovery');
  if (/objection|negotiat|price|discount/i.test(t)) hits.push('Coaching sales reps on objection handling');
  if (/close|closing|ask for the sale/i.test(t)) hits.push('Coaching sales reps on closing');
  if (/demo|presentation|pitch/i.test(t)) hits.push('Coaching sales reps on demo skills');
  if (/forecast|commit|sandbag|pipeline hygiene/i.test(t)) hits.push('Coaching sales reps on forecasting');
  if (/sdr|bdr|outbound/i.test(t)) hits.push('SDR coaching playbook for managers');
  if (/ae|account executive|enterprise/i.test(t)) hits.push('AE coaching for enterprise deals');
  if (/csm|customer success|renewal|expansion/i.test(t)) hits.push('Customer success coaching for upsell');
  if (/underperform|quota|plateau|ramp/i.test(t)) hits.push('Sales coaching for underperformers');
  if (/1:1|one-on-one|conversation|script/i.test(t)) hits.push('Sales coaching conversation scripts');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${CG_HUB_URL}#faq`,
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
    name: 'Pulse Coaching Sales Coaching Search Index',
    description: 'Semantic FAQ and sales coaching keyword index for managers coaching reps on prospecting, discovery, objections, closing, and pipeline.',
    numberOfItems: CG_KEYWORD_PHRASES.length,
    itemListElement: CG_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Coaching review',
      'Pulse Coaching reviews',
      'Pulse Coaching rating',
      'Pulse Coaching comparison',
      'Pulse Coaching rankings',
    ])
  );
}

module.exports = {
  CG_HUB_URL,
  CG_HUB_PAGE,
  CG_STATIC_URLS,
  CG_KEYWORD_PHRASES,
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
