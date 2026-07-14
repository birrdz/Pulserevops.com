// _gp_topic_image_queries.js — title → topical PEOPLE-AT-WORK image query.
// Owner: match the INDUSTRY (dental → dentists). Architecture/buildings = rare fallback only (~10% cap enforced in board).
'use strict';

const RULES = [
  // Clinical — specific first
  { re: /\b(dental|dentist|orthodont|oral\s*surg)\b/i, q: 'dentist treating patient dental clinic' },
  { re: /\b(chiropractic|chiropractor)\b/i, q: 'chiropractor treating patient clinic' },
  { re: /\b(veterinar|vet clinic|pet care|animal hospital|doggy daycare|pet boarding)\b/i, q: 'veterinarian examining dog clinic' },
  { re: /\b(optometr|ophthalm|eye care|vision care)\b/i, q: 'optometrist eye exam patient' },
  { re: /\b(physical therapy|physiotherap|rehab clinic)\b/i, q: 'physical therapist patient rehabilitation' },
  { re: /\b(daycare|child\s*care|preschool|nursery school)\b/i, q: 'daycare teacher children classroom' },
  { re: /\b(health\s*care|healthcare|hospital|medical|physician|doctor|nursing|pharma|biotech)\b/i, q: 'doctors nurses hospital professionals working' },

  // Trades / field
  { re: /\b(snow removal|grounds maintenance|landscap|lawn care)\b/i, q: 'landscapers grounds crew working outdoors' },
  { re: /\b(mobile detail|auto detail|car wash)\b/i, q: 'car detailing professional polishing vehicle' },
  { re: /\b(plumbing|plumber)\b/i, q: 'plumber working pipes tools' },
  { re: /\b(hvac|heating cooling|air conditioning)\b/i, q: 'HVAC technician working rooftop unit' },
  { re: /\b(electric(?:ian|al)|wiring)\b/i, q: 'electrician working panel wires' },
  { re: /\b(pest control)\b/i, q: 'pest control technician working residential' },
  { re: /\b(cleaning|janitorial|maid service)\b/i, q: 'professional cleaners working office' },
  { re: /\b(window|glazier|glass install)\b/i, q: 'glazier installing windows construction site' },

  // Food / hospitality / beauty — before SaaS/software so "QSR SaaS" still gets kitchens
  { re: /\b(qsr|quick.?service|fast.?food|drive.?thru)\b/i, q: 'fast food restaurant kitchen workers' },
  { re: /\b(winery|wine|vineyard)\b/i, q: 'winery workers tasting room vineyard' },
  { re: /\b(brewery|craft beer)\b/i, q: 'brewery workers craft beer production' },
  { re: /\b(coffee|cafe|roastery)\b/i, q: 'baristas coffee shop working' },
  { re: /\b(restaurant|restaurants|foodservice|food.?service|hospitality|hotel|kitchen|inn|bed.?breakfast|event venue|wedding venue)\b/i, q: 'restaurant chefs kitchen staff working' },
  { re: /\b(cruise)\b/i, q: 'cruise ship staff hospitality working' },
  { re: /\b(tour|activities|excursion)\b/i, q: 'tour guide outdoor group activity' },
  { re: /\b(skincare|cosmetics|beauty|hair care|salon|spa)\b/i, q: 'beauty salon stylist client working' },
  { re: /\b(subscription box)\b/i, q: 'warehouse workers packing subscription boxes' },

  // Professional services
  { re: /\b(lawyers?|attorneys?|legal|law firm|litigation|counsel|LegalTech)\b/i, q: 'lawyer attorney working law office' },
  { re: /\b(account(?:ing|ant)|cpa|bookkeep|audit|treasury|cash management)\b/i, q: 'accountant finance professional working desk' },
  { re: /\b(fintech|bank(?:ing)?|finance|lender|payment|insur(?:e|ance)|insuretech|procurement|spend management)\b/i, q: 'finance banking professionals working office' },
  { re: /\b(hr\b|human resources|recruit|staffing|talent)\b/i, q: 'job interview HR professionals office' },
  { re: /\b(consult(?:ing|ant)|advisory)\b/i, q: 'business consultants meeting office working' },

  // Tech — prefer PEOPLE, not empty buildings/server rooms
  { re: /\b(cyber|cybersecurity|soc|infosec)\b/i, q: 'cybersecurity analysts at computers screens' },
  { re: /\b(ai\b|artificial intelligence|machine learning|llm|ml ops)\b/i, q: 'software engineers coding AI laptop office' },
  { re: /\b(data center|datacenter|cloud infra)\b/i, q: 'IT technicians working server racks people' },
  { re: /\b(manufactur\w*|factory|industrial|production line)\b/i, q: 'manufacturing factory workers production line' },
  { re: /\b(fleet|truck(?:ing)?|vehicle fleet|delivery fleet)\b/i, q: 'fleet truck drivers depot logistics yard' },
  { re: /\b(logistics|supply chain|warehouse|freight|shipping|distribution|wholesale)\b/i, q: 'warehouse logistics workers shipping' },
  { re: /\b(construction|contractor|jobsite|builders?|AEC)\b/i, q: 'construction workers hard hats jobsite' },
  { re: /\b(energy|solar|oil|gas|utilities|cleantech)\b/i, q: 'energy technicians solar field workers' },
  { re: /\b(agri\w*|farm(?:ing|ers?|s)?|crops?|AgTech)\b/i, q: 'farmers agriculture workers harvest field' },
  { re: /\b(open[- ]?source|foss|github)\b/i, q: 'software developers coding open source office' },
  // Sales training / enablement (ST pillar) — before generic SaaS / people-fallback
  { re: /\b(objection|discovery\s*call|cold\s*call|warm\s*call|demo\s*discipline|closing|negotiation|multi[- ]?thread|cross[- ]?sell|ramp\s*model|quota|pipeline\s*review|meddic|bant|spiced|champion|economic\s*buyer)\b/i, q: 'sales professionals training meeting presentation office' },
  { re: /\b(sales\s*train|enablement|sdr|bdr|account\s*exec|\bae\s|sales\s*org|sales\s*hiring|sales\s*onboarding|revops|forecast|territory)\b/i, q: 'sales team training coaching professionals office' },
  { re: /\b(-?min(?:ute)?s?\s*training|training\s*for|role.?play|call\s*script)\b/i, q: 'sales training classroom professionals whiteboard' },
  { re: /\b(ERP|CRM|PLM|CAD|CAFM|IWMS|QMS|EHS|devtools|SaaS|MarTech|AdTech|GovTech)\b/i, q: 'software developers coding office team' },
  { re: /\b(software|devtools|cloud)\b/i, q: 'software developers coding laptops office' },
  { re: /\b(IoT|hardware|semiconductor|electronics)\b/i, q: 'electronics engineers hardware lab working' },
  { re: /\b(telecom|telco|wireless|5g|broadband)\b/i, q: 'telecom technicians field work people' },

  // Customer-facing
  { re: /\b(crypto|web3|blockchain|defi|bitcoin|ethereum|nft)\b/i, q: 'cryptocurrency trading blockchain professionals screens' },
  { re: /\b(subscription|mobile app|consumer app|app store|in[- ]app)\b/i, q: 'people using smartphones mobile apps subscriptions' },
  { re: /\b(marketplace|two[- ]sided|multi[- ]sided|platform marketplace)\b/i, q: 'online marketplace sellers customers ecommerce' },
  { re: /\b(retail|ecommerce|e-commerce|storefront|shopify|thrift|resale|consignment|DTC)\b/i, q: 'retail store associates customers shopping' },
  { re: /\b(proptech|real estate|realty|property|apartment|housing)\b/i, q: 'real estate agent showing home to clients' },
  { re: /\b(auto|automotive|car dealer|vehicles?)\b/i, q: 'car dealership salesperson customer showroom' },
  { re: /\b(aviation|aerospace|airline)\b/i, q: 'aerospace engineers aircraft hangar working' },
  { re: /\b(educat|school|university|edtech|learning|dance|performing arts)\b/i, q: 'teachers coaching students classroom studio' },
  { re: /\b(fitness|gym|wellness|health club)\b/i, q: 'fitness trainers gym coaching clients' },
  { re: /\b(sports?\s*team|pro\s*sports|athletic(?:s)?|stadium|league|espn|athletes?|coaches?|coaching staff)\b/i, q: 'athletes coaches sports team professionals working' },
  { re: /\b(sports?|sporting)\b/i, q: 'athletes coaches sports team professionals working' },
  { re: /\b(gaming|esports|video game)\b/i, q: 'esports team gaming tournament people' },
  { re: /\b(media|publisher|news|streaming|broadcast)\b/i, q: 'media production crew studio working' },
  { re: /\b(travel|tourism)\b/i, q: 'travel agents airport professionals working' },
  { re: /\b(watch(?:es)?|horolog|timepiece)\b/i, q: 'watchmaker crafting luxury watch hands' },
  { re: /\b(marketing|advertis(?:ing|ement)?|ad agency|branding)\b/i, q: 'marketing creative team working office' },
];

// NOT buildings — people at work when we have no better match
const PEOPLE_FALLBACK = 'diverse professionals working office collaboration meeting';
const ARCH_FALLBACK = 'modern architecture building exterior city'; // rare; capped at ~10% in board

const STOP = /\b(the|complete|operating|operator|playbook|guide|strategy|gtm|go[- ]to[- ]market|motion|build|you|do|how|what|for|in|and|of|a|an|to|with|your|is|best|top|most|common|mistakes|worth|it|cost|getting|started|approach|investing|options|strategies|business|workplace|people|working|professionals?|brand|owner|route|density|sales|m|or|short|2027|2026|\d+)\b/gi;

function subjectFromTitle(title) {
  const t = String(title || '');
  const patterns = [
    /architect\s+revenue\s+operations\s+for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
    /revenue\s+architecture\s+for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
    /revenue\s+operations\s+(?:architecture|design|stack|system|model)?\s*for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
    /rev\s*ops\s+(?:architecture|design|stack|system|model)?\s*for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
    /build\s+(?:an?\s+|the\s+)?(?:gtm\s+)?playbook\s+for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
    /build\s+(?:an?\s+)?(.+?)\s+go[- ]to[- ]market/i,
    /(?:complete\s+)?(?:operating\s+)?playbook\s+for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
    /gtm\s+(?:playbook\s+)?for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
    /go[- ]to[- ]market\s+for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
    /(?:playbook|guide|strategy)\s+for\s+(?:a\s+|an\s+)?(.+?)(?:\s+in\s+20\d\d|\s*[—\-:?]|$)/i,
  ];
  let subject = '';
  for (const re of patterns) {
    const m = t.match(re);
    if (m && m[1]) { subject = m[1]; break; }
  }
  if (!subject) subject = t;
  subject = subject
    .replace(STOP, ' ')
    .replace(/[^a-z0-9 &/+-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Drop leftover junk like single short tokens
  const parts = subject.split(/\s+/).filter((w) => w.length > 2);
  return parts.join(' ');
}

function matchRules(text) {
  const s = String(text || '');
  for (const r of RULES) {
    if (r.re.test(s)) return { query: r.q, mode: 'keyword', matched: String(r.re) };
  }
  return null;
}

function isArchitectureQuery(q) {
  return /architecture|building exterior|skyline|facade|skyscraper/i.test(String(q || ''));
}

/**
 * Prefer industry people-at-work. Almost never buildings.
 * Pillar `st` (Sales Trainings) → ALWAYS group sales meeting / training photos.
 */
const ST_GROUP_QUERIES = [
  'sales team meeting training room professionals',
  'business team sales meeting whiteboard presentation',
  'sales training workshop group professionals office',
  'corporate sales meeting team collaboration conference',
  'sales team coaching training session group',
  'business people sales presentation meeting room',
  'team sales kickoff meeting professionals',
  'sales managers training group office meeting',
  // Owner OK: generic training + library photos also work for ST faces
  'corporate training classroom professionals learning',
  'adult education training seminar group office',
  'workshop facilitator training session professionals',
  'library study room professionals meeting books',
  'business library bookshelf training materials',
  'people studying training manuals library table',
];

const BS_BOOK_QUERIES = [
  'person reading business book desk professionals',
  'stack of business books on desk office',
  'people reading books library study group',
  'open book notebook coffee desk reading',
  'business book club discussion meeting professionals',
  'hardcover books bookshelf reading workspace',
  'executive reading strategy book office',
  'team discussing book notes meeting table',
  'public library bookshelf reading room quiet',
  'university library students studying books',
  'library aisle bookshelves rows of books',
  'person browsing library bookshelves business',
  'open hardcover book library desk lamp',
  'stack of hardcover books library table',
  'quiet reading room library books professionals',
  'bookstore library shelf business nonfiction books',
];

function queryForSalesTraining(title) {
  const t = String(title || '');
  const subject = subjectFromTitle(t);
  let h = 0;
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
  const query = ST_GROUP_QUERIES[h % ST_GROUP_QUERIES.length];
  return {
    query,
    mode: 'st-sales-meeting-group',
    matched: 'sales-training-group',
    subject: subject || 'sales training',
    groupOnly: true,
  };
}

/** Pull book + author from titles like "The 12 Week Year by Brian Moran — Cliff…" */
function bookBitsFromTitle(title) {
  const t = String(title || '')
    .replace(/\s*[—–\-|:]\s*.*$/, '') // drop subtitle / cliff notes tail
    .replace(/\b(cliff\s*notes?|summary|summaries|complete\s+guide|book\s+summary)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const by = t.match(/^(.+?)\s+by\s+(.+)$/i);
  if (by) {
    return {
      book: by[1].replace(/^\s*the\s+/i, '').trim(),
      author: by[2].trim(),
      raw: t,
    };
  }
  return { book: t.replace(/^\s*the\s+/i, '').trim(), author: '', raw: t };
}

/**
 * Owner law (said ~100×): Pexels search FROM THE TITLE — not a rotating generic book pile.
 * Never Pollinator. Query = book/author keywords + light “book reading” cue.
 */
function queryForBookSummaries(title) {
  const bits = bookBitsFromTitle(title);
  const parts = [bits.book, bits.author].filter((p) => p && p.length >= 2);
  let core = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (!core || core.length < 3) {
    core = subjectFromTitle(title) || String(title || '').slice(0, 60);
  }
  // Keep Pexels query tight (API hates huge strings)
  const words = core.split(/\s+/).filter(Boolean).slice(0, 8);
  core = words.join(' ');
  const query = (core + ' book reading').trim();
  return {
    query,
    mode: 'bs-title-pexels',
    matched: core,
    subject: core,
    booksOnly: true,
  };
}

function queryForTitle(title, opts) {
  opts = opts || {};
  const pillar = String(opts.pillar || process.env.TOPIC_PILLAR || '').toLowerCase();
  if (pillar === 'st') return queryForSalesTraining(title);
  if (pillar === 'bs') return queryForBookSummaries(title);

  const t = String(title || '');
  const subject = subjectFromTitle(t);

  if (subject) {
    const hit = matchRules(subject);
    if (hit) return Object.assign(hit, { subject });
  }
  const hitTitle = matchRules(t);
  if (hitTitle) return Object.assign(hitTitle, { subject });

  if (subject && subject.length >= 3) {
    return {
      query: subject + ' people working professionals',
      mode: 'subject',
      matched: subject,
      subject,
    };
  }
  return { query: PEOPLE_FALLBACK, mode: 'people-fallback', matched: '', subject: subject || '' };
}

module.exports = {
  RULES,
  FALLBACK: PEOPLE_FALLBACK,
  PEOPLE_FALLBACK,
  ARCH_FALLBACK,
  ST_GROUP_QUERIES,
  BS_BOOK_QUERIES,
  queryForTitle,
  queryForSalesTraining,
  queryForBookSummaries,
  subjectFromTitle,
  isArchitectureQuery,
};
