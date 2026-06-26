// Build ~500 deduped dining/restaurant SEO keyword phrases → _dn_keyword_phrases.json
// Formula: [Occasion/Need] + [Cuisine/Dish] + [Setting/Vibe] + [Location]
// Usage: node _dn_build_keyword_phrases.js
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '_dn_keyword_phrases.json');

const GEO = [
  'Maryland',
  'Baltimore',
  'Annapolis',
  'Washington DC',
  'Stevensville',
  'Chesapeake Bay',
  'East Coast',
  'Inner Harbor Baltimore',
  'Fells Point Baltimore',
  'Georgetown Washington DC',
  'Eastern Shore Maryland',
  '[City]',
  '[Neighborhood]',
];

const CUISINES = [
  'Italian',
  'Mexican',
  'Thai',
  'Japanese',
  'Indian',
  'Chinese',
  'Korean',
  'Vietnamese',
  'Mediterranean',
  'French',
  'Greek',
  'Spanish',
  'Ethiopian',
  'Peruvian',
  'Cajun',
  'Southern',
  'BBQ',
  'Seafood',
  'Steakhouse',
  'Pizza',
];

const DISHES = [
  'crab cakes',
  'oysters',
  'sushi',
  'ramen',
  'tacos',
  'brunch',
  'pizza',
  'burgers',
  'pasta',
  'steak',
  'lobster',
  'dim sum',
  'pho',
  'tapas',
  'fried chicken',
];

const VIBES = [
  'live jazz',
  'lake views',
  'rooftop dining',
  'waterfront patio',
  'outdoor seating',
  'fireplace dining',
  'chef\'s table',
  'wine bar',
  'craft cocktails',
  'farm-to-table',
  'historic building',
  'dog-friendly patio',
  'solo traveler friendly',
  'digital nomad friendly',
  'live music',
  'sunset views',
  'romantic ambiance',
  'hidden gem',
  'celebrity chef',
  'tasting menu',
];

function dedupe(phrases) {
  const seen = new Set();
  const out = [];
  for (const p of phrases) {
    const n = String(p).replace(/\s+/g, ' ').trim();
    if (!n) continue;
    const key = n.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(n);
  }
  return out;
}

// ── 1–100 Intent-Based (10 need categories × 10 phrases) ──
function sectionIntent() {
  const cats = {
    Business: [
      'Best business lunch restaurants in {loc}',
      'Private dining rooms for corporate events in {loc}',
      'Power lunch spots near downtown {loc}',
      'Client dinner restaurants in {loc}',
      'Best steakhouse for business meetings in {loc}',
      'Quiet restaurants for working lunch in {loc}',
      'Hotel restaurants for business travelers in {loc}',
      'Group-friendly team dinner restaurants in {loc}',
      'Best waterfront business lunch in {loc}',
      'Conference lunch catering restaurants near {loc}',
    ],
    Date: [
      'Romantic date night restaurants in {loc}',
      'Best candlelit dinner spots in {loc}',
      'Intimate wine bars for date night in {loc}',
      'Rooftop restaurants for couples in {loc}',
      'Best anniversary dinner restaurants in {loc}',
      'Cozy bistro date night spots in {loc}',
      'Sunset dinner restaurants in {loc}',
      'Upscale date night sushi in {loc}',
      'Hidden gem romantic restaurants in {loc}',
      'Best prix fixe date night menus in {loc}',
    ],
    Family: [
      'Family-friendly restaurants with playgrounds in {loc}',
      'Kid-friendly brunch spots in {loc}',
      'Best restaurants with high chairs in {loc}',
      'Casual family dinner restaurants in {loc}',
      'Restaurants with kids menu in {loc}',
      'Best pizza for families in {loc}',
      'Family seafood restaurants in {loc}',
      'Birthday party restaurants for kids in {loc}',
      'Large table group dining for families in {loc}',
      'Best Sunday brunch for families in {loc}',
    ],
    Solo: [
      'Best restaurants for solo diners in {loc}',
      'Counter seating restaurants in {loc}',
      'Solo-friendly sushi bars in {loc}',
      'Best lunch spots for solo travelers in {loc}',
      'Bar seating restaurants in {loc}',
      'Solo diner ramen shops in {loc}',
      'Best cafes for solo work and lunch in {loc}',
      'Comfortable solo dining bistros in {loc}',
      'Best omakase for solo diners in {loc}',
      'Solo traveler friendly restaurants in {loc}',
    ],
    Quick: [
      'Best quick lunch spots in {loc}',
      'Fast casual restaurants in {loc}',
      'Grab and go lunch near {loc}',
      'Best sandwich shops in {loc}',
      'Quick healthy lunch in {loc}',
      'Best food hall lunch in {loc}',
      'Fast breakfast spots in {loc}',
      'Best takeout lunch in {loc}',
      'Quick service restaurants downtown {loc}',
      'Best lunch under 30 minutes in {loc}',
    ],
    Luxury: [
      'Best fine dining in {loc}',
      'Michelin-worthy restaurants in {loc}',
      'Upscale tasting menu restaurants in {loc}',
      'Best luxury steakhouse in {loc}',
      'Chef-driven fine dining in {loc}',
      'Best wine pairing dinners in {loc}',
      'White tablecloth restaurants in {loc}',
      'Best omakase fine dining in {loc}',
      'Luxury seafood restaurants in {loc}',
      'Best special occasion fine dining in {loc}',
    ],
    Healthy: [
      'Healthy restaurant options in {loc}',
      'Farm-to-table restaurants in {loc}',
      'Best salad and grain bowl spots in {loc}',
      'Organic restaurants in {loc}',
      'Vegan-friendly restaurants in {loc}',
      'Gluten-free friendly restaurants in {loc}',
      'Best juice and smoothie cafes in {loc}',
      'Plant-based dining in {loc}',
      'Clean eating restaurants in {loc}',
      'Best Mediterranean healthy dining in {loc}',
    ],
    Late: [
      'Best late night food in {loc}',
      '24 hour restaurants in {loc}',
      'Late night pizza in {loc}',
      'After-hours diners in {loc}',
      'Best midnight snacks in {loc}',
      'Late night tacos in {loc}',
      'Bars with kitchen open late in {loc}',
      'Best post-concert late dinner in {loc}',
      'Late night ramen in {loc}',
      'Best food after midnight in {loc}',
    ],
    Event: [
      'Best restaurants for birthday dinners in {loc}',
      'Group dining venues in {loc}',
      'Private event restaurants in {loc}',
      'Best rehearsal dinner restaurants in {loc}',
      'Graduation dinner restaurants in {loc}',
      'Best restaurants for large parties in {loc}',
      'Banquet hall restaurants in {loc}',
      'Best celebration dinner spots in {loc}',
      'Corporate event catering restaurants in {loc}',
      'Best holiday dinner restaurants in {loc}',
    ],
    Ethnic: [],
  };

  const ethnicTemplates = [
    'Best authentic {cuisine} restaurants in {loc}',
    'Top {cuisine} food near {loc}',
    'Hidden gem {cuisine} restaurants in {loc}',
    'Best {cuisine} lunch in {loc}',
    'Family-owned {cuisine} restaurants in {loc}',
  ];
  const ethnicLocs = ['Baltimore', 'Washington DC', 'Annapolis', '[City]', '[Neighborhood]'];
  const ethnicCuisines = CUISINES.slice(0, 10);
  for (const cuisine of ethnicCuisines) {
    for (const tmpl of ethnicTemplates) {
      for (const loc of ethnicLocs.slice(0, 2)) {
        cats.Ethnic.push(tmpl.replace('{cuisine}', cuisine).replace('{loc}', loc));
      }
    }
  }

  const phrases = [];
  const locCycle = ['Baltimore', 'Washington DC', 'Annapolis', 'Maryland', 'Chesapeake Bay', '[City]', '[Neighborhood]', 'Stevensville', 'East Coast', 'Inner Harbor Baltimore'];
  let li = 0;
  for (const templates of Object.values(cats)) {
    for (const tmpl of templates.slice(0, 10)) {
      const loc = locCycle[li % locCycle.length];
      li += 1;
      phrases.push(tmpl.replace(/\{loc\}/g, loc));
    }
  }
  return phrases;
}

// ── 101–200 Geo-Modifier ──
function sectionGeo() {
  const patterns = [
    'Best restaurants in {geo}',
    'Top dining in {geo}',
    'Where to eat in {geo}',
    'Best brunch in {geo}',
    'Best dinner restaurants in {geo}',
    'Best seafood restaurants in {geo}',
    'Best new restaurants in {geo}',
    'Restaurant guide for {geo}',
    'Best local food in {geo}',
    'Must-try restaurants in {geo}',
  ];
  const phrases = [];
  for (const geo of GEO) {
    for (const pat of patterns) {
      phrases.push(pat.replace('{geo}', geo));
    }
  }
  const extras = [
    'Restaurants near Baltimore Inner Harbor',
    'Dining near Annapolis City Dock',
    'Best restaurants walking distance Georgetown',
    'Chesapeake Bay crab house trail',
    'Maryland blue crab restaurants ranked',
    'East Coast seafood dining guide',
    'Restaurants near Reagan National Airport',
    'Restaurants near BWI Airport',
    'Waterfront dining Chesapeake Bay Maryland',
    'Historic district restaurants Annapolis',
    'Best restaurants Old Town Alexandria',
    'Dining near National Mall Washington DC',
    'Kent Island restaurants Stevensville MD',
    'Eastern Shore Maryland seafood trail',
    'Best restaurants near [City] convention center',
    'Neighborhood brunch guide [Neighborhood] [City]',
    'Best happy hour [Neighborhood] [City]',
    'Late night eats downtown [City]',
    'Best rooftop bars [City] [Neighborhood]',
    'Farm-to-table restaurants near [City]',
  ];
  return phrases.concat(extras);
}

// ── 201–300 Vibe & Experience ──
function sectionVibe() {
  const phrases = [];
  const locs = GEO.slice(0, 10);
  for (const vibe of VIBES) {
    for (const loc of locs.slice(0, 5)) {
      phrases.push(`Restaurants with ${vibe} in ${loc}`);
    }
  }
  const dishVibes = [
    'Best {dish} with outdoor seating in {loc}',
    'Top {dish} spots with live music in {loc}',
    'Hidden gem {dish} restaurants in {loc}',
    'Best {dish} for special occasions in {loc}',
  ];
  for (const dish of DISHES.slice(0, 10)) {
    for (const tmpl of dishVibes) {
      phrases.push(tmpl.replace('{dish}', dish).replace('{loc}', 'Baltimore'));
      phrases.push(tmpl.replace('{dish}', dish).replace('{loc}', '[City]'));
    }
  }
  return phrases;
}

// ── 301–500 Long-tail How-To ──
function sectionHowTo() {
  const howTos = [
    'How to book hard-to-get restaurant reservations in {loc}',
    'Restaurant tipping guide in {loc}',
    'How much to tip at restaurants in Maryland',
    'Best time to make dinner reservations in {loc}',
    'How to get a walk-in table on weekends in {loc}',
    'Restaurant dress code guide {loc}',
    'How to plan a food tour in {loc}',
    'Weekend brunch reservation tips {loc}',
    'How to find gluten-free restaurants in {loc}',
    'Vegetarian dining guide {loc}',
    'Vegan restaurant guide {loc}',
    'Nut allergy safe restaurants {loc}',
    'Best restaurants for dairy-free dining {loc}',
    'Kosher restaurant options near {loc}',
    'Halal restaurant guide {loc}',
    'How to choose a restaurant for a large group in {loc}',
    'Best restaurants for outdoor dining season {loc}',
    'How to read a restaurant menu prices in {loc}',
    'Happy hour deals guide {loc}',
    'Best food festivals and restaurant weeks {loc}',
    'How to split the bill at restaurants etiquette',
    'Best apps for restaurant reservations {loc}',
    'OpenTable vs Resy best restaurants {loc}',
    'How to find kid-friendly restaurants in {loc}',
    'Best restaurants with parking in {loc}',
    'Public transit accessible restaurants {loc}',
    'Wheelchair accessible restaurants {loc}',
    'Pet-friendly patio dining guide {loc}',
    'Best restaurants for first dates in {loc}',
    'How to plan a birthday dinner restaurant in {loc}',
    'Anniversary dinner planning guide {loc}',
    'Best pre-theater dinner restaurants {loc}',
    'Post-game dinner spots near stadium {loc}',
    'Best airport layover food near {loc}',
    'Hotel concierge restaurant picks {loc}',
    'Local food blogger favorite restaurants {loc}',
    'Best seasonal menu restaurants {loc}',
    'How to find chef tasting menus in {loc}',
    'Wine list beginner guide restaurants {loc}',
    'Best cocktail bar restaurants {loc}',
  ];
  const phrases = [];
  for (const loc of GEO) {
    for (const tmpl of howTos) {
      phrases.push(tmpl.replace('{loc}', loc));
    }
  }
  const cuisineHowTos = [
    'Where to find authentic {cuisine} food in {loc}',
    'Best {cuisine} restaurants for beginners in {loc}',
    'How to order at a {cuisine} restaurant in {loc}',
    '{cuisine} restaurant etiquette guide {loc}',
  ];
  for (const cuisine of CUISINES) {
    for (const tmpl of cuisineHowTos) {
      phrases.push(tmpl.replace('{cuisine}', cuisine).replace('{loc}', 'Baltimore'));
      phrases.push(tmpl.replace('{cuisine}', cuisine).replace('{loc}', '[City]'));
    }
  }
  return phrases;
}

function padToTarget(phrases, target = 500) {
  const fillers = [
    'Top 10 restaurants in {loc} ranked',
    'Best Overall restaurant picks {loc}',
    'Best Value restaurants {loc}',
    'Pulse Dining restaurant rankings {loc}',
    'Local restaurant reviews {loc}',
    'Best restaurants open now {loc}',
    'Trending restaurants {loc} 2027',
    'New restaurant openings {loc}',
    'Best lunch deals {loc}',
    'Best dinner deals {loc}',
  ];
  let i = 0;
  while (phrases.length < target) {
    const loc = GEO[i % GEO.length];
    const tmpl = fillers[i % fillers.length];
    phrases.push(tmpl.replace('{loc}', loc));
    i += 1;
  }
  return phrases.slice(0, target);
}

const s1 = sectionIntent();
const s2 = sectionGeo();
const s3 = sectionVibe();
const s4 = sectionHowTo();

let all = dedupe([...s1, ...s2, ...s3, ...s4]);
all = padToTarget(all, 500);

const report = {
  total: all.length,
  sections: {
    intentTarget: '1-100',
    geoTarget: '101-200',
    vibeTarget: '201-300',
    howToTarget: '301-500',
    intentSeed: s1.length,
    geoSeed: s2.length,
    vibeSeed: s3.length,
    howToSeed: s4.length,
  },
};

fs.writeFileSync(OUT, JSON.stringify(all, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
console.log('Wrote', OUT, 'phrases=', all.length);
console.log('Sample:', all.slice(0, 5));
console.log('Sample tail:', all.slice(-3));
