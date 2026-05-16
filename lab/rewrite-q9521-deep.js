// q9521 — Should territory reassignment decisions be owned by the manager, the CRO, or a cross-functional committee?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** The question is a trap because it assumes territory reassignment is **one decision with one owner**. It is not. It is **three different decision types** that need three different owners. **Routine reassignments** — a rep leaves, an account moves segments, a new hire needs a patch — should be owned by the **front-line manager, executing within written guardrails**. **Structural redesigns** — the annual or semi-annual territory carve — should be owned by **RevOps as the process driver with the CRO as the approver**, with light cross-functional input from finance and segment leaders. **Contested decisions** — two reps both want a whale, a manager is hoarding good accounts, a dispute over a named account — should run through a **defined escalation process** that ends with the **CRO as final tie-breaker**. The connective tissue underneath all three is **RevOps owning the system**: the territory-design methodology, the account-scoring data, and above all the **Rules of Engagement document** — the written policy that pre-decides 70-85% of cases so most reassignments need zero debate. A pure "manager owns it" model fails because managers optimize locally — they protect their teams, hoard accounts, and cannot see the cross-org picture. A pure "CRO owns it" model fails because the CRO lacks granular account knowledge, becomes a bottleneck, and gets every rep escalating everything. A pure "committee owns it" model fails because committees are slow, diffuse accountability, and turn every reassignment into a negotiation that kills velocity. The right answer is a **layered governance model** with a clear RACI, a living Rules of Engagement document, a published escalation path, and an equity scorecard that measures whether the model is actually working — quota-capacity variance across reps, account-quality distribution, dispute rate, and rep attrition tied to territory grievances. The counter-case: in a genuinely small org — one team, under ~12 reps — the manager really can own it all, and building elaborate governance is over-engineering that substitutes process for the harder fix, which is usually that the territories themselves are just badly designed and need a real carve.`;

const core = `

## The Real Answer Up Front

Ask a room of revenue leaders "who should own territory reassignment — the manager, the CRO, or a committee?" and you will get a fight, because the question is malformed. It treats territory reassignment as a single, atomic decision with a single correct owner. It is not. It is a category of decisions, and inside that category sit at least three fundamentally different decision types with different stakes, different cadences, different information requirements, and therefore different correct owners. The argument in the room is not really an argument about governance. It is three people each picturing a different decision type and assuming everyone else is picturing the same one. The CRO is picturing the annual carve. The manager is picturing the rep who quit last Tuesday. The RevOps leader is picturing the dispute that escalated to them for the third time this quarter. They are all right about their own example and all wrong about each other's.

So the real answer is not a noun — not "the manager" or "the CRO" or "the committee." The real answer is a **governance model**: a layered structure that routes each decision type to the owner best equipped to make it well, fast, and fairly. Routine reassignments — the everyday churn of a rep leaving, an account graduating from SMB to mid-market, a new hire who needs a starter patch — belong to the front-line manager, executing inside written guardrails. Structural redesigns — the periodic re-carve of the whole map — belong to RevOps as the process owner with the CRO as the approver and a thin layer of cross-functional input. Contested decisions — the disputes, the hoarding, the two-reps-one-whale problem — belong to a defined escalation process that terminates with the CRO as final tie-breaker. And underneath all three sits the thing that makes the whole model work: RevOps owning the system itself — the rules, the data, the methodology — so that the vast majority of reassignments are resolved by policy, not by politics.

If you take one idea from this entire answer, take this: the goal of territory governance is not to decide cases. It is to **pre-decide** them. A well-built governance model means 70-85% of reassignments are resolved the moment they arise, because the written rules already answer them. The remaining 15-30% get routed cleanly. Almost nothing should reach the CRO. The org that is constantly "deciding" territory reassignments does not have a governance problem to solve with a committee — it has a missing rulebook.

## The Three Types Of Territory Decision

Everything downstream depends on getting this taxonomy right, so it is worth being precise. There are three types of territory decision, and conflating them is the single most common reason territory governance breaks.

**Type 1: Routine reassignment.** This is the high-frequency, low-individual-stakes churn that happens continuously in any sales org. A rep resigns and their book of 60 accounts needs a home. A new hire starts and needs a viable patch carved from somewhere. An account that was an SMB logo two years ago has grown into a mid-market opportunity and needs to move to the mid-market team. A rep goes on parental leave and their pipeline needs coverage for fourteen weeks. Individually, none of these is a strategic event. Collectively, they are the daily weather of a sales org, and they happen dozens of times a quarter in a company of any size. The defining feature of Type 1: it is frequent, it is mostly mechanical, and the right answer is usually obvious if you have written rules — and a costly, morale-draining negotiation if you do not.

**Type 2: Structural redesign.** This is the periodic, deliberate re-carve of the territory map — the annual or semi-annual exercise where you redraw boundaries to match the next year's headcount, segment strategy, quota model, and go-to-market motion. It is low-frequency (once or twice a year) but extremely high-stakes: it touches every rep, resets the comp math for the whole org, and either creates or destroys equity across the team for the next twelve months. The defining feature of Type 2: it is rare, it is strategic, it requires modeling and data and capacity math, and it cannot be done well by one person in a room — but it also cannot be done well by a committee, because committees cannot draw a coherent map.

**Type 3: Contested decision.** This is the dispute. Two reps both have a legitimate claim to the same hot inbound account. A manager is quietly hoarding the best accounts on their team and other managers have noticed. A rep believes their territory was gutted unfairly in the last carve and is threatening to leave. A named account got reassigned and the losing rep is escalating. The defining feature of Type 3: it is unpredictable, it is emotionally charged, comp is almost always attached, and there is no "obvious" answer — by definition, reasonable people disagree. This is the only one of the three types where you genuinely need a person to adjudicate, and adjudication is a different skill from execution or design.

The reason this taxonomy matters: each type fails differently under the wrong owner. Give Type 1 to a committee and you get paralysis — the org cannot fill a vacancy without a meeting. Give Type 2 to a single manager and you get a map that optimizes for that manager's team. Give Type 3 to "the rules" and you get injustice, because the rules cannot anticipate every dispute. The whole governance model is just the disciplined act of matching each type to its right owner.

## Why "The Manager Owns It" Fails Alone

The case for the manager owning territory reassignment is genuinely strong, which is why so many orgs default to it. The manager has the granular knowledge — they know which rep is having a strong quarter and which is underwater, which rep has the relationship with the buyer's procurement team, which account is a culture fit for which seller. They are close to the action and can move fast. For Type 1 decisions inside their own team, the manager is the right owner, and we will defend that below. But "the manager owns it" as the *whole* model fails, and it fails for one structural reason: **managers optimize locally.**

A front-line manager is measured on their team's number. Their incentives, their visibility, and their loyalty all stop at the boundary of their team. This is not a character flaw — it is the job. But it means that when a manager makes territory decisions with full autonomy, they make them in their team's interest, not the org's. The predictable failure modes: **account hoarding**, where a manager keeps the juiciest accounts circulating among their own reps and never lets them migrate to the team that should own them; **inequity across teams**, where one manager's reps systematically get richer patches than another's because the first manager is a better internal negotiator; **strategic blindness**, where a manager cannot make the call that is right for the company — moving a whale to the enterprise team, say — because they only see their own P&L; and **cross-team gridlock**, where two managers each acting rationally for their own team produce a standoff that nobody can break because there is no one above them in the loop.

There is also a fairness problem that compounds over time. When managers own reassignment unilaterally, the reps quickly learn that their territory quality depends less on a fair system and more on how aggressive and politically skilled their manager is. That is corrosive. It teaches the org that territories are won by lobbying, not earned by performance, and it makes every good rep with a weak-negotiator manager start updating their resume. The manager is the right owner for bounded, in-team, routine moves. As the sole owner of the whole problem, the manager guarantees a map that is locally optimized and globally incoherent.

## Why "The CRO Owns It" Fails Alone

The case for the CRO owning territory reassignment is the mirror image: the CRO is the one person who *can* see the whole picture, who has no incentive to favor one team over another, and who carries the org-level accountability for revenue. If the worry with managers is local optimization, the CRO is the obvious cure — a single owner with a global view. And for the highest-stakes calls, that instinct is correct. But "the CRO owns it" as the whole model fails just as reliably as the manager model, for three reasons.

First, **the CRO does not have the information.** Territory reassignment done well requires granular, current knowledge: which rep is overloaded, which account relationship is fragile, which seller is about to close the deal that would make moving the account destructive. The CRO is three or four layers up. They cannot possibly hold that detail for hundreds of accounts and dozens of reps. When the CRO makes routine reassignment calls, they make them on thin information, and thin-information decisions in a high-detail domain are usually wrong.

Second, **the CRO becomes a bottleneck.** If every reassignment routes to the CRO, then the speed of the entire org's territory hygiene is gated by one person's calendar. A rep quits on Monday; their accounts sit unowned until the CRO surfaces from board prep on Thursday. Multiply that across every vacancy, every account migration, every new hire, and you have an org where territory decisions are chronically late — which means coverage gaps, dropped pipeline, and slow ramp for new reps.

Third, and most corrosively, **it trains the org to escalate everything.** When the CRO is the owner, every rep with a territory grievance and every manager with a cross-team ask learns that the path to a favorable outcome runs through the CRO's office. So they all walk it. The CRO's week fills with reassignment lobbying. The decisions get made not on merit but on who got to the CRO first and made the most compelling case. The CRO is the right owner for two specific things — setting territory strategy and breaking final ties — and the wrong owner for the daily and structural work. Make the CRO the sole owner and you have built a model that does not scale past about fifty reps and burns out the CRO long before that.

## Why "A Committee Owns It" Fails Alone

The committee is the answer that sounds the most fair and works the worst. The appeal is obvious: territory reassignment affects multiple teams, has cross-functional consequences for finance and comp, and feels like it deserves multiple perspectives. So you stand up a territory committee — a manager or two, RevOps, finance, maybe the CRO — and route reassignments to it. The intent is fairness. The result is dysfunction, for four reasons.

**Committees are slow.** A committee can only decide as fast as it can meet, and a committee that meets weekly still introduces a structural week of latency into every decision routed to it. For Type 1 routine reassignments — which need to happen in days, not weeks — this is fatal. Vacancies sit open. New hires wait for patches. The org's territory hygiene degrades to the committee's meeting cadence.

**Committees diffuse accountability.** When a committee makes a bad call, no one owns it. The map gets worse and the post-mortem finds no one responsible because everyone was responsible. Diffuse accountability also means diffuse care — committee members do not feel the consequences of their decisions the way a single accountable owner does, so the decisions get less rigor, not more.

**Committees turn every reassignment into a negotiation.** Put a manager on a committee and they will advocate for their team — that is rational. Put two managers on it and every account becomes a trade. The committee meeting becomes a horse-trading session, and the outcome reflects negotiating skill and coalition-building, not what is right for the org or fair to the reps. You have not removed politics; you have institutionalized it and given it a conference room.

**Committees kill velocity and signal distrust.** An org that needs a committee to reassign an account is an org that has told its managers it does not trust them to do their jobs. That is demoralizing for good managers, and it is slow for everyone. There is exactly one place a cross-functional group belongs in this model — providing *input* to the annual structural redesign — and even there it is input, not ownership. A committee should never be the decision-making owner of routine or contested reassignments. It is the worst of the three options precisely because it feels like the safest.

## The Layered Governance Model

Here is the actual recommendation, and it is a structure, not a person. The layered governance model assigns the three decision types to three owners and binds them together with a system layer owned by RevOps.

**Layer 1 — The system (owned by RevOps, always-on).** RevOps owns the territory-design methodology, the account-scoring model, the data foundation, and — most importantly — the Rules of Engagement document. This is the layer that makes everything else work, because a well-built rulebook pre-decides the overwhelming majority of cases. RevOps is the neutral party here. They do not carry a number for any team, so they can own the rules without the rules being suspected of bias.

**Layer 2 — Routine execution (owned by the front-line manager, within guardrails).** Type 1 reassignments are executed by the manager, unilaterally and fast, *inside the boundaries set by the Rules of Engagement.* The manager does not need permission for an intra-team account shuffle or coverage during a vacancy. They need permission — i.e., escalation — only when the move crosses a guardrail. The guardrails are what make manager autonomy safe.

**Layer 3 — Structural design (owned by RevOps as driver, CRO as approver).** Type 2 redesigns are run by RevOps as the process owner: they build the model, run the scenarios, do the capacity math. Managers provide input. Finance validates quota and capacity feasibility. The CRO approves the final map and owns the strategic choices inside it. This is the one place cross-functional input belongs, and it is structured input into a process, not a committee vote.

**Layer 4 — Contested adjudication (owned by a defined escalation process, CRO as final tie-breaker).** Type 3 disputes follow a published escalation path with defined criteria and a defined decider at each step, terminating with the CRO as the final tie-breaker for the rare case that cannot be resolved below.

The elegance of the model is that it gives each owner exactly the decisions they are equipped to make and none they are not. The manager gets speed and local knowledge applied to local decisions. RevOps gets neutrality applied to the rules and the design process. The CRO gets the strategic choices and the final ties — a handful of decisions a quarter, not a flood. And the cross-functional group gets a real but bounded role: input to the annual carve, nothing more. The next sections walk through each layer in detail.

## RevOps As The System Owner

RevOps is the load-bearing wall of this entire model, and the reason is structural neutrality. Every other potential owner of the territory system carries a bias. The manager is biased toward their team. The CRO is biased toward whatever the board is pressuring them about this quarter. Finance is biased toward predictability. RevOps is the only function with deep operational involvement in territories and no direct stake in which team or rep comes out ahead. That neutrality is not a nice-to-have; it is the thing that lets the rules be trusted.

What RevOps owns concretely: the **territory-design methodology** — the documented approach to how the org carves territories (the segmentation logic, the balancing criteria, the data inputs); the **account-scoring model** — the neutral, data-driven scoring of every account on fit, propensity, whitespace, and current penetration that makes "is this a good account" an objective question rather than an opinion; the **data foundation** — clean, current, trusted data on account ownership, account attributes, rep capacity, and territory boundaries, because every fair decision depends on agreed-upon facts; the **Rules of Engagement document** — covered in depth in the next section, this is the written policy that pre-decides most cases; the **carve process** — RevOps runs the annual or semi-annual redesign as a project, with a timeline, a model, and a defined set of inputs and approvals; and the **audit trail** — RevOps maintains the log of every reassignment with its rationale, which is what makes the system reviewable and disputes resolvable.

What RevOps does *not* own: RevOps does not make the routine reassignment calls — that is the manager. RevOps does not set territory strategy — that is the CRO. RevOps does not adjudicate disputes — that is the escalation process. RevOps owns the system; the other layers operate within it. This distinction matters because RevOps teams sometimes drift toward wanting to make the decisions themselves, and that is a mistake — it destroys their neutrality and recreates the bottleneck problem one function over. RevOps' power comes precisely from being the trusted, neutral keeper of the rules and the data, not from being another decision-maker in the chain.

## The Rules Of Engagement Document

The Rules of Engagement document — the RoE — is the single highest-leverage artifact in territory governance, and most orgs either do not have one or have one that is three bullet points in a slide deck from two years ago. A real RoE is a living, detailed, written policy that **pre-decides 70-85% of all reassignment cases** so that the overwhelming majority of territory decisions require zero debate, zero meetings, and zero escalation. The RoE is what turns territory governance from a series of negotiations into the routine application of policy.

What a real RoE covers: **house account rules** — which accounts are owned by the company rather than any individual rep (the largest strategics, the partner-sourced accounts, the accounts under executive relationship) and how they are worked; **named-account rules** — for orgs running a named-account model, the explicit list of who owns what and the criteria for an account being named to a rep; **the "rep departs" rule** — the single most important routine rule, specifying exactly what happens to a departing rep's book (does it get split among the team, held for the backfill, redistributed by account score?) so a resignation never triggers a scramble; **the inbound-routing rule** — how new inbound leads and accounts are assigned, by geography, by round-robin, by segment, by named-account match; **the account-graduation rule** — when and how an account moves between segments as it grows or shrinks, with the specific thresholds that trigger a move; **the new-hire patch rule** — where a new rep's starter territory comes from and how existing reps are made whole; **the tenure and continuity rules** — how long a rep must hold an account, protections against churning a rep's book, what happens to in-flight opportunities when an account would otherwise move; and **the dispute criteria** — the explicit factors used to adjudicate a contested account (relationship depth, active pipeline, prior ownership, strategic fit) so disputes are resolved on stated criteria, not lobbying.

The RoE has two non-negotiable properties. First, it must be **written and published** — every manager and every rep can read it, which is what makes territories feel principled rather than political. Second, it must be **owned and maintained by RevOps**, reviewed at least at every carve, because a stale RoE is almost as bad as none. When the RoE is good, a rep quits and everyone already knows what happens to their accounts. An account hits the graduation threshold and it moves, no meeting required. An inbound whale arrives and the routing rule assigns it. The RoE is the mechanism by which "who owns territory reassignment" stops being an interesting question for most of the volume — because the answer is "the rulebook already did."

## Manager Authority Within Guardrails

The front-line manager is the right owner for Type 1 routine reassignment — but *bounded* by the Rules of Engagement. The model is "autonomy within guardrails," and both halves matter. The autonomy half: a manager should be able to make a defined set of reassignment decisions unilaterally and immediately, with no approval and no escalation, because these decisions are frequent, local, and best made by the person closest to the action. The guardrail half: the boundaries of that autonomy are written down in the RoE, so everyone knows where manager discretion ends.

What a manager can decide unilaterally: **intra-team account moves** — shifting accounts among the reps on their own team, because the manager has the best view of rep capacity, fit, and relationships and the move stays inside their accountability; **coverage during a vacancy or leave** — assigning interim ownership of a departed or out-on-leave rep's accounts so pipeline does not go dark, a time-sensitive call the manager must be able to make today; **small-account shuffles** — rebalancing low-value or low-scoring accounts among reps to even out workload, below a value threshold defined in the RoE; **new-hire patch assembly from within the team** — carving a starter territory for a new rep from the team's existing accounts, within the new-hire rule; and **temporary reassignments** — short-term coverage moves that do not change permanent ownership.

What sits *outside* the guardrails — and therefore must escalate — is the subject of the next section, but the principle here is that the guardrails should be drawn generously. A manager who has to escalate routine, in-team, low-stakes moves is a manager who has been told they cannot do their job, and you get the velocity and morale costs of the committee model without even having a committee. The guardrails exist to catch the genuinely cross-org and high-stakes moves, not to supervise the manager's daily work. Done right, manager-within-guardrails means the org handles the vast majority of its reassignment volume fast, locally, and without anyone above the manager ever being involved — which is exactly what good governance should produce.

## What Requires Escalation

Escalation is not failure — it is the model working. The point of defining what escalates is to draw a clean, predictable line so that managers know exactly when they can act alone and when they must route up, and so that the things that genuinely need a wider view actually get one. A vague escalation line is as bad as none: it produces both over-escalation (managers covering themselves) and under-escalation (managers quietly making cross-org calls they should not).

What must escalate, defined explicitly in the RoE: **cross-team account moves** — any reassignment that takes an account from one manager's team to another's, because no single manager can be the neutral arbiter of a move between teams and the standoff problem is real; **high-value and named accounts** — reassignment of accounts above a defined value or strategic threshold, because the stakes justify a wider view and these are the accounts most likely to become disputes; **moves that materially change a rep's quota capacity** — any reassignment that meaningfully shifts how much quota a rep can realistically carry, because that has a comp consequence and must be validated against the comp and capacity model (finance involvement); **anything touching the house-account or strategic list** — changes to who works the company's most important accounts; **disputes** — any contested account where two reps or two managers have competing claims, which routes into the formal dispute process rather than being settled by whoever outranks whom; and **exceptions to the RoE itself** — any situation the rules genuinely do not cover, which both escalates *and* triggers a review to decide whether the RoE should be updated to cover it next time.

The escalation path itself should be published and short. A typical path: manager identifies the move falls outside guardrails → routes to RevOps, who checks it against the RoE and the data and either resolves it by policy or confirms it is genuinely contested → if genuinely contested, into the dispute process with defined criteria → CRO as final tie-breaker only for the residual cases that cannot be resolved on criteria. Most things that escalate should die at the RevOps step, resolved by pointing at the rule. Very little should reach the CRO. If a lot is reaching the CRO, the RoE has gaps and the fix is to close them, not to add committee meetings.

## The CRO's Role — Strategy And Tie-Breaking

The CRO's role in territory governance is real, important, and narrow. The CRO is not the day-to-day owner of reassignment — we established why that fails. The CRO owns two things: **territory strategy** and **final tie-breaking**.

Territory strategy means the CRO sets the *philosophy* of how territories are constructed. Geographic, named-account, vertical, or hybrid? Where are the segment boundaries — what defines SMB versus mid-market versus enterprise, and where do the lines move as the company grows? What is the coverage model — single-threaded reps, pods, overlay specialists? How aggressive is the org on whitespace versus farming the installed base? These are strategic choices with multi-year consequences, and they are genuinely the CRO's call — they connect directly to the company's growth strategy, the board's expectations, and the go-to-market motion. RevOps then translates that philosophy into the methodology and the carve; managers execute within it. But the philosophy is the CRO's.

Final tie-breaking means the CRO is the last stop in the escalation path — the adjudicator for the small number of contested decisions that genuinely cannot be resolved by the RoE criteria at the RevOps or dispute-process level. This should be a handful of decisions a quarter, not a flood. If the CRO is constantly tie-breaking, something upstream is broken — usually a thin RoE or a dispute process without real criteria. When the CRO does tie-break, the value they add is not granular knowledge (they do not have it) — it is org-level judgment and the authority to make a call stick. The CRO breaks the tie *and* the decision is final, which is itself valuable: it ends the lobbying.

What the CRO must resist is the pull to do more than this. CROs who came up as managers often want to get into the account-level detail, and CROs under board pressure sometimes want to personally direct where the big accounts go. Both are mistakes — they recreate the bottleneck and the escalate-everything dynamics. The CRO's discipline is to set the philosophy, empower the layers below to operate, and reserve themselves for the genuine ties. A CRO who owns strategy and tie-breaking and *nothing else* in territory governance is a CRO doing the job right.

## The Annual/Semi-Annual Redesign Process

The structural redesign — the annual or semi-annual carve — is the one place where a broader, cross-functional process genuinely belongs, and it is worth being precise about what that process looks like, because "cross-functional" must not be allowed to slide into "committee."

The redesign is **run by RevOps as the process owner.** RevOps owns the timeline, the model, the data, and the project management of the carve. They build the territory model — using the account-scoring data and the methodology — and they run the scenarios. This is a project with a start and an end, not a standing body.

Inside that process, the cross-functional inputs are structured and bounded. **Managers provide input** — they know their reps, their relationships, the on-the-ground reality the model cannot see, and they should have a defined opportunity to flag where the model produces something that will not work in practice. But it is input into RevOps' process, not a vote. **Finance validates capacity and quota** — every proposed map has to be checked against the comp model: do the territories support the quotas they will carry, does the map create any patch that is mathematically un-hittable or any windfall that breaks the comp logic? Finance is a validation gate, not a designer. **Segment leaders and the CRO weigh in on strategy** — does the map reflect the segment boundaries and coverage philosophy the CRO set? And then **the CRO approves the final map.** The CRO is the single accountable approver — the carve does not ship without their sign-off — which preserves single-owner accountability even though the process was cross-functional.

The discipline that keeps this from becoming a committee: RevOps drives, inputs are structured and time-boxed, and there is exactly one approver. Everyone is consulted; one person is accountable. That is the difference between a well-run cross-functional process and a committee — a committee decides by group; this process gathers input from the group and decides through a single accountable owner. The annual carve is the cross-functional moment in territory governance. It should be the *only* one.

## The Account Scoring & Data Foundation

You cannot govern territories fairly without a neutral way to answer the question "is this a good account?" — and if that question is answered by opinion, then every reassignment becomes a contest of opinions, which is to say a contest of politics. The account-scoring model is the objective foundation that makes fair governance possible, and RevOps owns it.

A real account-scoring model evaluates every account on a consistent set of dimensions: **fit** — how well the account matches the ideal customer profile (industry, size, tech stack, business model); **propensity** — the data-driven likelihood the account buys, or buys more, in a given window, often a model output; **whitespace** — the size of the untapped opportunity in the account, the gap between what they could buy and what they have; and **current penetration** — how much the account has already bought and how deep the relationship runs. Together these turn "good account" from a vibe into a score.

Why this is load-bearing for governance: the score is what lets the org balance territories objectively (carve so that every rep has a comparable distribution of account quality, measurable as variance in total territory score), what lets the RoE have real graduation thresholds ("an account moves to mid-market when its score and size cross these lines"), what lets disputes be adjudicated on criteria ("the account goes to the rep with the deeper penetration score and active pipeline"), and what lets the equity scorecard actually measure fairness. Without the scoring foundation, every one of those becomes subjective, and subjective is where politics lives.

The data foundation underneath the score matters just as much. The scoring model is only as trustworthy as the data feeding it — account attributes, ownership records, engagement history, firmographic data — and a scoring model built on stale or dirty data is worse than none, because it launders bad inputs into authoritative-looking outputs. RevOps owning the data foundation means owning its hygiene: the regular cleansing, the enrichment, the deduplication, the validation. Fair territory governance rests on agreed-upon facts. The account-scoring model and its data foundation are how the org manufactures those agreed-upon facts.

## Handling The Contested Account

The contested account is the case the rules cannot fully pre-decide — two reps with legitimate competing claims to the same account — and it needs a structured dispute process, because the alternative is that contested accounts go to whoever lobbies hardest or whoever their manager outranks. A structured process turns the contest from a popularity contest into a criteria-based decision.

The dispute process has four components. **Defined criteria**, published in the RoE, that adjudicate the claim: relationship depth (who has the real, documented relationship with the buying group), active pipeline (who has live, qualified opportunity in the account), prior ownership and continuity (who held the account before and whether churning it would damage it), strategic fit (which rep's skills and segment match the account's needs), and account-score data (penetration, whitespace). The criteria are weighted and stated in advance so the decision is a reasoned application of factors, not a coin flip. **A defined decider** — for most disputes, RevOps applying the criteria neutrally, or a dispute-resolution step that sits below the CRO; the CRO is only the final tie-breaker for the residual case where the criteria genuinely do not separate the claims. **An appeal path** — a rep who believes the decision was wrong has a defined, bounded way to appeal, which matters enormously for trust: people accept decisions they lost far more readily when they had a fair process and a real appeal. **A documented rationale** — every dispute resolution is logged with the criteria applied and the reasoning, both so the decision can withstand scrutiny and so the pattern of disputes feeds the annual RoE review.

The goal of the dispute process is not to make everyone happy — in a contested account, by definition someone loses. The goal is **procedural fairness**: a process that is the same for everyone, decided on stated criteria, with a real appeal, and documented. Reps can live with losing a contested account. They cannot live with feeling that the account was lost because the other rep's manager was louder. The dispute process is how you make the rare unavoidable contest feel principled instead of political.

## The Mid-Year Reassignment Triggers

Between annual carves, territory reality keeps moving, and a good governance model names the specific events that trigger a reassignment and pre-assigns who handles each. Naming the triggers is what keeps mid-year reassignment from being either chaotic (everything is an exception) or frozen (nothing moves until the next carve).

The standard triggers and their owners: **rep departure** — a resignation or termination triggers the "rep departs" rule in the RoE; the manager executes the interim coverage immediately, and the permanent disposition follows the rule (held for backfill, split by score, redistributed); **rep performance** — a sustained-underperformance situation may trigger a territory adjustment, which is sensitive and should escalate, never be a unilateral manager call, because it intersects with performance management and fairness; **M&A** — the company acquires another company or product line, or a customer M&A event reshapes an account; this is structural enough that it routes to RevOps and likely a mini-carve, not a routine move; **new segment or product launch** — standing up a new segment team or a new product specialist overlay requires carving territory, owned by RevOps with CRO approval as a structural event; **a major account event** — a strategic account undergoes a leadership change, a huge expansion, or a churn risk that changes who should own it; this escalates because it usually involves a high-value or named account; and **capacity imbalance discovered** — RevOps' monitoring (see the metrics section) surfaces that some reps are overloaded and others underused, triggering a rebalancing that the manager executes within guardrails for in-team cases and that escalates for cross-team cases.

The discipline: each trigger has a pre-assigned owner and a pre-assigned process. When a trigger fires, nobody has to ask "who decides this?" — the model already answered. That is the difference between a governance model and a perpetual series of judgment calls. The triggers that route to the manager get handled fast and locally; the triggers that are structural route to RevOps; the triggers that touch high-value accounts or rep performance escalate. Naming them is half the work.

## Fairness & Rep Trust

It is easy to discuss territory governance as a mechanical, logistical problem. It is not. Territory is comp. A rep's territory determines, more than almost anything else within their control, how much money they make this year. That makes every territory change a deeply emotional event, and it means the real job of the governance model is not logistical efficiency — it is **legitimacy.** The model has to make territory changes feel principled rather than political, because reps who believe their territory is governed fairly stay and sell, and reps who believe it is governed by politics update their resumes and quietly disengage.

Several features of the layered model exist primarily to manufacture that legitimacy. The **written, published RoE** matters because transparency is the foundation of perceived fairness — a rep who can read the rules and see that the rules were applied to them the same as to everyone else accepts the outcome even when it is not the one they wanted. The **neutral RevOps ownership of the system** matters because reps need to believe the rules are not tilted toward some manager's favorite — a neutral keeper of the rules is more credible than rules kept by an interested party. The **criteria-based dispute process with an appeal path** matters because procedural justice research is consistent and clear: people accept unfavorable outcomes far more readily when they believe the process that produced them was fair and they had voice. The **audit trail** matters because it means every decision can be explained, and "here is exactly why this happened" is the antidote to the rumor and resentment that fill the vacuum when decisions are opaque.

The failure mode to fear most is the org where territory feels political — where reps believe patches are won by lobbying, where the last carve is remembered as a backroom deal, where nobody can explain why an account moved. That org has a retention problem it may not have diagnosed yet, because the best reps, the ones with options, are the most sensitive to territory unfairness and the first to leave over it. Governance done right is, in the end, a retention strategy. Its deliverable is not a tidy map. Its deliverable is a sales force that trusts the map.

## The Comp & Quota Interaction

Every territory change has a comp and quota consequence, and a governance model that ignores that is dangerous. Move accounts off a rep's patch and you have changed how much quota they can realistically carry; move accounts onto it and you may have either set them up for a windfall or, if their quota also rises, set them up to fail. Territory and comp are not adjacent systems — they are the same system viewed from two angles, and the governance model must treat them that way.

This is why finance validation is a required gate, not an optional courtesy. Concretely: any reassignment that materially changes a rep's quota capacity must be checked against the comp and quota model before it is finalized. The questions finance answers: does the rep's quota still match their territory's realistic capacity after the change, or have we just created a mathematically un-hittable number? Have we created a windfall — a territory so rich relative to its quota that the rep over-attains without selling, which breaks the comp logic and demoralizes everyone else? Are there mid-year quota adjustments that need to accompany the territory change so the rep is treated fairly? Are there comp-plan mechanics — account-based credit, named-account splits, transition-period crediting for in-flight deals — that the reassignment triggers?

The structural implication: finance is a participant in the structural redesign (validating the whole map's capacity-to-quota math) and a gate on the escalation path (any reassignment flagged as materially changing quota capacity routes through finance validation). Finance does not *own* territory decisions — they are not a designer or an adjudicator — but no territory decision with a comp consequence should finalize without their validation. The orgs that skip this end up with the worst kind of territory dispute: a rep who took a reassignment in good faith and discovers three months later that their new patch cannot support their unchanged quota. That is not a territory problem at that point; it is a trust problem, and it was entirely preventable with a finance gate.

## Documentation & Audit Trail

Every reassignment — routine, structural, contested — should be logged, with its rationale, in a system RevOps owns. This sounds like bureaucratic hygiene. It is actually one of the load-bearing elements of the model, and for three distinct reasons.

**Fairness and dispute resolution.** When a rep questions why an account moved, the answer should be retrievable: here is the date, here is the rule or decision that drove it, here is the rationale. An answerable "why" defuses the resentment that opaque decisions breed. And when a dispute escalates, the audit trail is the evidence base — who held the account when, what the pipeline looked like, what criteria were applied last time a similar case arose. Disputes resolved from a documented record are resolved faster and accepted more readily than disputes resolved from competing memories.

**Model improvement.** The log is the dataset for the annual review of whether the governance model itself is working. Patterns only become visible in aggregate: a particular guardrail is being hit constantly (the guardrail is drawn wrong), a particular type of dispute keeps recurring (the RoE has a gap), one manager's reassignments cluster suspiciously (possible hoarding). You cannot see any of this without the record. The audit trail is how the model learns.

**Accountability and reviewability.** A logged decision is an owned decision. The discipline of recording a rationale forces the decision-maker to *have* a rationale, which raises the quality of decisions across the board. And it makes the whole system reviewable — by the CRO, by RevOps leadership, in a board or ops review — which is what keeps governance honest over time.

The practical bar: the log should capture, for every reassignment, what moved, when, from whom to whom, the trigger or rule or decision that drove it, the rationale, and the approver if escalation was involved. Most modern CRM and territory tools can carry this; the discipline is in actually populating it. An undocumented governance model is one bad quarter away from being remembered as a series of arbitrary decisions, because memory is unreliable and self-serving. The audit trail is the model's institutional memory.

## Tooling

Tooling does not create governance — a great tool with no RoE is just a fast way to make ungoverned decisions — but the right tooling makes a well-designed governance model dramatically easier to operate, and the wrong tooling (or no tooling) makes even a good model brittle and manual.

**CRM-native territory management.** Salesforce Enterprise Territory Management (and the equivalent in other CRMs) is the baseline — it holds the territory model, the account-to-territory assignments, and the assignment rules, and it is where the RoE's automatable rules (inbound routing, geographic assignment, named-account locks) actually get enforced. For many orgs this plus discipline is enough for the routine layer.

**Dedicated territory planning platforms.** For the structural redesign — the carve — dedicated tools earn their cost. **Fullcast** is built specifically for territory and quota planning and the "plan-to-execution" connection, keeping the designed map and the operational CRM state in sync. **Anaplan** and **Varicent** bring serious modeling and scenario-planning horsepower, valuable for larger or more complex orgs running multi-variable carves and connecting territory to quota and comp in one model. These are the tools RevOps uses to run the annual process — scenario modeling, balancing, capacity math.

**The account-scoring data layer.** The scoring model needs a home and a data source — a CRM-native scoring build, a dedicated RevOps analytics layer, or a data platform that ingests firmographic and engagement data and outputs the fit/propensity/whitespace/penetration scores. The specific tool matters less than that the scores are real, current, and trusted.

**The RoE and the audit trail.** Less glamorous but essential: the RoE itself needs to live somewhere versioned and accessible (not a buried slide), and the audit trail needs a system — often CRM fields and reports, sometimes a dedicated log. The tooling principle throughout: tools enforce and accelerate the governance model, they do not substitute for it. An org that buys Anaplan hoping it will tell them who should own territory reassignment has misunderstood the problem. Buy the tools to operationalize the model after you have designed the model.

## Measuring Whether The Governance Works

A governance model without metrics is a belief system. You need to measure whether the model is actually producing fair, balanced territories and resolving reassignments cleanly — and the metrics double as an early-warning system for the failure modes. RevOps owns this scorecard and reviews it at least quarterly, with a deeper review at each carve.

The core metrics. **Quota-capacity variance across reps** — the spread in realistic quota-carrying capacity from the richest to the leanest patch; a healthy model keeps this variance tight, and a widening spread means the carve is drifting or managers are hoarding. **Account-quality distribution** — using the account-scoring model, the variance in total territory score across reps; this is the direct measure of whether territories are equitable, and it is where hoarding shows up first. **Dispute rate** — the number of contested-account escalations per quarter; a rising dispute rate signals a thin or stale RoE (the rules are not pre-deciding enough cases). **Escalation volume and where it resolves** — how much escalates, and how much dies at the RevOps step versus reaching the CRO; healthy is high volume resolved at RevOps, very little reaching the CRO. **Time-to-reassign** — how long a vacancy or trigger sits before resolution; rising time-to-reassign means the model has a velocity problem (often over-tight guardrails or a bottleneck). **Rep attrition tied to territory grievances** — captured in exit interviews and skip-levels, the share of regretted attrition where territory unfairness was a stated factor; this is the ultimate outcome metric, because the whole model exists to make territory feel fair enough that good reps stay.

Read together, these metrics tell you which failure mode you are drifting toward. Widening quality distribution with low dispute rate: quiet hoarding. High escalation volume reaching the CRO: thin RoE. Rising time-to-reassign: over-built process or bottleneck. Rising territory-driven attrition: the model has lost legitimacy with the reps. The scorecard turns "is our territory governance working?" from an opinion into a measurement, and it gives RevOps the evidence to take to the CRO when the model needs adjustment.

## The Failure Modes

It is worth naming the failure modes directly and in one place, because a governance model is best understood as the set of things it is designed to prevent. Each failure mode maps to a layer of the model.

**Manager hoarding** — managers keeping the best accounts circulating within their own teams, never letting them migrate to where they belong. Prevented by: the cross-team-move escalation guardrail, the account-quality distribution metric that surfaces it, and the neutral account-scoring model that makes "good account" objective.

**CRO bottleneck** — every reassignment routing to the CRO, gating the org's territory velocity on one calendar. Prevented by: the layered model that pushes routine decisions to managers and structural ones to RevOps, leaving the CRO only strategy and final ties.

**Committee paralysis** — a standing cross-functional body that turns every reassignment into a slow negotiation with diffuse accountability. Prevented by: never making a committee the owner of routine or contested decisions; the cross-functional group exists only as structured input to the annual carve.

**No written RoE** — the absence of a real rulebook, so every case is a fresh negotiation. This is the most common and most damaging failure mode, because it is the root cause of most of the others — without the RoE, managers freelance (hoarding), everything escalates (bottleneck), and someone proposes a committee to cope (paralysis). Prevented by: RevOps owning and maintaining a real, written, published RoE that pre-decides most cases.

**No data foundation** — no neutral account-scoring model, so "is this a good account" is a matter of opinion and every territory decision is politics. Prevented by: RevOps owning the account-scoring model and the data hygiene underneath it.

**Over-built governance** — the opposite failure: a model so heavy that necessary reassignments do not happen, vacancies sit open, and coverage suffers because the process is slower than the business. Prevented by: drawing guardrails generously, keeping the escalation path short, and watching the time-to-reassign metric. This is the failure mode the counter-case section addresses in depth.

Every one of these is predictable, and the layered model with a real RoE and a metrics scorecard is, in effect, the checklist for avoiding all of them.

## 5 Real-World Scenarios

**Scenario 1: A star rep leaves with a whale account.** A top enterprise rep resigns; on their book is a $2M strategic account mid-renewal. Without governance: a scramble, managers lobbying, the account sitting unowned for two weeks. With the model: the "rep departs" rule in the RoE governs — the manager immediately assigns interim coverage so the renewal does not go dark (Type 1, within guardrails); because the account is above the high-value threshold, its *permanent* disposition escalates (Type 1 crossing a guardrail); RevOps applies the rule and the account-score data, and if two reps have legitimate claims, it routes to the dispute process. The whale is covered within 48 hours and permanently placed within two weeks, on criteria, documented.

**Scenario 2: Two managers fighting over a hot inbound account.** A large inbound opportunity arrives that two teams both believe is theirs. Without governance: it goes to whichever manager escalates to the CRO most persuasively. With the model: the inbound-routing rule in the RoE is checked first — often it already decides the case (segment match, named-account match, geography). If the rule genuinely does not resolve it, it is a contested account: into the dispute process, decided on published criteria (relationship depth, strategic fit, pipeline), with an appeal path. The losing manager accepts it because the process was fair and the same one applies to everyone.

**Scenario 3: The annual carve redesign.** It is Q4 and the next fiscal year's map needs to be drawn for a larger headcount and a shifted segment boundary. RevOps runs the process: builds the model on the account-scoring data, runs scenarios. Managers provide structured input on on-the-ground realities. Finance validates that every proposed patch supports its quota. The CRO has set the segment philosophy and approves the final map. One accountable process, cross-functional input, single approver — not a committee.

**Scenario 4: A mid-year segment launch.** The company launches a new mid-market segment team mid-year, which requires carving mid-market accounts out of existing SMB and enterprise patches. This is structural (Type 2), triggered mid-year: it routes to RevOps to run as a mini-carve with CRO approval, with finance validating the quota impact on the reps losing accounts, not handled as a pile of routine moves.

**Scenario 5: A manager caught hoarding.** RevOps' quarterly scorecard shows one manager's team has a markedly richer account-quality distribution than peers, and the pattern of their reassignments clusters toward keeping high-score accounts in-team. The audit trail makes the pattern undeniable. RevOps surfaces it to the CRO with the data; the next carve corrects the imbalance; the cross-team-escalation guardrail is reinforced. The metric caught what no individual decision revealed.

## The Decision Framework

When a territory reassignment question arises, run it through this sequence. **Step one: classify the decision type.** Is it routine (a vacancy, a graduation, a new hire — Type 1), structural (a re-carve, a segment launch — Type 2), or contested (a dispute, competing claims — Type 3)? Almost every governance mistake starts with skipping this step and treating all three as one. **Step two: route routine decisions to the manager, within the guardrails.** If it is Type 1 and inside the RoE guardrails — intra-team, below the value threshold, no quota-capacity change — the manager decides, now, alone. If it crosses a guardrail, it escalates. **Step three: route structural decisions to RevOps as driver, CRO as approver.** If it is Type 2, it is a carve or a mini-carve: RevOps runs the process, managers and finance and segment leaders provide structured input, the CRO approves. **Step four: route contested decisions to the escalation process.** If it is Type 3, it goes into the dispute process — published criteria, defined decider, appeal path — not to whoever outranks whom. **Step five: the CRO breaks final ties only.** For the residual contested case that the criteria genuinely cannot separate, the CRO is the final tie-breaker, and the decision is then final. **Step six: log everything.** Every reassignment, every type, gets recorded with its rationale in the audit trail RevOps owns.

The framework's whole purpose is to make the answer to "who owns this?" automatic. The org that runs every reassignment through these six steps has stopped having the "manager or CRO or committee" argument — because the argument was always a symptom of not having classified the decision type first.

## 5-Year Outlook

Territory governance over the next five years gets reshaped by data and AI, but the layered model gets more important, not less. The trajectory: **AI-driven territory optimization and account scoring** become standard — the carve increasingly run by models that optimize balance, capacity, and coverage across far more variables than a human can hold, and account scoring becoming real-time and predictive rather than periodic and static. **Dynamic territories** emerge — instead of a fixed annual map punctuated by exceptions, territories that adjust more continuously as the data shifts, with the account-scoring model and propensity signals triggering reassignment recommendations on a rolling basis.

The instinct will be that this automates the governance question away — that if the model draws the map, you do not need the layered ownership structure. That instinct is wrong, and understanding why is the strategic point. More frequent, data-driven reassignment makes the governance model *more* necessary: someone still has to own the rules the model optimizes against (RevOps), someone still has to set the strategy the model serves (the CRO), someone still has to handle the contested cases the model flags but cannot adjudicate (the escalation process), and the fairness and rep-trust stakes get *higher*, not lower, when territories move more often. A model that reassigns accounts every month based on propensity scores is a model that can erode rep trust every month if there is no governance making it feel principled. The orgs that win with dynamic territories will be the ones that paired the new optimization power with a *stronger* RoE, a *clearer* escalation path, and a *more* rigorous equity scorecard — using the AI to execute a well-governed model faster, not to replace governance with automation. The five-year story is not "AI owns territory reassignment." It is "AI executes; the layered governance model still decides who owns what and why."

## Final Framework

The answer to "should territory reassignment be owned by the manager, the CRO, or a cross-functional committee?" is: **none of them alone — it is owned by a layered governance model**, and here is that model in one frame.

**The taxonomy.** Three decision types: routine (Type 1), structural (Type 2), contested (Type 3). Classify first, always.

**The RACI.** Routine reassignment: the **manager** is Responsible and Accountable within guardrails; RevOps is Consulted (owns the rules); the CRO is Informed. Structural redesign: **RevOps** is Responsible (runs the process); the **CRO** is Accountable (approves); managers, finance, and segment leaders are Consulted; the org is Informed. Contested decision: the **escalation process** is Responsible (criteria-based); the **CRO** is Accountable as final tie-breaker; RevOps and the involved managers are Consulted; the affected reps are Informed with rationale. The system layer: **RevOps** is Responsible and Accountable for the RoE, the account-scoring model, the data foundation, and the audit trail — always.

**The Rules of Engagement template.** A written, published, RevOps-owned document covering house-account rules, named-account rules, the "rep departs" rule, the inbound-routing rule, the account-graduation thresholds, the new-hire patch rule, tenure and continuity protections, and the dispute criteria — built to pre-decide 70-85% of all cases.

**The escalation path.** Manager identifies an out-of-guardrails move → RevOps checks it against the RoE and data, resolving most by policy → genuinely contested cases enter the dispute process with published criteria and an appeal path → CRO breaks final ties only. Short, published, with most things dying at the RevOps step.

**The equity scorecard.** RevOps reviews quarterly: quota-capacity variance across reps, account-quality distribution variance, dispute rate, escalation volume and where it resolves, time-to-reassign, and rep attrition tied to territory grievances. The scorecard is the early-warning system for hoarding, bottleneck, paralysis, and lost legitimacy.

The discipline that ties it together: pre-decide, do not decide. Classify, then route. Generous guardrails, short escalation, single accountable approvers, neutral RevOps-owned rules and data, everything logged. Do that and the question stops being a fight — because the model has already answered it.

## When This Governance Is Over-Built — The Counter-Case

Everything above assumes an org large and complex enough that territory governance is a real problem. For a meaningful share of companies, it is not — and building the full layered model for them is over-engineering that does active harm. The counter-case deserves real weight.

**The genuinely small org.** In a single-team sales org of, say, eight to twelve reps with one manager, that manager really can own all three decision types well. They have the full picture — there is no cross-org picture to miss because there is no cross-org. They are close enough to every account and every rep that their routine calls are well-informed, their "carve" is a quarterly afternoon's work, and disputes are rare and resolvable in a hallway. Imposing a written RoE, an escalation path, a dispute process, and an equity scorecard on this org is process for its own sake — it adds latency and ceremony to decisions that were being made well in minutes. The honest threshold: roughly the point where you have multiple teams and multiple managers — when local optimization and cross-team standoffs become structurally possible — is when the layered model starts earning its cost. Below that, a thin set of written norms and a competent manager is the right answer, and "the manager owns it" is not a failure mode — it is correct.

**Governance as a substitute for the real fix.** The more dangerous version of over-building: an org reaches for elaborate governance to avoid a harder, more concrete problem. The most common case — the territories are simply badly designed. They are unbalanced, they are stale, they have not been re-carved in three years and the business has moved underneath them. The org experiences the symptoms (constant disputes, reps complaining, reassignments that feel arbitrary) and concludes it has a *governance* problem, so it builds a committee and a process. But a committee cannot fix a bad map. The actual fix is a real carve — RevOps, the account-scoring data, a proper redesign. The governance model is what *maintains* a good map; it cannot substitute for *having* one. An org drowning in territory disputes should first ask "are our territories actually well-designed?" before it asks "do we need more governance?" — because if the answer to the first is no, governance is just expensive avoidance.

**When the process becomes the problem.** The third over-built failure: the governance model itself gets so heavy that it strangles the business. Guardrails drawn so tight that managers escalate trivial moves. An escalation path so long that a vacancy sits open for six weeks. A dispute process so formal that reps stop raising legitimate concerns because it is not worth the ceremony. Coverage suffers — accounts go unworked because the process to assign them is slower than the business needs. This is a real and common failure, and the tells are in the metrics: rising time-to-reassign, escalation volume that is high but not resolving, managers routing around the process entirely. The fix is to lighten it — widen the guardrails, shorten the path, push more back to the manager. Governance exists to make the business faster and fairer. The moment it is making the business slower without making it meaningfully fairer, it has inverted its purpose, and "less governance" is the correct answer. The layered model is a tool, not a virtue — and like any tool, it can be the wrong one for the job, or simply too much of it.

`;

const flow = `

## The Layered Governance Model: Routing A Territory Decision

\`\`\`mermaid
flowchart TD
  A[Territory Reassignment Question Arises] --> B{Classify The Decision Type}
  B -->|Type 1 Routine| C[Vacancy / Graduation / New Hire Patch]
  B -->|Type 2 Structural| D[Annual Carve / Segment Launch / M and A]
  B -->|Type 3 Contested| E[Dispute / Competing Claims / Hoarding]
  C --> F{Inside The RoE Guardrails}
  F -->|Yes Intra Team Below Threshold| G[Manager Decides Now Alone]
  F -->|No Crosses A Guardrail| H[Escalate To RevOps]
  D --> I[RevOps Runs The Carve Process]
  I --> I1[Managers Provide Structured Input]
  I --> I2[Finance Validates Quota Capacity]
  I --> I3[Segment Leaders Weigh In On Strategy]
  I1 --> J[CRO Approves The Final Map]
  I2 --> J
  I3 --> J
  E --> K[Defined Dispute Process]
  H --> K
  K --> K1[Apply Published Criteria]
  K1 --> K2{Criteria Resolve It}
  K2 -->|Yes| L[Decision Made And Documented]
  K2 -->|No Genuine Tie| M[CRO Breaks Final Tie]
  M --> L
  G --> N[Log In Audit Trail]
  J --> N
  L --> N
  RoE[RevOps Owns The System Layer] --> RoE1[Rules Of Engagement Document]
  RoE --> RoE2[Account Scoring Model]
  RoE --> RoE3[Data Foundation]
  RoE --> RoE4[Audit Trail]
  RoE1 -.governs.-> F
  RoE1 -.governs.-> K1
  RoE2 -.feeds.-> I
  RoE2 -.feeds.-> K1
  RoE4 -.captures.-> N
\`\`\`

## The RACI: Who Owns What Across The Three Decision Types

\`\`\`mermaid
flowchart LR
  subgraph T1[Type 1 Routine Reassignment]
    T1A[Manager: Responsible and Accountable Within Guardrails]
    T1B[RevOps: Consulted Owns The Rules]
    T1C[CRO: Informed]
    T1D[Finance: Consulted If Quota Capacity Changes]
  end
  subgraph T2[Type 2 Structural Redesign]
    T2A[RevOps: Responsible Runs The Process]
    T2B[CRO: Accountable Approves The Map]
    T2C[Managers: Consulted Provide Input]
    T2D[Finance: Consulted Validates Quota]
  end
  subgraph T3[Type 3 Contested Decision]
    T3A[Escalation Process: Responsible Criteria Based]
    T3B[CRO: Accountable Final Tie Breaker]
    T3C[RevOps and Managers: Consulted]
    T3D[Affected Reps: Informed With Rationale]
  end
  subgraph SYS[System Layer Always On]
    SYSA[RevOps: Responsible and Accountable]
    SYSB[Owns RoE Document]
    SYSC[Owns Account Scoring Model]
    SYSD[Owns Data Foundation and Audit Trail]
  end
  SYS --> T1
  SYS --> T2
  SYS --> T3
  T1 --> OUT[Fast Local Decisions]
  T2 --> OUT2[Coherent Balanced Map]
  T3 --> OUT3[Procedurally Fair Outcomes]
  OUT --> SCORE[Equity Scorecard: Quota Variance / Account Quality / Dispute Rate / Attrition]
  OUT2 --> SCORE
  OUT3 --> SCORE
\`\`\`

`;

const src = `

## Sources

1. **Sales Management Association — Territory Design and Sales Force Deployment research** — Industry research on territory balancing, quota-capacity alignment, and the relationship between territory design and rep performance.
2. **Harvard Business Review — "Motivating Salespeople: What Really Works" and related sales-compensation research** — On the link between territory quality, comp, and rep retention.
3. **Forrester / SiriusDecisions Revenue Operations frameworks** — RevOps as the neutral system owner of go-to-market processes including territory and quota planning.
4. **Gartner — Sales Operations and Revenue Operations research** — On governance models for territory and quota management and the RevOps function's mandate.
5. **Procedural Justice research (Tyler, Lind, et al.)** — The body of organizational-justice research showing people accept unfavorable outcomes more readily when the process is perceived as fair and they have voice; foundational to the dispute-process and appeal-path design.
6. **Salesforce — Enterprise Territory Management documentation** — CRM-native territory model, assignment rules, and territory hierarchy capabilities.
7. **Fullcast — Territory and quota planning platform documentation** — Plan-to-execution territory design and the connection between designed territories and operational CRM state.
8. **Anaplan — Sales planning and territory management documentation** — Scenario modeling and capacity planning for territory carves.
9. **Varicent — Territory and quota planning documentation** — Modeling and optimization for territory and quota design.
10. **The Bridge Group — SaaS sales-org benchmarking reports** — Benchmarks on sales-org structure, rep ramp, attrition, and the operational realities of territory churn.
11. **RevOps Co-op and Pavilion community practitioner discussions** — Practitioner consensus on Rules of Engagement documents, escalation paths, and account-dispute processes.
12. **CSO Insights / Miller Heiman sales-performance studies** — On the operational cost of poorly governed territories and the velocity impact of slow reassignment.

`;

const num = `

## By The Numbers

- **3** — the number of distinct territory decision types (routine, structural, contested) that the single-owner question wrongly collapses into one.
- **70-85%** — the share of reassignment cases a well-built Rules of Engagement document should pre-decide, requiring zero debate or escalation.
- **4** — the layers of the governance model: the RevOps-owned system, manager-executed routine, RevOps-driven/CRO-approved structural, and the escalation process for contested.
- **1** — the number of accountable approvers on the annual carve (the CRO), even though the process is cross-functional — single accountability is the line between a process and a committee.
- **~12 reps** — the rough threshold below which a single team and manager can genuinely own it all, and the full layered model is over-built.
- **2** — the things, and only two, the CRO should own: territory strategy and final tie-breaking.
- **4** — the components of a real dispute process: defined criteria, a defined decider, an appeal path, and a documented rationale.
- **6** — the metrics on the equity scorecard: quota-capacity variance, account-quality distribution, dispute rate, escalation volume and resolution point, time-to-reassign, and territory-driven attrition.

`;

const counter = `

## The Counter-Case In Brief

The strongest argument against this entire framework is that most orgs do not need it. For a single-team sales org under roughly twelve reps with one capable manager, the manager genuinely can own all three decision types — there is no cross-org picture to miss, the carve is an afternoon's work, and disputes are hallway conversations. Imposing a written RoE, an escalation path, a dispute process, and an equity scorecard on that org is process for its own sake. The layered model earns its cost at the point where multiple teams and multiple managers make local optimization and cross-team standoffs structurally possible — not before. There are also two ways the model goes wrong even in orgs large enough to need it: governance built as a substitute for the harder fix (the territories are just badly designed and need a real carve, and no committee can fix a bad map), and governance built so heavy that necessary reassignments stall, vacancies sit open, and coverage suffers — at which point the model has inverted its own purpose and "less governance" is the right answer. The layered model is a tool, not a virtue.

`;

const links = `

## Related Pulse Library Entries

- **q9512** — How should sales territories be designed and carved? (The structural-redesign process this entry routes to RevOps and the CRO.)
- **q9514** — Who should own quota setting — sales, finance, or RevOps? (The comp-and-quota interaction that gates territory reassignment.)
- **q9518** — How do you build a Rules of Engagement document for sales? (Deep dive on the single highest-leverage artifact in this governance model.)
- **q9505** — Should RevOps report to the CRO, the CFO, or the COO? (Why RevOps' structural neutrality makes it the right system owner.)
- **q9523** — How do you measure whether a sales territory is fair? (The equity scorecard and account-quality distribution metrics.)
- **q9508** — How do you build an account-scoring model for sales? (The neutral data foundation that makes fair governance possible.)
- **q9530** — How do you handle a sales rep dispute over an account? (The contested-account dispute process in operational detail.)
- **q9516** — How often should you re-carve sales territories? (Cadence of the structural redesign — annual vs semi-annual.)
- **q9520** — What is the right RevOps operating model for a scaling sales org? (Where territory governance sits in the broader RevOps mandate.)
- **q9525** — How do you keep sales reps from churning over comp and territory changes? (The fairness and rep-trust dimension of governance.)

`;

const tags = ['revops', 'sales-territory', 'territory-management', 'cro', 'sales-operations', 'governance', 'rules-of-engagement', 'sales-management', 'quota-planning', 'sales-leadership'];

const sources = [
  { title: 'Gartner — Sales and Revenue Operations governance research', url: 'https://www.gartner.com/en/sales' },
  { title: 'Forrester (SiriusDecisions) — Revenue Operations frameworks', url: 'https://www.forrester.com/' },
  { title: 'Salesforce — Enterprise Territory Management documentation', url: 'https://help.salesforce.com/' }
];

const notes = {
  s6: 'Added cited sources: Gartner and Forrester/SiriusDecisions RevOps governance frameworks, Harvard Business Review sales-compensation research, the procedural-justice research literature (Tyler, Lind) underpinning the dispute-process and appeal-path design, Salesforce Enterprise Territory Management documentation, dedicated territory-planning platform documentation (Fullcast, Anaplan, Varicent), Sales Management Association territory-design research, The Bridge Group SaaS sales-org benchmarking, and RevOps Co-op / Pavilion practitioner community consensus.',
  s7: 'Added By The Numbers section: the 3 decision types the single-owner question wrongly collapses, the 70-85% of cases a real Rules of Engagement document should pre-decide, the 4 layers of the governance model, the single accountable approver on the annual carve, the ~12-rep threshold below which the full model is over-built, the 2 things the CRO should own, the 4 components of a real dispute process, and the 6 metrics on the equity scorecard.',
  s8: 'Added counter-case: the full layered model is over-built for single-team orgs under ~12 reps where a capable manager can genuinely own all three decision types; governance is sometimes built as a substitute for the harder fix (badly designed territories that need a real carve, not a committee); and governance can be built so heavy that necessary reassignments stall and coverage suffers, at which point the model has inverted its purpose. The layered model is a tool, not a virtue.',
  s9: 'Cross-linked 10 related Pulse entries: territory design and re-carve cadence (q9512/q9516), quota ownership and the comp interaction (q9514), the Rules of Engagement document deep dive (q9518), RevOps reporting structure and operating model (q9505/q9520), territory fairness measurement (q9523), account scoring (q9508), the account-dispute process (q9530), and rep retention through comp/territory change (q9525).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite reframing "should the manager, CRO, or committee own territory reassignment" as a malformed question — the real answer is a layered governance model routing three distinct decision types (routine/structural/contested) to three different owners, bound by a RevOps-owned system layer (Rules of Engagement document, account-scoring model, data foundation, audit trail). Two mermaid diagrams: the decision-routing flow and the RACI across the three decision types. Full coverage: the three-type taxonomy, why each single-owner model fails alone, the four-layer model, RevOps as neutral system owner, the Rules of Engagement document, manager authority within guardrails, the escalation path, the CRO role limited to strategy and tie-breaking, the annual redesign process, account scoring and data foundation, the contested-account dispute process, mid-year reassignment triggers, fairness and rep trust, the comp and quota interaction, documentation and audit trail, tooling, the equity scorecard metrics, the failure modes, five real-world scenarios, the six-step decision framework, the five-year outlook on AI-driven and dynamic territories, the final framework with full RACI, and a three-part counter-case on when the governance is over-built.'
};

runPolish({ id: 'q9521', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
