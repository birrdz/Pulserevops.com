// ACG Systems — semantic search + FAQ compete keywords for tagged knowledge Q&As.
// Applied via _acg_seo_optimize.js

const ACG_KEYWORD_PHRASES = require('./_acg_keyword_phrases.json');

const ACG_HUB_URL = 'https://pulserevops.com/knowledge.html';
const ACG_HUB_PAGE = 'knowledge.html';
const ACG_STATIC_URLS = [ACG_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  const q = /\?$/.test(p) || /^how /i.test(p) || /^what /i.test(p)
    ? (p.endsWith('?') ? p : p + '?')
    : `What should operators know about ${p.charAt(0).toLowerCase() + p.slice(1)}?`;
  const a = `Pulse RevOps answers ${p} with operator-grade GTM, CRM, and sales ops guidance for AV integrators, mission-critical communications firms, and regional systems integrators like ACG Systems in 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = ACG_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: ACG Systems FAQ',
  'ACG Systems knowledge library FAQ',
  'ACG Systems semantic search optimization',
  'ACG Systems Annapolis MD integrator guide',
  'ACG Systems mission-critical communications',
  'ACG Systems AV integration RevOps',
  'ACG Systems aviation communications',
  'ACG Systems federal LMR systems integrator',
  'ACG Systems regional vs national integrators',
  'ACG Systems revenue turnaround playbook',
  ...ACG_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'acg-systems',
  'annapolis-md',
  'maryland-business',
  'av-integration',
  'mission-critical-comms',
  'systems-integrator',
  'semantic-search-faq',
  'acg-systems-faq',
  'integrator-revops',
  'regional-integrator',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of ACG_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase();
    const tokens = p.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 28))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...ACG_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = ACG_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...ACG_KEYWORD_PHRASES.map(slugify)]));
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
  if (/acg|annapolis|maryland/i.test(t)) hits.push('What does ACG Systems in Annapolis MD do');
  if (/av|integrat|audio.?visual/i.test(t)) hits.push('ACG Systems vs national AV integrators');
  if (/aviation|air-to-ground|tactical|radio|lmr/i.test(t))
    hits.push('ACG Systems aviation communications work in 2027');
  if (/mission.?critical|communications|defense|federal/i.test(t))
    hits.push('ACG Systems mission-critical communications specialization');
  if (/help desk|24\/7|technician|field service|support/i.test(t))
    hits.push('ACG Systems 24/7 help desk and technician network');
  if (/northrim|horizon|acquisition|merger/i.test(t))
    hits.push('ACG Systems Northrim Horizon acquisition signals');
  if (/revenue|turnaround|fix|growth/i.test(t))
    hits.push('How to fix ACG Systems revenue issues');
  if (/regional|national|compet/i.test(t))
    hits.push('Regional AV integrator vs national firm comparison');
  if (/forecast|pipeline|crm|revops|quota/i.test(t))
    hits.push('How to run RevOps for AV integrators');
  if (/government|gsa|rfp|federal|contract/i.test(t))
    hits.push('Government contractor CRM best practices');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${ACG_HUB_URL}#acg-faq`,
    mainEntity: SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 48).map((row) => ({
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
    '@id': `${hubUrl}#acg-keyword-index`,
    name: 'ACG Systems Integrator RevOps Search Index',
    description:
      'Semantic FAQ and RevOps keyword index for ACG Systems, Annapolis MD AV integrators, and mission-critical communications operators.',
    numberOfItems: ACG_KEYWORD_PHRASES.length,
    itemListElement: ACG_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'ACG Systems review',
      'ACG Systems reviews',
      'ACG Systems comparison',
      'ACG Systems integrator guide',
      'ACG Systems operator analysis',
    ])
  );
}

function isAcgEntry(row, entry) {
  const tags = (entry && entry.tags) || (row && row.tags) || [];
  if (tags.some((t) => /acg/i.test(String(t)))) return true;
  const q = String((entry && entry.question) || (row && row.question) || '');
  const a = String((entry && entry.answer) || '');
  const blob = `${q} ${a}`.toLowerCase();
  return blob.includes('acg systems') || blob.includes('acg system') || /\bacg\b/.test(blob);
}

module.exports = {
  ACG_HUB_URL,
  ACG_HUB_PAGE,
  ACG_STATIC_URLS,
  ACG_KEYWORD_PHRASES,
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
  isAcgEntry,
};
