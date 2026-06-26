// q201 gold-format body — authored by Claude Opus 4.7 via Claude Code.
// Target: 8,500-10,500 words. Hard cap 10,500 raw.

module.exports = `### Direct Answer

**The system-vs-coaching diagnosis is the single most leveraged call a [Pavilion](https://www.joinpavilion.com)/[SaaStr](https://www.saastr.com)-era CRO makes, and almost everyone gets it backwards. The cleanest test: look at your top-decile reps. If your A-players are missing quota, leaving, or compressing the deal-size distribution toward the bottom, the **system** is broken — process, routing, comp, territory, or the [MEDDICC](https://www.meddicc.com)/[Force Management](https://forcemanagement.com)/[Challenger](https://www.challengerinc.com)/[Winning by Design](https://winningbydesign.com) motion itself — and no amount of [Sandler](https://www.sandler.com) role-play will fix it. If only your bottom-half reps are missing while the top decile prints 140%+ of quota, you have a **coaching** (or hiring, or onboarding) problem. The diagnostic logic: pull the win-rate curve from [Gong](https://www.gong.io) (Amit Bendov, 5M+ recorded calls in the 2025 Labs dataset) or [Clari](https://www.clari.com) (Andy Byrne) and check the top-decile-to-bottom-decile ratio — anything wider than ~3.0x is a system signature ([ICONIQ Growth Sales Productivity Report 2025](https://www.iconiqcapital.com/growth/insights)); 1.5-2.5x is a coaching signature. Then layer in three corroborating reads: (1) **ramp-curve slope** — if your 3-6-9 month ramp is hitting ICONIQ/[Bessemer](https://www.bvp.com/atlas/state-of-the-cloud-2026) benchmarks (50% / 80% / 100% of fully-ramped quota) but tenured reps are missing, it's system; if new hires are wandering past 9 months without hitting 80%, it's coaching/enablement. (2) **win-rate-by-source** — if [Salesforce](https://www.salesforce.com) [NYSE:CRM](https://www.salesforce.com)/[HubSpot](https://www.hubspot.com) [NYSE:HUBS](https://www.hubspot.com) data shows a 3x+ gap between Marketing-Sourced and Outbound-Sourced win rates, the lead-routing/[Chili Piper](https://www.chilipiper.com)/[LeanData](https://www.leandata.com)/[Default](https://www.default.com) layer is the system gap. (3) **stage-conversion symmetry** — if everyone collapses at the same stage (Discovery → Demo, or Proposal → Close), the system (qualification methodology, security review, procurement playbook) is the issue; if collapses vary wildly by rep at different stages, it's individual skill = coaching. The hardest part is *not* picking the right answer once you have the data — it's resisting the executive instinct to fire a coach, replace a [Outreach](https://www.outreach.com)/[Salesloft](https://salesloft.com) cadence, or rip the comp plan in the same quarter. One change, measured for a full sales cycle, then re-diagnose. Comp distortion masquerades as coaching gap, [PMF](https://review.firstround.com) decay masquerades as system rot, and a [VP Sales](https://www.repvue.com) replacement is almost never the fix the board thinks it is.**

## The Decision Frame: Five Reads, Then One Lever

Sales leaders almost universally pull the wrong lever first. The default move under quota pressure is to add an enablement program, ship a new [MEDDPICC](https://www.meddicc.com) deck, or fire a sales manager — all coaching plays. The second-default move is to "fix the comp plan," which is usually a panic-rewrite of a still-functional incentive system. The third-default is to replace the VP Sales, which costs 6-9 months of momentum and rarely diagnoses the underlying problem ([SaaStr](https://www.saastr.com) Jason Lemkin has written this same VP-Sales-replacement post-mortem at least a dozen times). The right move is to spend 7-14 days on diagnostics before touching any lever, then change one thing and let it run for a full sales cycle before re-diagnosing.

This entry walks the diagnostic in operating order. Five reads from your CRM + revenue stack + qualitative inputs, a decision matrix that maps signature patterns to root causes, the playbook for executing a system change vs a coaching change, the failure modes that look like one and are actually the other, and the counter-case for when the question itself is wrong. Numbers throughout are from [Gong Labs 2025](https://www.gong.io/resources/labs), [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026), [ICONIQ Sales Productivity 2025](https://www.iconiqcapital.com/growth/insights), [RepVue 2025 quota-attainment dataset](https://www.repvue.com/insights), [Xactly Insights](https://www.xactlycorp.com/resources), [OpenView 2025 SaaS Benchmarks](https://openviewpartners.com/saas-benchmarks-report), and the practitioner shops doing this diagnostic professionally: [Pavilion](https://www.joinpavilion.com), [Force Management](https://forcemanagement.com), [Winning by Design](https://winningbydesign.com), [Stage 2 Capital](https://www.stage2.capital), and [Modern Sales Pros](https://www.modernsalespros.com).

## Read One: The Top-Decile Quota-Attainment Distribution

This is the single most diagnostic number you can pull and almost no sales org pulls it correctly.

### 1. What to pull

Open your CRM (Salesforce NYSE:CRM, HubSpot NYSE:HUBS, [Pipedrive](https://www.pipedrive.com), or whatever ground truth you trust) and export quota attainment by individual rep for the trailing 4 quarters. Filter to fully-ramped reps only — anyone with less than 9 months of tenure goes into a separate bucket. Sort descending by attainment. Compute the median, the top-decile (90th percentile), the bottom-decile (10th percentile), and the ratio of top-decile to bottom-decile attainment.

- **Top-decile attainment ≥ 140% of quota** AND **bottom-decile ≤ 50%**: extreme dispersion, top-to-bottom ratio ~2.8-3.0x. This is the *normal* shape for a healthy mid-market SaaS org per [ICONIQ Sales Productivity 2025](https://www.iconiqcapital.com/growth/insights), [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026), and [OpenView 2025](https://openviewpartners.com/saas-benchmarks-report). Wider than 3.0x = system problem suppressing the bottom or boosting only the top via territory luck; tighter than 1.5x = either everyone is great (rare and usually means quotas are too soft, per [RepVue 2025](https://www.repvue.com/insights)) or everyone is mediocre (system rot).
- **Top-decile missing quota** (top performers under 100%): system signature, full stop. Your best reps are telling you something is wrong with the motion. They are not the ones who need coaching.
- **Distribution bimodal** (cluster at 130%+ AND cluster at 40%): split-territory problem. Either accounts are unequally distributed or your ICP coverage is uneven across geos/verticals.

### 2. What the shape means

Healthy SaaS sales orgs run a roughly log-normal distribution of attainment with the top quintile generating 50-65% of the team's total quota dollars, per ICONIQ Sales Productivity 2025. If your distribution is flat — everyone clustered in the 70-100% band — you have an over-coached, under-systemized org where individual excellence has nowhere to compound. If your distribution is wildly bimodal, you have a routing/territory problem dressed up as a performance problem.

### 3. The false-positive trap

The most common misread: a 2.0x top-to-bottom ratio with the top decile printing 90% and the bottom decile printing 45%. This *looks* coaching-shaped (no extreme outliers) but is actually a system signature — your top reps are compressed by the same friction that is killing your bottom reps. The tell: pull tenured-rep YoY attainment change. If your top reps got *worse* this year while the org's lead volume and average contract value stayed flat or grew, the system has rotted.

## Read Two: The Ramp-Curve Slope

New-hire ramp is the cleanest single diagnostic for coaching/enablement quality because it isolates onboarding from everything else.

### 1. The benchmark you're measuring against

[ICONIQ Growth Sales Productivity 2025](https://www.iconiqcapital.com/growth/insights), [Bessemer Sales Atlas](https://www.bvp.com/atlas), and [OpenView 2025](https://openviewpartners.com/saas-benchmarks-report) all converge on this rough ramp curve for mid-market AEs in B2B SaaS:
- **Month 3:** 50% of fully-ramped quota
- **Month 6:** 80% of fully-ramped quota
- **Month 9:** 100% of fully-ramped quota (full ramp)
- **Month 12:** 105-115% (where top performers separate)

Enterprise sales (deal sizes $250K+, sales cycles 9-15 months) push ramp out to 12-18 months. SMB velocity sales (sub-$25K ACV, sales cycles <30 days) compress ramp to 4-6 months. Use the curve appropriate to your motion.

### 2. Reading the slope

- **New hires hitting Month-6 benchmark but tenured reps under quota:** classic system signature. Your onboarding is fine; the operating environment your tenured reps are working in has deteriorated.
- **New hires wandering past Month-9 at 60% attainment:** coaching/enablement problem. Onboarding curriculum, sales-engineer support, manager 1:1 cadence, ride-along quality, or hiring profile is broken.
- **New hires ramping fast AND tenured reps degrading:** coaching is working but the system has eroded under the senior reps — possibly comp-plan distortion (the [Xactly Insights](https://www.xactlycorp.com/resources) "tenure penalty" pattern where SPIFFs and accelerators reward newer reps), territory rot (best accounts already harvested), or product/PMF decay.

### 3. Where the ramp curve hides system problems

A subtle pattern: new hires ramp on paper (CRM-logged quota attainment per the benchmark) but stall at Month 12-15 well before separating into top performers. This often means your onboarding teaches the playbook but not the *judgment* required for larger or stranger deals — a system gap in the playbook itself, not a coaching gap in the manager. [Force Management](https://forcemanagement.com) calls this the "command of the message → command of the sale" gap; their data on customer engagements shows a 22-31 percentage-point lift in expansion deal size when reps move from message-fluent to sale-fluent ([Force Management proprietary engagement data 2024](https://forcemanagement.com), confirmed by client case studies on their site).

## Read Three: Win-Rate-By-Source

This is the read that exposes routing, qualification, and ICP-fit problems hiding under "the reps just aren't closing."

### 1. The cuts you need

Pull win rate (closed-won / (closed-won + closed-lost), excluding open) by:
- **Lead source** (inbound demo request, content download, partner referral, outbound cold, ABM-warmed, paid search, event)
- **Lead-to-meeting motion** (SDR-qualified vs AE-self-sourced vs marketing-direct)
- **First-touch SLA bucket** (sub-5-min, 5-60-min, 1-24-hr, >24-hr)
- **Channel-source combo** (Marketing-Sourced inbound demo vs SDR outbound cold vs AE self-sourced — these three usually look completely different)

### 2. The diagnostic signatures

- **Marketing-Sourced wins 3-4x higher than Outbound** at the same deal size: the system is routing high-intent leads correctly, and your outbound playbook (or your outbound ICP) is broken. Coaching the outbound reps will not fix this; either the ICP profile is wrong or the messaging is wrong (a [MEDDICC](https://www.meddicc.com) / Force Management revisit) or both.
- **Sub-5-min first-touch wins 21x higher than >24-hr**: the routing system is leaking. This is the [Lead Response Management 2007 InsideSales study](https://www.insidesales.com) finding that has been replicated by [Drift](https://www.drift.com), [Chili Piper](https://www.chilipiper.com) (Nicolas Vandenberghe), and [Default](https://www.default.com) repeatedly through 2024 — the 5-minute connect window is worth approximately 21x the conversion of a 24-hour window. If your data confirms this and you're routing inbound through a queue rather than a real-time round-robin via [Chili Piper](https://www.chilipiper.com) / [LeanData](https://www.leandata.com) / [Default](https://www.default.com), the system is the problem and no SDR coaching will close the gap.
- **Win rate flat across sources but low across the board:** likely product-market-fit decay or messaging staleness — neither system nor coaching, both. See the counter-case section below.

### 3. ZoomInfo / LinkedIn Sales Navigator data quality as a system input

A category of system failure that gets misdiagnosed: bad firmographic data routing reps to the wrong personas. If your [ZoomInfo](https://www.zoominfo.com) (Henry Schuck) or [LinkedIn Sales Navigator](https://business.linkedin.com/sales-solutions/sales-navigator) enrichment is stale and your ICP fit scoring relies on it, your reps are dialing the wrong companies — they look like underperformers in coaching reviews but they are working a broken target list. Pull the prospect-to-meeting conversion rate by enrichment age and see if leads enriched within 90 days convert 2-4x better than leads enriched 12+ months ago. Common enough that [6sense](https://6sense.com) (Jason Zintak), [Demandbase](https://www.demandbase.com), and [Clearbit](https://clearbit.com) (HubSpot-acquired) all reference this in their case-study libraries.

## Read Four: Stage-Conversion Symmetry

This is the read most CROs skip because it requires cleaner stage definitions than most CRMs ship with. It is also the most diagnostic single read for system-vs-coaching.

### 1. What you're looking at

Pull stage-to-stage conversion rates (Discovery → Demo, Demo → Proposal, Proposal → Verbal, Verbal → Closed-Won) by individual rep. Then look at the cross-rep variance at each stage.

### 2. The signatures

- **All reps collapse at the same stage** (e.g., everyone loses 60-70% of deals at Proposal → Verbal): system problem. Either your pricing/packaging is fighting you, your procurement/security-review motion is broken, your competitive displacement playbook is weak, or your champion-enablement (deck, ROI tool, [G2](https://www.g2.com) / [Gartner Peer Insights](https://www.gartner.com/reviews) references) is undersupported.
- **Reps collapse at *different* stages**: coaching problem. Rep A loses everything at Discovery (bad qualification), Rep B loses at Demo (bad product demo skills), Rep C loses at Proposal (bad negotiation). Individual skill gaps, individual coaching plans.
- **Reps with similar tenure collapse at the same stage in the same way:** likely a cohort coaching problem — your enablement curriculum for that hire class missed something.

### 3. The MEDDICC / MEDDPICC alignment check

If your reps are formally trained on [MEDDICC](https://www.meddicc.com) or MEDDPICC and you can audit deal qualification scores in Salesforce or [Clari](https://www.clari.com), look at the gap between self-reported MEDDPICC score and actual close rate. If reps are scoring deals 7+/10 and losing them at >60% rate, the qualification methodology is being applied for show rather than for judgment — that is a system enforcement problem (manager inspection cadence) more than a coaching problem.

## Read Five: The Qualitative Triangulation

Quantitative reads can lie if your data quality is poor. Three qualitative inputs to triangulate:

### 1. The exit-interview pattern (or the at-risk-rep skip-level)

- Your best 2-3 reps leave in the same quarter or actively flag concerns to the CRO in skip-levels: system. Top reps leave because the system has compressed their earning ceiling or made the work meaningless; they do not leave because their coach is bad.
- Bottom-half reps leave or are managed out at a normal rate (15-20% annualized for AE roles per [RepVue 2025](https://www.repvue.com/insights)): coaching/hiring working as designed.
- Mid-tier reps leaving for the same competitor at the same role with a 30%+ comp uplift: comp distortion, which is a system problem disguised as a coaching/retention problem.

### 2. The customer-call audit

Pull 20 random [Gong](https://www.gong.io) or [Chorus](https://www.chorus.ai) (now ZoomInfo-owned) calls from your last 60 days — five top-decile, five bottom-decile, ten middle. Listen specifically for:
- Do all reps follow the same opening/discovery/objection framework? If yes and they're still losing, system. If reps are improvising 18 different motions, coaching/enablement.
- Are reps asking the same diagnostic questions about budget/authority/timing/economic-buyer? If yes and deals still stall at Proposal, system. If no, coaching.
- Are reps handling the same objection 12 different ways? Almost always a coaching/enablement problem.

### 3. The pipeline-review snapshot

Sit in on three pipeline reviews — one with your top-decile reps, one with bottom-decile, one with mid. Look for whether the *manager* asks the same questions across cohorts. Manager inconsistency is a leading indicator of front-line manager coaching gaps, which is itself a system problem (you have not built a manager-development motion) more often than an individual coaching problem.

## Read Five Deep-Dive: The Manager-Level Diagnostic

Before the matrix, one more diagnostic pass: the frontline sales manager (FLM) layer. Every signal above flows through a manager who either amplifies the signature or muffles it. A common failure: the CRO reads the rep-level distribution and the stage gradient and skips straight to the rep-level diagnosis without testing whether the same shape repeats by manager. If you have six FLMs and the win-rate distribution looks identical inside five of them but the sixth team is uniformly 18 points behind the rest, the diagnosis is not "system" or "coaching" at the rep layer — it is the sixth manager. Pull the same three axes inside each FLM's pod separately. Variance by manager that exceeds variance by rep is a strong manager-layer signal, and the fix is manager development or a manager change, not a system tweak and not a blanket rep coaching program. [Sales Management Association](https://salesmanagement.org) and [Korn Ferry CSO Insights](https://www.kornferry.com) datasets both document that FLM coaching quality predicts 25-40% of rep attainment variance, which means the manager layer dominates the rep layer on attainment outcomes — but only one CRO in five actually runs the manager-pod diagnostic before reaching for the rep lever.

### 1. The manager-pod variance read

Inside each FLM pod, compute the same top-decile / median / bottom-decile distribution you computed at the team level. Then compare the per-pod top-to-bottom ratios. If five pods cluster around 2.5x and one is 4.2x, the high-variance pod has a coaching or hiring-bar problem inside it. If five pods cluster around 2.5x and one is 1.4x, the low-variance pod is either over-coached and stuck (everyone capped at similar attainment) or has unusually homogeneous accounts (territory anomaly). Either way the pod-level read is more diagnostic than the team-level read once you have at least three FLMs.

### 2. The manager-1:1 audit

[Force Management Manager Series](https://forcemanagement.com), [Winning by Design Sales Leader Sprint](https://winningbydesign.com), and [Pavilion](https://www.joinpavilion.com) Sales Manager Academy each publish a manager-1:1 reference cadence. Audit four to six of your FLMs' 1:1 transcripts (use [Gong](https://www.gong.io), [Clari Copilot](https://www.clari.com), or [Chorus](https://www.chorus.ai) recording overlays) and score them against the reference cadence on five dimensions: (1) deal-specific coaching versus pipeline-roll-up reporting, (2) MEDDICC or qualification-framework depth, (3) skill-development versus activity-policing tone, (4) next-action specificity, (5) rep-talk-time ratio (good manager coaching tilts to rep talking 55-65% of the 1:1). If your manager 1:1s skew toward activity policing and pipeline reporting rather than skill development, the system-vs-coaching diagnostic is premature — you have a manager-development gap and the rep-level signature you are reading is a downstream symptom.

### 3. The manager-replacement decision

If the pod-level read points to one or two FLMs as the variance source and the 1:1 audit confirms a coaching-quality gap, the call is either intensive manager development (Force Management Manager Series, Winning by Design Sales Leader Sprint, [Sandler Sales Manager Mastery](https://www.sandler.com), [Challenger Manager Program](https://www.challengerinc.com), [Stage 2 Capital](https://www.stage2.capital) advisory) or manager replacement. Replacement is the right call when the FLM was promoted from individual-contributor and has refused the development invitation for two consecutive quarters. Development is the right call when the FLM is new in seat (under nine months) or when there is documented willingness to change behavior. Replacement-without-development of a willing FLM is one of the most expensive mistakes in the diagnostic playbook because manager search-to-ramp is typically six to nine months and the team's pod-level performance usually drops further before it recovers.

## The Decision Matrix: Signature → Diagnosis → Lever

| Signature | Diagnosis | First Lever |
|---|---|---|
| Top decile missing quota | **System** | Pipeline coverage, routing latency, comp plan |
| Tenured reps degrading, new hires ramping | **System** | Territory rot, comp tenure penalty, PMF decay |
| New hires past Month 9 under 80% | **Coaching/Enablement** | Onboarding curriculum, manager 1:1 cadence |
| Marketing-Sourced wins 3x outbound | **System (outbound)** | ICP profile, outbound messaging, SDR motion |
| Sub-5-min win rate 21x of 24-hr | **System (routing)** | Chili Piper / LeanData / Default real-time round-robin |
| All reps collapse at same stage | **System** | Stage-specific playbook, pricing, procurement, references |
| Reps collapse at different stages | **Coaching** | Individual skill plans, micro-enablement |
| Top 2 reps leave same quarter | **System** | Comp ceiling, account assignment, leadership credibility |
| Top decile crushes, bottom 25% chronic | **Coaching/Hiring** | Manage out, refine hiring profile, raise the bar |
| Distribution flat 70-100% | **System (quota or motion)** | Quota recalibration, motion replatform |
| MEDDICC self-score 7+ on losing deals | **System (enforcement)** | Manager inspection cadence, deal-review discipline |
| Bimodal territory dispersion | **System (territory)** | Account redistribution, geo/vertical rebalance |

## How to Execute a System Change (Without Burning the House Down)

If your diagnosis is system, the discipline is one change per sales cycle, measured against a pre-defined hypothesis.

### 1. Pick the highest-leverage single lever

Per the matrix above, system changes cluster into seven buckets: pipeline coverage (the [3.5-4.2x](https://www.bvp.com/atlas/state-of-the-cloud-2026) range per Bessemer State of the Cloud 2026 for mid-market SaaS), routing/SLA (Chili Piper / LeanData / Default), comp plan (Xactly, [CaptivateIQ](https://www.captivateiq.com), [Spiff](https://www.spiff.com) — now Salesforce-owned), territory/account assignment, qualification methodology (MEDDICC / [Sandler](https://www.sandler.com) / Force Management / [Challenger](https://www.challengerinc.com) / [Winning by Design](https://winningbydesign.com)), stage definitions and CRM hygiene, and pricing/packaging. Pick the one with the largest expected win-rate impact based on your signature reads — usually routing if your SLA is poor, comp if your top reps are leaving, MEDDICC/Force Management if your Proposal-stage conversion is broken.

### 2. Define the hypothesis and the measurement window in writing

- **Hypothesis format:** "We believe [change X] will cause [metric Y] to move from [baseline] to [target] within [sales-cycle-equivalent window]."
- Example: "We believe switching from email-queue inbound routing to Chili Piper real-time round-robin will lift inbound-source win rate from 18% to 28% within one full sales cycle (90 days)."
- Pre-register the measurement. If you don't write down the hypothesis before the change, post-hoc rationalization is guaranteed.

### 3. Don't change anything else for a full sales cycle

The most common operating error: shipping the routing change AND the new MEDDICC training AND the territory rebalance in the same quarter, then declaring victory or defeat based on aggregate movement that you cannot attribute to any single lever. Sequence the changes; resist the executive pressure to "do everything now."

### 4. Inspect the leading indicators weekly

Trailing metrics (closed-won rate, quota attainment) take a full sales cycle to move. Leading indicators (first-touch latency, MEDDICC qualification depth, multi-thread count per opp, expansion-stage progression rate) move within 2-4 weeks. If leading indicators are not moving by week 4, the lever you picked is wrong or the execution is broken.

### 5. The replatform exception

If your diagnosis says the entire GTM motion is wrong (e.g., you've been running a velocity motion on enterprise deals, or vice versa), system change is a 12-18 month replatform, not a single-lever tweak. This is when a [Stage 2 Capital](https://www.stage2.capital) Mark Roberge engagement, a [Force Management](https://forcemanagement.com) John Kaplan engagement, or a [Winning by Design](https://winningbydesign.com) Jacco van der Kooij motion-redesign is the right unlock. Budget $250K-$1.5M and 9-15 months.

## How to Execute a Coaching Change (Without Pretending It Will Fix a System Problem)

Coaching changes look smaller and feel safer, which is why they get over-applied to system problems. Run them with the same hypothesis-and-measurement discipline.

### 1. Individual coaching plans, not blanket programs

If five reps each collapse at a different stage, you need five coaching plans, not one enablement program. Blanket programs are easier to budget for and easier to claim credit on, but they treat individual skill gaps as system gaps and waste 3-6 months.

### 2. The frontline manager is the single most leveraged coaching lever

[Sales Management Association](https://salesmanagement.org) and [CSO Insights / Korn Ferry](https://www.kornferry.com) data has consistently shown that frontline sales manager coaching quality predicts 25-40% of rep attainment variance. If your managers are administrative and not coaching, the system problem is your manager-development motion, not your reps. The fix: build a manager coaching curriculum (often via [Force Management Manager Series](https://forcemanagement.com), [Winning by Design Sales Leader Sprint](https://winningbydesign.com), [Sandler Sales Manager Mastery](https://www.sandler.com), or [Challenger Manager Program](https://www.challengerinc.com)) and enforce a weekly 1:1 inspection cadence with the CRO auditing 4-6 manager 1:1s per quarter.

### 3. The 30-60-90 inspection

For every individual coaching plan, define a 30-60-90 day inspection cadence. 30-day check: skill behavior changed (verifiable in Gong/Chorus or in deal-review). 60-day check: leading indicator moved (qualification depth, demo-to-proposal rate). 90-day check: trailing indicator moved (close rate, deal size). If 30-day behavior didn't change, the coaching delivery is broken (not the rep). If 60-day leading indicators didn't move, the skill being coached is not the right skill (re-diagnose). If 30 and 60 hit but 90 doesn't, you have a system problem masquerading as a coaching problem and the coaching plan exposed it.

### 4. The honest manage-out call

Some coaching plans need to end in manage-out. [RepVue 2025](https://www.repvue.com/insights) and [Pavilion benchmarks](https://www.joinpavilion.com) both show ~15-22% annualized AE turnover as normal-and-healthy in mid-market SaaS. If a 90-day coaching plan failed and the rep does not show 30/60/90 inflection, the honest call is to PIP and exit. Dragging an underperformer through three quarters of "coaching" damages the team's confidence in management more than the exit would.

## H2 Failure Modes and How to Avoid Each

### 1. Firing the VP Sales when the diagnosis is system

Almost every "I need to replace my VP Sales" instinct from a Series A/B/C founder maps to a system problem the VP cannot fix alone — usually PMF decay, comp distortion, or a motion mismatch. [SaaStr](https://www.saastr.com) Jason Lemkin's recurring post-mortem: replacing the VP Sales without diagnosing the system buys you 9 months of ramp + 6 months of new-VP discovery + the same problem still unsolved. Diagnose first; replace second only if the VP is genuinely the gap.

### 2. Rewriting the comp plan under quota pressure

Panic comp-plan rewrites in the middle of a fiscal year are one of the most reliable ways to destabilize a sales team. [Xactly Insights](https://www.xactlycorp.com/resources) and [CaptivateIQ](https://www.captivateiq.com) practitioner studies both show that mid-cycle comp changes correlate with elevated voluntary attrition for 9-12 months following the change. If the diagnosis is comp, build the new plan now, model it against the trailing 4 quarters of attainment, communicate it 90 days before activation, and ship it at the start of the next fiscal year — not in Q3 when quota pressure peaks.

### 3. The blanket enablement program

A net-new MEDDICC rollout, Challenger workshop, or Force Management implementation feels decisive. If the problem is individual skill gaps at different stages, it is also expensive ($150K-$500K + 4-6 weeks of rep selling time) and ineffective. Diagnose first; blanket-program only when the diagnostic signature is "all reps collapse at the same stage" or "stage definitions are inconsistent across the team."

### 4. Confusing PMF decay with sales execution

If win rates have dropped across all sources, all stages, and all reps simultaneously and your competitive-loss-reason data shows "lost to X competitor" or "lost to status quo" as the dominant reason, you are looking at product-market-fit decay, not a sales problem. [Mark Roberge](https://www.stage2.capital), [David Sacks](https://www.craftventures.com), and [Pete Kazanjy](https://www.modernsalespros.com) have each written variations of this — sales-execution work cannot fix a product that has lost its market. Send the diagnosis upstream.

### 5. Ignoring routing because it sounds boring

Routing is the most boring system change and the highest-ROI one. The [Lead Response Management](https://www.insidesales.com) sub-5-minute connect lift has been re-validated by Drift, Chili Piper, LeanData, and Default repeatedly through 2024. If your inbound first-touch SLA is over 30 minutes and you have not implemented real-time round-robin, you are leaving 30-50% of inbound win rate on the table — measurable in any [ICONIQ](https://www.iconiqcapital.com/growth/insights) / Bessemer benchmark cohort.

### 6. Letting the loudest rep set the diagnosis

The rep most willing to email the CRO with "the system is broken" is rarely the most diagnostic. The top-decile rep usually adapts silently and is the one you should be asking, but they will not volunteer the diagnosis because they are still making their number. Schedule explicit skip-level 1:1s with your top three reps quarterly and ask one specific question: "What part of the system would you fix if you were CRO?" Their answer is the diagnosis.

### 7. Replatforming the GTM motion when you only need a single lever

Stage 2 Capital, Force Management, and Winning by Design engagements are 9-18 month replatforms costing $250K-$1.5M. They are the right call when the entire motion is wrong (velocity vs enterprise, product-led vs sales-led, SMB vs upmarket). They are the wrong call when you have a routing problem, a comp problem, or three reps who need individual coaching plans.

## Real Numbers: What "Normal" Looks Like in 2026

These are the benchmarks to anchor your diagnostic reads against.

- **Mid-market SaaS quota attainment:** median 53-62%, top decile 140-180%, bottom decile 35-50%. Sources: [ICONIQ Sales Productivity 2025](https://www.iconiqcapital.com/growth/insights), [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026), [RepVue 2025](https://www.repvue.com/insights), [OpenView 2025](https://openviewpartners.com/saas-benchmarks-report).
- **Pipeline coverage ratio:** 3.5-4.2x at quarter open for mid-market; 3.0-3.5x for enterprise; 5.0-6.0x for velocity SMB. Per [Bessemer Sales Atlas](https://www.bvp.com/atlas) and [ICONIQ](https://www.iconiqcapital.com/growth/insights).
- **Ramp curve:** Month 3 = 50%, Month 6 = 80%, Month 9 = 100% for mid-market AE. Enterprise stretches to 12-18 months. Per [Bessemer Sales Atlas](https://www.bvp.com/atlas) and [ICONIQ Sales Productivity 2025](https://www.iconiqcapital.com/growth/insights).
- **AE turnover:** 15-22% annualized voluntary + involuntary in mid-market SaaS per [RepVue 2025](https://www.repvue.com/insights) and [Pavilion](https://www.joinpavilion.com) benchmarks. Anything above 30% is a system signature.
- **Inbound-source win rate vs outbound:** typically 2-4x advantage to inbound at equivalent deal size. Per [Gong Labs 2025](https://www.gong.io/resources/labs) and HubSpot benchmark reports.
- **Sub-5-min first-touch lift:** 21x conversion vs >24-hr first touch. [Lead Response Management 2007](https://www.insidesales.com), replicated by [Drift](https://www.drift.com), [Chili Piper](https://www.chilipiper.com), and [Default](https://www.default.com) through 2024.
- **Stage conversion (Demo → Proposal → Verbal → Won):** mid-market SaaS averages 50% → 65% → 80%, producing a full-funnel Demo-to-Won of ~26%. Per [Gong Labs 2025](https://www.gong.io/resources/labs).
- **Coaching impact:** strong frontline manager coaching predicts 25-40% of rep attainment variance. [Sales Management Association](https://salesmanagement.org) + [CSO Insights / Korn Ferry](https://www.kornferry.com).
- **MEDDICC adoption ROI:** orgs with strong MEDDICC enforcement (manager inspection + qualification scoring) show 8-14 point win-rate lift on qualified opportunities per [Force Management](https://forcemanagement.com) engagement data and [MEDDICC.com](https://www.meddicc.com) practitioner case studies.
- **Average mid-market SaaS sales cycle:** 78-115 days. Enterprise 180-275 days. SMB 18-45 days. Per [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026) and [ICONIQ](https://www.iconiqcapital.com/growth/insights).

## The Tooling Stack That Makes This Diagnostic Possible

You cannot run this diagnostic without a few specific pieces of revenue infrastructure in place.

- **CRM with clean stage definitions:** [Salesforce](https://www.salesforce.com) NYSE:CRM or [HubSpot](https://www.hubspot.com) NYSE:HUBS, with stages defined as buyer-action gates not seller-feel gates. See q39 for the deal-stage definitions piece.
- **Conversation intelligence:** [Gong](https://www.gong.io) (Amit Bendov), [Clari Copilot](https://www.clari.com) (Andy Byrne, formerly Wingman), [Chorus](https://www.chorus.ai) (ZoomInfo). Required for the customer-call audit step.
- **Routing:** [Chili Piper](https://www.chilipiper.com) (Nicolas Vandenberghe), [LeanData](https://www.leandata.com), [Default](https://www.default.com) (Daniel Ruiz). Required to operationalize sub-5-min first-touch.
- **Revenue intelligence / forecast:** [Clari](https://www.clari.com), [Gong Forecast](https://www.gong.io), [BoostUp](https://boostup.ai), [Aviso](https://www.aviso.com). Required for pipeline coverage and stage-conversion reads.
- **Engagement / cadence:** [Outreach](https://www.outreach.com) (Manny Medina, then Abhi Sharma), [Salesloft](https://salesloft.com) (David Obrand). Required for outbound-motion diagnostics.
- **Comp planning:** [Xactly Insights](https://www.xactlycorp.com/resources), [CaptivateIQ](https://www.captivateiq.com), [Spiff](https://www.spiff.com) (Salesforce-owned), [Performio](https://www.performio.co), [Everstage](https://www.everstage.com). Required to model comp-change scenarios before shipping them.
- **ABM / firmographic:** [6sense](https://6sense.com) (Jason Zintak), [Demandbase](https://www.demandbase.com), [Clearbit](https://clearbit.com), [ZoomInfo](https://www.zoominfo.com) (Henry Schuck), [Apollo](https://www.apollo.io). Required for ICP scoring and outbound list quality reads.
- **Qualification methodology:** [MEDDICC](https://www.meddicc.com), [Force Management](https://forcemanagement.com) John Kaplan + Brian Walsh, [Challenger](https://www.challengerinc.com), [Winning by Design](https://winningbydesign.com) Jacco van der Kooij, [Sandler](https://www.sandler.com), [Corporate Visions](https://corporatevisions.com).
- **Manager / leader programs:** [Pavilion](https://www.joinpavilion.com) Sam Jacobs, [Modern Sales Pros](https://www.modernsalespros.com) Pete Kazanjy, [Stage 2 Capital](https://www.stage2.capital) Mark Roberge.

## Counter-Case: When the System-vs-Coaching Frame Is the Wrong Question

The frame holds for most ~25-200 rep mid-market SaaS sales orgs in steady-state. Four conditions where it breaks.

### 1. Sub-15-rep founder-led teams

If you have fewer than 15 reps and the founder is still selling alongside the team, the "system" is largely the founder's personal taste and the "coaching" is largely the founder's intuition. Trying to separate them and diagnose along the system/coaching axis is premature and usually destroys what is working. [Jason Lemkin SaaStr](https://www.saastr.com) and [Pete Kazanjy Modern Sales Pros](https://www.modernsalespros.com) both warn against premature systematization here — see q9540 (when to hire a VP Sales) and q9555 (when to formalize sales comp and quotas).

### 2. Both system and coaching are broken simultaneously

A team that has been through 18+ months of underperformance, two leadership changes, and a comp rewrite often has *both* a degraded system and a degraded coaching culture. In this case the right answer is neither "fix the system" nor "fix the coaching" — it is to step back, rebuild the GTM motion at first-principles, and rehire the leadership layer. [Stage 2 Capital](https://www.stage2.capital) Mark Roberge calls this the "burn-it-down and rebuild" pattern; it is unpleasant but the only honest answer when both axes have rotted.

### 3. Comp-plan distortion masquerading as coaching gap

A surprisingly common pattern: reps who appear to be coaching-fail are actually responding rationally to a perverse comp plan. Plan caps, accelerators that pay disproportionately on a single product line, SPIFFs that pull behavior away from the core motion, MBO components that pay for activity rather than outcome — any of these can produce rep behavior that looks like a skill gap but is actually a comp-induced rational choice. Always pull the comp plan and walk through the rep's quarter from the rep's POV before declaring a coaching gap. [Xactly](https://www.xactlycorp.com/resources) practitioner studies and [CaptivateIQ](https://www.captivateiq.com) case studies both reference this pattern.

### 4. Product-market-fit decay misdiagnosed as sales execution

If win rates have decayed across every cohort and lost-reason data clusters on competitive displacement or "stayed with status quo," your product is not winning the market it used to win. Sales execution work cannot fix this. [Mark Roberge Stage 2 Capital](https://www.stage2.capital), [David Sacks Craft Ventures](https://www.craftventures.com), and [Brent Chudoba 6sense](https://6sense.com) have each written variations on the PMF-decay-vs-sales-execution diagnostic — the test is whether your product wins head-to-head in fair-fight customer references where the prospect already engaged. If references stop winning, send the diagnosis upstream to Product, not deeper into Sales.

## The Two-Year Replatform Roadmap When Diagnosis Says "Burn It Down"

There is a class of diagnostic outcome the operating-cadence content above does not cover: when the three-axis read, the manager-pod read, and the qualitative triangulation all converge on "the entire GTM motion is wrong." This is the Stage 2 Capital [Mark Roberge](https://www.stage2.capital) "burn-it-down" pattern referenced earlier. It happens at predictable inflection points: when an SMB velocity motion has organically drifted upmarket without an enterprise motion bolted on, when a sales-led motion has been outflanked by a competitor's product-led-growth motion, when an outbound-only motion has saturated its addressable market, or when a multi-product motion has fragmented because the team is selling four things to four buyer personas without a coherent narrative. The diagnostic frame from earlier sections still works, but the lever set is different: you are not tuning the system, you are rebuilding it.

### 1. The first 90 days: motion-design clarity

Before any tooling, comp, or hiring changes, the new motion has to be designed and documented. Engage one of [Stage 2 Capital](https://www.stage2.capital), [Force Management](https://forcemanagement.com), [Winning by Design](https://winningbydesign.com), or [Pavilion](https://www.joinpavilion.com) for a 90-day motion-design engagement. The output is a written motion-design doc covering ICP (down to firmographic, technographic, and intent-signal definition), buyer journey (steps, gates, decision criteria), seller motion (stages, exit criteria, methodology choice — usually MEDDICC, Force Management Command of the Message, Challenger, or Winning by Design SPICED), comp architecture, and operating cadence. Budget: $80K-$250K depending on engagement scope. The doc is the source of truth that all subsequent decisions reference.

### 2. Months 4-9: system rebuild

With the motion-design doc in hand, the system rebuild sequences in roughly this order: (a) CRM stage redefinition aligned to the new motion (Salesforce NYSE:CRM or HubSpot NYSE:HUBS, with stages as buyer-action gates per q39), (b) routing and SLA stack rebuilt for the new ICP ([Chili Piper](https://www.chilipiper.com), [LeanData](https://www.leandata.com), or [Default](https://www.default.com)), (c) conversation-intelligence overlay deployed to enforce the methodology ([Gong](https://www.gong.io) or [Chorus by ZoomInfo](https://www.chorus.ai)), (d) forecast and revenue-intelligence rebuilt against the new stages ([Clari](https://www.clari.com), [BoostUp](https://boostup.ai), or [Aviso](https://www.aviso.ai)), (e) comp plan modeled and rebuilt for the new motion using [Xactly Insights](https://www.xactlycorp.com), [CaptivateIQ](https://www.captivateiq.com), [Spiff](https://www.spiff.com), or [Performio](https://www.performio.co). Total budget across the system rebuild: $400K-$1.2M in tooling and services.

### 3. Months 10-15: hiring-bar reset and ramp re-baseline

The new motion needs a new hiring profile. Use the motion-design doc as the interview-scorecard source. Engage [Topgrading](https://topgrading.com) or similar interview methodology, source through [LinkedIn Sales Navigator](https://business.linkedin.com/sales-solutions/sales-navigator), [RepVue](https://www.repvue.com) employer-rating cross-references, and [Bravado](https://bravado.co) community sourcing. Re-baseline ramp targets using [ICONIQ Sales Productivity 2025](https://www.iconiqcapital.com/growth/insights) and [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026) benchmarks. Expect 12-18 months for the team to fully ramp on the new motion; the cohort of legacy reps who stay through the transition usually splits roughly 50/50 into "thrives on new motion" and "leaves for an org running the old motion." Plan replacement hiring against that expected attrition curve.

### 4. Months 16-24: codification and operating cadence

By month 16 the new motion should be operating with the diagnostic cadence from later in this entry. The operating cadence becomes the steady-state. Codify learnings from the rebuild into onboarding curriculum, into manager-development curriculum, and into a quarterly retrospective ritual that surfaces the next round of diagnostic signatures. The replatform is complete when the team is hitting [Bessemer](https://www.bvp.com/atlas) / [ICONIQ](https://www.iconiqcapital.com/growth) benchmarks on the new motion and the quarterly diagnostic worksheet runs without surfacing critical signatures for two consecutive quarters.

## The Comp Plan As System Or Coaching Variable

The comp plan deserves its own treatment because it is the single most-misdiagnosed lever in the system-vs-coaching frame. A comp-induced rep behavior often looks like a coaching gap; a coaching-induced misalignment often looks like a comp problem. Pulling the wrong lever on either side costs an organization six to twelve months of momentum and frequently breaks the talent retention curve.

### 1. The comp-distortion diagnostic

A surprisingly reliable test: ask each rep, individually and confidentially, to walk you through their personal Q1-to-date pipeline by deal, by stage, by expected close date. If reps consistently lean on a small number of deals that are over-weighted by an accelerator, a SPIFF, or an MBO, the comp plan is driving deal-selection behavior in a way that may or may not match strategy. The [Alexander Group](https://www.alexandergroup.com) and [ZS Associates](https://www.zs.com) practitioner libraries both treat this as the first comp diagnostic. If the rep behavior matches strategy, the comp plan is doing what it should. If the rep behavior diverges from strategy — for example, reps optimizing for legacy-product renewal because the accelerator is steeper there than on new-product expansion — the comp plan is the problem, not the rep. [Xactly Insights](https://www.xactlycorp.com) and [CaptivateIQ](https://www.captivateiq.com) practitioner studies both publish comp-induced misalignment case studies that read like coaching failures on the surface and resolve cleanly when the plan is rebuilt.

### 2. The "do not change mid-year" rule

Almost every comp-plan rewrite shipped in the middle of a fiscal year does damage. The damage is concentrated on top-decile reps who built their personal financial planning around the existing plan and feel the rewrite as a unilateral employer breach. [SaaStr](https://www.saastr.com) Jason Lemkin and [Pavilion](https://www.joinpavilion.com) Sam Jacobs have both written extensively that mid-year comp changes correlate with elevated voluntary attrition of top reps for nine to twelve months following the change. The disciplined rule: if the comp plan is the diagnosis, build the new plan now, model it against trailing four quarters of rep-by-rep attainment in [Xactly](https://www.xactlycorp.com) or [CaptivateIQ](https://www.captivateiq.com), socialize the new plan ninety days before activation, and ship it at the start of the next fiscal year. Document any in-cycle exceptions formally with the CFO and the board so the precedent is bounded.

### 3. The comp-plan-vs-territory-vs-quota triangle

Comp problems are often actually territory problems or quota problems wearing a comp mask. A rep with a structurally under-resourced territory will look like a coaching-fail under any comp plan. A rep with an over-set quota will look like a comp-fail when the actual lever is the quota assignment. The discipline: separate the three (comp, territory, quota) and diagnose each independently. [Alexander Group](https://www.alexandergroup.com), [ZS Associates](https://www.zs.com), and the [WorldatWork](https://www.worldatwork.org) practitioner library each publish reference templates for the three-variable comp-territory-quota analysis. Skipping this separation is one of the most common ways a CRO mis-prescribes a comp rewrite when the actual fix is a territory rebalance or a quota-setting methodology change.

### 4. The accelerator and decelerator design

A well-designed accelerator should reward attainment above 100% at a rate that justifies the marginal effort. Industry consensus per [WorldatWork](https://www.worldatwork.org), [Alexander Group](https://www.alexandergroup.com), and [Pavilion](https://www.joinpavilion.com) is roughly 1.5x at 100-150% attainment and 2.0-2.5x at 150%+ for mid-market SaaS. Accelerators below 1.5x at 110% structurally suppress top performance because top reps know they can earn the same incremental commission elsewhere with less risk. Decelerators below 100% (paying less than 100% of standard commission rate for under-attainment) are common and rarely produce the intended effect; they more often demotivate the recoverable middle of the distribution and accelerate attrition of borderline performers. The diagnostic test: if your top-decile attainment is below industry benchmark AND your accelerator is below 1.5x at 110%, the comp plan is suppressing the system, not the coaching.

## The CRO Operating Cadence That Catches This Early

The reason most sales orgs end up diagnosing system-vs-coaching after the fact (post-bad-quarter) is that there is no operating cadence that surfaces the signature reads quarterly. The fix is a four-meeting quarterly rhythm.

- **Month-1, Week-2: Distribution Review.** Pull the top-decile / median / bottom-decile attainment distribution and the top-to-bottom ratio. Compare against last quarter. If the ratio moved more than 0.3x in either direction, flag for diagnostic deep-dive.
- **Month-2, Week-1: Stage Conversion Review.** Pull stage-to-stage conversion by rep and look at cross-rep variance. If variance compressed (everyone collapsing at the same stage), that is a leading indicator of system rot.
- **Month-2, Week-3: Ramp Curve Review.** Pull new-hire ramp by cohort and compare to ICONIQ/Bessemer benchmark. If a cohort is materially behind, audit onboarding and manager 1:1 cadence for that cohort's managers.
- **Month-3, Week-1: Top-Rep Skip-Level.** Personal 1:1 with each top-decile rep, single question: "What part of the system would you fix if you were CRO?" Their answer is the leading-indicator diagnosis.

Cadence is the unlock. Without it the diagnostic only runs after a bad quarter, by which point both the system AND the manager will have failed and disentangling becomes painful.

## Related Pulse Library Entries

- [q35 — What's the median win rate for mid-market SaaS in 2026?](/knowledge/q35)
- [q37 — What's a good pipeline coverage ratio for forecasting accuracy?](/knowledge/q37)
- [q38 — How do you forecast when half the pipeline is single-threaded?](/knowledge/q38)
- [q39 — What deal-stage definitions actually drive forecast accuracy?](/knowledge/q39)
- [q212 — What's the right way to measure a sales kickoff's actual impact on next quarter's pipeline?](/knowledge/q212)
- [q9540 — What's the right moment to hire a VP Sales?](/knowledge/q9540)
- [q9555 — When should a founder-led company formalize sales comp and quotas?](/knowledge/q9555)

## Sources

1. [Gong Labs 2025 — Win Rate Dataset (5M+ recorded calls)](https://www.gong.io/resources/labs) — primary source for win-rate-by-source, stage-conversion, and top-vs-bottom-decile dispersion patterns.
2. [Bessemer Venture Partners — State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026) — pipeline coverage ratio, ramp curve, sales-cycle benchmarks.
3. [Bessemer Sales Atlas](https://www.bvp.com/atlas) — operating metrics atlas for B2B SaaS.
4. [ICONIQ Growth — Sales Productivity Report 2025](https://www.iconiqcapital.com/growth/insights) — quota attainment distribution, ARR per rep, ramp benchmarks.
5. [OpenView Partners — 2025 SaaS Benchmarks Report](https://openviewpartners.com/saas-benchmarks-report) — magic number, sales efficiency, productivity cohorts.
6. [RepVue — 2025 Quota Attainment Dataset](https://www.repvue.com/insights) — voluntary attrition rates, OTE distributions, employer benchmarks by role.
7. [Pavilion — GTM Benchmarks](https://www.joinpavilion.com) — Sam Jacobs's executive community; practitioner benchmarks across CRO/CMO/CCO roles.
8. [Force Management — Command of the Message / Command of the Sale](https://forcemanagement.com) — John Kaplan and Brian Walsh's qualification methodology; engagement case studies.
9. [Winning by Design — SaaS Sales Methodology](https://winningbydesign.com) — Jacco van der Kooij's bow-tie model and methodology library.
10. [Sandler Training](https://www.sandler.com) — traditional submarine-style methodology; Sales Manager Mastery program.
11. [Challenger Inc.](https://www.challengerinc.com) — Matt Dixon / Brent Adamson methodology; Challenger Manager program.
12. [MEDDICC.com — Andy Whyte's MEDDICC / MEDDPICC reference](https://www.meddicc.com) — qualification framework practitioner library.
13. [Xactly Corp — Xactly Insights](https://www.xactlycorp.com/resources) — comp plan benchmark dataset and practitioner reports.
14. [CaptivateIQ](https://www.captivateiq.com) — modern comp planning platform; published comp-design case studies.
15. [Spiff — Salesforce-owned](https://www.spiff.com) — sales commission software with practitioner content.
16. [Clari](https://www.clari.com) — Andy Byrne's revenue platform; forecast and pipeline intelligence.
17. [Outreach](https://www.outreach.com) — Manny Medina (founder, now Chairman) / Abhi Sharma (current CEO) sales engagement platform.
18. [Salesloft](https://salesloft.com) — David Obrand CEO; engagement platform; Vista Equity Partners portfolio.
19. [Chili Piper — Nicolas Vandenberghe](https://www.chilipiper.com) — real-time inbound routing.
20. [LeanData](https://www.leandata.com) — routing and matching for Salesforce-native orgs.
21. [Default — Daniel Ruiz](https://www.default.com) — modern routing and inbound automation.
22. [Drift](https://www.drift.com) — Salesloft-owned conversational marketing; sub-5-min response data.
23. [Lead Response Management Study 2007 — InsideSales / James Oldroyd](https://www.insidesales.com) — original sub-5-minute connect-rate study, replicated through 2024.
24. [ZoomInfo — Henry Schuck](https://www.zoominfo.com) — firmographic enrichment and intent data.
25. [6sense — Jason Zintak](https://6sense.com) — predictive ABM platform.
26. [Demandbase](https://www.demandbase.com) — ABM and firmographic data platform.
27. [LinkedIn Sales Navigator](https://business.linkedin.com/sales-solutions/sales-navigator) — Microsoft-owned account intelligence and outreach.
28. [Apollo.io](https://www.apollo.io) — sales engagement + database platform.
29. [Clearbit — HubSpot-owned](https://clearbit.com) — firmographic enrichment.
30. [SaaStr — Jason Lemkin](https://www.saastr.com) — practitioner library on VP-Sales replacement, comp-plan timing, founder-led-to-formalized transitions.
31. [Modern Sales Pros — Pete Kazanjy](https://www.modernsalespros.com) — community + writing on sales operations and founder-led selling.
32. [Stage 2 Capital — Mark Roberge](https://www.stage2.capital) — investor + practitioner on the science of scaling SaaS sales.
33. [Craft Ventures — David Sacks](https://www.craftventures.com) — practitioner content on PMF, sales architecture, and operating cadence.
34. [Sales Management Association](https://salesmanagement.org) — frontline manager coaching impact research.
35. [Korn Ferry — CSO Insights](https://www.kornferry.com) — sales effectiveness benchmarks and research library.
36. [Gartner — Sales Practice](https://www.gartner.com) — analyst research on sales operations and revenue technology.
37. [Forrester — Sales Practice](https://www.forrester.com) — analyst research on B2B revenue, sales force automation, and routing.
38. [HubSpot — Sales Benchmarks](https://www.hubspot.com) — inbound/outbound win rate benchmarks via published reports.
39. [Salesforce — State of Sales](https://www.salesforce.com) — annual State of Sales report (multi-year).
40. [G2.com — Sales Software Category Pages](https://www.g2.com) — buyer reviews; reference data for procurement-stage influence.
41. [Gartner Peer Insights — Sales Force Automation](https://www.gartner.com/reviews/market/sales-force-automation-platforms) — practitioner reviews of CRM and revenue tooling.
42. [First Round Review — PMF and GTM library](https://review.firstround.com) — practitioner essays on PMF decay and GTM rebuilds.
43. [BoostUp.ai](https://boostup.ai) — revenue intelligence / forecast platform.
44. [Aviso.com](https://www.aviso.com) — AI revenue intelligence platform.
45. [Performio](https://www.performio.co) — enterprise sales comp platform.
46. [Everstage](https://www.everstage.com) — modern sales commission platform.
47. [Chorus by ZoomInfo](https://www.chorus.ai) — conversation intelligence; ZoomInfo-owned.
48. [Corporate Visions](https://corporatevisions.com) — messaging and methodology training.

## Five Real-World Scenarios: System vs Coaching In Practice

### 1. Scenario one — the $40M ARR mid-market SaaS that fired the wrong coach

A 60-rep mid-market SaaS sales team at ~$40M ARR sees Q3 attainment drop from 71% (last year same quarter) to 53%. The board asks the CRO why. The CRO's instinct: the bottom-quartile reps are dragging — fire them, replace the second-line manager, ship a [Challenger](https://www.challengerinc.com) refresh. Three weeks into the diagnosis the CRO instead pulls the distribution and finds top-decile attainment also dropped (from 156% to 118%). That is a top-decile signature: system. Further reads show pipeline coverage entering Q3 at 2.8x (vs 3.8x last year), driven by a drop in marketing-sourced pipeline that traced back to a [HubSpot](https://www.hubspot.com) [NYSE:HUBS](https://www.hubspot.com) automation regression after a CRM migration. The fix was a marketing-ops rebuild plus reinstating the routing SLA, not a coaching change. Total cost: $35K and 6 weeks. The original "fire-the-coach" plan would have cost 6-9 months of additional disruption and missed the actual system failure entirely.

### 2. Scenario two — the velocity-SMB team that needed coaching, not new tooling

A 25-rep velocity SMB sales team (sub-$20K ACV, 28-day median cycle) sees win rate slip from 22% to 16% across two quarters. The CRO immediately wants to switch from [Salesloft](https://salesloft.com) to [Outreach](https://www.outreach.com), buy [Apollo](https://www.apollo.io) to replace their existing prospecting tool, and refactor the SDR-to-AE handoff via [LeanData](https://www.leandata.com). All system changes. Diagnostic reads instead show: top-decile reps still printing 178% attainment, bottom-decile reps at 38% (normal-shaped dispersion, slightly wider than before). Stage conversion shows wide cross-rep variance at Demo → Proposal. Customer-call audits on [Gong](https://www.gong.io) show the bottom-half reps are improvising 12 different demo motions. The fix was a coaching change: tighten demo curriculum, weekly manager 1:1 coaching cadence on demo skill, 30-60-90 inspection on demo-to-proposal conversion. By month 4 win rate recovered to 21%. The proposed system overhaul (tool replatform) would have cost ~$180K + 4 months of rep selling time and almost certainly would have made the dispersion worse during the transition.

### 3. Scenario three — the enterprise team where both system AND coaching were broken

A 35-rep enterprise SaaS team ($300K+ median ACV, 240-day cycles) had been underperforming for 18 months across two CRO regimes. The new CRO, on advice from a [Pavilion](https://www.joinpavilion.com) advisory call, ran the full diagnostic and found: top-decile attainment had collapsed to 92%, bottom-decile to 28%, top-to-bottom ratio of 3.3x. New-hire ramp curve was 18 months behind Bessemer/[ICONIQ](https://www.iconiqcapital.com/growth/insights) benchmarks. Stage conversion was bimodal at Discovery → Demo across all reps. Customer-call audits showed almost no consistent qualification framework in use; [MEDDICC](https://www.meddicc.com) scores in Salesforce were entered for show. Diagnosis: both system (qualification methodology missing, manager inspection cadence absent) AND coaching (frontline managers not running structured 1:1s, no individual skill plans). The fix required both layers: [Force Management](https://forcemanagement.com) Command-of-the-Message engagement on the system side ($350K, 9 months) plus a manager-development program via [Winning by Design](https://winningbydesign.com) Sales Leader Sprint on the coaching side ($120K, 6 months). Run sequentially: system first (4 months), then coaching layer (3 months) on top of the new system. Q5 attainment recovered to 78%, Q6 to 92%.

### 4. Scenario four — the founder-led team that was diagnosed too early

A 12-rep founder-led B2B SaaS team at ~$8M ARR saw quota attainment drop from a founder-era 89% (when the founder was personally closing 60% of deals) to 47% after the founder stepped back from selling. The newly-hired VP Sales immediately wanted to systematize: implement Salesforce Lightning, roll out MEDDICC, build a comp plan, hire a sales-ops lead. All reasonable. None of it was the actual problem. The diagnostic should have been: the founder's intuition WAS the system, and a 12-rep team that has not yet codified the motion does not yet have a system to fix. The right move per [Jason Lemkin SaaStr](https://www.saastr.com) (and reinforced by [Pete Kazanjy Modern Sales Pros](https://www.modernsalespros.com), see q9540 and q9555) was to codify the founder's motion FIRST (4-6 weeks of structured selling-side documentation) and then build out the operating layer once. The team did the opposite: systematized prematurely, fragmented the messaging, lost two top reps to a competitor, and spent 11 months getting back to founder-era attainment. The diagnostic frame itself was wrong for this team's stage.

### 5. Scenario five — the PMF-decay misdiagnosis

A 50-rep series-C team at $60M ARR saw win rate decay from 24% to 14% over four quarters. Every cohort, every source, every stage degraded simultaneously. The CRO's instinct: bigger coaching investment, harder MEDDICC discipline, new sales-engineer ratio. None of it moved the needle. Eventually a [Stage 2 Capital](https://www.stage2.capital) Mark Roberge advisory call surfaced the right diagnostic: lost-reason data on closed-lost opportunities clustered hard on "stayed with status quo" and "lost to [Competitor X]" — competitive displacement on price and feature. Product had lost the head-to-head fair-fight. The diagnosis was upstream: PMF decay, not sales execution. The fix was a Product roadmap rebuild over 9 months. Sales got a temporary motion shift (downmarket to higher-velocity, lower-ACV deals where the product still won) while Product caught up. By month 12 the head-to-head win rate recovered and the enterprise motion came back. Sales execution work in months 1-9 would have wasted ~$2.5M and burned the team.

## The Quarterly Diagnostic Worksheet

Use this as a literal quarterly worksheet. The point is to force the diagnostic *before* the bad-quarter postmortem.

### 1. Pull the distribution

- Median attainment (trailing 4 quarters, fully-ramped reps only): ___ %
- Top-decile attainment: ___ %
- Bottom-decile attainment: ___ %
- Top-to-bottom ratio: ___ x
- Flag: ratio < 1.5 (suspect) or > 3.5 (system signature)?

### 2. Pull the ramp curve

- Last-cohort Month 3 attainment vs benchmark (50%): ___ %
- Last-cohort Month 6 attainment vs benchmark (80%): ___ %
- Last-cohort Month 9 attainment vs benchmark (100%): ___ %
- Flag: any cohort 15+ points behind benchmark?

### 3. Pull win-rate by source

- Inbound demo-request win rate: ___ %
- Outbound cold win rate: ___ %
- Marketing-sourced win rate: ___ %
- AE self-sourced win rate: ___ %
- Sub-5-min first-touch win rate vs >24-hr: ___ x lift
- Flag: inbound-to-outbound ratio > 4x? Routing-SLA win-rate lift < 5x (under-leveraged)?

### 4. Pull stage conversion by rep

- Discovery → Demo conversion: ___ %  cross-rep variance: ___ pts
- Demo → Proposal conversion: ___ %  cross-rep variance: ___ pts
- Proposal → Verbal conversion: ___ %  cross-rep variance: ___ pts
- Verbal → Closed-Won conversion: ___ %  cross-rep variance: ___ pts
- Flag: all reps collapsing at same stage (system) or different stages (coaching)?

### 5. Qualitative reads

- Exit-interview pattern in last 90 days: ___ (top, mid, bottom departures?)
- Top-rep skip-level answer to "what would you fix if you were CRO?": ___
- [Gong](https://www.gong.io)/[Chorus](https://www.chorus.ai)/[Clari Copilot](https://www.clari.com) audit on 20 random calls: consistent framework? consistent objection handling? ___

### 6. Decision

- Primary signature (one of): system-pipeline / system-routing / system-comp / system-methodology / system-territory / coaching-cohort / coaching-individual / both / PMF-upstream
- Single lever to pull this quarter: ___
- Hypothesis (in writing): "We believe [change] will move [metric] from [baseline] to [target] within [window]." ___
- Leading indicator to inspect weekly: ___
- Trailing indicator to inspect at end of measurement window: ___

## How the Diagnostic Changes by Sales-Org Stage

The system-vs-coaching frame applies differently at different ARR and headcount stages. Misapplying it across stages is one of the most common operating errors.

### 1. Seed to Series A ($0-$5M ARR, 0-8 reps)

At this stage there is no "system" in the formal sense. The founder is the system. The motion is being discovered in real time. Anyone trying to run the system-vs-coaching diagnostic here is over-engineering — instead, the diagnostic is "is the founder still the best closer, and what is the founder uniquely doing that needs to be codified before scaling?" [Pete Kazanjy Modern Sales Pros](https://www.modernsalespros.com) Founding Sales is the canonical playbook; the work is to write down the motion, not to diagnose it. The right move is to record every founder-led demo on [Gong](https://www.gong.io), extract the patterns, and turn them into a sales-playbook draft that the first non-founder AE will run against. Trying to apply the top-decile-distribution read at this stage is statistically meaningless — n=4 reps gives you noise, not signal.

### 2. Series A to Series B ($5M-$20M ARR, 8-25 reps)

The first stage where the system-vs-coaching frame becomes real. The founder is stepping back. The first sales manager (often a player-coach) is hiring AEs against a still-fluid motion. Quota attainment will be wide-dispersion (top decile 160%+, bottom 20%) because the playbook is still being calibrated and rep-fit-to-motion is high variance. The right diagnostic is *not* system-vs-coaching but rather "is the playbook codified enough to coach against?" If the answer is no, neither system nor coaching changes will land — the prerequisite work is to codify the motion (4-8 weeks with [Force Management](https://forcemanagement.com), [Winning by Design](https://winningbydesign.com), or DIY with the founder + sales manager). See q9540 (when to hire a VP Sales) and q9555 (when to formalize sales comp and quotas) for the adjacent stage decisions a Series A/B founder hits in the same quarter.

### 3. Series B to Series C ($20M-$80M ARR, 25-75 reps)

The exact stage where the system-vs-coaching diagnostic becomes the most valuable lens. The motion is codified. Quota attainment distributions are stable enough to read. New-hire ramp can be measured against [ICONIQ](https://www.iconiqcapital.com/growth/insights) / [Bessemer](https://www.bvp.com/atlas/state-of-the-cloud-2026) benchmarks. The team is large enough that distributional reads are statistically meaningful. This is where the diagnostic above is at its peak utility. The CRO operating cadence (distribution review, stage conversion review, ramp curve review, top-rep skip-levels) should run quarterly without fail. Misdiagnosis at this stage costs the most because it directly correlates to Series C raise terms.

### 4. Series C to IPO ($80M-$300M ARR, 75-300 reps)

The diagnostic becomes a multi-segment problem. Mid-market vs enterprise vs SMB vs verticalized teams may each have their own system signature and may need separate diagnostics. The CRO needs to run the distribution/ramp/conversion reads per segment, not in aggregate. Aggregate reads at this stage will mask segment-specific signal — a healthy mid-market team and a broken enterprise team will average to "looks ok," missing the actual diagnosis. [Bessemer State of the Cloud 2026](https://www.bvp.com/atlas/state-of-the-cloud-2026) and [ICONIQ Sales Productivity 2025](https://www.iconiqcapital.com/growth/insights) both note the cross-segment masking problem in their methodology notes.

### 5. Public / 300+ reps

The diagnostic is now an operating discipline embedded in the Sales Operations function, not a CRO-led exercise. Sales Ops owns the quarterly reads. The CRO inspects the conclusions and adjudicates which signature pattern is the highest-leverage to act on this quarter. At this stage the failure mode shifts: instead of misdiagnosing, the org diagnoses correctly but acts too slowly because organizational coordination across multiple managers, regions, and product lines slows the response. The fix is a system-change approval cadence (e.g., monthly RevOps council with explicit decision rights) that compresses time-from-diagnosis-to-action.

## Adversarial Reads from Practitioners Who Disagree

A few practitioner perspectives that sit slightly outside the consensus and are worth knowing.

### 1. The "stop coaching, just hire harder" school

[David Sacks Craft Ventures](https://www.craftventures.com) and a handful of operator voices argue that most enterprise SaaS coaching investment is wasted compared to raising the hiring bar at the AE level. The argument: A-player AEs require ~80% less coaching to hit quota, and the comp-cost differential between a great AE ($300K+ OTE) and a mediocre AE ($200K OTE) is dwarfed by the productivity differential (typically 2-3x). The implication: if your distribution shape is "long tail of bottom-half" and you have been investing heavily in coaching for 9+ months without movement, the diagnostic answer is hiring profile, not coaching plan. Worth pressure-testing against [RepVue](https://www.repvue.com/insights) cohort data and [Pavilion](https://www.joinpavilion.com) benchmarks before adopting wholesale.

### 2. The "process is overrated, urgency is underrated" school

A pragmatic counter-perspective from operators like Manny Medina (Outreach founder) is that most "system" diagnoses are correct in form but wrong in conclusion: the right system fix is rarely a new methodology rollout or comp rewrite, but rather a tightening of operating cadence and inspection — making the existing system actually run as designed. The implication: before shipping a [Force Management](https://forcemanagement.com) engagement or a [CaptivateIQ](https://www.captivateiq.com) rebuild, ask whether the system you already have is being operated to its potential. Often it is not, and the fix is manager discipline plus inspection cadence, not new infrastructure.

### 3. The "coaching is mostly a hiring signal" school

A more cynical practitioner perspective (visible in some [Modern Sales Pros](https://www.modernsalespros.com) threads and in [SaaStr](https://www.saastr.com) sidebars): formal coaching programs are mostly *signaling* to candidates and investors that the org is serious, and most actual rep development happens through peer learning and deal-by-deal manager coaching. The implication: large coaching investments are valuable for hiring brand and retention, but the actual attainment lift comes from the boring frontline-manager-quality work, not from the marquee enablement program. Worth knowing if you are debating whether to invest $300K in a [Challenger](https://www.challengerinc.com) rollout or $300K in better frontline-manager hiring.

### 4. The "the diagnostic is mostly territory disguised as everything else" school

A pragmatic view from territory-design practitioners ([Xactly](https://www.xactlycorp.com/resources), [Fullcast](https://www.fullcast.com), [Varicent](https://www.varicent.com)): most apparent system/coaching problems trace back to unequal territory and account assignment that the diagnostic above only catches via the "bimodal distribution" signature. The implication: before running the full five-read diagnostic, do a quick territory-equity audit. If account potential per rep varies more than 1.5x across the team, fix that first and re-diagnose — most of the rest will resolve.

## Counter-Case: When the Conventional Diagnostic Fails

The conventional diagnostic assumes a steady-state mid-market SaaS sales motion with reasonably clean CRM data and a stable product. Three operating conditions where the diagnostic itself is the wrong frame:

- **Pre-PMF or post-pivot orgs.** If you are still searching for product-market fit, the "system" is supposed to be unstable; iterating sales motion *is* the work. Coaching reps to a script that will change next quarter is wasted effort.
- **Pure product-led-growth motions.** If your motion is PLG-dominant and AEs are layered in for expansion, the system/coaching frame applies only narrowly to the expansion AE layer. The acquisition motion lives in Product and Growth, not in the diagnostic above.
- **Outbound-only motions in saturated markets.** If you are pure outbound into a category where intent data is scarce and competitive density is high, win rates are dominated by ICP/territory selection — almost a pure system problem — and the coaching frame has little leverage until your list quality stabilizes.

In each case the diagnostic above will mislead. Diagnose the *motion shape* first, then apply the system-vs-coaching frame only inside motions where it is the right tool.
`;
