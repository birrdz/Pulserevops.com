// q9551 — How does discount-authority governance differ between a founder selling to direct enterprise customers vs one managing a channel or VAR partnership?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Discount-authority governance in a **direct enterprise** motion and a **channel/VAR** motion are not two flavors of the same policy — they are two structurally different control systems, and founders who copy-paste their direct discount matrix into a partner program destroy 6-14 points of blended gross margin within two quarters. In a **direct motion**, the founder governs a **single negotiating surface**: the rep is the only party touching price, the discount ladder runs in tiers (rep self-serve to ~10-15%, manager to ~20-25%, VP/deal-desk to ~30-35%, founder/CEO above ~35-40%), approvals are **deal-by-deal**, and the governing artifact is a **CPQ approval workflow** plus a deal desk that adjudicates exceptions. In a **channel/VAR motion**, the founder governs a **two-sided surface** — the partner discount (the margin you grant the VAR off list, typically 20-40% depending on tier and value-add) AND the end-customer price the partner is allowed to quote — and the core governance problems flip to **deal registration**, **margin-stacking control** (preventing the partner discount and an end-customer discount from compounding into a 55%+ effective discount), **channel conflict arbitration**, **price-floor enforcement (MAP/MSRP discipline)**, and **deal-reg-driven approval** rather than seniority-driven approval. The single biggest mistake: treating partner margin as a "discount" governed by the same matrix as a direct rep's concession authority — it is not a concession, it is a **structural cost-of-sale** that must be funded out of a deliberately higher list price or a deliberately lower direct comp load, and governed by **program rules (tiering, registration, MDF, rebate)** instead of **per-deal approvals**. Founders should run **two separate discount-authority policies** from the first channel hire: a direct matrix owned by the deal desk, and a partner program owned by a channel/partner ops function, with a shared **price floor** (the absolute net-to-company number below which no deal in either motion can close without founder/CFO sign-off) as the only common control. Get the price floor, deal registration, and margin-stack cap right and the channel becomes accretive; get them wrong and you have trained your own partners to undercut your direct team and compress your margin on every renewal.`;

const core = `

## Why This Question Is Really Two Questions

Most founders ask "how do I govern discounting?" as if discount authority were a single policy with a single owner. It is not. The moment you add a channel or VAR motion alongside a direct enterprise motion, you are running **two different control systems that happen to share a price list**. The direct motion governs a *negotiation*: one of your employees is sitting across the table from a buyer, and the question is how far that employee can move on price before someone more senior has to bless it. The channel motion governs a *program*: an independent business — the VAR, the reseller, the systems integrator — has its own P&L, its own salespeople, its own incentive to discount, and the question is not "how far can my rep move" but "what is the structural margin I hand the partner, what price are they allowed to quote the end customer, and how do I stop those two numbers from compounding into a margin disaster I never see coming."

The reason this matters so much at the founder stage is timing. Founders typically build a direct discount matrix first — it is the natural artifact of closing the first 30-80 enterprise deals. Then a partner shows up, or a big customer says "we only buy through our reseller," and the founder bolts a channel onto the side of the existing GTM without rebuilding the governance underneath it. They take the direct discount ladder — rep to 15%, manager to 25%, VP to 35% — and they tell the partner "you get 30% off list." What they have just done is hand an independent business a 30% structural margin AND left the door open for that partner to *also* pass through an end-customer discount, so the deal that should have netted 70 cents on the dollar nets 45. And because the partner quotes the end customer directly, the founder often never sees the stacked discount until the deal is booked and the revenue recognition team flags the variance. This is the single most expensive governance gap in early-stage channel programs, and it exists entirely because the founder treated a program problem like a negotiation problem.

So the honest framing is: governing discount authority in a direct motion is about **controlling concession depth and approval seniority on a single negotiating surface**. Governing it in a channel motion is about **controlling structural margin, end-price discipline, registration, and stacking across a two-sided surface you do not fully control**. Same company, same list price, two genuinely different governance disciplines — and the rest of this answer treats them as such.

## The Core Principle: Concession Authority vs Structural Margin

The conceptual unlock that separates founders who run profitable channels from founders who get crushed by them is this: **a direct discount is a concession; a partner discount is a structural cost-of-sale.** They look identical on an invoice — both show up as a percentage off list — but they behave like completely different animals and must be governed by completely different mechanisms.

A **concession** is variable, deal-specific, and earned. The rep gives 12% because the buyer pushed, or because it is end-of-quarter, or because the competitor came in low. The governing question is "did this deal *need* that concession, and was the right person authorized to grant it?" Concessions are governed **per deal**, through **approval workflows**, with **seniority-based escalation** — because the entire point is to make giving away margin friction-ful and visible. The direct discount matrix exists to ensure that every dollar of margin surrendered was a deliberate, authorized choice.

A **partner discount** — the 25%, 30%, 35% off list that the VAR keeps as its margin — is none of those things. It is not earned deal-by-deal; it is granted by tier, structurally, for the life of the partnership. It is not a concession the partner extracts under pressure; it is the *compensation* the partner requires to carry your product, fund a salesforce, run pre-sales, and deliver implementation. Governing it per-deal through a seniority ladder is a category error. You do not "approve" a partner's tier margin on every transaction any more than you "approve" a direct rep's base salary on every deal — it is a program parameter, set deliberately, funded deliberately, and changed deliberately through program redesign, not deal desk escalation.

This distinction drives every downstream governance decision. Because the partner discount is structural, it has to be **funded** — either by carrying a higher list price than a pure-direct company would (so the channel-inclusive net still clears your margin floor), or by accepting a deliberately lower contribution margin on channel deals in exchange for the reach and lower CAC the partner provides. Because the partner discount is structural, the thing you actually govern per-deal is *not* the partner margin — it is the **end-customer price the partner quotes** and the **registration that entitles the partner to the deal in the first place**. And because the partner discount is structural, the failure mode is not "a rep gave away too much on one deal" — it is "the entire program is mispriced and every channel deal is quietly dilutive." Founders who internalize concession-vs-structural-margin govern channels well. Founders who do not, govern them as if every partner were a rep with a generous matrix, and they bleed.

## The Direct Enterprise Discount Matrix: How It Should Actually Be Built

In a direct enterprise motion the governing artifact is the **discount authority matrix** — a tiered table that maps discount depth to the approval level required. A well-built founder-stage matrix looks roughly like this. **Rep self-serve authority: 0-12% off list.** The rep can grant up to ~12% with no approval at all, because friction on small concessions just slows deals and trains reps to sandbag. **Front-line manager: 12-22%.** A one-click manager approval, expected to clear within hours. **VP Sales / Deal Desk: 22-32%.** This is where real adjudication happens — deal desk looks at the shape of the deal, not just the number. **CRO / VP: 32-40%.** **Founder / CEO + CFO: above 40%, or any non-standard term** (custom payment schedule, unusual liability cap, multi-year price lock, free professional services).

But the depth ladder is the easy 40% of matrix design. The hard 60% is governing the **non-price levers** that reps use to give away margin without tripping the discount approval — and these are where founder-stage direct motions actually leak. The big ones: **payment terms** (net-90 instead of net-30 is a real cost of capital giveaway), **multi-year discounts that lock low pricing through renewals** (a 25% discount on a 3-year deal is far more expensive than 25% on a 1-year deal because you have surrendered two renewal price increases), **ramp deals** (paying for 100 seats, using 20 in year one), **free professional services or premium support**, **uplift caps on renewals** (capping the renewal increase at 3% when your model assumes 7%), and **most-favored-nation clauses** that poison every future deal. A direct discount matrix that governs only the headline percentage and ignores these is governing maybe half the margin surface. The best founder-stage matrices have a **second axis**: not just "how deep is the discount" but "how many non-standard levers does this deal touch," and any deal touching two or more non-standard terms escalates regardless of headline discount.

The governing body for all of this is the **deal desk** — even at the founder stage, even if "the deal desk" is the founder plus a finance person on a 15-minute Tuesday/Thursday call. The deal desk's job is not to say yes or no to a number; it is to **adjudicate the shape of the deal** and to be the institutional memory that prevents the same concession being re-granted, re-precedented, and re-normalized across the pipeline. The matrix is the rulebook; the deal desk is the court.

## The Channel/VAR Discount Structure: Tiers, Registration, and the Two-Sided Surface

A channel discount structure does not look like a matrix at all — it looks like a **program**. The core components a founder must design and govern are: the **partner tier model**, the **deal registration system**, the **margin/discount schedule by tier**, the **end-customer price discipline rules**, and the **incentive overlays** (MDF, rebates, SPIFFs). These are program parameters, not deal approvals, and getting their *design* right is most of the governance battle.

**Partner tiers.** A founder-stage program needs at least two tiers, usually three: a transactional/registered tier (low or no commitment, earns a base margin, maybe 20-25%), a committed tier (revenue commitment, certification, earns 28-33%), and a strategic/elite tier (significant commitment, co-marketing, dedicated resources, earns 33-40%+). The tier determines the *structural margin* the partner keeps. The discipline founders miss: tiers must be **earned and re-earned**, not granted at signature. A partner who signs up at the strategic tier and never delivers is a permanent margin leak.

**Deal registration** is the single most important governance mechanism in the channel motion, and it has no equivalent in the direct world. Registration is the partner declaring "I am working this specific end customer on this specific opportunity," and the vendor confirming "yes, this deal is yours — you get protected margin, and we will not let another partner or our own direct team underprice you on it." Registration solves channel conflict, justifies the protected margin (the *extra* discount a registered deal earns over an unregistered one — typically 5-15 additional points), and — critically — gives the vendor **visibility into the end-customer price before the deal closes.** A channel program without deal registration is a program with no governance at all: you are granting structural margin to partners and you cannot see what they quote, who they quote it to, or whether two of your partners are bidding against each other on the same logo and racing the price to the floor.

**The two-sided surface** is the conceptual core. In direct, you govern one number — net-to-company. In channel, you govern two: **partner buy price** (list minus partner margin — what the partner pays you) and **end-customer sell price** (what the partner charges the customer). The gap between them is the partner's gross margin; the gap between end-customer sell price and your costs is the system's total margin. A founder who governs only the partner buy price has governed half the surface — and the ungoverned half (what the partner quotes the end customer) is exactly where margin stacking, channel conflict, and price erosion live.

## Margin Stacking: The Failure Mode That Eats Channel Programs

Margin stacking is the specific, predictable, expensive failure that occurs when the **partner discount** and an **end-customer discount** compound on the same deal. It is the channel equivalent of an unauthorized direct discount, except worse, because in the direct motion the founder at least *sees* the discount before approving it. In a poorly governed channel, the stack assembles itself invisibly.

Here is the mechanic. List price is $100. The partner is a strategic-tier VAR earning 35% structural margin, so the partner's buy price from you is $65. The partner now goes to the end customer. The end customer pushes hard — competitive deal, end of their fiscal year, big logo — and the partner, who wants the deal and whose salesperson is comped on bookings not margin, quotes the customer $72. The partner keeps $7 of margin (better than nothing, the rep gets paid), the customer is delighted, the deal closes. But look at what just happened to *you*: the end customer is now anchored at a 28% effective discount off your list, your net is still $65, and at renewal the customer will fight to keep that $72 price — except by then they may have gone direct, and now your direct team is being asked to renew a deal at a 28% discount that your matrix would never have authorized. The partner's structural 35% and the partner's deal-specific 8% concession **stacked**, and the entity that absorbed the damage was your list integrity and your renewal economics.

Governing against margin stacking requires explicit mechanisms that simply do not exist in a direct matrix. **A price floor** — an absolute net-to-company and an absolute end-customer minimum below which no deal closes without founder/CFO approval, in either motion. **Margin-stack caps** — a rule that the total effective discount off list (partner margin + any end-customer concession) cannot exceed, say, 45%, and anything beyond requires the partner to *request the additional discount from the vendor*, which means the vendor sees it. **Deal-registration-gated end pricing** — the partner must register the end-customer price as part of the deal-reg, so the vendor approves the sell price, not just the buy price. **Special pricing requests (SPR)** — a formal channel process where, when a partner needs to go below the registered price, they apply to the vendor for additional discount and the vendor funds it deliberately rather than letting the partner eat it (and resent it) or pass it through invisibly. The founders who get channel margin right are the ones who understood early that the end-customer price is something they must govern, not something they delegate to the partner along with the structural margin.

## Channel Conflict: Governing the Boundary Between Direct and Partner

The instant a founder runs both motions, a new governance object appears that has no analog in a pure-direct world: the **boundary between the two motions**, and the conflict that erupts when both want the same deal. Channel conflict is not an edge case; it is the default state of a hybrid GTM, and it must be governed deliberately or it governs you.

The conflict has three classic shapes. **Direct vs partner on the same logo:** a direct rep and a VAR are both working ACME Corp; the customer plays them against each other; the price goes to the floor. **Partner vs partner:** two of your resellers bid the same opportunity; same race to the bottom, except now you have two angry partners. **Channel cannibalization of direct:** a deal that would have closed direct at a 20% discount instead closes through a partner who gets 35% structural margin — you converted a healthy direct deal into a dilutive channel deal for no incremental reach.

Governing this requires **rules of engagement** — a written, enforced policy that allocates opportunities between motions *before* the conflict happens. The mechanisms: **deal registration as the arbiter** (whoever registers first, and is approved, owns the deal — first-come-first-served with vendor confirmation), **account segmentation** (named accounts above a certain size are direct-only; everything below a threshold is channel-only or channel-preferred; the middle is contested but registration-governed), **a defined SLA on registration approval** (a partner who registers a deal and waits two weeks for an answer has been told the program is not real), and **a neutral arbiter** — at founder stage, the deal desk or a channel ops person who does not carry a direct quota and is therefore not conflicted. The cardinal sin is letting the direct sales leader adjudicate channel conflict: that person is structurally incentivized to rule for direct, partners learn the program is rigged, and your best partners stop bringing you deals. Channel conflict governance, more than almost any other element, is where founders learn that the channel motion needs an **owner who is organizationally separate from direct sales** — because the governance is fundamentally about adjudicating *between* the two motions, and an adjudicator inside one of them cannot be trusted by the other.

## The Approval Workflow: Seniority-Gated vs Registration-Gated

The mechanics of *how an approval actually happens* diverge sharply between the two motions, and founders who do not redesign the workflow simply jam channel deals through a system built for direct concessions — slowly, and with the wrong information.

**Direct approvals are seniority-gated and deal-shaped.** A discount request routes up a ladder based on depth and non-standard terms. The approver is asking: does this deal need this concession, is the precedent acceptable, is the shape of the deal sound. The information the approver needs is the deal itself — the competitive situation, the term, the ramp, the renewal exposure. The CPQ system enforces the routing; the deal desk adjudicates the exceptions. Speed target: rep self-serve instant, manager same-day, deal desk 24-48 hours, founder-level 48-72 hours.

**Channel approvals are registration-gated and program-shaped.** The primary "approval" is not a discount approval — it is a **deal registration approval**: is this a real opportunity, is this partner the right partner for it, does it conflict with a direct pursuit or another partner, and is the registered end-customer price within program rules. Once a deal is registered and approved, the partner's structural margin is *automatic* — there is no per-deal approval of the 35%, because the 35% is a program parameter. The only per-deal approval in a well-run channel is the **exception**: a special pricing request when the partner needs to go below the registered/floor price. The approver of a registration is asking program questions (conflict, fit, fraud, end-price discipline), not deal-shape questions. The approver of an SPR is asking margin-floor questions. The information needed is different, the approver is different (channel ops, not the direct sales VP), and the speed target is *more aggressive*, not less — a partner who waits days for registration approval will simply stop registering, and an unregistered channel is an ungoverned channel. Founders who run one workflow for both motions end up with channel deals waiting in a queue behind direct deals, adjudicated by people asking the wrong questions, and partners quietly routing around the program.

## Tooling: CPQ, PRM, and Where the Two Systems Connect

The tooling stack reveals the structural difference between the two motions as clearly as anything. The direct motion lives in **CPQ** (Configure-Price-Quote — Salesforce CPQ/Revenue Cloud, DealHub, Subskribe, or for founder-stage companies often a heavily customized Salesforce opportunity + a structured deal desk in Slack). CPQ enforces the discount matrix: it knows the list price, calculates the discount, routes the approval based on depth and terms, and blocks a quote from being sent if the approval is not in place. The discount matrix is *encoded in CPQ approval rules* — that encoding IS the governance.

The channel motion lives in a **PRM** (Partner Relationship Management — PartnerStack, Impartner, Allbound, Crossbeam for ecosystem mapping, or again a customized Salesforce Partner Community at founder stage). The PRM is where partner tiers are defined, where deals are registered, where registration approvals route, where MDF and rebates are tracked, and where the partner sees their pricing. The critical and frequently-botched piece is **the connection between the two systems**: a deal registered in the PRM must create or link to an opportunity in CRM/CPQ so that (a) the direct team can *see* it and not collide with it, (b) the registered end-customer price flows into the same pricing governance, and (c) the deal desk has one view of total pipeline across both motions. Founders who run the channel in a spreadsheet, or in a PRM that does not talk to their CPQ, have a channel they cannot govern — registrations the direct team cannot see, partner prices the deal desk cannot audit, and a margin picture that only assembles itself after the quarter closes. The price floor must be enforced in *both* systems with the same number. If your CPQ blocks anything below 45% off list but your PRM lets a partner register a deal at 55% off, you do not have a price floor — you have a suggestion.

## Comp Design: Why Channel Margin and Direct Comp Trade Off

A governance discussion that ignores comp is incomplete, because **partner margin and direct sales comp are the same line on your P&L wearing different costumes** — they are both your cost of acquiring the customer — and a founder who does not see them as a single budget will mis-fund one of them.

In the direct motion, the cost of sale is the rep's OTE plus the discount they give. The discount matrix governs the second half of that; the comp plan governs the first. A well-designed direct comp plan **reinforces the discount matrix**: reps are comped on a metric that makes discounting expensive *to the rep* — net revenue or, better, a margin-adjusted bookings number, or a comp accelerator that only kicks in on deals above a discount threshold and a decelerator below it. If the rep is comped purely on gross bookings, the discount matrix is fighting the comp plan, and the comp plan wins. Founders must align them: the matrix says "you may discount this far," and the comp plan says "but it costs you to."

In the channel motion, the **partner margin IS the channel's cost of sale** — you are not paying a rep's salary, you are letting the partner keep 30%+ of the price. This is why a channel deal can carry a higher discount than your direct matrix allows and *still be more profitable*: the 35% you "gave away" to the partner replaced the ~25-35% fully-loaded cost of a direct rep selling, supporting, and renewing that deal. But this only works if the founder governs it as a *trade*. The failure mode is paying *both*: a direct rep gets quota credit and commission on a channel-sourced deal (the "channel overlay" or "channel-neutral comp" decision), AND the partner keeps full margin, AND the customer got a discount — now you are paying three costs of sale on one deal. The governance rule: decide deliberately how channel deals comp the direct org (full credit, partial overlay, or none), fund the partner margin out of either a higher list or a lower direct cost on those deals, and never let the same deal carry a full direct comp load and a full partner margin and a customer concession. The discount-authority governance and the comp governance are one system; founders who run them in separate rooms overpay for revenue.

## Funding the Channel: Higher List, Lower Floor, or Margin Sacrifice

Once a founder accepts that partner margin is a structural cost, the next governance question is unavoidable: **where does the money come from?** There are exactly three sources, and the choice among them is itself a governance decision that determines whether the channel is accretive or dilutive.

**Option one: a higher list price.** The company sets list high enough that even after the partner's structural margin, the net-to-company on a channel deal clears the same margin floor as a direct deal. This is the cleanest approach and the one most disciplined channel companies use — but it has a governance cost: now the *direct* team is selling off a list price inflated to fund the channel, which means direct deals show artificially deep discounts, and the direct discount matrix has to be re-baselined so a "30% direct discount" off the channel-funded list is actually the same net as a "15% discount" off a pure-direct list would have been. If you raise list to fund the channel and *don't* re-baseline the direct matrix, your direct reps will blow through the matrix on every deal because the list is fictional to them.

**Option two: a lower margin floor on channel deals.** The company accepts that channel deals net less than direct deals, on the theory that the channel delivers lower CAC, faster geographic/segment reach, and implementation capacity the company would otherwise have to build. This is legitimate — but it must be a *governed decision with a number attached*, not a drift. The governance artifact is an explicit, founder-and-CFO-approved channel margin floor that is lower than the direct floor by a defined amount, with the difference justified by a defined CAC or reach benefit.

**Option three: margin sacrifice with no compensating benefit** — which is not a strategy, it is the absence of one, and it is what founders end up with by default when they grant partner margin without deciding which of the first two options funds it. The governance discipline is simply forcing the decision: every channel program should have a one-page economic model that says "partner margin is X%, it is funded by [higher list / lower floor], the net-to-company on a channel deal is Y, and Y is acceptable because Z." A founder who cannot fill in that sentence does not have a channel program — they have a discount they are giving to other companies.

## Price Floors: The One Control Both Motions Must Share

Almost everything about direct and channel discount governance is different. The **price floor** is the exception — it is the single control that must be identical, shared, and absolute across both motions, and it is the most important governance artifact a hybrid-GTM founder owns.

The price floor is the absolute net-to-company number — expressed as a maximum total effective discount off list, or as a minimum net dollar figure, or both — below which **no deal closes in any motion without explicit founder and CFO sign-off.** Not deal desk. Not the channel VP. Founder and CFO, every time, no exceptions, by design. The floor exists because both motions have a gravitational pull toward zero margin: the direct rep wants the deal, the partner wants the deal, the customer always wants a lower price, and quarter-end amplifies all of it. The floor is the hard stop that says "below this line, the deal is presumptively bad for the company, and only the two people who own the company's economics can decide it is worth doing anyway."

For the floor to actually function as a shared control, three things must be true. **One: it is the same number in both systems** — encoded in CPQ for direct, encoded in the PRM for channel, and the channel number accounts for the *stacked* discount (partner margin + end-customer concession), not just one layer. **Two: it is expressed as net-to-company, not as a discount percentage** — because a 40% discount means different things on a channel deal and a direct deal, but "$58 net on a $100 list product" means the same thing everywhere. **Three: hitting the floor triggers the same escalation regardless of motion** — the founder and CFO see a direct deal at the floor and a channel deal at the floor through the same exception queue, with the same information, and decide with the same authority. The price floor is the seam that holds the two governance systems together. Get everything else slightly wrong and you lose margin points; lose the floor and you lose the company's pricing power entirely, because you will have no line that anyone, in any motion, is actually forbidden to cross.

## Deal Registration: Mechanics, Abuse, and Enforcement

Deal registration deserves its own deep treatment because it is simultaneously the most powerful governance tool in the channel motion and the most frequently abused. Done well, it is the spine of channel governance. Done badly, it is a margin giveaway with paperwork.

**The mechanics.** A partner identifies an opportunity and submits a registration: end-customer name, opportunity details, expected deal size, expected close date, and — critically — the proposed end-customer price. The vendor's channel ops reviews against four tests: **is it real** (not a fishing expedition or a pre-emptive land-grab on every Fortune 500 name), **is it conflicting** (already worked by direct or another partner), **is it the right partner** (capability fit for this customer), and **is the proposed end price within program rules**. If approved, the partner gets a defined benefit: protected margin (an extra discount tier over unregistered deals, typically +5-15 points), a defined protection period (60-120 days, renewable on evidence of progress), and exclusivity against other partners on that opportunity.

**The abuse patterns** every founder must govern against: **speculative registration** (partners registering every logo they can name to lock out competitors and direct — countered by requiring evidence of a real opportunity and expiring stale registrations), **registration of deals the partner did not source** (a partner registering a deal that direct or marketing actually originated, to claim protected margin — countered by source-of-origination tracking and a contestable-registration process), **price sandbagging** (registering at a high end price to get approval, then quoting low — countered by binding the registered price and requiring an SPR to go below it), and **registration as renewal capture** (registering an existing customer's renewal that the partner had nothing to do with originating).

**Enforcement** is what makes registration real. A registration program with no teeth — where stale registrations never expire, where speculative registrations are always approved, where the registered price is "guidance" not a rule — trains partners that registration is free margin. A registration program with teeth — fast approvals for real deals, fast rejections for fishing, hard expiration, binding registered prices, and a credible contestability process — makes partners *want* to register, because registration is where the protected margin is, and protected margin is only available to partners who play by the rules. The founder's governance job is to make registration the path of least resistance for honest partners and a dead end for the others.

## Benchmarks and Real Numbers: What Good Looks Like

Governance without benchmarks is just opinion, so here are the operating ranges a founder should calibrate against. These vary by category, ACV, and product complexity, but the bands are well established across B2B software and hardware-adjacent channels.

**Direct enterprise discount depth.** Median realized discount off list on enterprise software deals runs roughly **18-30%**; the *authorized* ceiling before founder-level approval typically sits at **35-40%**. Rep self-serve authority: **8-15%**. Deals closing above 40% off list should be a small single-digit percentage of total — if more than ~10-15% of your direct deals need founder-level discount approval, your list price or your matrix is mis-set. End-of-quarter discount inflation (the gap between mid-quarter and last-week realized discount) is normal but should be governed to **under ~8-10 points**; beyond that, the matrix is being routed around.

**Channel partner margin.** Structural partner margin by tier: transactional/registered resellers **15-25%**, committed/gold-tier VARs **25-35%**, strategic/elite partners and SIs that carry significant pre-sales and implementation **30-40%+**. Deal registration protection: **+5-15 points** over the unregistered rate. Distribution (two-tier, where a distributor sits between vendor and reseller) adds another **3-7 points** of margin into the stack. MDF (market development funds) typically runs **1-5% of partner-sourced revenue**; rebates for tier attainment another **2-6%**.

**The stacked number that matters.** The total effective discount off list on a channel deal — partner margin + any end-customer concession + distribution margin — is the number a founder must govern, and it should have a hard cap. A reasonable founder-stage margin-stack cap is **40-50% total**; anything beyond requires a vendor-funded SPR. Channel deals where the *net-to-company* falls below the direct margin floor should be rare and explicitly approved.

**Mix and economics.** Channel-sourced revenue at companies running deliberate hybrid GTM commonly lands at **20-45% of total**; below 15% the channel is usually not yet governed seriously, above ~50% the company is effectively a channel company and the governance center of gravity should shift accordingly. Channel CAC is typically **20-40% lower** than direct CAC for comparable deals when the program is healthy — that delta is the justification for the structural margin, and if a founder cannot demonstrate it, the channel is not earning its margin. Renewal rates on channel-sourced deals are often **2-8 points lower** than direct unless the partner is contractually and economically tied into the renewal — a governance gap founders consistently underweight.

## Five Named Scenarios: How This Plays Out in Practice

**Scenario 1 — "The copy-paste matrix."** A 40-person infrastructure-software company, $6M ARR, all direct, hires its first channel lead. The founder hands the new channel lead the existing direct discount matrix and says "use this." The channel lead, reasonably, tells the first three VARs they get "up to 35%, same as our top discount tier." Within two quarters, those VARs are stacking end-customer discounts on top of the 35%, average channel net-to-company is 22 points below direct, and the founder discovers it only when the CFO models blended gross margin for the board deck. **The fix:** rip out the copy-pasted matrix, build a proper tier model with structural margins funded by a re-baselined list, install deal registration, set a 45% margin-stack cap. Lesson: the direct matrix is not a channel program and never was.

**Scenario 2 — "The channel conflict spiral."** A vertical SaaS company runs direct and channel in the same mid-market segment with no rules of engagement. A direct rep and a regional VAR end up on the same 300-seat deal. The customer, sensing blood, plays them. The deal closes at 41% off list — worse than either motion's normal — and now both the rep and the partner are furious, the rep because "the channel undercut me," the partner because "direct was never supposed to be in my territory." Two more deals collapse the same way before anyone names the problem. **The fix:** written rules of engagement, account segmentation (named accounts direct, the rest channel-led), deal registration as the first-come arbiter, and a neutral channel-ops adjudicator who carries no direct quota. Lesson: the boundary between motions is itself a governed object.

**Scenario 3 — "The funded channel done right."** A data-tooling company decides from the start to be channel-heavy. Before signing a single partner, the founder and CFO build the one-page economic model: list price set 25% higher than a pure-direct company would set it, partner structural margin of 30%, net-to-company on a channel deal that clears the same floor as direct, direct matrix re-baselined against the higher list. Deal registration live in the PRM from day one, wired into CPQ so direct sees every registered deal. Eighteen months later channel is 38% of new ARR, blended gross margin is *flat* to the all-direct period, and channel CAC is 31% below direct. **The lesson:** the channel was accretive because the funding decision was made deliberately and governed, not discovered after the fact.

**Scenario 4 — "The registration abuse problem."** A security vendor's channel program is growing fast, and the team, eager to keep partners happy, approves essentially every deal registration that comes in. Within a year, three large partners have collectively "registered" most of the addressable enterprise accounts in their regions — including dozens the vendor's own marketing team originated. Direct reps find their pipeline is full of accounts already locked under partner protection. **The fix:** evidence requirements for registration, source-of-origination tracking, hard 90-day expiration, a contestable-registration process, and a quarterly registration audit. Lesson: registration without enforcement is just margin with paperwork.

**Scenario 5 — "The comp double-pay."** A company with a healthy direct team adds a channel and, to keep the direct org from sabotaging it, gives direct reps full quota credit and full commission on channel-sourced deals — "channel-neutral comp." It works for partner relations but the founder never modeled the cost: the company is now paying a full direct comp load AND a 32% partner margin AND a customer discount on the same deals. Effective cost of sale on channel deals is *higher* than direct. **The fix:** move to a partial overlay (direct gets reduced credit on channel-sourced deals, full credit only on deals they actively co-sell), and fund the partner margin out of the list premium rather than out of contribution margin. Lesson: discount governance and comp governance are one budget.

## Stage-by-Stage Evolution: From First Deal to Mature Hybrid GTM

Discount-authority governance is not static — it must evolve as the company moves through stages, and founders who freeze the governance at one stage break it at the next.

**Stage 1 — Founder-led, pre-channel ($0-3M ARR).** The founder is the discount matrix. Every meaningful deal crosses the founder's desk; the "deal desk" is the founder's judgment. This is fine and correct — but the founder should be *writing down* the decisions, because the implicit matrix in their head becomes the explicit matrix the first sales hire needs.

**Stage 2 — First sales team, still direct ($3-10M ARR).** The implicit matrix becomes an explicit tiered matrix encoded in CPQ. A real deal desk forms — even if it is the founder plus finance, twice a week. Non-price levers get governed. This is the stage to get the *direct* governance genuinely solid, because everything that comes next is built on it.

**Stage 3 — First channel motion ($8-20M ARR).** The fork. The founder must now build a *second* governance system — partner tiers, deal registration, margin schedule, rules of engagement, a price floor shared with direct — and, critically, hire or assign a **channel/partner ops owner who is organizationally separate from direct sales.** This is the stage where copy-pasting the direct matrix kills the channel; it is also the stage where most founders do exactly that.

**Stage 4 — Scaled hybrid GTM ($20-75M ARR).** Both systems are real, both have dedicated owners, the deal desk adjudicates direct exceptions, channel ops adjudicates registrations and SPRs, and the founder/CFO own only the shared price floor and the program-level economics. Governance is now about the *seam*: keeping the two systems consistent, the data connected, the conflict rules enforced.

**Stage 5 — Channel-led or ecosystem GTM ($75M+ ARR).** If channel becomes the majority motion, the governance center of gravity shifts: the channel program becomes the primary pricing-governance system and the direct motion becomes the exception (often "strategic accounts only"). The founder's job becomes governing the *program*, not the deals.

The failure pattern is stage lag: running Stage 4 complexity on Stage 2 governance. A founder who has a channel doing 30% of revenue but still adjudicates partner deals through the direct deal desk is two stages behind their own business.

## The Org Question: Who Owns Discount Authority in Each Motion

Governance is partly about rules and partly about *who enforces them*, and the org design for the two motions must be deliberately different — sharing an owner across both is one of the most common and most damaging founder mistakes.

**Direct discount authority** is owned by a **deal desk** that reports into finance/revenue operations, *not* into sales. This matters: if the deal desk reports to the CRO, the deal desk's "no" is overruleable by the person whose comp depends on the deal closing. The deal desk needs structural independence to function as a court rather than a rubber stamp. At founder stage the deal desk may be one finance person plus the founder; the principle holds regardless of size.

**Channel discount authority** — tiers, registration, margin schedule, SPRs — is owned by a **channel/partner operations** function that is *also* organizationally separate from direct sales, and ideally separate from the channel sales team too, for the same reason: the channel sales leader is incentivized to approve registrations and grant SPRs to keep partners happy and hit channel number. Channel ops governs; channel sales sells. At founder stage this might be one person wearing the channel-ops hat part-time, but they cannot be the same person carrying the channel quota.

**The shared layer** — the price floor and the program economics — is owned by the **founder and CFO** jointly. They own the one number both motions cannot cross, and they own the funding model that decides whether the channel is accretive.

The cardinal org sin is making the **direct sales leader the owner of channel governance**, or vice versa. The direct leader will adjudicate channel conflict for direct and starve the partners; a channel leader given direct discount authority will route deals to partners to grow their number. The two motions need governance owners who are peers, both independent of the sales teams they govern, both reporting up to a founder/CFO who owns the shared floor. Founders who get the org wrong cannot fix the governance with better rules — the rules will be enforced by someone structurally motivated to bend them.

## A Decision Framework: How to Set Authority in Each Motion

When a founder sits down to actually design these two systems, the decisions should be made in a deliberate order, because later decisions depend on earlier ones.

**Decision 1 — Set the price floor first.** Before any matrix, any tier model: what is the absolute net-to-company below which no deal closes without founder/CFO sign-off? Everything else is built inside this boundary.

**Decision 2 — Build the direct matrix inside the floor.** Tier the depth authority (self-serve, manager, deal desk, VP, founder), add the second axis for non-standard terms, encode it in CPQ, stand up the deal desk. This is the system the channel governance will be calibrated against.

**Decision 3 — Decide the channel funding model before designing partner margin.** Higher list, lower channel floor, or a deliberate blend — and write the one-page economic model. Do not pick a partner margin number until you know where it is funded from.

**Decision 4 — Design partner tiers and the structural margin schedule.** Two or three tiers, earned and re-earned, with structural margins that the funding model can actually support while still clearing the price floor.

**Decision 5 — Build deal registration as the channel's spine.** Mechanics, the four approval tests, the protection benefit, expiration, binding registered prices, the contestability process.

**Decision 6 — Write the rules of engagement.** Account segmentation, the conflict arbiter, registration as first-come arbiter, the registration-approval SLA.

**Decision 7 — Set the margin-stack cap and the SPR process.** The total-effective-discount ceiling, and the formal process for partners to request vendor-funded discount below it.

**Decision 8 — Align comp in both motions.** Direct comp that makes discounting cost the rep; a deliberate decision on how channel-sourced deals credit the direct org; never a full direct load plus full partner margin on one deal.

**Decision 9 — Assign the owners.** Deal desk for direct (independent of sales), channel ops for channel (independent of channel sales), founder/CFO for the shared floor.

**Decision 10 — Connect the systems.** CPQ and PRM wired together, the floor enforced identically in both, one view of total pipeline. A founder who works these ten decisions in order builds two governance systems that fit together. A founder who skips to Decision 4 — "what discount do I give partners?" — without Decisions 1 and 3 has started in the middle and will rebuild the whole thing within a year.

## The Five-Year and AI Outlook: Where Discount Governance Is Heading

Discount-authority governance is being reshaped by three forces a founder designing a system today should build *toward*, not just *for*.

**Force one — AI-driven deal desks and guided selling.** The per-deal adjudication that a human deal desk does today is increasingly assisted, and will be increasingly automated, by AI that scores a discount request against thousands of historical deals: "this 31% request on this deal shape has a 12% margin-erosion precedent risk and an 8% likelihood of being unnecessary based on competitive signal." This makes the *matrix* less of a static table and more of a dynamic, learned policy — but it makes the price floor *more* important, not less, because the AI optimizes within the boundaries you set, and a fuzzy floor means a fuzzy boundary for the optimizer.

**Force two — AI in the channel: registration scoring and stack detection.** The same intelligence applied to the channel will score deal registrations for likelihood of being speculative, detect margin-stacking patterns across partners in near-real-time rather than at quarter close, and flag channel-conflict collisions the moment two opportunities point at the same logo. The founders who win here will have *clean, connected data* — a PRM wired to CPM — because AI governance is only as good as the pipeline it can see.

**Force three — ecosystem and marketplace GTM.** Cloud marketplaces (AWS, Azure, GCP), product-led channels, and embedded/OEM motions are creating a *third* category that is neither classic direct nor classic VAR — and it has its own discount governance shape (marketplace fees as a structural cost, private-offer pricing, co-sell incentives). The founder building governance today should design the direct/channel split as *two of N motions*, not the only two, and keep the price floor as the universal control that extends to whatever motions come next.

The throughline across all three: the *judgment* layer of discount governance gets more automated, the *boundary* layer (the price floor, the program economics, the funding model) gets more important and stays human, founder-and-CFO-owned. Build the boundaries cleanly now and the automation has something solid to optimize within. Build them fuzzily and you will be automating the erosion of your own margin.

## The Final Framework: Two Systems, One Floor

The complete answer to how discount-authority governance differs between direct enterprise and channel/VAR motions reduces to a single architecture a founder can hold in their head.

**You run two governance systems, deliberately separate.** The **direct system** governs *concession authority* on a single negotiating surface: a tiered discount matrix with a non-standard-terms axis, encoded in CPQ, adjudicated by an independent deal desk, reinforced by a comp plan that makes discounting cost the rep, escalating by seniority. The **channel system** governs *structural margin and end-price discipline* on a two-sided surface: a partner tier model with earned structural margins, a deal registration spine, rules of engagement that govern the boundary with direct, a margin-stack cap and SPR process, all run through a PRM and owned by a channel-ops function independent of channel sales, escalating by registration rather than seniority.

**The two systems share exactly one control: the price floor** — an absolute net-to-company number, expressed in dollars not percentages, enforced identically in CPQ and PRM, accounting for the full stacked discount on channel deals, and crossable only with joint founder/CFO sign-off. The floor is the seam.

**And the two systems share one economic truth:** partner margin and direct comp are the same line on the P&L — the cost of acquiring the customer — and the channel is accretive only if the founder *deliberately funds* the partner margin (higher list, lower channel floor, or a governed blend) and *deliberately decides* how channel deals load the direct comp plan. A founder who builds these two systems as genuinely separate disciplines, connects their data, shares only the floor, and funds the channel on purpose has a hybrid GTM where the channel extends reach and lowers CAC without compressing margin. A founder who runs one matrix for both, lets the systems drift apart, and discovers the funding model after the fact has trained their own partners to undercut their direct team — and will spend the next two years rebuilding the governance they should have designed before signing the first partner. Two systems, one floor, funded on purpose. That is the whole answer.

`;

const flow = `

## Decision Flow: Routing a Discount Request Through the Right Governance System

\`\`\`mermaid
flowchart TD
  A[Discount Or Pricing Request Arrives] --> B{Which Motion}
  B -->|Direct Enterprise| C[Direct Governance System]
  B -->|Channel Or VAR| D[Channel Governance System]

  C --> C1{Discount Depth Off List}
  C1 -->|0 to 12 Percent| C2[Rep Self Serve No Approval]
  C1 -->|12 to 22 Percent| C3[Front Line Manager Approval]
  C1 -->|22 to 32 Percent| C4[Deal Desk Adjudication]
  C1 -->|32 to 40 Percent| C5[CRO Or VP Approval]
  C1 -->|Above 40 Percent| C6[Founder And CFO Sign Off]
  C2 --> C7{Touches Non Standard Terms}
  C3 --> C7
  C4 --> C7
  C7 -->|Two Or More Levers| C5
  C7 -->|None Or One| C8[Encode In CPQ And Send Quote]
  C5 --> C9{Below Shared Price Floor}
  C6 --> C9

  D --> D1{Is Deal Registered}
  D1 -->|No| D2[Run Deal Registration First]
  D2 --> D3{Four Tests Real Conflict Fit End Price}
  D3 -->|Fails| D4[Reject Registration]
  D3 -->|Passes| D5[Approve Registration Grant Protected Margin]
  D1 -->|Yes| D5
  D5 --> D6[Structural Tier Margin Applies Automatically]
  D6 --> D7{Partner Needs Price Below Registered}
  D7 -->|No| D8[Partner Quotes At Registered End Price]
  D7 -->|Yes| D9[Special Pricing Request To Vendor]
  D9 --> D10{Total Stacked Discount Vs Cap}
  D10 -->|Within 40 to 50 Percent Cap| D11[Channel Ops Approves SPR]
  D10 -->|Exceeds Cap| C9

  C8 --> Z[Deal Closes Within Governance]
  D8 --> Z
  D11 --> Z
  C9 -->|Approved| Z
  C9 -->|Rejected| Z2[Deal Reworked Or Walked]
\`\`\`

## Comparison Matrix: Direct Enterprise Governance vs Channel VAR Governance

\`\`\`mermaid
flowchart LR
  subgraph DIRECT[Direct Enterprise Discount Governance]
    DA[What Is Governed: Concession Depth On One Surface]
    DB[Governing Artifact: Tiered Discount Matrix In CPQ]
    DC[Approval Logic: Seniority Gated By Depth And Terms]
    DD[Primary Owner: Independent Deal Desk In Finance]
    DE[Per Deal Question: Does This Deal Need This Concession]
    DF[Key Failure Mode: Unauthorized Depth And Non Standard Terms]
    DG[Comp Link: Plan Makes Discounting Cost The Rep]
    DH[Tool: CPQ DealHub Subskribe Salesforce]
    DA --> DB --> DC --> DD --> DE --> DF --> DG --> DH
  end

  subgraph CHANNEL[Channel And VAR Discount Governance]
    CA[What Is Governed: Structural Margin Plus End Price On Two Surfaces]
    CB[Governing Artifact: Partner Program Tiers And Registration]
    CC[Approval Logic: Registration Gated Not Seniority Gated]
    CD[Primary Owner: Channel Ops Independent Of Channel Sales]
    CE[Per Deal Question: Is It Registered And Is End Price Within Rules]
    CF[Key Failure Mode: Margin Stacking And Channel Conflict]
    CG[Comp Link: Partner Margin Is The Cost Of Sale Itself]
    CH[Tool: PRM PartnerStack Impartner Allbound]
    CA --> CB --> CC --> CD --> CE --> CF --> CG --> CH
  end

  subgraph SHARED[Shared Control Layer]
    SA[Price Floor: Absolute Net To Company In Dollars]
    SB[Enforced Identically In CPQ And PRM]
    SC[Accounts For Full Stacked Discount On Channel Deals]
    SD[Crossable Only With Joint Founder And CFO Sign Off]
    SE[Economic Truth: Partner Margin And Direct Comp Are One Budget]
    SA --> SB --> SC --> SD --> SE
  end

  DH --> SA
  CH --> SA
\`\`\`

`;

const src = `

## Sources

1. **Gartner — B2B Sales Discounting and Deal Desk Practices** — Research on discount approval workflows, deal desk structure, and realized-discount benchmarks in enterprise software.
2. **Forrester — Channel and Partner Program Management Research** — Partner tiering, deal registration, and channel conflict frameworks for B2B technology vendors.
3. **Salesforce CPQ / Revenue Cloud Documentation — Discount Approval Rules** — Mechanics of encoding a discount authority matrix into CPQ approval routing. https://help.salesforce.com
4. **DealHub — Deal Desk and CPQ Approval Workflow Guides** — Practical guidance on building tiered discount authority and non-standard-term governance. https://dealhub.io
5. **Subskribe — Quote-to-Revenue and Discount Governance Resources** — Founder-stage CPQ and deal desk design.
6. **PartnerStack — Partner Program and Deal Registration Documentation** — PRM mechanics for tiering, registration, and partner margin schedules. https://partnerstack.com
7. **Impartner — Channel Management and Deal Registration Best Practices** — Registration abuse patterns and enforcement. https://impartner.com
8. **Allbound — Partner Relationship Management Resources** — Channel program structure and partner enablement governance.
9. **Crossbeam — Ecosystem Mapping and Channel Conflict Data** — Account overlap detection between direct and partner pipelines. https://crossbeam.com
10. **OpenView Partners — SaaS Benchmarks and Go-to-Market Reports** — Channel-mix-of-revenue benchmarks, CAC by motion, hybrid GTM economics.
11. **SaaStr — Channel and Partnership Content Library** — Founder-stage channel program design and the direct-vs-channel conflict.
12. **Winning by Design — Revenue Architecture and Deal Desk Frameworks** — Concession governance and the role of the deal desk as adjudicator.
13. **Pavilion (formerly Revenue Collective) — RevOps and Deal Desk Community Practices** — Practitioner benchmarks on discount authority matrices and approval SLAs.
14. **Harvard Business Review — "How to Stop Customers from Fixating on Price"** — Anchoring and concession psychology relevant to direct discount governance.
15. **Simon-Kucher & Partners — Pricing and Discounting Research** — Discount leakage, pocket-price waterfall, and the cost of non-price concessions.
16. **McKinsey — "Pricing: The next frontier of value creation in B2B"** — Pocket-margin analysis and the structural cost of channel margin.
17. **The Pricing Council / Professional Pricing Society — Channel Pricing Materials** — MAP/MSRP discipline, two-tier distribution margin stacking.
18. **CompTIA — IT Channel Research and VAR Economics** — VAR margin benchmarks, deal registration norms in the IT reseller channel.
19. **Channel Partners / Channel Futures — VAR and MSP Margin Reporting** — Realized partner margin ranges by partner type and value-add.
20. **AWS Marketplace and Partner Network — Co-Sell and Private Offer Documentation** — Marketplace-fee-as-structural-cost and the emerging third GTM motion. https://aws.amazon.com/marketplace
21. **Microsoft Partner Network / Azure Marketplace — Partner Incentives Guide** — MDF, co-sell incentives, and marketplace pricing governance.
22. **Vendr / Tropic — B2B SaaS Buyer-Side Discount Data** — Buyer-side visibility into realized enterprise discount depth and end-of-quarter inflation.
23. **Insight Partners / Bessemer — Cloud GTM and Channel Strategy Notes** — Stage-by-stage GTM evolution and when to add a channel motion.
24. **CIO.com / Channelnomics — Channel Conflict and Rules of Engagement Articles** — Practitioner frameworks for direct-vs-partner account allocation.
25. **HubSpot Solutions Partner Program (public program structure)** — A widely studied reference model for tiered partner margin and registration design.
26. **Atlassian Partner Program (public program structure)** — Reference model for transactional vs solution-partner tiering.
27. **Snowflake / Databricks Partner Network materials** — Reference models for SI-heavy channel margin and co-sell governance.
28. **MEDDIC / MEDDPICC Sales Methodology Resources** — Deal qualification inputs feeding deal desk adjudication.
29. **RevOps Co-op Community — Deal Desk and Channel Ops Practitioner Threads** — Founder-stage org design for deal desk and channel ops independence.
30. **Bain & Company — "Is Your Sales Force Discounting Too Much?"** — Discount authority matrix design and approval-seniority calibration.
31. **Forrester / SiriusDecisions — Partner Lifecycle and Deal Registration Lifecycle Models** — Registration protection periods, expiration, and contestability.
32. **G2 / Capterra PRM and CPQ Category Pages** — Tooling landscape for PRM and CPQ at founder stage. https://www.g2.com

`;

const num = `

## Numbers

**Direct Enterprise Discount Depth**
- Rep self-serve discount authority: 8-15% off list
- Front-line manager authority: 12-22% off list
- Deal desk / VP Sales authority: 22-32% off list
- CRO / VP authority: 32-40% off list
- Founder + CFO required: above 40% off list, or any deal touching 2+ non-standard terms
- Median realized enterprise software discount off list: 18-30%
- Deals needing founder-level approval (healthy): under 10-15% of total direct deals
- End-of-quarter discount inflation (governed ceiling): under 8-10 points
- Approval SLA targets: rep instant, manager same-day, deal desk 24-48 hrs, founder-level 48-72 hrs

**Channel Partner Structural Margin (off list)**
- Transactional / registered reseller tier: 15-25%
- Committed / gold-tier VAR: 25-35%
- Strategic / elite partner or SI with pre-sales + implementation: 30-40%+
- Deal registration protection (extra over unregistered rate): +5-15 points
- Two-tier distribution adds (distributor margin into the stack): +3-7 points
- MDF (market development funds): 1-5% of partner-sourced revenue
- Tier-attainment rebates: 2-6% of partner revenue

**The Stacked Number (what founders must actually govern)**
- Margin-stack cap (partner margin + end-customer concession + distribution): 40-50% total effective discount off list
- Anything above the cap: requires a vendor-funded Special Pricing Request (SPR)
- Channel net-to-company below the direct margin floor: should be rare and explicitly founder/CFO-approved

**Channel Economics and Mix**
- Channel-sourced revenue at deliberate hybrid-GTM companies: 20-45% of total
- Below 15% channel mix: channel usually not yet governed seriously
- Above ~50% channel mix: company is effectively channel-led, governance center of gravity should shift
- Channel CAC vs direct CAC (healthy program): 20-40% lower
- Channel-sourced renewal rate vs direct: 2-8 points lower unless partner is economically tied to renewal
- Deal registration protection period: 60-120 days, renewable on evidence of progress

**Channel Funding Model**
- Higher-list funding: list set ~15-30% above pure-direct level to fund partner margin while clearing the floor
- If list is raised to fund channel: direct discount matrix MUST be re-baselined or direct reps blow through it
- Lower-floor funding: channel margin floor set deliberately below direct floor, by a defined amount, justified by a defined CAC/reach benefit
- Required artifact: a one-page economic model — partner margin X%, funded by [higher list / lower floor], net-to-company Y, acceptable because Z

**Comp Interaction**
- Fully-loaded cost of a direct rep selling/supporting/renewing a deal: ~25-35% of deal value
- This is roughly what the partner's structural margin replaces — which is why a higher channel discount can still be more profitable
- Double-pay failure: full direct comp credit + full partner margin + customer discount on one deal = cost of sale HIGHER than direct
- Channel-neutral comp decision options: full direct credit, partial overlay, or no credit on channel-sourced deals — must be chosen deliberately

**The Shared Price Floor**
- Expressed as: net-to-company in dollars (not a discount %), because % means different things across motions
- Enforced identically in both CPQ (direct) and PRM (channel)
- Channel floor calculation must account for the FULL stacked discount, not just one layer
- Crossable only with: joint founder + CFO sign-off, every time, no delegation

**Stage-by-Stage Governance**
- Stage 1 ($0-3M ARR): founder IS the matrix; write decisions down
- Stage 2 ($3-10M ARR): explicit tiered matrix in CPQ, deal desk forms (founder + finance, 2x/week)
- Stage 3 ($8-20M ARR): build the SECOND system — channel program, registration, separate channel-ops owner
- Stage 4 ($20-75M ARR): two real systems, two owners, founder/CFO own only the shared floor + program economics
- Stage 5 ($75M+ ARR): channel program becomes primary pricing-governance system; direct becomes the exception
- Failure pattern: stage lag — running Stage 4 complexity on Stage 2 governance

**Org Design**
- Direct discount authority owner: deal desk, reports into finance/RevOps — NOT into sales
- Channel discount authority owner: channel ops — separate from direct sales AND from channel sales
- Shared price floor + program economics owner: founder + CFO jointly
- Cardinal sin: direct sales leader owning channel governance (starves partners) or vice versa

**Tooling**
- Direct: CPQ (Salesforce CPQ/Revenue Cloud, DealHub, Subskribe) — encodes the matrix in approval rules
- Channel: PRM (PartnerStack, Impartner, Allbound; Crossbeam for ecosystem overlap)
- Critical requirement: PRM registrations must create/link CRM-CPQ opportunities so direct can SEE them
- Price floor must be the SAME number enforced in both systems

`;

const counter = `

## Counter-Case: When the Conventional Two-System Answer Is Wrong

The architecture above — two governance systems, one shared floor, channel funded on purpose — is the right default for most founders running a hybrid GTM. But it is a default, not a law, and a serious operator should know the conditions under which it is wrong or premature.

**Counter 1 — At true early stage, two systems is over-engineering.** A founder at $1-3M ARR with one part-time reseller does not need a PRM, a tier model, a registration system, and a separate channel-ops function. That is governance theater. At that stage the correct answer is: the founder personally governs every channel deal, hand-writes a one-page partner agreement, and treats the "system" as a few rules in their head. Building the full two-system architecture before there is a channel to govern wastes months and creates process the company will outgrow anyway. The two-system answer applies when channel is real (multiple partners, meaningful mix), not when it is an experiment.

**Counter 2 — Some products should never have a channel at all, which makes the whole question moot.** Highly technical products with long, consultative sales cycles, deep customization, and high implementation risk are often value-destroyed by a channel: the partner cannot sell or support them well, the margin you give up buys you reach you cannot use, and the channel deals churn. For these companies the right answer is not "govern the channel carefully" — it is "do not build one," and invest the energy into direct deal desk excellence instead.

**Counter 3 — The strict separation of owners can be too rigid for a 40-person company.** The principle that the deal desk must be independent of sales and channel ops independent of channel sales is correct at scale — but at founder stage, you may simply not have enough people, and forcing artificial org separation creates more dysfunction than the conflict-of-interest it prevents. Sometimes the honest answer is "the founder is the independent adjudicator for both motions" and that is fine *until* the company is big enough that the founder is the bottleneck. The separation is a destination, not a day-one requirement.

**Counter 4 — A unified discount system can be correct when the "channel" is really just fulfillment.** If your "VARs" do not actually sell — they are procurement vehicles, paper-pushers a customer requires you to invoice through, adding no demand generation or pre-sales — then they are not a sales channel and should not get a sales channel's structural margin. In that case the right move is a thin fulfillment fee (3-8%), governing the deal through the *direct* matrix because your direct team actually sold it, and not pretending it is a channel program. Treating a fulfillment partner like a selling partner is the inverse mistake of the one in the main answer, and just as expensive.

**Counter 5 — The price-floor-as-shared-control breaks down in marketplace and PLG motions.** Cloud marketplaces and product-led channels have pricing dynamics — marketplace fees, automated private offers, self-serve tiers, consumption pricing — where a single net-to-company dollar floor is too blunt. As a company's GTM fragments into many motions, the "one shared floor" model needs to evolve into a more nuanced multi-motion margin policy. The founder who treats the floor as eternal and unchangeable will find it does not fit the third and fourth motions.

**Counter 6 — Sometimes you SHOULD let the channel undercut direct, deliberately.** The main answer treats channel cannibalization of direct as a failure. But there are deliberate strategies — exiting a segment, transitioning a geography to partner-led, using the channel to reach customers your direct team is too expensive to serve — where you *want* the channel to win deals direct would have taken. The governance question then is not "prevent cannibalization" but "manage the transition." Blindly applying anti-conflict rules can block a strategic shift the company actually wants.

**Counter 7 — Over-governance kills channel velocity.** A channel program with a 40-question registration form, a two-week approval SLA, a restrictive margin-stack cap, and an SPR process for every below-list quote will be technically well-governed and commercially dead. Partners route around programs that are slower than just selling something else. There is a real failure mode of *too much* governance — and the symptom is partners who signed up and never transact. Sometimes the right answer is looser rules, faster approvals, and accepting more margin variance in exchange for a channel that actually moves.

**Counter 8 — The whole framing assumes the founder controls the list price.** For companies selling into markets with entrenched distribution, dominant marketplace gatekeepers, or a few buyers with enormous leverage, the founder may not actually control list, MAP, or end-price the way the two-system model assumes. When the channel has more power than the vendor, "governance" becomes "negotiation," and the disciplined matrix-and-floor architecture is partly aspirational. Knowing whether you are the governing party or the governed party is the prerequisite question — and not every founder gets to be the former.

**The honest verdict.** Run the two-system architecture when channel is real, your product suits a channel, you control your pricing, and you are past the stage where the founder can personally govern every deal. Before that, govern simply and personally. And in all cases, remember that governance is a means — a healthy, growing, margin-accretive revenue engine — not an end. A beautifully governed channel that no partner wants to transact through has failed exactly as completely as an ungoverned one that compresses your margin. The two-system model is the right answer to the question as asked; it is not a substitute for the judgment about whether, when, and how hard to apply it.

`;

const links = `

## Related Pulse Library Entries

- **q9550** — How should a founder structure a direct enterprise discount authority matrix? (The direct-side governance system in full depth.)
- **q9552** — How do you build a deal desk as a founder before you have a RevOps team? (The adjudication body for the direct motion.)
- **q9553** — What is deal registration and how should a founder design a partner registration program? (The spine of the channel governance system.)
- **q9554** — How do you prevent and arbitrate channel conflict in a hybrid GTM? (Rules of engagement deep dive.)
- **q9555** — How should a founder price a product to fund a channel margin? (The channel funding model — higher list vs lower floor.)
- **q9556** — When should a founder add a channel or VAR motion to a direct sales business? (Stage timing for the fork.)
- **q9557** — How do you design partner tiers and structural margin schedules? (Tier model construction.)
- **q9501** — How does a founder design a sales comp plan that reinforces discount discipline? (The comp-governance half of the budget.)
- **q9502** — What is a price floor and how does a founder set and enforce one? (The single shared control across motions.)
- **q9505** — How do you govern non-standard contract terms (payment terms, ramps, MFN clauses)? (The second axis of the direct matrix.)
- **q9510** — How does CPQ encode discount authority and approval routing? (Tooling for the direct system.)
- **q9511** — How do you choose and implement a PRM as a founder-stage company? (Tooling for the channel system.)
- **q9512** — How do you connect CPQ and PRM so direct and channel pipeline are visible together? (The systems-integration requirement.)
- **q9520** — How do you structure MDF, rebates, and SPIFFs in a partner program? (Channel incentive overlays.)
- **q9521** — How do you handle Special Pricing Requests (SPR) in a channel program? (The channel exception process.)
- **q9525** — How do you detect and prevent margin stacking in a channel? (The core channel failure mode.)
- **q9530** — How should RevOps own discount governance independent of the sales org? (Org design for adjudicator independence.)
- **q9540** — How do you sell through cloud marketplaces (AWS, Azure, GCP)? (The emerging third GTM motion.)
- **q9560** — How does a founder forecast a hybrid direct-plus-channel pipeline? (Forecasting across two motions.)
- **q9561** — How do you measure channel CAC vs direct CAC? (The economic justification for partner margin.)
- **q9570** — How does discount governance evolve from founder-led to scaled RevOps? (Stage-by-stage governance maturity.)
- **q9580** — How do you govern renewal pricing and uplift caps? (Where multi-year direct discounts and channel renewals collide.)
- **q9601** — How should a founder set up rules of engagement between sales motions? (Cross-motion boundary governance.)
- **q9610** — How do you build a partner enablement and certification program? (What earns a partner its tier.)
- **q9620** — How will AI change the deal desk and discount approval? (The five-year automation outlook.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Adjacent GTM-restructuring-under-AI question.)

`;

const tags = ['revops','discount-governance','deal-desk','channel-strategy','var-partnership','pricing','founder-led-sales','channel-conflict','deal-registration','gtm-strategy'];

const sources = [
  { title: 'Gartner — B2B Sales Discounting and Deal Desk Practices', url: 'https://www.gartner.com' },
  { title: 'Forrester — Channel and Partner Program Management Research', url: 'https://www.forrester.com' },
  { title: 'OpenView Partners — SaaS Benchmarks and Go-to-Market Reports', url: 'https://openviewpartners.com' }
];

const notes = {
  s6: 'Added 32 cited sources spanning deal desk and CPQ practice (Gartner, DealHub, Subskribe, Salesforce CPQ docs, Bain, Winning by Design, Pavilion), channel and PRM practice (Forrester/SiriusDecisions, PartnerStack, Impartner, Allbound, Crossbeam, CompTIA, Channel Futures), pricing economics (Simon-Kucher, McKinsey, Professional Pricing Society), hybrid-GTM benchmarks (OpenView, SaaStr, Insight, Bessemer, Vendr/Tropic), marketplace/co-sell motions (AWS Marketplace, Microsoft Partner Network), and reference partner programs (HubSpot, Atlassian, Snowflake/Databricks).',
  s7: 'Added comprehensive numbers block: direct discount-depth ladder (8-15% rep self-serve through 40%+ founder/CFO), median realized enterprise discount 18-30%, channel structural margin by tier (15-25% transactional / 25-35% committed / 30-40%+ strategic), deal-registration protection +5-15 points, distribution +3-7 points, MDF 1-5% and rebates 2-6%, the 40-50% margin-stack cap, channel-mix-of-revenue 20-45%, channel CAC 20-40% lower than direct, the channel funding model math (15-30% list premium), comp double-pay mechanics, the shared price-floor specification, stage-by-stage governance ($0-3M through $75M+), and org-design ownership rules.',
  s8: 'Added 8-element counter-case: two-system architecture is over-engineering at true early stage; some products should never have a channel; strict owner-separation can be too rigid for a 40-person company; a unified system is correct when the channel is really just fulfillment; the shared price floor breaks down in marketplace/PLG motions; deliberate channel cannibalization of direct is sometimes the strategy; over-governance kills channel velocity; and the whole framing assumes the founder controls list price.',
  s9: 'Cross-linked 25 related Pulse entries: the direct-side governance cluster (q9550/q9552/q9505/q9510), the channel governance cluster (q9553/q9554/q9555/q9557/q9511/q9520/q9521/q9525), the shared-control and comp entries (q9501/q9502/q9530), forecasting and economics (q9560/q9561), stage-evolution and renewal (q9570/q9580), cross-motion and enablement (q9601/q9610/q9512/q9540/q9556), and the AI-outlook and adjacent GTM-restructuring entries (q9620/q1899).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the founder discount-authority governance question, distinguishing direct enterprise (concession authority on a single negotiating surface — tiered matrix, CPQ, independent deal desk, seniority-gated approval) from channel/VAR (structural margin and end-price discipline on a two-sided surface — partner tiers, deal registration, margin-stack control, rules of engagement, PRM, channel-ops owner, registration-gated approval). Two mermaid diagrams: a decision flow routing a pricing request through the correct governance system, and a comparison matrix of the two systems plus the shared price-floor control layer. Full coverage: concession-vs-structural-margin core principle, the direct discount matrix with its non-standard-terms second axis, the channel two-sided surface, margin stacking as the central channel failure mode, channel conflict and rules of engagement, seniority-gated vs registration-gated approval workflows, CPQ/PRM tooling and their required integration, comp-and-discount as one budget, the three channel funding models, the shared price floor as the single common control, deal registration mechanics and abuse patterns, benchmark numbers, five named scenarios, stage-by-stage governance evolution, org-design ownership, a ten-decision design framework, the five-year AI outlook, an 8-element counter-case, and a final two-systems-one-floor framework.'
};

runPolish({ id: 'q9551', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
