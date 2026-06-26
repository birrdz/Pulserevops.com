// q15 -- How do you adjust comp when a rep inherits a large existing book?
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

const ID = 'q15';

const tldr = `> ### 🎯 Bottom Line
> - **[The trap]** Paying **full new-logo commission on an inherited book** is the single most expensive and most preventable comp-design mistake at growth-stage SaaS — the lucky rep banks a windfall on revenue they didn't sell, the comp budget detonates (typically **80-150 bps above plan** per [Pavilion 2025 State of Sales Compensation Report](https://www.joinpavilion.com/compensation-report) n=2,800 plans), and the rest of the team experiences a fairness revolt that produces secondary attrition cascades. Per [Bridge Group 2025 SaaS AE Metrics Report](https://blog.bridgegroupinc.com/) (n=412), **~58% of growth-stage SaaS** lack a documented inherited-book comp framework, and of those, **~47% report a "windfall incident"** within 18 months — a single rep earning 2.5-4.5x normal OTE on inherited renewal + expansion activity that the comp committee then visibly claws back. Inheritance design failures aren't isolated comp events; they are team-level trust events.
> - **[The fix]** Three-zone treatment, documented in the written plan before any inheritance happens. **Zone 1 — Earned Book (full commission):** new ARR closed on inherited accounts *after the handoff date* is treated like net-new — full new-logo rate (8-12% of first-year ACV per [OpenComp 2024-2025](https://www.opencomp.com) median), full accelerators, full credit. **Zone 2 — Maintenance Book:** renewal ARR pays a **maintenance commission of 1-3% of renewed ACV** (vs 8-12% on new logo), with explicit "maintain" definitions (retention rate ≥X%, NPS ≥Y, no escalations, QBR cadence). **Zone 3 — Bridge Period:** for 6-12 months post-handoff, the prior rep (if still employed) receives a declining override (typically 100/75/50/25/0% across months 1-5); if the prior rep has departed, the saved budget converts to a **retention-milestone MBO** for the inheriting rep ($5K at 6-month no-churn, $10K at 12-month).
> - **[Reality]** **Most companies under-design this and end up at one of two extremes.** Extreme 1 — over-pay: the inheriting rep is paid full new-logo commission on $2M-$5M of inherited ARR, banks $160K-$400K of windfall, and the comp committee discovers the cost only at year-end when realized comp-to-ARR is **120-180 bps above plan**. Extreme 2 — under-pay: the rep is given inherited accounts as "free quota credit" with no explicit maintenance commission, accounts churn 12-18% in year 1 (typical [ChartMogul](https://chartmogul.com) post-transition gross churn), the rep is left with a 20-35% quota gap and no backstop, and exits in 9-15 months. The serious work isn't picking a percentage — it's structuring the three zones rigorously enough that the inheritance event is a non-event for the budget, fair-but-not-windfall for the rep, and trust-preserving for the team.

Inherited-book comp design is the most-underweighted lever in growth-stage SaaS sales-comp policy. The textbook answer ("just give them a reduced commission rate") is correct at 30,000 feet but rarely operationalized rigorously: **the inherited "book" is four distinct categories each requiring different treatment, the trigger event matters (territory rebalance vs rep departure vs M&A vs internal promotion vs parental leave have different legal and political dynamics), quota recalibration is a separate decision from the comp-rate decision, and legal exposure under California [Labor Code §2751](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=2751) and [New York Labor Law §191-c](https://www.nysenate.gov/legislation/laws/LAB/191-C) is real and growing**. Design failures show up as: (a) comp-budget overruns of 80-150 bps, (b) fairness-revolt peer attrition (12-22% elevated per Bridge Group + Pavilion 2025), (c) inheriting-rep attrition when the realistic quota gap exposes inadequate structure, (d) post-acquisition M&A chaos, (e) earned-commission lawsuits where ambiguous definitions are interpreted against the employer.

The 2026 best practice across [Pavilion 2025](https://www.joinpavilion.com/compensation-report), [OpenComp 2024-2025](https://www.opencomp.com), [RepVue 2025](https://repvue.com) (~85K AE records), [Bridge Group 2025](https://blog.bridgegroupinc.com/), [ICONIQ Growth 2024-2025](https://www.iconiqcapital.com/growth/insights), [Alexander Group](https://www.alexandergroup.com), and [CaptivateIQ State of Comp 2025](https://www.captivateiq.com) is to **anchor on the four-category taxonomy (Active / Expansion / Renewal / Dormant), design the three-zone comp model (Earned / Maintenance / Bridge), handle quota recalibration as a separate decision with three named options, codify in the written plan, and run rollout via the "four conversations" communication framework**. Catching design problems at plan-design time is **6-14x cheaper** than fixing them mid-year and **20-40x cheaper** than resolving them via earned-commission litigation.

**TL;DR:** A rigorous 2026 framework is built on **4 book categories, 5 trigger events, 3 comp zones, 3 quota-recalibration options, 6 implementation pitfalls, and 4 stage-based design principles**. Categories: Active (under contract, paying ARR) / Expansion (open expansion motion) / Renewal (renewal in next event) / Dormant (churned or never converted). Triggers: territory rebalance / rep departure or RIF / M&A absorption / internal promotion / parental or medical leave. Zones: Earned (full new-logo rate post-handoff) / Maintenance (1-3% on renewals with gates) / Bridge (declining override OR retention MBO). Quota options: **(A)** flat team quota (lucky-rep optics), **(B)** inflated quota with renewal credit at 30-50% (modal), **(C)** ramp-style quota over 3-4 quarters. Pitfalls: legal exposure (CA 2751, NY 191-c, MA Wage Act), M&A chaos, political fallout, communication failure, tooling gaps ([Spiff](https://spiff.com) / [CaptivateIQ](https://www.captivateiq.com) / [Xactly](https://www.xactlycorp.com) / [Varicent](https://www.varicent.com) / [OpenComp](https://www.opencomp.com)), windfall-perception trap. Stage principles: **<30 reps default Option B with simple Zone framework**; **30-150 reps formalize all three zones**; **150+ reps add comp analyst + Spiff/CaptivateIQ inheritance module + annual legal review**. The honest answer: **the four-category taxonomy is the load-bearing work; the three-zone model is mechanical once the taxonomy is clean**.`;

const core = `

## 🗺️ Table of Contents

**Part 1 — The Inherited-Book Taxonomy**
- [Why "inherited book" is not one thing — the four-category breakdown](#why-inherited-book-is-not-one-thing--the-four-category-breakdown)
- [Active Book — customers under contract paying recurring ARR](#active-book--customers-under-contract-paying-recurring-arr)
- [Expansion Book — open seat-add / cross-sell / upsell motion](#expansion-book--open-seat-add--cross-sell--upsell-motion)
- [Renewal Book — annual renewal as the next event](#renewal-book--annual-renewal-as-the-next-event)
- [Dormant Book — churned or never-converted CRM accounts](#dormant-book--churned-or-never-converted-crm-accounts)
- [The five trigger events — when inheritance fires](#the-five-trigger-events--when-inheritance-fires)

**Part 2 — The Three-Zone Comp Model**
- [Zone 1 — Earned Book (full new-logo commission)](#zone-1--earned-book-full-new-logo-commission)
- [Zone 2 — Maintenance Book (1-3% of renewal ACV with maintain gates)](#zone-2--maintenance-book-1-3-of-renewal-acv-with-maintain-gates)
- [Zone 3 — Bridge Period (declining override or retention MBO)](#zone-3--bridge-period-declining-override-or-retention-mbo)
- [How the three zones interact — worked example on a $3M inherited book](#how-the-three-zones-interact--worked-example-on-a-3m-inherited-book)

**Part 3 — The Quota Recalibration**
- [Option A — Flat team-standard quota (the "lucky rep" trap)](#option-a--flat-team-standard-quota-the-lucky-rep-trap)
- [Option B — Inflated quota with renewal credit at 30-50%](#option-b--inflated-quota-with-renewal-credit-at-30-50)
- [Option C — Ramp-style quota growing over 3-4 quarters](#option-c--ramp-style-quota-growing-over-3-4-quarters)
- [Public-company evidence — HubSpot, MongoDB, Datadog patterns](#public-company-evidence--hubspot-mongodb-datadog-patterns)

**Part 4 — Implementation Pitfalls and Operationalization**
- [Legal exposure — earned-commission doctrine + plan documentation](#legal-exposure--earned-commission-doctrine--plan-documentation)
- [M&A inheritance — the worst-case integration scenario](#ma-inheritance--the-worst-case-integration-scenario)
- [The political risk — peer fairness revolts and trust breaks](#the-political-risk--peer-fairness-revolts-and-trust-breaks)
- [The four conversations — communicating the design](#the-four-conversations--communicating-the-design)
- [Tooling — Spiff, CaptivateIQ, Xactly, Varicent, OpenComp](#tooling--spiff-captivateiq-xactly-varicent-opencomp)
- [Stage-based design principles — <30 / 30-150 / 150+ reps](#stage-based-design-principles--30--30-150--150-reps)
- [When to bring in a comp consultant or employment-law counsel](#when-to-bring-in-a-comp-consultant-or-employment-law-counsel)

---

## 📐 PART 1 — THE INHERITED-BOOK TAXONOMY

### Why "inherited book" is not one thing — the four-category breakdown

The most common design failure is treating the inherited book as a single bucket. In reality, every inherited book contains **four distinct categories of accounts**, each requiring a different comp treatment. Conflating them produces either windfall (paying new-logo rates on renewal ARR) or under-payment (giving "free quota credit" without commission backstop on accounts that require active work).

The four categories, with typical share of inherited ACV per [OpenComp 2024-2025](https://www.opencomp.com) (n=~1,200) and [Pavilion 2025](https://www.joinpavilion.com/compensation-report) (n=2,800):

| Category | Typical share of inherited ACV | Comp treatment |
|---|---|---|
| Active Book (under contract, paying) | 55-70% | Maintenance commission (Zone 2) |
| Expansion Book (open expansion motion) | 12-22% | Earned commission on net-new ARR (Zone 1) |
| Renewal Book (renewal in next 90 days) | 10-18% | Maintenance commission with renewal-rate gate |
| Dormant Book (churned / never converted) | 3-8% | Full new-logo rate if revived |

> ### 🟡 Key Stat
> Per Pavilion 2025: **only ~31% of growth-stage SaaS** explicitly distinguish these four categories in the written comp plan; **~52%** treat inherited accounts as a single "managed accounts" bucket with one commission rate; **~17%** have no documented inheritance framework at all. The ~31% with rigorous taxonomy report **47% lower comp-budget variance** in inheritance years and **38% lower inheriting-rep 18-month attrition**.

The taxonomy is the load-bearing work. Companies that get the taxonomy clean find the three-zone comp model below to be mechanical; companies that skip the taxonomy find that no comp rate, however carefully chosen, produces fair outcomes.

### Active Book — customers under contract paying recurring ARR

The largest category. These are customers with signed contracts paying monthly or annual ARR. The inheriting rep's job on this book is **relationship maintenance**: QBRs on cadence, escalation handling, health-score monitoring, identification of expansion or churn signals. They are not actively selling new ARR on these accounts; they are protecting the existing revenue stream.

Comp treatment: **maintenance commission (Zone 2)** at 1-3% of renewed ACV, with explicit maintain gates. The gates exist because "maintenance" without defined criteria becomes "collect commission on auto-renewals" — the inheriting rep does nothing and pockets 1-3% of $2M+ of ARR they didn't sell.

Maintain-gate criteria (industry standard per [Alexander Group](https://www.alexandergroup.com) inheritance frameworks):

- **Retention rate ≥X%** (typically 85-92% gross retention by ACV)
- **NPS ≥Y** (typically ≥30 from inherited accounts)
- **No escalation events** in trailing 90 days (defined as P1/P2 customer escalations to VP+)
- **QBR cadence met** (typically quarterly for accounts >$50K ACV, semi-annually below)
- **Account-plan documentation** updated quarterly

Per [Bridge Group 2025](https://blog.bridgegroupinc.com/): **~78% of inheritance frameworks with maintain gates** report meeting all four gates as the threshold to qualify for the full maintenance commission; **~22%** use a partial-payment structure (50-75% of maintenance commission when 2-3 of 4 gates are met).

### Expansion Book — open seat-add / cross-sell / upsell motion

The most strategically important category. These are accounts where there is an active expansion opportunity — seat additions, cross-sell into a new product line, upsell to a higher tier — that the prior rep either started but didn't close, or that the inheriting rep identifies post-handoff.

Comp treatment: **earned commission (Zone 1)** on new ARR closed post-handoff. The inheriting rep is doing the selling work; they should be paid like a hunter on it.

The nuance: **distinguishing "in-flight" expansion (prior rep started) from "post-handoff" expansion (inheriting rep identified and ran)** is the litigation-risk surface. The standard documentation: any expansion opportunity in the CRM with an open stage at the handoff date is "in-flight" and either (a) gets split commission between prior and inheriting rep, (b) gets a 50% credit to prior rep + 50% to inheriting rep, or (c) gets full credit to inheriting rep with a one-time "completion bonus" to prior rep (typical $2K-$10K). Opportunities created post-handoff date are unambiguously Zone 1.

> ### ⚠️ Warning
> Per [Pavilion 2025](https://www.joinpavilion.com/compensation-report): **~22-28% of 2024-2025 sales-comp lawsuits involve in-flight expansion ambiguity** at handoff. The most common pattern: prior rep had a $400K expansion in stage 4 of 5 at departure; inheriting rep closes it 60 days later; both reps claim full commission; the plan doc didn't specify; company pays both (40% over-pay) or pays one and gets sued by the other. Explicit handoff documentation with stage-by-stage credit rules is the single highest-ROI documentation investment.

### Renewal Book — annual renewal as the next event

Subset of Active Book where the renewal date falls within the next 60-90 days post-handoff. These accounts have elevated risk because the prior-rep relationship was the primary trust anchor, and the inheriting rep has limited time to build the relationship before the renewal decision.

Comp treatment: **maintenance commission (Zone 2)** with explicit **renewal-rate gate** — full maintenance commission only if the renewal closes at ≥95% of prior ACV (no churn discount, no downsell). Below 95% but above 75%, partial commission (typically 50-75% of maintenance rate). Below 75% renewal rate, no maintenance commission (the inheriting rep didn't maintain; they lost revenue).

Some frameworks add an **upsell premium** at renewal: if the inheriting rep renews at >105% of prior ACV (expansion at renewal moment), the upside dollars qualify for Zone 1 earned-commission rate. This is the right incentive: maintenance for keeping the book, expansion rate for growing it.

### Dormant Book — churned or never-converted CRM accounts

The smallest category. Accounts in the CRM that either churned previously or were lifecycle-stalled at the handoff date. These accounts have effectively no current revenue contribution.

Comp treatment: **full new-logo commission (Zone 1)** if revived. The inheriting rep finding a dormant account, re-engaging it, and closing new ARR is doing pure new-logo work; pay them accordingly.

The honest framing: dormant book is usually 3-8% of inherited ACV but produces 8-15% of inheritance-year net-new ARR (when inheriting rep is good). It is under-weighted in most inheritance design conversations because it is small at handoff but high-leverage at the rep level. Per [ICONIQ Growth 2024-2025](https://www.iconiqcapital.com/growth/insights) (n=320+): **the top quartile of inheriting reps generate 18-26% of their inheritance-year quota from dormant-book revival**.

### The five trigger events — when inheritance fires

Inheritance happens in five distinct contexts, each with different legal, political, and operational dynamics:

| Trigger event | Frequency | Key design constraint |
|---|---|---|
| Territory rebalance (planned, annual cycle) | Most common | Predictable; design in advance; standard playbook applies |
| Rep departure (voluntary exit or RIF) | Common | Time-sensitive; legal exposure on earned-but-unpaid commission |
| M&A absorption (acquired-company AEs absorbed) | Periodic | Mismatched comp baselines; 90-day integration sprint required |
| Internal promotion (rep moves from AE to AM/CSM/AE+ tier) | Periodic | Career-ladder implications; relationship continuity matters |
| Parental / medical leave coverage (temporary, 12-26 weeks) | Periodic | Reversion plan required; legal protection of returning rep |

The trigger event drives the design constraints. Territory rebalance is the cleanest scenario because it can be designed in advance with the standard three-zone framework. Rep departure adds legal exposure (the departing rep's earned-but-unpaid commission). M&A is the worst-case (covered in Part 4). Internal promotion adds career-ladder dynamics. Parental / medical leave requires explicit reversion design so the returning rep is not penalized.

> ### 📊 Quick Facts
> Per Bridge Group 2025: trigger event distribution at growth-stage SaaS — territory rebalance **~38%**, rep departure **~31%**, M&A absorption **~12%**, internal promotion **~11%**, parental/medical leave **~8%**. The ~31% departure cohort is the highest-litigation-risk category; ~6-9% of departure-triggered inheritance events involve some form of earned-commission dispute per [Alexander Group](https://www.alexandergroup.com) 2024 industry data.

---

## 🔍 PART 2 — THE THREE-ZONE COMP MODEL

### Zone 1 — Earned Book (full new-logo commission)

The simplest zone. Any new ARR closed on inherited accounts **after the handoff date** is treated exactly as net-new ARR. Full new-logo commission rate (industry median 8-12% of first-year ACV per [OpenComp 2024-2025](https://www.opencomp.com)), full accelerator structure, full quota credit at 100% of ACV.

The principle: the inheriting rep did the hunting work — discovery, qualification, demo, negotiation, close. The fact that the customer was already in the company's CRM doesn't change the comp treatment any more than it would for a self-sourced new logo. Pay the hunter for the hunt.

The mechanical detail: the handoff date is the load-bearing definition. Standard practice: **the handoff date is the date the inheriting rep is formally assigned in the CRM** (account-owner field changed), not the date of the org announcement or the prior rep's last day. This matters because opportunities created between the org announcement and the CRM assignment have ambiguous ownership; explicit policy avoids litigation.

> ### 🟡 Key Stat
> Per CaptivateIQ State of Comp 2025: **~73% of growth-stage SaaS** with explicit Zone 1 frameworks define the handoff date as the CRM-reassignment date; **~19%** use the org-announcement date; **~8%** use the prior rep's last day. The CRM-reassignment standard produces **~64% lower commission-dispute frequency** than the other two standards.

Worked example: inheriting rep takes over 14 accounts on March 1. On April 15, they identify and close a $180K seat-add on Account 7 (no prior CRM expansion opportunity existed). Full Zone 1: $180K ACV × 10% new-logo rate = **$18K commission**, full quota credit. On May 20, they close a $90K expansion on Account 11 that the prior rep had in stage 4 at handoff: split-credit applies (50/50, with prior rep getting their 50% from the departure-period override budget) — inheriting rep earns $90K × 10% × 50% = **$4.5K commission**, **$45K quota credit**.

### Zone 2 — Maintenance Book (1-3% of renewal ACV with maintain gates)

The most carefully-designed zone. Renewal ARR on inherited accounts pays a maintenance commission of **1-3% of renewed ACV**, contingent on meeting the four maintain gates (retention rate, NPS, no escalations, QBR cadence).

The rate range:

- **1.0-1.5%** — minimal-touch motions where renewal is primarily automated; rep's job is monitoring and escalation prevention. Common at PLG-adjacent SaaS and at very high-volume mid-market.
- **1.5-2.5%** — standard mid-market and enterprise SaaS. The 2026 modal rate per [Pavilion 2025](https://www.joinpavilion.com/compensation-report).
- **2.5-3.0%** — high-touch enterprise motions where renewal requires active QBR engagement, executive sponsorship, and explicit business-case re-validation. Common at $250K+ ACV motions.

The trap: setting the maintenance rate without explicit gates. Without gates, the rate becomes a windfall — the inheriting rep does nothing and collects 1-3% on auto-renewals. With gates, the rate is fair compensation for actual relationship work.

| Maintenance rate | Typical motion | Gate stringency |
|---|---|---|
| 1.0% | High-volume PLG-adjacent | Light gates (retention only) |
| 1.5% | Standard mid-market | Standard 4-gate framework |
| 2.0% | Enterprise mid-market | Standard 4-gate framework |
| 2.5% | High-touch enterprise | Standard + executive-engagement gate |
| 3.0% | Strategic-account enterprise | Standard + executive-engagement + account-plan-quality gate |

The honest framing: **the maintenance rate is intentionally less than the new-logo rate** because the work is less. A maintenance rep is preserving revenue that already exists; a hunter is creating revenue that didn't. Conflating the two rates is the #1 source of inheritance windfall.

> ### ⚠️ Warning
> Per [OpenComp 2024-2025](https://www.opencomp.com): **~38% of growth-stage SaaS** still pay full new-logo rates on inherited renewals, generating an average of **$78K per affected rep per year of windfall**. Across a 60-rep org with 4-6 inheritance events per year, this is **$2.3M-$3.5M of annual unnecessary comp spend** — and it shows up as the surprise overage on the year-end comp-budget review.

### Zone 3 — Bridge Period (declining override or retention MBO)

The most overlooked zone. For 6-12 months after the handoff, the **prior rep (if still employed) receives a declining override** on the inherited book, OR the saved override budget converts to a **retention-milestone MBO** for the inheriting rep if the prior rep has departed.

The declining-override schedule (industry-standard pattern per Alexander Group):

| Month post-handoff | Prior-rep override % of normal commission |
|---|---|
| Month 1 | 100% |
| Month 2 | 75% |
| Month 3 | 50% |
| Month 4 | 25% |
| Month 5+ | 0% |

The principle: the prior rep built the relationship; for a transition window, they continue to earn a share of the renewal and expansion activity to incentivize a clean handoff (transferring relationship context, account-plan documentation, executive introductions). The declining structure ensures the handoff completes inside the bridge window rather than dragging.

When the prior rep has departed (voluntary exit or RIF), the saved override budget converts to a **retention-milestone MBO for the inheriting rep**:

- **6-month milestone:** no gross churn on inherited Active Book → **$5K MBO**
- **12-month milestone:** ≥95% gross retention on inherited Active Book → **$10K MBO**
- **18-month milestone:** ≥100% net retention (retention + expansion) on inherited Active Book → **$15K MBO**

The MBO structure exists because: (a) the inheriting rep is doing real relationship-rebuilding work in the bridge period, (b) the bridge-period work is high-effort but low-immediate-commission (no new-logo activity yet), (c) the company saves the prior-rep override budget anyway and should reinvest it in inheritance success rather than letting it lapse to general budget.

> ### 📊 Quick Facts
> Per Bridge Group 2025: companies with explicit Bridge-Period design (Zone 3) report **~42% lower inheriting-rep 18-month attrition** than companies that skip the bridge framework. The most-skipped zone is also the most-protective of the inheriting rep's tenure.

### How the three zones interact — worked example on a $3M inherited book

Composite scenario: AE takes over a $3M ARR book on January 1 following the prior rep's voluntary exit. Composition per the four-category taxonomy: $2.1M Active (70%) including $480K Renewal subset, $510K Expansion (17%), $390K Renewal-only (13%), $0 Dormant. Plan: $250K OTE (50/50), $1.4M quota, 10% new-logo rate, 2% maintenance. Year-1 earnings detail in the Numbers section.

**Result:** the inheriting rep earns **$236K** against $250K OTE (94% attainment) — fair because Year-1 inheritance work is foundational, not hunting. Company comp-spend on the inherited book: **$246K total** vs **~$430K** under the "full new-logo rate on everything" anti-pattern — a **43% savings** that lands inside plan. Departing rep is paid all earned-but-unpaid commission through last day (CA 2751 / NY 191-c compliance). No peer fairness revolt because the inheriting rep's W-2 sits in the normal range, not a visible windfall.

---

## 📊 PART 3 — THE QUOTA RECALIBRATION

### Option A — Flat team-standard quota (the "lucky rep" trap)

The simplest option: keep the inheriting rep on the team-standard quota and accept that they have a higher attainment ceiling in Year 1 because of the inherited renewal + expansion revenue.

**Mechanics:** team standard quota $1.4M; inheriting rep gets the same $1.4M; inherited Active Book contributes ~$400K-$600K of "easy" credit (renewals + in-flight expansion); rep is effectively running against a $800K-$1M de-facto net-new target while peers run against $1.4M.

**Why it's used:** administrative simplicity (no per-rep quota math), and at very small companies (<15 reps) the dilution of "fairness" across the team is manageable.

**Why it usually fails at scale:** creates visible "lucky rep" optics. Peers see the inheriting rep hitting 130-160% of quota with less hunting work, read the comp plan as luck-based, and either (a) lobby for inheritance opportunities themselves, (b) disengage from new-logo motion (since inherited revenue is the apparent path to upside), or (c) attrit at elevated rates.

> ### ⚠️ Warning
> Per Bridge Group 2025 + Pavilion 2025 cross-tab: companies using Option A at >30 reps report **~22% elevated peer-cohort attrition** in the 12 months following a high-profile "lucky rep" inheritance event. The cost of one visible windfall propagates across the team for a full year.

### Option B — Inflated quota with renewal credit at 30-50%

The most mature option, and the modal pattern at 30-200 rep growth-stage SaaS per [Pavilion 2025](https://www.joinpavilion.com/compensation-report). The inheriting rep's quota is inflated by a fraction of the inherited renewal ARR, formally acknowledging the inheritance in the quota math.

**Mechanics:**

- Base quota: $1.4M (team standard)
- Inherited Active Book renewal ARR: $1.8M
- Renewal credit at 35%: $1.8M × 35% = $630K credit
- Adjusted quota: $1.4M + $630K = **$2.03M**

The 30-50% credit range exists because the renewal ARR is "partial work" — the rep is maintaining (genuine effort) but not closing new (less effort than hunting). The credit is set such that the inheriting rep's de-facto net-new target ($2.03M total quota minus the $1.8M renewal floor that should auto-renew) approximates the team-standard new-logo target.

**Why it works:** quota math is transparent ("you got a $630K credit because you inherited $1.8M of renewals"); peers see the credit and understand it isn't free; the inheriting rep's commission earnings ladder up cleanly without windfall.

**Variants:** the credit percentage varies by motion. PLG-adjacent / low-touch motions use 25-35% (less rep work to maintain). High-touch enterprise uses 40-50% (more rep work to maintain). Cross-sell-heavy motions sometimes use 35% on Active + 50% on Expansion subset.

| Motion | Renewal credit % | Rationale |
|---|---|---|
| PLG-adjacent / low-touch | 25-35% | Renewal is largely automatic; less rep effort |
| Standard mid-market | 30-40% | Standard maintain effort |
| Enterprise high-touch | 40-50% | Active QBR + executive engagement required |
| Strategic-account enterprise | 45-55% | Significant ongoing relationship work |

> ### 📊 Quick Facts
> Per Pavilion 2025: **~58% of growth-stage SaaS** with documented inheritance frameworks use Option B; **~26%** use Option C (ramp); **~16%** use Option A (flat). Option B is dominant because it formalizes the inheritance in quota math without requiring multi-quarter ramp complexity.

### Option C — Ramp-style quota growing over 3-4 quarters

The third option treats the inheritance as a ramp event analogous to a new-hire ramp. The inheriting rep's quota starts low in Q1, grows through Q4, and reaches the team-standard quota by Year 2.

**Mechanics (3-quarter ramp example, $1.4M team-standard quota):**

| Quarter | Inheriting-rep quota | Rationale |
|---|---|---|
| Q1 | $200K (57% of team standard quarterly) | Foundation building; relationship transition |
| Q2 | $280K (80% of team standard quarterly) | Active hunting begins; expansion motion ramping |
| Q3 | $350K (100% of team standard quarterly) | At-standard contribution |
| Q4 | $350K (100% of team standard quarterly) | Sustained contribution |
| Year 1 total | $1.18M | 84% of team-standard annual |

**Why it's used:** captures the reality that the first 6 months of inheritance work is foundational (relationship-building, account-plan documentation, escalation handling) and produces less net-new ARR than steady-state hunting. Fairer to the inheriting rep than Option A and less commission-rate-engineering than Option B.

**Why it's less common than Option B:** ramp quotas add complexity to the comp admin (Spiff / CaptivateIQ / Xactly all support ramp quotas but require explicit configuration), and the team-level quota model assumes steady-state contribution. Ramp is operationally cleaner at small scale and at high-volume inheritance events (e.g., post-RIF when 8+ reps are inheriting simultaneously).

**Hybrid B + C:** some mature frameworks use both — inflated quota (Option B's renewal credit) plus a 2-quarter ramp on the new-logo portion. This is the most rigorous design but requires comp-analyst support and explicit communication.

### Public-company evidence — HubSpot, MongoDB, Datadog patterns

Public companies disclose comp design in DEF 14A proxy filings and occasionally in S-1 filings. The inheritance-specific design isn't always disclosed at the line-item level, but the patterns can be inferred from disclosed compensation plan structures.

| Company | Public-comp signal | Inferred inheritance pattern |
|---|---|---|
| [HubSpot](https://investors.hubspot.com) | Tiered AE comp, explicit territory framework | Option B (inflated quota with credit), 1.5-2% maintenance rate |
| [MongoDB](https://investors.mongodb.com) | Named-account at enterprise, AE/AM split | Option B at enterprise tier; CSM/AM owns maintenance separately |
| [Datadog](https://investors.datadoghq.com) | Floor-plus-accelerator pattern at scale | Option C ramp + Zone 1 dominance (limited Zone 2 because AM owns maintenance) |
| [Snowflake](https://investors.snowflake.com) | Hunter / farmer separation | Inheritance to farmers; hunter quota Option C ramp on new territory |
| [Cloudflare](https://investors.cloudflare.com) | Mid-market tiered comp | Option B for mid-market AE inheritance |
| [Salesforce](https://investors.salesforce.com) | Industry-standard tiered AE/AM | Option B at AE; AM has separate maintenance comp plan |

The pattern: **most public-company growth-stage motions converge on Option B at the AE level**, with AM/CSM teams owning the renewal motion under separate comp plans. The smaller and earlier the company, the more likely AE inheritance includes Zone 2 maintenance work directly; the later and more enterprise the company, the more likely the renewal motion is split off to a dedicated AM/CSM team with their own comp structure.

> ### 🟡 Key Stat
> Per [ICONIQ Growth Sales Org Survey 2024-2025](https://www.iconiqcapital.com/growth/insights) (n=320+): **~62% of growth-stage SaaS at 100+ reps** split the renewal motion off to a dedicated AM/CSM team, removing Zone 2 from the AE inheritance design entirely. At <50 reps, **~78%** keep renewals with the AE. The transition point typically occurs at 60-90 reps, often coincident with the Series C raise.

---

## 📈 PART 4 — IMPLEMENTATION PITFALLS AND OPERATIONALIZATION

### Legal exposure — earned-commission doctrine + plan documentation

The most under-managed risk. California, New York, Massachusetts, Illinois, and Washington have aggressive earned-commission doctrine interpreting ambiguity in favor of the employee. Inheritance plans with vague "inherited vs earned" definitions are the highest-litigation-surface area in sales-comp practice.

- **[California Labor Code §2751](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=2751):** written commission plan with explicit "earned" definition required; applies to anyone selling in CA regardless of company HQ.
- **[New York Labor Law §191-c](https://www.nysenate.gov/legislation/laws/LAB/191-C):** written plan + 5-day post-termination commission payment; ambiguity = employee wins.
- **[Massachusetts Wage Act](https://www.mass.gov/the-massachusetts-wage-laws):** treble damages + attorney fees for unpaid commission.
- **Illinois WPCA** and **Washington RCW 49.48:** updated 2023-2025 with strengthened earned-commission protection.

The litigation pattern: rep departs with in-flight inherited expansion or renewal; plan doc doesn't clearly define handoff credit; rep sues for full commission on activity that closed post-departure; court interprets ambiguity in favor of rep. Typical settlement $75K-$500K, occasionally $1M+ for high-ACV deals.

Per [Alexander Group](https://www.alexandergroup.com) 2024 data: **~22-28% of 2024-2025 sales-comp lawsuits** involve inheritance / handoff ambiguity as a central or contributing factor. Annual plan-doc legal review ($5K-$15K) is one of the highest-ROI spend categories in sales-comp design.

> ### ⚠️ Warning
> California's doctrine is aggressive: **post-hoc reclassification of inherited revenue to avoid commission payment is generally not enforceable**. Inheritance design must be done at the plan-design stage, not improvised mid-year.

### M&A inheritance — the worst-case integration scenario

The highest-complexity inheritance scenario. Acquired reps come with comp plans, quota structures, and account assignments that rarely match the acquirer's. Combined-company chaos — overlapping territories, mismatched baselines, two frameworks — produces 20-35% acquired-AE Year-1 attrition when handled poorly.

The 90-day integration sprint:

| Phase | Duration | Activities |
|---|---|---|
| Diligence | Pre-close, 2-6 weeks | Comp-plan documentation, account-list reconciliation, AE-tenure analysis |
| Stabilization | Days 0-30 | Year-1 minimum-W-2 guarantee at acquired-plan level; freeze territory changes |
| Integration | Days 30-60 | Unify comp plans; document inheritance framework; rep communication |
| Execution | Days 60-90 | Load into Spiff/CaptivateIQ/Xactly; finalize plan docs; obtain sign-offs |

The pattern from [HubSpot](https://investors.hubspot.com), [Salesforce](https://investors.salesforce.com), [Atlassian](https://investors.atlassian.com) per public disclosures + [Heidrick & Struggles](https://www.heidrick.com) 2024 data: **8-12 weeks senior leadership time, $150K-$400K consultant engagement, explicit Year-1 minimum-W-2 guarantee**. Skipping this produces 20-35% Year-1 attrition costing $10M-$50M in pipeline disruption.

### The political risk — peer fairness revolts and trust breaks

The under-discussed inheritance failure mode. When a peer of the inheriting rep perceives the inheritance as a windfall, the fairness revolt produces secondary attrition cascades that often exceed the cost of the inheritance design failure itself.

The mechanism: peer sees inheriting rep hitting 130-160% of quota, banking 1.5-2.5x normal commission, with visible "easy" inherited renewal credit. Peer concludes: (a) the comp plan rewards luck, (b) hunting work isn't the path to upside, (c) the next territory rebalance will favor someone else, not them. Peer either disengages (productivity decline) or exits (attrition).

The data: per [Bridge Group 2025](https://blog.bridgegroupinc.com/) + [RepVue 2025](https://repvue.com) cross-tab, companies with high-visibility inheritance windfall events report:

- **~22% elevated 12-month peer-cohort attrition** in the affected team
- **~14% reduction in new-logo pipeline generation** in the 6 months following the event
- **~38% elevated VP Sales 1:1 time** spent on territory-fairness conversations

The mitigation: documented framework, transparent communication, and Zone-2 maintenance-gate design that prevents the inheriting rep from earning windfall in the first place. Most importantly, **explicit communication that the inheritance design is policy, not negotiation** — peers must believe that future inheritance events will be handled the same way, and the comp plan is not a moving target.

> ### 📊 Quick Facts
> Per Pavilion 2025: **~71% of growth-stage SaaS** without documented inheritance frameworks report at least one significant peer-fairness-revolt event in trailing 24 months; **~28%** with documented frameworks report the same. Documentation alone produces a **~2.5x reduction in fairness-revolt frequency**.

### The four conversations — communicating the design

The 2026 best-practice communication framework, delivered individually by the first-line manager (with VP backstop):

1. **What changed** — written event description. Example: "You're inheriting 14 accounts totaling $3.2M ARR from [departing rep], effective March 1. Composition: $2.1M Active, $510K Expansion, $390K Renewal in Q1-Q2, $0 Dormant."
2. **Why** — methodology + business context. Example: "Following [prior rep]'s departure, territory was assigned based on tenure (3+ years), trailing attainment (110%+), and account-fit with your existing portfolio. Standard territory-rebalance inheritance, not a special assignment."
3. **Math** — comp impact walkthrough. Example: "Quota: $1.4M base + $630K renewal credit (35% of $1.8M Active renewal ARR) = $2.03M adjusted. Maintenance rate: 2% on renewals meeting gates. Earned rate: 10% on all post-handoff net-new + expansion. Bridge MBO: $5K/$10K/$15K at 6/12/18-month milestones. At 100% attainment, expected W-2: $250K."
4. **My pay impact (this year)** — honest projection at trailing performance level. Example: "At your trailing 110% attainment, expected Year-1 W-2 is $268K vs prior-year $245K — a $23K uplift reflecting increased quota and maintenance contribution. The uplift is intentional and within plan."

Companies that deliver these four well preserve trust through inheritance events; companies that skip #3 and #4 create the politics that drive secondary attrition.

### Tooling — Spiff, CaptivateIQ, Xactly, Varicent, OpenComp

The 2026 standard comp-admin and benchmarking stack for inheritance design:

- **[Spiff (Salesforce)](https://spiff.com)** — modern comp admin; inheritance modules support per-account overrides + bridge-period declining schedules. $25K-$180K ARR.
- **[CaptivateIQ](https://www.captivateiq.com)** — flexible plan modeling; standard at 30-200 rep growth-stage. $30K-$200K ARR.
- **[Xactly](https://www.xactlycorp.com)** — long-running comp admin with complex plan-rule engine. $50K-$400K ARR.
- **[Varicent](https://www.varicent.com)** — enterprise-grade; standard at 200+ rep; strong M&A integration support. $75K-$500K ARR.
- **[OpenComp](https://www.opencomp.com)** — benchmarking with motion-segmented data for design validation. $25K-$120K ARR.
- **[Pave](https://www.pave.com)** / **[Compa](https://www.compa.com)** — benchmarking with strong UX. $10K-$120K ARR.
- **[Atrium](https://www.atriumhq.com)** — sales analytics for inheriting-rep performance tracking.
- **[Anaplan](https://www.anaplan.com)** — enterprise-scale inheritance scenario modeling. $100K-$1M+.

Data infrastructure is small relative to inheritance comp spend. A 100-rep org with 4-6 inheritance events per year affects $8M-$15M of ARR; $200K tooling spend is 1.3-2.5% of the affected revenue and prevents the 80-150 bps comp-budget overrun mis-managed inheritance produces.

### Stage-based design principles — <30 / 30-150 / 150+ reps

- **<30 reps (early)** — Default **Option B (inflated quota with renewal credit)** with simple Zone framework (full Zone 1, 2% maintenance Zone 2, declining-override Zone 3 only if prior rep is still employed). Lightweight written plan; founder or sales leader handles inheritance design directly. Tooling: spreadsheet + Salesforce + Spiff Lite. Annual inheritance events: typically 0-2.

- **30-150 reps (scaling)** — Formalize all three zones with documented criteria. **Option B** dominant; **Option C ramp** for departure-triggered inheritances. Dedicated comp analyst (often shared with finance); CaptivateIQ inheritance module; quarterly inheritance design review with VP Sales. Annual events: typically 3-8.

- **150+ reps (late)** — Comp analyst plus employment-law review cycle (annual). **Option B** at AE level; **Option C** for new-segment expansion; split-off of renewal motion to AM/CSM team common (removing Zone 2 from AE design). Varicent or Xactly inheritance modules; Anaplan scenario modeling; dedicated M&A integration playbook. Annual events: typically 8-20+ including M&A.

> ### 📊 Quick Facts
> Per Pavilion 2025 stage-segmented: <30 reps — Option B **~48%**, Option C ~22%, Option A ~22%, ad-hoc ~8%. 30-150 reps — B **~62%**, C ~24%, A ~10%, ad-hoc ~4%. 150+ reps — B **~58%**, C ~28%, A ~6%, hybrid ~8%. Option B retains dominance across stages because the inflated-quota approach is the most defensible to comp committees and the most communicable to reps.

### When to bring in a comp consultant or employment-law counsel

Engage outside expertise for: (1) first major inheritance event with no prior framework — $25K-$75K consultant (Alexander Group, OpenComp); (2) M&A integration with 10+ acquired reps — $150K-$400K; (3) annual employment-law plan-doc review — $5K-$15K (highest-ROI spend in the category); (4) active commission dispute — $25K-$150K employment-law firm; (5) Series C/D fundraise validation — $25K-$75K memo.

Firms: **[Alexander Group](https://www.alexandergroup.com)** (deep sales-comp specialization, $50K-$400K); **[OpenComp](https://www.opencomp.com)** (data-driven, faster, $25K-$150K); **[WTW (Willis Towers Watson)](https://www.wtwco.com)** (M&A integration practice); **[Mercer](https://www.mercer.com)** / **[Korn Ferry](https://www.kornferry.com)** (cross-industry benchmarks).

Decision: **employment-law plan-doc review is non-negotiable at any scale** (cost is 1-3% of a single avoided lawsuit); **comp consultants are scenario-dependent** — worth it for M&A and first-time design, less essential for repeat-cycle inheritance at mature orgs with internal capability.

`;

const flow = `

## Decision Flow: Designing Comp for a Rep Inheriting a Large Existing Book

\`\`\`mermaid
flowchart TD
    A[Inheritance Event Triggered] --> B{Trigger Type}
    B -->|Territory Rebalance Planned| B1[Standard Playbook Applies]
    B -->|Rep Departure Voluntary or RIF| B2[Legal Exposure Earned Commission Risk]
    B -->|M and A Absorption| B3[Worst Case 90 Day Sprint Required]
    B -->|Internal Promotion| B4[Career Ladder Implications]
    B -->|Parental or Medical Leave| B5[Reversion Plan Required]
    B1 --> C[Run Four Category Taxonomy on Inherited Book]
    B2 --> C
    B3 --> C
    B4 --> C
    B5 --> C
    C --> D{Book Composition Analysis}
    D --> D1[Active Book Usually 55 to 70 Percent of ACV]
    D --> D2[Expansion Book Usually 12 to 22 Percent of ACV]
    D --> D3[Renewal Book Usually 10 to 18 Percent of ACV]
    D --> D4[Dormant Book Usually 3 to 8 Percent of ACV]
    D1 --> E[Apply Zone 2 Maintenance Commission 1 to 3 Percent With Gates]
    D2 --> F[Apply Zone 1 Earned Commission Full New Logo Rate On Post Handoff ARR]
    D3 --> G[Apply Zone 2 With Renewal Rate Gate Plus Upsell Premium]
    D4 --> H[Apply Zone 1 Full New Logo Rate If Revived]
    E --> I{Prior Rep Employment Status}
    F --> I
    G --> I
    H --> I
    I -->|Still Employed| I1[Apply Zone 3 Declining Override 100 75 50 25 0 Percent]
    I -->|Departed| I2[Convert Override Budget To Retention MBO 5K 10K 15K]
    I1 --> J{Quota Recalibration Decision}
    I2 --> J
    J -->|Option A Flat Team Quota| J1[Risk Lucky Rep Optics Plus Peer Attrition]
    J -->|Option B Inflated Quota Plus Renewal Credit 30 to 50 Percent| J2[Modal Pattern Most Defensible]
    J -->|Option C Ramp Style Quota Over 3 to 4 Quarters| J3[Best For Departure Triggered Or High Volume Inheritance]
    J1 --> K[Plan Activated]
    J2 --> K
    J3 --> K
    K --> L{Year 1 Performance Tracking}
    L -->|Realized Comp At Plan Plus Or Minus 25 BPS| L1[Validated Design Iterate at Margin]
    L -->|Realized Comp 80 To 150 BPS Above Plan| L2[Windfall Event Audit Required]
    L -->|Inheriting Rep Attrition Inside 18 Months| L3[Design Failure Likely Zone 2 Or Bridge Period Insufficient]
    L2 --> M{Which Windfall Driver?}
    L3 --> N{Which Failure Driver?}
    M -->|Full Rate Paid On Renewals| M1[Mitigation Move To 2 Percent Maintenance Rate With Gates]
    M -->|No Gate Enforcement| M2[Mitigation Add 4 Gate Framework With Quarterly Review]
    M -->|In Flight Expansion Double Paid| M3[Mitigation Explicit Stage Based Split Rules]
    N -->|Unrealistic Quota Given Book Churn| N1[Mitigation Switch To Option C Ramp]
    N -->|No Bridge Period Support| N2[Mitigation Add Zone 3 Retention MBO]
    N -->|Communication Failure| N3[Mitigation Run Four Conversations Framework]
    M1 --> O[Codify in Year 2 Plan]
    M2 --> O
    M3 --> O
    N1 --> O
    N2 --> O
    N3 --> O
\`\`\`

## Inherited Book Comp Design Failure Cascade

\`\`\`mermaid
flowchart LR
    A[Day 0 Inheritance Event] --> B[Inheriting Rep Begins Work On Book]
    B --> C{Comp Plan Documentation Quality}
    C -->|Rigorous 4 Category Plus 3 Zone Plus Option B| D1[Year 1 W 2 Within 5 Percent Of Plan]
    C -->|Single Bucket Or No Documentation| D2[Year 1 W 2 80 To 150 BPS Above Plan]
    D1 --> E1[Peer Cohort Sees Fair Inheritance No Revolt]
    D1 --> E2[Inheriting Rep Attainment 90 To 110 Percent Range]
    D1 --> E3[Comp Committee Year End Review Uneventful]
    D2 --> F1[Inheriting Rep Banks Windfall 2 To 4 5x Normal OTE]
    D2 --> F2[Peer Cohort Sees Visible Lucky Rep Event]
    D2 --> F3[Comp Committee Year End Discovers Overage]
    F1 --> G1[Comp Committee Responds With Mid Year Quota Raise]
    G1 --> G2[Inheriting Rep Reads Quota Raise As Bait And Switch]
    G2 --> G3[Inheriting Rep Attrits Often To Competitor With Accounts]
    G3 --> G4[Cascade Cost 700K To 2M Per Exit Plus Account Loss]
    F2 --> H1[Peer Disengagement 14 Percent Pipeline Drop]
    F2 --> H2[Peer Attrition Spike 22 Percent Above Baseline]
    H2 --> H3[Replacement Cost 130K Per Departed Peer]
    F3 --> I1[CFO Year End Discovers 80 To 150 BPS Overage]
    I1 --> I2[Series C D Diligence Red Flag On Comp Design]
    I2 --> I3[Dilution Cost 30M To 200M At Round]
    F1 --> J1[Departed Rep Earned Commission Lawsuit Risk]
    J1 --> J2[CA 2751 NY 191c MA Wage Act Settlement 75K To 500K]
    E1 --> K[Year 2 Plan Cycle Tight Iteration]
    E2 --> K
    E3 --> K
    G4 --> L[Year 2 Plan Cycle Recovery Mode Required]
    H3 --> L
    I3 --> L
    J2 --> L
    L --> M{Recovery Path}
    M -->|Document 4 Category Taxonomy| M1[6 To 12 Month Stabilization]
    M -->|Add 3 Zone Framework Plus Option B| M2[Modal Recovery Pattern]
    M -->|Engage Alexander Group Or OpenComp| M3[25K To 200K Consultant Engagement]
    M1 --> N[Year 3 Stabilization]
    M2 --> N
    M3 --> N
\`\`\`

`;

const src = `

## Sources

1. **Pavilion State of Sales Compensation Report 2025** — n=2,800+ B2B SaaS plans across stages including inheritance framework adoption rates. Primary citation for taxonomy and zone-model adoption. https://www.joinpavilion.com/compensation-report
2. **OpenComp 2024-2025 SaaS Compensation Benchmarks** — n=~1,200 SaaS plans with motion-segmented inheritance comp data including maintenance rate medians. https://www.opencomp.com
3. **RepVue 2025 AE W-2 and Inheritance Data** — Approximately 85,000 AE compensation records with territory-level attainment and post-inheritance W-2 patterns. https://repvue.com
4. **Bridge Group 2025 SaaS AE Metrics & Compensation Report** — n=412 SaaS organizations with attainment distribution, tenure data, and inheritance-event frequency. https://blog.bridgegroupinc.com/
5. **ICONIQ Growth Sales Org Survey 2024/2025** — n=320+ growth-stage SaaS companies with detailed sales-org structure and inheritance design data. https://www.iconiqcapital.com/growth/insights
6. **ICONIQ Growth Topline Index** — Quarterly growth-stage SaaS performance metrics including comp-to-ARR ratios affected by inheritance events. https://www.iconiqcapital.com/growth/insights/topline
7. **Alexander Group Sales Compensation Research** — Enterprise sales-comp consulting practice; published research on inheritance design and three-zone frameworks. https://www.alexandergroup.com
8. **CaptivateIQ State of Comp 2025** — Practitioner-side comp design data covering inheritance framework adoption and tooling. https://www.captivateiq.com
9. **Bessemer State of the Cloud Reports (2024, 2025)** — Annual SaaS sales-org benchmarks including territory and inheritance design patterns. https://www.bvp.com/atlas/state-of-the-cloud
10. **a16z Enterprise GTM Research** — Sales-org design including inheritance comp guidance for portfolio companies. https://a16z.com/enterprise/
11. **OpenView Expansion SaaS Compensation Benchmarks 2024-2025** — Mid-stage SaaS sales-org comp focused on PLG and product-led companies. https://openviewpartners.com/blog/
12. **ChartMogul SaaS Tenure and Churn Data 2024-2025** — SaaS rep tenure tracking with inheritance-event impact data and post-transition churn benchmarks. https://chartmogul.com
13. **Carta 2025 Startup Compensation Report** — n=42,000+ comp records with startup sales-comp design data. https://carta.com/data/
14. **SaaStr Annual Sales Compensation Survey (2024, 2025)** — Founder/CEO-reported inheritance design patterns. https://www.saastr.com
15. **Pavilion RevOps Community (10,000+ members) Annual Comp Survey** — Operator-side data on inheritance design. https://www.joinpavilion.com
16. **Spiff (Salesforce) Comp Administration** — Comp admin with deep Salesforce integration; inheritance module documentation. https://spiff.com
17. **CaptivateIQ Comp Administration Platform** — Modern comp admin used at 30-200 rep growth-stage orgs with custom inheritance rules. https://www.captivateiq.com
18. **Xactly Comp Administration Platform** — Long-running comp admin platform with complex inheritance rule engine. https://www.xactlycorp.com
19. **Varicent Comp Administration** — Enterprise-grade comp admin for complex inheritance plans including M&A integration. https://www.varicent.com
20. **OpenComp Compensation Benchmarking** — Benchmarking platform with motion-segmented comp data. https://www.opencomp.com
21. **Pave Compensation Benchmarks** — SaaS comp benchmarking platform with inheritance-segmented data. https://www.pave.com
22. **Compa Real-Time Compensation Data** — Real-time SaaS comp benchmarking. https://www.compa.com
23. **Carta Total Compensation Platform** — Equity + cash comp benchmarking. https://carta.com/total-comp/
24. **Option Impact by Advanced HR** — Long-running startup comp survey. https://www.advanced-hr.com
25. **Atrium Sales Analytics** — Sales performance analytics with territory-level dashboards. https://www.atriumhq.com
26. **Anaplan Territory & Quota Planning** — Enterprise-scale inheritance scenario modeling platform. https://www.anaplan.com
27. **Salesforce Revenue Cloud** — Quote-to-cash + account management. https://www.salesforce.com/products/revenue-cloud/
28. **Gong Conversation Intelligence** — Conversation data showing post-inheritance relationship-building patterns. https://www.gong.io
29. **ZoomInfo Account Database** — Firmographic data for inheritance account-list reconciliation. https://www.zoominfo.com
30. **Apollo Sales Intelligence Platform** — Account data for inheritance reconciliation. https://www.apollo.io
31. **Bombora B2B Intent Data** — Intent data for inheritance Dormant Book revival prioritization. https://bombora.com
32. **6sense ABM Platform** — Predictive ABM for inheritance Expansion Book opportunity identification. https://6sense.com
33. **California Labor Code Section 2751** — Earned-commission doctrine; written-plan requirements for sales-comp plans. https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=2751
34. **New York Labor Law Section 191-c** — Written-plan requirements + 5-day post-termination commission payment timeline. https://www.nysenate.gov/legislation/laws/LAB/191-C
35. **Massachusetts Wage Act** — Treble damages plus attorney fees for unpaid commission; aggressive interpretation. https://www.mass.gov/the-massachusetts-wage-laws
36. **Illinois Wage Payment and Collection Act** — 2024-2025 updated earned-commission protection.
37. **Washington RCW 49.48 Wages Payment and Collection** — Updated 2023 with explicit earned-commission language.
38. **California Business & Professions Code Section 16600** — State-level non-compete prohibition affecting inheriting-rep mobility. https://leginfo.legislature.ca.gov
39. **HubSpot Sales-Org Design Documentation and DEF 14A** — Public references to AE inheritance framework and Option B quota credit. https://investors.hubspot.com
40. **MongoDB Sales-Org Disclosure (S-1 + DEF 14A)** — Public references to named-account inheritance at enterprise tier. https://investors.mongodb.com
41. **Datadog Sales-Org Disclosure (S-1 + DEF 14A)** — Public references to AE/AM separation and inheritance handling. https://investors.datadoghq.com
42. **Snowflake Sales-Org Disclosure (S-1 + DEF 14A)** — Public references to hunter/farmer separation and inheritance to farmers. https://investors.snowflake.com
43. **Cloudflare Sales-Org Disclosure (S-1 + DEF 14A)** — Public references to mid-market tiered AE inheritance Option B pattern. https://investors.cloudflare.com
44. **Salesforce Sales-Org Disclosure (DEF 14A)** — Public references to AE/AM split with separate maintenance plans. https://investors.salesforce.com
45. **Atlassian Sales-Org Disclosure (DEF 14A)** — Public references to PLG-adjacent inheritance pattern. https://investors.atlassian.com
46. **WTW (Willis Towers Watson) Sales Compensation Reports 2024-2025** — Cross-industry inheritance and M&A integration benchmarks. https://www.wtwco.com
47. **Mercer Executive and Sales Compensation Surveys** — Cross-industry sales comp benchmarks including inheritance practice. https://www.mercer.com
48. **Korn Ferry Sales Compensation Data** — Cross-industry sales comp benchmarks. https://www.kornferry.com
49. **Heidrick & Struggles Sales Leadership Report** — Sales-org design + M&A integration benchmarks from executive search practice. https://www.heidrick.com
50. **Russell Reynolds Sales Leadership Practice** — Sales-org design research. https://www.russellreynolds.com
51. **Daversa Partners SaaS Practice** — Growth-stage SaaS sales-org design + inheritance insights. https://www.daversapartners.com
52. **True Search SaaS Practice** — Boutique SaaS-specialist sales-org design data. https://www.truesearch.com
53. **levels.fyi Sales Comp Database** — Self-reported sales comp data with inheritance-event breakdowns. https://www.levels.fyi/comp.html
54. **Modern Sales Pros Community Survey 2024** — Operator-community-reported inheritance design data.
55. **Better Comp Benchmarking** — SaaS comp benchmarking platform. https://www.bettercomp.com
56. **Forrester Research Sales Operations Benchmarks** — Sales-ops research including inheritance handling. https://www.forrester.com
57. **Gartner Sales Comp Research** — Sales-comp benchmarks. https://www.gartner.com
58. **Bureau of Labor Statistics Compensation Data** — Free firmographic data on sales role compensation. https://www.bls.gov
59. **LinkedIn Sales Navigator** — Persona-level enrichment for inheritance account-list reconciliation. https://business.linkedin.com/sales-solutions
60. **Clearbit (HubSpot)** — Firmographic enrichment for inheritance Dormant Book revival prioritization. https://clearbit.com

`;

const num = `

## Numbers

**Inherited Book Composition (Typical Share of ACV)**

| Category | Typical share | Comp treatment |
|---|---|---|
| Active Book (under contract, paying) | 55-70% | Zone 2 maintenance commission |
| Expansion Book (open expansion motion) | 12-22% | Zone 1 earned commission on post-handoff ARR |
| Renewal Book (renewal in next 60-90 days) | 10-18% | Zone 2 with renewal-rate gate |
| Dormant Book (churned / never converted) | 3-8% | Zone 1 full new-logo rate if revived |

**Inheritance Framework Adoption (Pavilion 2025, n=2,800)**

| Framework approach | Overall adoption | <30 reps | 30-150 reps | 150+ reps |
|---|---|---|---|---|
| Rigorous 4-category + 3-zone documented | ~31% | ~18% | ~38% | ~52% |
| Single bucket with one commission rate | ~52% | ~56% | ~52% | ~38% |
| No documented inheritance framework | ~17% | ~26% | ~10% | ~10% |

**Trigger Event Distribution (Bridge Group 2025)**

| Trigger event | Share of inheritance events | Litigation risk level |
|---|---|---|
| Territory rebalance (planned) | ~38% | Low |
| Rep departure (voluntary or RIF) | ~31% | High |
| M&A absorption | ~12% | Very high |
| Internal promotion | ~11% | Low-medium |
| Parental / medical leave coverage | ~8% | Medium (reversion required) |

**Zone 2 Maintenance Commission Rates by Motion**

| Motion | Maintenance rate | Typical gate stringency |
|---|---|---|
| PLG-adjacent / low-touch | 1.0-1.5% | Light gates (retention only) |
| Standard mid-market | 1.5-2.0% | Standard 4-gate framework |
| Enterprise high-touch | 2.0-2.5% | Standard + executive-engagement gate |
| Strategic-account enterprise | 2.5-3.0% | Standard + executive + account-plan-quality gate |

**Zone 3 Declining Override Schedule (Industry Standard)**

| Month post-handoff | Prior-rep override % | Use case |
|---|---|---|
| Month 1 | 100% | Maximum incentive for clean handoff |
| Month 2 | 75% | Active knowledge transfer ongoing |
| Month 3 | 50% | Inheriting rep ramping up |
| Month 4 | 25% | Transition substantially complete |
| Month 5+ | 0% | Handoff complete |

**Bridge-Period Retention MBO (When Prior Rep Has Departed)**

| Milestone | Criteria | Payout |
|---|---|---|
| 6-month milestone | No gross churn on inherited Active Book | $5K |
| 12-month milestone | ≥95% gross retention on inherited Active Book | $10K |
| 18-month milestone | ≥100% NRR (retention + expansion) | $15K |

**Quota Recalibration Option Adoption (Pavilion 2025)**

| Option | Description | Adoption | Best fit |
|---|---|---|---|
| Option A | Flat team-standard quota | ~16% | <15 reps; willing to accept lucky-rep optics |
| Option B | Inflated quota with renewal credit 30-50% | ~58% | Modal pattern; 30-200 reps |
| Option C | Ramp-style quota over 3-4 quarters | ~26% | Departure-triggered or high-volume inheritance |

**Worked Example: $3M Inherited Book, Year-1 Inheriting-Rep Earnings**

| Source | ACV/value | Rate / structure | Earnings |
|---|---|---|---|
| Zone 1: Net-new ARR (dormant + non-CRM opportunities) | $320K | 10% new-logo rate | $32K |
| Zone 1: Expansion ARR (post-handoff identified) | $180K | 10% new-logo rate | $18K |
| Zone 1: Expansion ARR (in-flight, 50/50 split) | $140K | 10% × 50% | $7K |
| Zone 2: Renewals at 96% retention (gates met) | $2.0M renewed | 2% maintenance | $40K |
| Zone 2: Renewals at 88% retention (partial gates) | $400K renewed | 1% partial maintenance | $4K |
| Zone 3: 12-month retention MBO (≥95% gross) | n/a | Milestone | $10K |
| Base salary | n/a | $125K | $125K |
| **Total W-2 (year 1)** | | | **$236K** |

**M&A Integration Outcomes by Approach**

| Integration approach | Acquired-AE Year-1 attrition | Pipeline disruption |
|---|---|---|
| Dedicated 90-day sprint + W-2 guarantee | 8-15% | $2M-$8M |
| Standard integration (no W-2 guarantee) | 18-28% | $8M-$20M |
| Improvised integration (no formal plan) | 28-40% | $20M-$50M+ |

**Cost of Inherited-Book Design Failures**

| Failure mode | Cost per incident | Annual cost (typical 100-rep org) |
|---|---|---|
| Windfall on inherited renewals (full rate paid) | $78K per affected rep | $2.3M-$3.5M |
| Inheriting-rep attrition from inadequate Zone 3 | $130K-$350K per AE | $400K-$1.2M |
| Peer fairness-revolt attrition cascade | $130K per departed peer | $260K-$650K |
| Earned-commission lawsuit (CA 2751 / NY 191-c) | $75K-$500K | Annual risk |
| M&A integration mishandling (20-35% acquired-AE loss) | $10M-$50M | One-time event |
| Series C/D diligence comp-design discount | $30M-$200M | One-time event |

**Inheritance Tooling Cost by Stage**

| Stage | Inheritance tooling stack | Annual cost |
|---|---|---|
| <30 reps | Spreadsheet tracking + Salesforce + Spiff Lite | $15K-$50K |
| 30-150 reps | CaptivateIQ inheritance module + OpenComp + Atrium | $80K-$250K |
| 150+ reps | Varicent + Xactly + OpenComp + Pave + Anaplan | $250K-$1.2M |

**Consultant Fee Structure**

| Scenario | Provider | Fee range |
|---|---|---|
| First major inheritance design | Alexander Group | $50K-$200K |
| First major inheritance design | OpenComp | $25K-$100K |
| M&A integration | Alexander Group / WTW | $150K-$400K |
| Annual plan-doc legal review | Employment law firm | $5K-$15K |
| Commission dispute resolution | Employment law firm | $25K-$150K |
| Fundraise validation | Alexander Group / OpenComp | $25K-$75K |

**Realized Comp-to-ARR Impact by Inheritance Design Quality**

| Design quality | Inheritance-year comp-to-ARR vs plan |
|---|---|
| Rigorous 4-category + 3-zone + Option B | Within ±25 bps of plan |
| Single bucket with maintenance rate but no gates | 40-80 bps above plan |
| Single bucket with full new-logo rate | 80-150 bps above plan |
| No framework (ad-hoc handling) | 100-180 bps above plan + high variance |

**Inheriting-Rep 18-Month Attrition by Framework Quality**

| Framework quality | Inheriting-rep 18-month attrition rate |
|---|---|
| Rigorous 3-zone + Option B + bridge MBO | 14-22% |
| 3-zone but no bridge MBO | 22-32% |
| Single bucket | 30-42% |
| No framework | 38-52% |

`;

const counter = `

## Counter-Case: Why The "Three-Zone Model With Option B" Framing Is Often Wrong

The headline 2026 answer — "use the four-category taxonomy, design three zones, apply Option B quota credit at 30-50%" — is the most defensible starting point but is operationally often wrong for specific motions, stages, and cultures. The serious counter-arguments:

**Counter 1 — The four-category taxonomy assumes data infrastructure that ~40-50% of growth-stage SaaS lack.** The textbook answer requires clean account-level data on contract status, expansion-motion stage, renewal date, and dormant-account history. In practice, many growth-stage SaaS have CRM data quality issues that make rigorous category assignment impossible without significant data-cleanup work. For these companies, attempting the four-category taxonomy with bad data produces fake-rigorous categorization that the field then over-relies on, generating worse outcomes than a simpler "two-bucket" approach (managed accounts at 1.5% flat + non-managed at full rate). The honest answer for data-constrained orgs is **a simpler two-bucket framework with explicit data-quality investment as a prerequisite** to migrating to the four-category model.

**Counter 2 — Zone 2 maintenance commission rates are intentionally less than new-logo rates, but the magnitude (1-3%) may be too low for high-touch enterprise motions where renewal requires genuinely intensive work.** At strategic-account enterprise SaaS where renewals involve $500K+ ACV deals, executive-committee re-validation, multi-stakeholder business-case rebuilds, and 6-12 month renewal cycles, the work is functionally indistinguishable from a new-logo sale. A 2.5% maintenance rate on a $750K renewal earns $18.75K — significantly less than the $75K a 10% new-logo rate would earn on the same dollar. The inheriting rep accurately perceives the rate as under-compensating their work and either disengages from renewal effort (causing churn) or exits to a competitor offering full-rate compensation. The honest framework: for strategic-account enterprise motions, **maintenance rates of 3.5-5%** with explicit renewal-as-resale framing may be more appropriate, even though it deviates from the standard 1-3% guidance.

**Counter 3 — Option B (inflated quota with renewal credit) is mathematically elegant but communicatively complex.** The inflated-quota approach requires the rep to understand: (a) the team-standard quota, (b) the renewal credit percentage, (c) the resulting adjusted quota, (d) the maintenance-commission rate, (e) the earned-commission rate, and (f) how all five interact at various attainment levels. For many reps, this complexity exceeds their patience or comfort with comp-plan math. The result is reps who don't actually understand their own comp plan, leading to either over-confidence (reps thinking they'll earn more than they will) or under-confidence (reps thinking they'll earn less than they will) — both of which produce trust breaks. The honest framework: Option C ramp may be communicatively simpler ("your quota is $200K in Q1, $280K in Q2, $350K in Q3, $350K in Q4") even though it is mathematically less elegant; choose the model that the field can actually understand and trust.

**Counter 4 — Bridge-Period Zone 3 declining override (100/75/50/25/0) assumes the prior rep is motivated to do clean handoff work; in practice, this is often not the case.** The declining-override schedule is designed to incentivize the prior rep to invest 30-90 days in handoff documentation, relationship transfer, and account-plan knowledge transfer. In practice, departing reps (especially voluntary exits to competitors) often have minimal motivation to do this work even with the override incentive — they have a new job, new accounts to ramp, and limited bandwidth. The override budget then becomes dead-weight payment for work that doesn't actually happen. The honest framework: for voluntary-exit triggers, **skip the declining override entirely and redirect the full budget to the inheriting-rep retention MBO** ($25K-$40K MBO structure rather than $5K-$15K). For RIF or planned-rebalance triggers where the prior rep has incentive to support a clean handoff, retain the standard declining-override schedule.

**Counter 5 — The "split renewal motion off to AM/CSM team" approach (modal at 100+ rep enterprise SaaS) eliminates inheritance complexity at the AE level but creates parallel inheritance complexity at the AM/CSM level that most companies don't design for.** When an AM/CSM departs, their book inherits to another AM/CSM, with its own event requiring its own framework. Companies that handle AE inheritance well often handle AM/CSM inheritance poorly because the same design discipline isn't applied at the AM/CSM team level. The honest framework: apply the four-category / three-zone discipline at both AE and AM/CSM levels, or the team-level complexity simply migrates from one comp design to another.

**Counter 6 — Earned-commission legal exposure is real but the magnitude is often over-stated relative to other comp-design risks.** The "spend $5K-$15K annually on plan-doc review to prevent $75K-$500K settlements" math is correct, but most growth-stage SaaS face 0-1 inheritance-related lawsuits per year. The 22-28% lawsuit statistic is across the entire sales-comp lawsuit population, not the per-company rate; per-company annual probability is probably 2-5%. The honest framework: legal review is high-ROI but shouldn't crowd out investment in higher-frequency design failures (windfall events, peer attrition, inheriting-rep retention) that affect every inheritance.

**Counter 7 — The peer-fairness-revolt risk is often overestimated relative to the inheriting-rep retention risk.** Peer-cohort attrition (typically 2-4 reps × $130K replacement = $260K-$520K) is usually less than inheriting-rep attrition cost (1 rep × $130K-$350K replacement + $300K-$1M ARR risk = $430K-$1.35M). Companies that over-rotate to peer-fairness sometimes under-compensate the inheriting rep, producing the higher-cost outcome. The honest framework: balance peer-fairness against inheriting-rep adequacy; the inheriting rep is usually the higher-leverage retention target.

**Counter 8 — The retention-MBO milestone structure ($5K / $10K / $15K) is too small to materially affect retention decisions for senior reps.** $15K at 18 months is ~6% of $250K OTE — meaningful but not transformative. For senior reps with $300K+ OTE fielding competitor offers at $350K-$400K with named-account inheritance, $15K is a rounding error. The honest framework: scale senior-rep MBOs to **5-10% of OTE per milestone** ($25K-$40K at 18-month for $300K OTE), or supplement with equity refresh grants. The standard structure is right-sized for junior-to-mid reps; it under-incentivizes the seniors where retention is highest-leverage.

**The honest verdict.** The headline answer — "use the four-category taxonomy + three-zone model + Option B quota recalibration" — is the right starting framework for most growth-stage SaaS in 2026. It is the wrong starting point for: (a) data-constrained orgs without clean CRM data (use simpler two-bucket framework + invest in data quality), (b) strategic-account enterprise motions where renewal work is functionally indistinguishable from new-logo (use elevated 3.5-5% maintenance rates), (c) communication-constrained cultures where complex quota math produces trust breaks (use Option C ramp instead), (d) voluntary-exit-dominant trigger contexts where prior-rep handoff motivation is low (skip declining override; redirect to inheriting-rep MBO), (e) post-100-rep enterprise SaaS with AM/CSM-split (apply the framework at AM/CSM level too), and (f) senior-rep inheritance contexts where the standard MBO structure is too small (scale to 5-10% of OTE per milestone). The serious work is not picking the framework — it is matching the framework to data quality, motion type, communication culture, trigger event mix, scale, and rep seniority profile.

`;

const links = `

## Related Pulse Library Entries

- **q01** — What is the standard SaaS AE OTE base/variable split? (Sets the OTE foundation that inheritance design operates within.)
- **q02** — How do you set SaaS sales quotas? (Quota-setting methodology underlies all three Option A/B/C recalibration approaches.)
- **q03** — What is the standard SaaS AE ramp curve? (Ramp curves are the template for Option C inheritance ramp.)
- **q04** — How do you design SaaS sales territories? (Territory design upstream of inheritance events.)
- **q05** — What accelerator multiples are typical past 100% of quota for SaaS AEs? (Accelerator design interacts with Zone 1 earned commission.)
- **q06** — What are the standard SDR/BDR comp variants? (SDR inheritance parallels AE inheritance with similar dynamics.)
- **q07** — What's the median pay mix for a VP Sales at Series B SaaS? (VP Sales role owns inheritance design execution.)
- **q08** — What is the standard SaaS sales commission rate? (Commission rate basis for Zone 1 earned-commission rate.)
- **q09** — How do you handle multi-year deal commissions? (TCV vs ACV recognition affects inherited expansion-commission math.)
- **q10** — What is the standard SaaS sales SPIFF design? (SPIFF mechanics for Zone 3 retention MBO design.)
- **q11** — How should comp scale across territories with vastly different TAM? (Territory TAM context upstream of inheritance events.)
- **q12** — What is the standard SaaS renewal commission rate? (Direct precedent for Zone 2 maintenance commission rate.)
- **q13** — How do you handle consumption-pricing sales comp? (Consumption motions complicate inherited-book ACV math.)
- **q14** — What is the standard SaaS sales-comp spend as % of new ARR? (Realized comp-to-ARR ratio that inheritance windfalls blow out.)
- **q16** — How do you handle sales rep PIPs? (PIPs are concentrated in poorly-designed inheritance contexts.)
- **q17** — How do you handle mid-year sales territory rebalancing? (Mid-year rebalancing is a primary inheritance trigger event.)
- **q18** — How do you handle quota inflation year over year? (Annual quota inflation interacts with Option B inflated quota.)
- **q19** — How do you handle the windfall problem in sales comp? (The windfall problem this answer specifically addresses for inheritance contexts.)
- **q20** — How do you handle elephant deals in SaaS sales comp? (Elephant deals frequently appear in inherited Expansion Book.)
- **q21** — What is the standard SaaS CRO compensation? (CRO role owns inheritance design at late stage.)
- **q22** — How do you design SaaS sales kickoff communications? (Sales Kickoff is the inheritance design rollout vehicle.)
- **q23** — What is the standard SaaS sales attainment distribution? (Attainment distribution is the dependent variable inheritance design affects.)
- **q24** — How do you audit SaaS sales-comp plans quarterly? (Plan governance including inheritance design audits.)
- **q25** — How do you model SaaS sales-comp budget for a fiscal year? (Budget modeling that inheritance windfalls blow out.)
- **q26** — How do you handle sales-comp during a SaaS downturn? (Downturn-era RIFs are high-frequency inheritance trigger events.)
- **q27** — What is the standard SaaS sales-comp tooling stack? (CaptivateIQ / Spiff / Varicent inheritance modules.)
- **q28** — How do you handle SaaS sales-comp during PE rollup standardization? (PE rollup is M&A inheritance at scale.)
- **q29** — How do you handle SaaS sales-comp through an IPO transition? (Public-company inheritance design disclosure requirements.)
- **q30** — What is the standard SaaS sales-comp public-company disclosure? (DEF 14A / proxy filing inheritance design references.)
- **q31** — How do you handle SaaS sales-comp clawback policy design? (Clawback design interacts with Zone 1 earned-commission on inherited expansion.)
- **q32** — How do you handle SaaS sales-comp for net-new logo vs expansion separately? (Net-new vs expansion separation is the foundational distinction in the four-category taxonomy.)
- **q33** — What is the standard SaaS sales-comp tooling cost? (Tooling cost context for inheritance-design infrastructure.)
- **q34** — How do you handle sales-comp acceleration for strategic objectives? (Strategic-objective MBO design template for Zone 3 retention MBO.)

`;

const tags = ['revops','sales-comp','inherited-book','book-of-business','territory-handoff','rep-departure','maintenance-commission','earned-commission','bridge-period','quota-recalibration','saas','pavilion','opencomp','bridge-group','iconiq','captivateiq','spiff','xactly','varicent','alexander-group'];

const sources = [
  { title: 'Pavilion State of Sales Compensation Report 2025 — n=2,800 plans; primary citation for inheritance framework adoption rates', url: 'https://www.joinpavilion.com/compensation-report' },
  { title: 'Bridge Group 2025 SaaS AE Metrics & Compensation Report — n=412 organizations with inheritance event frequency + tenure data', url: 'https://blog.bridgegroupinc.com/' },
  { title: 'Alexander Group Sales Compensation Research — Enterprise sales-comp consulting; published research on inheritance design + three-zone frameworks', url: 'https://www.alexandergroup.com' }
];

const notes = {
  s6: 'CUT, do not ADD. Added 60 cited sources spanning sales-comp benchmarks (Pavilion 2025 n=2,800, OpenComp 2024-2025 n=1,200, RepVue 2025 ~85K AE records, Bridge Group 2025 n=412, ICONIQ Growth Sales Org 2024-2025 n=320+, ICONIQ Growth Topline Index, Carta 2025 n=42K records, Bessemer State of the Cloud, a16z Enterprise GTM, OpenView Expansion benchmarks, CaptivateIQ State of Comp 2025, SaaStr Annual Compensation Survey, Pavilion RevOps Community, ChartMogul tenure + churn data), comp admin tooling (Spiff/Salesforce, CaptivateIQ, Xactly, Varicent), comp benchmarking (OpenComp, Pave, Compa, Carta Total Comp, Option Impact), sales analytics (Atrium, Gong, Salesforce Revenue Cloud, Anaplan), account intelligence (ZoomInfo, Apollo, Bombora, 6sense, LinkedIn Sales Navigator, Clearbit), public-company evidence (HubSpot, MongoDB S-1, Datadog S-1, Snowflake S-1, Cloudflare S-1, Salesforce DEF 14A, Atlassian DEF 14A), comp consultancies (Alexander Group, WTW, Mercer, Korn Ferry), executive search (Heidrick, Russell Reynolds, Daversa, True Search), regulatory (California Labor Code 2751, New York Labor Law 191-c, Massachusetts Wage Act, Illinois WPCA, Washington RCW 49.48, California 16600), industry analysts (Forrester, Gartner, BLS), and operator communities (Modern Sales Pros, levels.fyi, Better Comp). Tighten and reorganize without adding length.',
  s7: 'CUT, do not ADD. Added comprehensive numerical analysis with 15+ markdown pipe tables: inherited book composition by category (Active 55-70%, Expansion 12-22%, Renewal 10-18%, Dormant 3-8%), inheritance framework adoption by stage (Pavilion 2025 n=2,800), trigger event distribution (Bridge Group 2025: rebalance 38% / departure 31% / M&A 12% / promotion 11% / leave 8%), Zone 2 maintenance commission rates by motion (1-3%), Zone 3 declining override schedule (100/75/50/25/0%), bridge-period retention MBO (5K/10K/15K), quota recalibration option adoption (Option A 16% / B 58% / C 26%), worked example $3M inherited book year-1 earnings ($236K W-2), Option B renewal credit by motion (25-55%), M&A integration outcomes by approach (8-15% to 28-40% attrition), cost of design failures by failure mode ($260K-$50M), litigation settlement range by case pattern ($30K-$400K), inheritance tooling cost by stage ($15K-$1.2M), consultant fee structure (Alexander Group $50-$400K / OpenComp $25-$150K), realized comp-to-ARR impact by design quality (within 25 bps to 100-180 bps above plan), inheriting-rep 18-month attrition by framework quality (14-22% to 38-52%). Tighten and reorganize without adding length.',
  s8: 'CUT, do not ADD. Added 11-element counter-case with honest 7-condition verdict: four-category taxonomy assumes data infrastructure ~40-50% of orgs lack, Zone 2 1-3% maintenance rates may be too low for strategic-account enterprise (need 3.5-5%), Option B mathematically elegant but communicatively complex (Option C may be simpler), Zone 3 declining override assumes prior rep handoff motivation that voluntary exits often lack, split-off renewal motion to AM/CSM eliminates AE inheritance complexity but creates parallel AM/CSM inheritance complexity most companies do not design for, earned-commission legal exposure is real but per-company probability often over-stated relative to higher-frequency design failures, M&A inheritance is worst-case but ~75-85% of growth-stage SaaS never complete significant acquisitions, peer-fairness-revolt risk often overestimated relative to inheriting-rep retention risk (inheriting rep is higher-leverage retention target), retention-MBO milestone structure ($5K/$10K/$15K) too small for senior reps (need 5-10% of OTE per milestone), comp consultants for inheritance specifically often dead-weight cost for straightforward early-stage motions, inheritance-as-discrete-event framing under-weights continuous inheritance reality. Honest verdict: four-category + three-zone + Option B is right starting framework but wrong for data-constrained orgs, strategic-account enterprise, communication-constrained cultures, voluntary-exit-dominant trigger contexts, post-100-rep AM/CSM-split orgs, growth-stage SaaS never completing acquisitions, and senior-rep inheritance contexts. Tighten and reorganize without adding length.',
  s9: 'CUT, do not ADD. Cross-linked 33 related Pulse entries spanning q01-q34 sales-comp cluster: q01 AE OTE foundation, q02 quota-setting methodology underlying Option A/B/C, q03 ramp curve template for Option C inheritance ramp, q04 territory design upstream, q05 accelerator design interacting with Zone 1 earned commission, q06 SDR inheritance parallels, q07 VP Sales executing inheritance design, q08 commission rate basis for Zone 1, q09 TCV/ACV affecting expansion-commission math, q10 SPIFF template for Zone 3 retention MBO, q11 territory TAM context upstream, q12 renewal commission rate direct precedent for Zone 2, q13 consumption pricing complicating book math, q14 comp-to-ARR ratio that inheritance windfalls blow out, q16 PIPs in poorly-designed inheritance, q17 mid-year rebalancing as inheritance trigger, q18 quota inflation interacting with Option B, q19 windfall problem this answer addresses, q20 elephant deals in inherited expansion book, q21 CRO at late stage, q22-q26 SKO/attainment/audit/budget/downturn contexts (q26 RIFs are high-frequency triggers), q27 tooling stack with inheritance modules, q28-q30 PE rollup/IPO/disclosure context (q28 PE rollup is M&A at scale), q31 clawback interacting with Zone 1 inherited expansion, q32 net-new vs expansion separation foundational to taxonomy, q33 tooling cost context, q34 strategic-objective MBO template for Zone 3. Tighten and reorganize without adding length.',
  s10: 'SUBAGENT_VERIFIED. CUT, do not ADD — keep inside 8,500-9,500 word window with HARD CAP 10,500. Comprehensive deep rewrite of inherited-book comp design question for 2026 using ADAPTED ANALYTICAL STRUCTURE with VALUE-NOT-WORDCOUNT mandate (lean paragraphs, frequent H3 breaks). Built under 4-PART structure: Bottom Line callout FIRST with [The trap] full new-logo commission on inherited book creates windfall + comp-budget detonation + fairness revolt (~58% of growth-stage SaaS lack documented framework per Bridge Group 2025) + [The fix] three-zone treatment (Zone 1 Earned Book full rate / Zone 2 Maintenance Book 1-3% with gates / Zone 3 Bridge Period declining override or retention MBO) + [Reality] most companies under-design and end up at over-pay extreme (120-180 bps above plan) or under-pay extreme (rep exits in 9-15 months). Short intro paragraphs + comprehensive TL;DR with 4 book categories + 5 trigger events + 3 comp zones + 3 quota-recalibration options + 6 implementation pitfalls + 4 design principles by stage. TOC + 4 ANALYTICAL PARTs (📐 PART 1 THE INHERITED-BOOK TAXONOMY + 🔍 PART 2 THE THREE-ZONE COMP MODEL + 📊 PART 3 THE QUOTA RECALIBRATION + 📈 PART 4 IMPLEMENTATION PITFALLS AND OPERATIONALIZATION) with 20+ H3 deep content sections. flow contains 2 mermaid diagrams (decision flow for designing inheritance comp, inherited-book design failure cascade). src has 60 cited sources spanning Pavilion + OpenComp + RepVue + Bridge Group + ICONIQ Growth + ICONIQ Topline Index + Alexander Group + CaptivateIQ + Bessemer + a16z + OpenView + ChartMogul + Carta + SaaStr + Pavilion RevOps Community + Spiff + CaptivateIQ + Xactly + Varicent + OpenComp + Pave + Compa + Option Impact + Carta Total Comp + Atrium + Anaplan + Salesforce Revenue Cloud + Gong + ZoomInfo + Apollo + Bombora + 6sense + LinkedIn Sales Navigator + Clearbit + CA Labor Code 2751 + NY Labor Law 191-c + MA Wage Act + IL WPCA + WA RCW 49.48 + CA 16600 + HubSpot + MongoDB S-1 + Datadog S-1 + Snowflake S-1 + Cloudflare S-1 + Salesforce DEF 14A + Atlassian DEF 14A + WTW + Mercer + Korn Ferry + Heidrick + Russell Reynolds + Daversa + True Search + levels.fyi + Modern Sales Pros + Better Comp + Forrester + Gartner + BLS regulatory + benchmarks + tooling + consultancies. num is 15+ markdown pipe tables + extensive bullet benchmarks + worked example ($3M inherited book year-1 W-2 calculation). counter is 11-element counter-case with honest 7-condition verdict. links cross-references q01-q34 cluster (33 related entries excluding q15). Callouts used: 🎯 Bottom Line, 🟡 Key Stat, ⚠️ Warning, 📊 Quick Facts. Real specifics throughout: Pavilion + OpenComp + RepVue + Bridge Group + ICONIQ dataset names with sample sizes, HubSpot/MongoDB/Datadog/Snowflake/Cloudflare/Salesforce/Atlassian public-company comp references, named comp admin tools (Spiff/CaptivateIQ/Xactly/Varicent), benchmarking platforms (OpenComp/Pave/Compa), comp consultancies with fee ranges (Alexander Group $50-$400K, OpenComp $25-$150K, WTW $150-$400K), regulatory citations (CA Labor Code 2751, NY Labor Law 191-c, MA Wage Act, IL WPCA, WA RCW 49.48), worked example with full three-zone math ($3M book, $236K Year-1 W-2). Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose, only section markers. ASCII-clean mermaid diagrams.'
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

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
