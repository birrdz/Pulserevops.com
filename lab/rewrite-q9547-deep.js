// q9547 — What are the leading indicators that a company has outgrown its current approval model — and what's the migration playbook to a neutral Deal Desk?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** A company has outgrown its current approval model when **deal-level decisions stop being repeatable** — the same discount gets approved at 22% on Monday and rejected at 15% on Thursday because a different VP happened to be in the thread. The five hard leading indicators, in the order they show up: **(1) approval cycle time exceeds 10% of total sales cycle** — when a 45-day cycle carries 5+ days of internal back-and-forth, you have a structural tax, not a process; **(2) discount variance widens** — your standard deviation of discount-by-segment crosses ~8-10 points, meaning two identical customers pay materially different prices; **(3) "who approves this?" becomes a real question** asked in Slack more than ~3x/week; **(4) the CRO is personally approving more than ~15-20% of deals**, turning a leader into a bottleneck and a single point of failure; and **(5) finance discovers margin leakage after close** — concessions (payment terms, ramp deals, free months, premium support thrown in) that never hit an approval gate at all. The migration playbook to a neutral Deal Desk is a **90-day, 4-phase sequence**: **Phase 1 (Weeks 1-3) — instrument and baseline**: pull 6-12 months of closed deals, measure approval cycle time, discount variance, exception rate, and margin leakage; you cannot fix what you have not measured. **Phase 2 (Weeks 4-6) — design the policy and the matrix**: build a tiered approval matrix (rep-level / manager / Deal Desk / CRO+CFO) keyed to discount depth, term length, payment terms, and non-standard clauses; codify a **standard price book and a "standard deal" definition** so the Desk only touches genuine exceptions. **Phase 3 (Weeks 7-10) — stand up the function and the tooling**: hire or appoint a Deal Desk lead (the first hire is usually a senior RevOps or sales-ops person, not a finance person), wire approvals into **CPQ + Slack/Teams workflow + CRM** so the Desk is in the deal flow, not a side email; staff at roughly **1 Deal Desk analyst per 25-40 quota-carrying reps**. **Phase 4 (Weeks 11-13+) — enforce, measure, and earn neutrality**: publish SLAs (standard deals <4 business hours, complex <24), report approval cycle time and win-rate-by-discount-tier monthly, and **route escalations through the Desk, never around it** — the single behavior that determines whether a Deal Desk becomes a respected accelerant or an ignored speed bump. Neutrality is the whole point: the Desk reports into RevOps or Finance, **not into a sales leader who carries a number**, so its approvals are trusted by Finance and its speed is trusted by Sales. Companies that run this migration well typically **cut approval cycle time 40-60%, compress discount variance by half, and recover 1-4 points of blended gross margin** within two quarters. The most common failure mode is standing up a Desk that says "no" without offering a faster "yes" — a Deal Desk that only gates and never accelerates will be routed around within a quarter, and you will be back to the hallway-approval chaos you started with, except now with an extra headcount.`;

const core = `

## What "Outgrowing Your Approval Model" Actually Means

Every company starts with an approval model that is really just a person. In the seed and early Series A stage, the founder or first VP of Sales approves every non-standard deal personally, usually in a Slack DM or a hallway conversation, and that is genuinely the right design. Deal volume is low, the stakes of each deal are high, the founder has full context on strategy and cash position, and the cost of a centralized function would dwarf its benefit. The approval model is "ask the person who knows." It works because the person who knows can hold the entire deal book in their head.

Outgrowing that model is not a single event — it is the slow divergence between two curves. The first curve is deal volume and deal complexity, which compounds as you add reps, segments, products, geographies, and contract structures. The second curve is the bandwidth and context of the human bottleneck, which is flat or shrinking, because that human now has a company to run. When the gap between those curves becomes wide enough, three things break simultaneously: **decisions stop being fast** (the bottleneck is saturated), **decisions stop being consistent** (the bottleneck is making snap judgments without a framework), and **decisions stop being visible** (no one can answer "why did we approve that?" three months later). Outgrowing your approval model means the informal system has crossed from "lightweight and fast" to "opaque and unpredictable," and the symptoms show up in cycle time, in discount variance, and in margin.

The critical reframe for an operator is this: outgrowing your approval model is a **success problem**, not a failure. It means you sold enough, hired enough, and complicated your product enough that ad hoc judgment no longer scales. The mistake is not having an informal model early — that was correct. The mistake is keeping the informal model 18 months past the point where the indicators started flashing, because "it still mostly works" and standing up a Deal Desk feels like bureaucracy. By the time it visibly stops working, you have already lost a year of cycle time, margin, and forecast accuracy. The job of a good RevOps leader is to read the leading indicators and trigger the migration *before* the lagging indicators (missed quarters, margin surprises, rep attrition over deal friction) force the issue.

## The Core Principle: Repeatability Is the Real Test

Strip away every metric and the test for whether your approval model still works is one word: **repeatability**. Can two different deals with the same economic shape get the same answer, regardless of which human happens to be in the thread, what day of the quarter it is, and how that approver is feeling about the number? If yes, your model holds. If no — if the same 22% discount sails through on Monday and gets bounced on Thursday because a different VP picked it up, or because it is now week 11 of the quarter and everyone is twitchy — you have already outgrown it, even if cycle time still looks acceptable.

Repeatability matters for three reasons that compound. First, **reps optimize against the system they observe**. If approvals are unpredictable, reps stop trusting the process and start "managing" approvers — timing their requests, escalating to whoever is softest, padding their asks so the inevitable haircut still leaves them where they wanted to be. The approval process becomes a negotiation *inside* your company, which is pure waste. Second, **customers notice inconsistency**. In any segment with a reference network — and almost every B2B segment has one — customers compare notes. When two similar buyers discover they paid materially different prices for reasons neither can explain, you have created a trust problem and a future discount-anchor problem simultaneously. Third, **Finance cannot forecast an unrepeatable system**. If discount outcomes are a function of approver mood rather than deal attributes, then margin is genuinely unpredictable, and Finance's only defense is to assume the worst, which makes them say "no" more, which makes Sales route around them more, which is the death spiral.

A neutral Deal Desk exists to manufacture repeatability. It is, at its core, a mechanism that converts "what will this approver decide?" into "what does the policy say?" — and then handles the genuine exceptions with a consistent, documented, accountable process. Everything else in the playbook is implementation detail. The principle is: **the same deal should always get the same answer, and the answer should be explainable.**

## Leading Indicator #1: Approval Cycle Time Exceeds 10% of Sales Cycle

The first hard, quantifiable indicator is the ratio of internal approval time to total sales cycle. Measure it directly: for every non-standard deal, timestamp the moment the rep submits the approval request and the moment they receive a final answer. Sum that across the deal's life (a deal often goes through 2-4 approval rounds as terms change). Divide by total sales cycle length. When that ratio crosses roughly **10%**, you have a structural problem.

The 10% threshold is not arbitrary. Below 10%, approval time is noise — it overlaps with other deal activity, it does not move the close date, the customer never feels it. Above 10%, approval time becomes a *critical-path activity*: the deal is genuinely waiting on you, the customer is genuinely sitting idle, and your cycle time is now partly a self-inflicted internal tax. On a 45-day average cycle, 10% is 4.5 days; many companies discover, once they actually instrument it, that they are running 8-15% — a full week or more of pure internal latency per deal. At a few hundred deals a quarter, that is hundreds of rep-weeks and customer-weeks of pure friction, and it directly suppresses win rate because momentum is the single most predictive variable in B2B deal outcomes: a deal that stalls for a week loses champions, invites competitors, and slides into the next quarter.

The reason this indicator shows up *first* is that cycle time is the most immediately painful symptom and the easiest to feel even before you measure it. Reps complain. Managers escalate. Deals slip with "waiting on approval" in the CRM notes. But "feeling" it is not enough — you must instrument it, because the fix (a Deal Desk with published SLAs) is only as credible as the baseline you can show. When you can walk into a leadership meeting and say "our median approval cycle time is 6.2 days on a 41-day cycle — that is 15%, and here is the win-rate delta between deals that cleared approvals in under 24 hours and deals that did not," you have converted a vague complaint into a business case. Without the number, "approvals are slow" is just sales whining, and it will be treated as such.

## Leading Indicator #2: Discount Variance Widens Past Control Limits

The second indicator is statistical, and it is the one Finance feels most acutely: **discount variance**. Pull every closed-won deal for the last 6-12 months. Segment by the dimensions that *should* legitimately drive different pricing — customer size, product mix, term length, region, new-vs-expansion. Within each segment, calculate the mean discount and, critically, the **standard deviation**. When the standard deviation of discount within a segment crosses roughly **8-10 percentage points**, your approval model is no longer governing pricing — it is rubber-stamping whatever the rep and the loudest approver negotiated.

Here is why variance, not average, is the right metric. A high *average* discount might just mean your list price is wrong or your market is competitive — that is a pricing-strategy problem, not an approval problem. But high *variance within a segment* means two genuinely comparable customers paid very different prices, and the only explanation is that your approval process is inconsistent. That is the signature of an outgrown model. It tells you the system has no real control limits — the "policy" is whatever survived the negotiation. Variance is also the leading indicator of future margin erosion, because every unusually deep discount becomes a reference point: the rep who got 35% approved once will cite it forever, the customer who got 35% will expect it at renewal, and the next rep will hear about it and ask for the same.

Sophisticated RevOps teams treat this like statistical process control. Set control limits per segment — say, mean discount ±1.5 standard deviations under a healthy model — and any deal outside the band is, by definition, an exception that must route to the Deal Desk. When you first instrument this, you will typically find that 25-40% of deals fall outside reasonable control limits, which is itself the proof that your current model is not controlling anything. A healthy, Desk-governed system pulls that down to 5-12% genuine exceptions, with the rest of the distribution tight around segment means. The migration's success is literally measurable as variance compression: if discount standard deviation by segment does not roughly halve within two quarters of standing up the Desk, the Desk is not working.

## Leading Indicator #3: "Who Approves This?" Becomes a Recurring Question

The third indicator is qualitative but unmistakable, and it is free to detect: **how often does someone ask, in Slack or Teams or a hallway, "who approves this?"** In a healthy model, the answer is always obvious — the approval path is so clear that the question never gets asked, because the rep already knows from the matrix exactly who they need and the tooling routes it automatically. When that question starts appearing more than roughly **three times a week** across the org, your approval model has no legible structure. People are navigating it by tribal knowledge and trial and error.

This indicator matters because it reveals a hidden cost that the cycle-time metric misses: the **discovery tax**. Before a rep can even start the approval clock, they spend time figuring out *who* to ask. They DM a manager, who DMs RevOps, who says "I think that needs Finance, but check with the CRO." That whole scramble happens *before* the approval request is formally submitted, so it does not show up in cycle-time instrumentation — but it is real latency, real cognitive load, and real evidence of structural decay. It also produces inconsistency directly: if the routing is ambiguous, the same deal type gets sent to different approvers by different reps, which guarantees the variance problem in Indicator #2.

There is a darker version of this indicator worth watching for: when reps stop asking "who approves this?" not because the path is clear but because they have learned **who to ask to get the answer they want**. That is approval-shopping, and it is a sign the model has not just decayed but become actively gamed. You can detect it in the data: if certain approvers have systematically higher approval rates or deeper approved discounts for the same deal profiles, reps have noticed and are routing accordingly. Either version of Indicator #3 — confusion or gaming — says the same thing: there is no legible, enforced approval structure, and a neutral Desk with deterministic routing is the fix.

## Leading Indicator #4: The CRO Is Personally Approving Too Many Deals

The fourth indicator is about the bottleneck human, and it has a specific number: when your CRO (or VP Sales, or founder still running sales) is personally approving more than roughly **15-20% of all deals**, the leader has become the approval model, and that is a fragile, expensive, and self-limiting design.

Walk through why this is a problem from three angles. **Bandwidth**: a CRO approving 15-20% of deals at a company doing hundreds of deals a quarter is spending a meaningful share of their week in deal mechanics — context-switching into individual deal economics — instead of on territory design, hiring, enablement, pipeline strategy, and the board. The opportunity cost is enormous because it is the most expensive person in the revenue org doing work a well-designed policy could do. **Single point of failure**: if approvals route through one human, that human's vacation, sick week, travel, or simple overload becomes a company-wide deal slowdown. Quarters get lumpy because the bottleneck's calendar gets lumpy. **Inconsistency**: ironically, the senior leader is often the *least* consistent approver, because they are pattern-matching against strategy and gut rather than a documented framework, and their answer legitimately changes with their read of the quarter, the board's mood, and cash position. That is fine for the genuinely strategic 2-5% of deals — the lighthouse logo, the deal that sets a category precedent — but it is corrosive when applied to the routine 15-20%.

The healthy target is that the CRO and CFO *jointly* approve only the genuine top tier — call it the deepest 2-5% of deals by discount or contract risk — and everything else is handled by the matrix and the Desk. The migration's job is to give the CRO a system they trust enough to let go of the other 12-18%. This is often the hardest political part of the whole playbook, because the CRO's personal approval involvement frequently feels like control and like staying close to the business. The reframe that works: a CRO who approves 18% of deals does not have control, they have a *job*; a CRO who designed the policy and watches the dashboard has *leverage*. Selling that reframe is half the migration.

## Leading Indicator #5: Finance Finds Margin Leakage After Close

The fifth and most dangerous indicator is the one that shows up last and hurts most: **Finance discovering, in the post-close numbers, concessions that never passed through any approval gate at all.** The headline discount got approved — the 20% off list went through the proper channel. But the deal also carried 90-day payment terms instead of 30, a three-month ramp where the customer pays nothing, two months free thrown in to "get it across the line," premium support bundled at no charge, an opt-out clause, a most-favored-nation pricing commitment, and a custom SLA with financial penalties. None of those hit an approval matrix because the matrix only governs the discount percentage. Finance finds them weeks later when revenue recognition and cash collection do not match the booking.

This is the most dangerous indicator because it reveals that your approval model has the wrong *scope*, not just the wrong *speed*. Discount percentage is the visible, easy-to-govern lever, so that is what immature approval models govern. But the real margin and the real risk live in **terms**: payment timing (a cash-flow cost), ramp structure (a revenue-timing cost), free periods (a straight giveaway), bundled services (a delivery-cost giveaway), and legal clauses (a risk and future-flexibility cost). A 15%-discount deal with 120-day terms, a 4-month ramp, and an MFN clause can be worse for the business than a 30%-discount deal that is otherwise clean — but the immature model waves the first one through and agonizes over the second.

When Finance starts finding these post-close — and they always eventually do, because the cash and the rev-rec tell on the deal — it is definitive proof you have outgrown your model, because it means the model is not just slow or inconsistent, it is **blind to most of the economic surface area of a deal**. The Deal Desk fix is explicitly scoped to close this gap: the Desk governs *deal shape*, not just discount depth. The approval matrix in Phase 2 must have rows for payment terms, contract length, ramp/free-period structure, bundled services, and non-standard legal clauses — each with its own threshold and its own approver. If your migration only tightens discount approvals and ignores terms, you will fix Indicators 1-4 and leave Indicator 5 wide open, and Finance will (correctly) still not trust the system.

## Secondary Indicators: The Softer Signals Worth Watching

Beyond the five hard indicators, a set of softer signals tends to cluster around an outgrown approval model, and a good operator watches for them as confirmation. **Rep complaints about approvals show up in attrition interviews and engagement surveys** — when "deal friction" or "I can't get deals approved" appears in exit conversations, the process cost has become a talent cost. **Quarter-end congestion** — a visible spike in approval requests in the last two weeks of every quarter that overwhelms approvers and produces rushed, inconsistent decisions exactly when the stakes are highest — signals that the model has no load-balancing and no off-quarter discipline. **Win/loss notes citing internal slowness** — when "we lost momentum" or "they went dark while we waited internally" appears in loss reasons, your approval latency is now losing deals outright, not just annoying reps.

Other soft signals: **legal and finance get pulled into deals reactively and late**, firefighting non-standard clauses at the eleventh hour rather than being designed into the flow, which produces both slowness and bad terms. **The forecast and the actuals diverge on margin specifically** — top-line forecasting might be fine while gross-margin forecasting is consistently off, because the discount-and-terms reality is not captured in any system the forecast can see. **New reps take an unusually long time to close their first deal**, partly because they cannot navigate an undocumented approval process. **Channel or partner deals are a free-for-all**, because the informal model was built around direct deals and never extended to the partner motion. **Product and pricing changes do not propagate** — when you launch a new SKU or change list price, the informal approval model has no mechanism to update everyone's mental model, so reps keep quoting the old structure for months.

Any one soft signal is noise. Three or four of them clustering, alongside two or more of the hard indicators, is a clear migration trigger. The discipline is to treat the indicator review as a *recurring* exercise — quarterly is right — rather than waiting for a crisis. The companies that migrate smoothly are the ones that caught the indicators at "amber" and ran a calm 90-day project; the ones that migrate painfully are the ones that waited for "red" — a blown quarter, a margin surprise to the board, a top rep quitting over deal friction — and then had to stand up a Deal Desk under duress, which is the worst possible condition for a change-management project.

## What a Neutral Deal Desk Actually Is — and Why "Neutral" Is Load-Bearing

Before the playbook, define the destination precisely, because "Deal Desk" is one of the most overloaded terms in RevOps and people picture wildly different things. A Deal Desk is a **centralized function that owns the deal-approval process end to end**: it maintains the pricing and discount policy, operates the approval matrix, sits in the deal flow as the routing and decision hub for non-standard deals, structures and de-risks complex deals proactively, and reports on deal-economics health to the leadership team. It is part traffic controller, part deal architect, part policy owner, part analyst.

The word that does the heavy lifting is **neutral**. A neutral Deal Desk reports into an organization that does **not carry a sales number** — almost always RevOps or Finance, occasionally a standalone function reporting to the COO. It explicitly does *not* report into a sales leader. This matters because the Deal Desk's entire value proposition rests on being trusted by both sides simultaneously: Finance must trust that the Desk is genuinely protecting margin and not just being a faster rubber stamp for whatever Sales wants, and Sales must trust that the Desk is genuinely trying to get good deals done fast and not just being Finance's "no" department with a new name. A Desk that reports to the CRO will, fairly or not, be suspected by Finance of being captured. A Desk that reports to the CFO and *acts* purely as a gatekeeper will be routed around by Sales. Neutrality — structural independence plus a genuine dual mandate of speed *and* discipline — is what makes the function credible to both, and credibility to both is the only thing that makes it work.

Neutral does not mean passive or purely administrative. The best Deal Desks are aggressively pro-deal: they exist to get the *right* deals done *faster*, and they treat "the right deal, structured well, approved in four hours" as their product. A neutral Desk will fight for a strategic deal as hard as any sales leader — it will just do it with a structure and a documented rationale rather than a hallway favor. The neutrality is about *whose interest the process serves* (the company's, not one function's), not about being a disinterested referee. Get this definition right before you start the migration, because every Phase 2 and Phase 3 decision — reporting line, first hire's background, how escalations route, what the SLAs are — flows from whether you actually mean "neutral."

## The Migration Playbook, Phase 1: Instrument and Baseline (Weeks 1-3)

The migration is a 90-day, four-phase project, and Phase 1 is pure measurement. You cannot fix, sell, or design a system you have not quantified. Spend the first three weeks pulling and analyzing data, with zero process changes — changing things before you have a baseline destroys your ability to prove the migration worked.

**Pull 6-12 months of closed deals** — won and lost — with every available attribute: list price, final price, discount percentage, payment terms, contract length, ramp structure, bundled services, non-standard clauses, segment, region, product mix, rep, approver(s), and timestamps for approval submission and resolution. This will be painful, because in an outgrown model this data lives in Slack threads, email, side spreadsheets, and people's heads — and the *difficulty of assembling it* is itself a finding worth putting in the report. **Compute the five hard indicators**: approval cycle time as a percentage of sales cycle (median and distribution); discount standard deviation by segment; frequency of "who approves this?" routing confusion (sample Slack/Teams or survey the reps); percentage of deals personally touched by the CRO; and an estimate of margin leakage from non-discount concessions (the terms that never hit a gate). **Compute the win-rate-by-approval-speed delta** — this single chart, showing that fast-approved deals win at a materially higher rate than slow ones, is usually the most persuasive artifact in the entire business case.

The deliverable for Phase 1 is a **baseline report** that does two things: proves the company has outgrown its model (the indicators, in red), and quantifies the prize (cycle time you can recover, variance you can compress, margin you can protect, win rate you can lift). This report is the business case you take to the leadership team to get the mandate, the headcount, and — critically — the *air cover* for Phase 4 enforcement. Skipping or rushing Phase 1 is the single most common reason migrations fail: without a hard baseline, you cannot prove the Desk worked, you cannot defend its headcount at the next budget cycle, and you cannot win the political fight in Phase 4 when a senior rep tries to route around it.

## The Migration Playbook, Phase 2: Design the Policy and the Approval Matrix (Weeks 4-6)

Phase 2 is design, and it has two core artifacts: the **standard-deal definition** and the **approval matrix**. Get these right and the Desk almost runs itself; get them wrong and the Desk becomes either a bottleneck (matrix too tight) or a rubber stamp (matrix too loose).

**Define the "standard deal."** This is the most underrated step in the whole playbook. A standard deal is one that, by definition, *needs no approval at all* — the rep can quote it, sign it, and close it within their own authority. Define it precisely: discount within a set band (e.g., 0-15% for this segment), standard payment terms, standard contract length, no ramp or free period, no bundled services beyond the default, standard legal language only. The wider and clearer your standard-deal definition, the more deals flow through with zero friction and the more the Desk's capacity is reserved for genuine exceptions. A well-designed system has **70-85% of deals qualify as standard** — the Desk only ever sees the 15-30% that are genuinely non-standard. If your standard-deal definition is so narrow that half your deals need approval, you have built a bottleneck, not a Desk.

**Build the approval matrix.** This is a tiered table where the *rows* are the deal levers — discount depth, payment terms, contract length, ramp/free-period structure, bundled services, non-standard legal clauses — and the *columns* are escalating thresholds, each mapped to an approver tier. A typical four-tier structure: **Tier 0 (rep self-serve)** = standard deal, no approval; **Tier 1 (manager)** = modest deviation, e.g., 15-25% discount or slightly extended terms; **Tier 2 (Deal Desk)** = material non-standard deal, e.g., 25-40% discount, extended payment terms, a ramp structure, or one non-standard clause; **Tier 3 (CRO + CFO joint)** = the genuine top tier, e.g., 40%+ discount, MFN or unusual legal risk, or strategic precedent-setting deals — the 2-5%. Every row needs its own thresholds; the discount column is not enough, because Indicator #5 lives in the terms. Design the matrix collaboratively with Sales, Finance, and Legal in the room — a matrix imposed without sales input will be resented and gamed; a matrix designed *with* sales leadership is one they will help enforce. Also codify a **standard price book** in Phase 2, because a Desk policing discounts off an inconsistent or stale list price is policing noise.

## The Migration Playbook, Phase 3: Stand Up the Function and the Tooling (Weeks 7-10)

Phase 3 turns the design into an operating function — a person and a system.

**The first hire (or appointment).** The first Deal Desk hire is almost always a **senior RevOps or sales-operations person, not a finance person**. The reasoning is deliberate: the hardest part of the first 6-12 months is earning sales' trust and operating credibly inside the deal flow, and a sales-ops background buys instant credibility with reps and an instinct for deal mechanics. A finance-first hire risks the Desk being perceived as "Finance's outpost" from day one, which poisons the neutrality. Bring finance rigor in through the *reporting line and the policy* (the Desk's matrix is co-owned with Finance), not necessarily through the first hire's resume. This person needs to be senior — they will be telling reps "no" and "not like that, like this" and pushing back on managers, so they need the gravitas to hold the line. **Staffing ratio**: roughly **1 Deal Desk analyst per 25-40 quota-carrying reps**, depending on deal complexity and volume; start at the lean end and add as volume and SLA data justify.

**The tooling.** A Deal Desk that operates over email is a Deal Desk that will be slow and invisible. Wire it into the systems where deals already live: **CPQ** (Configure-Price-Quote) so the matrix logic is enforced at quote time and standard deals are auto-approved without a human touch; **CRM** (Salesforce, etc.) so approval state is a field on the opportunity and is visible in the forecast; and **a workflow layer in Slack or Teams** so approval requests, routing, and decisions happen *in the flow of work* with full timestamps. The combination matters: CPQ enforces the policy deterministically (no approval-shopping, because the system routes), CRM makes approval state visible to forecasting, and the Slack/Teams layer makes the human exception-handling fast and logged. Tools commonly in this stack include Salesforce CPQ or DealHub or Conga or Subskribe for CPQ, native Salesforce approval processes or a workflow tool, and a Slack/Teams integration so the Desk is genuinely *in* the deal flow rather than a side inbox. The non-negotiable design principle: **every approval decision is timestamped and logged against the opportunity**, because Phase 4's entire credibility rests on being able to report cycle time and consistency from real data.

## The Migration Playbook, Phase 4: Enforce, Measure, and Earn Neutrality (Weeks 11-13+)

Phase 4 never really ends — it is the operating state — but the first weeks of it determine whether the migration succeeds or quietly collapses. Three things must happen.

**Publish and hit SLAs.** The Desk's promise to Sales is speed, and that promise has to be specific and kept. Publish SLAs: **standard-deal questions answered in under 4 business hours, complex deals in under 24 hours**, with an escalation path for genuine urgency. Then *hit them* — measured, reported, visible. The SLA is the Desk's side of the bargain: Sales agrees to route through the Desk, the Desk agrees to be fast. Miss the SLAs in the first quarter and Sales concludes the Desk is a speed bump and starts routing around it; hit them and Sales starts to see the Desk as the fast path. The first 90 days of SLA performance are the Desk's whole reputation.

**Route escalations through the Desk, never around it.** This is the single most important enforcement behavior, and it is primarily a leadership-discipline problem, not a process problem. The moment a senior rep, or a sales VP, takes a deal *around* the Desk straight to the CRO and gets a "yes," the entire system is dead — every other rep learns that the Desk is optional and the real game is still relationship-based escalation. Leadership has to hold the line: even genuinely strategic, genuinely urgent deals route *through* the Desk, which can fast-track them to the Tier 3 CRO+CFO approval in minutes if needed — but the Desk is in the loop, the decision is logged, and the precedent is recorded. The CRO's job in Phase 4 is to *refuse to be a backdoor*. This is exactly why Phase 1's business case and leadership mandate matter: when the migration was sold on hard numbers and the leadership team signed up for it, holding this line is far easier.

**Report relentlessly and earn neutrality through transparency.** Monthly, the Desk publishes: approval cycle time (trending down), discount variance by segment (compressing), exception rate (stabilizing at a healthy 15-30%), SLA hit rate (high), win rate by discount tier, and margin-leakage trend (shrinking as terms come under governance). Reporting to *both* Sales and Finance leadership, with the same numbers, is how the Desk earns its neutrality in practice: Finance sees discipline improving, Sales sees speed improving, and both see a function that is honest about its own performance. Neutrality is not granted by the org chart — the reporting line only makes it *possible*. It is *earned*, month after month, by a Desk that demonstrably makes deals both faster and better and tells the truth about it.

## Benchmarks and Real Numbers: What "Good" Looks Like

Operators need targets, so here is the benchmark set for a well-run, Desk-governed approval system. **Approval cycle time**: standard deals fully self-serve (zero approval latency); non-standard deals resolved within the published SLA (under 4 business hours for simple, under 24 for complex); median approval cycle time under 5% of total sales cycle, down from the 10-15% that triggered the migration. **Standard-deal rate**: 70-85% of deals qualify as standard and need no approval — if you are below 60%, your standard-deal definition is too narrow or your pricing is structurally broken. **Exception rate**: 15-30% of deals route to the Desk; below 15% suggests the matrix is too loose (you are not catching real exceptions), above 30% suggests it is too tight (the Desk is a bottleneck) or your pricing needs to be re-baselined. **CRO touch rate**: the CRO+CFO joint tier should be 2-5% of deals, down from the 15-20% that signaled the bottleneck. **Discount variance**: standard deviation of discount-by-segment should roughly halve within two quarters of the Desk going live — that compression is the cleanest single proof the Desk is working.

**Outcome benchmarks** from companies that run this migration well: approval cycle time **cut 40-60%**; discount variance **compressed by roughly half**; blended gross margin **recovered by 1-4 points** within two quarters as both discount discipline and terms governance take hold; win rate on fast-approved deals materially higher than the pre-migration baseline (the momentum effect made visible). **Staffing economics**: at 1 analyst per 25-40 reps, a 150-rep sales org runs a Desk of roughly 4-6 people; against the margin recovery and cycle-time gains, the Desk is typically strongly ROI-positive by the end of its second quarter — the 1-4 margin points alone usually dwarf the fully loaded cost of the function. **Timeline**: the 90-day migration gets the function *standing*; reaching the full benchmark outcomes takes another one to two quarters of operating discipline, so budget two to three quarters from kickoff to "this is clearly working." Anyone promising the full result inside 90 days is overselling.

## Tooling Deep Dive: The RevOps Stack Around a Deal Desk

The Deal Desk does not run on willpower; it runs on a stack, and the stack has four layers. **Layer 1 — CPQ (Configure-Price-Quote)**: this is the policy-enforcement engine. Salesforce CPQ, DealHub, Conga CPQ, Subskribe, and similar tools encode the price book and the approval matrix directly into the quoting process — a standard deal auto-approves, a non-standard one is automatically flagged and routed by rule. CPQ is what makes the matrix *deterministic* rather than advisory, and it is what kills approval-shopping, because the system, not the rep, decides who approves. If you have outgrown your approval model and do not yet have CPQ, implementing CPQ is often the single highest-leverage part of the migration. **Layer 2 — CRM**: Salesforce or equivalent holds approval state as structured data on the opportunity — submitted, in review, approved, with timestamps — so the forecast can see it and so Phase 1/Phase 4 reporting runs off real data, not a spreadsheet someone maintains by hand.

**Layer 3 — Workflow / collaboration**: a Slack or Teams integration that puts approval requests, routing, and decisions in the flow of work. This is what makes the *human* part of the Desk fast — the Tier 2 and Tier 3 exceptions get handled in a channel with full context and a logged decision, not in a buried email chain. Tools here range from native Salesforce approvals surfaced into Slack, to purpose-built workflow apps. **Layer 4 — Analytics / BI**: the reporting layer — Tableau, Looker, a CRM analytics module, or a dedicated RevOps analytics tool — that produces the monthly cycle-time, variance, exception-rate, and margin-leakage dashboards. A common mistake is buying the analytics layer last or never; without it, the Desk cannot prove its value and cannot defend its headcount. **Integration is the real work**: the value is not in any one tool but in CPQ enforcing the matrix, CRM holding the state, the workflow layer handling exceptions fast, and BI reporting the whole thing — wired together so a deal flows through without anyone re-keying data. A pile of disconnected tools is worse than a disciplined spreadsheet; an integrated stack is what makes a Desk scale.

## Org Design, Reporting Lines, and the Politics of Neutrality

The org-design decisions around a Deal Desk are where migrations most often go quietly wrong, because they are political, not technical. **Reporting line**: the Desk reports to RevOps or Finance, never to a sales leader who carries a number. RevOps is often the best home because RevOps already owns the systems (CPQ, CRM) and the cross-functional process mandate, and it is structurally neutral between Sales and Finance. Finance is a defensible alternative, especially at companies where RevOps is immature, but a Finance-housed Desk has to work harder to not be perceived as the "no" department. The worst choice — common and tempting because it feels efficient — is housing the Desk under Sales: it will be fast but Finance will not trust its discipline, which means Finance keeps its own shadow approval process, and you have two approval models instead of zero.

**The dual mandate**, made explicit in the Desk's charter and its goals: the Desk is measured on *both* speed (cycle time, SLA hit rate) *and* discipline (margin, variance, leakage). If you measure it only on speed, it becomes a rubber stamp; only on discipline, a bottleneck. Both, weighted, in the same scorecard. **Cross-functional governance**: the approval matrix and pricing policy should be co-owned by a small standing group — RevOps/Deal Desk, Finance, Sales leadership, and Legal — that reviews the policy quarterly. This keeps the matrix current as products and pricing evolve, and it keeps Sales leadership *bought in* rather than feeling something was done to them. **The cultural reframe** is the hardest and most important org-design work: the Desk has to be sold internally, repeatedly, as a *deal accelerator and a rep's ally* — "the fast path to a yes" — not as a control function. The framing, the early SLA wins, and visible stories of the Desk *rescuing* a deal by restructuring it are what convert the culture. Get the politics right and the technical migration is straightforward; get the politics wrong and the cleanest matrix in the world gets routed around.

## Comp and Incentive Implications

Standing up a Deal Desk has comp-plan implications that, if ignored, will quietly undermine the whole migration. The core tension: reps are paid on bookings, and discount discipline can feel, to a rep, like the company making their job harder. If the comp plan does not align with the new approval discipline, reps will treat the Desk as an adversary no matter how fast its SLAs are.

The primary lever is **margin-aware or discount-aware compensation**. Rather than paying flat commission on bookings regardless of discount, tie commission rate to discount depth or to a margin proxy: a deal closed at list or near-list pays a higher commission rate than a deeply discounted deal of the same contract value. This puts the rep and the Desk on the *same side* — both now want the deal done at a healthy price, not just done. It also reduces approval volume at the source, because reps stop reflexively reaching for discount as the first negotiating move. A lighter-touch version is a **discount budget or discretion band**: each rep gets authority to discount up to a set point without approval (reinforcing the standard-deal definition), and they are coached and measured on how much of that budget they consume — frugal use is recognized. **Avoid two failure modes**: do not make the comp plan so punitive on discounting that reps sandbag or walk from winnable deals, and do not leave comp untouched while tightening approvals, which just creates resentment without changing behavior. The Deal Desk migration and the comp-plan review should ideally be sequenced together or close together, because the approval matrix and the comp plan are two halves of the same incentive system: the matrix sets the *rules*, comp sets the *motivation* to follow them. Companies that migrate the Desk but leave a pure-bookings comp plan in place usually find the Desk fighting the comp plan for years.

## Forecasting and Pipeline Implications

A neutral Deal Desk is not only an approval mechanism — it is one of the best forecasting instruments a RevOps team can have, and the migration should be designed to capture that benefit deliberately. Before the Desk, discount and terms outcomes are invisible until close, so margin and even timing are genuinely hard to forecast. After the Desk, **every non-standard deal passes through a structured, logged checkpoint** — the Desk sees the deal shape, the requested terms, the likely final structure, and the approval status, all as structured data on the opportunity.

This produces three forecasting upgrades. First, **margin forecasting becomes real**: because the Desk governs and records discount *and* terms, Finance can forecast gross margin, not just top line, with the discount-and-terms reality captured in-system rather than discovered post-close. Second, **deal-timing signal improves**: a deal's approval status is a strong leading indicator of close timing — a deal stuck in Tier 2 review is genuinely at risk in a way the rep's stage might not show, and a cluster of deals hitting the Desk late in the quarter is an early warning of quarter-end congestion and slippage. Third, **the Desk becomes a pipeline-risk sensor**: patterns in what is routing to the Desk — a spike in deep-discount requests, a rash of non-standard-terms asks, a particular segment suddenly needing exceptions — surface competitive pressure, pricing problems, or rep-behavior issues earlier than the standard pipeline review would. The operating practice: pull Deal Desk data into the weekly forecast call and the monthly business review explicitly. The Desk lead should be a *participant* in forecasting, not just an approver. A migration that stands up the Desk purely as a gate and never connects it to the forecasting process leaves one of its biggest benefits on the table.

## Stage-by-Stage Evolution: From Founder Approval to Mature Deal Desk

Approval models evolve through recognizable stages, and matching your model to your stage is the whole game. **Stage 1 — Founder/First-Leader Approval (seed to early Series A, <~15 reps)**: one person approves everything informally. Correct for the stage; do not over-engineer it. The only discipline needed is to start *logging* decisions lightly, so you have history when you migrate. **Stage 2 — Manager-Tier Approval (Series A/B, ~15-40 reps)**: front-line managers get discount authority up to a band, the leader handles the rest. This is the first real matrix, and it is where most companies first feel the indicators flashing. The right move at Stage 2 is a *lightweight* matrix and a clear standard-deal definition — not yet a full Desk, but the policy scaffolding the Desk will later run on.

**Stage 3 — Dedicated Deal Desk (Series B/C, ~40-150 reps)**: this is when the five indicators have clearly tripped and the 90-day migration in this playbook applies. A neutral Desk, a real matrix, CPQ enforcement, published SLAs. Most companies *should* be here and many arrive late, having waited a year past the indicators. **Stage 4 — Mature, Specialized Deal Desk (Series C+ / scale, 150+ reps)**: the Desk specializes — separate handling for new business vs. renewals/expansions, for direct vs. channel, for segments or geographies; deeper deal-structuring and deal-strategy work; tighter integration with Legal and Revenue Operations; sometimes a split between a fast "deal hub" for routine exceptions and a senior "deal strategy" group for the complex top tier. **Stage 5 — Deal Desk as Strategic Function (enterprise scale)**: the Desk influences pricing strategy, packaging, and go-to-market design, feeding deal-level pattern data back into how the company prices and sells. The key operator lesson across stages: **the cost of being one stage behind compounds** — a Stage 3 company running a Stage 2 model is bleeding cycle time and margin every quarter — but being one stage *ahead* is also a real cost, because a 12-rep startup with a 5-person Deal Desk has built expensive bureaucracy it does not need. Read the indicators, match the stage.

## Scenario 1: The Series B SaaS Company With Founder-Approval Hangover

A vertical-SaaS company, ~$22M ARR, just past its Series B, has grown from 8 to 55 quota-carrying reps in 20 months. The VP of Sales — employee number four — still personally approves every deal over 15% off list, the way she did at $3M ARR. The indicators are all flashing: she is personally touching ~30% of deals, approval cycle time is running ~12% of a 50-day sales cycle, and discount standard deviation in the mid-market segment is over 11 points. Reps have learned to catch her between meetings; deals submitted on Friday afternoon sit until Tuesday. Finance flagged that Q3 gross margin came in 3 points below forecast, traced to ramp deals and free months that never hit her 15% discount gate.

The migration: Phase 1 produces a baseline report showing 6.1 days of median approval latency and the margin-leakage estimate, plus a chart that deals approved in under a day win at a notably higher rate. That report gets the leadership mandate in one meeting. Phase 2 defines a standard deal (0-15% discount, standard terms, no ramp) covering ~75% of historical deals, and builds a four-tier matrix with explicit rows for payment terms and ramp structure — closing the leakage gap. Phase 3 hires a senior RevOps analyst as the Desk lead and wires the matrix into the existing Salesforce CPQ. Phase 4 publishes a 4-hour/24-hour SLA. The hard part is behavioral: for the first month, two senior reps try to go straight to the VP, and she has to visibly redirect them to the Desk. By the end of Q2 post-launch, approval cycle time is down ~55%, mid-market discount standard deviation is under 6 points, and the VP is touching ~4% of deals — the strategic ones — and spending the reclaimed time on hiring and territory design. The lesson: the founder-approval hangover is the most common trigger, and the hardest part is never the matrix — it is getting the original approver to actually let go and refusing to be the backdoor.

## Scenario 2: The Company That Built a "No" Desk and Got Routed Around

A mid-market infrastructure-software company, ~120 reps, stood up a Deal Desk — but housed it under Finance, staffed it with two analysts from the FP&A team, and gave it a single mandate: protect margin. Within a quarter it had a reputation. The Desk said "no" a lot, slowly, with little explanation, and offered no faster "yes" — a deep-discount request would sit for two days and come back rejected with a one-line note. Reps did the rational thing: they stopped using it. They escalated to their VP of Sales, who escalated to the CRO, who — under quarter-end pressure — approved deals directly. Within two quarters the Desk was processing only the deals reps could not avoid sending it, the real approval model was back to hallway escalation, and the company had added two headcount for negative value.

The fix was effectively a re-migration. Leadership moved the Desk's reporting line to RevOps, rechartered it with an explicit *dual* mandate — speed and discipline, both in the scorecard — and added a third hire with a sales-ops background as the lead, specifically for credibility with reps. They published SLAs for the first time and, critically, the CRO publicly committed to stop being the backdoor and to redirect every escalation through the Desk. The Desk's new operating posture was "our job is to get you to yes faster, and if the deal as-asked is a problem, we will tell you in two hours how to restructure it to a yes" — accelerator framing, not gate framing. It took about two quarters to rebuild trust. The lesson is the playbook's central warning made concrete: **a Deal Desk that only gates and never accelerates will be routed around, and once reps have routed around it once, winning them back is far harder than getting it right the first time.** Neutrality and the dual mandate are not nice-to-haves; they are the function.

## Scenario 3: The PLG Company Hitting Its First Real Deals

A product-led-growth company — years of self-serve, credit-card signups, no sales team to speak of — has just hired its first 12 enterprise reps to chase the large accounts that PLG surfaced. There is *no* approval model at all, because there were never any negotiated deals; pricing was whatever the website said. Now reps are getting asked for volume discounts, annual prepay terms, custom SLAs, security addendums, and multi-year structures, and every one of those is being figured out from scratch, ad hoc, by whoever the rep can grab — usually the founder or the VP of Product.

This is a different migration shape: there is no outgrown model to replace, there is a *missing* model to build, and the indicators tripped on day one of having a sales motion. The playbook still applies but compresses: Phase 1's "baseline" is thin (there is little history), so it leans on competitive and market benchmarking instead. Phase 2 is the heaviest phase — the company has to invent its standard-deal definition, its enterprise price book, and its matrix more or less from nothing, which is genuinely hard without historical deals to calibrate against. Phase 3 stands up a *small* Desk — one person, often a senior RevOps generalist — appropriate to 12 reps. Phase 4 emphasizes building the data discipline from scratch so that in a year there *is* a baseline. The lesson: PLG companies adding a sales motion need to build an approval model and a Deal Desk *deliberately and early*, before the indicators force it, because they have no informal-model muscle memory to fall back on — the absence of any prior process is itself the trigger.

## Scenario 4: The Post-Acquisition Two-Model Mess

A company completes an acquisition and now runs two sales orgs with two completely different approval cultures. The acquirer had a mature, neutral Deal Desk; the acquired company ran founder-style hallway approvals with very loose discount discipline. For the first two quarters post-close, the two orgs operate their two models in parallel — and the result is exactly the chaos the indicators describe, but doubled: a customer who could be sold by either org gets wildly different pricing depending on which rep picks up the phone, discount variance across the combined book is enormous, and Finance cannot forecast margin on half the pipeline.

The migration here is a *consolidation*, and it is mostly politics and change management. Phase 1 baselines *both* orgs separately, which usually shows the acquired org with far worse indicators — useful, because it makes the case for adopting the acquirer's model rather than negotiating a blended compromise. Phase 2 is largely "extend the acquirer's matrix and standard-deal definition to the combined entity," with adjustments for any genuinely different segments or products the acquisition brought. Phase 3 is a tooling-and-training lift: get the acquired reps onto the combined CPQ and CRM, and train them on a Desk process they have never used. Phase 4's enforcement challenge is acute, because the acquired reps experience the Desk as a *loss of freedom* and the acquired sales leaders may have informal-approval habits of their own. The lesson: post-acquisition is a forcing function for Deal Desk maturity, and the right move is almost always to *standardize on the more mature model fast* rather than let two models coexist — every quarter of coexistence is a quarter of margin leakage and customer-trust damage, and the longer two cultures run in parallel the harder consolidation gets.

## Scenario 5: The Company That Migrated Too Early and Built Bureaucracy

A well-funded seed-stage company, ~$4M ARR and 11 reps, hired an experienced RevOps leader from a much larger company. Pattern-matching to her last role, she stood up a full Deal Desk: a four-tier matrix, a CPQ implementation, two Desk analysts, published SLAs. On paper it was textbook. In practice it was a tax. At 11 reps and modest deal volume, the founder *could* still hold the whole deal book in his head, the indicators were not actually flashing (cycle time was fine, variance was tolerable, the founder touching a high percentage of deals was *appropriate* at that scale), and the Desk added a layer of process and two headcount the company did not need. Reps found it slower than just asking the founder. The CPQ implementation consumed engineering and ops time that should have gone to growth.

The correction was to *de-scope*: collapse the Desk to a single part-time function (the RevOps leader herself handling the genuine exceptions), simplify the matrix to a lightweight two-tier model, pause the heavy CPQ build until volume justified it, and redeploy the two analysts. The lesson is the mirror image of the other scenarios and just as important: **the indicators cut both ways.** The migration playbook is triggered by the indicators *flashing*, not by ambition or by pattern-matching to a bigger company. A Stage-2 company does not need a Stage-3 Deal Desk; building one early creates real cost — headcount, process drag, tooling overhead — for benefit that does not yet exist. Read the actual indicators in your actual business. Migrate when they trip, not before, and not late.

## A Decision Framework for Triggering the Migration

Pulling the playbook into a usable decision tool, the trigger logic runs in three layers. **Layer 1 — score the five hard indicators**, each red/amber/green: approval cycle time vs. 10% of sales cycle; discount standard deviation by segment vs. the 8-10 point control limit; "who approves this?" routing-confusion frequency; CRO personal-touch rate vs. 15-20%; and evidence of post-close margin leakage from ungoverned terms. Two or more *red*, or four or more *amber*, is a clear migrate signal. **Layer 2 — confirm with the soft signals**: deal friction in attrition interviews, quarter-end congestion, loss reasons citing internal slowness, reactive late legal/finance involvement, margin-specific forecast misses. Several soft signals clustering with the hard reds removes any doubt. **Layer 3 — sanity-check the stage**: are you at the size and complexity (roughly Series B/C, ~40+ reps, multiple segments/products) where a Deal Desk is stage-appropriate? If the hard indicators are flashing but you are genuinely tiny, the answer may be a lightweight matrix and a clearer standard-deal definition rather than a full Desk — fix the model without over-building the function.

If Layers 1-3 say migrate, the *sequencing* decision is fixed: run the four phases in order — instrument, design, stand up, enforce — and do not skip Phase 1, because the baseline is the business case, the headcount defense, and the Phase 4 political air cover all at once. The single most important framework question is not "should we have a Deal Desk?" — at scale the answer is almost always yes — but "are we *late*?" Most companies are. The honest version of the framework is a diagnostic for *how overdue* the migration is, and the cost of every quarter of delay (compounding cycle-time loss, variance, margin leakage, rep frustration) is the number that should drive urgency. Run the indicator review quarterly so you catch the trigger at amber and migrate calmly, rather than at red, under the duress of a blown quarter.

## The 5-Year and AI Outlook for Deal Desks and Approval Models

Over the next five years, three forces reshape how approval models and Deal Desks work. **First, AI-assisted deal structuring and approval.** Much of the Tier 1 and Tier 2 work — checking a deal against the matrix, flagging which clauses are non-standard, suggesting how to restructure a deal to fit within an approval band, drafting the rationale for an exception — is automatable. The near-term realistic state is *AI-assisted*, not AI-autonomous: an AI layer that pre-screens every deal, instantly tells the rep "this is standard, you're clear" or "this needs Tier 2 because of the payment terms, here's how to restructure it to Tier 1," and drafts the exception write-up — with humans still owning genuine judgment and the strategic top tier. This compresses cycle time further and lets a leaner Desk cover more reps, shifting the Desk analyst's role from *processing* exceptions toward *strategy and deal architecture*. **Second, deeper real-time integration.** CPQ, CRM, billing, CLM (contract lifecycle management), and revenue platforms continue to converge, so the approval matrix becomes enforced continuously and invisibly across the whole quote-to-cash flow rather than as a discrete gate — the Desk increasingly governs by exception and by policy-design rather than by touching deals.

**Third, the scope of "deal economics" keeps widening.** As usage-based and hybrid pricing, complex multi-product bundles, and AI-feature pricing proliferate, the *terms* surface area of a deal — the thing Indicator #5 is about — grows, which makes the governance-of-deal-shape mandate more important, not less. The Desk of 2030 governs a more complex deal object than the Desk of today. The constant through all of it is the **principle**, not the mechanics: repeatability, neutrality, and the dual mandate of speed-plus-discipline do not become less true because AI does the matrix-checking — they become *more* central, because AI makes the mechanical part cheap and leaves human attention for exactly the judgment, the politics, and the strategy that the principle is about. The operator takeaway: invest in the *policy clarity, the data discipline, and the neutral org design* now, because those are the durable assets — the tooling layer will keep changing under them, and a company with a clean matrix, clean data, and a trusted neutral function will adopt each new tooling wave easily, while a company with a political, opaque, undocumented model will not be saved by buying the AI layer.

## The Final Framework: Repeatability, Neutrality, Acceleration

Compress the entire playbook into three words and they are the test, the structure, and the purpose of a Deal Desk migration. **Repeatability** is the *test* for whether you have outgrown your model: the same deal should always get the same answer, and the five hard indicators — cycle time past 10%, discount variance past control limits, recurring "who approves this?", CRO over-involvement, post-close margin leakage — are all just different ways of detecting that repeatability has broken. When you cannot give the same deal the same answer, you have outgrown your model, full stop, regardless of whether the pain has fully surfaced yet. **Neutrality** is the *structure* of the fix: a Deal Desk that reports outside the sales line, carries an explicit dual mandate of speed and discipline, and earns the trust of both Sales and Finance month after month through transparent reporting. Neutrality is what makes the function *credible*, and credibility to both sides is the only thing that makes a Desk actually used rather than routed around. **Acceleration** is the *purpose* — and the most common thing migrations forget. A Deal Desk exists to get the right deals done *faster*, not just to gate the wrong ones. The Desk's product is "the right deal, structured well, approved in four hours." A Desk that only says "no" — even a fast, neutral, well-staffed one — fails, because reps route around a pure gate within a quarter. The Desk has to be, and has to be *seen* as, the fast path to a yes.

The migration sequence — instrument, design, stand up, enforce — is just the operational expression of those three words. Phase 1 instruments *repeatability* (the baseline proves it broke). Phase 2 designs the structure that *manufactures* repeatability (the standard-deal definition and the matrix). Phase 3 stands up the *neutral* function and the tooling that enforces the matrix deterministically. Phase 4 earns the neutrality through SLAs and transparent reporting, and delivers the *acceleration* that makes the whole thing stick. A company that runs this well does not just fix a process — it converts deal approval from an opaque, political, unpredictable tax into a fast, consistent, measured accelerant, and it recovers cycle time, margin, and forecast accuracy in the process. The companies that do it badly stand up a "no" desk, get routed around, and end up back where they started with extra headcount and more cynicism. The difference between those two outcomes is not the matrix design or the tooling choice — it is whether the operator understood that the destination was never "control." It was repeatability, neutrality, and acceleration, all three, or it does not work.

`;

const flow = `

## Decision Tree: Have You Outgrown Your Approval Model — and What Do You Do?

\`\`\`mermaid
flowchart TD
  A[Quarterly Approval Model Review] --> B{Score 5 Hard Indicators}
  B --> B1[Approval Cycle Time vs 10% of Sales Cycle]
  B --> B2[Discount StdDev by Segment vs 8-10 Points]
  B --> B3[Who Approves This Asked 3x Per Week]
  B --> B4[CRO Personally Approving 15-20% of Deals]
  B --> B5[Finance Finds Post-Close Margin Leakage]
  B1 --> C{Two Or More Red Or Four Plus Amber}
  B2 --> C
  B3 --> C
  B4 --> C
  B5 --> C
  C -->|No| D[Model Still Holds - Re-Review Next Quarter]
  C -->|Yes| E{Confirm With Soft Signals}
  E --> E1[Deal Friction In Attrition Interviews]
  E --> E2[Quarter End Congestion]
  E --> E3[Loss Reasons Cite Internal Slowness]
  E --> E4[Reactive Late Legal Finance Involvement]
  E1 --> F{Stage Check - Series B Plus And 40 Plus Reps}
  E2 --> F
  E3 --> F
  E4 --> F
  F -->|Too Early Or Tiny| G[Build Lightweight Matrix And Standard Deal Definition Only]
  F -->|Stage Appropriate| H[Trigger 90 Day Migration]
  H --> P1[Phase 1 Weeks 1-3 Instrument And Baseline]
  P1 --> P1a[Pull 6-12 Months Closed Deals]
  P1 --> P1b[Compute 5 Indicators And Win Rate By Speed]
  P1 --> P1c[Deliver Baseline Report And Get Leadership Mandate]
  P1a --> P2[Phase 2 Weeks 4-6 Design Policy And Matrix]
  P1b --> P2
  P1c --> P2
  P2 --> P2a[Define Standard Deal - Target 70-85% Of Deals]
  P2 --> P2b[Build 4-Tier Matrix With Rows For Discount Terms Ramp Legal]
  P2 --> P2c[Codify Standard Price Book]
  P2a --> P3[Phase 3 Weeks 7-10 Stand Up Function And Tooling]
  P2b --> P3
  P2c --> P3
  P3 --> P3a[Hire Senior RevOps Lead Not Finance - 1 Per 25-40 Reps]
  P3 --> P3b[Wire CPQ Plus CRM Plus Slack Teams Workflow]
  P3a --> P4[Phase 4 Weeks 11-13 Plus Enforce And Earn Neutrality]
  P3b --> P4
  P4 --> P4a[Publish SLAs - 4 Hours Standard 24 Hours Complex]
  P4 --> P4b[Route All Escalations Through Desk Never Around It]
  P4 --> P4c[Report Cycle Time Variance Leakage Monthly To Both Sales And Finance]
  P4a --> R[Outcome After 2-3 Quarters]
  P4b --> R
  P4c --> R
  R --> R1[Cycle Time Cut 40-60%]
  R --> R2[Discount Variance Halved]
  R --> R3[1-4 Points Gross Margin Recovered]
\`\`\`

## Comparison Matrix: Approval Model Stages vs. Outgrown-Model Symptoms

\`\`\`mermaid
flowchart LR
  subgraph STAGES[Approval Model Stages By Company Scale]
    S1[Stage 1 Founder Approval - Seed To Early A - Under 15 Reps]
    S2[Stage 2 Manager Tier Matrix - Series A B - 15-40 Reps]
    S3[Stage 3 Neutral Deal Desk - Series B C - 40-150 Reps]
    S4[Stage 4 Specialized Deal Desk - Series C Plus - 150 Plus Reps]
    S5[Stage 5 Strategic Deal Desk - Enterprise Scale]
  end
  subgraph HEALTHY[Healthy Benchmarks When Model Matches Stage]
    H1[Cycle Time Under 5% Of Sales Cycle]
    H2[70-85% Deals Self Serve Standard]
    H3[Exception Rate 15-30% To Desk]
    H4[CRO Plus CFO Touch Only 2-5% Of Deals]
    H5[Discount StdDev Tight Within Control Limits]
  end
  subgraph OUTGROWN[Outgrown Model Symptoms - Migration Triggers]
    O1[Cycle Time 10-15% Of Sales Cycle]
    O2[Discount StdDev Over 8-10 Points By Segment]
    O3[Who Approves This Asked 3x Plus Per Week]
    O4[CRO Personally Approving 15-20% Of Deals]
    O5[Finance Finds Post Close Margin Leakage]
  end
  subgraph FIX[Migration Response By Situation]
    F1[Too Early - Lightweight Matrix Only Do Not Over Build]
    F2[Stage Appropriate - Run Full 90 Day 4 Phase Migration]
    F3[No Model Yet PLG - Build Deliberately Phase 2 Is Heaviest]
    F4[Post Acquisition Two Models - Standardize On Mature Model Fast]
  end
  S1 --> H1
  S2 --> H2
  S3 --> H3
  S4 --> H4
  S5 --> H5
  H1 -.model lags stage.-> O1
  H2 -.model lags stage.-> O2
  H3 -.model lags stage.-> O3
  H4 -.model lags stage.-> O4
  H5 -.model lags stage.-> O5
  O1 --> F2
  O2 --> F2
  O3 --> F3
  O4 --> F1
  O5 --> F4
  F1 --> WIN[Model Matches Stage - Repeatable Neutral Accelerative]
  F2 --> WIN
  F3 --> WIN
  F4 --> WIN
\`\`\`

`;

const src = `

## Sources

1. **Salesforce — "What Is a Deal Desk?" RevOps resource** — Foundational definition of the Deal Desk function, scope, and cross-functional role. https://www.salesforce.com
2. **Gong Labs — Sales cycle and deal-momentum research** — Empirical work on how internal latency and stalled deals suppress win rates. https://www.gong.io/labs
3. **Forrester / SiriusDecisions — Revenue Operations and Deal Desk maturity models** — Stage-based maturity framework for approval and deal-governance functions.
4. **Gartner — Sales Operations and CPQ Market research** — Configure-Price-Quote adoption, approval-workflow automation, and RevOps tooling landscape.
5. **OpenView Partners — SaaS Benchmarks Report** — Discounting norms, sales-efficiency, and go-to-market structure benchmarks across SaaS stages.
6. **KeyBanc Capital Markets / Pacific Crest SaaS Survey** — Annual benchmark data on discounting, sales cycle length, and pricing discipline.
7. **Winning by Design — Revenue Architecture frameworks** — Deal structuring, sales-process design, and the role of governance in scaling revenue.
8. **Pavilion (formerly Revenue Collective) — RevOps and Deal Desk operator content** — Practitioner playbooks on standing up Deal Desks and approval matrices.
9. **RevOps Co-op community resources** — Practitioner discussion and templates for approval matrices, standard-deal definitions, and Desk SLAs.
10. **Salesforce CPQ documentation — Approval processes and pricing rules** — Technical reference for encoding approval matrices into the quoting flow. https://help.salesforce.com
11. **DealHub — CPQ and Deal Desk workflow documentation** — Approval-routing, deal-room, and quote-governance tooling reference. https://dealhub.io
12. **Conga CPQ product documentation** — Quote configuration and approval-workflow capability reference.
13. **Subskribe — Quote-to-revenue platform documentation** — Unified CPQ, billing, and revenue tooling relevant to integrated approval enforcement.
14. **DocuSign CLM / Ironclad — Contract Lifecycle Management resources** — Governance of non-standard legal clauses and their integration with deal approval.
15. **CFO.com — Margin leakage and revenue-discipline articles** — Finance-side perspective on post-close concession discovery and margin governance.
16. **Bessemer Venture Partners — State of the Cloud / Cloud 100 analyses** — Go-to-market efficiency and pricing-discipline benchmarks for scaling software companies.
17. **a16z — Go-to-market and pricing strategy essays** — Pricing, packaging, and discounting strategy for venture-scale companies.
18. **Harvard Business Review — "Pricing Discipline" and sales-governance articles** — Academic and practitioner perspective on pricing consistency and discount control.
19. **McKinsey — B2B pricing and "pocket price waterfall" research** — Classic framework on where margin leaks between list price and realized price.
20. **Bain & Company — B2B pricing and discount-governance research** — Discount-variance, price-realization, and sales-governance studies.
21. **SBI (Sales Benchmark Index) — Deal Desk and sales-process benchmarking** — Operator benchmarks on approval cycle time and deal-governance maturity.
22. **The RevOps Show / RevOps podcasts** — Practitioner interviews on Deal Desk staffing ratios, reporting lines, and migration sequencing.
23. **Clari — Forecasting and pipeline-inspection research** — How deal-stage and approval-status signal close timing and forecast accuracy.
24. **Apttus / Conga — "State of the Deal Desk" practitioner surveys** — Survey data on Deal Desk structure, staffing, and reporting lines.
25. **CPQ vendor benchmark reports (Salesforce, DealHub, Conga)** — Cycle-time improvement and approval-automation outcome data.
26. **Maxio (formerly SaaSOptics / Chargify) — SaaS metrics and revenue-operations content** — Billing-terms, ramp-deal, and revenue-recognition implications of deal structure.
27. **Winning by Design — Bowtie model and recurring-revenue architecture** — Framework context for where deal governance sits in the revenue motion.
28. **AICPA / ASC 606 revenue recognition guidance** — Why non-standard terms (ramps, free periods, payment timing) create rev-rec and forecasting complexity.
29. **Sales Hacker / GTMnow — Deal Desk and approval-process operator articles** — Practitioner content on building and running Deal Desks.
30. **Champagne / RevGenius community content** — RevOps-practitioner discussion on Deal Desk neutrality and the speed-vs-discipline mandate.
31. **G2 and TrustRadius — CPQ and RevOps tooling category reviews** — Comparative landscape of Configure-Price-Quote and approval-workflow tools.
32. **ProfitWell / Paddle — Pricing and discounting research** — Empirical data on discount depth, variance, and their effect on retention and margin.
33. **Tableau / Looker — RevOps analytics implementation guides** — Reference for building approval cycle-time, variance, and leakage dashboards.
34. **Carta / SaaS comp-plan benchmarking resources** — Sales-compensation structures, including margin-aware and discount-aware commission design.
35. **The Bridge Group — SaaS sales-org structure and ratio benchmarks** — Headcount-ratio data informing Deal Desk analyst-per-rep staffing.

`;

const num = `

## Numbers

**The Five Hard Leading Indicators — Thresholds**
- Approval cycle time as % of total sales cycle: >10% = structural problem (healthy: <5%)
- Typical outgrown-model approval latency: 8-15% of sales cycle
- On a 45-day cycle, 10% threshold = 4.5 days of pure internal latency
- Discount standard deviation by segment: >8-10 points = model not governing pricing
- "Who approves this?" routing-confusion frequency: >3x/week across org = no legible structure
- CRO / VP Sales personal approval rate: >15-20% of deals = leader is the bottleneck
- Healthy CRO+CFO joint-approval tier: 2-5% of deals only
- Margin leakage: any material post-close concession discovery = wrong approval scope

**Baseline Diagnostics (Phase 1)**
- Closed-deal lookback window for baseline: 6-12 months
- Deals outside reasonable control limits in an outgrown model: typically 25-40%
- Deals outside control limits in a healthy Desk-governed model: 5-12%
- Approval rounds per non-standard deal: typically 2-4

**Standard-Deal Definition and Exception Rate (Phase 2)**
- Target % of deals qualifying as "standard" (zero approval needed): 70-85%
- Below 60% standard-deal rate = definition too narrow or pricing structurally broken
- Healthy exception rate routed to the Desk: 15-30% of deals
- Exception rate <15% = matrix too loose (missing real exceptions)
- Exception rate >30% = matrix too tight (Desk is a bottleneck) or pricing needs re-baselining

**Approval Matrix Tier Structure (Illustrative)**
- Tier 0 (rep self-serve): standard deal, e.g., 0-15% discount, standard terms — no approval
- Tier 1 (manager): modest deviation, e.g., 15-25% discount or slightly extended terms
- Tier 2 (Deal Desk): material non-standard, e.g., 25-40% discount, extended payment terms, ramp structure, one non-standard clause
- Tier 3 (CRO + CFO joint): top tier, e.g., 40%+ discount, MFN/unusual legal risk, strategic precedent — the 2-5%
- Matrix rows required: discount depth, payment terms, contract length, ramp/free-period structure, bundled services, non-standard legal clauses

**Function Staffing and Tooling (Phase 3)**
- Deal Desk staffing ratio: 1 analyst per 25-40 quota-carrying reps
- A 150-rep sales org: roughly a 4-6 person Desk
- First hire profile: senior RevOps / sales-ops background (not finance-first)
- Tooling stack layers: CPQ (enforcement) + CRM (state) + Slack/Teams (workflow) + BI (reporting)

**SLAs and Enforcement (Phase 4)**
- Standard-deal question SLA: <4 business hours
- Complex-deal SLA: <24 hours
- Monthly Desk report metrics: cycle time, discount variance by segment, exception rate, SLA hit rate, win rate by discount tier, margin-leakage trend

**Migration Timeline**
- Phase 1 (Instrument and Baseline): Weeks 1-3
- Phase 2 (Design Policy and Matrix): Weeks 4-6
- Phase 3 (Stand Up Function and Tooling): Weeks 7-10
- Phase 4 (Enforce, Measure, Earn Neutrality): Weeks 11-13+ (ongoing operating state)
- Total to "function standing": ~90 days
- Total to full benchmark outcomes: 2-3 quarters from kickoff

**Outcome Benchmarks (Well-Run Migration, Within 2 Quarters)**
- Approval cycle time: cut 40-60%
- Discount variance (standard deviation by segment): compressed by roughly half
- Blended gross margin: 1-4 points recovered
- Win rate on fast-approved deals: materially higher than pre-migration baseline
- Median approval cycle time post-migration: <5% of total sales cycle
- Annual cost of the Desk vs. margin recovered: typically strongly ROI-positive by end of Q2

**Approval Model Stages by Scale**
- Stage 1 (Founder Approval): seed-early Series A, <~15 reps
- Stage 2 (Manager-Tier Matrix): Series A/B, ~15-40 reps
- Stage 3 (Neutral Deal Desk): Series B/C, ~40-150 reps
- Stage 4 (Specialized Deal Desk): Series C+, 150+ reps
- Stage 5 (Strategic Deal Desk): enterprise scale

**Decision-Framework Trigger Logic**
- Hard-indicator trigger: 2+ red OR 4+ amber across the five indicators
- Soft-signal confirmation: several clustering (attrition friction, quarter-end congestion, slowness in loss reasons, reactive legal/finance)
- Stage sanity-check: roughly Series B/C and ~40+ reps for a full Desk to be stage-appropriate
- Quarterly cadence for the indicator review (catch at amber, not red)

`;

const counter = `

## Counter-Case: When the Conventional "Stand Up a Neutral Deal Desk" Answer Is Wrong

The playbook above is the right answer for most scaling B2B companies most of the time — but a serious operator should stress-test it, because there are real conditions under which standing up a neutral Deal Desk is the wrong move, premature, or actively harmful.

**Counter 1 — You are genuinely too early, and the indicators are not actually flashing.** The most common Deal Desk mistake at small scale is not waiting too long — it is migrating too early because a new RevOps leader pattern-matched to their last, much larger company. At ~$4M ARR and 11 reps, the founder *can* still hold the deal book in their head, cycle time is fine, and the founder touching a high share of deals is *appropriate*, not a symptom. Building a four-tier matrix, a CPQ implementation, and two Desk analysts at that stage creates real cost — headcount, process drag, tooling overhead, slower deals — for a benefit that does not yet exist. If the five hard indicators are green or low-amber, the right answer is a *lightweight* matrix and a clear standard-deal definition, not a function. Migrate when the indicators trip, not when ambition or résumé-pattern-matching says to.

**Counter 2 — Your business is genuinely low-variance and the informal model is repeatable.** Some companies sell a narrow product line, to a homogeneous segment, with little negotiation — flat or near-flat pricing, standard terms, almost no non-standard clauses. If discount variance is naturally tight and approval volume is low *because the deals are genuinely similar*, the informal model may be repeatable enough not because someone is governing it but because the deals do not vary. Standing up a Desk to govern a system that is already repeatable adds overhead with no variance to compress. The test is the *indicators*, not the company's size — a large company with a genuinely simple deal motion may need less governance than a small company with a wildly heterogeneous one.

**Counter 3 — A neutral Desk that becomes a pure gate is worse than no Desk.** This is the playbook's own central warning, but it is worth stating as a counter-case: if you cannot commit to the *acceleration* half of the mandate — published SLAs, a faster "yes," deal-restructuring help — then do not stand up the Desk. A "no" desk that is slow and offers no faster path gets routed around within a quarter, and now you have added headcount, added cynicism, and *still* have hallway approvals. In that specific case, the honest answer is that no Desk plus a clear lightweight matrix beats a badly-run Desk. The migration is only worth doing if leadership will actually fund and defend the speed side.

**Counter 4 — Strategic, category-defining deals genuinely should bypass the matrix.** The playbook says route everything through the Desk — and operationally that is right — but there is a real class of deals where the *economics* of the matrix should not apply: the lighthouse logo that unlocks a segment, the deal that sets a category precedent, the strategic partnership where the "deal" is really a go-to-market bet. For the genuine top 2-5%, the CRO+CFO judgment *should* override the matrix, because the value is strategic and not capturable in discount-and-terms math. The nuance: those deals still route *through* the Desk for logging and de-risking — but anyone who insists the matrix's pricing logic must bind a true strategic deal has misunderstood what the matrix is for. Neutrality does not mean the policy is smarter than leadership on strategy.

**Counter 5 — In a founder-led-sales motion, centralizing approvals too early can sever the founder's market feedback loop.** When the founder is still personally in deals, their involvement is not only an approval bottleneck — it is also their richest source of unfiltered market signal: what customers push back on, where pricing breaks, what competitors are doing. Prematurely routing all deal economics through a Desk can insulate the founder from that signal at exactly the stage when they most need it. The resolution is not "don't migrate" but "sequence it deliberately" — keep the founder *consuming* Desk data and in the strategic tier even as the routine approvals move off their plate. But a migration that treats the founder's deal involvement as pure inefficiency, with no replacement feedback channel, can cost the company more in lost market intelligence than it saves in cycle time.

**Counter 6 — The reporting-line "neutrality" prescription can backfire in a finance-dominated or sales-dominated culture.** The playbook says report into RevOps or Finance, never Sales. But "neutral on the org chart" does not produce "neutral in practice" if the surrounding culture is lopsided. A Desk reporting to a powerful, conservative CFO in a finance-dominated company will *be* a finance instrument no matter what the charter says, and Sales will route around it. In a sales-dominated culture, a RevOps-housed Desk may simply lack the political weight to hold any line. In those cultures, the structural prescription is necessary but not sufficient — the real fix is a leadership-level commitment and sometimes a culture change that the org chart alone cannot deliver. Operators who believe the reporting line *is* the neutrality have missed that neutrality is earned behavior, and in a lopsided culture it may not be earnable without bigger changes.

**Counter 7 — Heavy CPQ-and-tooling implementation can become the project, displacing the actual goal.** The playbook calls for wiring CPQ + CRM + workflow + BI. Done well, that is the enforcement backbone. Done badly — and CPQ implementations are notoriously prone to scope creep — the tooling project consumes two quarters of RevOps and engineering time, and the company ends up with a half-configured CPQ and *still* no functioning approval discipline. For some companies, especially mid-sized ones with a competent ops team, a disciplined, well-designed *spreadsheet-and-workflow* approval process plus a clear matrix delivers 80% of the benefit in a fraction of the time, and CPQ can come later once volume truly justifies it. The counter-case: do not let "stand up the tooling" become a substitute for "stand up the discipline." The discipline is the point; the tooling is leverage on the discipline, and leverage on nothing is nothing.

**The honest verdict.** Standing up a neutral Deal Desk via the 90-day playbook is the right answer when the five hard indicators are genuinely flashing, the company is roughly stage-appropriate, and leadership will fund and defend *both* halves of the mandate — speed and discipline. It is the wrong answer, or premature, when you are genuinely too early, when your deal motion is genuinely low-variance, when leadership will only fund the "gate" half, or when the surrounding culture is so lopsided that org-chart neutrality cannot translate into behavioral neutrality. The discipline is to run the indicator diagnostic honestly rather than reaching for "we need a Deal Desk" because it is the fashionable RevOps answer — and to remember that the goal was never the function, it was repeatability, neutrality, and acceleration, which a lightweight matrix can sometimes deliver without the headcount.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a bookkeeping business in 2027? (Benchmark q-cluster reference for the operator-playbook format.)
- **q9502** — How do you start a CPA firm in 2027? (Adjacent benchmark q-cluster reference.)
- **q9540** — How do you design a discount approval matrix that sales will actually follow? (The matrix-design artifact at the center of Phase 2.)
- **q9541** — What discount governance policy should a Series B SaaS company run? (Discount-policy detail underlying the approval matrix.)
- **q9542** — How do you measure and reduce margin leakage in B2B deals? (Indicator #5 deep dive — post-close concession discovery.)
- **q9543** — What is the right CPQ implementation sequence for a scaling sales org? (Phase 3 tooling deep dive.)
- **q9544** — How do you write Deal Desk SLAs that sales trusts? (Phase 4 SLA detail.)
- **q9545** — How do you define a "standard deal" so most deals need no approval? (Phase 2 standard-deal-definition deep dive.)
- **q9546** — How do you staff and structure a RevOps team at Series B? (Org-design context for where a Deal Desk reports.)
- **q9548** — How do you keep a Deal Desk from becoming a bottleneck? (The Scenario-2 failure mode in depth.)
- **q9549** — What should a Deal Desk report monthly to leadership? (Phase 4 reporting cadence deep dive.)
- **q9550** — How do you run deal approvals in a founder-led sales motion? (Stage 1 / Counter-Case 5 deep dive.)
- **q9551** — How do you design margin-aware sales compensation? (The comp-and-incentive-implications section deep dive.)
- **q9552** — How do you forecast gross margin, not just bookings? (Forecasting-implications deep dive.)
- **q9553** — How do you consolidate two sales orgs after an acquisition? (Scenario 4 — post-acquisition two-model mess.)
- **q9554** — What approval model should a PLG company build when it adds a sales team? (Scenario 3 deep dive.)
- **q9555** — How do you run statistical process control on discount variance? (Indicator #2 methodology deep dive.)
- **q9560** — What is the RevOps tooling stack for a scaling B2B company? (CPQ + CRM + workflow + BI stack context.)
- **q9561** — How do you build a standard price book? (Phase 2 price-book artifact deep dive.)
- **q9570** — How will AI change Deal Desks and deal approvals by 2030? (The 5-year/AI-outlook section deep dive.)
- **q9571** — How do you sequence a comp-plan change alongside an approval-process change? (Comp-and-matrix sequencing deep dive.)
- **q9580** — What are the leading indicators a company has outgrown its sales-ops function? (Sibling "outgrown" diagnostic for sales ops broadly.)
- **q9581** — How do you build a deal-strategy function at enterprise scale? (Stage 4/5 evolution deep dive.)
- **q9590** — How do you run a quarterly RevOps health review? (The quarterly indicator-review cadence in context.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Adjacent GTM-restructuring-under-AI parallel.)

`;

const tags = ['revops','deal-desk','approval-process','discount-governance','sales-operations','pricing','cpq','gtm-strategy','margin','b2b-sales'];

const sources = [
  { title: 'Salesforce — What Is a Deal Desk? (RevOps resource)', url: 'https://www.salesforce.com' },
  { title: 'Gong Labs — Sales cycle and deal-momentum research', url: 'https://www.gong.io/labs' },
  { title: 'McKinsey — B2B pricing and the pocket price waterfall', url: 'https://www.mckinsey.com' }
];

const notes = {
  s6: 'Added 35 cited sources spanning the Deal Desk and RevOps literature: Salesforce/Gong/Gartner/Forrester foundational definitions and research, SaaS benchmark sets (OpenView, KeyBanc/Pacific Crest, Bessemer, Bridge Group), pricing-discipline research (McKinsey pocket price waterfall, Bain, HBR, ProfitWell), CPQ and tooling references (Salesforce CPQ, DealHub, Conga, Subskribe, CLM tools), practitioner communities (Pavilion, RevOps Co-op, RevGenius, Sales Hacker), forecasting (Clari) and rev-rec context (ASC 606, Maxio), and comp-design references (Carta).',
  s7: 'Added comprehensive numbers block: the five hard indicators with exact thresholds (10% cycle-time ratio, 8-10 point discount stddev, 3x/week routing confusion, 15-20% CRO touch rate, post-close leakage), Phase 1 baseline diagnostics (25-40% out-of-control-limit deals in outgrown models), Phase 2 standard-deal and exception-rate targets (70-85% standard, 15-30% exception), the illustrative four-tier approval matrix with all six required rows, Phase 3 staffing ratio (1 analyst per 25-40 reps) and four-layer tooling stack, Phase 4 SLAs (4hr/24hr), the 90-day phase timeline, outcome benchmarks (cycle time cut 40-60%, variance halved, 1-4 margin points recovered), the five approval-model stages by scale, and the decision-framework trigger logic.',
  s8: 'Added 7-element counter-case on when the conventional "stand up a neutral Deal Desk" answer is wrong: migrating too early by pattern-matching to a larger company, genuinely low-variance deal motions where the informal model is already repeatable, the pure-gate Desk being worse than no Desk, strategic category-defining deals that should bypass the matrix economics, founder-led-sales motions where premature centralization severs the founder market-feedback loop, the reporting-line neutrality prescription backfiring in lopsided finance- or sales-dominated cultures, and CPQ tooling implementation displacing the actual discipline goal — plus an honest verdict tying it back to running the indicator diagnostic honestly.',
  s9: 'Cross-linked 24 related Pulse entries: the adjacent q95xx deal-desk/discount-governance cluster (q9540-q9555, q9560-q9561, q9570-q9571, q9580-q9581, q9590) covering the matrix, discount policy, margin leakage, CPQ sequencing, SLAs, standard-deal definition, RevOps staffing, bottleneck-avoidance, reporting cadence, founder-led approvals, margin-aware comp, gross-margin forecasting, post-acquisition consolidation, PLG approval models, SPC on discount variance, the tooling stack, AI outlook, and the sibling outgrown-sales-ops diagnostic — plus benchmark cluster references (q9501/q9502) and the GTM-under-AI parallel (q1899).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite answering the actual q9547 question: the leading indicators a company has outgrown its approval model, plus the migration playbook to a neutral Deal Desk. Two mermaid diagrams (a decision tree from quarterly indicator review through the 4-phase 90-day migration to outcomes, and a comparison matrix mapping approval-model stages against healthy benchmarks, outgrown-model symptoms, and situation-specific migration responses). Full coverage: definition of outgrowing an approval model, the repeatability core principle, all five hard leading indicators with thresholds (cycle time >10% of sales cycle, discount stddev >8-10 points, recurring "who approves this?", CRO touching 15-20% of deals, post-close margin leakage), the secondary soft signals, the precise definition of a neutral Deal Desk and why neutrality is load-bearing, the four-phase migration playbook (instrument/baseline, design policy and matrix, stand up function and tooling, enforce and earn neutrality), benchmarks and real numbers, the four-layer RevOps tooling stack, org design and the politics of neutrality, comp/incentive implications, forecasting implications, five-stage evolution model, five named real-world scenarios (Series B founder-approval hangover, the "no" desk that got routed around, the PLG company adding sales, the post-acquisition two-model mess, the company that migrated too early), a three-layer decision framework for triggering the migration, a 5-year/AI outlook, and a final repeatability-neutrality-acceleration framework.'
};

runPolish({ id: 'q9547', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
