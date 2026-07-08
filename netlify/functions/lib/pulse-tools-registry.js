// Canonical registry: every CRM / War Room surface + guided-tour stops → /tools/<slug>
const SITE = 'https://pulserevops.com';

function liveDashboardUrl(t) {
  if (t.tour) return SITE + '/dashboard.html?tour=1';
  if (t.route) return SITE + '/dashboard.html#' + t.route;
  return SITE + '/dashboard.html' + (t.anchor || '');
}

function crmRoom(slug, name, icon, route, short, keywords, extra) {
  return {
    name,
    icon,
    route,
    short,
    keywords,
    category: 'crm',
    related_tools: ['revenue-intelligence', 'crm-pipeline', 'lead-enricher'],
    related_tags: ['crm-hygiene', 'pipeline-management', 'forecast-accuracy'],
    body: [
      short,
      'Part of the free PULSE Revenue Intelligence CRM — browser-only, no per-seat fees. Deals, stages, owners, and forecast roll-ups stay in sync with the operator calculators.',
      'Open the live room, add or edit deals, and drill into pipeline health without exporting to a spreadsheet.',
    ],
    ...extra,
  };
}

const TOOLS = {
  'revenue-intelligence': {
    name: 'PULSE CRM (Free)',
    icon: '📊',
    route: 'crm',
    openUrl: '/crm',
    short: 'Free operator-grade CRM — deals, pipeline, forecast, reps, and beats without the Salesforce bill.',
    keywords: ['free crm', 'revenue intelligence', 'sales pipeline tool', 'free salesforce alternative'],
    category: 'crm',
    related_tools: ['crm-deals', 'lead-enricher'],
    related_tags: ['crm-hygiene', 'pipeline-management', 'salesforce'],
    body: [
      'Full CRM in the browser: deal table, stage hygiene, owner assignment, weighted pipeline, and leadership roll-ups.',
      'Apollo-discovered leads can flow through Lead Enricher (ICP score + first-touch hook) straight into new deals.',
      'No login, no vendor lock-in — your data stays on your device.',
    ],
  },

  'crm-deals': crmRoom('crm-deals', 'CRM · Deals', '✦', 'crm',
    'Deal table — add name + value, track stage, owner, age, and risk in seconds.',
    ['crm deals', 'deal tracking', 'sales pipeline table', 'free deal crm'],
  ),

  'crm-pipeline': crmRoom('crm-pipeline', 'CRM · Pipeline', '🔀', 'pipeline',
    'Pipeline by stage — see weight, slippage, and coverage before the forecast call.',
    ['sales pipeline view', 'pipeline stages', 'weighted pipeline crm'],
  ),

  'crm-beats': crmRoom('crm-beats', 'CRM · Beats (Hologram Cards)', '✨', 'beats',
    'Hologram scorecards per rep — tier, rhythm, and contributions the team can chase.',
    ['sales gamification', 'rep scorecard', 'sales beats dashboard'],
    { related_tools: ['crm-reps', 'pulse-check', 'lightning-rounds'] },
  ),

  'crm-reps': crmRoom('crm-reps', 'CRM · Reps', '👤', 'reps',
    'Rep-level attainment, activity, and pipeline ownership in one roll-up.',
    ['sales rep dashboard', 'rep pipeline view', 'ae performance crm'],
  ),

  'crm-leaders': crmRoom('crm-leaders', 'CRM · Leaders', '👥', 'leaders',
    'Leader-board for managers — compare pods, regions, or segments without a spreadsheet.',
    ['sales leader board', 'manager pipeline view', 'sales pod dashboard'],
    { related_tools: ['coaching'] },
  ),

  'crm-forecast': crmRoom('crm-forecast', 'CRM · Forecast', '📈', 'forecast',
    'Forecast roll-up with commit rules — see fragile assumptions before the board asks.',
    ['sales forecast tool', 'crm forecast', 'pipeline forecast free'],
    { related_tools: ['house-goals'] },
  ),

  'gross-profit-calculator': {
    name: 'Gross Profit Calculator',
    icon: '💰',
    route: 'profit',
    short: 'Model margin per KPI line — counts × revenue-per-unit roll to monthly and annualized GP.',
    keywords: ['gross profit calculator', 'saas margin calculator', 'kpi revenue calculator'],
    category: 'calculator',
    related_tools: ['house-goals', 'service-fees', 'rep-scheduling'],
    related_tags: ['comp-design', 'saas-gtm'],
    body: [
      'Each KPI row gets monthly count and revenue-per-unit; totals roll up instantly. Syncs with House Goals when connected.',
      'Use before changing comp accelerators or adding a low-margin SKU.',
      'Free, no login.',
    ],
  },

  'service-fees': {
    name: 'Service Fees Calculator',
    icon: '💵',
    route: 'fees',
    short: 'Model up to five fees with attach rates — see monthly fee revenue vs back-office cost.',
    keywords: ['service fees calculator', 'attach rate calculator', 'back office cost coverage'],
    category: 'calculator',
    related_tools: ['gross-profit-calculator', 'house-goals'],
    related_tags: ['pricing-strategy', 'revops'],
    body: [
      'Service fees often fund back-office headcount — model attach rate and units before the next hire request.',
      'Up to five fee lines with live dollar impact.',
      'Free, browser-only.',
    ],
  },

  'house-goals': {
    name: 'House Goals',
    icon: '🏠',
    route: 'monthly',
    short: 'Month-ahead goal engine — ((3-mo avg + same month LY) ÷ 2) × growth factor, per rep.',
    keywords: ['monthly sales goals', 'rep goal setting', 'sales quota planning'],
    category: 'calculator',
    related_tools: ['pulse-check', 'pulse-matrix', 'tier-distribution'],
    related_tags: ['sales-leadership', 'forecast-accuracy'],
    body: [
      'Defensible monthly targets — not last month + 5%. Apply All Suggestions populates every rep at once.',
      'Pairs with Pulse Check so goals and scores share one frame.',
      'Free, no account required.',
    ],
  },

  'pulse-check': {
    name: 'Pulse Check',
    icon: '◉',
    route: 'pulsecheck',
    // Open straight into the live Pulse Check matrix.
    openUrl: SITE + '/dashboard.html#inline-matrix',
    short: 'Rep scoring matrix — weight what matters, score 1–5, one composite Pulse number.',
    keywords: ['rep scoring tool', 'sales scorecard', 'pulse check tool'],
    category: 'calculator',
    related_tools: ['pulse-matrix', 'coaching', 'house-goals'],
    related_tags: ['performance-management', 'cro-playbook'],
    body: [
      'For weekly pipeline review, monthly comp, or promotion decisions — criteria locked before scoring.',
      'Free. Pairs with House Goals on the combined Pulse Matrix view.',
    ],
  },

  'pulse-matrix': {
    name: 'Pulse Matrix',
    icon: '⌬',
    route: 'housegoals',
    // Open straight into the live Pulse Check matrix (not the House Goals view).
    openUrl: SITE + '/dashboard.html#inline-matrix',
    short: 'Locked House Goals × Pulse Check — goals and scores side-by-side for accountability.',
    keywords: ['pulse matrix', 'sales accountability matrix', 'goals and scoring'],
    category: 'calculator',
    related_tools: ['house-goals', 'pulse-check', 'coaching'],
    related_tags: ['sales-leadership', 'forecast-accuracy'],
    body: [
      'One source of truth for what the rep should do and what they did — no separate spreadsheets.',
      'Password gate for owners who want the matrix frozen mid-quarter.',
      'Free, browser-only.',
    ],
  },

  'tier-distribution': {
    name: 'Tier Distribution',
    icon: '📊',
    route: 'tierdist',
    short: 'Last month → this month → next month — rhythm-tier bell curve and coaching projection.',
    keywords: ['sales tier distribution', 'rep tier chart', 'rhythm level distribution'],
    category: 'calculator',
    related_tools: ['coaching', 'pulse-check', 'house-goals'],
    related_tags: ['sales-leadership', 'rep-development'],
    body: [
      'Three-period trend strip plus editable percentages — see where coaching pressure moves the curve.',
      'Tour stop #7 on the guided walkthrough.',
      'Free, no login.',
    ],
  },

  'coaching': {
    name: 'AI Sales Coaching',
    icon: '🎯',
    route: 'coaching',
    short: 'One highest-impact coaching move per rhythm tier — built for busy managers.',
    keywords: ['ai sales coaching', 'sales coaching tool', 'rep development'],
    category: 'calculator',
    related_tools: ['pulse-check', 'crm-reps'],
    related_tags: ['sales-leadership', 'rep-development'],
    body: [
      'Surfaces one behavior, one metric, one timeline — not a 300-word essay.',
      'Use before weekly 1:1s. Free basic coaching prompt.',
    ],
  },

  'recruiting-calculator': {
    name: 'Recruiting Calculator',
    icon: '🎓',
    route: 'recruiting',
    short: 'Capacity math with ramp — how many reps to hire and when they must start.',
    keywords: ['sales recruiting calculator', 'rep hiring model', 'sales capacity calculator'],
    category: 'calculator',
    related_tools: ['gross-profit-calculator', 'rep-scheduling', 'house-goals'],
    related_tags: ['hiring', 'gtm-scaling'],
    body: [
      'Inputs monthly goal, ramp curve, and utilization — outputs headcount plan with start dates.',
      'Free planning session every time you open it.',
    ],
  },

  'rep-scheduling': {
    name: 'Rep Scheduling Matrix',
    icon: '🕒',
    route: 'scheduling',
    short: 'Weekly GP target ÷ per-shift minimum → shift counts auto-distributed by day.',
    keywords: ['sales rep scheduling', 'shift calculator', 'coverage planner'],
    category: 'calculator',
    related_tools: ['gross-profit-calculator', 'recruiting-calculator'],
    related_tags: ['gtm-operations', 'capacity-planning'],
    body: [
      'Protects high-value selling hours — 6-hour shifts and 4.5-day defaults unless math forces doubles.',
      'Pulls benchmarks from House Goals when connected.',
    ],
  },

  'lightning-rounds': {
    name: 'Lightning Rounds',
    icon: '⚡',
    route: 'lightning',
    short: 'Daily team challenges — reps earn Pulse Points; leaderboard does the management.',
    keywords: ['sales gamification', 'lightning round sales', 'team competition tool'],
    category: 'engagement',
    related_tools: ['crm-beats', 'squad-sync', 'pulse-derby'],
    related_tags: ['sales-leadership', 'team-management'],
    body: [
      'Rapid-fire challenges tied to real activity — not vanity leaderboard points.',
      'Tour stop #13. Free on the PULSE dashboard.',
    ],
  },

  'squad-sync': {
    name: 'Squad Sync',
    icon: '📱',
    route: 'squadsync',
    short: 'Push live scores to reps\' phones — no login, always know where they stand.',
    keywords: ['sales team sync', 'rep score sync', 'mobile sales dashboard'],
    category: 'engagement',
    related_tools: ['lightning-rounds', 'crm-beats', 'pulse-check'],
    related_tags: ['team-management', 'sales-leadership'],
    body: [
      'Cross-device sync for floor teams who live on phones, not laptops.',
      'Tour stop #14.',
    ],
  },

  'lead-enricher': {
    name: 'Lead Enricher',
    icon: '🔍',
    route: 'enricher',
    short: 'Paste leads — ICP fit 1–10 and first-touch hooks. Free Clay-style enricher on the dashboard.',
    keywords: ['lead enrichment free', 'icp scoring tool', 'b2b lead enricher'],
    category: 'crm',
    related_tools: ['revenue-intelligence', 'crm-deals'],
    related_tags: ['outbound', 'prospecting', 'revops'],
    body: [
      'CSV in, scored rows out — built for SDR handoff to AE without another SaaS bill.',
      'Tour stop #15 on the full guided tour.',
    ],
  },

  'sales-meeting-creator': {
    name: 'Sales Meeting Creator',
    icon: '🎤',
    route: 'meeting',
    short: 'AI-built 20-minute sales meetings — agenda, talking points, role-plays.',
    keywords: ['sales meeting agenda ai', 'sales meeting creator', 'enablement tool free'],
    category: 'enablement',
    related_tools: ['team-toasts', 'coaching', 'guided-tour'],
    related_tags: ['enablement', 'sales-leadership'],
    body: [
      'One button → shippable meeting deck. Tour stop #21.',
      'Free on PULSE — no slide-template archaeology.',
    ],
  },

  'team-toasts': {
    name: 'Team Toasts & Speeches',
    icon: '🥂',
    route: 'speeches',
    short: 'AI speeches for kickoffs, launches, retirements — cuts blank-page panic.',
    keywords: ['sales team speech', 'kickoff speech generator', 'sales toast ai'],
    category: 'enablement',
    related_tools: ['sales-meeting-creator', 'coaching'],
    related_tags: ['sales-leadership', 'enablement'],
    body: [
      'Pep talks and formal toasts in operator tone — not generic motivational filler.',
      'Tour stop #22.',
    ],
  },

  'not-to-do-list': {
    name: 'Not-To-Do List',
    icon: '🚫',
    route: 'nottodo',
    short: 'What to stop doing this week — subtraction beats addition.',
    keywords: ['not to do list sales', 'sales productivity', 'stop doing list manager'],
    category: 'enablement',
    related_tools: ['coaching'],
    related_tags: ['sales-leadership', 'cro-playbook'],
    body: [
      'Forces explicit tradeoffs — vanity reports, duplicate meetings, busywork that does not move pipeline.',
      'Tour stop #23.',
    ],
  },

  'inventory-tracker': {
    name: 'Inventory Tracker',
    icon: '📦',
    route: 'inventory',
    short: 'SKU aging, barcode scan, PDF capture — find dead stock before it finds you.',
    keywords: ['inventory tracker', 'sku aging', 'barcode inventory sales'],
    category: 'ops',
    related_tools: ['gross-profit-calculator', 'service-fees'],
    related_tags: ['gtm-operations', 'retail-ops'],
    body: [
      'For teams that sell physical product alongside services — ties margin story to shelf reality.',
      'Tour stop #24.',
    ],
  },

  '90-day-revenue-plan': {
    name: '90-Day Revenue Plan',
    icon: '📅',
    route: 'plan90',
    short: 'Ramp or reset playbook — ninety-day revenue plan template on the dashboard.',
    keywords: ['90 day sales plan', 'revenue ramp plan', 'quarterly sales plan template'],
    category: 'enablement',
    related_tools: ['house-goals', 'recruiting-calculator'],
    related_tags: ['cro-playbook', 'forecast-accuracy'],
    body: [
      'Structured quarter plan when you are resetting a team or onboarding a new leader.',
      'Also available as a standalone page at /plan-90.html.',
    ],
  },

  'pulse-derby': {
    name: 'Pulse Derby',
    icon: '🏇',
    route: 'funzone',
    short: 'Sixty-second horse race every five minutes — bet Pulse Points, win or lose dignity.',
    keywords: ['sales team game', 'pulse derby', 'sales floor gamification'],
    category: 'engagement',
    related_tools: ['lightning-rounds', 'crm-beats'],
    related_tags: ['team-management'],
    body: [
      'Random races fire on a timer — tour stop #17. Live game also at /derby/.',
      'Free morale break that does not require another app install.',
    ],
  },

  'locker-room': {
    name: 'Locker Room (Save / Load)',
    icon: '🔒',
    route: 'warroom',
    anchor: '',
    short: 'Four-digit save codes — pivot entire dashboard configs between teams or scenarios.',
    keywords: ['dashboard save load', 'crm config backup', 'sales dashboard scenarios'],
    category: 'ops',
    related_tools: ['revenue-intelligence'],
    related_tags: ['revops', 'gtm-operations'],
    body: [
      'One-click save and load for the full PULSE workspace — tour stop #18.',
      'Use before testing a reorg or running a what-if forecast.',
    ],
  },

  'how-to-library': {
    name: 'How-To & Industry KPI Library',
    icon: '📖',
    route: null,
    short: 'Industry KPI playbooks and RevOps Q&A — 39+ verticals, refreshed by The Machine.',
    keywords: ['industry sales kpis', 'how to sales playbook', 'revops library'],
    category: 'library',
    related_tools: ['revenue-intelligence'],
    related_tags: ['revops', 'sales-leadership'],
    body: [
      'Tour stop #16 — Solar, Real Estate, SaaS, Healthcare, and more. Nine KPIs per industry.',
      'Hub at /industry-kpis and /knowledge — no email gate.',
    ],
    openUrl: SITE + '/industry-kpis',
  },

  'guided-tour': {
    name: 'Guided Dashboard Tour',
    icon: '🎓',
    tour: true,
    short: 'Twenty-five-step walkthrough — CRM, calculators, enricher, derby, and more in ~3 minutes.',
    keywords: ['pulse revops tour', 'free crm tour', 'sales dashboard walkthrough'],
    category: 'tour',
    related_tools: ['revenue-intelligence', 'house-goals'],
    related_tags: ['revops', 'sales-leadership'],
    body: [
      'Re-run anytime from the Tour Menu (top right) or start with ?tour=1 on the dashboard.',
      'Covers every compartment in the operator stack — the same stops search engines index as /tools/ pages.',
      'Free, no login — narration + ghost demos on key fields.',
    ],
  },

  'medical-documents-batch-extractor': {
    name: 'Medical Documents Batch Extractor',
    icon: '🩺',
    openUrl: '/medical-documents-batch-extractor.html',
    short: 'Batch-extract structured medical document data from PDFs and images using Gemini Flash Lite — labs, diagnoses, meds, vitals.',
    keywords: ['medical document extractor', 'batch pdf ocr', 'lab report parser', 'gemini flash lite medical'],
    category: 'utility',
    related_tools: ['lead-enricher', 'revenue-intelligence'],
    related_tags: ['healthcare', 'document-processing'],
    body: [
      'Upload PDFs or images (lab reports, discharge summaries, imaging, prescriptions).',
      'Gemini Flash Lite returns structured JSON per file — diagnoses, medications, lab results, vitals, summary.',
      'Browser batch mode with checkpoint CSV every 48 files; CLI runner for folder drops.',
    ],
  },
};

// Aliases: short paths → canonical tool slug (for redirects)
const SHORT_ALIASES = {
  'crm': 'crm-deals',
  'deals': 'crm-deals',
  'pipeline': 'crm-pipeline',
  'beats': 'crm-beats',
  'reps': 'crm-reps',
  'leaders': 'crm-leaders',
  'forecast': 'crm-forecast',
  'tour': 'guided-tour',
};

function allToolUrls() {
  return Object.keys(TOOLS).map((slug) => SITE + '/tools/' + slug);
}

function toolSlugs() {
  return Object.keys(TOOLS);
}

module.exports = {
  SITE,
  TOOLS,
  SHORT_ALIASES,
  liveDashboardUrl,
  allToolUrls,
  toolSlugs,
};
