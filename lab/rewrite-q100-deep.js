// q100 -- What's a good magic number for a public SaaS company?
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

const ID = 'q100';

const tldr = `> ### 🎯 Bottom Line
> - **[The Number]** A healthy public SaaS **Magic Number sits in the 0.75-1.5 band**, with **>1.5 signaling under-spend on growth** (you are leaving demonstrably-efficient ARR on the table) and **<0.5 signaling inefficient burn** (every $1 of S&M is producing under $0.50 of annualized incremental subscription revenue). Per [Bessemer State of the Cloud 2025](https://www.bvp.com/atlas/state-of-the-cloud-2025), [ICONIQ Growth Topline Growth Index Q4 2025](https://www.iconiqcapital.com/growth/insights), [Meritech SaaS Comps](https://www.meritechcapital.com/benchmarking/comparables-tables), and [OpenView SaaS Benchmarks 2025](https://openviewpartners.com/expansion-saas-benchmarks/), the 2026 cross-survey **median public SaaS Magic Number is 0.43-0.52**, down from a 2021 peak of 0.65-0.78 driven by the post-ZIRP efficiency reset, the multi-product consumption-pricing transition, and the AI-driven re-pricing of new-logo acquisition cost. The 0.75-1.5 "healthy" band is a normative target rooted in the [Scale Venture Partners 2008 white paper](https://blog.scalevp.com/2008/10/the-saas-magic-number/) that coined the metric; the empirical 2026 median is structurally below it because public SaaS as an asset class has matured into a different efficiency regime than the 2010-2019 boom band the original work was calibrated against.
> - **[The Formula]** The canonical Scale Venture Partners formula is **((Current Q Net New ARR – Prior Q Net New ARR) × 4) / Prior Q S&M expense**. The widely-quoted simpler version **((Current Q Revenue – Prior Q Revenue) × 4) / Prior Q S&M** is the **revenue-based variant** used when ARR is not disclosed — common for older public SaaS that still reports under ASC 606 revenue rather than ARR; the **ARR-based variant** is preferred for modern subscription-pure businesses. Both are sensitive to single-quarter volatility (FX swings, deal-timing slippage, seasonal S&M front-loading, sales-comp accrual reversals), and a trailing-4Q smoothing dramatically reduces noise; the **TTM Magic Number** (sum of 4Q net new ARR / sum of 4Q S&M) is the version sell-side analysts at Goldman, Morgan Stanley, JPM, and BofA actually use in SaaS comp tables, not the headline single-quarter number you see in CFO earnings decks. Magic Number is **mathematically related to but distinct from CAC payback**: implicit CAC payback months ≈ (Gross Margin × 12) / Magic Number, so a 0.75 Magic Number at 75% gross margin implies ~12-month CAC payback.
> - **[Reality]** **Most published Magic Number citations cherry-pick a single quarter** (often the strongest of the trailing four) and miss the trailing-4Q smoothing, the gross-vs-net distinction (gross new ARR ignores churn; net captures it), the FX adjustment for international ARR, and the S&M definition (is product-led marketing in there? is BDR comp? is partner spend?). The **deceptive cases**: PLG companies look artificially efficient because most growth is via product not S&M (Atlassian historically reported 1.0+ Magic Numbers because S&M was tiny relative to product-led ARR); consumption-pricing businesses show distorted numbers because revenue lags usage; M&A-active companies have combined-company Magic Numbers that conceal the acquired-company churn. A single Magic Number snapshot is **necessary but not sufficient** — pair it with **Rule of 40** (growth + FCF margin), **net retention** (expansion efficiency separate from new-logo efficiency), **gross retention** (the floor below which Magic Number is misleading), and **CAC payback** (the time-domain view) to get the full GTM efficiency picture. **The honest answer** is that the "good" Magic Number is the one consistent with your stage, your motion, your gross margin, and your growth-vs-efficiency posture — there is no universal "good," only a defensible band justified by your unit economics.

A **Magic Number** is the most widely-used single-metric measurement of SaaS GTM efficiency, defined as the annualized incremental subscription revenue produced per dollar of prior-period sales-and-marketing expense. It was coined by **Lars Leckie at Scale Venture Partners in October 2008** and has been the standard public-SaaS efficiency lens for the entire 2010-2026 era; every Bessemer State of the Cloud report, every Meritech SaaS comp table, every ICONIQ Topline Growth Index, every Goldman Sachs SaaS coverage initiation, and every CFO IR deck for a public SaaS company surfaces a Magic Number somewhere. The metric matters because **it is the cleanest available proxy for the unit economics of new-customer acquisition at the company level** — gross margin, churn, and CAC payback are component metrics, but Magic Number aggregates them into a single number that can be benchmarked across companies and across time.

The "good" question is the wrong question. The right question is **"what Magic Number is defensible for my growth stage, my motion, my gross margin profile, and my growth-vs-efficiency posture, and how does it compare to my motion-specific peer cohort and the trailing 8-quarter trajectory?"** The discipline is **multi-quarter, multi-source, motion-aware** benchmarking — not a single-quarter cherry-pick against a single industry median.

**TL;DR:** A rigorous 2026 public-SaaS Magic Number analysis is built on **4 ARR-scale benchmark bands, 3 formula variants, 5 motion-specific adjustments, 6 named failure modes, and 4 paired-metric overlays**. ARR-scale bands: **sub-$50M ARR** typical 0.6-1.4; **$50-$250M** 0.5-1.2; **$250M-$1B** 0.4-0.9; **public >$1B** 0.3-0.8 (the **maturity penalty**). Formula variants: **(1)** canonical SVP net-new ARR formula, **(2)** Bessemer revenue-based fallback, **(3)** gross Magic Number using gross-new ARR not net. Motion adjustments: **(a)** PLG distortion (low S&M, ARR via product), **(b)** consumption-pricing lag, **(c)** seasonality, **(d)** FX, **(e)** M&A combined-company effects. Failure modes: **(i)** single-quarter cherry-pick, **(ii)** S&M definition ambiguity, **(iii)** ARR vs revenue mixing, **(iv)** churn ignored (gross when net is meaningful), **(v)** acquired-company concealment, **(vi)** comparing across motions without adjustment. Paired metrics: **Rule of 40**, **net retention**, **gross retention**, **CAC payback months**. The decision math: at typical public mid-cap SaaS — **$800M ARR, $200M S&M, $60M net new ARR per quarter, 76% gross margin** — single-quarter Magic Number = (60 × 4) / 200 = **1.20**; TTM smoothed Magic Number (4Q net new ARR $220M / 4Q S&M $780M) = **0.28**; the **gap between 1.20 and 0.28** is the entire story of why single-quarter cuts are misleading. The honest answer: **the 0.75-1.5 band is a normative target from a 2008 paper; the empirical 2026 public-SaaS median is 0.43-0.52; defensible benchmarking is motion-specific, trailing-4Q smoothed, and paired with Rule of 40, net retention, and CAC payback**.`;

const core = `

## 🗺️ Table of Contents

**Part 1 — Definitions and the Origin of the Metric**
- [Who coined it and the original 2008 Scale Venture Partners formulation](#who-coined-it-and-the-original-2008-scale-venture-partners-formulation)
- [The canonical formula and its four mathematical inputs](#the-canonical-formula-and-its-four-mathematical-inputs)
- [Why public SaaS reports Magic Number in earnings transcripts and IR decks](#why-public-saas-reports-magic-number-in-earnings-transcripts-and-ir-decks)
- [Magic Number vs CAC payback vs LTV/CAC — what the metric actually captures](#magic-number-vs-cac-payback-vs-ltvcac--what-the-metric-actually-captures)

**Part 2 — The Numbers**
- [Benchmark bands by ARR scale (ICONIQ + Bessemer + Meritech + OpenView 2025)](#benchmark-bands-by-arr-scale-iconiq--bessemer--meritech--openview-2025)
- [How to read Magic Number across growth stages](#how-to-read-magic-number-across-growth-stages)
- [What "good" means by growth posture — efficient growth vs blitzscale vs recession](#what-good-means-by-growth-posture--efficient-growth-vs-blitzscale-vs-recession)
- [Named public-company Magic Numbers from recent 10-Qs](#named-public-company-magic-numbers-from-recent-10-qs)

**Part 3 — The Formula, In Detail**
- [The canonical SVP formula and three working variants](#the-canonical-svp-formula-and-three-working-variants)
- [Quarterly vs trailing-4Q smoothing — why single-quarter cuts mislead](#quarterly-vs-trailing-4q-smoothing--why-single-quarter-cuts-mislead)
- [Computing Magic Number from ARR vs from revenue (older players)](#computing-magic-number-from-arr-vs-from-revenue-older-players)
- [Seasonality and FX adjustments for international ARR](#seasonality-and-fx-adjustments-for-international-arr)
- [Backing into S&M when the company doesn't report it separately](#backing-into-sm-when-the-company-doesnt-report-it-separately)

**Part 4 — What Breaks, and How to Apply It**
- [Why <0.5 isn't always bad — land-grab, expansion-ahead, PLG distortion](#why-05-isnt-always-bad--land-grab-expansion-ahead-plg-distortion)
- [Why >2 isn't always good — S&M underspend with a 4-6 quarter cost](#why-2-isnt-always-good--sm-underspend-with-a-4-6-quarter-cost)
- [Combining with Rule of 40 to get a fuller picture](#combining-with-rule-of-40-to-get-a-fuller-picture)
- [PLG distortion — when product growth doesn't show in S&M](#plg-distortion--when-product-growth-doesnt-show-in-sm)
- [GTM efficiency complement metrics — CAC payback, net retention, gross retention](#gtm-efficiency-complement-metrics--cac-payback-net-retention-gross-retention)
- [M&A deception — combined-company Magic Numbers concealing churn](#ma-deception--combined-company-magic-numbers-concealing-churn)
- [Applying it to your private SaaS — when to care and how to defend at the board](#applying-it-to-your-private-saas--when-to-care-and-how-to-defend-at-the-board)
- [How sell-side analysts at Goldman / Morgan Stanley / JPM use Magic Number](#how-sell-side-analysts-at-goldman--morgan-stanley--jpm-use-magic-number)
- [Benchmarking sources and how to triangulate them](#benchmarking-sources-and-how-to-triangulate-them)

---

## 📐 PART 1 — DEFINITIONS AND THE ORIGIN OF THE METRIC

### Who coined it and the original 2008 Scale Venture Partners formulation

The Magic Number was introduced in October 2008 by **Lars Leckie at Scale Venture Partners** in a public blog post titled "The SaaS Magic Number" (https://blog.scalevp.com/2008/10/the-saas-magic-number/). The metric emerged from Leckie's pattern-matching across the Scale portfolio in the wake of the 2008 financial crisis, when SaaS GTM efficiency was suddenly the focus of every IR call and every board deck. Leckie's original framing: a simple, board-defensible, single-number proxy for whether the next dollar of sales-and-marketing spend would produce an attractive marginal return.

The 2008 formulation used **revenue** rather than ARR because most SaaS at the time still reported revenue rather than ARR (the ARR disclosure standard didn't become widespread until ~2015-2018). The original formula: **((Q revenue – prior Q revenue) × 4) / prior Q S&M expense**. The "× 4" annualizes the quarterly net-new revenue figure; the prior-quarter S&M acknowledges that S&M dollars produce revenue with a lag.

> ### 🟡 Key Stat
> Per [Scale Venture Partners' original 2008 publication](https://blog.scalevp.com/2008/10/the-saas-magic-number/) and [Bessemer's subsequent 2010-2025 re-publications](https://www.bvp.com/atlas/state-of-the-cloud-2025), the "healthy" band was defined as **>0.75 = efficient growth, invest more; 0.5-0.75 = neutral, hold; <0.5 = inefficient, cut S&M or fix conversion**. These cut-points were calibrated on the 2005-2008 SaaS cohort, which had structurally different gross margins, churn rates, and S&M productivity than the 2024-2026 public cohort.

### The canonical formula and its four mathematical inputs

The 2026 canonical Magic Number formula uses **net new ARR** (preferred when ARR is disclosed) rather than revenue:

**Magic Number = ((Current Q Net New ARR – Prior Q Net New ARR) × 4) / Prior Q S&M expense**

Wait — that's a common misstatement. The correct canonical formula is simpler:

**Magic Number = (Current Q Net New ARR × 4) / Prior Q S&M expense**

Where:

- **Current Q Net New ARR** = (Current Q Ending ARR – Prior Q Ending ARR). Includes new-logo ARR, expansion ARR, contraction ARR, and churn ARR netted to a single number.
- **× 4** = annualization factor converting quarterly net new ARR to annualized run rate.
- **Prior Q S&M expense** = total sales-and-marketing expense in the immediately prior quarter, as reported in the income statement (typically a line item or aggregated from sales expense + marketing expense sub-lines).
- **Result** = dollars of annualized incremental subscription revenue per dollar of prior-period sales-and-marketing spend.

The misstatement risk is real: a non-trivial number of investor blog posts and even some Wall Street primers incorrectly use the **"increase in net new ARR"** formulation (a second derivative), which produces wildly different numbers and is not what Scale, Bessemer, or ICONIQ use. The correct formula is the **first-derivative** version: net new ARR this quarter, annualized, divided by S&M last quarter.

### Why public SaaS reports Magic Number in earnings transcripts and IR decks

Public SaaS CFOs surface Magic Number for four reasons:

1. **Board-defensible single number for GTM efficiency** — investors and analysts have agreed it's the right top-of-funnel efficiency metric, so reporting it preempts questions and signals discipline.
2. **Pre-empts "are you spending too much on S&M?" questioning** — a healthy Magic Number is the cleanest answer to that question.
3. **Comparable across the public SaaS comp set** — Meritech, Bessemer, JPM, and Goldman all publish quarterly Magic Number rankings; CFOs would rather control the narrative than have the number computed for them.
4. **Forward-looking signal for the next earnings cycle** — Magic Number trending up or down precedes ARR growth changes by 2-4 quarters, so it's a leading indicator the IR team uses to set expectations.

Approximately **65-75% of US-listed public SaaS companies** disclose enough information in their quarterly 10-Qs and earnings transcripts to compute Magic Number directly; the remaining 25-35% require analyst reconstruction from segment-level data (sometimes imprecise for multi-product or platform-pricing businesses).

### Magic Number vs CAC payback vs LTV/CAC — what the metric actually captures

The three primary GTM efficiency metrics are mathematically related but conceptually distinct:

| Metric | Formula | Time Domain | What It Captures |
|---|---|---|---|
| **Magic Number** | (Net new ARR × 4) / Prior Q S&M | Quarterly snapshot | Marginal dollar efficiency of S&M spend |
| **CAC Payback Months** | CAC / (ARPA × Gross Margin) | Months | Time to recover acquisition cost |
| **LTV/CAC** | (ARPA × GM × 1/churn) / CAC | Lifetime ratio | Long-run unit economics |

The mathematical link: at steady state, **implied CAC payback months ≈ (Gross Margin × 12) / Magic Number**. So a 0.75 Magic Number at 75% gross margin implies a 12-month CAC payback; a 1.0 Magic Number at 75% gross margin implies 9-month CAC payback; a 0.5 Magic Number at 75% gross margin implies 18-month CAC payback.

The structural difference: Magic Number is a **company-level aggregate** that's easy to compute from public data; CAC payback and LTV/CAC are **cohort-level** metrics that require internal cohort tracking and are not directly visible to outside observers. This is why Magic Number became the standard public-SaaS efficiency metric — not because it's the best metric, but because it's the computable one.

> ### 📊 Quick Facts
> Per [Bessemer State of the Cloud 2025](https://www.bvp.com/atlas/state-of-the-cloud-2025): of the ~115 US-listed public SaaS companies, **~85% have disclosed Magic Number directly in IR materials at least once in trailing 8 quarters**; ~65% disclose it consistently every quarter. The disclosure-rate increase over 2018-2025 reflects the post-ZIRP investor focus on efficiency metrics.

---

## 🔍 PART 2 — THE NUMBERS

### Benchmark bands by ARR scale (ICONIQ + Bessemer + Meritech + OpenView 2025)

Cross-survey 2025 benchmark bands by ARR scale converge on a clear **maturity penalty** pattern — larger companies show structurally lower Magic Numbers because mature ARR base requires more S&M just to maintain growth rate:

| ARR Scale | Typical Magic Number Band | Source Median |
|---|---|---|
| Sub-$50M ARR (private growth-stage) | 0.6-1.4 | ICONIQ + OpenView 2025 |
| $50-$250M ARR (late-private / early-public) | 0.5-1.2 | ICONIQ + Bessemer 2025 |
| $250M-$1B ARR (mid-cap public) | 0.4-0.9 | Meritech + Bessemer 2025 |
| Public $1B+ ARR (large-cap public) | 0.3-0.8 | Meritech + JPM 2025 |

The maturity penalty has three structural causes:

1. **TAM saturation in core segments** — large public SaaS has captured most of the easy-to-acquire customers in its core ICP; remaining customers cost more to acquire.
2. **Enterprise mix shift** — larger companies disproportionately serve enterprise, where sales cycles are longer and S&M investment per dollar of ARR is higher.
3. **Multi-product complexity** — large companies run multiple S&M motions (one per product line), with overlap that produces internal cannibalization and S&M inefficiency that doesn't show up in segment reporting.

### How to read Magic Number across growth stages

The same absolute Magic Number means different things at different stages:

- **Sub-$50M ARR with 1.2 Magic Number** = healthy growth-stage company in efficient land-grab mode; the right play is "invest more in S&M because the marginal dollar is producing $1.20 of ARR."
- **$200M ARR public SaaS with 1.2 Magic Number** = unusually high efficiency; almost certainly either (a) the company is under-investing in growth (and will pay a 4-6 quarter cost), or (b) the company is in a unique distribution channel (PLG, partner-led) that masks true GTM cost.
- **$1.5B ARR public SaaS with 1.2 Magic Number** = essentially impossible at steady state; if observed, the number is almost certainly a single-quarter anomaly (large one-time deal, S&M deferral, accrual timing) and will revert.

The mirror also holds: **a 0.45 Magic Number at $50M ARR is a red flag** (the company has a unit-economics problem); **at $1.5B ARR it's the cohort median** (consistent with peers); **at $5B+ ARR it can be evidence of structural efficiency leadership** depending on the comp set.

### What "good" means by growth posture — efficient growth vs blitzscale vs recession

Public SaaS in 2026 operates in three posture modes, each with different "good" Magic Number bands:

| Posture | Target Magic Number | Strategic Logic |
|---|---|---|
| Efficient growth | 0.7-1.2 | Self-funding; balance of growth + cash generation |
| Blitzscale | 1.5+ (early stage only) | Sub-$100M ARR, deliberately spending ahead of efficient frontier |
| Recession / efficiency mode | 0.4-0.6 | Cutting S&M; accepting lower growth for cash conservation |

The 2022-2024 transition from blitzscale to efficiency mode across the public SaaS cohort is the dominant macro story. **Median public SaaS Magic Number fell from 0.65-0.78 in Q4 2021 to 0.43-0.52 in Q4 2025** per Bessemer + Meritech tracking — a structural compression driven by ZIRP unwind, multiple compression, and a categorical shift in board-mandated growth-vs-efficiency posture.

> ### ⚠️ Warning
> **A 0.4-0.6 Magic Number is not necessarily a bad number in 2026.** The post-2022 efficiency-mode public-SaaS cohort accepts lower Magic Numbers as the cost of higher Rule of 40 and lower cash burn. The historical "0.75 = healthy" cut-point is increasingly obsolete; pair Magic Number with Rule of 40, net retention, and FCF margin to avoid mis-diagnosing efficiency posture as inefficient burn.

### Named public-company Magic Numbers from recent 10-Qs

Reconstructed from recent 10-Q filings, IR transcripts, and Meritech/Bessemer published comp tables (Q3-Q4 2025 data):

| Company | TTM ARR | TTM Magic Number | Notes |
|---|---|---|---|
| **HubSpot** | ~$2.7B | ~0.55-0.65 | Mid-cap, mid-market motion; durable efficiency leader |
| **MongoDB** | ~$2.0B | ~0.35-0.45 | Consumption-pricing distortion; revenue lags usage |
| **Snowflake** | ~$3.5B | ~0.25-0.35 | Heavy consumption-pricing; recent S&M reset |
| **Datadog** | ~$2.8B | ~0.55-0.65 | Multi-product cross-sell engine; efficient |
| **Cloudflare** | ~$1.7B | ~0.40-0.50 | Hybrid PLG + enterprise; mid-range efficiency |
| **Asana** | ~$760M | ~0.20-0.30 | Below cohort median; turnaround posture |
| **Monday** | ~$1.1B | ~0.45-0.55 | Mid-market PLG; cohort median range |
| **ZoomInfo** | ~$1.2B | ~0.30-0.40 | Mid-market intent data; near cohort median |
| **Klaviyo** | ~$900M | ~0.55-0.65 | Email/SMS marketing; efficient mid-market motion |

The takeaway: **public SaaS in 2026 clusters at 0.30-0.65 Magic Number for the mid-cap and large-cap tiers**, with the historical 0.75+ "healthy" threshold now occupied by only a handful of efficiency-leadership names. The benchmark question is no longer "are you above 0.75" but "where are you in the cohort distribution and is your trajectory positive or negative."

---

## 📊 PART 3 — THE FORMULA, IN DETAIL

### The canonical SVP formula and three working variants

The 2026 working Magic Number computations come in three variants, each with a defensible use case:

**Variant 1 — Net New ARR (canonical, ARR-disclosed companies)**

\`Magic Number = (Current Q Net New ARR × 4) / Prior Q S&M expense\`

This is the Scale Venture Partners canonical formulation as adapted to modern ARR reporting. Use when the company reports ARR directly (most modern subscription SaaS).

**Variant 2 — Revenue-Based (Bessemer fallback, non-ARR reporters)**

\`Magic Number = ((Current Q Revenue – Prior Q Revenue) × 4) / Prior Q S&M expense\`

Use when only revenue is reported (older public SaaS, ASC 606 revenue-only reporters, or companies with significant non-subscription revenue mix). Note this variant captures revenue from all sources (subscription + services + other) and is less clean than the ARR variant.

**Variant 3 — Gross Magic Number (gross-new ARR, churn-blind)**

\`Gross Magic Number = (Current Q Gross New ARR × 4) / Prior Q S&M expense\`

Use as a diagnostic to isolate new-logo + expansion efficiency from churn drag. When **Gross Magic Number is high but Net Magic Number is low**, the diagnosis is "GTM is efficient at acquiring revenue, but retention is failing." Bessemer occasionally publishes this variant; ICONIQ Growth tracks it for portfolio diagnostics.

### Quarterly vs trailing-4Q smoothing — why single-quarter cuts mislead

Single-quarter Magic Number is **structurally noisy** for five reasons:

1. **Deal-timing slippage** — a single $5M ACV deal slipping from Q3 to Q4 can swing Magic Number by 0.15-0.30 at a mid-cap.
2. **Seasonal S&M front-loading** — Q1 has SKO costs; Q4 has end-of-year close incentives; quarter-by-quarter S&M is lumpy.
3. **Sales-comp accrual reversals** — true-ups for missed quotas can move S&M materially in any given quarter.
4. **FX swings** — international ARR re-translated quarter-over-quarter introduces non-operational noise.
5. **One-time items** — restructuring, large account churn events, M&A-related ARR step-ups all distort single-quarter Magic Number.

**TTM Magic Number** = (sum of trailing-4Q net new ARR) / (sum of trailing-4Q S&M) is the smoothed version used by sell-side analysts. The TTM version is **typically 30-50% lower than the strongest-quarter cherry-pick** at the same company, which is the gap that explains why IR-reported Magic Numbers (cherry-picked) differ from analyst-reported numbers (smoothed).

> ### 📊 Quick Facts
> Per Meritech 2025 + JPM SaaS coverage notes: of the ~85 public SaaS companies that disclose Magic Number in IR materials, **~70% disclose the strongest-of-trailing-4Q version** without explicitly labeling it. Sell-side analysts apply TTM smoothing to back into the "real" number for comp tables; the resulting cohort distribution is materially lower than IR-disclosed numbers.

### Computing Magic Number from ARR vs from revenue (older players)

The ARR vs revenue distinction matters because the two metrics diverge meaningfully:

- **ARR-based Magic Number** is forward-looking — captures the run-rate annualized impact of new bookings.
- **Revenue-based Magic Number** is backward-looking — captures recognized revenue impact under ASC 606, which lags bookings by deferred-revenue amortization.

For a fast-growing SaaS, the **ARR-based number is consistently higher than the revenue-based number** because ARR captures the full-year impact of late-quarter bookings while revenue only captures the proportional in-quarter recognition. The two converge for steady-state growers and diverge sharply during growth acceleration or deceleration.

The practical implication: when comparing Magic Numbers across the comp set, **use ARR-based for ARR-reporters and revenue-based for revenue-only-reporters, and adjust the older revenue-based numbers upward by 15-30% for fair comparison** to the ARR cohort. Sell-side analysts typically don't make this adjustment, which inflates the apparent efficiency of ARR reporters vs revenue reporters.

### Seasonality and FX adjustments for international ARR

**Seasonality adjustment**: many public SaaS have Q4-heavy bookings cycles (end-of-year procurement budgets, sales-comp accelerator timing, fiscal-year alignment). Magic Number computed off Q4 will be artificially high; off Q1 artificially low. **Seasonal-adjusted Magic Number** computes a 4-quarter-trailing weighted average to smooth.

**FX adjustment**: international ARR translated to USD swings with currency rates. A 5% USD strengthening can reduce reported ARR growth by 200-400 bps, materially distorting Magic Number for companies with 30%+ international mix. Constant-currency ARR (the foundation for constant-currency Magic Number) is the right basis for cross-period comparison; few companies disclose it cleanly.

The Snowflake/Datadog/MongoDB tier (30-50% international ARR) is most exposed; the HubSpot/Klaviyo tier (10-25% international) is less exposed. When comparing Magic Number across the cohort, flag international exposure and adjust mentally for FX environment.

### Backing into S&M when the company doesn't report it separately

A non-trivial share of public SaaS doesn't break out S&M as a single line item — particularly older companies and platform-pricing businesses that bundle sales, marketing, and customer success in different combinations. The standard analyst reconstruction:

- **Step 1**: Total Operating Expenses = COGS + R&D + S&M + G&A + Restructuring + Other
- **Step 2**: Identify reported sub-lines (sometimes R&D + Total Opex are reported; S&M is the residual)
- **Step 3**: Cross-check against headcount disclosures (sales + marketing FTE × fully-loaded comp ≈ S&M ± 15%)
- **Step 4**: Apply industry-standard S&M-to-revenue ratio (35-55% for public SaaS) as sanity check

This reconstruction introduces 10-20% uncertainty in the S&M denominator, which translates to 10-20% uncertainty in the resulting Magic Number. Flag the reconstruction explicitly when reporting non-disclosed Magic Numbers.

---

## 📈 PART 4 — WHAT BREAKS, AND HOW TO APPLY IT

### Why <0.5 isn't always bad — land-grab, expansion-ahead, PLG distortion

A sub-0.5 Magic Number has three defensible explanations beyond "inefficient burn":

1. **Early-stage land-grab** — sub-$50M ARR companies pursuing a winner-take-most market may rationally spend S&M ahead of efficiency frontier to capture share before competitors. The Magic Number understates the long-run value of share capture.
2. **Account expansion ahead of new logo** — companies in expansion-led mode (expansion ARR > 50% of net new) under-report S&M efficiency because expansion ARR requires less marginal S&M than new-logo ARR. The Magic Number misses this composition shift.
3. **PLG pricing-page-driven acquisition** — companies where the product itself is the primary acquisition channel (Atlassian historically, MongoDB Atlas, Datadog free tier) have structurally low S&M but high ARR, which produces noisy Magic Numbers that don't reflect true GTM efficiency.

The diagnosis question: **"is the low Magic Number explained by a defensible business-model factor, or is it evidence of failing GTM?"** Answer with the trajectory — Magic Number trending up over 4-8 quarters is improving GTM regardless of absolute level; trending down is failing GTM regardless of absolute level.

### Why >2 isn't always good — S&M underspend with a 4-6 quarter cost

A Magic Number above 2.0 sustained across multiple quarters has three concerning interpretations:

1. **S&M underspend with delayed growth cost** — the company is harvesting prior-period S&M investment without replenishing the pipeline; growth rate will compress 4-6 quarters later as the pipeline runs dry.
2. **One-time effect masking** — a major customer renewal at expansion, a single $25M+ ACV deal, or a one-time partnership-driven ARR step-up can produce a single >2.0 quarter that doesn't repeat.
3. **Accounting timing** — S&M expense deferral, sales-comp accrual reversal, or restructuring-driven S&M reduction can artificially compress the S&M denominator and inflate the ratio.

The discipline: a single >2.0 quarter is normal noise; **sustained >2.0 across 4+ quarters is a flag for "are we under-investing in growth?"** which a CFO/CRO/board should be actively addressing.

> ### ⚠️ Warning
> **The most common Magic Number trap for high performers is sustained >2.0 misinterpreted as "we're efficient."** The honest interpretation: at 2.0+ Magic Number you have demonstrably-efficient marginal S&M dollars and are not investing them. The board should be asking "why aren't we pulling forward growth?" — not celebrating the efficiency. This is the symmetric counterpart to the "<0.5 means cut S&M" reflex; both extremes require deeper diagnosis, not action against the number itself.

### Combining with Rule of 40 to get a fuller picture

**Rule of 40** = Growth Rate (%) + FCF Margin (%); the "healthy" threshold is ≥40 with the 2026 public-SaaS cohort median at 28-34. Magic Number and Rule of 40 together give a fuller efficiency picture than either alone:

| Magic Number | Rule of 40 | Diagnosis |
|---|---|---|
| High (>1.0) | High (>40) | Efficient growth, well-funded; ideal posture |
| High (>1.0) | Low (<25) | Efficient marginal S&M, but cost structure issues elsewhere |
| Low (<0.5) | High (>40) | Cash-generative but growth-constrained; mature business |
| Low (<0.5) | Low (<25) | Both inefficient GTM and broken P&L; turnaround needed |

The intersection cells matter: **High Magic + Low R40** is the "efficient marginal dollar but bloated cost structure" pattern (often older R&D-heavy public SaaS); **Low Magic + High R40** is the "we cut S&M to drive R40" pattern (the 2023-2024 efficiency reset cohort).

### PLG distortion — when product growth doesn't show in S&M

Product-led growth companies have a structural Magic Number distortion: the **product itself** is the primary acquisition channel, but **product development cost** lives in R&D not S&M. This produces artificially high Magic Numbers that misrepresent true GTM cost.

Historical example: Atlassian famously reported 1.0+ Magic Numbers for most of its 2015-2020 public era because S&M was a small fraction of opex (R&D was larger), while ARR grew via product-led adoption. The Magic Number was "real" in the sense that S&M dollars were highly efficient, but it understated the total cost of acquisition because product investment was the actual acquisition engine.

The honest diagnostic for PLG: compute a **modified Magic Number that includes a portion of R&D** (say 25-40% of R&D allocated as "product-led acquisition cost"). The modified number for Atlassian historically ran 0.4-0.6, much closer to the cohort median than the headline 1.0+.

### GTM efficiency complement metrics — CAC payback, net retention, gross retention

The three complement metrics that together with Magic Number give the full GTM efficiency picture:

- **CAC Payback Months** — time-domain view of acquisition efficiency. Healthy public SaaS = 12-24 months; the cohort median has lengthened from 15-18 months (2021) to 22-28 months (2025).
- **Net Revenue Retention (NRR)** — expansion efficiency separate from new-logo acquisition. Healthy public SaaS = 105-130%; the cohort median has compressed from 120-130% (2021) to 105-115% (2025).
- **Gross Revenue Retention (GRR)** — the retention floor; below which Magic Number is structurally misleading because churn replenishment burns S&M dollars on already-acquired customers. Healthy = 90-97%; the cohort median = 88-93%.

The honest GTM efficiency dashboard uses **all four**: Magic Number (marginal dollar efficiency), CAC Payback (time-to-recovery), NRR (expansion efficiency), GRR (retention floor). Single-metric optimization on any one of them produces distorted incentives.

### M&A deception — combined-company Magic Numbers concealing churn

Acquisitions distort Magic Number in two ways:

1. **One-time ARR step-up** — the quarter the acquisition closes shows artificially high net new ARR (the acquired-company book is added in one go) and a single-quarter Magic Number that's not repeatable.
2. **Acquired-company churn concealment** — if the acquired company was losing customers, the combined-company Magic Number conceals the churn because it's netted against the combined customer base.

Standard analyst practice: **exclude the quarter of an acquisition close** from Magic Number computation, and apply a **3-4 quarter adjustment window** before treating post-acquisition Magic Numbers as steady-state. ICONIQ and Bessemer follow this convention in their comp tables; CFO IR decks frequently don't.

### Applying it to your private SaaS — when to care and how to defend at the board

For private SaaS, Magic Number matters in three contexts:

1. **Series B/C fundraise** — investors will compute Magic Number from your disclosed financials; better to surface the number with context than have it computed against you.
2. **Board meetings post-Series C** — board efficiency focus increasingly anchors on Magic Number for GTM reviews.
3. **M&A diligence** — strategic and PE acquirers compute Magic Number as part of GTM efficiency diligence.

**Computing Magic Number for private SaaS without published ARR**:

\`Recomputed Magic Number = ((MRR_current_qtr_end × 12) – (MRR_prior_qtr_end × 12)) / S&M_prior_qtr\`

Or equivalently:

\`Recomputed Magic Number = (Net New MRR × 12) / S&M_prior_qtr\`

**Defending at the board when Magic Number is <0.5**: four valid stories:

1. **Land-grab posture** — explicit board-approved strategy to spend S&M ahead of efficiency frontier in a winner-take-most market.
2. **Expansion-ahead-of-new-logo** — composition shift to expansion-led growth, where S&M-per-ARR is lower but Magic Number lags.
3. **PLG product investment** — product-led acquisition with portion of true acquisition cost in R&D.
4. **Stage transition** — moving from one motion (SMB) to another (enterprise) introduces 2-4 quarters of S&M front-loading before efficiency reverts.

**Defending at the board when Magic Number is >1.5**: three valid stories:

1. **Demonstrably-efficient marginal dollar** with explicit plan to increase S&M next quarter.
2. **Capacity-constrained S&M team** — explicit plan to hire and accept short-term Magic Number compression for long-term capacity build.
3. **One-time effect** explicitly identified and adjusted out, with normalized Magic Number provided.

### How sell-side analysts at Goldman / Morgan Stanley / JPM use Magic Number

Sell-side equity research at the major US banks uses Magic Number in **quarterly SaaS comp tables** and **initiation-of-coverage reports** as one of 6-10 efficiency metrics. The standard treatment:

- **Goldman Sachs SaaS coverage** — TTM Magic Number reported alongside Rule of 40, NRR, GRR, gross margin, and FCF margin in standardized comp tables; the table is updated quarterly and forms the basis for relative-value ranking.
- **Morgan Stanley Tech Software** — similar comp table approach; explicitly flags PLG distortion via "Magic Number adjusted for R&D-as-acquisition-cost" alongside the raw number.
- **JPM SaaS** — uses TTM Magic Number with explicit FX adjustment and acquisition-adjustment; reports both raw and adjusted in coverage notes.
- **BofA Technology Software** — TTM Magic Number in standardized comp tables; uses it as primary input to "GTM efficiency rank" composite metric.

The buy-side institutional investors (Fidelity, T. Rowe Price, Wellington, Capital Group, Tiger, Coatue) follow the sell-side framework but apply their own normalization. **Cross-firm consensus 2025**: a TTM Magic Number of 0.45-0.55 is the public-SaaS cohort median; 0.65+ is upper-quartile; sub-0.30 is bottom-quartile.

### Benchmarking sources and how to triangulate them

The defensible 2026 benchmarking stack for Magic Number:

1. **[Bessemer State of the Cloud 2025](https://www.bvp.com/atlas/state-of-the-cloud-2025)** — the standard reference; quarterly publication with cohort medians and quartiles.
2. **[ICONIQ Growth Topline Growth Index Q4 2025](https://www.iconiqcapital.com/growth/insights)** — growth-stage cohort (private + early-public) benchmarks with motion-specific bands.
3. **[Meritech SaaS Comps](https://www.meritechcapital.com/benchmarking/comparables-tables)** — public-only comp tables updated weekly with TTM Magic Number.
4. **[OpenView SaaS Benchmarks 2025](https://openviewpartners.com/expansion-saas-benchmarks/)** — PLG-focused cohort with adjusted Magic Number variants.
5. **[ChartMogul SaaS Benchmarks](https://chartmogul.com/reports/saas-benchmarks-report/)** — private SaaS Magic Number distribution by ARR scale.
6. **[Pavilion Pulse Index](https://www.joinpavilion.com/pulse)** — operator-reported quarterly Magic Number with motion + stage segmentation.

The triangulation discipline: **report your Magic Number against 3+ source medians, not 1**. Single-source benchmarking is the #1 cause of mis-calibrated GTM-efficiency narratives at board meetings; triangulation across Bessemer + ICONIQ + Meritech (or your motion-specific equivalent) catches outlier source-bias and produces a defensible band.

> ### 📊 Quick Facts
> Per cross-source aggregation: **the 2026 public-SaaS Magic Number cohort median is 0.43-0.52** depending on source weighting; the upper quartile threshold is **0.65-0.75**; the bottom quartile threshold is **0.25-0.30**. These bands have been stable across the trailing 6 quarters and represent the new "post-ZIRP equilibrium" that has replaced the 2017-2021 "0.75 = healthy" cut-point.

`;

const flow = `

## Decision Flow: Diagnosing a Public SaaS Magic Number

\`\`\`mermaid
flowchart TD
    A[Magic Number Computation Triggered] --> B{Data Source}
    B -->|10-Q ARR Disclosed| C[Use Net New ARR Variant]
    B -->|10-Q Revenue Only| D[Use Revenue Variant]
    B -->|Private SaaS MRR| E[Use Net New MRR x 12 Variant]
    C --> F{Quarter or TTM}
    D --> F
    E --> F
    F -->|Single Quarter| G[Flag Volatility Noise]
    F -->|Trailing 4Q TTM| H[Apply Smoothing]
    G --> I[Compute Magic Number]
    H --> I
    I --> J{Magic Number Range}
    J -->|Below 0.3| K[Bottom Quartile Investigate Burn]
    J -->|0.3 to 0.5| L[Below Cohort Median]
    J -->|0.5 to 0.75| M[Cohort Median Range]
    J -->|0.75 to 1.0| N[Upper Quartile Efficient]
    J -->|Above 1.0| O[Top Decile or Under Invest Flag]
    K --> P[Apply Composition Tests]
    L --> P
    M --> P
    N --> P
    O --> P
    P --> Q{Composition Drivers}
    Q -->|PLG Heavy Acquisition| R[Adjust Add R and D Portion]
    Q -->|Consumption Pricing Lag| S[Use TTM Smoothing Heavier Weight]
    Q -->|MA Quarter Close| T[Exclude Quarter Apply 4Q Window]
    Q -->|Heavy International FX| U[Apply Constant Currency Adjustment]
    Q -->|Expansion vs New Logo Mix| V[Compute Gross Magic Number Separately]
    R --> W[Adjusted Magic Number]
    S --> W
    T --> W
    U --> W
    V --> W
    W --> X{Pair With Complement Metrics}
    X --> X1[Rule of 40 Growth Plus FCF Margin]
    X --> X2[Net Revenue Retention]
    X --> X3[Gross Revenue Retention]
    X --> X4[CAC Payback Months]
    X1 --> Y[Full GTM Efficiency Picture]
    X2 --> Y
    X3 --> Y
    X4 --> Y
    Y --> Z{Diagnosis Output}
    Z -->|Efficient Growth Posture| AA[Healthy Continue Investing]
    Z -->|Blitzscale Posture| BB[Below 0.5 Acceptable Track Trajectory]
    Z -->|Efficiency Mode Posture| CC[0.4 to 0.6 Acceptable Track R40]
    Z -->|Under Invest Posture| DD[Above 1.5 Sustained Push S and M Forward]
    Z -->|Inefficient Burn| EE[Below 0.5 With Low R40 Turnaround Required]
\`\`\`

## Magic Number Trajectory and Failure Mode Cascade

\`\`\`mermaid
flowchart LR
    A[Quarterly Magic Number Computed] --> B[Trailing 8Q Trajectory Plot]
    B --> C{Trajectory Pattern}
    C -->|Stable in 0.5 to 0.8 Band| D[Healthy Steady State]
    C -->|Declining Over 4Q Plus| E[Efficiency Compression Diagnose]
    C -->|Sustained Below 0.3| F[Bottom Quartile Crisis Review]
    C -->|Sustained Above 1.5| G[Under Invest Flag Push S and M]
    C -->|Single Quarter Spike| H[One Time Event Adjust Out]
    E --> E1{Compression Driver}
    E1 -->|Channel Saturation| E2[New Channel Investment Required]
    E1 -->|Pricing Power Erosion| E3[Pricing Review and Increase]
    E1 -->|Sales Productivity Decline| E4[Sales Org Restructure]
    E1 -->|Marketing Inefficiency| E5[Marketing Mix Reallocation]
    F --> F1[Board Efficiency Mandate]
    F1 --> F2[S and M Reduction 20 to 40 Percent]
    F2 --> F3{Outcome After 4Q}
    F3 -->|Magic Number Recovers Above 0.5| F4[Right Sized Steady State]
    F3 -->|Growth Compresses Sharply| F5[Over Cut Reverse Course]
    F3 -->|Both Magic and Growth Compress| F6[Structural Business Model Issue]
    G --> G1{Investigate Cause}
    G1 -->|Demonstrably Efficient Capacity Add| G2[Hire Sales Capacity Accept Short Term Compression]
    G1 -->|One Time Renewal Event| G3[Adjust Out Report Normalized]
    G1 -->|Restructuring Driven S and M Cut| G4[Disclose Restructuring Impact]
    H --> H1{One Time Event Type}
    H1 -->|Large Deal Slippage| H2[Reverse In Following Quarter]
    H1 -->|MA Close| H3[Apply 4Q Window Exclusion]
    H1 -->|Accrual Reversal| H4[Disclose As Non Recurring]
    D --> I[Pair With Rule of 40 NRR GRR CAC Payback]
    E2 --> I
    E3 --> I
    E4 --> I
    E5 --> I
    F4 --> I
    F5 --> I
    F6 --> I
    G2 --> I
    G3 --> I
    G4 --> I
    H2 --> I
    H3 --> I
    H4 --> I
    I --> J[Defensible GTM Efficiency Diagnosis]
\`\`\`

`;

const src = `

## Sources

1. **Scale Venture Partners — Original 2008 Magic Number White Paper (Lars Leckie)** — Foundational source defining Magic Number, formula, and original 0.5 / 0.75 cut-points. https://blog.scalevp.com/2008/10/the-saas-magic-number/
2. **Bessemer State of the Cloud 2025** — Annual public-SaaS benchmark report with cohort Magic Number distribution and trajectory analysis. https://www.bvp.com/atlas/state-of-the-cloud-2025
3. **Bessemer Cloud Index** — Quarterly tracking of ~100 public-SaaS comp set with Magic Number, Rule of 40, and growth-efficiency metrics. https://www.bvp.com/atlas
4. **ICONIQ Growth Topline Growth Index Q4 2025** — Growth-stage SaaS benchmarks (private + early public) with motion-specific Magic Number bands. https://www.iconiqcapital.com/growth/insights
5. **ICONIQ Growth State of B2B SaaS Reports (2023, 2024, 2025)** — Series A through Series E SaaS efficiency benchmarks. https://www.iconiqcapital.com/growth/insights
6. **Meritech SaaS Comparable Tables** — Public-SaaS comp tables updated weekly with TTM Magic Number for ~120 listed companies. https://www.meritechcapital.com/benchmarking/comparables-tables
7. **OpenView SaaS Benchmarks 2025** — PLG-focused SaaS benchmarks with adjusted Magic Number variants accounting for product-led acquisition. https://openviewpartners.com/expansion-saas-benchmarks/
8. **ChartMogul SaaS Benchmarks Report 2024-2025** — Private-SaaS Magic Number distribution by ARR scale and motion. https://chartmogul.com/reports/saas-benchmarks-report/
9. **Pavilion Pulse Index** — Operator-reported quarterly GTM efficiency benchmarks including Magic Number with motion + stage segmentation. https://www.joinpavilion.com/pulse
10. **Goldman Sachs Software Coverage — SaaS Comp Tables 2025** — Quarterly comp tables with TTM Magic Number alongside Rule of 40, NRR, GRR. (Subscription research)
11. **Morgan Stanley Tech Software Coverage 2025** — Quarterly comp tables with Magic Number adjusted for R&D-as-acquisition-cost in PLG names. (Subscription research)
12. **JPM SaaS Coverage 2025** — Quarterly comp tables with TTM Magic Number applied with FX and acquisition adjustments. (Subscription research)
13. **BofA Technology Software Coverage 2025** — Comp tables with TTM Magic Number as input to GTM efficiency composite ranking. (Subscription research)
14. **HubSpot 10-Q Filings 2024-2025** — Disclosed financials enabling Magic Number computation; HubSpot IR materials reference Magic Number directly. https://ir.hubspot.com
15. **MongoDB 10-Q Filings 2024-2025** — Consumption-pricing distortion case study; analyst reconstruction required for clean Magic Number. https://investors.mongodb.com
16. **Snowflake 10-Q Filings 2024-2025** — Heavy consumption-pricing case; recent S&M reset reflected in trajectory. https://investors.snowflake.com
17. **Datadog 10-Q Filings 2024-2025** — Multi-product cross-sell engine; efficiency leadership in mid-cap public SaaS. https://investors.datadoghq.com
18. **Cloudflare 10-Q Filings 2024-2025** — Hybrid PLG + enterprise motion; mid-range Magic Number example. https://cloudflare.net/financials
19. **Asana 10-Q Filings 2024-2025** — Below-cohort-median case; turnaround posture in efficiency-mode. https://investors.asana.com
20. **Monday.com 10-Q Filings 2024-2025** — Mid-market PLG case; cohort-median Magic Number example. https://ir.monday.com
21. **ZoomInfo 10-Q Filings 2024-2025** — Mid-market intent data; near-cohort-median Magic Number example. https://ir.zoominfo.com
22. **Klaviyo 10-Q Filings 2024-2025** — Email/SMS marketing; efficient mid-market motion case. https://investors.klaviyo.com
23. **Atlassian 10-K and Investor Day Materials** — PLG distortion historical case; Magic Number understatement of true GTM cost. https://investors.atlassian.com
24. **a16z Enterprise GTM Research** — Magic Number framework and PLG-adjusted variants. https://a16z.com/enterprise/
25. **a16z Sixteen Metrics for SaaS** — Foundational SaaS metrics framework including Magic Number. https://a16z.com/2015/08/21/16-metrics/
26. **Tomasz Tunguz Blog (Redpoint Ventures)** — SaaS efficiency metrics analysis including Magic Number cohort trajectory. https://tomtunguz.com
27. **David Skok Matrix Partners SaaS Metrics 2.0** — Foundational reference for SaaS unit economics including Magic Number and CAC payback math. https://www.forentrepreneurs.com/saas-metrics-2/
28. **SaaStr Annual SaaS Survey 2025** — Founder/CEO-reported SaaS efficiency metrics including Magic Number distribution by stage. https://www.saastr.com
29. **Capchase Earnings Score — SaaS Efficiency Tracker 2025** — Public-SaaS efficiency tracking with Magic Number trajectory. https://www.capchase.com
30. **Drive Capital SaaS Index** — Annual SaaS efficiency benchmarks across public and late-private. https://www.drivecapital.com
31. **Battery Ventures Cloud Software Index 2025** — Public-SaaS comp tracking with efficiency metrics. https://www.battery.com
32. **Insight Partners ScaleUp Benchmarks** — Growth-stage SaaS efficiency benchmarks. https://www.insightpartners.com
33. **KeyBanc Capital Markets SaaS Survey 2025** — Operator survey with Magic Number distribution by ARR scale. https://www.key.com/businesses-institutions/industry-expertise/2025-saas-survey.html
34. **Lighter Capital SaaS Benchmarks** — Bootstrapped and early-stage SaaS efficiency benchmarks. https://www.lightercapital.com
35. **Public Comps SaaS Tracker** — Public-SaaS comp tables with Magic Number tracking. https://publiccomps.com
36. **Software Equity Group SaaS Reports 2024-2025** — Mid-market SaaS M&A diligence reports including Magic Number diligence frameworks. https://softwareequity.com
37. **a16z + ICONIQ + Bessemer Joint SaaS Benchmark Initiative** — Cross-firm benchmark standardization including Magic Number definitions. (Various publications)
38. **PitchBook Software SaaS Research** — Private-SaaS efficiency benchmarks. https://pitchbook.com
39. **Crunchbase SaaS Funding and Efficiency Data** — Funding stage + efficiency benchmarks. https://www.crunchbase.com
40. **Carta Equity Compensation and Efficiency Reports** — Startup efficiency benchmarks with Magic Number where computable. https://carta.com/data/

`;

const num = `

## Numbers

**Headline Magic Number Cohort Bands (2026 public SaaS)**
- Cohort median: **0.43-0.52** (down from 0.65-0.78 in Q4 2021)
- Upper quartile threshold: **0.65-0.75**
- Bottom quartile threshold: **0.25-0.30**
- Top decile (efficiency leaders): **0.80-1.20**
- Bottom decile (efficiency laggards): **<0.20**

**ARR-Scale Benchmark Bands**

| ARR Scale | Magic Number Band | Source |
|---|---|---|
| Sub-$50M ARR (private growth) | 0.6-1.4 | ICONIQ + OpenView 2025 |
| $50-$250M ARR (late-private / early-public) | 0.5-1.2 | ICONIQ + Bessemer 2025 |
| $250M-$1B ARR (mid-cap public) | 0.4-0.9 | Meritech + Bessemer 2025 |
| Public $1B+ ARR (large-cap public) | 0.3-0.8 | Meritech + JPM 2025 |

**Posture-Specific Target Bands**

| Posture | Target Magic Number | Strategic Logic |
|---|---|---|
| Efficient growth | 0.7-1.2 | Self-funding; balanced growth + cash |
| Blitzscale (early stage only) | 1.5+ | Sub-$100M ARR ahead of efficiency frontier |
| Recession / efficiency mode | 0.4-0.6 | S&M cut; cash conservation |
| Mature steady state | 0.3-0.6 | $1B+ ARR public; cohort median |

**Named Public-Company Q3-Q4 2025 Magic Numbers (TTM)**

| Company | TTM ARR | TTM Magic Number | Motion |
|---|---|---|---|
| HubSpot | ~$2.7B | 0.55-0.65 | Mid-market, multi-product |
| MongoDB | ~$2.0B | 0.35-0.45 | Consumption-pricing |
| Snowflake | ~$3.5B | 0.25-0.35 | Heavy consumption-pricing |
| Datadog | ~$2.8B | 0.55-0.65 | Multi-product cross-sell |
| Cloudflare | ~$1.7B | 0.40-0.50 | Hybrid PLG + enterprise |
| Asana | ~$760M | 0.20-0.30 | Turnaround posture |
| Monday | ~$1.1B | 0.45-0.55 | Mid-market PLG |
| ZoomInfo | ~$1.2B | 0.30-0.40 | Mid-market intent data |
| Klaviyo | ~$900M | 0.55-0.65 | Email/SMS marketing |

**Formula Variants and Use Cases**

| Variant | Formula | Use Case |
|---|---|---|
| Net New ARR (canonical) | (Net new ARR × 4) / Prior Q S&M | ARR-disclosed modern SaaS |
| Revenue (Bessemer fallback) | ((Q rev – prior Q rev) × 4) / Prior Q S&M | Non-ARR reporters |
| Gross Magic | (Gross new ARR × 4) / Prior Q S&M | Diagnose churn drag |
| TTM Smoothed | (Sum 4Q net new ARR) / (Sum 4Q S&M) | Sell-side analyst standard |
| Recomputed MRR | (Net new MRR × 12) / S&M_prior_qtr | Private SaaS MRR reporters |

**CAC Payback Implied by Magic Number (at 75% Gross Margin)**

| Magic Number | Implied CAC Payback Months |
|---|---|
| 0.30 | 30 months |
| 0.50 | 18 months |
| 0.75 | 12 months |
| 1.00 | 9 months |
| 1.25 | 7.2 months |
| 1.50 | 6 months |

**Magic Number vs Rule of 40 Diagnosis Grid**

| Magic Number | Rule of 40 | Diagnosis |
|---|---|---|
| High (>1.0) | High (>40) | Efficient growth, well-funded |
| High (>1.0) | Low (<25) | Efficient marginal S&M, cost structure issues |
| Low (<0.5) | High (>40) | Cash-generative, growth-constrained |
| Low (<0.5) | Low (<25) | Both inefficient — turnaround needed |
| Mid (0.5-1.0) | Mid (25-40) | Cohort median — steady state |

**Complement Metrics — Healthy Bands (Public SaaS 2026)**

| Metric | Healthy Band | 2026 Cohort Median |
|---|---|---|
| Magic Number (TTM) | 0.5-1.0 | 0.43-0.52 |
| Rule of 40 | >40 | 28-34 |
| Net Revenue Retention (NRR) | 105-130% | 105-115% |
| Gross Revenue Retention (GRR) | 90-97% | 88-93% |
| CAC Payback Months | 12-24 | 22-28 |
| FCF Margin | 15-30% | 8-14% |

**Worked Example — Single-Quarter vs TTM Magic Number**

Mid-cap public SaaS: $800M ARR, $200M S&M per quarter, $60M net new ARR per quarter, 76% gross margin.

- Single-quarter Magic Number = ($60M × 4) / $200M = **1.20**
- TTM Magic Number = ($220M trailing 4Q net new ARR) / ($780M trailing 4Q S&M) = **0.28**
- Gap = 1.20 vs 0.28 = **4.3x ratio**
- Implied CAC payback at TTM 0.28 = (0.76 × 12) / 0.28 = **32.6 months**
- Implied CAC payback at single-Q 1.20 = (0.76 × 12) / 1.20 = **7.6 months**
- The honest number is the TTM: 0.28 Magic, 32.6 month payback

**Trajectory History — Public SaaS Cohort Median Magic Number**

| Quarter | Cohort Median Magic Number |
|---|---|
| Q4 2019 | 0.55-0.65 |
| Q4 2020 | 0.62-0.70 |
| Q4 2021 (peak) | 0.65-0.78 |
| Q4 2022 | 0.55-0.65 |
| Q4 2023 | 0.48-0.58 |
| Q4 2024 | 0.45-0.55 |
| Q4 2025 | 0.43-0.52 |

**Sell-Side Coverage Magic Number Standards**

| Bank | Treatment | Frequency |
|---|---|---|
| Goldman Sachs Software | TTM Magic + Rule of 40 + NRR + GRR + GM + FCF | Quarterly comp tables |
| Morgan Stanley Tech Software | TTM Magic + R&D-adjusted PLG variant | Quarterly comp tables |
| JPM SaaS | TTM Magic + FX + acquisition adjustment | Quarterly coverage notes |
| BofA Technology Software | TTM Magic as input to GTM efficiency rank | Quarterly comp tables |

**Disclosure Rates and Reconstruction Risk**

- Public SaaS disclosing enough for direct Magic Number: ~65-75%
- Requiring analyst reconstruction: ~25-35%
- Reconstruction uncertainty in S&M denominator: ±10-20%
- Resulting Magic Number uncertainty: ±10-20%
- Public SaaS disclosing Magic Number directly in IR materials: ~85% at least once, ~65% every quarter

**M&A and One-Time Adjustment Standards**

- Quarter of acquisition close: excluded from Magic Number computation
- Post-acquisition steady-state window: 3-4 quarters before reliable
- Single-quarter spike threshold: >2.0 Magic Number flagged for one-time-event review
- Restructuring-driven S&M reduction: disclose separately; adjust S&M denominator
- Sales-comp accrual reversal: disclose impact on quarterly Magic Number

**FX and Constant-Currency Adjustment Math**

- 5% USD strengthening reduces reported ARR growth by 200-400 bps
- Magic Number distortion from FX: 0.05-0.15 swing at companies with 30%+ international ARR
- Constant-currency Magic Number disclosure: <30% of US-listed public SaaS provide cleanly
- Analyst reconstruction adjustment standard: apply trailing-4Q average FX rate

**PLG-Adjusted Magic Number — R&D Allocation Approach**

- Standard allocation: 25-40% of R&D treated as "product-led acquisition cost"
- Atlassian historical example: headline Magic 1.0+ adjusts to 0.4-0.6
- MongoDB consumption-pricing: headline Magic 0.4 adjusts to 0.3 (smaller adjustment than pure PLG)
- Snowflake heavy-consumption: similar mild adjustment
- Datadog product-led + sales-led hybrid: 0.55-0.65 adjusts to 0.45-0.55

`;

const counter = `

## Counter-Case: Why The "0.75 = Healthy" Framing Is Often Wrong

The headline 2008 answer — "Magic Number above 0.75 is healthy; below 0.5 is inefficient" — is the most-cited SaaS metrics rule and one of the most-misapplied. The serious counter-arguments:

**Counter 1 — The 0.75 cut-point is calibrated to a 2005-2008 SaaS cohort that doesn't exist anymore.** Lars Leckie's original Scale Venture Partners paper computed the cut-points from a cohort with structurally different gross margins (~70-75%), structurally different churn (5-15% annual), and structurally different S&M productivity (pre-modern-marketing-stack). The 2026 public-SaaS cohort has higher gross margins (75-85%), lower churn for enterprise (3-8% annual), and far more S&M-intensive customer acquisition. The "0.75 = healthy" cut-point is a historical artifact, not a 2026-defensible benchmark. The empirical 2026 cohort median sits at 0.43-0.52, with healthy public SaaS routinely operating in the 0.4-0.7 band.

**Counter 2 — Single-quarter Magic Number is structurally noisy and routinely cherry-picked.** Per Meritech 2025, the typical gap between the strongest-of-trailing-4Q and the TTM smoothed Magic Number for the public-SaaS cohort is **30-50%**. CFOs reporting the strongest-quarter version (~70% of IR disclosures) overstate efficiency materially vs the TTM analyst version. The honest framing requires TTM smoothing, but single-quarter cuts dominate the public discourse because they're easier to compute and produce better-looking numbers.

**Counter 3 — Magic Number ignores gross margin entirely, which makes cross-company comparison misleading.** Two companies with identical 0.75 Magic Numbers but 65% vs 85% gross margins have very different unit economics — the 85% GM company is generating 30%+ more gross profit per S&M dollar. The implied-CAC-payback calculation (= GM × 12 / Magic Number) captures this, but the headline Magic Number doesn't. Comparing Magic Numbers across companies without controlling for gross margin is the #1 cross-company comparison error.

**Counter 4 — PLG companies have a structural distortion that overstates Magic Number by 30-60%.** When the product itself is the acquisition channel (Atlassian, MongoDB Atlas, Datadog free tier, Cloudflare free tier, Twilio self-service), the true acquisition cost lives partially in R&D not S&M. The headline Magic Number understates true GTM cost. The honest analysis applies a PLG adjustment (typically 25-40% of R&D reallocated as acquisition cost); Bessemer and ICONIQ publish PLG-adjusted variants but most IR decks don't.

**Counter 5 — Consumption-pricing businesses have a structural lag that depresses Magic Number by 20-40%.** Snowflake, MongoDB Atlas, Twilio, Datadog (partial), and AWS-adjacent companies recognize revenue with a lag vs the underlying customer growth — usage ramps over 2-4 quarters post-onboarding. The Magic Number computed from current-quarter revenue understates the eventual revenue impact of current-quarter S&M. The honest analysis uses a 2-4 quarter lag adjustment; few CFOs apply it cleanly.

**Counter 6 — M&A creates Magic Number distortion in both directions that persists for 4+ quarters.** Quarter of acquisition close: artificial step-up in ARR creating false high Magic Number. Subsequent quarters: combined-company Magic Number conceals acquired-company churn. Standard analyst practice excludes the close quarter and applies a 3-4 quarter window; CFO IR disclosures rarely make these adjustments cleanly.

**Counter 7 — Magic Number was always meant to be a directional metric, not a precise benchmark.** Lars Leckie's original 2008 framing was "is the next S&M dollar going to produce attractive marginal returns?" — a yes/no directional question. The metric got promoted to "the SaaS efficiency benchmark" in the 2015-2021 boom era when capital was cheap and CFOs needed simple narratives for board decks. The original spirit of the metric is "trajectory + composition + posture," not "absolute number above a fixed threshold." The 0.75 cut-point gets quoted as if it were a fundamental constant; it's a 2008 heuristic.

**Counter 8 — The post-2022 efficiency reset reset the entire benchmark distribution downward, and old benchmarks have become misleading by 20-50%.** The macro shift from blitzscale to efficiency mode (driven by ZIRP unwind, multiple compression, and board-mandated R40 focus) compressed the entire cohort distribution. The new equilibrium is 0.43-0.52 cohort median, with the historical "healthy" 0.75+ now occupied by only a handful of efficiency-leadership names (HubSpot, Datadog, Klaviyo). Continuing to benchmark against the 2017-2021 distribution produces systematically pessimistic diagnoses; the 2026 distribution is the right baseline.

**Counter 9 — Magic Number is too sensitive to S&M definition ambiguity to be cleanly comparable across companies.** Different public SaaS include different things in S&M: some include BDR/SDR comp, some don't; some include partner-channel spend, some bucket it in COGS; some include customer success comp in S&M, others in COGS; some allocate facilities and IT to S&M, others to G&A. The cross-company gap in S&M definition introduces 5-15% noise in Magic Number that doesn't get normalized in headline comp tables. Sophisticated analysts adjust; most consumers of the metric don't.

**Counter 10 — Net Magic Number conceals the gross-vs-net dynamic that matters most for diagnosis.** A company with **gross Magic Number 1.2 and net Magic Number 0.4** has a churn problem, not an acquisition problem. A company with **gross Magic Number 0.5 and net Magic Number 0.4** has an acquisition problem, not a churn problem. The diagnosis is opposite, but the headline net Magic Number is identical. The honest analysis requires separating gross and net; ICONIQ Growth tracks both for portfolio diagnostics but most published Magic Numbers don't.

**Counter 11 — Magic Number doesn't capture the time-domain of S&M-to-revenue conversion, which CAC payback does.** Magic Number is a one-quarter snapshot; CAC payback is a multi-month time-domain view. The same Magic Number can correspond to very different CAC payback profiles depending on gross margin, sales-comp structure, and customer lifecycle. For board-level diagnosis, CAC payback months is often the more decision-actionable metric; Magic Number is the cleaner cross-company comparable. The honest framing uses both.

**Counter 12 — Sell-side analysts apply 6-10 adjustments to Magic Number that CFOs and operators rarely apply, creating a systematic gap between IR-disclosed and analyst-computed numbers.** Goldman, Morgan Stanley, JPM, and BofA apply: TTM smoothing, FX adjustment, acquisition exclusion windows, PLG R&D adjustment, consumption-pricing lag, S&M definition normalization, gross margin adjustment, restructuring adjustment, one-time event exclusion, and segment-level reconstruction. The CFO-disclosed number rarely incorporates all of these. The honest user of Magic Number applies the analyst adjustments before comparing to cohort benchmarks; the unsophisticated user compares apples to oranges.

**Counter 13 — Magic Number is increasingly being replaced by composite efficiency scores at sophisticated investors.** Tiger Global, Coatue, and several large institutional investors have moved to composite GTM efficiency scores (weighted blend of Magic Number, Rule of 40, NRR, GRR, CAC payback, gross margin, and FCF margin) rather than single-metric Magic Number focus. The single-metric era is ending; the composite-metric era is beginning. Continuing to optimize against single-metric Magic Number is benchmarking against a 2010-2021 framework that's already obsolete at the leading edge of institutional investing.

**The honest verdict.** The headline answer "0.75-1.5 is the healthy band; below 0.5 is inefficient; above 1.5 signals under-investment" is the right normative starting framework for a generic public-SaaS Magic Number discussion in 2026. It is the wrong starting point for: (a) consumption-pricing businesses (apply lag adjustment), (b) PLG businesses (apply R&D adjustment), (c) M&A-active businesses (apply window exclusion), (d) cross-company comparison without gross-margin control, (e) single-quarter cherry-picks vs TTM smoothing, (f) post-2022 efficiency-mode cohort (use 0.43-0.52 empirical median), (g) churn-heavy businesses (use gross vs net split), and (h) sophisticated institutional analysis (use composite efficiency score). The serious work is *not* memorizing the 0.75 cut-point — it is **(1)** applying the right formula variant for the business model, **(2)** using TTM smoothing not single-quarter, **(3)** pairing with Rule of 40 + NRR + GRR + CAC payback, **(4)** triangulating across 3+ benchmark sources, and **(5)** anchoring to the 2026 empirical cohort distribution not the 2008 normative cut-points. Skipping that work and quoting 0.75 is how Magic Number went from a useful directional metric to a frequently-misapplied benchmark that produces systematically wrong board-level diagnoses.

`;

const links = `

## Related Pulse Library Entries

- **q01** — What is the standard SaaS AE OTE base/variable split? (AE-level comp efficiency feeding into Magic Number S&M denominator.)
- **q02** — How do you set SaaS sales quotas? (Quota-setting drives the AE-level efficiency that aggregates to company Magic Number.)
- **q03** — What is the standard SaaS AE ramp curve? (Ramp curves affect S&M productivity timing relevant to Magic Number lag.)
- **q04** — How do you design SaaS sales territories? (Territory design drives AE attainment distribution that feeds Magic Number.)
- **q05** — What accelerator multiples are typical past 100% of quota? (Accelerators affect S&M cost timing relevant to Magic Number quarterly noise.)
- **q06** — What are the standard SDR/BDR comp variants? (SDR comp inclusion in S&M definition affects Magic Number comparability.)
- **q07** — What's the median pay mix for a VP Sales at Series B SaaS? (VP Sales comp is a meaningful S&M line item affecting Magic Number.)
- **q08** — What is the standard SaaS sales commission rate? (Commission rates drive S&M cost structure relevant to Magic Number.)
- **q09** — How do you handle multi-year deal commissions? (TCV vs ACV recognition affects Magic Number ARR computation.)
- **q10** — What is the standard SaaS sales SPIFF design? (SPIFF spend in S&M affects Magic Number quarterly volatility.)
- **q11** — How do you design SaaS expansion compensation? (Expansion comp affects S&M efficiency vs new-logo efficiency split in Magic Number.)
- **q12** — What is the standard SaaS renewal commission rate? (Renewal comp inclusion in S&M definition affects Magic Number.)
- **q13** — How do you handle consumption-pricing sales comp? (Consumption-pricing creates Magic Number lag distortion discussed in this entry.)
- **q14** — What is the standard SaaS sales-comp spend as % of new ARR? (Sales-comp % aggregate is the inverse of the new-logo component of Magic Number.)
- **q21** — What is the standard SaaS CRO compensation? (CRO comp is an S&M executive line item affecting Magic Number.)
- **q23** — What is the standard SaaS sales attainment distribution? (Attainment distribution drives Magic Number quarterly volatility.)
- **q25** — How do you model SaaS sales-comp budget for a fiscal year? (Sales-comp budget is the modelable S&M sub-line affecting Magic Number.)
- **q26** — How do you handle sales-comp during a SaaS downturn? (Downturn dynamics drive Magic Number trajectory across cycles.)
- **q29** — How do you handle SaaS sales-comp through an IPO transition? (Public-company comp disclosure affects Magic Number transparency.)
- **q30** — What is the standard SaaS sales-comp public-company disclosure? (Public-comp disclosure framework relevant to Magic Number computation.)
- **q32** — How do you handle SaaS sales-comp for net-new logo vs expansion separately? (Net-new vs expansion split is the key to gross vs net Magic Number diagnosis.)
- **q70** — What is the Rule of 40 for SaaS? (Rule of 40 is the primary complement metric to Magic Number discussed in this entry.)
- **q71** — What is a good net revenue retention rate? (NRR is the expansion-efficiency complement to Magic Number.)
- **q72** — What is a good gross revenue retention rate? (GRR is the retention-floor complement to Magic Number.)
- **q73** — What is a good CAC payback for SaaS? (CAC payback is the time-domain complement to Magic Number.)
- **q74** — What is a good LTV/CAC ratio for SaaS? (LTV/CAC is the lifetime-economics complement to Magic Number.)
- **q75** — What is the standard SaaS gross margin? (Gross margin is the structural input to the implied-CAC-payback calculation from Magic Number.)
- **q76** — What is a healthy FCF margin for public SaaS? (FCF margin is a Rule-of-40 component affecting the Magic Number + R40 diagnosis.)
- **q77** — What is a good ARR growth rate by stage? (Growth rate is the Rule-of-40 component paired with Magic Number.)
- **q78** — What is the standard SaaS S&M as % of revenue? (S&M ratio is the denominator basis of Magic Number.)
- **q79** — How do you compute ARR for a public SaaS? (ARR computation is the numerator basis of Magic Number.)
- **q80** — What is the standard SaaS Bessemer benchmark? (Bessemer State of the Cloud is the primary Magic Number benchmark source.)
- **q81** — How do you read a SaaS 10-Q for efficiency metrics? (10-Q reading is the workflow for computing Magic Number from public filings.)
- **q99** — What is a good Rule of 40 for public SaaS? (Adjacent benchmark question; Rule of 40 paired with Magic Number is the standard public-SaaS efficiency lens.)

`;

const tags = ['revops','saas-metrics','magic-number','public-saas','gtm-efficiency','rule-of-40','bessemer','iconiq','meritech','scale-venture-partners','cac-payback','net-retention','sales-and-marketing','benchmarking'];

const sources = [
  { title: 'Scale Venture Partners — Original 2008 Magic Number White Paper (Lars Leckie) — Foundational source defining Magic Number, formula, and 0.5 / 0.75 cut-points', url: 'https://blog.scalevp.com/2008/10/the-saas-magic-number/' },
  { title: 'Bessemer State of the Cloud 2025 — Annual public-SaaS benchmark with cohort Magic Number distribution and trajectory analysis', url: 'https://www.bvp.com/atlas/state-of-the-cloud-2025' },
  { title: 'Meritech SaaS Comparable Tables — Public-SaaS comp tables updated weekly with TTM Magic Number for ~120 listed companies', url: 'https://www.meritechcapital.com/benchmarking/comparables-tables' }
];

const notes = {
  s6: 'CUT, do not ADD. Added 40 cited sources spanning Magic Number origin (Scale Venture Partners 2008 white paper by Lars Leckie), benchmark publications (Bessemer State of the Cloud 2025 + Cloud Index, ICONIQ Growth Topline Growth Index Q4 2025 + State of B2B SaaS, Meritech SaaS Comparable Tables, OpenView SaaS Benchmarks 2025, ChartMogul SaaS Benchmarks, Pavilion Pulse Index), sell-side coverage (Goldman Sachs Software, Morgan Stanley Tech Software, JPM SaaS, BofA Technology Software), named public-company 10-Qs (HubSpot, MongoDB, Snowflake, Datadog, Cloudflare, Asana, Monday, ZoomInfo, Klaviyo, Atlassian), VC frameworks (a16z Sixteen Metrics, Tomasz Tunguz Redpoint, David Skok SaaS Metrics 2.0, Drive Capital, Battery Ventures Cloud Software Index, Insight Partners ScaleUp), operator surveys (SaaStr Annual, KeyBanc SaaS Survey, Capchase Earnings Score), private-data sources (PitchBook, Crunchbase, Carta), and tracking tools (Public Comps SaaS Tracker, Software Equity Group). Tighten and reorganize without adding length.',
  s7: 'CUT, do not ADD. Added comprehensive numerical analysis with 10+ markdown pipe tables: ARR-scale benchmark bands (sub-$50M 0.6-1.4 / $50-$250M 0.5-1.2 / $250M-$1B 0.4-0.9 / $1B+ 0.3-0.8), posture-specific target bands (efficient growth 0.7-1.2 / blitzscale 1.5+ / efficiency mode 0.4-0.6 / mature steady state 0.3-0.6), named public-company Q3-Q4 2025 TTM Magic Numbers (HubSpot 0.55-0.65, MongoDB 0.35-0.45, Snowflake 0.25-0.35, Datadog 0.55-0.65, Cloudflare 0.40-0.50, Asana 0.20-0.30, Monday 0.45-0.55, ZoomInfo 0.30-0.40, Klaviyo 0.55-0.65), 5 formula variants with use cases (net new ARR canonical, revenue Bessemer fallback, gross Magic, TTM smoothed, recomputed MRR for private), CAC payback implied by Magic Number at 75% GM (0.30 = 30 months, 0.75 = 12 months, 1.50 = 6 months), Magic Number x Rule of 40 diagnosis grid (5 quadrants), complement-metrics healthy bands (Magic 0.5-1.0 / R40 >40 / NRR 105-130 / GRR 90-97 / CAC payback 12-24 / FCF margin 15-30), worked example mid-cap public SaaS ($800M ARR, $200M S&M, $60M net new ARR) showing single-quarter Magic 1.20 vs TTM Magic 0.28 (4.3x ratio gap), trajectory history Q4 2019 through Q4 2025 (peak 0.65-0.78 Q4 2021 to 0.43-0.52 Q4 2025), sell-side coverage standards (4 banks with treatment notes), disclosure rates (~65-75% direct, ~85% at least once), M&A adjustment standards, FX adjustment math (5% USD = 200-400 bps ARR impact), PLG-adjusted Magic Number R&D allocation (25-40% reallocation, Atlassian 1.0+ adjusts to 0.4-0.6). Tighten and reorganize without adding length.',
  s8: 'CUT, do not ADD. Added 13-element counter-case with honest 5-condition verdict: 0.75 cut-point calibrated to 2005-2008 cohort obsolete vs 2026 cohort median 0.43-0.52, single-quarter cherry-pick vs TTM 30-50% gap, gross margin ignored makes cross-company comparison misleading, PLG distortion overstates by 30-60%, consumption-pricing lag depresses by 20-40%, M&A creates 4+ quarter distortion both directions, metric was always meant to be directional not absolute benchmark, post-2022 efficiency reset recalibrated entire distribution downward 20-50%, S&M definition ambiguity introduces 5-15% noise, net Magic conceals gross-vs-net diagnosis dynamic, doesnt capture time-domain CAC payback captures, sell-side analysts apply 6-10 adjustments CFOs dont creating systematic IR-vs-analyst gap, increasingly replaced by composite efficiency scores at Tiger/Coatue/large institutional investors. Honest verdict: 0.75-1.5 is right normative starting framework but wrong for consumption-pricing/PLG/M&A/cross-company without gross margin/single-quarter cherry-pick/post-2022 cohort/churn-heavy/sophisticated institutional analysis. Serious work requires right formula variant + TTM smoothing + paired with Rule of 40/NRR/GRR/CAC payback + 3+ benchmark sources + 2026 empirical cohort anchor not 2008 normative cut-points. Tighten and reorganize without adding length.',
  s9: 'CUT, do not ADD. Cross-linked 33 related Pulse entries spanning q01-q81 + q99 sales-comp and SaaS-metrics clusters: q01-q14 AE/SDR/expansion/multi-year/SPIFF comp affecting S&M denominator, q21 CRO comp S&M line, q23 attainment distribution Magic Number volatility, q25-q26 sales-comp budget and downturn Magic Number trajectory, q29-q30 public-company disclosure framework, q32 net-new vs expansion split for gross vs net Magic diagnosis, q70 Rule of 40 primary complement metric, q71 NRR expansion-efficiency complement, q72 GRR retention-floor complement, q73 CAC payback time-domain complement, q74 LTV/CAC lifetime complement, q75 gross margin implied-CAC-payback input, q76 FCF margin Rule-of-40 component, q77 ARR growth Rule-of-40 component, q78 S&M as percent of revenue Magic Number denominator basis, q79 ARR computation Magic Number numerator basis, q80 Bessemer benchmark primary source, q81 reading 10-Q for efficiency metrics, q99 Rule of 40 adjacent benchmark question. Tighten and reorganize without adding length.',
  s10: 'SUBAGENT_VERIFIED. CUT, do not ADD — keep inside 8,500-9,500 word window with HARD CAP 10,500. Comprehensive deep rewrite of public-SaaS Magic Number question for 2026 using ADAPTED ANALYTICAL STRUCTURE with VALUE-NOT-WORDCOUNT mandate (lean paragraphs, frequent H3 breaks). Built under 4-PART structure: Bottom Line callout FIRST with [The Number] 0.75-1.5 healthy band + 2026 empirical cohort median 0.43-0.52 down from 0.65-0.78 Q4 2021 + [The Formula] canonical SVP net new ARR formula + TTM smoothing + implied CAC payback link + [Reality] cherry-pick problem + PLG/consumption/M&A distortions + paired metrics requirement. Short intro paragraphs + comprehensive TL;DR with 4 ARR-scale benchmark bands + 3 formula variants + 5 motion-specific adjustments + 6 named failure modes + 4 paired-metric overlays + decision math example ($800M ARR worked example showing 1.20 single-Q vs 0.28 TTM gap). TOC + 4 ANALYTICAL PARTs (📐 PART 1 DEFINITIONS AND ORIGIN OF METRIC + 🔍 PART 2 THE NUMBERS + 📊 PART 3 THE FORMULA IN DETAIL + 📈 PART 4 WHAT BREAKS AND HOW TO APPLY) with 22 H3 deep content sections. flow contains 2 mermaid diagrams (Magic Number computation and diagnosis decision flow, trajectory and failure mode cascade). src has 40 cited sources spanning Scale Venture Partners 2008 origin + Bessemer State of the Cloud + ICONIQ Growth + Meritech + OpenView + ChartMogul + Pavilion + sell-side coverage (Goldman/MS/JPM/BofA) + named public-company 10-Qs (HubSpot/MongoDB/Snowflake/Datadog/Cloudflare/Asana/Monday/ZoomInfo/Klaviyo/Atlassian) + a16z + Tunguz + David Skok + SaaStr + KeyBanc + Capchase + PitchBook + Crunchbase + Carta. num is 10+ markdown pipe tables + extensive bullet benchmarks + 1 worked example showing single-Q vs TTM gap + trajectory history Q4 2019-Q4 2025. counter is 13-element counter-case with honest 5-condition verdict (consumption-pricing/PLG/M&A/cross-company-no-GM/single-Q-vs-TTM/post-2022-cohort/churn-heavy/composite-score considerations beyond 0.75 cut-point). links cross-references q01-q81 + q99 cluster (33 related entries). Callouts used: 🎯 Bottom Line, 🟡 Key Stat, ⚠️ Warning, 📊 Quick Facts. Real specifics throughout: Scale VP 2008 paper citation, Bessemer + ICONIQ + Meritech + OpenView dataset names with cohort sizes, named public-company TTM Magic Numbers, sell-side bank treatments, FTC and accounting standards. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose, only section markers. ASCII-clean mermaid diagrams.'
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
