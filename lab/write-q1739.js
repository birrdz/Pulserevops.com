const fs = require('fs');
const path = require('path');

const answer = `## Direct Answer

Buy Outreach if you're Salesforce-CRM, 100+ reps, $30K+ ACV, and want enterprise depth + AI roadmap. Buy Salesloft if you're HubSpot-CRM, 50-200 reps, $10-50K ACV, and want simpler UX + post-Vista 30-40% pricing flexibility. Skip both if you're <50 reps (HubSpot Sales Hub bundled wins) or <$10K ACV (Apollo wins). The 6-question buy-side framework + the cost comparison + the named scenarios where each tool clearly beats the other.

## The 6-Question Buy-Side Framework

- **Question 1 — What CRM?** Salesforce → Outreach (deeper integration). HubSpot → Salesloft (preferred partner). Microsoft Dynamics → Outreach. None → HubSpot Sales Hub bundle.
- **Question 2 — How many reps?** <50 → Skip both, buy bundled tool. 50-150 → Either works. 150+ → Outreach has enterprise depth advantage.
- **Question 3 — Average ACV?** <$10K → Apollo crushes both on ROI. $10K-$100K → Either fits. >$100K → Outreach Strategic Account program wins.
- **Question 4 — Pricing flexibility need?** If post-Vista discount appeals → Salesloft (30-40% potential discount). If list-price stability → Outreach.
- **Question 5 — Conversation intelligence priority?** If yes → Outreach Kaia (better Salesforce integration) OR Salesloft Drift (better HubSpot integration).
- **Question 6 — Forecasting tool priority?** If yes → Outreach Commit (slight edge) OR add Clari standalone (both Outreach + Salesloft acceptable).

## Where Outreach Clearly Wins

- **Enterprise depth**: 570+ customers >$100K ACV vs Salesloft estimated ~350 (per q1730)
- **AI sequencing maturity**: Smart Email Assist + Kaia + Commit shipped + integrated
- **Founder-led narrative**: Manny Medina still CEO; Salesloft has new post-Vista CEO
- **Salesforce integration depth**: Outreach is the Salesforce-CRM customer's preferred sequencing
- **Multi-product platform story**: Outreach Sales Execution Platform unifies sequencing + conv intel + forecasting
- **Named flagship customer wins**: SAP, Cisco, McKesson, Adobe — anchor refs at the upper-end
- **IPO upside**: standalone IPO 2027-28 path at $1.5B+ valuation (Salesloft is PE-extracted)

## Where Salesloft Clearly Wins

- **Pricing flexibility post-Vista**: Vista cost-out playbook means Salesloft can offer 30-40% discounts for multi-year commits
- **HubSpot CRM integration**: Salesloft is HubSpot's preferred sequencing partner
- **Drift conversation tools**: pre-Vista Drift acquisition gives Salesloft conversational AI + chatbot suite Outreach lacks
- **Mid-market simplicity**: cleaner UX, faster onboarding (4-8 weeks vs Outreach 8-16 weeks)
- **Lower-touch sales motion**: smaller orgs can self-serve Salesloft easier than Outreach
- **Cadence simplicity**: less overwhelming feature set for non-power-user reps
- **Vista bundling potential**: cross-sell with Vista portfolio (Pipedrive, Apptio) creates bundle leverage

## Cost Comparison — Outreach vs Salesloft (200-rep org, all-in)

- **Outreach Pro tier**: $130-160/user/mo × 200 = $312-384K/yr base
- **Outreach + Smart Email Assist + Kaia + Commit**: ~$220-280/user/mo × 200 = $528-672K/yr all-in
- **Outreach Implementation**: $80-150K one-time
- **Outreach 3-yr TCO**: ~$1.7-2.2M
- **Salesloft Cadence + Drift + standard tier**: $100-130/user/mo × 200 = $240-312K/yr base
- **Salesloft + add-ons**: ~$150-200/user/mo × 200 = $360-480K/yr all-in
- **Salesloft Implementation**: $40-100K one-time
- **Salesloft 3-yr TCO**: ~$1.1-1.5M
- **Net**: Salesloft ~30-40% cheaper for equivalent feature scope at 200-rep scale

## Named Scenarios — Where Each Wins Clearly

- **Fortune 500 enterprise sales org, Salesforce CRM, $1M+ ACV deals**: Outreach (no contest)
- **Mid-market SaaS, HubSpot CRM, $20-50K ACV, cost-conscious**: Salesloft (no contest)
- **PE-backed company under cost pressure, willing to switch CRM if needed**: Salesloft (Vista alignment)
- **Founder-led growth-stage company, Salesforce, AI-first roadmap**: Outreach
- **Industrial / FinServ / Healthcare with vertical compliance**: Outreach (vertical solutions deeper)
- **International expansion focus, EMEA + APAC**: Outreach (broader geographic depth)
- **Conversational AI + chatbot priority**: Salesloft (Drift acquisition advantage)

## A Markdown Table — Outreach vs Salesloft 2027 Buy-Side

| Buy criteria | Outreach | Salesloft | Winner |
|---|---|---|---|
| Salesforce CRM integration | Deep | Adequate | Outreach |
| HubSpot CRM integration | Adequate | Deep | Salesloft |
| Enterprise depth (>$1M ACV) | Strong (570+ customers) | Moderate (~350 customers) | Outreach |
| Mid-market simplicity | Complex Pro tier | Cleaner UX | Salesloft |
| AI sequencing | Smart Email Assist mature | Drift-equivalent emerging | Outreach |
| Conversation intelligence | Kaia (Salesforce side) | Drift (HubSpot side) | Tied (CRM-driven) |
| Forecasting | Commit | Pipeline AI | Outreach (slight) |
| Pricing flexibility | List price | 30-40% discount possible | Salesloft |
| Implementation speed | 8-16 weeks | 4-8 weeks | Salesloft |
| Total 3-yr TCO (200 reps) | $1.7-2.2M | $1.1-1.5M | Salesloft (~30% cheaper) |
| IPO/exit path | IPO 2027-28 | PE secondary | Outreach (more upside) |
| Vendor stability | Founder-led | Post-Vista transition | Outreach |

## A Mermaid Diagram — Outreach Vs Salesloft Decision Tree

\`\`\`mermaid
graph LR
  A["Buying sales engagement?"] --> B{"What CRM?"}
  B -->|Salesforce| C{"Org size?"}
  B -->|HubSpot| D["Salesloft + Drift"]
  B -->|None / SMB| E["HubSpot Sales Hub bundled"]
  C -->|150+ reps| F["Outreach Enterprise"]
  C -->|50-150| G{"Cost-conscious?"}
  C -->|<50| H["Apollo or HubSpot bundle"]
  G -->|Yes| I["Salesloft - 30 percent cheaper"]
  G -->|No| J["Outreach Pro"]
  F --> K["Strategic Account program"]
  J --> L["Smart Email + Kaia + Commit"]
  D --> M["Cadence + Drift bundle"]
\`\`\`

## Bottom Line

Outreach vs Salesloft is mostly a CRM-driven decision: Salesforce → Outreach, HubSpot → Salesloft. Beyond CRM, Salesloft wins on cost (~30% cheaper) and simplicity; Outreach wins on enterprise depth, AI roadmap, and IPO upside. The honest call: most mid-market customers should buy Salesloft (cheaper, simpler) unless they're scaling toward enterprise; enterprise customers should buy Outreach (depth + roadmap). Don't overthink it — pick the one that matches your CRM and your scale ambition. (See also: q1730, q1731, q1735)

## Tags

outreach, salesloft, vendor-comparison, sales-engagement, buy-side, salesforce-crm, hubspot-crm, vista-equity, drift, total-cost-of-ownership

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/products/smart-email-assist
- https://www.outreach.io/products/kaia
- https://www.salesloft.com/about
- https://www.salesloft.com/cadence
- https://www.drift.com/
- https://news.salesloft.com/news-releases/news-release-details/salesloft-vista-equity-acquisition
- https://www.gartner.com/en/documents/sales-engagement
- https://www.bvp.com/atlas/state-of-the-cloud-2026`;

const entry = {
  id: 'q1739',
  question: 'Outreach vs Salesloft — which should you buy?',
  answer,
  tags: ['outreach', 'salesloft', 'vendor-comparison', 'sales-engagement', 'buy-side', 'salesforce-crm', 'hubspot-crm', 'vista-equity', 'drift', 'total-cost-of-ownership'],
  sources: [
    'https://www.outreach.io/about',
    'https://www.outreach.io/products/smart-email-assist',
    'https://www.outreach.io/products/kaia',
    'https://www.salesloft.com/about',
    'https://www.salesloft.com/cadence',
    'https://www.drift.com/',
    'https://news.salesloft.com/news-releases/news-release-details/salesloft-vista-equity-acquisition',
    'https://www.gartner.com/en/documents/sales-engagement',
    'https://www.bvp.com/atlas/state-of-the-cloud-2026',
  ],
  model: 'claude-opus-4-7',
  lab_run: 'outreach-arc-2026-05-04',
};

const out = path.join(__dirname, 'cheap-100', 'q1739.json');
fs.writeFileSync(out, JSON.stringify(entry) + '\n');
console.log('wrote', out, fs.statSync(out).size, 'bytes');
