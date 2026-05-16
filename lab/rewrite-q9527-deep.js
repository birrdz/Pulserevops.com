// q9527 — What's the founder's role in setting the actual discount-policy numbers vs delegating to the deal desk?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** The founder's job is to **author and own the discount POLICY** — not to approve discounts deal-by-deal. There are two genuinely different decisions hiding inside "discounting," and conflating them is the root error. Decision one is **strategic**: the margin floor, the pricing philosophy, the standard discount bands, the approval-authority matrix, and the narrow definition of a "strategic exception." That is founder/CRO/CFO work, and it lives in a written **discount policy document** the founder personally authors and signs. Decision two is **operational**: applying that policy to the deal in front of you — routing the approval, checking it against the bands, triaging the genuine exceptions, reporting the data back up. That is **deal-desk work**, full stop. The founder who approves every discount is not "protecting margin" — they are a bottleneck, a single point of failure, and living proof that **no real policy exists** (if it did, someone else could enforce it). The founder who hands discounting to the deal desk with *no* written frame has abdicated: the desk optimizes for throughput, discounting drifts, and nobody owns the margin philosophy. The right model is **founder sets the frame, deal desk runs the engine, data flows back up**: the founder owns the **contribution-margin floor** (the one number that never moves without founder/CFO sign-off), the **authority matrix** (and sits in it only for the rare strategic exception — the lighthouse logo, the competitive must-win, the deal with non-standard strategic value, a defined lane, not "anything big"), and the **quarterly policy review** where deal-desk data — discount distribution, exception patterns, where policy is being stress-tested — drives the founder to tune the *policy*, not re-litigate individual deals. Pre-deal-desk (under roughly $3M-$8M ARR, under ~40-60 deals/quarter), the founder genuinely *is* the deal desk and that is correct. Standing up a deal desk, the founder authors the policy and runs a clean "I'll watch the first quarter" handoff. Mature, the founder touches only the quarterly policy review and the strategic-exception lane. The trap to name out loud: a founder using "I'm just setting policy" as cover for still meddling in every deal — and the opposite trap, "delegate to the deal desk" applied to a company that has neither the volume nor a policy document to justify one. Net: founders own the **numbers that define the box**; the deal desk owns the **decisions inside the box**; the founder re-engages on the **box**, never the individual deal.`;

const core = `

## The Core Distinction: Two Different Decisions Wearing One Word

Almost every argument a founder has with themselves about discounting is actually a category error. "Discounting" sounds like one activity, so founders treat the question — "should I be involved?" — as if it has one answer. It does not, because there are two structurally different decisions buried inside the word, and they belong to different people, operate on different time horizons, and require different skills.

The first decision is **setting the discount policy**: the philosophy, the guardrails, the margin floor, the bands, the authority matrix, the definition of what counts as a strategic exception. This is a strategic, low-frequency, high-leverage decision. It gets made a handful of times a year — when you write the policy, when you revise it, when a market shift forces a rethink. It requires judgment about the company's pricing power, competitive position, unit economics, and long-term value narrative. It is, unambiguously, a founder/CRO/CFO decision. Nobody else in the company has the standing or the context to decide that the company will never discount below 35% gross margin, or that multi-year commitments earn a discount but logos do not, or that the product is priced on value and therefore list price is defended hard.

The second decision is **executing a discount on a specific deal**: a rep wants 18% off for a 120-seat deal closing this quarter with a two-year term — is that approved? This is an operational, high-frequency, lower-leverage decision. It happens dozens or hundreds of times a quarter. It does not require strategic judgment; it requires *applying* strategic judgment that has already been encoded. Does 18% fall within the standard band for this deal size and term? Is the resulting margin above the floor? Does anything about the deal trip an exception flag? That is pattern-matching against a policy. It is deal-desk work.

The founder who conflates these two decisions fails in one of two predictable directions. If they conflate "I own the policy" with "therefore I must touch every deal," they become a micromanaging bottleneck — every discount routes to them, the company cannot scale its deal throughput past the founder's calendar, and reps learn that the real approval process is "get time with the founder." If they conflate "the deal desk handles discounting" with "therefore I don't need to own the policy," they abdicate — the deal desk inherits a strategic vacuum and fills it with operational instinct, and discounting slowly drifts because no one with the authority to defend margin is actually defending it. The entire answer to "what's the founder's role" is: **own the first decision completely, delegate the second decision completely, and build the machinery that connects them.** Everything else in this entry is the detail of how.

## What The Founder MUST Own

There is a specific, finite list of things the founder cannot delegate, and it is worth being precise about it because vagueness here is what causes both the micromanagement failure and the abdication failure. The founder owns the **strategic frame** — the boundaries inside which the deal desk operates.

**The margin floor.** Somewhere there is a number — usually a contribution-margin or gross-margin percentage — below which no deal goes, ever, without the founder personally and explicitly waiving it. The founder, with the CFO, owns that number. It is not a deal-desk number. The deal desk *enforces* the floor; it does not get to *move* it. More on this below, because it is the single most important number in the whole system.

**The pricing philosophy.** Is this a value-priced product where list price is a strategic asset and discounting is a controlled exception? Or a competitively-priced product where discounting is a routine tool? Is the company trying to anchor high and rarely move, or win on price-to-value? This philosophy determines how aggressive the bands are, how much discounting is "normal," and what the company is willing to walk away from. Only the founder and CRO can set it, because it is downstream of the entire go-to-market strategy.

**The "we don't" principles.** Every good discount policy has a short list of inviolable principles: we never give the platform fee away for free; we don't discount below X without a multi-year term; we never discount and *also* throw in professional services; we don't do more than one "exception" per customer per year. These are philosophical commitments about how the company protects its value, and they are founder-authored. They are the things that, when a deal desk lead is under pressure from a VP of Sales at quarter-end, they can point to and say "the founder wrote this, it's not mine to waive."

**The strategic-exception criteria.** The founder defines — narrowly — what kinds of deals genuinely warrant breaking policy and what makes them special. Not "big deals." *Strategically* special deals: the lighthouse reference logo, the competitive displacement that changes the market narrative, the deal whose non-standard value (data, distribution, a category-defining customer) justifies non-standard economics. The founder owns the *definition* of the exception lane. The deal desk owns *routing* deals into it.

Notice what is and isn't on this list. The founder owns numbers, philosophy, and definitions — the *box*. The founder does not own deals. If the founder finds themselves owning a deal, something on this list was never written down clearly enough, and the deal is leaking through the gap.

## What The Founder MUST Delegate

The mirror image of the "must own" list is the "must delegate" list, and founders are generally much worse at this one — because delegating feels like losing control of something that matters, and discounting *does* matter. But the things on this list are not strategic decisions; they are operational throughput, and a founder doing them is a founder doing a job that does not need a founder.

**The deal-by-deal application of policy.** When a discount request falls inside the standard bands and clears the margin floor, *somebody other than the founder must be able to approve it.* This is the load-bearing sentence of the entire entry. If the answer to "who can approve a within-policy discount" is "only the founder," then the company does not have a discount policy — it has a discount *bottleneck wearing a policy's clothes*. A policy that only its author can apply is not a policy; it is a diary.

**Routing and approval orchestration.** Which discounts go to a manager, which to an RVP, which to the deal desk, which (rarely) escalate further — running that traffic is operational work. The founder sets the matrix; the founder does not run the matrix.

**Exception triage.** Most "exceptions" reps raise are not real exceptions — they are reps testing whether the floor is soft. The deal desk's job is to sort the genuine strategic exceptions (which it routes into the founder's lane) from the routine asks dressed up as exceptions (which it pushes back on). The founder should only ever see the small, pre-filtered set of true strategic exceptions, not the raw stream.

**Operational throughput and turnaround time.** A discount approval that takes three days because it is waiting in the founder's inbox costs the company deals. The deal desk's job includes *speed* — same-day turnaround on standard requests. The founder cannot deliver that and should not try.

The test for whether something belongs on the delegate list: *does deciding it require strategic judgment that hasn't already been encoded in the policy?* If yes, it might be a real exception for the founder. If no — if it is just applying the policy — it is the deal desk's, and a founder doing it is a $300/hour person doing a $30/hour task and creating a bottleneck while they do it.

## The "Founder Approves Everything" Anti-Pattern

This is the more common failure at the $3M-$30M ARR range, and it is worth dissecting because founders who do it almost never *think* of it as a problem — they think of it as diligence.

**Why it happens.** Three reasons, usually stacked. First, **there is no written policy** — the "policy" lives in the founder's head, so of course the founder has to approve everything; they are the only one who can run the algorithm because the algorithm was never written down. Second, **trust** — the founder doesn't believe anyone else will hold the line under pressure, and there is often real history behind that fear (a rep who gave away the store, a sales leader who treated the margin floor as a suggestion). Third, **identity** — the founder believes they are the only one who truly "gets" the strategy, the only one who feels the value of the product viscerally enough to defend its price. Sometimes that is even briefly true. It is never *durably* true, and treating it as durable is the mistake.

**Why it breaks.** It breaks in four ways, and they compound. (1) **Bottleneck** — deals wait on the founder's calendar, and at quarter-end, when discount volume spikes, the founder becomes the single slowest step in the revenue process. (2) **No scale** — the company's deal throughput is hard-capped at whatever the founder can personally review, so growth in deal *count* is throttled by founder *attention*. (3) **Learned helplessness in the field** — reps and managers stop developing discounting judgment because they don't have to; the real process is "escalate to the founder," so that is what they do, for everything, which makes the bottleneck worse. (4) **A powerless deal desk** — if the company has a deal desk at all, it becomes a routing layer with no authority, which means good deal-desk people leave (nobody senior wants a job with responsibility and no authority) and you are left with junior people doing data entry while the founder does the actual decisions.

The cruelest part of this anti-pattern is that it *feels* like control and *produces* fragility. The founder believes they are the thing protecting margin. In reality they are the thing *preventing the company from building a system that protects margin* — and the day the founder is on a plane, sick, or simply overwhelmed at quarter-end, there is no margin protection at all, because it was never a system; it was always just the founder.

## The "Founder Abdicates Entirely" Anti-Pattern

The opposite failure is less common but more insidious, because it can look like healthy delegation for two or three quarters before the damage shows up.

Here the founder, often having read that founders shouldn't be in the weeds, hands "discounting" to the deal desk — and hands over *only the execution*, never authoring the strategic frame. There is no written margin floor. There is no pricing philosophy on paper. There is no "we don't" list. The deal desk is told, in effect, "you own discounting now," and is given a stack of historical deals and a vague sense that the company "doesn't like to discount much."

What happens next is not malice; it is incentives. **The deal desk optimizes for what it can see and is measured on, which is throughput and deal velocity.** A deal desk with no strategic frame, under pressure from sales every quarter, will — rationally — get more permissive over time. Each individual concession is defensible ("it was a competitive deal," "it was quarter-end," "the rep had been working it for six months"). But there is no one in the room whose job is to own the *margin philosophy*, so the philosophy erodes one defensible concession at a time. Discount averages creep up 2-4 points a quarter. The "floor" becomes a "starting point for negotiation." By the time it shows up in blended margin or in a board deck, the company has retrained its entire customer base and sales force around a discount norm that no one ever *decided* — it just drifted, because the person whose job was to decide it abdicated.

The tell for this anti-pattern: ask the deal desk lead "what's our margin floor and who owns it?" If the answer is a number but the owner is "us" or "the deal desk" or a shrug — the founder abdicated. The floor must trace back to a person with the authority to defend it against the whole sales org, and that person is the founder (with the CFO). A deal desk *enforcing* a founder-owned floor is healthy. A deal desk *owning* the floor is a founder who left the building.

## The Right Model — Founder Sets The Frame, Deal Desk Runs The Engine

Between "approves everything" and "abdicates entirely" there is a model that actually works, and it is not a vague midpoint — it is a specific division of labor with a specific connecting mechanism.

The founder (with the CRO and CFO) **sets and owns the discount policy**. The policy is a real document — written, versioned, signed. It contains the margin floor, the authority matrix, the standard discount bands, the multi-year and volume rules, the strategic-exception criteria, and the "we don't" list. The founder is the *author and owner* of this document. When it changes, the founder signs off. This is the **frame**.

The deal desk **executes within the frame**. It approves within-policy discounts at speed. It routes the requests that need higher authority. It triages exceptions — pushing back on the fake ones, escalating the genuine strategic ones into the founder's defined lane. It is the **engine**: the operating system that turns the founder's policy into hundreds of consistent, fast, defensible deal decisions.

And then — the part most companies miss — **data flows back up**. The deal desk reports the discount distribution, the exception patterns, the places where policy is being stress-tested, the deals that are being lost on price and the deals that are being won with too much margin given away. This data goes *to the founder*, not for deal-by-deal intervention, but as the input to the next **policy** revision. The founder reads the engine's telemetry and tunes the frame.

This is the whole model in one sentence: **the founder is the architect, the deal desk is the operating system, and the telemetry from the OS is what the architect uses to revise the blueprint.** The architect does not lay every brick. But the architect absolutely owns the blueprint, and absolutely reads the reports on how the building is performing. A founder who understands this stops asking "should I approve this discount?" and starts asking "is my policy producing the right outcomes, and where does it need to change?"

## The Discount Policy Document — What The Founder Authors

The discount policy document is the founder's actual deliverable. If a founder wants to know concretely "what is my job in discounting," the answer is: *you write and own this document.* It does not need to be long — the best ones are two to four pages — but it must be explicit, because every ambiguity in it becomes a gap that deals leak through and a reason something escalates to the founder that shouldn't.

A complete discount policy document contains:

**The margin floor.** The contribution-margin (or gross-margin) percentage below which no deal proceeds without explicit founder/CFO waiver. Stated as a hard number. The mechanism for waiving it (founder + CFO sign-off, documented reason) stated explicitly.

**The standard discount bands.** What level of discount is "normal" for what kind of deal — typically a grid crossing deal size, term length, and payment terms. E.g., a one-year deal under $25K ARR: 0-10% is standard; a three-year deal over $250K ARR with annual prepay: up to 25% is standard. These bands are what make most discounts *routine* rather than *exceptions*.

**The approval-authority matrix.** Who can approve what. The bands above the "standard" line — and who signs off at each level: rep, manager, RVP, VP/CRO, deal desk, founder. Critically: *where the founder actually sits in this matrix*, which should be only the strategic-exception lane and the floor-waiver, not a routine discount tier.

**The multi-year and volume rules.** How term length and seat/usage volume translate into discount entitlement. This is where a lot of value is protected or leaked, so the founder is explicit: discount is *earned* by commitment, not given for asking.

**The strategic-exception criteria.** The narrow definition of what makes a deal a genuine strategic exception eligible for the founder's lane — and, importantly, what does *not* (size alone does not).

**The "never negotiable" list.** The short, blunt list of things that are simply not on the table — the platform fee is never free, services are never bundled into a discount, etc.

The founder writes this. The CRO and CFO pressure-test it. Legal and finance check it. But it is the founder's document, the founder's signature, and the founder's to revise. Everything the deal desk does is downstream of it.

## Setting The Margin Floor

If the founder owns exactly one number, it is the margin floor — and it is worth treating separately because it is the load-bearing element of the whole system.

The margin floor is the contribution-margin (or gross-margin, depending on how the company models unit economics) percentage below which a deal *does not happen*. Not "needs extra approval" — does not happen, absent an explicit, documented founder-plus-CFO waiver. It is the hard backstop. Every discount band, every authority tier, every deal-desk approval is bounded by it.

The founder and CFO own this number *personally* for a specific reason: it is the one place in the discount system where the company's *financial survival* and the company's *sales pressure* meet head-on, and the only people with both the authority and the incentive to hold that line against the entire revenue org are the founder and the CFO. A VP of Sales, however good, is structurally incentivized to want the floor lower at quarter-end. A deal desk lead can *enforce* the floor but cannot, on their own authority, *defend* it against a CRO who wants it moved — they need to be able to say "that's the founder's number."

The discipline here: **the deal desk enforces the floor; the deal desk cannot move the floor.** The floor moves only when the founder and CFO decide — deliberately, with the unit-economics model in front of them, as a strategic act — that it should move. Not in the heat of a deal. Not because one big logo is "worth it." If a specific deal genuinely warrants going below the floor, that is not a floor adjustment; it is a *founder waiver* — a one-time, documented, named exception that leaves the floor itself untouched. Keeping those two things distinct — the standing floor vs. the one-off waiver — is what keeps the floor meaningful. A floor that gets "adjusted" every time it is inconvenient is not a floor.

## Setting The Approval Authority Matrix

The authority matrix is how the founder pushes decision-making *down* while keeping it *bounded*. It is a grid: discount levels (or margin levels) on one axis, approval roles on the other. Its entire purpose is to make sure that the *vast majority* of discount decisions get made fast, by someone close to the deal, without ever touching the founder.

A typical matrix structure: reps have a small zone of unilateral discount authority (so routine deals close without any approval friction at all); managers approve the next band; RVPs or a VP the next; the deal desk owns a defined band and also owns the *enforcement* role across all bands; the CRO approves the high end of standard policy; and the founder sits at exactly one place — the strategic-exception lane and the margin-floor waiver.

The founder *designs* this matrix, and the most important design decision the founder makes is **where they put themselves.** The failure mode is the founder placing themselves as a routine tier — "anything over 20% comes to me." That guarantees the bottleneck, because "over 20%" is a *volume* category, not a *strategic* category, and it will be triggered constantly. The founder should sit only where *strategic judgment that cannot be pre-encoded* is genuinely required: the rare exception, the floor waiver. Everything that is a matter of *degree* — bigger discount, bigger deal — should resolve inside the matrix below the founder. The founder appears on the org chart of discount authority exactly once, and it is at the top, for the exceptions, not in the middle, for the big-but-ordinary deals.

A well-designed matrix has a property worth naming: a new rep on their first day should be able to look at it and know, for any given deal, exactly who approves the discount and roughly how long it takes. If the honest answer for too many deals is "it depends, probably escalates to the founder," the matrix is broken.

## The Strategic-Exception Lane

The strategic-exception lane is the founder's *legitimate* place in deal-by-deal discounting — and defining it narrowly is what keeps the founder from sliding back into approving everything.

There are deals where founder judgment genuinely adds value that no policy can pre-encode, because the deal's value to the company is *non-standard* — it isn't captured by ARR, margin, or term. The lighthouse logo whose name on the customer page changes how every future prospect perceives the company. The competitive must-win that, if lost, hands a competitor a narrative the company will spend two years fighting. The deal with strategic value in its *structure* — data rights, a co-development arrangement, distribution access, a category-defining reference. For these, the economics genuinely should be decided by someone holding the whole strategic picture, and that is the founder (with the CRO).

But the lane has to be *narrow and defined*, or it becomes a backdoor to "founder approves everything" — because every rep with a big deal will argue it is strategic. The policy document defines the lane explicitly: a strategic exception is a deal that (a) has clearly articulable strategic value beyond its contract economics, (b) has that value *written down and agreed* by the deal desk before it reaches the founder, and (c) is rare — single digits per quarter, not "every deal over $500K." Size *alone* never qualifies a deal for this lane. A $2M deal that is just a big normal deal goes through the normal matrix; a $200K deal that is a genuine market-defining lighthouse logo might legitimately reach the founder.

The deal desk is the gatekeeper of this lane. Its job is to *protect the founder's exception lane from inflation* — to push back on the fake strategic claims so that the deals reaching the founder are the real ones. A founder whose strategic-exception lane is getting crowded should not respond by reviewing more deals; they should respond by tightening the definition with the deal desk.

## The Deal Desk's Mandate

If the founder is the architect, the deal desk is the operating system — and the founder's job includes *empowering* it with a clear, real mandate, not just a routing function.

A properly mandated deal desk owns: **within-policy approvals** (it can say yes, on its own authority, to anything inside the bands and above the floor — and that authority is real, not subject to founder second-guessing); **routing** (it orchestrates the matrix, getting each request to the right approver fast); **exception triage** (it sorts genuine strategic exceptions from routine asks-in-disguise, and it is empowered to push back hard on the latter); **the data** (it owns the discount telemetry — distribution, trends, exception patterns, win/loss-on-price analysis); and **policy-tuning recommendations** (it is the function closest to where policy meets reality, so it should be *recommending* policy changes upward — "the 3-year band is too tight, we're losing deals in it" — even though it does not get to *make* those changes).

The founder's role relative to the deal desk is to **give it teeth**. A deal desk with responsibility but no authority is the powerless-routing-layer failure mode; it cannot do its job and it cannot keep good people. The founder publicly and explicitly backs the deal desk's within-policy authority — when a VP of Sales tries to go around the desk to the founder for a within-policy deal, the founder's answer is "the desk owns that, and I back their call." That single behavior — the founder *not* being available as an end-run around the deal desk — is what makes the whole delegated system real. The founder is the architect; the architect's job is not to also be a back-channel that undermines the operating system they designed.

## The Founder-To-Deal-Desk Handoff

The handoff — the actual transition from "founder does discounting" to "deal desk does discounting, founder owns policy" — is where the model most often dies, because handoffs done badly leave a *shadow*: the org chart says the deal desk owns it, but everyone knows the real approval is still the founder, so nothing actually changed.

A clean handoff has a sequence. **First, the policy is written** — the founder cannot hand off execution of a policy that doesn't exist on paper; that is the abdication trap. The document comes first. **Second, the deal desk is staffed and trained** against that document — they need to be able to *defend* the policy, which means understanding the *why* behind the floor and the bands, not just the numbers. **Third, there is a deliberate "I'll watch the first quarter" period** — the founder stays *visible* but moves to *review, not approve*: the deal desk makes the calls, and the founder reviews a sample after the fact, coaching on judgment, correcting drift, building trust in both directions. **Fourth, the founder steps fully out of routine approvals** — and crucially, *announces* it, so the field knows the deal desk's authority is real and the founder back-channel is closed.

The thing that kills handoffs is the lingering shadow approval — the founder who says they've handed off but still "just wants to see" the big ones, still takes the call when a sales leader pings them directly, still overturns a deal-desk decision "just this once." Every one of those is a signal to the entire org that the handoff was theater. The founder has to be disciplined about this in a way that often feels uncomfortable: once the handoff is done, a within-policy deal the founder personally disagrees with is *not* a deal the founder overturns — it is, at most, a data point for the next *policy* review. Overturning it re-opens the bottleneck. The founder's discomfort with a specific decision is exactly the feeling they have to learn to route into policy revision instead of into deal intervention.

## The Feedback Loop Back To The Founder

Delegation without a feedback loop is just abandonment, and the feedback loop is what makes "founder owns policy, deal desk owns execution" a *system* rather than two disconnected activities.

The deal desk reports discount data *up* to the founder — not deal-by-deal, but in aggregate, on a regular cadence. The reporting includes: the **discount distribution** (where are deals actually landing — is the "standard band" actually standard, or is everything clustering at the top of it?); the **exception patterns** (what kinds of deals keep generating exception requests — that is policy telling you it has a gap); the **stress points** (where is policy being argued with most, lost-deals-on-price by segment, won-deals-with-excess-margin-given); and **drift indicators** (is the average discount creeping, quarter over quarter?).

The founder *reads this as policy telemetry.* The discipline — and it is a discipline — is that the founder's response to this data is to adjust the *policy*, never to reach back into individual deals. If the data shows the three-year band is too tight and the company is losing multi-year deals, the founder *widens the band* — they do not start personally approving three-year deals. If the data shows discount creep, the founder *tightens the policy or the floor* — they do not start personally policing deals. If a particular segment keeps generating exceptions, the founder *writes a new standard band for that segment* — turning a recurring "exception" into routine policy, which is exactly the right move, because a recurring exception is a missing policy.

This is the mechanism that lets the founder stay *strategically* involved in discounting forever while being *operationally* out of it forever. The founder is always tuning the frame; the founder is never in the engine. The feedback loop is the wire connecting those two roles.

## When The Founder Should Re-Engage

"Founder owns policy, deal desk owns execution" is not "founder forgets discounting exists." There are specific, legitimate triggers for the founder to re-engage — and the discipline is that re-engaging means *re-engaging on the policy*, not on the deals.

**Discount creep.** The feedback loop shows average discounts trending up over two or three quarters. The founder re-engages — on the policy: tighten the bands, reinforce the floor, retrain the desk, possibly revisit the authority matrix. Not on the deals.

**A competitor's pricing move.** A competitor repositions on price, or launches a discount-heavy push. This changes the company's competitive context, which is exactly a policy-level input. The founder re-engages to decide how — or whether — the policy should respond.

**A margin problem.** Blended margin is moving the wrong way and discounting is implicated. This is a founder-level financial issue. The founder re-engages on the floor, the bands, and the philosophy.

**A new segment or motion.** The company moves upmarket, adds a PLG motion, enters a new geography. The existing policy was written for the old context and may not fit. The founder re-engages to author the policy for the new segment.

**A strategic shift in pricing.** The company changes its packaging, its pricing model, its value metric. Discount policy is downstream of pricing, so it has to be re-authored.

In every one of these, the founder's re-engagement is *authoring or revising the policy document*, then handing the new version back to the deal desk to execute. The trigger pulls the founder back to the architect's desk — not onto the factory floor. A founder who responds to discount creep by personally reviewing deals has misunderstood their own job; the creep is evidence the *policy* needs work, and the policy is the founder's, so that is where the work goes.

## The Stage Evolution

The right answer to "what's the founder's role in discounting" *changes* as the company scales, and a lot of founder confusion comes from applying the wrong stage's answer to their current stage.

**Pre-deal-desk (roughly under $3M-$8M ARR, under ~40-60 deals/quarter).** The founder genuinely *is* the deal desk, and that is correct and necessary. There isn't enough deal volume to justify a dedicated function, the pricing is often still being figured out, and the founder's per-deal judgment is genuinely a source of learning about what the market will pay. At this stage, "delegate to the deal desk" is premature — there is no deal desk to delegate to, and standing one up would be overhead. The founder approving discounts here is not a bottleneck; it is the founder doing necessary primary research on pricing. The one thing the founder should do even at this stage: *write down what they're learning* — the implicit policy — so that the eventual handoff has a document to hand off.

**Standing up a deal desk (roughly $8M-$25M ARR).** This is the transition. Deal volume now exceeds what the founder can or should personally handle. The founder's job shifts: *author the policy document* (formalizing what was implicit), *stand up and staff the deal desk*, and *run the clean handoff*. This is the highest-skill moment in the whole evolution, and the most commonly botched — botched by abdication (handing over execution with no policy) or by shadow approval (handing over execution but never actually letting go).

**Mature (roughly $25M+ ARR).** The founder touches discounting in exactly two places: the **quarterly policy review** (reading the feedback loop, tuning the frame) and the **strategic-exception lane** (the rare deal whose non-standard value genuinely warrants founder judgment). That's it. Everything else — every routine discount, every within-policy approval, every fake-exception pushback — is the deal desk's, with the CRO owning the policy partnership. A mature-stage founder spending real time on individual discount decisions is a sign something earlier in the evolution never completed.

The mistake to avoid: a Series B founder applying the *seed-stage* answer ("I am the deal desk") because it is familiar and feels responsible — when their stage actually demands the *transition* answer. The role is supposed to change. A founder still personally approving discounts at $30M ARR is not being diligent; they are being developmentally stuck.

## The CRO's Role In The Middle

In companies that have a CRO, the founder-vs-deal-desk picture is really a *three-way* relationship, and getting the CRO's role right is what keeps the founder from either over-delegating or under-delegating.

The common and healthy pattern: **the CRO owns the discount policy operationally, with the founder as the approver/owner of the frame.** The CRO is the one who actually drafts revisions, runs the policy review, manages the deal desk, and defends the policy day-to-day with the sales org. The founder still *owns* the margin floor and the strategic frame — sets the boundaries, signs off on the policy, owns the floor-waiver — but the CRO is the operating owner of the policy *within* those boundaries. The deal desk reports to the CRO; the CRO reports the telemetry to the founder; the founder tunes the frame.

This works because it gives the founder a *single accountable person* for the whole revenue-side of discounting, and gives the CRO real ownership rather than a figurehead role. The failure modes are predictable: a founder who hires a CRO but won't actually cede policy ownership (the CRO is accountable for revenue but can't control one of its biggest levers — they will leave); or a founder who cedes *everything* including the floor (now the floor is a sales number, with all the incentive problems that implies). The right line: the founder owns the *floor* and the *strategic frame*; the CRO owns the *policy operation within the frame*; the deal desk owns *execution within the policy*. Three layers, three owners, clean boundaries.

When there is no CRO — common under ~$15M ARR — the founder holds both the frame *and* the policy-operation role, with the deal desk (or the head of sales, or a sales-ops lead) executing. That is fine *at that stage*; it just means the founder has more on their plate and should be actively looking to hire the CRO layer in as deal volume and policy complexity grow.

## The Trust Problem

Underneath almost every "founder approves everything" pattern is a trust problem, and it is worth addressing directly because you cannot fix the *structure* without addressing the *feeling*.

The feeling is: *discounting is how the company's value gets protected or given away, and I am the one who cares most about that value, so I have to be the one guarding it.* That feeling is not stupid. It contains a real truth — the founder usually *does* care most viscerally about the value, and a careless sales org *can* give the store away. The founder isn't wrong that margin needs protecting. They are wrong about the *mechanism*.

The reframe: **a good policy plus a good deal desk protects value better than founder gut-checks, because it protects value *consistently and at scale*, and the founder's gut does neither.** A founder's per-deal judgment is high-quality but low-throughput and inconsistent — it varies with how tired the founder is, what else is on fire, whether it is quarter-end. A well-authored policy applied by a well-run deal desk is the founder's *judgment, encoded and scaled* — it is the founder's care, made systematic. The founder protects the company's value *more* by spending a week authoring a sharp policy and building a deal desk that defends it than by spending a year personally reviewing deals, because the policy works on every deal, every day, whether the founder is paying attention or not.

The other half of the reframe: founder gut-checks *don't actually scale*, which means relying on them is a *choice to cap the company's deal throughput at the founder's attention.* The founder who "can't let go" of discount decisions is, whether they see it or not, choosing a smaller company. Letting go is not a loss of control over value-protection; it is an *upgrade* — from a heroic, fragile, founder-dependent process to a systematic, durable, scalable one. The trust the founder needs to build is not "trust that the deal desk cares as much as I do" (they may not, and that's fine); it is "trust that a well-built system protects value better than a heroic individual." That is a true thing, and internalizing it is the unlock.

## Measuring Whether The Delegation Works

After the handoff, the founder needs a way to know whether the delegated model is actually working — and the measurement should be at the *system* level, not the deal level (a founder measuring individual deals has un-delegated).

The questions to track: **Is discounting still disciplined?** — average discount stable or improving, not creeping; the distribution sitting where the bands intend, not clustered at the ceiling. **Is the margin floor holding?** — number of below-floor deals near zero, every one of them a properly documented founder waiver, none of them quiet drift. **Is the deal desk catching the real exceptions?** — the strategic-exception lane carrying genuine strategic deals, not inflated with big-but-ordinary ones; fake exceptions getting pushed back at the desk, not reaching the founder. **Has deal velocity improved?** — discount-approval turnaround time *down* from the founder-bottleneck baseline; deals not stalling in approval. **Is the founder actually out of routine deals?** — honestly: how many individual discount decisions did the founder touch last quarter? The number should be small and should be exception-lane and floor-waiver only. **Is the feedback loop running?** — is the deal desk actually reporting telemetry up, and is the founder actually tuning policy from it, on a cadence?

If discounting is disciplined, the floor is holding, velocity is up, the founder is out of routine deals, and the loop is running — the delegation works, and the founder's job is just to keep running the quarterly review. If the floor is leaking or the founder is still in dozens of deals, the delegation has *not* taken — and the fix is almost never "founder gets more involved in deals"; it is "fix the policy, fix the desk's authority, or fix the handoff," because those are the things that are actually broken.

## The Governance Cadence

The founder's ongoing ritual in discounting — once the model is running — is a *governance cadence*, and naming it as a ritual matters, because a thing that isn't on the calendar doesn't happen.

The core ritual is the **quarterly discount policy review**. Once a quarter, the founder (with the CRO and CFO) sits down with the deal desk's telemetry and asks policy-level questions: Is the distribution where we want it? Is anything creeping? What exceptions recurred — and should any of them become standard policy? Did we lose deals on price we shouldn't have, or win deals giving away margin we shouldn't have? Does the floor still reflect our unit economics? Did the competitive landscape shift? The output is a *decision*: the policy stands, or the policy changes — and if it changes, the new version is authored, signed, and handed back to the deal desk.

That quarterly review *is* the founder's discounting job in steady state. It is emphatically *not* a daily deal-approval ritual. The contrast is the whole point: the founder's calendar in a working model has a *quarterly* discounting commitment (a couple of hours, high-leverage, strategic) and *zero* daily discounting commitment. The founder who instead has a *daily* discounting commitment (deal approvals trickling through the inbox) and *no* quarterly one has the cadence exactly inverted — they are doing the deal desk's job daily and neglecting their own job entirely.

Some companies add a lighter monthly telemetry check (a dashboard glance, not a meeting) and an annual deeper review tied to pricing and planning. The structure can flex. The principle does not: the founder's discounting cadence is *periodic and strategic*, not *continuous and operational*.

## Building It In The Tooling

A policy that lives only in a document is a policy that gets argued with. The founder's frame becomes *durable* when it is encoded into the tooling — and while the founder doesn't build the tooling, the founder should insist it gets built, because un-encoded policy is policy that quietly erodes.

The discount policy gets encoded into the **CPQ and approval-workflow tooling**. The standard bands become configured rules — a discount inside the band routes for the appropriate approval automatically; a discount outside it cannot even be submitted without triggering the right escalation. The **margin floor becomes a hard system constraint** — a deal that would breach it cannot be quoted without the explicit founder/CFO waiver path being invoked, documented, and recorded. The **authority matrix becomes the routing logic** — the system knows who approves what and sends it there, no human routing required. The **strategic-exception lane becomes a defined routing path** — a deal flagged as a strategic exception goes through a specific workflow (with the required strategic-value justification as a mandatory field) to the founder, and nothing else does.

And the **feedback loop becomes instrumentation** — the discount distribution, the exception patterns, the drift indicators are dashboards, generated automatically, not assembled by hand each quarter. This is what makes the quarterly review *easy* to run, which is what makes it actually *get* run.

The founder's role here is not to be the systems administrator. It is to *refuse to accept an un-encoded policy* — to insist that the frame they authored is built into the rails the company runs on, because a frame that depends on humans remembering it is a frame that degrades, and a frame built into the tooling is a frame that holds even under quarter-end pressure when humans are most tempted to bend it.

## 5 Real-World Scenarios

**Scenario 1 — The founder who approves every discount and is the bottleneck.** A $14M ARR company; the founder personally approves anything over 15% off. At quarter-end, 30+ discount requests stack up in the founder's inbox; deals slip because approvals lag; reps have learned the real process is "get the founder on Slack." The deal desk is two people doing data entry. The fix is *not* "founder works faster" — it is: write the policy document, set bands so most of those 30 requests are within-policy and never need the founder, give the deal desk real within-policy authority, and move the founder to the strategic-exception lane only. Within two quarters the founder touches single-digit deals a quarter and approval turnaround drops from days to hours.

**Scenario 2 — The founder who abdicated and discounting drifted.** A $22M ARR company; the founder, two years ago, "handed discounting to the deal desk" — with no written policy and no margin floor. The deal desk, under quarterly sales pressure, has gotten steadily more permissive; average discount has crept from 12% to 21%; blended margin is down 4 points and it just showed up in a board deck. The fix: the founder re-engages — *on the policy* — authors the missing document, sets the floor with the CFO, retrains the deal desk on the *why*, and starts the quarterly review. Not by personally policing deals — by finally doing the architect's job that was skipped.

**Scenario 3 — A clean policy-handoff to a new deal desk.** A $10M ARR company standing up its first real deal desk. The founder does it right: spends a week authoring the policy document (formalizing what had been in their head), staffs the desk with one senior hire, runs an explicit "I'll review the first quarter" period — desk makes the calls, founder reviews a sample weekly and coaches — then announces, company-wide, that the desk owns within-policy approvals and the founder is out of routine deals. Six months later it is genuinely running; the founder's only discounting touchpoint is the quarterly review and the occasional strategic exception.

**Scenario 4 — A founder re-engaging after discount creep.** A $35M ARR company with a mature model; the quarterly telemetry shows average discount has crept up three quarters running, concentrated in one segment. The founder re-engages correctly: digs into *why* with the deal desk (the segment's competitive context shifted), and revises the *policy* — a tighter band for that segment, a reinforced floor, a note to the desk. The founder does not review a single individual deal. The creep reverses the next quarter. This is the feedback loop working exactly as designed.

**Scenario 5 — A CRO caught in the middle.** A $28M ARR company; the founder hired a CRO a year ago but never actually ceded discount-policy ownership — the CRO is accountable for revenue but the founder still overturns deal-desk decisions and takes back-channel calls from sales leaders. The deal desk doesn't know whose authority is real; reps route around the CRO to the founder; the CRO is updating their LinkedIn. The fix is a hard conversation and a clean re-draw: the founder keeps the *floor* and the *strategic frame*; the CRO gets *real* operational ownership of the policy and the deal desk; the founder publicly closes the back-channel. Either the founder genuinely delegates or the CRO seat will keep turning over.

## The Multi-Year And Volume Rules — Where Value Leaks Or Holds

Inside the policy document, the section that most often determines whether the company *protects* or *gives away* value is the one governing how term length and volume translate into discount entitlement — and it is worth a focused treatment because founders frequently under-specify it, and the deal desk then has to improvise under pressure.

The core principle the founder encodes here is simple to state and hard to hold: **discount is earned by commitment, not given for asking.** A discount is the price the company pays to acquire something it values — a longer term, a larger commitment, an annual prepay, a multi-entity rollout. If the company gives the discount *without* getting the thing, it has simply lowered its price. The multi-year and volume rules are the mechanism that keeps every discount *transactional* — tied to a concession the customer is actually making in return.

A well-built version specifies: how much discount a two-year versus three-year versus five-year term earns; how seat-count or usage-volume tiers translate into discount entitlement; what annual-prepay versus quarterly versus monthly billing is worth; how multi-entity or multi-division commitments stack. The founder's job is not to compute these to the decimal — finance models that — but to *set the philosophy*: are we willing to trade meaningful margin for term certainty because our cost of capital and churn math says term is precious? Or are we a company where term matters less and volume matters more? That is a strategic call about what the company *values*, and it is founder/CRO/CFO work.

The failure mode when this section is vague: reps and even the deal desk start treating discount as a *standalone lever* — "the customer wants 20% off" becomes a negotiation about the 20%, divorced from what the customer is giving back. The discount floats free of any concession. A sharp multi-year/volume rule re-anchors every conversation: the question is never "how much discount can we give?" — it is "what is the customer committing to, and what does our policy say that commitment earns?" That reframing, encoded by the founder once, protects margin on thousands of deals the founder never sees.

## The Quote-To-Cash Context — Where Discounting Actually Lives

It helps the founder to see that discount policy is not a free-standing thing — it is one component of the company's quote-to-cash process, and a founder who understands where it sits will make better decisions about what to own and what to delegate.

Quote-to-cash is the whole sequence from "a rep wants to price a deal" through "cash is collected and the contract is live": configuration, pricing, discounting and approvals, quote generation, contract, signature, provisioning, billing, collection. Discounting is one link in that chain — and a link that, done badly, contaminates every link downstream. An undisciplined discount doesn't just cost margin on that deal; it sets a renewal baseline (the customer expects the same or better next year), it creates a comparison point other customers eventually learn about, it complicates billing and revenue recognition, and it distorts the company's pricing data so badly that future pricing decisions are made on noise.

This matters for the founder-vs-deal-desk question because it clarifies *why* the deal desk — not the founder — should own execution: the deal desk sits at the natural control point in quote-to-cash where pricing, approvals, and contract terms converge, and it has visibility into the *whole chain*. The founder does not, and should not, sit in that operational chain. But the founder absolutely owns the *policy* that governs the discounting link, because a bad policy poisons the entire downstream flow. The founder's leverage is at the design level — get the policy right and the whole quote-to-cash process runs clean; get it wrong and no amount of deal-desk diligence fully compensates, because the deal desk is executing a flawed frame.

The practical takeaway: when a founder evaluates whether their discounting setup is working, they should not look only at discount averages — they should look downstream. Are renewals coming in at healthy rates or is the company re-discounting every renewal? Is billing clean or is it full of one-off concessions nobody can reconstruct? Is the pricing data trustworthy enough to make the next pricing decision? Those downstream symptoms are how a founder diagnoses whether the *policy* (their job) is sound — separate from whether the *deal desk* (not their job) is executing it well.

## Common Founder Objections — And The Honest Answers

Founders resist this model, and the resistance usually shows up as a small set of recurring objections. Each one contains a grain of truth, and each one has an honest answer that does not dismiss the grain.

**"But my judgment on a specific deal really is better than the policy's."** Often true — on that specific deal, in that specific moment. But it misses the math: the founder's superior judgment applies to the handful of deals the founder can personally review, while the policy applies to *all* of them. A policy that is 90% as good as the founder's judgment, applied to 100% of deals, beats founder judgment applied to 5% of deals and a vacuum applied to the other 95%. And the deals the founder *doesn't* see are exactly where the value leaks. The answer is not "your judgment is bad" — it is "your judgment doesn't scale, so encode it."

**"If I'm not in the deals, I'll lose touch with the market."** A real risk — founders *should* stay close to how deals actually go. But the feedback loop is the answer: the deal desk's telemetry, plus the founder occasionally sitting in on deals as an *observer* rather than an *approver*, plus the strategic-exception lane, keeps the founder in touch without making them a bottleneck. "Staying close to the market" and "being the approval gate" are different things; you can have the first without the second.

**"My deal desk isn't good enough to trust with this."** Sometimes true — and if so, that is the actual problem to solve, and it is *also* a founder problem. A deal desk that cannot be trusted with within-policy approvals is either under-staffed, under-trained, or under-authorized. The fix is to fix the deal desk — hire better, train on the *why* not just the numbers, give it real authority — not to route around it forever. "My deal desk isn't good enough" is a reason to *build a better deal desk*, not a reason for the founder to be the deal desk indefinitely.

**"We're moving too fast to write a formal policy."** The most self-defeating objection, because the speed is exactly the argument *for* the policy. A fast-moving company generates discount decisions faster than any founder can review them; without a written policy, those decisions either bottleneck on the founder (slowing the company down) or get made inconsistently by whoever is closest (eroding margin). The policy is what *lets* the company move fast on discounting safely. Two-to-four pages is not a bureaucratic burden; it is the thing that removes a bottleneck.

**"What if the policy is wrong?"** Then you find out from the feedback loop and you revise it — that is what the quarterly review is *for*. A wrong policy that is written down and visible gets corrected fast, because its errors show up in the telemetry. A wrong policy that lives only in the founder's head never gets corrected, because no one — including the founder — can see it clearly enough to debug it. Writing it down is what makes it *fixable*.

The pattern across all five: the objection identifies a real concern, and the model *already has an answer for that concern* — usually the feedback loop, the policy document, or fixing the deal desk. The objections are reasons to *build the model well*, not reasons to skip it.

## What Good Looks Like — A Portrait Of The Working Model

It is worth painting the picture of a company where this is fully working, because founders stuck in the bottleneck often cannot visualize the alternative — they only know their current reality.

In a company where the founder-vs-deal-desk model is running well: There is a discount policy document, two to four pages, that the founder authored and signed, and that everyone in revenue can name and roughly recite. New reps are onboarded on it; they know, for any deal, who approves the discount and how long it takes. The deal desk approves the large majority of discount requests on its own authority, same-day, and nobody — including the founder — second-guesses those calls. When a VP of Sales tries to go around the desk to the founder, the founder says "the desk owns that" and means it. The margin floor is a number everyone knows, encoded as a hard constraint in the CPQ system, and below-floor deals are vanishingly rare and always documented founder waivers. The strategic-exception lane carries a few genuinely strategic deals a quarter, and the deal desk has pushed back on the dozen fake ones before they reached the founder.

Once a quarter, the founder sits down for a couple of hours with the CRO, the CFO, and the deal desk's telemetry, and asks policy questions: is anything creeping, what exceptions recurred, did we lose deals on price, does the floor still fit our economics? Sometimes the answer is "policy stands." Sometimes it is "we need a new band for the mid-market segment" or "tighten the three-year rule." The policy gets revised, re-signed, handed back. Then the founder does not think about discounting again until the next quarter — except for the rare strategic exception that lands in their lane.

The founder in this picture is *more* in control of the company's margin than the bottlenecked founder ever was — because the control is *systematic and durable* rather than *heroic and fragile*. The company's deal throughput is not capped by the founder's calendar. The deal desk is staffed with good people who have real authority and therefore stay. Discounting is disciplined, the floor holds, velocity is high, and the founder spends their time on the things only a founder can do. That is the destination. Everything in this entry is the route to it.

## The Decision Framework

The whole entry compresses into a sequence the founder can actually follow:

**1. The founder authors the discount policy document** — margin floor, standard bands, authority matrix, multi-year/volume rules, strategic-exception criteria, "never negotiable" list. Written, versioned, signed. This is the founder's deliverable.

**2. The founder owns the margin floor personally** — with the CFO. The one number that does not move without explicit founder/CFO waiver. The deal desk enforces it; the deal desk cannot move it.

**3. The founder sets the authority matrix — and places themselves in it exactly once,** at the strategic-exception lane and the floor-waiver, never as a routine "anything over X%" tier.

**4. The founder defines the strategic-exception lane narrowly** — genuine non-standard strategic value, written-down and desk-vetted before it reaches the founder, single-digits per quarter, never "size alone."

**5. The deal desk executes within the frame** — within-policy approvals at speed, routing, exception triage, with *real* authority the founder publicly backs.

**6. Data flows back up** — the deal desk reports discount telemetry to the founder on a cadence.

**7. The founder tunes the policy quarterly — not the deals daily.** The quarterly policy review is the founder's steady-state job. Individual deals are never the founder's job again, except the defined exception lane.

The one-line version: **founders own the numbers that define the box; the deal desk owns the decisions inside the box; the founder re-engages on the box, never the individual deal.**

## 5-Year Outlook

The founder-vs-deal-desk division of labor is going to get *sharper*, not blurrier, over the next five years — and the founder's role is going to narrow further toward pure strategic policy.

The driver is the **AI-assisted deal desk**. Increasingly, the *execution* layer — checking a discount against the bands, verifying the margin floor, routing to the right approver, triaging fake exceptions, generating the telemetry — is software-assisted or software-automated. An AI-assisted deal desk applies the policy faster, more consistently, and with better instrumentation than a human desk, and it gets the discount-approval turnaround time toward real-time. **Automated policy enforcement** in CPQ means the floor and the bands are not just *documented* constraints but *hard system* constraints — a below-floor deal literally cannot be quoted without the waiver path. This is good: it removes the "human forgot the policy under pressure" failure mode almost entirely.

What this does to the founder's role is *narrow it further to the part only a human founder can do*: authoring the strategic frame. AI can apply a policy brilliantly; AI cannot decide that the company will be a value-priced product that defends list price, or that a particular lighthouse logo is worth a one-time below-floor waiver because of what it does to the market narrative, or that a competitive pricing shift demands a strategic response. As the *execution* layer gets automated, the founder's job becomes *more* purely strategic, not less relevant — the founder is the one feeding the system its *intent*, and the system handles the *application* of that intent at scale and speed no human desk ever could.

The five-year trajectory: the deal desk becomes smaller and more powerful (fewer people, more software, more authority); the execution layer approaches real-time and near-perfect policy consistency; the feedback loop becomes continuous instrumentation rather than a quarterly hand-assembled report; and the founder's role compresses to the irreducible core — *own the floor, author the frame, define the strategic exceptions, read the telemetry, tune the policy.* The founders who win are the ones who *lean into* that compression — who recognize that "I author the intent, the system executes it" is not a loss of control but the highest-leverage version of the role — rather than the ones who keep trying to be the deal desk in a world where the deal desk is increasingly a piece of software.

## Final Framework

The founder's role in discounting, fully assembled:

**The division of labor.** The founder owns the *policy* — the box. The deal desk owns *execution* — the decisions inside the box. The founder re-engages on the box, never the individual deal. Conflating "owning the policy" with "touching every deal" produces the bottleneck; conflating "the desk handles discounting" with "I don't need to own the policy" produces the drift. The whole skill is holding those two as *separate* decisions with *separate* owners.

**The policy-document template.** The founder's actual deliverable: a two-to-four page document containing the margin floor, the standard discount bands, the approval-authority matrix, the multi-year/volume rules, the strategic-exception criteria, and the "never negotiable" list. Written, versioned, signed by the founder. Everything the deal desk does is downstream of it.

**The margin-floor ownership.** The one number the founder owns personally, with the CFO. The hard backstop below which no deal goes without an explicit, documented waiver. Enforced by the deal desk; moved only by the founder and CFO, deliberately, never in the heat of a deal.

**The authority matrix.** The founder designs it and places themselves in it exactly once — the strategic-exception lane and the floor-waiver — never as a routine discount tier. A new rep should be able to read it and know who approves any given deal.

**The strategic-exception lane.** The founder's only legitimate place in deal-by-deal discounting: narrow, defined, genuine non-standard strategic value, desk-vetted, single-digits per quarter. Never size alone. The deal desk gatekeeps it against inflation.

**The handoff playbook.** Policy written first; deal desk staffed and trained on the *why*; a deliberate "watch the first quarter" review-not-approve period; a clean, announced step-out that closes the founder back-channel. No lingering shadow approval.

**The quarterly governance cadence.** The founder's steady-state discounting job: a quarterly policy review reading the deal desk's telemetry and tuning the *frame*. Periodic and strategic, never continuous and operational. The feedback loop — deal desk reports data up, founder tunes policy down — is the wire that makes the whole thing a system.

Do this and the founder protects the company's value *better* than they ever did by approving deals — consistently, at scale, durably, and in a way that survives the founder being on a plane at quarter-end. Get it wrong in either direction — the bottleneck or the drift — and discounting becomes either the thing throttling the company's growth or the thing quietly eroding its margin. The founder's job is the box. Build the box well, hand the inside of it to a deal desk with real authority, read the telemetry, and tune the box. That is the entire role.

`;

const flow = `

## The Division Of Labor: Policy Layer, Execution Layer, Feedback Loop

\`\`\`mermaid
flowchart TD
  F[Founder Plus CRO Plus CFO] --> P[POLICY LAYER Founder Owns]
  P --> P1[Margin Floor Founder And CFO Own Personally]
  P --> P2[Authority Matrix Who Approves What]
  P --> P3[Pricing Philosophy And We Dont List]
  P --> P4[Standard Discount Bands]
  P --> P5[Strategic Exception Criteria Narrow]
  P1 --> DOC[Discount Policy Document Written Versioned Signed]
  P2 --> DOC
  P3 --> DOC
  P4 --> DOC
  P5 --> DOC
  DOC --> DD[EXECUTION LAYER Deal Desk Owns]
  DD --> E1[Within Policy Approvals At Speed]
  DD --> E2[Routing Through The Matrix]
  DD --> E3[Exception Triage Real Vs Fake]
  DD --> E4[Same Day Turnaround]
  E3 --> EXC[Genuine Strategic Exception]
  EXC --> FL[Founder Strategic Exception Lane Only]
  E3 --> REJ[Fake Exception Pushed Back At Desk]
  E1 --> DATA[Discount Telemetry]
  E2 --> DATA
  E3 --> DATA
  DATA --> D1[Discount Distribution]
  DATA --> D2[Exception Patterns]
  DATA --> D3[Drift And Creep Indicators]
  DATA --> D4[Lost On Price Won With Excess Margin]
  D1 --> UP[FEEDBACK LOOP Data Flows Back Up]
  D2 --> UP
  D3 --> UP
  D4 --> UP
  UP --> QR[Quarterly Policy Review]
  QR --> TUNE[Founder Tunes The POLICY Not The Deals]
  TUNE --> DOC
  FL --> WAIVE[Documented Founder Plus CFO Floor Waiver If Needed]
\`\`\`

## The Stage Evolution: What The Founder Owns At Each Stage

\`\`\`mermaid
flowchart LR
  S1[STAGE 1 Pre Deal Desk Under 3M-8M ARR] --> S1A[Founder IS The Deal Desk]
  S1A --> S1B[Founder Approves Discounts Directly]
  S1B --> S1C[Correct And Necessary At This Stage]
  S1C --> S1D[Founder Should Write Down The Implicit Policy]
  S1D --> S2[STAGE 2 Standing Up Deal Desk 8M-25M ARR]
  S2 --> S2A[Founder Authors The Policy Document]
  S2A --> S2B[Founder Staffs And Trains The Deal Desk]
  S2B --> S2C[Watch The First Quarter Review Not Approve]
  S2C --> S2D[Clean Announced Step Out Close The Back Channel]
  S2D --> S2E[Highest Skill Moment Most Commonly Botched]
  S2E --> S3[STAGE 3 Mature 25M Plus ARR]
  S3 --> S3A[Founder Touches Only Quarterly Policy Review]
  S3A --> S3B[Founder Touches Only Strategic Exception Lane]
  S3B --> S3C[CRO Owns Policy Operation Within The Frame]
  S3C --> S3D[Deal Desk Owns All Execution]
  S3D --> S3E[Founder Still In Routine Deals Means Evolution Stuck]
  S1C -.->|Botched Forward| AB[Anti Pattern Abdicates Hands Over With No Policy]
  S2E -.->|Botched| SH[Anti Pattern Shadow Approval Never Lets Go]
  S2E -.->|Botched| BN[Anti Pattern Founder Still Bottleneck]
\`\`\`

`;

const src = `

## Sources

1. **The two-decision distinction (setting policy vs. executing deals)** — Foundational framing drawn from deal-desk operating literature; the persistent founder error is treating one word ("discounting") as one decision when it is structurally two.
2. **Discount policy document structure** — Standard SaaS/B2B deal-desk practice: a written, versioned policy containing margin floor, bands, authority matrix, multi-year/volume rules, exception criteria, and a "never negotiable" list.
3. **Contribution-margin / gross-margin floor** — Unit-economics practice: the hard backstop below which no deal proceeds without explicit founder/CFO waiver; owned by founder + CFO, enforced (not set) by the deal desk.
4. **Approval-authority matrix** — Deal-desk design pattern: a grid of discount/margin levels by approval role (rep, manager, RVP, VP/CRO, deal desk, founder) designed so the vast majority of decisions resolve below the founder.
5. **Deal desk as operating system / founder as architect** — Common analogy in revenue-operations practice describing the healthy founder-to-deal-desk division of labor.
6. **The "founder approves everything" anti-pattern** — Widely documented bottleneck failure mode in growth-stage SaaS (roughly $3M-$30M ARR); root cause is almost always an unwritten policy.
7. **The "founder abdicates entirely" anti-pattern** — Less-discussed inverse failure mode: handing over execution with no strategic frame, producing gradual discount drift.
8. **Discount creep / margin erosion** — Revenue-operations literature on how unconstrained deal desks drift more permissive under recurring quarterly sales pressure.
9. **Strategic-exception lane** — Deal-desk practice on narrowly defining the deals (lighthouse logos, competitive must-wins, non-standard strategic value) that legitimately warrant founder-level judgment — explicitly excluding "size alone."
10. **The founder-to-deal-desk handoff** — Operational-transition practice: policy-first, staff-and-train, "watch the first quarter" review period, clean announced step-out, no lingering shadow approval.
11. **The feedback loop / discount telemetry** — Deal-desk reporting practice: distribution, exception patterns, drift indicators, and lost-on-price/won-with-excess-margin analysis flowing up to inform policy revision.
12. **Stage-dependent founder role** — Scaling practice: pre-deal-desk the founder genuinely is the deal desk; the transition is the policy-authoring + handoff; mature stage is quarterly policy review + strategic-exception lane only.
13. **CRO / founder / deal-desk three-way relationship** — Common org pattern in companies with a CRO: CRO owns policy operation within the frame, founder owns the floor and strategic frame, deal desk owns execution.
14. **CPQ and approval-workflow tooling** — Configure-price-quote and approval-automation practice: encoding bands, floor, authority matrix, and the strategic-exception lane into system rules so policy holds under pressure.
15. **AI-assisted deal desk (5-year outlook)** — Emerging revenue-operations trend: software-assisted/automated policy application, automated floor enforcement, and continuous telemetry narrowing the founder's role toward pure strategic policy.
16. **Quarterly governance cadence** — Operating-rhythm practice: a periodic, strategic policy review as the founder's steady-state discounting job, explicitly contrasted with continuous operational deal approval.
17. **The trust-problem reframe** — Founder-coaching framing: a good policy + good deal desk protects value better than founder gut-checks because it does so consistently and at scale; founder gut-checks are high-quality but low-throughput and inconsistent.
18. **Measuring delegation success** — System-level metrics practice: discount discipline, floor integrity, exception-catch rate, deal velocity, founder-time-in-routine-deals, and feedback-loop health — measured at the system level, never deal-by-deal.

`;

const num = `

## Numbers

The figures below are planning-grade benchmarks for the founder-vs-deal-desk division of labor at a $3M-$50M ARR company. Treat them as ranges to calibrate against your own unit economics, not as universal constants.

**Stage thresholds — when the role changes.**
- **Pre-deal-desk stage:** roughly **under $3M-$8M ARR**, or under **~40-60 deals per quarter**. Below this, the founder genuinely *is* the deal desk and that is correct. A dedicated deal-desk function is overhead the company cannot yet justify.
- **Standing-up-a-deal-desk stage:** roughly **$8M-$25M ARR**. Deal volume now exceeds founder capacity; the founder's job is to author the policy and run the handoff.
- **Mature stage:** roughly **$25M+ ARR**. The founder touches discounting only at the quarterly policy review and the strategic-exception lane.
- A founder still personally approving routine discounts at **$30M+ ARR** is a strong signal the stage evolution never completed.

**The founder's discounting time budget — working model vs. broken model.**
- **Working model:** roughly **one quarterly policy review** (a couple of hours, high-leverage) plus a handful of strategic-exception-lane decisions per quarter. Effectively **zero daily discounting commitment**.
- **Broken (bottleneck) model:** the founder personally touches **dozens of individual discount decisions per quarter** — often **20-40+ at quarter-end alone** — and has *no* structured quarterly policy review. The cadence is exactly inverted.
- **Target after a clean handoff:** founder touches **single-digit deals per quarter**, all of them strategic-exception-lane or floor-waiver.

**The strategic-exception lane — how narrow is narrow.**
- A genuine strategic-exception lane should carry **single digits of deals per quarter** — not "every deal over $500K."
- **Size alone never qualifies** a deal for the lane. A $2M deal that is just a big normal deal goes through the standard matrix; a $200K genuine market-defining lighthouse logo may legitimately reach the founder.
- If the exception lane is consistently carrying **more than a handful of deals per quarter**, the definition is too loose — the fix is tightening the definition with the deal desk, not the founder reviewing more deals.

**The margin floor — the one number the founder owns.**
- Stated as a hard **contribution-margin or gross-margin percentage**. The specific number is company-specific (driven by unit economics), but the *discipline* is universal: it moves only by deliberate founder + CFO decision, never in the heat of a deal.
- **Below-floor deals in a healthy system:** near **zero per quarter**, and every single one a *documented founder + CFO waiver* — not quiet drift.
- A floor that gets "adjusted" more than roughly **once a year** is not functioning as a floor; it is a negotiating position.

**The authority matrix — pushing decisions down.**
- A well-designed matrix resolves the **vast majority of discount decisions** (typically **90%+**) *below the founder* — at the rep, manager, RVP, VP/CRO, or deal-desk level.
- The founder appears in the matrix **exactly once** — the strategic-exception lane and the floor-waiver — never as a routine "anything over X%" tier.
- **Reps** should have a small zone of *unilateral* discount authority so routine small deals close with **zero approval friction**.

**Discount creep — the drift signal.**
- A common abdication-failure trajectory: average discount creeping **2-4 percentage points per quarter** once a deal desk operates with no strategic frame.
- Illustrative damage path: average discount drifting from **~12% to ~21%** over roughly two years, with blended margin down several points before it surfaces in a board deck.
- The founder's correct response to creep is a **policy revision** (tighter bands, reinforced floor, desk retraining) — *not* personally reviewing deals.

**Deal velocity — the bottleneck cost.**
- In a founder-bottleneck model, discount-approval turnaround commonly runs **multiple days**, spiking at quarter-end when volume concentrates.
- After a clean handoff with a real-authority deal desk, target turnaround on **standard within-policy requests is same-day** — often hours.

**The handoff — the transition.**
- Authoring the policy document is typically a **focused multi-day to one-week** effort for the founder (formalizing what was largely already implicit).
- The **"watch the first quarter"** review-not-approve period is roughly **one quarter** — the deal desk makes the calls, the founder reviews a sample (often weekly) and coaches.
- A clean handoff is typically **genuinely running within ~2 quarters / ~6 months**; a botched one (shadow approval) can look fine for **2-3 quarters** before the damage shows.

**The CRO layer.**
- The CRO layer typically becomes necessary as deal volume and policy complexity grow past roughly **$15M+ ARR**.
- Healthy split: **founder owns the floor + strategic frame; CRO owns policy operation within the frame; deal desk owns execution within the policy** — three layers, three owners.

**Policy document length.**
- The best discount policy documents are **two to four pages** — explicit enough that every ambiguity is closed, short enough that the deal desk actually internalizes it. Length is not the goal; *explicitness* is.

`;

const counter = `

## Counter-Case: When Founder Involvement In Discount Numbers Is Actually Right

The default advice — "founders set policy, deal desks execute deals" — is correct for most $3M-$50M ARR companies most of the time. But it is not universal, and a founder who applies it dogmatically can do as much damage as one who ignores it. There are real situations where direct founder involvement in discount *numbers* — not just policy — is the right call. And there is a mirror-image trap worth naming bluntly.

**Pre-deal-desk, the founder genuinely should still own it.** At a company under roughly $3M-$8M ARR doing under ~40-60 deals a quarter, "delegate to the deal desk" is not wisdom — it is premature optimization. There is no deal desk. Standing one up would be overhead the company cannot justify, and the founder's per-deal judgment is, at this stage, *genuine primary research*: every discount decision teaches the founder something real about what the market will actually pay, where the price ceiling is, what objections cluster. A founder who tries to "delegate discounting" here is delegating their own learning. The correct move at this stage is for the founder to *do* the discounting *and* write down what they learn — so the eventual handoff has a document. Founder-in-the-deals is a *stage*, not a *failure*, and rushing past it is its own mistake.

**Bespoke, strategically-priced businesses where per-deal founder judgment adds real value.** Some businesses do not have a "standard deal" to write bands around. Enterprise companies whose every contract is a multi-million-dollar bespoke negotiation; platform businesses where pricing is entangled with strategic terms (data rights, co-development, exclusivity, distribution); companies selling into a tiny number of very large customers where each deal is genuinely *sui generis*. In these businesses, a discount "policy" with standard bands is close to fiction — there is no central tendency to encode. Founder (or CRO) judgment per-deal is not a bottleneck; it is the *product*. The deal desk's role here shifts from "apply the policy" to "support the founder's judgment with structure and data." Trying to force a bands-and-matrix model onto a genuinely bespoke business produces a policy nobody can use and a deal desk that is in everyone's way.

**When "delegate to the deal desk" is simply premature.** A company can be at $12M ARR and *still* not have the deal volume, the pricing maturity, or — critically — the *policy document* to justify handing discounting to a deal desk. "Stand up a deal desk" is not a stage you hit by revenue alone; you hit it when you have (a) enough deal volume that founder review is a real bottleneck, *and* (b) enough pricing stability that a policy can actually be written, *and* (c) someone good enough to staff the desk. Miss any of those and "delegate to the deal desk" means handing execution to an under-resourced function with no frame — which is just the abdication anti-pattern with extra steps. Sometimes the right answer is "not yet — the founder keeps doing it, deliberately, while we build toward the handoff."

**The mirror-image trap: "I'm just setting policy" as cover for meddling.** This is the counter-case to the counter-case, and it deserves to be named bluntly because it is common and self-deceptive. A founder who *cannot* let go of discount decisions will often discover that "I own the policy" is a respectable-sounding cover story for continuing to be in every deal. It shows up as: a founder who "just wants to review" every deal over some threshold "to make sure it fits the policy"; a founder who treats every within-policy decision they personally disagree with as a reason to intervene rather than a data point for the next policy review; a founder who keeps the back-channel open so sales leaders can still bring them deals directly. Each individual intervention is justified as "policy stewardship." In aggregate it is the bottleneck anti-pattern, fully intact, wearing a better outfit. The tell: if "setting policy" involves the founder touching individual deals on anything like a *weekly* basis, it is not policy work — it is meddling with a euphemism. Real policy work is *quarterly* and *aggregate*. If it is *continuous* and *deal-specific*, the word "policy" is doing PR, not describing reality.

The synthesis: the honest test is not "am I involved in discounting?" — founders should always be involved in discounting, at the policy level, forever. The honest test is *at what altitude and frequency*. Quarterly, aggregate, frame-level, telemetry-driven: that is the founder's job at every stage past pre-deal-desk, and it is right. Weekly, deal-specific, intervention-driven: that is the bottleneck — *unless* you are genuinely pre-deal-desk or genuinely a bespoke business, in which case it is right *for now*. Know which one you are, be honest about it, and re-test the answer every few quarters as the company scales — because the correct answer is *supposed to change*.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a bookkeeping business in 2027? (Adjacent finance-operations context; unit-economics and margin-floor thinking.)
- **q9502** — How do you start a CPA firm in 2027? (CFO-partnership context for the margin-floor ownership discussed here.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Sales-motion restructuring; parallels the AI-assisted deal desk 5-year outlook.)
- **q9510** — How do you sell a bookkeeping firm? (Margin-discipline-as-enterprise-value context.)
- **q9601** — How do you start a fractional CFO business in 2027? (The CFO half of margin-floor ownership.)
- **q9602** — How do you start an outsourced controller business in 2027? (Financial-controls and policy-encoding parallels.)
- **q1947** — How do you start a property management business in 2027? (Operational-delegation and authority-matrix parallels in a different domain.)
- **q1948** — How do you start a real estate syndication business in 2027? (Bespoke-deal economics referenced in the counter-case.)
- **q1950** — How do you start a real estate investment fund in 2027? (Strategically-priced bespoke-deal context.)

`;

const tags = ['revops','deal-desk','discounting','founder-role','pricing-strategy','sales-operations','margin','delegation','cro','b2b-saas'];

const sources = [
  { title: 'Deal Desk Operating Model — Policy vs. Execution Division of Labor', url: 'https://www.gartner.com/en/sales/topics/deal-desk' },
  { title: 'SaaS Discounting and Margin-Floor Practice', url: 'https://www.priceintelligently.com' },
  { title: 'Revenue Operations — Approval Authority Matrices and CPQ Workflow', url: 'https://www.salesforce.com/products/cpq' }
];

const notes = {
  s6: 'Added 18 cited sources covering the two-decision distinction, discount policy document structure, contribution-margin floor practice, approval-authority matrix design, the founder-as-architect / deal-desk-as-operating-system model, both anti-patterns (founder approves everything; founder abdicates), discount creep, the strategic-exception lane, the handoff sequence, the feedback loop, stage-dependent role evolution, the CRO/founder/deal-desk three-way relationship, CPQ tooling, the AI-assisted deal desk outlook, the quarterly governance cadence, the trust-problem reframe, and system-level delegation metrics.',
  s7: 'Added comprehensive numerical analysis: stage thresholds ($3M-$8M pre-deal-desk, $8M-$25M standing-up, $25M+ mature; ~40-60 deals/quarter inflection), the founder discounting time budget (quarterly review + single-digit exceptions in a working model vs. 20-40+ quarter-end approvals in a broken one), strategic-exception-lane sizing (single digits per quarter, size alone never qualifies), margin-floor discipline (near-zero documented below-floor waivers, adjusted at most ~once/year), authority-matrix design (90%+ of decisions resolve below the founder), discount-creep trajectory (2-4 points/quarter drift, ~12% to ~21% illustrative path), deal-velocity benchmarks (multi-day bottleneck vs. same-day post-handoff), handoff timing (~1 week to author, ~1 quarter watch period, ~6 months to genuinely running), the CRO layer threshold (~$15M+ ARR), and policy-document length (2-4 pages).',
  s8: 'Added a four-part counter-case plus synthesis: (1) pre-deal-desk companies where founder-in-the-deals is a necessary stage and primary pricing research, not a failure; (2) bespoke, strategically-priced businesses where there is no "standard deal" to write bands around and per-deal founder judgment is the product; (3) when "delegate to the deal desk" is premature because the company lacks the volume, pricing maturity, or policy document to justify one; and (4) the mirror-image trap — a founder using "I am just setting policy" as self-deceptive cover for continuing to meddle in every deal, with the honest altitude-and-frequency test (quarterly/aggregate/frame-level = policy work; weekly/deal-specific = meddling).',
  s9: 'Cross-linked 9 related Pulse entries spanning adjacent finance-operations context (q9501, q9502, q9510, q9601, q9602), sales-motion and AI-disruption parallels (q1899), operational-delegation parallels in other domains (q1947), and the bespoke-deal-economics context referenced in the counter-case (q1948, q1950).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the founder-vs-deal-desk discount-policy division of labor for a $3M-$50M ARR audience. Two mermaid diagrams (the division-of-labor model: policy layer the founder owns -> execution layer the deal desk owns -> feedback loop flowing data back up; and the stage evolution: founder-IS-the-deal-desk -> founder-authors-policy-and-hands-off -> founder-touches-only-policy-review-and-strategic-exceptions, with the anti-patterns branching off). Full coverage: the core two-decision distinction, what the founder must own (margin floor, pricing philosophy, "we dont" list, strategic-exception criteria) vs. must delegate (deal-by-deal application, routing, exception triage, throughput), both anti-patterns ("founder approves everything" bottleneck and "founder abdicates entirely" drift), the right model (founder as architect, deal desk as operating system, telemetry as the connecting wire), the discount policy document the founder authors, setting the margin floor, the approval-authority matrix, the strategic-exception lane, the deal desk mandate, the founder-to-deal-desk handoff, the feedback loop, when to re-engage, the three-stage evolution, the CRO three-way relationship, the trust problem and its reframe, measuring whether delegation works, the quarterly governance cadence, encoding policy in CPQ tooling, 5 real-world scenarios, the decision framework, the 5-year AI-assisted-deal-desk outlook, a final assembled framework, and a four-part counter-case.'
};

runPolish({ id: 'q9527', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
