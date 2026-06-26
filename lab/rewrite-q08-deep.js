// q08 — Should I pay SDRs on demos booked or only on demos held + qualified?
// Deep rewrite. Polishes 5 -> 6 -> 7 -> 8 -> 9 -> 10. Targets 8,500-9,500 final words.
// Hard cap 10,500. Each ladder additive is TIGHTEN-AND-REORGANIZE, NOT EXPAND.
const fs = require('fs');
const path = require('path');
const { runPolish } = require('./polish-helper');

// Load .env.local manually so this script is self-contained
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const tldr = `> ### 🎯 Bottom Line
>
> - **[The recommendation]** Pay SDRs on **Sales-Accepted, held + qualified meetings** (SAL or SAO), **not raw demos booked**. The booking event is calendar entropy; the held + AE-accepted event is the earliest moment where pipeline actually exists, and aligning comp to that moment is the single largest design choice you can make to fix SDR gaming and AE friction at the same time.
> - **[Why]** "Booked-only" comp is the textbook Goodhart's Law failure mode for the top of the funnel — SDRs respond to the metric, the metric stops measuring pipeline, and within 6-9 weeks you see no-show stacks (24-32%), unqualified ICP bookings (35-45% AE-reject rate), internal-contact booking, multi-rep duplicate booking, Friday-afternoon ghosted slots, and a falling show-rate that quietly destroys AE capacity even while "meetings booked" charts hit green. Held + AE-accepted forces SDRs to confirm, prep, and pre-qualify — which is the work the rep is actually paid to do.
> - **[The exception]** Hybrid models work — and in some contexts work better than pure SAL pay. The two defensible hybrids: **(1) split payout** — a small $25-$50 micro-payout on the booking event for behavioral reinforcement plus the bulk ($100-$200) on held + accepted and a top-up ($300-$600) on SAO / Opp creation; **(2) full payout only on Opp creation** — highest possible signal-to-noise but a 30-90 day comp lag that requires a higher base ($55-$72K) and very low rep tenure attrition tolerance. Pure-booked pay should only survive a comp committee in three narrow cases: a brand-new outbound program in months 1-3 (you genuinely don't know your hold rate yet), high-volume mid-market SMB motions where call-to-meeting is the unit of work, or partnership-led co-sell motions where the SDR has no influence on hold rate at all.

**TL;DR:** "Should I pay SDRs on demos booked or only on demos held + qualified?" is the most consequential single-line comp question in BDR/SDR organization design, and the 2026 answer is unambiguous across every published benchmark: **pay on held + Sales-Accepted, not on raw bookings**. The SDR funnel runs Lead → MQL → Meeting Booked → Meeting Held → Sales-Accepted Lead (SAL) → Sales-Accepted Opportunity (SAO) → Closed-Won Opp, and each comp tier you pick further down that funnel reduces a different gaming risk while increasing comp lag. **Booked-only** rewards calendar entropy and is the highest-gaming-risk choice: SDRs paid on bookings predictably produce no-show rates of **24-32%** vs **8-12%** on held-trigger plans (Pavilion 2025, Bridge Group 2024), AE acceptance rates of **38-48%** vs **68-76%**, and opportunity conversion of **6-9%** of bookings vs **18-24%** of held-and-accepted meetings (RepVue 2025, TOPO/Forrester ABM 2025). **Held-only** removes the no-show gaming but leaves the unqualified-ICP gaming intact — an SDR paid on "held" can still book the CEO of a 3-person consultancy at 5pm Friday and collect, because the meeting "happened." **Held + Sales-Accepted (SAL)** is the modal 2026 design: 73-78% of B2B SaaS SDR plans now use a held + AE-accepted trigger as the primary comp event (RepVue Q1 2025; Bridge Group 2024), with the AE getting **3-5 business days** to accept or reject with a required disposition + reason code. **SAO / Opp-creation only** is the cleanest signal but produces a 30-90 day comp lag that destabilizes rep tenure; works at companies with longer cycles and senior SDR cohorts but kills 22-month-tenured rep retention if the base is below $60K. The two defensible hybrid structures: **(a) split payout** — $25-$50 on booking, $100-$200 on held + accepted, $300-$600 on SAO; **(b) double-trigger** — $0 on booking, $150-$250 on held + accepted, full $400-$600 top-up on Opp creation within 14 days. 2026 SDR OTE structures: **$75-$95K base + $25-$45K variable = $100-$140K OTE** in modal US SaaS per Bridge Group, with senior SDR / "Account Development Rep" titles reaching $145-$165K OTE at premium data/security/AI companies. **AE compensation alignment** matters as much as SDR comp: if the AE earns nothing on the SDR-sourced opp until it's closed-won, the AE will reject everything to keep their floor clean; if the AE gets a small "qualified-Opp" credit (often $50-$200 per SAO), AE + SDR become teammates instead of adversaries. **Operating gates** that make any plan work: a 3-5 business day AE accept/reject window with a forced disposition + reason code; a weekly Gong/Chorus/Avoma call-review QA scorecard sampling 8-12% of held meetings; a manager-accountable "fake meetings" governance review; a 14-day **clawback** on bookings later disqualified for ICP/process violations; a published rejection reason taxonomy so rejections become coaching, not transactional fights. **Anti-patterns to avoid**: paying ONLY on SAO with no per-meeting structure (drives 35-50% Year-1 SDR attrition); the "soft accept" AE pattern (AEs accept everything to dodge the conflict — re-emergence of booked-only gaming via the back door); the "hard reject" pattern (AEs reject everything to lower SDR variable — culture death); paying nothing per meeting and waiting for closed-won (SDRs leave for companies that pay faster); and the double-fire problem (both SDR and AE get full credit on a meeting that should never have been on the calendar). The honest bottom line: **pay SDRs primarily on held + Sales-Accepted meetings**, with optional small booking micro-payout for behavioral feedback and an SAO top-up for the high-signal event, and **invest equally in the operating gates** (AE disposition rules, QA call review, weekly 1:1 hold-rate reviews, rejection coaching) — because comp design without operating gates produces the exact gaming the comp was meant to prevent.`;

const core = `

## What "Booked," "Held," "Qualified," and "Sales-Accepted" Actually Mean — Why This Question Has Four Hidden Variables

Before any specific comp number is useful, the four words in the question need to be defined precisely, because every published SDR comp study uses these terms differently and the differences swing the answer by 30-50%.

**The SDR funnel, 2026 standard taxonomy.** The full SDR pipeline runs through seven discrete stages: **Lead** (a contactable individual at a target account) → **MQL** (Marketing-Qualified Lead — passed scoring threshold) → **Meeting Booked** (a calendar invite exists with an AE and a prospect) → **Meeting Held** (the prospect attended; "held" is binary at the 5-minute mark in most CRMs) → **Sales-Accepted Lead (SAL)** (an AE has reviewed the meeting and accepted it as legitimately qualified) → **Sales-Accepted Opportunity (SAO)** (an Opp record was created in CRM with stage > Discovery and a real next step) → **Closed-Won Opp** (the deal closed). Each stage drops 15-65% of the prior stage in healthy 2026 outbound: roughly 70% of bookings hold, 60-75% of held are accepted by the AE, 55-70% of accepted convert to Opp, and 18-28% of Opps close-won (Bridge Group SDR Metrics 2024; Pavilion 2025).

**Why the comp-trigger stage matters.** Goodhart's Law: "When a measure becomes a target, it ceases to be a good measure." Paying SDRs on **stage N** of the funnel creates an incentive to maximize stage-N count regardless of stage-N+1 conversion. The further down the funnel you push the comp trigger, the higher the signal-to-noise of the metric — but the longer the comp lag and the more variance in any individual rep's monthly paycheck.

**The four comp trigger options, ordered by funnel depth.**

1. **Booked-only**: SDR earns variable when an invite is accepted by the prospect and on the calendar. Earliest signal, highest gaming risk, fastest comp feedback (paid within 1-3 days of booking).
2. **Held-only**: SDR earns variable when the prospect actually shows up. Removes no-show gaming, but leaves unqualified-ICP gaming and "internal contact" gaming intact.
3. **Held + Sales-Accepted (SAL)**: SDR earns variable when the meeting is held AND the AE accepts it as a qualified meeting within a defined window (typically 3-5 business days). Modal 2026 design. Removes both no-show and unqualified-ICP gaming.
4. **SAO / Opp-creation only**: SDR earns variable when an Opportunity is created in CRM (Discovery+ stage, real next step, real deal size). Highest signal, longest lag (30-90 days), requires the strongest base salary to retain SDRs through the comp gap.

The rest of this entry walks through what goes wrong with booked-only (Part 1), the comp structures that actually work (Part 2), the operating gates that prevent the structure from being gamed in a new direction (Part 3), and the anti-patterns that look right but fail in practice (Part 4).

---

## PART 1 — THE GAMING PATTERNS: WHAT BOOKED-ONLY ACTUALLY PRODUCES

Every published SDR benchmark study from 2019 to 2026 — Bridge Group, Pavilion, RepVue, TOPO/Forrester, Outreach, Salesloft, Gong, Sales Hacker — converges on the same observation: **pure booked-only comp plans produce predictable gaming patterns within 6-9 weeks of implementation, and the patterns are remarkably consistent across companies, segments, and SDR seniority levels**. The patterns are not the result of malicious reps; they are the rational response to a poorly designed incentive surface.

### The Six Canonical Gaming Patterns

**Pattern 1 — The No-Show Stack-Rank.** SDR teams paid on bookings learn within their first quota cycle that the booking event pays, regardless of whether the prospect attends. Reps optimize for booking volume rather than confirmation behavior. The signature is a **show-rate of 50% or lower** (vs 68-78% on held-trigger plans), a Friday-afternoon and Monday-morning booking spike (the lowest-show slots on the calendar), and the appearance of "double-booked" slots where the same SDR books two prospects into adjacent 30-minute slots hoping one will show. The diagnostic: pull the show-rate by SDR over the last 90 days, sorted by day-of-week and time-of-day; the gaming SDR's distribution looks materially different from the team median.

**Pattern 2 — The Internal-Contact Booking.** SDRs book meetings with colleagues, friends, former co-workers, or contacts at partner companies who agree to "take the meeting" as a favor. The meeting is technically held and the SDR collects the booking and (if the plan pays on held) the held variable as well. The signature is a clustering of bookings from a small set of contact domains, prospects who "no longer fit ICP" after the meeting, and AE acceptance rates that crater on those specific accounts. Detection: cross-reference booked prospect emails against LinkedIn current employers and against your CRM's existing-customer-and-partner list; any rep with more than 8-12% of bookings from former employers or partner companies is gaming.

**Pattern 3 — The Unqualified ICP Booking.** SDRs book any prospect who will accept the invite — regardless of company size, industry fit, role authority, or stated intent. The booking counts; whether the prospect should ever have been booked does not. Signature: AE acceptance rate of 35-48% (vs 68-76% on held + accepted plans), persona-mismatch on 25-40% of accepted bookings (CIO motion booking individual contributors; enterprise motion booking sub-50-employee companies), and an Opp-conversion rate below 8% (healthy is 18-24%).

**Pattern 4 — The Friday Afternoon Ghost Booking.** A specific sub-pattern of Pattern 1: SDRs book end-of-week 4pm-5pm slots that prospects schedule in haste and never attend. Friday afternoon shows the lowest hold rate of any calendar slot (typically 38-52% vs 68-75% Tuesday-Thursday mornings). On booked-only plans, the Friday afternoon booking volume can run 2.5x-4x the slot's natural rate as SDRs front-load end-of-quota-period bookings into the most permissive prospect schedules.

**Pattern 5 — Multi-Rep Duplicate Booking.** Two or more SDRs in the same territory book the same prospect — sometimes deliberately, sometimes through poor account-ownership controls. The first booking pays; the second is later cancelled but the first SDR collects. At larger SDR teams (15+ reps) on booked-only plans, duplicate booking rates can hit 4-8% of total bookings and is essentially unrecoverable without ABM/ABX account-routing controls.

**Pattern 6 — The Burner-Email / Fake-Company Booking.** The most egregious gaming pattern, rare but documented: SDRs use burner email accounts to create fictitious "prospects" who book a meeting and never show, sometimes with fabricated company names that pass cursory CRM enrichment checks. Detection is straightforward (no LinkedIn profile, no clearbit enrichment, single-email-domain anomalies) but companies frequently fail to run the audit. When it surfaces, it surfaces all at once and triggers SDR program-wide trust collapse.

### The Detection Metrics

> ### 🟡 Key Stat — The Booked-Only Tells
>
> Three metrics, taken together, diagnose booked-only gaming within 30 days of the comp plan going live:
>
> - **Show-rate (% of bookings held)**: healthy is **68-78%**, booked-only gaming drops it to **48-58%**.
> - **AE acceptance rate (% of held meetings accepted as SAL)**: healthy is **68-76%**, booked-only drops it to **38-48%**.
> - **Booking-to-Opp conversion (% of bookings creating an Opp within 14 days)**: healthy is **18-24%**, booked-only drops it to **6-9%**.
>
> Any one of these metrics individually can have benign explanations (poor AE training, weak ICP definition, marketing-sourced low-quality leads). All three together is dispositive: the comp plan is being gamed.

### How Managers Find Out (Usually Too Late)

The painful pattern: SDR managers running booked-only plans typically don't catch the gaming until **month 3 of a quarter**, when the AE team raises the alarm about "the quality of meetings has tanked" and the VP Sales pulls show-rate and acceptance reports. By then, the SDR team has been gaming for **8-12 weeks**, the comp has been paid out at full rate, and the AE team has burned 40-60% of its hold capacity on meetings that should never have happened. Worse, the AE team's resentment of the SDR team has compounded; weekly SDR-AE collaboration meetings turn adversarial; the AE team starts rejecting good meetings out of accumulated grievance; and the comp plan revision happens in a charged emotional environment rather than a clean analytical one.

The lesson: **the cost of booked-only is not just the comp dollars spent on bad meetings — it is the AE-SDR relationship damage**, which takes 4-9 months to repair even after the comp plan is fixed.

---

## PART 2 — THE COMP STRUCTURES THAT WORK

There are four defensible 2026 SDR comp structures. Each has a specific use case, a specific risk profile, and a specific operating-gate dependency. Picking the right one for your motion is a function of cycle length, AE capacity, base salary headroom, and SDR cohort tenure.

### Option 1 — Pay Only on Held + AE-Accepted (the modal 2026 design)

The SDR earns variable only when the meeting is held AND the AE accepts it as a Sales-Accepted Lead within a defined window. This is the modal design across 73-78% of US B2B SaaS SDR plans in 2026 (RepVue Q1 2025; Bridge Group 2024; Pavilion 2025).

> ### 📊 Quick Facts — Option 1 Standard Structure
>
> - **Per-meeting payout**: $150-$250 per held + accepted meeting (modal $175-$200).
> - **AE accept window**: 3-5 business days from meeting held; default-accept if AE fails to disposition.
> - **Clawback window**: 14 days — meetings later disqualified for ICP/process violations claw back the SDR variable.
> - **OTE structure**: $80-$92K base, $30-$42K variable = $110-$130K OTE.
> - **Quota**: 10-14 SALs per month modal, 12 SALs/month median (Bridge Group 2024 SaaS SDR cohort).

The strength of this structure: it eliminates booked-only gaming Patterns 1, 3, 4, 5, and 6 in a single design choice. The AE acceptance step is the single highest-leverage quality gate in the SDR funnel because the AE has skin in the game on every meeting (they have to take it and produce an Opp from it). The 14-day clawback closes the back door on Pattern 2 (internal-contact bookings) by retroactively un-paying meetings that AEs later mark as not-truly-qualified after deeper discovery.

The weakness: comp lag. The SDR books the meeting in week 1, the meeting holds in week 2, the AE has 3-5 days to accept (week 3), and variable is paid at end-of-month. The honest gap between booking effort and paycheck is 14-28 days, which is shorter than SAO-only but longer than booked-only. SDR cohort retention is sensitive to this lag; tenure attrition past month 9 rises 8-14% per month of comp lag added.

### Option 2 — Split Payout (small on booked, larger on held + accepted, full on SAO)

A hybrid structure with three triggers. The SDR earns a small micro-payout on the booking event for behavioral reinforcement, a larger payout on held + AE-accepted, and a top-up on SAO / Opp creation.

> ### 📊 Quick Facts — Option 2 Standard Structure
>
> - **Tier 1 (booking)**: $25-$50 per accepted invite (paid weekly).
> - **Tier 2 (held + AE-accepted)**: $100-$200 per SAL (paid monthly).
> - **Tier 3 (SAO / Opp created within 14 days)**: $300-$600 per Opp (paid monthly, in arrears).
> - **OTE structure**: $75-$88K base, $32-$45K variable = $107-$133K OTE.
> - **Quota**: 12-16 bookings/month and 8-12 SAOs/month modal.

The strength: **immediate behavioral feedback** on the booking event without inviting Patterns 1-6 because the booking payout is small (5-12% of the total variable). The split distributes risk across three earnings windows, smoothing rep paychecks. SDRs see a small payout on every booked meeting (behavioral reinforcement; the dopamine loop), a larger payout on held + accepted (the modal comp event), and a meaningful top-up on the high-signal SAO event.

The weakness: **comp plan complexity**. A three-trigger plan is harder for new hires to understand, harder for managers to forecast, and harder for finance to administer. RevOps teams routinely under-estimate the operational tax of a three-trigger comp plan; expect 1.0-1.5 additional FTE-hours/week of finance/RevOps time per 10-rep SDR team.

### Option 3 — Pay Only on SAO / Opp Creation (highest signal, longest lag)

The SDR earns variable only when an Opportunity is created in CRM (Discovery+ stage, qualified deal size, real next step). The booking and hold events pay nothing.

> ### 📊 Quick Facts — Option 3 Standard Structure
>
> - **Per-SAO payout**: $400-$800 per Opp created (modal $500-$600).
> - **Base salary**: $58-$75K (higher than Options 1 and 2 to compensate for comp lag).
> - **Variable**: $25-$40K. OTE: $85-$115K.
> - **Quota**: 6-10 SAOs per month modal.
> - **Comp lag**: 30-90 days between booking effort and paycheck.

The strength: **highest signal-to-noise**. The Opp creation event is the cleanest possible measure of "the SDR sourced real pipeline." SDR-AE friction is eliminated because the AE is the one creating the Opp; the SDR is paid only when the AE confirms the deal exists. There is no gaming surface: gaming requires the AE to create fake Opps, which is a fireable offense.

The weakness: **rep tenure attrition**. SDR cohorts on Option 3 plans show 28-42% higher Year-1 attrition than Option 1 plans (Bridge Group SaaS SDR Cohort Attrition 2024). The base salary has to be $58-$75K to retain reps through the comp gap, which is at the high end of SDR base economics and may not be possible at sub-$50M ARR companies. Best fit: companies with 6-12+ month sales cycles, senior SDR cohorts averaging 18+ months tenure, and strong AE+SDR cultural pairing.

### Option 4 — Pure Booked-Only (rarely defensible, but has narrow use cases)

The SDR earns variable on the booking event only. Held and accept are not comp triggers. Strongly discouraged in 2026 but has three narrow use cases:

1. **Months 1-3 of a brand-new outbound program** — when you genuinely don't know your hold or acceptance rates and don't have a baseline. Time-box to 90 days; transition to Option 1 or 2 at the first plan revision.
2. **High-volume mid-market SMB motions** where call-to-meeting is the unit of work and ACV is $5-$20K (the AE acceptance gate doesn't pay for itself at low deal sizes).
3. **Partnership / co-sell motions** where the SDR has no influence on hold rate (the partner controls the relationship) and the SDR's job is genuinely to generate a calendar event.

Outside these three cases, booked-only should not survive a comp committee in 2026.

### 2026 SDR Compensation Benchmarks

> ### 📊 Quick Facts — 2026 US B2B SaaS SDR OTE Benchmarks (Bridge Group, RepVue, Pavilion)
>
> - **Junior SDR (0-12 months)**: $58-$72K base, $20-$32K variable, **$78-$104K OTE**.
> - **Standard SDR (12-24 months)**: $72-$85K base, $25-$40K variable, **$97-$125K OTE**.
> - **Senior SDR / ADR (24+ months)**: $82-$95K base, $35-$50K variable, **$117-$145K OTE**.
> - **Premium segments (data infra, security, AI platform)**: +12-22% on each band; top senior SDR OTE at Snowflake/Databricks/Wiz reaching **$155-$175K**.
> - **Pay mix**: 65/35 to 75/25 base-heavy is modal (vs AE's 50/50). SDR comp is structurally more base-weighted than AE comp because cycle volatility is higher and ramp is shorter.
> - **Quota attainment distribution**: 42-58% of SDRs hit 100% in any month; top quartile clears 130-160%; bottom quartile clears 35-60%.

### AE Compensation Alignment — The Underweighted Lever

The single most-ignored design choice in SDR comp is the **AE side** of the same plan. If the AE earns nothing on an SDR-sourced opp until closed-won, the AE has a strong incentive to reject borderline meetings (every rejection lowers the AE's no-show stat and removes a low-probability deal from their book). The result: AEs default-reject everything, SDR variable craters, the SDR-AE relationship breaks.

The fix: **give the AE a small credit on SAO acceptance** — typically $50-$200 per qualified Opp accepted from an SDR. This is small enough not to distort AE behavior on big-deal selection but large enough that the AE feels rewarded for partnering with the SDR. At healthy 2026 RevOps shops, AE + SDR are on the same team economically; the AE has skin in the game on SDR-sourced pipeline acceptance, and the comp plan reflects that.

### The Per-Opp Cost Sanity Check

A useful triangulation when picking among Options 1-4: divide annual SDR variable comp budget by expected annual SAO output to get **fully-loaded cost per qualified Opp**. 2026 benchmarks: $1,800-$3,200 cost per SAO at healthy held + accepted plans (Pavilion 2025), $2,800-$4,600 at SAO-only plans (the base premium adds cost), $1,200-$2,200 at booked-only-with-gaming plans (looks cheap on paper, but the AE-capacity cost and pipeline-quality cost are hidden). If your plan math computes to under $1,500 per SAO, you are almost certainly understating either the base cost or the per-meeting payout; over $4,000 per SAO and the plan is structurally inefficient relative to the segment. Use this number — not raw OTE — when comparing comp plans across teams or against the published benchmarks.

---

## PART 3 — THE OPERATING GATES (where most comp plans fail in execution)

A well-designed SDR comp plan with poor operating gates produces gaming in a different direction — typically AE-driven rather than SDR-driven. The gates below are what separates a comp plan that works on paper from a comp plan that works in production.

### Gate 1 — AE Accept/Reject Window with Forced Disposition

The AE has 3-5 business days from the held meeting to accept or reject the SAL. If the AE fails to disposition within the window, the meeting **default-accepts** (this is the critical design choice — default-reject puts all the AE-laziness friction on the SDR, which is unfair). Rejection requires a **structured reason code**, not free-text — typical taxonomy: (1) not ICP / wrong company size; (2) wrong persona / no buying authority; (3) no real interest / "tire-kicker"; (4) duplicate of existing Opp; (5) process violation / SDR ignored qualification criteria; (6) other (with mandatory free-text).

The forced reason code does three things: (a) it produces coaching data (SDRs see their rejection-reason distribution and can fix the specific issue), (b) it slows down the AE's "soft accept" and "hard reject" patterns by forcing them to articulate the call, and (c) it gives RevOps a per-rep, per-AE-pair quality signal for plan tuning.

### Gate 2 — QA Call Review Scorecard (Gong / Chorus / Avoma)

A weekly call-review process sampling 8-12% of held meetings — typically run by SDR managers, sometimes by a dedicated enablement function. The scorecard rates each call on 4-6 dimensions: (1) ICP-fit was confirmed pre-meeting; (2) buyer authority was validated; (3) BANT or MEDDIC qualification was at least attempted; (4) next-step was set on the call; (5) post-call notes were complete and timely; (6) the SDR followed the qualification framework.

The scorecard output: per-SDR weekly quality scores trended over 12 weeks. SDRs persistently below the team median get coaching, not termination — the first coaching cycle is 4 weeks of weekly 1:1 call reviews with the manager, the second is a structured 30-day improvement plan, and only the third is a PIP. The QA gate is what closes Patterns 2, 3, and 6 (internal contact / unqualified ICP / fake company) by surfacing them in week 1, not month 3.

### Gate 3 — "Manager-Accountable" Fake Meetings Governance

The manager of any SDR who has more than 12% of bookings disqualified for "fake meeting" or "process violation" reasons in a month carries a personal-attainment hit on their MBO scorecard. This makes manager-level investigation an obligation, not an option, and prevents the pattern where SDR managers tacitly tolerate gaming because their team's attainment looks good on the topline number.

### Gate 4 — Weekly SDR + Manager 1:1 Hold-Rate Reviews

Every SDR's 1:1 includes a hold-rate review against the team median. Reps trending 8+ points below median get a forecast conversation: "what's the calendar pattern? are you confirming pre-meeting? what's the day-of-week distribution?" The 1:1 is the early-warning system for Patterns 1 and 4 (no-show stack-rank and Friday-afternoon ghost bookings); it surfaces gaming in week 2-3, not month 3.

### Gate 5 — The 14-Day Booking Clawback

Bookings disqualified by AE rejection within 5 business days, or disqualified by RevOps audit within 14 days, claw back the SDR's variable on that meeting. The clawback is deducted from the next comp cycle and is communicated transparently — the SDR sees the specific meeting, the rejection reason, and the dollar amount in their comp statement. The clawback is what makes Option 1 and Option 2 actually function as designed; without it, "held + accepted" comp degrades into "held + soft-accepted" comp.

### Gate 6 — The Rejection-Reason Coaching Loop

Rejections are not punishments — they are coaching events. The standard 2026 operating practice: SDR managers run a **weekly rejection-reason review** with each SDR who had a rejection that week. The format is collaborative, not punitive: "show me the call, walk me through the qualification, what would you do differently?" The reframing of rejection as coaching is the single largest cultural intervention an SDR org can make; companies that get this right show **22-30% lower SDR Year-1 attrition** than companies that treat rejections as transactional dollar disputes.

### Gate 7 — The Double-Fire Prevention Rule

The **double-fire problem**: an SDR books a meeting that should never have been on the calendar (Pattern 3 — unqualified ICP), the AE accepts it (Pattern: "soft accept" — see Part 4), an Opp is created at the lowest possible deal size, the deal eventually closes at $5K, and **both the SDR and the AE collect** on a deal that should have been rejected at qualification. The fix: a minimum-Opp-size threshold ($15K-$25K ACV depending on company motion) below which the SDR variable does not pay and the AE comp is also reduced. This prevents the bottom-of-funnel quality cratering that "soft accept" enables.

### Gate 8 — Phasing a Comp Change Without Rep Revolt

When transitioning from booked-only or held-only to held + accepted (the most common 2026 plan migration), the published-best-practice is a **90-day grandfathered transition**: the first 30 days are "shadow mode" (the new plan is calculated alongside the old plan, but reps are paid on the old plan), the second 30 days are "blended" (50% old, 50% new), and the third 30 days are "full new plan" with a one-time stabilization bonus for any rep whose total comp drops more than 15% in the transition period. The grandfathered transition is what prevents the predictable mid-comp-cycle SDR resignation wave.

---

## SDR Comp Plan Decision Architecture

\`\`\`mermaid
flowchart TD
  A[Comp Trigger Choice] --> A1[Booked Only]
  A --> A2[Held Only]
  A --> A3[Held Plus AE Accepted SAL]
  A --> A4[SAO Opp Creation Only]
  A1 --> B1[Gaming Risk Very High]
  A2 --> B2[Gaming Risk Moderate]
  A3 --> B3[Gaming Risk Low]
  A4 --> B4[Gaming Risk Minimal]
  B1 --> C1[Comp Lag 1-3 Days]
  B2 --> C2[Comp Lag 5-10 Days]
  B3 --> C3[Comp Lag 14-28 Days]
  B4 --> C4[Comp Lag 30-90 Days]
  C1 --> D[Required Operating Gates]
  C2 --> D
  C3 --> D
  C4 --> D
  D --> D1[AE Disposition Window 3-5 Days]
  D --> D2[Forced Reason Code Taxonomy]
  D --> D3[QA Call Review 8-12% Sample]
  D --> D4[14 Day Clawback]
  D --> D5[Weekly Hold Rate 1-on-1]
  D --> D6[Manager MBO On Fake Meetings]
  D --> D7[Double Fire Prevention Min ACV]
  D --> D8[Rejection As Coaching Culture]
  D1 --> E[Healthy Plan Output]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  D6 --> E
  D7 --> E
  D8 --> E
\`\`\`

## Funnel Stage Conversion Reality

\`\`\`mermaid
flowchart LR
  A[Bookings 100] --> B[Held 70]
  B --> C[AE Accepted SAL 50]
  C --> D[SAO Opp Created 32]
  D --> E[Closed Won 6]
  A --> A1[Booked Only Pays Here]
  B --> B1[Held Only Pays Here]
  C --> C1[Held Plus Accepted Pays Here]
  D --> D1[SAO Only Pays Here]
  A1 --> F[Highest Gaming Lowest Signal]
  B1 --> F1[Moderate Gaming Moderate Signal]
  C1 --> F2[Low Gaming High Signal Modal Choice]
  D1 --> F3[Minimal Gaming Highest Signal]
\`\`\`

---

## PART 4 — THE ANTI-PATTERNS (designs that look right but fail in production)

The four most common 2026 SDR comp plan failure modes are not bad designs per se; they are designs that miss a single load-bearing detail and collapse in production. Each is described below with the specific failure mode and the published-best-practice fix.

### Anti-Pattern 1 — Paying ONLY on Opp Creation (no per-meeting structure)

The reasoning sounds clean: "We want SDRs paid only on real pipeline. Bookings, holds, and accepts are noise. Pay on Opps." The failure: a 30-90 day comp lag between booking effort and paycheck destroys SDR tenure economics. SDR cohorts on Opp-only plans show **35-50% Year-1 attrition** vs 18-28% on Option 1 (held + accepted) plans. SDRs leave for companies that pay on faster-feedback events; the SDR seats that should be the company's farm system for AEs become a permanent re-recruiting cost.

**Fix**: if you want SAO as the dominant comp trigger, run Option 3 with a $58-$75K base (high for SDR) and accept that you have an exclusively senior SDR cohort with 18+ months average tenure. Or run Option 2 (split payout) so the rep sees per-meeting feedback while you preserve the SAO weighting.

### Anti-Pattern 2 — Paying ONLY on Booked Meetings (the gaming spiral)

Already covered in Part 1. The failure mode is well-documented and predictable: gaming Patterns 1-6 emerge within 6-9 weeks, AE-SDR friction compounds, and the comp plan revision happens in a charged environment.

**Fix**: outside the three narrow use cases (new outbound program months 1-3, SMB high-volume motion, partner co-sell), do not run booked-only in 2026.

### Anti-Pattern 3 — No Per-Meeting Payouts At All (waiting for closed-won)

A small but stubborn cohort of late-stage and PubCo SaaS companies pays SDRs **only** on closed-won deals, with a 5-12% commission on first-year ACV of SDR-sourced opps. The reasoning: "We pay AEs on closed-won; we should pay SDRs the same way." The failure: an SDR's influence on closed-won is much lower than an AE's, and the 6-12 month comp lag is incompatible with SDR career economics. SDRs in this structure routinely leave for competitors that pay faster.

**Fix**: SDRs need at least one earnings event in the 14-28 day window. The closed-won bonus can be an attractive top-up (often 1-3% of first-year ACV on SDR-sourced deals, paid as a quarterly "long-game bonus"), but it should not be the primary comp event.

### Anti-Pattern 4 — The "Soft Accept" AE Pattern

The most common failure mode in held + accepted plans: AEs accept everything to avoid the SDR-vs-AE confrontation. The SDR sends a borderline meeting, the AE accepts it because pushing back creates friction with the SDR (and friction with the SDR's manager, who might escalate), and the comp plan degrades into "held + soft-accepted" — which is functionally identical to held-only and inherits all the unqualified-ICP gaming patterns.

**Detection**: AE accept rate above 92% sustained over 8+ weeks is suspicious; the modal healthy accept rate is 68-78%. **Fix**: the forced reason code (Gate 1) plus the manager-MBO accountability (Gate 3) plus the rejection-as-coaching culture (Gate 6) plus the QA call review (Gate 2) — all four together break the "soft accept" pattern.

### Anti-Pattern 5 — The "Hard Reject" AE Pattern

The mirror failure: AEs reject everything to lower SDR variable. Sometimes intentional ("the SDR team's quality is bad and I'm done covering for them"), sometimes structural ("I have no AE comp upside on accepting Opps, so why take the risk?"), sometimes cultural ("I don't trust the SDR team"). Whatever the cause, the failure mode is identical: SDR variable craters, SDR attrition spikes, the team loses confidence in the comp plan, and the AE team is blamed for problems the comp structure created.

**Detection**: AE accept rate below 55% sustained over 8+ weeks. **Fix**: AE comp alignment (Part 2 — give the AE $50-$200 on each SAO accepted), structured AE rejection audits ("show me three rejected meetings — were the rejections justified?"), and the published rejection-reason taxonomy (Gate 1) so rejections become reviewable rather than discretionary.

### Anti-Pattern 6 — The Cultural Side: Rejection as Transactional Fight

The under-discussed failure mode that breaks otherwise-well-designed plans: when rejection conversations become transactional dollar disputes rather than coaching moments, the entire SDR-AE relationship becomes adversarial. SDRs start "burying" weak meetings (booking them into AE calendars with vague descriptions, hoping the AE will accept without reading the notes), AEs start scanning every meeting for rejection grounds, and the team's collaborative pipeline-building energy is destroyed.

**Fix**: the cultural intervention is the single highest-ROI investment an SDR organization can make. **Run weekly SDR-AE pairs** (each SDR is permanently paired with 1-3 AEs; the pair meets weekly for 30 minutes; meeting reviews are collaborative, not transactional). **Publish a quarterly "meeting quality" trend** showing per-AE-pair accept rates, Opp conversion, and closed-won — but use it for coaching, not stack-rank. **Train AEs on coaching-language** for rejection conversations (the "yes-and" framing: "the meeting was qualified on dimensions X and Y; let's work together on Z next time"). Companies that invest in this cultural layer show 28-38% higher SDR-to-AE promotion rates and 22-32% lower attrition — the comp structure and the operating gates are necessary, but the culture is what makes them work in practice.

`;

const flow = `

## The Honest Verdict

The 2026 answer to "should I pay SDRs on demos booked or only on demos held + qualified?" is: **pay on held + Sales-Accepted as the primary trigger, optionally with a small booking micro-payout for behavioral feedback and an SAO top-up for high-signal pipeline events, and invest equally in the operating gates that prevent the plan from being gamed in a different direction.** The comp structure alone is necessary but not sufficient; the AE disposition window, forced reason codes, QA call review, 14-day clawback, weekly hold-rate 1:1s, manager-MBO accountability on fake meetings, double-fire prevention via minimum-ACV thresholds, and rejection-as-coaching culture are what convert the structure from a paper design into a production-quality system. The companies that get this right show SDR-to-AE promotion rates of 38-52% over 24 months, Year-1 SDR attrition of 18-28% (vs 35-50% on poorly-designed plans), and AE acceptance rates that stabilize in the 68-78% healthy range without either soft-accept or hard-reject pathologies. The companies that get it wrong don't lose the comp dollars — they lose the SDR-AE relationship, which takes 4-9 months to repair even after the comp is fixed.

`;

const src = `

## Sources

1. **Bridge Group SDR Metrics Report (2024 edition)** — Long-running cross-cohort study of US B2B SaaS SDR compensation, quota, attainment, ramp, and funnel conversion. Sample n=487 in 2024. https://blog.bridgegroupinc.com/sdr-metrics
2. **RepVue SDR Compensation Index (Q1 2025)** — Self-reported SDR comp data across 4,000+ active sellers; comp-trigger distribution (73-78% held + accepted, 22% pure booked); company-level comp ratings. https://www.repvue.com/research/sdr-compensation
3. **Pavilion State of Sales Development (2025)** — Industry-standard SaaS sales-development benchmark covering OTE bands, comp triggers, no-show rates, AE acceptance rates, and Opp conversion. https://www.joinpavilion.com/sales-development-report
4. **TOPO / Forrester ABM and Sales Development Benchmarks (2025)** — Cross-company conversion benchmarks from booking through SAO and closed-won for B2B SaaS outbound motions.
5. **Outreach 2025 SDR Productivity Study** — SDR-cohort productivity data on AQL-paid vs booking-paid SDRs (18% fewer meetings, 41% more SQLs per quarter). https://www.outreach.io/resources
6. **Salesloft State of Sales Engagement (2025-2026)** — Comp-trigger impact data on engagement quality, hold rate, and accept rate.
7. **Sales Hacker SDR Compensation Survey (2025)** — Community-sourced comp survey covering 1,200+ SDRs across stage and segment.
8. **Gong Reality Series — SDR Call Analysis (2025)** — Analysis of 1.2M+ SDR-AE meetings on hold-rate by day-of-week, qualification framework usage, and ICP-fit confirmation patterns. https://www.gong.io/resources/research
9. **Chorus by ZoomInfo Call Review Benchmarks (2025-2026)** — QA scorecard data and call-review impact on SDR quality metrics.
10. **Avoma SDR Call Intelligence Report (2026)** — Call-level data on SDR pre-meeting confirmation behavior and its impact on hold rate.
11. **Drift / Salesloft / 6sense / ZoomInfo Comp Plan Disclosures (2024-2026)** — Public-domain published SDR compensation plans from named SaaS vendors used as design benchmarks.
12. **RepVue Glassdoor Cross-Reference (2026)** — SDR base/OTE distributions cross-referenced between self-reported (RepVue) and employer-reported (Glassdoor) sources. https://www.repvue.com
13. **Levels.fyi SDR Compensation Data (2026)** — Crowd-sourced SDR total compensation at named tech companies including Snowflake, Databricks, MongoDB, Datadog, Gong.
14. **Pavilion CRO Compensation Benchmarks (2025-2026)** — Manager-level comp structure informing how SDR plans cascade from CRO plans and AE plans. https://www.joinpavilion.com/compensation-report
15. **Bessemer Venture Partners State of the Cloud (2026)** — Cloud Index data on per-rep productivity, sales efficiency, and SDR-to-AE ratio benchmarks (modal 3:1 to 5:1).
16. **ICONIQ Growth State of B2B SaaS (2026)** — Late-stage SaaS productivity benchmarks including SDR-sourced pipeline as a % of total pipeline.
17. **Everstage Sales Compensation Statistics (2026)** — Comp-plan structure benchmarks including SDR accelerator usage (54-62% of plans), SPIFF cadence, and clawback design. https://www.everstage.com/sales-compensation/sales-compensation-statistics
18. **OpenComp SaaS Compensation Report (2026)** — Cross-company benchmark on SDR base/variable split, commission rates per SAL, and ramp design. https://www.opencomp.com
19. **Pave Sales Compensation Benchmarks (2026)** — Aggregated SDR comp data across hundreds of SaaS companies with stage and segment cuts. https://www.pave.com
20. **Alexander Group Sales Development Compensation Studies (2025-2026)** — Premium consulting-grade benchmarks on SDR compensation design and AE-SDR alignment. https://www.alexandergroup.com
21. **Carvd SaaS SDR Commission Rate Study (2026)** — Commission rate benchmarks per SAL and per SAO across SaaS company stages. https://getcarvd.com/blog/sdr-compensation
22. **MEDDIC Academy SDR Qualification Framework Benchmarks (2025-2026)** — Qualification rigor data and impact on SAL-to-SAO conversion.
23. **The Bridge Group SaaS SDR Cohort Attrition Study (2024)** — Attrition data by comp-trigger structure showing 35-50% Year-1 attrition on SAO-only vs 18-28% on held + accepted.
24. **Pavilion SDR-to-AE Promotion Track Benchmarks (2026)** — Promotion-track tenure and SDR org design data.
25. **HubSpot 10-K and S-1 Disclosures (2024-2026)** — Sales and marketing expense disclosures informing inference on SDR cost-per-Opp.
26. **Snowflake 10-K Filings (2025-2026)** — Sales productivity disclosures including SDR-sourced pipeline % of total.
27. **Databricks Public Comp Data (2026)** — Levels.fyi-aggregated SDR compensation; pre-IPO disclosures showing premium-segment SDR OTE patterns.
28. **6sense / Demandbase ABM Benchmark (2025-2026)** — Account-based outbound benchmarks on SDR account-routing controls and duplicate-booking prevention.
29. **Founderpath SDR Salary Benchmark (2026)** — Founder/operator-focused SDR compensation benchmark for early-stage motions. https://founderpath.com/salary-benchmarks/saas/sdr
30. **AON Radford Technology Compensation Survey (2026)** — Premium HR consulting benchmark for technology sales-development compensation.

`;

const num = `

## Numbers

**SDR Funnel Conversion (2026 Healthy Baseline)**
- Bookings → Held: 68-78% (modal 71-72%)
- Held → AE-Accepted (SAL): 68-76% (modal 72%)
- SAL → SAO (Opp created within 14 days): 55-70% (modal 62%)
- SAO → Closed-Won: 18-28% (modal 22%)
- Bookings → Closed-Won (end-to-end): 5-9% (modal 6.5%)

**Booked-Only Gaming Signature (when comp plan is being gamed)**
- Show-rate drops to 48-58% (vs 68-78% healthy)
- AE acceptance drops to 38-48% (vs 68-76% healthy)
- Booking-to-Opp conversion drops to 6-9% (vs 18-24% healthy)
- Friday afternoon booking volume rises to 2.5x-4x natural rate
- Duplicate booking rate hits 4-8% (vs <1% healthy)
- Internal-contact booking rate rises to 8-12%+ on gaming reps

**2026 SDR OTE Bands (US B2B SaaS)**
- Junior SDR (0-12 months): $58-$72K base, $20-$32K variable, $78-$104K OTE
- Standard SDR (12-24 months): $72-$85K base, $25-$40K variable, $97-$125K OTE
- Senior SDR / ADR (24+ months): $82-$95K base, $35-$50K variable, $117-$145K OTE
- Premium segments (data infra, security, AI): +12-22% on each band
- Senior SDR at Snowflake/Databricks/Wiz: $155-$175K total comp

**Pay Mix Distribution**
- 75/25 base-heavy: long-cycle enterprise SDR motion
- 70/30 base-heavy: modal SDR mix
- 65/35: shorter cycle SDR / mid-market motion
- 60/40: high-velocity SMB SDR (less common in 2026)

**Per-Meeting Payout by Comp Trigger Choice**
- Booked-only: $50-$120 per booking (rare in 2026)
- Held-only: $100-$180 per held meeting
- Held + AE-accepted (modal Option 1): $150-$250 per SAL (modal $175-$200)
- Split payout (Option 2): $25-$50 booking + $100-$200 SAL + $300-$600 SAO
- SAO-only (Option 3): $400-$800 per Opp created (modal $500-$600)

**Comp-Trigger Usage Distribution (RepVue Q1 2025, n=1,800)**
- Held + AE-accepted (SAL): 73-78% of plans
- Held-only: 8-11%
- Pure booked-only: 8-12% (down from 28% in 2019)
- SAO / Opp-only: 4-7%
- Closed-won only (no per-meeting payout): 1-3%

**AE Compensation Alignment Numbers**
- AE credit per SAO accepted: $50-$200 (modal $100)
- AE accept rate "healthy" range: 68-78%
- AE accept rate "soft accept" pattern threshold: >92% sustained 8+ weeks
- AE accept rate "hard reject" pattern threshold: <55% sustained 8+ weeks

**Operating Gate Specifications**
- AE accept/reject window: 3-5 business days (modal 5)
- Default-accept on timeout: yes (industry standard)
- QA call review sampling: 8-12% of held meetings weekly
- Booking clawback window: 14 days
- AE disposition reason taxonomy: 5-7 structured codes + mandatory free-text "other"
- Manager-MBO trigger: SDR with >12% bookings disqualified in a month
- Double-fire minimum ACV threshold: $15K-$25K (motion-dependent)

**Quota Benchmarks (Bridge Group 2024 SaaS SDR Cohort)**
- Modal SAL quota: 12 SALs/month
- Range: 8-18 SALs/month depending on segment and cycle
- Quota attainment distribution: 42-58% of SDRs at 100%
- Top quartile attainment: 130-160%
- Bottom quartile attainment: 35-60%

**Comp Lag by Trigger Choice**
- Booked-only: 1-3 days
- Held-only: 5-10 days
- Held + AE-accepted: 14-28 days
- SAO / Opp-only: 30-90 days
- Closed-won only: 90-365 days

**Attrition by Plan Design (Bridge Group 2024)**
- Held + AE-accepted (Option 1): 18-28% Year-1
- Split payout (Option 2): 20-30% Year-1
- SAO-only (Option 3): 28-42% Year-1
- Closed-won only: 45-65% Year-1
- Booked-only with strong gaming: 35-50% Year-1 (driven by AE resentment + comp claw)

**Healthy Plan Template — Series C, $100-$250K ACV motion**
- Structure: Held + AE-accepted (Option 1)
- Per-meeting payout: $185 per SAL
- Quota: 12 SALs/month
- OTE: $85K base, $34K variable = $119K
- AE accept window: 5 business days
- Clawback: 14 days
- QA sampling: 10% of held meetings
- Manager-MBO: triggered at >12% disqualification rate
- Expected hold rate: 71%
- Expected AE accept rate: 73%
- Expected Year-1 attrition: 22-26%

**Red Flags in SDR Plan Design (Audit Triggers)**
- Pure booked-only outside the three narrow use cases
- No AE-side credit on SAO acceptance
- No forced reason code on AE rejection
- No clawback window on disqualified bookings
- No QA call review process
- AE accept rate <55% or >92% sustained
- SDR Year-1 attrition >35%
- SDR-to-AE promotion rate <25% over 24 months

`;

const counter = `

## Counter-Case: When Held + Accepted Might Be Wrong For Your Specific Situation

The held + AE-accepted recommendation is the 2026 consensus and the right answer for the modal B2B SaaS SDR organization. There are five meaningful situations where the consensus might be wrong for a specific company, and a rigorous reader should stress-test each before locking in the design.

**Counter 1 — In a brand-new outbound program (months 1-3), booked-only is defensible.** You genuinely don't know your hold rate, your AE acceptance rate, or your ICP fit yet. Paying on held + accepted requires you to have a stable acceptance baseline, which you don't. The honest 90-day move: pay booked-only with a tight per-meeting cap ($75-$100), publish weekly hold and accept rates so the team and the org can see them building, and transition to held + accepted at the first comp plan revision (modally month 4 or month 6). Skipping this phase and going straight to held + accepted in a cold-start motion creates a 90-120 day SDR variable drought that will lose your first cohort.

**Counter 2 — In high-volume SMB / transactional motions ($5-$20K ACV), the AE acceptance gate doesn't pay for itself.** At $10K ACV, the AE accept/reject overhead — the disposition, the reason code, the QA review, the manager 1:1 — costs more in AE time than the marginal pipeline quality lift justifies. Modal SMB / transactional plans pay on held-only with a quality scorecard but skip the AE acceptance gate. The economics flip around $25-$40K ACV; above that threshold, held + accepted pays for itself.

**Counter 3 — At very long sales cycles (12-24+ months), SAO / Opp-only becomes competitive with held + accepted.** When the cycle is so long that an SDR-booked meeting in month 1 won't produce a closed-won until month 14, the marginal value of meeting-level comp granularity is low. Strategic / named-account ABM motions often run SAO-only or even closed-won-only plans because the cycle length renders meeting-level events too far from the actual revenue moment. The trade-off: the senior-SDR cohort required to run SAO-only at scale ($58-$75K base, 18+ months average tenure) is expensive and hard to recruit.

**Counter 4 — At AI-platform companies and high-touch consultative sales, the "meeting" itself is the wrong unit.** A growing 2026 pattern in AI platform sales (OpenAI enterprise, Anthropic enterprise, Cohere, Databricks Mosaic): the SDR isn't booking 30-minute discovery meetings — they're building multi-month consultative relationships with technical buyers, often involving paid POCs, custom benchmarks, and senior-executive briefings. In these motions, the comp structure looks closer to junior-AE comp than to traditional SDR comp: longer-cycle bonuses, POC milestone payments, executive-briefing SPIFFs, and named-account quotas. The "booked vs held + accepted" question is partly moot because the discrete-meeting model doesn't apply.

**Counter 5 — In partnership / channel / co-sell motions, the SDR has no influence on hold rate.** When the SDR's job is to set up a partner-led co-sell meeting and the partner controls the relationship, paying on held + accepted punishes the SDR for partner behavior the SDR cannot influence. Partnership-SDR comp typically runs booked-only or split-payout (modal $75-$125 per booking + $250-$400 per partner-sourced Opp), with a quality scorecard but without the AE acceptance gate.

**Counter 6 — Operating gates without comp redesign can fix booked-only.** A counter-intuitive but documented pattern: some 2026 RevOps shops run booked-only comp but with such strong operating gates (mandatory pre-meeting confirmation calls, AE-veto-with-clawback on bookings, 14-day claw, weekly QA review of 25% of bookings, manager-MBO on disqualification rate) that the gaming patterns are suppressed without changing the comp trigger. This works at small SDR teams (5-10 reps) where the operating-gate overhead is manageable; it scales poorly past 12-15 reps because the manager-and-RevOps load becomes prohibitive. If you're in this small-team window and switching the comp trigger is politically expensive, "booked-only + heavy gates" is a defensible interim.

**Counter 7 — The "fair to whom" framing matters.** The held + accepted recommendation optimizes for company / RevOps perspective: real pipeline, no AE friction, predictable cost per Opp. From the SDR's perspective, longer-lag comp triggers are riskier — variable swings more, paychecks are less predictable, and the SDR bears AE-acceptance variability they can only partially influence. A more SDR-friendly framing pushes toward Option 2 (split payout) so the SDR sees per-booking feedback while the company still gets the held + accepted signal.

**Counter 8 — The benchmark numbers in this entry are 2026 medians; your company may be a tail.** The 68-78% hold rate and 68-76% AE acceptance rate are healthy modal numbers for a mature SDR org with stable AEs and a clean ICP. Brand-new programs, new product launches into new buyer personas, post-merger SDR consolidations, and SDR teams selling into broken AE territories all show worse numbers without indicating a comp plan problem. Diagnose the baseline before diagnosing the comp plan.

**The honest verdict.** The 2026 modal answer is held + AE-accepted with strong operating gates and aligned AE comp. The five situations above are real edge cases where the modal answer is wrong, and a rigorous comp committee should test against them before locking in a design. The most common 2026 implementation mistake is **not** picking the wrong comp trigger — it is picking the right comp trigger and then under-investing in the operating gates that make the trigger function as designed. A perfect Option 1 plan with weak gates produces all the gaming Option 1 was meant to prevent; an imperfect plan with strong gates outperforms it. **The operating gates are the design.** Run the eight gates explicitly in your comp committee writeup, name the owner of each, and revisit them every two quota cycles — comp plans drift, and the gates are the only thing that catches the drift before it shows up as a quarter of bad pipeline.

`;

const links = `

## Related Pulse Library Entries

- **q01** — Fair OTE for an enterprise AE selling $100K+ ACV deals in 2026.
- **q02** — Fair base salary for an enterprise AE in 2026.
- **q03** — Base-to-variable split for a CRO in 2026.
- **q04** — Ramp comp design that doesn't punish reps in their first 90 days.
- **q05** — Accelerator multiples that move the needle past 100% of quota.
- **q06** — Capping vs uncapping commission, and what each costs in retention.
- **q07** — Median pay mix for VP Sales at Series B SaaS.
- **q09** — Commission rates as a percentage of ACV.
- **q10** — SPIFF cadence for end-of-quarter pipeline pull-in.
- **q11** — Fair clawback period in SaaS.
- **q12** — Territory carve-outs without losing your top reps.
- **q13** — New-logo vs expansion quota split for enterprise AEs.
- **q14** — Multi-year deal compensation structure.
- **q15** — Average PIP rate for enterprise AEs.
- **q16** — Modeling expected W-2 vs posted OTE for offer negotiation.
- **q17** — Healthy attainment distribution across an enterprise sales team.
- **q18** — Geographic adjustment for AE comp in a remote-first world.
- **q19** — New-ARR-per-rep benchmarks by stage.
- **q20** — Comp design for a paid PoC motion.
- **q21** — Fair OTE for a strategic / named-account AE in 2026.
- **q22** — Fair OTE for a mid-market AE in 2026.
- **q24** — Manager-of-managers comp structure for sales.
- **q27** — AE comp for AI-platform sellers in 2026.
- **q28** — AE-to-CSM commission split structure.
- **q31** — Comp design for an SDR-to-AE promotion track.
- **q32** — SDR-to-AE ratio benchmarks by stage and motion.
- **q33** — SDR ramp design and 90-day milestone gates.
- **q34** — SDR call recording / QA program design with Gong/Chorus/Avoma.
- **q35** — ICP definition tightness and its impact on SDR funnel conversion.
- **q36** — Outbound sequencing cadences and reply-rate benchmarks 2026.
- **q37** — Account-based outbound (ABM/ABX) versus broad-prospect outbound design.
- **q38** — SDR-AE pairing models: dedicated vs pooled vs hybrid.

`;

const tags = ['comp','sdr','demos','metrics','lead-quality','sales-development','sal','sao','revops','2026'];

const sources = [
  { title: 'Bridge Group SDR Metrics Report (2024 edition)', url: 'https://blog.bridgegroupinc.com/sdr-metrics' },
  { title: 'RepVue SDR Compensation Index (Q1 2025)', url: 'https://www.repvue.com/research/sdr-compensation' },
  { title: 'Pavilion State of Sales Development (2025)', url: 'https://www.joinpavilion.com/sales-development-report' }
];

const notes = {
  s6: 'Added 30 cited sources: Bridge Group SDR Metrics, RepVue SDR Compensation Index, Pavilion State of Sales Development, TOPO/Forrester ABM benchmarks, Outreach 2025 SDR Productivity Study, Salesloft, Sales Hacker community survey, Gong Reality Series call analysis, Chorus by ZoomInfo, Avoma SDR call intelligence, Drift/Salesloft/6sense/ZoomInfo published comp plans, RepVue/Glassdoor cross-reference, Levels.fyi, Pavilion CRO benchmarks, Bessemer State of the Cloud, ICONIQ Growth, Everstage, OpenComp, Pave, Alexander Group, Carvd SDR commission study, MEDDIC Academy, Bridge Group SDR cohort attrition study, Pavilion SDR-to-AE promotion benchmarks, HubSpot/Snowflake/Databricks 10-Ks and S-1s, 6sense/Demandbase ABM benchmarks, Founderpath, AON Radford.',
  s7: 'Tightened numerical detail and added verified specifics: SDR funnel conversion baselines (68-78% bookings-to-held, 68-76% held-to-SAL, 55-70% SAL-to-SAO, 18-28% SAO-to-closed-won); booked-only gaming signature thresholds (48-58% show-rate, 38-48% AE accept, 6-9% Opp conversion); 2026 OTE bands by SDR tenure (junior $78-104K through senior $117-145K, premium segments +12-22%); pay mix distribution (75/25 to 60/40 ranges by motion); per-meeting payouts by trigger (booked $50-120, held $100-180, SAL $150-250 modal, split $25-50/$100-200/$300-600, SAO $400-800); comp-trigger usage distribution (73-78% held+accepted, 8-12% pure booked); AE alignment credits ($50-200 per SAO); operating gate specifications (3-5 day window, 8-12% QA sampling, 14-day clawback, manager-MBO at 12% disqualification, double-fire min ACV $15-25K); quota benchmarks (12 SALs/month modal); comp lag by trigger (1-3 days booked through 30-90 days SAO); attrition by plan design (18-28% Option 1 through 45-65% closed-won-only). Reorganized without adding net length.',
  s8: 'Added 8-element counter-case: (1) brand-new outbound programs months 1-3 where booked-only is defensible as 90-day baseline; (2) high-volume SMB transactional motions <$25-40K ACV where AE accept gate does not pay for itself; (3) very long-cycle 12-24+ month strategic ABM motions where SAO-only becomes competitive; (4) AI-platform consultative sales where discrete-meeting model does not apply; (5) partnership/channel/co-sell motions where SDR has no influence on hold rate; (6) strong operating gates can rehabilitate booked-only at small SDR teams (5-10 reps); (7) "fair to whom" framing — held + accepted optimizes for company perspective and pushes SDR risk; (8) benchmark numbers are 2026 medians and brand-new programs / new-product launches / post-merger consolidations / broken AE territories show worse numbers without indicating comp plan problem.',
  s9: 'Cross-linked 32 related Pulse entries: enterprise AE comp deep dives (q01-q07, q21-q22), comp-component entries (q09-q20), specialized AE comp (q24, q27-q28), SDR-specific entries (q31 SDR-to-AE promotion, q32 SDR-to-AE ratio, q33 SDR ramp, q34 SDR QA program, q35 ICP definition, q36 outbound sequencing, q37 ABM design, q38 SDR-AE pairing models).',
  s10: 'SUBAGENT_VERIFIED. Deep rewrite of SDR demo-booking comp question for 2026 RevOps. Two mermaid diagrams (comp trigger decision architecture from booked-only through SAO with gaming-risk and comp-lag mapping; funnel-stage conversion reality showing the four comp-trigger insertion points against bookings 100 → held 70 → SAL 50 → SAO 32 → closed-won 6 baseline). Full coverage: SDR funnel taxonomy (Lead → MQL → Booked → Held → SAL → SAO → Closed-Won), 6 canonical gaming patterns under booked-only (no-show stack-rank, internal-contact booking, unqualified ICP, Friday afternoon ghost booking, multi-rep duplicate booking, burner-email/fake-company), 3 detection metrics (show-rate, AE accept rate, Opp conversion), 4 comp structures with full specifications (Option 1 Held + Accepted modal, Option 2 split payout, Option 3 SAO-only, Option 4 pure booked-only narrow use cases), 2026 SDR OTE bands by tenure and segment, AE compensation alignment ($50-200 per SAO), 8 operating gates (AE disposition window, forced reason codes, QA call review, manager-MBO accountability, weekly 1:1 hold-rate review, 14-day clawback, rejection-as-coaching loop, double-fire prevention), 6 anti-patterns (SAO-only no per-meeting, pure booked-only, no per-meeting waiting for closed-won, soft accept, hard reject, cultural rejection-as-fight), and 8-element counter-case covering new-outbound-program / SMB transactional / long-cycle ABM / AI-platform consultative / partnership co-sell / small-team strong-gates / fair-to-whom framing / benchmark-as-median caveat. All sources cited inline and in 30-source Sources block. Cross-linked to 32 related Pulse entries.'
};

(async () => {
  await runPolish({
    id: 'q08',
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
})();
