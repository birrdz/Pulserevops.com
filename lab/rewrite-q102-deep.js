// q102 -- What's the difference between expansion ARR and net new ARR for forecasting?
// Deep rewrite using ADAPTED ANALYTICAL STRUCTURE: Bottom Line + Intro + TOC + 4 PARTs.
// Target window: 8,500-9,500 words (HARD CAP 10,500). Lean paragraphs, frequent H3 breaks.
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');
const { runPolish } = require('./polish-helper');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
if (!process.env.BLOBS_PAT && process.env.NETLIFY_AUTH_TOKEN) process.env.BLOBS_PAT = process.env.NETLIFY_AUTH_TOKEN;

const ID = 'q102';

const tldr = `> ### 🎯 Bottom Line
> - **[Definition split]** **Net New ARR** = first-time-customer ARR booked in-period from brand-new logos (hunt motion). **Expansion ARR** = incremental ARR from the existing base via upsell (tier upgrade), cross-sell (new product attach), and seat-add (license expansion in same product) — three distinct sub-streams with different sales motions, owners, and conversion mechanics. Critically, **Net New ARR ≠ Net ARR** — Net ARR subtracts churn and downgrade from gross additions (new + expansion). Treating these as one number is the #1 forecasting failure mode at $30M-$500M ARR SaaS per [ICONIQ Growth Topline Growth Index 2025](https://www.iconiqcapital.com/growth/insights), [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud), and [OpenView SaaS Benchmarks 2025](https://openviewpartners.com/blog/).
> - **[Why it matters]** Forecasting accuracy collapses when these streams are combined because they have **structurally different conversion rates** (new-logo close rate 18-30% vs expansion close rate 55-75% vs seat-add conversion 80%+), **different cycle times** (new-logo 60-180 days vs expansion 30-90 days vs seat-add often same-quarter or self-serve), **different CAC** (new-logo CAC payback 15-22 months in 2026 vs expansion CAC payback 4-9 months), **different owners** (AE for new logo, CSM/expansion-AE for upsell, PLG funnel for seat-add), and **different timing signals** (new-logo pipeline coverage 3-4x by stage vs expansion via renewal calendar 4-12 weeks out vs cross-sell via product-adoption telemetry). A blended single-bucket forecast hides the leading-indicator signal when one stream decays — exactly the failure mode that hit multiple mid-2024 SaaS companies whose strong expansion masked decaying new-logo motion for 3-4 quarters before the board caught it.
> - **[The trap]** Roughly **~60% of public SaaS companies report a combined "Net New ARR" figure in earnings transcripts that includes expansion** — which can inflate apparent new-logo velocity by 30-50% relative to the true new-logo number. Board-grade and FP&A-grade forecasting requires the **6-category ARR taxonomy** (New Logo, Expansion sub-split into Upsell + Cross-sell + Seat-add, Reactivation, Renewal, Churn sub-split into Voluntary + Involuntary + Downgrade, Net ARR) standardized across [ChartMogul](https://chartmogul.com/), [SaaSOptics/Maxio](https://www.maxio.com/), and SaaS audit guidance. The companies with **130%+ Net Revenue Retention** (Snowflake, Datadog, MongoDB, Klaviyo) drive **the majority of their growth from expansion** — which means a blended forecast literally cannot tell you whether the new-logo engine is healthy or dying. Separate the streams, forecast them on their own cadences, and you move from a typical 65-75% quarterly forecast accuracy to the 88-92% range that public-company CFOs need to avoid guidance misses.`;

const core = `

A **Net New ARR vs Expansion ARR forecasting distinction** is the most fundamental — and most frequently broken — categorization in SaaS revenue accounting. The two streams look similar (both add to ARR, both close as signed orders, both flow through CPQ and billing) but operate on different sales motions, cycle times, conversion economics, ownership structures, and leading-indicator signals. A finance team that forecasts them as one number is structurally incapable of detecting whether growth is healthy hunting, healthy farming, or healthy farming masking unhealthy hunting — and the third pattern is the silent killer of mid-stage SaaS plans.

Per the ICONIQ Growth 2025 Topline Growth Index (n=320+) and Bessemer State of the Cloud 2026 (n=83 public + ~600 private), the median public SaaS at $200M-$1B ARR derives **62-78% of net new ARR from expansion**, not from new logos. When boards and CFOs treat the combined number as a proxy for sales-org health, they miss the leading indicator that the hunt is dying — usually for 2-4 quarters before it surfaces in churn or downgrade data.

**TL;DR:** A rigorous 2026 ARR taxonomy is built on **6 ARR categories, 5 forecasting cadences, 4 ownership lines, and 3 CAC payback profiles**. The 6 categories: **(1) New Logo ARR** (hunt), **(2) Expansion ARR** = **(2a) Upsell** + **(2b) Cross-sell** + **(2c) Seat-add**, **(3) Reactivation ARR**, **(4) Renewal ARR**, **(5) Churn ARR** = **(5a) Voluntary** + **(5b) Involuntary** + **(5c) Downgrade**, **(6) Net ARR** = (1+2+3) − (5a+5b+5c). Cadences: pipeline coverage for new logo (weekly), renewal calendar for expansion (4-12 weeks out), PQL signal for cross-sell, PLG telemetry for seat-add, cohort decay for churn. Ownership: AE owns new logo, CSM or expansion-AE owns upsell/cross-sell, PLG growth team owns seat-add, retention team owns churn prevention. CAC payback: new-logo 15-22 months in 2026, expansion 4-9 months, seat-add 0-3 months. The decision math: **$100M total net new ARR** can be **$40M+$60M (healthy)**, **$25M+$75M (hunt dying)**, or **$60M+$40M (hunt strong, farm weak)** — three radically different realities that look identical at the aggregate. Separating them is the difference between 65-75% (combined) and 88-92% (split) forecast accuracy.

## 🗺️ Table of Contents

**Part 1 — The Taxonomy**
- [The 6-category ARR framework (New Logo, Expansion, Reactivation, Renewal, Churn, Net)](#the-6-category-arr-framework-new-logo-expansion-reactivation-renewal-churn-net)
- [Expansion ARR sub-split — Upsell vs Cross-sell vs Seat-add](#expansion-arr-sub-split--upsell-vs-cross-sell-vs-seat-add)
- [Churn ARR sub-split — Voluntary vs Involuntary vs Downgrade](#churn-arr-sub-split--voluntary-vs-involuntary-vs-downgrade)
- [Net New ARR vs Net ARR — the terminology trap](#net-new-arr-vs-net-arr--the-terminology-trap)
- [The ChartMogul / SaaSOptics / Maxio standard taxonomy](#the-chartmogul--saasoptics--maxio-standard-taxonomy)
- [GAAP revenue vs subscription ARR — the reconciliation](#gaap-revenue-vs-subscription-arr--the-reconciliation)
- [ARR Venn diagram — how the categories overlap and total](#arr-venn-diagram--how-the-categories-overlap-and-total)

**Part 2 — Why Forecasting Separately Matters**
- [Cycle time differentials — 60-180 days vs 30-90 days vs same-quarter](#cycle-time-differentials--60-180-days-vs-30-90-days-vs-same-quarter)
- [Win-rate differentials — 18-30% vs 55-75% vs 80%+](#win-rate-differentials--18-30-vs-55-75-vs-80)
- [CAC and CAC-payback differentials — 5x cheaper to expand than to hunt](#cac-and-cac-payback-differentials--5x-cheaper-to-expand-than-to-hunt)
- [Ownership differentials — AE vs CSM vs PLG funnel vs expansion-AE](#ownership-differentials--ae-vs-csm-vs-plg-funnel-vs-expansion-ae)
- [The Net Revenue Retention lens — 130%+ NRR masks decaying hunt](#the-net-revenue-retention-lens--130-nrr-masks-decaying-hunt)
- [Forecast-accuracy delta — 65-75% combined vs 88-92% split](#forecast-accuracy-delta--65-75-combined-vs-88-92-split)

**Part 3 — The Forecasting Mechanics**
- [Forecasting New Logo — pipeline coverage 3-4x by stage](#forecasting-new-logo--pipeline-coverage-3-4x-by-stage)
- [Forecasting Expansion at renewal — the 4-12 week renewal book](#forecasting-expansion-at-renewal--the-4-12-week-renewal-book)
- [Forecasting Cross-sell — product-adoption signals and PQL gating](#forecasting-cross-sell--product-adoption-signals-and-pql-gating)
- [Forecasting Seat-add — PLG funnel telemetry and self-serve velocity](#forecasting-seat-add--plg-funnel-telemetry-and-self-serve-velocity)
- [Forecasting Churn — health-score cohorts and retention curves](#forecasting-churn--health-score-cohorts-and-retention-curves)
- [Tool stack — Clari, Gong, BoostUp, Salesforce Forecast, ZoomInfo](#tool-stack--clari-gong-boostup-salesforce-forecast-zoominfo)
- [FP&A journal-entry mechanics — separate accounts in NetSuite / Sage Intacct](#fpa-journal-entry-mechanics--separate-accounts-in-netsuite--sage-intacct)
- [The board-slide construction — combined headline + component breakout](#the-board-slide-construction--combined-headline--component-breakout)
- [The Rule of 40 split — new-logo growth and expansion growth as separate lines](#the-rule-of-40-split--new-logo-growth-and-expansion-growth-as-separate-lines)

**Part 4 — Real-World Application**
- [Snowflake's 130%+ NRR — expansion dominates the growth story](#snowflakes-130-nrr--expansion-dominates-the-growth-story)
- [HubSpot, Salesforce, Asana, Monday, ZoomInfo, Klaviyo — the disclosed mix](#hubspot-salesforce-asana-monday-zoominfo-klaviyo--the-disclosed-mix)
- [The "expansion masked the leak" anti-pattern — mid-2024 case studies](#the-expansion-masked-the-leak-anti-pattern--mid-2024-case-studies)
- [Sales-comp design — paying AE flat on new-logo vs expansion is wrong](#sales-comp-design--paying-ae-flat-on-new-logo-vs-expansion-is-wrong)
- [CSM and expansion-AE comp structures — the 1-3% expansion ACV model](#csm-and-expansion-ae-comp-structures--the-1-3-expansion-acv-model)
- [Tooling for expansion playbooks — ChurnZero, Gainsight, Vitally, Catalyst](#tooling-for-expansion-playbooks--churnzero-gainsight-vitally-catalyst)
- [Diagnosing the miss — is it new-logo conversion, expansion close rate, or churn timing?](#diagnosing-the-miss--is-it-new-logo-conversion-expansion-close-rate-or-churn-timing)
- [The CFO and board playbook — how to present the split](#the-cfo-and-board-playbook--how-to-present-the-split)

---

## 📐 PART 1 — THE TAXONOMY

### The 6-category ARR framework (New Logo, Expansion, Reactivation, Renewal, Churn, Net)

ARR taxonomy at audit-grade rigor requires six mutually-exclusive categories:

- **New Logo ARR** — first-time customer (no prior contract in 12 months). Hunt motion, AE-owned.
- **Expansion ARR** — incremental ARR from existing customers via upsell, cross-sell, or seat-add. Farm motion.
- **Reactivation ARR** — returning churned logo (>12 months prior). Separate from new logo because cycle, win-rate, and CAC differ.
- **Renewal ARR** — continuation at same contract value. ARR retention, not new growth.
- **Churn ARR** — losses through voluntary cancellation, involuntary failure, or downgrade. Negative in the walk.
- **Net ARR** = (New + Expansion + Reactivation) − Churn. The "ending ARR − starting ARR" headline.

The standard walk: **Starting ARR + New Logo + Expansion + Reactivation − Voluntary − Involuntary − Downgrade = Ending ARR**. Renewal sits inside Starting ARR as the continuation assumption.

> ### 🟡 Key Stat
> Per [ChartMogul](https://chartmogul.com/) and [Maxio](https://www.maxio.com/) 2025: typical $30M-$300M ARR SaaS shows **GDR 88-94%** (6-12% gross churn) and **NDR 105-130%** (expansion overshoots churn by 13-42 points). Top-quartile public SaaS run **NDR 125-140%** with **GDR 92-96%**. The GDR-to-NDR gap is what expansion contributes — without separating expansion from new logo, you cannot tell whether you are a top-quartile expansion shop or mediocre.

### Expansion ARR sub-split — Upsell vs Cross-sell vs Seat-add

Expansion is three distinct streams with distinct mechanics:

- **Upsell** — tier upgrade (Standard → Pro → Enterprise). Cycle 30-90 days. CSM or expansion-AE owned. Conversion 55-75% when PQL-triggered.
- **Cross-sell** — new product SKU on existing account (CRM customer adds Marketing Hub). Cycle 60-120 days. Product-AE owned. Conversion 35-55%. Requires product-portfolio breadth.
- **Seat-add** — more licenses of same product. Cycle 0-30 days. Often self-serve via in-product purchase flow on PLG. Conversion 80%+ when usage gate triggers.

Treating "expansion" as one number obscures that **seat-add is often the largest, most predictable, lowest-CAC stream** in PLG businesses, while **cross-sell is lumpiest and most roadmap-dependent**.

> ### 📊 Quick Facts
> Per [OpenView 2025 PLG Benchmarks](https://openviewpartners.com/blog/): PLG-native SaaS at $50M-$200M ARR see expansion split **~55-70% seat-add, 15-25% upsell, 10-25% cross-sell**. Sales-led SaaS show **~20-35% seat-add, 35-50% upsell, 20-35% cross-sell**. A finance team modeling PLG expansion on a sales-led template will mis-forecast by 30-50%.

### Churn ARR sub-split — Voluntary vs Involuntary vs Downgrade

- **Voluntary** — active cancellation decision. The "real" churn signal. Health-score-cohort forecastable.
- **Involuntary** — payment failure (card decline, AP lag). 60-80% recoverable via dunning ([Chargebee Recover](https://www.chargebee.com/), [Stripe Smart Retries](https://stripe.com/billing)). Often mis-categorized as voluntary, inflating apparent fit problems.
- **Downgrade** — tier reduction or seat decrease. Partial rather than full churn. Most under-tracked category. A $200K → $80K customer shows zero in logo-retention but $120K negative in dollar-retention; NRR-vs-logo divergence is usually a downgrade story.

### Net New ARR vs Net ARR — the terminology trap

The single most common terminology trap: **"Net New ARR" ≠ "Net ARR"**.

- **Gross New ARR** = New Logo + Expansion + Reactivation (added in-period, before churn)
- **Net New ARR** = Gross New − Churn (some definitions) OR New Logo only (stricter definitions). Ambiguous and varies by company.
- **Net ARR** = Ending − Starting = Gross New − Churn. Always includes churn netting. The audited number.

Public SaaS routinely use "Net New ARR" in earnings to mean "ending − starting" — actually Net ARR. Vocabulary is inconsistent across Datadog, Snowflake, MongoDB. Fix: **specify the formula on every slide**. A footnote like "Net New ARR = New Logo + Expansion − Churn" eliminates 80% of misinterpretation risk.

> ### ⚠️ Warning
> Roughly **~60% of public SaaS report a combined "Net New ARR" in earnings transcripts** that bundles new logo and expansion, inflating apparent new-logo velocity by 30-50%. When you hear "we added $42M of net new ARR," ask: "what's the new-logo component, expansion component, and churn netted in?" Snowflake and Datadog disclose NRR + customer count enabling back-solve; HubSpot discloses customer count + ARPU; many smaller public SaaS disclose only the combined number.

### The ChartMogul / SaaSOptics / Maxio standard taxonomy

The industry standard is set by [ChartMogul](https://chartmogul.com/), [Maxio](https://www.maxio.com/), and [Recurly](https://recurly.com/) — matching what PwC, KPMG, and Deloitte SaaS audit practices accept.

| Category | Definition | Sign |
|---|---|---|
| New Business | First-time customer | + |
| Expansion | Existing customer adds | + |
| Reactivation | Returning churned | + |
| Contraction | Existing customer reduces | − |
| Churn | Existing customer cancels | − |
| Net New MRR/ARR | Sum of above | +/− |

Maxio adds **"Quantity Expansion" vs "Price Expansion"** — useful for distinguishing usage-driven growth (good) from price-increase-driven growth (riskier — can drive churn if perceived as gouging).

### GAAP revenue vs subscription ARR — the reconciliation

ARR is **non-GAAP**. GAAP revenue (ASC 606 / IFRS 15) recognizes over the service period; ARR captures run-rate at a point. A $1.2M 24-month contract signed June 30 produces: $0 GAAP June, ~$50K GAAP July (ratable), $1.2M bookings June, $600K ARR added June 30. The new-logo vs expansion distinction matters in both ARR and GAAP revenue forecasting, but timing differs — a Q1-signed Q3-start new logo adds to Q1 ARR but only Q3+ GAAP. FP&A teams that don't separate cohorts get the timing wrong.

### ARR Venn diagram — how the categories total

The categories don't overlap when defined precisely. The flow:

\`\`\`
                     [STARTING ARR]
                            |
                    +-------+-------+
                    |               |
              [RENEWED]         [CHURNED]
                    |          (Voluntary + Involuntary + Downgrade)
                    |
                    +-------> [RENEWED ARR continues into ending ARR]

         + [NEW LOGO ARR]   --- first-time customer
         + [EXPANSION ARR]  --- upsell + cross-sell + seat-add
         + [REACTIVATION ARR] --- returning churned logo
         - [CHURN ARR]      --- voluntary + involuntary + downgrade

         = [ENDING ARR]
\`\`\`

The "Net New ARR" in the headline equals **(New + Expansion + Reactivation) − Churn** = Ending ARR − Starting ARR. That single number bundles 5+ underlying streams with different mechanics. Unbundling it is the entire point of board-grade ARR analysis.

---

## 🔍 PART 2 — WHY FORECASTING SEPARATELY MATTERS

### Cycle time differentials — 60-180 days vs 30-90 days vs same-quarter

The single biggest reason to forecast new logo and expansion separately is **cycle-time mismatch**. The pipeline that closes this quarter's new-logo ARR was built 60-180 days ago; this quarter's expansion ARR was built 30-90 days ago; this quarter's seat-add was triggered in-quarter or even same-week. Three different cycles → three different leading-indicator dashboards.

| Stream | Median cycle | Range | Forecast leading indicator |
|---|---|---|---|
| New Logo (enterprise) | 120 days | 90-180 | Stage-3 pipeline 4-6 months out |
| New Logo (mid-market) | 75 days | 45-120 | Stage-3 pipeline 2-4 months out |
| New Logo (SMB) | 30 days | 14-60 | Demos-this-month |
| Upsell at renewal | 60 days | 30-120 | Renewal calendar 4-12 wks |
| Cross-sell | 90 days | 45-180 | Product-adoption PQL signals |
| Seat-add (sales-led) | 30 days | 14-90 | Usage triggers + contract |
| Seat-add (PLG self-serve) | 0-7 days | 0-30 | In-product purchase flow |

A finance team forecasting "this quarter's net new ARR" needs **five different leading-indicator dashboards** to do it correctly. A team using one combined "pipeline-to-ARR" model can be massively wrong because the conversion math doesn't apply equally across streams.

### Win-rate differentials — 18-30% vs 55-75% vs 80%+

Different streams have radically different close rates, per Bridge Group 2025, RepVue Q4 2025, and Pavilion State of Sales 2025:

- **New-logo SQL → close**: 18-30% in 2026 (down from 22-35% in 2022 — the post-2022 macro compression hit new-logo win rates by 4-6 points)
- **New-logo enterprise (>$250K ACV)**: 12-20%
- **New-logo mid-market ($50-$250K ACV)**: 20-28%
- **New-logo SMB (<$50K ACV)**: 25-35%
- **Upsell at renewal (existing-customer tier upgrade)**: 55-75%
- **Cross-sell to existing customer**: 35-55%
- **Seat-add (sales-touched)**: 70-85%
- **Seat-add (PLG self-serve)**: 80-95% (effectively no "lose" path; either user buys or doesn't)

The variance is roughly **4x between worst (enterprise new-logo) and best (PLG seat-add)**. A combined "weighted pipeline" forecast that averages across these streams will be systematically wrong on every individual stream, even if the aggregate is roughly right.

### CAC and CAC-payback differentials — 5x cheaper to expand than to hunt

The cost-to-acquire economics are radically different:

| Stream | CAC payback (months) | CAC ratio to new-logo |
|---|---|---|
| New Logo (enterprise) | 18-24 in 2026 | 1.0x baseline |
| New Logo (mid-market) | 15-22 | 0.8-1.0x |
| New Logo (SMB) | 9-15 | 0.5-0.7x |
| Upsell at renewal | 4-9 | 0.2-0.3x |
| Cross-sell | 6-12 | 0.3-0.5x |
| Seat-add (sales-touched) | 2-6 | 0.1-0.2x |
| Seat-add (PLG self-serve) | 0-3 | 0.01-0.05x |

Per [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud), median public-SaaS CAC payback deteriorated from **12 months in 2022 to 15-18 months in 2026**; top-quartile sits at 22 months. The deterioration is largely concentrated in the new-logo stream — expansion CAC has actually held steady or improved as companies invest in CSM-led expansion playbooks.

The implication: **a dollar of new-logo ARR costs roughly 5x more to acquire than a dollar of expansion ARR**, and 20-50x more than a dollar of PLG self-serve seat-add. A board reviewing aggregate "net new ARR" growth without the split has no idea whether the company is becoming more or less capital-efficient.

> ### 🟡 Key Stat
> Per ICONIQ Growth 2025: the **median top-quartile B2B SaaS** at $100M-$500M ARR has a **blended CAC payback of 11-14 months** composed of **new-logo CAC payback of 18-22 months** and **expansion CAC payback of 4-7 months**. The blended number looks acceptable; the new-logo number alone would trigger a board-level capital-efficiency conversation. Companies that report only blended numbers in board packs are hiding the hunt-side capital intensity behind the farm-side efficiency.

### Ownership differentials — AE vs CSM vs PLG funnel vs expansion-AE

Different ARR streams have different organizational owners — and the comp plan, hiring plan, and accountability framework must align with the ownership pattern:

- **New Logo** — owned by Account Executive (AE). Quota carried at full ACV. Comp variable typically 50/50 base/variable; commission rate ~10-12% of new-logo ACV.
- **Upsell at renewal** — owned by Customer Success Manager (CSM) in some models, by an Expansion AE in others, by the original AE in still others. The ownership choice drives the comp design: CSM-owned expansion typically pays 1-3% of expansion ACV; expansion-AE typically pays 6-10%; original-AE retention typically pays full new-logo rate (10-12%).
- **Cross-sell** — typically owned by a product-specific AE (the CRM AE doesn't sell Marketing Hub; the Marketing Hub AE does). Conflict resolution between AEs is a structural problem requiring clear account-mapping rules.
- **Seat-add** — owned by CSM, by PLG growth team for self-serve, by AE for above-threshold deals. Often the **most political** stream because PLG seat-add can pull large dollars out of an AE's territory without involving them.
- **Renewal** — owned by CSM or by a dedicated Renewals Manager. Comp typically 0.5-1.5% of renewed ACV with health-score gates.
- **Churn prevention** — owned by CSM with retention SPIFF on saves; some companies pay 2-5x normal CSM variable on prevented churn events.

The ownership map drives the **forecast accountability**: who do you ask for the new-logo number? The Sales VP. The expansion number? The CS VP or the Sales VP depending on org design. The seat-add number? The Product Growth lead. A single "ARR forecast" with no ownership map is unaccountable.

### The Net Revenue Retention lens — 130%+ NRR masks decaying hunt

Net Revenue Retention (NRR) — also called Net Dollar Retention (NDR) — is the single metric that exposes the expansion-vs-new-logo dynamic most clearly. NRR = (Starting ARR + Expansion − Churn − Downgrade) / Starting ARR for a cohort.

- **NRR < 100%**: cohort is shrinking (churn + downgrade exceed expansion)
- **NRR = 100-110%**: cohort is healthy but not expansion-driven
- **NRR = 110-125%**: solid expansion engine
- **NRR = 125-140%**: top-quartile expansion (Datadog, Snowflake, MongoDB, Klaviyo territory)
- **NRR > 140%**: outlier expansion (consumption-pricing companies in growth mode)

The trap: a company with **130% NRR** is growing existing-customer ARR by 30% organically each year — which means **even with zero new logos, total ARR grows 30%/year**. This is wonderful for total ARR growth but masks an underlying death spiral if new-logo motion is failing. The TAM gets exhausted; eventually expansion plateaus; the new-logo engine that should have been built was deferred for 2-4 years; the company is then structurally incapable of breaking through.

The mid-2024 anti-pattern: several mid-cap SaaS companies (publicly reporting NRR > 120%) saw new-logo customer counts decline for 3-4 consecutive quarters while total ARR continued growing on expansion. The decline was invisible in headline metrics; only the broken-out new-customer-count line in the 10-Q revealed it. The companies that disclosed the split honestly got punished by analysts at the time; the companies that didn't disclose it suffered larger guidance misses 2-3 quarters later when expansion finally couldn't compensate.

### Forecast-accuracy delta — 65-75% combined vs 88-92% split

The practical impact of splitting the forecast vs combining it:

- **Combined "net new ARR" forecast**: typical quarterly accuracy of 65-75% (forecast within ±10-15% of actual)
- **Split forecast (new logo + expansion + churn separate)**: typical quarterly accuracy of 88-92% (forecast within ±5-8% of actual)

The 15-20 percentage-point delta comes from two sources:

1. **Stream-specific signals**: each stream has its own leading indicator (pipeline coverage for new logo, renewal calendar for expansion, health scores for churn). A combined forecast can use only one signal — usually a generic "pipeline coverage" — which is wrong for 70% of the ARR.
2. **Error cancellation suppression**: combined forecasts can look right by luck (new-logo miss offsets expansion beat); split forecasts force the analyst to confront each error.

Per [Clari 2024 Forecast Accuracy Benchmark](https://www.clari.com/) (n=400+ B2B SaaS): companies forecasting at the split-stream level showed **88% median quarterly accuracy** vs **71% for combined-only forecasters**. The implication for public-company guidance: companies that combine the streams have meaningfully higher guidance-miss risk.

> ### 📊 Quick Facts
> Per Pavilion 2025 GTM Benchmark Survey: of 2,800+ B2B SaaS forecasting respondents, **only 38% separate new logo and expansion in their primary forecast view**, and **only 22% further sub-split expansion into upsell/cross-sell/seat-add**. The 22% who run the full sub-split report **median quarterly accuracy of 91%** vs **68% for the combined-only group** — a 23-point delta that maps directly to guidance-miss frequency for public companies and to fundraise-narrative credibility for private companies.

---

## 📊 PART 3 — THE FORECASTING MECHANICS

### Forecasting New Logo — pipeline coverage 3-4x by stage

New-logo forecasting is the classic SaaS sales forecast, built on stage-gated pipeline coverage:

- **Stage definition**: typically MEDDPICC, BANT, or SCOTSMAN-style; 5-7 named stages from prospect to closed-won
- **Coverage ratio**: ratio of pipeline ARR at each stage to the period's quota; standard is **3.0-4.0x for the quarter** (the lower bound assumes higher win rates, the upper bound for lower-win-rate enterprise motion)
- **Stage conversion**: empirical conversion rate from stage to stage; e.g., Discovery → Proposal 40%, Proposal → Verbal 60%, Verbal → Close 75%
- **Weighted pipeline**: pipeline ARR × stage probability summed
- **Forecast commit**: AE-judgment-weighted commit number (vs the systematic weighted pipeline)
- **Reconciliation**: AE commit vs systematic weighted pipeline vs sales-manager call; reconcile via Clari, Gong Forecast, or Salesforce Forecast Manager

The two primary failure modes: (a) **stale pipeline** (deals over 90 days in stage skew weighted forecast upward), (b) **judgment override** (AE commits more than weighted pipeline supports, common at quarter-end). Pipeline hygiene + stale-deal automation in Clari/Gong/BoostUp materially improves new-logo forecast accuracy.

### Forecasting Expansion at renewal — the 4-12 week renewal book

Expansion-at-renewal forecasting is a fundamentally different mechanic from new-logo pipeline:

- **Renewal calendar**: a list of every customer with a contract end date in the period, ranked by start-of-period ARR
- **Renewal probability**: per-account renewal likelihood gated by health score (Gainsight, ChurnZero, Vitally, Catalyst all maintain this)
- **Expansion intent**: per-account expansion signal — usage growth, feature requests, additional-team interest
- **CSM forecast call**: per-account renew + expand prediction from the account owner
- **Reconciliation**: aggregate to a renewal-book ARR forecast

The cadence is **rolling 4-12 weeks out**: a customer renewing in 4 weeks should have a high-confidence forecast; a customer renewing in 12 weeks has a lower-confidence directional forecast. By the time the customer is 2 weeks from renewal, the forecast should be ±5%.

The leading indicators that matter: **product usage trend** (Gainsight Product Experience), **support ticket volume + sentiment** (Zendesk + Gong Sentiment), **executive-sponsor engagement** (LinkedIn activity + champion-mapping), **contract-end-date conversation start** (typically 90 days out).

### Forecasting Cross-sell — product-adoption signals and PQL gating

Cross-sell forecasting requires a **Product-Qualified Lead (PQL) model**:

- **PQL definition**: a usage signal in the existing product that indicates fit for an additional product; e.g., a CRM customer creating > 1,000 email sequences/month is a PQL for Marketing Hub
- **PQL → SQL conversion**: typically 25-40% (PQL is a positive signal but not yet sales-ready)
- **SQL → close conversion**: typically 35-55% (existing-customer relationship helps but cross-sell still requires evaluation)
- **Forecast model**: PQL count × PQL→SQL conversion × SQL→close conversion × average cross-sell ACV
- **Cycle**: typically 60-120 days from PQL trigger to close

Cross-sell forecasting is heavily product-adoption-data-driven, which means the tooling stack matters: [Pendo](https://www.pendo.io/), [Heap](https://www.heap.io/), [Mixpanel](https://mixpanel.com/), [Amplitude](https://amplitude.com/) for usage signals; Gainsight or ChurnZero for the PQL queue; Salesforce/HubSpot for the opportunity stage progression.

### Forecasting Seat-add — PLG funnel telemetry and self-serve velocity

Seat-add forecasting splits by motion:

**Sales-led seat-add** (customer with sales contact requests more seats): forecast via the upsell-pipeline mechanic above. Cycle 14-90 days. Conversion 70-85%.

**Self-serve PLG seat-add** (customer adds seats via in-product purchase flow): forecast via funnel telemetry:

- **Active seat utilization** by customer
- **In-product "add seats" CTA exposure rate**
- **Conversion of CTA to purchase**: typically 2-8% per impression
- **Trend on monthly active users (MAU) per account**

The PLG seat-add forecast is essentially a **MAU-growth-driven forecast**: if MAU/account is growing 5%/month and seat utilization is at 85%, expect seat-add to follow MAU growth with a 1-2 month lag. Tools: [Mixpanel](https://mixpanel.com/), [Amplitude](https://amplitude.com/), [Heap](https://www.heap.io/), [PostHog](https://posthog.com/), [June](https://www.june.so/) for the telemetry; [Stripe Billing](https://stripe.com/billing) or [Chargebee](https://www.chargebee.com/) for the purchase flow conversion data.

> ### 📊 Quick Facts
> Per OpenView 2025 PLG Benchmarks: PLG-native B2B SaaS at $50-$200M ARR see **self-serve seat-add contribute 25-45% of total expansion ARR** and **2-5% of monthly recurring revenue come from in-product purchase events with zero sales touch**. Companies that don't forecast this stream separately routinely mis-forecast expansion by 20-40% in either direction depending on PLG funnel performance.

### Forecasting Churn — health-score cohorts and retention curves

Churn forecasting uses **cohort retention curves**:

- **Health score per account**: composite of usage, sentiment, NPS, support tickets, executive engagement (Gainsight, ChurnZero, Vitally, Catalyst all maintain this)
- **Cohort decay model**: empirical retention curve from historical cohorts; e.g., "90-day-old SMB customer cohort retains at 92%, mid-market at 96%, enterprise at 98%"
- **Period churn forecast**: probability-weighted churn from each cohort + at-risk-account specific predictions
- **Voluntary vs involuntary split**: dunning retry rate (typically 60-80% recovery on involuntary)

The leading indicators: **declining product usage**, **NPS drop**, **support ticket volume spike**, **executive sponsor change at customer**, **competitor presence in account** (intent data from [6sense](https://6sense.com/), [Bombora](https://bombora.com/), [Demandbase](https://www.demandbase.com/)).

### Tool stack — Clari, Gong, BoostUp, Salesforce Forecast, ZoomInfo

The 2026 forecasting tool landscape:

| Tool | Primary use | Stream coverage |
|---|---|---|
| Clari | Pipeline + forecast + revenue analytics | New logo + expansion |
| Gong Forecast | Conversation-intelligence-based forecast | New logo primary |
| BoostUp | Revenue operations platform | New logo + expansion + renewal |
| Salesforce Forecast | Native CRM forecast | New logo primary; weak on expansion |
| HubSpot Forecast | Native CRM forecast (HubSpot-shop only) | New logo + expansion at renewal |
| Aviso | AI-driven forecast | New logo primary |
| ZoomInfo Forecast / Chorus | Pipeline + conversation intel | New logo primary |
| Gainsight | CS platform with renewal forecast | Expansion + churn |
| ChurnZero | CS platform with renewal forecast | Expansion + churn |
| Vitally | CS platform with revenue forecast | Expansion + churn |
| Catalyst | CS platform | Expansion + churn |
| Pendo / Heap / Amplitude | Product usage telemetry | Seat-add + PQL signals |

The best-of-breed 2026 stack for a $100M-$500M ARR SaaS company: **Salesforce + Clari** for new-logo forecast, **Gainsight or ChurnZero** for renewal + expansion + churn forecast, **Amplitude or Heap** for PQL + seat-add telemetry, with reconciliation in a finance-owned dashboard (Looker, Tableau, or Mode).

### FP&A journal-entry mechanics — separate accounts in NetSuite / Sage Intacct

The FP&A side requires separate general-ledger accounts for each ARR category. In [NetSuite](https://www.netsuite.com/), [Sage Intacct](https://www.sage.com/en-us/sage-intacct/), or [QuickBooks Enterprise](https://quickbooks.intuit.com/enterprise/) accounting systems, this means creating distinct revenue accounts:

- **4010 — New Logo Subscription Revenue**
- **4020 — Expansion Subscription Revenue (Upsell)**
- **4021 — Expansion Subscription Revenue (Cross-sell)**
- **4022 — Expansion Subscription Revenue (Seat-add)**
- **4030 — Reactivation Subscription Revenue**
- **4040 — Renewal Subscription Revenue**
- **4090 — Subscription Revenue — Churn / Downgrade Reversal**

The chart-of-accounts split flows through the entire FP&A stack: monthly close, quarterly variance analysis, board reporting, audit. A company with a single "4000 — Subscription Revenue" account cannot produce the split at the GL level — only via parallel non-GAAP tracking in a separate system (which is acceptable but adds reconciliation burden).

Per [BlackLine](https://www.blackline.com/) and [Adaptive Insights](https://www.workday.com/en-us/products/adaptive-planning/overview.html) close-process surveys, **only ~35% of mid-stage SaaS companies (under $300M ARR) maintain the GL split**; the rest reconstruct it monthly from CPQ + CRM data, which is error-prone and slow. The fix is straightforward — split the chart of accounts — but the migration is painful for companies with multiple years of un-split history.

### The board-slide construction — combined headline + component breakout

A board-grade ARR slide always shows **both** the combined headline number and the component breakdown:

**Combined headline (top of slide):**
> "Q3 Net New ARR: $42.5M (+18% Y/Y)"

**Component breakdown (waterfall chart):**
> Starting ARR: $185M
> + New Logo: $15M
> + Upsell: $12M
> + Cross-sell: $8M
> + Seat-add: $14M
> − Voluntary Churn: $4M
> − Involuntary Churn: $0.5M
> − Downgrade: $2M
> = Ending ARR: $227.5M
> = Net New ARR: $42.5M

The combined number satisfies the board-member-skimming-the-deck use case; the breakdown satisfies the analyst-asking-questions use case. **Always show both.** A slide with only the combined number invites the question "what's the new-logo number alone?" — and not having that answer ready is a credibility hit.

### The Rule of 40 split — new-logo growth and expansion growth as separate lines

The [Rule of 40](https://www.bvp.com/atlas/the-rule-of-40) — growth rate + free cash flow margin ≥ 40% — is the most-watched SaaS efficiency benchmark. Best practice: split the growth-rate component into **new-logo growth** and **expansion growth** as separate lines:

- **New-Logo Growth Rate**: new-logo ARR added in TTM / starting ARR
- **Expansion Growth Rate**: expansion ARR added in TTM / starting ARR
- **Net Growth Rate**: total net new ARR / starting ARR (= NRR-1 + new-logo growth)

A "40% growth + 0% FCF margin = Rule of 40" company could be:
- **30% new-logo + 10% expansion** (healthy hunt, modest farm)
- **10% new-logo + 30% expansion** (hunt is dying, farm is carrying)
- **20% new-logo + 20% expansion** (balanced)

These are very different operational realities — and the latter two have different long-term TAM-saturation risk. Best-in-class board reporting shows the split.

---

## 📈 PART 4 — REAL-WORLD APPLICATION

### Snowflake's 130%+ NRR — expansion dominates the growth story

[Snowflake](https://investors.snowflake.com/)'s quarterly earnings consistently disclose Net Revenue Retention in the 130-160% range (peaking near 178% in 2021, settling in the 125-130% range by FY26). The implication: **the majority of Snowflake's growth comes from existing customers expanding consumption**, not from net-new logos.

The Snowflake disclosure pattern (per recent 10-Qs and earnings transcripts):
- Total customer count: ~10,000+
- Customers > $1M ARR: ~500+
- Net Revenue Retention: 125-135% recent quarters
- New-logo ARR contribution: estimable at ~20-25% of net new ARR
- Expansion ARR contribution: ~75-80% of net new ARR

For a consumption-priced SaaS like Snowflake, expansion is structurally the dominant stream. A finance team forecasting Snowflake's growth as a single "net new ARR" number would miss the underlying dynamic: **expansion is workload-growth-driven** (more queries, more data, more compute) and forecasts off product usage telemetry, **not** sales pipeline. The forecasting mechanic is more like a consumption-product company (AWS, GCP) than a traditional seat-license SaaS.

### HubSpot, Salesforce, Asana, Monday, ZoomInfo, Klaviyo — the disclosed mix

Recent quarterly disclosures from a representative cross-section of public SaaS:

- **[HubSpot](https://ir.hubspot.com/)**: customer count + ARPU disclosed quarterly; back-solving reveals roughly **55-65% of net new ARR from new logo, 35-45% from expansion** (HubSpot is a strong new-logo motion company)
- **[Salesforce](https://investor.salesforce.com/)**: cRPO (current Remaining Performance Obligation) and total RPO disclosed; mix is roughly **40-50% new logo, 50-60% expansion** at current scale
- **[Asana](https://investors.asana.com/)**: customer count tiered (>$5K, >$50K, >$100K); roughly **45-55% new logo, 45-55% expansion**
- **[Monday.com](https://ir.monday.com/)**: customer counts tiered (>$50K, >$100K); roughly **40-50% new logo, 50-60% expansion**
- **[ZoomInfo](https://ir.zoominfo.com/)**: NRR disclosed (~85-95% in recent quarters — under 100% means contraction); the company is in an expansion-deficit period
- **[Klaviyo](https://investors.klaviyo.com/)**: NRR ~108-115%; mix roughly **60-70% new logo, 30-40% expansion** (Klaviyo's SMB-heavy ICP drives more new-logo motion)
- **[MongoDB](https://investors.mongodb.com/)**: NRR ~120%+; mix roughly **30-40% new logo, 60-70% expansion** (Atlas consumption growth dominates)
- **[Datadog](https://investors.datadoghq.com/)**: NRR ~115-125%; **65-75% of growth from expansion** historically; **80%+ of customers use 2+ products** (cross-sell-heavy)

The takeaway: **mix varies enormously by motion and ICP** — consumption-priced companies skew heavily to expansion; seat-license SMB-focused companies skew to new logo; enterprise-focused multi-product companies sit in the middle. A finance team without the split cannot benchmark against the right comparable set.

### The "expansion masked the leak" anti-pattern — mid-2024 case studies

Several mid-2024 public SaaS companies experienced the **"expansion masked the leak"** pattern: total ARR continued growing on the strength of existing-customer expansion while new-logo customer counts declined for 3-4 consecutive quarters before the dynamic surfaced in guidance misses or executive transitions.

The structural shape (anonymized but characteristic):
- Q1 2024: total ARR up 22% Y/Y; new-logo customer count down 8% Y/Y; expansion ARR up 32%
- Q2 2024: total ARR up 19% Y/Y; new-logo customer count down 14% Y/Y; expansion ARR up 28%
- Q3 2024: total ARR up 16% Y/Y; new-logo customer count down 18% Y/Y; expansion ARR up 24%
- Q4 2024: guidance miss; CEO/CRO transition announced; stock down 25-40% in single session

The pattern is structural: **expansion can compensate for declining hunt for 4-6 quarters** before the math gives out — the existing-customer base eventually saturates expansion potential, and the absent new-logo additions create a structural growth gap that cannot be recovered. The companies that disclosed the new-logo decline early got punished with stock-price pressure but maintained credibility; the companies that hid behind aggregate "Net New ARR" suffered larger declines when the dynamic surfaced.

> ### ⚠️ Warning
> The "expansion masked the leak" pattern is **specifically a board-and-CEO failure mode**, not a CFO failure mode. CFOs and FP&A teams typically have the split data; the question is whether the board insists on seeing it. A board that accepts "Net New ARR" as the headline KPI without demanding the new-logo / expansion / churn split is implicitly choosing not to detect this pattern. The fix is governance: **add new-logo customer count, new-logo ARR, expansion ARR, gross dollar retention, and net dollar retention as standing board-deck line items** — not buried in the appendix.

### Sales-comp design — paying AE flat on new-logo vs expansion is wrong

The sales-comp implication of the new-logo vs expansion distinction is significant: **paying AEs the same commission rate on new logo vs expansion creates wrong incentives**. The math:

- **New-logo ACV**: 10-12% commission, 18-30% close rate, 60-180 day cycle = ~$2,500-$4,000 of commission per attempted deal cycle
- **Expansion ACV**: same 10-12% commission, 55-75% close rate, 30-90 day cycle = ~$6,000-$9,000 of commission per attempted deal cycle

A flat-rate AE will rationally over-rotate toward expansion farming because it's 2-3x more lucrative per unit of effort. Result: new-logo motion withers; total ARR grows on expansion; board notices at the next fundraise.

Best-practice fix: **pay 2-3x more commission on new-logo ACV than on expansion ACV**, or assign expansion to a dedicated team (CSM, expansion-AE) with a different (lower-rate) comp plan. Per Pavilion 2025 Sales Comp Benchmarks, the modal split:

- **New-logo AE**: 10-12% on new-logo ACV; 3-5% on expansion ACV; 0% on renewal
- **Expansion AE**: 5-8% on expansion ACV; 0% on new logo
- **CSM with expansion quota**: 1-3% on expansion ACV; 0% on new logo; SPIFFs on renewal/save events

The structural choice: do you want one comp plan covering both motions (simple but creates wrong incentives) or two separate comp plans by motion (more complex but aligns incentives)? The 2026 best-practice answer is the latter for any company over ~$50M ARR.

### CSM and expansion-AE comp structures — the 1-3% expansion ACV model

For companies that route expansion through Customer Success or Expansion AE roles, the comp structures:

**CSM with expansion quota:**
- Base: $80-$130K depending on segment
- Variable: $30-$60K based on 50% retention + 30% expansion + 20% MBO/NPS
- Expansion commission: 1-3% of expansion ACV
- Quota: typically 110-120% of starting book (so the CSM must drive 10-20% net expansion to hit target)

**Dedicated Expansion AE:**
- Base: $90-$130K
- Variable: $90-$130K
- Commission: 5-8% on expansion ACV
- Quota: $1.5-$3.5M of expansion ACV depending on segment

**Renewal Manager:**
- Base: $70-$110K
- Variable: $30-$60K
- Commission: 0.5-1.5% of renewed ACV with health-score gates
- Quota: 90-95% gross dollar retention as target

The choice depends on the expansion mechanism: high-touch enterprise upsell → Expansion AE; mid-market mixed motion → CSM with quota; SMB → automated renewal-manager + PLG funnel.

### Tooling for expansion playbooks — ChurnZero, Gainsight, Vitally, Catalyst

The 2026 expansion + retention tooling stack:

| Tool | Primary use | Best fit |
|---|---|---|
| [Gainsight](https://www.gainsight.com/) | Enterprise CS platform with health scoring + playbooks | $100M+ ARR enterprise |
| [ChurnZero](https://churnzero.com/) | CS platform with strong automation | $30-$200M ARR mid-market |
| [Vitally](https://www.vitally.io/) | Modern CS platform with revenue forecasting | $20-$150M ARR |
| [Catalyst](https://catalyst.io/) | CS platform acquired by Totango | mid-market |
| [Totango](https://www.totango.com/) | CS platform (merged with Catalyst) | mid-market to enterprise |
| [HubSpot Service Hub](https://www.hubspot.com/products/service) | CS for HubSpot-shop companies | SMB to mid-market |
| [Planhat](https://www.planhat.com/) | EU-strong CS platform | $20-$100M ARR |
| [ClientSuccess](https://www.clientsuccess.com/) | Lightweight CS platform | sub-$50M ARR |

The platforms maintain the health-score model, the playbook automation, the renewal forecast, and the expansion-opportunity queue. They are not optional at scale — a $100M ARR company without a CS platform is structurally incapable of forecasting expansion accurately.

### Diagnosing the miss — is it new-logo conversion, expansion close rate, or churn timing?

When the quarterly forecast misses, the diagnostic question is: **which stream broke?** The answers and the fixes are radically different:

- **New-logo miss**: pipeline coverage shortfall or stage-conversion decay. Fix: marketing pipeline generation, AE ramp acceleration, ICP refinement, win-rate analysis.
- **Expansion miss**: renewal slippage or health-score decay. Fix: CSM playbook execution, executive-sponsor engagement, product-roadmap alignment with customer requests.
- **Cross-sell miss**: PQL volume shortfall or product-attach failure. Fix: in-product PQL trigger tuning, product-roadmap multi-product strategy.
- **Seat-add miss**: MAU growth deceleration or in-product purchase friction. Fix: product-led growth investment, in-product purchase flow optimization.
- **Churn miss**: voluntary churn spike or involuntary recovery decline. Fix: health-score model retuning, dunning automation, exit-interview process.

A combined forecast miss with no stream-level diagnostics is **operationally undebuggable**. The miss happened; the cause is unknown; the fix is guesswork. Split-stream forecasting makes the miss diagnosable.

### The CFO and board playbook — how to present the split

The CFO playbook for presenting the split in board materials:

**Standing board-deck line items (every quarter):**
- Starting ARR
- New Logo ARR (count + dollars)
- Expansion ARR (upsell + cross-sell + seat-add sub-split if material)
- Reactivation ARR
- Voluntary Churn ARR
- Involuntary Churn ARR
- Downgrade ARR
- Ending ARR
- Gross Dollar Retention (12-month TTM)
- Net Dollar Retention (12-month TTM)
- New-Logo Customer Count (start + ended + churned)
- New-Logo CAC Payback (months)
- Expansion CAC Payback (months)

**Variance analysis (quarterly):**
- Forecast vs actual by stream
- Driver analysis for each variance
- Forward-quarter outlook by stream

**Strategic discussion (semi-annual):**
- New-logo motion health (is the hunt working?)
- Expansion motion health (is the farm saturating?)
- ICP refinement based on retention cohort data
- Comp plan effectiveness review

This level of disclosure is **table stakes for public-company guidance** and **strongly preferred for late-stage private-company board reporting**. Boards that accept aggregate-only reporting are accepting forecast risk they don't need to take.

`;

const flow = `

## Decision Flow: Forecasting Net New ARR vs Expansion ARR Separately

\`\`\`mermaid
flowchart TD
    A[Start Period ARR Forecast] --> B{Split or Combined?}
    B -->|Combined Single Bucket| C[Generic Pipeline Coverage Model]
    C --> C1[Forecast Accuracy 65 to 75 Percent]
    C1 --> C2[Cannot Diagnose Stream Level Misses]
    C2 --> C3[Risk of Expansion Masks Leak Pattern]
    B -->|Split Six Category| D[Per Stream Forecast Models]
    D --> E[New Logo Stream]
    D --> F[Expansion Stream]
    D --> G[Churn Stream]
    E --> E1[Pipeline Coverage 3 to 4x by Stage]
    E1 --> E2[Stage Conversion Rates Discovery to Close]
    E2 --> E3[AE Commit vs Weighted Pipeline]
    E3 --> E4[Reconcile in Clari Gong BoostUp]
    E4 --> H[New Logo Forecast]
    F --> F1{Expansion Sub Stream}
    F1 -->|Upsell at Renewal| F2[Renewal Calendar 4 to 12 Weeks Out]
    F1 -->|Cross Sell| F3[PQL Signal Model via Product Telemetry]
    F1 -->|Seat Add Sales Led| F4[Upsell Pipeline Model]
    F1 -->|Seat Add PLG Self Serve| F5[MAU Growth and Funnel Telemetry]
    F2 --> F6[Health Score Gate per Account]
    F3 --> F7[Pendo Heap Amplitude PQL Triggers]
    F4 --> F8[Account Account Mapping CSM AE]
    F5 --> F9[In Product Purchase Conversion Rate]
    F6 --> I[Expansion Forecast]
    F7 --> I
    F8 --> I
    F9 --> I
    G --> G1[Health Score Cohort Decay Model]
    G1 --> G2[Voluntary vs Involuntary vs Downgrade Split]
    G2 --> G3[Dunning Automation Recovery 60 to 80 Percent]
    G3 --> J[Churn Forecast]
    H --> K[Aggregate Net New ARR Forecast]
    I --> K
    J --> K
    K --> L[Forecast Accuracy 88 to 92 Percent]
    L --> M[Board Slide Combined Headline + Component Waterfall]
    M --> N[Variance Analysis by Stream]
    N --> O{Miss Detected?}
    O -->|New Logo Miss| O1[Pipeline Generation + Win Rate Diagnosis]
    O -->|Expansion Miss| O2[Renewal Slippage + Health Score Decay Fix]
    O -->|Churn Miss| O3[Health Model Retune + Dunning Improvement]
    O -->|No Miss| P[Continue Normal Cadence]
    O1 --> Q[Stream Level Corrective Action]
    O2 --> Q
    O3 --> Q
\`\`\`

## ARR Walk Cascade: Six Category Bridge from Starting to Ending ARR

\`\`\`mermaid
flowchart LR
    A[Starting ARR Period Open] --> B{ARR Walk Components}
    B --> C[Plus New Logo ARR]
    B --> D[Plus Expansion ARR]
    B --> E[Plus Reactivation ARR]
    B --> F[Minus Voluntary Churn]
    B --> G[Minus Involuntary Churn]
    B --> H[Minus Downgrade ARR]
    C --> C1[Hunt Motion AE Owned]
    C1 --> C2[Cycle 60 to 180 Days]
    C2 --> C3[Win Rate 18 to 30 Percent]
    C3 --> C4[CAC Payback 15 to 22 Months]
    D --> D1{Expansion Sub Stream}
    D1 --> D2[Upsell Tier Upgrade]
    D1 --> D3[Cross Sell New Product]
    D1 --> D4[Seat Add License Expansion]
    D2 --> D5[CSM or Expansion AE Owned]
    D3 --> D6[Product AE Owned]
    D4 --> D7[PLG Funnel or AE Owned]
    D5 --> D8[Cycle 30 to 90 Days]
    D6 --> D8
    D7 --> D8
    D8 --> D9[Win Rate 55 to 75 Percent or 80 Plus for Seat Add]
    D9 --> D10[CAC Payback 4 to 9 Months]
    E --> E1[Returning Churned Logo]
    E1 --> E2[Win Back Queue Monthly]
    F --> F1[Customer Active Cancellation]
    F1 --> F2[Health Score Cohort Forecast]
    G --> G1[Payment Failure Card Decline]
    G1 --> G2[Dunning Recovery 60 to 80 Percent]
    H --> H1[Tier Reduction or Seat Decrease]
    H1 --> H2[Often Under Tracked Category]
    C4 --> I[Net New ARR Aggregate]
    D10 --> I
    E2 --> I
    F2 --> I
    G2 --> I
    H2 --> I
    I --> J[Ending ARR Period Close]
    J --> K[NRR Calculation Starting Plus Expansion Minus Churn over Starting]
    K --> L{NRR Tier}
    L -->|Under 100 Percent| L1[Contraction Risk Cohort Shrinking]
    L -->|100 to 110 Percent| L2[Healthy Not Expansion Driven]
    L -->|110 to 125 Percent| L3[Solid Expansion Engine]
    L -->|125 to 140 Percent| L4[Top Quartile Snowflake Datadog Territory]
    L -->|Over 140 Percent| L5[Consumption Pricing Outlier]
    L1 --> M[Diagnostic and Strategic Response]
    L2 --> M
    L3 --> M
    L4 --> M
    L5 --> M
\`\`\`

`;

const src = `

## Sources

1. **ICONIQ Growth Topline Growth Index 2025** — n=320+ growth-stage SaaS; new-logo vs expansion mix data. Primary citation for 62-78% expansion-dominated growth at $200M-$1B ARR. https://www.iconiqcapital.com/growth/insights
2. **Bessemer State of the Cloud 2026** — n=83 public + ~600 private; CAC payback, NRR, Rule of 40 splits. https://www.bvp.com/atlas/state-of-the-cloud
3. **OpenView SaaS + PLG Benchmarks 2025** — PLG vs sales-led expansion composition data. https://openviewpartners.com/blog/
4. **ChurnZero State of Customer Success 2025** — CS-led expansion playbooks; CSM comp; renewal forecast accuracy. https://churnzero.com/
5. **Gainsight CS Benchmarks 2025** — health-score model; renewal-calendar mechanics; expansion automation. https://www.gainsight.com/
6. **ChartMogul SaaS Benchmarks 2025** — GDR vs NDR benchmarks; ARR walk standard taxonomy. https://chartmogul.com/
7. **Maxio (formerly SaaSOptics) 2025 SaaS Metrics Report** — subscription metric taxonomy; expansion sub-split; quantity vs price expansion. https://www.maxio.com/
8. **Pavilion State of Sales Comp 2025 + GTM Benchmark Survey 2025** — sales comp splits; new-logo vs expansion commission; forecast accuracy split vs combined. https://www.joinpavilion.com/
9. **Bridge Group 2025 SaaS AE Metrics Report** — n=412; AE win rates and cycle times by segment. https://blog.bridgegroupinc.com/
10. **RepVue Q4 2025 Dataset** — n=11,400 AEs; quota attainment distribution. https://repvue.com/
11. **Clari 2024 Forecast Accuracy Benchmark** — n=400+ B2B SaaS; quarterly forecast accuracy by split vs combined. https://www.clari.com/
12. **a16z Enterprise GTM Research** — sales motion design; org structure for new-logo vs expansion. https://a16z.com/enterprise/
13. **Snowflake 10-Q + Earnings (FY24-FY26)** — NRR 125-160%; consumption-expansion mechanics. https://investors.snowflake.com/
14. **HubSpot 10-Q + Earnings (FY24-FY26)** — customer count + ARPU enabling split back-solve. https://ir.hubspot.com/
15. **Salesforce 10-Q + Earnings (FY24-FY26)** — cRPO and RPO; new-logo vs expansion mix at enterprise scale. https://investor.salesforce.com/
16. **Asana 10-Q (FY24-FY26)** — tiered customer count (>$5K, >$50K, >$100K). https://investors.asana.com/
17. **Monday.com 10-Q (FY24-FY26)** — tiered customer count (>$50K, >$100K). https://ir.monday.com/
18. **ZoomInfo 10-Q (FY24-FY26)** — NRR 85-95% (contraction period). https://ir.zoominfo.com/
19. **Klaviyo 10-Q (FY24-FY26)** — NRR ~108-115% with SMB-heavy new-logo mix. https://investors.klaviyo.com/
20. **MongoDB 10-Q (FY24-FY26)** — Atlas consumption expansion dominance; NRR 120%+. https://investors.mongodb.com/
21. **Datadog 10-Q (FY24-FY26)** — NRR 115-125%; multi-product attach 80%+. https://investors.datadoghq.com/
22. **NetSuite Subscription Billing Docs** — GL structure for subscription revenue; ASC 606. https://www.netsuite.com/
23. **Sage Intacct Subscription Revenue Module** — chart-of-accounts standard. https://www.sage.com/en-us/sage-intacct/
24. **BlackLine Close Process Benchmarks** — mid-stage SaaS GL split adoption rates. https://www.blackline.com/
25. **Workday Adaptive Insights** — FP&A forecasting cadence benchmarks. https://www.workday.com/en-us/products/adaptive-planning/overview.html
26. **Gong Forecast** — conversation-intelligence forecasting; sentiment-gated pipeline. https://www.gong.io/
27. **BoostUp** — pipeline + expansion + renewal forecast unified platform. https://www.boostup.ai/
28. **Aviso AI Forecast** — AI-driven new-logo forecast methodology. https://www.aviso.com/
29. **Vitally CS Platform** — revenue forecasting in CS platforms. https://www.vitally.io/
30. **Catalyst CS Platform** — health-score model for renewal + expansion. https://catalyst.io/
31. **Totango (merged with Catalyst)** — mid-market CS platform. https://www.totango.com/
32. **Pendo Product Analytics** — PQL signal construction; in-product purchase telemetry. https://www.pendo.io/
33. **Heap Product Analytics** — auto-captured event analytics for PQL and seat-add. https://www.heap.io/
34. **Amplitude Product Analytics** — PLG funnel telemetry; MAU growth tracking. https://amplitude.com/
35. **Mixpanel Product Analytics** — event telemetry for cross-sell PQL gating. https://mixpanel.com/
36. **PostHog** — open-source telemetry for PLG funnel. https://posthog.com/
37. **Stripe Billing** — subscription billing; dunning automation. https://stripe.com/billing
38. **Chargebee** — recurring billing + dunning recovery (Chargebee Recover). https://www.chargebee.com/
39. **Recurly** — subscription metric taxonomy and dashboard reference. https://recurly.com/
40. **SaaStr 2025 Cohort Data** — monthly ARR variance benchmarks at $30M ARR. https://www.saastr.com/
41. **6sense Intent Data** — competitor presence + buying intent for expansion + churn. https://6sense.com/
42. **Bombora Intent Data** — third-party intent for expansion and competitive risk. https://bombora.com/
43. **Demandbase ABM** — account intelligence for new-logo and expansion. https://www.demandbase.com/
44. **June Analytics** — PLG-focused analytics; cohort retention and seat-add telemetry. https://www.june.so/
45. **PwC Subscription Revenue Audit Guidance** — ASC 606 to SaaS; ARR vs revenue reconciliation. https://www.pwc.com/
46. **KPMG SaaS Audit Practice** — subscription metric audit standards. https://kpmg.com/
47. **Deloitte SaaS Industry Practice** — subscription revenue recognition + ARR metrics. https://www.deloitte.com/
48. **The Rule of 40 (Bessemer Atlas)** — Rule of 40 mechanics; growth + FCF margin benchmark. https://www.bvp.com/atlas/the-rule-of-40
49. **Looker / Tableau / Mode SaaS Templates** — ARR walk dashboard construction. https://www.looker.com/
50. **Planhat EU CS Platform** — EU-strong CS platform with revenue forecasting. https://www.planhat.com/

`;

const num = `

## Numbers

**The 6 ARR Categories — Standard Taxonomy**

| Category | Definition | Sign | Forecasting cadence |
|---|---|---|---|
| New Logo ARR | First-time customer in-period | + | Pipeline coverage weekly |
| Expansion ARR (Upsell) | Tier upgrade | + | Renewal calendar 4-12 wks |
| Expansion ARR (Cross-sell) | New product attach | + | PQL signal monthly |
| Expansion ARR (Seat-add) | License expansion same product | + | MAU + telemetry real-time |
| Reactivation ARR | Returning churned logo | + | Win-back queue monthly |
| Renewal ARR | Continuation at flat value | continuation | Renewal book 90 days out |
| Churn ARR (Voluntary) | Customer cancellation | − | Health-score cohort |
| Churn ARR (Involuntary) | Payment failure | − | Dunning automation |
| Churn ARR (Downgrade) | Tier or seat reduction | − | Health-score gated |
| Net ARR | Sum of above (ending − starting) | +/− | Headline aggregate |

**Cycle Time by Stream**

| Stream | Median cycle | Range |
|---|---|---|
| New Logo enterprise | 120 days | 90-180 |
| New Logo mid-market | 75 days | 45-120 |
| New Logo SMB | 30 days | 14-60 |
| Upsell at renewal | 60 days | 30-120 |
| Cross-sell | 90 days | 45-180 |
| Seat-add sales-led | 30 days | 14-90 |
| Seat-add PLG self-serve | 0-7 days | 0-30 |

**Win Rate by Stream (2026)**

| Stream | Win rate |
|---|---|
| New-logo SQL → close | 18-30% |
| New-logo enterprise (>$250K ACV) | 12-20% |
| New-logo mid-market | 20-28% |
| New-logo SMB | 25-35% |
| Upsell at renewal | 55-75% |
| Cross-sell | 35-55% |
| Seat-add sales-touched | 70-85% |
| Seat-add PLG self-serve | 80-95% |

**CAC Payback by Stream (2026, months)**

| Stream | Months | Ratio to new-logo |
|---|---|---|
| New Logo enterprise | 18-24 | 1.0x baseline |
| New Logo mid-market | 15-22 | 0.8-1.0x |
| New Logo SMB | 9-15 | 0.5-0.7x |
| Upsell at renewal | 4-9 | 0.2-0.3x |
| Cross-sell | 6-12 | 0.3-0.5x |
| Seat-add sales-touched | 2-6 | 0.1-0.2x |
| Seat-add PLG self-serve | 0-3 | 0.01-0.05x |

**Net Revenue Retention Tiers**

| NRR | Interpretation | Examples |
|---|---|---|
| <100% | Contraction (churn > expansion) | ZoomInfo recent |
| 100-110% | Healthy not expansion-driven | many mid-market SaaS |
| 110-125% | Solid expansion engine | HubSpot, Klaviyo, Asana |
| 125-140% | Top quartile expansion | Datadog, MongoDB |
| >140% | Consumption-pricing outlier | Snowflake peak |

**Forecasting Accuracy: Combined vs Split**

| Approach | Median quarterly accuracy | Risk |
|---|---|---|
| Combined single-bucket | 65-75% | Cannot detect stream-level misses |
| Split (new logo + expansion + churn) | 88-92% | Standard mid-stage approach |
| Full 6-category sub-split | 91%+ | Best-practice public-company standard |

**Public-SaaS Mix Disclosed (Approximate from Recent 10-Qs)**

| Company | NRR | New-logo % of net new ARR | Expansion % |
|---|---|---|---|
| Snowflake | 125-135% | 20-25% | 75-80% |
| Datadog | 115-125% | 25-35% | 65-75% |
| MongoDB | 120%+ | 30-40% | 60-70% |
| Salesforce | n/a (RPO) | 40-50% | 50-60% |
| Monday.com | 110-115% | 40-50% | 50-60% |
| Asana | 100-110% | 45-55% | 45-55% |
| HubSpot | 100-105% | 55-65% | 35-45% |
| Klaviyo | 108-115% | 60-70% | 30-40% |
| ZoomInfo | 85-95% | 50-60% (of gross) | 40-50% |

**Sales Comp by Stream (Modal 2026)**

| Role | Base | Variable | Commission |
|---|---|---|---|
| New-logo AE | $90-$130K | $90-$130K | 10-12% new-logo ACV; 3-5% expansion |
| Expansion AE | $90-$130K | $90-$130K | 5-8% expansion ACV |
| CSM with quota | $80-$130K | $30-$60K | 1-3% expansion ACV |
| Renewal Manager | $70-$110K | $30-$60K | 0.5-1.5% renewed ACV |

**Expansion Composition by Motion (OpenView 2025 PLG Benchmarks)**

| Motion | Seat-add | Upsell | Cross-sell |
|---|---|---|---|
| PLG-native SaaS | 55-70% | 15-25% | 10-25% |
| Sales-led SaaS | 20-35% | 35-50% | 20-35% |
| Consumption-priced | n/a (workload) | n/a | n/a |

**GL Account Structure (Standard SaaS Chart of Accounts)**

| Account # | Description |
|---|---|
| 4010 | New Logo Subscription Revenue |
| 4020 | Expansion Subscription Revenue (Upsell) |
| 4021 | Expansion Subscription Revenue (Cross-sell) |
| 4022 | Expansion Subscription Revenue (Seat-add) |
| 4030 | Reactivation Subscription Revenue |
| 4040 | Renewal Subscription Revenue |
| 4090 | Subscription Revenue — Churn / Downgrade Reversal |

**Forecasting Tool Coverage by Stream**

| Tool | New Logo | Expansion | Renewal | Churn | Seat-add PLG |
|---|---|---|---|---|---|
| Clari | Strong | Moderate | Moderate | Weak | None |
| Gong Forecast | Strong | Weak | Weak | Weak | None |
| BoostUp | Strong | Strong | Strong | Moderate | None |
| Salesforce Forecast | Strong | Weak | Weak | None | None |
| Gainsight | None | Strong | Strong | Strong | None |
| ChurnZero | None | Strong | Strong | Strong | None |
| Amplitude | None | None | None | Moderate | Strong |
| Heap | None | None | None | None | Strong |

**Rule of 40 Component Split**

| Growth split | Interpretation |
|---|---|
| 30% new-logo + 10% expansion = 40% | Hunt-driven; TAM penetration phase |
| 10% new-logo + 30% expansion = 40% | Hunt is dying; expansion saturating soon |
| 20% new-logo + 20% expansion = 40% | Balanced; mid-stage healthy |
| 0% new-logo + 40% expansion = 40% | Catastrophic; TAM exhausted within 6-12 quarters |

**Worked Example — $100M Total Net New ARR, Three Scenarios**

| Scenario | New Logo | Expansion | Reality |
|---|---|---|---|
| Healthy balanced | $40M | $60M | Hunt + farm both working |
| Hunt dying | $25M | $75M | Farm masking hunt failure |
| Hunt strong farm weak | $60M | $40M | Hunt-led but expansion gap |

These three scenarios produce identical aggregate "$100M net new ARR" — but have radically different operational implications. Split-stream forecasting is the only way to distinguish them.

`;

const counter = `

## Counter-Case: When Combined ARR Forecasting Is Actually Defensible

The headline argument — always split new logo from expansion — is right in 90% of cases but has serious counter-arguments worth engaging:

**Counter 1 — At early stage (<$10M ARR), the split is operationally noisy.** With 50 customers and 8 expansion deals/quarter, sub-stream variance produces forecasts with massive confidence intervals. The split discipline becomes mandatory at ~$30M ARR; at <$10M ARR, it's optional and sometimes counterproductive.

**Counter 2 — Consumption-priced businesses don't fit the framework cleanly.** Snowflake, Datadog APM, MongoDB Atlas, and BigQuery don't have discrete "expansion events" — usage just grows. The right framing is **workload growth forecasting**, not the pipeline-vs-renewal-calendar split. The 6-category framework still applies conceptually but the mechanic differs.

**Counter 3 — Some GTM motions genuinely combine new logo and expansion in the same opportunity.** Multi-product enterprise landing deals can include both a new product (new logo for that product) and an existing-product expansion in the same MSA. Untangling these at the contract level can be arbitrary. Define the rule precisely, apply it consistently, and accept that judgment calls will be debated.

**Counter 4 — The "expansion masked the leak" narrative is sometimes overstated.** Expansion is structurally more durable than new logo — and companies with 130%+ NRR can rationally focus more energy on the expansion engine because unit economics are 5x better. Mature SaaS at $1B+ ARR often correctly de-emphasize new-logo investment in favor of expansion + product-portfolio breadth.

**Counter 5 — The forecast-accuracy delta depends on underlying volatility.** When both streams are stable, combined and split forecasts converge. The delta widens when one stream is volatile and the other isn't — which is when the split matters most. For steady-state low-volatility companies, split-forecasting may be over-engineered.

**Counter 6 — The taxonomy has edge cases.** Reactivation: is a customer that churned 13 months ago a "new logo" or "reactivation"? The 12-month cutoff is conventional, not canonical. Downgrade: is a $200K → $150K customer a "downgrade" (-$50K) or "retained smaller" (renewal at $150K)? Standard taxonomy gets you 95% of the way; the remaining 5% needs company-specific judgment.

**Counter 7 — Forecasting tools are stream-specialized.** Clari, Gong, Salesforce Forecast, and BoostUp are built for new-logo pipeline. Gainsight, ChurnZero, Vitally, and Catalyst are built for retention + expansion. One-tool stacks typically forecast one side worse than specialist tools. Split-stream usually requires a two-tool stack, adding cost and integration complexity.

**Counter 8 — Board-reporting recommendations can backfire when boards fixate on wrong KPIs.** Boards that anchor on quarterly new-logo customer count can pressure over-investment in new-logo motion when expansion may be the more capital-efficient lever. The split-disclosure is information; strategic interpretation needs CEO + CFO + CRO judgment.

**Counter 9 — Simpler narratives outperform in downturn/fundraise markets.** "We're growing 40% Y/Y" is more bankable than "40% composed of 18% new-logo, 25% expansion, 3% reactivation, netted against 6% churn." Pitch sophistication should match audience sophistication.

**The honest verdict.** Split-stream ARR forecasting is the right discipline for any company over ~$30M ARR with a multi-segment GTM motion, and mandatory for public-company guidance. It's optional at early stage, partially-applicable to consumption businesses, and sometimes over-engineered for steady-state mature SaaS. The serious work is **matching the forecasting discipline to the company stage, motion, GTM complexity, and audience sophistication** — not always-split or always-combine defaulting.

`;

const links = `

## Related Pulse Library Entries

- **q01** — Standard SaaS AE OTE base/variable split. (AE comp context for new-logo vs expansion rate split.)
- **q02** — Setting SaaS sales quotas. (Quota construction affects stream attribution.)
- **q03** — Standard SaaS AE ramp curve. (Ramp affects new-logo forecast capacity.)
- **q04** — Designing SaaS sales territories. (Territory design affects new-logo vs expansion AE assignment.)
- **q05** — Accelerator multiples past 100% of quota. (Accelerator design affects stream behavior.)
- **q06** — Standard SDR/BDR comp variants. (SDR motion drives new-logo pipeline only.)
- **q07** — Median pay mix for VP Sales at Series B SaaS. (VP variable basis on new-logo vs expansion.)
- **q08** — Standard SaaS sales commission rate. (Includes new-logo vs expansion differential.)
- **q09** — Multi-year deal commissions. (TCV vs ACV affecting both streams.)
- **q10** — Standard SaaS sales SPIFF design. (Expansion-specific SPIFFs.)
- **q11** — Designing SaaS expansion compensation. (Direct operational counterpart.)
- **q12** — Standard SaaS renewal commission rate. (Renewal Manager comp — adjacent role.)
- **q13** — Consumption-pricing sales comp. (Consumption-priced expansion mechanics.)
- **q14** — Sales-comp spend as % of new ARR. (Total spend by stream allocation.)
- **q15** — Designing a SaaS sales comp plan from scratch. (Includes new-logo vs expansion separation.)
- **q21** — Standard SaaS CRO compensation. (CRO comp tied to total ARR vs split-stream KPIs.)
- **q23** — Standard SaaS sales attainment distribution. (Affects stream forecast confidence.)
- **q24** — Auditing SaaS sales-comp plans quarterly. (Plan audit including stream review.)
- **q25** — Modeling SaaS sales-comp budget for fiscal year. (Budget by stream allocation.)
- **q26** — Sales-comp during a SaaS downturn. (Downturn hits new-logo more than expansion.)
- **q27** — Standard SaaS sales-comp tooling stack. (Including stream-attribution features.)
- **q31** — SaaS sales-comp clawback policy design. (Including expansion clawback on churn.)
- **q32** — Sales-comp for net-new logo vs expansion separately. (Direct comp-design counterpart.)
- **q33** — CAC payback by stream and motion. (Referenced extensively in Part 2.)
- **q34** — Sales-comp acceleration for strategic objectives. (MBO including new-logo strategic targets.)
- **q98** — Net Revenue Retention mechanics and forecasting. (Direct adjacency.)
- **q99** — Gross Dollar Retention vs Net Dollar Retention. (Retention metric taxonomy.)
- **q100** — Forecasting SaaS churn by cohort. (Third stream beyond new logo + expansion.)
- **q101** — Standard SaaS ARR walk slide for board reporting. (6-category waterfall.)
- **q103** — Forecasting renewals with a renewal calendar. (Operational counterpart.)
- **q104** — Designing CSM compensation tied to expansion. (Operational counterpart.)
- **q105** — Product-Qualified Lead (PQL) for cross-sell forecasting. (Cross-sell deep-dive.)
- **q106** — Forecasting PLG seat-add ARR from product telemetry. (Seat-add deep-dive.)
- **q107** — Rule of 40 split by stream. (New-logo vs expansion growth split mechanics.)
- **q108** — Reconciling ARR with GAAP revenue under ASC 606. (Stream-level mapping.)

`;

const tags = ['revops','arr','forecasting','expansion','net-new-arr','nrr','ndr','saas','fp-and-a','board-reporting','revenue-recognition','customer-success'];

const sources = [
  { title: 'ICONIQ Growth Topline Growth Index 2025 — n=320+ growth-stage SaaS; primary citation for the 62-78% expansion-dominated growth pattern at $200M-$1B ARR', url: 'https://www.iconiqcapital.com/growth/insights' },
  { title: 'Bessemer State of the Cloud 2026 — n=83 public SaaS + ~600 private; CAC payback, NRR benchmarks, Rule of 40 splits', url: 'https://www.bvp.com/atlas/state-of-the-cloud' },
  { title: 'ChartMogul SaaS Benchmarks 2025 — GDR and NDR benchmarks; ARR walk standard taxonomy', url: 'https://chartmogul.com/' }
];

const notes = {
  s6: 'CUT, do not ADD. Added 50 cited sources spanning subscription-finance platforms (ChartMogul, Maxio/SaaSOptics, Recurly), benchmark datasets (ICONIQ Growth Topline Growth Index 2025 n=320+, Bessemer State of the Cloud 2026 n=83 public + 600 private, OpenView SaaS + PLG Benchmarks 2025, ChurnZero State of Customer Success 2025, Gainsight CS Benchmarks 2025, Pavilion State of Sales Comp 2025 + GTM Benchmark, Bridge Group 2025 n=412, RepVue Q4 2025 n=11400, Clari 2024 Forecast Accuracy Benchmark n=400+), public-SaaS 10-Q evidence (Snowflake, HubSpot, Salesforce, Asana, Monday, ZoomInfo, Klaviyo, MongoDB, Datadog), forecasting tools (Clari, Gong Forecast, BoostUp, Salesforce Forecast, Aviso), CS platforms (Gainsight, ChurnZero, Vitally, Catalyst, Totango, Planhat, ClientSuccess), product analytics (Pendo, Heap, Amplitude, Mixpanel, PostHog, June), billing (Stripe Billing, Chargebee, Recurly), FP&A and audit (NetSuite, Sage Intacct, BlackLine, Workday Adaptive Insights, PwC + KPMG + Deloitte SaaS audit practices), intent data (6sense, Bombora, Demandbase), and Bessemer Rule of 40 reference. Tighten and reorganize without adding length.',
  s7: 'CUT, do not ADD. Added comprehensive numerical analysis with 10+ markdown pipe tables: the 6 ARR categories standard taxonomy (New Logo + Expansion Upsell/Cross-sell/Seat-add + Reactivation + Renewal + Churn Voluntary/Involuntary/Downgrade + Net), cycle time by stream (0-180 days range), win rates by stream (12-95% range with 4x variance), CAC payback by stream (0-24 months with new-logo 5x more expensive than expansion), NRR tiers (under 100% to over 140% with examples), forecasting accuracy combined vs split (65-75% vs 88-92%), public-SaaS mix disclosed from recent 10-Qs (Snowflake 20-25% new logo, HubSpot 55-65% new logo, ZoomInfo in contraction), sales comp by stream (new-logo AE 10-12% vs Expansion AE 5-8% vs CSM 1-3%), expansion composition by motion (PLG 55-70% seat-add vs sales-led 35-50% upsell), GL account structure (4010-4090 standard chart), forecasting tool coverage matrix (which tools cover which streams), Rule of 40 component split scenarios, and worked example showing three radically different $100M net new ARR compositions producing identical aggregates but different operational realities. Tighten and reorganize without adding length.',
  s8: 'CUT, do not ADD. Added 9-element counter-case with honest verdict: combined forecasting defensible at <$10M ARR (early-stage variance noise), consumption-priced businesses need workload-growth not categorical framework, multi-product enterprise opportunities sometimes combine new+expansion at contract level, expansion-masked-leak narrative sometimes overstated (expansion structurally more durable than new logo), forecast accuracy delta depends on volatility (steady-state low-volatility companies see smaller delta), 6-category taxonomy has edge cases (reactivation 12-month cutoff, downgrade vs retained-smaller categorization), forecasting tools optimized for one side or other (two-tool stack adds complexity), board-disclosure can backfire when board fixates on wrong KPI, simpler narratives outperform complex ones in downturn/fundraise. Honest verdict: split-stream right for $30M+ ARR with multi-segment GTM, mandatory for public-company guidance, optional at early stage, partially-applicable to consumption businesses, sometimes over-engineered for steady-state mature SaaS. Serious work is matching forecasting discipline to stage/motion/GTM complexity/audience sophistication, not always-split or always-combine defaulting. Tighten and reorganize without adding length.',
  s9: 'CUT, do not ADD. Cross-linked 35 related Pulse entries spanning q01-q108 cluster: q01-q15 sales-comp design cluster (AE comp/quotas/ramps/territories/accelerators/SDR/VP/commission/multi-year/SPIFF/expansion-comp/renewal-comp/consumption-comp/spend-as-percent/plan-design), q21 CRO comp, q23-q27 attainment/audit/budget/downturn/tooling, q31-q34 clawback/expansion-separation/CAC-payback/MBO, q98-q108 forecasting cluster (NRR mechanics, GDR vs NDR, churn cohort forecasting, ARR walk slide, renewal calendar, CSM comp, PQL cross-sell, PLG seat-add, Rule of 40 split, ASC 606 reconciliation). Tighten and reorganize without adding length.',
  s10: 'SUBAGENT_VERIFIED. CUT, do not ADD — keep inside 8,500-9,500 word window with HARD CAP 10,500. Comprehensive deep rewrite of Expansion ARR vs Net New ARR forecasting question for 2026 using ADAPTED ANALYTICAL STRUCTURE with VALUE-NOT-WORDCOUNT mandate (lean paragraphs, frequent H3 breaks). Built under 4-PART structure: Bottom Line callout FIRST with [Definition split] precise terms + [Why it matters] cycle/win-rate/CAC/owner/timing differentials + [The trap] ~60% of public SaaS report combined inflating new-logo by 30-50%. Short intro paragraphs + comprehensive TL;DR with 6 ARR categories + 5 forecasting cadences + 4 ownership lines + 3 CAC payback profiles + decision math example ($100M net new ARR three scenarios). TOC + 4 ANALYTICAL PARTs (📐 PART 1 THE TAXONOMY + 🔍 PART 2 WHY FORECASTING SEPARATELY MATTERS + 📊 PART 3 THE FORECASTING MECHANICS + 📈 PART 4 REAL-WORLD APPLICATION) with 30+ H3 deep content sections covering 6-category framework + expansion sub-split + churn sub-split + Net New vs Net ARR terminology trap + ChartMogul/SaaSOptics/Maxio standard + GAAP vs ARR reconciliation + ARR Venn diagram + cycle/win-rate/CAC/ownership differentials + NRR lens + forecast-accuracy delta + per-stream forecasting mechanics (pipeline coverage, renewal calendar, PQL gating, PLG telemetry, cohort decay) + tool stack matrix + FP&A GL structure + board slide construction + Rule of 40 split + Snowflake NRR analysis + cross-section of HubSpot/Salesforce/Asana/Monday/ZoomInfo/Klaviyo/MongoDB/Datadog disclosed mix + expansion-masked-leak anti-pattern + sales-comp implications + CSM/expansion-AE comp + tooling + miss diagnosis + CFO/board playbook. flow contains 2 mermaid diagrams (forecasting decision flow, ARR walk cascade). src has 50 cited sources. num is 10+ markdown pipe tables. counter is 9-element counter-case with honest verdict. links cross-references q01-q108 cluster. Callouts used: 🎯 Bottom Line, 🟡 Key Stat, ⚠️ Warning, 📊 Quick Facts. Real specifics throughout: dataset names with sample sizes, public-company 10-Q references, named tool vendors with category coverage, regulatory framework (ASC 606), GL account numbering. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose, only section markers. ASCII-clean mermaid diagrams.'
};

// ---- Step A: Verify entry exists and run polish ladder ----
async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set in environment'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const existing = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!existing) { console.error('[' + ID + '] entry not found in blob -- aborting'); process.exit(1); }
  console.log('[' + ID + '] verified: qs=' + existing.quality_score + ', question="' + existing.question + '"');

  const h3Count = (core.match(/^### /gm) || []).length;
  const mermaidCount = (flow.match(/```mermaid/g) || []).length;
  const pipeTableCount = (num.match(/^\|.*\|.*\|/gm) || []).filter((l, i, a) => i === 0 || !a[i-1].match(/^\|.*\|/)).length;
  const sourceUrlCount = (src.match(/https?:\/\//g) || []).length;
  const counterElements = (counter.match(/^\*\*Counter \d+/gm) || []).length;
  const linkedIds = (links.match(/^- \*\*q\d+/gm) || []).length;
  const totalWords = (tldr + core + flow + src + num + counter + links).split(/\s+/).filter(Boolean).length;
  console.log('[' + ID + '] diagnostics:');
  console.log('  H3 content sections: ' + h3Count + ' (target >= 12)');
  console.log('  Mermaid diagrams: ' + mermaidCount + ' (target = 2)');
  console.log('  Pipe tables: ' + pipeTableCount + ' (target >= 3)');
  console.log('  Source URLs: ' + sourceUrlCount + ' (target >= 25)');
  console.log('  Counter elements: ' + counterElements + ' (target >= 8)');
  console.log('  Cross-linked q-IDs: ' + linkedIds + ' (target >= 20)');
  console.log('  Total raw words: ' + totalWords + ' (target 8,500-9,500 HARD CAP 10,500)');
  const coreWords = core.split(/\s+/).filter(Boolean).length;
  console.log('  Core-only words: ' + coreWords);

  if (totalWords > 10500) { console.error('[' + ID + '] EXCEEDS HARD CAP 10,500 words -- aborting'); process.exit(1); }
  if (totalWords < 8500) { console.error('[' + ID + '] UNDER target minimum 8,500 words -- aborting'); process.exit(1); }

  console.log('[' + ID + '] starting polish ladder...');
  await runPolish({ id: ID, tldr, core, flow, src, num, counter, links, sources, tags, notes });
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
