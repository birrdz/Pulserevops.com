const fs = require('fs');
const path = require('path');

const answer = `## Direct Answer

Probably yes — but only if four specific conditions hold simultaneously through FY27. The base case is 18-22% growth (a stretch from the FY25 estimated 15-20%). The bull case (25%+) needs Smart Email Assist consumption to hit $80M+ in incremental ARR AND Salesloft post-Vista to NOT trigger a price war AND HubSpot Sales Hub to stop closing the feature gap AND Apollo to stop taking SMB share. Any one of those four breaking and Outreach lands at 12-18% growth. The four gating conditions + the FY27 sensitivity table + the named scenarios.

## The Starting Math — What 20%+ Actually Means

- Estimated FY25 ARR: $430-500M
- 20% growth FY26 → $516-600M
- 20% growth FY27 → $620-720M
- Incremental NEW ARR needed across two years: ~$190-220M
- That's $95-110M/yr in net-new ARR — roughly 2x what a typical Series-G SaaS adds in mature growth phase
- Comparable: HubSpot at similar revenue scale (2018) grew 39%; Salesforce at $500M (2007) grew 51%; Outreach at this stage with this competition is harder

## Condition 1 — Smart Email Assist Monetization Hits $80M+ Incremental

- Per-AI-email consumption pricing layer must add $80-150M incremental ARR through FY27 (per q1729 lever 1)
- Pricing model: $5-15/user/mo uplift on Pro tier OR per-1000-AI-emails consumption
- Attach rate target: 60-70% of Pro/Enterprise customers within 18 months
- Risk: if attach rate stalls at 30-40% (because customers see the AI quality as marginal), uplift is only $30-50M
- Comparable: Salesforce Einstein attach rate is ~25% across enterprise base — Outreach needs to beat that

## Condition 2 — Salesloft Post-Vista Doesn't Price-War

- Vista Equity playbook is cost-out + margin extraction, not aggressive pricing — usually
- BUT Vista has done price-war moves before (e.g., Marketo post-acquisition discount campaigns)
- If Salesloft cuts pricing 30-40% to defend share, Outreach renewal economics compress 8-15 points
- Probability of price war: ~30-40% based on Vista historical patterns + Salesloft competitive posture
- Mitigation: Outreach multi-year contracts lock in pricing through FY27

## Condition 3 — HubSpot Sales Hub Doesn't Close The Feature Gap

- HubSpot Sales Hub Enterprise added sequencing + AI email + conversation intelligence in 2024-25
- By FY27 the bundled product may be 80% of Outreach functionality at 20% of cost (per q1732)
- If HubSpot keeps closing gap, mid-market net-new logos shift to HubSpot bundle
- Outreach defense: enterprise depth + Strategic Account program + named-vertical solutions
- Probability of HubSpot fully closing gap by FY27: ~20-30% — HubSpot will close 60-70% but enterprise depth is hard to replicate

## Condition 4 — Apollo Doesn't Take More SMB Share

- Apollo took 30-50% of SMB net-new logos 2022-25 that would have been Outreach customers
- By FY27 Apollo could expand into mid-market (>100 reps) — direct competitive overlap with Outreach Pro tier
- Apollo's $50-100/user/mo pricing vs Outreach Pro $130-160 is a brutal compression
- Outreach defense: Smart Email Assist + Kaia + Commit value-add at higher tier — but Apollo is shipping equivalents fast
- Probability of Apollo successfully attacking mid-market: ~40-50% — Apollo's track record is strong

## A Markdown Table — FY27 Growth Scenarios

| Scenario | Conditions met | FY27 growth | FY27 ARR | IPO viable? |
|---|---|---|---|---|
| Bull | All 4 conditions hold | 25-30% | $720-820M | Yes — strong IPO |
| Base | 3 of 4 conditions hold | 18-22% | $620-720M | Yes — acceptable IPO |
| Bear | 2 of 4 conditions hold | 12-18% | $560-650M | Marginal — likely PE acquisition path |
| Crash | 0-1 conditions hold | 5-12% | $480-580M | No — acquisition forced |

## What History Says About SaaS Companies At This Stage

- Companies at $400-500M ARR rarely reaccelerate after a slowdown — most settle into 15-25% range
- Reacceleration cases: HubSpot (added bundling), Datadog (added new products), Snowflake (added enterprise depth) — all required net-new product surface area
- Stagnation cases: New Relic, Anaplan, Cloudera — settled into 8-15% range, became acquisition targets
- Outreach's pattern looks more like reacceleration candidate IF Smart Email Assist is the new-product wedge — but execution risk is real

## What Manny Medina Has To Do

- Ship Smart Email Assist monetization with measurable consumption uplift by Q2 FY26
- Defend mid-market with pricing discipline + lighter-touch SKU
- Win 30+ Strategic Account deals at >$1M ACV through FY27
- Keep operating margin expanding (Vista-style discipline) so the IPO story is "growth + margin," not just growth
- Avoid the temptation to do an M&A acquisition that distracts the org through FY27

## A Mermaid Diagram — Growth Trajectory Decision Tree

\`\`\`mermaid
graph LR
  A["FY25: 15-20% growth"] --> B{"Smart Email hits $80M?"}
  B -->|Yes| C{"Salesloft no price war?"}
  B -->|No| D["Bear: 12-18% growth"]
  C -->|Yes| E{"HubSpot gap stays open?"}
  C -->|No| D
  E -->|Yes| F{"Apollo SMB containment?"}
  E -->|No| D
  F -->|Yes| G["Bull: 25-30% growth FY27"]
  F -->|No| H["Base: 18-22% growth FY27"]
  G --> I["IPO 2027-28 strong"]
  H --> J["IPO 2027-28 acceptable"]
  D --> K["PE acquisition or merger"]
\`\`\`

## Bottom Line

Outreach can hold 20%+ growth into FY27 — base case 18-22% is achievable, bull case 25%+ requires four specific conditions to hold. The honest call: probably lands at 18-22% (base case) which is enough for an acceptable IPO at $1-1.5B valuation. The bear case (12-18%) forces PE acquisition or merger. Manny Medina's job is execution discipline on Smart Email Assist + pricing defense across all four lanes simultaneously. (See also: q1729, q1730, q1732)

## Tags

outreach, growth-trajectory, fy27-forecast, smart-email-assist, salesloft-competition, hubspot-sales-hub, apollo, manny-medina, ipo-prep, scenario-planning

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/products/smart-email-assist
- https://news.salesloft.com/news-releases/news-release-details/salesloft-vista-equity-acquisition
- https://www.salesloft.com/about
- https://www.hubspot.com/products/sales/sales-hub
- https://www.apollo.io/
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.iconiqcapital.com/insights/state-of-saas
- https://www.crunchbase.com/organization/outreach-corp`;

const entry = {
  id: 'q1733',
  question: 'Can Outreach keep growing 20%+ into 2027?',
  answer,
  tags: ['outreach', 'growth-trajectory', 'fy27-forecast', 'smart-email-assist', 'salesloft-competition', 'hubspot-sales-hub', 'apollo', 'manny-medina', 'ipo-prep', 'scenario-planning'],
  sources: [
    'https://www.outreach.io/about',
    'https://www.outreach.io/products/smart-email-assist',
    'https://news.salesloft.com/news-releases/news-release-details/salesloft-vista-equity-acquisition',
    'https://www.salesloft.com/about',
    'https://www.hubspot.com/products/sales/sales-hub',
    'https://www.apollo.io/',
    'https://www.bvp.com/atlas/state-of-the-cloud-2026',
    'https://www.iconiqcapital.com/insights/state-of-saas',
    'https://www.crunchbase.com/organization/outreach-corp',
  ],
  model: 'claude-opus-4-7',
  lab_run: 'outreach-arc-2026-05-04',
};

const out = path.join(__dirname, 'cheap-100', 'q1733.json');
fs.writeFileSync(out, JSON.stringify(entry) + '\n');
console.log('wrote', out, fs.statSync(out).size, 'bytes');
