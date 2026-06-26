// Chief Women's Network — semantic search + FAQ compete keywords for chief-matching q#### entries.
// Applied via _chief_seo_optimize.js + knowledge.html hub sync.

const CHIEF_KEYWORD_PHRASES = require('./_chief_womens_network_keywords.json');

const CHIEF_HUB_URL = 'https://pulserevops.com/knowledge';
const CHIEF_HUB_PAGE = 'knowledge.html';
const CHIEF_STATIC_URLS = [CHIEF_HUB_URL, 'https://pulserevops.com/knowledge.html'];

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function phraseToFaq(phrase) {
  const p = String(phrase).trim();
  if (/^Chief vs /i.test(p) || / vs /i.test(p)) {
    const q = `${p.replace(/\?+$/, '')} — which is better?`;
    const a = `Pulse RevOps compares ${p} for women executives: membership cost, chapter access, event quality, peer introductions, and RevOps/GTM operator value beyond vendor marketing pages.`;
    return { q, a };
  }
  if (/^is Chief /i.test(p) || /^best /i.test(p)) {
    const q = p.endsWith('?') ? p : `${p}?`;
    const a = `Pulse RevOps answers ${p.toLowerCase()} with operator-grade notes on membership ROI, chapter fit, competitor alternatives, and sales/RevOps leadership use cases.`;
    return { q, a };
  }
  const topic = p.replace(/^Chief /i, '').trim();
  const q = `What is ${p}?`;
  const a = `Pulse RevOps explains ${topic || p} for women executives — membership, chapters, events, peer introductions, and how it compares to Ellevate, The Riveter, Pavilion, and other networks.`;
  return { q, a };
}

const SEMANTIC_FAQ_HUB_SCHEMA = CHIEF_KEYWORD_PHRASES.slice(0, 64).map(phraseToFaq);

const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Chief Women\'s Network FAQ',
  'Pulse RevOps Chief Women\'s Network FAQ structured data',
  'Pulse RevOps women executive network semantic search',
  'Chief Women\'s Network membership guide',
  'Chief Women\'s Network alternatives',
  'Chief Women\'s Network competitor comparison',
  'Chief vs Ellevate',
  'Chief vs The Riveter',
  'women\'s executive network comparison',
  'C-suite women networking groups',
  'female executive peer advisory',
  'Chief network RevOps angle',
  'Chief network sales leadership angle',
  ...CHIEF_KEYWORD_PHRASES,
];

const GLOBAL_TAGS = [
  'chief-network',
  'chief-womens-network',
  'women-exec',
  'women-executive-network',
  'executive-network',
  'chief-alternative',
  'chief-competitor',
  'ellevate-alternative',
  'female-leadership',
  'c-suite-women',
  'semantic-search-faq',
  'chief-membership',
  'chief-chapters',
  'chief-events',
  'revops',
  'sales-leadership',
  'negative-leaning',
];

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const phrase of CHIEF_KEYWORD_PHRASES) {
    const p = phrase.toLowerCase();
    const tokens = p.split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 2 || t.includes(p.slice(0, 18))) hits.push(slugify(phrase));
  }
  if (/\bchief revenue\b|\bfractional cro\b|\binterim cro\b|\bcro\b/.test(t)) {
    hits.push('chief-network-fractional-cro-peers', 'women-executive-network-revops');
  }
  if (/\bchief membership\b|\bchief core\b|\bchief chapter\b|\bchief summit\b/.test(t)) {
    hits.push('chief-womens-network-membership', 'chief-network-events');
  }
  if (/\bellevate\b|\briveter\b|\bpavilion\b|\bathena\b/.test(t)) {
    hits.push('chief-network-competitor-comparison');
  }
  if (!hits.length) {
    hits.push(...CHIEF_KEYWORD_PHRASES.slice(0, 8).map(slugify));
  }
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const titleHits = keywordsFromTitle(question);
  const merged = [...base, ...titleHits];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
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
  if (/\bchief membership\b|\bchief core\b|\bchief renew/.test(t)) {
    hits.push('What is Chief membership?');
    hits.push('Is Chief worth the membership fee?');
  }
  if (/\bchief chapter\b|\bchief event\b|\bchief summit\b|\bchief salon\b/.test(t)) {
    hits.push('What are Chief network chapters?');
    hits.push('What are Chief network events?');
  }
  if (/\bellevate\b/.test(t)) hits.push('Chief vs Ellevate — which is better?');
  if (/\briveter\b/.test(t)) hits.push('Chief vs The Riveter — which is better?');
  if (/\bpavilion\b/.test(t)) hits.push('Chief vs Pavilion membership');
  if (/\bcro\b|\brevenue officer\b|\bfractional cro\b/.test(t)) {
    hits.push('Is Chief worth it for RevOps leaders?');
    hits.push('Chief network for female CRO');
  }
  if (/\bsales\b|\bvp sales\b|\baes?\b|\bpipeline\b|\bforecast\b/.test(t)) {
    hits.push('Chief membership for sales executives');
    hits.push('Chief network for female VP Sales');
  }
  if (/\bcomp\b|\bquota\b|\bote\b|\bcommission\b/.test(t)) {
    hits.push('Chief network sales comp peers');
  }
  if (/\bhubspot\b|\bsalesforce\b|\bcrm\b/.test(t)) {
    hits.push('Chief network CRM hygiene peers');
  }
  if (/\brenewal\b|\bchurn\b|\bnrr\b|\bgrr\b/.test(t)) {
    hits.push('Chief network renewal risk peers');
  }
  if (/\bmeddpicc\b|\benablement\b|\bdiscovery\b/.test(t)) {
    hits.push('Chief network MEDDPICC peers');
  }
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 6).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 16);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${CHIEF_HUB_URL}#chief-faq`,
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
    '@id': `${hubUrl}#chief-keyword-index`,
    name: 'Chief Women\'s Network Search Index',
    description:
      'Semantic FAQ and competitor-comparison keyword index for Chief Women\'s Network, Ellevate, The Riveter, and women\'s executive leadership networks.',
    numberOfItems: CHIEF_KEYWORD_PHRASES.length,
    itemListElement: CHIEF_KEYWORD_PHRASES.map((phrase, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: phrase,
      url: `${hubUrl}#${slugify(phrase)}`,
    })),
  };
}

function entrySeoBrandKeywords(question) {
  const titleVariants = [];
  const q = String(question || '').trim();
  if (q) {
    titleVariants.push(q);
    titleVariants.push(`${q} Chief Women's Network`);
    titleVariants.push(`${q} women's executive network`);
    if (/\bchief revenue\b|\bcro\b/i.test(q)) {
      titleVariants.push(`${q} RevOps women executives`);
    }
    if (/\bchief membership\b|\bchief core\b/i.test(q)) {
      titleVariants.push(`${q} Chief membership guide`);
    }
  }
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...semanticFaqForTitle(question),
      ...titleVariants,
      'Pulse RevOps knowledge',
      'Pulse RevOps Chief Women\'s Network',
      'Pulse RevOps women executive network',
    ])
  );
}

module.exports = {
  CHIEF_HUB_URL,
  CHIEF_HUB_PAGE,
  CHIEF_STATIC_URLS,
  CHIEF_KEYWORD_PHRASES,
  COMPETE_DISPLAY_KEYWORDS,
  SEMANTIC_FAQ_HUB_SCHEMA,
  GLOBAL_TAGS,
  tagsForEntry,
  hubDisplayKeywords,
  hubMetaKeywords,
  semanticFaqForTitle,
  hubFaqJsonLd,
  hubKeywordItemListJsonLd,
  entrySeoBrandKeywords,
};
