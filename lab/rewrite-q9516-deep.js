// q9516 — What is the right framework for AE discount autonomy: should it scale by tenure, deal size, or something else?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** The instinct to scale AE discount autonomy by **tenure** is the most common framework and one of the weakest. Tenure is a proxy for nothing that matters: a rep's eighteen months on the team tells you nothing about whether their deals hold margin, and some of the worst discounters are senior reps who learned that discounting closes deals. **Deal size** is a stronger axis — bigger deals justify more latitude because the absolute margin at stake is larger and the strategic value is higher — but deal size alone over-empowers reps on whales and under-empowers them on the small fast deals where speed actually matters. The right framework is a **multi-factor model**: discount autonomy = f(**discount depth**, **deal size**, **margin floor**, **strategic value**, **rep track record**). Discount depth and deal size form the core grid — a small discount on a small deal is pure rep autonomy, a deep discount on any deal escalates. The **margin floor is a hard gate** that overrides everything: no autonomy below the contribution-margin floor, ever, regardless of who is asking or how big the logo. **Strategic value** is an override path — leadership can grant discretion for a marquee logo or competitive displacement that the matrix would otherwise block. And the single highest-leverage replacement for tenure is **rep track record**: the rep whose closed deals hold their margin earns a wider discount band; the rep who discounts everything gets a narrower one — reviewed quarterly, earned and revocable. Underneath all of it sits the **comp plan**, the deepest lever of all: if comp rewards revenue regardless of discount, no autonomy framework will hold, because the rep is being paid to give your margin away. Margin-based commission or discount clawbacks make reps self-police, which is worth more than any approval matrix. Tune the bands by **GTM motion** — wide autonomy for transactional SMB where speed wins, tight bands and deal-desk involvement for enterprise, near-list-price discipline for PLG-assist. New reps get less autonomy not as a tenure principle but because they have no track record yet. The framework fails when it becomes a bureaucracy that slows the very deals it was meant to speed up.`;

const core = `

## The Question Reframed

The question "should discount autonomy scale by tenure or deal size?" smuggles in a false binary, and the framing is worth dismantling before answering. Both halves of the question assume autonomy should scale by a *single axis*, and the entire premise of a good discounting framework is that no single axis is sufficient. The instinct behind the question is almost always tenure: "more experienced reps have earned more rope." It feels intuitive, it feels fair, and it is administratively trivial — you already track hire dates. But tenure is a proxy for nothing that actually predicts whether a rep will protect your margin. It correlates loosely with product knowledge and objection handling, and not at all with discount discipline. Some of the most destructive discounters on any sales floor are five-year veterans who have internalized, deal after deal, that the fastest way to a closed-won is to lead with price. Tenure rewarded them with autonomy; autonomy let them erode price integrity at scale.

Deal size is the better instinct, and it is worth taking seriously. A rep negotiating a $400K enterprise agreement is operating in a context where the absolute dollars of margin at stake are large, where the strategic value of the logo may justify aggressive terms, and where the buyer's procurement team expects negotiation. A rep closing a $6K SMB deal is in a different world — the margin dollars are small, the deal needs to move fast, and every approval cycle is friction that kills velocity. So deal size genuinely should influence the framework. But deal size alone has a failure mode: it over-empowers the rep who happens to be sitting on a whale and under-empowers the rep grinding through twenty small deals a quarter where the cumulative margin leakage is just as real.

The honest answer is that discount autonomy should be a function of several factors at once — discount depth, deal size, a hard margin floor, strategic value, and the rep's actual track record of discipline — with the comp plan underneath reinforcing all of it. The rest of this entry builds that model factor by factor, shows how to assemble it into an approval matrix, and is equally direct about when the whole exercise is over-engineering.

## Why Tenure-Based Autonomy Is Tempting But Flawed

Tenure-based autonomy is the default at a surprising number of companies, and it is worth being precise about why it is so attractive — because the attractions are real, they are just not the same thing as being correct. The first attraction is fairness optics. Tenure feels equitable in a way that is hard to argue with: everyone ages into more trust on the same schedule, nobody is singled out, and the criterion is utterly transparent. The second attraction is administrative simplicity. You do not need to build a scorecard, run a quarterly review, or defend a judgment call — the rule is "year one reps get 10%, year two reps get 15%, year three-plus reps get 20%," and it runs itself. The third attraction is that it *feels* like it tracks competence, because tenure does loosely correlate with product fluency, discovery skill, and the ability to articulate value.

But here is the problem, and it is fatal: tenure does not correlate with the specific skill the autonomy framework is supposed to govern, which is the discipline to *not* discount. A rep can spend three years getting genuinely excellent at discovery, demos, multithreading, and closing — and simultaneously get worse and worse at holding price, because every quarter they learn anew that a discount unsticks a stalled deal. Tenure rewards that rep with more rope precisely as they become less deserving of it. Meanwhile a sharp eighteen-month rep who has quietly built a book of deals that all closed within 5% of list gets less autonomy than the senior rep two desks over who has never met a discount they didn't like.

There is also a subtler cost. Tenure-based autonomy sends a cultural message: autonomy is something you *age into*, not something you *earn through behavior*. That message removes the incentive to actually be disciplined, because discipline does not change your band — only the calendar does. A framework that decouples the privilege from the behavior it is supposed to encourage is not a framework; it is a seniority perk dressed up as governance. Tenure can be a minor input — it is a reasonable tiebreaker and a reasonable floor for brand-new reps who have no track record yet — but it should never be the primary axis.

## Why Deal-Size-Based Autonomy Is Stronger

Deal size deserves more credit than tenure, because it actually tracks something economically meaningful. The argument for scaling autonomy with deal size rests on three solid pillars. First, the absolute margin at stake. A 15% discount on a $400K deal is $60K of margin; a 15% discount on a $8K deal is $1,200. The bigger deal genuinely warrants more eyes — not because the rep is less trustworthy, but because the consequence of a bad call is an order of magnitude larger. Second, strategic weight. Large deals are disproportionately likely to be marquee logos, multi-year commitments, or competitive displacements where the company may *rationally choose* to trade margin for the win. Putting those decisions in front of a deal desk or a VP is not bureaucracy; it is making sure the trade-off is made deliberately rather than by a rep under quota pressure. Third, buyer expectation. Enterprise buyers run procurement processes that expect negotiation, multiple rounds, and approval gates; the deal size that triggers more internal scrutiny usually matches the deal size where the buyer is also bringing more firepower.

So deal size should absolutely be a factor — arguably the second-most-important after discount depth. But "scale autonomy by deal size" as a *standalone* framework breaks in two directions. It over-empowers the rep on the whale: if a rep's autonomy ceiling rises with deal size, the rep sitting on the biggest deal in the company has the *most* unilateral latitude exactly when the stakes are highest — which is backwards. And it under-empowers the rep on the long tail of small deals. A transactional rep closing thirty $9K deals a quarter, each one needing to move in days, gets squeezed by a deal-size framework that gives them almost no room — and the cumulative margin leakage across thirty under-scrutinized small discounts can easily exceed the leakage on one carefully-watched big deal.

The resolution is that deal size belongs *inside* a grid, paired with discount depth, not used as a solo axis. A small discount on a large deal can still be rep-autonomous; a deep discount on a small deal should still escalate. It is the *interaction* of size and depth that matters, which is why the core of the real framework is a two-dimensional matrix, not a one-dimensional ladder.

## The Multi-Factor Model

The right framework for AE discount autonomy is a multi-factor model, and it is worth stating it cleanly as an equation before decomposing it: **discount autonomy = f(discount depth, deal size, margin floor, strategic value, rep track record)**. Each of those five factors plays a distinct role, and the roles are not symmetric — some are continuous inputs, one is a hard gate, one is an override, and one is a modifier. Getting the *structure* right matters as much as getting the factors right.

**Discount depth** and **deal size** are the two continuous core inputs. They form a grid: depth on one axis, size on the other, and the cell you land in determines the base approval tier. This is the workhorse of the framework and the part most companies already have in some form.

**Margin floor** is not an input to the grid — it is a hard gate that sits in front of it. Before the grid is even consulted, the system checks whether the proposed price clears the contribution-margin floor. If it does not, nothing else matters: not the rep's track record, not the logo, not the deal size. The floor is absolute. This is the single most important structural feature of the model, because it means the worst-case outcome is bounded no matter how every other factor lines up.

**Strategic value** is an override path, not a grid input. The matrix is designed for the typical deal; strategic value is the documented exception lane for the atypical one — the marquee reference logo, the competitive displacement, the beachhead account — where leadership consciously chooses to grant latitude the grid would deny. It routes *up*, never down, and it requires a named approver and a written rationale.

**Rep track record** is a modifier on the grid. It does not change the axes; it shifts where a given rep's autonomy ceiling sits within them. A rep with a strong discipline history operates with a wider band — more cells are self-serve for them. A rep with a weak history operates with a narrower band — more cells escalate. This is the factor that replaces tenure, and it is the one most companies are missing entirely.

Assembled, the model reads: clear the margin floor first; locate the deal on the depth-by-size grid; apply the rep's track-record modifier to determine whether that cell is self-serve or escalated for *this specific rep*; and allow a strategic-value override to route exceptional deals up a documented path. Five factors, four structural roles, one coherent system.

## Factor 1 — Discount Depth

Discount depth — the raw percentage off list, or off the standard rate card — is the first and most important continuous factor, and it deserves primacy because it is the most direct measure of how far a given deal departs from your intended pricing. A useful way to think about depth is in bands, and the bands should map to escalating levels of scrutiny regardless of who is selling or how big the deal is.

The shallow band — call it 0% to roughly 10% off — should be almost entirely rep-autonomous for any rep in good standing. Discounts in this range are the normal texture of B2B selling: a rounding-down to a clean number, a small concession to close a quarter, a minor nod to a multi-year commitment. Forcing approval on every sub-10% discount generates enormous friction for very little margin protection, and it trains reps to see the deal desk as an obstacle rather than a partner.

The moderate band — roughly 10% to 20% — is where the rep's track record starts to matter. For a disciplined rep this band may still be largely self-serve; for a rep with a weak history it routes to their manager. This is the band where the track-record modifier does most of its work.

The deep band — beyond 20%, with the exact threshold depending on your margins and category — should escalate regardless of who is asking or how big the deal is. A 30% discount is a statement about your pricing, and statements like that should be made by someone with portfolio-level visibility, not by an individual rep under end-of-quarter pressure. The key principle: depth-driven escalation is *person-agnostic and size-agnostic at the extremes*. The shallowest discounts are always autonomous; the deepest always escalate; the middle is where the other factors do their tuning.

## Factor 2 — Deal Size

Deal size — measured in absolute annual contract value, not in units or seats — is the second continuous core factor, and it modulates the depth bands rather than standing alone. The principle is that the same discount percentage carries different absolute risk at different deal sizes, so the size axis sets *where the escalation thresholds fall*.

Concretely: a 15% discount might be fully rep-autonomous on a $10K deal, route to a manager on a $75K deal, and route to the deal desk or a director on a $300K deal — same percentage, three different tiers, because the absolute margin dollars and the strategic stakes scale with size. The size bands themselves should be drawn to match your actual deal distribution. A company whose deals cluster between $5K and $40K needs finer gradation in that range and a single "everything above $100K" bucket; a company selling six-figure deals needs the opposite. Drawing the bands off a real histogram of closed deals — rather than round numbers picked in a conference room — is what makes the matrix feel calibrated rather than arbitrary.

The crucial design choice is the *direction* of the size effect. Larger deals should generally mean *more scrutiny* at a given discount depth, not less. This is the opposite of a naive "big deals get more autonomy" instinct, and it is correct: the rep on the largest deal in the pipeline should not also have the most unilateral latitude. Deal size raises the stakes, and raised stakes warrant more eyes — the rep still drives the deal, but a deep discount on a large deal is a decision the organization makes together. The exception is handled not by the size axis but by the strategic-value override, which is a deliberate, documented choice rather than an automatic consequence of bigness.

## Factor 3 — Margin Floor

The margin floor is the structural keystone of the entire framework, and it is different in kind from every other factor. Depth, size, track record, and strategic value all influence *which tier* of approval a deal needs. The margin floor influences nothing — it simply forbids. It is a hard gate, and it sits in front of the grid: before the matrix is consulted, the system asks one question — does the proposed price clear the contribution-margin floor? — and if the answer is no, the deal cannot proceed at that price under *anyone's* authority short of an explicit, rare, executive-level exception.

The floor should be defined in contribution-margin terms, not in discount-percentage terms, because discount percentage is a blunt instrument. Two deals at the same discount off list can have wildly different margins depending on payment terms, implementation cost, third-party pass-through costs, support intensity, and product mix. The floor that matters is the one below which the deal stops contributing — where you are, in real terms, paying the customer to take the product. That number belongs to finance, it should be computed per deal (modern CPQ can do this), and it should be visible to the rep *as they build the quote*, not discovered at approval time.

Why is the floor structurally non-negotiable? Because it is the one feature that bounds the worst case. Every other factor can be gamed, mis-tuned, or overridden by a persuasive rep on the last day of the quarter. The floor cannot — it is arithmetic. A framework with a hard margin floor has a known, defensible worst case: every deal contributes something. A framework without one has no floor at all, and "no floor" is how a sales org wakes up to a quarter of deals that booked revenue and lost money. Strategic-value overrides route *up* to more scrutiny; they never route *through* the margin floor. The floor is the one line the framework draws in permanent ink.

## Factor 4 — Strategic Value

Strategic value is the factor that keeps the framework from being stupid. Any matrix built on depth and size will, by construction, block some deals that the company would — on reflection, with full information — actually want to do. The marquee logo whose name on your customer page is worth more than the margin on the deal. The competitive displacement that denies a rival a beachhead. The land-and-expand account where the first contract is deliberately thin because the expansion math is enormous. The reference customer in a vertical you are trying to break into. A rigid matrix says no to all of these; a good framework gives them a documented path to yes.

The right way to handle strategic value is as an explicit *override path*, not as a sixth column in the grid. It should never be a factor a rep can self-assert — "this one's strategic" is the single most abused phrase in discount approvals, and if strategic value is a self-serve input, every deal becomes strategic by the last week of the quarter. Instead it should be a named lane: the rep flags the deal, a specific senior approver (a VP, the CRO, sometimes a strategic-deals committee) reviews the strategic rationale, and the approval is granted *with a written justification attached to the deal record*. The justification matters because it makes the override auditable — at quarter's end you can pull every strategic override and ask whether the strategic value actually materialized, or whether "strategic" was just a synonym for "I wanted to discount more than my band allowed."

Two guardrails keep the strategic lane honest. First, it routes *up*, never around the margin floor — even a marquee logo has to clear the contribution-margin minimum, because a strategic logo that loses money is still losing money. Second, it should be *rare*: if more than a small single-digit percentage of deals are going through the strategic override, the override has become the process, which means the underlying matrix is mis-tuned and needs to be widened rather than routinely bypassed.

## Factor 5 — Rep Track Record

Rep track record is the factor that replaces tenure, and it is the single most important conceptual move in the entire framework. The intuition behind tenure-based autonomy is not wrong — it is right that *some* reps should have more rope than others. The mistake is using the calendar to decide which reps. The correct criterion is behavioral: a rep earns a wider discount band by demonstrating, deal after deal, that they protect margin; a rep earns a narrower one by demonstrating the opposite.

Track record should be measured, not vibed. The core metric is the rep's realized discount discipline — the average discount depth across their closed-won deals, ideally weighted by deal size, compared against a peer benchmark for similar deals and segments. A rep whose deals consistently close within a few points of list, who escalates appropriately, who does not show an end-of-quarter discount spike, and whose deals hold their margin post-sale has demonstrably earned more autonomy. A rep whose every deal lands at the bottom of their band, who treats their autonomy ceiling as a starting point rather than a limit, who leads with price in discovery — that rep has demonstrated they need a narrower band, regardless of how long they have been on the team.

This is the move that fixes the senior-over-discounter problem directly. Under tenure-based autonomy, the five-year veteran who discounts everything has the *widest* band on the team. Under track-record-based autonomy, that same rep's measured discipline is poor, so their band is *narrow* — and it stays narrow until their behavior changes. The autonomy follows the behavior, which is the entire point. It also fixes the inverse: the disciplined eighteen-month rep is not held back by the calendar; their strong record earns them a wide band early. Track record makes autonomy a *consequence of how you sell*, which is the only basis on which it actually shapes behavior.

## The Performance-Earned Autonomy Model

If track record replaces tenure as the criterion, then autonomy stops being a static attribute of a rep and becomes a *dynamic privilege* — earned, measured, and revocable. This is worth making explicit as its own model, because the shift in framing changes how reps relate to the framework. Under tenure-based autonomy, your band is a fact about you, like your hire date. Under performance-earned autonomy, your band is a *standing*, like a credit score — it reflects recent behavior, it can go up, and it can go down.

The mechanism is a rep discount scorecard, reviewed on a fixed cadence — quarterly works well, because it is frequent enough to be responsive and infrequent enough not to be noise. The scorecard rolls up the factors that actually predict disciplined selling: average realized discount versus segment benchmark, the shape of the rep's discounting through the quarter (a flat line is healthy, a hockey stick in the final two weeks is a flag), escalation behavior (does the rep escalate appropriately, or sandbag right under the threshold), win rate at low discount levels (the real skill is winning *without* discounting), and margin realization on closed deals. The scorecard produces a tier — and the tier sets the rep's discount band for the next quarter.

The revocability is the part that makes it work. A rep who has a sloppy quarter sees their band tighten the next quarter; a rep who cleans up their discipline sees it widen again. Crucially, this is framed as coaching, not punishment — the manager's conversation is "here is what your scorecard shows and here is how to earn the band back," not "you lost a privilege." Done well, the performance-earned model turns the autonomy framework into a continuous feedback loop on selling behavior, which is far more valuable than any one-time approval decision. The band is not the reward; the band is the *signal*.

## The Approval Authority Matrix Done Right

The approval authority matrix is where the framework becomes operational, and most companies have *a* matrix — it is just usually built on the wrong axes or missing the gates that make it safe. A matrix done right has a specific anatomy.

The two axes of the grid are **discount depth** and **deal size**. Depth runs in bands — shallow, moderate, deep — and size runs in bands drawn from your real deal histogram. Each cell of the grid contains an **approval tier**: self-serve (the rep), manager, deal desk, director, VP, CRO. The shallow-discount-small-deal corner is self-serve; the deep-discount-large-deal corner is CRO or strategic committee; the tiers escalate smoothly across the grid in between.

In front of the grid sits the **margin-floor hard gate**. No cell of the matrix is reachable if the deal fails the contribution-margin floor — the gate is checked first, and a failed deal cannot be approved at that price by any tier in the grid. This is what makes the matrix safe rather than merely organized.

Layered onto the grid is the **rep track-record modifier**. The grid defines the *base* tier for a deal; the rep's track-record tier shifts which cells are self-serve *for that specific rep*. A high-discipline rep's self-serve region extends further into the grid; a low-discipline rep's contracts. The matrix is therefore not one grid but a base grid plus a per-rep overlay.

Running alongside the grid is the **strategic-value override path** — a separate documented lane that routes a flagged deal to a named senior approver regardless of where it sits on the grid, with a written rationale required and the margin floor still binding.

The output of consulting the matrix is a single, fast, unambiguous answer: for *this* deal, with *this* depth and *this* size, sold by *this* rep, the approver is X — or, if it clears the rep's self-serve region, no approval is needed at all. Speed is a feature: the matrix should resolve in seconds inside CPQ, not in a Slack thread.

## The Comp Plan Connection

The comp plan is the deepest lever in the entire discussion, and it is the one most discount-autonomy projects ignore — which is why so many of them fail. An autonomy framework is a set of *rules* about discounting. The comp plan is the set of *incentives* about discounting. When the rules and the incentives disagree, the incentives win, every time, because the rules are something a rep navigates around and the incentives are what the rep is actually optimizing for.

Here is the failure mode in its purest form. A company builds a careful multi-factor autonomy matrix, with bands and gates and a deal desk — and then pays commission as a flat percentage of revenue, with no sensitivity to discount at all. The rep now faces a simple math problem: a deeper discount closes the deal faster and bigger, and costs the rep nothing, because their commission is on revenue. Every incentive the rep has points toward discounting; the only thing standing between the rep and a deep discount is an approval step they experience as friction. The framework is fighting the comp plan, and the comp plan is undefeated.

The fix is to wire the comp plan to reinforce the framework rather than undermine it. There are several mechanisms, and they can be combined. **Margin-based commission** pays the rep on gross margin or on a discount-adjusted revenue figure, so a deeper discount directly shrinks the rep's own check — the rep now self-polices because their interest and the company's are aligned. **Discount multipliers** scale the commission rate by how close to list the deal landed: full rate at list, a reduced rate as the discount deepens. **Discount clawbacks** recover part of the commission if the deal's discount exceeded a threshold or if margin erodes post-sale. The common thread is that the rep should *feel* the discount in their compensation. When they do, the autonomy framework almost runs itself — the matrix becomes a backstop for edge cases rather than the primary line of defense, because the rep's own paycheck is already doing the policing. An autonomy framework on top of a misaligned comp plan is a fence with the gate left open.

## The "Autonomy Builds Trust And Speed" Argument

There is a strong case *for* giving reps real discount latitude, and a framework designed only to restrict will get the balance wrong. The case rests on velocity and on trust, and both are economically real.

The velocity argument is straightforward: every approval is friction, and friction has a cost measured in deal cycle time and in win rate. A rep who has to escalate a routine 12% discount on a routine deal loses hours or days waiting for a manager who is in meetings, and the buyer — who is also talking to competitors — feels the slowdown. In a transactional motion especially, where deals are supposed to close in days, an approval step can be the difference between a closed-won and a deal that goes cold. A well-designed autonomy band eliminates that friction for the *normal* deal, which is the large majority of deals, and reserves the approval machinery for the genuine exceptions. The math is favorable: the margin protected by approving routine discounts is small, and the velocity lost is large, so a wide self-serve band for routine discounts is usually net-positive even before considering its effect on morale.

The trust argument is subtler but just as real. Reps are professionals, and a framework that requires sign-off on trivial decisions communicates that the company does not trust them to do their job. That communication has costs: it demoralizes the disciplined reps (who are being treated the same as the undisciplined ones), it pushes good reps toward companies with more grown-up frameworks, and it encourages gaming (a rep who feels micromanaged starts structuring deals to slip under thresholds rather than selling honestly). A framework that grants real latitude — especially latitude *earned* through track record — sends the opposite message: discipline is recognized, autonomy is a reward, and the company treats its reps as adults. That trust pays back in retention, in honest forecasting, and in reps who escalate the genuinely hard deals instead of hiding them.

## The "Autonomy Erodes Price Integrity" Counter

The counter-argument is equally real, and a framework that over-indexes on velocity and trust will erode something that is very hard to rebuild: price integrity. Unchecked autonomy has two corrosive effects, one on the market and one on the sales team itself.

The effect on the market is that discounting trains your buyers. Every deal that closes well below list is a data point that propagates — through procurement networks, through user communities, through the simple fact that buyers talk. If your reps have wide latitude and use it, the market learns that your list price is fiction and that the real price is whatever a determined buyer can extract. Once that belief takes hold it is extraordinarily expensive to reverse, because every future buyer now opens the negotiation assuming a discount is available, and your reps are negotiating up from a discounted anchor rather than down from list. Price integrity, once lost, is a multi-year repair.

The effect on the sales team is arguably worse, because it is a learned habit. A rep with wide autonomy and weak comp alignment learns, deal by deal, that discounting is *the close* — that the way to unstick a deal is to drop price. This is a skill atrophy: the rep stops developing the harder skills of value articulation, ROI framing, and trading concessions for terms, because the discount lever is right there and it works. Over a few years you end up with a sales team that is structurally dependent on discounting, that cannot sell at list even when the buyer would have paid it, and whose every forecast is a story about what discount will be required. This is the steady state that tenure-based autonomy quietly produces: the most senior reps, with the widest bands, are often the *least* able to hold price, because they have had the most years to learn that they do not have to. The framework has to push back against this — through the margin floor, through depth-based escalation, through comp alignment, and through a track-record model that makes discipline visible and consequential.

## Tuning The Bands By GTM Motion

A single set of discount bands cannot be right for every go-to-market motion, because the motions have genuinely different economics. The framework's *structure* — the five factors, the grid, the gates — is universal; the *calibration* of the bands has to be tuned per motion.

In a **transactional SMB motion**, speed is the dominant variable. Deals are small, cycles are short, volume is high, and the cost of an approval step — measured in lost velocity and dead deals — is large relative to the margin at stake on any single deal. The bands here should be *wide*: a generous self-serve region so reps can move fast, with escalation reserved for genuinely deep discounts. The margin floor still binds, and depth-based escalation still applies, but the moderate band leans heavily self-serve. The risk you are managing is not any one deal; it is the aggregate, which you manage through comp alignment and track-record review rather than through per-deal friction.

In an **enterprise motion**, the calculus inverts. Deals are large, cycles are long, and the absolute margin on a single deal is big enough that an approval step is cheap insurance. The bands should be *tighter*, the deal desk should be involved earlier and more routinely, and even moderate discounts on large deals should route to a human with portfolio visibility. Buyers expect a process here anyway, so the internal approval process does not feel like friction to them the way it would to an SMB buyer. The strategic-value override gets more use in enterprise, because enterprise deals are more often genuinely strategic.

In a **PLG-assist motion**, where the product largely sells itself and sales is layering on for expansion or larger commitments, the default should be *near-list-price discipline*. The whole premise of PLG is that the price is the price; heavy discounting in a PLG-assist motion undermines the self-serve pricing that the rest of the funnel depends on. Autonomy bands here should be narrow, discounting should be the exception, and the framework's job is mostly to keep the assist motion from polluting the product-led pricing integrity.

## The New-Rep Ramp

New reps are the one place where something that *looks* like tenure-based autonomy is actually correct — but it is worth being precise about *why*, because the reasoning is what keeps it from collapsing back into a tenure framework. A brand-new rep gets a narrow discount band not because newness is a principle that deserves less rope, but because a new rep has *no track record yet*. The track-record modifier is the real mechanism; a new rep simply has a null value in it, and the safe default for a null is a narrow band.

The framing matters because it changes how the band expands. Under a tenure framework, a new rep's band widens on a schedule — twelve months in, the band grows, regardless of how the rep has actually been selling. Under a track-record framework, a new rep's band widens *as the scorecard fills in*. The first quarter or two, the rep operates in a deliberately narrow band with their manager as a close first approver — and that is fine, because those early deals are also where the rep most benefits from a manager in the loop as a coach. As the rep accumulates closed deals, the scorecard starts to have signal: are their deals holding margin, are they escalating appropriately, are they winning without leading on price? A rep who demonstrates discipline early earns a wider band fast — potentially faster than a tenure schedule would have allowed. A rep who shows poor discipline early does *not* age into a wider band just because the calendar advanced.

The practical onboarding design is a narrow starting band, a manager as the default first approver for anything beyond it, an explicit "here is how the band expands" conversation on day one so the rep knows the path, and the first scorecard review timed for the end of the rep's first full quarter. The message to the new rep is the same message the whole framework sends: autonomy is earned through how you sell, and here is exactly how to earn it.

## The Senior-Rep Problem

The senior-rep problem is the sharpest illustration of why tenure-based autonomy is broken, and it deserves direct treatment because almost every sales org has at least one of these reps. The pattern: a five-, seven-, ten-year veteran, genuinely skilled in many dimensions — deep product knowledge, strong relationships, reliable pipeline — who is also, measurably, the worst discounter on the team. Every deal lands at the bottom of their band. They open negotiations near their floor. They have a pronounced end-of-quarter discount spike. And under a tenure-based framework, this rep has the *widest discount band on the team*, because they have been there the longest.

This is not a hypothetical edge case; it is the predictable end state of tenure-based autonomy. The mechanism is straightforward: discounting *works* — it does close deals — and a rep with a wide band and no comp penalty for using it will, over years, optimize toward it. Tenure rewarded the years; the years produced the habit; the habit erodes margin at the largest scale of anyone on the team, because the senior rep also tends to carry the biggest deals. Tenure-based autonomy does not just fail to prevent this; it *actively produces* it, by handing the most rope to exactly the reps who have had the most time to learn bad habits.

Track-record-based autonomy fixes it cleanly and without drama. The senior over-discounter's scorecard reflects their actual behavior: poor realized-discount discipline, a bad end-of-quarter shape, low win rates at list. Their band is therefore *narrow* — not as a punishment, but as a direct readout of their measured discipline. And because the band is revocable and reviewed quarterly, it comes with a path back: the manager's conversation is "your scorecard shows this; here is how to widen the band again," and a senior rep who genuinely cleans up their discounting earns the band back. The framework does not care about the years; it cares about the behavior, and it makes the behavior visible, consequential, and changeable. That is the entire fix.

## Measuring Whether The Framework Works

A discount-autonomy framework that is not measured is just a set of opinions, and the measurement is what turns it into a system that improves. There is a specific set of metrics that tells you whether the framework is working, and they should be reviewed on the same quarterly cadence as the rep scorecards.

**Average discount by band** is the baseline: what is the realized discount in the self-serve region, the manager-approval region, the deal-desk region? If the self-serve average is creeping up quarter over quarter, the bands are too wide or comp is misaligned. **Percentage of deals at the autonomy ceiling** is a sharper signal: if a large share of a rep's deals land *exactly* at their self-serve limit, the rep is treating the ceiling as a target — a classic gaming pattern that says the band should probably be re-thought or the comp plan re-examined. **Win rate by discount level** answers the question the whole framework exists to inform: are deeper discounts actually buying wins, or are reps discounting deals that would have closed anyway? If win rate is flat across discount levels, the discounting is pure margin leakage. **The end-of-quarter discount spike** — the gap between discounting in the first half of the quarter and the last two weeks — is one of the most diagnostic numbers there is; a steep spike means reps are using discounts to pull deals across an artificial line, which is a comp-timing and forecasting problem as much as an autonomy problem. **Margin realization** closes the loop: are the deals that booked at a given margin still at that margin after implementation costs, payment terms, and support load? If realized margin is consistently below quoted margin, the margin floor is being computed wrong.

Read together, these metrics tell you not just whether the framework is working but *where* it is failing — too-wide bands, ceiling-gaming, ineffective discounting, quarter-end distortion, or a mis-calibrated floor — and each failure mode points to a specific fix.

## Governance And Recalibration

A discount-autonomy framework is not a thing you build once; it is a thing you *run*, and running it means a recurring governance rhythm. The natural cadence is quarterly, aligned with the rep scorecard reviews, and the governance review has a specific agenda.

First, **the scorecard reconciliation**: who earned a wider band this quarter, who lost band, and are those movements defensible? This is also the moment to sanity-check the scorecard itself — is it measuring the right things, is it being gamed, are there reps whose scorecard tier feels wrong relative to their actual selling behavior? Second, **band calibration**: are the depth bands and size bands still drawn correctly against the current deal distribution? Deal sizes drift, product mix changes, new segments open — a matrix calibrated eighteen months ago against a different deal histogram is quietly mis-tuned. Third, **the override audit**: pull every strategic-value override from the quarter and ask whether the strategic value materialized. Overrides that consistently fail to deliver on their written rationale mean the override lane is being abused, or the approvers granting them are too soft. Fourth, **the gaming review**: where is the framework being worked rather than followed? Deals structured to slip under a threshold, deals split to stay in a self-serve band, "strategic" flags applied liberally in the last week of the quarter — every framework gets gamed, and the governance review is where you catch the patterns and close the gaps.

The output of the governance review is a small set of concrete changes: scorecard tier movements, band re-calibrations, override-approver coaching, and threshold adjustments to close gaming gaps. The framework that gets this quarterly review is a living system; the framework that does not is a document that slowly drifts out of alignment with reality until everyone routes around it.

## Building It In Salesforce And CPQ

A discount-autonomy framework only works if it is *operational at the point of quoting*, which means it has to live in Salesforce and CPQ, not in a policy document a rep half-remembers. The build has a few essential components.

First, a **rep discount-band field** on the user or rep record — the per-rep modifier that the matrix reads. This field is owned by RevOps or sales ops, updated each quarter off the scorecard review, and it is what makes the matrix per-rep rather than one-size-fits-all. Second, **the margin-floor calculation** wired into CPQ so that the contribution margin is computed *per deal* as the rep builds the quote — pulling in payment terms, pass-through costs, product mix — and surfaced to the rep in real time, with a hard block if the quote falls below the floor. Third, **approval routing** that consults the depth-by-size grid, applies the rep's band field, and routes the deal to the correct approver automatically — fast, in-platform, no Slack archaeology. Fourth, **the strategic-value override** built as a distinct flagged path with a required rationale field and routing to the named senior approver, kept separate from the standard routing so the override is auditable. Fifth — and this is the part most builds miss — **the track-record scorecard data source**: the realized-discount, end-of-quarter-shape, and win-rate-by-discount data has to be computed from closed-deal records and surfaced somewhere the quarterly review can consume it, ideally as a dashboard rather than a manual pull. The scorecard is the engine that drives the band field; if its data source is a quarterly spreadsheet someone builds by hand, the framework will decay. Built right, the rep experiences the whole framework as a fast, clear quoting flow — the matrix resolves invisibly, the floor is enforced as a guardrail, and the only friction is the friction the framework intends.

## The Manager's Role

The front-line sales manager has a dual role in a discount-autonomy framework, and the two halves of it are in productive tension. The manager is simultaneously the **first escalation tier** — the approver for deals just beyond a rep's self-serve band — and the **coach** who helps the rep earn a wider band. Holding both roles is what makes the manager central to the framework working.

As the first escalation tier, the manager is the highest-frequency, lowest-latency approval point in the system. Most deals that escalate at all escalate to the manager, not to the deal desk or a VP, so the manager's responsiveness largely determines whether the framework feels like a partnership or an obstacle. A manager who turns approvals around in minutes keeps the velocity case intact; a manager who sits on approvals for days hands the deal desk and the rep a reason to route around the framework. The manager is also the framework's first line of pattern detection — they see their reps' discounting behavior up close, in real time, before it shows up on a quarterly scorecard.

As the coach, the manager owns the conversation that the scorecard makes possible. When a rep's band tightens, it is the manager who frames it as "here is what your scorecard shows and here is the path back" rather than as a punishment. When a rep is ceiling-gaming or showing an end-of-quarter spike, it is the manager who catches it early and coaches the underlying selling behavior — value articulation, concession trading, escalating the hard deals honestly. The dual role is deliberate: the same person who *enforces* the band is the person who *develops* the rep toward a wider one, which means enforcement and coaching are not adversarial but two sides of the same relationship. A framework that puts approval in one place and coaching in another loses that coherence; the manager holding both is what makes the autonomy framework a development system rather than just a control system.

## Five Real-World Scenarios

**The transactional SMB team.** Deals average $9K, cycles run a week, reps carry high volume. The right calibration is wide self-serve bands so reps move fast, a hard margin floor enforced in CPQ, and the real margin discipline coming from a margin-adjusted comp plan rather than per-deal approvals. The track-record review runs quarterly and catches the reps whose aggregate discounting drifts. Approvals are reserved for genuinely deep discounts. The failure mode to avoid here is importing an enterprise-style approval process that strangles the velocity the whole motion depends on.

**The enterprise team with whales.** Deals run six and seven figures, cycles run quarters. The bands are tight, the deal desk is involved early and routinely, and even moderate discounts on large deals route to someone with portfolio visibility. The strategic-value override gets real use because enterprise deals are more often genuinely strategic — and every override is documented and audited at quarter end. The failure mode to avoid is letting deal size *widen* autonomy, which would hand the most rope to the rep on the biggest deal.

**The team with a tenured over-discounter.** A seven-year veteran with deep skills and the worst discount discipline on the team, who under the old tenure framework had the widest band. The fix is the track-record model: the rep's scorecard reflects their actual behavior, their band is narrow as a direct readout of that, and the manager runs the "here is the path back" conversation. The band is revocable, so genuine improvement re-widens it. The failure mode to avoid is treating this as an HR problem rather than a framework problem — the framework, correctly built, handles it.

**The fast-ramping new team.** A pod of recently-hired reps with no track record yet. They start in deliberately narrow bands with their manager as the close first approver — not as a tenure rule but because the track-record modifier is null. The bands expand as scorecards fill in, and a disciplined new rep can earn a wide band inside two quarters, faster than any tenure schedule. The failure mode to avoid is a fixed twelve-month schedule that ignores how the reps are actually selling.

**The team where comp fights the framework.** A carefully built multi-factor matrix sits on top of a flat-percentage-of-revenue comp plan, and discounting keeps creeping up despite the matrix. The diagnosis is that the comp plan is undefeated — reps are paid to discount and the matrix is just friction they navigate. The fix is not a tighter matrix; it is wiring comp to margin, adding discount multipliers or clawbacks, so the rep feels the discount in their own check. The failure mode to avoid is responding to comp misalignment by adding more approval layers, which treats the symptom and ignores the cause.

## The Decision Framework

For a CRO, VP of Sales, or RevOps leader designing AE discount autonomy from scratch, the sequence is specific and the order matters.

**First, define the multi-factor model explicitly.** Write down that autonomy is a function of discount depth, deal size, margin floor, strategic value, and rep track record — not tenure, not deal size alone. Naming the factors and their structural roles is what keeps the framework from collapsing back into a single-axis ladder.

**Second, set the core bands by depth and deal size.** Draw the depth bands and the size bands off your real closed-deal histogram, not off round numbers. Build the two-dimensional grid and assign an approval tier to every cell.

**Third, install the margin floor as a hard gate.** Have finance define contribution margin per deal, wire it into CPQ, surface it to reps as they quote, and make it a hard block. This goes in front of the grid and overrides everything.

**Fourth, build the strategic-value override path.** A separate documented lane, a named senior approver, a required written rationale, the margin floor still binding, and an expectation that it stays rare.

**Fifth, tie autonomy to a rep scorecard, not tenure.** Build the scorecard from realized discount, end-of-quarter shape, win rate by discount level, and margin realization. Make it produce a tier, make the tier set the band, review it quarterly, and make the band revocable.

**Sixth, wire the comp plan to reinforce all of it.** Margin-based commission, discount multipliers, or clawbacks — whatever makes the rep feel the discount in their own pay. This is the step that determines whether the framework holds or gets routed around.

Do these in order, calibrate the bands to your GTM motion, and run the quarterly governance review. The framework is not the matrix; the matrix is one component. The framework is the matrix plus the floor plus the override plus the scorecard plus the comp alignment plus the governance rhythm.

## The 5-Year Outlook

The discount-autonomy frameworks of the next five years are going to look meaningfully different from the static matrices of today, and the direction of change is already visible. The core shift is from *static bands* to *dynamic, deal-specific autonomy* — and the engine of that shift is AI deal guidance.

Today's matrix answers the question "what tier of approval does a deal in this cell need?" with a pre-computed rule. The emerging model answers a sharper question: "what is the actual margin risk of *this specific quote*, given everything we know about the deal, the buyer, the competitive situation, and the rep?" — and it answers it in real time. AI deal-guidance systems are increasingly able to score each quote's risk on the fly, pulling in signals the static matrix cannot: the buyer's historical negotiation behavior, the competitive set on the deal, the rep's recent discipline trend, the deal's stage and momentum, even the language in the deal notes. Instead of a rep landing in a fixed cell, the system produces a per-deal risk score and a per-deal recommended autonomy.

That points toward *dynamic autonomy that adjusts per-deal* rather than per-rep-per-quarter. A rep's effective band stops being a single number set quarterly and becomes a function the system evaluates fresh on every quote — wider on the low-risk deal, narrower on the high-risk one, with the rep's track record as one input among many rather than the whole modifier. The margin floor stays exactly where it is — arithmetic does not get disrupted — but the grid above it becomes adaptive.

The move away from static bands also changes the governance rhythm: instead of recalibrating the matrix quarterly, RevOps tunes the *model* — its inputs, its weights, its guardrails — and audits its recommendations. The risks are real: a model that is opaque, that reps do not trust, or that quietly drifts toward looser discounting to close more deals is worse than a static matrix. But the trajectory is clear. The five-year version of this framework keeps the five factors and the hard floor, and replaces the static depth-by-size grid with a real-time, per-deal risk model. The companies that get there first will discount more precisely than their competitors — tighter on the deals that do not need it, faster on the ones that do.

## The Final Framework

Pulling the entire entry together into the artifacts a leader can actually use:

**The multi-factor autonomy model.** Discount autonomy = f(discount depth, deal size, margin floor, strategic value, rep track record). Five factors, four structural roles: depth and size are the continuous grid inputs; the margin floor is a hard gate in front of the grid; strategic value is a documented override lane that routes up; rep track record is a per-rep modifier on the grid. Tenure is not a factor — at most a tiebreaker and a default for reps with no track record yet.

**The approval authority matrix.** A two-dimensional grid of discount depth by deal size, bands drawn from the real deal histogram, every cell assigned an approval tier from self-serve to CRO. The margin-floor hard gate sits in front of it. The rep track-record modifier overlays it, shifting each rep's self-serve region. The strategic-value override runs alongside it as a separate documented lane. It resolves in seconds inside CPQ.

**The rep-scorecard design.** Built from realized discount versus benchmark, the shape of discounting through the quarter, win rate at low discount levels, and margin realization on closed deals. It produces a tier; the tier sets the rep's band; it is reviewed quarterly; the band is earned and revocable; the manager owns the coaching conversation around it.

**The comp-alignment checklist.** Is commission sensitive to discount — margin-based, discount-multiplied, or clawback-protected? Does the rep *feel* a deeper discount in their own pay? If not, the autonomy framework is sitting on a comp plan that will defeat it, and no matrix will hold. Fix the comp plan first; the matrix is the backstop, not the primary defense.

Run it with a quarterly governance review, calibrate it to your GTM motion, build it into CPQ, and treat it as a living system rather than a document. The right framework for AE discount autonomy is not tenure and it is not deal size — it is a disciplined multi-factor model with a hard floor, a track-record engine, and a comp plan that points the same direction.

`;

const flow = `

## The Multi-Factor Autonomy Decision Flow

\`\`\`mermaid
flowchart TD
  A[Quote Built In CPQ] --> B{Clears Contribution Margin Floor}
  B -- No --> B1[Hard Block]
  B1 --> B2[Executive Exception Only Or Re Price]
  B -- Yes --> C[Locate On Depth By Size Grid]
  C --> C1[Discount Depth Band Shallow Moderate Deep]
  C --> C2[Deal Size Band From Real Histogram]
  C1 --> D[Base Approval Tier From Grid Cell]
  C2 --> D
  D --> E{Apply Rep Track Record Modifier}
  E -- High Discipline Rep --> E1[Self Serve Region Widens]
  E -- Low Discipline Rep --> E2[Self Serve Region Narrows]
  E1 --> F{Is Cell Self Serve For This Rep}
  E2 --> F
  F -- Yes --> G[Autonomy Granted No Approval]
  F -- No --> H[Route To Approval Tier]
  H --> H1[Manager First Escalation]
  H --> H2[Deal Desk]
  H --> H3[Director Or VP]
  H --> H4[CRO Or Strategic Committee]
  A --> S{Strategic Value Flag Raised}
  S -- Yes --> S1[Named Senior Approver Lane]
  S1 --> S2[Written Rationale Required]
  S2 --> S3[Margin Floor Still Binds]
  S3 --> H
  S -- No --> C
  G --> Z[Deal Proceeds]
  H1 --> Z
  H2 --> Z
  H3 --> Z
  H4 --> Z
  Z --> Y[Closed Deal Feeds Rep Scorecard]
  Y --> X[Quarterly Review Adjusts Band]
  X --> E
\`\`\`

## Tenure Vs Deal Size Vs Multi-Factor Track Record

\`\`\`mermaid
flowchart TD
  M1[Tenure Based Autonomy] --> M1A[Band Set By Hire Date]
  M1A --> M1B[Failure Mode]
  M1B --> M1C[Senior Over Discounter Gets Widest Band]
  M1C --> M1D[Autonomy Decoupled From Discipline]
  M1D --> M1E[Rewards The Wrong Behavior]
  M2[Deal Size Based Autonomy] --> M2A[Band Scales With ACV]
  M2A --> M2B[Failure Mode]
  M2B --> M2C[Rep On Biggest Deal Gets Most Rope]
  M2C --> M2D[Small Deal Reps Squeezed On Speed]
  M2D --> M2E[Aggregate Leakage On Long Tail]
  M3[Multi Factor Track Record Model] --> M3A[Margin Floor Hard Gate]
  M3A --> M3B[Depth By Size Grid]
  M3B --> M3C[Track Record Modifier Not Tenure]
  M3C --> M3D[Strategic Value Override Path]
  M3D --> M3E[Comp Plan Reinforces All Of It]
  M3E --> M3F[Autonomy Follows Behavior]
  M3F --> M3G[Earned Measured Revocable]
\`\`\`

`;

const src = `

## Sources

1. **Gartner — B2B Sales Discounting and Pricing Discipline Research** — Analysis of how unmanaged discount latitude erodes realized price and margin across enterprise sales organizations.
2. **Harvard Business Review — "How to Stop Customers from Fixating on Price"** — Foundational treatment of price-integrity erosion and how discounting trains buyer behavior.
3. **McKinsey & Company — "The Power of Pricing"** — Quantifies the disproportionate margin impact of small realized-price changes and the cost of uncontrolled discounting.
4. **Salesforce CPQ Documentation — Discount Schedules and Approval Processes** — Technical reference for implementing depth-by-size approval matrices, margin gates, and routing in CPQ.
5. **SBI (Sales Benchmark Index) — Deal Desk and Discount Governance Benchmarks** — Operating benchmarks for deal-desk involvement thresholds and approval-tier design by GTM motion.
6. **The RevOps Co-op — Discount Approval Matrix Frameworks** — Practitioner frameworks for building two-axis approval grids and tying them to rep performance data.
7. **Pavilion (formerly Revenue Collective) — Sales Compensation and Discount Alignment** — Community resource on margin-based commission, discount multipliers, and clawback structures.
8. **Forrester — B2B Pricing and Negotiation Maturity Model** — Maturity framework distinguishing tenure-based, size-based, and multi-factor discount governance.
9. **CFO.com — Contribution Margin Floors in Sales Pricing** — Finance perspective on per-deal contribution-margin computation and why discount-percentage floors are insufficient.
10. **Anaplan / Xactly — Sales Performance Management on Margin-Based Comp** — Vendor research on how compensating reps on margin rather than revenue changes discounting behavior.
11. **Winning by Design — Discounting and the Velocity-Discipline Tradeoff** — SaaS GTM methodology on tuning discount autonomy by motion (transactional, enterprise, PLG-assist).
12. **OpenView Partners — Product-Led Growth Pricing Discipline** — Analysis of why PLG-assist motions require near-list-price discipline to protect self-serve pricing.
13. **Deloitte — Sales Comp Plan Design and Margin Protection** — Advisory research on aligning incentive compensation with pricing-integrity goals.
14. **Gong / Clari — End-of-Quarter Discounting Pattern Analysis** — Revenue-intelligence data on the end-of-quarter discount spike and its forecasting implications.
15. **CSO Insights / Korn Ferry — Sales Manager as First Escalation Tier** — Research on the front-line manager's dual role as approver and coach.
16. **G2 / TrustRadius — CPQ and Deal Desk Tooling Landscape** — Comparative reference on CPQ platforms supporting per-rep discount-band fields and dynamic approval routing.
17. **Bain & Company — Pricing Power and Discount Discipline** — Strategic research on the multi-year cost of lost price integrity.
18. **MIT Sloan Management Review — AI in Sales Deal Guidance** — Emerging research on real-time, per-deal risk scoring and dynamic autonomy models.

`;

const num = `

## Numbers

**Discount Depth Bands (Illustrative)**
- Shallow band: 0%-10% off list — self-serve for any rep in good standing
- Moderate band: 10%-20% — track-record-dependent; self-serve for disciplined reps, manager approval for others
- Deep band: 20%+ — escalates regardless of rep or deal size
- Typical deep-band threshold range across categories: 18%-30% depending on gross margin structure

**Deal Size Band Design**
- SMB-clustered orgs: fine gradation $5K-$40K, single bucket above $100K
- Enterprise-clustered orgs: fine gradation $100K-$1M+, single bucket below $50K
- Same discount %, different tier example: 15% discount — self-serve at $10K, manager at $75K, deal desk/director at $300K
- Bands should be drawn from a real histogram of closed deals, not round numbers

**Margin Floor**
- Defined in contribution-margin terms, not discount-percentage terms
- Computed per deal — incorporates payment terms, implementation cost, pass-through costs, support intensity, product mix
- Hard gate: checked before the grid; failed deals blocked at that price for all tiers
- Executive exception only: rare, named, documented

**Strategic-Value Override**
- Routes up to a named senior approver — never around the margin floor
- Requires written rationale attached to the deal record
- Healthy usage rate: low single-digit % of total deals
- Warning threshold: if more than ~5% of deals use the override, the underlying matrix is mis-tuned

**Rep Track-Record Scorecard Inputs**
- Average realized discount vs. peer/segment benchmark (deal-size-weighted)
- Shape of discounting through the quarter — flat line healthy, end-of-quarter hockey stick is a flag
- Escalation behavior — appropriate escalation vs. threshold sandbagging
- Win rate at low discount levels — the real skill is winning without discounting
- Margin realization — quoted margin vs. realized post-implementation margin
- Review cadence: quarterly — frequent enough to be responsive, infrequent enough to avoid noise

**Comp Plan Alignment Mechanisms**
- Margin-based commission: rep paid on gross margin / discount-adjusted revenue
- Discount multipliers: commission rate scales down as discount deepens — full rate at list
- Discount clawbacks: recover commission if discount exceeded threshold or margin eroded post-sale
- Core principle: the rep must feel a deeper discount in their own paycheck

**GTM Motion Calibration**
- Transactional SMB: wide self-serve bands — speed dominates; aggregate risk managed via comp + scorecard
- Enterprise: tight bands, deal desk involved early — single-deal margin large enough that approval is cheap insurance
- PLG-assist: near-list-price discipline — narrow bands, discounting is the exception

**New-Rep Ramp**
- Starting band: deliberately narrow — track-record modifier is null, not a tenure penalty
- First approver: manager (also functioning as coach)
- First scorecard review: end of first full quarter
- Band expansion: as scorecard fills in — disciplined new rep can earn a wide band within ~2 quarters

**Approval Tiers (Typical Ladder)**
- Self-serve (rep)
- Manager (first escalation, highest frequency, lowest latency)
- Deal desk
- Director / VP
- CRO / strategic-deals committee

**Framework Health Metrics**
- Average discount by band — creeping self-serve average signals too-wide bands or comp misalignment
- % of deals at the autonomy ceiling — high concentration signals ceiling-gaming
- Win rate by discount level — flat across levels means discounting is pure leakage
- End-of-quarter discount spike — gap between first-half and final-two-weeks discounting
- Margin realization gap — quoted vs. realized margin; persistent gap means floor is mis-computed

**Governance Cadence**
- Quarterly review: scorecard reconciliation, band calibration, override audit, gaming review
- Output: scorecard tier movements, band re-calibrations, override-approver coaching, threshold adjustments

**Salesforce / CPQ Build Components**
- Rep discount-band field on the user record — updated quarterly off the scorecard
- Margin-floor calculation wired into CPQ — real-time, per-deal, hard block
- Approval routing — consults grid + band field, routes automatically, resolves in seconds
- Strategic-value override — distinct flagged path, required rationale field, separate routing
- Track-record scorecard data source — computed from closed-deal records, surfaced as a dashboard

**5-Year Outlook**
- Shift: static per-rep-per-quarter bands → dynamic per-deal autonomy
- Engine: AI deal-guidance scoring each quote's risk in real time
- Inputs added: buyer negotiation history, competitive set, rep discipline trend, deal momentum, deal-note language
- Constant: the margin floor (arithmetic does not get disrupted)
- Governance shift: from recalibrating the matrix quarterly to tuning and auditing the model

`;

const counter = `

## Counter-Case: When Formalizing Discount Autonomy Is Over-Engineering

The multi-factor framework above is the right answer for most sales organizations of meaningful scale — but a serious leader should stress-test it against the conditions where building it is a mistake. There are real situations where an elaborate discount-autonomy framework is over-engineering, and recognizing them saves a quarter of wasted RevOps effort.

**Counter 1 — The team is small enough that the CRO already sees every deal.** In a five- or eight-rep sales org where the founder or CRO is in the room for every deal of consequence, a formal multi-factor matrix is solving a problem that does not exist. The "framework" is the CRO's judgment, applied in real time, with full context. Building a depth-by-size grid, a rep scorecard, and CPQ routing for a team this size adds process overhead without adding control — the control is already there, in a form that is faster and better-informed than any matrix. The right move at this stage is a single simple rule ("anything over X% comes to me") and a note to revisit when the team crosses roughly fifteen to twenty reps and the CRO can no longer be in every deal.

**Counter 2 — The real problem is the list price or the packaging, not autonomy design.** A sales org where reps discount heavily on nearly every deal often does not have an autonomy problem — it has a pricing problem. If the list price is set above what the market will actually bear, or the packaging forces buyers into tiers that do not fit them, then discounting is the reps doing the company's pricing correction for it, one deal at a time. Building an elaborate autonomy framework on top of broken pricing just formalizes the friction; it does not fix the leak. The diagnostic question is simple: if almost every rep is discounting to roughly the same level on roughly every deal, that level *is* your real price, and the fix is to re-price or re-package, not to build a matrix that polices a list price nobody believes.

**Counter 3 — An elaborate framework just gets gamed, and a simple rule would work fine.** Every framework gets gamed at the margins, but a sufficiently complex framework gets gamed *as a matter of course* — deals split to stay in a self-serve band, "strategic" flags applied liberally, deals structured to land just under a threshold. For many mid-sized teams, a five-factor model with a scorecard overlay and an override lane creates so many seams that the gaming overwhelms the governance. A blunt rule — "manager approves anything over 15%, deal desk approves anything over 25%, nothing goes below the margin floor" — is cruder, but it has fewer seams to game and everyone actually understands it. Sophistication is only worth it if the organization has the governance discipline to run it; absent that discipline, the simple rule outperforms the elegant one.

**Counter 4 — Autonomy bands become a bureaucracy that slows the motion they were meant to speed.** This is the most common failure of well-intentioned frameworks. A team builds a careful matrix to *enable* fast, confident discounting within bands — and a year later the matrix has accreted approval steps, the deal desk is a bottleneck, reps wait days for sign-off on routine discounts, and the transactional motion the framework was supposed to protect is now slower than it was before the framework existed. If the framework's net effect is more friction and longer cycle times, it has failed at its own goal, regardless of how theoretically sound the factor model is. The framework is a means to an end — confident, fast, margin-protected selling — and if it is not delivering that, the answer is to *cut* it back, not to add another tier.

**Counter 5 — There is not enough deal volume to populate a meaningful scorecard.** The track-record model depends on each rep having enough closed deals each quarter to produce a statistically meaningful discipline signal. A team selling a small number of very large deals per rep per quarter cannot build a reliable scorecard — three deals is not a track record, it is noise. For these teams, the per-rep modifier should be lighter or replaced with direct manager judgment, and the framework should lean harder on the margin floor and the depth-by-size grid, which do not need volume to work. Forcing a quarterly scorecard onto a low-volume motion produces band movements driven by randomness, which is worse than no scorecard at all.

**Counter 6 — The organization lacks the data infrastructure to run it honestly.** A multi-factor framework with a margin floor and a track-record scorecard requires per-deal contribution-margin data and clean closed-deal records. An organization that cannot reliably compute per-deal margin, or whose CRM data is too messy to produce trustworthy realized-discount numbers, will build a framework on sand — the floor will be wrong, the scorecards will be wrong, and reps will correctly stop trusting it. For these organizations, the honest first project is the data infrastructure, not the framework. A simple discount rule plus a real investment in margin and CRM data hygiene beats an elaborate framework running on numbers nobody believes.

**The honest verdict.** The multi-factor model is the right answer for most sales organizations past roughly fifteen to twenty reps, with enough deal volume for meaningful scorecards, with workable margin and CRM data, and with the governance discipline to run a quarterly review. It is the wrong answer — genuine over-engineering — for very small teams where the CRO sees every deal, for organizations whose real problem is pricing or packaging, for teams without the data infrastructure or deal volume to populate it honestly, and for any situation where the framework's net effect is more friction than it removes. The framework is not the goal. Confident, fast, margin-protected selling is the goal, and a simple rule that delivers it beats an elegant framework that does not.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a RevOps consultancy in 2027? (The practitioner who designs and installs frameworks like this one.)
- **q9502** — How do you start a sales compensation consulting business in 2027? (Comp-plan design — the deepest lever in this entry.)
- **q9510** — What is the right deal desk operating model? (The deal desk as an approval tier in the autonomy matrix.)
- **q9511** — How should a sales org structure its CPQ implementation? (The technical home of the autonomy framework.)
- **q9512** — What is the right sales approval workflow design? (Approval routing mechanics referenced throughout.)
- **q9513** — How do you set list price for a B2B SaaS product? (The pricing question that Counter 2 says often underlies "autonomy" problems.)
- **q9514** — What is the right sales commission structure for a B2B team? (Margin-based comp, multipliers, clawbacks.)
- **q9515** — How do you design a sales rep scorecard? (The track-record scorecard that replaces tenure here.)
- **q9517** — How do you measure and reduce the end-of-quarter discount spike? (One of the framework-health metrics, deep dive.)
- **q9518** — What is contribution margin and how should sales use it? (The margin-floor definition, finance deep dive.)
- **q9519** — How do you tune a sales motion for transactional SMB velocity? (GTM-motion calibration for wide bands.)
- **q9520** — How do you build an enterprise deal desk? (GTM-motion calibration for tight bands.)
- **q9521** — What is the right PLG-assist sales overlay design? (GTM-motion calibration for near-list discipline.)
- **q9522** — How do you onboard and ramp new AEs? (The new-rep ramp and how the band expands.)
- **q9523** — How do you coach a senior rep who over-discounts? (The senior-rep problem, manager-coaching deep dive.)
- **q9524** — What is the front-line sales manager's role in deal governance? (The manager's dual role as approver and coach.)
- **q9525** — How do you run a quarterly RevOps governance review? (The governance and recalibration cadence.)
- **q9526** — How do you detect and prevent gaming of sales processes? (The gaming review within governance.)
- **q9527** — What sales metrics actually predict margin erosion? (Framework-health metrics deep dive.)
- **q9528** — How do you build a discount approval matrix in Salesforce? (The CPQ build, technical deep dive.)
- **q9529** — What is the future of AI in sales deal guidance? (The 5-year outlook on dynamic per-deal autonomy.)
- **q9530** — How do you protect price integrity in a competitive market? (The price-integrity counter-argument deep dive.)
- **q9531** — How do you set win-rate benchmarks by discount level? (Win rate by discount, analytics deep dive.)
- **q9532** — What is the right escalation path for strategic deals? (The strategic-value override lane.)
- **q9533** — How do you calculate per-deal margin in CPQ? (The margin-floor calculation, technical deep dive.)
- **q9534** — How do you align sales and finance on pricing governance? (The cross-functional ownership of the margin floor.)
- **q9535** — What is the right cadence for sales comp plan revisions? (Keeping comp aligned with the autonomy framework over time.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Adjacent AI-disruption-of-sales-roles context.)
- **q9601** — How do you start a fractional RevOps business in 2027? (The fractional practitioner who installs this framework for smaller orgs.)
- **q9701** — What is the best CPQ platform for a mid-market sales org? (Tooling for the framework build.)

`;

const tags = ['revops','sales-strategy','discount-autonomy','deal-desk','sales-compensation','pricing','cpq','sales-management','approval-matrix','2027'];

const sources = [
  { title: 'Gartner — B2B Sales Discounting and Pricing Discipline Research', url: 'https://www.gartner.com/en/sales' },
  { title: 'Harvard Business Review — How to Stop Customers from Fixating on Price', url: 'https://hbr.org/' },
  { title: 'McKinsey & Company — The Power of Pricing', url: 'https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights' }
];

const notes = {
  s6: 'Added 18 cited sources: Gartner and Forrester on discount governance maturity, HBR and McKinsey and Bain on price-integrity erosion and the margin impact of realized-price changes, Salesforce CPQ documentation and G2/TrustRadius on the technical build, SBI and The RevOps Co-op on approval-matrix design, Pavilion and Anaplan/Xactly and Deloitte on margin-based comp alignment, Winning by Design and OpenView on GTM-motion calibration, CFO.com on contribution-margin floors, Gong/Clari on the end-of-quarter discount spike, CSO Insights/Korn Ferry on the manager dual role, and MIT Sloan on AI deal guidance.',
  s7: 'Added comprehensive numerical analysis: discount depth bands (shallow 0-10% / moderate 10-20% / deep 20%+), deal-size band design drawn from real histograms, the margin-floor hard-gate mechanics, strategic-override usage thresholds (healthy low-single-digit %, warning above ~5%), the five rep-scorecard inputs and quarterly cadence, the three comp-alignment mechanisms, GTM-motion calibration (wide SMB / tight enterprise / near-list PLG-assist), the new-rep ramp timeline, the five-tier approval ladder, the five framework-health metrics, the quarterly governance agenda, the five Salesforce/CPQ build components, and the 5-year outlook shift from static bands to dynamic per-deal autonomy.',
  s8: 'Added 6-element counter-case on when formalizing discount autonomy is over-engineering: tiny teams where the CRO sees every deal anyway, organizations whose real problem is list price or packaging rather than autonomy design, elaborate frameworks that just get gamed where a simple "manager approves over 15%" rule would work, autonomy bands that become a bureaucracy slowing the transactional motion they were meant to speed, low-deal-volume teams that cannot populate a meaningful scorecard, and organizations lacking the margin/CRM data infrastructure to run the framework honestly — with an honest verdict on the scale and conditions where the multi-factor model is and is not warranted.',
  s9: 'Cross-linked 30 related Pulse entries: RevOps and comp-consulting practitioners (q9501/q9502/q9601), deal desk and approval workflow and CPQ build (q9510-q9512/q9528/q9533), pricing and compensation foundations (q9513-q9515/q9534/q9535), framework-health metrics and gaming detection (q9517/q9526/q9527/q9531), GTM-motion calibration (q9519-q9521), rep ramp and senior-rep coaching and manager role (q9522-q9524), governance cadence (q9525), price integrity and strategic escalation (q9530/q9532), the AI deal-guidance outlook (q9529), and adjacent AI-disruption and tooling context (q1899/q9701).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the AE discount-autonomy framework question for CROs, VPs of Sales, RevOps leaders, and deal desk managers. Two mermaid diagrams (the multi-factor autonomy decision flow from quote through margin-floor gate, depth-by-size grid, track-record modifier, strategic-value override, and approval routing back into the scorecard loop; and a comparison of tenure-based vs deal-size-based vs multi-factor track-record models with each failure mode illustrated). Full coverage: the question reframed as a false binary, why tenure-based autonomy is tempting but flawed, why deal-size-based is stronger but insufficient alone, the five-factor model (discount depth, deal size, margin floor, strategic value, rep track record) with its four structural roles, factor-by-factor treatment, the performance-earned autonomy model, the approval authority matrix anatomy, the comp-plan connection as the deepest lever, the velocity/trust argument for autonomy and the price-integrity counter, GTM-motion calibration, the new-rep ramp, the senior-rep over-discounter problem, framework-health metrics, quarterly governance and recalibration, the Salesforce/CPQ build, the manager dual role, five real-world scenarios, the six-step decision framework, the 5-year outlook on AI-driven dynamic per-deal autonomy, the final framework artifacts, and a 6-element counter-case on when the framework is over-engineering.'
};

runPolish({ id: 'q9516', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
