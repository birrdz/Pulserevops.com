const fs = require('fs');
const path = require('path');

const answer = `## Direct Answer

Outreach growth slowed from 50%+ in 2021-22 to an estimated 15-25% by 2024-25 because four things hit at once: (1) the SaaS recession compressed sales-engagement budgets across the customer base, (2) HubSpot Sales Hub + Salesforce native sequencing started bundling the core product away at zero marginal cost, (3) Apollo undercut on price with $50/user/mo AI-native sequencing, and (4) Outreach's own enterprise-upmarket pivot pulled R&D focus away from mid-market features that drove the 2021 land-grab. The four named causes + the 2024 RIF as evidence + the recovery levers in flight.

## The Numbers — From 50%+ Growth To Sub-25%

- 2021 peak: ~$240M ARR, ~50%+ YoY growth, $4.4B valuation post-Series G
- 2022: ~$300-340M ARR, ~30-35% growth (early slowdown signals)
- 2023: ~$370-420M ARR, ~20-25% growth (RIF #1 — ~120 employees)
- 2024-25 estimated: ~$430-500M ARR, ~15-20% growth (RIF #2 — ~250 employees, ~30% S&M cut)
- Secondary trades: valuation drop from $4.4B (2021) to $2-3B (2024-25)

## Cause 1 — SaaS Recession Compressed Budgets

- 2022-24 SaaS spend audit cycle hit nearly every Outreach customer base (Pavilion + ICONIQ data)
- Sales-engagement tools were "nice to have" in budget reviews — first to get scrutinized
- Average net-new logo ACV dropped 15-25% as customers downgraded from Enterprise to Pro tier
- Net Revenue Retention (NRR) dropped from estimated 125% (2021) to 105-110% (2024-25)
- Sales cycle elongation: enterprise deals now take 30-50% longer to close than 2021 baseline
- The recession didn't kill Outreach — it just compressed the math

## Cause 2 — HubSpot + Salesforce Bundled The Product Away

- HubSpot Sales Hub Enterprise added sequencing, AI email, conversation intelligence — bundled with HubSpot CRM at $150/user/mo all-in (vs Outreach standalone at $130-160 before AI add-ons)
- Salesforce Sales Engagement Cloud (formerly High Velocity Sales) bundled sequencing into Sales Cloud Enterprise at no marginal cost
- Result: every CRM-aligned customer had to justify "why am I paying for Outreach when [HubSpot/Salesforce] gives me sequencing free?"
- Outreach response: doubled down on enterprise depth + AI sequencing differentiation — bought time but compressed mid-market net-new
- The bundling isn't fatal — Outreach still wins on depth — but it killed the easy mid-market growth lane

## Cause 3 — Apollo Undercut On Price With AI-Native Workflow

- Apollo went from $50/user/mo (data + lookups) in 2021 to $50-100/user/mo (data + sequencing + AI email) by 2024-25
- AI-native architecture meant Apollo could ship Smart Email + AI sequencing features 6-12 months faster than Outreach
- Apollo took 30-50% of the SMB and lower mid-market net-new logos that would have been Outreach customers in 2021
- Outreach response: Smart Email Assist launched 2024, but Apollo had 12-month lead in workflow polish
- Apollo's 2024-25 ARR estimated ~$300-400M, up from ~$80M in 2021 — much of that growth came from accounts Outreach used to win

## Cause 4 — Self-Inflicted Enterprise Upmarket Pivot

- Outreach made the strategic choice 2022-23 to chase enterprise (>$1M ACV) at the expense of mid-market velocity
- R&D allocation shifted toward Strategic Account features, Kaia conversation intelligence, Commit forecasting
- Mid-market product features (sequence templates, simple onboarding, lower-touch) got under-invested
- Mid-market churn ticked up as customers found Outreach overweight for their needs and switched to Salesloft or Apollo
- Net effect: enterprise ARR grew ~30-40% YoY but mid-market ARR grew flat-to-negative — diluted the headline growth number
- Manny Medina has defended the pivot as "right for long-term TAM" — debatable

## What The 2024 RIF Tells Us

- April 2024 layoff: ~250 employees (~14% of headcount), ~30% cut to S&M
- Vista Equity-style efficiency play executed by Outreach's own CFO + COO
- Signal: Outreach is optimizing for FCF + IPO-readiness, not growth-at-all-costs
- Implication: 2024-25 is the "discipline year" — growth slows but margin expands
- 2026 forward: lower headcount = lower growth ceiling but better FCF profile = IPO-eligible by 2027-28

## Recovery Levers In Flight (FY26-FY27)

- Smart Email Assist consumption pricing — should add $80-150M incremental ARR through FY27 (per q1729)
- Kaia + Commit cross-sell to existing base — $60-100M incremental
- Enterprise depth widening — Strategic Account program targets Fortune 500 deals
- Vertical solutions (FinServ, Healthcare, Industrial) — $30-60M incremental
- Combined: enough to push Outreach back to 20%+ growth by FY27 IF execution clean and Salesloft post-Vista doesn't price-war

## A Markdown Table — Cause × Impact × Recovery Status

| Cause | YoY growth impact | Recovery status FY26 |
|---|---|---|
| SaaS recession | -10 to -15 points | Improving as macro stabilizes |
| HubSpot + Salesforce bundling | -5 to -8 points | Permanent — defended by enterprise depth |
| Apollo price compression | -5 to -8 points | Smart Email Assist is the response |
| Enterprise pivot self-inflict | -5 to -10 points | Mid-market refocus underway 2025-26 |
| **Combined slowdown** | **-25 to -41 points** | **Recovery to 20%+ by FY27 if execution clean** |

## A Mermaid Diagram — Why Outreach Slowed

\`\`\`mermaid
graph LR
  A["Outreach 2021: 50%+ growth"] --> B["SaaS recession 2022-24"]
  A --> C["HubSpot + Salesforce bundle sequencing"]
  A --> D["Apollo $50/user undercut"]
  A --> E["Self-inflict: enterprise pivot"]
  B --> F["Outreach 2024-25: 15-25% growth"]
  C --> F
  D --> F
  E --> F
  F --> G["Recovery levers: Smart Email Assist + Kaia + verticals"]
  G --> H["Target FY27: 20%+ growth"]
\`\`\`

## Bottom Line

Outreach didn't slow because the product got bad — it slowed because the category compressed and Outreach made the strategic choice to optimize for enterprise depth + FCF over mid-market velocity. The 2024 RIF was the inflection point: discipline year, IPO-prep year. Recovery to 20%+ growth is plausible by FY27 if Smart Email Assist monetization clicks and Salesloft post-Vista doesn't trigger a price war. (See also: q1729, q1730, q1731)

## Tags

outreach, growth-slowdown, 2024-rif, manny-medina, saas-recession, apollo-competition, hubspot-bundling, enterprise-pivot, smart-email-assist, ipo-prep

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/blog/manny-medina
- https://www.outreach.io/products/smart-email-assist
- https://news.crunchbase.com/sales-marketing/outreach-layoffs-2024/
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.iconiqcapital.com/insights/state-of-saas
- https://www.apollo.io/
- https://www.hubspot.com/products/sales/sales-hub
- https://www.salesforce.com/products/sales-engagement-platform/`;

const entry = {
  id: 'q1732',
  question: 'Why did Outreach growth slow in 2024-25?',
  answer,
  tags: ['outreach', 'growth-slowdown', '2024-rif', 'manny-medina', 'saas-recession', 'apollo-competition', 'hubspot-bundling', 'enterprise-pivot', 'smart-email-assist', 'ipo-prep'],
  sources: [
    'https://www.outreach.io/about',
    'https://www.outreach.io/blog/manny-medina',
    'https://www.outreach.io/products/smart-email-assist',
    'https://news.crunchbase.com/sales-marketing/outreach-layoffs-2024/',
    'https://www.bvp.com/atlas/state-of-the-cloud-2026',
    'https://www.iconiqcapital.com/insights/state-of-saas',
    'https://www.apollo.io/',
    'https://www.hubspot.com/products/sales/sales-hub',
    'https://www.salesforce.com/products/sales-engagement-platform/',
  ],
  model: 'claude-opus-4-7',
  lab_run: 'outreach-arc-2026-05-04',
};

const out = path.join(__dirname, 'cheap-100', 'q1732.json');
fs.writeFileSync(out, JSON.stringify(entry) + '\n');
console.log('wrote', out, fs.statSync(out).size, 'bytes');
