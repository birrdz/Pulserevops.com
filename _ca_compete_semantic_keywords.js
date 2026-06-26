// Pulse Cars — semantic search + FAQ-style "compete" keywords for ca#### entries.
// Target question-shaped queries (People Also Ask / FAQ schema), not bare head terms.
// Applied via _ca_seo_optimize.js + cars.html hub sync.

const {
  MODEL_VARIATIONS_BY_BODY,
  MODEL_COUNT,
  BODY_TYPE_LABELS,
  allModelsFlat,
  modelsMatchingText,
  modelTypeDecadeKeywords,
  hubModelItemListJsonLd,
  slugifyModel,
} = require('./_ca_model_variations_200');

const CA_HUB_URL = 'https://pulserevops.com/cars';
const CA_HUB_PAGE = 'cars.html';
const CA_STATIC_URLS = [CA_HUB_URL];

/**
 * Hub FAQPage JSON-LD — question-shaped queries for semantic / PAA search.
 * Each pair becomes a schema.org Question in cars.html structured data.
 */
const SEMANTIC_FAQ_HUB_SCHEMA = [
  {
    q: 'What is the best used SUV under $10,000?',
    a: 'Pulse Cars ranks the top 10 used SUVs under $10,000 with Best Overall and Best Value picks, real prices, reliability notes, and a buyer decision tree for 2027.',
  },
  {
    q: 'What is the best used SUV under $15,000?',
    a: 'See ranked Top-10 used SUVs under $15,000 on Pulse Cars — mid-size and compact crossovers compared by price, mpg, safety, and ownership cost.',
  },
  {
    q: 'What is the best used SUV under $20,000?',
    a: 'Pulse Cars Top-10 lists the best used SUVs under $20,000 with 3-row, AWD, and hybrid options called out for families and commuters.',
  },
  {
    q: 'What is the best used sedan under $10,000?',
    a: 'Top-10 used sedans under $10,000 on Pulse Cars rank reliability, fuel economy, insurance cost, and daily-driver comfort with Best Overall + Best Value.',
  },
  {
    q: 'What is the best used truck under $10,000?',
    a: 'Pulse Cars compares the best used pickup trucks under $10,000 for towing, bed length, cab size, and long-term maintenance cost.',
  },
  {
    q: 'What is the best used car for families?',
    a: 'Family-focused Pulse Cars rankings cover 3-row SUVs, minivans, and wagons with cargo space, safety ratings, and child-seat-friendly layouts.',
  },
  {
    q: 'What is the best used car for commuting?',
    a: 'Commuter picks on Pulse Cars emphasize mpg, comfort, reliability, and low cost per mile for highway and city driving.',
  },
  {
    q: 'What is the best used car for snow and winter driving?',
    a: 'AWD and FWD used cars ranked for snow include ground clearance, winter tire fitment, and traction system notes from Pulse Cars.',
  },
  {
    q: 'What is the best used car for first-time buyers?',
    a: 'First-time buyer guides on Pulse Cars focus on affordable insurance, simple maintenance, and models with strong reliability records.',
  },
  {
    q: 'What are the most reliable used SUVs?',
    a: 'Pulse Cars Top-10 reliability lists use owner-reported data, recall history, and common failure points for used SUV shoppers.',
  },
  {
    q: 'Which used cars hold their value best?',
    a: 'Resale-value rankings on Pulse Cars highlight trucks, hybrids, and Japanese SUVs that depreciate slowly in the used market.',
  },
  {
    q: 'Which used cars are cheapest to insure?',
    a: 'Insurance-friendly used cars on Pulse Cars favor lower theft rates, moderate repair costs, and strong safety scores.',
  },
  {
    q: 'Which used cars get the best gas mileage?',
    a: 'Fuel-economy leaders in Pulse Cars rankings include hybrids, compact sedans, and efficient crossovers with EPA mpg context.',
  },
  {
    q: 'How much should I spend on a used car in 2027?',
    a: 'Pulse Cars budget guidance maps price bands ($10k / $15k / $20k) to vehicle classes and what buyers should expect at each tier.',
  },
  {
    q: 'How many miles is too many on a used car?',
    a: 'Mileage thresholds by model year and powertrain are explained in Pulse Cars buyer FAQs and Top-10 reliability notes.',
  },
  {
    q: 'Should I buy certified pre-owned or used?',
    a: 'Pulse Cars compares CPO warranty premiums vs independent inspection savings for budget-conscious used buyers.',
  },
  {
    q: 'Is a used hybrid worth it?',
    a: 'Hybrid used-car rankings on Pulse Cars weigh battery age, mpg payoff, and models with proven hybrid durability.',
  },
  {
    q: 'Is a used electric car worth it under $20,000?',
    a: 'Used EV Top-10 lists cover battery health, range, charging speed, and depreciation for affordable electric cars.',
  },
  {
    q: 'What is the difference between Best Overall and Best Value on Pulse Cars?',
    a: 'Best Overall is the top-ranked pick for most shoppers; Best Value is the smartest buy when price, mpg, and reliability matter most.',
  },
  {
    q: 'What are the best used minivans for families?',
    a: 'Pulse Cars ranks used minivans by sliding doors, third-row access, cargo volume, and long-trip comfort.',
  },
  {
    q: 'What are the best used electric SUVs?',
    a: 'Used electric SUV Top-10 rankings compare range, charging networks, and real-world ownership cost.',
  },
  {
    q: 'What are the best used hybrid cars?',
    a: 'Hybrid Top-10 lists on Pulse Cars cover sedans and SUVs with strong mpg and lower fuel spend for commuters.',
  },
  {
    q: 'What used car has the most legroom for tall drivers?',
    a: 'Pulse Cars calls out headroom and legroom leaders in full-size sedans, mid-size SUVs, and trucks for tall drivers.',
  },
  {
    q: 'What is the best used truck for towing?',
    a: 'Towing-capable used trucks are ranked by payload, hitch rating, and powertrain durability on Pulse Cars.',
  },
  {
    q: 'What to look for when buying a used car?',
    a: 'Pulse Cars buyer checklists cover title history, rust, service records, test-drive items, and negotiation anchors.',
  },
];

/** Hub meta + JSON-LD display phrases (human-readable questions + labels) */
const COMPETE_DISPLAY_KEYWORDS = [
  'Semantic Search: Car Buying FAQ',
  'Pulse Cars FAQ structured data',
  'Pulse Cars semantic search optimization',
  'Pulse Cars Top-10 Rankings',
  'What is the best used SUV under $10,000',
  'What is the best used SUV under $15000',
  'What is the best used SUV under $20000',
  'What is the best used sedan under $10,000',
  'What is the best used truck under $10,000',
  'What is the best used car for families',
  'What is the best used car for commuting',
  'What is the best used car for snow',
  'What is the best used car for tall drivers',
  'What is the best used car for first-time buyers',
  'What is the best used electric car under $15000',
  'What is the best used hybrid under $10000',
  'What are the most reliable used SUVs',
  'What are the most reliable used sedans',
  'What are the most reliable used trucks',
  'Which used cars hold their value best',
  'Which used cars have the best resale value',
  'Which used cars are cheapest to insure',
  'Which used cars have the lowest maintenance cost',
  'Which used cars get the best gas mileage',
  'Which used SUVs get the best mpg',
  'Which used cars are best for highway driving',
  'Which used cars are best for city driving',
  'Which used cars are best for winter driving',
  'Which used cars are best for towing',
  'Which used cars have the best safety ratings',
  'Which used cars have the most legroom',
  'Which used SUVs have third-row seating',
  'Which used cars are best for off-road',
  'Which used AWD cars are best in snow',
  'How much should I spend on a used car in 2027',
  'How many miles is too many on a used car',
  'What year used car is the best value',
  'Is it worth buying a used luxury car',
  'Is a used hybrid worth it',
  'Is a used electric car worth it under $20000',
  'Should I buy a used SUV or sedan',
  'Should I buy certified pre-owned or used',
  'What to look for when buying a used car',
  'What is a good price for a used car',
  'What is the best overall used SUV',
  'What is the best value used SUV',
  'Best Overall vs Best Value used car',
  'Top 10 used SUVs 2027 ranked',
  'Top 10 used sedans 2027 ranked',
  'Top 10 used pickup trucks 2027 ranked',
  'Top 10 mid-size SUVs 2027 best overall',
  'Top 10 compact SUVs 2027 best value',
  'Top 10 electric SUVs 2027 ranked',
  'Top 10 hybrid cars 2027 ranked',
  'Best used minivan for families',
  'Best used hatchback for city driving',
  'Best used wagon under $15000',
  'Best used sports car under $10000',
  'Best used convertible under $15000',
  'Best used 3-row SUV under $20000',
  'Best used compact SUV under $10000',
  'Best used full-size SUV under $20000',
  'Best used crossover under $15000',
  'Best used off-road SUV under $15000',
  'Best used family car under $10000',
  'Best used truck for towing under $20000',
  'Best used car for college students',
  'Best used car for seniors',
  'Best used car for teen drivers',
  'Best used car for rideshare drivers',
  'Best used car for delivery drivers',
  'Best used car for long road trips',
  'Best used car for camping',
  'Best used car for dog owners',
  'Best used car for snowy climates',
  'Best used car for hot climates',
  'Best used car with Apple CarPlay',
  'Best used car with Android Auto',
  'Best used car with backup camera',
  'Best used car with blind spot monitoring',
  'Best used car with adaptive cruise control',
  'Best used car with ventilated seats',
  'Best used quiet luxury sedan',
  'Best used performance sedan under $40000',
  'Best used plug-in hybrid SUV',
  'Best used diesel SUV',
  'Best used electric truck',
  'Best used hybrid truck',
  'Car and Driver used car rankings',
  'Edmunds used car recommendations',
  'Kelley Blue Book best used cars',
  'IIHS safety ratings used cars',
  'EPA fuel economy used cars comparison',
  'Used car buyer decision tree',
  'Used car FAQ for shoppers',
  'Pulse Cars review',
  'Pulse Cars reviews',
  'Pulse Cars rating',
  'Pulse Cars comparison',
  'car review 2027',
  'SUV review 2027',
  'truck review 2027',
  'sedan review 2027',
  'best of 2027 cars',
  '200 Automotive Variations: Model, Type, and Decade',
  '200 automotive model variations by body style',
  'How do you choose the best used car under a budget',
  'How do you compare Best Overall vs Best Value used cars',
  'How do you find a reliable used SUV',
  'How do you know if a used car price is fair',
  'How do you inspect a used car before buying',
  'How do you negotiate a used car price',
  'How do you finance a used car in 2027',
  'What used cars have the fewest problems',
  'What used cars last the longest',
  'What used SUVs are best for third-row seating',
  'What used cars are best for Uber and Lyft drivers',
  'What used cars are best for new drivers',
  'What used luxury cars are worth buying',
  'What used sports cars are reliable',
  'What used wagons are still practical',
  'What used hatchbacks are best for city parking',
  'What used diesel trucks are worth owning',
  'What used plug-in hybrids make sense',
  'Which decade of used cars is the sweet spot',
  'Which used car brands are most reliable',
  'Which used SUVs are best for road trips',
  'Which used sedans are quietest on the highway',
  'Which used trucks have the best resale',
  'Which used EVs have the best range per dollar',
  ...SEMANTIC_FAQ_HUB_SCHEMA.map((x) => x.q.replace(/\?+$/, '')),
];

/** Slug tags merged into every ca#### blob */
const GLOBAL_TAGS = [
  'pulse-cars',
  'car-review',
  'top-10',
  'vehicle',
  'auto',
  'best-of-2027',
  'semantic-search-faq',
  'car-buying-faq',
  'used-car-rankings',
  'best-overall-best-value',
];

/** Question clusters → slug tags (semantic / PAA shaped) */
const KEYWORDS_BY_CATEGORY = {
  semanticFaq: [
    'what-is-the-best-used-suv-under-10000',
    'what-is-the-best-used-sedan-under-10000',
    'what-is-the-best-used-truck-under-10000',
    'what-is-the-best-used-car-for-families',
    'what-is-the-best-used-car-for-commuting',
    'what-is-the-best-used-car-for-snow',
    'what-is-the-best-used-car-for-first-time-buyers',
    'what-are-the-most-reliable-used-suvs',
    'what-are-the-most-reliable-used-sedans',
    'what-are-the-most-reliable-used-trucks',
    'which-used-cars-hold-their-value-best',
    'which-used-cars-are-cheapest-to-insure',
    'which-used-cars-get-the-best-gas-mileage',
    'which-used-cars-have-the-best-safety-ratings',
    'how-much-should-i-spend-on-a-used-car',
    'how-many-miles-is-too-many-on-a-used-car',
    'what-to-look-for-when-buying-a-used-car',
    'should-i-buy-certified-pre-owned-or-used',
    'is-a-used-hybrid-worth-it',
    'is-a-used-electric-car-worth-it',
    'best-overall-vs-best-value-used-car',
    'used-car-buyer-faq',
    'used-car-decision-tree',
  ],
  budgetUsed: [
    'best-used-suvs-under-10000',
    'best-used-suvs-under-15000',
    'best-used-suvs-under-20000',
    'best-used-sedans-under-10000',
    'best-used-sedans-under-15000',
    'best-used-sedans-under-20000',
    'best-used-trucks-under-10000',
    'best-used-trucks-under-15000',
    'best-used-trucks-under-20000',
    'best-used-minivans-under-10000',
    'best-used-hatchbacks-under-10000',
    'best-used-hybrid-cars-under-10000',
    'best-used-electric-cars-under-15000',
    'best-used-luxury-cars-under-10000',
    'best-used-sports-cars-under-10000',
    'best-used-awd-cars-under-10000',
    'best-used-3-row-suvs-under-15000',
    'best-used-compact-suvs-under-10000',
    'best-used-crossovers-under-15000',
    'best-used-wagons-under-15000',
  ],
  useCase: [
    'best-cars-for-families',
    'best-cars-for-commuting',
    'best-cars-for-snow',
    'best-cars-for-winter-driving',
    'best-cars-for-towing',
    'best-cars-for-highway-driving',
    'best-cars-for-city-driving',
    'best-cars-for-first-time-buyers',
    'best-cars-for-teen-drivers',
    'best-cars-for-college-students',
    'best-cars-for-tall-drivers',
    'best-cars-for-off-road',
    'best-cars-for-long-road-trips',
    'best-cars-for-rideshare-drivers',
    'best-awd-sedans-for-snow',
    'best-off-road-suvs',
    'best-family-cars',
  ],
  attributes: [
    'most-reliable-suvs',
    'most-reliable-sedans',
    'most-reliable-trucks',
    'best-cars-for-gas-mileage',
    'best-fuel-efficient-suvs',
    'best-cars-that-hold-their-value',
    'best-cars-with-best-resale-value',
    'best-cheap-to-insure-cars',
    'best-low-maintenance-cars',
    'best-cars-with-best-safety-ratings',
    'best-cars-with-third-row-seating',
    'best-long-range-electric-cars',
    'best-affordable-electric-cars',
    'best-plug-in-hybrid-suvs',
    'best-hybrid-trucks',
    'best-electric-trucks',
  ],
  top10Class: [
    'top-10-mid-size-suvs',
    'top-10-compact-suvs',
    'top-10-full-size-suvs',
    'top-10-mid-size-sedans',
    'top-10-full-size-pickup-trucks',
    'top-10-electric-suvs',
    'top-10-hybrid-suvs',
    'top-10-minivans',
    'top-10-luxury-suvs',
    'top-10-sports-cars',
    'best-overall-best-value',
  ],
  sources: [
    'car-and-driver-rankings',
    'motortrend-reviews',
    'edmunds-used-car-guide',
    'kbb-best-used-cars',
    'us-news-car-rankings',
    'iihs-safety-ratings',
    'epa-fuel-economy',
    'nhtsa-safety',
  ],
  modelVariations: Object.keys(MODEL_VARIATIONS_BY_BODY).map((k) => slugifyModel(k)),
};

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function keywordsFromTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  const rules = [
    [/\$10,?000|\$10000|under 10/, KEYWORDS_BY_CATEGORY.budgetUsed.slice(0, 8)],
    [/\$15,?000|\$15000|under 15/, KEYWORDS_BY_CATEGORY.budgetUsed.slice(0, 12)],
    [/\$20,?000|\$20000|under 20/, KEYWORDS_BY_CATEGORY.budgetUsed],
    [/used.*suv|suv.*used|best used suv/, KEYWORDS_BY_CATEGORY.budgetUsed.filter((k) => k.includes('suv'))],
    [/used.*sedan|sedan.*used/, KEYWORDS_BY_CATEGORY.budgetUsed.filter((k) => k.includes('sedan'))],
    [/used.*truck|pickup|truck.*used/, KEYWORDS_BY_CATEGORY.budgetUsed.filter((k) => k.includes('truck'))],
    [/minivan|hatchback|wagon|coup|convertible|crossover|compact suv|3-row|full-size|off-road|awd|electric|hybrid|luxury|sports/, KEYWORDS_BY_CATEGORY.budgetUsed],
    [/famil|commut|snow|winter|tow|highway|city|first-time|teen|college|tall|off-road|rideshare|delivery|road trip|camp|dog|senior/, KEYWORDS_BY_CATEGORY.useCase],
    [/reliable|gas mileage|mpg|resale|value|insure|maintenance|safety|third-row|legroom|long-range|plug-in|diesel/, KEYWORDS_BY_CATEGORY.attributes],
    [/top 10|best overall|best value/, KEYWORDS_BY_CATEGORY.top10Class],
    [/ranked|\(ranked\)/, KEYWORDS_BY_CATEGORY.semanticFaq],
  ];
  for (const [re, pool] of rules) {
    if (re.test(t)) hits.push(...pool.slice(0, 6));
  }
  if (!hits.length) hits.push(...KEYWORDS_BY_CATEGORY.semanticFaq.slice(0, 4));
  return hits;
}

function tagsForEntry(id, question, existingTags = []) {
  const base = [...GLOBAL_TAGS, ...(existingTags || [])];
  const extra = keywordsFromTitle(question);
  const modelHits = modelsMatchingText(question);
  const merged = [
    ...base,
    ...extra,
    ...modelHits,
    ...KEYWORDS_BY_CATEGORY.sources.slice(0, 2),
  ];
  return Array.from(new Set(merged.map(slugify).filter(Boolean)));
}

function allKeywordsFlat() {
  return Array.from(
    new Set([
      ...GLOBAL_TAGS,
      ...Object.values(KEYWORDS_BY_CATEGORY).flat(),
      ...allModelsFlat().map(slugifyModel),
    ].map(slugify))
  );
}

function hubDisplayKeywords() {
  const bodyLabels = Object.values(BODY_TYPE_LABELS).map((label) => `Body Style: ${label}`);
  const modelPhrases = modelTypeDecadeKeywords();
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS,
      ...bodyLabels,
      ...modelPhrases,
    ].map((s) => String(s).trim()).filter(Boolean))
  );
}

/** Meta keywords cap — full list lives in FAQPage JSON-LD */
function hubMetaKeywords(max = 48) {
  return hubDisplayKeywords().slice(0, max);
}

/** Match entry title → semantic FAQ questions for per-page meta + blob storage */
function semanticFaqForTitle(title) {
  const t = String(title || '').toLowerCase();
  const hits = [];
  for (const row of SEMANTIC_FAQ_HUB_SCHEMA) {
    const q = row.q.toLowerCase();
    const tokens = q.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
    const overlap = tokens.filter((w) => t.includes(w)).length;
    if (overlap >= 3 || (/\$?\d{1,2},?\d{3}/.test(t) && /\$?\d{1,2},?\d{3}/.test(q) && overlap >= 2)) {
      hits.push(row.q.replace(/\?+$/, ''));
    }
  }
  if (/suv|crossover/i.test(t)) hits.push('What are the most reliable used SUVs');
  if (/sedan/i.test(t)) hits.push('What are the most reliable used sedans');
  if (/truck|pickup/i.test(t)) hits.push('What are the most reliable used trucks');
  if (/hybrid/i.test(t)) hits.push('Is a used hybrid worth it');
  if (/electric|ev\b/i.test(t)) hits.push('Is a used electric car worth it under $20,000');
  if (/famil|minivan|3-row/i.test(t)) hits.push('What is the best used car for families');
  if (/commut/i.test(t)) hits.push('What is the best used car for commuting');
  if (/snow|winter|awd/i.test(t)) hits.push('What is the best used car for snow and winter driving');
  if (/ranked|top 10|best overall/i.test(t)) hits.push('What is the difference between Best Overall and Best Value on Pulse Cars');
  if (!hits.length) hits.push(...SEMANTIC_FAQ_HUB_SCHEMA.slice(0, 4).map((r) => r.q.replace(/\?+$/, '')));
  return Array.from(new Set(hits)).slice(0, 12);
}

function hubFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${CA_HUB_URL}#faq`,
    mainEntity: SEMANTIC_FAQ_HUB_SCHEMA.map((row) => ({
      '@type': 'Question',
      name: row.q,
      acceptedAnswer: { '@type': 'Answer', text: row.a },
    })),
  };
}

function entrySeoBrandKeywords(question) {
  return Array.from(
    new Set([
      ...COMPETE_DISPLAY_KEYWORDS.slice(0, 24),
      ...semanticFaqForTitle(question),
      'Pulse Cars review',
      'Pulse Cars rankings',
      'Pulse Cars comparison',
    ])
  );
}

module.exports = {
  CA_HUB_URL,
  CA_HUB_PAGE,
  CA_STATIC_URLS,
  COMPETE_DISPLAY_KEYWORDS,
  SEMANTIC_FAQ_HUB_SCHEMA,
  GLOBAL_TAGS,
  KEYWORDS_BY_CATEGORY,
  MODEL_VARIATIONS_BY_BODY,
  MODEL_COUNT,
  BODY_TYPE_LABELS,
  tagsForEntry,
  allKeywordsFlat,
  hubDisplayKeywords,
  hubMetaKeywords,
  semanticFaqForTitle,
  hubFaqJsonLd,
  hubModelItemListJsonLd,
  entrySeoBrandKeywords,
};
