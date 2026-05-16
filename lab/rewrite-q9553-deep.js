// q9553 — How should a founder-led or early-stage sales org set up initial discount governance bands before they have reliable churn/NRR data by segment — should they default to conservative enterprise-tight rules or flexible SMB-loose bands?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Do not pick a single default. The correct early-stage discount governance design is a **two-track, deliberately asymmetric band structure** that runs tight on the dimensions that are irreversible and loose on the dimensions that are recoverable. Concretely: set a **rep-level approval band of 0-15% off list** (auto-approved, no desk involvement), a **manager band of 15-25%**, a **founder/CRO band of 25-40%**, and a **hard ceiling at 40%** that requires an explicit written exception memo. That structure looks "SMB-loose" on headline discount percentage — and it should be, because at pre-product-market-fit you are buying logos, references, and usage data, and the cost of a lost deal exceeds the cost of a thin one. But it must be **"enterprise-tight" on four governance dimensions that have nothing to do with the percentage**: (1) **contract term** — never discount below 18% without a 12-month minimum, never below 30% without 24 months or prepay; (2) **discount expiry** — every discount over 20% must carry a written ramp or snap-back to list at renewal, recorded as a CPQ field, not a verbal promise; (3) **non-price concessions** — payment terms, opt-out clauses, custom SLAs, MFN/most-favored-nation language, and security-review carve-outs are **founder-approval-only from day one** because they are the concessions that actually destroy NRR and are nearly impossible to claw back; and (4) **floor protection** — a never-cross gross-margin floor (typically 55-65% for SaaS, lower for usage-based) below which no human can approve a deal without board-level visibility. The reason you cannot wait for churn/NRR data: by the time you have segment-level NRR (18-30 months of cohort maturity), you will have already signed 150-400 customers under whatever ad hoc rules existed, and **the renewal book you inherit is the discount policy you actually had** — not the one written on the wiki. Founders who "stay flexible until the data comes in" almost universally discover that flexible meant "the loudest rep and the most aggressive prospect set the price," producing a renewal base where 35-55% of ARR is below list with no expiry, no term protection, and verbal side-deals nobody documented. The move is: **loose percentages, ruthless structure, everything in CPQ, and a monthly discount-review ritual from deal #1.** Track realized ASP, discount depth distribution, approval-tier mix, and concession frequency as your *leading* indicators — they predict the NRR you will eventually measure 18 months before you can measure it.`;

const core = `

## The Question Behind the Question: Discounting Is Not a Pricing Decision, It Is a Governance Decision

The instinct that frames this question — "should we be enterprise-tight or SMB-loose?" — contains a hidden and damaging assumption: that discount governance is fundamentally about *how big a number a rep can type into a quote*. It is not. The percentage is the most visible part of discounting and the least important part. What actually determines whether an early-stage company's discounting helps or hurts is the **structure** wrapped around the percentage: the term commitment, the expiry mechanics, the non-price concessions that ride along, the margin floor, and the system of record that captures all of it. A founder who obsesses over "is 20% too much?" while letting a rep hand out a 12-month opt-out clause, net-90 payment terms, and a verbal promise that "next year stays at this price" has lost the plot entirely. The 20% is recoverable at renewal. The opt-out clause, the payment terms, and the verbal promise are not.

This reframe matters because it dissolves the false binary in the question. "Enterprise-tight versus SMB-loose" treats discounting as one dial. In reality there are at least five dials, and the right early-stage answer turns some of them hard left and some hard right *simultaneously*. You want loose headline percentages — because pre-PMF you are data-poor and logo-hungry, and a dead deal teaches you nothing while a thin deal teaches you about onboarding, usage, expansion triggers, and support load. But you want savagely tight structure — because structure is what makes a thin deal *temporary* rather than *permanent*. The entire art of early-stage discount governance is decoupling "we gave a discount" from "we permanently impaired this account's economics." Get that decoupling right and aggressive early discounting is a cheap, reversible customer-acquisition subsidy. Get it wrong and every discount is a forever-tax on a renewal book you will spend three years trying to repair.

So the real question is not "tight or loose?" It is: **which dimensions of a deal are reversible, and which are not — and have we built governance that is loose on the reversible ones and immovable on the irreversible ones?** Everything else in this answer is the working-out of that single principle.

## Why You Genuinely Cannot Wait for Churn and NRR Data

The premise of the question — "before they have reliable churn/NRR data by segment" — describes a state that lasts far longer than founders expect, and the temptation to defer governance until the data arrives is the single most expensive mistake in this domain. Here is the timeline math. Segment-level NRR requires cohort maturity: you need customers who have been live long enough to hit at least one full renewal, ideally two, with enough customers per segment that the number is not noise. For a company signing its first customers today, that means **18 months minimum before any NRR figure exists, 24-30 months before it is segment-reliable, and 36 months before it is trend-reliable.** During that entire window, you are signing deals. A company that goes from zero to $3M ARR in 30 months — a perfectly ordinary trajectory — will have signed somewhere between 150 and 600 customers by the time the first credible segment NRR number lands.

Every one of those customers was sold under *some* discount regime. If you did not design one, you got one anyway: the emergent regime where the most discount-aggressive rep, selling to the most price-aggressive prospect, on the last day of the quarter, set the de facto policy. That emergent regime is not random — it is reliably bad, because it is the product of maximum pressure meeting minimum structure. And it compounds: the discounts you grant in months 1-18 become the renewal base you must defend in months 19-48. **Your renewal book is your discount policy made visible.** You do not get to re-decide it once the data comes in. By then it is signed paper.

There is a second, subtler reason waiting fails. NRR is a *lagging* indicator — it tells you what your past discounting did, far too late to change it. But discounting produces *leading* indicators almost immediately: realized ASP versus list, discount-depth distribution, approval-tier mix, concession frequency, and discount-with-no-expiry rate. These are measurable from deal #10. A disciplined early-stage org does not wait for NRR; it governs to the leading indicators and uses them as a 12-18-month-early proxy for the NRR it will eventually measure. The answer to "we don't have the data" is "you have *different* data, available now, and it is the data that actually lets you steer."

## The Core Principle: Asymmetric Bands — Loose on Percentage, Tight on Structure

The central design pattern is **asymmetry**. Symmetric thinking — "be uniformly conservative" or "be uniformly flexible" — produces uniformly bad outcomes. Uniform conservatism kills deals you needed and starves you of learning. Uniform flexibility produces an unmanageable renewal book. The right structure is loose where looseness is cheap and tight where tightness is non-negotiable.

**Loose on headline percentage.** At pre-PMF and early-PMF, the marginal value of a closed deal is unusually high and unusually non-monetary. A new logo gives you a reference, a case study, a usage dataset, a support-load data point, an expansion-path hypothesis, and a competitive-displacement story. The marginal *cost* of discounting that deal 25% instead of 10% is, in cash terms, real but small relative to your burn, and — critically — **recoverable** if the structure is right. So the percentage band should be generous: a rep auto-approving up to 15%, a manager to 25%, a founder to 40%. This will feel "SMB-loose." It is supposed to.

**Tight on the four irreversibles.** The looseness on percentage is only safe because it is fenced by immovable structure on the four dimensions that percentage discounting cannot undo:

1. **Term.** Discount depth must be coupled to commitment length. A steep discount on a month-to-month or annual-with-easy-out deal is a gift; the same discount on a 24-month prepaid commitment is an investment. The band table must make term a *gate*, not a *negotiable*.
2. **Expiry.** Every meaningful discount must carry a written end-state: a ramp, a step-up schedule, or a snap-back to list at renewal — captured as a structured CPQ field, never as prose in an email.
3. **Non-price concessions.** Payment terms beyond net-30, opt-out and termination-for-convenience clauses, custom SLAs, MFN language, security/legal carve-outs, and uncapped liability are founder-approval-only from deal #1. These do not show up in "discount %" reporting at all, which is exactly why they are dangerous.
4. **Margin floor.** A hard gross-margin floor that no individual can cross without board-level visibility. This is the circuit breaker.

The mental model: percentage is the *speed* of the car, structure is the *brakes and seatbelts*. Early-stage you want to be able to drive fast. You achieve that safely by over-investing in brakes, not by driving slow.

## Building the Band Table: Concrete Numbers for a Pre-PMF SaaS Company

A band table is the artifact. It is a single page — ideally a single screen in your CPQ tool — that maps discount depth to approver, to required term, to required structure. Here is a concrete, defensible starting table for an early-stage SaaS company with a list-priced product, before segment NRR data exists:

**Tier 0 — Rep auto-approve: 0-15% off list.** No desk involvement, no manager sign-off. Requires: standard paper, net-30 or better, no non-standard concessions, minimum 12-month term for anything above 8%. Rationale: this is the "friction-free zone." The cost of routing a 10% discount through an approver — in cycle time, in rep morale, in founder attention — exceeds the cost of the discount itself. Most healthy early-stage deals live here.

**Tier 1 — Manager approve: 15.01-25% off list.** Requires: 12-month minimum term, written expiry/snap-back if the discount exceeds 20%, standard paper, payment terms net-30 or better. Manager reviews within one business day (SLA matters — a slow desk trains reps to pre-negotiate around it). Rationale: this is where deals start to need a second set of eyes, but the second set of eyes is a sales manager who lives in the pipeline, not a founder.

**Tier 2 — Founder/CRO approve: 25.01-40% off list.** Requires: 24-month term OR annual prepay, mandatory written ramp or snap-back, explicit margin check against the floor, and a one-paragraph deal rationale ("why this deal, why this depth, what we're buying"). Rationale: 25%+ is a strategic decision, not a tactical one. It should cost the rep a short written justification and the founder five minutes — cheap enough to do quickly, expensive enough to discourage as the default.

**Tier 3 — Hard ceiling: >40% off list.** Requires a formal exception memo, founder + one other approver (co-founder, board member, or eventual head of finance), and explicit acknowledgment that this deal is outside policy. These should be genuinely rare — single digits per year — and each one logged. Rationale: a ceiling that is never hit is too high; a ceiling that is hit constantly is not a ceiling. 40% is a reasonable early-stage line because below it you can still see a path to healthy renewal economics; far below it you usually cannot.

**The floor, separate from the tiers:** a never-cross gross-margin number. For most software businesses this is 55-65% blended; for infrastructure or usage-heavy products it may be lower but it still exists. No tier — not even Tier 3 — auto-permits crossing the floor. Crossing it is a board conversation, full stop.

These numbers are a *starting* table, not gospel. The discipline is not the specific percentages; it is having a written table at all, applying it consistently, and revisiting it monthly against realized data.

## The Reversibility Test: How to Decide What Goes in Which Band

When a new concession type shows up in a deal — and it will, constantly, in the early days — you need a fast, repeatable way to decide whether it belongs in a loose band or a tight one. The test is a single question: **at renewal, can we unwind this unilaterally, or does unwinding it require the customer's active agreement?**

If you can unwind it unilaterally — a temporary discount, a ramped price, a promotional rate with a written expiry — it is *reversible*, and reversible things can live in looser bands. The customer agreed up front that the price moves; moving it is administration, not negotiation.

If unwinding it requires the customer to actively agree to something *worse for them* than the status quo — removing an opt-out clause, lengthening payment terms, dropping a custom SLA, deleting MFN language — it is *irreversible* in any practical sense. The customer will simply decline, and you will have no leverage, because the alternative is losing the account entirely. Irreversible concessions must live in the tightest band regardless of their dollar value, because their dollar value is not the point — their *permanence* is.

This test cuts cleanly through the hardest cases. A 35% discount with a written snap-back to 10% at renewal? Reversible — manageable. A 15% discount with a perpetual MFN clause? The 15% is trivial; the MFN is a forever-liability that caps your pricing power across the entire account and sometimes the segment. The reversibility test correctly flags the second deal as far more dangerous than the first, even though the first has a bigger headline number. Train every approver — and eventually every rep — to run this test instinctively. It is the single highest-leverage mental tool in early-stage deal desk.

## Non-Price Concessions: The Real NRR Killers Nobody Reports

If you only govern the discount percentage, you are governing the visible 40% of the problem and ignoring the invisible 60%. Non-price concessions are the terms that ride along inside a deal, never appear in any "average discount" dashboard, and do the actual long-term damage. Every early-stage founder should be able to recite the list and should make every item on it founder-approval-only from the first deal:

**Payment terms.** Net-60, net-90, quarterly-in-arrears — each one is a discount disguised as a courtesy. Net-90 versus net-30 on a $100K deal is roughly 1-2% of cash value at typical cost of capital, but more importantly it sets a precedent the customer will defend forever and other customers will demand by parity.

**Opt-out / termination-for-convenience clauses.** A 24-month contract with a 30-day opt-out is a month-to-month contract wearing a costume. It destroys the term protection you thought you bought and makes your "committed ARR" fiction.

**Custom SLAs and support tiers.** A bespoke 99.99% SLA or named-CSM commitment given away to close a deal becomes a permanent cost-to-serve drag and a template every future prospect's procurement team will find and copy.

**MFN / most-favored-nation clauses.** "You'll never charge us more than your best price" sounds harmless and is catastrophic — it caps your pricing power, complicates every future negotiation, and can be triggered by deals the signing rep never saw.

**Security, legal, and indemnity carve-outs.** Uncapped liability, unusual indemnification, custom DPAs negotiated away under deadline pressure — these are risk transfers, and risk is the most expensive thing you can give away because it is contingent and unbounded.

**Auto-renewal removal.** Strip the auto-renewal and you have converted a renewal that happens by default into a renewal you must actively re-win. That is a structural NRR tax.

The governance rule is blunt: **none of these are in any rep or manager band, ever, at any company stage, but especially not pre-PMF.** They are founder-only. And critically — they must be *tracked* with the same rigor as discount percentage. A "concession register" in your CRM that logs every non-standard term, by deal, by approver, is not bureaucracy; it is the only way you will ever know what your renewal book actually contains.

## Discount Expiry and Snap-Back: Making Looseness Temporary by Construction

A discount with no expiry is not a discount — it is a permanent list-price reduction for one customer, granted by an individual rep, with no organizational decision behind it. The mechanism that makes aggressive early discounting *safe* is the expiry: the contractual statement of what happens to the price over time. There are three clean structures:

**Ramp.** The price steps up on a schedule written into the original contract: year one at 65% of list, year two at 80%, year three at 95%. The customer signed it; the increase is automatic. Ramps are ideal for genuine "growing into the product" situations and for usage-based products where early consumption is naturally low.

**Snap-back.** The discount applies for the initial term and the price returns to list (or to a defined renewal price) at the first renewal. The customer signed knowing the promotional rate was promotional. Snap-backs are ideal for "we're buying the logo" deals where you want the option to capture full price once the value is proven.

**Promotional with hard end-date.** The discount is explicitly a launch promotion tied to a calendar date or a cohort, not a permanent program. This protects you from the MFN-style "but you gave them that price" argument because the promotion was time-boxed and documented.

The non-negotiable implementation detail: **the expiry must be a structured field in CPQ or the contract, not a sentence in an email or a verbal understanding.** The number of early-stage companies whose "temporary" discounts became permanent purely because nobody wrote down the snap-back is enormous. If the expiry is not a machine-readable field that your renewals process reads automatically 90 days before renewal, the expiry effectively does not exist. The discipline is: no discount over 20% leaves the building without an expiry field populated. That single rule converts "loose percentages" from a liability into a managed, time-boxed customer-acquisition cost.

## Why "Enterprise-Tight" as a Blanket Default Backfires Pre-PMF

It is worth being explicit about why the conservative-default instinct — "let's just be strict, it's safer" — is wrong as a *blanket* policy, even though it is right on the structural dimensions. Blanket enterprise-tightness pre-PMF fails in four specific ways.

**It starves you of learning.** Pre-PMF, the product of a sales motion is not revenue — it is information. Every customer is a probe into onboarding friction, support load, expansion triggers, churn reasons, and competitive dynamics. Tight percentage bands kill marginal deals, and marginal deals are disproportionately *informative* deals — the price-sensitive prospect, the unusual use case, the competitive bake-off. You are buying data, and tight bands make data expensive.

**It mistakes process for control.** Enterprise discount governance — multi-stage approvals, deal desk review boards, quarterly pricing committees — exists because enterprise companies have hundreds of reps and millions in ARR at risk per quarter. A 12-person company copying that machinery gets all the cycle-time cost and none of the benefit. The approval routing *is* the control at scale; pre-PMF, founder attention is the control, and founder attention is cheap to deploy and expensive to bureaucratize.

**It slows cycle time when cycle time is survival.** Pre-PMF, your runway is finite and your iteration speed is your only real moat. A deal desk that adds five business days to every quote is, in runway terms, a tax on the one thing you cannot buy more of. Loose percentage bands with fast approvers preserve velocity.

**It produces false precision.** Enterprise-tight bands assume you *know* what the right price and right discount are. Pre-PMF you do not — you are still discovering willingness-to-pay, segment boundaries, and value metrics. Tight bands enforce a pricing hypothesis you have not yet validated, and they hide the very signal (where do prospects push back, how hard, on what) that would validate or kill it.

The correct reading: enterprise-tightness is right on *structure* because structure protects against irreversible damage, and it is wrong on *percentage* because percentage tightness, pre-PMF, mostly buys you less learning and slower cycles.

## Why "SMB-Loose" as a Blanket Default Backfires Too

Symmetrically, the loose-everything instinct — "we're early, just let reps close, we'll fix it later" — fails just as reliably, and the failure mode is slower-acting and therefore more dangerous because it does not hurt until month 18.

**"Fix it later" is a lie about renewals.** The deals signed loose do not get re-signed when you tighten. They renew on the terms you gave. A blanket-loose first 18 months produces a renewal book where a large fraction of ARR is below list with no expiry — and that book is now your starting point forever.

**Loose bands let the wrong person set price.** Without a band table, the de facto pricing authority is whichever rep is most willing to discount, selling to whichever prospect pushes hardest, at quarter-end. That is not a pricing strategy; it is a pricing accident, and it is reliably biased toward the floor.

**It destroys price integrity inside the customer base.** Customers talk. Procurement teams compare notes. Investors do reference calls. A base where similar customers paid wildly different prices for no defensible reason is a base that will demand parity downward the moment anyone notices — and someone always notices.

**It hides the non-price damage entirely.** Loose-everything cultures do not just over-discount; they hand out opt-outs, payment terms, and custom SLAs because there is no gate. And because nobody is tracking concessions, the founder genuinely does not know the renewal book is impaired until renewals start coming in soft.

**It makes the eventual tightening a crisis.** Going from loose to governed is painful — reps lose latitude they treated as permanent, some pipeline genuinely dies, and it feels like a step backward. Companies that start governed never pay this tax. Companies that start loose pay it during the worst possible window: right as they are trying to scale the sales motion.

So both blanket defaults are wrong. The answer is the asymmetric structure — and the discipline to hold it from deal #1.

## Leading Indicators: The Data You Actually Have Before NRR Exists

The objection "we don't have the data" is true only about NRR. It is false about everything that *predicts* NRR. From your tenth deal onward, you can and must instrument the following leading indicators, all of which move 12-18 months ahead of the NRR they foreshadow:

**Realized ASP vs. list.** The blended ratio of what you actually sold for to list price. If this is drifting down month over month, you are training the market that list is fiction — and you will see it in renewal pricing power later.

**Discount-depth distribution.** Not the average — the *distribution*. A healthy early-stage book has most deals in Tier 0-1 and a thin tail in Tier 2-3. If the distribution is flat or bimodal, your bands are not holding.

**Approval-tier mix.** What share of deals (and of ARR) is being approved at each tier. If 40% of deals are hitting founder approval, either the bands are mis-set or the reps have learned that founders cave — both are governance failures.

**Concession frequency.** From the concession register: how often non-standard terms appear, which terms, on which segments, approved by whom. Rising concession frequency is a direct leading indicator of impaired renewals.

**Discount-with-no-expiry rate.** The share of discounted deals where the expiry field is empty. This should be near zero. Every point above zero is permanent-impairment ARR.

**Quote-to-close by discount tier.** If deeper discounts are not materially improving close rates, you are discounting deals you would have won anyway — pure margin leakage.

**Discount-by-rep and discount-by-source.** Which reps and which lead sources cluster at the deep end. Reveals whether the problem is policy, people, or pipeline quality.

Tracked together, these form a dashboard that lets you steer in real time. They are the answer to the question's premise: you do not lack data, you lack *NRR* — and NRR is the lagging confirmation of what these leading indicators told you a year and a half earlier.

## CPQ and the System of Record: Governance That Isn't in Software Doesn't Exist

A band table on a wiki is a suggestion. A band table enforced in CPQ is a policy. The single highest-leverage operational investment in early-stage discount governance is putting the bands, the approval routing, the required-field gates, and the expiry mechanics into the system where quotes are actually built — whether that is a dedicated CPQ tool, a configured CRM, or, for the very earliest stage, a locked quote template with formula-driven approval flags.

What "in the system" must mean concretely:

**Approval routing is automatic.** A quote at 22% off list cannot be sent until the manager has clicked approve in the tool. The rep cannot route around it. The approval is logged with timestamp and approver.

**Term is a gate, not a field.** If discount > 18% and term < 12 months, the quote is blocked, not warned. Soft warnings are ignored; hard gates are obeyed.

**Expiry is a required field above threshold.** Discount > 20% with an empty expiry/snap-back field cannot be saved. The system makes the discipline unavoidable rather than optional.

**Non-standard concessions are a flagged, routed object.** Selecting "net-60" or "custom SLA" or "opt-out clause" auto-routes to founder approval and writes to the concession register. The concession cannot be invisible.

**The margin floor is a hard stop.** A configuration that would cross the gross-margin floor cannot be approved by anyone in-tool; it requires an out-of-band exception process.

**Realized terms flow to the renewals process automatically.** Ninety days before renewal, the system surfaces the original discount, the expiry mechanic, and any concessions, so the renewal owner is negotiating from fact, not from archaeology.

The reason this matters so much pre-PMF: founder attention is the scarcest resource, and a system-enforced policy spends almost none of it, while a manual policy spends it constantly and still leaks. Early-stage founders who say "we're too small for CPQ" are usually too small for *enterprise* CPQ — they are not too small for a disciplined quote template with enforced gates, and they pay dearly for skipping even that.

## Org and Process: Who Approves What, and the Monthly Discount Ritual

Governance is people and cadence, not just a table. The early-stage org design:

**The founder/CEO or founding CRO is the deal desk.** Pre-PMF you do not hire a deal desk analyst — you *are* the deal desk for Tier 2+ and for all concessions. This is correct and temporary. It keeps you close to the pricing reality of the market, which is irreplaceable founder learning, and it costs you maybe 30-60 minutes a week at the deal volumes of this stage.

**Sales managers own Tier 1 and the band's day-to-day enforcement.** As you add a first sales manager (typically around 4-6 reps), Tier 1 approval and band coaching moves to them. The founder retains Tier 2+ and concessions.

**The first RevOps or finance hire owns the system and the data.** Somewhere between $1-3M ARR, someone owns the CPQ configuration, the leading-indicator dashboard, and the concession register. Before that hire, the founder owns it directly — clumsily, but owned.

**The monthly discount review is a non-negotiable ritual from deal #1.** Thirty to sixty minutes, monthly, founder plus sales leadership: walk the leading-indicator dashboard, review every Tier 2-3 deal and every concession granted, ask "are the bands still right?", and adjust the table explicitly if needed. The point of the ritual is not punishment — it is to keep the policy *alive* and to make band changes deliberate decisions rather than emergent drift. A company that does this from the first ten deals never wakes up at $5M ARR not knowing what its renewal book contains.

**Comp alignment.** The compensation plan must not silently reward discounting. If reps are paid on bookings with no margin or list-realization component, you have built an incentive to discount and a policy that fights it — and incentives win. Even pre-PMF, a modest list-realization or margin modifier in the comp plan, or simply paying commission on net-of-discount ARR rather than gross, aligns the rep with the governance instead of against it.

## Stage-by-Stage Evolution: How the Bands Should Change as Data Arrives

The asymmetric structure is the *starting* state, not the permanent one. As real data accumulates, the bands should evolve deliberately:

**Pre-PMF (0 to ~$1M ARR, 0-18 months).** The structure described above: loose percentages (rep to 15%, manager to 25%, founder to 40%, ceiling 40%), savage structure (term gates, mandatory expiry, founder-only concessions, hard margin floor). The dominant goal is learning and logos with reversibility preserved. The dominant metric is leading indicators, because NRR does not exist yet.

**Early-PMF (~$1-5M ARR, 18-36 months).** Segment NRR data starts to arrive, thin but real. Now you *differentiate the bands by segment*. If SMB cohorts show high churn regardless of discount, you tighten SMB percentage bands and shorten allowable terms there — because for that segment, a thin deal is not an investment, it is a loss. If mid-market cohorts show strong expansion, you may keep or even loosen percentage latitude there while tightening structure, because the land-and-expand math rewards getting in. The single national band table splits into a segmented one.

**Scaling (~$5-20M ARR, 36+ months).** Now you have enough data to run discounting as a genuine optimization problem: discount elasticity by segment, by competitor-present, by deal source. The deal desk becomes a real function with an analyst. The bands become tighter on percentage overall — because you now *know* your prices and your value metric — and the system of governance becomes more sophisticated (approval analytics, win/loss by discount, automated guardrails). The early looseness has served its purpose: it bought the data that now lets you be precise.

**The continuous thread.** The structural disciplines — term coupling, mandatory expiry, founder/exec-only concessions, margin floor, everything-in-CPQ, monthly review — never loosen. They are correct at every stage. Only the *percentage* bands and their *segment differentiation* evolve. That is the practical meaning of "asymmetric": the loose dimension is also the *adjustable* dimension; the tight dimensions are *invariant*.

## Segment Differentiation: When the Data Finally Lets You Split the Table

The most common early-stage error after "no policy at all" is "one policy forever." Once even thin NRR data exists, a single band table across SMB, mid-market, and enterprise is leaving money and safety on the table, because the segments have structurally different economics.

**SMB.** Short sales cycles, lower ACVs, higher gross churn that is often *insensitive* to discount depth (SMBs churn because their own business changed, not because of price). Implication: for SMB, deep discounting rarely buys retention — it just lowers realized ASP on an account that may churn anyway. SMB bands should tighten on percentage as soon as the churn data confirms this, and SMB should lean on shorter terms and self-serve motions rather than negotiated discounts.

**Mid-market.** Longer cycles, meaningful expansion potential, churn that *is* somewhat price- and value-sensitive. Implication: mid-market is where land-and-expand math can justify percentage latitude — a thin initial deal that expands 140% NRR over three years is a great deal. But the structure must be airtight (ramps, expiry, term) because the dollar amounts are large enough that permanence really hurts.

**Enterprise.** Long cycles, large ACVs, high switching costs, low logo churn but high concession risk. Implication: enterprise is where the *non-price concessions* — MFN, custom SLAs, security carve-outs, payment terms — do the real damage, and where percentage discipline matters less than concession discipline. Enterprise deals should run *tightest on structure* and can tolerate moderate percentage latitude *only* when the term and expiry lock it down.

The governance design therefore converges, with data, on: **SMB tightens on percentage, mid-market keeps percentage latitude with airtight structure, enterprise obsesses over concessions.** You cannot know the exact cut-points pre-PMF — but you can know the *shape* of the eventual answer, and you can design the pre-PMF single table so that splitting it later is an evolution, not a teardown.

## The Margin Floor: The One Number That Is Never Negotiable

Among all the bands and gates, one element stands apart: the gross-margin floor. It is not a tier — it is a circuit breaker, and it is the one number in the entire governance system that no individual, including the founder, can override unilaterally.

The floor is defined as the blended gross margin below which a deal stops being a customer-acquisition investment and becomes a structural loss. For most SaaS businesses this sits in the 55-65% range; for infrastructure, usage-heavy, or services-laden products it may be lower, but it always exists and it is always knowable. The discipline: configure it as a hard stop in CPQ, and make any deal that would cross it require an explicit, logged, board-visible exception — not a founder signature, a *board-visible* exception.

Why this severity? Because the floor protects against the failure mode that kills companies rather than merely impairing them. Over-discounting above the floor produces a thin renewal book — a problem, but a survivable one. Discounting *through* the floor, repeatedly, produces unit economics that do not work at any scale, and a company that grows revenue while losing money on the margin is a company that scales itself into the ground. The floor is the line between "we made some thin deals we'll fix at renewal" and "our business model does not function." Those are different categories of mistake, and the floor exists to make absolutely sure you never confuse them.

The floor also has a clarifying organizational effect: it forces the founder to actually *know* their gross margin per deal, which is a number a surprising number of early-stage founders cannot state precisely. The act of setting and enforcing a floor is the act of building the financial instrumentation that everything else in governance depends on.

## Scenario 1: The Logo-Hungry Seed-Stage Startup

A seed-stage developer-tools company, $0 ARR, eight people, raising its Series A in nine months and needing 25-40 named logos to tell a credible traction story. The founder's instinct is "discount whatever it takes to get logos." That instinct is *correct on percentage and dangerous on structure*.

The right move: set the loose percentage bands — rep to 15%, founder to 40% — and let the team be genuinely aggressive on headline discount to land the logos. A 35%-off deal that gets a recognizable engineering team using the product is a great Series A asset. But fence it: every one of those discounts carries a mandatory written snap-back to within 10% of list at the first renewal, every deal is minimum 12 months, no opt-out clauses, net-30 only, and the founder personally approves anything past 25% with a one-line "why this logo" note. Eighteen months later the company has its 35 logos *and* a renewal book where the promotional pricing snaps back by contract — they bought the logos as a time-boxed, reversible subsidy. The failure-mode version of this company gives the same discounts with no snap-back, no term floor, and a few casual opt-out clauses, and arrives at Series A with 35 logos and a renewal book that re-prices downward and churns — logos that were liabilities wearing the costume of traction.

## Scenario 2: The Founder Who Says "We'll Fix Pricing After Series A"

A $1.8M ARR company, 24 months in, that never set a band table — discounting was "use your judgment." The CRO they just hired runs the numbers: realized ASP is 61% of list, 44% of ARR has a discount with no expiry, the concession register does not exist so nobody knows how many opt-out clauses are in the base, and the four most aggressive reps account for 70% of the deep discounting.

This is the "fix it later" tax coming due. The CRO cannot simply re-price the base — those are signed contracts. The repair takes 18 months: build the band table retroactively, instrument CPQ, create the concession register by auditing every contract by hand (a brutal, expensive exercise), and grind through renewals trying to step pricing back up one account at a time against customers who have no contractual reason to agree. The company spends its entire post-Series-A scaling window doing remedial governance work that a band table on day one would have made unnecessary. The lesson is not "this company is doomed" — it recovers — it is that *every month of remedial work was avoidable*, and it was spent during the most expensive possible window.

## Scenario 3: The Enterprise-Tight Founder Who Strangles the Funnel

A $400K ARR company whose founder came from a large enterprise software company and imported its discount governance wholesale: a deal desk review board, a maximum 12% discount without VP approval, three-stage sign-off, quarterly pricing committee. The company has six reps and a 14-person headcount.

The result is a strangled funnel. Cycle times balloon because every modestly discounted deal sits in a multi-stage approval queue. Reps stop pursuing price-sensitive prospects entirely because the approval friction is not worth it — which means the company stops *learning* from exactly the segment that would teach it the most about willingness-to-pay. Win rates on competitive deals collapse because the rep cannot move fast enough. The founder has mistaken enterprise *process* for enterprise *control*, and at 14 people the process is pure cost. The fix is to *loosen the percentage bands dramatically* (rep to 15%, founder to 40%) while *keeping and even strengthening the structural gates* — and to delete the review board entirely, replacing it with the founder's own 30-minutes-a-week. This company's mistake is the inverse of Scenario 2's, and equally expensive: Scenario 2 had no brakes; Scenario 3 has the parking brake permanently engaged.

## Scenario 4: The Usage-Based Pricing Company With No "List" to Discount From

A $2.5M ARR usage-based infrastructure company. The question "what's our discount band?" is initially confusing because there is no per-seat list price to discount *from* — pricing is consumption × rate. But discounting absolutely still happens: rate discounts, committed-use discounts, free credits, minimum-commitment waivers, and overage-rate concessions.

The asymmetric principle still applies, translated. The "loose" dimension is the *rate discount and credit grants* — be generous, because early consumption is naturally low and you are buying the chance for usage to grow. The "tight" dimensions are: committed-use minimums (the term-equivalent — a rate discount should require a usage commitment), the *ramp* on committed minimums (consumption grows, so the floor should too), and — critically — the *overage rate*, which must never be discounted into the floor because overage is where the margin lives. The margin-floor circuit breaker becomes a per-unit contribution-margin floor. The lesson generalizes: "discount governance" is not specific to seat-based list pricing — it is the governance of *every lever that moves realized revenue per customer below the standard*, and every pricing model has those levers. The asymmetric, reversibility-tested, system-enforced structure works regardless of model; only the names of the levers change.

## Scenario 5: The Company That Got It Right and the Compounding Payoff

A $6M ARR vertical-SaaS company that built the band table at deal #5. Loose percentages, tight structure, everything in a configured CRM with enforced gates, a concession register from the start, monthly discount reviews from the first quarter. It was not free — early on it felt like overhead for a company that small, and the founder occasionally wondered if it was premature.

The payoff compounds invisibly and then becomes obvious. At Series B diligence, the investors' commercial review finds a renewal book where discounting is shallow, every discount has an expiry, concessions are documented and rare, and realized ASP is 88% of list and *rising*. The diligence takes days instead of weeks because the data exists and is clean. NRR, when it finally matures, comes in at 118% — and the founder can see *why*, because the leading indicators predicted it 15 months earlier. The company splits its band table by segment at $4M ARR as a clean evolution because the structure was always there to evolve. The contrast with Scenarios 2 and 3 is the whole argument: the governed company spent a small, steady tax from deal #5 and never paid the large, lumpy remediation tax later. Discipline early is not the expensive option — it is the cheap one, paid in small installments instead of one crippling lump.

## The Decision Framework: How to Set Your Bands This Week

For a founder who needs to go from "no policy" to "governed" in the next seven days, the framework is concrete:

**Step 1 — Write the four numbers.** Rep auto-approve ceiling (start 15%), manager ceiling (start 25%), founder ceiling (start 40%), hard ceiling above which an exception memo is required (start 40%). These can be wrong; they cannot be absent.

**Step 2 — Set the gross-margin floor.** Calculate your real blended gross margin. Set the never-cross floor 5-10 points below typical. Write down that crossing it is a board conversation.

**Step 3 — Couple discount to term.** Write the gate rules: no discount above ~18% without 12-month minimum; nothing above ~30% without 24 months or prepay. Make these *gates*, not guidelines.

**Step 4 — Make the irreversibles founder-only.** List the non-price concessions — payment terms beyond net-30, opt-outs, custom SLAs, MFN, security/liability carve-outs, auto-renewal removal — and declare every one founder-approval-only, today.

**Step 5 — Mandate expiry.** No discount above 20% leaves without a written ramp or snap-back captured as a structured field.

**Step 6 — Put it in the system.** Even if "the system" is a locked quote template with formula-driven approval flags, the bands, gates, and required fields must be enforced by software, not memory.

**Step 7 — Start the concession register.** A simple structured log of every non-standard term, by deal, by approver. Start it with deal #1 or, if you are late, with the next deal.

**Step 8 — Schedule the monthly review.** Put a recurring 45-minute discount review on the calendar, founder plus sales leadership, starting this month, and never skip it.

**Step 9 — Instrument the leading indicators.** Realized ASP vs. list, discount-depth distribution, approval-tier mix, concession frequency, discount-with-no-expiry rate. These are your steering data until NRR matures.

**Step 10 — Plan the evolution.** Write one paragraph on how the bands will split by segment once NRR data arrives, so the future evolution is a known plan, not a future scramble.

Ten steps, one week, and the company is governed. Not perfectly — the numbers will be wrong and will be tuned monthly — but *governed*, which is the entire difference between buying customers and accidentally repricing your company.

## The AI and Five-Year Outlook: Where Discount Governance Is Heading

The structural advice in this answer is durable, but the *mechanics* are being reshaped by AI and tooling trends that an early-stage founder should design toward rather than against.

**AI-assisted deal desk.** By the mid-2020s, AI agents embedded in CPQ can already evaluate a quote against the band table, flag reversibility risks, draft the snap-back language, and surface "this deal looks like cohort X, which churned at Y" — turning the founder's monthly review into a continuous, automated guardrail. The early-stage founder should pick tooling that is heading this direction, because it makes the "tight structure" cheap to enforce at the exact moment headcount is most constrained.

**Discount elasticity modeling earlier.** The data problem this question is built on — "no NRR data yet" — is shrinking. AI models trained on cross-company benchmarks can give an early-stage company a *prior* on discount elasticity by segment far before its own cohorts mature. The "we don't have data" excuse weakens every year; increasingly you can borrow a reasonable starting prior and tune it.

**Usage-based and hybrid pricing dominance.** As more software shifts to usage-based and hybrid models, "discount governance" increasingly means governing rate cards, committed-use minimums, credit grants, and overage rates rather than seat discounts. The asymmetric principle survives the transition intact, but founders should build their governance vocabulary around *all* revenue-per-customer levers, not just list-price discounts.

**Procurement is also getting AI.** The other side of the table is arming up — AI procurement tools that benchmark your pricing, detect your MFN exposure, and coach buyers on which concessions to extract. This *raises* the stakes on the concession discipline in this answer: the irreversible concessions are exactly what AI-assisted procurement will systematically hunt for.

**The invariant.** Across all of it, the core principle does not move: loose on the reversible, immovable on the irreversible, everything in the system, reviewed on a ritual cadence. Tooling makes the discipline cheaper and the data earlier. It does not change what discipline *is*. A founder who internalizes the asymmetric structure today is building governance that the next five years of AI tooling will make easier to run, not obsolete.

## The Final Framework: Loose Percentages, Ruthless Structure, Everything in the System

Strip the whole answer to its load-bearing core and it is four sentences.

**One: discounting is a governance decision, not a pricing decision** — the percentage is the visible, recoverable part; the structure around it is the invisible, permanent part, and governance means controlling the permanent part.

**Two: you cannot wait for NRR data** — by the time it matures you will have signed hundreds of customers, and the renewal book you inherit is the discount policy you actually had, so you must govern from deal #1 using leading indicators as an 18-month-early proxy for the NRR you cannot yet see.

**Three: the answer to "tight or loose" is "both, asymmetrically"** — loose on headline percentage because pre-PMF you are data-poor and logo-hungry and a dead deal teaches nothing, but ruthlessly tight on the four irreversibles (term coupling, mandatory expiry, founder-only non-price concessions, and a never-cross margin floor) because those are what permanently impair an account and cannot be clawed back.

**Four: governance that is not enforced by software does not exist** — the band table, the gates, the required expiry fields, the concession register, and the monthly review ritual must be real artifacts in real systems from the very first deal, because founder memory is not a control and "we'll fix it later" is a lie about a renewal book that is already signed.

The founder who asks "should we be enterprise-tight or SMB-loose?" is asking a one-dial question about a five-dial machine. The answer is not a setting — it is a *shape*: generous where generosity is reversible, immovable where the damage is permanent, instrumented everywhere, and reviewed forever. Build that shape this week, tune the numbers monthly, split the table by segment when the data arrives, and you will reach the stage where NRR finally exists already knowing what it will say — because you governed the leading indicators that wrote it.

`;

const flow = `

## Decision Flow: Setting and Routing an Early-Stage Discount

\`\`\`mermaid
flowchart TD
  A[Rep Builds Quote] --> B{Discount Depth Off List}
  B -->|0 to 15 percent| C[Tier 0 Rep Auto Approve]
  B -->|15 to 25 percent| D[Tier 1 Manager Approve]
  B -->|25 to 40 percent| E[Tier 2 Founder CRO Approve]
  B -->|Above 40 percent| F[Tier 3 Exception Memo Two Approvers]
  C --> G{Term Check}
  D --> G
  E --> G
  F --> G
  G -->|Discount Above 18 and Term Below 12mo| H[Blocked Raise Term Or Lower Discount]
  G -->|Discount Above 30 and No 24mo Or Prepay| H
  G -->|Term Gate Passed| I{Expiry Check}
  H --> A
  I -->|Discount Above 20 and No Written Expiry| J[Blocked Add Ramp Or Snap Back Field]
  I -->|Expiry Field Populated Or Discount Under 20| K{Non Price Concessions Present}
  J --> A
  K -->|Net Terms Beyond 30 Opt Out SLA MFN Carve Out| L[Auto Route Founder Approval Plus Concession Register]
  K -->|Standard Paper Only| M{Margin Floor Check}
  L --> M
  M -->|Below Gross Margin Floor| N[Hard Stop Board Visible Exception Only]
  M -->|Above Floor| O[Quote Approved And Logged In CPQ]
  N --> P[Board Conversation Required]
  O --> Q[Realized Terms Flow To Renewals Process]
  Q --> R[90 Days Pre Renewal System Surfaces Discount Expiry Concessions]
  O --> S[Feeds Monthly Discount Review Ritual]
  S --> T[Leading Indicators Dashboard ASP Depth Tier Mix Concession Rate No Expiry Rate]
  T --> U{Bands Still Right}
  U -->|Yes| V[Hold Table]
  U -->|No Drift Detected| W[Adjust Band Table Explicitly And Log Change]
  W --> A
  V --> A
\`\`\`

## Comparison Matrix: Blanket Enterprise-Tight vs Blanket SMB-Loose vs Asymmetric Structure

\`\`\`mermaid
flowchart TD
  subgraph TIGHT[Blanket Enterprise Tight]
    T1[Headline Percentage Very Restricted]
    T2[Multi Stage Approval Boards]
    T3[Outcome Strangled Funnel]
    T4[Outcome Lost Learning From Price Sensitive Segment]
    T5[Outcome Slow Cycle Time Burns Runway]
    T6[Verdict Wrong As Blanket Default Pre PMF]
  end
  subgraph LOOSE[Blanket SMB Loose]
    L1[Headline Percentage Unrestricted]
    L2[No Band Table No Concession Register]
    L3[Outcome Loudest Rep Sets Price]
    L4[Outcome 35 to 55 percent Of ARR Below List No Expiry]
    L5[Outcome Hidden Non Price Concessions Impair NRR]
    L6[Outcome Painful Crisis Tightening At Scale]
    L7[Verdict Wrong As Blanket Default Pre PMF]
  end
  subgraph ASYM[Asymmetric Structure Recommended]
    A1[Loose On Headline Percentage Rep 15 Manager 25 Founder 40]
    A2[Tight On Term Coupling Gate Not Guideline]
    A3[Tight On Mandatory Written Expiry Snap Back]
    A4[Tight On Non Price Concessions Founder Only]
    A5[Tight On Never Cross Margin Floor]
    A6[Everything Enforced In CPQ Plus Monthly Review]
    A7[Outcome Reversible Cheap Customer Acquisition Subsidy]
    A8[Outcome Clean Renewal Book And Fast Diligence]
    A9[Outcome Leading Indicators Predict NRR 18 Months Early]
    A10[Verdict Correct Loose Where Reversible Tight Where Permanent]
  end
  REV[Reversibility Test: Can We Unwind This Unilaterally At Renewal] --> TIGHT
  REV --> LOOSE
  REV --> ASYM
  T6 --> WHY[Both Blanket Defaults Fail]
  L7 --> WHY
  WHY --> ASYM
\`\`\`

`;

const src = `

## Sources

1. **OpenView Partners — SaaS Pricing Strategy and Benchmarks reports** — Foundational data on early-stage pricing, discount depth, and willingness-to-pay discovery. https://openviewpartners.com
2. **KeyBanc Capital Markets (formerly Pacific Crest) — Annual SaaS Survey** — Benchmark data on discount levels, sales efficiency, and gross margin by stage. https://www.key.com
3. **Bessemer Venture Partners — State of the Cloud and "Good/Better/Best" pricing frameworks** — Stage-by-stage pricing and discount governance benchmarks. https://www.bvp.com
4. **SaaS Capital — Spending and Retention Benchmarks** — Net revenue retention benchmarks by ACV segment and growth stage. https://www.saas-capital.com
5. **Gartner — CPQ Magic Quadrant and Deal Desk research** — Configure-price-quote tooling landscape and approval-routing best practices. https://www.gartner.com
6. **Salesforce CPQ / Revenue Cloud documentation** — Approval routing, discount schedules, and guardrail configuration mechanics. https://www.salesforce.com
7. **Forrester — Revenue Operations and Deal Desk maturity research** — Org-design benchmarks for when deal desk functions emerge by company stage.
8. **Winning by Design — Revenue Architecture frameworks** — Sales process and deal governance methodology for early-stage GTM teams. https://winningbydesign.com
9. **Tomasz Tunguz (Theory Ventures) — SaaS metrics and discounting analyses** — Widely cited blog analyses of discount depth, ASP realization, and NRR. https://www.tomtunguz.com
10. **a16z — "16 Startup Metrics" and GTM pricing essays** — Reference framework for leading vs lagging GTM indicators. https://a16z.com
11. **First Round Review — early-stage sales and pricing operator essays** — Founder-led sales and pricing-discipline case studies. https://review.firstround.com
12. **Profitwell / Paddle — Pricing and Retention benchmark studies** — Discount impact on retention and the limited churn-sensitivity of discounting in SMB cohorts. https://www.paddle.com
13. **Simon-Kucher & Partners — Global Pricing Studies** — Discount leakage research and price-realization discipline benchmarks. https://www.simon-kucher.com
14. **RevOps Co-op community resources** — Practitioner benchmarks on deal desk setup and discount band design at early stage. https://www.revopscoop.com
15. **Pavilion (formerly Revenue Collective) — CRO and sales leadership benchmarks** — Approval-tier and comp-alignment practices across stages.
16. **CFO benchmark data from Bench, Mosaic, and Maxio (formerly SaaSOptics + Chargify)** — Gross margin floors and contract-term distribution by SaaS stage. https://www.maxio.com
17. **HubSpot Sales / Quote tooling documentation** — Early-stage quote-template and approval-flag configuration for pre-CPQ companies. https://www.hubspot.com
18. **DealHub, Subskribe, and Nue CPQ product documentation** — Modern CPQ approaches to discount guardrails, ramps, and usage-based pricing governance.
19. **ICONIQ Growth — Topline Growth and Operational Efficiency reports** — Benchmark data on discount discipline and NRR across the growth-stage cohort. https://www.iconiqcapital.com
20. **Bain & Company — B2B pricing and discount-governance research** — Reversibility of concessions and the structural cost of MFN clauses.
21. **McKinsey — B2B pricing and "pocket price waterfall" research** — The classic framework for invisible discount leakage via non-price concessions.
22. **Gong / Clari revenue-intelligence research** — Data on quarter-end discounting behavior and approval-routing impact on cycle time.
23. **SaaStr — founder-led sales and pricing content library** — Operator commentary on early-stage discount mistakes and renewal-book repair. https://www.saastr.com
24. **Andreessen Horowitz & OpenView — usage-based pricing reports** — Governance of rate cards, committed-use discounts, and overage rates in consumption models.
25. **The CapitalIQ / PitchBook diligence-standard checklists** — What investor commercial diligence examines in a renewal book and discount history.
26. **Carta — cap table and revenue benchmark data** — Stage definitions and ARR-band norms used for the stage-by-stage evolution framework.
27. **Notion / Vendr procurement-side benchmark data** — The buyer-side view of which concessions procurement teams systematically target.
28. **Insight Partners — Scale-Up GTM resources** — Deal desk maturity and discount-band evolution as companies scale past $5M ARR.
29. **Sales Hacker / GTMnow community archives** — Practitioner discussions of discount-band design and comp-plan alignment.
30. **Anthropic / OpenAI applied-AI GTM commentary and CPQ vendor AI roadmaps** — Direction of AI-assisted deal desk and elasticity-modeling tooling for the five-year outlook.

`;

const num = `

## Numbers

**Recommended Starting Band Table (Pre-PMF SaaS)**
- Tier 0 — Rep auto-approve: 0-15% off list (12-month min term above 8%)
- Tier 1 — Manager approve: 15.01-25% off list (12-month min term; written expiry above 20%)
- Tier 2 — Founder/CRO approve: 25.01-40% off list (24-month term OR prepay; mandatory ramp/snap-back; deal rationale)
- Tier 3 — Hard ceiling: >40% off list (exception memo, two approvers, logged)
- Gross-margin floor: 55-65% blended for SaaS; never crossed without board-visible exception

**Term Coupling Gates**
- No discount above ~18% without 12-month minimum term
- No discount above ~30% without 24-month term or annual prepay
- Discount above 20%: mandatory written expiry (ramp or snap-back) as structured CPQ field

**The Data-Wait Timeline**
- NRR existence (one full renewal cycle): ~18 months minimum
- Segment-reliable NRR: 24-30 months
- Trend-reliable NRR: ~36 months
- Customers signed before first credible segment NRR (0 to ~$3M ARR in 30 months): ~150-600
- Implication: the renewal book is the discount policy you actually ran, not the wiki version

**Failure-Mode Benchmarks (Blanket-Loose Companies)**
- Share of ARR below list with no expiry in ungoverned books: ~35-55%
- Typical realized ASP vs. list in ungoverned early books: ~55-65%
- Concession opt-out / custom-SLA prevalence: untracked, therefore unknown — the core problem
- Renewal-book repair window after late tightening: ~12-18 months

**Healthy-Governed Benchmarks**
- Realized ASP vs. list in governed early books: ~82-92% and rising
- Discount-depth distribution: majority of deals in Tier 0-1, thin Tier 2-3 tail
- Discount-with-no-expiry rate: target near 0%
- Share of deals hitting founder approval: healthy if roughly 10-20%, governance failure if 40%+

**Non-Price Concession Cost Signals**
- Net-90 vs. net-30 on a $100K deal: roughly 1-2% of cash value at typical cost of capital — plus a permanent parity precedent
- 24-month contract with 30-day opt-out: functionally month-to-month; "committed ARR" becomes fiction
- MFN clause: caps pricing power across the account and potentially the segment; triggerable by unrelated deals
- Custom 99.99% SLA / named-CSM: permanent cost-to-serve drag plus a template procurement copies

**Org and Cadence Benchmarks**
- Founder time as deal desk pre-PMF: ~30-60 minutes/week at this deal volume
- First sales manager (Tier 1 approval handoff): typically at 4-6 reps
- First RevOps/finance owner of CPQ + dashboard: typically $1-3M ARR
- Monthly discount review ritual: 30-60 minutes, founder + sales leadership, from deal #1, never skipped

**Leading Indicators to Instrument from Deal #10**
- Realized ASP vs. list (blended ratio)
- Discount-depth distribution (not the average — the shape)
- Approval-tier mix (share of deals and of ARR per tier)
- Concession frequency (from the concession register)
- Discount-with-no-expiry rate
- Quote-to-close by discount tier (is depth actually buying wins?)
- Discount-by-rep and discount-by-source clustering

**Stage Evolution Markers**
- Pre-PMF (0 to ~$1M ARR, 0-18 mo): single loose-percentage / tight-structure table; steer by leading indicators
- Early-PMF (~$1-5M ARR, 18-36 mo): split band table by segment as NRR data arrives
- Scaling (~$5-20M ARR, 36+ mo): discount elasticity modeling, dedicated deal desk analyst, tighter percentage bands overall
- Invariant across all stages: term coupling, mandatory expiry, founder/exec-only concessions, margin floor, everything-in-CPQ, monthly review

**Segment Differentiation Pattern (once data exists)**
- SMB: churn often discount-insensitive — tighten percentage bands, lean on short terms and self-serve
- Mid-market: expansion-sensitive — keep percentage latitude, airtight structure (ramps/expiry/term)
- Enterprise: low logo churn, high concession risk — obsess over non-price concessions over percentage

`;

const counter = `

## Counter-Case: When the Conventional "Asymmetric" Answer Is Wrong

The asymmetric structure — loose percentage, tight structure — is the right default for the large majority of early-stage software companies. But "default" is not "universal," and a rigorous founder should know the specific conditions under which the conventional answer fails or needs material modification.

**Counter 1 — Pure self-serve / product-led companies should arguably not have negotiated discount bands at all.** If your motion is genuinely self-serve — credit-card signup, no sales rep, pricing-page-driven — then a "discount band table" is solving a problem you do not have. The right governance for a PLG company is *list-price discipline and promotion governance*: who can create a promo code, what the max promo depth is, how promo codes expire, and whether sales-assist (when it eventually appears) can override the page price at all. Importing a rep-band table into a PLG company creates a sales-led apparatus that the motion does not need and that can actually *invite* the negotiation you were trying to avoid. For PLG, the analogous discipline is "almost nobody can discount, promotions are centrally governed and time-boxed" — which looks more like blanket-tight than asymmetric.

**Counter 2 — When the founder genuinely cannot enforce structure, loose-everything may be the honest lesser evil.** The asymmetric structure assumes the founder will actually hold the structural gates — populate expiry fields, enforce term coupling, keep concessions founder-only, run the monthly review. If the founder is being honest with themselves and knows they will *not* do this — no CPQ, no discipline, no time — then a written band table they will not enforce is worse than useless: it creates a false sense of governance and a paper trail of violated policy. In that specific (and common) case, the higher-integrity move is to radically simplify: one hard discount ceiling, one hard rule that *all* non-standard terms require the founder's literal signature on the contract, and nothing else. Fewer rules that are actually enforced beat an elegant table that is fiction.

**Counter 3 — Some markets have a true reference price that makes "loose percentage" dangerous.** The asymmetric advice assumes list price is somewhat aspirational pre-PMF and that the market has not yet anchored. In markets with a dominant incumbent and a well-known price point — where every buyer knows what the category "costs" — discounting deeply off your list is not buying reversible learning; it is permanently anchoring you below the reference price in a way that snap-back language cannot fully fix, because the customer's *perception* of your value is now set. In reference-priced markets, percentage discipline matters much more than the conventional answer suggests, and the asymmetry should be milder.

**Counter 4 — Hyper-competitive land-grab markets can justify blanket looseness as a deliberate, eyes-open bet.** Occasionally the strategic situation genuinely is "winner-take-most, and whoever lands the logos in the next 12 months wins the category." In that specific case, a founder might *consciously* choose blanket looseness — deep discounts, weak structure, accept the impaired renewal book — as the price of winning a market that will be worth far more than the renewal-book repair cost. This is a legitimate strategy, but it must be a *deliberate, named bet with board buy-in*, not the accidental drift that Scenario 2 describes. The counter-case is not "looseness is fine"; it is "deliberate looseness as a funded land-grab bet is a different thing than ungoverned drift, and only the first is defensible."

**Counter 5 — For very high-ACV, very low-volume enterprise-only companies, "bands" are the wrong abstraction entirely.** If your company sells six deals a year at $500K-$2M each, a band table is over-engineering. Every deal is bespoke, every deal goes to the founder regardless, and the discipline that matters is *deal-specific structuring* — a deal review for each one, a custom reversibility analysis, a bespoke concession audit. The "tier" concept assumes enough deal volume for tiers to be meaningful. At six-deals-a-year scale, the answer is not asymmetric bands; it is "every deal is a Tier 2+ deal and is treated as such."

**Counter 6 — When the company's real constraint is sales-cycle speed against a fundraise clock, even structural gates can be too slow.** The conventional answer treats structural gates (term coupling, expiry fields, concession routing) as nearly free. They are cheap — but not zero. A company with eight weeks of runway that needs three logos to close a bridge round may rationally decide that *even the structural friction* is unaffordable for that specific sprint, and that the founder will personally hand-structure those three deals fast and dirty. This is a narrow, time-boxed exception — not a policy — but pretending structural governance is always costless is itself a small dishonesty the counter-case should name.

**Counter 7 — The margin floor itself can be wrong for genuinely strategic loss-leader deals.** The answer treats the gross-margin floor as nearly sacred. But there are real cases — a marquee logo that unlocks an entire vertical, a lighthouse customer whose reference is worth more than the deal's margin, a strategic displacement of a competitor's flagship account — where a below-floor deal is the *correct* decision. The counter-case is not that the floor is wrong; it is that the floor's *enforcement mechanism* (board-visible exception) is exactly the right design *because* below-floor deals are sometimes correct. The floor should never be crossed *casually* — but the existence of the board-visible exception path is an admission that "never cross the floor" is a strong default, not an absolute law.

**The honest synthesis.** The asymmetric structure is the right answer for the modal early-stage sales-assisted software company: enough deal volume for tiers to matter, a market without a hard reference price, a founder who will actually enforce structure, and no funded land-grab mandate. Move away from that modal case — into PLG, into reference-priced markets, into six-deals-a-year enterprise, into a board-funded land grab, or into a founder who honestly will not enforce — and the answer bends. What does *not* bend, in any of the counter-cases, is the underlying principle: **know which dimensions of your deals are reversible and which are permanent, and govern the permanent ones harder than the reversible ones.** The asymmetric band table is one implementation of that principle. The principle outlives any specific implementation.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you build a deal desk function from scratch? (The org-design sequel to this entry — when and how the founder-as-deal-desk becomes a real function.)
- **q9502** — How do you set list pricing before product-market fit? (The upstream question — you cannot govern discounts off a list price you have not set.)
- **q9551** — How do you design a sales compensation plan for the first five reps? (Comp alignment — paying on net-of-discount ARR so incentives reinforce governance.)
- **q9552** — How do you structure ramped and usage-based contracts? (Deep dive on the ramp and snap-back mechanics referenced throughout this entry.)
- **q9554** — When should an early-stage company hire its first RevOps person? (The hire who takes ownership of CPQ configuration and the leading-indicator dashboard.)
- **q9555** — How do you forecast revenue before you have renewal data? (Sister problem — steering by leading indicators when the lagging metric does not exist yet.)
- **q9556** — How do you configure CPQ approval routing? (The system-of-record implementation detail that makes the band table real rather than aspirational.)
- **q9557** — What non-price concessions destroy NRR the most? (Expanded treatment of the MFN, opt-out, payment-terms, and SLA concession list.)
- **q9558** — How do you build a concession register in your CRM? (The structured-log artifact this entry insists on from deal #1.)
- **q9559** — How do you run a monthly discount review? (The ritual cadence — agenda, attendees, and the leading-indicator walk-through.)
- **q9560** — How do you set a gross-margin floor for SaaS deals? (Deep dive on the circuit-breaker number and the board-visible exception process.)
- **q9561** — How do you segment customers before you have cohort data? (Prerequisite for splitting the band table by segment as NRR matures.)
- **q9562** — What is net revenue retention and how is it actually calculated? (The lagging metric this entry's leading indicators are designed to predict.)
- **q9563** — How do you repair a discounted renewal book? (The remediation playbook for companies that did not govern early — Scenario 2's fix.)
- **q9564** — How do you transition from founder-led sales to a sales team? (The stage context in which discount governance must survive the founder stepping back.)
- **q9565** — How do you price and govern discounts in a usage-based model? (Scenario 4 expanded — rate cards, committed-use minimums, and overage-rate discipline.)
- **q9566** — How do you run quarter-end without destroying price integrity? (The quarter-end pressure that ungoverned bands fail under.)
- **q9567** — How do you build win/loss analysis into the sales process? (Quote-to-close-by-discount-tier — proving whether depth actually buys wins.)
- **q9568** — How do you prepare a renewal book for fundraising diligence? (Scenario 5's payoff — what investor commercial diligence examines.)
- **q9569** — How should a CRO audit an inherited sales org? (The inherited-mess audit Scenario 2's new CRO has to run.)
- **q9570** — How do you set guardrails for AI-assisted deal desk tooling? (The five-year-outlook tooling direction this entry points toward.)
- **q9571** — How do you design pricing for a PLG / self-serve motion? (Counter-Case 1 expanded — why PLG companies need promotion governance, not band tables.)
- **q9572** — How do you make a deliberate land-grab pricing bet? (Counter-Case 4 expanded — funded, board-approved looseness as strategy.)
- **q9573** — How do you structure high-ACV low-volume enterprise deals? (Counter-Case 5 expanded — bespoke deal structuring when bands are the wrong abstraction.)
- **q9574** — What leading indicators predict NRR? (The instrumentation core of this entry, treated as its own deep dive.)

`;

const tags = ['revops', 'discount-governance', 'deal-desk', 'pricing-strategy', 'founder-led-sales', 'early-stage', 'sales-operations', 'cpq', 'net-revenue-retention', 'gtm-strategy'];

const sources = [
  { title: 'OpenView Partners — SaaS Pricing Strategy and Benchmarks', url: 'https://openviewpartners.com' },
  { title: 'KeyBanc Capital Markets — Annual SaaS Survey', url: 'https://www.key.com' },
  { title: 'McKinsey — B2B Pricing and the Pocket Price Waterfall', url: 'https://www.mckinsey.com' }
];

const notes = {
  s6: 'Added 30 cited sources spanning SaaS pricing and benchmark research (OpenView, KeyBanc, Bessemer, SaaS Capital, ICONIQ, Carta), CPQ and deal desk tooling (Salesforce CPQ, DealHub, Subskribe, Nue, HubSpot, Gartner), pricing-discipline and discount-leakage research (Simon-Kucher, McKinsey pocket price waterfall, Bain on concession reversibility), RevOps/CRO practitioner communities (RevOps Co-op, Pavilion, Winning by Design, SaaStr), retention research (Profitwell/Paddle, Maxio), buyer-side procurement benchmarks (Vendr, Notion), and AI deal desk roadmap commentary for the five-year outlook.',
  s7: 'Added comprehensive numbers block: the recommended four-tier starting band table with exact percentages and term/expiry requirements, term-coupling gates, the data-wait timeline (18mo to NRR existence, 24-30mo segment-reliable, ~150-600 customers signed before first credible segment NRR), failure-mode benchmarks for ungoverned books (35-55% of ARR below list with no expiry, 55-65% realized ASP), healthy-governed benchmarks (82-92% realized ASP and rising), non-price concession cost signals, org/cadence benchmarks, the seven leading indicators to instrument from deal #10, stage-evolution markers, and the segment-differentiation pattern.',
  s8: 'Added 7-element counter-case covering when the asymmetric default is wrong or needs modification: pure PLG/self-serve companies need promotion governance not band tables; founders who honestly will not enforce structure should radically simplify instead; reference-priced markets make loose percentage genuinely dangerous; hyper-competitive land-grab markets can justify deliberate board-funded looseness; very high-ACV low-volume enterprise companies should treat every deal as bespoke rather than banded; fundraise-clock time pressure can make even structural gates too slow for a narrow sprint; and the margin floor itself can be correctly crossed for genuinely strategic loss-leader deals — with an honest synthesis that the underlying reversibility principle survives every counter-case.',
  s9: 'Cross-linked 24 related Pulse entries spanning the deal desk org-design sequel (q9501), upstream list pricing (q9502), comp-plan alignment (q9551), ramped/usage contract mechanics (q9552), the RevOps first hire (q9554), forecasting without renewal data (q9555), CPQ approval routing (q9556), non-price concessions and the concession register (q9557-q9558), the monthly review ritual (q9559), margin floor (q9560), pre-cohort segmentation (q9561), NRR definition and the leading indicators that predict it (q9562, q9574), renewal-book repair (q9563), founder-to-team transition (q9564), usage-based discount governance (q9565), quarter-end discipline (q9566), win/loss by discount tier (q9567), diligence prep (q9568), inherited-org audit (q9569), AI deal desk guardrails (q9570), and the three counter-case deep dives (q9571-q9573).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of early-stage discount governance band design for founder-led / pre-PMF sales orgs. Two mermaid diagrams (decision flow for setting and routing a discount through the tier/term/expiry/concession/margin-floor gates into the monthly review loop; comparison matrix of blanket enterprise-tight vs blanket SMB-loose vs the recommended asymmetric structure). Core thesis: do not pick a single default — run an asymmetric two-track structure that is loose on headline discount percentage (because pre-PMF you are data-poor and logo-hungry and a dead deal teaches nothing) but ruthlessly tight on the four irreversibles (term coupling, mandatory written expiry/snap-back, founder-only non-price concessions, and a never-cross gross-margin floor). Full coverage: the reframe that discounting is a governance not a pricing decision, why you genuinely cannot wait for churn/NRR data (the renewal book IS the discount policy you ran), the concrete four-tier band table with exact percentages, the reversibility test for sorting concessions into bands, the non-price concession kill-list (payment terms, opt-outs, custom SLAs, MFN, security carve-outs, auto-renewal removal), discount expiry/ramp/snap-back mechanics, why both blanket defaults backfire, the seven leading indicators that predict NRR 18 months early, CPQ as the system of record, org design and the monthly discount review ritual, stage-by-stage band evolution, segment differentiation once data exists, the margin-floor circuit breaker, five named scenarios (logo-hungry seed startup, the fix-it-later founder, the enterprise-tight funnel-strangler, the usage-based no-list company, the company that got it right), a ten-step decision framework to go from no-policy to governed in one week, a five-year AI/tooling outlook, a final four-sentence framework, 30 cited sources, comprehensive numbers block, and a 7-element counter-case.'
};

runPolish({ id: 'q9553', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
