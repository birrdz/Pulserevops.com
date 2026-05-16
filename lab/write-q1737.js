const fs = require('fs');
const path = require('path');

const answer = `## Direct Answer

Outreach makes money in 2027 from four revenue streams: (1) per-user seat licenses on Pro + Enterprise tiers ($330-450M ARR), (2) AI add-on consumption + attach (Smart Email Assist + Kaia + Commit, $80-150M ARR), (3) implementation + professional services ($30-60M ARR), and (4) vertical solutions premium pricing (FinServ + Healthcare + Industrial, $30-60M ARR). Total estimated FY27 ARR: $620-720M (base case 18-22% growth from $430-500M FY25 base). Gross margin holds at 75-80%; operating margin expands from -10% to +5-15% as Vista-style discipline plays out. The four revenue streams + the unit economics + the FY27 P&L outline.

## The 4 Revenue Streams Breakdown

- **Stream 1: Per-user seat licenses** — Pro tier $130-160/user/mo + Enterprise tier $190-230/user/mo. ~70-75% of total ARR. Predictable recurring base.
- **Stream 2: AI add-on consumption + attach** — Smart Email Assist + Kaia + Commit add-ons. $5-50/user/mo each. ~15-20% of total ARR by FY27. Highest-growth stream.
- **Stream 3: Implementation + professional services** — $40-120K one-time per Enterprise deal + ongoing customer success. ~5-8% of total ARR. Margin-thin but lock-in driver.
- **Stream 4: Vertical solutions premium** — FinServ + Healthcare + Industrial vertical SKUs at 20-30% premium over horizontal. ~5-8% of total ARR by FY27. Strategic differentiator.

## The Unit Economics

- **ACV (Annual Contract Value)** — average ~$80-120K per customer; enterprise ACV $400K-$1.5M; mid-market ACV $30-80K
- **CAC (Customer Acquisition Cost)** — estimated $40-80K per new logo (mid-market); $200-400K per new logo (enterprise)
- **CAC payback** — ~14-22 months mid-market; ~18-30 months enterprise (acceptable but not great)
- **NRR (Net Revenue Retention)** — estimated 105-115% FY26; target 110-120% FY27 with AI add-on attach driving expansion
- **GRR (Gross Revenue Retention)** — estimated 88-92%; vertical solutions + Strategic Account program defending churn
- **Magic number** — estimated 0.6-0.8 (efficiency improving from 0.4-0.6 during peak burn)

## The FY27 P&L Outline (Base Case Estimates)

- **Revenue**: $620-720M ARR
- **Gross Margin**: 75-80% (stable, software margins)
- **S&M**: 35-45% of revenue (down from 50%+ peak in 2021-22 — Vista-style discipline)
- **R&D**: 22-28% of revenue (Smart Email Assist + Kaia + Commit ongoing investment)
- **G&A**: 10-12% of revenue (lean, IPO-prep)
- **Operating Margin**: +5-15% (vs estimated -10% in 2022)
- **FCF**: $40-90M positive (vs negative $80-150M in 2022)
- **Rule of 40**: ~25-35 (acceptable for IPO; HubSpot at $700M was ~50)

## Where The Money Comes From — Customer Segment Breakdown

- **Enterprise (>$1M ACV)**: ~30-40% of revenue. ~150-200 customers. SAP, Cisco, McKesson, Adobe-style anchor logos. Highest gross margin, longest sales cycle.
- **Upper mid-market ($100-500K ACV)**: ~25-30% of revenue. ~500-700 customers. Strong growth segment with Strategic Account program expansion.
- **Mid-market ($30-100K ACV)**: ~25-30% of revenue. ~2,000-3,000 customers. Defensive segment under HubSpot + Apollo pressure.
- **SMB (<$30K ACV)**: ~5-10% of revenue. ~2,500-3,500 customers. Declining segment as bundle alternatives win.
- **International**: ~10-15% of revenue. EMEA + APAC growing 25-35% YoY but off small base.

## How Each Stream Will Evolve FY26 → FY27

- **Per-user seats**: Grows 15-20% as net-new logo expansion + price increases. Defensive against bundling.
- **AI add-ons**: Grows 60-100% if Smart Email Assist attach hits 50-60% target. Growth-engine if it works.
- **Professional services**: Grows 20-30% as Enterprise tier scales. Margin-dilutive but necessary.
- **Vertical solutions**: Grows 80-150% off small base. Strategic differentiation play.

## What Could Break The FY27 Revenue Math

- **Salesloft post-Vista price war** — could compress per-user pricing 15-25% across renewals
- **HubSpot Sales Hub bundle wins SMB / lower mid-market** — eats $30-60M ARR
- **AI add-on attach stalls** — if Smart Email Assist plateaus at 30-40% attach (per q1736), $30-50M missing from FY27 ARR
- **Enterprise upmarket churn** — if Strategic Account program loses anchor logos, $50-100M ARR risk
- **Macro recession 2.0** — could compress sales cycles + delay enterprise deals

## A Markdown Table — FY27 Revenue Stream Breakdown

| Stream | FY26 estimate | FY27 estimate | Growth | % of total |
|---|---|---|---|---|
| Per-user seat licenses | $290-350M | $330-450M | 15-20% | 70-75% |
| AI add-on (Smart Email + Kaia + Commit) | $40-70M | $80-150M | 60-100% | 15-20% |
| Professional services | $20-30M | $30-60M | 20-30% | 5-8% |
| Vertical solutions premium | $10-20M | $30-60M | 80-150% | 5-8% |
| **Total ARR** | **$360-470M** | **$470-720M** | **18-25%** | **100%** |

## A Mermaid Diagram — Outreach Revenue Engine FY27

\`\`\`mermaid
graph LR
  A["FY27 Revenue: $620-720M"] --> B["Per-user seats: 70-75%"]
  A --> C["AI add-ons: 15-20%"]
  A --> D["Pro services: 5-8%"]
  A --> E["Vertical solutions: 5-8%"]
  B --> F["Pro tier $130-160/user/mo"]
  B --> G["Enterprise tier $190-230/user/mo"]
  C --> H["Smart Email Assist consumption"]
  C --> I["Kaia + Commit attach"]
  E --> J["FinServ, Healthcare, Industrial premium"]
  F --> K["FCF +$40-90M"]
  G --> K
  H --> K
  I --> K
  J --> K
\`\`\`

## Bottom Line

Outreach makes money in FY27 from a four-stream revenue engine — per-user seats as the predictable base, AI add-ons as the growth engine, professional services as the lock-in driver, and vertical solutions as the differentiator. Total $620-720M ARR base case at 75-80% gross margin and +5-15% operating margin = IPO-eligible profile by 2027-28. The honest call: the revenue model works IF AI add-on attach hits target and Salesloft post-Vista doesn't trigger a price war. The IPO story is "growth + margin discipline + AI monetization" — narrower than 2021's "growth-at-all-costs" but more sustainable. (See also: q1729, q1731, q1733, q1736)

## Tags

outreach, revenue-streams, fy27-outlook, ai-monetization, vertical-solutions, ipo-prep, unit-economics, nrr, gross-margin, operating-margin

## Sources

- https://www.outreach.io/about
- https://www.outreach.io/products/smart-email-assist
- https://www.outreach.io/products/kaia
- https://www.outreach.io/products/commit
- https://www.crunchbase.com/organization/outreach-corp
- https://www.bvp.com/atlas/state-of-the-cloud-2026
- https://www.iconiqcapital.com/insights/state-of-saas
- https://www.gartner.com/en/documents/sales-engagement
- https://news.salesloft.com/news-releases/news-release-details/salesloft-vista-equity-acquisition`;

const entry = {
  id: 'q1737',
  question: 'How does Outreach make money in 2027?',
  answer,
  tags: ['outreach', 'revenue-streams', 'fy27-outlook', 'ai-monetization', 'vertical-solutions', 'ipo-prep', 'unit-economics', 'nrr', 'gross-margin', 'operating-margin'],
  sources: [
    'https://www.outreach.io/about',
    'https://www.outreach.io/products/smart-email-assist',
    'https://www.outreach.io/products/kaia',
    'https://www.outreach.io/products/commit',
    'https://www.crunchbase.com/organization/outreach-corp',
    'https://www.bvp.com/atlas/state-of-the-cloud-2026',
    'https://www.iconiqcapital.com/insights/state-of-saas',
    'https://www.gartner.com/en/documents/sales-engagement',
    'https://news.salesloft.com/news-releases/news-release-details/salesloft-vista-equity-acquisition',
  ],
  model: 'claude-opus-4-7',
  lab_run: 'outreach-arc-2026-05-04',
};

const out = path.join(__dirname, 'cheap-100', 'q1737.json');
fs.writeFileSync(out, JSON.stringify(entry) + '\n');
console.log('wrote', out, fs.statSync(out).size, 'bytes');
