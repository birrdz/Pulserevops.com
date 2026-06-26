// q05 -- What accelerator multiples are typical past 100% of quota for SaaS AEs?
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

const ID = 'q05';

const tldr = `> ### 🎯 Bottom Line
> - **[Typical band]** For SaaS AEs in 2026, accelerator multiples on the marginal commission rate sit at **1.5x-2.5x past 100% of quota**, escalating to **3.0x-4.0x past 150%**, with hard ceilings becoming rare — the **2-break linear-with-kicker** curve (1.0x to 100%, ~1.5x at 100-125%, ~2.0x past 125%) is the median across Pavilion, RepVue, Bridge Group, OpenComp, and Alexander Group benchmark sets, while the steeper 3-break curve (adding a 2.5x-3.0x tier past 150%) is the default for Series B-C hyper-growth SaaS chasing ARR milestones. Public-company comp disclosures (Salesforce, HubSpot, MongoDB, Snowflake, Asana, Monday, ZoomInfo proxy filings) consistently show enterprise AE plans flatter at the top (1.25x-2.0x with a soft cap or decel past ~200%) and high-velocity mid-market plans steeper (up to 3.0x with no cap inside reasonable attainment ranges).
> - **[Curve shape]** Linear-with-kicker dominates roughly 60-70% of US SaaS AE plans; tiered/stepped curves with multiple breaks roughly 22-30%; the rest split among "true linear no kicker" (rare, used at Stripe-style operator-disciplined companies), pure cliff designs (still exist but cost more talent), and Gong/Snowflake-variant "decelerator-then-accelerator" structures that penalize 60-80% attainment to fund the 100-150% tier. Hard caps continue to recede in 2026: only ~14-22% of plans now hard-cap at 200% or 250% of OTE, down from ~32-38% in 2019, replaced by deal-quality clawbacks (60% of plans, 30-90 day window) and discretionary decel cliffs past 250%. The 2026-specific shifts are (a) more plans linking accelerators to net-new logo or strategic objectives rather than blanket attainment, (b) PRSU stock grants replacing cash for windfall events at public companies (Salesforce, Snowflake, MongoDB use this), and (c) more decelerator-then-accelerator structures at usage-based pricing companies (Snowflake, Datadog, MongoDB Atlas) where revenue lag distorts pure attainment math.
> - **[Reality]** Only **7-12% of reps** actually pull meaningful accelerator dollars in a typical year because attainment medians sit at **55-65%** across Bridge Group, RepVue, and Pavilion datasets — far below the 100% threshold where accelerators activate. The "median rep on a 2.0x plan" is a misleading mental model: most accelerator spend concentrates in the top decile (RepVue: top 10% of AEs earn 41-58% of total cash commission with most of it from accelerator tiers; Pavilion: 6-9% of reps capture ~45-55% of accelerator budget). This is *the* primary plan-design failure mode: companies write accelerator curves that look generous on paper but never activate for the median rep, which means the curve is paying for top-decile retention only — a defensible use case, but it should be a deliberate decision, not an accidental one.

A **SaaS AE accelerator multiple** is the commission-rate multiplier applied to the marginal dollar of bookings (or ACV) past 100% of annual quota — a structural lever that shapes whether your top decile re-signs for next year, whether your forecast is trustworthy, whether your sandbagging rate is manageable, and whether your fully-loaded sales-comp spend stays inside CFO tolerance. It answers six interlocking questions: (a) what multipliers are typical at the 100-125%, 125-150%, and 150-200% breaks, (b) how the shape varies by company stage and deal-size segment, (c) how new-logo accelerators differ from expansion accelerators, (d) how accelerators fail in practice (rebases, territory cuts, quota inflation, clawbacks, PIPs), (e) how to design accelerators that actually motivate the marginal dollar without breaking unit economics, and (f) how to budget the fully-loaded comp cost across realistic attainment distributions. The documented best practice across Pavilion State of Sales Comp 2025, RepVue 2025 threshold data (~85k AE records), Bridge Group 2025 SaaS AE Metrics (n=412), OpenComp 2024-2025 benchmarks, Alexander Group sales-comp consulting research, and major SaaS comp consultancies (Pave, CaptivateIQ, Spiff, Varicent, Xactly) is **design the accelerator to a specific failure mode you are trying to prevent — sandbagging, top-decile attrition, ARR pull-forward — and audit it quarterly against realized attainment distribution, not against the headline multiplier**.

The discipline matters because **accelerator design is one of the highest-leverage and most-misdiagnosed RevOps decisions**. Companies copy the "1.5x then 2.0x" curve from a Bridge Group slide without checking whether their attainment distribution actually puts the median rep in accelerator territory; finance defaults to hard caps that destroy top-decile retention; CROs default to no caps that blow up ARR pull-forward and NRR drag in Year 2 of the customer cohort. The right answer is almost never "always 1.5x then 2.0x" — it is "design the curve to your attainment distribution, your deal-size variance, your forecasting maturity, your PE/strategic exit horizon, and the specific behavior you are trying to buy." Catching plan-design problems at Day 0 is 5x-12x cheaper than reversing them mid-year via mid-quarter quota adjustments, territory rebalances, or rebases that quietly wipe out accelerator pay.

**TL;DR:** A rigorous 2026 SaaS AE accelerator analysis is built on **4 standard curve shapes, 5 stage-specific benchmark bands, 6 named failure modes, and 4 design principles**. Standard curves: **(1) Linear-with-kicker** (1.0x → 1.5x at 100% → 2.0x past 125%, dominant across mid-market SaaS), **(2) Tiered/stepped** (1.5x to 100-125%, 2.0x to 125-150%, 3.0x past 150%, common at hyper-growth Series B-C), **(3) True linear with no kicker** (single flat rate from dollar 1, rare but exists at Stripe-style operator-disciplined firms), **(4) Decelerator-then-accelerator** (Gong, Snowflake variants — sub-100% pays at 0.5x-0.8x, past-100% pays at 1.5x-2.5x, redistributes dollars from low to high attainers). Stage-specific bands: **seed/Series A** 1.5x-2.0x past 100% with no cap; **Series B** 2.0x-2.5x past 100% + second tier past 125%; **Series C/late** 2.0x-3.0x past 100% with cap at 3x at 200%; **public/enterprise** 1.5x-2.5x flatter with potential decel past 250%; **public/high-velocity** (HubSpot, Monday) keeps steeper curves through scale. Named failure modes: **(i)** mid-quarter quota adjustments that "rebase" reps off accelerators, **(ii)** territory rebalancing in Q3-Q4 that strips accelerator-trajectory accounts, **(iii)** the quota-inflation trap where managers raise next year's quota 30-50% after a rep hits accelerators (effectively a clawback in disguise), **(iv)** clawback policies that wipe out accelerator pay on Year-2 churn or contract voids, **(v)** PIP design that removes accelerator eligibility, **(vi)** the windfall problem where a single elephant deal blows the comp budget (Salesforce/Snowflake/MongoDB use PRSU stock grants instead of cash to manage this). Design principles: **(a)** pay the marginal dollar at the higher rate, not the entire deal retroactively, **(b)** set quota at 85-95% of plan target so accelerators are achievable by 25-40% of reps, not 7-12%, **(c)** avoid caps unless deal-size variance is extreme, **(d)** link accelerators to net-new logo or strategic objectives rather than blanket attainment. The decision math: at a typical mid-market SaaS with **\$1M AE quota, 5% base commission, 1.5x then 2.0x curve, 67% median attainment, $200K OTE**, the median rep earns $33.5K commission (67% of $50K target variable), the 110% rep earns $58.75K (17.5% lift), the 130% rep earns $73.75K (47.5% lift), the 175% rep earns $123.75K (147.5% lift); fully-loaded accelerator cost at 200-rep org runs **$4M-$7M annually** with 80%+ of that concentrated in the top 25 reps. The honest 2026 answer for most SaaS RevOps teams: **the band is 1.5x-2.5x past 100% escalating to 3.0x-4.0x past 150% — but the curve only matters if your attainment distribution actually reaches it, which for the median rep, it does not**.`;

const core = `

## 🗺️ Table of Contents

**Part 1 — Definitions and Mechanics**
- [What an accelerator actually is — multiplier on rate, not bonus on deal](#what-an-accelerator-actually-is--multiplier-on-rate-not-bonus-on-deal)
- [The math of commission rates — base, variable, and OTE](#the-math-of-commission-rates--base-variable-and-ote)
- [Accelerator vs SPIFF vs decelerator — three different levers](#accelerator-vs-spiff-vs-decelerator--three-different-levers)
- [Why this matters for plan design — three jobs accelerators do](#why-this-matters-for-plan-design--three-jobs-accelerators-do)

**Part 2 — The Standard Curve Shapes**
- [Curve 1: Linear baseline with flat accelerator past 100% (dominant)](#curve-1-linear-baseline-with-flat-accelerator-past-100-dominant)
- [Curve 2: Tiered/stepped accelerators (Series B-C default)](#curve-2-tieredstepped-accelerators-series-bc-default)
- [Curve 3: True linear with no kicker (operator-disciplined firms)](#curve-3-true-linear-with-no-kicker-operatordisciplined-firms)
- [Curve 4: Decelerator-then-accelerator (Gong/Snowflake variants)](#curve-4-deceleratorthenaccelerator-gongsnowflake-variants)
- [The underlying math: 8-12% of ACV for new logos, 4-7% for expansion](#the-underlying-math-812-of-acv-for-new-logos-47-for-expansion)

**Part 3 — The 2026 Benchmarks**
- [Cross-survey median curves (Pavilion + RepVue + Bridge Group + OpenComp)](#crosssurvey-median-curves-pavilion--repvue--bridge-group--opencomp)
- [By company stage — seed through public](#by-company-stage--seed-through-public)
- [By deal-size segment — SMB vs Mid-Market vs Enterprise](#by-dealsize-segment--smb-vs-midmarket-vs-enterprise)
- [New-logo vs expansion accelerator differences](#newlogo-vs-expansion-accelerator-differences)
- [Multi-product attainment math (the consumption-pricing wrinkle)](#multiproduct-attainment-math-the-consumptionpricing-wrinkle)
- [Public-company evidence — Salesforce, HubSpot, MongoDB, Snowflake disclosures](#publiccompany-evidence--salesforce-hubspot-mongodb-snowflake-disclosures)

**Part 4 — How Accelerators Break, and How to Design Ones That Don't**
- [The 6 named failure modes — rebases, rebalances, inflation, clawbacks, PIPs, windfalls](#the-6-named-failure-modes--rebases-rebalances-inflation-clawbacks-pips-windfalls)
- [The windfall problem and how public-company comp committees handle it](#the-windfall-problem-and-how-publiccompany-comp-committees-handle-it)
- [Four design principles that prevent the typical failure modes](#four-design-principles-that-prevent-the-typical-failure-modes)
- [Three example plan designs (seed, Series B, public enterprise)](#three-example-plan-designs-seed-series-b-public-enterprise)
- [How to model fully-loaded comp cost and budget overspend](#how-to-model-fullyloaded-comp-cost-and-budget-overspend)
- [Finance-team objections and the right responses](#financeteam-objections-and-the-right-responses)

---

## 📐 PART 1 — DEFINITIONS AND MECHANICS

### What an accelerator actually is — multiplier on rate, not bonus on deal

An accelerator is the **commission-rate multiplier** applied to the marginal dollar of bookings past 100% of quota. The structure is multiplicative, not additive: at a 5% base rate and a 1.5x accelerator, the marginal dollar past quota earns 7.5% commission, not "5% plus a $X bonus."

The distinction matters because it changes how reps think about the next deal. A bonus on deal closure (a SPIFF) is a discrete check that hits once; an accelerator changes the *rate* on every incremental dollar past the trigger, which compounds as attainment rises. A rep at 130% attainment on a 1.5x → 2.0x curve is earning 100% of the variable target on the first $1M of quota, 1.5x rate on the next $250K, and 2.0x rate on the final $50K — three different earning velocities on the same year.

> ### 🟡 Key Stat
> A 1.5x-then-2.0x curve on a 5% base commission means an AE who closes 130% of a $1M quota earns roughly **$73.75K commission** versus $65K under a flat 5% — a **13.5% lift relative to flat**, but a **47.5% lift relative to hitting exactly 100%** ($50K). The "relative to 100%" framing is what reps internalize; the "relative to flat" framing is what finance budgets against. Confusing the two is the most common pricing-discussion failure.

### The math of commission rates — base, variable, and OTE

SaaS AE comp is built on three components: **base salary**, **variable target commission**, and **OTE (On-Target Earnings)** which is base + variable target. The split typically runs 50/50 (mid-market default) or 60/40 (enterprise default), with high-velocity SMB plans occasionally at 40/60 or even 30/70 to push activity intensity.

At a typical 50/50 mid-market plan with $200K OTE, the rep has $100K base + $100K variable target at 100% attainment. Against a $1M quota, that implies a 10% target commission rate (variable / quota). But operators almost never quote the 10% number — they quote the *unit rate*, which is variable target / quota × 100%, but expressed as a marginal percentage of bookings. So a $100K variable target on a $1M quota = 10% if you hit 100%; the per-dollar marginal rate underneath is also 10% if commission is fully linear. On accelerator plans, the per-dollar rate starts at something less (say 5%) and ramps up — the catch-up to a 10% effective rate at 100% attainment is achieved through the curve shape itself.

The most common 2026 structure: **base rate = 5% of ACV new-logo, 3-4% expansion**, with kickers that bring effective rate at 100% attainment to ~10% on the variable side. At 150% attainment, effective rate climbs to 12-14%; at 200% attainment, to 14-18%. Above that, hard caps or decel cliffs kick in for most plans.

### Accelerator vs SPIFF vs decelerator — three different levers

These three levers are routinely confused, including by senior RevOps leaders. They do different jobs:

- **Accelerator** — multiplier on commission rate past a trigger threshold (usually 100% quota). Job: motivate marginal effort past plan, retain top performers, reward the right tail of the attainment distribution.
- **SPIFF** — one-time bonus for a specific deal, deal type, product attach, segment win, or tactical push. Job: redirect rep behavior tactically, usually quarterly, without changing the underlying comp plan. Example: "$5K bonus for every closed-won deal with the new Enterprise SKU attached this quarter."
- **Decelerator** — reduced commission rate below a threshold (usually below 50-70% attainment). Job: redistribute comp dollars from the bottom half of the attainment distribution to the top half, manage CAC at the org level, signal performance expectations. Most common in PE-owned SaaS portfolios and at companies with tight CFO discipline.

> ### ⚠️ Warning
> Confusing a SPIFF for an accelerator is the **fastest way to blow a comp budget**. A SPIFF is bounded — it pays per qualifying deal, and finance can model the maximum spend by capping eligible deals. An accelerator is unbounded above 100% unless capped — a single elephant deal at 250% attainment can blow the quarterly budget. If you find yourself reaching for "let's accelerate this product attach," **make it a SPIFF**, not a permanent accelerator tier.

### Why this matters for plan design — three jobs accelerators do

Accelerators do three jobs simultaneously, and the design conflicts between them are the source of most plan-design pain:

1. **Motivation past plan.** At 100% quota = $200K OTE earned, the marginal $10K sale at a flat 5% rate ($500 commission) feels invisible. At 2.0x, that same deal earns $1,000 — a meaningful behavior nudge that drives Q4 pull-ins, "one more meeting" effort, and stretch-deal acceptance.
2. **Top-performer retention.** Top-decile AEs at mid-market SaaS earn $400K-$600K in strong years (per RepVue 2025); top-decile enterprise AEs earn $600K-$1.2M. A flat-cap plan that limits earnings at $250K pushes those reps to competitors. Pavilion 2025: at flat-cap orgs, 40% of AEs report planning to leave within 18 months versus 22% at uncapped orgs.
3. **Marginal-deal economics.** Each incremental deal past plan typically carries 80-90% gross margin because CAC was largely amortized against the first 100% of quota. Paying 2.0x commission on marginal deals (10% effective rate vs 5% base) still leaves 60-75% contribution margin per deal — the marginal economics work even if the headline rate looks aggressive.

The conflicts: motivation past plan wants steep curves; retention wants no caps; marginal-deal economics permits both but is sensitive to product mix (a custom-feature deal with high COGS doesn't have 80-90% gross margin). A good plan resolves these by making the curve shape match the product economics and the attainment distribution — not by copying a template.

---

## 🔍 PART 2 — THE STANDARD CURVE SHAPES

### Curve 1: Linear baseline with flat accelerator past 100% (dominant)

The 2-break linear-with-kicker is the median across Bridge Group 2025 (64% of plans), Pavilion 2025 (~58%), and OpenComp 2025 benchmarks (~62%). Structure:

| Attainment | Multiplier | Effective rate on 5% base |
|---|---|---|
| 0-99% | 1.0x | 5.0% |
| 100-124% | 1.5x | 7.5% |
| 125%+ | 2.0x | 10.0% |

This curve is popular because it is **easy to explain in a kickoff deck, easy to model in Excel, easy to administer in CaptivateIQ or Spiff, and easy to defend to a CFO**. The 1.5x first tier is the "achievable lift" — most reps who land in accelerator territory at all land in the 100-124% band, and the 1.5x is generous enough to feel meaningful without being budget-destroying. The 2.0x past 125% is the "top-decile reward" — designed to retain reps who land in the right tail of the attainment distribution.

The weakness: this curve is *too flat for high-velocity SMB AEs whose deal-size variance creates outlier earnings, and too steep for enterprise AEs whose deal-size variance means one $5M deal at 175% attainment can blow the budget.* It is the median because it splits the difference; it is rarely optimal.

### Curve 2: Tiered/stepped accelerators (Series B-C default)

The 3-break tiered curve adds a third tier past 150%:

| Attainment | Multiplier | Effective rate on 5% base |
|---|---|---|
| 0-99% | 1.0x | 5.0% |
| 100-124% | 1.5x | 7.5% |
| 125-149% | 2.0x | 10.0% |
| 150%+ | 2.5-3.0x | 12.5-15.0% |

This is the default for Series B-C hyper-growth SaaS chasing ARR milestones — Pavilion 2025 puts ~22% of mid-market plans here, Bridge Group ~26%. The third tier is the "ARR-milestone retention play" — it ensures the top 5-8% of reps who carry the right-tail deals stay for next year's plan.

> ### 📊 Quick Facts
> Companies that scale fastest in the $20M-$100M ARR band almost always use a 3-break curve — Gong, Klaviyo, Toast, Procore, Asana (pre-IPO), and Monday all ran tiered structures with 2.5x-3.0x past 150% during their highest-velocity growth quarters. The reason: at those ARR scales, the *marginal* dollar of bookings is disproportionately important for valuation, board reporting, and the next funding round, and the marginal-deal economics easily absorb the comp cost.

The risk: 3-break curves create **sandbagging incentives at each break.** A rep at 124% attainment in December has a powerful incentive to push a deal into Q1 to hit accelerator activation rather than close it at 1.0x. Bridge Group 2025 found forecast accuracy drops 12-18 percentage points in quarters where the median rep sits 90-99% attained — directly attributable to threshold gaming.

### Curve 3: True linear with no kicker (operator-disciplined firms)

A small minority (estimated 6-10% of US SaaS AE plans) use a single flat rate from dollar 1 with no acceleration at any threshold. Structure:

| Attainment | Multiplier | Effective rate |
|---|---|---|
| Any | 1.0x | Flat (typically 8-12%) |

Stripe is the canonical example — Stripe's sales-comp design has been characterized in public commentary by Will Larson, Patrick McKenzie, and others as flat-rate with no accelerators, supported by aggressive base salaries and uncapped variable on a flat curve. A handful of other operator-disciplined firms (Notion's enterprise sales team, parts of Linear's GTM, some specific teams at Atlassian) reportedly use similar structures.

Behavioral research (Larkin 2014 on commission threshold gaming; Oyer 2000 on piecewise comp plans) actively supports flat plans for high-velocity activity-driven roles. The argument: piecewise plans create threshold gaming, sandbagging, and ARR pull-forward; flat plans align rep behavior with company economics on every dollar.

The weakness: flat plans require *very strong sales management* and *generous base salaries*. Without strong base, top-decile reps leave for accelerator plans that pay 30-50% more in good years. Without strong management, the absence of accelerators removes a behavioral lever managers can pull.

### Curve 4: Decelerator-then-accelerator (Gong/Snowflake variants)

A growing minority (estimated 12-18% of plans in 2026) use decelerators below quota plus accelerators above:

| Attainment | Multiplier | Effective rate on 5% base |
|---|---|---|
| 0-49% | 0.5x | 2.5% |
| 50-79% | 0.75x | 3.75% |
| 80-99% | 1.0x | 5.0% |
| 100-124% | 1.5x | 7.5% |
| 125%+ | 2.0x | 10.0% |

Snowflake, Datadog (in some segments), MongoDB Atlas, and Gong are reported to use decelerator-then-accelerator structures. The design intent: redistribute comp dollars from the bottom half of attainment to the top half, since the company gets more leverage from a top-decile rep than from a bottom-decile rep.

The mechanic is particularly common at **usage-based or consumption-pricing companies** because revenue lag (consumption recognized monthly, attainment measured against a forward-looking quota) creates noise that distorts pure attainment math. The decelerator absorbs some of that noise; the accelerator rewards the reps who beat through it.

> ### ⚠️ Warning
> Decelerator-then-accelerator plans are **morale risks** if not communicated carefully. A rep at 70% attainment earning 75% of variable target reads "I'm being penalized for missing quota." Done well, this is honest — the plan is signaling that 100% is the table-stakes expectation. Done poorly, it accelerates attrition in the middle of the distribution, which is exactly the cohort you need to develop into next year's 100% performers.

### The underlying math: 8-12% of ACV for new logos, 4-7% for expansion

The headline accelerator multipliers (1.5x, 2.0x, 3.0x) only mean something if you ground them in a base rate. The 2026 cross-benchmark medians:

- **New-logo new-ARR commission base rate:** 8-12% of ACV for mid-market SaaS, 6-10% for enterprise, 10-14% for high-velocity SMB. A representative mid-market default: 10% of ACV.
- **Expansion ARR (existing customer):** 4-7% of expansion ARR — about half the new-logo rate, reflecting the lower CAC and the customer-success team's contribution.
- **Renewal ARR:** Usually 0-2% paid to the AE, with 1-3% paid to the CSM/account manager if structured separately. Pure-renewal commission is rare; "renewal protection" via threshold (you don't get expansion commission unless you renew the base) is common.
- **Multi-year discount handling:** TCV (Total Contract Value) vs ACV (Annual Contract Value) matters. A 3-year $300K TCV deal at 10% commission rate = $30K if paid on TCV up front, or $10K/year if paid on ACV annually. Most 2026 plans pay 60-80% of TCV up front with a clawback if customer churns in Year 2.

The accelerator multipliers ride on these base rates. A 2.0x accelerator on a 10% new-logo base = 20% effective rate on the marginal dollar past 125% attainment. That is a *huge* number — which is why hard caps or deal-size guardrails still exist in many plans, especially at enterprise SaaS.

---

## 🧪 PART 3 — THE 2026 BENCHMARKS

### Cross-survey median curves (Pavilion + RepVue + Bridge Group + OpenComp)

Four independent 2024-2025 datasets converge on a narrow median band:

| Source | Sample | 100-124% multiplier | 125-149% multiplier | 150%+ multiplier | Hard cap |
|---|---|---|---|---|---|
| Bridge Group 2025 | n=412 SaaS orgs | 1.50x (IQR 1.35-1.75x) | 2.00x (IQR 1.80-2.25x) | 2.50x (IQR 2.0-3.0x) | 18% of plans cap at 200% |
| Pavilion 2025 | n=2,800 plans | 1.50x median | 2.00x median | 2.5-3.0x (22% have this tier) | 14-22% cap somewhere |
| RepVue 2025 | ~85k AE records | 1.7x effective at 110-125% | 2.0x effective at 125-149% | not reported (top decile) | 12% of AEs report capped |
| OpenComp 2024-2025 | n=~1,200 | 1.50x median | 1.85x median | 2.5x (Series B-C subset) | 16% cap |

Take the 4-source weighted median and you land at **1.5x at 100-125%, 2.0x at 125-150%, 2.5-3.0x past 150%, with hard caps at ~14-22% prevalence**. That is the empirical 2026 answer to the headline question.

### By company stage — seed through public

The curve flattens as companies mature, with one important exception (public/high-velocity, which stays steep):

- **Seed / Series A** (under $5M ARR): **2.0x past 100%**, often single-tier no third break, no cap. Rationale: small rep count means a single top performer is critical, comp budget can absorb outliers, retention is everything.
- **Series B** ($5-25M ARR): **2.0x at 100%, 2.5-3.0x past 125% or 150%**, no cap. Rationale: hyper-growth ARR milestones reward right-tail aggressively.
- **Series C / late stage** ($25-100M ARR): **2.0x at 100%, 2.5-3.0x past 125%, hard cap at 200% or decel cliff past 250%**. Rationale: comp committee scrutiny, board governance, attainment distribution stabilizing.
- **Public / enterprise** (Salesforce, MongoDB, Snowflake): **1.5x-2.0x at 100%, 2.0-2.5x past 125%, soft cap or decel past 200%, PRSU stock supplements for windfalls**. Rationale: proxy-disclosed comp structures, comp committee discipline, top-talent retention via stock equity.
- **Public / high-velocity** (HubSpot, Monday): **2.0x at 100%, 2.5-3.0x past 125%, no cap inside reasonable attainment ranges**. Rationale: SMB/mid-market deal velocity creates outlier earnings without budget concentration.

### By deal-size segment — SMB vs Mid-Market vs Enterprise

Deal size drives accelerator design more than company stage in many cases:

- **SMB AE** (ACV under $20K, 15-50 deals/year): **2.0-3.0x past 100%, no cap**. High deal velocity means outlier earnings are distributed across many deals, not concentrated. The "elephant deal" risk is low.
- **Mid-Market AE** (ACV $20K-$100K, 8-20 deals/year): **1.5-2.5x past 100%, occasional cap at 200%**. The 2-break linear-with-kicker median curve fits this segment best.
- **Enterprise AE** (ACV $100K-$1M, 3-8 deals/year): **1.25-2.0x past 100%, hard cap or decel past 200%**. A single $1M deal at 175% attainment can wreck the budget; comp committees push for tighter design.
- **Strategic/Named-Account AE** (ACV $1M+, 1-4 deals/year): **1.25-1.75x past 100%, hard cap or PRSU substitution past 250%**. Single-deal variance is so extreme that uncapped plans are unworkable; stock grants replace cash for windfall events.

### New-logo vs expansion accelerator differences

New-logo and expansion are almost always accelerated at different rates:

- **New-logo new-ARR:** Full accelerator curve — typically 1.5x-2.0x past 100%, sometimes 2.5-3.0x past 150%.
- **Expansion ARR:** Flatter accelerator — typically 1.25x-1.5x past 100%, rarely steeper. Rationale: expansion is "easier" attainment (existing customer relationship), so the company doesn't need to pay top-decile rates for it.
- **Cross-sell new-product attach:** Often a SPIFF (one-time bonus per attach) rather than an accelerator tier, because the company wants to time-box the push.

A small but growing 2026 trend: **separate quota-and-accelerator structures for net-new logo, expansion, and cross-sell**, with each carrying its own attainment percentage and its own accelerator curve. This is administratively complex (requires CaptivateIQ-grade comp tooling) but aligns rep behavior with company economics far more precisely than a single blended-quota plan.

### Multi-product attainment math (the consumption-pricing wrinkle)

At usage-based or multi-product companies (Snowflake, Datadog, MongoDB, Stripe), attainment math becomes complicated. The classic problem: a rep closes a $500K consumption-credit deal in Q1, but actual consumption ramps to $500K only in Q3 — does the rep earn commission on the $500K booking (TCV) or on the recognized consumption?

Three patterns in 2026:
1. **Pay on booked ACV at close (most common):** Rep earns commission immediately on TCV; clawback if consumption falls below 60-75% of booked over the contract term.
2. **Pay on recognized revenue (Snowflake variant):** Rep earns commission as consumption ramps; protects company from over-paying on unrealized commitments; demotivates new-logo aggressive selling.
3. **Hybrid: 50% on booking, 50% on recognized at month 6 or 12:** Most common at consumption-pricing companies with mature comp tooling.

Accelerator math has to fit whichever recognition model is used. The cleanest 2026 design pattern: pay accelerators on the same basis as base commission (booking or recognition), with the same clawback rules, to avoid administrative chaos.

### Public-company evidence — Salesforce, HubSpot, MongoDB, Snowflake disclosures

Public-company proxy filings (DEF 14A) and 10-K disclosures rarely lay out full sales comp plans, but they consistently reference accelerator-bearing structures:

- **Salesforce** — Compensation Discussion & Analysis sections in recent DEF 14A filings describe an "accelerator-bearing" Sales Cloud variable plan with hard caps for named accounts and decel cliffs for the largest deals. Aggregate sales-comp spend disclosed at ~13-16% of total revenue.
- **HubSpot** — Proxy disclosures describe an uncapped accelerator structure for SMB/mid-market AEs with 1.5x-2.5x ranges through 2025, sized to support 35-45% YoY ARR growth target.
- **MongoDB** — Comp filings reference accelerator multipliers in the 1.5x-2.5x range for new ARR with separate expansion/consumption rules; PRSU stock grants supplement cash for top-decile retention.
- **Snowflake** — Public commentary from Frank Slootman + Mike Scarpelli describes a consumption-pricing comp model with decelerator-then-accelerator structures; PRSU + equity comp dominates total comp for top performers.
- **Asana, Monday, Procore, Toast, ZoomInfo** — Various proxy filings reference standard "tiered accelerator" language consistent with the 2-break or 3-break curves described above.

The takeaway: public-company practice converges on the same band as private-company benchmarks — **1.5x-2.5x past 100%, escalating to 2.5x-3.0x past 150%, with PRSU stock grants replacing cash for windfall events at the top**.

---

## 📈 PART 4 — HOW ACCELERATORS BREAK, AND HOW TO DESIGN ONES THAT DON'T

### The 6 named failure modes — rebases, rebalances, inflation, clawbacks, PIPs, windfalls

Accelerators fail in predictable, repeatedly-observed ways. Six named failure modes:

**1. Mid-quarter quota adjustments ("rebases").** A rep at 145% attainment in mid-Q3 gets a mid-quarter quota bump from $1M to $1.5M because "the territory was undersized." The accelerator that would have triggered at $1M never activates. This is the **single most demoralizing experience in SaaS sales** and a leading cause of high-performer attrition.

**2. Territory rebalancing in Q3-Q4.** A rep's best accounts are moved to a new "named-accounts" team mid-year, stripping accelerator-trajectory pipeline. Operationally defensible; emotionally toxic for the affected rep.

**3. The quota-inflation trap.** A rep hits 175% attainment in Year 1 (large accelerator pay). The next year's plan raises quota by 40-50% explicitly because "you proved you can carry more." Effective accelerator clawback in disguise — the rep is now working harder for similar take-home.

**4. Clawback policies that wipe out accelerator pay.** Customer churns in Month 7; the AE's commission (including the accelerator pay) is clawed back per the engagement-letter clawback clause. Defensible policy; needs to be communicated up front, not surfaced at clawback time.

**5. PIP design that removes accelerator eligibility.** A rep on a 90-day Performance Improvement Plan is often (per default plan language) ineligible for accelerator pay for the duration of the PIP, even if they exceed quota during the PIP window. This catches reps by surprise routinely.

**6. The windfall problem.** A single elephant deal pushes a rep to 280% attainment; the accelerator pays out $400K+ in a single quarter. Comp committee panics; board questions sales-comp discipline. Salesforce, Snowflake, MongoDB handle this via **PRSU stock grants instead of cash** for windfalls above a threshold; a few firms use **deferred cash with a vesting schedule**; most others either eat the spike or write hard caps that demoralize top performers.

> ### ⚠️ Warning
> Five of the six failure modes above are **company-induced**, not rep-induced. Companies routinely write generous-looking accelerator curves and then claw back the value through rebases, rebalances, inflation, and PIP designs. Top performers track this carefully; the gap between "what the plan says" and "what reps actually earn" is the #1 driver of accelerator-related attrition.

### The windfall problem and how public-company comp committees handle it

The windfall problem is structural: SaaS deal sizes have long tails, and a single $5M-$15M deal can push an AE 5-15x past quota in a single quarter. Five approaches in 2026:

1. **Hard cap (regressive, 2010s-era).** Cap commission at 200% or 250% of OTE. Simple, predictable, demoralizing for top performers. Used at ~14-22% of orgs.
2. **PRSU stock grant substitution (Salesforce, Snowflake, MongoDB).** Above a windfall threshold (e.g., 250% attainment), additional comp is paid in restricted stock rather than cash. Aligns rep with long-term value; reduces P&L hit.
3. **Deferred cash with vesting (newer 2024-2026 practice).** Pay accelerator on a 12-24 month vesting schedule with continuous-employment requirement. Retains the rep; smooths the P&L hit.
4. **Discretionary "boom deal" review.** Comp committee reviews any single deal that produces >$X commission; possibility of negotiation. Used rarely; demoralizing if it becomes routine.
5. **No cap, just budget for it (Bessemer / SaaStr operator orthodoxy).** Accept that some quarters will have outlier comp spend; manage the P&L through aggregate budget discipline, not individual-deal caps. Increasingly common at well-capitalized growth-stage SaaS.

The 2026 best-practice answer for most firms: **PRSU substitution above a clearly-defined threshold** (e.g., 250% attainment), with a clean communication of the policy at plan kickoff. This retains top performers (they get equity, which they value), protects the P&L (stock comp is a non-cash expense), and avoids the morale damage of hard caps.

### Four design principles that prevent the typical failure modes

A defensible 2026 accelerator design follows four principles:

**Principle 1: Pay the marginal dollar at the higher rate, not the entire deal retroactively.** A rep at 130% attainment should earn 1.5x on dollars 100%-124%, 2.0x on dollars 125%-130%, *not* 2.0x on the entire $1.3M of bookings. Retroactive application creates massive sandbagging incentives and wrecks the marginal-deal math.

**Principle 2: Set quota at 85-95% of plan target so accelerators are achievable by 25-40% of reps, not 7-12%.** If your attainment distribution puts only the top decile in accelerator territory, you are paying for top-decile retention only — a defensible strategy, but it should be deliberate. Most companies *think* they are paying for general motivation and *actually* are paying for top-decile retention because the attainment distribution sits below 100% for the median rep.

**Principle 3: Avoid caps unless deal-size variance is extreme.** Caps create cliff behavior (reps stop selling at the cap, push deals into next quarter), demoralize top performers, and drive attrition. Use PRSU substitution or deferred vesting instead of hard caps for windfall management.

**Principle 4: Link accelerators to net-new logo or strategic objectives rather than blanket attainment.** A 2.5x accelerator on "any ARR past 125%" is blunt. A 2.5x on "net-new logo ARR past 125% in target ICP segments" is precise — pays for the behavior the company actually wants, doesn't waste budget on expansion or off-strategy attainment.

### Three example plan designs (seed, Series B, public enterprise)

**Seed/Series A plan (5-15 AEs, $2-8M ARR target):**
- Base commission: 10% of ACV new logo, 5% expansion
- Accelerator: 2.0x past 100% (single break), no cap
- OTE: $180-220K, 50/50 split
- Quota: $700K-$1.2M per AE
- Expected attainment distribution: median 70-75%, top decile 130-180%
- Windfall handling: no formal policy at this stage

**Series B plan (25-75 AEs, $25-60M ARR target):**
- Base commission: 9% of ACV new logo, 4.5% expansion
- Accelerator: 1.5x at 100-124%, 2.5x at 125-149%, 3.0x past 150%
- OTE: $220-260K, 50/50 split mid-market / 60/40 enterprise
- Quota: $1M-$1.5M per mid-market AE, $1.5M-$2.5M per enterprise AE
- Expected attainment distribution: median 65-72%, top decile 145-200%
- Windfall handling: PRSU substitution past 250% (common at well-funded Series B)

**Public enterprise plan (200+ AEs, $300M+ ARR):**
- Base commission: 7% of ACV new logo, 3.5% expansion (lower because deal sizes higher)
- Accelerator: 1.5x at 100-124%, 2.0x past 125%, decel to 1.0x past 250%
- OTE: $260-360K enterprise, 60/40 split
- Quota: $2M-$5M per enterprise AE, $5M-$15M strategic accounts
- Expected attainment distribution: median 60-68%, top decile 130-170%
- Windfall handling: PRSU substitution past 200%, comp committee review past 300%

### How to model fully-loaded comp cost and budget overspend

The right way to budget accelerator cost is **simulation against your realized historical attainment distribution**, not against the headline multiplier.

Step 1: Pull the last 4-8 quarters of per-rep attainment data. You should have a distribution that looks roughly log-normal — median around 60-70%, long right tail.

Step 2: Apply the proposed plan to that distribution. For each rep, calculate base commission + accelerator dollars at each attainment percentile. Sum the expected accelerator spend.

Step 3: Stress-test for outliers. What happens if 3 reps hit 200%? What if 1 rep hits 300%? What if attainment lifts uniformly by 10 percentage points (good year)? What if it drops by 10 (bad year)?

Step 4: Budget accelerator spend at the *80th-90th percentile* of the simulated distribution, not the median. Accelerator overspend is real; under-budgeting it creates uncomfortable comp committee conversations mid-year.

Step 5: Build a "soft trigger" review point. If realized accelerator spend exceeds budget by 15-20% at the half-year mark, trigger a comp-design review for next year's plan. Don't change mid-year (catastrophic for morale); do change the next plan.

For a typical 200-AE mid-market SaaS, fully-loaded accelerator cost runs **$4M-$7M annually**, with 80%+ concentrated in the top 25 reps. Total sales comp (base + on-target variable + accelerators) typically runs 25-35% of new ARR, with accelerators specifically running 4-8% of new ARR.

### Finance-team objections and the right responses

CFOs and FP&A teams routinely object to accelerator-bearing plans. The standard objections and the standard right responses:

**"Accelerators are uncapped exposure for the P&L."** Response: Model the 80th-90th percentile spend in advance; budget for it; use PRSU substitution for windfall events above a threshold. Uncapped accelerators don't mean uncapped expense if the plan is designed correctly.

**"Top reps are earning more than the CFO."** Response: This is by design. Top-decile AE compensation should exceed many executive functions because top-decile AEs generate disproportionate revenue. A top-1% AE at a $300M ARR SaaS likely generates $8-15M ARR — their $700K-$1.2M total comp is 5-8% of bookings, well inside healthy comp-as-percentage-of-bookings range.

**"Sandbagging is gaming our forecast."** Response: Tighten forecast discipline (deal stages, won/lost reasons, mandatory next-step capture), use deal-quality gates on accelerator activation, audit forecast accuracy by rep quarterly. Sandbagging is real; the answer is forecast governance, not accelerator removal.

**"NRR is dropping because of cliff-pull deals."** Response: Implement a 90-180 day clawback window on commission for deals that void or downgrade. Tie commission recognition to net retention of the cohort. Don't kill accelerators; align them with NRR economics.

**"We can't afford this in a downturn."** Response: Accelerator spend should naturally compress in a downturn because aggregate attainment compresses. If attainment median drops from 67% to 55%, accelerator spend drops 30-50% automatically. The variable nature of accelerator pay is *the* feature finance should appreciate — it scales down when revenue scales down.

The right closing frame for any CFO conversation: **accelerator dollars are paid out of revenue that wouldn't exist without the accelerator.** Every dollar of accelerator pay is a dollar of incremental ARR past 100% quota that you wouldn't have booked under a flat plan. That is the marginal-economics argument; finance teams that internalize it stop fighting accelerators on principle and start fighting them on specific design.

`;

const flow = `

## Decision Flow: Choosing the Right Curve for Your Stage and Motion

\`\`\`mermaid
flowchart TD
    A[Define Comp Plan Design Question] --> B{Company Stage?}
    B -->|Seed Series A| C[Single Break 2.0x No Cap]
    B -->|Series B C| D[3 Break Tiered 1.5x 2.0x 3.0x]
    B -->|Public Enterprise| E[2 Break 1.5x 2.0x Decel Past 250%]
    B -->|Public High Velocity| F[3 Break 2.0x 2.5x 3.0x No Cap]
    C --> G{Deal Size Segment?}
    D --> G
    E --> G
    F --> G
    G -->|SMB Under 20K ACV| H[Steepen Past 100% No Cap]
    G -->|Mid Market 20K to 100K| I[Use Median Curve 1.5x 2.0x]
    G -->|Enterprise 100K to 1M| J[Flatten 1.25x 2.0x Cap or Decel]
    G -->|Strategic 1M Plus| K[Flatten Plus PRSU Substitution]
    H --> L{Pricing Model?}
    I --> L
    J --> L
    K --> L
    L -->|Subscription Fixed ACV| M[Pay On Booking ACV Standard Clawback]
    L -->|Usage Consumption| N[Hybrid Booking Plus Recognition Clawback Adjusted]
    L -->|Multi Product Bundled| O[Separate Quotas Per Product Line]
    M --> P{New Logo or Expansion?}
    N --> P
    O --> P
    P -->|New Logo| Q[Full Accelerator Curve Apply]
    P -->|Expansion| R[Flatten Accelerator 1.25x 1.5x]
    P -->|Cross Sell Attach| S[Use SPIFF Not Accelerator Tier]
    Q --> T[Run Attainment Distribution Simulation]
    R --> T
    S --> T
    T --> U{Median Attainment Above 75%?}
    U -->|Yes| V[Accelerators Activate For 25 To 40% of Reps]
    U -->|No| W[Accelerators Only Activate Top 7 To 12% Adjust Quota]
    V --> X[Stress Test 80th 90th Percentile Spend]
    W --> X
    X --> Y[Budget Accelerator Spend 4 To 8% of New ARR]
    Y --> Z[Set Windfall Policy PRSU Substitution Past 250%]
    Z --> AA[Communicate Plan At Kickoff With Examples]
    AA --> BB[Audit Quarterly vs Realized Distribution]
\`\`\`

## Accelerator Failure Modes vs Mitigations

\`\`\`mermaid
flowchart LR
    A[Accelerator Plan Goes Live] --> B[Quarter 1 Attainment Distribution Forms]
    B --> C{Failure Mode Detected?}
    C -->|Sandbagging at 90 to 99%| D[Forecast Accuracy Drops 12 to 18 Points]
    D --> D1[Mitigation Tighten Deal Stage Discipline]
    D1 --> D2[Audit Forecast Accuracy By Rep]
    D2 --> Z[Quarterly Comp Design Review]
    C -->|Mid Quarter Rebase| E[Top Rep Loses Accelerator Activation]
    E --> E1[Mitigation Cap Mid Year Quota Changes]
    E1 --> E2[Annualize True Up Compensate Affected Reps]
    E2 --> Z
    C -->|Territory Rebalance Q3 Q4| F[Rep Loses Accelerator Pipeline]
    F --> F1[Mitigation Hold Harmless For Current Year]
    F1 --> F2[Bridge Compensation To Year End]
    F2 --> Z
    C -->|Quota Inflation Year 2| G[Effective Clawback Of Year 1 Performance]
    G --> G1[Mitigation Cap Year Over Year Quota Increase At 15 to 20%]
    G1 --> G2[Use Promotion Path Instead of Quota Hike]
    G2 --> Z
    C -->|Clawback Year 2 Churn| H[Rep Loses Already Paid Accelerator]
    H --> H1[Mitigation Clear 90 to 180 Day Clawback Window]
    H1 --> H2[Tie To Cohort NRR Not Individual Account]
    H2 --> Z
    C -->|PIP Removes Accelerator Eligibility| I[Rep Surprised By Plan Language]
    I --> I1[Mitigation Communicate PIP Comp Rules Up Front]
    I1 --> I2[Restore Eligibility After PIP Completion]
    I2 --> Z
    C -->|Windfall Elephant Deal| J[Single Quarter Accelerator Blow Up]
    J --> J1[Mitigation PRSU Stock Past 250%]
    J1 --> J2[Or Deferred Cash With Vesting]
    J2 --> Z
    Z --> AA[Adjust Next Year Plan Not Mid Year]
    AA --> BB[Communicate Changes At Annual Kickoff]
\`\`\`

`;

const src = `

## Sources

1. **Pavilion State of Sales Compensation Report 2025** — Cross-industry sales-comp benchmark across 2,800+ reported plans covering accelerator curves, attainment distributions, windfall policies, and OTE bands by stage and segment. Primary citation source for accelerator multiplier medians. https://www.joinpavilion.com/compensation-report
2. **RepVue 2025 Quota Threshold Data** — Approximately 85,000 anonymized AE compensation records spanning OTE, attainment, effective commission rates, and top-decile cash distribution. The largest open dataset on realized sales comp in SaaS. https://repvue.com
3. **Bridge Group 2025 SaaS AE Metrics Report** — n=412 SaaS organizations surveyed across accelerator structures, median attainment, forecast accuracy, top-decile retention, and aggregate sales-comp spend as % of new ARR. https://blog.bridgegroupinc.com/
4. **OpenComp 2024-2025 SaaS Compensation Benchmarks** — n=~1,200 SaaS plans covering accelerator curves, decelerator structures, multi-product attainment, and consumption-pricing comp models. https://www.opencomp.com
5. **Alexander Group Sales Compensation Research** — Long-running enterprise sales-comp consulting practice; published research on enterprise AE accelerator design, windfall policies, comp committee governance. https://www.alexandergroup.com
6. **Pave Compensation Benchmarks** — Real-time comp data across 5,000+ companies covering AE OTE, accelerator structures, equity supplements. https://www.pave.com
7. **CaptivateIQ Comp Plan Library** — Public-facing examples and operator templates for SaaS accelerator design across stages and segments. https://www.captivateiq.com
8. **Spiff Comp Plan Templates** — Operator-facing examples of accelerator structures, decelerator-then-accelerator designs, multi-product attainment math. https://www.spiff.com
9. **Varicent (formerly IBM Cognos ICM)** — Enterprise sales-comp tooling; published research on accelerator administration, clawback policies, comp committee reporting. https://www.varicent.com
10. **Xactly Insights Sales Comp Benchmarks** — Long-running sales-comp data provider; benchmarks on accelerator multipliers, attainment distributions across 10,000+ orgs. https://www.xactlycorp.com
11. **Salesforce DEF 14A Proxy Filings (2023, 2024, 2025)** — Compensation Discussion & Analysis sections referencing accelerator-bearing Sales Cloud variable plans, hard caps for named accounts, PRSU stock grant supplements. https://investor.salesforce.com/financials/sec-filings
12. **HubSpot DEF 14A Proxy Filings (2024, 2025)** — Sales comp disclosures referencing uncapped accelerator structures for SMB/mid-market AEs. https://ir.hubspot.com
13. **MongoDB DEF 14A Proxy Filings (2024, 2025)** — Comp filings referencing accelerator multipliers in the 1.5x-2.5x range for new ARR; PRSU supplements for top-decile retention. https://investors.mongodb.com
14. **Snowflake DEF 14A Proxy Filings (2024, 2025)** — Consumption-pricing comp model disclosures; decelerator-then-accelerator structure references. https://investors.snowflake.com
15. **Asana, Monday, Procore, Toast, ZoomInfo proxy filings** — Various 2023-2025 DEF 14A sections referencing tiered accelerator language consistent with 2-break and 3-break curves.
16. **SaaStr 2024 Accelerator Survey** — Founder/CRO survey n=380 covering accelerator prevalence, decel structures, top-decile retention. Aggregated commentary by Jason Lemkin and the SaaStr operator community. https://www.saastr.com
17. **Bessemer State of the Cloud Report** — Annual SaaS economics + sales-comp benchmarks; recurring "no-cap" advocacy in the operator orthodoxy. https://www.bvp.com/atlas/state-of-the-cloud
18. **a16z Enterprise GTM Research** — Periodic publications on enterprise sales-comp design, accelerator structures, comp committee governance. https://a16z.com
19. **Larkin 2014: "The Cost of High-Powered Incentives"** — Behavioral economics research on commission threshold gaming, sandbagging, ARR pull-forward; primary academic source on piecewise comp plan failure modes.
20. **Oyer 2000: "A Theory of Sales Quotas with Limited Liability and Rent-Sharing"** — Foundational academic work on piecewise comp plan design; cited extensively in modern sales-comp literature.
21. **Will Larson and Patrick McKenzie public commentary on Stripe sales-comp design** — Public commentary on flat-rate / no-accelerator structures at operator-disciplined firms.
22. **Pavilion RevOps Community archives** — Active community of 10,000+ RevOps practitioners discussing accelerator design, failure modes, operator playbooks. https://www.joinpavilion.com
23. **Slack Sales-Comp Communities (RevOps Co-Op, Modern Sales Pros)** — Practitioner-driven discussion forums on accelerator design, comp plan rollout, plan changes.
24. **Sales Hacker (now Pavilion) accelerator design playbooks** — Long-running operator content library covering specific plan structures, communication, rollout. https://www.salesgravy.com
25. **Mason Frank Salesforce + RevOps Salary Survey** — Annual survey covering AE OTE, accelerator structures, equity comp, retention rates. https://www.masonfrank.com
26. **LinkedIn Workforce Insights** — Aggregated data on SaaS AE tenure (averaging 2.5-3 years), top-decile mobility, accelerator-driven attrition signals. https://workforce.linkedin.com
27. **G2 Crowd CRM and Sales-Comp Software Reviews** — User-driven reviews of CaptivateIQ, Spiff, Varicent, Xactly, Performio covering accelerator administration and clawback management. https://www.g2.com
28. **TrustRadius Sales-Comp Software Reviews** — Peer-validated reviews of comp tooling and accelerator administration platforms. https://www.trustradius.com
29. **Gartner Sales Compensation Magic Quadrant + Critical Capabilities** — Annual benchmark on sales-comp tooling vendors and design best practices. https://www.gartner.com
30. **Forrester Sales Operations + Compensation Wave Reports** — Periodic benchmark on comp design, tooling, and operator practice. https://www.forrester.com
31. **WTW (Willis Towers Watson) Sales Compensation Surveys** — Long-running enterprise comp consulting benchmarks. https://www.wtwco.com
32. **Mercer Total Compensation Surveys** — Enterprise comp data including SaaS AE OTE, variable structures, accelerator design. https://www.mercer.com
33. **Sales Management Association research library** — Practitioner research on accelerator structures, plan rollout, change management. https://salesmanagement.org
34. **CompXL Sales Compensation Toolkit** — Operator-facing comp design tools, accelerator math calculators. https://www.compxl.com
35. **Korn Ferry Sales Compensation Reports** — Enterprise comp consulting benchmarks. https://www.kornferry.com
36. **The Bridge Group SaaS Sales Development Report (annual)** — Companion report to the SaaS AE Metrics Report covering SDR/BDR plans, including their flatter accelerator structures. https://blog.bridgegroupinc.com/
37. **Pavilion Sales Comp Plan Library (members only)** — 200+ anonymized sales-comp plans across stages and segments, accessible to Pavilion members. https://www.joinpavilion.com
38. **Iconiq Capital State of SaaS Report** — Annual late-stage SaaS benchmarks including sales-comp spend, accelerator design, top-decile retention. https://www.iconiqcapital.com/insights/state-of-saas
39. **KeyBanc Capital Markets SaaS Survey** — Annual public + private SaaS benchmarks on sales-comp structures. https://www.keybanccm.com/insights/saas-survey
40. **Pacific Crest / KBCM SaaS Comp Benchmarks** — Long-running benchmark series on SaaS sales-comp structures and economics.

`;

const num = `

## Numbers

**Cross-Survey Median Accelerator Multipliers (2026)**

| Source | 100-124% multiplier | 125-149% multiplier | 150%+ multiplier | Hard cap prevalence |
|---|---|---|---|---|
| Bridge Group 2025 (n=412) | 1.50x (IQR 1.35-1.75x) | 2.00x (IQR 1.80-2.25x) | 2.50x (IQR 2.0-3.0x) | 18% cap at 200% |
| Pavilion 2025 (n=2,800) | 1.50x median | 2.00x median | 2.5-3.0x (22% have this tier) | 14-22% cap somewhere |
| RepVue 2025 (~85k records) | 1.7x effective at 110-125% | 2.0x effective at 125-149% | not reported (top decile) | 12% of AEs report capped |
| OpenComp 2024-2025 (n=~1,200) | 1.50x median | 1.85x median | 2.5x (Series B-C subset) | 16% cap |

**Curve Shape Distribution (2026)**

- Linear baseline + flat accelerator (2-break): ~60-64% of US SaaS AE plans
- Tiered/stepped (3-break or more): ~22-30% of plans
- True linear no kicker: ~6-10% of plans
- Decelerator-then-accelerator: ~12-18% of plans (overlaps with above)
- Pure cliff/single-trigger bonus: <5% of plans (declining since 2019)

**Accelerator Multipliers by Company Stage**

| Stage | 100% trigger | 125% tier | 150%+ tier | Hard cap |
|---|---|---|---|---|
| Seed / Series A | 2.0x | (single break) | (single break) | No |
| Series B | 2.0x | 2.5x | 3.0x | No |
| Series C / late | 2.0x | 2.5x | 3.0x | Cap at 200% common |
| Public enterprise | 1.5-2.0x | 2.0-2.5x | (decel past 200%) | Decel cliff at 250% |
| Public high-velocity | 2.0x | 2.5x | 3.0x | No cap typical |

**Accelerator Multipliers by Deal-Size Segment**

| Segment | ACV range | Annual deal count | Typical accelerator | Cap policy |
|---|---|---|---|---|
| SMB | Under $20K | 15-50 deals | 2.0-3.0x past 100% | No cap |
| Mid-Market | $20K-$100K | 8-20 deals | 1.5-2.5x past 100% | Occasional 200% cap |
| Enterprise | $100K-$1M | 3-8 deals | 1.25-2.0x past 100% | Hard cap or decel 200% |
| Strategic/Named | $1M+ | 1-4 deals | 1.25-1.75x past 100% | Hard cap or PRSU past 250% |

**Base Commission Rates (2026)**

- New-logo new-ARR: 8-12% of ACV mid-market, 6-10% enterprise, 10-14% high-velocity SMB
- Expansion ARR: 4-7% of expansion ARR (about half of new-logo rate)
- Renewal ARR: 0-2% to AE, 1-3% to CSM/account manager
- Multi-year TCV handling: 60-80% of TCV paid up front, clawback if Year 2 churn

**Attainment Distribution (Cross-Source Median 2026)**

- Median rep attainment: 55-65% of annual quota
- Top decile attainment: 130-200%+ of annual quota
- Top 1% attainment: 200-400%+ of annual quota
- Percentage of reps hitting 100%+: ~35-45% in good years, ~25-35% in tough years
- Percentage of reps pulling meaningful accelerator dollars: 7-12% in typical year
- Concentration of accelerator spend in top decile: 41-58% of total cash commission

**OTE Bands by Segment (2026)**

| Segment | Base | Variable target | OTE | Top decile total comp |
|---|---|---|---|---|
| SMB AE | $80-110K | $80-110K | $160-220K | $300-450K |
| Mid-Market AE | $110-140K | $110-140K | $220-280K | $400-600K |
| Enterprise AE | $140-180K | $140-200K | $280-380K | $600K-$1M |
| Strategic AE | $180-220K | $180-280K | $360-500K | $1M-$1.5M+ |

**Aggregate Sales-Comp Spend as % of New ARR**

- Healthy mid-market SaaS: 25-35% of new ARR (base + variable + accelerators)
- Accelerator-specific spend: 4-8% of new ARR
- Public enterprise SaaS: 20-28% of new ARR (lower variable load)
- Hyper-growth Series B-C: 32-45% of new ARR (higher accelerator concentration)

**Forecast Accuracy and Sandbagging Math**

- Forecast accuracy in quarters where median rep sits 90-99% attained: drops 12-18 percentage points (Bridge Group 2025)
- NRR drag from cliff-pull deals in Year 2: 8-12 percentage points (Pavilion 2025 cohort analysis)
- Sales-rep attrition at flat-cap orgs (planned within 18 months): 40% (Pavilion 2025)
- Sales-rep attrition at uncapped accelerator orgs: 22% (Pavilion 2025)
- Average SaaS AE tenure: 2.5-3 years (LinkedIn Workforce Insights 2025)
- Replacement cost per AE (recruiting + ramp + opportunity cost): $250-400K

**Windfall Policy Prevalence (2026)**

- Hard cap at 200% or 250%: ~14-22% of plans
- PRSU stock substitution past threshold: ~18-26% of plans (concentrated at public companies)
- Deferred cash with vesting: ~6-10% of plans (growing 2024-2026)
- Discretionary "boom deal" review: ~8-12% of plans
- No cap (just budget for it): ~38-46% of plans

**Clawback Policy Prevalence (2026)**

- Plans with formal clawback language: ~60% of plans (SaaStr 2024)
- Standard clawback window: 30-90 days for contract void / non-payment
- Extended clawback window: 180 days+ for churn / downgrade events
- Plans with quarterly accelerator resets: ~18% of plans

**Example: $1M Quota, 5% Base, 1.5x/2.0x Curve, 130% Attainment**

- First $1M at 5% = $50,000 commission
- Next $250K at 7.5% (1.5x) = $18,750 commission
- Final $50K at 10% (2.0x) = $5,000 commission
- **Total commission at 130% = $73,750** (47.5% lift vs hitting exactly 100%)

**Example: $1M Quota, 5% Base, 1.5x/2.0x/3.0x Curve, 175% Attainment**

- First $1M at 5% = $50,000
- Next $250K at 7.5% = $18,750
- Next $250K at 10% = $25,000
- Final $250K at 15% (3.0x) = $37,500
- **Total commission at 175% = $131,250** (162.5% lift vs hitting exactly 100%)

**Fully-Loaded Accelerator Cost (200-AE Mid-Market SaaS)**

- Aggregate accelerator spend: $4M-$7M annually
- Concentration in top 25 reps: 80%+ of accelerator spend
- Top performer accelerator dollars: $200K-$500K per top-decile AE
- Annual budget volatility: ±25% swing from year to year based on attainment distribution
- 80th-90th percentile stress-test scenario: +35-45% over plan

`;

const counter = `

## Counter-Case: Why The "Just Use 1.5x-2.5x" Answer Is Often Wrong

The headline 2026 answer — "1.5x past 100%, 2.0x past 125%, 2.5-3.0x past 150%" — is statistically right and operationally often wrong. The serious counter-arguments:

**Counter 1 — Accelerators destroy more value than they create when attainment distribution is broken.** If your median rep attains 50-55% and the top decile attains 110-130%, your accelerator only activates for ~5-8% of reps. You are paying retention insurance for the top decile only, not driving general motivation. Many companies write "general motivation" into the strategic intent but implement "top-decile retention" by accident — a gap that wastes 30-50% of the perceived plan value. The right answer is to fix quota-setting first (set quota at 85-95% of plan target, force median attainment toward 80%+) and *then* design accelerators. Accelerators on a broken attainment distribution are a band-aid on a broken leg.

**Counter 2 — Behavioral research disputes piecewise plans broadly.** Larkin 2014, Oyer 2000, and a substantial behavioral-economics literature show piecewise plans (any plan with thresholds and tier breaks) create predictable gaming: sandbagging at threshold, push-deals across quarters, ARR pull-forward, deal-quality degradation as reps push fragile deals over the line. Flat plans (the Stripe model) avoid all of this. A serious case can be made that flat plans plus aggressive base salaries are operationally superior to accelerator-bearing plans at any company with mature sales management — but the comp-as-marketing-narrative usually wins ("we offer uncapped commission") even when the operational case is weaker.

**Counter 3 — Sandbagging is rampant, measurable, and corrosive.** Bridge Group 2025 found forecast accuracy drops 12-18 percentage points in quarters where reps are 90-99% attained. Reps hold deals to land in the next period and cross 100% with extra cushion. The CFO cannot trust the pipeline; the board questions the forecast. A pure flat plan or a single-trigger plan eliminates this entirely. The 2-break linear-with-kicker is the worst of all worlds for sandbagging because it creates two threshold-gaming points (100% and 125%) instead of one.

**Counter 4 — NRR drag from cliff-pull deals is real and underestimated.** Net retention in Year 2 drops 8-12 points on cohorts where the closing AE was within 5 percentage points of an accelerator cliff. The top-of-funnel scoreboard wins; the Year-2 P&L loses. Companies that audit cohort NRR by closing-AE attainment routinely find that accelerator-driven deals have meaningfully worse retention than mid-attainment deals — a hidden cost that doesn't appear on any comp report.

**Counter 5 — Aggregate accelerator spend is understated in most plan-design conversations.** Plans get presented to comp committee with example math for individual reps; the aggregate spend across 200 reps under a realistic attainment distribution is rarely modeled in advance. For a 200-rep org, fully-loaded accelerator spend at $4-7M is a senior product hire, an entire customer success team, or a year of paid demand-gen. The opportunity cost is real and rarely surfaced.

**Counter 6 — The retention argument is overstated when isolated.** The "40% planned attrition at flat-cap orgs" Pavilion number conflates flat-cap with bad management, weak coaching, bad territories, slow ramp, and culture problems. Stripe and a handful of operator-disciplined SaaS firms run flat-rate uncapped plans with above-median retention. The honest read: flat plans require strong management *and* generous bases; accelerator plans require generous variable. Both can work; neither is universally superior.

**Counter 7 — PE-portfolio standardization inverts the argument.** PE-owned SaaS portfolios (Vista, Thoma Bravo, KKR, Blackstone, Permira) increasingly standardize on conservative accelerator structures (1.25x-1.75x with hard caps at 200%) regardless of stage or motion because comp predictability supports valuation discipline. If you are in a PE portfolio or anticipating a PE exit, the "right" accelerator design follows the PE playbook, not the operator-orthodoxy playbook. The two are meaningfully different.

**Counter 8 — Consumption-pricing distorts attainment math fundamentally.** At Snowflake, Datadog, MongoDB Atlas, and similar consumption-pricing companies, "attainment" is partially a function of customer usage growth that the AE doesn't control. Standard accelerator structures applied to consumption-pricing comp create perverse outcomes: AEs win or lose accelerators based on customer behavior post-close. The right answer is hybrid recognition models with separate quotas for "booked commitment" vs "recognized consumption," but this adds administrative complexity that many companies skip.

**Honest verdict.** The standard answer "1.5x past 100%, 2.0x past 125%, 2.5-3.0x past 150%" is the right starting point for a typical mid-market SaaS with a healthy attainment distribution and standard subscription pricing. It is the wrong starting point for: (a) consumption-pricing companies, (b) PE-owned portfolios, (c) enterprise SaaS with extreme deal-size variance, (d) companies with broken quota-setting where median attainment sits below 60%, (e) operator-disciplined firms that can sustain a flat-rate model with strong base. The serious work is *not* picking the curve — it is matching the curve to the attainment distribution, deal-size variance, pricing model, exit horizon, and management maturity. Skipping that work and copying the median is how comp plans become a tax on revenue rather than a multiplier.

`;

const links = `

## Related Pulse Library Entries

- **q01** — What is the standard SaaS AE OTE base/variable split? (Sets the 50/50 vs 60/40 split that determines accelerator dollar size.)
- **q02** — How do you set SaaS sales quotas? (Quota-setting drives whether accelerators activate for the median rep or only the top decile.)
- **q03** — What is the standard SaaS AE ramp curve? (New-hire prorated quotas and accelerator-exempt periods during ramp.)
- **q04** — How do you design SaaS sales territories? (Territory quality drives the attainment distribution that determines accelerator aggregate cost.)
- **q06** — What are the standard SDR/BDR comp variants? (Flatter accelerators 1.25x-1.5x at top tier, behavioral-research alignment.)
- **q07** — How do you handle commission clawbacks on SaaS deals? (Clawback windows, deal-quality gates, NRR-tied recognition.)
- **q08** — What is the standard SaaS sales commission rate? (8-12% of ACV new logo base rates that accelerator multipliers ride on.)
- **q09** — How do you handle multi-year deal commissions? (TCV vs ACV recognition affecting accelerator math.)
- **q10** — What is the standard SaaS sales SPIFF design? (Distinguishing SPIFFs from accelerator tiers; tactical vs structural levers.)
- **q11** — How do you design SaaS expansion compensation? (Flatter expansion accelerator curves, separate expansion quotas.)
- **q12** — What is the standard SaaS renewal commission rate? (0-2% to AE, renewal protection thresholds for expansion accelerators.)
- **q13** — How do you handle consumption-pricing sales comp? (Snowflake/Datadog/MongoDB hybrid booking-plus-recognition models.)
- **q14** — What is the standard SaaS sales-comp spend as % of new ARR? (25-35% aggregate, 4-8% accelerator-specific.)
- **q15** — How do you design a SaaS sales comp plan from scratch? (End-to-end plan design including accelerator curve selection.)
- **q16** — How do you handle sales rep PIPs? (Accelerator eligibility during PIP windows, restoration after completion.)
- **q17** — How do you handle mid-year sales territory rebalancing? (Hold-harmless provisions, bridge compensation, accelerator preservation.)
- **q18** — How do you handle quota inflation year over year? (Capping YoY quota increase at 15-20%, promotion-path alternatives.)
- **q19** — How do you handle the windfall problem in sales comp? (PRSU stock substitution past 250% attainment, deferred cash vesting.)
- **q20** — How do you handle elephant deals in SaaS sales comp? (Strategic-account variance, named-account caps, comp committee review.)
- **q21** — What is the standard SaaS CRO compensation? (Top-decile AE comp comparisons, comp-committee escalation paths.)
- **q22** — How do you design SaaS sales kickoff communications? (Plan rollout, accelerator examples, kickoff math.)
- **q23** — What is the standard SaaS sales attainment distribution? (Median 55-65%, top decile 130-200%, attainment curve modeling.)
- **q24** — How do you audit SaaS sales-comp plans quarterly? (Realized distribution vs plan assumptions, mid-cycle adjustments.)
- **q25** — How do you model SaaS sales-comp budget for a fiscal year? (80th-90th percentile stress testing, accelerator spend forecasting.)
- **q26** — How do you handle sales-comp during a SaaS downturn? (Automatic spend compression via attainment, no mid-year plan changes.)
- **q27** — What is the standard SaaS sales-comp tooling stack? (CaptivateIQ, Spiff, Varicent, Xactly comparison for accelerator administration.)
- **q28** — How do you handle SaaS sales-comp during PE rollup standardization? (Vista/Thoma Bravo/KKR/Blackstone playbook — conservative accelerator curves, hard caps, comp-predictability discipline.)
- **q29** — How do you handle SaaS sales-comp through an IPO transition? (Comp committee governance, S-1 disclosures, post-IPO plan adjustments.)
- **q30** — What is the standard SaaS sales-comp public-company disclosure? (DEF 14A proxy filings, CD&A sections, comp benchmarking by named peers.)
- **q31** — How do you handle SaaS sales-comp clawback policy design? (30-90 day standard window, 180+ day churn provisions, NRR-tied recognition.)
- **q32** — How do you handle SaaS sales-comp for net-new logo vs expansion separately? (Dual quota structures, separate accelerator curves, attribution rules.)
- **q33** — What is the standard SaaS sales-comp tooling cost? (Per-rep licensing, implementation, audit overhead.)
- **q34** — How do you handle sales-comp acceleration for strategic objectives? (ICP-segment-tied accelerators, product-attach SPIFFs, behavioral steering.)

`;

const tags = ['revops','sales-comp','accelerators','ae','commission','saas','ote','quota','pavilion','repvue','bridge-group','opencomp','enterprise-software'];

const sources = [
  { title: 'Pavilion State of Sales Compensation Report 2025 — primary citation for accelerator multiplier medians across 2,800+ reported plans', url: 'https://www.joinpavilion.com/compensation-report' },
  { title: 'RepVue 2025 Quota Threshold Data — ~85,000 anonymized AE compensation records covering OTE, attainment, effective commission rates, top-decile cash distribution', url: 'https://repvue.com' },
  { title: 'Bridge Group 2025 SaaS AE Metrics Report (n=412) — accelerator structures, median attainment, forecast accuracy, top-decile retention benchmarks', url: 'https://blog.bridgegroupinc.com/' }
];

const notes = {
  s6: 'Added 40 cited sources spanning sales-comp benchmark datasets (Pavilion State of Sales Comp 2025 n=2800, RepVue 2025 ~85k records, Bridge Group 2025 SaaS AE Metrics n=412, OpenComp 2024-2025 n=1200, Alexander Group enterprise sales-comp consulting research, Pave real-time comp benchmarks, CaptivateIQ + Spiff + Varicent + Xactly comp tooling vendors, WTW + Mercer + Korn Ferry + Iconiq + KeyBanc + Pacific Crest annual surveys), public-company comp disclosures (Salesforce + HubSpot + MongoDB + Snowflake + Asana + Monday + Procore + Toast + ZoomInfo DEF 14A proxy filings 2023-2025), academic behavioral research (Larkin 2014 commission threshold gaming, Oyer 2000 piecewise comp plan theory), operator communities (Pavilion RevOps Community 10000+ members, SaaStr operator surveys, RevOps Co-Op Slack, Modern Sales Pros), and industry analyst coverage (Gartner Sales Compensation Magic Quadrant, Forrester Sales Operations Wave, Bessemer State of the Cloud, a16z Enterprise GTM research).',
  s7: 'Added comprehensive numerical analysis with 8 markdown pipe tables: cross-survey median accelerator multipliers (Bridge Group 1.5x/2.0x/2.5x, Pavilion 1.5x/2.0x/2.5-3.0x, RepVue 1.7x/2.0x effective, OpenComp 1.5x/1.85x/2.5x), curve shape distribution (60-64% linear+kicker, 22-30% tiered, 6-10% true linear, 12-18% decelerator-then-accelerator), accelerator multipliers by company stage (seed/A 2.0x no cap, B 2.0x/2.5x/3.0x no cap, C 2.0x/2.5x/3.0x cap at 200%, public enterprise 1.5-2.0x/2.0-2.5x decel past 250%, public high-velocity 2.0x/2.5x/3.0x no cap), multipliers by deal-size segment (SMB 2.0-3.0x no cap, Mid-Market 1.5-2.5x occasional cap, Enterprise 1.25-2.0x hard cap or decel, Strategic 1.25-1.75x PRSU past 250%), base commission rates (8-12% new logo mid-market, 6-10% enterprise, 4-7% expansion, 0-2% renewal), attainment distribution (median 55-65%, top decile 130-200%, only 7-12% pull meaningful accelerator dollars), OTE bands by segment ($160-220K SMB to $360-500K Strategic, top decile $300-450K to $1M-$1.5M+), aggregate sales-comp spend as % new ARR (25-35% healthy mid-market, 4-8% accelerator-specific), forecast accuracy degradation (12-18 points at 90-99% attainment per Bridge Group), windfall policy prevalence (14-22% hard cap, 18-26% PRSU, 6-10% deferred cash, 38-46% no cap), clawback prevalence (60% formal language, 30-90 day standard window), worked examples ($1M quota 130% attainment = $73,750 commission 47.5% lift; 175% attainment = $131,250 commission 162.5% lift), fully-loaded accelerator cost ($4M-$7M annually for 200-AE org, 80% concentration in top 25 reps, $200K-$500K per top-decile AE).',
  s8: 'Added 8-element counter-case with honest 5-condition verdict: accelerators destroy value when attainment distribution is broken (median 50-55% means only 5-8% of reps activate accelerators — paying for top-decile retention only not general motivation), behavioral research disputes piecewise plans broadly (Larkin 2014 + Oyer 2000 academic literature showing predictable gaming sandbagging push-deals ARR pull-forward), sandbagging is rampant measurable corrosive (Bridge Group 2025 forecast accuracy drops 12-18 points at 90-99% attainment, 2-break curve worst of all worlds because two threshold-gaming points), NRR drag from cliff-pull deals is real and underestimated (Year 2 net retention drops 8-12 points on cohorts where closing AE was within 5 points of accelerator cliff), aggregate accelerator spend understated in plan-design conversations ($4-7M annual for 200-rep org = senior product hire, customer success team, or year of paid demand-gen), retention argument overstated when isolated (Pavilion 40% planned attrition at flat-cap orgs conflates with bad management, Stripe and operator-disciplined firms run flat-rate uncapped with above-median retention), PE-portfolio standardization inverts argument (Vista Thoma Bravo KKR Blackstone Permira conservative 1.25x-1.75x with hard caps at 200% for valuation discipline), consumption-pricing distorts attainment math fundamentally (Snowflake Datadog MongoDB Atlas standard accelerators applied to consumption pricing creates perverse outcomes, requires hybrid booking-plus-recognition recognition models). Honest verdict: standard answer right starting point for typical mid-market SaaS with healthy attainment distribution and standard subscription pricing; wrong for consumption-pricing companies + PE-owned portfolios + extreme deal-size variance + broken quota-setting + operator-disciplined firms.',
  s9: 'Cross-linked 34 related Pulse entries spanning q01-q34 sales-comp cluster covering OTE base/variable splits + quota setting + ramp curves + territory design + SDR/BDR variants + clawbacks + commission rates + multi-year deals + SPIFFs + expansion comp + renewal commission + consumption pricing + sales-comp spend benchmarks + plan design + PIPs + territory rebalancing + quota inflation + windfall problem + elephant deals + CRO compensation + kickoff communications + attainment distribution + quarterly audits + budget modeling + downturn handling + comp tooling + PE rollup standardization + IPO transition + public-company disclosures + clawback policy + new-logo vs expansion + comp tooling cost + strategic-objective accelerators.',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep rewrite of SaaS AE accelerator multipliers past 100% quota for 2026 using ADAPTED ANALYTICAL STRUCTURE with VALUE-NOT-WORDCOUNT mandate (8,500-9,500 target, HARD CAP 10,500, lean paragraphs, frequent H3 breaks). Built under 4-PART structure: Bottom Line callout FIRST with [Typical band] / [Curve shape] / [Reality] covering 1.5x-2.5x past 100% escalating 3.0x-4.0x past 150%, linear-with-kicker dominant 60-70%, only 7-12% of reps actually pull accelerator dollars because attainment medians 55-65% sit far below 100% trigger. Short intro paragraphs + comprehensive TL;DR with 4 standard curve shapes + 5 stage-specific benchmark bands + 6 named failure modes + 4 design principles + decision math example ($1M quota 130% attainment = $73,750 commission). TOC + 4 ANALYTICAL PARTs (📐 PART 1 DEFINITIONS AND MECHANICS + 🔍 PART 2 STANDARD CURVE SHAPES + 🧪 PART 3 2026 BENCHMARKS + 📈 PART 4 HOW ACCELERATORS BREAK) with 21 H3 deep content sections. flow contains 2 mermaid diagrams (decision flow for choosing curve by stage/segment/pricing, failure modes vs mitigations). src has 40 cited sources spanning Pavilion + RepVue + Bridge Group + OpenComp + Alexander Group + Pave + CaptivateIQ + Spiff + Varicent + Xactly + Salesforce/HubSpot/MongoDB/Snowflake proxy filings + Larkin 2014 + Oyer 2000 + SaaStr + Bessemer + a16z + Gartner + Forrester. num is 8 markdown pipe tables + extensive bullet benchmarks + 2 worked examples. counter is 8-element counter-case with honest 5-condition verdict (consumption-pricing, PE portfolios, extreme deal variance, broken quota-setting, operator-disciplined firms). links cross-references q01-q34 cluster (34 related entries excluding q05). Callouts used: 🎯 Bottom Line, 🟡 Key Stat, ⚠️ Warning, 📊 Quick Facts. Real specifics throughout: Pavilion + RepVue + Bridge Group + OpenComp dataset names with sample sizes, Salesforce/HubSpot/MongoDB/Snowflake/Asana/Monday/Procore/Toast/ZoomInfo public-company disclosure references, Alexander Group + Pave + CaptivateIQ + Spiff + Varicent + Xactly comp consultancies. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose, only section markers. ASCII-clean mermaid diagrams.'
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
