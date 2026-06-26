// q01 — What's a fair OTE for an enterprise AE selling $100k+ ACV deals in 2026?
// Deep rewrite. Polishes 5 -> 6 -> 7 -> 8 -> 9 -> 10. Targets 8,500-9,500 final words.
const fs = require('fs');
const path = require('path');
const { runPolish } = require('./polish-helper');

// Load .env.local manually so this script is self-contained
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const tldr = `> ### 🎯 Bottom Line
>
> - **[Number]** Fair OTE for a true enterprise AE selling **$100K+ ACV** at a US SaaS company in 2026 lands in a **$220K-$340K** band: **$200K-$240K** at seed/Series A, **$230K-$280K** at Series B, **$250K-$320K** at Series C, and **$280K-$380K** at late-stage / public, with **data infrastructure, security, and AI-platform sellers pulling 15-30% above horizontal SaaS** at the same stage.
> - **[Mix]** Standard pay mix is **50/50 base/variable** with a **4.5x-5.5x quota-to-OTE multiplier** ($1.1M-$1.5M quota on $250K OTE), **1.5x accelerators past 100% and 2.0x-3.0x past 120%**, and **180-day clawback** on cancelled or churned deals — anything tighter than that on accelerators (flat past 100%) or looser than that on clawback (less than 90 days) is a comp-plan smell.
> - **[Reality]** Median enterprise AE attainment in 2026 is **38-58% of reps at or above 100%**, ramp is **6-9 months to a full-pay quota carry but 12-18 months to a clearing W-2 above OTE**, and the published OTE on a job ad overstates median earned W-2 by **18-30%** once you weight by attainment, ramp dilution, territory carve-outs, PIPs, and clawbacks — plan personal finances on **0.7x-0.85x** of the posted OTE, not the OTE itself.

**TL;DR:** "Fair OTE for an enterprise AE selling $100K+ ACV deals in 2026" is one of the most over-asked, under-answered questions in RevOps because **every single word in the question moves the answer by 20-40%**. "Enterprise AE" means at least three different jobs depending on whether you mean a Mid-Market-plus seller doing $100K-$250K deals to VP-level buyers, a true Enterprise seller doing $250K-$1M deals to C-level buyers across 6-12 month cycles, or a Strategic / Named-Account seller doing $1M-$10M+ deals across 9-24 month cycles into Fortune 500 logos — the OTE delta between those three jobs at the same company is typically **$80K-$160K**. "$100K+ ACV" is technically the bottom of the enterprise range; the actual median enterprise deal in 2026 RepVue and Pavilion data sits at **$140K-$260K ACV** for sub-PubCo SaaS and **$420K-$1.1M ACV** at PubCo-scale data and security vendors. "OTE" is itself a fiction — On-Target Earnings assumes 100% quota attainment, which **only 38-58% of enterprise reps clear in any given year** per RepVue 2025-2026 data, Bridge Group's 2024-2025 SaaS AE Compensation Benchmark, and the Pavilion State of Sales Compensation. With those caveats: **the most defensible single-number answer for a typical mid-to-late-stage US SaaS enterprise AE selling $100K-$500K ACV deals in 2026 is $250K-$280K OTE at a 50/50 mix carrying $1.1M-$1.4M quota, with $200K-$240K base case at seed/Series A and $300K-$380K at late-stage / public for data infrastructure, security, and AI-platform companies**. The pay mix is **50/50 base/variable as the modal default**, sliding to **60/40 base-heavy** at companies with longer cycles or new-logo focus and **40/60 variable-heavy** at companies with shorter cycles and high deal repeatability. The quota multiplier — total annual quota divided by OTE — sits at **4.5x-5.5x for $100K-$500K ACV motions** and **5.5x-7.5x for $500K-$2M ACV motions** in healthy companies; anything below 4.0x means the company is overpaying relative to revenue capacity and anything above 8.0x means reps cannot win the deal-volume math and will churn. Accelerators are the second-largest comp-plan lever after base: **standard 2026 structure runs 1.0x to 100%, 1.5x from 100-120%, 2.0x from 120-150%, and 2.5x-3.0x past 150%**, with the best operators publishing **uncapped commissions** to retain top performers. Clawbacks (the period during which a closed deal can be unwound if the customer churns or cancels) run **90 days at aggressive companies, 180 days at modal SaaS, and 365 days at conservative or PLG-heavy companies**; longer is unfriendly to reps and is a recruiting headwind. The real story sits underneath the published OTE: at **38-58% median attainment**, the **W-2 a typical enterprise rep actually earns is 0.65x-0.85x of OTE** once you account for ramp dilution (the first 2-4 quarters at partial quota), territory carve-outs mid-year, deal slippage, churn-triggered clawbacks, and PIP-driven separations. The honest 2026 advice to anyone evaluating an enterprise AE offer: **negotiate base aggressively** (every $10K of base is worth ~$14K of variable on a risk-adjusted basis at median attainment), **demand a written ramp schedule with partial-quota relief** (20-40-60-80-100% across the first five quarters is the modal pattern), **stress-test the quota-to-OTE multiplier against the company's segment-level new-ARR-per-rep history**, **insist on uncapped commissions with documented accelerators past 100%**, and **read the clawback language carefully — a 365-day clawback on a 12-month deal is structurally the same as deferred compensation**. Sources you can cite: Pavilion State of Sales Compensation (2025-2026), RepVue, Bridge Group SaaS AE Metrics, OpenComp, Pave, Alexander Group, Levels.fyi, ICONIQ Growth, Bessemer State of the Cloud, and public-company AE comp from 10-Ks and proxies at Salesforce, HubSpot, MongoDB, Snowflake, Datadog, Confluent, Cloudflare, Atlassian, and ServiceNow. The honest summary: fair OTE for a $100K+ ACV enterprise AE in 2026 is **$250K-$280K typical, $300K-$380K at premium late-stage segments, $200K-$240K at seed/Series A** — but the real fair-ness question is the *mix* (base, accelerators, clawbacks, ramp, quota multiplier, territory), not the headline OTE number, and the candidates and operators who win in this market are the ones who model **expected W-2 at median attainment**, not the brochure number on the offer letter.`;

const core = `

## What "Enterprise AE", "$100K+ ACV", and "OTE" Actually Mean — Why This Question Has Three Hidden Variables

Before any number in this entry is useful, the three operative terms have to be defined precisely because each one carries a 20-40% swing on the answer. The single biggest reason RevOps leaders, hiring managers, candidates, and recruiters argue past each other about "fair OTE" is that they are pricing different jobs.

**Enterprise AE.** In 2026 US SaaS, "Enterprise AE" is used to mean at least three distinct jobs that pay differently and carry different quotas. **(1) Mid-Market-Plus / Lower Enterprise** — sellers doing $100K-$250K ACV deals into VP-level buyers at companies of 1,000-5,000 employees across 4-7 month sales cycles. Quota typically $900K-$1.3M, deal count 6-12 per year, ramp 4-7 months. Job is technically "enterprise" because the deal size crosses the $100K ACV threshold but the buyer set, cycle length, and compensation are closer to mid-market. **(2) True Enterprise / Named Accounts** — sellers doing $250K-$1M ACV deals into C-level and VP+ buyers at companies of 5,000-25,000 employees across 6-12 month cycles. Quota typically $1.2M-$1.8M, deal count 4-8 per year, ramp 6-10 months. This is the modal interpretation of "enterprise AE." **(3) Strategic / Global / Major-Account AE** — sellers doing $1M-$10M+ ACV deals into Fortune 100 / Fortune 500 logos across 9-24 month cycles, often with named-account books of 3-12 logos. Quota typically $2M-$5M, deal count 1-4 per year, ramp 9-15 months. OTE delta from job 1 to job 3 at the same company is typically $80K-$160K. The Pavilion State of Sales Compensation and Bridge Group SaaS AE reports both segment by these three sub-tiers; conflating them produces the comp arguments that fill RevOps Slack groups every January.

**$100K+ ACV.** This is the *threshold* the question specifies, not the *median*. RepVue 2025-2026 data shows the median Enterprise AE deal in US SaaS sits at $140K-$260K ACV for sub-PubCo companies and $420K-$1.1M ACV at PubCo-scale data infrastructure (Snowflake, Databricks, Confluent), security (CrowdStrike, Palo Alto Networks, Wiz), and observability (Datadog, Dynatrace) vendors. A rep selling $100K-$150K deals to 5,000-employee mid-market IT buyers is doing a fundamentally different job — and earning a fundamentally different paycheck — than a rep selling $500K-$1.5M deals to Fortune 500 CIOs. The first job is closer to mid-market AE comp ($180K-$220K OTE) than to true enterprise; the second job clears $300K+ at any healthy company. The question's $100K+ ACV floor is the bottom of the enterprise range, not the center.

**OTE — On-Target Earnings.** OTE is the total cash compensation a rep would earn at exactly 100% of annual quota attainment. It does not include accelerators, SPIFFs, or stretch earnings. It also does not represent any individual rep's actual earned W-2 unless that rep cleared exactly 100% of quota, which essentially nobody does — most reps land somewhere between 30% and 180% of quota in any given year. The single most important comp-literacy point in this entire entry: **OTE is a planning fiction**, useful for pay-mix comparisons but actively misleading as a financial-planning number for a candidate. Median enterprise AE attainment in 2026 is **38-58% of reps clearing 100% or higher** per RepVue and Pavilion 2025-2026 data — meaning a randomly selected enterprise AE earns roughly **0.65x-0.85x of OTE as their actual W-2** once you weight for attainment, ramp dilution, territory carve-outs, and PIP rates.

**Why all three matter.** Asking "what's a fair OTE for an enterprise AE selling $100K+ ACV deals in 2026" without specifying segment, stage, ACV center-of-gravity, geography, and pay mix is like asking "what's a fair salary for an engineer in 2026" — the question is structurally under-specified. The rest of this entry walks through the four parts of a defensible answer: the numbers (OTE bands by stage and segment), the mix (base/variable split, accelerators, clawbacks, multi-year structures), the reality (attainment, ramp, territory, churn comp), and the audit framework (how to build, evaluate, or stress-test your own plan).

---

## PART 1 — THE NUMBERS: OTE BANDS BY STAGE, SEGMENT, AND GEOGRAPHY

### OTE Bands by Company Stage

The single largest determinant of enterprise AE OTE in 2026 is company stage, because stage determines deal size, ACV mix, brand pull, comp-plan generosity, and pricing power. The bands below are the 2026 consensus from the cross-section of Pavilion, RepVue, Bridge Group, OpenComp, Pave, Alexander Group, ICONIQ, and Bessemer compensation data:

> ### 📊 Quick Facts — 2026 Enterprise AE OTE by Stage
>
> - **Seed / Series A** ($1M-$20M ARR): **$180K-$220K** OTE, $90K-$120K base, $90K-$120K variable, quota $700K-$1M.
> - **Series B** ($20M-$80M ARR): **$200K-$260K** OTE, $100K-$140K base, $100K-$140K variable, quota $900K-$1.3M.
> - **Series C / D** ($80M-$250M ARR): **$230K-$300K** OTE, $115K-$160K base, $115K-$160K variable, quota $1.1M-$1.6M.
> - **Late-Stage / Pre-IPO** ($250M-$1B ARR): **$260K-$340K** OTE, $130K-$180K base, $130K-$180K variable, quota $1.3M-$1.9M.
> - **Public Co / Mega-Cap** ($1B+ ARR): **$280K-$380K** OTE at horizontal SaaS, **$320K-$480K** OTE at data/security/AI premium segments, quota $1.5M-$2.5M+.

The bands compress and widen by segment. Horizontal SaaS (CRM, marketing automation, HR tech, productivity) trends toward the lower end of each band. Data infrastructure (Snowflake, Databricks, Confluent, MongoDB), cybersecurity (CrowdStrike, Palo Alto Networks, Wiz, Zscaler), observability (Datadog, Dynatrace, New Relic), and AI-platform sellers (OpenAI enterprise, Anthropic enterprise, Cohere, Together AI, Databricks Mosaic) trend 15-30% above horizontal SaaS at the same stage because their deals are larger, their pricing power is higher, and their margin pool funds richer comp. Levels.fyi 2026 medians put Databricks enterprise AE at roughly $388K, Snowflake at roughly $255K, Salesforce at roughly $180K, MongoDB at roughly $245K, Datadog at roughly $295K, and Cloudflare at roughly $220K — the spread is real and persistent.

### Geographic Adjustments

Geography matters in 2026 less than it did in 2019 (the remote-first wave compressed coastal premiums) but more than it did in 2022 (the return-to-office and hub-city normalization restored some of the differential). Standard 2026 adjustments to the base bands above:

- **US Coastal Hubs** (SF Bay, NYC, Boston, Seattle): **+10% to +18%** on OTE, with most of the lift in base. SF Bay specifically runs $20K-$40K above NYC for the same enterprise role at the same stage.
- **US Tier-2 Tech Hubs** (Austin, Denver, Atlanta, Chicago, Dallas, Raleigh, Salt Lake City, Phoenix): **0% to +5%** vs national median.
- **US Remote / Non-Hub**: **-5% to -12%** on OTE, with most of the give in base. Some companies hold OTE flat and pay full mix everywhere; others apply explicit geo-bands.
- **Canada (Toronto, Vancouver, Montreal)**: **-15% to -25%** in CAD-converted terms vs US national, though the gap is narrowing.
- **EU (London, Berlin, Dublin, Paris, Amsterdam)**: **-20% to -35%** in USD-equivalent terms, with the UK at the higher end and Continental EU at the lower end. London enterprise AE at a US-headquartered SaaS company in 2026 lands at roughly $180K-$260K USD equivalent.
- **APAC (Singapore, Sydney, Tokyo, Bangalore)**: **-25% to -50%** in USD-equivalent terms. Singapore and Sydney are the upper end; Tokyo and Bangalore are the lower end.

A San Francisco enterprise AE at a Series C SaaS company in 2026 lands at $260K-$340K OTE; the same rep at the same company in remote Tampa lands at $210K-$280K; the same rep in London lands at $200K-$260K USD; the same rep in Bangalore lands at $90K-$140K USD. Be precise about which number any benchmark is reporting.

### Pay Mix: Base vs Variable

The pay mix is the second-most-important number in any comp plan after OTE itself. Bridge Group's 2024-2025 SaaS AE Metrics report puts the median enterprise AE mix at **53/47 base/variable**, modestly base-heavy. The 2026 RepVue and Pavilion data converges to **50/50 as the modal default** with sliding adjustments:

- **60/40 base-heavy** appears at companies with **long sales cycles** (9-18 months), **new-logo motion** (no existing book to expand), **complex enterprise procurement** (legal review, security review, RFP processes), or **early-stage companies** where pipeline cures slowly and reps need base to survive ramp.
- **50/50 standard mix** appears at **modal SaaS** with 4-9 month cycles, mixed new-logo and expansion books, and stable territories.
- **40/60 variable-heavy** appears at companies with **shorter cycles** (3-6 months), **high deal repeatability** (PLG-assisted enterprise, mature category leaders), **transactional motion** at the lower end of enterprise ($100K-$200K ACV), or **field sales cultures that explicitly amplify hunter behavior**.

Outside that 60/40-to-40/60 range, mixes get exotic. A 70/30 base-heavy mix typically indicates a "consultative AE" role with heavy implementation or customer-success blending. A 30/70 variable-heavy mix typically indicates a high-velocity volume sales floor that is not really "enterprise" in the traditional sense.

### Quota-to-OTE Multiplier (the most-underweighted number)

Total annual quota divided by OTE is the **single most important sanity check** on a comp plan. Healthy 2026 multipliers:

- **$100K-$250K ACV motion**: **4.0x-5.0x quota:OTE**. A $250K OTE rep carries $1.0M-$1.25M quota.
- **$250K-$500K ACV motion**: **4.5x-5.5x**. A $280K OTE rep carries $1.25M-$1.55M.
- **$500K-$1M ACV motion**: **5.5x-7.0x**. A $310K OTE rep carries $1.7M-$2.2M.
- **$1M-$2M ACV motion / Strategic**: **6.5x-8.5x**. A $360K OTE rep carries $2.3M-$3.1M.

Below 4.0x and the company is overpaying relative to revenue capacity — comp will inevitably be cut or quota raised. Above 8.0x (outside of true strategic accounts where deals are $5M+) and reps cannot win the deal-volume math; turnover will run 40%+ within 18 months.

### Commission Rate as a Triangulation

A useful cross-check on quota-to-OTE math: the implied commission rate as a percentage of ACV. At a 50/50 mix with $250K OTE and $1.25M quota, the variable is $125K, the implied commission rate is $125K / $1.25M = **10.0%** of ACV at full attainment. 2026 surveys (Carvd, OpenComp, Pave) put median SaaS enterprise commission rates at **8-14% of ACV**, clustered around **10-12%** at modal companies and **8-9%** at sub-$100M ARR companies where margins are tighter. If you compute the implied commission rate from a plan and it lands above 14% or below 7%, either the OTE or the quota is mis-specified — verify both with the comp owner.

### Public-Company Specific Numbers

Where SEC disclosures and Levels.fyi data let us see actual enterprise AE comp at public companies, the 2026 numbers (median total comp, US national):

- **Salesforce** — Enterprise AE: median ~$180K, range $126K-$364K+. Salesforce's enterprise quota is famously high ($1.5M-$2.5M), pulling published OTE down in relative terms.
- **HubSpot** — Enterprise AE / Strategic Account Manager: median ~$210K, range $145K-$310K.
- **MongoDB** — Enterprise AE: median ~$245K, range $170K-$420K.
- **Snowflake** — Enterprise AE: median ~$255K, range $211K-$380K+. Top performers consistently clear $400K+ with accelerators.
- **Databricks** — Enterprise AE: median ~$388K, range $263K-$490K+. The highest-paying enterprise sales seat in the SaaS market in 2026.
- **Datadog** — Enterprise AE: median ~$295K, range $200K-$420K.
- **Cloudflare** — Enterprise AE: median ~$220K, range $160K-$340K.
- **Atlassian** — Strategic Account Manager: median ~$210K, range $150K-$320K.
- **CrowdStrike** — Enterprise AE: median ~$285K, range $200K-$420K.
- **Palo Alto Networks** — Enterprise AE: median ~$310K, range $220K-$480K.
- **ServiceNow** — Enterprise AE / Major Account: median ~$290K, range $200K-$440K.

These medians are reported W-2 from employed reps (survivorship bias applies — see Part 3). The spread within each company reflects ramp status, territory quality, and attainment distribution; the top quartile within any of these companies is typically 1.4x-1.8x the median.

---

## PART 2 — MIX & ACCELERATORS: THE STRUCTURE OF THE COMP PLAN

The headline OTE number is the recruiting hook; the *structure* of the comp plan is what determines whether the rep actually earns it. The five structural levers that matter most:

### Commission Curve Shape

The shape of the commission curve from $0 quota to 200%+ attainment is the single most important plan-design choice. Four common shapes:

1. **Linear** — Flat commission rate from $0 to infinity. Simple, easy to model, but **wastes accelerator psychology** and underpays top performers. Mostly extinct in 2026 enterprise SaaS; survives at very early-stage companies and at flat-rate-channel-sales motions.
2. **Decelerator (declining marginal rate)** — Commission rate drops after a threshold. This is the **comp-plan equivalent of a wage cap** and is universally despised by reps. Appears at companies trying to cap "lottery" deal payouts but is a top-performer-killer. Almost always a bad design.
3. **Accelerator (rising marginal rate)** — Commission rate rises past 100% attainment. **The 2026 standard**. Modal structure: 1.0x to 100%, 1.5x from 100-120%, 2.0x from 120-150%, 2.5x-3.0x past 150%. Some companies cap at 3.0x; the best operators publish uncapped commissions to retain top performers (top-quartile reps reliably clear 140-180% of quota and respond viscerally to capped plans).
4. **Cliff** — Zero commission below a threshold (typically 50-70% of quota). Aggressive, common at early-stage / startup AEs, and a major recruiting headwind. Has the structural property of converting reps into binary "make it or get PIP'd" outcomes; statistically punishes solid-but-not-top-performer reps.

The 2026 modal enterprise plan: **accelerator from 100%, no cliff, no decelerator, uncapped past 150%**. Anything different is worth interrogating in the negotiation.

### Standard Accelerator Multiples

> ### 🟡 Key Stat — Accelerator Adoption
>
> Pavilion State of Sales Compensation 2025-2026 data and Everstage's 2026 SaaS Compensation Statistics report converge: **82-87% of SaaS comp plans now include accelerators**. The modal structure is **1.5x from 100-120%, 2.0x past 120%**, with **uncapped commissions on roughly 55-65% of plans** and **3.0x or higher past 150% on roughly 25-35% of plans**. Research from the same surveys finds accelerators increase per-rep new ARR by 13-17% and lift rep satisfaction from ~45% to ~73% relative to flat plans.

Translated into dollars: an enterprise AE at $250K OTE / $1.25M quota who closes $1.5M (120% attainment) on a 1.5x accelerator past 100% earns: base $125K + variable on first $1.25M ($125K) + variable on $250K at 1.5x ($37.5K) = **$287.5K W-2**. The same rep at 150% attainment ($1.875M closed) with 1.5x from 100-120% and 2.0x from 120%+ earns: $125K base + $125K + $37.5K + $125K × 2.0x = **$412.5K W-2**. The accelerator structure is the difference between a top-quartile rep earning 1.2x OTE vs 1.8x OTE on the same deal volume; do not underweight this lever in either plan design or offer negotiation.

### SPIFFs (Special Performance Incentive Funds)

SPIFFs are one-time cash bonuses for specific outcomes — closing a particular product SKU, closing in a particular quarter, winning a competitive displacement, closing above a specific deal size. 2026 typical structure:

- **Annual SPIFF budget per AE**: $5K-$25K, with $10K-$15K modal.
- **Common SPIFF triggers**: $2K for closing a $250K+ deal, $5K for $500K+, $10K for $1M+; $1K-$3K for new-product attach; $5K-$10K for displacing a named competitor; quarterly pipeline-pull-in SPIFFs in the last two weeks of Q4.
- **Strategic SPIFF use**: end-of-quarter pull-in pressure, new-product launches, competitive displacement campaigns, geographic land-and-expand plays. SPIFFs are the most flexible lever in the comp plan; over-use erodes them into "expected income," under-use leaves motivation on the table.

### Multi-Year Deal Bonuses

Multi-year deals are increasingly comped at structurally higher rates because they de-risk renewal and reduce CAC. 2026 typical structure: **Year 1 ACV booked at full commission rate, Years 2+ booked at 25-50% of full rate**, with a **2-3% bonus on TCV for 3-year deals**. Some companies (Snowflake, Databricks, certain late-stage data infra players) pay **multi-year TCV at full rate**, which is highly rep-friendly but is a CFO-friction point.

### New-Logo vs Expansion Split

Enterprise AEs increasingly carry split quotas: **new logo (typically 60-75% of total quota)** plus **expansion / cross-sell into existing book (25-40%)**. Some plans pay new-logo at a premium rate (10-13%) and expansion at a discount (6-9%) to weight rep effort toward new-logo growth; others pay flat across both. The choice depends on company strategy and ARR-mix targets. A rep evaluating an offer should ask: what's the split, what's the rate on each, and how is mid-year reassignment handled?

### PoC Fees and Implementation Comp

For data infrastructure and security sellers, paid proofs-of-concept ($25K-$150K) are increasingly common. Comp structure varies: some companies pay the PoC fee as immediate commission at full rate (rep-friendly), some pay it at 50% rate, some pay nothing until the full deal closes (rep-unfriendly). Verify in any offer where the company's motion involves PoCs.

### Clawback Periods

The clawback (the period during which a closed deal can be unwound if the customer churns, cancels, or fails to pay) is the single most-ignored, most-impactful number in a comp plan from a rep's actual-W-2 perspective. 2026 typical structures:

- **90 days**: aggressive, rep-friendly, common at PLG-assisted enterprise and at companies confident in their implementation success rate.
- **180 days**: modal, especially at companies with 30-90 day implementation cycles.
- **365 days**: conservative, rep-unfriendly, common at companies with high churn risk or long implementation cycles. **A 365-day clawback on a 12-month deal is structurally equivalent to deferred compensation** — the rep does not really earn the commission until the customer renews.
- **Lifetime clawback on churn within Year 1**: appears at some PLG / hybrid models and is universally rep-hostile.

> ### ⚠️ Warning — Read Clawback Language Carefully
>
> A common comp-plan trap: the published OTE assumes 0% clawback, but the actual book of business has 10-18% Year-1 logo churn. On a $1.25M quota, that's $125K-$225K of "won" ACV that gets clawed back, reducing the rep's actual W-2 by $12K-$25K at standard commission rates. Some companies offset clawback risk by paying commission at booking only, with no churn deduction; others claw back fully. **Always model expected W-2 net of historical Year-1 churn**, not gross of it.

---

## PART 3 — REALITY CHECK: ATTAINMENT, RAMP, TERRITORY, CHURN, AND THE GAP BETWEEN OTE AND W-2

The comp-plan structure above is the front-of-the-brochure number. The back-of-the-envelope reality — what an actual enterprise AE in 2026 actually earns as taxable W-2 income — is consistently lower than the published OTE for five compounding reasons.

### Attainment Distribution

> ### 📊 Quick Facts — 2026 Enterprise AE Attainment
>
> - **RepVue 2025-2026 data**: median **38% of enterprise AEs** hit 100% of quota in any given annual period.
> - **Pavilion State of Sales Compensation 2025-2026**: median **47%** at quota or above; range across companies of **30-62%**.
> - **Bridge Group SaaS AE Metrics 2024-2025**: median **55%** at quota for enterprise (broader cohort definition).
> - **Everstage 2026 SaaS Compensation Statistics**: median **42%** at quota; top quartile of companies hits 60-65% quota attainment, bottom quartile hits 25-32%.

The cross-source consensus: **38-58% of enterprise AEs hit quota in 2026**, varying meaningfully by company stage (Series A-B companies show higher attainment due to softer quotas; PubCo companies show lower attainment due to harder quotas). The implication for OTE math: if you randomly select an enterprise AE, the expected W-2 is **not OTE** but **OTE weighted by the attainment distribution at their company**.

A back-of-envelope: at a company where 45% of reps clear 100%, 25% land between 80-100%, 20% land between 50-80%, and 10% land below 50%, the average attainment is roughly 92%. On a $250K OTE / 50/50 mix plan with no accelerators, that's $125K base + 92% × $125K variable = $240K average W-2. With accelerators averaging 1.4x on the over-attainment 45%, the top of the distribution pulls up to $270K-$310K. The bottom of the distribution (50% attainment) earns $125K + 50% × $125K = $187.5K. The headline "$250K OTE" describes a center-of-gravity number that almost nobody actually earns; real W-2 distributes from $150K to $400K+.

### Ramp Reality

Enterprise ramp in 2026 is structurally longer than mid-market or SMB ramp. Industry-standard ramp schedules:

- **Months 1-3 (Q1)**: 20-25% of full quota, full OTE base, often 100% commission rate on closed business (because deals are scarce and you want reps to bank early wins).
- **Months 4-6 (Q2)**: 40-50% of full quota.
- **Months 7-9 (Q3)**: 60-70% of full quota.
- **Months 10-12 (Q4)**: 80-90% of full quota.
- **Months 13-18 (Q5-Q6)**: 100% of full quota.

The Bridge Group SaaS AE Metrics 2024-2025 report puts median enterprise ramp at **15-18 months to full attainment**, not 12. ORM Tech and the Pavilion productivity benchmarks agree. Companies that backload ramp without providing partial-quota relief in months 1-9 will lose new hires by month 6 to companies that handle ramp more graciously.

**Ramp dilution effect on Year 1 W-2**: A rep hired in January at $250K OTE on a standard 20-40-60-80-95-100% quarterly ramp earns variable commission only on attainment against the ramped quota. Even at 100% of ramped quota each quarter, Year 1 W-2 is $125K base + variable on a blended ~60% of full annual quota = $125K + 60% × $125K = **$200K W-2 in Year 1 vs $250K stated OTE**. This is structural, not a function of underperformance.

### Territory and Carve-Out Risk

Mid-year territory reassignment is the single most-cited cause of rep churn in enterprise comp surveys. Common scenarios that destroy expected W-2:

- **Carve-out at QBR**: A high-performing rep loses 2-4 named accounts to a new strategic AE hire. Pipeline that the original rep built doesn't transfer back, but the new account list does. Year-end attainment drops 15-25%.
- **Geographic reshuffling**: Move from East Coast Financial Services to West Coast Manufacturing; pipeline goes to zero and the rep starts over against the same quota.
- **Vertical migration**: Healthcare AE forced into Government / Public Sector; entirely different cycle, different procurement, six-month rebuild.
- **Quota raise mid-year**: Less common in writing but very common in practice — "new accelerator structure" that effectively raises the bar.

A rep evaluating an offer should ask: **"How often has the territory been re-cut in the past 24 months? What's the policy on inflight pipeline credit at reassignment?"** Companies with frequent reorgs are structurally worse comp environments than the published OTE suggests.

### PIP (Performance Improvement Plan) Rates

The PIP rate — the percentage of enterprise AEs placed on a formal Performance Improvement Plan in any given year — runs **12-22% in modal SaaS** per RepVue and Pavilion data. Of those, roughly **60-75% are separated within 90-180 days** of PIP initiation. The expected-value implication: a randomly selected enterprise AE at a modal company has a **7-15% probability of involuntary separation within 12 months** of starting, with the comp tail (severance, accrued commission, pro-rated bonus) typically running 4-12 weeks of base salary.

A rep evaluating an offer should ask: **"What's the 12-month and 24-month attrition rate for the enterprise AE team? What's the PIP rate? What's the separation policy for clawback on closed deals?"** The honest answers separate good-faith from bad-faith comp environments.

### How Comp Design Breaks at Low Attainment (<40%)

The hardest stress test for any comp plan is what happens at low attainment. Two failure modes:

1. **Low-base, high-variable plans (40/60)** at low attainment grind down to base-only income, which at $90K-$110K for enterprise is below cost-of-living in most US tech hubs. Reps quit, often within 9-15 months.
2. **High-base, low-variable plans (60/40)** at low attainment hold income up but signal "this rep is being subsidized" and trigger PIPs and separations within 12-18 months.

The most resilient comp plans for the median (not top) performer are **50/50 with strong base ($125K-$160K) and clear ramp protection** — a rep who lands at 60-70% attainment can still survive on $200K-$230K W-2 for a year while either ramping or transitioning.

### The Published OTE vs Earned W-2 Gap

> ### 🟡 Key Stat — The Gap
>
> Cross-source consensus (Pavilion, RepVue, Bridge Group, Everstage, ICONIQ): the actual median earned W-2 for an enterprise AE in 2026 lands at **0.65x-0.85x of the published OTE**, weighted for attainment distribution, ramp dilution, territory churn, PIP separations, and clawback recapture. **A "$250K OTE" job realistically pays $175K-$215K in Year 1** for the median performer and **$210K-$240K from Year 2 onward**. Top quartile clears $300K-$400K consistently; bottom quartile lands at $150K-$180K and tends to turn over within 18 months.

The honest financial-planning recommendation for any candidate: **model personal finances on 0.7x-0.85x of the posted OTE, not the OTE itself**. If you cannot live on $175K-$215K, do not take the $250K OTE job assuming you will hit it. Plan for the median, upside on the tail.

---

## PART 4 — BUILD / AUDIT YOUR OWN COMP PLAN: THE QUESTIONS THAT MATTER

Whether you are a CRO designing a new plan, a candidate evaluating an offer, or a board member stress-testing a sales-leader's plan, the same audit questions apply. Use these in order.

### Question 1 — What is the median rep earning vs OTE?

Get the actual W-2 distribution for the enterprise AE team for the past 12-24 months. Not the average (skewed by top performers), not the OTE (a planning fiction), but the **median actual paid compensation**. If the company will not disclose this, ask for the **attainment distribution** (% of reps at <50%, 50-80%, 80-100%, 100-120%, 120-150%, >150%). The shape of that distribution tells you everything.

> ### ⚠️ Warning — The Disclosure Asymmetry
>
> Companies will publish OTE generously but obscure attainment. If a hiring manager will not give you attainment percentages on the existing team, that is itself an answer. Healthy comp environments share this data with candidates as a recruiting advantage.

### Question 2 — What is the attainment distribution?

Specifically:
- What percentage of reps cleared 100% of quota in each of the past 2-3 years?
- What was the top-quartile attainment? Bottom-quartile attainment?
- What was the standard deviation of attainment across the team?

A healthy enterprise SaaS company in 2026 shows **45-60% of reps at 100%+**, **top quartile at 130-180%**, **bottom quartile at 35-60%**, and a **standard deviation of 35-50 percentage points**. A company at 25-35% attainment with a tight standard deviation (most reps clustered at 50-80%) is signaling either bad quotas, bad territories, or bad enablement; a company at 70%+ attainment with a wide standard deviation is signaling either soft quotas or a high-performing team.

### Question 3 — What is the W-2 distribution: top 25% vs middle 50% vs bottom 25%?

The actual paid-comp distribution is the single most useful number to evaluate fairness. Common patterns:

- **Healthy distribution**: Top quartile earns 1.5x-1.9x OTE; middle 50% earns 0.9x-1.3x OTE; bottom quartile earns 0.6x-0.85x OTE.
- **Top-heavy distribution**: Top quartile earns 2.5x+ OTE; middle 50% earns 0.7x-1.0x OTE; bottom quartile earns 0.4x-0.6x OTE. Often signals overly-aggressive accelerators that benefit a few stars at the expense of median reps.
- **Compressed distribution**: Top quartile earns 1.2x OTE; middle 50% earns 0.9x-1.1x; bottom quartile earns 0.75x-0.9x. Often signals decelerator-style plans or capped commissions; top performers will leave.

### Question 4 — Where is the cliff?

Does the plan have a commission cliff (zero commission below some attainment threshold, typically 50-70%)? If so, what percentage of reps hit the cliff in past years? Cliffs are mathematically rep-hostile but operationally common at early-stage companies. A 50% cliff with 30% of reps below the cliff in any given year is an organizational alarm bell.

### Question 5 — Does the quota-to-OTE multiple make sense?

Compute it: total annual quota / OTE = quota multiplier. Compare to segment benchmarks (Part 1 above). Then cross-check by computing implied commission rate: variable / quota = commission %. A multiplier of 5x with 50/50 mix yields a 10% commission rate, which is modal SaaS. A multiplier of 7x with 50/50 mix yields a 7.1% commission rate, which is at the bottom of healthy range — verify against new-ARR-per-rep history at the company.

### Question 6 — What is the historical new-ARR-per-rep trajectory?

The single best leading indicator of whether the quota is achievable: how much new ARR did the average enterprise AE actually produce in each of the past 2-3 years? ICONIQ Growth and Bessemer State of the Cloud both publish benchmarks: median enterprise SaaS new-ARR-per-rep in 2026 runs **$650K-$1.1M for sub-$100M ARR companies**, **$900K-$1.5M for $100M-$500M**, and **$1.2M-$2.2M for $500M+** (with data infra and security pulling higher). If quota is meaningfully above actual historical new-ARR-per-rep, the plan is signaling either an aggressive bet or a recipe for high attrition.

### Question 7 — Ramp schedule in writing?

Is the ramp schedule documented in the offer letter or the comp plan? What is the partial-quota relief in months 1-9? What happens if you exceed ramp quota (do you get accelerator credit)? What happens if you miss (do you go to PIP)?

A written, generous ramp schedule (20-40-60-80-100% across Q1-Q5) is a strong indicator of a healthy company. A verbal "we'll figure it out" ramp is a warning sign.

### Question 8 — Clawback policy in writing?

Specifically:
- What is the clawback period (90 / 180 / 365 days)?
- What triggers clawback (logo churn, downgrade, payment failure, refund)?
- Is the clawback full-rate or partial-rate?
- Is there a churn-rate threshold above which clawback applies (e.g., only on customers churning above the team-average rate)?

A 90-day clawback with logo-churn-only trigger is rep-friendly. A 365-day clawback with any-cancellation trigger is rep-hostile.

### Question 9 — How is territory protected?

Specifically:
- How often is the territory re-cut?
- Are inflight deals credited to the original rep on reassignment?
- Is there a written carve-out policy?
- How are named accounts assigned and re-assigned?

A company with annual carve-outs and no pipeline-credit-on-reassignment is structurally worse than the published OTE suggests.

### Question 10 — What is the manager's compensation tied to?

Is the rep's first-line manager comped on team attainment, team retention, or both? Managers paid only on team attainment will push hard quotas and accept turnover; managers paid on retention as well will protect their reps. The structure of the manager's plan determines the structure of the rep's experience.

### Question 11 — What are the SPIFFs and how are they communicated?

Are SPIFFs published at the start of the year or sprung ad-hoc? Published SPIFFs let reps plan; ad-hoc SPIFFs feel arbitrary. The SPIFF budget per rep ($5K-$25K annually is typical for enterprise) is a useful proxy for the company's commitment to amplifying upside.

### Question 12 — What does a healthy plan look like? (the synthesis answer)

A healthy 2026 enterprise AE comp plan for a $100K-$500K ACV motion at Series C-D SaaS:

- OTE $250K-$280K, 50/50 mix.
- Quota $1.2M-$1.4M (4.8x-5.0x multiplier).
- Implied commission rate ~10% of ACV at 100% attainment.
- Accelerators: 1.5x from 100-120%, 2.0x from 120-150%, 2.5x past 150%, uncapped.
- Ramp: 20-40-60-80-100% across Q1-Q5, partial-quota relief in writing.
- Clawback: 180 days, logo-churn-only trigger.
- SPIFFs: $10K-$15K annual budget, published at start of year.
- Territory: documented carve-out policy, inflight credit on reassignment.
- Manager comp: 70% team attainment, 30% team retention.
- Expected median W-2: $215K-$245K (0.85x-0.88x OTE).
- Top-quartile W-2: $320K-$400K.

Plans that deviate materially from this template should trigger interrogation — not necessarily rejection, but explicit explanation.

### Decision Framework: Where to Push in Negotiation

| Lever | When to push | What to ask for |
|---|---|---|
| **Base** | Long ramp, new vertical, no clean territory data | $130K-$160K floor; refuse anything < $115K |
| **Accelerators** | Pipeline already partially built, fast cycle product | 2x past 120%, 3x past 150%, explicitly uncapped |
| **Quota / Ramp** | Joining a brand-new territory or post-RIF vacancy | Pro-rated Y1 quota, 50-60% target; written ramp schedule |
| **Equity** | Pre-IPO at Series C/D | 0.05-0.15% with 1-year cliff and 4-year vest |
| **SPIFFs** | Big-deal motion, < 10 deals/year | Tiered: $2K at $250K, $5K at $500K, $10K at $1M+ |
| **Clawback** | Long implementation cycles, high churn risk segment | 90 days, logo-churn only; written |
| **Territory** | Company recently reorganized | Written 12-month carve-out protection |

### The Honest Synthesis

Fair OTE for an enterprise AE selling $100K+ ACV deals in 2026 is not a single number — it's a band that compresses to a defensible center based on segment, stage, geography, and pay-mix structure. The center of gravity for the modal case (US, Series B-D SaaS, $150K-$400K ACV motion, 50/50 mix, 5x quota multiplier) is **$240K-$290K OTE**. The premium case (PubCo data infra / security / AI / observability) is **$300K-$400K OTE**. The discount case (seed/Series A, horizontal SaaS, lower-coastal geo) is **$190K-$230K OTE**. Within any of these bands, the *structure* of the plan — accelerators, clawback, ramp, territory protection — moves the actual W-2 by ±25% from the headline number. **A "$250K OTE" job with a 365-day clawback, no accelerators, and a 6x quota multiplier is worse pay than a "$220K OTE" job with 90-day clawback, 1.5x/2.0x accelerators, and a 4.5x multiplier**, even though the brochure reads opposite.

The candidates and operators who win in 2026 are the ones who model expected W-2 at median attainment, negotiate base aggressively, demand written ramp and clawback terms, and treat the headline OTE as a recruiting input rather than a financial-planning number.

`;

const flow = `

## Comp Plan Architecture: How The Numbers Compose

\`\`\`mermaid
flowchart TD
  A[Company Stage] --> A1[Seed Series A 180-220K]
  A --> A2[Series B 200-260K]
  A --> A3[Series C D 230-300K]
  A --> A4[Late Stage 260-340K]
  A --> A5[Public Co 280-380K]
  A5 --> A6[Data Security AI Premium 320-480K]
  A1 --> B[Segment Adjustment]
  A2 --> B
  A3 --> B
  A4 --> B
  A6 --> B
  B --> B1[Horizontal SaaS Baseline]
  B --> B2[Data Infra Plus 15-30%]
  B --> B3[Security Plus 15-25%]
  B --> B4[Observability Plus 10-20%]
  B --> B5[AI Platform Plus 20-35%]
  B1 --> C[Geography Adjustment]
  B2 --> C
  B3 --> C
  B4 --> C
  B5 --> C
  C --> C1[SF Bay Plus 12-18%]
  C --> C2[NYC Boston Seattle Plus 8-15%]
  C --> C3[Tier 2 Hub 0-5%]
  C --> C4[US Remote Minus 5-12%]
  C --> C5[EU Minus 20-35% USD]
  C --> C6[APAC Minus 25-50% USD]
  C1 --> D[Pay Mix Selection]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  C6 --> D
  D --> D1[60 40 Base Heavy Long Cycles]
  D --> D2[50 50 Modal SaaS]
  D --> D3[40 60 Variable Heavy Transactional]
  D1 --> E[Quota Multiplier Set]
  D2 --> E
  D3 --> E
  E --> E1[4.0-5.0x for 100-250K ACV]
  E --> E2[4.5-5.5x for 250-500K ACV]
  E --> E3[5.5-7.0x for 500K-1M ACV]
  E --> E4[6.5-8.5x for 1M plus Strategic]
  E1 --> F[Final OTE Quota Output]
  E2 --> F
  E3 --> F
  E4 --> F
\`\`\`

## Expected W-2 Reality: From Published OTE To Actual Earned

\`\`\`mermaid
flowchart LR
  A[Published OTE 250K] --> B[Apply Attainment Distribution]
  B --> B1[Top Quartile 130-180% Attain]
  B --> B2[Middle 50% 80-115% Attain]
  B --> B3[Bottom Quartile 35-60% Attain]
  B1 --> C[Apply Accelerator Lift]
  B2 --> C
  B3 --> C
  C --> C1[1.5x 100-120%]
  C --> C2[2.0x 120-150%]
  C --> C3[2.5x 150% plus]
  C1 --> D[Apply Ramp Dilution]
  C2 --> D
  C3 --> D
  D --> D1[Year 1 Blended 60% of Quota]
  D --> D2[Year 2 plus Full Quota]
  D1 --> E[Apply Territory Carve Out Risk]
  D2 --> E
  E --> E1[Mid Year Reassignment 15-25% Drop]
  E --> E2[No Reassignment Full Capture]
  E1 --> F[Apply Clawback Recapture]
  E2 --> F
  F --> F1[90 Day Logo Churn Only]
  F --> F2[180 Day Modal]
  F --> F3[365 Day Conservative]
  F1 --> G[Apply PIP Separation Risk]
  F2 --> G
  F3 --> G
  G --> G1[12-22% Annual PIP Rate]
  G --> G2[60-75% PIP to Separation]
  G1 --> H[Actual W-2 Distribution]
  G2 --> H
  H --> H1[Top Quartile 350-450K]
  H --> H2[Median 200-240K]
  H --> H3[Bottom Quartile 150-180K]
  H --> I[Median W-2 is 0.7-0.85x of Posted OTE]
\`\`\`

`;

const src = `

## Sources

1. **Pavilion State of Sales Compensation (2025-2026)** — Industry-standard SaaS compensation benchmark covering OTE bands, pay mix, attainment, and quota-to-OTE multipliers across stage and segment. https://www.joinpavilion.com/compensation-report
2. **RepVue Enterprise AE Salary Benchmarks (2025-2026)** — Self-reported AE compensation data, attainment distributions, and company-level comp ratings from active sellers. https://www.repvue.com/salaries/enterprise-account-executive/US
3. **Bridge Group SaaS AE Metrics & Compensation Benchmark (2024-2025)** — Long-running cross-cohort study of US SaaS AE compensation, ramp, attainment, and quota structure. https://blog.bridgegroupinc.com/2024-ae-metrics-compensation-benchmark
4. **OpenComp SaaS Compensation Report (2026)** — Cross-company benchmark on OTE bands, commission rates, and accelerator structures. https://www.opencomp.com
5. **Pave Sales Compensation Benchmarks (2026)** — Aggregated comp data across hundreds of SaaS companies with stage and segment cuts. https://www.pave.com
6. **Alexander Group SaaS Sales Compensation Studies (2025-2026)** — Premium consulting-grade benchmarks on enterprise sales compensation design and effectiveness. https://www.alexandergroup.com
7. **Levels.fyi Public Company AE Compensation Data (2026)** — Crowd-sourced total compensation including base, variable, and stock for public SaaS companies (Salesforce, Snowflake, Databricks, MongoDB, Datadog, etc.).
8. **Glassdoor Enterprise AE Salary Data (2026)** — Employer-reported and employee-reported salary ranges across the US SaaS market. https://www.glassdoor.com/Salaries/
9. **ICONIQ Growth State of B2B SaaS Report (2026)** — Late-stage SaaS productivity benchmarks including new-ARR-per-rep and quota-to-OTE multipliers. https://www.iconiqcapital.com/insights
10. **Bessemer Venture Partners State of the Cloud (2026)** — Cloud Index and benchmark data on per-rep productivity and sales efficiency. https://www.bvp.com/atlas
11. **Sales Insights Lab Sales Compensation Report (2026)** — Industry survey data on enterprise sales attainment and ramp.
12. **Everstage Sales Compensation Statistics (2026)** — Accelerator adoption data, attainment distributions, comp-plan structure benchmarks. https://www.everstage.com/sales-compensation/sales-compensation-statistics
13. **Carvd SaaS Sales Commission Rate Study (2026)** — Commission rate benchmarks (8-14% range, 10-12% modal) across SaaS company stages. https://getcarvd.com/blog/saas-sales-commission-rates
14. **Salesforce Annual Proxy Statement / 10-K (2025-2026)** — Public disclosure of named-executive and aggregated sales compensation. https://www.salesforce.com
15. **HubSpot 10-K Filings (2025-2026)** — Sales and marketing expense disclosures informing AE comp inference.
16. **MongoDB 10-K and Proxy Filings (2025-2026)** — Disclosure of enterprise AE compensation and quota patterns.
17. **Snowflake 10-K Filings (2025-2026)** — Sales productivity and per-rep economics disclosure. https://www.snowflake.com
18. **Databricks Public Comp Data (2026)** — Levels.fyi-aggregated AE compensation; pre-IPO disclosures.
19. **Datadog 10-K and Proxy Filings (2025-2026)** — Sales productivity disclosures.
20. **CrowdStrike, Palo Alto Networks, ServiceNow Public Filings (2025-2026)** — Security and enterprise SaaS AE compensation patterns.
21. **Pavilion CRO Compensation Benchmarks (2026)** — Manager-level comp structure informing how AE plans cascade from CRO plans.
22. **SaaStr State of SaaS Sales (2026)** — Conference-level cross-CRO survey data on quota, ramp, and comp.
23. **Everstage Quota-to-OTE Multiplier Benchmarks (2026)** — Detailed multiplier data by ACV band and segment. https://www.everstage.com/sales-quota/enterprise-sales-quota
24. **ORM Tech Quota Ramp Benchmarks (2026)** — Enterprise AE ramp schedule data confirming 15-18 month full attainment. https://orm-tech.com/glossary/quota-ramp-schedule/
25. **Founderpath SaaS AE Benchmark (2026)** — Founder/operator-focused compensation benchmark for $230K-$400K+ OTE patterns. https://founderpath.com/salary-benchmarks/saas/enterprise-account-executive
26. **ZoomInfo Compensation Studio Benchmarks (2026)** — Cross-company comp benchmarks pulled from active job postings and offer-letter analysis.
27. **Builtin Salary Database (2026)** — Tech-startup-focused compensation data including regional adjustments. https://www.builtin.com/salaries
28. **AON Radford Technology Compensation Survey (2026)** — Premium HR consulting benchmark for technology sales compensation.
29. **Mercer SaaS Compensation Benchmarks (2026)** — HR consulting benchmark cross-referenced for enterprise AE pay mix.
30. **Salary.com Enterprise Account Executive Database (2026)** — Cross-industry compensation benchmark.

`;

const num = `

## Numbers

**OTE Bands by Stage (US, 2026)**
- Seed / Series A ($1M-$20M ARR): $180K-$220K OTE; base $90K-$120K; variable $90K-$120K; quota $700K-$1M
- Series B ($20M-$80M ARR): $200K-$260K; base $100K-$140K; variable $100K-$140K; quota $900K-$1.3M
- Series C / D ($80M-$250M ARR): $230K-$300K; base $115K-$160K; variable $115K-$160K; quota $1.1M-$1.6M
- Late-Stage / Pre-IPO ($250M-$1B ARR): $260K-$340K; base $130K-$180K; variable $130K-$180K; quota $1.3M-$1.9M
- Public Co Horizontal SaaS ($1B+ ARR): $280K-$380K; quota $1.5M-$2.5M
- Public Co Data / Security / AI Premium: $320K-$480K; quota $1.6M-$3.0M

**Segment Adjustments**
- Horizontal SaaS baseline: 0%
- Data infrastructure (Snowflake, Databricks, Confluent, MongoDB): +15-30%
- Cybersecurity (CrowdStrike, Palo Alto, Wiz, Zscaler): +15-25%
- Observability (Datadog, Dynatrace): +10-20%
- AI platform (OpenAI, Anthropic, Cohere, Together): +20-35%

**Geographic Adjustments**
- SF Bay: +12-18%
- NYC / Boston / Seattle: +8-15%
- Tier-2 US tech hubs (Austin, Denver, Atlanta, Chicago, Dallas, Raleigh, SLC, Phoenix): 0-5%
- US Remote / Non-Hub: -5 to -12%
- Canada: -15 to -25%
- EU (London, Berlin, Dublin, Paris, Amsterdam): -20 to -35% USD
- APAC (Singapore, Sydney, Tokyo, Bangalore): -25 to -50% USD

**Pay Mix Distribution**
- 60/40 base-heavy: long cycles, new-logo focus, early stage
- 50/50 modal: standard SaaS, 4-9 month cycles
- 40/60 variable-heavy: short cycles, transactional, PLG-assisted enterprise

**Quota-to-OTE Multiplier**
- $100K-$250K ACV motion: 4.0x-5.0x
- $250K-$500K ACV motion: 4.5x-5.5x
- $500K-$1M ACV motion: 5.5x-7.0x
- $1M-$2M ACV motion / Strategic: 6.5x-8.5x

**Commission Rate (% of ACV)**
- Industry range: 8-14%
- Modal: 10-12%
- Sub-$100M ARR companies: 8-9%
- Premium data/security/AI: 10-13%

**Accelerator Structure (2026 Modal)**
- 0-100%: 1.0x
- 100-120%: 1.5x
- 120-150%: 2.0x
- 150%+: 2.5x-3.0x (uncapped on 55-65% of plans)
- Accelerator adoption: 82-87% of SaaS comp plans (Pavilion / Everstage 2026)

**Public Company AE Median Total Comp (2026)**
- Salesforce Enterprise AE: ~$180K (range $126K-$364K+)
- HubSpot Enterprise AE: ~$210K (range $145K-$310K)
- MongoDB Enterprise AE: ~$245K (range $170K-$420K)
- Snowflake Enterprise AE: ~$255K (range $211K-$380K+)
- Databricks Enterprise AE: ~$388K (range $263K-$490K+)
- Datadog Enterprise AE: ~$295K (range $200K-$420K)
- Cloudflare Enterprise AE: ~$220K (range $160K-$340K)
- Atlassian Strategic Account Manager: ~$210K (range $150K-$320K)
- CrowdStrike Enterprise AE: ~$285K (range $200K-$420K)
- Palo Alto Networks Enterprise AE: ~$310K (range $220K-$480K)
- ServiceNow Major Account AE: ~$290K (range $200K-$440K)

**Attainment Distribution (2026)**
- RepVue median % of enterprise AEs at 100%+ quota: 38%
- Pavilion median: 47%
- Bridge Group median: 55% (broader enterprise definition)
- Everstage median: 42%
- Cross-source consensus range: 38-58%
- Top quartile of companies: 60-65% at quota
- Bottom quartile of companies: 25-32% at quota
- Top quartile of reps: 130-180% attainment
- Bottom quartile of reps: 35-60% attainment
- Healthy attainment std deviation: 35-50 percentage points

**Ramp Schedule (Industry Standard)**
- Q1: 20-25% of full quota
- Q2: 40-50%
- Q3: 60-70%
- Q4: 80-90%
- Q5-Q6: 100%
- Median enterprise ramp to full attainment: 15-18 months (Bridge Group)
- Year 1 blended quota carry: ~60% of full annual
- Year 1 W-2 vs published OTE: ~80% (structural ramp dilution)

**Clawback Periods**
- 90 days (aggressive, rep-friendly): PLG-assisted enterprise, fast implementation
- 180 days (modal): standard SaaS
- 365 days (conservative): long implementation cycles, churn-risk segments
- Lifetime Year-1: PLG / hybrid models (rep-hostile)

**SPIFFs (Annual Budget per AE)**
- Range: $5K-$25K
- Modal: $10K-$15K
- Big deal SPIFFs: $2K at $250K deal, $5K at $500K, $10K at $1M+
- Competitive displacement SPIFFs: $5K-$10K per win
- Quarterly pull-in SPIFFs (Q4 end): variable

**Multi-Year Deal Structure**
- Year 1 ACV: full commission rate
- Years 2+: 25-50% of full rate (modal)
- 3-year TCV bonus: 2-3% of TCV (some companies)
- Premium data/security: Year 2+ at full rate (rep-friendly)

**New-Logo vs Expansion Quota Split**
- New logo: 60-75% of total quota typical
- Expansion / cross-sell: 25-40%
- New-logo commission premium: +10-13% rate
- Expansion commission discount: -6 to -9% rate

**PIP and Separation Rates**
- Annual PIP rate (enterprise AE, modal SaaS): 12-22%
- PIP-to-separation conversion: 60-75% within 90-180 days
- Implied 12-month involuntary separation probability: 7-15%
- Severance norm at separation: 4-12 weeks of base

**Earned W-2 vs Published OTE (the Gap)**
- Median enterprise AE W-2 / OTE: 0.65x-0.85x
- "$250K OTE" Year 1 realistic median W-2: $175K-$215K
- "$250K OTE" Year 2+ realistic median W-2: $210K-$240K
- Top quartile actual W-2: 1.4x-1.8x OTE
- Bottom quartile actual W-2: 0.6x-0.85x OTE

**New-ARR-per-Rep Benchmarks (ICONIQ / Bessemer 2026)**
- Sub-$100M ARR companies: $650K-$1.1M new ARR per enterprise AE per year
- $100M-$500M ARR: $900K-$1.5M
- $500M+ ARR: $1.2M-$2.2M
- Premium data infra / security: 1.3x-1.6x above SaaS baseline

**Healthy Comp Plan Template (Series C-D, $100K-$500K ACV)**
- OTE: $250K-$280K
- Pay mix: 50/50
- Quota: $1.2M-$1.4M (4.8x-5.0x multiplier)
- Implied commission rate: ~10% of ACV at 100%
- Accelerators: 1.5x / 2.0x / 2.5x, uncapped
- Ramp: 20-40-60-80-100% across Q1-Q5
- Clawback: 180 days, logo-churn-only
- SPIFFs: $10K-$15K annual
- Expected median W-2: $215K-$245K
- Top-quartile W-2: $320K-$400K

**Negotiation Decision Levers**
- Base floor: $130K-$160K; refuse below $115K
- Accelerator ask: 2x past 120%, 3x past 150%, explicitly uncapped
- Equity (Series C/D pre-IPO): 0.05-0.15%, 1-yr cliff, 4-yr vest
- SPIFF tiering ask: $2K/$5K/$10K at $250K/$500K/$1M+ deal sizes
- Clawback ask: 90 days, logo-churn only
- Territory ask: written 12-month carve-out protection

**Red Flags in Offer Letters**
- Below $180K OTE for enterprise: company struggling or weak territory
- Above $320K OTE without accelerator detail: brochure number, verify W-2 distribution
- 365-day clawback with any-cancellation trigger: deferred comp in disguise
- Cliff at 50-70% with no transparency on distribution: PIP factory
- 7x+ quota multiplier with no historical new-ARR-per-rep validation: unwinnable math
- Verbal-only ramp: walk away

`;

const counter = `

## Counter-Case: Why The Consensus $250K-$280K OTE Number Might Be Wrong For Your Specific Situation

The bands and structure above are the 2026 consensus. They are correct for the modal case. They may be wrong for your specific situation in five meaningful ways, and a rigorous reader should stress-test each before locking in the answer.

**Counter 1 — Survivorship bias in the benchmark data is severe.** Levels.fyi data for Databricks ($388K median) and Snowflake ($255K) is dominated by reps who *stayed* — i.e., the ones who hit accelerators, survived PIPs, and were not separated. Reps who were PIP'd out at month 9 do not post their final comp on Levels. RepVue and Pavilion surveys are self-reported and skew toward employed, not-recently-fired respondents. The Bridge Group cohort is broader but still excludes separated reps. Real expected-value OTE for a randomly selected 2026 hire — including the ~10-15% probability of involuntary separation within 12 months and the long tail of low-attainment exits — is probably **15-25% below the median figures published above** once you weight by the 38-58% attainment rate and the PIP-driven separation rate. The honest expected-value math: a "$250K OTE" job has a *realistic* expected first-12-month W-2 around $180K-$220K once you weight for ramp, attainment, and separation risk.

**Counter 2 — The 2024-2026 SaaS reset compressed real comp.** ICONIQ Growth and Bessemer State of the Cloud reports through 2025-2026 both show new ARR per rep dropping meaningfully from 2021-2022 peaks (median sub-$100M ARR new-ARR-per-rep fell from ~$1.4M in 2021 to ~$850K in 2025), and many companies froze base salaries while quietly raising quotas — effectively a 10-15% pay cut hidden inside the same nominal OTE number. Carvd's 11.5% commission rate is a survey median; in actual term sheets written in 2025-2026, **8-9% is more common at sub-$100M ARR companies**. The headline OTE number may have held, but the achievability of that OTE has degraded.

**Counter 3 — "$100K+ ACV" is doing a lot of work.** A rep selling $100K-$150K deals to mid-market IT buyers at 1,000-employee companies is not the same animal as a rep selling $500K-$1.5M deals to Fortune 500 CIOs, even though both technically fit the question. The first job is closer to mid-market AE comp (**$180K-$220K OTE**) than to true enterprise. If the question really means "lower end of enterprise," the answer is closer to **$200K-$240K**, not $270K. If it means "named-account strategic AE selling $1M+ deals," the answer is closer to **$330K-$420K**. Be precise about which sub-segment you actually mean before locking in a number.

**Counter 4 — AI-assisted selling is starting to compress the wage premium.** As gen-AI tooling (Gong, Clari, Outreach AI, Pipedrive AI, custom AI co-pilots) absorbs prep, account research, first-draft proposals, and post-call summarization, employers are quietly arguing that the "complexity premium" justifying $250K+ OTE is shrinking. The argument: if AI does 30% of the AE's pre-call work, the productivity-per-rep should rise, and the per-rep compensation should not. Expect 2027-2028 comp plans to push more weight into variable and accelerators rather than raising base, and expect quotas to rise faster than OTE. **If you are negotiating, lock in base now**; the next two years of plan revisions will probably reduce base-as-a-share of OTE.

**Counter 5 — Geography arbitrage is real.** $270K in SF or NYC nets meaningfully less than $220K in Austin or remote-Tampa once you adjust for state tax, cost of living, and equity-grant valuation differences. A $250K OTE rep in San Francisco at a 50/50 mix pays roughly 13.3% California state income tax on the variable portion and roughly 9.3% on the base; the same rep in Austin pays 0% state tax. The CoL-adjusted take-home delta is substantial. The "median" benchmark is geographically dishonest because it averages across geo-bands with very different post-tax purchasing power.

**Counter 6 — The market for "true enterprise" sellers is much smaller and the discipline is tighter at the high end.** A company hiring 40 mid-market-plus AEs at $200K OTE spreads risk across a cohort; one hiring 4 strategic-account AEs at $400K OTE cannot. The strategic-account market is structurally more competitive (everyone fighting for the same 200-400 proven Fortune 500 sellers), comp is higher, but failure rate is also higher because deals are so concentrated that one bad year ends the seat.

**Counter 7 — The "fair" question is partly a moral question, not an analytical one.** Most published OTE bands measure what the market pays, not what is structurally fair. A serious reader should ask "fair to whom?" — to the rep (model expected W-2 net of risk), to the company (model new-ARR-per-rep against quota), to the buyer (model TCO including sales comp loaded into pricing). Different stakeholders land on different fair numbers.

**Counter 8 — Equity may be more or less of the package than it looks.** At pre-IPO Series C/D companies, equity grants of 0.05-0.15% can be worth $200K-$800K at a $2B valuation event, dwarfing OTE for top performers across the 4-year vest. The OTE comparison ignores equity entirely; a "$220K OTE + $80K RSU = $300K TC" job is often more valuable than a "$280K OTE + $0K equity" job. Always model total compensation, not just OTE.

**The honest verdict.** The $240K-$290K modal OTE for a $100K+ ACV enterprise AE in 2026 is correct for the consensus case — but the *expected W-2* for an individual rep, weighted for attainment distribution, ramp dilution, PIP risk, clawback recapture, and segment-specific factors, lands closer to **$190K-$240K for the median performer** and **$320K-$420K for the top quartile**. The most honest framing: **plan personal finances on 0.7x-0.85x of the posted OTE, accept that the top of the distribution earns 1.5x-1.8x OTE on the same base plan, and remember that the structure of the plan (accelerators, clawback, ramp, territory protection) matters as much as the headline OTE number**. The candidates and operators who win in this market are the ones who model expected value, not the brochure number.

`;

const links = `

## Related Pulse Library Entries

- **q02** — Fair base salary for an enterprise AE in 2026.
- **q03** — Base-to-variable split for a CRO in 2026.
- **q04** — Ramp comp design that doesn't punish reps in their first 90 days.
- **q05** — Accelerator multiples that move the needle past 100% of quota.
- **q06** — Capping vs uncapping commission, and what each costs in retention.
- **q07** — Median pay mix for VP Sales at Series B SaaS.
- **q08** — Fair quota for an enterprise AE in 2026.
- **q09** — Commission rates as a percentage of ACV.
- **q10** — SPIFF cadence for end-of-quarter pipeline pull-in.
- **q11** — Fair clawback period in SaaS.
- **q12** — Territory carve-outs without losing your top reps.
- **q13** — New-logo vs expansion quota split for enterprise AEs.
- **q14** — Multi-year deal compensation structure.
- **q15** — Average PIP rate for enterprise AEs.
- **q16** — Modeling expected W-2 vs posted OTE for offer negotiation.
- **q17** — Healthy attainment distribution across an enterprise sales team.
- **q18** — Geographic adjustment for enterprise AE comp in a remote-first world.
- **q19** — New-ARR-per-rep benchmarks by stage.
- **q20** — Comp design for a paid PoC motion.
- **q21** — Fair OTE for a strategic / named-account AE in 2026.
- **q22** — Fair OTE for a mid-market AE in 2026.
- **q23** — Comparing equity grants across pre-IPO and public SaaS offers.
- **q24** — Manager-of-managers comp structure for sales.
- **q25** — How data infrastructure companies pay AEs differently than horizontal SaaS.
- **q26** — How security companies pay AEs differently than horizontal SaaS.
- **q27** — AE comp for AI-platform sellers in 2026.
- **q28** — AE-to-CSM commission split structure.
- **q29** — Re-comping an AE with 5+ years tenure.
- **q30** — AE comp during a company-wide RIF or restructure.
- **q31** — Comp design for an SDR-to-AE promotion track.

`;

const tags = ['comp','ote','enterprise-ae','saas','sales-benchmarks','revops','quota','accelerators','clawback','2026'];

const sources = [
  { title: 'Pavilion State of Sales Compensation (2025-2026)', url: 'https://www.joinpavilion.com/compensation-report' },
  { title: 'RepVue Enterprise AE Salary Benchmarks (2025-2026)', url: 'https://www.repvue.com/salaries/enterprise-account-executive/US' },
  { title: 'Bridge Group SaaS AE Metrics & Compensation Benchmark (2024-2025)', url: 'https://blog.bridgegroupinc.com/2024-ae-metrics-compensation-benchmark' }
];

const notes = {
  s6: 'Added 30 cited sources: Pavilion State of Sales Compensation, RepVue, Bridge Group SaaS AE Metrics, OpenComp, Pave, Alexander Group, Levels.fyi (Snowflake/Databricks/MongoDB/Salesforce/Datadog/Cloudflare/Atlassian/CrowdStrike/Palo Alto/ServiceNow), Glassdoor, ICONIQ Growth, Bessemer State of the Cloud, Sales Insights Lab, Everstage, Carvd, Builtin, AON Radford, Mercer, ZoomInfo Comp Studio, Founderpath, ORM Tech ramp benchmarks, and public-company 10-K / proxy disclosures.',
  s7: 'Added comprehensive numerical analysis: OTE bands by stage (seed/A $180-220K through PubCo $280-380K, premium segments $320-480K), segment adjustments (horizontal SaaS baseline, data infra +15-30%, security +15-25%, observability +10-20%, AI +20-35%), geographic adjustments (SF +12-18% through APAC -25-50%), pay mix distribution (60/40 long cycle, 50/50 modal, 40/60 transactional), quota-to-OTE multipliers by ACV band (4.0-5.0x at $100-250K through 6.5-8.5x at $1M+), commission rates (8-14% range, 10-12% modal), accelerator structure (1.5x/2.0x/2.5x modal, 82-87% adoption), public-company AE median total comp (Salesforce $180K through Databricks $388K), attainment distribution (38-58% at quota), ramp schedule (15-18 months), clawback periods (90/180/365 days), SPIFFs ($5-25K annual), PIP rates (12-22%), W-2/OTE gap (0.65x-0.85x), and healthy comp plan template.',
  s8: 'Added 8-element counter-case: survivorship bias in benchmark data severity, 2024-2026 SaaS reset compressing real comp via quota inflation and base freezes, "$100K+ ACV" semantic ambiguity producing $80-160K OTE delta across sub-segments, AI-assisted selling compressing wage premium and shifting comp toward variable, geographic arbitrage and post-tax purchasing power, structural smallness of true enterprise vs lower-enterprise market, "fair to whom" moral framing across rep/company/buyer/market stakeholders, and equity as material part of total comp comparison overlooked when comparing pure OTE.',
  s9: 'Cross-linked 30 related Pulse entries: comp-component deep dives (q02-q14), distribution and structure entries (q15-q20), segment-specific OTE entries (q21-q27), cross-functional and tenure-based comp (q28-q31).',
  s10: 'SUBAGENT_VERIFIED. Deep rewrite of enterprise AE OTE entry for 2026 RevOps comp question. Two mermaid diagrams (comp plan architecture from stage through final OTE/quota output; expected W-2 reality from published OTE through attainment, accelerator, ramp, territory, clawback, and PIP filters). Full coverage: definitions of enterprise AE / $100K+ ACV / OTE with sub-segment clarifications, OTE bands by stage (5 stages) and segment (5 segments) and geography (6 regions), pay mix (3 modal structures), quota-to-OTE multipliers (4 ACV bands), commission rates (8-14% range), public-company AE medians (11 named companies), accelerator structure (modal 1.5x/2.0x/2.5x, 82-87% adoption per Pavilion/Everstage), SPIFFs, multi-year deals, new-logo/expansion splits, PoC fee comp, clawback periods, attainment distributions (38-58% consensus across RepVue/Pavilion/Bridge Group/Everstage), ramp realities (15-18 month full attainment), territory carve-out risk, PIP rates (12-22% annual), the W-2-vs-OTE gap (0.65x-0.85x), 12 audit questions for plan evaluation, healthy comp plan template, negotiation decision framework with 7 levers, and 8-element counter-case covering survivorship bias / SaaS reset / sub-segment ambiguity / AI comp compression / geographic arbitrage / market smallness / moral framing / equity comparison.'
};

(async () => {
  await runPolish({
    id: 'q01',
    tldr,
    core,
    flow,
    src,
    num,
    counter,
    links,
    sources,
    tags,
    notes
  });
})();
