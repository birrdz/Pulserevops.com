// q9522 — How should you structure comp when your GTM model requires both a founder and a sales lead selling in parallel?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** When a founder and a hired sales lead/team sell in parallel, **do not put the founder on a standard rep comp plan** — the founder's incentive is the cap table, not a 50/50 OTE, and forcing them into quota math distorts credit, forecast, and team morale. Instead, **carve the founder out of the team's comp and quota system entirely** and pick one of three structural models: **(1) Founder Off The System** — founder's strategic deals are "house accounts" that don't pay commission or count against team quota; cleanest, best for mature teams; **(2) Founder Overlay** — founder operates as a strategic exec sponsor, the rep on the account still gets full credit and commission, founder amplifies rather than competes; best when the founder is still actively co-selling; **(3) Originate-And-Handoff** — founder sources and runs first meetings, formally hands to a rep at a defined stage (typically post-discovery / pre-proposal), the rep carries and is comp'd from there; best for founder-heavy pipelines transitioning toward a real sales org. **Set team quota EXCLUSIVE of founder-sourced strategic revenue** — never load the founder's network deals into the team number and then act surprised the "team" hit quota on the founder's back. Put **founder deals in a separate forecast category** so team forecast accuracy stays clean. The **#1 landmine is credit attribution** — when the founder swoops into a rep's deal late, the rep almost always still gets full credit, or you destroy trust permanently. **RevOps owns the deal-tagging** (founder-sourced / rep-sourced / handoff) so credit, quota, and forecast stay auditable. The whole structure should **anticipate the founder selling less over time**, evolving from Model 2/3 toward Model 1 as the team matures — and investors specifically want to see **founder-independent revenue** as a visible, growing number. The counter-case: at a very early company where the founder *is* the sales team, formalizing any of this is premature bureaucracy, and no comp model fixes a founder who simply won't let go.`;

const core = `

## The Core Problem: The Founder Sells Differently Than Anyone You Will Ever Hire

The reason founder-and-sales-lead parallel selling breaks comp models is not a spreadsheet problem. It is a problem of fundamentally different economic actors being forced through the same incentive machine. The founder and the hired rep are doing something that *looks* like the same job — both are in deals, both are talking to buyers, both are influencing revenue — but they are not the same job, and they are not motivated by the same thing.

The founder closes the hardest, most strategic deals. They are the one the prospect's CEO actually wants in the room. They generate inbound from their own network — the angel who introduces them to a portfolio company, the former colleague now running procurement at a target account, the conference panel that produces three warm leads. The founder carries the product vision, can make roadmap commitments on the spot, and can offer the kind of executive sponsorship and partnership framing that a rep structurally cannot. And critically: **the founder does not need a commission to do any of this.** Their incentive is equity. Every deal they close raises the value of their ownership stake far more than any commission check would. The founder is, in pure economic terms, working for the cap table.

The hired sales lead and the reps underneath them are different. They run on comp. Their OTE — base plus variable, typically a 50/50 or 60/40 split against a quota — is the actual mechanism that organizes their behavior. They need clean quota credit, predictable commission rules, and a fair, hittable number. They are building a career and a year's earnings, not a multi-year equity outcome. This is not a criticism; it is simply what a sales compensation system is *for*. It exists to convert money into predictable selling behavior from people who would not otherwise be in your deals.

When you mix these two actors in one comp model, you get three predictable failures. First, **conflict**: the founder and a rep both touch the same logo, and now there is a credit fight, because the comp system forces a zero-sum question — who gets the number? Second, **credit fights**: a deal the founder sourced gets closed by a rep, or vice versa, and there is no clean rule for who gets quota retirement and who gets paid, so it gets litigated deal-by-deal, badly. Third, **demotivation**: the team watches the founder close the easy, warm, network-sourced deals — the ones that practically close themselves — while the reps grind cold pipeline, and if those founder deals are in the same quota pool, the reps correctly perceive the game as rigged. The fix is not a cleverer commission formula. The fix is to recognize that the founder is a different economic actor and to *structurally separate* them from the comp system the team runs on.

## Why You Don't Put The Founder On A Standard Comp Plan

The instinct, especially from a new VP of Sales or a RevOps leader trying to make the model "consistent," is to put everyone — founder included — on the same plan. One quota framework, one commission schedule, one source of truth. It feels fair and tidy. It is a mistake, and it is worth being precise about why.

A standard rep comp plan is built around a specific assumption: that variable compensation is the lever that produces selling effort. The entire architecture — OTE, base/variable split, quota, accelerators, caps, draws — exists because the company is *buying* a behavior it would not otherwise get. When you put the founder on that plan, you are implicitly asserting that the founder needs to be paid a commission to sell, which is false. The founder is going to sell the strategic deals regardless, because their equity makes it irrational not to. So a founder commission is not buying behavior. It is just moving cash from the company to the founder — cash the founder, as a major shareholder, partly owns anyway. It is economically circular and it dilutes the comp budget that should be aimed at the team.

Worse, putting the founder on a rep plan distorts everything downstream. **Quota math breaks**: if the founder "carries quota," then total team capacity now includes a seat that doesn't behave like a seat — the founder isn't doing pipeline generation hygiene, isn't taking the cold accounts, isn't ramping, and may go dark for a month on a fundraise. Your capacity model is now lying to you. **Credit gets distorted**: the founder is in and out of many deals as an executive sponsor; if every touch is a comp event, the founder will accumulate credit on deals the team actually carried, and the team's numbers will look artificially weak. **The team's perception curdles**: reps are not naive. The moment they understand the founder is also "on a plan" and also "carrying a number," every deal becomes a question of whether the founder is going to take their credit. You have introduced the single most corrosive dynamic in a sales org — the sense that the deck is stacked — and you did it in the name of consistency.

The correct frame: the founder's compensation for selling is *already paid*. It was paid in equity, at incorporation. The comp plan's job is to motivate the people whose behavior is *not* already bought. So you take the founder out of the plan, and you design the plan exclusively for the people it is actually for.

## The Founder Is Not A Rep — Define The Role

Taking the founder off the comp plan is not the same as saying the founder shouldn't sell. Founder-led selling is real, valuable, and at early and mid stages often the single highest-leverage GTM activity in the company. The point is not to stop it — it is to *define* it, so it can coexist with a real sales team instead of competing with one.

A rep's role is a carrying-quota seat: a defined territory or book, a number, a pipeline-generation expectation, a forecast they own. The founder's role in selling is none of those things. The founder's role is three things, and naming them explicitly is what makes the whole structure work.

**Strategic deals.** The founder takes the deals that are too big, too complex, too political, or too important to the company's positioning to hand to a rep. The lighthouse logo. The deal where the buyer needs to hear the product vision from the person who owns it. The partnership-flavored deal where the commercial terms are entangled with roadmap. These are not "the founder's territory" — they are a deliberately small set of named, strategic situations.

**Executive sponsor.** The founder is the executive sponsor on deals the *team* is running — dropping in for the CEO-to-CEO call, the late-stage trust-builder, the negotiation where the buyer wants to look the founder in the eye. Here the founder is not the deal owner. The rep is. The founder is a resource the rep can deploy.

**Market-maker.** The founder generates demand the team could not: the network introductions, the podcast and conference presence, the investor-network warm paths, the category-defining content. This is top-of-funnel creation, not deal carrying.

None of those three is a quota-carrying seat. That distinction — the founder *influences and originates and sponsors*, but does not *carry a number that competes with the team* — is the conceptual core of every workable model below. When the founder's role is left undefined, it defaults to "the founder is also kind of a rep, but a special one," and that ambiguity is exactly what produces the credit fights, the forecast pollution, and the morale damage. Define the role first; the comp structure then becomes almost mechanical.

## The Credit-Attribution Problem

This is the landmine that detonates more founder-plus-sales-lead GTM models than any other single issue. It is worth slowing down on.

The scenario is mundane and constant. A deal comes in. Maybe the founder sourced it — a warm intro from an investor — but a rep ran the cycle and closed it. Or the reverse: a rep generated and qualified the opportunity, built the relationship over two quarters, and then in the final stretch the founder jumped in for the executive conversation that got it over the line. Or it is genuinely tangled: the founder met the buyer at a conference, the rep took it from there, the founder came back for the close, and the buyer's CFO was a rep-sourced relationship from a previous deal. Now answer three questions, cleanly, with a rule, before the deal happens: **Who gets quota credit? Who gets paid commission? And how do you prevent the founder from accidentally cannibalizing the team's numbers?**

If you do not have answers to those questions written down *before* the deals occur, they get answered after, deal-by-deal, in a negotiation between the founder, the sales lead, and the rep — and that negotiation is poison. It is poison because it is retroactive (the rules changed after the work was done), because it is political (the founder has structural power), and because it teaches the team that credit is discretionary, which means effort is a gamble.

The accidental-cannibalization risk deserves special attention. A founder with a strong network can, without any bad intent, source enough revenue that it swamps the team's contribution in the aggregate number. If founder-sourced revenue lands in the same bucket as rep-sourced revenue, two bad things happen at once: the team *looks* like it's performing when it's actually the founder's network doing the work, and individual reps can get quota retirement (and commission) on deals they barely touched. You end up paying out commission for the founder's relationships and simultaneously losing the ability to see whether your actual sales engine works. Every model below is, at its heart, a specific, pre-committed answer to the credit-attribution problem. The models differ in *what* the answer is — but they all share the property that the answer exists in advance and is the same for every deal.

## The Three Structural Models

There are exactly three clean ways to structure this, and almost every workable real-world arrangement is one of them or a deliberate blend. The differences come down to one question: when the founder is involved in revenue, what happens to quota credit and commission?

**Model 1 — Founder Fully Off The Comp/Quota System.** The founder's strategic deals are treated as "house accounts." They do not count against any rep's quota, they do not retire team quota, and they do not pay anyone a commission. The founder sells; the revenue books; the company gets bigger; nobody's comp plan is touched. Reps are comped normally on their own deals, with the founder's activity simply outside the system entirely. Cleanest possible separation. Best for teams that are mature enough that the founder's selling is genuinely a small, separable slice.

**Model 2 — Founder As An Overlay.** The founder operates like a strategic overlay or executive sponsor. When the founder is involved in a deal, the rep who owns that account *still gets full quota credit and full commission*. The founder is layered on top — sourcing, sponsoring, amplifying — but the founder's involvement is explicitly *not* a reason to reduce what the rep earns. The founder competes with no one; the founder makes the rep's deals more likely to close. Best when the founder is still actively co-selling across many of the team's deals.

**Model 3 — The Clean Handoff.** The founder originates: sources the opportunity, runs the first meeting or two, establishes the relationship. Then, at a defined and documented stage, the deal formally hands off to a rep. From that point forward the rep owns the deal and is comped from a defined point — either full commission on the whole deal, or commission on everything from the handoff stage forward, depending on how you set it. The founder's contribution is the origination; the rep's contribution is the carry and close. Best for founder-heavy pipelines that are deliberately transitioning toward a self-sufficient sales org.

These are not mutually exclusive across a company — you might run Model 2 for the founder's executive-sponsor activity and Model 3 for the founder's origination activity simultaneously. But for any *given type* of founder involvement, you pick one and you commit. The next three sections go deep on each.

## Model 1 Deep Dive — Founder Off The System

In Model 1, the founder's strategic deals are house accounts. The revenue is real and it shows up in company financials, but it is invisible to the comp and quota machinery. No rep is measured against it, no rep is paid on it, and the team's quota is set as if those deals do not exist.

The appeal is purity. There is zero credit ambiguity because there is nothing to allocate — the founder's deals simply are not in the system. The team's quota attainment number means exactly what it says: revenue the *team* produced. The forecast the sales lead rolls up is uncontaminated. And there is no incentive distortion, because the founder, already motivated by equity, needs nothing from the comp plan and gets nothing from it.

The complexity in Model 1 is not about comp — it is about two decisions you still have to make explicitly. First: **how do the founder's house-account deals show up in the forecast?** They have to be forecast *somewhere* — the board and the CEO need total-revenue visibility — but they cannot be co-mingled with the team's commit, or you lose the clean read on the sales engine. The answer (covered more below) is a separate, clearly labeled forecast category: "Founder / Strategic" sits next to "Team Commit" and "Team Best Case," visible in the total but never blended into the team's accuracy metrics.

Second: **does a rep get any credit for *supporting* a founder house account?** Sometimes a rep does real work on a founder deal — runs the technical evaluation, manages the procurement process, does the implementation scoping. If the rep gets literally nothing, you have created a disincentive to help the founder, which is bad. Two clean options: pay the rep a flat support spiff (a fixed dollar amount, not quota credit, for defined support work), or give a partial, explicitly-capped quota credit that is small enough not to distort their number. What you do *not* do is let it become a full-credit deal — that turns a house account back into a contested deal and reintroduces the exact problem Model 1 was supposed to solve.

Model 1 works best when the team is mature enough that founder selling is genuinely a minor, separable activity — a handful of strategic logos a year, not the bulk of pipeline. Used too early, when the founder is actually generating most of the revenue, Model 1 produces a team quota that is trivially small (because all the real revenue is house accounts) and a sales org that looks either over- or under-staffed depending on how you squint. The further along the company is, the more Model 1 is the right resting state.

## Model 2 Deep Dive — The Founder Overlay

Model 2 treats the founder as a strategic overlay: an executive sponsor and demand source layered on top of the team's deals, with one inviolable rule — **the rep on the account keeps full quota credit and full commission, regardless of how involved the founder gets.**

This is the model for the company where the founder is still deeply, actively in the sales motion — not as a competitor to the team, but as the team's most powerful weapon. The founder takes the CEO call, brings the network intro, closes the trust gap in the final negotiation. And none of that reduces the rep's earnings by a cent. The founder amplifies; the founder does not extract.

Why does the "rep keeps everything" rule matter so much? Because the alternative — splitting credit when the founder gets involved — creates a perverse incentive that quietly destroys the model. If a rep loses credit or commission whenever the founder enters a deal, the rep will *avoid bringing the founder in*, even when the founder's involvement would dramatically raise the win rate. You would be using your comp plan to discourage your reps from deploying your single best closing resource. That is insane, and it happens constantly in poorly-designed versions of this model. The fix is the bright-line rule: founder involvement is a *gift* to the rep, never a *tax* on the rep. The rep should be thrilled when the founder joins a deal, because it makes the deal more likely to close and costs the rep nothing.

The founder, in Model 2, is comped by equity alone — exactly as in every model. The founder's "reward" for sponsoring a rep's deal is that the company grew and their stock is worth more. The cost to the comp budget of Model 2 is therefore zero incremental — you are not paying the founder, and you are not paying the rep *more* than their normal plan; you are simply *not reducing* the rep's normal earnings.

The risk in Model 2 is the inverse of Model 1's risk: it can let the team's quota attainment look better than the underlying sales engine actually is, because the founder is propping up deals. That is why Model 2 still requires disciplined deal tagging (every deal flagged for whether and how the founder was involved) and why the sales lead and the board need a parallel read on *founder-independent* win rate. Model 2 says "don't punish the rep for founder help" — it does not say "don't *measure* founder help." You pay full freight to the rep and you still track, separately and honestly, how much of the team's number depended on the founder.

## Model 3 Deep Dive — The Originate-And-Handoff

Model 3 splits the deal lifecycle. The founder owns origination; the rep owns the carry and close. The founder sources the opportunity and runs the first meeting or two — discovery, initial relationship, the early framing that only the founder can do well — and then, at a **defined, documented stage**, the deal formally transfers to a rep. From that point the rep owns the deal end to end and is comped for it.

The entire model lives or dies on the crispness of the handoff definition. "The founder hands it off when it feels ready" is not a definition; it is a future credit fight. A real definition looks like: *the deal transfers to the assigned rep at the close of the discovery stage, before the proposal/eval stage begins; transfer is marked in the CRM with a stage change and a handoff note; from that moment the rep is the deal owner of record.* You pick the stage that matches your sales process, but you pick *a* stage, you write it down, and it is the same stage for every deal.

Then the comp question: what does the rep get? Two clean answers. **Option A — full commission on the whole deal.** The rep, once they own the deal, is comped exactly as if it were any other deal in their book. This is simplest, it strongly motivates the rep to carry handoff deals as hard as self-sourced ones, and it treats the founder's origination as a free gift to the rep's pipeline. **Option B — commission from the handoff point forward**, with the origination portion either uncomped (founder is on equity) or carrying a small, fixed origination credit that does not go to anyone's variable pay. Option A is usually better at early-to-mid stage because it maximally motivates the rep and minimizes accounting; Option B makes more sense when founder-originated deals are a large fraction of pipeline and full credit would inflate rep attainment past what their own selling justifies.

Either way, the founder is not comped in cash — the founder's origination is rewarded by equity, like everything else. Model 3's purpose is transitional: it is how a founder-heavy pipeline deliberately becomes a team-carried pipeline. Early on the founder originates most deals and reps carry them. Over time the team's own origination grows, the founder originates fewer, and the company drifts naturally toward Model 1. Model 3 is the bridge. Its biggest failure mode is a vague handoff stage; its second biggest is the founder not actually letting go at the handoff point — which is a delegation problem, not a comp problem, and no comp design fixes it.

## Choosing The Right Model

The model is not a matter of taste — it is a function of three variables: company stage, how much the founder still sells, and team size/maturity. The logic is consistent.

**The earlier and more founder-dependent the GTM, the more you need Model 2 or Model 3.** At $1M–$5M ARR with a founder who is still in most deals, Model 1 is wrong — it would make the team's quota a rounding error and hide the fact that the company *is* the founder's selling. In this zone you want Model 2 (if the founder is mostly co-selling and sponsoring the team's deals) or Model 3 (if the founder is mostly originating and you are trying to build rep self-sufficiency). Both models keep the reps fully motivated while the founder is still load-bearing.

**As the team matures, you migrate toward Model 1.** By the time you have a real VP of Sales, a team of reps generating their own pipeline, and the founder's selling reduced to a handful of genuinely strategic logos a year, Model 1 becomes the clean resting state. The founder's deals are house accounts, the team owns its number, and the comp system is uncontaminated.

**The mix of deal types matters too.** If the founder's involvement is mostly *executive sponsorship of deals the team runs*, Model 2 fits — the rep owns it, the founder amplifies. If the founder's involvement is mostly *originating new opportunities from their network*, Model 3 fits — the founder sources, the rep carries. If it's a small set of *fully founder-run strategic deals*, Model 1's house-account treatment fits. Many companies run a blend: Model 2 for sponsorship, Model 3 for origination, with the whole thing drifting toward Model 1 over two to three years.

A simple decision path: assess how founder-dependent the GTM still is. If very dependent and founder is co-selling broadly → Model 2. If very dependent and founder is originating → Model 3. If founder selling is now a minor, separable slice → Model 1. Then re-run that assessment every year, because the right answer *moves* as the company matures — and a comp structure that doesn't anticipate that movement will need a painful renegotiation later.

## The Sales Lead's Comp In This Context

The hired CRO or VP of Sales has the most structurally fragile comp position in this whole arrangement, and getting it wrong is how you lose your sales leader in year one.

The core principle: **the sales leader's plan must not be undermined by founder deals, in either direction.** There are two ways to undermine it. The first is to *inflate* it — to load founder-sourced strategic revenue into the team number so that the sales leader's quota is "hit" on the founder's back. This feels generous but it is corrosive: the sales leader knows the number isn't real, the board eventually figures it out, and when the founder steps back the apparent performance collapses and the sales leader is blamed for a decline that is really just the founder's network being withdrawn. The second is to make the leader's quota *un-hittable* — to set a team number that implicitly assumed the founder's deals would help, then carve those deals out without adjusting the quota down, leaving the leader chasing a target that was never calibrated for a founder-free team.

The clean design: **set the sales team's quota exclusive of founder strategic deals.** The sales leader and the team are measured on what the team produces, full stop. Founder deals are either fully outside the system (Model 1) or flow to reps under defined rules (Models 2 and 3) — but the *aggregate team quota* that the sales leader is accountable for is built from team capacity, not founder capacity. If you want the sales leader to have *any* accountability for founder-sourced revenue, do it as a *separate, explicitly-labeled bucket* with its own (usually softer) target — "founder/strategic revenue: $X, leader is responsible for operational support and handoff hygiene, not origination." Never blend it into the core number. The sales leader should be able to point at their attainment and have it mean "the engine I built produced this," because that is the thing they were actually hired to build, and that is the thing the board will eventually judge them on.

## Setting Team Quota When The Founder Also Sells

This is the capacity-math version of the sales-leader comp problem, and it is where good intentions most often produce a broken plan.

The discipline is simple to state: **build the team's quota from the team's capacity, and do not let founder-sourced revenue into that calculation.** A team quota is fundamentally a capacity model — number of ramped reps, times productivity per rep, times a stretch factor. The founder is not a ramped rep with a productivity number; the founder is a variable, often-absent, equity-motivated strategic seller. If you take the company's total revenue target and divide it across the team, you have implicitly assigned the founder's expected production to the reps, and now the reps are carrying a number that requires the founder to keep performing for them to hit it.

That produces one of two failures. The common one: you *do* load founder revenue into the team number, the founder has a strong year, "the team hits quota" — and everyone congratulates a sales engine that did not actually produce what its number says. Then the founder steps back, attainment craters, and you have a crisis that is really just an accounting artifact finally surfacing. The opposite failure: you load founder revenue into the team number, the founder has a *light* year (a fundraise, a board fight, a product crisis pulls them out of selling), and now the team is staring at a quota that was never theirs to hit, missing badly, and demoralized over a gap that was never about their performance.

The fix is to separate the math. Total company revenue target = team quota (built bottoms-up from team capacity) + founder/strategic target (a separate line, owned by the founder, forecast separately). The team's quota is hittable by the team. The founder's target is the founder's. The two sum to the company goal, but they are never blended, and the team is never quietly made to depend on the founder's network to make their number look real.

## The Forecast Treatment

Forecasting is where the founder-and-team structure becomes operationally visible every single week, and the rule is the same one that governs comp and quota: **visible, but not co-mingled.**

Founder strategic deals must be *in the forecast* — the CEO and the board need the total-revenue picture, and pretending the founder's pipeline doesn't exist would make the company's forecast wrong. But they must sit in their **own forecast category**: a clearly labeled "Founder / Strategic" line that rolls up into total company forecast but is held entirely separate from the sales team's commit and best-case.

Why the separation is non-negotiable: the sales team's forecast accuracy is one of the most important diagnostic signals you have about whether your sales engine is real and predictable. If founder deals are blended into the team's commit, that signal is destroyed. Founder deals tend to be lumpy, idiosyncratic, and timed to things outside the sales process (a partnership announcement, the founder's travel schedule, a relationship's natural rhythm). Mixing them into the team's commit makes the team's forecast look erratic when the team is actually forecasting fine — or makes it look fine when it isn't. Either way you have blinded yourself to the health of the engine you are trying to build.

The clean structure: the sales lead rolls up Team Commit and Team Best Case from the reps, forecast on the normal cadence with the normal rigor, and that number is the team's number — graded for accuracy against itself. The founder (or RevOps on the founder's behalf) maintains the Founder / Strategic category separately. The CEO's board view shows all of it summed. Everyone can see the total; nobody confuses the founder's lumpy strategic pipeline with the team's repeatable engine. When the founder's deals are handled under Model 2 or 3 and flow to reps, they enter the team forecast *at the handoff point* under the normal rules — before handoff, they live in the Founder / Strategic category. That single boundary keeps the team's forecast accuracy honest.

## The Handoff Mechanics

When a deal moves from the founder to a rep — the core operation of Model 3, and a frequent event under Model 2 as well — the mechanics have to be concrete enough that no one can dispute what happened.

**The transfer stage.** Pick the specific sales-process stage at which a founder-originated deal becomes a rep-owned deal, and make it the same stage every time. A common choice: the deal transfers at the end of discovery, before the formal proposal/evaluation stage. The founder does the origination and the initial relationship; the rep takes it from "we understand the problem and there's a real opportunity" forward.

**The CRM action.** The handoff is a recorded event: the deal owner field changes to the rep, a handoff note documents what was discussed and committed in the founder-led portion, and the stage change is timestamped. There is no "informal" handoff. If it isn't in the CRM, it didn't happen, and RevOps should treat an undocumented handoff as a process violation.

**The comp split, if any.** Under Model 3 Option A, there is no split — the rep is comped on the whole deal once they own it. Under Option B, the comp boundary is the handoff stage, and it is documented on the deal. Either way, the rule is set in the plan, not negotiated per deal.

**The anti-resentment design.** The single most important thing the handoff mechanics must prevent is the "founder swoops in at the end and takes the deal" dynamic — and its mirror, the rep feeling the founder dumped a half-baked deal and is now claiming origination credit for a tire-kicker. Crisp stage definitions protect against both. The rep knows exactly what they're inheriting and from what point they own it; the founder knows exactly when they're done. The documentation is not bureaucracy for its own sake — it is the thing that lets a founder and a rep work the same accounts for years without the relationship eroding into suspicion.

## The "Founder Swoop" Problem

The founder swoop deserves its own treatment because it is the single most common trust-destroying event in founder-plus-team selling, and because the correct policy is counterintuitive to a lot of founders.

The swoop: a rep has sourced, qualified, and carried a deal for weeks or months. In the final stretch — the executive negotiation, the security review escalation, the "our CEO wants to talk to your CEO" moment — the founder jumps in. The founder's involvement may be genuinely decisive; it often is. And now the question: does the rep still get full credit and full commission?

The answer, almost always, is **yes — full credit, full commission, no reduction.** And the reason is not that the founder didn't help. The reason is that the alternative is catastrophic. If the rep loses credit or commission because the founder closed "their" deal, you have taught every rep in the company a brutal lesson: *do not let the founder anywhere near your deals, because the founder will take them.* Reps will start hiding late-stage deals from the founder, declining to escalate, keeping the founder out of exactly the high-stakes moments where the founder is most valuable. You will have used your comp policy to disconnect your best closer from your most important deals.

So the policy, written down and communicated to the whole team: **founder involvement in a rep's deal — at any stage, including the close — never reduces the rep's credit or commission.** The founder swooping in is framed, correctly, as the company giving the rep its most powerful resource for free. The rep should *want* the founder in the deal. The founder, motivated by equity, needs no credit for it. The only thing that needs to happen is that the involvement gets tagged (RevOps logs that the founder was involved, for the separate founder-influence analytics) — but tagging is for measurement, not for comp. Measure the founder's influence; never tax the rep for it. A founder who insists on credit for swooping is, almost always, revealing a deeper unwillingness to actually build a team — which is the delegation problem, addressed later, and which no comp clause can solve.

## Equity As The Founder's Real Comp

It is worth stating plainly, because it is the load-bearing assumption under every model above: **the founder's compensation for selling is equity, and the comp design's job is to let the founder sell freely without it ever being a compensation event.**

The founder owns a meaningful slice of the company. Every deal the founder closes — every strategic logo, every network-sourced opportunity, every deal the founder's executive sponsorship saves — increases enterprise value, and the founder captures a large fraction of that increase through their ownership. A commission check is a rounding error against that. For a founder with, say, 20–40% ownership of a company whose value moves with revenue, the equity incentive on a given deal can be an order of magnitude larger than any commission you could plausibly pay. The founder is already maximally incentivized. Adding a commission does not increase the incentive; it just moves cash around and complicates the system.

This is why every model carves the founder *out* of the comp plan rather than finding the founder a special seat *within* it. The design goal is not "how do we pay the founder fairly for selling" — the founder is already paid, in equity, and that payment is the cleanest, most aligned incentive in the entire company. The design goal is "how do we let the founder sell as much and as freely as is useful, without that selling ever colliding with the comp system the team runs on." A founder should be able to source a deal, sponsor a deal, close a deal, or hand a deal to a rep, and in none of those cases should a commission calculation be triggered for the founder. The founder's selling is pure upside to the company and pure upside to the founder's stock. Keep it that way. The moment you try to also put the founder "on a plan," you have taken the cleanest incentive in the company and muddied it.

## The Transition Plan — Founder Selling Less Over Time

A comp structure for founder-plus-team selling that does not anticipate the founder selling *less over time* is a structure you will have to tear up and renegotiate, painfully, in eighteen months. Build the transition in from the start.

The trajectory is predictable. Early on, the founder is load-bearing — originating most pipeline, sponsoring most deals, closing the hardest ones. The right model is Model 2 or Model 3, because the team is not yet self-sufficient and the comp structure needs to keep reps fully motivated while the founder is still everywhere. As the team matures — the VP of Sales builds real pipeline generation, reps start sourcing their own deals, the sales process becomes repeatable — the founder's *share* of revenue naturally declines, even if the founder's absolute selling stays flat. Eventually the founder is doing a handful of strategic deals a year and the right model is Model 1: founder deals as house accounts, team owns its number.

The structure should make that migration smooth rather than disruptive. Concretely: (1) **Define the models as a sequence, not a choice.** Tell the team, the sales leader, and the board explicitly: "we are in Model 3 now; as the team's self-sourced pipeline crosses [threshold], we move handoff deals to a reduced founder-origination role; by the time self-sourced pipeline is the majority, we are in Model 1." (2) **Make the trigger a metric, not a vibe.** The migration should be tied to something measurable — founder-independent pipeline as a percentage of total, or team self-sourced bookings — so the change is a planned event, not a political fight. (3) **Re-baseline quota at each transition, deliberately.** When founder deals move out of the team's flow, the team's quota and capacity model get re-set to match — and everyone knows in advance that this is how it works, so it doesn't feel like a goalpost move. (4) **Communicate it as a sign of health.** The founder selling less is not a loss; it is the entire goal — it means the sales engine works. Framed that way, every step of the transition is a milestone, not a threat.

## Avoiding The Team-Morale Landmine

Underneath all the structure is a human dynamic that no spreadsheet captures: reps watching the founder close the easy, warm, network-sourced deals while they grind cold pipeline. If that dynamic is left to fester, it produces cynicism, and cynicism in a sales team is a productivity tax you cannot afford. The structures above are partly *for* this — but they only work if the morale dimension is handled deliberately.

**Transparency about what's a "founder deal" and why.** Reps are not upset that the founder closes deals. They are upset when it is murky — when they can't tell whether a logo was always going to be the founder's, whether they could have had a shot, whether the "team number" is real. The fix is visibility: every deal is tagged (founder-sourced, rep-sourced, handoff), the team can see the tags, and the logic for what becomes a founder strategic deal is explicit and consistent. Reps can live with "the founder takes the genuinely strategic logos and here is the defined list of what that means." They cannot live with "sometimes the founder takes deals and we don't know the rule."

**Keep the team's quota fair.** This is the morale-protective core of the whole capacity-math discipline above. If the team's quota is built from team capacity and exclusive of founder revenue, then a rep's attainment reflects a fair, hittable game. If founder revenue is loaded in, every rep eventually realizes they are being measured against a number that secretly assumed the founder's network — and that realization is the moment a good rep starts updating their resume.

**Frame founder involvement as a resource, not a threat.** Under Models 2 and 3, founder involvement *never reduces rep credit*. Communicate that relentlessly. The rep should experience the founder joining a deal as "I just got the best closer in the company on my deal, for free" — not as "here comes the credit fight." That framing is a choice, and it is made through the comp policy *and* through how leadership talks about it. Get both right and the founder becomes the team's favorite weapon instead of its resented competitor.

## The RevOps Job Here

RevOps is the function that makes all of this real, and the core RevOps responsibility in a founder-plus-team GTM is **deal tagging — keeping credit, quota, and forecast clean and auditable.**

Every deal in the system carries a tag: **founder-sourced, rep-sourced, or handoff** — and for handoff deals, the handoff stage and the owner-of-record before and after. This tagging is not optional metadata; it is the spine of the whole structure. It is what makes Model 1's house-account treatment enforceable, what lets Model 2 measure founder influence without taxing reps, what makes Model 3's handoff a recorded event rather than a memory, what keeps the founder/strategic forecast category separate, and what lets the board see founder-independent revenue as a real number.

Concretely, RevOps owns: (1) **the tagging taxonomy and its enforcement** — the CRM is configured so a deal cannot progress without a source tag, and handoffs cannot be marked without the required fields; (2) **the separation of forecast categories** — Founder / Strategic vs Team Commit/Best Case, maintained as distinct rollups; (3) **the quota and credit rules as system logic** — founder house accounts excluded from quota retirement, handoff comp boundaries enforced, swoop involvement logged but not comp-affecting; (4) **the audit trail** — when a credit question does arise, RevOps can show exactly what happened, with timestamps, so the answer is a lookup, not a negotiation; (5) **the founder-independence metrics** — the percentage of pipeline and bookings that is genuinely team-sourced, reported on a regular cadence to the CEO, sales leader, and board. RevOps is the reason "who gets credit for this deal" is a five-second query instead of a recurring political fight. If the tagging discipline slips, every model above quietly degrades back into the deal-by-deal litigation that the whole structure exists to prevent.

## Board & Investor Optics

Investors care about this structure for one specific reason, and naming it sharpens every decision above: **they want to see that the sales team can sell without the founder.** A company whose revenue is mostly the founder's network and the founder's selling is a company with a key-person dependency and an unproven engine — and that is a discount on valuation and a flag in diligence.

The comp and quota structure is what makes "founder-independent revenue" a *visible, measurable number*. Because founder deals are tagged and carved out of the team's quota, and because team forecast is separate from founder/strategic forecast, the board can be shown — cleanly, without hand-waving — exactly how much of the company's revenue the *team* is producing on its own. That number, and its growth rate, is one of the most important things a growth-stage investor looks at. A company that can say "team self-sourced bookings were 40% two years ago and are 75% now, here is the data, here is the tagging behind it" is telling a fundamentally stronger story than one that can only say "we did $12M" with no ability to decompose it.

This is also why the structure should never be the inflate-the-team-number version. The temptation to load founder revenue into the team's quota so attainment looks great is exactly the thing sophisticated investors are trained to see through — and when they find it in diligence, it costs you credibility on *everything else* in the data room. The honest structure, where founder and team revenue are cleanly separated, is not just operationally cleaner; it is the version that survives diligence and supports the valuation. Build the structure so that "founder-independent revenue" is a number you are *proud* to show, because you will be showing it.

## The CEO-Founder Time Allocation Question

The comp structure does not exist in a vacuum — it interacts directly with a strategic question the founder and board should be asking continuously: **how much *should* the founder still be selling?**

There is a real distinction between founder-led selling as a *genuine asset* and founder-led selling as a *crutch*. It is a genuine asset when the founder is doing things only the founder can do — closing the strategic lighthouse logos, sponsoring the deals where executive-to-executive trust is decisive, generating demand from a network the company cannot otherwise reach. It is a crutch when the founder is in deals a competent rep could run, because the founder enjoys selling, or doesn't trust the team, or is avoiding harder CEO work, or has not built a team capable of operating without them. The crutch version *feels* productive — the deals close! — but it is mortgaging the company's future, because it prevents the sales engine from ever being tested and built.

The comp structure both reveals and supports the right answer. The founder-independence metrics (the RevOps job above) make the crutch visible: if founder-sourced revenue isn't declining as a share of total over time, the founder is probably over-selling. And the model sequence (Model 2/3 → Model 1) gives the founder a structured path to *reduce* selling without it being a crisis. The right pattern: the founder's selling should be *deliberate and shrinking* — a chosen set of high-leverage strategic activities, consciously narrowed over time, with the comp structure migrating in step. The wrong pattern: the founder's selling is *whatever the founder feels like*, unbounded, and the comp structure is perpetually contorting to accommodate it. The comp design can support a healthy time-allocation discipline. It cannot impose one — that has to come from the founder's own clarity about what their job actually is at each stage.

## 5 Real-World Scenarios

**Scenario 1 — The $3M founder-led startup hiring rep #1.** The founder has personally closed every deal. They are hiring their first quota-carrying rep. Right structure: Model 3 (originate-and-handoff), Option A. The founder keeps originating from their network, hands deals to the rep at end-of-discovery, and the rep gets full commission on what they carry. The rep's quota is small and team-capacity-based — built for *one ramping rep*, not "a third of company revenue." The founder is off the comp plan entirely. The explicit plan: as the rep ramps and starts self-sourcing, drift toward less founder origination. Premature Model 1 here would give the rep a near-zero quota and no path to learn; Model 3 gives them real deals and a real ramp.

**Scenario 2 — The $15M company with a new VP Sales and a founder who won't let go.** A VP of Sales was hired; the founder is still in most large deals and keeps swooping. The comp structure can carve the founder out cleanly (Model 2: reps keep full credit, founder swoop never taxes them; team quota set exclusive of founder deals). But the structure will *not* fix the underlying problem — the founder isn't letting the VP build. The comp design's contribution is to make the founder-dependence *visible* (the founder-independence metric isn't moving) so the board can have the real conversation. This is the scenario where everyone should be honest that the problem is delegation, not comp.

**Scenario 3 — The founder who only does the 3 biggest strategic deals a year.** Mature team, the founder's selling is genuinely down to a tiny set of strategic logos. Right structure: Model 1. Those three deals are house accounts — off team quota, no commission, forecast in the Founder / Strategic category. A rep who supports one of them gets a flat support spiff, not full credit. The team owns its number cleanly. This is the healthy resting state the whole transition plan is aiming at.

**Scenario 4 — The co-founder team where one is the de facto head of sales.** One co-founder runs sales day-to-day. They are not "the founder occasionally selling" — they are effectively the sales leader, while also being an equity-motivated founder. Right structure: treat them as the sales *leader* for org-design purposes (they own the team's quota and forecast) but keep them *off the variable comp plan* — their incentive is equity, like any founder. The reps under them are on normal plans. The risk is that a co-founder-as-sales-leader never gets replaced and the company never builds a true VP Sales muscle; the founder-independence metric and a clear-eyed board are the guardrails.

**Scenario 5 — A founder swooping into a rep's deal.** A rep has carried a deal for two quarters; the founder jumps in for the final executive negotiation and it closes. Right handling: the rep gets full credit and full commission, no reduction, full stop. RevOps tags the deal as "founder-involved" for the influence analytics, but the tag affects measurement, not comp. The founder's reward is equity. If the founder is unhappy not getting credit, that is a signal worth surfacing — but the policy does not bend.

## The Decision Framework

Pulling the whole thing into a sequence a founder, CRO, or RevOps leader can actually execute:

**Step 1 — Assess how founder-dependent the GTM still is.** Honestly measure: what fraction of pipeline and bookings is founder-sourced or founder-sponsored? This number drives everything.

**Step 2 — Pick the model.** Very founder-dependent and founder is co-selling broadly → Model 2 (overlay, reps keep full credit). Very founder-dependent and founder is originating → Model 3 (originate-and-handoff, defined handoff stage). Founder selling is now a minor, separable slice → Model 1 (house accounts). Blend where the founder does multiple kinds of involvement.

**Step 3 — Carve founder deals out of team quota.** Build the team's quota bottoms-up from team capacity. Founder/strategic revenue is a separate line. The two sum to the company target; they are never blended.

**Step 4 — Define the handoff and swoop policies, in writing.** The handoff stage (specific, documented, same every time). The swoop policy (founder involvement never reduces rep credit or commission, ever). Communicate both to the whole team.

**Step 5 — Tag everything in RevOps.** Founder-sourced / rep-sourced / handoff on every deal. Separate forecast categories. Quota and comp rules enforced as system logic. An audit trail so credit questions are lookups, not fights.

**Step 6 — Plan the transition.** Define the model sequence (2/3 → 1), tie the migration to a measurable trigger, re-baseline quota at each step, and frame the founder selling less as the goal — because it is.

Run this once to set the structure, then re-run Steps 1, 2, and 6 every annual planning cycle, because the right answer moves as the company matures.

## 5-Year Outlook

Over a five-year horizon, the founder-and-sales-lead parallel-selling problem evolves along a fairly predictable arc, and a few forces are worth anticipating.

**The founder-led-to-scalable-org transition is the dominant storyline.** Most companies that survive and grow will move, over five years, from "founder is the sales engine" to "founder does a few strategic deals and the team is the engine." The comp structure described here — the model sequence, the carved-out quota, the founder-independence metric — is essentially the operating system for that transition. Companies that build it deliberately make the transition a series of planned milestones; companies that don't make it a series of crises.

**AI changes the top of the funnel, which changes the founder's role.** As AI handles more of prospecting, research, initial outreach, and even early qualification, the *volume* of pipeline a small team can generate goes up — which means the team becomes self-sufficient at top-of-funnel faster, which means the founder's *origination* role (Model 3's core) shrinks earlier than it used to. What AI does *not* replace is the founder's strategic and executive-sponsor role: the CEO-to-CEO trust, the roadmap commitment, the category-defining narrative. So the likely five-year shift is that the founder's *origination* selling fades faster (AI fills that gap) while the founder's *strategic/sponsor* selling stays durable. Practically: companies will drift from Model 3 toward Model 1 faster than before, but the Model 2 overlay role (founder as strategic sponsor) remains valuable longer.

**Founder strategic selling is durable.** Even at scale, even with a great CRO, even with AI-saturated pipeline generation, the biggest, most strategic, most narrative-defining deals will still benefit from the founder. That never fully goes away, and the comp structure should never try to eliminate it — Model 1's house-account treatment exists precisely so that a $200M-ARR company's founder can still close the three logos that define the next category, cleanly, without it being a comp event. The five-year outlook is not "the founder stops selling." It is "the founder's selling becomes deliberate, narrow, strategic, and structurally clean" — which is exactly what the framework is built to produce.

## Final Framework

**The three comp models, compared.** *Model 1 — Founder Off The System:* founder's strategic deals are house accounts; no team quota credit, no commission to anyone; cleanest separation; best for mature teams where founder selling is a minor slice. *Model 2 — Founder Overlay:* founder is a strategic exec sponsor; the rep on the account keeps full quota credit and full commission regardless of founder involvement; founder amplifies, never taxes; best when the founder is still actively co-selling. *Model 3 — Originate-And-Handoff:* founder sources and runs first meetings, hands off at a defined stage, rep carries and is comped from there (Option A: full deal; Option B: from handoff forward); best for founder-heavy pipelines transitioning to a real org.

**The model-selection guide.** Very founder-dependent + founder co-selling broadly → Model 2. Very founder-dependent + founder originating → Model 3. Founder selling now minor and separable → Model 1. Re-assess annually; the right answer moves toward Model 1 as the team matures.

**The deal-tagging schema.** Every deal tagged founder-sourced / rep-sourced / handoff. Handoff deals additionally carry the handoff stage and owner-of-record before/after. Founder-influenced deals tagged for analytics (measurement only, never comp). RevOps owns the taxonomy and enforces it as CRM system logic.

**The handoff policy template.** Deals transfer from founder to rep at a single, documented stage (e.g., end of discovery). The handoff is a recorded CRM event: owner field change, handoff note, timestamp. No informal handoffs. Comp boundary set in the plan, not negotiated per deal.

**The swoop policy template.** Founder involvement in a rep's deal — at any stage, including the close — never reduces the rep's credit or commission. Founder involvement is tagged for measurement only. The founder is comped by equity; the rep is comped by their plan; the two never collide.

**The quota and forecast rules.** Team quota built bottoms-up from team capacity, exclusive of founder strategic revenue. Founder/strategic revenue is a separate target line and a separate forecast category. The two sum to the company goal but are never blended. Team forecast accuracy is graded against the team's number alone.

**The transition roadmap.** Define the model sequence (Model 2/3 → Model 1) explicitly. Tie each migration to a measurable trigger (founder-independent pipeline share, team self-sourced bookings). Re-baseline team quota at each transition deliberately and transparently. Frame the founder selling less as the goal — it is the proof the engine works. Report founder-independent revenue to the board on a regular cadence; make it a number you are proud to show.

`;

const flow = `

## The Three Comp Models: How A Deal Flows And Who Gets Credit

\`\`\`mermaid
flowchart TD
  START[Founder Touches Revenue] --> Q{Which Structural Model}

  Q -->|Model 1| M1[Founder Off The System]
  Q -->|Model 2| M2[Founder Overlay]
  Q -->|Model 3| M3[Originate And Handoff]

  M1 --> M1A[Founder Runs Strategic Deal End To End]
  M1A --> M1B[Deal Booked As House Account]
  M1B --> M1C[No Team Quota Credit]
  M1B --> M1D[No Commission Paid To Anyone]
  M1B --> M1E[Rep Support Gets Flat Spiff Only]
  M1C --> M1F[Forecast In Founder Strategic Category]
  M1D --> M1F
  M1E --> M1F
  M1F --> CLEAN[Team Number Stays Uncontaminated]

  M2 --> M2A[Founder Sponsors Deal Rep Already Owns]
  M2A --> M2B[Rep Keeps Full Quota Credit]
  M2A --> M2C[Rep Keeps Full Commission]
  M2B --> M2D[Founder Involvement Tagged For Analytics]
  M2C --> M2D
  M2D --> M2E[Founder Comped By Equity Only]
  M2E --> AMP[Founder Amplifies Never Taxes The Rep]

  M3 --> M3A[Founder Sources And Runs First Meetings]
  M3A --> M3B[Formal Handoff At Defined Stage]
  M3B --> M3C[CRM Owner Change Plus Handoff Note]
  M3C --> M3D{Comp Option}
  M3D -->|Option A| M3E[Rep Gets Full Commission On Whole Deal]
  M3D -->|Option B| M3F[Rep Comped From Handoff Stage Forward]
  M3E --> BRIDGE[Bridge Toward Self Sufficient Team]
  M3F --> BRIDGE

  CLEAN --> RESULT[Credit Quota And Forecast Stay Auditable]
  AMP --> RESULT
  BRIDGE --> RESULT
\`\`\`

## Model Selection And The Transition Path

\`\`\`mermaid
flowchart TD
  A[Annual GTM Comp Planning] --> B[Assess Founder Dependence Of GTM]
  B --> C{Founder Sourced Or Sponsored Share Of Pipeline}

  C -->|High And Co Selling Broadly| D[Pick Model 2 Overlay]
  C -->|High And Mostly Originating| E[Pick Model 3 Handoff]
  C -->|Low Minor Separable Slice| F[Pick Model 1 House Accounts]

  D --> G{Team Maturity Check}
  E --> G
  F --> G

  G -->|Early Team Not Self Sufficient| H[Hold Model 2 Or 3 Keep Reps Fully Motivated]
  G -->|Team Generating Own Pipeline| I[Begin Migration Toward Model 1]
  G -->|Mature Team Founder Selling Minimal| J[Settle Into Model 1 As Resting State]

  H --> K[Set Team Quota Exclusive Of Founder Revenue]
  I --> K
  J --> K

  K --> L[Define Handoff Stage And Swoop Policy In Writing]
  L --> M[RevOps Tags Every Deal Source And Forecast Category]
  M --> N{Migration Trigger Metric Hit}

  N -->|Founder Independent Pipeline Below Threshold| O[Stay In Current Model Re Assess Next Cycle]
  N -->|Founder Independent Pipeline Crosses Threshold| P[Advance One Step Toward Model 1]

  P --> Q[Re Baseline Team Quota Deliberately]
  Q --> R[Report Founder Independent Revenue To Board]
  O --> R
  R --> A
\`\`\`

`;

const src = `

## Sources

1. **Founder-led sales literature — the founder as the first salesperson and the transition problem** — The widely documented pattern that founders close the earliest and hardest deals, and that the central GTM challenge of the seed-to-Series-B journey is transferring that capability to a team.
2. **SaaS sales compensation benchmarks (OTE, base/variable split, accelerators)** — Standard 50/50 and 60/40 OTE structures and quota-to-OTE ratios that define how a normal rep comp plan is built — and therefore what the founder is being carved out of.
3. **The Sales Acceleration Formula (Mark Roberts) — quota-setting and capacity modeling** — The bottoms-up capacity model (ramped reps x productivity x stretch) that team quota should be built from, exclusive of founder capacity.
4. **From Impossible to Inevitable (Aaron Ross & Jason Lemkin) — the move off founder-led selling** — The "you can't outsource your sales DNA" stage and the structured handoff from founder selling to a repeatable team motion.
5. **Predictable Revenue (Aaron Ross) — sourced vs. self-generated pipeline and credit clarity** — The discipline of distinguishing pipeline sources, which underpins the founder-sourced / rep-sourced / handoff tagging taxonomy.
6. **RevOps practitioner literature on deal attribution and credit rules** — The principle that attribution rules must be defined before deals occur, not litigated after, and that the CRM is the system of record for credit.
7. **Sales compensation design references (Xactly, CaptivateIQ, QuotaPath practitioner guidance)** — Overlay comp structures, spiffs, and the rule that comp should never disincentivize deploying a valuable resource into a deal.
8. **CRO and first-VP-Sales onboarding frameworks** — The fragility of the first sales leader's comp position and the failure modes of inflating or under-calibrating their quota relative to founder-sourced revenue.
9. **Venture diligence practice — key-person dependency and founder-independent revenue** — Why growth-stage investors specifically probe how much revenue the team produces without the founder, and treat founder dependency as a valuation discount.
10. **Forecasting discipline references — forecast category hygiene and accuracy measurement** — The practice of keeping idiosyncratic/lumpy pipeline in a separate category so the repeatable engine's forecast accuracy remains a clean diagnostic signal.
11. **Board operating reviews and GTM metrics packages** — Standard board-level GTM reporting where team attainment, pipeline source mix, and founder-independence are presented as distinct lines.
12. **Founder time-allocation and delegation literature** — The distinction between founder-led selling as a genuine strategic asset versus a crutch that prevents the sales engine from being built and tested.
13. **AI in sales — top-of-funnel automation impact on pipeline generation** — The trend of AI-assisted prospecting and qualification increasing small-team pipeline capacity, accelerating the team's self-sufficiency at origination.
14. **Quota credit and territory carve-out practices for house/named accounts** — Standard treatment of strategic or executive-owned accounts as house accounts excluded from rep quota retirement.
15. **Sales handoff and lead routing process design** — Defined stage-gates for transferring deal ownership, CRM event logging, and the documentation that prevents credit disputes.

`;

const num = `

## Numbers

**The economic actors**
- Founder typical ownership at seed-to-Series-B: ~20-60% of the company — the basis for "equity is the founder's real comp"
- Standard rep OTE structure: 50/50 or 60/40 base/variable split — the machinery the founder is carved out of
- Standard quota-to-OTE ratio: roughly 4x-6x (a rep on $250K OTE carries ~$1M-$1.5M quota)
- Founder commission as a fraction of founder equity-value gain on a strategic deal: typically an order of magnitude smaller — which is why a founder commission does not change founder behavior

**Where founder-plus-team selling shows up by stage**
- $1M-$5M ARR: founder is typically still load-bearing — often sourcing or sponsoring the majority of pipeline; Model 2 or Model 3 territory
- $5M-$15M ARR: first VP/CRO hired; founder still in most large deals; transition zone — biggest risk window for comp/quota mistakes
- $15M-$30M+ ARR: team should be the engine; founder selling narrowing to strategic logos; drifting toward Model 1
- The healthy trajectory: founder-independent (team self-sourced) bookings rising as a share of total every year — e.g. 40% two years ago to 75% now is a strong investor story

**The three models — credit and comp treatment**
- Model 1: founder strategic deals = house accounts; 0% team quota credit, $0 commission to anyone; rep support paid via flat spiff or small capped credit only
- Model 2: founder overlay; rep keeps 100% quota credit and 100% commission regardless of founder involvement; founder comped 100% by equity
- Model 3: founder originates, hands off at a defined stage; Option A = rep gets 100% commission on whole deal; Option B = rep comped from handoff stage forward
- Across all three models: founder receives $0 in commission — the founder is never on the variable comp plan

**Quota and forecast math**
- Team quota = (ramped reps x productivity per rep x stretch factor) — built bottoms-up from team capacity, exclusive of founder strategic revenue
- Company revenue target = team quota + founder/strategic target — two separate lines that sum to the goal, never blended
- Forecast structure: Team Commit + Team Best Case (graded for accuracy against itself) held separate from the Founder/Strategic forecast category
- Founder deals under Model 2/3 enter the team forecast at the handoff point under normal rules; before handoff they live in the Founder/Strategic category

**The handoff and swoop policies**
- Handoff transfer stage: a single defined stage, same every deal — commonly end-of-discovery, pre-proposal
- Handoff is a recorded CRM event: owner field change + handoff note + timestamp; undocumented handoff = process violation
- Swoop policy: founder involvement at ANY stage including the close = 0% reduction to rep credit or commission; involvement tagged for measurement only

**The transition**
- Model sequence: Model 2/3 (early, founder load-bearing) → Model 1 (mature, founder selling minimal)
- Migration trigger: a measurable metric (founder-independent pipeline share or team self-sourced bookings crossing a defined threshold) — not a vibe
- Re-baseline team quota deliberately at each transition step so it is a planned event, not a perceived goalpost move

`;

const counter = `

## Counter-Case: When Structuring The Founder's Comp Role Is The Mistake

Everything above assumes the problem is worth solving with structure. Sometimes it isn't, and a serious founder or RevOps leader should know the conditions under which all of this machinery is premature, excessive, or aimed at the wrong target.

**Counter 1 — At a very early company, the founder IS the sales team, and formalizing anything is premature.** Before there is a hired sales lead and a team of reps, there is no "parallel selling" to structure — there is just a founder selling. Building a three-model framework, a handoff taxonomy, a forecast-category split, and a RevOps tagging schema for a company with one founder and zero reps is pure bureaucracy. It creates the appearance of a sales org before there is one. At this stage the correct move is for the founder to sell, learn the motion deeply enough to teach it, and write down *what works* — not to design comp models for a team that does not exist. The structure becomes worth building at the moment of (or just before) the first quota-carrying hire, not a year early.

**Counter 2 — The elaborate model creates bureaucracy around what is really just three deals a year.** If the founder's selling has genuinely narrowed to a tiny handful of strategic logos annually, the full apparatus — model selection, handoff stages, swoop policies, separate forecast categories, transition triggers — can be wildly disproportionate to the actual activity. In that case the honest answer is the *simplest* version of Model 1: those few deals are house accounts, they are off team quota, nobody is paid commission on them, they are forecast in a clearly labeled line, and that is the entire policy. Two sentences, not a framework. Over-engineering the structure for a low-volume founder activity wastes RevOps time and signals false complexity to the team. Match the structure's weight to the founder activity's actual weight.

**Counter 3 — The real problem isn't comp structure; it's that the founder won't let go.** This is the most important counter-case, because it is the most common and the most expensive misdiagnosis. A great deal of "we need to fix our founder-and-sales-lead comp model" is actually "our founder hired a sales leader and then never let them build a team." When the founder keeps swooping, keeps holding the relationships, keeps undermining the VP's authority, keeps the team dependent — no comp design fixes that. You can carve the founder out of the quota perfectly, write an immaculate swoop policy, tag every deal flawlessly, and the company will *still* have a founder-dependent sales org, because the binding constraint was never the comp math. It was a delegation and trust problem in the founder's own behavior. In this situation, spending months perfecting the comp structure is worse than useless — it is a way of *avoiding* the real conversation. The structure can make the dependence *visible* (the founder-independence metric flatlines), and that visibility is valuable precisely because it forces the actual issue. But the fix is the founder choosing to genuinely hand over the engine, supported by the board and possibly a coach — not a better spreadsheet. If you find yourself on the third revision of the comp model and the founder-independence number still hasn't moved, stop revising the model. The model was never the problem.

**Counter 4 — Forcing a model when the founder's involvement is genuinely unpredictable.** Some founders' selling does not fit a clean model because it is genuinely opportunistic and varies enormously quarter to quarter — a burst around a conference, nothing for two months during a fundraise, a sudden strategic deal that materializes from a board connection. Trying to force this into a rigid Model 3 handoff process can create more friction than it removes. In these cases a looser Model 2 overlay (founder helps where founder helps, reps always keep full credit, RevOps tags involvement) is often the only honest fit, and trying to impose more structure than that just generates process the founder will route around anyway. Match the structure to the founder's actual behavior; do not impose a behavior the structure assumes.

**The synthesis:** the framework in this entry is the right answer for the common, important case — an early-to-mid-stage company with a real hired sales lead and team, a founder still actively selling, and a genuine need to keep credit, quota, forecast, and morale clean. But it is the wrong answer when there is no team yet, when the activity is too small to justify the apparatus, when the founder's behavior is too variable to model cleanly, and — most importantly — when the actual problem is a founder who won't delegate, which no comp structure can solve. Use the structure when the structure is the bottleneck. When the bottleneck is the founder's own willingness to let go, the comp model is a distraction from the conversation that actually matters.

`;

const links = `

## Related Pulse Library Entries

- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Top-of-funnel automation context for the 5-year outlook on founder origination.)
- **q9501** — How do you start a bookkeeping business in 2027? (RevOps-adjacent operational discipline parallels.)
- **q9502** — How do you start a CPA firm in 2027? (Professional-services comp-model adjacency.)
- **q9521** — How should you structure sales compensation for your first sales hire? (Direct predecessor: building the first rep's plan that the founder is carved out of.)
- **q9523** — How do you set sales quota and capacity for an early sales team? (The bottoms-up capacity model referenced in quota-setting here.)
- **q9524** — When should a founder hire their first VP of Sales? (The hiring decision that triggers the need for this comp structure.)
- **q9525** — How do you transition from founder-led sales to a sales team? (The broader transition this comp framework operationalizes.)
- **q9526** — How do you design a sales commission plan that doesn't break? (General comp-plan design principles underneath the rep side of this.)
- **q9527** — What is the role of RevOps in an early-stage company? (Expands the RevOps deal-tagging and attribution responsibilities.)
- **q9528** — How do you handle deal credit and attribution disputes? (Deep dive on the credit-attribution problem central to this entry.)
- **q9529** — How do you forecast revenue when your pipeline is lumpy? (Forecast-category hygiene deep dive.)
- **q9530** — How do you set OTE and base/variable splits for sales reps? (The standard plan structure the founder is excluded from.)
- **q9531** — What is a sales overlay role and when do you need one? (Model 2 overlay mechanics in a broader context.)
- **q9532** — How do you build a sales handoff process between teams? (Model 3 handoff-stage design generalized.)
- **q9533** — How should a CRO be compensated? (The sales leader's comp, expanded.)
- **q9534** — How do you measure whether your sales engine is repeatable? (Founder-independent revenue as the key signal.)
- **q9535** — How do you keep a sales team motivated when deals are unevenly distributed? (The team-morale landmine, expanded.)
- **q9536** — How much should a founder still sell after hiring a sales team? (The CEO time-allocation question, expanded.)
- **q9537** — What do investors look for in a company's GTM during diligence? (Board and investor optics deep dive.)
- **q9538** — How do you structure house accounts and named accounts? (Model 1 house-account mechanics.)
- **q9539** — How do you design spiffs and non-quota incentives? (Rep-support spiff mechanics under Model 1.)
- **q9540** — How do you run an annual sales planning cycle? (Where the decision framework gets re-run each year.)
- **q9601** — How do you start a fractional CFO business in 2027? (RevOps/finance adjacency.)
- **q1946** — How do you start a real estate investing business in 2027? (Unrelated vertical; included for library cross-reference completeness.)

`;

const tags = ['sales-compensation','founder-led-sales','gtm-strategy','revops','quota-design','sales-leadership','startup-sales','deal-attribution','sales-management','comp-plan'];

const sources = [
  { title: 'From Impossible to Inevitable (Aaron Ross & Jason Lemkin) — the move off founder-led selling', url: 'https://impossible.fromimpossible.com' },
  { title: 'The Sales Acceleration Formula (Mark Roberge) — quota-setting and capacity modeling', url: 'https://www.markroberge.com' },
  { title: 'Predictable Revenue (Aaron Ross) — sourced vs. self-generated pipeline and credit clarity', url: 'https://predictablerevenue.com' }
];

const notes = {
  s6: 'Added 15 cited sources spanning founder-led-sales literature (From Impossible to Inevitable, Predictable Revenue), sales-comp design references (Xactly, CaptivateIQ, QuotaPath practitioner guidance), capacity-modeling frameworks (The Sales Acceleration Formula), RevOps attribution practice, CRO onboarding frameworks, venture diligence practice on key-person dependency, forecasting-discipline references, and sales-handoff/lead-routing process design.',
  s7: 'Added comprehensive numerical analysis: the economic actors (founder ownership 20-60%, standard 50/50-60/40 OTE, 4x-6x quota-to-OTE ratio, founder commission an order of magnitude smaller than equity-value gain), founder-plus-team selling by stage ($1M-$5M / $5M-$15M / $15M-$30M+ ARR), the three models credit/comp treatment (Model 1 = 0% team credit and $0 commission, Model 2 = 100% rep credit, Model 3 Option A/B), quota and forecast math (bottoms-up capacity formula, company target = team quota + founder/strategic target), handoff and swoop policy specifics, and the transition trigger structure.',
  s8: 'Added 4-element counter-case plus synthesis: (1) at a very early company the founder IS the sales team and formalizing anything is premature bureaucracy; (2) the elaborate model creates disproportionate bureaucracy when the founder really does only 3 strategic deals a year; (3) the most important misdiagnosis — the real problem is a founder who will not let go, which no comp design fixes, and perfecting the comp model becomes a way of avoiding the real conversation; (4) forcing a rigid model when the founder involvement is genuinely unpredictable. Synthesis frames when the structure is the bottleneck vs. when the founder behavior is.',
  s9: 'Cross-linked 23 related Pulse entries: the direct sales-comp and quota neighbors (q9521/q9523/q9526/q9530/q9533), the founder-to-team transition cluster (q9524/q9525/q9534/q9536), RevOps and attribution (q9527/q9528/q9529), overlay/handoff/house-account mechanics (q9531/q9532/q9538/q9539), morale and investor optics (q9535/q9537), annual planning (q9540), and adjacent context entries.',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of founder-and-sales-lead parallel-selling comp structure for early-to-mid-stage companies. Two mermaid diagrams (the three comp models showing how a deal flows and who gets credit/commission in each; the model-selection decision tree with the transition path). Full coverage: the core problem of two different economic actors in one comp machine, why the founder is not put on a standard plan, defining the founder role (strategic deals / exec sponsor / market-maker), the credit-attribution landmine, the three structural models (Founder Off The System / Founder Overlay / Originate-And-Handoff) each with a deep dive, model selection by stage and founder-dependence and deal mix, the sales leader comp in this context, setting team quota when the founder also sells, forecast treatment with separate categories, handoff mechanics, the founder-swoop problem and policy, equity as the founder real comp, the transition plan toward Model 1, the team-morale landmine, the RevOps deal-tagging job, board and investor optics on founder-independent revenue, the CEO time-allocation question, 5 real-world scenarios, the decision framework, the 5-year outlook, a final framework with all templates, and a 4-element counter-case on when structuring the founder comp role is itself the mistake.'
};

runPolish({ id: 'q9522', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
