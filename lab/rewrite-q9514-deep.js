// q9514 — What is the operator playbook for a CRO inheriting a Salesforce-based discount approval workflow that everyone bypasses via exception emails?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** When you inherit a broken Salesforce discount approval workflow as a new CRO, **do not rip it out on day one** — the instinct to "fix the workflow" immediately is the single most common rookie mistake, because you do not yet know whether the workflow is the disease or a symptom. Run a disciplined three-phase operator sequence: **diagnose (days 1-30), stabilize with quick wins (days 30-60), redesign and rebuild (days 60-180)**. The discovery audit pulls **six artifacts first**: the last 4 quarters of approved discounts, the approval-cycle-time distribution, the discount-by-rep histogram, the end-of-quarter concentration curve, the exception-email log, and the current approval authority matrix (if one exists). Read the discount distribution like a diagnostician — **a bimodal spike at "everyone discounts 20%" plus a March-31 / June-30 cliff means the workflow has lost all deterrent value** and reps are anchoring to the cap. The five canonical inherited failure modes are: **approval bottlenecks killing deal velocity, rubber-stamp approvals that add latency but no control, the workflow reps route around entirely via exception email, no audit trail, and a CPQ-vs-manual-discount-field mismatch**. Quick wins in the first 30-60 days — **auto-approve thresholds for low-risk discounts (typically 0-10%), a hard 4-business-hour SLA on approvals, and killing one or two redundant approval steps** — stabilize velocity without a redesign and buy you political capital. The redesign installs a **tiered discount authority matrix keyed to BOTH discount depth AND deal size** (illustrative: rep 0-10%, manager 10-20%, RVP 20-35%, VP 35-50%, CRO 50-65%, CFO/CRO joint 65%+, all tuned to your actual margin structure), built natively in Salesforce with **Flow-based approvals plus CPQ approval rules**, a **fast lane for clean deals and an exception-scrutiny lane for non-standard terms**, and a logged exception process that captures payment terms and multi-year concessions, not just percentage. Governance runs on a **quarterly discount review cadence**, comp-plan alignment (margin-based comp and discount clawbacks are the real behavior levers), and board/finance reporting that frames discount discipline as a margin-and-forecast story. **The counter-case matters: sometimes the inherited workflow is fine and the real problem is pricing, packaging, or comp — and sometimes the inherited problem is over-governance, where the fix is removing controls, not adding them.** The operator's job is to diagnose which world they are in before touching a single Salesforce object.`;

const core = `

## The First-90-Days Frame: Diagnose Before You Demolish

Every new CRO who inherits a discount approval workflow feels the same pull within the first week. A deal is stuck. An RVP forwards you an exception email with a subject line like "URGENT — need 32% to close Acme by Friday, approval process is dead." You look at the Salesforce approval history and see a deal that has been sitting in "Pending Manager Approval" for nine days. Your instinct — the instinct that got you the CRO job — is to fix it. Today. Rip out the broken process, announce a new one Monday, be the operator who moves fast.

That instinct is wrong, and it is wrong in a specific, diagnosable way. You do not yet know whether the workflow is the disease or a symptom of something else. A discount approval workflow is the most downstream object in a long causal chain that starts with pricing, runs through packaging, passes through sales comp, and only then arrives at "what percentage can a rep give away and who signs off." If you redesign the workflow on day one, you may be treating the cough while ignoring the pneumonia. Worse, you will have spent your scarcest first-90-days resource — political capital and organizational attention — on a change that does not move the number, and you will have taught the org that the new CRO reorganizes things for the sake of reorganizing them.

The correct frame is a three-phase sequence, and the sequencing is the whole game. **Phase one, days 1-30: diagnose.** Pull the data, read the distribution, map the stakeholders, identify the actual failure modes. Touch nothing. **Phase two, days 30-60: stabilize with quick wins.** Make two or three small, reversible, obviously-good changes that restore velocity and signal competence without committing you to a redesign. **Phase three, days 60-180: redesign and rebuild.** Now — and only now, armed with evidence — design the new authority matrix, build it in Salesforce, and roll it out with real change management.

The reason this sequence beats "fix it now" is not caution for its own sake. It is that the diagnosis phase routinely changes the redesign. A CRO who pulls the data often discovers the workflow is not actually the bottleneck — the bottleneck is that finance owns a step nobody told the field about, or that the discount problem is concentrated in one segment where the pricing is genuinely wrong, or that the "exception email" culture exists because the approval process has a literal bug that routes RVP-tier deals to a manager who left the company. You cannot see any of that from the CRO chair in week one. You can only see it in the data. Diagnose before you demolish.

## The Discovery Audit: What To Pull First

The diagnosis phase is a data-pull exercise, and the order you pull things in matters because each artifact reframes the next. Here is the canonical first pull, in priority order.

**Artifact one: the last four quarters of approved discounts.** Every closed-won opportunity with its final discount percentage, the list price, the net price, the deal size, the segment, the rep, the approving manager, and the close date. This is your raw material. If Salesforce does not capture final discount cleanly — and on inherited orgs it frequently does not, because reps discount via the manual "Amount" field rather than a structured discount field — that itself is a finding. Note it and reconstruct what you can.

**Artifact two: the approval-cycle-time data.** For every opportunity that went through the approval process, how long did it sit at each stage? Submitted-to-first-action, first-action-to-final-approval, and total elapsed business hours. This is the velocity cost of the inherited workflow, and it is the number that will justify your quick wins to the field.

**Artifact three: the discount-by-rep distribution.** A histogram of average discount by individual rep, sorted. You are looking for the shape — is it a tight cluster, a long tail, a bimodal split between disciplined reps and serial discounters? You are also looking for the rep whose average discount is suspiciously close to the manager-approval threshold, because that rep has learned exactly where the line is and lives one basis point under it.

**Artifact four: the end-of-quarter concentration curve.** Plot discount depth against close date within each quarter. A healthy org shows a mild uptick in the last two weeks. An unhealthy org shows a cliff — a near-vertical spike in both deal volume and discount depth in the final 72 hours of the quarter. That cliff is the signature of a workflow that has stopped functioning as a control and started functioning as a quarter-end pressure valve.

**Artifact five: the exception-email log.** This is the hardest artifact to get because it lives in inboxes, not Salesforce — which is the point. Ask the deal desk, RevOps, and the approving VPs to forward you every "exception" or "one-time approval" email thread from the last two quarters. Count them. Categorize them. The ratio of exception-email approvals to in-system approvals is your single best measure of how dead the official workflow is. If 40% of meaningful discounts were approved over email, the Salesforce workflow is a fiction the org maintains for audit theater.

**Artifact six: the current approval authority matrix, if one exists.** Often it does not exist as a document — it exists only as the branching logic inside a Process Builder flow or a set of CPQ approval rules that nobody has looked at in two years. Reverse-engineer it. Write down, in a simple table, who can approve what today. You will frequently find the matrix is flat ("manager approves everything up to 40%, VP above that") or internally contradictory (two approval rules that both fire on the same condition and create a deadlock).

## Reading The Discount Distribution: Healthy Versus Unhealthy

Once you have the data, the skill is reading it like a diagnostician reads a chart. Discount distributions have tells.

A **healthy discount histogram** is roughly log-normal and left-anchored: the mode sits well below your average approved discount, most deals cluster in a modest band (say 5-15% for a typical B2B SaaS list-price model), there is a thin right tail of genuinely strategic deals at deep discounts, and — critically — there is no pile-up at any specific threshold number. Discounts look like they were negotiated deal-by-deal on the merits.

An **unhealthy histogram** has three signatures, and inherited workflows usually show all three. The first is **threshold pile-up**: a visible spike of deals at exactly the number where the next approval tier kicks in. If "manager approves up to 20%," you will see a fat bar at 19-20% and a near-empty space at 21-25%. Reps are not negotiating to 20%; they are anchoring to 20% because it is the most they can get without escalation friction. The number stopped being a negotiation outcome and became a default.

The second signature is **"everyone discounts 20%"** — the distribution collapses toward a single value. When a workflow has lost all deterrent value and the comp plan does not punish discounting, the discount stops being variable. It becomes a fixed cost the rep applies to every deal because there is no reason not to. A distribution with low variance around a high mean is a distribution where the workflow has stopped doing its job.

The third signature is the **bimodal end-of-quarter spike**: when you split the histogram into "first ten weeks of quarter" and "last three weeks," the late cohort is a different distribution entirely — higher mean, fatter right tail, and a second mode that did not exist before. This is the workflow being overridden by quarter-end pressure, almost always through the exception-email channel. The bimodality is the fingerprint of a control that works when nothing is at stake and collapses exactly when it matters.

Reading these tells does two things. It tells you how broken the workflow actually is — threshold pile-up plus bimodality plus low variance is a fully failed control. And it tells you whether the problem is even a workflow problem at all: if discounts are uniformly deep across the entire quarter with no threshold pile-up, the workflow might be working fine and you have a pricing problem instead. The distribution is the diagnostic.

## Diagnosing The Inherited Workflow's Failure Modes

Inherited Salesforce discount workflows fail in five canonical ways, and a given org usually has two or three of them simultaneously. Naming them precisely is what lets you fix the right thing.

**Failure mode one: approval bottlenecks killing deal velocity.** The approval process is real and enforced, but it is slow. Deals sit. Approvers are RVPs and VPs who travel, sell, and live in their own pipeline; they treat approval queues as a low-priority inbox. The cycle-time data shows multi-day waits at single stages. The cost is not abstract — it is deals slipping quarters, prospects going cold, and reps learning that the official process loses deals. This failure mode trains the exception-email behavior directly.

**Failure mode two: rubber-stamp approvals that add latency but no control.** The opposite pathology. Approvals happen fast, but they are not approvals — they are formalities. The manager clicks "approve" on everything because reviewing each deal is not worth their time and the comp plan does not make them care about margin. The workflow adds a step, adds latency, and adds zero control. You can identify this from the data: near-100% approval rates with near-zero modification rates means nobody is actually deciding anything.

**Failure mode three: the workflow reps route around entirely.** The exception-email culture. The official process exists, but the real process is a Slack message or an email to an RVP who replies "approved, go." The Salesforce workflow becomes a record-keeping afterthought, updated days later if at all. This is the most corrosive mode because it means your system of record is fiction and your actual controls are whatever individual VPs feel like enforcing on a given Friday.

**Failure mode four: no audit trail.** Whether because of email approvals, manual Amount-field overrides, or an approval process that does not capture the reason for the discount, the org cannot answer "why did this deal get 35%?" after the fact. Finance hates this. The board hates this. And it means you cannot do the one thing that makes discount governance improve over time — review past decisions and learn from them.

**Failure mode five: the CPQ-versus-manual mismatch.** The org bought CPQ, configured discount schedules and approval rules in CPQ, and then... reps kept discounting in the standard opportunity Amount field or in a custom field, bypassing the CPQ approval rules entirely. Or CPQ governs the quote but a manual "special terms" field on the opportunity does not. The control surface and the actual discounting surface are different objects. This is extremely common on inherited orgs and almost always a sign that the CPQ implementation was never finished.

The diagnostic discipline here: do not assume. Pull the data and let it tell you which two or three of these five you actually have. A workflow with bottlenecks plus exception-routing needs a very different fix than a workflow with rubber-stamping plus no audit trail.

## The Approval Authority Matrix: Assessing What You Inherited

Before you can redesign the authority structure you have to honestly assess what you inherited, and the question is binary at first: is there a real tiered matrix, or is it flat and ad hoc?

A **real tiered matrix** has graduated authority bands keyed to discount depth, ideally with deal size as a second axis, and the bands map to actual roles with actual accountability: rep, manager, RVP, VP, CRO, CFO. Each tier has a defined ceiling, escalation is automatic when a deal exceeds the rep's authority, and the tiers are documented somewhere a human can read.

A **flat or ad hoc structure** is what you usually inherit. The most common flat pattern: "rep can do up to X%, manager approves everything above X%." One threshold, one approver tier, no graduation. This collapses under its own weight because the manager becomes a bottleneck for everything from a routine 12% to a strategic 55%, and because there is no structural difference between a small deal at 25% and a seven-figure deal at 25% — radically different risk, identical process.

The other thing to assess: **does the matrix account for deal size at all?** Almost no inherited matrix does, and it is the most important missing axis. A 30% discount on a $20K deal and a 30% discount on a $2M deal are not the same decision. The dollar value of the concession differs by 100x, the strategic stakes differ, the precedent risk differs. A matrix keyed only to percentage treats them identically, which means it is simultaneously too strict for small deals (escalating trivial dollar amounts) and too loose for large ones (letting a manager wave through a half-million-dollar giveaway because the percentage looked normal).

Write down what you have. A simple two-column table — "discount band" and "who approves today" — plus a note on whether deal size is a factor. This document, which often does not exist anywhere in the company, becomes the before-picture you redesign against.

## Cycle-Time As The Health Metric

If you need one number to run the diagnosis and justify the quick wins, it is **approval cycle time** — the elapsed business hours from approval-submitted to approval-final. It is the health metric because it is the thing the field feels, the thing that trains the exception-email behavior, and the thing you can move fast.

Pull the cycle-time distribution, not just the average. The average lies. What you want is the shape: the median, the 75th percentile, the 90th percentile, and the long tail of deals that sat for a week or more. A workflow with a 6-hour median but a 90th percentile of 5 days is a workflow that mostly works but fails catastrophically often enough that nobody trusts it — and "often enough that nobody trusts it" is the bar that matters, because trust is binary. Reps do not route around a process that fails 10% of the time by using it 90% of the time; they route around it 100% of the time because they cannot predict which deal will be the one that sits.

Then quantify the velocity cost in terms an executive audience cares about. Take the deals that sat beyond a reasonable SLA and estimate: how many slipped to the next quarter? How many close dates moved? If you can credibly say "approval latency contributed to roughly $X of pipeline slipping out of Q3," you have converted a process complaint into a forecast problem, and forecast problems get attention and budget.

Cycle time is also the cleanest before/after measure for the whole project. You will report it at diagnosis, after quick wins, and after the redesign. If the redesign does not bring median and 90th-percentile cycle time down meaningfully, the redesign failed, regardless of how elegant the new matrix looks.

## The Stakeholder Map

A discount approval workflow is never just a Salesforce object — it is a political settlement between several functions, and changing it means renegotiating that settlement. Map the stakeholders before you touch anything.

**Who owns the workflow today, operationally?** This is usually RevOps, a deal desk, sales ops, or — on smaller or more neglected orgs — a single Salesforce admin who built the approval process two CROs ago and is the only person who understands the branching logic. Find this person first. They are simultaneously your most valuable source of institutional knowledge and the person most likely to be defensive, because you are about to redesign their work. Approach them as a collaborator, not an auditor.

**Finance's role.** Finance almost always has a stake in the discount workflow, and the stake is usually one of two flavors: either finance owns an approval step above a certain threshold (and the field may or may not know this), or finance owns the margin reporting that the workflow is supposed to protect and is quietly furious that it does not. Your CFO or VP Finance is a critical ally for the redesign — discount discipline is a margin story and finance owns margin — but they can also be the source of the over-governance problem if their instinct is to add controls. Understand which finance you have.

**The political reality of changing it.** Every RVP and VP who currently has approval authority experiences a redesign as a potential loss of power. The RVP who can wave through 40% today and likes that autonomy will resist a matrix that caps them at 35% with escalation. The manager who rubber-stamps will not mind losing a step. The deal desk, if one exists, will have opinions about whether it gains or loses scope. Map who gains and who loses authority under any plausible redesign, and plan the politics deliberately — this is not a side issue, it is half the job.

## Quick Wins In The First 30 Days

The quick-win phase exists to do two things: restore enough velocity that the org stops bleeding deals to approval latency, and demonstrate that the new CRO is competent and decisive without committing to a redesign you have not earned the right to make yet. Quick wins are small, reversible, and obviously good. Three work almost universally.

**Quick win one: auto-approve thresholds for low-risk discounts.** Pull the data on discounts in the 0-10% band (tune the number to your business). On most inherited orgs, these discounts are approved at 99%+ rates with near-zero modification — the approval step is pure latency. Configure the workflow to auto-approve anything in that band, logged but not gated. This instantly removes a large fraction of approval volume from the queue, which speeds up the deals that genuinely need review. It is reversible — you can lower the threshold tomorrow — and it is obviously correct, because nobody can defend manually approving a discount that gets approved 99% of the time.

**Quick win two: a hard SLA on approvals.** Institute a 4-business-hour SLA (tune it) on every approval step, with automated escalation if an approver does not act. The escalation does not have to be punitive — it can simply notify the next tier up and the deal desk. The point is to make approval latency visible and to give the field a predictable contract: submit a clean approval request and you will have an answer within four hours. Predictability is what kills the exception-email habit, because the exception email exists precisely because the official process is unpredictable.

**Quick win three: kill one or two redundant approval steps.** The diagnosis almost always surfaces a step that adds nothing — a second manager-tier approval that duplicates the first, an approval routing that goes to a role that left the company, a finance step that finance does not actually want. Remove it. One or two surgical deletions of genuinely redundant steps speeds up the workflow and signals that you are willing to subtract, not just add — which matters enormously for the politics of the eventual redesign.

What quick wins are not: they are not the redesign. You are not changing the authority matrix, not rebuilding the Salesforce architecture, not touching comp. You are stabilizing velocity with reversible changes while you do the real design work. The quick wins buy you 60-120 days of organizational goodwill and breathing room.

## The Redesign Principles

When you move into the redesign phase, anchor it to a small set of principles so that every design decision has a test to pass.

**Principle one: tiered authority keyed to discount depth AND deal size.** Two axes, not one. The approval tier a deal requires is a function of both how deep the discount is and how large the deal is, because those two variables together determine the dollar value and strategic risk of the concession.

**Principle two: escalation that is fast.** When a deal exceeds a rep's authority, the escalation must be near-instant and the SLA at every tier must be short and enforced. A tiered matrix with slow escalation is just the bottleneck failure mode with extra steps. Speed is a design requirement, not a nice-to-have.

**Principle three: exceptions that are logged.** There will always be non-standard deals. The redesign does not eliminate exceptions; it ensures every exception is captured in Salesforce with its reason, its terms, and its approver. The exception path is part of the system, not a bypass of it.

**Principle four: the workflow reps actually use.** The ultimate test. A workflow that is bypassed is a failed workflow no matter how rigorous it looks on paper. Every design decision gets tested against "will a rep under quarter-end pressure use this, or route around it?" If the honest answer is "route around it," the design is wrong. Usability is a control feature, because an unused control is not a control.

These four principles — two-axis tiering, fast escalation, logged exceptions, genuine usability — are the spine of the redesign. Everything below them is implementation detail.

## Designing The Discount Authority Matrix

The core deliverable of the redesign is the discount authority matrix: the actual table of who can approve what. Here is an illustrative structure for a typical B2B SaaS org with healthy gross margins — the bands must be tuned to your specific margin structure, average deal size, and segment mix, but the shape generalizes.

**Rep: 0-10%.** The rep has standing authority to discount up to 10% with no approval. Logged, not gated. This covers the routine negotiation room reps need to operate without friction and removes the bulk of approval volume.

**Manager: 10-20%.** Above the rep's authority, the first-line manager approves up to 20%. The manager has the context to judge whether the discount is warranted and the accountability to care.

**RVP: 20-35%.** Deeper discounts escalate to the regional VP. This is where deals start to carry real dollar value and the approver needs both wider context and more skin in the game.

**VP Sales: 35-50%.** Discounts in this band are unusual and should require a real justification. The VP-tier approver is asking "why is this deal structured this way at all?"

**CRO: 50-65%.** At this depth, the CRO personally signs off. These are strategic or distressed deals and the CRO owns the precedent they set.

**CFO/CRO joint: 65%+.** The deepest discounts require joint sign-off from the CRO and CFO, because at this depth the deal is a margin decision as much as a sales decision.

Now overlay the second axis. **Deal size shifts the tiers.** A clean rule: above a deal-size threshold (say, your top quartile of deal value), every discount band escalates one tier higher. A 15% discount that a manager approves on a median deal requires RVP approval on a top-quartile deal. This is how you fix the single-axis flaw — the matrix now distinguishes a 30% giveaway on a $20K deal from a 30% giveaway on a $2M deal, which it must.

The matrix should be a one-page document any rep can read, and it should be the single source of truth that the Salesforce build implements. If the document and the Salesforce logic ever diverge, the document wins and the build gets fixed.

## Building It In Salesforce

Translating the matrix into Salesforce is an architecture decision, and on a modern (2027) org you have clear best practices.

**Flow-based approvals over legacy approval processes and Process Builder.** Salesforce has been steering customers off Process Builder and legacy workflow rules for years; on a current org the redesign should be built with Flow-based approval orchestration. Flow gives you the conditional branching the two-axis matrix requires — evaluating discount depth and deal size together — plus better error handling, better visibility, and a build that the next admin can actually maintain. If you inherited a Process Builder approval, the migration to Flow is part of the redesign, not a separate project.

**The discount field architecture.** This is where inherited orgs are most broken. You need a single, structured, required discount field (or a CPQ-managed discount) that is the only way a discount can be applied. Eliminate the ability to discount via the raw Amount field or via free-text "special terms" fields that the approval logic does not read. The control surface and the discounting surface must be the same object. If a rep can change net price somewhere the approval Flow does not evaluate, the workflow is bypassable by construction.

**The routing logic.** The Flow evaluates discount depth and deal size, looks up the required tier from the matrix, and routes to the named approver for that tier with the SLA timer and auto-escalation attached. Build the fast lane and the exception lane as explicit branches (covered below). Capture the discount reason as a required input on submission — this is what creates the audit trail that fixes failure mode four.

**CPQ approval rules, if you have CPQ.** If the org runs Salesforce CPQ (or Revenue Cloud), the discount governance should live in CPQ's approval rules and discount schedules rather than being bolted onto the opportunity. CPQ is the right control surface because it governs the quote — the actual artifact where price gets set. The redesign then ensures there is no path to a signed deal that bypasses the CPQ quote.

Build it in a sandbox, test it against the last two quarters of real deals (does every historical deal route to the tier the new matrix says it should?), and validate the cycle-time impact before you roll it to production.

## The CPQ Question

A recurring fork in the redesign: what do you do about CPQ?

**If the org has CPQ already**, the redesign's job is usually to finish or fix an implementation that was never completed. The diagnostic tell is failure mode five — reps discounting outside the CPQ control surface. The fix is to use CPQ properly: discount schedules that encode volume-based and segment-based pricing logic, approval rules that implement the authority matrix, and a hard rule that every deal goes through a CPQ quote. CPQ done right is the strongest possible discount governance because the control is structural — the rep literally cannot produce a quote that violates the rules without triggering the approval rule. The work here is configuration discipline and change management, not new tooling.

**If the org does not have CPQ**, the question is whether the inherited mess justifies a CPQ project. The honest answer is: usually not as a first move, and never during the first 180 days. CPQ implementations are expensive, slow, and have a high failure rate; launching one as a brand-new CRO is a way to spend a year and a lot of credibility on infrastructure. The better sequence is to build the redesigned approval workflow natively with Flow first — that solves the immediate governance and velocity problem — and then, once the matrix is stable and you understand the org's pricing complexity, evaluate CPQ as a deliberate, separately-justified project. CPQ should be a decision you make from a position of stability, not a rescue you reach for in a crisis. The exception: if the org's pricing model is genuinely complex (usage-based, multi-product bundles, intricate volume tiers) and the lack of CPQ is the actual root cause of the discount chaos, then CPQ moves up the priority list — but that is a diagnosis you earn through the audit, not an assumption you start with.

## The Deal Desk Decision

Somewhere in the redesign you will face the question: does this org need a deal desk to own the discount workflow?

A deal desk is a dedicated function — one person or a small team — that owns deal structuring, the approval process, non-standard terms, and the discount matrix as a living system. The case for one is strong above a certain scale: a deal desk makes approvals faster (a dedicated owner clears queues), makes them more consistent (one function applying the matrix instead of fifteen RVPs interpreting it), and creates an owner for the quarterly governance cadence so it does not depend on the CRO's personal attention.

The threshold for standing one up is roughly this: if the org is doing enough deal volume that approval routing is a real job, if there is meaningful non-standard-terms complexity (multi-year, custom SLAs, unusual payment terms), and if the alternative is the CRO and VPs personally absorbing approval load — then a deal desk pays for itself. Below that threshold, a part-time owner inside RevOps is enough.

The operator's call: if you inherit an org with no deal desk and the diagnosis shows real volume and complexity, standing one up is often the highest-leverage structural move in the whole redesign, because it creates the owner who keeps the workflow healthy after you have moved on to the next fire. If you inherit an org that already has a deal desk, the question shifts to whether it is functioning — a deal desk that has become a bureaucratic bottleneck is its own failure mode, and the fix may be re-scoping it toward enablement and away from gatekeeping.

## Governance Without Killing Velocity

The central tension of the entire discipline: every control adds friction, and friction kills velocity, and velocity is what the CRO is paid to protect. A discount workflow that is perfectly controlled and slow is a failure. A discount workflow that is perfectly fast and uncontrolled is also a failure. The redesign has to hold both.

The organizing principle that resolves the tension: **a fast lane for clean deals, scrutiny for exceptions.** The vast majority of deals are clean — standard terms, discount within the rep's or manager's authority, nothing unusual. Those deals should move with near-zero friction: auto-approve where the data supports it, a single fast approval step where it does not, an SLA measured in hours. The friction budget — the org's tolerance for process drag — should be spent almost entirely on the small minority of deals that actually carry risk: deep discounts, large deals, non-standard terms, unusual structures. Those deals get real scrutiny, and that scrutiny is affordable precisely because it is not being wasted on the routine 8% discount on a median deal.

This is the design discipline that makes governance compatible with velocity. You are not making every deal slower to control the few risky ones. You are sorting deals by risk and matching the process intensity to the risk. A new CRO who internalizes "fast lane for clean, scrutiny for exceptions" has the principle that makes every other redesign decision fall into place.

## The Exception Process

Exceptions are not the failure of the workflow — an unmanaged exception culture is. Every B2B sales org will have deals that do not fit the standard structure, and the redesign's job is to give those deals a path that is inside the system rather than around it.

The key insight is that exceptions are not only about discount percentage. The inherited exception-email culture usually conflates several different non-standard things: a deep discount, yes, but also non-standard payment terms (annual-up-front waived, quarterly billing, net-90), multi-year commitments with unusual ramp structures, custom SLAs, custom legal terms, unusual cancellation rights. A redesign that only governs discount percentage and leaves all the other non-standard terms to the exception-email channel has fixed half the problem.

So the exception process needs to be a structured path in Salesforce that captures any non-standard term, not just discount depth. When a rep needs something off-standard, they submit an exception request that records what is non-standard, why, the customer context, and routes to the right approver — which for non-discount terms may be finance, legal, or the CRO depending on what is being changed. Every exception is logged with its reason and its approver. This does two things: it kills the exception-email channel by giving it a legitimate in-system replacement, and it builds the data set that lets the quarterly review see what kinds of exceptions the org keeps making — which is often a signal that something in the standard offering needs to change.

## Comp Plan Interaction

Here is the lever most new CROs underweight: **discount behavior is driven by the comp plan more than by the approval workflow.** If a rep is paid on bookings with no margin component and no discount penalty, the rep is economically indifferent to discounting — every point of discount that closes a deal is pure upside to them and pure cost to the company. No approval workflow, however well designed, fully overcomes a comp plan that pays reps to discount.

The CRO must own the alignment between discount policy and comp design, and there are a few standard levers.

**Margin-based or margin-influenced comp.** Tying some portion of commission to deal margin (or to net-of-discount revenue rather than gross bookings) makes the rep share the cost of the discount. Even a partial margin component changes behavior — the rep now has a reason to hold price.

**Discount clawbacks or accelerators.** A comp structure where discounting beyond a threshold reduces the commission rate on that deal, or conversely where holding close to list accelerates it, puts the incentive directly on the behavior you want. The rep feels the discount in their own paycheck.

**Comp-and-policy alignment as a CRO-owned system.** The point is not any single mechanism — it is that the approval workflow and the comp plan have to be designed as one system. A new CRO who redesigns the workflow but leaves a discount-indifferent comp plan in place has built a better fence around a field where the animals have no reason to stay in. This is genuinely the CRO's job and cannot be delegated to RevOps, because comp design touches recruiting, retention, and culture, not just discount control.

A practical sequencing note: you usually cannot change comp mid-year, and you should not try to. But the redesign of the workflow in your first 180 days should be done with the next comp cycle explicitly in view, so that when the comp plan is rewritten it is rewritten to reinforce the workflow rather than fight it.

## Change Management: Rolling Out The New Workflow

The redesign can be technically perfect and still fail at rollout. The field has been trained for years that the official process is to be routed around; you are now asking them to trust a process again. That is a change-management problem, and it has a specific shape.

**Lead with the WIIFM, and the WIIFM is velocity.** The field does not care about margin discipline — that is your problem and finance's problem. What the field cares about is deal speed. So the framing of the rollout is not "we are tightening discount controls"; it is "we are making your deals move faster." And it has to be true: if the redesign genuinely brings the median and 90th-percentile cycle time down — which it should, because the fast lane and the SLAs are designed to — then you can say "submit a clean request in the new system and you get an answer in four hours, guaranteed, instead of the lottery you have today." That is a message reps will actually adopt.

**Enable the managers first.** The first-line managers are the load-bearing layer of any sales process change. Run them through the new matrix, the new Salesforce flow, the SLAs, and the exception process before the reps see it. Give them the answers to the questions their reps will ask. A manager who is confident and bought-in will carry the rollout; a manager who is confused or skeptical will quietly tell their team to keep emailing exceptions.

**Communicate the matrix as clarity, not restriction.** The one-page authority matrix is, framed correctly, a gift to the field — it tells every rep exactly what they can do without asking, which is more clarity than the inherited ad-hoc system ever gave them. "Here is exactly what you can approve yourself, here is exactly how fast the next tier responds, here is exactly how to handle a non-standard deal" is an empowering message if you deliver it as one.

**Stage the rollout.** Do not flip the whole org on a Monday. Pilot the new workflow with one segment or region, validate that cycle time behaves as designed, fix what breaks, then expand. The pilot also produces the proof points — real cycle-time numbers, real rep testimonials — that make the broader rollout credible.

## Measuring The Redesign

A redesign you cannot measure is a redesign you cannot defend, and you will need to defend it — to the board, to finance, to the field. Define the scorecard before launch and report it on a fixed cadence after.

**Cycle time down.** The primary operational metric. Median and 90th-percentile approval cycle time should both fall meaningfully versus the diagnosis baseline. If they do not, the redesign failed on its own velocity promise.

**Average discount down.** The primary financial metric. If the redesigned matrix and the fast-lane/scrutiny split are working, average approved discount should compress — modestly, but visibly — versus the trailing baseline. Watch the distribution shape, not just the mean: the threshold pile-up should soften and the bimodality should shrink.

**End-of-quarter concentration reduced.** The quarter-end cliff should flatten. If the late-quarter discount cohort still looks like a different distribution from the early-quarter cohort, the exception-scrutiny lane is being overridden under pressure and the redesign has a hole.

**Win rate held.** The critical guardrail. The risk of any discount-discipline initiative is that you hold price, lose deals, and trade margin for a worse top line. Win rate (and pipeline conversion) must hold roughly flat through the transition. If win rate drops materially while discount compresses, you have over-corrected and the matrix is too tight.

**Exception-email volume down.** The behavioral metric. The whole premise was that everyone bypasses the workflow via exception email. Track the volume of out-of-system approvals. It should fall toward zero as the in-system exception path proves itself. If it does not, the field still does not trust the new process and you have a rollout problem, not a design problem.

Report these five together. Any one in isolation is misleading — discount down with win rate down is a failure dressed as a success.

## The Quarterly Discount Review Cadence

A redesigned workflow that is not maintained drifts back toward the inherited mess within a year. The maintenance mechanism is a standing quarterly discount review, and it is an operator ritual the CRO either owns personally or assigns to the deal desk with personal attention.

Each quarter, the review pulls the same artifacts the original diagnosis pulled — the discount distribution, the by-rep histogram, the end-of-quarter curve, the cycle-time distribution, the exception log — and asks a fixed set of questions. Is the distribution still healthy, or is threshold pile-up creeping back? Is any rep or region drifting? Are cycle times holding? What categories of exception are recurring, and do they signal a needed change to the standard offering or the matrix itself? Is the matrix still correctly tuned, given any changes in average deal size, segment mix, or competitive pressure?

The review produces decisions: a matrix band gets retuned, a rep gets coached, a recurring exception type gets promoted into the standard process, an SLA gets tightened. The cadence is the difference between a redesign that is a one-time event and a discount governance system that compounds. It is also the mechanism that catches drift early — discount discipline does not collapse overnight; it erodes a quarter at a time, and a quarterly review is the cadence that matches the erosion rate.

## Board And Finance Reporting

The CRO has to report discount discipline upward, and the audience — board, CEO, CFO — does not want the operational detail. They want the narrative and the few metrics that carry it.

The narrative is a margin-and-predictability story. Discount discipline is not, to the board, about controlling reps; it is about protecting gross margin, making the forecast more reliable (because deals are not subject to a quarter-end discounting lottery), and demonstrating that the go-to-market engine has operational rigor. Frame it that way.

The metrics that travel upward are a compressed version of the redesign scorecard: average discount trend (quarter over quarter), gross margin impact (the dollar value of discount compression), approval cycle time as evidence of operational health, and win rate as the guardrail proving the discipline is not costing deals. For the CFO specifically, add the audit-trail story — every discount above a threshold is now logged with a reason and an approver, which is a control-environment improvement finance and auditors care about.

The reporting cadence should align to the board cadence (usually quarterly) and should explicitly connect to the quarterly review — "here is what the Q review found, here is what we retuned, here is the trend." A CRO who reports discount discipline well turns it from a sales-hygiene topic into evidence of operational maturity, which is exactly the reputation a new CRO wants with the board.

## The Political Playbook

The redesign's hardest problems are not technical. They are three recurring political situations, and a new CRO should expect all three.

**The RVP who loves their discount autonomy.** There is always at least one — usually a high-performing, senior RVP who has had wide approval latitude for years, considers it a mark of seniority, and experiences the new matrix as a demotion. The play is not to fight them publicly. It is to bring them into the design — ask them to pressure-test the matrix, give them a real voice in tuning the bands — so the redesign is partly theirs. And it is to anchor the conversation on the data: their region's discount distribution, their cycle times, their exception-email volume. Senior operators respond to evidence. If the evidence shows their autonomy is producing threshold pile-up and margin leak, most will engage with that. The ones who will not are a management problem, not a process problem, and the CRO has to be willing to treat it as one.

**The finance partner who wants to over-control.** Finance's instinct, especially after years of a workflow that did not work, is to add controls — more approval tiers, lower thresholds, finance sign-off on more deals. This is the over-governance trap, and the CRO has to push back, framed correctly. The frame: "Every control we add costs velocity, and velocity is revenue. I will protect margin — that is my job too — but I will protect it with a smart matrix and good comp alignment, not with a process so heavy the field routes around it again. The last workflow failed because it was bypassed, and adding more weight makes bypass more likely, not less." Give finance what they actually need — the audit trail, the deep-discount sign-off, the quarterly review with real numbers — and hold the line on routine-deal velocity.

**The CEO who discounts strategic deals personally.** On many orgs, especially founder-led ones, the CEO still personally approves or even initiates deep discounts on "strategic" logos, entirely outside any workflow. This is the most delicate one because you cannot matrix the CEO. The play is not to stop it — it is to channel it. Get the CEO to agree that even CEO-blessed strategic deals get logged in the system with the strategic rationale, so they are visible, auditable, and not setting invisible precedent. And get an explicit agreement on what "strategic" means and roughly how many such deals per year are acceptable, so it stays an exception rather than becoming a parallel discount regime. A CEO who discounts ten "strategic" deals a quarter is not running a strategic exception; they are the org's biggest discount-discipline problem, and the CRO has to be able to have that conversation.

## 5 Real-World Scenarios

**Scenario one: inheriting a flat, no-control workflow.** The new CRO finds essentially no real governance — one threshold, manager rubber-stamps everything, discounts uniformly deep, no audit trail. Here the diagnosis is fast and the redesign is greenfield: build the tiered matrix, install the Salesforce Flow, add the audit trail, and the early win is dramatic because there was no real control to disrupt. The risk is over-correcting — going from no control to a heavy matrix and tanking velocity and morale. Stage it, lead with the fast lane, and let the field feel that the new system is faster for clean deals before they feel that it is stricter for deep ones.

**Scenario two: inheriting a bureaucratic bottleneck.** The opposite. The workflow is rigorous, slow, multi-tiered, and the org has built an entire shadow exception-email economy around it. The diagnosis shows brutal cycle times and a huge exception-email-to-in-system ratio. Here the redesign is mostly subtraction: auto-approve thresholds, killed redundant steps, hard SLAs, a real fast lane. The matrix may not need to change much — the routing speed does. The political work is with finance, who built the bureaucracy and will resist its removal; the data on slipped deals is the lever.

**Scenario three: inheriting a CPQ nobody configured right.** The org has Salesforce CPQ, but reps discount around it via the Amount field, the approval rules are half-built, the discount schedules are stubs. The diagnosis is failure mode five. The redesign is a CPQ completion project — but the CRO must resist scope creep into a full reimplementation. Finish the approval rules, lock the discounting surface to the CPQ quote, configure the schedules to the matrix, and validate. This is a 90-180 day configuration-discipline project, not a new platform initiative, and keeping it scoped is the operator's main job.

**Scenario four: a post-merger two-workflow mess.** The org acquired a company (or was merged) and now runs two discount approval workflows — two matrices, two Salesforce configurations, sometimes two orgs entirely — with reps and managers from each side operating by their old rules. The diagnosis has to be done twice and then reconciled. The redesign's hardest part is choosing one matrix (or a deliberately designed third one) and managing the change for the side that loses its familiar process. This is mostly a change-management and politics problem; the Salesforce build is the easy part. Sequencing matters — stabilize both workflows with quick wins first, then unify, rather than trying to merge under fire.

**Scenario five: the founder still approves everything.** A founder-led org where the founder-CEO personally approves every meaningful discount, regardless of any nominal workflow. The official Salesforce process is theater. The diagnosis is really an organizational-design diagnosis, and the redesign is as much about getting the founder to delegate as it is about Salesforce. The play: build the matrix, show the founder the data on how much of their time the current pattern consumes and how it bottlenecks deals, and get them to agree to a tier where they stay involved (genuinely strategic deals, logged) while delegating the rest. The founder is the stakeholder, the bottleneck, and the change-management target all at once — and the CRO's ability to have that conversation is the whole job.

## The Decision Framework

The operator sequence, compressed into a single repeatable framework:

**Audit findings.** Pull the six artifacts. Read the distribution. Name the two or three failure modes you actually have. Map the stakeholders. Quantify the cycle-time cost. Resist every urge to act during this phase.

**Stabilize with quick wins.** Auto-approve thresholds, hard SLAs, kill redundant steps. Reversible, obviously-good, velocity-restoring. Buy the political capital and the breathing room.

**Redesign the matrix.** Two axes — discount depth and deal size. Tiered authority tuned to your margin structure. Fast escalation, logged exceptions, genuine usability as a design requirement.

**Build in Salesforce.** Flow-based approvals, a single locked discounting surface, routing logic that implements the matrix, CPQ approval rules if CPQ exists. Test against historical deals in a sandbox.

**Roll out.** Enable managers first, lead with the velocity WIIFM, stage the rollout, produce proof points from a pilot.

**Govern.** Quarterly discount review, comp-plan alignment in view of the next cycle, board/finance reporting framed as a margin-and-predictability story.

The sequence is the playbook. A new CRO who runs it in order — and who is honest enough during the audit to consider that the workflow might not be the problem at all — will fix the discount workflow without breaking the revenue engine in the process.

## 5-Year Outlook

The discount approval workflow of 2032 looks materially different from the one a CRO inherits in 2027, and the redesign should be built with the trajectory in view.

**AI-assisted deal desk.** The deal desk function is being augmented by AI that can pre-score an approval request — flagging precedent risk, surfacing comparable historical deals, checking the discount against segment norms, and routing with a recommendation. The human approver still decides, but the AI does the analytical legwork that makes the decision fast and consistent. A CRO redesigning the workflow now should structure the Salesforce data — clean discount fields, logged reasons, structured exceptions — specifically so that this layer can be added later. The audit trail you build for governance is also the training data for the AI deal desk.

**Automated discount-risk scoring.** Beyond per-deal scoring, the trajectory is toward continuous, automated monitoring of the discount distribution — the quarterly review becoming a real-time dashboard that flags threshold pile-up, rep drift, and end-of-quarter concentration as they emerge rather than a quarter later. The drift the quarterly cadence catches today will be caught by an alert tomorrow.

**Agentforce in the approval flow.** Salesforce's agentic layer (Agentforce and its successors) is moving toward agents that can handle the routine tier of approvals end to end — evaluating a clean, in-policy discount request, checking it against the matrix and recent precedent, and approving or escalating without a human in the loop, while every genuinely judgment-dependent deal still routes to a person. The fast lane becomes an agent; the scrutiny lane stays human. A workflow architected today with a clean matrix, a locked discounting surface, and a structured exception path is exactly the workflow that can absorb an approval agent later. A workflow held together by exception emails and manual Amount-field overrides cannot.

The throughline: the redesign principles that make a workflow good in 2027 — structured data, a clear matrix, logged everything, a fast-lane/scrutiny split — are the same principles that make it AI-ready in 2032. A CRO doing the redesign well is not just fixing today's broken workflow; they are building the substrate for the automated discount governance that is coming.

## Final Framework: The Inherited-Workflow Operator Playbook

The complete playbook for a CRO inheriting a broken Salesforce discount approval workflow:

**The first-90-days plan.** Days 1-30, diagnose: pull the six artifacts, read the distribution for threshold pile-up and bimodality, name your two or three failure modes, map stakeholders, quantify cycle time, touch nothing. Days 30-60, stabilize: auto-approve thresholds, hard SLAs, kill redundant steps — reversible quick wins that restore velocity and buy capital. Days 60-90, design: build the two-axis authority matrix and the Salesforce architecture, validate against historical deals.

**The authority matrix template.** Two axes — discount depth and deal size. Graduated bands from rep standing authority through manager, RVP, VP, CRO, to CFO/CRO joint sign-off, every band tuned to your actual margin structure, with deal size escalating the tier on large deals. One page, single source of truth, the document the Salesforce build implements.

**The build.** Flow-based approvals, not legacy Process Builder. A single locked discounting surface so the control surface and the discounting surface are the same object. Routing logic with fast escalation and enforced SLAs. A structured exception path that captures all non-standard terms, not just discount percentage. CPQ approval rules if CPQ exists; CPQ as a deliberate later project, not a crisis rescue, if it does not.

**The governance cadence.** A quarterly discount review that re-pulls the diagnostic artifacts and produces real decisions. Comp-plan alignment owned by the CRO and timed to the next comp cycle. Board and finance reporting that frames discount discipline as a margin-and-predictability story. A deal desk to own the system if scale and complexity justify it.

**The discipline that ties it together.** Diagnose before you demolish. Fast lane for clean deals, scrutiny for exceptions. Usability is a control feature. The workflow reps actually use is the only workflow that works. And the honesty to consider, throughout the audit, that the workflow might not be the problem at all — that the discount chaos might be a pricing problem, a packaging problem, or a comp problem wearing a workflow costume. The operator who runs this sequence fixes the discount workflow and keeps the revenue engine running while they do it.

`;

const flow = `

## The CRO's First 90 Days: Diagnose, Stabilize, Redesign

\`\`\`mermaid
flowchart TD
  A[New CRO Inherits Broken Discount Workflow] --> B{Instinct: Rip It Out Day One?}
  B -->|No - Correct| C[Phase 1 Days 1-30 Diagnose]
  B -->|Yes - Rookie Mistake| B1[Wastes Political Capital]
  B1 --> B2[May Treat Symptom Not Disease]
  B2 --> C
  C --> C1[Pull Last 4 Quarters Approved Discounts]
  C --> C2[Pull Approval Cycle Time Distribution]
  C --> C3[Pull Discount By Rep Histogram]
  C --> C4[Pull End Of Quarter Concentration Curve]
  C --> C5[Pull Exception Email Log]
  C --> C6[Reverse Engineer Current Authority Matrix]
  C1 --> D[Read The Distribution]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  C6 --> D
  D --> D1{Threshold Pile-Up Plus Bimodality?}
  D1 -->|Yes| D2[Workflow Is A Failed Control]
  D1 -->|No - Uniform Deep Discounts| D3[Maybe A Pricing Or Comp Problem]
  D2 --> E[Name The Failure Modes]
  D3 --> E
  E --> E1[Bottlenecks / Rubber-Stamp / Bypass / No Audit Trail / CPQ Mismatch]
  E1 --> F[Map Stakeholders RevOps Finance RVPs CEO]
  F --> G[Phase 2 Days 30-60 Stabilize]
  G --> G1[Auto-Approve 0-10% Low-Risk Band]
  G --> G2[Hard 4-Hour Approval SLA]
  G --> G3[Kill Redundant Approval Steps]
  G1 --> H[Velocity Restored Capital Banked]
  G2 --> H
  G3 --> H
  H --> I{Workflow Actually The Root Cause?}
  I -->|No| I1[Fix Pricing / Packaging / Comp Instead]
  I -->|Yes| J[Phase 3 Days 60-180 Redesign]
  J --> J1[Design Two-Axis Authority Matrix]
  J1 --> J2[Build In Salesforce Flow Plus CPQ Rules]
  J2 --> J3[Roll Out Managers First Velocity WIIFM]
  J3 --> K[Govern Quarterly Review Plus Comp Alignment]
  K --> L[Board Reporting Margin And Predictability Story]
\`\`\`

## The Redesigned Discount Approval Workflow

\`\`\`mermaid
flowchart TD
  A[Deal Enters Quote Stage] --> B[Discount Applied In Single Locked Field Or CPQ Quote]
  B --> C{Evaluate Two Axes}
  C --> C1[Axis 1 Discount Depth]
  C --> C2[Axis 2 Deal Size]
  C1 --> D[Flow Looks Up Required Authority Tier]
  C2 --> D
  D --> E{Standard Terms And In-Policy Discount?}
  E -->|Yes - Clean Deal| F[Fast Lane]
  E -->|No - Non-Standard| G[Exception Scrutiny Lane]
  F --> F1{Discount Within Rep 0-10%?}
  F1 -->|Yes| F2[Auto-Approve Logged Not Gated]
  F1 -->|No| F3[Single Fast Approval Step 4-Hour SLA]
  F3 --> F4{Approver Acts In SLA?}
  F4 -->|Yes| H[Approved]
  F4 -->|No| F5[Auto-Escalate To Next Tier]
  F5 --> H
  G --> G1[Capture Reason Payment Terms Multi-Year Custom SLA]
  G1 --> G2[Route To Tier Manager RVP VP CRO CFO By Matrix]
  G2 --> G3{Deal Size Above Top Quartile?}
  G3 -->|Yes| G4[Escalate One Tier Higher]
  G3 -->|No| G5[Route To Matrix Tier]
  G4 --> G6[Approver Reviews With Full Context]
  G5 --> G6
  G6 --> G7{Approved?}
  G7 -->|Yes| H
  G7 -->|No| G8[Escalated Or Rejected With Reason]
  G8 --> G2
  F2 --> I[Logged In Salesforce Audit Trail]
  H --> I
  I --> J[Feeds Quarterly Discount Review]
  J --> K[Matrix Retuned Drift Caught Exceptions Analyzed]
\`\`\`

`;

const src = `

## Sources

1. **Salesforce — Approval Processes and Flow-Based Approvals Documentation** — Native Salesforce approval architecture, the migration from legacy approval processes and Process Builder toward Flow-based approval orchestration. https://help.salesforce.com
2. **Salesforce — Process Builder and Workflow Rules Retirement Guidance** — Salesforce's published roadmap steering customers off Process Builder and legacy workflow rules toward Flow as the supported automation tool.
3. **Salesforce CPQ — Approval Rules, Discount Schedules, and Quote Architecture** — How Salesforce CPQ (and Revenue Cloud) governs discounting at the quote level via approval rules and discount schedules. https://help.salesforce.com
4. **Salesforce — Agentforce Documentation** — Salesforce's agentic AI layer and its trajectory toward handling routine approval and workflow tasks. https://www.salesforce.com/agentforce
5. **Mark Roberge — "The Sales Acceleration Formula"** — HubSpot's first sales leader (CRO 2007-2013) on building data-driven sales processes, comp-plan design, and the relationship between incentives and rep behavior.
6. **Pavilion (formerly Revenue Collective) — New CRO Onboarding and First-90-Days Frameworks** — Operator community resources on the diagnose-stabilize-redesign sequencing for revenue leaders inheriting existing systems.
7. **The First 90 Days, Michael Watkins** — The canonical framework for executive transitions; the diagnose-before-acting discipline applied here to inherited revenue systems.
8. **Salesforce Trailblazer Community — Discount Approval and Deal Desk Threads** — Practitioner discussions of common inherited-workflow failure modes: exception-email bypass, manual Amount-field discounting, and CPQ-vs-manual mismatch.
9. **OpenView Partners / SaaStr — SaaS Pricing, Discounting, and Deal Desk Benchmarks** — Industry data on discount distributions, end-of-quarter concentration, and deal desk thresholds in B2B SaaS.
10. **Salesforce Well-Architected — Automation and Approval Design Patterns** — Salesforce's prescriptive guidance on building maintainable, auditable approval automation.
11. **CFO / RevOps Alliance literature on Discount Governance** — Finance-and-revenue-operations frameworks for balancing margin control against deal velocity.
12. **Forrester / Gartner — CPQ Implementation Success and Failure Rate Research** — Industry analysis of CPQ project risk, cost, and the common failure pattern of incomplete implementations.
13. **Sales Comp Design literature (Alexander Group, SiriusDecisions/Forrester)** — Margin-based comp, discount clawbacks, and the structural relationship between comp design and discounting behavior.
14. **Salesforce — Opportunity and Quote Object Data Model** — The discount-field architecture problem: structured discount fields versus raw Amount-field overrides versus free-text terms fields.
15. **Deal desk operator content (Pavilion, RevOps Co-op, Modern Sales Pros)** — Practitioner guidance on when to stand up a deal desk and how to scope it as enablement rather than gatekeeping.

`;

const num = `

## Numbers

**The Diagnosis Phase (Days 1-30)**
- Discovery audit artifacts to pull first: 6 (approved discounts, cycle-time data, by-rep histogram, EOQ concentration curve, exception-email log, current authority matrix)
- Quarters of approved-discount history to pull: 4 (trailing)
- Recommended action during diagnosis phase: 0 changes — touch nothing
- Exception-email-to-in-system ratio that signals a fully dead workflow: ~40%+ of meaningful discounts approved over email

**Reading The Distribution**
- Healthy histogram shape: log-normal, left-anchored, mode well below average approved discount, no threshold pile-up
- Unhealthy signature 1 — threshold pile-up: fat bar at 19-20% with near-empty 21-25% (when manager threshold is 20%)
- Unhealthy signature 2 — "everyone discounts 20%": low variance around a high mean
- Unhealthy signature 3 — bimodal EOQ spike: late-quarter cohort (last 3 weeks) is a different distribution than the first 10 weeks
- Quarter-end cliff window: final ~72 hours of the quarter

**The Five Inherited Failure Modes**
- Failure mode 1: approval bottlenecks killing velocity (multi-day single-stage waits)
- Failure mode 2: rubber-stamp approvals (near-100% approval rate, near-0% modification rate)
- Failure mode 3: workflow bypassed via exception email
- Failure mode 4: no audit trail (cannot answer "why did this deal get 35%?")
- Failure mode 5: CPQ-vs-manual mismatch (control surface ≠ discounting surface)
- Typical count present simultaneously in a given org: 2-3 of the 5

**Cycle-Time As Health Metric**
- Metrics to track: median, 75th percentile, 90th percentile, and the long tail
- Illustrative failed-trust profile: 6-hour median but 5-day 90th percentile
- Trust is binary: reps route around a process they cannot predict ~100% of the time, not proportionally to its failure rate

**Quick Wins (Days 30-60)**
- Quick win 1: auto-approve low-risk band — typically 0-10% discount depth
- Auto-approve band approval rate on inherited orgs: ~99%+ with near-zero modification (pure latency)
- Quick win 2: hard approval SLA — illustrative 4 business hours, with auto-escalation
- Quick win 3: kill 1-2 genuinely redundant approval steps
- Organizational goodwill / breathing room bought by quick wins: ~60-120 days
- Quick-win criteria: small, reversible, obviously good

**The Discount Authority Matrix (Illustrative — tune to margin structure)**
- Rep: 0-10% standing authority (logged, not gated)
- Manager: 10-20%
- RVP: 20-35%
- VP Sales: 35-50%
- CRO: 50-65%
- CFO/CRO joint sign-off: 65%+
- Second axis — deal size: above top-quartile deal value, every band escalates one tier higher
- Matrix document length: 1 page, single source of truth

**Building In Salesforce**
- Recommended approval architecture (2027): Flow-based approval orchestration
- Deprecated / migrate-away-from: legacy approval processes, Process Builder, workflow rules
- Discounting surface required state: single structured/required discount field OR CPQ-managed — Amount-field and free-text discounting eliminated
- Build/test environment: sandbox, validated against the last ~2 quarters of real deals

**The CPQ Question**
- If CPQ exists: redesign = finish/fix the implementation (configuration discipline)
- If no CPQ: do NOT launch a CPQ project in the first 180 days — build Flow-based approvals first
- CPQ as a project: deliberate, separately justified, from a position of stability
- Exception: complex pricing model (usage-based, multi-product bundles) moves CPQ up the priority list

**The Three-Phase Timeline**
- Phase 1 — Diagnose: days 1-30
- Phase 2 — Stabilize with quick wins: days 30-60
- Phase 3 — Redesign and rebuild: days 60-180
- Design sub-phase: days 60-90
- Full redesign rollout horizon: ~180 days

**Measuring The Redesign — The Five-Metric Scorecard**
- Metric 1: approval cycle time down (median and 90th percentile)
- Metric 2: average discount down (watch distribution shape, not just mean)
- Metric 3: end-of-quarter concentration reduced (cliff flattens)
- Metric 4: win rate held (the critical guardrail)
- Metric 5: exception-email volume down toward zero (the behavioral metric)
- Failure pattern: discount down WITH win rate down = over-correction

**Governance Cadence**
- Discount review frequency: quarterly
- Board reporting cadence: quarterly (aligned to board cadence)
- Comp-plan alignment timing: designed in view of the next comp cycle (not changed mid-year)
- Quarterly review re-pulls: the same 6 diagnostic artifacts

**The Political Playbook — Three Recurring Situations**
- Situation 1: the RVP who loves discount autonomy — bring into design, anchor on their region's data
- Situation 2: the finance partner who wants to over-control — give them the audit trail, hold the line on routine-deal velocity
- Situation 3: the CEO who discounts strategic deals personally — channel not stop; log every strategic deal; cap the count

**The Five Real-World Scenarios**
- Scenario 1: flat no-control workflow — greenfield redesign, risk is over-correcting
- Scenario 2: bureaucratic bottleneck — redesign is mostly subtraction
- Scenario 3: misconfigured CPQ — 90-180 day configuration-discipline project, resist reimplementation scope creep
- Scenario 4: post-merger two-workflow mess — diagnose twice, reconcile, mostly a change-management problem
- Scenario 5: founder still approves everything — organizational-design problem as much as a Salesforce one

`;

const counter = `

## Counter-Case: When The Inherited Workflow Does Not Need A Redesign

The entire playbook above assumes the discount workflow is broken and worth fixing. A disciplined operator has to seriously entertain the possibility that it is not — because the most expensive mistake a new CRO can make here is not running the redesign badly, it is running a redesign that should never have happened.

**Counter 1 — Sometimes the workflow is fine and the real problem is pricing.** The new CRO sees deep discounts everywhere and reaches for the workflow. But pull the distribution carefully: if discounts are uniformly deep across the entire quarter, with no threshold pile-up, no bimodal end-of-quarter spike, and a tight cluster well away from any approval tier — that is not the signature of a broken workflow. That is the signature of a list price that is wrong. Reps are discounting 25% on every deal because the product is genuinely worth list-minus-25% in the market, and the workflow is faithfully approving deals that are correctly priced once you account for the discount. Redesigning the approval matrix here does nothing except add friction to deals that are priced correctly. The fix is a pricing project — re-base list price, fix the price-to-value relationship — and the workflow can stay exactly as it is.

**Counter 2 — Sometimes the real problem is packaging.** A close cousin. If the discounting is concentrated in specific product lines, specific bundles, or specific segments, and reps are discounting because the packaged offering does not match what those buyers actually want, then the discount is the symptom of a packaging mismatch. Buyers are negotiating their way to a price that reflects the value of the subset of the package they care about. No authority matrix fixes that. Repackaging — different bundles, different editions, segment-specific SKUs — fixes that, and again the workflow may be perfectly healthy.

**Counter 3 — Sometimes the real problem is comp.** The deepest version of this. If the comp plan pays reps purely on gross bookings with no margin component and no discount penalty, reps will discount to the maximum the workflow allows, every time, because it is free money to them. The workflow could be beautifully designed and it would not matter — the matrix sets the ceiling and the comp plan guarantees reps hit it. A CRO who redesigns the workflow but leaves the comp plan untouched has rebuilt the fence and left the gate open. The honest diagnosis sometimes is: the workflow is fine, the comp plan is the disease, and the redesign effort should go into the next comp cycle, not into Salesforce Flow.

**Counter 4 — The new CRO's instinct to "fix the workflow" is often change-for-change's-sake.** A newly hired or promoted CRO is under pressure — real or self-imposed — to demonstrate impact. A visible redesign of a "broken" process is a satisfying way to show motion. But motion is not progress. If the audit genuinely shows the workflow is functioning — reasonable cycle times, healthy distribution, low exception-email volume, a real and used authority matrix — then redesigning it is disruption with no upside. It costs the org a quarter of retraining, costs the CRO political capital, and replaces a working system the org understands with a new one it does not. "It was built by the last CRO" is not a reason to change something. "The data shows it is failing" is the only reason.

**Counter 5 — Sometimes the inherited problem is over-governance, and the fix is removing controls, not adding them.** This is the most important counter-case because it inverts the entire playbook's instinct. The standard story is "the workflow is too weak, build a stronger matrix." But a large fraction of inherited workflows are broken in the opposite direction: they are too strong. Too many tiers, thresholds set too low, finance sign-off on routine deals, multi-week cycle times, an approval process so heavy that the exception-email culture is not a discipline failure — it is the organization's rational immune response to a process that would otherwise lose every competitive deal. In this world, the new CRO who "fixes the workflow" by adding rigor is making the actual problem worse. The correct redesign here is mostly subtraction: raise thresholds, collapse tiers, remove finance from routine approvals, install a real fast lane. The matrix gets simpler, not more elaborate. A CRO who walks in assuming every discount workflow needs more control will misdiagnose this entire category of org.

**Counter 6 — The exception-email culture is sometimes a feature, not a bug.** Related to counter 5. Yes, exception emails mean the system of record is incomplete and the audit trail is broken — those are real problems. But the existence of the exception channel sometimes means the org found a pressure valve that keeps deals moving despite a bad process. If you eliminate the exception channel before you have fixed the underlying velocity problem, you do not get discipline — you get stalled deals and a furious field. The exception channel has to be replaced, not just removed, and only after the in-system path is genuinely faster than the email it replaces.

**Counter 7 — Redesign timing can be wrong even when redesign is right.** Sometimes the workflow genuinely is broken and a redesign is genuinely warranted — but not now. If the org is mid-CPQ-migration, mid-Salesforce-org-merge, mid-comp-redesign, or three weeks from the end of the fiscal year, layering a discount-workflow redesign on top is operational malpractice. The right answer can be "yes, this needs fixing, and we will fix it starting next quarter once the org has bandwidth." A new CRO eager to act has to be able to diagnose correctly and then choose to wait.

**Counter 8 — The workflow may be a scapegoat for a sales-execution problem.** Sometimes the field blames the discount workflow for losses that are actually about discovery, qualification, or competitive positioning. Reps who lose deals find it more comfortable to say "the approval process was too slow" than "I did not build enough value to hold price." A CRO who takes the field's workflow complaints at face value and redesigns in response may be optimizing the wrong variable entirely — the deals were not lost to approval latency, they were lost in discovery, and the discount was a desperation move at the end of a deal that was already gone.

**The honest verdict.** The playbook — diagnose, stabilize, redesign, govern — is the right default, but the diagnosis phase has to be genuinely open to the conclusion that the redesign should not happen. The disciplined questions: Is the distribution actually unhealthy, or is it just deep-because-priced-wrong? Is the exception-email volume a discipline failure or an immune response to over-governance? Is the workflow the disease, or is it pricing, packaging, or comp wearing a workflow costume? Is now the right time even if the redesign is right? A new CRO who runs the audit honestly will sometimes conclude the highest-leverage move is to leave the workflow alone and go fix the thing that is actually broken. That conclusion — "I diagnosed it and chose not to redesign it" — is not a failure of nerve. It is the playbook working correctly.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a RevOps function in 2027? (The function that usually owns the discount workflow operationally.)
- **q9502** — How do you build a sales comp plan in 2027? (Comp-plan alignment is the real lever on discounting behavior.)
- **q9504** — What is the operator playbook for a CRO inheriting a broken forecast process? (Companion first-90-days inherited-system playbook.)
- **q9505** — What is the operator playbook for a CRO inheriting a bloated tech stack? (Companion inherited-system diagnostic playbook.)
- **q9510** — How do you stand up a deal desk in 2027? (The deal desk decision covered in this entry, in depth.)
- **q9511** — How do you implement Salesforce CPQ without it failing? (The CPQ question, in depth.)
- **q9512** — How do you run a quarterly business review as a CRO? (Adjacent governance cadence.)
- **q9513** — How does a new CRO build a first-90-days plan? (The diagnose-stabilize-redesign frame, generalized.)
- **q9515** — How do you migrate off Salesforce Process Builder to Flow? (The build-architecture decision in this entry.)
- **q9516** — What is the operator playbook for a CRO inheriting a misaligned sales-and-marketing org? (Companion inherited-system playbook.)
- **q9520** — How do you design a discount policy for a B2B SaaS company? (The pricing-side companion to this workflow-side entry.)
- **q9521** — How do you fix end-of-quarter deal concentration? (The EOQ cliff diagnosed in this entry.)
- **q9522** — How do you build a pricing strategy in 2027? (Counter-case 1: when discounting is really a pricing problem.)
- **q9523** — How do you repackage a B2B SaaS product? (Counter-case 2: when discounting is really a packaging problem.)
- **q9530** — How do you report sales metrics to a board? (Board-and-finance-reporting section, in depth.)
- **q9531** — How does a CRO build a relationship with the CFO? (The finance-partner stakeholder dynamic.)
- **q9540** — How do you run sales change management? (The rollout section, in depth.)
- **q9550** — What is Agentforce and how will it change RevOps? (The 5-year-outlook section, in depth.)
- **q9551** — How will AI change the deal desk by 2030? (AI-assisted deal desk trajectory.)
- **q9560** — How does a newly promoted internal CRO differ from an external hire? (Stakeholder-politics nuance for the inherited-workflow situation.)

`;

const tags = ['cro-playbook','salesforce','discount-approval-workflow','deal-desk','revenue-operations','cpq','first-90-days','sales-comp','discount-governance','2027'];

const sources = [
  { title: 'Salesforce — Approval Processes and Flow-Based Approvals Documentation', url: 'https://help.salesforce.com' },
  { title: 'Mark Roberge — The Sales Acceleration Formula', url: 'https://www.markroberge.com' },
  { title: 'Michael Watkins — The First 90 Days', url: 'https://hbr.org/books/watkins' }
];

const notes = {
  s6: 'Added 15 cited sources: Salesforce approval-process / Flow / CPQ / Agentforce documentation, Process Builder retirement guidance, Mark Roberge (HubSpot CRO 2007-2013) on comp-and-behavior, Pavilion new-CRO frameworks, Michael Watkins First 90 Days, Salesforce Trailblazer Community discount-approval threads, OpenView/SaaStr discounting benchmarks, Salesforce Well-Architected automation patterns, Forrester/Gartner CPQ failure-rate research, and sales-comp design literature.',
  s7: 'Added comprehensive numerical analysis: the 6-artifact discovery audit, the 3 unhealthy-distribution signatures, the 5 inherited failure modes (and the 2-3-simultaneous typical count), cycle-time health-metric thresholds, the 3 quick wins with the ~99% auto-approve-band approval rate, the illustrative discount authority matrix (rep 0-10% through CFO/CRO joint 65%+ with deal-size second axis), the Flow-based build architecture, the CPQ-question decision rules, the three-phase 1-30 / 30-60 / 60-180 day timeline, the 5-metric redesign scorecard, the quarterly governance cadence, the 3-situation political playbook, and the 5 real-world scenarios.',
  s8: 'Added 8-element counter-case: when the workflow is fine and the real problem is pricing (uniform deep discounts with no threshold pile-up), packaging (concentration in specific lines/segments), or comp (bookings-only plan with no margin component); when "fix the workflow" is change-for-change-sake; when the inherited problem is OVER-governance and the fix is removing controls not adding them; when the exception-email culture is an immune response not a discipline failure; when redesign is right but the timing is wrong; and when the workflow is a scapegoat for a sales-execution problem.',
  s9: 'Cross-linked 20 related Pulse entries: RevOps / comp foundations (q9501/q9502), companion first-90-days inherited-system playbooks (q9504/q9505/q9513/q9516), deal desk and CPQ deep dives (q9510/q9511/q9515), governance and QBR (q9512/q9530), pricing- and packaging-side counter-case entries (q9520/q9521/q9522/q9523), stakeholder dynamics (q9531/q9560), change management (q9540), and the AI/Agentforce outlook (q9550/q9551).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the operator playbook for a CRO inheriting a bypassed Salesforce discount approval workflow. Two mermaid diagrams (the CRO first-90-days diagnose-stabilize-redesign sequence with decision gates; the redesigned two-axis discount approval workflow with fast-lane / exception-scrutiny split). Full coverage: the diagnose-before-demolish frame, the 6-artifact discovery audit, reading healthy-vs-unhealthy discount distributions (threshold pile-up, everyone-discounts-20%, bimodal EOQ spike), the 5 inherited failure modes, assessing the inherited authority matrix, cycle-time as health metric, the stakeholder map, the 3 quick wins, the redesign principles, the illustrative two-axis discount authority matrix, building it in Salesforce (Flow over Process Builder, locked discounting surface, CPQ approval rules), the CPQ question, the deal desk decision, governance-without-killing-velocity (fast lane for clean / scrutiny for exceptions), the structured exception process, comp-plan interaction, change management, the 5-metric redesign scorecard, the quarterly review cadence, board and finance reporting, the 3-situation political playbook, 5 real-world scenarios, the decision framework, the 5-year outlook (AI-assisted deal desk, automated discount-risk scoring, Agentforce in the approval flow), and an 8-element counter-case (pricing/packaging/comp as the real problem, change-for-change-sake, over-governance as the inherited disease, exception-email-as-immune-response, wrong timing, workflow-as-scapegoat).'
};

runPolish({ id: 'q9514', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
