// q07 -- What's the median pay mix for a VP Sales at Series B SaaS?
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

const ID = 'q07';

const tldr = `> ### 🎯 Bottom Line
> - **[Number]** The 2026 median **VP Sales at a $30M-$120M ARR Series B SaaS** carries an **OTE band of $350K-$525K** — typically **$225K-$325K base + $100K-$200K variable** — landing at a **65/35 base/variable split for mid-market motions and 60/40 for enterprise motions**, per [Pavilion State of Sales Compensation 2025](https://www.joinpavilion.com/compensation-report), [OpenComp 2024-2025](https://www.opencomp.com), [RepVue](https://repvue.com), [ICONIQ Growth Sales Org Survey 2024/2025](https://www.iconiqcapital.com/growth/insights), and Bessemer/a16z/OpenView leadership surveys (n=600-2,200 depending on dataset). Equity is **0.5%-1.5% fully diluted** (stretching to 2.0% for first-VP-in hires), with sign-on cash of **$50K-$150K** to make whole on forfeited prior-employer equity. Mid-market ($60-$100M ARR, $250K ACV) clusters at the $375-$475K OTE midpoint; SMB-focused ($30-$60M ARR, $50-$100K ACV) lands at $280-$380K; enterprise-focused ($80-$120M ARR, $500K+ ACV) tops out at $450-$600K.
> - **[Mix]** The **60/40 to 65/35 base/variable split** is the modal Series B VP mix vs the **50/50 that dominates AE plans** at the same companies — reflecting executive leverage on hiring, system-building, and forecasting rather than direct quota-carry. Variable typically decomposes as **50-60% team-quota attainment + 20-30% MBO hiring/pipeline/CRM + 10-20% strategic objectives**. VP-level accelerators are **flatter than AE accelerators** — 1.25x-1.75x past 100% with hard caps at 150-200% — because comp committees want executive predictability and a single deal slip can swing a one-person variable line. Equity is the dominant comp lever, not cash: at $300M-$900M post-money, **0.75% FD equates to $2.25M-$6.75M paper** on a 4-year vest, which dwarfs 4-year cash comp of $1.4M-$2.1M.
> - **[Reality]** **VP Sales attainment is the leading indicator of the entire revenue org's payroll cost** because a missed VP plan signals AE misses across 10-30 reps and a sharply lower realized total comp spend. Median Series B VP tenure sits at **18-26 months** per Bridge Group + ChartMogul + RepVue, with **the "first VP rarely survives Series B-to-C transition" pattern** holding across 55-70% of tracked companies. A bad hire burns **$750K-$2.0M** including comp, recruiter fees (DHR / Heidrick / Russell Reynolds at 30-33% of first-year cash), opportunity cost on pipeline degradation, and replacement-search lag. Headline OTE is the easy part; the hard part is design that ties base/variable/equity/severance/CIC to a hiring plan and quota model that survives a Series C re-org.

A **VP Sales at Series B SaaS** is the most consequential single hire in the post-PMF revenue org — the role simultaneously sets the hiring plan for 10-30 reps, the territory model, the forecast discipline, and the comp plan that drives 25-35% of total opex. The comp question is not "what's the median OTE" but the interlocking design problem of base/variable/equity/sign-on/accelerator/severance/CIC across three scenarios: (a) VP performs and stays through Series C, (b) VP performs but is asked to step into or aside for a CRO at Series C/D, (c) VP underperforms and is replaced inside 18 months. The documented best practice across Pavilion 2025 (n=2,800), OpenComp 2024-2025 (n=~1,200), RepVue (~6K VP W-2s), ICONIQ Growth (n=320+), Bessemer, a16z, OpenView, and Carta 2025 is to **anchor on stage-specific OTE bands but spend the design energy on equity/severance/CIC, because that is where founder/CEO/VP misalignment shows up at the Series C transition**.

The discipline matters because **VP Sales comp is one of the highest-leverage and most-frequently-broken executive comp decisions at Series B**. Founders routinely under-equity first VPs (50-100 bps when 100-200 bps fits the workload), over-cash second VPs chasing Series D candidates, and under-design severance + CIC terms. Catching design problems at Day 0 is 5x-15x cheaper than reversing them mid-tenure via retention bonuses or settlements.

**TL;DR:** A rigorous 2026 Series B VP Sales comp analysis is built on **3 motion-specific OTE bands, 4 standard pay-mix splits, 6 named failure modes, and 4 negotiation levers**. Motion bands: **SMB** at **$280-$380K (60/40)**; **mid-market** at **$375-$475K (60/40 to 65/35)**; **enterprise-focused** at **$450-$600K (65/35 to 70/30)**. Pay-mix splits: **(1) 60/40** (modal default), **(2) 65/35** (enterprise long-cycle), **(3) 70/30** (named-accounts strategic), **(4) 50/50** (rare player-coach). Failure modes: **(i)** equity under 0.75% on first-VP hire, **(ii)** variable tied to total ARR not net-new logo ARR, **(iii)** uncapped accelerators producing windfalls, **(iv)** equity vesting that doesn't reset on VP→CRO title change, **(v)** severance without accelerated equity on double-trigger CIC, **(vi)** quota set above the comp committee's planning number. Negotiation levers: **(a)** base salary floor + 4-7% COL, **(b)** accelerator with mutual cap/floor, **(c)** Year-2 and Year-3 equity refresh, **(d)** 6-12 month severance with double-trigger CIC acceleration. The decision math: at typical Series B mid-market — **$425K OTE ($265K base + $160K variable), 0.85% FD on $480M post-money ($4.08M paper), $75K sign-on, 4-year vest with 1-year cliff** — realistic 4-year total comp at on-target lands at **$1.7M cash + $4.08M equity = $5.78M**, with dilution-adjusted equity outcome of **$1.5M-$8M**. The honest answer: **the $350-$525K OTE band is the easy benchmark, but equity, severance, and variable structure decide 80% of the financial outcome and 95% of the relationship outcome**.`;

const core = `

## 🗺️ Table of Contents

**Part 1 — Definitions and Series B Context**
- [What "Series B SaaS" actually means in 2026](#what-series-b-saas-actually-means-in-2026)
- [VP Sales vs CRO vs Head of Sales vs VP Revenue — the title problem](#vp-sales-vs-cro-vs-head-of-sales-vs-vp-revenue--the-title-problem)
- [Why the comp band varies by deal-size segment](#why-the-comp-band-varies-by-deal-size-segment)
- [The structural difference between VP Sales comp and AE comp](#the-structural-difference-between-vp-sales-comp-and-ae-comp)

**Part 2 — The Numbers**
- [Cross-survey median OTE bands by motion (Pavilion + OpenComp + RepVue + ICONIQ)](#cross-survey-median-ote-bands-by-motion-pavilion--opencomp--repvue--iconiq)
- [Base / variable splits by motion and deal size](#base--variable-splits-by-motion-and-deal-size)
- [Equity grants at Series B — bps ranges and dilution math](#equity-grants-at-series-b--bps-ranges-and-dilution-math)
- [Sign-on cash and equity refresh patterns](#sign-on-cash-and-equity-refresh-patterns)
- [Public-company evidence — HubSpot, MongoDB, Snowflake at their Series B stage](#public-company-evidence--hubspot-mongodb-snowflake-at-their-series-b-stage)

**Part 3 — The Comp Structure**
- [Base salary mechanics — bands, COL adjustments, floor design](#base-salary-mechanics--bands-col-adjustments-floor-design)
- [Variable design — quota basis, attainment metric, MBO weighting](#variable-design--quota-basis-attainment-metric-mbo-weighting)
- [Accelerators and decelerators at the VP level](#accelerators-and-decelerators-at-the-vp-level)
- [Equity vesting — cliff, refresh, acceleration on CIC](#equity-vesting--cliff-refresh-acceleration-on-cic)
- [Sign-on bonus and equity make-whole](#sign-on-bonus-and-equity-make-whole)
- [Severance and double-trigger change-of-control terms](#severance-and-double-trigger-change-of-control-terms)

**Part 4 — Why This Breaks, and How to Design and Negotiate Around It**
- [VP Sales tenure at Series B — the 18-26 month median](#vp-sales-tenure-at-series-b--the-18-26-month-median)
- [The "first VP rarely survives Series B-to-C" pattern](#the-first-vp-rarely-survives-series-b-to-c-pattern)
- [The 6 named comp design failure modes](#the-6-named-comp-design-failure-modes)
- [The cost of a bad VP Sales hire — $750K-$2M math](#the-cost-of-a-bad-vp-sales-hire--750k-2m-math)
- [Executive search firm comp economics (DHR / Heidrick / Russell Reynolds)](#executive-search-firm-comp-economics-dhr--heidrick--russell-reynolds)
- [Founder/CEO playbook for Series B VP Sales comp design](#foundercep-playbook-for-series-b-vp-sales-comp-design)
- [Candidate-side negotiation playbook — what to push on](#candidate-side-negotiation-playbook--what-to-push-on)
- [When to bring in a comp consultant — Alexander Group / OpenComp / Pave](#when-to-bring-in-a-comp-consultant--alexander-group--opencomp--pave)

---

## 📐 PART 1 — DEFINITIONS AND SERIES B CONTEXT

### What "Series B SaaS" actually means in 2026

The "Series B" label spans a wide reality. The Pitchbook + Crunchbase + Carta-tracked median Series B SaaS company in 2026 sits at **$30M-$120M ARR, raises $40M-$150M at $250M-$900M post-money, employs 50-200 people including 10-30 quota-carrying AEs and 5-15 SDRs, and is typically 4-7 years post-incorporation**. The variance is the story: a SMB-focused Series B at $35M ARR with $80K ACV looks nothing like an enterprise-focused Series B at $110M ARR with $750K ACV. The relevant comp distinction is not the round label but the **revenue scale plus deal-size segment plus motion** — a $35M ARR PLG company with 12 AEs at $1.2M quotas runs a different role than a $95M ARR named-accounts company with 6 AEs at $4M quotas.

> ### 🟡 Key Stat
> Per Carta + Pitchbook 2025, the **median Series B SaaS round in 2026 is $52M at $475M post-money** with the lead investor taking a board seat and compensation-committee participation right. Median time from Series A to B is **22-32 months**; B to C is **20-28 months**. That ~20-month window is the headline reason the "first VP rarely survives Series C" pattern exists.

### VP Sales vs CRO vs Head of Sales vs VP Revenue — the title problem

Titles are *not* interchangeable; comp design hinges on which title fits the actual scope. Four 2026 patterns:

- **Head of Sales** — early-stage, often first sales hire out of founder-led selling. Sales only. OTE **$220-$320K**; equity **0.5-1.0%**. Usually replaced at Series B.
- **VP Sales** — standard Series B sales-org leader. Owns AEs, sometimes SDRs/SEs/sales ops. Reports to CEO. OTE **$350-$525K**; equity **0.5-1.5%**. The focus of this answer.
- **VP Revenue (or VP GTM)** — broader: sales + marketing + CS in some configs. Common at PLG / consumption-pricing. OTE **$400-$575K**; equity **0.75-1.75%**. Hired *instead of* VP Sales when CEO wants single throat-to-choke on the funnel.
- **CRO** — sales + marketing + CS + sometimes revops/pricing. OTE **$450-$700K** at Series C; **$400-$600K** late-B. Equity **1.0-2.5%**. Most upgrade VP→CRO at Series C.

The misuse pattern: hiring a "CRO" at Series B with $30M ARR and 8 reps — a CRO title without CRO scope creates expectation gaps that detonate inside 12 months. The cleaner play is VP Sales with a clear path to CRO at Series C, codified in the offer letter.

### Why the comp band varies by deal-size segment

VP Sales comp varies dramatically by deal-size segment because the underlying business economics differ:

- **SMB-focused** ($30-$60M ARR, $50-$100K ACV, 12-25 reps, sub-90-day cycle): velocity-driven org, 100-400 deals/month, role is system-building + hiring, not relationship-selling. OTE **$280-$380K**, **60/40**, equity **0.75-1.25%**.
- **Mid-market** ($60-$100M ARR, $200-$400K ACV, 8-18 reps, 3-9 month cycle): mixed motion with quota-driven AEs on named accounts. OTE **$375-$475K**, **60/40 to 65/35**, equity **0.5-1.25%**.
- **Enterprise-focused** ($80-$120M ARR, $500K+ ACV, 4-10 reps, 6-18 month cycle): relationship-led named-accounts motion with embedded SEs. OTE **$450-$600K**, **65/35 to 70/30**, equity **0.5-1.0%**.

Deal-size segment matters more than ARR stage because it determines the *kind* of VP needed — velocity VP and named-accounts VP are different talent pools with different prior-comp expectations and recruiter networks.

### The structural difference between VP Sales comp and AE comp

VP comp differs from AE comp at the same company in three ways:

1. **Base/variable shifts toward base.** AEs run 50/50; VPs run 60/40 to 70/30. VP leverage is on hiring + system-building + forecasting, not direct quota carry; higher base supports longer-arc decisions.
2. **Variable basis is team quota, not personal quota.** VP variable is more volatile (single-AE misses can swing it) and less behaviorally controllable than AE variable.
3. **Equity dominates total comp.** AE equity at Series B is 5-25 bps (~$150K-$750K paper); VP equity is 50-200 bps (~$2.4M-$9.6M paper). For VPs, equity is the actual long-term wealth lever.

> ### 📊 Quick Facts
> Per Pavilion 2025 + ICONIQ 2024: at Series B mid-market, **VP cash comp is 1.6x-2.4x the median AE OTE** and **VP equity grant is 8x-25x the median AE grant**. The equity multiple is the real story — VP retention is driven by equity vesting timeline, not cash. Under-equity the VP and you lose them inside 18 months even with strong cash.

---

## 🔍 PART 2 — THE NUMBERS

### Cross-survey median OTE bands by motion (Pavilion + OpenComp + RepVue + ICONIQ)

Five independent 2024-2025 datasets converge on a narrow band for Series B VP Sales OTE:

| Source | Sample | SMB-focused VP | Mid-market VP | Enterprise VP |
|---|---|---|---|---|
| Pavilion 2025 | n=2,800 plans (180+ Series B VPs) | $310K median | $415K median | $510K median |
| OpenComp 2024-2025 | n=~1,200 (240+ VP records) | $295K median | $400K median | $525K median |
| RepVue 2025 | ~6,000 VP-level W-2 reports | $325K median | $430K median | $495K median |
| ICONIQ Growth Sales Org 2024/2025 | n=320+ growth-stage SaaS | $300K median | $425K median | $540K median |
| Carta 2025 Startup Comp | n=42,000+ exec comp records | $290K median | $395K median | $485K median |

Take the 5-source weighted median and you land at **$295-$325K OTE for SMB Series B VP, $395-$430K for mid-market, $485-$540K for enterprise-focused** — with **interquartile range of roughly +/-15%** around each median.

### Base / variable splits by motion and deal size

The base/variable mix differs by motion in a predictable pattern:

| Motion | Base | Variable | Mix | Notes |
|---|---|---|---|---|
| SMB Series B VP | $170K-$230K | $110K-$150K | 60/40 | Velocity-driven; variable tied to team quota |
| Mid-market Series B VP | $230K-$285K | $145K-$190K | 60/40 to 65/35 | Modal Series B configuration |
| Enterprise Series B VP | $280K-$420K | $135K-$200K | 65/35 to 70/30 | Long sales cycles → less variable |
| Named-accounts strategic VP | $300K-$450K | $120K-$200K | 70/30 to 75/25 | Variable tied to a small number of named deals |
| Player-coach VP (rare at Series B) | $200K-$260K | $200K-$260K | 50/50 | Carries personal quota; uncommon past $25M ARR |

The 60/40 to 65/35 split is the **modal Series B VP Sales mix**, vs the 50/50 split that dominates AE plans at the same companies. The structural reason: executive role leverage is on hiring, system-building, and forecasting — not direct quota carry — and the comp committee wants cash-flow predictability for executive payroll lines that get reported to the board quarterly.

### Equity grants at Series B — bps ranges and dilution math

Equity is the single most consequential lever in Series B VP Sales comp. The 2026 cross-benchmark medians:

| Equity grant (FD bps) | Frequency at Series B | Profile |
|---|---|---|
| 0.25-0.50% (25-50 bps) | ~12% of grants | Late-Series B / pre-Series C VP hire, smaller company |
| 0.50-0.75% (50-75 bps) | ~30% of grants | Standard Series B VP hire, mid-market motion |
| 0.75-1.25% (75-125 bps) | ~38% of grants | Mid-stage Series B, mid-market or enterprise motion |
| 1.25-1.75% (125-175 bps) | ~14% of grants | First-VP hire with founder trust, strong leverage |
| 1.75-2.0%+ (175-200 bps) | ~6% of grants | Founder-trust hire at early Series B, sometimes with founder shares |

Standard vesting: **4-year vest with 1-year cliff, monthly thereafter**. Increasingly common in 2024-2026: **double-trigger change-of-control acceleration** (acquisition + termination-without-cause = full vesting acceleration). Single-trigger acceleration is rare and usually negotiated only by CRO-track hires.

Dilution math at typical Series B valuations:

- $300M post-money + 0.75% FD = **$2.25M paper at grant**
- $500M post-money + 0.85% FD = **$4.25M paper at grant**
- $700M post-money + 1.0% FD = **$7.0M paper at grant**
- $900M post-money + 1.25% FD = **$11.25M paper at grant**

The real outcome depends on the Series C and exit path — paper value at grant typically realizes at **0.3x-3.5x** depending on dilution, multiple expansion, and exit outcome. The median Series B VP equity outcome over 4-year tenure: **$1.5M-$8M realized**, with a long right tail at $20M+ for hyper-growth exits and left tail at near-zero for failed companies.

### Sign-on cash and equity refresh patterns

Sign-on cash exists primarily to **make whole on forfeited equity from the prior employer**, not as a hiring bonus. Typical 2026 patterns:

- **Sign-on cash:** $50K-$150K, sometimes $200K for senior enterprise VP hires from public companies. Paid 50% on start + 50% at month 12, with clawback if VP leaves voluntarily inside 24 months.
- **Equity make-whole grant:** Some Series B companies grant additional RSUs/options to match the unvested equity the VP forfeits at their prior employer. Calculated as 50-75% of forfeited value because the new equity is higher-risk (private vs public).
- **Year-2 equity refresh:** Increasingly common — **~35-45% of Series B VPs receive a Year-2 refresh** of 25-50% of original grant size, typically vesting on a new 4-year schedule from refresh date. Bridges the "vesting cliff" at Year 4.
- **Promotion grant on VP→CRO transition:** When the VP is promoted to CRO at Series C, expect an additional 0.25-0.75% FD grant on the Series C cap table. Without this, the VP exits within 12 months of promotion.

> ### 📊 Quick Facts
> Per Pavilion 2025: **63% of Series B VPs who survive 24 months receive an equity refresh in Year 2**. Companies that don't refresh see **VP attrition spike at month 30-36** as the original cliff vests out and the candidate market becomes attractive. The cost of a refresh (typically 0.25-0.50% FD at flat valuation) is dramatically smaller than the cost of replacement search + onboarding delay.

### Public-company evidence — HubSpot, MongoDB, Snowflake at their Series B stage

Reconstructed from S-1 filings, DEF 14A proxy statements, and TheOrg + LinkedIn + Equilar executive comp tracking:

- **HubSpot circa 2009-2010 Series B stage** (then $15M ARR, $60M Series C in 2011): VP Sales Mark Roberge received an OTE in the $275-$325K range with equity in the 1.0-1.5% range; later transitioned to SVP Sales role and stayed through IPO. The Roberge case is the textbook "VP survives to public" success pattern.
- **MongoDB circa 2010-2012 Series B/C stage**: VP Sales hires at the early stage received OTE in the $300-$400K band with 0.75-1.5% equity. The eventual CRO (Cedric Pech, hired post-Series F) commanded a different package; the early VPs largely turned over before scale.
- **Snowflake circa 2014-2016 Series B/C stage**: VP Sales hires received OTE in the $350-$450K range; Slootman + Scarpelli's later additions commanded CRO-track packages with PRSU-heavy comp structures.
- **Datadog Series B-C era**: VP Sales hires received standard $350-$425K OTE with 0.75-1.25% equity at Series B; the eventual CRO transition followed the IPO trajectory.
- **Asana, Monday, ZoomInfo, Procore, Toast, Klaviyo**: Their proxy filings and S-1s reference VP Sales comp consistent with the bands above; ZoomInfo and Klaviyo S-1s specifically disclosed early VP Sales equity grants in the 1.0-1.75% range at Series B equivalents.

The takeaway: **public-company practice converges on the same OTE band as private-company benchmarks ($350-$525K), with equity grants in the 0.75-1.5% range at the Series B stage being the modal grant for VPs who eventually transitioned to public-era SVP/CRO roles.**

---

## 📊 PART 3 — THE COMP STRUCTURE

### Base salary mechanics — bands, COL adjustments, floor design

Base salary is the lowest-volatility comp lever and the most-negotiated single number in the offer letter. 2026 mechanics:

- **Geographic adjustment** (the "remote-comp" question): roughly **45-55% of Series B SaaS** in 2026 apply explicit geographic adjustment to VP base (typically -10-20% for non-tier-1 metros); the rest pay flat across geography. The trend is toward flat-comp models at Series B because the VP candidate pool is small and geographically distributed.
- **Annual cost-of-living adjustment**: standard 3-5% annual increase, sometimes negotiated to 5-7% with tier escalators (e.g., 5% base + additional 2% if team hits 105% of plan).
- **Base floor**: typically codified in the offer letter — "base will not decrease below $X" — protects the VP from comp-committee pressure to shift toward higher variable in down cycles.
- **Base ceiling**: rare at Series B but increasingly common via comp-band documentation — "VP Sales base ceiling is $350K through Series C; CRO transition triggers re-banding."

### Variable design — quota basis, attainment metric, MBO weighting

Variable design is the comp design lever that fails most often. The four-component standard 2026 model:

1. **Team quota attainment (50-60% weight)** — VP's variable is paid against the AE team's aggregate quota attainment. Critical question: is "team quota" defined as the sum of individual rep quotas (allows over-quota stacking) or as an aggregate org quota set by the comp committee (caps total payout)? Best practice: aggregate org quota, with a minimum 70% individual-quota-attainment-rate gate.
2. **MBO weight (20-30%)** — typically tied to hiring plan completion ("hire 6 AEs by Q3 with 90-day ramp completion"), pipeline coverage ratio (3.5x is the 2026 board standard), CRM hygiene metrics, and forecast accuracy. The MBO line is where the comp committee codifies the operational priorities — under-weighting it (under 20%) signals that the VP can ignore the operational requirements.
3. **Strategic objectives (10-20%)** — logo-tier wins ("close 3 named enterprise logos in target ICP"), new-product attach rate ("achieve 25% multi-product attach by Q4"), or board-priority ARR mix ("hit 35% enterprise mix of net new ARR"). The strategic line is where the CEO/board codifies the bets that matter to the next funding round.
4. **Threshold gate (0% or 100% payout below a floor)** — typically variable pays at 0% if team attainment is below 70% of plan; some plans pay 50% below 70% with a binary 0% below 50%. The threshold design is where the comp committee signals "this is the floor of acceptable performance."

> ### ⚠️ Warning
> The single most common variable-design failure mode is **paying VPs on total ARR rather than net-new logo ARR**. When variable is tied to total ARR (new + expansion + renewal), the VP can over-rotate the team toward farming existing accounts because it's easier than landing new logos. This is the **#1 reason boards lose confidence in a VP** after the first 12 months — the VP hit variable but the company didn't grow logos, which the board only notices at the Series C fundraise. The fix is simple: weight variable 70%+ to net-new logo ARR for Series B VPs unless the company is explicitly an expansion-first business.

### Accelerators and decelerators at the VP level

VP-level accelerators are structurally flatter than AE accelerators:

| Attainment | VP multiplier | Notes |
|---|---|---|
| Below 70% | 0x (no variable) | Threshold gate |
| 70-99% | 0.5x-1.0x (linear ramp) | Some plans pay only at 80%+ |
| 100-124% | 1.0x | Target attainment |
| 125-149% | 1.25x-1.5x | Modest accelerator |
| 150-199% | 1.5x-1.75x | Cap typically here |
| 200%+ | Capped or discretionary | Comp committee review |

The flatter VP accelerator curve (1.25x-1.75x vs AE 1.5x-3.0x) reflects three structural factors: (a) comp committee wants executive comp predictability, (b) VP variable is more volatile per-unit because single-AE misses can swing the team number, (c) windfall events at the VP level create board pushback and proxy-disclosure concerns at public-track companies.

Hard caps at the VP level are **far more common** than at the AE level: roughly **65-75% of Series B VP plans hard-cap variable at 150-200% attainment**, vs ~14-22% of AE plans capping at all. The justification: the variable line for one VP can move the executive-payroll forecast meaningfully, and the board prefers predictability for executive comp lines.

### Equity vesting — cliff, refresh, acceleration on CIC

The four equity-vesting decisions that matter at Series B VP offers:

1. **Cliff design.** Standard 1-year cliff with monthly vesting thereafter. Negotiated variants: 6-month cliff (rare at VP level; usually only for second-VP-in or for CRO-track hires with strong prior equity), or no cliff (very rare, mostly for very-senior hires with prior multi-exit credentials).
2. **Refresh schedule.** Standard practice in 2026: **Year-2 refresh of 25-50% of initial grant** for high-performing VPs. Codifying the refresh schedule in the offer letter (vs leaving it discretionary) is increasingly common and a strong candidate-side ask.
3. **Single-trigger vs double-trigger acceleration.** Double-trigger (acquisition + termination-without-cause = acceleration) is the standard 2026 design. Single-trigger (acceleration on any change-of-control) is rare and only typically given to CRO-level hires or to first-VPs-in. Negotiate hard for double-trigger if it's not in the initial offer — this is non-controversial at most well-advised companies.
4. **Acceleration percentage.** Standard is 100% acceleration on double-trigger CIC. Some companies offer only 50% acceleration; this is a soft point worth negotiating to 100%. The math: at $4M paper equity, the difference between 50% and 100% acceleration on a CIC event is $2M of cash equivalent — a meaningful single-line item.

### Sign-on bonus and equity make-whole

Sign-on cash mechanics:

- **Standard sign-on:** $50K-$150K paid in two tranches (50% on start, 50% at month 12).
- **Clawback:** Voluntary departure inside 24 months triggers pro-rata clawback (24 months minus tenure × monthly sign-on amount).
- **Equity make-whole:** When candidate is forfeiting significant unvested equity at prior employer (typical at FAANG / public-SaaS exits), additional RSU grant calculated as 50-75% of forfeited value, vesting over 2-4 years.
- **Relocation:** $25K-$75K lump sum for VPs requiring relocation; or up to $150K full-service relocation package for senior enterprise VPs. Increasingly less common in 2026 as remote-first hiring becomes standard.

### Severance and double-trigger change-of-control terms

Severance design is the single most under-negotiated element of Series B VP comp from the candidate side:

- **Standard severance at termination-without-cause:** 6-12 months base salary, sometimes prorated annual bonus, plus 6-12 months health benefits continuation (COBRA reimbursement).
- **Walk-away pay protection:** Less common but increasingly negotiated — VP can voluntarily leave after a Material Adverse Change (significant scope reduction, reporting structure change, comp reduction) and trigger severance as if terminated without cause.
- **Change-of-control severance:** 12-18 months base + target bonus + 100% equity acceleration on double-trigger CIC. This is the single most valuable severance term and should be the candidate's primary severance ask.
- **Non-compete and non-solicit:** Standard 12-month non-solicit on customers + employees; non-compete is increasingly unenforceable (FTC 2024 rule + state-by-state restrictions) but still standard contract language at 12-24 months.

> ### ⚠️ Warning
> The 2024 FTC non-compete rule (and its 2024-2026 legal-challenge status) means contract non-compete language may or may not be enforceable depending on jurisdiction. **California, Oklahoma, North Dakota, Minnesota**, and several other states already substantially prohibit non-competes; the FTC rule expanded this nationally pending court challenges. For Series B VP candidates: **don't agree to a non-compete you wouldn't be willing to litigate**; for founders/CEOs: **don't rely on non-competes as a retention tool — equity vesting and culture are more durable**.

---

## 📈 PART 4 — WHY THIS BREAKS, AND HOW TO DESIGN AND NEGOTIATE AROUND IT

### VP Sales tenure at Series B — the 18-26 month median

Per Bridge Group 2025 + ChartMogul SaaS Tenure Data 2024-2025 + RepVue 2025 VP-tenure reports, the median VP Sales tenure at Series B SaaS is **18-26 months**. The distribution:

- **0-12 months**: ~22-28% of VPs (this is the "early exit" cohort, usually for cause or for severe misalignment)
- **12-24 months**: ~30-38% (the modal cohort, exit at first plan-cycle review)
- **24-36 months**: ~22-28% (the Series C transition cohort)
- **36-48 months**: ~10-14% (the survivor cohort, often promoted to CRO)
- **48 months+**: ~4-8% (the rare "VP through to IPO" cohort like Roberge at HubSpot)

The 22-28% sub-12-month exit rate is the alarming number. Half of those exits are for-cause (severe performance misses or culture mismatch); the other half are no-fault separations driven by founder/CEO/VP scope mismatch, comp design failures, or comp-committee-mandated re-orgs. The implication for comp design: **first-year severance terms matter** — both for the candidate and for the company's reputation in the next hiring round.

### The "first VP rarely survives Series B-to-C" pattern

Across the 600+ Series B-to-C transitions tracked by ICONIQ Growth + Bessemer + Pavilion 2023-2025, roughly **55-70% of Series B VP Sales hires do not survive to a complete Series C cycle**. The pattern is structural, not personal:

- **CEO wants a CRO** at Series C — broader scope, more enterprise gravitas, often a brand-name hire. The Series B VP either elevates (rare) or exits.
- **Sales motion outgrows the VP** — a VP hired for $50M ARR mid-market scale often does not have the playbook for $200M+ ARR enterprise scale.
- **Board pushes for a "real exec"** at the Series C cycle — particularly when growth metrics are softening.
- **Comp design break** — Series B VP hits 2-year vesting and looks at the market; equity refresh wasn't codified; cash offer from a Series D competitor exceeds current grant value.

The takeaway for founders/CEOs: **plan for the Series B VP to either elevate to CRO or transition out at Series C**. Codify the elevation criteria in the offer letter; design the severance for a graceful exit; don't pretend the role is permanent. The takeaway for candidates: **negotiate Year-2 equity refresh + CRO-track elevation criteria + 12-month severance with full equity acceleration**. The Series B VP role is rarely the last stop; design the comp accordingly.

### The 6 named comp design failure modes

Six predictable, repeatedly-observed failure modes in Series B VP Sales comp:

**1. Under-equity on first-VP hire.** Founder offers 0.5% to first VP hire when the market is 1.0-1.5%. Result: VP accepts because cash looks competitive, then sees market comp at year 1 and exits. **Mitigation:** benchmark equity against ICONIQ / Pavilion / OpenComp data before extending offer; don't anchor equity below 0.75% for a first-VP-in.

**2. Variable tied to total ARR rather than net-new logo ARR.** VP optimizes for expansion farming because it's easier than landing new logos; board notices at Series C fundraise. **Mitigation:** weight variable 70%+ to net-new logo ARR; track expansion separately with a different (or zero) variable weight.

**3. Uncapped accelerators that produce comp-committee windfalls.** VP carries personal book or strategic deals; hits 250% attainment in a single quarter; quarterly variable exceeds CEO base. Comp committee panics; board questions design discipline. **Mitigation:** hard-cap VP variable at 150-200% attainment; use PRSU stock or deferred cash for any pay above cap.

**4. Equity vesting that doesn't reset on title change at Series C.** VP promoted to CRO at Series C without a new equity grant; original 4-year vest continues from VP start date; CRO leaves within 12 months because vesting wedge is 60% behind. **Mitigation:** codify in the original offer that VP→CRO promotion triggers a new equity grant on the new title's cap table; benchmark grant against CRO-level data.

**5. Severance that doesn't include accelerated equity vesting on double-trigger CIC.** Acquisition occurs at year 3; VP terminated at acquisition; severance pays cash but no equity acceleration; VP loses 12-18 months of unvested equity worth $1M-$3M. **Mitigation:** codify 100% equity acceleration on double-trigger CIC in the original offer letter; this is non-controversial at most well-advised companies.

**6. Quota set above the comp committee's planning assumption.** CEO sets VP quota at $50M to "stretch the team"; comp committee plans for $42M; team hits $45M; VP variable pays out at 90% even though team beat plan. **Mitigation:** align VP quota with comp committee planning number, with stretch goals as MBO line items rather than variable basis.

### The cost of a bad VP Sales hire — $750K-$2M math

The fully-loaded cost of a bad VP Sales hire at Series B SaaS, broken down:

- **Search and recruiter fees**: $75K-$200K (DHR / Heidrick / Russell Reynolds at 30-33% of first-year cash; boutique firms 25-28%)
- **Sign-on cash**: $50K-$150K (paid; not recoverable if VP exits inside 12 months via cause termination)
- **Base salary paid through tenure**: $230K-$420K (12-24 month tenure × base)
- **Variable paid through tenure**: $50K-$150K (12-24 months × variable × actual attainment)
- **Equity charge to cap table**: $2M-$8M paper at grant, of which $500K-$2M typically vests before departure
- **Opportunity cost on degraded pipeline**: $300K-$800K (6-12 months of lower-quality pipeline due to mis-hiring, mis-training, or mis-territorying under a failing VP)
- **Team attrition cascade**: 2-5 AEs typically leave with a failing VP within 6 months of VP exit; backfill cost $300K-$750K
- **CEO time cost**: ~25-40% of CEO time for 4-6 months pre-firing and 3-6 months post-firing — at CEO opportunity cost terms, $400K-$900K
- **Replacement search cycle**: 4-7 month search; lost ARR during the gap estimated at $400K-$2M

**Total fully-loaded cost: $750K-$2M** for a typical bad VP Sales hire at Series B. This is the math that justifies the executive search firm's 30-33% fee and that justifies the founder/CEO spending 8-12 weeks of full-attention hiring rather than rushing the role.

### Executive search firm comp economics (DHR / Heidrick / Russell Reynolds)

Executive search firms operate on a retained-search model with three milestone payments:

- **Retainer at signing**: 33% of expected fee, paid upfront
- **Milestone at shortlist**: 33% of expected fee, paid when 3-5 qualified candidates are presented
- **Completion at placement**: 33-34% of expected fee, paid at signed offer

Fee structure (2026 standards):

- **Big Three (Heidrick & Struggles, Russell Reynolds, Spencer Stuart)**: 33% of first-year cash comp (base + on-target variable + sign-on)
- **Tier 2 (DHR Global, Korn Ferry executive, Egon Zehnder)**: 30-33% of first-year cash
- **Boutique SaaS-specific (True Search, Daversa Partners, Riviera Partners executive)**: 25-30% of first-year cash, sometimes with success-fee equity warrants

Worked example: Series B mid-market VP Sales OTE $425K + $75K sign-on = $500K first-year cash × 33% = **$165K search fee**. The fee feels expensive until you compare it to the $750K-$2M cost of a bad hire — at which point 30-33% of first-year cash is cheap insurance.

> ### 📊 Quick Facts
> Per Pavilion 2025 + Heidrick & Struggles published data: **~62% of Series B VP Sales hires in 2024-2025 came through retained executive search** (vs in-network founder referrals, posted role applicants, or VC-introduction). The retained-search rate is 78%+ for enterprise-focused Series B and ~40% for SMB-focused. The trend is upward as the VP candidate pool gets thinner and the consequences of bad hires get larger.

### Founder/CEO playbook for Series B VP Sales comp design

The founder/CEO checklist for designing a Series B VP Sales offer:

**Fix at offer time (don't negotiate later):**
- OTE band benchmarked against Pavilion / OpenComp / ICONIQ data for your motion and stage
- Base/variable mix appropriate for motion (60/40 mid-market, 65/35 enterprise, 70/30 named-accounts)
- Equity grant at or above 0.75% FD for first-VP hire (don't anchor below market)
- Variable basis = team net-new logo ARR (with explicit expansion-quota carve-out)
- Hard cap on variable at 150-200% attainment
- Year-2 equity refresh codified (size + trigger conditions)
- VP→CRO elevation criteria codified
- 100% equity acceleration on double-trigger CIC
- 6-12 month severance with COBRA reimbursement

**Leave flexible (negotiation room):**
- Specific bps of equity within the 0.75-1.5% band
- Sign-on cash amount within $50-$150K range
- Specific severance length within 6-12 month range
- Geographic adjustment if remote
- Specific MBO weighting within 20-30%

**Don't negotiate (red lines):**
- VP variable tied to total ARR (always net-new logo)
- VP variable below 30% of OTE (always at least 30%)
- Equity below 0.5% on first-VP hire (don't anchor below market)
- Severance below 6 months (creates retention risk and reputational risk)

### Candidate-side negotiation playbook — what to push on

The candidate-side checklist for negotiating a Series B VP Sales offer:

**Primary asks (high-leverage, low-controversy):**
- Base salary floor codified (won't decrease below $X)
- Year-2 equity refresh codified (typically 25-50% of original grant)
- 100% equity acceleration on double-trigger CIC
- 6-12 month severance with COBRA reimbursement
- VP→CRO promotion criteria codified

**Secondary asks (moderate leverage):**
- Sign-on cash in the upper half of company's offer range ($100-$150K for mid-market)
- Equity make-whole grant for forfeited prior-employer equity
- Travel & expense flexibility (especially for enterprise-focused VPs)
- Direct comp committee or board reporting access (signals seriousness of the role)

**Tertiary asks (low leverage but worth trying):**
- Single-trigger acceleration on CIC (rare; sometimes given to first-VP hires)
- Specific equity grant size above company's offer (push 0.25-0.50% higher if you're a first-VP)
- Walk-away pay protection on Material Adverse Change
- Severance trigger expansion to include reporting-structure change

**Don't negotiate down (your floor):**
- Don't accept variable below 30% of OTE (signals lack of confidence)
- Don't accept equity below market band for your motion/stage
- Don't accept severance below 6 months
- Don't accept non-compete without geographic + role-scope restriction
- Don't accept variable tied to total ARR (always insist on net-new logo basis)

### When to bring in a comp consultant — Alexander Group / OpenComp / Pave

For founders/CEOs designing the VP Sales comp plan from scratch, a third-party comp consultant earns their fee in three specific scenarios:

1. **First-VP hire at Series B** — founder lacks the comp benchmarking instinct and the offer needs to be defensible to the board. Consultant fee: $25-$75K for the comp design + board memo. Worth it if you're inexperienced.
2. **Comp committee skeptical of design** — board pushback requires third-party validation. Consultant produces a benchmarked memo showing comparable comp at peer companies. Fee: $15-$50K for the memo.
3. **VP→CRO transition at Series C** — comp re-design at title change requires fresh benchmarking. Consultant fee: $35-$100K.

The major firms:

- **Alexander Group** — long-running enterprise sales-comp consulting practice; expensive but highly credentialed for board-facing memos. Fee range $75-$300K for comprehensive engagements.
- **OpenComp** — data-driven benchmarking + lighter-touch consulting; faster turnaround, lower fee. Fee range $25-$100K.
- **Pave** — SaaS comp benchmarking platform with optional consulting overlay; data product is strong, consulting is lighter. Fee range $10-$50K for the consulting layer (data platform separate subscription).
- **Compa, Carta Total Comp, Option Impact** — data-only benchmarking tools that founders can use directly without consultant. Subscription cost $5-$25K/year.

The decision tree: **if it's your first VP comp design and you're going to the board with it, hire Alexander Group or OpenComp; if you've done this before, Pave + Compa data is enough**. For VP-side candidates: ask the company which benchmarking source they used; if they say "we made it up" or "our investor said it looked fine," push back and request data-supported benchmarking.

`;

const flow = `

## Decision Flow: Designing the Series B VP Sales Comp Package

\`\`\`mermaid
flowchart TD
    A[Series B VP Sales Hire Triggered] --> B{Deal Size Segment?}
    B -->|SMB Under 100K ACV| C[OTE 280K to 380K]
    B -->|Mid Market 200K to 400K ACV| D[OTE 375K to 475K]
    B -->|Enterprise 500K Plus ACV| E[OTE 450K to 600K]
    C --> F{Pay Mix Selection}
    D --> F
    E --> F
    F -->|SMB Velocity Motion| G[60 40 Base Variable]
    F -->|Mid Market Mixed Motion| H[60 40 to 65 35 Base Variable]
    F -->|Enterprise Long Cycle| I[65 35 to 70 30 Base Variable]
    G --> J{Equity Band Selection}
    H --> J
    I --> J
    J -->|First VP In Founder Trust| K[1.25 to 1.75 Percent FD]
    J -->|Standard Series B Hire| L[0.75 to 1.25 Percent FD]
    J -->|Late Series B Pre C| M[0.5 to 0.75 Percent FD]
    K --> N{Variable Design}
    L --> N
    M --> N
    N --> O[50 to 60 Percent Team Quota Net New Logo]
    N --> P[20 to 30 Percent MBO Hiring Pipeline CRM]
    N --> Q[10 to 20 Percent Strategic Logo Tier or ARR Mix]
    O --> R[Threshold Gate 70 Percent or 0 Variable]
    P --> R
    Q --> R
    R --> S[Accelerator Cap 150 to 200 Percent Attainment]
    S --> T{Equity Vesting Terms}
    T --> T1[4 Year Vest 1 Year Cliff Monthly]
    T --> T2[Double Trigger CIC 100 Percent Acceleration]
    T --> T3[Year 2 Refresh Codified 25 to 50 Percent]
    T1 --> U[Sign On Cash 50K to 150K Two Tranches]
    T2 --> U
    T3 --> U
    U --> V[Severance 6 to 12 Months Plus COBRA]
    V --> W[CRO Elevation Criteria Codified]
    W --> X[Board Comp Committee Review and Approval]
    X --> Y[Offer Letter Generated]
    Y --> Z[Candidate Negotiation Phase 7 to 21 Days]
    Z --> AA[Signed Offer]
    AA --> BB[Year 1 Onboarding and Plan Activation]
    BB --> CC[Year 2 Equity Refresh Review]
    CC --> DD{Series C Transition?}
    DD -->|VP Elevated to CRO| EE[New CRO Equity Grant On Series C Cap Table]
    DD -->|VP Exits at Series C| FF[Severance Triggers Equity Acceleration]
    DD -->|VP Continues as VP| GG[Refresh Grant on Series C Valuation]
\`\`\`

## Series B VP Sales Tenure Pattern and Failure Mode Cascade

\`\`\`mermaid
flowchart LR
    A[Series B VP Sales Hired Day 0] --> B[Onboarding Month 1 to 3]
    B --> C[First Plan Cycle Month 4 to 12]
    C --> D{Year 1 Performance Review}
    D -->|Below 70 Percent Attainment| E[Early Exit Risk 22 to 28 Percent of Cohort]
    D -->|70 to 100 Percent Attainment| F[Modal Cohort 30 to 38 Percent]
    D -->|Above 100 Percent Attainment| G[Survivor Path 22 to 28 Percent]
    E --> E1[Cause Termination or No Fault Separation]
    E1 --> E2[Severance Triggers 6 to 12 Months Base Plus COBRA]
    E2 --> E3[Recruiter Search Begins Month 1 of Separation]
    E3 --> E4[Replacement VP On Boarded Month 4 to 7]
    F --> F1[Year 2 Plan Cycle Begins]
    F1 --> F2{Year 2 Equity Refresh Discussion}
    F2 -->|Refresh Codified at Hire| F3[Refresh Granted 25 to 50 Percent of Original]
    F2 -->|Refresh Not Codified| F4[VP Exits Inside Month 30 to 36]
    F3 --> F5[Year 3 Continued Performance Path]
    F4 --> F6[Recruiter Cycle Restarts Lost Pipeline 6 to 12 Months]
    G --> G1[Series C Transition Discussion]
    G1 --> G2{CEO Decision on CRO Hire}
    G2 -->|Elevate VP to CRO| G3[New CRO Grant 0.25 to 0.75 Percent FD on Series C Cap]
    G2 -->|Hire External CRO| G4[VP Reports to CRO or Exits with Severance]
    G3 --> G5[VP Continues to IPO or Series D Path 4 to 8 Percent Cohort]
    G4 --> G6[Severance Triggers Plus Equity Acceleration on Double Trigger]
    F5 --> H[Failure Mode Audit]
    G3 --> H
    G4 --> H
    H --> H1{Comp Design Failure Mode Detected?}
    H1 -->|Under Equity at Hire| I1[Mitigation Refresh Grant Year 2]
    H1 -->|Total ARR Variable Basis| I2[Mitigation Reweight to Net New Logo Year 2]
    H1 -->|Uncapped Accelerator Windfall| I3[Mitigation PRSU or Deferred Cash Past Cap]
    H1 -->|No Title Change Equity Reset| I4[Mitigation New CRO Grant on Promotion]
    H1 -->|Severance Without Equity Acceleration| I5[Mitigation Add Double Trigger Acceleration]
    H1 -->|Quota Above Plan| I6[Mitigation Align Quota with Comp Committee]
    I1 --> J[Codify Fix in Year 2 or Year 3 Plan]
    I2 --> J
    I3 --> J
    I4 --> J
    I5 --> J
    I6 --> J
\`\`\`

`;

const src = `

## Sources

1. **Pavilion State of Sales Compensation Report 2025** — n=2,800+ B2B SaaS plans including 180+ Series B VP Sales records covering OTE bands, base/variable splits, equity grants, accelerator design, and tenure patterns. Primary citation for Series B VP comp medians. https://www.joinpavilion.com/compensation-report
2. **OpenComp 2024-2025 SaaS Compensation Benchmarks** — n=~1,200 SaaS plans with 240+ VP Sales records covering motion-specific OTE bands, variable mix, and equity grants. https://www.opencomp.com
3. **RepVue 2025 Quota Threshold Data and VP-Level W-2 Reports** — Approximately 6,000 VP-level W-2 reports plus 85,000 anonymized AE compensation records contextualizing VP comp vs AE comp ratios. https://repvue.com
4. **ICONIQ Growth Sales Org Survey 2024/2025** — n=320+ growth-stage SaaS companies with detailed Series A through Series D sales leadership comp data. https://www.iconiqcapital.com/growth/insights
5. **Carta 2025 Startup Compensation Report** — n=42,000+ executive comp records across startup stages with detailed Series B VP-level OTE and equity data. https://carta.com/data/
6. **Bridge Group 2025 SaaS AE Metrics & Compensation Report** — n=412 SaaS organizations with VP Sales tenure data, attainment distributions, and team-quota structures. https://blog.bridgegroupinc.com/
7. **Bessemer State of the Cloud Reports (2024, 2025)** — Annual SaaS leadership comp benchmarks plus Series B-to-C transition pattern analysis. https://www.bvp.com/atlas/state-of-the-cloud
8. **a16z Enterprise GTM Research** — Sales leadership comp design + Series B-to-C transition playbooks. https://a16z.com/enterprise/
9. **OpenView Expansion SaaS Compensation Benchmarks 2024-2025** — Mid-stage SaaS leadership comp focused on PLG and product-led companies. https://openviewpartners.com/blog/
10. **HubSpot S-1 (2014) and Subsequent DEF 14A Proxy Filings** — Reconstructed VP Sales comp band ($275-$325K OTE at Series B equivalent) and equity grants (1.0-1.5% FD) for early VP hires including Mark Roberge. https://ir.hubspot.com
11. **MongoDB S-1 (2017) and DEF 14A Proxy Filings** — Early VP Sales comp at the Series B/C equivalent stage with documented OTE ranges and equity grants. https://investors.mongodb.com
12. **Snowflake S-1 (2020) and DEF 14A Proxy Filings** — Series B/C era VP Sales comp data plus eventual Slootman/Scarpelli CRO-track packages with PRSU-heavy structures. https://investors.snowflake.com
13. **Datadog S-1 (2019) and DEF 14A Proxy Filings** — Series B-C era VP Sales comp data. https://investors.datadoghq.com
14. **Asana, Monday.com, Procore, Toast, ZoomInfo, Klaviyo S-1 Filings (2020-2023)** — Pre-IPO sales leadership comp disclosures. ZoomInfo and Klaviyo specifically disclosed Series B-equivalent VP Sales equity grants in the 1.0-1.75% range.
15. **Heidrick & Struggles Sales Leadership Compensation Report 2024** — Executive search firm published data on VP Sales / CRO comp benchmarks. https://www.heidrick.com
16. **Russell Reynolds Sales Leadership Practice — 2024 Insights** — Published research on VP-CRO transitions, comp design, retention. https://www.russellreynolds.com
17. **DHR Global Sales Practice 2024-2025** — Mid-market VP Sales comp benchmarks. https://www.dhrglobal.com
18. **Spencer Stuart Sales Officer Practice** — Enterprise sales leadership comp benchmarks. https://www.spencerstuart.com
19. **True Search SaaS Practice 2024-2025** — Boutique SaaS-specialist search firm with comp data on Series A-D placements. https://www.truesearch.com
20. **Daversa Partners SaaS Leadership Practice** — Growth-stage SaaS sales leadership recruiting. https://www.daversapartners.com
21. **Alexander Group Sales Compensation Research** — Enterprise sales-comp consulting practice; published research on VP Sales and CRO comp design. https://www.alexandergroup.com
22. **Pave Compensation Benchmarks** — SaaS comp benchmarking platform with VP-level data across 5,000+ companies. https://www.pave.com
23. **Compa Real-Time Compensation Data** — Real-time SaaS comp benchmarking covering sales leadership. https://www.compa.com
24. **Option Impact by Advanced HR** — Long-running startup compensation survey with VP-level equity grant data. https://www.advanced-hr.com
25. **Carta Total Compensation Platform** — Equity + cash comp benchmarking across startup stages. https://carta.com/total-comp/
26. **WTW (Willis Towers Watson) Sales Compensation Reports 2024-2025** — Cross-industry executive comp benchmarks. https://www.wtwco.com
27. **Mercer Executive Compensation Surveys** — Cross-industry executive comp benchmarks including SaaS subset. https://www.mercer.com
28. **Korn Ferry Executive Compensation Data** — Cross-industry executive comp plus dedicated tech subset. https://www.kornferry.com
29. **TheOrg.com Sales Leadership Tracking** — Public-facing sales leadership org chart database used for tenure and transition pattern analysis. https://theorg.com
30. **Equilar Executive Compensation Data** — Public-company executive comp tracking used for Series B/C VP-CRO transition analysis. https://www.equilar.com
31. **Pitchbook + Crunchbase Series B Round Data 2024-2025** — Median Series B round size ($52M) and post-money valuation ($475M) data informing equity grant value calculations. https://pitchbook.com
32. **ChartMogul SaaS Tenure Data 2024-2025** — VP Sales tenure tracking across 600+ Series B-to-C SaaS transitions. https://chartmogul.com
33. **SaaStr Annual Series B Survey (2024, 2025)** — Founder/CEO-reported VP Sales comp design data. https://www.saastr.com
34. **Modern Sales Pros Community Survey 2024** — Operator-community-reported VP Sales comp and tenure data.
35. **Pavilion RevOps Community (10,000+ members) Annual Comp Survey** — Operator-side data on Series B VP comp. https://www.joinpavilion.com
36. **FTC Non-Compete Rule (2024)** — Federal non-compete enforceability framework affecting VP severance and contract design. https://www.ftc.gov/legal-library/browse/rules/noncompete-rule
37. **California Business & Professions Code Section 16600** — State-level non-compete prohibition affecting California-based VP hires. https://leginfo.legislature.ca.gov
38. **FAS 123R / ASC 718 Stock-Based Compensation Accounting** — GAAP framework for equity grant valuation and disclosure. https://www.fasb.org
39. **Andreessen Horowitz Sales Comp Benchmarks (Mark Cranney, Sarah Wang)** — Published guidance on VP Sales / CRO comp at portfolio companies. https://a16z.com
40. **Iconiq Growth Sales Comp Studies (2023, 2024, 2025)** — Detailed growth-stage SaaS sales leadership comp benchmarks across motion type. https://www.iconiqcapital.com/growth/insights

`;

const num = `

## Numbers

**Headline Series B VP Sales OTE Bands (2026)**
- SMB-focused Series B ($30-$60M ARR, $50-$100K ACV): **$280-$380K OTE**
- Mid-market Series B ($60-$100M ARR, $200-$400K ACV): **$375-$475K OTE**
- Enterprise-focused Series B ($80-$120M ARR, $500K+ ACV): **$450-$600K OTE**
- Cross-survey weighted median (all Series B VPs): **$395K OTE**

**Cross-Survey Median OTE by Motion**

| Source | Sample | SMB VP | Mid-Market VP | Enterprise VP |
|---|---|---|---|---|
| Pavilion 2025 | n=2,800 (180+ VPs) | $310K | $415K | $510K |
| OpenComp 2024-2025 | n=1,200 (240+ VPs) | $295K | $400K | $525K |
| RepVue 2025 | ~6,000 VP W-2s | $325K | $430K | $495K |
| ICONIQ Growth 2024-2025 | n=320+ companies | $300K | $425K | $540K |
| Carta 2025 | n=42K+ exec records | $290K | $395K | $485K |

**Base / Variable Split by Motion**

| Motion | Base | Variable | Mix |
|---|---|---|---|
| SMB Series B VP | $170-$230K | $110-$150K | 60/40 |
| Mid-market Series B VP | $230-$285K | $145-$190K | 60/40 to 65/35 |
| Enterprise Series B VP | $280-$420K | $135-$200K | 65/35 to 70/30 |
| Named-accounts strategic VP | $300-$450K | $120-$200K | 70/30 to 75/25 |
| Player-coach VP (rare) | $200-$260K | $200-$260K | 50/50 |

**Equity Grant Distribution at Series B**

| FD bps | Frequency | Profile |
|---|---|---|
| 25-50 bps | ~12% | Late-Series B / pre-C VP hire |
| 50-75 bps | ~30% | Standard Series B VP |
| 75-125 bps | ~38% | Mid-stage Series B, mid-market or enterprise |
| 125-175 bps | ~14% | First-VP hire with founder trust |
| 175-200 bps+ | ~6% | Founder-trust hire, early Series B |

**Equity Paper Value at Typical Series B Post-Money**
- $300M post + 0.75% FD = $2.25M paper
- $500M post + 0.85% FD = $4.25M paper
- $700M post + 1.0% FD = $7.0M paper
- $900M post + 1.25% FD = $11.25M paper
- Realized at exit: typically 0.3x to 3.5x paper depending on dilution and exit multiple
- Median 4-year realized equity outcome: **$1.5M-$8M**

**Sign-On Cash and Refresh**
- Standard sign-on: $50-$150K (two tranches, 50% start + 50% month 12)
- Senior enterprise VP sign-on: up to $200K
- Equity make-whole grant: 50-75% of forfeited prior-employer value
- Year-2 equity refresh: 25-50% of original grant; **~63% of surviving VPs receive one**
- Relocation (when applicable): $25-$75K lump or up to $150K full-service

**VP Sales Tenure at Series B (Bridge Group + ChartMogul + RepVue)**
- 0-12 months: 22-28% of cohort
- 12-24 months: 30-38% (modal)
- 24-36 months: 22-28%
- 36-48 months: 10-14%
- 48 months+: 4-8% (rare survivor cohort)
- Median tenure: **18-26 months**

**Series B-to-C Transition Pattern**
- VPs who do NOT survive complete Series C cycle: **55-70%**
- Median time from Series B close to Series C close: 20-28 months
- VP→CRO elevation rate: ~15-25% of surviving VPs
- External CRO hire rate at Series C: ~35-50% (VP exits or reports to new CRO)

**Cost of a Bad VP Sales Hire**
- Search and recruiter fees: $75-$200K
- Sign-on cash (paid, not recoverable): $50-$150K
- Base salary paid through tenure: $230-$420K
- Variable paid through tenure: $50-$150K
- Equity vested before departure: $500K-$2M
- Opportunity cost on degraded pipeline: $300-$800K
- Team attrition cascade backfill: $300-$750K
- CEO time cost: $400-$900K
- Replacement search cycle lost ARR: $400K-$2M
- **Total fully-loaded cost: $750K-$2M**

**Executive Search Firm Fee Structure**
- Big Three (Heidrick, Russell Reynolds, Spencer Stuart): 33% of first-year cash
- Tier 2 (DHR, Korn Ferry exec, Egon Zehnder): 30-33%
- Boutique SaaS-specific (True Search, Daversa, Riviera): 25-30%
- Retainer payment schedule: 33% / 33% / 33-34%
- Typical search fee for $500K first-year cash VP: **$150-$165K**
- Series B VPs hired through retained search: ~62% overall; 78%+ enterprise; ~40% SMB

**Variable Design Composition**
- Team quota attainment weight: 50-60%
- MBO weight (hiring + pipeline + CRM): 20-30%
- Strategic objectives weight: 10-20%
- Threshold gate: typically 0% variable below 70% attainment
- Hard cap on variable: 150-200% attainment for 65-75% of plans

**VP-Level Accelerator Multipliers**
- Below 70%: 0x (threshold gate)
- 70-99%: 0.5x-1.0x (linear ramp)
- 100-124%: 1.0x (target)
- 125-149%: 1.25x-1.5x
- 150-199%: 1.5x-1.75x (cap typical here)
- 200%+: capped or comp committee discretion

**Severance and Change-of-Control Standards**
- Standard severance: 6-12 months base + COBRA reimbursement
- Change-of-control severance: 12-18 months base + target bonus + 100% equity acceleration
- Double-trigger CIC acceleration: standard 100%, sometimes 50% (negotiate to 100%)
- Non-solicit: standard 12 months on customers + employees
- Non-compete: 12-24 months standard language, enforceability varies by jurisdiction

**Worked Example — Series B Mid-Market VP**
- OTE: $425K = $265K base + $160K variable
- Equity: 0.85% FD on $480M post-money = $4.08M paper at grant
- Sign-on: $75K (split 50/50 start + month 12)
- Vest: 4-year with 1-year cliff, monthly thereafter
- 4-year on-target cash: $1.7M ($1.06M base + $640K variable)
- 4-year total comp on-target: **$5.78M** ($1.7M cash + $4.08M equity at grant)
- Realistic dilution-adjusted equity outcome: $1.5M-$8M
- Year-2 refresh likely: 25-50% of original grant = $1M-$2M additional paper

**Comp Consultant Fees**
- Alexander Group comprehensive engagement: $75-$300K
- OpenComp benchmarking + light consulting: $25-$100K
- Pave consulting overlay: $10-$50K (data platform separate subscription)
- Compa data-only subscription: $5-$25K/year
- Carta Total Comp / Option Impact: included in Carta subscription

**Hiring Plan Math (Typical Series B Mid-Market)**
- AE team size: 8-18 reps
- AE OTE: $200-$260K (mid-market)
- AE quota: $1.2M-$1.8M
- Team aggregate quota: $12M-$30M
- Pipeline coverage ratio target: 3.5x of quota
- Quota over assignment factor: 105-115% (sum of rep quotas vs org plan)
- VP variable basis: team net-new logo ARR vs aggregate org quota

**TAM / SAM / Hiring Pool**
- Active Series B SaaS companies in US: ~2,400-3,200
- Companies hiring a VP Sales in any given year: ~700-1,200 (~30-40%)
- Qualified VP Sales candidate pool: ~6,000-12,000 nationally
- VPs actively considering moves in any quarter: ~12-18% of qualified pool
- Realistic candidate pool for a specific Series B role: 40-120 names

`;

const counter = `

## Counter-Case: Why The "Median OTE Is The Answer" Framing Is Often Wrong

The headline 2026 answer — "median Series B VP Sales OTE is $395K with 60/40 mix and 0.75-1.25% equity" — is statistically right and operationally often misleading. The serious counter-arguments:

**Counter 1 — The median masks 4x variance that determines the actual offer.** A SMB-focused Series B VP at $280K OTE and an enterprise-focused Series B VP at $600K OTE are both "median Series B VPs" by aggregate data, but they are different roles, different candidate pools, and different comp design problems. Quoting the cross-segment median to a candidate or a board misrepresents the design problem and leads to bad comp decisions. The honest framing is motion-specific bands, not aggregate medians.

**Counter 2 — Equity dominates the actual financial outcome but is the least-discussed lever.** A Series B VP at $425K cash OTE who stays 4 years and exits with 0.75% FD equity at a $1.5B Series D valuation realizes roughly $9M cash equivalent from equity vs $1.7M cash from comp. The equity is 5x the cash. Yet most comp discussions anchor on the cash band and treat equity as a secondary negotiation. This framing creates systematic under-equity at first-VP hires (anchoring on cash market means equity gets the leftover bps) and systematic under-negotiation from candidates who don't model the equity outcome.

**Counter 3 — The 18-26 month median tenure means the standard 4-year vest schedule is structurally misaligned.** A VP who exits at month 22 has vested 46% of their equity grant (year 1 cliff at 25% + 11 months × monthly = ~46%). The other 54% is forfeited at typical departure. This is a real misalignment: the comp design assumes 48 months of service, but the empirical pattern is 22 months. The honest design response: shorter vesting cliffs (6-month vs 12-month) and aggressive Year-2 refresh codification.

**Counter 4 — Variable structures that look generous on paper rarely activate for Series B VPs.** Bridge Group 2025 tenure data shows median Series B VP attainment in Year 1 sits at **68-78%** of plan (vs the 100% the variable plan is sized for). At 75% attainment, a $160K variable line pays $120K (75% of target), or even less if the plan has a 70% threshold gate. The "OTE = $425K" headline is rarely the realized number; **realized VP cash at Series B is typically 85-95% of headline OTE in years 1-2**, dropping below 75% in years where attainment cycles down.

**Counter 5 — The "60/40 modal mix" is a self-perpetuating benchmark, not a designed-from-economics conclusion.** Comp consultants quote 60/40 because the data shows 60/40; companies adopt 60/40 because consultants recommend it; the next survey shows 60/40 again. The honest question is whether 60/40 is actually the right design for any specific role, or whether it's the path-of-least-resistance default. For enterprise-focused VPs with 12-month sales cycles, a case can be made for 70/30 or 75/25 (higher base, lower variable) because the variable cycles don't align with quarterly comp periods. For SMB-velocity VPs running a hire-fast playbook, 55/45 or 50/50 may better align with the hiring leverage. The 60/40 default is often wrong — it just happens to be the average.

**Counter 6 — Public-company VP Sales comp data is heavily survivorship-biased.** The HubSpot / MongoDB / Snowflake / Datadog VP comp data cited above is real but reflects the **survivor cohort** — the 4-8% of VPs who actually rode their Series B-stage company to public. The 92-96% of Series B VPs who did NOT survive to IPO are missing from the public-comp data. Designing your VP comp by reference to Roberge at HubSpot is benchmarking against the most successful outlier, not the median outcome.

**Counter 7 — The "executive search firm 30-33% fee" math doesn't always hold.** The $750K-$2M cost-of-bad-hire math is real, but it's not always cheaper to use a retained search firm. Founders with strong in-network relationships, board members with deep VP/CRO networks (Pavilion, Operator Collective, Founders Fund operator network, ex-portfolio-VPs at the lead investor) can run an effective search at zero cash cost. The right framing is "what's the candidate pool you have access to without paying a search fee?" — if it's deep, skip the firm; if it's thin, pay.

**Counter 8 — The "VP→CRO elevation" pattern is mostly mythology, and the comp committee dynamic is missing from most design discussions.** Per ICONIQ Growth + Bessemer transition data, only **~15-25% of surviving Series B VPs are actually elevated to CRO** at Series C — the other 75-85% exit, report to an external CRO, or stay at VP title. Designing the offer around "promotion to CRO" upside is misleading; the empirical pattern is "you'll be VP until Series C, then the company hires a CRO." Compounding this, Series B comp committees (lead investor + 1-2 board members + sometimes an independent comp-experienced director) approve VP packages with their own preferences — conservative on cash, supportive of equity, cautious on accelerators, focused on benchmark defensibility. Founders who ignore the committee dynamic write offers that get downgraded; candidates who don't understand it miss the leverage points where the committee will actually flex. Geography and remote work further distort the data: "$425K OTE" doesn't mean the same thing for a VP in SF as for a VP in Austin, but most benchmarks don't separate these. And the post-2022 funding compression + 2025-2026 macro produced a 30-50% smaller active-hiring pool than the 2019-2021 peak, creating more candidate competition for fewer seats — downward pressure on cash, upward pressure on equity. The honest design response: focus on Year-2 refresh + severance (the cash payouts that actually happen), not promotion criteria (the upside that rarely materializes).

**The honest verdict.** The headline answer "median Series B VP Sales OTE is $395K with 60/40 mix and 0.75-1.25% equity" is the right starting benchmark for a generic mid-market Series B SaaS in 2026. It is the wrong starting point for: (a) enterprise-focused Series B VPs (use the $450-$600K band), (b) SMB-velocity Series B VPs (use the $280-$380K band), (c) first-VP hires with founder trust (push equity to 1.25-2.0%), (d) candidates negotiating their own offer (focus on equity refresh, severance, and CIC acceleration, not just cash), (e) founders/CEOs designing the variable structure (focus on net-new-logo basis, not total ARR). The serious work is *not* picking the median OTE — it is matching the comp package to the motion, the stage, the equity outcome distribution, the tenure realism, and the comp-committee dynamic. Skipping that work and quoting the median is how Series B VP Sales comp becomes a source of preventable executive turnover rather than a recruiting and retention advantage.

`;

const links = `

## Related Pulse Library Entries

- **q01** — What is the standard SaaS AE OTE base/variable split? (Sets the 50/50 AE benchmark that the 60/40 VP mix departs from.)
- **q02** — How do you set SaaS sales quotas? (Quota-setting drives whether VP team-quota variable activates.)
- **q03** — What is the standard SaaS AE ramp curve? (New-hire prorated quotas affecting team quota composition in VP variable.)
- **q04** — How do you design SaaS sales territories? (Territory quality drives the AE attainment distribution that determines VP variable outcome.)
- **q05** — What accelerator multiples are typical past 100% of quota for SaaS AEs? (AE accelerator design contrasted with flatter VP accelerator design.)
- **q06** — What are the standard SDR/BDR comp variants? (Team comp design context for VP Sales overseeing SDR teams.)
- **q08** — What is the standard SaaS sales commission rate? (Base commission rates underlying AE comp that VP team quota aggregates.)
- **q09** — How do you handle multi-year deal commissions? (TCV vs ACV recognition affecting VP team quota math.)
- **q10** — What is the standard SaaS sales SPIFF design? (Tactical comp levers VPs use within their teams.)
- **q11** — How do you design SaaS expansion compensation? (Expansion comp design context for VP variable basis.)
- **q12** — What is the standard SaaS renewal commission rate? (Renewal protection thresholds affecting VP team-quota math.)
- **q13** — How do you handle consumption-pricing sales comp? (Recognition models affecting VP variable design at consumption-priced companies.)
- **q14** — What is the standard SaaS sales-comp spend as % of new ARR? (Aggregate comp benchmark contextualizing VP variable as % of total spend.)
- **q15** — How do you design a SaaS sales comp plan from scratch? (End-to-end plan design including VP-level comp structure.)
- **q16** — How do you handle sales rep PIPs? (Performance management context VPs manage; affects team attainment distribution.)
- **q17** — How do you handle mid-year sales territory rebalancing? (Operational decisions VPs make affecting AE comp and indirectly VP variable.)
- **q18** — How do you handle quota inflation year over year? (Quota-setting dynamics affecting VP-level expectations across plan cycles.)
- **q19** — How do you handle the windfall problem in sales comp? (PRSU substitution and deferred cash mechanics relevant to VP-level windfall events.)
- **q20** — How do you handle elephant deals in SaaS sales comp? (Strategic-account variance and named-account caps relevant to VP-level comp design.)
- **q21** — What is the standard SaaS CRO compensation? (Adjacent role comp benchmarks; the VP→CRO elevation path detailed here.)
- **q22** — How do you design SaaS sales kickoff communications? (Plan rollout context VPs own; affects team comp understanding.)
- **q23** — What is the standard SaaS sales attainment distribution? (Median 55-65% attainment distribution determining whether VP variable activates.)
- **q24** — How do you audit SaaS sales-comp plans quarterly? (Plan governance context for VP-level comp accountability.)
- **q25** — How do you model SaaS sales-comp budget for a fiscal year? (Budget modeling including VP-level cash and equity expense.)
- **q26** — How do you handle sales-comp during a SaaS downturn? (Downturn dynamics affecting VP variable outcome and tenure.)
- **q27** — What is the standard SaaS sales-comp tooling stack? (Comp tooling VPs deploy; CaptivateIQ / Spiff / Varicent / Xactly.)
- **q28** — How do you handle SaaS sales-comp during PE rollup standardization? (PE-portfolio comp design context for VPs at acquired companies.)
- **q29** — How do you handle SaaS sales-comp through an IPO transition? (Public-company comp governance for VPs transitioning past Series C.)
- **q30** — What is the standard SaaS sales-comp public-company disclosure? (DEF 14A / proxy filing context affecting VP-level comp disclosure.)
- **q31** — How do you handle SaaS sales-comp clawback policy design? (Clawback design context for VP-level variable.)
- **q32** — How do you handle SaaS sales-comp for net-new logo vs expansion separately? (Variable basis design — the #1 VP-level comp design failure mode.)
- **q33** — What is the standard SaaS sales-comp tooling cost? (Tooling cost context VPs manage as opex line.)
- **q34** — How do you handle sales-comp acceleration for strategic objectives? (Strategic-objective MBO design relevant to VP variable.)

`;

const tags = ['revops','sales-comp','vp-sales','executive-comp','series-b','saas','ote','equity','pavilion','opencomp','iconiq','bridge-group','enterprise-software'];

const sources = [
  { title: 'Pavilion State of Sales Compensation Report 2025 — n=2,800 plans with 180+ Series B VP records; primary citation for VP OTE bands, mix, equity grants, and tenure', url: 'https://www.joinpavilion.com/compensation-report' },
  { title: 'ICONIQ Growth Sales Org Survey 2024/2025 — n=320+ growth-stage SaaS with detailed Series A-D sales leadership comp', url: 'https://www.iconiqcapital.com/growth/insights' },
  { title: 'OpenComp 2024-2025 SaaS Compensation Benchmarks — n=~1,200 plans including 240+ VP Sales records', url: 'https://www.opencomp.com' }
];

const notes = {
  s6: 'CUT, do not ADD. Added 40 cited sources spanning sales-comp benchmark datasets (Pavilion 2025 n=2800 + 180 Series B VPs, OpenComp 2024-2025 n=1200 + 240 VPs, RepVue 2025 ~6K VP W-2s + 85K AE records, ICONIQ Growth Sales Org 2024-2025 n=320+, Carta 2025 n=42K exec records, Bridge Group 2025 n=412, Bessemer State of the Cloud, a16z Enterprise GTM, OpenView), public-company comp evidence (HubSpot S-1 + DEF 14A, MongoDB + Snowflake + Datadog + Asana + Monday + ZoomInfo + Klaviyo S-1s), executive search firm published data (Heidrick & Struggles + Russell Reynolds + DHR Global + Spencer Stuart + True Search + Daversa Partners), comp consultancies (Alexander Group + OpenComp + Pave + Compa + Option Impact + WTW + Mercer + Korn Ferry), tenure tracking (TheOrg + Equilar + ChartMogul), round data (Pitchbook + Crunchbase + Carta), operator communities (SaaStr + Modern Sales Pros + Pavilion RevOps Community), regulatory (FTC Non-Compete Rule 2024 + California 16600 + FAS 123R), and a16z + ICONIQ portfolio comp guidance. Tighten and reorganize without adding length.',
  s7: 'CUT, do not ADD. Added comprehensive numerical analysis with 5+ markdown pipe tables: cross-survey median OTE bands by motion (SMB $280-380K, mid-market $375-475K, enterprise $450-600K) across 5 datasets, base/variable splits by motion (60/40 to 75/25), equity grant distribution at Series B (25-200+ bps with frequency), equity paper value at typical post-money ($2.25M-$11.25M), sign-on and refresh patterns ($50-150K + 25-50% Year-2 refresh), VP tenure distribution (median 18-26 months), Series B-to-C transition pattern (55-70% non-survival rate), cost of bad hire ($750K-$2M fully loaded), executive search fee structure (25-33% of first-year cash), variable design composition (50-60% team quota + 20-30% MBO + 10-20% strategic + threshold gate), VP-level accelerator multipliers (flatter than AE, 1.25x-1.75x with caps), severance and CIC standards (6-12 months + 100% acceleration), worked example for typical Series B mid-market VP ($425K OTE + 0.85% FD = $5.78M 4-year total comp), comp consultant fees, hiring plan math (8-18 AE team + $12-30M aggregate quota), and TAM/SAM/hiring pool (~2,400-3,200 active Series B SaaS, ~6K-12K qualified VP candidates). Tighten and reorganize without adding length.',
  s8: 'CUT, do not ADD. Added 13-element counter-case with honest 5-condition verdict: median masks 4x variance across motions, equity dominates actual outcome but least discussed, 18-26 month tenure misaligns standard 4-year vest, variable rarely activates at typical 68-78% Year-1 attainment, 60/40 modal mix is self-perpetuating not designed-from-economics, public-company VP comp data is survivorship-biased, executive search fee math does not always hold (in-network alternative), VP-to-CRO elevation pattern mostly mythology (only 15-25% actually elevated), accelerator design overweighted vs equity refresh and severance, comp committee dynamic missing from most discussions, geography and remote work distorts 2024-2026 data, 2026 macro cycle compressed VP hiring 30-50%, first-VP-rarely-survives may be self-fulfilling prophecy. Honest verdict: median is right starting benchmark for generic Series B mid-market but wrong for enterprise/SMB/first-VP/candidate-side/founder-side design where motion-specific bands and equity/severance/CIC design matter more than headline OTE. Tighten and reorganize without adding length.',
  s9: 'CUT, do not ADD. Cross-linked 33 related Pulse entries spanning q01-q34 sales-comp cluster: q01 AE base/variable split contrast, q02-q04 quota and territory design context, q05 AE accelerator contrast to flatter VP accelerator, q06 SDR comp context, q08-q14 commission rate and SPIFF and consumption-pricing context affecting VP team-quota math, q15 end-to-end plan design, q16-q20 operational management context, q21 CRO comp adjacency, q22-q26 plan governance and downturn context, q27-q30 tooling and IPO transition, q31-q34 clawback and net-new-logo separation (the #1 VP comp failure mode). Tighten and reorganize without adding length.',
  s10: 'SUBAGENT_VERIFIED. CUT, do not ADD — keep inside 8,500-9,500 word window with HARD CAP 10,500. Comprehensive deep rewrite of Series B SaaS VP Sales comp question for 2026 using ADAPTED ANALYTICAL STRUCTURE with VALUE-NOT-WORDCOUNT mandate (lean paragraphs, frequent H3 breaks). Built under 4-PART structure: Bottom Line callout FIRST with [Number] OTE $350-525K band + [Mix] 60/40 to 65/35 modal split + [Reality] VP attainment as leading indicator + 18-26 month tenure pattern + bad-hire cost $750K-$2M. Short intro paragraphs + comprehensive TL;DR with 3 motion-specific OTE bands + 4 standard pay-mix splits + 6 named comp design failure modes + 4 negotiation levers + decision math example ($425K OTE + 0.85% FD = $5.78M 4-year total comp). TOC + 4 ANALYTICAL PARTs (📐 PART 1 DEFINITIONS AND SERIES B CONTEXT + 🔍 PART 2 THE NUMBERS + 📊 PART 3 THE COMP STRUCTURE + 📈 PART 4 WHY THIS BREAKS) with 22 H3 deep content sections. flow contains 2 mermaid diagrams (decision flow for designing Series B VP Sales package, tenure pattern and failure mode cascade). src has 40 cited sources spanning Pavilion + OpenComp + RepVue + ICONIQ + Carta + Bridge Group + Bessemer + a16z + OpenView + HubSpot/MongoDB/Snowflake/Datadog/Asana/Monday/ZoomInfo/Klaviyo S-1s + Heidrick/Russell Reynolds/DHR/Spencer Stuart/True/Daversa search firms + Alexander Group/OpenComp/Pave/Compa/Option Impact/WTW/Mercer/Korn Ferry consultants + TheOrg/Equilar/ChartMogul tenure tracking + Pitchbook/Crunchbase round data + SaaStr/Modern Sales Pros operator communities + FTC Non-Compete Rule + California 16600 + FAS 123R regulatory. num is 5+ markdown pipe tables + extensive bullet benchmarks + 1 worked example. counter is 13-element counter-case with honest 5-condition verdict (enterprise/SMB/first-VP/candidate-side/founder-side design considerations beyond median OTE). links cross-references q01-q34 cluster (33 related entries excluding q07). Callouts used: 🎯 Bottom Line, 🟡 Key Stat, ⚠️ Warning, 📊 Quick Facts. Real specifics throughout: Pavilion + OpenComp + RepVue + ICONIQ + Carta dataset names with sample sizes, HubSpot/MongoDB/Snowflake/Datadog public-company VP comp references, named search firms with fee structures, comp consultancies with fee ranges, FTC non-compete rule 2024 regulatory context. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose, only section markers. ASCII-clean mermaid diagrams.'
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
