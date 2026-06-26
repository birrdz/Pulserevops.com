// Build ra0357–ra0506 queue (150 new Revenue Architecture entries).
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const l of env.split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const CANDIDATES = [
  'How do you architect revenue operations for a construction tech company in 2027?',
  'How do you architect revenue operations for a proptech company in 2027?',
  'How do you architect revenue operations for a legaltech company in 2027?',
  'How do you architect revenue operations for a govtech company in 2027?',
  'How do you architect revenue operations for a defense tech company in 2027?',
  'How do you architect revenue operations for a space tech company in 2027?',
  'How do you architect revenue operations for an agtech company in 2027?',
  'How do you architect revenue operations for a foodtech company in 2027?',
  'How do you architect revenue operations for a hospitality tech company in 2027?',
  'How do you architect revenue operations for a maritime logistics company in 2027?',
  'How do you architect revenue operations for a warehouse automation company in 2027?',
  'How do you architect revenue operations for a procurement SaaS company in 2027?',
  'How do you architect revenue operations for an AP automation company in 2027?',
  'How do you architect revenue operations for a treasury tech company in 2027?',
  'How do you architect revenue operations for a payments infrastructure company in 2027?',
  'How do you architect revenue operations for a wealthtech company in 2027?',
  'How do you architect revenue operations for a regtech company in 2027?',
  'How do you architect revenue operations for an identity verification company in 2027?',
  'How do you architect revenue operations for a fraud prevention SaaS company in 2027?',
  'How do you architect revenue operations for an observability company in 2027?',
  'How do you architect revenue operations for an API management company in 2027?',
  'How do you architect revenue operations for a low-code platform company in 2027?',
  'How do you architect revenue operations for an HRIS company in 2027?',
  'How do you architect revenue operations for a payroll software company in 2027?',
  'How do you architect revenue operations for a corporate learning company in 2027?',
  'How do you architect revenue operations for a subscription billing company in 2027?',
  'How do you architect revenue operations for a CPQ software company in 2027?',
  'How do you architect revenue operations for a GRC platform company in 2027?',
  'How do you architect revenue operations for a fleet management company in 2027?',
  'How do you architect revenue operations for a field service software company in 2027?',
  'How do you architect revenue operations for a home services software company in 2027?',
  'How do you architect revenue operations for a dental practice software company in 2027?',
  'How do you architect revenue operations for a veterinary software company in 2027?',
  'How do you architect revenue operations for a cannabis retail tech company in 2027?',
  'How do you architect revenue operations for a CPG analytics company in 2027?',
  'How do you architect revenue operations for a B2B marketplace operator in 2027?',
  'How do you architect revenue operations for a wholesale distribution platform in 2027?',
  'How do you architect revenue operations for a loyalty platform company in 2027?',
  'How do you architect revenue operations for a partner ecosystem platform in 2027?',
  'Revenue Architecture for Data Warehouse SaaS in 2027',
  'Revenue Architecture for CDP Platforms in 2027',
  'Revenue Architecture for Reverse ETL Vendors in 2027',
  'Revenue Architecture for Incident Management SaaS in 2027',
  'Revenue Architecture for DevSecOps Platforms in 2027',
  'Revenue Architecture for Integration Platform Vendors in 2027',
  'Revenue Architecture for RPA Vendors in 2027',
  'Revenue Architecture for Benefits Administration SaaS in 2027',
  'Revenue Architecture for Talent Marketplace Platforms in 2027',
  'Revenue Architecture for Event Technology SaaS in 2027',
  'Revenue Architecture for Revenue Recognition Software in 2027',
  'Revenue Architecture for ESG Reporting Platforms in 2027',
  'Revenue Architecture for Retail Analytics SaaS in 2027',
  'Revenue Architecture for Ecommerce Enablement Platforms in 2027',
  'Revenue Architecture for Affiliate Management SaaS in 2027',
  'Revenue Architecture for Channel Management Software in 2027',
  'SDR to AE Handoff Architecture at $30M ARR in 2027',
  'Enterprise AE Pod Model Design for B2B SaaS in 2027',
  'Overlay AE Model for Strategic Accounts in 2027',
  'CSM-Led Expansion Motion Architecture in 2027',
  'Product-Led Sales Assist Handoff Design in 2027',
  'Partner-Led GTM Overlay Structure in 2027',
  'Marketplace GTM Architecture for SaaS Vendors in 2027',
  'International Expansion Sales Org Design in 2027',
  'APAC Sales Pod Structure for US SaaS in 2027',
  'EMEA Field Sales Org Design in 2027',
  'Land-and-Expand Operating Cadence for SaaS in 2027',
  'Multi-Product Cross-Sell Governance Framework in 2027',
  'Pricing Committee Structure for Enterprise SaaS in 2027',
  'Discount Approval Matrix by Segment in 2027',
  'SPIF Design Governance for SaaS Sales in 2027',
  'Clawback Policy Architecture for SaaS Comp Plans in 2027',
  'Ramp Curve Modeling for New AE Hires in 2027',
  'Attrition Buffer in Sales Capacity Planning in 2027',
  'Sales Enablement Org Design at $75M ARR in 2027',
  'Revenue Intelligence Stack Architecture in 2027',
  'CRM Hygiene Operating Rhythm for RevOps in 2027',
  'Inbound Lead Routing Architecture for SaaS in 2027',
  'Account Scoring Model Governance in 2027',
  'Territory Carve Review Cadence in 2027',
  'Book of Business Redistribution Rules in 2027',
  'Sales Manager Span of Control Benchmarks in 2027',
  'Sales Engineer Coverage Ratio Design in 2027',
  'Solutions Consultant Pod Model in 2027',
  'Deal Desk SLA Design for Mid-Market SaaS in 2027',
  'Security Review Workflow in Enterprise SaaS Sales in 2027',
  'Mutual Action Plan MAP Governance in 2027',
  'MEDDPICC Field Standardization for Salesforce in 2027',
  'Stage Exit Criteria by Segment in 2027',
  'Commit Category Definitions for Forecasting in 2027',
  'Forecast Override Governance Framework in 2027',
  'Board Revenue Narrative Framework for CROs in 2027',
  'CRO Weekly Metrics Dashboard Design in 2027',
  'RevOps Weekly Business Review Structure in 2027',
  'GTM Council Charter Design in 2027',
  'SKO Planning Operating Model in 2027',
  'President Club Qualification Rules in 2027',
  'Onboarding Bootcamp Design for New AEs in 2027',
  'SDR Academy Operating Model in 2027',
  'Manager Academy for Frontline Sales Leaders in 2027',
  'Win-Loss Interview Program Design in 2027',
  'Competitive Intelligence Process for RevOps in 2027',
  'RFP Response Team Structure in 2027',
  'Renewal Forecasting Methodology for SaaS in 2027',
  'Expansion Pipeline Attribution Model in 2027',
  'NRR Board Metric Definition Framework in 2027',
  'GRR Retention Target Setting by Segment in 2027',
  'Usage-Based Pricing Sales Motion Design in 2027',
  'Consumption Forecast Methodology in 2027',
  'Channel Conflict Resolution Framework in 2027',
  'AWS Marketplace Co-Sell Motion Architecture in 2027',
  'Azure Marketplace Co-Sell GTM Design in 2027',
  'Google Cloud Marketplace GTM Motion in 2027',
  'Salesforce AppExchange GTM Architecture in 2027',
  'HubSpot Ecosystem Partner Motion Design in 2027',
  'SI Partner Revenue Share Model in 2027',
  'Reseller vs Referral Partner Comp Design in 2027',
  'OEM Embedded Sales Motion Architecture in 2027',
  'PLG Free Trial to Sales Assist Routing in 2027',
  'PQL Scoring and SLA Design in 2027',
  'Product Usage Signals in CRM Architecture in 2027',
  'RevOps Data Model for Multi-Product SaaS in 2027',
  'Single Source of Truth for ARR in RevOps in 2027',
  'Billing to CRM Reconciliation Architecture in 2027',
  'Commission System Selection Criteria in 2027',
  'CPQ to Billing Handoff Architecture in 2027',
  'CS to Sales Expansion Lead Routing in 2027',
  'Renewal Manager Comp Plan Design in 2027',
  'Account Manager vs CSM Role Split in 2027',
  'Digital CSM vs High-Touch CSM Tier Design in 2027',
  'Support to Expansion Signal Routing in 2027',
  'Professional Services Attach Rate Targets in 2027',
  'Implementation Partner Certification Program in 2027',
  'Customer Onboarding KPI Tree Design in 2027',
  'Time-to-First-Value Metric Ownership in 2027',
  'Health Score to Action Playbook Architecture in 2027',
  'Churn Save Desk Structure in 2027',
  'Red Account Governance Cadence in 2027',
  'Executive Sponsor Program Design in 2027',
  'Executive Business Review EBR Cadence in 2027',
  'Strategic Account Planning Toolkit in 2027',
  'Multi-Threading Requirements by Deal Size in 2027',
  'Champion Enablement Kit Governance in 2027',
  'Economic Buyer Access Rules in Enterprise Sales in 2027',
  'Procurement Navigation Playbook Ops in 2027',
  'Private Equity Portfolio GTM Standardization in 2027',
  'Roll-Up Integration Sales Playbook in 2027',
  'Post-Merger Territory Harmonization in 2027',
  'Post-Acquisition Comp Plan Alignment in 2027',
  'Carve-Out Standalone GTM Build in 2027',
  'IPO Readiness Revenue Audit Checklist in 2027',
  'SOX Revenue Controls for Sales Ops in 2027',
  'Enterprise S&M Efficiency Benchmark Targets in 2027',
  'Magic Number Governance at Board Level in 2027',
  'CAC Payback Target Setting by Segment in 2027',
  'LTV to CAC Ratio Planning Model in 2027',
  'Rule of 40 Conversation Framework for CROs in 2027',
  'Net Revenue Retention Planning Model in 2027',
  'Gross Retention Floor Enforcement in 2027',
  'Expansion Quota Design for CSMs in 2027',
  'CSM Commission vs Bonus Structure in 2027',
  'Pre-Sales to Post-Sales Knowledge Transfer in 2027',
  'Statement of Work Approval Workflow in 2027',
  'Multi-Year Prepaid Deal Comp Treatment in 2027',
  'Ramp Quarters for New Market Entry Hires in 2027',
  'Geo-Specific Quota Currency Handling in 2027',
  'FX-Adjusted Forecast for Global Sales Teams in 2027',
  'How to design a sales pod for vertical SaaS in 2027',
  'How to structure RevOps at $200M ARR in 2027',
  'How to build a partner quota model in 2027',
  'How to design AE specialization by industry in 2027',
  'How to architect comp for hybrid PLG and sales in 2027',
  'How to run a quarterly territory optimization review in 2027',
  'How to design sales ops intake for tooling requests in 2027',
  'How to build a deal velocity dashboard in 2027',
  'How to structure sales planning for a fiscal year reset in 2027',
  'How to design a CRO operating committee in 2027',
  'How to architect customer success coverage at $50M ARR in 2027',
  'How to design expansion plays for existing accounts in 2027',
  'How to build a revenue cadence calendar for SaaS in 2027',
  'How to structure sales compensation for multi-year deals in 2027',
  'How to design pipeline generation targets by segment in 2027',
  'How to architect marketing influence reporting for sales in 2027',
  'How to build a sales hiring plan tied to capacity model in 2027',
  'How to design a RevOps ticketing system for sales in 2027',
  'How to structure global sales kickoff for distributed teams in 2027',
  'How to architect renewal risk escalation paths in 2027',
  'How to design a sales experimentation program in 2027',
  'How to build a comp plan communication rollout in 2027',
  'How to structure deal strategy reviews for enterprise AEs in 2027',
  'How to design a sales content governance model in 2027',
  'How to architect pipeline hygiene SLAs in 2027',
  'How to build a forecast confidence scoring model in 2027',
  'How to design sales manager coaching scorecards in 2027',
  'How to structure a revenue leadership meeting cadence in 2027',
  'How to architect quota relief policies in 2027',
  'How to design a sales intern to AE pathway in 2027',
  'How to build a partner pipeline attribution model in 2027',
  'How to structure sales ops for a two-product company in 2027',
  'How to design a CRO first-90-days operating plan in 2027',
];

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);
}
function norm(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

(async () => {
  const s = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT });
  const idx = (await s.get('_index.json', { type: 'json' })) || { entries: [] };
  const used = new Set((idx.entries || []).filter((e) => e && /^ra\d+$/i.test(e.id)).map((e) => norm(e.question)));
  const raNums = (idx.entries || []).filter((e) => e && /^ra\d+$/i.test(e.id)).map((e) => parseInt(e.id.slice(2), 10));
  const startId = (raNums.length ? Math.max(...raNums) : 0) + 1;

  const picked = [];
  for (const title of CANDIDATES) {
    if (picked.length >= 150) break;
    const n = norm(title);
    if (used.has(n)) continue;
    if (picked.some((t) => norm(t) === n)) continue;
    picked.push(title);
    used.add(n);
  }
  if (picked.length < 150) {
    console.error('Only found', picked.length, 'unique titles');
    process.exit(1);
  }

  const queue = picked.slice(0, 150).map((title, i) => {
    const id = 'ra' + String(startId + i).padStart(4, '0');
    return { id, title, slug: slugify(title) };
  });
  const out = 'C:/Users/koryj/_ra_sprint150.json';
  fs.writeFileSync(out, JSON.stringify(queue, null, 2));
  console.log('wrote', out, 'count=', queue.length, 'start=', queue[0].id, 'end=', queue[queue.length - 1].id);
})();
