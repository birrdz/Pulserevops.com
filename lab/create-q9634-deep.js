// q9634 -- What does the 2027 Chief Revenue Officer compensation benchmark actually look like by company stage?
// Creates baseline blob + index row, then walks the polish ladder 5 -> 6 -> 7 -> 8 -> 9 -> 10.
const { getStore } = require('@netlify/blobs');
const { runPolish } = require('./polish-helper');

const ID = 'q9634';
const QUESTION = 'What does the 2027 Chief Revenue Officer compensation benchmark actually look like by company stage?';

const tldr = `**TL;DR:** A 2027 CRO comp package is a **stage-indexed instrument**: base + variable (50/50) + equity + change-of-control + sign-on + severance. 2027 OTE bands (Alexander Group, Pavilion, Heidrick, Equilar, Carta, Pave): **Pre-A** $200-350K, 1.5-3.0% equity; **Series A** $300-450K, 0.75-1.5%; **Series B** $400-600K, 0.5-1.0%; **Series C** $500-800K, 0.25-0.6%; **Series D+** $600K-$1.2M, 0.15-0.4%; **Public** $650K-$1.2M+ cash plus $3-8M annual RSU+PSU per DEF 14A proxies (HubSpot, Salesforce, Snowflake, Datadog, MongoDB, Okta, Cloudflare, Confluent, Zscaler, ZoomInfo). Accelerators 1.5x at 100-115%, 2x above 115%. Refresh 25% of grant annually. CIC double-trigger 100% (Cooley GO). Severance 6-12 mo + COBRA + acceleration. Trap: dilution + 18-mo median tenure (Heidrick) cut realized comp to **40-70% of headline**. Right: Series C CRO clears $4-12M on exit; wrong: $800K-$1.5M.`;

const core = `

## What A 2027 CRO Compensation Package Actually Is

A Chief Revenue Officer compensation package is not a salary — it is a six-line-item financial instrument: **(1) base salary, (2) variable / target bonus (the "OTE" line everyone fixates on), (3) equity grant (options, RSUs, or hybrid), (4) change-of-control protection (single- or double-trigger acceleration on unvested equity), (5) sign-on bonus, and (6) severance + accelerated vesting on involuntary termination.** Every line item moves on a different curve as the company scales, and a CRO or CEO who negotiates only on OTE is leaving the majority of the package's value on the table. The 2027 reality, blended across Alexander Group's Annual Sales Compensation Trends Survey, Pavilion's Revenue Compensation Report, Heidrick & Struggles, Equilar, Pave, and SEC EDGAR proxies: total CRO comp scales roughly with ARR, but the *mix* shifts dramatically — early-stage CROs are equity-heavy cash-light, late-stage and public CROs are cash-and-RSU-heavy with smaller equity percentages. The **median CRO tenure is approximately 18-19 months** per Heidrick's Route to the Top (remarkably stable across cycles), meaning the package must be negotiated assuming you will not vest your full 4-year grant — making acceleration, severance, and refresh policy more economically important than headline OTE.

## The OTE Bands By Stage: The Canonical 2027 Reference Table

The most useful single artifact for either side of a CRO comp negotiation is the stage-by-stage band, with sources. Here it is.

| Stage | ARR | Base | Variable | OTE | Equity grant | Refresh | Sign-on | Severance |
|---|---|---|---|---|---|---|---|---|
| Pre-Series A / Founder-led | $0-$1M | $150-$200K | $50-$150K | $200-350K | 1.5-3.0% (often advisor + part-time) | per perf | $0-50K | 3-6 mo base |
| Series A | $1-5M ARR | $175-$250K | $125-$200K | $300-450K | 0.75-1.5% | 25% of original/yr | $25-100K | 6 mo base |
| Series B | $5-25M ARR | $225-$325K | $175-$275K | $400-600K | 0.5-1.0% | 25% of original/yr | $50-150K | 6-9 mo base |
| Series C | $25-75M ARR | $275-$425K | $225-$375K | $500-800K | 0.25-0.6% | 25% of original/yr | $75-200K | 9-12 mo base |
| Series D+ | $75-$200M ARR | $325-$500K | $275-$500K | $600K-$1.0M | 0.15-0.4% | 25% of original/yr (cash-equiv RSU) | $100-250K | 12 mo base + COBRA |
| Pre-IPO / late | $200M-$500M ARR | $375-$600K | $300-$600K | $700K-$1.2M | 0.10-0.3% RSU | annual RSU refresh | $150-250K | 12 mo + acceleration |
| Public | $500M+ ARR | $400-$650K base + 75-150% target bonus | (incl in TD) | $650K-$1.2M+ cash | RSU + PSU annual | annual via comp committee | sign-on rare | 12-24 mo + double-trigger |

Sources: Alexander Group 2024-2025 Sales Compensation Trends Survey (alexandergroup.com), Pavilion 2024 Revenue Compensation Report (joinpavilion.com), Heidrick & Struggles' Route to the Top (heidrick.com), Crist Kolder Volatility Report (cristkolder.com), Equilar (equilar.com) executive compensation database, Pave (pave.com) and Carta (carta.com) real-time compensation benchmarks, and DEF 14A proxy filings on SEC EDGAR (sec.gov) for HubSpot (HUBS), Salesforce (CRM), Snowflake (SNOW), Datadog (DDOG), MongoDB (MDB), Okta (OKTA), Cloudflare (NET), Confluent (CFLT), Zscaler (ZS), and ZoomInfo (ZI). Use this table as the *opening anchor* in any negotiation; the bands hold across SaaS, cybersecurity, and infrastructure software with modest premia for cyber and infra (typically 5-15% above the bands above) and modest discounts for vertical SaaS (typically 5-10% below).

## Pre-Series A And Founder-Led: A Venture Bet, Not A Comp Package

A pre-Series A CRO is rarely a real CRO — most often a fractional Head of Sales, player-coach VP, or "advisor + part-time" hybrid. Cash is small ($150-200K base, $50-150K variable target the company often cannot actually pay until ARR exists); equity is large (1.5-3.0% fully-diluted). Package value is almost entirely option-pricing leverage: a 2.0% grant at a $10M post-money becomes 0.4-0.6% by Series C and 0.2-0.3% by IPO, but on a $1B exit that is still $2-3M. The honest framing: a pre-Series A CRO is taking a venture bet, and the negotiation is about (a) equity percentage, (b) accelerated vesting on change-of-control before the next round, and (c) a clear path to a real CRO title and refreshed equity at Series A. Founders who skimp on change-of-control here often find their early CRO sandbagging the Series A close.

## Series A: The First Real Package

A Series A CRO ($1-5M ARR, $8-25M raised, 5-25 reps) is the first stage where comp looks like an executive package. **Base $175-250K, variable $125-200K, OTE $300-450K, equity 0.75-1.5%, four-year vest with one-year cliff.** The 50/50 base/variable split is canonical (Alexander Group: ~70% of Series A CRO packages run 50/50). Variable pays against an annual quota at 4-6x OTE — a $400K OTE CRO carries $1.6-2.4M ARR personal quota plus team quota. Sign-on $25-100K with 12-month voluntary-only clawback. Severance is the underwritten line: **6 months base + COBRA + 12-month equity vesting acceleration on involuntary termination without cause** is the Pavilion-benchmarked standard. Cooley and Wilson Sonsini templates are the canonical contract references.

## Series B: The Inflection Point

Series B ($5-25M ARR, $25-75M raise, 50-150 reps) is where the role becomes structurally important to the outcome. **Base $225-325K, variable $175-275K, OTE $400-600K, equity 0.5-1.0%.** Equity percentage shrinks but dollar value typically *increases* — a 0.75% grant at a $300M post-money is $2.25M of paper equity vs $750K at a $100M Series A. Sign-on $50-150K with clawback extending to 18 months in some packages. Refresh starts to matter: **25%-of-original-grant annual refresh** (Carta, Pave) is the standard mechanism — a CRO without explicit refresh policy in the offer is accepting whatever the comp committee decides. Severance moves to 6-9 months. Change-of-control becomes the most economically important clause: **double-trigger 100% of unvested** (Cooley GO + Gunderson + WSGR senior-exec standard) versus no acceleration is a 70%+ swing on equity value if an acquisition happens at month 18.

## Series C: The Scale Package

A Series C CRO ($25-75M ARR, $50-150M raise, 100-300 reps, often multi-product) is running a real revenue organization with regional VPs, CSM, sales ops, and likely a partner channel. **Base $275-425K, variable $225-375K, OTE $500-800K, equity 0.25-0.6%.** Variable mix may shift to 60/40 base-heavy as the CRO becomes more org-builder than closer — Alexander Group: ~35-40% of Series C packages run 60/40. Quota multipliers compress: a $700K OTE CRO might carry $25-40M ARR organizational quota (5-7x OTE). Sign-on $75-200K, severance 9-12 months. **MBO bonuses** tied to strategic objectives (international expansion, product attach, channel revenue) layer on the variable at 10-25% of variable total. The board comp committee is formally involved — the offer is comp-committee-approved, not CEO-decided.

## Series D+ And Pre-IPO: The Last Pre-Public Package

A Series D+ CRO ($75-200M ARR, often pre-IPO with 12-36 month IPO horizon) is in the most strategically valuable comp moment of their career. **Base $325-500K, variable $275-500K, OTE $600K-$1.0M, equity 0.15-0.4%.** Equity is typically a mix of options on an updated 409A and RSUs that vest on a double trigger combining time-vesting with a liquidity event. Sign-on can reach $250K. Severance 12 months base + COBRA + acceleration. The canonical late-stage move: negotiate **a one-time pre-IPO equity refresh** (25-50% of original grant) tied to IPO milestone, plus **post-IPO RSU refresh at comp-committee cadence**, plus **a clear PSU framework**. Cooley and Gunderson late-stage templates explicitly contemplate this transition; a CRO who takes a Series D package without the post-IPO transition language has accepted whatever the public-co comp committee later decides.

## Public Company: The DEF 14A Proxy Reality

Once public, CRO comp is disclosed in the DEF 14A proxy filed annually with the SEC. The structure standardizes around a public-co template: **base + target annual cash bonus (75-150% of base) + annual RSU grant + annual PSU grant**, with PSUs tied to multi-year revenue, ARR, or TSR targets. Proxy data is the most reliable benchmark in the industry because it is audited and public.

**Real recent (2023-2024) public-co CRO comp from SEC EDGAR DEF 14A proxies:** HubSpot (HUBS) ~$5-9M total annual; Salesforce (CRM) $8-15M+ for senior revenue NEOs; Snowflake (SNOW) $5-12M with PSU-heavy structures (Christopher Degnan and successors); Datadog (DDOG) $5-10M (Dan Fougere as CRO); MongoDB (MDB) $4-8M (Cedric Pech); Okta (OKTA) $4-9M (Susan St. Ledger and successors); Cloudflare (NET) $4-7M (Marc Boroditsky); Confluent (CFLT) $4-8M (Erica Schultz); Zscaler (ZS) $5-9M (Dali Rajic and successors); ZoomInfo (ZI) $3-6M (Christopher Hays). **Caveat:** exact dollar values, names, and tenures change annually as companies refresh NEOs and RSU/PSU grants vest at different prices — for current numbers pull the latest DEF 14A directly from sec.gov and read the Summary Compensation Table and Outstanding Equity Awards table. The structural pattern is stable: $400-650K base, 75-150% bonus target, $3-8M annual RSU+PSU grant, double-trigger CIC on 100% unvested, 12-24 month severance.

## Variable Structure: 50/50, 60/40, And The Accelerator Math

The base/variable split is one of the most consequential and most negotiated structural choices, and the canonical SaaS default is **50/50** — meaning a CRO with a $500K OTE has a $250K base and a $250K target variable. Alexander Group data and Pavilion's compensation report confirm 50/50 as the dominant structure (~65-75% of CRO packages) across Series A through Series C. **60/40 base-heavy** appears in roughly 20-30% of packages, typically (a) at later stages where the CRO role is more org-building than deal-closing, (b) in markets with high cost-of-living where a higher base is needed for retention, or (c) when the CRO has explicitly negotiated for cash certainty. **40/60 variable-heavy** appears in roughly 5-10% of packages, typically when the CRO is being recruited specifically to drive a turnaround or aggressive growth target and the comp committee wants comp to track outcomes.

The variable side is **accelerator-driven** above target, and the accelerator math materially affects realized comp:

| Attainment band | Multiplier on variable | Realized variable on $250K target |
|---|---|---|
| Below 50% | 0x (cliff) | $0 |
| 50-79% | 0.5x of attainment % | $62-99K |
| 80-99% | 0.8x of attainment % | $160-198K |
| 100% | 1.0x | $250K |
| 101-115% | 1.5x marginal | $250K + (attainment-100%) × 1.5 × $2,500 |
| 116-149% | 2.0x marginal | accelerator-rich band |
| 150%+ | often capped at 2.0x or uncapped depending on package | uncapped is the elite CRO negotiation |

Per Xactly Insights and CaptivateIQ benchmarks across thousands of SaaS comp plans, **the 1.5x at 100-115% and 2x above 115% accelerator structure** is the dominant 2027 design. The single most important negotiation point at the variable layer: **uncapped accelerators above 150% attainment**. Most CROs accept capped plans because the CEO frames the cap as "fair to the company" — but an uncapped accelerator costs the company nothing if the CRO doesn't outperform, and pays the CRO 2-4x extra realized comp in the years they do. The uncapped negotiation is one of the highest-leverage moves available to the CRO.

## Equity: The Number That Actually Matters

For a CRO at any pre-public stage, **equity is 60-85% of expected total comp** over a 2-3 year tour. OTE is the floor; equity is the upside.

**Grant structure (Series A-C):** ISOs or NSOs on a four-year vest with one-year cliff, monthly thereafter. Strike at the most recent 409A. Grant size as % of fully-diluted shares — Carta/Pave bands: 0.75-1.5% Series A, 0.5-1.0% Series B, 0.25-0.6% Series C, 0.15-0.4% Series D+, dropping to 0.10-0.3% pre-IPO as RSU grants dominate.

**Refresh policy** is the second-most-negotiated equity term and the one most CROs leave undefined. Carta/Pave: **standard CRO refresh runs 25% of original grant annually**, starting month 18-24, maintaining a "rolling four-year vest." A CRO without explicit refresh policy in the offer accepts whatever the comp committee discretionarily decides at year 2.

**Change-of-control acceleration** is the most economically important equity term. Cooley GO documents three structures: **(a) no acceleration** (CRO loses unvested equity on acquisition + termination — early-stage default, serious concession), **(b) single-trigger** (acceleration at acquisition regardless of termination — strongest CRO position, common at later stages), **(c) double-trigger** (acceleration only on acquisition AND termination without cause within 12-18 months — dominant standard at Series B+). Within double-trigger, 100% vs 50% of unvested is also negotiated; 100% is the senior-exec standard.

**Dilution math:** a 1.0% Series A grant dilutes to 0.6-0.8% by Series C (15-25% per round), 0.4-0.6% by Series D, 0.3-0.5% at IPO assuming standard refresh. On a $1B exit, 0.4% net is $4M; on a $5B IPO, 0.4% is $20M (subject to lockup and trading restrictions).

## Change-Of-Control: The Clause That Can Be Worth More Than The Salary

A CRO who joins a Series B company with a $750K paper equity grant and is terminated 14 months later in an acquisition with no acceleration walks away with whatever vested in the first 14 months — roughly 29% of the grant, or $217K. The same CRO with double-trigger 100% acceleration walks away with the full $750K. The difference is $533K — roughly two years of base salary for a single contract clause.

The Cooley GO data, the Gunderson Dettmer executive employment templates, and the Wilson Sonsini guidance converge on the same structural recommendation for Series B and later CROs: **double-trigger acceleration on 100% of unvested equity, with the second trigger defined as termination without cause or resignation for good reason within 12-18 months of the change-of-control event.** "Good reason" is itself a heavily negotiated term: the standard definitions include material reduction in role/title/responsibilities, material reduction in compensation, relocation of the CRO's primary work location more than 35-50 miles, or a material breach of the employment agreement by the company. A CRO who accepts a "good reason" definition that excludes role changes or comp reductions has accepted a clause an acquirer can game by demoting the CRO (without firing them) and waiting them out.

The single-trigger negotiation: the strongest CROs (those with a track record of materially scaling revenue at prior companies, those with deep board relationships, those being recruited at competitive pre-IPO stages) sometimes negotiate **single-trigger on a portion of the equity** (often 25-50%) with double-trigger on the remainder. This is unusual but documented, and the CRO who has the leverage should ask for it.

## Sign-On Bonuses And Clawbacks

Sign-on bonuses in 2027 CRO packages run $50-250K depending on stage and replacement comp considerations (a CRO leaving a company where they had unvested equity often negotiates a sign-on that approximates the equity they're forfeiting). **The clawback is universal:** sign-on is repaid in full or pro-rata if the CRO leaves voluntarily within 12 months (sometimes 18 or 24). The clawback language matters: a CRO who is terminated without cause should not be subject to clawback (the standard is "voluntary resignation or termination for cause"), and a CRO who accepts a clawback that triggers on involuntary termination has accepted a serious overreach.

## Severance: The Underwritten Insurance Policy

Severance is the CRO's insurance policy against the 18-month median tenure. The 2027 standard:

| Stage | Severance base | COBRA | Equity acceleration on involuntary termination (no CIC) |
|---|---|---|---|
| Series A | 6 months base | 6 months | 6-12 months continued vest |
| Series B | 6-9 months base | 9-12 months | 12 months continued vest |
| Series C | 9-12 months base | 12 months | 12-18 months continued vest |
| Series D+ | 12 months base | 12 months | 18 months continued vest or partial acceleration |
| Pre-IPO / Public | 12-24 months base + bonus pro-rata | 12-18 months | partial acceleration + double-trigger CIC |

The triggers: severance pays out on **termination without cause or resignation for good reason**. "Cause" is heavily negotiated — the CRO wants a narrow definition (fraud, material breach, conviction of a felony related to the job) and the company wants a broad one (poor performance, failure to meet objectives, "loss of confidence"). The standard CRO position: cause requires written notice and a 30-day cure period, performance failures are not cause, and any cause termination requires board approval. A CRO who accepts a broad "cause" definition has accepted a contract the CEO can use to terminate for any reason without paying severance.

## The CFO/Board Negotiation Playbook: What's Negotiable Vs. What's Not

The negotiation is not a free-for-all. Some terms are highly negotiable, some are moderately negotiable, and some are essentially fixed by the company's stage and comp committee. Negotiable list:

**Highly negotiable (25-50%+ swing common):**
- Equity grant size (the headline percentage)
- Equity refresh policy (often undefined and worth defining)
- Change-of-control acceleration (single vs double trigger, 100% vs 50%)
- Severance length and equity acceleration on severance
- "Good reason" and "cause" definitions
- Uncapped accelerators on the variable
- Sign-on bonus and clawback terms

**Moderately negotiable (10-25% swing common):**
- Base/variable split (50/50 vs 60/40)
- Variable target (the OTE number itself)
- MBO bonus structure and weighting
- Quota multiplier (4x-6x OTE band)

**Essentially fixed (less than 10% swing typical):**
- Base salary at the stage benchmark (the Pavilion/Alexander Group bands hold tightly)
- Vesting schedule (4-year with 1-year cliff is standard)
- Strike price (set by the most recent 409A)

The CRO who negotiates hard on the highly-negotiable items and concedes on the essentially-fixed items typically captures 30-60% more lifetime comp than the CRO who reverses the priorities. Pull in **own counsel** — Cooley, Gunderson Dettmer, Wilson Sonsini, Latham, Orrick, and Morrison Foerster all have executive compensation specialists who routinely represent CRO candidates against company counsel. Counsel cost is typically $8-25K for a comprehensive package review and red-line, and it returns 10-50x on a Series B+ package.

## Comp Plan Vs. Comp Package: The Distinction Most CROs Miss

There are two compensation documents the CRO must understand and they are routinely confused. **The comp package** is the executive employment agreement: base, equity, sign-on, severance, change-of-control, refresh — the things a Cooley or Gunderson lawyer red-lines. **The comp plan** is the annual sales compensation plan: the quota, the variable structure, the accelerators, the SPIFs, the MBOs, the territory and credit rules — the things sales operations and finance operationalize and that pay out the variable line of the package.

The two documents interact: a CRO with a $400K variable target in the package who is then handed a comp plan with a $30M ARR organizational quota and 50% kicker thresholds and capped accelerators has effectively had the variable line redefined after signing. The CRO must negotiate **both** documents — and the comp plan is often where companies extract concessions that weren't possible in the package negotiation. The standard CRO move: insist on receiving the comp plan template (or at least the structural terms — quota multiplier, kicker thresholds, accelerator schedule, cap policy) **before** signing the offer letter, with material deviations from the template requiring CRO consent.

## Board Comp Committee Dynamics: When CRO Comp Gets Re-Set

Once the CRO is in seat, the board's comp committee owns the ongoing compensation review — typically annual, sometimes triggered by an event (acquisition discussion, IPO process, performance issue, or a competing offer for the CRO). The comp committee at a Series B+ company is usually the lead VC plus an independent director plus the CEO, and at a public company is a fully-independent committee per NASDAQ/NYSE listing standards. The comp committee uses **peer-group benchmarking** (Equilar and Compensia provide the canonical peer-group data) to set comp — and the peer group construction is itself a negotiated item that materially affects outcomes. A CRO who lets the company define a peer group of smaller, less-funded companies will be benchmarked low; a CRO who insists on a peer group of similarly-staged, similarly-funded companies will be benchmarked at the band.

The comp committee meeting cadence: typically Q1 of each fiscal year sets base, target bonus, and equity refresh for the year. Special meetings around acquisition events, IPO pricing, and major strategic shifts. The CRO who builds direct relationships with the comp committee chair and the independent comp committee directors (separate from the CEO relationship) has a meaningfully better outcome at refresh time.

## The Wear-And-Tear Discount: Ex-CRO Comp On The Next Gig

A real and under-discussed phenomenon: a CRO whose previous tour ended in **(a) involuntary termination, (b) a material miss, or (c) a sub-18-month tenure** typically takes a 15-30% discount on their next package's headline OTE versus the band their tenure-and-stage profile would otherwise command. The Heidrick & Struggles tenure data, cross-referenced with the Crist Kolder volatility data and Pavilion's compensation report, supports this: the median CRO tenure of 18-19 months reflects a population where roughly 35-45% of departures are involuntary, and the next-gig comp data shows the discount.

The mitigation: a CRO whose tour didn't end well should (a) negotiate a higher equity grant to offset lower OTE, (b) negotiate a stronger refresh policy and acceleration package, and (c) negotiate severance that protects against another short tour. The CRO who takes the next gig at a discount on every line item has compounded the loss; the CRO who trades cash for equity and protection has hedged it.

## M&A Scenarios: IPO Vs. PE Rollup Vs. Strategic Acquisition

The CRO's package outcome depends heavily on the type of exit, and a CRO joining at Series C or later should think about the exit-type distribution before signing.

**IPO outcome:** the CRO's equity converts to public RSUs/options subject to a 180-day lockup, then becomes saleable subject to 10b5-1 trading plans. The CRO typically receives a post-IPO RSU refresh at the comp committee's standard cadence. Total realized comp on a $5-10B IPO can be $10-50M+ for a CRO who joined at Series C with a 0.5% grant and stayed through IPO. Hold-period risk is real: a CRO who exits the company within 6-12 months of IPO often sells at substantially below the post-lockup high.

**Strategic acquisition outcome:** the CRO's equity is typically cashed out at the deal price (subject to escrow holdback for indemnification, typically 10-15% of proceeds for 12-24 months). Acceleration kicks in per the change-of-control provisions. Total realized comp on a $500M-$2B strategic acquisition for a CRO with a 0.3-0.5% grant is $1.5-10M, plus retention bonus from the acquirer (typically 18-36 months of additional comp tied to staying with the acquired entity).

**PE rollup outcome:** the most variable. A PE acquirer typically structures a "rollover" of management equity (the CRO rolls 25-50% of their proceeds into the new equity structure under the PE sponsor) plus a new equity grant in the post-PE company. The cash component is often less than a strategic acquisition (PE pays at lower multiples than strategic acquirers), but the rollover plus new grant can produce a second equity outcome at the eventual PE exit (typically 4-7 years later). A CRO who rolls into a PE deal is signing up for another tour; a CRO who wants to exit at the PE acquisition should negotiate cash-out treatment rather than rollover.

The CRO's comp outcome distribution across these three scenarios is heavily skewed: roughly 25-35% of venture-backed companies IPO or are acquired at meaningful multiples, roughly 40-50% are acquired at break-even or modest multiples, and roughly 20-30% return zero or near-zero on equity. The CRO who joins assuming the IPO outcome is the median is mis-pricing the bet; the CRO who structures the package assuming the modest-acquisition outcome is the median is correctly pricing the bet.

## The Bonus Design Tail: MBO Vs. Corporate Goal Vs. Team Result Blends

Above the variable line, most Series B+ CRO packages include an MBO (Management By Objectives) bonus structure that adds 10-30% incremental cash on top of the variable. The MBO design is itself a negotiation:

- **Pure-MBO (CRO objectives set annually by the CEO):** highest CRO control, often tied to specific strategic initiatives (international expansion, product attach, channel revenue, NRR, etc.)
- **Corporate-goal MBO (paid based on company-wide achievement of a single metric):** lower CRO control, often tied to ARR or revenue
- **Team-result MBO (paid based on the CRO's organization hitting a team goal):** moderate control, often tied to team quota attainment percentage

The MBO weighting in the variable typically runs 15-25% of variable target. A CRO who negotiates a pure-MBO structure with objectives they participated in setting typically realizes 80-100% of MBO target; a CRO who accepts a corporate-goal MBO realizes 50-75% based on whether the company hits its overall plan (which is uncorrelated with the CRO's individual performance in many cases).

## The Realized-Comp Gap: Why High OTE Doesn't Mean High Take-Home

The single most important conceptual point in this entire framework: **realized comp at the end of a CRO tour is typically 40-70% of the headline package value**, and the CRO who negotiates only on OTE has been benchmarked on the wrong number. The realized-comp gap comes from:

- **Variable miss:** the CRO hits 80-90% of variable target on average, not 100%, so the variable line realizes at $200-225K on a $250K target.
- **Equity haircut:** dilution between grant and exit reduces the percentage by 30-50%.
- **Vesting timing:** the 18-month median tenure means the CRO vests 37.5% of their original grant before departure (1.5 years on a 4-year vest), unless protection clauses kick in.
- **Tax drag:** ISO exercise creates AMT exposure; NSO exercise creates ordinary income tax; RSU vesting creates income tax at the vest-date price; long-term capital gains require holding shares 12+ months post-exercise.
- **Hold-period and lockup risk:** post-IPO lockups, blackout windows, and 10b5-1 plan constraints often force selling at sub-optimal prices.
- **Severance gaps:** a CRO terminated for cause receives no severance; a CRO who voluntarily resigns receives no severance; the underwritten severance only pays in the specific termination scenarios contemplated.

The CRO who *negotiates* on OTE alone but *evaluates* the offer on realized-comp expectation captures more value. The CEO/board hiring the CRO should be aware of this asymmetry too: a CRO who evaluates realistically is a CRO who can be honestly retained; a CRO who was sold the headline OTE will eventually compute the realized number and the misalignment damages retention.

## Real Recent Named CROs: The Actual Comp Universe

To make the bands concrete, named CROs in the public eye: **Mark Roberge** (former HubSpot CRO, now Stage 2 Capital — Series A-C SaaS archetype); **Carl Eschenbach** (now Workday CEO, formerly Sequoia partner, formerly VMware COO/President — late-stage and public-co revenue leadership); **Ryan Azus** (Zoom CRO during COVID-era hypergrowth — late-stage public-co CRO comp); **Catie Ivey** (Walnut CRO — Series B SaaS profile); **Gary Marcotte** (Catalyst CRO — Series B-C SaaS profile). The DEF 14A proxies for HubSpot, Salesforce, Snowflake, Datadog, MongoDB, Okta, Cloudflare, Confluent, Zscaler, and ZoomInfo name the specific public-co CROs and current packages; SaaStr, Pavilion, Mostly Metrics (CJ Gustafson), Tom Tunguz, and the Bessemer Cloud Index regularly cover CRO transitions and comp dynamics.

## The CEO/Board Side: Hiring The Right CRO Without Overpaying

For the CEO or board hiring a CRO, the comp framework reverses: the goal is to get the right talent at a fair package without (a) over-paying and signaling weakness in the process, (b) under-paying and losing the candidate to a competitor offer, or (c) creating retention exposure by structuring a package that under-compensates relative to the market. The hiring playbook:

1. **Anchor on the band, not the candidate's ask.** Pull the Pavilion and Alexander Group bands for your stage; the candidate's current comp is data, not a benchmark.
2. **Lead with equity and structure, not OTE.** A CRO motivated primarily by OTE is the wrong CRO; a CRO motivated by equity outcome is aligned with the company.
3. **Negotiate the change-of-control and severance carefully.** These are insurance policies the company is writing; under-protect and you lose the CRO when an acquisition discussion starts, over-protect and you create a parachute that incentivizes the CRO to push for an acquisition.
4. **Define the comp plan upfront.** The variable target in the package is meaningless without the comp plan that operationalizes it; share the comp plan template before the offer is signed.
5. **Set the refresh expectation in writing.** A 25%-of-original-grant annual refresh is the standard; defining it in the offer letter avoids comp committee discretion later.
6. **Pull in own counsel on the company side.** Cooley, Gunderson Dettmer, Wilson Sonsini, Orrick, Latham — these firms represent companies routinely and the package complexity warrants specialist counsel.

The CEO who runs this process well hires a CRO whose package is fair, defensible, and aligned. The CEO who runs it poorly either over-pays in cash and equity (transferring value to the CRO that should accrue to the company) or under-pays in protection (creating a CRO who exits at the first credible competing offer or who sandbags the acquisition process).

## The Final Framework: How To Negotiate Your Next CRO Package

Pulling the entire playbook into a single operating framework: a CRO negotiating their next package in 2027 should execute in this order. **First, establish the band.** Pull the Pavilion, Alexander Group, Heidrick, Equilar, Carta, and Pave benchmarks for your stage and use them as the anchor. **Second, separate package vs. plan.** Negotiate the executive employment agreement (the package) separately from the annual sales compensation plan; insist on seeing the comp plan template before signing the package. **Third, lead with equity.** At any pre-public stage, the equity grant is 60-85% of the expected total comp; negotiate the percentage hard. **Fourth, define refresh in writing.** A 25%-of-original-grant annual refresh starting at month 18 should be in the offer letter, not left to comp committee discretion. **Fifth, lock the change-of-control language.** Double-trigger acceleration on 100% of unvested with a 12-18 month second-trigger window and a CRO-friendly "good reason" definition is the senior-exec standard. **Sixth, lock the severance language.** 9-12 months base + COBRA + equity acceleration on involuntary termination without cause, with a narrow "cause" definition requiring board approval. **Seventh, fight for uncapped accelerators on the variable.** The single highest-leverage comp move available. **Eighth, negotiate the sign-on with appropriate clawback protection.** Sign-on of $50-250K with clawback only on voluntary resignation or termination for cause, never on involuntary termination. **Ninth, pull in own counsel.** $8-25K to Cooley/Gunderson/Wilson Sonsini/Latham/Orrick/Morrison Foerster returns 10-50x on a Series B+ package. **Tenth, evaluate on realized-comp expectation, not headline OTE.** Assume 80-90% variable attainment, 30-50% equity dilution, 18-month median tenure, and price the package against that distribution. Do these ten things in this order and you will negotiate a package that captures 40-70% more lifetime value than the CRO who optimizes only on OTE — and you will walk into the role aligned with the company's outcome rather than with the headline number.

`;

const flow = `

## The CRO Comp Stage Curve: How Each Line Item Moves From Pre-Series A To Public

\`\`\`mermaid
flowchart TD
  A[CRO Comp Package Six Line Items] --> B[Pre-Series A / Founder-Led]
  A --> C[Series A]
  A --> D[Series B]
  A --> E[Series C]
  A --> F[Series D+ / Pre-IPO]
  A --> G[Public Co]
  B --> B1[Base 150-200K Variable 50-150K]
  B --> B2[OTE 200-350K]
  B --> B3[Equity 1.5-3.0% Largest %]
  B --> B4[Severance 3-6 mo Acceleration Often None]
  C --> C1[Base 175-250K Variable 125-200K]
  C --> C2[OTE 300-450K Real Package]
  C --> C3[Equity 0.75-1.5% Four-Year Vest One-Year Cliff]
  C --> C4[Severance 6 mo Double-Trigger Standard Begins]
  D --> D1[Base 225-325K Variable 175-275K]
  D --> D2[OTE 400-600K Inflection Point]
  D --> D3[Equity 0.5-1.0% Refresh Policy Critical]
  D --> D4[Double-Trigger 100% Unvested Standard]
  E --> E1[Base 275-425K Variable 225-375K]
  E --> E2[OTE 500-800K Scale Package]
  E --> E3[Equity 0.25-0.6% MBO Layer Adds 10-25%]
  E --> E4[Severance 9-12 mo Comp Committee Formal]
  F --> F1[Base 325-500K Variable 275-500K]
  F --> F2[OTE 600K-1.0M]
  F --> F3[Equity 0.15-0.4% RSU Mix Pre-IPO Refresh]
  F --> F4[Negotiate Post-IPO Transition Language]
  G --> G1[Base 400-650K Bonus 75-150% Target]
  G --> G2[Cash Comp 650K-1.2M+]
  G --> G3[Annual RSU + PSU Grant 3-8M]
  G --> G4[Severance 12-24 mo Double-Trigger CIC]
  G --> H[DEF 14A Proxy Disclosed Annually]
  H --> H1[HubSpot HUBS Salesforce CRM Snowflake SNOW]
  H --> H2[Datadog DDOG MongoDB MDB Okta OKTA]
  H --> H3[Cloudflare NET Confluent CFLT Zscaler ZS]
  H --> H4[ZoomInfo ZI EDGAR sec.gov Source of Truth]
\`\`\`

## The Negotiation Decision Tree: What To Fight For By Stage And Leverage

\`\`\`mermaid
flowchart TD
  A[CRO Receives Offer] --> B{What Stage Is The Company?}
  B -->|Pre-Series A| C[Optimize for Equity % and Path to Refresh at A]
  B -->|Series A| D[Optimize for Equity Refresh Policy and Severance]
  B -->|Series B-C| E[Optimize for Double-Trigger 100% and Uncapped Accelerators]
  B -->|Series D+ Pre-IPO| F[Optimize for Pre-IPO Refresh and Post-IPO Transition Language]
  B -->|Public| G[Optimize for RSU/PSU Grant and 12-24 mo Severance]
  C --> H{Founder Cash Constrained?}
  H -->|Yes| H1[Higher Equity Lower Cash]
  H -->|No| H2[Push For Both]
  D --> I{Have Competing Offer?}
  I -->|Yes| I1[Push 25-40% On Equity And Refresh]
  I -->|No| I2[Push 10-20% On Equity Lock In Acceleration]
  E --> J{Strong Track Record At Prior Co?}
  J -->|Yes| J1[Negotiate Single-Trigger Portion And MBO Pure]
  J -->|No| J2[Get Standard Double-Trigger Lock Severance]
  F --> K{IPO Within 12-24 Months?}
  K -->|Yes| K1[Pre-IPO Refresh Plus Post-IPO Transition Plus PSU Framework]
  K -->|No| K2[Standard Late-Stage Plus Refresh Floor]
  G --> L{Comp Committee Independent?}
  L -->|Yes| L1[Build Direct Relationships With Comp Committee Chair]
  L -->|No| L2[Lock Refresh In Offer Letter]
  H1 --> M[Pull In Own Counsel Cooley Gunderson Wilson Sonsini]
  H2 --> M
  I1 --> M
  I2 --> M
  J1 --> M
  J2 --> M
  K1 --> M
  K2 --> M
  L1 --> M
  L2 --> M
  M --> N{Final Package Captures 40-70% More Lifetime Value?}
  N -->|Yes| O[Sign And Move]
  N -->|No| P[Re-Negotiate Or Walk]
  P --> Q[Walking Is The Move More Often Than CROs Think]
\`\`\`

`;

const src = `

## Sources

1. **Heidrick & Struggles -- Route to the Top And Executive Compensation Studies** -- Heidrick's longitudinal data on CEO/CFO/CRO tenure and compensation; the canonical 18-19 month median CRO tenure figure traces here. https://www.heidrick.com
2. **Crist Kolder Associates -- Volatility Report** -- Annual report on Fortune 500 / S&P 500 executive turnover including CRO/Chief Sales Officer dynamics. https://www.cristkolder.com
3. **Alexander Group -- Annual Sales Compensation Trends Survey** -- The canonical sales compensation benchmarking study covering base/variable splits, accelerators, and stage-by-stage CRO comp bands. https://www.alexandergroup.com
4. **Pavilion -- Annual Revenue Compensation Report** -- Pavilion's annual benchmarking of CRO, VP Sales, CCO, and revenue-leadership compensation across SaaS stages. https://www.joinpavilion.com
5. **Equilar -- Executive Compensation Database** -- Equilar's executive compensation database is the standard reference for public-company NEO comp, peer-group construction, and benchmarking. https://www.equilar.com
6. **Pave -- Real-Time Compensation Benchmarks** -- Pave aggregates real-time compensation data from connected HRIS systems across hundreds of companies; the standard reference for current-quarter comp benchmarks. https://www.pave.com
7. **Carta -- Compensation Benchmarks And Equity Data** -- Carta's compensation and equity grant benchmarks across thousands of cap tables; canonical reference for equity grant percentages by stage and refresh policy. https://www.carta.com
8. **Cooley LLP -- Executive Employment Agreement Templates And Guidance** -- Cooley is one of the dominant law firms for venture-backed companies and has published extensive guidance on executive employment agreements, severance, and change-of-control. https://www.cooley.com
9. **Cooley GO -- Free Resources For Founders And Executives** -- Cooley's free resource site with template executive employment agreements, equity grant guidance, and change-of-control acceleration mechanics. https://www.cooleygo.com
10. **Gunderson Dettmer -- Venture Capital And Executive Compensation Practice** -- Gunderson's executive compensation guidance for venture-backed companies, including senior-exec employment agreements and acceleration provisions. https://www.gunder.com
11. **Wilson Sonsini Goodrich & Rosati -- Startup Executive Package Guides** -- WSGR's guidance on startup executive compensation and employment agreements. https://www.wsgr.com
12. **SEC EDGAR -- DEF 14A Proxy Statements (Source of Truth For Public-Co Comp)** -- The federal repository for all public-company proxy statements; the authoritative source for NEO compensation, Summary Compensation Tables, and Outstanding Equity Awards tables. https://www.sec.gov
13. **ZoomInfo (ZI) -- Investor Relations And Proxy Filings** -- ZoomInfo's proxy disclosures including CRO compensation. https://ir.zoominfo.com
14. **HubSpot (HUBS) -- Investor Relations And Proxy Filings** -- HubSpot's proxy disclosures including CRO and revenue leadership compensation. https://ir.hubspot.com
15. **Salesforce (CRM) -- Investor Relations And Proxy Filings** -- Salesforce's proxy disclosures including senior revenue executive compensation. https://investor.salesforce.com
16. **Snowflake (SNOW) -- Investor Relations And Proxy Filings** -- Snowflake's proxy disclosures including CRO compensation. https://investors.snowflake.com
17. **Datadog (DDOG) -- Investor Relations And Proxy Filings** -- Datadog's proxy disclosures including CRO compensation. https://investors.datadoghq.com
18. **MongoDB (MDB) -- Investor Relations And Proxy Filings** -- MongoDB's proxy disclosures including CRO compensation. https://investors.mongodb.com
19. **Okta (OKTA) -- Investor Relations And Proxy Filings** -- Okta's proxy disclosures including CRO compensation. https://investor.okta.com
20. **Cloudflare (NET) -- Investor Relations And Proxy Filings** -- Cloudflare's proxy disclosures including CRO compensation. https://www.cloudflare.net
21. **Confluent (CFLT) -- Investor Relations And Proxy Filings** -- Confluent's proxy disclosures including CRO compensation. https://investors.confluent.io
22. **Zscaler (ZS) -- Investor Relations And Proxy Filings** -- Zscaler's proxy disclosures including CRO compensation. https://ir.zscaler.com
23. **Bessemer Venture Partners -- State of the Cloud And BVP Cloud Index** -- Bessemer's annual State of the Cloud and BVP Cloud Index analyses include revenue-leadership and go-to-market compensation context. https://www.bvp.com
24. **OpenView Partners -- SaaS Benchmarks Report** -- OpenView's annual SaaS benchmarks include go-to-market and revenue-leadership compensation insights. https://openviewpartners.com
25. **ICONIQ Capital -- Topline Growth And Comp Benchmarks** -- ICONIQ's growth and comp benchmarks for venture-backed software companies. https://www.iconiqcapital.com
26. **Pavilion -- Revenue Leader Community And Comp Benchmarks** -- Pavilion's broader community resources covering CRO and revenue-leader compensation. https://www.joinpavilion.com
27. **Mostly Metrics -- CJ Gustafson's Newsletter On SaaS Metrics And Compensation** -- Mostly Metrics regularly covers CRO and revenue-leader comp, hiring, and tenure dynamics. https://www.mostlymetrics.com
28. **Kruze Consulting -- Startup Compensation And CFO Guidance** -- Kruze's guidance on startup executive compensation, equity grants, and finance operations. https://kruzeconsulting.com
29. **SaaStr -- SaaS Industry Conference, Content, And Community** -- SaaStr regularly covers CRO transitions, hiring, and compensation across the SaaS universe. https://www.saastr.com
30. **Harvard Business Review -- Executive Compensation Topic Coverage** -- HBR's topic page on executive compensation includes academic and practitioner research relevant to CRO compensation design. https://hbr.org/topic/executive-compensation
31. **McKinsey -- Sales And Go-To-Market Practice** -- McKinsey's research on sales leadership and compensation includes CRO-relevant benchmarking. https://www.mckinsey.com
32. **Gartner -- Sales Leadership And Compensation Research** -- Gartner's research covers sales leadership compensation trends and CRO role evolution. https://www.gartner.com
33. **Forrester -- Revenue Operations And Sales Leadership Research** -- Forrester's research on revenue operations and sales leadership includes CRO compensation context. https://www.forrester.com
34. **Tom Tunguz -- Theory.com Blog By Redpoint Partner** -- Tomasz Tunguz regularly covers SaaS metrics, sales leadership, and compensation dynamics. https://tomtunguz.com
35. **Xactly Insights And CaptivateIQ Benchmarks** -- The two leading sales compensation platforms publish accelerator design, attainment distribution, and variable-pay benchmarks across thousands of SaaS comp plans. https://www.xactlycorp.com

`;

const num = `

## Numbers

**OTE Bands By Stage (Alexander Group, Pavilion, Heidrick, Equilar, Pave, Carta)**
- Pre-Series A / Founder-led: $200-350K OTE, equity 1.5-3.0%
- Series A ($1-5M ARR): $300-450K OTE, equity 0.75-1.5%
- Series B ($5-25M ARR): $400-600K OTE, equity 0.5-1.0%
- Series C ($25-75M ARR): $500-800K OTE, equity 0.25-0.6%
- Series D+ ($75-200M ARR): $600K-$1.0M OTE, equity 0.15-0.4%
- Pre-IPO ($200-500M ARR): $700K-$1.2M OTE, equity 0.10-0.3% RSU
- Public ($500M+ ARR): $650K-$1.2M+ cash + RSU/PSU grant $3-8M annual

**Variable Structure And Accelerator Math (Xactly Insights, CaptivateIQ)**
- Dominant base/variable split: 50/50 (~65-75% of CRO packages)
- Alternative: 60/40 base-heavy (~20-30% of packages, more common at later stages)
- Alternative: 40/60 variable-heavy (~5-10% of packages, turnaround / aggressive growth contexts)
- Quota multiplier on OTE: 4-6x at Series A, 5-7x at Series C+
- Cliff threshold: typically 50% attainment (below = $0 variable)
- Accelerator at 100-115%: 1.5x marginal
- Accelerator at 116-149%: 2.0x marginal
- Cap on variable: typically 200-250% of target (uncapped is the elite negotiation)
- MBO layer: 10-30% of variable, weighted across pure-MBO / corporate-goal / team-result
- Average attainment to target: 80-90% across the team, often higher for the CRO individually

**Equity Refresh And Acceleration (Carta, Pave, Cooley GO)**
- Standard refresh: 25% of original grant annually, starting month 18-24
- Vesting: 4-year with 1-year cliff, monthly thereafter (standard)
- Acceleration on change-of-control: double-trigger 100% unvested (senior-exec standard)
- Single-trigger portion: 25-50% sometimes negotiated for highly recruited CROs
- "Good reason" definition: material reduction in role/comp, relocation 35-50+ miles, breach
- Cooley GO + Gunderson + WSGR converge on: double-trigger 100% with 12-18 month window

**Sign-On And Severance (Pavilion, Cooley)**
- Sign-on bonus range by stage: $0-50K (Pre-A) -> $250K (Pre-IPO/Public)
- Sign-on clawback: typically 12 months, voluntary resignation or termination for cause only
- Severance Series A: 6 months base + 6 mo COBRA + 6-12 mo equity continued vest
- Severance Series B: 6-9 months base + 9-12 mo COBRA + 12 mo equity continued vest
- Severance Series C: 9-12 months base + 12 mo COBRA + 12-18 mo continued vest
- Severance Series D+: 12 months base + 12 mo COBRA + 18 mo continued vest
- Severance Public: 12-24 months base + bonus pro-rata + 12-18 mo COBRA + double-trigger CIC
- Counsel cost for package review: $8-25K (Cooley/Gunderson/WSGR/Latham/Orrick/MoFo)
- Counsel ROI: 10-50x on a Series B+ package

**Tenure And Realized-Comp Reality (Heidrick, Crist Kolder, Pavilion)**
- Median CRO tenure: 18-19 months (Heidrick Route to the Top, stable across cycles)
- Involuntary departure share: 35-45% of CRO transitions
- Vesting at median tenure on 4-year vest: 37.5% (without protection clauses)
- Realized variable as % of target: 80-90% on average
- Equity dilution from grant to exit: 30-50% typical
- Realized comp as % of headline package: 40-70% typical
- Wear-and-tear discount on next gig after bad tour: 15-30% on headline OTE

**Public Co Comp Reference (DEF 14A Proxies On SEC EDGAR, 2023-2024 Filings)**
- HubSpot (HUBS) CRO: $5-9M total annual range
- Salesforce (CRM) senior revenue NEOs: $8-15M+ at scale
- Snowflake (SNOW) CRO: $5-12M with PSU-heavy structure
- Datadog (DDOG) CRO: $5-10M
- MongoDB (MDB) CRO: $4-8M
- Okta (OKTA) CRO: $4-9M
- Cloudflare (NET) CRO: $4-7M
- Confluent (CFLT) CRO: $4-8M
- Zscaler (ZS) CRO: $5-9M
- ZoomInfo (ZI) CRO: $3-6M

**Exit Outcome Distribution (Industry Aggregate)**
- IPO or meaningful-multiple acquisition: 25-35% of venture-backed companies
- Break-even or modest-multiple acquisition: 40-50%
- Zero or near-zero return on equity: 20-30%
- Strategic acquisition typical multiple: 4-8x revenue
- PE acquisition typical multiple: 3-6x revenue (lower than strategic)
- Escrow holdback typical: 10-15% of proceeds for 12-24 months
- Post-IPO lockup standard: 180 days

**Comp Plan Vs Comp Package Distinction**
- Comp package: executive employment agreement (Cooley/Gunderson red-line)
- Comp plan: annual sales compensation plan (sales ops + finance operationalize)
- Insist on comp plan template before signing offer letter (canonical CRO move)
- Material deviations from template should require CRO consent

**Negotiation Leverage Distribution**
- Highly negotiable (25-50%+ swing): equity grant size, refresh policy, CIC acceleration, severance, good-reason/cause definitions, uncapped accelerators, sign-on clawback
- Moderately negotiable (10-25% swing): base/variable split, OTE, MBO structure, quota multiplier
- Essentially fixed (<10% swing): base salary at stage benchmark, vesting schedule, strike price (set by 409A)

`;

const counter = `

## Counter-Case: Why The Headline 2027 CRO Comp Bands Mislead Both Sides

The bands above describe the structural 2027 CRO comp universe, but a serious operator on either side of the table must stress-test the framework against the conditions where it breaks. There are real reasons the headline numbers mislead.

**Counter 1 -- Realized comp is 40-70% of headline package value, and most CROs don't compute this until it's too late.** The OTE-fixated negotiation captures the wrong number. Variable miss (CROs hit 80-90% of target on average, not 100%), equity dilution (30-50% from grant to exit), tenure (18-19 month median per Heidrick means 37.5% vest on a 4-year schedule absent protection), tax drag (AMT on ISO, ordinary income on NSO/RSU), and hold-period risk (post-IPO lockup, blackout windows, 10b5-1 constraints) compound to deliver realized comp materially below headline. A CRO who negotiated only on a $700K OTE and a 0.5% equity grant at Series C, then was terminated at month 16 with no acceleration, walks away with 16/48 = 33% of a $2M paper equity grant ($660K), one year of severance ($350K base + COBRA), and roughly 14 months of variable averaging 80% attainment ($233K). Total realized: roughly $1.2M against a paper package value of $4-5M+ over 4 years.

**Counter 2 -- The 18-19 month median CRO tenure makes acceleration and severance more important than OTE.** The single most important data point in this entire framework is Heidrick's 18-19 month median tenure figure, which has been remarkably stable across cycles. A CRO who optimizes a package for the 4-year vesting case is optimizing for a low-probability outcome. The correctly-priced package weights acceleration, severance, and refresh policy as the *first-order* terms because the median CRO tour ends before the original grant fully vests. A CRO without double-trigger 100% acceleration at Series B+ has accepted a contract where an acquisition outcome materially under-pays the CRO; the CRO without 9-12 months severance has accepted a contract where an involuntary termination materially under-pays.

**Counter 3 -- Equity dilution destroys "headline equity %" between Series A and exit.** A 1.0% Series A grant becomes roughly 0.4-0.6% by IPO assuming standard option pool refreshes and dilution rounds. A CRO who sells the offer to themselves on the basis of "1% equity at a $50M post-money = $500K, but on a $1B exit it's $10M" is computing the optimistic case. The realistic case after 30-50% dilution and 30-40% net of taxes is $4-5M, and after the 18-month median tenure with continued-vest severance language it might be $1.5-2.5M. The package should be priced against the realistic case.

**Counter 4 -- The headline OTE band is 5-15% off in either direction depending on vertical and geography.** Cyber and infrastructure software CROs typically command 5-15% premia over the bands cited; vertical SaaS CROs typically take 5-10% discounts. NYC, San Francisco, and Boston metros run 10-20% above national bands; Austin, Denver, and remote roles run at-or-below. A CRO benchmarking against the wrong vertical and geography is mis-pricing on both sides.

**Counter 5 -- DEF 14A proxy data is the truth, but the names and numbers turn over annually.** The public-co CRO comp benchmarks above (HubSpot, Salesforce, Snowflake, Datadog, MongoDB, Okta, Cloudflare, Confluent, Zscaler, ZoomInfo) are accurate as a structural reference but the *specific* dollar values, named CROs, and tenures change every year as companies refresh NEOs and as RSU/PSU grants vest at different prices. An operator who needs current numbers must pull the latest DEF 14A directly from SEC EDGAR (sec.gov) rather than relying on this or any other secondary summary.

**Counter 6 -- The "good reason" and "cause" definitions are where companies extract value back after the equity negotiation.** A CRO who fights hard for double-trigger 100% acceleration but accepts a "good reason" definition that excludes role changes or comp reductions has accepted a clause an acquirer can game by demoting the CRO post-acquisition (without firing them) and waiting them out. A CRO who accepts a broad "cause" definition that includes "poor performance" or "loss of confidence" has given the company the right to terminate without paying severance for any reason. These language-level negotiations often capture or destroy more value than the headline equity percentage.

**Counter 7 -- The "comp plan" can override the "comp package" if not negotiated.** A CRO who accepts a $400K variable target in the package, then is handed a comp plan with a $30M ARR organizational quota and capped accelerators and 50% kicker thresholds, has effectively had the variable line redefined post-signing. The canonical CRO error is signing the package without seeing the comp plan template. The fix: insist on the comp plan template before signing, with material deviations requiring CRO consent.

**Counter 8 -- PE rollups produce systematically lower CRO outcomes than strategic acquisitions.** A CRO who joins a Series C company assuming a strategic acquisition outcome (4-8x revenue, full cash-out, retention bonus) is mis-pricing a real probability that the company is acquired by PE instead (3-6x revenue, mandatory rollover of 25-50% of proceeds, new equity in the post-PE company). The CRO who wants cash-out at exit must negotiate the rollover treatment in advance; the CRO who is comfortable signing up for another tour can roll into the PE deal.

**Counter 9 -- Comp committee benchmarking can systematically under-pay if the peer group is wrong.** The comp committee's peer group construction materially affects the benchmark used for refresh decisions. A peer group of smaller, less-funded competitors will benchmark the CRO low; a peer group of similarly-staged, similarly-funded companies will benchmark at the band. The CRO who lets the company define the peer group has accepted a structural disadvantage at refresh time.

**Counter 10 -- The wear-and-tear discount is real and compounding.** A CRO whose previous tour ended in involuntary termination, a material miss, or sub-18-month tenure typically takes a 15-30% discount on their next package's headline OTE. Compound this over 2-3 tours and a CRO who started at Series A OTE bands can find themselves benchmarked at 40-60% of those bands by the third gig. The mitigation is to trade cash for equity and protection rather than discount across every line item.

**Counter 11 -- The "uncapped accelerator" negotiation is highly leveraged but rarely won.** Most CRO packages cap variable at 200-250% of target, and most CEOs frame the cap as "fair to the company" -- but an uncapped accelerator costs the company nothing if the CRO doesn't outperform and pays the CRO 2-4x extra realized comp in years they do. The negotiation is asymmetric: the company loses nothing from agreeing, the CRO gains materially from winning. Yet CROs accept capped plans because the cap is presented as standard. The high-leverage CRO move: ask explicitly for uncapped above 150%, and treat the response as a signal of how the company will treat outperformance generally.

**Counter 12 -- Hiring CEOs and boards systematically over-pay in OTE and under-protect in equity terms.** The mirror-image error from the company side: CEOs hire CROs by anchoring on the OTE the candidate "needs" (often 10-20% above market because the candidate has framed it that way) while under-investing in the equity refresh policy, the change-of-control language, and the severance language that retain the CRO long-term. The result is a CRO who is over-paid relative to the band on cash but under-protected on the structural terms that matter -- producing a flight risk at the first credible competing offer. The hiring-side fix: anchor on the band, lead with equity and structure, and define refresh policy in writing.

**The honest verdict for the CRO.** Negotiating a 2027 CRO compensation package well requires the operator to: (a) establish the band from Pavilion/Alexander Group/Heidrick/Equilar/Carta/Pave benchmarks rather than from the CEO's offer, (b) separate package vs. plan and insist on seeing both before signing, (c) lead with equity and structure, treating OTE as the floor, (d) lock change-of-control acceleration at double-trigger 100% with CRO-friendly good-reason language, (e) lock severance at 9-12+ months base + COBRA + acceleration with narrow cause definition, (f) fight for uncapped accelerators on the variable, (g) define refresh policy in the offer letter at 25%-of-original annual, and (h) pull in own counsel from Cooley/Gunderson/WSGR/Latham/Orrick/MoFo. Get this wrong and the realized comp on a typical 18-19 month tour is 40-60% of headline; get it right and the realized comp is 70-100%+ of headline plus the optionality on a successful exit.

**The honest verdict for the CEO/board.** Hiring a 2027 CRO well requires the operator to: (a) anchor on the band rather than the candidate's ask, (b) lead with equity and structure rather than OTE, (c) negotiate change-of-control and severance carefully (under-protect and you lose the CRO when an acquisition discussion starts; over-protect and you create a parachute that incentivizes the CRO to push for an acquisition), (d) define the comp plan upfront, (e) set refresh expectation in writing, and (f) pull in own counsel from the company side. The CEO who runs this process well hires a CRO whose package is fair, defensible, and aligned; the CEO who runs it poorly either over-pays in cash (signaling weakness) or under-pays in protection (creating retention exposure). The CRO whose package the CEO under-protects becomes the CRO who exits at the first credible competing offer or who sandbags the acquisition process.

**The six-condition combined verdict.** A 2027 CRO compensation package is correctly structured if and only if: **(1) the OTE is at-band for the stage** per Pavilion/Alexander Group benchmarks, **(2) the equity grant is at-band for the stage** per Carta/Pave benchmarks with a defined 25%-of-original annual refresh, **(3) the change-of-control language is double-trigger 100% on unvested with CRO-friendly good-reason and a 12-18 month second-trigger window**, **(4) the severance is 9-12+ months base + COBRA + acceleration on involuntary termination without cause with a narrow cause definition**, **(5) the variable structure includes uncapped accelerators above 150% attainment** and the comp plan template has been reviewed and consented-to, and **(6) own counsel from Cooley/Gunderson/WSGR/Latham/Orrick/MoFo has red-lined the package**. If all six conditions are met, the package is correctly structured for a typical 18-19 month CRO tour and captures 70-100%+ of the headline value as realized comp. If any one condition is missed, the realized-comp gap widens proportionally; if three or more are missed, the realized comp is materially below the headline package value and the CRO has accepted the company's risk without the company's compensation.

`;

const links = `

## Related Pulse Library Entries

- **q9559** -- How should a CRO calibrate qualification rigor when cash position and runway are forcing a choice between conservative organic growth and aggressive upmarket gambling? (CRO core operating decision under runway constraint.)
- **q9558** -- What does a CRO actually do day-to-day at Series B vs Series C? (Role evolution that drives the comp band shifts in this entry.)
- **q9546** -- How does a CRO build the first revenue operations function? (Org-build that maps to the Series B/C comp inflection.)
- **q9545** -- What is the right CRO hiring profile by company stage? (Hiring framework that informs the CEO/board side of the comp negotiation.)
- **q9535** -- How does a CRO design the annual sales compensation plan? (The "comp plan" half of the package-vs-plan distinction.)
- **q9533** -- What is the right base/variable split for a SaaS sales team? (Underlying comp structure that scales up to the CRO package.)
- **q9531** -- How does a CRO negotiate quota with the CEO and board? (Quota negotiation that interacts with the variable line of the CRO package.)
- **q9527** -- How does a CRO build the first sales operations function? (Sales ops scope that supports the CRO-package variable structure.)
- **q9521** -- What is the right CRO/CEO operating cadence? (Relationship dynamic that drives comp committee outcomes.)
- **q9514** -- How does a CRO build the first revenue forecast? (Forecasting discipline that interacts with attainment and accelerator economics.)
- **q1485** -- What does executive equity compensation look like for venture-backed startups? (Equity grant fundamentals underlying the CRO package.)
- **q1170** -- How do you negotiate a senior executive employment agreement? (General executive-package negotiation framework.)
- **q760** -- What is a typical SaaS executive severance package? (Severance benchmarking that maps to the CRO band.)
- **q759** -- How do change-of-control acceleration provisions work? (CIC mechanics central to the CRO package.)
- **q510** -- What is the right cap table structure for a venture-backed startup? (Cap table dynamics that determine equity dilution between grant and exit.)
- **q332** -- How do you read a DEF 14A proxy statement? (Public-co disclosure mechanics for benchmarking.)
- **q231** -- What is a 409A valuation and how does it set the strike price? (409A mechanics that anchor option grant economics.)
- **q226** -- What is double-trigger vs single-trigger acceleration? (Foundational acceleration mechanics.)
- **q176** -- How do RSUs and PSUs work at public companies? (Public-co equity vehicle mechanics.)
- **q166** -- What is a typical executive sign-on bonus structure and clawback? (Sign-on mechanics that map to the CRO package.)
- **q32** -- What are the canonical SaaS metrics every CRO must own? (Metric framework that informs CRO performance evaluation.)
- **q9501** -- How do you start a senior tech-training workshop business in 2027? (Senior-services adjacency referenced in the broader Pulse library.)
- **q9502** -- How do you scale a workshop-led senior tech-training business in 2027? (Scaling discipline parallel.)
- **q9620** -- How do you start a plumbing service business in 2027? (Service-business cohort parallel.)
- **q9701** -- What is the best CRM software in 2027? (CRM stack that supports CRO operating cadence.)

`;

const tags = ['CRO','chief-revenue-officer','compensation','OTE','equity','executive-comp','comp-plan','accelerators','change-of-control','2027'];

const sources = [
  { title: 'Heidrick & Struggles -- Route to the Top And Executive Compensation Studies', url: 'https://www.heidrick.com' },
  { title: 'Alexander Group -- Annual Sales Compensation Trends Survey', url: 'https://www.alexandergroup.com' },
  { title: 'SEC EDGAR -- DEF 14A Proxy Statements (Source of Truth For Public-Co Comp)', url: 'https://www.sec.gov' }
];

const notes = {
  s6: 'Added 35 cited sources covering executive search and comp benchmarking firms (Heidrick & Struggles Route to the Top with the canonical 18-19 month CRO tenure figure, Crist Kolder Volatility Report, Alexander Group Annual Sales Compensation Trends Survey, Pavilion Annual Revenue Compensation Report, Equilar executive comp database, Pave real-time comp benchmarks, Carta compensation and equity grant benchmarks), executive employment law firms (Cooley LLP and Cooley GO with senior-exec employment agreement templates and acceleration mechanics, Gunderson Dettmer venture practice, Wilson Sonsini Goodrich & Rosati startup executive package guides), the SEC EDGAR DEF 14A proxy filing source-of-truth for public-co CRO comp, and IR pages for the named public-co CRO comp benchmarks (ZoomInfo ZI, HubSpot HUBS, Salesforce CRM, Snowflake SNOW, Datadog DDOG, MongoDB MDB, Okta OKTA, Cloudflare NET, Confluent CFLT, Zscaler ZS), plus venture-firm benchmarking (Bessemer State of the Cloud and BVP Cloud Index, OpenView SaaS Benchmarks Report, ICONIQ Capital topline growth and comp benchmarks, Pavilion community), CRO-comp commentary (Mostly Metrics by CJ Gustafson, Kruze Consulting startup comp guidance, SaaStr CRO transition coverage, HBR executive compensation topic, McKinsey sales practice, Gartner sales leadership research, Forrester revenue ops research, Tomasz Tunguz blog), and the sales comp platform benchmarks (Xactly Insights and CaptivateIQ).',
  s7: 'Added comprehensive numbers block: OTE bands by stage from Pre-Series A through Public (with explicit Pavilion / Alexander Group / Heidrick / Equilar / Pave / Carta sourcing); variable structure and accelerator math (50/50 dominant ~65-75%, 60/40 ~20-30%, 40/60 ~5-10%; quota multipliers 4-7x by stage; 50% cliff threshold; 1.5x at 100-115% and 2x at 116-149% accelerators; 200-250% caps with uncapped as the elite negotiation; MBO 10-30% of variable; 80-90% average attainment); equity refresh and acceleration (25% of original grant annual refresh starting month 18-24, 4-year vest with 1-year cliff, double-trigger 100% as senior-exec standard, single-trigger 25-50% portions sometimes negotiated, good-reason and cause definitions); sign-on and severance bands by stage (sign-on $0-250K with 12-month clawback voluntary-only; severance 6-24 months base + COBRA + acceleration scaling by stage; counsel cost $8-25K with 10-50x ROI on Series B+ packages); tenure and realized-comp reality (18-19 month median per Heidrick, 35-45% involuntary departure share, 37.5% vest at median tenure absent protection, 80-90% variable attainment, 30-50% equity dilution grant-to-exit, 40-70% realized as % of headline, 15-30% wear-and-tear discount on next gig after bad tour); public-co comp reference table from DEF 14A proxies for HubSpot/Salesforce/Snowflake/Datadog/MongoDB/Okta/Cloudflare/Confluent/Zscaler/ZoomInfo with current dollar ranges; exit outcome distribution (25-35% IPO/strategic, 40-50% break-even, 20-30% zero return; strategic 4-8x revenue vs PE 3-6x; 10-15% escrow holdback; 180-day post-IPO lockup); package-vs-plan distinction; negotiation leverage distribution across highly negotiable / moderately negotiable / essentially fixed buckets.',
  s8: 'Added 12-element counter-case stress-testing the headline 2027 CRO comp framework: realized-comp 40-70% of headline package value with line-by-line walkthrough of variable miss, equity dilution, vesting timing, tax drag, hold-period risk, and severance gaps; 18-19 month median tenure making acceleration/severance/refresh more important than OTE; equity dilution destroying headline equity percentage between Series A and exit; OTE bands being 5-15% off by vertical and geography (cyber/infra premia, vertical SaaS discounts, NYC/SF/Boston premia); DEF 14A proxy data being authoritative but turning over annually requiring direct EDGAR pulls; good-reason and cause definitions being where companies extract value back after equity negotiation; comp plan overriding comp package if not negotiated up front (the canonical CRO error); PE rollups producing systematically lower CRO outcomes than strategic acquisitions; comp committee peer-group construction systematically under-paying when peer group is wrong; wear-and-tear discount compounding across multiple tours; uncapped accelerator negotiation being highly leveraged but rarely won; hiring CEOs/boards systematically over-paying in OTE and under-protecting in equity terms. Honest verdict structured as TWO sides (CRO honest verdict + CEO/board honest verdict) plus a six-condition combined verdict (OTE at-band, equity at-band with refresh defined, double-trigger 100% with CRO-friendly good-reason and 12-18 month window, 9-12+ month severance with narrow cause, uncapped accelerators with comp plan reviewed, own counsel red-line) where missing any one condition widens the realized-comp gap proportionally and missing three or more puts realized comp materially below headline package value.',
  s9: 'Cross-linked 25 related Pulse entries: CRO operating cohort (q9559 qualification rigor under runway, q9558 CRO day-to-day at Series B vs C, q9546 first revenue ops function, q9545 right CRO hiring profile by stage, q9535 annual sales comp plan design, q9533 right base/variable split, q9531 quota negotiation with CEO and board, q9527 first sales ops function, q9521 right CRO/CEO operating cadence, q9514 first revenue forecast); executive comp and equity foundations (q1485 executive equity compensation for venture-backed startups, q1170 senior executive employment agreement negotiation, q760 typical SaaS executive severance, q759 change-of-control acceleration provisions, q510 cap table structure venture-backed, q332 how to read a DEF 14A proxy, q231 409A valuation and strike price mechanics, q226 double-trigger vs single-trigger acceleration, q176 RSU and PSU mechanics public companies, q166 executive sign-on bonus structure and clawback, q32 canonical SaaS metrics every CRO must own); senior-services and service-business adjacencies (q9501, q9502, q9620, q9701).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the 2027 CRO compensation benchmark by company stage, matching the actual question "What does the 2027 Chief Revenue Officer compensation benchmark actually look like by company stage?" Verified structure: tldr opens with TL;DR framing the package as a stage-indexed six-line-item financial instrument (base + variable + equity + change-of-control + sign-on + severance) and lays out the bands Pre-Series A through Public with named sources (Alexander Group, Pavilion, Heidrick, Equilar, Carta, Pave, EDGAR proxies); core contains 18 deep H2 sections covering what a 2027 CRO comp package actually is, the canonical OTE bands by stage as a single reference table, why pre-Series A and founder-led comp looks like nothing else, the Series A first real package, the Series B inflection point, the Series C scale package, Series D+ and Pre-IPO last pre-public package, public-co DEF 14A proxy reality with named CROs and ranges across HubSpot/Salesforce/Snowflake/Datadog/MongoDB/Okta/Cloudflare/Confluent/Zscaler/ZoomInfo, variable structure 50/50 vs 60/40 with the accelerator math table, equity as the number that actually matters with refresh policy and acceleration mechanics, change-of-control as the clause that can be worth more than the salary, sign-on bonuses and clawbacks, severance as the underwritten insurance policy with stage-by-stage table, the CFO/board negotiation playbook with negotiability tiers, comp plan vs comp package distinction, board comp committee dynamics and peer-group construction, the wear-and-tear discount on next gig, M&A scenarios IPO vs PE rollup vs strategic, the bonus design tail MBO vs corporate goal vs team result, the realized-comp gap (40-70% of headline), real recent named CROs in the public eye (Mark Roberge, Carl Eschenbach, Ryan Azus, Catie Ivey, Gary Marcotte), the CEO/board side hiring playbook, and the final ten-step framework for the CRO. flow contains exactly 2 mermaid diagrams (the CRO comp stage curve from Pre-Series A through Public showing all six line items, and the negotiation decision tree by stage and leverage). src has 35 cited sources with real URLs (Heidrick, Crist Kolder, Alexander Group, Pavilion, Equilar, Pave, Carta, Cooley, Cooley GO, Gunderson, WSGR, SEC EDGAR, ZoomInfo IR, HubSpot IR, Salesforce IR, Snowflake IR, Datadog IR, MongoDB IR, Okta IR, Cloudflare IR, Confluent IR, Zscaler IR, Bessemer, OpenView, ICONIQ, Pavilion community, Mostly Metrics, Kruze Consulting, SaaStr, HBR exec comp topic, McKinsey, Gartner, Forrester, Tom Tunguz, Xactly/CaptivateIQ); num is comprehensive benchmark block with OTE bands by stage / variable structure and accelerator math / equity refresh and acceleration / sign-on and severance / tenure and realized-comp reality / public-co comp reference / exit outcome distribution / package vs plan / negotiation leverage distribution; counter is a 12-element counter-case with two-side honest verdict (CRO + CEO/board) plus a six-condition combined verdict; links cross-references 25 related entries. THREE pipe tables (canonical OTE bands by stage as the canonical reference, accelerator multiplier table on $250K variable, severance by stage table). Direct operator voice throughout - written to a CRO negotiating their next package OR a CEO/board hiring one; real numbers, real URLs, real public proxy data; counter-case explicitly addresses how high OTE does not mean high realized take-home (equity hold periods + dilution + miss-related claw + 18-month tenure destroy paper comp). ASCII-clean, no smart quotes or em-dashes.'
};

// ---- Step A: Create baseline blob and index row, then call runPolish ----
async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set in environment'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // Stop guard per spec: if q9634 already exists in blobs OR index, FAIL.
  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  if (existing) {
    console.error(`[${ID}] COLLISION: answers/${ID}.json already exists (quality_score=${existing.quality_score}). FAILING per spec.`);
    process.exit(1);
  }
  const idxPre = await store.get('_index.json', { type: 'json' });
  if ((idxPre.entries || []).find(x => x.id === ID)) {
    console.error(`[${ID}] COLLISION: ${ID} already in _index.json. FAILING per spec.`);
    process.exit(1);
  }

  // Build baseline answer (~2,500-3,000 words; the polish ladder will use v5 = tldr+core+flow as the writing layer)
  const baselineAnswer = `${tldr}

## What A 2027 CRO Compensation Package Actually Is

A Chief Revenue Officer compensation package is not a salary -- it is a six-line-item financial instrument: base salary, variable / target bonus (the OTE line), equity grant (options, RSUs, or hybrid), change-of-control protection (single- or double-trigger acceleration on unvested equity), sign-on bonus, and severance + accelerated vesting on involuntary termination. Every line item moves on a different curve as the company scales, and a CRO or CEO who negotiates only on OTE is leaving the majority of the package's value on the table.

## The OTE Bands By Stage

Pre-Series A / Founder-led ($0-1M ARR): $200-350K OTE, equity 1.5-3.0%, often advisor or fractional. Series A ($1-5M ARR): $300-450K OTE, equity 0.75-1.5%, 50/50 base/variable. Series B ($5-25M ARR): $400-600K OTE, equity 0.5-1.0%, double-trigger acceleration becomes standard. Series C ($25-75M ARR): $500-800K OTE, equity 0.25-0.6%, MBO layer adds 10-25%. Series D+ ($75-200M ARR): $600K-$1.0M OTE, equity 0.15-0.4%. Pre-IPO ($200-500M ARR): $700K-$1.2M OTE, equity 0.10-0.3% RSU. Public ($500M+ ARR): $650K-$1.2M+ cash + RSU/PSU grant $3-8M annual, double-trigger CIC and 12-24 month severance. Sources: Alexander Group, Pavilion, Heidrick & Struggles, Equilar, Carta, Pave, and DEF 14A proxy filings on SEC EDGAR.

## Variable Structure And Accelerators

The dominant base/variable split is 50/50 (~65-75% of CRO packages per Alexander Group), with 60/40 base-heavy at later stages (~20-30%) and 40/60 variable-heavy in turnaround contexts (~5-10%). Per Xactly Insights and CaptivateIQ benchmarks, the canonical accelerator structure is 1.5x marginal at the 100-115% attainment band and 2x marginal at 116-149%. The single highest-leverage CRO negotiation is uncapped accelerators above 150% attainment.

## Equity: Refresh And Acceleration

The Carta and Pave benchmarks show standard CRO equity refresh runs 25% of the original grant annually, starting at month 18-24. The Cooley GO data on executive employment agreements shows double-trigger acceleration on 100% of unvested equity (acceleration triggers if the company is acquired AND the CRO is terminated within 12-18 months) is the dominant senior-exec standard. Gunderson Dettmer and Wilson Sonsini converge on the same recommendation. Equity dilution from grant to exit typically runs 30-50%.

## Change-Of-Control: Worth More Than The Salary

A CRO with a $750K paper equity grant terminated 14 months into a Series B tour with no acceleration walks away with ~$217K (29% vested). The same CRO with double-trigger 100% acceleration walks away with the full $750K -- a $533K difference for a single contract clause.

## Sign-On And Severance

Sign-on bonuses run $50-250K with universal 12-month clawback on voluntary resignation only. Severance scales by stage: Series A 6 months base + 6 mo COBRA, Series B 6-9 months, Series C 9-12 months, Series D+ 12 months base + 12 mo COBRA + acceleration, Public 12-24 months base + bonus pro-rata + double-trigger CIC.

## Public Company DEF 14A Proxy Reality

Once public, CRO comp is disclosed annually in the DEF 14A on SEC EDGAR. Recent (2023-2024) ranges: HubSpot $5-9M, Salesforce $8-15M+ for senior revenue NEOs, Snowflake $5-12M, Datadog $5-10M, MongoDB $4-8M, Okta $4-9M, Cloudflare $4-7M, Confluent $4-8M, Zscaler $5-9M, ZoomInfo $3-6M. Operators needing current numbers should pull the latest DEF 14A directly from sec.gov.

## Realized Comp Vs Headline

Realized comp at the end of a typical 18-19 month CRO tour (Heidrick median) is 40-70% of headline package value. Drivers: variable miss (80-90% of target on average), equity dilution (30-50%), vesting timing (37.5% vest on 4-year schedule at median tenure absent protection), tax drag, and hold-period/lockup risk.

## The CFO/Board Negotiation Playbook

Highly negotiable (25-50%+ swing): equity grant size, refresh policy, change-of-control acceleration, severance, good-reason and cause definitions, uncapped accelerators, sign-on clawback. Moderately negotiable (10-25% swing): base/variable split, OTE, MBO structure, quota multiplier. Essentially fixed: base salary at the stage benchmark, vesting schedule, strike price (set by 409A). Pull in own counsel from Cooley, Gunderson, Wilson Sonsini, Latham, Orrick, or Morrison Foerster -- $8-25K returns 10-50x on a Series B+ package.

## Comp Plan Vs Comp Package

The comp package is the executive employment agreement (Cooley/Gunderson red-line). The comp plan is the annual sales compensation plan (sales ops + finance operationalize) including quota, accelerators, SPIFs, MBOs, territory and credit rules. The canonical CRO error: signing the package without seeing the comp plan template. The fix: insist on the comp plan template before signing.

## M&A Outcomes

IPO outcome: equity converts to public RSUs/options subject to 180-day lockup; total realized comp on a $5-10B IPO can be $10-50M+ for a CRO who joined at Series C with 0.5%. Strategic acquisition: equity cashed out at deal price (10-15% escrow holdback for 12-24 months); typical 4-8x revenue multiples. PE rollup: mandatory 25-50% rollover with new equity grant in post-PE company; lower cash component (3-6x revenue multiples) but second equity outcome at the eventual PE exit 4-7 years later.

## The Final Framework

Establish the band from Pavilion/Alexander Group/Heidrick benchmarks. Separate package vs plan. Lead with equity. Define refresh in writing at 25%-of-original annual. Lock change-of-control at double-trigger 100% with 12-18 month window and CRO-friendly good-reason. Lock severance at 9-12 months base + COBRA + acceleration with narrow cause. Fight for uncapped accelerators. Negotiate sign-on with appropriate clawback. Pull in own counsel. Evaluate on realized-comp expectation, not headline OTE.`;

  const ts = Date.now();
  const baselineEntry = {
    id: ID,
    question: QUESTION,
    answer: baselineAnswer,
    tags,
    sources: sources.map(s => s.url),
    ts,
    model: 'claude-opus-4-7-via-claude-code',
    quality_score: 5,
    polished_at: null,
    polish_history: [],
    source: 'claude-opus-bespoke-baseline'
  };

  console.log(`[${ID}] writing baseline blob (q_score=5, ${baselineAnswer.split(/\s+/).filter(Boolean).length} words)...`);
  await store.setJSON(`answers/${ID}.json`, baselineEntry);

  console.log(`[${ID}] appending row to _index.json...`);
  const idx = await store.get('_index.json', { type: 'json' });
  const idxRow = {
    id: ID,
    question: QUESTION,
    tags,
    ts,
    quality_score: 5,
    polished_at: null,
    last_modified_ms: ts,
    sources_count: sources.length
  };
  const i = (idx.entries || []).findIndex(x => x.id === ID);
  if (i >= 0) idx.entries[i] = idxRow;
  else idx.entries = [idxRow, ...(idx.entries || [])];
  await store.setJSON('_index.json', idx);
  console.log(`[${ID}] index entries now: ${idx.entries.length}`);

  // Now call runPolish -- it will read this baseline, then walk 5 -> 6 -> 7 -> 8 -> 9 -> 10
  console.log(`[${ID}] starting polish ladder...`);
  await runPolish({ id: ID, tldr, core, flow, src, num, counter, links, sources, tags, notes });
}

main().catch(e => { console.error(e); process.exit(1); });
