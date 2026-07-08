// derive-image-search-query.js — slug/title → 2–4 noun Pexels search query.
// Clone-family pages (same core topic, different city) must normalize to the same query.

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
]);

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

function tokenize(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[?!.,;:()"']/g, ' ')
    .replace(/[_/]+/g, '-')
    .split(/[\s-]+/)
    .map(t => t.trim())
    .filter(Boolean);
}

function stripYearTokens(tokens) {
  return tokens.filter(t => !/^20[2-3]\d$/.test(t));
}

function stripStopwords(tokens) {
  return tokens.filter(t => !STOPWORDS.has(t) && t.length > 1);
}

/** Strip trailing city + US state abbrev (clone-family location suffix). */
function stripLocationSuffix(tokens) {
  const t = tokens.slice();
  while (t.length >= 2 && US_STATE_ABBRS.has(t[t.length - 1])) {
    t.pop(); // state
    if (t.length) t.pop(); // city (or city fragment — handles multi-word cities imperfectly)
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

/**
 * @param {string} slugOrTitle — URL slug or page title
 * @returns {string} 2–4 word search query
 */
function deriveImageSearchQuery(slugOrTitle) {
  let tokens = tokenize(slugOrTitle);
  tokens = stripYearTokens(tokens);
  tokens = stripLocationSuffix(tokens);
  tokens = stripStopwords(tokens);
  tokens = tokens.map(normalizeNoun);
  tokens = dedupeAdjacent(tokens);
  if (tokens.length > 4) tokens = tokens.slice(0, 4);
  if (tokens.length < 2 && tokens.length === 1) return tokens[0];
  if (tokens.length >= 2) return tokens.slice(0, Math.min(4, Math.max(2, tokens.length))).join(' ');
  return String(slugOrTitle || '').trim().slice(0, 40) || 'editorial photo';
}

/** Normalize query key for shared clone-family cache buckets. */
function queryCacheKey(slugOrTitle) {
  return deriveImageSearchQuery(slugOrTitle).replace(/\s+/g, ' ').trim().toLowerCase();
}

module.exports = { deriveImageSearchQuery, queryCacheKey, STOPWORDS, US_STATE_ABBRS };
