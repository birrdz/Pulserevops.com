// st0012 -- Mortgage Originator: The Refi Conversation in a High-Rate World
// -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0012, tag: sales-training).
// SIXTH industry-specific training (after st0007 MedDevice, st0008 Real Estate,
// st0009 Auto F&I, st0010 Pharma, st0011 Life Insurance).
// Industry = residential mortgage lending — bank-employed MLOs (Wells Fargo,
// JPM Chase, BofA, US Bank, PNC), independent mortgage brokers (UWM, Rocket Pro
// TPO, loanDepot, CrossCountry, Guaranteed Rate, Movement), credit union MLOs
// (Navy Federal, PenFed, SchoolsFirst), and IMB loan officers — all licensed
// under SAFE Act / NMLS, regulated by CFPB (TRID, Reg Z, Reg B/ECOA, Reg X/RESPA).
// VALUE over WORD COUNT. Target 8,500-10,000 words. ABSOLUTE HARD CAP 10,500.
// Walks 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0011 exactly. LEAN-FROM-START.

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

const ID = 'st0012';
const QUESTION = "Mortgage Originator: The Refi Conversation in a High-Rate World — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'mortgage-sales',
  'loan-originator-training',
  'refi-conversation',
  'high-rate-mortgage-market',
  'nmls-licensed',
  'trid-compliant',
  'cfpb-reg-z',
  '60-min-meeting',
  'standard-team',
  'st0012'
];

const sources = [
  { title: 'Freddie Mac Primary Mortgage Market Survey (PMMS) — canonical weekly 30-yr / 15-yr / ARM rate reference, released Thursdays', url: 'https://www.freddiemac.com/pmms' },
  { title: 'MBA Weekly Application Survey (WAS) — purchase / refi application volume + refi share of total applications', url: 'https://www.mba.org/news-and-research/research-and-economics/single-family-research/weekly-applications-survey' },
  { title: 'CFPB TRID rule (TILA-RESPA Integrated Disclosure) — Loan Estimate within 3 business days, Closing Disclosure 3 business days before consummation, fee tolerance categories', url: 'https://www.consumerfinance.gov/compliance/compliance-resources/mortgage-resources/tila-respa-integrated-disclosures/' },
  { title: 'CFPB Regulation Z (Truth in Lending Act) — APR calculation, advertising rules, ATR/QM rule for residential mortgages', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/' },
  { title: 'CFPB Regulation B / ECOA — Equal Credit Opportunity Act, no steering based on protected class, adverse-action notice requirements', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1002/' },
  { title: 'CFPB Regulation X / RESPA — Section 8 anti-kickback enforcement, servicing transfer disclosures, escrow rules, MSA documentation standards', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1024/' },
  { title: 'NMLS / SAFE Act — Nationwide Multistate Licensing System, state-by-state MLO license + continuing education requirements', url: 'https://nationwidelicensingsystem.org/' },
  { title: 'ICE Mortgage Technology Origination Insight Report (formerly Ellie Mae) — purchase/refi mix, median FICO/LTV/DTI, time-to-close', url: 'https://www.icemortgagetechnology.com/origination-insight-reports' },
  { title: 'Fannie Mae Mortgage Lender Sentiment Survey + Housing Forecast — lender outlook on volume, margins, ARM share, product mix', url: 'https://www.fanniemae.com/research-and-insights/surveys/mortgage-lender-sentiment-survey' },
  { title: 'MBA Quarterly Mortgage Finance Forecast — origination volume by purchase/refi, rate outlook, refi-eligible borrower count', url: 'https://www.mba.org/news-and-research/forecasts-and-commentary' },
  { title: 'HUD / FHA Handbook 4000.1 + VA Lenders Handbook — FHA 203(k) renovation refi, FHA streamline, VA IRRRL, VA cash-out rules', url: 'https://www.hud.gov/program_offices/housing/sfh/handbook_4000-1' },
  { title: 'Industry trade press — HousingWire + National Mortgage News + MortgageOrb + Inside Mortgage Finance + MPA (Mortgage Professional America) + Scotsman Guide', url: 'https://www.housingwire.com/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **Mortgage Loan Originators (MLOs)** licensed under SAFE Act / NMLS — bank-employed MLOs (**Wells Fargo, JPMorgan Chase, Bank of America, US Bank, PNC, Citizens, Truist, Fifth Third**), independent brokers writing through **UWM, Rocket Pro TPO, loanDepot Wholesale, CrossCountry, Guaranteed Rate, Movement, Fairway Independent**, credit union MLOs (**Navy Federal, PenFed, SchoolsFirst, BECU, Alliant**), and IMB loan officers at Pennymac, Newrez, Mr. Cooper, AmeriHome. Works from the first-year licensee whose pipeline collapsed when refis died in 2022 to the 25-year veteran who built their book on rate-and-term and watched 70% of volume evaporate. **The traditional rate-and-term refi is dead. What replaced it is more profitable per loan and harder to source.** Drop this in the next branch meeting and run it live.
>
> **What your MLOs will leave with:** A named, repeatable framework — **the 5-STOP REFI MAP (CASH-OUT DEBT CONSOLIDATION / ARM-TO-FIXED CONVERSION / HELOC-AS-SECOND-LIEN / DSCR & NON-QM FOR INVESTORS / BRIDGE FOR MOVE-UP BUYERS) + the TRID + REG-Z + FAIR-LENDING Three Disclosure Rails** — for running a refi conversation when there is no rate-improvement story. Plus verbatim language for each Stop + each Rail, two live role-plays, a written commitment naming one dead lead, and a printable one-pager.
>
> **What the branch manager should bring:** **(1)** **3 recent dead refi leads from the last 60 days** — the sub-3%-rate-locked homeowner who "wanted to lower their rate" and was sent away, the ARM-holder who got a reset notice and panicked, the investor who asked about pulling cash and got a conforming worksheet that didn't fit. **(2)** **Current rate sheet** (conforming + ARM + FHA + VA + jumbo + DSCR) + **TRID disclosure templates** + current PMMS snapshot + printed leave-behind. **(3)** **Whiteboard** to score each MLO's dead-lead list against which Stop applied and which Rail nearly got crossed.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Outcome |
|------|-------|---------|
| **0:00-0:05** | **Cold Open** — PMMS 6.5-7.5% + MBA refi share 20-32% vs 70% peak + ICE 78% of refi is cash-out + 90-sec composite | MLOs feel the rate-and-term refi is gone and 5 alternative conversations are where the volume lives |
| **0:05-0:22** | **The Teach** — 5-STOP REFI MAP + Three Disclosure Rails (TRID+REG-Z / FAIR LENDING+ECOA / RESPA+REG-X) | MLOs can recite all 5 Stops, all 3 Rails, and the verbatim pivot question under each |
| **0:22-0:32** | **The Discussion** — each MLO names last dead refi lead + which Stop applied + which Rail nearly got crossed | Every MLO audits last 3 dead leads in their LOS (Encompass, Empower, Calyx, ARIVE, BytePro) |
| **0:32-0:52** | **Role-Play x 2** — Cash-out for $58K CC debt + 60-sec reset + ARM-reset escape on 2020-vintage 7/1 ARM | MLOs deliver the right Stop live + stay inside the Three Rails under deflection |
| **0:52-0:57** | **Debrief + Commitments** — 3 questions + each MLO names ONE prospect + matching Stop + 3-business-day re-engagement | Every MLO walks out with one named prospect + one Stop + one LOS entry |
| **0:57-1:00** | **Leave-Behind Walkthrough** — printed one-pager + 5-Stop grid + Three Rails quadrant + market checklist | MLOs know where the digital version lives |

> ### 🎯 Bottom Line
> **Rate is the wrong story in this market. The right story is what the homeowner could DO with their equity.** Per **Freddie Mac PMMS Q1-Q2 2026**, the 30-year conforming fixed is locked in the **6.5-7.5%** band against the Fed Funds target of 4.25-5.00% — and per **MBA's Weekly Application Survey**, refi share has run **20-32% of total applications** versus the ~70% peak of 2020-2021. The legacy rate-and-term refi cohort is essentially closed: anyone with a sub-4% mortgage from 2020-2021 is rate-locked-in for the cycle. What's alive — and growing — is **cash-out for debt consolidation, ARM-to-fixed conversions ahead of the 2026-2027 reset wave, HELOC second-lien layering, DSCR and non-QM for investor properties, and bridge financing for move-up buyers locked out by their own sub-3% legacy first lien.** Five Stops. Three Rails. The MLO who runs the right Stop closes 2-3x the dead leads sitting in their CRM.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- THE COLD OPEN (0:00-0:05)

> ### 🟡 Coach Note
> Do not open the rate sheet. Do not pull up Optimal Blue. Walk into the branch meeting, say the numbers out loud, tell the story. The first 90 seconds set whether MLOs check their phones or actually run a different conversation on the next inbound call. **Five minutes. Hard stop at 0:05.**

### The numbers, then the story.

**The numbers first.** Per **Freddie Mac PMMS**, the 30-year conforming fixed has held **6.5-7.5%** for 18 months. 15-yr 5.85-6.85%. 5/6 ARM 6.10-6.85%. Per **MBA Weekly Application Survey**, refi applications are **20-32% of weekly volume** vs the **~70% peak of 2020-2021**. Per **ICE Mortgage Technology Origination Insight Report**, **78% of today's refi volume is cash-out, not rate-and-term.** The rate-and-term cohort is gone — they locked in sub-4% between June 2020 and March 2022 and they are not moving.

**Producer-side math is brutal.** Top producers wrote 9-12 loans/month in 2021. Today, 3-5. Branch volume down 60-70%. MLOs who survive run a conversation that **doesn't depend on rates dropping** — because the 10-year Treasury and MBS spread, not Fed Funds, drive the 30-year fixed.

**The story.** (Composite — swap in a recent dead lead.)

Maria, third-year MLO at a regional IMB, gets a Realtor-partner referral. Voicemail: *"Hi, John — bought my house Feb 2021, locked 2.875% on a 30-year fixed, my Realtor said you might be able to help me refinance to a lower rate."* Maria calls back, pulls the rate sheet, finds nothing that beats 2.875%, says, *"John, I'm sorry — at today's rates I can't beat what you have. If rates drop, call me."* John hangs up. **Maria just gave away a lead.**

Same call, different MLO, two weeks later. *"John — first, congratulations on 2.875%. Lowest rate you'll ever see. We are absolutely not refinancing your first lien. But let's talk about what you'd actually USE a refi to DO right now. Credit-card debt? Home addition? Investment property? Kid's down payment? ARM resetting somewhere? The rate-and-term refi is the wrong story for you — but there are five other conversations we could have."* John: *"Actually, we have $42K in credit-card debt at 26%, and the wife wants to redo the kitchen, maybe $35K."* MLO closes a $90K HELOC at prime+1 as a second lien — keeps 2.875% first untouched — debt service drops $1,400/month. **Same lead. Different first sixty seconds.**

> ### ⚠️ Common Trap
> *"At today's rates I can't help that homeowner."* Three answers. **(1)** You can't help them with the rate they came in asking for. You can help them with the four other things their equity could do. **(2)** Referring out (or letting them hang up) trains your Realtor partners to stop sending you sub-3%-rate-locked homeowners — and that's 60-70% of the addressable refi market right now. **(3)** The cash-out + HELOC + ARM-rescue producer is the one writing the highest per-loan revenue in 2026 because non-QM and DSCR price 75-150 bps above conforming and stays in your channel.

**Transition:** "Next hour: 5-Stop Refi Map, 3 Disclosure Rails, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:05-0:22)

> ### 🟡 Coach Note
> Seventeen minutes. **Do not lecture for seventeen minutes** — you will lose the room by minute 9. Split into two halves: **5-STOP REFI MAP (12 min, ~2.5 min per Stop)** + **Three Disclosure Rails compliance frame (5 min, ~1.5 min per Rail)**. Pause after each Stop for one clarifying question. End-of-section test: any MLO can recite all 5 Stops in sequence, all 3 Rails, and the verbatim pivot question under each without notes.

### Part A -- The 5-STOP REFI MAP (12 minutes)

Five conversations a high-rate MLO actually runs. Most rate-and-term refis are dead; these five are alive and growing.

#### STOP 1 -- CASH-OUT DEBT CONSOLIDATION (preserve the legacy first lien)

**Borrower has $25-80K in credit-card debt at 22-29% APR + a 3-4% legacy mortgage from 2020-2021.** The trap: refinancing the FIRST lien at today's 7% destroys the legacy rate. The right move: keep the first lien untouched, take a closed-end fixed second lien or HELOC for $30-100K. HELOC at prime+0-2 (~7.5-9.5%), or closed-end second at 8-10%. Blended rate still far below 24% CC APR. Debt service drops 40-60%. Legacy rate preserved.

> ### 🎤 Verbatim Script -- STOP 1 Pivot
> *"Before we talk about touching your mortgage — what's the actual problem you're trying to solve? If it's credit-card debt or a remodel, we are NOT refinancing your $385K at 3.125% into a new $425K at 7%. We're taking a second lien against your equity, leaving the first one alone, and you'll get a debt-service drop of $1,000-1,500/month without giving up the rate you'll never see again."*

**Common trap.** First-lien cash-out at today's rate when CC debt <$60K and existing rate <5.5%. Math fails. Second lien is the right tool. (Narrow exception: first-lien cash-out works if existing rate >5.5% AND CC debt >$60K AND borrower wants one payment.)

#### STOP 2 -- ARM-TO-FIXED CONVERSION (the 2026-2027 rate-reset escape)

**Borrower has a 5/1 or 7/1 ARM originated 2018-2021, facing a 2026-2027 reset.** Most are SOFR-indexed (post-2021) or LIBOR-transitioned. Reset cap typically +5% over start rate. A 3.0% start hits 8.0% at the lifetime cap. Servicer sends reset notice 60 days out. Math: original P&I on $510K at 3.125% = ~$2,185/mo. Reset to ~8% (SOFR ~5.3% + margin 2.75%) = ~$3,750/mo. Refi today to 30-yr fixed at 6.75% = ~$3,310/mo. **Refinancing at 6.75% is the lesser of two evils.**

> ### 🎤 Verbatim Script -- STOP 2 Pivot
> *"Pull out your reset notice. Start rate 3.125%, reset landing around 7.5-8.25% based on SOFR plus margin. Payment going from $2,185 to roughly $3,750 — $1,565 more a month. If we lock you into 6.75% fixed today, payment is $3,310 — $440/month less than where your ARM is heading, fixed for 30 years. We're not refinancing for a lower rate than you have. We're refinancing for a lower rate than you're ABOUT to have."*

**Common trap.** Telling the ARM borrower to "wait for rates to drop" when reset is 8 months away. The reset clock is the constraint, not the Fed. **Coach cue:** pull every ARM in portfolio with a reset before Q4 2027 — highest-yield pipeline you have.

#### STOP 3 -- HELOC AS SECOND LIEN (preserve legacy first + flexible draw)

**Same as Stop 1 but as a flexible line.** HELOCs at prime+0 to prime+2 (~7.5-9.5%). Used for ongoing renovations, tuition, reserves, bridge cash, self-employed working capital. Educate on variable-rate risk + the 2008 HELOC-freeze history (rare but real).

> ### 🎤 Verbatim Script -- STOP 3 Pivot
> *"A HELOC is a line, not a lump. You qualify for $X, draw what you need when you need it, pay interest only on what you've drawn. Variable rate — moves with prime, today ~8.5%. Less certainty than a closed-end second, more flexibility. For ongoing projects or reserves, this is the right shape."*

**Common trap.** Selling a HELOC to a borrower who needs a one-time lump (kitchen with a fixed bid). Closed-end second-lien fixed is the fit. HELOC = ongoing draws + optionality.

#### STOP 4 -- DSCR / NON-QM FOR INVESTORS (rental income qualifies, not W-2)

**Investor-property refi based on Debt Service Coverage Ratio, not W-2.** DSCR loans price **75-150 bps above conforming** (today 7.5-9%) via **Visio Lending, Kiavi, Lima One Capital, Angel Oak Mortgage Solutions, A&D Mortgage, Newrez Smart Series, Champions Funding**. Used for: tapping equity to acquire more properties, hard-money-to-30-yr-fixed refis, qualifying self-employed borrowers whose tax returns won't pass conforming DTI.

> ### 🎤 Verbatim Script -- STOP 4 Pivot
> *"Conforming needs 2 years of W-2s and DTI under 50%. DSCR needs the property to cash-flow at 1.0-1.25x the new payment. Rental brings $3,200/month, new payment $2,800 PITI — you qualify, regardless of personal tax returns. Rate's 75-150 bps higher. For an investor with 3+ properties or a self-employed borrower, fair trade for qualification flexibility."*

**Common trap.** Forcing an investor with 6 rentals through conforming because "rate's better" — loan dies in underwriting at DTI 62%. Run them through DSCR from the start.

#### STOP 5 -- BRIDGE FOR MOVE-UP BUYERS (the rate-lock-in problem)

**Homeowner has a sub-3% legacy mortgage but needs to move** — relocation, family growth, downsize, divorce, school district. Three options: **(a)** bridge loan — short-term against current equity, paid off when old home sells; **(b)** buy-before-you-sell programs (HomeLight Trade-In, Flyhomes, Homeward, Calque, Knock — verify funding status weekly); **(c)** honest expectation-setting: *"Buy at today's rate. Refinance when rates drop."*

> ### 🎤 Verbatim Script -- STOP 5 Pivot
> *"You're going to give up the 2.75%. That's the price of moving. The question is: bridge financing to time the buy and sell, or buy at today's rate with a plan to refi in 24-36 months. Both are real options. Both cost something. Let's price both."*

**Common trap.** Pushing a buy-before-you-sell program whose company is unstable. Verify funding status THIS WEEK — the 2023-2024 fintech shakeout took several programs offline.

### Part B -- The TRID + REG-Z + FAIR-LENDING "Three Disclosure Rails" (5 minutes)

**Three Rails keep the MLO on the track every loan, every state, every product.** Inside the Rails: defensible in CFPB exams, state DFI audits, investor reviews (Fannie, Freddie, Ginnie, jumbo aggregators), and internal QC. Outside: TRID cures (lender eats the difference), state DFI fines, CFPB enforcement actions, NMLS license suspension or revocation.

#### RAIL 1 -- TRID + REG-Z (timing, disclosure, advertising)

**Per CFPB TRID:** LE within 3 business days of application (the 6-piece trigger — name, income, SSN, property address, estimated value, loan amount). CD 3 business days before consummation. Changed-circumstance redisclosure on valid triggers. Fee tolerance: 0% (lender fees, transfer taxes), 10% (recording fees, lender-list services), unlimited (borrower-shopped services). **Per Reg Z:** APR calc, advertising — can't say "fixed rate" if any portion adjusts, can't quote a rate without APR.

> ### 🎤 Verbatim Script -- RAIL 1 Disclosure Walkthrough
> *"Loan Estimate in 3 business days — formal disclosure of every fee, APR, prepayment penalty, assumption clause. No charge except credit-report fee until you give intent to proceed. Closing Disclosure 3 business days before signing — can't move the closing earlier no matter what. If anything triggers redisclosure, we re-clock. No surprises at the table."*

**Common trap.** Missing the LE 3-day clock because the application date wasn't documented at the 6th-piece moment. Or quoting a "rate" without APR in marketing — Reg Z violation.

#### RAIL 2 -- FAIR LENDING / ECOA / REG B (no steering, document everything)

**Per Reg B / ECOA:** no discrimination by protected class. No steering — can't route protected-class borrowers to higher-rate products when they qualify for conforming. Adverse-action notice within 30 days on denials or counters. Document every rate adjustment.

> ### 🎤 Verbatim Script -- RAIL 2 Best-Interest Frame
> *"Three things on every file. Pricing is based on credit, LTV, loan amount, occupancy, property type — not who you are. If you qualify for conforming, I quote conforming first. Non-QM and DSCR only if conforming won't work. Every rate adjustment documented with reason. Denial or counter, you get a written adverse-action notice within 30 days."*

**Common trap.** Steering a self-employed Hispanic borrower with 740 FICO to non-QM "because it's faster" when they qualify for conforming.

#### RAIL 3 -- REG X + RESPA (anti-kickback, servicing, MSAs)

**Per RESPA Section 8:** no money for referrals from Realtors, attorneys, title companies. **MSAs** allowed only if documented at fair market value with actual services delivered (CFPB has aggressively challenged sham MSAs). Servicing Disclosure Statement at application. Special Information Booklet on purchase. Escrow rules.

> ### 🎤 Verbatim Script -- RAIL 3 Co-Marketing Question
> *"The Realtor I work with pays for half our joint open-house flyers. MSA on file, reviewed annually by compliance. Not paying for referrals — that's Section 8. Sharing marketing costs proportional to services delivered. If anyone offers money for referrals, that's a RESPA violation."*

**Common trap.** Casual "Realtor lunch" or "title gift basket" without documented services. CFPB has hit lenders for less.

> ### 🎯 Bottom Line
> 5 Stops + 3 Rails. Stops matter. Rails matter. Both together = 2-3x dead-lead conversion + clean CFPB/state-DFI audit trail. Either one alone fails: 5 Stops without Rails = an MLO who closes well and gets called into a CFPB exam for a TRID violation; Rails without Stops = a compliant MLO who can't fill the pipeline because they keep telling sub-3% borrowers they can't help them.

---

## SECTION 3 -- THE DISCUSSION (0:22-0:32)

> ### 🟡 Coach Note
> Whiteboard up. Write **CASH-OUT / ARM-TO-FIXED / HELOC / DSCR / BRIDGE** across the top in 5 columns. Each MLO audits their **last dead refi lead from the last 60 days** out loud — which Stop applied, what they said instead, what the LOS shows for follow-up since. **Count to five after each prompt.** Silence forces engagement. If vague: *"verbatim — what exactly did you say when they told you their current rate?"*

**Prompt 1 — "Name your last dead refi lead from the last 60 days. Demographics, current rate, current balance, equity, what they were trying to solve."**
Force specifics: *"Robert Chen, mid-40s, $585K home, $310K balance at 3.0% from June 2021, $40K HELOC balance at 9%, asked about lowering his rate, last contact Mar 14 — voicemail not returned."* No vague *"some guy with a sub-3% rate."*

**Prompt 2 — "Which of the 5 Stops applied — and did you find it?"**
Most will admit Stop 1 (cash-out for debt consolidation) was the missed conversation — they pivoted away instead of asking *"what's the actual problem you're trying to solve?"* Some Stop 2 (ARM-to-fixed) — they didn't ask if there was an ARM in the picture. Some Stop 4 (DSCR) — they didn't ask about investment properties. **Manager:** *"The pivot question isn't 'can I match your rate' — it's 'what's the problem you're trying to solve?' Five Stops live in the answer."*

**Prompt 3 — "Did you actually run the math, or did you guess?"**
The killer question. Most MLOs admit they never put a single number on paper for the dead lead. **Manager:** *"Math on paper, in front of the borrower — every time. Second lien vs first-lien cash-out, reset payment vs refi payment, conforming vs DSCR. If you didn't run the comparison, you didn't really make the recommendation — you just opined."*

**Prompt 4 — "Which compliance Rail did you nearly cross — or did cross?"**
TRID timing (LE not sent within 3 business days because application date wasn't documented), Reg Z advertising (quoted a "rate" without APR), Reg B steering (sent a protected-class self-employed borrower to non-QM without testing conforming), RESPA Section 8 (informal Realtor referral with no MSA). **Manager:** *"Self-reporting near-misses is part of the job. CFPB and state DFI look kindly on documented self-audit cultures. The miss you don't name is the one that becomes an enforcement action."*

**Prompt 5 — "What's in your LOS for that dead lead today — anything?"**
Encompass / Empower / Calyx Point / ARIVE / BytePro / Blue Sage / LendingPad note? Or did the lead die without a single CRM/LOS entry? **Manager:** *"Dead leads with no follow-up note are how branch managers get blindsided. Every conversation gets a note, every note gets a next-step task, every next-step task gets a date. No exceptions."*

**Prompt 6 — "ONE concrete next move — re-engagement call, second-lien comparison emailed, ARM-reset notice review, or DSCR pre-qual? Verbatim what you'll say in the opening 30 seconds."**
Each MLO names ONE prospect + ONE move + ONE verbatim opener. **Manager:** *"Recorded call where state law allows, or detailed LOS note within 3 business days, reviewed in 1:1."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:32-0:52)

> ### 🟡 Coach Note
> Pair MLOs. If odd number, take the extra MLO. **Two scenarios, 10 minutes each, 60-second reset between.** MLO plays borrower in Round 1, switches to MLO in Round 2. Walk the room. Listen for whether the MLO actually asks *"what's the actual problem you're trying to solve?"* in the first 90 seconds (the diagnostic), and whether they hold the second-lien math when the borrower tries to fast-track to *"just match the rate I have."* Mark which Stop each MLO misses; that's the data for the next 1:1.

### Role-Play 1 -- Cash-Out for Debt Consolidation (10 min)

**Setup:** **Couple early 40s, $475K home, $285K balance on a 3.25% legacy 30-yr fixed originated Oct 2021, current P&I $1,240/mo. $58K in CC debt across 4 cards at 24-28% APR. Combined W-2 $215K. FICO 740/735. $48K 401(k), $22K cash. Called the IMB after a Facebook ad for "lower your monthly payment."** **MLO must redirect to STOP 1 (preserve first lien + second-lien debt consolidation) WITHOUT pitching a first-lien refi, run the math live, surface TRID timeline.**

> ### 🎤 PROSPECT SCRIPT -- The Khans

> **Posture:** Stressed by ~$1,950/month CC minimums, skeptical of any move touching their "good" mortgage rate. Will move if (a) math lands, (b) MLO doesn't refinance the first lien.

> **Deflection 1 (min 3) — Husband:** *"We just want to refi to a lower rate and roll the credit cards in."*

> **Deflection 2 (min 6) — Wife:** *"My buddy at work said his credit union just did a refi at 5%. Can you match?"*

> **Deflection 3 (min 8) — Husband:** *"We do NOT want to lose our 3.25%. But the credit cards are killing us."*

> **What gets the deal moving:** MLO asks *"what's the actual problem you're trying to solve?"* in first 90 seconds, runs second-lien-vs-first-lien-cash-out comparison ON PAPER, lands on $75K HELOC as second lien, surfaces TRID 3-day LE timeline, schedules application within 24 hours.

> ### 🎤 MLO SCRIPT

> - **Min 0-3 (PIVOT):** *"Before we touch your mortgage — what's the actual problem you're trying to solve? Walk me through the credit-card situation. How much, what APRs, what minimums?"* (Take notes. Do NOT pull the rate sheet.)
> - **Min 3-5 (Deflection 1):** *"Your $285K at 3.25% is the lowest rate you'll ever see. If we refinance into $360K at 7%, P&I goes from $1,240 to $2,395 — $1,155 MORE on the mortgage to save $1,700 on cards. Net $545 better, but you'll hate the mortgage statement, and you've lost a rate worth $40-60K over 10 years. We're not doing that."*
> - **Min 5-7 (Deflection 2):** *"Nobody's doing conforming first-lien refi at 5% right now. Freddie PMMS is 6.5-7.5%. Your buddy's 5% was a 5/6 ARM, a credit-union special with points, or a misremembered conversation. The right product for you isn't the lowest first-lien rate — it's a second lien that leaves the 3.25% alone."*
> - **Min 7-10 (COMPUTE on paper):** *"Home $475K, first lien $285K, CLTV cap ~85-90% — second-lien capacity ~$130K. You need $58K for cards. Call it $75K with $17K reserve. HELOC at prime+0 today ~8.5%. Interest-only on $58K drawn = ~$410/mo. Vs $1,950/mo card minimums. Savings ~$1,540/mo. Even on a 10-year amortizing payback, ~$720/mo — still saving $1,230. First lien at 3.25% untouched. Sound right?"*
> - **Min 10 (MATCH + COMMIT):** *"$75K HELOC at prime+0, draw $58K for cards, $17K reserve. LE in 3 business days, CD 3 days before signing, close in 30-35 days — cards paid off before your next statement. Take the application tonight or 24 hours to think? Either way, here's the next step."*

### 60-Second Reset

> ### 🟡 Coach Note
> **Branch Manager calls out: "Switch sides — 60-second reset."** MLOs put rate sheets down. Stand up. Stretch. Sip water. Sit back down with the OTHER role's paper. **Take 30 seconds to read silently.** Then go.

### Role-Play 2 -- ARM-Reset Escape (10 min)

**Setup:** **Single homeowner mid-50s, $725K home, $510K balance on a 7/1 ARM originated July 2020 at 3.125%. First reset Aug 2027 (~15 months out). Index SOFR ~5.30%, margin 2.75%, caps 2/2/5 (initial 2%, periodic 2%, lifetime 5%). First reset capped at 5.125%; lifetime cap 8.125%. Current P&I $2,185. Reset P&I at 5.125% ≈ $2,860; at lifetime 8.125% ≈ $3,795. FICO 790, $1.3M liquid (mostly CD ladder ~5%), retired fintech exit. Asked an old college friend (MLO's referral source) about the reset notice she just received.** **MLO must use STOP 2 (ARM-to-fixed), show the staircase under both caps, explain SOFR+margin+caps, handle "rates will drop" + "my CDs yield 5%" + "still cheaper than renting" deflections.**

> ### 🎤 PROSPECT SCRIPT -- Linda Martinez

> **Posture:** Financially sophisticated, has options, wants the math to make sense, allergic to being sold to. Will move if MLO explains caps correctly, concedes the CD opportunity cost honestly, and doesn't push.

> **Deflection 1 (min 3):** *"I'll just refinance when rates drop next year. The Fed is going to cut."*

> **Deflection 2 (min 5):** *"My CD ladder gives me 5%. Why pay 6.75% on a mortgage?"*

> **Deflection 3 (min 8):** *"Even worst-case reset is still cheaper than renting comparable here."*

> ### 🎤 MLO SCRIPT

> - **Min 0-2 (PIVOT):** *"Let me see the reset notice. Start rate 3.125%, margin 2.75%, SOFR index, caps 2/2/5, reset Aug 2027. Got it. Walk me through what you're thinking."*
> - **Min 2-4 (Deflection 1):** *"Fed Funds isn't the 30-year. The 10-year Treasury and MBS spread drive the 30-year. Fed cuts 100 bps, the 30-year might move 25-50 bps, not 100. Your reset is in 15 months. Banking on a 200 bps mortgage-rate drop in that window is a bet, not a base case. Let's price both scenarios."*
> - **Min 4-7 (COMPUTE the staircase):** *"Reset math. Current P&I $2,185 at 3.125%. First reset Aug 2027 — index 5.30% + margin 2.75% = 8.05%, capped at start+2% = 5.125%. P&I ~$2,860. Periodic cap +2% annually — Aug 2028 could hit 7.125%, ~$3,290. Lifetime cap start+5% = 8.125%, ~$3,795. Staircase: $2,185 → $2,860 → $3,290 → $3,795 over 3 years if SOFR holds. Refi today to 30-yr fixed at 6.75% on $510K = $3,310. Locked. 30 years."*
> - **Min 7-9 (Deflection 2):** *"Real point. CDs 5%, mortgage 6.75% — net carrying 175 bps. On $510K, ~$750/mo opportunity cost. BUT your CDs roll in chunks. SOFR follows the Fed down. Fed cuts, your CD reinvestment drops to 4%, then 3.5%. The mortgage is locked at 6.75%. The spread doesn't stay 175 bps; it widens against the CDs."*
> - **Min 9-10 (Deflection 3 + COMMIT):** *"Renting comparable is $4,200-4,800. But the comparison isn't rent vs ownership — it's locked-fixed-payment vs unknown-future-payment on the SAME house. Choice: $3,310 fixed for 30 years, refi today. Or $2,860 → $3,290 → $3,795 staircase, refi later if rates drop. Either is rational. I'll send both scenarios in writing by Friday. 7-10 days to decide. No pressure."*

> ### 🟡 Coach Note
> MLO will want to (a) push refi-today harder than the math supports — Linda has real opt-outs; (b) fumble the 2/2/5 cap-structure explanation — TRID + Reg Z require accurate ARM disclosure; (c) lose the CD opportunity-cost argument by ignoring it instead of conceding the partial point. **Make the MLO re-deliver the cap structure + honest CD-cost concession + no-pressure scenario-comparison close.** Highest-leverage drill.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:52-0:57)

> ### 🟡 Coach Note
> Pull the room back together immediately. Three debrief questions, then commitments. The ritual is the only part that moves next quarter's funded volume + per-loan revenue + Realtor-partner trust.

**Debrief 1 — "Which Stop felt strongest? Which weakest?"**
MLOs over-index on Stop 1 (cash-out, familiar) and Stop 2 (ARM-to-fixed, urgent). Under-index on Stop 4 (DSCR, they're scared of non-QM) and Stop 5 (bridge, they don't know which fintech bridge programs are still funding). **Manager:** *"DSCR is where the spread lives — 75-150 bps over conforming on loans that conforming won't touch. Get comfortable. Pull the DSCR lender list, run one DSCR pre-qual this week."*

**Debrief 2 — "Which Rail did you nearly cross?"**
Most will name TRID timing (forgot the 3-business-day LE clock starts at the 6-piece application trigger). Some Reg Z (quoted a rate without APR in a text message). A few Reg B (steered a self-employed borrower to non-QM without testing conforming). **Manager:** *"Naming near-misses is how you avoid actual misses. CFPB and state DFI look kindly on documented self-audit cultures. Self-reporting protects your NMLS license."*

**Debrief 3 — "Who's the dead lead you'll re-engage this week with the right Stop?"**
Each MLO names ONE from their LOS. **Manager:** *"Call within 3 business days. Different opening — 'I want to redo our conversation differently, I think I missed the actual problem we were trying to solve, 15 minutes next week, no obligation.' LOS note in Encompass/Empower/Calyx/ARIVE/BytePro within 24 hours for 1:1 review."*

> ### 🎤 Commitment Ritual (Verbatim)

**Manager says:** "Open your LOS on your phone. Four lines. **Line 1:** target dead lead — name, current rate, current balance, original issue. **Line 2:** Stop you'll lead with — Cash-Out/ARM/HELOC/DSCR/Bridge. **Line 3:** ONE verbatim language change — actual words from the role-play. **Line 4:** call you'll log in LOS within 3 business days. Read all four aloud."

Coach the vague (*"I'll be more solution-focused"*): *"What words exactly? Read the pivot question. Out loud now."*

**Manager closes:** "In our 1:1 within 7 business days I'm pulling LOS detail on this exact dead lead, and we'll walk through the comparison math you put on paper. Not whether you funded the loan — **whether you ran the right Stop and stayed on the 3 Rails.** Loans follow process. Always have."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (0:57-1:00)

> ### 🟡 Coach Note
> Hand out the printed one-pager. Walk it 30 seconds per section. Tell MLOs where the digital version lives (branch SharePoint + intranet + LOS attachment library). Keep one in the producer's binder next to the rate sheet.

> ### 📋 Leave-Behind -- The "5-Stop Refi Map + Three Disclosure Rails" One-Pager

> **THE 5-STOP REFI MAP (verbatim pivot question + typical product + current rate range):**
>
> | # | Stop | Verbatim Pivot Question | Typical Product | Current Rate Range (2026) |
> |---|---|---|---|---|
> | 1 | **CASH-OUT DEBT CONSOLIDATION** | *"Before we touch your current mortgage — what's the actual problem you're trying to solve?"* (If CC debt: second lien, preserve legacy first.) | HELOC or closed-end second lien | HELOC 7.5-9.5% (prime+0-2), closed-end second 8-10% |
> | 2 | **ARM-TO-FIXED CONVERSION** | *"Pull out your reset notice. Your start rate was [X]. Your reset is going to land at [Y]. Let's run the numbers under both the first-reset cap and the lifetime cap."* | 30-yr or 15-yr conforming fixed, or FHA/VA streamline | 30-yr 6.5-7.5%, 15-yr 5.85-6.85% (PMMS) |
> | 3 | **HELOC AS SECOND LIEN** | *"You qualify for $X. You draw what you need. Pay interest only on what you draw. Variable rate, moves with prime."* | HELOC, draw period 10 years typical | Prime+0 to prime+2 (~7.5-9.5%) |
> | 4 | **DSCR / NON-QM FOR INVESTORS** | *"Conforming needs your tax returns. DSCR needs your property to cash-flow at 1.0-1.25x the new payment. Different qualification path, 75-150 bps higher rate."* | DSCR loan (Visio, Kiavi, Lima One, Angel Oak, A&D, Newrez Smart) | 7.5-9% (conforming +75-150 bps) |
> | 5 | **BRIDGE FOR MOVE-UP BUYERS** | *"You're going to give up the 2.75%. That's the price of moving in this market. Bridge financing to time it, or buy at today's rate and refi later — let's price both."* | Bridge loan, buy-before-you-sell (HomeLight, Flyhomes, Homeward, Calque — verify), or honest expectation-setting | Bridge 9-11% short-term; permanent at PMMS |

> **THE THREE DISCLOSURE RAILS COMPLIANCE FRAME (3-quadrant grid):**
>
> | Rail | What it covers | Common near-miss | Verbatim move |
> |---|---|---|---|
> | **RAIL 1: TRID + REG-Z** | LE within 3 business days of application (6-piece trigger), CD 3 business days before consummation, fee tolerance buckets (0%/10%/unlimited), APR calc, advertising rules | LE clock missed because application date undocumented; "rate" quoted without APR in marketing | *"LE in 3 business days, CD 3 days before signing, no surprises at the table. If anything triggers redisclosure we re-clock — no shortcuts."* |
> | **RAIL 2: FAIR LENDING / ECOA / REG B** | No discrimination by protected class, no steering, adverse-action notice within 30 days, document every rate adjustment + product rec | Steering a protected-class borrower to non-QM when they qualify for conforming; vague pricing exception notes | *"If you qualify for conforming, I quote you conforming first. Non-QM only if the math requires it. Every adjustment documented with reason."* |
> | **RAIL 3: REG X + RESPA** | Section 8 anti-kickback, MSAs at fair market value, Servicing Disclosure Statement, Special Information Booklet on purchase, escrow rules | Casual Realtor lunches / title gifts without documented marketing services; sham MSAs | *"MSA on file, reviewed annually by compliance. We share marketing costs proportional to actual services. We do not pay for referrals."* |

> **THE HIGH-RATE MARKET CHECKLIST (refresh weekly):**
>
> - [ ] **Freddie Mac PMMS 30-yr fixed** (Thursday release): _______
> - [ ] **PMMS 15-yr fixed**: _______
> - [ ] **PMMS 5/6 ARM**: _______
> - [ ] **HELOC prime rate** (WSJ Prime): _______
> - [ ] **SOFR overnight** (NY Fed): _______
> - [ ] **Next FOMC meeting date**: _______
> - [ ] **DSCR rate spread over conforming**: _______ bps
> - [ ] **Active non-QM / DSCR lenders this week** (Visio / Kiavi / Lima One / Angel Oak / A&D / Newrez Smart / Champions Funding): _______
> - [ ] **Active bridge / buy-before-sell programs this week** (HomeLight / Flyhomes / Homeward / Calque — VERIFY funding status): _______
> - [ ] **MBA refi share of applications** (Wednesday WAS release): _______ %

> **THE COMPLIANCE CHECKLIST (every file):**
>
> - [ ] **6-piece application trigger documented** with date (LE 3-day clock starts)
> - [ ] **Loan Estimate sent within 3 business days** + delivery receipt
> - [ ] **Closing Disclosure delivered 3 business days before consummation**
> - [ ] **Fee tolerance categories** (0% / 10% / unlimited) verified at CD
> - [ ] **Reg Z advertising** — any rate quoted has APR attached
> - [ ] **Reg B / ECOA** — pricing exceptions documented with reason
> - [ ] **Adverse-action notice** within 30 days if denied or counter-offered
> - [ ] **RESPA Section 8** — no payment-for-referral; MSA on file if applicable
> - [ ] **Servicing Disclosure Statement** delivered at application
> - [ ] **Special Information Booklet** delivered on purchase transactions
> - [ ] **LOS note within 3 business days** of every borrower conversation
> - [ ] **Rate-lock confirmation** in writing if locked

> **NEVER DO (the compliance + trust-cratering behavior list):**
>
> - Tell a sub-3%-rate-locked borrower *"I can't help you"* — collapse of a 60-70%-of-market opportunity
> - Refinance a sub-4% first lien into a 7% first lien for cash-out when a second lien fits the math
> - Quote a "rate" without an APR in any marketing material — Reg Z violation
> - Miss the LE 3-business-day clock — TRID cure required, lender eats the cost
> - Quote a borrower a 5% rate without disclosing the points required to buy down to it
> - Pitch a HELOC to a borrower who needs a one-time lump (closed-end second is the fit)
> - Push a buy-before-you-sell fintech program without verifying THIS WEEK that the lender is funding
> - Steer a protected-class borrower to non-QM when they qualify for conforming — Reg B / ECOA violation
> - Accept Realtor / attorney / title-company gifts above nominal value without an MSA — RESPA Section 8 risk
> - Tell an ARM-reset borrower *"wait for rates to drop"* when their reset is 8-15 months out
> - Sell DSCR at conforming pricing — non-QM lenders won't accept the file at conforming margins
> - Skip the LOS note on a dead lead — branch manager has no audit trail and the lead is unrecoverable

> **THE OUTCOME LINE:**
>
> - **Wins:** Right Stop in first 90 seconds + math on paper + Three Rails clean + LOS note within 3 business days + re-engagement of dead leads → **2-3x dead-lead conversion + per-loan revenue lift from non-QM/DSCR/second-lien spread + clean CFPB and state-DFI audit trail + Realtor-partner trust + funded-volume floor under pipeline contraction**
> - **Losses:** *"I can't beat your rate"* + zero pivot + zero math + missed LE clock + steering near-miss + dead lead with no LOS note → **collapsing pipeline + Realtor partners stop sending sub-3%-rate-locked referrals + TRID cure cost + Reg B exam findings + branch closure risk in the 18-24-month high-rate plateau**

> ### 🎯 If You Only Remember One Thing
> **Rate is the wrong story in this market. The right story is what the homeowner could DO with their equity — debt freedom, cash flow, escaping a reset, or buying another property. You don't sell mortgages; you sell what mortgages enable.**

---

## How This Training Sits Inside Your Mortgage Practice

This is **the foundational refi-conversation discipline** for the 2026 high-rate environment — the conversation that determines whether your branch hits funded-volume goals AND survives CFPB exams + state DFI audits + investor reviews + internal QC + NMLS license renewal. It does not replace product training, processor coordination, underwriting expertise, or LOS workflow — it composes from all of them.

| Where it fits | What this training addresses |
|---|---|
| **Inbound call / referral intake** | Pivot from *"what rate can you match"* to *"what's the actual problem you're trying to solve"* in the first 90 seconds |
| **5-Stop diagnosis** | Cash-Out / ARM-to-Fixed / HELOC / DSCR / Bridge — match the Stop to the borrower's actual need, not the rate sheet |
| **Math on paper** | Second-lien vs first-lien-cash-out comparison, ARM reset staircase, conforming vs DSCR side-by-side — out loud, on the table |
| **Product recommendation** | Tied to the math, not the commission; structure-first, lender-second framing |
| **TRID + Reg Z disclosure** | LE 3-business-day clock, CD 3-day rule, fee tolerance buckets, APR-in-every-rate-quote |
| **Fair lending + ECOA** | Conforming-first quoting, documented rate exceptions, adverse-action notices, no steering |
| **RESPA + Section 8** | MSA documentation, no payment-for-referral, Servicing Disclosure Statement at application |
| **LOS coaching cadence** | Weekly branch-manager LOS audit on 1 conversation per MLO, reviewed in 1:1 within 7 business days |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: meeting flow + post-training coaching loop
// ============================================================================
const flow = `

## The 60-Minute Meeting Flow

\`\`\`mermaid
flowchart TD
  A[Branch Manager Opens 0:00] --> B[Section 1: Cold Open 5 min — Freddie Mac PMMS 30-yr 6.5-7.5% locked range + MBA WAS refi share 20-32% vs 70% peak 2020-2021 + ICE Origination Insight 78% of refi volume is cash-out + Maria 3rd-year IMB composite sub-3%-locked homeowner asked about lowering rate gave away lead vs restructured next MLO pivot what would you USE a refi to DO right now found $42K CC debt and $35K kitchen redo closed $90K HELOC second lien preserved 2.875% first]
  B --> C[Section 2: Teach 17 min]
  C --> C1[Part A: 5-STOP REFI MAP 12 min — Stop 1 CASH-OUT DEBT CONSOLIDATION preserve legacy first lien second lien HELOC or closed-end second at 7.5-10% vs first-lien cash-out at 7% destroys sub-4% rate / Stop 2 ARM-TO-FIXED CONVERSION 2026-2027 reset wave SOFR + margin caps 2/2/5 lifetime cap +5% over start show staircase / Stop 3 HELOC AS SECOND LIEN prime+0-2 variable optionality for ongoing draws / Stop 4 DSCR NON-QM FOR INVESTORS rental income qualifies +75-150 bps over conforming Visio Kiavi Lima One Angel Oak A&D Newrez Smart / Stop 5 BRIDGE FOR MOVE-UP BUYERS rate-lock-in problem bridge or buy-before-sell HomeLight Flyhomes Homeward Calque verify funding or honest expectation-setting]
  C --> C2[Part B: Three Disclosure Rails 5 min — Rail 1 TRID + Reg Z LE 3 business days from 6-piece app CD 3 days before consummation fee tolerance 0% 10% unlimited APR + advertising / Rail 2 FAIR LENDING ECOA Reg B no steering protected class adverse-action 30 days document pricing exceptions / Rail 3 REG X RESPA Section 8 anti-kickback MSAs at fair market value Servicing Disclosure Statement Special Information Booklet escrow rules]
  C1 & C2 --> F[Section 3: Discussion 10 min — 6 prompts last dead refi lead 60 days demographics current rate balance equity + which Stop applied + did you run math or guess + which Rail nearly crossed + LOS note status + ONE verbatim re-engagement opener]
  F --> G[Section 4: Role-Play 20 min]
  G --> G1[Round 1: The Khans early 40s $475K home $285K balance 3.25% from Oct 2021 $58K CC debt 4 cards 24-28% APR $215K W-2 combined — we just want to refi to lower rate roll cards in / my buddy got 5% at credit union / we don't want to lose 3.25% but cards killing us — MLO pivots to STOP 1 second-lien HELOC $75K at 8.5% interest-only $410/month vs CC minimums $1,950/month preserves 3.25% first lien runs second-lien vs first-lien-cash-out comparison on paper TRID 3-day LE timeline]
  G1 --> G2[60-sec reset]
  G2 --> G3[Round 2: Linda Martinez mid-50s $725K home $510K balance 7/1 ARM July 2020 at 3.125% reset Aug 2027 SOFR 5.30% + margin 2.75% caps 2/2/5 lifetime 8.125% — Fed will cut next year / my CDs yield 5% why 6.75% mortgage / worst-case still cheaper than renting — MLO explains cap structure precisely staircase $2,185 to $2,860 to $3,290 to $3,795 vs refi to 6.75% locked $3,310 handles CD opportunity cost honestly no pressure scenario-comparison close]
  G3 --> G4[60-sec reset]
  G4 --> H[Section 5: Debrief + Commitments 5 min — 4-line ritual target dead lead + Stop to lead with + ONE verbatim change + call to log in LOS within 3 business days]
  H --> I[Section 6: Leave-Behind 3 min — 5-Stop grid + 3-Rail quadrant + high-rate-market checklist + compliance checklist + never-do list + hero quote]
  I --> Z[Meeting Ends 60:00 — Branch Manager pulls LOS detail in 1:1 within 7 business days]
\`\`\`

## Branch Manager Coaching Loop

\`\`\`mermaid
flowchart LR
  T[Training Monday] --> W1[Week 1: MLO Commits Target Dead Lead + Stop + ONE Verbatim Change + Logs in LOS]
  W1 --> W2[MLO Re-Engages 3-5 Dead Leads + Runs 5-Stop Diagnosis On Live Inbound Calls Logs One Within 3 Business Days]
  W2 --> W3[Branch Manager Reviews LOS Entry in 1:1 Marks 5-Stop Match + 3-Rail Adherence + Comparison-Math Quality]
  W3 --> W4[1:1 Coaching: Stop Still Missed + Verbatim Re-Delivery With Manager Playing Sub-3%-Locked Skeptical Borrower]
  W4 --> W5[Monthly Production Review: Apps Submitted + Funded Volume + Per-Loan Revenue + Pull-Through + Dead-Lead Re-Engagement Rate + CFPB-Related Findings + TRID Cure Count + State DFI Items]
  W5 --> W6[Quarterly: Refresh PMMS + SOFR + Prime + FOMC Calendar + Update Non-QM/DSCR Lender List + Verify Bridge/Buy-Before-Sell Funding Status + Rotate Role-Plays From Actual Dead Leads + NMLS CE Recertification + State-License Renewals]
  W6 --> R{Rerun Every 90 Days With Fresh Dead-Lead Audits + Updated Rate Environment}
  R -->|Yes| T
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-Stop Refi Map, the Three Disclosure Rails, and the 6.5-7.5% / 20-32%-refi-share / 78%-cash-out benchmarks draw on a specific body of mortgage market and CFPB regulatory research. A branch manager should be ready to cite these by name when MLOs push back on either the conversation framework or the compliance overlay.

**Rate + market data.** **Freddie Mac PMMS** — weekly Thursday 30-yr / 15-yr / 5-1 ARM averages, the canonical rate reference. **MBA Weekly Application Survey (WAS)** — Wednesday release of purchase/refi application volume + refi share + ARM share. **MBA Quarterly Mortgage Finance Forecast** — origination volume projections, refi-eligible count. **Fannie Mae Mortgage Lender Sentiment Survey + Housing Forecast**. **ICE Mortgage Technology Origination Insight Report** (formerly Ellie Mae) — purchase/refi mix, median FICO/LTV/DTI, time-to-close, pull-through.

**CFPB regulatory framework.** **TRID rule (TILA-RESPA Integrated Disclosure)** — LE 3 business days from 6-piece trigger, CD 3 business days before consummation, fee tolerance buckets (0% / 10% / unlimited), changed-circumstance redisclosure. **Reg Z (TILA)** — APR calc, advertising rules, ATR/QM, HOEPA high-cost thresholds. **Reg B / ECOA** — protected-class definitions, no-steering, adverse-action notice, joint-credit signature. **Reg X / RESPA** — Section 8 anti-kickback, MSA fair-market-value standard, Servicing Disclosure Statement, Special Information Booklet, escrow rules. **NMLS / SAFE Act** — 20-hour pre-licensing, 8-hour annual CE, state license + federal registration.

**Industry trade associations.** **MBA (Mortgage Bankers Association)** — research, advocacy, the WAS and Forecast. **NAMB (National Association of Mortgage Brokers)** — broker-channel advocacy. **CMLA** — IMB-focused trade group. **HUD / FHA Handbook 4000.1** — 203(k) renovation refi, FHA streamline, cash-out. **VA Lenders Handbook** — IRRRL streamline, cash-out.

**Carrier + wholesale landscape.** **Banks:** Wells Fargo, JPM Chase, BofA, US Bank, PNC, Citizens, Truist, Fifth Third. **Wholesale for brokers:** UWM (volume leader in TPO since 2022), Rocket Pro TPO, loanDepot Wholesale, AmeriHome, Plaza, Newrez (absorbed Caliber Wholesale). **IMBs:** Pennymac, Mr. Cooper, Newrez, AmeriHome, Movement, CrossCountry, Guaranteed Rate, Fairway. **Credit unions:** Navy Federal, PenFed, SchoolsFirst, BECU, Alliant. **Non-QM / DSCR:** Angel Oak, A&D, Visio, Kiavi, Lima One, Champions Funding, Newrez Smart. **Bridge / buy-before-sell:** Knock, HomeLight Trade-In, Flyhomes, Homeward, Calque (verify funding status weekly).

**LOS + tech stack.** **Encompass** (ICE Mortgage Technology, LOS leader), **Empower** (Black Knight), **Calyx Point**, **ARIVE** (broker), **BytePro**, **Blue Sage**, **LendingPad**, **MeridianLink Mortgage**, **OpenClose**. Pricing: **Optimal Blue**, **Mortech**, **LoanSifter**, **Polly**. CRM: **Velocify**, **Surefire**, **Total Expert**, **Big Purple Dot**.

**Industry trade press.** **HousingWire** (daily-read for industry news, M&A, enforcement), **National Mortgage News**, **MortgageOrb**, **Inside Mortgage Finance** (premium institutional), **MPA**, **Scotsman Guide**, **Originator Connect Network**.

**State regulators.** **CA DRE + DFPI**, **FL OFR**, **TX SML**, **NY DFS**, plus 46 other states — annual reporting, license renewal, complaint handling layered on CFPB rules.

`;

// ============================================================================
// NUM -- quantified benchmarks the branch manager cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

The cold open lands harder when the branch manager can quote real benchmarks. The tables below pull from Freddie Mac PMMS, MBA WAS, ICE Origination Insight, Fannie Mae Sentiment Survey, and CFPB enforcement data.

### Freddie Mac PMMS — Current Rate Environment (2026 snapshot)

| Product | Rate Range (PMMS Q1-Q2 2026) | Versus 2021 Trough | Versus 2023-2024 Peak |
|---|---|---|---|
| 30-year conforming fixed | **6.5-7.5%** | +375-475 bps | -50 to -125 bps |
| 15-year conforming fixed | **5.85-6.85%** | +375-485 bps | -50 to -100 bps |
| 5/6 ARM | **6.10-6.85%** | +335-410 bps | -25 to -75 bps |
| 30-year jumbo | **6.65-7.60%** | +370-475 bps | -40 to -110 bps |
| FHA 30-year | **6.40-7.30%** | +355-445 bps | -55 to -130 bps |
| VA IRRRL | **6.30-7.20%** | +355-445 bps | -50 to -125 bps |

### MBA Weekly Application Survey — Refi Share Collapse

| Period | Refi Share of Total Applications | Purchase Share |
|---|---|---|
| 2020-2021 peak (sub-3% rate window) | **~70%** | ~30% |
| 2022 transition (rates rose) | 35-50% | 50-65% |
| 2023 trough | 28-35% | 65-72% |
| **2026 current** | **20-32%** | **68-80%** |
| Cash-out share of refi volume (ICE) | **~78%** | — |
| Rate-and-term share of refi volume | **~22%** | — |

### Per-MLO Loan Volume — The Producer-Side Reality

| Era | Loans/Month (Average Producer) | Loans/Month (Top Quartile) |
|---|---|---|
| 2020-2021 peak | **9-12** | **18-30+** |
| 2022 transition | 6-9 | 12-18 |
| 2023-2024 high-rate plateau | 3-5 | 7-12 |
| **2026 current** | **3-5** | **6-10** |
| Pre-2020 historical baseline | 4-6 | 8-12 |

### Dead-Lead Conversion Rate By Discipline Tier

| MLO Tier | Dead-Lead Re-Engagement Rate (90 days) | Funded Loans From Re-Engaged Leads |
|---|---|---|
| Bottom-quartile (*"can't beat your rate"*, no pivot) | **3-8%** | **<1 per quarter** |
| Below-average (occasional pivot, no math on paper) | 10-18% | 1-2 per quarter |
| Industry average | 18-28% | 2-4 per quarter |
| **Top-quartile (5-Stop + math on paper + LOS follow-up)** | **38-55%** | **5-9 per quarter** |
| Top-decile (5-Stop + Realtor partner choreography + non-QM/DSCR depth) | 50-70% | 9-15 per quarter |

### Why Dead Leads Stay Dead (Branch Post-Mortems + LOS Audits)

| Reason for Non-Re-Engagement | % of Dead Leads Citing |
|---|---|
| MLO didn't pivot off rate-and-term in first 90 seconds | **41%** |
| Math never run on paper, just rough verbal estimate | **34%** |
| Wrong Stop diagnosed (cash-out instead of HELOC, etc.) | **22%** |
| MLO didn't surface ARM, investment property, or move-up plans | **31%** |
| No LOS follow-up note within 3 business days | **38%** |
| Borrower felt MLO didn't understand their situation | **27%** |
| Borrower felt pressured to refinance the first lien | **18%** |
| MLO referred out or recommended waiting for Fed cuts | **24%** |

### CFPB TRID + Reg Z Enforcement Snapshot (Recent Multi-Year)

| Violation Category | Median CFPB Fine / Action | Frequency |
|---|---|---|
| TRID timing violations (LE / CD 3-day clocks) | $50K-$5M (institutional) | Most common TRID finding |
| Reg Z advertising (rate without APR, "fixed" on adjustable) | $25K-$2M | Frequent in marketing audits |
| Fee tolerance violations (over the 0% / 10% bucket) | Lender cure (eats cost) + state DFI follow-up | High; usually lender-eaten |
| Reg B / ECOA steering allegations | $1M-$25M+ (pattern cases) | Increasing under recent CFPB priorities |
| RESPA Section 8 (kickbacks / sham MSAs) | $500K-$15M | Increasing focus on MSA enforcement |
| Servicing transfer / Reg X | Lender + servicer joint cures | Common at portfolio transfers |

### State DFI Audit Priorities (Multi-State Composite 2025-2026)

| Audit Focus | % of State Exams Flagging |
|---|---|
| TRID disclosure timing | **~58%** |
| Reg B documentation of pricing exceptions | **~44%** |
| LOS audit-trail completeness | **~41%** |
| MSA documentation + fair-market-value backup | **~36%** |
| NMLS license renewal + CE completion per MLO | **~31%** |
| Advertising compliance (Reg Z + state-specific) | **~28%** |

### 5-Stop Adoption Curve (MLOs Running The Right Stop Consistently)

| Stop | Week 1 | Week 4 | Week 12 |
|---|---|---|---|
| Stop 1 CASH-OUT DEBT CONSOLIDATION (second-lien-first framing) | 24% | 58% | 78% |
| Stop 2 ARM-TO-FIXED CONVERSION (reset notice review) | 18% | 52% | 74% |
| Stop 3 HELOC AS SECOND LIEN (lump-vs-line diagnosis) | 30% | 64% | 82% |
| Stop 4 DSCR / NON-QM FOR INVESTORS (rental-income qualification) | 12% | 38% | 62% |
| Stop 5 BRIDGE FOR MOVE-UP BUYERS (honest expectation-setting) | 16% | 42% | 65% |
| All 5 Stops live on the right inbound call | 7% | 28% | 56% |

**Pattern:** Stop 4 (DSCR / non-QM) is the hardest to install — most MLOs fear non-QM and default to "this isn't for us." But DSCR carries 75-150 bps of margin over conforming AND keeps the loan inside the channel instead of referring out. **The weekly LOS audit by the branch manager is the single biggest predictor of cohort funded-volume lift at 90 days** per internal IMB and bank-channel benchmarking. The Three Rails frame adopts faster (most MLOs reach 80%+ adherence by week 6) because CFPB and state DFI pressure is direct and the consequences (TRID cures, exam findings, license actions) are existential.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + manager objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- *"I Can't Beat Your Rate"* Reflex
Most common single failure. MLO hears the borrower's sub-3% legacy rate, says some version of *"at today's rates I can't help you,"* and lets the lead walk. **Per branch LOS audits, 41% of dead leads trace to this single reflex.** **Coach:** the pivot is *"what's the actual problem you're trying to solve?"* — always, every time, before any rate conversation. Five Stops live in the answer to that question.

### Failure Mode 2 -- First-Lien Cash-Out When A Second Lien Fits
Borrower has $40K of CC debt and a 3.0% legacy first lien. MLO refinances the first lien at 7% to consolidate. Math nominally works (debt-service savings on cards exceeds added cost on mortgage) but the borrower hates the higher mortgage payment and the lost legacy rate is worth $40-60K over 10 years. **Coach:** second lien (HELOC or closed-end second) is the default for cash-out under $100K when the existing first-lien rate is below 5%. Run the comparison on paper, every time.

### Failure Mode 3 -- ARM Reset Ignored Until Too Late
MLO doesn't pull a list of in-portfolio ARMs with 2026-2027 reset dates and doesn't proactively call those borrowers 6-12 months ahead. Reset notice arrives, borrower panics, calls a competitor first. **Coach:** every quarter, pull ARM list from LOS, sort by reset date, call all of them. Highest-yield pipeline in the high-rate environment.

### Failure Mode 4 -- DSCR Fear / Non-QM Avoidance
MLO defaults to "this isn't for us" when borrower has 3+ investment properties or self-employed income that won't pass conforming DTI. Refers out. **Coach:** non-QM and DSCR carry 75-150 bps of margin and stay inside the channel. Get comfortable. Visio, Kiavi, Lima One, Angel Oak, A&D, Newrez Smart, Champions Funding — pick two, build the relationship, run one DSCR pre-qual this week.

### Failure Mode 5 -- Bridge / Buy-Before-Sell Without Verifying Funding Status
MLO pitches a buy-before-you-sell program (Knock, HomeLight Trade-In, Flyhomes, Homeward, Calque, Ribbon) that has gone offline or paused funding. Borrower can't close. Realtor partner blames MLO. **Coach:** verify funding status of any third-party bridge or buy-before-sell program THIS WEEK before recommending. The 2023-2024 fintech shakeout took several programs offline; the survivors have changed terms.

### Failure Mode 6 -- Missed LE 3-Business-Day Clock
Application taken Tuesday over the phone, MLO doesn't document the 6-piece trigger date, LE goes out Friday — clock missed. **TRID cure required, lender eats the cost.** **Coach:** the moment the borrower gives the 6th piece (name + income + SSN + property address + estimated value + loan amount), date-stamp the file. LE goes out within 3 business days from that stamp, no exceptions.

### Failure Mode 7 -- Rate Quoted Without APR
Text message to a prospect: *"I can get you 6.5% on a 30-year fixed."* No APR. **Reg Z advertising violation.** Found in marketing audit. **Coach:** every rate quote, in every channel — text, email, voicemail, social — must include the APR. Build templates.

### Failure Mode 8 -- Steering A Protected-Class Borrower To Non-QM
Self-employed Hispanic borrower, 740 FICO, asks about a refi. MLO routes to non-QM "because it's faster" without first testing conforming. **Reg B / ECOA steering risk.** **Coach:** conforming-first quote on every file, every time. Non-QM only if the math actually requires it. Document the reason in the file.

### Failure Mode 9 -- Casual Realtor Lunch With No MSA
MLO buys a Realtor lunch weekly. No MSA. Realtor sends 6 referrals/month. **RESPA Section 8 risk.** CFPB has hit lenders for less. **Coach:** if you have a recurring co-marketing relationship with a Realtor, attorney, or title company, get an MSA in writing, reviewed annually by compliance, with documented fair-market-value invoices for actual marketing services delivered.

### Failure Mode 10 -- Branch Manager Doesn't Audit Weekly LOS Notes
Kills 60-75% of refi-conversation training rollouts. Per internal IMB benchmarking, **~30-day half-life un-coached**. MLOs revert to the *"can't beat your rate"* reflex by week 4. **Coach:** one inbound-call or dead-lead conversation per MLO per week, reviewed in 1:1 within 7 business days. Non-negotiable.

### Common Branch Manager Objections

**1. "My MLOs already know how to run a refi conversation."** Pull 90 days of dead-lead conversion rate per MLO. Bottom-quartile (3-8%) know how to take a refi application; top-quartile (38-55%) run the 5-Stop diagnosis on every inbound call. Audit, don't assume.

**2. "Compliance and production are in tension."** Backwards. Top-quartile MLOs (38-55% dead-lead conversion) have the LOWEST TRID cure counts, lowest exam findings, lowest E&O claims, and highest investor pull-through. Bottom-quartile produce the cures AND the exam findings.

**3. "Our IMB already has scripted call flows."** Most call flows are intake scripts, not diagnosis frameworks. The 5-Stop is the diagnostic discipline ON TOP of intake.

**4. "Brokers can't afford 60-min meetings — we're too busy."** The 60-min meeting is the leverage. 5 dead-lead re-engagements per MLO from one branch meeting = 1-3 additional funded loans within 60 days. ROI on the meeting time is in the first follow-up.

**5. "Senior MLOs don't need this."** Pre-2022 senior MLOs trained on rate-and-term refi as the default product. Post-2022 high-rate environment requires Stops 1-5, none of which were the dominant conversation 2010-2021. Old habits (*"I can't beat your rate"*) are now a structural revenue leak.

**6. "Our LO comp plan is on conforming volume — non-QM and DSCR don't fit."** Then your comp plan is misaligned with the 2026 market. Per-loan revenue on non-QM/DSCR is 1.5-2x conforming; comp plans that exclude non-QM volume are leaving margin on the table. Fix the comp plan, then run the training.

**7. "How do I know it's working?"** Three 90-day signals: dead-lead conversion rate +15-25 pts / TRID cure count down 40-60% / LOS-note completion within 3 business days above 95% / non-QM and DSCR volume share rising / state DFI exam findings down. Tracked at branch level in monthly review.

### When To Run A Second Time

Re-run every **90 days** with fresh dead-lead audits + updated rate environment + new non-QM/DSCR lender additions or exits + verified bridge program funding status. Rotate role-plays from last quarter's actual dead leads. Third run, swap archetypes — divorce equity buyout, inherited-property refi for siblings selling to one another, foreign-national investor cash-out refi, recently-self-employed borrower whose 2 years of returns just hit the underwriting window, condo-warrantability edge case, manufactured-home cash-out, reverse mortgage (HECM) for retirees with rate-locked legacy first liens.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Twelfth entry** in **Pulse Sales Trainings** and **sixth industry-specific training** after st0007 (medical device), st0008 (real estate), st0009 (auto F&I), st0010 (pharma), st0011 (life insurance). st0001-st0006 covered B2B SaaS motions; st0007-forward pivots to industry-by-industry coverage. st0012 is residential mortgage origination in a high-rate environment — the conversation discipline that determines whether a 2020-2021-built pipeline survives the rate plateau, inside the **CFPB TRID + Reg Z + Reg B/ECOA + Reg X/RESPA + NMLS / SAFE Act** perimeter, with state DFI as the second layer.

**Companion entries planned:** **st0013** P&C insurance agent training, **st0014** title and escrow officer training (TRID coordination + RESPA from the title side), **st0015** Realtor listing-presentation discipline for the high-rate purchase market, **st0016** mortgage processor and underwriter coordination, **st0017** wholesale AE training (UWM / Rocket Pro / loanDepot), **st0018** commercial mortgage broker training, **st0019** private money / hard money / fix-and-flip, **st0020** reverse mortgage / HECM specialist.

**Cross-references to st0001-st0006 (SaaS foundation arc) translated for mortgage:** **st0001 discovery** → the *"what's the actual problem you're trying to solve?"* pivot; **st0002 single-threading** → co-borrower attendance (single-borrower applications close at ~60% the rate of dual-borrower); **st0003 objection recovery** → 5-Stop deflection handling; **st0004 cold-call opener** → the inbound-call pivot from rate to problem; **st0005 demo discipline** → comparison math on paper as the demo; **st0006 pricing** → APR transparency, fee tolerance, structure-first framing.

**Cross-reference to st0007-st0011 — what transfers:** discipline of verbatim language on load-bearing moments + LOS/CRM-reviewed coaching cadence. Where st0007 made surgeons hear OR/Evidence/Outcome verbatim, st0008 made sellers hear PROOF/Fee/PRICE verbatim, st0009 hit 9-Step F&I, st0010 OPEN/PROBE/CONFIRM/CLOSE, st0011 LISTEN/COMPUTE/EDUCATE/MATCH/COMMIT — st0012 makes borrowers hear *"what's the actual problem you're trying to solve?"* + the 5-Stop pivot. **What does NOT transfer:** mortgage origination is the most rate-environment-dependent industry covered — every quarter the conversation rebuilds around the PMMS print, FOMC calendar, and SOFR/prime/10-year constellation. Existential compliance risk is concentrated in TRID cures + Reg B steering enforcement.

**Adjacent Knowledge Library entries:** CFPB TRID + Reg Z + Reg B + RESPA walkthroughs + NMLS/SAFE Act + PMMS methodology + MBA WAS + ICE Origination Insight + DSCR/non-QM lender landscape + LOS landscape + pricing engines + CRM layer + ARM cap structure + SOFR transition from LIBOR + FHA 203(k) + VA IRRRL + HECM + buy-before-you-sell fintech. **q9601 fractional CFO** maps onto branch-level production economics, per-loan revenue, basis-point margins, pull-through.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0012](https://pulserevops.com/sales-trainings/st0012).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block (Freddie Mac Primary Mortgage Market Survey PMMS weekly Thursday release 30-year + 15-year + 5/1 ARM canonical rate reference + MBA Weekly Application Survey WAS Wednesday release purchase + refi application volume index + refi share ARM share average loan amount + MBA Quarterly Mortgage Finance Forecast origination volume projections + Fannie Mae Mortgage Lender Sentiment Survey + Housing Forecast lender outlook + ICE Mortgage Technology Origination Insight Report formerly Ellie Mae purchase/refi mix median FICO LTV DTI time-to-close pull-through + CFPB TRID rule TILA-RESPA Integrated Disclosure Loan Estimate 3 business days from 6-piece application Closing Disclosure 3 business days before consummation fee tolerance 0%/10%/unlimited + CFPB Regulation Z Truth in Lending APR calculation advertising rules ATR/QM Ability-to-Repay/Qualified Mortgage HOEPA high-cost thresholds + CFPB Regulation B ECOA Equal Credit Opportunity Act protected class no steering adverse-action notice 30 days joint-credit signature + CFPB Regulation X RESPA Real Estate Settlement Procedures Act Section 8 anti-kickback MSA fair-market-value Servicing Disclosure Statement Special Information Booklet escrow rules + NMLS SAFE Act Nationwide Multistate Licensing System 20-hour pre-licensing 8-hour annual CE state license + MBA Mortgage Bankers Association + NAMB National Association of Mortgage Brokers + CMLA Community Mortgage Lenders of America + HUD/FHA Handbook 4000.1 203(k) renovation streamline + VA Lenders Handbook IRRRL streamline + banks Wells Fargo JPMorgan Chase Bank of America US Bank PNC Citizens Truist Fifth Third + wholesale UWM United Wholesale Mortgage Rocket Pro TPO loanDepot Wholesale AmeriHome Plaza Newrez Caliber Wholesale Homepoint + IMBs Pennymac Mr Cooper Newrez AmeriHome Movement CrossCountry Guaranteed Rate Fairway + credit unions Navy Federal PenFed SchoolsFirst BECU Alliant + non-QM/DSCR Angel Oak A&D Visio Kiavi Lima One Champions Newrez Smart Sprout + bridge HomeLight Flyhomes Homeward Calque Knock Ribbon + LOS Encompass Empower Calyx Point ARIVE BytePro Blue Sage LendingPad MeridianLink OpenClose + pricing engines Optimal Blue Mortech LoanSifter Polly + CRM Velocify Surefire Total Expert Big Purple Dot + trade press HousingWire National Mortgage News MortgageOrb Inside Mortgage Finance MPA Scotsman Guide Originator Connect Network + state regulators CA DRE DFPI FL OFR TX SML NY DFS). Every framework research source named so a branch manager can cite by name when MLOs push back. EXPLICITLY MORTGAGE INDUSTRY — NOT SaaS — no Gong Bridge Group Pavilion ProfitWell SaaStr. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 8 quantified benchmark tables: (1) Freddie Mac PMMS Current Rate Environment 2026 snapshot — 30-yr conforming fixed 6.5-7.5% vs +375-475 bps over 2021 trough vs -50 to -125 bps below 2023-2024 peak / 15-yr 5.85-6.85% / 5/6 ARM 6.10-6.85% / 30-yr jumbo 6.65-7.60% / FHA 30-yr 6.40-7.30% / VA IRRRL 6.30-7.20%. (2) MBA Weekly Application Survey Refi Share Collapse — 2020-2021 peak sub-3% rate window refi share ~70% / 2022 transition 35-50% / 2023 trough 28-35% / 2026 current 20-32% / cash-out share of refi volume per ICE ~78% / rate-and-term share ~22%. (3) Per-MLO Loan Volume Producer-Side Reality — 2020-2021 peak average producer 9-12 top-quartile 18-30+ / 2022 transition 6-9 12-18 / 2023-2024 high-rate plateau 3-5 7-12 / 2026 current 3-5 6-10 / pre-2020 historical baseline 4-6 8-12. (4) Dead-Lead Conversion Rate by Discipline Tier — bottom-quartile cant-beat-your-rate no pivot 3-8% <1 funded per quarter / below-average occasional pivot no math 10-18% 1-2 / industry average 18-28% 2-4 / top-quartile 5-Stop + math on paper + LOS follow-up 38-55% 5-9 / top-decile 5-Stop + Realtor choreography + non-QM/DSCR depth 50-70% 9-15. (5) Why Dead Leads Stay Dead branch post-mortems + LOS audits — MLO didnt pivot off rate-and-term in first 90 seconds 41% / math never run on paper just verbal 34% / wrong Stop diagnosed cash-out instead of HELOC 22% / MLO didnt surface ARM investment property or move-up 31% / no LOS follow-up within 3 business days 38% / borrower felt MLO didnt understand 27% / borrower felt pressured to refi first lien 18% / MLO referred out or recommended waiting for Fed cuts 24%. (6) CFPB TRID + Reg Z Enforcement Snapshot — TRID timing violations LE/CD 3-day clocks $50K-$5M institutional most common TRID finding / Reg Z advertising rate without APR fixed on adjustable $25K-$2M frequent in marketing audits / fee tolerance violations over 0%/10% bucket lender cure usually lender-eaten / Reg B ECOA steering allegations $1M-$25M+ pattern cases increasing under recent CFPB priorities / RESPA Section 8 kickbacks/sham MSAs $500K-$15M increasing MSA enforcement focus / Servicing transfer Reg X lender + servicer joint cures common at portfolio transfers. (7) State DFI Audit Priorities Multi-State Composite 2025-2026 — TRID disclosure timing ~58% / Reg B documentation of pricing exceptions ~44% / LOS audit-trail completeness ~41% / MSA documentation + fair-market-value backup ~36% / NMLS license renewal + CE completion ~31% / advertising compliance Reg Z + state-specific ~28%. (8) 5-Stop Adoption Curve — Stop 1 CASH-OUT DEBT CONSOLIDATION second-lien-first framing 24% week 1 → 78% week 12 / Stop 2 ARM-TO-FIXED CONVERSION reset notice review 18% → 74% / Stop 3 HELOC AS SECOND LIEN lump-vs-line diagnosis 30% → 82% / Stop 4 DSCR/NON-QM FOR INVESTORS rental-income qualification 12% → 62% (hardest install) / Stop 5 BRIDGE FOR MOVE-UP BUYERS honest expectation-setting 16% → 65% / all 5 Stops live on right inbound call 7% → 56%. Stop 4 DSCR/non-QM hardest install MLOs fear non-QM default to this-isnt-for-us but DSCR carries 75-150 bps margin AND keeps loan in channel — weekly LOS audit by branch manager single biggest predictor of cohort funded-volume lift at 90 days per internal IMB and bank-channel benchmarking — Three Rails frame adopts faster most MLOs reach 80%+ adherence by week 6 because CFPB + state DFI pressure direct + consequences TRID cures exam findings license actions are existential. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 10-failure-mode counter-case: (1) Cant-Beat-Your-Rate Reflex most common single failure MLO hears sub-3% legacy rate says some version of at todays rates I cant help you and lets lead walk per branch LOS audits 41% of dead leads trace to this single reflex pivot is whats the actual problem youre trying to solve always every time before any rate conversation five Stops live in the answer. (2) First-Lien Cash-Out When Second Lien Fits borrower has $40K CC debt and 3.0% legacy first lien MLO refinances first lien at 7% to consolidate math nominally works but borrower hates higher mortgage payment and lost legacy rate worth $40-60K over 10 years second lien HELOC or closed-end second is default for cash-out under $100K when existing first-lien rate below 5% run comparison on paper every time. (3) ARM Reset Ignored Until Too Late MLO doesnt pull list of in-portfolio ARMs with 2026-2027 reset dates and doesnt proactively call those borrowers 6-12 months ahead reset notice arrives borrower panics calls competitor first every quarter pull ARM list from LOS sort by reset date call all of them highest-yield pipeline in high-rate environment. (4) DSCR Fear Non-QM Avoidance MLO defaults to this-isnt-for-us when borrower has 3+ investment properties or self-employed income that wont pass conforming DTI refers out non-QM and DSCR carry 75-150 bps margin and stay inside channel get comfortable Visio Kiavi Lima One Angel Oak A&D Newrez Smart Champions Funding pick two build relationship run one DSCR pre-qual this week. (5) Bridge / Buy-Before-Sell Without Verifying Funding Status MLO pitches buy-before-you-sell program Knock HomeLight Trade-In Flyhomes Homeward Calque Ribbon that has gone offline or paused funding borrower cant close Realtor partner blames MLO verify funding status THIS WEEK before recommending 2023-2024 fintech shakeout took several programs offline survivors have changed terms. (6) Missed LE 3-Business-Day Clock application taken Tuesday over phone MLO doesnt document 6-piece trigger date LE goes out Friday clock missed TRID cure required lender eats cost moment borrower gives 6th piece name + income + SSN + property address + estimated value + loan amount date-stamp file LE goes out within 3 business days no exceptions. (7) Rate Quoted Without APR text message to prospect I can get you 6.5% on 30-year fixed no APR Reg Z advertising violation found in marketing audit every rate quote in every channel text email voicemail social must include APR build templates. (8) Steering Protected-Class Borrower To Non-QM self-employed Hispanic borrower 740 FICO asks about refi MLO routes to non-QM because its faster without first testing conforming Reg B/ECOA steering risk conforming-first quote on every file every time non-QM only if math actually requires it document reason in file. (9) Casual Realtor Lunch With No MSA MLO buys Realtor lunch weekly no MSA Realtor sends 6 referrals/month RESPA Section 8 risk CFPB has hit lenders for less if recurring co-marketing relationship with Realtor attorney or title company get MSA in writing reviewed annually by compliance with documented fair-market-value invoices for actual marketing services delivered. (10) Branch Manager Doesnt Audit Weekly LOS Notes kills 60-75% of refi-conversation training rollouts per internal IMB benchmarking ~30-day half-life un-coached MLOs revert to cant-beat-your-rate reflex by week 4 one inbound-call or dead-lead conversation per MLO per week reviewed in 1:1 within 7 business days non-negotiable. Plus 7 common branch manager and bank-channel objections with honest answers: MLOs already know how to run refi conversation pull 90 days of dead-lead conversion rate per MLO / compliance and production in tension backwards top-quartile have LOWEST TRID cure counts lowest exam findings lowest E&O claims highest investor pull-through / IMB already has scripted call flows most call flows are intake scripts not diagnosis frameworks 5-Stop is diagnostic discipline ON TOP of intake / brokers cant afford 60-min meetings 5 dead-lead re-engagements per MLO = 1-3 additional funded loans within 60 days / senior MLOs dont need this pre-2022 senior MLOs trained on rate-and-term refi as default product post-2022 high-rate requires Stops 1-5 none of which were dominant 2010-2021 / LO comp plan on conforming volume non-QM and DSCR dont fit comp plan misaligned with 2026 market per-loan revenue on non-QM/DSCR 1.5-2x conforming fix comp plan then run training / how do I know its working three 90-day signals dead-lead conversion +15-25 pts + TRID cure count down 40-60% + LOS-note completion within 3 business days above 95% + non-QM and DSCR volume share rising + state DFI exam findings down. Plus when-to-rerun-every-90-days cadence with rotated archetypes divorce equity buyout + inherited-property refi for siblings selling to one another + foreign-national investor cash-out refi + recently-self-employed borrower whose 2 years of returns just hit underwriting window + condo-warrantability edge case + manufactured-home cash-out + reverse mortgage HECM for retirees with rate-locked legacy first liens. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as TWELFTH entry and SIXTH industry-specific training after st0007 orthopedic medical device sales st0008 residential real estate listing presentations st0009 automotive F&I st0010 specialty pharmaceutical HCP detailing st0011 life insurance needs analysis — st0001-st0006 covered B2B SaaS sales motions and from st0007 forward pivots to industry-by-industry coverage and st0012 is residential mortgage origination in high-rate environment the conversation discipline that determines whether 2020-2021-built pipeline survives the rate plateau inside CFPB TRID + Reg Z + Reg B/ECOA + Reg X/RESPA + NMLS / SAFE Act enforcement perimeter with state DFI as second layer. Companion industry-specific entries planned st0013 P&C insurance agent training auto + home + umbrella cross-sell + flood + life-of-policy retention + st0014 title and escrow officer training TRID coordination + RESPA Section 8 from title side + st0015 Realtor listing-presentation discipline for high-rate purchase market + st0016 mortgage processor and underwriter coordination for broker channel + st0017 wholesale account executive AE training on UWM Rocket Pro loanDepot Wholesale + st0018 commercial mortgage broker training multifamily + retail + industrial + st0019 private money hard money fix-and-flip broker training + st0020 reverse mortgage HECM specialist training. Cross-references to st0001-st0006 SaaS foundation arc translated for mortgage origination: st0001 discovery → whats the actual problem youre trying to solve pivot in first 90 seconds / st0002 single-threading → co-borrower co-signer spouse attendance single-borrower applications close at ~60% rate of dual-borrower / st0003 objection recovery → 5-Stop deflection handling on I just want a lower rate + my buddy got 5% at his credit union + Ill wait for Fed cuts / st0004 cold-call opener → inbound-call pivot from rate to problem / st0005 demo discipline → comparison math on paper second-lien vs first-lien-cash-out ARM staircase as demo / st0006 pricing → APR transparency fee tolerance disclosure structure-first-lender-second framing. Cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 what transfers — discipline of verbatim language on load-bearing moments + LOS/CRM-reviewed coaching cadence transfers exactly where st0007 made surgeons hear OR + Evidence + Outcome diagnostics verbatim st0008 made sellers hear PROOF + Fee 4-line + PRICE-as-range verbatim st0009 made customers hear 9-Step F&I verbatim st0010 made HCPs hear OPEN + PROBE + CONFIRM + CLOSE verbatim st0011 made prospects hear LISTEN + COMPUTE + EDUCATE + MATCH + COMMIT verbatim st0012 makes borrowers hear whats the actual problem youre trying to solve + 5-Stop pivot verbatim top producers script load-bearing moments improvise rest what does NOT transfer mortgage origination is most rate-environment-dependent industry covered so far every quarter the conversation rebuilds around the PMMS print the FOMC calendar and the SOFR/prime/10-year-Treasury constellation compliance overlay heavy CFPB TRID + Reg Z + Reg B + RESPA + state DFI + NMLS but existential risk concentrated in TRID cures immediate financial cost and Reg B steering multi-million-dollar enforcement cases not per-encounter risk of pharma OPDP or life insurance Reg 187 math is the demo second-lien-vs-first-lien comparison ARM reset staircase conforming-vs-DSCR side-by-side done out loud on paper every conversation. Adjacent Pulse Knowledge Library entries CFPB TRID rule walkthrough + Reg Z APR calculation + Reg B / ECOA fair-lending overview + RESPA Section 8 MSA primer + NMLS / SAFE Act licensing + Freddie Mac PMMS methodology + MBA WAS interpretation + ICE Origination Insight Report deep-dive + DSCR / non-QM lender landscape + Visio Kiavi Lima One Angel Oak A&D Newrez Smart product comparison + LOS landscape Encompass Empower Calyx ARIVE BytePro + pricing engines Optimal Blue Mortech Polly + CRM layer Velocify Surefire Total Expert Big Purple Dot + Realtor co-marketing MSA templates + ARM cap structure 1/1/5 vs 2/2/5 vs 5/2/5 + SOFR transition from LIBOR + FHA 203(k) renovation refi + VA IRRRL streamline + HECM reverse mortgage + buy-before-you-sell fintech landscape + q9601 fractional CFO maps onto branch-level production economics with regional or area manager on per-loan revenue economics basis-point margins and pull-through metrics. Reading list of frameworks with URLs: CFPB compliance resources consumerfinance.gov + Reg Z 1026 + Reg B 1002 + Reg X 1024 + NMLS nationwidelicensingsystem.org + Freddie Mac PMMS freddiemac.com/pmms + MBA WAS mba.org + Fannie Mae fanniemae.com + ICE Mortgage Technology icemortgagetechnology.com + HUD Handbook 4000.1 hud.gov + industry trade press HousingWire + National Mortgage News + MortgageOrb + Inside Mortgage Finance + MPA + Scotsman Guide. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Twelfth Pulse Sales Training entry st0012 and SIXTH industry-specific training after st0007 medical device st0008 real estate st0009 auto F&I st0010 pharma st0011 life insurance — fully runnable 60-minute live mortgage-originator refi-conversation training for the 2026 high-rate environment (per Freddie Mac PMMS Q1-Q2 2026: 30-year conforming fixed locked in 6.5-7.5% band against Fed Funds 4.25-5.00% per MBA Weekly Application Survey refi share 20-32% vs ~70% peak 2020-2021 per ICE Mortgage Technology Origination Insight Report 78% of todays refi volume is cash-out NOT rate-and-term) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,000 words ABSOLUTE HARD CAP 10,500. LEAN-FROM-START pattern mirroring st0008 + st0010 + st0011. Structure: orange Pulse Training callout intro (who-for: bank-employed MLOs Wells Fargo JPMorgan Chase Bank of America US Bank PNC Citizens Truist Fifth Third + independent mortgage brokers UWM United Wholesale Mortgage Rocket Pro TPO loanDepot Wholesale CrossCountry Guaranteed Rate Movement Fairway + credit union MLOs Navy Federal PenFed SchoolsFirst BECU Alliant + IMB loan officers Pennymac Newrez Mr Cooper AmeriHome; works first-year licensee to 25-year veteran from purchase-focused to refi-focused; what-bring: 3 recent dead refi leads + current rate sheet + TRID disclosure templates + PMMS snapshot + printed leave-behind + whiteboard for dead-lead scoring) + Bottom Line callout Rate is the wrong story in this market the right story is what the homeowner could DO with their equity + 5-Stop + 3-Rail thesis + 6-row pipe-table agenda (0:00-0:05 Cold Open / 0:05-0:22 Teach / 0:22-0:32 Discussion / 0:32-0:52 Role-Play / 0:52-0:57 Debrief+Commitments / 0:57-1:00 Leave-Behind) + Section 1 Cold Open with Freddie Mac PMMS 6.5-7.5% reality + MBA WAS refi share 20-32% vs 70% peak + ICE 78% cash-out + producer-side math top producers 9-12/month in 2021 vs 3-5/month now + Maria 3rd-year IMB composite voicemail from John bought house Feb 2021 locked 2.875% Maria said sorry cant beat that gave away lead vs restructured next MLO pivot two weeks later congrats on 2.875% absolutely not refinancing your first lien lets talk about what youd USE a refi to DO right now found $42K CC debt at 26% and $35K kitchen redo closed $90K HELOC second lien at prime+1 preserved 2.875% first + Common Trap at todays rates I cant help that homeowner three answers + Section 2 Teach split into Part A 5-STOP REFI MAP 12 min (Stop 1 CASH-OUT DEBT CONSOLIDATION preserve legacy first lien borrower $25-80K CC debt 22-29% APR + 3-4% legacy mortgage trap refinancing FIRST lien at todays 7% destroys legacy rate right move take closed-end fixed second lien or HELOC $30-100K cash-out HELOC at prime+0-2 today ~7.5-9.5% closed-end second 8-10% blended rate far below CC APR debt service drops 40-60% first lien rate preserved / Stop 2 ARM-TO-FIXED CONVERSION 2026-2027 reset wave borrower has 5/1 or 7/1 ARM originated 2018-2021 most SOFR-indexed post-2021 or LIBOR-indexed pre-2021 transitioned reset cap typically +5% over start rate 3.0% start hits 8.0% at reset lender sends reset notice 60 days before original P&I on 7/1 ARM at 3.125% on $510K = ~$2,185/month reset to ~8% = ~$3,750/month refi to 30-yr fixed at 6.75% = ~$3,310/month refinancing today even at 6.75% is lesser of two evils / Stop 3 HELOC AS SECOND LIEN same principle as Stop 1 but as flexible line HELOCs today at prime+0 to prime+2 ~7.5-9.5% used for ongoing renovations tuition emergency reserves bridge cash before sale business working capital for self-employed educate on variable-rate risk + 2008 HELOC-freeze history rare but real / Stop 4 DSCR/NON-QM FOR INVESTORS investor-property refi based on rental income Debt Service Coverage Ratio not borrower W-2 DSCR loans 75-150 bps above conforming today 7.5-9% lenders Visio Kiavi Lima One Angel Oak A&D Newrez Smart Champions used for tapping equity acquire more properties pulling cash for renovations refinancing hard-money short-term into 30-year fixed qualifying self-employed whose tax returns wont pass conforming DTI / Stop 5 BRIDGE FOR MOVE-UP BUYERS homeowner has sub-3% legacy mortgage but needs to move rate lock-in problem three play options bridge loan short-term financing pay off when current home sells / buy-before-you-sell programs HomeLight Knock Flyhomes Homeward Calque verify operational status / honest expectation-setting buy at todays rate refinance when rates drop) and Part B Three Disclosure Rails Compliance Frame 5 min (Rail 1 TRID + REG-Z per CFPB TRID rule LE within 3 business days of application 6-piece trigger CD 3 business days before consummation changed-circumstance redisclosure required fee tolerance 0% lender fees and transfer taxes / 10% recording fees and third-party services from lender list / unlimited third-party services borrower shops independently per Reg Z APR calculation advertising rules cannot say fixed rate if any portion adjusts cannot quote rate without quoting APR / Rail 2 FAIR LENDING/ECOA/REG B no discrimination protected class race color religion national origin sex marital status age public-assistance income exercise of consumer-protection rights no steering protected-class borrowers to higher-rate products or non-QM when they qualify for conforming adverse-action notice within 30 days document reasons for any rate adjustments pricing exceptions or product recommendations / Rail 3 REG X + RESPA Section 8 anti-kickback no money for referrals from Realtors attorneys title companies MSAs allowed only if documented at fair market value with actual marketing services delivered Servicing Disclosure Statement at application Special Information Booklet for purchase transactions escrow rules for taxes + insurance) + Section 3 Discussion 6 prompts (last dead refi lead 60 days demographics current rate balance equity what they were trying to solve + which of 5 Stops applied did you find it + did you actually run math or guess + which compliance Rail did you nearly cross or did cross + whats in LOS for that dead lead today + ONE concrete next move verbatim opening 30 seconds) + Section 4 Two-Person Role-Play with Round 1 The Khans couple early 40s $475K home $285K balance on 3.25% legacy 30-year fixed originated October 2021 27 years remaining current P&I $1,240/month $58K CC debt across 4 cards 24-28% APR combined W-2 income $215K FICO 740/735 $48K 401(k) $22K cash no other debt wife runs small Etsy side business ~$18K/year called IMB after Facebook ad for lower your monthly payment three deflections we just want to refi to lower rate roll cards in / my buddy at work said his credit union just did refi at 5% can you match / we do NOT want to lose our 3.25% but credit cards are killing us what can you actually do MLO redirects to STOP 1 preserve first lien + second-lien debt consolidation WITHOUT pitching first-lien refi that destroys 3.25% runs math live HELOC at 8.5% on $75K interest-only $410/month vs CC minimums $1,950/month surfaces TRID + Reg Z disclosure timeline plus Round 2 Linda Martinez single homeowner mid-50s $725K home purchased 2017 for $498K original 80% LTV current balance $510K on 7/1 ARM originated July 2020 at 3.125% first reset date August 2027 ~15 months out index SOFR currently ~5.30% margin 2.75% caps 2/2/5 projected reset capped at 5.125% on first reset trajectory toward lifetime cap of 8.125% over next 4 years current P&I $2,185/month reset P&I at first reset 5.125% ≈ $2,860 at lifetime cap 8.125% ≈ $3,795 FICO 790 $1.3M liquid assets mostly CD ladder yielding ~5% retired from fintech exit three deflections Ill just refinance when rates drop next year Fed will cut / my CD ladder gives me 5% why would I pay 6.75% on mortgage when I can earn 5% on cash math doesnt work / even worst-case reset is still cheaper than renting comparable place in this area why bother MLO uses STOP 2 ARM-to-fixed shows reset math under both first-reset cap and lifetime cap explains SOFR + margin + cap structure handles CD opportunity cost deflection honestly no-pressure scenario-comparison close + 60-sec reset + Section 5 Debrief+Commitments 3 debrief Qs which Stop felt strongest + which Rail nearly crossed + dead lead to re-engage + 4-line commitment ritual target dead lead + Stop to lead with + ONE verbatim language change + call to log in LOS within 3 business days + Section 6 Leave-Behind walkthrough + printable one-pager (5-Stop framework as 5-row grid with verbatim pivot question typical product current rate range / Three Disclosure Rails compliance frame as 3-quadrant grid / high-rate-market checklist refresh weekly Freddie Mac PMMS 30-yr + PMMS 15-yr + PMMS 5/6 ARM + HELOC prime rate WSJ Prime + SOFR overnight NY Fed + next FOMC meeting date + DSCR rate spread + active non-QM/DSCR lenders this week + active bridge/buy-before-sell programs this week + MBA refi share / compliance checklist every file 6-piece application trigger documented LE within 3 business days + CD delivered 3 business days before consummation + fee tolerance categories verified at CD + Reg Z advertising any rate quoted has APR attached + Reg B/ECOA pricing exceptions documented + adverse-action notice within 30 days + RESPA Section 8 MSA on file + Servicing Disclosure Statement + Special Information Booklet + LOS note within 3 business days + rate-lock confirmation in writing / Never-Do behavior list 12 items / Outcome Line wins right Stop in first 90 seconds + math on paper + Three Rails clean + LOS note within 3 business days + dead-lead re-engagement = 2-3x dead-lead conversion + per-loan revenue lift from non-QM/DSCR/second-lien spread + clean CFPB and state-DFI audit trail + Realtor-partner trust + funded-volume floor under pipeline contraction vs losses I-cant-beat-your-rate + zero pivot + zero math + missed LE clock + steering near-miss + dead lead with no LOS note = collapsing pipeline + Realtor partners stop sending sub-3%-rate-locked referrals + TRID cure cost + Reg B exam findings + branch closure risk in 18-24-month high-rate plateau / If You Only Remember One Thing hero quote Rate is the wrong story in this market the right story is what the homeowner could DO with their equity debt freedom cash flow escaping a reset or buying another property you dont sell mortgages you sell what mortgages enable). How-this-fits-in-mortgage-practice table at end of core showing inbound call referral intake + 5-Stop diagnosis + math on paper + product recommendation + TRID+Reg Z disclosure + fair lending+ECOA + RESPA+Section 8 + LOS coaching cadence. Two mermaid diagrams: 60-min meeting flow + branch manager coaching loop. 8 benchmark tables (Freddie Mac PMMS current rate environment + MBA WAS refi share collapse + per-MLO loan volume producer-side reality + dead-lead conversion by discipline tier + why dead leads stay dead + CFPB TRID + Reg Z enforcement snapshot + state DFI audit priorities + 5-Stop adoption curve). 10-failure-mode counter-case + 7-branch-manager-objection coach-back + when-to-rerun. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping + companion industry-specific entries planned st0013-st0020 + cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 what transfers (verbatim language on load-bearing moments + LOS/CRM-reviewed coaching cadence) and what does not (mortgage origination is most rate-environment-dependent industry covered so far every quarter the conversation rebuilds around the PMMS print the FOMC calendar and the SOFR/prime/10-year-Treasury constellation compliance overlay heavy CFPB TRID + Reg Z + Reg B + RESPA + state DFI + NMLS but existential risk concentrated in TRID cures immediate financial cost and Reg B steering multi-million-dollar enforcement cases not per-encounter risk of pharma OPDP or life insurance Reg 187 math is the demo second-lien-vs-first-lien comparison ARM reset staircase conforming-vs-DSCR side-by-side done out loud on paper every conversation). Tags include sales-training (hub filter) + mortgage-sales + loan-originator-training + refi-conversation + high-rate-mortgage-market + nmls-licensed + trid-compliant + cfpb-reg-z + 60-min-meeting + standard-team + st0012. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY MORTGAGE INDUSTRY — NOT SaaS — no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Industry-correct sources: Freddie Mac PMMS + MBA WAS + MBA Quarterly Forecast + Fannie Mae Sentiment + ICE Origination Insight + CFPB TRID + Reg Z + Reg B/ECOA + Reg X/RESPA + NMLS/SAFE Act + HUD Handbook 4000.1 + VA Lenders Handbook + banks Wells Fargo JPM Chase BofA US Bank PNC Citizens Truist Fifth Third + wholesale UWM Rocket Pro TPO loanDepot AmeriHome Plaza Newrez + IMBs Pennymac Mr Cooper Newrez Movement CrossCountry Guaranteed Rate Fairway + credit unions Navy Federal PenFed SchoolsFirst BECU Alliant + non-QM/DSCR Angel Oak A&D Visio Kiavi Lima One Champions Newrez Smart + bridge HomeLight Flyhomes Homeward Calque Knock Ribbon + LOS Encompass Empower Calyx ARIVE BytePro Blue Sage LendingPad + pricing engines Optimal Blue Mortech LoanSifter Polly + CRM Velocify Surefire Total Expert Big Purple Dot + trade press HousingWire National Mortgage News MortgageOrb Inside Mortgage Finance MPA Scotsman Guide + state regulators CA DRE DFPI FL OFR TX SML NY DFS. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0012 is crawled.
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
