// q9558 — Framework for a CRO to decide: two separate sales motions (organic vs M&A/upmarket) with distinct qualification rules, or force-fit both into a single process?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** The decision is not "two motions or one" — it is **"how many discrete revenue engines does the business actually have, and which ones clear the $8M-$12M annual-bookings threshold that justifies a dedicated motion?"** A CRO should run the **Motion Separation Test**: split a motion only when it scores 4+ on a 6-factor rubric — (1) buyer persona divergence (different economic buyer, different problem), (2) deal-size delta of 3x or more (e.g., $25K organic ACV vs $140K upmarket ACV), (3) sales-cycle delta of 2x or more (35 days vs 90+ days), (4) rep skill non-transferability (a transactional closer cannot run a 7-stakeholder enterprise pursuit), (5) qualification-criteria conflict (the same MEDDICC fields produce opposite "go/no-go" answers), and (6) the segment can fund **at least 3 quota-carrying reps plus 1 manager** at target — roughly **$8M-$12M of addressable pipeline**. If a segment scores 4+ AND clears the funding floor, **separate the motion** with its own qualification framework, comp plan, pipeline stages, and forecast category. If it scores 3 or below, or cannot fund a pod, **run one motion with a "fast-path / deep-path" branch inside a shared process** — same CRM, same top-of-funnel stages, but a documented fork at the qualification stage. The most common, most expensive mistake is **premature separation**: a CRO spins up an "enterprise team" at $4M of upmarket pipeline, strands 3 reps below quota, blows up the comp budget, and creates two sub-scale teams instead of one healthy one. The second most expensive mistake is **terminal force-fitting**: cramming a $200K M&A-driven cross-sell motion through a velocity playbook built for $20K self-serve-adjacent deals, which produces garbage forecasts, misqualified pipeline, and rep churn. The right sequence is almost always **overlay before org** — prove the second motion with 1-2 specialist overlays riding the existing team, instrument it as a separate forecast category for 2-3 quarters, and only formalize a separate org once it independently clears the funding floor and the data shows the 4+ separation score is real and stable. Tooling: enforce the fork in **Salesforce record types + separate opportunity paths**, separate **MEDDICC vs SPICED** qualification on the two paths, distinct **forecast categories**, and a **CPQ ruleset** that prevents an organic rep from quoting an upmarket bundle. Comp must follow the motion, not the title: separate quotas, separate accelerators, separate ramp curves. Net: the framework is **score it, fund-test it, overlay it, then org it** — and revisit the decision every two quarters because the right answer changes as each motion scales.`;

const core = `

## The Real Question Behind the Question

When a CRO asks "should I build two sales motions or force both into one process," they are almost never actually asking an org-design question. They are asking a **capital-allocation and risk question** dressed up as an org-design question. The honest framing is: *I have a finite headcount budget, a finite enablement budget, a board that wants predictable forecasts, and two (or more) ways revenue shows up — the organic motion that built the company, and a newer upmarket or M&A-driven motion that has different physics. If I separate them, I get focus and clean data but I risk creating two sub-scale teams. If I merge them, I get scale and simplicity but I risk a forecast built on a process that fits neither motion well.* That is the actual tension, and it is a tension between **focus and scale**, not between "good" and "bad."

The reason this question is hard is that both failure modes are real and both are expensive. Premature separation strands reps below quota, doubles management overhead, fragments enablement, and — worst of all — it is politically very hard to *un*-separate. Once you have an "Enterprise Team" with a VP and a Slack channel and a comp plan, collapsing it back into the core org reads internally as a failure and a demotion, even when it is the correct call. Conversely, terminal force-fitting is quieter but just as corrosive: the forecast slowly loses predictive power, win rates on the misfit segment look mysteriously bad, your best transactional reps quit because they keep getting handed deals they cannot close, and the board starts asking why "enterprise" never materializes. The CRO's job is not to pick a side ideologically. It is to build a **decision framework with explicit thresholds**, apply it to the actual numbers, and commit to revisiting it on a cadence — because the correct answer genuinely changes as the business scales.

The rest of this answer builds that framework: the diagnostic test that tells you whether two motions exist, the funding floor that tells you whether you can afford to separate them, the overlay-before-org sequencing that de-risks the decision, the qualification and comp and tooling mechanics that make a separation actually work, five named scenarios showing the framework applied, and the counter-cases where the conventional "separate at scale" wisdom is wrong.

One more reframe is worth installing before the framework, because it changes how a CRO weighs the evidence. The board, the CEO, and often the CRO's own ambition all bias toward separation, because a separate "Enterprise org" is a visible, narratable artifact of progress — it shows up on the org chart, it has a name, it can be presented in a board deck as "we are moving upmarket." Force-fitting, by contrast, is invisible: there is no artifact, no announcement, nothing to point at. This asymmetry in *visibility* creates a systematic bias toward separation that has nothing to do with whether separation is correct. A disciplined CRO has to actively counterweight that bias — to recognize that the absence of a shiny org-chart box is not evidence that the merged approach is failing, and that the presence of one is not evidence that the separated approach is working. The framework's thresholds exist precisely to take the decision out of the realm of narrative and ambition and put it back into the realm of measurable physics and economics.

## Definitions: Motion, Process, Qualification, and Segment

Precision in vocabulary prevents 80% of the confusion in this debate, because executives use these four words interchangeably and they are not interchangeable.

A **sales motion** is the end-to-end repeatable system by which a specific kind of revenue is generated: who you target, how you generate demand, who works the deal, what the buying process looks like, how you qualify, how you price and package, what the sales cycle and conversion math are, and how reps are compensated. A motion is defined by its *physics* — the deal size, cycle length, stakeholder count, and skill profile — not by an org chart box. PLG-assisted velocity selling is a motion. Field enterprise selling is a motion. Partner-sourced co-selling is a motion. An M&A-driven cross-sell into an acquired customer base is a motion.

A **sales process** is the documented stage-by-stage workflow inside a motion: the opportunity stages, the exit criteria for each stage, the required artifacts, the qualification checkpoints. One motion has one process. The question "two motions or one" is really "do we maintain one process with a branch, or two genuinely distinct processes."

A **qualification framework** is the rubric reps use to decide whether a deal is real and worth pursuing — MEDDICC, MEDDPICC, BANT, SPICED, CHAMP, GPCTBA/C&I. Different motions frequently need different frameworks: a velocity motion that lives or dies on volume and speed is poorly served by full MEDDICC (too heavy), while an enterprise motion that lives or dies on multi-threading and economic-buyer access is poorly served by BANT (too thin). A force-fit often shows up first as a *qualification* mismatch — the same fields producing nonsense answers for one segment.

A **segment** is a slice of the addressable market — by company size, by industry, by acquired-vs-organic, by geography. Segments and motions are correlated but not identical. The whole framework below is about deciding *when a segment has diverged far enough from the core that it needs its own motion*, versus when it is just a variation that a single motion can absorb with a documented branch.

The cleanest mental model: **one motion can serve multiple segments; the question is whether a given segment has crossed the threshold where it now requires its own motion.**

A final definitional point that prevents a specific recurring confusion: a "motion" in this framework is a *go-to-market* motion, not a *product line*. CROs sometimes assume that two products automatically mean two motions, or that one product means one motion. Neither holds. Two products sold to the same buyer, at the same deal size, on the same cycle, by the same kind of rep are one motion regardless of the SKU count. Conversely, a single product can absolutely require two motions if it is sold both as a $20K self-serve-adjacent purchase to a practitioner and as a $200K platform commitment to an enterprise buying committee. The unit of analysis is always the *way the revenue is generated*, not the thing being sold. This matters acutely in the M&A case, because the instinct after an acquisition is to map motions to the legacy company boundaries — "their product, their motion; our product, our motion." That mapping is a coincidence at best. The right question is whether the acquired revenue, sold going forward, has divergent physics — and sometimes the acquired product should be folded into the *existing* motion while a *different* slice of the combined business genuinely needs the separate one.

## The Core Principle: Separate Physics, Not Separate Labels

The single principle that resolves most of these debates: **you separate a motion when the underlying sales physics diverge, not when the marketing label or the customer logo size suggests they should.**

"Physics" here means the measurable, structural characteristics of how the deal actually gets done: average deal size, sales-cycle length, number of stakeholders, number of decision-making committee members, the dominant objection categories, the technical-validation requirements (POC, security review, procurement), the demand-generation source, and the skill set the closing rep must have. When two ways of selling share most of this physics, they are one motion with variations and should share a process — separating them just creates overhead. When two ways of selling have genuinely divergent physics — a 35-day, single-stakeholder, $25K self-serve-adjacent expansion versus a 110-day, seven-stakeholder, $180K, security-reviewed, procurement-gated new-logo enterprise pursuit — they are two motions, and forcing them through one process means the process fits neither.

The "organic vs M&A/upmarket" framing in the question is a *hypothesis* about divergent physics, not a conclusion. Sometimes the M&A-acquired customer base sells almost exactly like the organic base — same buyer, same deal size, same cycle — and the only real difference is the data migration and the account-mapping exercise, which is a one-time RevOps project, not a permanent second motion. Other times the acquired base is structurally different — it is enterprise where you were mid-market, or it is a different buyer persona entirely — and then it genuinely is a second motion. The CRO's discipline is to **measure the physics before deciding**, not to assume that "M&A" or "upmarket" automatically equals "separate motion." The label is a prompt to investigate; the physics are the verdict.

A corollary: physics can converge over time, too. An upmarket motion that started as a genuinely distinct enterprise pursuit can, after two years of product maturity and brand build, start to look much more like the core motion — shorter cycles, fewer stakeholders, more inbound. When that happens, the correct move is to *re-merge*, and a good CRO is not too proud to do it.

## The Motion Separation Test: A 6-Factor Diagnostic

Here is the diagnostic rubric. Score the candidate second motion (the upmarket or M&A segment) against the core motion on six factors. Each factor scores 0 (no meaningful divergence) or 1 (clear, structural divergence). A total of **4 or higher** means the physics have diverged enough that a separate motion is warranted *if* the funding floor is also cleared (next section). A score of 3 or below means run one motion with a documented branch.

**Factor 1 — Buyer persona divergence.** Is the economic buyer a different person with a different problem? An organic motion selling to a VP of Marketing and an upmarket motion selling to a CMO with a procurement team are arguably the same persona at different altitudes — score 0 or borderline. An organic motion selling to a Head of Support and an M&A-cross-sell motion selling to a CFO is a true persona divergence — score 1.

**Factor 2 — Deal-size delta of 3x or more.** Compare median ACV, not mean (means are distorted by whales). If the upmarket median is less than 3x the organic median, the pricing, packaging, and approval mechanics are probably close enough to share. At 3x or more, the discount governance, CPQ complexity, and deal-desk involvement diverge structurally. Score 1 at 3x+.

**Factor 3 — Sales-cycle delta of 2x or more.** Compare median days from opportunity-created to closed-won. A 2x delta (e.g., 40 days vs 85+ days) changes pipeline coverage ratios, forecast cadence, rep capacity math, and the entire rhythm of the motion. Score 1 at 2x+.

**Factor 4 — Rep skill non-transferability.** Can a strong rep from the core motion be dropped into the candidate motion and succeed within one ramp cycle? If yes, it is one motion with coaching. If the skill sets are genuinely non-transferable — a transactional velocity closer cannot run a multi-threaded, exec-sponsored, procurement-gated enterprise pursuit, and vice versa, a patient enterprise rep is miserable and unproductive in a high-volume velocity seat — score 1.

**Factor 5 — Qualification-criteria conflict.** Run the same qualification framework against deals in both segments. If the same fields produce sensible, consistent go/no-go answers across both, score 0. If the frameworks conflict — a deal that is "qualified" under the velocity rubric is "unqualified" under the enterprise rubric, or the frameworks need entirely different fields — score 1.

**Factor 6 — The segment can fund a pod.** This is both a separation factor and the funding floor (detailed next). Can the candidate segment, at realistic penetration, fund at least 3 quota-carrying reps plus a manager at target? Score 1 if yes.

Add the six. **4-6: separate the motion** (assuming Factor 6 is part of the 4). **3: borderline — strongly prefer a documented branch within one motion, revisit in two quarters.** **0-2: one motion, full stop — any separation is premature.** The rubric is deliberately strict because the cost of premature separation is high and asymmetric.

## The Funding Floor: Can You Actually Afford to Separate?

A motion is not just a process — it is an org unit that consumes headcount, management, enablement, and forecast attention. The funding floor is the question of whether the candidate segment generates enough revenue to *sustain* its own org unit without starving either team.

The math: a healthy sales pod is **at least 3 quota-carrying reps plus 1 first-line manager**. Fewer than 3 reps and the manager has nothing to manage, ramp risk is uninsurable (one rep ramping or churning is a 33%+ capacity hit), and the pod cannot absorb normal variance. Translate that to pipeline: if a separated upmarket rep carries a $1.0M-$1.4M annual quota, three reps need to *reliably* close $3M-$4.2M, which at a 25-30% win rate and realistic ramp implies you need **$8M-$12M of addressable, workable annual pipeline** in that segment before separation is sustainable. Below that floor, you are not building a motion — you are building a sub-scale team that will chronically miss, churn reps, and burn the CRO's credibility.

This is why **Factor 6 in the rubric is a gate, not just a point.** A segment can score 5 of 5 on the physics factors — genuinely different buyer, deal size, cycle, skills, qualification — and still be the wrong thing to separate, because it only supports 1.5 reps' worth of pipeline. In that case the right structure is an **overlay specialist** (covered below), not a separate org. The physics say "different motion"; the economics say "cannot afford a separate org yet." Both are true simultaneously, and the resolution is the overlay.

A second funding consideration is **management load**. A separate motion needs its own first-line leader who actually understands its physics. A velocity manager cannot effectively coach enterprise pursuits and will revert the team to velocity habits; an enterprise manager will over-engineer velocity deals and crush throughput. If you cannot fund or hire a dedicated, motion-appropriate manager, you cannot truly separate — you can only create a sub-team that the wrong manager will slowly break.

The funding floor also implies a **sequencing rule**: most companies hit the physics-divergence threshold (rubric 4+) *before* they hit the funding floor. That gap — divergent physics, insufficient scale — is exactly the zone the overlay model is built for, and it is where most CROs should live for 2-4 quarters before formalizing an org.

## Overlay Before Org: The De-Risking Sequence

The highest-leverage move in this entire decision is recognizing that "separate motion" and "separate org" are not the same step, and you should almost always do them in sequence rather than simultaneously.

The sequence has four stages. **Stage 1 — Documented branch.** Before anything structural, document the fork inside the existing process: at the qualification stage, deals matching the upmarket/M&A profile follow a different qualification checklist, a different stage path, and a different forecast category. Same reps, same manager, same CRM org — but the data now lets you *see* the second motion as a distinct thing. This costs almost nothing and is reversible.

**Stage 2 — Overlay specialists.** Hire or designate 1-2 specialist reps who ride alongside the core team and get pulled into deals matching the second motion's profile. The overlay does not own a territory; they own a *motion-shaped slice* of deals across the whole team's accounts. The core rep stays on the deal (and on the comp credit, partially), the overlay brings the specialized skill. This proves the second motion's physics and economics with minimal org disruption and full reversibility. It also *builds the bench* — your future separate-motion manager and senior reps are most likely to come from this overlay pool.

**Stage 3 — Instrumented separate forecast.** Run the second motion as a fully separate forecast category for 2-3 quarters: separate pipeline coverage targets, separate win-rate tracking, separate cycle-time tracking, separate quota attainment for the overlays. This is the evidence base. You are looking for two things: does the segment independently clear the funding floor on a trailing-twelve-months basis, and is the rubric-4+ separation score *stable* (not a one-quarter artifact of a single big deal)?

**Stage 4 — Formalize the org.** Only when Stages 1-3 have produced 2-3 quarters of evidence that the physics are genuinely divergent *and* the segment clears the funding floor do you stand up a separate org: dedicated reps, dedicated manager, dedicated comp plan, dedicated enablement track, formal handoff rules with the core team.

The reason this sequencing matters: it converts a high-stakes, hard-to-reverse org decision into a series of cheap, reversible experiments. The CRO who jumps straight from "I think we have two motions" to "here is the new Enterprise org chart" is gambling. The CRO who runs the overlay-before-org sequence is collecting evidence and de-risking. The only situations that justify skipping straight to Stage 4 are when a large M&A event drops a fully-formed, clearly-distinct revenue base on day one (the acquired company's enterprise team comes with the deal), or when the board has explicitly funded a strategic upmarket bet ahead of the organic numbers — and even then, the smart CRO instruments it like Stage 3 from day one.

## Qualification Frameworks: One Rubric or Two?

The qualification question is where force-fitting does its quietest damage, so it deserves specific treatment. The principle: **qualification frameworks should match the motion's physics, and a separated motion almost always needs its own.**

A velocity / organic motion — short cycle, one-to-two stakeholders, deal sizes that do not trigger procurement — is best served by a *lightweight, speed-preserving* framework. SPICED (Situation, Pain, Impact, Critical event, Decision) or a tight BANT variant works because the rep needs to qualify in one or two calls and the cost of a heavy framework is lost velocity and reps gaming the CRM fields. Over-qualifying a velocity motion is itself a force-fit: you slow the motion down to fit a rubric built for bigger deals.

An upmarket / enterprise / M&A-cross-sell motion — long cycle, five-plus stakeholders, procurement, security review, exec sponsorship — needs a *heavyweight, multi-threading* framework. MEDDICC or MEDDPICC earns its weight here: Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion, Competition (plus Paper process in MEDDPICC). The whole point of MEDDICC is to force reps to multi-thread, to find the economic buyer, and to map the paper process — exactly the things that kill enterprise deals when missed and exactly the things a velocity rubric does not even ask about.

The force-fit failure mode runs in both directions. Run MEDDICC on a velocity motion and reps either ignore it (so the data is fiction) or comply with it (so the motion slows and throughput drops). Run BANT on an enterprise motion and reps mark deals "qualified" with a budget and a timeline but no champion, no economic-buyer access, and no mapped decision process — and those deals slip, slip, slip, and then die at the procurement stage that BANT never made anyone investigate.

The practical implementation: if you have separated the motion (rubric 4+, funding floor cleared), give each motion its own qualification framework, its own CRM-required fields, and its own stage-exit criteria. If you are still in the branch / overlay phase, run *one base framework with a heavier qualification gate on the upmarket branch* — for example, SPICED for everyone, plus three additional required MEDDICC fields (Economic buyer, Decision process, Champion) that unlock only on the upmarket record type. This gives you the multi-threading discipline where you need it without maintaining two full frameworks before you have committed to the separation.

## Pipeline Stages, Forecast Categories, and the Data Layer

Whatever you decide about org structure, the data layer should reflect the motion reality *first* — because clean data is what lets you make and revisit the org decision intelligently.

**Pipeline stages.** Two genuinely separate motions should have separate stage definitions, because the stages encode the buying process and the buying processes differ. A velocity motion might run Discover / Demo / Proposal / Commit / Close — five stages, fast. An enterprise motion might run Discover / Validate / Business-case / Procurement / Legal / Commit / Close — seven stages, with explicit procurement and legal stages that the velocity motion does not have. Forcing both into one stage set means either the velocity motion has dead stages it skips (which corrupts conversion math) or the enterprise motion has compressed stages that hide procurement risk (which corrupts the forecast). Use Salesforce record types and separate sales paths so each motion sees only its own stages.

**Forecast categories.** This is non-negotiable even in the branch/overlay phase: the second motion must be its own forecast category or forecast dimension from day one. You cannot make a good separation decision if the upmarket pipeline is blended invisibly into the core forecast. Separate categories let you track coverage ratio, win rate, slippage, and cycle time independently — which is the entire evidence base for Stages 3 and 4 of the sequencing model.

**Coverage ratios.** Different motions need different pipeline-coverage targets. A high-win-rate velocity motion might be healthy at 3x coverage; a lower-win-rate, longer-cycle enterprise motion might need 4-5x. Blending them produces a blended coverage number that is wrong for both — you will look over-covered on enterprise and under-covered on velocity, or vice versa, and staff to the wrong number.

**Attribution and account mapping (the M&A-specific layer).** An M&A-driven motion adds a data problem the organic motion does not have: deduplicating accounts across two CRMs, mapping the acquired customer base, deciding which acquired accounts are "house accounts" versus "open territory," and preventing the embarrassing scenario where two reps from the two legacy orgs both call the same account. This is a RevOps project with a hard deadline, and it should be scoped and resourced *before* the M&A revenue is folded into any motion, separate or merged. Many M&A "motion" failures are actually just data-hygiene failures wearing a motion costume.

The discipline: **instrument first, organize second.** The data layer should reflect motion reality a quarter or two before the org chart does.

## Comp Design: The Comp Plan Follows the Motion

Compensation is where motion decisions become real to reps, and it is where force-fitting causes the fastest, most visible damage. The principle: **comp follows the motion, not the title or the seniority band.**

If you separate a motion, you separate the comp plan — and that means separate quotas, separate accelerators, separate ramp curves, and often separate OTE mix. A velocity motion supports a higher-volume quota with a flatter accelerator and a faster ramp (a velocity rep should be near full productivity in one to two quarters). An enterprise motion needs a lower deal-count quota, a steeper accelerator (to reward the rep who lands the rare big deal), a longer ramp (three to four quarters is normal because the cycle itself is long), and frequently a richer base-to-variable ratio because the deal cadence is lumpy and reps cannot live on a pure-eat-what-you-kill plan when deals close quarterly, not weekly.

The classic force-fit comp failures: putting an enterprise rep on a velocity quota means they are structurally underwater for two quarters before their first big deal lands, they panic, they down-sell to hit activity metrics, and they churn. Putting a velocity rep on an enterprise quota and ramp means they coast — the quota is too easy on a per-deal basis and the long ramp removes urgency. And the cross-motion credit problem in the overlay phase is its own minefield: when an overlay specialist gets pulled into a core rep's deal, who gets the credit? The answer that works is **shared credit with a defined split** — the core rep keeps territory credit and a partial commission, the overlay earns a specialist commission, and the split is documented so it does not get re-litigated on every deal. Get this wrong and reps either hoard deals away from the overlay (killing the second motion's development) or dump everything on the overlay to offload risk (overloading the specialist and corrupting the data).

A subtle but important rule: **do not let comp drive the motion decision backward.** Sometimes a CRO avoids separating a clearly-distinct motion because re-cutting comp mid-year is painful and unpopular. That is the comp tail wagging the strategy dog. If the rubric says 4+ and the funding floor is cleared, the comp redesign is a cost of doing the right thing, not a reason to avoid it. Conversely, do not separate a motion *just* because a few reps want a richer enterprise comp plan — the motion decision is made on physics and economics, and comp follows it.

There is also a quota-setting subtlety unique to the two-motion org: the two motions need *different quota-setting methodologies*, not just different quota numbers. A velocity motion's quota is best set bottoms-up from capacity math — productivity per rep per ramp stage times rep count — because the deal flow is high-volume and statistically stable, so capacity planning is reliable. An enterprise motion's quota cannot be set the same way, because the deal flow is lumpy and low-count; setting an enterprise quota purely on capacity math produces a number that is either unreachable in a slow quarter or trivially beaten when two big deals happen to land together. Enterprise quota-setting has to blend capacity math with named-account potential — a top-down view of which specific target accounts are realistically in play this year — and it has to build in more tolerance for quarterly variance, often through annualized or rolling-four-quarter attainment measurement rather than strict quarterly cliffs. A CRO who applies one quota-setting methodology across both motions will systematically mis-set one of them, and a mis-set quota corrupts everything downstream: it distorts hiring math, it distorts the forecast, and it drives the wrong rep behavior. So "comp follows the motion" extends past plan design into the quota-setting process itself.

## Org Design: Pods, Overlays, and the Handoff Seam

Once you have decided to separate (rubric 4+, funding floor cleared, overlay phase validated), the org-design choices are about minimizing the friction at the seam between the two motions.

**The pod model.** A separated motion is best stood up as a self-contained pod: 3+ reps, 1 first-line manager who understands the motion's physics, dedicated or shared-but-aligned SDR/BDR support, and a named deal-desk or solutions-engineering resource. The pod owns its motion end to end. The anti-pattern is a "matrixed" enterprise team where reps report to one manager but are coached by another and forecast into a third structure — matrix org charts are where motion clarity goes to die.

**The handoff seam.** The single most contentious operational issue in a two-motion org is the seam: what happens when an organic-motion rep is working an account that turns out to be an upmarket opportunity, or when an upmarket account's expansion is actually a velocity deal? You need explicit, written handoff rules: a trigger definition (e.g., "any deal where ACV exceeds $X *and* stakeholder count exceeds Y routes to the upmarket pod"), a credit-sharing rule for the handoff, and an SLA on response time so handed-off deals do not rot. Without written rules, the seam becomes a political battlefield and good deals fall through it.

**Account ownership in the M&A case.** When the second motion is M&A-driven, org design must also resolve account ownership across the legacy orgs: who owns the acquired company's existing customers, who owns *cross-sell* into them, and who owns net-new in the acquired company's segment. The cleanest pattern is usually: acquired-base renewals and simple expansions stay with whoever has the relationship (often acquired-company reps), cross-sell of the acquirer's products into the acquired base becomes a defined upmarket-pod motion, and net-new follows whatever segment-aligned motion fits its physics.

**Leadership.** Each motion needs a leader who has actually run that motion. Do not put a lifelong enterprise leader over a velocity pod or vice versa — they will, with the best intentions, revert the pod to the motion they know. If you cannot hire or promote a motion-appropriate leader, that is a strong signal you are not ready to separate.

## Stage-by-Stage Evolution: How the Right Answer Changes With Scale

The correct answer to "two motions or one" is not static — it migrates predictably as the company scales, and a CRO should expect to revisit it.

**Sub-$3M ARR.** Almost always one motion, founder-led or near-founder-led. You do not have the headcount budget or the pipeline volume to fund a second pod, and you do not yet have enough data to know if a second motion's physics are real or just noise. Even if a few upmarket deals are coming in, run them through one process; the founder or the best rep handles the big ones. Separation here is premature by definition.

**$3M-$10M ARR.** This is the *branch and overlay* zone. You likely start to see genuine physics divergence — an upmarket segment that looks structurally different — but you almost certainly cannot yet fund a separate pod. This is exactly where Stages 1-2 of the sequencing model live: document the branch, add 1-2 overlay specialists, instrument the separate forecast. Most companies that fail here fail by separating too early — standing up an "enterprise team" of two reps that cannot hit the funding floor.

**$10M-$30M ARR.** This is where genuine separation usually becomes both warranted and affordable. If the upmarket or M&A segment has been instrumented through the overlay phase and is independently clearing the funding floor with a stable rubric-4+ score, formalize the pod. Many companies hit their first real two-motion org structure in this band. This is also where the seam-management discipline (handoff rules, credit sharing) becomes essential because the volume across the seam is now material.

**$30M-$100M ARR.** Motions tend to *multiply* here, not just split into two. You may now have velocity, mid-market, enterprise, partner/channel, and a customer-base expansion motion — each potentially its own pod or org. The CRO's job shifts from "should I separate" to "how many motions can I afford to run well, and which ones should I deliberately *not* run" (the focus discipline). M&A activity in this band frequently adds whole motions at once.

**$100M+ ARR.** Motions are now full organizations with their own VPs, their own enablement, their own ops. The original question — "two or one" — has long since been answered; the live questions are portfolio-level: which motions to invest in, which to harvest, which to sunset, and how to prevent the motions from competing destructively for the same accounts.

The meta-rule: **revisit the decision every two quarters.** Physics that justified separation can converge; segments that were too small to fund a pod can grow into one; an M&A integration that needed a separate motion for two years can be absorbed once the systems and brand merge. A good CRO treats the motion structure as a living decision, not a one-time architecture.

One nuance worth naming inside this evolution: the *transition quarters* between bands are the most dangerous. The company at $9M ARR that is one quarter from clearing the funding floor faces the strongest pull to "just separate now" — and that is precisely the moment to hold the line and finish the overlay phase, because separating one quarter early still strands a sub-scale pod for two or three quarters while it grows into the floor. Similarly, the company crossing from "$30M-$100M, motions multiply" into the high end of that band faces a different transition risk: motions proliferate faster than leadership and instrumentation can keep up, and the CRO ends up with five named motions but only the bandwidth and data to govern three well. The discipline at every transition is the same — let the rubric and the funding floor, not the calendar or the ambition, decide when the structure changes, and accept that the structure should lag the metric, never lead it.

## Why Force-Fitting Fails Slowly — and Why That Makes It Dangerous

It is worth dwelling on the *mechanism* of force-fitting failure, because its slowness is exactly what makes it dangerous and exactly why CROs underweight it relative to premature separation. Premature separation fails loudly and fast: within two or three quarters, the sub-scale pod is visibly missing quota, the comp budget is visibly blown, and everyone can see the problem. Force-fitting fails quietly and over a year or more, through a chain of second-order effects that each look like something else. First, the forecast for the misfit segment drifts — deals sit in "Commit" and then die at a procurement stage the velocity pipeline never modeled, so the CRO starts to distrust the forecast generally, not realizing the rot is localized to one segment. Second, win rates on the misfit segment look mysteriously bad, and because the data is blended, nobody can see *why* — it just looks like "enterprise is hard." Third, the reps best suited to the misfit motion get frustrated — the enterprise seller on a velocity process keeps getting measured on activity metrics that do not fit a 100-day cycle — and the best of them leave, which the CRO attributes to normal attrition rather than a structural mismatch. Fourth, the misfit pipeline is *misqualified* at the source, because a single qualification framework was applied to both motions, so even the deals that do close were partly luck. By the time the pattern is legible, the CRO has lost a year, several good reps, and the board's confidence in the upmarket story. The framework's defense against this is the instrumentation discipline: a *separate forecast category from day one* makes the localized rot visible before it spreads, turning a slow invisible failure into an early, legible signal. The lesson for the CRO is to weight the two failure modes equally despite their very different tempos — the quiet one is not the smaller one.

## Demand Generation: The Top-of-Funnel Difference Between Motions

A motion is not just how a deal is *closed* — it is also how it is *created*, and the demand-generation physics are frequently the first place organic and upmarket motions diverge in ways a CRO underweights. An organic / velocity motion typically runs on inbound, content, product-led signups, and a high volume of relatively low-touch leads; the marketing-to-sales handoff is fast, the lead-to-opportunity conversion is the key metric, and the SDR/BDR layer (if it exists at all) is doing speed-to-lead and light qualification. An upmarket or M&A-cross-sell motion runs on fundamentally different fuel: named-account outbound, account-based marketing orchestrated across a buying committee, executive events and dinners, partner-sourced introductions, and a much longer nurture before a deal is even an opportunity. The implication for the "two motions or one" decision is that **if the two segments require genuinely different demand-gen engines, that is itself a strong signal of divergent physics** — arguably it should inform Factor 1 and Factor 3 of the rubric. It also means a separation decision that stops at the AE layer is incomplete: separating the closing reps while leaving a single blended demand-gen engine produces an upmarket pod that is starved of motion-appropriate pipeline. The corollary for the merged / branch model is that you can run one demand-gen engine with a *routing rule* — inbound and product-led signups flow to the velocity path, named-account ABM and partner-sourced deals flow to the upmarket branch — but the routing logic has to be explicit, instrumented, and owned, or the upmarket branch quietly gets fed velocity-shaped leads and then mysteriously underperforms. A CRO evaluating motion separation should always ask the demand-gen leader: "if I separate the closing motion, what does the top of the funnel have to look like, and can we afford to build it?" The answer frequently reveals that the true cost of separation is larger than the AE-headcount math alone suggests.

## SDR and BDR Structure Across Two Motions

The development-rep layer deserves its own treatment because it is where two-motion orgs most often build the wrong structure. There are three viable patterns and one common anti-pattern. Pattern one — **shared SDR pool with routing** — keeps all SDRs in one team and routes leads to velocity or upmarket AEs based on firmographic and behavioral rules; this is correct in the branch/overlay phase and at smaller scale, because it preserves flexibility and you cannot yet fund dedicated development reps per motion. Pattern two — **dedicated SDRs per motion** — assigns SDRs permanently to the velocity pod or the upmarket pod; this becomes correct once each motion clears the funding floor, because the *prospecting* skill also diverges: a velocity SDR optimizing for speed-to-lead and volume is doing a different job than an upmarket SDR researching a named account, mapping a buying committee, and running a multi-touch outbound sequence to a CFO. Pattern three — **outbound vs inbound split that cuts across motions** — sometimes works at large scale where the inbound team feeds both motions' velocity-shaped deals and a separate outbound team feeds both motions' enterprise-shaped deals. The anti-pattern is the **undifferentiated SDR team measured on a single blended metric** (e.g., "meetings booked") feeding a two-motion AE org: this guarantees the upmarket pod gets under-researched, velocity-shaped meetings because that is what maximizes the SDR's blended metric, and the upmarket AEs spend their time disqualifying junk. The rule that ties this to the framework: **the SDR layer should separate roughly one stage *behind* the AE layer.** When you are still running one AE motion with a branch, keep one SDR pool with routing. When you formalize a separate AE pod (Stage 4), that is the trigger to start dedicating SDRs to it — and to give the upmarket SDRs their own activity model, their own comp (often a higher base, lower volume target, credited on pipeline quality not just quantity), and their own enablement.

## Enablement and Onboarding: One Curriculum or Two?

Enablement is the operational system that makes a motion repeatable across reps, and it is one of the most expensive things to maintain — which is why "one curriculum or two" is a real cost question, not an afterthought. In a single-motion-with-branch structure, you run one core onboarding curriculum plus a **branch module**: every rep learns the base motion, and reps who will touch the upmarket branch get an additional module on the heavier qualification fields, multi-threading, the procurement and security-review stages, and the larger-deal pricing and approval mechanics. This is efficient and it keeps every rep cross-trained, which preserves the optionality to re-merge later. In a fully separated two-motion org, you run **two genuinely distinct curricula**: the velocity curriculum optimizes for fast ramp, objection handling at speed, and high-volume pipeline management; the enterprise curriculum optimizes for account research, business-case construction, executive presence, navigating procurement and legal, and managing a 90-to-120-day pursuit without losing momentum. The ramp *itself* differs — a velocity rep should be productive in one to two quarters and the onboarding is front-loaded; an enterprise rep ramps over three to four quarters and the enablement has to be sustained, not front-loaded, because the rep will not even see a full deal cycle until quarter two. The expensive mistake here is running one curriculum for a genuinely separated org: the velocity-trained enterprise rep multi-threads poorly and gets surprised by procurement, while the enterprise-trained velocity rep over-engineers small deals and tanks throughput. The other expensive mistake is the reverse — building two full curricula before you have actually separated the motion, which doubles enablement cost during the very phase when you should be staying cheap and reversible. The framework rule: **enablement structure follows the org decision, with a one-quarter lag** — build the branch module during the branch phase, build the second full curriculum only after Stage 4 formalization.

## Real-World Scenario 1: The Premature Enterprise Team

A Series B infrastructure-software company at $7M ARR has a healthy velocity motion: $22K median ACV, 38-day median cycle, mostly inbound and PLG-assisted, reps ramping in one quarter. The board pushes "go enterprise." The CRO, eager to show upmarket progress, hires a VP of Enterprise and three enterprise AEs, gives them $1.2M quotas, and carves out the largest 400 accounts.

The physics divergence was real — the CRO's rubric would have scored 5 of 6 on persona, deal size, cycle, skill, and qualification. But Factor 6, the funding floor, was a hard fail: the actual workable upmarket pipeline was about $4M, not the $10M+ needed to sustain three reps plus a VP. Eighteen months later, the enterprise team has closed a handful of deals, all three AEs are below 60% of quota, the VP is managing a sub-scale team, and the comp budget is blown. Worse, collapsing the team back is now politically toxic — it reads as a failed strategy and a demotion for the VP.

**What the framework would have said:** rubric scored 5 on physics but failed Factor 6, so the verdict was *overlay, not org*. The right move was 1-2 enterprise overlay specialists riding the existing team, a separate forecast category, and a two-to-three-quarter wait to see if the segment grew into the funding floor. The lesson: **physics divergence is necessary but not sufficient — the funding floor is a gate, and skipping it is the most expensive common mistake in this entire decision.**

## Real-World Scenario 2: The Terminal Force-Fit After an Acquisition

A $40M-ARR vertical SaaS company acquires a smaller competitor for its $9M-ARR customer base. The acquired company sold a different product to a different buyer — the acquirer sold to operations leaders at $30K ACV with 45-day cycles; the acquired product sold to finance leaders at $110K ACV with 100-day cycles, procurement, and security review.

The CRO, wanting a "clean integration," folds the acquired reps and the acquired motion into the existing org, puts everyone on the existing velocity process, the existing BANT qualification, and the existing five-stage pipeline. Within two quarters: the forecast for the acquired segment is wildly inaccurate (the velocity stages do not capture procurement or security review, so deals look "Commit" and then die), the acquired reps — who were enterprise sellers — are demoralized by velocity activity metrics, the best of them leave, and the $9M base starts to churn because nobody is running the longer, relationship-heavy motion it needs.

**What the framework would have said:** the rubric scored 6 of 6 — different buyer, 3.6x deal size, 2.2x cycle, non-transferable skills, conflicting qualification, and at $9M of base revenue the funding floor was clearly cleared. This was an unambiguous *separate the motion* — and uniquely, a case that justified skipping straight to Stage 4, because the acquisition delivered a fully-formed, clearly-distinct revenue base and an experienced team on day one. The force-fit destroyed value that the framework would have preserved. The lesson: **an M&A event can hand you a complete second motion — folding it into the core "for simplicity" is the expensive choice, not the simple one.**

## Real-World Scenario 3: The Overlay That Worked

A $14M-ARR martech company notices that roughly 20% of its bookings come from deals that look structurally different: $90K ACV versus the $25K core, 80-day cycles versus 35, multi-stakeholder, often triggered by a competitive displacement. The CRO suspects a second motion but resists standing up an org.

Instead: Stage 1, the team documents an "upmarket branch" — deals over $60K ACV with 3+ stakeholders get a separate record type, a heavier qualification gate (SPICED plus three MEDDICC fields), and their own forecast category. Stage 2, the CRO promotes two strong AEs into overlay specialist roles; they get pulled into upmarket deals across the whole team, with a documented 60/40 credit split with the core rep. Stage 3, the upmarket forecast category runs separately for three quarters.

The data is decisive: the upmarket segment is growing 50% faster than the core, the overlays are crushing quota, and trailing-twelve-months upmarket bookings are now $11M — clearly above the funding floor. Stage 4: the CRO formalizes a four-rep upmarket pod with one of the overlay specialists promoted to manager. Because the motion was proven via overlay first, the org launch is low-drama, the bench is already built, and the forecast is trustworthy from day one.

**The lesson: overlay-before-org converts a high-stakes gamble into a sequence of cheap, reversible, evidence-generating experiments — and it builds the leadership bench as a side effect.**

## Real-World Scenario 4: The False Divergence

A $20M-ARR HR-software company is convinced it has two motions: an SMB motion and a "mid-market" motion. The CRO is about to split the team. Before doing so, they run the Motion Separation Test honestly.

The results are sobering. Buyer persona: same — a People Ops leader, just at a slightly bigger company (score 0). Deal size: mid-market median is $34K versus SMB $19K — only 1.8x, below the 3x threshold (score 0). Cycle: 52 days versus 41 days — 1.3x, below the 2x threshold (score 0). Skill transferability: strong SMB reps move into mid-market accounts and succeed within one ramp cycle (score 0). Qualification: the same SPICED framework works cleanly for both (score 0). Funding floor: technically yes, but irrelevant given the rest. **Total score: 0-1.** This is not two motions. It is one motion serving two segments that differ only in degree, not in physics.

The CRO does not split. Instead, they keep one motion, one process, one qualification framework — and simply tier territories so that more experienced reps carry more mid-market accounts. No new manager, no new comp plan, no new enablement track, no seam to manage.

**The lesson: the label "mid-market" or "upmarket" is a hypothesis, not a verdict. Many suspected second motions are actually one motion with segment variation — and the rubric exists precisely to catch the false divergence before it triggers an expensive, unnecessary reorg.**

## Real-World Scenario 5: The Motion That Re-Merged

A $60M-ARR security company stood up a separate enterprise motion three years ago — at the time, correctly: rubric 5, funding floor cleared, the overlay phase had validated it. The enterprise pod ran successfully for three years.

But the physics drifted. The product matured, the brand strengthened, and a category-defining analyst report drove a flood of inbound enterprise demand. Enterprise cycles compressed from 110 days to 65. Stakeholder counts dropped as the buying committee got more educated. The skill gap between the enterprise pod and the now-more-sophisticated core team narrowed. When the CRO re-ran the Motion Separation Test, the score had fallen to 2 — the physics had *converged*.

The CRO made the unglamorous but correct call: re-merge. The enterprise pod was folded back into a segment-tiered single motion, the enterprise manager took a larger combined team, and the separate comp plan was consolidated. It read internally as awkward for a quarter, but the data was unambiguous and the efficiency gain was real — one healthy motion instead of two with a costly seam between them.

**The lesson: separation is not permanent. Physics converge as well as diverge, and a CRO who treats the motion structure as a living decision — revisited every two quarters — will sometimes correctly re-merge what was once correctly separated. Being willing to undo a separation is as important as being disciplined about making one.**

## The M&A Variant in Depth: Why Acquisitions Are a Special Case

The question pairs "organic vs M&A/upmarket" deliberately, but M&A deserves its own treatment because an acquisition is the one scenario that can legitimately compress or even invert the normal sequencing. In the organic upmarket case, the second motion grows gradually, you have time to instrument it, and the overlay-before-org sequence is almost always right. In the M&A case, a fully-formed revenue base — sometimes with its own reps, its own pipeline, its own qualification habits, its own CRM — lands on day one. That changes three things. First, the funding floor may already be cleared on day one: if you acquire a company with $9M of ARR sold through a distinct motion, the segment is not "growing toward" the floor, it is already past it, which is the rare case that justifies skipping straight to Stage 4 of the sequencing model. Second, the *integration timeline* is externally imposed — you cannot run a leisurely 2-3 quarter overlay experiment when the two companies' systems, comp plans, and account assignments have to be reconciled by a board-promised integration date. Third, M&A introduces failure modes the organic case does not have: account collision (two reps from the two legacy orgs calling the same logo), comp-plan incompatibility (the acquired reps were on a different OTE structure and plan mechanics), CRM and data debt (deduplication, field mapping, pipeline-stage reconciliation), and cultural identity (the acquired team's loyalty to "their" motion). The framework still applies — you still run the Motion Separation Test on the acquired revenue — but the *answer* has only two clean outcomes and one trap. Clean outcome one: the acquired revenue has the same physics as the core (rubric 0-2), so it is not a second motion at all; it is an integration project, and the right move is to fold the acquired base into the existing motion and treat the rest as RevOps data work. Clean outcome two: the acquired revenue has genuinely divergent physics (rubric 4+) and already clears the funding floor, so you formalize it as a separate pod immediately, ideally retaining the acquired team's motion-appropriate leadership. The trap is the middle: a CRO who, for "integration simplicity," force-fits clearly-divergent acquired revenue into the core motion — which is Scenario 2 in this entry, and which destroys exactly the revenue synergy the acquisition was supposed to deliver. The M&A-specific discipline: run the rubric on the acquired revenue *before* the integration plan is finalized, because the integration plan should be downstream of the motion decision, not the other way around.

## Tooling Architecture: Enforcing the Decision in the Stack

A motion decision that is not enforced in the tooling is just a slide. Whatever the CRO decides, the RevOps stack has to make the decision real and hard to drift from. The core enforcement points: **Salesforce record types and sales paths** are the primary mechanism — separate record types for the velocity and upmarket motions mean each motion's reps see only their own stages, their own required fields, and their own exit criteria, which is what makes "one process with a branch" or "two separate processes" a real thing rather than an aspiration. **Validation rules** enforce the qualification framework — the upmarket record type can require the Economic Buyer, Decision Process, and Champion fields to be populated before a deal can advance past qualification, while the velocity record type stays light; this is how SPICED-vs-MEDDICC becomes structural rather than cultural. **Forecast categories** must be configured so the second motion rolls up as its own line — this is the non-negotiable instrumentation that powers the overlay-before-org evidence base and that lets the CRO see localized forecast rot before it spreads. **CPQ product rules and guided selling** prevent cross-motion mis-quoting — an organic-motion rep should be structurally unable to quote the enterprise platform bundle with enterprise-tier discounting, because the CPQ ruleset gates those products and price books to the upmarket record type; this also enforces discount governance, since the two motions almost always have different approval thresholds. **Routing and assignment rules** enforce the handoff seam — the trigger conditions for routing a deal from the velocity branch to the upmarket pod (ACV threshold plus stakeholder count, say) should be encoded as automated routing, not left to rep judgment, so the seam is consistent and auditable. **Revenue-intelligence tooling** (conversation intelligence and forecast analytics) should be configured to segment its analysis by motion, so win-rate, cycle-time, and slippage metrics are never reported blended. And in the M&A case, **a deduplication and account-mapping layer** has to be stood up before either motion is fed acquired data. The principle tying all of this together: the tooling should make the *correct* motion behavior the path of least resistance and the *incorrect* behavior (mis-quoting, mis-qualifying, skipping the handoff, blending the forecast) structurally difficult. A CRO who decides to separate motions but does not invest in the tooling enforcement will watch the org drift back toward an undifferentiated blend within two or three quarters, because without enforcement the easier behavior always wins.

## Board and CEO Communication: Selling the Framework Up

The motion-structure decision is not made in a vacuum — the board and CEO have opinions, usually strong ones, and usually biased toward "go enterprise, separate the team, show upmarket progress." A CRO who simply *resists* that pressure without giving the board a framework looks like they are dragging their feet on growth. A CRO who *capitulates* to it ends up owning a sub-scale enterprise team they did not believe in. The way through is to bring the board the framework itself, not just the conclusion. Concretely: present the Motion Separation Test as the company's standing methodology, show the board the current rubric score and — critically — the funding-floor math, and frame the overlay phase not as "not separating" but as "the de-risking stage before we commit headcount." Boards respond well to "we are running two enterprise overlay specialists this quarter, instrumenting the segment as a separate forecast category, and we will bring you the formal separation recommendation in Q3 with trailing-twelve-months evidence" — that reads as disciplined progress, not foot-dragging. It also reframes a future "we are not separating yet" from a failure into a data-driven checkpoint. The other communication discipline is to be explicit about the two failure modes *before* either happens, so that if you do hold off on separation and a competitor's "enterprise push" gets press, you have already inoculated the board against the premature-separation pressure. And if the board has genuinely, explicitly funded a strategic upmarket bet ahead of the organic numbers — sometimes a legitimate choice — make sure that decision is *named as such* in writing: it is a board-sponsored bet, not a CRO forecast commitment, and the success metrics and the patience window should be agreed up front. The worst outcome is an implicit strategic bet that later gets graded as if it were a normal quota commitment.

## How the CRO's Own Time and Span of Control Change

A subtle but real input to the decision is what it does to the CRO's own job. Running one motion with a branch means the CRO has one first-line manager (or a small set) reporting in, one forecast to inspect, one comp plan to manage, one enablement track to sponsor — the CRO's span of control is narrow and deep. Separating into two motions means two first-line managers, two forecasts with different cadences and coverage math, two comp plans, two enablement tracks, and a *seam* that only the CRO can ultimately arbitrate when the two managers disagree about an account. That is a materially bigger and more fragmented job. This matters for two reasons. First, it is a real cost that belongs in the separation decision: if the CRO does not have the bandwidth — or the second-line leadership bench — to run two motions well, then separating produces two *under-led* motions, which is worse than one well-led one. The honest question is "do I have, or can I hire, a motion-appropriate first-line leader for each motion, and do I have the personal bandwidth to govern the seam between them?" Second, it changes what the CRO should be doing day to day. In a one-motion org the CRO can stay relatively close to deals. In a two-motion org the CRO's primary value-add shifts to *governing the seam* — owning the handoff rules, arbitrating account disputes, making sure the two forecasts roll up into something the board can trust, and watching for the convergence/divergence signals that say it is time to re-merge or to split further. A CRO who separates the motions but keeps operating as a deal-level player will neglect the seam, and the seam is exactly where a two-motion org silently bleeds value.

## Common Pitfalls and How the Framework Prevents Them

Beyond the two headline failure modes — premature separation and terminal force-fitting — there is a recurring set of operational pitfalls that the framework is specifically built to catch. **Pitfall one: deciding on means instead of medians.** A handful of whale deals in the upmarket segment inflates the mean ACV and makes the deal-size delta look like 5x when the median is 2x; the rubric explicitly mandates medians for exactly this reason. **Pitfall two: one good quarter as evidence.** A single quarter where the upmarket segment cleared the funding floor — driven by one large deal — is not a signal; the 2-3 quarter instrumented-forecast window in the sequencing model exists to filter out this noise. **Pitfall three: separating the AE layer only.** As the demand-gen and SDR sections explain, a separation that stops at the closing reps starves the new pod of motion-appropriate pipeline; the framework's "separate completely" rule (Step 5) forces the demand-gen, SDR, enablement, and comp layers to move together. **Pitfall four: the half-separation drift.** CROs avoiding a hard call drift into a separate team *name* with shared everything else — the worst outcome, getting separation's overhead with none of its focus; the rubric's binary verdict (separate completely or run an honest branch) is designed to prevent the mushy middle. **Pitfall five: letting comp-redesign pain veto the right call.** Re-cutting comp mid-year is unpopular, so CROs sometimes avoid a clearly-warranted separation to dodge it; the framework treats comp redesign as a cost of doing the right thing, not an input to the decision. **Pitfall six: never revisiting.** A separation made correctly at $12M ARR can be wrong at $40M ARR after the physics converge; the every-two-quarters revisit cadence is a non-optional part of the framework, not a nice-to-have. **Pitfall seven: confusing a data-hygiene project with a motion.** An M&A integration whose acquired base sells with identical physics is an account-mapping project, not a second motion; the rubric scoring 0-2 catches this and saves the company from building permanent org overhead for a temporary problem. Each pitfall is a specific, observed way that smart CROs get this decision wrong — and each is countered by a specific, named element of the framework.

## The Decision Framework: Putting It All Together

Here is the full framework as a sequence a CRO can actually run.

**Step 1 — Instrument before you decide.** You cannot run the test without data. Tag the candidate segment in the CRM, create a separate forecast category, and collect at least one full quarter (ideally two) of deal-size, cycle-time, stakeholder-count, win-rate, and qualification data. If you do not have this data, the first action is not a reorg — it is instrumentation.

**Step 2 — Run the Motion Separation Test.** Score the six factors honestly: persona divergence, 3x deal-size delta, 2x cycle delta, skill non-transferability, qualification conflict, and the funding-floor factor. Be ruthless about using medians, not means, and about scoring 0 when divergence is "degree, not kind."

**Step 3 — Apply the verdict.** Score 0-2: one motion, no branch needed, tier territories at most. Score 3: one motion with a documented branch (separate record type, heavier qualification gate, separate forecast category) — revisit in two quarters. Score 4+ but Factor 6 (funding floor) fails: overlay, not org — add 1-2 specialists, instrument separately. Score 4+ with Factor 6 cleared: proceed toward separation, but still through the sequence.

**Step 4 — Run the overlay-before-org sequence.** Even when the verdict is "separate," sequence it: documented branch, then overlay specialists, then 2-3 quarters of instrumented separate forecast, then formalize the org. Skip straight to Stage 4 only when an M&A event delivers a complete, distinct revenue base and team on day one, or when the board has explicitly funded a strategic bet ahead of the numbers.

**Step 5 — If you separate, separate completely.** A real separation means: separate process and stages, separate qualification framework, separate comp plan (quota, accelerators, ramp), separate first-line manager who knows the motion, separate enablement track, and written handoff rules at the seam. Half-separations — separate name but shared everything else — get the costs of separation without the benefits.

**Step 6 — Revisit every two quarters.** Re-run the test. Segments grow into the funding floor; physics converge and diverge; M&A adds whole motions. The motion structure is a living decision.

The framework's whole purpose is to replace the ideological debate ("focused teams are better!" vs "don't fragment the org!") with an evidence-based, threshold-driven process that is honest about both failure modes and that sequences the decision to minimize irreversible risk.

## The 5-Year and AI Outlook

Three forces will reshape this decision over the next five years.

**AI-assisted selling compresses the skill gap between motions.** A large part of Factor 4 — rep skill non-transferability — exists because enterprise selling requires research, multi-threading discipline, business-case construction, and competitive intelligence that transactional reps have not built. AI sales copilots increasingly do the research, draft the business case, surface the stakeholder map, and prompt the multi-threading. As that matures, the skill gap narrows, which means Factor 4 will score 1 less often, which means *fewer* motions will clear the rubric-4 threshold on skill grounds. The likely net effect: a modest pull back toward unified motions with AI-assisted branches, because a single rep augmented by AI can credibly run a wider physics range than a single unaugmented rep could.

**AI-driven instrumentation makes the branch model cheaper and the data cleaner.** The overlay-before-org sequence depends on clean separate-forecast instrumentation. As CRMs get better at auto-classifying deals by motion, auto-detecting physics divergence, and flagging when a segment crosses a threshold, the cost of running the "documented branch" stage drops toward zero and the evidence base for separation gets sharper. This makes premature separation less excusable — the data to avoid it is more available.

**Deal-size and cycle physics themselves are shifting.** AI-assisted buying (buyers using AI to research and shortlist) is compressing some enterprise cycles and, in some categories, raising velocity-deal sizes as products do more. Both trends push the two motions' physics *closer together* in some segments — meaning the re-merge scenario (Scenario 5) will become more common, and CROs should expect to undo separations more often than they did historically.

**What does not change:** the funding-floor logic is structural, not technological. A pod still needs 3+ reps plus a manager to be healthy, and a segment still needs roughly $8M-$12M of workable pipeline to fund one. AI changes the skill and instrumentation factors; it does not repeal the economics of headcount. And the overlay-before-org sequencing remains the right risk posture regardless of tooling — it is a discipline about reversibility, not a technology choice.

Net five-year read: expect *slightly fewer* permanent motion separations, *more* AI-assisted branches within unified motions, *cleaner* data for making the call, and *more frequent* re-merges. The framework holds; the thresholds get easier to measure; the bias should shift marginally toward "one motion with a branch" until the physics clearly and durably diverge.

## The Final Framework: Score It, Fund-Test It, Overlay It, Org It

If a CRO remembers only one thing from this entire answer, it should be the four-word sequence: **score it, fund-test it, overlay it, org it.**

*Score it* — run the Motion Separation Test. Six factors, honest medians, 0-or-1 scoring. The physics decide whether two motions exist, not the org chart, not the marketing label, not the board's enthusiasm for "enterprise."

*Fund-test it* — apply the funding floor as a hard gate. A motion is an org unit; an org unit needs 3+ reps and a manager; that needs roughly $8M-$12M of workable pipeline. Physics divergence without funding-floor clearance means overlay, not org. Skipping this gate is the single most expensive common mistake.

*Overlay it* — sequence the decision. Documented branch, then overlay specialists, then instrumented separate forecast for 2-3 quarters. This converts an irreversible high-stakes reorg into reversible, evidence-generating experiments — and builds your leadership bench for free.

*Org it* — only after the sequence validates both the physics and the economics, formalize the separation, and when you do, separate *completely*: process, qualification, comp, management, enablement, and written seam rules. Half-separations are the worst of both worlds.

And then *revisit it* — every two quarters, because the right answer migrates with scale and with AI, and because being willing to re-merge a converged motion is as much a sign of a disciplined CRO as being willing to separate a diverged one.

The conventional wisdom — "separate your motions as you scale" — is not wrong, but it is dangerously incomplete. It is missing the funding-floor gate, the overlay sequencing, and the honesty that many suspected second motions are false divergences. The complete answer is not "separate" or "merge." It is a disciplined, threshold-driven, evidence-based process that respects both failure modes equally and sequences the decision to keep it reversible for as long as possible. That process — not a bias toward one structure or the other — is the actual framework a CRO needs.

A closing word on judgment versus mechanics. The rubric, the funding floor, and the sequencing model are mechanical on purpose — they exist to strip ambition, politics, and narrative bias out of a decision that is otherwise prone to all three. But the framework is a decision *aid*, not a decision *replacement*. The CRO still has to exercise judgment at the edges: a borderline rubric-3 in a market that is clearly bifurcating may warrant getting ahead of the curve; a clean rubric-4 in a business about to be reshaped by a pending acquisition may warrant waiting. The framework's real value is not that it makes the decision for you — it is that it forces you to make the decision *for the right reasons*, with the failure modes named, the economics tested, and the reversibility preserved. A CRO who runs this process honestly will still occasionally get the call wrong, because the future is uncertain. But they will get it wrong *recoverably* — they will have instrumented the segment, sequenced the commitment, and built in a revisit cadence — and recoverable wrongness, in a decision this consequential and this hard to reverse, is the actual goal. Score it, fund-test it, overlay it, org it, revisit it. That is the framework. Everything else is the discipline to actually run it when the board is impatient and the org chart is tempting.`;

const flow = `

## The Motion Separation Decision Tree

\`\`\`mermaid
flowchart TD
  A[CRO Suspects A Second Motion: Organic vs Upmarket or M and A] --> B[Step 1: Instrument]
  B --> B1[Tag Segment In CRM]
  B --> B2[Create Separate Forecast Category]
  B --> B3[Collect 1-2 Quarters Of Deal Data]
  B1 --> C[Step 2: Run The Motion Separation Test]
  B2 --> C
  B3 --> C
  C --> C1[Factor 1: Buyer Persona Divergence]
  C --> C2[Factor 2: Deal Size Delta 3x Or More]
  C --> C3[Factor 3: Sales Cycle Delta 2x Or More]
  C --> C4[Factor 4: Rep Skill Non Transferable]
  C --> C5[Factor 5: Qualification Criteria Conflict]
  C --> C6[Factor 6: Segment Can Fund A Pod]
  C1 --> D[Sum The Six Factors]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  C6 --> D
  D --> E{Score?}
  E -->|0 to 2| F[One Motion - Tier Territories Only - No Branch]
  E -->|3| G[One Motion With Documented Branch - Revisit In 2 Quarters]
  E -->|4 Plus But Factor 6 Fails| H[Overlay Not Org - Add 1-2 Specialists]
  E -->|4 Plus And Factor 6 Cleared| I[Proceed Toward Separation]
  G --> J[Separate Record Type Plus Heavier Qualification Gate]
  H --> K[Overlay Specialists Ride Existing Team]
  K --> L[Instrument Separate Forecast 2-3 Quarters]
  I --> L
  L --> M{Independently Clears Funding Floor And Rubric 4 Plus Stable?}
  M -->|No| N[Stay In Overlay - Revisit In 2 Quarters]
  M -->|Yes| O[Step 4: Formalize Separate Pod]
  O --> O1[Separate Process And Stages]
  O --> O2[Separate Qualification Framework]
  O --> O3[Separate Comp Plan Quota Ramp Accelerators]
  O --> O4[Dedicated Motion Appropriate Manager]
  O --> O5[Written Handoff Rules At The Seam]
  O1 --> P[Revisit Every Two Quarters - Physics May Re Converge]
  O2 --> P
  O3 --> P
  O4 --> P
  O5 --> P
  N --> P
  J --> P
  F --> P
\`\`\`

## One Motion vs Two Motions: Comparison Matrix

\`\`\`mermaid
flowchart LR
  subgraph SINGLE[One Motion With Branch]
    S1[Shared CRM And Top Of Funnel Stages]
    S2[One Qualification Base Plus Heavier Upmarket Gate]
    S3[One Comp Plan With Tiered Territories]
    S4[One First Line Manager]
    S5[Low Overhead - Reversible - Scales Simply]
    S6[Risk: Forecast Loses Predictive Power If Physics Truly Diverge]
    S7[Best Below 10M ARR Or Rubric Score 0-3]
  end
  subgraph DUAL[Two Separate Motions]
    D1[Separate Record Types And Stage Paths]
    D2[Separate Frameworks: SPICED Velocity vs MEDDICC Enterprise]
    D3[Separate Comp: Distinct Quota Ramp Accelerators]
    D4[Dedicated Motion Appropriate Managers]
    D5[Focus And Clean Data - But Doubled Overhead]
    D6[Risk: Premature Separation Strands Sub Scale Pods]
    D7[Best At 10M Plus ARR With Rubric 4 Plus And Funding Floor Cleared]
  end
  TEST[Motion Separation Test Score Plus Funding Floor] --> SINGLE
  TEST --> DUAL
  SINGLE -->|Physics Diverge And Segment Grows| DUAL
  DUAL -->|Physics Converge Via AI And Brand| SINGLE
  OVERLAY[Overlay Bridge: Specialists Ride Core Team] --> SINGLE
  OVERLAY --> DUAL
\`\`\`

`;

const src = `

## Sources

1. **MEDDIC / MEDDICC / MEDDPICC Qualification Methodology** — Enterprise sales qualification framework: Metrics, Economic buyer, Decision criteria, Decision process, (Paper process), Identify pain, Champion, Competition. https://meddicc.com
2. **SPICED Sales Methodology (Winning by Design)** — Situation, Pain, Impact, Critical event, Decision — lightweight qualification framework suited to velocity and recurring-revenue motions. https://winningbydesign.com
3. **Winning by Design — Bowtie Model and Revenue Architecture** — Framework for mapping distinct revenue motions and their conversion physics.
4. **The SaaS Sales Method (Winning by Design / Jacco van der Kooij)** — Motion design, sales-process stage definitions, and recurring-revenue selling mechanics.
5. **Mark Roberge — The Sales Acceleration Formula** — Hiring, ramp, and quota design for scaling sales organizations; velocity vs enterprise rep profiles.
6. **David Skok — For Entrepreneurs: SaaS Metrics and the Sales Capacity Model** — Pipeline coverage, quota capacity planning, and the math behind funding a sales pod. https://www.forentrepreneurs.com
7. **Bessemer Venture Partners — State of the Cloud and Scaling Go-To-Market** — Benchmarks on motion evolution, segment ACV bands, and when SaaS companies move upmarket.
8. **OpenView Partners — Product-Led Growth and Sales-Assist Benchmarks** — Velocity / PLG-assisted motion physics and the transition to sales-led upmarket motions.
9. **Pavilion (formerly Revenue Collective) — CRO and RevOps Operator Benchmarks** — Practitioner data on motion separation, pod structure, and segment-team sizing.
10. **SaaStr — Enterprise vs SMB Sales Motion Content (Jason Lemkin)** — Operator commentary on when and how to add an enterprise motion, and the cost of doing it too early.
11. **Force Management — Command of the Message and Value-Based Selling** — Enterprise pursuit discipline, multi-threading, and economic-buyer access.
12. **MEDDICC vs BANT Comparative Analysis** — When heavyweight vs lightweight qualification frameworks fit a motion's physics.
13. **Salesforce — Record Types, Sales Paths, and Opportunity Stage Configuration** — CRM mechanics for maintaining distinct processes and stage sets per motion. https://help.salesforce.com
14. **Salesforce — Forecast Categories and Collaborative Forecasting** — Configuring separate forecast categories per motion or segment.
15. **Salesforce CPQ — Product Rules and Guided Selling** — Ruleset configuration to prevent cross-motion mis-quoting (e.g., organic rep quoting an upmarket bundle).
16. **Gong / Clari — Revenue Intelligence and Forecast Analytics** — Instrumenting motion-level win rate, cycle time, and slippage for the separate-forecast evidence base.
17. **The Bridge Group — SaaS AE Metrics and Comp Benchmarks** — Ramp curves, quota-to-OTE ratios, and deal-size-to-cycle benchmarks across motion types.
18. **CSO Insights / Korn Ferry Sell — Sales Performance Studies** — Win rate, sales-cycle, and quota-attainment benchmarks by deal-size band.
19. **RevOps Co-op — Community Practitioner Benchmarks** — Operator data on territory carving, handoff-seam design, and motion instrumentation.
20. **Pavilion / Gong — Comp Plan Design for Velocity vs Enterprise Roles** — Accelerator structure, base-to-variable mix, and ramp design by motion.
21. **Harvard Business Review — Managing Multiple Sales Channels and Channel Conflict** — Seam management and handoff conflict between coexisting motions.
22. **McKinsey — B2B Go-to-Market and Sales Org Design** — Segment-aligned org structures and the economics of specialist vs generalist sales teams.
23. **Bain & Company — Post-Merger Integration of Commercial Organizations** — M&A-driven motion integration, account mapping, and cross-sell motion design.
24. **Deloitte / PwC — M&A Revenue Synergy and Commercial Integration Playbooks** — Cross-sell motion stand-up and acquired-base account ownership rules.
25. **Tomasz Tunguz (Theory Ventures / formerly Redpoint) — SaaS Go-to-Market Analysis** — Motion economics, segment ACV evolution, and sales-efficiency benchmarks.
26. **Kellblog (Dave Kellogg) — SaaS Metrics, Forecasting, and Sales Org Commentary** — Practitioner analysis of forecast categories, pipeline coverage, and motion design.
27. **Sales Hacker / GTMnow — Practitioner Content on Sales Motion Design** — Operator playbooks on velocity vs enterprise motions and overlay-specialist models.
28. **Winning by Design — Specialist Overlay and Pod Structure Models** — The overlay-before-org pattern and pod composition (reps-to-manager ratios).
29. **MEDDPICC Paper Process Discipline** — Procurement and legal-stage mapping that velocity qualification frameworks omit.
30. **Challenger / Gartner — The Challenger Sale and Buying-Group Dynamics** — Buying-committee size and stakeholder-count drivers behind enterprise-motion physics.
31. **Gartner — B2B Buying Journey Research** — Stakeholder counts (6-10+ in enterprise deals) underpinning Factor 1 and Factor 5 of the separation test.
32. **SiriusDecisions / Forrester — Demand Waterfall and Sales-Marketing Process Alignment** — Stage-definition discipline and conversion math across motions.
33. **CRO Operator Interviews — Pavilion and Topline Podcast Libraries** — First-hand accounts of premature-separation and force-fit failure modes.
34. **Annual Recurring Revenue and Sales Capacity Planning Models (Public SaaS S-1 Disclosures)** — Real-world data on segment-team sizing and motion separation timing at scale.
35. **HubSpot and Salesforce State of Sales Reports** — Cross-industry benchmarks on sales-cycle length and deal-size distribution by segment.
36. **Winning by Design — Revenue Architecture: Motion, Math, and Models** — Formal treatment of how many motions a revenue org can sustain and when to add one.

`;

const num = `

## Numbers

**The Funding Floor**
- Healthy sales pod minimum: 3 quota-carrying reps + 1 first-line manager
- Below 3 reps: one ramping/churning rep = 33%+ capacity hit — uninsurable variance
- Separated upmarket rep annual quota (illustrative): $1.0M-$1.4M
- Three reps must reliably close: $3.0M-$4.2M annually
- Implied workable annual pipeline to sustain a separate pod: $8M-$12M
- Below the funding floor: build an overlay, not an org

**The Motion Separation Test — Thresholds**
- Factor 2 deal-size delta threshold: 3x or more (median ACV, not mean)
- Factor 3 sales-cycle delta threshold: 2x or more (median days, opp-created to closed-won)
- Score 0-2: one motion, tier territories only
- Score 3: one motion with documented branch — revisit in 2 quarters
- Score 4+ but Factor 6 fails: overlay, not org
- Score 4+ with Factor 6 cleared: proceed toward separation

**Illustrative Motion Physics — Velocity vs Enterprise/Upmarket**
- Velocity/organic median ACV: ~$20K-$25K
- Upmarket/enterprise median ACV: ~$110K-$180K (often 3.5x-7x core)
- Velocity median cycle: ~35-45 days
- Enterprise median cycle: ~90-110+ days (often 2x-3x core)
- Velocity stakeholder count: 1-2
- Enterprise stakeholder count: 6-10+ (Gartner B2B buying-group research)
- Velocity rep ramp: ~1-2 quarters to full productivity
- Enterprise rep ramp: ~3-4 quarters to full productivity

**Pipeline Coverage by Motion**
- High-win-rate velocity motion: ~3x coverage can be healthy
- Lower-win-rate, longer-cycle enterprise motion: ~4x-5x coverage needed
- Blending the two produces a coverage number wrong for both

**Comp Design Deltas**
- Velocity: higher deal-count quota, flatter accelerator, faster ramp
- Enterprise: lower deal-count quota, steeper accelerator, longer ramp, often richer base-to-variable mix
- Overlay credit split (illustrative): ~60/40 core-rep / overlay-specialist, documented

**Stage-by-Stage Evolution by ARR**
- Sub-$3M ARR: almost always one motion (founder-led)
- $3M-$10M ARR: branch + overlay zone — separation usually premature here
- $10M-$30M ARR: genuine separation usually warranted and affordable
- $30M-$100M ARR: motions multiply (velocity, mid-market, enterprise, channel, expansion)
- $100M+ ARR: motions are full organizations with their own VPs

**Decision Cadence**
- Instrumentation before deciding: 1-2 quarters of deal data minimum
- Instrumented separate-forecast evidence window: 2-3 quarters
- Revisit the motion-structure decision: every 2 quarters

**Qualification Framework Fit**
- Velocity motion: SPICED or tight BANT (lightweight, speed-preserving)
- Enterprise/upmarket motion: MEDDICC or MEDDPICC (heavyweight, multi-threading)
- Branch phase compromise: SPICED base + 3 unlocked MEDDICC fields (Economic buyer, Decision process, Champion) on the upmarket record type

`;

const counter = `

## Counter-Case: When the Conventional "Separate Your Motions as You Scale" Wisdom Is Wrong

The standard advice — "as you scale, separate velocity from enterprise into distinct motions" — is a reasonable default, but a serious CRO should know the specific conditions under which it is actively wrong.

**Counter 1 — The false divergence: "upmarket" is often one motion with segment variation, not two motions.** The most common error is treating a label ("mid-market," "upmarket," "strategic") as proof of divergent physics. As Scenario 4 shows, a segment can be bigger in logo size yet score 0-1 on the separation test — same persona, sub-3x deal-size delta, sub-2x cycle delta, transferable skills, identical qualification. Separating it creates a manager, a comp plan, an enablement track, and a seam to manage — all overhead, no benefit. The conventional wisdom assumes divergence the rubric often disproves.

**Counter 2 — The funding floor overrides the physics.** Even a textbook-divergent second motion (rubric 5 of 6) is the wrong thing to *organizationally* separate if the segment cannot fund 3 reps plus a manager. The conventional advice says "separate"; the economics say "you will strand a sub-scale pod, blow the comp budget, and create two unhealthy teams instead of one healthy one." Physics divergence is necessary but not sufficient — and the conventional wisdom routinely omits the funding-floor gate entirely.

**Counter 3 — Premature separation is nearly irreversible in practice.** Standing up an "Enterprise org" with a VP and a comp plan is easy; collapsing it back is politically toxic — it reads as a failed strategy and a demotion. The conventional "separate early to build the muscle" advice underweights this asymmetry. Force-fitting is bad but quiet and reversible; premature separation is bad and sticky. When uncertain, the bias should be toward the reversible mistake.

**Counter 4 — At small scale, one motion with a founder/closer escalation beats two thin teams.** Below ~$10M ARR, the right structure for the occasional big deal is usually *not* a separate motion — it is one motion where the founder, the CRO, or the strongest rep escalates into the rare enterprise pursuit. Two sub-scale teams below the funding floor underperform one focused team plus an escalation path. The conventional wisdom's "separate as you scale" is right; its frequent companion "and start early" is wrong.

**Counter 5 — AI is compressing the rep-skill gap, which is shrinking the case for separation.** Factor 4 (skill non-transferability) is a major driver of the separation verdict. AI sales copilots increasingly handle the research, business-case drafting, stakeholder mapping, and multi-threading prompts that used to make enterprise selling a distinct skill. As that gap narrows, fewer segments clear the rubric on skill grounds, and a single AI-augmented rep can credibly span a wider physics range — pulling the optimal structure back toward unified motions with branches.

**Counter 6 — Physics converge, so some separations should be undone.** The conventional wisdom is unidirectional ("separate as you grow") and has no concept of re-merging. But as Scenario 5 shows, product maturity, brand strength, and category-defining analyst coverage compress enterprise cycles and shrink buying committees — the physics converge. A CRO dogmatically committed to "keep motions separate" will run two costly teams with a seam between them long after the data says to re-merge into one segment-tiered motion.

**Counter 7 — An M&A "motion" is sometimes just a data-hygiene project in disguise.** When an acquisition's customer base sells with the same physics as the core (same buyer, same deal size, same cycle), there is no second motion — there is an account-mapping, dedup, and territory-assignment project. Standing up a permanent "M&A cross-sell motion" for what is actually a one-time RevOps integration creates lasting overhead for a temporary problem. The conventional instinct to "build a motion around the acquisition" can be exactly backwards.

**Counter 8 — Half-separation is worse than either pure option.** The conventional advice rarely warns that a *partial* separation — separate team name but shared process, shared qualification, shared comp, shared manager — gets the doubled overhead and political friction of separation with none of the focus or clean-data benefits. If the rubric and funding floor say separate, separate *completely*; if they don't, run one motion with an honest branch. The mushy middle, which CROs drift into to avoid hard choices, is the genuinely worst outcome.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How does a founder design their first sales compensation plan? (Comp-follows-motion principle applied at the earliest stage.)
- **q9502** — When should a founder hire their first VP of Sales vs first sales reps? (Sequencing leadership against motion maturity.)
- **q9550** — How does a CRO build a sales capacity and quota model? (The math behind the funding floor and pod sizing.)
- **q9551** — What is the right pipeline coverage ratio by sales motion? (Motion-specific coverage targets referenced in the data layer section.)
- **q9552** — How does a RevOps team instrument forecast categories in Salesforce? (The instrumentation that enables the overlay-before-org sequence.)
- **q9553** — MEDDICC vs SPICED vs BANT — which qualification framework fits which motion? (Deep dive on the qualification-framework matching in this entry.)
- **q9554** — How do you design Salesforce record types and sales paths for multiple motions? (CRM mechanics for maintaining distinct processes.)
- **q9555** — How does a CRO set up a deal desk and discount governance? (Deal-desk involvement that scales with the deal-size delta.)
- **q9556** — How do you build an enterprise sales motion from a PLG / velocity base? (The specific organic-to-upmarket transition this entry frames.)
- **q9557** — What is the overlay specialist model and when should you use it? (The Stage-2 overlay role in the sequencing framework.)
- **q9559** — How does a CRO design handoff rules between sales segments? (The seam-management discipline for two-motion orgs.)
- **q9560** — How do you integrate two go-to-market organizations after an acquisition? (The M&A-driven motion and account-mapping deep dive.)
- **q9561** — How does a CRO design ramp curves and quotas for enterprise vs velocity reps? (Comp and ramp deltas between motions.)
- **q9562** — When should a CRO re-merge a separated sales motion? (The Scenario-5 re-merge decision in detail.)
- **q9563** — How do you build a forecast a board can trust across multiple motions? (Forecast-category discipline at portfolio scale.)
- **q9564** — How does a CRO manage channel conflict between coexisting sales motions? (Seam conflict and credit-sharing rules.)
- **q9570** — How do you size and structure a sales pod? (Reps-to-manager ratios and pod composition.)
- **q9580** — How does AI change the sales rep skill profile by 2030? (The AI-compresses-the-skill-gap counter-case, expanded.)
- **q9590** — How does a CRO decide which sales motions to sunset? (Portfolio-level motion decisions at $100M+ ARR.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (AI disruption of motion structure, adjacent context.)

`;

const tags = ['revops','sales-motion','cro-playbook','gtm-strategy','sales-org-design','qualification-framework','m-and-a-integration','enterprise-sales','comp-design','founder-led-sales'];

const sources = [
  { title: 'MEDDIC / MEDDICC Qualification Methodology', url: 'https://meddicc.com' },
  { title: 'SPICED Sales Methodology — Winning by Design', url: 'https://winningbydesign.com' },
  { title: 'David Skok — For Entrepreneurs: SaaS Sales Capacity Model', url: 'https://www.forentrepreneurs.com' }
];

const notes = {
  s6: 'Added 36 cited sources: qualification methodologies (MEDDIC/MEDDICC/MEDDPICC, SPICED, BANT, Challenger), motion-design frameworks (Winning by Design Revenue Architecture and Bowtie, The SaaS Sales Method, The Sales Acceleration Formula), capacity/economics references (David Skok sales capacity model, Bessemer State of the Cloud, OpenView PLG benchmarks, The Bridge Group AE metrics, CSO Insights), CRM/tooling mechanics (Salesforce record types, sales paths, forecast categories, CPQ product rules; Gong/Clari revenue intelligence), org-design and M&A integration (HBR channel conflict, McKinsey B2B GTM, Bain/Deloitte/PwC post-merger commercial integration), and practitioner communities (Pavilion, RevOps Co-op, SaaStr, Sales Hacker, Kellblog, Tomasz Tunguz).',
  s7: 'Added comprehensive numbers block: the funding floor (3 reps + 1 manager, $8M-$12M workable pipeline, $1.0M-$1.4M separated-rep quota), the Motion Separation Test thresholds (3x deal-size delta, 2x cycle delta, score bands 0-2 / 3 / 4+), illustrative motion physics (velocity $20K-$25K ACV / 35-45 day cycle / 1-2 stakeholders / 1-2 quarter ramp vs enterprise $110K-$180K ACV / 90-110+ day cycle / 6-10+ stakeholders / 3-4 quarter ramp), pipeline coverage by motion (3x velocity vs 4x-5x enterprise), comp deltas, the ARR-band evolution map (sub-$3M through $100M+), decision cadence (1-2 quarter instrumentation, 2-3 quarter evidence window, revisit every 2 quarters), and qualification-framework fit.',
  s8: 'Added 8-element counter-case challenging the conventional "separate your motions as you scale" wisdom: (1) false divergence — "upmarket" is often one motion with segment variation; (2) the funding floor overrides the physics; (3) premature separation is nearly irreversible and politically toxic; (4) at small scale one motion plus an escalation path beats two thin teams; (5) AI is compressing the rep-skill gap, shrinking the case for separation; (6) physics converge so some separations should be undone; (7) an M&A "motion" is sometimes just a data-hygiene project in disguise; (8) half-separation is worse than either pure option.',
  s9: 'Cross-linked 19 related Pulse entries across the q95xx CRO/RevOps operator-playbook cluster: comp design (q9501, q9561), leadership sequencing (q9502), capacity and pod sizing (q9550, q9570), pipeline coverage (q9551), forecast instrumentation (q9552, q9563), qualification frameworks (q9553), CRM/Salesforce mechanics (q9554), deal desk and discount governance (q9555), the organic-to-upmarket transition (q9556), the overlay specialist model (q9557), handoff/seam design (q9559, q9564), M&A GTM integration (q9560), re-merging motions (q9562), AI and rep skill profile (q9580), motion sunsetting (q9590), and SDR/AI disruption context (q1899).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the CRO framework for deciding whether to build two separate sales motions (organic vs M&A/upmarket) with distinct qualification rules or run one process. Two mermaid diagrams (the Motion Separation decision tree from instrumentation through revisit cadence; and the one-motion-vs-two-motions comparison matrix with the overlay bridge and convergence/divergence arrows). Full operator coverage: the real capital-allocation question behind the org-design question, precise definitions (motion/process/qualification/segment), the core principle (separate physics not labels), the 6-factor Motion Separation Test with explicit thresholds, the funding floor as a hard gate ($8M-$12M workable pipeline / 3 reps + manager), the overlay-before-org four-stage de-risking sequence, qualification-framework matching (SPICED velocity vs MEDDICC enterprise, plus the branch-phase compromise), the data layer (pipeline stages, forecast categories, coverage ratios, M&A account mapping), comp design (comp follows the motion), org design (pods, overlays, the handoff seam), stage-by-stage evolution by ARR band, five named real-world scenarios (premature enterprise team, terminal force-fit after acquisition, the overlay that worked, the false divergence, the motion that re-merged), the full six-step decision framework, a 5-year AI outlook, a final four-word framework (score it / fund-test it / overlay it / org it), an 8-element counter-case, comprehensive numbers block, 36 sources, and 19 cross-links.'
};

runPolish({ id: 'q9558', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
