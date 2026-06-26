// CPI Security — semantic search + FAQ compete keywords for matching q#### entries.
// Phrase list: _cpi_security_keywords.json (209 keywords as of 2026-06-22).
// Applied via _cpi_security_seo_batch.js

const CPI_KEYWORD_PHRASES = require('./_cpi_security_keywords.json');

const CPI_HUB_URL = 'https://pulserevops.com/knowledge';
const CPI_STATIC_URLS = [CPI_HUB_URL];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  const q = /\?$/.test(p) || /^how |^what |^is |^can |^does /i.test(p)
    ? (p.endsWith('?') ? p : p + '?')
    : `What should you know about ${p}?`;
  const a = `Pulse RevOps covers ${p} with operator-grade analysis — contracts, monitoring, sales tactics, competitor comparisons, and practical guidance for North Carolina home security buyers.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = CPI_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: CPI Security FAQ',
  'CPI Security FAQ structured data',
  'CPI Security semantic search optimization',
  'CPI Security home alarm reviews',
  'CPI Security monitoring analysis',
  'CPI Security vs ADT comparison',
  'CPI Security vs Vivint comparison',
  'CPI Security North Carolina alarm',
  'home security door to door sales',
  'alarm monitoring contract guide',
  ...CPI_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'cpi-security',
  'home-security',
  'alarm-monitoring',
  'north-carolina',
  'security-systems',
  'semantic-search-faq',
  'cpi-security-faq',
  'home-alarm-reviews',
  'security-dealer-ops',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of CPI_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase();
    const tokens = p.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 24))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...CPI_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = CPI_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
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
  if (/adt|vivint|brinks|simplisafe|ring alarm|frontpoint|vector security/i.test(t)) {
    hits.push('How does CPI Security compare to national alarm brands?');
  }
  if (/contract|cancel|termination|buyout|fee/i.test(t)) {
    hits.push('How do you cancel a CPI Security alarm contract?');
  }
  if (/door.?to.?door|sales|rep|commission|tactic/i.test(t)) {
    hits.push('What are CPI Security door-to-door sales tactics?');
  }
  if (/monitor|central station|dispatch|false alarm/i.test(t)) {
    hits.push('How does CPI Security alarm monitoring work?');
  }
  if (/camera|video|doorbell|smart home/i.test(t)) {
    hits.push('Does CPI Security offer smart home security cameras?');
  }
  if (/charlotte|raleigh|greensboro|winston|durham|fayetteville|north carolina|\bnc\b/i.test(t)) {
    hits.push('Is CPI Security available in North Carolina?');
  }
  if (/complaint|review|scam|legit|bbb|yelp|rating/i.test(t)) {
    hits.push('What do CPI Security customer reviews say?');
  }
  if (/commercial|business|retail|office/i.test(t)) {
    hits.push('Does CPI Security offer commercial alarm monitoring?');
  }
  if (/price|cost|pricing|monthly|rmr/i.test(t)) {
    hits.push('How much does CPI Security monitoring cost per month?');
  }
  if (/revops|crm|sales ops|gtm|commission plan/i.test(t)) {
    hits.push('How do alarm companies structure door-to-door sales operations?');
  }
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      'CPI Security review',
      'CPI Security reviews',
      'CPI Security analysis',
      'CPI Security comparison',
      'Pulse RevOps CPI Security',
    ])
  );
}

/** @returns {'cpi-security'|'cpi-word'|'cpi-word-inflation'|null} */
function matchCpiEntry(question, answer, tags = []) {
  const q = String(question || '');
  const a = String(answer || '');
  const combined = `${q}\n${a}`;
  const tagHit = (tags || []).some((t) => /cpi-security/i.test(String(t)));
  const securityPhrase = /cpi\s+security/i.test(combined);
  if (tagHit || securityPhrase) return 'cpi-security';

  const cpiWord = /\bcpi\b/i.test(combined);
  if (!cpiWord) return null;

  const inflationCtx = /consumer price index|cpi\s+(plus|escalation|adjustment|increase)|annual cpi|cpi-linked|cpi-based/i.test(
    combined
  );
  if (inflationCtx && !/cpi\s+security|home security|alarm|monitoring|adt|vivint|brinks/i.test(combined)) {
    return 'cpi-word-inflation';
  }
  return 'cpi-word';
}

module.exports = {
  CPI_HUB_URL,
  CPI_STATIC_URLS,
  CPI_KEYWORD_PHRASES,
  COMPETE_DISPLAY_KEYWORDS,
  SEMANTIC_FAQ_HUB_SCHEMA,
  GLOBAL_TAGS,
  tagsForEntry,
  semanticFaqForTitle,
  entrySeoBrandKeywords,
  matchCpiEntry,
  slugify,
};
