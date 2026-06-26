// Pulse Buildouts — semantic search + FAQ compete keywords for bo#### entries.
// Applied via _bo_seo_optimize.js + buildouts.html hub sync.

const BO_KEYWORD_PHRASES = require('./_bo_keyword_phrases.json');

const BO_HUB_URL = 'https://pulserevops.com/buildouts';
const BO_HUB_PAGE = 'buildouts.html';
const BO_STATIC_URLS = [BO_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  const q = /\?$/.test(p) ? p : p.endsWith('?') ? p : `${p}?`;
  const name = q.replace(/\?+$/, '');
  const a = `Pulse Buildouts answers ${name.toLowerCase()} with direct CRE guidance on TI allowances, lease negotiation, buildout budgeting, contractor vetting, and how not to get screwed by the landlord.`;
  return { q: name.endsWith('?') ? name : `${name}?`, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = BO_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Commercial Buildout FAQ',
  'Pulse Buildouts FAQ structured data',
  'Pulse Buildouts semantic search optimization',
  'Pulse Buildouts CRE and TI guides',
  'tenant improvement allowance negotiation',
  'commercial lease buildout checklist',
  'commercial fit-out cost guide 2027',
  'NNN lease negotiation for tenants',
  'CAM cap commercial lease',
  'free rent abatement negotiation',
  ...BO_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-buildouts',
  'buildouts',
  'commercial-buildout',
  'commercial-real-estate',
  'cre',
  'tenant-improvement',
  'ti-allowance',
  'fit-out',
  'lease-negotiation',
  'semantic-search-faq',
  'buildout-faq',
  'save-money-cre',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of BO_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase().replace(/^what is (a |an )?/i, '').replace(/\?+$/, '');
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 28))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...BO_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = BO_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...BO_KEYWORD_PHRASES.map(slugify)]));
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
  if (/ti|tenant improvement|allowance/i.test(t)) hits.push('What is a tenant improvement allowance');
  if (/nnn|triple net|gross lease/i.test(t)) hits.push('Gross lease vs triple net lease for tenants');
  if (/cam|common area/i.test(t)) hits.push('How to negotiate CAM charges and caps');
  if (/free rent|abatement/i.test(t)) hits.push('How to negotiate free rent and rent abatement');
  if (/landlord|screwed|red flag/i.test(t)) hits.push('How to avoid getting screwed by your landlord on buildout');
  if (/restaurant|kitchen|food/i.test(t)) hits.push('How much does a restaurant buildout cost');
  if (/medical|dental|clinic/i.test(t)) hits.push('How much does a medical office buildout cost');
  if (/budget|cost|per square foot|sf\b/i.test(t)) hits.push('Commercial buildout cost per square foot 2027');
  if (/contractor|gc|construction|draw/i.test(t)) hits.push('How to vet a general contractor for commercial buildout');
  if (/lease|loi|negotiat/i.test(t)) hits.push('Complete commercial lease negotiation checklist for tenants');
  if (/build-to-suit|demolish|turnkey|warm shell/i.test(t)) hits.push('Warm shell vs turnkey delivery cost comparison');
  if (/sba|loan|financ/i.test(t)) hits.push('How to finance a commercial tenant improvement');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BO_HUB_URL}#faq`,
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
    name: 'Pulse Buildouts Commercial CRE Search Index',
    description:
      'Semantic FAQ and commercial buildout keyword index for TI allowances, lease negotiation, fit-out costs, and tenant improvement strategy.',
    numberOfItems: BO_KEYWORD_PHRASES.length,
    itemListElement: BO_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse Buildouts review',
      'Pulse Buildouts reviews',
      'Pulse Buildouts rating',
      'Pulse Buildouts comparison',
      'Pulse Buildouts CRE guide',
      'commercial buildout guide 2027',
    ])
  );
}

module.exports = {
  BO_HUB_URL,
  BO_HUB_PAGE,
  BO_STATIC_URLS,
  BO_KEYWORD_PHRASES,
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
