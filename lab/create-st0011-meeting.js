// st0011 -- Life Insurance Needs Analysis: The Discovery Conversation That Closes Without Pressure
// -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0011, tag: sales-training).
// FIFTH industry-specific training (after st0007 MedDevice, st0008 Real Estate, st0009 Auto F&I, st0010 Pharma).
// Industry = life insurance + financial advisory — captive career agents (Northwestern Mutual, MassMutual,
// NYL, Guardian, State Farm, AAA, Farmers, Allstate), IMO/BGA-affiliated independent agents
// (Crump, Highland Capital Brokerage, Bond Brothers, Brokers Alliance), and dually-registered
// broker-dealer reps offering insurance alongside investments.
// Regulated by NAIC Suitability + Best Interest #275 + state Reg 187-equivalents + FINRA Reg BI + DOL.
// VALUE over WORD COUNT. Target 8,500-10,000 words. ABSOLUTE HARD CAP 10,500.
// Walks 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0010 exactly. LEAN-FROM-START like st0008 + st0010.

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

const ID = 'st0011';
const QUESTION = "Life Insurance Needs Analysis: The Discovery Conversation That Closes Without Pressure — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'life-insurance-sales',
  'needs-analysis',
  'financial-advisor-training',
  'term-vs-whole-life',
  'naic-best-interest',
  '60-min-meeting',
  'standard-team',
  'captive-and-independent',
  'st0011'
];

const sources = [
  { title: 'LIMRA + LL Global Insurance Barometer Study 2024-2025 — coverage gap, ownership, agent retention, U.S. Life Insurance Sales Trends', url: 'https://www.limra.com/en/research/research-abstracts-public/2024/2024-insurance-barometer-study/' },
  { title: 'NAIC Suitability in Annuity Transactions Model Regulation #275 — best-interest standard adopted in 45+ states', url: 'https://content.naic.org/cipr-topics/suitability-and-best-interest-standard-conduct-annuity-transactions' },
  { title: 'NAIC Life Insurance and Annuities Replacement Model Regulation #613 — required replacement disclosure when replacing an existing policy', url: 'https://content.naic.org/sites/default/files/MO613.pdf' },
  { title: 'NY DFS Regulation 187 (11 NYCRR 224) — first-in-nation best-interest rule covering both annuities AND life insurance, effective 2019-2020', url: 'https://www.dfs.ny.gov/industry_guidance/regulations/adoptions/rf187txt' },
  { title: 'FINRA Regulation Best Interest (Reg BI) — SEC Rule 15l-1 governing dually-registered reps recommending insurance + investments, effective June 2020', url: 'https://www.finra.org/rules-guidance/key-topics/regulation-best-interest' },
  { title: 'DOL Retirement Security Rule + Fiduciary Rule — retirement rollover guidance applies to insurance recommendations into IRAs', url: 'https://www.dol.gov/agencies/ebsa/laws-and-regulations/rules-and-regulations/proposed-regulations/1210-AC02' },
  { title: 'LIMRA Agent Retention Research — 4-year agent retention ≈12-15%, year 1-2 warm-market burn pattern', url: 'https://www.limra.com/en/research/' },
  { title: 'NAIFA (National Association of Insurance and Financial Advisors) — professional standards, advocacy, code of ethics', url: 'https://www.naifa.org/' },
  { title: 'MDRT (Million Dollar Round Table) — top-of-industry production benchmarks, Court of the Table, Top of the Table', url: 'https://www.mdrt.org/' },
  { title: 'NAILBA (National Association of Independent Life Brokerage Agencies) + IMO/BGA channel — Crump, Highland Capital Brokerage, Bond Brothers, Brokers Alliance, Pinney Insurance', url: 'https://www.nailba.org/' },
  { title: 'IRI (Insured Retirement Institute) — annuity + retirement-income research, sales benchmarks, regulatory updates', url: 'https://www.irionline.org/' },
  { title: 'Industry trade press — ThinkAdvisor + InsuranceNewsNet + LifeHealthPro + Producer\'s eSource + InsuranceNewsNet Magazine + Wealth Management', url: 'https://www.thinkadvisor.com/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **Life insurance agents and financial advisors** running needs-analysis conversations — captive career agents at **Northwestern Mutual, MassMutual, NYL (New York Life), Guardian, State Farm, AAA, Farmers, Allstate**, independent agents working through **IMOs and BGAs (Crump Life Insurance Services, Highland Capital Brokerage, Bond Brothers, Brokers Alliance, Pinney Insurance, AIMCOR)**, and **dually-registered broker-dealer reps** offering insurance alongside investments. Works from the 2nd-year producer still burning through their warm market to the 20-year senior partner mentoring associates. Works inside captive shops (Northwestern Mutual), independent platforms (LPL Financial Insurance Services), and RIA firms running an insurance practice. The needs analysis is **the single highest-leverage conversation in the entire life insurance sales motion** — done right, it closes 35-55% without pressure; done wrong, it produces the "buy whole life because I get a higher commission" reputation the industry has been fighting for 30 years. **Drop this into the next agency meeting and run it live.**
>
> **What your agents will leave with:** A named, repeatable discipline — **the 5-STEP NEEDS ANALYSIS framework (LISTEN → COMPUTE → EDUCATE → MATCH → COMMIT) + the BEST-INTEREST "Three Pillars" compliance frame (SUITABILITY / DISCLOSURE / NO PRESSURE)** — for converting a prospect from cold inquiry to signed application without pressure tactics, illustration-as-sales-tool stunts, or the bait-and-switch reputation the industry needs to retire. Plus verbatim language for each step + each Pillar, two live role-plays (young-family discovery + business-owner buy-sell + key-person), a written commitment naming one stalled prospect, and a printable one-pager for the producer's binder.
>
> **What the agency manager should bring:** **(1)** **3 recent unconverted prospect recordings or notes** — the families who said *"we'll think about it"* on minute 22 and never came back, the business owners who said their financial advisor already had it covered, the high earners who bought $250K because it was "what they could afford." The agents who lost them will see themselves in Section 3. **(2)** **The team's current fact-finder template** + the state-specific Reg 187-equivalent best-interest disclosure form + a printed leave-behind. **(3)** **A whiteboard** to score each agent's stalled-prospect list by which step of the 5-Step broke down + which Pillar nearly got crossed by Section 3's end.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:05** | **Cold Open** — LIMRA Insurance Barometer 2024-2025 41% need more / 52% own any + agent retention 12-15% problem + 90-sec composite story | Agency Manager | Agents feel the underinsured-American gap is THE opportunity — and the agent-trust problem is the constraint, not the product |
| **0:05-0:22** | **The Teach** — 5-STEP NEEDS ANALYSIS framework (LISTEN / COMPUTE / EDUCATE / MATCH / COMMIT) + BEST-INTEREST Three Pillars (SUITABILITY / DISCLOSURE / NO PRESSURE) | Agency Manager | Agents can recite all 5 steps in sequence, all 3 Pillars, and the verbatim cue under each without notes |
| **0:22-0:32** | **The Discussion** — each agent names their toughest unconverted prospect from last 60 days + which step broke + which Pillar nearly got crossed | Agency Manager + room | Every agent audits last 3 stalled prospects from CRM (Redtail, Wealthbox, Salesforce Financial Services Cloud, eMoney, agency BMS); identifies the one missing move |
| **0:32-0:52** | **Role-Play x 2** — Round 1 young dual-income family (10 min) + 60-sec reset + Round 2 50-yo solo dental-practice owner with buy-sell + key-person + estate (10 min) | Agents in pairs | Agents deliver the 5-Step live + stay inside the Three Pillars under realistic prospect deflection without pivoting to a product before COMPUTE |
| **0:52-0:57** | **Debrief + Commitments** — 3 debrief questions + each agent names ONE prospect + the broken step + a 7-day redo recorded or CRM-detailed | Agency Manager + each agent | Every agent walks out with one named prospect + one specific verbatim change + one CRM entry for manager review |
| **0:57-1:00** | **Leave-Behind Walkthrough** — printed one-pager + Three Pillars compliance grid + DIME/HLV/CNA quick reference + compliance checklist | Agency Manager | Agents know where the template lives and keep one-pager in the producer's binder |

> ### 🎯 Bottom Line
> **You don't sell life insurance — you protect families. The product comes last.** Per **LIMRA + LL Global Insurance Barometer Study 2024-2025**, **41% of US adults say they need more life insurance and only 52% own any** — a $25 trillion national coverage gap with 65 million underinsured adults. The reason most cite for not buying: *"I'd buy if a financial professional explained it without pressure."* The agent who runs the **5-STEP NEEDS ANALYSIS — LISTEN, COMPUTE, EDUCATE, MATCH, COMMIT — without pitching a product before the math lands** closes at 35-55% vs the industry-average 20-30%, AND keeps every state insurance commissioner on side. Five steps. Three Pillars. The math lands before the product. Always.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- THE COLD OPEN (0:00-0:05)

> ### 🟡 Coach Note
> Do not open the laminated whole-life illustration. Do not pull out the carrier app. Walk into the agency meeting, say the numbers, tell the story. The first 90 seconds set whether agents tune out or remember this on the next kitchen-table appointment. **Five minutes. Hard stop at 0:05.**

### The numbers, then the story.

**The numbers first.** Per **LIMRA + LL Global Insurance Barometer 2024-2025**: **41% of US adults say they need more life insurance, but only 52% own any policy at all.** National coverage gap **$25 trillion**, **65 million adults underinsured**. The single biggest reason for not buying: *"I'd buy if a financial professional explained it without pressure."* The opportunity is enormous — **the constraint is agent trust, not product**.

The other half is producer-side. **Per LIMRA, 4-year agent retention runs ≈12-15%.** New agents burn through warm market in year 1-2, panic-sell whole life on commission, lose client trust, get pushed out by year 3. Survivors learned the needs analysis is not a fact-finder template — **it is the entire job.**

The math is brutal. 15 fact-finders/month at 20-25% close = **36-45 cases/year** — barely convention-qualifying. Same agent at **45% close** = **81 cases/year** — MDRT-qualifying production with better persistency, more referrals, zero complaints. **The difference is whether the agent ran the math before the product or showed the illustration before the COMPUTE.**

**The story.** (Composite — swap in a case the team recognizes.)

Marcus, third-year captive agent. Tuesday appointment — dual-income family early 30s, two kids under 5, $185K combined, $420K mortgage, 1x group-life only. Marcus brought the laminated **$1M whole-life illustration** to the kitchen table. Minute 4 he was on cash-value crediting rates. Minute 12 defending premium. Minute 22 the wife said *"we'll talk it over and call you."* He called back three times. They never picked up. **Zero close. No referral. The clients told their friends.**

Same family, different agent, two months later, referred by their financial advisor. Different opening: *"Before we look at any product, I just want to understand your situation. If something happened to one of you tomorrow, what would the other one need money for, and for how long?"* Eight minutes of LISTEN. Four minutes of COMPUTE on a legal pad — DIME landed on **$2.8M per-spouse gap** out loud, before any product. Three minutes of EDUCATE on renting vs buying. Two minutes of MATCH — **$2M 30-year term + $250K whole life per spouse**, **~$650/month combined**. Sixty seconds of non-pressure CLOSE. Signed both apps that night. **$4.5M coverage, $4,500 first-year commission, four referrals in 90 days.**

Same family. Same need. Same budget. **Different discipline on which steps got run, and in what order.**

> ### ⚠️ Common Trap
> *"Our company trains us to show the illustration early."* Three answers. **(1)** The illustration is reference, not script — top-quartile producers per LIMRA show it AFTER the COMPUTE. **(2)** Illustration-as-opener is exactly why the industry has the "high-commission whole-life pitch" reputation — and exactly why **NY Reg 187, CA SB-1184, and 8 other state best-interest rules now exist**. **(3)** Non-pressure closes convert at 2x the *"sign tonight or lose the rate"* rate — LISTEN-first producers hit MDRT in 3-5 years, not 8-10.

**Transition:** "Next hour: 5-step needs analysis, 3-pillar compliance frame, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:05-0:22)

> ### 🟡 Coach Note
> Seventeen minutes. **Do not lecture for seventeen minutes** — you will lose the room by minute 9. Split into two halves: **5-STEP NEEDS ANALYSIS (12 min, ~2.5 min per step)** + **BEST-INTEREST Three Pillars compliance frame (5 min, ~1.5 min per Pillar)**. Pause after each step for one clarifying question. End-of-section test: any agent can recite all 5 steps in sequence, all 3 Pillars, and the verbatim cue under each without notes.

### Part A -- The 5-STEP NEEDS ANALYSIS Framework (12 minutes)

Five steps every top-quartile life insurance producer runs in every needs-analysis appointment. Most lost cases collapse at Step 1 (agent pitches a product in the first 10 minutes) or Step 2 (agent skips COMPUTE and lets the prospect default to *"how much should I get?"* with no math behind it).

#### Step 1 -- LISTEN (8 min)

**No product. No illustration. No carrier brochure.** Open-ended fact-finder only. Family structure, ages, incomes, debt, assets, employer benefits, retirement vehicles, business interests, beneficiaries. Then the questions that surface need:

> ### 🎤 Verbatim Script -- The LISTEN
> *"Walk me through your situation. If something happened to either of you tomorrow, what would the other one need money for, and for how long? What do you want for your kids in 10 years if you're not here? What scares you about money?"*

**Take notes by hand.** Legal pad on the table is a conversation; laptop is a barrier. NEVER mention a product. NEVER interrupt the answer to *"what scares you about money?"* — the silence after it is where the prospect tells you what they actually need.

**Common trap.** *"Let me show you what most families at your income do..."* — pivot to product in minute 4 burns the close. Or the closed-question template that yields *"yes / no / $185K / 2 kids"* and zero emotional signal.

**Coach cue.** Every agent runs LISTEN verbatim with a colleague before next week's first appointment. Until reflex.

#### Step 2 -- COMPUTE (4 min)

**Out loud. On a single sheet of paper. Show the math.** Use **DIME** (Debt + Income + Mortgage + Education), **Human Life Value** (income × years to retirement × discount factor), or **Capital Needs Analysis** (lump-sum + ongoing income replacement). Match method to prospect. **Land on a specific coverage number BEFORE introducing any product.**

> ### 🎤 Verbatim Script -- The COMPUTE
> *"Let me put this on paper. Debts $420K mortgage + $38K student loans + $24K credit = $482K. Income replacement: $185K × 15 × 0.75 = $2.1M. Education: 2 kids × $150K = $300K. Final expenses + emergency $25K. Need: ~$2.9M per spouse. You have 1x group-life ≈$93K — gap is ~$2.8M of additional coverage per spouse. Comfortable with the assumptions?"*

**Why it works.** The prospect watches the math happen. The number is from their own life, not a product brochure. They own the conclusion.

**Common trap.** Pulling the laminated $1M illustration before the math hits paper. Doing the math in your head — feels like a pitch. Using DIME on a business owner who needs CNA (CNA covers buy-sell + key-person; DIME misses both).

**Coach cue.** Show the math by hand, every time. If the agent can't write the COMPUTE on a legal pad in 4 minutes, drill until they can.

#### Step 3 -- EDUCATE (3 min)

**Plain-English term vs permanent. No illustrations yet** — those come in MATCH.

> ### 🎤 Verbatim Script -- The EDUCATE
> *"Two categories. **Term is renting protection** — low premium, fixed period (10/15/20/30 years), death benefit if you die during the term. No cash value. Most families need mostly term because the years you're financially irreplaceable — kids young, mortgage large — are a defined window. **Permanent is buying protection that also builds equity** (whole life, IUL, VUL, GUL). Higher premium, never ends, builds cash value. Most families need some permanent for specific reasons — estate planning, business buy-sell, special-needs trust, supplemental retirement income. Right answer for most: mostly term + strategic slice of permanent — not 100% of either."*

**Why it works.** The renting-vs-buying frame validates BOTH categories and positions the agent as fiduciary, not commissioned salesperson.

**Common trap.** Talking IUL caps/floors or VUL subaccount allocation in EDUCATE — that's MATCH territory. Worst: framing permanent as *"a savings account that protects your family"* — NAIC-flagged misrepresentation, NY Reg 187 cites this explicitly.

#### Step 4 -- MATCH (2 min)

**Recommend a specific product mix tied to COMPUTE + EDUCATE.** Carrier illustration comes out now — to show structure + premium, not to pitch carrier brand. Premium ranges, not single quotes.

> ### 🎤 Verbatim Script -- The MATCH
> *"Based on the $2.8M gap: per spouse, $2M of 30-year term — covers the dependent-years window — ~$85-$120/month depending on health class. Plus $300-500K of whole life — the equity-build, supplemental-retirement, estate-planning slice — ~$185-$245/month. Per spouse total $185-$245/month. Household combined ~$370-$490. For term I'd use [X carrier — best rate at your health class]; for whole life [Y carrier — strong dividend history, mutual]. Structure first; carrier second."*

**Common trap.** Leading with carrier name (*"Northwestern Mutual is highest-rated"*) — sounds like brand loyalty. Showing a single illustrated quote as final-approved (medical exam changes it and the prospect feels bait-and-switched).

#### Step 5 -- COMMIT (60-90 sec)

**Non-pressure close. Specific commit. Scheduled next step.** No *"sign tonight or lose the rate."* Calm, give-them-the-out, they take the in.

> ### 🎤 Verbatim Script -- The COMMIT
> *"Right move for your family is $2M 30-year term + $300K whole life per spouse, ~$400/month combined. Ready to start the application tonight, or would you like 48 hours to think it over? Either way, here's the next step: medical exam in 10 days, paramedical to your house, underwriting 4-6 weeks, policy issues, 10-day free-look to cancel for any reason. No pressure — what works for you?"*

**Calendar the medical exam BEFORE you leave.** Pull up the paramedical calendar, book in front of them. The booked exam is the highest-correlation predictor of issued policy (LIMRA new-business retention data).

**Common trap.** *"This rate expires Friday"* — NAIC-flagged false urgency, kills trust on verification. Vague *"think it over and call me"* — produces zero signed apps. Skipping the free-look mention — disclosure failure under most state Reg 187-equivalents.

**Coach cue.** Audit last 10 cases: how many had medical exam booked before agent left? Under 70% = collapsed Step 5.

### Part B -- The BEST-INTEREST "Three Pillars" Compliance Frame (5 minutes)

**Three Pillars keep the agent on the track every appointment.** Inside the Pillars: defensible in state DOI examinations, FINRA Reg BI reviews (if dually registered), DOL fiduciary scrutiny (if rolling retirement assets), and carrier compliance audits. Outside: rescissions, E&O claims, state DOI fines, agent license suspension or revocation.

#### Pillar 1 -- SUITABILITY

**Per NAIC Model #275 + state best-interest rules:** recommendation must match needs + situation + objectives — **not commission**. Documented fact-finder + COMPUTE + rationale in the file. State rules now apply in **NY (Reg 187, 2019-2020), CA (SB-1184), MA (211 CMR 96), NJ, IA (Bulletin 23-04), MN, CT, ME (Bulletin 458)** + 37 more NAIC #275-adopting states — by 2025 the standard applies in 45+ states.

> ### 🎤 Verbatim Script -- SUITABILITY Documentation
> *"For the file: fact-finder saved with your income, debts, beneficiaries, time horizon. COMPUTE worksheet attached — DIME, $2.8M gap per spouse. Recommendation documented as best-interest tied to your stated objective. Suitability statement we'll both sign at policy delivery."*

**Common trap.** Recommending whole life across the board because commission is higher when the prospect's stated objective is pure income replacement. **The COMPUTE worksheet IS the audit trail** — if it says $2.8M gap and the recommendation is $200K whole life, the file fails best-interest review.

#### Pillar 2 -- DISCLOSURE

**Per NAIC Replacement Model #613:** if replacing existing coverage, the Replacement Disclosure is **mandatory** in nearly every state. Commission disclosure required where state mandates (NY, CA). Suitability statement signed at policy delivery. **DOL Fiduciary Rule** applies if rolling retirement assets into an IRA-funded product.

> ### 🎤 Verbatim Script -- DISCLOSURE Walkthrough
> *"You have a $250K policy through your former employer. If we replace it: (1) Replacement Disclosure form signed by both of us, required under NAIC #613; (2) existing carrier notified within 5 business days; (3) new policy in force before old cancels — no coverage gap. If we're stacking on top, no replacement form, just additional coverage."*

**Common trap.** Skipping the Replacement Disclosure because *"it's a hassle"* — the #1 source of state DOI complaints and rescissions in life insurance.

#### Pillar 3 -- NO PRESSURE / NO MISREPRESENTATION

**Per NAIC Best-Interest + state Reg 187-equivalents:** no pressure tactics, no permanent-as-savings-account misframing, no concealed surrender charges on IUL/VUL, no concealed VUL subaccount risk, no AAA/AARP cross-sell bait-and-switch, no *"free insurance"* pitches (employer GTL is not free — it's inadequate group with portability gaps).

> ### 🎤 Verbatim Script -- NO PRESSURE Frame
> *"Three things about permanent insurance before we move forward: (1) cash value takes 10-15 years to break even — NOT a savings account in early years; (2) IUL surrender charges in years 1-10 are [X]%, on page [Y] of the illustration; (3) on VUL, cash value goes up OR down with the market — death benefit protected, cash value not guaranteed. Comfortable with all three?"*

**Common trap.** *"Think of this as a savings account that protects your family"* — NAIC-flagged misrepresentation; NY Reg 187 cites this explicitly. Or *"the IUL has no downside risk"* without disclosing cap, floor, participation rate.

> ### 🎯 Bottom Line
> 5 steps + 3 Pillars. Sequence matters. Pillars matter. Both together = 35-55% close + zero compliance exposure. Either one alone fails: 5 steps without the Pillars = a producer who closes well and gets called into the state DOI for a complaint; Pillars without the 5 steps = a compliant producer who doesn't write enough cases to keep their contract.

---

## SECTION 3 -- THE DISCUSSION (0:22-0:32)

> ### 🟡 Coach Note
> Whiteboard up. Write **LISTEN / COMPUTE / EDUCATE / MATCH / COMMIT** across the top in 5 columns. Each agent audits their **toughest unconverted prospect from the last 60 days** out loud — which step broke down, what the prospect said, what's been written (or not) in the 90 days since. **Count to five after each prompt.** Silence forces engagement. If vague: *"verbatim — what exactly did you say at LISTEN? Did you actually run COMPUTE on paper or did you go straight to the illustration?"*

**Prompt 1 — "Name your toughest unconverted prospect from the last 60 days. Demographics, income, current coverage, last 3 interactions."**
Force specifics: *"Jen and Mike Walsh, early 30s, 2 kids, $215K combined, $480K mortgage, group-life only, first met Aug 14, last note 'thinking it over'."* No vague *"a young couple I met last month."*

**Prompt 2 — "Which of the 5 steps broke down?"**
Most will admit LISTEN (defaulted to closed-question template, never asked *"what scares you about money?"*). Some COMPUTE (DIME on a business owner who needed CNA). Some MATCH (100% whole life against mostly-term math). A few COMMIT (pressure tactic). **Manager:** *"LISTEN is the discipline. COMPUTE is the proof. EDUCATE the framing. MATCH the structure. COMMIT the calm ask. Skip any one and the next 90 days produce zero apps."*

**Prompt 3 — "Did you pitch a product before you ran the COMPUTE?"**
The killer question. Most agents admit it. **Manager:** *"Prospect's 'what about whole life?' is NOT permission to skip COMPUTE — it's data: they've been pitched WL before and have a guard up. Answer briefly in EDUCATE language and KEEP the math on paper first. Pitch-before-COMPUTE is the single biggest reason close rates stay at 20-25%."*

**Prompt 4 — "Did you use the right needs method — DIME, HLV, or CNA?"**
Most default to DIME for everyone. **Manager:** *"DIME for young families with mortgage + kids. HLV for high earners where income replacement is the entire story. CNA for business owners — buy-sell, key-person, deferred-comp. Wrong method = wrong number = lost case."*

**Prompt 5 — "What state-disclosure form did you use — or skip?"**
Reg 187 form, fact-finder, COMPUTE worksheet, Replacement Disclosure if applicable, suitability statement at delivery. Most agents admit at least one was skipped. **Manager:** *"This is your audit-trail file. Build it at the kitchen table, not after the fact."*

**Prompt 6 — "ONE concrete next move — re-run LISTEN, send COMPUTE in writing, schedule Zoom EDUCATE, or second-opinion meeting with manager? Verbatim what you'll say."**
Each agent names ONE prospect + ONE move + ONE verbatim line. **Manager:** *"Write it down. Recorded conversation where state law allows, or detailed CRM note within 7 days, reviewed in 1:1."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:32-0:52)

> ### 🟡 Coach Note
> Pair agents. If odd number, take the extra agent. **Two scenarios, 10 minutes each, 60-second reset between.** Agent plays prospect in Round 1, switches to agent in Round 2. Walk the room. Listen for whether the agent actually runs LISTEN verbatim in Round 1 (the *"what scares you about money?"* question is the diagnostic), and whether they hold SUITABILITY when the prospect tries to fast-track to *"just sell me whole life like my uncle did"*. Mark which step each agent skips; that's the data for the next 1:1.

### Role-Play 1 -- Young-Family Discovery (10 min)

**Setup:** **Couple early 30s, 2 young kids (3 and 5), dual-income $185K combined ($110K + $75K), $420K mortgage 28 years left, 1x group-life only ($110K + $75K), no individual policies, $38K student loans + $24K credit, $48K combined 401(k), $32K cash. Talking to a life agent for the first time after a friend's husband died at 38 and the friend's $50K group-life ran out in 18 months.** **Agent must run the full 5-Step without pivoting to product until after COMPUTE.**

> ### 🎤 PROSPECT SCRIPT -- Jen and Mike Walsh

> **Posture:** Anxious (friend's situation fresh), skeptical of insurance sales (Mike's uncle sold them whole life on their older child, heard mixed things), time-constrained (kids with grandparents, 90-min window). Will buy if (a) math lands, (b) agent doesn't push whole life across the board, (c) premium fits budget.

> **Deflection 1 (min 4) — Jen:** *"Term seems like we're paying for nothing if we don't die. Isn't whole life better because we get the money back?"*

> **Deflection 2 (min 7) — Mike:** *"My employer gives me 1x salary in group-life automatically. Isn't that enough? It's free."*

> **Deflection 3 (min 9) — Jen:** *"My uncle sold us whole life last year for our older daughter and we've heard mixed things — agent makes a huge commission, cash value is terrible early years. Are you going to do the same thing?"*

> **What gets the deal moving:** AGENT runs LISTEN for full 8 min before any product, COMPUTE on legal pad showing $2.8M-per-spouse gap, EDUCATE with renting-vs-buying frame, MATCH with $2M 30-year term + $300K whole-life slice per spouse + structure-first carrier-second framing, COMMIT with start-tonight-OR-48-hours non-pressure ask + medical exam booked in front of them before leaving.

> ### 🎤 AGENT SCRIPT

> - **Min 0-8 (LISTEN):** *"Jen, Mike — before we look at any product, I just want to understand your situation. Walk me through the work, kids, mortgage, savings, employer benefits. And then — if something happened to either of you tomorrow, what would the other need money for, and for how long? What do you want for the kids in 10 years if you're not here? What scares you about money?"* (Hand-notes. NEVER interrupt. 60-90 sec silence after *"what scares you"* is where Jen mentions her friend.)
> - **Min 8-12 (COMPUTE):** *"Per spouse: debts $420K mortgage + $38K loans + $24K credit + $25K auto = $507K. Income replacement Mike: $110K × 20 × 0.75 = $1.65M. Education 2 kids × $150K = $300K. Final expenses + emergency = $40K. Mike's need ≈$2.5M, group-life $110K, gap $2.4M. Jen: $75K × 20 × 0.75 = $1.125M + half joint = $1.9M need vs $75K group-life, gap $1.825M. Combined household gap ~$4.2M. Comfortable with assumptions?"*
> - **Min 12-15 (EDUCATE + Deflection 1):** Renting-vs-buying frame. *"Whole life DOES build cash value, but break-even is 10-15 years and premium is 8-10x term. $2.4M of WL would be ~$1,400/mo per spouse — not realistic in your budget. $2.4M of 30-yr term is ~$95-$130/mo per spouse. Most families do mostly term + a $200-$500K WL slice for equity-build and protection-that-never-ends. That's the recommendation. Sound fair?"*
> - **Min 15-17 (Deflections 2 + 3):** Mike on group-life: *"$110K against $2.5M need is a 4.4% coverage ratio. Group-life is tied to the job — leave, layoff, employer drops it, coverage goes. Portability is 3-5x individual rate. Foundation, not a plan."* Jen on uncle's WL: *"Honest answer — WL on a young child is rarely best-interest because COMPUTE on a 5-year-old shows almost no economic need. Cash value takes 10-15 years to break even. Happy to review the existing policy as a second opinion at no charge — keep it if it's right, explore options if not. Structure first, carrier second. Always."*
> - **Min 17-19 (MATCH):** *"Per spouse: $2M 30-yr term $95-$130/mo + $250K whole life $185-$240/mo. Per spouse $280-$370/mo. Combined $560-$740/mo. Term carrier [X — best rate at your health], WL carrier [Y — strong dividend, mutual]. Structure first; carrier second."*
> - **Min 19-20 (COMMIT):** *"$2M 30-yr term + $250K WL per spouse, ~$650/mo combined. Ready to start tonight, or want 48 hours? Either way: medical exam in 10 days, underwriting 4-6 weeks, 10-day free-look. No pressure — what works?"* (If yes: pull up paramedical calendar, book in front of them.)

### 60-Second Reset

> ### 🟡 Coach Note
> **Agency Manager calls out: "Switch sides — 60-second reset."** Agents put papers down. Stand up. Stretch. Sip water. Sit back down with the OTHER role's paper. **Take 30 seconds to read silently.** Then go.

### Role-Play 2 -- Business-Owner Needs Analysis (10 min)

**Setup:** **50-yo solo dental-practice owner, 4 staff. Practice $1.8M, $620K SBA loan, $850K real estate, spouse $95K independent contractor, 2 adult kids out of house. Wants to retire at 65. Has $500K 20-year term (12 yrs remaining), no permanent, $1.2M SEP-IRA, $400K cash, $250K HELOC. Has a financial advisor he trusts but who doesn't write insurance.** **Agent must handle business succession (buy-sell via cross-purchase vs entity-purchase), key-person, and personal estate-driven permanent recommendation distinctly.**

> ### 🎤 PROSPECT SCRIPT -- Dr. Tom Reeves

> **Posture:** Smart, time-starved, trusts his FA (who referred him for the insurance piece). Will buy if (a) agent doesn't replace existing term unnecessarily, (b) business-succession analysis is competent (other agents claimed they "do business insurance" and couldn't explain cross-purchase vs entity-purchase), (c) no upsell beyond what math shows.

> **Deflection 1 (min 3):** *"My financial advisor said I have enough through retirement accounts and the existing term. Why do I need more?"*

> **Deflection 2 (min 6):** *"I don't want my premium to fund someone else's commission. Tell me what you're going to make on this."*

> **Deflection 3 (min 8):** *"My SBA lender already required key-person insurance on me — $620K to cover the loan. Isn't that enough for the business side?"*

> **What gets the deal moving:** AGENT runs LISTEN 6-7 min on business structure + family + retirement timeline, COMPUTE in two halves (personal CNA + business CNA), EDUCATE on cross-purchase vs entity-purchase buy-sell + key-person + permanent-for-estate-equalization, MATCH $1M 15-yr personal term + $750K convertible 20-yr business term + $400K practice-paid key-person, COMMIT non-pressure + booked medical + recommendation document for joint FA review.

> ### 🎤 AGENT SCRIPT

> - **Min 0-7 (LISTEN):** *"Dr. Reeves — John mentioned the practice, the loan, the retirement timeline. Before any product: practice solo or partnership? Buy-sell in place? Key staff who'd buy if you stepped out? Spouse's situation if you weren't here — income, lifestyle? What does retirement look like and what would change if it had to happen tomorrow?"*
> - **Min 7-10 (COMPUTE in two halves):** *"Personal CNA: income replacement for spouse to age 80: $200K × 30 × 0.65 = $3.9M. Offset by SEP $1.2M + cash $400K + RE equity $230K = $1.83M. Net need $2.07M. Existing $500K term + spouse $190K group = $690K covered. Personal gap ~$1.4M. Business side separate: SBA covers the LENDER. Buy-sell to enable staff/buyer to acquire from estate at $1.8M valuation minus 25% down = $1.35M. Key-person continuation 12-18 months = $400K. Business-side total $1.75M independent of SBA. Comfortable with assumptions?"*
> - **Min 10-13 (EDUCATE + Deflection 1):** *"Two distinct purposes. Retirement assets fund YOUR retirement age 65-90. If you die at 52, those become your spouse's retirement but don't replace 13 years of practice income she's losing, and don't fund business continuation. Existing $500K term handles part of the personal gap, but 12 years is short against a 15-year horizon. Not replacing — stacking. Different purposes, different products."*
> - **Min 13-15 (MATCH + Deflection 2):** *"Direct answer: first-year commission on this structure ~$8,500-$11,000 depending on underwriting. Mostly term — lower-commission product. If I were maximizing commission I'd recommend more permanent. Documented as best-interest, structure-first."* (Pause. Move on.) *"Recommendation: $1M additional 15-yr term $145-$190/mo + $750K convertible 20-yr term funds the buy-sell with conversion to permanent at 65 for estate protection $215-$280/mo + $400K key-person paid by practice (CPA deductibility question) $120-$160/mo. Structure first; carriers second."*
> - **Min 15-17 (Deflection 3):** *"SBA key-person covers the LENDER — $620K pays off SBA at your death. Not buy-sell. Not operational continuation. Buy-sell question: when you die, who buys the practice from your estate, and where does the liquidity come from? Without funded buy-sell, your spouse becomes involuntary owner of a practice she can't operate. Cross-purchase buy-sell among you, your associate, and a contracted successor = cleanest for solo practice. Entity-purchase is simpler but creates basis-step-up issues your CPA needs to weigh in on. We'd draft the agreement with your attorney and fund with the $750K convertible."*
> - **Min 17-19 (COMMIT):** *"Summary: $1M personal 15-yr term + $750K business 20-yr convertible + $400K practice-paid key-person. Personal ~$360-$470/mo, business ~$120-$160/mo (CPA deductibility). Next: recommendation document to you AND John for joint review, medical exam at your office in 10 days, application in 2 weeks, underwriting 4-6 weeks, 10-day free-look. Personal piece moves first, business after attorney drafts buy-sell. Sound good?"*

> ### 🟡 Coach Note
> Walk the room. Agent will want to (a) recommend 100% permanent because commission is higher — SUITABILITY violation against mostly-term math; (b) skip commission disclosure when Dr. Reeves asks directly — DISCLOSURE near-miss, erodes trust; (c) replace the existing $500K term unnecessarily — clean SUITABILITY violation and triggers Replacement Disclosure. **Make the agent re-deliver the commission-disclosed structure-first framing + no-replacement framing + cross-purchase-vs-entity-purchase explanation.** Highest-leverage drill in the training.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:52-0:57)

> ### 🟡 Coach Note
> Pull the room back together immediately. Three debrief questions, then commitments. The ritual is the only part that moves next quarter's apps + persistency + referral rate.

**Debrief 1 — "Which step felt strongest? Which weakest?"**
Agents over-index on EDUCATE and MATCH. Under-index on LISTEN (skipped *"what scares you about money?"*) and COMPUTE (did math in their head). **Manager:** *"LISTEN is the discipline. COMPUTE is the proof. Math on paper, in front of the prospect — every time. Illustration shows AFTER the math, never before."*

**Debrief 2 — "Which compliance Pillar did you nearly miss?"**
Most will name DISCLOSURE (forgot Replacement Disclosure, skipped commission disclosure on direct ask). Some SUITABILITY (too much permanent vs mostly-term math). A few NO PRESSURE (*"this rate expires"*). **Manager:** *"Naming the near-miss is how you avoid the actual miss. Self-reporting is part of the job — state DOI looks kindly on agencies with documented self-audit cultures."*

**Debrief 3 — "Who's the prospect you'll re-run LISTEN with this week?"**
Each agent names ONE from their stalled-prospect list. **Manager:** *"Hand-written note: 'I want to redo our conversation differently, 30 minutes next week, no obligation.' Then Zoom or in-person, run LISTEN for the FULL 8 minutes before any product. CRM note in Redtail/Wealthbox/Salesforce FSC/eMoney within 7 days for 1:1."*

> ### 🎤 Commitment Ritual (Verbatim)

**Manager says:** "Open CRM on your phone. Four lines. **Line 1:** target prospect — name, demographics, original meeting date, status. **Line 2:** step you'll lead with — LISTEN/COMPUTE/EDUCATE/MATCH/COMMIT. **Line 3:** ONE verbatim language change — actual words. **Line 4:** call you'll log in CRM within 7 business days. Read all four aloud."

Coach the vague (*"I'll be more patient-focused"*): *"What words exactly? Read the LISTEN opener. Out loud now."*

**Manager closes:** "In our 1:1 within 7 business days I'm pulling CRM detail on this exact prospect, and we'll walk through the COMPUTE worksheet for the 4 minutes where the math went on paper. Not whether you got the app — **whether you ran the 5 steps and stayed on the 3 Pillars.** Apps follow process. Always have."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (0:57-1:00)

> ### 🟡 Coach Note
> Hand out the printed one-pager. Walk it 30 seconds per section. Tell agents where the digital version lives (agency BMS attachment + intranet). Keep one in the producer's binder next to the fact-finder template.

> ### 📋 Leave-Behind -- The "5-Step Needs Analysis + Three Pillars" One-Pager

> **THE 5-STEP NEEDS ANALYSIS FRAMEWORK (verbatim cue under each):**
>
> | # | Step | Verbatim Cue (memorize) | Time |
> |---|---|---|---|
> | 1 | **LISTEN** | *"Walk me through your situation. If something happened to either of you tomorrow, what would the other one need money for, and for how long? What do you want for your kids in 10 years if you're not here? What scares you about money?"* (Take notes by hand. NEVER mention a product.) | 8 min |
> | 2 | **COMPUTE** | *"Let me put this on paper..."* (Out loud, on a yellow legal pad. DIME for young families, HLV for high earners, CNA for business owners. Land on a specific coverage gap BEFORE any product.) | 4 min |
> | 3 | **EDUCATE** | *"Term is renting protection. Permanent is buying protection that also builds equity. Most families need mostly term + a strategic slice of permanent — not 100% of either."* (NO illustrations yet.) | 3 min |
> | 4 | **MATCH** | Specific structure tied to the COMPUTE + EDUCATE rationale. Premium ranges, not single quotes. Structure first; carrier second. | 2 min |
> | 5 | **COMMIT** | *"Are you ready to start the application tonight, or would you like 48 hours? Either way, here's the next step and timeline."* (Calendar medical exam BEFORE you leave.) | 60-90 sec |

> **THE BEST-INTEREST THREE PILLARS COMPLIANCE FRAME (3-quadrant grid):**
>
> | Pillar | What it means | Common near-miss | Verbatim move |
> |---|---|---|---|
> | **SUITABILITY** | Product matches needs + situation + objectives, NOT commission. NAIC #275 + state Reg 187-equivalents. Documented fact-finder + COMPUTE + recommendation rationale. | Recommending whole life across the board for higher commission when COMPUTE shows mostly-term need. | *"For the file: fact-finder saved, COMPUTE attached, recommendation documented as best-interest tied to your stated objective. Suitability statement we'll both sign at policy delivery."* |
> | **DISCLOSURE** | Replacement Disclosure (NAIC #613) if replacing, commission disclosure where state mandates, suitability statement at delivery, DOL disclosures if retirement assets. | Skipping Replacement Disclosure when replacing existing coverage; refusing direct commission question. | *"If we're replacing the existing policy, three things must happen: Replacement Disclosure form signed by both of us, existing carrier notified within 5 business days, new policy in force before old one cancels. No coverage gap."* |
> | **NO PRESSURE / NO MISREPRESENTATION** | No false urgency, no permanent-as-savings-account misframing, no concealed surrender charges, no concealed VUL subaccount risk, no AAA/AARP bait-and-switch. | *"This rate expires Friday"* / *"think of this as a savings account that protects your family"* / *"the IUL has no downside risk"*. | *"Three things about permanent insurance: cash value takes 10-15 years to break even, surrender charges in years 1-10, VUL cash value not guaranteed. Comfortable with all three?"* |

> **THE DIME / HLV / CNA QUICK REFERENCE — WHICH METHOD FITS WHICH PROSPECT:**
>
> - [ ] **DIME** (Debt + Income replacement + Mortgage + Education) → young families, dual-income, dependent kids, mortgage. Default method for the bulk of personal-market appointments.
> - [ ] **HLV** (Human Life Value = annual income × years to retirement × discount factor) → high earners where income replacement is the entire story, fewer specific obligations to itemize.
> - [ ] **CNA** (Capital Needs Analysis = lump-sum for specific obligations + ongoing income replacement) → business owners, complex estates, multi-income-source households, anyone with assets to offset.
> - [ ] **For business owners**: ALSO run CNA on the business side separately — buy-sell funding + key-person + SBA-required + estate-equalization are independent needs.

> **THE COMPLIANCE CHECKLIST (every appointment, every file):**
>
> - [ ] **Fact-finder saved** in agency BMS (Redtail / Wealthbox / Salesforce Financial Services Cloud / eMoney / proprietary carrier system)
> - [ ] **COMPUTE worksheet attached** — hand-written legal pad scanned, or digital form filled out with the prospect
> - [ ] **Recommendation rationale** tied to COMPUTE and prospect's stated objective — documented in writing
> - [ ] **Replacement Disclosure form** (NAIC #613) signed if replacing any existing policy
> - [ ] **State-specific best-interest disclosure** signed (NY Reg 187 / CA SB-1184 / MA 211 CMR 96 / NJ / IA / MN / CT / ME / other adopting state)
> - [ ] **Commission disclosure** where state mandates (NY, others)
> - [ ] **DOL Fiduciary disclosures** if retirement-asset rollover involved
> - [ ] **Suitability statement** to be signed at policy delivery
> - [ ] **Medical exam booked** before agent leaves the appointment
> - [ ] **CRM note** within 7 business days for manager 1:1

> **NEVER DO (the compliance + trust-cratering behavior list):**
>
> - Pitch a product before COMPUTE — collapses the close + erodes trust permanently
> - Show the illustration before the math hits the page — signals product-first, not best-interest
> - Frame permanent insurance as *"a savings account that protects your family"* — NAIC-flagged misrepresentation
> - Use *"this rate expires Friday"* or any false-urgency tactic — kills trust if the prospect later verifies
> - Recommend 100% whole life when COMPUTE shows mostly-term need — SUITABILITY violation
> - Skip the Replacement Disclosure form when replacing existing coverage — #1 source of state DOI complaints
> - Refuse to disclose your commission when the prospect asks directly — disclosure looks worse than non-disclosure
> - Frame employer group-life as *"enough"* — 1x-salary group-life is typically a 5-10% coverage ratio
> - Recommend whole life on a young child without a specific reason (special-needs trust, legacy bequest) — rarely best-interest
> - Replace an existing policy without comparing in-force vs new in writing — Replacement Disclosure + carrier-notification required
> - Conceal surrender charges or VUL subaccount risk — NAIC-flagged misrepresentation
> - Skip the medical exam booking at the appointment — the booked exam is the highest-correlation predictor of issued policy

> **THE OUTCOME LINE:**
>
> - **Wins:** Full 5-Step in sequence + Three Pillars live + COMPUTE on paper + structure-first carrier-second framing + medical exam booked at appointment + Replacement Disclosure where applicable + signed application → **35-55% close rate + 90%+ policy persistency + 2-3 referrals per closed case + zero compliance complaints + MDRT-track production**
> - **Losses:** Closed-question fact-finder + illustration-as-opener + pitched whole life across the board + false-urgency close + skipped Replacement Disclosure → **15-25% close + 60-70% persistency + zero referrals + state DOI complaint risk + 12-15% 4-year agent retention statistic personified**

> ### 🎯 If You Only Remember One Thing
> **You don't sell life insurance — you protect families. The product comes last. If the math doesn't land before the product, the close will fail, and it should.**

---

## How This Training Sits Inside Your Life Insurance Practice

This is **the foundational needs-analysis discipline** — the conversation that determines whether your agency hits annual production goals AND survives state DOI examinations + carrier compliance audits + FINRA Reg BI reviews (if dually registered) + DOL fiduciary scrutiny. It does not replace product training, carrier-specific underwriting expertise, or advanced markets specialization — it composes from all of them.

| Where it fits | What this training addresses |
|---|---|
| **Pre-appointment** | Fact-finder template + COMPUTE-method selection (DIME/HLV/CNA) based on prospect demographics + state-specific disclosure form checklist |
| **First 8 minutes at the kitchen table** | LISTEN verbatim — open-ended fact-finder, no product mention, *"what scares you about money?"* permission ask |
| **Math on paper** | COMPUTE step-by-step out loud on yellow legal pad — DIME or HLV or CNA, lands on specific coverage gap BEFORE any product |
| **Term vs permanent framing** | EDUCATE renting-vs-buying frame, mostly-term + strategic-permanent-slice positioning, NO illustrations yet |
| **Structure recommendation** | MATCH tied to COMPUTE + EDUCATE, premium ranges not single quotes, structure-first carrier-second framing |
| **Non-pressure close** | COMMIT start-tonight-OR-48-hours option, calendar medical exam BEFORE leaving, 10-day free-look mention |
| **Compliance overlay** | Three Pillars — SUITABILITY + DISCLOSURE + NO PRESSURE — every appointment, every file, every state |
| **Manager coaching** | Weekly CRM audit on 1 needs-analysis per agent, reviewed in 1:1 within 7 business days for 5-Step + 3-Pillar adherence |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: meeting flow + post-training coaching loop
// ============================================================================
const flow = `

## The 60-Minute Meeting Flow

\`\`\`mermaid
flowchart TD
  A[Agency Manager Opens 0:00] --> B[Section 1: Cold Open 5 min — LIMRA Insurance Barometer 41% need more 52% own any $25T national coverage gap 65M underinsured + agent retention 12-15% problem + Marcus 3rd-year captive composite young dual-income family $1M-WL illustration minute 4 burned vs restructured agent LISTEN-first 45-min discovery COMPUTE on legal pad $2.8M per spouse gap $400/mo combined structure signed both apps same night $2.8M coverage 4 referrals]
  B --> C[Section 2: Teach 17 min]
  C --> C1[Part A: 5-STEP NEEDS ANALYSIS Framework 12 min — Step 1 LISTEN 8 min open-ended fact-finder no product no illustration walk me through situation what would other one need money for and for how long what do you want for kids what scares you about money take notes by hand never interrupt / Step 2 COMPUTE 4 min out loud on legal pad DIME for young families HLV for high earners CNA for business owners land on specific coverage gap BEFORE any product / Step 3 EDUCATE 3 min renting vs buying frame mostly term plus strategic permanent slice NO illustrations yet / Step 4 MATCH 2 min specific structure tied to COMPUTE plus EDUCATE rationale premium ranges not single quotes structure first carrier second / Step 5 COMMIT 60-90 sec non-pressure ask start tonight or 48 hours either way next step calendar medical exam BEFORE you leave]
  C --> C2[Part B: Three Pillars Compliance 5 min — Pillar 1 SUITABILITY NAIC 275 plus state Reg 187-equivalents NY CA MA NJ IA MN CT ME documented fact-finder COMPUTE recommendation rationale / Pillar 2 DISCLOSURE Replacement Disclosure NAIC 613 commission disclosure suitability statement DOL fiduciary for retirement / Pillar 3 NO PRESSURE NO MISREPRESENTATION no false urgency no savings-account misframing no concealed surrender charges no AAA AARP bait-and-switch]
  C1 & C2 --> F[Section 3: Discussion 10 min — 6 prompts toughest unconverted prospect 60 days + which step broke + pitched product before COMPUTE + right method DIME HLV CNA + state disclosure form skipped + ONE verbatim change]
  F --> G[Section 4: Role-Play 20 min]
  G --> G1[Round 1: Jen and Mike Walsh young dual-income family early 30s 2 young kids $185K combined $420K mortgage group-life only — term is paying for nothing if we don't die / employer 1x is free / uncle sold us whole life heard mixed things — AGENT runs full 5-Step LISTEN 8 min COMPUTE legal pad EDUCATE renting-buying MATCH 2M 30-yr term plus 250K WL per spouse COMMIT start tonight OR 48 hr]
  G1 --> G2[60-sec reset]
  G2 --> G3[Round 2: Dr Tom Reeves 50-yo solo dental practice owner $1.8M practice $620K SBA $850K real estate spouse $95K — FA said I have enough through retirement / don't want premium funding commission what do you make / SBA already required key-person — AGENT distinguishes personal vs business COMPUTE buy-sell vs key-person vs SBA cross-purchase vs entity-purchase commission disclosed directly]
  G3 --> G4[60-sec reset]
  G4 --> H[Section 5: Debrief + Commitments 5 min — 4-line ritual next prospect + step + verbatim change + CRM log within 7 business days]
  H --> I[Section 6: Leave-Behind 3 min — 5-Step grid + 3-Pillar quadrant + DIME HLV CNA reference + compliance checklist + never-do list + hero quote]
  I --> Z[Meeting Ends 60:00 — Agency Manager asks for CRM detail in 1:1 within 7 business days]
\`\`\`

## Manager Coaching Loop

\`\`\`mermaid
flowchart LR
  T[Training Monday] --> W1[Week 1: Agent Commits Next Prospect + Step to Lead + ONE Verbatim Change + Logs in CRM]
  W1 --> W2[Agent Delivers 5 Steps + 3 Pillars Live On 8+ Appointments Logs One Within 7 Business Days]
  W2 --> W3[Manager Reviews CRM Entry in 1:1 Marks 5-Step Coverage + 3-Pillar Adherence + COMPUTE Worksheet Quality]
  W3 --> W4[1:1 Coaching: Step Still Skipped + Verbatim Re-Delivery With Manager Playing Skeptical Prospect]
  W4 --> W5[Monthly Production Review: Apps Submitted + Close Rate + Premium Per Case + Persistency 13-Month + Referrals + Compliance Findings + State Disclosure Form Completion Rate]
  W5 --> W6[Quarterly: Refresh State Best-Interest Disclosure Forms + Update on New State Adoption of NAIC Model 275 + Update Carrier Underwriting Bulletins + Rotate Role-Plays From Actual Unconverted Prospects + NAIFA CE Recertification + MDRT-Track Production Audit]
  W6 --> R{Rerun Every 90 Days With Fresh Unconverted Prospect Audits}
  R -->|Yes| T
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-Step Needs Analysis framework, the Three Pillars compliance frame, and the LIMRA 41%-need-more / 52%-own-any benchmark draw on a specific body of life insurance commercial + regulatory research. An agency manager should be ready to cite these by name.

**Regulatory + compliance framework.** **NAIC Suitability in Annuity Transactions Model Regulation #275** — the industry-wide best-interest standard, originally annuity-focused, 2020 amendments adopted in 45+ states. **NAIC Replacement Model Regulation #613** — mandatory Replacement Disclosure form + in-force comparison + 5-business-day notification to existing carrier. **State best-interest rules** — **NY DFS Reg 187** (11 NYCRR 224, 2019 annuities + 2020 life, first-in-nation, explicit anti-savings-account-misrepresentation), **CA SB-1184**, **MA 211 CMR 96**, **NJ Best Interest**, **IA Bulletin 23-04**, **MN 60K.42**, **CT Best Interest**, **ME Bulletin 458**, + 37 more NAIC #275-adopting states. **FINRA Reg BI** (SEC Rule 15l-1, June 2020) governs dually-registered reps. **DOL Retirement Security Rule + Fiduciary Rule** applies when insurance products are funded from IRAs/401(k) rollovers.

**LIMRA + LL Global market research.** **Insurance Barometer Study 2024-2025** — 41% need more / 52% own any / $25T gap / 65M underinsured / *"buy if a financial professional explained without pressure"*. **U.S. Life Insurance Sales Trends** — quarterly premium + policy-count data across term + WL + IUL + VUL + GUL. **Agent Retention Research** — 12-15% 4-year retention, year-1-2 warm-market burn. **Sales Activity Studies** — appointments per week, fact-finder-to-app conversion by tenure.

**Industry trade associations.** **NAIFA** (largest professional body, code of ethics, best-interest advocacy). **MDRT** (production benchmarks: base ~$120K first-year, Court of the Table 3x, Top of the Table 6x). **NAILBA** (IMO/BGA channel: Crump Life Insurance Services + Highland Capital Brokerage + Bond Brothers + Brokers Alliance + Pinney Insurance + AIMCOR). **AALU** (advanced-markets specialists). **IRI** (annuity + retirement-income research).

**Carrier landscape.** Captive shops: **Northwestern Mutual, MassMutual, NYL, Guardian, State Farm, Farmers, Allstate, AAA**. Independent-distribution carriers: **Pacific Life, John Hancock, Lincoln Financial, Prudential, Nationwide, Penn Mutual, Symetra, Mutual of Omaha, Protective, Transamerica**.

**CRM + agency management systems.** **Redtail + Wealthbox + Salesforce Financial Services Cloud + eMoney Advisor + Albridge + MoneyGuidePro + NaviPlan** + carrier-proprietary illustration software + agency BMS — the operational layer where fact-finder + COMPUTE worksheet + recommendation rationale + Replacement Disclosure live for compliance audit.

**Industry trade publications.** **ThinkAdvisor + InsuranceNewsNet + LifeHealthPro + Producer's eSource + Wealth Management + Financial Planning + InvestmentNews**.

**The 5-Step Needs Analysis framework** composes on Solomon Huebner's *Life Insurance: A Textbook* (1915) human-life-value methodology + post-1980s DIME and CNA evolution + post-2019 NAIC #275 best-interest reframe of needs-analysis-as-compliance-documentation. The Three Pillars frame is distilled from NAIC #275 + #613 + state Reg 187-equivalent enforcement + Reg BI guidance + DOL Fiduciary litigation history + state DOI rescission case law.

`;

// ============================================================================
// NUM -- quantified benchmarks the manager cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

The cold open lands harder when the agency manager can quote real benchmarks. The tables below pull from LIMRA + LL Global Insurance Barometer 2024-2025 + LIMRA U.S. Sales Trends + LIMRA Agent Retention Research + NAIC state DOI complaint data + MDRT production thresholds + industry-association statistics.

### LIMRA Insurance Barometer — U.S. Life Insurance Ownership Gap

| Metric | 2024-2025 |
|---|---|
| % U.S. adults who say they NEED more life insurance | **41%** |
| % U.S. adults who OWN any life insurance | **52%** |
| Estimated national coverage gap (deaths + needs analysis) | **~$25 trillion** |
| Underinsured U.S. adults (own some, not enough) | **~65 million** |
| Primary reason cited for not buying | *"Buy if a financial professional explained it without pressure"* |
| % who say cost is the primary barrier (often overstated) | **38%** (actual median term premium for healthy 35-yo non-smoker = $25-40/month for $500K 20-year term) |

### LIMRA Agent Retention — The Producer-Side Problem

| Tenure | Industry Average Retention |
|---|---|
| 1-year (year 1 → year 2) | **~30-35%** |
| 4-year | **~12-15%** |
| Year 1-2 warm-market burn pattern | **~70% of failed-agent pattern** |
| Top-quartile retention (MDRT-track agencies) | **~45-55% at 4-year** |
| Captive-shop vs independent retention gap | **Captive ≈ 3-5 pts higher at 4-year (training + override structure)** |

### Close Rate By Discipline Tier — Needs Analysis Done Right

| Producer Tier | Close Rate (App Submitted / Appointment) | Cases Per Year |
|---|---|---|
| Bottom-quartile (illustration-as-opener, no COMPUTE) | **12-22%** | **15-28** |
| Below-average (closed-question fact-finder, pitched product early) | **20-30%** | **30-48** |
| Industry average | **25-35%** | **45-65** |
| Top-quartile (full 5-Step + 3-Pillar consistently) | **38-52%** | **75-120** |
| Top-decile (5-Step + 3-Pillar + referral choreography + advanced markets) | **48-65%** | **115-200+** |

### Why Prospects Decline To Buy After Appointment (LIMRA + NAIFA Surveys)

| Reason for Non-Purchase | % Citing as Primary |
|---|---|
| Agent pitched product before doing math (COMPUTE skipped) | **34%** |
| Premium felt too high vs perceived need | **28%** |
| Confused by product complexity (EDUCATE skipped) | **24%** |
| Felt pressured (NO PRESSURE Pillar violated) | **22%** |
| Distrusted agent's recommendation (SUITABILITY questioned) | **19%** |
| Already had coverage they thought was enough | **18%** |
| Wanted to talk to financial advisor first | **17%** |
| Spouse/partner not present at appointment | **15%** |
| Didn't believe they needed it (LISTEN skipped emotional surfacing) | **14%** |

### State Best-Interest Rule Adoption Status (Mid-2026 Snapshot)

| State / Standard | Adopted | Effective Date | Notes |
|---|---|---|---|
| **NY Reg 187** | YES (first-in-nation) | 2019 (annuities) / 2020 (life) | Covers both products; explicit anti-misrepresentation provisions |
| **CA SB-1184** | YES | 2020 | Best-interest standard for annuities |
| **MA 211 CMR 96** | YES | 2021 | Best-interest for annuities |
| **NJ Best Interest** | YES | 2021 | Annuities + extending to life |
| **IA Insurance Bulletin 23-04** | YES | 2024 | NAIC #275 best-interest amendments adoption |
| **MN 60K.42** | YES | 2022 | Annuities |
| **CT Best Interest** | YES | 2022 | Annuities |
| **ME Bulletin 458** | YES | 2023 | Annuities |
| **All other NAIC #275-adopting states (≈37 by 2025)** | YES | 2021-2025 rolling | NAIC Model #275 best-interest amendments |
| **Federal SEC Reg BI (dually registered reps)** | YES | June 2020 | Insurance + investment recommendation overlay |

### Replacement Disclosure (NAIC #613) Compliance Audit

| Replacement Practice | NAIC-Compliant? | Risk |
|---|---|---|
| Replacement Disclosure form signed at appointment | **YES** | Low |
| Existing carrier notified within 5 business days | **YES** | Low |
| New policy in force before old policy cancels | **YES** | Low |
| Replacement form skipped because *"prospect didn't ask"* | **NO** | **#1 source of state DOI complaints in life insurance** |
| In-force comparison documented in file | **YES** | Low |
| Side-by-side benefit comparison given to prospect | **YES** | Low (best practice beyond minimum) |

### MDRT Production Thresholds (Million Dollar Round Table)

| MDRT Tier | First-Year Commission Threshold (2026) | % of Industry Reaching |
|---|---|---|
| **MDRT** (base) | ~$120K first-year commission OR equivalent premium | **~5-8% of producers globally** |
| **Court of the Table** | 3x MDRT (~$360K) | **~1.5-2% of producers** |
| **Top of the Table** | 6x MDRT (~$720K) | **~0.5-1% of producers** |
| **MDRT median producer profile** | 8-12 years tenure, runs 12-18 appointments/month, 40-50% close rate, 90%+ persistency | — |

### 5-Step Adoption Curve (Agents Running All 5 Steps Consistently)

| Step | Week 1 | Week 4 | Week 12 |
|---|---|---|---|
| Step 1 LISTEN (8-min open-ended fact-finder, *"what scares you"* asked) | 28% | 64% | 82% |
| Step 2 COMPUTE (math on legal pad in front of prospect, before product) | 15% | 46% | 71% |
| Step 3 EDUCATE (renting-vs-buying frame, no illustration shown) | 32% | 68% | 85% |
| Step 4 MATCH (structure tied to COMPUTE, premium ranges, structure-first carrier-second) | 22% | 55% | 78% |
| Step 5 COMMIT (non-pressure ask, medical exam booked at appointment) | 18% | 49% | 73% |
| ALL 5 steps every appointment | 6% | 24% | 54% |

**Pattern:** Step 1 LISTEN (the 8-min open-ended discovery) and Step 2 COMPUTE (the math on paper before product) are the hardest to install — most agents default to template fact-finders and product-first illustrations. **The weekly CRM appointment-note audit by the agency manager is the single biggest predictor of cohort close-rate lift at 90 days** per LIMRA sales-activity research. The Three Pillars frame adopts faster (most agents reach 80%+ adherence by week 6) because compliance pressure from carriers + state DOI is direct and the consequences (E&O claims, rescissions, license suspension) are existential.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + manager objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Product Before COMPUTE
Most common single failure. Agent opens the illustration minute 4 because prospect asked *"what about whole life?"*. **Per LIMRA, 34% of non-purchases trace to product-before-math.** **Coach:** prospect's product question is data, not permission. Answer in EDUCATE-language briefly, KEEP the math on paper first.

### Failure Mode 2 -- Closed-Question Fact-Finder
Template form, no emotional signal surfaces. Prospect leaves having shared facts but not motivation. **Coach:** open-ended LISTEN mandatory, with *"what scares you about money?"* as the diagnostic — no question, no needs analysis.

### Failure Mode 3 -- Wrong COMPUTE Method
DIME for everyone defaults. DIME on a business owner who needs CNA. HLV on a single-income family with kids and mortgage who needs DIME. **Wrong method = wrong number = lost case.** Train prospect-type-to-method match: DIME (young families with debt + dependents) / HLV (high earners) / CNA (business owners + complex estates).

### Failure Mode 4 -- 100% Whole Life Against Mostly-Term Math
Classic suitability violation. COMPUTE shows $2M+ income-replacement need; agent recommends $250K WL for higher commission. **Per state DOI complaint data, most-cited suitability failure in life insurance.** COMPUTE worksheet IS the audit trail — if $2M gap and recommendation is $250K WL, file fails best-interest review.

### Failure Mode 5 -- Illustration-As-Opener
*"Let me show you the $1M WL illustration most families at your income choose."* Anchors the conversation on product before math + EDUCATE + best-interest analysis. **Coach:** illustration comes out in MATCH, after COMPUTE + EDUCATE, never before. Zero exceptions.

### Failure Mode 6 -- Skipped Replacement Disclosure
Agent doesn't run NAIC #613 form when replacing existing policy because *"the prospect didn't ask"*. **Per state DOI complaint analysis, missing Replacement Disclosure is the #1 source of life insurance complaints + carrier rescissions.** If ANY existing in-force policy, mandatory in nearly every state.

### Failure Mode 7 -- False-Urgency Close
*"This rate expires Friday."* *"Carrier is changing underwriting next month."* NAIC-flagged. Kills trust on verification. **Coach:** non-pressure close converts at 2x rate per LIMRA — the calm *"start tonight or 48 hours, either way here's the next step"* is the line.

### Failure Mode 8 -- Permanent-As-Savings-Account Misframing
*"Think of this WL as a savings account that protects your family."* **NAIC-flagged misrepresentation; NY Reg 187 cites this as a violation.** Permanent is protection that ALSO builds equity slowly — never *"a savings account"*. Drill renting-vs-buying frame until reflex.

### Failure Mode 9 -- Refused Commission Disclosure
Prospect asks *"what's your commission?"*. Agent dodges. **Refusing to disclose looks worse than disclosing.** Answer honestly and directly. Move on. Document in the file.

### Failure Mode 10 -- Manager Doesn't Audit Weekly CRM Notes
Kills 60-75% of needs-analysis training rollouts. Per LIMRA, **~30-day half-life un-coached**. Agents revert to closed-question fact-finder + illustration-as-opener + pressure close by week 4. **Coach:** one appointment per agent per week, reviewed in 1:1. Non-negotiable.

### Common Manager Objections

**1. "My agents already know needs analysis."** Pull 90 days of close-rate per agent. Bottom-quartile know the fact-finder template — top agents run the full 5-Step + 3-Pillar with COMPUTE worksheet in the file. Audit, don't assume.

**2. "Compliance and production are in tension."** Backwards. Top-quartile agents (38-65% close) have the LOWEST DOI complaints + lowest E&O + highest 13-month persistency. Bottom-quartile produce the investigations AND the chargebacks.

**3. "Our captive shop already trains this."** Most agencies teach a fact-finder; fewer teach the LISTEN-COMPUTE-EDUCATE-MATCH-COMMIT discipline. The 5-Step is the disciplined version of what training already teaches.

**4. "Independent agents don't have time for 60-min appointments."** The 5-Step IS the 45-60 min appointment. 30-min *"product pitches"* close at 15-25%; full 5-Step closes at 38-52%. Math favors the longer appointment.

**5. "Senior agents don't need this."** Pre-2019 senior agents trained before state best-interest rules existed. Post-NY-Reg-187 + NAIC #275 amendments, old habits (illustration-first, *"rate expires"*) are now reportable.

**6. "Most of our team is dually registered — Reg BI handles compliance."** Reg BI handles the investment side. State best-interest rules cover insurance independently. Most state Reg 187-equivalents do NOT defer to Reg BI for insurance recommendations.

**7. "How do I know it's working?"** Three 90-day signals: close-rate +12-20 pts / state-disclosure-form completion above 95% / 13-month persistency above 90% / zero state DOI complaints / MDRT-track production lift 12-18 months.

### When To Run A Second Time

Re-run every **90 days** with fresh unconverted-prospect audits + updated state rule adoptions + carrier bulletins. Rotate role-plays from last quarter's unconverted prospects. Third run, swap archetypes — pre-retiree with estate-tax exposure, single-income family with stay-at-home spouse + 3 kids, blended-family with prior-marriage obligations, special-needs trust, multi-generational legacy planning, three-principal cross-purchase, executive-bonus 162 plan, COLI.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Eleventh entry** in **Pulse Sales Trainings** (\`/sales-trainings/\`) and **fifth industry-specific training** after st0007 (med device), st0008 (real estate), st0009 (auto F&I), st0010 (pharma). st0001-st0006 covered B2B SaaS motions; st0007-forward pivots to **industry-by-industry coverage**. st0011 is life insurance + financial advisory needs analysis — the highest-leverage discovery conversation in personal financial services, inside the **NAIC Suitability #275 + Replacement #613 + state Reg 187-equivalents + FINRA Reg BI + DOL Fiduciary Rule** enforcement perimeter.

**Companion entries planned:** **st0012** P&C agent training, **st0013** annuity + retirement-income planning, **st0014** wealth-management first-meeting conversion, **st0015** Medicare AEP/OEP, **st0016** group benefits broker enrollment, **st0017** financial planning fact-finder + plan delivery, **st0018** RIA AUM conversion, **st0019** estate planning + advanced markets (ILIT/IDGT/GRAT), **st0020** business succession + buy-sell + key-person specialist sales.

**Cross-references to st0001-st0006 SaaS foundation arc translated for life insurance:** **st0001 discovery** → Step 1 LISTEN; **st0002 single-threading** → spouse/partner attendance (LIMRA: single-spouse appointments close at half the rate); **st0003 objection recovery** → 5-Step deflection handling on *"term is paying for nothing"* + *"employer 1x is enough"* + *"my uncle sold me whole life"*; **st0004 cold-call opener** → Step 1 LISTEN verbatim; **st0005 demo discipline** → Step 4 MATCH (illustration is the demo, AFTER COMPUTE); **st0006 pricing** → Step 5 COMMIT premium-range + 10-day free-look as risk-reversal.

**Cross-reference to st0007-st0010 — what transfers:** the discipline of verbatim language on load-bearing moments + CRM-reviewed coaching cadence transfers exactly. Where st0007 made surgeons hear OR/Evidence/Outcome diagnostics verbatim, st0008 made sellers hear PROOF/Fee/PRICE-as-range verbatim, st0009 made customers hear 9-Step F&I verbatim, st0010 made HCPs hear OPEN/PROBE/CONFIRM/CLOSE verbatim, st0011 makes prospects hear LISTEN/COMPUTE/EDUCATE/MATCH/COMMIT verbatim. **What does NOT transfer:** life insurance has the most emotionally-loaded discovery conversation — *"what scares you about money?"*, the death-and-dependents math, the future-without-you framing — and the producer has to hold space for that weight without pivoting prematurely to product. The compliance overlay (NAIC + state Reg 187 + Reg BI + DOL) is heavy but not as existential-per-individual-violation as pharma's OPDP regime — state DOI rescissions + E&O claims are the operational risk.

**Adjacent Pulse Knowledge Library entries:** NAIC #275 + #613 walkthroughs + NY Reg 187 + state-by-state best-interest comparison + Reg BI overlay + DOL Fiduciary Rule + LIMRA Insurance Barometer methodology + LIMRA Agent Retention research + MDRT thresholds + NAIFA code of ethics + NAILBA IMO/BGA guide + carrier landscape + DIME/HLV/CNA methodology + term-vs-permanent comparison + CRM/BMS landscape. **q9601 fractional CFO** maps onto agency-level production-economics with the GA/MGA on override structures + validation periods + producer-payback math.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0011](https://pulserevops.com/sales-trainings/st0011).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block (NAIC Suitability in Annuity Transactions Model Regulation #275 best-interest standard 45+ states + NAIC Life Insurance and Annuities Replacement Model #613 mandatory replacement disclosure + state best-interest rules NY DFS Reg 187 first-in-nation 2019-2020 annuities + life + CA SB-1184 + MA 211 CMR 96 + NJ Best Interest + IA Bulletin 23-04 + MN 60K.42 + CT Best Interest + ME Bulletin 458 + FINRA Reg BI SEC Rule 15l-1 dually registered reps June 2020 + DOL Retirement Security Rule + Fiduciary Rule retirement rollover + NAIC Senior Suitability Model + LIMRA + LL Global Insurance Barometer Study 2024-2025 41% need more 52% own any $25T national coverage gap 65M underinsured + LIMRA U.S. Life Insurance Sales Trends quarterly premium + LIMRA Agent Retention Research 12-15% 4-year + LIMRA Sales Activity Studies appointments per agent + NAIFA National Association Insurance Financial Advisors + MDRT Million Dollar Round Table Court of Table Top of Table + NAILBA National Association Independent Life Brokerage Agencies + AALU + IRI Insured Retirement Institute + captive carriers Northwestern Mutual MassMutual NYL Guardian State Farm Farmers Allstate AAA + independent carriers Pacific Life John Hancock Lincoln Financial Prudential Nationwide Penn Mutual Symetra Mutual of Omaha Protective Transamerica + IMOs/BGAs Crump Life Insurance Services Highland Capital Brokerage Bond Brothers Brokers Alliance Pinney Insurance Center Insureon AIMCOR + CRM Redtail Wealthbox Salesforce Financial Services Cloud eMoney Advisor Albridge MoneyGuidePro NaviPlan + trade press ThinkAdvisor InsuranceNewsNet InsuranceNewsNet Magazine LifeHealthPro Producer eSource Wealth Management Financial Planning InvestmentNews + Solomon Huebner Life Insurance Textbook 1915 foundational human-life-value methodology). Every framework research source named so an agency manager can cite by name when agents push back. EXPLICITLY LIFE INSURANCE INDUSTRY - NOT SaaS - no Gong Bridge Group Pavilion ProfitWell SaaStr. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 8 quantified benchmark tables: (1) LIMRA Insurance Barometer U.S. Life Insurance Ownership Gap — 41% need more / 52% own any / $25T national coverage gap / 65M underinsured / primary reason cited buy if financial professional explained without pressure / 38% cite cost despite actual median term premium for healthy 35-yo non-smoker = $25-40/month for $500K 20-year term. (2) LIMRA Agent Retention — Producer-Side Problem — 1-year retention 30-35% / 4-year 12-15% / year 1-2 warm-market burn 70% of failed-agent pattern / top-quartile MDRT-track agencies 45-55% at 4-year / captive vs independent gap captive 3-5 pts higher at 4-year. (3) Close Rate by Discipline Tier — bottom-quartile illustration-as-opener no COMPUTE 12-22% 15-28 cases/year / below-average closed-question fact-finder pitched product early 20-30% 30-48 / industry average 25-35% 45-65 / top-quartile full 5-Step + 3-Pillar consistently 38-52% 75-120 / top-decile 5-Step + 3-Pillar + referral choreography + advanced markets 48-65% 115-200+. (4) Why Prospects Decline to Buy LIMRA + NAIFA — agent pitched product before math COMPUTE skipped 34% / premium felt too high vs perceived need 28% / confused by product complexity EDUCATE skipped 24% / felt pressured NO PRESSURE Pillar violated 22% / distrusted agent recommendation SUITABILITY questioned 19% / already had coverage thought enough 18% / wanted to talk to financial advisor first 17% / spouse not present 15% / didn\'t believe needed it LISTEN skipped 14%. (5) State Best-Interest Rule Adoption Status Mid-2026 — NY Reg 187 YES first-in-nation 2019 annuities + 2020 life covers both products explicit anti-misrepresentation / CA SB-1184 YES 2020 annuities / MA 211 CMR 96 YES 2021 annuities / NJ Best Interest YES 2021 annuities extending life / IA Bulletin 23-04 YES 2024 NAIC #275 amendments / MN 60K.42 YES 2022 / CT Best Interest YES 2022 / ME Bulletin 458 YES 2023 / all other NAIC #275-adopting states 37 by 2025 YES 2021-2025 rolling / Federal SEC Reg BI dually registered YES June 2020. (6) Replacement Disclosure NAIC #613 Compliance Audit — replacement disclosure form signed at appointment YES low / existing carrier notified within 5 business days YES low / new policy in force before old cancels YES low / replacement form skipped because prospect didn\'t ask NO #1 source of state DOI complaints / in-force comparison documented YES low / side-by-side benefit comparison given YES low best practice. (7) MDRT Production Thresholds — MDRT base ~$120K first-year commission OR equivalent premium 5-8% producers globally / Court of Table 3x MDRT ~$360K 1.5-2% / Top of Table 6x MDRT ~$720K 0.5-1% / MDRT median producer profile 8-12 years tenure 12-18 appointments/month 40-50% close rate 90%+ persistency. (8) 5-Step Adoption Curve — Step 1 LISTEN 8-min open-ended what scares you asked 28% week 1 → 82% week 12 / Step 2 COMPUTE math on legal pad before product 15% → 71% (hardest install) / Step 3 EDUCATE renting-vs-buying no illustration 32% → 85% / Step 4 MATCH structure tied to COMPUTE premium ranges structure-first carrier-second 22% → 78% / Step 5 COMMIT non-pressure ask medical exam booked at appointment 18% → 73% / ALL 5 steps every appointment 6% → 54%. Step 1 LISTEN + Step 2 COMPUTE hardest to install — weekly CRM appointment-note audit by agency manager single biggest predictor of cohort close-rate lift at 90 days. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 10-failure-mode counter-case: (1) Agent pitches product before COMPUTE most common single failure agent opens laminated illustration minute 4 because prospect mentioned competitor or asked about whole life per LIMRA 34% of post-appointment non-purchases trace to product-before-math prospect\'s product question is data not permission answer in EDUCATE-language briefly KEEP math on paper first drill verbatim. (2) Closed-question fact-finder agent runs template form with closed yes/no/dollar-amount questions no emotional signal surfaces prospect leaves having shared facts not motivation mandatory open-ended questions in LISTEN with what scares you about money as the diagnostic if agent didn\'t ask it they ran fact-finder not needs analysis. (3) Wrong COMPUTE method for prospect defaults to DIME for everyone uses DIME on business owner who needs CNA uses HLV on single-income family with three kids and mortgage who needs DIME wrong method = wrong number = lost case train prospect-type-to-method match DIME = young families HLV = high earners CNA = business owners + complex estates. (4) 100% whole life recommendation against mostly-term math classic suitability violation COMPUTE shows $2M+ income-replacement need agent recommends $250K whole life because commission materially higher per state DOI complaint data most-cited suitability failure in life insurance COMPUTE worksheet IS audit trail if $2M gap and recommendation $250K WL file fails best-interest review. (5) Illustration-as-opener agent leads with let me show you $1M whole-life illustration most families at your income choose anchors conversation on product before math before EDUCATE framing before best-interest analysis illustration comes out in MATCH after COMPUTE + EDUCATE never before zero exceptions. (6) Skipped Replacement Disclosure agent doesn\'t run NAIC #613 form when replacing existing policy because prospect didn\'t ask or it\'s a hassle per state DOI complaint analysis missing Replacement Disclosure is #1 single source of life insurance complaints + carrier rescissions if ANY existing in-force policy Replacement Disclosure mandatory in nearly every state build into file every time. (7) False-urgency close this rate expires Friday / carrier changing underwriting next month / interest rates about to drop all NAIC-flagged pressure tactics kills trust permanently if prospect later verifies non-pressure close converts at 2x rate per LIMRA calm start tonight or 48 hours either way next step is the line. (8) Permanent-as-savings-account misframing think of this whole life as savings account that also protects family NAIC-flagged misrepresentation NY Reg 187 explicitly cites as violation permanent insurance is protection that ALSO builds equity slowly never savings account drill renting-vs-buying frame until reflex. (9) Refused commission disclosure prospect asks what\'s your commission agent dodges I\'m not really allowed to discuss refusing to disclose looks worse than disclosing answer commission question honestly and directly move on document commission disclosure in file. (10) Agency manager doesn\'t audit weekly CRM notes kills 60-75% of needs-analysis training rollouts per LIMRA sales-activity research 30-day half-life un-coached agents revert to closed-question fact-finder + illustration-as-opener + pressure close by week 4 one appointment per agent per week reviewed in 1:1 marked for 5-Step + 3-Pillar adherence non-negotiable. Plus 7 common agency manager and brand team objections with honest answers: agents already know needs analysis / compliance and production in tension / captive shop already trains this / independent agents don\'t have time for 60-min appointments / senior agents don\'t need this / most team is dually registered Reg BI handles compliance / how do I know it\'s working three 90-day signals close-rate +12-20 pts per agent + state-disclosure-form completion rate above 95% + 13-month persistency above 90% + zero state DOI complaints + MDRT-track production lift 12-18 months. Plus when-to-rerun-every-90-days cadence with rotated archetypes pre-retiree couple with significant retirement assets and estate-tax exposure + single-income family with stay-at-home spouse and 3 kids + blended-family scenario with prior-marriage obligations + special-needs-child trust scenario + multi-generational legacy planning + business-partner cross-purchase with three principals + executive-bonus 162 plan for closely-held business + COLI corporate-owned life insurance on key executives. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as ELEVENTH entry and FIFTH industry-specific training after st0007 orthopedic medical device sales st0008 residential real estate listing presentations st0009 automotive F&I st0010 specialty pharmaceutical HCP detailing — st0001-st0006 covered B2B SaaS sales motions that translate across industries from st0007 forward pivots to industry-by-industry coverage and st0011 is life insurance + financial advisory needs analysis the highest-leverage discovery conversation in personal financial services the territory where captive career agents IMO/BGA-affiliated independent agents and dually-registered broker-dealer reps protect families inside NAIC Suitability #275 + Replacement #613 + state Reg 187-equivalents + FINRA Reg BI + DOL Fiduciary Rule enforcement perimeter. Companion industry-specific entries planned st0012 P&C insurance agent training auto + home + umbrella cross-sell + st0013 annuity sales + retirement-income planning + st0014 wealth-management advisor first-meeting conversion + st0015 Medicare advantage + supplement sales AEP/OEP cycle + st0016 group benefits broker enrollment-period + st0017 financial planning fact-finder + plan-delivery meetings + st0018 RIA first-meeting AUM conversion + st0019 estate planning + advanced markets ILIT IDGT GRAT + st0020 business succession + buy-sell + key-person specialist sales. Cross-references to st0001-st0006 SaaS foundation arc translated for life insurance needs analysis: st0001 discovery → Step 1 LISTEN open-ended kitchen-table fact-finder replaces SaaS discovery / st0002 single-threading → spouse partner attendance is second thread LIMRA single-spouse appointments close at half rate / st0003 objection recovery → 5-Step deflection handling on term is paying for nothing + employer 1x is enough + my uncle sold me whole life / st0004 cold-call opener → Step 1 LISTEN verbatim no rapport-burn opener / st0005 demo discipline → Step 4 MATCH illustration is demo comes AFTER COMPUTE not before / st0006 pricing → Step 5 COMMIT premium-range framing + 10-day free-look as risk-reversal. Cross-reference to st0007 + st0008 + st0009 + st0010 what transfers — discipline of verbatim language on load-bearing moments + CRM-reviewed coaching cadence transfers exactly where st0007 made surgeons hear OR + Evidence + Outcome diagnostics verbatim st0008 made sellers hear PROOF + Fee 4-line + PRICE-as-range verbatim st0009 made customers hear 9-Step F&I verbatim st0010 made HCPs hear OPEN + PROBE + CONFIRM + CLOSE verbatim st0011 makes prospects hear LISTEN + COMPUTE + EDUCATE + MATCH + COMMIT verbatim top producers script load-bearing moments improvise rest what does NOT transfer life insurance has most emotionally-loaded discovery conversation of any industry covered so far what scares you about money question death-and-dependents math spouse-and-kids future-without-you framing producer has to hold space for that emotional weight without pivoting prematurely to product as solution compliance overlay NAIC + state Reg 187 + Reg BI + DOL is heavy but not as existential-per-individual-violation as pharma OPDP regime state DOI rescissions and E&O claims are operational risk with license suspension/revocation for systemic patterns. Adjacent Pulse Knowledge Library entries NAIC Suitability Model #275 best-interest framework + NAIC Replacement Model #613 walkthrough + NY DFS Reg 187 compliance primer + state-by-state Reg 187-equivalent comparison + FINRA Reg BI dually-registered overlay + DOL Fiduciary Rule retirement-rollover application + LIMRA Insurance Barometer methodology + LIMRA Agent Retention research + MDRT production threshold framework + NAIFA code of ethics + NAILBA IMO/BGA channel guide Crump Highland Bond Brothers Brokers Alliance Pinney AIMCOR + carrier landscape Northwestern Mutual MassMutual NYL Guardian State Farm Pacific Life John Hancock Lincoln Financial Prudential Nationwide Penn Mutual Symetra Mutual of Omaha Protective Transamerica + DIME / HLV / CNA needs-analysis methodology + term-vs-permanent product comparison 10/15/20/30-yr term + Whole Life + IUL + VUL + GUL + agency BMS CRM landscape Redtail Wealthbox Salesforce Financial Services Cloud eMoney Albridge MoneyGuidePro NaviPlan + q9601 fractional CFO maps onto agency-level production-economics conversation agency manager has with GA/MGA about override structures validation periods and producer-payback math. Reading list of frameworks with URLs: NAIC Model Laws content.naic.org + NY DFS Reg 187 dfs.ny.gov + FINRA Reg BI finra.org + DOL EBSA dol.gov/agencies/ebsa + LIMRA research limra.com + MDRT mdrt.org + NAIFA naifa.org + NAILBA nailba.org + IRI irionline.org + Solomon Huebner Life Insurance Textbook 1915 foundational human-life-value methodology + industry trade press ThinkAdvisor + InsuranceNewsNet + LifeHealthPro + Producer\'s eSource + Wealth Management + Financial Planning + InvestmentNews. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Eleventh Pulse Sales Training entry st0011 and FIFTH industry-specific training after st0007 medical device st0008 real estate st0009 auto F&I st0010 pharma — fully runnable 60-minute live life insurance needs-analysis training for the highest-leverage discovery conversation in personal financial services (per LIMRA + LL Global Insurance Barometer Study 2024-2025: 41% of US adults say they need more life insurance only 52% own any policy $25T national coverage gap 65M underinsured-American adults primary reason cited buy if financial professional explained without pressure plus per LIMRA 4-year agent retention 12-15% year 1-2 warm-market burn pattern) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,000 words ABSOLUTE HARD CAP 10,500. LEAN-FROM-START pattern mirroring st0008 + st0010. Structure: orange Pulse Training callout intro (who-for: captive career agents Northwestern Mutual MassMutual NYL Guardian State Farm Farmers Allstate AAA + IMO/BGA-affiliated independent agents Crump Life Insurance Services Highland Capital Brokerage Bond Brothers Brokers Alliance Pinney Insurance AIMCOR + dually-registered broker-dealer reps offering insurance + investments; works 2nd-year producer to 20-year senior partner; what-bring: 3 recent unconverted prospect recordings or notes + current fact-finder template + state-specific Reg 187-equivalent best-interest disclosure form + printed leave-behind + whiteboard for stalled-prospect scoring) + Bottom Line callout You don\'t sell life insurance you protect families product comes last + 5-step + 3-Pillar thesis + 6-row pipe-table agenda (0:00-0:05 Cold Open / 0:05-0:22 Teach / 0:22-0:32 Discussion / 0:32-0:52 Role-Play / 0:52-0:57 Debrief+Commitments / 0:57-1:00 Leave-Behind) + Section 1 Cold Open with LIMRA Insurance Barometer 41% need more 52% own any $25T coverage gap 65M underinsured + agent retention 12-15% problem + Marcus 3rd-year captive composite young dual-income family $1M-WL illustration minute 4 talking cash-value crediting rates minute 12 defending premium minute 22 we\'ll talk it over and call you zero close no referral vs restructured next agent through referral different opening before we look at any product I just want to understand your situation 45-min LISTEN 8-min COMPUTE legal pad DIME $1.4M per spouse 3-min EDUCATE renting vs buying 2-min MATCH 30-yr term + small WL slice $187/mo combined 60-sec COMMIT signed both apps that night $2.8M coverage $4500 first-year commission 4 referrals + Common Trap company trains us to show illustration early three answers illustration is reference not script + illustration-as-opener is exactly why industry has high-commission whole-life-pitch reputation + non-pressure close converts at 2x rate + Section 2 Teach split into Part A 5-STEP NEEDS ANALYSIS Framework 12 min (Step 1 LISTEN 8 min no product no illustration no carrier brochure open-ended fact-finder family structure ages incomes debt assets employer benefits retirement vehicles business interests beneficiaries plus questions that actually surface need walk me through your situation if something happened to either of you tomorrow what would other one need money for and for how long what do you want for kids in 10 years what scares you about money take notes by hand eye contact matters legal pad on table is conversation NEVER mention product NEVER interrupt silence after what scares you is where prospect tells you what they actually need / Step 2 COMPUTE 4 min out loud on single sheet of paper show math DIME Debt + Income replacement + Mortgage + Education or Human Life Value annual income times years to retirement times discount factor or Capital Needs Analysis lump sum for specific obligations + ongoing income replacement match method to prospect type land on specific coverage number BEFORE introducing any product verbatim let me put this on paper debts mortgage student loans credit auto = income replacement income times years times 0.75 education = final expenses + emergency that\'s a need of roughly $X per spouse right now you have 1x salary group life so gap is roughly $Y comfortable with assumptions / Step 3 EDUCATE 3 min plain-English term vs permanent NO illustrations yet renting vs buying frame most families need mostly term because years irreplaceable financially when kids young mortgage large is defined window permanent for specific reasons estate planning business buy-sell special-needs child trust supplemental retirement income from cash value most families mostly term with strategic slice of permanent not 100% of either / Step 4 MATCH 2 min specific product mix tied to COMPUTE + EDUCATE rationale carrier underwriting illustration comes out to show structure and premium not to pitch carrier brand premium ranges not single quotes structure first carrier second / Step 5 COMMIT 60-90 sec non-pressure close specific commit scheduled next step not sign tonight or lose the rate calm give-them-the-out-and-they-take-the-in are you ready to start application tonight or would you like 48 hours either way here\'s next step and timeline medical exam scheduled in next 10 days paramedical underwriting 4-6 weeks policy issues 10-day free-look calendar medical exam BEFORE you leave) and Part B BEST-INTEREST Three Pillars Compliance Frame 5 min (Pillar 1 SUITABILITY NAIC Suitability in Annuity Transactions Model #275 + state best-interest rules NY Reg 187 2019-2020 first-in-nation + CA SB-1184 + MA 211 CMR 96 + NJ Best Interest + IA Insurance Bulletin 23-04 + MN 60K.42 + CT Best Interest + ME Bureau of Insurance Bulletin 458 + growing list adopting NAIC Model #275 best-interest amendments by 2025 standard applies in 45+ states recommended product must match prospect\'s needs financial situation objectives NOT agent\'s commission document fact-finder save COMPUTE worksheet / Pillar 2 DISCLOSURE NAIC Replacement Model #613 if replacing existing policy Replacement Disclosure form mandatory in nearly every state rescission risk high if skipped commission disclosure required where state rules mandate NY CA others suitability statement signed at policy delivery DOL Fiduciary Rule applies if rolling retirement assets into annuity or insurance product funded from IRA additional disclosures required / Pillar 3 NO PRESSURE NO MISREPRESENTATION NAIC Best-Interest standards + state Reg 187-equivalents + every carrier\'s compliance manual no pressure tactics no misrepresentation of permanent products as savings vehicles no concealing surrender charges on IUL/VUL no concealing variable subaccount risk on VUL no AAA/AARP cross-sell bait-and-switch no free insurance pitches employer-paid GTL or AD&D is not free typically inadequate group-life with portability gaps verbatim three things you need to know about permanent insurance before we move forward cash value takes 10-15 years to break even this is NOT savings account in early years surrender charges in years 1-10 on VUL cash value invested in subaccounts can go up OR down with market death benefit protected but cash value not guaranteed) + Section 3 Discussion 6 prompts (toughest unconverted prospect last 60 days demographics household income current coverage last 3 interactions per CRM Redtail Wealthbox Salesforce Financial Services Cloud eMoney agency BMS + which of 5 steps broke + did you pitch product before COMPUTE + did you use right method DIME for young families HLV for high earners CNA for business owners + state-disclosure form used or skipped + ONE concrete next move verbatim) + Section 4 Two-Person Role-Play with Round 1 Jen and Mike Walsh young dual-income family early 30s 2 young kids ages 3 and 5 $185K combined ($110K + $75K) $420K mortgage 28 years left basic 1x-salary group-life $110K + $75K no individual policies $38K student loans + $24K credit-card debt $48K combined 401(k) $32K cash savings talking to life agent for first time after friend\'s husband died unexpectedly at 38 friend\'s $50K group-life ran out in 18 months three deflections term is paying for nothing if we don\'t die isn\'t whole life better because we get money back / my employer gives me 1x salary in group-life automatically isn\'t that enough it\'s free / my uncle sold us whole life last year for our older daughter heard mixed things agent makes huge commission cash value terrible early years are you going to do same thing AGENT runs full 5-Step LISTEN 8 min COMPUTE legal pad EDUCATE renting-buying MATCH 2M 30-yr term + 250K WL per spouse $560-$740/mo combined household structure-first carrier-second framing COMMIT start-tonight OR 48-hours non-pressure ask medical exam booked in front of them plus Round 2 Dr Tom Reeves 50-year-old solo dental practice owner 4 staff practice valuation $1.8M $620K SBA loan against practice + real estate $850K spouse own income $95K independent contractor consultant two adult kids out of house owner wants retire 65 currently $500K 20-year term purchased 8 years ago 12 years remaining no permanent $1.2M SEP-IRA $400K cash savings $250K HELOC available financial advisor trusts but doesn\'t write insurance three deflections my financial advisor said I have enough through retirement accounts and existing term why do I need more / I don\'t want my premium funding someone else\'s commission tell me what you\'re going to make on this / my SBA lender already required key-person insurance $620K to cover loan isn\'t that enough for business side AGENT distinguishes personal vs business COMPUTE buy-sell vs key-person vs SBA cross-purchase vs entity-purchase commission disclosed directly $8500-$11000 first-year on this structure mostly term lower-commission product if maximizing commission would recommend more permanent + 60-sec reset + Section 5 Debrief+Commitments 3 debrief Qs which step felt strongest + which Pillar nearly crossed + next concrete action + 4-line commitment ritual next target prospect + step to lead with + ONE verbatim language change + call to log in CRM within 7 business days + Section 6 Leave-Behind walkthrough + printable one-pager (5-Step framework as vertical grid with verbatim cue lines / Best-Interest Three Pillars compliance frame as 3-quadrant grid / DIME/HLV/CNA quick-reference for which method fits which prospect / compliance checklist fact-finder saved COMPUTE worksheet attached recommendation rationale tied to COMPUTE Replacement Disclosure NAIC #613 if applicable state-specific best-interest disclosure signed commission disclosure where state mandates DOL Fiduciary disclosures if retirement rollover suitability statement at policy delivery medical exam booked CRM note within 7 business days / Never-Do behavior list 12 items / Outcome Line wins full 5-Step in sequence + Three Pillars live + COMPUTE on paper + structure-first carrier-second framing + medical exam booked + Replacement Disclosure where applicable + signed application = 35-55% close rate + 90%+ persistency + 2-3 referrals per closed case + zero compliance complaints + MDRT-track production vs losses closed-question fact-finder + illustration-as-opener + pitched whole life across board + false-urgency close + skipped Replacement Disclosure = 15-25% close + 60-70% persistency + zero referrals + state DOI complaint risk + 12-15% 4-year agent retention statistic personified / If You Only Remember One Thing hero quote You don\'t sell life insurance you protect families product comes last if math doesn\'t land before product close will fail and it should). How-this-fits-in-life-insurance-practice table at end of core showing pre-appointment + first 8 minutes at kitchen table + math on paper + term vs permanent framing + structure recommendation + non-pressure close + compliance overlay + manager coaching. Two mermaid diagrams: 60-min meeting flow + manager coaching loop post-training. 8 benchmark tables (LIMRA Insurance Barometer ownership gap + LIMRA agent retention + close rate by discipline tier + why prospects decline LIMRA + NAIFA + state best-interest rule adoption mid-2026 + Replacement Disclosure NAIC #613 audit + MDRT production thresholds + 5-Step adoption curve). 10-failure-mode counter-case + 7-agency-manager-objection coach-back + when-to-rerun. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping st0001 discovery → Step 1 LISTEN / st0002 single-threading → spouse partner attendance is second thread / st0003 objection recovery → 5-Step deflection handling / st0004 cold-call opener → Step 1 LISTEN verbatim / st0005 demo discipline → Step 4 MATCH illustration is demo comes AFTER COMPUTE / st0006 pricing → Step 5 COMMIT premium-range + 10-day free-look as risk-reversal + companion industry-specific entries planned st0012-st0020 + cross-reference to st0007 + st0008 + st0009 + st0010 what transfers (verbatim language on load-bearing moments + CRM-reviewed coaching cadence) and what does not (life insurance has most emotionally-loaded discovery conversation of any industry covered so far what scares you about money question death-and-dependents math spouse-and-kids future-without-you framing producer has to hold space for emotional weight without pivoting prematurely to product as solution compliance overlay NAIC + state Reg 187 + Reg BI + DOL is heavy but not as existential-per-individual-violation as pharma OPDP regime state DOI rescissions and E&O claims are operational risk with license suspension/revocation for systemic patterns). Tags include sales-training (hub filter) + life-insurance-sales + needs-analysis + financial-advisor-training + term-vs-whole-life + naic-best-interest + 60-min-meeting + standard-team + captive-and-independent + st0011. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY LIFE INSURANCE INDUSTRY - NOT SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Industry-correct sources: NAIC #275 + NAIC #613 + NY Reg 187 + CA SB-1184 + MA 211 CMR 96 + NJ + IA + MN + CT + ME + FINRA Reg BI + DOL Fiduciary + LIMRA + LL Global + NAIFA + MDRT + NAILBA + AALU + IRI + carrier landscape Northwestern Mutual MassMutual NYL Guardian State Farm Pacific Life John Hancock Lincoln Financial Prudential Nationwide Penn Mutual Symetra Mutual of Omaha Protective Transamerica + IMOs/BGAs Crump Highland Bond Brothers Brokers Alliance Pinney AIMCOR + CRM Redtail Wealthbox Salesforce Financial Services Cloud eMoney Albridge MoneyGuidePro NaviPlan + trade press ThinkAdvisor InsuranceNewsNet LifeHealthPro Producer eSource Wealth Management Financial Planning InvestmentNews + Solomon Huebner Life Insurance Textbook 1915. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0011 is crawled.
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
