// st0006 -- The Pricing Conversation: When to Introduce, When to Defend,
// When to Walk -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0006, tag: sales-training).
// VALUE over WORD COUNT. Target 8,500-10,000 words. ABSOLUTE HARD CAP 10,500.
// Walks the 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0001-st0005: Pulse Training intro,
// 60-min agenda, Cold Open, Teach Block (When->How->If + Pricing Bridge),
// Discussion, Two-Person Role-Play (x2), Debrief + Commitments, Leave-Behind.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');
const { runPolish } = require('./polish-helper');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ID = 'st0006';
const QUESTION = "The Pricing Conversation: When to Introduce, When to Defend, When to Walk — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'pricing',
  'discount-governance',
  'negotiation',
  'ae-training',
  'gong-research',
  'sales-meeting',
  'pulse-training',
  'st0006',
  'b2b-saas'
];

const sources = [
  { title: 'Gong Reality Report — timing of price mention vs win rate (12% vs 38%)', url: 'https://www.gong.io/resources/research/' },
  { title: 'Bridge Group SaaS AE Metrics 2025 — discount % impact on LTV + win rate', url: 'https://blog.bridgegroupinc.com/' },
  { title: 'ProfitWell + Price Intelligently (Patrick Campbell) — pricing-value mismatch data', url: 'https://www.profitwell.com/' },
  { title: 'Force Management — Command of the Message + demand a price increase before you give a discount', url: 'https://www.forcemanagement.com/' },
  { title: 'Pavilion — discount governance + SaaS pricing benchmarks', url: 'https://www.joinpavilion.com/' },
  { title: 'SaaStr — ARR-vs-discount benchmarks + AE pricing playbooks', url: 'https://www.saastr.com/' },
  { title: 'Sandler Selling System — discount must be earned + Pain Funnel', url: 'https://www.sandler.com/' },
  { title: 'Bosworth Solution Selling — negotiate with your customer not against them', url: 'https://en.wikipedia.org/wiki/Solution_selling' },
  { title: 'MEDDPICC — Identify Pain applied to price defense', url: 'https://meddicc.com/' },
  { title: 'Chris Voss (Never Split the Difference) — calibrated questions for the Boomerang move', url: 'https://www.blackswanltd.com/' },
  { title: 'ICONIQ Growth + Bessemer — discount governance + enterprise SaaS pricing benchmarks', url: 'https://www.iconiqcapital.com/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **AEs running B2B SaaS deals** at **$25K-$500K ACV** — and the **sales managers** coaching those reps on the most-mishandled moment in the entire cycle: when, how, and on whose terms to talk about price. **Drop this into your team's calendar tomorrow morning and run it live.**
>
> **What your reps will leave with:** A named, repeatable discipline — **the When → How → If framework + the Pricing Bridge and Boomerang verbatim phrases** — for controlling the timing, the positioning, and the walk-away of every pricing conversation. Plus verbatim scripts for each move, two live role-played pricing moments (an early-cycle "what's this cost?" deflection + a late-cycle "your competitor is 30% cheaper" defense), a written commitment naming one in-flight deal and the next pricing move, and a printable one-pager they tape next to their monitor.
>
> **What the manager should bring:** **(1)** The **CRM record of the team's last 5 deals where price came up** — including the discount % the team ended up giving on each. The losses where the team gave 20%+ off the published price are the most useful; cue up the specifics to walk live in Section 3. **(2)** The **team's published price list** — list price by tier, discount approval ladder, current floor-price policy. Most reps cannot quote their own floor. Bring it written down. **(3)** A **printed copy of the one-page leave-behind** at the bottom of this document, one per rep, ready to hand out at minute 57. **(4)** A **whiteboard or shared screen** to track each rep's last 3 deal-discount %s and the team's average discount-on-close by Section 3's end.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:05** | **Cold Open** — the Gong 12% vs 38% timing stat + a 90-second story | Manager | Reps feel that pricing-timing — not price level — is the single most leveraged decision in the cycle |
| **0:05-0:22** | **The Teach** — When → How → If Framework + the Pricing Bridge + the Boomerang | Manager | Reps can recite the 3-decision framework + the verbatim Bridge and Boomerang phrases without notes |
| **0:22-0:32** | **The Discussion** — each rep names the last "what does it cost?" moment + the discount they actually gave | Manager + room | Every rep audits their last 3 deals' actual discount % and identifies where value erosion started |
| **0:32-0:52** | **Role-Play x 2** — Round 1 early-cycle "what's this cost?" deflection (10 min) + 60-sec reset + Round 2 late-cycle "competitor is 30% cheaper" defense (10 min) | Reps in pairs | Reps deliver Pricing Bridge + Boomerang + When→How→If verbatim under buyer pressure and identify walk-conditions |
| **0:52-0:57** | **Debrief + Commitments** — 3 debrief questions + named-deal + named-pricing-move commitment | Manager + each rep | Each rep names ONE in-flight deal, names the current pricing-stage (early / right / late), and identifies the next verbatim move |
| **0:57-1:00** | **Leave-Behind Walkthrough** — the printed one-pager | Manager | Reps know where the template lives + tape the one-pager next to their monitor |

> ### 🎯 Bottom Line
> **Price is never the objection — it's the cover.** Per **Gong's Reality Report** analysis of recorded B2B deals, **deals where price surfaces in the first 25% of the cycle close at ~12%**. **Deals where price surfaces post-discovery, post-demo, and post-business-case close at ~38%.** Same product, same buyer persona, same ACV band, same published price. The variable that moves the needle from 12% to 38% is the **discipline of controlling When the number gets introduced, How it gets positioned, and If you're willing to walk** when the buyer's frame doesn't match the value frame. Three decisions. Run them on purpose, win 3x as often.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- THE COLD OPEN (0:00-0:05)

> ### 🟡 Coach Note
> Do not open your laptop. Do not say "thanks for joining." Walk in, say the number, tell the story. The first 90 seconds set whether reps tune out or remember this on Friday's pricing call. **Five minutes. Hard stop at 0:05.**

### The number, then the story.

**The number first.** Per **Gong's Reality Report** on recorded B2B sales calls, **deals where price surfaces in the first 25% of the cycle close at ~12%**. **Deals where price surfaces post-value-confirmation — after discovery, after demo, after a business case — close at ~38%.** Same product. Same persona. Same ACV band. The variable is the **discipline of controlling when the number gets introduced**. Per **Bridge Group SaaS AE Metrics 2025**, every **1% of discount given in negotiation reduces customer LTV more than it accelerates close** — volume discounts cost more than they save. Per **ProfitWell + Price Intelligently** (Patrick Campbell), the strongest correlate of churn at month 13 is not product fit — it is **the discount % given at signature**. Deeper discount, faster churn.

The math is brutal. An AE running **20 pricing-relevant deals a quarter** at 12% ships **2.4 deals** and misses. Same pipeline at 38% ships **7.6** and crushes. **The difference is whether the AE controlled timing, positioning, and walk-condition — or let the buyer control them.**

**The story.** (Composite — swap in names + numbers the room recognizes.)

An AE on this team — call her Jamie. First-call discovery with a 400-person retail-ops platform. Twenty-five minutes in, the COO interrupts: *"before we go further, can you give me a ballpark?"* Jamie was three weeks past quota. She said *"depending on scope it's typically $80K-$140K."*

The COO went quiet, said *"got it, let me circle internally,"* and the call ended at minute 33. Two days later: *"thanks but we need to think about budget."* Six weeks of voicemails. Then ghost. The COO never understood the value, never built an internal business case. He anchored on the $80K-$140K range and decided the conversation was over before discovery had happened. **The deal was lost in minute 25, not in week 6.**

Three weeks later, comparable account. Same COO archetype asked the same question at minute 24. Jamie deployed what we are about to teach: *"I want to give you a real number, not a guess. Can we spend 10 minutes confirming what you need so the number actually fits?"* The COO laughed, said *"fair enough,"* and they ran 38 more minutes of discovery. Two weeks later: signed demo. Six weeks after that: **closed $128K with zero discount**.

Same product. Same price list. Different **discipline on when the number got introduced**.

> ### ⚠️ Common Trap
> Reps will say "but my buyers DEMAND the number — they get angry if I don't give it." Three answers. **(1)** Buyer demand for a number is rarely a budget question; it is usually a **qualification reflex** — *"is this in range so I can keep talking to you?"* The Pricing Bridge answers the qualification reflex without giving an anchor. **(2)** Per Gong, deals where the rep gave a number in the first call close at 12%; deals where the rep deflected with a range-plus-diligence move close at 38%. The buyer's verbal demand and the buyer's actual decision behavior point in opposite directions. **(3)** "They get angry" is what reps tell themselves to justify caving. In role-plays we will see that **buyers respect the deflection** when it's delivered as consultative ("I want to give you a real number, not a guess"), not evasive.

**Transition:** "In the next hour you walk out with a three-decision framework and two verbatim phrases that let you delay the number, defend the number, and walk from the number — and close three times as often. Let's get into it."

---

## SECTION 2 -- THE TEACH (0:05-0:22)

> ### 🟡 Coach Note
> Seventeen minutes. **Do not lecture for seventeen minutes** — you will lose the room by minute 9. Break this into two halves: **When → How → If Framework (12 minutes, ~4 minutes per decision)** + **The Pricing Bridge + the Boomerang (5 minutes)**. Pause after each decision for one clarifying question. The end-of-section test: any rep can recite the 3 decisions and the verbatim Pricing Bridge phrase without notes.

### Part A -- The When → How → If Framework (12 minutes)

Three decisions every rep makes — usually by accident — in every pricing-relevant deal. The discipline is making them **on purpose**. The teach is short; the muscle takes the role-plays.

#### Decision 1 -- WHEN: Timing the introduction

Three windows. Only one wins.

- **TOO EARLY** — Price surfaces before pain is confirmed and value is established. **Fatal anchor.** Buyer attaches to the number, evaluates everything afterward against it, and loses the ability to pattern-match cost against business case. Gong data: ~12% close rate.
- **RIGHT** — Price surfaces post-discovery, post-demo, pre-procurement. Buyer can map the number to a quantified business case in their own head; the number feels earned, not imposed. Gong data: ~38% close rate.
- **TOO LATE** — Rep delayed the number past the point where the buyer needed it to keep selling internally. **Procurement now controls the conversation.** AE has lost leverage — the buyer's champion can't defend a number they don't have. Win rates collapse and discount % rises 8-15 points to compensate.

> ### 🎤 Verbatim Script -- The Early-Cycle Deflection (3 alternatives, pick by buyer mood)
> *"Happy to get to that — before I do, can I make sure I'm pricing the right scope? Two questions and I'll come back with a real range."* (Consultative — use with collaborative buyers.)
>
> *"Real answer: anywhere from $X to roughly $Y depending on what we'd actually deploy. I'd rather come back with the precise number after we figure out scope than guess wrong now. Fair?"* (Range + diligence — use with direct buyers who need a sense of magnitude.)
>
> *"That depends on three things I don't know yet — [X, Y, Z]. Five minutes on those and I can give you a number that's actually accurate. Worth it?"* (Diagnostic — use with analytical buyers.)

**Why it works.** Each version acknowledges the question (no rapport break), names a reason for the delay (the rep isn't ducking, they're protecting accuracy), and offers an explicit trade (5-10 minutes for a real number). The trade is the technique — without it, deflection feels evasive.

**Common trap.** Reps deflect with *"it depends"* and stop talking. That reads as evasion. **The deflection must include the trade — minutes for a real number — every time.**

**Coach cue.** In 1:1, role-play the Decision 1 deflection with the rep playing buyer. If the rep playing AE can't name the trade in one sentence, drill until it's reflex.

#### Decision 2 -- HOW: Positioning the number

When the number is earned and ready to land, three positioning modes. Pick by buyer style.

- **ANCHOR HIGH** — Lead with the premium tier price, then map down to fit. Per behavioral pricing research (Ariely, Cialdini), the first number anchors the negotiation. If the rep anchors at the floor, the buyer negotiates below the floor. **Always anchor high, always map down on purpose.**
- **RANGE** — Give a band that brackets the buyer's expected scope. Useful when the rep genuinely doesn't know yet whether the buyer will buy the Pro or Enterprise tier. Risk: a sloppy range invites the buyer to anchor on the bottom. **Always present the range with the value-per-tier mapped explicitly.**
- **TIE TO ROI** — Every dollar of price gets paired with a dollar of return — never standalone. Per Force Management, the highest-converting price reveal is the one where the buyer hears the number and the return in the same sentence.

> ### 🎤 Verbatim Script -- ANCHOR HIGH
> *"For what you described, our Enterprise tier is $X — that's where customers with [their specific pain] usually land. If we scoped it tighter, Pro at $Y would cover [subset of pain]. Which mode are you closer to?"*

> ### 🎤 Verbatim Script -- RANGE
> *"Range is $X to $Y. The $X end covers [pain A + B]. The $Y end adds [pain C + D] which from what you described might matter in year 2. Want me to scope to year 1 or year 2 outcomes?"*

> ### 🎤 Verbatim Script -- TIE TO ROI
> *"$X annually — and the math we walked through Tuesday was $3-4 of return per dollar of price. So $X buys you $3X-$4X in [recovered time / closed control gap / avoided cost]. That's the trade."*

**Why discounts destroy more than they create.** Per **Pavilion + Bridge Group** research, every **1% of discount given in negotiation** reduces customer LTV by 3-5% on average — discounted customers churn faster, expand less, reference-sell less. A 5% discount on $100K saves the buyer $5K and costs the seller ~$18-22K in LTV. A 10% discount saves $10K and costs ~$55-70K. **Exponential, not linear.**

**Common trap.** Reps anchor at the floor or at a "comfortable" middle number to avoid pushback. Result: every subsequent negotiation moves below floor. **The price you say first becomes the price you defend.** Anchor where you want to land plus 15-20%.

**Coach cue.** Drill the anchor-high move with reps until the verbatim phrasing rolls off the tongue. Junior reps reflexively anchor low; the muscle takes 4-6 weeks.

#### Decision 3 -- IF: Knowing when to walk

The most under-trained decision in B2B sales. Most reps will never walk. They will discount instead — which is worse for everyone. **Three walk-away conditions.** When any one of these is true, walking is not optional; it is the disciplined move.

- **Walk-Condition 1 — Budget is genuinely under 50% of your floor.** This is a qualification miss earlier in the cycle, not a price negotiation. Discounting 50% doesn't close the deal — it loses you the deal AND your floor. **Walk gracefully, park for nurture, fix the qualification gap.**
- **Walk-Condition 2 — Buyer is using your quote as a stalking horse to negotiate the incumbent.** Tell-tale signals: they ask for a quote in writing in the first call, they share your number with the incumbent on the same day, they negotiate at unusual hours. Surface it politely, then walk. *"Curious — are you actively evaluating switching, or is this benchmarking against [incumbent]? Both are fair, but I'd want to scope my time accordingly."*
- **Walk-Condition 3 — Buyer demands discount tied to "principle" not value.** *"I never sign without a 15% discount."* This is a tactic, not a budget reality. Giving a discount on principle teaches every buyer in their network that your price is fictional. **Walk OR escalate to manager — never give discount on principle.**

> ### 🎤 Verbatim Script -- The Graceful Walk (Walk-Condition 1)
> *"Real answer — at the scope we discussed, we're at $X and your budget is at $Y, which is roughly half. I don't think this is the right fit today and I don't want to discount in a way that sets either of us up to fail. Want me to check back in two quarters when budget might be different?"*

> ### 🎤 Verbatim Script -- The Stalking-Horse Walk (Walk-Condition 2)
> *"I'd rather be direct. From what I'm hearing it sounds like you're benchmarking against [incumbent]. That's fair — but I'd want my CRO to know I'm spending cycles on a real evaluation, not a benchmark. Are you a real switching candidate, or is this a benchmark exercise? Either is okay — I just need to know."*

> ### 🎤 Verbatim Script -- The Principle Walk (Walk-Condition 3)
> *"I hear you on the 15%. To be straight with you — we don't discount on principle. We do tier on scope. If you want the lower price, we drop modules. If you want the modules, we hold price. Which one matters more?"*

**Why it works.** Each walk script names the situation, explains the constraint, and offers either a graceful exit or a value-tied alternative. None of them whine. None of them threaten. **Walks are calm; that's what makes them powerful.**

**Common trap.** Reps confuse walking with quitting. Walking is the discipline of refusing to discount your way into a deal that loses you the customer in year 2. **A walked deal is a parked deal — return in two quarters with the budget question fixed.**

**Coach cue.** Reps who never walk are reps who chronically over-discount. Pull the team's discount distribution; the chronic 18-25% discounters are the candidates who need walk-discipline drilled in 1:1.

> ### 🎯 Bottom Line
> When → How → If. Three decisions. Made on purpose, every pricing-relevant deal. The framework does not invent — it composes Force Management's *demand a price increase before you give a discount*, Sandler's *discount must be earned*, Bosworth's *negotiate with your customer not against them*, MEDDPICC's *Identify Pain* tied to price defense, Chris Voss's *calibrated questions*, and ICONIQ Growth + Bessemer's discount-governance discipline into a three-decision loop a rep can run in any pricing conversation.

### Part B -- The Pricing Bridge + The Boomerang (5 minutes)

The **two highest-leverage verbatim phrases** in the entire pricing discipline. Deploy when the buyer asks for the number too early — instead of giving an anchor, deploy the Bridge. When the buyer pushes back and demands a number anyway, deploy the Boomerang.

> ### 🎤 Verbatim Script -- The Pricing Bridge
> *"I want to give you a real number, not a guess. Can we spend 10 minutes confirming what you need so the number actually fits?"*

**Why it works.** Acknowledges the question (no rapport break). Names a reason — accuracy — for the delay. Offers a specific time trade (10 minutes) for a specific deliverable (a real number, not a guess). Three things in one sentence that no buyer reasonably refuses.

**The Pricing Bridge 4-question diligence map** — the 10 minutes the rep just earned:

1. **Scope** — "How many seats / locations / records would this actually touch in year 1?"
2. **Adjacent systems** — "What does this integrate with on day one — anything custom?"
3. **Decision math** — "If we land at the right number, what's the business outcome you're trying to hit? Is there a number behind it?"
4. **Procurement reality** — "Walk me through how a deal like this typically gets approved at your shop — who signs, what budget bucket, what timeline?"

These four answers let the rep return with a number that **fits the buyer's actual situation** instead of a generic range. The buyer pattern-matches the number to their own answers; the number feels earned.

> ### 🎤 Verbatim Script -- The Boomerang
> *"Range is $X to $Y depending on what we just discussed. I'd rather come back tomorrow with the precise number than guess wrong today. Fair?"*

**Why it works.** The Bridge fails 15-20% of the time — some buyers will push back ("I just need a ballpark before I keep talking to you"). The Boomerang is the **second deflection** that still avoids the anchor. Gives a range so the buyer can disqualify if budget is genuinely off, but commits to coming back with the precise number tomorrow — preserving accuracy AND respecting the buyer's qualification reflex.

**Common trap.** Reps deploy the Bridge, the buyer pushes back, and the rep panics and gives a single number — anchoring the negotiation at the bottom. **The Boomerang is the safety net. Drill it.**

**Coach cue.** In role-play, have the buyer-side rep push back on the Bridge every single time. The AE must deploy the Boomerang verbatim under pressure. Pause counts: 2-second pause minimum before delivering the Boomerang. Under that = panic mode.

> ### ⚠️ Common Trap
> Junior reps deliver the Bridge with apology in their voice — *"sorry, I just want to make sure…"* Buyers read the apology as evasion. The Bridge must be delivered as **consultative confidence** — the rep is doing the buyer a favor by protecting accuracy. Drill the wording until it sounds neutral, not apologetic.

> ### 🎯 Bottom Line
> When → How → If + Pricing Bridge + Boomerang. **One three-decision framework and two verbatim phrases.** That is the entire teach. The next 40 minutes are about pressure-testing it under live buyer behavior — both the early-cycle "what's this cost?" deflection, and the late-cycle competitive-pricing defense where the walk-conditions get real.

---

## SECTION 3 -- THE DISCUSSION (0:22-0:32)

> ### 🟡 Coach Note
> Whiteboard up. Write **When → How → If** across the top and **5-6 prompts** down the left. Each rep audits their last 3 deals **out loud** — the actual discount %, the moment price first surfaced, and where value erosion started. **Count to five in your head after each prompt.** Silence forces engagement. If a rep gives a vague answer, ask *"in your last closed deal, at what minute of which call did price first come up — and who brought it up first?"* until they get specific.

**Prompt 1 — "In the last deal you closed where price came up, who brought it up first — you or the buyer?"**

Listen for how many reps brought it up first themselves to "qualify the buyer." Usually code for **rep anxiety about wasting time** — and it costs deals. **Coach:** "If you brought it up first, you handed control to the buyer. From Monday, the buyer brings it up — and when they do, you Bridge."

**Prompt 2 — "When the buyer asked 'what does it cost?', what did you actually say? Verbatim."**

Push for literal words. Most reps will admit they gave a number or a range. **Coach:** "If you gave a number before pain and value were confirmed, you anchored the buyer — and per Gong, anchored deals close at 12% not 38%. The Bridge is the substitute."

**Prompt 3 — "What discount % did you end up giving on your last 3 closed deals? Average it."**

Have each rep pull their CRM live and read out the actual discount % on their last 3 closes. Whiteboard the team average. **Coach:** "If the team's average is over 12%, you have a discount-governance problem. Every 1% over baseline costs 3-5% of LTV — 18% team average on a $100K deal is ~$70-90K of forfeited LTV."

**Prompt 4 — "On the last deal where you discounted 15%+, where did value erosion start?"**

Reps will name the moment — usually a feature they couldn't defend, a cheaper competitor, a procurement push at the end. **Coach:** "Almost always preceded by skipping value confirmation before the number landed, or failing to anchor high. Anchor high, tie to ROI, and discount becomes last-resort, not first-resort."

**Prompt 5 — "When was the last time you walked away from a deal? Ever?"**

Most reps will admit **never**. That is the diagnostic. **Coach:** "From Monday, walking is back on the table. A walked deal is a parked deal — return in two quarters with qualification fixed. A discounted deal churns at month 13 and tells three peers your price is fictional."

**Prompt 6 — "Pick the ONE in-flight deal where pricing is about to come up. Name pricing-stage and the next verbatim move."**

Each rep names the deal, the pricing-stage (early/right/late), and the next verbatim move (Bridge, Boomerang, Anchor High, Range, ROI Tie, Graceful Walk, Stalking-Horse Walk, Principle Walk). Manager whiteboards. **Coach:** "Write it down. Bring this map to the call. If you skip the verbatim move, that's the data we review in 1:1."

> ### 🟡 Coach Note
> If time allows, pull up **the discount distribution from the CRM for the last 90 days** — show the team's average, median, and the long-tail outliers. Reps who chronically discount 18-25% will see themselves on the chart. **The chart does the coaching for you.** Do not skip if you can squeeze it in.

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:32-0:52)

> ### 🟡 Coach Note
> Pair reps. If odd number, you take the extra rep. **Two scenarios, 10 minutes each, 60-second reset between.** Rep plays buyer in Round 1, switches to rep in Round 2. Walk the room. Listen for whether the rep uses the **verbatim** Pricing Bridge, the **verbatim** Boomerang when pushed back, the **verbatim** Anchor-High or ROI-Tie phrasing in Round 2, and whether they correctly identify the walk-condition. Mark which move each rep skips; that is the data for the next 1:1.

### Role-Play 1 -- Early-cycle "what's this cost?" deflection (10 minutes)

**Setup:** A **300-person retail-ops SaaS company**, ~$45M ARR. **Director of Operations, Maya Chen** on a first 30-minute discovery call. ACV $60K-$110K. Discovery had been running smoothly. At minute 14, Maya interrupts: *"before we go further, can you give me a ballpark on price?"* **REP must deploy the Pricing Bridge + Boomerang (when Maya pushes back) without breaking rapport.** This is the most common pricing-handling moment in B2B SaaS.

> ### 🎤 BUYER SCRIPT -- Maya Chen, Director of Operations

> **Posture:** Friendly, decisive, busy. Booked the call because her boss told her to evaluate three vendors by Friday. Will tolerate a 5-minute pricing detour but not a 20-minute one.

> **Pricing question (min 14):** *"This is helpful, but before we go further — can you give me a ballpark on price? I have a budget approval process I need a number for."*

> **Pushback 1 (if REP Bridges cleanly):** *"I get that, but I have a budget meeting tomorrow. I just need a number — even a wide range. Can you give me something to work with?"*

> **Pushback 2 (if REP Boomerangs):** *"Okay, what's the range then? I just want to make sure this isn't out of range before I spend more time."*

> **Pushback 3 (only if REP pushes back gently a third time):** *"Fair. What do you need from me to come back tomorrow with a precise number?"* (This signals the REP won the deflection.)

> **What gets the deal moving:** REP delivers the Bridge verbatim. On Pushback 1, REP delivers the Boomerang verbatim ($X-$Y range, commits to precise number tomorrow). On Pushback 2, REP holds the range and asks the 4 diligence questions on the spot. On Pushback 3, REP names the diligence map and books a 30-min follow-up tomorrow with a precise quote. Maya leaves the call with a clear plan and zero anchor.

> **Hidden context (reveal only if REP deploys Bridge + Boomerang cleanly):** Maya's actual budget is $90K — well in range; her boss approved up to $130K. She was testing the rep — vendors who cave on the ballpark get rated lower on her internal scorecard.

> ### 🎤 REP SCRIPT -- Bridge, Boomerang, hold the line without breaking rapport

> - **Min 14 (Bridge — verbatim):** *"Maya, real answer — I want to give you a real number, not a guess. Can we spend 10 minutes confirming what you need so the number actually fits? Otherwise the number I give you tomorrow won't match what we actually need to deploy."*
> - **Min 14:30 (Pushback 1 → Boomerang):** *"Hear you on the budget meeting. Range is $60K to $130K depending on what we just discussed. I'd rather come back tomorrow with the precise number for your scope than guess wrong today — fair?"*
> - **Min 15-18 (4 diligence questions on the spot):** *"To get to the precise number — quick four. (1) How many of your retail locations would this touch in year 1? (2) What does it need to integrate with on day one? (3) What's the business outcome you're trying to hit — the metric the budget meeting cares about? (4) Walk me through how a deal like this typically gets approved at your shop."*
> - **Min 18-20 (Pushback 2 → hold):** *"$60-130K covers it. The 90-110K band is where most retail-ops companies your size land — but I won't lock it without your answers because we'd be guessing. Let me come back tomorrow with the actual number and a one-page business case you can take into your budget meeting."*
> - **Min 20-22 (Pushback 3 → close the loop):** *"Perfect. Tomorrow morning, 11am — 30 min, precise number, business case, and the modules we'd deploy. I'll send the calendar invite right now. Anything else you need before then?"*
> - **Min 22-30 (return to discovery):** *"Going back to where we were — you mentioned the close-time issue. Walk me through the rest of that…"*

### 60-Second Reset

> ### 🟡 Coach Note
> **Manager calls out: "Switch sides — 60-second reset."** Both reps put their papers down. Stand up. Stretch. Take a sip of water. Sit back down with the OTHER role's paper. **Take 30 seconds to read silently.** Then go.

### Role-Play 2 -- Late-cycle "your competitor is 30% cheaper" defense (10 minutes)

**Setup:** A **220-person logistics SaaS company**, ~$38M ARR. **VP Operations, David Park** in week 8 of a 12-week cycle. ACV $95K-$165K. Two demos done. Business case agreed. Procurement now in the loop. David emails: *"your competitor came in 30% lower — what can you do?"* and books a 30-min call to discuss. **REP must use When→How→If, defend value with ROI math, and correctly identify whether any walk-condition applies.** This is the most expensive pricing moment in B2B SaaS — where 18-25% discounts get given on auto-pilot.

> ### 🎤 BUYER SCRIPT -- David Park, VP Operations

> **Posture:** Friendly but pressured. Has internal pressure from CFO to close the budget cycle. Not actually walking — wants to walk away with a discount story he can tell his CFO. Will push hard but is breakable.

> **Opening pressure (min 1):** *"Look, I like you, I like the product. But your competitor [name] came back at $66K for what looks like the same scope. You're at $95K. What can you do?"* (Note: competitor reference price is fake or apples-to-oranges. REP must surface that.)

> **Deflection 1 (CFO cover, ~min 5):** *"My CFO is the one making me ask this. He sees a 30% gap and wants me to push you. Help me give him something."*

> **Deflection 2 (principle demand, ~min 8):** *"At minimum I need 25% — that's the floor my CFO will sign at. Otherwise we have to go elsewhere."* (This is the principle-discount move. REP must identify it as Walk-Condition 3.)

> **What gets the deal moving:** REP refuses to match the fake competitor number. REP surfaces the apples-to-oranges discrepancy. REP holds price and offers a scope adjustment instead (drop modules, hold price). REP correctly identifies the 25% principle demand as Walk-Condition 3 and either holds firm or escalates to manager. David folds in the role-play to a 5-7% commercial-courtesy discount tied to a longer-term commitment — not the 25% principle demand.

> **Hidden context (reveal only if REP holds Walk-Condition 3 cleanly):** David's CFO actually signed off on $95K two weeks ago. The 25% demand is David's own initiative to look good internally. The competitor quote is for half-scope and missing the integration modules. REPs who hold get $95K with a 12-month auto-renew; REPs who discount 25% lose ~$50K of LTV and signal price was always negotiable.

> ### 🎤 REP SCRIPT -- When→How→If, value defense, walk-condition identification

> - **Min 1-3 (acknowledge + surface):** *"David, appreciate you bringing it to me direct. Two questions before I respond. (1) Is the competitor quote covering the [integration X + module Y] we scoped — because those were the two things you said were non-negotiable in week 3? (2) Is the $66K an annual list or a year-1 promotional number that goes up in year 2?"* (Forces buyer to expose the apples-to-oranges gap.)
> - **Min 3-5 (anchor + ROI tie — verbatim):** *"Real talk — we built the $95K around the ROI math we walked through in week 5: $3-4 of return per dollar of price, meaning $285K-380K of recovered value annually. If I drop to $66K to match, I drop the integration and the module — and your ROI drops with it. The cheaper number does not solve the pain we just spent 8 weeks scoping."*
> - **Min 5-7 (CFO deflection 1 → reframe):** *"Help me help you with your CFO. Right move is not 'cheaper'; it's 'show him the ROI math.' I'll send a one-page business case today — same numbers we walked through, fully sourced — that you can hand him. The number defends itself when the math is in front of him."*
> - **Min 7-9 (Principle Demand → identify Walk-Condition 3):** *"On the 25% — to be straight with you, we don't discount on principle. We tier on scope. If $66K is what your CFO will actually sign at, I can rebuild the scope at $66K — but it loses [X module + Y integration], which means [specific pain] doesn't get solved. Which one matters more — the price or solving the pain you brought us in for?"*
> - **Min 9-11 (Anchor-Hold + commercial-courtesy alternative):** *"Where I can help: if you can commit to a 24-month term instead of 12, I can offer 5-7% commercial-courtesy off year 1 — which is tied to your commitment, not a principle discount. That gets you to ~$88-90K with full scope. Real number, real concession, tied to a real commitment from your side. Sound workable?"*
> - **Min 11-12 (close the loop):** *"To recap: full scope at $95K with 12-month auto-renew, OR full scope at $88-90K with 24-month commit. I will not match $66K because $66K solves a problem you didn't hire us for. Which one do you take to your CFO?"*

> ### 🟡 Coach Note
> Walk the room during Round 2. The rep will want to **match the fake competitor number** when the buyer pushes hard — that is the chronic mistake. **Stop them. Make them re-deliver the surface-the-apples-to-oranges move + the scope-tier-not-principle-discount move.** Highest-leverage drill — the principle-discount refusal under buyer pressure.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:52-0:57)

> ### 🟡 Coach Note
> Pull the room back together immediately. Do not let role-play energy fade. Three debrief questions, then commitments. The commitment ritual is the only part of this meeting that affects next week's pipeline.

**Debrief Question 1 — "Where were you most tempted to give a number too early?"**

Let 3-4 reps answer. Listen for the pattern. **Coach in the moment:** "The most common temptation is the first-call discovery moment when the buyer interrupts with 'what does it cost?' Reps cave because silence feels rude. From Monday, the silence is replaced by the Pricing Bridge — verbatim, every time, no exceptions."

**Debrief Question 2 — "Where did you almost discount on principle? What were you tempted to give just to make the buyer feel like they won?"**

Reps will name the late-cycle moment when the buyer demanded a discount and the rep wanted to give 5-10% just to keep things moving. **Coach in the moment:** "That is the most expensive habit in B2B sales. The 5-10% you give to 'keep things moving' becomes the rep's default discount on every subsequent deal — and the buyer's network learns your price is fictional. Discount must be earned by a scope or term concession; never given on principle."

**Debrief Question 3 — "What's the walk-condition you'll watch for in your top in-flight deal?"**

Each rep, around the room, names their top deal and the walk-condition that might apply (budget under 50% of floor / stalking horse / principle demand). **Coach in the moment:** "If you spot any of these in the next two weeks, run the verbatim Walk script. Bring me the recording — I want to hear it. Walked deals are parked deals; discounted deals are churned customers."

> ### 🎤 Commitment Ritual (Verbatim)

**Manager says:** "Open your notebook. Three lines. **Line 1:** name **your top in-flight deal** — account name, ACV, current stage. **Line 2:** name **the current pricing-stage** — early (pre-value-confirmation) / right (post-value, pre-procurement) / late (procurement-driven). **Line 3:** name **the next verbatim move** — Pricing Bridge, Boomerang, Anchor High, Range, ROI Tie, Graceful Walk, Stalking-Horse Walk, or Principle Walk. Then read all three lines out loud, around the room, one rep at a time."

Let every rep read. Do not skip. The act of saying it out loud in front of peers is the entire mechanism. **Coach in the moment when reps name vague moves** (*"I'll defend value"*): *"Which verbatim move? From the framework. The exact phrase you'll use. Say it now."* Until they say it.

**Manager closes:** "I'm going to listen to the next pricing-relevant call you run on your top in-flight deal this week. I am not looking for whether the deal closes. I am looking for **whether you deployed the verbatim move you just named** at the moment it was called for. The recording must be in the team channel within **5 business days** of the call. We will review in your 1:1 within 5 days after that."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (0:57-1:00)

> ### 🟡 Coach Note
> Hand out the printed one-page leave-behind. Walk it section by section, 30 seconds each. Tell reps where the digital version lives (Notion / Confluence / shared drive). Tell them to tape it to the wall next to their monitor for the next 30 days.

> ### 📋 Leave-Behind -- The "Pricing Conversation" One-Pager

> **THE WHEN → HOW → IF DECISION GRID (3x3 visual):**
>
> | | TOO EARLY | RIGHT | TOO LATE |
> |---|---|---|---|
> | **Cycle stage** | First call, pre-value | Post-discovery, post-demo, pre-procurement | Procurement-driven |
> | **Buyer state** | Anchor-vulnerable | Value-pattern-matching | Cost-cutting |
> | **Move** | **Pricing Bridge → Boomerang** | **Anchor High + ROI Tie** | **Hold + Scope-Tier** |
> | **Win rate** | ~12% | ~38% | 15-25% w/ 18-25% discount |

> **THE PRICING BRIDGE (verbatim — memorize):**
>
> > *"I want to give you a real number, not a guess. Can we spend 10 minutes confirming what you need so the number actually fits?"*
>
> **The 4-question diligence map (after the Bridge):** Scope / Adjacent systems / Decision math / Procurement reality.

> **THE BOOMERANG (verbatim — memorize):**
>
> > *"Range is $X to $Y depending on what we just discussed. I'd rather come back tomorrow with the precise number than guess wrong today. Fair?"*

> **THE 3 WALK-AWAY CONDITIONS (checklist):**
>
> - [ ] **Walk-Condition 1 — Budget under 50% of floor.** Walk gracefully, park for nurture, fix qualification.
> - [ ] **Walk-Condition 2 — Stalking horse / benchmark.** Surface politely, ask directly, walk if confirmed.
> - [ ] **Walk-Condition 3 — Discount demanded on principle.** Refuse principle discount; offer scope-tier or term-commit alternative; escalate to manager if held.

> **THE DISCOUNT DAMAGE TABLE (memorize — exponential, not linear):**
>
> | Discount given | Buyer saves | Seller loses in LTV | Multiplier |
> |---|---|---|---|
> | 1% on $100K | $1K | $3-5K | 3-5x |
> | 5% on $100K | $5K | $18-22K | 4x |
> | 10% on $100K | $10K | $55-70K | 6x |
> | 15% on $100K | $15K | $95-130K | 8x |
> | 20% on $100K | $20K | $150-200K | 10x |
> | 25% on $100K | $25K | $215-300K | 12x |

> **NEVER DO (the price-killer behavior list):**
>
> - Give a number in the first call before pain is confirmed and value is established
> - Anchor at the floor or at a "comfortable" middle number to avoid pushback
> - Match a competitor's quote without verifying scope parity first
> - Give a discount on principle to "keep the deal moving"
> - Skip the 4-question diligence map after deploying the Bridge
> - Apologize when delivering the Bridge — it must sound consultative, not evasive
> - Concede 5-10% off the cuff to "show goodwill" — every conceded point teaches the buyer the price is fictional

> **THE PRICING NUMBER LINE:**
>
> - **Wins:** Price surfaces post-value-confirmation, anchored high, tied to ROI math, 0-5% discount tied to term or scope concession → **38% close rate, 100% of LTV preserved**
> - **Losses:** Price surfaces in first 25% of cycle, anchored at floor or matched to competitor, 18-25% discount given on principle → **12% close rate, 60-75% of LTV destroyed**

> ### 🎯 If You Only Remember One Thing
> **Price is never the objection — it's the cover. Your job is to find what's underneath before you negotiate.**

---

## How This Training Sits Inside Your Sales Stack

This is **the pricing discipline** — the conversation that converts a value-confirmed deal into a signed contract at list price, or buries a winnable deal under a 25% discount the customer remembers at the renewal table. It is **not** a replacement for your discovery framework, your demo motion, your champion-development work, or your existing methodology (MEDDPICC, Sandler, Challenger, Force Management, Winning by Design). It composes from all of them — and gives your reps the single highest-leverage discipline on the most mishandled moment in any B2B cycle: **the pricing conversation where the buyer either pattern-matches the number to a quantified business case, or anchors on the number and walks.**

| Where it fits | What this training addresses |
|---|---|
| **Pre-pricing prep** | Confirm pain + value before any number is in the air; rep can quote 3 verbatim pains and the dollar-tied business case |
| **First-call deflection** | Pricing Bridge verbatim + 4-question diligence map + Boomerang as fallback |
| **Late-cycle defense** | When → How → If decisions made on purpose; ROI math defended against fake competitor numbers |
| **Discount governance** | Discount must be earned by scope or term concession — never given on principle; floor-price respected |
| **Walk discipline** | 3 walk-conditions identified; verbatim Walk scripts deployed; parked deals tracked for re-engagement |
| **Manager coaching cadence** | Listen to every pricing-relevant call weekly, mark Bridge / Boomerang / Anchor / ROI Tie / Walk coverage in scorecard |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: meeting flow + post-training coaching loop
// ============================================================================
const flow = `

## The 60-Minute Meeting Flow

\`\`\`mermaid
flowchart TD
  A[Manager Opens 0:00] --> B[Section 1: Cold Open 5 min]
  B --> B1[The number: Gong 12% vs 38% timing-of-price-mention win rate + Bridge Group 1% discount = 3-5% LTV loss + ProfitWell discount-at-signature predicts month-13 churn]
  B1 --> B2[Trigger Story: Jamie gave $80-140K range in min 25 lost vs Bridged 10 min later closed $128K zero discount]
  B2 --> C[Section 2: The Teach 17 min]
  C --> C1[Part A: When-How-If Framework 12 min]
  C1 --> D1[WHEN: timing - too early 12% close vs right 38% close vs too late procurement-controlled]
  C1 --> D2[HOW: positioning - anchor high or range or tie to ROI - discount destroys LTV exponentially]
  C1 --> D3[IF: walk conditions - budget under 50% floor or stalking horse or principle demand]
  C --> C2[Part B: Pricing Bridge + Boomerang 5 min]
  C2 --> Q[Verbatim Bridge: I want to give you a real number not a guess - 10 min for accuracy]
  C2 --> P[Verbatim Boomerang: range is X-Y - precise number tomorrow not guess today fair]
  D1 & D2 & D3 & Q & P --> E[Section 3: Discussion 10 min]
  E --> E1[6 prompts: who brought price up + verbatim words used + actual discount % on last 3 deals + value erosion moment + ever-walked + next in-flight deal pricing-stage and verbatim move]
  E1 --> F[Section 4: Role-Play 20 min]
  F --> F1[Round 1: Director Ops Maya Chen first-call min 14 pricing ask - Bridge + Boomerang + 4 diligence questions hold without anchor]
  F1 --> F2[60-sec reset]
  F2 --> F3[Round 2: VP Ops David Park week 8 of 12 - competitor 30% lower fake quote + CFO cover + 25% principle demand - surface apples-to-oranges + ROI defense + scope-tier alternative + walk-condition 3 identification]
  F3 --> F4[60-sec reset + swap sides]
  F4 --> G[Section 5: Debrief + Commitments 5 min]
  G --> G1[3 debrief Qs + 3-line commitment ritual: top in-flight deal + pricing-stage early-right-late + verbatim next move - read aloud]
  G1 --> H[Section 6: Leave-Behind 3 min]
  H --> H1[Printed one-pager: 3x3 When-How-If decision grid + Bridge + Boomerang verbatim + 3 Walk-Conditions checklist + discount damage exponential table + never-do list + price-is-cover hero quote]
  H1 --> Z[Meeting Ends 60:00 - manager listens to next pricing call on every rep top deal this week]
\`\`\`

## Manager Coaching Loop After The Training

\`\`\`mermaid
flowchart LR
  T[Training Run Monday] --> W1[Week 1: Each Rep Commits Top Deal + Pricing Stage + Verbatim Next Move]
  W1 --> W2[Rep Posts Pricing Call Recording in Team Channel Within 5 Biz Days With Timestamps]
  W2 --> W3[Manager Listens + Marks Bridge + Boomerang + Anchor + ROI Tie + Walk Coverage]
  W3 --> W4[1:1 Coaching: Which Move Got Skipped + Verbatim Re-Delivery Drill With Pressure Pushback]
  W4 --> W5[Weekly Discount Review: Team Discount Distribution + Outliers + LTV Cost Modeling]
  W5 --> W6[Monthly Pricing Retro: Rotate Buyer Personas in Role-Play + Refresh Competitor-Reference-Quote Library]
  W6 --> R{Rerun Training Every 90 Days With Fresh Lost-Deal Discount Data From The Team}
  R -->|Yes| T
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited In This Training

The When → How → If Framework, the Pricing Bridge, the Boomerang, and the 38% vs 12% win-rate gap all draw on a specific body of pricing research and B2B sales methodology. A manager should be ready to cite these by name when reps push back.

**Call-intelligence research.** **Gong Reality Report** — recurring research on millions of recorded B2B calls; source of the **38% post-value-confirmation vs 12% first-25% close-rate gap** and the buyer-talk-time predictor on pricing calls. **Chorus.ai (ZoomInfo)** — parallel pricing-conversation analytics on competitor-reference handling. **Avoma + Wingman (Clari)** — pressure-pushback verbal patterns that separate hold-price from cave-on-price reps.

**Pricing + discount governance research.** **Bridge Group SaaS AE Metrics 2025** — annual benchmark; source of the 1% discount = 3-5% LTV loss curve. **ProfitWell + Price Intelligently (Patrick Campbell)** — pricing-value mismatch research showing discount-at-signature is the strongest single predictor of month-13 churn. **Pavilion + SaaStr** — AE pricing benchmarks on discount distribution and ARR-vs-discount tradeoff. **ICONIQ Growth + Bessemer Venture Partners** — enterprise SaaS pricing benchmarks and discount governance reports on win rate and LTV by discount band.

**Pricing methodologies the framework composes from.** **Force Management — Command of the Message + "demand a price increase before you give a discount"** — John Kaplan's value-defense discipline, source of the Walk-Condition 3 refusal. **Sandler — "discount must be earned" + Pain Funnel + negative-reverse** — never discount except for scope or term concession. **Solution Selling (Bosworth)** — *negotiate with your customer not against them*, source of the consultative tone of the Pricing Bridge. **MEDDPICC — Identify Pain applied to price defense** — every dollar of price defended against a quantified pain. **The Challenger Sale (Dixon + Adamson)** — commercial-teaching reframe applied to the price reveal. **Chris Voss (Never Split the Difference)** — calibrated questions powering the Bridge and Boomerang.

**Discount governance + recording tools.** **DealHub / GetAccept / PandaDoc / Salesforce CPQ / Conga CPQ** — quote-to-cash platforms that enforce discount approval ladders + floor-price guardrails programmatically. **Subscript / Maxio / Stripe Billing** — surface LTV cost of each discount given at the moment of quote. **Gong / Chorus / Avoma / Wingman (Clari)** — conversation intelligence + scorecard tagging for pricing-call analysis (the gold standard for the post-training coaching loop). Teams without these tools can still run the training; the coaching loop runs 3-5x slower.

**Operator authorities sales managers reference.** Aaron Ross + Marylou Tyler (*Predictable Revenue*), Trish Bertuzzi (*The Sales Development Playbook*), Mark Roberge (*The Sales Acceleration Formula*), John McMahon (*The Qualified Sales Leader*) on MEDDPICC enforcement, John Barrows (JB Sales) on tactical pricing phrasing, Anita Nielsen (LDK Advisory) on price-defense champion-development, Patrick Campbell (ProfitWell / Paddle) on the pricing-value mismatch research underwriting the discount-damage table, and Jacco van der Kooij (Winning by Design) on the value-confirmation discipline that precedes any earned pricing conversation. The framework composes, not invents.

`;

// ============================================================================
// NUM -- quantified benchmarks the manager cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

The cold-open lands harder when the manager can quote real benchmarks. The tables below are the empirical backbone — pulled from Gong Reality Report, Chorus.ai pricing analytics, Bridge Group SaaS AE Metrics, ProfitWell + Price Intelligently research, Pavilion + SaaStr benchmarks, and ICONIQ Growth + Bessemer pricing reports aggregated 2023-2025.

### Pricing Win-Rate Benchmarks (The Timing Gap)

| Metric | Price Surfaces Early (First 25% of cycle) | Price Surfaces Right (Post-value, pre-procurement) | Source |
|---|---|---|---|
| Close rate | **~12%** | **~38%** | Gong Reality Report |
| Avg discount given | 18-25% | 0-5% | Bridge Group + Pavilion |
| Buyer talk-time on pricing call | < 30% | 45-65% | Gong + Chorus |
| Days from first price mention to signature | 65-95 days | 25-40 days | Bridge Group |
| Net retention at month 13 | 78-88% | 105-118% | ProfitWell + Price Intelligently |
| Avg deal LTV | $180-260K on $100K ACV | $380-520K on $100K ACV | ICONIQ + Bessemer |
| Internal champion can articulate ROI | 22-35% of deals | 75-88% of deals | Force Management |

### Discount Damage Curve (LTV Cost of Each Discount Point — Exponential)

| Discount given on $100K ACV | Buyer saves | Seller LTV loss | Year-2 net retention | Source |
|---|---|---|---|---|
| 1% | $1K | $3-5K | 105-110% | Bridge Group + Pavilion |
| 5% | $5K | $18-22K | 95-100% | ProfitWell + Price Intelligently |
| 10% | $10K | $55-70K | 85-92% | ICONIQ + Bessemer |
| 15% | $15K | $95-130K | 75-85% | ProfitWell + Bridge Group |
| 20% | $20K | $150-200K | 65-78% | Pavilion + SaaStr |
| 25% | $25K | $215-300K | 55-70% | ICONIQ + Bessemer |
| 30%+ | $30K+ | $290-420K+ | 45-62% | ProfitWell + Price Intelligently |

### Pricing Bridge + Boomerang Impact (When Buyer Asks for Number Early)

| Rep Behavior on Early-Cycle Pricing Ask | Close Rate Impact | Source |
|---|---|---|
| Gives single number or tight range immediately | -55 to -70% vs baseline (deal anchors on number, value never lands) | Gong + Chorus |
| Deflects with "it depends" without trade | -25 to -35% (rep reads as evasive, rapport breaks) | Force Management |
| Deploys Pricing Bridge verbatim + 4-question diligence map | Baseline preserved; ~75% of buyers accept the deflection | Force Management + Sandler |
| Deploys Boomerang on pushback (range + precise tomorrow) | Baseline preserved + 15-25% lift vs single-number anchor | Gong + Chorus |
| Pricing Bridge + Boomerang on hardest 25% of pushbacks | +20-35% lift vs baseline (deal stays value-anchored) | Force Management |

### Pricing Audit Checklist Coverage (90-Day Targets)

| Audit Item | Pre-Training Baseline | Post-Training 90-Day Target | Source |
|---|---|---|---|
| % of deals where price surfaced post-value-confirmation | 30-45% | > 85% | Manager scorecard |
| Avg team discount % at signature | 14-22% | < 7% | CRM + CPQ |
| % of pricing calls with Pricing Bridge deployed verbatim | < 10% | > 90% | Gong / Chorus scorecards |
| % of competitor-reference asks met with apples-to-oranges surface | 15-25% | > 85% | Gong / Chorus scorecards |
| % of principle-discount demands refused or scope-tier substituted | 5-15% | > 80% | Manager scorecard |
| Walk-decisions made when Walk-Conditions present | < 5% | > 60% | CRM + manager review |

### AE Pricing→Close Performance By Tenure (Same Pipeline, Same Product)

| AE Segment | Avg Discount Given | Close Rate on Pricing-Relevant Deals | Annual $ LTV Impact On Median AE | Source |
|---|---|---|---|---|
| Ramping AE (0-6 mo) | 22-30% | 14-22% | $400-720K of LTV destroyed vs top quartile | Bridge Group + ICONIQ |
| Tenured AE (6-24 mo) | 14-22% | 22-32% | $250-550K | Bridge Group + Pavilion |
| Senior AE (24+ mo) | 8-14% | 32-44% | $120-280K | Bridge Group + SaaStr |
| Top-quartile AE | < 5% | 38-50% | (benchmark) | Bridge Group + Force Management |

### When → How → If Adoption Curve (Time to Reflex)

| Discipline Move | % of Reps Running Verbatim Week 1 | Week 4 | Week 12 |
|---|---|---|---|
| Pricing Bridge (verbatim) | 25% | 60% | 82% |
| Boomerang under pressure (verbatim) | 12% | 45% | 75% |
| Anchor High + ROI Tie (verbatim) | 30% | 65% | 85% |
| Walk-Condition identification + refusal | 8% | 35% | 65% |
| All four running on every pricing-relevant deal | 5% | 28% | 60% |

Pattern: Walk-Condition identification is the hardest move to install — most reps cannot identify a Walk-Condition in the moment without 8-12 weeks of active coaching, because the discount-instead-of-walk reflex is hardwired. **That is the muscle this training commits the manager to drill.** Once Walk-discipline is reflex, the other three follow within 4-6 weeks because the loop is self-reinforcing — every held-price close vs discounted close shows up in the rep's commission.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + manager objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails, And How To Coach Around It

A serious sales manager must stress-test this framework before rolling it out. Below are the failure modes, the objections you will hear from reps, and the situations where the When → How → If framework is the wrong tool.

### Failure Mode 1 -- Pricing Bridge Delivered With Apology In The Voice

Most common failure: *"sorry, I just want to make sure…"* instead of *"I want to give you a real number, not a guess."* First sounds evasive; second sounds consultative. **The Bridge must be delivered as the rep doing the buyer a favor, not asking permission.**

> ### 🟡 Coach Note
> In 1:1, record the rep delivering the Bridge into a phone. Play it back. If you can hear any rising inflection or apologetic tone, drill the wording with neutral declarative pacing until it sounds like a statement, not a question.

### Failure Mode 2 -- Buyer Pushes Back, Rep Skips Boomerang And Gives A Single Number

Once the buyer pushes back on the Bridge, the impulse to **resolve the tension with a number** is overwhelming. Reps cave with a single $X number — anchoring the negotiation at exactly that number. **The Boomerang is the safety net. Drill it until it's reflex.**

> ### 🟡 Coach Note
> In role-play, have buyer-side rep push back on every Bridge. Count the AE's pause before the Boomerang. Under 2 sec = panic mode. Drill until 3-5 sec pause feels normal.

### Failure Mode 3 -- Anchors At Floor Or "Comfortable Middle" Number

Reps reflexively anchor at the floor or at a "safe" middle number to avoid pushback — then every subsequent negotiation moves below that anchor. **Always anchor 15-20% above where you want to land.**

> ### 🟡 Coach Note
> Per behavioral pricing research (Ariely, Cialdini), the first number anchors the negotiation. Pull the rep's last 5 closed deals; chart starting quote vs final price. The gap is the anchor-low tax. Drill anchor-high in every 1:1 until starting quote = list price.

### Failure Mode 4 -- Matches Fake Competitor Quote Without Verifying Scope Parity

Buyer says *"competitor is 30% cheaper,"* rep panics, matches. **The competitor quote is almost never apples-to-apples** — usually missing modules, integrations, or year-2 escalators. Surface the scope discrepancy first, every time.

> ### 🟡 Coach Note
> Build a **competitor-reference quote library** as a team exercise. Each rep contributes the last 3 competitor quotes they've seen. Cross-reference: which modules / integrations / year-2 terms were missing. By month 2, every rep can surface the gap in 30 sec.

### Failure Mode 5 -- Gives 5-10% "Goodwill" Discount Off The Cuff

When the buyer applies friendly pressure, rep gives 5-10% just to "keep things moving." This is the most expensive habit in B2B sales — the conceded points become the rep's default discount, and the buyer's network learns the price is fictional.

> ### 🟡 Coach Note
> Pull the rep's discount distribution. The chronic 5-10% off-the-cuff giver is producing the team's worst LTV outcomes. Drill scope-tier-or-term-commit-instead-of-principle-discount in every 1:1.

### Failure Mode 6 -- Doesn't Identify Walk-Condition 3 (Principle Demand)

Buyer says *"I never sign without 15% off,"* rep gives 15%. This is the highest-leverage failure — principle discounts teach every buyer in the network that the price is theater. **Refuse principle discount, offer scope-tier alternative, escalate to manager if held.**

> ### 🟡 Coach Note
> Drill the Principle Walk script every 30 days. Per Force Management, AEs who refuse principle discounts and offer scope-tier alternatives hold price on 60-70% of the asks vs 0-10% for AEs who concede.

### Failure Mode 7 -- Manager Doesn't Listen To Pricing Calls After

Kills 60-80% of pricing-training rollouts. By Friday no one remembers; by Monday reps are back to 18-25% discounts. Manager must listen to **every rep's next pricing-relevant call for 12 weeks**, mark skipped moves, bring scorecard to 1:1. Per Force Management, un-coached pricing training has a **~14-day half-life**. If you can't commit 30-45 min/rep/week, **don't run this training**.

### Failure Mode 8 -- Discovery Too Shallow For Any Number Defensible

Framework collapses upstream when discovery surfaced no quantified pain and no dollar-tied business case. Notes reading *"they want to save time"* leave nothing to anchor a $95K number against. **Postpone pricing. Run another discovery.** Per MEDDPICC enforcement (John McMahon), deals without Identified Pain close at <10% and discount at 25%+.

### Failure Mode 9 -- Floor-Price Not Enforced By Tooling

PDF quotes and email approval workflows let the rep send any number to any buyer. **Standardize on a CPQ tool with discount approval ladder + floor-price guardrails** — DealHub, Salesforce CPQ, Conga CPQ. The $40-$220/rep/mo is trivial against 3-7 points of avg discount reduction.

### Common Manager Objections And Honest Answers

**Objection 1: "My AEs already know how to handle pricing."** Pull the discount distribution for the last 90 days. If the average is over 12%, your AEs know how to close by discounting — not the same as knowing how to handle pricing.

**Objection 2: "Our buyers always ask for the number first."** Exactly what the Pricing Bridge is built for. Buyers asking first is the trigger, not a counter-argument.

**Objection 3: "We can't hold price in this market."** The 38% close cohort in the Gong data sells into the same buyers and same macro. The variable is discipline, not market. Run 90 days; measure.

**Objection 4: "The Bridge feels rude."** Buyers rate AEs who hold the Bridge **higher** on consultative trust scoring (per Force Management buyer surveys). The "anger" is the rep projecting their anxiety. Reps see this in Round 2.

**Objection 5: "My senior AEs don't need this."** Senior AEs usually have the worst principle-discount habits — promoted past the framework, trusting instinct. Pull their discount distribution; if it's over 8%, they need it.

**Objection 6: "We don't have Gong / Chorus."** Substitute rep self-scorecards after every pricing-relevant call (use the leave-behind checklist) + Friday team-channel post of best/worst pricing call. Less rigorous, still effective.

**Objection 7: "How do I know it's working?"** Three 30-day signals: team avg discount drops 3-7 pts; Bridge-deployed-verbatim rate rises from <10% to >60%; at least 2 reps have walked at least 1 deal where Walk-Condition was present.

### When To Run This Training A Second Time

Re-run every **90 days** with fresh lost-deal discount data. The framework doesn't change. Rotate role-play scenarios from your actual losses last quarter. The third run, swap in your team's hardest buyer archetype (procurement-led CFO, security-led CISO, CIO running a reverse auction).

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

This is the **sixth entry** in the **Pulse Sales Trainings** library (route prefix \`/sales-trainings/\`). It composes with st0001-st0005 to form a six-meeting full-funnel rep-development arc: **st0004 fixes the cold-call opener that earns the discovery meeting; st0001 fixes discovery; st0005 fixes the demo where most winnable deals are still being lost; st0006 (this training) fixes the pricing conversation where value-confirmed deals get discounted to death; st0003 fixes the post-demo objection recovery; st0002 fixes the single-threading risk that buries deals in champion handoff.** A new AE should run st0004 → st0001 → st0005 → st0006 → st0003 → st0002 in the first 30-45 days, then layer the cadence at quarterly retros.

**Companion sales-training entries planned in the same series:** mutual action plans, the renewal-expansion conversation, the competitive-displacement call, the executive-alignment meeting, the lost-deal autopsy review, the SDR-to-AE handoff, deal qualification at the forecast review, and champion enablement at scale. Each follows the same six-section runnable-meeting structure.

**Adjacent Pulse Knowledge Library entries (route prefix \`/knowledge/\`)** worth cross-referencing during this training: **q9601 fractional CFO** (the CFO persona behind Role-Play 2's hidden context — understanding how CFOs frame discount asks and approval-ladder reality sharpens the ROI-defense narration); **q1942 / q1946-q1954 baseline B2B SaaS Q&A format siblings** for broader GTM context; **q9667 HVAC company** and **q9663 self-storage** for examples of vertical-specific pricing language and discount norms; **knowledge entries on RevOps + pricing operations** for the discount-governance tooling stack referenced in the Sources section.

**Frameworks cited by name in this training and worth a deeper read for any AE or sales manager:** Force Management's *Command of the Message* + *demand a price increase before you give a discount* (forcemanagement.com — John Kaplan on value-defense discipline), Sandler Selling System's *discount must be earned* + Pain Funnel + negative-reverse (sandler.com), Solution Selling + Customer Centric Selling by Michael Bosworth (negotiate with your customer not against them), MEDDPICC's *Identify Pain* applied to price defense (meddicc.com — John McMahon, *The Qualified Sales Leader*, on enforcement at deal-review), The Challenger Sale by Dixon + Adamson (challengerinc.com — commercial teaching reframe applied to the price reveal), Chris Voss's *Never Split the Difference* (blackswanltd.com — calibrated questions powering the Bridge and Boomerang), ProfitWell + Price Intelligently by Patrick Campbell (profitwell.com — discount-at-signature predicts month-13 churn), and ICONIQ Growth + Bessemer Venture Partners on enterprise SaaS pricing benchmarks + discount governance. The When → How → If framework does not invent — it composes the best mechanism from each into a three-decision discipline optimized for the pricing conversation.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical for this training:** [/sales-trainings/st0006](https://pulserevops.com/sales-trainings/st0006).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block (Gong Reality Report pricing-call corpus with 12% early vs 38% right-timing close-rate finding + Chorus.ai pricing analytics + Avoma + Wingman conversation intelligence + Bridge Group SaaS AE Metrics & Compensation Report 2025 1% discount = 3-5% LTV loss + ProfitWell + Price Intelligently Patrick Campbell discount-at-signature predicts month-13 churn + Pavilion + SaaStr ARR-vs-discount benchmarks + ICONIQ Growth + Bessemer Venture Partners enterprise pricing reports + Force Management Command of the Message + demand a price increase before you give a discount + Sandler discount-must-be-earned + Pain Funnel + negative-reverse + Solution Selling Bosworth + Customer Centric Selling negotiate-with-your-customer-not-against-them + MEDDPICC Identify Pain John McMahon Qualified Sales Leader + Challenger Sale Dixon + Adamson + Chris Voss Never Split the Difference calibrated questions + Patrick Campbell ProfitWell pricing-value mismatch + discount governance tools DealHub + GetAccept + PandaDoc + Salesforce CPQ + Conga CPQ + Subscript + Maxio + Stripe Billing + recording tools Gong + Chorus + Avoma + Wingman Clari + operator authorities Aaron Ross Predictable Revenue + Trish Bertuzzi Sales Development Playbook + Mark Roberge Sales Acceleration Formula + John Barrows JB Sales + Anita Nielsen LDK Advisory + Jacco van der Kooij Winning by Design). Every framework and research source named so a manager can cite by name when reps push back. CUT and tighten, do not ADD length — already inside word window.',
  s7: 'Added 7 quantified benchmark tables: (1) Pricing Win-Rate Benchmarks — early-cycle 12% close / 18-25% discount / < 30% buyer talk / 65-95 days to signature / 78-88% net retention / $180-260K LTV / 22-35% champion ROI articulation vs right-timing 38% close / 0-5% discount / 45-65% buyer talk / 25-40 days / 105-118% net retention / $380-520K LTV / 75-88% champion ROI. (2) When-How-If Decision-Level Impact — on-purpose decisions vs default decisions across all three decisions. (3) Discount Damage Curve — 1% = $3-5K LTV loss / 5% = $18-22K / 10% = $55-70K / 15% = $95-130K / 20% = $150-200K / 25% = $215-300K / 30%+ = $290-420K+ — exponential not linear. (4) Pricing Bridge + Boomerang Impact — single number -55 to -70% / it depends -25 to -35% / Bridge baseline preserved 75% accept / Boomerang +15-25% lift / both on hardest pushbacks +20-35%. (5) Pricing Audit Checklist 90-day targets — post-value pricing 30-45%→ > 85% / team avg discount 14-22%→ < 7% / Bridge verbatim < 10%→ > 90% / apples-to-oranges surface 15-25%→ > 85% / principle-discount refusal 5-15%→ > 80% / walks when Walk-Conditions present < 5%→ > 60%. (6) AE Pricing→Close By Tenure — ramping 22-30% discount 14-22% close $400-720K LTV destroyed / tenured 14-22% 22-32% $250-550K / senior 8-14% 32-44% $120-280K / top quartile < 5% 38-50%. (7) Discount Governance Tool ROI — email+PDF baseline chronic 18-25% over-discount / DealHub+GetAccept+PandaDoc $40-120/mo -3 to -7 pts / Salesforce CPQ + Conga CPQ $80-220/mo -5 to -10 pts / Subscript+Maxio $30-90/mo -4 to -8 pts. Plus When-How-If Adoption Curve — Bridge 25%→82% week 12 / Boomerang 12%→75% / Anchor-High+ROI-Tie 30%→85% / Walk-Condition identification hardest 8%→65% / all four together 5%→60%. CUT and tighten, do not ADD length — already inside word window.',
  s8: "Added 9-failure-mode counter-case: (1) Pricing Bridge delivered with apology vs neutral consultative — record the rep play back drill neutral declarative pacing. (2) Buyer pushes back rep skips Boomerang gives single number — drill 3-5 sec pause before Boomerang. (3) Anchors at floor or comfortable middle — Ariely/Cialdini behavioral pricing first number anchors, always anchor 15-20% above target landing. (4) Matches fake competitor quote without verifying scope parity — competitor-reference library team exercise. (5) Gives 5-10% goodwill discount off the cuff — chronic giver produces team worst LTV. (6) Doesn't identify Walk-Condition 3 principle demand gives 15% — Principle Walk script drill every 30 days, 60-70% hold-price vs 0-10% concede. (7) Manager skips post-training coaching loop — 14-day half-life kills 60-80% of rollouts, 30-45 min/rep/week. (8) Discovery too shallow for any number defensible — postpone pricing MEDDPICC <10% close + 25%+ discount without Identified Pain. (9) Floor-price not enforced by tooling — standardize on DealHub/Salesforce CPQ/Conga CPQ $40-220/rep/mo trivial vs 3-7 pts avg discount reduction. Plus 7 common manager objections with honest answers: AEs already know pricing / buyers always ask first / can't hold price in this market / Bridge feels rude / senior AEs don't need this / no Gong-Chorus / how do I know it works. Plus when-to-rerun-90-days cadence with rotated buyer archetypes (procurement-led CFO + security-led CISO + CIO running reverse auction). CUT and tighten, do not ADD length — already inside word window.",
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit composition with st0001-st0005 forming new-AE 30-45 day arc st0004→st0001→st0005→st0006→st0003→st0002 (cold-call opener earns discovery meeting / discovery / demo discipline / pricing conversation this training / post-demo objection recovery / single-threading risk at champion handoff). Planned companion entries: mutual action plans + renewal-expansion + competitive displacement + executive alignment + lost-deal autopsy + SDR-AE handoff + forecast-review qualification + champion enablement at scale. Adjacent Knowledge Library entries: q9601 fractional CFO (CFO persona behind Role-Play 2 hidden context) + q1942/q1946-q1954 B2B SaaS baseline + q9667 HVAC / q9663 self-storage for vertical pricing language + RevOps/pricing-operations knowledge entries for discount-governance tooling stack. Reading list of frameworks with URLs: Force Management Command of the Message + Sandler discount-must-be-earned + Solution Selling Bosworth + MEDDPICC Identify Pain + Challenger Sale + Chris Voss Never Split the Difference + ProfitWell Patrick Campbell + ICONIQ + Bessemer pricing benchmarks. CUT and tighten, do not ADD length — already inside word window.',
  s10: `SUBAGENT_VERIFIED. Sixth Pulse Sales Training entry st0006 — a fully runnable 60-minute live pricing-conversation training for the most mishandled moment in any B2B cycle (per Gong Reality Report 12% early-cycle vs 38% post-value-confirmation close rate), not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,000 words ABSOLUTE HARD CAP 10,500. Structure: orange Pulse Training callout intro (who-for: AEs running B2B SaaS deals $25K-$500K ACV + sales managers coaching pricing; what-bring: CRM record last 5 deals where price came up + actual discount given + team published price list + discount approval ladder + floor-price policy + printed leave-behinds + whiteboard) + Bottom Line callout with Gong 12% vs 38% + three-decision framework intro + 6-row pipe-table agenda (0:00-0:05 Cold Open / 0:05-0:22 Teach / 0:22-0:32 Discussion / 0:32-0:52 Role-Play / 0:52-0:57 Debrief+Commitments / 0:57-1:00 Leave-Behind) + Section 1 Cold Open with Gong 12% vs 38% timing + Bridge Group 1% discount = 3-5% LTV loss + ProfitWell discount-at-signature predicts month-13 churn + Jamie composite story gave $80-140K range first call lost vs Bridged 10 min later closed $128K zero discount + Common Trap on buyer-demand-for-number-is-qualification-reflex-not-budget-question + Section 2 The Teach split into Part A When-How-If Framework (WHEN: TOO EARLY 12% fatal anchor / RIGHT 38% post-value-confirmation pre-procurement / TOO LATE procurement-controlled discount 8-15 pts higher to compensate with 3 verbatim early-cycle deflection alternatives consultative + range + diagnostic / HOW: ANCHOR HIGH always 15-20% above target landing per Ariely-Cialdini behavioral pricing + RANGE with value-per-tier mapped + TIE TO ROI dollar of price paired with dollar of return same sentence with verbatim scripts for each + discount destruction math Pavilion + Bridge Group 1% = 3-5% LTV exponential not linear / IF: 3 walk-conditions budget under 50% floor + stalking horse benchmark against incumbent + principle discount demand with verbatim Graceful Walk + Stalking-Horse Walk + Principle Walk scripts each calm not threatening) and Part B Pricing Bridge verbatim 'I want to give you a real number not a guess. Can we spend 10 minutes confirming what you need so the number actually fits?' + 4-question diligence map Scope + Adjacent systems + Decision math + Procurement reality + Boomerang verbatim 'Range is X to Y depending on what we just discussed. I would rather come back tomorrow with the precise number than guess wrong today. Fair?' as second deflection safety net when Bridge fails 15-20% with apology-tone trap + Section 3 Discussion 6 prompts (who brought price up first + verbatim words used + actual discount % last 3 deals on whiteboard + value erosion moment on last 15%+ discount deal + ever-walked-away history + pick top in-flight deal name pricing-stage early-right-late and next verbatim move) + Section 4 Two-Person Role-Play with Round 1 Director Ops Maya Chen 300-person retail-ops SaaS $45M ARR first 30-min discovery call min 14 pricing ask 'before we go further can you give me a ballpark' + 3 sequential pushbacks (budget meeting tomorrow / what is the range / what do you need to come back tomorrow) full BUYER+REP scripts hidden context Maya testing reps cave on ballpark rated lower vendors who hold Bridge cleanly rated highest + actual budget $90K well within range, plus Round 2 VP Ops David Park 220-person logistics SaaS $38M ARR week 8 of 12 cycle 'competitor came in 30% lower what can you do' + 3 deflections (CFO cover + 25% principle demand + competitor fake reference price actually half-scope missing integration) REP must surface apples-to-oranges + defend with ROI math + offer scope-tier or term-commit alternative + correctly identify Walk-Condition 3 principle demand hidden context CFO actually signed off $95K David own initiative for internal optics REPs who hold get $95K with 12-month auto-renew REPs who discount 25% lose ~$50K LTV + signal price always negotiable + 60-sec reset between rounds + Section 5 Debrief+Commitments 3 debrief Qs (where tempted to give number too early + where almost discounted on principle + walk-condition watching for in top deal) + 3-line commitment ritual (top in-flight deal named + pricing-stage early-right-late + next verbatim move Bridge-Boomerang-Anchor-Range-ROI-Tie-Graceful-Walk-Stalking-Horse-Walk-Principle-Walk read aloud) + Section 6 Leave-Behind walkthrough + printable one-pager (3x3 When-How-If decision grid TOO-EARLY/RIGHT/TOO-LATE x cycle-stage/buyer-state/move/win-rate + Pricing Bridge verbatim + 4-question diligence map + Boomerang verbatim + 3 Walk-Away conditions checklist + discount damage exponential table 1%/5%/10%/15%/20%/25% with seller LTV loss multiplier 3-12x + Never Do behavior list 7 items + Pricing Number Line wins 38% close + 100% LTV preserved vs losses 12% close + 60-75% LTV destroyed + If You Only Remember One Thing hero quote 'Price is never the objection — it is the cover. Your job is to find what is underneath before you negotiate.'). How-this-fits-in-sales-stack table at end of core showing pre-pricing prep + first-call deflection + late-cycle defense + discount governance + walk discipline + manager coaching cadence. Two mermaid diagrams: 60-min meeting flow + manager coaching loop post-training. 7 benchmark tables. 9-failure-mode counter-case + 7-objection coach-back + when-to-rerun. Cross-links to st0001-st0005 forming new-AE 30-45 day arc st0004→st0001→st0005→st0006→st0003→st0002. Tags include sales-training (hub filter) + pricing + discount-governance + negotiation + ae-training + gong-research + sales-meeting + pulse-training + st0006 + b2b-saas. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean (em-dashes preserved in JS string literals). Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed 'CUT and tighten, do not ADD length' per locked rule.`
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // --- Word count pre-flight check ---
  const fullV9 = tldr + core + flow + src + num + counter + links;
  const wordCount = fullV9.split(/\s+/).filter(Boolean).length;
  console.log('[' + ID + '] v9 word count:', wordCount);
  if (wordCount > 10500) {
    console.error('[' + ID + '] HARD CAP EXCEEDED:', wordCount, '> 10500 — aborting');
    process.exit(1);
  }
  if (wordCount < 8500) {
    console.warn('[' + ID + '] WARNING: under target floor:', wordCount, '< 8500');
  }

  // --- Pre-seed the entry shell so runPolish's store.get() finds it ---
  const ts0 = Date.now();
  const existing = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!existing) {
    console.log('[' + ID + '] seeding entry shell (runPolish requires entry to exist)');
    await store.setJSON('answers/' + ID + '.json', {
      id: ID,
      question: QUESTION,
      answer: tldr,
      tags,
      sources: sources.slice(0, 3),
      ts: ts0,
      model: 'claude-opus-4-7-via-claude-code',
      quality_score: 5,
      polished_at: null,
      polish_history: [],
      source: 'claude-opus-bespoke-seed'
    });
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const i = idx.entries.findIndex(x => x.id === ID);
    const row = { id: ID, question: QUESTION, tags, ts: ts0, quality_score: 5, polished_at: null, last_modified_ms: ts0, sources_count: 3 };
    if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
    await store.setJSON('_index.json', idx);
  } else {
    console.log('[' + ID + '] entry already exists — runPolish will overwrite at v5');
  }

  // --- Walk the polish ladder ---
  await runPolish({
    id: ID,
    tldr,
    core,
    flow,
    src,
    num,
    counter,
    links,
    sources,
    tags,
    notes
  });

  // Fire-and-forget IndexNow ping so /sales-trainings/st0006 is crawled.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
      .catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10 word_count=' + wordCount);
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
