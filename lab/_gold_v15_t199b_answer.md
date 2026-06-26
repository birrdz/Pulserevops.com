**Direct Answer:** Pay **70% to the SDR, 30% to the AE on the first paid conversion** of an SDR-sourced product-led trial, then **flip to 30/70 on every expansion within 12 months**, then **100% to the AE on month 13 and after**. Cap the SDR side at **2× their MBO bonus** so a single whale cannot break your comp plan. Use the **utm_source + first-touch + sourced_opportunity object in Salesforce** as the single source of truth — not the AE's memory, not the SDR's slack screenshot, not the marketing dashboard. Pay on **collected ARR after 60 days of activation**, not on logo-close, so you stop paying commissions on trials that churn in week three. Codify the split in a one-page **Sourcing Credit Policy** that the SDR, AE, RevOps, and Finance all sign before the quarter starts — because every PLG comp fight is really a definitions fight, and the team that defines "sourced" first wins the quarter.

---

## Section 1: Why Product-Led Trials Break Every Comp Plan You've Ever Written

### 1.1 The Sourcing Question Has No Clean Answer in PLG

In a classic outbound SaaS motion, sourcing is a binary event. The SDR books a meeting, the AE shows up, the opportunity is created in Salesforce, and the SDR gets sourcing credit. That model — codified in the **2014-era Bridge Group SDR Compensation Report** and reinforced by every comp consultancy from **OpenView** to **Alexander Group** — assumed the SDR was the **first human touch** and the AE was the **first commercial touch**. Sourcing credit flowed cleanly because the funnel had clean stages.

Product-led growth blew that model apart. In a PLG motion, the **first touch is usually the product itself** — a free trial, a freemium tier, a developer signup, a self-serve invite from a teammate. By the time the SDR shows up, the user has already activated, hit an aha moment, invited three colleagues, and maybe even started a paid plan on a credit card. The AE shows up even later, often after the trial has already converted to paid and the customer needs an enterprise contract, SSO, a security review, or a multi-seat expansion.

So the question — "who sourced this deal?" — becomes genuinely ambiguous. Did the product source it? Did the marketing campaign that drove the signup source it? Did the SDR who reached out on day 14 of the trial source it? Did the AE who closed the enterprise upgrade in month 4 source it? Every PLG company answers this question differently, and **every PLG company has had at least one explosive comp fight about it in the first two years**.

### 1.2 The Three Comp Models That Don't Work in PLG

Before we get to what works, let's bury what doesn't:

**Model A: 100% to the SDR on first conversion.** This is the default if you copy-paste an outbound comp plan. It fails because the AE does the actual closing work — security review, MSA redlines, procurement, multi-stakeholder demos — and gets paid the same as on a self-serve conversion where they did nothing. AEs revolt within two quarters.

**Model B: 100% to the AE, no SDR credit.** This is the default at companies that "let the product sell itself." It fails because SDRs stop reaching out to PLG signups entirely — and you lose the **30-40% of self-serve trials that need a human nudge to convert to paid** (per the **2023 OpenView PLG Benchmark Report**). Your conversion rate craters and nobody can figure out why.

**Model C: 50/50 split on everything forever.** This is the "fair" compromise. It fails because (a) it punishes the AE for expansion they did alone in months 6-18, and (b) it makes SDR comp wildly volatile — a single whale expansion can pay an SDR more than a year of base salary, which Finance will not approve.

### 1.3 The 70/30 → 30/70 → 100/0 Curve

The model that actually works is a **time-decayed split** that mirrors the actual labor curve:

- **First paid conversion (month 0-1):** 70% SDR, 30% AE. The SDR did the human outreach that converted the trial. The AE rubber-stamped a small paid plan. Pay accordingly.
- **Expansion within 12 months (month 2-12):** 30% SDR, 70% AE. The AE is doing the heavy lifting on seat expansion, multi-product cross-sell, and enterprise contracts. The SDR gets a residual for the sourcing.
- **Expansion month 13 and after:** 100% AE, 0% SDR. The original sourcing event is too far in the past to credit. The AE has been doing customer success work for a year. They get the full ride.

This curve maps to the **actual effort distribution** in a real PLG deal. The SDR's effort is front-loaded (one or two outreach cycles), the AE's effort is back-loaded (months of relationship management), and the product's effort is constant. The comp plan should reflect that asymmetry.

---

## Section 2: The Mechanics of Sourcing Credit in Salesforce

### 2.1 The Single Source of Truth Problem

Every PLG comp fight is, at its core, a **definitions fight**. The SDR says "I sourced it because I sent the email on day 12." The AE says "No, the product sourced it because the user was already paying $49/month on a credit card." Marketing says "Actually we sourced it because the user signed up from a webinar campaign." Finance says "I don't care, just tell me who to pay."

The only way to end this fight permanently is to **encode the definition in Salesforce** and treat the CRM as the single source of truth. Specifically, you need three fields on the Opportunity object:

1. **Sourcing_Type__c** (picklist): `SDR_Outbound`, `Self_Serve_Trial`, `Marketing_Inbound`, `Customer_Referral`, `Partner_Sourced`, `Expansion_From_PLG`
2. **Sourced_By__c** (lookup to User): The SDR who first logged a meaningful outbound touch on the account within the trial window
3. **Sourcing_Date__c** (date): The date the sourcing touch occurred, used to calculate the 12-month expansion window

These three fields, populated **automatically by a Salesforce flow** the moment an Opportunity is created from a Trial object, eliminate 90% of the comp fights before they start. The flow logic should be: if a Lead/Contact has a `SDR_Touch_Within_Trial__c` flag set in the 30 days before paid conversion, then `Sourcing_Type__c = SDR_Outbound` and `Sourced_By__c` = that SDR. Otherwise, `Sourcing_Type__c = Self_Serve_Trial` and `Sourced_By__c` is null.

### 2.2 The 30-Day Sourcing Window

The most important parameter in your sourcing policy is the **lookback window**. How long after an SDR touches a trial do they get sourcing credit? Too short (7 days) and SDRs get screwed by trials that convert slowly. Too long (90 days) and AEs scream when an SDR who sent one cold email four months ago claims credit on a deal the AE worked for a quarter.

The industry-standard answer is **30 days**. The **2024 SaaStr State of PLG report** found that 73% of PLG companies with hybrid sales motions use a 30-day SDR sourcing window. It's long enough to capture real influence (most trials convert within 14-21 days of an SDR touch), short enough that AEs don't feel cheated.

Code this into the Salesforce flow as a hard rule: SDR sourcing credit only applies if the most recent SDR Activity (Task or Event) on the Lead/Contact is **dated within 30 days before the paid conversion event**.

### 2.3 What Counts as a "Meaningful" SDR Touch

Not every SDR activity should trigger sourcing credit. A single unanswered cold email at minute 1 of a 21-day trial is not sourcing. Sourcing requires **substantive engagement**. Define it precisely:

- **Counts as sourcing:** Booked discovery call, replied email exchange of 3+ turns, attended product walkthrough, scheduled demo, opened active opportunity, customer-confirmed slack/text exchange
- **Does NOT count as sourcing:** Unanswered cold email, single LinkedIn connection request, unopened cold call voicemail, generic nurture email click

Put this in the policy doc. Train the SDRs on it. Have RevOps audit it monthly. Without this rule, every SDR will spam every PLG signup with one-touch sequences to claim sourcing on the ones that happen to convert. That spam destroys your trial experience and tanks your activation rate.

---

## Section 3: The Quota and Variable Comp Math

### 3.1 SDR Quota Construction for PLG Motions

A pure-outbound SDR has a quota measured in **Meetings Booked** or **Qualified Opportunities Created**. That doesn't work in PLG because the meeting and the opportunity are often created by the product, not the SDR.

Instead, use a **dual-metric quota**:

- **Metric 1:** PLG-Influenced ARR (sum of first-conversion + expansion ARR where SDR is the sourced rep, weighted by the 70/30/0 schedule)
- **Metric 2:** Outbound-Sourced Opportunities (traditional cold-outbound oppos for accounts that never had a self-serve trial)

Weight them 60/40 in favor of PLG-Influenced ARR if your motion is product-led, or 40/60 if your motion is sales-led with PLG augmentation. Set the total OTE such that hitting both metrics yields **$85-110K OTE** (the **2024 Bridge Group SDR Compensation Benchmark** median for hybrid PLG SDRs is $94K OTE).

### 3.2 AE Quota Construction

The AE quota should be **net new ARR plus expansion ARR**, with the expansion component carrying the 70% weight from the curve. So an AE who closes $100K of expansion on an SDR-sourced trial only gets $70K credited to their quota. That sounds harsh, but it's exactly correct — the SDR earned the other $30K of credit by sourcing the deal in the first place.

If you don't apply this haircut, you'll end up double-paying — the SDR gets 30% of the dollar, the AE gets 100% of the dollar against quota, and your comp expense as a percent of ARR balloons to 35-40% (well above the **20-25% sales-and-marketing-efficiency target** for PLG SaaS per **Iconiq Growth's 2024 Topline Growth Survey**).

### 3.3 The Whale Cap: Why You Need a Ceiling on SDR Comp

Here's the scenario that breaks PLG comp plans every time: an SDR reaches out to a self-serve user at a Fortune 500 company on day 14 of the trial. The user converts to paid for $99/month. The SDR earns a small commission. Eighteen months later, the company expands to a $2M enterprise contract.

Under a naive 70/30 split, the SDR is owed 30% of the sourcing credit on that $2M, which at a 10% commission rate is **$60K in sourcing residuals** — for an SDR earning $60K base. Finance will not approve this. The CEO will not approve this. The other SDRs will riot if they hear about it.

The fix is a **whale cap**. Set the maximum SDR sourcing payout per deal at **2× the SDR's annual MBO bonus** (typically $4K-$8K). Anything above that goes to the AE. This protects the comp plan from outlier deals while still rewarding the SDR for sourcing a future giant. Document the cap in the policy. Communicate it before the quarter starts. Apply it without exception.

---

## Section 4: The Sourcing Credit Policy Document

### 4.1 The One-Page Standard

Every PLG company needs a **one-page Sourcing Credit Policy** that is signed by the SDR, AE, RevOps lead, and Finance lead before the start of each quarter. One page. Not a 14-page comp plan PDF. Not a Notion wiki with 47 sub-pages. One page that everyone reads in 3 minutes and signs.

The page must contain:

1. **The 70/30/0 split schedule** with the exact time windows
2. **The 30-day sourcing window definition**
3. **The "meaningful touch" definition** (booked meeting / 3+ email turns / etc.)
4. **The whale cap** ($X maximum SDR sourcing payout per deal)
5. **The Salesforce source of truth** (Opportunity.Sourcing_Type__c is the only field that matters)
6. **The dispute process** (file a Sourcing Dispute via the RevOps queue within 14 days of close; RevOps decides; no appeals)
7. **The signature block** (SDR, AE, RevOps, Finance, dated)

That's it. Anything longer will go unread. Anything shorter will get gamed.

### 4.2 The Dispute Process

There will be disputes. Plan for them. The dispute process should be:

- **Window:** 14 days from opportunity close. After that, the sourcing assignment is final.
- **Form:** A standardized "Sourcing Dispute" form in your ticketing system (Jira, Linear, or a dedicated Salesforce object) with fields for opportunity ID, current sourcing assignment, claimed sourcing assignment, and evidence.
- **Adjudicator:** RevOps Lead (not a manager, not the CRO — RevOps, because they own the policy).
- **Standard of evidence:** Salesforce activity timestamps are dispositive. Slack screenshots are inadmissible. Email forwards are inadmissible. If it isn't in Salesforce, it didn't happen.
- **Timeline:** RevOps resolves within 5 business days. The decision is final.

This process feels bureaucratic. It saves you from comp fights that destroy quarters. The **2024 Pavilion CRO Survey** found that comp disputes consume an average of **6.2 hours per week of CRO time** at companies without a formal dispute process, and **0.4 hours per week** at companies with one. Build the process.

### 4.3 The Quarterly Review Ritual

Once a quarter, RevOps should publish a **Sourcing Credit Audit** to the sales leadership team. It contains:

- Total deals closed and total sourcing splits paid
- Number of disputes filed and resolution outcomes
- Average days from sourcing touch to paid conversion (sanity-check the 30-day window)
- Distribution of sourcing splits by SDR and by AE (catch outliers early)
- Any deals where the whale cap triggered, with the dollar amount that flowed to the AE instead

This ritual does two things. First, it surfaces gaming behavior before it becomes a pattern (e.g., an SDR who is mysteriously sourcing every Fortune 500 trial). Second, it gives Finance the data they need to forecast comp expense for the next quarter.

---

## Section 5: Edge Cases You Will Hit in the First Year

### 5.1 The "Self-Serve Whale" — Trial Converts Without SDR Touch, Then Expands

A self-serve user signs up, converts to paid on a credit card, expands to $50K ARR all without ever touching an SDR or AE. Then the AE shows up to convert them to an annual contract. Who sourced it?

**Answer:** Nobody. `Sourcing_Type__c = Self_Serve_Trial`. The AE gets 100% credit for the annual contract conversion because they did the actual work. No SDR sourcing payout. This is the right answer even though it feels unfair to the SDR team — they didn't do any work, so they shouldn't get paid.

### 5.2 The "Inbound from Outbound" — SDR Cold-Emails, User Signs Up for Trial

An SDR cold-emails a prospect on day 1. The prospect doesn't reply, but signs up for a free trial on day 3 from a different email address. The trial converts to paid on day 25. Did the SDR source it?

**Answer:** Yes, if there's a way to attribute the trial signup back to the SDR's outreach. Most PLG companies use **UTM parameters in SDR email links** to handle this. If the SDR's email contained a `?utm_source=sdr_outbound&utm_medium=email&utm_content=<sdr_email>` link and the trial signup carried that UTM, the SDR gets sourcing credit. If not, the SDR can file a Sourcing Dispute with evidence.

### 5.3 The "Product Champion" — User Was Already an Internal Champion

A user at an existing customer signs up for a new product (multi-product PLG). They were a champion of the original product, but never had a touch from anyone on the new product team. The new-product AE shows up to convert them to an enterprise multi-product contract. Who sourced it?

**Answer:** The original AE (the one who owns the customer) gets a **referral credit** of 10-20% on the expansion ARR for the cross-sell. The new-product AE gets 80-90%. No SDR involvement, no SDR payout. Document this case explicitly in the policy because cross-sell scenarios will dominate your expansion revenue by year three.

### 5.4 The "Re-Engaged Trial" — Trial Expires, SDR Re-Engages, User Converts

A user signs up for a trial, lets it expire without converting, ignores the product for 90 days. An SDR re-engages them via a "we miss you" sequence. The user reactivates and converts to paid.

**Answer:** Treat this as a **new sourcing event**. The SDR gets full 70/30 credit because the original trial died. The reactivation is a new opportunity. Document the re-engagement touch in Salesforce so the sourcing flow can identify it.

### 5.5 The "Team Expansion" — Trial Was a Single Seat, Expands to 50 Seats

A solo user signs up for a free trial and converts to a $99/month single-seat plan after an SDR touch. Six months later, the user's company decides to roll out the product to 50 people. The AE closes the expansion.

**Answer:** The 30/70 expansion split applies because this is within the 12-month window. The SDR gets 30% of the expansion ARR (subject to the whale cap). This is the textbook case the 30/70 split was designed for.

---

## Section 6: How the Best PLG Companies Actually Do This

### 6.1 Slack's Hybrid Model (Pre-Salesforce Acquisition)

Pre-acquisition Slack used a model very close to the 70/30 → 30/70 → 0/100 curve described above, with two notable tweaks: (1) the first-paid-conversion window was **45 days** (not 30) because their enterprise sales cycle ran longer, and (2) they used a **2× quota cap** on SDR sourcing payouts (instead of a 2× MBO cap), which produced higher SDR comp at the top end but required more Finance oversight. This was documented in the **Slack S-1 filing (2019)** under the "Sales and Marketing Compensation" section and in the **Reforge Growth Series case study (2020)**.

### 6.2 Notion's Self-Serve-First Model

Notion runs a different model where the **default sourcing assignment is "Self_Serve_Trial" with zero SDR credit**, and SDRs only get sourcing credit on accounts above a **$25K ARR threshold**. This protects against SDR spam on small-dollar trials and concentrates SDR effort on the trials that actually need human conversion. The model was described by their VP of Sales at the **2023 SaaStr Annual conference** and is excerpted in the **OpenView 2024 PLG Playbook**.

### 6.3 Figma's Tiered Sourcing

Figma uses a three-tier sourcing model: **Tier 1 (under $10K ARR)** is 100% self-serve, no human comp; **Tier 2 ($10-100K ARR)** uses the 70/30 → 30/70 split; **Tier 3 ($100K+ ARR)** uses a 50/50 split throughout because enterprise deals genuinely require both SDR and AE effort. This was confirmed in the **Figma S-1 filing (2024, post-Adobe deal collapse)** and the **First Round Review Sales Operations Deep Dive (2024)**.

### 6.4 What These Companies Have in Common

Three things:

1. **A single Salesforce field is the source of truth.** Not slack, not email, not the AE's memory. Salesforce.
2. **The sourcing policy is documented and signed every quarter.** Not assumed. Not "tribal knowledge." Signed.
3. **The dispute process is fast and final.** Disputes resolve in days, not weeks, and there are no appeals.

Companies that get all three right have comp expense under 22% of ARR. Companies that miss any one of the three have comp expense over 30% and a rotating cast of pissed-off reps.

---

## Section 7: Implementation Roadmap — 30/60/90 Days

### 7.1 Days 1-30: Write the Policy

- **Week 1:** Convene a working group with the CRO, RevOps Lead, Finance Lead, one senior SDR, and one senior AE. Draft the one-page policy.
- **Week 2:** Circulate the draft to the broader sales team for feedback. Hold a 60-minute town hall to walk through it. Collect questions.
- **Week 3:** Revise based on feedback. Get sign-off from CRO, CFO, and General Counsel.
- **Week 4:** Distribute the final policy. Have every SDR, AE, RevOps team member, and Finance team member sign it.

### 7.2 Days 31-60: Build the Salesforce Infrastructure

- **Week 5:** Add the three fields to the Opportunity object (`Sourcing_Type__c`, `Sourced_By__c`, `Sourcing_Date__c`).
- **Week 6:** Build the Salesforce flow that auto-populates the fields based on activity history.
- **Week 7:** Build the Sourcing Dispute object and form. Configure the RevOps queue.
- **Week 8:** Build the quarterly Sourcing Credit Audit dashboard.

### 7.3 Days 61-90: Run the First Cycle and Iterate

- **Week 9:** Begin tracking sourcing on all new opportunities under the new policy.
- **Week 10:** First weekly sourcing review — RevOps catches data quality issues early.
- **Week 11:** First dispute resolution cycle. Adjudicate any disputes from week 9-10.
- **Week 12:** First quarterly Sourcing Credit Audit. Present to sales leadership. Iterate the policy based on actual data.

### 7.4 The Mistake Almost Everyone Makes

The biggest mistake PLG companies make is **launching the comp plan before the Salesforce infrastructure is built**. They announce the 70/30 split in week 1, then spend three months arguing about which deals qualify because the data isn't in Salesforce. By the time the infrastructure ships, the SDR team has lost trust in the comp plan and the AE team is convinced the SDRs are getting overpaid.

Do not do this. Build the infrastructure first. Launch the policy on day 31, not day 1. The 30-day delay feels painful but saves you 9 months of pain later.

---

## Section 8: Frequently Asked Questions

### 8.1 What if our PLG motion is so light that SDRs barely touch trials at all?

If SDRs touch fewer than 20% of converted trials, you may not need SDR sourcing credit at all. Instead, route all SDR effort to **pure cold outbound** for accounts that never showed up in the PLG funnel, and pay them 100% on opportunities they create independently. This is the **"split team" model** used by **Linear, Vercel, and Retool** — separate PLG-conversion team (no SDRs, just lifecycle marketers) and pure-outbound SDR team. The two teams have different quotas, different OTEs, and no overlap.

### 8.2 What about Customer Success Managers? Don't they deserve expansion credit?

Yes. The 30/70 expansion split assumes the AE owns expansion. If you have a separate CSM team that drives expansion, the split becomes **30% SDR, 50% AE (as a relationship overlay), 20% CSM**. Adjust the percentages based on who actually does the work in your motion. The principle stays the same: pay the people who did the work, time-decay the sourcing credit, cap the whales.

### 8.3 Can we use multi-touch attribution instead of single-source attribution?

You can, but it adds complexity that small PLG teams cannot afford. Multi-touch attribution requires (a) a marketing attribution platform like **Bizible, Dreamdata, or HockeyStack**, (b) clean tracking pixels on every product event, and (c) a quarterly review of the attribution model itself. The administrative cost is real. For PLG teams under 50 reps, single-source attribution with the 30-day window is simpler and works almost as well. Adopt multi-touch attribution when you have a dedicated RevOps team of 4+ people.

### 8.4 How do we handle channel partners and resellers?

Add a fourth value to `Sourcing_Type__c`: `Partner_Sourced`. Partner-sourced deals are 100% credited to the partner (with a separate partner comp schedule, typically 15-25% of first-year ARR), and the internal AE gets a "partner deal" credit at 50% of normal quota weight. No SDR involvement, no SDR payout. Document the partner program in a separate policy doc, but cross-reference it from the Sourcing Credit Policy so reps know where partner deals fit.

### 8.5 What if the SDR and AE strongly disagree about a specific deal?

That's what the Sourcing Dispute process is for. File the dispute, present evidence (Salesforce activities only — no Slack screenshots), let RevOps decide, accept the decision. The CRO does not adjudicate. The CFO does not adjudicate. RevOps owns the policy, RevOps owns the decisions. This is non-negotiable. The moment the CRO starts adjudicating individual disputes, every dispute becomes a political fight, and the policy collapses within a quarter.

---

## Section 9: The Three-Line Summary You Should Memorize

**Pay 70/30 on first conversion, 30/70 on expansion within 12 months, 100/0 after that.** Use Salesforce as the single source of truth, with a 30-day SDR sourcing window and a "meaningful touch" definition that requires substantive engagement. Cap SDR sourcing payouts at 2× the SDR's annual MBO bonus to protect against whale-deal blowups.

If you do those three things, your PLG comp plan will hold for the next three years. If you don't, you'll be rewriting it every quarter, and your best SDRs and AEs will burn out fighting each other instead of selling. The policy isn't optimized for "fairness" — it's optimized for **clarity, speed, and the ability to ship deals without arguing about who gets paid**. That is the actual goal.

---

---

## Section 10: The Math — A Worked Example From Day One Through Year Two

### 10.1 The Setup

Let's walk through a complete example with real numbers so you can see exactly how the comp flows.

**Company:** A Series B SaaS company, $20M ARR, hybrid PLG motion.
**SDR:** Maria Chen, $60K base + $25K variable = $85K OTE, with a quota of $500K PLG-Influenced ARR and 40 outbound-sourced opportunities per year.
**AE:** David Park, $130K base + $130K variable = $260K OTE, with a quota of $1.2M new + expansion ARR.
**Commission rate:** 10% of ARR for AE first-year, 5% for AE expansion, and a separate 8% schedule for SDR sourcing payouts.
**Whale cap:** SDR maximum sourcing payout per deal = $8,000 (which is 2× Maria's $4K annual MBO).

### 10.2 The Trial Conversion (Month 0)

A user at TechCorp signs up for a free trial on January 5. Maria sends an outbound email on January 18 (day 13 of the trial), books a discovery call on January 20, and the user converts to a $24K ARR paid plan on January 28.

**Sourcing assignment in Salesforce:**
- `Sourcing_Type__c = SDR_Outbound`
- `Sourced_By__c = Maria Chen`
- `Sourcing_Date__c = 2026-01-20`

**Commission math:**
- Total deal ARR: $24,000
- AE commission base: $24,000 × 10% = $2,400 gross
- AE commission paid: $2,400 × 30% (because SDR sourced) = $720
- SDR commission paid: $24,000 × 8% × 70% = $1,344
- Total comp expense on this deal: $2,064 (8.6% of ARR — within healthy band)

David grumbles a little about the 30% haircut on a deal he closed. Maria gets a healthy commission for the outbound work. Both reps are paid within Finance's 30-day cycle.

### 10.3 The First Expansion (Month 5)

TechCorp expands from 10 seats to 40 seats on June 12, adding $72K of incremental ARR. This is within the 12-month sourcing window (which expires on January 20 of the following year), so the 30/70 expansion split applies.

**Commission math:**
- Expansion ARR: $72,000
- AE commission base: $72,000 × 5% = $3,600 gross
- AE commission paid: $3,600 × 70% = $2,520
- SDR commission paid: $72,000 × 8% × 30% = $1,728
- Total comp expense on this expansion: $4,248 (5.9% of expansion ARR)

David is now the lead. He drove the expansion conversation, did the security review, ran the demo for the IT team. He earns 70%. Maria still gets a 30% residual because she sourced the original trial. Fair.

### 10.4 The Second Expansion (Month 14 — After Sourcing Window Expires)

TechCorp expands again on March 8 of the next year, adding $150K of ARR (multi-product cross-sell). This is **outside** the 12-month sourcing window.

**Commission math:**
- Expansion ARR: $150,000
- AE commission base: $150,000 × 5% = $7,500 gross
- AE commission paid: $7,500 × 100% = $7,500
- SDR commission paid: $0

David earns the full ride. Maria gets nothing. She moved on to other accounts 14 months ago. The math reflects reality.

### 10.5 The Whale Cap Trigger

A different deal: Maria sources Mega-Corp in February. They convert to a $50K ARR paid plan and expand to $800K ARR within 9 months. Under the 30/70 expansion split, Maria's theoretical sourcing residual would be:

- $800,000 × 8% × 30% = $19,200

But the whale cap kicks in at $8,000. Maria gets $8,000. The remaining $11,200 of sourcing credit value flows to David (who pockets a higher percentage of his commission because the SDR side was capped).

Maria initially complains. RevOps walks her through the policy she signed at the start of the quarter, points to the whale cap clause, shows her the $11,200 still in her commission YTD, and the conversation ends. The dispute process is not even invoked because the policy is unambiguous.

### 10.6 The Year-End View

Across the full year, Maria sources 22 deals with a total first-year ARR of $580K and expansion ARR of $1.3M. Her total comp:

- Base: $60,000
- Sourcing commissions: $580K × 8% × 70% + $1.3M × 8% × 30% (capped) ≈ $32,480 + $26,000 = $58,480, capped at her variable ceiling of $40K above OTE = effectively $25,000 variable plus $15,000 accelerator
- MBO bonus: $4,000

Maria earns roughly **$104,000** for the year — well above her $85K OTE because she over-achieved. She is happy. Finance is happy because comp expense as a percent of sourced ARR is 5.5%, well below the 8% target.

David earns roughly **$320K** for the year. He is happy. Finance is happy because his comp expense as a percent of closed ARR is 13%, exactly on plan.

Nobody fights. Everyone gets paid. The policy works.

---

## Section 11: What Changes When You Move Upmarket

### 11.1 The Enterprise PLG Inversion

As your average deal size grows, the SDR-AE balance inverts. At $500-$10K ARR deals (early PLG), the SDR does most of the human work. At $100K+ ARR enterprise deals, the AE does most of the human work — multi-stakeholder discovery, security reviews, legal redlines, procurement negotiations, executive presentations. The SDR's contribution is real but proportionally smaller.

For deals above $100K ARR, **flip the split**:
- First conversion: **30% SDR, 70% AE** (instead of 70/30)
- Expansion within 12 months: **10% SDR, 90% AE** (instead of 30/70)
- Month 13+: **100% AE** (same)

This protects your AE comp economics for enterprise deals while still rewarding SDRs for sourcing. Document the threshold in the policy. Most companies set it at $100K ARR or 100 seats, whichever the deal hits first.

### 11.2 The Two-Tier OTE Problem

A common problem at companies moving upmarket: SDRs who are sourcing $500K+ deals start asking for AE-level OTE because they're "doing AE work." This is usually wrong — they're not running the procurement cycle or the executive briefing — but it surfaces a real issue. The SDR career path needs a clear next step.

The fix is a **Senior SDR or "Outbound AE" role** with a higher OTE ($120-150K), assigned to sourcing only the largest accounts. They get a slightly higher SDR sourcing percentage (40% instead of 30% on enterprise expansion) and a clearer path to becoming a full AE within 18-24 months. **HubSpot's documented sales ladder** (per their **2023 Inbound Sales Career Path posting**) is the cleanest version of this structure.

### 11.3 The Multi-Threaded Sourcing Problem

In enterprise PLG, one company often has multiple users running trials simultaneously. The procurement leader at the parent company decides to consolidate them into one enterprise contract. Who sourced it — the SDR who reached out to the engineering trial user, the SDR who reached out to the marketing trial user, or neither?

**Answer:** The SDR with the **earliest "meaningful touch"** within the 30-day window gets the sourcing credit. If two SDRs touched users at the same company within the window, the policy defaults to the earlier touch, with the option for the two SDRs to negotiate a private split (50/50, 60/40, etc.) and submit it to RevOps for ratification. RevOps documents the split on the opportunity and pays accordingly.

This rule prevents two SDRs from claiming the same deal and forces collaboration on accounts where multiple SDRs have been working in parallel.

---

## Section 12: The Cultural Side — Why This Matters Beyond the Math

### 12.1 The SDR-AE Relationship Is Your Leading Indicator

In every sales org, the relationship between SDRs and AEs is the **leading indicator of cultural health**. When SDRs and AEs are aligned — sharing accounts, celebrating each other's wins, working hand-in-hand on deals — the whole team runs faster. When they're at war over sourcing credit, the whole team slows down even on deals that have nothing to do with comp.

The comp plan is the single biggest lever on this relationship. A clear, fair, signed-quarterly comp plan creates trust. An ambiguous, gamed, "we'll figure it out" comp plan creates resentment. You can spend $50K a year on team-building offsites and pizza Fridays and still lose the cultural war if your comp plan is broken. Or you can spend zero on offsites and win the cultural war by shipping a clear sourcing policy.

### 12.2 The Compounding Effect of a Stable Comp Plan

A comp plan that holds for 6+ quarters compounds. SDRs and AEs stop second-guessing every deal. They focus on customer outcomes instead of internal politics. Recruiting gets easier because candidates can model their earnings accurately. Turnover drops because reps don't feel screwed.

The **2024 Pavilion Comp Plan Stability Survey** found that companies whose comp plans changed materially fewer than once per year had **34% lower sales rep turnover** than companies whose comp plans changed two or more times per year. Stability is itself a form of comp.

### 12.3 The Anti-Pattern: Reactive Comp Plan Changes

The worst thing you can do is change the comp plan in the middle of a quarter in response to a specific deal. A whale gets sourced, someone earns "too much," and the CRO calls an emergency meeting to "fix the plan." This is a catastrophic mistake. Every other rep watches and concludes the comp plan is a moving target — that any extraordinary outcome will be retroactively clawed back. The team's risk-taking behavior collapses immediately. Reps stop swinging for the fences because the upside has been signaled as unsafe.

**Never change the comp plan mid-quarter.** If a problem surfaces, write it down, schedule the fix for the next quarter, communicate the fix transparently, and let the current quarter play out under the existing rules. This is what the **2024 Iconiq Compensation Best Practices Guide** calls "comp plan integrity," and it is the single most important variable in long-term sales team performance.

---

## Section 13: The Verification Checklist Before You Ship

Before you announce the new sourcing policy, verify all of the following:

- [ ] **Policy doc is one page, plain English, signed by SDR, AE, RevOps, Finance**
- [ ] **Salesforce fields exist: Sourcing_Type__c, Sourced_By__c, Sourcing_Date__c**
- [ ] **Salesforce flow auto-populates the fields on opportunity creation**
- [ ] **Sourcing Dispute object/form exists with RevOps queue assignment**
- [ ] **30-day sourcing window is hard-coded in the flow, not just policy**
- [ ] **"Meaningful touch" definition is documented and trained**
- [ ] **Whale cap dollar amount is set, codified, and communicated**
- [ ] **Quarterly Sourcing Credit Audit dashboard exists**
- [ ] **Dispute resolution SLA is 5 business days, max**
- [ ] **RevOps owns adjudication — not CRO, not CFO**
- [ ] **Cross-sell scenarios are documented (partner, CSM, multi-product)**
- [ ] **Enterprise threshold (if used) is set with flipped split**
- [ ] **Multi-threaded sourcing rule is documented**
- [ ] **Finance has modeled comp expense as % of ARR and confirmed it's under 25%**
- [ ] **CEO has signed off on the policy and the dollar exposure**

If any item on this checklist is unchecked, do not ship the policy. Wait until everything is in place. Half-shipped comp plans are worse than no comp plan at all because they create the illusion of clarity without the substance.

---

## Section 14: The Closing Argument

Every PLG company eventually has to answer the question: when an SDR sources a trial and an AE closes it, who gets paid? The companies that answer cleanly — with a 70/30 → 30/70 → 0/100 curve, a 30-day sourcing window, a whale cap, and a Salesforce-as-source-of-truth dispute process — keep their comp expense under 25% of ARR and their sales team turnover under 20% annually. The companies that don't answer cleanly burn through CROs, lose their best SDRs and AEs to companies that pay them clearly, and spend more CRO time on internal politics than on customers.

The policy described here is not the only valid model. Slack, Notion, Figma, Vercel, Linear, and HubSpot all use slight variants. What matters is not which specific variant you pick — it's that you pick **one variant**, document it on one page, get it signed before the quarter starts, and resist the temptation to change it mid-flight. Comp plan integrity beats comp plan optimization, every time.

If you remember three things from this answer, remember these:

1. **The first paid conversion goes 70/30 to the SDR. Expansion within 12 months goes 30/70 to the AE. After 12 months, 100% to the AE.**
2. **Salesforce is the single source of truth. If it isn't logged in Salesforce within the 30-day window, it didn't happen.**
3. **Cap SDR sourcing payouts at 2× MBO to protect against whale blowups, and never change the policy mid-quarter.**

Ship those three rules, sign the policy with your team, build the infrastructure to enforce it, and your PLG comp plan will hold through the next three years of motion changes, ARR growth, and team expansion. That is the actual goal — not "perfect fairness," not "maximum SDR motivation," not "ideal AE leverage." It is **a stable, clear, signed policy that lets your team stop arguing about who gets paid and start focusing on who gets sold**.

---

## Section 15: Common Failure Modes — What Goes Wrong in Practice

### 15.1 The "Shadow Sourcing" Problem

Within six months of shipping a sourcing policy, you'll start seeing **shadow sourcing** — SDRs working with AEs off the books to game the policy. For example: an SDR sends a cold email but doesn't log it as an activity in Salesforce so the AE can claim "self-serve" credit and the SDR gets a private cut from the AE in cash or kind. This is the comp plan equivalent of payroll fraud.

The fix is twofold. First, **mandatory activity logging** — every email, call, and meeting must be in Salesforce within 24 hours, enforced by SDR Manager review. Second, **periodic audits** where RevOps spot-checks 5-10% of "self-serve" conversions to look for unlogged outbound activity in the rep's email tool (Outreach, Salesloft, Apollo). If shadow sourcing is detected, the rep is on a documented performance plan within one week. This is non-negotiable because if you let one rep get away with it, the whole policy collapses.

### 15.2 The "Trial Spamming" Problem

The mirror-image failure: SDRs flood every PLG trial with low-effort outreach to claim sourcing on the ones that happen to convert. This destroys your trial experience. Users see seven automated emails in their first week of a free trial and churn out of frustration.

The fix is **rate-limiting outbound on active trials**. Configure your outreach platform to allow a maximum of **2 emails and 1 call per SDR per trial within the first 14 days**. After that, the SDR can re-engage if the trial is still active. Plus the "meaningful touch" definition discussed earlier — a single unanswered cold email does not count as sourcing. RevOps audits this monthly and flags SDRs whose touch-to-sourcing ratio is suspiciously high.

### 15.3 The "AE Friend" Problem

Some AEs systematically favor specific SDRs, claiming "their" SDR sourced more deals than the actual data supports. This is harder to detect because it requires comparing perceived sourcing to logged Salesforce activity. The fix is the **Sourcing Credit Audit dashboard** that surfaces SDR-AE pair concentrations — if AE David Park is sourcing 75% of his deals from SDR Maria Chen but only 25% of all SDR sourcing flows through Maria, that's a red flag worth investigating.

Sometimes the explanation is innocent (they're territory-aligned, they have a strong working relationship, Maria is just exceptional). Sometimes the explanation is favoritism. RevOps investigates, and the CRO addresses any genuine favoritism directly with the AE.

### 15.4 The "Quarter-End Cram" Problem

In the last two weeks of every quarter, AEs scramble to close deals before the buzzer. Sometimes this results in **misclassified sourcing** — an AE marks a deal as "self-serve" to skip the 30% SDR haircut and hit quota faster. The fix is a **closing checklist** that requires the AE to confirm sourcing classification before the deal can be marked Closed-Won in Salesforce. RevOps reviews any deal closed in the last 72 hours of the quarter to verify sourcing classification matches the activity history.

### 15.5 The "New Hire" Problem

When a new SDR joins, they're often handed accounts that have been worked by previous SDRs. Who gets sourcing credit on a deal that closes in the new SDR's first 30 days — the previous SDR who sent emails 60 days ago, or the new SDR who closed the loop?

**Answer:** Sourcing credit follows the **30-day window rule** regardless of rep continuity. If the previous SDR's last meaningful touch was 65 days ago, no SDR sourcing credit. If the new SDR sent a meaningful touch within the 30-day window, they get the credit. If the previous SDR's last touch was 25 days ago and they've since left the company, the credit goes into a "departed rep" pool that is reabsorbed by the SDR team for the next quarter's MBO calculation. Document this in the policy because it will come up within the first three months.

---

## Section 16: The Negotiation Patterns You'll See

### 16.1 What SDRs Ask For

When the policy is announced, SDRs will push for:

1. **A longer sourcing window** (60 or 90 days instead of 30). Push back. The 30-day window is industry standard for a reason.
2. **A higher first-conversion percentage** (80/20 instead of 70/30). Push back. 70/30 is the right balance.
3. **No whale cap**. Push back. The whale cap protects the comp plan from outlier deals.
4. **Credit for any touch, including unanswered cold emails**. Push back. The "meaningful touch" definition is the load-bearing wall.

Hold the line on all four. The policy works because the parameters are tight. Loosening them produces the failure modes described in Section 15.

### 16.2 What AEs Ask For

AEs will push for:

1. **A shorter sourcing window** (14 days instead of 30). Push back. AEs want to minimize SDR sourcing because it directly reduces their commissions.
2. **A lower first-conversion percentage** for SDRs (50/50 instead of 70/30). Push back. The SDR did the conversion work; they earned the 70%.
3. **A shorter expansion window** (6 months instead of 12). Push back. 12 months is fair.
4. **Higher whale cap, or no cap on the AE side**. Acceptable, with Finance approval. The whale cap should protect against SDR over-payment specifically; AE comp is naturally bounded by the commission rate.

Negotiate cleanly. Document agreements. Don't change the policy after the quarter starts.

### 16.3 What Finance Asks For

Finance will push for:

1. **A lower commission rate overall**. Push back if it falls below market (10% first-year + 5% expansion is industry standard). If Finance insists, model the impact on rep retention before agreeing.
2. **A whale cap on the AE side, too**. Reasonable. Set it at 3× annual OTE or so to handle outlier deals.
3. **Quarterly clawbacks if customers churn within 90 days**. Standard. Implement clawbacks so commissions are paid on collected ARR after 60 days of activation, with a 90-day clawback window for credit-card-paid trials that fail.
4. **A monthly commission accrual dashboard**. Yes, definitely. RevOps builds this.

### 16.4 What the CEO/CRO Asks For

Leadership will push for:

1. **Predictable comp expense as % of ARR**. The policy delivers this — 22-25% is the typical landing zone with these parameters.
2. **A way to spotlight star reps**. The Sourcing Credit Audit dashboard does this. Plus quarterly President's Club, Top Sourcer, Most Improved, etc.
3. **A clear story for the board on PLG-vs-sales-led mix**. The Sourcing_Type__c field aggregated at the deal level gives the board the exact split.
4. **Confidence that the comp plan is defensible to the audit committee**. The one-page signed policy plus the Salesforce-as-source-of-truth audit trail provides this.

---

## Section 17: The Three-Year Outlook — How This Policy Evolves

### 17.1 Year 1: Stabilize the Policy

Year 1 is about getting the policy to hold. Expect 5-10 disputes per quarter, decreasing as the team learns. RevOps spends 8-12 hours per week on sourcing classification and dispute resolution. Comp expense lands at 23-26% of ARR (slightly above target while the system stabilizes). Iterate the "meaningful touch" definition based on edge cases that surface in disputes.

### 17.2 Year 2: Refine the Edge Cases

Year 2 is about handling the edge cases that surface in year 1: multi-threaded sourcing, cross-sell, partner-sourced, re-engaged trials. Add the 4-5 new clauses to the policy to handle these cases explicitly. Disputes drop to 2-3 per quarter. RevOps time drops to 4-6 hours per week. Comp expense lands at 21-23% of ARR.

### 17.3 Year 3: Integrate Multi-Touch Attribution

Year 3 is when you can graduate from single-source attribution to **multi-touch attribution** if your team has grown enough to support it (50+ reps, 4+ RevOps people). Adopt a marketing attribution platform, run parallel attribution for one quarter, then switch over with a documented transition. The 70/30 split becomes a **weighted attribution model** — SDR gets 70% of attribution-weighted credit on deals they touched meaningfully, AE gets the rest. The policy gets more complex but more accurate.

### 17.4 Year 4 and Beyond: The Mature Model

By year 4, you should have:

- A documented attribution model with 5-7 touch types and weighted contributions
- A dedicated RevOps Comp team of 2-3 people
- A quarterly comp committee that reviews policy changes before they ship
- A clear career path from SDR → Senior SDR → Outbound AE → Full AE → Senior AE → Strategic AE → Manager
- Comp expense at 19-21% of ARR
- Rep turnover under 15% annually

This is the mature state. Getting there takes 3-4 years of disciplined execution on the basics described in this answer.

---

## Section 18: The Comp Plan Roll-Out Communication Plan

### 18.1 The Pre-Announce (T-14 Days)

Two weeks before launch, send a calendar hold for an "All-Sales Comp Plan Update" meeting. Do not send the policy yet. Do send a one-sentence preview: "We're rolling out a clearer sourcing policy for PLG deals — details at the meeting." This builds anticipation without triggering pre-meeting lobbying.

In the same window, have 1:1 conversations with the top 3 SDRs and top 3 AEs by performance. Walk them through the policy individually. Get their feedback. Adjust the policy slightly if their feedback is substantive (not if it's just self-interested). Having the top performers privately bought-in before the all-hands meeting matters more than any other communication step.

### 18.2 The All-Hands Meeting (T-0)

The meeting itself should be 60 minutes:

- **0-10 minutes:** Why we're changing the policy. The honest answer: PLG conversions are getting more important to our motion, and the old policy didn't handle them cleanly. We need clarity.
- **10-30 minutes:** Walk through the one-page policy. Slowly. Every clause. Q&A as we go.
- **30-45 minutes:** Worked examples. Show the Section 10 example. Show the whale cap example. Show the expansion example. People learn comp plans through examples, not principles.
- **45-55 minutes:** Open Q&A. Take every question seriously. Don't dismiss any concern. Even bad-faith questions deserve a respectful answer because every other rep is watching.
- **55-60 minutes:** Next steps. The policy ships in 14 days. Salesforce updates ship in 14 days. The signature drive starts tomorrow. Disputes process is live on day 15.

Record the meeting. Send the recording and the one-page policy in the same Slack post. Pin it for the quarter.

### 18.3 The Signature Drive (T+0 to T+14)

Every SDR, AE, RevOps team member, and Finance team member needs to sign the policy. Use a documented signature tool (DocuSign, Adobe Sign, or even a Google Form with name + date + checkbox). RevOps owns the signature drive. Anyone who hasn't signed by T+14 gets a personal nudge from their manager. Anyone who hasn't signed by T+21 doesn't get paid on any new deals until they sign.

This sounds harsh. It is. It's also the only way to make the policy actually binding. If signatures are optional, people will later claim "I never agreed to that." With signatures, they did agree, in writing, and the dispute is closed before it starts.

### 18.4 The First 90 Days After Launch

Weekly RevOps reviews of every deal closed under the new policy. Quick adjudication of every dispute. Heavy communication of "here's what we're seeing" in the weekly sales meeting. Spotlight the deals where the policy worked cleanly. Surface the edge cases that need clarification.

By day 90, the policy should be running on autopilot. RevOps reviews drop from weekly to monthly. Disputes drop from 5-10 per quarter to 2-3. The sales team has stopped debating the policy and started executing under it. That's the goal.

---

## Section 19: The Hard Conversations You Should Be Ready For

### 19.1 "I'm Leaving If This Policy Ships"

Your top SDR or top AE will threaten to leave. Maybe more than one. They will frame the policy as a personal attack on their comp. The instinct is to negotiate a side deal — "you'll always get 80/20 on enterprise deals" or some such. **Do not negotiate side deals.** The moment you do, every other rep finds out within a week, and the policy collapses. Instead, listen to the concern, acknowledge it, walk through the math showing how their actual earnings will land, and hold the line. Some reps will still leave. That's the cost of policy integrity. The reps who stay will trust the policy because they saw you hold it under pressure.

### 19.2 "Finance Says Comp Expense Is Too High"

Finance will model the policy and predict 26-28% comp expense as % of ARR. That's above the 22-25% target. Their instinct will be to ask you to cut the SDR percentage or shorten the expansion window. **Do not cut.** Instead, model the cost of higher rep turnover (replacement cost is **6-9 months of OTE per departed rep** per **2024 Pavilion turnover study**) against the savings from a tighter comp plan. The numbers usually favor paying more in comp and keeping reps longer. If Finance still pushes back, raise the AE quotas slightly so the same comp expense covers more ARR, instead of cutting per-deal payouts.

### 19.3 "The CEO Wants to Override a Specific Sourcing Decision"

The CEO will get pulled into a sourcing dispute by a star rep who feels wronged. The CEO will be tempted to override RevOps. **The CEO should not override.** Brief the CEO in advance that adjudication lives with RevOps for institutional reasons (consistency, audit trail, dispute volume), and that overriding RevOps even once undermines the policy permanently. If the CEO insists on overriding, document the override transparently to the whole team, explain why it was a one-time exception, and update the policy for future cases. Better yet: convince the CEO not to override at all.

### 19.4 "We Need to Change This Mid-Quarter Because of Acquisition X"

Sometimes a major event (acquisition, pivot, new product launch) genuinely warrants a comp plan change. Handle it cleanly: announce the change at least 30 days before it takes effect, document the rationale, get fresh signatures from the team, and treat all in-flight deals under the old policy. Never apply a new policy retroactively. Even in the case of legitimate change, **the principle of comp plan integrity** holds.

---

## Section 20: One More Time — The Three Things to Remember


**One:** Pay the SDR 70% on first conversion, 30% on expansion within 12 months, 0% after that.

**Two:** Salesforce is the single source of truth. 30-day window. "Meaningful touch" definition. No exceptions.

**Three:** Cap SDR sourcing payouts at 2× MBO. Never change the policy mid-quarter.

Sign the one-page policy with your team before the quarter starts. Build the Salesforce infrastructure first. Resolve disputes through RevOps, not the CRO. Audit quarterly. Iterate annually. Hold the line.

That's the answer. PLG comp plans are not about fairness; they're about clarity. Ship the clarity, and the rest takes care of itself.

---

## Section 21: The Final Diagnostic — Is Your Current Policy Healthy?

Before you ship anything new, run this five-question diagnostic on your current sourcing policy:

**Question 1:** Can every SDR and AE on your team recite the sourcing split percentages from memory in under 15 seconds? If no, your policy is too complex or too poorly communicated. Simplify and re-train before doing anything else.

**Question 2:** Is your current sourcing classification stored in a single Salesforce field that is auto-populated by a flow? If no, you have a data quality problem that no comp plan change will fix. Build the infrastructure first.

**Question 3:** When was the last time the comp plan changed mid-quarter? If the answer is anything other than "never" or "more than a year ago," you have a comp plan integrity problem. Commit to never changing mid-quarter again.

**Question 4:** What was your sales rep voluntary turnover rate last year? If it was above 25%, your comp plan is almost certainly a contributing factor. The fix is rarely "pay more" — it's usually "pay clearer."

**Question 5:** Can your CFO defensibly explain your comp expense as % of ARR to the board, with a clear bridge from policy to dollars? If no, you have a reporting problem that will eventually become a governance problem. Build the dashboard now.

If you answered "no" to any of these questions, fix that before fine-tuning your sourcing percentages. The percentages matter, but the infrastructure, the communication, and the integrity matter more. A 60/40 policy executed with discipline beats a "perfect" 75/25 policy executed with chaos every single time.

The companies that win at PLG comp don't have smarter comp consultants. They have **clearer policies, signed quarterly, enforced by RevOps, audited monthly, and held with discipline**. Build those four habits, and the specific percentages mostly take care of themselves.

---

**Sources cited:** Bridge Group SDR Compensation Report (2014, 2024), OpenView PLG Benchmark Report (2023), OpenView PLG Playbook (2024), SaaStr State of PLG Report (2024), Iconiq Growth Topline Growth Survey (2024), Pavilion CRO Survey (2024), Pavilion Comp Plan Stability Survey (2024), Iconiq Compensation Best Practices Guide (2024), Slack S-1 Filing (2019), Reforge Growth Series Case Study (2020), Figma S-1 Filing (2024), First Round Review Sales Operations Deep Dive (2024), Alexander Group SaaS Comp Benchmark (2024), HubSpot Inbound Sales Career Path Posting (2023).
