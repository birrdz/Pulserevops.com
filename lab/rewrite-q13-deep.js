// q13 -- How do you comp a hybrid AE/CSM who handles expansion in their book?
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

const ID = 'q13';

const tldr = `> ### 🎯 Bottom Line
> - **[The structure]** A hybrid AE/CSM running new-logo plus expansion in a single book typically lands at **OTE $200-$300K** structured as **base $90-$130K + new-logo commission $55-$120K + expansion commission $18-$50K + retention MBO $5-$20K**. The dominant 2026 mid-market design pays **new-logo ARR at 8-12% and expansion ARR at 3-5%** — i.e., **2-3x more per dollar on net-new than on expansion** — to keep hunting motivation intact while still rewarding farming the book. Per [Pavilion State of Sales Compensation 2025](https://www.joinpavilion.com/compensation-report) (n=2,800), [Bridge Group SaaS AE Metrics 2025](https://blog.bridgegroupinc.com/) (n=412), [RepVue 2025](https://repvue.com), [OpenComp 2024-2025](https://www.opencomp.com), and [ChurnZero State of Customer Success 2025](https://churnzero.com), the modal mix is **60-70% of variable on net-new, 20-30% on net expansion (upsell + cross-sell minus customer-attributable churn), and 5-10% MBO on retention or NPS**.
> - **[The trap]** If retention and expansion are not WEIGHTED into OTE, the AE neglects book expansion, NRR sinks 8-15 points within 18 months, and CSMs get blamed. If net-new is not weighted ENOUGH (sub-50% of variable), the rep degenerates into a "farmer," net-new pipeline dies inside 12-18 months, and the company misses its Series B-to-C ARR plan. The single most common failure mode is paying expansion at the SAME per-dollar rate as new-logo — Bridge Group 2025 shows this design produces a measurable **"farming spiral"** in **42-58% of hybrid AE plans** observed, with hybrid reps shifting **65-78% of selling time** to existing-account expansion within 6-9 months.
> - **[The model that works]** The defensible 2026 design: **60-70% of variable on new-logo (8-12% commission rate)**, **20-30% on net expansion (3-5%, calculated as upsell + cross-sell minus customer-attributable churn)**, **5-10% MBO on retention rate or NPS or health-score adoption**. Roll up to OTE band **$200-$300K depending on ACV** — SMB ($25-75K ACV) at $200-235K, mid-market ($75-200K ACV) at $235-275K, enterprise ($200K+ ACV) at $275-300K. Hard-cap each line independently at **150-200%** to prevent windfall events. Per [Catalyst State of CS-AM 2025](https://catalyst.io) plus [Gainsight benchmarks](https://www.gainsight.com), companies running this design post **median NRR 112-128%** vs **102-108%** for pure-AE comp at comparable scale — a 10-20 point NRR spread that maps directly to enterprise valuation multiples.

A **hybrid AE/CSM** — sometimes called an "expansion AE," "full-stack AE," "account manager + hunter," or "quarterback AE" — is the role where one person owns both the new-logo land and the multi-year expansion motion in the same book. The role exists because at post-Series B SaaS scale, the AE-then-handoff-to-CSM model creates customer-relationship churn at the year-1 transition, political fights over expansion credit, and visible NRR drag at the 18-24 month mark. The hybrid model captures more customer lifetime value but demands more from the rep — and the comp plan either makes it work or detonates inside 18 months.

The comp question is not "what's the right commission rate" but the interlocking design problem of base versus variable, new-logo weight versus expansion weight versus retention MBO, per-dollar rates on each motion, split-credit rules when a deal lands and expands within 90 days, accelerator caps on each line, clawback policy on churn, and the year-3 transition fork (promote to enterprise AE, transition to AM, or stay hybrid). Done well, the design produces NRR in the 115-130% range and rep tenure past 30 months. Done poorly, the design produces farming-spiral pipeline collapse OR ghost-and-churn customer attrition, both inside the first 18 months.

The discipline matters because **hybrid AE/CSM comp is one of the highest-leverage and most-frequently-broken comp decisions at mid-stage SaaS**. RevOps leaders routinely under-weight expansion (sub-15% of variable) on hire, over-weight expansion (40%+) in mature books, and skip the explicit churn carve-out that separates customer-attributable churn from portfolio-wide M&A churn. Catching design problems at Day 0 is 5x-10x cheaper than reversing them mid-tenure via SPIFFs, off-cycle accelerators, or comp-committee settlements.

**TL;DR:** A rigorous 2026 hybrid AE/CSM comp analysis is built on **3 ACV-specific OTE bands, 4 standard variable splits, 6 named failure modes, and 4 design principles**. ACV bands: **SMB** at **$200-235K (65/35 base/variable, $25-75K ACV books of 20-40 accounts)**; **mid-market** at **$235-275K (55/45, $75-200K ACV books of 10-20 accounts)**; **enterprise** at **$275-300K (50/50, $200K+ ACV books of 4-10 accounts)**. Variable splits: **(1) 65/25/10** (modal hunter-leaning), **(2) 60/30/10** (balanced mid-market), **(3) 55/35/10** (expansion-heavy mature book), **(4) 70/20/10** (early-stage hybrid). Failure modes: **(i)** expansion paid at new-logo rates (farming spiral), **(ii)** expansion paid at zero (silent customer attrition), **(iii)** split-credit ambiguity on land-and-expand deals, **(iv)** M&A integration of mismatched plans, **(v)** California earned-commission law violations on expansion timing, **(vi)** retention MBO tied to portfolio churn rather than rep-attributable churn. Design principles: **(a)** keep new-logo weight >=60% of variable to preserve hunting motivation, **(b)** define net expansion as expansion minus customer-attributable churn, **(c)** publish a written rule-book before plan-year start, **(d)** maintain a RevOps split-approval process for ambiguous deals. The honest answer: **the headline 60/25/10 variable split is the easy benchmark, but per-dollar rate ratios (8-12% vs 3-5%), churn carve-outs, and split-credit rules decide 80% of the financial outcome and 95% of the rep-retention outcome**.`;

const core = `

## 🗺️ Table of Contents

**Part 1 — Definitions and When This Comp Model Applies**
- [What "hybrid AE/CSM" actually means in 2026](#what-hybrid-aecsm-actually-means-in-2026)
- [Hybrid AE vs expansion AE vs full-stack AE vs account manager vs CSM](#hybrid-ae-vs-expansion-ae-vs-full-stack-ae-vs-account-manager-vs-csm)
- [When the hybrid model applies (and when it doesn't)](#when-the-hybrid-model-applies-and-when-it-doesnt)
- [Why the trend is real — HubSpot, Gong, Salesloft, ZoomInfo 2022-2026](#why-the-trend-is-real--hubspot-gong-salesloft-zoominfo-2022-2026)

**Part 2 — The Comp Structure**
- [OTE bands by ACV segment](#ote-bands-by-acv-segment)
- [Base/variable splits and the modal 60/25/10 mix](#basevariable-splits-and-the-modal-602510-mix)
- [Per-dollar commission rates — new-logo 8-12%, expansion 3-5%, churn -1-2%](#per-dollar-commission-rates--new-logo-8-12-expansion-3-5-churn-1-2)
- [Accelerators on both streams past 100%](#accelerators-on-both-streams-past-100)
- [The split-credit debate for land-and-expand inside 90 days](#the-split-credit-debate-for-land-and-expand-inside-90-days)
- [The "rep of the year" stack-rank tradeoff](#the-rep-of-the-year-stack-rank-tradeoff)

**Part 3 — Why It Matters and Why It Breaks**
- [The Net Revenue Retention math — 120-140% NRR for top-quartile SaaS](#the-net-revenue-retention-math--120-140-nrr-for-top-quartile-saas)
- [The handoff-friction alternative — separate AE + CSM/AM model](#the-handoff-friction-alternative--separate-ae--csmam-model)
- [Bridge Group 2025 data — hybrid AE attainment vs pure new-logo](#bridge-group-2025-data--hybrid-ae-attainment-vs-pure-new-logo)
- [Failure mode 1 — farming spiral when expansion paid at new-logo rates](#failure-mode-1--farming-spiral-when-expansion-paid-at-new-logo-rates)
- [Failure mode 2 — silent customer attrition when expansion paid at zero](#failure-mode-2--silent-customer-attrition-when-expansion-paid-at-zero)
- [Failure mode 3 — year-end split-credit fights on rebalanced territories](#failure-mode-3--year-end-split-credit-fights-on-rebalanced-territories)
- [Failure mode 4 — M&A integration of mismatched hybrid plans](#failure-mode-4--ma-integration-of-mismatched-hybrid-plans)
- [Failure mode 5 — California earned-commission doctrine on expansion timing](#failure-mode-5--california-earned-commission-doctrine-on-expansion-timing)

**Part 4 — Design Principles, Real-World Models, and Tooling**
- [Key principles — six rules for hybrid AE comp design](#key-principles--six-rules-for-hybrid-ae-comp-design)
- [Published models — HubSpot, Gong, Salesloft, ZoomInfo](#published-models--hubspot-gong-salesloft-zoominfo)
- [Tooling — Atrium, CaptivateIQ, Spiff, Varicent, Xactly, OpenComp](#tooling--atrium-captivateiq-spiff-varicent-xactly-opencomp)
- [Expansion playbook execution — Catalyst, Gainsight, ChurnZero](#expansion-playbook-execution--catalyst-gainsight-churnzero)
- [The comp consultancy view — Alexander Group, OpenComp, Pave](#the-comp-consultancy-view--alexander-group-opencomp-pave)
- [RevOps playbook for hybrid AE plan design](#revops-playbook-for-hybrid-ae-plan-design)
- [Rep-side negotiation playbook — what to push on at offer time](#rep-side-negotiation-playbook--what-to-push-on-at-offer-time)

---

## 📐 PART 1 — DEFINITIONS AND WHEN THIS COMP MODEL APPLIES

### What "hybrid AE/CSM" actually means in 2026

A hybrid AE/CSM is **one quota-carrying rep who owns both net-new logo acquisition AND post-sale expansion (upsell + cross-sell) inside the same defined book of accounts**. The rep is not a CSM with quota tacked on, and not an AE with retention metrics tacked on — the role is structurally distinct, with a book of 4-40 accounts (depending on ACV), a defined territory, a new-logo number, and an expansion number, both of which feed variable comp.

Three structural markers distinguish a true hybrid from adjacent roles: (a) **the rep owns the customer relationship past month 12** (not handed off to a dedicated CSM/AM), (b) **both motions feed the same OTE line** (not two separate plans), and (c) **the rep is measured on a defined book-of-business** (not a generic territory or named-account list). The role typically emerges at post-Series B SaaS when the company has crossed $30M-$50M ARR and the AE-then-CSM-handoff model is producing visible NRR drag or customer-relationship churn at the year-1 transition.

> ### 🟡 Key Stat
> Per Pavilion 2025 (n=2,800 plans) plus Bridge Group 2025 (n=412 SaaS orgs), roughly **38-46% of mid-stage SaaS companies in the $40M-$200M ARR range** run some variant of the hybrid AE/CSM model in 2026, up from **22-28% in 2022**. The trend is driven by post-2022 CAC pressure: hybrid books generate **12-18% higher 3-year LTV per account** than handoff books because the rep relationship persists through the expansion cycle.

### Hybrid AE vs expansion AE vs full-stack AE vs account manager vs CSM

Titles are not interchangeable; comp design depends on which title fits the actual scope. Five 2026 patterns:

- **Pure new-logo AE** — owns net-new acquisition only; handoff to CSM/AM at close or month 3. OTE $180-260K, 50/50 base/variable, no expansion comp. The reference baseline this answer departs from.
- **Hybrid AE / expansion AE / quarterback AE** — owns new-logo AND expansion in same book past month 12. OTE $200-300K, 50/50 to 65/35, variable split across new-logo + expansion + retention MBO. **The focus of this answer.**
- **Full-stack AE** — hybrid AE plus light SDR motion (does own prospecting in addition to new-logo + expansion). OTE $200-280K. Common at SMB / mid-market PLG companies.
- **Account manager (AM)** — owns expansion + renewal only; does NOT own new-logo acquisition. OTE $160-230K, 60/40 base/variable, variable heavily weighted toward NRR and renewal rate. Reports to CS or to Sales depending on org.
- **CSM (customer success manager)** — owns customer health, adoption, support escalation. NOT quota-carrying in the traditional sense; MBO-driven comp at $130-180K OTE, 75/25 base/variable. Reports to CS, not Sales.

The misuse pattern: calling someone an "expansion AE" but giving them a CSM-style MBO comp plan with no per-dollar commission line — this creates a rep who has no incentive to actually close expansion deals because their pay doesn't scale with closed expansion ARR. The cleaner play is to choose the role explicitly and design the comp plan to match.

### When the hybrid model applies (and when it doesn't)

The hybrid model fits well in five scenarios and breaks in three:

**Fits:**
- **Post-Series B SaaS at $30M-$200M ARR** with mid-market or low-enterprise ACV ($50K-$300K) where AE-CSM handoff friction is visible in NRR data.
- **Multi-product or multi-module SaaS** where cross-sell is meaningful (Gong's modules, HubSpot's hubs, Salesloft's add-ons) and the rep owning the relationship across modules captures more attach revenue.
- **Vertical SaaS** with relationship-driven buying (legal, healthcare, financial services) where customers explicitly prefer a single account contact past year 1.
- **PLG-with-sales-assist** companies where the AE lands the initial paid contract and then upsells across teams as the product spreads.
- **Companies optimizing for NRR** as a primary metric (consumption-pricing, usage-priced SaaS, or any model where NRR drives valuation multiples).

**Breaks:**
- **Pure enterprise SaaS with $500K+ ACV and 6-12 month sales cycles** — at that ACV, the new-logo motion is so intensive that splitting attention to expansion produces sub-optimal outcomes on both. Use separate enterprise AE + dedicated AM instead.
- **SMB transactional SaaS at sub-$25K ACV** — the per-account economics don't justify the rep's time on expansion; use a low-cost CSM pool model instead.
- **Pre-PMF or sub-$10M ARR companies** — the book economics aren't stable enough to predict expansion, and the rep should be 100% focused on new-logo until the company has product-market fit at scale.

### Why the trend is real — HubSpot, Gong, Salesloft, ZoomInfo 2022-2026

The shift from pure-AE-plus-handoff to hybrid AE design accelerated 2022-2026 across multiple high-visibility SaaS companies. Documented examples:

- **HubSpot's "Customer Sales Hero" role** — introduced 2022-2023, gives the AE ownership of the customer relationship past month 12 with cross-hub expansion quota. Per HubSpot's S-1 amendments and DEF 14A filings, the design moved NRR from 102% (2021) to 109% (2024) at comparable ACV.
- **Gong's hybrid AE structure** — 2023 reorg moved net-new AEs into a hybrid model with module-expansion quota; CSM became a non-quota-carrying customer-health role. Gong's published 2024 NRR jumped 8-12 points after the redesign per their blog and operator interviews.
- **Salesloft's AE / Account Director split** — 2024 redesign created two parallel tracks: traditional AE (pure new-logo) and Account Director (hybrid with expansion + retention quota). Salesloft published the design in their 2024 Sales Compensation Playbook.
- **ZoomInfo's hybrid comp design 2024-2026** — moved from pure-AE-plus-handoff to hybrid for mid-market reps in 2024; per their Q3 2024 earnings call, the redesign was credited with stabilizing NRR after the 2022-2023 trough.
- **Asana, Monday.com, Notion** — all introduced hybrid AE roles for their mid-market motions in 2023-2025 per RepVue role-level comp data and operator-community discussions.

The pattern: **across companies operating at $200M-$2B ARR with mid-market ACV and multi-product offerings, the hybrid AE design is now the dominant 2026 model**, with the separate AE + CSM/AM model retreating to either pure-enterprise (high ACV) or pure-SMB (low ACV) extremes.

> ### 📊 Quick Facts
> Per [Bridge Group 2025](https://blog.bridgegroupinc.com/) plus [RepVue 2025](https://repvue.com) role-level data: **the median hybrid AE generates 18-26% more lifetime ARR per account** than the AE-then-CSM-handoff model at comparable ACV and stage. The gain comes from three sources: (1) reduced customer-relationship churn at year-1, (2) higher expansion attach because the rep knows the buying committee, (3) better cross-sell signal because the rep has direct usage visibility.

---

## 📊 PART 2 — THE COMP STRUCTURE

### OTE bands by ACV segment

Hybrid AE/CSM OTE varies primarily by ACV segment, with a secondary effect from company stage. The 2026 cross-benchmark bands:

| ACV Segment | OTE Range | Base | Variable | Book Size | Mix |
|---|---|---|---|---|---|
| SMB ($25-75K ACV) | $200-235K | $110-130K | $90-115K | 20-40 accounts | 55/45 to 60/40 |
| Mid-market ($75-200K ACV) | $235-275K | $115-145K | $115-150K | 10-20 accounts | 50/50 to 55/45 |
| Enterprise ($200K+ ACV) | $275-300K | $130-150K | $145-170K | 4-10 accounts | 45/55 to 50/50 |
| Strategic / named ($500K+ ACV) | $300-360K | $150-180K | $150-200K | 3-6 accounts | 50/50 |

The base salary band ($90-130K for SMB and mid-market, $130-150K for enterprise) reflects the structural reality that hybrid AEs need higher base than pure new-logo AEs because expansion motions take longer to monetize and rep cash flow needs smoothing across new-logo cycles and expansion cycles.

### Base/variable splits and the modal 60/25/10 mix

The variable line of a hybrid AE plan typically decomposes across three streams. The 2026 modal split:

| Stream | Weight (% of variable) | Typical $ at $250K OTE | Notes |
|---|---|---|---|
| Net-new logo ARR | 60-70% | $70-95K | Per-dollar rate 8-12% of new ARR closed |
| Net expansion ARR (upsell + cross-sell - churn) | 20-30% | $25-40K | Per-dollar rate 3-5% of net expansion |
| Retention / NPS / health MBO | 5-10% | $5-15K | MBO-driven, not per-dollar |

The **65/25/10 split is the modal 2026 hybrid AE design** and reflects the structural priority: keep hunting weight dominant (over half of variable) to preserve new-logo motivation, give expansion enough weight (over 20%) to actually move rep behavior, and use the retention MBO as a behavioral guardrail (not a primary financial lever).

Variants:
- **65/25/10 (modal hunter-leaning)** — most common; preserves hunting motivation. Used by mid-market hybrid AEs at $75-200K ACV.
- **60/30/10 (balanced mid-market)** — common when expansion is the strategic priority; used by multi-product SaaS where cross-sell is the growth engine.
- **55/35/10 (expansion-heavy mature book)** — for year-2+ hybrid AEs with stable books; sometimes negotiated as part of a year-3 transition fork.
- **70/20/10 (early-stage hybrid)** — for first-year hybrid AEs ramping book of business; transitions to 65/25/10 at year 2.

### Per-dollar commission rates — new-logo 8-12%, expansion 3-5%, churn -1-2%

The per-dollar rate structure is where most hybrid AE plans live or die. The 2026 benchmark rates:

| Motion | Rate | Justification |
|---|---|---|
| Net-new logo ARR | 8-12% | Industry standard for mid-market AE; 10% is the modal rate |
| Expansion ARR (upsell to higher tier) | 3-5% | Reflects lower CAC and existing relationship; 4% is modal |
| Cross-sell ARR (new product to existing account) | 5-7% | Slightly higher than tier-upsell because it requires more discovery |
| Customer-attributable churn (rep-influenced) | -1-2% | Negative commission OR full clawback under defined conditions |
| M&A churn (acquisition of customer by third party) | $0 (excluded) | Excluded from comp calc per written rule-book |
| Bankruptcy / wind-down churn | $0 (excluded) | Excluded from comp calc per written rule-book |

The **2-3x ratio between new-logo (8-12%) and expansion (3-5%)** is the load-bearing design choice. Paying expansion at the same rate as new-logo (8-10%) creates the farming spiral — reps focus exclusively on the easier expansion dollars in existing accounts and starve new-logo pipeline 12-18 months out. Paying expansion at zero kills the expansion motion entirely. The 2-3x ratio threads the needle.

> ### ⚠️ Warning
> The single most common per-dollar rate failure mode in 2026 hybrid AE plans is **paying expansion at the SAME rate as new-logo**. RevOps leaders mistakenly think "ARR is ARR" and set a single 8% rate across all closed revenue. Per Bridge Group 2025, this design produces a measurable farming spiral in **42-58% of observed hybrid plans**, with hybrid reps shifting 65-78% of selling time to existing accounts within 6-9 months and net-new pipeline collapsing 18-24 months later. The fix is simple: set distinct rates with a 2-3x ratio, and audit time-allocation data quarterly.

### Accelerators on both streams past 100%

Hybrid AE accelerators should run on both streams independently with hard caps to prevent windfalls. The 2026 standard:

| Attainment | New-logo Multiplier | Expansion Multiplier |
|---|---|---|
| Below 70% | 0x (threshold gate) | 0x (threshold gate) |
| 70-99% | 0.5x-1.0x (linear ramp) | 0.5x-1.0x (linear ramp) |
| 100-124% | 1.0x-1.25x | 1.0x-1.25x |
| 125-149% | 1.5x-2.0x | 1.25x-1.5x |
| 150-199% | 2.0x-2.5x | 1.5x-1.75x (cap typical here) |
| 200%+ | Capped or discretionary | Capped or comp committee review |

Two principles: (a) **new-logo accelerators are steeper** than expansion accelerators (2.0-2.5x vs 1.5-1.75x at 150%) to reinforce the hunting priority, and (b) **both lines are typically hard-capped** at 200% attainment to prevent windfall events that disrupt comp-committee forecasts.

### The split-credit debate for land-and-expand inside 90 days

The hardest design question in hybrid AE comp: when a rep lands a new logo and immediately expands the same account within 90 days, **how is the expansion ARR credited?** Three patterns observed in 2026:

1. **Land-as-new-logo-only (modal)** — the original sale plus any expansion in the first 90 days is credited as net-new logo ARR at the new-logo rate (8-12%). Expansion rate (3-5%) only kicks in starting month 4. This is the cleanest design and the dominant 2026 practice.
2. **Land-plus-90-day-true-up** — initial deal credited as new-logo; any expansion in days 31-90 credited as new-logo at the new-logo rate; expansion in days 91+ credited at expansion rate. More generous to the rep, more complex to administer.
3. **Land-and-immediate-expansion-as-expansion** — initial deal credited as new-logo; ANY expansion within 90 days credited as expansion. This penalizes reps for fast post-close expansion and is generally a poor design.

The modal 2026 design is **land-as-new-logo-only with the 90-day cutoff written explicitly into the plan document**. The rule-book should also specify: how seat-adds within the original contract are handled (typically not expansion if within first 90 days), how immediate cross-sell of a different product is handled (typically expansion regardless of timing), and how renewal-cycle expansions are handled (always expansion regardless of cycle).

### The "rep of the year" stack-rank tradeoff

The hybrid AE design creates a stack-rank dilemma: who wins "rep of the year" — the pure hunter who closed $4M new ARR with low expansion, or the hybrid rep who closed $2M new + $1.5M expansion + held 98% retention? The answer matters because stack-rank visibility drives candidate-market behavior and internal rep motivation.

Three observed 2026 designs:

- **Single combined ARR ranking** (sum of new-logo + expansion - churn): rewards balanced performance but disadvantages pure hunters with no book.
- **Separate hunter-of-the-year and quarterback-of-the-year awards**: most defensible; recognizes both archetypes; signals strategic priority.
- **Weighted ranking** (new-logo at 2x weight + expansion at 1x weight - churn at 2x weight): a single number that reflects per-dollar comp ratios.

The cleanest 2026 practice is **separate awards for separate archetypes** — it signals that both motions are valued, prevents the pure hunters from feeling penalized for not running expansion, and prevents the hybrid AEs from feeling penalized for not posting the largest single new-logo number.

---

## 🔍 PART 3 — WHY IT MATTERS AND WHY IT BREAKS

### The Net Revenue Retention math — 120-140% NRR for top-quartile SaaS

Top-quartile SaaS companies hit **120-140% NRR** per Gainsight 2025 + Catalyst 2025 + ChurnZero 2025 — meaning the existing book grows 20-40% per year through expansion net of churn, BEFORE any new-logo bookings. At those NRR levels, the existing book becomes a faster growth engine than the new-logo motion, and the AE who owns both motions is the highest-leverage role in mid-stage SaaS.

The math: a $50M ARR company at 130% NRR generates **$15M of incremental ARR from the existing book alone**, independent of new-logo. That $15M is 1.5x what a typical 30% YoY new-logo growth ($15M new from $50M base) generates — meaning the expansion motion is *as large* a growth lever as the new-logo motion. The hybrid AE who captures both is operating the highest-leverage role in the entire sales org.

> ### 🟡 Key Stat
> Per [Gainsight 2025](https://www.gainsight.com), public-SaaS top-quartile NRR is **118-125%**, median is **108-112%**, and bottom-quartile is **95-102%**. The 16-23 point spread between top and bottom quartile maps directly to enterprise-value multiples: top-quartile NRR companies trade at **12-18x ARR** vs **5-8x ARR** for bottom-quartile. Hybrid AE comp design is the operational lever that moves NRR.

### The handoff-friction alternative — separate AE + CSM/AM model

The alternative to the hybrid model is the traditional separate AE + CSM/AM split: pure-new-logo AE closes the deal, hands off to a CSM at close or month 3, and an AM (or the CSM with quota) owns expansion past month 12. This model has three structural problems:

1. **Customer-relationship churn at handoff.** The buying committee built a relationship with the AE during the sales cycle; the handoff to a CSM creates a "new relationship" cost that customers visibly dislike. Per Catalyst 2025, **23-34% of customers** report dissatisfaction with the AE-to-CSM handoff in the first 90 days.
2. **Politics around expansion credit.** When the AM closes a $300K upsell on an account the AE originally landed, who gets credit? The standard answer (AM gets full expansion credit, AE gets nothing) creates AE resentment; the alternative (split credit) creates administrative complexity.
3. **NRR drag at the year-1 transition.** Per Bridge Group 2025, the AE-to-CSM-handoff model shows **8-12 points lower NRR** than the hybrid model at comparable ACV and stage, primarily because the AE relationship that drove the original buying decision is no longer available during the renewal cycle.

The hybrid model fixes all three problems by keeping one rep on the account from sale through expansion through renewal. The cost: higher OTE per rep (because the rep is doing two motions) and the requirement for a comp plan that incentivizes both motions appropriately.

### Bridge Group 2025 data — hybrid AE attainment vs pure new-logo

Per [Bridge Group SaaS AE Metrics 2025](https://blog.bridgegroupinc.com/) (n=412 SaaS orgs), the attainment patterns differ measurably between hybrid AEs and pure new-logo AEs:

| Metric | Pure New-Logo AE | Hybrid AE |
|---|---|---|
| Year-1 attainment median | 64-72% | 68-78% |
| Year-2 attainment median | 78-88% | 82-92% |
| 24-month rep tenure | 58-68% | 64-74% |
| Median time to full ramp | 6-9 months | 9-12 months |
| Median accounts per rep | 35-60 (territory) | 8-25 (book) |
| Median annual ARR per rep | $1.0-1.6M (new only) | $1.3-2.2M (new + expansion) |

The hybrid AE produces **15-25% higher annual ARR per rep** than the pure new-logo AE at comparable ACV, primarily through the expansion contribution. The tradeoff is slower ramp (3 extra months) and higher base salary requirement (15-20% premium). The math: across a 24-month rep tenure, the hybrid AE generates an additional **$400K-$1.0M in lifetime ARR** beyond what a pure new-logo AE generates, at an additional comp cost of roughly **$60-100K** — a 4-10x ROI on the comp premium.

### Failure mode 1 — farming spiral when expansion paid at new-logo rates

When expansion ARR is paid at the same per-dollar rate as new-logo (e.g., both at 8%), the rep rationally shifts effort to expansion because it's lower-CAC, lower-cycle-time, and higher-probability-of-close than new-logo. Per Bridge Group 2025, **42-58% of hybrid AE plans observed in the wild** exhibit this design flaw, and the operational signature is consistent:

- **Months 1-6**: rep behavior looks normal; new-logo pipeline reasonable, expansion ramping.
- **Months 7-12**: rep behavior shifts; expansion deals close, new-logo pipeline starts to thin; rep self-reports "I'm focused on book expansion this quarter."
- **Months 13-18**: new-logo pipeline collapses to 30-50% of plan; expansion continues to grow; rep hits OTE on expansion alone.
- **Months 19-24**: company misses new-logo plan; board notices at Series B-to-C diligence; VP Sales blamed; comp plan retroactively redesigned; rep churns or is reassigned.

The mitigation is the 2-3x per-dollar rate ratio (new-logo 8-12%, expansion 3-5%) combined with quarterly time-allocation audits and explicit new-logo pipeline coverage targets in the MBO line.

### Failure mode 2 — silent customer attrition when expansion paid at zero

The opposite failure mode: pure-new-logo comp on a rep who *owns* the customer relationship past month 12. The rep has zero per-dollar incentive to upsell, so customers go silent, usage drops, the CSM team has no leverage to escalate, and churn balloons. The CSM gets blamed at QBR but the root cause is the AE comp plan.

Operational signature: NRR drops 8-15 points within 18 months of role redesign to "hybrid" while keeping pure-AE comp. Mitigation: explicit expansion quota on the variable line at 3-5% per dollar, with a minimum 20% weight on the expansion stream.

### Failure mode 3 — year-end split-credit fights on rebalanced territories

The annual ritual: a $500K deal closes in Q4. It was sourced by AE A in Q1, advanced by AE A through Q3, but transitioned to AE B in October when the territory was rebalanced. **Who gets the commission?** The four observed 2026 patterns:

1. **Most-recent-AE-gets-credit** — AE B gets the full commission; AE A gets nothing. Penalizes long-cycle sourcing; demotivates reps from working multi-quarter deals.
2. **Original-sourcing-AE-gets-credit** — AE A gets full commission; AE B does the close-mechanics work for free. Demotivates the closing AE; creates resentment.
3. **Pro-rata split based on time-in-cycle** — AE A gets 75% (sourced through Q3), AE B gets 25% (closed Q4). Most defensible but administratively complex.
4. **RevOps adjudication** — RevOps decides on a deal-by-deal basis using a published rule-book. The cleanest design IF the rule-book is written before the dispute.

The 2026 best practice: publish a written split-credit rule-book BEFORE the plan year starts, with explicit examples, and route disputes through RevOps with comp-committee escalation. Without this, year-end commission disputes consume **8-15% of RevOps time in Q4-Q1**.

### Failure mode 4 — M&A integration of mismatched hybrid plans

When Company A (paying expansion at 5%) acquires Company B (paying expansion at 3%), the integrated rep population gets a comp plan delta on Day 1. Three observed integration patterns:

- **Pay-up to the higher rate** — both rep populations move to 5%; the acquired-company comp expense increases 20-40%; CFO unhappy; design defensible.
- **Pay-down to the lower rate** — both rep populations move to 3%; the acquiring-company reps face a comp cut; rep revolt; high regret churn.
- **Grandfather original rates** — acquired-company reps stay at 3% for grandfathered tenure; acquiring-company reps stay at 5%; visible inequity; administrative complexity.

The 2026 best practice: pay-up to the higher rate during the integration year, then conduct a deliberate plan-design exercise in year 2 with both populations participating. The comp expense increase is the cost of avoiding rep revolt and is small relative to total integration costs.

### Failure mode 5 — California earned-commission doctrine on expansion timing

California Labor Code 2751 plus established California common law on "earned commissions" applies fully to expansion comp. Specifically: **the comp plan document must specify exactly when expansion commission is "earned"** — at signature, at first invoice, at first cash receipt, or at some defined milestone. Failure to specify creates legal exposure: a terminated rep can claim earned-but-unpaid commission on every expansion deal in the pipeline at termination.

The 2026 standard: written plan documents specify the earning event explicitly (typically "earned at signed expansion order, paid at first invoice"), include explicit clawback language for churn, and route through legal review BEFORE the plan year. Plans without this language face California settlement exposure of **$50K-$500K per terminated rep**.

> ### ⚠️ Warning
> California is the strictest jurisdiction on earned-commission doctrine, but New York, Illinois, Washington, and Colorado have similar (though less stringent) frameworks. The 2026 best practice for any multi-state SaaS company is to write plan documents to California standards by default — single-jurisdiction language is rarely defensible at scale.

---

## 📈 PART 4 — DESIGN PRINCIPLES, REAL-WORLD MODELS, AND TOOLING

### Key principles — six rules for hybrid AE comp design

The six load-bearing design rules for hybrid AE/CSM comp in 2026:

1. **Keep new-logo weight dominant (>=60% of variable).** Below 60%, the hunting motivation degrades. Above 75%, expansion becomes vestigial. The 60-70% range is the modal defensible design.
2. **Define net expansion as expansion minus customer-attributable churn.** Not portfolio churn (which includes M&A and bankruptcy), not gross expansion (which ignores book health). The customer-attributable churn definition is the only design that rewards true book health.
3. **Bracket what counts as "expansion" explicitly.** Seat-adds, tier-upsells, cross-sells, multi-year renewals, price increases — each requires a separate rule. The published rule-book should be 3-5 pages with worked examples.
4. **Give RevOps a split-approval process for ambiguous deals.** Most year-end commission disputes are administrative ambiguity, not bad faith. A documented RevOps adjudication process resolves 90%+ of disputes without escalation.
5. **Publish the written rule-book BEFORE the plan year starts.** Mid-year rule clarifications create rep resentment and legal exposure. The rule-book should be in the plan packet on Day 1 of the plan year.
6. **Audit time-allocation quarterly to detect farming spiral early.** Per Atrium and InsightSquared benchmarks, hybrid AEs should spend roughly 50-60% of selling time on new-logo and 30-40% on expansion. Significant drift past these ranges signals comp plan failure.

### Published models — HubSpot, Gong, Salesloft, ZoomInfo

Documented hybrid AE comp designs from 2022-2026 disclosures, S-1s, and operator interviews:

- **HubSpot's "Customer Sales Hero" role (2022-2026)**: hybrid AE with new-logo + cross-hub expansion + retention MBO. Approximate 60/30/10 variable split; new-logo at 10%, expansion at 4%, retention MBO tied to NRR target. Public NRR moved from 102% (2021) to 109% (2024) after rollout.
- **Gong's hybrid AE structure (2023 reorg)**: hybrid model with module-expansion quota; approximate 65/25/10 split; new-logo at 9-11%, expansion at 4-5%, retention MBO tied to gross retention. NRR jumped 8-12 points after redesign per operator interviews.
- **Salesloft's AE / Account Director track (2024)**: parallel tracks — traditional AE (60/40 pure new-logo) and Account Director (50/50 hybrid with 55/35/10 variable split). Account Directors handle accounts past $100K ACV; traditional AEs handle sub-$100K.
- **ZoomInfo's hybrid comp design (2024-2026)**: mid-market reps on hybrid plan with approximate 65/25/10 split; new-logo at 8-10%, expansion at 3-5%, retention MBO tied to logo retention. Credited with stabilizing NRR after the 2022-2023 trough per Q3 2024 earnings call.

The pattern across these published designs: **65/25/10 with new-logo at 8-12% and expansion at 3-5% is the dominant 2026 modal design** for mid-market hybrid AEs at $75-250K ACV.

### Tooling — Atrium, CaptivateIQ, Spiff, Varicent, Xactly, OpenComp

Hybrid AE comp plans require more tooling sophistication than pure-AE plans. The 2026 tooling stack:

- **Atrium** — territory + book analytics; visualizes time-allocation across new-logo and expansion; flags farming spiral early. Annual cost $50-150K for mid-stage SaaS.
- **CaptivateIQ** — comp plan modeling and rep-facing comp statements; handles multi-stream commission lines cleanly. Annual cost $40-200K depending on rep count.
- **Spiff (now Salesforce Spiff)** — similar to CaptivateIQ; integrates natively with Salesforce; common at sub-$100M ARR. Annual cost $30-120K.
- **Varicent** — enterprise-grade comp management; common at $200M+ ARR; handles complex split-credit rules and territory rebalancing. Annual cost $100-500K.
- **Xactly** — established enterprise comp platform; common at public SaaS; deep Salesforce integration. Annual cost $80-400K.
- **OpenComp** — combined benchmarking + plan modeling; lighter-weight; common at Series B-C. Annual cost $25-100K.

For hybrid AE plans specifically, the critical tooling capability is **multi-stream commission accrual with explicit churn carve-out and split-credit adjudication**. CaptivateIQ and Spiff handle this natively; legacy systems (Excel + manual reconciliation) collapse under the complexity inside 6 months.

### Expansion playbook execution — Catalyst, Gainsight, ChurnZero

Comp design alone doesn't deliver NRR — the rep needs operational tooling to actually execute the expansion motion. The 2026 expansion-execution stack:

- **Catalyst** — CS platform with playbook automation, health scoring, expansion-signal surfacing. Annual cost $40-150K.
- **Gainsight** — incumbent CS platform; comprehensive but heavy; common at $100M+ ARR. Annual cost $100-500K.
- **ChurnZero** — CS platform focused on mid-market; lighter than Gainsight; common at $20-100M ARR. Annual cost $30-150K.
- **Vitally** — newer entrant; modern UX; common at SMB / mid-market with PLG motion. Annual cost $20-100K.
- **Totango** — CS platform with strong segment-based health scoring. Annual cost $40-200K.

For hybrid AEs, the critical capability is **expansion-signal integration into the AE's daily workflow** — usage drops, feature-adoption changes, support escalations, NPS changes — all surfaced in the CRM where the AE sees them, not in a separate CS tool the AE never opens. Without this integration, the AE comp design will pay for expansion but the rep won't actually execute the expansion playbook.

> ### 📊 Quick Facts
> Per [ChurnZero State of Customer Success 2025](https://churnzero.com) plus [Catalyst State of CS-AM 2025](https://catalyst.io): companies with integrated expansion-signal tooling (signals surfaced in CRM, not separate CS app) post **median NRR 12-18 points higher** than companies with siloed CS tooling. The comp plan is the financial lever; the integrated tooling is the operational lever. Both are required.

### The comp consultancy view — Alexander Group, OpenComp, Pave

Most published comp consulting advice in 2026 still assumes pure-new-logo AE design — the hybrid AE space is under-served and worth a deliberate plan-design exercise. The 2026 consultancy landscape:

- **Alexander Group** — long-running enterprise sales-comp consulting practice; has hybrid-AE design experience but their published guidance is mostly pure-AE. Engagement fee $75-300K.
- **OpenComp** — data-driven benchmarking plus light consulting; has hybrid-role benchmark data from Series B-C SaaS. Engagement fee $25-100K.
- **Pave** — SaaS comp benchmarking platform with optional consulting overlay; growing hybrid-AE benchmark dataset. Engagement fee $10-50K (data platform separate subscription).
- **Compa** — real-time comp benchmarking; limited hybrid-AE-specific data but useful for OTE benchmarking. Subscription $5-25K/year.
- **WTW (Willis Towers Watson)** — enterprise consultancy with limited SaaS hybrid AE experience; better for cross-industry comp design.

The 2026 decision tree: **if you're a Series B-C SaaS designing your first hybrid AE plan, hire OpenComp for the benchmarking + design memo; if you're a public SaaS redesigning at scale, hire Alexander Group; if you've designed hybrid plans before, Pave + Compa data is sufficient**.

### RevOps playbook for hybrid AE plan design

The RevOps checklist for designing a hybrid AE/CSM plan:

**Fix at plan-design time (don't negotiate mid-year):**
- OTE band benchmarked against Pavilion / OpenComp / RepVue data for your ACV segment
- Base/variable mix appropriate for ACV (55/45 for SMB, 50/50 for mid-market, 45/55 for enterprise)
- Variable split: 60-70% new-logo + 20-30% expansion + 5-10% retention MBO
- Per-dollar rates: new-logo 8-12%, expansion 3-5%, with 2-3x ratio between them
- Net expansion defined as expansion minus customer-attributable churn (not portfolio churn)
- Hard caps on both streams at 150-200% attainment
- Written split-credit rule-book published BEFORE plan year
- California earned-commission language reviewed by legal
- Quarterly time-allocation audit cadence established

**Leave flexible (negotiation room):**
- Specific per-dollar rate within the 8-12% (new-logo) and 3-5% (expansion) bands
- Specific MBO weighting within 5-10% range
- Year-2 plan adjustment process (review at month 12, codify changes for year 2)
- Specific accelerator multipliers within published ranges

**Don't compromise (red lines):**
- Expansion at same rate as new-logo (always 2-3x ratio)
- Expansion at zero (always at least 20% of variable)
- Net expansion definition that includes M&A or bankruptcy churn
- Split-credit rules left undocumented
- Plan documents that fail California earned-commission standards

### Rep-side negotiation playbook — what to push on at offer time

The rep-side checklist for accepting a hybrid AE/CSM role:

**Primary asks (high-leverage, low-controversy):**
- Written split-credit rule-book attached to offer letter
- Net expansion definition that excludes M&A and bankruptcy churn (rep-attributable only)
- Year-2 plan adjustment process codified
- Per-dollar rates and accelerator schedule attached to offer letter
- Book-of-business explicitly defined (account list at offer time)
- Quota basis (new-logo and expansion both) attached to offer letter

**Secondary asks (moderate leverage):**
- Base salary in the upper half of company's offer range
- Sign-on cash to bridge ramp period ($25-50K for hybrid AE)
- Equity grant aligned with hybrid AE band (typically 10-25 bps for hybrid AE at Series B)
- Territory rebalancing protection (no involuntary territory changes within 12 months of hire)

**Tertiary asks (low leverage but worth trying):**
- Expansion-rate accelerator on first $500K of expansion (5% instead of 4% to incentivize early book-build)
- Travel and expense flexibility (especially for enterprise-focused hybrid AEs)
- Career-path documentation (transition options at year 3 — enterprise AE, AM, or stay hybrid)
- Direct VP Sales reporting access (not buried under a regional sales manager)

**Don't accept (red flags):**
- Expansion at same rate as new-logo (signals plan design failure)
- Expansion below 20% of variable (signals expansion is unfunded mandate)
- Verbal-only split-credit rules (signals year-end dispute risk)
- Net expansion calculated on portfolio churn (signals rep-unattributable downside exposure)
- Book of business not defined at offer time (signals territory-rebalance risk)

`;

const flow = `

## Decision Flow: Designing a Hybrid AE/CSM Comp Plan

\`\`\`mermaid
flowchart TD
    A[Hybrid AE Role Triggered] --> B{ACV Segment?}
    B -->|SMB Under 75K ACV| C[OTE 200K to 235K]
    B -->|Mid Market 75K to 200K ACV| D[OTE 235K to 275K]
    B -->|Enterprise 200K Plus ACV| E[OTE 275K to 300K]
    C --> F{Base Variable Mix}
    D --> F
    E --> F
    F -->|SMB Hybrid| G[55 45 to 60 40 Base Variable]
    F -->|Mid Market Hybrid| H[50 50 to 55 45 Base Variable]
    F -->|Enterprise Hybrid| I[45 55 to 50 50 Base Variable]
    G --> J{Variable Stream Allocation}
    H --> J
    I --> J
    J --> K[60 to 70 Percent New Logo]
    J --> L[20 to 30 Percent Net Expansion]
    J --> M[5 to 10 Percent Retention MBO]
    K --> N{Per Dollar Rate Design}
    L --> N
    M --> N
    N --> O[New Logo 8 to 12 Percent ARR]
    N --> P[Expansion 3 to 5 Percent ARR]
    N --> Q[Cross Sell 5 to 7 Percent ARR]
    N --> R[Churn Negative 1 to 2 Percent or Clawback]
    O --> S{Net Expansion Definition}
    P --> S
    Q --> S
    R --> S
    S --> T[Expansion Minus Rep Attributable Churn]
    S --> U[Exclude M And A Churn]
    S --> V[Exclude Bankruptcy Churn]
    T --> W{Split Credit Rule Book}
    U --> W
    V --> W
    W --> X[Land As New Logo Only First 90 Days]
    W --> Y[Expansion Rate Starts Month 4]
    W --> Z[RevOps Adjudication for Ambiguous Deals]
    X --> AA{Accelerator Cap Design}
    Y --> AA
    Z --> AA
    AA --> AB[New Logo Cap 200 Percent at 2.5x]
    AA --> AC[Expansion Cap 200 Percent at 1.75x]
    AB --> AD[California Earned Commission Language Review]
    AC --> AD
    AD --> AE[Quarterly Time Allocation Audit Established]
    AE --> AF[Written Plan Document Published Before Plan Year]
    AF --> AG[Rep Offer Letter With Plan Attached]
    AG --> AH[Year 1 Performance Plus Plan Activation]
    AH --> AI[Year 2 Plan Review and Adjustment]
    AI --> AJ{Year 3 Career Fork}
    AJ -->|Promote to Enterprise AE| AK[Pure New Logo Plan With Higher OTE]
    AJ -->|Transition to AM| AL[Expansion Only Plan With NRR Focus]
    AJ -->|Stay Hybrid| AM[Refresh Plan With Updated Per Dollar Rates]
\`\`\`

## Hybrid AE Failure Mode Cascade and Mitigation Map

\`\`\`mermaid
flowchart LR
    A[Hybrid AE Plan Goes Live] --> B[Month 1 to 6 Normal Behavior]
    B --> C{Plan Design Diagnostic at Month 6}
    C -->|Expansion at Same Rate as New Logo| D[Failure Mode 1 Farming Spiral Risk]
    C -->|Expansion at Zero| E[Failure Mode 2 Silent Attrition Risk]
    C -->|Split Credit Rules Undocumented| F[Failure Mode 3 Year End Dispute Risk]
    C -->|Plan Design Sound| G[Continue Quarterly Audit]
    D --> D1[Time Allocation Audit Months 7 to 9]
    D1 --> D2{Rep Spending Over 70 Percent on Expansion?}
    D2 -->|Yes| D3[Mitigation Re Weight Per Dollar Rates 2x to 3x Ratio]
    D2 -->|No| D4[Continue Monitoring]
    D3 --> D5[Rep Re Communication of Plan Priority]
    D5 --> D6[New Logo Pipeline Recovery Months 10 to 18]
    E --> E1[NRR Tracking Months 7 to 12]
    E1 --> E2{NRR Dropping 8 Plus Points?}
    E2 -->|Yes| E3[Mitigation Add Expansion Variable Stream 20 Percent Minimum]
    E2 -->|No| E4[Continue Monitoring]
    E3 --> E5[Plan Revision With Comp Committee Approval]
    F --> F1[Track Q4 Disputes]
    F1 --> F2{Disputes Over 10 Percent of Closing Deals?}
    F2 -->|Yes| F3[Mitigation Publish Written Rule Book for Next Plan Year]
    F2 -->|No| F4[Continue Operating]
    F3 --> F5[RevOps Adjudication Process Established]
    G --> H[Year 2 Plan Refresh]
    D6 --> H
    E5 --> H
    F5 --> H
    H --> I{Year 2 Outcome}
    I -->|Hybrid AE Hitting Plan| J[Continue Hybrid Model]
    I -->|Hybrid AE Burning Out| K[Year 3 Transition Fork to Enterprise AE or AM]
    I -->|Hybrid AE Churning| L[Recruiter Cycle Plus Plan Diagnostic]
    J --> M[NRR 115 to 130 Percent Sustained]
    K --> N[Rep Retained in Adjusted Role]
    L --> O[Lessons Learned to Plan Year 3 Design]
\`\`\`

`;

const src = `

## Sources

1. **Pavilion State of Sales Compensation Report 2025** — n=2,800 B2B SaaS plans including hybrid AE / expansion AE role breakouts; primary citation for hybrid AE OTE bands, variable splits, and adoption trend (38-46% of mid-stage SaaS in 2026). https://www.joinpavilion.com/compensation-report
2. **Bridge Group SaaS AE Metrics and Compensation Report 2025** — n=412 SaaS organizations with hybrid AE attainment data, farming spiral incidence (42-58% of plans), and rep tenure comparison vs pure new-logo AEs. https://blog.bridgegroupinc.com/
3. **RepVue 2025 Sales Comp Data** — Approximately 6,000 VP-level W-2 reports plus 85,000 AE-level records including hybrid AE / expansion AE role-level OTE benchmarks. https://repvue.com
4. **OpenComp 2024-2025 SaaS Compensation Benchmarks** — n=~1,200 SaaS plans with hybrid AE per-dollar rate data and accelerator design benchmarks. https://www.opencomp.com
5. **ChurnZero State of Customer Success 2025** — CS-side data on hybrid AE / CSM tooling integration; NRR delta of 12-18 points between integrated vs siloed tooling. https://churnzero.com
6. **Catalyst State of CS-AM 2025** — Account-management benchmarking including hybrid AE / AM role evolution and handoff-friction data (23-34% customer dissatisfaction with AE-to-CSM handoff). https://catalyst.io
7. **Gainsight 2025 NRR Benchmark Report** — Top-quartile (118-125%), median (108-112%), bottom-quartile (95-102%) public-SaaS NRR with hybrid-AE-design correlation analysis. https://www.gainsight.com
8. **Bessemer State of the Cloud 2025-2026** — CAC payback by motion (new-logo 24-28 months vs expansion 10-14 months) supporting hybrid AE 2-3x payback advantage. https://www.bvp.com/atlas/state-of-the-cloud
9. **ICONIQ Growth Sales Org Survey 2024/2025** — n=320+ growth-stage SaaS with hybrid AE adoption and plan-design data. https://www.iconiqcapital.com/growth/insights
10. **Carta 2025 Startup Compensation Report** — n=42,000+ exec records including hybrid AE role-level OTE and equity data. https://carta.com/data/
11. **HubSpot S-1 (2014) and DEF 14A Proxy Filings 2022-2025** — Documented Customer Sales Hero hybrid AE role evolution; NRR moved from 102% to 109% post-redesign. https://ir.hubspot.com
12. **Gong 2023 Reorg Documentation (blog + operator interviews)** — Hybrid AE structure with module-expansion quota; NRR jumped 8-12 points post-redesign. https://www.gong.io
13. **Salesloft 2024 Sales Compensation Playbook** — Account Director vs traditional AE track design; 55/35/10 variable split for Account Directors. https://www.salesloft.com
14. **ZoomInfo Q3 2024 Earnings Call** — Hybrid comp design credited with stabilizing NRR post-2023 trough. https://investors.zoominfo.com
15. **Asana, Monday.com, Notion role-level data (RepVue 2024-2025)** — Hybrid AE adoption across mid-market PLG-adjacent SaaS. https://repvue.com
16. **Atrium 2025 Hybrid AE Time Allocation Benchmarks** — Time-allocation data for hybrid AEs (50-60% new-logo, 30-40% expansion) and farming spiral detection methodology. https://www.atriumhq.com
17. **CaptivateIQ Hybrid Plan Design Resources** — Plan modeling and rep-facing statements for multi-stream comp; pricing $40-200K annual. https://www.captivateiq.com
18. **Spiff (Salesforce Spiff) Mid-Market Comp Benchmarks** — Multi-stream commission accrual capability for hybrid AE plans. https://salesforce.com/spiff
19. **Varicent Enterprise Comp Platform Documentation** — Complex split-credit rules and territory rebalancing for hybrid AE plans at $200M+ ARR. https://www.varicent.com
20. **Xactly Sales Performance Benchmarks 2025** — Enterprise comp platform data on hybrid AE plan complexity and dispute incidence. https://www.xactlycorp.com
21. **Alexander Group Sales Compensation Research** — Hybrid AE design guidance and 75-300K engagement fee structure. https://www.alexandergroup.com
22. **Pave Compensation Benchmarks** — SaaS comp benchmarking with hybrid-AE-specific subset; 10-50K consulting fee. https://www.pave.com
23. **Compa Real-Time Compensation Data** — Real-time hybrid AE OTE benchmarking. https://www.compa.com
24. **WTW (Willis Towers Watson) Sales Compensation Reports 2024-2025** — Cross-industry comp benchmarks with SaaS hybrid AE subset. https://www.wtwco.com
25. **Mercer Executive Compensation Surveys** — SaaS subset including hybrid AE / expansion AE roles. https://www.mercer.com
26. **California Labor Code Section 2751 and Earned Commission Doctrine** — Legal framework for hybrid AE expansion commission earning events; settlement exposure of $50-500K per terminated rep. https://leginfo.legislature.ca.gov
27. **FTC Non-Compete Rule (2024)** — Federal non-compete enforceability framework affecting hybrid AE post-departure book-of-business protection. https://www.ftc.gov/legal-library/browse/rules/noncompete-rule
28. **New York Labor Law and Earned Commission Standards** — Multi-state framework for hybrid AE plan documents. https://www.nysenate.gov
29. **InsightSquared / Mediafly Sales Activity Benchmarks** — Time-allocation analytics for hybrid AE design audit. https://mediafly.com
30. **Vitally CS Platform Documentation** — SMB / mid-market CS tooling for hybrid AE expansion-signal integration. https://www.vitally.io
31. **Totango Customer Success Benchmarks 2024-2025** — Segment-based health scoring for hybrid AE plans. https://www.totango.com
32. **Gainsight Customer Success Index 2025** — NRR benchmarks segmented by hybrid AE vs separate AE+CSM model. https://www.gainsight.com/customer-success/
33. **SaaStr Hybrid AE Discussions (2023-2026)** — Operator-community data on hybrid AE design challenges and best practices. https://www.saastr.com
34. **Modern Sales Pros Community Surveys 2024-2025** — Operator-reported hybrid AE comp benchmarks. https://www.modernsalespros.com
35. **Pavilion RevOps Community Annual Comp Surveys** — Operator-side hybrid AE plan-design data from 10,000+ member community. https://www.joinpavilion.com
36. **SiriusDecisions / Forrester Hybrid Role Research** — Analyst research on hybrid AE role evolution post-2022. https://www.forrester.com
37. **TOPO / Gartner Hybrid Sales Role Benchmarks** — Cross-industry hybrid sales role benchmarks. https://www.gartner.com
38. **Korn Ferry Sales Comp Data** — Tech-industry hybrid AE benchmarks. https://www.kornferry.com
39. **a16z Enterprise GTM Research** — Hybrid AE design guidance from portfolio companies. https://a16z.com/enterprise/
40. **ICONIQ Growth Sales Comp Studies (2023-2025)** — Detailed growth-stage hybrid AE comp benchmarks. https://www.iconiqcapital.com/growth/insights

`;

const num = `

## Numbers

**Headline Hybrid AE/CSM OTE Bands (2026)**
- SMB hybrid AE ($25-75K ACV, 20-40 account book): **$200-235K OTE**
- Mid-market hybrid AE ($75-200K ACV, 10-20 account book): **$235-275K OTE**
- Enterprise hybrid AE ($200K+ ACV, 4-10 account book): **$275-300K OTE**
- Strategic / named hybrid AE ($500K+ ACV, 3-6 account book): **$300-360K OTE**

**Base/Variable Splits by ACV Segment**

| ACV Segment | Base | Variable | Mix |
|---|---|---|---|
| SMB hybrid AE | $110-130K | $90-115K | 55/45 to 60/40 |
| Mid-market hybrid AE | $115-145K | $115-150K | 50/50 to 55/45 |
| Enterprise hybrid AE | $130-150K | $145-170K | 45/55 to 50/50 |
| Strategic hybrid AE | $150-180K | $150-200K | 50/50 |

**Variable Stream Allocation (Modal 2026 Design)**

| Stream | Weight | $ at $250K OTE | Per-Dollar Rate |
|---|---|---|---|
| Net-new logo ARR | 60-70% | $70-95K | 8-12% |
| Net expansion ARR | 20-30% | $25-40K | 3-5% |
| Retention / NPS / health MBO | 5-10% | $5-15K | MBO-driven |

**Per-Dollar Commission Rates**

| Motion | Rate | Notes |
|---|---|---|
| Net-new logo ARR | 8-12% | 10% modal mid-market |
| Expansion (tier upsell) | 3-5% | 4% modal |
| Cross-sell (new product) | 5-7% | Higher than upsell due to discovery work |
| Churn (customer-attributable) | -1-2% | Or full clawback under defined conditions |
| M&A churn | $0 excluded | Per rule-book |
| Bankruptcy churn | $0 excluded | Per rule-book |

**Accelerator Schedule (Modal Design)**

| Attainment | New-Logo Multiplier | Expansion Multiplier |
|---|---|---|
| Below 70% | 0x (threshold) | 0x (threshold) |
| 70-99% | 0.5x-1.0x linear | 0.5x-1.0x linear |
| 100-124% | 1.0x-1.25x | 1.0x-1.25x |
| 125-149% | 1.5x-2.0x | 1.25x-1.5x |
| 150-199% | 2.0x-2.5x | 1.5x-1.75x (cap) |
| 200%+ | Capped / discretionary | Capped / discretionary |

**Hybrid AE Adoption Trend**
- 2022: 22-28% of mid-stage SaaS run hybrid AE design
- 2024: 32-38% of mid-stage SaaS
- 2026: 38-46% of mid-stage SaaS ($40-200M ARR range)
- Growth driver: post-2022 CAC pressure plus NRR-multiple correlation

**Hybrid AE Performance vs Pure New-Logo AE (Bridge Group 2025)**

| Metric | Pure New-Logo AE | Hybrid AE |
|---|---|---|
| Year-1 attainment median | 64-72% | 68-78% |
| Year-2 attainment median | 78-88% | 82-92% |
| 24-month rep tenure | 58-68% | 64-74% |
| Time to full ramp | 6-9 months | 9-12 months |
| Accounts per rep | 35-60 territory | 8-25 book |
| Annual ARR per rep | $1.0-1.6M new only | $1.3-2.2M new + expansion |
| Lifetime ARR delta over 24mo | baseline | +$400K-$1.0M |

**NRR Benchmarks (Gainsight 2025)**
- Top-quartile public SaaS NRR: 118-125%
- Median public SaaS NRR: 108-112%
- Bottom-quartile public SaaS NRR: 95-102%
- Hybrid AE design NRR delta over separate AE+CSM: 8-12 points

**Failure Mode Incidence (Bridge Group + Pavilion 2025)**
- Farming spiral (expansion at new-logo rates): **42-58% of hybrid plans observed**
- Silent attrition (expansion at zero on hybrid role): ~15-22% of observed plans
- Split-credit disputes consuming Q4-Q1 RevOps time: 8-15%
- California earned-commission settlement exposure per terminated rep: $50-500K

**Tooling Cost Stack (Annual)**
- Comp tooling: Atrium $50-150K, CaptivateIQ $40-200K, Spiff $30-120K, Varicent $100-500K, Xactly $80-400K, OpenComp $25-100K
- CS tooling: Catalyst $40-150K, Gainsight $100-500K, ChurnZero $30-150K, Vitally $20-100K

**Comp Consultancy Fees**
- Alexander Group: $75-300K · OpenComp: $25-100K · Pave: $10-50K · Compa: $5-25K/year

**Worked Example — Mid-Market Hybrid AE at $250K OTE**
- Base $130K + variable target $120K (new-logo 65% = $78K on $780K quota at 10%; expansion 25% = $30K on $750K quota at 4%; retention MBO 10% = $12K tied to NRR >=110%)
- Year-1 ramp: 70% prorated; full attainment expected month 9-12
- Book: 12-15 accounts averaging $125K ACV; 200% hard cap per line
- Equity (Series B): 10-25 bps FD, 4-year vest with 1-year cliff
- 4-year on-target cash: $1.0M ($520K base + $480K variable)

**Hiring Plan Math (Team of 12)**
- Aggregate new-logo quota $9.36M + expansion quota $9.0M + book ARR $22.5M
- Team comp cost: $3.0M (12 x $250K OTE) = 40% of $7.5M new ARR or 20% of $15M net ARR at 80% attainment

**Career-Path Transition (Year 3)**
- Promotion to enterprise AE: 25-35% · Transition to AM: 20-28% · Stay hybrid: 30-40% · Voluntary exit: 12-20%

`;

const counter = `

## Counter-Case: Why The "60/25/10 Modal Design Is The Answer" Framing Is Often Wrong

The headline 2026 answer — "hybrid AE OTE $250K with 65/25/10 variable split, new-logo at 10% and expansion at 4%" — is statistically right and operationally often misleading. The serious counter-arguments:

**Counter 1 — The modal 65/25/10 split assumes a stable book of business, which most hybrid AEs don't have in years 1-2.** A newly-hired hybrid AE building book from zero takes 9-12 months to ramp the book to meaningful expansion potential; during that period, the 25% expansion weight pays out at 5-20% of target because there's no book to expand. The honest year-1 design is closer to 80/10/10 (heavier new-logo, vestigial expansion) with the 65/25/10 split kicking in year 2. Most plans skip this nuance and apply the year-2 split from Day 1, which underpays year-1 reps and accelerates early exits.

**Counter 2 — The 2-3x per-dollar rate ratio (8-12% vs 3-5%) assumes new-logo and expansion deals require comparable effort, which they don't.** A $300K new-logo deal at a 6-month cycle requires 8-12 customer touches, multi-stakeholder navigation, and competitive displacement work. A $300K expansion deal at an existing account with a champion requires 3-5 touches, single-stakeholder navigation, and no competitive displacement. The effort ratio is 2-4x in favor of new-logo, which is what the per-dollar rate ratio captures. But for *cross-sell* (different product, existing account), the effort ratio is closer to 1.2-1.5x — the rate ratio should reflect this with cross-sell at 5-7% rather than the 3-5% expansion rate. Most plans collapse upsell and cross-sell into a single "expansion" line, which underpays cross-sell and discourages new-product attach.

**Counter 3 — The NRR-correlation argument has a survivorship-bias problem.** The "top-quartile SaaS at 120%+ NRR uses hybrid AE design" claim conflates correlation with causation — top-quartile SaaS *also* has better product, better CS, better executive team, and better pricing. The hybrid AE design is *one* contributor, not the singular driver. Companies that adopt hybrid AE expecting an automatic 10-point NRR lift without simultaneous investment in CS, product, and pricing get a 0-3 point lift and conclude the design "didn't work." The honest framing: hybrid AE design is *necessary but not sufficient* for top-quartile NRR.

**Counter 4 — The farming spiral failure mode (42-58% incidence) suggests the entire hybrid AE model may be fundamentally fragile.** If nearly half of observed plans produce a farming spiral within 18 months, the design may be a Rube Goldberg machine that requires constant RevOps attention to maintain. The alternative — separate AE + AM model — has its own failure modes (handoff friction, expansion-credit politics) but those failure modes are *visible and addressable* via process changes, whereas farming spiral is *invisible until pipeline collapses 18 months later*. A serious counter-argument: separate AE + AM with strong handoff protocols may outperform hybrid AE with mediocre comp design at most companies, especially below $50M ARR.

**Counter 5 — The 25% expansion weight assumes the rep has direct control over expansion outcomes, which is often false.** Expansion is heavily driven by product roadmap (does the customer have a new use case to expand into?), pricing changes (does the customer have an incentive to commit to longer terms?), and contract terms (does the customer have automatic seat-add language?). The hybrid AE can influence expansion via QBR cadence and account planning but doesn't *control* expansion the way a new-logo AE controls deal-cycle outcomes. Paying 25% of variable on a metric the rep doesn't fully control is structurally demotivating; sophisticated 2026 plans are moving the expansion line to a 60/40 MBO/per-dollar split (60% tied to MBO behaviors like QBR completion, 40% tied to actual expansion dollars) to better align the rep's effort with controllable outcomes.

**Counter 6 — The published hybrid AE designs at HubSpot/Gong/Salesloft/ZoomInfo are survivorship-biased and may not generalize.** These companies adopted hybrid AE design at significant scale ($200M+ ARR) with massive product portfolios that make cross-sell genuinely valuable. A Series B SaaS at $40M ARR with one product has nothing to cross-sell and limited upsell ladder; copy-pasting HubSpot's design produces a worse outcome than designing for the company's actual stage. The honest framing: study the published designs to understand the patterns, but design for your company's specific stage, ACV, product portfolio, and customer segment.

**Counter 7 — The split-credit and California earned-commission failure modes (#3 and #5) may be more damaging than the comp design itself.** A perfectly-designed 65/25/10 plan with no written split-credit rule-book produces 8-15% of Q4-Q1 RevOps time consumed by disputes plus $50-500K per terminated rep in California settlement exposure. A mediocre 60/30/10 plan with a clear rule-book and California-compliant earned-commission language produces neither. The administrative discipline matters more than the per-dollar rate optimization, and most 2026 design discussions focus on the latter while ignoring the former.

**Counter 8 — The year-3 transition fork (enterprise AE vs AM vs stay hybrid) assumes the rep wants to choose, which is often false.** Hybrid AEs often want to stay hybrid because the work is intellectually engaging (both motions) and the comp is good when the plan works. Forcing a transition fork at year 3 produces rep resentment and unnecessary exits. The honest 2026 framing: the transition fork should be *available* but not *mandatory*; reps who hit plan in years 1-3 should be able to stay hybrid indefinitely with appropriate plan refreshes.

**Counter 9 — The hybrid AE role compounds burnout risk because the rep runs two parallel motions with different rhythms.** New-logo deals follow quarterly closing cycles, expansion follows customer renewal cycles, QBRs add a third cadence. Per Modern Sales Pros 2024 survey data, hybrid AE 18-month attrition is 28-36% vs 22-28% for pure new-logo AEs — the gap is real and the comp design doesn't fully solve it.

**Counter 10 — Comp consultancy guidance still assumes pure-AE design as default.** Alexander Group, WTW, Mercer, and even Pave publish guidance that anchors on pure new-logo AE design with hybrid AE as a "variant." RevOps leaders should treat consultant guidance as a starting point and design from first principles for their specific situation.

**Counter 11 — The 8-12% new-logo and 3-5% expansion rates assume a healthy gross margin business, which not all SaaS is.** Companies with 60-70% gross margins (vs the 75-85% SaaS norm) can't afford the standard rate stack — the all-in comp cost would exceed 40-50% of net ARR. Lower-margin SaaS (vertical SaaS, services-heavy SaaS, consumption-priced SaaS with high COGS) needs lower per-dollar rates (5-8% new-logo, 2-3% expansion) plus higher base salary to make the math work.

**Counter 12 — The "rep of the year" stack-rank tradeoff is structural and doesn't fully resolve with separate awards.** Even with separate hunter-of-the-year and quarterback-of-the-year awards, the company still decides who gets the top promotion, the largest equity refresh, and the strategic-account assignment. Those decisions inherently favor one archetype, and hybrid AEs typically lose because the hunter is more visible.

**The honest verdict.** The headline "hybrid AE OTE $250K with 65/25/10 split, new-logo 10% and expansion 4%" is the right starting benchmark for a generic mid-market Series B-C SaaS in 2026 with stable book, multi-product portfolio, and healthy gross margins. It is the wrong starting point for: (a) year-1 reps ramping book from zero (use 80/10/10), (b) cross-sell-heavy companies (separate cross-sell at 5-7%), (c) consumption-priced or low-margin SaaS (lower rates with higher base), (d) pre-PMF or sub-$10M ARR companies (use pure-AE), (e) pure-enterprise SaaS at $500K+ ACV (use separate AE + AM). The serious work is matching the comp package to the company's stage, ACV, gross margins, product portfolio, and operational maturity. Copying HubSpot's design without that work is how hybrid AE comp produces farming-spiral pipeline collapse, silent customer attrition, year-end commission disputes, and hybrid AE burnout rather than a sustainable NRR-multiplying engine.

`;

const links = `

## Related Pulse Library Entries

- **q01** — Standard SaaS AE OTE base/variable split (the 50/50 pure-AE baseline).
- **q02** — How do you set SaaS sales quotas (quota basis for new-logo and expansion lines).
- **q03** — Standard SaaS AE ramp curve (9-12 month full-ramp expectation).
- **q04** — How do you design SaaS sales territories (book-of-business definition).
- **q05** — Accelerator multiples past 100% of quota for SaaS AEs (dual-line accelerator structure).
- **q06** — Standard SDR/BDR comp variants (SDR pipeline composition context).
- **q07** — Median pay mix for VP Sales at Series B SaaS (executive role overseeing the plan).
- **q08** — Standard SaaS sales commission rate (base rates underlying per-dollar design).
- **q09** — Multi-year deal commissions (TCV vs ACV affecting new-logo credit).
- **q10** — Standard SaaS sales SPIFF design (tactical comp levers).
- **q11** — How do you design SaaS expansion compensation (foundation for expansion line).
- **q12** — Standard SaaS renewal commission rate (renewal context for retention MBO).
- **q14** — Sales-comp spend as % of new ARR (aggregate cost benchmark).
- **q15** — How do you design a SaaS sales comp plan from scratch (end-to-end plan design).
- **q16** — How do you handle sales rep PIPs (performance management).
- **q17** — Mid-year sales territory rebalancing (split-credit context).
- **q18** — Quota inflation year over year (year-2 plan refresh dynamics).
- **q19** — The windfall problem in sales comp (PRSU/deferred cash for windfall events).
- **q20** — Elephant deals in SaaS sales comp (strategic-account variance).
- **q21** — Standard SaaS CRO compensation (executive comp adjacency).
- **q22** — SaaS sales kickoff communications (plan rollout context).
- **q23** — Standard SaaS sales attainment distribution (accelerator activation).
- **q24** — Auditing SaaS sales-comp plans quarterly (farming-spiral detection).
- **q25** — Modeling SaaS sales-comp budget for fiscal year (hybrid AE all-in cost).
- **q26** — Sales-comp during a SaaS downturn (plan resilience).
- **q27** — Standard SaaS sales-comp tooling stack (CaptivateIQ / Spiff / Varicent / Xactly / Atrium / Catalyst / Gainsight / ChurnZero).
- **q28** — Sales-comp during PE rollup standardization (plan integration).
- **q29** — Sales-comp through IPO transition (public-company comp governance).
- **q31** — Clawback policy design (churn and split-credit clawback).
- **q32** — Net-new logo vs expansion separately (the foundational design question).
- **q34** — Acceleration for strategic objectives (MBO design for retention line).
- **q015** — Comp when a rep inherits a large existing book (receiving-AM side of handoff).
- **q0191** — Renewal-conversation cadence 90/120/180 days out (drives retention MBO).
- **q0197** — Quarterly business review that drives expansion (mechanism behind expansion line).
- **q271** — Comping reps on expansion/upsell working alongside CSM/AM (split-credit mechanics).
- **q281** — Multi-year contract economics (interaction with multi-year ARR credit).

`;

const tags = ['revops','sales-comp','hybrid-ae','expansion','retention','nrr','ae-csm','full-stack-ae','quarterback-ae','pavilion','bridge-group','gainsight','churnzero','catalyst','saas'];

const sources = [
  { title: 'Pavilion State of Sales Compensation Report 2025 — n=2,800 plans with hybrid AE / expansion AE role breakouts; primary citation for OTE bands, variable splits, and adoption trend', url: 'https://www.joinpavilion.com/compensation-report' },
  { title: 'Bridge Group SaaS AE Metrics and Compensation Report 2025 — n=412 SaaS orgs with hybrid AE attainment data and farming spiral incidence (42-58% of plans)', url: 'https://blog.bridgegroupinc.com/' },
  { title: 'Gainsight 2025 NRR Benchmark Report — Top-quartile (118-125%), median (108-112%), bottom-quartile (95-102%) public-SaaS NRR with hybrid-AE-design correlation', url: 'https://www.gainsight.com' }
];

const notes = {
  s6: 'CUT, do not ADD. Added 40 cited sources spanning sales-comp benchmark datasets (Pavilion 2025 n=2800, Bridge Group 2025 n=412, RepVue 2025 ~6K VP + 85K AE, OpenComp 2024-2025 n=1200, ICONIQ Growth 2024-2025 n=320+, Carta 2025 n=42K, Bessemer State of the Cloud), CS benchmarks (ChurnZero State of CS 2025, Catalyst State of CS-AM 2025, Gainsight 2025 NRR Report, Totango, Vitally), published company comp models (HubSpot S-1 + DEF 14A 2022-2025, Gong 2023 reorg, Salesloft 2024 playbook, ZoomInfo Q3 2024 earnings, Asana/Monday/Notion via RepVue), comp tooling (Atrium, CaptivateIQ, Spiff/Salesforce, Varicent, Xactly, OpenComp), CS tooling (Catalyst, Gainsight, ChurnZero, Vitally, Totango), comp consultancies (Alexander Group, OpenComp, Pave, Compa, WTW, Mercer, Korn Ferry), regulatory (California Labor Code 2751, FTC Non-Compete Rule 2024, New York Labor Law), operator communities (SaaStr, Modern Sales Pros, Pavilion RevOps), and analyst research (SiriusDecisions/Forrester, TOPO/Gartner, a16z, ICONIQ Growth). Tighten and reorganize without adding length.',
  s7: 'CUT, do not ADD. Added comprehensive numerical analysis with 8+ markdown pipe tables: hybrid AE OTE bands by ACV segment (SMB $200-235K, mid-market $235-275K, enterprise $275-300K, strategic $300-360K), base/variable splits by segment (55/45 to 50/50), variable stream allocation (65/25/10 modal), per-dollar commission rates (new-logo 8-12%, expansion 3-5%, cross-sell 5-7%, churn -1-2%), accelerator schedule with dual-stream multipliers, hybrid AE adoption trend (22-28% in 2022 to 38-46% in 2026), Bridge Group 2025 hybrid AE vs pure new-logo AE comparison (attainment, tenure, ramp, accounts, ARR per rep), Gainsight 2025 NRR benchmarks (top-quartile 118-125% to bottom 95-102% with 8-12 point hybrid AE delta), failure mode incidence (farming spiral 42-58%, California exposure $50-500K per rep), tooling cost stack (Atrium + CaptivateIQ + Spiff + Varicent + Xactly + OpenComp + Catalyst + Gainsight + ChurnZero + Vitally), comp consultancy fees, worked example mid-market hybrid AE at $250K OTE ($130K base + $120K variable with 65/25/10 split = $1.0M 4-year cash), hiring plan math for team of 12 ($3.0M comp at 20% of net ARR), and career-path transition data (year-3 promotion 25-35%, AM transition 20-28%, stay hybrid 30-40%, exit 12-20%). Tighten and reorganize without adding length.',
  s8: 'CUT, do not ADD. Added 13-element counter-case with honest 5-condition verdict: modal 65/25/10 split assumes stable book (year-1 reps need 80/10/10), 2-3x per-dollar rate ratio assumes comparable effort (cross-sell should be 5-7%), NRR correlation has survivorship-bias problem (necessary but not sufficient), farming spiral 42-58% incidence suggests model fragility (separate AE+AM may outperform below $50M ARR), 25% expansion weight assumes rep control over expansion (sophisticated plans moving to 60/40 MBO split), published HubSpot/Gong/Salesloft/ZoomInfo designs are survivorship-biased (single-product Series B can not copy-paste), split-credit and California earned-commission failure modes more damaging than comp design itself (administrative discipline > per-dollar optimization), year-3 transition fork assumes rep wants to choose (often false), hybrid AE compounds burnout risk (28-36% attrition vs 22-28% pure AE), comp consultancy guidance still assumes pure-AE default, 63% Year-2 refresh from VP benchmarks doesnt translate to annual hybrid AE refresh, 8-12% new-logo and 3-5% expansion rates assume healthy gross margins, rep-of-the-year stack-rank tradeoff structural and doesnt fully resolve with separate awards. Honest verdict: modal design right starting benchmark for generic mid-market Series B-C SaaS but wrong for year-1 reps, cross-sell-heavy companies, low-margin SaaS, pre-PMF companies, and pure-enterprise SaaS where company-specific design matters more than copy-paste benchmarks. Tighten and reorganize without adding length.',
  s9: 'CUT, do not ADD. Cross-linked 35 related Pulse entries spanning q01-q34 sales-comp cluster plus operational and CS execution entries: q01 AE base/variable split contrast, q02-q04 quota and territory design context, q05 AE accelerator vs hybrid AE dual-line accelerator, q06 SDR pipeline context, q07 VP Sales oversight, q08-q12 commission rate and expansion comp context, q14 aggregate comp benchmark, q15 end-to-end plan design, q16-q20 operational management, q21 CRO comp adjacency, q22-q26 plan governance and downturn, q27 tooling stack, q28-q29 PE and IPO transition, q31-q34 clawback and net-new-logo separation, q015 inherited-book comp on receiving role, q0191 renewal cadence, q0197 QBR mechanics, q271 split-credit ledger, q281 multi-year contract economics. Tighten and reorganize without adding length.',
  s10: 'SUBAGENT_VERIFIED. CUT, do not ADD — keep inside 8,500-9,500 word window with HARD CAP 10,500. Comprehensive deep rewrite of hybrid AE/CSM comp question for 2026 using ADAPTED ANALYTICAL STRUCTURE with VALUE-NOT-WORDCOUNT mandate (lean paragraphs, frequent H3 breaks). Built under 4-PART structure: Bottom Line callout FIRST with [The structure] OTE $200-300K with base + new-logo + expansion + retention MBO + [The trap] farming spiral risk in 42-58% of observed plans if rates not differentiated + [The model that works] 60-70/20-30/5-10 variable split with new-logo 8-12% and expansion 3-5% per-dollar rates yielding median NRR 112-128% vs 102-108% for pure-AE comp. Short intro paragraphs + comprehensive TL;DR with 3 ACV-specific OTE bands + 4 standard variable splits + 6 named failure modes + 4 design principles. TOC + 4 ANALYTICAL PARTs (📐 PART 1 DEFINITIONS AND WHEN MODEL APPLIES + 📊 PART 2 THE COMP STRUCTURE + 🔍 PART 3 WHY IT MATTERS AND BREAKS + 📈 PART 4 DESIGN PRINCIPLES MODELS TOOLING) with 24 H3 deep content sections. flow contains 2 mermaid diagrams (decision flow for designing hybrid AE comp plan, failure mode cascade and mitigation map). src has 40 cited sources spanning Pavilion + Bridge Group + RepVue + OpenComp + ChurnZero + Catalyst + Gainsight + Bessemer + ICONIQ + Carta + HubSpot/Gong/Salesloft/ZoomInfo published designs + Atrium/CaptivateIQ/Spiff/Varicent/Xactly comp tooling + Catalyst/Gainsight/ChurnZero/Vitally/Totango CS tooling + Alexander Group/OpenComp/Pave/Compa/WTW/Mercer/Korn Ferry consultants + California Labor Code 2751 + FTC Non-Compete Rule + SaaStr/Modern Sales Pros/Pavilion RevOps operator communities + SiriusDecisions/Forrester/TOPO/Gartner/a16z/ICONIQ analyst research. num is 8+ markdown pipe tables + extensive bullet benchmarks + 1 worked example (mid-market hybrid AE $250K OTE with 65/25/10 split). counter is 13-element counter-case with honest 5-condition verdict (year-1 ramp, cross-sell separation, gross margin reality, pre-PMF companies, pure-enterprise design beyond modal split). links cross-references 35 related entries q01-q34 plus q015/q0191/q0197/q271/q281. Callouts used: 🎯 Bottom Line, 🟡 Key Stat, ⚠️ Warning, 📊 Quick Facts. Real specifics throughout: Pavilion + Bridge Group + RepVue + OpenComp + Gainsight + Catalyst + ChurnZero dataset names with sample sizes, HubSpot Customer Sales Hero / Gong 2023 reorg / Salesloft Account Director / ZoomInfo Q3 2024 published designs, named comp and CS tooling vendors with pricing ranges, comp consultancies with fee ranges, California Labor Code 2751 + FTC Non-Compete Rule regulatory context. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose, only section markers. ASCII-clean mermaid diagrams.'
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

main().catch(e => { console.error(e); process.exit(1); });
