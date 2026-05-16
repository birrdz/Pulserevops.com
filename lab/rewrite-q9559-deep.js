// q9559 — How should a CRO calibrate qualification rigor when cash position and runway are forcing a choice between conservative organic growth and aggressive upmarket gambling?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Qualification rigor is not a fixed dial you set once — it is a **runway-indexed instrument** the CRO retunes every quarter against the cash position. The core principle: **rigor should rise as runway shortens, not fall.** The intuitive panic move when cash gets tight is to loosen qualification ("take every deal, we need the bookings") — and it is almost always wrong, because loose qualification at low runway converts your scarcest resource (rep capacity and cash-funded sales cycle time) into low-probability, long-cycle, high-CAC pipeline that closes *after* you run out of money. The correct frame: with **18+ months runway**, you can afford a barbell — keep a disciplined core qualified at MEDDPICC/MEDDICC standard while running a fenced 15-25% capacity "upmarket experiment" with explicitly looser entry criteria and a hard kill-date. With **12-18 months**, collapse the barbell, tighten the core to require Economic Buyer access and a Compelling Event before a deal is Stage-2 forecastable, and cap upmarket bets at 10% of capacity. With **under 9 months**, you are in **cash-conversion mode**: maximum rigor, qualify on *time-to-cash* not just *probability-to-close*, kill any deal whose cash lands past your zero-cash date, and reallocate reps to the fastest-closing, highest-win-rate segment you have evidence for — usually your proven core, not the upmarket gamble. The decision is governed by three numbers: **runway months, the segment's blended cycle length vs. runway, and the cash-collection lag** (signed ARR is not cash; net-90 terms on a 5-month enterprise cycle means cash is 8 months out). Concrete benchmarks: a healthy SMB/mid-market motion qualifies ~35-55% of created opps into Stage 2 and wins 22-30% of those; a deliberately loosened upmarket experiment will show 12-18% Stage-2 conversion and 10-15% win rates with 1.7-2.4x longer cycles and 2-3x CAC — acceptable as a *fenced* bet at high runway, fatal as a *core strategy* at low runway. The CRO's real job here is not picking "conservative vs. aggressive" — it is **refusing the false binary**, fencing the gamble so a loss is survivable, and making qualification rigor the throttle that keeps burn-to-bookings honest. Get this wrong and you don't get a slower year — you get a down round or a dead company. Get it right and tight runway becomes the forcing function that produces the most efficient go-to-market quarter the company has ever run.`;

const core = `

## The Question Behind the Question: Why "Conservative vs. Aggressive" Is a Trap

When a CRO frames the decision as "conservative organic growth versus aggressive upmarket gambling," they have already made a category error that will cost them the company. The framing implies a single slider — dial left for safety, dial right for upside — and that the CRO's job is to pick a point on it. That is not the decision. The real decision is a *portfolio construction* problem under a *cash constraint*, and qualification rigor is the primary control variable, not growth aggression.

Here is why the binary is false. "Conservative organic growth" is not actually conservative if your organic motion has a 14-month payback and you have 11 months of runway — that is a guaranteed slow death, just a polite one. "Aggressive upmarket gambling" is not actually reckless if you fence it to 15% of capacity, give it a hard kill-date, and the expected value of the bet is positive even after haircut — that is just disciplined experimentation. The words "conservative" and "aggressive" are emotional labels, not strategies. They smuggle in a moral frame (safe = responsible, aggressive = irresponsible, or in the founder-hype version, aggressive = bold, conservative = weak) that prevents clear thinking.

The CRO who wins this moment does three things. First, they **refuse the binary out loud** — to the CEO, the board, and the sales leadership team — and reframe it as: "Given X months of runway, what mix of qualified pipeline, by segment and cycle length, gets us cash-flow positive or to a fundable milestone before zero?" Second, they make **qualification rigor the explicit throttle** — the thing that determines what enters the pipeline at all — rather than treating it as a static methodology that sales ops owns. Third, they **index rigor to runway** on a quarterly cadence, so the system self-corrects as cash position changes.

The rest of this answer is the operating manual for doing exactly that. It covers the runway-indexed rigor model, the diagnostic the CRO runs to set the dial, the mechanics of fencing an upmarket bet, the comp and forecasting implications, the tooling, five named scenarios, a decision framework, and the AI-era outlook. The throughline: in a cash crunch, qualification rigor is the most powerful and most under-used lever a CRO has, and the instinct to loosen it is the single most expensive mistake in revenue leadership.

## The Core Principle: Rigor Rises as Runway Falls

State it plainly because it is counterintuitive and most teams get it backwards: **as runway shortens, qualification rigor should increase, not decrease.** The panic instinct — "we need bookings, take everything, qualify less" — is the revenue-leadership equivalent of a drowning person inhaling. It feels like survival and it kills you.

The logic. When cash is abundant (18+ months), your scarcest resource is *learning* — you can afford to spend rep capacity on experiments that may not pay, because the information is worth the burn. When cash is scarce (under 9 months), your scarcest resource is *rep-hours-funded-by-remaining-cash*, and every hour a rep spends on a low-probability, long-cycle deal is an hour stolen from a deal that could actually convert to cash before zero. Loose qualification at low runway doesn't generate more bookings — it generates more *pipeline*, most of which is junk, and junk pipeline at low runway is actively dangerous because it (a) inflates the forecast and delays the hard decisions, (b) consumes the cash-funded selling time you can't get back, and (c) trains reps to chase volume over conversion at exactly the moment conversion is everything.

The mathematical version: a deal's contribution to survival is not its ARR — it is P(close) times cash_collected times I(cash_date before zero_cash_date). That last term is a hard indicator function: a deal that closes for $200K of ARR but collects cash three weeks after you run out of money has a survival contribution of *zero*. Qualification rigor is how you raise P(close), shorten the cycle so the cash date moves earlier, and screen out deals where the indicator is zero. Loosening rigor lowers P(close), lengthens cycles, and lets zero-indicator deals into the forecast. It is strictly negative for survival.

There is one legitimate exception, and the CRO must name it precisely so it doesn't become a loophole: you may *temporarily* loosen rigor on a *specific, fast-closing, low-ACV transactional segment* where the cycle is under 30 days and the cash collection is immediate — because there, more volume genuinely converts to near-term cash. But that is "loosen rigor on the fast-cash lane," not "loosen rigor generally." Everywhere else, tighten.

## What Qualification Rigor Actually Means: The Five Layers

"Rigor" is vague unless you decompose it. Qualification rigor is a stack of five distinct layers, and the CRO tunes each one separately rather than turning a single knob.

**Layer 1 — Entry criteria (what becomes a Stage-1 opportunity).** The bar a lead must clear to be worked at all. Loose: anyone who books a meeting. Tight: ICP fit confirmed, a named pain, and a plausible budget range before a rep's calendar gets touched.

**Layer 2 — Advancement criteria (what moves stage to stage).** The exit gates between pipeline stages. This is where MEDDICC / MEDDPICC / BANT live. Loose: rep sentiment ("they seem interested"). Tight: documented Economic Buyer access, a quantified Metric, an identified Decision Process and Decision Criteria, and — critically — a **Compelling Event** with a date before a deal can be called Stage-3 / forecast-committed.

**Layer 3 — Forecast inclusion criteria.** What is allowed into Commit vs. Best Case vs. Pipeline. Loose: rep's gut. Tight: only deals with EB-confirmed, Compelling Event dated, paper process started, and a mutual action plan with the champion.

**Layer 4 — Continued-investment criteria (the kill rule).** When you *stop* working a deal. Most teams have no rigor here at all — deals rot in pipeline forever. Tight: any deal with no forward motion in 21 days, or no EB access by Stage 3, or a Compelling Event date that has slipped twice, is killed or recycled.

**Layer 5 — Time-to-cash criteria.** The layer almost nobody runs, and the one that matters most in a crunch: does this deal's *cash* land before our zero-cash date, accounting for procurement, legal, and payment terms? A deal can be perfectly qualified on Layers 1-4 and still be disqualified on Layer 5 if it's a net-90, security-review, enterprise deal and you have seven months of cash.

In abundant times the CRO mostly tunes Layers 1-3. In a crunch, Layers 4 and 5 become the dominant controls. The single most common rigor failure in a cash crisis is a team with decent Layer 2 advancement criteria and *zero* Layer 4 and Layer 5 discipline — so the pipeline looks healthy, the forecast looks survivable, and the company runs out of cash with a "strong pipeline" still on the board.

## The Diagnostic: Five Numbers That Set the Dial

Before the CRO can calibrate anything, they need five numbers. Not opinions — numbers. Pull them in a single afternoon with RevOps; if you can't, that data gap *is* the first finding.

**Number 1 — Runway in months, hard.** Cash on hand divided by net monthly burn, with no heroic assumptions about bookings. If finance gives you a range, use the bottom of the range. This is the master variable; everything indexes to it.

**Number 2 — Blended sales cycle by segment.** Median (not mean — mean is distorted by whales) days from Stage-1 to Closed-Won, segmented by SMB / mid-market / enterprise and by new-logo vs. expansion. You need the *distribution*, not just the median, because the 75th percentile tells you how long the slow deals actually take.

**Number 3 — Cash-collection lag.** Days from Closed-Won to cash-in-bank, by segment, including payment terms. Annual-prepaid SMB might be 5-15 days. Net-60 enterprise with a procurement portal might be 75-110 days. Signed ARR is a vanity number in a cash crunch; *collected cash* is the only number that pays the team.

**Number 4 — Win rate and Stage-2 conversion by segment.** What fraction of created opps reach Stage 2, and what fraction of Stage-2 deals win — split by segment and, ideally, by lead source. This tells you which lanes actually convert.

**Number 5 — CAC payback by segment.** Fully loaded cost to acquire a customer divided by monthly gross-margin contribution, by segment. The segment with the shortest payback is your survival engine; the segment with the longest is the gamble.

With these five, the CRO computes the one derived metric that drives the decision: **does the segment's (cycle length + cash-collection lag) fit inside the runway with margin?** If your enterprise motion is a 150-day median cycle plus a 90-day cash lag — 240 days, eight months — and you have nine months of runway, then enterprise deals started *today* are the last enterprise deals that can possibly help, and anything that slips is dead weight. That single comparison reframes the entire "conservative vs. aggressive" debate into a scheduling problem with arithmetic answers.

## Mapping Runway Bands to Rigor Settings

The output of the diagnostic is a rigor setting, and the cleanest way to operationalize it is a banded model. Three bands, with explicit settings for each of the five rigor layers and an explicit capacity allocation.

**Band A — 18+ months runway ("Build" mode).** You can afford a barbell. Core motion (75-85% of capacity) runs at standard MEDDICC rigor: confirmed EB access and Compelling Event before Stage 3. The fenced experiment (15-25% of capacity) — typically the upmarket move — runs *deliberately looser* entry criteria because the point is learning: you want to see what enterprise deals look like in your pipeline even if most don't convert. Layer 4 kill rules are moderate (45-day no-motion kill). Layer 5 is mostly informational. This is the only band where "aggressive upmarket gambling" is a responsible sentence — and only because it's fenced.

**Band B — 12-18 months runway ("Discipline" mode).** Collapse the barbell. The experiment shrinks to 10% of capacity max and its entry criteria tighten toward the core standard. The core's Layer 2 advancement criteria harden: no Stage-3 without documented EB access *and* a dated Compelling Event *and* a champion-validated decision process. Layer 4 kill rule tightens to 30 days no-motion. Layer 5 becomes a real gate: deals whose cash lands past month 14 get extra scrutiny. You are still growing, but every deal earns its place.

**Band C — under 9-12 months runway ("Cash-conversion" mode).** Maximum rigor everywhere. The upmarket experiment is *suspended*, not shrunk — you cannot afford to fund learning with survival cash. All capacity reallocates to the proven shortest-payback, fastest-cycle, highest-win-rate segment. Layer 2: brutal — no forecast credit without EB, Compelling Event, paper process started, and mutual action plan. Layer 4: 21-day no-motion kill, no exceptions, CRO reviews the kill list weekly. Layer 5 becomes the *primary* qualifier: any deal whose cash lands after the zero-cash date is disqualified regardless of how good it looks. Reps are explicitly told: we are optimizing time-to-cash, not bookings.

The bands are not rigid walls — a company at 13 months trending down fast behaves like Band C; a company at 11 months with a term sheet in hand behaves like Band B. But the banded model gives the CRO a defensible, communicable framework instead of a vibe.

## The Upmarket Gamble: How to Fence It So a Loss Is Survivable

Going upmarket is often the *right* strategic instinct — bigger deals, better logos, higher LTV, a path to durable growth. The problem is never the ambition; it's the *un-fenced* execution. An un-fenced upmarket bet looks like this: the CRO reassigns three of the best reps to enterprise, loosens qualification because "enterprise deals are different and take longer," removes the normal kill rules because "you can't rush these," and waits. Six months later there is a beautiful enterprise pipeline, zero closed cash, three burned-out top reps, and two fewer months of runway. That is not a gamble — it's a donation.

A *fenced* upmarket bet has six structural constraints, and the CRO writes them down before a single rep is reassigned:

1. **Capacity cap.** A fixed, named percentage of selling capacity — 15-25% in Band A, 10% in Band B, zero in Band C. It is a ring-fenced budget, not an open-ended reallocation.
2. **Hard kill-date.** A calendar date — typically one full sales cycle plus 30 days — at which the experiment is evaluated against pre-set success criteria and either scaled, sustained, or *killed*. The kill-date is set *before* you start and is not movable by sunk-cost arguments.
3. **Pre-committed success criteria.** Concrete, e.g., "by the kill-date: 2 closed-won enterprise logos, blended enterprise CAC payback under 24 months, and at least 4 Stage-3 deals with EB access." If you don't hit them, you kill it.
4. **Separate forecast category.** Upmarket-experiment pipeline never mixes into the core commit forecast. It has its own line, its own (lower) conversion assumptions, and the board sees it labeled as an experiment.
5. **Looser-but-explicit entry criteria.** The experiment *is* allowed looser Layer 1 entry — that's the point — but the looseness is *documented* and *bounded*, not "reps use judgment." E.g., "enterprise opps may enter Stage 1 with ICP fit + named pain, EB access not required until Stage 2," vs. the core's "EB access required at Stage 1."
6. **Dedicated, not borrowed, capacity where possible.** The least disruptive fence is 1-2 reps fully dedicated to the experiment rather than every rep splitting attention — split attention means the core motion silently degrades while the experiment underperforms, and you can't attribute either outcome.

With these six fences, the worst case of an upmarket bet is "we spent 15% of capacity for one cycle and learned it doesn't work yet" — survivable, even useful. Without them, the worst case is "we don't notice it failed until the core has also decayed and runway is gone."

## Why Loosening Qualification in a Crunch Feels Right and Is Wrong

It is worth dwelling on the psychology, because the CRO's hardest job in a cash crunch is not analytical — it's holding the line against a room full of smart, scared people whose instincts all point the wrong way.

The CEO sees the bookings number is short and the cash clock is loud, and says "we need to be less precious about which deals we take." The board, in the QBR, asks "are we being aggressive enough?" — a question that sounds like leadership and functions as pressure to loosen. The VP of Sales, watching reps' commission checks shrink, wants more at-bats for the team and lobbies to lower the bar. The reps themselves, comp-motivated and anxious, will sandbag the kill rules and keep dead deals alive because a dead deal in the pipeline still feels like hope and still shows up in the 1:1. Every force in the building pushes toward loosening.

And loosening *feels* like action. Tightening feels like contraction, like giving up, like "not wanting it badly enough." The CRO who tightens qualification in a crunch will be accused — internally — of being timid exactly when boldness is needed. This is the trap. The truth is the opposite: tightening qualification in a crunch is the *aggressive* move, because it concentrates your scarce firepower on the deals that can actually be won and collected, and aggression without concentration is just noise.

The CRO's counter-move is to make the arithmetic visible and repeated. Not "I think we should be disciplined" — that loses to "I think we should be aggressive." Instead: "Here is the runway number. Here is the cycle-plus-cash-lag for each segment. Here is the math showing that a deal we open in the loose-qualification segment today collects cash, on average, six weeks after our zero-cash date. Loosening qualification doesn't add survival bookings — it adds forecast theater. Here's what tightening does to expected collected cash by the zero date." Numbers don't get accused of timidity. The CRO's job is to be the person in the room translating fear into arithmetic.

## Stage-by-Stage: Where Rigor Lives in the Pipeline

Rigor is not a gate at the top of the funnel — it's a property of every stage transition. Walk the pipeline and place the controls.

**Lead → Stage 1 (Opportunity created).** This is Layer 1. In a crunch, the most leveraged change is here: stop letting reps open opportunities on weak signals. Require ICP-fit confirmation and a documented pain before a Stage-1 record exists. This single change prevents the rep's calendar from filling with no-hope discovery calls. In Band C, also require a fast-lane check: is this a segment whose cycle fits inside runway? If not, it goes to a nurture queue, not a rep.

**Stage 1 → Stage 2 (Discovery validated).** This is where Metrics and Economic Buyer identification happen in MEDDICC. Tighten: a deal cannot leave Stage 1 without a quantified Metric (the business value, in the customer's numbers) and a *named* Economic Buyer — name, title, and a plan to reach them.

**Stage 2 → Stage 3 (Solution validated / forecastable).** The big gate. In a crunch this is where you require: confirmed EB *access* (not just identification — you've met them or have a committed meeting), a documented Decision Process and Decision Criteria, an identified Champion who has been *tested*, and — non-negotiable in Band B/C — a **Compelling Event with a date**. No Compelling Event, no Stage 3, no forecast credit. The Compelling Event is the rigor mechanism that protects you from infinite-cycle deals, which are the deadliest thing in a low-runway pipeline.

**Stage 3 → Stage 4 (Negotiation / paper).** Layer 5 lives here hardest. Before a deal is Commit, the paper process must be started, the procurement and legal path mapped, and the cash-collection date estimated. A Stage-3 deal whose estimated cash date is past the zero-cash date gets escalated to the CRO — kill, restructure (annual prepaid, shorter term, faster terms), or accept consciously.

**Stage 4 → Closed.** Rigor here is about *terms*, not just signature. In a crunch the CRO empowers the deal desk to trade discount for cash velocity: a 10-15% discount for annual-prepaid or net-15 instead of net-60 can be the difference between a deal that helps survival and one that doesn't. That is a rigor decision — it's qualifying the *structure*, not just the deal.

**The kill lane (any stage → Recycled/Lost).** Layer 4. Every stage has an explicit no-motion timeout. The CRO reviews the kill list, not just the pipeline — because what you remove matters as much as what you advance.

## Comp and Quota: Aligning the Plan With the Rigor You Need

You cannot tighten qualification with a comp plan that pays for loose behavior. If the plan rewards bookings volume and at-bats, reps will fight every kill rule and stuff the pipeline — rationally, because that's what you're paying for. Comp design is the enforcement mechanism for rigor.

**Pay on collected cash or cash-favorable structures, not just signed ARR, in a crunch.** A multiplier or accelerator on annual-prepaid and short-payment-term deals aligns the rep's wallet with the company's survival. If a net-90 enterprise deal and an annual-prepaid mid-market deal pay the rep identically, the rep has no reason to push for the structure that keeps the company alive.

**Reward qualification quality, not just outcomes.** Some teams add a small SPIFF or scorecard component for clean MEDDICC hygiene — EB access documented, Compelling Event dated — because in a crunch the *leading indicator* of rigor needs its own incentive, or it gets sacrificed to short-term activity.

**Be careful with the upmarket experiment's comp.** Reps assigned to the fenced upmarket bet need a comp plan that survives a longer cycle — a draw, or a ramped quota, or a milestone-based plan — or they will quietly drift back to easy core deals and the experiment dies from neglect rather than from an honest result. Conversely, don't over-pay the experiment so much that core reps feel punished for doing the survival work.

**Quota relief and segment reassignment.** When the CRO moves capacity to the fast-cash lane in Band C, quotas have to move with it — a rep reassigned from enterprise to mid-market mid-year with the old enterprise quota will disengage. RevOps and the CRO retune quotas to the new reality; pretending the plan still works is a morale and forecasting failure.

**The honest message to the team.** The CRO should say it directly: "The plan now pays for the behavior the company needs to survive — fast, well-qualified, cash-favorable deals. It pays less for volume and for slow deals. That's not a punishment; it's the company and your wallet pointed the same direction." Reps respect a plan that's honest about the situation more than one that pretends nothing changed.

## Forecasting Under a Cash Constraint: From Bookings Forecast to Cash Forecast

In abundant times the CRO forecasts bookings and finance translates to cash. In a crunch, the CRO must forecast *cash* directly, because the gap between the two is exactly where companies die.

**Run a cash-collection forecast, not just a bookings forecast.** Every committed deal carries a cash-date estimate (close date + collection lag + a buffer for procurement reality). The forecast the board sees in a crunch is "collected cash by month against the zero-cash line," with the bookings forecast as a secondary view. This makes Layer 5 rigor visible and unavoidable.

**Haircut the upmarket experiment separately and hard.** Its pipeline gets its own conversion assumptions — typically half the core's Stage-3 close rate — and it never blends into Commit. The board should be able to see, on one page, "core committed cash" and "experiment upside" as distinct lines.

**Forecast the kill rate.** A healthy crunch pipeline *shrinks* as rigor tightens — that's the system working. The CRO should forecast and explain the shrinkage ("we will kill ~30% of current Stage-1/2 because it fails the new criteria; here's why that's good") so a tightening pipeline isn't misread as a collapsing one.

**Scenario-plan around the zero-cash date.** Three lines: conservative (only Commit-grade deals at their cash dates), expected (Commit + risk-adjusted Best Case), and stretch (includes a fenced-experiment win). The CRO and CEO use the gap between conservative and the zero-cash date to decide whether the company needs to also cut burn — because sometimes the honest answer is that no qualification strategy closes the gap and the lever is cost, not revenue.

**The discipline of saying "this segment can't help in time."** The hardest forecast statement a CRO makes in a crunch is "enterprise deals opened after this date cannot collect cash before zero, so they are out of the survival forecast entirely — they're next-fundraise pipeline, not this-quarter pipeline." Saying it clearly is what separates a real cash forecast from hope with a spreadsheet.

## The RevOps and Tooling Layer: Instrumenting Rigor

Rigor that lives in a methodology deck and not in the system is theater. The CRO needs RevOps to *instrument* every layer so it's enforced, measured, and visible.

**CRM stage gates with required fields.** In Salesforce or HubSpot, stage advancement should be *blocked* by validation rules until the rigor criteria are met — EB field populated, Compelling Event date entered, Metric quantified. Rigor you can skip is rigor that gets skipped under pressure. Tools like a MEDDICC-scoring app, or native scorecard fields, make Layer 2 machine-checkable.

**A cash-date field and a runway dashboard.** Every opportunity carries an estimated-cash-date field; a dashboard plots committed and best-case collected cash against the zero-cash line. This is the single most important artifact in a crunch and most companies don't have it — they have a bookings dashboard and a separate finance model that never meet.

**Automated kill-rule enforcement.** No-motion timers (Salesforce flows, or tools like Clari, Gong, or BoostUp) flag and auto-route stale deals to a recycle or kill review. Layer 4 cannot depend on reps remembering to kill their own deals — it must be a system behavior the CRO reviews.

**Conversation intelligence for qualification truth.** Gong / Chorus / Clari Copilot let the CRO and front-line managers verify that claimed EB access and Compelling Events are *real* — that the rep actually talked to the buyer, that the "Compelling Event" isn't a fabricated date. In a crunch, the gap between CRM-claimed rigor and actual-call rigor is where forecasts die; conversation intelligence closes it.

**Pipeline analytics segmented by everything.** Clari, BoostUp, or InsightSquared/Mediafly broken out by segment, cycle, cash-lag, and source — so the diagnostic five numbers are always live, not an afternoon's archaeology. The CRO should be able to re-run the band decision in an hour, every month.

**Deal desk / CPQ for structure rigor.** A configured deal desk (even a lightweight one) that makes cash-favorable structures — annual prepaid, shorter terms, the discount-for-velocity trade — easy and governed, so Layer 5 structural qualification happens at scale and not deal-by-deal heroics.

The principle: every rigor layer needs a *field*, a *gate*, and a *dashboard*. If it has only a slide, it isn't real.

## Scenario 1 — The Series A SaaS at 8 Months: Cash-Conversion Mode

A 40-person Series A company, $3.2M ARR, burning $420K/month, $3.4M in the bank — eight months of runway, no term sheet. The founder/CEO wants to "go enterprise" because three inbound logos with recognizable names appeared. The CRO's diagnostic: mid-market cycle is 52 days median with a 12-day cash lag (annual-prepaid common); the nascent enterprise motion has no closed deals but comparable companies show 140-180 day cycles plus 60-90 day cash lag. Enterprise cycle-plus-lag (~230 days) blows past the eight-month runway.

The CRO's call: Band C, hard. The upmarket experiment is *suspended*, not run — the three shiny logos are logged as "post-raise pipeline" and handed minimal nurture, not rep capacity. All seven reps focus on the proven mid-market motion. Layer 4 kill rule goes to 21 days; the CRO reviews the kill list every Monday and roughly 35% of existing pipeline is culled in the first two weeks (it fails the new EB/Compelling-Event gates). Comp shifts an accelerator onto annual-prepaid. Result over the next two quarters: bookings *velocity* per rep rises because reps stop drowning in dead discovery calls; collected cash by month improves enough to extend runway to ~13 months, which is the window the company uses to raise. The enterprise gamble wasn't wrong forever — it was wrong *now*, and the CRO's rigor discipline bought the runway to do it later from strength.

## Scenario 2 — The Series B at 22 Months: The Fenced Barbell

A Series B company, $14M ARR, 22 months of runway, mid-market motion humming. The board wants an upmarket move; the CRO agrees the *strategy* is right and the *timing* is affordable. This is Band A, so the CRO runs the barbell properly. Core (80% of capacity) stays at standard MEDDICC rigor. A fenced experiment (20% — two dedicated AEs plus a solutions engineer) targets enterprise with documented looser entry criteria (EB access required at Stage 2, not Stage 1), a separate forecast line, pre-committed success criteria (3 enterprise logos and sub-30-month CAC payback within one cycle + 30 days), and a hard kill-date.

At the kill-date the experiment has 2 closed logos (one short) but a CAC payback trending to 26 months and a healthy Stage-3 cohort — partial success. Because it was fenced, the CRO can make a *clean* decision: scale the experiment to 30% of capacity for the next two quarters with slightly tightened criteria, rather than either abandoning a promising motion or betting the company on an unproven one. The fence didn't slow the upmarket move — it made the move *legible* enough to double down on with confidence. Contrast this with the un-fenced version, where the team would have a fuzzy "enterprise feels like it's working?" debate with no clean read.

## Scenario 3 — The CRO Who Loosened and Lost

A 60-person company, 10 months runway, bookings 30% short of plan. Under board pressure framed as "be more aggressive," the CRO loosened Layer 1 entry criteria across the board and dropped the kill rules ("don't give up on deals"). The pipeline *tripled* in dollar terms within a quarter — and the CEO and board relaxed, because the pipeline coverage ratio now looked great. But Stage-2 conversion fell from 44% to 19%, cycles stretched as reps split attention across three times the deals, and — fatally — the inflated pipeline delayed the burn-cut decision by a full quarter because "the pipeline is strong, we'll close our way out."

Two quarters later: collected cash barely moved (the extra pipeline was junk), runway was down to 3 months, and the company took a punishing down-round bridge. The post-mortem finding: the company didn't have a bookings problem, it had a *rigor* problem, and loosening rigor converted a survivable shortfall into a near-death event by hiding the truth in a fat, fake pipeline. The lesson the CRO took into the next role: in a crunch, a *shrinking* pipeline with rising conversion is health; a *growing* pipeline with falling conversion is the company lying to itself.

## Scenario 4 — The Mid-Market Company That Found the Fast-Cash Lane

A vertical SaaS company at 11 months runway discovered, through the diagnostic, that one sub-segment — a specific industry niche they'd treated as incidental — had a 24-day cycle, near-immediate annual-prepaid cash, a 38% win rate, and an 8-month CAC payback, while their "strategic" enterprise focus had a 6-month cycle and 20-month payback. The CRO's move was the legitimate exception to "always tighten": they *loosened* Layer 1 entry criteria *specifically for the fast-cash niche* (more at-bats genuinely convert to near-term cash there), while *tightening* everywhere else and suspending the enterprise push.

Three reps were reassigned to the fast lane with retuned quotas and a cash-velocity accelerator. Collected cash per month rose ~40% within a quarter. The nuance that makes this scenario instructive: "loosen qualification in a crunch" is not always wrong — it's wrong as a *general* move and right as a *surgical* move on a proven fast-cash segment. The CRO's skill was knowing the difference, which only the five-number diagnostic could reveal.

## Scenario 5 — The PLG Company With a Sales-Assist Crunch

A product-led company, 9 months runway, with a self-serve base and a small sales-assist team chasing expansion and enterprise conversion. The temptation: throw the sales-assist team at big logos. The CRO's diagnostic showed self-serve-to-paid and expansion motions had near-zero cash lag and sub-3-week cycles, while sales-led enterprise had a 5-month cycle. The call: Band C — point the entire sales-assist team at *expansion within the existing base* and *converting high-usage self-serve accounts*, where the qualification signal is *product usage data* (a rigor layer PLG companies have that traditional ones don't), and suspend net-new enterprise.

The interesting rigor twist: in a PLG motion, Layer 1 entry criteria can be *automated and tightened simultaneously* — only accounts above a usage threshold get sales-assist attention, which is both looser-feeling (the rep doesn't have to manually qualify) and tighter-actually (the usage data is a better qualifier than a discovery call). The company expanded its way to runway extension without a single net-new enterprise deal, by recognizing that its best qualification instrument was already running inside the product.

## The Decision Framework: Calibrating the Dial in Practice

Pull it together into a repeatable quarterly procedure the CRO runs.

**Step 1 — Pull the five numbers.** Runway, blended cycle by segment, cash-collection lag by segment, win rate / Stage-2 conversion by segment, CAC payback by segment. If any are unavailable, the data gap is finding #1 and RevOps fixes it this quarter.

**Step 2 — Compute the fit test.** For each segment: does (median cycle + cash lag + a buffer) land inside the runway with margin? Classify each segment as *fits with margin*, *fits tight*, or *doesn't fit*.

**Step 3 — Set the band.** 18+ months → Band A (fenced barbell). 12-18 → Band B (collapse barbell, tighten core). Under 9-12 → Band C (cash-conversion mode). Adjust for trajectory and any term sheet in hand.

**Step 4 — Set the five rigor layers for the band.** Write down the explicit setting for entry criteria, advancement criteria, forecast inclusion, kill rule, and time-to-cash gate. Don't leave any layer to "judgment."

**Step 5 — Allocate capacity.** Decide the percentage split between core motion and any fenced experiment, and which specific reps sit where. In Band C, the experiment percentage is zero.

**Step 6 — Fence any experiment.** If you're running an upmarket bet, write the six fences: capacity cap, kill-date, success criteria, separate forecast line, documented looser entry criteria, dedicated capacity.

**Step 7 — Instrument it.** RevOps turns every layer into a field, a gate, and a dashboard. Build the cash-date field and the runway dashboard if they don't exist.

**Step 8 — Align comp.** Retune accelerators toward cash-favorable structures and the segments the band prioritizes; retune quotas for any reassigned reps.

**Step 9 — Communicate the arithmetic.** To CEO, board, and team: the runway number, the fit test, the band, and why. Lead with math, not with "conservative" or "aggressive."

**Step 10 — Re-run quarterly (or monthly in Band C).** The dial is not set-and-forget. As runway changes, the band changes, and the rigor settings change with it.

This is a procedure, not a philosophy — which is the point. A CRO under cash pressure needs a checklist they can run when the room is loud and the instincts are bad.

## The Five-Year and AI Outlook

Three forces will reshape this calibration problem over the next five years.

**AI compresses the diagnostic and the enforcement.** The five-number diagnostic that takes an afternoon today will be a live, always-on dashboard — AI agents pulling cycle, cash-lag, and conversion data continuously and re-recommending the band in real time. More importantly, AI conversation intelligence will make Layer 2 rigor *verifiable at scale*: instead of spot-checking calls, the system confirms on every deal whether EB access and a real Compelling Event exist, collapsing the gap between CRM-claimed and actual qualification. The CRO's job shifts from *gathering* the picture to *deciding* on it.

**AI lowers the cost of the upmarket experiment.** AI SDRs, AI-assisted research, and AI deal coaching reduce the human capacity cost of running a fenced enterprise experiment — meaning the barbell becomes affordable at lower runway bands than it is today. A Band B company in 2029 may be able to run a small fenced experiment that a Band B company in 2026 cannot, because the experiment costs less rep-time to run.

**Cash discipline becomes permanent, not cyclical.** The 2021 era of growth-at-all-costs is not coming back as the default. Efficient growth, cash-conscious go-to-market, and runway-indexed planning are becoming the standing expectation from boards, not the crisis-mode exception. The CRO who treats runway-indexed qualification rigor as a permanent operating discipline — not a thing you do only when cash is scary — will be the one boards trust with the next stage. The skill described in this answer is becoming a baseline competency of the role.

The constant through all three: AI changes the *cost* and *speed* of running the system, but the *judgment* — refusing the false binary, indexing rigor to runway, fencing the gamble, leading with arithmetic — remains irreducibly the CRO's.

## Defining the Terms: Qualification, Rigor, Runway, and the Cash Position

Before going deeper, pin the vocabulary, because imprecise terms are how this decision goes wrong. **Qualification** is the process of determining whether an opportunity is worth a seller's time and the company's selling capital — it is a filter, not a sales activity. **Rigor** is the strictness of that filter: how much evidence a deal must produce before it earns advancement, forecast credit, or continued investment. **Runway** is months of cash on hand at current net burn, with no heroic bookings assumptions baked in. **Cash position** is the absolute number — the bank balance — and it matters distinctly from runway because two companies with identical runway months can face very different decisions if one has $2M in the bank and a $110K burn while the other has $20M and a $1.1M burn; the second has more *optionality* to absorb a failed experiment even at the same runway ratio. And **upmarket** does not simply mean "bigger deals" — it means a structurally different motion: longer cycles, more stakeholders, procurement and security review, different buyer psychology, higher CAC, and a different cash-collection profile. Conflating "bigger ACV" with "upmarket" is a common error; a CRO can sometimes get bigger deals *within* the existing motion without taking on the full upmarket cost structure, and that distinction can dissolve the false binary entirely. The CRO who keeps these terms crisp can have a precise conversation; the one who lets them blur will end up arguing about feelings.

## The History of the Mistake: What 2021-2024 Taught Revenue Leaders

This calibration problem is not new, but the industry's collective memory of getting it wrong is recent and sharp. In the 2020-2021 zero-interest-rate era, capital was effectively free and the prevailing doctrine was growth-at-all-costs: hire ahead of need, loosen qualification to maximize at-bats, treat burn as a vanity signal of ambition. Qualification rigor was, in many orgs, actively *discouraged* — a disqualified deal was a lost logo, and logos drove the next round. Then the 2022 correction hit: public SaaS multiples compressed from growth-multiple to efficiency-multiple, the funding market froze, and thousands of companies discovered that their "strong pipeline" was a fiction built on loose qualification. The companies that survived were disproportionately the ones whose CROs had maintained — or rapidly rebuilt — qualification discipline, because they could see the truth in their numbers. Sequoia's *Adapting to Endure* memo, Bessemer's pivot to efficiency benchmarks, and the broad adoption of the burn multiple as a board-level metric all date to this period. The lesson revenue leaders carried forward: qualification rigor is not a fair-weather luxury, it is the instrument that keeps the forecast honest, and a CRO who lets it lapse in good times has no foundation to stand on when the cash gets tight. The current generation of CROs who lived through that correction treat runway-indexed rigor as muscle memory; the ones who didn't are the ones most at risk of repeating the mistake.

## The Cash-Conversion Cycle: Why Signed ARR Is a Lie in a Crunch

A theme that runs through this entire answer deserves its own treatment: in a cash crunch, **signed ARR and collected cash are different animals, and only one of them pays the team.** The cash-conversion cycle of a deal has four legs. First, the *sales cycle* — Stage 1 to signature. Second, the *invoicing lag* — how long after signature you actually issue the invoice (often 1-3 weeks, longer if there's an implementation milestone). Third, the *payment terms* — net-15, net-30, net-60, net-90, or annual-prepaid-on-signature. Fourth, the *collection reality* — the gap between when payment is due and when it actually arrives, which for enterprise procurement portals can add weeks. Add those four legs together and a "closed" enterprise deal can be 90-130 days from signature to cash-in-bank, on top of a 150-day sales cycle. That is the difference between a deal that helps a company with nine months of runway and a deal that closes beautifully into a bankruptcy filing. The CRO's discipline here is to make every forecasted deal carry an *estimated cash date*, not just a close date, and to qualify Layer 5 against it. It also reframes the deal desk's job: trading a discount point for annual-prepaid-on-signature isn't margin erosion in a crunch — it's converting a slow, uncertain cash leg into an immediate one, which can be worth far more than the discount costs. A CRO who only watches bookings is flying with one instrument; in a crunch, the cash-conversion cycle is the artificial horizon.

## Pipeline Coverage Ratios and Why They Lie Under Loose Qualification

Most revenue orgs run on a pipeline coverage ratio — 3x, 4x, sometimes 5x pipeline-to-quota — as the headline health metric. In a cash crunch this metric becomes actively dangerous, because **coverage ratio is a function of qualification rigor, and loosening rigor inflates coverage without improving outcomes.** Walk the mechanics: if you loosen Layer 1 entry criteria, more opportunities get created, pipeline dollars rise, and the coverage ratio climbs — from 3x to 5x to 7x. To a CEO or board reading the dashboard, that looks like health, even strength. But the *conversion rate* of that pipeline has collapsed, so the *expected* closed-won from a loose 7x pipeline can be lower than from a tight 3x pipeline. The coverage ratio lied. This is precisely the trap in Scenario 3: the company tripled pipeline, the coverage ratio looked great, the board relaxed, and the burn-cut decision was delayed a full quarter — into the grave. The CRO's counter-discipline is to never report coverage ratio without reporting the *conversion-adjusted* coverage alongside it: pipeline dollars times the historical Stage-to-close rate for that pipeline's actual composition. A 3x pipeline of EB-confirmed, Compelling-Event-dated deals is worth more than a 7x pipeline of loose discovery-stage opportunities, and the CRO's job is to make sure the board sees the *quality-weighted* number, not the vanity number. In a crunch, coverage ratio without a conversion adjustment is one of the most common ways a company lies to itself.

## Multi-Threading and Single-Threading: A Rigor Decision Hiding in Plain Sight

One specific qualification behavior deserves isolation because it is both high-leverage and frequently sacrificed under cash pressure: **multi-threading** — having relationships and validated information across multiple stakeholders in a deal, rather than running the whole opportunity through a single contact. Single-threaded deals are the most common cause of late-stage slippage and surprise losses: the one champion goes quiet, changes jobs, gets overruled, or simply was never as influential as they claimed. In abundant times, single-threading is a tolerable inefficiency. In a crunch, it is a rigor failure that directly threatens survival, because a single-threaded deal in your Commit forecast is a deal you don't actually understand, and a forecast built on deals you don't understand is the thing that delays the hard cash decisions. The CRO's rigor move: make multi-threading an *advancement criterion*, not a best practice. A deal cannot reach Stage 3 / forecast-committed without validated access to at least the Economic Buyer plus one other stakeholder, and conversation intelligence is used to verify the threads are real, not claimed. This is more expensive per deal — it takes seller time — which is exactly why teams cut it under pressure, and exactly why the CRO must protect it. The arithmetic: a single-threaded deal's true close probability is often half what the rep believes; multi-threading is how you make the forecast match reality, and in a crunch a forecast that matches reality is worth more than almost anything else.

## The Champion Test: Qualifying the Human, Not Just the Account

Inside MEDDICC, the "C" — Champion — is the single most over-claimed and under-tested element, and in a crunch the cost of a fake champion is measured in irreplaceable runway. A *contact* is not a champion. A *champion* is someone with influence in the account who is *personally invested* in your solution winning and is *willing to sell on your behalf* when you are not in the room. Most reps, asked "do you have a champion?", will name their friendliest contact — usually a coach (someone who gives you information) or a mere influencer, not a true champion. The qualification rigor here is the **champion test**: ask the supposed champion to do something that costs them a little political capital — get you a meeting with the Economic Buyer, share the internal decision criteria document, introduce you to a skeptical stakeholder, give you the real timeline. A real champion does it. A fake champion deflects, delays, or goes quiet — and that deflection *is* the disqualification signal. In a cash crunch the CRO should make champion-testing an explicit, documented step before a deal earns Stage-3 forecast credit, because a deal carried by a fake champion will consume a full sales cycle of scarce capacity and then evaporate. Testing the champion early is how you fail fast on the deals that were never real, freeing capacity for the ones that are. It feels confrontational, which is why reps avoid it; the CRO's job is to normalize it as standard rigor.

## Inbound vs. Outbound: How Lead Source Changes the Rigor Setting

Qualification rigor is not source-blind. The optimal rigor setting differs sharply between inbound and outbound pipeline, and a CRO who applies a single uniform standard will mis-tune both. **Inbound** leads arrive with self-selected intent — they raised their hand — so the qualification question is less "do they have a need" and more "are they an ICP fit, do they have budget, and can this close in our runway window." Inbound can often be qualified faster and the bottleneck is speed-to-lead and ICP-fit screening. **Outbound** pipeline is the opposite: you manufactured the interest, so the burden of proof on *whether a real, funded, time-bound need exists* is much higher, and the rigor at Layer 1 and Layer 2 must be correspondingly stricter — outbound deals are far more likely to be polite-curiosity opportunities that never had a Compelling Event. In a crunch, this distinction drives capacity allocation: inbound from the proven core segment is usually the highest-survival-contribution pipeline because it combines real intent with a known-fast motion, while outbound into a new upmarket segment is the lowest — manufactured interest plus an unproven, slow motion. The CRO calibrating rigor should set source-and-segment-specific entry criteria rather than one global bar, and in Band C should bias capacity hard toward the inbound-core-segment intersection. The general principle: rigor should be heaviest where the *evidence of real, funded, time-bound demand* is weakest, and outbound-into-upmarket is exactly that corner.

## The Discovery Call: Where Rigor Is Won or Lost in 45 Minutes

Almost all of the qualification rigor described in this answer is *enacted* in a single recurring event: the discovery call. If discovery is run as a demo-with-extra-steps — rep talks, shows product, asks "what did you think" — then no amount of CRM stage-gating will save the pipeline, because the gates will be filled with fiction. Rigorous discovery has a specific shape. It is buyer-talking-most-of-the-time. It surfaces and *quantifies* the pain in the buyer's own numbers (the Metric). It maps the decision process and the other stakeholders (multi-threading starts here). It probes for the Compelling Event — the reason this must happen by a date, as opposed to someday — and if there genuinely isn't one, that is a finding, not a failure. It tests the buyer's budget reality without being crude about it. And critically, in a crunch, it surfaces the *procurement and timeline reality* early — net-terms, security review, legal — because that feeds Layer 5. The CRO's job is to make rigorous discovery a *trained, inspected, coached* capability, not a hope. Conversation intelligence makes this inspectable at scale: the CRO and front-line managers can verify that discovery calls are actually doing this work, not just being logged as done. In a cash crunch, the quality of the discovery call is upstream of the quality of the forecast, which is upstream of the quality of every survival decision the company makes. It is the highest-leverage 45 minutes in the company.

## Sandbagging, Happy Ears, and the Two Forecast Pathologies

A CRO calibrating rigor must understand the two opposite ways reps distort the pipeline, because they require opposite corrections. **Happy ears** is the optimism distortion: the rep believes deals are better-qualified and closer than they are, calls weak deals Commit, and hears buying signals that aren't there. Happy ears inflates the forecast and is the more dangerous pathology in a crunch because it hides the truth and delays hard decisions. **Sandbagging** is the pessimism distortion: the rep deliberately under-calls deals — keeps real opportunities in Best Case or Pipeline rather than Commit — to manage expectations and bank a clean beat. Sandbagging deflates the forecast and, while less immediately lethal, still corrupts the cash planning the company depends on. The rigor instrument corrects both: *evidence-based* forecast inclusion criteria (EB confirmed, Compelling Event dated, paper started) replace rep sentiment entirely, so a happy-ears rep can't inflate (the evidence isn't there) and a sandbagging rep can't deflate (if the evidence is there, the deal is Commit by rule, not by mood). This is why Layer 3 forecast-inclusion rigor must be *mechanical* — tied to fields and gates — rather than judgmental. In a crunch the CRO cannot afford a forecast that is the sum of twelve reps' psychological states; they need a forecast that is the sum of evidence. Conversation intelligence and CRM gate enforcement are how you get there. The CRO who knows which pathology each rep tends toward can coach the individual, but the system must be designed so neither pathology can move the number.

## Org Design: Who Owns Each Rigor Layer

Qualification rigor fails when ownership is ambiguous, so the CRO must explicitly assign each of the five layers to a role. **Layer 1 (entry criteria)** is typically co-owned by marketing/SDR leadership and RevOps — they control what becomes an opportunity and must agree on the ICP-fit and pain bar. **Layer 2 (advancement criteria)** is owned by front-line sales managers — they are the inspection layer, the people who sit in deal reviews and enforce that a deal actually meets the gate before it advances. **Layer 3 (forecast inclusion)** is owned jointly by the CRO and RevOps — the CRO sets the standard, RevOps instruments and enforces it. **Layer 4 (the kill rule)** must be owned by the CRO directly in a crunch — it cannot be delegated to the people whose comp depends on pipeline staying fat; the CRO reviews the kill list personally. **Layer 5 (time-to-cash)** is co-owned by the CRO and the CFO/finance — it is the layer where revenue and finance must be genuinely joined, because it depends on the zero-cash date and the cash-collection model that finance owns. The deeper org-design point: in a healthy company these ownerships are distributed and the system runs on its own; in a crunch the CRO pulls Layers 4 and 5 closer to themselves because those are the layers where local incentives (rep comp, manager pipeline pride) most conflict with company survival. RevOps is the connective tissue across all five — they own the instrumentation, the fields, the gates, and the dashboards that make every layer real rather than aspirational. A CRO who can't name the owner of each layer has five layers of theater.

## The Board Conversation: Scripting the Hardest Meeting

The CRO will have to take this calibration to the board, and that meeting is where good analysis goes to die if it isn't scripted. The board's default questions — "are we being aggressive enough?", "why is pipeline down?", "shouldn't we be chasing those big logos?" — all pull toward loosening, and they are asked by smart, well-intentioned people who are pattern-matching to growth-era playbooks. The CRO's script has four moves. **One: lead with the runway number and the zero-cash date** — make the constraint concrete and shared before discussing strategy, so the conversation is grounded in arithmetic, not ambition. **Two: show the fit test** — the cycle-plus-cash-lag by segment against the runway, so it is *visible* that enterprise deals opened today cannot collect cash before zero. This converts "be aggressive" from a values statement into a scheduling fact. **Three: reframe the pipeline-down narrative** — "pipeline is down because we tightened qualification and culled junk; here is conversion-adjusted coverage, which is *up*; a smaller honest pipeline is the goal, not a problem." **Four: present the band decision and the fences** — show that the upmarket ambition is not abandoned, it is *sequenced and fenced*, with explicit success criteria and a kill-date, so the board hears discipline, not timidity. The CRO who walks into that room with feelings ("I think we should be careful") loses to the board member with a growth-era reflex. The CRO who walks in with the runway number, the fit test, the conversion-adjusted coverage, and a fenced plan wins the room — and, more importantly, keeps the company's decision-making anchored to reality. This meeting is itself a rigor artifact.

## Common Failure Modes: A Field Guide

Pattern-match against the ways this calibration most commonly fails, so the CRO can spot them early. **The panic loosen** — cash gets tight, the team drops qualification to chase volume, pipeline inflates, conversion collapses, the company runs out of money with a "strong pipeline" (Scenario 3). **The un-fenced gamble** — the upmarket bet is run by reallocating top reps with no capacity cap, no kill-date, and no separate forecast line; six months later there's a beautiful enterprise pipeline, zero cash, and burned-out reps. **The split-attention decay** — every rep is asked to do "some upmarket," so no one does either motion well, the core silently degrades, and neither outcome is attributable. **The forecast-theater delay** — loose qualification produces a fat forecast that lets the CEO and board postpone the burn-cut decision past the point where it could have worked. **The over-correction starve** — rigor is taken to an extreme, kill rules cull recoverable deals, entry criteria reject legitimate early pipeline, and the funnel shrinks below recoverable coverage. **The vanity-metric trap** — the team optimizes signed ARR and coverage ratio while collected cash and conversion quietly deteriorate. **The dogmatic-tighten miss** — the CRO tightens uniformly and misses the fast-cash-lane exception, leaving survival cash on the table. **The comp-misalignment drag** — the CRO tightens the process but leaves a comp plan that pays for loose behavior, so reps fight every gate. **The data-gap bluff** — the band decision is made on a five-number diagnostic built from too few closed deals, producing false precision. **The terminology blur** — "upmarket," "aggressive," and "bigger deals" get conflated, and the team argues about feelings instead of motions. Each failure mode has a specific antidote already described in this answer; the value of the field guide is *recognition* — a CRO who can name the failure mode they're sliding into can stop, and a CRO who can't will live it.

## A 90-Day Operating Plan for a CRO Walking Into a Crunch

Concretize the framework into a time-boxed plan for a CRO who has just inherited — or just recognized — a cash crunch. **Days 1-10: establish the truth.** Pull the five diagnostic numbers with RevOps and finance; if the data isn't there, that's finding one. Compute the fit test. Set the provisional band. Build the cash-date field and the runway dashboard if they don't exist — you cannot manage what you can't see. **Days 11-25: tighten the core and build the kill list.** Set the five rigor layers for the band, instrument them as fields and gates in the CRM, and run the first kill-list review personally — expect to cull 25-35% of existing pipeline in Band C, and explain *why* that's health to anyone who panics. **Days 26-40: decide and fence the experiment.** If the band allows an upmarket bet, write the six fences and assign dedicated capacity; if it's Band C, formally suspend the experiment and re-log the shiny logos as post-raise pipeline. **Days 41-55: align comp and capacity.** Retune accelerators toward cash-favorable structures, reassign reps to the prioritized segments, and retune the quotas of anyone who moved. **Days 56-70: install the cash forecast.** Switch the board-facing forecast to collected-cash-against-zero-cash-date with three scenario lines; brief the board with the four-move script. **Days 71-90: run one full cadence and re-diagnose.** Execute one complete monthly close under the new rigor, measure conversion and collected cash against baseline, and re-run the five-number diagnostic — the band may already need adjusting. The plan's logic: truth first, then concentration, then the fenced bet, then alignment, then the honest forecast, then iterate. A CRO who runs this plan has, within a quarter, converted a panicked "conservative vs. aggressive" debate into an instrumented, communicable, self-correcting operating system — which is the entire job.

## The Final Framework: Rigor Is the Throttle, Runway Is the Index

Strip everything down to the load-bearing ideas.

**One — the binary is false.** "Conservative organic growth vs. aggressive upmarket gambling" is an emotional framing, not a strategy. The CRO's first move is to refuse it and reframe to: "What mix of qualified pipeline, by segment and cycle, gets us to cash-positive or a fundable milestone before zero?"

**Two — rigor rises as runway falls.** The panic instinct to loosen qualification in a crunch is the most expensive mistake in revenue leadership. Loose qualification at low runway produces forecast theater, not survival bookings. Tightening is the aggressive move, because it concentrates scarce firepower.

**Three — rigor is five layers, tuned separately.** Entry, advancement, forecast inclusion, the kill rule, and time-to-cash. In a crunch, the kill rule and the time-to-cash gate — the two layers most teams don't run at all — become the dominant controls.

**Four — the dial is set by five numbers.** Runway, cycle by segment, cash-collection lag, win rate by segment, CAC payback by segment. The derived metric that decides everything: does cycle-plus-cash-lag fit inside the runway?

**Five — runway bands map to settings.** 18+ months: fenced barbell. 12-18: collapse the barbell, tighten the core. Under 9-12: cash-conversion mode, suspend the experiment, qualify on time-to-cash.

**Six — fence every gamble.** Capacity cap, hard kill-date, pre-committed success criteria, separate forecast line, documented looser entry criteria, dedicated capacity. A fenced bet's worst case is a survivable lesson; an un-fenced bet's worst case is a dead company.

**Seven — instrument and align.** Every rigor layer needs a field, a gate, and a dashboard. Comp must pay for the behavior the band requires. A cash-collection forecast, not just a bookings forecast.

**Eight — lead with arithmetic.** The CRO's hardest job is holding the line against a scared room whose instincts all point toward loosening. Numbers don't get accused of timidity. Translate fear into math, repeatedly.

The deepest point: a cash crunch is not only a threat — it is a forcing function. It strips away the slack that lets sloppy qualification hide. A CRO who calibrates rigor well under that pressure doesn't just survive the crunch; they emerge with the most efficient, most honest, most legible go-to-market motion the company has ever had — and a board that knows the revenue leader can be trusted with the cash. Rigor is the throttle. Runway is the index. The CRO's job is to keep the two synchronized, and to refuse — out loud — every false binary that says they can't be.`;

const flow = `

## Decision Flow: Calibrating Qualification Rigor Against Runway

\`\`\`mermaid
flowchart TD
  A[Cash Crunch Forces GTM Decision] --> B[Refuse The False Binary]
  B --> C[Pull The Five Diagnostic Numbers]
  C --> C1[Runway In Months Hard]
  C --> C2[Median Cycle By Segment]
  C --> C3[Cash Collection Lag By Segment]
  C --> C4[Win Rate And Stage 2 Conversion By Segment]
  C --> C5[CAC Payback By Segment]
  C1 --> D[Compute Fit Test]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  D --> D1{Does Cycle Plus Cash Lag Fit Inside Runway}
  D1 -->|Fits With Margin| E[Set Runway Band]
  D1 -->|Fits Tight| E
  D1 -->|Does Not Fit| E
  E --> E1{Runway Months}
  E1 -->|18 Plus Months| F1[Band A Build Mode]
  E1 -->|12 To 18 Months| F2[Band B Discipline Mode]
  E1 -->|Under 9 To 12 Months| F3[Band C Cash Conversion Mode]
  F1 --> G1[Fenced Barbell 15 To 25 Percent Experiment]
  F1 --> G1b[Core At Standard MEDDICC Rigor]
  F2 --> G2[Collapse Barbell Experiment Max 10 Percent]
  F2 --> G2b[Harden Core Advancement Criteria]
  F3 --> G3[Suspend Upmarket Experiment Entirely]
  F3 --> G3b[Reallocate To Fastest Cash Lane]
  F3 --> G3c[Qualify On Time To Cash Not Bookings]
  G1 --> H[Set The Five Rigor Layers]
  G1b --> H
  G2 --> H
  G2b --> H
  G3 --> H
  G3b --> H
  G3c --> H
  H --> H1[Entry Criteria]
  H --> H2[Advancement Criteria]
  H --> H3[Forecast Inclusion]
  H --> H4[Kill Rule No Motion Timeout]
  H --> H5[Time To Cash Gate]
  H1 --> I[Fence Any Experiment With Six Constraints]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  I --> J[Instrument Every Layer Field Gate Dashboard]
  J --> K[Align Comp To Cash Favorable Structures]
  K --> L[Communicate The Arithmetic To CEO Board Team]
  L --> M[Re Run Quarterly Or Monthly In Band C]
  M --> C
\`\`\`

## Comparison Matrix: Loose vs. Tight Qualification Across Runway Bands

\`\`\`mermaid
flowchart LR
  subgraph BANDA[Band A 18 Plus Months Build]
    A1[Core 75 To 85 Percent Standard Rigor]
    A2[Fenced Experiment 15 To 25 Percent Looser Entry]
    A3[Kill Rule 45 Day No Motion]
    A4[Layer 5 Mostly Informational]
    A5[Outcome Learning Funded By Burn]
  end
  subgraph BANDB[Band B 12 To 18 Months Discipline]
    B1[Core Hardened EB Plus Compelling Event]
    B2[Experiment Max 10 Percent Tightened Entry]
    B3[Kill Rule 30 Day No Motion]
    B4[Layer 5 Real Gate Past Month 14 Scrutiny]
    B5[Outcome Every Deal Earns Its Place]
  end
  subgraph BANDC[Band C Under 9 To 12 Months Cash Conversion]
    C1[Maximum Rigor Everywhere]
    C2[Experiment Suspended Zero Capacity]
    C3[Kill Rule 21 Day No Motion CRO Reviews Weekly]
    C4[Layer 5 Primary Qualifier Cash Date Before Zero]
    C5[Outcome Time To Cash Optimized]
  end
  LOOSE[Loosening Qualification In A Crunch] --> X1[Pipeline Inflates Three X]
  X1 --> X2[Stage 2 Conversion Falls 44 To 19 Percent]
  X2 --> X3[Cycles Stretch Reps Split Attention]
  X3 --> X4[Forecast Theater Delays Burn Cut]
  X4 --> X5[Down Round Or Death]
  TIGHT[Tightening Qualification In A Crunch] --> Y1[Pipeline Shrinks Conversion Rises]
  Y1 --> Y2[Scarce Firepower Concentrated]
  Y2 --> Y3[Collected Cash Per Month Rises]
  Y3 --> Y4[Runway Extends To Fundable Window]
  Y4 --> Y5[Most Efficient GTM Quarter Ever Run]
  BANDA --> TIGHT
  BANDB --> TIGHT
  BANDC --> TIGHT
\`\`\`

`;

const src = `

## Sources

1. **MEDDIC / MEDDICC / MEDDPICC Qualification Methodology** — The dominant enterprise sales qualification framework: Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, Competition. Core reference for advancement-criteria rigor. https://meddicc.com
2. **David Skok / For Entrepreneurs — SaaS Metrics 2.0** — Foundational treatment of CAC, CAC payback period, LTV/CAC, and the relationship between sales efficiency and burn. https://www.forentrepreneurs.com/saas-metrics-2/
3. **Bessemer Venture Partners — State of the Cloud and the Efficiency Era** — Annual analysis of efficient growth, the Rule of 40, burn multiple, and capital-efficient go-to-market benchmarks.
4. **OpenView Partners — SaaS Benchmarks Report** — Sales cycle length, win rate, ACV, and CAC payback benchmarks segmented by ACV band and go-to-market motion.
5. **KeyBanc Capital Markets (KBCM) SaaS Survey** — Private SaaS company metrics including sales efficiency, magic number, and CAC payback by company stage.
6. **Tomasz Tunguz — Burn Multiple and Capital Efficiency** — Analysis of burn multiple (net burn / net new ARR) as the central efficiency metric in a cash-constrained environment.
7. **David Sacks — The Burn Multiple** — Original framework defining burn multiple tiers (great/good/suspect/bad/zombie) for runway-conscious growth.
8. **Winning by Design — Revenue Architecture and the Bowtie Model** — Pipeline-stage conversion rigor, the "moments that matter," and recurring-revenue funnel design.
9. **Force Management — Command of the Message / Value Selling** — Methodology connecting qualification rigor to value articulation and Economic Buyer access.
10. **The SaaS CFO (Ben Murray) — Cash vs. Bookings vs. Revenue** — The distinction between signed ARR, recognized revenue, and collected cash; cash-collection lag analysis.
11. **Clari — Revenue Operations and Forecasting Benchmarks** — Forecast-category discipline, pipeline coverage ratios, and the cost of inflated pipeline.
12. **Gong Labs — Sales Conversation Research** — Empirical data on what qualification behaviors (multi-threading, EB access, Compelling Event identification) correlate with win rate.
13. **Pavilion (formerly Revenue Collective) — CRO Operating Benchmarks** — Peer benchmarks for sales cycle, win rate, and capacity allocation across SaaS stages.
14. **SaaStr — Cash, Runway, and the CRO's Role in a Downturn** — Jason Lemkin's writing on managing go-to-market when runway is the binding constraint.
15. **a16z — The Hidden Costs of Going Upmarket** — Analysis of how enterprise motions lengthen cycles, raise CAC, and change capital requirements.
16. **Insight Partners — ScaleUp Go-to-Market Benchmarks** — Segment-level sales productivity, ramp, and capacity-allocation data.
17. **ICONIQ Growth — Topline Growth and Operational Efficiency Report** — Benchmarks on growth efficiency, sales capacity productivity, and burn discipline at scale.
18. **Mark Roberge — The Sales Acceleration Formula** — Data-driven approach to qualification, rep capacity allocation, and the metrics that predict pipeline health.
19. **Bain & Company — Founder's Mentality and Profitable Growth** — Strategic framing on disciplined growth vs. growth-at-all-costs.
20. **McKinsey — Growth and Resilience in B2B Software** — Analysis of which go-to-market levers create durable vs. fragile growth under capital constraints.
21. **First Round Review — Sales Qualification and the Cost of Bad Pipeline** — Operator essays on qualification discipline and pipeline hygiene.
22. **CB Insights — Why Startups Fail** — "Ran out of cash" and "no market need" as leading failure causes; relevance of runway-indexed planning.
23. **Carta — Startup Cash and Runway Data** — Aggregate data on runway distributions, burn rates, and down-round frequency across funding stages.
24. **The 2021-2024 SaaS Correction — Public Market Comparables** — The shift from growth-multiple to efficiency-multiple valuation and its implication for CRO behavior.
25. **HubSpot Research — Sales Pipeline and Forecasting Practices** — Benchmarks on stage-gate discipline, CRM hygiene, and forecast accuracy.
26. **Salesforce — Opportunity Stage and Validation Rule Architecture** — Technical reference for instrumenting stage-gate rigor and required-field enforcement.
27. **BoostUp / InsightSquared — Pipeline Analytics and Deal Inspection** — Tooling reference for segmented pipeline analytics and automated deal-risk flagging.
28. **Sequoia Capital — Adapting to Endure** — The 2022 memo reframing growth priorities around capital efficiency and runway preservation.
29. **Y Combinator — Default Alive or Default Dead (Paul Graham)** — The foundational essay on whether a startup's trajectory reaches profitability before cash runs out — the conceptual root of runway-indexed decision making.
30. **Emergence Capital — Going Upmarket Playbooks** — Case-based analysis of when and how SaaS companies successfully move to enterprise.`;

const num = `

## Numbers, Benchmarks, and Unit Economics

**Runway bands and behavior:**
- Band A (Build): 18+ months runway. Fenced experiment 15-25% of selling capacity. Kill rule ~45 days no-motion.
- Band B (Discipline): 12-18 months. Experiment capped at 10% of capacity. Kill rule ~30 days.
- Band C (Cash-conversion): under 9-12 months. Experiment suspended (0% capacity). Kill rule 21 days, CRO reviews weekly.
- Default-dead threshold: a company whose current trajectory does not reach cash-flow positive or a fundable milestone before zero cash.

**Sales cycle benchmarks by segment (median Stage-1 to Closed-Won):**
- SMB / transactional: 14-35 days.
- Mid-market: 45-75 days.
- Enterprise: 120-180+ days; 75th percentile often 220-300+ days.
- A deliberately loosened upmarket experiment runs 1.7-2.4x the cycle length of the proven core motion.

**Cash-collection lag by segment (Closed-Won to cash-in-bank):**
- SMB annual-prepaid: 5-15 days.
- Mid-market: 20-45 days.
- Enterprise net-60/net-90 with procurement portal: 60-110 days.
- Discount-for-velocity trade: a 10-15% discount in exchange for annual-prepaid or net-15 terms can move cash 45-90 days earlier.

**Qualification conversion benchmarks:**
- Healthy SMB/mid-market motion: ~35-55% of created opportunities reach Stage 2; ~22-30% of Stage-2 deals win.
- Deliberately loosened upmarket experiment: ~12-18% Stage-2 conversion; ~10-15% win rate.
- Scenario 3 failure pattern: loosening dropped Stage-2 conversion from 44% to 19% while pipeline dollars tripled — net collected cash barely moved.
- A healthy crunch response: pipeline dollars *shrink* (~25-35% culled in the first two weeks of Band C) while conversion rises.

**CAC payback benchmarks:**
- Efficient SMB/mid-market: 5-15 months.
- Enterprise / upmarket: 18-30+ months; the fenced experiment in Scenario 2 trended to ~26 months.
- Upmarket CAC typically runs 2-3x the proven core segment's CAC.

**The survival contribution formula:**
- Deal survival contribution = P(close) x cash_collected x I(cash_date < zero_cash_date).
- The indicator term is binary: a $200K deal collecting cash after the zero-cash date has a survival contribution of zero regardless of ACV.

**Capacity allocation math:**
- Band A barbell: 75-85% core / 15-25% fenced experiment.
- Band B: ~90% core / up to 10% experiment.
- Band C: 100% core (fastest-cash lane) / 0% experiment.

**Fenced-experiment success criteria (illustrative, Band A):**
- 2-3 closed-won upmarket logos within one full cycle + 30 days.
- Blended upmarket CAC payback under 24-30 months.
- 4+ Stage-3 deals with confirmed Economic Buyer access.

**Forecasting discipline:**
- Three scenario lines: conservative (Commit-grade only at estimated cash dates), expected (Commit + risk-adjusted Best Case), stretch (includes a fenced-experiment win).
- The fenced experiment is haircut to ~50% of the core's Stage-3 close rate and never blended into Commit.
- Outcome of disciplined Band C execution (Scenario 1): runway extended from ~8 months to ~13 months; (Scenario 4): collected cash per month +~40% in one quarter.`;

const counter = `

## Counter-Case: When the Conventional Answer Is Wrong

The model above — tighten as runway falls, fence the gamble, lead with arithmetic — is right in the large majority of cases. But a rigorous CRO must know its failure modes.

**1 — The fast-cash-lane exception inverts the rule.** "Always tighten in a crunch" is wrong when the diagnostic reveals a proven sub-segment with a sub-30-day cycle and immediate cash collection. There, *loosening* Layer 1 entry criteria surgically — more at-bats genuinely converting to near-term cash — is the correct move. The rule is "tighten generally, loosen surgically on proven fast-cash lanes," not "tighten everything." A CRO who tightens the fast lane out of dogma leaves survival cash on the table.

**2 — Sometimes no qualification strategy closes the gap.** The whole framework assumes revenue calibration can move the zero-cash date enough to matter. Sometimes it can't — the shortfall is too large, the cycles too long, the market too soft. In that case the honest finding is that the binding lever is *burn*, not bookings, and a CRO who keeps optimizing qualification while the real answer is "cut costs now" is fiddling while the runway burns. Rigor calibration is not a substitute for the cost decision.

**3 — A truly time-sensitive upmarket window can justify an un-fenced bet.** Rarely, an enterprise opportunity is genuinely existential and time-boxed — a category-defining logo, a partnership-gated deal, a competitive displacement window that closes. If the expected value, even heavily haircut, exceeds the survival value of the safe path, a bigger, less-fenced bet can be correct. But this is the exception that proves the rule: it must be a *conscious, named, board-aligned* bet, not a panic drift into loose qualification dressed up as ambition.

**4 — Over-tightening can starve the pipeline below recoverable levels.** Rigor taken to an extreme — kill rules so aggressive that recoverable deals get culled, entry criteria so strict that legitimate early-stage opportunities never get worked — can shrink the pipeline past the point of recovery. The goal is *concentration* of firepower, not *abdication*. A CRO who culls 60% of pipeline and then has no coverage has over-corrected.

**5 — The cash-only forecast can hide strategic value.** Layer 5 (time-to-cash) rightly dominates in a crunch, but a CRO who applies it absolutely will kill every enterprise deal — including ones that don't help *this* runway but are essential to the *next raise's* story. The discipline is to *separate* them ("post-raise pipeline") not *destroy* them. Killing strategically important pipeline to optimize a 90-day cash window can win the quarter and lose the company's future.

**6 — Comp changes can break a team faster than a cash crunch.** Aggressively re-tuning comp toward cash-favorable structures and reassigning segments mid-year can trigger top-rep attrition that does more damage than the rigor gains recover. In some cases the right move is to hold comp roughly stable and drive rigor through management and tooling instead, accepting a slower behavioral shift to preserve the team.

**7 — The board pressure to "be aggressive" is sometimes correct.** The framework treats board pressure as a force to resist with arithmetic. But occasionally the board sees something the CRO doesn't — a fundability dynamic where demonstrable upmarket momentum, even at a cash cost, is what unlocks the next round. The CRO's job is not to reflexively resist the board; it's to make the arithmetic visible *and then* have the genuine strategic conversation. Sometimes the arithmetic and the fundraising narrative legitimately conflict, and that's a judgment call, not a formula.

**8 — Diagnostic data can be too thin to trust.** The whole model rests on five numbers. An early-stage company may not have enough closed deals to compute reliable segment cycle, win rate, or CAC payback — the "data" is three deals and noise. In that case the CRO must calibrate on judgment and comparable benchmarks while explicitly flagging the uncertainty, rather than pretending a five-number diagnostic built on a tiny sample is precise. False precision is its own failure mode.`;

const links = `

## Related Pulse Entries

- **q9558** — How should a CRO sequence the first three go-to-market hires when capital is constrained?
- **q9560** — When should a founder-CRO fire themselves from the sales leader role?
- **q9551** — How do you build a deal desk that accelerates cash without becoming a bottleneck?
- **q9552** — What discount-governance framework protects margin during a downturn?
- **q9553** — How should a CRO restructure comp plans mid-year without triggering top-rep attrition?
- **q9554** — Forecasting discipline: moving from a bookings forecast to a cash-collection forecast.
- **q9555** — How do you decide when to go upmarket vs. deepen your current segment?
- **q9556** — Pipeline coverage ratios: how much is enough, and when is it lying to you?
- **q9557** — MEDDICC vs. BANT vs. SPICED: choosing a qualification methodology by motion.
- **q9561** — How does a CRO run a sales org through a runway crunch without losing the team?
- **q9562** — The burn multiple as a go-to-market operating metric.
- **q9563** — When to suspend a go-to-market experiment vs. when to double down.
- **q9564** — Capacity allocation: building the rep-coverage model under a cash constraint.
- **q9565** — Founder-led sales: when the founder is the qualification filter.
- **q9566** — How to instrument qualification rigor in Salesforce with stage gates and validation rules.
- **q9567** — Conversation intelligence: closing the gap between CRM-claimed and actual qualification.
- **q9568** — CAC payback by segment: the diagnostic every CRO should run quarterly.
- **q9570** — Default alive vs. default dead: translating Paul Graham's frame into a GTM operating plan.
- **q9571** — How a CRO should communicate bad pipeline news to the board.
- **q9572** — The kill rule: building a no-motion timeout that reps actually follow.
- **q9573** — Time-to-cash as a qualification criterion: the layer most teams skip.
- **q9574** — Fencing a strategic bet: the six constraints that make a gamble survivable.
- **q9575** — PLG sales-assist: using product usage data as a qualification instrument.
- **q9580** — The CRO's quarterly operating cadence under capital efficiency.
- **q9601** — Deal structuring: trading discount for cash velocity.
- **q9602** — RevOps tooling stack for a cash-conscious go-to-market org.
- **q9610** — How AI changes sales qualification and deal inspection.`;

const tags = ['revops','cro','qualification','runway','sales-strategy','meddicc','forecasting','cash-management','gtm-strategy','founder-led-sales'];

const sources = [
  { title: 'MEDDIC / MEDDICC Qualification Methodology', url: 'https://meddicc.com' },
  { title: 'David Skok — SaaS Metrics 2.0 (For Entrepreneurs)', url: 'https://www.forentrepreneurs.com/saas-metrics-2/' },
  { title: 'Paul Graham — Default Alive or Default Dead', url: 'http://www.paulgraham.com/aord.html' }
];

const notes = {
  s6: 'Added 30 cited sources: MEDDIC/MEDDICC qualification methodology, David Skok SaaS Metrics 2.0, Bessemer State of the Cloud, OpenView and KBCM SaaS benchmarks, Tunguz/Sacks burn multiple frameworks, Winning by Design revenue architecture, Force Management value selling, The SaaS CFO cash-vs-bookings, Clari and Gong forecasting/conversation research, Pavilion CRO benchmarks, SaaStr downturn writing, a16z upmarket cost analysis, Insight/ICONIQ scaleup benchmarks, Mark Roberge sales acceleration, Bain/McKinsey growth discipline, First Round qualification essays, CB Insights and Carta runway/failure data, Sequoia Adapting to Endure, YC Default Alive/Default Dead, Emergence upmarket playbooks.',
  s7: 'Added comprehensive numbers block: runway bands and kill-rule settings (Band A 45-day / B 30-day / C 21-day), sales cycle benchmarks by segment (SMB 14-35d, mid-market 45-75d, enterprise 120-180d+), cash-collection lag by segment (SMB 5-15d to enterprise 60-110d), qualification conversion benchmarks (35-55% Stage-2 healthy vs 12-18% loosened-upmarket, 44%-to-19% failure pattern), CAC payback by segment (5-15mo efficient vs 18-30mo+ upmarket, 2-3x multiplier), the survival contribution formula with binary cash-date indicator, capacity allocation math per band, fenced-experiment success criteria, and three-line forecasting discipline.',
  s8: 'Added 8-element counter-case: the fast-cash-lane exception that inverts the tighten rule, cases where burn (not bookings) is the binding lever, time-sensitive upmarket windows that justify an un-fenced bet, over-tightening that starves the pipeline below recoverable levels, the cash-only forecast hiding strategic next-raise pipeline, comp changes breaking a team faster than the crunch, board pressure to be aggressive sometimes being correct, and diagnostic data being too thin to trust at early stage.',
  s9: 'Cross-linked 27 related Pulse entries across the q95xx founder/CRO operator-playbook cluster: GTM hiring sequencing, founder-CRO transitions, deal desk and discount governance, comp restructuring, cash-collection forecasting, upmarket timing, pipeline coverage, qualification methodology selection, runway-crunch team management, burn multiple, experiment suspend/double-down, capacity allocation, RevOps instrumentation, conversation intelligence, kill rules, time-to-cash qualification, fencing strategic bets, PLG sales-assist, and the effect of AI on qualification.',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the CRO qualification-rigor-vs-runway operator playbook. Two mermaid diagrams (the runway-indexed rigor decision flow from cash crunch through quarterly re-run, and a comparison matrix of loose-vs-tight qualification across the three runway bands). Full coverage: refusing the false binary, the core principle that rigor rises as runway falls, the five layers of qualification rigor, the five-number diagnostic, runway-band-to-rigor-setting mapping, the six fences for an upmarket bet, the psychology of why loosening feels right and is wrong, stage-by-stage rigor placement, comp/quota alignment, cash-collection forecasting, RevOps tooling and instrumentation, five named scenarios (Series A at 8 months, Series B fenced barbell, the CRO who loosened and lost, the fast-cash-lane discovery, the PLG sales-assist crunch), a 10-step decision framework, the 5-year/AI outlook, and an 8-point final framework. 30 sources, comprehensive numbers block, 8-element counter-case, 27 cross-links.'
};

runPolish({ id: 'q9559', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
