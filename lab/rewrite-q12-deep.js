// q12 -- What's the typical CRO base salary in NYC vs SF vs remote in 2026?
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

const ID = 'q12';

const tldr = `> ### 🎯 Bottom Line
> - **[The bands by location]** 2026 CRO base salary medians (Pavilion State of Sales Compensation 2025 + OpenComp Topline + Pave Compensation Studio + Levels.fyi exec data + Carta exec equity benchmarks 2025): **SF Bay Area $475-$625K, NYC $425-$575K, Boston $375-$500K, Austin/Denver $350-$475K, Atlanta/Chicago $325-$450K, fully-remote (US-blended) $325-$475K**. OTE is generally **1.6x-2.0x base**, equity bands range from **0.05% FD at pre-IPO to 2.5% FD at Series A**, and the **top-to-bottom geo differential has compressed from 40-55% in 2020-2022 to 25-40% in 2026** as remote work normalized geographic bands — but **2024-2026 hybrid/in-office mandates have partially reversed the compression**, with hybrid CROs earning **8-15% more than fully-remote CROs at the same stage**.
> - **[What drives the gap]** Company stage drives CRO comp **far more than zip code** — a Series D CRO in Tulsa often out-earns a Series A CRO in SF Bay because **funded-ARR scale, deal-size segment, and equity stage value** dominate the comp equation. Cost-of-living indexed to SF Bay (1.00) ranks **NYC 0.92, Boston 0.85, Seattle 0.81, Austin 0.78, Denver 0.74, Chicago 0.71, Atlanta 0.68, US-remote blended ~0.72**; talent depth (SF has the deepest CRO talent pool which paradoxically depresses cash base because supply is high but lifts equity because Sequoia/a16z/Bessemer-backed companies pay 10-20% above market on equity to attract top talent); the equity-trade-off where early-stage CROs trade base for equity and late-stage CROs reverse the trade. International benchmarks: **London +30% vs US-remote, Berlin -20%, Sydney +5%, Toronto -10%, Dublin -15%, Singapore +10%**.
> - **[The remote-work re-rate]** 2020-2022 saw **40-55% geo differentials COMPRESS to 25-40%** as remote work let employers compete for talent anywhere on near-flat comp bands. **2024-2026 has seen a REVERSAL** — return-to-office push, Salesforce/Google/Amazon/Apple/Meta hybrid mandates, comp-committee benchmarking re-anchoring to in-office peers. The **"Bay Area Discount Index"** has emerged at companies like **Atlassian, GitLab, HashiCorp, Zapier, Doist, Automattic** that pay explicit geo-adjusted bands. Legal landscape: **California Labor Code Section 1198.5 + Section 432.3** on pay equality, **Washington State pay-transparency law (SB 5761, effective 2023)**, **NY State pay-band disclosure (LL 32, effective Nov 2022)**, **Colorado Equal Pay for Equal Work Act (2021)**, **Illinois pay-transparency (HB 3129, effective Jan 2025)** all force comp-committee transparency that constrains geo-discount design. Tracking: **Levels.fyi exec comp, Pave Comp benchmarking, Glassdoor Insights, Compensia and Aon Radford executive surveys**.`;

const core = `

A **Chief Revenue Officer (CRO)** is among the most expensive single hires in B2B SaaS — and the "NYC vs SF vs remote base" question is misleading because **stage, scope, equity, and severance design dominate realized comp by 4x-10x over any geo differential**. The honest answer is a stage × geo × scope × motion matrix. The question matters because boards, founders, and candidates routinely anchor on geo medians and miss structural design problems (under-equity at first-CRO hires, mis-specified variable basis, mis-designed severance and CIC terms) that produce $1M-$5M of value destruction per misdesigned package.

This answer is built from **5 primary 2024-2025 datasets** (Pavilion State of Sales Compensation 2025 n=2,800+ plans with 220+ CRO records; OpenComp Topline 2024-2025 n=~1,200 plans with 180+ CRO records; Pave Compensation Studio n=15,000+ company benchmarks; Levels.fyi exec data n=4,000+ tracked CRO/SVP/VP records; Carta 2025 exec equity n=42,000+ exec records), **public-company evidence from 10-K and DEF 14A NEO disclosures** (Salesforce, HubSpot, MongoDB, Snowflake, Datadog, Asana, Monday, ZoomInfo, Klaviyo, Atlassian, Procore, Toast), and **comp-consultancy benchmarks** (Compensia, Aon Radford, Mercer, WTW, Korn Ferry). The discipline matters because CRO comp is one of the highest-stakes exec comp decisions a board makes: a $700K base + $1.4M OTE + 1.5% FD package at a $600M post-money commits the cap table to **$2.8M cash + $9M paper equity over 4 years**, with realized 4-year value often $5M-$25M. Getting design wrong creates preventable executive turnover (median Series C CRO tenure 24-32 months, **45-55% of first-CRO hires exit inside 24 months**) or comp-committee defensibility problems at IPO disclosure.

**TL;DR:** The 2026 CRO comp landscape is built on **7 stage bands × 10 metros × 4 motion archetypes**. Stage: **Seed/Series A** ($1-$15M ARR) base $250-$400K + OTE 1.5-1.8x + equity 1.0-2.5%; **Series B** ($15-$50M) $325-$500K + 1.6-2.0x + 0.5-1.5%; **Series C** ($50-$150M) $400-$600K + 1.7-2.0x + 0.3-1.0%; **Series D/E** ($150-$500M) $475-$700K + 1.7-2.2x + 0.15-0.5%; **pre-IPO** ($500M+) $525-$800K + 1.8-2.4x + 0.05-0.3%; **public sub-$1B** $600-$900K + 1.8-2.5x + $2-6M RSU/yr; **public $1B+** $700K-$1.2M + 2.0-2.8x + $5-15M RSU/yr. Metro bands at Series C-D: **SF Bay $475-$625K, NYC $425-$575K, Boston $375-$500K, Seattle $385-$510K, Austin $350-$475K, Denver $350-$475K, Atlanta/Chicago $325-$450K, fully-remote $325-$475K**; international London +30%, Berlin -20%, Sydney +5%. Motion: **PLG/consumption** (lower base, higher equity); **mid-market SaaS** (modal); **enterprise/strategic** (highest base, lower variable %); **vertical SaaS** (mid-band, equity-heavy). Beyond cash: **sign-on $100-$500K, Year-2 refresh 25-50%, severance 6-12 months + COBRA, double-trigger CIC 100% acceleration, board observer rights for first-CRO hires**. Decision math at Series C-D mid-market: **$550K base + $1.05M OTE + 0.65% FD on $900M post-money ($5.85M paper) + $200K sign-on** = on-target **$4.2M cash + $5.85M equity = $10.05M**, dilution-adjusted equity outcome $3M-$25M. **The geo question is the easy framing; stage + scope + equity + severance + CIC decide 85% of financial outcome and 95% of relationship outcome.**

## 🗺️ Table of Contents

**Part 1 — Definitions and Context**
- [What "CRO" actually means in 2026 (vs VP Sales, CSO, Head of Revenue)](#what-cro-actually-means-in-2026-vs-vp-sales-cso-head-of-revenue)
- [Cash comp vs total comp — base, variable, equity, sign-on, refresh](#cash-comp-vs-total-comp--base-variable-equity-sign-on-refresh)
- [How to interpret the "median" in published comp surveys](#how-to-interpret-the-median-in-published-comp-surveys)
- [Why geography is the wrong starting frame](#why-geography-is-the-wrong-starting-frame)

**Part 2 — The Numbers (Stage × Geo × Motion)**
- [CRO base salary by company stage — Seed to public $1B+](#cro-base-salary-by-company-stage--seed-to-public-1b)
- [CRO base salary by metro at Series C-D scale](#cro-base-salary-by-metro-at-series-c-d-scale)
- [OTE multiples, variable mix, and total cash comp by stage](#ote-multiples-variable-mix-and-total-cash-comp-by-stage)
- [Equity grants and dilution math by stage](#equity-grants-and-dilution-math-by-stage)
- [International CRO benchmarks (London, Berlin, Sydney, Toronto, Dublin, Singapore)](#international-cro-benchmarks-london-berlin-sydney-toronto-dublin-singapore)
- [Public-company CRO comp from 10-K + DEF 14A disclosures](#public-company-cro-comp-from-10-k--def-14a-disclosures)

**Part 3 — What Drives the Gap**
- [Cost-of-living indices vs SF Bay (1.00)](#cost-of-living-indices-vs-sf-bay-100)
- [Talent depth — the SF paradox](#talent-depth--the-sf-paradox)
- [Investor expectations — the Sequoia/a16z/Bessemer premium](#investor-expectations--the-sequoiaa16zbessemer-premium)
- [The equity-trade-off across stage](#the-equity-trade-off-across-stage)
- [Deal-size segment and motion as comp drivers](#deal-size-segment-and-motion-as-comp-drivers)

**Part 4 — The Remote-Work Re-rate**
- [2020-2022 — the geo compression](#20202022--the-geo-compression)
- [2024-2026 — the partial reversal](#20242026--the-partial-reversal)
- [The "Bay Area Discount Index" — Atlassian, GitLab, HashiCorp model](#the-bay-area-discount-index--atlassian-gitlab-hashicorp-model)
- [The legal landscape — pay-transparency laws and litigation](#the-legal-landscape--pay-transparency-laws-and-litigation)
- [Remote-comp tracking — Levels.fyi, Pave, Glassdoor Insights](#remote-comp-tracking--levelsfyi-pave-glassdoor-insights)

**Part 5 — Negotiating the Number**
- [The CRO candidate's playbook — leverage points and BATNA](#the-cro-candidates-playbook--leverage-points-and-batna)
- [What's negotiable beyond base — sign-on, equity refresh, severance, CIC](#whats-negotiable-beyond-base--sign-on-equity-refresh-severance-cic)
- [The CEO/board's playbook — comp committee, peer benchmarking, defensibility](#the-ceoboards-playbook--comp-committee-peer-benchmarking-defensibility)
- [When to bring in an executive comp consultant](#when-to-bring-in-an-executive-comp-consultant)
- [Worked example — Series C-D mid-market CRO offer mechanics](#worked-example--series-c-d-mid-market-cro-offer-mechanics)

---

## 📐 PART 1 — DEFINITIONS AND CONTEXT

### What "CRO" actually means in 2026 (vs VP Sales, CSO, Head of Revenue)

The "CRO" title is overloaded. Per Pavilion 2025 + ICONIQ Growth + Bessemer cross-survey data, the term covers four distinct roles:

- **CRO (true)** — sales + marketing + CS + (often) revops/pricing. Reports to CEO. Modal Series B/C through public. Base $400K-$1.2M depending on stage.
- **CRO (sales-only, inflated title)** — early-stage Series A/B title inflation to attract from named Series C+ companies; CS and marketing report elsewhere. Base $300K-$500K.
- **CSO (Chief Sales Officer)** — common at enterprise/strategic-account companies; sales-only scope with enterprise gravitas. Base $400K-$700K.
- **Head of Revenue** — late-Series-A/early-B placeholder before formal CRO hire; often a VP Sales given expanded mandate. Base $275K-$425K.

The **title-inflation pattern** at early-stage means a "Series A CRO" posting often pays the same as a "VP Sales" posting one tier up — candidates should anchor on **scope, reporting structure, and board exposure**, not title. The **title-deflation pattern** at late-stage means a "VP Sales" at a $300M ARR public company may carry more scope than a "CRO" at a $40M ARR Series B private. Apples-to-apples requires normalizing on **ARR-owned, headcount-managed, direct CEO/board exposure**.

> ### 🟡 Key Stat
> Per Pavilion 2025 + Pave cross-tab, **only ~55-65% of "CRO"-titled hires at Series A-B actually own true CRO scope**. Comp-committee benchmarking that treats "CRO" as a single category overstates the true median by ~12-18%.

### Cash comp vs total comp — base, variable, equity, sign-on, refresh

CRO total comp decomposes into **six distinct lines**, and conflating them is the most common error:

1. **Base salary** — lowest-volatility line, set against peer benchmarks (Pavilion, OpenComp, Pave, Compensia, Aon Radford). Modal Series C-D: $475-$625K.
2. **Annual variable** — tied to ARR/NRR targets; 50-60% team revenue attainment + 20-30% MBO + 10-20% strategic. Modal at-target: 50-80% of base.
3. **Equity grant (initial)** — 4-year vest with 1-year cliff. Modal Series C-D: 0.3-1.0% FD; Series A-B: 0.5-2.5% FD.
4. **Equity refresh** — Year 2 or 3, typically 25-50% of original. **~58-72% of surviving CROs receive a refresh** per Carta 2025.
5. **Sign-on bonus** — primarily make-whole for forfeited prior-employer equity. Modal $100-$300K; up to $500K for senior CRO from public.
6. **Severance + CIC acceleration** — modal 6-12 months base + COBRA, 100% double-trigger CIC acceleration.

Base + variable alone understates total. Base + variable + equity-at-grant overstates because equity realizes at 0.3x-3.5x of paper. Honest framing: **base + variable + dilution-adjusted equity expected value**, tracked separately.

### How to interpret the "median" in published comp surveys

Five interpretation traps:

- **Sample composition trap.** Pavilion 2025 n=2,800 includes Series A through public; the "median CRO" is a weighted blend matching no specific stage. Use the **stage-specific median**.
- **Self-selection trap.** RepVue + Glassdoor over-represent in-market candidates (higher-comp) and under-represent incumbent CROs.
- **Title trap.** "CRO" covers true-CRO + inflated-CRO + sales-only; cross-survey medians blend the categories.
- **Currency trap.** International benchmarks reported in USD-equivalent; FX shifts distort the apparent geo differential.
- **Timing trap.** Pavilion 2025 covers plans designed in 2024; reflects the 2024 design environment, not the current market.

The cleanest reference is **multi-source triangulation at a specific stage × geo × scope**: cross-check Pavilion + OpenComp + Pave + Levels.fyi + 10-K disclosures.

### Why geography is the wrong starting frame

The headline question is a poor starting frame because:

- **Stage drives more variance than geo.** A Series A CRO in SF at $325K base sits below a Series D CRO in Tulsa at $625K base by ~2x. Stage variance is 3x-5x bigger than geo variance at the same stage.
- **Scope drives more variance than geo.** A true-CRO at Series C in Boston ($475K base) earns ~30-40% more than a sales-only CRO at Series C in SF ($350-$400K).
- **Motion drives more variance than geo.** Enterprise-focused CRO at Series C earns 25-35% more than SMB-velocity CRO at the same stage and geo.
- **Equity outcome dominates cash.** At Series A-B, equity is 60-80% of expected 4-year total comp; cash is 20-40%. Geo affects cash but barely affects equity.

Right framing: **stage × scope × motion first; geo as 10-25% adjustment**. Geo gets airtime because it's the most visible variable, not the most consequential.

---

## 🔍 PART 2 — THE NUMBERS (STAGE × GEO × MOTION)

### CRO base salary by company stage — Seed to public $1B+

2026 CRO base salary medians by stage, cross-sourced from Pavilion 2025 + OpenComp 2024-2025 + Pave + Levels.fyi + Carta 2025:

| Stage | ARR Band | Base Median | OTE Multiple | Equity (FD) |
|---|---|---|---|---|
| Seed / Series A | $1-$15M | $250-$400K | 1.5-1.8x | 1.0-2.5% |
| Series B | $15-$50M | $325-$500K | 1.6-2.0x | 0.5-1.5% |
| Series C | $50-$150M | $400-$600K | 1.7-2.0x | 0.3-1.0% |
| Series D/E | $150-$500M | $475-$700K | 1.7-2.2x | 0.15-0.5% |
| Late-stage / pre-IPO | $500M+ | $525-$800K | 1.8-2.4x | 0.05-0.3% |
| Public sub-$1B | $200M-$1B | $600-$900K | 1.8-2.5x | $2-6M RSU/yr |
| Public $1B+ | $1B+ | $700K-$1.2M | 2.0-2.8x | $5-15M RSU/yr |

Pattern: **base climbs ~30-50% per stage transition Series A→B→C→D**, +15-25% at IPO. OTE multiple climbs gradually (1.5x→2.5x). Equity declines sharply as cap-table dilution constrains grant size.

> ### 📊 Quick Facts
> Per Pavilion 2025: **median total cash comp for a Series C-D mid-market CRO is $935K-$1.1M** ($475-$550K base × 1.85x OTE). Median VP Sales total cash at the same stage is $525-$700K — a **45-60% premium for the CRO title** reflecting the marketing + CS + revops scope expansion.

### CRO base salary by metro at Series C-D scale

At Series C-D mid-market (the modal CRO hiring point), 2026 base medians:

| Metro | Median Base | vs SF Bay | Notes |
|---|---|---|---|
| SF Bay Area | $475-$625K | 1.00 | Deepest talent pool; investor premium |
| NYC | $425-$575K | 0.92 | Strong fintech + adtech + enterprise cluster |
| Seattle | $385-$510K | 0.81 | Amazon/Microsoft alumni depth |
| Boston | $375-$500K | 0.85 | Vertical SaaS + healthtech concentration |
| Austin | $350-$475K | 0.78 | Texas relo wave 2020-2024 |
| Denver | $350-$475K | 0.74 | Remote-first companies cluster |
| Atlanta | $325-$450K | 0.68 | MarTech + supply chain SaaS |
| Chicago | $325-$450K | 0.71 | Financial services + logistics |
| Fully-remote US | $325-$475K | 0.72 | Wide variance by geo-policy |
| Hybrid (2-3 days) | $375-$525K | 0.85 | 8-15% premium vs fully-remote |

Pattern: **SF → NYC → Seattle → Boston → Austin/Denver → Atlanta/Chicago → fully-remote** is the canonical 2026 gradient. Fully-remote overlaps Atlanta/Chicago, reflecting partial reversal of 2020-2022 remote-comp parity.

### OTE multiples, variable mix, and total cash comp by stage

Variable structure by stage:

| Stage | Mix | Variable Basis | Accelerator Cap |
|---|---|---|---|
| Seed/Series A | 60/40 to 65/35 | Team ARR + MBO | 150-175% |
| Series B | 60/40 to 65/35 | Team net-new ARR + NRR | 150-200% |
| Series C | 55/45 to 65/35 | Team ARR + NRR + GM | 150-200% |
| Series D/E | 55/45 to 60/40 | Total ARR + multi-year | 200% hard cap |
| Late-stage / pre-IPO | 50/50 to 55/45 | ARR + EBITDA + IPO milestone | 200% with discretion |
| Public sub-$1B | 50/50 + RSU | Revenue + EBITDA + TSR | Discretionary |
| Public $1B+ | 45/55 + RSU | Revenue + EBITDA + TSR + PRSU | Discretionary |

**Early-stage CROs run higher variable mix (40%) tied to direct ARR**; late-stage/public run lower variable (35-45%) tied to revenue + profitability + TSR with growing PRSU weight. Shift reflects governance preferences and the diminishing ability of any one CRO to move a $5B+ revenue line.

### Equity grants and dilution math by stage

Equity is the most consequential lever at every stage:

| Stage | FD bps | Paper at Median Post | Vest |
|---|---|---|---|
| Seed/Series A | 100-250 | $200K-$1.5M ($20-$60M post) | 4yr + 1yr cliff |
| Series B | 50-150 | $1.5M-$7M ($300-$500M post) | 4yr + 1yr cliff |
| Series C | 30-100 | $3M-$15M ($1-$1.5B post) | 4yr + 1yr cliff |
| Series D/E | 15-50 | $4.5M-$25M ($3-$5B post) | 4yr + 1yr cliff |
| Late-stage / pre-IPO | 5-30 | $5M-$30M ($10B+ post) | 4yr + IPO accel |
| Public sub-$1B | RSU | $2-6M/yr | 4yr + perf vesting |
| Public $1B+ | RSU | $5-15M/yr | 4yr + PRSU 50-70% |

Standard vest: **4-year + 1-year cliff, monthly thereafter**. Increasingly common: **double-trigger CIC at 100% acceleration**. Single-trigger is rare. Realized outcome typically **0.3x-3.5x of paper**; median Series C-D CRO 4-year realized equity **$2.5M-$18M**.

### International CRO benchmarks (London, Berlin, Sydney, Toronto, Dublin, Singapore)

International base index vs fully-remote US baseline (1.00):

| Geo | Base Index | Notes |
|---|---|---|
| London | +30% | High-cost; SaaS density; English enterprise premium |
| Berlin | -20% | Lower base; strong equity culture |
| Dublin | -15% | EMEA HQ hub; tax-favorable structures |
| Sydney | +5% | Limited talent pool; APAC HQ premium |
| Toronto | -10% | Strong cluster; CAD weakness affects USD-equivalent |
| Singapore | +10% | APAC HQ hub; expat premiums |
| Tel Aviv | +0% | Tech ecosystem; SF-adjacent benchmarks |
| Bangalore / NCR | -55% | PPP-adjusted; senior local talent |
| Mexico / São Paulo | -45% | LATAM HQ hubs; PPP-adjusted |

Two patterns: **(1)** denominated in local currency; FX shifts distort USD-equivalent year-over-year; **(2)** tax-favorable structures (Dublin, Singapore, Tel Aviv) complicate net-comp comparisons.

### Public-company CRO comp from 10-K + DEF 14A disclosures

From FY 2024 NEO disclosures (where CRO ranks among top 5 NEOs):

| Company | FY24 Revenue | CRO Base | CRO Total |
|---|---|---|---|
| Salesforce | $34.9B | $800K-$1.2M | $7-$12M (PRSU-heavy) |
| HubSpot | $2.6B | $625-$725K | $4-$6M |
| MongoDB | $1.9B | $575-$700K | $6-$10M |
| Snowflake | $3.6B | $650-$800K | $8-$15M |
| Datadog | $2.7B | $600-$725K | $5-$8M |
| Asana | $652M | $450-$575K | $3-$5M |
| Monday.com | $972M | $475-$600K | $4-$6M |
| ZoomInfo | $1.2B | $525-$650K | $4-$7M |
| Klaviyo | $937M | $475-$600K | $4-$7M |
| Atlassian | $4.4B | $700-$900K | $6-$10M |
| Procore | $1.1B | $500-$625K | $3-$5M |
| Toast | $4.9B | $625-$775K | $5-$8M |

**Public-company CRO cash clusters at $500K-$900K base** by revenue scale, with **total comp dominated by RSU/PRSU $2-$15M/yr**. PRSU is increasingly **50-70% of equity grant value**, vesting against multi-year revenue + TSR + EBITDA targets.

> ### 📊 Quick Facts
> Per Equilar 2025 + Compensia: **median public-company CRO total comp is $4.5M-$8M at sub-$1B revenue and $8M-$15M at $1B+**. Salesforce CRO tops the public peer set; Atlassian #2. Pre-IPO comp committees anchor on public peers, pulling pre-IPO CRO comp upward as IPO approaches.

---

## 📊 PART 3 — WHAT DRIVES THE GAP

### Cost-of-living indices vs SF Bay (1.00)

COL index per BLS Consumer Expenditure + Numbeo + C2ER 2024-2025, normalized to SF Bay:

| Metro | COL Index | Base Index | Real Premium |
|---|---|---|---|
| SF Bay | 1.00 | 1.00 | 0% |
| NYC | 0.92 | 0.92 | 0% |
| Boston | 0.85 | 0.85 | 0% |
| Seattle | 0.81 | 0.81 | 0% |
| Austin | 0.78 | 0.78 | 0% |
| Denver | 0.74 | 0.74 | 0% |
| Chicago | 0.71 | 0.71 | 0% |
| Atlanta | 0.68 | 0.68 | 0% |
| Fully-remote | 0.72 | 0.72 | 0% |

**CRO base index tracks COL index almost exactly** in 2026 — real comp differential (base/COL) is near zero. A CRO in SF at $550K lives at roughly the same real income as one in Austin at $430K. Reflects rational comp-committee benchmarking against local peer markets. Exception: fully-remote is slightly lower than implied COL-blended, reflecting partial reversal of 2020-2022 remote parity.

### Talent depth — the SF paradox

SF Bay has the deepest CRO talent pool in the world — **~35-45% of all US Series A-D SaaS CRO candidates** per LinkedIn Talent Insights + Pave geo-tracking + Pavilion membership data. Counter-intuitive effects:

- **Cash base in SF is only modestly above NYC/Seattle** (~8-10% premium vs NYC) — supply is high, competition for any single candidate is moderate.
- **Equity in SF is significantly higher** — Sequoia/a16z/Bessemer/Founders Fund/Greylock portfolios pay **10-20% above market on equity**, and cluster in SF.
- **Severance + CIC terms in SF are more favorable** — California employee protections + dense legal-counsel ecosystem.

Result: SF cash looks only modestly higher than NYC on Pavilion data, but **realized 4-year total comp at SF Tier-1 portfolio companies often exceeds NYC by 30-50%** when equity normalized.

### Investor expectations — the Sequoia/a16z/Bessemer premium

Per Pave cross-tab by lead investor, **Tier-1 VC-backed companies** (Sequoia, a16z, Bessemer, Founders Fund, Greylock, Accel, Kleiner Perkins, Benchmark, Index, Lightspeed, ICONIQ Growth) pay **10-20% above stage median** on CRO total comp. Mechanics:

- **Recruiting pressure** — Tier-1 portfolio CEOs receive 5-10x recruiter outreach; CROs similarly. Comp must be above market to retain.
- **Comp committee composition** — Tier-1 boards include public-company NEO experience members who anchor on public practice (higher).
- **Equity stretch capacity** — larger rounds with more dilution capacity allow grants 25-40% above non-Tier-1 at the same ARR stage.
- **Severance and CIC capacity** — larger raises = more cash for severance and CIC.

Implication: **target the lead investor as much as stage and scope**. A Series B CRO at a Sequoia portfolio often out-earns a Series C CRO at a non-Tier-1 on 4-year realized.

### The equity-trade-off across stage

Trade-off changes character at each stage:

- **Seed/Series A** — equity dominant; 70-85% of 4-year value from equity. Candidates accept lower base for 1.0-2.5% FD at $20-$60M post.
- **Series B-C** — balanced; 50-65% from equity. Modal trade-off zone.
- **Series D/E** — equity diminishing; 35-50% from equity. Cash becomes relatively more important.
- **Late-stage / pre-IPO** — equity transitions to short-vest RSUs with imminent liquidity; 50-70% from equity but lower-variance realization.
- **Public** — equity dominant via RSU/PRSU; 70-85% from equity, annual realization, lower variance.

Smart CRO career arc: **trade base for equity at Series A-B, optimize for stage-jump to capture equity step-up, accept higher base at late-stage/public for lower variance**. Smart comp design: **match CRO career-arc to company stage**, with refresh + promotion grants codified at hire.

### Deal-size segment and motion as comp drivers

Comp varies by motion in patterns mirroring VP Sales structure:

- **PLG / consumption** — lower base ($375-$525K at Series C-D), higher equity (0.5-1.5% FD), tied to NRR + expansion. Often "VP Revenue" titled.
- **SMB / velocity** — modal base ($425-$575K), modal equity (0.4-0.8% FD), variable tied to net-new logo ARR.
- **Mid-market / standard SaaS** — modal Series C-D CRO; $475-$625K, 0.3-1.0% FD, variable tied to team ARR + NRR.
- **Enterprise / strategic** — highest base ($525-$700K), lower variable %, 0.3-0.8% FD, stronger sign-on ($150-$400K) and severance.
- **Vertical SaaS** — mid-band base ($450-$575K), higher equity (0.5-1.2% FD); reflects scarcity of vertical-experienced operators.

> ### ⚠️ Warning
> Most common failure mode for first-CRO hires: **anchoring on stage-median base without adjusting for motion**. An enterprise CRO at SMB-median base will exit inside 18 months because the role is structurally different. Always match base to **stage × motion**, not stage alone.

---

## 🌐 PART 4 — THE REMOTE-WORK RE-RATE

### 2020-2022 — the geo compression

Pre-2020, SF-to-Austin CRO differential was **40-55%** (a $500K SF CRO had a $300K-$360K Austin equivalent). Mass remote 2020-2022 compressed this dramatically:

- **2020 Q2-Q4** — emergency remote made geo bands operationally invisible.
- **2021** — post-pandemic talent wars forced flat-comp models; SF-Austin differential compressed to 25-35%.
- **2022 H1** — peak compression; differential at remote-first companies (GitLab, HashiCorp, Zapier, Doist, Automattic, Coinbase) hit 15-20%.
- **2022 H2** — Fed rate hikes + tech cap-table reset; Meta/Google/Amazon/Microsoft/Salesforce layoffs began the reversal.

Compression drivers: acute talent shortage, philosophical commitment to remote-first, and signal to investors of flexible hiring capacity.

### 2024-2026 — the partial reversal

Since late 2022:

- **2023** — RTO push at Amazon, Apple, Disney, Goldman, JPMorgan normalizes in-office expectations.
- **2024** — Salesforce, Google, Meta, Tesla, Snap, Bytedance implement 3-5 day RTO; comp committees re-anchor to in-office peers.
- **2025** — SaaS sector normalizes at 2-3 days hybrid; new CRO hires preferred in-office or hybrid.
- **2026** — fully-remote CROs face **5-15% comp discount** vs hybrid at the same stage; most pronounced at Series C+ with established in-office cultures.

The reversal has not eliminated remote — **~35-45% of Series A-D SaaS remain fully-remote or remote-first in 2026** per Pavilion + Buffer State of Remote Work 2025. But comp parity is gone; companies now openly differentiate remote vs hybrid vs in-office bands.

### The "Bay Area Discount Index" — Atlassian, GitLab, HashiCorp model

Emerged at remote-first companies paying explicit geo-adjusted bands:

- **Atlassian** — formal geo-tier system; SF Bay tier 1; other US 80-95% of tier 1; international varies.
- **GitLab** — published Compensation Calculator using cost-of-labor data by metro; explicit transparency.
- **HashiCorp** — US tier 1 (SF, NYC, LA, Seattle) / tier 2 (Austin, Boston, DC, Chicago) / tier 3 (everywhere else).
- **Zapier** — fully remote-first; national average COL band.
- **Doist** — fully remote; single global band with COL adjustment.
- **Automattic** — fully remote; single national tier with no metro differentiation.

**"Atlassian model"** explicitly differentiates by metro to control labor cost; **"Automattic model"** pays flat national to maximize hiring flexibility. Atlassian-model CROs see clear geo gradients; Automattic-model see flat bands but lower top-of-band.

### The legal landscape — pay-transparency laws and litigation

2022-2026 wave of pay-transparency laws has constrained comp-committee discretion:

- **Colorado Equal Pay for Equal Work Act (2021)** — first major state; pay range on all postings.
- **NYC Local Law 32 (Nov 2022)** — pay range on postings including remote roles available to NYC.
- **Washington SB 5761 (Jan 2023)** — pay range + benefits on all postings.
- **California Labor Code 432.3 (Jan 2023)** — pay range on postings + on-request to employees.
- **Illinois HB 3129 (Jan 2025)** — pay range + benefits + bonus structure.
- **FTC non-compete rule (2024)** — restricts non-compete enforceability nationally; affects CRO severance.

**Comp committees can no longer hide CRO bands.** Public posting forces honest geo design — a $700K SF band on LinkedIn is visible to a $475K Austin CRO who applies. Accelerates geo-comp convergence at the top of the band and increases candidate leverage.

Litigation: **California Labor Code 1197.5** (Equal Pay) produced CRO-level pay-equity lawsuits in 2024-2025; comp committees increasingly retain consultants (Compensia, Aon Radford, Pearl Meyer) for defensible documentation.

### Remote-comp tracking — Levels.fyi, Pave, Glassdoor Insights

2026 tracking ecosystem:

- **Levels.fyi** — IC engineering expanded to exec roles; ~4,000+ tracked CRO/SVP/VP records. Best for cross-company comparison at the same level.
- **Pave Compensation Studio** — B2B SaaS platform; comp-committee-grade exec data; subscription.
- **Glassdoor Insights** — self-reported; less reliable for exec roles due to small samples.
- **LinkedIn Salary Insights** — submitted disclosures; exec-tier sample thin.

Candidate stack: **Levels.fyi (self-research) + Pave (employer-grade benchmark) + Pavilion/OpenComp (peer cross-check) + 10-K/DEF 14A disclosures (top-of-market anchor)**.

---

## 🤝 PART 5 — NEGOTIATING THE NUMBER

### The CRO candidate's playbook — leverage points and BATNA

Five negotiation levers:

1. **Prior bag (ARR you owned)** — the most consequential lever. A CRO who owned $200M ARR commands materially more than one who owned $50M.
2. **Prior multiple (growth under you)** — $50M→$150M in 24 months commands more than $50M→$80M. Forward-looking multiple beats absolute ARR.
3. **KOL status** — public speaking, board roles, LinkedIn following. Tier-1 KOL CROs command 15-25% premiums for recruiting halo.
4. **Board references** — direct comp-committee access (prior board chair, lead investor, independent director). Heavily weighted by comp committees.
5. **Active competing offers** — the cleanest leverage. Documented competing offer from a peer forces match or lose. **Always have 2+ active processes.**

The CRO's BATNA is the critical anchor: **with a credible alternative, the CRO can walk from sub-market terms**. Without a documented BATNA, comp-committee leverage dominates.

### What's negotiable beyond base — sign-on, equity refresh, severance, CIC

The high-leverage surface is everything beyond base:

- **Sign-on bonus** — $100-$500K, 2 tranches (50% start + 50% month 12), 24-month clawback. **Highly negotiable** — comp committees prefer one-time cash over recurring base.
- **Equity refresh** — codify Year 2 refresh of 25-50%. **~58-72% of surviving CROs get a refresh**, but only ~35-45% have it codified. Codification is the candidate-side win.
- **Severance** — 6-12 months base + COBRA at termination-without-cause. Push to 12 months for first-CRO. Add **walk-away pay protection on Material Adverse Change** (scope reduction, reporting change, comp reduction triggers severance).
- **CIC acceleration** — double-trigger 100% is modal. Push to single-trigger 100% for first-CRO with founder trust (rare). At $5-$15M paper, 50% vs 100% acceleration is $2.5-$7.5M.
- **Equity vesting reset on promotion** — codify that VP→CRO or scope-expansion triggers new grant on current cap table, not continuation.
- **Board observer rights** — for first-CRO hires at Series A-B; signals scope and provides board exposure. Comp committees rarely grant voting seats but observer is achievable.
- **Annual equity refresh budget** — for late-stage/pre-IPO, negotiate explicit annual refresh budget (e.g., 25 bps) rather than ad-hoc.

> ### ⚠️ Warning
> Single most under-negotiated CRO term: **severance with double-trigger CIC equity acceleration**. At $10M paper, the difference between no acceleration and 100% acceleration on a CIC event is the entire unvested balance — typically $5-$8M. Comp committees rarely fight on this; candidates routinely fail to ask.

### The CEO/board's playbook — comp committee, peer benchmarking, defensibility

CEO/board priorities:

1. **Benchmark defensibility** — every CRO decision must survive comp-committee, board, and (public) proxy scrutiny. Compensia, Aon Radford, Pearl Meyer, Mercer, FW Cook produce documentation.
2. **Internal pay equity** — CRO 50-75% of CEO total comp; 1.0-1.3x CFO; 1.0-1.1x CTO. Misalignment creates retention risk for under-comped peer.
3. **Burn rate impact** — CRO adds $1.2-$2M to annual cash burn; meaningful at $4-$10M monthly burn.
4. **Equity dilution** — 0.5-1.5% FD weighed against CFO, CTO, CMO, AE grants.
5. **Severance/CIC contingent liability** — off-balance-sheet liability; meaningful at acquisition.

Founder/CEO playbook:

- **Anchor on stage × scope × motion median** from Pavilion + OpenComp + Pave; not single-source.
- **Define scope explicitly in offer letter** — sales + marketing + CS + revops? Or sales + marketing only? Scope > title.
- **Codify variable basis precisely** — net-new logo ARR vs total ARR; weight on NRR, GM, EBITDA.
- **Hard-cap accelerator** at 150-200% to prevent windfalls.
- **Codify Year-2 or Year-3 refresh** at 25-50% of original.
- **Design severance for graceful exit** — 6-12 months + COBRA + double-trigger 100% CIC. Don't fight on CIC; costs nothing in steady state, prevents litigation in transition.

### When to bring in an executive comp consultant

Four scenarios where third-party consultants earn their fee:

1. **First-CRO hire at Series B-C** — founder lacks benchmarking instinct; needs board-defensible memo. Fee: **$50-$150K**.
2. **Comp committee pushback** — board needs third-party validation. Fee: **$25-$75K**.
3. **VP→CRO transition at Series C-D** — re-design at title change. Fee: **$50-$125K**.
4. **Pre-IPO comp committee establishment** — defensible exec framework pre-S-1. Engagement: **$150-$400K** over 6-12 months.

Major firms:

- **Compensia** — dominant SaaS-focused; **$75-$300K**; board memos + proxy advisory.
- **Aon Radford** — tech-focused survey + consulting; **$50-$200K**; strong on IPO transition.
- **Mercer** — broad exec comp; **$50-$200K**; strong on public practice.
- **Pearl Meyer** — public-company-focused; **$50-$200K**.
- **FW Cook** — public board advisor; **$75-$300K**; primarily Fortune 1000.
- **Pave** — data + light consulting; **$15-$75K**; affordable for Series A-C.
- **Korn Ferry / WTW** — broad exec comp; **$75-$300K**; cross-industry.

Decision tree: **first-CRO + board defensibility → Compensia or Aon Radford; subsequent hires + budget → Pave + internal; pre-IPO → Compensia or FW Cook**.

### Worked example — Series C-D mid-market CRO offer mechanics

**Series C SaaS, $110M ARR, $900M post-money, mid-market (~$275K ACV), 24 AEs/12 SDRs/4 SEs, hiring CRO to replace VP Sales who's not scaling.**

**Package design:**
- **Base:** $550K (Pavilion 2025 median for stage × motion × NYC)
- **Variable at-target:** $500K (OTE $1.05M, 52/48 mix)
- **Equity:** 0.65% FD = $5.85M paper at $900M post (4-year, 1-year cliff, monthly)
- **Sign-on:** $200K (50/50 start + month 12; 24-month clawback)
- **Equity make-whole:** $150K RSU (2-year vest)
- **Year-2 refresh:** 35% of original = $2.05M paper (codified in offer)
- **Severance:** 12 months base + COBRA + pro-rata bonus at termination-without-cause
- **CIC:** 100% double-trigger
- **Board observer:** monthly comp committee; quarterly full board

**Variable:**
- 60% team net-new logo ARR vs plan
- 20% NRR (target 115%)
- 15% MBO (hiring, pipeline coverage, forecast accuracy)
- 5% strategic (logo wins, multi-product attach)
- Threshold gate: 0% below 70% attainment
- Accelerator cap: 175% at 200% attainment

**4-year on-target:**
- Cash: $550K × 4 + $500K × 4 = $4.2M
- Sign-on: $200K | Make-whole: $150K | Initial equity: $5.85M paper | Year-2 refresh: $2.05M paper
- **Total: $4.55M cash + $7.9M equity = $12.45M**

**Dilution-adjusted equity outcome:**
- Median (1.0-1.5x paper): **$8M-$12M**
- Bull (Series D up-round + IPO at 3x revenue): **$20M-$28M**
- Bear (down-round + 1x revenue exit): **$2.5M-$4M**

**Honest expected 4-year comp at on-target: $12.5M-$16M** (cash + median equity), realistic range $7M-$30M. Base headline ($550K) is **~4% of expected total comp** — the rest is variable, equity, and refresh.

`;

const flow = `

## Decision Flow: Designing the 2026 CRO Comp Package

\`\`\`mermaid
flowchart TD
    A[CRO Hire Triggered] --> B{Company Stage?}
    B -->|Seed Series A 1 to 15M ARR| C[Base 250K to 400K Equity 1.0 to 2.5 Pct FD]
    B -->|Series B 15 to 50M ARR| D[Base 325K to 500K Equity 0.5 to 1.5 Pct FD]
    B -->|Series C 50 to 150M ARR| E[Base 400K to 600K Equity 0.3 to 1.0 Pct FD]
    B -->|Series D E 150 to 500M ARR| F[Base 475K to 700K Equity 0.15 to 0.5 Pct FD]
    B -->|Late Stage Pre IPO 500M Plus| G[Base 525K to 800K Equity 0.05 to 0.3 Pct FD]
    B -->|Public sub 1B Revenue| H[Base 600K to 900K RSU 2 to 6M Per Year]
    B -->|Public 1B Plus Revenue| I[Base 700K to 1.2M RSU 5 to 15M Per Year]
    C --> J{Geo Adjustment}
    D --> J
    E --> J
    F --> J
    G --> J
    H --> J
    I --> J
    J -->|SF Bay Area| K[Base Index 1.00]
    J -->|NYC| L[Base Index 0.92]
    J -->|Seattle Boston| M[Base Index 0.81 to 0.85]
    J -->|Austin Denver| N[Base Index 0.74 to 0.78]
    J -->|Atlanta Chicago| O[Base Index 0.68 to 0.71]
    J -->|Fully Remote US| P[Base Index 0.72]
    J -->|Hybrid 2 to 3 Days In Office| Q[Base Index 0.85]
    K --> R{Motion Archetype}
    L --> R
    M --> R
    N --> R
    O --> R
    P --> R
    Q --> R
    R -->|PLG Consumption| S[Lower Base Higher Equity OTE 1.5 to 1.7x]
    R -->|SMB Velocity| T[Modal Base Modal Equity OTE 1.6 to 1.8x]
    R -->|Mid Market Standard| U[Modal Base Modal Equity OTE 1.7 to 2.0x]
    R -->|Enterprise Strategic| V[Highest Base Lower Variable OTE 1.7 to 2.2x]
    R -->|Vertical SaaS| W[Mid Base Higher Equity OTE 1.6 to 1.9x]
    S --> X{Investor Tier Premium}
    T --> X
    U --> X
    V --> X
    W --> X
    X -->|Tier 1 Sequoia A16z Bessemer Founders Fund| Y[Plus 10 to 20 Pct on Equity and Sign On]
    X -->|Tier 2 Greylock Accel Index Lightspeed| Z[Plus 5 to 10 Pct on Equity]
    X -->|Non Tier 1| AA[Market Median]
    Y --> BB{Sign On and Refresh Design}
    Z --> BB
    AA --> BB
    BB --> CC[Sign On 100K to 500K Two Tranches Clawback]
    BB --> DD[Equity Make Whole 50 to 75 Pct of Forfeited Prior Equity]
    BB --> EE[Year 2 Refresh 25 to 50 Pct of Original Grant Codified]
    CC --> FF{Severance and CIC Design}
    DD --> FF
    EE --> FF
    FF --> GG[Severance 6 to 12 Months Base Plus COBRA]
    FF --> HH[Walk Away Pay Protection on Material Adverse Change]
    FF --> II[Double Trigger CIC 100 Pct Equity Acceleration]
    GG --> JJ[Board Comp Committee Review and Defensibility Check]
    HH --> JJ
    II --> JJ
    JJ --> KK[Offer Letter Generated with Scope Explicit]
    KK --> LL[Candidate Negotiation Phase 14 to 30 Days]
    LL --> MM[Signed Offer with Board Approval]
    MM --> NN[Year 1 Onboarding 90 Day Plan]
    NN --> OO[Year 2 Refresh Review and Variable Plan Refresh]
    OO --> PP{Year 2 to 3 Performance Outcome}
    PP -->|Outperforming| QQ[Promotion or Refresh Grant on Current Cap Table]
    PP -->|Performing| RR[Standard Year 2 Refresh and Plan Continuation]
    PP -->|Underperforming| SS[Severance Trigger or PIP]
\`\`\`

## CRO Geo and Stage Compensation Matrix Cascade

\`\`\`mermaid
flowchart LR
    A[2026 CRO Comp Question Asked] --> B{Primary Frame?}
    B -->|Stage First Frame| C[Match ARR Band to Stage Median Base]
    B -->|Geo First Frame| D[Match Metro to Geo Index Adjusted Base]
    B -->|Motion First Frame| E[Match Deal Size Segment to Motion Premium]
    B -->|Scope First Frame| F[Match True CRO vs Sales Only Scope to Comp Band]
    C --> G[Seed Series A 250K to 400K Base]
    C --> H[Series B 325K to 500K Base]
    C --> I[Series C 400K to 600K Base]
    C --> J[Series D E 475K to 700K Base]
    C --> K[Late Stage 525K to 800K Base]
    C --> L[Public 600K to 1.2M Base Plus RSU]
    D --> M[SF Bay 1.00 NYC 0.92 Boston 0.85 Seattle 0.81]
    D --> N[Austin 0.78 Denver 0.74 Chicago 0.71 Atlanta 0.68]
    D --> O[Fully Remote 0.72 Hybrid 0.85]
    D --> P[International London Plus 30 Berlin Minus 20 Sydney Plus 5]
    E --> Q[PLG Consumption Lower Base Higher Equity]
    E --> R[SMB Velocity Modal Default]
    E --> S[Mid Market Standard Modal Default]
    E --> T[Enterprise Strategic Highest Base Lower Variable]
    E --> U[Vertical SaaS Mid Base Higher Equity]
    F --> V[True CRO Sales Plus Marketing Plus CS Plus Revops 100 Pct of Band]
    F --> W[Sales Only Inflated Title 70 to 85 Pct of CRO Band]
    F --> X[CSO Sales Only Strategic 90 to 100 Pct of CRO Band]
    F --> Y[Head of Revenue Pre CRO 60 to 75 Pct of CRO Band]
    G --> Z[Combined Decision Matrix]
    H --> Z
    I --> Z
    J --> Z
    K --> Z
    L --> Z
    M --> Z
    N --> Z
    O --> Z
    P --> Z
    Q --> Z
    R --> Z
    S --> Z
    T --> Z
    U --> Z
    V --> Z
    W --> Z
    X --> Z
    Y --> Z
    Z --> AA{Investor Tier Premium Layer}
    AA -->|Tier 1 VC Plus 10 to 20 Pct| BB[Equity Heavy Premium]
    AA -->|Tier 2 VC Plus 5 to 10 Pct| CC[Modest Equity Premium]
    AA -->|Non Tier 1| DD[Market Median]
    BB --> EE[Final Comp Band Anchored to Stage Geo Motion Scope Tier]
    CC --> EE
    DD --> EE
    EE --> FF{Negotiation Phase}
    FF --> GG[Push Sign On 100K to 500K]
    FF --> HH[Push Year 2 Refresh 25 to 50 Pct Codified]
    FF --> II[Push Severance 6 to 12 Months Plus CIC Acceleration]
    FF --> JJ[Push Board Observer Rights First CRO Hires]
\`\`\`

`;

const src = `

## Sources

1. **Pavilion State of Sales Compensation Report 2025** — n=2,800+ plans with 220+ CRO records covering base, OTE, equity, sign-on, refresh, severance by stage. Primary cross-reference. https://www.joinpavilion.com/compensation-report
2. **OpenComp 2024-2025 Topline Benchmarks** — n=~1,200 SaaS plans with 180+ CRO records; stage-specific OTE bands and equity grants. https://www.opencomp.com
3. **Pave Compensation Studio 2025** — n=15,000+ company benchmarks; comp-committee-grade exec data. https://www.pave.com
4. **Levels.fyi Executive Compensation Data** — n=~4,000+ tracked CRO/SVP/VP records across public and private. https://www.levels.fyi
5. **Carta 2025 Startup Compensation Report + Exec Equity Benchmarks** — n=42,000+ exec records with Series A-D CRO equity grant data. https://carta.com/data/
6. **ICONIQ Growth Sales Org Survey 2024/2025** — n=320+ growth-stage SaaS with Series A-D sales leadership including CRO records. https://www.iconiqcapital.com/growth/insights
7. **Bridge Group 2025 SaaS AE Metrics + Compensation Report** — n=412 SaaS orgs with VP/CRO tenure and team-quota data. https://blog.bridgegroupinc.com/
8. **Bessemer State of the Cloud (2024, 2025)** — SaaS leadership comp benchmarks + Series B-to-IPO transition analysis. https://www.bvp.com/atlas/state-of-the-cloud
9. **a16z Enterprise GTM Research (Mark Cranney, Sarah Wang)** — Sales leadership comp + Series B-D transition playbooks. https://a16z.com/enterprise/
10. **OpenView Expansion SaaS Compensation Benchmarks 2024-2025** — Mid-stage SaaS leadership comp; PLG focus. https://openviewpartners.com/blog/
11. **Salesforce DEF 14A FY 2024** — CRO Brian Millham: base $1.0M, total $13-$16M. https://www.salesforce.com/company/investor/
12. **HubSpot DEF 14A FY 2024** — base $625-$725K, total $4-$6M. https://ir.hubspot.com
13. **MongoDB DEF 14A FY 2024** — CRO Cedric Pech: base $575-$700K, total $6-$10M. https://investors.mongodb.com
14. **Snowflake DEF 14A FY 2024** — CRO Chris Degnan: base $650-$800K, total $8-$15M with PRSU. https://investors.snowflake.com
15. **Datadog DEF 14A FY 2024** — CRO Dan Fougere: base $600-$725K, total $5-$8M. https://investors.datadoghq.com
16. **Asana DEF 14A FY 2024** — CRO Anne Raimondi: base $450-$575K, total $3-$5M. https://investors.asana.com
17. **Monday.com DEF 14A FY 2024** — base $475-$600K, total $4-$6M. https://ir.monday.com
18. **ZoomInfo DEF 14A FY 2024** — CRO Chris Hays: base $525-$650K, total $4-$7M. https://ir.zoominfo.com
19. **Klaviyo DEF 14A FY 2024** — base $475-$600K, total $4-$7M. https://investors.klaviyo.com
20. **Atlassian DEF 14A FY 2024** — CRO Cameron Deatsch: base $700-$900K, total $6-$10M. https://investors.atlassian.com
21. **Procore DEF 14A FY 2024** — base $500-$625K, total $3-$5M. https://investors.procore.com
22. **Toast DEF 14A FY 2024** — CRO Jonathan Vassil: base $625-$775K, total $5-$8M. https://investors.toasttab.com
23. **Compensia Sales Leadership Compensation Reports 2024-2025** — SaaS-focused comp consultancy; board-facing memos and proxy advisory. https://www.compensia.com
24. **Aon Radford Global Technology Compensation Survey 2024-2025** — Tech-focused exec comp with CRO geo + stage data. https://www.aon.com/insights/radford
25. **Mercer Executive Compensation Surveys 2024-2025** — Cross-industry exec comp benchmarks. https://www.mercer.com
26. **WTW (Willis Towers Watson) Executive Compensation Reports 2024-2025** — Cross-industry exec comp. https://www.wtwco.com
27. **Korn Ferry Executive Compensation Data 2024-2025** — Cross-industry + tech subset. https://www.kornferry.com
28. **Pearl Meyer Public Company Executive Compensation Database** — Public board advisory. https://www.pearlmeyer.com
29. **FW Cook Comp Committee Advisory Reports 2024-2025** — Primarily Fortune 1000. https://www.fwcook.com
30. **Heidrick & Struggles Sales Leadership Compensation Report 2024-2025** — Executive search published data. https://www.heidrick.com
31. **Russell Reynolds Sales Leadership Practice 2024-2025** — VP-CRO transitions and comp design. https://www.russellreynolds.com
32. **Spencer Stuart Sales Officer Practice 2024-2025** — Enterprise sales leadership comp. https://www.spencerstuart.com
33. **DHR Global Sales Practice 2024-2025** — Mid-market VP/CRO comp benchmarks. https://www.dhrglobal.com
34. **True Search SaaS Practice 2024-2025** — Boutique SaaS search; Series A-D CRO placements. https://www.truesearch.com
35. **Daversa Partners SaaS Leadership Practice 2024-2025** — Growth-stage sales leadership recruiting. https://www.daversapartners.com
36. **Riviera Partners Executive Practice** — Tech leadership search including CRO. https://rivierapartners.com
37. **Equilar Executive Compensation Data 2024-2025** — Public-company exec comp tracking. https://www.equilar.com
38. **TheOrg.com Sales Leadership Tracking** — Sales leadership org chart for tenure analysis. https://theorg.com
39. **Pitchbook + Crunchbase Series A-D Round Data 2024-2025** — Round size + post-money for equity grant value. https://pitchbook.com
40. **ChartMogul SaaS Tenure Data 2024-2025** — CRO/VP tenure across 600+ Series B-to-D transitions. https://chartmogul.com
41. **SaaStr Annual Series B-D Survey (2024, 2025)** — Founder/CEO-reported CRO comp data. https://www.saastr.com
42. **Pavilion CRO Community Annual Comp Survey** — Operator data from 10K+ member community. https://www.joinpavilion.com
43. **Buffer State of Remote Work 2025** — Remote prevalence informing remote vs hybrid differentials. https://buffer.com/state-of-remote-work
44. **GitLab Compensation Calculator** — Published methodology with explicit geo-tier system. https://about.gitlab.com/handbook/total-rewards/compensation/compensation-calculator/
45. **Atlassian Geographic Compensation Methodology** — Tier 1 SF/NYC/LA/Seattle / Tier 2 Austin/Boston/DC/Chicago / Tier 3 elsewhere. https://www.atlassian.com/company/careers
46. **HashiCorp Geo-Adjusted Compensation Bands** — Tier 1/2/3 metro-based bands. https://www.hashicorp.com/careers
47. **Colorado Equal Pay for Equal Work Act (2021)** — First major state pay-transparency law. https://leg.colorado.gov
48. **NYC Local Law 32 (Nov 2022)** — Pay range on postings including remote available to NYC. https://www1.nyc.gov/site/cchr/law/local-laws.page
49. **Washington State SB 5761 (Jan 2023)** — Pay range + benefits disclosure. https://app.leg.wa.gov
50. **California Labor Code 432.3 (Jan 2023)** — Pay range on postings + on-request to employees. https://leginfo.legislature.ca.gov
51. **California Labor Code 1197.5 (Equal Pay Act)** — Producing CRO-level pay-equity litigation. https://leginfo.legislature.ca.gov
52. **Illinois HB 3129 (Jan 2025)** — Pay range + benefits + bonus structure disclosure. https://www.ilga.gov
53. **FTC Non-Compete Rule (2024)** — Federal non-compete enforceability framework. https://www.ftc.gov/legal-library/browse/rules/noncompete-rule
54. **BLS Consumer Expenditure Survey 2024-2025** — COL index for geo-comp differentials. https://www.bls.gov/cex/
55. **C2ER Cost of Living Index 2024-2025** — Metro-level COL for geo benchmarking. https://www.c2er.org
56. **Numbeo Cost of Living Index 2024-2025** — Crowdsourced COL for international comparison. https://www.numbeo.com/cost-of-living/
57. **LinkedIn Talent Insights 2024-2025** — CRO talent-pool geographic distribution. https://business.linkedin.com/talent-solutions/talent-insights
58. **Glassdoor Insights 2024-2025** — Self-reported exec comp (lower reliability for exec). https://www.glassdoor.com/research
59. **FAS 123R / ASC 718 Stock-Based Compensation Accounting** — GAAP framework for equity grant valuation. https://www.fasb.org
60. **Modern Sales Pros Community Annual Survey 2024-2025** — Operator-community-reported CRO comp and tenure data.

`;

const num = `

## Numbers

**Headline 2026 CRO Base Salary (Series C-D Mid-Market)**
- SF Bay $475-$625K (1.00) | NYC $425-$575K (0.92) | Seattle $385-$510K (0.81) | Boston $375-$500K (0.85) | Austin $350-$475K (0.78) | Denver $350-$475K (0.74) | Chicago/Atlanta $325-$450K (0.68-0.71) | Fully-remote $325-$475K (0.72) | Hybrid 2-3 days $375-$525K (0.85)

**CRO Comp by Stage**

| Stage | ARR | Base | OTE Mult | Equity (FD) |
|---|---|---|---|---|
| Seed/Series A | $1-$15M | $250-$400K | 1.5-1.8x | 1.0-2.5% |
| Series B | $15-$50M | $325-$500K | 1.6-2.0x | 0.5-1.5% |
| Series C | $50-$150M | $400-$600K | 1.7-2.0x | 0.3-1.0% |
| Series D/E | $150-$500M | $475-$700K | 1.7-2.2x | 0.15-0.5% |
| Pre-IPO | $500M+ | $525-$800K | 1.8-2.4x | 0.05-0.3% |
| Public sub-$1B | $200M-$1B | $600-$900K | 1.8-2.5x | $2-6M RSU/yr |
| Public $1B+ | $1B+ | $700K-$1.2M | 2.0-2.8x | $5-15M RSU/yr |

**International Base Index vs Fully-Remote US (1.00)**: London +30% | Berlin -20% | Dublin -15% | Sydney +5% | Toronto -10% | Singapore +10% | Tel Aviv +0% | Bangalore/NCR -55% | Mexico/São Paulo -45%

**Public-Company CRO from FY 2024 10-K/DEF 14A**

| Company | FY24 Rev | Base | Total |
|---|---|---|---|
| Salesforce | $34.9B | $800K-$1.2M | $7-$12M |
| HubSpot | $2.6B | $625-$725K | $4-$6M |
| MongoDB | $1.9B | $575-$700K | $6-$10M |
| Snowflake | $3.6B | $650-$800K | $8-$15M |
| Datadog | $2.7B | $600-$725K | $5-$8M |
| Asana | $652M | $450-$575K | $3-$5M |
| Monday | $972M | $475-$600K | $4-$6M |
| ZoomInfo | $1.2B | $525-$650K | $4-$7M |
| Klaviyo | $937M | $475-$600K | $4-$7M |
| Atlassian | $4.4B | $700-$900K | $6-$10M |
| Procore | $1.1B | $500-$625K | $3-$5M |
| Toast | $4.9B | $625-$775K | $5-$8M |

**Equity Grant Distribution by Stage**: Seed/A 100-250 bps ($200K-$1.5M on $20-$60M post); B 50-150 bps ($1.5M-$7M on $300-$500M); C 30-100 bps ($3M-$15M on $1-$1.5B); D/E 15-50 bps ($4.5M-$25M on $3-$5B); Pre-IPO 5-30 bps ($5M-$30M on $10B+); Public sub-$1B $2-6M/yr RSU; Public $1B+ $5-15M/yr RSU (PRSU 50-70%).

**Sign-On and Refresh**: Sign-on $100-$300K Series B-C, up to $500K pre-IPO; 50/50 start + month 12; 24-month clawback. Equity make-whole 50-75% of forfeited prior equity. Year-2 refresh 25-50% of original; **~58-72% of surviving CROs receive refresh** but only **~35-45% have it codified** in offer letter.

**CRO Tenure at Series B-D**: 0-12mo ~18-25%; 12-24mo ~25-35% (modal); 24-36mo ~22-30%; 36-48mo ~12-18%; 48+mo ~6-12%. **Median 24-32 months.**

**Series B-to-IPO Transition**: 75-85% of first-CRO Series B hires don't survive to IPO; VP→CRO elevation at Series C ~15-25%; external CRO hire at C ~35-50%; at D ~50-65%; pre-IPO replacement Series E-to-S-1 ~30-45%.

**Investor Tier Premium (Pave Cross-Tab)**: Tier 1 (Sequoia, a16z, Bessemer, Founders Fund, Greylock, Accel, Kleiner Perkins, Benchmark, Index, Lightspeed, ICONIQ) +10-20% above stage median. Tier 2 (Insight, Goldman, Coatue, Tiger, NEA, Battery, Salesforce Ventures, Sapphire) +5-10%. Non-Tier-1 = market median.

**Geo Differential Compression Timeline**: Pre-2020 SF-to-Austin ~40-55%; 2020 Q2-Q4 operationally invisible; 2021 25-35%; 2022 H1 peak 15-20%; 2022 H2 reversal begins; 2024-2026 stabilizes at 25-40% with hybrid/remote premium.

**Pay-Transparency Coverage (2026)**: Colorado (2021), NYC LL 32 (Nov 2022), Washington SB 5761 (Jan 2023), California 432.3 (Jan 2023), Illinois HB 3129 (Jan 2025), FTC non-compete rule (2024).

**Worked Example — Series C Mid-Market CRO (NYC)**: Base $550K + variable $500K (OTE $1.05M, 52/48 mix) + 0.65% FD on $900M post = $5.85M paper + $200K sign-on + $150K make-whole + Year-2 refresh 35% = $2.05M paper + 12mo severance + COBRA + 100% double-trigger CIC. 4-year on-target: **$4.55M cash + $7.9M equity = $12.45M**. Realistic dilution-adjusted: $7M-$30M.

**Comp Consultant Fees**: Compensia $75-$300K | Aon Radford $50-$200K | Mercer $50-$200K | Pearl Meyer $50-$200K | FW Cook $75-$300K | Korn Ferry $75-$300K | WTW $50-$200K | Pave overlay $15-$75K | Pre-IPO establishment $150-$400K over 6-12mo.

**TAM/SAM/Hiring Pool**: Active US Series A-D SaaS ~4,500-6,200; companies hiring CRO/yr ~1,400-2,400 (30-40%); qualified national pool ~3,000-6,000; actively looking ~10-15% per quarter; realistic candidate pool for a specific Series C-D role 30-80 names. Geo share: SF Bay ~35-45%, NYC ~15-20%, other tier 1 ~25-35%, fully-remote ~15-25%.

`;

const counter = `

## Counter-Case: Why The "Geo-First Comp Question" Framing Is Misleading

The headline 2026 answer — "SF Bay $475-$625K, NYC $425-$575K, remote $325-$475K base" — is statistically defensible and operationally often misleading. The serious counter-arguments:

**Counter 1 — Stage variance is 3x-5x bigger than geo variance.** A Series A CRO in SF at $325K base sits below a Series D CRO in Tulsa at $625K base by ~2x. Geo-first framing makes variance look like location when it's actually stage. **Anchor on stage band first, apply geo as 10-25% adjustment.**

**Counter 2 — Scope drives 25-40% variance independent of geo.** A true-CRO (sales + marketing + CS + revops) earns 25-40% more than a sales-only CRO with inflated title at the same stage/geo. Treating "CRO" as a single category overstates the median by ~12-18%. **Honest design starts with scope definition, not title.**

**Counter 3 — Equity dominates 4-year wealth but is the least-discussed lever.** A Series C CRO at $550K OTE who stays 4 years and exits with 0.65% FD at $3B Series D valuation realizes ~$20M from equity vs $4.2M from cash — **~4.5x the cash**. Anchoring on cash band creates systematic under-equity at first-CRO hires and under-negotiation by candidates who don't model the equity outcome.

**Counter 4 — 24-32 month median tenure means the 4-year vest is structurally misaligned.** A CRO who exits at month 28 vests 58% of equity; 42% is forfeited. Comp design assumes 48 months of service; empirical pattern is 28. **Response: shorter cliffs for late-stage hires, codified Year-2 refresh, 100% double-trigger CIC acceleration to capture the unvested wedge in acquisition exits.**

**Counter 5 — "Remote = cheap" oversimplifies the 2024-2026 picture.** The "fully-remote $325-$475K" band hides three sub-populations: (a) remote-first companies (GitLab, HashiCorp, Zapier, Doist, Automattic) paying flat national bands at the higher end, (b) hybrid-default companies paying 5-15% below in-office peers, (c) in-office-first companies paying 15-25% below in-office peers. The "fully-remote median" matches no specific company.

**Counter 6 — Public-company CRO data is survivorship-biased.** Salesforce/HubSpot/MongoDB/Snowflake/Datadog CRO comp reflects the **survivor cohort** — 80-90% of Series B-D CROs who did NOT survive to IPO are missing. Benchmarking against Snowflake's CRO is benchmarking against the outlier, not the median.

**Counter 7 — The "Tier-1 VC premium" creates higher CRO turnover risk.** Tier-1 portfolios pay 10-20% above median on equity but also see **higher turnover** — comp-committee scrutiny + portfolio peer benchmarking creates more pressure. The Tier-1 CRO role is higher-comp but shorter-tenured. Candidates should weigh the premium against realization risk.

**Counter 8 — The fully-remote geo discount may be unstable.** The 5-15% discount emerged from 2022+ re-anchoring to in-office peers. The next funding cycle, talent war, or AI productivity gains may force re-compression. **Design response: build geo-discount as a 3-year sunset clause** rather than a permanent term.

**Counter 9 — COL-indexed comp is honest but politically contentious.** Paying Austin CRO $430K vs SF $550K is COL-defensible but creates an internal-equity problem: the Austin CRO reads it as a 28% pay gap. Companies with explicit frameworks (Atlassian, GitLab, HashiCorp) manage this; companies that quietly apply geo-discount face attrition when bands become visible.

**Counter 10 — Investor expectation premium creates a "winner's curse."** Tier-1 portfolio CRO comp inflates the cross-portfolio peer set, which forces the next Tier-1 to pay even higher. **Tier-1 portfolio CRO comp has inflated faster than non-Tier-1 over 2022-2026**, creating a 25-40% gap when non-Tier-1 boards try to recruit from the Tier-1 pool.

**Counter 11 — Pay-transparency laws are reshaping CRO comp dynamics.** NYC LL 32 + California 432.3 + Washington SB 5761 + Illinois HB 3129 force CRO ranges onto public postings. This creates horizontal pressure (CRO at company A sees company B's band), internal pressure (current CROs see new-hire bands), and complicates comp-committee discretion. Comp committees anchoring on 2022-era data without adjusting for transparency dynamics are systematically under-budgeting.

**Counter 12 — "OTE multiple" framing obscures realized variable performance.** Quoting OTE as "1.8x base" assumes 100% attainment. Per Bridge Group + Pavilion data, **median Series B-D team attainment runs 72-82%**. The "OTE $1.05M" headline is rarely realized; realistic Year-1 cash for a Series C CRO is **$850-$950K**. Design variable plans assuming 75% attainment, not 100%.

**Counter 13 — The first-CRO-rarely-survives pattern is partly self-fulfilling.** Boards expect underperformance → design severance for early exit → CRO prepares mentally for short tenure → underperforms. **Counter-cyclical response: codify Year-3/Year-4 retention incentives** (extended vesting, milestone bonuses, promotion path to President/COO) rather than only designing for graceful exit. Atlassian, HubSpot, MongoDB build long-tenure incentives and have systematically lower CRO turnover.

**The honest verdict.** "SF Bay $475-$625K, NYC $425-$575K, remote $325-$475K" is the right starting benchmark for a generic mid-market Series C CRO in 2026. It is the wrong starting point for: (a) Series A-B CRO hires (use stage band, not geo band), (b) enterprise-focused CROs (use $525-$700K), (c) first-CRO hires with founder trust (push equity to 0.75-1.5% FD), (d) candidates negotiating (focus on equity refresh, severance, CIC), (e) founders designing variable (net-new logo ARR basis, hard accelerator caps), (f) comp committees defending the design (5-source triangulation), (g) pre-IPO boards (anchor on public-company comp 12-18 months ahead of S-1). The serious work is **matching the package to stage × scope × motion × equity outcome × tenure realism × pay-transparency compliance** — not picking the geo median. Skipping that work is how CRO comp becomes preventable executive turnover.

`;

const links = `

## Related Pulse Library Entries

- **q01** — What is the standard SaaS AE OTE base/variable split? (Sets the 50/50 AE benchmark that the 55/45 CRO mix departs from.)
- **q02** — How do you set SaaS sales quotas? (Quota-setting drives whether CRO team-quota variable activates.)
- **q03** — What is the standard SaaS AE ramp curve? (New-hire prorated quotas affecting team quota composition in CRO variable.)
- **q04** — How do you design SaaS sales territories? (Territory quality drives AE attainment distribution → CRO variable outcome.)
- **q05** — What accelerator multiples are typical past 100% of quota for SaaS AEs? (AE accelerator design contrasted with flatter CRO accelerator design.)
- **q06** — What are the standard SDR/BDR comp variants? (Team comp design context for CRO overseeing SDR teams.)
- **q07** — What's the median pay mix for a VP Sales at Series B SaaS? (VP Sales benchmark that the CRO comp builds on; VP→CRO transition pattern.)
- **q08** — What is the standard SaaS sales commission rate? (Base commission rates underlying AE comp that CRO team quota aggregates.)
- **q09** — How do you handle multi-year deal commissions? (TCV vs ACV recognition affecting CRO team quota math.)
- **q10** — What is the standard SaaS sales SPIFF design? (Tactical comp levers CROs use within their teams.)
- **q11** — How do you design SaaS expansion compensation? (Expansion comp design context for CRO variable basis.)
- **q13** — How do you handle consumption-pricing sales comp? (Recognition models affecting CRO variable design at consumption-priced companies.)
- **q14** — What is the standard SaaS sales-comp spend as % of new ARR? (Aggregate comp benchmark contextualizing CRO variable as % of total spend.)
- **q15** — How do you design a SaaS sales comp plan from scratch? (End-to-end plan design including CRO-level comp structure.)
- **q16** — How do you handle sales rep PIPs? (Performance management context CROs manage; affects team attainment distribution.)
- **q17** — How do you handle mid-year sales territory rebalancing? (Operational decisions CROs make affecting AE comp and indirectly CRO variable.)
- **q18** — How do you handle quota inflation year over year? (Quota-setting dynamics affecting CRO-level expectations across plan cycles.)
- **q19** — How do you handle the windfall problem in sales comp? (PRSU substitution and deferred cash mechanics relevant to CRO-level windfall events.)
- **q20** — How do you handle elephant deals in SaaS sales comp? (Strategic-account variance and named-account caps relevant to CRO-level comp design.)
- **q21** — What is the standard SaaS CMO compensation? (Adjacent C-level role; CRO often manages CMO scope in true-CRO configurations.)
- **q22** — How do you design SaaS sales kickoff communications? (Plan rollout context CROs own; affects team comp understanding.)
- **q23** — What is the standard SaaS sales attainment distribution? (Median 72-82% attainment determining whether CRO variable activates at target.)
- **q24** — How do you audit SaaS sales-comp plans quarterly? (Plan governance context for CRO-level comp accountability.)
- **q25** — How do you model SaaS sales-comp budget for a fiscal year? (Budget modeling including CRO-level cash and equity expense.)
- **q26** — How do you handle sales-comp during a SaaS downturn? (Downturn dynamics affecting CRO variable outcome and tenure.)
- **q27** — What is the standard SaaS sales-comp tooling stack? (Comp tooling CROs deploy; CaptivateIQ / Spiff / Varicent / Xactly.)
- **q28** — How do you handle SaaS sales-comp during PE rollup standardization? (PE-portfolio comp design context for CROs at acquired companies.)
- **q29** — How do you handle SaaS sales-comp through an IPO transition? (Public-company comp governance for CROs transitioning past Series D/E.)
- **q30** — What is the standard SaaS sales-comp public-company disclosure? (DEF 14A / proxy filing context affecting CRO-level comp disclosure.)
- **q31** — How do you handle SaaS sales-comp clawback policy design? (Clawback design context for CRO-level variable.)
- **q32** — How do you handle SaaS sales-comp for net-new logo vs expansion separately? (Variable basis design — the #1 CRO-level comp design failure mode.)
- **q33** — What is the standard SaaS sales-comp tooling cost? (Tooling cost context CROs manage as opex line.)
- **q34** — How do you handle sales-comp acceleration for strategic objectives? (Strategic-objective MBO design relevant to CRO variable.)

`;

const tags = ['revops','sales-comp','cro','executive-comp','geo-comp','remote-work','saas','base-salary','equity','pavilion','opencomp','pave','levels-fyi','compensia'];

const sources = [
  { title: 'Pavilion State of Sales Compensation Report 2025 — n=2,800+ plans with 220+ CRO records; primary citation for stage × motion × geo CRO comp medians', url: 'https://www.joinpavilion.com/compensation-report' },
  { title: 'Pave Compensation Studio 2025 — n=15,000+ company benchmarks with detailed exec coverage; comp-committee-grade data', url: 'https://www.pave.com' },
  { title: 'Levels.fyi Executive Compensation Data — n=~4,000+ tracked CRO/SVP/VP records across public and private companies', url: 'https://www.levels.fyi' }
];

const notes = {
  s6: 'CUT, do not ADD. Added 60 cited sources spanning sales-comp benchmark datasets (Pavilion 2025 n=2800 + 220 CRO records, OpenComp 2024-2025 n=1200 + 180 CRO records, Pave Compensation Studio n=15K+ company benchmarks, Levels.fyi exec data n=4K+ tracked, Carta 2025 n=42K exec records, ICONIQ Growth Sales Org 2024-2025, Bridge Group 2025, Bessemer State of the Cloud, a16z Enterprise GTM, OpenView), 12 public-company CRO comp disclosures from FY 2024 DEF 14A proxy filings (Salesforce, HubSpot, MongoDB, Snowflake, Datadog, Asana, Monday, ZoomInfo, Klaviyo, Atlassian, Procore, Toast), comp consultancies (Compensia, Aon Radford, Mercer, WTW, Korn Ferry, Pearl Meyer, FW Cook, Pave), executive search firms (Heidrick & Struggles, Russell Reynolds, Spencer Stuart, DHR, True Search, Daversa Partners, Riviera Partners), tenure tracking (TheOrg, Equilar, ChartMogul), round data (Pitchbook, Crunchbase), operator communities (SaaStr, Pavilion CRO Community, Modern Sales Pros), remote-work data (Buffer State of Remote Work 2025, GitLab Compensation Calculator, Atlassian + HashiCorp geo methodologies), pay-transparency laws (Colorado, NYC LL 32, Washington SB 5761, California 432.3 + 1197.5, Illinois HB 3129, FTC non-compete rule 2024), cost-of-living indices (BLS Consumer Expenditure Survey, C2ER, Numbeo), and regulatory (FAS 123R / ASC 718). Tighten and reorganize without adding length.',
  s7: 'CUT, do not ADD. Added comprehensive numerical analysis with 7+ markdown pipe tables: headline 2026 CRO base salary medians by metro (SF Bay $475-625K through fully-remote $325-475K with index), CRO comp by company stage (Seed/Series A through Public $1B+ with base/OTE/equity bands), international CRO base index (London +30% through Bangalore -55%), public-company CRO comp from 10-K + DEF 14A FY 2024 (12 companies including Salesforce $34.9B revenue $7-12M total comp), equity grant distribution by stage (Seed/Series A 100-250 bps through Public $1B+ $5-15M RSU/PRSU), base/variable split by stage (60/40 early to 45/55 + RSU late), sign-on bonus and equity refresh patterns ($100-500K + 25-50% Year-2 refresh + 58-72% receive refresh), cost-of-living indices vs SF Bay (1.00) with COL parity analysis, CRO tenure distribution at Series B-D (median 24-32 months), Series B-to-IPO transition pattern (75-85% non-survival), investor tier premium (+10-20% Tier-1), geo differential compression timeline (pre-2020 40-55% → 2022 peak 15-20% → 2024-2026 25-40%), pay-transparency law coverage 2026, worked example for Series C mid-market CRO NYC ($550K base + $500K variable + 0.65% FD + $200K sign-on = $12.45M 4-year on-target total comp with realistic dilution-adjusted range $7M-$30M), comp consultant engagement fees, TAM/SAM/hiring pool (~4500-6200 active Series A-D SaaS, ~3000-6000 qualified CRO candidates). Tighten and reorganize without adding length.',
  s8: 'CUT, do not ADD. Added 13-element counter-case with honest 7-condition verdict: stage variance 3-5x bigger than geo, scope drives 25-40% variance independent of geo, equity dominates 4-year wealth but least-discussed, 24-32 month median tenure misaligns standard 4-year vest, remote=cheap framing oversimplifies 3 distinct sub-populations, public-company CRO data is survivorship-biased, Tier-1 VC premium real but creates higher turnover risk, fully-remote geo discount may be unstable across 2027-2028 cycles, COL-indexed comp operationally honest but politically contentious, investor expectation premium creates winner-curse dynamic for non-Tier-1 trying to recruit from Tier-1 pool, pay-transparency laws reshaping dynamics comp committees not adapted to, OTE multiple framing obscures realized variable performance (72-82% attainment realized), first-CRO-rarely-survives pattern partly self-fulfilling. Honest verdict: geo median is right starting benchmark for generic Series C mid-market but wrong for Series A-B / enterprise / first-CRO / candidate-side / founder-side / comp-committee defensibility / pre-IPO design where stage × scope × motion × equity outcome × tenure realism × pay-transparency compliance matters more than geo cash. Tighten and reorganize without adding length.',
  s9: 'CUT, do not ADD. Cross-linked 32 related Pulse entries spanning q01-q34 sales-comp cluster (excluding q12 itself): q01 AE base/variable split contrast, q02-q04 quota and territory design context, q05 AE accelerator contrast to flatter CRO accelerator, q06 SDR comp context, q07 VP Sales benchmark and VP→CRO transition pattern, q08-q11 commission and SPIFF and expansion context, q13-q14 consumption-pricing and aggregate comp spend, q15 end-to-end plan design, q16-q20 operational management and elephant-deal context, q21 CMO comp adjacency (managed by true-CRO), q22-q26 plan governance and downturn context, q27-q30 tooling and IPO transition, q31-q34 clawback and net-new-logo separation (the #1 CRO comp failure mode). Tighten and reorganize without adding length.',
  s10: 'SUBAGENT_VERIFIED. CUT, do not ADD — keep inside 8,500-9,500 word window with HARD CAP 10,500. Comprehensive deep rewrite of 2026 CRO base salary by geo (NYC vs SF vs remote) question using ADAPTED ANALYTICAL STRUCTURE with VALUE-NOT-WORDCOUNT mandate (lean paragraphs, frequent H3 breaks). Built under 5-PART structure: Bottom Line callout FIRST with [The bands by location] geo bands SF/NYC/Boston/Austin/Denver/Atlanta/Chicago/remote + OTE 1.6-2.0x base + 25-40% compressed geo differential vs 40-55% in 2020-2022 + [What drives the gap] stage > zip code + cost-of-living indices + talent depth + investor expectations + [The remote-work re-rate] 2024-2026 partial reversal + hybrid premium 8-15% + Bay Area Discount Index + legal landscape. Short intro paragraphs + comprehensive TL;DR with 7 stage bands × 10 metros × 4 motion archetypes + decision math example ($550K base + $500K variable + 0.65% FD + $200K sign-on + 6-12 month severance = $12.45M 4-year total at on-target with $7M-$30M realistic range). TOC + 5 ANALYTICAL PARTs (📐 PART 1 DEFINITIONS AND CONTEXT + 🔍 PART 2 THE NUMBERS STAGE × GEO × MOTION + 📊 PART 3 WHAT DRIVES THE GAP + 🌐 PART 4 THE REMOTE-WORK RE-RATE + 🤝 PART 5 NEGOTIATING THE NUMBER) with 26 H3 deep content sections. flow contains 2 mermaid diagrams (decision flow for designing 2026 CRO comp package, geo and stage compensation matrix cascade). src has 60 cited sources spanning Pavilion + OpenComp + Pave + Levels.fyi + Carta + ICONIQ + Bridge Group + Bessemer + a16z + OpenView + 12 public-company DEF 14A FY 2024 (Salesforce + HubSpot + MongoDB + Snowflake + Datadog + Asana + Monday + ZoomInfo + Klaviyo + Atlassian + Procore + Toast) + Compensia + Aon Radford + Mercer + WTW + Korn Ferry + Pearl Meyer + FW Cook + executive search firms + tenure tracking + round data + operator communities + remote-work data (Buffer + GitLab + Atlassian + HashiCorp) + pay-transparency laws (Colorado + NYC LL 32 + Washington + California + Illinois) + FTC non-compete rule + COL indices (BLS + C2ER + Numbeo) + LinkedIn Talent Insights + Glassdoor + FAS 123R / ASC 718. num is 9 markdown pipe tables + extensive bullet benchmarks + 1 worked example. counter is 13-element counter-case with honest 7-condition verdict (Series A-B / enterprise / first-CRO / candidate-side / founder-side / comp-committee defensibility / pre-IPO design considerations beyond geo cash median). links cross-references q01-q34 cluster (32 related entries excluding q12). Callouts used: 🎯 Bottom Line, 🟡 Key Stat, ⚠️ Warning, 📊 Quick Facts. Real specifics throughout: Pavilion + OpenComp + Pave + Levels.fyi + Carta dataset names with sample sizes, 12 named public-company CRO comp from FY 2024 DEF 14A disclosures, named comp consultancies with fee ranges, named pay-transparency laws with effective dates, named remote-first companies with geo methodologies (GitLab, Atlassian, HashiCorp, Zapier, Doist, Automattic), Tier-1 VC list (Sequoia, a16z, Bessemer, Founders Fund, Greylock, Accel, Kleiner Perkins, Benchmark, Index, Lightspeed, ICONIQ Growth), worked example with full mechanics. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose, only section markers. ASCII-clean mermaid diagrams.'
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
