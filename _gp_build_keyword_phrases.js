// Build ~200 deduped GTM / go-to-market playbook SEO keyword phrases → _gp_keyword_phrases.json
// Usage: node _gp_build_keyword_phrases.js
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '_gp_keyword_phrases.json');

const INDUSTRIES = [
  'B2B SaaS',
  'mid-market SaaS',
  'enterprise software',
  'fintech',
  'healthtech',
  'cybersecurity',
  'HR tech',
  'martech',
  'data infrastructure',
  'vertical SaaS',
  '[Industry]',
];

const GEO = [
  'United States',
  'North America',
  'EMEA',
  'APAC',
  '[City]',
  '[Region]',
];

const ROLES = [
  'CRO',
  'VP Sales',
  'VP Marketing',
  'Head of RevOps',
  'RevOps leader',
  'founder CEO',
  'first sales hire',
  'GTM operator',
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

// ── 1. GTM strategy & playbook intent (launch, scale, pivot) ──
function sectionStrategy() {
  const templates = [
    'Go-to-market strategy for {ind}',
    'GTM playbook for launching {ind}',
    'How to launch a {ind} product in 2027',
    'GTM plan template for {ind} startups',
    '90-day GTM launch playbook {ind}',
    'First 100 customers GTM playbook {ind}',
    'Scaling GTM from $1M to $10M ARR {ind}',
    'GTM playbook for Series B {ind}',
    'GTM playbook for Series C {ind}',
    'When to pivot GTM motion {ind}',
    'GTM reset playbook after missed quarter',
    'Post-merger GTM integration playbook',
    'International GTM expansion playbook {ind}',
    'Multi-product GTM strategy {ind}',
    'GTM operating rhythm for {role}',
    'Annual GTM planning template {ind}',
    'GTM readiness checklist before launch',
    'GTM playbook for new market entry {geo}',
    'Land and expand GTM playbook {ind}',
    'GTM playbook for category creation {ind}',
    'GTM playbook for crowded market {ind}',
    'GTM playbook after product-market fit',
    'GTM playbook for usage-based pricing {ind}',
    'GTM playbook for enterprise upmarket move',
    'GTM playbook for downmarket SMB push {ind}',
  ];
  const phrases = [];
  for (const tmpl of templates) {
    phrases.push(tmpl.replace('{ind}', 'B2B SaaS').replace('{role}', 'CRO').replace('{geo}', 'EMEA'));
    phrases.push(tmpl.replace('{ind}', '[Industry]').replace('{role}', 'founder CEO').replace('{geo}', '[City]'));
  }
  return phrases;
}

// ── 2. Motion types: PLG vs sales-led, inbound/outbound, channel/partner ──
function sectionMotions() {
  return [
    'PLG vs sales-led GTM for B2B SaaS',
    'Product-led growth GTM playbook 2027',
    'Sales-led GTM playbook mid-market SaaS',
    'Hybrid PLG plus sales-assist GTM model',
    'When to add sales to a PLG motion',
    'Inbound GTM playbook for SaaS',
    'Outbound GTM playbook for mid-market',
    'Inbound vs outbound GTM mix calculator',
    'SDR-led outbound GTM playbook',
    'AE-led enterprise GTM playbook',
    'Channel partner GTM strategy B2B SaaS',
    'Reseller GTM playbook for SaaS vendors',
    'Marketplace GTM strategy for SaaS',
    'OEM and ISV partner GTM playbook',
    'Agency partner GTM motion SaaS',
    'Co-sell GTM playbook with hyperscalers',
    'Alliances GTM playbook for enterprise SaaS',
    'Community-led GTM playbook B2B',
    'Event-led GTM playbook for SaaS',
    'ABM GTM playbook for enterprise accounts',
    '1:1 ABM vs 1:few ABM GTM strategy',
    'Digital demand gen GTM playbook',
    'Content-led inbound GTM for SaaS',
    'Founder-led sales GTM before first AE hire',
    'Pod-based GTM model for SaaS sales teams',
    'Territory-based GTM vs pod GTM',
    'Multi-motion GTM when you sell PLG and enterprise',
    'GTM motion design for usage-based SaaS',
    'Freemium to paid conversion GTM playbook',
    'Trial-to-paid GTM optimization playbook',
    'Self-serve checkout GTM for SMB SaaS',
    'High-touch GTM for $100K+ ACV deals',
    'Low-touch GTM for sub-$15K ACV SaaS',
    'GTM motion handoff from marketing to sales',
    'GTM motion handoff from SDR to AE',
    'GTM motion handoff from sales to customer success',
  ];
}

// ── 3. ICP, positioning, messaging, pricing, packaging ──
function sectionPositioning() {
  const inds = ['B2B SaaS', 'mid-market SaaS', 'vertical SaaS', '[Industry]'];
  const templates = [
    'ICP definition template for {ind}',
    'How to build an ICP for {ind} in 2027',
    'ICP vs TAM sizing for GTM planning',
    'Positioning framework for {ind} GTM',
    'Messaging house template for SaaS GTM',
    'Value proposition canvas for B2B GTM',
    'Competitive positioning playbook {ind}',
    'Category design GTM playbook',
    'Pricing strategy for {ind} GTM',
    'Packaging tiers for SaaS GTM',
    'Good-better-best packaging GTM playbook',
    'Usage-based pricing GTM packaging',
    'Seat-based vs consumption GTM pricing',
    'Enterprise vs SMB packaging strategy',
    'Land SKU vs expand SKU GTM design',
    'Free trial vs freemium GTM packaging',
    'Sales narrative template for {ind}',
    'Discovery questions tied to ICP {ind}',
    'Buyer persona map for GTM teams',
    'Economic buyer vs champion GTM map',
    'MEDDPICC-aligned messaging playbook',
    'Vertical messaging playbook [Industry]',
    'Regional messaging localization GTM [City]',
    'Analyst and Gartner MQ positioning GTM',
    'Win-loss driven messaging refresh GTM',
    'Pricing page GTM optimization SaaS',
    'Packaging audit before GTM reset',
    'ICP scoring model for inbound leads',
    'ICP fit scoring in CRM for GTM',
    'Disqualification criteria for GTM efficiency',
  ];
  const phrases = [];
  for (const tmpl of templates) {
    for (const ind of inds.slice(0, 2)) {
      phrases.push(tmpl.replace('{ind}', ind));
    }
  }
  return phrases;
}

// ── 4. RevOps alignment: pipeline, forecast, comp tied to GTM ──
function sectionRevOps() {
  return [
    'RevOps alignment with GTM strategy',
    'GTM metrics dashboard for RevOps',
    'Pipeline coverage model tied to GTM motion',
    'Weighted pipeline forecast by GTM segment',
    'GTM stage definitions in Salesforce',
    'HubSpot pipeline stages for GTM motions',
    'CRM hygiene playbook for GTM teams',
    'Lead routing rules by GTM motion',
    'MQL to SQL handoff SLA by GTM channel',
    'SDR acceptance criteria tied to ICP',
    'GTM funnel conversion benchmarks 2027',
    'CAC payback by GTM motion SaaS',
    'Magic number by GTM segment',
    'NRR targets tied to expansion GTM',
    'Churn playbook aligned to GTM promises',
    'Comp plan design for outbound GTM',
    'Comp plan design for inbound GTM',
    'SPIF design for new GTM launch',
    'Quota setting by territory GTM model',
    'Capacity model for GTM hiring plan',
    'GTM headcount plan vs pipeline target',
    'Forecast commit rules by GTM motion',
    'Board reporting pack for GTM performance',
    'GTM OKRs for RevOps and sales leaders',
    'Attribution model for multi-touch GTM',
    'GTM data stack for mid-market RevOps',
    'Snowflake to CRM sync for GTM analytics',
    'GTM instrumentation before scale',
    'RevOps without a big team GTM playbook',
    'GTM ops cadence weekly pipeline review',
  ];
}

// ── 5. Role-based queries ──
function sectionRoles() {
  const phrases = [];
  const roleTemplates = [
    '{role} GTM playbook 2027',
    '{role} guide to GTM strategy',
    '{role} checklist for GTM launch',
    '{role} GTM planning template',
    '{role} pipeline review for GTM reset',
    'What {role} should own in GTM',
    'GTM decisions only a {role} should make',
    '{role} hiring plan for GTM scale',
  ];
  for (const role of ROLES) {
    for (const tmpl of roleTemplates) {
      phrases.push(tmpl.replace('{role}', role));
    }
  }
  return phrases;
}

// ── 6. Industry + geo long-tail ──
function sectionIndustryGeo() {
  const phrases = [];
  for (const ind of INDUSTRIES) {
    phrases.push(`GTM playbook for ${ind} companies`);
    phrases.push(`How to sell ${ind} in [City]`);
    phrases.push(`Best GTM channels for ${ind} 2027`);
    phrases.push(`${ind} customer acquisition playbook`);
    phrases.push(`${ind} sales motion design guide`);
  }
  for (const geo of GEO) {
    phrases.push(`GTM expansion playbook for ${geo}`);
    phrases.push(`Local GTM strategy ${geo} B2B SaaS`);
    phrases.push(`Hiring sequence for GTM team in ${geo}`);
  }
  return phrases;
}

// ── 7. Long-tail how-to and vs/comparison ──
function sectionHowToVs() {
  return [
    'How to build a GTM playbook from scratch',
    'How to document a sales playbook in CRM',
    'How to align marketing and sales on GTM',
    'How to choose your first GTM motion',
    'How to test GTM messaging before launch',
    'How to run a GTM workshop with leadership',
    'How to measure GTM experiment success',
    'How to sequence GTM hires first 12 months',
    'How to design GTM for multi-product portfolio',
    'How to fix leaky funnel by GTM stage',
    'How to reduce CAC with GTM efficiency',
    'How to tie product roadmap to GTM bets',
    'How to run win-loss for GTM insights',
    'How to operationalize MEDDPICC in GTM playbook',
    'How to build partner enablement for GTM',
    'How to set up GTM reporting in HubSpot',
    'How to set up GTM reporting in Salesforce',
    'How to run quarterly GTM business review',
    'PLG vs sales-led GTM which is better for SaaS',
    'Inbound vs outbound GTM for Series A SaaS',
    'ABM vs demand gen GTM strategy comparison',
    'Channel vs direct GTM for enterprise SaaS',
    'Founder-led vs AE-led GTM early stage',
    'Land and expand vs big-bang enterprise GTM',
    'Product-led vs marketing-led GTM growth',
    'Single motion vs multi-motion GTM tradeoffs',
    'Vertical SaaS GTM vs horizontal SaaS GTM',
    'Mid-market GTM vs enterprise GTM motion design',
    'Self-serve GTM vs high-touch GTM economics',
    'Partner-led GTM vs direct sales cost comparison',
    'GTM playbook vs sales playbook difference',
    'GTM strategy vs revenue strategy alignment',
    'RevOps playbook vs GTM playbook overlap',
    'GTM playbook template vs hiring a GTM consultant',
    'GTM operating model for 2027 B2B SaaS',
    'GTM playbook for post-PMF scale-up',
    'GTM playbook when churn spikes after launch',
    'GTM playbook for competitive displacement',
    'GTM playbook for pricing increase rollout',
    'GTM playbook for new buyer committee selling',
  ];
}

function padToTarget(phrases, target = 200) {
  const fillers = [
    'Pulse GTM Playbooks {ind}',
    'Go-to-market playbook index {ind}',
    'Operator GTM playbook {ind} 2027',
    'Step-by-step GTM guide {ind}',
    'GTM motion playbook {role}',
    'B2B GTM operator playbook [City]',
    'SaaS GTM best practices {ind}',
    'GTM launch checklist {ind}',
    'GTM scale playbook mid-market',
    'GTM pivot playbook after missed targets',
  ];
  let i = 0;
  while (phrases.length < target) {
    const ind = INDUSTRIES[i % INDUSTRIES.length];
    const role = ROLES[i % ROLES.length];
    const tmpl = fillers[i % fillers.length];
    phrases.push(
      tmpl.replace('{ind}', ind).replace('{role}', role)
    );
    i += 1;
  }
  return phrases.slice(0, target);
}

const s1 = sectionStrategy();
const s2 = sectionMotions();
const s3 = sectionPositioning();
const s4 = sectionRevOps();
const s5 = sectionRoles();
const s6 = sectionIndustryGeo();
const s7 = sectionHowToVs();

let all = dedupe([...s1, ...s2, ...s3, ...s4, ...s5, ...s6, ...s7]);
all = padToTarget(all, 200);

const report = {
  total: all.length,
  sections: {
    strategy: s1.length,
    motions: s2.length,
    positioning: s3.length,
    revops: s4.length,
    roles: s5.length,
    industryGeo: s6.length,
    howToVs: s7.length,
  },
};

fs.writeFileSync(OUT, JSON.stringify(all, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
console.log('Wrote', OUT, 'phrases=', all.length);
console.log('Sample:', all.slice(0, 5));
