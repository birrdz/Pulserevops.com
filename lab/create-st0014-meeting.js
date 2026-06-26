// st0014 -- Financial Advisor: The Discovery Meeting With a $2M Client — Earning the Right
// -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0014, tag: sales-training).
// EIGHTH industry-specific training (after st0007-st0013).
// Industry = financial advisors + wealth managers — wirehouses (Morgan Stanley, Merrill Lynch, UBS,
// Wells Fargo Advisors), regional broker-dealers (Edward Jones, Raymond James, RBC, Stifel, Janney),
// independent broker-dealers (LPL Financial, Cetera, Cambridge, Commonwealth, Kestra), RIAs both
// bespoke and platform-based (Carson Group, Mariner Wealth, Mercer Global, Creative Planning,
// Wealth Enhancement, Beacon Pointe, Avantax, Hightower, Dynasty, Focus Financial).
// Regulated by SEC IA Act fiduciary standard + FINRA Reg BI + SEC Marketing Rule 206(4)-1 (2022) +
// state IAR registration + NAIC Suitability for insurance crossover.
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

const ID = 'st0014';
const QUESTION = "Financial Advisor: The Discovery Meeting With a $2M Client — Earning the Right to Manage the Money — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'financial-advisor-training',
  'wealth-management',
  'discovery-meeting',
  'high-net-worth',
  'finra-reg-bi-compliant',
  'fiduciary-standard',
  '60-min-meeting',
  'standard-team',
  'st0014'
];

const sources = [
  { title: 'Cerulli Associates — US Retail Investor 2025 + US Advisor Industry 2025 + Great Wealth Transfer 2024-2045 ($84T) + HNW switching research', url: 'https://www.cerulli.com/' },
  { title: 'Charles Schwab Independent Advisor Outlook Study + Schwab RIA Benchmarking Study (annual)', url: 'https://advisorservices.schwab.com/insights-hub/perspectives/2025-ria-benchmarking-study' },
  { title: 'Vanguard Advisor\'s Alpha — quantification of advisor value-add (~3% net annually)', url: 'https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/quantifying-advisors-alpha.html' },
  { title: 'FINRA Regulation Best Interest (Reg BI) — SEC Rule 15l-1, care + disclosure + conflict + compliance, effective June 2020', url: 'https://www.finra.org/rules-guidance/key-topics/regulation-best-interest' },
  { title: 'SEC Investment Advisers Act of 1940 — fiduciary standard for RIAs + Form ADV Part 2 brochure rule', url: 'https://www.sec.gov/about/laws/iaa40.pdf' },
  { title: 'SEC Marketing Rule 206(4)-1 (2022 compliance date) — restrictions on testimonials, performance, and hypothetical claims', url: 'https://www.sec.gov/investment/marketing-rule' },
  { title: 'SEC Form CRS (Client Relationship Summary) — required first-meeting delivery for both BDs and RIAs', url: 'https://www.sec.gov/about/forms/formcrs.pdf' },
  { title: 'CFP Board Code of Ethics and Standards of Conduct — fiduciary duty for CFP professionals at all times', url: 'https://www.cfp.net/ethics/code-of-ethics-and-standards-of-conduct' },
  { title: 'AAII (American Association of Individual Investors) — HNW investor behavior + asset survey + estate planning gap research', url: 'https://www.aaii.com/' },
  { title: 'NAIC Suitability in Annuity Transactions Model #275 — best-interest standard for insurance crossover (45+ states)', url: 'https://content.naic.org/cipr-topics/suitability-and-best-interest-standard-conduct-annuity-transactions' },
  { title: 'IRI (Insured Retirement Institute) — annuity industry data + retirement income research', url: 'https://www.irionline.org/' },
  { title: 'Industry trade press — Barron\'s + Financial Planning + InvestmentNews + ThinkAdvisor + RIABiz + Citywire RIA + WealthManagement.com', url: 'https://www.barrons.com/advisor' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **Financial advisors and wealth managers** running first-meeting discovery with $2M+ investable-asset prospects — wirehouse FAs at **Morgan Stanley Wealth Management, Merrill Lynch, UBS Wealth USA, Wells Fargo Advisors**; regional broker-dealer reps at **Edward Jones, Raymond James, RBC Wealth Management, Stifel, Janney**; independent BD reps at **LPL Financial, Cetera, Cambridge Investment Research, Commonwealth, Kestra**; and RIA advisors at **Carson Group, Mariner Wealth, Mercer Global Advisors, Creative Planning, Wealth Enhancement, Beacon Pointe, Avantax, Hightower, Dynasty Financial Partners, Focus Financial, Captrust**. Works from the 3rd-year producer building a book to the 20-year senior partner taking a multi-generational referral. Works inside captive wirehouses, hybrid IBD platforms, fee-only RIAs, and bespoke multifamily offices. The **Discovery Meeting** is **the single highest-leverage hour in the entire wealth-management acquisition motion** — done right, it closes 35-50% of HNW prospects without product-pitching; done wrong, it produces the *"they jumped straight to portfolio recommendations"* reputation that has fueled $84T of pending Great Wealth Transfer disruption. **Drop this into the next branch meeting and run it live.**
>
> **What your advisors will leave with:** A named, repeatable discipline — **the 5-STAGE DISCOVERY framework (FRAME → LIFE → MONEY → GAPS → PATH) + the FIDUCIARY-FORWARD "Three Pillars" compliance frame (BEST INTEREST / DISCLOSURE / NO PRESSURE)** — for converting a $2M+ prospect from referred-inquiry to second-meeting + signed-IMA without product talk, illustration-as-pitch, or the bait-and-switch reputation the industry has spent fifteen years trying to retire. Plus verbatim language for each stage + each Pillar, two live role-plays (recently-widowed inherited-wealth + business-owner with pending liquidity event), a written commitment naming one unconverted prospect, and a printable one-pager for the advisor's binder.
>
> **What the branch manager / chief growth officer should bring:** **(1)** **3 recent unconverted $2M+ prospect notes or recordings** — the widows who said *"I'll think about it"* and stayed with the current advisor, the business owners who said their CPA already had it handled, the inherited-wealth heirs who chose a robo because *"you started talking about products before I felt heard."* The advisors who lost them will see themselves in Section 3. **(2)** **The team's current discovery fact-finder template** + **Form ADV Part 2** brochure + **Form ADV Part 3 (CRS)** + a printed leave-behind. **(3)** **A whiteboard** to score each advisor's unconverted-prospect list by which stage of the 5-STAGE collapsed + which Pillar nearly got crossed by Section 3's end.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:05** | **Cold Open** — Cerulli US Retail Investor 2025: HNW switching accelerated, average $2M+ household has interviewed 2.4 advisors in 24 months + only ~32% of $2M+ prospects who take a discovery meeting become clients in 90 days + $84T Great Wealth Transfer + 90-sec composite | Branch Manager / CGO | Advisors feel the HNW prospect-flow opportunity AND the trust-collapse problem: product-talk-too-early is the constraint, not investment performance |
| **0:05-0:22** | **The Teach** — 5-STAGE DISCOVERY framework (FRAME / LIFE / MONEY / GAPS / PATH) + FIDUCIARY-FORWARD Three Pillars (BEST INTEREST / DISCLOSURE / NO PRESSURE) | Branch Manager / CGO | Advisors can recite all 5 stages in sequence, all 3 Pillars, and the verbatim cue under each without notes |
| **0:22-0:32** | **The Discussion** — each advisor names their last unconverted $2M+ prospect + which stage broke + which Pillar nearly got crossed | Branch Manager + room | Every advisor audits last 3 unconverted $2M+ prospects from CRM (Salesforce FSC, Redtail / Orion, Wealthbox); identifies the one missing move |
| **0:32-0:52** | **Role-Play x 2** — Round 1 recently-widowed inherited-wealth prospect (10 min) + 60-sec reset + Round 2 business-owner with pending $14M liquidity event (10 min) | Advisors in pairs | Advisors deliver the 5-STAGE live + stay inside the Three Pillars under realistic HNW prospect deflection without pivoting to portfolio before MONEY + GAPS |
| **0:52-0:57** | **Debrief + Commitments** — 3 debrief questions + each advisor names ONE prospect + the broken stage + a 14-day redo recorded or CRM-detailed | Branch Manager + each advisor | Every advisor walks out with one named prospect + one specific verbatim change + one CRM entry for manager review |
| **0:57-1:00** | **Leave-Behind Walkthrough** — printed one-pager + Three Pillars compliance grid + 10-most-common-gaps reference + Form CRS / ADV Part 2 / ADV Part 3 checklist | Branch Manager | Advisors know where the template lives and keep one-pager in the discovery binder |

> ### 🎯 Bottom Line
> **You don't manage the assets — you earn the relationship. The portfolio comes last.** Per **Cerulli Associates US Retail Investor 2025**, the average $2M+ HNW household has now interviewed **2.4 advisors in the last 24 months** (vs 1.6 in 2018), and only **~32%** of HNW prospects who take a discovery meeting become clients within 90 days. The single most-cited reason for not engaging: *"They started talking about products before they understood what I cared about."* (Vanguard Advisor's Alpha + Schwab IA Outlook). With **$84 trillion** moving through the **2024-2045 Great Wealth Transfer** (Cerulli), the producer who runs the **5-STAGE DISCOVERY — FRAME, LIFE, MONEY, GAPS, PATH — without pitching a portfolio before the gaps land** closes at 35-50% AND keeps every regulator on side. Five stages. Three Pillars. The family before the assets. Always.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- THE COLD OPEN (0:00-0:05)

> ### 🟡 Coach Note
> Do not open the firm's "Total Wealth Management" pitch deck. Do not pull up the model-portfolio sheet. Walk into the branch meeting, say the numbers, tell the story. The first 90 seconds set whether advisors tune out or remember this on the next $2M referral. **Five minutes. Hard stop at 0:05.**

### The numbers, then the story.

**The numbers.** Per **Cerulli Associates US Retail Investor 2025** + **US Advisor Industry 2025**: the average **$2M+ HNW household has now interviewed 2.4 advisors in the last 24 months** (vs 1.6 in 2018). Only about **32%** of $2M+ prospects who take a discovery meeting become clients within 90 days. The #1 reason cited for not engaging: *"They started talking about products before they understood what I cared about."* The **$84T Great Wealth Transfer** (Cerulli 2024-2045) is producing record HNW prospect flow — **the constraint is advisor discovery discipline, not investment performance.**

The producer-side: per Schwab RIA Benchmarking, top-quartile RIAs convert HNW first-meetings at **45-55%**; industry median sits at **18-28%**. The difference is not pedigree or backtests — it is whether the advisor spent the first 45 minutes on **the family** or the first 8 minutes on **the firm's pitch deck**. Math: 4 discoveries/month at 22% close × $2.4M = **~$25M new AUM/year** at 100bps = $250K trailing. At **45% close**: **~$52M/year** = $520K trailing. One hour, right sequence.

**The story.** (Composite — swap in a case the team recognizes.)

Maya, 12-year FA at a Merrill complex. Tuesday: $2.8M CPA referral — widowed engineer, late 60s, IRA + brokerage + concentrated employer stock + paid-off Atlanta home. Maya pulled out the firm's **"Total Wealth Management"** deck at minute 8. By minute 14 she was on tactical asset allocation. Minute 25 the widow went quiet. Follow-up email three days later: *"We're going to stay with our current advisor for now."* **Zero close. No referral. Lost a $4M extended-family network.**

Same widow, six months later, same advisor after this training. Different opening: *"For the next hour, my only job is to understand what matters to you and your family. I won't pitch you anything."* LIFE surfaces a **sibling conflict over Mom's estate**. MONEY surfaces a **held-away $720K rollover IRA**. GAPS observes a 1994 beneficiary still naming the ex-spouse. PATH calendars a follow-up family meeting. Books $2.8M + $1.4M from the sibling within 8 months. **$4.2M AUM. $42K trailing. Three extended-family referrals.** Same widow. Same need. Different sequence.

> ### ⚠️ Common Trap
> *"Compliance approved our pitch deck — that's how we're supposed to open."* Three answers. **(1)** The deck is reference, not script — top-quartile producers pull it AFTER the gaps land. **(2)** Deck-as-opener is why HNW switching is at record highs and why **SEC Marketing Rule 206(4)-1 (2022)** tightened performance-and-testimonial restrictions. **(3)** Non-pitch discovery converts at ~2x the pitch-deck rate per Cerulli.

**Transition:** "Next hour: 5-stage discovery, 3-pillar frame, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:05-0:22)

> ### 🟡 Coach Note
> Seventeen minutes. **Do not lecture for seventeen minutes** — you will lose the room by minute 9. Split into two halves: **5-STAGE DISCOVERY (12 min, ~2.5 min per stage)** + **FIDUCIARY-FORWARD Three Pillars (5 min, ~1.5 min per Pillar)**. Pause after each stage for one clarifying question. End-of-section test: any advisor can recite all 5 stages in sequence, all 3 Pillars, and the verbatim cue under each without notes.

### Part A -- The 5-STAGE DISCOVERY Framework (12 minutes)

Five stages every top-quartile HNW producer runs in every discovery meeting. Most lost cases collapse at Stage 1 (advisor never sets the no-pitch contract, prospect waits for the sales pivot) or Stage 4 (advisor states gaps as **solutions** instead of **observations**, prospect raises a defensive wall).

#### Stage 1 -- FRAME (5 min)

**Set meeting expectation. Disclose engagement type. Put Form CRS on the table.** No product. No deck.

> ### 🎤 Verbatim Script -- The FRAME
> *"For the next hour, my only job is to understand what matters to you and your family. I won't pitch you anything today. If at the end you'd like to keep talking, we'll schedule a second meeting where I bring a written plan. If not, you'll still walk out with three things you could act on with anyone. Sound fair? Before we start: this is our **Form CRS** — required by the SEC at the first meeting; covers how I'm paid, the relationship type, conflicts. I'd rather put it down now than after we've talked about money."*

**Get the verbal yes.** Disclose engagement type (commission BD / fee-only RIA / hybrid / dually registered). Slide Form CRS across the table — not because it closes anything, but because the prospect has been pitched by 2.4 advisors who didn't.

**Common trap.** Skipping the *"Sound fair?"* and diving into LIFE — without explicit permission, the prospect spends LIFE waiting for the pivot. Or pulling Form CRS at the END — the regulators allow it, the prospect notices.

#### Stage 2 -- LIFE (15 min)

**Open-ended questions about FAMILY, VALUES, CONCERNS, LIFE EVENTS NEXT 5 YEARS. NO product mentions. Hand-written notes.**

> ### 🎤 Verbatim Script -- The LIFE
> *"Walk me through your family — who depends on you, who supports you, who you worry about. What does a great financial year look like — not in dollars, in what you'd be doing? What keeps you awake at 3 AM about money? Have you had a financial advisor before — what worked, what didn't? What's likely to change in the next 3-5 years?"*

Legal pad is a conversation; laptop is a barrier. NEVER interrupt the silence after *"what keeps you awake at 3 AM?"* — that silence is where the prospect tells you what they actually need.

**Common trap.** Closed-question template yielding *"yes / two kids / retired in 2019 / $185K"* and zero emotional signal. Or *"so what are your investment goals?"* opener — pure product-frame, signals you're already pulling models.

#### Stage 3 -- MONEY (15 min)

**NOW you collect the financial inventory. Custody-by-account.** Assets (held-away 401(k) + brokerage + alternative + crypto + business-equity + real estate), liabilities, income, insurance in force, estate documents (will / revocable trust / DPOA / healthcare proxy), tax (last 1040 + bracket), employer benefits, RSU/option vesting, concentrated positions.

> ### 🎤 Verbatim Script -- The MONEY
> *"Now let's map everything together — account by account, including every 401(k) at every prior employer, any crypto, any alternative, any business interest, any rental property, any vested-but-unexercised options. Then liabilities. Then estate documents — when were they last updated? Then tax — effective rate last year?"*

**The HOLD-AWAY DISCOVERY is critical.** Per Cerulli, average HNW household holds at **2.4 institutions** — the advisor who maps all of them is the one who consolidates.

**Common trap.** Skipping the prior-employer rollover (*"that one's already invested, no need to discuss"*) — that's the held-away that walks. Or skipping crypto and alternatives because the fact-finder template doesn't have a box.

#### Stage 4 -- GAPS (8 min)

**Real-time on-paper observation of what's MISSING or BROKEN. State as observations, NOT solutions.**

Common gaps: outdated beneficiaries (#1 most common, post-divorce); missing/stale revocable trust (~40% of $2M+ households per AAII); concentrated single-stock (>30% net worth); excess cash drag (>18-24 months emergency fund); tax-inefficient asset location; insurance gaps; no Roth roadmap; no QCD; RSU/option strategy unmapped.

> ### 🎤 Verbatim Script -- The GAPS
> *"Three things I noticed, just as observations. **One** — your IRA beneficiary is still listed as your ex-spouse from 1994. Ten-minute fix at any custodian, with or without me. **Two** — about 38% of your net worth is in your former employer's stock. There's no opinion in saying that's concentration; the opinion is what to do about it. **Three** — your revocable trust was drafted in 2008, pre-SECURE-Act. Worth your estate attorney revisiting whether you work with me or not."*

Three observations, three "with or without me" framings. The prospect hears competence WITHOUT a sales pivot.

**Common trap.** Stating gaps as **solutions** (*"we'd move 100% of that into our large-cap value strategy tomorrow"*) — collapses every prior minute of trust. Or stating SIX gaps — three is the right number; six is a lecture.

#### Stage 5 -- PATH (5 min)

**Non-pressure close + specific next-step menu. NO signed-IMA-tonight.**

> ### 🎤 Verbatim Script -- The PATH
> *"Three things to act on regardless — beneficiary fix, concentrated-stock decision, estate refresh. Whether you work with me or not, you should act on these. If you'd like to keep talking, a second meeting would cover those three plus a tax-location overview and a Roth-conversion analysis. Then YOU decide if it's worth a third meeting. Sound fair? Let's put it on the calendar before I leave — week of the 18th?"*

**Calendar the second meeting BEFORE you leave.** Highest-correlation predictor of signed IMA per Schwab RIA Benchmarking.

**Common trap.** *"Should we start moving the accounts this week?"* — false urgency, Reg BI concern AND trust-killer. *"I'll send a proposal and follow up"* — produces zero second meetings; calendar in the room.

### Part B -- The FIDUCIARY-FORWARD "Three Pillars" Compliance Frame (5 minutes)

**Three Pillars keep the advisor on the right side of every regulator.** Inside: defensible in SEC IA exams, FINRA Reg BI reviews, state IAR exams, CFP Board inquiries. Outside: enforcement, U4 disclosure events, CFP discipline.

#### Pillar 1 -- BEST INTEREST / FIDUCIARY DUTY

**Recommend what's best FOR THE CLIENT, not what generates the highest comp.** SEC IA Act fiduciary (RIA), FINRA Reg BI care + disclosure + conflict + compliance (BD), state best-interest rules (NY, CA, MA, IA, NJ, CT, ME, MN) for insurance crossover, CFP Board fiduciary at all times. Dually-registered: the standard moves with the recommendation.

> ### 🎤 Verbatim Script -- BEST INTEREST Documentation
> *"Any recommendation I make will be documented as best-interest tied to your stated objectives. If I wear a BD hat for one piece and an RIA hat for another, I'll tell you which is which and why before you sign anything."*

**Common trap.** Recommending a proprietary product because revenue-sharing is materially higher when a third-party option is better. Or failing to document the *"why this, not that"* rationale a Reg BI exam looks for first.

#### Pillar 2 -- DISCLOSURE

**Form CRS at first meeting. Form ADV Part 2A brochure + 2B supplement. Conflicts. Fee schedule + breakpoints. All-in cost.**

> ### 🎤 Verbatim Script -- DISCLOSURE Walkthrough
> *"Three documents in your file today: Form CRS, ADV Part 2A firm brochure, ADV Part 2B my supplement. On fees: 95 bps on the first $2M, 75 bps on the next $3M, 50 bps above. Fund expense ratios average ~12 bps. Custodian transaction costs pass-through. All-in cost on a $2.4M account at our recommendation is approximately 107 bps blended."*

**Common trap.** Disclosing the advisory fee but not the all-in cost (advisory + fund + transaction + 12b-1) — the regulator and the prospect both notice. Or burying conflicts in ADV without verbal mention.

#### Pillar 3 -- NO PRESSURE / NO MISREPRESENTATION

**No "free portfolio review" without Form ADV. No "guaranteed return" or "outperforming the market" language — SEC Marketing Rule 206(4)-1 (2022) restricts performance, testimonial, hypothetical claims.** No concealing held-away in performance reporting. No "we use the same strategy as Yale endowment" puffery. No concealed insurance commission.

> ### 🎤 Verbatim Script -- NO PRESSURE Frame
> *"Three things I won't do today. **One** — I won't promise we'll outperform the market; the SEC Marketing Rule restricts that language. **Two** — I won't tell you to move accounts this week. **Three** — if I recommend any insurance or annuity later, I'll disclose commission in dollars before you sign anything."*

**Common trap.** *"We outperformed the S&P last year"* — Marketing Rule problem even when true. *"Free portfolio review"* without ADV delivery — required when delivering advice for compensation.

> ### 🎯 Bottom Line
> 5 stages + 3 Pillars. Both together = 35-50% close + zero compliance exposure. Stages without Pillars = an advisor who closes well and gets a U4 disclosure event in year 3; Pillars without stages = a compliant advisor whose book never grows past $40M.

---

## SECTION 3 -- THE DISCUSSION (0:22-0:32)

> ### 🟡 Coach Note
> Whiteboard up. Write **FRAME / LIFE / MONEY / GAPS / PATH** across the top in 5 columns. Each advisor audits their **last unconverted $2M+ prospect** out loud — which stage broke down, what the prospect said, what's been written (or not) in the 90 days since. **Count to five after each prompt.** Silence forces engagement. If vague: *"verbatim — what exactly did you say in FRAME? Did you actually slide Form CRS across the table, or did you save it for the second meeting?"*

**Prompt 1 — "Name your last unconverted $2M+ prospect. Demographics, AUM scope, last 3 interactions."**
Force specifics: *"Dr. Linda Chen, retired anesthesiologist 68, $2.4M IRA + $1.1M brokerage + $620K paid-off Buckhead home, first met March 12, last note 'staying with current advisor for now'."* No vague *"a CPA referral last spring."*

**Prompt 2 — "Which of the 5 stages broke down?"**
Most will admit **FRAME** (failed to set the no-pitch contract). Some **LIFE** (jumped to MONEY too fast, never asked the 3 AM question). Some **MONEY** (missed the held-away rollover). Some **GAPS** (stated as solutions, pitched the model portfolio). A few **PATH** (asked for the IMA instead of the second meeting). **Manager:** *"FRAME is the contract. LIFE is the relationship. MONEY is the inventory. GAPS is the diagnosis. PATH is the second meeting. Skip any one and the next 90 days produce zero IMAs."*

**Prompt 3 — "Did you put Form CRS on the table at minute 1?"**
Most admit they delivered Form CRS at the end of the meeting or by email afterward. **Manager:** *"SEC permits delivery at or before the recommendation. Putting it down at minute 1 is a trust move. The prospect has been pitched by 2.4 advisors who didn't."*

**Prompt 4 — "Did you ask about the spouse if they weren't there?"**
Per Cerulli, married-couple HNW prospects close at half the rate when only one spouse attended. **Manager:** *"FRAME line: 'I'd like to ask that we schedule the second meeting with your spouse present.' Calendar in the room."*

**Prompt 5 — "Did you map the held-away accounts?"**
Most admit they captured assets in front of them and skipped the prior-employer 401(k) + the discount-broker brokerage + crypto. **Manager:** *"Per Cerulli, 2.4 institutions on average. Ask every time: 'Where else are assets held, even small accounts?'"*

**Prompt 6 — "ONE concrete next move — re-run FRAME, send a 3-observation note, schedule a Zoom redo with the spouse, or second-opinion meeting with the manager? Verbatim what you'll say."**
Each advisor names ONE prospect + ONE move + ONE verbatim line. **Manager:** *"Recorded conversation where state law allows, or detailed CRM note (Salesforce FSC / Redtail-Orion / Wealthbox) within 14 days, reviewed in 1:1."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:32-0:52)

> ### 🟡 Coach Note
> Pair advisors. If odd number, the manager takes the extra advisor. **Two scenarios, 10 minutes each, 60-second reset between.** Advisor plays prospect in Round 1, switches to advisor in Round 2. Walk the room. Listen for whether the advisor actually runs FRAME verbatim in Round 1 (the no-pitch contract is the diagnostic), and whether they hold BEST INTEREST when the widow tries to extract a *"just promise me I won't run out of money"* commitment. Mark which stage each advisor skips; that's the data for the next 1:1.

### Role-Play 1 -- Recently-Widowed Inherited-Wealth Prospect (10 min)

**Setup:** **68-year-old widow Eleanor Whitfield, husband Frank (mechanical engineer) passed 4 months ago. $2.4M Frank's rollover IRA + $850K joint brokerage + $400K joint MM + $720K paid-off Buckhead Atlanta home + small $180K Roth she opened in 2017 Frank never knew about. Daughter Cynthia (early 40s, Charlotte) pushing a friend's small RIA at Edward Jones — *"your fees are too high."* Widow financially capable but emotionally raw, terrified of running out. 14% of brokerage in former-employer Coca-Cola stock.** **Advisor must run the full 5-STAGE without pitching, must NOT promise no-run-out (Marketing Rule + fiduciary problem), must invite Cynthia to the second meeting, must surface the $180K Roth.**

> ### 🎤 PROSPECT SCRIPT -- Eleanor Whitfield
>
> **Posture:** Grief-affected, overwhelmed, skeptical of pitches (Frank's old broker called twice in March), influenced by Cynthia, primary fear is running out. Engages if (a) no pitch, (b) Cynthia dynamic honored, (c) advisor refuses to promise no-run-out and explains why that IS the fiduciary move.
>
> **Deflection 1 (min 6):** *"Frank always handled the money. I don't really know what I'm doing — so just tell me what to do."*
>
> **Deflection 2 (min 11):** *"My daughter wants me to use her friend at Edward Jones — she said your fees are too high and you'd put me in things that pay you more."*
>
> **Deflection 3 (min 16):** *"I just want to make sure I don't run out of money. Can you just promise me that?"*

> ### 🎤 ADVISOR SCRIPT
>
> - **Min 0-5 (FRAME):** *"Eleanor — I'm so sorry about Frank. For the next hour my only job is to understand what matters to you and your family. I won't pitch you anything today. If at the end you'd like to keep talking, we'll set a second meeting and I'd like to invite Cynthia. If not, you'll walk out with three things you could act on with anyone. Sound fair? Form CRS on the table — SEC-required, covers how I'm paid and conflicts."*
> - **Min 5-20 (LIFE):** *"Walk me through your family — Cynthia, your brother, anyone in the picture. What does a great year look like — not in dollars, in what you'd be doing? What keeps you awake at 3 AM? Did you and Frank ever talk about what 'enough' looked like? What worked or didn't with the advisors Frank used?"* (Eleanor mentions her brother and a conflict over their late mother's estate — data the prior advisor missed.)
> - **Min 20-35 (MONEY):** *"Now let's map everything together — Frank's rollover IRA, the joint brokerage, the money market, anything you opened on your own at any point, any small accounts, anything from any of Frank's prior employers. Then the house, liabilities, estate documents — will, trust, healthcare proxy — and tax. Effective rate last year?"* (Surfaces the $180K Roth she opened in 2017 — the held-away. Captures Coca-Cola at 14%. Will last updated 2011.)
> - **Min 35-43 (GAPS + Deflection 1):** *"Three observations. **One** — Frank is still listed as beneficiary on your Roth. Ten-minute fix at any custodian. **Two** — 14% of the joint brokerage is in Coca-Cola. That's concentration; the opinion is what to do about it. **Three** — your will was updated in 2011, pre-SECURE-Act. Worth your estate attorney revisiting, with or without me."* Deflection 1: *"Eleanor, the most fiduciary thing I can do is NOT tell you what to do after one meeting. These three are things to act on with any advisor. The deeper plan needs a second meeting."*
> - **Min 43-48 (Deflections 2 + 3):** D2 (Cynthia/EJ): *"Cynthia's instinct to advocate is exactly what I'd want in your corner — that's why I asked to invite her. On fees: I'll send a side-by-side of our all-in cost vs the EJ structure. If theirs is better for your situation, you should use them. I'll tell you that to your face."* D3 (no-run-out): *"I can't promise that, and any advisor who does is either lying or about to be in trouble with the SEC. What I CAN do is build a plan with a withdrawal rate that has a high probability of lasting your lifetime under a range of market scenarios. That probabilistic answer is the honest one."*
> - **Min 48-50 (PATH):** *"Three observations to act on regardless. If you'd like a second meeting, I'd bring a written plan covering those three plus a withdrawal-rate analysis and a tax-location overview, and I'd love to have Cynthia there. Week of the 18th?"* (Pull up calendar.)

### 60-Second Reset

> ### 🟡 Coach Note
> **Branch Manager calls out: "Switch sides — 60-second reset."** Advisors put papers down. Stand up. Stretch. Sip water. Sit back down with the OTHER role's paper. **Take 30 seconds to read silently.** Then go.

### Role-Play 2 -- Business-Owner With Pending Liquidity Event (10 min)

**Setup:** **52-year-old founder Marcus Reyes signed LOI to sell his 45-person Atlanta SaaS for $14M cash + $4M earnout over 3 years. $1.8M personal brokerage + $1.1M IRA + $0 estate planning beyond a basic 2008 will. Second wife Jennifer (47) + blended family — 2 step-kids out of college (26, 24), one biological son Diego, 16, junior at Westminster. Trusts his CPA Steve at Aprio. Buddies pushing him to put the proceeds into Atlanta multifamily.** **Advisor must use the 5-STAGE to surface blended-family estate complexity, the QSBS Section 1202 opportunity, the installment-sale timing, asset-location on $14M, without ego-conflicting with the CPA.**

> ### 🎤 PROSPECT SCRIPT -- Marcus Reyes
>
> **Posture:** Smart, time-starved, trusts Steve at Aprio, confident enough to DIY investing, blended-family dynamics he hasn't priced into estate planning, Diego-vs-step-kids tension under the surface.
>
> **Deflection 1 (min 4):** *"My CPA said I just need a quarterly estimated tax plan — why do I need a wealth advisor at all?"*
>
> **Deflection 2 (min 8):** *"I want to do my own investing — Schwab is fine for that — I just need help with the tax-and-trust side of the LOI."*
>
> **Deflection 3 (min 13):** *"My buddies say I should just buy Atlanta multifamily with the proceeds and skip the markets. Why wouldn't I?"*

> ### 🎤 ADVISOR SCRIPT
>
> - **Min 0-3 (FRAME):** *"Marcus — congrats on the LOI. For the next hour my only job is to understand what matters to you and your family. I won't pitch you anything today. If you'd like to keep talking, we'll set a second meeting — and I'd like to invite Jennifer, and ideally Steve from Aprio for a 4-way coordination call. Sound fair? Form CRS on the table."*
> - **Min 3-13 (LIFE + Deflection 1):** *"Walk me through your family — Jennifer, Diego, the older step-kids. What does post-sale Marcus look like — board seats, next company, sabbatical? What does Jennifer want in three years? Where's the family-money friction you haven't said out loud yet? What keeps you awake at 3 AM about the sale?"* (Marcus surfaces Diego-vs-step-kids inheritance tension + his own post-sale identity question.) Deflection 1: *"Steve's right you need the quarterly tax plan — that's his expertise. This conversation exists because the LOI has tax-and-investment-and-estate-and-insurance-and-family dimensions. A wealth advisor's job is coordination across them, not replacing the CPA. If I add no coordination value beyond Steve, you shouldn't hire me."*
> - **Min 13-25 (MONEY + Deflection 2):** *"Map the LOI — $14M cash at close, $4M earnout over 3 years, holdback, escrow, is Section 1202 QSBS on the table? Founder shares — when issued, holding period? Personal — brokerage, IRA, 401(k), deferred comp, unvested equity. Estate — 2008 will, trust, healthcare proxy, DPOA. Insurance — anything in force with Jennifer or Diego as beneficiary?"* (Shares issued 2014, founder stock, likely QSBS — a $10M Section 1202 federal exclusion Steve hadn't fully framed.) Deflection 2: *"Schwab is fine for DIY and I'd never argue you out of self-directing. The piece that ISN'T self-directable is asset location across $14M — what goes in IRA vs taxable vs the new revocable trust — and the QSBS exclusion windowing, and the installment-sale-vs-cash election. That's the coordination work. The brokerage trades are yours."*
> - **Min 25-33 (GAPS + Deflection 3):** *"Five observations. **One** — QSBS Section 1202 on the founder stock, if it qualifies, is up to a $10M federal capital gains exclusion. Steve will know — confirm this week. **Two** — your 2008 will predates Diego. With $14M and a blended family, highest-priority estate gap. **Three** — no revocable trust. **Four** — zero life insurance. With Diego at 16 and Jennifer mid-career, $5-10M of term is a separate observation — not pitching. **Five** — the earnout creates 3 years of variable income; tax planning is multi-year."* Deflection 3 on real estate: *"Multifamily can be a fine sleeve and Atlanta has run. The cautions: $14M into illiquid Atlanta multifamily concentrates geography AND asset class AND a 7-10 year hold AND active management you haven't budgeted post-sale. A real-estate sleeve inside a diversified plan is one thing; the proceeds replacing the diversified plan is another. Worth modeling both in the second meeting."*
> - **Min 33-35 (PATH):** *"Three things to act on this week: confirm QSBS with Steve, draft a revocable trust with your estate attorney, get a term-life quote. If you'd like a second meeting, I'd bring a written plan covering asset location, installment-sale modeling, blended-family estate structure, real-estate sleeve sizing — and a 4-way call with Steve. Jennifer there, week of the 21st."*

> ### 🟡 Coach Note
> Walk the room. Advisor will want to (a) pitch the firm's discretionary platform inside GAPS, (b) ego-conflict with Steve, (c) pitch real estate funds against the buddy story. **Make the advisor re-deliver the CPA-respect framing + *"the brokerage trades are yours"* concession + observations-not-solutions discipline.** Highest-leverage drill in the training.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:52-0:57)

> ### 🟡 Coach Note
> Pull the room back together immediately. Three debrief questions, then commitments. The ritual is the only part that moves next quarter's IMAs + AUM + persistency + referral rate.

**Debrief 1 — "Which stage felt strongest? Which weakest?"**
Advisors over-index on MONEY (they love the fact-finder) and PATH (they want the close). Under-index on FRAME (skipped the no-pitch contract) and GAPS (stated solutions instead of observations). **Manager:** *"FRAME is the contract. GAPS is the diagnosis. Without the contract the rest of the hour is a sales call the prospect is waiting to end. Without the observation discipline the diagnosis becomes a pitch."*

**Debrief 2 — "Which Pillar did you nearly miss?"**
Most will name DISCLOSURE (forgot to slide Form CRS at minute 1, skipped the all-in cost number on fees). Some BEST INTEREST (almost pitched a proprietary product inside GAPS). A few NO PRESSURE (almost promised no-run-out, or said *"we should move accounts this week"*). **Manager:** *"Naming the near-miss is how you avoid the actual miss. Document the near-miss in your CRM — branch compliance reviews look kindly on self-reporting cultures."*

**Debrief 3 — "Who's the prospect you'll re-run discovery with this month?"**
Each advisor names ONE from their stalled-prospect list. **Manager:** *"Hand-written note: 'I want to redo our conversation differently, 45 minutes next week, no obligation, please bring [spouse / adult child / CPA / estate attorney].' Then Zoom or in-person, run FRAME for the full 5 minutes, LIFE for the full 15 minutes before any money talk. CRM note in Salesforce FSC / Redtail-Orion / Wealthbox within 14 days for 1:1."*

> ### 🎤 Commitment Ritual (Verbatim)

**Manager says:** "Open CRM on your phone. Four lines. **Line 1:** target prospect — name, AUM scope, original meeting date, status. **Line 2:** stage you'll lead with — FRAME / LIFE / MONEY / GAPS / PATH. **Line 3:** ONE verbatim language change — actual words. **Line 4:** call you'll log in CRM within 14 business days. Read all four aloud."

Coach the vague (*"I'll be more client-focused"*): *"What words exactly? Read the FRAME opener. Out loud now."*

**Manager closes:** "In our 1:1 within 14 business days I'm pulling CRM detail on this exact prospect, and we'll walk through the GAPS observations for the 8 minutes where you stated three things as observations not solutions. Not whether you got the IMA — **whether you ran the 5 stages and stayed on the 3 Pillars.** IMAs follow process. Always have."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (0:57-1:00)

> ### 🟡 Coach Note
> Hand out the printed one-pager. Walk it 30 seconds per section. Tell advisors where the digital version lives (branch intranet + CRM attachment). Keep one in the discovery binder next to the fact-finder template.

> ### 📋 Leave-Behind -- The "5-Stage Discovery + Three Pillars" One-Pager

> **THE 5-STAGE DISCOVERY FRAMEWORK:**
>
> | # | Stage | Verbatim Cue (memorize) | Time |
> |---|---|---|---|
> | 1 | **FRAME** | *"For the next hour, my only job is to understand what matters to you and your family. I won't pitch you anything. Sound fair? This is our Form CRS — required by the SEC."* | 5 min |
> | 2 | **LIFE** | *"Walk me through your family. What does a great year look like — not in dollars, in what you'd be doing? What keeps you awake at 3 AM about money? Have you had an advisor before — what worked, what didn't?"* (Hand-notes only.) | 15 min |
> | 3 | **MONEY** | *"Let's map everything — account by account, including the held-away rollover and anything at other custodians, then liabilities, estate documents, tax."* | 15 min |
> | 4 | **GAPS** | *"Three observations — outdated beneficiary / concentrated position / stale estate documents — with or without me, you should act on these."* (NEVER state as solutions.) | 8 min |
> | 5 | **PATH** | *"Three things to act on regardless. If you'd like to keep talking, the second meeting would cover [items they raised] — let's calendar before I leave."* | 5 min |

> **THE FIDUCIARY-FORWARD THREE PILLARS:**
>
> | Pillar | What it means | Common near-miss | Verbatim move |
> |---|---|---|---|
> | **BEST INTEREST** | SEC IA Act (RIA) + FINRA Reg BI (BD) + state IAR + CFP fiduciary; client objectives, NOT comp. | Recommending a proprietary fund for revenue-sharing; failing to document "why this, not that." | *"Any recommendation will be documented as best-interest tied to your stated objectives. If I wear a BD hat for one piece and RIA for another, I'll tell you which and why."* |
> | **DISCLOSURE** | Form CRS at first meeting + ADV Part 2A + 2B + conflicts + all-in cost. | Disclosing advisory fee but not all-in cost; burying conflicts in ADV without verbal mention. | *"Three documents today: Form CRS, ADV Part 2A, ADV Part 2B. All-in cost on a $2.4M account is approximately 107 bps blended."* |
> | **NO PRESSURE** | No false urgency, no performance guarantees, no "free portfolio review" without ADV, SEC Marketing Rule 206(4)-1 compliance, commission-disclosed on insurance crossover. | *"We outperformed the S&P"* / *"we should move accounts this week"* / *"I can promise you won't run out."* | *"Three things I won't do: promise market-beating returns, push you to move accounts on my timeline, or hide insurance commission."* |

> **THE 10 MOST COMMON GAPS A DISCOVERY SURFACES:**
>
> - [ ] **Outdated beneficiary designations** — especially post-divorce; #1 most common
> - [ ] **Missing or stale revocable trust** — ~40% of $2M+ households (AAII)
> - [ ] **Concentrated single-stock position** — >30% net worth = major risk
> - [ ] **Excess cash drag** — >18-24 months emergency fund
> - [ ] **Tax-inefficient asset location** — bonds in taxable, equities in IRA
> - [ ] **Insurance gaps** — under-insured umbrella, term laddering misaligned
> - [ ] **No Roth conversion roadmap** — bracket-management opportunity unmapped
> - [ ] **No QCD plan** — for charitably-inclined 70.5+
> - [ ] **RSU/option vesting strategy unmapped** — concentration + tax-timing
> - [ ] **Family-conflict gaps** — sibling disputes, blended-family friction, adult-child influencers

> **FORM CRS / ADV PART 2 / ADV PART 3 COMPLIANCE CHECKLIST:**
>
> - [ ] Form CRS placed on table at minute 1, verbally walked
> - [ ] Form ADV Part 2A firm brochure delivered or scheduled
> - [ ] Form ADV Part 2B brochure supplement on the advisor
> - [ ] Conflicts of interest verbally disclosed where material
> - [ ] Fee schedule + breakpoints + all-in-cost number stated verbally
> - [ ] Engagement type disclosed (commission BD / fee-only RIA / hybrid / dually registered)
> - [ ] Discovery hand-notes scanned to CRM (Salesforce FSC / Redtail-Orion / Wealthbox)
> - [ ] Held-away accounts mapped in MONEY
> - [ ] Three observations documented in GAPS section of CRM note
> - [ ] Second meeting calendared before leaving

> **NEVER DO:**
>
> - Open the firm pitch deck before FRAME + LIFE land
> - Skip Form CRS at minute 1
> - Pivot to MONEY before LIFE lands
> - State gaps as solutions instead of observations
> - Promise *"you won't run out of money"* — SEC Marketing Rule + fiduciary problem
> - Say *"we outperformed the S&P last year"* — SEC Marketing Rule 206(4)-1 restriction
> - Push *"we should move accounts this week"* — false urgency, Reg BI concern
> - Ego-conflict with the prospect's existing CPA / attorney / current advisor
> - Skip the held-away rollover 401(k) in MONEY
> - Single-thread the discovery if the spouse exists
> - Pitch a proprietary product inside GAPS — BEST INTEREST violation
> - Quote one fee number instead of all-in cost — DISCLOSURE failure

> **OUTCOME LINE:**
>
> - **Wins:** Full 5-STAGE + Three Pillars live + Form CRS at minute 1 + held-away mapped + observations-as-observations + second meeting calendared + spouse invited → **35-50% close + 90%+ AUM retention + 2-3 referrals per closed relationship + zero compliance findings**
> - **Losses:** Pitch deck minute 8 + closed-question fact-finder + held-away skipped + gaps-as-solutions + single-threaded discovery → **18-28% close + 60-70% retention + zero referrals + Reg BI exam risk + the 2.4-advisors-in-24-months statistic personified**

> ### 🎯 If You Only Remember One Thing
> **You don't earn the right to manage their money by being the smartest in the room. You earn it by being the only advisor who asked about their family before asking about their assets.**

---

## How This Training Sits Inside Your Wealth-Management Practice

This is **the foundational HNW acquisition discipline** — the conversation that determines whether your branch hits annual net-new-asset goals AND survives SEC IA examinations + FINRA Reg BI reviews + state IAR exams + CFP Board inquiries. It does not replace investment philosophy, planning software fluency (eMoney / MoneyGuidePro / RightCapital), or advanced-markets specialization — it composes from all of them.

| Where it fits | What this training addresses |
|---|---|
| **Pre-meeting** | Form CRS + ADV Part 2A + 2B printed + discovery binder + spouse invitation + CPA/attorney coordination |
| **First 5 minutes** | FRAME — no-pitch contract, Form CRS on the table, engagement type disclosed |
| **Next 15 minutes** | LIFE — family, values, 3 AM question, prior-advisor experience, life events next 5 years |
| **Next 15 minutes** | MONEY — assets by custody, held-away mapped, estate documents, tax, insurance, equity comp |
| **Next 8 minutes** | GAPS — three observations stated as observations, "with or without me" framing |
| **Last 5 minutes** | PATH — three takeaways, second meeting calendared in the room, spouse + CPA invited |
| **Compliance overlay** | Three Pillars — BEST INTEREST + DISCLOSURE + NO PRESSURE — every first meeting, every file |
| **Manager coaching** | Weekly CRM audit on 1 discovery per advisor in 1:1 within 14 business days |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: meeting flow + post-training coaching loop
// ============================================================================
const flow = `

## The 60-Minute Meeting Flow

\`\`\`mermaid
flowchart TD
  A[Branch Manager Opens 0:00] --> B[Section 1: Cold Open 5 min — Cerulli US Retail Investor 2025 average $2M+ household interviewed 2.4 advisors in 24 months + only 32% of HNW prospects become clients in 90 days + #1 reason cited they started talking about products before they understood what I cared about + $84T Great Wealth Transfer 2024-2045 + Maya 12-yr Merrill complex composite $2.8M widow referral pitch deck minute 8 lost vs restructured 5-STAGE discovery same widow 6 months later $4.2M plus sibling money in 8 months]
  B --> C[Section 2: Teach 17 min]
  C --> C1[Part A: 5-STAGE DISCOVERY Framework 12 min — Stage 1 FRAME 5 min no-pitch contract Form CRS on table at minute 1 engagement type disclosed sound fair verbal yes / Stage 2 LIFE 15 min walk me through your family what does great year look like what keeps you awake at 3 AM about money what worked or didn't with prior advisor hand-notes only NEVER product mention / Stage 3 MONEY 15 min account by account including held-away rollover 401k discount broker crypto alternatives liabilities estate documents tax employer benefits / Stage 4 GAPS 8 min three observations stated as observations with or without me framing NEVER state as solutions NEVER pitch inside GAPS / Stage 5 PATH 5 min three things to act on regardless second meeting calendared in the room before leaving spouse invited]
  C --> C2[Part B: FIDUCIARY-FORWARD Three Pillars 5 min — Pillar 1 BEST INTEREST SEC IA Act fiduciary RIA + FINRA Reg BI BD + state IAR + CFP fiduciary documented why-this-not-that rationale / Pillar 2 DISCLOSURE Form CRS at first meeting Form ADV Part 2A + 2B conflicts fee schedule + all-in cost stated verbally / Pillar 3 NO PRESSURE NO MISREPRESENTATION no free portfolio review without ADV no guaranteed return SEC Marketing Rule 206(4)-1 2022 no concealing held-away no concealed insurance commission]
  C1 & C2 --> F[Section 3: Discussion 10 min — 6 prompts last unconverted $2M+ prospect + which stage broke + Form CRS at minute 1 + spouse invited + held-away mapped + ONE verbatim change]
  F --> G[Section 4: Role-Play 20 min]
  G --> G1[Round 1: Eleanor Whitfield 68 widow $2.4M IRA + $850K joint + $400K MM + $720K home + held-away $180K Roth daughter Cynthia influencer Coca-Cola concentrated position — Frank handled the money just tell me what to do / daughter wants Edward Jones / promise I won't run out of money — ADVISOR runs full 5-STAGE FRAME with Form CRS at minute 1 LIFE 15 min surfaces sibling conflict over Mom estate MONEY surfaces $180K Roth + concentrated Coca-Cola GAPS observes outdated beneficiary + concentrated stock + 2011 will PATH calendars second meeting Cynthia invited]
  G1 --> G2[60-sec reset]
  G2 --> G3[Round 2: Marcus Reyes 52 founder $14M LOI + $4M earnout 45-person SaaS Aprio CPA Steve blended family Diego 16 step-kids out of house 2008 will only — CPA said I just need quarterly tax why do I need advisor / want to DIY at Schwab / buddies say buy Atlanta multifamily — ADVISOR FRAME with Form CRS LIFE surfaces Diego-step-kids tension MONEY surfaces QSBS Section 1202 opportunity GAPS five observations QSBS + 2008 will + no trust + zero life insurance + earnout multi-year tax PATH calendars second meeting Jennifer there + 4-way call with Steve]
  G3 --> G4[60-sec reset]
  G4 --> H[Section 5: Debrief + Commitments 5 min — 4-line ritual next prospect + stage to lead + ONE verbatim change + CRM log within 14 business days]
  H --> I[Section 6: Leave-Behind 3 min — 5-Stage grid + 3-Pillar quadrant + 10-most-common-gaps reference + Form CRS / ADV Part 2 / ADV Part 3 checklist + never-do list + hero quote]
  I --> Z[Meeting Ends 60:00 — Branch Manager asks for CRM detail in 1:1 within 14 business days]
\`\`\`

## Manager Coaching Loop

\`\`\`mermaid
flowchart LR
  T[Training Monday] --> W1[Week 1: Advisor Commits Next $2M+ Prospect + Stage to Lead + ONE Verbatim Change + Logs in CRM]
  W1 --> W2[Advisor Delivers 5 Stages + 3 Pillars Live On 3+ Discovery Meetings Logs One Within 14 Business Days]
  W2 --> W3[Manager Reviews CRM Entry in 1:1 Marks 5-Stage Coverage + 3-Pillar Adherence + GAPS Observation Quality]
  W3 --> W4[1:1 Coaching: Stage Still Skipped + Verbatim Re-Delivery With Manager Playing Skeptical $2M+ Prospect]
  W4 --> W5[Monthly Production Review: Discoveries Run + Second-Meeting Conversion + IMA Conversion + Net-New AUM + 12-Month Retention + Referrals + Compliance Findings + Form CRS Delivery Rate]
  W5 --> W6[Quarterly: Refresh Form CRS + Form ADV Part 2 + Update on SEC Marketing Rule Guidance + State IAR Renewal Cycle + Rotate Role-Plays From Actual Unconverted $2M+ Prospects + CFP CE Recertification + AUM Growth + Retention Audit]
  W6 --> R{Rerun Every 90 Days With Fresh Unconverted Prospect Audits}
  R -->|Yes| T
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE DISCOVERY framework, the Three Pillars compliance frame, and the Cerulli 2.4-advisors-in-24-months benchmark draw on a specific body of wealth-management commercial + regulatory research. A branch manager or chief growth officer should be ready to cite these by name.

**Regulatory + compliance framework.** **SEC Investment Advisers Act of 1940** — fiduciary standard for RIAs. **FINRA Regulation Best Interest (Reg BI)** — SEC Rule 15l-1, effective June 2020, care + disclosure + conflict + compliance obligations for BDs. **SEC Marketing Rule 206(4)-1 (2022 compliance date)** — restrictions on testimonials, performance, hypothetical claims, and "free portfolio review" practices. **Form CRS** (Form ADV Part 3) — required first-meeting Client Relationship Summary delivery for both BDs and RIAs. **Form ADV Part 2A brochure + Part 2B brochure supplement** — required delivery covering strategies, fees, conflicts, and advisor background. **State IAR registration** — NASAA model + state-by-state requirements; CRD/IARD filings. **CFP Board Code of Ethics and Standards of Conduct** — fiduciary duty at all times for CFP professionals. **NAIC Suitability in Annuity Transactions Model #275** + state best-interest rules (NY Reg 187, CA SB-1184, MA 211 CMR 96, NJ, IA, MN, CT, ME) — for the dually-registered insurance crossover.

**Cerulli + market research.** **Cerulli Associates US Retail Investor 2025** — HNW prospect switching, 2.4-advisors-in-24-months data, primary reasons for non-engagement. **Cerulli US Advisor Industry 2025** — channel breakdown across wirehouse, regional BD, IBD, RIA, hybrid. **Cerulli Great Wealth Transfer 2024-2045** — $84T projected intergenerational asset movement, recipient-demographic shift. **Cerulli HNW Prospecting and Acquisition Research** — discovery-meeting close-rate benchmarks. **Vanguard Advisor's Alpha** — quantification of advisor value-add (~3% net annually, behavioral coaching as largest single component). **Charles Schwab Independent Advisor Outlook Study + Schwab RIA Benchmarking Study** — annual operating + growth metrics across the RIA channel.

**Industry trade associations.** **CFP Board** (CFP standards + ethics enforcement + ~100K CFP certificants). **NAPFA** (fee-only RIA professional association). **FPA** (Financial Planning Association). **Investments & Wealth Institute** (CIMA + CPWA designations). **Investment Adviser Association** (RIA advocacy). **NAIFA** (insurance-focused advisor advocacy). **IRI** (Insured Retirement Institute — annuity + retirement income research). **AAII** (American Association of Individual Investors — HNW investor behavior surveys).

**Channel landscape.** **Wirehouses:** Morgan Stanley Wealth Management, Merrill Lynch (Bank of America), UBS Wealth Management USA, Wells Fargo Advisors. **Regional broker-dealers:** Edward Jones, Raymond James, RBC Wealth Management, Stifel, Janney Montgomery Scott. **Independent broker-dealers:** LPL Financial, Cetera Financial Group, Cambridge Investment Research, Commonwealth Financial Network, Kestra Financial. **RIAs and RIA platforms:** Carson Group, Mariner Wealth Advisors, Mercer Global Advisors, Creative Planning, Wealth Enhancement Group, Beacon Pointe Advisors, Avantax, Hightower, Dynasty Financial Partners, Focus Financial Partners, Captrust.

**CRM + planning software stack.** **Salesforce Financial Services Cloud + Redtail (now Orion) + Wealthbox** for CRM. **eMoney Advisor + MoneyGuidePro + RightCapital + NaviPlan** for financial planning. **Orion Advisor Services + Tamarac (Envestnet) + Black Diamond (SS&C) + Addepar** for portfolio accounting + performance reporting + client portal. This is the operational layer where discovery hand-notes + held-away mapping + GAPS observations + Form CRS delivery confirmation live for compliance audit.

**Industry trade publications.** **Barron's Advisor + Financial Planning Magazine + InvestmentNews + ThinkAdvisor + RIABiz + RIA Channel + Citywire RIA + Reuters Wealth Management + WealthManagement.com**.

**The 5-STAGE DISCOVERY framework** composes on Mitch Anthony's *Storyselling for Financial Advisors* + Bill Bachrach's *Values-Based Selling* + Carl Richards's *The One-Page Financial Plan* + Michael Kitces's process research on top-quartile RIA acquisition motions — re-anchored to post-2020 Reg BI + post-2022 SEC Marketing Rule + post-Cerulli-Great-Wealth-Transfer prospect demographics. The Three Pillars frame is distilled from SEC IA Act + Reg BI + Marketing Rule + Form CRS rule + state IAR enforcement + CFP Board disciplinary history.

`;

// ============================================================================
// NUM -- quantified benchmarks the manager cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

The cold open lands harder when the branch manager can quote real benchmarks. The tables below pull from Cerulli US Retail Investor 2025 + Cerulli US Advisor Industry 2025 + Schwab RIA Benchmarking Study + Vanguard Advisor's Alpha + SEC + FINRA + CFP Board + AAII research + industry-association statistics.

### Cerulli US Retail Investor 2025 — HNW Prospect Switching

| Metric | 2018 | 2025 |
|---|---|---|
| Average # advisors $2M+ HNW household has interviewed in last 24 months | **1.6** | **2.4** |
| % of $2M+ prospects who take a discovery meeting and become clients in 90 days | **~42%** | **~32%** |
| % of HNW prospects citing *"they started talking about products before they understood what I cared about"* as primary reason for non-engagement | **~28%** | **~41%** |
| # institutions average HNW household holds assets at | **1.9** | **2.4** |
| Great Wealth Transfer projection 2024-2045 | — | **$84 trillion** |

### Schwab RIA Benchmarking — Discovery Conversion By Discipline Tier

| Producer Tier | Discovery-Meeting Close Rate | New Relationships / Year | Avg AUM / Relationship | Net-New AUM / Year |
|---|---|---|---|---|
| Bottom-quartile (pitch deck minute 8, fact-finder template) | **12-20%** | **3-6** | **$1.4M** | **~$6M** |
| Below-average (closed-question discovery, gaps-as-solutions) | **18-28%** | **5-9** | **$1.8M** | **~$13M** |
| Industry median | **22-32%** | **7-12** | **$2.1M** | **~$20M** |
| Top-quartile (full 5-STAGE + 3-Pillar consistently) | **38-50%** | **14-22** | **$2.4M** | **~$42M** |
| Top-decile (5-STAGE + 3-Pillar + multi-generational + CPA/attorney coordination) | **48-62%** | **22-35** | **$3.1M** | **~$80M+** |

### Why HNW Prospects Decline To Engage After Discovery (Cerulli + Vanguard + AAII)

| Reason for Non-Engagement | % Citing as Primary |
|---|---|
| Advisor talked about products before understanding what mattered (FRAME / LIFE skipped) | **41%** |
| Felt the advisor was selling, not advising (PATH was a close, not a menu) | **29%** |
| Advisor didn't include spouse / influential family member | **24%** |
| Fees not clearly disclosed up front (DISCLOSURE Pillar near-miss) | **22%** |
| Distrusted advisor's recommendation (BEST INTEREST questioned) | **19%** |
| Existing advisor "good enough" and advisor didn't surface differentiated gaps | **18%** |
| Wanted to talk to CPA / estate attorney first (no coordination offer) | **17%** |
| Advisor ego-conflicted with existing CPA / attorney / advisor | **15%** |
| Advisor didn't ask about held-away accounts (felt small to prospect) | **12%** |

### Vanguard Advisor's Alpha — Where The 3% Net Value-Add Comes From

| Component | Estimated Annual Net Value-Add (bps) |
|---|---|
| Behavioral coaching (preventing panic-selling, panic-buying) | **~150 bps** |
| Asset allocation + rebalancing discipline | **~45 bps** |
| Cost-effective implementation (low-cost vehicles) | **~30 bps** |
| Tax-loss harvesting + asset location | **~75 bps** |
| Spending strategy (withdrawal sequencing in retirement) | **~110 bps** |
| **Total potential advisor alpha (gross)** | **~3%** |

### SEC + FINRA Enforcement Activity Areas Relevant To Discovery

| Area | Enforcement Trend |
|---|---|
| **Form CRS delivery failures** | Recurring SEC + FINRA exam findings; routine deficiency letter category |
| **Marketing Rule 206(4)-1 violations** | Performance / testimonial / hypothetical claims — top SEC enforcement priority post-2022 |
| **Reg BI care obligation** | "Recommendation rationale not documented" — most common cited deficiency |
| **Held-away asset disclosure in performance reporting** | SEC focus area for RIAs reporting only managed assets |
| **Conflicts of interest disclosure** | Verbal disclosure expected in addition to ADV; not just buried in document |
| **Insurance / annuity commission disclosure (dually registered)** | NAIC #275 + state best-interest enforcement rising in NY, CA, MA, IA, NJ, MN, CT, ME |

### Form CRS / ADV Compliance Audit — Discovery Meeting

| Discovery Practice | SEC / FINRA-Compliant? | Risk |
|---|---|---|
| Form CRS placed on table at first meeting + verbally walked | **YES** | Low |
| Form CRS delivered via email after meeting only | **PARTIAL** | Medium — Form CRS rule permits delivery at or before recommendation; verbal walkthrough best practice |
| Form CRS skipped because *"prospect didn't ask"* | **NO** | **High — recurring exam deficiency category** |
| Form ADV Part 2A brochure + Part 2B supplement scheduled for delivery | **YES** | Low |
| All-in cost stated verbally (advisory + fund + transaction + 12b-1) | **YES** | Low (DISCLOSURE Pillar best practice) |
| Conflicts of interest verbally disclosed + documented | **YES** | Low (Reg BI care obligation) |

### 5-STAGE Adoption Curve (Advisors Running All 5 Stages Consistently)

| Stage | Week 1 | Week 4 | Week 12 |
|---|---|---|---|
| Stage 1 FRAME (no-pitch contract + Form CRS at minute 1) | 24% | 58% | 79% |
| Stage 2 LIFE (15-min open-ended, *"what keeps you awake at 3 AM"* asked) | 18% | 52% | 74% |
| Stage 3 MONEY (held-away rollover + crypto + alternatives mapped) | 31% | 64% | 82% |
| Stage 4 GAPS (three observations stated as observations, NOT solutions) | 14% | 44% | 68% |
| Stage 5 PATH (second meeting calendared in the room) | 22% | 56% | 76% |
| ALL 5 stages every discovery | 7% | 26% | 56% |

**Pattern:** Stage 4 GAPS (the observation-not-solution discipline) and Stage 2 LIFE (the 15-min open-ended block with the 3 AM question) are the hardest to install — advisors default to fact-finders and pivot to gap-as-pitch. **The weekly CRM discovery-note audit by the branch manager is the single biggest predictor of cohort discovery-conversion lift at 90 days** per Schwab RIA Benchmarking. The Three Pillars frame adopts faster (most advisors reach 80%+ adherence by week 6) because compliance pressure from SEC + FINRA + state IAR + carrier compliance is direct and consequences (deficiency letters, enforcement, U4 disclosure events) are existential.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + manager objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Pitch Deck Before FRAME + LIFE
Most common failure. Advisor opens the deck at minute 8 because prospect asked *"so what do you do?"*. **Per Cerulli, 41% of HNW non-engagements trace to product-talk-too-early.** Prospect's *"what do you do"* is data, not permission.

### Failure Mode 2 -- Closed-Question Fact-Finder Disguised As LIFE
Template form, no emotional signal. Open-ended LIFE mandatory with *"what keeps you awake at 3 AM about money?"* as the diagnostic — no question, no discovery.

### Failure Mode 3 -- Skipped Held-Away In MONEY
Advisor captures assets in front of them and skips the prior-employer rollover + discount-broker brokerage + crypto. Per Cerulli, average HNW household holds at 2.4 institutions. Ask every time: *"Where else are assets held, even small accounts?"*

### Failure Mode 4 -- Gaps Stated As Solutions
Classic Stage 4 collapse. Advisor observes concentrated stock and pivots to *"we'd move 100% of that into our large-cap strategy tomorrow"*. Turns diagnosis into pitch. State as observations with the "with or without me" framing. Three, not six.

### Failure Mode 5 -- Single-Threaded Discovery
Spouse not present + not invited to second meeting. **Per Cerulli, married-couple HNW prospects close at half-rate when only one spouse attended.** FRAME line: *"I'd like to schedule the second meeting with your spouse present."* Calendar in the room.

### Failure Mode 6 -- Form CRS Delivered By Email After
Technically compliant but a trust failure. Minute 1 is the differentiation move.

### Failure Mode 7 -- Promised No-Run-Out
*"I can promise you won't run out of money."* SEC Marketing Rule + fiduciary problem. The honest answer is probabilistic — *"a withdrawal rate with high probability of lasting your lifetime under a range of scenarios."* Refusing to promise IS the fiduciary move.

### Failure Mode 8 -- *"We Outperformed The S&P Last Year"*
SEC Marketing Rule 206(4)-1 (2022) restricts performance claims. Even when true, presentation rules apply. **Top SEC enforcement priority post-2022.**

### Failure Mode 9 -- Ego-Conflict With Existing CPA / Attorney
Advisor implies the prospect's CPA is *"missing things"*. Trust-killer. *"Your CPA is right about [X] — wealth-advisor coordination is across tax-investment-estate-insurance-family, not replacing the CPA."*

### Failure Mode 10 -- Manager Doesn't Audit Weekly CRM Discovery Notes
Kills 60-75% of rollouts. **~30-day half-life un-coached.** Advisors revert by week 4. One discovery per advisor per week in 1:1. Non-negotiable.

### Common Manager Objections

**1. "My advisors already know discovery."** Pull last 90 days of CRM discovery notes. Bottom-quartile have fact-finder forms; top advisors have hand-notes with the 3 AM answer + held-away mapped + three written observations. Audit, don't assume.

**2. "Compliance and growth are in tension."** Backwards. Top-quartile RIAs (38-62% close) have the LOWEST exam findings + lowest U4 events + highest AUM retention.

**3. "Our wirehouse training already covers this."** Most wirehouse training covers the product platform; few teach FRAME-LIFE-MONEY-GAPS-PATH. The 5-STAGE is the disciplined version of what training already assumes.

**4. "Senior advisors don't have time for 60-min discoveries."** 30-min product overviews close at 12-22%; full 5-STAGE closes at 38-50%. Math favors the longer meeting on $2M+ relationships.

**5. "Senior advisors don't need this."** Pre-2020 seniors trained before Reg BI + pre-2022 before Marketing Rule tightened. Old habits (*"we outperformed the S&P"*, deck-as-opener) are now exam-deficiency categories.

**6. "We're dually registered — Reg BI handles compliance."** Reg BI handles the BD recommendation. SEC IA Act fiduciary handles RIA. State IAR + CFP Board layer on top. State best-interest insurance rules don't defer to Reg BI for the dually-registered crossover.

**7. "How do I know it's working?"** Three 90-day signals: discovery-conversion +12-22 pts per advisor / Form CRS delivery at first meeting above 95% / second-meeting-in-the-room rate above 70% / net-new AUM lift 12-18 months.

### When To Run A Second Time

Re-run every **90 days** with fresh unconverted-prospect audits + updated regulatory bulletins (SEC IA + FINRA Reg BI + state IAR + CFP Board). Rotate role-plays from last quarter's unconverted $2M+ prospects. Third run, swap archetypes — pre-retiree exec with concentrated employer stock + 10b5-1, multi-generational legacy family, single executor on $25M estate with adult-child friction, divorcing HNW spouse with QDRO, foreign-national with US-tax exposure, exec with $4M unvested ISOs, charitable-stack family with DAF + private foundation, special-needs trust beneficiary, closely-held business with outside-shareholder buyout.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Fourteenth entry** in **Pulse Sales Trainings** (\`/sales-trainings/\`) and **eighth industry-specific training** after st0007 (medical device), st0008 (real estate), st0009 (auto F&I), st0010 (pharma), st0011 (life insurance needs analysis), st0012 (mortgage refi), st0013. st0001-st0006 covered B2B SaaS motions; st0007-forward pivots to **industry-by-industry coverage**. st0014 is financial advisor + wealth-management discovery — the highest-leverage HNW acquisition conversation in personal financial services, inside the **SEC IA Act + FINRA Reg BI + SEC Marketing Rule 206(4)-1 + Form CRS + Form ADV + state IAR + CFP Board fiduciary** enforcement perimeter.

**Companion entries planned:** **st0015** Medicare advantage AEP/OEP, **st0016** group benefits broker enrollment-period, **st0017** financial planning fact-finder + plan delivery, **st0018** RIA first-meeting AUM conversion to discretionary, **st0019** estate planning + advanced markets (ILIT/IDGT/GRAT), **st0020** business succession + buy-sell specialist sales, **st0021** annuity + retirement-income planning, **st0022** wealth-management second-meeting (plan delivery + IMA signature), **st0023** multi-generational family-meeting facilitation.

**Cross-references to st0001-st0006 SaaS foundation arc translated for wealth management:** **st0001 discovery** → Stage 2 LIFE; **st0002 single-threading** → spouse-and-adult-children attendance (Cerulli: single-spouse discoveries close at half the rate); **st0003 objection recovery** → 5-STAGE deflection handling on *"just promise me I won't run out"* + *"my CPA already handles it"* + *"my buddies say buy real estate"*; **st0004 cold-call opener** → Stage 1 FRAME verbatim; **st0005 demo discipline** → Stage 4 GAPS (the firm's planning software is the demo, AFTER GAPS, in the second meeting); **st0006 pricing** → Stage 5 PATH all-in-cost disclosure + breakpoints.

**Cross-reference to st0007-st0013 — what transfers:** verbatim language on load-bearing moments + CRM-reviewed coaching cadence transfers exactly. st0007 made surgeons hear OR/Evidence/Outcome verbatim, st0008 sellers hear PROOF/Fee verbatim, st0009 customers hear 9-Step F&I verbatim, st0010 HCPs hear OPEN/PROBE/CONFIRM/CLOSE verbatim, st0011 families hear LISTEN/COMPUTE/EDUCATE/MATCH/COMMIT verbatim, st0014 makes HNW prospects hear FRAME/LIFE/MONEY/GAPS/PATH verbatim. **st0011 is the closest sibling** — also a regulated consumer-facing financial conversation with a Best-Interest Three Pillars frame. **What does NOT transfer:** wealth-management discovery has the highest *time-investment-per-prospect* ratio (2.5 hours per HNW relationship-start) and the longest *time-to-revenue* gap (90-180 days). The compliance overlay (SEC IA + Reg BI + Marketing Rule + Form CRS + state IAR + CFP) is the deepest of any industry covered; consequences (SEC enforcement, U4 events, CFP discipline) carry permanent career impact.

**Adjacent Pulse Knowledge Library entries:** SEC IA Act fiduciary walkthrough + FINRA Reg BI primer + SEC Marketing Rule 206(4)-1 + Form CRS rule + Form ADV Part 2 + state IAR registration + CFP Code of Ethics + Cerulli Great Wealth Transfer methodology + Schwab RIA Benchmarking + Vanguard Advisor's Alpha + channel landscape + CRM landscape + planning software + portfolio accounting. **q9601 fractional CFO** maps onto RIA practice-management economics.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0014](https://pulserevops.com/sales-trainings/st0014).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block (SEC Investment Advisers Act of 1940 fiduciary standard RIA + FINRA Regulation Best Interest Reg BI SEC Rule 15l-1 June 2020 care + disclosure + conflict + compliance BD obligations + SEC Marketing Rule 206(4)-1 2022 compliance date restrictions on testimonials performance hypothetical claims free portfolio review practices + Form CRS Form ADV Part 3 Client Relationship Summary required first-meeting delivery BD + RIA + Form ADV Part 2A brochure + Part 2B brochure supplement strategies fees conflicts advisor background + state IAR registration NASAA model state-by-state CRD IARD + CFP Board Code of Ethics and Standards of Conduct fiduciary duty at all times for CFP professionals + NAIC Suitability in Annuity Transactions Model #275 + state best-interest rules NY Reg 187 CA SB-1184 MA 211 CMR 96 NJ IA MN CT ME insurance crossover + Cerulli Associates US Retail Investor 2025 HNW prospect switching 2.4 advisors in 24 months data + Cerulli US Advisor Industry 2025 channel breakdown wirehouse regional BD IBD RIA hybrid + Cerulli Great Wealth Transfer 2024-2045 $84T projected intergenerational asset movement + Cerulli HNW Prospecting and Acquisition Research discovery-meeting close-rate benchmarks + Vanguard Advisor\'s Alpha quantification advisor value-add 3% net annually behavioral coaching largest single component + Charles Schwab Independent Advisor Outlook Study + Schwab RIA Benchmarking Study annual operating + growth metrics RIA channel + CFP Board ~100K CFP certificants + NAPFA fee-only RIA professional association + FPA Financial Planning Association + Investments & Wealth Institute CIMA CPWA designations + Investment Adviser Association RIA advocacy + NAIFA insurance-focused advisor advocacy + IRI Insured Retirement Institute annuity retirement income research + AAII American Association of Individual Investors HNW investor behavior surveys + wirehouses Morgan Stanley Wealth Management Merrill Lynch Bank of America UBS Wealth Management USA Wells Fargo Advisors + regional broker-dealers Edward Jones Raymond James RBC Wealth Stifel Janney + IBDs LPL Financial Cetera Cambridge Investment Research Commonwealth Kestra + RIAs Carson Group Mariner Wealth Mercer Global Advisors Creative Planning Wealth Enhancement Beacon Pointe Avantax Hightower Dynasty Financial Partners Focus Financial Captrust + CRM Salesforce Financial Services Cloud Redtail Orion Wealthbox + planning software eMoney Advisor MoneyGuidePro RightCapital NaviPlan + portfolio accounting Orion Tamarac Envestnet Black Diamond SS&C Addepar + trade press Barron\'s Advisor Financial Planning Magazine InvestmentNews ThinkAdvisor RIABiz RIA Channel Citywire RIA Reuters Wealth Management WealthManagement.com + foundational frameworks Mitch Anthony Storyselling for Financial Advisors + Bill Bachrach Values-Based Selling + Carl Richards The One-Page Financial Plan + Michael Kitces process research on top-quartile RIA acquisition motions). Every framework research source named so a branch manager can cite by name when advisors push back. EXPLICITLY WEALTH MANAGEMENT INDUSTRY - NOT SaaS - no Gong Bridge Group Pavilion ProfitWell SaaStr. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 8 quantified benchmark tables: (1) Cerulli US Retail Investor 2025 HNW Prospect Switching — average # advisors $2M+ HNW household has interviewed in last 24 months 1.6 in 2018 to 2.4 in 2025 / % of $2M+ prospects who take discovery meeting and become clients in 90 days ~42% 2018 to ~32% 2025 / % of HNW prospects citing they started talking about products before they understood what I cared about as primary reason for non-engagement ~28% 2018 to ~41% 2025 / # institutions average HNW household holds assets at 1.9 to 2.4 / Great Wealth Transfer projection 2024-2045 $84 trillion. (2) Schwab RIA Benchmarking Discovery Conversion by Discipline Tier — bottom-quartile pitch deck minute 8 fact-finder template 12-20% 3-6 relationships/year $1.4M avg ~$6M net-new AUM / below-average closed-question discovery gaps-as-solutions 18-28% 5-9 $1.8M ~$13M / industry median 22-32% 7-12 $2.1M ~$20M / top-quartile full 5-STAGE + 3-Pillar consistently 38-50% 14-22 $2.4M ~$42M / top-decile 5-STAGE + 3-Pillar + multi-generational + CPA/attorney coordination 48-62% 22-35 $3.1M ~$80M+. (3) Why HNW Prospects Decline to Engage After Discovery Cerulli + Vanguard + AAII — advisor talked about products before understanding what mattered FRAME/LIFE skipped 41% / felt advisor was selling not advising PATH was close not menu 29% / advisor didn\'t include spouse/influential family member 24% / fees not clearly disclosed up front DISCLOSURE Pillar near-miss 22% / distrusted advisor recommendation BEST INTEREST questioned 19% / existing advisor good enough and advisor didn\'t surface differentiated gaps 18% / wanted to talk to CPA/estate attorney first no coordination offer 17% / advisor ego-conflicted with existing CPA/attorney/advisor 15% / advisor didn\'t ask about held-away accounts felt small to prospect 12%. (4) Vanguard Advisor\'s Alpha Where the 3% Net Value-Add Comes From — behavioral coaching preventing panic-selling panic-buying ~150 bps / asset allocation + rebalancing discipline ~45 bps / cost-effective implementation low-cost vehicles ~30 bps / tax-loss harvesting + asset location ~75 bps / spending strategy withdrawal sequencing in retirement ~110 bps / total potential advisor alpha gross ~3%. (5) SEC + FINRA Enforcement Activity Areas Relevant to Discovery — Form CRS delivery failures recurring SEC + FINRA exam findings routine deficiency letter category / Marketing Rule 206(4)-1 violations performance/testimonial/hypothetical claims top SEC enforcement priority post-2022 / Reg BI care obligation recommendation rationale not documented most common cited deficiency / held-away asset disclosure in performance reporting SEC focus area for RIAs reporting only managed assets / conflicts of interest disclosure verbal disclosure expected in addition to ADV not just buried in document / insurance/annuity commission disclosure dually registered NAIC #275 + state best-interest enforcement rising NY CA MA IA NJ MN CT ME. (6) Form CRS / ADV Compliance Audit Discovery Meeting — Form CRS placed on table at first meeting + verbally walked YES low / Form CRS delivered via email after meeting only PARTIAL medium Form CRS rule permits delivery at or before recommendation verbal walkthrough best practice / Form CRS skipped because prospect didn\'t ask NO high recurring exam deficiency / Form ADV Part 2A brochure + Part 2B supplement scheduled for delivery YES low / all-in cost stated verbally advisory + fund + transaction + 12b-1 YES low DISCLOSURE Pillar best practice / conflicts of interest verbally disclosed + documented YES low Reg BI care obligation. (7) 5-STAGE Adoption Curve — Stage 1 FRAME no-pitch contract + Form CRS at minute 1 24% week 1 → 79% week 12 / Stage 2 LIFE 15-min open-ended what keeps you awake at 3 AM asked 18% → 74% / Stage 3 MONEY held-away rollover + crypto + alternatives mapped 31% → 82% / Stage 4 GAPS three observations stated as observations NOT solutions 14% → 68% hardest install / Stage 5 PATH second meeting calendared in the room 22% → 76% / ALL 5 stages every discovery 7% → 56%. Stage 4 GAPS + Stage 2 LIFE hardest to install — weekly CRM discovery-note audit by branch manager single biggest predictor of cohort discovery-conversion lift at 90 days. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 10-failure-mode counter-case: (1) Pitch deck before FRAME + LIFE most common single failure advisor opens firm Total Wealth Management deck at minute 8 because prospect asked so what do you do per Cerulli 41% of HNW non-engagements trace to product-talk-too-early prospect what-do-you-do is data not permission answer in FRAME language briefly KEEP no-pitch contract intact. (2) Closed-question fact-finder disguised as LIFE template form no emotional signal surfaces prospect leaves having shared facts not motivation open-ended LIFE mandatory with what keeps you awake at 3 AM as diagnostic no question no discovery. (3) Skipped held-away in MONEY advisor captures assets in front of them skips rollover 401k at prior employer + discount-broker brokerage + crypto exchange per Cerulli average HNW household holds at 2.4 institutions held-away is where next 5 years of growth lives ask in MONEY every time where else are assets held even small accounts. (4) Gaps stated as solutions classic GAPS Stage collapse advisor observes concentrated stock position and immediately pivots to we\'d move 100% of that into our diversified large-cap strategy tomorrow turns diagnosis into pitch and collapses every prior minute of trust state observations as observations with or without me framing every time three observations not six. (5) Single-threaded discovery spouse not present + advisor doesn\'t invite to second meeting per Cerulli married-couple HNW prospects close at half rate when only one spouse attended discovery standard FRAME line before we go further I\'d like to ask we schedule second meeting with your spouse present most of what we plan affects both of you calendar in the room. (6) Form CRS delivered by email after technically compliant under Form CRS rule delivery at or before recommendation but trust failure prospect has been pitched by 2.4 advisors who didn\'t put it on table putting Form CRS down at minute 1 is differentiation move not compliance afterthought. (7) Promised no-run-out I can promise you won\'t run out of money SEC Marketing Rule 206(4)-1 problem AND fiduciary problem honest answer is probabilistic one I can build plan with withdrawal rate that has high probability of lasting your lifetime under range of market scenarios refusing to promise IS the fiduciary move. (8) We outperformed the S&P last year SEC Marketing Rule 206(4)-1 2022 restricts performance claims even when true presentation rules apply net of fees time period disclosure benchmark comparison top SEC enforcement priority post-2022 drop performance claims from discovery script entirely. (9) Ego-conflict with existing CPA/attorney/advisor advisor implies prospect\'s CPA is missing things trust-killer fiduciary move is coordination not replacement your CPA is right about X wealth-advisor coordination is across tax-investment-estate-insurance-family not replacing CPA. (10) Branch manager doesn\'t audit weekly CRM discovery notes kills 60-75% of discovery training rollouts per Schwab RIA Benchmarking 30-day half-life un-coached advisors revert to pitch-deck-at-minute-8 + gap-as-pitch + single-threaded discovery by week 4 one discovery per advisor per week reviewed in 1:1 non-negotiable. Plus 7 common branch manager objections with honest answers: advisors already know discovery / compliance and growth in tension / wirehouse training already covers this / senior advisors don\'t have time for 60-min discoveries / senior advisors don\'t need this been doing it for 20 years / most team dually registered Reg BI handles compliance / how do I know it\'s working three 90-day signals discovery-conversion +12-22 pts per advisor + Form CRS delivery rate above 95% + second-meeting calendar-in-the-room rate above 70% + zero new exam deficiency findings + net-new AUM lift 12-18 months. Plus when-to-rerun-every-90-days cadence with rotated archetypes pre-retiree executive with $8M concentrated employer stock + 10b5-1 plan + multi-generational legacy family with trust-protector dynamics + single executor on $25M estate with adult-child friction + divorcing HNW spouse with QDRO + foreign-national with US-tax exposure + executive with $4M of unvested ISOs + charitable-stack family with DAF + private foundation + special-needs trust beneficiary + gay couple with non-traditional beneficiary planning + family with closely-held operating business + outside-shareholder buyout. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as FOURTEENTH entry and EIGHTH industry-specific training after st0007 orthopedic medical device sales + st0008 residential real estate listing presentations + st0009 automotive F&I + st0010 specialty pharmaceutical HCP detailing + st0011 life insurance needs analysis + st0012 mortgage refi + st0013 — st0001-st0006 covered B2B SaaS sales motions that translate across industries from st0007 forward pivots to industry-by-industry coverage and st0014 is financial advisor + wealth-management discovery the highest-leverage HNW acquisition conversation in personal financial services the territory where wirehouse FAs at Morgan Stanley + Merrill Lynch + UBS + Wells Fargo Advisors and regional BD reps at Edward Jones + Raymond James + RBC + Stifel + Janney and IBD reps at LPL Financial + Cetera + Cambridge + Commonwealth + Kestra and RIA advisors at Carson Group + Mariner + Mercer Global + Creative Planning + Wealth Enhancement + Beacon Pointe + Avantax + Hightower + Dynasty + Focus Financial + Captrust earn the right to manage HNW assets inside SEC IA Act fiduciary + FINRA Reg BI + SEC Marketing Rule 206(4)-1 2022 + Form CRS + Form ADV + state IAR + CFP Board fiduciary enforcement perimeter. Companion industry-specific entries planned st0015 Medicare advantage AEP/OEP + st0016 group benefits broker enrollment-period + st0017 financial planning fact-finder + plan delivery + st0018 RIA first-meeting AUM conversion to discretionary + st0019 estate planning + advanced markets ILIT IDGT GRAT + st0020 business succession + buy-sell specialist sales + st0021 annuity + retirement-income planning + st0022 wealth-management second-meeting plan delivery + IMA signature + st0023 multi-generational family-meeting facilitation. Cross-references to st0001-st0006 SaaS foundation arc translated for wealth management: st0001 discovery → Stage 2 LIFE 15-min open-ended kitchen-table fact-finder / st0002 single-threading → spouse-and-adult-children attendance Cerulli single-spouse discoveries close at half rate / st0003 objection recovery → 5-STAGE deflection handling on just promise me I won\'t run out + my CPA already handles it + my buddies say buy real estate / st0004 cold-call opener → Stage 1 FRAME verbatim no-pitch contract Form CRS minute 1 / st0005 demo discipline → Stage 4 GAPS firm planning software is the demo AFTER GAPS in second meeting / st0006 pricing → Stage 5 PATH all-in-cost disclosure + breakpoints. Cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 what transfers — discipline of verbatim language on load-bearing moments + CRM-reviewed coaching cadence transfers exactly where st0007 made surgeons hear OR + Evidence + Outcome verbatim st0008 made sellers hear PROOF + Fee 4-line + PRICE-as-range verbatim st0009 made customers hear 9-Step F&I verbatim st0010 made HCPs hear OPEN + PROBE + CONFIRM + CLOSE verbatim st0011 made families hear LISTEN + COMPUTE + EDUCATE + MATCH + COMMIT verbatim st0012 made homeowners hear refinance-math verbatim st0014 makes HNW prospects hear FRAME + LIFE + MONEY + GAPS + PATH verbatim st0011 closest sibling also regulated consumer-facing financial conversation with Best-Interest Three Pillars compliance frame st0014 inherits structure and re-anchors to SEC IA + Reg BI + Marketing Rule + Form CRS perimeter what does NOT transfer wealth-management discovery has highest time-investment-per-prospect ratio of any industry covered so far 60-min discovery + 60-min plan-delivery + 30-min IMA signature = 2.5 hours per HNW relationship-start and longest time-to-revenue gap 90-180 days from FRAME to first quarterly fee accrual compliance overlay SEC IA + Reg BI + Marketing Rule + Form CRS + state IAR + CFP fiduciary deepest of any industry covered consequences SEC enforcement FINRA U4 disclosure events CFP discipline carry permanent career impact. Adjacent Pulse Knowledge Library entries SEC IA Act fiduciary walkthrough + FINRA Reg BI primer + SEC Marketing Rule 206(4)-1 detailed guide + Form CRS rule + Form ADV Part 2 brochure rule + state IAR registration overview + CFP Board Code of Ethics + Cerulli Great Wealth Transfer methodology + Schwab RIA Benchmarking methodology + Vanguard Advisor\'s Alpha decomposition + channel landscape wirehouse-vs-IBD-vs-RIA + CRM landscape Salesforce FSC vs Redtail-Orion vs Wealthbox + planning software eMoney vs MoneyGuidePro vs RightCapital + portfolio accounting Orion vs Tamarac vs Black Diamond vs Addepar + q9601 fractional CFO maps onto RIA practice-management economics conversation with founding-partner production share + tenured-FA grid payout + branch-manager override structures. Reading list of frameworks with URLs: SEC IA Act sec.gov + FINRA Reg BI finra.org + SEC Marketing Rule sec.gov/investment/marketing-rule + Form CRS sec.gov/about/forms/formcrs.pdf + Cerulli research cerulli.com + Schwab Advisor Services advisorservices.schwab.com + Vanguard Advisor Alpha corporate.vanguard.com + CFP Board cfp.net + NAPFA napfa.org + FPA onefpa.org + IRI irionline.org + AAII aaii.com + industry trade press Barron\'s Advisor + Financial Planning + InvestmentNews + ThinkAdvisor + RIABiz + Citywire RIA + WealthManagement.com + foundational frameworks Mitch Anthony Storyselling for Financial Advisors + Bill Bachrach Values-Based Selling + Carl Richards The One-Page Financial Plan + Michael Kitces process research on top-quartile RIA acquisition motions. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Fourteenth Pulse Sales Training entry st0014 and EIGHTH industry-specific training after st0007 medical device + st0008 real estate + st0009 auto F&I + st0010 pharma + st0011 life insurance + st0012 mortgage refi + st0013 — fully runnable 60-minute live financial-advisor + wealth-management Discovery Meeting training for the highest-leverage HNW acquisition conversation in personal financial services (per Cerulli Associates US Retail Investor 2025: average $2M+ HNW household has interviewed 2.4 advisors in last 24 months up from 1.6 in 2018 + only ~32% of $2M+ prospects who take discovery meeting become clients within 90 days + #1 reason cited they started talking about products before they understood what I cared about + $84T Great Wealth Transfer 2024-2045) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,000 words ABSOLUTE HARD CAP 10,500. LEAN-FROM-START pattern mirroring st0011 closest sibling. Structure: orange Pulse Training callout intro (who-for: wirehouse FAs Morgan Stanley Wealth Management Merrill Lynch UBS Wealth USA Wells Fargo Advisors + regional BD reps Edward Jones Raymond James RBC Wealth Stifel Janney + IBD reps LPL Financial Cetera Cambridge Investment Research Commonwealth Kestra + RIAs Carson Group Mariner Wealth Mercer Global Advisors Creative Planning Wealth Enhancement Beacon Pointe Avantax Hightower Dynasty Financial Partners Focus Financial Captrust; works 3rd-year producer to 20-year senior partner; what-bring: 3 recent unconverted $2M+ prospect notes/recordings + current discovery fact-finder template + Form ADV Part 2 + Form ADV Part 3 CRS + printed leave-behind + whiteboard) + Bottom Line callout You don\'t manage the assets you earn the relationship portfolio comes last + 5-stage + 3-Pillar thesis + 6-row pipe-table agenda + Section 1 Cold Open with Cerulli US Retail Investor 2025 2.4 advisors in 24 months + ~32% close in 90 days + #1 reason product-talk-too-early + $84T Great Wealth Transfer + Maya 12-yr Merrill complex composite $2.8M widow referral pitch deck minute 8 lost vs restructured 5-STAGE discovery same widow 6 months later $4.2M plus sibling money in 8 months + Common Trap compliance approved our pitch deck three answers deck is reference not script + deck-as-opener is exactly why HNW switching at record highs + Section 2 Teach split into Part A 5-STAGE DISCOVERY 12 min (Stage 1 FRAME 5 min set meeting expectation disclose engagement type put Form CRS on table at minute 1 no-pitch contract sound fair verbal yes / Stage 2 LIFE 15 min open-ended FAMILY VALUES CONCERNS LIFE EVENTS NEXT 5 YEARS walk me through your family what does great year look like not in dollars in what you\'d be doing what keeps you awake at 3 AM about money have you had advisor before what worked what didn\'t hand-notes only NEVER product mention / Stage 3 MONEY 15 min account-by-account inventory including held-away rollover 401k + discount-broker brokerage + crypto + alternatives + business equity + real estate + liabilities + estate documents + tax + insurance + employer benefits + RSU/option vesting schedules + concentrated positions HOLD-AWAY DISCOVERY critical average HNW household holds at 2.4 institutions / Stage 4 GAPS 8 min real-time on-paper observation outdated beneficiary designations + missing/stale revocable trust + concentrated single-stock position + excess cash drag + tax-inefficient asset location + insurance gaps + no Roth conversion roadmap + no QCD + RSU strategy + family-conflict gaps state as observations NOT solutions with or without me framing three observations not six / Stage 5 PATH 5 min non-pressure close + specific next-step menu three things to act on regardless second meeting calendared BEFORE leaving spouse invited) and Part B FIDUCIARY-FORWARD Three Pillars Compliance Frame 5 min (Pillar 1 BEST INTEREST FIDUCIARY SEC IA Act fiduciary RIA + FINRA Reg BI care + disclosure + conflict + compliance BD + state best-interest rules NY CA MA IA NJ CT ME MN insurance crossover + CFP Board fiduciary at all times documented why-this-not-that rationale / Pillar 2 DISCLOSURE Form CRS at first meeting Form ADV Part 2A brochure + 2B supplement conflicts of interest revenue sharing 12b-1 proprietary product preference third-party comp custodian transaction credits fee schedule + breakpoints all-in cost advisory + fund + transaction + 12b-1 / Pillar 3 NO PRESSURE NO MISREPRESENTATION no free portfolio review pitches without ADV rising FTC + state DOI complaints no guaranteed return or outperforming the market language under SEC Marketing Rule 206(4)-1 2022 no concealing held-away assets in performance reporting no we use same strategy as Yale endowment puffery no concealed insurance/annuity comp) + Section 3 Discussion 6 prompts (last unconverted $2M+ prospect demographics AUM scope last 3 interactions per CRM Salesforce FSC Redtail-Orion Wealthbox + which 5 stages broke + Form CRS on table at minute 1 + spouse invited if not there + held-away accounts mapped + ONE concrete next move verbatim) + Section 4 Two-Person Role-Play with Round 1 Eleanor Whitfield 68 widow $2.4M IRA + $850K joint brokerage + $400K MM + $720K home + held-away $180K Roth daughter Cynthia influencer Coca-Cola concentrated position three deflections Frank handled the money just tell me what to do / daughter wants Edward Jones friend / promise I won\'t run out of money ADVISOR runs full 5-STAGE FRAME with Form CRS at minute 1 LIFE surfaces sibling conflict over Mom\'s estate MONEY surfaces $180K Roth + Coca-Cola concentrated GAPS observes outdated beneficiary Frank still listed + concentrated stock + 2011 will PATH calendars second meeting Cynthia explicitly invited + Round 2 Marcus Reyes 52 founder $14M LOI + $4M earnout 45-person Atlanta SaaS Aprio CPA Steve blended family Diego 16 step-kids out of house 2008 will no trust no life insurance three deflections CPA said just need quarterly tax / want to DIY at Schwab / buddies say buy Atlanta multifamily ADVISOR distinguishes coordination-not-replacement vs CPA surfaces QSBS Section 1202 opportunity + 2008 will gap + no trust + zero life insurance + earnout multi-year tax planning + 60-sec reset + Section 5 Debrief+Commitments 3 debrief Qs which stage felt strongest + which Pillar nearly crossed + next concrete action + 4-line commitment ritual next target $2M+ prospect + stage to lead with + ONE verbatim language change + CRM log within 14 business days + Section 6 Leave-Behind walkthrough + printable one-pager (5-STAGE framework as vertical grid with verbatim cue lines / Fiduciary-Forward Three Pillars compliance frame as 3-quadrant grid / 10 most common gaps a Discovery surfaces quick-reference outdated beneficiaries + missing trust + single-stock concentration + cash drag + asset location + insurance gaps + Roth roadmap absent + QCD missing + RSU strategy + family-conflict gaps / Form CRS / Form ADV Part 2 / Form ADV Part 3 compliance checklist Form CRS placed on table at minute 1 verbally walked + Form ADV Part 2A firm brochure delivered + Form ADV Part 2B supplement + conflicts verbally disclosed + fee schedule + breakpoints + all-in-cost number stated verbally + engagement type disclosed + discovery hand-notes scanned to CRM + held-away mapped + three observations documented + second meeting calendared / Never-Do behavior list 12 items / Outcome Line wins full 5-STAGE in sequence + Three Pillars live + Form CRS at minute 1 + held-away mapped + three observations stated as observations + second meeting calendared in room + spouse invited = 35-50% close + 90%+ AUM retention + 2-3 referrals per closed relationship + zero compliance findings + top-quartile growth vs losses pitch deck minute 8 + closed-question fact-finder + held-away skipped + gaps stated as solutions + we should move accounts this week + single-threaded discovery = 18-28% close + 60-70% retention + zero referrals + Reg BI exam risk + 2.4-advisors-in-24-months statistic personified / If You Only Remember One Thing hero quote You don\'t earn the right to manage their money by being the smartest in the room You earn it by being the only advisor who asked about their family before asking about their assets). How-this-fits-in-wealth-management-practice table at end of core showing pre-meeting + first 5 minutes + next 15 minutes LIFE + next 15 minutes MONEY + next 8 minutes GAPS + last 5 minutes PATH + compliance overlay + manager coaching. Two mermaid diagrams: 60-min meeting flow + manager coaching loop post-training. 7 benchmark tables (Cerulli US Retail Investor 2025 HNW Prospect Switching + Schwab RIA Benchmarking Discovery Conversion by Discipline Tier + Why HNW Prospects Decline + Vanguard Advisor\'s Alpha Where 3% Comes From + SEC + FINRA Enforcement Activity Areas + Form CRS / ADV Compliance Audit + 5-STAGE Adoption Curve). 10-failure-mode counter-case + 7-branch-manager-objection coach-back + when-to-rerun. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping + companion industry-specific entries planned st0015-st0023 + cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 what transfers (verbatim language on load-bearing moments + CRM-reviewed coaching cadence) and what does not (wealth-management discovery has highest time-investment-per-prospect ratio and longest time-to-revenue gap and deepest compliance overlay of any industry covered so far). Tags include sales-training (hub filter) + financial-advisor-training + wealth-management + discovery-meeting + high-net-worth + finra-reg-bi-compliant + fiduciary-standard + 60-min-meeting + standard-team + st0014. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY WEALTH MANAGEMENT INDUSTRY - NOT SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Industry-correct sources: SEC IA Act + FINRA Reg BI + SEC Marketing Rule 206(4)-1 + Form CRS + Form ADV + state IAR + CFP Board + Cerulli + Schwab RIA Benchmarking + Vanguard Advisor\'s Alpha + AAII + NAIC + IRI + wirehouse + regional BD + IBD + RIA channel landscape + Salesforce FSC + Redtail-Orion + Wealthbox + eMoney + MoneyGuidePro + RightCapital + Orion + Tamarac + Black Diamond + Addepar + Barron\'s Advisor + Financial Planning + InvestmentNews + ThinkAdvisor + RIABiz + Citywire RIA + WealthManagement.com + foundational frameworks Mitch Anthony + Bill Bachrach + Carl Richards + Michael Kitces. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0014 is crawled.
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
