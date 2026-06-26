// CRO / CRO Syndicate / fractional CRO SEO — slug tags + display phrases.
const fs = require('fs');
const path = require('path');
const { FRACTIONAL_CRO_100, CRO_SYNDICATE_TEAM_EXTRA, KORY_WHITE_BRAND_EXTRA, KORY_WHITE_EXPERTISE_EXTRA } = require('./_cro_fractional_100_keywords');
const { CRO_LANDSCAPE_ALL } = require('./_cro_competitive_landscape_keywords');

/** Canonical hub + landing pages for fractional CRO / CRO Syndicate SEO */
const CRO_HUB_URL = 'https://pulserevops.com/cro-syndicate-team';
const CRO_MARYLAND_DC_URL = 'https://pulserevops.com/fractional-cro-maryland-dc';

const CRO_STATIC_PAGES = [
  'fractional-cro.html',
  'fractional-cro-maryland-dc.html',
  'kory-white-maryland.html',
  'cro-syndicate-team.html',
];

const CRO_STATIC_URLS = [
  'https://pulserevops.com/fractional-cro',
  CRO_MARYLAND_DC_URL,
  CRO_HUB_URL,
  'https://pulserevops.com/kory-white-maryland',
];

const CRO_INDEXNOW_EXTRA = [
  'https://pulserevops.com/cro-syndicate',
  'https://pulserevops.com/knowledge',
  'https://pulserevops.com/revenue-architecture',
  'https://pulserevops.com/go-to-market-playbooks',
  'https://pulserevops.com/sales-trainings',
];

const BASE_CORE_CRO_SLUGS = [
  'fractional-cro',
  'fractional-chief-revenue-officer',
  'cro-syndicate',
  'cro-syndicate-team',
  'fractional-cro-maryland-dc',
  'cro-syndicate-fractional-cro',
  'hire-fractional-cro',
  'interim-cro',
  'chief-revenue-officer',
  'cro-for-hire',
  'cro-consulting',
  'cro-advisory',
  'kory-white-fractional-cro',
  'kory-white-cro-syndicate',
  'korywhite',
  'kory-white',
  'korywhitemaryland',
  'korywhitemd',
  'best-fractional-cro',
  'fractional-cro-2027',
  'revops',
  'revenue-operations',
  'sales-revops',
];

/** Primary SERP phrases — merged into meta keywords + JSON-LD alternateName */
const BASE_CRO_DISPLAY_KEYWORDS = [
  'fractional CRO',
  'fractional chief revenue officer',
  'CRO Syndicate',
  'CRO Syndicate fractional CRO',
  'hire a fractional CRO',
  'interim CRO',
  'chief revenue officer',
  'CRO for hire',
  'fractional CRO help',
  'CRO consultant',
  'CRO consulting',
  'Kory White fractional CRO',
  'Kory White CRO Syndicate',
  'korywhite',
  'kory white',
  'korywhitemaryland',
  'korywhitemd',
  'best fractional CRO',
  'fractional CRO 2027',
  'CRO Syndicate reviews',
  'fractional CRO reviews',
  'fractional CRO Maryland',
  'fractional CRO Washington DC',
  'RevOps',
  'revenue operations',
];

const ALL_CRO_PHRASES = Array.from(
  new Set(
    [
      ...BASE_CRO_DISPLAY_KEYWORDS,
      ...FRACTIONAL_CRO_100,
      ...CRO_SYNDICATE_TEAM_EXTRA,
      ...KORY_WHITE_BRAND_EXTRA,
      ...KORY_WHITE_EXPERTISE_EXTRA,
      ...CRO_LANDSCAPE_ALL,
    ]
      .map((s) => String(s).trim())
      .filter(Boolean)
  )
);

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

const CORE_CRO_SLUGS = Array.from(
  new Set([...BASE_CORE_CRO_SLUGS, ...ALL_CRO_PHRASES.map(slugify)].filter(Boolean))
);

const CRO_DISPLAY_KEYWORDS = ALL_CRO_PHRASES;

const REVOPS_DISPLAY_KEYWORDS = [
  'RevOps',
  'revenue operations',
  'Sales RevOps',
  'fractional CRO',
  'CRO Syndicate',
  'GTM operations',
  'pipeline forecast',
  'Revenue Operations Consultant',
  'Revenue Forecasting Consultant',
  'Fractional Revenue Ops Lead',
  'Fractional Sales Operations',
  'Revenue Tech Stack Advisor',
  'Fractional Pipeline Expert',
];

/** @returns {'cro'|'revops'|null} */
function matchCroTier(question, tags = []) {
  const q = String(question || '');
  const t = (tags || []).map((x) => String(x).toLowerCase());
  if (
    /fractional\s+cro|cro syndicate|chief revenue officer|hire a (fractional )?cro|interim cro|part[- ]time cro|fractional chief revenue/i.test(
      q
    ) ||
    /sales xceleration|chief outsiders|vendux|bolster|toptal|kalungi|cmox|waveup|sbi growth|marketerhire|catalant|gtm 80\/20/i.test(
      q
    ) ||
    t.some((x) => /fractional-cro|cro-syndicate|cro-syndicate-team|chief-revenue-officer/.test(x))
  ) {
    return 'cro';
  }
  if (/\bcro\b/i.test(q) && /revenue|sales|gtm|forecast|quota|comp|board|pipeline/i.test(q)) {
    return 'cro';
  }
  if (/revops|revenue operations|sales revops|gtm operations/i.test(q) || t.includes('revops')) {
    return 'revops';
  }
  return null;
}

function tagsForEntry(question, existingTags = [], tier = null) {
  const t = tier || matchCroTier(question, existingTags);
  if (!t) return null;
  const base = [...CORE_CRO_SLUGS];
  if (t === 'revops') {
    base.push('gtm-operations', 'pipeline-forecast', 'crm-revops');
  } else {
    base.push(
      'fractional-cro-maryland-dc',
      'fractional-cro-maryland',
      'fractional-cro-dc',
      'practitioner-cro-network',
      'cro-syndicate-practitioners'
    );
  }
  const merged = [...(existingTags || []), ...base];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function displayKeywordsForTier(tier) {
  if (tier === 'cro') return CRO_DISPLAY_KEYWORDS;
  if (tier === 'revops') return Array.from(new Set([...CRO_DISPLAY_KEYWORDS, ...REVOPS_DISPLAY_KEYWORDS]));
  return [];
}

/** Optional: load extended list from _cro_keywords.txt for hub pages */
function loadExtendedKeywords() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '_cro_keywords.txt'), 'utf8');
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  } catch {
    return CRO_DISPLAY_KEYWORDS;
  }
}

module.exports = {
  CRO_HUB_URL,
  CRO_MARYLAND_DC_URL,
  CRO_STATIC_PAGES,
  CRO_STATIC_URLS,
  CRO_INDEXNOW_EXTRA,
  CORE_CRO_SLUGS,
  CRO_DISPLAY_KEYWORDS,
  REVOPS_DISPLAY_KEYWORDS,
  ALL_CRO_PHRASES,
  matchCroTier,
  tagsForEntry,
  displayKeywordsForTier,
  loadExtendedKeywords,
  slugify,
};
