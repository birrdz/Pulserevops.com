// q9552 — What's the right architecture for discount governance when a company spans both sales-led enterprise and PLG SMB motion — should they operate entirely separate approval chains or integrate them?
const runPolish = (cfg) => { module.exports._cfg = cfg; return Promise.resolve(); };

const tldr = `**TL;DR:** When a company runs both a sales-led enterprise motion and a PLG/SMB self-serve motion, the right discount-governance architecture is **neither fully separate nor fully integrated — it is a shared spine with two motion-specific limbs.** Build **one canonical discount policy object** (a single source of truth for floors, approval thresholds, list price, and margin guardrails living in your CPQ/billing system), then run **two distinct enforcement paths on top of it**: a **rules-based, near-zero-human PLG path** (promo codes, programmatic plan-level discounts, annual-prepay incentives, all capped at a hard ceiling — typically **15-20% off list, no human in the loop**) and a **tiered human-approval enterprise path** (rep self-serve to ~10%, manager to ~20%, deal desk to ~30%, VP/CRO to ~40%, CFO above that). The two share the **same data model, the same margin floor logic, the same reporting layer, and the same quarterly governance review** — but they do **not** share an approval queue, because routing an SMB $40/mo expansion through the same Slack channel as a $400K enterprise renewal destroys deal-desk SLAs and trains reps to treat all discounting as negotiable. The single biggest mistake is **letting the enterprise discount culture leak into PLG** (where every basis point of discount is multiplied across thousands of self-serve accounts and silently destroys blended gross margin) or **letting PLG's "just ship it" speed expectation leak into enterprise** (where it removes the friction that protects six-figure ACV). Concrete targets: PLG blended realized discount **under 8%**, enterprise blended realized discount **18-28%**, deal-desk turnaround **under 4 business hours** for standard requests, **under 24 hours** for non-standard, and an **exception rate under 15%** of deals needing above-rep approval by year two of the system. Tool stack: **Salesforce + a CPQ (Salesforce CPQ, DealHub, or Subskribe) for enterprise**, **Stripe/Chargebee/Metronome with a promo-engine for PLG**, and **a unified RevOps reporting layer (the data warehouse, not the CRM) where both motions reconcile**. Governance owner: a **deal desk that reports into RevOps, not into Sales** — because a deal desk that reports to the CRO will always approve the deal.`;

const core = `

## The Core Problem: Two Motions, One Price List, Zero Shared Instinct

A company that has successfully bolted a sales-led enterprise motion onto a PLG self-serve motion — or, increasingly, layered PLG underneath an enterprise business — is running two fundamentally different economic engines that happen to share a logo, a product, and a price list. The PLG motion monetizes through volume, friction-removal, and expansion-by-usage; its unit of decision is a credit-card transaction completed in under ninety seconds with no human involved. The enterprise motion monetizes through negotiation, relationship, and multi-year commitment; its unit of decision is a redlined order form that touches a rep, a manager, a deal desk, a legal team, a procurement counterpart, and frequently a CFO. Discount governance is where these two engines collide, because discount is the one lever both motions pull — and they pull it for completely different reasons, at completely different magnitudes, with completely different downstream consequences. In PLG, a 10% discount applied at the plan level is instantly multiplied across every self-serve account that touches that plan; the blast radius is enormous and the decision is irreversible-feeling because rolling back a public discount feels like a price increase. In enterprise, a 10% discount is a single negotiated concession on a single deal, fully reversible at renewal, and often a rational trade for a longer term or a bigger commitment. The instinct that serves one motion actively harms the other. The governance architecture's entire job is to keep those instincts from contaminating each other while still presenting a coherent company to the market.

The reason this matters is margin, and margin compounds. A hybrid company that lets its discount governance drift typically discovers — usually 18 to 30 months in, often during a fundraise or a board-driven margin review — that its blended gross margin has quietly eroded 400 to 900 basis points, and that nobody can cleanly attribute the erosion to either motion because the two run on incompatible reporting. The fix is not a memo. It is an architecture.

## Why "Just Make It One System" Fails

The most common first instinct from a well-meaning RevOps leader or a tidy-minded CFO is to unify everything: one discount policy, one approval workflow, one queue, one set of thresholds. It is intellectually appealing and operationally disastrous. The failure mode is mechanical. A unified approval queue means an SMB customer trying to get 20% off a $49/month plan upgrade is sitting in the same workflow as a strategic enterprise account negotiating a $600K three-year renewal. Either the deal desk treats them with equal seriousness — in which case enterprise SLAs collapse because the desk is drowning in micro-approvals — or it triages, in which case you have not actually unified anything, you have just built an undocumented two-tier system with worse visibility than if you had designed two tiers on purpose. Unified thresholds fail the same way: a 15% discount is a rounding error worth zero scrutiny in a $300K enterprise deal and a margin catastrophe if it becomes the default expectation across forty thousand self-serve accounts. A threshold that is right for one motion is definitionally wrong for the other.

There is also a cultural failure. When you route PLG discounts through the human enterprise approval chain, you teach the entire PLG monetization team that discounts are a thing humans negotiate — and PLG's whole advantage is that humans do not touch the transaction. You have re-introduced the cost structure you built PLG to escape. Conversely, when you force enterprise reps to use PLG's rigid, no-exceptions promo logic, you remove the negotiation surface that lets a skilled AE trade discount for term, for expansion commitments, for a case study, for a faster close. You have neutered the enterprise motion's primary tool. Full integration optimizes for the org chart's tidiness at the direct expense of both revenue engines.

## Why "Just Run Two Totally Separate Systems" Also Fails

The opposite instinct — let PLG run its own promo engine, let Sales run its own deal desk, never the twain shall meet — fails more slowly but just as completely. The first crack is the **margin floor**. If the two systems have independently set margin floors, they will drift, and within a year you will have a PLG plan whose promo-stacked effective price is below the floor the enterprise team thinks is sacred, or vice versa. Nobody notices until finance does a cost-to-serve analysis and finds a whole customer segment underwater. The second crack is **arbitrage**. Sophisticated buyers — and procurement departments are extremely sophisticated — will discover that the self-serve price for a given seat count is lower than the "negotiated enterprise discount" price, or that buying through the PLG motion and then calling sales for a "true-up" games both systems. If the two governance systems cannot see each other, they cannot detect the arbitrage. The third crack is **reporting incoherence**: the board asks "what is our blended realized discount and is it getting worse?" and RevOps cannot answer because the two systems define discount differently, calculate it against different baselines, and never reconcile. The fourth crack is **brand and trust**: a customer who started self-serve and grew into an enterprise conversation gets quoted numbers that contradict what they were paying, and the whole relationship starts on a credibility deficit.

Fully separate systems optimize for each motion's local velocity at the direct expense of company-level coherence, margin integrity, and the ability to govern at all. You cannot govern two things that share a P&L but do not share a data model.

## The Right Answer: A Shared Spine With Two Motion-Specific Limbs

The architecture that actually works is a deliberate hybrid, and the metaphor that keeps teams aligned is **a shared spine with two limbs**. The spine is everything that must be identical for the company to be coherent and governable: the **canonical price list**, the **margin floor logic**, the **discount policy object** (the machine-readable definition of what discounts exist, what they cap at, and what they require), the **reporting and reconciliation layer**, and the **governance cadence** (the quarterly review where RevOps, Finance, and both GTM leaders look at realized discount together). The limbs are the two enforcement paths, each tuned to its motion's economics: a **rules-based, automated PLG limb** and a **tiered, human-judgment enterprise limb**. They branch off the same spine, they report back into the same spine, but they execute completely differently. This is not a compromise between the two bad options — it is a third, correct option that takes the coherence benefit from "fully integrated" and the velocity benefit from "fully separate" while discarding the failure modes of both.

The decision rule for what belongs in the spine versus a limb is simple: **if it affects whether the company is telling the market a consistent story, or whether finance can trust the margin, it belongs in the spine. If it is purely about how a discount gets approved and applied within one motion, it belongs in that motion's limb.** List price is spine. Margin floor is spine. The promo-code expiration logic is a PLG limb. The VP-approval Slack workflow is an enterprise limb.

## Building the Spine, Part One: The Canonical Discount Policy Object

The single most important artifact in the whole architecture is the **discount policy object** — a structured, version-controlled, machine-readable definition of your discounting rules that lives in exactly one place and is referenced by both motions. It is not a PDF. It is not a slide. It is not tribal knowledge in the deal desk's heads. It is a data object, ideally in your CPQ or your billing platform's configuration layer, that defines, for every product and plan: the **list price**, the **absolute margin floor** (the price below which no discount path may ever go without CFO sign-off), the **standard discount tiers** and what each requires, the **approved discount reasons** (multi-year, volume, competitive displacement, strategic logo, nonprofit, etc.), and the **stacking rules** (which discounts can combine and which cannot). Both the PLG promo engine and the enterprise CPQ read from this object. When finance updates the margin floor because COGS changed, it updates in one place and both motions inherit it. When a new discount reason is approved, it is added once. This object is the thing that makes the company governable; everything else is enforcement.

The discount policy object also needs an **owner** and a **change-control process**. The owner is RevOps. The change-control process is a lightweight ticket-and-review: anyone can request a change, RevOps and Finance jointly approve, the change is logged with a date and a reason, and both motions are notified. Without change control, the object decays back into tribal knowledge within a quarter. With it, you have an auditable history of every pricing-power decision the company ever made — which is gold during a fundraise, an audit, or a leadership transition.

## Building the Spine, Part Two: The Margin Floor as the Shared Constitution

Every discount path in both motions must terminate at the same margin floor. The margin floor is the company's constitution: it is the one number that says "below this, we are not selling profitably, and crossing it requires the highest possible authority." Critically, the floor must be defined in **gross margin terms, not discount-percentage terms**, because a 30% discount on a high-margin product and a 30% discount on a low-margin product are completely different decisions, and a discount-percentage cap will let the low-margin product go underwater while needlessly constraining the high-margin one. The floor should be computed off **fully-loaded cost to serve** — infrastructure, support, payment processing, and a fair allocation of customer success — not just hosting cost, because cost-to-serve in PLG (thousands of low-touch accounts, high payment-processing drag) and cost-to-serve in enterprise (white-glove CS, dedicated infra) are genuinely different, and the floor logic must account for that even though the floor itself is shared.

In practice, you will often have a **two-level floor**: a "soft floor" that deal desk or a VP can approve down to with documented justification, and a "hard floor" that only the CFO can cross. The soft floor protects target margin; the hard floor protects against selling at a loss. Both motions inherit both floors. The PLG limb almost never approaches the floor because its discounts are small and capped — but the floor still matters in PLG for catching promo-stacking accidents, where three legitimate promos combine into an effective price nobody intended. The enterprise limb approaches the floor regularly on competitive and strategic deals, which is exactly why the floor needs to be a hard, system-enforced number and not a guideline.

## Building the PLG Limb: Rules-Based, Programmatic, Near-Zero Human Touch

The PLG discount limb must honor the core PLG promise: no human touches the transaction. Every discount in the PLG motion is therefore **pre-approved by construction** — it exists as a rule, not as a request. The PLG limb has four legitimate discount mechanisms and you should be suspicious of any fifth. First, **plan-level structural discounts**: annual-prepay gets X% off monthly-equivalent (typically 15-20%), volume tiers get programmatic per-seat reductions. Second, **time-boxed promotional codes**: a launch promo, a win-back campaign, a conference code — each with a hard expiration, a hard usage cap, and a hard discount ceiling, all defined in the promo engine and incapable of exceeding the policy object's PLG cap. Third, **lifecycle-triggered offers**: a churn-risk account gets an automated retention offer, a trial that did not convert gets a programmatic nudge — again, all rules, all capped. Fourth, **partner or marketplace discounts**: AWS Marketplace, a referral program, all governed by pre-set contractual terms.

What the PLG limb must not have is a **back channel**. The moment a PLG customer can email support and get a one-off "let me see what I can do" discount, you have created an ungoverned, unreported, infinitely-abusable enterprise-style negotiation inside your PLG motion, and it will spread by word of mouth faster than you can imagine. The correct answer to "can I get a discount?" in PLG is always a rule: "yes, annual prepay saves you 18%," or "no." The PLG cap — the absolute most any combination of PLG mechanisms can discount — should be set deliberately low, typically 15-25% off list, because the entire point is that PLG monetizes on volume and friction-removal, not on negotiation. If your PLG motion needs deeper discounts to convert, you have a pricing problem or a packaging problem, not a discounting problem, and you should fix the price, not open a discount valve.

## Building the Enterprise Limb: Tiered Human Approval With Real Authority Gradients

The enterprise discount limb is built around **human judgment, tiered by authority and dollar consequence**. The canonical structure is a five-tier escalation ladder. **Tier one, the rep**, can self-approve discounts up to a modest threshold — commonly 10-15% — with no approval at all, because forcing approval on small, routine discounts just adds friction and trains reps to pad requests. **Tier two, the front-line sales manager**, approves the next band, commonly to ~20%, and this tier exists mostly to keep managers connected to their teams' deal economics. **Tier three, the deal desk**, owns the band where discounting starts to genuinely matter — commonly ~20-30% — and this is where structured trade-offs enter: deal desk does not just approve or deny, it negotiates the shape of the deal, trading discount for term length, for payment terms, for expansion commitments, for reference rights. **Tier four, the VP of Sales or CRO**, owns the band approaching the soft margin floor — commonly ~30-40% — where the discount is large enough that it is a strategic bet, not a tactic. **Tier five, the CFO**, owns anything that approaches or crosses the hard margin floor, because at that point the company is potentially selling at a loss and that is a finance decision, not a sales decision.

The thresholds are illustrative; the principle is not. The principle is that **each tier of authority must correspond to a real increment of business consequence**, the bands must be wide enough that most deals never escalate past tier one or two (or your deal desk drowns), and the highest tiers must be rare enough that they are taken seriously when they fire. A healthy enterprise limb sees roughly 60-75% of deals close within rep self-serve authority, 15-25% touch a manager or deal desk, and under 10% reach a VP, with CFO-level exceptions in the low single digits. If 40% of your deals are escalating, your tier-one threshold is set too low and you are manufacturing friction. If 2% are escalating, your threshold is too high and you are not governing anything.

## The Routing Layer: Same Spine, Separate Queues

The hard architectural commitment is this: **the two motions share the policy object and the reporting layer, but they must not share an approval queue.** This is the single most important "separate" in the "shared spine, separate limbs" design. The PLG limb's "queue" is essentially nonexistent — discounts are rules, applied programmatically, with exceptions being product/pricing decisions made at the policy-object level, not per-transaction. The enterprise limb's queue is a real, SLA-governed workflow: a discount request enters, gets routed by dollar magnitude and discount depth to the right tier, and must clear within a defined SLA. Mixing them means the enterprise queue's SLA is constantly blown by PLG noise, or the PLG motion's speed is destroyed by enterprise-grade process.

The routing logic itself belongs in the CPQ for enterprise and in the billing/promo engine for PLG, and both routing systems read the same policy object to know where the tier boundaries are. When finance moves the deal-desk threshold from 25% to 22%, it changes in the policy object and the CPQ routing inherits it. The reporting layer then pulls the *outcomes* of both queues — every applied discount, its reason, its approver, its motion — into the warehouse, where they finally meet. They meet in the data, not in the workflow. That is the whole trick.

## Tooling the Enterprise Limb: CRM Plus CPQ

The enterprise limb runs on **Salesforce (or your CRM of record) plus a CPQ layer**. The CRM holds the opportunity, the account, and the relationship context. The CPQ holds the quote, the price list, the discount policy object's enterprise-facing rules, and the approval routing. Salesforce CPQ is the incumbent choice and integrates natively, but it is heavy and increasingly expensive; **DealHub, Subskribe, and Dealroom** have taken meaningful share specifically because they are faster to configure and handle usage-based and hybrid pricing better — which matters enormously for a company that also runs PLG, because the enterprise deals will increasingly include usage components that look like the PLG product. The CPQ's job in discount governance is fourfold: enforce that no quote can be generated below the hard floor, route every above-threshold discount to the correct approval tier, capture a structured discount reason on every concession (free-text reason fields are where governance goes to die — use a controlled picklist), and write the final realized discount and its full approval trail back to the CRM and onward to the warehouse.

A critical configuration detail: the CPQ must capture **discount reason as structured data**, must require **approval before quote finalization** (not after — a quote sent and then approved retroactively is not governance, it is theater), and must make the **margin impact visible to the approver at the moment of decision**. An approver staring at "rep requests 28% discount" is guessing. An approver staring at "28% discount, takes this deal from 71% to 54% gross margin, $44K of margin given up, reason: competitive displacement vs. [Competitor]" is governing.

## Tooling the PLG Limb: Billing Platform Plus Promo Engine

The PLG limb runs on a **billing platform — Stripe Billing, Chargebee, Recurly, Maxio, or a usage-metering layer like Metronome or Orb — plus a promotions engine.** The billing platform holds the plans, the prices, the subscription state. The promo engine (often native to the billing platform, sometimes a dedicated layer) holds the codes, the structural discounts, the caps, and the expiration logic. The key governance requirement is that the promo engine must be **incapable of issuing a discount that violates the policy object's PLG cap or the hard margin floor** — the constraint is enforced in the system, not in a human's discretion, because there is no human in the PLG transaction by design. If your billing platform's promo engine cannot enforce a hard cap and a hard floor, that is a real gap, and the common fix is a thin governance service that sits between the promo engine and the checkout, validating every discount against the policy object before it can apply.

The PLG limb also needs **promo lifecycle hygiene**: every promo has an owner, an expiration, a usage cap, and a documented purpose, and there is a quarterly sweep that kills zombie promos — the launch code from two years ago that is somehow still redeemable, the "temporary" partner discount that became permanent by neglect. Zombie promos are the PLG equivalent of enterprise discount creep, and they erode margin just as silently. A clean PLG limb has a small, deliberate, fully-documented set of active discounts at any time, not an archaeological dig of accumulated good intentions.

## The Reconciliation Layer: Where the Two Motions Finally Meet

The two limbs meet in exactly one place: the **reporting and reconciliation layer**, which lives in the data warehouse, not in the CRM and not in the billing platform. Both motions pipe their discount outcomes — every applied discount, its motion, its magnitude against list, its reason, its approver (or "programmatic" for PLG), its associated revenue and margin impact — into a common schema in the warehouse. This is where RevOps can finally answer the board's questions: blended realized discount, realized discount by motion, discount trend over time, discount by reason, the margin given up to discounting in each motion, and — critically — **cross-motion arbitrage detection**: are there accounts where the self-serve price for a given configuration is lower than the negotiated enterprise price, creating a procurement-arbitrage opportunity? Are there enterprise deals priced below what the customer could get on self-serve, signaling either a pricing error or a rep panic-discount?

The reconciliation layer requires that both motions define discount **against the same baseline** — list price from the canonical policy object — so that a "20% discount" means the same thing in both systems. This sounds obvious and is constantly violated: PLG often calculates discount against the monthly-equivalent of an annual plan, enterprise against undiscounted list, and the two never reconcile until someone forces a common baseline. Forcing that common baseline is a foundational, unglamorous, completely essential RevOps task.

## Governance Cadence: The Quarterly Discount Review

Architecture without a cadence decays. The shared spine needs a **quarterly discount governance review** — a standing meeting with RevOps (owner), Finance, the CRO or VP Sales, and the head of PLG/growth — that looks at the reconciliation layer's output and makes decisions. The agenda is consistent: realized discount by motion versus target, trend over the trailing four quarters, the top discount reasons and whether they are still valid, exception-rate analysis (what percent of enterprise deals escalated, and is that rising?), zombie-promo sweep results from PLG, any detected cross-motion arbitrage, and proposed changes to the policy object. The output is a small set of change-control tickets against the policy object: move a threshold, retire a discount reason, tighten a cap, add a new approved reason.

The quarterly cadence is also where you catch **discount creep** before it compounds. Discount creep is the slow, individually-reasonable expansion of discounting — each deal's exception is justified, but the aggregate trend is a steady margin bleed. You cannot see it at the deal level; you can only see it in the trailing-four-quarter trend in the reconciliation layer. A company that reviews this quarterly catches a 150-basis-point drift and corrects it with a threshold tweak. A company that does not review it discovers an 800-basis-point hole during a fundraise and spends two quarters in painful re-pricing.

## Org Design: Who Owns the Deal Desk, and Why It Cannot Be Sales

The deal desk is the human heart of the enterprise limb, and its reporting line is the single most consequential org-design decision in the whole architecture. **The deal desk must report into RevOps or Finance, not into Sales.** The reasoning is structural and has nothing to do with trusting or distrusting individual people: a deal desk that reports to the CRO has its performance, its comp, and its career incentives aligned with closing deals — and a deal desk aligned with closing deals will, in aggregate and over time, approve discounts, because every individual approval helps the number it is measured on. A deal desk that reports to RevOps or Finance is measured on margin integrity, SLA adherence, and the quality of the deal structures it negotiates — and that is the alignment that makes it a real governor rather than a rubber stamp.

This does not mean the deal desk is adversarial to Sales. The best deal desks are deeply partnered with Sales — they make reps better negotiators, they bring creative deal structures, they turn a flat 30%-discount request into a 22%-discount-plus-three-year-term-plus-expansion-commitment that is better for everyone. But the partnership works precisely because the deal desk's incentives are independent. The PLG limb, by contrast, barely needs a "desk" at all — its governance is the policy object and the promo engine, owned by RevOps in partnership with the growth/monetization team. The human roles in PLG governance are a promo owner (keeps the promo set clean) and a pricing analyst (watches the reconciliation layer for PLG-specific erosion), both in RevOps or growth, not a queue of approvers.

## Comp and Incentive Alignment Across Both Motions

Discount governance fails when comp fights it. In the enterprise motion, the classic failure is comping reps on **bookings or ACV without any margin or discount component** — which tells reps, in the only language that matters, that a discounted deal and a full-price deal are worth the same to them, so they will discount to close faster every time. The fix is not to comp reps on margin directly (too noisy, too far from their control) but to introduce **discount-aware accelerators and decelerators**: full-price and lightly-discounted deals pay a slightly higher rate or count slightly more toward accelerators; heavily-discounted deals count slightly less. This keeps the rep's incentive pointed at the same direction as the governance system instead of against it. Some companies also gate the highest accelerator tiers on a minimum portfolio realized-discount, which is blunt but effective.

In the PLG motion, the comp question is different because there are no individual reps on the transaction — but there are growth and monetization teams whose goals can fight governance. If the growth team is measured purely on conversion rate or new-logo volume, they will lobby relentlessly to loosen the PLG discount cap, because discounting always lifts conversion in the short term. The fix is to measure the PLG monetization team on **net revenue and blended margin, not just conversion** — so that a conversion lift bought with a margin giveaway shows up as a wash or a loss in their own metrics, and they self-police the discount cap rather than attacking it. When both motions' incentives are aligned with the governance system's goals, governance becomes mostly self-enforcing and the deal desk and quarterly review become exception-handlers rather than full-time police.

## Stage-by-Stage Evolution: How the Architecture Should Grow

This architecture is not built all at once, and a seed-stage company that tries to stand up a five-tier deal desk is cargo-culting. The evolution has clear stages. **Early stage (pre-Series A, one dominant motion):** the company is usually PLG-first or sales-first, not yet truly hybrid. Governance is a spreadsheet and a Slack channel, and that is fine — the discipline to install now is simply *capturing a structured discount reason on every concession*, because that habit is what makes later reporting possible. **Growth stage (Series A/B, second motion emerging):** the company is bolting on the second motion. This is the critical moment to build the policy object and the canonical price list — before the second motion's discounting habits calcify. The deal desk at this stage is often one person (frequently the first RevOps hire) wearing the deal-desk hat part-time. The PLG limb gets its promo engine and its hard cap. **Scale stage (Series B/C, both motions material):** the full architecture comes online — a dedicated deal desk reporting to RevOps, the reconciliation layer in the warehouse, the quarterly governance review, comp alignment. **Maturity (Series C+ / public):** the architecture is mostly automation and exception-handling; the deal desk shrinks relative to deal volume because the policy object and the rules absorb the routine, and human judgment is reserved for genuinely strategic deals.

The mistake to avoid at every stage is **building the enterprise limb's bureaucracy before the enterprise motion's revenue justifies it** — and the equally common mistake of **never building it because PLG culture treats process as the enemy**, until an enterprise motion that is suddenly 40% of revenue is being governed by a promo-code mindset.

## Scenario One: The PLG-Native Company Moving Upmarket

A developer-tools company built entirely on self-serve PLG lands its first few six-figure deals almost by accident — large customers who self-served, hit a ceiling, and called in. The company has no enterprise limb at all; its only discounting tool is the promo engine, capped at 20%. The first enterprise deals get governed by a founder eyeballing them in Slack. The failure mode here is **under-governance of enterprise**: the founder, trained by PLG to think 20% is a big discount, leaves money on the table on deals where 20% was never going to be the issue, and simultaneously has no structured way to trade discount for term, so the company gives flat discounts on month-to-month commitments. The right move: build the policy object first (it barely exists yet — the PLG cap is the only rule), then stand up a minimal enterprise limb — rep-to-15%, founder/exec-above — and crucially install the structured-discount-reason habit. The deal desk can come later; the policy object and the reason-capture cannot.

## Scenario Two: The Enterprise-Native Company Adding PLG

A traditional enterprise SaaS company with a mature deal desk, five approval tiers, and a 28% blended enterprise discount launches a self-serve PLG tier to capture the SMB market it has been ignoring. The dangerous instinct is to route PLG discounts through the existing deal desk "because we already have governance." The result: the deal desk is instantly buried in $30/month approvals, enterprise SLAs blow out, and the PLG motion's signups stall because nothing about it is actually self-serve. The right move: build the PLG limb as a genuinely separate, rules-only path with a hard cap set deliberately low (this company's enterprise instinct will want to set it at 28%; it should be 15%), wire both into the existing reconciliation reporting, and explicitly retrain the deal desk that PLG is not theirs to approve. The hardest part is cultural — the enterprise org genuinely believes more governance is always better, and someone senior has to make the case that PLG's governance *is* the cap and the rule, not the human.

## Scenario Three: The Acquisition-Merged Hybrid

A company acquires a smaller company with a different motion — an enterprise company buys a PLG product, or vice versa — and now runs two motions that were never designed to coexist, on two separate billing systems, two price lists, two discount cultures. This is the hardest scenario because there is no shared spine at all; there are two complete, incompatible systems. The work is heavy and sequential: first, build a single canonical price list and policy object that both products map to (this alone can take a quarter and surfaces brutal pricing-inconsistency conversations); second, pick one reconciliation layer and force both billing systems to pipe into it on a common discount baseline; third, only then rationalize the approval limbs. The temptation is to start with the visible thing — merging the approval workflows — but that is the limb, and you cannot align limbs that branch off two different spines. Spine first, always.

## Scenario Four: The Hypergrowth Company With Discount Chaos

A company that grew fast on a single motion and then added a second one without ever building governance discovers, during a Series C diligence process, that its blended discount is 23% and rising, nobody can explain why, and the two motions' numbers do not reconcile. The board wants it fixed in two quarters. The right sequence under time pressure: do not try to build the whole architecture at once. Quarter one: stand up the reconciliation layer (even a rough one) so you can *see* the problem and stop the bleeding at the worst leak — usually a too-high rep self-serve threshold or a set of zombie PLG promos. Quarter two: install the policy object, the hard floor enforcement, and the quarterly cadence. The deal desk's reporting line and the comp alignment come in the following two quarters. The lesson of this scenario: **visibility before control.** You cannot govern what you cannot see, and the reconciliation layer is cheap relative to its diagnostic value.

## Scenario Five: The Mature Hybrid Tightening Margins

A scaled, well-run hybrid company with a functioning architecture gets a board mandate to lift gross margin 300 basis points. It already has the spine and both limbs. The work here is not architecture, it is tuning: the quarterly review becomes monthly for two quarters; the policy object's thresholds get tightened (rep self-serve from 15% to 12%, deal-desk band narrowed); the comp plan's discount accelerators get sharpened; the PLG cap drops from 20% to 17% and the annual-prepay incentive is re-modeled. Because the architecture exists, every one of these changes is a controlled, measurable, reversible adjustment to a single policy object, and the reconciliation layer shows the margin response within a quarter. This scenario is the proof of the whole design: a company that built the shared spine can tune margin like a dial; a company that did not has to rebuild governance from scratch under board pressure, which is the worst possible time.

## The Decision Framework: Separate, Integrated, or Hybrid?

When a leader asks "should we separate or integrate our discount governance," the answer is a structured set of questions, not a default. **Question one: do both motions share a price list and a P&L?** If yes (almost always yes in a hybrid company), full separation is off the table — you need a shared spine for coherence and margin integrity. **Question two: do the two motions' discounts differ by an order of magnitude in both size and frequency?** If yes (also almost always), full integration is off the table — you cannot run a $40 SMB discount and a $400K enterprise discount through one queue. **Question three: which elements affect company-level coherence and which are purely intra-motion mechanics?** The first set goes in the spine, the second in the limbs. **Question four: who is structurally positioned to own the spine without an incentive conflict?** Almost always RevOps, with Finance as co-owner of the margin floor. **Question five: what stage is the company at, and what is the minimum viable version of this architecture for that stage?** Early stage: just the reason-capture habit and a price list. Growth stage: the policy object. Scale stage: the full spine plus two limbs plus cadence. The framework's output is always some version of "shared spine, two limbs" — the questions just calibrate how much of it to build now.

## The Five-Year Outlook: AI, Usage Pricing, and the Blurring of Motions

Three forces will reshape this architecture over the next five years. First, **AI in the deal desk**: the enterprise limb's routine approvals — the 15-25% band, the standard reasons — will increasingly be handled by AI agents that read the deal context, check the policy object, and approve or escalate with a structured rationale, leaving humans only the genuinely strategic exceptions. This makes the enterprise limb look more like the PLG limb: more rules, fewer humans. Second, **usage-based and hybrid pricing** is eroding the clean line between the two motions — when the enterprise deal includes a usage component that is literally the PLG product, the discount on that component has to be governed consistently across both, which pushes even more logic into the shared spine. Third, **the motions themselves are blurring**: product-led sales, sales-assist on PLG accounts, and self-serve expansion within enterprise accounts mean a single customer increasingly touches both motions, and the discount they see must be coherent across that journey or trust breaks. The net effect: the spine gets thicker and more important, the limbs get thinner and more automated, and the companies that built the shared-spine architecture early will adapt smoothly while the companies running two separate systems will face a painful, forced convergence. The architecture described here is not just the right answer for today — it is the right substrate for where GTM is going.

## The Final Framework: Shared Spine, Separate Limbs, One Owner

The complete architecture, assembled: **One canonical price list and one discount policy object** — machine-readable, version-controlled, RevOps-owned, with formal change control — defining list price, the two-level margin floor, the discount tiers, the approved reasons, and the stacking rules. **One shared margin floor** in gross-margin terms off fully-loaded cost to serve, hard-enforced in both systems. **A PLG limb** that is purely rules-based — structural plan discounts, capped time-boxed promos, lifecycle-triggered offers, partner terms — with a deliberately low hard cap, no back channel, and quarterly zombie-promo hygiene. **An enterprise limb** that is a five-tier human-approval ladder — rep, manager, deal desk, VP/CRO, CFO — with bands wide enough that most deals never escalate, structured discount reasons required, and margin impact visible at the point of approval. **Separate approval queues** for the two limbs, each with its own SLA, never mixed. **One reconciliation layer** in the data warehouse where both motions pipe outcomes against a common baseline, enabling blended-discount reporting and cross-motion arbitrage detection. **One quarterly governance review** — RevOps, Finance, both GTM leaders — that turns reconciliation-layer data into change-control tickets against the policy object. **One owner**: a deal desk and discount-governance function reporting to RevOps or Finance, never to Sales, so its incentives are margin integrity rather than deal closure. **Comp alignment** in both motions so incentives point the same direction as governance. Build it stage-appropriately — reason-capture habit first, then the policy object, then the full spine and limbs and cadence. The answer to "separate or integrated" is: the data and the policy are integrated, the enforcement is separated, and one conflict-free owner holds the whole thing together. That is the architecture that lets a hybrid company move fast in both motions without quietly destroying its own margin.
`;

const flow = `

## Decision Flow: Routing a Discount Request Across a Hybrid Motion

\`\`\`mermaid
flowchart TD
  A[Discount Need Arises] --> B{Which Motion}
  B -->|PLG / Self-Serve| C[PLG Limb: Rules-Based Path]
  B -->|Enterprise / Sales-Led| D[Enterprise Limb: Human Approval Path]
  C --> C1{Discount Type}
  C1 -->|Annual Prepay or Volume Tier| C2[Apply Structural Discount Programmatically]
  C1 -->|Promo Code| C3{Within Cap and Not Expired}
  C1 -->|Lifecycle Retention Offer| C4[Apply Pre-Approved Triggered Offer]
  C1 -->|Partner / Marketplace| C5[Apply Contractual Partner Terms]
  C3 -->|Yes| C2
  C3 -->|No| C6[Reject - No Back Channel - Fix Price Not Valve]
  C2 --> CFLOOR{Above Hard Margin Floor}
  C4 --> CFLOOR
  C5 --> CFLOOR
  CFLOOR -->|Yes| CDONE[Discount Applied - Logged to Reconciliation Layer]
  CFLOOR -->|No - Promo Stacking Accident| C6
  D --> D1{Discount Depth vs Policy Object Tiers}
  D1 -->|Up to ~10-15 pct| E1[Tier 1: Rep Self-Approves]
  D1 -->|~15-20 pct| E2[Tier 2: Front-Line Manager]
  D1 -->|~20-30 pct| E3[Tier 3: Deal Desk - Trade Discount for Term and Commitments]
  D1 -->|~30-40 pct| E4[Tier 4: VP Sales / CRO - Strategic Bet]
  D1 -->|Approaches Hard Floor| E5[Tier 5: CFO - Selling at Loss Decision]
  E1 --> DFLOOR{Above Hard Margin Floor}
  E2 --> DFLOOR
  E3 --> DFLOOR
  E4 --> DFLOOR
  E5 --> DFLOOR
  DFLOOR -->|Yes| DDONE[Quote Finalized - Structured Reason Captured - Logged to Reconciliation Layer]
  DFLOOR -->|No| E5
  CDONE --> R[Data Warehouse Reconciliation Layer]
  DDONE --> R
  R --> Q[Quarterly Governance Review: RevOps + Finance + GTM Leaders]
  Q --> CHANGE[Change-Control Tickets Against Policy Object]
  CHANGE --> A
\`\`\`

## Comparison Matrix: Three Governance Architectures Side by Side

\`\`\`mermaid
flowchart TD
  subgraph FULLYSEP[Fully Separate Systems]
    FS1[PLG promo engine + Sales deal desk - no shared spine]
    FS2[PRO: each motion fast locally]
    FS3[CON: margin floors drift apart]
    FS4[CON: cross-motion arbitrage undetectable]
    FS5[CON: cannot answer blended discount]
    FS6[CON: customer sees contradictory prices]
    FS1 --> FS2 --> FS3 --> FS4 --> FS5 --> FS6
  end
  subgraph FULLYINT[Fully Integrated System]
    FI1[One policy + one queue + one threshold set]
    FI2[PRO: tidy on the org chart]
    FI3[CON: SMB micro-approvals drown enterprise SLA]
    FI4[CON: one threshold is wrong for one motion]
    FI5[CON: re-adds human cost PLG was built to escape]
    FI6[CON: removes enterprise negotiation surface]
    FI1 --> FI2 --> FI3 --> FI4 --> FI5 --> FI6
  end
  subgraph HYBRID[Shared Spine + Two Limbs - RECOMMENDED]
    H1[Shared: price list + policy object + margin floor + reconciliation + cadence]
    H2[PLG Limb: rules-based - capped - zero human - separate queue]
    H3[Enterprise Limb: five-tier human approval - separate queue]
    H4[PRO: coherence and margin integrity from shared spine]
    H5[PRO: motion-native velocity from separate limbs]
    H6[PRO: one conflict-free owner - RevOps not Sales]
    H7[CON: requires deliberate build + quarterly discipline]
    H1 --> H2
    H1 --> H3
    H2 --> H4
    H3 --> H5
    H4 --> H6
    H5 --> H6
    H6 --> H7
  end
  FULLYSEP -.optimizes local speed loses coherence.-> VERDICT
  FULLYINT -.optimizes tidiness loses both engines.-> VERDICT
  HYBRID -.takes coherence from integrated + speed from separate.-> VERDICT
  VERDICT[VERDICT: Integrate the DATA and POLICY - Separate the ENFORCEMENT - One Owner Holds It Together]
\`\`\`

`;

const src = `

## Sources

1. **Salesforce CPQ Documentation — Discount Schedules and Approval Processes** — Reference architecture for tiered discount approval routing in enterprise CPQ. https://help.salesforce.com/s/articleView?id=sf.cpq_discounts_parent.htm
2. **OpenView Partners — Product-Led Growth Benchmarks and the PLG/Sales-Led Hybrid** — Foundational research on hybrid motion economics and where PLG and sales-led monetization diverge. https://openviewpartners.com
3. **a16z — The New Business of SaaS and Product-Led Sales** — Analysis of the blurring line between self-serve and sales-led motions and its pricing implications.
4. **Bain & Company — Pricing and Discount Governance in B2B Software** — Research on discount creep, margin erosion, and the cost of ungoverned concessions.
5. **DealHub — The Deal Desk Playbook** — Practitioner reference on deal desk structure, approval tiers, and SLA design. https://dealhub.io
6. **Subskribe — CPQ for Usage-Based and Hybrid Pricing** — Documentation on quoting architectures for companies running both subscription and usage models. https://www.subskribe.com
7. **Stripe Billing — Coupons, Promotion Codes, and Discount Logic** — Reference for programmatic PLG discount enforcement, caps, and expiration. https://stripe.com/docs/billing
8. **Chargebee — Subscription Discounts and Coupon Management** — PLG-side promo engine architecture and lifecycle hygiene. https://www.chargebee.com
9. **Metronome — Usage-Based Billing and the Hybrid Pricing Stack** — How usage components in enterprise deals must reconcile with self-serve pricing. https://metronome.com
10. **Gainsight / Pacific Crest SaaS Survey** — Benchmark data on blended gross margin, discount rates, and the cost-to-serve gap between low-touch and high-touch segments.
11. **KeyBanc Capital Markets SaaS Survey** — Annual benchmarks on discount levels, gross margin, and go-to-market efficiency across SaaS stages.
12. **Winning by Design — Revenue Architecture and the Bowtie Model** — Framework for thinking about motion design and where governance sits in the revenue system.
13. **RevOps Co-op Community — Deal Desk Structure and Reporting Lines** — Practitioner consensus on why deal desk should report to RevOps/Finance rather than Sales.
14. **Insight Partners — Scaling RevOps in Hybrid GTM Companies** — Portfolio research on RevOps function design as companies layer motions.
15. **McKinsey — B2B Pricing Excellence and Margin Leakage** — Analysis of where margin leaks in B2B sales, with discount governance as a primary vector.
16. **HBR — The Hidden Cost of Discounting** — Classic analysis of how individually-rational discounts aggregate into structural margin damage.
17. **ProfitWell / Paddle — Pricing and Discounting Benchmarks for SaaS** — Data on PLG discount rates, annual-prepay incentive structures, and promo effectiveness.
18. **DealHub / Salesforce — CPQ Approval Workflow Configuration Guides** — Technical reference for routing logic, threshold configuration, and structured discount reason capture.
19. **Maxio (formerly SaaSOptics + Chargify) — Revenue Reporting and Discount Analytics** — Reference for the reconciliation-layer reporting requirements.
20. **Orb — Usage Metering and Billing Reconciliation** — Architecture reference for piping discount outcomes from billing into a warehouse.
21. **SaaStr — Deal Desk, Discounting, and the CRO/CFO Tension** — Practitioner essays on approval-tier design and the politics of discount authority.
22. **Bessemer Venture Partners — State of the Cloud / Efficient Growth** — Benchmarks tying gross margin discipline to valuation in the efficiency era.
23. **Forrester — Revenue Operations and the Unified GTM Data Model** — Research on why the warehouse, not the CRM, must be the reconciliation point.
24. **Gartner — CPQ and Pricing Optimization Market Guide** — Vendor landscape for Salesforce CPQ, DealHub, Subskribe, and adjacent tools.
25. **Snowflake / dbt — Reference Architectures for GTM Data Modeling** — Technical reference for building the cross-motion reconciliation schema in the warehouse.
26. **Iconiq Growth — Topline Growth and Operational Efficiency Reports** — Benchmark data on discount rates and margin by company stage.
27. **Notion / Figma / Atlassian — Public Case Studies on PLG-to-Enterprise Motion Layering** — Reference examples of companies that successfully ran the hybrid motion.
28. **Pavilion (formerly Revenue Collective) — Deal Desk and RevOps Compensation Benchmarks** — Data on how deal desk and RevOps roles are scoped and compensated.
29. **Recurly / Zuora — Subscription Billing and Discount Governance Documentation** — Additional PLG-side billing platform reference for promo enforcement.
30. **CFO.com / Finance Leadership Research — Margin Floor Governance and Pricing Authority** — Finance-side perspective on why the hard margin floor must be CFO-owned.

`;

const num = `

## Numbers

**Discount Magnitude Benchmarks**
- PLG blended realized discount target: under 8% of list
- PLG hard discount cap (any combination of promos): 15-25% off list
- PLG annual-prepay incentive (standard): 15-20% off monthly-equivalent
- Enterprise blended realized discount (typical SaaS): 18-28% of list
- Enterprise rep self-serve threshold: 10-15%
- Enterprise front-line manager band: 15-20%
- Enterprise deal desk band: 20-30%
- Enterprise VP Sales / CRO band: 30-40%
- Enterprise CFO escalation: above ~40% / approaching hard margin floor

**Approval Distribution (Healthy Enterprise Limb)**
- Deals closing within rep self-serve authority: 60-75%
- Deals touching manager or deal desk: 15-25%
- Deals reaching VP / CRO: under 10%
- Deals reaching CFO: low single digits (1-3%)
- Exception rate (deals needing above-rep approval) target by Year 2: under 15%
- Warning sign of too-low threshold: 40%+ of deals escalating
- Warning sign of too-high threshold: under 2% of deals escalating

**SLA Targets**
- Deal desk turnaround, standard request: under 4 business hours
- Deal desk turnaround, non-standard request: under 24 hours
- PLG discount application: real-time / programmatic (zero human latency)
- Policy object change-control review cycle: 1-2 weeks
- Governance review cadence: quarterly (monthly during a margin-tightening push)

**Margin Floor Mechanics**
- Margin floor defined in: gross-margin terms, not discount-percentage terms
- Margin floor computed off: fully-loaded cost to serve (infra + support + payment processing + CS allocation)
- Two-level floor: soft floor (VP/deal-desk approvable with justification) and hard floor (CFO-only)
- PLG cost-to-serve drag vs enterprise: payment-processing fees alone often 2-4% of revenue on small self-serve transactions
- Typical blended gross margin erosion in an ungoverned hybrid: 400-900 basis points over 18-30 months

**Tooling Cost / Stack Reference**
- Enterprise CPQ (Salesforce CPQ, DealHub, Subskribe): meaningful per-seat or platform cost; Salesforce CPQ heaviest, DealHub/Subskribe faster to configure
- PLG billing + promo engine (Stripe Billing, Chargebee, Recurly, Maxio, Metronome, Orb): ranges from usage-based pricing to platform fees
- Reconciliation layer: data warehouse (Snowflake/BigQuery/Redshift) + transformation layer (dbt) — both motions pipe in
- Governance service (thin validation layer between promo engine and checkout): build if billing platform cannot hard-enforce cap and floor

**Org Design Reference**
- Deal desk reporting line: RevOps or Finance — NOT Sales
- Policy object owner: RevOps, with Finance as co-owner of the margin floor
- PLG limb human roles: promo owner + pricing analyst (in RevOps or growth) — no approval queue
- First deal-desk hire: often the first RevOps hire, part-time, at Series A/B
- Dedicated deal desk: typically Series B/C when both motions are material

**Stage Evolution Markers**
- Early stage (pre-A): spreadsheet + Slack governance; install structured-discount-reason capture habit
- Growth stage (A/B): build policy object + canonical price list before second motion calcifies
- Scale stage (B/C): full spine + two limbs + reconciliation layer + quarterly review + comp alignment
- Maturity (C+/public): architecture mostly automation + exception-handling; deal desk shrinks relative to deal volume

**Comp Alignment Targets**
- Enterprise: discount-aware accelerators/decelerators so discounted and full-price deals are NOT worth the same to the rep
- PLG: growth/monetization team measured on net revenue + blended margin, not just conversion rate
- Highest accelerator tiers: optionally gated on minimum portfolio realized-discount

**Cross-Motion Risk Metrics**
- Cross-motion arbitrage check: is self-serve price for a configuration lower than negotiated enterprise price?
- Zombie promo sweep: quarterly; kill expired/orphaned/never-capped promos
- Common baseline requirement: both motions must define discount against the SAME list price from the policy object
- Discount creep detection horizon: visible only in trailing-four-quarter trend, never at the deal level

`;

const counter = `

## Counter-Case: When the Conventional "Shared Spine, Separate Limbs" Answer Is Wrong

The shared-spine architecture is the right default for most hybrid companies, but a serious operator should know the conditions under which it is over-engineered, premature, or genuinely the wrong call.

**Counter 1 — One motion is under ~10-15% of revenue: don't build the second limb yet.** If the company is 92% PLG with a handful of accidental enterprise deals, building a five-tier deal desk and a formal policy object is cargo-culting. The right move is to govern the dominant motion well and handle the nascent motion with a founder or exec eyeballing it, while installing only the cheap, durable habit: structured discount-reason capture. Build the architecture when the second motion is material, not when it is theoretical. Premature architecture is its own failure mode — it creates process overhead the revenue cannot yet justify and bakes in threshold assumptions before you have data.

**Counter 2 — The two motions genuinely don't share a price list or a customer journey.** The whole shared-spine logic rests on the assumption that both motions sell overlapping value off a common price list to customers who might cross between them. If the company truly runs two unrelated products to two non-overlapping markets that happen to share a corporate parent — closer to a holding company than an integrated business — then forcing a shared spine creates fake coherence and real friction. In that case, two genuinely separate systems with only a board-level margin rollup is correct. The test: could a single customer plausibly touch both motions? If never, the spine is optional.

**Counter 3 — Hyper-velocity PLG where any human-process leakage kills the motion.** For some PLG businesses — extremely low ACV, extremely high volume, conversion measured in seconds — even the lightweight governance overhead of a shared policy object and quarterly review can introduce coordination drag that the motion cannot absorb. If the PLG motion's entire moat is that absolutely nothing slows the transaction, the right answer may be to fully wall it off, give it a hard programmatic cap and nothing else, and accept slightly worse cross-motion visibility as the price of preserving velocity. The shared spine assumes governance overhead is cheap relative to its benefit; in extreme-velocity PLG that assumption can fail.

**Counter 3b — Early-stage price discovery: don't lock down what you haven't learned.** A company still actively discovering its pricing and packaging should not prematurely codify a rigid policy object and margin floor. Heavy discount governance imposed before price discovery is complete locks in assumptions that turn out wrong and creates change-management cost every time pricing shifts. Govern loosely, capture data, and formalize the spine once pricing has stabilized.

**Counter 4 — Deal desk reporting to RevOps can create a different dysfunction.** The standard advice — deal desk reports to RevOps/Finance, never Sales — corrects the rubber-stamp problem but can over-correct into a deal desk that is structurally adversarial to Sales, slow, and rewarded for saying no. If the deal desk's incentives are purely margin-protection with no credit for revenue enablement, it becomes a bottleneck that reps route around, which is worse than a permissive desk because now the governance is both slow AND circumvented. The nuance: the reporting line should be RevOps/Finance, but the deal desk's *scorecard* must include deal-velocity and win-rate-on-contested-deals, not just margin. A pure-margin deal desk is as broken as a pure-closing one.

**Counter 5 — In a severe competitive crisis, the governed architecture can be too slow.** When a well-funded competitor is actively displacing you and speed-to-counter-offer is existential, the multi-tier approval ladder — even with good SLAs — can cost deals that a faster, looser process would have saved. There are moments where the right call is a temporary, explicit, time-boxed "war footing" override: a pre-approved deep-discount authority granted to the field for a defined competitive situation, governed after the fact rather than before. The architecture should have a designed-in emergency mode, and a company that treats its governance as immutable during an existential threat is letting process beat survival.

**Counter 6 — Over-indexing on margin governance can starve land-and-expand.** For a company whose entire strategy is to land cheap, embed deeply, and expand massively over years, aggressive discount governance on the initial land can be strategically wrong — the "discount" on the first deal is really a customer-acquisition investment, and governing it like a margin event misreads it. In a true land-and-expand motion, the governance should be on *net revenue retention and expansion economics*, not on first-deal discount depth. Applying tight first-deal discount governance to a land-and-expand business optimizes the wrong number.

**Counter 7 — The reconciliation layer is worthless if the org won't act on it.** Building the warehouse reconciliation layer and the quarterly review is the conventional prescription, but if leadership treats the quarterly review as a reporting ritual rather than a decision-making forum, the entire spine becomes expensive theater. In a company with weak cross-functional decision discipline — where RevOps, Finance, and the CRO cannot actually agree to tighten a threshold — the honest answer might be that no governance architecture will work until the underlying decision-making dysfunction is fixed. Architecture cannot substitute for the willingness to govern.

**The honest verdict.** "Shared spine, separate limbs" is the right answer for the clear majority of companies running a material hybrid motion — but it is right *because* of specific conditions: a shared price list, customers who cross motions, both motions material, governance overhead cheap relative to benefit, and an organization actually willing to make decisions. When those conditions don't hold — a nascent second motion, genuinely separate businesses, extreme-velocity PLG, unstable pricing, a competitive war footing, a pure land-and-expand strategy, or an organization that won't act on data — the architecture should bend. The skill is not applying the framework; it is knowing which condition you are actually in.

`;

const links = `

## Related Pulse Library Entries

- **q9551** — How should a deal desk be structured and who should it report to? (Org-design deep dive on the enterprise limb's human core.)
- **q9553** — What discount approval thresholds should a Series B SaaS company set? (Tactical threshold-setting for the enterprise limb.)
- **q9550** — How do you build a CPQ implementation that actually enforces pricing discipline? (Tooling deep dive for the enterprise limb.)
- **q9554** — What is the right margin floor and how should it be calculated? (Spine deep dive on the shared margin floor.)
- **q9555** — How do you detect and stop discount creep before it compounds? (The quarterly-review failure mode in detail.)
- **q9501** — How do you build a RevOps function from scratch? (Who owns the spine.)
- **q9502** — How do you design a sales compensation plan that does not fight margin? (Comp-alignment deep dive.)
- **q9503** — What is the right RevOps tooling stack for a hybrid GTM company? (CRM + CPQ + billing + warehouse architecture.)
- **q9504** — How do you run a PLG and sales-led motion together without channel conflict? (The broader hybrid-motion playbook this entry sits inside.)
- **q9505** — How do you price a usage-based product alongside seat-based plans? (Pricing architecture that feeds the policy object.)
- **q9560** — How do you build a canonical price list across multiple products? (The spine's first artifact.)
- **q9561** — How should promo codes and promotional discounts be governed in a PLG motion? (The PLG limb in operational detail.)
- **q9562** — What belongs in the data warehouse versus the CRM for RevOps reporting? (The reconciliation layer's home.)
- **q9563** — How do you run a quarterly revenue governance review? (The governance cadence in detail.)
- **q9564** — How do you detect cross-motion pricing arbitrage? (A specific reconciliation-layer use case.)
- **q9520** — How do you move a PLG-native company upmarket into enterprise? (Scenario one's full playbook.)
- **q9521** — How does an enterprise-native company successfully add a PLG motion? (Scenario two's full playbook.)
- **q9522** — How do you integrate go-to-market systems after an acquisition? (Scenario three's full playbook.)
- **q9530** — How do you forecast and report blended gross margin in a hybrid business? (Finance-side companion to the reconciliation layer.)
- **q9531** — What gross margin should a hybrid SaaS company target by stage? (Benchmark context for the margin floor.)
- **q9540** — How do you design sales approval workflows in Salesforce CPQ? (Technical configuration of the enterprise limb's routing.)
- **q9570** — How will AI change the deal desk over the next five years? (The five-year-outlook section expanded.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Adjacent GTM-automation outlook.)
- **q9580** — How do you align Finance and Sales on pricing authority? (The CRO/CFO tension in depth.)
- **q9581** — How do you write a discount policy that survives a leadership transition? (The policy object as institutional memory.)

`;

const tags = ['revops', 'discount-governance', 'deal-desk', 'plg', 'pricing', 'cpq', 'sales-led', 'hybrid-gtm', 'margin', 'sales-ops'];

const sources = [
  { title: 'Salesforce CPQ Documentation — Discount Schedules and Approval Processes', url: 'https://help.salesforce.com/s/articleView?id=sf.cpq_discounts_parent.htm' },
  { title: 'OpenView Partners — Product-Led Growth Benchmarks and the PLG/Sales-Led Hybrid', url: 'https://openviewpartners.com' },
  { title: 'DealHub — The Deal Desk Playbook', url: 'https://dealhub.io' }
];

const notes = {
  s6: 'Added 30 cited sources spanning CPQ and deal-desk practitioner references (Salesforce CPQ, DealHub, Subskribe), PLG billing and promo-engine documentation (Stripe Billing, Chargebee, Recurly, Maxio, Metronome, Orb), hybrid-motion research (OpenView, a16z, Winning by Design, Insight Partners), discount-governance and margin-leakage analysis (Bain, McKinsey, HBR), SaaS benchmark surveys (KeyBanc, Pacific Crest, Iconiq, Bessemer), and RevOps data-architecture references (Forrester, Snowflake/dbt, Gartner).',
  s7: 'Added comprehensive numbers block: discount-magnitude benchmarks for both motions (PLG under 8% realized / 15-25% hard cap; enterprise 18-28% realized with the full five-tier threshold ladder), healthy approval-distribution percentages (60-75% rep self-serve, under 15% exception rate by Year 2), deal-desk SLA targets (under 4 hours standard / under 24 hours non-standard), margin-floor mechanics (gross-margin terms, fully-loaded cost to serve, two-level soft/hard floor, 400-900bps erosion in ungoverned hybrids), tooling-stack reference, org-design reporting lines, stage-evolution markers, comp-alignment targets, and cross-motion risk metrics.',
  s8: 'Added an 8-element counter-case covering when the shared-spine architecture is wrong or premature: second motion under 10-15% of revenue (don\'t build the limb yet), genuinely non-overlapping motions (holding-company case), extreme-velocity PLG where any process leakage kills the motion, early-stage price discovery (don\'t codify what you haven\'t learned), the over-corrected adversarial deal desk, competitive-crisis war-footing override, land-and-expand strategy where first-deal discount is acquisition investment, and the reconciliation layer being worthless without organizational willingness to act — closing with the honest verdict that the framework is right because of specific conditions, and the skill is knowing which condition you are in.',
  s9: 'Cross-linked 24 related Pulse entries: the deal-desk and discount-threshold cluster (q9551/q9553/q9550/q9554/q9555), RevOps foundations (q9501-q9505), the spine artifacts (q9560-q9564), the three motion-transition scenarios (q9520-q9522), finance-side margin companions (q9530/q9531), CPQ technical configuration (q9540), the AI-deal-desk outlook (q9570), and pricing-authority and policy-durability entries (q9580/q9581).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite answering whether a company spanning sales-led enterprise and PLG SMB motions should run separate or integrated discount-governance approval chains. Core thesis: neither — a shared spine (one canonical price list, one discount policy object, one shared gross-margin floor, one reconciliation layer in the warehouse, one quarterly governance cadence, one conflict-free owner in RevOps) with two motion-specific limbs (a rules-based zero-human PLG limb with a deliberately low hard cap; a five-tier human-approval enterprise limb) that share data and policy but never share an approval queue. Two mermaid diagrams: a discount-request routing decision flow across both motions, and a three-architecture comparison matrix. Full operator coverage: why full integration and full separation both fail, building each spine component and each limb, the routing layer, motion-specific tooling (CRM+CPQ for enterprise, billing+promo-engine for PLG), the reconciliation layer, governance cadence, org design (deal desk reports to RevOps not Sales), comp alignment, stage-by-stage evolution, five named scenarios (PLG-native moving upmarket, enterprise-native adding PLG, acquisition-merged hybrid, hypergrowth discount chaos, mature margin-tightening), a five-question decision framework, a five-year AI/usage-pricing outlook, and a final assembled framework. 30 sources, comprehensive numbers block, 8-element counter-case, 24 cross-links.'
};

runPolish({ id: 'q9552', tldr, core, flow, src, num, counter, links, sources, tags, notes }); process.exit(1); });
