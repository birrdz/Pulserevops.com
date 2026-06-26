// Pulse GTM Playbooks — semantic search + FAQ compete keywords for gp#### entries.
// Applied via _gp_seo_optimize.js + go-to-market-playbooks.html hub sync.

const GP_KEYWORD_PHRASES = require('./_gp_keyword_phrases.json');

const GP_HUB_URL = 'https://pulserevops.com/go-to-market-playbooks';
const GP_HUB_PAGE = 'go-to-market-playbooks.html';
const GP_STATIC_URLS = [GP_HUB_URL];

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
  const a = `Pulse GTM Playbooks answers ${p} with step-by-step operator playbooks, motion design, ICP and messaging templates, RevOps alignment, and hiring sequence — a practical go-to-market guide for B2B SaaS teams in 2027.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = GP_KEYWORD_PHRASES.map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: GTM Playbook FAQ',
  'Pulse GTM FAQ structured data',
  'Pulse GTM semantic search optimization',
  'Pulse GTM Playbooks operator guide',
  'Go-to-market playbook Q&A for RevOps',
  'GTM strategy playbook 2027',
  'PLG vs sales-led GTM playbook',
  'ICP and positioning GTM template',
  'RevOps-aligned GTM operating model',
  ...GP_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'pulse-gtm',
  'gtm-playbook',
  'go-to-market',
  'gtm-strategy',
  'sales-playbook',
  'revenue-operations',
  'semantic-search-faq',
  'gtm-playbook-faq',
  'b2b-saas-gtm',
  'mid-market-gtm',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of GP_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase();
    const tokens = p.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 28))) hits.push(slugify(phrase));
  }
  if (!hits.length) {
    hits.push(...GP_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const allSlugs = GP_KEYWORD_PHRASES.map(slugify);
  const merged = [...base, ...titleHits, ...allSlugs];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(new Set([...GLOBAL_TAGS, ...GP_KEYWORD_PHRASES.map(slugify)]));
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
  if (/plg|product.?led|freemium|self.?serve/i.test(t)) hits.push('PLG vs sales-led GTM for B2B SaaS');
  if (/sales.?led|enterprise|high.?touch|ae/i.test(t)) hits.push('Sales-led GTM playbook mid-market SaaS');
  if (/inbound|demand gen|content|mql/i.test(t)) hits.push('Inbound GTM playbook for SaaS');
  if (/outbound|sdr|bdr|cold/i.test(t)) hits.push('Outbound GTM playbook for mid-market');
  if (/channel|partner|reseller|alliance|co.?sell/i.test(t)) hits.push('Channel partner GTM strategy B2B SaaS');
  if (/icp|persona|target|segment/i.test(t)) hits.push('ICP definition template for B2B SaaS');
  if (/position|messag|narrative|value prop/i.test(t)) hits.push('Positioning framework for B2B SaaS GTM');
  if (/pric|packag|tier|sku/i.test(t)) hits.push('Packaging tiers for SaaS GTM');
  if (/launch|intro|go.?live|first 100/i.test(t)) hits.push('90-day GTM launch playbook B2B SaaS');
  if (/scale|series [bc]|10m|growth/i.test(t)) hits.push('Scaling GTM from $1M to $10M ARR B2B SaaS');
  if (/pivot|reset|missed quarter|turnaround/i.test(t)) hits.push('GTM reset playbook after missed quarter');
  if (/revops|pipeline|forecast|crm|hubspot|salesforce/i.test(t)) hits.push('RevOps alignment with GTM strategy');
  if (/comp|quota|ote|spif|commission/i.test(t)) hits.push('Comp plan design for outbound GTM');
  if (/cro|vp sales|founder|ceo/i.test(t)) hits.push('CRO GTM playbook 2027');
  if (/abm|account.?based/i.test(t)) hits.push('ABM GTM playbook for enterprise accounts');
  if (/vs |versus|comparison|compare/i.test(t)) hits.push('PLG vs sales-led GTM which is better for SaaS');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${GP_HUB_URL}#faq`,
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
    name: 'Pulse GTM Playbooks Search Index',
    description:
      'Semantic FAQ and go-to-market playbook keyword index for launch, scale, pivot, PLG vs sales-led, ICP, positioning, pricing, RevOps alignment, and channel motions.',
    numberOfItems: GP_KEYWORD_PHRASES.length,
    itemListElement: GP_KEYWORD_PHRASES.map((phrase, i) => ({
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
      'Pulse GTM review',
      'Pulse GTM reviews',
      'Pulse GTM rating',
      'Pulse GTM comparison',
      'Pulse GTM rankings',
      'Pulse GTM Playbooks review',
      'Go-to-market playbook guide',
    ])
  );
}

module.exports = {
  GP_HUB_URL,
  GP_HUB_PAGE,
  GP_STATIC_URLS,
  GP_KEYWORD_PHRASES,
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
