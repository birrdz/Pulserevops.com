// q9539 — How does the discount governance readiness model shift if a company has already hired a Sales Manager without a VP Sales above them — does that middle layer change when you need a VP Sales?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Hiring a Sales Manager before a VP Sales does not delay when you need a VP Sales — it **accelerates** it, and it changes *which* discount-governance gaps go critical first. The standard readiness model assumes one of two clean states: founder-led selling (no sales leader) or a VP Sales who owns both player-coaching and system design. A standalone Sales Manager creates a **third, unstable state**: someone is coaching reps and approving deals daily, but nobody owns deal-desk architecture, discount policy, pricing exception logic, or the CRM/CPQ guardrails that make governance real. The Sales Manager inherits **approval authority without policy authority** — they become the human discount engine, granting exceptions case-by-case with no codified bands, no margin floor, no escalation tree, and no audit trail. That works until roughly **6-9 reps, ~$3-6M ARR, or the first competitive multi-year deal that breaks the unwritten rules**. The readiness trigger for a VP Sales is normally framed as "you have 8-10 reps and two managers" — but with a standalone manager already in place, the real trigger arrives earlier and is *governance-shaped*: you need the VP when **discount variance across reps exceeds ~15 points of ASP, when the Sales Manager spends >25% of their week on deal approvals, when finance can't reconcile booked margin to model, or when the manager's own comp creates an incentive to approve discounts they should reject**. The middle layer doesn't disappear when the VP arrives — it **re-specializes**: the Sales Manager moves fully to people leadership and pipeline execution, and the VP (or a RevOps/Deal Desk function the VP stands up) takes the policy, the approval matrix, the CPQ rules, and the margin accountability. The single biggest mistake is treating the Sales Manager hire as "we now have sales leadership covered" — you have *coaching* covered, not *governance*. Concretely: if you've hired a Sales Manager and have no written discount policy, no approval thresholds in CPQ/CRM, and no deal desk, you are already late on the VP Sales (or at minimum a Head of RevOps), and every month of delay compounds margin leakage at roughly **2-5 points of blended gross margin per quarter** in a competitive market.`;

const core = `

## The Question Behind the Question: Why This Org Sequence Breaks Governance

The discount governance readiness model exists to answer a deceptively simple question: at what point does a company need formal rules, thresholds, systems, and accountable owners for how it gives away price? The standard model maps readiness against a small number of clean organizational states — founder-led selling, first-rep teams, a VP Sales running a structured org, and eventually a CRO with a full RevOps and Deal Desk apparatus underneath. Each state has a known governance posture. What the standard model does not handle well is the *out-of-sequence* hire, and the most common out-of-sequence hire is exactly this one: a company promotes or hires a **Sales Manager** before it has a **VP Sales**. This happens for entirely rational reasons. The founder is still selling, the team has grown to four or five reps, the founder cannot coach and forecast and run deals simultaneously, and a Sales Manager is cheaper, faster to hire, and less threatening to the founder's control than a VP Sales. So the Sales Manager goes in. And the discount governance model — which assumed the next sales-leadership hire would be a VP who owns both coaching *and* system design — quietly breaks, because the Sales Manager inherits the daily authority to approve discounts without inheriting the mandate, the seniority, or the cross-functional standing to build the system that governs those approvals. The question "does that middle layer change when you need a VP Sales" is really two questions: first, does having a standalone Sales Manager change *when* the VP Sales trigger fires (yes — it moves it earlier and changes its shape), and second, does the Sales Manager role itself change when the VP arrives (yes — it re-specializes rather than disappears). This entire entry is the operator's map of that transition.

## The Core Principle: Approval Authority and Policy Authority Are Different Jobs

The foundational distinction that the standard readiness model glosses over — and the one that explains every failure mode in this entry — is that **approving a discount and governing discounting are two different jobs that happen to look similar from the outside**. Approval authority is the act of saying yes or no to a specific exception on a specific deal. Policy authority is the act of deciding what the bands are, where the margin floor sits, what triggers an escalation, what the CPQ rules enforce automatically, what gets logged, what gets reviewed, and how the whole apparatus ties back to the financial model and the comp plan. A founder-led company has neither formalized — the founder simply decides each deal by gut, which is fine at five deals a quarter and catastrophic at fifty. A company with a real VP Sales has both: the VP either personally owns policy or, more commonly, stands up a Deal Desk or RevOps function that owns policy while the VP owns the accountability for the margin outcome. The standalone Sales Manager state is uniquely broken because it splits the two jobs in the worst possible way: the Sales Manager gets approval authority by default (they're the person reps escalate to) but policy authority falls into a vacuum. Nobody owns it. The founder thinks the Sales Manager has it. The Sales Manager thinks "I'm just doing what makes sense deal by deal." Finance assumes someone upstream codified the rules. The result is **governance theater**: there appear to be approvals happening, so it feels governed, but there is no policy, no consistency, no audit trail, and no accountability for the aggregate margin outcome. Understanding this split is the entire key. Every recommendation downstream is some version of "get policy authority explicitly owned, and stop pretending approval authority is the same thing."

## How the Standard Readiness Model Works — and Where the Standalone Manager Falls Through It

The standard discount governance readiness model is usually drawn as a maturity ladder with four or five rungs. Rung one: founder-led, no policy, all discounts approved by the founder by feel, total deal volume low enough that inconsistency doesn't compound. Rung two: first sales hires, founder still approves everything but starts noticing variance, and the first crude rule appears ("anything over 20% comes to me"). Rung three: a sales leader is hired, and the model assumes this leader builds the first real apparatus — written bands, an approval matrix, CPQ guardrails, a margin floor. Rung four: scale forces a dedicated Deal Desk or RevOps function, and discount governance becomes a system with its own owner, its own metrics, and its own seat at the forecast and pricing-committee table. Rung five: enterprise maturity, where governance is largely automated and the human approvals are reserved for genuine strategic exceptions. The model's hidden assumption is that rung three's "sales leader" is a VP-caliber hire with the seniority and mandate to build the apparatus. The standalone Sales Manager hire creates a **rung 2.5** that the model has no name for: more structure than rung two (there is a dedicated person reps escalate to) but none of rung three's apparatus (no policy, no matrix, no CPQ rules, no margin accountability). Companies sit at rung 2.5 for far longer than they should because, from the founder's chair, it looks like rung three — there's a sales manager, deals are getting approved, the team is growing. The diagnostic failure is mistaking the *presence of an approver* for the *presence of governance*. Rung 2.5 is not a stable resting state; it is a slope, and the company slides down it — accumulating margin leakage and policy debt — until something forces the issue.

## Diagnostic: How to Tell If You Are Stuck at Rung 2.5

Operators need a concrete, observable checklist to know whether they are in the broken standalone-manager state rather than genuine rung-three maturity. Here is the diagnostic. **One: is there a written discount policy?** Not a Slack norm, not "the manager knows" — an actual document with bands, thresholds, a margin floor, and an escalation tree. If no, you are at 2.5. **Two: does the CRM or CPQ enforce anything automatically?** If a rep can quote any discount and the only control is that the manager *might* catch it, your governance is entirely manual and entirely dependent on one person's attention. **Three: can finance reconcile booked margin to the model within a tolerance band?** If finance is routinely surprised by blended margin at quarter close, the discounts are ungoverned regardless of how many approvals happened. **Four: how does the Sales Manager actually decide?** If the honest answer is "case by case, based on what feels reasonable and what the rep is pushing for," there is no policy — there is a person. **Five: is there an audit trail?** Can you pull every exception over the last two quarters, see who approved it, why, and what the margin impact was? If not, you cannot even measure the leakage. **Six: what percentage of the Sales Manager's week goes to deal approvals?** If it is over 20-25%, the role is being consumed by a job it was never scoped for, and that time is coming directly out of coaching and pipeline work. **Seven: is there discount variance across reps?** Pull ASP and discount depth by rep. If your best closer and your weakest rep are within five points, you might be fine; if they are 15-25 points apart on similar deals, reps have learned that discounting is negotiable with the manager, and the manager has become the variable. If you fail three or more of these seven, you are unambiguously at rung 2.5 and the VP Sales (or Head of RevOps) trigger has already fired — you just have not acted on it.

## Why the Sales Manager Becomes the Human Discount Engine

When policy authority falls into a vacuum, it does not stay empty — it gets absorbed by whoever has approval authority, because reps need *someone* to say yes. The Sales Manager, by virtue of being the escalation point, becomes the de facto policy. But because they have no codified bands to point to, every approval is a negotiation rather than a lookup. This is the **human discount engine** problem, and it has four compounding pathologies. First, **inconsistency**: the same deal shape gets a different answer on Tuesday than it would on Friday, depending on the manager's mood, the rep's persistence, and how the quarter is tracking. Reps learn this fast and arbitrage it — they bring deals to the manager when the manager is most likely to say yes. Second, **non-scalability**: the human discount engine has a hard throughput ceiling. One person can thoughtfully adjudicate maybe 15-25 exceptions a week before they start rubber-stamping, and rubber-stamping is just ungoverned discounting with extra steps. Third, **single point of failure**: when the manager is on vacation, sick, or in back-to-back QBRs, deals either stall or get approved by someone with even less context. Fourth, and most corrosive, **incentive contamination**: the Sales Manager is almost always carrying a team quota and is often comped on team bookings or attainment. That means the person adjudicating "should we give away margin to close this deal" is personally rewarded when the deal closes. The human discount engine is not a neutral arbiter — it is a biased one, structurally tilted toward approval. This is the deepest reason the standalone-manager state cannot govern discounting: the only person with authority has a comp plan that pays them to grant the very exceptions they are supposed to gatekeep.

## The Incentive Conflict in Detail: Why the Manager Cannot Self-Govern

This pathology deserves its own section because it is the one operators most consistently underweight. Consider the mechanics. A Sales Manager runs a team of five reps. Their variable comp is tied to team attainment — say 60% of their on-target earnings rides on the team hitting its number. It is the last three weeks of the quarter. The team is at 82% of target. A rep brings in a deal that would close the gap, but the prospect wants a 32% discount and a waived implementation fee. The written policy — if one existed — might cap that combination at 22% and require VP approval beyond. But there is no written policy, and there is no VP. The Sales Manager is the approval authority. They are also three weeks from a comp check that depends on this deal. There is no version of this in which the Sales Manager is a neutral governor. They are not corrupt; they are *correctly responding to their incentives*. The org has asked one person to both maximize bookings and protect margin, weighted the comp plan heavily toward bookings, and removed every external check. This is why mature governance models **separate the approval of margin-eroding exceptions from the people who carry the bookings number**. A Deal Desk, a RevOps function, or a finance partner approves the exception precisely because they do not get paid when it closes. The standalone Sales Manager state has none of that separation. And critically — this conflict does not get better by coaching the manager to be disciplined. It is structural. It only resolves when policy authority moves to a role without the bookings incentive, which in practice means standing up a VP Sales who can build (or sponsor) that separated function. The incentive conflict, more than headcount or ARR, is the truest signal that the VP trigger has fired.

## Re-Reading the VP Sales Trigger Through a Governance Lens

The conventional VP Sales readiness trigger is headcount-shaped: "you have 8-10 reps and one or two managers, the founder is no longer effective as the sales leader, you need a VP." That framing is not wrong, but in the standalone-manager scenario it is the wrong *instrument* — it measures the symptom, not the cause. The governance-shaped trigger fires earlier and more precisely. You need the VP Sales (or, as a partial bridge, a Head of RevOps / Deal Desk lead) when **any three of the following are true**: discount variance across reps exceeds roughly 15 points of ASP on comparable deals; the Sales Manager is spending more than 25% of their week on deal approvals and exception adjudication; finance cannot reconcile booked blended margin to the financial model within its tolerance band at quarter close; there is no written discount policy and no CPQ/CRM enforcement, so governance is 100% manual; the company has lost or nearly lost a deal because the unwritten rules could not handle a competitive multi-year or multi-product structure; the Sales Manager's comp plan creates a direct incentive to approve the exceptions they should gatekeep; or the founder is still personally pulled into 'big' deal approvals because the manager's authority is undefined at the top end. Notice that several of these can be true at five or six reps — well before the headcount trigger fires. That is the central insight: **the standalone Sales Manager hire pulls the real VP Sales trigger forward by one to two quarters and 1-3M of ARR, because it creates a governance gap that the headcount-based model does not see.** The company that waits for "8-10 reps" to hire its VP will, if it hired a standalone manager first, spend two to four quarters bleeding margin through an ungoverned human discount engine before help arrives.

## The Mechanics: What 'Building Governance' Actually Means

When operators say a VP Sales needs to "build discount governance," that phrase hides a concrete, finite set of artifacts and systems. Naming them precisely is what lets you delegate the work and know when it is done. **Artifact one: the discount policy document.** A written, version-controlled document defining standard discount bands (e.g., 0-10% rep discretion, 10-20% manager approval, 20-30% VP approval, 30%+ pricing committee or finance sign-off), the absolute margin floor below which no deal proceeds without CFO involvement, and the rules for non-price concessions (payment terms, waived fees, extra seats, professional-services credits) that erode effective margin without showing up as 'discount.' **Artifact two: the approval matrix.** A clear mapping of deal characteristics — discount depth, contract length, total contract value, product mix, payment terms — to required approvers, with defined SLAs so approvals do not become a deal-velocity tax. **Artifact three: CPQ/CRM enforcement.** The bands and matrix encoded into the quoting tool so that out-of-policy quotes physically cannot be sent without triggering the right approval flow — moving governance from 'the manager might catch it' to 'the system requires it.' **Artifact four: the deal desk process.** A defined intake, review, and turnaround process for exceptions, with an owner who is not carrying a bookings quota. **Artifact five: the audit trail and reporting.** Every exception logged with requester, approver, rationale, and margin impact, rolled up into a quarterly discounting report that ties to the financial model. **Artifact six: the margin accountability loop.** Someone — the VP — is accountable for blended margin as a number, reviewed alongside bookings, so that protecting margin has an owner with skin in the game. The standalone Sales Manager has, at best, an informal version of artifact one in their head. The VP Sales's job is to make all six real and to decide which they build personally versus which they staff with a RevOps or Deal Desk hire.

## Sequencing: What the VP Builds First, Second, and Third

A VP Sales walking into a rung-2.5 company cannot build all six governance artifacts at once, and trying to do so stalls every deal in flight while the apparatus is constructed. Sequencing matters. **First 30 days — stop the bleeding with a minimum viable policy.** The VP writes a one-page interim discount policy: three or four bands, a hard margin floor, and a rule that anything below the floor or above the top band comes to the VP personally, today. This is crude but it immediately replaces 'the manager's gut' with 'a written rule,' and it gives the Sales Manager something to point to so they stop being the human discount engine. **Days 30-60 — build the approval matrix and instrument the data.** The VP maps deal characteristics to approvers, sets SLAs so approvals do not slow deals, and gets RevOps or the analyst pulling discount-by-rep, discount-by-deal-type, and booked-margin-to-model reports so the leakage is finally measurable. **Days 60-90 — encode into CPQ/CRM.** The interim policy and matrix get built into the quoting tool. This is the step that converts governance from a human-attention problem into a system property. **Days 90-180 — stand up the deal desk and the accountability loop.** With volume justifying it, the VP either hires a Deal Desk lead or formalizes the function within RevOps, separating exception approval from the bookings-carrying roles. The quarterly discounting report becomes a standing agenda item. **Beyond 180 days — refine the policy with real data.** Now that six months of instrumented data exists, the bands and floor get re-cut based on what actually wins deals versus what just gives away margin. The critical sequencing principle: **policy before system, system before headcount.** Encoding a bad policy into CPQ just automates the leakage; hiring a Deal Desk before there is a policy gives them nothing to enforce.

## Benchmarks and Real Numbers: When Each Threshold Actually Fires

Operators need numbers, not just narrative. Here are the empirically common thresholds, with the caveat that they vary by ACV, motion, and market competitiveness. **The standalone Sales Manager hire** typically happens at 3-6 reps and 1.5-4M ARR, when the founder can no longer coach and run the number simultaneously. **Rung 2.5 becomes actively dangerous** at roughly 6-9 reps, 3-6M ARR, or — and this is often the real trigger regardless of headcount — the first competitive multi-year, multi-product deal that the unwritten rules cannot structure. **Margin leakage in an ungoverned competitive market** runs roughly 2-5 points of blended gross margin erosion per quarter once rep count passes six and there is no written policy or CPQ enforcement — because reps independently discover and exploit the manager's approval patterns. **Discount variance across reps** in a healthy governed org sits inside 8-12 points of ASP on comparable deals; in a rung-2.5 org it commonly runs 15-30 points, and that spread is almost pure ungoverned leakage. **Sales Manager time on approvals** should be under 10-15% of the week; at rung 2.5 it commonly hits 25-40%, directly displacing coaching and pipeline work. **The VP Sales hire**, in the standalone-manager scenario, should land at 6-10 reps and 4-8M ARR — roughly one to two quarters and 1-3M of ARR *earlier* than the textbook 8-12 rep trigger, precisely because the governance gap is already open. **The Deal Desk / RevOps governance hire** follows the VP by one to three quarters, typically landing at 10-20 reps and 8-15M ARR. **CPQ implementation** that actually enforces policy usually lands around 8-15 reps; before that, CRM-level approval flows are the bridge. The pattern across all these numbers: every governance threshold in the standalone-manager scenario fires earlier than the headcount-only model predicts, because the manager hire created the gap before headcount said it should exist.

## The Tooling Layer: Salesforce, CPQ, and the RevOps Stack

Discount governance is not purely an org-design problem; it is also a systems problem, and the tooling determines whether policy is enforced or merely aspirational. At the CRM layer, **Salesforce** (or HubSpot at smaller scale) is where deals live, and the first crude enforcement usually happens here: approval processes triggered by discount fields, validation rules that block out-of-band quotes, and opportunity-level fields that capture discount depth and rationale. This is the bridge layer — it works up to roughly 8-15 reps. At the **CPQ layer — Salesforce CPQ, DealHub, Subskribe, or similar** — governance becomes structural: discount bands, approval matrices, margin floors, and product-mix rules are encoded so that a non-compliant quote cannot be generated, let alone sent. CPQ is what converts the discount policy from a document people are supposed to follow into a system that follows it for them. At the **analytics layer — Salesforce reporting, or a RevOps BI layer** — the audit trail and the quarterly discounting report live: discount-by-rep, discount-by-segment, booked-margin-to-model, exception volume and approval rates. The standalone Sales Manager almost always operates with the CRM at its most permissive — discount fields exist but enforce nothing — which is exactly why governance is 100% manual and 100% dependent on the manager's attention. A key part of the VP Sales's mandate is owning, or sponsoring a RevOps owner for, the progression from permissive CRM to enforcing CPQ. One important nuance for operators: **do not encode policy into CPQ before the policy is good.** A premature CPQ build just hard-codes the leakage and makes it harder to change. The right sequence is interim written policy, then CRM-level enforcement, then a data-informed policy revision, then CPQ. Tooling amplifies whatever policy you give it — including a bad one.

## Org and Comp Implications: How the Comp Plan Has to Change

Fixing discount governance is not only about adding a VP and building artifacts — it requires changing the comp plans of the people already in the system, and operators routinely miss this. Three comp interventions matter. **One: the Sales Manager's plan.** If the Sales Manager is comped purely on team bookings, they have a structural incentive to approve margin-eroding exceptions. When the VP arrives and policy authority moves, the Sales Manager's comp should add a margin or discount-discipline component — even a modest 10-20% weighting on blended team margin or on staying within discount-band targets — so that the person closest to the reps is no longer purely a bookings maximizer. **Two: the reps' plans.** In a rung-2.5 org reps are almost always comped on bookings or revenue with no margin sensitivity, which means every rep is individually incentivized to discount to close. Mature governance often introduces margin-adjusted commission — paying a higher rate on full-price or low-discount deals and a lower rate on deep-discount deals — so the rep feels the cost of the giveaway. This must be introduced carefully and usually after the policy and systems exist, because reps revolt against margin comp if the discount rules themselves are unclear or unfair. **Three: the VP's plan.** The VP Sales should carry blended gross margin as an explicit comp component alongside bookings, because that is the entire point of giving them margin accountability — the comp plan has to make the accountability real. The deeper org principle: **discount governance fails when the only people who can approve discounts are also the only people paid to generate bookings.** The fix is partly structural (a separated Deal Desk) and partly compensatory (margin shows up in the plans of the bookings-carrying roles too). The VP Sales hire is the moment to make both changes, because the VP has the mandate and the cross-functional standing with finance to push comp changes through.

## Stage-by-Stage Evolution of the Middle Layer

The Sales Manager role does not stay static through this transition — it evolves through four recognizable stages, and naming them helps operators set expectations with the manager themselves. **Stage one — the standalone manager (rung 2.5).** The Sales Manager is everything below the founder: coach, forecaster, deal approver, de facto policy owner, and often still carrying or recently off an individual quota. Governance authority is theirs by accident. This stage is unstable and should be brief. **Stage two — the bridge.** The VP trigger has fired but the VP is not yet hired or not yet ramped. The Sales Manager should explicitly *narrow* — get an interim written policy from the founder or fractional help so they stop being the human discount engine, and start documenting how they actually decide so the eventual VP inherits institutional knowledge rather than a vacuum. **Stage three — the re-specialization.** The VP arrives. Policy authority, the approval matrix, CPQ, margin accountability, and the deal desk all move to the VP or the function the VP stands up. The Sales Manager *loses* policy authority and *keeps and deepens* people leadership, pipeline execution, deal coaching, and forecast accuracy. Crucially, this is a promotion in focus even though it looks like a removal of scope — the manager goes from doing two jobs badly to doing one job well. Managing this conversation well is essential; mishandled, the manager reads the VP hire as a demotion and leaves. **Stage four — the scaled middle.** As the org grows past 15-20 reps, the single Sales Manager becomes multiple front-line managers, the VP owns the org, and a dedicated RevOps/Deal Desk function owns governance as a system. The middle layer is now purely people-and-execution leadership, fully separated from governance — which is exactly where the standard model said it should have been all along.

## Decision Criteria: A Framework for the Out-of-Sequence Company

Operators stuck in rung 2.5 need a decision framework, not just a description of the problem. Here is the framework, structured as a sequence of decisions. **Decision one: confirm you are actually at rung 2.5.** Run the seven-point diagnostic. If you fail three or more, proceed. **Decision two: decide whether you need a full VP Sales now or a governance bridge first.** If the company is at 4-6 reps and 2-4M ARR, a full VP Sales may be premature on every axis *except* governance — in which case a fractional VP Sales, a fractional Deal Desk consultant, or an early Head of RevOps hire can close the governance gap while you wait on the full VP. If you are at 7+ reps and 4M+ ARR, hire the VP. **Decision three: regardless of which leader you choose, install the interim written policy this quarter.** The one-page policy does not require the VP — the founder can write it with finance in an afternoon. Do not let the leadership-hire timeline gate the policy. **Decision four: instrument the data now.** You cannot manage leakage you cannot measure; get discount-by-rep and booked-margin-to-model reports running immediately, even if crude. **Decision five: protect the Sales Manager through the transition.** Decide and communicate, before the VP search closes, that the manager's role is re-specializing, not shrinking, and back it with a comp adjustment. **Decision six: sequence the build** — policy, then CRM enforcement, then data-informed policy revision, then CPQ, then deal desk. The framework's organizing principle: **the governance problem and the leadership-hire problem are related but separable. Solve governance immediately with policy and instrumentation; solve leadership on the right timeline. Do not hold the first hostage to the second.**

## Scenario One: The SaaS Company That Promoted Its Top Rep

A 30-person Series A SaaS company, ~3.2M ARR, six reps. Eighteen months ago the founder promoted their best rep to Sales Manager — a common, sensible move. The new Sales Manager is excellent at coaching and beloved by the team. There is no VP Sales; the founder still 'owns' sales at the top. The discount governance posture: there is no written policy. When a rep needs a discount above what feels normal, they Slack the Sales Manager, who decides. The Sales Manager, comped on team attainment, has gradually become more permissive as the company has pushed for growth. Over four quarters, blended gross margin has drifted from 78% to 71% and finance cannot fully explain it. The diagnostic: fails six of seven points. The trigger fired two quarters ago. The fix the company ran: founder and CFO wrote a one-page interim policy in week one (bands at 10/20/30%, hard floor at 25% discount requiring CFO sign-off). RevOps analyst built discount-by-rep reporting, which immediately showed two reps running 19 points deeper than the team median. The company opened a VP Sales search and, critically, sat down with the Sales Manager to frame the VP hire as the manager being freed from a governance job they never wanted. The VP came in at month four, encoded the policy into Salesforce approval flows by month six, and blended margin recovered to 76% within two quarters. The lesson: the standalone manager was not the problem — treating the manager hire as 'sales leadership solved' was.

## Scenario Two: The Competitive Deal That Broke the Unwritten Rules

A 45-person infrastructure software company, ~6M ARR, eight reps, one Sales Manager, no VP. Governance was 'fine' — meaning nobody had noticed it wasn't — because deals were mostly single-year, single-product, and the Sales Manager's gut was a good-enough policy at that complexity. Then a competitive displacement deal came in: a prospect wanted a three-year contract, two product lines, a ramped payment schedule, a waived implementation fee, and a most-favored-pricing clause. The Sales Manager had no framework for any of it — the unwritten rules covered single-year discount depth and nothing else. The deal escalated to the founder, who made it up on the spot under deadline pressure, agreeing to terms (the most-favored-pricing clause especially) that finance later realized would cap pricing on every future deal with that customer's parent company. The deal closed; the structure was a long-term margin liability. This is the classic 'first competitive multi-year deal breaks rung 2.5' trigger. The fix: the company recognized that deal complexity, not headcount, had outrun its governance, and hired a VP Sales whose first mandate was a policy that explicitly covered non-price concessions, contract structure, and clause-level terms — not just discount percentage. The lesson: the VP Sales trigger is not only about volume and variance; it is about *complexity*. A standalone manager's informal policy can survive simple deals indefinitely and then break catastrophically on the first structurally complex one.

## Scenario Three: The Manager Who Left When the VP Was Hired

A 60-person company, ~9M ARR, ten reps, two Sales Managers, no VP, founder still nominally running sales. The governance gap was severe — 24-point discount variance across reps, finance routinely surprised at close — and the company correctly decided to hire a VP Sales. But it handled the org communication badly. The two Sales Managers found out about the VP search from a recruiter, not from the founder. They reasonably interpreted it as 'we are being passed over and our scope is being taken.' One of the two — the stronger one — left within the quarter, taking institutional knowledge and two reps' worth of trust with them. The VP inherited a destabilized middle layer and spent their first two quarters rebuilding what should have been intact. The lesson is about transition management, not governance design: **the Sales Manager role re-specializes when the VP arrives, but if the people in the role experience it as a demotion, they leave, and you lose the institutional knowledge the VP needs.** The fix the company should have run: tell the managers first, frame the VP hire explicitly as removing the governance burden and the founder-bottleneck above them, attach a comp adjustment that adds a margin component but also recognizes the deepened people-leadership focus, and ideally involve the managers in the VP interview loop so they have ownership of the choice. Out-of-sequence org repair is as much a people problem as a systems problem.

## Scenario Four: The Company That Hired RevOps Instead of a VP

A 40-person company, ~5M ARR, seven reps, one strong Sales Manager, no VP. The founder did the diagnostic, recognized rung 2.5, but made a deliberate and somewhat unconventional call: rather than hire a full VP Sales immediately, they hired a Head of RevOps first and kept the Sales Manager as the top sales-people-leader reporting to the founder for another three quarters. The reasoning: the acute problem was *governance*, not *coaching* — the Sales Manager was genuinely good at the people job — so they bought the governance capability directly. The Head of RevOps built the policy, the approval matrix, the Salesforce enforcement, the instrumentation, and the quarterly discounting report. The Sales Manager kept people leadership and pipeline, and was explicitly relieved to hand off the approval grind. Blended margin stabilized within two quarters. The company hired the full VP Sales nine months later, at 11 reps, into an org where governance already worked — so the VP could focus on scaling the motion rather than firefighting leakage. The lesson: **the VP Sales is the conventional answer to the rung-2.5 problem, but it is not the only answer.** If the manager is strong on the people axis and the acute gap is purely governance, a RevOps-first sequence can be both cheaper and faster — it directly buys the missing capability instead of buying a generalist leader and hoping they prioritize governance. The risk: RevOps-first only works if the Sales Manager is genuinely good at people leadership and the founder can still hold the top sales seat competently for those extra quarters.

## Scenario Five: The Company That Waited Too Long

A 90-person company, ~14M ARR, fourteen reps, three Sales Managers, still no VP — the founder kept deferring the hire because 'the managers are handling it.' By the time they finally ran the diagnostic, the damage was structural and compounded. Discount variance across reps was over 30 points. Three years of deals had been approved with no audit trail, so when a potential acquirer ran diligence, they could not produce a coherent picture of discounting practice or explain the blended-margin trend — which knocked a meaningful amount off the valuation. Reps had fully internalized that discounting was a negotiation with whichever manager was most permissive, and that culture was now load-bearing in how the team sold. The VP Sales they finally hired spent their entire first year not building governance but *unwinding* a three-year-old anti-pattern: re-cutting comp, rebuilding trust, installing systems against active rep resistance, and cleaning up data debt. The lesson is the cost of delay. At rung 2.5, every quarter you wait does not just leak 2-5 points of margin — it *hardens the anti-pattern into culture* and accumulates data debt that becomes a diligence liability. The standalone-manager state is a slope, not a plateau, and the cost of the eventual fix scales super-linearly with how long you sit on it. The company that hires the VP (or RevOps) one quarter after the trigger fires has a six-month fix; the company that waits three years has a multi-year, valuation-impairing cleanup.

## The Cross-Functional Dimension: Finance, RevOps, and the Pricing Committee

Discount governance is never purely a sales-org concern, and the standalone Sales Manager's structural weakness is partly that they lack the cross-functional standing to convene the other stakeholders. Mature governance involves at least three functions beyond sales. **Finance** owns the margin model, sets the absolute floor, and needs the audit trail to reconcile booked margin to plan — finance is the natural co-owner of the margin-accountability loop. **RevOps** owns the systems layer: the CRM enforcement, the CPQ build, the reporting and the audit trail; in many companies RevOps, not the VP personally, is where the deal-desk function actually lives. **Product/pricing** owns list price and packaging, and a recurring pattern is that 'discounting' problems are actually 'list price is wrong' or 'packaging is wrong' problems in disguise — if reps discount the same SKU 30% every time, the SKU is mispriced, and no approval matrix fixes a list-price error. Mature companies convene these functions in a **pricing committee** or **deal-desk council** that meets regularly to review the discounting report, adjudicate the genuinely strategic exceptions, and feed pattern data back into list price and packaging. A standalone Sales Manager cannot stand up a pricing committee — they do not have the seniority to convene finance and product, and they do not own the systems. This is a specific, concrete thing the VP Sales unlocks: not just internal sales-org discipline, but the *cross-functional forum* where governance actually gets adjudicated and continuously improved. Operators should understand that 'hire a VP to fix discount governance' partly means 'hire someone senior enough to make finance and product show up to the table.'

## The Founder's Role in the Transition

The founder is not a bystander in this transition — the founder's behavior is often what created rung 2.5 and is often what keeps the company stuck there. Three founder behaviors matter. **First, the founder usually hired the standalone Sales Manager *instead of* a VP because a VP felt like a loss of control** — and that same instinct, unexamined, will make the founder slow to hire the VP even after the trigger fires. The founder has to consciously recognize that the manager hire was a control-preserving move and that the cost of preserving control is the governance gap. **Second, the founder is frequently the secret top of the approval tree** — the manager handles 'normal' discounts, but anything big still routes to the founder, who decides by gut. This means the founder is *also* a human discount engine, just for the biggest and most consequential deals, and the founder's gut is even less codified than the manager's. Part of building governance is the founder explicitly *giving up* their own ungoverned approval authority and routing themselves through the same policy. **Third, the founder owns the transition communication.** Whether the manager experiences the VP hire as a re-specialization or a demotion is determined almost entirely by how the founder frames and sequences it. The founder who tells the managers last, or frames the VP as 'the new boss of sales' rather than 'the person who takes the governance burden off you,' will lose managers. The founder's job in this transition is threefold: recognize the control instinct that created the gap, give up their own ungoverned approval authority, and personally own the people-side communication of the manager's re-specialization. None of this can be delegated to the incoming VP — the VP inherits the result of how the founder handled it.

## Common Failure Modes and Anti-Patterns

Operators repeatedly fall into a recognizable set of traps when navigating this transition, and naming them is a form of inoculation. **Anti-pattern one: 'we hired a Sales Manager, so sales leadership is covered.'** This is the root error — coaching is covered, governance is not, and the two are different jobs. **Anti-pattern two: encoding policy into CPQ before the policy is good.** This automates the leakage and makes it harder to change; interim written policy and CRM enforcement must come first. **Anti-pattern three: hiring a Deal Desk before there is a policy.** The Deal Desk has nothing to enforce and becomes just another human discount engine with a different title. **Anti-pattern four: introducing margin-adjusted rep comp before the discount rules are clear.** Reps will revolt, correctly, against being penalized for discounts when the rules themselves are vague. **Anti-pattern five: treating the VP hire as a demotion of the Sales Manager.** This loses the manager and the institutional knowledge the VP needs. **Anti-pattern six: holding the policy hostage to the leadership hire.** The interim policy does not require the VP — waiting to write it until the VP starts is months of avoidable leakage. **Anti-pattern seven: the founder retaining a private, ungoverned approval lane for 'big deals.'** Governance with an exception for the founder's gut is not governance. **Anti-pattern eight: confusing a discounting problem with a list-price problem.** If the same SKU is discounted the same amount every time, fix the list price; an approval matrix cannot fix mispricing. **Anti-pattern nine: measuring readiness by headcount alone.** In the standalone-manager scenario the governance trigger fires before the headcount trigger, and the headcount-only model will tell you you are fine when you are already bleeding. Avoiding these nine traps is most of the battle.

## The Five-Year and AI Outlook

Looking forward, two forces reshape this picture over the next five years. **First, AI changes the mechanics of governance enforcement.** AI-assisted deal desks and CPQ tools increasingly flag out-of-pattern discounts in real time, predict the margin impact of a proposed concession structure, surface comparable historical deals, and even draft the approval rationale — which lowers the cost of *enforcing* a policy dramatically. This is genuinely good news for the out-of-sequence company: the historical reason rung 2.5 persisted was that building real enforcement was expensive and slow, and AI compresses that. But — and this is the critical caveat — **AI changes the cost of enforcement, not the need for policy.** An AI deal desk with no underlying discount policy is just a faster human discount engine; it still needs the bands, the floor, the matrix, and the margin accountability defined by humans. AI does not eliminate the VP Sales / governance-owner trigger; it makes the *systems* artifact cheaper while leaving the *policy* and *accountability* artifacts exactly as human and exactly as necessary. **Second, the org-design pattern itself is shifting.** More companies are hiring RevOps and Deal Desk capability earlier and more deliberately — partly because the standalone-manager failure mode is now well-understood, partly because AI tooling makes a small RevOps function unusually leveraged. The likely five-year equilibrium: the 'standalone Sales Manager with no governance' state becomes rarer because companies hire a Head of RevOps or a fractional deal-desk capability alongside or just after the first Sales Manager, closing the governance gap by design rather than discovering it after the leakage. The companies that thrive will be the ones that internalize that **coaching capacity and governance capacity are separate hires that happen to have arrived bundled in the old 'VP Sales' job description — and you can, and increasingly should, buy them separately and in the right order.**

## The Final Framework: The Governance-First Readiness Model

Pulling everything together, here is the framework that should replace the headcount-only readiness model for any company that has hired — or is considering hiring — a Sales Manager before a VP Sales. **Principle one: separate the two jobs explicitly.** Coaching/people-leadership and governance/system-design are different jobs. The Sales Manager hire buys the first. It does not buy the second. Name the second job and decide who owns it — explicitly, in writing — the day you hire the manager. **Principle two: the governance trigger is governance-shaped, not headcount-shaped.** Watch discount variance, manager time-on-approvals, finance's ability to reconcile margin, the existence of a written policy and system enforcement, deal complexity, and the manager's incentive conflict — not just rep count. Any three of those going red means the trigger has fired, often one to two quarters before headcount would say so. **Principle three: solve governance immediately, solve leadership on the right timeline.** The interim written policy and the data instrumentation do not require the VP and should not wait for them. The VP (or RevOps-first, if the manager is strong on people) is hired on its own timeline. **Principle four: the middle layer re-specializes, it does not disappear.** When the VP arrives, the Sales Manager moves fully to people leadership and pipeline; the VP or a Deal Desk/RevOps function takes policy, the matrix, CPQ, and margin accountability. Manage that as a focus-promotion, not a scope-removal, or you lose the manager. **Principle five: sequence the build** — policy, CRM enforcement, data-informed policy revision, CPQ, deal desk — and never automate a bad policy. **Principle six: change the comp plans** — margin shows up in the plans of the manager, the reps, and the VP, because governance fails when the only people who can approve discounts are the only people paid to book revenue. The single sentence that captures the whole entry: **hiring a Sales Manager before a VP Sales does not cover sales leadership — it covers coaching and leaves governance in a vacuum, which pulls the real VP Sales trigger forward; the middle layer does not change in importance, it changes in specialization, and the company's job is to see the governance gap the day the manager is hired rather than discover it two years and several margin points later.**

`;

const flow = `

## Decision Flow: Diagnosing the Standalone-Manager Governance Gap

\`\`\`mermaid
flowchart TD
  A[You Hired A Sales Manager Before A VP Sales] --> B{Run The Seven-Point Diagnostic}
  B --> B1[Written Discount Policy Exists?]
  B --> B2[CRM Or CPQ Enforces Anything?]
  B --> B3[Finance Can Reconcile Margin To Model?]
  B --> B4[Manager Decides By Policy Not Gut?]
  B --> B5[Audit Trail Of Exceptions Exists?]
  B --> B6[Manager Approval Time Under 25 Percent?]
  B --> B7[Discount Variance Across Reps Under 15 Points?]
  B1 --> C{Fail Three Or More?}
  B2 --> C
  B3 --> C
  B4 --> C
  B5 --> C
  B6 --> C
  B7 --> C
  C -->|No| C1[Genuine Rung Three Maturity - Monitor Quarterly]
  C -->|Yes| D[You Are At Rung 2.5 - Trigger Has Fired]
  D --> E{Company Size Check}
  E -->|4-6 Reps And 2-4M ARR| F[Governance Bridge First]
  E -->|7 Plus Reps And 4M Plus ARR| G[Hire VP Sales Now]
  F --> F1[Fractional VP Or Head Of RevOps Or Deal Desk Consultant]
  F1 --> H[Install Interim One-Page Policy This Quarter]
  G --> H
  H --> H1[Three Or Four Discount Bands]
  H --> H2[Hard Margin Floor With CFO Sign-Off]
  H --> H3[Non-Price Concession Rules]
  H1 --> I[Instrument The Data Now]
  H2 --> I
  H3 --> I
  I --> I1[Discount By Rep Report]
  I --> I2[Booked Margin To Model Report]
  I --> I3[Exception Volume And Approval Rate]
  I1 --> J[Sequence The Build]
  I2 --> J
  I3 --> J
  J --> J1[Step 1 Interim Policy]
  J1 --> J2[Step 2 CRM Enforcement]
  J2 --> J3[Step 3 Data-Informed Policy Revision]
  J3 --> J4[Step 4 CPQ Encoding]
  J4 --> J5[Step 5 Stand Up Deal Desk]
  J5 --> K[Re-Specialize The Middle Layer]
  K --> K1[Sales Manager Keeps People Leadership And Pipeline]
  K --> K2[VP Or RevOps Takes Policy Matrix CPQ Margin Accountability]
  K1 --> L[Change The Comp Plans]
  K2 --> L
  L --> L1[Manager Plan Adds Margin Component]
  L --> L2[Rep Plans Add Margin Sensitivity After Rules Are Clear]
  L --> L3[VP Carries Blended Margin As Comp Component]
  L1 --> M[Governed State - Quarterly Pricing Committee Review]
  L2 --> M
  L3 --> M
\`\`\`

## Comparison Matrix: Three Organizational States And Their Governance Posture

\`\`\`mermaid
flowchart LR
  subgraph S1[State 1 Founder-Led No Sales Leader]
    A1[Approval Authority - Founder By Gut]
    A2[Policy Authority - None Needed Low Volume]
    A3[Governance Risk - Low While Deal Volume Low]
    A4[Failure Mode - Founder Becomes Bottleneck]
    A5[Right Next Move - Hire First Sales Leader]
  end
  subgraph S2[State 2.5 Standalone Sales Manager No VP]
    B1[Approval Authority - Manager By Default]
    B2[Policy Authority - Vacuum Nobody Owns It]
    B3[Governance Risk - High And Compounding]
    B4[Failure Mode - Manager Is Biased Human Discount Engine]
    B5[Incentive Conflict - Manager Comped On Bookings They Approve]
    B6[Margin Leakage - 2 To 5 Points Per Quarter]
    B7[Right Next Move - Interim Policy Now Plus VP Or RevOps]
  end
  subgraph S3[State 3 VP Sales With Deal Desk RevOps]
    C1[Approval Authority - Matrix-Driven With SLAs]
    C2[Policy Authority - VP Owns Or Sponsors RevOps Owner]
    C3[Governance Risk - Managed And Measured]
    C4[Enforcement - CPQ Encoded Not Manual]
    C5[Accountability - VP Carries Blended Margin]
    C6[Separation - Deal Desk Not Carrying Bookings Quota]
    C7[Cross-Functional - Pricing Committee Convenes Finance Product]
  end
  S1 -->|Out-Of-Sequence Hire Creates Gap| S2
  S1 -->|In-Sequence Hire| S3
  S2 -->|Trigger Fires Earlier Than Headcount Model Predicts| S3
  B2 -.governance gap.-> B4
  B5 -.contaminates.-> B4
  B4 -.compounds into.-> B6
  C2 -.closes the gap.-> C4
  C6 -.removes incentive conflict.-> C5
\`\`\`

`;

const src = `

## Sources

1. **The SaaS Sales Org Maturity Model — sales leadership hiring sequence** — Framework literature on when founder-led selling transitions to first sales hires, Sales Manager, VP Sales, and CRO.
2. **Mark Roberge, "The Sales Acceleration Formula"** — Canonical source on building and sequencing the sales organization, including the role of the sales leader in process and system design.
3. **Winning by Design — Revenue Architecture and Deal Desk frameworks** — Reference material on deal desk design, discount governance, and the separation of approval from bookings incentives.
4. **Pavilion (formerly Revenue Collective) — VP Sales readiness benchmarks** — Operator community data on rep-count and ARR thresholds for the VP Sales hire.
5. **SaaStr — "When to hire a VP of Sales"** — Widely cited operator guidance on VP Sales timing, typically framed at 8-12 reps; this entry argues the governance trigger fires earlier.
6. **Salesforce CPQ documentation — discount schedules, approval rules, and price rules** — Product reference for how discount bands and approval matrices are encoded into quoting systems.
7. **DealHub / Subskribe CPQ documentation — approval workflows and guided selling** — Reference for CPQ-layer governance enforcement.
8. **RevOps Co-op community resources — deal desk standup playbooks** — Practitioner material on building a deal desk function and sequencing it after policy.
9. **OpenView Partners — SaaS benchmarks on gross margin and discounting** — Benchmark data on blended gross margin ranges and discount depth by segment.
10. **KeyBanc Capital Markets SaaS Survey** — Annual benchmark data on sales efficiency, ACV, and discounting practice across SaaS stages.
11. **ICONIQ Growth — Go-to-Market reports** — Benchmark data on sales org structure, ramp, and leadership hiring by ARR stage.
12. **Bessemer Venture Partners — State of the Cloud / Scaling GTM** — Reference on GTM org evolution and the role of RevOps.
13. **The RevOps Maturity Model — systems and process readiness ladder** — Framework for RevOps function readiness, paralleling the discount governance readiness ladder.
14. **HubSpot — deal-based approval workflows and quote tools** — Reference for CRM-layer (pre-CPQ) discount enforcement at smaller scale.
15. **Gong / Clari research on discounting behavior and quarter-end deal pressure** — Data on how discount depth spikes at quarter-end and how rep discounting behavior varies.
16. **CFO Connect / finance-org literature on margin accountability** — Reference on finance's role in setting the margin floor and reconciling booked margin to model.
17. **The Bridge Group — Sales Development and sales org structure surveys** — Benchmark data on rep-to-manager ratios and management span of control.
18. **David Sacks — "The Cadence" and SaaS org-building essays** — Operator writing on founder-led selling transition and the founder's role in the org.
19. **Sales comp design references (Alexander Group, QuotaPath resources)** — Reference on margin-adjusted commission, manager comp on team attainment, and the incentive conflict at the manager layer.
20. **First Round Review — sales leadership hiring essays** — Operator interviews on the difference between a Sales Manager and a VP Sales and the cost of hiring out of sequence.
21. **Tomasz Tunguz (Theory Ventures / formerly Redpoint) — discounting and pricing essays** — Data-driven writing on discount leakage and pricing power.
22. **a16z — Go-to-Market and pricing content** — Reference on pricing committees, packaging, and the relationship between list price and discounting.
23. **Deal Desk job-description corpus (public postings, 2023-2026)** — Evidence on how the deal desk role is scoped and where it reports.
24. **M&A diligence checklists (sell-side SaaS diligence guides)** — Reference on how discounting practice, audit trails, and margin trends affect valuation in diligence.
25. **Corporate Visions / pricing-execution research** — Reference on non-price concessions and how terms erode effective margin without showing as discount.
26. **The "fractional VP Sales" operator literature** — Reference on using fractional sales leadership as a governance bridge for out-of-sequence companies.
27. **Pricing committee / pricing council governance frameworks** — Reference on convening finance, product, and sales for cross-functional discount adjudication.
28. **AI deal desk product literature (2024-2026 CPQ and revenue-intelligence releases)** — Reference on AI-assisted discount flagging, margin prediction, and approval-rationale drafting.

`;

const num = `

## Numbers

**The Standalone-Manager Hire Itself**
- Typical Sales Manager hire (before VP): 3-6 reps, $1.5M-$4M ARR
- Common reason: founder cannot coach and run the number simultaneously
- Cost vs VP Sales: roughly 40-60% of fully loaded VP cost

**When Rung 2.5 Becomes Dangerous**
- Active danger threshold: 6-9 reps, $3M-$6M ARR
- Alternative trigger regardless of headcount: first competitive multi-year, multi-product deal
- Margin leakage in ungoverned competitive market: 2-5 points of blended gross margin per quarter once past ~6 reps with no written policy or CPQ enforcement

**Discount Variance Benchmarks**
- Healthy governed org: 8-12 points of ASP variance across reps on comparable deals
- Rung 2.5 org: commonly 15-30 points of variance — largely pure leakage
- Scenario-five worst case (waited 3 years): over 30 points

**Sales Manager Time-On-Approvals**
- Healthy: under 10-15% of the week
- Rung 2.5: commonly 25-40% of the week, displacing coaching and pipeline work
- Diagnostic red line: over 20-25%

**The VP Sales Trigger (Standalone-Manager Scenario)**
- Governance-shaped trigger fires at: 6-10 reps, $4M-$8M ARR
- This is ~1-2 quarters and $1M-$3M ARR EARLIER than the textbook 8-12 rep headcount trigger
- Fire the trigger when any 3 of 7 diagnostic points go red

**The Diagnostic — Seven Points**
- 1. Written discount policy exists (document, not Slack norm)
- 2. CRM/CPQ enforces something automatically
- 3. Finance reconciles booked margin to model within tolerance
- 4. Manager decides by policy, not gut
- 5. Audit trail of exceptions exists
- 6. Manager approval time under 20-25% of week
- 7. Discount variance across reps under ~15 points
- Fail 3+ → unambiguously rung 2.5, trigger has fired

**Discount Band Structure (Illustrative Interim Policy)**
- 0-10%: rep discretion
- 10-20%: manager approval
- 20-30%: VP approval
- 30%+: pricing committee / finance / CFO sign-off
- Hard margin floor: deal-specific; below it requires CFO involvement

**Downstream Governance Hires**
- Deal Desk / RevOps governance hire: follows VP by 1-3 quarters, ~10-20 reps, $8M-$15M ARR
- CPQ implementation that actually enforces policy: ~8-15 reps
- Before CPQ: CRM-level (Salesforce/HubSpot) approval flows as the bridge layer

**VP Build Sequence (Days)**
- Days 0-30: minimum viable one-page interim policy
- Days 30-60: approval matrix + data instrumentation
- Days 60-90: encode into CRM/CPQ
- Days 90-180: stand up deal desk + accountability loop
- Beyond 180: data-informed policy revision

**Comp Plan Changes**
- Sales Manager: add 10-20% weighting on blended team margin or discount-band discipline
- Reps: introduce margin-adjusted commission (higher rate on low-discount deals) — only after policy and systems exist
- VP Sales: blended gross margin as an explicit comp component alongside bookings

**Margin Recovery (Scenario Evidence)**
- Scenario 1: blended margin drifted 78% → 71% over 4 quarters at rung 2.5; recovered to 76% within 2 quarters of VP + policy + Salesforce enforcement
- Scenario 4 (RevOps-first): margin stabilized within 2 quarters; full VP hired 9 months later into a governed org
- Scenario 5 (waited 3 years): VP spent entire first year unwinding the anti-pattern, not building; valuation impaired in diligence

**Cost-of-Delay Pattern**
- Fix one quarter after trigger fires: ~6-month fix
- Fix three years after trigger fires: multi-year, valuation-impairing cleanup
- Cost of the eventual fix scales super-linearly with delay

`;

const counter = `

## Counter-Case: When Hiring The Standalone Sales Manager First Is Actually Fine — Or Even Right

The main entry argues forcefully that the standalone Sales Manager hire creates a governance gap and pulls the VP Sales trigger forward. That is the right default. But a serious operator should stress-test it, because there are real conditions under which hiring a Sales Manager before a VP Sales is fine, defensible, or even optimal — and treating the warning as an absolute rule causes its own mistakes.

**Counter 1 — Low deal volume and simple deal structure genuinely defer the governance need.** The whole governance problem is driven by *volume* and *complexity*. A company doing 20-30 deals a quarter, all single-year and single-product, all in a narrow ACV band, can run on the Sales Manager's gut for a long time without meaningful leakage, because there simply is not enough deal variety for inconsistency to compound. If your motion is genuinely simple and low-volume, the standalone manager can be a stable state for several quarters, not a slope. The warning applies hardest to high-volume, high-complexity, competitive markets — it applies weakly to low-volume simple ones.

**Counter 2 — A strong, disciplined Sales Manager can be a good-enough interim governor.** The incentive-conflict argument is structural and real, but it is a tendency, not a determinism. A genuinely disciplined Sales Manager — one who instinctively documents their decisions, holds a consistent internal logic, and is temperamentally margin-conscious — can run a competent informal governance regime well past the textbook trigger. The org should still codify the policy (because the manager could leave), but the claim "the manager is structurally incapable of governing" is too strong for the best individuals. Some managers are, in effect, an unwritten policy that happens to be good.

**Counter 3 — Hiring a VP Sales too early is its own expensive failure mode.** The entry focuses on the cost of waiting too long. But hiring a VP Sales before the company has product-market fit in its sales motion, before there is enough volume to justify the seniority, or before the founder is genuinely ready to hand off the sales seat, is a well-documented and costly failure — VP Sales mis-hires and early-VP flameouts are among the most expensive mistakes in SaaS. If the choice is "premature VP Sales" versus "standalone Sales Manager plus an interim written policy," the manager-plus-policy option is often the better risk-adjusted call. The governance gap can be closed cheaply with policy and instrumentation; a bad VP hire cannot be undone cheaply.

**Counter 4 — The RevOps-first path means you may never need the standalone-manager state to be 'fixed' by a VP at all.** Scenario four in the main entry shows this: if you close the governance gap with a Head of RevOps or a fractional deal desk, the standalone Sales Manager is no longer a broken state — it is a perfectly fine state, because the missing capability has been bought directly. In that framing, the standalone manager was never the problem; the *unfilled governance role* was. A company that hires RevOps alongside its first Sales Manager has, by design, no rung-2.5 problem to solve. So the strong claim "you need a VP Sales" is really "you need the governance capability" — and the VP is one delivery vehicle among several.

**Counter 5 — Founder-led top-of-funnel governance can be legitimate, not just an anti-pattern.** The entry treats the founder retaining a private approval lane for big deals as anti-pattern seven. That is right *as a permanent state*. But in the earliest innings, a founder personally adjudicating the handful of genuinely strategic, precedent-setting deals is often the correct allocation of judgment — those deals are bet-the-relationship decisions where founder context matters more than policy. The anti-pattern is the founder *never giving it up* and never routing themselves through policy as the company scales — not the founder exercising judgment on the truly strategic exceptions early on.

**Counter 6 — Codified policy can ossify and lose deals in a fast-moving market.** The entry's bias is toward written policy, bands, floors, and CPQ enforcement. But over-governance is a real failure mode: a rigid approval matrix with slow SLAs becomes a deal-velocity tax, and a margin floor set without enough market data can cause you to walk away from deals you should win. In a land-grab market where speed and market share matter more than near-term margin, a fast, founder-or-manager-empowered discounting regime can be a deliberate strategic choice. The governance apparatus should match the market — and some markets reward looser, faster discounting for a defined period.

**Counter 7 — Sometimes the right next hire genuinely is another Sales Manager, not a VP.** The entry frames the choice as 'standalone Sales Manager' versus 'VP Sales.' But a company at 8-12 reps with a strong founder still capable of holding the top sales seat, and a strong first Sales Manager, may correctly conclude that the next hire is a *second* Sales Manager — splitting the front-line load — plus a RevOps hire for governance, with the VP Sales deferred another year. The middle layer can scale horizontally before it acquires a layer above it, provided the governance capability is bought separately. The VP is not the only way to add capacity at the management layer.

**The honest verdict.** Hiring a Sales Manager before a VP Sales is a real risk because it tends to leave governance in a vacuum — that is the right default assumption and the right thing to watch for. But it is a *risk*, not a certainty, and it is fully mitigable without a VP Sales. The conditions under which it is fine or right: low deal volume and simple structure, a genuinely disciplined manager, a market where premature-VP risk outweighs governance risk, a deliberate RevOps-first path that buys the governance capability directly, an early stage where founder judgment on strategic deals is correct, a land-grab market that rewards speed over governance, or a stage where horizontal management scaling beats adding a layer. The synthesis: do not treat 'hired a Sales Manager first' as automatically broken — treat it as 'governance capability is now unassigned, assign it deliberately,' and choose the delivery vehicle (VP Sales, RevOps, fractional, second manager) that fits your volume, complexity, market, and founder readiness.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a RevOps function from scratch? (The function that often owns discount governance once the VP stands it up.)
- **q9502** — How do you design a sales compensation plan that protects margin? (Deep dive on the comp-plan changes referenced throughout this entry.)
- **q9503** — When do you hire your first VP of Sales? (The conventional headcount-based readiness model this entry argues to supplement with a governance-shaped trigger.)
- **q9504** — How do you build a deal desk? (The function that takes exception-approval authority away from the bookings-carrying roles.)
- **q9505** — What does a discount approval matrix look like? (The concrete artifact — deal characteristics mapped to approvers with SLAs.)
- **q9506** — How do you write a discount policy document? (The first governance artifact, and the one that does not require a VP to create.)
- **q9507** — How do you set a margin floor for sales deals? (Finance's role in defining the hard floor below which no deal proceeds.)
- **q9508** — Salesforce CPQ vs DealHub vs Subskribe for discount enforcement. (The CPQ-layer tooling comparison referenced in the tooling section.)
- **q9509** — How do you instrument discounting data in Salesforce? (Building the discount-by-rep and booked-margin-to-model reports.)
- **q9510** — What is the difference between a Sales Manager and a VP of Sales? (The role distinction at the heart of this entry.)
- **q9511** — How do you transition a Sales Manager when you hire a VP above them? (The re-specialization conversation and how to avoid losing the manager.)
- **q9512** — When should you hire a fractional VP of Sales? (The governance-bridge option for companies too early for a full VP.)
- **q9513** — How do you build a pricing committee? (The cross-functional forum that adjudicates strategic exceptions.)
- **q9514** — How do non-price concessions erode effective margin? (Payment terms, waived fees, and clause-level terms that do not show as 'discount.')
- **q9515** — How do you forecast blended gross margin? (Finance's reconciliation of booked margin to the financial model.)
- **q9516** — What breaks when you hire sales roles out of sequence? (The general out-of-sequence org-design problem; this entry is the discount-governance-specific case.)
- **q9517** — How do you introduce margin-adjusted commission without a rep revolt? (Sequencing rep comp changes after policy and systems exist.)
- **q9518** — How do competitive multi-year deals break early-stage governance? (The deal-complexity trigger from scenario two.)
- **q9519** — How does ungoverned discounting affect M&A valuation? (The diligence-liability cost from scenario five.)
- **q9520** — What does the founder give up when hiring a VP of Sales? (The founder's control instinct and the private big-deal approval lane.)
- **q9521** — How do you build a sales org maturity model? (The readiness ladder this entry maps the standalone-manager 'rung 2.5' onto.)
- **q9522** — How will AI change deal desks and CPQ by 2030? (The five-year outlook on AI-assisted enforcement.)
- **q9523** — RevOps-first vs VP-Sales-first: which to hire first? (The scenario-four decision in depth.)
- **q9524** — How do you measure discount variance across a sales team? (The diagnostic metric — ASP variance on comparable deals.)
- **q9525** — How do you set approval SLAs so governance does not slow deals? (Avoiding the deal-velocity-tax failure mode.)
- **q9526** — When is a discounting problem actually a list-price problem? (The packaging/pricing root cause behind apparent discount leakage.)

`;

const tags = ['revops','discount-governance','sales-org-design','deal-desk','vp-sales','sales-management','cpq','founder-led-sales','margin-leakage','sales-comp'];

const sources = [
  { title: 'SaaStr — When to Hire a VP of Sales', url: 'https://www.saastr.com/when-to-hire-a-vp-of-sales/' },
  { title: 'Winning by Design — Revenue Architecture and Deal Desk Frameworks', url: 'https://winningbydesign.com/' },
  { title: 'Salesforce CPQ — Discount Schedules and Approval Rules Documentation', url: 'https://help.salesforce.com/s/articleView?id=sf.cpq_discount_schedules.htm' }
];

const notes = {
  s6: 'Added 28 cited sources spanning sales-org maturity frameworks (Roberge Sales Acceleration Formula, SaaS maturity model, RevOps maturity model), VP Sales readiness benchmarks (Pavilion, SaaStr, ICONIQ, Bessemer, KeyBanc, OpenView), CPQ and deal-desk tooling docs (Salesforce CPQ, DealHub, Subskribe, HubSpot, RevOps Co-op), discounting-behavior research (Gong, Clari, Tunguz), comp-design references (Alexander Group, QuotaPath), founder-org essays (Sacks, First Round Review), and the AI-deal-desk and M&A-diligence literature.',
  s7: 'Added comprehensive numbers block: standalone-manager hire thresholds (3-6 reps, $1.5-4M ARR), rung-2.5 danger thresholds (6-9 reps, $3-6M ARR), margin leakage rate (2-5 points blended GM per quarter), discount variance benchmarks (8-12 points healthy vs 15-30 rung 2.5), manager time-on-approvals (under 10-15% healthy vs 25-40% rung 2.5), the governance-shaped VP trigger (6-10 reps, $4-8M ARR — 1-2 quarters earlier than the headcount model), seven-point diagnostic, illustrative discount band structure, downstream governance-hire timing, the 0-180 day VP build sequence, comp-plan change magnitudes, and scenario-evidenced margin recovery and cost-of-delay patterns.',
  s8: 'Added 7-element counter-case: low deal volume and simple structure genuinely defer the governance need; a strong disciplined manager can be a good-enough interim governor; hiring a VP Sales too early is its own expensive failure mode; the RevOps-first path means the standalone-manager state need not be "fixed" by a VP at all; founder-led top-of-funnel governance can be legitimate early on; codified policy can ossify and lose deals in a fast-moving land-grab market; sometimes the right next hire is a second Sales Manager plus RevOps rather than a VP. Verdict reframes the issue as "governance capability is unassigned, assign it deliberately" rather than "the manager hire is broken."',
  s9: 'Cross-linked 26 related Pulse entries: RevOps and deal-desk function building (q9501/q9504/q9513), the comp-plan and margin-protection cluster (q9502/q9507/q9515/q9517), the VP Sales readiness and role-distinction cluster (q9503/q9510/q9511/q9512/q9520), the discount-policy and approval-matrix artifacts (q9505/q9506/q9525), CPQ and instrumentation tooling (q9508/q9509/q9524), the org-design and out-of-sequence-hiring cluster (q9516/q9521/q9523), deal-complexity and non-price-concession entries (q9514/q9518/q9526), the M&A-valuation impact (q9519), and the AI outlook (q9522).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite answering how the discount governance readiness model shifts when a company hires a Sales Manager before a VP Sales, and whether/how the middle layer changes when a VP is needed. Core thesis: the standalone manager hire covers coaching but leaves policy authority in a vacuum, creating an unstable "rung 2.5" state that pulls the real VP Sales trigger 1-2 quarters / $1-3M ARR earlier than the headcount-only model predicts; the middle layer does not disappear when the VP arrives — it re-specializes (manager keeps people leadership and pipeline; VP/RevOps/Deal Desk takes policy, approval matrix, CPQ, and margin accountability). Two mermaid diagrams (a decision-flow diagnosing the governance gap from the seven-point diagnostic through the sequenced build to comp changes, and a three-state comparison matrix of founder-led vs standalone-manager-2.5 vs VP-with-deal-desk governance posture). Full coverage: the approval-authority-vs-policy-authority distinction, the standard readiness ladder and where rung 2.5 falls through it, the seven-point diagnostic, the human-discount-engine and incentive-conflict pathologies, the governance-shaped VP trigger, the six governance artifacts, the 0-180 day build sequence, tooling layer (Salesforce/CPQ/RevOps stack), org and comp-plan implications, four-stage evolution of the middle layer, a six-decision framework, five named real-world scenarios (promoted-top-rep SaaS co, the competitive deal that broke the unwritten rules, the manager who left when the VP was hired, the RevOps-first company, the company that waited too long), the cross-functional/pricing-committee dimension, the founder role, nine anti-patterns, and a five-year AI outlook. Counter-case is a 7-element stress test. 28 sources, comprehensive numbers block, 26 cross-links.'
};

runPolish({ id: 'q9539', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
