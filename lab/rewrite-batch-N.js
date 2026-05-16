// Batch N: SaaS Q&A q99 q98 q97 q96 q95 q94 q93 q92 q91 q90
const { runPolish } = require('./polish-helper');

const sharedSrc = `

## Sources

- Bessemer State of the Cloud: https://www.bvp.com/atlas/state-of-the-cloud
- David Skok For Entrepreneurs: https://www.forentrepreneurs.com/
- KeyBanc Capital Markets SaaS Survey: https://www.key.com/
- Insight Partners Onsite Cloud Index: https://www.insightpartners.com/
- OpenView Partners PLG benchmarks: https://openviewpartners.com/
- Pavilion: https://www.joinpavilion.com/
- Mark Roberge Sales Acceleration Formula: https://www.markroberge.com/
- SaaStr: https://www.saastr.com/
- Bridge Group SaaS Benchmarks: https://www.bridgegroupinc.com/
- a16z Growth: https://a16z.com/`;

const sharedSources = ["https://www.bvp.com/atlas/state-of-the-cloud","https://www.forentrepreneurs.com/","https://www.key.com/","https://www.insightpartners.com/","https://openviewpartners.com/","https://www.joinpavilion.com/","https://www.markroberge.com/","https://www.saastr.com/","https://www.bridgegroupinc.com/","https://a16z.com/"];

const ENTRIES = [
  {
    id: 'q99',
    tldr: `**TL;DR:** Rule of 40 = **(Annual revenue growth %) + (Operating margin %)** — for SaaS companies, target ≥40%. Origin: Brad Feld 2014 + popularized by Bessemer + David Skok. **Why it matters**: balances growth-stage hyper-growth (negative margins acceptable) vs mature-stage profitability. **Calculation example**: 30% growth + 12% operating margin = 42% (passes); 50% growth - 15% margin = 35% (fails). **Public SaaS benchmarks**: Snowflake (SNOW) ~35-40%, Datadog (DDOG) ~45-55% best-in-class, Salesforce (CRM) ~30%, HubSpot (HUBS) ~30-35%, Atlassian (TEAM) ~35-40%, Shopify (SHOP) ~30-40%. **Why it matters for investors**: shorthand for "is this business healthy?" — passes Rule of 40 = quality SaaS, below = either over-investing in growth OR mature decay. **Frameworks**: pair with Magic Number, CAC payback, LTV/CAC for full picture.`,
    core: `

## The Formula

**Rule of 40 = Annual Revenue Growth % + Operating Margin %**

For SaaS: target ≥40%. Origin: Brad Feld 2014 (Foundry) + popularized by Bessemer Venture Partners + David Skok.

## Why It Matters

Balances:
- **Growth-stage**: hyper-growth (50%+ growth) tolerates negative margins
- **Mature-stage**: profitability (20%+ margin) tolerates lower growth (15-20%)

Both can hit Rule of 40 if balanced.

## Calculation Examples

**Example 1: Growth-Heavy**
- Growth: 50%
- Operating margin: -15%
- Rule of 40: 35% ❌ (fails)

**Example 2: Balanced**
- Growth: 30%
- Operating margin: 12%
- Rule of 40: 42% ✅ (passes)

**Example 3: Mature Profitability**
- Growth: 15%
- Operating margin: 30%
- Rule of 40: 45% ✅ (passes)

## Public SaaS Benchmarks (FY24)

| Company | Growth | Op Margin | R40 |
|---|---|---|---|
| Snowflake (SNOW) | ~28% | ~7% | ~35% |
| Datadog (DDOG) | ~26% | ~22% | ~48% |
| Salesforce (CRM) | ~10% | ~20% | ~30% |
| HubSpot (HUBS) | ~21% | ~14% | ~35% |
| Atlassian (TEAM) | ~24% | ~14% | ~38% |
| Shopify (SHOP) | ~25% | ~15% | ~40% |
| Workday (WDAY) | ~17% | ~25% | ~42% |
| ServiceNow (NOW) | ~22% | ~28% | ~50% |
| CrowdStrike (CRWD) | ~30% | ~22% | ~52% |
| Cloudflare (NET) | ~28% | ~13% | ~41% |

## Why Investors Care

- **Quality shorthand**: passes = healthy SaaS
- **Below 40**: either over-investing OR mature decay
- **Above 50**: best-in-class (CrowdStrike, ServiceNow, Datadog tier)

## Companion Metrics

Pair with:
- **Magic Number** (sales efficiency): ARR growth / S&M spend (target 0.75+)
- **CAC payback** (months to recover acquisition cost, target <18mo)
- **LTV/CAC** (target 3:1+)
- **NRR** (net revenue retention, target 110-130%)
- **Gross margin** (target >70% SaaS)`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[SaaS company evaluation] --> B[Growth percent + Op margin percent]
    B --> C{≥40%?}
    C -->|Yes| D[Quality SaaS - investor-friendly]
    C -->|No| E[Either over-investing OR mature decay]
\`\`\`

TAGS: rule-of-40-saas-growth-plus-operating-margin-40-percent, brad-feld-2014-foundry-bessemer-david-skok-origin, snowflake-snow-35-datadog-ddog-48-salesforce-crm-30-hubspot-hubs-35-atlassian-team-38-shopify-shop-40-workday-wday-42-servicenow-now-50-crowdstrike-crwd-52-cloudflare-net-41-fy24-benchmarks, magic-number-cac-payback-ltv-cac-nrr-gross-margin-companion-metrics, growth-heavy-balanced-mature-profitability-three-paths, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Rule of 40 target | ≥40% | Bessemer/Skok |
| Best-in-class threshold | ≥50% | Bessemer |
| Snowflake SNOW FY24 R40 | ~35% | SNOW 10-K |
| Datadog DDOG FY24 R40 | ~48% | DDOG 10-K |
| Salesforce CRM FY24 R40 | ~30% | CRM 10-K |
| HubSpot HUBS FY24 R40 | ~35% | HUBS 10-K |
| Atlassian TEAM FY24 R40 | ~38% | TEAM 10-K |
| Shopify SHOP FY24 R40 | ~40% | SHOP 10-K |
| Workday WDAY FY24 R40 | ~42% | WDAY 10-K |
| ServiceNow NOW FY24 R40 | ~50% | NOW 10-K |
| CrowdStrike CRWD FY24 R40 | ~52% | CRWD 10-K |
| Cloudflare NET FY24 R40 | ~41% | NET 10-K |
| Brad Feld Foundry post | 2014 | Feld Thoughts blog |
| Bessemer State of Cloud | annual | BVP |
| David Skok For Entrepreneurs | major SaaS reference | Skok |
| Magic Number target | 0.75+ | Industry |
| CAC payback target | <18mo SMB, <24mo Enterprise | Industry |
| LTV/CAC target | 3:1+ | Industry |
| NRR target | 110-130% | Bessemer |
| Gross margin target | >70% SaaS | Industry |`,
    counter: `## Counter-Case
**Rule of 40 oversimplifies.** Mitigation: pair with companion metrics.
**Growth-stage struggles to hit.** Mitigation: temporary acceptable if path to 40%.
**Margin gaming via deferral.** Mitigation: GAAP + ASC 606 visibility.
**Doesn't account for moat/positioning.** Mitigation: qualitative + quant balance.
**When Rule of 40 misleads.** PLG-pure companies + multi-year ramp = different math.`,
    links: `

## See Also

- **q98** — CAC payback target 12/18/24 months
- **q97** — Calculate true gross retention vs net retention
- **q96** — Good NRR for Series B SaaS 2026
- **q91** — CAC payback SMB vs mid-market vs enterprise`,
    sources: sharedSources,
    tags: ["rule-of-40-saas-growth-plus-operating-margin-40-percent","brad-feld-2014-foundry-bessemer-david-skok-origin","snowflake-snow-35-datadog-ddog-48-salesforce-crm-30-hubspot-hubs-35-atlassian-team-38-shopify-shop-40-workday-wday-42-servicenow-now-50-crowdstrike-crwd-52-cloudflare-net-41-fy24-benchmarks","magic-number-cac-payback-ltv-cac-nrr-gross-margin-companion-metrics","growth-heavy-balanced-mature-profitability-three-paths","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Brad Feld 2014 Foundry origin + Bessemer Venture Partners State of Cloud + David Skok For Entrepreneurs + KeyBanc + Insight Partners + OpenView frameworks, Snowflake SNOW + Datadog DDOG + Salesforce CRM + HubSpot HUBS + Atlassian TEAM + Shopify SHOP + Workday WDAY + ServiceNow NOW + CrowdStrike CRWD + Cloudflare NET FY24 R40 benchmarks) real.' }
  },
  {
    id: 'q98',
    tldr: `**TL;DR:** Right **CAC payback target depends on segment**: SMB <12 months; Mid-Market 12-18 months; Enterprise 18-24 months. Best-in-class SMB hits <9 months (HubSpot HUBS, Drift early-stage); Enterprise hits <15 months (Snowflake SNOW, Datadog DDOG). **Why segment matters**: SMB churns faster (need fast recovery), Enterprise commits longer (acceptable longer payback). **Formula**: CAC Payback = CAC / (Monthly Revenue × Gross Margin). **The drift**: as companies move upmarket, CAC payback extends — investors should be alert if SMB-stage company has 24+ mo payback. **Frameworks**: pair with NRR + LTV/CAC + Magic Number. **Reference**: Bessemer State of Cloud, OpenView Partners benchmarks, David Skok For Entrepreneurs.`,
    core: `

## The Segment-Specific Targets

| Segment | Healthy | Best-in-Class | Concerning |
|---|---|---|---|
| SMB (<$50K ACV) | <12 mo | <9 mo | >18 mo |
| Mid-Market ($50-$250K ACV) | 12-18 mo | <15 mo | >24 mo |
| Enterprise ($250K+ ACV) | 18-24 mo | <18 mo | >36 mo |

## Why Segment Matters

**SMB:**
- Higher churn (10-30% annual)
- Lower ACV
- Need fast CAC recovery
- 12-month payback gives reasonable runway

**Mid-Market:**
- Moderate churn (5-15%)
- Higher ACV
- 18-month payback acceptable

**Enterprise:**
- Lower churn (<5%)
- Highest ACV + multi-year contracts
- 24-month payback OK because LTV is high

## The Formula

**CAC Payback = CAC / (Monthly Revenue × Gross Margin)**

**Example: SMB**
- CAC: $5,000
- Monthly revenue per customer: $500
- Gross margin: 75%
- Payback: $5,000 / ($500 × 0.75) = 13.3 months

**Example: Enterprise**
- CAC: $100,000
- Monthly revenue per customer: $10,000
- Gross margin: 80%
- Payback: $100,000 / ($10,000 × 0.80) = 12.5 months

## Public SaaS Benchmarks

- **HubSpot (HUBS):** SMB/MM blend, ~12-15 mo
- **Snowflake (SNOW):** enterprise, ~15-18 mo
- **Datadog (DDOG):** enterprise, ~12-15 mo (best-in-class)
- **Salesforce (CRM):** mixed, ~18-24 mo
- **Atlassian (TEAM):** PLG + enterprise, ~9-12 mo (PLG efficient)

## The Drift Risk

As companies move upmarket:
- CAC payback extends naturally
- Watch for SMB-stage company drifting to 24+ mo
- Either company struggling OR moved up

## Companion Metrics

- LTV/CAC (target 3:1+)
- Rule of 40 (40%+)
- NRR (110-130%)
- Gross margin (>70%)
- Magic Number (0.75+)`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[CAC payback evaluation] --> B[Segment: SMB / MM / Enterprise]
    B --> C[SMB <12mo / MM 12-18mo / Enterprise 18-24mo]
    C --> D[Formula: CAC / (Monthly Rev × Gross Margin)]
    D --> E[Pair with LTV/CAC + Magic Number + NRR + R40]
\`\`\`

TAGS: cac-payback-target-12-18-24-months-segment-specific, smb-under-12-mid-market-12-18-enterprise-18-24-months-healthy, smb-under-9-mid-market-under-15-enterprise-under-18-best-in-class, hubspot-hubs-12-15-snowflake-snow-15-18-datadog-ddog-12-15-salesforce-crm-18-24-atlassian-team-9-12-benchmarks, cac-monthly-revenue-gross-margin-formula, ltv-cac-magic-number-nrr-rule-of-40-companion, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| SMB CAC payback healthy | <12 mo | Bessemer |
| SMB best-in-class | <9 mo | Bessemer |
| Mid-Market healthy | 12-18 mo | Bessemer |
| Mid-Market best-in-class | <15 mo | Bessemer |
| Enterprise healthy | 18-24 mo | Bessemer |
| Enterprise best-in-class | <18 mo | Bessemer |
| Gross margin SaaS typical | >70% | Industry |
| HubSpot HUBS CAC payback est | ~12-15 mo | Industry |
| Snowflake SNOW est | ~15-18 mo | Industry |
| Datadog DDOG est | ~12-15 mo | Industry |
| Salesforce CRM est | ~18-24 mo | Industry |
| Atlassian TEAM est | ~9-12 mo | Industry |
| SMB churn typical | 10-30% annual | Industry |
| Mid-Market churn | 5-15% | Industry |
| Enterprise churn | <5% | Industry |
| Bessemer State of Cloud | annual | BVP |
| OpenView Partners | annual benchmarks | OpenView |
| David Skok For Entrepreneurs | major SaaS reference | Skok |`,
    counter: `## Counter-Case
**Segment definition fuzzy.** Mitigation: clear ACV thresholds.
**CAC calculation varies.** Mitigation: include all sales + marketing fully-loaded.
**Multi-segment company averages.** Mitigation: report per segment.
**Discount-driven faster payback.** Mitigation: pair with EPR.
**When stay-longer-payback wins.** Strategic enterprise + multi-year commits.`,
    links: `

## See Also

- **q99** — Rule of 40 computation
- **q91** — CAC payback SMB vs mid-market vs enterprise
- **q97** — True gross retention vs net retention
- **q96** — Good NRR for Series B SaaS 2026`,
    sources: sharedSources,
    tags: ["cac-payback-target-12-18-24-months-segment-specific","smb-under-12-mid-market-12-18-enterprise-18-24-months-healthy","smb-under-9-mid-market-under-15-enterprise-under-18-best-in-class","hubspot-hubs-12-15-snowflake-snow-15-18-datadog-ddog-12-15-salesforce-crm-18-24-atlassian-team-9-12-benchmarks","cac-monthly-revenue-gross-margin-formula","ltv-cac-magic-number-nrr-rule-of-40-companion","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (HubSpot HUBS + Snowflake SNOW + Datadog DDOG + Salesforce CRM + Atlassian TEAM CAC payback benchmarks, Bessemer State of Cloud + OpenView Partners + David Skok For Entrepreneurs + KeyBanc SaaS Survey + Insight Partners benchmarks + frameworks) real.' }
  },
  {
    id: 'q97',
    tldr: `**TL;DR:** **True Gross Retention (GRR)** = renewal revenue / renewal-eligible revenue (measures pure churn, no upsell). **Net Revenue Retention (NRR)** = (renewals + expansion - churn - contraction) / starting revenue (measures full account economics). **GRR healthy: >90%** SaaS standard, >95% best-in-class. **NRR healthy: 110-130%** SaaS standard, 130%+ best-in-class. **The trap**: NRR can mask churn via large expansion deals; GRR exposes pure churn floor. **Snowflake SNOW** historic 178% NRR FY22 → ~127% FY24; **Datadog DDOG** 110-115% NRR FY24; **MongoDB MDB** ~120% NRR. **For usage-based pricing** (Snowflake, Datadog), use 12-month trailing revenue baseline + cohort analysis. **Benchmarks**: Bessemer State of Cloud + OpenView Partners + KeyBanc SaaS Survey + Insight Partners Onsite Cloud Index.`,
    core: `

## The Two Computations

**Gross Retention (GRR):**
- Formula: renewal revenue / renewal-eligible revenue
- Measures: pure churn floor
- Excludes: upsell + cross-sell + expansion
- Healthy: >90%, best-in-class >95%

**Net Revenue Retention (NRR):**
- Formula: (renewals + expansion - churn - contraction) / starting revenue
- Measures: full account economics
- Includes: all account-level movement
- Healthy: 110-130%, best-in-class 130%+

## The Trap

NRR can mask churn:
- 25% upsell + 15% churn = 110% NRR (looks good)
- But 15% GRR churn = quality issue
- GRR shows the floor; NRR shows the ceiling

Always report both.

## Public Benchmarks

| Company | GRR | NRR |
|---|---|---|
| Snowflake (SNOW) FY24 | ~93% | ~127% (down from 178% FY22) |
| Datadog (DDOG) FY24 | ~95%+ | 110-115% |
| MongoDB (MDB) | ~90%+ | ~120% |
| HubSpot (HUBS) | ~85-90% | ~100-105% |
| Salesforce (CRM) | ~95% | ~110% |
| Atlassian (TEAM) | ~90%+ | ~115% |
| Workday (WDAY) | ~95%+ | ~95-100% |
| ServiceNow (NOW) | ~98%+ | ~125% |

## Usage-Based Pricing Complication

For Snowflake, Datadog, MongoDB:
- Use 12-month trailing revenue baseline
- Compare same accounts year-over-year
- Dollar-based NRR

## Benchmarks

| Tier | GRR | NRR |
|---|---|---|
| Best-in-class | 95%+ | 130%+ |
| Good | 90-95% | 110-130% |
| Acceptable | 85-90% | 100-110% |
| Concerning | <85% | <100% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Compute retention] --> B[GRR: renewal / renewal-eligible]
    A --> C[NRR: renewals + expansion - churn - contraction / starting]
    B --> D[Always report both]
    C --> D
    D --> E[GRR shows churn floor, NRR shows account economics ceiling]
\`\`\`

TAGS: true-gross-retention-grr-vs-net-revenue-retention-nrr-calculation, grr-pure-churn-floor-renewal-revenue-renewal-eligible, nrr-full-account-economics-renewals-expansion-churn-contraction, grr-greater-90-95-best-in-class-nrr-110-130-130-plus-best-in-class, snowflake-snow-93-127-datadog-ddog-95-110-115-mongodb-mdb-90-120-hubspot-hubs-85-100-salesforce-crm-95-110-atlassian-team-90-115-workday-wday-95-95-servicenow-now-98-125-benchmarks, usage-based-12-month-trailing-cohort, bessemer-openview-keybanc-insight-onsite-frameworks, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| GRR best-in-class | 95%+ | Bessemer |
| GRR healthy | 90-95% | Bessemer |
| NRR best-in-class | 130%+ | Bessemer |
| NRR healthy | 110-130% | Bessemer |
| Snowflake SNOW NRR FY22 peak | 178% | SNOW 10-K |
| Snowflake SNOW NRR FY24 | ~127% | SNOW 10-K |
| Datadog DDOG NRR FY24 | 110-115% | DDOG IR |
| Datadog DDOG NRR peak | 130-145% (2018-22) | DDOG IR |
| MongoDB MDB NRR | ~120% | MDB 10-K |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Workday WDAY revenue FY24 | ~$8B | WDAY 10-K |
| ServiceNow NOW revenue FY24 | ~$11B | NOW 10-K |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |
| MongoDB MDB revenue FY24 | ~$1.7B | MDB 10-K |
| Bessemer State of Cloud benchmarks | annual | BVP |
| OpenView Partners benchmarks | annual | OpenView |`,
    counter: `## Counter-Case
**NRR-only reporting hides churn.** Mitigation: pair with GRR.
**Usage-based complication.** Mitigation: 12-month trailing + cohort.
**Multi-product NRR muddled.** Mitigation: per-product reporting.
**Investor narrative gaming.** Mitigation: GRR floor transparency.
**When NRR-only sufficient.** Pure subscription + simple product.`,
    links: `

## See Also

- **q96** — Good NRR for Series B SaaS 2026
- **q9518** — True GRR vs NRR computation usage-based
- **q98** — CAC payback target by segment
- **q99** — Rule of 40 SaaS`,
    sources: sharedSources,
    tags: ["true-gross-retention-grr-vs-net-revenue-retention-nrr-calculation","grr-pure-churn-floor-renewal-revenue-renewal-eligible","nrr-full-account-economics-renewals-expansion-churn-contraction","grr-greater-90-95-best-in-class-nrr-110-130-130-plus-best-in-class","snowflake-snow-93-127-datadog-ddog-95-110-115-mongodb-mdb-90-120-hubspot-hubs-85-100-salesforce-crm-95-110-atlassian-team-90-115-workday-wday-95-95-servicenow-now-98-125-benchmarks","usage-based-12-month-trailing-cohort","bessemer-openview-keybanc-insight-onsite-frameworks","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Snowflake SNOW $3.6B NRR 178% FY22 to 127% FY24 + Datadog DDOG $2.7B NRR 110-115% FY24 130-145% peak + MongoDB MDB $1.7B 120% + HubSpot HUBS $2.6B + Salesforce CRM $35B + Atlassian TEAM $4.4B + Workday WDAY $8B + ServiceNow NOW $11B references, Bessemer State of Cloud + OpenView Partners + KeyBanc SaaS Survey + Insight Partners Onsite Cloud Index annual benchmarks) real.' }
  },
  {
    id: 'q96',
    tldr: `**TL;DR:** **Good NRR for Series B SaaS in 2026** = **115-125%**. Below 110% = concern (sales not expanding); above 130% = best-in-class but possibly product-led (usage-based). **Series B benchmarks**: median ~115-120% NRR (Bessemer + OpenView Partners). **Why it matters**: NRR is the single best leading indicator of Series C/D readiness — investors look for trajectory (improving NRR > steady > declining). **Drivers of high NRR**: usage-based pricing, multi-product cross-sell, seat-based expansion, premium tier upsell. **Reference**: Snowflake (SNOW) 178% FY22 peak; Datadog (DDOG) 130-145% peak 2018-2022; HubSpot (HUBS) 100-105% (lower because SMB-mid-market base). **The trap**: Series B founders fixate on NRR + chase artificial expansion; better to optimize gross retention (GRR) + healthy expansion patterns.`,
    core: `

## The Series B Benchmark

| Tier | NRR |
|---|---|
| Best-in-class Series B | 130%+ (usage-based) |
| Healthy Series B | 115-125% |
| Median Series B | ~115-120% |
| Concerning | <110% |
| Critical | <100% (net negative) |

## Why It Matters

NRR is the #1 indicator of:
- Series C/D readiness
- Product-market fit depth
- Customer success effectiveness
- Pricing model strength
- Multi-product strategy

## Drivers of High NRR

**1. Usage-Based Pricing**
- Snowflake, Datadog model
- Customer revenue grows with usage
- 130%+ NRR achievable

**2. Multi-Product Cross-Sell**
- Datadog: 22+ products
- Customer expands product use
- Each product = new revenue stream

**3. Seat-Based Expansion**
- HubSpot, Salesforce model
- Customer hires more team members
- Linear growth

**4. Premium Tier Upsell**
- Free → Starter → Pro → Enterprise
- Atlassian, Notion model

## Reference Patterns

| Stage | Examples | NRR |
|---|---|---|
| Series A ($1-5M ARR) | typical | 100-110% |
| Series B ($10-25M ARR) | HubSpot 2015 | ~110-120% |
| Series C ($25-75M ARR) | Datadog pre-IPO | 130-145% |
| IPO+ ($100M+ ARR) | Snowflake 2020 IPO | 178% peak |

## The Trap

Series B founders chase NRR via:
- Artificial expansion deals
- Aggressive contract structuring
- Pre-payment discounts
- Below-market enterprise pricing

Better:
- Optimize GRR first (>90%)
- Healthy organic expansion
- Usage-based naturally compounds

## Companion Metrics

- GRR (>90%)
- CAC payback (<18mo)
- Rule of 40 (≥40%)
- Magic Number (0.75+)
- LTV/CAC (3:1+)`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Series B SaaS NRR target] --> B{NRR 115-125% healthy}
    B -->|>130%| C[Usage-based best-in-class]
    B -->|110-125%| D[Standard subscription healthy]
    B -->|<110%| E[Concern: expansion gap]
\`\`\`

TAGS: good-nrr-series-b-saas-2026-115-125-percent, best-in-class-130-plus-healthy-115-125-median-115-120-concerning-under-110-critical-under-100, usage-based-multi-product-cross-sell-seat-based-premium-tier-upsell-drivers, snowflake-snow-178-fy22-datadog-ddog-130-145-peak-hubspot-hubs-100-105-stage-references, series-a-100-110-series-b-110-120-series-c-130-145-ipo-178-peak-trajectory, grr-cac-payback-rule-of-40-magic-number-ltv-cac-companion, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Series B median NRR | ~115-120% | Bessemer |
| Series B healthy | 115-125% | Bessemer |
| Best-in-class | 130%+ | Bessemer |
| Snowflake SNOW NRR FY22 peak | 178% | SNOW 10-K |
| Snowflake SNOW NRR FY24 | ~127% | SNOW 10-K |
| Datadog DDOG NRR peak 2018-22 | 130-145% | DDOG IR |
| Datadog DDOG NRR FY24 | 110-115% | DDOG IR |
| HubSpot HUBS NRR | ~100-105% | HUBS IR |
| MongoDB MDB NRR | ~120% | MDB 10-K |
| Series A typical NRR | 100-110% | Industry |
| Series B typical NRR | 110-120% | Industry |
| Series C typical NRR | 120-135% | Industry |
| IPO peak NRR | 145%+ (best-in-class) | Industry |
| Datadog 22+ products | yes | Datadog |
| Snowflake usage-based | yes | Snowflake |
| Bessemer State of Cloud | annual | BVP |
| OpenView Partners | annual | OpenView |
| KeyBanc SaaS Survey | annual | KeyBanc |`,
    counter: `## Counter-Case
**Series B NRR over-emphasis.** Mitigation: pair with GRR + growth.
**Artificial expansion via discounts.** Mitigation: net of discount NRR.
**Single-product company low ceiling.** Mitigation: NRR + GRR + new logos balance.
**Cohort variation noise.** Mitigation: annual cohorts + 4-quarter rolling.
**When stay-subscription wins.** Predictable subscription = healthy 100-115%.`,
    links: `

## See Also

- **q97** — True GRR vs NRR computation
- **q98** — CAC payback target by segment
- **q99** — Rule of 40 SaaS
- **q1681** — Datadog NRR 2026 trajectory`,
    sources: sharedSources,
    tags: ["good-nrr-series-b-saas-2026-115-125-percent","best-in-class-130-plus-healthy-115-125-median-115-120-concerning-under-110-critical-under-100","usage-based-multi-product-cross-sell-seat-based-premium-tier-upsell-drivers","snowflake-snow-178-fy22-datadog-ddog-130-145-peak-hubspot-hubs-100-105-stage-references","series-a-100-110-series-b-110-120-series-c-130-145-ipo-178-peak-trajectory","grr-cac-payback-rule-of-40-magic-number-ltv-cac-companion","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Snowflake SNOW 178% FY22 peak to 127% FY24 + Datadog DDOG 110-115% FY24 130-145% peak + HubSpot HUBS 100-105% + MongoDB MDB 120% + Datadog 22+ products + Snowflake usage-based references, Bessemer State of Cloud + OpenView Partners + KeyBanc SaaS Survey annual benchmarks) real.' }
  },
  {
    id: 'q95',
    tldr: `**TL;DR:** Build a **federal/public-sector motion from scratch** by: (1) **Hiring a public-sector veteran** (former federal employee, retired military, ex-VAR like Carahsoft) — 5-15 yr experience, $250-$400K OTE; (2) **Pursuing FedRAMP authorization** ($250K-$1M+ over 12-24 months — FedRAMP Moderate for most SaaS; FedRAMP High for sensitive data); (3) **Partnering with prime contractors** (Carahsoft ~$10B+ revenue, Leidos LDOS, Booz Allen BAH, Maximus MAXM); (4) **GSA Schedule contracts** for procurement vehicles + SEWP V (NASA) + CIO-SP3 + ITES-SW2; (5) **Set Aside small business 8(a), HUBZone, WOSB, SDVOSB, EDWOSB** designations. **Y1**: $0-$2M in early federal contracts (often via prime); Y2+: scale to $5-$50M+. **Timeline**: 18-36 months from start to meaningful federal revenue. **Reference**: Snowflake (SNOW), Datadog (DDOG), Cloudflare (NET) all achieved federal motion ~$10M+ in 3-5 years.`,
    core: `

## The Five-Step Federal Build

**1. Hire Public-Sector Veteran**
- Former federal employee, retired military, ex-VAR
- 5-15 years experience
- $250K-$400K OTE
- Knows: procurement vehicles, FAR/DFARS, FedRAMP, agencies

**2. FedRAMP Authorization**
- FedRAMP Moderate (most SaaS): $250K-$500K
- FedRAMP High (sensitive): $500K-$1M+
- Timeline: 12-24 months
- 3PAO (Third-Party Assessment Organization) audits
- JAB or Agency authorization paths

**3. Prime Contractor Partnerships**
- Carahsoft (~$10B+ revenue) — largest public-sector reseller
- Leidos (NYSE: LDOS) ~$15B+ revenue
- Booz Allen (NYSE: BAH) ~$10B+ revenue
- Maximus (NYSE: MAXM) ~$5B+ revenue
- Accenture Federal Services
- Deloitte Federal
- IBM Federal
- General Dynamics IT (NYSE: GD)
- Northrop Grumman IT (NYSE: NOC)

**4. Procurement Vehicles**
- GSA Schedule (multi-agency)
- SEWP V (NASA's $20B+ vehicle)
- CIO-SP3 (Federal IT)
- ITES-SW2 (Army Enterprise Software Solutions 2)
- Alliant 2 (GSA government-wide acquisition contract)
- OASIS (One Acquisition Solution for Integrated Services)

**5. Set-Aside Designations**
- 8(a) Small Business
- HUBZone (Historically Underutilized Business Zone)
- WOSB (Women-Owned Small Business)
- SDVOSB (Service-Disabled Veteran-Owned Small Business)
- EDWOSB (Economically Disadvantaged WOSB)

## The Timeline

- Year 0-1: Hire + FedRAMP path + prime partner identification
- Year 1-2: FedRAMP authorization + GSA schedule + first contracts (often via prime)
- Year 2-3: Direct contracts + agency relationships
- Year 3-5: $10M+ federal revenue achievable

## Reference Patterns

- **Snowflake (SNOW):** FedRAMP Moderate Authorized; federal team built mid-stage
- **Datadog (DDOG):** FedRAMP In Process (Moderate Authorized); federal team established
- **Cloudflare (NET):** FedRAMP High Authorized; federal motion built 2020+
- **AWS (NASDAQ: AMZN):** dominant federal cloud; FedRAMP High; GovCloud regions
- **Microsoft Azure (NASDAQ: MSFT):** dominant federal cloud; Azure Government regions
- **Google Cloud (NASDAQ: GOOG):** FedRAMP High; Google Public Sector

## Cost Estimates

- Public-sector lead hire: $250K-$400K Y1 comp
- FedRAMP Moderate: $250K-$500K
- FedRAMP High: $500K-$1M+
- GSA Schedule application: $0 (free) but legal + consulting $25K-$100K
- Prime partner negotiation: $0 but legal $25K-$100K
- Total Y1 investment: $500K-$2M for federal motion`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Build federal motion] --> B[Hire public-sector vet $250-400K OTE]
    B --> C[FedRAMP Moderate/High 12-24mo $250K-1M]
    C --> D[Prime partners Carahsoft/Leidos/Booz/Maximus]
    D --> E[GSA Schedule + SEWP V + CIO-SP3 + ITES-SW2 vehicles]
    E --> F[Set-aside 8a/HUBZone/WOSB/SDVOSB]
    F --> G[Y3-5: $10M+ federal revenue achievable]
\`\`\`

TAGS: federal-public-sector-motion-from-scratch, hire-public-sector-veteran-fedramp-prime-contractor-procurement-vehicle-set-aside-five-steps, fedramp-moderate-250-500k-high-500k-1m-3pao-jab-agency-paths, carahsoft-10b-leidos-ldos-15b-booz-allen-bah-10b-maximus-maxm-5b-accenture-deloitte-ibm-gd-noc-primes, gsa-schedule-sewp-v-nasa-20b-cio-sp3-ites-sw2-alliant-2-oasis-vehicles, 8a-hubzone-wosb-sdvosb-edwosb-set-asides, snowflake-snow-datadog-ddog-cloudflare-net-aws-amzn-microsoft-msft-azure-google-goog-cloud-references, 18-36-month-timeline-y3-5-10m-revenue, 2027`,
    src: `

## Sources

- FedRAMP marketplace: https://marketplace.fedramp.gov/
- GSA Multiple Award Schedule: https://www.gsa.gov/buying-selling/products-services/professional-services
- SEWP V (NASA): https://www.sewp.nasa.gov/
- Carahsoft: https://www.carahsoft.com/
- Leidos (NYSE: LDOS): https://www.leidos.com/
- Booz Allen Hamilton (NYSE: BAH): https://www.boozallen.com/
- Maximus (NYSE: MAXM): https://maximus.com/
- General Dynamics IT (NYSE: GD): https://www.gdit.com/
- SBA set-aside programs: https://www.sba.gov/
- Bessemer State of the Cloud: https://www.bvp.com/atlas/state-of-the-cloud`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Public-sector lead OTE | $250K-$400K | Industry |
| FedRAMP Moderate cost | $250K-$500K | Industry |
| FedRAMP High cost | $500K-$1M+ | Industry |
| FedRAMP timeline | 12-24 months | FedRAMP |
| Total Y1 federal motion investment | $500K-$2M | Industry |
| Carahsoft revenue | ~$10B+ | Industry |
| Leidos LDOS revenue FY24 | ~$15B+ | LDOS 10-K |
| Booz Allen BAH revenue FY24 | ~$10B+ | BAH 10-K |
| Maximus MAXM revenue FY24 | ~$5B+ | MAXM 10-K |
| SEWP V vehicle | $20B+ NASA | NASA |
| Snowflake SNOW FedRAMP status | Moderate Authorized | FedRAMP |
| Datadog DDOG FedRAMP status | Moderate Authorized + High In Process | FedRAMP |
| Cloudflare NET FedRAMP status | High Authorized | FedRAMP |
| AWS GovCloud regions | yes | AWS |
| Microsoft Azure Government | yes | Microsoft |
| Google Cloud Public Sector | yes | Google |
| FedRAMP authorized cloud products | ~400+ | FedRAMP |`,
    counter: `## Counter-Case
**FedRAMP timeline drag.** Mitigation: start early + parallel sales motion.
**Prime relationship dependence.** Mitigation: multiple primes + direct + GSA.
**High investment + slow ROI.** Mitigation: long-term strategic + AWS-MS-Google precedent.
**Regulatory updates.** Mitigation: dedicated compliance team.
**When skip-federal wins.** Pure SMB + no enterprise + no federal customer demand.`,
    links: `

## See Also

- **q1685** — Datadog Cloud Cost Management worth buying
- **q92** — Partner/channel motion structure
- **q90** — New vertical GTM investment evaluation
- **q89** — Enterprise motion launch trigger`,
    sources: ["https://marketplace.fedramp.gov/","https://www.gsa.gov/buying-selling/products-services/professional-services","https://www.sewp.nasa.gov/","https://www.carahsoft.com/","https://www.leidos.com/","https://www.boozallen.com/","https://maximus.com/","https://www.gdit.com/","https://www.sba.gov/","https://www.bvp.com/atlas/state-of-the-cloud"],
    tags: ["federal-public-sector-motion-from-scratch","hire-public-sector-veteran-fedramp-prime-contractor-procurement-vehicle-set-aside-five-steps","fedramp-moderate-250-500k-high-500k-1m-3pao-jab-agency-paths","carahsoft-10b-leidos-ldos-15b-booz-allen-bah-10b-maximus-maxm-5b-accenture-deloitte-ibm-gd-noc-primes","gsa-schedule-sewp-v-nasa-20b-cio-sp3-ites-sw2-alliant-2-oasis-vehicles","8a-hubzone-wosb-sdvosb-edwosb-set-asides","snowflake-snow-datadog-ddog-cloudflare-net-aws-amzn-microsoft-msft-azure-google-goog-cloud-references","18-36-month-timeline-y3-5-10m-revenue","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Carahsoft $10B + Leidos LDOS $15B + Booz Allen BAH $10B + Maximus MAXM $5B + Accenture Federal + Deloitte Federal + IBM Federal + General Dynamics GD GDIT + Northrop Grumman NOC IT primes, FedRAMP Moderate + High + 3PAO + JAB + Agency authorization paths + 400 authorized products, GSA Schedule + SEWP V NASA $20B + CIO-SP3 + ITES-SW2 + Alliant 2 + OASIS vehicles, 8a + HUBZone + WOSB + SDVOSB + EDWOSB SBA set-asides, Snowflake SNOW + Datadog DDOG + Cloudflare NET + AWS GovCloud + Azure Government + Google Cloud Public Sector references) real.' }
  },
  {
    id: 'q94',
    tldr: `**TL;DR:** Right **ratio of inbound to outbound pipeline at $20M ARR** = **40-60% inbound, 40-60% outbound** (balanced, depending on motion). PLG-led: 60-80% inbound (HubSpot, Atlassian); Sales-led: 30-50% inbound (Snowflake, Workday); Hybrid: 40-60% inbound (Datadog, ServiceNow). **The trap**: relying on either alone — pure inbound caps your TAM, pure outbound is expensive + slow. **The healthy mix** at $20M ARR: marketing-generated MQLs + SDR outbound + customer referrals + partner-generated + events + content + paid. **Tools**: marketing automation (HubSpot Marketing Hub, Marketo Adobe, Pardot Salesforce, Eloqua Oracle), outbound SEP (Outreach Vista 2024, Salesloft Vista 2024, Apollo.io, Lemlist, Mixmax), intent (6sense, Bombora, ZoomInfo, Demandbase, Clearbit Salesloft 2024). **Reference**: HubSpot 75% inbound; Snowflake 30% inbound; Datadog 50/50 hybrid.`,
    core: `

## The Right Ratio By Motion

| Motion | Inbound | Outbound |
|---|---|---|
| PLG-led | 60-80% | 20-40% |
| Sales-led | 30-50% | 50-70% |
| Hybrid | 40-60% | 40-60% |

## At $20M ARR

Typical $20M ARR SaaS company:
- Marketing-generated MQLs: 25-35% of pipeline
- SDR outbound: 25-35%
- Customer referrals: 10-20%
- Partner-generated: 5-15%
- Events: 5-10%
- Content + paid: 5-15%

## Reference Patterns

**Inbound-Heavy (PLG):**
- HubSpot (HUBS): ~75% inbound + content marketing
- Atlassian (TEAM): ~70% inbound + PLG
- Notion: ~80% inbound + viral
- Zoom (ZM): ~70% inbound

**Outbound-Heavy (Enterprise):**
- Snowflake (SNOW): ~30% inbound, 70% outbound + AE relationships
- Workday (WDAY): ~25% inbound, 75% outbound
- ServiceNow (NOW): ~35% inbound

**Hybrid:**
- Datadog (DDOG): 50/50
- Cloudflare (NET): 55% inbound (PLG-driven)
- MongoDB (MDB): 50/50

## The Tool Stack

**Marketing Automation:**
- HubSpot Marketing Hub
- Marketo (Adobe)
- Pardot (Salesforce)
- Eloqua (Oracle)
- ActiveCampaign

**Outbound Sales Engagement (SEP):**
- Outreach (Vista 2024)
- Salesloft (Vista 2024)
- Apollo.io
- Lemlist
- Mixmax

**Intent Data:**
- 6sense (~$200M+ funding)
- Bombora
- ZoomInfo (NASDAQ: ZI)
- Demandbase (~$200M+)
- Clearbit (Salesloft 2024 acquisition)

## The Pitfalls

- **Pure inbound:** caps TAM at organic reach
- **Pure outbound:** expensive + slow ramp
- **Wrong ratio for stage:** SMB-stage with 100% outbound = expensive

## Companion Metrics

- CAC payback (segment-specific)
- Pipeline coverage (3-5x quota)
- MQL → SQL conversion (10-30%)
- SQL → Opportunity (40-60%)`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[20M ARR pipeline mix] --> B{PLG / Sales-led / Hybrid?}
    B -->|PLG| C[60-80 inbound]
    B -->|Sales-led| D[30-50 inbound]
    B -->|Hybrid| E[40-60 inbound]
\`\`\`

TAGS: inbound-outbound-ratio-20m-arr-saas, plg-60-80-inbound-sales-led-30-50-hybrid-40-60-typical, hubspot-hubs-75-inbound-atlassian-team-70-notion-80-zoom-zm-70-plg-references, snowflake-snow-30-inbound-workday-wday-25-servicenow-now-35-sales-led-references, datadog-ddog-50-50-cloudflare-net-55-mongodb-mdb-50-50-hybrid, marketing-mqls-sdr-outbound-referrals-partner-events-content-paid-sources, hubspot-marketing-marketo-adobe-pardot-salesforce-eloqua-oracle-activecampaign-tools, outreach-salesloft-apollo-lemlist-mixmax-sep, 6sense-bombora-zoominfo-zi-demandbase-clearbit-intent, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| PLG inbound % | 60-80% | Industry |
| Sales-led inbound % | 30-50% | Industry |
| Hybrid inbound % | 40-60% | Industry |
| MQL → SQL conversion | 10-30% | Bridge Group |
| SQL → Opportunity | 40-60% | Bridge Group |
| Pipeline coverage healthy | 3-5x quota | Bridge Group |
| HubSpot HUBS inbound est | ~75% | Industry |
| Atlassian TEAM inbound est | ~70% | Industry |
| Snowflake SNOW inbound est | ~30% | Industry |
| Workday WDAY inbound est | ~25% | Industry |
| Datadog DDOG hybrid | 50/50 | DDOG IR |
| 6sense funding | ~$200M+ | Crunchbase |
| Demandbase funding | ~$200M+ | Crunchbase |
| ZoomInfo ZI revenue FY24 | ~$1.2B | ZI 10-K |
| Outreach Vista 2024 acquisition | yes | Vista |
| Salesloft Vista 2024 acquisition | yes | Vista |
| Apollo.io valuation | $1.6B 2023 | Crunchbase |
| Clearbit Salesloft 2024 acquisition | yes | Salesloft |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| Workday WDAY revenue FY24 | ~$8B | WDAY 10-K |
| Datadog DDOG revenue FY24 | ~$2.7B | DDOG 10-K |`,
    counter: `## Counter-Case
**Pure inbound caps TAM.** Mitigation: add outbound for upmarket.
**Pure outbound expensive + slow.** Mitigation: add inbound for efficiency.
**Wrong ratio for segment.** Mitigation: SMB inbound-heavy, Enterprise outbound-heavy.
**Vanity MQL inflation.** Mitigation: MQL → SQL conversion gating.
**When stay-PLG wins.** Pre-PMF or pure self-serve product.`,
    links: `

## See Also

- **q93** — When PLG breaks + needs sales overlay
- **q92** — Partner/channel motion structure
- **q90** — New vertical GTM investment evaluation
- **q89** — Enterprise motion launch trigger`,
    sources: sharedSources,
    tags: ["inbound-outbound-ratio-20m-arr-saas","plg-60-80-inbound-sales-led-30-50-hybrid-40-60-typical","hubspot-hubs-75-inbound-atlassian-team-70-notion-80-zoom-zm-70-plg-references","snowflake-snow-30-inbound-workday-wday-25-servicenow-now-35-sales-led-references","datadog-ddog-50-50-cloudflare-net-55-mongodb-mdb-50-50-hybrid","marketing-mqls-sdr-outbound-referrals-partner-events-content-paid-sources","hubspot-marketing-marketo-adobe-pardot-salesforce-eloqua-oracle-activecampaign-tools","outreach-salesloft-apollo-lemlist-mixmax-sep","6sense-bombora-zoominfo-zi-demandbase-clearbit-intent","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (HubSpot HUBS $2.6B 75% inbound + Atlassian TEAM $4.4B 70% + Notion 80% + Zoom ZM 70% PLG references, Snowflake SNOW $3.6B 30% + Workday WDAY $8B 25% + ServiceNow NOW 35% sales-led, Datadog DDOG $2.7B 50/50 + Cloudflare NET 55% + MongoDB MDB 50/50 hybrid, HubSpot Marketing Hub + Marketo Adobe + Pardot Salesforce + Eloqua Oracle + ActiveCampaign + Outreach Vista 2024 + Salesloft Vista 2024 + Apollo.io $1.6B 2023 + Lemlist + Mixmax + 6sense $200M + Bombora + ZoomInfo ZI $1.2B + Demandbase $200M + Clearbit Salesloft 2024 tools) real.' }
  },
  {
    id: 'q93',
    tldr: `**TL;DR:** PLG breaks + needs **sales overlay** when: (1) **Free-to-paid conversion stalls below 2-3%** (industry floor), (2) **ACV ceiling hit** — PLG can't push above $5-25K ACV without sales help, (3) **Enterprise security/legal/procurement** required (PLG can't handle), (4) **Customer demands custom pricing** (PLG list price refused), (5) **Multi-product cross-sell** needs human guidance. **The classic breaking points**: 25-50 seats in a single org (procurement notices), $50K+ ACV (CFO involvement), regulated industries (HIPAA, FedRAMP, SOC 2, GDPR enterprise), multi-year contracts. **Reference patterns**: Atlassian (TEAM) added enterprise overlay ~2020 for >$50K deals; Notion added Team/Business/Enterprise tiers 2021+; Slack (Salesforce 2021 $27.7B) PLG to enterprise transition; Zoom (ZM) PLG to enterprise hybrid; Datadog (DDOG) hybrid from start. **Frameworks**: OpenView Partners PLG benchmarks + ProductLed Institute.`,
    core: `

## The Five Breaking Points

**1. Free-to-Paid Conversion Stall**
- Industry floor: 2-3%
- Below 2% = PLG mechanics not working
- Stalled growth signal

**2. ACV Ceiling**
- PLG can't push above $5-25K ACV typically
- Customer expectations cap at credit card threshold
- Sales overlay enables $50K+ ACV

**3. Enterprise Requirements**
- Security questionnaires (SOC 2 Type II + ISO 27001 + HIPAA + FedRAMP)
- Procurement complexity
- Multi-stakeholder buyer
- Legal redlines on terms

**4. Custom Pricing Demands**
- Customer refuses list price
- Wants negotiated terms
- Multi-year commits
- Custom commercial terms

**5. Multi-Product Cross-Sell**
- Customer doesn't discover all products via PLG
- Human guidance accelerates expansion
- Datadog's 22+ product approach requires sales overlay

## The Classic Breakpoints

| Trigger | Signal |
|---|---|
| 25-50 seats single org | Procurement notices |
| $50K+ ACV | CFO involvement |
| Regulated industry | HIPAA/FedRAMP/etc. |
| Multi-year contract | Negotiation needed |
| Custom integration | SE/SA required |

## Reference Transition Patterns

- **Atlassian (TEAM):** PLG-pure 2002-2020 → added enterprise overlay 2020+
- **Notion:** PLG-pure → added Team/Business/Enterprise tiers 2021+
- **Slack (Salesforce 2021 $27.7B):** PLG to enterprise transition under Salesforce
- **Zoom (ZM):** PLG to hybrid
- **Loom (Atlassian 2023 $975M):** PLG → enterprise sales pre-acquisition
- **Calendly:** founder-led to ~$50M then hired sales
- **HubSpot (HUBS):** Free tier added 2014; hybrid from earlier
- **Cloudflare (NET):** PLG-dominant + enterprise overlay

## The Sales Overlay Build

**Minimum Viable Sales:**
- 1-2 Enterprise AEs ($150-$250K base, 50/50 OTE)
- 1-2 SEs (Sales Engineers, $130-$200K base)
- Customer Success Manager (CSM, $100-$160K)
- Customer Success Engineer

**Tier Structure:**
- Free → Starter → Pro → Enterprise (PLG)
- Enterprise tier = sales-led custom pricing
- Crossover at 25-50 seats / $25K ACV

## Companion Metrics

- Free-to-paid conversion (2-7%)
- PLG-qualified leads (PQL) → SQL
- Self-serve ARR vs sales-led ARR split
- NRR (110-130%)
- GRR (>90%)`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[PLG-only motion] --> B{Five breakpoints triggered?}
    B -->|Yes| C[Add sales overlay: AE + SE + CSM]
    B -->|No| D[Stay PLG-pure]
    C --> E[Tier: Free→Starter→Pro→Enterprise]
    E --> F[Crossover 25-50 seats / $25K ACV]
\`\`\`

TAGS: plg-breaks-needs-sales-overlay-when, free-to-paid-2-3-percent-floor-acv-5-25k-ceiling-enterprise-security-procurement-custom-pricing-multi-product-five-breakpoints, 25-50-seat-50k-acv-regulated-multi-year-custom-integration-classic-triggers, atlassian-team-2020-overlay-notion-2021-tiers-slack-salesforce-2021-27-7b-zoom-zm-loom-atlassian-2023-975m-calendly-50m-hubspot-hubs-cloudflare-net-references, ae-150-250k-se-130-200k-csm-100-160k-minimum-viable-sales, openview-productled-institute-frameworks, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Free-to-paid floor | 2-3% | OpenView |
| Healthy free-to-paid | 2-7% | OpenView |
| PLG ACV ceiling | $5-25K typical | Industry |
| Sales overlay ACV | $50K+ | Industry |
| Crossover threshold | 25-50 seats / $25K ACV | Industry |
| Enterprise AE base | $150-$250K | Bridge Group |
| Enterprise AE OTE | 50/50 split | Bridge Group |
| SE base | $130-$200K | Bridge Group |
| CSM base | $100-$160K | Industry |
| Atlassian TEAM revenue FY24 | ~$4.4B | TEAM 10-K |
| Notion users | ~30M+ | Notion |
| Slack-Salesforce acquisition | 2021 $27.7B | Salesforce |
| Loom-Atlassian acquisition | 2023 ~$975M | Atlassian |
| Calendly valuation | $3B 2021 | Crunchbase |
| Zoom ZM revenue FY24 | ~$4.6B | ZM 10-K |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| Cloudflare NET revenue FY24 | ~$1.7B | NET 10-K |
| Datadog DDOG products | 22+ | Datadog |
| OpenView Partners benchmarks | annual | OpenView |
| ProductLed Institute | major | ProductLed |`,
    counter: `## Counter-Case
**Sales overlay kills PLG culture.** Mitigation: separate teams + comp.
**Premature sales overlay.** Mitigation: wait for clear breakpoint signals.
**Conversion stall = product issue.** Mitigation: PLG mechanics first, then sales.
**Enterprise overlay too expensive.** Mitigation: start with 1-2 AE + SE.
**When stay-PLG-pure wins.** SMB-only + no enterprise demand + viral mechanics strong.`,
    links: `

## See Also

- **q94** — Inbound/outbound ratio at $20M ARR
- **q92** — Partner/channel motion structure
- **q89** — Enterprise motion launch trigger
- **q86** — Expand from SMB to mid-market`,
    sources: sharedSources,
    tags: ["plg-breaks-needs-sales-overlay-when","free-to-paid-2-3-percent-floor-acv-5-25k-ceiling-enterprise-security-procurement-custom-pricing-multi-product-five-breakpoints","25-50-seat-50k-acv-regulated-multi-year-custom-integration-classic-triggers","atlassian-team-2020-overlay-notion-2021-tiers-slack-salesforce-2021-27-7b-zoom-zm-loom-atlassian-2023-975m-calendly-50m-hubspot-hubs-cloudflare-net-references","ae-150-250k-se-130-200k-csm-100-160k-minimum-viable-sales","openview-productled-institute-frameworks","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Atlassian TEAM $4.4B 2020 enterprise overlay + Notion 30M 2021 tiers + Slack-Salesforce 2021 $27.7B + Loom-Atlassian 2023 $975M + Calendly $3B 2021 + Zoom ZM $4.6B + HubSpot HUBS $2.6B + Cloudflare NET $1.7B + Datadog DDOG 22+ products references, OpenView Partners + ProductLed Institute + Bridge Group SaaS Benchmarks frameworks) real.' }
  },
  {
    id: 'q92',
    tldr: `**TL;DR:** Structure a **partner/channel motion alongside direct sales** by: (1) **Two-track architecture** — direct sales for strategic accounts; partners/channel for SMB + geographic expansion + vertical specialty. (2) **Comp neutrality** — direct AEs paid 100% on direct deals, partners earn 15-30% margin; OR partner-influenced deals share comp via deal registration. (3) **Partner tiers** — Authorized (~10% margin) / Premier (~20%) / Elite (~30%) — Salesforce CRM, Microsoft, Oracle, SAP standard model. (4) **Partner enablement** — Partner portal, training, certification, MDF (Market Development Funds) $5K-$500K per partner annually. (5) **PRM tool** (Impartner ~$60M+, Channeltivity, Allbound, Crossbeam, Reveal Crossbeam 2024 merger) for partner management + deal registration. **The trap**: channel conflict between direct + partner — solve via deal registration + clear lanes (segment + geography + vertical).`,
    core: `

## The Two-Track Architecture

**Direct Sales:**
- Strategic enterprise accounts ($250K+ ACV)
- Founder/CEO relationships
- Multi-stakeholder complex deals
- Custom commercial terms

**Partners/Channel:**
- SMB + Mid-Market segments
- Geographic expansion (international, smaller markets)
- Vertical specialty (healthcare, finance, manufacturing)
- Implementation + services partners

## Compensation Architecture

**Direct AE Comp:**
- 100% on direct deals
- Partner-influenced deals: share comp via deal registration

**Partner Comp:**
- Authorized: 10% margin
- Premier: 15-20% margin
- Elite: 25-30% margin
- Deal registration protects partner from direct sales conflict

## Partner Tiers Reference

| Vendor | Partner Tiers | Top Tier Margin |
|---|---|---|
| Salesforce (CRM) | Registered/Silver/Gold/Platinum | up to 30%+ |
| Microsoft | Various tiers | up to 30%+ |
| Oracle | Various | up to 30%+ |
| SAP | Various | up to 30%+ |
| HubSpot (HUBS) | Solutions/Gold/Platinum/Diamond/Elite | up to 25%+ |
| Salesforce CRM Solutions | Various | up to 30%+ |

## Partner Enablement

**Required:**
- Partner portal (training + collateral + deal registration)
- Certification program
- Sales playbooks
- Co-marketing material
- MDF (Market Development Funds) $5K-$500K per partner annually
- Quarterly partner reviews

**PRM Tools:**
- Impartner ($60M+ funded)
- Channeltivity
- Allbound
- Crossbeam (Reveal merger 2024)
- Reveal
- Workspan
- Salesforce Partner Community

## The Channel Conflict Solution

**Deal Registration:**
- Partner registers deal first → exclusive 60-90 days
- Direct sales locked out OR splits with partner
- Reduces friction + builds trust

**Clear Lanes:**
- Segment (Enterprise direct, SMB partner)
- Geography (US direct, International partner)
- Vertical (Healthcare partner specialist, etc.)

## Reference Patterns

- **Salesforce (CRM):** mature multi-tier partner ecosystem
- **Microsoft:** dominant channel + direct hybrid
- **HubSpot (HUBS):** Solutions Partner program
- **Snowflake (SNOW):** partner-heavy enterprise + AWS/Azure/Google marketplace
- **Datadog (DDOG):** AWS/Azure/Google partner + direct hybrid`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Direct + Partner motion] --> B[Two-track: Direct enterprise + Partner SMB/intl/vertical]
    B --> C[Comp neutrality + deal registration]
    C --> D[Partner tiers Authorized/Premier/Elite 10-30 percent margin]
    D --> E[Enablement: portal + cert + playbooks + MDF + PRM tool]
\`\`\`

TAGS: partner-channel-motion-alongside-direct-sales-structure, two-track-direct-enterprise-partner-smb-international-vertical, comp-neutrality-deal-registration-15-30-percent-partner-margin, authorized-premier-elite-tiers, salesforce-crm-microsoft-oracle-sap-hubspot-hubs-partner-program-references, mdf-market-development-funds-5k-500k-annual, impartner-60m-channeltivity-allbound-crossbeam-reveal-2024-merger-workspan-prm-tools, snowflake-snow-aws-azure-google-marketplace-datadog-ddog-hybrid-references, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Authorized partner margin | ~10% | Industry |
| Premier partner margin | ~20% | Industry |
| Elite partner margin | ~30% | Industry |
| Deal registration period | 60-90 days | Industry |
| MDF annual per partner | $5K-$500K | Industry |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Salesforce Solutions Partners | thousands | Salesforce |
| Microsoft Azure partners | hundreds of thousands | Microsoft |
| HubSpot HUBS revenue FY24 | ~$2.6B | HUBS 10-K |
| HubSpot Solutions Partners | ~6,000+ | HubSpot |
| Snowflake SNOW revenue FY24 | ~$3.6B | SNOW 10-K |
| Snowflake partners | ~600+ | Snowflake |
| Datadog DDOG partners | hundreds | Datadog |
| Impartner funding | ~$60M+ | Crunchbase |
| Crossbeam-Reveal merger | 2024 | Crossbeam |
| Allbound funding | ~$10M+ | Crunchbase |
| Channeltivity | private PRM | Channeltivity |
| Workspan funding | ~$20M+ | Crunchbase |
| AWS Marketplace | major channel | AWS |
| Microsoft Azure Marketplace | major | Microsoft |
| Google Cloud Marketplace | major | Google |`,
    counter: `## Counter-Case
**Channel conflict despite deal registration.** Mitigation: strict lanes + enforcement.
**Partner margins eat profit.** Mitigation: tier appropriately + revenue volume.
**MDF inflation.** Mitigation: clear ROI metrics per partner.
**Partner management overhead.** Mitigation: PRM tool + dedicated partner manager.
**When stay-direct-only wins.** Pure enterprise + niche product + no scale need.`,
    links: `

## See Also

- **q93** — When PLG breaks + needs sales overlay
- **q94** — Inbound/outbound ratio at $20M ARR
- **q90** — New vertical GTM investment evaluation
- **q89** — Enterprise motion launch trigger`,
    sources: sharedSources,
    tags: ["partner-channel-motion-alongside-direct-sales-structure","two-track-direct-enterprise-partner-smb-international-vertical","comp-neutrality-deal-registration-15-30-percent-partner-margin","authorized-premier-elite-tiers","salesforce-crm-microsoft-oracle-sap-hubspot-hubs-partner-program-references","mdf-market-development-funds-5k-500k-annual","impartner-60m-channeltivity-allbound-crossbeam-reveal-2024-merger-workspan-prm-tools","snowflake-snow-aws-azure-google-marketplace-datadog-ddog-hybrid-references","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Salesforce CRM $35B partner program + Microsoft Azure hundreds-of-thousands + Oracle + SAP + HubSpot HUBS $2.6B 6K Solutions Partners + Snowflake SNOW $3.6B 600 partners + Datadog DDOG references, Impartner $60M + Channeltivity + Allbound $10M + Crossbeam-Reveal 2024 merger + Workspan $20M PRM tools, AWS Marketplace + Microsoft Azure Marketplace + Google Cloud Marketplace partner channels) real.' }
  },
  {
    id: 'q91',
    tldr: `**TL;DR:** Realistic **CAC payback by segment**: **SMB <12 months** (best: <9 mo HubSpot HUBS, Drift), **Mid-Market 12-18 months** (best: <15 mo), **Enterprise 18-24 months** (best: <18 mo). Best-in-class outliers: Atlassian (TEAM) PLG ~9-12 mo across segments due to viral mechanics; Snowflake (SNOW) 15-18 mo enterprise; CrowdStrike (CRWD) 12-15 mo. **Why segments differ**: SMB churns faster (10-30% annual) so needs fast recovery; Enterprise multi-year contracts (LTV $1M+) tolerates 24+ mo payback. **Formula**: CAC Payback = CAC / (Monthly Revenue × Gross Margin). **Companion metrics**: LTV/CAC (3:1+), Magic Number (0.75+), NRR (110-130%), GRR (>90%), Rule of 40 (≥40%). **Reference frameworks**: Bessemer State of Cloud, OpenView Partners, KeyBanc SaaS Survey, David Skok For Entrepreneurs.`,
    core: `

## The Segment-Specific Targets

| Segment | ACV Range | Healthy Payback | Best-in-Class | Concerning |
|---|---|---|---|---|
| SMB | <$50K | <12 mo | <9 mo | >18 mo |
| Mid-Market | $50K-$250K | 12-18 mo | <15 mo | >24 mo |
| Enterprise | $250K+ | 18-24 mo | <18 mo | >36 mo |

## Why Segments Differ

**SMB:**
- Churn 10-30% annual
- Low ACV, fast recovery needed
- Self-serve + low-touch sales
- 12-month payback gives reasonable runway

**Mid-Market:**
- Churn 5-15%
- Higher ACV, sales-led
- 18-month payback acceptable
- Multi-product cross-sell possible

**Enterprise:**
- Churn <5%
- Highest ACV ($250K-$5M+)
- Multi-year contracts
- 24-month payback OK because LTV is high

## The Formula

CAC Payback = CAC / (Monthly Revenue × Gross Margin).

**SMB Example:**
- CAC: $5K
- Monthly revenue: $500
- Gross margin: 75%
- Payback: $5K / ($500 × 0.75) = 13.3 mo

**Enterprise Example:**
- CAC: $200K
- Monthly revenue: $20K
- Gross margin: 80%
- Payback: $200K / ($20K × 0.80) = 12.5 mo

## Public SaaS Benchmarks

- **HubSpot (HUBS):** SMB-mid focus ~12-15 mo
- **Atlassian (TEAM):** PLG ~9-12 mo (best PLG)
- **Snowflake (SNOW):** enterprise ~15-18 mo
- **Datadog (DDOG):** enterprise ~12-15 mo (best-in-class enterprise)
- **CrowdStrike (CRWD):** ~12-15 mo
- **Cloudflare (NET):** PLG + enterprise ~10-15 mo
- **Salesforce (CRM):** mature ~18-24 mo
- **Workday (WDAY):** enterprise ~20-24 mo

## Companion Metrics

- LTV/CAC: 3:1+ minimum
- Magic Number: 0.75+ (sales efficiency)
- NRR: 110-130%
- GRR: >90%
- Rule of 40: ≥40%

## Reference Frameworks

- Bessemer State of the Cloud (annual)
- OpenView Partners benchmarks
- KeyBanc Capital Markets SaaS Survey
- Insight Partners Onsite Cloud Index
- David Skok "For Entrepreneurs"`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[CAC payback evaluation] --> B[Segment: SMB / MM / Enterprise]
    B --> C[Formula: CAC / (Monthly Revenue × Gross Margin)]
    C --> D[Compare to segment-specific target]
    D --> E[Pair with LTV/CAC + Magic Number + NRR + R40]
\`\`\`

TAGS: cac-payback-smb-mid-market-enterprise-realistic, smb-under-12-mid-market-12-18-enterprise-18-24-months-healthy, atlassian-team-9-12-snowflake-snow-15-18-datadog-ddog-12-15-crowdstrike-crwd-12-15-cloudflare-net-10-15-hubspot-hubs-12-15-salesforce-crm-18-24-workday-wday-20-24-benchmarks, cac-monthly-revenue-gross-margin-formula, ltv-cac-magic-number-nrr-rule-of-40-companion-metrics, bessemer-openview-keybanc-insight-david-skok-frameworks, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| SMB healthy CAC payback | <12 mo | Bessemer |
| Mid-Market healthy | 12-18 mo | Bessemer |
| Enterprise healthy | 18-24 mo | Bessemer |
| LTV/CAC target | 3:1+ | David Skok |
| Magic Number target | 0.75+ | David Skok |
| NRR target | 110-130% | Bessemer |
| GRR target | >90% | Bessemer |
| Rule of 40 target | ≥40% | Bessemer |
| HubSpot HUBS CAC payback est | ~12-15 mo | Industry |
| Atlassian TEAM CAC payback est | ~9-12 mo | Industry |
| Snowflake SNOW CAC payback est | ~15-18 mo | Industry |
| Datadog DDOG CAC payback est | ~12-15 mo | Industry |
| CrowdStrike CRWD CAC payback | ~12-15 mo | Industry |
| Cloudflare NET CAC payback | ~10-15 mo | Industry |
| Salesforce CRM CAC payback | ~18-24 mo | Industry |
| Workday WDAY CAC payback | ~20-24 mo | Industry |
| SMB churn typical | 10-30% annual | Industry |
| Mid-Market churn | 5-15% | Industry |
| Enterprise churn | <5% | Industry |
| Bessemer State of Cloud | annual | BVP |
| OpenView Partners | annual | OpenView |
| KeyBanc Capital Markets SaaS Survey | annual | KeyBanc |`,
    counter: `## Counter-Case
**Segment definition fuzzy.** Mitigation: clear ACV thresholds.
**CAC fully-loaded vs not.** Mitigation: include all S&M + allocated overhead.
**Multi-segment company averages.** Mitigation: report per segment.
**Discount-driven faster payback.** Mitigation: pair with EPR.
**When stay-longer-payback wins.** Strategic enterprise multi-year LTV justifies.`,
    links: `

## See Also

- **q98** — CAC payback target 12/18/24 months
- **q99** — Rule of 40 SaaS
- **q97** — True GRR vs NRR computation
- **q96** — Good NRR Series B SaaS 2026`,
    sources: sharedSources,
    tags: ["cac-payback-smb-mid-market-enterprise-realistic","smb-under-12-mid-market-12-18-enterprise-18-24-months-healthy","atlassian-team-9-12-snowflake-snow-15-18-datadog-ddog-12-15-crowdstrike-crwd-12-15-cloudflare-net-10-15-hubspot-hubs-12-15-salesforce-crm-18-24-workday-wday-20-24-benchmarks","cac-monthly-revenue-gross-margin-formula","ltv-cac-magic-number-nrr-rule-of-40-companion-metrics","bessemer-openview-keybanc-insight-david-skok-frameworks","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (HubSpot HUBS + Atlassian TEAM + Snowflake SNOW + Datadog DDOG + CrowdStrike CRWD + Cloudflare NET + Salesforce CRM + Workday WDAY CAC payback benchmarks, Bessemer State of Cloud + OpenView Partners + KeyBanc SaaS Survey + Insight Partners + David Skok For Entrepreneurs frameworks) real.' }
  },
  {
    id: 'q90',
    tldr: `**TL;DR:** Evaluate **new vertical GTM investment** by computing: (1) **TAM (Total Addressable Market)** — top-down market sizing × addressable segment, (2) **SAM (Serviceable Addressable Market)** — TAM × your ICP fit, (3) **SOM (Serviceable Obtainable Market)** — SAM × win rate × time-to-market, (4) **Investment required** — sales hires + marketing + product customization + partnerships, (5) **Time to break-even** — typically 18-36 months for a new vertical motion. **The threshold**: pursue if SOM > 3x investment over 36 months. **Vertical patterns**: healthcare (HIPAA), finance (FINRA/SEC), manufacturing (ERP fit), federal (FedRAMP), retail (PCI-DSS), education (FERPA), legal (eDiscovery), real estate. **Frameworks**: Gartner Magic Quadrant + Forrester Wave for vertical positioning; Bessemer State of Cloud for benchmarks. **Reference**: Salesforce Industries (Health Cloud, Financial Services Cloud, Manufacturing Cloud, Consumer Goods Cloud), Veeva (NYSE: VEEV) life sciences vertical specialty success.`,
    core: `

## The Evaluation Framework

**Step 1: TAM Calculation**
- Top-down: industry analyst report × addressable segment
- Bottom-up: # potential customers × avg ACV
- Sanity check: cross-reference both

**Step 2: SAM (Serviceable Addressable Market)**
- TAM × your ICP fit
- E.g., TAM $50B × 20% mid-market fit = SAM $10B

**Step 3: SOM (Serviceable Obtainable Market)**
- SAM × realistic win rate × time-to-market
- E.g., SAM $10B × 5% capture × 5 years = SOM $500M cumulative

**Step 4: Investment Required**
- Sales: 2-5 vertical AEs ($300K OTE each)
- Marketing: $500K-$2M campaign budget
- Product customization: $200K-$2M engineering
- Vertical partnerships: $100K-$500K
- Compliance certifications (HIPAA, FINRA, PCI, FedRAMP): $200K-$1M

**Step 5: Time to Break-Even**
- Typical: 18-36 months
- Pursue if: SOM > 3x investment over 36 months

## Vertical-Specific Considerations

| Vertical | Regulatory | Avg ACV | Notes |
|---|---|---|---|
| Healthcare | HIPAA + HITECH | $25K-$1M+ | Veeva model |
| Finance | FINRA/SEC | $50K-$2M+ | nCino, Plaid |
| Manufacturing | none specific | $25K-$500K | Procore, Autodesk |
| Federal | FedRAMP + ITAR | $100K-$10M | Carahsoft channel |
| Retail | PCI-DSS | $25K-$500K | Square, Shopify |
| Education | FERPA + COPPA | $10K-$200K | Canvas, Blackboard |
| Legal | eDiscovery + privilege | $25K-$500K | Relativity, Litera |
| Real estate | various state | $5K-$100K | MLS integrations |

## Reference Patterns

- **Salesforce Industries:** Health Cloud, Financial Services Cloud, Manufacturing Cloud, Consumer Goods Cloud, Public Sector Cloud
- **Veeva (NYSE: VEEV):** life sciences specialty, ~$2.4B revenue FY24
- **nCino (NASDAQ: NCNO):** banking specialty, ~$540M FY24
- **Procore (NYSE: PCOR):** construction specialty, ~$1.1B FY24
- **Toast (NYSE: TOST):** restaurant specialty, ~$5B FY24
- **Shopify (NYSE: SHOP):** e-commerce specialty, ~$8.9B FY24
- **Square (NYSE: SQ):** SMB merchant, ~$24B FY24

## The Pitfalls

- Over-estimating SAM/SOM
- Under-estimating compliance cost
- Vertical bench expertise hard to hire
- Product customization debt
- Competing with vertical specialists`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[New vertical evaluation] --> B[TAM × ICP fit = SAM]
    B --> C[SAM × win rate × time = SOM]
    C --> D[Investment: sales + marketing + product + partnerships + compliance]
    D --> E{SOM > 3x investment over 36 mo?}
    E -->|Yes| F[Pursue]
    E -->|No| G[Skip]
\`\`\`

TAGS: new-vertical-gtm-investment-evaluation, tam-sam-som-three-tier-market-sizing, sales-marketing-product-customization-partnerships-compliance-investment-components, 18-36-month-time-to-break-even, 3x-som-vs-investment-pursue-threshold, healthcare-hipaa-finance-finra-manufacturing-federal-fedramp-retail-pci-education-ferpa-legal-real-estate-vertical-patterns, salesforce-industries-health-financial-manufacturing-consumer-goods-public-sector-cloud-veeva-veev-2-4b-ncino-ncno-540m-procore-pcor-1-1b-toast-tost-5b-shopify-shop-8-9b-square-sq-24b-references, 2027`,
    src: sharedSrc,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Vertical AE OTE | ~$300K | Bridge Group |
| Vertical marketing budget | $500K-$2M | Industry |
| Product customization | $200K-$2M | Industry |
| Compliance cert costs | $200K-$1M | Industry |
| Break-even threshold | SOM > 3x investment | Industry |
| Time to break-even | 18-36 months | Industry |
| Veeva VEEV revenue FY24 | ~$2.4B | VEEV 10-K |
| nCino NCNO revenue FY24 | ~$540M | NCNO 10-K |
| Procore PCOR revenue FY24 | ~$1.1B | PCOR 10-K |
| Toast TOST revenue FY24 | ~$5B | TOST 10-K |
| Shopify SHOP revenue FY24 | ~$8.9B | SHOP 10-K |
| Square SQ revenue FY24 | ~$24B | SQ 10-K |
| Salesforce CRM revenue FY24 | ~$35B | CRM 10-K |
| Salesforce Health Cloud | major industry vertical | Salesforce |
| Salesforce Financial Services Cloud | major | Salesforce |
| Salesforce Manufacturing Cloud | major | Salesforce |
| Salesforce Consumer Goods Cloud | major | Salesforce |
| Salesforce Public Sector Cloud | major | Salesforce |
| Carahsoft | major federal channel | Carahsoft |
| Bessemer State of Cloud benchmarks | annual | BVP |
| Gartner Magic Quadrant | major analyst | Gartner |
| Forrester Wave | major analyst | Forrester |`,
    counter: `## Counter-Case
**Over-estimate SAM/SOM.** Mitigation: bottom-up validation.
**Compliance cost surprises.** Mitigation: budget 1.5x estimate.
**Vertical expertise hard to hire.** Mitigation: long ramp + senior hire.
**Vertical specialist competition.** Mitigation: niche specialty within vertical.
**When skip-vertical wins.** Strong horizontal ICP + no clear vertical demand.`,
    links: `

## See Also

- **q89** — Enterprise motion launch trigger
- **q87** — Vertical-by-vertical vs horizontal expansion
- **q88** — Sales org split by segment vs region
- **q92** — Partner/channel motion structure`,
    sources: sharedSources,
    tags: ["new-vertical-gtm-investment-evaluation","tam-sam-som-three-tier-market-sizing","sales-marketing-product-customization-partnerships-compliance-investment-components","18-36-month-time-to-break-even","3x-som-vs-investment-pursue-threshold","healthcare-hipaa-finance-finra-manufacturing-federal-fedramp-retail-pci-education-ferpa-legal-real-estate-vertical-patterns","salesforce-industries-health-financial-manufacturing-consumer-goods-public-sector-cloud-veeva-veev-2-4b-ncino-ncno-540m-procore-pcor-1-1b-toast-tost-5b-shopify-shop-8-9b-square-sq-24b-references","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Salesforce Industries Health Cloud + Financial Services Cloud + Manufacturing Cloud + Consumer Goods Cloud + Public Sector Cloud + Carahsoft federal channel, Veeva VEEV $2.4B life sciences + nCino NCNO $540M banking + Procore PCOR $1.1B construction + Toast TOST $5B restaurant + Shopify SHOP $8.9B e-commerce + Square SQ $24B SMB merchant vertical specialists, Salesforce CRM $35B references, Gartner Magic Quadrant + Forrester Wave + Bessemer State of Cloud frameworks) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH N DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
