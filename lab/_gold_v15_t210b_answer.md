Direct Answer: For SaaS Account Executives, the typical accelerator multiple past 100% of quota is 1.5x to 2.5x the base commission rate, with the most common single point being 2.0x. This means that once a rep crosses plan, every incremental dollar of bookings pays roughly double what it paid below quota. The exact figure depends on segment and ACV: SMB and velocity AEs cluster at the lower end (1.3x to 1.8x) because their deal volume is high and predictable, mid-market AEs sit in the 1.8x to 2.2x band, and enterprise AEs running six- and seven-figure deals frequently see 2.0x to 3.0x, sometimes with a second tier that pushes a small fraction of attainment toward 3.5x or even 4.0x. A small but growing number of plans use uncapped, flat-rate commission with no accelerator at all, and a roughly equal number front-load the base rate so heavily that the "accelerator" is closer to 1.2x. The number you should care about is not the headline multiple but the blended payout curve it produces between 100% and 250% of quota, because that curve is what actually changes rep behavior.

Below is the complete operator's guide to accelerator design for SaaS AE comp plans: what the benchmarks say, why the multiple is the wrong thing to anchor on, how to build a curve that funds itself, the segment-by-segment numbers, the modeling math, the diagnostic tests, and the rollout sequence.

## Section 1 — Why The Accelerator Multiple Is The Most Misunderstood Number In SaaS Comp

Walk into any RevOps planning meeting in Q4 and you will hear the same question asked the same wrong way: "What's our accelerator — are we at 2x or should we go to 2.5x?" The question treats the accelerator multiple as if it were a single dial that controls rep motivation. It is not. The accelerator is one parameter inside a payout function, and the function is what reps actually respond to. Two companies can both quote "2x past quota" and pay wildly different amounts to a rep at 140% attainment, because the multiple interacts with the base commission rate, the existence and width of intermediate tiers, whether the accelerator applies marginally or retroactively, the cap, and the ramp policy.

Here is the concrete trap. Company A pays a 10% base commission rate and a 2.0x accelerator, so the post-quota rate is 20%. Company B pays an 8% base rate and a 2.5x accelerator, so the post-quota rate is also 20%. The headline multiples differ — 2.0x versus 2.5x — but the post-quota economics are identical. Meanwhile a rep comparing the two offers, or a board member benchmarking the plans, will conclude Company B is "more aggressive" when it is mathematically the same plan with a lower base. The multiple, read alone, told you nothing.

This matters because the multiple is the number that gets benchmarked, debated, and copied, while the payout curve is the number that determines whether your top reps push for a third deal in December or coast. The discipline this article teaches is to stop quoting accelerators as standalone multiples and start quoting them as effective post-quota commission rates and as blended payout curves across the full attainment range. When Dave Kellogg writes about comp plan design on the Kellblog, when the team at Pavilion runs its compensation benchmarking, and when QuotaPath and CaptivateIQ publish their plan libraries, the sophisticated framing is always the curve, never the lone multiple.

The reason the multiple persists as the headline is psychological, not analytical. "2x past quota" is a clean, memorable promise that recruiters can say in a phone screen and reps can repeat to their spouses. It signals upside. That is fine as a recruiting artifact. It is dangerous as a design anchor, because optimizing the artifact — "let's bump it to 2.5x to win candidates" — without re-deriving the base rate and the cost-of-sale math is how comp plans quietly become unaffordable.

So the first principle: the accelerator multiple is an output of good design, not an input. You do not start by picking 2x. You start by deciding what fraction of bookings you can afford to pay in variable comp, what your target pay mix is, what attainment distribution you expect, and what behavior you need at the margin. The multiple falls out of that math. If it falls out at 2.0x, great — that is the modal answer for a reason. If it falls out at 1.6x or 2.8x, that is also correct for your situation, and copying a competitor's 2x would have been the mistake.

## Section 2 — The Benchmark Numbers, Stated Honestly

Operators want a number. Here is the honest version of the number, with the ranges and the sources, so you can place your own plan.

### 2.1 The Modal Accelerator: 2.0x

Across the SaaS AE population, the single most common accelerator multiple past 100% of quota is 2.0x the base rate. This is the answer you will get from the QuotaPath comp plan templates, from CaptivateIQ's published examples, from the plans that Pavilion members share in compensation discussions, and from the practitioner consensus that shows up in RepVue's commission data when you reverse-engineer attainment-vs-payout pairs. If you must pick one number without knowing anything else about a company, 2.0x is the defensible default.

But "modal" is not "universal." The distribution around 2.0x is wide and segment-driven.

### 2.2 The Realistic Range: 1.5x to 2.5x

The bulk of SaaS AE plans — call it 70% of them — land somewhere between 1.5x and 2.5x. Within that band:

- **1.5x to 1.8x** is common for high-velocity SMB and commercial AEs. The logic: these reps close many deals, attainment is more predictable, and the company can afford to pay a healthy base rate without a steep accelerator because the law of large numbers smooths revenue.
- **1.8x to 2.2x** is the mid-market heartland. This is where 2.0x lives. Deal counts are moderate, ACVs are five-figure to low six-figure, and the company wants a clear but not extreme pull past quota.
- **2.2x to 2.5x** is typical for enterprise AEs and for any segment where deal counts are low and each deal swings the number materially. The steeper accelerator compensates the rep for the risk and lumpiness of carrying a large-deal quota.

### 2.3 The Tails: Below 1.3x And Above 3.0x

Outside the main band:

- **Below 1.3x, effectively no accelerator:** Some plans, particularly flat-rate or "uncapped linear" designs, pay the same commission rate above and below quota — a 1.0x effective accelerator. Others have a token bump to 1.1x or 1.2x. These plans typically pair the flat rate with a lower OTE leverage or a high base salary, and they are favored by companies that want simplicity, that have very predictable pipelines, or that philosophically dislike the cliff dynamics a steep accelerator creates.
- **Above 3.0x:** Steep accelerators of 3.0x, 3.5x, and occasionally 4.0x exist almost exclusively in two contexts. First, enterprise plans with a second or third accelerator tier where the very high multiple applies only to attainment above, say, 150% or 200% — so only a thin slice of bookings ever earns it. Second, deliberately aggressive plans at land-grab-stage companies that want to make overperformance financially irresistible and are willing to accept a high cost of sale on incremental bookings to get it.

### 2.4 What Tier Structure Is Typical

The benchmark is not just a multiple, it is a curve shape. The most common structures:

1. **Single accelerator (one step):** base rate to 100%, then one elevated rate above 100%. Roughly half of SaaS AE plans. Simple, easy to communicate.
2. **Two-tier accelerator:** base to 100%, an intermediate rate from 100% to ~150%, and a higher rate above ~150%. Common in mid-market and enterprise. Lets the company reward strong overperformance without overpaying every rep who beats plan by a hair.
3. **Three-tier or continuous curve:** progressively steeper rates at 100%, 150%, and 200%+. Mostly enterprise and mostly at companies with mature comp functions.

A representative two-tier enterprise plan: 8% base commission to quota, 16% (2.0x) from 100% to 150%, 24% (3.0x) above 150%. A representative single-tier mid-market plan: 10% base, 20% (2.0x) above quota, often with a soft or hard cap around 200% to 250%.

### 2.5 Decelerators Below Quota

Worth noting because it interacts with the accelerator: a meaningful minority of plans pair the post-quota accelerator with a *decelerator* below some threshold — for example, full base rate from 60% to 100% of quota, but a reduced rate below 60%, and sometimes zero commission below 40% to 50%. Decelerators concentrate budget on attainment and self-fund part of the accelerator. They are common in enterprise, controversial with reps, and they change how you should read any headline accelerator number — a plan with a 2.0x accelerator and a steep decelerator is far cheaper than one with 2.0x and full pay from dollar one.

## Section 3 — Why The Accelerator Exists At All: The Behavioral Logic

Before designing the number, be clear on the job the accelerator is hired to do. It exists to solve three specific problems.

### 3.1 Defeating The Quota Cliff

Without an accelerator, the moment a rep hits 100% they face a brutal psychological cliff. Every dollar above quota pays the same as every dollar below it, but the dollars above quota are the *hardest* dollars — they require pulling deals forward, working pipeline that was slated for next quarter, and grinding when the rep has already "won." A flat plan invites the rep to stop at 100% and sandbag the rest into next period. The accelerator's primary job is to make the post-quota dollar worth visibly more than the pre-quota dollar, so the rep keeps pushing. A 2.0x accelerator says, in effect, "the deal you were going to save for January is worth double if you close it in December." That is the behavior you are buying.

### 3.2 Funding Itself From Overperformance

A well-designed accelerator is not a giveaway — it is a profit-share on bookings the company did not forecast. When a rep blows past quota, the incremental revenue is high-margin upside that was not in the operating plan. Paying an elevated rate on that upside is rational: the company keeps most of an unforecasted dollar even at a 20% commission rate, and the rep is motivated to generate more of those dollars. The accelerator should be sized so that the company's *marginal* economics on every post-quota dollar are still strongly positive. If they are not — if the accelerator is so steep that incremental bookings are barely contribution-positive — the plan is broken.

### 3.3 Retaining And Attracting Top Performers

Top reps are the population most sensitive to upside. Average reps care about base salary and reachable OTE; A-players care about how high the ceiling goes. A credible, generous accelerator is a retention tool for the 10% to 20% of reps who routinely finish above 120%. They are the reps you cannot afford to lose, and a flat or capped plan tells them their best work is unrewarded. The accelerator is, in part, golden handcuffs for the people you most want handcuffed.

Understanding these three jobs tells you when each design lever is right. If your problem is sandbagging, you need a clear, immediately-felt step up at 100%. If your problem is affordability, you need to derive the multiple from cost-of-sale math and possibly add a decelerator. If your problem is top-rep flight, you need an uncapped or high-ceiling structure with a meaningful second tier.

## Section 4 — The Math: Deriving Your Multiple From First Principles

This section is the core operator content. We will build the accelerator from the bottom up rather than guessing.

### 4.1 The Inputs You Must Fix First

Five numbers must be decided before the accelerator multiple has any meaning:

1. **OTE (on-target earnings):** total cash a rep earns at exactly 100% attainment. SaaS AE OTE commonly runs from roughly $140K (SMB) to $320K+ (enterprise).
2. **Pay mix:** the base-salary-to-variable split at OTE. The SaaS standard for quota-carrying AEs is 50/50, with 60/40 (more base) for longer enterprise cycles and 45/55 or 40/60 (more variable) for transactional velocity roles.
3. **Quota:** annual bookings target. Set so that the cost of an AE — fully loaded — is a sensible fraction of the revenue they carry. A common sanity check is a quota-to-OTE ratio of roughly 4:1 to 6:1 for new-business AEs.
4. **Target variable comp at 100%:** OTE multiplied by the variable share of pay mix. At a $200K OTE with a 50/50 mix, target variable is $100K.
5. **Expected attainment distribution:** the percentage of the team you expect to land below quota, at quota, and in each band above. This is the single most-skipped input and the most important.

### 4.2 Deriving The Base Commission Rate

The base commission rate is target variable comp divided by quota, assuming the rep hits exactly 100%:

Base rate = Target variable comp / Quota

Example: target variable $100K, quota $1,000,000 in new ARR. Base rate = $100,000 / $1,000,000 = 10%. That 10% is the rate a rep earns on every dollar from $0 to quota (ignoring decelerators for now).

### 4.3 Deriving The Accelerated Rate From Affordability

Now the accelerator. The principle: every post-quota dollar is unforecasted upside, and you decide what share of that dollar you are willing to pay the rep. Suppose you decide that on incremental, over-plan ARR you are comfortable paying a 20% commission rate — double the base. Then:

Accelerator multiple = Accelerated rate / Base rate = 20% / 10% = 2.0x

The 2.0x is *derived*. It came from two independent decisions — a 10% base from quota math, and a 20% acceptable marginal cost-of-sale on upside — not from copying a competitor.

### 4.4 The Affordability Test On Marginal Dollars

Sanity-check the accelerated rate against gross margin and the value of new ARR. A SaaS company with 80% gross margin and a healthy net revenue retention is buying a multi-year, high-margin annuity for each dollar of new ARR. Paying a 20% one-time commission on an annuity worth several times that dollar over its life is clearly accretive — the LTV-to-CAC contribution stays strongly positive. Even at a 24% accelerated rate (a 2.4x multiple on a 10% base), the marginal economics on upside ARR remain comfortably positive for a typical SaaS gross-margin profile. The accelerator becomes a problem only when the multiple is so high — say a flat 35% commission on upside with no tiering — that incremental bookings stop meaningfully contributing to gross profit. For nearly all SaaS AE plans, an accelerator in the 1.5x to 2.5x band passes the marginal-affordability test easily; the binding constraint is almost never marginal cost but total comp-cost-of-sale across the whole team.

### 4.5 The Total Cost Test On The Whole Team

This is the test that actually constrains the multiple. Run your expected attainment distribution through the full payout curve and total the comp bill.

Worked example. Ten-rep team, each with a $1,000,000 quota, 10% base rate, 2.0x accelerator (20% above quota), no cap.

Assume this attainment distribution:
- 2 reps at 60% → each books $600K → pays 10% × $600K = $60K → $120K total
- 3 reps at 90% → each books $900K → pays 10% × $900K = $90K → $270K total
- 2 reps at 110% → each books $1.1M → 10% × $1M + 20% × $100K = $100K + $20K = $120K → $240K total
- 2 reps at 140% → each books $1.4M → $100K + 20% × $400K = $100K + $80K = $180K → $360K total
- 1 rep at 200% → books $2.0M → $100K + 20% × $1.0M = $100K + $200K = $300K → $300K total

Total bookings: $1.2M + $2.7M + $2.2M + $2.8M + $2.0M = $10.9M
Total variable comp: $120K + $270K + $240K + $360K + $300K = $1.29M
Blended comp cost of sale = $1.29M / $10.9M ≈ 11.8%

If your target comp cost of sale for AE variable pay is, say, 10% to 12% of new ARR, this plan with a 2.0x accelerator passes. If you raised the accelerator to 3.0x (30% above quota), the overperformers' payouts climb sharply — the 200% rep alone jumps from $300K to $400K — and the blended cost of sale crosses 13%+, which may breach your target. *That* is how the total-cost test, not the marginal test, sets the ceiling on your multiple.

### 4.6 The Lesson From The Math

Notice what drove the answer: the *attainment distribution*. The same 2.0x accelerator is cheap if most of your team lands at 80% to 110% and expensive if you have a fat tail of 150%+ performers. This is why copying a competitor's multiple is unsafe — you do not know their distribution. Companies with reliable, narrow attainment distributions can afford steeper accelerators. Companies with volatile distributions and frequent 200%+ outliers must either moderate the multiple, add tiering so the steep rate applies to a thin slice, or cap.

## Section 5 — Curve Shape: Single Tier, Multi-Tier, And Where The Steps Go

The multiple is one number; the curve is the whole story. Three shape decisions matter.

### 5.1 One Step Or Two

A single-tier accelerator (one rate change, at 100%) is simple and communicable, and it is the right call for SMB and most mid-market teams. Its weakness: it pays the same elevated rate to a rep at 105% and a rep at 250%. If your attainment distribution has a long right tail, a single tier overpays the modest beaters relative to the goal of concentrating reward on true overperformance — or, if you flatten the rate to control cost, it underpays the stars.

A two-tier accelerator fixes this. Base to 100%, an intermediate accelerated rate from 100% to a breakpoint (commonly 150%), and a higher rate above the breakpoint. The intermediate tier keeps the cost of "everyone who beat plan by a little" controlled; the top tier makes genuine overperformance lucrative. Two tiers are the right call for enterprise and for any team with a wide attainment spread.

### 5.2 Where To Put The Breakpoint

If you use a second tier, the breakpoint placement should be derived from your distribution, not set at a round number out of habit. Put the breakpoint where you want the behavioral message to land. A breakpoint at 150% says "beating plan is good; smashing plan is exceptional, and we will pay for exceptional." If most of your team finishes between 90% and 130%, a 150% breakpoint means the top tier rewards only the genuine outliers — which is usually the intent. Setting the breakpoint at 110% would dilute the message and the budget.

### 5.3 Marginal Versus Retroactive Application

A subtle but critical choice: when a rep crosses 100%, does the accelerator apply only to the dollars above quota (marginal) or does it retroactively re-rate dollars below quota too (retroactive / "true-up")?

Almost all SaaS plans use **marginal** application — only the over-quota dollars get the elevated rate. This is the standard, it is what the example math above assumes, and it keeps the plan affordable and predictable.

**Retroactive** accelerators — where hitting 100% bumps the rate on the *entire* year's bookings — exist but are rare and dangerous. They create enormous cliffs: the difference between 99% and 101% attainment can be tens of thousands of dollars, which invites gaming, sandbagging timing, and disputes. Avoid retroactive application unless you have a very specific reason and a comp team that understands the cliff risk.

## Section 6 — Caps, Uncapped Plans, And The Top-Rep Question

The accelerator decision is incomplete without a position on what happens at the top of the curve.

### 6.1 The Case For Uncapped

The strongest argument for an uncapped accelerator is behavioral and cultural. Capping commission tells your best rep, in writing, that beyond some point their effort is free to the company. The rep who would have closed three more deals in Q4 to hit 280% has no reason to, and worse, they will move those deals to next year — converting upside the company could have booked now into a sandbag. Uncapped plans also win recruiting battles for A-players, who explicitly hunt for ceilings during diligence. The principle many comp leaders hold: never cap the thing you most want more of.

### 6.2 The Case For A Cap Or Soft Cap

The argument for a cap is affordability-of-the-tail and the windfall problem. If a rep lands a single transformational deal — a logo five times larger than any quota assumption — an uncapped steep accelerator can pay a multiple of OTE on essentially one transaction, decoupling pay from sustained performance. Soft caps and tools to manage this:

- **Soft cap:** the accelerated rate drops to a lower (but still above-base) rate above some high attainment, e.g., 250%. The rep keeps earning more, but the marginal rate moderates.
- **Windfall / mega-deal clause:** deals above a defined ACV threshold are commissioned under a separate, negotiated schedule rather than the standard accelerator, so one giant deal does not break the model.
- **Manager-discretion review above a threshold:** payouts above, say, 200% attainment are reviewed, not automatically reduced — a check on errors and gaming, not a cap.

### 6.3 The Recommended Posture

The defensible default for most SaaS AE plans: keep the standard accelerator **uncapped through the normal range** (up to ~250% to 300%) so the everyday overperformer is never throttled, and handle the genuine windfall — the once-a-year mega-deal — with a separate windfall clause rather than a blunt cap. This preserves the behavioral upside that the accelerator exists to create while protecting the model from a single decoupled outlier. A hard cap at a low multiple (e.g., 150%) is almost always a mistake for new-business AEs; it directly funds sandbagging.

## Section 7 — Ramp, Draws, And How New Reps Interact With Accelerators

Accelerator design is usually written for the steady-state rep, but most of the comp budget churn happens with new and ramping reps. Three interactions matter.

### 7.1 Ramped Quotas And The Accelerator

A new AE should not carry a full quota in months one through three or four. The standard is a ramped quota — a reduced target during the ramp period that steps up to full over one to three quarters depending on sales-cycle length. The accelerator should apply to the *ramped* quota, not the full one. A rep on a 50%-ramped quota who exceeds that ramped target should earn the accelerator on dollars above it. Designing it this way keeps the behavioral pull-forward incentive alive even during ramp, and it is fair: the rep beat the goal they were actually given.

### 7.2 Draws

A guaranteed or recoverable draw protects new-rep cash flow while pipeline builds. The accelerator interacts with draws only in that you must define whether commissions earned (including accelerated ones) offset the draw. Standard practice: yes, earned commission recovers a recoverable draw first, and the rep keeps commission above the draw amount. Non-recoverable draws are a pure cost and rarer.

### 7.3 The Risk Of Accelerators For Ramping Reps

One caution: a steep accelerator on a low ramped quota can produce a quirk where a strong ramping rep earns an outsized payout relative to a struggling tenured rep. This is usually acceptable — you *want* to reward the fast-ramping new hire — but model it so finance is not surprised. If the quirk is large, moderate the accelerator during the ramp period and apply the full multiple only once the rep is on full quota.

## Section 8 — Diagnostics: Eight Tests To Run On Your Accelerator

Use these to pressure-test an existing plan or a proposed one.

### Test 1 — The Marginal Affordability Test
Compute the accelerated commission rate as a percentage of new ARR and confirm that, given gross margin and the LTV of an ARR dollar, every post-quota dollar still contributes strongly to gross profit. For a typical SaaS margin profile, any accelerated rate up to roughly the mid-20s as a percent of ARR passes. If yours fails, the multiple is genuinely too steep.

### Test 2 — The Total Cost-Of-Sale Test
Run your real expected attainment distribution through the full curve, total the variable comp, and divide by total bookings. Confirm the blended comp cost of sale lands inside your target band (commonly ~10% to 14% of new ARR for AE variable pay, varying by segment). This is the test that usually binds.

### Test 3 — The Sandbag Test
At 100% attainment, is the very next dollar visibly more valuable than the last dollar below quota? If a rep cannot feel the step up, they will sandbag. If they feel it sharply, they will pull deals forward. A 1.0x or 1.1x effective accelerator fails this test.

### Test 4 — The Top-Rep Test
Model your best rep's expected attainment (e.g., 180% to 220%). Does the plan pay them an amount that makes them feel their overperformance was seen and rewarded — and does it keep paying without a punitive cap? If a cap throttles them, you are funding their move to next quarter or to a competitor.

### Test 5 — The Cliff Test
Plot payout against attainment from 80% to 130% and look for vertical jumps. A marginal accelerator produces a smooth kink at 100%; a retroactive accelerator produces a cliff. Cliffs invite gaming and disputes. Eliminate them.

### Test 6 — The Distribution-Robustness Test
Re-run the total cost test under a *good* year (fat right tail, many 150%+ reps) and a *bad* year. Confirm the plan is affordable in the good year — that is when accelerators get expensive — and still motivating in the bad year. A plan that only works on the planned distribution is fragile.

### Test 7 — The Communication Test
Can a rep, in under sixty seconds, state their base rate, their accelerated rate, where the breakpoints are, and what one extra deal is worth? If not, the plan is too complex and the accelerator's behavioral power is lost — reps cannot respond to an incentive they cannot compute.

### Test 8 — The Benchmark-Placement Test
Express your accelerator as an effective post-quota commission rate and as a blended payout curve, then compare to peers in your segment and stage. If you are far outside the 1.5x-to-2.5x band, have an explicit, defensible reason — not "we copied someone."

## Section 9 — Common Failure Modes And How To Fix Them

### Failure Mode 1 — The Headline-Multiple Arms Race
A company raises its accelerator to 2.5x to win a few recruiting battles without re-deriving the base rate or re-running the cost test. The blended cost of sale quietly drifts up; finance notices a year later. **Fix:** treat the multiple as derived. Any change to the accelerator triggers a re-run of Tests 1, 2, and 6.

### Failure Mode 2 — The Hidden Cap
A plan is marketed as "uncapped" but has a soft cap, a windfall clause with punitive terms, or a manager-discretion clawback that functions as a cap. Reps discover it at payout time and trust collapses. **Fix:** be explicit. If there is a windfall clause, disclose it in the plan document and the offer conversation.

### Failure Mode 3 — The Retroactive Cliff
A retroactive accelerator creates a five-figure swing between 99% and 101%. Reps sandbag to next period or dispute attainment. **Fix:** switch to marginal application.

### Failure Mode 4 — The Flat Plan That Sandbags
A company runs an effectively flat (1.0x) plan for simplicity and wonders why Q4 deals slip into Q1. **Fix:** introduce even a modest accelerator (1.5x) so the post-quota dollar is visibly worth more.

### Failure Mode 5 — The Distribution Surprise
A plan modeled on an optimistic narrow distribution meets a real fat-tailed year; the accelerator pays far more than budgeted. **Fix:** Test 6. Always model the good year.

### Failure Mode 6 — Accelerator Misaligned With Strategy
A company wants more new logos but its accelerator pays the same elevated rate on expansion and renewal ARR, so reps chase the easiest dollar. **Fix:** the accelerator can — and often should — differ by revenue type, with the steepest multiple on the strategic priority (usually new-logo ARR).

### Failure Mode 7 — The Un-Communicable Plan
A three-tier curve with multiple breakpoints, a decelerator, modifiers, and SPIFs layered on top — no rep can compute their next-deal value. **Fix:** simplify until Test 7 passes. Complexity destroys the incentive.

## Section 10 — Decision Framework: Choosing Your Multiple

Use this sequence to land on a defensible number.

**Step 1 — Fix the foundation.** Decide OTE, pay mix, quota, and target variable comp for the segment. Derive the base commission rate (target variable / quota).

**Step 2 — Decide your acceptable marginal cost of sale on upside ARR.** This, divided by the base rate, gives a first-pass accelerator multiple. For most SaaS profiles this lands near 2.0x.

**Step 3 — Build your real attainment distribution.** Use last year's actuals, not optimism. If you lack history, use a conservative spread with a modest right tail.

**Step 4 — Run the total cost-of-sale test.** If the blended cost of sale is inside your target band, the multiple holds. If it is too high, either moderate the multiple, add a second tier so the steep rate hits only a thin slice, or add a decelerator below quota to self-fund.

**Step 5 — Choose curve shape.** SMB / velocity: single tier, 1.5x to 1.8x. Mid-market: single or two-tier, ~2.0x. Enterprise: two-tier, ~2.0x intermediate and 2.5x to 3.0x top tier above a ~150% breakpoint.

**Step 6 — Set the top-of-curve posture.** Uncapped through ~250% to 300%; handle genuine windfalls with a separate disclosed clause; avoid hard low caps for new-business AEs.

**Step 7 — Run the eight diagnostics.** Especially the sandbag test, the top-rep test, the cliff test, and the communication test.

**Step 8 — Pressure-test the good year.** Confirm affordability under a fat-tailed distribution.

**Step 9 — Document and communicate.** Write the plan so a rep can compute their next-deal value in under a minute, and disclose every cap, windfall clause, and decelerator.

## Section 12 — Worked Plans By Segment: Three Complete Examples

Abstract math is useful; complete, numbered plans are more useful. Here are three fully specified accelerator plans, one per segment, each derived from the framework in Sections 4 and 10. Treat them as reference designs to adapt, not as plans to copy verbatim — your attainment distribution and gross margin still govern.

### 12.1 SMB / Velocity AE — The High-Volume, Shallow-Accelerator Plan

**Context.** The SMB AE sells a five-figure-ACV product on a 30-to-60-day cycle, closes a high number of deals per quarter, and works inbound-heavy pipeline. Attainment is relatively predictable because the law of large numbers smooths a portfolio of many small deals — no single deal swings the number.

**Foundation.**
- OTE: $150,000
- Pay mix: 50/50 — $75,000 base salary, $75,000 target variable
- Annual quota: $750,000 in new ARR
- Base commission rate: $75,000 / $750,000 = 10%

**Accelerator.** Because attainment is predictable and deal volume is high, a shallow accelerator is sufficient to defeat the quota cliff. A steep multiple is not needed — the rep is already pulling many deals and the marginal deal is small. Set a single-tier accelerator at 1.6x: a 16% commission rate on every dollar above quota. There is no second tier; the SMB curve is deliberately simple so the rep can compute their next-deal value instantly.

**Top of curve.** Uncapped through 300%. SMB reps rarely produce a single decoupled mega-deal, so a windfall clause is usually unnecessary; the portfolio nature of the role makes a runaway outlier improbable.

**What a deal is worth.** Below quota, a $40,000 ACV deal pays $4,000. Above quota, the same deal pays $6,400. The rep feels a clear, immediate step up — Test 3 passes — without the company taking on a steep marginal cost.

**Why it works.** The SMB plan accepts a modest accelerator in exchange for a healthy base rate and simplicity. The behavioral job — keep the rep closing in the back half of the quarter rather than parking deals — is done by a 60% bump on the marginal dollar, which is plenty when deal velocity is already high.

### 12.2 Mid-Market AE — The Modal 2.0x Plan

**Context.** The mid-market AE sells a low-six-figure-ACV product on a 60-to-120-day cycle, closes a moderate number of deals per year, and runs a mix of inbound and self-sourced pipeline. Attainment is moderately variable — a slipped deal matters, but no single deal defines the year.

**Foundation.**
- OTE: $240,000
- Pay mix: 50/50 — $120,000 base salary, $120,000 target variable
- Annual quota: $1,200,000 in new ARR
- Base commission rate: $120,000 / $1,200,000 = 10%

**Accelerator.** This is the heartland of the 2.0x default. Set a single-tier accelerator at 2.0x — a 20% commission rate above quota. Optionally add a light second tier above 175% at 2.5x (25%) if the team has a meaningful right tail; for a team with a narrow distribution, a single tier is fine and simpler.

**Top of curve.** Uncapped through 275%. Add a disclosed windfall clause for any single deal above roughly three times the average deal ACV, so one unusually large logo does not break the model.

**What a deal is worth.** A $120,000 ACV deal pays $12,000 below quota and $24,000 above it. The doubling is unambiguous, memorable, and recruiter-friendly, and it does the pull-forward job firmly.

**Total cost check.** This is exactly the ten-rep example worked in Section 4.5, scaled — the blended comp cost of sale lands near 11% to 12% of new ARR for a normal attainment distribution, inside the typical target band. The plan funds itself.

### 12.3 Enterprise AE — The Two-Tier, Steep-Top Plan

**Context.** The enterprise AE sells a six- or seven-figure-ACV product on a 6-to-12-month cycle, closes a low number of large deals per year, and self-sources or co-sources most pipeline. Attainment is highly variable — a single deal can swing the rep from 70% to 160%.

**Foundation.**
- OTE: $320,000
- Pay mix: 60/40 — $192,000 base salary, $128,000 target variable (the higher base reflects the long cycle and the risk the rep carries)
- Annual quota: $1,400,000 in new ARR
- Base commission rate: $128,000 / $1,400,000 ≈ 9.1%

**Accelerator.** The enterprise plan uses two tiers to compensate the rep for lumpiness without overpaying every modest beater. Tier one: from 100% to 150% of quota, a 2.0x accelerator — roughly an 18.3% rate. Tier two: above 150%, a 3.0x accelerator — roughly a 27.4% rate. The steep top tier applies only to a thin slice of bookings, because most of the team finishes below 150%, so the total cost test still passes.

**Decelerator (optional).** Many enterprise plans pair this with a decelerator below 50% attainment — a reduced rate, or zero commission, on the first portion of bookings — to concentrate budget on performers and partially self-fund the steep top tier. If you use one, disclose it plainly; reps dislike surprises far more than they dislike known terms.

**Top of curve.** Uncapped through 250%, with a mandatory windfall clause: any single deal above a defined large-ACV threshold is commissioned under a separately negotiated schedule. In enterprise, the windfall clause is not optional — one transformational deal under an uncapped 3.0x top tier could pay several times OTE on a single transaction, decoupling pay from sustained performance.

**Why two tiers.** A single-tier 3.0x accelerator would be unaffordable across the team in a good year; a single-tier 2.0x would underpay the genuine outliers the plan most wants to retain. The two-tier curve resolves the tension: ordinary overperformance is paid well, exceptional overperformance is paid exceptionally, and the steep rate touches only the dollars that represent true outperformance.

## Section 13 — Accelerators Across The Full Comp System

The accelerator does not live alone. It sits inside a comp *system*, and a change to the accelerator ripples into adjacent components. Operators who design the accelerator in isolation create misalignment elsewhere.

### 13.1 Accelerators And Pay Mix

Pay mix — the base-to-variable split — and the accelerator together determine how much risk the rep carries and how much upside they can reach. A 50/50 mix with a 2.0x accelerator is a balanced, standard SaaS AE posture. A 40/60 mix (more variable) with the same accelerator is a higher-risk, higher-upside plan suited to predictable, high-velocity roles. A 60/40 mix (more base) with the same accelerator is a lower-risk plan suited to long enterprise cycles. The mistake is changing the accelerator without revisiting the mix: making the accelerator steeper while keeping a high base mix can push total comp costs up faster than expected, because the company is now paying both a generous safety net and a generous ceiling.

### 13.2 Accelerators And Quota Setting

The accelerator and the quota are two sides of one coin. A company can produce nearly the same payout curve by setting a moderate quota with a shallow accelerator or an ambitious quota with a steep one. The honest version: quota should be set so that a solid majority of the team can realistically reach 100% — a common planning heuristic is that roughly 60% or more of reps should hit plan in a healthy year — and the accelerator then rewards the genuine overperformance above that. If quotas are set so high that almost no one hits 100%, the accelerator becomes decorative — nobody reaches it — and the plan is really a flat plan in disguise, with all the sandbagging-adjacent problems of low morale and attrition. Set the quota honestly first; let the accelerator do its job above a reachable bar.

### 13.3 Accelerators And SPIFs

A SPIF — a short-term, special-purpose incentive — is a tactical overlay (e.g., a bonus for closing a specific product, a competitive displacement, or business in a slow month). SPIFs and accelerators serve different jobs: the accelerator is the structural, year-round pull past quota; the SPIF is a temporary nudge toward a specific behavior. The failure mode is stacking so many SPIFs on top of the accelerator that the rep can no longer compute their next-deal value — Test 7 fails — and the structural incentive is drowned by tactical noise. Use SPIFs sparingly, time-box them, and never let them obscure the underlying accelerator curve.

### 13.4 Accelerators And The Revenue Type

Not all ARR is equal, and the accelerator can recognize that. A company prioritizing new logos can run a steeper accelerator on new-logo ARR than on expansion or renewal ARR, so the rep's marginal effort flows to the strategic priority. A company prioritizing net revenue retention can do the reverse. The principle: the accelerator is a steering wheel, not just a throttle — point the steepest multiple at the revenue the company most needs more of.

### 13.5 Accelerators And Crediting Rules

The accelerator interacts with crediting and clawback policy. If a deal that counted toward an accelerated payout churns within a clawback window, the plan must define whether the clawback recovers commission at the base rate or the accelerated rate. The defensible answer: recover at the rate that was actually paid, including the accelerated portion, so the rep does not keep accelerator earnings on revenue that did not stick. Define this in the plan document before it becomes a dispute.

## Section 14 — Operationalizing And Communicating The Accelerator

A perfectly modeled accelerator that reps do not understand is a failed accelerator. The behavioral power of the multiple exists only if the rep can compute, in real time, what the next deal is worth. Operational discipline is therefore part of the design, not an afterthought.

### 14.1 The One-Page Plan Document

Every AE should receive a one-page comp plan that states, in plain language: their OTE, their pay mix, their quota (and ramp schedule if applicable), their base commission rate, their accelerated rate(s) and breakpoint(s), the application method (marginal), the top-of-curve posture (uncapped through X%, windfall clause terms), any decelerator, and the crediting and clawback rules. If the plan cannot fit on one page in readable type, it is too complex — simplify until it does.

### 14.2 The Worked Example In The Plan

Include in the plan document at least two worked examples: one rep at, say, 90% attainment and one at 140%, showing the exact commission math. Reps trust numbers they can reproduce. A worked example also surfaces design errors — if the example produces a payout that looks wrong, the plan is wrong.

### 14.3 The Live Commission View

Reps should be able to see their attainment and projected commission continuously, not only at quarter-end. Modern commission tooling — the category includes platforms such as QuotaPath, CaptivateIQ, Spiff, and similar — exists to make the payout curve visible in real time. When a rep can see that closing one more deal moves them across a breakpoint and changes their marginal rate, the accelerator does its behavioral job. When the math is opaque until payroll, the incentive is muted.

### 14.4 The Annual Review Cadence

Comp plans, including accelerators, should be reviewed annually against actuals. The review re-runs the eight diagnostics in Section 8 with the year's real attainment distribution: did the blended cost of sale land where planned? Did the accelerator pull deals forward or did sandbagging persist? Did the top-rep test hold? Did a windfall break the model? The accelerator multiple that was correct last year may need to move as the segment matures, the product changes, or the team's distribution shifts.

### 14.5 Change Management When The Multiple Moves

When the accelerator changes year over year, communicate the *why*, not just the *what*. Reps read a steeper accelerator as good news and a shallower one as a pay cut even when total expected comp is unchanged. Frame changes in terms of the full payout curve and expected earnings at realistic attainment, show the worked examples, and give the team enough lead time to absorb the change before the new plan year begins. A well-modeled accelerator rolled out badly still damages trust and retention.

## Section 15 — Stage And Maturity: How The Accelerator Should Evolve

A company's correct accelerator is not fixed — it shifts as the business matures, and a plan that was right at Series A is often wrong at scale.

### 15.1 Early Stage — Land Grab

At an early-stage company chasing logos and product-market-fit signal, the accelerator should be aggressive and the message should be unambiguous: overperformance is the most valuable thing a rep can produce, and the company will pay generously for it. Early-stage plans often run on the steeper side of the range — 2.2x to 2.5x single-tier — and almost always uncapped. The reasoning: at this stage every incremental logo is strategically worth more than its bare ARR (it is proof, a reference, a case study, a wedge into a segment), the headcount is small enough that the total cost of an aggressive accelerator is manageable, and the company needs to attract A-player reps away from established competitors who can offer stability. Affordability discipline still applies — the kill switch is the total cost test — but early-stage tolerance for a high marginal cost of sale on upside is genuinely higher.

### 15.2 Growth Stage — Repeatability

As the company finds repeatability and scales the sales org, the accelerator should moderate toward the modal 2.0x and the plan should become more structured — two tiers for the segments that need them, clearer breakpoints, explicit windfall clauses. The reason is that the team is now large enough that an over-steep accelerator compounds into a real budget line, and the attainment distribution is becoming knowable, so the plan can be tuned with data rather than guessed. This is the stage where the eight diagnostics become a formal annual ritual rather than an informal check.

### 15.3 Scale Stage — Efficiency

At scale, with a large sales org and investor scrutiny on the efficiency of growth, the accelerator is tuned tightly against the blended comp cost of sale, segment by segment. The headline multiple may still be 2.0x, but the surrounding structure — decelerators in enterprise, careful breakpoint placement, windfall clauses, revenue-type differentiation — does the work of keeping the plan affordable across thousands of reps and a wide attainment distribution. The discipline at scale is consistency and predictability: the plan must be defensible to finance, the board, and the reps simultaneously.

### 15.4 The Through-Line

The constant across all stages is the method, not the number. Early stage tolerates a steeper multiple; scale demands a tighter one; but at every stage the accelerator is derived from base rate, acceptable marginal cost of sale, and the real attainment distribution, and at every stage it is pressure-tested with the eight diagnostics. The number moves; the discipline does not.

## Section 16 — A Reference Checklist For Designing Or Auditing An Accelerator

Use this as the final pass before a plan ships.

1. **Foundation fixed.** OTE, pay mix, quota, and target variable comp are decided for the segment, and the base commission rate is derived from target variable divided by quota.
2. **Multiple derived, not copied.** The accelerated rate comes from an explicit decision about acceptable marginal cost of sale on upside ARR; the multiple is the quotient, not the starting point.
3. **Marginal application.** The accelerator applies only to dollars above quota — no retroactive re-rating, no 99%-to-101% cliff.
4. **Curve shape matches segment.** Single tier for SMB and simple mid-market; two tiers for enterprise and wide-distribution teams; breakpoint placed where the "exceptional" message should land.
5. **Total cost-of-sale test passed.** The real attainment distribution run through the full curve produces a blended comp cost of sale inside the target band.
6. **Good-year test passed.** The plan is still affordable under a fat-tailed, high-attainment distribution, not just the planned one.
7. **Top of curve set.** Uncapped through the normal overperformance range; genuine windfalls handled by a separate, disclosed clause; no punitive hard low cap for new-business AEs.
8. **Ramp handled.** The accelerator applies to ramped quotas for new reps; any fast-ramp earnings quirk is modeled so finance is not surprised.
9. **Decelerator decided and disclosed.** If a below-quota decelerator is used, it is explicit in the plan document.
10. **Crediting and clawback defined.** The plan states how churned deals claw back accelerated commission and how the accelerator treats different revenue types.
11. **Communication test passed.** A rep can state their base rate, accelerated rate, breakpoints, and next-deal value in under sixty seconds; the plan fits on one page with worked examples.
12. **Live visibility in place.** Reps can see attainment and projected commission continuously, so the accelerator drives behavior in real time, not just at payroll.
13. **Annual review scheduled.** The eight diagnostics will be re-run against actuals every year, and any change to the multiple is communicated with its rationale and the full payout curve.

If every box is checked, the accelerator is doing its three jobs — defeating the quota cliff, funding itself from overperformance, and retaining the best reps — and it is doing them affordably and defensibly.

## Section 17 — Edge Cases And Hard Questions

Real comp design runs into situations the clean framework does not directly cover. Here is how to reason through the most common ones.

### 17.1 The Mega-Deal That Dwarfs Quota

A rep closes a single deal worth more than their entire annual quota. Under an uncapped 2.5x accelerator, the rep could earn four or five times OTE on one transaction. Is that right? The honest answer is that it is *partly* right and *partly* a windfall. The rep genuinely did exceptional work and deserves exceptional pay — throttling it to zero destroys trust and tells every rep that big swings are not worth chasing. But paying the full uncapped accelerated rate decouples comp from sustained performance and can break the budget. The standard resolution is the windfall clause: deals above a defined ACV threshold are commissioned under a separately negotiated schedule, typically still generous but moderated above the threshold, and disclosed in advance. The rep wins big; the company keeps the model intact. The key word is *in advance* — a windfall clause invented after the deal closes is a clawback in disguise and poisons trust.

### 17.2 The Rep Who Games The Calendar

A rep at 130% in December, facing a marginal accelerator, has every reason to keep closing — the post-quota dollar is worth double. But a rep at 95% in late December facing a *retroactive* accelerator has a perverse incentive: if crossing 100% re-rates the whole year, they will move heaven and earth to cross, even pulling deals with bad terms or discounting heavily. And a rep at 160% might park a deal into next year to bank a fast start. Marginal application eliminates the first perversion. The second — sandbagging a strong year's tail into the next period — is harder; it is mitigated by uncapped design (no reason to park if there is no cap) and by quota-setting that does not punish a great year with an unreachable next-year quota.

### 17.3 Mid-Year Quota Changes

A rep's territory expands or contracts mid-year, or the company re-segments. The accelerator must travel with a re-set quota cleanly: the rep's attainment-to-date should be re-expressed against the new quota, and the accelerator applies above the new 100%. The failure mode is a rep who was at 110% under the old quota suddenly at 70% under a larger new one, with no recognition of the work already done — that is a retention event waiting to happen. Pro-rate fairly and communicate the math.

### 17.4 Team Selling And Split Credit

When two reps split a deal, the accelerator applies to each rep's *credited* portion against *their* quota. A deal that pushes one rep over quota and leaves the other below means one rep earns the accelerated rate on their share and the other earns base — which is correct, because the accelerator is a function of individual attainment, not deal size. Define the split-credit rules before the quarter, not after.

### 17.5 The Underperformer Who Never Reaches The Accelerator

If a rep consistently finishes at 60% to 80%, the accelerator is irrelevant to them — they never reach it. That is not an accelerator problem; it is a hiring, enablement, territory, or quota problem. Resist the temptation to "fix" chronic underperformance by lowering the bar at which the accelerator kicks in; that just makes the plan a flat plan and tells performers their overperformance is unrewarded. The accelerator's job is to reward the top of the distribution; the bottom is managed through performance management, not comp redesign.

### 17.6 When To Leave The Plan Alone

A final hard question: when *not* to change the accelerator. If the plan passes the eight diagnostics, the team understands it, the blended cost of sale is in band, and the behavior is right — leave it alone. Comp plan churn has a real cost: every change resets rep mental models, invites suspicion, and consumes RevOps and finance cycles. The discipline of *not* tinkering with a working accelerator is as important as the discipline of designing one well. Change the multiple when the diagnostics say to, the business stage shifts, or the strategy changes — not because a competitor advertised a bigger number.

## Section 11 — Frequently Asked Questions

**Is 2x the right accelerator for my company?**
2.0x is the modal SaaS AE accelerator and a safe default if you must pick blind. But it is only *right* if it falls out of your own base-rate and cost-of-sale math. Run Sections 4 and 10. If 2.0x survives the total cost-of-sale test against your real attainment distribution, use it. If it does not, the math will tell you whether you need 1.7x or 2.4x.

**Should the accelerator apply marginally or retroactively?**
Marginally. The elevated rate should hit only the dollars above quota. Retroactive accelerators create cliffs between 99% and 101% attainment that invite sandbagging and disputes. Marginal application is the SaaS standard for good reason.

**Should I cap the accelerator?**
For new-business AEs, avoid a hard low cap — it directly funds sandbagging and repels A-players. Keep the plan uncapped through the normal overperformance range (to ~250%-300%) and manage the rare transformational deal with a separate, disclosed windfall clause rather than a blunt cap.

**How does the accelerator differ by segment?**
SMB and velocity AEs cluster at 1.3x to 1.8x because high deal volume makes attainment predictable and affordable. Mid-market sits around 2.0x. Enterprise runs 2.0x to 3.0x, usually via a two-tier curve, because low deal counts make each deal lumpy and risky and reps must be compensated for that volatility.

**Why is the multiple the wrong thing to benchmark?**
Because two plans with different multiples can have identical post-quota economics if their base rates differ, and identical multiples can produce wildly different total costs if attainment distributions differ. Benchmark the effective post-quota commission rate and the blended payout curve, not the lone multiple.

**What is a decelerator and should I use one?**
A decelerator pays a reduced commission rate below some attainment threshold (e.g., below 60%), concentrating budget on reps who perform and partially self-funding the accelerator. Decelerators are common in enterprise, controversial with reps, and they make any headline accelerator cheaper than it looks. Use one if affordability is tight and your culture can absorb it, but communicate it transparently.

**Where should the second-tier breakpoint go?**
Where you want the "exceptional" message to land — commonly ~150% of quota. Set it so the top tier rewards only genuine outliers given your real distribution, not everyone who beats plan by a few points.

**How do accelerators interact with ramping new reps?**
Apply the accelerator to the rep's *ramped* (reduced) quota during ramp so the pull-forward incentive stays alive and the rep is rewarded against the goal they were actually given. Watch for the quirk where a fast-ramping rep on a low quota out-earns a struggling tenured rep; model it so finance is not surprised, and moderate the multiple during ramp if the quirk is large.

**Bottom line:** the typical SaaS AE accelerator past 100% of quota is 1.5x to 2.5x, with 2.0x the modal answer — but the multiple should be derived from your base rate, your acceptable marginal cost of sale, and your real attainment distribution, not copied. Build the curve, run the eight diagnostics, keep the structure communicable and the upside uncapped through the normal range, and the accelerator will do its three jobs: defeat the quota cliff, fund itself from overperformance, and keep your best reps.
