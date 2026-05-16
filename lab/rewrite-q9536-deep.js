// q9536 — What's the relationship between a founder's go-to-market motion (PLG, sales-led, or hybrid) and the discount-governance structure they need?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Discount governance is **not one-size-fits-all** — the right structure is *derived from* the go-to-market motion, and applying the wrong one is one of the most common and most expensive RevOps mistakes a founder makes. **Pure PLG / self-serve:** the answer is usually "almost no discounting at all." Published pricing *is* the governance; the entire discount-governance job is **protecting price integrity** and resisting the slow slide into sales-led discounting. The only "discount" is the annual-vs-monthly incentive. Do **not** build a deal desk, an authority matrix, or CPQ approval chains — that is over-build, bureaucracy with no purpose. **Sales-led:** discounting is *intrinsic* — every deal is negotiated — so you need the **full apparatus**: a margin floor, a tiered discount-authority matrix (rep → manager → VP → CRO/CEO), a deal desk, CPQ approval rules, discount bands by deal size and depth, a strategic-exception lane, and a quarterly governance review. This is where the heavy machinery belongs, and a founder running sales-led who skips it gets **discount drift and margin erosion**. **Hybrid (PLG acquisition + sales-led expansion/enterprise):** the hardest case — you need **two governance regimes coexisting and fenced apart** so the sales-led discounting doesn't contaminate the PLG published-price anchor. Calibrate further within sales-led: **transactional** sales-led needs lighter, faster governance with wide rep autonomy; **enterprise** sales-led needs deeper governance with the deal desk central. The fit diagnostic: a PLG company with a big deal desk is **over-built**; a sales-led company with discounts approved in a Slack channel is **under-built**. The decision sequence is non-negotiable — **first clarify the motion, then derive the governance from it.** Never build discount governance in the abstract. And evolve the governance *with* the motion: PLG companies add sales-led, sales-led companies add self-serve tiers, and the governance must move when the motion moves, not lag two years behind it.`;

const core = `

## The Core Thesis: Governance Is Derived, Not Designed In A Vacuum

The single most important idea in this entire entry is this: **a discount-governance structure is not a thing you design from first principles and then bolt onto your business. It is a thing you *derive* from your go-to-market motion.** The motion is the independent variable. The governance is the dependent variable. Founders who get this backwards — who read a RevOps blog post, decide they need a "deal desk" and an "approval matrix," and then build that machinery regardless of how they actually sell — are committing one of the most common and most expensive mistakes in early-stage and growth-stage revenue operations.

Here is why the relationship is so tight. Discounting is fundamentally a *symptom of how price is set and communicated to a buyer*. In a pure product-led-growth (PLG) motion, price is published, transparent, and the buyer self-selects into it — so there is structurally very little surface area for discounting at all, and the governance job is almost entirely about *preventing* discounting from emerging. In a sales-led motion, price is negotiated in every single deal — discounting is not an exception, it is the *mechanism* — so the governance job is to build a complete apparatus that channels, bounds, and audits that negotiation. In a hybrid motion, both dynamics are happening at once inside the same company, so you need two governance regimes coexisting without contaminating each other. The motion *creates* the discounting reality. The governance *responds* to that reality. You cannot get the governance right if you have not first been honest about the motion.

The expensive failure modes are symmetrical. **Over-build:** a PLG company hires a VP of Sales from an enterprise background who imports a 5-tier authority matrix, a deal desk, and CPQ approval workflows — for a business that sells $40/seat/month subscriptions off a pricing page. The result is bureaucracy with zero purpose, slowed velocity, and a sales-led cost structure grafted onto a PLG revenue model. **Under-build:** a founder-led company that organically grew a sales motion — bigger deals, longer cycles, real negotiation — but never built any governance because "we're a product company" and discounting "feels gross." The result is discount drift: every rep negotiates their own way, margin erodes quarter over quarter, and nobody can answer the question "what is our average discount and is it getting worse?"

Both failures come from the *same root cause*: treating discount governance as a generic best practice rather than as a structure derived from the specific motion. The thesis of this entry, stated as a rule a founder can act on: **identify your motion first, with brutal honesty about what it actually is today; then derive the discount-governance structure from it; and never, ever build governance in the abstract.**

## The Three Motions Defined — And How Each Relates To Discounting

To derive governance from motion, you first need crisp definitions of the three motions and, crucially, an understanding of *how each one structurally relates to discounting*. These are not just go-to-market labels — each implies a completely different discounting reality.

**Product-Led Growth (PLG) / self-serve.** The product sells itself. A prospect discovers the product, signs up (often for a free tier or free trial), experiences value, and converts to paid — frequently with no human in the loop, or with a low-touch "product specialist" rather than a quota-carrying rep. Pricing is *published*: it lives on a pricing page, it is the same for everyone, and the buyer self-selects a tier. Cycles are short — minutes to weeks. Examples in spirit: Slack's original motion, early Notion, Calendly, most developer tools. **Relationship to discounting:** structurally, there is almost *nothing to discount*. The price is published and the same for everyone; that uniformity is the whole point. The only thing that even looks like a discount is the standard annual-vs-monthly incentive (pay yearly, save ~15-20%), and that is not really a "discount" in the governance sense — it is a published, universal pricing structure. PLG's relationship to discounting is fundamentally one of *resistance*: discounting is a threat to the model, not a tool within it.

**Sales-led.** Quota-carrying reps drive deals. A prospect is sourced (inbound or outbound), qualified, worked through a multi-stage pipeline, and closed via a negotiated contract. Pricing is *negotiated* — there may be a "list price," but the list price is an opening position, and the actual price is the outcome of a negotiation that involves discount, term length, payment terms, scope, ramp, and bundling. Cycles are long — weeks to many months. Examples in spirit: traditional enterprise SaaS, most six-figure-ACV businesses. **Relationship to discounting:** discounting is *intrinsic and structural*. It is not an exception to the model; it is a core mechanism *of* the model. Every deal is negotiated, which means every deal has a discount question. The governance job here is not to prevent discounting — that is impossible and undesirable — it is to *channel, bound, and audit* it.

**Hybrid.** PLG acquisition feeds a sales-led expansion and enterprise motion. Prospects self-serve in at the bottom — free tier, low-cost published plans — and a subset of accounts that show expansion signals (seat growth, usage, multiple teams, security/compliance needs) are routed to a sales team that runs a negotiated motion for the upmarket deal. The company runs *both motions simultaneously*, often on the same product. Examples in spirit: modern Slack, Notion, Figma, HubSpot, Airtable, Datadog. **Relationship to discounting:** the company has *two* discounting realities at once. The PLG bottom is near-zero-discount with published pricing; the sales-led top is full-negotiation. The governance challenge is keeping these two realities *separate* — fenced — so the sales-led discounting behavior does not leak into and erode the PLG published-price integrity, and so the PLG low entry price does not become the anchor every sales-led buyer negotiates down from.

The critical takeaway: these three motions do not differ a little in their discounting needs. They differ *fundamentally and structurally*. PLG resists discounting; sales-led runs on discounting; hybrid juggles both. Any governance design has to start from which of these realities the company is actually in.

## PLG Discount Governance — The Philosophy

In a pure PLG motion, the correct discount-governance philosophy surprises founders who come from a sales-led background: **the answer is often "almost no discounting at all," and the governance structure is mostly about *not building* a discounting apparatus you do not need.**

Here is the philosophical core. In PLG, **published pricing *is* the governance.** The pricing page is the deal desk. The published tiers are the authority matrix. The fact that everyone pays the same posted price is itself the control — there is no negotiation to govern because there is no negotiation. A founder running pure PLG who asks "what discount-governance structure do I need?" is, in a sense, asking the wrong question. The better question is "how do I protect the integrity of my published pricing, and how do I resist the gravitational pull toward becoming a sales-led discounter?"

This reframes the entire job. In sales-led, discount governance is a *construction* project — you build matrices, desks, workflows. In PLG, discount governance is a *defense* project — you defend the published-price model against erosion. The threats you are governing against are not "a rep gave away 40%." They are subtler: a big logo asks for a custom price and a founder, flattered, says yes; a sales hire is brought in and starts "just negotiating a few deals"; a quarter-end revenue gap tempts the team into a one-off promo that becomes permanent; an enterprise prospect demands a custom contract and the company, lacking any governance, simply caves.

The PLG governance philosophy, stated plainly: **your discount-governance structure should be deliberately minimal, and its primary function is to keep you from accidentally building the heavy machinery of a sales-led motion before you have actually decided to become a sales-led (or hybrid) company.** The discipline is in restraint. The most sophisticated thing a pure-PLG founder can do with discount governance is recognize that the right amount of apparatus is *almost none*, and to spend their governance energy on price-integrity defense rather than on approval-workflow construction. Over-building here is not "being careful" — it is actively importing a cost structure and a velocity drag that the model cannot support.

## PLG — What Governance Actually Means Here

If PLG governance is a defense project, what are you actually defending, and with what? The PLG discount-governance toolkit is small, and that smallness is the point. Here are the levers that actually matter.

**Published-pricing discipline.** The first and most important lever: a hard organizational commitment that the pricing page is the price. New tiers, price changes, and packaging adjustments go through a deliberate pricing review — not a sales negotiation. The "governance" is the discipline of saying, every time someone asks for a custom price, "our pricing is published; here is the page." This sounds trivial. It is not. It is the single hardest thing for a PLG company to maintain, because every exception feels small and reasonable in the moment.

**Annual-vs-monthly as the only "discount."** The one sanctioned price difference in a clean PLG motion is the annual prepay incentive — typically 15-20% off the monthly rate for paying yearly. This is governed not by an approval workflow but by being *built into the published pricing itself*. It is a structure, not a negotiation. The governance lever is: this is the only price variation that exists, it is published, and it applies to everyone equally.

**Promotional discipline.** PLG companies will occasionally run promotions — a launch discount, a Black Friday offer, a startup-program rate. The governance here is: promotions are *time-boxed*, *cohort-defined*, *published*, and *centrally decided* (by the founder or a pricing committee), never by an individual closing a specific deal. A promo is a published, universal, temporary price — not a one-off concession. The moment a "promotion" becomes "the discount we gave that one customer," PLG governance has failed.

**Resistance to one-off deals.** The hardest lever and the most important: a structural, cultural, and process-level resistance to bespoke deals. When a large prospect says "we'll sign for $200K but we need a custom contract and a custom price," the PLG-governed answer is either "here is our published Enterprise tier" or "we don't do custom — and that's a deliberate choice." Every one-off deal a pure-PLG company does is a small crack in the published-price model. Governance is the structure that makes saying no the default.

**The deliberate non-construction of apparatus.** The final and most counterintuitive lever: PLG governance means *consciously not building* the deal desk, the authority matrix, the CPQ approval chains. The governance decision is "we are not building that, because building it would change what we are." This is governance as restraint — and it requires a founder to actively resist the RevOps-blog instinct to build machinery. The right PLG discount-governance structure fits on one page: published pricing, the annual incentive, a promo policy, and a clear "we don't do custom" stance.

## PLG — The Slide-Into-Sales-Led Risk

The defining risk of PLG discount governance is not a discrete failure — it is a *slide*. It happens gradually, each step reasonable, until one day the company has a sales-led discounting reality with no sales-led governance, and a PLG governance philosophy that no longer matches what the business does.

The slide has a recognizable shape. It starts when a PLG company sees larger accounts self-serving in and thinks: "we should capture more of that value — let's get someone to *talk* to these big accounts." A "sales" hire is made — maybe titled "Account Executive," maybe "Growth," maybe "Strategic." That person, doing their job, starts *negotiating*. The first custom deal is done. It is a great logo, a big number, and the custom price feels worth it. Then the second. Then the rep, reasonably, asks "what's my discount authority?" — and the company realizes it has none, because PLG never needed one. So governance gets *bolted on reactively*: a quick approval rule, an ad-hoc Slack channel for deal approvals, a hastily drawn matrix. Now the company has a sales motion governed by improvised, reactive rules — the worst of both worlds.

Here is the crucial governance insight, and it is the whole point of this section: **the question is not "how do we add discount governance to our PLG company." The question is "are we still PLG, and if we are deliberately adding a sales motion, we need to recognize that and govern *that motion* separately and properly."** The slide is dangerous precisely because it is unacknowledged. Nobody decides "we are becoming hybrid." The company just drifts there, and the governance drifts behind it, always reactive, always improvised.

The disciplined response to the slide is *naming it*. The moment a PLG company makes its first deliberate sales hire and starts doing negotiated deals, leadership should explicitly say: "we are now a hybrid company. We have a PLG motion and a nascent sales-led motion. The PLG motion keeps its minimal published-price governance. The sales-led motion needs its own governance — a real one — built deliberately, not bolted on." That naming is the single highest-leverage governance act available to a sliding PLG company. It converts an unmanaged drift into a managed transition. Everything else in hybrid governance (covered below) depends on that act of naming having happened.

## Sales-Led Discount Governance — The Philosophy

Cross over into a sales-led motion and the governance philosophy inverts completely. In PLG, discounting is a threat to resist and governance is restraint. In sales-led, **discounting is intrinsic — it is the mechanism by which deals close — and governance is a full construction project.** This is where the heavy machinery belongs, and a founder running a sales-led motion who does not build it is not "keeping things lean." They are leaving the single largest controllable lever on enterprise gross margin completely ungoverned.

The philosophical core of sales-led governance: **every deal is negotiated, therefore every deal has a discount, therefore you need a system that bounds, channels, and audits discounting at scale — without grinding deal velocity to a halt.** The tension that sales-led governance must resolve is the tension between *control* and *speed*. Too little governance and you get drift, erosion, and a margin profile nobody can explain. Too much governance and every deal crawls through approvals, reps lose autonomy on deals they should own, and the cycle time balloons. The art of sales-led discount governance is calibrating the apparatus so that the *routine* discount is fast and rep-owned, and only the *exceptional* discount triggers escalation.

A few principles anchor the sales-led philosophy. First, **a margin floor exists and is sacred** — there is a discount level below which a deal does not happen without the highest level of approval, full stop, because below it the deal is value-destructive. Second, **authority is tiered, not flat** — small discounts are rep-owned, larger ones escalate, and the escalation ladder maps to who can see the strategic and financial picture at each level. Third, **governance is a system, not a vibe** — it lives in CPQ rules, in a deal desk function, in documented bands and policies, not in tribal knowledge or a manager's gut. Fourth, **discount discipline is cultural as well as structural** — the best sales-led organizations build a culture where reps see protecting price as part of their craft, not as the deal desk being the "sales prevention department."

The sales-led founder's mindset should be: discounting is a powerful, necessary tool, and like any powerful tool it needs a structure around it. Building that structure is not bureaucracy — for a sales-led motion it is core revenue infrastructure, as essential as a CRM. The mistake is not building governance; the mistake in sales-led is *under-building* it because discounting "feels gross" or because the founder mistakes the leanness appropriate to PLG for a universal virtue.

## Sales-Led — The Full Governance Stack

A sales-led motion at any meaningful scale needs a complete, deliberately constructed governance stack. Here is what the full apparatus looks like — the structure a sales-led founder must build.

**The margin floor.** The foundation. A defined discount level (or, better, a defined minimum gross margin or minimum effective price) below which deals require top-level approval and are presumed value-destructive until proven otherwise. The floor is derived from unit economics — CAC payback, gross margin targets, the cost to serve — not from competitive pressure. It is the bedrock the rest of the stack sits on.

**The tiered discount-authority matrix.** The core mechanism. A documented ladder that says: reps can approve up to X% on their own; X-Y% requires manager approval; Y-Z% requires VP/RevOps approval; above Z% (toward the floor) requires CRO or CEO approval; below the floor requires CEO/founder sign-off and is exceptional. The tiers map to who has the visibility and incentive to make a sound call at that level. The matrix is usually two-dimensional — discount depth *and* deal size — because a 15% discount on a $20K deal and a 15% discount on a $2M deal are different governance events.

**The deal desk.** The operational hub. A function (a person, a team, or at minimum a defined role) that reviews non-standard deals, runs the approval routing, models the deal economics, owns the CPQ configuration, advises reps on structure, and serves as the institutional memory of what has been approved and why. In an early sales-led company the deal desk might be a fractional responsibility of a RevOps person; at scale it is a dedicated team. Either way, the *function* must exist.

**CPQ approval rules.** The enforcement layer. The configure-price-quote system encodes the authority matrix into software: a quote that exceeds a rep's authority cannot be sent until it is approved by the right level; the routing is automatic; the audit trail is automatic. CPQ is what makes the matrix real rather than aspirational — without it, governance depends on people remembering and choosing to comply.

**Discount bands by deal size and depth.** The calibration detail. Standard, pre-approved discount ranges that map to deal characteristics — e.g., a defined band for deals under $50K, a different band for $50-250K, a different band for enterprise. Within band, the rep moves fast; outside band, escalation triggers. Bands are what let the *routine* discount be quick while the *exceptional* one gets scrutiny.

**The strategic-exception lane.** The pressure valve. A deliberate, fast path for the genuinely strategic deal — a marquee logo, a competitive displacement, a market-entry account — where a deep discount is a *strategic investment*, not a discipline failure. The lane requires senior sign-off and explicit rationale, but it is *fast* and it is *legitimate*. Without an exception lane, governance becomes brittle: every strategic deal becomes a fight, and reps learn to game the system rather than use it.

**The quarterly governance review.** The feedback loop. A recurring review — RevOps, finance, sales leadership — that looks at realized discount data: average discount by segment, discount trend over time, approval-tier distribution, exception frequency, margin by cohort. The review is where the governance structure gets *tuned* — bands adjusted, the matrix recalibrated, drift caught early. Governance without a feedback loop ossifies and decays.

Together these seven elements are the sales-led governance stack. A founder running sales-led needs all of them — in lightweight form early, in mature form at scale, but all of them. Skipping the stack is the under-build failure.

## Sales-Led — Calibrating Governance To Deal Profile

"Sales-led" is not one thing. Within sales-led, the *deal profile* tunes how heavy and how fast the governance apparatus should be. Two sub-archetypes matter, and conflating them is a common calibration error.

**Transactional sales-led.** Smaller deals (say, four-figure to low-five-figure ACV), faster cycles (days to weeks), higher deal volume per rep, often a velocity or SMB motion with a real sales team. Here the governance principle is **light and fast**: wide rep autonomy on discount, broad pre-approved bands, minimal escalation for routine deals, and a deal desk that is more "exception handler" than "every-deal reviewer." If transactional governance is too heavy, you destroy the velocity that makes the motion work — reps doing 30 deals a quarter cannot route each one through a three-tier approval chain. The governance is real, but it is calibrated to *speed*: the matrix has high rep-authority thresholds, the bands are wide, and the deal desk only sees the genuine outliers.

**Enterprise sales-led.** Large deals (six and seven figures), long cycles (many months), low deal volume per rep, complex multi-stakeholder negotiations, custom terms. Here the governance principle is **deep and central**: the deal desk is involved early and substantively on most deals, the authority matrix has lower thresholds (because every deal is big enough to matter), the bands are narrower and more scrutinized, deal structuring (ramps, multi-year, payment terms) is a core deal-desk service, and senior leadership is routinely in the loop. The governance overhead per deal is high — but each deal is large enough that the overhead is justified, and the downside of an ungoverned seven-figure discount is enormous.

The calibration error is applying one sub-archetype's governance to the other. Putting enterprise-grade governance on a transactional motion kills velocity and frustrates reps. Putting transactional-grade governance on an enterprise motion leaves huge deals dangerously under-scrutinized. And many companies run *both* — a transactional mid-market motion and an enterprise motion — in which case they need *two calibrations* of the sales-led stack, segmented by deal profile. The principle that resolves this: even within sales-led, **the deal profile tunes the structure** — depth of governance scales with deal size, and speed of governance scales inversely with deal volume. Calibrate to the profile, not to a generic "sales-led" template.

## Hybrid Discount Governance — The Hardest Case

The hybrid motion — PLG acquisition feeding a sales-led expansion and enterprise motion — is the hardest discount-governance problem there is, because the company is not choosing between the PLG philosophy and the sales-led philosophy. It is running **both, simultaneously, on the same product, often with the same brand and the same pricing page** — and it needs both governance regimes to coexist without poisoning each other.

The core hybrid challenge: **you need two governance regimes, fenced apart.** The PLG side of the business keeps its minimal, restraint-based governance — published pricing, the annual incentive, near-zero discounting, "we don't do custom" at the self-serve tier. The sales-led side runs the full apparatus — margin floor, authority matrix, deal desk, CPQ rules, bands, exception lane, quarterly review. These are not blended into one moderate compromise governance. They are kept *distinct*, each appropriate to its own motion, with a clear *boundary* between them.

That boundary — the fence — is the central design problem of hybrid governance. Where does PLG end and sales-led begin? Usually it is defined by some combination of: a price/ACV threshold (above $X annual contract value, the deal is sales-led and governed accordingly), a tier (Enterprise plan = sales-led; everything below = PLG/published), a deal-shape trigger (any deal needing a custom contract, custom terms, security review, or procurement involvement is sales-led), or an account-routing rule (accounts above N seats or showing expansion signals get routed to sales). Wherever the fence is, it must be *explicit and known*, because the entire integrity of hybrid governance depends on everyone knowing which side of the fence a given deal is on, and therefore which governance regime applies.

The reason hybrid is the hardest case is that the two regimes are in constant *contact* — same product, same company, often overlapping customers (a customer might start self-serve and graduate to sales-led). That contact creates contamination risk in both directions, and the entire job of hybrid discount governance is managing that contamination. A founder running hybrid who tries to govern with a single, blended approach will get it wrong in both directions: too heavy for the PLG bottom (killing self-serve velocity and economics) and too light for the enterprise top (under-governing large negotiated deals). The hybrid answer is not one moderate regime. It is **two distinct regimes and a well-designed fence between them.**

## Hybrid — The Contamination Problem

The specific failure mode that makes hybrid governance hard is *contamination*: the sales-led discounting reality and the PLG published-price reality leaking into each other across the fence. It runs in two directions, and a hybrid founder must govern against both.

**Contamination direction one: sales-led discounting erodes the PLG price anchor.** The sales-led team, doing its job, negotiates deals — 20%, 30%, 40% off list on big enterprise contracts. That is appropriate *within* the sales-led regime. The contamination happens when those discounts become *visible or known* outside the sales-led context — a customer mentions their discounted rate in a community forum, a prospect's procurement team benchmarks it, a self-serve customer's champion moves to a company that got the enterprise discount and now expects it. Once the market learns that "the published price is negotiable if you push," the PLG published-price anchor — the thing that makes the self-serve motion work — starts to erode. The published price stops being *the* price and becomes an *opening* price, and a PLG motion cannot survive that shift.

**Contamination direction two: the PLG entry price becomes the sales-led negotiation anchor.** This direction is subtler and just as damaging. The PLG motion has a low, friction-minimizing entry price — say $15/seat/month — designed to get teams in the door. When a large account graduates to a sales-led enterprise conversation, the buyer's procurement team takes that $15/seat as the *anchor* and negotiates the enterprise deal *down* from there: "your published price is $15, why are you quoting us $40 enterprise?" The low PLG price, which is a customer-acquisition tool, gets weaponized against the enterprise pricing power. The sales-led motion's pricing logic — value-based, feature-differentiated, security-and-support-loaded — gets dragged down to the PLG acquisition price.

The fencing required to prevent both contaminations is substantial and deliberate. It includes: **clear tier separation** so the enterprise offering is visibly a *different product package* (more features, security, support, SLAs, admin controls) and not just "the same thing at a higher price" — this justifies the price gap and breaks the anchor; **discount confidentiality and consistency** on the sales-led side so negotiated rates are not casually disclosed and similar customers get similar deals (reducing the "if you push you get a deal" market signal); **a published Enterprise "contact us" tier** rather than a published enterprise *price*, so there is no enterprise list price for procurement to anchor on, while the self-serve tiers stay transparently published; and **internal discipline** so the sales team is trained to *re-anchor* enterprise conversations on enterprise value, not to let the buyer drag the frame to the self-serve page. The fence is not a wall you build once. It is an ongoing discipline, and contamination is the default state that the discipline holds back.

## Hybrid — The Graduation-Point Governance

The single most governance-intensive moment in a hybrid motion is the *graduation point* — the moment an account that came in through PLG, self-serving on published pricing, becomes a sales-led deal with negotiated pricing. This handoff is where the two regimes touch most directly, and how a company governs it determines whether the fence holds.

Before graduation, the account is on the PLG side of the fence: published pricing, no discounting, low-touch. After graduation, the account is on the sales-led side: a rep owns it, the deal is negotiated, the full sales-led governance applies. The governance questions at the graduation point are sharp and specific. **When exactly does an account graduate?** It needs an explicit trigger — a seat threshold, an ACV threshold, a feature need (SSO, advanced security, procurement involvement), an inbound "we need to talk to sales" request. Ambiguity here means reps cherry-pick which accounts to "graduate" and the fence blurs. **When does discounting become "allowed" for this account?** The governance answer: discounting is *not* allowed while the account is on the PLG side, and *becomes* allowed — within the sales-led matrix — only once the account has formally crossed the fence into the sales-led regime. A rep cannot "pre-discount" a PLG account to pull it into sales. **What is the anchor for the graduated deal?** This is the contamination-critical question: the graduated deal must be anchored on the *enterprise value and enterprise package*, not on the PLG rate the account was previously paying. The governance structure has to explicitly support the rep in re-anchoring — different package, different value conversation, different pricing logic — rather than letting the prior self-serve rate frame the negotiation.

The transition rules, made explicit, are roughly: (1) accounts cross the fence only on defined triggers, not rep discretion; (2) crossing the fence is a *formal event* — the account is re-tiered, a rep is assigned, the deal enters the sales-led pipeline and governance; (3) discounting authority attaches *at* the crossing, not before; (4) the deal is anchored on the enterprise package and value, with the deal desk actively helping the rep break the prior-price anchor; (5) the customer's experience of the transition is managed so it feels like an *upgrade to a more capable tier*, not a "now we're going to charge you more" bait-and-switch. Get the graduation-point governance right and the hybrid fence holds. Get it wrong — fuzzy triggers, discretionary graduation, prior-price anchoring — and the two regimes bleed together at exactly the point where they are supposed to stay most distinct.

## The Founder's Motion Choice Drives The Build

Step back to the practical implication for a founder, because this is where the abstract relationship becomes a concrete decision about where to spend time, money, and organizational energy. **The founder's choice of motion — or honest recognition of the motion the company is actually running — directly drives what discount-governance machinery to build, and the investment should match the motion.**

A founder choosing or running a **pure PLG motion** should *not* build a deal desk, should *not* build an elaborate authority matrix, should *not* implement CPQ approval workflows. Building that apparatus for a PLG business is over-investment — it imports a sales-led cost structure and a velocity drag onto a model that does not need either. The PLG founder's discount-governance "build" is small: codify the published pricing, define the annual incentive, write a one-page promo policy, take an explicit "we don't do custom" stance, and spend the saved energy on price-integrity defense and on watching for the slide. The build is deliberately minimal because the motion makes it so.

A founder running a **sales-led motion** *must* build the apparatus. The margin floor, the authority matrix, the deal desk, the CPQ rules, the bands, the exception lane, the quarterly review — these are not optional bureaucracy for a sales-led business; they are core revenue infrastructure. Under-investing here is not "staying lean," it is leaving the largest controllable margin lever ungoverned. The sales-led founder's build is substantial, and it should be sequenced — lightweight versions early (a simple matrix, a part-time deal-desk role, basic CPQ rules), maturing as deal volume and size grow.

A founder running a **hybrid motion** has to build *both* — the minimal PLG governance for the self-serve side and the full sales-led apparatus for the enterprise side — *plus* the fence between them. This is the most work, and it is unavoidable: a hybrid company that tries to economize by building only one regime will mis-govern half its revenue.

The error, in both directions, is a *mismatch between the governance investment and the motion*. Over-build (PLG company with sales-led machinery) wastes money, slows the business, and can actually distort the motion toward sales-led before that is a deliberate choice. Under-build (sales-led company with PLG-level governance, i.e., almost none) bleeds margin and produces a discounting reality nobody controls or understands. The founder's job is to be honest about the motion and then size the governance build to it — no more, no less.

## The Common Mismatch — Sales-Led Governance On A PLG Motion

The first of the two classic mismatches: a PLG company that ends up with sales-led discount-governance machinery it does not need. This is the **over-build**, and it is more common than founders expect, because it usually arrives wearing the costume of "professionalization."

The mechanism is almost always a hire. A PLG company reaches some scale and decides it needs "real go-to-market leadership." It hires a VP of Sales or a CRO from an enterprise, sales-led background. That leader, doing what they know, imports the apparatus they have always run: a multi-tier discount-authority matrix, a deal desk, CPQ approval workflows, discount bands, deal-review meetings. None of it is wrong *in a sales-led context*. All of it is wrong for a PLG motion selling published-price subscriptions off a pricing page. The company now has an approval matrix governing a process — negotiation — that barely exists. It has a deal desk reviewing deals that are, overwhelmingly, just published-price purchases. It has CPQ approval chains slowing down a motion whose entire value proposition is frictionless self-serve.

The cost of the over-build is real and multi-dimensional. There is the *direct cost* — headcount and tooling for governance machinery that has nothing to govern. There is the *velocity cost* — friction introduced into a motion that lives and dies on low friction. And there is the most insidious cost, the *motion-distortion cost*: once you have built the sales-led machinery, the organization starts *using* it, which means it starts doing negotiated deals, which means it starts sliding toward sales-led — not because that was a deliberate strategic choice, but because the apparatus exists and apparatus wants to be used. The over-build can actually *cause* the slide it should have been the company's job to resist.

The fix is the founder recognizing that *a great sales-led leader is not automatically the right leader for a PLG motion*, and that "professionalizing" go-to-market does not mean importing the heaviest governance apparatus available. It means building the governance the *motion* needs — which, for PLG, is minimal. Over-building discount governance is bureaucracy with no purpose, and a disciplined PLG founder treats the instinct to build it as a warning sign, not a sign of maturity.

## The Common Mismatch — No Governance On A Sales-Led Motion

The mirror-image mismatch, and arguably the more financially damaging one: a company running a genuine sales-led motion with essentially no discount governance — the **under-build**.

The mechanism here is usually organic drift plus a founder identity. A founder-led company starts with a product the founder believes "sells itself." Early deals are closed by the founder, by feel, with discounts decided in the moment. The company grows, hires reps, and the deals get bigger and more negotiated — it has, in fact, become a sales-led company. But the governance never gets built, for two reasons. First, the founder still thinks of the company as "a product company," not "a sales company," and discount governance feels like the kind of corporate machinery a product company should not need. Second, discounting "feels gross" — building an explicit apparatus around it feels like institutionalizing something distasteful, so the founder avoids it. So discounts get approved ad hoc — a Slack message, a quick "yeah, fine" from the founder or a sales manager — with no matrix, no floor, no bands, no deal desk, no data.

The result is **discount drift and margin erosion**, and it is quiet and compounding. With no governance, every rep develops their own discounting habits. With no floor, deals get done below the level where they actually make economic sense. With no bands, similar customers get wildly different prices, which eventually leaks and damages the whole pricing structure. With no quarterly review, nobody can even *answer* the question "what is our average discount, and is it getting worse?" — and it almost always is getting worse, because the path of least resistance in every individual negotiation is to give more. The company's gross margin slowly degrades, its pricing power quietly evaporates, and because there was never any measurement, the erosion is invisible until it is severe.

The fix is the founder accepting two things. First, *the company is sales-led* — whatever the founder's identity preference, if every deal is negotiated, the motion is sales-led and needs sales-led governance. Second, *discount governance is not distasteful corporate machinery — it is core revenue infrastructure*, exactly as essential as the CRM, and building it is a sign of operational maturity, not of becoming "a sales company" in some pejorative sense. The under-build is, at root, a refusal to see and name the motion the company actually runs. Naming it is the first step out.

## The Motion-Evolution Dimension

A critical complication: **motions are not static.** A company's go-to-market motion evolves over its life, and the single most common cause of a governance mismatch is not picking the wrong governance for the motion — it is the *governance failing to evolve when the motion evolves*. The governance lags the motion, sometimes by years, and the lag is the failure.

The common evolution paths are well-worn. **PLG companies add a sales-led motion.** They reach the ceiling of what self-serve can capture from larger accounts and build an enterprise sales team — Slack, Notion, Figma, Airtable all walked this path. **Sales-led companies add a PLG or self-serve motion.** They want a lower-friction acquisition channel, a bottom-up wedge, a developer entry point — many traditional SaaS companies have added free tiers and self-serve plans. **Companies move between transactional and enterprise sales-led** as they move up- or down-market. In every one of these transitions, the discounting reality of the business *changes* — and the governance has to change with it.

The failure pattern: the motion evolves on a quarterly or yearly timescale, driven by go-to-market decisions, while the governance sits frozen at whatever it was when it was last deliberately designed. A PLG company adds a sales team but keeps governing with "we don't really discount" — under-built for the new sales-led motion. A sales-led company adds a self-serve tier but routes it through the same heavy deal desk and approval matrix — over-built for the new PLG motion, killing its velocity. In both cases the governance is now wrong, not because it was ever wrong for the original motion, but because the motion moved and the governance did not.

The discipline that prevents this: treat discount governance as a *living structure tied to the motion*, and make it an explicit agenda item every time the motion changes. When leadership decides to add a sales-led motion, the *same decision* should include "and here is how we build sales-led governance for it." When leadership decides to add a self-serve tier, the same decision should include "and here is how we fence it from our sales-led governance so we don't strangle it." The governance must evolve *with* the motion, in lockstep, as a deliberate part of every motion-change decision — not as a cleanup project someone notices two years later when the margin numbers finally look wrong.

## Pricing Architecture As The Foundation

Underneath discount governance sits an even more foundational layer: the **pricing architecture** — the structure of plans, tiers, packaging, and price points. And here too the motion is the driver: the GTM motion dictates the pricing architecture, and the discount governance then sits *on top of* whatever architecture the motion requires. Get the architecture wrong for the motion and no amount of governance design can compensate.

A **PLG motion requires a clean, published, self-selectable pricing architecture.** Clear tiers with obvious differentiation, transparent price points, a structure a buyer can understand and choose from without talking to anyone. The architecture *is* the sales process. If a PLG company's pricing architecture is murky, inconsistent, or requires interpretation, the self-serve motion breaks — and discount governance cannot fix a broken architecture.

A **sales-led motion requires a pricing architecture built for negotiation.** There is a list price, but the architecture anticipates that the real price is configured per deal — it has the dimensions a rep negotiates across (seats, modules, term, ramp, support level, usage), it has a defensible list-to-floor range, and it has the structural levers (multi-year, payment terms, bundling) that let a rep create value in a negotiation without simply cutting price. The architecture is built to be *worked*, and the discount governance is the system that bounds how it gets worked.

A **hybrid motion requires both architectures, coherently joined.** Clean published tiers at the bottom for the PLG motion; a negotiable enterprise architecture at the top for the sales-led motion; and a deliberate join between them — the Enterprise "contact us" tier, the clear package differentiation that justifies the price gap — that supports the fence rather than undermining it. The hybrid pricing architecture is itself a major piece of the contamination defense.

The sequence for a founder is: motion first, then pricing architecture derived from the motion, then discount governance built on top of the architecture. Founders sometimes try to fix a discounting problem with governance when the real problem is an architecture that does not fit the motion — e.g., a sales-led company with a single rigid price and no negotiation dimensions, or a PLG company with a tier structure too complex to self-select. Governance sits on the architecture; the architecture sits on the motion. All three have to line up.

## The Comp Connection By Motion

Sales compensation design and discount governance are deeply linked — comp is one of the most powerful discount-governance levers there is — but *how* linked, and which lever matters, **differs sharply by motion.** A founder must understand the comp-governance relationship specific to their motion, not import a generic one.

In a **PLG motion**, comp is light or product-driven and largely *discount-irrelevant*. There may be no quota-carrying reps at all; where there are product specialists or growth roles, their comp is typically tied to conversion, expansion, or activation metrics — not to closing negotiated deals. Because there is little discounting, comp is not a meaningful discount-governance lever in PLG. The governance energy goes to published-price discipline, not to comp design. A PLG founder spending a lot of time engineering "discount-discipline incentives" into comp is, again, solving a problem the motion does not really have.

In a **sales-led motion**, comp design *is* a primary discount-governance lever — arguably the most powerful one, because it shapes rep behavior continuously and at scale in a way no approval matrix can. The key mechanisms: **margin-based or net-revenue-based commission** rather than gross-bookings commission, so a rep who discounts deeply earns less and the incentive aligns with price protection; **discount-tiered commission rates**, where deals closed at or near list earn a higher rate than deeply discounted deals; **clawbacks** for early churn so reps are not incentivized to discount a bad-fit deal across the line; and accelerators structured so the rep's upside comes from *volume and price*, not from *volume at any price*. In sales-led, if comp pays full commission on heavily discounted deals, no authority matrix in the world will fully hold the line — the comp plan is fighting the governance. The comp plan and the discount governance must be designed *together*.

In a **hybrid motion**, the comp-governance relationship is split: the PLG side's roles stay on conversion/expansion comp where discount is not the lever, and the sales-led side's roles are on margin-aware, discount-disciplined comp. The hybrid founder must resist the temptation to put everyone on one unified comp plan — because a unified plan will be either wrong for the PLG roles or wrong for the sales-led roles. Just as the governance is two fenced regimes, the comp design is two regimes too, each matched to its side of the fence.

## The Tooling By Motion

The tooling stack that supports discount governance — billing systems, pricing pages, CPQ, approval-workflow software, deal-desk tooling — also follows the motion. A founder should buy and build the tooling the motion needs, and importing the wrong tooling stack is just another form of the over-build / under-build mismatch.

A **PLG motion's tooling** is centered on a billing system and a published pricing page, with minimal or no CPQ. The billing system handles subscriptions, the annual-vs-monthly toggle, the published tiers, self-serve upgrades and downgrades. The pricing page *is* the quoting tool. There is little or no need for configure-price-quote software, approval-workflow engines, or deal-desk tooling — because there are no configured quotes and no approval workflows to speak of. A PLG company buying a heavyweight CPQ platform is buying tooling for a process it does not run.

A **sales-led motion's tooling** is centered on full CPQ plus approval-workflow automation plus deal-desk tooling. CPQ to configure non-standard quotes and encode the authority matrix; approval-workflow automation to route escalations to the right tier automatically with an audit trail; deal-desk tooling (which may be part of CPQ, or CRM-based, or purpose-built) to manage the deal-desk queue, model deal economics, and maintain the institutional record of approvals. For a sales-led motion this tooling is essential infrastructure — without it the governance stack is aspirational rather than enforced.

A **hybrid motion's tooling** is both stacks — the PLG billing-and-pricing-page tooling for the self-serve side, the full CPQ-and-approval tooling for the sales-led side — *fenced* so the self-serve motion is not routed through the sales-led tooling and slowed to a crawl, and the sales-led motion is not run off a simple billing page with no governance enforcement. The hybrid tooling architecture has to support the fence: self-serve flows through the lightweight stack, sales-led flows through the heavyweight stack, and the systems are integrated enough to share customer data but separated enough that each motion runs at its proper speed.

The principle, consistent with everything above: tooling follows motion. Buy the billing-and-pricing-page stack for PLG, the CPQ-and-approval stack for sales-led, both-fenced for hybrid. Tooling bought against the wrong motion is wasted spend at best and a velocity-killing drag at worst.

## Measuring Governance Fit

How does a founder know whether their discount governance actually *fits* their motion? There is a diagnostic, and it is built around a single question: **does the discount-governance investment match the motion?** Fit is the goal; over-build and under-build are the two ways to miss it.

The **over-build symptoms** (governance heavier than the motion needs): a PLG or predominantly-self-serve company with a multi-tier deal desk, an elaborate authority matrix, and CPQ approval chains — machinery that has almost nothing to govern because almost every transaction is a published-price purchase. Signs: deal-desk reviews that rubber-stamp standard deals; approval workflows that add days to a motion that should close in minutes; a governance headcount disproportionate to the volume of actually-negotiated deals; reps and customers frustrated by friction in a motion sold on its frictionlessness. If the governance apparatus is large but the negotiated-deal volume is small, the company is over-built.

The **under-build symptoms** (governance lighter than the motion needs): a genuinely sales-led company — every deal negotiated, real discounting on every deal — running with discounts approved in a Slack channel, no documented matrix, no margin floor, no bands, no deal desk, no quarterly review, and critically *no data* on realized discount levels or trend. Signs: nobody can answer "what is our average discount by segment and is it getting worse?"; similar customers are on very different prices; margin is drifting and the drift was not noticed until it was severe; every escalation is an ad-hoc judgment call. If the negotiated-deal volume is high but the governance apparatus is nearly absent, the company is under-built.

**Good fit** looks like: a PLG company whose discount governance fits on a page (published pricing, annual incentive, promo policy, "no custom" stance) and whose energy goes to price-integrity defense; a sales-led company with a right-sized stack — matrix, floor, bands, deal desk, CPQ, exception lane, quarterly review — calibrated to its deal profile, where routine discounts move fast and only exceptions escalate; a hybrid company with two visibly distinct regimes and an explicit, well-understood fence between them. The fit diagnostic is not "do we have governance" — it is "does the *amount and shape* of our governance match the motion we actually run." Run that diagnostic honestly and the over-build / under-build failures become visible before they become expensive.

## The Founder's Decision Sequence

Pulling the practical guidance into an explicit order of operations, because the *sequence* is itself the most important deliverable of this entry. Founders get discount governance wrong primarily by doing the steps out of order — building governance before clarifying the motion.

**Step one: decide and clarify the motion — honestly.** Before any governance design, answer the question "what motion are we actually running, today, in reality?" Not aspirationally, not based on the founder's identity preference, not based on what the company was two years ago. Today. Pure PLG? Sales-led — and if so, transactional, enterprise, or both? Hybrid — and if so, where is the fence? This step is hard because it requires honesty about drift (the PLG company that has quietly added a sales motion; the "product company" that is actually sales-led) and because the motion may be mid-transition. But every subsequent step depends on it.

**Step two: derive the pricing architecture from the motion.** PLG → clean published tiers. Sales-led → an architecture built to be negotiated. Hybrid → both, coherently joined. The architecture is the foundation governance sits on.

**Step three: derive the discount-governance structure from the motion and architecture.** PLG → minimal: published-price discipline, the annual incentive, a promo policy, a "no custom" stance, and active vigilance against the slide. Sales-led → the full stack, calibrated to deal profile: margin floor, authority matrix, deal desk, CPQ rules, bands, exception lane, quarterly review. Hybrid → two fenced regimes plus the fence design and graduation-point rules.

**Step four: build the comp and tooling to match.** Comp: discount-irrelevant for PLG roles, margin-aware and discount-disciplined for sales-led roles, two regimes for hybrid. Tooling: billing-and-pricing-page for PLG, CPQ-and-approval for sales-led, both-fenced for hybrid.

**Step five: review fit on a cycle, and re-run the whole sequence when the motion evolves.** Run the fit diagnostic regularly. And critically — *every time the motion changes*, go back to step one. A motion change is not a minor event the governance can absorb; it is a trigger to re-derive the governance from the new motion.

The non-negotiable rule embedded in this sequence: **never build discount governance in the abstract.** Governance is always *derived from* the motion. A founder who finds themselves designing an authority matrix without first having crisply answered "what is our motion" has already made the core mistake. Motion first. Always.

## Five Real-World Scenarios

Abstract principles land harder when made concrete. Here are five scenarios — composites of common patterns — showing the motion-to-governance relationship playing out, well and badly.

**Scenario one: the pure-PLG company resisting the discounting slide.** A developer-tools company runs a clean PLG motion — published pricing, free tier, self-serve conversion, no quota-carrying reps. Growth is strong. Periodically a large prospect asks for a custom price and a custom contract. The founder has explicitly decided: the discount-governance structure is the published pricing page, the annual incentive, and a firm "we don't do custom" stance. Each time the custom request comes, the answer is the published Enterprise tier or a polite no. The governance "build" is one page. The discipline is in the *restraint* — the company has deliberately *not* built a deal desk or a matrix, and the founder treats the recurring temptation to build them as the signal to hold the line. The motion is PLG; the governance is minimal; they match. The company stays fast and keeps its price integrity.

**Scenario two: the sales-led company that under-built and got drift.** A company sells six-figure-ACV software through a team of AEs — unambiguously sales-led. But the founder still thinks of it as "a product company," and discounting "feels gross," so governance never got built: discounts are approved by Slack message, there is no floor, no matrix, no bands, no deal desk, no quarterly review, no discount data. Over two years, average discount drifts from the low teens to the mid-thirties. Nobody noticed because nobody measured. Margin erodes, similar customers end up on very different prices, and a procurement team eventually benchmarks the inconsistency and uses it against the company. The motion was sales-led; the governance was PLG-level (i.e., almost none); the mismatch was an under-build, and it cost real margin before it was even visible.

**Scenario three: the PLG company over-built with sales-led machinery.** A self-serve SaaS company, selling published-price subscriptions, decides to "professionalize" and hires an enterprise CRO. The CRO imports the full apparatus they have always run — a 5-tier authority matrix, a deal desk, CPQ approval workflows, deal-review meetings. The trouble: the company barely negotiates any deals. The deal desk rubber-stamps published-price purchases. The approval chains add friction to a frictionless motion. Worse, now that the machinery exists, the team starts *using* it — doing custom deals — and the company drifts toward sales-led without ever deciding to. The motion was PLG; the governance was sales-led-grade; the over-build wasted money, slowed the motion, and distorted it.

**Scenario four: the hybrid company fighting the contamination problem.** A collaboration-software company runs hybrid — self-serve published tiers at the bottom, an enterprise sales team at the top. Initially they govern with one blended approach, and contamination sets in: enterprise discounts get known and the published-price anchor starts to wobble; procurement teams anchor enterprise negotiations on the cheap self-serve seat price. The fix is explicit fencing: the enterprise offering becomes a visibly different package (security, admin, SLAs, support), the enterprise tier becomes "contact us" rather than a published price, negotiated rates are kept consistent and confidential, and reps are trained to re-anchor on enterprise value. Two distinct regimes, one well-designed fence. The motion was hybrid; the governance becomes two fenced regimes; the match holds the contamination back.

**Scenario five: the PLG company adding a sales-led motion and building governance for the new motion.** A PLG company hits the ceiling of self-serve and decides — deliberately, with the decision *named* — to add an enterprise sales motion. Critically, the same leadership decision that adds the sales team also includes "and here is how we build sales-led governance for it." The PLG side keeps its minimal published-price governance untouched. The new sales-led side gets a deliberately built stack — a matrix, a floor, bands, a deal-desk role, CPQ rules, an exception lane, a quarterly review — and an explicit fence and graduation-point rules are designed between the two. The company has become hybrid *on purpose*, and the governance evolved *with* the motion, in lockstep, as part of the motion-change decision. This is the model: the motion evolved, and the governance was re-derived from the new motion at the same moment, not two years later as a cleanup.

## The Decision Framework

Condensing everything into a framework a founder can actually run.

**1. Identify the motion — honestly and currently.** Pure PLG, sales-led (transactional / enterprise / both), or hybrid. Be honest about drift and about mid-transition states. This is step one and everything depends on it.

**2. If PLG: minimal governance, protect published-price integrity.** Published pricing is the governance. Codify the tiers, define the annual incentive, write a one-page promo policy, take a "no custom" stance. Do *not* build a deal desk or an authority matrix. Spend the energy on price-integrity defense and on watching for the slide toward sales-led.

**3. If sales-led: build the full apparatus, calibrate to deal profile.** Margin floor, tiered authority matrix, deal desk, CPQ approval rules, discount bands by size and depth, strategic-exception lane, quarterly governance review. Calibrate: transactional → light and fast, wide rep autonomy; enterprise → deep and central, deal desk early on most deals. If you run both profiles, run two calibrations.

**4. If hybrid: two fenced regimes.** Keep the minimal PLG governance for the self-serve side and the full sales-led apparatus for the enterprise side. Design the fence explicitly (price/ACV threshold, tier, deal-shape trigger, routing rule). Govern the contamination problem in both directions and define clear graduation-point rules.

**5. Match the governance investment to the motion.** Over-build (PLG with sales-led machinery) and under-build (sales-led with no governance) are the two failure modes. The fit diagnostic: does the amount and shape of governance match the motion actually being run?

**6. Build comp and tooling to match the motion.** Comp: discount-irrelevant for PLG, margin-aware and discount-disciplined for sales-led, two regimes for hybrid. Tooling: billing-and-pricing-page for PLG, CPQ-and-approval for sales-led, both-fenced for hybrid.

**7. Evolve the governance as the motion evolves.** Motions change — PLG adds sales-led, sales-led adds self-serve, companies move between transactional and enterprise. Treat every motion change as a trigger to re-run this framework from step one. The governance must move in lockstep with the motion, never lag it.

The framework is a sequence, and the sequence is the point: motion first, then architecture, then governance, then comp and tooling, then ongoing fit review — and re-derive from the top whenever the motion moves.

## 5-Year Outlook

Where is the motion-to-governance relationship heading over the next five years? Several forces are reshaping it.

**Motions are blurring further.** The clean three-way taxonomy — PLG, sales-led, hybrid — is becoming less clean as more companies run genuinely blended motions: product-led sales (PLS), sales-assisted PLG, community-led growth feeding both, usage-based models that sit awkwardly between published and negotiated pricing. As the motions blur, the governance challenge shifts from "pick the regime for your motion" toward "manage multiple partial regimes and the fences between them." The hybrid case — two fenced regimes — becomes less the exception and more the norm, and the fence design becomes the central skill.

**More companies will run hybrid.** The PLG-to-enterprise path is now a well-trodden playbook, and the enterprise-adds-self-serve path is increasingly common too. Over five years, the share of companies running some genuinely hybrid motion grows, which means the hardest discount-governance case — two fenced regimes, contamination management, graduation-point governance — becomes the case most founders actually face. Founders should expect to need hybrid governance skills even if they start pure.

**Usage-based and AI-era pricing changes the economics of each motion.** Consumption pricing, outcome-based pricing, and AI-cost-driven pricing models are spreading. These models change what "a discount" even *is* — when price is metered to usage or tied to outcomes, the discounting surface area and the governance levers look different than in classic seat-based subscriptions. PLG with usage pricing has new price-integrity questions; sales-led with consumption pricing has new things to negotiate and govern; hybrid has new fence-design problems. The governance frameworks will have to adapt to pricing models that are neither cleanly "published" nor cleanly "negotiated."

**AI changes the economics of the motions themselves.** AI is lowering the cost of a low-touch motion (more can be self-served, supported, and expanded without humans) and simultaneously changing the cost structure of a high-touch motion (AI-assisted reps, AI deal desks, AI-driven discount-recommendation engines). As AI shifts the relative economics, the *optimal* motion for a given business may shift — which, per the motion-evolution principle, means the optimal governance shifts too. AI deal-desk and discount-guidance tooling will also make sophisticated sales-led governance cheaper to operate, which may lower the threshold at which a company can afford the full apparatus.

The throughline of the outlook: the *principle* — governance is derived from motion — only becomes *more* important as motions multiply, blur, and shift. The specific regimes will get more varied and the fences more numerous, but the founder's core discipline stays exactly the same: identify the motion honestly, derive the governance from it, match the investment, and re-derive whenever the motion moves.

## Final Framework

The motion-to-discount-governance mapping, stated as cleanly as possible — the thing to remember when everything else fades:

**Discount governance is derived from the go-to-market motion. The motion is the independent variable; the governance is the dependent variable. Never build governance in the abstract.**

**PLG → minimal governance.** Published pricing *is* the governance. The structure is one page: published tiers, the annual incentive, a promo policy, a "no custom" stance. The job is price-integrity defense and resisting the slide into sales-led. The error is over-building — importing a deal desk and a matrix the motion does not need.

**Sales-led → the full apparatus.** Discounting is intrinsic, so build the stack: margin floor, tiered authority matrix, deal desk, CPQ approval rules, discount bands, strategic-exception lane, quarterly governance review. Calibrate to deal profile — transactional light and fast, enterprise deep and central. The error is under-building — leaving the largest controllable margin lever ungoverned because discounting "feels gross."

**Hybrid → two fenced regimes.** Minimal PLG governance for the self-serve side, the full sales-led apparatus for the enterprise side, and an explicit, well-designed fence between them. Govern the contamination problem in both directions; define clear graduation-point rules. The error is blending into one moderate regime that is too heavy for the bottom and too light for the top.

**The fit diagnostic.** A PLG company with a big deal desk is over-built. A sales-led company with discounts in a Slack channel is under-built. Fit means the amount and shape of governance match the motion actually being run.

**The decision sequence.** Motion first — honestly, currently. Then pricing architecture from the motion. Then discount governance from the motion and architecture. Then comp and tooling to match. Then ongoing fit review — and re-derive from the top every time the motion evolves.

The founder who internalizes this does not ask "what discount governance should we have?" as a standalone question. They ask "what motion are we running?" — and the governance follows from the honest answer. That is the entire relationship, and getting the order right is most of getting it right.

`;

const flow = `

## The Motion-To-Governance Mapping

\`\`\`mermaid
flowchart TD
  M[Founder Identifies The GTM Motion] --> P[Pure PLG Self Serve]
  M --> S[Sales Led]
  M --> H[Hybrid PLG Plus Sales Led]
  P --> P1[Minimal Governance]
  P1 --> P2[Published Pricing Is The Governance]
  P1 --> P3[Annual vs Monthly Is The Only Discount]
  P1 --> P4[Promo Policy Time Boxed And Universal]
  P1 --> P5[No Custom Deals Stance]
  P1 --> P6[Job Is Price Integrity Defense]
  P1 --> P7[Watch For The Slide Into Sales Led]
  S --> S1[Full Governance Apparatus]
  S1 --> S2[Margin Floor]
  S1 --> S3[Tiered Discount Authority Matrix]
  S1 --> S4[Deal Desk Function]
  S1 --> S5[CPQ Approval Rules]
  S1 --> S6[Discount Bands By Size And Depth]
  S1 --> S7[Strategic Exception Lane]
  S1 --> S8[Quarterly Governance Review]
  S1 --> S9[Calibrate Transactional Light vs Enterprise Deep]
  H --> H1[Two Fenced Regimes]
  H1 --> H2[PLG Side Keeps Minimal Published Price Governance]
  H1 --> H3[Sales Led Side Runs The Full Apparatus]
  H1 --> H4[Explicit Fence Price Or Tier Or Deal Shape Trigger]
  H1 --> H5[Govern Contamination In Both Directions]
  H1 --> H6[Graduation Point Handoff Rules]
  P6 --> FIT[Match Governance Investment To The Motion]
  S9 --> FIT
  H6 --> FIT
  FIT --> EV[Re Derive When The Motion Evolves]
\`\`\`

## The Mismatch Quadrant

\`\`\`mermaid
flowchart TD
  Q[Motion x Governance Build] --> A[PLG Motion Plus Light Build]
  Q --> B[PLG Motion Plus Heavy Build]
  Q --> C[Sales Led Motion Plus Light Build]
  Q --> D[Sales Led Motion Plus Heavy Build]
  A --> A1[CORRECT Fit]
  A1 --> A2[Published Pricing Defended Velocity Preserved]
  D --> D1[CORRECT Fit]
  D1 --> D2[Discounting Channeled Bounded And Audited]
  B --> B1[FAILURE Over Built]
  B1 --> B2[Deal Desk And Matrix With Nothing To Govern]
  B1 --> B3[Friction On A Frictionless Motion]
  B1 --> B4[Apparatus Distorts Company Toward Sales Led]
  C --> C1[FAILURE Under Built]
  C1 --> C2[Discounts Approved In A Slack Channel]
  C1 --> C3[No Floor No Matrix No Bands No Data]
  C1 --> C4[Quiet Compounding Margin Erosion]
  A2 --> R[Fit Diagnostic Does The Build Match The Motion]
  D2 --> R
  B4 --> R
  C4 --> R
\`\`\`

`;

const src = `

## Sources

1. **OpenView Partners — Product Led Growth research and the PLG Index** — Foundational body of work defining the product-led-growth motion, its economics, and how it differs structurally from sales-led go-to-market. https://openviewpartners.com
2. **a16z (Andreessen Horowitz) — "The New Era of Pricing: Usage-Based, Hybrid, and Beyond"** — Analysis of how pricing architecture and go-to-market motion are linked, and how hybrid motions complicate pricing.
3. **Bessemer Venture Partners — "State of the Cloud" and PLG benchmarking** — Benchmarks on PLG vs sales-led vs hybrid motions across the cloud-software universe.
4. **Kyle Poyar (Growth Unhinged / formerly OpenView) — writing on PLG-to-enterprise transitions** — Detailed treatment of how PLG companies layer on a sales-led enterprise motion and the operational changes required.
5. **SaaStr (Jason Lemkin) — extensive material on discounting, deal desks, and sales-led discipline** — Practitioner guidance on discount-authority matrices, the role of the deal desk, and discount discipline in sales-led SaaS.
6. **Gartner — "Configure, Price, Quote (CPQ) Application Suites" Magic Quadrant and research** — Definitive market analysis of CPQ tooling, approval-workflow automation, and the technology layer of sales-led discount governance.
7. **Winning by Design — revenue architecture and deal-desk operating models** — Frameworks for how deal desks, approval routing, and discount governance function within a structured sales-led revenue engine.
8. **Forrester — go-to-market motion and pricing strategy research** — Analysis of motion selection and the downstream implications for pricing and commercial governance.
9. **First Round Review — founder-focused essays on pricing, discounting, and go-to-market motion** — Practitioner narratives on how founders get discount governance right and wrong at each stage.
10. **Profitwell / Paddle — pricing and monetization benchmarking data** — Empirical data on discounting prevalence, price realization, and the cost of discount drift across subscription businesses.
11. **The RevOps Co-op community — practitioner discussion on deal desk design and discount-authority matrices** — Crowdsourced operating practice from RevOps leaders on building and calibrating discount governance.
12. **Bain & Company — pricing and commercial excellence research** — Consulting research on margin leakage, discount waterfalls, and the price realization gap in negotiated-sales businesses.
13. **McKinsey & Company — "Pricing: Distinct capabilities for distinct go-to-market models"** — Analysis of how commercial governance must be tailored to the selling model rather than applied generically.
14. **Tomasz Tunguz (Theory Ventures, formerly Redpoint) — writing on SaaS pricing, discounting, and sales efficiency** — Data-driven analysis of discounting's impact on unit economics and the link between motion and pricing power.
15. **HubSpot and Atlassian — publicly documented hybrid go-to-market journeys** — Case-study material on companies that run PLG acquisition feeding sales-led expansion, and how they structure the boundary.
16. **Slack, Notion, Figma, Datadog — publicly available accounts of PLG-to-enterprise evolution** — Examples of the motion-evolution path from pure PLG toward hybrid and the governance changes it forced.
17. **Pavilion (formerly Revenue Collective) — go-to-market leadership community resources** — Practitioner material on motion design, comp-plan-to-discount-governance linkage, and scaling commercial operations.
18. **CFO and finance-leadership literature on gross-margin protection** — The finance-side perspective on why discount governance is core revenue infrastructure and how margin floors are derived from unit economics.
19. **Sales compensation research (Alexander Group, Korn Ferry, QuotaPath resources)** — Analysis of margin-based commission, discount-tiered rates, and clawbacks as discount-governance levers in sales-led motions.
20. **Lenny's Newsletter — practitioner essays on PLG, sales-led, and hybrid motions** — Founder- and operator-focused treatment of choosing and evolving a go-to-market motion.

`;

const num = `

## Numbers

**Motion Taxonomy And Prevalence**
- Three core motions: PLG / self-serve, sales-led, hybrid
- Hybrid is increasingly the modal motion for growth-stage B2B software
- Two sales-led sub-archetypes that require distinct calibration: transactional and enterprise
- Motion-evolution paths: PLG adds sales-led; sales-led adds self-serve; companies move between transactional and enterprise

**PLG Governance Footprint**
- Discount-governance structure size: ~1 page (published tiers, annual incentive, promo policy, no-custom stance)
- Number of sanctioned price variations: 1 (annual-vs-monthly prepay incentive)
- Typical annual prepay incentive: ~15-20% off the monthly rate, published and universal
- Deal desk headcount required: 0
- Authority-matrix tiers required: 0
- Primary governance activity: price-integrity defense and slide-watching

**Sales-Led Governance Stack — 7 Components**
- 1. Margin floor (derived from unit economics — CAC payback, gross margin, cost to serve)
- 2. Tiered discount-authority matrix (rep -> manager -> VP/RevOps -> CRO/CEO -> founder), typically 2-dimensional (depth x deal size)
- 3. Deal desk function (fractional RevOps role early; dedicated team at scale)
- 4. CPQ approval rules (encodes the matrix into software with automatic routing and audit trail)
- 5. Discount bands by deal size and depth (pre-approved ranges; in-band fast, out-of-band escalates)
- 6. Strategic-exception lane (fast, senior-signed path for genuinely strategic deals)
- 7. Quarterly governance review (average discount by segment, trend, approval-tier distribution, exception frequency, margin by cohort)

**Sales-Led Calibration By Deal Profile**
- Transactional sales-led: smaller ACV, faster cycles, high deal volume per rep -> light and fast governance, wide rep autonomy, wide bands, deal desk handles only exceptions
- Enterprise sales-led: six-to-seven-figure ACV, long cycles, low deal volume per rep -> deep and central governance, lower matrix thresholds, narrow bands, deal desk involved early on most deals
- Companies running both profiles need 2 calibrations of the sales-led stack

**Hybrid Governance**
- Number of coexisting governance regimes required: 2 (fenced apart)
- Fence definition options: price/ACV threshold, tier (Enterprise = sales-led), deal-shape trigger (custom contract / security review / procurement), account-routing rule (seats or expansion signals)
- Contamination directions to govern: 2 (sales-led discounts erode the PLG anchor; PLG entry price anchors sales-led negotiations down)
- Most governance-intensive moment: the graduation point (PLG account becoming a sales-led deal)

**The Two Mismatch Failure Modes**
- Over-build: PLG motion + heavy governance build -> wasted spend, velocity drag, motion distortion toward sales-led
- Under-build: sales-led motion + light/no governance build -> discount drift, quiet compounding margin erosion, inconsistent pricing, no discount data
- The 2 correct quadrant cells: PLG + light build; sales-led + heavy build
- The 2 failure quadrant cells: PLG + heavy build (over-built); sales-led + light build (under-built)

**The Founder Decision Sequence — 5 (+2) Steps**
- Step 1: identify the motion — honestly and currently
- Step 2: derive the pricing architecture from the motion
- Step 3: derive the discount-governance structure from the motion and architecture
- Step 4: build comp and tooling to match the motion
- Step 5: review fit on a cycle — and re-run the sequence from step 1 whenever the motion evolves
- Decision-framework restatement: 7 numbered steps (identify; PLG path; sales-led path; hybrid path; match investment; comp and tooling; evolve with the motion)

**Comp Connection By Motion**
- PLG: comp is light or product-driven, largely discount-irrelevant
- Sales-led: comp IS a primary discount-governance lever — margin-based commission, discount-tiered rates, clawbacks
- Hybrid: 2 comp regimes — conversion/expansion comp for PLG roles, margin-aware discount-disciplined comp for sales-led roles

**Tooling By Motion**
- PLG: billing system + published pricing page, minimal/no CPQ
- Sales-led: full CPQ + approval-workflow automation + deal-desk tooling
- Hybrid: both stacks, fenced so each motion runs at its proper speed

**Outlook Forces — 4**
- Motions blurring further (PLS, sales-assisted PLG, community-led, usage-based)
- More companies running hybrid (hardest case becomes the modal case)
- Usage-based and AI-era pricing changing what "a discount" even is
- AI changing the economics of the motions themselves and lowering the cost of operating sophisticated sales-led governance

`;

const counter = `

## Counter-Case: When Deriving Governance Purely From The Motion Oversimplifies

The core thesis of this entry — discount governance is derived from the go-to-market motion — is correct and useful, but a disciplined founder should stress-test it, because applied too rigidly it becomes its own kind of mistake. There are real conditions under which "just match the governance to the motion label" oversimplifies, and treating the motion taxonomy as a rigid rulebook causes the very failures the thesis is meant to prevent.

**Counter 1 — A "PLG" company with a meaningful enterprise tail genuinely needs some sales-led governance, even though it is "PLG."** The cleanest version of the framework says: pure PLG, minimal governance, no deal desk, no matrix. But very few companies are *purely* PLG in practice. Most PLG companies have a tail of larger accounts — maybe 5-15% of revenue — that genuinely behave like sales-led deals: they want a custom contract, a security review, a procurement process, and yes, a negotiated price. A founder who rigidly applies "we're PLG, therefore zero discount apparatus" to a company with a real enterprise tail will under-govern that tail — and it is exactly the highest-value slice of the business. The honest version of the thesis is not "PLG means zero apparatus." It is "PLG means *minimal* apparatus *for the PLG motion* — and if you have a real enterprise tail, you actually have a small hybrid, and that tail needs its own small sales-led governance." The label "PLG" can hide a real, governance-requiring sales-led component. The framework works only if the founder is honest enough to see the tail as what it is.

**Counter 2 — "We're PLG so we don't discount" can harden into dogma that loses winnable enterprise deals.** The price-integrity-defense philosophy is right — until it calcifies into an identity. There is a failure mode where "we don't do custom" stops being a *deliberate strategic choice* and becomes an *unexamined reflex*, and the company starts walking away from genuinely winnable, genuinely valuable enterprise deals — large logos, strategic accounts, competitive displacements — purely because doing the deal would require breaking the published-price purity. At that point, governance philosophy has become dogma, and dogma is destroying enterprise value. The thesis says PLG should resist the slide into sales-led; the counter-case is that *resistance taken too far is its own loss*. The discipline is not "never do a custom deal." It is "do not *drift* into a sales-led motion unconsciously" — which is compatible with *deliberately* deciding to pursue an enterprise tail, with deliberately built governance for it. A founder who uses "we're PLG" as a reason to never examine whether an enterprise motion is worth building is hiding behind the label, not using the framework.

**Counter 3 — A founder can use the motion label as an excuse to avoid building governance the business actually needs.** This is the mirror risk. Just as "we're PLG" can be an excuse to avoid building enterprise governance, "we're still figuring out our motion" or "we're product-led at heart" can be an excuse a founder uses to avoid building *any* governance — including governance the business demonstrably needs *right now*. The motion taxonomy is meant to be a tool for deriving the right governance; it can be misused as a tool for *deferring* governance indefinitely. A founder who, every quarter, has more negotiated deals, more discount drift, and more margin erosion — but keeps saying "let's not over-build, we're basically PLG" — is not applying the framework. They are weaponizing the framework's "don't over-build" guidance against the framework's "match the governance to the actual motion" guidance. The thesis assumes intellectual honesty about the *current* motion. Absent that honesty, the framework's nuance becomes cover for under-building.

**Counter 4 — When the motion itself is genuinely unclear or mid-transition, forcing a governance structure prematurely locks in the wrong build.** The framework says "identify the motion, then derive governance." But what if the motion is genuinely, legitimately *unclear* — an early company still discovering whether it is PLG, sales-led, or hybrid; a company mid-transition where the old motion and the new motion coexist messily; a company experimenting with multiple motions to see which one works? In those situations, *forcing* a definitive governance structure can be worse than tolerating some ambiguity. If you build the full sales-led apparatus before you actually know you are sales-led, you have over-built and possibly distorted the experiment. If you lock in pure-PLG minimalism before you know whether the enterprise motion is real, you may under-build the thing that turns out to be the business. The honest answer here is that *during genuine motion uncertainty, the right move is lightweight, reversible, deliberately provisional governance* — enough to prevent egregious drift, not so much that it locks in a build the company will have to tear out. The framework's "motion first" rule assumes the motion is knowable; when it genuinely is not yet, premature governance commitment is its own mistake.

**Counter 5 — The taxonomy itself is a simplification, and real motions are messier than three labels.** PLG, sales-led, hybrid is a useful taxonomy, but real go-to-market motions increasingly do not sit cleanly in one box: product-led sales, sales-assisted PLG, community-led growth, usage-based and consumption motions, partner/channel-led motions, and various blends. A founder who treats the three labels as exhaustive and mutually exclusive may force their actual, messier motion into the nearest label and then derive governance from the *label* rather than from the *reality*. The deeper principle survives — governance is derived from how you actually sell — but the *three-label version* of the principle is a simplification, and over-relying on the labels rather than on a clear-eyed description of the real selling motion is a way to get the derivation subtly wrong.

**Counter 6 — Even correctly-matched governance can be defeated by culture and incentives.** The framework is structural — it tells you what apparatus to build for what motion. But a structurally perfect sales-led governance stack can still fail if the *culture* treats the deal desk as the enemy, if *comp* pays full freight on deep discounts, or if *leadership* routinely overrides the matrix for pet deals. Conversely, a structurally minimal PLG governance can still fail if the founder personally keeps saying yes to custom deals. The thesis correctly says governance is derived from motion — but a founder who thinks "I matched the structure to the motion, therefore I'm done" has missed that governance is also a *behavioral and cultural* achievement, not only a structural one. The structure is necessary; it is not sufficient.

**The honest verdict.** The core thesis holds: discount governance should be derived from the go-to-market motion, not designed in the abstract, and the over-build / under-build failures are real and expensive. But the thesis is a *thinking tool*, not a rigid rulebook. It oversimplifies when: the "PLG" label hides a real enterprise tail that needs its own governance; price-integrity philosophy hardens into deal-losing dogma; the motion label becomes an excuse to defer needed governance; the motion is genuinely unclear and premature commitment locks in the wrong build; the three-label taxonomy gets mistaken for the messier reality; or the founder treats structural matching as sufficient when culture and incentives also have to be right. The disciplined application is: use the motion to *derive* the governance, but stay honest about what the motion actually is (including its tails and its in-transition messiness), stay willing to revisit as the motion clarifies, and remember that the structure is necessary but not sufficient. The thesis is right. Applied without judgment, it still fails.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a SaaS business in 2027? (Foundational motion-selection context for new founders.)
- **q9502** — How do you start a B2B software company in 2027? (Go-to-market motion design baseline.)
- **q9530** — How should a founder design a discount-authority matrix? (Deep dive on the core sales-led governance mechanism referenced throughout.)
- **q9531** — What does a deal desk actually do, and when do you need one? (Deep dive on the deal-desk function in the sales-led stack.)
- **q9532** — How do you set a margin floor for discounting? (Unit-economics derivation of the sales-led margin floor.)
- **q9533** — How do you build discount bands by deal size? (Calibration detail for the sales-led governance stack.)
- **q9534** — What is a strategic-exception lane and how do you keep it from being abused? (The pressure-valve element of sales-led governance.)
- **q9535** — How do you run a quarterly discount-governance review? (The feedback-loop element of the sales-led stack.)
- **q9537** — How do you fence a hybrid go-to-market motion's two pricing regimes? (Deep dive on the hybrid fence design.)
- **q9538** — How do you govern the PLG-to-sales-led graduation point? (Deep dive on graduation-point governance.)
- **q9539** — How do you keep enterprise discounts from contaminating PLG published pricing? (The hybrid contamination problem in depth.)
- **q9540** — How do you design CPQ approval rules? (The enforcement-layer tooling of sales-led governance.)
- **q9541** — How do you build a sales comp plan that protects margin? (Margin-based commission, discount-tiered rates, clawbacks.)
- **q9542** — How do you price an Enterprise "contact us" tier? (Pricing-architecture detail for the hybrid top.)
- **q9543** — How do you transition a PLG company into a hybrid motion? (The motion-evolution path and its governance implications.)
- **q9544** — How do you add a self-serve tier to a sales-led company without breaking it? (The reverse motion-evolution path.)
- **q9545** — What pricing architecture does a PLG motion require? (The published-tier foundation under PLG governance.)
- **q9546** — What pricing architecture does a sales-led motion require? (The negotiable-architecture foundation under sales-led governance.)
- **q9520** — How do you measure discount drift? (The under-build symptom and how to catch it.)
- **q9521** — How do you diagnose whether your RevOps investment matches your stage? (The fit-diagnostic logic applied broadly.)
- **q9522** — When should a founder hire a CRO, and from what background? (The over-build hire-mismatch risk.)
- **q9510** — How do you choose between PLG and sales-led as a founding GTM motion? (The motion-selection decision upstream of governance.)
- **q9511** — What is product-led sales (PLS) and how does it differ from hybrid? (The blurring-motions outlook context.)
- **q9512** — How does usage-based pricing change discounting? (The AI-era and consumption-pricing outlook context.)
- **q9601** — How will AI change go-to-market motions by 2030? (The 5-year-outlook AI context.)
- **q9602** — How will AI change RevOps and deal desks by 2030? (AI deal-desk and discount-guidance tooling outlook.)

`;

const tags = ['revops','discount-governance','go-to-market','plg','sales-led','hybrid-motion','deal-desk','pricing-strategy','founder-strategy','2027'];

const sources = [
  { title: 'OpenView Partners — Product Led Growth research and the PLG Index', url: 'https://openviewpartners.com' },
  { title: 'SaaStr (Jason Lemkin) — discounting, deal desks, and sales-led discipline', url: 'https://www.saastr.com' },
  { title: 'Gartner — Configure, Price, Quote (CPQ) Application Suites research', url: 'https://www.gartner.com' }
];

const notes = {
  s6: 'Added 20 cited sources spanning the motion-to-governance relationship: PLG research (OpenView PLG Index, Kyle Poyar, Bessemer State of the Cloud), sales-led discount governance (SaaStr, Winning by Design, RevOps Co-op), CPQ and tooling (Gartner CPQ Magic Quadrant), pricing-architecture and motion linkage (a16z, Forrester, McKinsey distinct-capabilities research), margin and discount-leakage data (Bain, Profitwell/Paddle, Tomasz Tunguz), hybrid case-study material (HubSpot, Atlassian, Slack/Notion/Figma/Datadog PLG-to-enterprise journeys), comp-as-governance-lever research (Alexander Group, Korn Ferry), and founder-operator practitioner sources (First Round Review, Pavilion, Lenny\'s Newsletter).',
  s7: 'Added comprehensive numerical structure: the 3-motion taxonomy plus 2 sales-led sub-archetypes; PLG governance footprint (1-page structure, 1 sanctioned price variation, 0 deal-desk headcount, 0 matrix tiers); the 7-component sales-led governance stack enumerated; sales-led calibration by deal profile (transactional vs enterprise, 2 calibrations when running both); hybrid governance (2 fenced regimes, 4 fence-definition options, 2 contamination directions); the 2 mismatch failure modes and the 4-cell quadrant (2 correct, 2 failure); the 5+2-step founder decision sequence and 7-step decision framework; comp connection by motion (discount-irrelevant PLG / primary-lever sales-led / 2 regimes hybrid); tooling by motion; and the 4 outlook forces.',
  s8: 'Added 6-element counter-case stress-testing the core thesis: (1) a "PLG" company with a meaningful enterprise tail genuinely needs some sales-led governance for that tail; (2) "we\'re PLG so we don\'t discount" hardening into dogma that loses winnable enterprise deals; (3) a founder using the motion label as an excuse to defer governance the business actually needs; (4) when the motion is genuinely unclear or mid-transition, premature governance commitment locks in the wrong build — lightweight reversible provisional governance is the honest answer; (5) the three-label taxonomy is itself a simplification and real motions (PLS, sales-assisted PLG, community-led, usage-based, channel-led) are messier; (6) even correctly-matched governance is defeated by culture and incentives — structure is necessary but not sufficient. Honest verdict: the thesis is a thinking tool, not a rigid rulebook.',
  s9: 'Cross-linked 25 related Pulse entries: SaaS/B2B founding context (q9501/q9502), the sales-led governance-component deep dives (q9530-q9535 — authority matrix, deal desk, margin floor, bands, exception lane, quarterly review), the hybrid deep dives (q9537-q9539 — fencing, graduation point, contamination), tooling and comp (q9540/q9541/q9542), motion-evolution paths (q9543/q9544), pricing architecture by motion (q9545/q9546), the fit-diagnostic and mismatch entries (q9520/q9521/q9522), motion-selection upstream (q9510/q9511/q9512), and the AI/2030 outlook entries (q9601/q9602).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the go-to-market-motion to discount-governance relationship for founders, CROs, RevOps leaders, and deal-desk leads. Two mermaid diagrams (the motion-to-governance mapping showing PLG -> minimal governance / sales-led -> full apparatus / hybrid -> two fenced regimes; and the mismatch quadrant showing motion x governance-build with the 2 correct cells and the 2 failure cells of over-built PLG and under-built sales-led). Full coverage: the core thesis that governance is derived from motion not designed in a vacuum; the three motions defined with each one\'s structural relationship to discounting; PLG governance philosophy as restraint and price-integrity defense; what PLG governance actually means (published-pricing discipline, annual incentive, promo discipline, one-off-deal resistance, deliberate non-construction of apparatus); the PLG slide-into-sales-led risk and the discipline of naming it; sales-led governance philosophy as a full construction project; the 7-component sales-led governance stack; sales-led calibration to deal profile (transactional light-and-fast vs enterprise deep-and-central); hybrid as the hardest case requiring two fenced regimes; the hybrid contamination problem in both directions and the fencing required; hybrid graduation-point governance; the founder\'s motion choice driving the build; the two common mismatches (sales-led governance on a PLG motion = over-build; no governance on a sales-led motion = under-build); the motion-evolution dimension and governance lagging the motion; pricing architecture as the foundation governance sits on; the comp connection by motion; the tooling by motion; measuring governance fit with the over-build/under-build diagnostic; the founder\'s decision sequence (motion first, never build governance in the abstract); 5 real-world scenarios; the 7-step decision framework; the 5-year outlook (motions blurring, more hybrid, usage-based and AI-era pricing, AI changing motion economics); and a 6-element counter-case on when deriving governance purely from the motion oversimplifies.'
};

runPolish({ id: 'q9536', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
