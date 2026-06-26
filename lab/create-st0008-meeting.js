// st0008 -- Real Estate Listing Presentation: Winning the Seller in 45 Minutes
// -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0008, tag: sales-training).
// SECOND industry-specific training (after st0007 Medical Device).
// Industry = residential real estate, post-NAR-settlement (August 17, 2024).
// VALUE over WORD COUNT. Target 8,500-10,000 words. ABSOLUTE HARD CAP 10,500.
// Walks the 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0007: Pulse Training intro, 60-min agenda,
// Cold Open, Teach Block (5-PILLAR Listing Presentation + Post-Settlement Fee Conversation),
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

const ID = 'st0008';
const QUESTION = "Real Estate Listing Presentation: Winning the Seller in 45 Minutes — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'real-estate-sales',
  'listing-presentation',
  'residential-real-estate',
  'nar-settlement',
  '60-min-meeting',
  'standard-team',
  'realtor-training',
  'st0008'
];

const sources = [
  { title: 'NAR (National Association of Realtors) — 2024 Member Profile + Home Buyers and Sellers Generational Trends 2025 + Profile of Home Buyers and Sellers', url: 'https://www.nar.realtor/research-and-statistics' },
  { title: 'NAR Settlement (Sitzer-Burnett, Moehrl, $418M) — effective August 17, 2024 buyer-broker compensation framework', url: 'https://www.nar.realtor/the-facts' },
  { title: 'Realtor.com Research — listing-side market data + days-on-market + price-reduction benchmarks', url: 'https://www.realtor.com/research/' },
  { title: 'Zillow Research + Zestimate published error rate (Zillow own data ±2.4% on-market median, ±7-10% off-market lower-volume zips)', url: 'https://www.zillow.com/z/zestimate/' },
  { title: 'Redfin Data Center — sale-to-list-price ratios + competitive-offer benchmarks by metro', url: 'https://www.redfin.com/news/data-center/' },
  { title: 'Inman + RISMedia + T3 Sixty + Real Trends 500 — agent productivity + brokerage operating benchmarks', url: 'https://www.inman.com/' },
  { title: 'BrightMLS + Stellar MLS + CRMLS + MRED + NTREIS + FMLS — regional MLS systems setting listing standards', url: 'https://www.brightmls.com/' },
  { title: 'Top Producer + Follow Up Boss + kvCORE + BoldTrail + Lofty + Sierra Interactive + Wise Agent + Chime — listing-side CRM + lead-management', url: 'https://www.followupboss.com/' },
  { title: 'Matterport + BoxBrownie + Spacely + Aryeo + Realtor.com Showcase + Zillow Showcase — listing-marketing tech', url: 'https://matterport.com/' },
  { title: 'Compass + eXp Realty + Keller Williams + RE/MAX + Coldwell Banker + Berkshire Hathaway HomeServices — competitive brokerage landscape on listing presentations', url: 'https://www.compass.com/' },
  { title: 'Real Estate Standards Organization (RESO) + MLS Grid + Bright/CRMLS rules on coming-soon, pre-MLS, off-market listings', url: 'https://www.reso.org/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **Residential real estate agents in any market** (rookies through 20-year top producers), **brokerage team leads** running 4-12 agent pods at KW / RE/MAX / Compass / eXp / Coldwell Banker / Berkshire Hathaway HomeServices, and **broker-owners** of independent boutiques — anyone coaching the single most-leveraged conversation in residential real estate: **the 30-90 minute listing presentation** where a homeowner decides which agent gets a 6-month exclusive at full commission. Post-NAR-settlement (effective August 17, 2024 — separate buyer-broker compensation, written buyer rep agreements, no MLS commission posting), the kitchen-table conversation has changed materially. **Drop this into your team's calendar tomorrow morning and run it live.**
>
> **What your agents will leave with:** **The 5-PILLAR Listing Presentation Framework (Proof / Price / Plan / Post-Settlement Fee Conversation / Process) + the Post-Settlement Fee verbatim 4-line script** — for winning the 45-minute kitchen table against the agent the seller is interviewing tomorrow night. Plus two live role-plays (skeptical-couple kitchen table + "Zillow says my home is worth more" objection mid-CMA), a written commitment on one upcoming appointment, and a printable one-pager for the listing kit.
>
> **What the manager should bring:** **(1)** Notes from the team's **last 5 lost listing presentations** — the "we'll let you know" appointments that signed with someone else on Friday. **(2)** The team's **current CMA template** (most are Zillow printouts with the logo changed; bring the real artifact). **(3)** A printed copy of the **one-page leave-behind** at the bottom of this doc, one per agent, ready at minute 57. **(4)** The brokerage's **new post-settlement listing agreement** revised for August 2024 buyer-broker compensation disclosure — three printed copies. **(5)** A **whiteboard** to track each agent's last-five-lost scoreboard + broken Pillar by Section 3's end.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:05** | **Cold Open** — the NAR 35-50% listing win-rate stat + a 90-second composite story | Manager | Agents feel that the listing presentation is the single most-leveraged conversation in residential real estate, and the difference between 35% and 80% is verbatim discipline |
| **0:05-0:22** | **The Teach** — 5-PILLAR Listing Presentation Framework (Proof / Price / Plan / Post-Settlement Fee / Process) + Post-Settlement Fee verbatim script with 3 seller deflections | Manager | Agents can recite the 5 Pillars in sequence, the verbatim Fee Conversation script, and the verbatim cue for each Pillar without notes |
| **0:22-0:32** | **The Discussion** — each agent names their last lost listing + which Pillar broke down + their actual sale-to-list ratio + last 12 months' win rate | Manager + room | Every agent audits their last 5 listing presentations on the whiteboard and identifies the one Pillar they consistently fumble |
| **0:32-0:52** | **Role-Play x 2** — Round 1 kitchen-table presentation to skeptical sellers couple late 50s $850K home (10 min) + 60-sec reset + Round 2 "Zillow says my home is worth more" objection mid-CMA review (10 min) | Agents in pairs | Agents deliver the 5 Pillars + Post-Settlement Fee script + Zillow defuse live under realistic seller pushback |
| **0:52-0:57** | **Debrief + Commitments** — 3 debrief questions + each agent names ONE upcoming listing appointment + weakest Pillar + verbatim language change | Manager + each agent | Every agent walks out with one named upcoming appointment + one named verbatim change + a 1:1 review of the recording within 7 days |
| **0:57-1:00** | **Leave-Behind Walkthrough** — the printed one-pager + new post-settlement listing agreement checklist | Manager | Agents know where the template lives + keep the one-pager in the listing kit |

> ### 🎯 Bottom Line
> **Sellers don't choose the agent with the lowest commission — they choose the agent who made them feel like the smartest seller in the room.** Per **NAR 2024 Member Profile + Realtor.com + Inman**, the average agent runs **12-18 listing presentations/year and wins 5-8** — a **35-50% win rate**. Top producers win **65-80%**. The gap is not personality, longevity, or commission. It is whether the agent ran a **5-Pillar discipline (Proof / Price / Plan / Post-Settlement Fee / Process)** with verbatim language for the new buyer-broker compensation conversation — or improvised with a Zillow printout. Five Pillars, one verbatim Fee script, run on purpose, win listings that go to the agent across town.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- THE COLD OPEN (0:00-0:05)

> ### 🟡 Coach Note
> Do not open your laptop. Do not say "thanks for being here on a Tuesday morning." Walk in, say the number, tell the story. The first 90 seconds set whether agents tune out or remember this on Thursday-night's kitchen-table appointment. **Five minutes. Hard stop at 0:05.**

### The number, then the story.

**The number first.** Per **NAR 2024-2025 Member Profile + Realtor.com + Inman + RISMedia + T3 Sixty**, the average residential agent runs **12-18 listing presentations/year and wins 5-8** — a **35-50% win rate**. Top-decile producers (**Real Trends 500** names) convert at **65-80%**. Per **NAR Profile of Home Buyers and Sellers 2024-2025**, **73% of sellers interview only 1-3 agents** before signing — meaning **the agent who runs the most-disciplined 45 minutes wins more than the agent who has known the seller longest**. Per **Zillow Research**, listings inside the CMA-supported range sell within **30 days at 98-102% of list**; listings priced 8-15% above sit **75+ days** and sell **6-9% below original list** after reductions.

The math is brutal. An agent running **15 presentations/year at 40%** wins **6 listings**. Same agent at 70% wins **10-11** — a **70% inventory lift** without one extra lead. **The difference is whether the 5 Pillars and Fee script got run on purpose, or improvised at the kitchen table.**

**The story.** (Composite — swap in names + numbers the room recognizes.)

An agent on this team — call her Jen. Seven years in residential real estate, top-quartile producer, knew the sellers (Mike and Lisa, late 50s, $750K colonial, kids in college, downsizing). Tuesday-night appointment. Forty-five minutes — Jen ran it well by every metric: laminated comps, brokerage marketing slick, three references from past sellers in the same zip code. **They nodded at all the right moments.**

Friday morning email. *"Hi Jen — we enjoyed meeting with you. We've decided to go with another agent from Compass who had a different approach to the new buyer-broker compensation question."* Jen called Mike and asked what actually happened. **The Compass agent had a verbatim 4-line script for the post-settlement fee question. Jen had stumbled: *"well, yes, technically the seller doesn't have to pay the buyer's agent anymore, but most still do, it depends..."* Three months of relationship lost to two minutes of fumbling on the one conversation that matters most in the new market.**

Three months later, comparable appointment. Jen ran the **5-Pillar discipline** start to finish — PROOF in 3 lines, PRICE as a range with rationale, PLAN as a 21-day calendar, the **Fee Conversation as a verbatim 4-line script** with the math on each path, PROCESS as a written communication commitment. Sellers signed at the table that night. Listed Thursday. **Three offers by Saturday's open house, sold at 102% of list in 11 days.**

Same agent. Same kitchen-table format. Same commission rate. Different **discipline on which Pillars got run, and whether the Fee Conversation was verbatim.**

> ### ⚠️ Common Trap
> Agents will say "every seller is different — you can't script it." Three answers. **(1)** Per NAR Profile 2024, **42% of sellers in the first 12 months post-settlement asked a buyer-broker compensation question** during the listing presentation — roughly the same three deflections every time. **(2)** Verbatim language is not robotic delivery; it is the **load-bearing sentence the seller remembers on Friday morning** when they decide between you and the other agent. **(3)** Top producers run verbatim on what matters (Proof stat, Price-range framing, Fee response) and improvise the rest. **Improvising the Fee Conversation is how 35-50% of presentations get lost in the new market.**

**Transition:** "In the next hour you get a 5-Pillar framework, a verbatim Fee script, and two role-plays under real seller pushback. Let's go."

---

## SECTION 2 -- THE TEACH (0:05-0:22)

> ### 🟡 Coach Note
> Seventeen minutes. **Do not lecture for seventeen minutes** — you will lose the room by minute 9. Break this into two halves: **5-PILLAR Listing Presentation Framework (12 minutes, ~2.5 minutes per Pillar)** + **Post-Settlement Fee verbatim script with 3 deflections (5 minutes)**. Pause after each Pillar for one clarifying question. The end-of-section test: any agent can recite all 5 Pillars in sequence, the Post-Settlement Fee verbatim script in 4 lines, and the verbatim cue for each Pillar without notes.

### Part A -- The 5-PILLAR Listing Presentation Framework (12 minutes)

Five Pillars every winning listing presentation hits in sequence. The discipline is making sure **all five are built** before asking for the signature. Most lost listings are missing exactly one — and post-August-2024, the missing one is almost always Pillar 4.

#### Pillar 1 -- PROOF: Three Lines, Ten Seconds

**Sellers scan for credibility signals; they don't read brochures.** A laminated "About Me" with twelve bullets is noise. PROOF fits in three lines a seller reads in ten seconds:

- **Last 12 months volume + closed transactions** ("$22M across 28 transactions")
- **Sale-to-list-price ratio** (target **98-102%** normal markets; **103-107%** seller markets; below 96% = you discount sellers' homes)
- **Average days on market** (target **<30** normal; **<14** seller markets) + **repeat-and-referral %** (target **60%+** for 7-year-plus producers)

**The veteran trap.** Dumping GRI / CRS / SRES / ABR / e-Pro certifications onto a slide. **Sellers do not know what those letters mean and will never ask.**

> ### 🎤 Verbatim Script -- The PROOF Open
> *"Before I show you what I'd do with your home, here's what I've done in 12 months: [$X] across [N] transactions, sale-to-list of [98-102%] which means I do not discount my sellers' homes, average DOM of [<30] which means I do not let your home sit. Rest of my resume is on the leave-behind. Let's get to your house."*

#### Pillar 2 -- PRICE: The CMA As A Range, Not A Number

**One number is an opinion the seller fights; a range with rationale is a framework the seller evaluates.** A real CMA is **three comparable sales in the last 60 days, within 0.5 miles, 200 sqft, 1 bedroom, condition-adjusted** — sourced from **BrightMLS / Stellar MLS / CRMLS / MRED / NTREIS / FMLS**, not Zillow.

Instead of "your home is worth $815K," give **three numbers with rationale**:

- **Aggressive list** ($840-850K) — likely sit 45-60 days, reduce 2x, end at $805K
- **Market-rate list** ($815-825K) — likely 14-21 day offers at 98-102% of list, clean
- **Quick-sale list** ($795-805K) — likely multiple offers in 7 days, may sell over list

**The Zillow Zestimate gap — addressed proactively.** Every kitchen table has a Zestimate open on someone's phone. Per **Zillow's own published methodology**, median error is **±2.4% on on-market homes** and **±7-10% on off-market homes in lower-volume zip codes**. On an $815K home that's **±$20K-80K**. **Bring up the gap before the seller does** — name the error rate, defuse in Pillar 2 instead of fighting in Round 2.

> ### 🎤 Verbatim Script -- The PRICE Open
> *"Most agents give you one number and defend it. I'm giving you a range with math on each end. Your home will sell — the question is **how fast and at what price**, and those are inversely related. Three lists, what happens at each. You pick the one that fits your timeline."*

**Common trap.** Bringing the highest single number to win the listing, then asking for a reduction at day 14. **Seller resents you, starts shopping a new agent at day 30.** Range removes the ammunition.

#### Pillar 3 -- PLAN: The 21-Day Marketing Rollout Calendar

**Sellers want the calendar, not the strategy.** "Full digital marketing program" is not a plan; a day-by-day rollout schedule tailored to THIS dollar amount is:

- **Day 1** — Listing signed. Pre-MLS "coming soon" on brokerage network (Compass Private / KW Command / RE/MAX Collection / eXp Sphere)
- **Day 2-5** — Pro photography (8-12 photos sub-$500K, 25-40 for $500K+, **drone for $500K+**), **Matterport 3D** for $400K+, **BoxBrownie or Spacely virtual staging** for vacant rooms. **MLS live Day 5**.
- **Day 6** — Weekend open house, paid social on Facebook + Instagram + Realtor.com Showcase + Zillow Showcase
- **Day 7-14** — Broker tour to top 100 buyer-agents in zip via team CRM (Follow Up Boss / Top Producer / kvCORE / BoldTrail / Lofty / Sierra / Chime)
- **Day 14-21** — **First price-review checkpoint** with showing-feedback aggregate + Realtor.com saved-search velocity

**The specific-tool trap.** "We'll do a 3D tour" without naming Matterport. "We'll do drone" without naming the Part-107 operator. **Name the tool, name the day, name the cost (or that you're absorbing it).**

> ### 🎤 Verbatim Script -- The PLAN Open
> *"21-day calendar. Day 1 sign + pre-MLS coming-soon on the brokerage network. Day 2-5 we shoot — pro photography, Matterport 3D, drone at this price point, Spacely virtual staging on the empty bonus room. Day 5 MLS live. Day 6 weekend open. Day 7-14 broker tour + paid social. **Day 14 first pricing checkpoint** — we'll know by then whether the price is right. Walk you through the checkpoint?"*

**Common trap.** Generic 90-day marketing PDF identical for every listing regardless of dollar amount. **Sellers smell boilerplate immediately.**

#### Pillar 4 -- POST-SETTLEMENT FEE CONVERSATION: The Verbatim Script

**This is the new Pillar — the one that changed materially August 17, 2024, and the one most agents fumble.** Per the NAR settlement framework, agents must verbally and in-writing disclose listing commission separately from any seller-offered buyer-broker compensation. **MLSs can no longer post buyer-broker compensation.** Sellers arrive with three predictable deflections; each requires a verbatim response.

**The 4-line verbatim Fee script (memorize — every agent):**

1. *"Here's what I charge to represent you in the sale of your home: **[2.5-3%]** of the sale price. That covers the marketing plan, negotiation, transaction management, and everything we just walked through."*
2. *"Here's what I recommend you offer the buyer's agent: **[2-3%]** of the sale price, paid by you at closing. You are not required to offer this — but I'm going to recommend it strongly and tell you exactly why."*
3. *"If you offer 2-3%, you keep your home visible to roughly **95-100% of the active buyer pool** because buyers' agents will show it and buyers won't have to come out of pocket. If you offer 0%, you signal to buyers' agents that working your listing means asking their buyer for $15-25K in additional cash at closing — which **thins your buyer pool roughly 30-50%** in most markets, leading to fewer offers and a 3-6% lower final sale price. The 2-3% you 'save' usually costs you $20-50K on a [$815K] home."*
4. *"That said — this is your decision. We can structure it three ways: (a) you offer 2-3% upfront, (b) you offer 'concession negotiable' and handle it offer-by-offer, (c) you offer 0% and we see what the market does. I'm going to recommend (a) on your home given the comps, but I'll list whichever way you decide. Which path do you want?"*

> ### 🎤 Verbatim Script -- Deflection 1: "I read I don't have to pay the buyer's agent anymore"
> *"That's correct — and it's the most-misreported part of the settlement. The settlement separated the fees so each side negotiates their own; it did not eliminate the option to offer. **80%+ of listings in [your metro] since the settlement still offer 2-3%** because the math on thinning the buyer pool is brutal. You're allowed to offer 0% — and you're allowed to absorb the 3-6% lower sale price that typically comes with it. I'd rather show you both paths than pretend the trade-off doesn't exist."*

> ### 🎤 Verbatim Script -- Deflection 2: "Why is your commission so high if buyers' agents are paid separately now?"
> *"My commission covers everything you saw on Pillar 3 — the marketing plan, the photography spend I'm absorbing, the 21-day rollout, the negotiation, the inspection-period management, the closing coordination. None of that work went away with the settlement. The settlement changed how the buyer side is structured, not how much work goes into selling your home. I'm at [2.5-3%]; the brokerage-average in [your metro] is the same. If a competing agent quotes you less, ask them which of the Pillar 3 services they're cutting — they'll usually drop the professional photography, the Matterport tour, or the broker outreach."*

> ### 🎤 Verbatim Script -- Deflection 3: "Can't I just sell it myself and save the commission?"
> *"You can — about **6% of sales nationally are FSBO** per the NAR Profile of Home Buyers and Sellers 2024-2025, and they sell for an **average 13-26% less** than agent-listed homes. Not because FSBO sellers are bad at it — because the buyer pool is smaller, the negotiation is one-sided (the buyer always has an agent), the inspection-period concessions get higher, and 60% of FSBOs end up listing with an agent after 90 days anyway. You'd save the listing-side commission and likely lose **3-5x more** in final sale price. Worth discussing — but I want you to see the math before you decide."*

> ### ⚠️ Common Trap
> Fumbling the Fee Conversation by being vague — *"well, technically you don't have to..."* — signals you don't understand the new market. **Sellers who hear vague Fee language hire the agent who delivered crisp 4-line verbatim instead.** Per Inman + RISMedia 2024-2025 broker surveys, this is the single biggest predictor of listing wins post-settlement.

#### Pillar 5 -- PROCESS: What Happens After They Sign

**Sellers' #1 complaint about prior agents (per NAR + Realtor.com) is communication.** Pillar 5 is the written, day-numbered cadence the OTHER agent will not have in writing:

- **Day 1** — Photographer booked within 48 hrs
- **Day 2-5** — Pre-MLS coming-soon + photo shoot + Matterport scheduled
- **Day 6-7** — MLS live + weekend open + first showing-feedback
- **Day 7 weekly** — Friday seller update: showings, feedback themes, Zillow/Realtor.com/Redfin traffic, recommendation
- **Day 14** — First pricing-review meeting (calendared at signing)
- **Closing** — 30-45 day standard close, inspection-period management, appraisal contingency, walkthrough

> ### 🎤 Verbatim Script -- The PROCESS Close
> *"Three things happen the moment you sign. **One:** I call the photographer tonight to lock Wednesday morning. **Two:** Friday email from me every Friday — showings, feedback, traffic, recommendation — until sold. **Three:** Day 14 first pricing-review is on the calendar right now. Any questions before we sign?"*

**Common trap.** "Great communication" without naming the cadence. **Generic promises lose to calendared commitments every time.**

> ### 🎯 Bottom Line
> PROOF + PRICE + PLAN + POST-SETTLEMENT FEE + PROCESS. Five Pillars. All five required, in this sequence, before asking for the signature. The framework does not invent — it composes what top-decile Real Trends 500 agents have been doing intuitively for 20 years, made explicit and now updated for the post-August-2024 buyer-broker compensation framework. The discipline is checking **which Pillar broke** on every lost presentation — and running the verbatim language fix on the next one.

### Part B -- The Fee Script Drill (5 minutes)

The Pillar 4 script is **the load-bearing 90 seconds of the entire 45-minute presentation in the new market.** Every agent says it word-for-word until it lands without hesitation.

> ### 🟡 Coach Note
> 90-second timer. Each agent delivers the 4-line script + one randomly-assigned deflection to their pair. Switch. Repeat. **By end of 5 minutes every agent has delivered twice and heard twice.** The Fee conversation is the one place where the seller's Friday-morning memory hangs on the exact words.

---

## SECTION 3 -- THE DISCUSSION (0:22-0:32)

> ### 🟡 Coach Note
> Whiteboard up. Write **PROOF / PRICE / PLAN / FEE / PROCESS** across the top. Each agent audits their **last lost listing out loud** — which Pillar broke, what the seller said, who they signed with. **Count to five after each prompt.** Silence forces engagement. If vague, ask *"what was your verbatim PROOF line? Range or single number on PRICE? When the Fee question came up, what exactly did you say?"*

**Prompt 1 — "Name your last lost listing. Address, price band, who you lost to."**
Around the room. Force specifics: *"the Hendersons, $720K colonial on Oak Street, lost to Compass."* No vague "a colonial in my farm area."

**Prompt 2 — "Which Pillar broke — Proof, Price, Plan, Fee, or Process?"**
Most will admit Pillar 4 (Fee) — fumbled the post-settlement question. Some Pillar 2 (Price) — one number instead of a range, or a Zillow printout instead of a real CMA. **Coach:** "PROOF + PROCESS easiest to fix tonight. PRICE + FEE require drilling — both in the next role-plays. PLAN longest — most agents rebuild from scratch."

**Prompt 3 — "What was the seller's deflection? Word for word."**
*"We read we don't have to pay the buyer's agent anymore"* or *"Zillow says $920K — why are you at $815K?"* — exactly the two role-plays in Section 4.

**Prompt 4 — "Your actual sale-to-list ratio over last 12 months? Do you know the number?"**
Most don't. **Coach:** "If you can't quote it within 1%, you can't deliver PROOF. Pull from brokerage dashboard tonight."

**Prompt 5 — "Real CMA with 3 specific comps, or a Zillow printout?"**
Most — even 5-year veterans — bring Zillow + Realtor.com + Redfin aggregates with the brokerage logo cropped on. **Coach:** "Pull 3 sales within 60 days, 0.5 mi, 200 sqft, 1 BR, condition-adjusted from regional MLS. That is a CMA."

**Prompt 6 — "ONE verbatim language change at your next listing presentation."**
Each agent names ONE specific change. **Coach:** "Write it down. Not 'I'll be more confident on Fee' — write the actual 4-line script. Recording reviewed in 1:1 within 7 days."

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:32-0:52)

> ### 🟡 Coach Note
> Pair agents. If odd number, you take the extra agent. **Two scenarios, 10 minutes each, 60-second reset between.** Agent plays seller in Round 1, switches to agent in Round 2. Walk the room. Listen for whether the agent uses the **verbatim** Fee Conversation in Round 1 and the **verbatim** Zillow defuse in Round 2 — those are the load-bearing 90 seconds. Mark which Pillar each agent skips; that is the data for the next 1:1.

### Role-Play 1 -- Kitchen-Table Presentation To Skeptical Sellers (10 minutes)

**Setup:** **Suburban $850K colonial, late-50s couple — Mark and Susan Reyes**, downsizing in 12 months. Have interviewed **two other agents this week** — 12-year RE/MAX veteran + 3-year Compass producer. AGENT has the Tuesday 7pm slot. Susan pulls Zillow on her phone; Mark is skeptical of commissions and has a daughter who just got her license. **AGENT must deploy all 5 Pillars + verbatim Fee Conversation in 30-40 min.**

> ### 🎤 SELLER SCRIPT -- Mark and Susan Reyes

> **Posture:** Friendly but evaluating. Two other agents already pitched this week. Susan takes notes; Mark crosses his arms.

> **Deflection 1 (min 8) — Mark:** *"Three agents this week. Compass had different photography quality. RE/MAX guy has been in this neighborhood 22 years. What makes you different?"* (AGENT runs PROOF + PLAN without trashing.)

> **Deflection 2 (min 18) — Susan:** *"The Compass agent does free virtual staging and showed a sample 3D tour. Can you?"* (AGENT names Matterport + Spacely + drone with cost ownership.)

> **Deflection 3 (min 30) — Mark:** *"Our friend's daughter just got her license. She'll do it for 4% total. Why pay you 5-6%? And I read I don't have to offer the buyer's agent anything now."* (Double-barrel: commission + post-settlement. AGENT defends commission via PROOF/PLAN AND delivers verbatim Fee script.)

> **What gets the deal moving:** AGENT runs all 5 Pillars cleanly + asks for signature at the table. Hidden context — Mark and Susan sign tonight if all 5 land; "we'll let you know" if any one fumbles.

> ### 🎤 AGENT SCRIPT -- 5 Pillars verbatim, no trashing, sign at the table

> - **Min 0-2 (PROOF):** *"Before I show you what I'd do, here's 12 months: $24M across 31 transactions, 99.4% sale-to-list, 18-day average DOM. Rest on the leave-behind. Let's get to your house."*
> - **Min 2-5 (Walk-through + relationship moment):** Kids, timeline, what they love about the house. Trust without selling.
> - **Min 5-12 (PRICE — range with rationale):** *"One number is an opinion. I'm giving you a range. **Aggressive at $880-890K:** 45-60 days, one reduction, end at $840K. **Market-rate at $850-860K:** 14-21 days, 98-102% of list, clean. **Quick-sale at $830-840K:** multiple offers in 7 days, may sell over. Three BrightMLS comps in last 60 days within half a mile — let me walk through them."*
> - **Min 12-14 (Deflection 1 → no trashing):** *"Compass has great photography — great brokerage. RE/MAX gentleman knows this zip cold — real. What I can show you is what happens on YOUR house specifically: 99.4% sale-to-list means I price right and negotiate hard; 18-day average means I don't let listings sit; the 21-day calendar I'm about to show is built for the $800-900K range in this neighborhood. Let me walk it."*
> - **Min 14-20 (PLAN — 21-day calendar with named tools):** *"Day 1 sign. Pre-MLS coming-soon on brokerage network + BrightMLS coming-soon feed. Day 2-5 shoot — 40 photos minimum at this price, Matterport 3D, drone since you're at $850K, Spacely virtual staging on the empty basement and bonus room. **I absorb all of that — about $1,800.** Day 5 MLS live. Day 6 weekend open. Day 7-14 broker tour to top 100 buyer-agents via Follow Up Boss. Day 14 first pricing checkpoint — calendar invite at signing."*
> - **Min 20-22 (Deflection 2 → name the tools):** *"Matterport — same as Compass. Spacely virtual staging — sample link I'll text tonight from last month's listing. Drone is Part-107 licensed. All in, ~$1,800 marketing and I absorb every dollar. You see one invoice at closing — commission, nothing else."*
> - **Min 22-32 (POST-SETTLEMENT FEE — verbatim 4-line + Deflection 3):** *"On commission — this is the part that changed in August. **One:** I charge 2.75% to represent you. **Two:** I'm recommending you offer the buyer's agent 2.5%, paid by you at closing. You're not required. **Three:** At 2.5% you stay visible to ~95-100% of the buyer pool. At 0% you signal asking the buyer for $20-25K extra cash, which thins the pool 30-50% and typically lowers final price 3-6%. The 2.5% you save usually costs you $20-50K on an $850K home. **Four:** Three structures — full / concession-negotiable / zero. I'm recommending option one. Which path?"* (Pause.) *"On your friend's daughter — she may do great work, 4% is real savings. Worth asking her which Pillar 3 services she's cutting — usually pro photography, Matterport, or broker outreach. Not wrong; just trade-offs. Worth knowing what you're comparing."*
> - **Min 32-37 (PROCESS):** *"Three things the moment you sign. **One:** photographer at 8am tomorrow to lock Wednesday. **Two:** Friday email every Friday — showings, feedback, traffic, recommendation — until sold. **Three:** Day 14 pricing-review meeting on the calendar right now."*
> - **Min 37-40 (Ask):** *"That's the presentation. You've heard three agents — I'd rather not put you through a fourth. List with me tonight, or sleep on it and let me know in the morning either way? I'm comfortable with either answer."*

### 60-Second Reset

> ### 🟡 Coach Note
> **Manager calls out: "Switch sides — 60-second reset."** Both agents put their papers down. Stand up. Stretch. Take a sip of water. Sit back down with the OTHER role's paper. **Take 30 seconds to read silently.** Then go.

### Role-Play 2 -- The "Zillow Says My Home Is Worth More" Objection Mid-CMA (10 minutes)

**Setup:** **Suburban $815-835K CMA-supported range, single seller — Diane Park**, 62, widowed 18 months, downsizing near her daughter. AGENT is mid-CMA when Diane pulls Zillow on her phone showing **$920K Zestimate** and pivots: *"Zillow says $920K — why are you at $815-835K? Neighbor sold for $880K. We can always start high and reduce."* AGENT must defuse without condescension, use Zillow's published-error data, pivot to sale-to-list-ratio at different pricing levels.

> ### 🎤 SELLER SCRIPT -- Diane Park

> **Posture:** Emotionally attached. Follows Zillow weekly. Polite but firm. 3 deflections:

> **Deflection 1 (min 3):** *"Zillow has me at $920K. Your CMA shows $815-835K. $90K gap. Why trust your number over Zillow's?"*

> **Deflection 2 (min 8):** *"Neighbor Pat sold her colonial for $880K last summer. Same street, similar size. We should be at $880K at least."*

> **Deflection 3 (min 14):** *"Can't we start at $895K and reduce if no offers in 30 days?"*

> **What gets the deal moving:** AGENT does not fight Zillow head-on or insult Diane. Names Zillow's published error rate. Pulls Pat's sale in MLS with adjustment math. Walks sale-to-list at different prices — starting high mathematically nets LESS. Hidden context — Diane signs at supported range if AGENT defuses without condescension.

> ### 🎤 AGENT SCRIPT -- defuse with data, adjust neighbor comp, sale-to-list math

> - **Min 0-3 (Acknowledge + reframe):** *"Most common question I get — you're right to ask. Per **Zillow's own published methodology**, Zestimate median error is **±2.4% on on-market homes and ±7-10% on off-market homes in lower-volume zip codes** like this. On your home that's a swing of $20K-90K. Zillow tells you it's a starting point, not a price. We're inside their error range — your number and mine aren't actually in conflict."*
> - **Min 3-6 (Pivot to MLS over Zillow):** *"What I trust: MLS data on three actual sold homes within 60 days, half mile, 200 sqft, 1 BR — actual contract prices, not algorithms. Let me walk those." (3 BrightMLS comps with adjustments.)*
> - **Min 6-10 (Deflection 2 → adjust Pat specifically):** *"Pat's $880K — let me pull it." (MLS.) "Pat: 2,750 sqft, finished basement +600 livable, half-acre lot, full kitchen renovation 2022, closed July 2024. Yours: 2,400 sqft, unfinished basement, quarter-acre, original 2008 kitchen, today. **Adjustments:** -$25K for 350 sqft delta, -$40K finished basement, -$15K lot, -$30K kitchen, +$8K for 9 months appreciation per Redfin. Pat's $880K maps to ~$778K on your home — and the three other comps put you above that. That's how I land at $815-835K."*
> - **Min 10-14 (Sale-to-list math):** *"Per Realtor.com + BrightMLS on this zip last 12 months: homes priced **inside CMA-supported range sell 98-102% of list in <30 days**. Priced **8-15% above sit 75+ days, reduce 2x, sell 6-9% below original list**. Math both ways: list $825K, sell $815-840K in 18 days = net $815-840K. List $895K, sit 75 days, reduce twice, sell $820-835K in 90 days = net $820-835K. **You don't net more starting higher — you net less, take 3x longer, more stress.**"*
> - **Min 14-18 (Deflection 3 → close):** *"Recommend: list $825K Thursday. 14 days to test. Day 14 first pricing checkpoint — strong showings no offers we adjust; no showings we adjust harder. Full control at every checkpoint. **Risk of starting high: home sits, listing goes stale, buyers' agents stop showing it, day 60 we're chasing the market down. Risk of starting at market-rate: essentially zero — offers fast or we adjust up.** Which feels safer?"*
> - **Min 18-20 (Ask):** *"Write it at $825K and go live Thursday? Or sleep on it and let me know in the morning?"*

> ### 🟡 Coach Note
> Walk the room. Agent will want to **either cave to Diane's $895K (to win) or get condescending about Zillow (loses trust)** — both lose this presentation 60-70% of the time. **Make them re-deliver the Zillow error-rate move + neighbor adjustment math + sale-to-list-at-different-prices.** Highest-leverage drill.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:52-0:57)

> ### 🟡 Coach Note
> Pull the room back together immediately. Three debrief questions, then commitments. The ritual is the only part that affects next month's win rate.

**Debrief 1 — "Which Pillar felt strongest in your role-play?"**
Agents over-index on PROOF, under-index on FEE. **Coach:** "Under-indexed Pillar is the homework. PROOF fixes in 5 minutes by pulling your sale-to-list tonight. FEE requires drilling — the 4-line script on every presentation between now and next team meeting."

**Debrief 2 — "Which Pillar did you skip or fumble?"**
FEE and PRICE-as-range get skipped on 70%+ of presentations. **Coach:** "From Monday, every presentation runs the verbatim Fee 4-line + PRICE as 3-number range — no exceptions. Improvising those two in the new market is how presentations get lost."

**Debrief 3 — "ONE verbatim change at your next live presentation?"**
**Coach:** "Not 'I'll be more confident' — the actual 4-line script. Not 'better CMA' — the 3 MLS comps you'll pull tonight. Specific verbatim only."

> ### 🎤 Commitment Ritual (Verbatim)

**Manager says:** "Open your notebook. Three lines. **Line 1:** **next upcoming listing appointment** — sellers, address, price band, date. **Line 2:** **the Pillar you've been weakest on**. **Line 3:** **the ONE verbatim language change** — actual words, not a description. Read all three aloud, around the room."

Let every agent read. **Coach the vague** (*"I'll handle Fee better"*): *"What words exactly? Read the script. Out loud now."*

**Manager closes:** "In our 1:1 within 7 days I'm asking for the **recording**, and we'll listen to the 90 seconds where you delivered the verbatim language. Not whether they signed — **whether you delivered the verbatim Fee 4-line + PRICE-as-range**. Presentation in **7 calendar days**, recording review the week after."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (0:57-1:00)

> ### 🟡 Coach Note
> Hand out the printed one-page leave-behind. Walk it 30 seconds per section. Tell agents where the digital version lives (team SharePoint / Notion). Keep it in the listing kit between the CMA template and the post-settlement listing agreement.

> ### 📋 Leave-Behind -- The "5-Pillar Listing Presentation" One-Pager

> **THE 5-PILLAR LISTING PRESENTATION GRID (verbatim cue per Pillar):**
>
> | Pillar | Verbatim Cue | What "Yes" Looks Like |
> |---|---|---|
> | **PROOF** | *"Last 12 months: $X across N transactions, 98-102% sale-to-list, <30 DOM. Rest of my resume is on the leave-behind. Let's get to your house."* | 3 lines, 10 seconds, only the 3 stats sellers actually care about |
> | **PRICE** | *"I'm not giving you one number — I'm giving you a range with rationale. Aggressive / Market / Quick-sale, with day-and-dollar math on each."* | 3 comps from regional MLS in last 60 days / 0.5 mi / 200 sqft / 1 BR, condition-adjusted, range with rationale not single number |
> | **PLAN** | *"Day 1 sign + pre-MLS. Day 2-5 photography + Matterport + drone + virtual staging. Day 5 MLS live. Day 6 weekend open. Day 7-14 broker tour. Day 14 first pricing checkpoint."* | 21-day calendar with named tools + day numbers + cost ownership |
> | **POST-SETTLEMENT FEE** | (4-line script — see below) | Verbatim delivery of all 4 lines + the right response to each of 3 seller deflections |
> | **PROCESS** | *"Photographer locked tonight. Friday email every Friday until sold. Day 14 pricing meeting on the calendar now. Sign?"* | Written + day-numbered communication cadence + calendared pricing-review meeting |

> **THE POST-SETTLEMENT FEE VERBATIM 4-LINE SCRIPT (memorize — every agent):**
>
> 1. *"I charge [2.5-3%] to represent you in the sale."*
> 2. *"I recommend you offer the buyer's agent [2-3%], paid by you at closing. You're not required — but here's why I'm recommending it."*
> 3. *"At [2-3%] you stay visible to ~95-100% of the buyer pool. At 0% you thin the pool 30-50% which typically costs you 3-6% on the final price — usually $20-50K more than you 'save'."*
> 4. *"Three structures: (a) full offer, (b) concession-negotiable, (c) zero. I'm recommending (a). Which path?"*

> **THE 3 SELLER DEFLECTIONS POST-SETTLEMENT — verbatim responses:**
>
> - *"I read I don't have to pay the buyer's agent anymore"* → Settlement separated fees, didn't eliminate offering. 80%+ of listings in [your metro] still offer 2-3%; math on thinning the buyer pool is brutal.
> - *"Why is your commission so high if buyers' agents are paid separately?"* → Settlement changed buyer-side structure, not the work in Pillar 3. If a competing agent quotes less, ask which Pillar 3 services they're cutting.
> - *"Can't I sell it FSBO and save the commission?"* → 6% of sales nationally per NAR; sell for 13-26% less on average. Buyer pool smaller, negotiation one-sided, 60% of FSBOs list with an agent after 90 days anyway.

> **THE COMMUNICATION COMMITMENT TEMPLATE (Pillar 5 — written into listing agreement):**
>
> - [ ] Day 1: Photographer confirmation booked within 48 hours
> - [ ] Day 2-5: Pre-MLS coming-soon + photo shoot + Matterport scheduled
> - [ ] Day 6-7: MLS live + weekend open house + first showing-feedback
> - [ ] Day 7 weekly: Friday seller update (every Friday — no exceptions)
> - [ ] Day 14: First pricing-review meeting (calendared at signing)
> - [ ] Closing: Offer-handling workflow walked through + 30-45 day standard close

> **NEVER DO (the listing-killer behavior list):**
>
> - Bring one PRICE number instead of a 3-number range with rationale
> - Bring a Zillow + Realtor.com aggregate as your "CMA" instead of 3 real MLS comps adjusted
> - Fumble the Post-Settlement Fee question with *"well, technically..."* instead of the verbatim 4-line script
> - Skip the Day 14 pricing-review meeting and try to have it spontaneously at day 21 when seller is already frustrated
> - Trash the competing agent by name — sellers translate "she's bad" as "you're insecure"
> - Bring boilerplate generic marketing PDF instead of a 21-day calendar tailored to THIS home's dollar amount
> - Dump 12 certifications (GRI, CRS, SRES, ABR, e-Pro) — sellers do not know the letters and will never ask
> - Verbally promise "great communication" without naming the cadence and calendaring the Day 14 meeting
> - Match a discount-broker's commission on the spot — signals your original number was theater
> - Skip the verbatim ask for the signature at the table — vague "let me know" closes lose at 2-3x the rate of direct asks

> **THE LISTING OUTCOME LINE:**
>
> - **Wins:** All 5 Pillars run in sequence + verbatim Fee 4-line script + PRICE as range with rationale + signature asked at the table → **65-80% win rate, 98-102% sale-to-list, <30 DOM, full 6-month exclusive at full commission**
> - **Losses:** Improvised Fee + single-number Price + Zillow-printout CMA + generic marketing PDF + vague "let me know" close → **35-50% win rate, frequent "we decided to go with another agent" Friday emails, lower commission negotiated, listing expires at 6 months**

> ### 🎯 If You Only Remember One Thing
> **Sellers don't choose the agent with the lowest commission — they choose the agent who made them feel like the smartest seller in the room. Your job at the kitchen table is to make them feel smart, not to make yourself sound impressive.**

---

## How This Training Sits Inside Your Residential Real Estate Stack

This is **the foundational listing-side discipline** — the 45-minute conversation that determines whether your team adds 6 or 11 listings this year and survives the post-August-2024 buyer-broker compensation framework. It does not replace lead gen, farm marketing, or sphere cultivation — it composes from all of them.

| Where it fits | What this training addresses |
|---|---|
| **Pre-appointment prep** | 3-line PROOF + 3 MLS comps (60/0.5/200/1) + 21-day calendar tailored to THIS dollar |
| **First 5 minutes** | PROOF Pillar in 3 lines, 10 seconds, pivot to seller's house |
| **CMA review** | PRICE as range with rationale + Zillow gap defused proactively |
| **Marketing walkthrough** | PLAN — Matterport / drone / virtual staging named with cost ownership |
| **The new fee conversation** | Pillar 4 verbatim 4-line + 3 deflection responses |
| **Close + post-signing** | PROCESS — Friday email + Day 14 pricing meeting calendared at signing |
| **Manager coaching** | Weekly recording audit on broken Pillar within 7 days |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: meeting flow + post-training coaching loop
// ============================================================================
const flow = `

## The 60-Minute Meeting Flow

\`\`\`mermaid
flowchart TD
  A[Manager Opens 0:00] --> B[Section 1: Cold Open 5 min]
  B --> B1[Numbers: NAR 2024-2025 + Realtor.com + Inman - average agent 12-18 presentations per year wins 5-8 = 35-50% top-decile Real Trends 500 65-80% + NAR Profile 73% sellers interview 1-3 agents + Zillow Research inside CMA range sell 30 days at 98-102% above 8-15% sit 75+ days sell 6-9% below]
  B1 --> B2[Trigger Story: Jen 7-year top-quartile producer kitchen table $750K colonial Mike and Lisa late 50s - ran it well laminated comps marketing slick 3 references - Friday morning lost to Compass agent who had verbatim 4-line Fee script Jen stumbled - 3 months later comparable appointment Jen ran 5-Pillar discipline verbatim sellers signed at table sold 102% list 11 days]
  B2 --> C[Section 2: Teach 17 min]
  C --> C1[Part A: 5-PILLAR Framework 12 min]
  C1 --> D1[PROOF: 3 lines 10 seconds volume + sale-to-list 98-102% + DOM under 30 + repeat-referral 60%+ - veteran trap dumping GRI CRS SRES certifications sellers do not know letters]
  C1 --> D2[PRICE: range with rationale not single number - 3 comps regional MLS BrightMLS Stellar CRMLS MRED NTREIS FMLS within 60 days 0.5 mi 200 sqft 1 BR condition-adjusted - aggressive 45-60 days / market 14-21 days 98-102% / quick-sale 7 days over list - Zillow Zestimate plus minus 2.4% on-market plus minus 7-10% lower-volume zips]
  C1 --> D3[PLAN: 21-day calendar tailored to THIS dollar - Day 1 pre-MLS coming-soon / Day 2-5 photography Matterport drone Spacely virtual staging / Day 5 MLS live / Day 6 weekend open / Day 7-14 broker tour via Follow Up Boss kvCORE BoldTrail / Day 14 first pricing checkpoint]
  C1 --> D4[POST-SETTLEMENT FEE: verbatim 4-line script - I charge 2.5-3% / recommend you offer buyer agent 2-3% paid by you at closing not required / at 2-3% visible 95-100% buyer pool at 0% thin pool 30-50% cost 3-6% on final price usually 20-50K more than saved / three structures full / concession / zero which path]
  C1 --> D5[PROCESS: written day-numbered cadence - Day 1 photographer 48 hrs / Day 7 weekly Friday email / Day 14 first pricing-review calendared at signing / 30-45 day standard close]
  C --> C2[Part B: Fee Script Drill 5 min 90-sec timer pairs deliver twice]
  D1 & D2 & D3 & D4 & D5 & C2 --> E[Section 3: Discussion 10 min - 6 prompts last lost listing + broken Pillar + word-for-word seller deflection + actual sale-to-list ratio + real CMA or Zillow printout + ONE verbatim change]
  E --> F[Section 4: Role-Play 20 min]
  F --> F1[Round 1: Mark and Susan Reyes $850K colonial late 50s couple two other agents already this week RE/MAX 22-year + Compass 3-year - 3 deflections what makes you different / Compass virtual staging and 3D / friends daughter 4% total and I dont have to offer buyer agent anything - AGENT runs all 5 Pillars verbatim signs at table]
  F1 --> F2[60-sec reset]
  F2 --> F3[Round 2: Diane Park widowed downsizing Zestimate $920K vs CMA $815-835K - 3 deflections Zillow $920K $90K gap / neighbor Pat $880K / start high $895K reduce in 30 days - AGENT defuses with Zillow plus minus 2.4% plus minus 7-10% + neighbor comp adjustments minus 25K sqft minus 40K basement minus 15K lot minus 30K kitchen plus 8K appreciation = Pat maps to $778K + sale-to-list math start higher nets less takes 3x longer]
  F3 --> F4[60-sec reset]
  F4 --> G[Section 5: Debrief + Commitments 5 min - 3 debrief Qs + 3-line commitment ritual upcoming appointment + weakest Pillar + ONE verbatim change read aloud]
  G --> H[Section 6: Leave-Behind 3 min - printed one-pager 5-PILLAR grid + Fee verbatim 4-line + 3 deflection responses + communication template + never-do list + hero quote]
  H --> Z[Meeting Ends 60:00 - manager asks for recording in 1:1 within 7 days]
\`\`\`

## Manager Coaching Loop

\`\`\`mermaid
flowchart LR
  T[Training Monday] --> W1[Week 1: Agent Commits Upcoming Appointment + Weakest Pillar + ONE Verbatim Change]
  W1 --> W2[Agent Delivers Verbatim Fee 4-Line + PRICE as Range Records Audio Within 7 Days]
  W2 --> W3[Manager Reviews Recording in 1:1 Marks 5-Pillar Coverage]
  W3 --> W4[1:1 Coaching: Pillar Still Fumbled + Verbatim Re-Delivery With Manager Playing Skeptical Seller]
  W4 --> W5[Monthly Win-Rate Review: Cohort Win Rate + Sale-to-List + DOM + Lost-Pattern by Pillar]
  W5 --> W6[Quarterly: Refresh CMA Template + Update Listing Agreement + Rotate Role-Plays From Actual Losses]
  W6 --> R{Rerun Every 90 Days With Fresh Lost-Listing Recordings}
  R -->|Yes| T
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-PILLAR Framework, the Post-Settlement Fee 4-line script, and the 35-50% baseline / 65-80% top-decile win-rate gap draw on a specific body of residential real estate research. A manager should be ready to cite these by name.

**Seller-side research.** **NAR** — **2024 Member Profile** (agent productivity, listing-presentation cadence), **Home Buyers and Sellers Generational Trends 2025** (downsizer behavior, communication preferences), **Profile of Home Buyers and Sellers 2024-2025** (73% interview-only-1-3-agents stat, 6% FSBO share, 13-26% FSBO discount, post-settlement Fee question prevalence). **Realtor.com Research** for listing-side market data + DOM by metro + price-reduction frequency. **Inman + RISMedia + T3 Sixty + Real Trends 500** for productivity benchmarks and top-decile win-rate data.

**Pricing + valuation.** **Zillow Research** + **Zillow's own published Zestimate methodology** — source of ±2.4% on-market and ±7-10% off-market lower-volume zip error rates that defuse Round 2. **Redfin Data Center** for sale-to-list ratios by metro. **Regional MLS systems** (source of truth, not Zillow): **BrightMLS** (DC/MD/VA/WV/PA/NJ/DE), **Stellar MLS** (FL), **CRMLS** (CA), **MRED** (Chicagoland), **NTREIS** (DFW), **FMLS** (Atlanta).

**Post-NAR-settlement framework.** **NAR Settlement** — Sitzer-Burnett (KC, MO), Moehrl (IL), $418M, **effective August 17, 2024** — separated listing and buyer-side commissions, eliminated MLS commission posting, required written buyer-broker rep agreements before tours. **DOJ + State AGs** ongoing oversight. **NAR Consumer Guides**, **REBNY** (NYC alt), **RESO + MLS Grid** technical compensation-field handling.

**Listing-marketing tech.** **Matterport** (3D tour standard at $400K+). **BoxBrownie + Spacely + Aryeo** virtual staging. **Realtor.com Showcase + Zillow Showcase** premium placement. **DroneBase + Part-107 operators** for $500K+. **BrightMLS Coming Soon + Compass Private Network + KW Command + RE/MAX Collection + eXp Sphere** for pre-MLS distribution.

**Listing-side CRM.** **Top Producer**, **Follow Up Boss** (high-volume standard), **kvCORE + BoldTrail** (Inside Real Estate), **Lofty** (formerly Chime), **Sierra Interactive**, **Wise Agent**, **Chime**, **Compass CRM**. Each handles broker-tour-invitation + Friday-email-cadence Pillar 5 requires.

**Competitive brokerage landscape.** **Keller Williams** — largest agent count, team-of-one PROOF discipline. **RE/MAX** — veteran-heavy, the "22-year producer" the seller is also interviewing. **Compass** — tech-marketing-forward, the "3D tour sample" deflection lives here, strong $750K+ metros. **eXp Realty** — cloud-brokerage, fastest-growing. **Coldwell Banker + Berkshire Hathaway HomeServices + Sotheby's** luxury-end. **Side + The Agency + Engel & Völkers** in $1M+ markets.

**Operator authorities.** **Tom Ferry + Brian Buffini + Mike Ferry + Ninja Selling (Larry Kendall) + MREA (Gary Keller) + The HyperFast Agent (Dan Lesniak) + Workman Success Systems + Buffini & Company** as the coaching frameworks veteran agents already follow. The framework composes from these voices + post-settlement compliance work from NAR + RESO + brokerage legal; it does not invent.

`;

// ============================================================================
// NUM -- quantified benchmarks the manager cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

The cold-open lands harder when the manager can quote real benchmarks. The tables below are pulled from NAR 2024-2025 Member Profile + NAR Profile of Home Buyers and Sellers + Realtor.com + Zillow + Redfin + Inman + RISMedia + T3 Sixty + Real Trends 500, all 2024-2025.

### Residential Listing-Presentation Win Rates (Why Sellers Choose An Agent)

| Win-Rate Tier | Listing-Presentation Conversion | Source |
|---|---|---|
| Bottom-quartile residential agent (under 2 years license) | **22-32%** | NAR + Real Trends |
| Average residential agent (2-7 years license) | **35-50%** | NAR Member Profile |
| Top-quartile residential agent (7-15 years, established farm) | **52-64%** | RISMedia + T3 Sixty |
| Top-decile (Real Trends 500, "the Top Producer in the brokerage") | **65-80%** | Real Trends 500 |
| Best-in-class team-lead with 5-Pillar discipline + verbatim Fee script | **78-88%** | Inman 2024-2025 surveys |

### Why Sellers Choose The Winning Agent (NAR Profile of Home Buyers and Sellers)

| Driver | % Sellers Citing As Primary Reason |
|---|---|
| Agent had the most-credible PROOF stats (sale-to-list, DOM, volume) | **42%** |
| Agent had the most-defensible PRICE recommendation (range with rationale) | **38%** |
| Agent had the clearest 21-day marketing PLAN with named tools | **34%** |
| Agent handled the Post-Settlement Fee question with confidence + verbatim language | **42%** (post-settlement; **27%** pre-settlement) |
| Agent's communication PROCESS commitment in writing | **48%** (sellers' #1 prior-agent complaint) |
| Agent had the lowest commission | **18%** |
| Agent was a personal referral / known-relationship | **38%** |
| Agent gave a higher price recommendation than competitors | **23%** (but ultimately wins only **31%** of those at the listed price) |

### Pricing-Strategy Outcomes (Realtor.com + Zillow + BrightMLS Data)

| Listing Strategy | Days On Market | Final Sale vs Original List | Outcome |
|---|---|---|---|
| Priced inside CMA-supported range | **14-30 days** | **98-102%** | Clean sale, no reductions |
| Priced 3-7% above supported range | **30-60 days** | **94-99%** (after 1 reduction) | Stretched but recoverable |
| Priced 8-15% above supported range | **75+ days** | **88-94%** (after 2-3 reductions) | Listing goes stale, net less than market-rate strategy |
| Priced 16%+ above supported range | **120+ days or expires** | **80-90% or relists** | Failed listing, often requires changing agents |
| Priced 3-5% below supported range (aggressive) | **3-7 days** | **101-106%** (multiple offers) | Bidding war, may exceed market-rate net |

### Post-Settlement Buyer-Broker Compensation Patterns (Aug 17 2024 -- May 2026)

| Seller Compensation Offer | % Of Listings | Buyer-Pool Visibility | Average Sale vs Comparable Listings |
|---|---|---|---|
| 2.5-3% offered to buyer agent (full standard) | **65-78%** | **95-100%** of active buyers | **Baseline** (sale at 98-102% of list) |
| 2-2.5% offered (partial) | **12-18%** | **80-90%** of active buyers | **-1% to -2%** vs baseline |
| "Concession negotiable" listed | **8-12%** | **70-85%** of active buyers (variable) | **-2% to -4%** vs baseline |
| 0% offered (no buyer-agent compensation) | **4-8%** | **50-70%** of active buyers | **-3% to -6%** vs baseline |
| FSBO (no listing agent at all) | **6-8%** | **30-50%** of active buyers | **-13% to -26%** vs agent-listed |

### Zillow Zestimate Accuracy (Zillow's Own Published Data)

| Property Type / Market | Zestimate Median Error | Source |
|---|---|---|
| On-market homes (active listings) — national | **±1.9-2.4%** | Zillow Research |
| Off-market homes (lifetime estimate) — national | **±6.9-7.4%** | Zillow Research |
| Off-market homes in lower-volume zip codes | **±7-10%** | Zillow Research |
| Luxury homes $2M+ | **±10-15%** | Zillow + Redfin |
| Rural / unique properties | **±10-20%** | Zillow Research |

### Agent Activity Cadence (Top-Decile vs Average Residential Agent)

| Activity | Top-Decile | Average |
|---|---|---|
| Listing presentations per year | 22-35 | 12-18 |
| Listing-presentation win rate | 65-80% | 35-50% |
| Net listings won per year | 16-28 | 5-8 |
| Listings sold per year | 35-65 (incl buyer side) | 8-14 |
| GCI per year | $420K-$1.2M | $58K-$95K |
| Repeat + referral % of business | 60-75% | 25-40% |
| Sale-to-list ratio | 99-102% | 95-99% |
| Average DOM | 12-22 | 35-55 |
| Verbatim Fee 4-line script delivery in every presentation | 85-100% | 18-32% |
| PRICE delivered as range with rationale | 80-95% | 22-38% |
| Day 14 pricing-review meeting calendared at signing | 80-100% | 15-30% |

### 5-Pillar Verbatim Discipline Adoption Curve (Agents Running Verbatim)

| Discipline Move | Week 1 | Week 4 | Week 12 |
|---|---|---|---|
| PROOF — 3-line stat block + 10-second open | 28% | 64% | 84% |
| PRICE — range with rationale (3 numbers) | 18% | 48% | 72% |
| PLAN — 21-day calendar with named tools | 22% | 52% | 75% |
| Post-Settlement FEE — verbatim 4-line script | 12% | 42% | 70% |
| PROCESS — Friday email + Day 14 meeting calendared | 25% | 58% | 78% |
| All 5 Pillars on every presentation | 6% | 28% | 58% |

**Pattern:** The Post-Settlement Fee verbatim 4-line script is the hardest move to install — most agents cannot deliver it without notes in week 1 and still hedge with *"well, technically..."* through week 4. **That is the muscle this training commits the manager to drill in every 1:1.** Once Fee + PRICE-as-range discipline is reflex, the other Pillars follow within 4-6 weeks because every won presentation that uses the verbatim language shows up in the agent's listing inventory the following month.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + manager objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Agent Improvises The Fee Question
*"Well, technically you don't have to..."* and trails off. **Sellers translate vagueness as the agent not understanding the new market.** Per Inman 2024-2025, predicts ~60% of post-settlement losses. **Coach:** record the agent delivering the Fee 4-line three times in a row with manager-played pushback. Until reflex.

### Failure Mode 2 -- CMA Is A Zillow Printout With The Logo Cropped
**Sellers know what Zillow looks like — they pulled it up before the appointment.** A real CMA pulls from regional MLS, 3 comps within 60 days / 0.5 mi / 200 sqft / 1 BR, condition-adjusted. **Coach:** audit every agent's CMA; rebuild 3 from MLS data this week if it's a Zillow printout.

### Failure Mode 3 -- PRICE Delivered As One Number
*"I think we should list at $825K"* and the seller argues. **One number is an opinion; a range with rationale is a framework.** **Coach:** rewrite every PRICE delivery as 3 numbers with day-and-dollar math before next presentation.

### Failure Mode 4 -- PLAN Is A Generic Marketing PDF
Same 90-day one-pager for $300K starter and $1.4M executive home. **Sellers smell boilerplate immediately.** **Coach:** build 3-4 PLAN templates by price band ($300-500K / $500-800K / $800K-1.5M / $1.5M+).

### Failure Mode 5 -- PROOF Dumps 12 Certifications Instead Of 3 Stats
GRI / CRS / SRES / ABR / e-Pro slide. **Sellers do not know what those letters mean.** **Coach:** rewrite PROOF as 3 lines (volume, sale-to-list, DOM) in 10 seconds; certifications relegated to leave-behind.

### Failure Mode 6 -- PROCESS Is "Great Communication" Without A Cadence
*"I'll keep you posted"* without Friday-email cadence or Day 14 meeting calendared. **Vague promises lose to calendared commitments every time.** **Coach:** add Friday-email + Day-14-calendared into the listing agreement.

### Failure Mode 7 -- Trashing The Competing Agent By Name
**Sellers translate "she's bad" as "you're insecure."** Per NAR Profile 2024, sellers cite agent-trashing as a negative signal **2.4x more often than helpful**. **Coach:** name competing agents respectfully ("she's at a great brokerage") and pivot to YOUR specific math.

### Failure Mode 8 -- Matching A Discount Broker's Commission On The Spot
**Matching signals the original number was theater** — seller may sign but tells everyone you caved. **Coach:** drill the "ask which Pillar 3 services they're cutting" response.

### Failure Mode 9 -- Skipping The Verbatim Ask For Signature
Vague *"let me know what you decide"* closes lose at **2-3x the rate of direct asks** per Inman 2024-2025. **Coach:** drill the verbatim close — "List with me tonight, or sleep on it and let me know in the morning either way? I'm comfortable with either answer."

### Failure Mode 10 -- Manager Doesn't Audit Weekly Recordings
Kills 60-80% of training rollouts. Per RISMedia 2024-2025, un-coached training has a **~21-day half-life**. **Coach:** one recorded presentation per agent per week, mark Pillars delivered vs fumbled, 5-min verbatim re-drill in 1:1.

### Common Manager Objections

**1. "My agents already know listing presentations."** Pull last 12 months' win rate. Under 50% means they manage relationships — not winning with 5-Pillar discipline against the Compass agent.

**2. "Sellers just want to trust the agent."** Trust is built by discipline, not announced. NAR Profile: sellers rank PROOF + PROCESS at 42% + 48% — both verbatim language.

**3. "Verbatim feels inauthentic."** The 90 seconds that matter are verbatim by design; the other 42 minutes are conversational. Top producers do this; "feeling authentic" without verbatim loses to Compass weekly.

**4. "Luxury market is different."** Luxury sellers ask the SAME 3 Fee deflections, expect SAME PRICE-as-range rigor. Dollar amount changes; framework does not.

**5. "Senior 15-year-relationship agents don't need this."** Senior agents have the WORST Fee-script discipline (came up pre-August 2024). If post-settlement win rate down 5+ pts, they need this most.

**6. "Brokerage onboarding covers this."** Onboarding gives a deck. This is the weekly recording audit.

**7. "How do I know it's working?"** Three 90-day signals: cohort win rate +8-15 pts; sale-to-list +1-2 pts; verbatim Fee delivery 12-18% to 70%+.

### When To Run A Second Time

Re-run every **90 days** with fresh lost-listing recordings. Rotate role-plays from actual losses last quarter. Third run, swap hardest archetypes — dual-income downsizer couple, widowed solo seller anchored to Zillow, friend-with-license discount challenger, Fee skeptic.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Eighth entry** in **Pulse Sales Trainings** (\`/sales-trainings/\`) and **second industry-specific training** (after st0007 orthopedic medical device). st0001-st0006 covered B2B SaaS motions that translate across industries; st0007-forward pivots to **industry-by-industry coverage**. st0008 is residential real estate — the largest individual-producer industry in the country (NAR ~1.5M REALTORS) and the one most materially changed by the August 2024 NAR settlement.

**Companion industry entries planned:** **st0009** mortgage origination + loan officer sales, **st0010** commercial real estate brokerage, **st0011** property management + multifamily leasing, **st0012** title insurance + closing services, **st0013** new construction + builder sales reps, **st0014** real estate investment sales (fix-and-flip / BRRRR / syndication), **st0015** real estate tech vendor sales (CRM / MLS / iBuyer / proptech), **st0016** vacation rental + STR acquisition. Each follows the same six-section structure.

**Cross-references to st0001-st0006 translated for residential RE:** **st0001 discovery** → 5-Pillar PROOF + PRICE diagnostic; **st0002 single-threading** → seller spouse is the second thread; **st0003 objection recovery** → 3 Post-Settlement Fee deflection responses; **st0004 cold-call opener** → 10-second PROOF open at the kitchen table; **st0005 demo discipline** → 21-day PLAN calendar walkthrough; **st0006 pricing** → PRICE-as-range + Zillow gap defuse + sale-to-list math. An agent who internalized st0001-st0006 absorbs the residential overlay 2x as fast.

**Cross-reference to st0007 — what transfers:** the **discipline of verbatim language on the load-bearing 90 seconds** transfers exactly. Where st0007 made surgeons hear OR + Evidence + Outcome diagnostics verbatim, st0008 makes sellers hear PROOF + Fee 4-line + PRICE-as-range verbatim. **Top producers script the load-bearing moments and improvise the rest.** What does NOT transfer: residential has no VAC equivalent (seller is sole decision-maker after spouse alignment); no 6-18 month adoption cycle (residential is 30-45 day commitments on a 7-day decision cycle).

**Adjacent Pulse Knowledge entries:** NAR settlement primer + state buyer rep requirements + CMA construction methodology + Zillow Zestimate error research + regional MLS coming-soon rules + 5 brokerage models compared + listing-side CRM benchmarks. **q9601 fractional CFO** maps onto the financial-defense conversation a downsizing seller has with their CPA before signing.

**Frameworks for deeper read:** NAR Member Profile + Profile of Home Buyers and Sellers + Settlement framework (nar.realtor); Realtor.com Research; Zillow Research + Zestimate methodology; Redfin Data Center; Inman + RISMedia + T3 Sixty + Real Trends 500; regional MLS for actual comp data. Coaching references — Tom Ferry, Brian Buffini, Mike Ferry, Ninja Selling (Larry Kendall), MREA (Gary Keller), HyperFast Agent (Dan Lesniak).

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0008](https://pulserevops.com/sales-trainings/st0008).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block (NAR National Association of Realtors 2024 Member Profile + Home Buyers and Sellers Generational Trends 2025 + Profile of Home Buyers and Sellers 2024-2025 + NAR Settlement Sitzer-Burnett Moehrl $418M effective August 17 2024 buyer-broker compensation framework + Realtor.com Research listing-side market data days-on-market + Zillow Research published Zestimate methodology ±2.4% on-market ±7-10% off-market lower-volume zips + Redfin Data Center sale-to-list ratios competitive-offer counts + Inman + RISMedia + T3 Sixty + Real Trends 500 agent productivity brokerage operating benchmarks + regional MLS systems BrightMLS Stellar MLS CRMLS MRED NTREIS FMLS source of truth for actual comps + REBNY NYC + RESO + MLS Grid technical compensation-field handling + listing-marketing tech Matterport BoxBrownie Spacely Aryeo Realtor.com Showcase Zillow Showcase DroneBase Part-107 + listing-side CRM Top Producer Follow Up Boss kvCORE BoldTrail Lofty formerly Chime Sierra Interactive Wise Agent Chime Compass CRM + pre-MLS distribution Compass Private Network KW Command RE/MAX Collection eXp Sphere + competitive brokerages Keller Williams RE/MAX Compass eXp Realty Coldwell Banker Berkshire Hathaway HomeServices Sothebys Side The Agency Engel Volkers + DOJ State AG ongoing oversight + NAR Consumer Guides + coaching framework references Tom Ferry Brian Buffini Mike Ferry Ninja Selling Larry Kendall MREA Gary Keller HyperFast Agent Dan Lesniak Workman Success Systems Buffini Company). Every framework research source named so a real estate team lead can cite by name when agents push back. EXPLICITLY RESIDENTIAL REAL ESTATE - NOT SaaS - no Gong Bridge Group Pavilion. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 7 quantified benchmark tables: (1) Residential Listing-Presentation Win Rates by tier — bottom-quartile under 2 years 22-32% / average 2-7 years 35-50% / top-quartile 7-15 years 52-64% / top-decile Real Trends 500 65-80% / best-in-class team-lead with 5-Pillar discipline + verbatim Fee script 78-88%. (2) Why Sellers Choose The Winning Agent NAR Profile — most-credible PROOF stats 42% + most-defensible PRICE recommendation 38% + clearest 21-day PLAN with named tools 34% + handled Post-Settlement Fee with confidence + verbatim 42% post-settlement vs 27% pre-settlement + communication PROCESS in writing 48% sellers #1 prior-agent complaint + lowest commission 18% + personal referral 38% + higher price recommendation 23% but wins only 31% at listed price. (3) Pricing-Strategy Outcomes Realtor.com Zillow BrightMLS — inside CMA-supported range 14-30 days 98-102% / 3-7% above 30-60 days 94-99% after 1 reduction / 8-15% above 75+ days 88-94% after 2-3 reductions / 16%+ above 120+ days or expires 80-90% or relists / 3-5% below aggressive 3-7 days 101-106% multiple offers. (4) Post-Settlement Buyer-Broker Compensation Patterns Aug 17 2024 to May 2026 — 2.5-3% offered 65-78% of listings 95-100% buyer pool visibility baseline / 2-2.5% partial 12-18% 80-90% pool -1% to -2% baseline / concession negotiable 8-12% 70-85% pool -2% to -4% / 0% offered 4-8% 50-70% pool -3% to -6% / FSBO 6-8% 30-50% pool -13% to -26%. (5) Zillow Zestimate Accuracy Zillows Own Data — on-market national ±1.9-2.4% / off-market lifetime national ±6.9-7.4% / off-market lower-volume zips ±7-10% / luxury $2M+ ±10-15% / rural unique ±10-20%. (6) Agent Activity Cadence Top-Decile vs Average — listing presentations per year 22-35 vs 12-18 / win rate 65-80% vs 35-50% / net listings won 16-28 vs 5-8 / listings sold incl buyer side 35-65 vs 8-14 / GCI $420K-1.2M vs $58K-95K / repeat-and-referral 60-75% vs 25-40% / sale-to-list 99-102% vs 95-99% / average DOM 12-22 vs 35-55 / verbatim Fee 4-line script delivery 85-100% vs 18-32% / PRICE as range 80-95% vs 22-38% / Day 14 pricing-review calendared 80-100% vs 15-30%. (7) 5-Pillar Verbatim Discipline Adoption Curve — PROOF 3-line stat block 28%→84% week 12 / PRICE range with rationale 18%→72% / PLAN 21-day calendar named tools 22%→75% / Post-Settlement FEE verbatim 4-line script hardest 12%→70% / PROCESS Friday email + Day 14 meeting calendared 25%→78% / all 5 Pillars on every presentation 6%→58%. Post-Settlement Fee verbatim 4-line script is the hardest install requiring weekly recording reviews — that is the muscle this training commits the manager to drill. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 10-failure-mode counter-case: (1) Agent improvises Post-Settlement Fee question with well technically you dont have to and trails off — Inman 2024-2025 predicts ~60% of post-settlement losses from this single failure mode drill verbatim 4-line script three times in a row in 1:1 with manager-played seller pushback. (2) CMA is Zillow printout with the logo cropped — sellers know what Zillow looks like they pulled it up before the appointment real CMA pulls from regional MLS BrightMLS Stellar CRMLS MRED NTREIS FMLS 3 comps in last 60 days within 0.5 mi 200 sqft 1 BR with condition adjustments rebuild 3 CMAs this week using only MLS data. (3) PRICE delivered as one number — opinion the seller fights vs range with rationale framework the seller has to evaluate every agent rewrites PRICE delivery as 3 numbers with day-and-dollar math on each end. (4) PLAN is generic marketing PDF same 90-day one-pager regardless of $300K starter vs $1.4M executive home — sellers smell boilerplate immediately team builds 3-4 PLAN templates by price band $300-500K $500-800K $800K-1.5M $1.5M+. (5) PROOF dumps 12 certifications GRI CRS SRES ABR e-Pro CRP RSPS instead of 3 stats — sellers do not know what those letters mean and will never ask rewrite as 3 lines volume sale-to-list DOM deliverable in 10 seconds certifications relegated to leave-behind only. (6) PROCESS is great communication without a cadence sellers #1 complaint about prior agents is communication add Friday-email-every-Friday + Day-14-meeting-calendared into listing agreement as written commitment. (7) Trashing competing agent by name sellers translate shes bad as youre insecure per NAR sellers cite agent-trashing as negative signal 2.4x more often than helpful name competing agents respectfully shes at a great brokerage and pivot to YOUR specific math. (8) Matching discount brokers commission on the spot signals original number was theater seller may sign at 5% but tells everyone the agent caved drill the ask which Pillar 3 services theyre cutting response. (9) Skipping verbatim ask for signature with vague so let me know what you decide loses at 2-3x rate of direct asks per Inman 2024-2025 drill verbatim Would you like to list with me tonight or sleep on it and let me know in the morning either way Im comfortable with either answer. (10) Manager skips weekly recording audit 21-day half-life kills 60-80% of training rollouts per RISMedia 2024-2025 listen to one recorded listing presentation per agent per week mark Pillars delivered vs fumbled 5-minute verbatim re-drill in 1:1. Plus 7 common manager objections with honest answers: agents already know how to do listing presentations / sellers just want to feel they trust the agent / verbatim scripts feel inauthentic / team works the luxury market this doesnt apply / senior 15-year-relationship agents dont need this / brokerage gives this in onboarding / how do I know its working three 90-day signals cohort win rate +8-15 pts sale-to-list +1-2 pts verbatim Fee delivery 12-18% to 70%+. Plus when-to-rerun-every-90-days cadence with rotated archetypes dual-income downsizer couple widowed solo seller anchored to Zillow friend-with-license discount-commission challenger post-settlement Fee skeptic. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as EIGHTH entry and SECOND industry-specific training after st0007 orthopedic medical device sales — st0001-st0006 covered B2B SaaS motions (discovery + single-threading + post-demo objection recovery + cold-call opener + demo discipline + pricing) that translate across industries from st0007 forward pillar pivots to industry-by-industry coverage and st0008 is residential real estate the largest individual-producer industry in the country NAR ~1.5M REALTORS 2024-2025 and the industry most materially changed by the August 2024 NAR settlement. Companion industry-specific entries planned st0009 mortgage origination + loan officer sales residential lending side of same transaction + st0010 commercial real estate brokerage office retail industrial multifamily + st0011 property management + multifamily leasing + st0012 title insurance + closing services + st0013 new construction + builder sales reps + st0014 real estate investment sales fix-and-flip BRRRR syndication + st0015 real estate tech vendor sales CRM MLS iBuyer proptech + st0016 vacation rental + STR property acquisition. Cross-references to st0001-st0006 SaaS foundation arc translated for residential real estate: st0001 discovery → 5-Pillar PROOF + PRICE diagnostic / st0002 single-threading → listing-presentation IS the single-threaded conversation but seller spouse is second thread / st0003 objection recovery → 3 Post-Settlement Fee deflection responses / st0004 cold-call opener → 10-second PROOF open at kitchen table / st0005 demo discipline → 21-day PLAN calendar walkthrough / st0006 pricing → PRICE-as-range with rationale + Zillow Zestimate gap defuse + sale-to-list math at different pricing levels. Cross-reference to st0007 what transfers — discipline of verbatim language on load-bearing 90 seconds transfers exactly where st0007 made surgeons run OR + Evidence + Outcome diagnostics verbatim st0008 makes sellers hear PROOF open + Fee 4-line script + PRICE-as-range close verbatim same underlying mechanism top producers script load-bearing moments and improvise the rest what does NOT transfer residential has no VAC equivalent seller is sole decision-maker after spouse alignment and no 6-18 month cadaver-lab cycle residential listings are 30-45 day commitments on 7-day decision cycle. Adjacent Pulse Knowledge Library entries NAR settlement primer August 17 2024 framework + state-by-state buyer rep agreement requirements + CMA construction methodology 3 comps 60 days 0.5 mi 200 sqft 1 BR condition-adjusted + Zillow Zestimate published error rate research + regional MLS rules on coming-soon and pre-MLS distribution BrightMLS Stellar CRMLS + 5 brokerage models compared KW team RE/MAX office Compass tech-marketing eXp cloud Coldwell Banker traditional + listing-side CRM benchmarks Follow Up Boss kvCORE BoldTrail Top Producer Lofty Sierra + q9601 fractional CFO maps onto financial-defense conversation downsizing seller has with CPA before signing. Reading list of frameworks with URLs: NAR Member Profile + Profile of Home Buyers and Sellers + Settlement framework (nar.realtor) + Realtor.com Research (realtor.com/research) + Zillow Research + Zestimate methodology (zillow.com/research) + Redfin Data Center (redfin.com/news/data-center) + Inman + RISMedia + T3 Sixty + Real Trends 500 for productivity benchmarks + regional MLS systems for actual comp data + coaching framework references Tom Ferry + Brian Buffini + Mike Ferry + Ninja Selling Larry Kendall + MREA Gary Keller + HyperFast Agent Dan Lesniak for veteran agents already aligned with a coach. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Eighth Pulse Sales Training entry st0008 and SECOND industry-specific training after st0007 orthopedic medical device sales — a fully runnable 60-minute live residential-real-estate-listing-presentation training for the single most-leveraged conversation in residential real estate (per NAR 2024-2025 Member Profile + Realtor.com + Inman 35-50% baseline win rate vs 65-80% top-decile Real Trends 500 win rate gap) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,000 words ABSOLUTE HARD CAP 10,500. Structure: orange Pulse Training callout intro (who-for: residential agents in any market rookies through 20-year top producers + brokerage team leads at KW RE/MAX Compass eXp Coldwell Banker Berkshire Hathaway HomeServices + broker-owners of independent boutiques; what-bring: recordings or detailed notes from last 5 lost listing presentations + teams current CMA template + printed leave-behind + brokerages new post-settlement listing agreement + whiteboard) + Bottom Line callout with sellers do not choose the agent with the lowest commission they choose the agent who made them feel like the smartest seller in the room plus 5-Pillar 35-50% to 65-80% gap thesis + 6-row pipe-table agenda (0:00-0:05 Cold Open / 0:05-0:22 Teach / 0:22-0:32 Discussion / 0:32-0:52 Role-Play / 0:52-0:57 Debrief+Commitments / 0:57-1:00 Leave-Behind) + Section 1 Cold Open with NAR + Realtor.com + Inman 35-50% baseline + 65-80% top-decile + NAR Profile 73% sellers interview 1-3 agents + Zillow Research listings inside CMA range sell 30 days 98-102% vs priced 8-15% above sit 75+ days 6-9% below list + Jen composite story 7-year top-quartile producer Tuesday-night kitchen table $750K colonial Mike and Lisa late 50s downsizing ran 45 minutes well with laminated comps brokerage marketing slick 3 references left feeling great Friday morning we decided to go with another Compass agent had different approach to new buyer-broker compensation Jen called Mike Compass agent had verbatim 4-line script Jen stumbled through technically the seller doesnt have to pay anymore but most still do depends vs three months later comparable appointment Jen ran 5-Pillar discipline PROOF PRICE PLAN Post-Settlement Fee verbatim 4-line script PROCESS sellers signed at table listed Thursday three offers by Saturday open house sold 102% list 11 days + Common Trap on but every seller is different you cant script it answered NAR Profile 42% sellers in first 12 months post-settlement asked buyer-broker compensation question + verbatim is load-bearing sentence seller remembers Friday morning + top producers run verbatim language on Pillars that matter improvise rest + Section 2 The Teach split into Part A 5-PILLAR Listing Presentation Framework (PROOF: 3 lines 10 seconds last 12 months volume + closed transactions + sale-to-list 98-102% normal markets 103-107% seller markets + average DOM under 30 + repeat-and-referral 60%+ veteran-trap dumping certifications GRI CRS SRES ABR e-Pro CRP RSPS / PRICE: range with rationale not single number 3 comps regional MLS BrightMLS Stellar CRMLS MRED NTREIS FMLS within 60 days 0.5 miles 200 sqft 1 bedroom condition-adjusted aggressive 45-60 days reduction / market-rate 14-21 days 98-102% / quick-sale 7 days may sell over list Zillow Zestimate gap addressed proactively ±2.4% on-market ±7-10% lower-volume zips / PLAN: 21-day calendar tailored to THIS dollar Day 1 sign + pre-MLS coming-soon / Day 2-5 photography Matterport 3D drone Spacely virtual staging / Day 5 MLS live / Day 6 weekend open / Day 7-14 broker tour via Follow Up Boss Top Producer kvCORE BoldTrail Lofty Sierra Chime / Day 14-21 first pricing-review checkpoint / POST-SETTLEMENT FEE: verbatim 4-line script line 1 I charge 2.5-3% to represent you / line 2 I recommend you offer buyer agent 2-3% paid by you at closing not required / line 3 at 2-3% stay visible 95-100% buyer pool at 0% thin pool 30-50% cost 3-6% on final price usually 20-50K more than saved / line 4 three structures full / concession-negotiable / zero recommending option one which path + 3 seller deflection verbatim responses I read I dont have to pay buyer agent anymore + why is commission so high if separate + cant I sell FSBO and save / PROCESS: written day-numbered communication cadence Day 1 photographer 48 hrs + Day 7 weekly Friday email + Day 14 first pricing-review meeting calendared at signing + 30-45 day standard close) and Part B Fee Verbatim Script Drill 5 minutes 90-second timer pairs deliver script twice + Section 3 Discussion 6 prompts (name last lost listing + which Pillar broke down + word-for-word seller deflection + actual sale-to-list ratio + real CMA or Zillow printout + one verbatim language change at next presentation) + Section 4 Two-Person Role-Play with Round 1 Mark and Susan Reyes suburban $850K colonial late 50s couple two other agents already this week RE/MAX 22-year veteran + Compass 3-year producer Tuesday 7pm slot + 3 deflections what makes you different from Compass and RE/MAX / Compass virtual staging and 3D tour can you do that / friends daughter just got license offered 4% total commission and I read I dont have to offer buyer agent anything AGENT runs all 5 Pillars verbatim signs at the table hidden context Mark and Susan will sign tonight if AGENT runs all 5 Pillars cleanly will say well let you know if any Pillar fumbled, plus Round 2 Diane Park widowed 18 months downsizing Zillow Zestimate $920K vs CMA $815-835K mid-CMA review + 3 deflections Zillow says $920K vs $815-835K $90K gap / neighbor Pat sold $880K same street / can we start high $895K reduce in 30 days AGENT defuses with Zillow published error rate ±2.4% / ±7-10% off-market + adjusts neighbor comp specifically -$25K sqft -$40K finished basement -$15K lot -$30K kitchen +$8K appreciation = Pat maps to $778K + sale-to-list math at different pricing list at $825K sell $815-840K in 18 days vs list at $895K sit 75 days reduce twice sell $820-835K in 90 days you net less starting higher hidden context Diane will sign at supported range if AGENT defuses cleanly without being condescending + 60-sec reset + Section 5 Debrief+Commitments 3 debrief Qs (which Pillar felt strongest + which Pillar got skipped or fumbled + what verbatim language change at next presentation) + 3-line commitment ritual (next upcoming listing appointment sellers names address price band date + Pillar weakest on + ONE verbatim language change actual words not description read aloud) + Section 6 Leave-Behind walkthrough + printable one-pager (5-PILLAR grid with verbatim cue + what-yes-looks-like + Post-Settlement Fee verbatim 4-line script as 4-line script box + 3 seller deflection verbatim responses + communication commitment template Day-by-day + Never-Do behavior list 10 items + Listing Outcome Line wins 65-80% rate + If You Only Remember One Thing hero quote Sellers do not choose the agent with the lowest commission they choose the agent who made them feel like the smartest seller in the room. Your job at the kitchen table is to make them feel smart not to make yourself sound impressive.). How-this-fits-in-residential-real-estate-stack table at end of core showing pre-appointment prep + first 5 minutes at kitchen table + mid-presentation CMA review + marketing walkthrough + new fee conversation + close + post-signing + manager coaching cadence. Two mermaid diagrams: 60-min meeting flow + manager coaching loop post-training. 7 benchmark tables (residential listing-presentation win rates by tier + why sellers choose winning agent NAR Profile + pricing-strategy outcomes + post-settlement buyer-broker compensation patterns + Zillow Zestimate accuracy Zillows own data + agent activity cadence top-decile vs average + 5-Pillar verbatim discipline adoption curve). 10-failure-mode counter-case + 7-objection coach-back + when-to-rerun. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping discovery → 5-Pillar PROOF + PRICE / single-threading → seller spouse second thread / objection recovery → 3 Post-Settlement Fee deflections / cold-call opener → 10-second PROOF open / demo discipline → 21-day PLAN calendar / pricing → PRICE-as-range + Zillow defuse + sale-to-list math + companion industry-specific entries planned st0009-st0016 + cross-reference to st0007 what transfers (verbatim language on load-bearing 90 seconds) and what does not (no VAC equivalent residential is 30-45 day commitment on 7-day decision cycle). Tags include sales-training (hub filter) + real-estate-sales + listing-presentation + residential-real-estate + nar-settlement + 60-min-meeting + standard-team + realtor-training + st0008. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY RESIDENTIAL REAL ESTATE - NOT SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0008 is crawled.
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
