// Pillar SEO specs — HF → Wellness grid (homepage order). 200 phrases each.
const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Dallas', 'Atlanta', 'Phoenix',
  'Philadelphia', 'San Diego', 'Denver', 'Seattle', 'Boston', 'Austin', 'Nashville', 'Charlotte',
  'Tampa', 'Orlando', 'Portland', 'Las Vegas', 'San Francisco', 'Detroit', 'Minneapolis', 'Raleigh',
];

function uniq(slice) {
  const s = [...new Set(slice.map((x) => String(x).trim()).filter(Boolean))];
  while (s.length < 200) {
    const i = s.length;
    s.push(s[i % Math.max(1, s.length - 1)] + ' 2027');
  }
  return s.slice(0, 200);
}

const PILLAR_SPECS = {
  hf: {
    prefix: 'hf',
    brand: 'Pulse Football Recruiting',
    hubPage: 'highschool-football-recruiting.html',
    hubUrl: 'https://pulserevops.com/highschool-football-recruiting',
    entryPath: '/highschool-football-recruiting/',
    hubDesc: 'Top-10 HS football recruiting rankings with Best Overall + Best Value picks for camps, coaches, and NIL prep.',
    globalTags: ['pulse-football-recruiting', 'hs-football-recruiting', 'football-recruiting', 'top-10', 'best-of-2027'],
    genPhrases() {
      const p = [];
      const topics = ['recruiting services', 'highlight editors', 'camp combines', '7v7 teams', 'training programs', 'NIL advisors', 'recruiting coordinators', 'QB trainers', 'WR trainers', 'OL trainers'];
      for (const t of topics) for (const c of CITIES.slice(0, 10)) p.push(`Best ${t} for high school football in ${c} 2027`);
      for (const t of topics) p.push(`Top 10 ${t} for D1 football recruiting 2027`);
      p.push('How to get recruited for college football 2027', 'Best football recruiting profile builders', 'Top HUDL highlight services for recruits', 'Best football camps for exposure 2027', 'How to email college coaches football recruiting');
      return uniq(p);
    },
  },
  ik: {
    prefix: 'ik',
    brand: 'Pulse Industry KPIs',
    hubPage: 'industry-kpis.html',
    hubUrl: 'https://pulserevops.com/industry-kpis',
    entryPath: '/industry-kpis/',
    hubDesc: 'Industry KPI benchmarks and Top-10 metric guides for operators and RevOps leaders.',
    globalTags: ['pulse-industry-kpis', 'industry-kpis', 'kpi-benchmarks', 'top-10', 'best-of-2027'],
    genPhrases() {
      const ind = ['SaaS', 'fintech', 'healthcare', 'manufacturing', 'logistics', 'retail', 'cybersecurity', 'AI', 'marketplace', 'prosumer'];
      const kpis = ['NRR', 'GRR', 'CAC payback', 'magic number', 'pipeline coverage', 'win rate', 'sales cycle', 'quota attainment', 'logo churn', 'expansion rate'];
      const p = [];
      for (const i of ind) for (const k of kpis) p.push(`What is a good ${k} for ${i} in 2027`);
      for (const i of ind) p.push(`Top 10 KPIs for ${i} companies 2027`);
      return uniq(p);
    },
  },
  lv: {
    prefix: 'lv',
    brand: 'Pulse Living',
    hubPage: 'living.html',
    hubUrl: 'https://pulserevops.com/living',
    entryPath: '/living/',
    hubDesc: 'Top-10 lifestyle and home rankings with Best Overall + Best Value picks.',
    globalTags: ['pulse-living', 'living', 'lifestyle', 'home', 'top-10', 'best-of-2027'],
    genPhrases() {
      const types = ['sofas', 'mattresses', 'desk chairs', 'standing desks', 'air purifiers', 'robot vacuums', 'kitchen appliances', 'smart home hubs', 'closet systems', 'outdoor furniture'];
      const p = [];
      for (const t of types) for (const c of CITIES.slice(0, 8)) p.push(`Best ${t} for modern living in ${c} 2027`);
      for (const t of types) p.push(`Top 10 ${t} for home 2027`);
      return uniq(p);
    },
  },
  mv: {
    prefix: 'mv',
    brand: 'Pulse Movies',
    hubPage: 'movies.html',
    hubUrl: 'https://pulserevops.com/movies',
    entryPath: '/movies/',
    hubDesc: 'Top-10 movie rankings by genre, decade, and mood with Best Overall + Best Value picks.',
    globalTags: ['pulse-movies', 'movies', 'film', 'top-10', 'best-of-2027'],
    genPhrases() {
      const genres = ['sci-fi', 'horror', 'comedy', 'drama', 'thriller', 'action', 'romance', 'documentary', 'animated', 'war'];
      const p = [];
      for (const g of genres) p.push(`Top 10 ${g} movies of all time 2027`, `Best ${g} movies on streaming 2027`, `Best ${g} movies 2020s ranked`);
      for (const g of genres) for (const d of ['1990s', '2000s', '2010s', '2020s']) p.push(`Top 10 ${g} movies from the ${d}`);
      return uniq(p);
    },
  },
  ra: {
    prefix: 'ra',
    brand: 'Pulse Revenue Architecture',
    hubPage: 'revenue-architecture.html',
    hubUrl: 'https://pulserevops.com/revenue-architecture',
    entryPath: '/revenue-architecture/',
    hubDesc: 'Revenue architecture blueprints and Top-10 GTM operating models by industry.',
    globalTags: ['pulse-revenue-architecture', 'revenue-architecture', 'gtm', 'top-10', 'best-of-2027'],
    genPhrases() {
      const ind = ['B2B SaaS', 'fintech', 'healthtech', 'manufacturing', 'marketplace', 'PLG', 'enterprise', 'mid-market'];
      const p = [];
      for (const i of ind) p.push(`Revenue architecture blueprint for ${i} 2027`, `Top 10 RevOps roles for ${i}`, `Best GTM model for ${i} 2027`);
      p.push('How to design revenue architecture for Series B', 'Sales and CS handoff revenue architecture', 'PLG to sales revenue architecture 2027');
      return uniq(p);
    },
  },
  sc: {
    prefix: 'sc',
    brand: 'Pulse Schools',
    hubPage: 'schools.html',
    hubUrl: 'https://pulserevops.com/schools',
    entryPath: '/schools/',
    hubDesc: 'Top-10 school and college rankings with Best Overall + Best Value picks.',
    globalTags: ['pulse-schools', 'schools', 'colleges', 'top-10', 'best-of-2027'],
    genPhrases() {
      const types = ['private high schools', 'public high schools', 'boarding schools', 'STEM high schools', 'liberal arts colleges', 'business schools', 'engineering schools', 'community colleges'];
      const p = [];
      for (const t of types) for (const c of CITIES.slice(0, 10)) p.push(`Top 10 ${t} in ${c} 2027`);
      for (const t of types) p.push(`Best ${t} in America 2027`);
      return uniq(p);
    },
  },
  sk: {
    prefix: 'sk',
    brand: 'Pulse Skill Drills',
    hubPage: 'skills.html',
    hubUrl: 'https://pulserevops.com/skills',
    entryPath: '/skills/',
    hubDesc: 'Runnable sales skill drills and workshop rankings for team leaders.',
    globalTags: ['pulse-skills', 'skill-drills', 'sales-drills', 'top-10', 'best-of-2027'],
    genPhrases() {
      const drills = ['discovery drill', 'objection drill', 'demo drill', 'closing drill', 'cold call drill', 'negotiation drill', 'pipeline drill', 'forecast drill'];
      const p = [];
      for (const d of drills) p.push(`Top 10 ${d}s for sales teams 2027`, `Best ${d} workshop agenda 2027`);
      for (const d of drills) for (const r of ['SDR', 'AE', 'manager']) p.push(`Best ${d} for ${r} teams`);
      return uniq(p);
    },
  },
  sp: {
    prefix: 'sp',
    brand: 'Pulse Speeches',
    hubPage: 'speeches.html',
    hubUrl: 'https://pulserevops.com/speeches',
    entryPath: '/speeches/',
    hubDesc: 'Top-10 speeches, toasts, and ready-to-deliver talk rankings.',
    globalTags: ['pulse-speeches', 'speeches', 'toasts', 'top-10', 'best-of-2027'],
    genPhrases() {
      const types = ['wedding toasts', 'best man speeches', 'maid of honor speeches', 'eulogies', 'graduation speeches', 'sales kickoff speeches', 'retirement speeches', 'birthday toasts'];
      const p = [];
      for (const t of types) p.push(`Top 10 ${t} examples 2027`, `How to write a ${t}`, `Best ${t} templates 2027`);
      return uniq(p);
    },
  },
  sy: {
    prefix: 'sy',
    brand: 'Pulse Style',
    hubPage: 'style.html',
    hubUrl: 'https://pulserevops.com/style',
    entryPath: '/style/',
    hubDesc: 'Top-10 fashion and grooming rankings with Best Overall + Best Value picks.',
    globalTags: ['pulse-style', 'style', 'fashion', 'grooming', 'top-10', 'best-of-2027'],
    genPhrases() {
      const types = ['men suits', 'women workwear', 'sneakers', 'watches', 'sunglasses', 'skincare routines', 'haircuts for men', 'business casual outfits'];
      const p = [];
      for (const t of types) p.push(`Top 10 ${t} 2027`, `Best ${t} brands 2027`);
      for (const t of types) for (const c of CITIES.slice(0, 6)) p.push(`Best ${t} in ${c} 2027`);
      return uniq(p);
    },
  },
  tk: {
    prefix: 'tk',
    brand: 'Pulse Tech Stacks',
    hubPage: 'tech-stacks.html',
    hubUrl: 'https://pulserevops.com/tech-stacks',
    entryPath: '/tech-stacks/',
    hubDesc: 'Full software stack rankings for RevOps, sales, and GTM teams.',
    globalTags: ['pulse-tech-stacks', 'tech-stacks', 'software-stack', 'top-10', 'best-of-2027'],
    genPhrases() {
      const stacks = ['RevOps stack', 'sales stack', 'SDR stack', 'CS stack', 'marketing ops stack', 'data stack', 'PLG analytics stack', 'enterprise sales stack'];
      const p = [];
      for (const s of stacks) p.push(`Top 10 tools for ${s} 2027`, `Best ${s} for mid-market SaaS`);
      for (const t of ['CRM', 'CPQ', 'billing', 'enrichment', 'sequencing', 'conversation intelligence']) p.push(`Best ${t} for RevOps 2027`);
      return uniq(p);
    },
  },
  tl: {
    prefix: 'tl',
    brand: 'Pulse Tools',
    hubPage: 'tools.html',
    hubUrl: 'https://pulserevops.com/tools',
    entryPath: '/tools/',
    hubDesc: 'Top-10 calculators and operator tools for revenue teams.',
    globalTags: ['pulse-tools', 'tools', 'calculators', 'top-10', 'best-of-2027'],
    genPhrases() {
      const ind = ['restaurant', 'retail', 'SaaS', 'construction', 'healthcare', 'franchise', 'call center', 'hospitality'];
      const p = [];
      for (const i of ind) p.push(`How many reps should I schedule at my ${i}`, `How many reps do I need to hire for ${i}`, `Rep scheduling for ${i} 2027`);
      p.push('Top 10 sales scheduling tools 2027', 'Best recruiting calculator for sales teams');
      return uniq(p);
    },
  },
  tn: {
    prefix: 'tn',
    brand: 'Pulse Towns',
    hubPage: 'towns.html',
    hubUrl: 'https://pulserevops.com/towns',
    entryPath: '/towns/',
    hubDesc: 'Top-10 town and city rankings for living, visiting, and relocating.',
    globalTags: ['pulse-towns', 'towns', 'cities', 'top-10', 'best-of-2027'],
    genPhrases() {
      const p = [];
      for (const c of CITIES) p.push(`Top 10 suburbs near ${c} 2027`, `Best towns to live near ${c} 2027`);
      p.push('Best small towns in America 2027', 'Top 10 towns for remote workers 2027', 'Best towns to raise a family 2027');
      return uniq(p);
    },
  },
  tv: {
    prefix: 'tv',
    brand: 'Pulse Travel',
    hubPage: 'travel.html',
    hubUrl: 'https://pulserevops.com/travel',
    entryPath: '/travel/',
    hubDesc: 'Top-10 travel destination rankings with Best Overall + Best Value picks.',
    globalTags: ['pulse-travel', 'travel', 'destinations', 'top-10', 'best-of-2027'],
    genPhrases() {
      const types = ['beach vacations', 'city breaks', 'family vacations', 'honeymoon destinations', 'adventure travel', 'luxury resorts', 'budget travel', 'national parks'];
      const p = [];
      for (const t of types) p.push(`Top 10 ${t} 2027`, `Best ${t} in the US 2027`);
      for (const t of types) for (const c of CITIES.slice(0, 6)) p.push(`Best ${t} from ${c}`);
      return uniq(p);
    },
  },
  wl: {
    prefix: 'wl',
    brand: 'Pulse Wellness',
    hubPage: 'wellness.html',
    hubUrl: 'https://pulserevops.com/wellness',
    entryPath: '/wellness/',
    hubDesc: 'Top-10 wellness product and routine rankings with Best Overall + Best Value picks.',
    globalTags: ['pulse-wellness', 'wellness', 'health', 'top-10', 'best-of-2027'],
    genPhrases() {
      const types = ['massage guns', 'yoga mats', 'sleep trackers', 'meditation apps', 'standing desks', 'blue light glasses', 'protein powders', 'gym memberships'];
      const p = [];
      for (const t of types) p.push(`Top 10 ${t} 2027`, `Best ${t} for busy professionals`);
      for (const t of types) for (const c of CITIES.slice(0, 6)) p.push(`Best ${t} in ${c} 2027`);
      return uniq(p);
    },
  },
};

// HF → Wellness order (skip nl, rs, er, st — already have stacks)
const HF_WELLNESS_BATCH = ['hf', 'ik', 'lv', 'mv', 'ra', 'sc', 'sk', 'sp', 'sy', 'tk', 'tl', 'tn', 'tv', 'wl'];
const ALREADY_STACKED = ['nl', 'rs', 'er', 'st'];

module.exports = { PILLAR_SPECS, HF_WELLNESS_BATCH, ALREADY_STACKED, CITIES };
