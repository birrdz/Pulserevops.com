// Pulse Sales Trainings — semantic search + FAQ compete keywords for st0499+ Top-10 entries.
// Applied via _st_seo_optimize.js + sales-trainings.html hub sync.

const ST_KEYWORD_PHRASES = require('./_st_keyword_phrases.json');

const ST_HUB_URL = 'https://pulserevops.com/sales-trainings';
const ST_HUB_PAGE = 'sales-trainings.html';
const ST_STATIC_URLS = [ST_HUB_URL];

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
    .replace(/^How to /i, '')
    .trim();
  const q = /^how/i.test(phrase)
    ? `${phrase.replace(/\?+$/, '')}?`
    : `What are the best ${topic.toLowerCase()}?`;
  const a = `Pulse Sales Trainings ranks the ${phrase} with Best Overall and Best Value picks, facilitator notes, role-play scripts, timing, and manager-ready agendas for 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = ST_KEYWORD_PHRASES.slice(0, 48).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Sales Training FAQ',
  'Pulse Sales Trainings FAQ structured data',
  'Pulse Sales Trainings semantic search optimization',
  'Pulse Sales Trainings Top-10 Rankings',
  'Best Overall vs Best Value sales training drills',
  'sales training buyer guide 2027',
  'sales training review 2027',
  'sales training comparison',
  'best sales training rankings',
  'sales enablement training guide',
  'manager sales training playbook',
  'MEDDPICC training drills',
  'Challenger sale training exercises',
  ...ST_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-sales-trainings',
  'sales-training',
  'sales-enablement',
  'top-10',
  'best-of-2027',
  'semantic-search-faq',
  'sales-training-faq',
  'best-overall-best-value',
  'sales-coaching',
  'manager-training',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of ST_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^best /, '').replace(/^top 10 /, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...ST_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = ST_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...ST_KEYWORD_PHRASES.map(slugify)]));
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
  if (/meddpicc|meddic|champion|economic buyer|decision process/i.test(t)) hits.push('Top 10 MEDDPICC sales training drills for AEs');
  if (/challenger|reframe|teach|tailor|take control/i.test(t)) hits.push('Top 10 Challenger Sale training exercises for SaaS reps');
  if (/spin|situation|problem|implication|need-payoff/i.test(t)) hits.push('Top 10 SPIN Selling training activities');
  if (/discovery|qualif|bant/i.test(t)) hits.push('Top 10 discovery call training drills for B2B sales reps');
  if (/objection|negotiat|price|discount/i.test(t)) hits.push('Top 10 objection handling training drills for B2B sales reps');
  if (/close|closing|commit/i.test(t)) hits.push('Top 10 closing training drills for B2B sales reps');
  if (/demo|presentation|pitch/i.test(t)) hits.push('Top 10 demo training drills for B2B sales reps');
  if (/prospect|cold call|outbound|sdr|bdr/i.test(t)) hits.push('Top 10 cold call training drills for B2B sales reps');
  if (/role-play|role play|scenario/i.test(t)) hits.push('Best discovery call role-play scenarios for sales teams');
  if (/manager|pipeline|forecast|1:1|coaching/i.test(t)) hits.push('Top 10 sales manager pipeline review training formats');
  if (/onboard|ramp|new hire|bootcamp/i.test(t)) hits.push('Sales onboarding bootcamp training modules');
  if (/csm|renewal|expansion|customer success/i.test(t)) hits.push('Renewal and expansion training for CSMs');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${ST_HUB_URL}#faq`,
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
    name: 'Pulse Sales Trainings Search Index',
    description: 'Semantic FAQ and sales training keyword index for manager-led drills, role-plays, methodologies, and enablement workshops.',
    numberOfItems: ST_KEYWORD_PHRASES.length,
    itemListElement: ST_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Sales Trainings review',
      'Pulse Sales Trainings reviews',
      'Pulse Sales Trainings rating',
      'Pulse Sales Trainings comparison',
      'Pulse Sales Trainings rankings',
    ])
  );
}

module.exports = {
  ST_HUB_URL,
  ST_HUB_PAGE,
  ST_STATIC_URLS,
  ST_KEYWORD_PHRASES,
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
