// q9535 — How should discount governance evolve as the company scales from founder-led to a hired VP Sales?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** When a company moves from founder-led selling to a hired VP Sales, the single highest-risk piece of the handoff is **discount governance** — because in the founder-led phase there usually *is no* discount governance, there is only the founder's gut. The founder knows the cost structure, the strategic value of each logo, the real margin floor, and which deals are worth bending for. None of that is written down, and **it does not transfer** the moment a VP Sales walks in. The central task of this transition is therefore not "let the VP run discounting" — it is **codify the founder's implicit judgment into a written policy before or during the handoff**, so the knowledge survives the person. The failure modes are symmetrical: **Risk A** is the VP arrives with nothing handed over and discounting drifts because there is no policy; **Risk B** is the founder won't actually let go and undermines the VP through **shadow approvals** — reps going around the VP to the founder for the discount the VP wouldn't give. The fix is a five-move sequence: **(1) extract** the founder's implicit policy by walking through 30-60 past deals and asking "why did you approve or reject that"; **(2) co-author** the first written discount policy — margin floor, authority matrix, standard bands, strategic-exception criteria — so it carries the founder's knowledge *and* the VP's ownership; **(3) build the authority matrix** that explicitly defines where the founder *stays* (the rare strategic exception) and where the founder *exits* (every routine deal); **(4) run a staged handoff** — co-approve, then VP-approves-with-visibility, then VP-owns-with-founder-on-exceptions-only; **(5) kill the shadow-approval back channel** with an explicit, stated agreement that the founder will redirect every "can you just approve this" request back to the VP. Then align the comp plan to the new policy, decide whether the transition is also the moment to stand up a deal desk, encode the policy into CPQ/approval tooling, and measure the handoff: is discounting still disciplined, did the founder actually exit the deal flow, is the back channel dead, did velocity improve. **The counter-case matters too:** sometimes the company is too small for any of this and the VP hire itself was premature; sometimes the VP uses "codify the policy" as a power grab that discards real founder wisdom; sometimes the policy is written but the founder never behaviorally lets go, making the whole exercise theater; and sometimes the real problem is a founder-VP trust or role-clarity gap that no policy document can fix. Discount governance is the visible symptom; the founder-to-professional-leadership transition is the actual work.`;

const core = `

## The Founder-Led Discount Reality

In the founder-led phase of a company, ask "what is your discount governance policy?" and you will get a blank look, or a laugh, or a sentence like "I just know." That sentence is not a failure of process. It is an accurate description of how discounting actually works at a company doing $1M-$8M in ARR with the founder still closing the biggest deals. There is no policy document. There is no authority matrix. There is no margin floor written anywhere. There is the founder, and the founder's gut, and the founder's gut is — for now — *good*.

It is good because the founder has something no policy document has ever had: total context. The founder knows the cost structure to the dollar — what it actually costs to serve a customer, where gross margin really sits, how much room there is before a deal stops being worth doing. The founder knows the strategic landscape — which logo would unlock a vertical, which competitor it would hurt to lose a deal to, which customer is a reference goldmine and which is a support nightmare in disguise. The founder knows the pipeline emotionally — which deals are real, which are stalling, which rep is sandbagging and which is genuinely stuck. When a rep walks into the founder's office and says "they're asking for 30% off," the founder is not consulting a table. The founder is running a real-time, full-context judgment: *what does this specific deal, with this specific customer, at this specific moment, mean for the business?* And the answer the founder gives — yes, no, yes-but-only-if, no-but-here's-what-I'll-do-instead — is usually right.

This is the thing that makes the founder-led phase deceptively comfortable and the transition out of it deceptively dangerous. The discounting "works." Margins are usually fine. Deals close. The founder is fast — a discount decision takes thirty seconds in a hallway. There is no bureaucracy, no deal desk, no approval queue. Reps like it because the founder is reachable and decisive. The board likes it because the numbers look healthy. Everyone experiences the founder-led discount reality as *the absence of a problem*, which is exactly why nobody writes anything down. You do not document the thing that is working effortlessly.

But notice what is actually true underneath the comfort. The "policy" is not absent — it is *implicit*. The founder is, in fact, applying a consistent set of rules: there is a margin floor in the founder's head, there are bands the founder is implicitly using ("anything under 15% I don't even think about, 15-25% I want a reason, over 25% it had better be strategic"), there are strategic-logo criteria, there is a sense of where the real economic line sits. It is a policy. It has just never been externalized. It lives in exactly one place — the founder's head — and it is transmitted in exactly one way — the founder making each call personally, one deal at a time. That architecture has a single point of failure, and the entire premise of hiring a VP Sales is that you are about to remove that single point from the deal flow.

## Why The Founder's Gut Doesn't Transfer

Here is the uncomfortable mechanical truth of the transition: the founder's discount judgment is a *tacit* skill, and tacit skills do not transfer by proximity. You cannot hand the VP Sales the founder's gut by having them sit next to each other for a quarter. The VP will absorb some of it — they are not stupid, they will pick up patterns — but they will not absorb the part that matters most, which is the *reasoning underneath the pattern*.

Consider what the founder actually knows that the incoming VP Sales structurally cannot know on day one. The founder knows the real cost-to-serve, because the founder has watched the company's unit economics evolve from the inside for years. The VP knows the cost-to-serve they were told in the interview process, which is a number, not a felt understanding of how that number moves. The founder knows which logos are strategic in a way that is not on any list — the customer that is unremarkable in ARR terms but happens to be the most-referenced name in a vertical the company wants to own, the deal that matters because of who the buyer will be at *their next company*. The VP knows the logos that made it into the board deck. The founder knows where the margin floor *really* is — not the floor in the model, the floor below which the founder has learned, through specific painful deals, that the customer relationship sours or the implementation never recovers. The VP knows the floor as a guideline someone mentioned.

This is why the transition is so frequently mishandled: both sides assume the knowledge will transfer through osmosis, and it doesn't. The founder assumes "the VP is experienced, they'll figure out discounting" — but the VP's experience is from a *different company with different economics*, and importing that experience wholesale is a known failure mode (more on that later). The VP assumes "the founder will tell me what I need to know" — but the founder cannot tell the VP what the founder does not consciously know they know. That is what *tacit* means. The founder's discount policy is so internalized that the founder is not aware it is a policy. Ask the founder "what is your margin floor?" and you will often get "it depends," which is true, but useless to a successor. The dependency *is* the policy. It just has never been articulated.

The moment that exposes all of this is the handoff itself. The day the founder says "discounting is yours now" is the day everyone discovers that the policy lived only in the founder's head — because now it has to live somewhere else, and there is nowhere else for it to be. The VP starts making calls. Some are fine. Some are subtly wrong in ways the founder would have caught instantly — too generous on a deal the founder would have held firm on because the founder knew that customer would have paid full price, too rigid on a deal the founder would have flexed on because the founder knew the strategic value. The VP is not incompetent. The VP is *uncalibrated*, because the calibration data never got handed over. It was never in a transferable form.

So the transition does not fail because the VP is bad or the founder is controlling. It fails, by default, because nobody did the one piece of work that makes the handoff survivable: turning the founder's gut into something that exists outside the founder.

## The Transition Risk — Both Directions

The discount-governance handoff fails in two distinct ways, and they are mirror images of each other. A leadership team that only watches for one of them will get blindsided by the other.

**Risk A: the vacuum.** The founder hires the VP, says "sales is yours," and means it — genuinely steps back, genuinely stops taking discount questions. But nothing was codified. There is no written policy, no margin floor on paper, no authority matrix. The founder's intent is good; the execution left a vacuum. And discounting abhors a vacuum. Within a quarter or two, the symptoms appear: the discount distribution widens, the average discount creeps up two or three points, reps discover that "the new guy" approves things the founder would have pushed back on, and the floor — which was never written down — quietly drops because nobody is sure where it is. The VP is not deliberately loosening discipline. The VP is operating without the founder's context and without a written substitute for it, so the VP defaults to *closing deals*, which is what VPs are hired and compensated to do. The margin erosion is not a decision anyone made. It is the predictable output of removing the founder's judgment without replacing it with anything. Six months later the board asks why gross margin slipped, and the honest answer is: the company removed its only discount governance mechanism and installed nothing in its place.

**Risk B: the shadow.** The opposite failure. The founder hires the VP, says "sales is yours" — and does not mean it, or means it intellectually but cannot do it behaviorally. The founder keeps taking the discount questions. Worse, the *reps* keep bringing them, because the reps have learned over years that the founder is the real authority and the founder is reachable. So a rep asks the VP for 28%, the VP says "no, 18%, and here's the reasoning," and the rep — instead of accepting that — sends the founder a Slack message: "hey, big deal, customer's asking for 28%, can you bless it?" And the founder, wanting the deal to close, wanting to be helpful, not wanting to seem like they're abandoning the team, says yes. The shadow approval just happened. And it did three things, all bad: it gave the customer a worse deal than the VP's policy would have, it taught the rep that the VP's "no" is not final, and it told the entire sales floor that the VP is not actually in charge. Risk B does not erode margin through drift — it erodes the VP's *authority*, which is worse, because a VP without authority cannot govern anything. Within two quarters the VP is a figurehead, every hard discount call routes around them, and the VP either becomes a passive order-taker or quits. Companies that experience Risk B often misdiagnose it as "we hired the wrong VP" and fire them, when the actual cause was the founder never closing the back channel.

The reason both risks are live simultaneously is that they come from the *same root cause expressed differently*. The root cause is that the founder's discount authority was never converted into an institution — it was only ever a person. Risk A is what happens when you remove the person and add nothing. Risk B is what happens when you "add" the VP on paper but leave the person in place underneath. The only thing that defuses both is the same thing: convert the authority into something institutional — a written policy and an explicit authority matrix — *and then* actually transfer it. Codify, then transfer. Skip the codify and you get the vacuum. Skip the genuine transfer and you get the shadow.

## The Core Principle — Codify Before You Transfer

Everything in this transition reduces to one principle: **the founder's implicit discount judgment must be extracted and written down before — or at the latest, during — the handoff. Turning gut into policy is the central task. It is not a side project. It is the transition.**

This sounds obvious stated plainly, and yet it is the single most-skipped step in founder-to-VP sales transitions, for a revealing reason: it is *uncomfortable and slow*, and the entire founder-led culture is optimized for fast and intuitive. Asking a founder to sit down and articulate "what is my margin floor and why, what makes a logo strategic, what bands am I actually using" feels to the founder like bureaucracy — like being asked to slow down and document the obvious. The founder's instinct is "we don't need a policy, we need the VP to ramp." That instinct is the trap. The VP cannot ramp on discount judgment, because discount judgment is not a thing you ramp on by doing — it is a thing you ramp on by *inheriting context*, and the context has to be made inheritable first.

"Codify before you transfer" has a specific ordering logic. If you transfer first — hand the VP authority and then try to write the policy afterward — you have already lost the calibration window. The VP is now making real calls with real consequences while the policy is still being figured out, which means the policy gets written *reactively*, in response to mistakes, rather than *proactively*, from the founder's accumulated wisdom. Worse, a policy written after the transfer tends to encode the *VP's* judgment, not the founder's, because the VP is the one in the seat — and the whole point was to preserve the founder's hard-won context, not replace it with a fresh start.

There is also a sequencing nuance worth being precise about. "Before" is ideal — do the codification work *before* the VP even starts, or in their first 30 days, as part of onboarding. "During" is acceptable — codify in parallel with an early-stage co-approval period, so the VP is learning the policy by helping write it. What is *not* acceptable is "after" — treating the written policy as something you'll get to once the VP is settled. By then the drift (Risk A) or the shadow (Risk B) has already set in, and you are no longer codifying a healthy founder policy; you are trying to reconstruct one from a situation that has already deteriorated.

The deeper reason this principle matters: a policy that is codified *from the founder's actual judgment* carries forward the company's specific, hard-won economic wisdom. A policy that is *not* codified — that is left for the VP to invent — almost always gets replaced by something generic, because the VP, lacking the founder's context, reaches for the SaaS-discounting playbook they used at their last company. And that playbook was calibrated to a different business. Codification is not bureaucracy. It is *knowledge preservation*. It is the mechanism by which the company keeps the good part of founder-led selling — the contextual judgment — while losing the bad part — the single point of failure.

## Extracting The Founder's Implicit Policy

So how do you actually get the policy out of the founder's head? Not by asking "what is your discount policy?" — that question returns "it depends." You get it out by reverse-engineering it from decisions the founder has already made. The founder cannot articulate the policy in the abstract, but the founder *applied* the policy hundreds of times, and those applications are recoverable.

The core exercise is a structured deal review. Pull 30 to 60 closed deals from the last 12-18 months — a deliberate spread: some at list or near-list price, some with moderate discounts, some with deep discounts, some deals the founder *walked away from* over price. Then sit with the founder, ideally with the incoming VP in the room, and go deal by deal with one repeated question: **"Why did you approve that — or why did you reject that?"** And then keep pulling: "What would have had to be true for you to go further?" "What was the number below which you would have walked?" "Was this customer strategic, and if so, what specifically made them strategic?" "If a rep brought you this exact deal today, what would you say?"

What emerges from 30-60 of these is not vague. Patterns surface fast. The founder will say things like "I never go below 60% gross margin on a new logo, I learned that the hard way with [customer]" — there is your margin floor, with the scar tissue that explains it. "I'll go deeper for a multi-year prepay because the cash matters more than the rate" — there is a band rule. "I flexed hard on [customer] because they were the first name in [vertical] and I knew it would open the door — and it did" — there is the strategic-logo criterion, made concrete. "I held firm on [customer] even though they pushed, because I could tell they'd pay, and they did" — there is the founder's read on negotiating posture, which is harder to codify but worth capturing as principles even if not as rules.

A few things make this exercise work. First, **the VP must be in the room.** This is not just data collection — it is knowledge transfer in its highest-bandwidth form. The VP hearing the founder narrate the reasoning behind 50 real decisions is worth more than any document, and it gives the VP genuine ownership of the policy that results. Second, **someone has to take structured notes and synthesize.** The raw exercise produces a pile of anecdotes; someone — often the RevOps leader, sometimes the VP — has to turn the pile into a draft: here is the margin floor, here are the bands, here are the strategic criteria, here are the principles. Third, **look for the disconfirming cases.** The deals where the founder did something that seems to contradict the emerging pattern are the most valuable, because they reveal the *real* rule, which is usually more nuanced than the first-pass version. Fourth, **expect to find the policy is tighter than anyone assumed.** Founders are often surprised, doing this exercise, at how *consistent* they actually were — the gut was running a real algorithm, and seeing it laid out is often the moment the founder genuinely believes the codification is worth doing.

The output of extraction is not yet the policy. It is the *raw material* for the policy — the founder's judgment, finally externalized into a form a second person can read. The next step is to shape it into an artifact.

## Building The First Written Discount Policy

Now you build the thing that has never existed at this company: a written discount policy. This is a genuine artifact, and treating it as one matters — it is not a Slack message, not a slide, not a "we generally try to." It is a living document with an owner, a version history, and a review cadence.

A first written discount policy for a company at this stage has four core components. **One: the margin floor.** The single hardest number in the document — the gross-margin (or discount-percentage, expressed however the company thinks) line below which a deal does not get done without a defined, rare exception. This comes straight out of the extraction exercise; it is the founder's real floor, the one with scar tissue behind it, not a model output. **Two: the authority matrix.** Who can approve what without escalation — the rep's self-serve band, the manager's band, the VP's band, and the narrow band reserved for the founder. (This component is important enough that the next section is devoted to it.) **Three: the standard bands.** The normal structure of discounting — the range reps can offer freely, the range that requires a documented reason, the range that requires manager or VP sign-off — plus the levers that justify movement within bands: term length, prepay, volume, multi-year commitment, logo/reference value, competitive displacement. The bands turn discounting from "make a case every time" into "here is the structured space you operate in." **Four: the strategic-exception criteria.** The explicit, deliberately narrow definition of what qualifies a deal for treatment outside the normal bands — and critically, *who* decides it qualifies. This is the lane the founder keeps; it has to be defined precisely or it becomes a loophole.

The most important thing about building this document is *who builds it*. It must be **co-authored by the founder and the VP Sales.** Not founder-written and handed down — that produces a document the VP did not buy into and will quietly route around. Not VP-written from their last-company template — that produces the generic-policy failure mode. Co-authored. The founder brings the context, the economic wisdom, the scar tissue, the strategic landscape. The VP brings the operational structure, the knowledge of how policies actually function on a sales floor, the bands-and-matrix discipline, and — crucially — *ownership*. A co-authored policy carries the founder's knowledge *and* the VP's commitment. The VP will defend a policy they helped write. The VP will undermine, consciously or not, a policy that was imposed on them.

Practically, the build looks like this: the synthesized extraction notes become a first draft (often RevOps-drafted). The founder and VP work through it together, section by section — the founder pressure-tested on "is this actually your floor, is this actually what makes a logo strategic," the VP pressure-tested on "will this function on the floor, are these bands operable, is the matrix clean." It takes a few working sessions, not a quarter. The output is version one — explicitly versioned, because this document will be tuned, and the tuning is the VP's job once they own it. Keep it short. A first discount policy that runs longer than a few pages is already overbuilt for a company at this stage; the goal is *clear and operable*, not comprehensive.

## The Authority Transition

In the founder-led phase, the authority matrix had one row: the founder approves everything that matters. The transition's structural job is to replace that one row with a real matrix — and the matrix is where "codify before you transfer" becomes concrete, because the matrix is the literal document that *distributes* the founder's authority.

A first authority matrix for a company at this stage typically has four levels. **The rep level:** a band the rep can approve entirely on their own, no escalation — small enough to keep discipline, large enough that reps are not escalating trivial deals and killing velocity. **The manager level** (if there are first-line managers; at smaller scale this may collapse into the VP level): the next band up, where a frontline manager can sign off. **The VP Sales level:** the band above that — the meaningful discounts, the ones that used to go to the founder. This is the core of the transfer. The discounts that the founder used to approve in a hallway now route to the VP, and the VP owns them. **The founder level:** and here is the part that requires the most care — *the founder stays in the matrix, but in exactly one narrow place.* The founder is the approval authority for the strategic exception — the deal that needs to go outside the normal bands for reasons of strategic value that the matrix's standard levers do not capture. Not "anything big." Not "anything the VP is unsure about." A defined, narrow lane.

The discipline of the authority transition is in being *explicit about both sides of the founder's line* — where the founder stays and where the founder exits. The exits have to be stated as clearly as the stays. "The founder no longer approves any deal that falls within the VP's band, full stop, even if asked" is a sentence that has to be in the document, because the default — what happens if you don't write it — is that the founder keeps drifting into the VP's band out of habit and helpfulness, which is Risk B. And the stays have to be stated clearly too, because a founder who feels *entirely* cut out of discounting often resists the whole transition; giving the founder a real, defined, valuable lane — the strategic exception — is what makes the founder willing to genuinely exit everything else.

Two failure modes to design against. First, **the founder's lane defined too broadly.** If "strategic exception" is vague, every rep with a big deal will frame it as strategic, every deal will route to the founder, and you have rebuilt the founder-led model with extra steps. The lane must be narrow and criteria-based. Second, **the VP's band set too low.** If the matrix only lets the VP approve trivial discounts and everything meaningful still escalates, you have not actually transferred authority — you have created a VP who is a glorified manager, and the founder is still the real sales leader. The VP's band has to be genuinely meaningful — it has to cover the large majority of real discount decisions — or the transition is cosmetic.

The authority matrix is the single most important artifact of the whole transition, because it is the place where the abstract idea "the VP runs sales now" becomes a concrete, enforceable rule about who can say yes to what. Everything else — the policy, the handoff sequence, the shadow-approval agreement — exists to make the matrix real.

## The Handoff Sequence

You do not flip authority on a single day. You stage it. A clean discount-governance handoff runs through three phases, and the staging is what builds the trust that lets the founder genuinely let go.

**Phase one: co-approval.** For an initial period — often the VP's first 30-90 days — the founder and VP approve meaningful discounts *together*. The rep brings the deal, both look at it, they decide jointly, and — this is the point — they *talk through the reasoning every time*. Phase one is not about control; it is the highest-bandwidth continuation of the extraction exercise. The VP is learning the founder's calibration in real time, on live deals, and the founder is watching the VP's instincts and correcting gently. By the end of phase one, the founder should be able to predict what the VP will say on most deals, and the VP should be able to predict the founder. That mutual predictability *is* the transferred calibration.

**Phase two: VP approves, founder has visibility.** The VP now makes the calls in their band — solo, it is their decision — but the founder has visibility into them. Not approval rights; visibility. The founder sees the discount decisions the VP is making (a weekly summary, a dashboard, a deal-desk log — the mechanism matters less than the fact of visibility) and can raise a flag in a one-on-one if something looks off: "I noticed the [customer] deal went to 25% — walk me through that." This is a coaching conversation, *after* the decision, not an approval gate *before* it. Phase two is where the VP builds a track record and the founder builds confidence. It typically runs a quarter or two.

**Phase three: VP owns it, founder on strategic exceptions only.** The steady state. The VP owns the discount policy, owns the authority matrix below the founder's line, owns the team's discounting discipline. The founder is *out* of the routine deal flow entirely — not visible-but-quiet, *out* — and appears only in the one place the matrix reserves for them: the strategic exception. The visibility from phase two narrows to the normal reporting the founder gets on the sales function as a whole, not deal-by-deal discount monitoring. This is the destination, and the company should reach it within roughly two to three quarters of the VP starting — fast enough that the VP is genuinely empowered while still on-ramp momentum, slow enough that the calibration actually transferred.

The reason to stage rather than flip: a single-day handoff forces a binary choice between Risk A (founder fully out, nothing transferred) and Risk B (founder can't actually leave). Staging dissolves the binary. It gives the founder a *gradual* exit they can emotionally tolerate and a *visible* track record that earns their trust, and it gives the VP a *calibration period* instead of a cold start. The trust that phase three requires is not assumed — it is *manufactured*, deliberately, by phases one and two. Skip the staging and you are betting the whole transition on trust that was never built.

## The Founder Shadow-Approval Problem

The most common, most corrosive failure of this entire transition has a specific name: the **shadow approval**. It deserves its own treatment because it is subtle, it feels harmless in the moment, and it kills the VP.

Here is the mechanism. The handoff is "done." The VP owns discounting. But the reps have years of muscle memory: the founder is the real authority, the founder is reachable, the founder wants deals to close. So a rep asks the VP for a deep discount, the VP applies the policy and says no — "18%, not 28%, and here's why." And the rep, instead of accepting the VP's decision as final, opens a side channel: a Slack DM to the founder, a hallway catch, a "quick question" — "hey, I've got a great deal but it needs 28%, can you just bless it?" The founder, who wants the deal, who likes being helpful, who has not fully internalized that this is now off-limits, says "sure, go ahead." And the shadow approval is complete.

That single act, which took the founder thirty seconds and felt like helping, did the following damage. It **gave the customer a worse deal** than the codified policy would have — straight margin erosion. It **taught the rep that the VP's "no" is not real** — so the rep will route around the VP again, and will tell other reps the back channel works. It **told the sales floor the VP is not actually in charge** — because the org's real authority just demonstrated, in public effect if not in public words, that they will overrule the VP. And it **undermined the VP's ability to govern anything** — because a VP whose decisions can be appealed to a higher, friendlier authority has no decisions, only suggestions. A few shadow approvals and the VP is a figurehead. Every hard call routes around them. The VP either becomes a passive order-taker or — more often — reads the situation correctly and leaves. And then the company concludes "that VP didn't work out" and hires another one into the exact same dynamic.

The shadow approval is rarely malicious. The founder is not trying to undermine the VP — the founder is trying to close a deal and be helpful, and does not see the second-order damage. The rep is not trying to break the org — the rep is trying to win their deal with the path of least resistance. That is exactly why it is so dangerous: every individual instance is well-intentioned, and the damage is only visible in aggregate.

The fix is not subtle and it is not soft. It is an **explicit, stated agreement** — between the founder and the VP, and then communicated to the whole sales team — that the back channel is closed. Specifically: the founder commits, out loud, that when a rep brings them a discount question that belongs in the VP's band, the founder's answer is always the same — "that's [VP]'s call, go talk to [VP]" — and the founder *redirects rather than decides*, every single time, with no exceptions, even when the founder privately thinks the deal should be approved. If the founder genuinely thinks the VP got a call wrong, that goes to the VP directly, in a one-on-one, *as a peer-level conversation* — never by overruling the VP to the rep. And the sales team is told, explicitly: "discount decisions go to [VP]. The founder will not approve discounts and will redirect you if you ask. This is not a comment on anyone; it is how the function works now." Killing the shadow channel is not optional cleanup. It is the act that makes the VP's authority real. Without it, every other artifact in this transition is decoration.

## What The Founder Must Genuinely Let Go Of

For the transition to actually work, the founder has to genuinely let go of something specific, and being precise about *what* matters — because founders often let go of the wrong things or let go in name only.

What the founder must let go of is **the routine discount decision.** The standard deal at a standard discount — the rep needs 20% on a normal mid-market deal, the customer wants a modest concession for a one-year term — that decision is no longer the founder's, and the founder approving it is not neutral, it is *actively harmful*. This is the part founders struggle with most, because approving a routine discount feels helpful, feels like staying connected to the business, feels like no big deal. It is a big deal. Every routine discount the founder approves after the handoff is a small shadow approval — it reinforces the back channel, it tells the rep the founder is still available for this, and it signals that the VP's authority is conditional. The founder approving a standard 20% deal is not the founder being a good team player. It is the founder quietly undoing the transition.

The founder also has to let go of being the *default escalation point*. In the founder-led phase, "I'll just ask [founder]" was the resolution path for any pricing uncertainty. Post-handoff, the founder being reachable for that is the problem, not the service. The founder has to be willing to be *less convenient* — to redirect, to not be the easy yes, to tolerate the discomfort of a rep being mildly frustrated that they have to go through the VP. That discomfort is the cost of the VP having real authority, and the founder has to be willing to pay it.

And the founder has to let go emotionally, not just procedurally. There is a real identity component here. For years the founder *was* the sales function — closing deals, making the calls, being the person reps came to. Discount authority is a piece of that identity, and handing it over can feel like losing relevance, like being managed out of the thing the founder built. A founder who has not made peace with that emotionally will keep finding reasons to stay in the deal flow — every deal will look a little bit strategic, every call will look like one worth weighing in on. The procedural transition (the matrix, the policy) is necessary but not sufficient; the founder also has to *want* the VP to own this, has to experience the VP succeeding as a win rather than a loss. The founder's new job is the policy and the rare strategic call — and the founder has to come to genuinely value that role, not experience it as a consolation prize.

The clean test: three quarters after the VP starts, can the founder name the last routine discount they personally approved — and is the answer "I genuinely can't remember, that hasn't been my call in months"? If yes, the founder let go. If the founder can rattle off three from last week, the transition is theater.

## What The Founder Should Retain

Letting go of routine discounting does not mean the founder vanishes from discount governance entirely — and pretending it does is its own mistake. The founder should *retain* a genuine, defined role, and defining it precisely is what makes the founder willing to let go of everything else.

The founder should retain **the strategic-exception lane.** There is a real category of deal where the founder's context still adds something the VP's policy structurally cannot capture: the lighthouse logo whose reference value the founder understands better than anyone because the founder knows the market; the competitive must-win where losing to a specific competitor at a specific moment has strategic cost beyond the deal; the deal with a buyer or a relationship whose long-term value the VP cannot fully see yet. These are real, and the founder genuinely is the better decision-maker for them — *for now*. So the founder keeps them. But the lane has to be **narrow and defined**, with criteria — not "anything big," not "anything that feels important," but a specific, written description of what qualifies. The narrowness is the whole point. A broad strategic lane is just the founder-led model with a policy document stapled on. A narrow, criteria-based lane is a real, limited role.

The founder should also retain **co-ownership of the policy itself.** The VP owns the *operation* of discount governance — the day-to-day, the bands, the tuning, the team's discipline. But the policy's foundational economic assumptions — the margin floor, the strategic criteria — are tied to the founder's understanding of the business's economics and strategy, and the founder should stay a co-owner of *those*. In practice this means the founder and VP review the policy together on a periodic cadence (quarterly is typical), with the founder weighing in on whether the foundational numbers still reflect the business's economics and strategic priorities, and the VP owning everything operational. The founder is the strategic check on the policy, not the operator of it.

And the founder retains the **economic-context source** role. The business's cost structure and strategic landscape keep evolving, and the VP's understanding of them, while growing, will lag the founder's for a while. The founder staying a willing, accessible source of economic and strategic context — *when the VP asks*, in a structured way, not through reps bringing deals — is genuinely valuable. The distinction that matters: the founder is a *consultant to the VP on context*, not a *parallel authority to the reps on deals*. Retain the wisdom-transfer role; release the decision role.

Done right, what the founder retains is not a diminished version of the old job — it is a different and arguably higher-leverage job. The founder moves from making a hundred discount decisions a quarter to owning the policy that governs all of them and making the handful of strategic calls that genuinely need founder-level context. That is not a demotion. It is the founder's role maturing alongside the company's.

## The VP Sales' Mandate

The flip side of "what the founder lets go of" is "what the VP Sales is explicitly empowered to own" — and *explicit* is the operative word. A VP whose mandate is assumed rather than stated will spend the first two quarters discovering its boundaries by bumping into them, usually painfully.

The founder should explicitly empower the new VP Sales to own: **the discount policy** — its operation, its enforcement, and its ongoing tuning; the VP is the document's operational owner and the person accountable for it functioning. **The authority matrix below the founder's line** — every approval level from the rep up through the VP is the VP's to set, adjust, and enforce. **The team's discounting culture** — whether the sales floor treats the policy as a real constraint or a suggestion to be negotiated around is the VP's responsibility; the VP sets the tone, coaches the behavior, and owns the outcome. **The tuning** — as the business and market evolve, the bands and the matrix will need adjustment, and that adjustment is the VP's call (with the founder's input on the foundational numbers, per the co-ownership above, but the VP drives it).

And the empowerment has a matching **accountability**: discount discipline becomes one of the VP's owned metrics. The VP is not just handed authority over discounting — the VP is *measured* on it. Average discount, discount distribution, the percentage of deals closing within policy, margin realization against target — these become numbers the VP reports on and is accountable for, the same way the VP is accountable for bookings and pipeline. This is what makes the mandate real rather than rhetorical. Authority without accountability is just permission; authority *with* accountability is a genuine mandate. The VP owning the discount metric is also what protects the company from Risk A — because now there is a person whose job performance is explicitly tied to discounting staying disciplined, which is exactly the role the founder's gut used to play, now institutionalized.

The founder's part in establishing the mandate is not just stating it once — it is *backing it visibly*. When the founder redirects a rep to the VP, when the founder declines to overrule a VP decision, when the founder publicly defers to the VP on a discount question, the founder is *constructing* the mandate in real time. The mandate is not a document; it is the accumulated evidence, visible to the whole team, that the VP's authority is real and the founder respects it. The founder builds that evidence or undermines it with every discount-adjacent interaction in the first two quarters.

## Calibrating The Policy To Reality

A specific danger sits inside the codification work, and it is worth isolating: the risk that the *written* policy loses the *wisdom* of the gut it was supposed to capture. Codification is supposed to preserve the founder's hard-won judgment. Done carelessly, it replaces that judgment with something generic — and that is a real and common failure.

The founder's gut, for all that it doesn't scale, contains genuine, specific, hard-won wisdom about *this company's economics*. The margin floor in the founder's head is not arbitrary — it is calibrated to this business's actual cost structure, this business's actual customer behavior, this business's actual scar tissue. The strategic-logo criteria are calibrated to this company's actual market position and growth priorities. That calibration is the valuable part. The whole point of the extraction exercise is to get *that specific calibration* onto paper.

The failure mode is a new VP who, lacking the founder's context and reaching for the familiar, imports a discounting policy from their last company — or from the generic SaaS-discounting playbook — and installs it as "the policy." It will look professional. It will have bands and a matrix and a floor. And it may be subtly, expensively wrong for *this* business, because it was calibrated to a different one. A floor that was right at the VP's last company — different gross margins, different customer base, different competitive dynamics — can be too loose or too tight here. Strategic criteria from a different market do not map. The VP is not acting in bad faith; the VP is doing what experienced operators do, which is apply their experience. But in *this specific area*, the founder's context is more valuable than the VP's experience, and the policy has to be calibrated to the founder's reality, not the VP's history.

This is, again, why the policy must be **co-authored from the extraction exercise** rather than VP-imported. The extraction exercise is the calibration mechanism. It forces the policy to be built *up* from the founder's actual decisions about this actual business, rather than *down* from a generic template. The VP's experience is genuinely valuable in this process — it shapes the *structure* (how to build operable bands, how to design a clean matrix, how to make a policy function on a floor). But the *substance* — the floor, the criteria, the economic assumptions — has to come from the founder's calibrated reality. Structure from the VP, substance from the founder, co-authored into one document. A policy that is all VP-structure and no founder-substance is the generic-import failure. A policy that is all founder-substance and no VP-structure is unworkable on a sales floor. The transition needs both, which is exactly why it has to be co-authored.

## The Team's Experience Of The Transition

The reps live through this transition too, and their experience of it is often overlooked — which is a mistake, because the reps' behavior is what determines whether the new policy actually holds.

From a rep's point of view, the change is concrete and a little destabilizing: the resolution path for "I need a discount approved" is changing from "ask the founder" to "follow the policy, and if you need an exception, ask the VP." For reps who have been at the company a while, "ask the founder" was not just a process — it was a *relationship*, and a fast, decisive, often-generous one. The change can feel like a loss: more structure, a new person, less direct access to the founder, the sense that things are getting more corporate. If that feeling is not actively managed, it produces exactly the behavior that breaks the transition — reps trying to preserve the old path, which *is* the shadow-approval channel from the rep side.

So the transition has to be communicated to the team, deliberately, with a frame that is honest and rep-favorable. And the honest frame is: **the policy is actually better for reps than the founder's case-by-case judgment was.** This is true, and reps will believe it if it is demonstrated. Case-by-case judgment, however good, is *unpredictable* from the rep's side — the rep never knew going into a deal what they could offer, every discount was a fresh negotiation with their own leadership, and the answer depended on the founder's mood, the founder's read, the founder's availability. A written policy with clear bands gives the rep something the founder's gut never could: *predictability*. The rep knows, before the customer conversation, what they can offer freely, what needs a reason, what needs escalation. That is faster — no waiting for the founder to be reachable — and it lets the rep negotiate with confidence instead of hedging. A good discount policy is a tool *for* the rep, not a constraint *on* the rep, and the communication has to land that.

The communication also has to be concrete about the mechanics: here is the policy, here are your bands, here is what you can do without asking anyone, here is when you go to the VP, here is the strategic-exception path and how narrow it is, and — stated plainly — here is why the founder is no longer the discount approver and what to do if you are tempted to ask them anyway. That last part matters. The reps need to hear, from the founder directly, that the change is real and that the founder is fully behind the VP — because the reps will test it, and the founder's own words are what set the expectation.

Handled well, the team comes out of the transition with *more* clarity than they had under the founder, not less. Handled poorly — change imposed with no frame, no explanation, no rep-favorable logic — the team experiences it as bureaucracy, mourns the founder era, and works to recreate the old back channels. The team's experience is not a soft consideration. It is a determinant of whether the policy holds.

## The Comp-Plan Interaction

The founder-to-VP transition is very often *also* a comp-plan moment — the incoming VP frequently wants to redesign sales compensation, and the timing is not a coincidence. And if the comp plan and the discount policy are designed in separate rooms, they will fight each other.

The interaction is direct: the comp plan determines what reps are *incentivized* to do, and the discount policy determines what reps are *allowed* to do, and if those two point in different directions, the comp plan wins and the policy erodes. A comp plan that pays purely on bookings or revenue, with no sensitivity to discount, *incentivizes discounting* — every rep's rational move is to discount to whatever the policy floor allows, and to push on the floor, because their pay does not care about margin. You can write the most disciplined discount policy in the world, but if the comp plan rewards the behavior the policy is trying to restrain, you are fighting your own incentive structure, and the incentive structure has more hours in the day than the policy enforcement does.

So if the VP is redesigning comp during the transition — and they often are — the discount policy and the comp plan have to be designed *together*, to reinforce. The standard mechanisms: tie some portion of commission to margin or to discount level, not just to bookings — so a rep who closes at list earns more than a rep who closes the same ARR at a deep discount; or use a multiplier that scales commission down as discount goes up; or simply make discount discipline a component of the rep's overall performance picture, not just a policy they are told to follow. The specific mechanism is the VP's design call. The *principle* — comp and discount policy must pull in the same direction — is non-negotiable.

This is also a moment where the founder's economic context matters again. The founder understands what margin the business actually needs to protect; the VP knows how to build a comp plan that motivates a sales team. Co-designing the comp-discount interaction — founder on the economics, VP on the plan mechanics — is the same co-authoring pattern as the discount policy itself, and for the same reason: the substance is the founder's, the structure is the VP's. A transition that codifies a beautiful discount policy and then lets the VP install a pure-bookings comp plan in a separate workstream has built a policy with a hole in the bottom of it.

## The Deal Desk Question

Somewhere in this transition, usually raised by the incoming VP, the question comes up: should we stand up a deal desk? It is the right question to ask, and the answer is about timing.

A deal desk — a function (often a person, sometimes initially a part of someone's role) that owns the operational side of deal approvals: reviewing discount requests against policy, managing the approval workflow, maintaining the data, being the consistent point of process — is a natural maturation of discount governance. And the founder-to-VP transition is *plausibly* the right moment for it, because the transition is already creating the artifacts a deal desk runs on: a written policy, an authority matrix, defined bands. A deal desk without those artifacts has nothing to administer; a deal desk *with* them is the operational engine that makes them real day-to-day. So the policy work is a prerequisite, and the transition produces the prerequisite.

But the timing has a "not too early" side. A company at the small end of this transition's range — closer to $3M ARR, a lean sales team, the VP just getting started — probably does not need a dedicated deal desk *yet*; the VP can personally own deal review during the early phases, and that personal ownership is actually useful, because it keeps the VP close to the live texture of discounting while they are still calibrating. Standing up a deal-desk function before there is enough deal volume to justify it just adds process overhead and a layer between the VP and the deals. The deal desk earns its place when deal volume is high enough that the VP personally reviewing every meaningful discount becomes a bottleneck — when the VP is the new single point of failure that the founder used to be.

So the practical sequence is usually: the transition produces the policy and the matrix; the VP personally owns deal review through the early phases; and the deal desk gets stood up *when volume demands it*, which may be during the transition for a larger company or a year or two after for a smaller one. The question to ask is not "should we have a deal desk because we have a VP now" — it is "is the VP becoming a bottleneck on deal review, and do we have enough volume and policy maturity to justify a dedicated function." When the answer is yes, the transition's artifacts are exactly what the deal desk needs to run.

## The Founder-VP Relationship Design

Underneath all the artifacts — the policy, the matrix, the handoff phases — is a relationship, and the transition succeeds or fails on whether that relationship is *designed* or left to chance. The founder and the VP need an explicit, ongoing operating model for how they stay aligned on discount governance without the founder meddling.

The steady-state design: the **founder is the strategic check and the policy co-owner; the VP is the operator.** That division has to be real and mutually understood. The founder does not operate discount governance — does not approve deals in the VP's band, does not get pulled into deal-level discussions, does not let reps use them as an escalation path. The VP does not unilaterally rewrite the policy's foundational economic assumptions — the floor, the strategic criteria — without the founder's input, because those are tied to the business's economics and strategy in ways the founder still understands best. Operator and strategic check. Two distinct roles, not a blurred shared responsibility.

The mechanism that keeps it aligned without meddling is **cadence.** A regular, structured touchpoint — typically a recurring one-on-one — where discount governance is a standing topic: the VP reports on how discounting is going (the metrics, the distribution, what is being tuned), raises anything that touches the foundational economic assumptions, and surfaces strategic-exception situations; the founder offers economic and strategic context, pressure-tests the foundational numbers, and weighs in on the strategic exceptions that are genuinely theirs. The cadence is what makes meddling unnecessary. The founder does not need to jump into a deal mid-week, because there is a known, structured place — the next one-on-one — where the founder's input has a channel. A founder without a cadenced channel for their input will create one ad hoc, and ad hoc founder input *is* meddling. The cadence converts the founder's legitimate ongoing interest into something structured and non-disruptive.

The relationship also needs an explicit norm for **disagreement.** The founder will, sometimes, think the VP made a discount call wrong. The norm: that goes to the VP directly, peer to peer, in the cadenced one-on-one or a dedicated conversation — never to the rep, never as an overrule, never publicly. The founder gets to influence the VP; the founder does not get to overrule the VP to the team. That single norm, held consistently, is most of what separates a healthy founder-VP relationship from one that decays into Risk B. And it has to be agreed *explicitly*, in advance, because in the moment — with a deal on the line and the founder convinced — the pull to just fix it directly is strong. The relationship is designed up front precisely so that the in-the-moment pressure has a pre-agreed answer.

## The Tooling Moment

The transition is also, very often, the moment discount governance moves from living in the founder's head and a scatter of Slack messages to being *encoded* — into CPQ, into approval workflows, into the actual systems the sales team works in. And the sequencing of that matters: tooling does not create the policy; tooling *enforces a policy that already exists*.

In the founder-led phase, the "system" for discount governance was the founder being a Slack message away. There was no encoded logic because there did not need to be — the logic was a person. The transition changes that, because the whole point is that the logic can no longer be a person. Once the policy is written and the authority matrix is defined, those artifacts can — and at any meaningful scale, should — be encoded: the bands become CPQ guardrails, the authority matrix becomes an actual approval workflow that routes a discount request to the right approver automatically, the strategic-exception path becomes a defined route rather than a hallway conversation. The tooling makes the policy *self-enforcing* — a rep cannot quote below the floor without the system requiring an exception, an escalation cannot skip the VP, the approval trail is captured automatically. That is a large upgrade over "the founder remembers."

The critical sequencing point: the policy comes first, the tooling second. A company that tries to *configure the CPQ* before it has done the extraction-and-codification work is encoding a policy that does not exist yet — and will end up either encoding the generic-template policy (the calibration failure) or encoding nothing real and calling the half-configured tool "governance." The written, co-authored policy and the explicit authority matrix are the *specification*; the CPQ and approval workflow are the *implementation*. You cannot implement a spec you have not written. So the order in the transition is: extract, codify, define the matrix, run the staged handoff — and then, with a real policy in hand, encode it into the tooling so it enforces itself.

Done in that order, the tooling moment is the thing that makes the whole transition durable. The policy is no longer dependent on the VP personally remembering and enforcing it any more than it was dependent on the founder — it is in the system, it is self-enforcing, it survives the next personnel change too. The transition's deepest goal is to convert discount governance from a *person* into an *institution*; the written policy is the institution's constitution, and the tooling is how the institution actually runs every day.

## Measuring The Transition's Success

How do you know the transition actually worked, rather than just *looked* like it worked? You measure it, on a defined set of post-handoff questions, and the answers have to be honest.

**Is discounting still disciplined?** The most basic check. Compare the discount distribution and average discount in the quarters after the handoff to the founder-led baseline. Flat or improved means the codified policy successfully captured the founder's discipline. A meaningful widening means Risk A — the vacuum — the policy either was not written well enough or is not being enforced.

**Did the founder actually exit the deal flow?** Not "did the founder say they exited" — *did they actually*. The test from the earlier section: can the founder genuinely not remember the last routine discount they personally approved? Is there a clean record showing routine approvals routing to the VP and the matrix, with the founder appearing only in the narrow strategic-exception lane? If the founder is still showing up on routine deals, the transition is incomplete regardless of what the org chart says.

**Is the back channel dead?** The Risk B check. Are reps going to the VP for discount decisions, or are there still side conversations with the founder? This one is partly cultural and you have to look for it deliberately — ask the VP candidly, watch the approval trails, notice whether reps ever frame things as "well, the founder said." A dead back channel shows up as the VP's "no" actually being final.

**Is the VP genuinely empowered?** Does the VP own the policy, the matrix, the metric? Is the VP's discount-discipline accountability real and reported? Does the team treat the VP as the authority? An empowered VP and a dead back channel are two views of the same healthy outcome.

**Did velocity improve?** A subtle but important one. A good codified policy with clear bands should make discounting *faster* than the founder-led case-by-case model — reps know their bands, escalations route cleanly, deals do not stall waiting for the founder to be reachable. If sales cycles around discount approval got faster, the policy is doing its job as a tool for the team, not just as a control.

**Is the discount distribution healthy?** Beyond the average — look at the shape. Are most deals closing within the standard bands? Is the deep-discount tail narrow and explainable? Are strategic exceptions genuinely rare and genuinely strategic? A healthy distribution is the real proof that the founder's calibrated judgment made it into the policy and the policy is holding.

Measured honestly across those six, the transition either passes or it does not — and if it does not, the specific question that failed tells you exactly which failure mode you are in and what to fix.

## The Failure Modes

It is worth naming the failure modes directly and in one place, because each has a distinct cause and a distinct fix, and a leadership team that can recognize which one it is in is halfway to correcting it.

**Failure mode one: the policy was lost in the handoff because nothing was written down.** The founder transferred authority but never codified judgment. The VP inherited a title, not a policy. Discounting drifts. This is Risk A, and the root cause is skipping the extraction-and-codification work entirely — usually because it felt like bureaucracy and everyone was in a hurry to get the VP ramping. The fix is to do the work late: run the extraction exercise even after the fact, reconstruct the policy, and re-anchor. It is harder after drift has set in, but it is recoverable.

**Failure mode two: founder shadow approvals undermining the VP.** The policy may even exist on paper, but the founder never closed the back channel, reps keep routing around the VP, and the VP's authority is hollow. This is Risk B, and the root cause is the founder not genuinely letting go — procedurally or emotionally. The fix is the explicit shadow-approval agreement and the founder visibly, consistently redirecting; if the founder will not do that, no document fixes it.

**Failure mode three: a new VP importing a misfit generic policy.** The codification "happened," but the VP wrote the policy from their last-company template instead of from the founder's actual judgment, and the policy is calibrated to the wrong business. The root cause is skipping the *extraction* even while doing the *codification* — building the policy top-down from a template instead of bottom-up from the founder's decisions. The fix is to actually run the deal-review extraction and re-calibrate the policy to this company's economics.

**Failure mode four: the founder lets go of routine deals but micromanages "strategic" ones too broadly.** The founder genuinely exits routine discounting — but the strategic-exception lane was defined too broadly, or the founder interprets it too broadly, so a large share of meaningful deals get reframed as "strategic" and routed back to the founder. The root cause is a vague or expansive strategic lane. The fix is to narrow the lane with hard criteria and hold the founder to them — the lane should be genuinely rare, and if it is not, it is not really an exception lane, it is the old founder-led model wearing a costume.

The pattern across all four: each failure mode is a specific shortcut on the core sequence — skipping codification (one), skipping the genuine transfer (two), skipping extraction (three), or skipping the discipline of a narrow founder lane (four). The sequence works when none of its steps are skipped, and each step exists precisely because skipping it produces one of these named failures.

## Board & Leadership Framing

The board is usually not a bystander in this transition — the board very often *pushed for the VP Sales hire* in the first place, as the signal that the company is professionalizing its go-to-market. Which means the board has a stake in this transition going well, and the discount-governance piece is a useful, concrete thing to frame for them.

The framing that works: position the **codification of discount governance as a key deliverable of the VP transition** — not as a side detail of sales operations, but as one of the explicit milestones that proves the transition is real. "We hired a VP Sales" is an org-chart change. "We extracted the founder's implicit discount judgment, codified it into a written policy and authority matrix, and ran a staged handoff" is *evidence that the function is actually maturing* — that the company is converting founder-dependency into institution, which is exactly what the board wanted when it pushed for the hire. Boards understand single-point-of-failure risk; framing discount governance as one place that risk used to live, and the codification as the mitigation, makes the work legible and valuable to them.

It is also useful to give the board the *measurement* frame from the previous section — because boards will naturally worry about the obvious risk (margin erosion under a new VP, Risk A) and may not be watching for the subtler one (founder shadow approvals, Risk B). Telling the board "here is how we will know the transition worked: discounting stays disciplined, the founder genuinely exits the deal flow, the back channel is dead, the VP is genuinely empowered" gives them a balanced scorecard and, not incidentally, creates healthy accountability for the founder to actually let go — because now the founder's exit is a stated, board-visible deliverable, not just a private intention.

There is a real benefit to the founder here too. A founder who can tell the board "discount governance used to be my gut; now it is a codified policy the VP owns, and here is the data showing it is holding" is demonstrating exactly the kind of letting-go that boards want to see from founders as companies scale. The discount-governance transition, framed well, is a small, concrete, measurable proof point of the larger founder-to-professional-leadership maturation that the board cares about most.

## 5 Real-World Scenarios

**Scenario one: the clean codify-then-transfer handoff.** A company around $9M ARR hires its first VP Sales. Before the VP's start date, the founder and RevOps leader pull 50 closed deals and run the extraction exercise; the VP joins the last few sessions. In the VP's first 30 days, the three of them co-author a written discount policy — margin floor, four-level authority matrix, standard bands, a narrow strategic-exception lane reserved for the founder. They run the staged handoff: co-approval for the first 60 days, VP-approves-with-founder-visibility for the next quarter, then VP-owns-with-founder-on-strategic-exceptions-only. The founder makes an explicit, team-communicated commitment to redirect every discount question to the VP. Two quarters into steady state, the discount distribution is *tighter* than the founder-led baseline, the founder cannot remember their last routine approval, and deal velocity improved because reps now know their bands. This is the transition working as designed.

**Scenario two: the founder who shadow-approved and undermined the VP.** A company hires a strong VP Sales, and a written policy even gets drafted. But the founder never closes the back channel. Reps quickly learn the VP's "no" can be appealed — a Slack to the founder, a "big deal, can you bless it," and the founder, wanting deals to close, says yes. Within two quarters every hard discount call routes around the VP. The VP raises it; the founder agrees in principle and keeps doing it anyway, because each individual instance feels harmless. The VP, reading the situation correctly, leaves inside a year. The company concludes "wrong hire" and starts the search again — into the identical dynamic. The fix was never a different VP; it was the founder genuinely closing the channel, which never happened.

**Scenario three: the policy lost because nothing was written down.** A founder hires a VP, says "sales is yours," and genuinely means it — fully steps back, stops taking discount questions. But the codification work was skipped; it felt like bureaucracy and everyone wanted the VP ramping fast. The VP inherits authority with no written policy, no documented floor, no matrix. Lacking the founder's context and compensated to close, the VP defaults to closing — the discount distribution widens, the average creeps up, the floor quietly drops because no one knows where it is. Two quarters later the board asks why gross margin slipped. The honest answer: the company removed its only discount governance mechanism and installed nothing. Recovery means running the extraction exercise late and re-anchoring — possible, but harder than doing it on time.

**Scenario four: the new VP who imported a misfit policy.** The codification "happened" — but the VP, experienced and moving fast, wrote the policy from their previous company's template. It looks professional: clean bands, a proper matrix, a defined floor. But it was calibrated to a business with different gross margins, a different customer base, different competitive dynamics. The floor is too loose for this company's economics; the strategic criteria do not map to this market. The founder's hard-won, company-specific wisdom — the entire reason to codify — was never extracted and never made it in. The policy is technically complete and substantively wrong. The fix is to go back and actually run the deal-review extraction, then re-calibrate the policy to *this* company's reality.

**Scenario five: the founder who couldn't let go of "strategic" deals — which turned out to be everything.** The founder genuinely exits routine discounting; the matrix works for standard deals. But the strategic-exception lane was defined vaguely — "deals with strategic value" — and the founder interprets it expansively. Soon every meaningful deal is getting framed as strategic and routed back to the founder, by the founder's own pull and by reps who learn the framing works. The VP owns the routine 20% deals and nothing that matters. The codification was real, the handoff looked done, but the broad strategic lane became a backdoor to the founder-led model. The fix is to narrow the lane to hard, rare criteria and hold the founder to them — and if the founder cannot operate within a narrow lane, the real problem is not the policy, it is the founder not having let go, which is scenario two wearing a more respectable costume.

## The Decision Framework

Pulling the whole transition into an ordered sequence — this is the framework a founder, VP, CRO, or RevOps leader can run:

**One: extract the founder's implicit policy.** Pull 30-60 closed deals across the discount spectrum, including walk-aways. Sit with the founder, VP in the room, and go deal by deal: "why did you approve or reject that, what would have changed it, where was the floor." Synthesize the answers into the raw material of a policy.

**Two: co-author the first written discount policy.** Turn the extraction into a real artifact — margin floor, authority matrix, standard bands, strategic-exception criteria — co-authored by founder and VP so it carries the founder's substance and the VP's structure and ownership. Keep it short and operable.

**Three: build the authority matrix defining where the founder stays vs exits.** Four levels (rep, manager, VP, founder). Be explicit about both sides of the founder's line — the narrow strategic lane the founder keeps, and the clear statement that the founder no longer approves anything in the VP's band. Make the VP's band genuinely meaningful and the founder's lane genuinely narrow.

**Four: run the staged handoff.** Co-approval (first 30-90 days), then VP-approves-with-founder-visibility (a quarter or two), then VP-owns-with-founder-on-strategic-exceptions-only. Reach steady state within two to three quarters of the VP starting.

**Five: kill the shadow-approval back channel.** Explicit, stated agreement that the founder redirects every in-band discount question to the VP, every time, no exceptions. Communicate it to the whole team. Disagreements go founder-to-VP directly, never founder-overrules-VP-to-rep.

**Six: empower the VP's mandate.** Explicitly hand the VP the policy, the matrix below the founder's line, the team's discounting culture, and the tuning — with discount discipline as an owned, reported metric. The founder backs the mandate visibly in every discount-adjacent interaction.

**Seven: align comp.** If the VP is redesigning compensation — and they often are — design the comp plan and the discount policy together so they reinforce. Comp must not reward the behavior the policy restrains.

**Eight: systematize in tooling.** With a real policy in hand, encode the bands and the matrix into CPQ and approval workflows so the policy becomes self-enforcing. Policy first, tooling second — always.

**Nine: measure the handoff.** Post-transition, check the six questions: is discounting disciplined, did the founder actually exit, is the back channel dead, is the VP genuinely empowered, did velocity improve, is the distribution healthy. Honest answers tell you whether it worked and, if not, exactly which failure mode you are in.

Run in order, with no step skipped, this sequence converts discount governance from the founder's gut into a durable institution — preserving the good of founder-led judgment while removing its single point of failure.

## 5-Year Outlook

Over the next five years, several things about this transition will shift, even as its core logic stays constant.

**The founder-to-professional-leadership transition will become a more recognized, more patterned playbook.** Right now, many companies improvise the founder-to-VP-Sales handoff and rediscover the discount-governance problem the hard way. As the SaaS ecosystem matures and as more operators have lived through multiple such transitions, the codify-before-you-transfer pattern — and the specific artifacts it produces — will become more standard, more templated, more likely to be done deliberately rather than discovered after a failure. The transition will move from "thing companies stumble through" to "thing companies run as a known process."

**AI will increasingly assist the extraction and codification work.** The extraction exercise — reverse-engineering the founder's implicit policy from past deals — is exactly the kind of pattern-recognition task AI is good at. Within a few years, it will be normal to point an AI tool at the CRM's closed-deal history and have it surface the implicit policy as a first draft: here are the apparent bands, here is the apparent floor, here are the deals that look like exceptions and why. That does not replace the founder conversation — the *why* still has to come from the founder, and the co-authoring still has to happen — but it accelerates the raw extraction and makes the codification step faster and more rigorous. The founder's gut becomes easier to externalize.

**Discount governance tooling will assume the policy artifact exists.** As CPQ and deal-desk tooling matures, the systems will increasingly be built around the assumption that there *is* a written policy and an explicit matrix to encode — which will, in turn, pressure companies to produce those artifacts earlier, because the tooling will be harder to adopt without them. The tooling ecosystem will pull codification forward in the company's life.

**Orgs will professionalize faster, which moves this transition earlier.** Companies are hiring functional leaders sooner than they used to, and capital-efficiency pressure pushes go-to-market discipline earlier in a company's life. The founder-to-VP discount-governance transition that used to happen at $15M-$20M ARR will increasingly happen at $5M-$10M — which means it will happen when the founder's implicit policy is *younger* and less elaborate, arguably making it easier to extract, but also when the founder is less practiced at letting go. The emotional half of the transition may get harder even as the mechanical half gets easier.

The constant underneath all of it: the core principle does not change. However the tooling evolves, however early the transition moves, however much AI assists the extraction — the founder's implicit judgment still has to be made explicit before it can be transferred, the founder still has to genuinely let go, and the back channel still has to be closed. Those are not technology problems. They are organizational and human problems, and they will still be the heart of this transition in five years.

## Final Framework

The founder-to-VP discount-governance evolution, as a single blueprint:

**The problem.** In the founder-led phase, discount governance is the founder's gut — full-context, usually good, entirely tacit, and a single point of failure. Hiring a VP Sales removes that single point from the deal flow, and the founder's judgment does not transfer by proximity because it was never externalized. The transition fails in two mirror-image ways: Risk A, the vacuum (founder exits, nothing was codified, discounting drifts); Risk B, the shadow (founder doesn't genuinely let go, reps route around the VP, the VP's authority is hollowed).

**The core principle.** Codify before you transfer. The founder's implicit judgment must be extracted and written down before or during the handoff — turning gut into policy is not a side project, it is the transition itself.

**The sequence.** Extract the founder's implicit policy from 30-60 past deals. Co-author the first written discount policy — floor, matrix, bands, strategic-exception criteria — founder substance plus VP structure and ownership. Build the authority matrix that explicitly defines where the founder stays (narrow strategic lane) and exits (everything in the VP's band). Run the staged handoff — co-approve, then VP-with-visibility, then VP-owns — reaching steady state within two to three quarters. Kill the shadow-approval back channel with an explicit, team-communicated agreement. Empower the VP's mandate with owned authority and an owned discount-discipline metric. Align comp so it reinforces rather than fights the policy. Systematize the policy in CPQ and approval tooling — policy first, tooling second. Measure the handoff against six honest questions.

**The success metrics.** Discounting stayed disciplined. The founder genuinely exited the routine deal flow. The shadow-approval back channel is dead. The VP is genuinely empowered and accountable. Deal velocity improved because the policy is a tool for the team. The discount distribution is healthy — most deals in-band, a narrow explainable tail, genuinely rare strategic exceptions.

**The deeper truth.** Discount governance is the visible, measurable symptom; the founder-to-professional-leadership transition is the actual work. A company that codifies the policy but whose founder never behaviorally lets go has built theater. A company that does the human work — the founder genuinely handing over, the back channel genuinely closed, the VP genuinely empowered — and *also* does the codification work has converted discount governance from a person into an institution. That conversion is the point. It preserves the good of founder-led selling — the contextual, calibrated judgment — while removing the bad — the single point of failure — and it is a small, concrete, measurable proof of the larger maturation every scaling company has to go through.

`;

const flow = `

## The Evolution Of Discount Governance: Founder's Gut To VP-Owned Institution

\`\`\`mermaid
flowchart TD
  A[Founder-Led Phase: Discount Governance Is The Founder's Gut] --> A1[Full Context: Cost Structure, Strategic Logos, Real Margin Floor]
  A --> A2[Implicit Policy: Bands And Criteria Exist Only In Founder's Head]
  A --> A3[Single Point Of Failure: Transmitted Only By Founder Deciding Each Deal]
  A1 --> B[Trigger: VP Sales Hired, Founder To Exit The Deal Flow]
  A2 --> B
  A3 --> B
  B --> C[Step 1 Extract: Walk 30-60 Past Deals, Ask Why Approved Or Rejected]
  C --> C1[Reverse-Engineer The Margin Floor]
  C --> C2[Surface The Standard Bands]
  C --> C3[Define The Strategic-Logo Criteria]
  C1 --> D[Step 2 Codify: Co-Author The First Written Discount Policy]
  C2 --> D
  C3 --> D
  D --> D1[Founder Brings Substance: Floor, Criteria, Economic Wisdom]
  D --> D2[VP Brings Structure And Ownership: Operable Bands, Clean Matrix]
  D1 --> E[Step 3 Authority Matrix: Distribute The Founder's Authority]
  D2 --> E
  E --> E1[Rep Band / Manager Band / VP Band]
  E --> E2[Founder Stays: Narrow Strategic-Exception Lane Only]
  E --> E3[Founder Exits: Everything In The VP's Band, Stated Explicitly]
  E1 --> F[Step 4 Staged Handoff]
  E2 --> F
  E3 --> F
  F --> F1[Phase 1: Co-Approval, Talk Through Every Decision]
  F1 --> F2[Phase 2: VP Approves, Founder Has Visibility]
  F2 --> F3[Phase 3: VP Owns It, Founder On Strategic Exceptions Only]
  F3 --> G[Step 5 Kill The Shadow-Approval Back Channel]
  G --> G1[Explicit Agreement: Founder Redirects Every In-Band Question To VP]
  G --> G2[Communicated To The Whole Sales Team]
  G1 --> H[Steady State: VP-Owned Discount Governance Institution]
  G2 --> H
  H --> H1[Policy Encoded In CPQ And Approval Tooling, Self-Enforcing]
  H --> H2[Comp Plan Aligned To Reinforce The Policy]
  H --> H3[Founder-VP Cadence: Strategic Check Plus Operator]
  H1 --> I[Measured Success: Disciplined, Founder Exited, Back Channel Dead, VP Empowered, Velocity Up]
  H2 --> I
  H3 --> I
\`\`\`

## The Founder's Role Transformation: Before And After The Handoff

\`\`\`mermaid
flowchart LR
  subgraph BEFORE[Before: Founder-Led Discount Governance]
    B1[Founder Approves Every Discount] --> B2[Rep Brings Any Deal Directly To Founder]
    B2 --> B3[Founder Runs Real-Time Full-Context Judgment]
    B3 --> B4[Decision In 30 Seconds, No Policy, No Matrix]
    B4 --> B5[Works Well But Does Not Scale: Single Point Of Failure]
  end
  B5 --> T[The Transition: Codify Then Transfer]
  T --> T1[Extract Implicit Policy]
  T --> T2[Co-Author Written Policy]
  T --> T3[Build Authority Matrix]
  T --> T4[Staged Handoff]
  T1 --> AFTER
  T2 --> AFTER
  T3 --> AFTER
  T4 --> AFTER
  subgraph AFTER[After: Founder Owns Policy Plus Narrow Strategic Lane]
    A1[Founder Owns The Written Policy As Co-Owner And Strategic Check]
    A1 --> A2[Founder Approves Only The Rare, Criteria-Defined Strategic Exception]
    A2 --> A3[All Routine Discounts Route To The VP And The Authority Matrix]
    A3 --> A4[Founder-VP Cadence Keeps Alignment Without Meddling]
  end
  AFTER --> X[CUT: The Shadow-Approval Back Channel]
  X --> X1[Rep Asks VP For Deep Discount, VP Says No Per Policy]
  X1 --> X2[Rep Tries To Route Around VP To The Founder]
  X2 --> X3[Founder MUST Redirect: That Is The VP's Call, Go To The VP]
  X3 --> X4[If Founder Approves Instead: VP Authority Destroyed, Transition Fails]
  X3 --> A3
\`\`\`

`;

const src = `

## Sources

1. **"The Hard Thing About Hard Things" — Ben Horowitz** — Canonical text on the founder-to-professional-management transition, including the structural difficulty of handing over functions a founder personally built.
2. **"The Founder's Dilemmas" — Noam Wasserman** — Research on founder transitions, the emotional and identity dimensions of letting go of operational control, and the predictable failure points.
3. **"Crossing the Chasm" / "The Gainsight Way" — go-to-market maturation literature** — Frameworks for how sales functions professionalize as companies scale past founder-led selling.
4. **SaaStr — Founder-Led Sales to First VP Sales transition content** — Jason Lemkin's extensive body of work on when and how to hire a first VP Sales and the common failure modes of the handoff.
5. **"From Impossible to Inevitable" — Aaron Ross and Jason Lemkin** — Sales process systematization and the transition from founder-driven to repeatable, governed sales motions.
6. **Pavilion (formerly Revenue Collective) — VP Sales onboarding and mandate-setting frameworks** — Practitioner community standards for empowering a new sales leader and defining their authority.
7. **"The Sales Acceleration Formula" — Mark Roberge** — HubSpot's framework for building a metrics-driven, governed sales organization out of an early-stage founder-led motion.
8. **Winning by Design — Discount governance and deal-desk maturity models** — Frameworks for how discounting controls evolve as a revenue organization scales.
9. **Gong / Clari deal-execution research** — Data on how discounting behavior shifts when sales leadership changes and the relationship between discount discipline and win rates.
10. **CPQ vendor documentation (Salesforce CPQ / Revenue Cloud, DealHub, Conga)** — Approval workflow architecture, discount guardrails, and how written policy is encoded into self-enforcing tooling.
11. **OpenView Partners — SaaS pricing and discounting benchmark reports** — Industry benchmark data on discount distributions, margin floors, and how they vary by company stage and segment.
12. **"Monetizing Innovation" — Madhavan Ramanujam (Simon-Kucher)** — Pricing-and-packaging discipline, including the cost of undisciplined discounting and how policy preserves value capture.
13. **Bessemer Venture Partners — State of the Cloud / scaling go-to-market content** — Stage-based guidance on when founder-led functions should transition to hired leadership.
14. **First Round Review — Founder-to-functional-leader transition essays** — Practitioner accounts of handing over sales, including the shadow-management and trust-building dynamics.
15. **RevOps community resources (RevGenius, Wizards of Ops, RevOps Co-op)** — Practitioner frameworks for building a first discount policy, authority matrix, and deal desk.
16. **Harvard Business Review — "The Founder's Dilemma" and related articles on founder transitions** — Research-grounded treatment of the identity and control issues founders face when professionalizing functions.
17. **Sales compensation design literature (Xactly, CaptivateIQ benchmark content; "Compensating the Sales Force" — David Cichelli)** — How comp plan design interacts with discount behavior and the mechanics of margin-linked incentives.
18. **Deal desk function design guides (Vendr, DealHub, practitioner content)** — When to stand up a deal desk, what it owns, and how it relates to the discount policy and authority matrix.
19. **Korn Ferry / Heidrick & Struggles — VP Sales hiring and onboarding research** — Data on first-VP-Sales tenure, failure rates, and the organizational conditions that predict success or early departure.
20. **a16z and SaaStr content on founder letting go** — Specific treatment of the behavioral (not just procedural) requirements for a founder to genuinely transfer authority to a hired leader.

`;

const num = `

## Numbers

**The Founder-Led Phase (Typical Starting Conditions)**
- Company ARR range where this transition typically occurs: $3M-$40M
- ARR range where it is increasingly happening earlier (capital-efficiency pressure): $5M-$10M
- Historical norm for the transition: $15M-$20M ARR
- Number of places the founder's discount policy exists: 1 (the founder's head)
- Number of ways it is transmitted: 1 (founder deciding each deal personally)
- Typical founder discount-decision time: ~30 seconds (hallway / Slack)
- Written discount policy documents in the founder-led phase: 0

**The Extraction Exercise**
- Closed deals to pull for the extraction review: 30-60
- Deal-history lookback window: 12-18 months
- Deal spread: list/near-list, moderate discount, deep discount, and price walk-aways
- Core repeated question: "Why did you approve or reject that?"
- Working sessions to complete extraction and synthesis: typically a small number, not a quarter
- Who is in the room: founder + incoming VP + (often) RevOps leader

**The First Written Discount Policy**
- Core components: 4 (margin floor, authority matrix, standard bands, strategic-exception criteria)
- Authorship model: co-authored (founder substance + VP structure and ownership)
- Target length: a few pages — "clear and operable," not comprehensive
- Versioning: explicitly versioned (v1, tuned over time by the VP)
- Build time: a few working sessions, not a quarter

**The Authority Matrix**
- Approval levels: 4 (rep, manager, VP Sales, founder)
- Founder's retained lane: 1 — the narrow, criteria-defined strategic exception
- Founder's exit: all deals within the VP's band, stated explicitly
- Design rule A: founder's strategic lane must be narrow and criteria-based (not "anything big")
- Design rule B: VP's band must be genuinely meaningful (cover the large majority of real discount decisions)

**The Staged Handoff Timeline**
- Phase 1 (co-approval): typically the VP's first 30-90 days
- Phase 2 (VP approves, founder has visibility): typically 1-2 quarters
- Phase 3 (VP owns, founder on strategic exceptions only): steady state
- Total time to reach steady state: roughly 2-3 quarters from the VP's start date

**The Two Transition Risks**
- Risk A (the vacuum): founder exits, nothing codified — discounting drifts; symptom is widening discount distribution + average creeping up 2-3 points + floor quietly dropping
- Risk B (the shadow): founder doesn't genuinely let go — reps route around VP; symptom is the VP's "no" not being final, VP becoming a figurehead within ~2 quarters
- Shared root cause: founder's discount authority was never converted from a person into an institution

**The Shadow-Approval Mechanism (Risk B Detail)**
- Damage per shadow approval: 4 distinct harms (worse customer deal / rep learns VP's no is not real / floor signals VP not in charge / VP cannot govern)
- Number of shadow approvals to hollow out a VP: a few
- Common misdiagnosis: "we hired the wrong VP" (leading to re-hire into the identical dynamic)
- The fix: explicit, stated, team-communicated agreement that the founder redirects every in-band question to the VP, every time, no exceptions

**The Six Success-Measurement Questions**
1. Is discounting still disciplined? (compare distribution + average to founder-led baseline)
2. Did the founder actually exit the deal flow? (can the founder not remember their last routine approval?)
3. Is the back channel dead? (are reps going to the VP, with the VP's "no" final?)
4. Is the VP genuinely empowered? (owns policy + matrix + metric; team treats VP as authority)
5. Did velocity improve? (discount-approval cycle time vs founder-led case-by-case)
6. Is the discount distribution healthy? (most deals in-band, narrow explainable tail, rare genuine exceptions)

**The Four Failure Modes**
- Failure 1: policy lost in handoff (nothing written) — cause: skipped codification — = Risk A
- Failure 2: founder shadow approvals — cause: founder didn't genuinely let go — = Risk B
- Failure 3: misfit imported generic policy — cause: skipped extraction, built top-down from template
- Failure 4: founder micromanages "strategic" deals — cause: strategic lane defined too broadly

**The Nine-Step Decision Framework**
1. Extract the founder's implicit policy (30-60 deals)
2. Co-author the first written discount policy
3. Build the authority matrix (where founder stays vs exits)
4. Run the staged handoff (3 phases, ~2-3 quarters)
5. Kill the shadow-approval back channel
6. Empower the VP's mandate (authority + owned discount-discipline metric)
7. Align comp (design comp plan + discount policy together)
8. Systematize in tooling (policy first, tooling second)
9. Measure the handoff (the 6 questions)

**Sequencing Rules**
- Codification timing: "before" ideal / "during" acceptable / "after" not acceptable
- Policy-vs-tooling order: policy first, tooling second — always
- Comp-vs-policy: designed together, never in separate workstreams
- Deal desk timing: stand up when the VP becomes a deal-review bottleneck, not "because we have a VP now"

**The VP's Mandate**
- Explicitly owned: the policy, the authority matrix below the founder's line, the team's discounting culture, the tuning
- Matching accountability: discount discipline as an owned, reported metric (average discount, distribution, % in-policy, margin realization)
- Founder's role in the mandate: backing it visibly in every discount-adjacent interaction

**What The Founder Retains vs Releases**
- Releases: every routine discount decision; the default-escalation-point role; the emotional identity of being the sales function
- Retains: the narrow strategic-exception lane; co-ownership of the policy's foundational economic assumptions; the economic-context-source role (consultant to the VP, not parallel authority to reps)
- The clean test: 3 quarters in, can the founder genuinely not remember their last routine discount approval?

**Founder-VP Relationship Design**
- Steady-state division: founder = strategic check + policy co-owner; VP = operator
- Alignment mechanism: a recurring cadenced one-on-one with discount governance as a standing topic
- Disagreement norm: founder-to-VP directly, peer to peer — never founder-overrules-VP-to-rep, never public

`;

const counter = `

## Counter-Case: When Formalizing Discount Governance During The VP Transition Is Premature Or Wrong

The framework above assumes the transition is real, necessary, and worth doing carefully. That assumption is usually right — but not always. A serious leadership team should stress-test it against the conditions where the whole exercise is premature, misused, or beside the point.

**Counter 1 — The company is too small, and the VP hire itself was early.** The entire premise is that the founder needs to exit the deal flow because the company has outgrown founder-led selling. But some companies hire a VP Sales before that is actually true — at $2M-$3M ARR with a thin sales team and a still-evolving product, where the founder genuinely *should* still be close to discounting because the founder is still close to *everything*, and that closeness is an asset, not a liability. In that situation, running a formal codify-and-transfer exercise is solving a problem the company does not have yet. The founder's gut is still the right governance mechanism because the founder still has — and still needs — full context, and the deal volume does not yet justify an institution. Formalizing discount governance here is premature process, and worse, it can mask the real issue: the VP hire was early, and the honest move is to recognize that rather than build elaborate governance scaffolding to make a premature hire look load-bearing. The diagnostic question: is the founder exiting the deal flow because the company genuinely needs them out, or because someone read that "founders should hire a VP Sales"? If it is the latter, the discount-governance work is downstream of a hiring mistake.

**Counter 2 — The VP uses "codify the policy" as a power grab that discards genuine founder wisdom.** The framework treats codification as knowledge *preservation* — extracting the founder's hard-won judgment and carrying it forward. But codification can be weaponized. An incoming VP, consciously or not, can use "we need to professionalize this, we need a real policy" as cover to *replace* the founder's judgment with their own — to install the playbook from their last company and frame the founder's contextual wisdom as "unscalable founder gut" that needs to be cleaned up. Sometimes the founder's policy *was* genuinely idiosyncratic and the VP is right to rebuild it. But sometimes the founder's "gut" encoded real, specific, expensive-to-relearn wisdom about the business's economics, and a VP who discards it in the name of professionalization is not codifying — they are *overwriting*, and the company loses calibration it paid years to acquire. The tell is whether the VP runs the genuine extraction exercise — whether they actually sit with the founder and 50 past deals and ask "why" — or whether they skip straight to "here is the policy" with a document that looks suspiciously like their last company's. Codification done right is bottom-up from the founder's decisions. Codification used as a power grab is top-down from the VP's template with a thin layer of consultation. They produce documents that look similar and outcomes that are opposite.

**Counter 3 — The codified policy is technically complete but the founder never behaviorally lets go, making the whole exercise theater.** This is the most insidious counter-case because it looks like success. The extraction happened. The policy is co-authored, well-structured, properly versioned. The authority matrix is clean. The handoff phases are on the calendar. Every artifact the framework prescribes exists. And none of it matters, because the founder never actually changes their behavior — they still take the discount questions, still get pulled into deals, still are the real authority in practice while the document says otherwise. The codification became *theater*: a set of artifacts that describe a transition that did not behaviorally occur. This is dangerous specifically because the artifacts provide false assurance — the board sees a policy and a matrix and concludes the transition worked; the VP can point to a document; everyone can claim the box is checked. But the actual governance is unchanged. The lesson is that the documents are necessary and not remotely sufficient. The real transition is behavioral — the founder genuinely redirecting reps, genuinely not approving in-band discounts, genuinely living inside the narrow strategic lane. If that behavioral change does not happen, the policy is not governance; it is set dressing. And a company that mistakes the set dressing for the transition has arguably done worse than one that did no codification at all, because at least the latter knows it has not transitioned.

**Counter 4 — The real problem isn't discount governance at all; it's a deeper founder-VP trust or role-clarity issue that no policy document fixes.** Discount governance is visible, concrete, and measurable, which makes it an attractive thing to *work on* — and sometimes that attractiveness is a trap, because the discount-governance dysfunction is a *symptom* of something a policy cannot touch. If the founder does not actually trust the VP — trust their judgment, trust their commitment, trust that they understand the business — then no authority matrix will make the founder let go, because the matrix is asking the founder to delegate to someone they do not believe in. If the founder and VP never genuinely agreed on the VP's role and scope — if "you own sales" meant different things to each of them — then the discount-governance fights are just where that unresolved disagreement surfaces. If the founder hired the VP but is not emotionally ready to stop being the sales leader, the shadow approvals are not a process gap; they are the founder's ambivalence expressing itself through the nearest available channel. In all of these, building a better discount policy is treating the symptom and ignoring the disease. The work that actually matters is the harder, less concrete work: rebuilding or establishing genuine trust, having the explicit and possibly uncomfortable conversation about the VP's real scope, the founder doing the genuine emotional work of redefining their identity. A leadership team that pours energy into the discount-governance artifacts while the underlying trust or role-clarity issue festers will produce a beautiful policy and a failed transition. The diagnostic: if you fixed the discount policy perfectly tomorrow, would the founder-VP relationship be healthy — or would the dysfunction just relocate to forecasting, or hiring, or territory design, or comp? If it would relocate, discount governance was never the real problem.

**The honest verdict.** The codify-before-you-transfer framework is the right approach for the *typical* founder-to-VP-Sales transition — a company genuinely past founder-led scale, a VP hired at the right time, a founder who genuinely intends to let go, and a relationship with real underlying trust. Under those conditions, skipping the codification work is the mistake, and the framework is the antidote. But the framework is not a substitute for diagnosis. Before running it, confirm the transition is actually real and timely (Counter 1), that codification will be genuine extraction rather than a VP power grab (Counter 2), that the founder is prepared to change behavior and not just sign documents (Counter 3), and that discount governance is the actual problem rather than the visible symptom of a trust or role-clarity gap (Counter 4). Run the framework when the diagnosis supports it. When it does not, the discount-governance work is, at best, premature, and at worst, an elaborate way to avoid the real conversation.

`;

const links = `

## Related Pulse Library Entries

- **q9530** — How do you build a discount approval matrix for a scaling sales org? (The authority-matrix artifact at the center of this transition, in operational depth.)
- **q9531** — How do you set a margin floor for sales discounting? (The hardest number in the written policy — methodology for deriving and defending it.)
- **q9532** — When should a company stand up a deal desk? (The deal-desk timing question raised in this transition, treated in full.)
- **q9533** — How do you write a first sales discount policy? (The codified-policy artifact — structure, components, and authoring process.)
- **q9534** — How do you stop discount drift in a scaling sales team? (Risk A — the vacuum — and the mechanics of preventing margin erosion.)
- **q9536** — How should a founder hand off sales to a first VP Sales? (The parent transition; discount governance is one workstream within it.)
- **q9537** — How do you onboard a first VP Sales? (The onboarding window in which codification and the staged handoff should occur.)
- **q9538** — What should a first VP Sales own in their first 90 days? (The VP's mandate, of which discount governance is a defined component.)
- **q9539** — How do you design sales compensation alongside a discount policy? (The comp-plan interaction — making comp reinforce rather than fight the policy.)
- **q9540** — How does a founder genuinely let go of operational control? (The behavioral, not procedural, half of the transition — Counter 3.)
- **q9501** — How do you start a SaaS company in 2027? (Founder-led early phase context — where the implicit policy originates.)
- **q9502** — How do you scale a SaaS company from $1M to $10M ARR? (The scaling band in which this transition typically occurs.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Parallel theme — go-to-market roles and governance restructuring under change.)
- **q9550** — How do you build a sales forecasting process out of founder-led selling? (Adjacent founder-to-institution conversion — same codify-before-transfer pattern.)
- **q9551** — How do you systematize a founder-led sales motion? (The broader systematization project of which discount governance is one piece.)
- **q9560** — How do you encode a discount policy into CPQ? (The tooling moment — implementing the written policy as self-enforcing approval logic.)
- **q9561** — What CPQ approval-workflow architecture should a scaling company use? (Technical detail on the tooling layer referenced here.)
- **q9570** — How do you measure sales discount discipline? (The metrics behind the six success-measurement questions.)
- **q9571** — What is a healthy discount distribution for a B2B SaaS company? (Benchmark context for "is the distribution healthy.")
- **q9580** — How do you rebuild founder-VP trust after a failed handoff? (Counter 4 — when the real problem is trust, not governance.)
- **q9581** — How do you diagnose whether a VP Sales hire was premature? (Counter 1 — testing whether the transition is real and timely.)
- **q9590** — How do you frame a sales-leadership transition to your board? (The board-and-leadership framing section in depth.)
- **q9591** — What deliverables should a board expect from a first VP Sales hire? (Board-facing milestones, of which codified discount governance is one.)
- **q9505** — How do you extract tacit knowledge from a founder? (The extraction-exercise methodology generalized beyond discounting.)
- **q9506** — How do you write a first go-to-market policy of any kind? (The codification pattern applied across functions.)
- **q9801** — What does sales leadership look like in 2030? (Long-term outlook context for the 5-year section.)
- **q9802** — How will AI change sales operations by 2030? (AI-assisted policy extraction and codification — the 5-year-outlook claim in depth.)

`;

const tags = ['discount-governance','founder-led-sales','vp-sales','sales-leadership-transition','revops','pricing','sales-management','authority-matrix','scaling','founder-transition'];

const sources = [
  { title: 'The Hard Thing About Hard Things — Ben Horowitz', url: 'https://a16z.com/book/the-hard-thing-about-hard-things/' },
  { title: 'SaaStr — Founder-Led Sales to First VP Sales', url: 'https://www.saastr.com/' },
  { title: 'The Sales Acceleration Formula — Mark Roberge', url: 'https://www.markroberge.com/' }
];

const notes = {
  s6: 'Added 20 cited sources spanning the founder-to-professional-leadership transition literature (Horowitz "The Hard Thing About Hard Things," Wasserman "The Founder\'s Dilemmas," HBR founder-transition research), go-to-market maturation frameworks (SaaStr/Lemkin first-VP-Sales content, Roberge "The Sales Acceleration Formula," Aaron Ross "From Impossible to Inevitable," Winning by Design discount-governance models), pricing-and-discounting discipline (OpenView benchmarks, Ramanujam "Monetizing Innovation," Simon-Kucher), comp-design literature (Cichelli, Xactly/CaptivateIQ), CPQ and deal-desk tooling documentation (Salesforce CPQ, DealHub, Vendr), VP-hiring research (Korn Ferry, Heidrick & Struggles), and practitioner communities (Pavilion, RevGenius, Wizards of Ops).',
  s7: 'Added comprehensive numerical analysis: the founder-led starting conditions (ARR transition band $3M-$40M, policy exists in exactly 1 place, ~30-second founder decisions, 0 written policies), the extraction exercise parameters (30-60 deals, 12-18 month lookback), the first written policy spec (4 core components, co-authored, a few pages, versioned), the authority matrix (4 levels, 1 narrow founder lane, 2 design rules), the staged-handoff timeline (Phase 1 30-90 days, Phase 2 1-2 quarters, steady state in 2-3 quarters), the two transition risks and the shadow-approval mechanism (4 distinct harms per shadow approval), the six success-measurement questions, the four failure modes with causes, the nine-step decision framework, the sequencing rules (codify before/during not after; policy before tooling; comp with policy; deal desk by bottleneck), the VP mandate components, and the founder retains-vs-releases breakdown.',
  s8: 'Added 4-part counter-case examining when formalizing discount governance during the VP transition is premature or wrong: (1) the company is too small and the VP hire itself was early, so the founder genuinely should still be close to discounting and the governance work is downstream of a hiring mistake; (2) the VP uses "codify the policy" as a power grab that discards genuine founder wisdom rather than preserving it — top-down template install disguised as bottom-up extraction; (3) the codified policy is technically complete but the founder never behaviorally lets go, making the artifacts theater that provides false assurance to the board; (4) the real problem is a deeper founder-VP trust or role-clarity issue that no policy document fixes, where discount-governance dysfunction is the visible symptom and fixing the policy just relocates the dysfunction. Includes a diagnostic test for each and an honest verdict on when to run the framework versus when to diagnose first.',
  s9: 'Cross-linked 26 related Pulse entries: the discount-governance artifact cluster (q9530 approval matrix, q9531 margin floor, q9532 deal desk, q9533 first discount policy, q9534 discount drift), the parent founder-to-VP transition cluster (q9536 sales handoff, q9537 VP onboarding, q9538 VP first-90-days mandate, q9539 comp-alongside-policy, q9540 founder letting go), SaaS-scaling context (q9501/q9502), founder-to-institution conversion parallels (q9550 forecasting, q9551 sales-motion systematization, q9505 tacit-knowledge extraction, q9506 first GTM policy), the tooling layer (q9560 CPQ encoding, q9561 approval-workflow architecture), measurement (q9570 discount discipline, q9571 healthy distribution), the counter-case clusters (q9580 rebuilding founder-VP trust, q9581 diagnosing premature VP hire), board framing (q9590/q9591), and 2030 outlook (q9801/q9802).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the founder-led-to-VP-Sales discount-governance transition playbook. Two mermaid diagrams (the evolution timeline from founder\'s-gut governance through extraction, codification, authority handoff, to VP-owned institution; and the founder\'s before/after role transformation with the shadow-approval back channel explicitly shown as the thing that must be cut). Full coverage: the founder-led discount reality (governance as implicit, full-context, good-but-unscalable founder gut), why the founder\'s tacit judgment does not transfer by proximity, the two symmetrical transition risks (Risk A the vacuum, Risk B the shadow), the core principle (codify before you transfer), the extraction exercise (reverse-engineering the policy from 30-60 past deals), building the first written discount policy (4 co-authored components), the authority transition (4-level matrix defining where the founder stays vs exits), the staged handoff sequence (co-approval to VP-with-visibility to VP-owns), the founder shadow-approval problem and its explicit-agreement fix, what the founder must genuinely let go of vs retain, the VP\'s mandate and matching accountability, calibrating the policy to reality (avoiding the misfit-generic-import failure), the team\'s experience of the transition, the comp-plan interaction, the deal-desk timing question, the founder-VP relationship design, the tooling moment (policy first, tooling second), measuring success against six honest questions, the four failure modes with causes and fixes, board and leadership framing, five real-world scenarios, the nine-step decision framework, the 5-year outlook, a final consolidated framework, and a 4-part counter-case with diagnostics.'
};

runPolish({ id: 'q9535', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
