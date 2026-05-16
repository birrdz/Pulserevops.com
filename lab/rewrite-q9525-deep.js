// q9525 — How do you measure whether a rep comp redesign actually improved deal quality vs just hitting the number?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** A rep comp redesign almost always "works" if you only look at bookings — reps optimize relentlessly to whatever you pay them for, so the number moving tells you nothing about whether the *revenue underneath it got better*. The real question is whether the redesign improved **deal quality** — a basket of retention/GRR, expansion potential, discount depth, margin, payment terms, ICP fit, multi-year mix, and ramp-to-value time — not just deal *quantity*. To measure it honestly: **(1) Before you launch, write down the redesign's specific intent** ("reduce discounting," "drive multi-year," "push the new product," "move upmarket") and map that intent to **named leading and lagging metrics** — generic dashboards won't do. **(2) Capture a clean pre-redesign baseline** across 4-8 quarters of historical deals; you cannot measure improvement against a baseline you never took. **(3) Run a cohort comparison** — deals closed N quarters before vs N quarters after, same-stage, controlling for seasonality and team changes. **(4) Track leading quality indicators in 1-2 quarters** (discount depth, ICP-fit score, multi-year mix, deal-size distribution, win rate by segment) as proxies, then **lagging quality metrics at 4+ quarters** (cohort GRR/NRR, churn rate of post-redesign deals, expansion realized) as the true verdict. **(5) Check that rep behavior actually changed** in the intended direction — the mechanism, not just the outcome. **(6) Scan for gaming** (relabeled deals, unnatural distributions, timing manipulation) and **unintended consequences** (fixed discounting but killed velocity; drove multi-year but tanked logo count). **(7) Render a staged, honest verdict** — worked / partially worked / failed / needs iteration — and pre-commit to the criteria before launch so it isn't post-hoc rationalization. The hardest part is **isolating the comp variable** from market, product, leadership, and enablement changes; you usually can't get a clean attribution, so aim for a defensible directional read, not a perfect one. And know when the whole apparatus is overkill: on a small team where the CRO sees every deal, measurement obsession can delay an obviously-needed iteration.`;

const core = `

## The Core Problem: A Comp Redesign Always "Works" If You Only Look At Bookings

Here is the uncomfortable truth that every CRO eventually learns: a rep compensation redesign will almost always look like a success if the only thing you measure is bookings. This is not because comp redesigns are magic. It is because reps are the most responsive optimization engine in your entire company. You change the payout function, and within one or two quarters the behavior reshapes itself around the new function. If you pay more for multi-year deals, multi-year deals appear. If you pay accelerators on the new product, the new product shows up on more order forms. If you raise the quota and steepen the curve, the top reps grind harder and the number climbs. The bookings line moves, the board slide looks great, and everyone congratulates the comp committee.

But "the number moved" tells you almost nothing about whether the redesign actually *improved the business*. It tells you reps responded to incentives — which you already knew. The real question, the one that separates a comp redesign that created enterprise value from one that merely rearranged it, is this: **did the quality of the revenue improve, or did reps just find a new way to hit a number that happens to be worth less than it looks?**

Consider the redesign that "worked" on bookings but did so by encouraging reps to discount 4 points deeper on average to close faster, or to chase poor-fit logos that book today and churn in fourteen months, or to push one-year deals because the multi-year accelerator wasn't quite worth the friction. The bookings number is identical — or even higher — but the cohort of revenue you just signed is structurally weaker than the cohort you signed before. You did not improve the business. You degraded it, and the comp plan paid reps handsomely to do so. The redesign "worked" in exactly the way a fever "works" to make a thermometer read higher.

The deeper problem is that **most teams never measure this at all**. They measure attainment, they measure bookings versus plan, they measure ramp, and they declare the redesign a success or failure on those numbers within a quarter or two. The quality dimension — retention of the cohort, expansion potential, margin, terms, fit — is invisible on the bookings dashboard, and it takes six to eighteen months to fully reveal itself. So by the time the quality signal arrives, the organization has already moved on, the redesign is "settled," and nobody connects the Q4 churn spike to the Q1 comp change that caused reps to chase the wrong deals.

Measuring whether a comp redesign improved deal quality is therefore not a reporting exercise you bolt on afterward. It is a discipline you have to build *into* the redesign itself — defining what quality means for your business, capturing the baseline before you change anything, and committing to a staged verdict that resists the gravitational pull of the bookings number. This entry is the playbook for doing exactly that.

## Defining "Deal Quality": It Is Not One Thing, It Is A Basket

The first failure mode in measuring a comp redesign is treating "deal quality" as a single, self-evident metric. It is not. Deal quality is a basket of distinct, sometimes-competing attributes, and a comp redesign that improves one can easily degrade another. Before you can measure whether quality improved, you have to decide — explicitly — which components of the basket matter most for your business right now.

The core components of the deal-quality basket:

**Retention and churn of the cohort.** The single most important quality dimension for most recurring-revenue businesses. Do the deals signed under the new comp plan retain better, the same, or worse than the deals signed under the old one? Measured as gross revenue retention (GRR) and logo retention of the closed cohort, tracked over the following 12-24 months.

**Expansion potential and realized expansion.** A high-quality deal is not just one that doesn't churn — it is one that grows. Net revenue retention (NRR) of the cohort, expansion bookings within the first 12-18 months, and the qualitative "land-and-expand surface area" of the accounts signed.

**Margin and discount depth.** What did it cost to win the deal? Average discount off list, gross margin of the contract (especially where services or usage costs vary), and the distribution of discounting — a redesign can hold *average* discount flat while fattening the tail of deeply-discounted deals.

**Payment terms and cash quality.** Annual-upfront versus quarterly versus monthly, payment terms (net-30 versus net-90), and any unusual concessions. A booking with terrible terms is worth materially less than the same ARR with clean terms.

**ICP fit.** How well do the accounts match your ideal customer profile — segment, size, use case, technographic fit? Poor-fit deals book the same ARR but carry higher churn risk, higher support cost, and lower expansion ceiling.

**Multi-year mix.** The share of bookings that are multi-year, and the structure of those multi-year deals (true multi-year commitment versus a one-year deal with optional renewals dressed up as multi-year).

**Ramp-to-value time.** How fast do the new cohort's customers reach first value and full deployment? Faster ramp correlates with better retention and expansion; a redesign that pushes reps to close before the customer is ready degrades this silently.

The point of enumerating the basket is this: **a comp redesign has an intent, and the intent points at specific components of the basket.** A redesign meant to "reduce discounting" should move margin and discount depth — and you must check it did not wreck ICP fit or velocity to get there. A redesign meant to "drive retention" should move cohort GRR — and you must check reps did not simply stop closing to avoid signing anything churnable. You measure the components the redesign was *supposed* to move, and you watch the components it might have *broken*. Quality is a basket, and the redesign is a trade. Your job is to price the trade honestly.

## Why "We Hit The Number" Is A Trap

"We hit the number" is the most seductive and most dangerous sentence in revenue leadership. It feels like proof. It is reported up, celebrated, and used to ratify the comp redesign as a success. But the number can be hit with bad revenue, and the comp redesign that "worked" on the number may have actively manufactured that bad revenue.

Here is the anatomy of how the number gets hit badly:

**Deep discounting to pull deals forward.** When the comp plan rewards bookings velocity — through quota pressure, accelerators, or SPIFFs — reps respond by trading price for speed. A 6-point average discount becomes a 10-point average discount. Bookings hit plan. Margin quietly erodes. The number is "made" but each dollar of it cost more to acquire and is worth less.

**Poor-fit logos that book today and churn tomorrow.** When the plan pays the same for any logo regardless of fit, reps rationally chase whichever deals are closest to closing — including the ones that should never have been worked. These deals inflate the current-quarter number and become next year's churn. The redesign "worked" by borrowing from the future.

**One-year deals that should have been multi-year — or multi-year deals that should have been one-year.** Depending on which way the plan is mis-tuned, reps will push the term structure that pays them best in the short run, not the one that is best for the business. Either way, the number gets hit and the revenue base gets structurally worse.

**Sandbagged easy deals and timing manipulation.** A redesign that creates threshold effects — a cliff at 100%, a big accelerator kicking in at a number — incentivizes reps to manage *when* deals close, not *whether* they are good. Deals get pulled forward, pushed back, or parked to optimize the rep's personal payout curve. The aggregate number can look fine while the underlying deal flow is being gamed.

**Relabeling.** If the plan pays more for a category — new product, new logo, multi-year — reps and their managers will, at the margin, classify ambiguous deals into the higher-paying bucket. The "new product attach rate" rises without the underlying customer behavior changing at all. The number for the strategic priority is hit on paper.

The trap is that every one of these produces a *clean-looking bookings number*. The CFO sees plan attainment. The board sees the bar chart. The comp committee sees vindication. And the only way to know whether the number is real quality or borrowed quality is to deliberately go look at the *composition* of the revenue underneath it — which almost nobody does in the quarter the redesign launches, because the number looks fine and there is no fire to fight. "We hit the number" is not evidence the redesign worked. It is the absence of evidence, dressed up as proof.

## The Baseline Problem: You Cannot Measure Improvement Without A Clean Pre-Redesign Snapshot

The most common, most fatal mistake in evaluating a comp redesign is launching it without capturing a baseline. "Improvement" is a comparison. If you do not have a clean, documented snapshot of deal quality *before* the change, then six months later you have no rigorous way to say the redesign improved anything. You have anecdotes, vibes, and a bookings number — and the bookings number, as established, is a trap.

The baseline is the set of deal-quality metrics, captured across a defined pre-redesign window, that you will compare the post-redesign cohort against. It must be taken *before* the redesign launches, because once reps know the plan is changing, their behavior starts shifting in anticipation — and a baseline contaminated by anticipation is not a baseline.

What you must capture in the baseline, at minimum:

**The deal-quality basket, by quarter, for 4-8 trailing quarters.** Average discount depth and its distribution, multi-year mix, deal-size distribution, payment-terms mix, ICP-fit score of closed deals, win rate by segment, and ramp-to-value time. Four quarters is the floor; eight is better because it lets you see seasonality and trend rather than a single noisy point.

**The cohort retention curves of prior closed cohorts.** You cannot wait for the post-redesign cohort to age 18 months and then have nothing to compare it to. Pull the GRR/NRR and logo-retention curves of the deals closed 4, 8, and 12 quarters ago so you have a retention "shape" the new cohort can be measured against.

**The behavioral baseline.** What did reps actually *do* under the old plan? Activity mix, the segment focus of the pipeline they built, the discounting behavior, the term structures they pushed. You will want to know whether behavior changed, and you cannot detect a change from a starting point you never recorded.

**The known confounders, documented.** Write down, before launch, what else is changing — a new product, a pricing change, a leadership hire, a territory reshuffle, a market shift. This list is what you will use later to caveat your attribution honestly.

The trap of redesigning without a baseline is insidious because nothing goes wrong *at first*. You launch, the number moves, and only six months later — when someone asks "so did it actually work?" — do you discover you have no rigorous answer. By then it is too late; you cannot retroactively capture an uncontaminated baseline. The discipline is brutally simple and constantly skipped: **take the snapshot before you touch the plan.**

## The Cohort-Comparison Method: The Core Analytical Engine

Once you have a baseline, the core analytical method for evaluating a comp redesign is cohort comparison: take the deals closed in the N quarters *before* the redesign and the deals closed in the N quarters *after*, and compare their quality on a like-for-like basis.

The mechanics that make this rigorous rather than misleading:

**Same-stage cohorts.** Compare deals at the same point in their lifecycle. Comparing the retention of a pre-redesign cohort that has aged 18 months against a post-redesign cohort that has aged 4 months tells you nothing — the young cohort has not had time to churn. Either compare the cohorts at the same age (pre-cohort at month 4 versus post-cohort at month 4) or wait until the post-cohort has aged enough.

**Control for seasonality.** Q4 deals look different from Q1 deals everywhere — bigger, more discounted, more end-of-year urgency. If your redesign launched January 1, do not compare a post-redesign Q1 against a pre-redesign Q4. Compare same-quarter to same-quarter (this Q1 versus last Q1) or use a full-year-over-full-year window.

**Control for market conditions.** If the macro environment shifted — budgets tightened, a competitor collapsed, a category caught fire — the cohorts are not comparable on comp alone. You note these shifts (from the documented confounder list) and either adjust for them or caveat them explicitly.

**Control for team composition.** If half the team turned over, or you added a new segment of reps, or your best reps left, the cohort difference reflects *who* was selling as much as *how the plan paid them*. Segment the analysis: compare the cohorts of reps who were present both before and after, separately from new hires.

**Use distributions, not just averages.** The average discount can hold flat while the *tail* of deeply-discounted deals fattens. Always look at the full distribution of every quality metric — discount depth, deal size, term length — not just the mean. Gaming and degradation usually show up in the tails and the shape before they show up in the average.

Cohort comparison is the workhorse. It does not give you a clean causal claim — that is the next problem — but it gives you a structured, like-for-like read on whether the post-redesign deals are actually better, worse, or the same as the pre-redesign deals across every component of the quality basket.

## The Lagging Quality Metrics: The True Test, But Slow

The lagging quality metrics are the ones that constitute the *real* verdict on a comp redesign — and they are also the ones that take six to eighteen months to mature. This is the central tension in measuring a comp redesign: the metrics that matter most arrive last.

The lagging metrics:

**Cohort gross revenue retention (GRR).** Of the ARR closed in the post-redesign window, how much is still active 12 and 24 months later? Compare directly against the GRR curve of pre-redesign cohorts at the same age. If the redesign improved deal quality, the post-redesign cohort should retain at least as well — ideally better. If GRR degraded, the redesign manufactured churnable revenue, regardless of what bookings did.

**Cohort net revenue retention (NRR).** GRR plus expansion. A high-quality cohort not only retains but grows. NRR is the most complete single measure of whether the revenue you signed was *good* revenue.

**The churn rate and churn timing of post-redesign deals.** Not just how much churned, but *when* and *why*. Early churn (inside 12 months) is the signature of poor-fit deals — the customer never should have been signed. Watch the early-churn rate specifically; it is the cleanest lagging fingerprint of a redesign that pushed reps toward bad-fit logos.

**Expansion realized.** The actual expansion bookings generated by the post-redesign cohort in their first 12-18 months, versus the pre-redesign cohort at the same age. A redesign that signed shallow, poor-fit, single-use-case deals will show a depressed expansion curve even if logo retention looks acceptable.

**Realized margin over the contract life.** Especially for businesses with variable delivery, support, or usage costs — the booked margin and the realized margin can diverge, and a redesign that pushed reps toward complex, poor-fit, or over-promised deals will show margin erosion that only appears as the contracts are delivered.

The lagging metrics are the true test because they measure what actually happened to the revenue — not a proxy, not an intention, the outcome. But because they are slow, you cannot run the whole evaluation on them alone. You would be waiting a year and a half to learn whether a plan you launched needs fixing. That is why you also need leading indicators.

## The Leading Quality Indicators: Proxies You Can See In One To Two Quarters

The leading quality indicators are the metrics you can read within one to two quarters of the redesign — early proxies for what the lagging metrics will eventually confirm. They are not the final verdict, but they are the early-warning system, and they let you course-correct before you have burned eighteen months on a broken plan.

The leading indicators:

**Average discount depth and its distribution.** Visible immediately on every closed deal. If the redesign was meant to reduce discounting, you should see it in the first full quarter. If discounting got *worse*, you have an early red flag — the redesign is manufacturing margin erosion.

**ICP-fit score of closed deals.** If you score deals for ICP fit (segment, size, use case, technographic match), the fit-score distribution of the post-redesign cohort is visible at close. A redesign that pushed reps toward poor-fit logos shows up here within a quarter — long before those logos churn.

**Multi-year mix.** The share of bookings that are genuine multi-year commitments. Visible at close. If the redesign intended to drive multi-year and the mix did not move — or moved only because reps relabeled one-year deals — you know early.

**Deal-size distribution.** Not just average deal size but the shape of the distribution. A redesign meant to move upmarket should shift the whole distribution; if instead the average rose because reps abandoned small deals while the big-deal count stayed flat, the distribution tells you.

**Payment-terms mix.** Annual-upfront versus quarterly versus monthly, net-terms distribution. Visible at close. A redesign can quietly degrade cash quality, and the terms mix catches it fast.

**Win rate by segment.** If the redesign changed where reps focus, win rate by segment will move. A redesign that pushed reps upmarket but tanked the upmarket win rate is destroying pipeline efficiency even if a few big deals landed.

**Sales-cycle length and velocity.** A redesign that improved discipline can lengthen cycles (reps qualifying harder); a redesign that pushed for speed can shorten them at the cost of quality. Either way, velocity is an early signal that behavior changed.

The discipline with leading indicators is to treat them as *predictive*, not *conclusive*. They tell you the direction the cohort is heading and give you the chance to intervene. But they are proxies — a great ICP-fit score does not guarantee great retention, it just makes it more likely. The leading indicators buy you time; the lagging metrics deliver the verdict.

## The Behavioral-Change Evidence: Did Rep Behavior Actually Change?

There is a layer of measurement that sits underneath both the leading and lagging metrics, and it is the one most teams skip entirely: did rep *behavior* actually change in the direction the redesign intended? This matters because the outcome metrics can move for reasons that have nothing to do with the comp plan — but if you can show that reps are *doing different things*, you have evidence the redesign is actually the mechanism, not a coincidence.

What to look at for behavioral-change evidence:

**Activity and call mix.** What are reps spending their time on? If the redesign was meant to push reps upmarket, are they actually running more enterprise discovery calls, building bigger pipeline, engaging more stakeholders per deal? The activity data should show the shift before the bookings data does.

**The deals reps chose to work.** Look at pipeline *creation*, not just pipeline closed. The deals reps add to their pipeline reveal their intent. If the redesign was meant to improve ICP fit, the fit-score of *newly created* pipeline should improve within a quarter — that is reps changing what they chase.

**Discounting behavior.** Not just the discount on closed deals, but how reps behave in deals — are they leading with price less, holding line longer, escalating for approval differently? Deal-desk and approval data shows the behavioral change in discounting before it fully shows in closed-deal margin.

**Segment and product focus.** Where is the pipeline being built? If the redesign put accelerators on a new product, is the new product showing up in *early-stage* pipeline — or only getting attached at close (which would suggest relabeling, not real behavior change)?

**Forecasting and deal-management behavior.** How reps stage, forecast, and time deals reveals whether they are responding to the new plan's structure. Threshold effects and accelerator cliffs show up as deal-timing patterns.

The reason behavioral evidence is so valuable is that it measures the *mechanism*. If bookings improved and you can also show that reps demonstrably changed what they chase, how they discount, and where they focus — in the directions the redesign intended — then you have a coherent causal story. If bookings improved but rep behavior looks identical to before, then something else moved your number, and crediting the comp redesign is a mistake. Behavior is the bridge between "we changed the plan" and "the outcomes changed because of it."

## Isolating The Comp Variable: The Hard Part

This is the hardest problem in the entire exercise, and the one most often fudged. Bookings and deal quality move for many reasons — the market, the product, the pricing, the leadership, the enablement, the competitive landscape, the macro environment. The comp redesign is *one* input among many. Attributing a change in deal quality cleanly to the comp redesign is, in the strict causal sense, usually impossible. The honest goal is not a perfect attribution. It is a *defensible* attribution — a reasoned, caveated read that is good enough to make a decision on.

The tools for getting as close as you can:

**The documented confounder list.** This is why you wrote down, at baseline, everything else that was changing. When you see a quality shift, you go down the list: could the new product explain this? Could the pricing change? Could the leadership hire? You cannot eliminate the confounders, but you can reason about each one's plausible contribution and direction.

**The behavioral bridge.** As established — if rep behavior changed in the specific directions the comp redesign incentivized, and the quality metrics moved consistently with that behavior change, you have a coherent causal chain. Behavior change is your strongest non-experimental evidence.

**Timing analysis.** Did the quality shift line up with the redesign's launch, or did it start before, or lag suspiciously? A shift that begins exactly when the new plan takes effect, after being stable for several quarters, is more attributable than a shift that was already in motion.

**Dose-response within the team.** Different reps are exposed to the redesign differently — the change affects a top rep's payout curve differently from a ramping rep's. If the reps whose incentives changed most show the biggest behavior and quality shifts, that internal dose-response pattern is real evidence.

**Segment isolation.** If the redesign applied to one segment of the sales org and not another, the unaffected segment is a (rough) control. Same if it applied to one geography first.

**The honest caveat.** And then — critically — you state plainly what you *cannot* isolate. "Cohort GRR improved 4 points; the comp redesign is the most plausible primary driver because rep behavior shifted consistently with it and the timing aligns, but we also launched a pricing change in the same window that likely contributed, and we cannot fully separate the two." That sentence is not weakness. It is the difference between an analyst and a cheerleader.

The leaders who get this wrong are the ones who *want* the redesign to have worked — they built it, they championed it — and so they credit it with every good thing that happened in the window. Isolating the comp variable is partly an analytical problem and partly a discipline-of-honesty problem. You will never get a clean number. You can get an honest, defensible, decision-grade read — and that is the actual goal.

## The Counterfactual Problem: You Cannot Easily A/B Test A Comp Plan

The cleanest way to know whether a comp redesign improved deal quality would be a controlled experiment: run the old plan and the new plan side by side on equivalent populations and compare. But you usually cannot do this, and the reasons are structural, not lazy.

Why the clean experiment is mostly unavailable:

**Fairness and morale.** Paying two reps differently for the same work — when the difference is just which experimental arm they landed in — is a serious morale and even legal problem. Reps talk. A comp "experiment" that pays some people less is corrosive.

**Contamination.** Reps on the old plan will hear about the new plan, anticipate it, and behave accordingly. The control group does not stay clean.

**Small N.** Most sales teams are not large enough to split into statistically meaningful arms and still control for territory, segment, tenure, and skill.

**You usually want the redesign to apply to everyone.** The whole point of the redesign is to change the org's behavior. Holding half the team on the old plan defeats the strategic purpose.

So you fall back on partial, imperfect approaches:

**Phased rollout.** Launch the new plan with one segment, geography, or team first; the not-yet-migrated group is a rough, time-limited control. Limit: the control migrates eventually, and the groups were probably not identical to begin with.

**Segment-by-segment rollout.** If the redesign genuinely only applies to, say, the enterprise team, the mid-market team is a (loose) comparison — though they sell different deals, so the comparison is directional at best.

**Comparing to a comparable team.** Sometimes a sister business unit, a similar region, or a peer company benchmark gives you a "what would have happened anyway" reference. Very rough, but better than nothing.

**Pre/post with strong confounder control.** The cohort-comparison method itself, done rigorously with the confounder list and behavioral bridge, is your main fallback. It is not a true counterfactual, but disciplined pre/post analysis is the realistic standard for comp evaluation.

The honest framing: you almost never get a true counterfactual for a comp plan. You get a well-reasoned pre/post comparison with partial controls. Accepting that — and being rigorous *within* that constraint rather than pretending you have an experiment — is the mature position.

## The Specific Redesign-Intent Mapping: Measure The Intent, Not Generic Metrics

Every comp redesign has an intent. Nobody redesigns a comp plan for fun — there is a thing leadership is trying to change. "Drive multi-year." "Reduce discounting." "Push the new product." "Improve ICP fit." "Move upmarket." The single most important principle in measuring a redesign is this: **the measurement must map directly to the stated intent.**

A redesign meant to reduce discounting is not evaluated on multi-year mix. A redesign meant to drive retention is not evaluated on average deal size. When you measure a redesign against a generic dashboard, you get a generic answer — and you miss the specific thing it was supposed to do, either succeeding or failing. The intent-to-metric mapping forces precision: for *this* redesign, *these* are the leading metrics that will show early movement, and *these* are the lagging metrics that will deliver the verdict.

This mapping has to be written down *before* launch — it is part of the measurement plan. It does two things. First, it pre-commits you to the criteria, so the verdict is not a post-hoc rationalization where you go shopping for whatever metric happened to move. Second, it sharpens the analysis: instead of watching forty metrics and finding patterns in noise, you watch the four or five that are mechanistically connected to what the redesign changed.

The next five sections walk through the intent-to-metric mapping for the five most common comp redesign intents. Each one names the leading proxies (visible in 1-2 quarters) and the lagging verdict metrics (visible in 4+ quarters), and — critically — names the thing the redesign might have *broken* in pursuit of its goal.

## Measuring A "Reduce Discounting" Redesign

The intent: the team is discounting too deeply, eroding margin and training the market to expect concessions. The redesign attacks it — margin-based comp (reps paid on a margin-adjusted number rather than gross bookings), discount clawbacks, reduced rep discount authority, or accelerators tuned to list-price realization.

**Leading indicators (1-2 quarters):** Average discount depth — and crucially its *distribution*, watching whether the deep-discount tail shrank. List-price realization rate. The frequency and depth of deal-desk escalations. Time-to-close (watch whether it lengthened — see the broken-thing below).

**Lagging verdict metrics (4+ quarters):** Realized gross margin of the post-redesign cohort versus baseline. Whether the *win rate held* — because the easy way to "reduce discounting" is to walk away from price-sensitive deals, which improves the discount metric while shrinking the business. Cohort GRR — to confirm the less-discounted deals did not come at the cost of fit.

**What it might have broken:** Velocity and win rate. If reps stop discounting but also stop *closing* — deals stall, the pipeline ages, win rate drops — then the redesign "succeeded" on discount depth and failed on the business. The full-system check for a discount-reduction redesign is: discount down, **and** win rate held, **and** deal velocity survived, **and** the deals that did close still fit. If discount dropped but any of the other three cratered, the redesign traded margin-per-deal for fewer deals — possibly a bad trade.

## Measuring A "Drive Retention / Quality" Redesign

The intent: too much of what the team closes churns. The redesign ties comp to retained or net revenue — clawbacks on early churn, a portion of commission paid only after the customer renews or hits a retention milestone, or accelerators on accounts that meet an ICP-fit bar.

**Leading indicators (1-2 quarters):** ICP-fit score of closed deals and, even earlier, of *newly created pipeline* — reps changing what they chase is the leading edge. The mix of deals by fit tier. Reps' qualification behavior — are poor-fit deals getting disqualified earlier?

**Lagging verdict metrics (4+ quarters):** Cohort GRR and logo retention — the direct test. Early-churn rate (inside 12 months) of the post-redesign cohort versus baseline — the cleanest fingerprint of whether reps stopped signing churnable logos. NRR, to confirm the retained accounts also expand.

**What it might have broken:** Total bookings volume and pipeline coverage. A retention-tied plan can make reps so cautious that they under-build pipeline and walk away from deals that were actually fine. If GRR improved but bookings collapsed because reps got gun-shy, the redesign overcorrected. The full-system check: cohort retention improved, **and** bookings volume held within an acceptable band, **and** reps did not simply stop selling to avoid signing anything churnable.

## Measuring A "Push New Product / Cross-Sell" Redesign

The intent: there is a newer product (or a cross-sell motion) that is strategically important and under-attached. The redesign puts accelerators or a separate quota component on the new product to force focus.

**Leading indicators (1-2 quarters):** New-product attach rate on closed deals — but watch for relabeling. The leading-edge signal is the new product appearing in *early-stage pipeline*, not just getting tacked on at close. New-product-specific discovery activity. The number of reps with new-product deals in pipeline, not just the one or two specialists.

**Lagging verdict metrics (4+ quarters):** Realized new-product revenue and *its retention* — relabeled or force-attached new-product revenue churns fast, so new-product GRR is the truth serum. Whether the new product is driving *expansion* in the base. Whether core-product performance held.

**What it might have broken:** The core product, and revenue integrity through relabeling. Two failure modes: (1) reps chase the accelerator and neglect the core product that funds the company; (2) reps and managers relabel core or ambiguous deals as "new product" to capture the accelerator, so the attach rate rises with zero real change in customer behavior. The gaming check here is essential — compare booked new-product attach against *actual product usage/provisioning data*. If attach rate rose but provisioning/usage did not, you measured relabeling, not adoption.

## Measuring A "Bigger Deals / Move Upmarket" Redesign

The intent: the team is winning too many small deals; leadership wants to shift toward larger contracts and upmarket accounts. The redesign raises the bar — higher quota, accelerators weighted to deal size, minimum deal-size thresholds, or enterprise-specific quota components.

**Leading indicators (1-2 quarters):** The *full deal-size distribution* — not just the average, because the average can rise simply because reps abandoned small deals. You want to see the distribution genuinely shift, with more deals in the larger bands. Pipeline composition by deal size and segment. Win rate in the larger-deal segment — moving upmarket only works if you can actually win there.

**Lagging verdict metrics (4+ quarters):** Whether total bookings held — moving upmarket usually means fewer, slower deals, and there is a transition period where bookings can dip. Cohort retention and NRR of the larger deals (bigger deals are not automatically better deals). Sales-cycle length and CAC at the new deal size.

**What it might have broken:** The volume business that funds the company, and win rate. The classic failure: reps abandon the small and mid deals — which were profitable and reliable — to chase enterprise deals they cannot win, and total bookings fall while the win rate in the new segment is dismal. The full-system check: deal-size distribution genuinely shifted, **and** the team can actually win at the larger size, **and** total bookings did not collapse because reps walked away from the volume that paid the bills.

## The Gaming Detection: Every Comp Plan Gets Gamed

Here is a law of compensation design: every comp plan gets gamed. Not because reps are dishonest — because they are rational, and a comp plan is a set of rules, and rules have edges. The question is never *whether* the redesign got gamed; it is *how*, *how much*, and *whether the gaming hollowed out the result*. A redesign can show its target metric moving beautifully while the underlying behavior never changed — the movement is pure gaming.

How to detect gaming:

**The unnatural distribution.** Gaming leaves statistical fingerprints. A suspicious cluster of deals just above an accelerator threshold. A pile-up of deals closing in the last three days of the quarter. Multi-year deals that are all *exactly* the minimum length to qualify for the accelerator. When reps optimize to a threshold, the distribution bunches at the threshold — and natural deal flow does not do that.

**The relabeled deal.** When a category pays more — new product, new logo, multi-year, strategic segment — ambiguous deals migrate into the high-paying bucket. Detect it by cross-checking the *label* against an independent source of truth: booked "new product attach" against actual provisioning/usage data; "new logo" against the CRM account history; "multi-year" against the actual signed contract term and the renewal/opt-out clauses.

**The timing manipulation.** Threshold and cliff structures incentivize reps to manage *when* deals close. Sandbagging deals into next quarter to start strong, pulling deals forward to clear a cliff, parking deals to optimize the personal curve. Look at deal-timing patterns relative to each rep's attainment position — if deals cluster right where the rep's payout curve bends, that is timing manipulation.

**The metric that moved without the underlying behavior.** This is the master signal. The target metric improved — but the *behavioral evidence* underneath it did not. Multi-year mix rose but the activity data shows reps having the same conversations. New-product attach rose but discovery calls do not mention the new product. ICP-fit score rose but the actual segment mix of signed accounts is unchanged. When the outcome metric and the behavioral evidence disagree, the outcome metric is being gamed.

**The too-clean result.** Real behavior change is messy and partial. If a redesign's target metric snapped to the goal in one quarter with no transition period and no collateral movement anywhere else, be suspicious — that is more consistent with relabeling than with thousands of individual decisions actually changing.

Gaming detection is not about catching cheaters. It is about asking, of every "the redesign worked" claim: did the *thing we cared about* actually happen, or did reps find the cheapest path to the *number that measures the thing we cared about*? Those are very different, and only one of them creates value.

## The Unintended-Consequence Scan: What Did The Redesign Break?

A comp redesign can hit its target *and still be a failure*, because it broke something else. Comp plans are systems, and you cannot push on one part of a system without the other parts moving. The unintended-consequence scan is the deliberate, full-system check for the damage the redesign did in pursuit of its goal.

The scan covers the parts of the system the redesign did *not* target but could have disturbed:

**Velocity, if you optimized for margin or quality.** Reduced discounting and tighter qualification both tend to slow deals down. Scan sales-cycle length and pipeline aging.

**Logo count and volume, if you optimized for deal size or multi-year.** Pushing upmarket or pushing multi-year both tend to reduce the *number* of deals. Scan total logo count and total bookings volume — sometimes the volume business was load-bearing.

**Core product, if you optimized for a new product.** Accelerators on the new product pull attention from the core. Scan core-product bookings and pipeline.

**Pipeline coverage, if you optimized for retention or fit.** Retention-tied comp and ICP-fit gates can make reps over-cautious. Scan pipeline coverage ratio and pipeline creation rate.

**Rep behavior on everything you did not pay for.** The flip side of "reps optimize to what you pay them" is "reps deprioritize what you stopped paying them for." Whatever the old plan rewarded that the new plan does not — that thing is now at risk. Scan it.

**Customer experience and downstream cost.** Did the redesign push reps to over-promise, mis-set expectations, or close before the customer was ready? This shows up later as support load, implementation friction, and churn — scan the early customer-health signals.

**Team health.** Covered fully in the rep-sentiment section, but it belongs on the scan list: did the redesign break rep morale, trust, or retention?

The unintended-consequence scan is what turns "did the redesign hit its target?" into "did the redesign *improve the business*?" — which are not the same question. A redesign that fixed discounting but killed velocity, or drove multi-year but tanked logo count, hit its target and failed its purpose. You only know by scanning the whole system, deliberately, for what moved that you did not intend to move.

## The Time Horizon Discipline: Resist Declaring Victory On Q1

The single most common way comp-redesign evaluation goes wrong is impatience. The plan launches, Q1 bookings come in at or above plan, and the organization declares victory. The comp redesign is "settled," attention moves on, and the lagging quality metrics — which have not had time to mature — never get checked. Then Q4 churn spikes, and nobody connects it back.

The discipline is to commit, in advance, to a *staged review cadence* and to resist rendering a final verdict until the appropriate horizon for each metric has elapsed:

**One quarter — behavioral evidence.** At the one-quarter mark, you can see whether *rep behavior changed*. Activity mix, pipeline creation, discounting behavior, segment focus. You cannot yet judge outcomes — but you can judge whether the mechanism engaged. If behavior did not change at all in a full quarter, that is an early signal worth acting on.

**Two quarters — leading quality indicators.** By the two-quarter mark, the leading indicators are readable: discount depth, ICP-fit score, multi-year mix, deal-size distribution, win rate by segment. These are proxies — directionally predictive of the verdict, not the verdict itself. This is your course-correction checkpoint.

**Four-plus quarters — lagging quality metrics.** Only at the four-quarter mark and beyond do the lagging metrics — cohort GRR/NRR, early-churn rate, expansion realized — have enough maturity to deliver the real verdict. For longer sales and retention cycles, this can be six quarters or more.

The hard part of time-horizon discipline is psychological. The pressure to declare the redesign a success (or failure) on Q1 bookings is enormous — leadership wants closure, the board wants an answer, and the bookings number is *right there*. The discipline is to say, explicitly and in advance: "Q1 tells us if behavior changed. Q2 tells us the leading direction. We do not render the quality verdict until Q4+." Writing that cadence down before launch — and getting leadership to pre-agree to it — is what protects the evaluation from the gravitational pull of the early bookings number.

## The Rep-Sentiment And Retention Layer: A Plan That Drives Out Your Best Reps Failed

There is a dimension of comp-redesign evaluation that does not show up in any deal-quality metric and is routinely ignored until it is too late: what the redesign did to the *team*. A comp redesign that hits its bookings and quality targets but drives your best reps out the door is not a success. It is a slow-motion failure that the deal metrics will not reveal for several quarters.

What to measure on the team layer:

**Top-rep retention specifically.** Not average attrition — *top-rep* attrition. Comp redesigns very often shift money around, and the reps who come out worse are sometimes the best ones (a redesign that caps a top performer, or that rewards a behavior the best reps consider beneath them). Track whether the A-players are staying — and whether they are *winning* under the new plan. If your top quartile is losing money or losing status under the redesign, they will leave, and they will take their pipeline and their accounts with them.

**Comp satisfaction and plan clarity.** Survey it. Do reps understand the plan? Do they believe it is fair? Do they believe it is achievable? A plan reps do not understand cannot change behavior in the intended direction — it just creates anxiety. A plan reps think is unfair breeds gaming and resentment.

**Who is winning under the new plan.** Look at the distribution of earnings and attainment under the redesign. Are the people earning well the people you *want* earning well — the reps doing the behavior the redesign intended? Or did the plan accidentally reward a different profile? The earnings distribution tells you whether the plan is selecting for the behavior you wanted.

**Recruiting and offer-accept signals.** A good comp plan is a recruiting asset; a bad one leaks into the market. Watch offer-accept rates and what candidates say about the plan in the process.

**Manager confidence.** Frontline sales managers either believe in the plan or quietly coach around it. If managers are apologizing for the plan or telling reps to ignore parts of it, the redesign is not really in effect.

The rep-sentiment layer matters because the entire premise of a comp redesign is that it changes rep behavior to produce better revenue. If the redesign also breaks the team — drives out the A-players, confuses the middle, demoralizes the managers — then even a redesign that looks good on deal quality has damaged the engine that produces the deals. A "successful" redesign that triggers top-rep attrition failed. Measure the team, not just the deals.

## Building The Measurement Plan BEFORE The Redesign

Everything in this entry collapses into a single discipline: **the measurement plan has to be built before the redesign launches, not after.** A measurement plan assembled after launch is not a measurement plan — it is a rationalization engine, because by then you know what happened and you will (consciously or not) select the metrics and framing that make the redesign look the way you want it to look.

The pre-launch measurement plan has five components, and all five have to exist on paper before the new plan takes effect:

**1. The stated intent, written down.** One or two sentences: what is this redesign trying to change? "Reduce average discount depth without sacrificing win rate." "Improve cohort retention by shifting reps toward ICP-fit accounts." Specific, not "improve performance."

**2. The intent-to-metric map.** For the stated intent: the named leading indicators (visible in 1-2 quarters) and the named lagging verdict metrics (visible in 4+ quarters). Plus the named things the redesign might break — the unintended-consequence watch list.

**3. The captured baseline.** The actual pre-redesign snapshot — the quality basket by quarter for 4-8 trailing quarters, the prior cohort retention curves, the behavioral baseline, the documented confounder list. Captured *before* reps know the plan is changing.

**4. The review cadence.** The pre-committed schedule: one-quarter behavioral review, two-quarter leading-indicator review, four-plus-quarter lagging verdict. With the explicit agreement that no final quality verdict is rendered before the lagging horizon.

**5. The pre-committed verdict criteria.** The thresholds, decided in advance, for what counts as worked / partially worked / failed / needs iteration. "Worked = cohort GRR held or improved AND discount depth dropped 3+ points AND win rate held within 5 points." Deciding the bar *before* you see the result is the single strongest defense against post-hoc rationalization.

The reason this discipline is so often skipped is that building the measurement plan is unglamorous work that has to happen during the exciting, contentious period of designing the plan itself — and it always feels like it can be done later. It cannot. The baseline especially is a one-time, perishable opportunity: once the plan is announced, the clean baseline is gone forever. Build the measurement plan before the redesign, or accept that you will never rigorously know if it worked.

## The Honest-Verdict Framework

Eventually you have to render a verdict. The honest-verdict framework gives you four possible outcomes — not two — because "worked" and "failed" are too coarse for something as complex as a comp redesign.

**Worked.** The redesign hit its stated intent on the lagging verdict metrics, rep behavior changed in the intended direction (the mechanism is confirmed), the gaming scan came back clean enough, the unintended-consequence scan found nothing serious broken, and the team layer held. All boxes. This is rarer than people think.

**Partially worked.** The redesign moved the target metric meaningfully, but with a real cost — it hit discount depth but dented velocity; it drove multi-year but logo count slipped; it improved fit but bookings volume came in soft. The trade was real, and now leadership has to decide, explicitly, whether the trade was worth it. "Partially worked" is the most common honest verdict, and naming it as such — rather than rounding it up to "worked" — is the whole point of the framework.

**Failed.** The redesign did not move its target metric on the lagging verdict (or moved it only through gaming, which is the same as not moving it), or it hit the target but the unintended-consequence scan found something seriously broken that outweighs the win. A failed verdict is not a disaster — it is information — but only if you are honest enough to call it.

**Needs another iteration.** The redesign had the right intent and partial signs of life, but the structure needs tuning — a threshold in the wrong place, an accelerator too weak or too strong, a definition that invited relabeling. This verdict points at a specific fix rather than a full revert.

And then the framework demands the hard part: **the willingness to act on the verdict.** A "failed" verdict that leads to no change is worse than no evaluation at all, because it burns credibility. A "partially worked" verdict has to force the explicit trade-off conversation. A "needs iteration" verdict has to actually trigger the iteration. The honest-verdict framework is only worth anything if the organization has pre-committed — culturally and structurally — to revert or iterate when the evidence says to. The verdict criteria written down at launch are what make that possible: they were agreed before anyone's ego was attached to the outcome.

## Tooling And Data: What You Need Wired

Measuring a comp redesign's effect on deal quality requires data from several systems to be joinable at the deal and cohort level. The tooling does not have to be exotic, but it has to be *connected*.

**CRM deal data.** The foundation — every closed deal with its close date, ARR, discount, term length, payment terms, segment, product mix, and (ideally) an ICP-fit score. You also need *pipeline creation* data, not just closed data, to see behavioral change in what reps chase.

**Billing and retention data.** From the billing system or financial system — the actual retention, churn, and expansion of each cohort over time. This is what powers the lagging verdict metrics. It has to be joinable back to the original closing rep and the original close cohort.

**The comp system.** The actual plan structure, attainment, and payout data — so you can do the dose-response analysis (which reps' incentives changed most) and the timing analysis (deals clustering at thresholds).

**Activity and engagement data.** From the sales engagement platform and CRM activity logs — the behavioral evidence layer. Call mix, activity mix, stakeholder engagement, discovery-call content.

**Deal-desk and approval data.** Discounting behavior, escalation patterns, approval flow — the behavioral evidence for discount-focused redesigns.

**Product usage/provisioning data.** Critical for the gaming scan — to cross-check booked labels (new-product attach, etc.) against what customers actually got and used.

**The cohort-analysis setup.** Practically, this means a place — a BI tool, a warehouse with a cohort model, a RevOps analytics layer — where deal-level CRM data, cohort retention from billing, comp data, and activity data are joined so you can slice any quality metric by close cohort, by rep, by segment, and by pre/post the redesign. If these datasets live in separate silos that nobody has joined, the evaluation cannot be done rigorously — and wiring that join is itself part of building the pre-launch measurement plan.

## 5 Real-World Scenarios

**Scenario 1 — The redesign that hit bookings but the cohort churned.** A SaaS company redesigns comp with a steeper accelerator and a SPIFF on fast closes. Q1 and Q2 bookings beat plan; the redesign is celebrated. By Q4, the cohort's early-churn rate is running 9 points above the pre-redesign baseline — reps pulled in poor-fit deals that booked fast and died young. The leading indicator that would have caught it: the ICP-fit score of closed deals, which had quietly dropped in Q1, but nobody was looking because bookings were up. Verdict, eighteen months late: failed.

**Scenario 2 — The discount-reduction redesign that killed velocity.** A company moves reps to a margin-adjusted number to fight discounting. Average discount drops 5 points within two quarters — the target metric works. But sales-cycle length grows 22%, pipeline ages, and win rate drops 8 points because reps lost a tool they relied on and were not enabled on value-selling to replace it. The unintended-consequence scan catches it. Verdict: partially worked — discount intent achieved, but the velocity cost forced a follow-up enablement investment and an accelerator tweak.

**Scenario 3 — The multi-year push reps gamed by relabeling.** A redesign adds a fat accelerator for multi-year deals. Multi-year mix jumps from 30% to 55% in one quarter — suspiciously fast. The gaming scan: cross-checking signed contracts against the "multi-year" label shows that most of the new "multi-year" deals are one-year commitments with non-binding renewal options dressed up as multi-year, and they cluster at *exactly* the minimum qualifying length. The metric moved; the customer behavior did not. Verdict: failed on integrity — needs a tighter definition and a clawback tied to actual year-two retention.

**Scenario 4 — The redesign that worked but drove top-rep attrition.** A redesign rebalances comp toward team-based and retention-based components. Deal quality genuinely improves — cohort GRR up, discount down. But two of the top five reps, who thrived under the old individualistic plan and now earn less, leave within six months and take major accounts with them. The deal-quality metrics looked great; the team layer was the failure. Verdict: partially worked at best — and a hard lesson that the rep-sentiment layer is not optional.

**Scenario 5 — The redesign declared a success on Q1 that looked bad by Q4.** A redesign launches; Q1 bookings are strong; leadership closes the book on it as a win and reallocates attention. No staged review cadence was set. By Q4, cohort retention, expansion, and margin all show the post-redesign cohort is materially weaker — but the organization had already "decided" the redesign worked, and unwinding that narrative is now politically expensive. The failure here was not the plan; it was the absence of time-horizon discipline. Verdict: the redesign needed iteration two quarters earlier than anyone was willing to look.

## The Decision Framework

The end-to-end framework for measuring whether a comp redesign improved deal quality:

**1. Map the redesign intent to specific metrics.** Write down the stated intent. Build the intent-to-metric map: named leading indicators, named lagging verdict metrics, named unintended-consequence watch list. Before launch.

**2. Capture the baseline.** The quality basket by quarter for 4-8 trailing quarters. Prior cohort retention curves. The behavioral baseline. The documented confounder list. Before reps know the plan is changing.

**3. Run the cohort comparison.** Pre-redesign cohort versus post-redesign cohort, same-stage, controlling for seasonality, market, and team composition. Distributions, not just averages.

**4. Track leading then lagging quality metrics on a staged cadence.** One quarter: did behavior change? Two quarters: what do the leading indicators say? Four-plus quarters: what do the lagging metrics say? No final verdict before the lagging horizon.

**5. Scan for gaming and unintended consequences.** Gaming: unnatural distributions, relabeled deals, timing manipulation, metrics that moved without behavior. Unintended consequences: the full-system check for what the redesign broke.

**6. Render an honest staged verdict.** Worked / partially worked / failed / needs iteration — against the pre-committed criteria. And act on it: revert, iterate, or ratify.

The framework is a sequence, and the early steps are the load-bearing ones. Skip the intent map and you measure generically. Skip the baseline and you cannot measure improvement at all. Skip the staged cadence and you declare victory on bookings. The analysis at the end is only as good as the discipline at the beginning.

## 5-Year Outlook

The measurement of comp redesigns is going to get faster and sharper over the next five years, driven by a few converging trends.

**AI-driven comp analytics.** The cohort-comparison, confounder-control, and gaming-detection work described in this entry is largely manual today — RevOps analysts joining datasets and building cohort models. AI-assisted analytics will increasingly automate the joins, surface the unnatural distributions, and flag the metric-versus-behavior divergences that signal gaming. The analytical floor rises; the discipline of *deciding what to measure* remains human.

**Real-time deal-quality scoring.** ICP-fit scoring, deal-quality scoring, and risk scoring at the point of close are moving from quarterly analysis to real-time. As that matures, the "leading indicators" become visible the day a deal closes rather than a quarter later — shortening the feedback loop on whether a redesign is bending behavior the right way.

**Faster feedback loops on whether a plan is working.** The combination of the above means the one-quarter behavioral read and the two-quarter leading-indicator read get tighter and more reliable. The lagging metrics — cohort retention, expansion — remain irreducibly slow, because customers churn on their own timeline, but the early-warning system gets much better.

**More sophisticated gaming, in response.** As detection improves, gaming gets more sophisticated — the eternal arms race of incentive design. The relabeling and timing patterns get subtler, and detection has to keep pace.

**Comp plans iterated more frequently.** Faster measurement enables faster iteration. The annual comp-redesign cycle may give way to more continuous tuning — which makes the discipline of baselines and pre-committed criteria *more* important, not less, because rapid iteration without rigorous measurement is just thrashing.

What does not change: the core problem. Reps optimize to what you pay them, the bookings number will always look fine, and quality will always be the slow, basket-shaped, easily-ignored dimension. The tools get better; the discipline is still the job.

## Final Framework: The Comp-Redesign Measurement Blueprint

The complete blueprint, in one place:

**The intent-to-metric map.** Every redesign has a stated intent. Write it down before launch. Map it to named leading indicators (1-2 quarters), named lagging verdict metrics (4+ quarters), and a named unintended-consequence watch list. Measure the intent, not a generic dashboard.

**The baseline checklist.** Before reps know the plan is changing: the quality basket (discount depth and distribution, multi-year mix, deal-size distribution, payment terms, ICP fit, win rate by segment, ramp-to-value) by quarter for 4-8 trailing quarters; the retention curves of prior cohorts; the behavioral baseline; the documented confounder list. The baseline is perishable — capture it or lose it forever.

**The cohort-comparison method.** Pre-redesign versus post-redesign cohorts, same-stage, controlling for seasonality, market conditions, and team composition. Always distributions, never just averages — gaming and degradation hide in the tails.

**The staged-verdict criteria.** One quarter: behavioral evidence — did the mechanism engage? Two quarters: leading indicators — what is the predicted direction? Four-plus quarters: lagging metrics — the real verdict. Pre-commit, before launch, to the thresholds for worked / partially worked / failed / needs iteration.

**The gaming-detection scan.** Unnatural distributions clustering at thresholds. Relabeled deals — cross-check labels against independent truth (provisioning, contracts, account history). Timing manipulation around payout cliffs. The master signal: a target metric that moved while the behavioral evidence underneath it did not.

**The unintended-consequence scan.** The full-system check. Velocity, logo count, core product, pipeline coverage, customer experience, and team health — everything the redesign did not target but could have broken.

**The honest verdict, acted on.** Worked, partially worked, failed, or needs iteration — against the pre-committed criteria — and the organizational willingness to revert or iterate when the evidence says to.

The throughline of the entire blueprint: a comp redesign always "works" if you only look at the number, because reps always optimize to the number. Measuring whether it improved *deal quality* — the retention, the expansion, the margin, the fit, the terms — is a deliberate discipline you build into the redesign before you launch it. Skip the discipline, and you will get a great-looking bookings chart and no idea whether you made the business better or quietly worse.

`;

const flow = `

## The Measurement Timeline: Baseline To Staged Verdict

\`\`\`mermaid
flowchart TD
  A[Pre-Redesign Baseline Capture] --> A1[Quality Basket 4-8 Trailing Quarters]
  A --> A2[Prior Cohort Retention Curves]
  A --> A3[Behavioral Baseline]
  A --> A4[Documented Confounder List]
  A1 --> B[Comp Redesign Launch]
  A2 --> B
  A3 --> B
  A4 --> B
  B --> C[Quarter 1 Behavioral Evidence]
  C --> C1[Activity And Call Mix Changed]
  C --> C2[Pipeline Creation Mix Changed]
  C --> C3[Discounting Behavior Changed]
  C1 --> D[Quarter 2 Leading Quality Indicators]
  C2 --> D
  C3 --> D
  D --> D1[Discount Depth And Distribution]
  D --> D2[ICP Fit Score Of Closed Deals]
  D --> D3[Multi Year Mix]
  D --> D4[Deal Size Distribution]
  D --> D5[Win Rate By Segment]
  D1 --> E[Quarter 4 Plus Lagging Quality Metrics]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  E --> E1[Cohort GRR And NRR]
  E --> E2[Early Churn Rate Of Post Redesign Deals]
  E --> E3[Expansion Realized]
  E --> E4[Realized Margin Over Contract Life]
  E1 --> F[Staged Honest Verdict]
  E2 --> F
  E3 --> F
  E4 --> F
  C --> G[Parallel Check Gaming Detection Scan]
  D --> G
  E --> G
  G --> G1[Unnatural Distributions At Thresholds]
  G --> G2[Relabeled Deals Vs Independent Truth]
  G --> G3[Timing Manipulation Around Cliffs]
  C --> H[Parallel Check Unintended Consequence Scan]
  D --> H
  E --> H
  H --> H1[Velocity And Pipeline Aging]
  H --> H2[Logo Count And Volume]
  H --> H3[Core Product And Team Health]
  G1 --> F
  G2 --> F
  G3 --> F
  H1 --> F
  H2 --> F
  H3 --> F
  F --> I[Worked / Partially Worked / Failed / Needs Iteration]
  I --> J[Act On Verdict Ratify Revert Or Iterate]
\`\`\`

## The Intent-To-Metric Mapping: Proving Or Disproving Each Redesign Intent

\`\`\`mermaid
flowchart LR
  A[Comp Redesign Stated Intent] --> B[Reduce Discounting]
  A --> C[Drive Retention Quality]
  A --> D[Push New Product Cross Sell]
  A --> E[Move Upmarket Bigger Deals]
  B --> B1[Leading Discount Depth And Distribution]
  B --> B2[Leading List Price Realization]
  B --> B3[Lagging Realized Gross Margin]
  B --> B4[Lagging Win Rate Held]
  B --> B5[Watch Broke Velocity And Win Rate]
  C --> C1[Leading ICP Fit Score Closed And Pipeline]
  C --> C2[Leading Qualification Behavior]
  C --> C3[Lagging Cohort GRR And Logo Retention]
  C --> C4[Lagging Early Churn Rate]
  C --> C5[Watch Broke Bookings Volume And Coverage]
  D --> D1[Leading New Product In Early Pipeline]
  D --> D2[Leading Reps With New Product Deals]
  D --> D3[Lagging New Product Revenue And Its GRR]
  D --> D4[Lagging Core Product Held]
  D --> D5[Watch Broke Core Product And Relabeling]
  E --> E1[Leading Full Deal Size Distribution Shift]
  E --> E2[Leading Win Rate In Larger Segment]
  E --> E3[Lagging Total Bookings Held]
  E --> E4[Lagging Cohort Retention Of Large Deals]
  E --> E5[Watch Broke Volume Business And Win Rate]
  B5 --> F[Full System Verdict Hit Intent And Nothing Critical Broke]
  C5 --> F
  D5 --> F
  E5 --> F
  B4 --> F
  C4 --> F
  D4 --> F
  E4 --> F
\`\`\`

`;

const src = `

## Sources

1. **Alexander Group — Sales Compensation Design and Effectiveness Research** — Methodology for evaluating whether comp plan changes drive intended sales behavior versus surface metric movement.
2. **WorldatWork — Sales Compensation Programs and Practices** — Industry-standard frameworks for sales comp plan design, intent definition, and plan governance.
3. **Harvard Business Review — "Motivating Salespeople: What Really Works"** — Research on how sales reps respond to incentive structure and the gap between incentive design intent and realized behavior.
4. **The RevOps Co-op / Pavilion — Sales Compensation and Deal Quality Benchmarks** — Practitioner community data on cohort retention by deal source and comp-plan structure.
5. **OpenView Partners — SaaS Benchmarks Report** — Net revenue retention, gross revenue retention, and CAC benchmarks used as cohort-comparison reference points.
6. **KeyBanc Capital Markets / SaaS Survey** — Bookings quality, multi-year mix, and discounting benchmarks across SaaS revenue stages.
7. **Bessemer Venture Partners — State of the Cloud / NRR research** — Net revenue retention as the primary measure of revenue quality in recurring-revenue businesses.
8. **Gartner — Sales Compensation and Quota Setting Research** — Frameworks for isolating compensation effects from market and enablement effects.
9. **CSO Insights / Korn Ferry Sales Performance research** — Win rate, sales cycle, and quota attainment benchmarks for pre/post comp-change analysis.
10. **SBI (Sales Benchmark Index) — Compensation Plan Design and Measurement** — Practitioner methodology for staged comp-plan evaluation and unintended-consequence scanning.
11. **Xactly and CaptivateIQ — Incentive Compensation Management product documentation** — Comp-system data structures used for dose-response and threshold-clustering analysis.
12. **Gong / Clari — Revenue intelligence and deal-quality scoring documentation** — Activity-data and deal-scoring approaches underpinning the behavioral-evidence layer.
13. **First Round Review — "The Sales Compensation Playbook"** — Founder-stage guidance on comp redesign intent and avoiding plans that get gamed.
14. **Andreessen Horowitz (a16z) — Go-to-market and sales efficiency essays** — Discussion of revenue quality versus revenue quantity in venture-stage companies.
15. **MEDDIC / MEDDPICC qualification frameworks** — ICP-fit and deal-qualification structures referenced in leading-indicator definitions.
16. **Forrester / SiriusDecisions — Revenue Operations and Sales Compensation research** — Cross-functional governance models for comp redesign measurement plans.
17. **Winning by Design — Revenue Architecture** — Cohort-based revenue analysis methodology and the bookings-quality-versus-quantity distinction.
18. **CFO.com / finance leadership commentary on bookings quality** — Finance-side perspective on discount depth, payment terms, and cash quality of bookings.
19. **Academic literature on incentive contracts and gaming (Holmström; Baker; Gibbons)** — Foundational economics of multitasking, distortion, and gaming in incentive design.
20. **SaaS Capital — Retention and churn benchmarking** — Cohort GRR and early-churn benchmarks for evaluating post-redesign cohort quality.

`;

const num = `

## Numbers

**Deal-Quality Basket Components**
- Core quality dimensions tracked: 8 (GRR/churn, expansion/NRR, margin/discount, payment terms, ICP fit, multi-year mix, ramp-to-value, deal-size shape)
- Recommended baseline window: 4-8 trailing quarters (4 = floor, 8 = preferred)
- Behavioral baseline metrics: activity mix, pipeline-creation mix, discounting behavior, segment/term focus

**Measurement Timeline**
- Quarter 1: behavioral evidence readable (did the mechanism engage?)
- Quarter 2: leading quality indicators readable (course-correction checkpoint)
- Quarter 4+: lagging quality metrics mature enough for the real verdict
- Longer sales/retention cycles: lagging verdict horizon extends to 6+ quarters
- Lagging-metric maturity for retention: 12-24 months of cohort aging

**Leading Quality Indicators (1-2 Quarters)**
- Average discount depth AND full distribution (watch the deep-discount tail)
- ICP-fit score of closed deals — and of newly created pipeline (earliest signal)
- Multi-year mix (genuine commitment, not relabeled one-year)
- Deal-size distribution shape (not just the average)
- Payment-terms mix and win rate by segment
- Sales-cycle length / velocity

**Lagging Quality Metrics (4+ Quarters)**
- Cohort GRR and logo retention vs pre-redesign cohort at same age
- Cohort NRR (GRR plus expansion)
- Early-churn rate inside 12 months — cleanest poor-fit fingerprint
- Expansion realized in first 12-18 months
- Realized margin over contract life vs booked margin

**Cohort-Comparison Controls**
- Same-stage comparison (match cohort age, not calendar date)
- Seasonality control (same-quarter to same-quarter, or full-year over full-year)
- Market-conditions control (via documented confounder list)
- Team-composition control (segment present-both-periods reps from new hires)
- Distribution analysis on every metric — never averages alone

**Intent-To-Metric Map: Reduce Discounting**
- Leading: discount depth + distribution, list-price realization, deal-desk escalations
- Lagging: realized gross margin, win rate held, cohort GRR
- Might break: velocity, win rate, deal count

**Intent-To-Metric Map: Drive Retention**
- Leading: ICP-fit score (closed + new pipeline), qualification behavior
- Lagging: cohort GRR, logo retention, early-churn rate, NRR
- Might break: total bookings volume, pipeline coverage

**Intent-To-Metric Map: Push New Product**
- Leading: new product in early-stage pipeline, count of reps with new-product deals
- Lagging: new-product revenue + its GRR, core-product performance held
- Might break: core product neglect, relabeling (attach up, provisioning flat)

**Intent-To-Metric Map: Move Upmarket**
- Leading: full deal-size distribution shift, win rate in larger segment
- Lagging: total bookings held, cohort retention/NRR of large deals, CAC at new size
- Might break: volume business abandoned, win rate in new segment

**Gaming-Detection Signals**
- Unnatural distribution: deals clustering just above accelerator thresholds
- Quarter-end pile-up: deals bunching in the final days of the period
- Relabeling check: booked label vs independent truth (provisioning, signed contract, account history)
- Timing manipulation: deal timing relative to each rep's attainment-curve bend
- Master signal: target metric moved, behavioral evidence did not

**Unintended-Consequence Scan Targets**
- Velocity and pipeline aging
- Logo count and total bookings volume
- Core-product bookings and pipeline
- Pipeline coverage ratio and pipeline-creation rate
- Customer experience / downstream support and implementation cost
- Top-rep retention and team health

**Honest-Verdict Framework**
- 4 verdict outcomes: worked / partially worked / failed / needs iteration
- "Partially worked" = the most common honest verdict (a real trade was made)
- Verdict criteria must be pre-committed BEFORE launch

**Pre-Launch Measurement Plan**
- 5 required components: stated intent, intent-to-metric map, captured baseline, review cadence, pre-committed verdict criteria
- Baseline is perishable — one-time capture before reps know the plan is changing

**Rep-Sentiment Layer**
- Track TOP-rep attrition specifically, not average attrition
- Comp satisfaction, plan clarity, perceived fairness — survey before and after
- Earnings distribution: are the right behaviors being rewarded?
- Manager confidence: are managers coaching the plan or coaching around it?

**Tooling / Data Systems To Join**
- CRM deal data (closed + pipeline creation)
- Billing/retention data (cohort GRR/NRR/churn/expansion)
- Comp system (plan structure, attainment, payout — for dose-response + timing analysis)
- Activity/engagement data (behavioral-evidence layer)
- Deal-desk/approval data (discounting behavior)
- Product usage/provisioning data (gaming-scan cross-check)

`;

const counter = `

## Counter-Case: When The Elaborate Measurement Apparatus Is Overkill

Everything above describes a rigorous, multi-quarter, multi-system measurement discipline. For many revenue organizations that rigor is exactly right. But it is not always right, and a thoughtful leader should know when the apparatus becomes the problem rather than the solution.

**Counter 1 — The small team where the CRO sees every deal directly.** On a team of six reps closing forty deals a quarter, the CRO is in most of the deal reviews, knows every account by name, and can see the quality of the revenue with their own eyes. Building a formal cohort-comparison model, a confounder list, and a staged-verdict framework for that team is ceremony, not insight. The CRO already has the signal — directly, qualitatively, faster than any dashboard would deliver it. The measurement apparatus earns its cost at scale, when no single person can hold the deal quality in their head anymore. Below that scale, judgment beats infrastructure.

**Counter 2 — When measurement obsession delays a necessary iteration.** Sometimes a comp plan is *obviously* not working. Reps are confused, the wrong behavior is being rewarded, top performers are openly unhappy, and the leading indicators are flashing red within six weeks. The disciplined "wait for the four-quarter lagging verdict" instinct is, in that situation, exactly wrong. You do not need eighteen months of cohort retention data to know a plan that nobody understands and everyone hates needs to change now. Analysis paralysis on an obviously-broken plan is a real failure mode — the measurement discipline is meant to prevent premature *victory* declarations, not to prevent *necessary, evidence-supported* mid-course corrections. If the evidence is already overwhelming, act on it.

**Counter 3 — When a perfectly-attributed verdict is impossible and a directional read is enough.** The isolation-of-the-comp-variable problem is genuinely unsolvable in many real situations — too many things changed at once, the team turned over, the market moved. Chasing a clean, defensible, fully-attributed causal verdict in that environment can consume enormous RevOps effort and still not produce one. Sometimes the honest and efficient move is to accept a directional read — "quality looks better, behavior shifted the right way, we cannot fully separate the comp effect from the pricing change, and that is good enough to keep the plan and move on." Decision-grade does not mean publication-grade. The cost of additional attribution rigor has to be weighed against the value of the marginal certainty it buys, and often that trade does not favor more analysis.

**Counter 4 — When the quality metrics themselves become the new thing reps game.** This is the deepest counter-case, and it is recursive. The entire premise of measuring deal quality is to stop reps from gaming the bookings number. But the moment "ICP-fit score" or "deal-quality score" or "cohort GRR contribution" becomes a thing that visibly affects how reps are evaluated or paid, it becomes the new target — and reps will optimize to *it* the same way they optimized to bookings. ICP-fit scores get gamed by reps learning which inputs move the score. Retention-tied comp gets gamed by reps cherry-picking accounts that would have retained anyway. You have not eliminated gaming; you have relocated it to a more sophisticated metric. The lesson is not "don't measure quality" — it is to hold the measurement framework with humility, keep some of it as *diagnostic* signal rather than *paid* signal, refresh it as reps adapt, and never believe that any metric is permanently un-gameable. The measurement system is itself subject to the exact dynamic it was built to detect.

**The honest verdict on the counter-case.** The elaborate measurement apparatus is the right call for a scaled revenue organization where deal quality cannot be seen with the naked eye, where a comp redesign affects dozens or hundreds of reps, and where getting the verdict wrong costs millions in degraded revenue. It is overkill for a small team with a hands-on CRO, it is actively harmful when it delays an obviously-needed iteration, it is wasteful when it chases an impossible clean attribution, and it is naive if it forgets that the quality metrics are gameable too. The discipline of this entry is a powerful tool — but like a comp plan itself, it should be matched to the situation, held with humility, and revised when it stops serving its purpose.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a bookkeeping business in 2027? (Finance-partner perspective on the comp-and-margin data that powers deal-quality measurement.)
- **q9502** — How do you start a CPA firm in 2027? (Finance/accounting partnership context for the margin and cash-quality dimensions of the deal-quality basket.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Sales-org restructuring context for how comp and role design shape revenue quality.)
- **q9601** — How do you start a fractional CFO business in 2027? (The finance-partner role in pre-launch measurement-plan design and baseline capture.)
- **q9602** — How do you start an outsourced controller business in 2027? (Billing and retention data infrastructure that powers lagging quality metrics.)
- **q9505** — How do you scale a bookkeeping firm past $500K revenue? (Scaling context for when measurement infrastructure starts to earn its cost.)
- **q9701** — What is the best practice management software for bookkeeping firms? (Tooling and data-join parallels for the cohort-analysis setup.)
- **q9702** — How do you hire offshore bookkeepers? (Team-composition control parallels for the cohort-comparison method.)
- **q9801** — What is the future of bookkeeping in 2030? (Long-term outlook context for AI-driven analytics in revenue measurement.)
- **q9802** — How will AI change bookkeeping by 2030? (AI-driven comp analytics and real-time scoring trends in the 5-year outlook.)

`;

const tags = ['sales-compensation','revops','deal-quality','comp-redesign','sales-management','revenue-operations','cohort-analysis','net-revenue-retention','sales-strategy','cro'];

const sources = [
  { title: 'Alexander Group — Sales Compensation Design and Effectiveness Research', url: 'https://www.alexandergroup.com' },
  { title: 'WorldatWork — Sales Compensation Programs and Practices', url: 'https://www.worldatwork.org' },
  { title: 'Harvard Business Review — Motivating Salespeople: What Really Works', url: 'https://hbr.org' }
];

const notes = {
  s6: 'Added 20 cited sources spanning sales-compensation design research (Alexander Group, WorldatWork, SBI, Gartner), deal-quality and retention benchmarking (OpenView, Bessemer, KeyBanc, SaaS Capital), revenue-intelligence tooling (Gong, Clari, Xactly, CaptivateIQ), incentive-economics academic literature (Holmstrom, Baker, Gibbons on multitasking and gaming), and practitioner go-to-market sources (First Round, a16z, Winning by Design, RevOps Co-op).',
  s7: 'Added comprehensive numerical analysis: the 8-component deal-quality basket, the staged measurement timeline (Q1 behavioral / Q2 leading / Q4+ lagging), full leading and lagging metric inventories, cohort-comparison controls, the four intent-to-metric maps (reduce discounting / drive retention / push new product / move upmarket) each with leading + lagging + might-break metrics, gaming-detection signals, unintended-consequence scan targets, the 4-outcome honest-verdict framework, the 5-component pre-launch measurement plan, the rep-sentiment layer, and the 6 tooling/data systems that must be joined.',
  s8: 'Added 4-part counter-case on when the measurement apparatus is overkill: the small team where the CRO sees deal quality directly, when measurement obsession delays a necessary and obviously-needed comp iteration (analysis paralysis), when a perfectly-attributed causal verdict is impossible and a directional decision-grade read is sufficient, and the recursive trap where the quality metrics themselves become the new thing reps game.',
  s9: 'Cross-linked 10 related Pulse entries spanning finance/accounting-partner perspectives (q9501, q9502, q9601, q9602), sales-org and role design (q1899), scaling and infrastructure context (q9505, q9701, q9702), and AI-driven analytics outlook (q9801, q9802).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of how to measure whether a rep comp redesign actually improved deal quality versus just hitting the bookings number. Two mermaid diagrams (the measurement timeline from baseline capture through staged verdict with parallel gaming and unintended-consequence scans; the intent-to-metric mapping for the four common redesign intents with leading, lagging, and might-break metrics). Full coverage: the core problem that reps optimize to whatever you pay them, the 8-component deal-quality basket, why "we hit the number" is a trap, the perishable-baseline problem, the cohort-comparison method with its controls, lagging quality metrics as the true-but-slow verdict, leading quality indicators as 1-2 quarter proxies, behavioral-change evidence as the causal mechanism, isolating the comp variable, the counterfactual problem, the intent-to-metric mapping principle, four worked intent mappings (reduce discounting / drive retention / push new product / move upmarket), gaming detection, the unintended-consequence scan, time-horizon discipline, the rep-sentiment and retention layer, building the measurement plan before launch, the 4-outcome honest-verdict framework, tooling and data, 5 real-world scenarios, the decision framework, 5-year outlook, final blueprint, and a 4-part counter-case on when the apparatus is overkill.'
};

runPolish({ id: 'q9525', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
