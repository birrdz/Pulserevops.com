// derive-image-search-query.js — slug/title → Pexels/DDG/Pollinator search query.
// Clone-family pages (same core topic, different city) must normalize to the same query.
//
// CRITICAL: keep brand/entity phrases (e.g. "Comfort Inn") and page intent.
// Never let "Inn in Atlanta" strip to "comfort" (massage) via fake state parsing.

const STOPWORDS = new Set([
  'best', 'top', 'vs', 'versus', 'how', 'why', 'what', 'when', 'where', 'who',
  'guide', 'review', 'reviews', 'ranked', 'ranking', 'list', 'ultimate', 'complete',
  '10', 'five', 'seven', 'eight', 'nine',
  '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029',
  'the', 'a', 'an', 'for', 'to', 'of', 'in', 'on', 'at', 'by', 'and', 'or', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did',
  'your', 'you', 'our', 'we', 'my', 'i', 'me', 'their', 'they', 'them',
  'should', 'can', 'could', 'would', 'will', 'just', 'only', 'also', 'very',
  'near', 'me', 'local', 'nearby', 'area', 'areas', 'city', 'town', 'county',
  'much', 'does', 'cost', 'find', 'get', 'need', 'hire', 'buying',
]);

// Ambiguous 2-letter tokens that are ALSO common English — never treat as US states here.
const AMBIGUOUS_STATE = new Set(['in', 'or', 'me', 'hi', 'ok', 'la', 'id', 'oh', 'de', 'ok']);

const US_STATE_ABBRS = new Set([
  'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky',
  'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd',
  'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy', 'dc',
]);

const PLURAL_TRIM = {
  realtors: 'realtor', lawyers: 'lawyer', dentists: 'dentist',
  doctors: 'doctor', contractors: 'contractor', restaurants: 'restaurant', hotels: 'hotel',
};

const INVARIANT_PLURALS = new Set(['headphones', 'sunglasses', 'scissors', 'pliers', 'shorts', 'trousers']);

// Weak adjectives that alone cause off-topic stock (comfort→spa, luxury→perfume, etc.)
const WEAK_ALONE = new Set([
  'comfort', 'comfortable', 'luxury', 'premium', 'quality', 'value', 'smart', 'easy',
  'simple', 'modern', 'classic', 'power', 'energy', 'fresh', 'soft', 'hard', 'buy', 'own',
]);

const HOTEL_BRAND_HINT =
  /\b(comfort inn|holiday inn|hampton inn|marriott|hilton|hyatt|sheraton|radisson|motel 6|super 8|best western|la quinta|wyndham|extended stay|residence inn|courtyard|fairfield|springhill|towneplace|homewood|candlewood|aloft|element|w hotel|ritz.?carlton|four seasons|ihg|choice hotels|wyndham)\b/i;
const HOTEL_WORD = /\b(hotel|motel|inn|resort|lodge|hostel|franchise|hospitality)\b/i;
const BUY_INTENT = /\b(buy|purchase|own|invest|franchise|acquire|acquisition|owner|ownership)\b/i;
const CRO_INTENT = /\b(cro|fractional|revenue|sales|pipeline|gtm|outsourced)\b/i;

function tokenize(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[?!.,;:()"']/g, ' ')
    .replace(/[_/]+/g, '-')
    .split(/[\s-]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function stripYearTokens(tokens) {
  return tokens.filter((t) => !/^20[2-3]\d$/.test(t));
}

function stripStopwords(tokens) {
  return tokens.filter((t) => !STOPWORDS.has(t) && t.length > 1);
}

/** Strip trailing city + US state abbrev — never eat brand words via ambiguous "in/or/me". */
function stripLocationSuffix(tokens) {
  const t = tokens.slice();
  while (t.length >= 2) {
    const last = t[t.length - 1];
    if (!US_STATE_ABBRS.has(last) || AMBIGUOUS_STATE.has(last)) break;
    t.pop(); // state
    if (t.length) t.pop(); // city
  }
  return t;
}

function normalizeNoun(word) {
  if (INVARIANT_PLURALS.has(word)) return word;
  if (PLURAL_TRIM[word]) return PLURAL_TRIM[word];
  if (word.endsWith('ies') && word.length > 4) return word.slice(0, -3) + 'y';
  if (word.endsWith('es') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 4 && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function dedupeAdjacent(tokens) {
  const out = [];
  for (const w of tokens) {
    if (!out.length || out[out.length - 1] !== w) out.push(w);
  }
  return out;
}

/** Keep capitalized multi-word brands from the original title (Comfort Inn, Chief Revenue Officer). */
function extractBrandPhrases(raw) {
  const phrases = [];
  const s = String(raw || '');
  const re = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z0-9]+){1,3})\b/g;
  let m;
  while ((m = re.exec(s))) {
    const p = m[1].replace(/\s+/g, ' ').trim();
    if (p.split(/\s+/).every((w) => STOPWORDS.has(w.toLowerCase()))) continue;
    phrases.push(p.toLowerCase());
  }
  return phrases;
}

function intentBoosters(raw) {
  const t = String(raw || '');
  const boost = [];
  if (HOTEL_BRAND_HINT.test(t) || (HOTEL_WORD.test(t) && BUY_INTENT.test(t))) {
    boost.push('hotel', 'exterior');
    if (BUY_INTENT.test(t)) boost.push('franchise');
  } else if (HOTEL_WORD.test(t)) {
    boost.push('hotel');
  }
  // Chief Revenue Officer / CRO → executives, never tribal "chief"
  if (CRO_INTENT.test(t) || /\bchief\s+revenue\s+officer\b/i.test(t)) {
    boost.push('executive', 'business', 'meeting');
  }
  if (/\b(car|truck|suv|sedan|hatchback|vehicle|automotive)\b/i.test(t)) {
    boost.push('car');
  }
  return boost;
}

/**
 * @param {string} slugOrTitle — URL slug or page title
 * @returns {string} search query anchored to title entities
 */
function deriveImageSearchQuery(slugOrTitle) {
  const raw = String(slugOrTitle || '').trim();
  const brands = extractBrandPhrases(raw);
  let tokens = tokenize(raw);
  tokens = stripYearTokens(tokens);
  tokens = stripLocationSuffix(tokens);
  tokens = stripStopwords(tokens);
  tokens = tokens.map(normalizeNoun);
  tokens = dedupeAdjacent(tokens);

  // Prefer brand phrase tokens first (comfort inn), then remaining nouns
  const brandToks = [];
  for (const b of brands) {
    for (const w of b.split(/\s+/)) {
      if (w && !brandToks.includes(w)) brandToks.push(w);
    }
  }
  const merged = [];
  for (const w of brandToks.concat(tokens)) {
    if (!merged.includes(w)) merged.push(w);
  }

  const boost = intentBoosters(raw);
  for (const b of boost) {
    if (!merged.includes(b)) merged.push(b);
  }

  // CRO / Chief Revenue Officer → never bare "chief" (pulls tribal/headdress stock)
  const croPhrase =
    /\bchief\s+revenue\s+officer\b/i.test(raw) ||
    /\bfractional\s+cro\b/i.test(raw) ||
    (/\bcro\b/i.test(raw) && /\b(fractional|revenue|sales|pipeline|outsourced)\b/i.test(raw));
  if (croPhrase) {
    // Drop standalone chief; keep revenue/officer/cro + executive framing
    const filtered = merged.filter((w) => w !== 'chief');
    for (const w of ['executive', 'business', 'meeting', 'office']) {
      if (!filtered.includes(w)) filtered.push(w);
    }
    // Prefer explicit phrase tokens first
    merged.length = 0;
    for (const w of ['revenue', 'officer', 'executive', 'business', 'meeting'].concat(filtered)) {
      if (w && !merged.includes(w)) merged.push(w);
    }
  }

  // Hotel brand: keep "comfort" when paired with inn/hotel (Comfort Inn ≠ spa comfort)
  const brandSet = new Set(brandToks);
  const keepComfort = brandSet.has('comfort') && (merged.includes('inn') || merged.includes('hotel'));

  // Drop leading weak-alone words ONLY if not part of a preserved brand
  while (
    merged.length > 2 &&
    WEAK_ALONE.has(merged[0]) &&
    !(merged[0] === 'comfort' && keepComfort) &&
    !brandSet.has(merged[0])
  ) {
    merged.shift();
  }

  let out = merged.slice(0, 6);
  // If query is only weak words, force hotel/business booster from raw
  if (!out.length || out.every((w) => WEAK_ALONE.has(w) || STOPWORDS.has(w))) {
    out = boost.length ? boost.slice(0, 3) : ['editorial', 'photo'];
  }
  if (out.length === 1) return out[0];
  return out.join(' ');
}

/**
 * Title-first query for a section image: page topic wins, section is flavor.
 * Prevents section headings from hijacking ("massage comfort" off a hotel page).
 */
function deriveSectionImageQuery(pageTitle, sectionTitle) {
  const pageQ = deriveImageSearchQuery(pageTitle || '');
  const secRaw = String(sectionTitle || '').trim();
  if (!secRaw || /^(\(intro\)|FAQ|Sources|Bottom Line|Direct Answer|How We Ranked)/i.test(secRaw)) {
    return pageQ;
  }
  // Keep page brand/core first; append 1–2 distinctive section nouns that aren't weak
  const secToks = stripStopwords(stripYearTokens(tokenize(secRaw)))
    .map(normalizeNoun)
    .filter((w) => w.length > 2 && !WEAK_ALONE.has(w) && !pageQ.split(/\s+/).includes(w));
  const extra = secToks.slice(0, 2);
  const combined = (pageQ + (extra.length ? ' ' + extra.join(' ') : '')).trim();
  return combined.slice(0, 80) || pageQ;
}

/** Normalize query key for shared clone-family cache buckets. */
function queryCacheKey(slugOrTitle) {
  return deriveImageSearchQuery(slugOrTitle).replace(/\s+/g, ' ').trim().toLowerCase();
}

module.exports = {
  deriveImageSearchQuery,
  deriveSectionImageQuery,
  queryCacheKey,
  STOPWORDS,
  US_STATE_ABBRS,
  AMBIGUOUS_STATE,
  extractBrandPhrases,
  intentBoosters,
};
