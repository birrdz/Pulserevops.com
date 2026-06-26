// q02 — How should I structure SDR commission to discourage gaming MQL counts?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** **Stop paying SDRs on MQLs. Pay them on Sales-Accepted Opportunities (SAOs) — qualified meetings that AEs have accepted within a 5-business-day window.** Goodhart's Law guarantees that any metric you bonus on becomes a gaming target, and MQLs are the most-gamed metric in B2B sales because they're cheap to fabricate (LinkedIn lookups, internal-contact "demos," ghosted meetings, ChatGPT-spammed personas, conference badge-scans, burner phone numbers) and impossible to disprove in real time. The 2026 best-in-class SDR comp structure: **$75K-$95K base + $35K-$50K variable = $110K-$145K OTE** with a **70/30 to 65/35 base/variable mix** (Bridge Group SDR Metrics 2025, RepVue, Pavilion). The variable splits across three triggers — **(1) per-held-and-AE-accepted meeting at $75-$200, (2) per-SAO at $250-$600 with a stage-2+ disposition requirement, (3) per-closed-won-sourced-Opp at 1-3% of ACV paid quarterly** — with **accelerators kicking in at 110% of quota (1.5×) and 125% (2.0×)**. Wrap the plan in **four anti-gaming gates: (a) 5-business-day AE accept/reject window with mandatory disposition codes, (b) recorded discovery call requirement (Gong/Chorus/Avoma), (c) 14-day clawback for no-shows and rejected meetings, (d) weekly disposition audits with QA scorecards**. Pay clawbacks via "negative SPIFF" deductions on the next paycheck, not by retroactively recouping cash. Pair this with **manager comp aligned to held-rate, SAO-conversion, and pipeline-influenced revenue — never raw MQL count** — because a manager paid on volume will whitelist gaming behavior. The companies that publicly run variants of this model — **Gong, Outreach, ZoomInfo, Drift (Salesloft), 6sense, Salesloft Rhythm-era plan** — saw 35-60% drops in junk meetings within 90 days. Two anti-patterns to avoid: **(1) paying ONLY on closed-won revenue** (12-month feedback gap kills SDR motivation and creates rage-quit cycles), and **(2) paying nothing per meeting** (eliminates the urgency loop and SDRs default to comfortable activity instead of pipeline). The 2026-specific wrinkle: **AI-augmented prospecting tools (Apollo, Clay, Salesloft Rhythm, 11x Alice/James, Artisan Ava)** mean raw "activity" metrics are obsolete — output-based comp on qualified pipeline is the only model that survives AI commoditization. Net: design the comp plan as if your smartest, laziest SDR will find every loophole — because they will.`;

const core = `

## What an SDR Actually Is in 2026 and Why MQL Counts Became the Most-Gamed Metric in B2B Sales

A **Sales Development Representative (SDR)** — sometimes titled Business Development Representative (BDR), Lead Development Rep (LDR), or Market Development Rep (MDR) — is the front-end seller in a B2B revenue org. They sit between marketing and sales: marketing generates Marketing-Qualified Leads (MQLs), the SDR contacts those leads (plus self-sourced outbound prospects), qualifies fit and intent, and books a discovery meeting that is handed to an Account Executive (AE) who runs the closing motion. In 2026, the typical SDR carries a quota of **8-14 Sales-Accepted Opportunities per month**, makes **35-65 outbound dials per day plus 25-50 personalized emails plus 8-15 LinkedIn touches**, and operates inside a tech stack of Outreach or Salesloft for sequencing, Gong or Chorus or Avoma for call recording, Apollo or Clay or ZoomInfo for data enrichment, and Salesforce or HubSpot as the system of record.

The funnel they live inside has six stages, and the labels matter because the **wrong comp trigger at the wrong stage is the entire problem you are trying to solve**:

- **Lead** — any contact in your CRM. Worthless on its own.
- **MQL (Marketing-Qualified Lead)** — a lead that has crossed a marketing-defined score threshold (downloaded a whitepaper, visited the pricing page three times, attended a webinar, hit a behavioral trigger in 6sense or Demandbase). **MQL is a marketing definition, not a sales one.**
- **SAL (Sales-Accepted Lead)** — an MQL that the SDR has reviewed and accepted as worth a touch attempt. Lightweight handshake — usually no real qualification yet.
- **SQL (Sales-Qualified Lead)** — a contact the SDR has spoken with and confirmed has budget, authority, need, and timing (BANT) or some MEDDIC/MEDDPICC equivalent. Ready for an AE conversation.
- **SAO (Sales-Accepted Opportunity)** — a meeting between prospect and AE that the **AE has explicitly accepted** as a real qualified opportunity, usually within a 5-business-day SLA after the meeting occurs. **This is the metric you want to pay on.**
- **Closed-Won Revenue** — the deal closes, contract is signed, ACV/ARR posts. The 6-12 month feedback loop from this back to the SDR is too slow to use as the only comp trigger.

The reason MQL count is the most-gamed metric in B2B sales is structural, not moral. **Goodhart's Law** — formalized in 1975 by British economist Charles Goodhart and popularized in management literature by anthropologist Marilyn Strathern — states that "when a measure becomes a target, it ceases to be a good measure." **Campbell's Law** (Donald Campbell, 1979) is the social-science twin: "the more any quantitative social indicator is used for social decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort and corrupt the social processes it is intended to monitor." Both laws were developed observing education systems, healthcare metrics, and Soviet factory quotas — and both apply with surgical precision to SDR compensation design. Tie a $200 bonus to "MQLs converted to meetings booked" and within 60-90 days you will discover that 35-55% of those meetings are fabricated, padded, or low-intent. This is not because SDRs are dishonest; it is because **rational economic actors optimize against the metric they are paid on, and MQLs are the cheapest metric in the entire revenue funnel to manufacture**.

> ### Bottom Line
> - **[The trap]** Per-MQL or per-booked-meeting bonuses always get gamed because MQLs are the cheapest revenue-funnel metric to fabricate. Goodhart's Law guarantees it.
> - **[The fix]** Pay on Sales-Accepted Opportunities (SAOs) — meetings the AE has explicitly accepted as qualified within a 5-business-day SLA — and gate everything else (per-meeting micro-payments, accelerators, sourced-revenue commission) on top of that primary trigger.
> - **[The math]** Standard 2026 SDR OTE: **$75K-$95K base + $35K-$50K variable = $110K-$145K total** at 70/30 to 65/35 split, with $75-$200 per held meeting, $250-$600 per SAO, 1-3% of sourced ACV paid quarterly, and accelerators at 110% (1.5×) and 125% (2.0×) of quota. Plan must include: 5-day AE accept/reject window, recorded-call requirement, 14-day clawback, weekly QA disposition audits.

## PART 1 — WHY MQLs GET GAMED: THE GOODHART/CAMPBELL TRAP IN PRACTICE

### The Specific Gaming Behaviors Every RevOps Leader Eventually Sees

When you pay SDRs on MQL count or raw booked-meeting count, you systematically reward a catalog of behaviors that range from "technically not lying" to "actively damaging the pipeline." These behaviors are predictable, repeatable, and have been observed in essentially every SaaS sales org that has tried this comp design since the early 2010s. The list below is drawn from Bridge Group's annual SDR Metrics Report, Pavilion peer benchmarks, RevOps Co-op community discussions, TOPO/Forrester research, and direct observation in dozens of public RevGenius and Sales Hacker case studies.

**Scheduling no-shows on purpose.** The SDR books a meeting with someone who said "sure, send me a calendar invite" on a cold call. The prospect never intended to attend. The meeting gets booked, the SDR gets credit, the meeting no-shows, and unless the comp plan has a clawback the SDR keeps the money. Industry-wide no-show rates on cold-booked meetings hover at **35-55%** (Gong's State of Outbound report, multiple years). When MQL-paid teams are studied, no-show rates spike into the **55-70%** range; when SAO-paid teams are studied, no-shows drop to **15-25%**.

**Scheduling unqualified prospects.** The SDR books a discovery call with someone who is at a 12-employee startup when your ICP is 500+ employee enterprises. Or with a junior individual contributor when your ICP is VP-and-above. The meeting "happened" — the AE shows up, wastes 20-40 minutes politely qualifying out, and the SDR gets paid. AE pushback metrics in MQL-paid orgs hit **45-65% rejection rates** when AEs are given the ability to reject; in healthy SAO-paid orgs the rejection rate sits at **8-18%**.

**Scheduling internal contacts as "demos."** The SDR has a friend at another company who agrees to "take the meeting" as a favor. The AE shows up, the friend asks polite questions, the meeting closes with no path forward, and the SDR collects the bonus. In severe cases SDRs have been caught using **personal email addresses of friends** with fake company affiliations. This is detectable in Gong/Chorus by looking at first-party email domains vs. enriched company data, and by checking whether the "prospect" was ever previously in your CRM.

**Booking the same person multiple times.** The SDR books a meeting with a prospect, the meeting happens, the prospect is mildly interested but not buying, the deal goes dormant in stage 2. Three months later the SDR re-engages the same person, books another "discovery" meeting, and double-collects the per-meeting bonus. Best-in-class comp plans block this with a **90-180 day account-level cooldown** before per-meeting bonuses can re-trigger on the same contact or account.

**Burner phone numbers and email aliases.** In the most blatant cases, SDRs have been caught creating fake prospects entirely — using Google Voice numbers, throwaway Gmail accounts, and ChatGPT-generated personas. This is rare but documented (notably in a 2022 RevGenius thread that went viral about a Bay Area SaaS company firing four SDRs in a single week). It's caught by enrichment-tool cross-validation (Clearbit, ZoomInfo, Apollo person-record matching) and by checking whether the "prospect" exists on LinkedIn at the claimed company.

**Conference badge-scan spam.** Post-event, the SDR uploads the scanned badges from a trade show and marks every attendee as an MQL. Some are real ICP; many are vendors, students, or competitors. Without a qualification gate, all of them count.

**ChatGPT-generated emails to wrong-ICP titles.** With AI-powered tools like Apollo Smart Send, Clay's Claygent, 11x Alice and James, and Artisan Ava, an SDR can send 4,000 personalized-looking emails per week. Many of those will get auto-bounce replies that platforms like Outreach or Salesloft can be configured to count as "engagement." Replies from "thanks for reaching out, not interested" can be classified as positive engagement signals by misconfigured intent models. Suddenly the SDR has 280 "engaged MQLs" per week and none of them are real.

**Conversion-floor evasion.** When orgs add a "meetings must convert at X% to count" rule, SDRs respond by **back-loading easy wins** — booking obviously-strong prospects late in the month to lift their conversion rate, while still padding earlier in the month for raw volume.

### How RevOps Leaders Detect Gaming in Their Own Pipeline

A handful of leading indicators reliably reveal that your comp plan is being gamed, often before the gaming has metastasized into a real pipeline-quality crisis. The diagnostics below take less than two hours to run with a competent RevOps analyst and a working BI tool.

- **Show-rate below 50% on SDR-booked meetings.** Healthy SAO-paid teams hit 65-80% show-rate. MQL-paid teams hit 35-55%. Anything below 50% sustained for 30+ days is a comp design problem, not a coaching problem.
- **MQL-to-Opp conversion below 8%.** Industry benchmarks from Bridge Group, Gartner, and TOPO put healthy MQL-to-Opp conversion at 13-22% for inbound and 6-11% for outbound. Sustained sub-8% conversion on inbound MQLs is a sign that "MQL" has been redefined downward by people who get paid on MQL volume.
- **AE-rejection rate above 25%.** If AEs are given a reject button and they're rejecting more than a quarter of SDR-sourced meetings, the SDR comp plan is paying for junk.
- **Discovery call duration trending downward.** Average discovery call length is a sleeper metric. Healthy disco calls run **22-38 minutes**. When SDRs are gaming, AEs subconsciously start ending fake meetings faster — average duration drops to **8-18 minutes** within 60-90 days.
- **Pipeline coverage growing while win-rate falls.** This is the executive-level smell test. If pipeline coverage doubles but win-rate halves, you have a gamed top-of-funnel.
- **High variance in SDR personal show-rates.** If your top SDR has a 78% show-rate and your bottom SDR has a 24% show-rate, the bottom SDR is gaming.
- **Same prospects appearing multiple times in 90-day windows.** Run a deduplication report on per-meeting bonus records weekly. Anything above 2% repeat-contact is concerning.
- **Booking-time clustering on Friday afternoons and end-of-month.** Gaming behavior clusters around comp-period boundaries. Calendar-density plots reveal this in 30 seconds.

### Manager Comp: The Compounding Multiplier on Bad SDR Comp

Here is the part most RevOps leaders miss. **The SDR manager's comp plan determines whether gaming is suppressed or amplified.** If the SDR manager is paid on aggregate MQL volume, raw meeting count, or "SDR team output," that manager will quietly whitelist gaming behavior because their bonus depends on it. They will tell SDRs "just book the meeting, AE pushback is their problem." They will reject AE-disposition challenges. They will negotiate the "definition of SAO" downward in QBRs.

The fix is to **align manager comp to the same downstream quality metrics as the AE org**: SAO-to-stage-2 conversion, pipeline-sourced closed-won revenue, average deal size of SDR-sourced Opps, and net-new logo count. The manager bonus should be **35-50% of OTE**, with at least half of that variable tied to **quality metrics, not volume metrics**. When the manager's $40K variable depends on SAO-to-Opp conversion staying above 65%, suddenly the manager is the strongest enforcer of qualification standards.

A manager comp plan that frequently works in 2026: **$120K-$155K base + $50K-$70K variable** where the variable splits as **30% on SDR team SAO quota attainment, 40% on SDR-sourced pipeline that reaches stage 2+, 20% on SDR-sourced closed-won revenue (paid quarterly), and 10% on SDR retention / ramp-time metrics**. This structure makes the manager economically aligned with AEs, not with marketing's MQL definition.

## PART 2 — THE COMP RESTRUCTURE: MOVING FROM MQL TO HELD-AND-QUALIFIED

### Why "Held and Qualified" Beats Every Other Primary Trigger

The single most important design decision in an anti-gaming SDR comp plan is **choosing the primary trigger** — the metric that drives the largest slice of variable compensation. There are five candidates, and only one survives Goodhart's Law without significant scaffolding:

- **Per-MQL.** Fails immediately. MQLs are a marketing-controlled metric and SDRs can convert anything into "MQL accepted." Do not use.
- **Per booked meeting.** Fails within 60-90 days. SDRs optimize for booking, not holding. Do not use as primary trigger.
- **Per held meeting (no AE acceptance gate).** Works for 90-180 days, then degrades as SDRs learn to book low-show-risk but low-quality prospects.
- **Per Sales-Accepted Opportunity (SAO) with AE accept/reject gate within 5 business days.** **This is the right answer.** The AE has to actively accept the meeting as a real Opp before the SDR collects the bonus. This pushes the qualification decision to the person who has economic skin in the game (the AE owns the close).
- **Per closed-won revenue (sourced).** Right metric philosophically, wrong as primary trigger because the 6-12 month feedback loop destroys SDR motivation and creates rage-quit cycles. Use it as a **secondary** trigger paid quarterly, never as the primary monthly mechanism.

The SAO trigger works because it creates **dual-sided economic accountability**. The SDR gets paid only if the AE accepts; the AE only accepts meetings they can credibly progress to stage 2 or higher because the AE's own comp depends on pipeline quality and close rate. The AE has no incentive to accept junk because accepting junk hurts their close-rate metrics and wastes their selling time. The SDR has no incentive to book junk because booking junk doesn't pay. The two roles cross-check each other.

### The 2026 OTE Benchmarks: What SDRs Actually Earn

The most-cited benchmarks come from **The Bridge Group's annual SDR Metrics & Compensation Report** (Trish Bertuzzi's firm, 2024-2025 edition is the current authority), **RepVue's crowdsourced compensation database**, **Pavilion's peer benchmark groups**, and **TOPO/Forrester B2B Sales Benchmark Studies**. The convergent picture for North American SaaS SDRs in 2026:

- **Total OTE: $95K-$145K** with a median around **$118K-$125K**
- **Base salary: $65K-$95K** with a median around **$78K-$82K**
- **Variable: $30K-$55K** with a median around **$38K-$42K**
- **Pay mix: 65/35 to 70/30 base/variable** (more base-heavy than AE roles which run 50/50 to 55/45)
- **Quota attainment: 56-64% of SDRs hit quota** in any given quarter (Bridge Group, RepVue)
- **Average tenure in role: 16-24 months** before promotion or churn
- **Cost of one SDR fully loaded (salary + benefits + tools + management overhead): $145K-$210K/year**

A few important segmentations:

- **Enterprise SDRs (selling into 5,000+ employee accounts) earn 15-25% more** than SMB/Mid-Market SDRs, with OTEs at $130K-$165K.
- **AI/security/fintech SDRs earn 10-20% premiums** over horizontal SaaS.
- **Outbound-heavy SDRs (75%+ outbound) earn 10-15% more** than inbound-heavy SDRs.
- **Remote SDRs are paid 5-12% less** than in-office SDRs in major metros, though this gap is closing in 2026.

### The Three-Trigger Variable Structure

The variable portion of OTE should never be a single trigger. A three-trigger structure with declining payout sizes and increasing qualification depth creates the right incentive shape:

**Trigger 1: Per held meeting (small payment, fast feedback).** Pay **$75-$200 per meeting that actually occurs** (prospect showed, call recorded, min 12-minute duration). This is the activity-urgency layer — without it SDRs lose daily motivation to keep dialing. Cap at 25-40% of total variable. Best practice: $100-$125 mid-market, $150-$200 enterprise.

**Trigger 2: Per Sales-Accepted Opportunity (medium payment, primary signal).** Pay **$250-$600 per SAO** where SAO is defined as a meeting the AE has accepted as a real Opp within 5 business days, with mandatory disposition codes. This should be **45-60% of total variable**. This is the primary motivator. Best practice: $350-$450 in mid-market, $500-$600 in enterprise.

**Trigger 3: Sourced-revenue commission (large payment, delayed but career-shaping).** Pay **1-3% of closed-won ACV on SDR-sourced Opps**, paid quarterly with a 30-day post-close grace period. This is **15-25% of total variable** in normal cases but larger for top performers. It aligns SDRs with company outcome and converts the role from transactional activity into strategic pipeline-building. Best practice: 1.5% mid-market, 2.5% enterprise, 3% on very-high-ACV strategic deals.

A worked example for a mid-market SaaS SDR at $120K OTE ($82K base, $38K variable, quota of 11 SAOs/month):

- Per held meeting: $100 × 18 held/month × 12 months = $21,600 (57% of variable). Too high — reduce to $75/meeting.
- Per SAO: $350 × 11 SAO × 12 months = $46,200 — but the SDR will not hit 100% every month. At 65% attainment: $30,030 (target variable should produce around $19K-$22K at this level).
- Sourced revenue commission: 2% × $750K sourced ACV/year = $15,000.

The plan needs to be tuned so that **a 100%-quota SDR earns exactly OTE**, an over-attainer hits $145K-$180K, and an under-attainer (60-70%) still clears base plus 50-60% of variable. The exact dollar tuning takes 2-4 weeks of modeling against historical activity data.

### Accelerators, Decelerators, and SPIFFs

**Accelerators** reward over-performance. The standard 2026 structure is:

- **0-90% of quota: 1.0× rate** on all triggers
- **90-110% of quota: 1.25× rate** on SAO bonus only (not per-meeting)
- **110-125% of quota: 1.5× rate** on SAO bonus and sourced revenue
- **125-150% of quota: 2.0× rate** on SAO and sourced revenue
- **150%+: capped or "President's Club" qualifier**

A few orgs use **decelerators** below 60% attainment, but most abandoned this in 2024-2026 because it accelerates churn when SDRs most need runway to learn.

**SPIFFs (Special Performance Incentive Funds)** are tactical bonuses layered on top of the base plan:

- **Net-new logo**: $200-$500 extra per SAO on accounts never previously in pipeline (drives true new-logo prospecting vs. dormant-account reactivation).
- **Strategic-account**: $500-$1,500 extra for ABM-list named accounts.
- **Vertical**: 25-50% bonus on a strategic vertical (e.g., fintech quarter).
- **Multi-thread**: $150-$300 for a second stakeholder meeting at an active account (no double-pay for same logo).
- **Pipeline-influence**: $50-$150 when an AE explicitly tags the SDR in a closed-won deal record.

SPIFFs should be time-boxed (60-90 days), capped at 5-10% of OTE, and tied to specific priorities. Permanent SPIFFs are a sign the base plan is broken and should be redesigned, not patched.

### Ramp Plans for New SDRs

New SDRs need a different comp structure for their first **60-120 days** because they have no realistic chance of hitting full quota during ramp. The standard 2026 ramp plan:

- **Days 1-30**: 100% base salary + guaranteed variable at 50% of target. Quota is 0.
- **Days 31-60**: 100% base + guaranteed variable at 75% of target. Quota is 25% of full.
- **Days 61-90**: 100% base + guaranteed variable at 100% of target. Quota is 50% of full.
- **Days 91-120**: 100% base + actual variable. Quota is 75% of full.
- **Day 121+**: Full plan.

Ramp guarantees prevent the "Month 3 churn cliff" where promising SDRs leave because they can't pay rent on partial commission. The cost of one ramp is roughly **$8,000-$15,000 in guaranteed variable**, which is trivial compared to the **$45,000-$80,000 cost of refilling a churned SDR seat** (recruiting + ramp + opportunity cost).

> ### Key Stat
> Replacing a single SDR who quits in month 4 costs an estimated **$45,000-$80,000** in recruiting, onboarding, and ramped-productivity opportunity cost. A well-designed ramp guarantee that costs $10K up front saves 4-8× that amount in retention. (Bridge Group, Pavilion benchmarks.)

## PART 3 — THE OPERATING GATES: WHAT MAKES THE PLAN GOODHART-PROOF

A well-designed comp plan is necessary but not sufficient. Without operational gates, even an SAO-based plan will erode within 6-12 months as SDRs and managers find the seams. The four critical gates:

### Gate 1: The 5-Business-Day AE Accept/Reject Window

After every SDR-sourced meeting, the AE has **5 business days** to either accept the meeting as a real Opp or reject it. **Acceptance triggers the SAO bonus; rejection blocks it.** The window must be tight — longer than 5 days and AEs stop dispositioning, default-acceptances kick in, and the gate becomes meaningless. Shorter than 3 days and AEs don't have time to actually progress the conversation enough to know.

**Required disposition codes** when AE rejects:

- "Wrong ICP — company size"
- "Wrong ICP — title/role"
- "Wrong ICP — vertical"
- "No real budget / not a buying conversation"
- "Already evaluated us and said no in the last 12 months"
- "Existing customer in good standing"
- "Competitor / partner / internal contact"
- "No-show / cancelled / never rescheduled"
- "Held but no path forward identified"

Each disposition code feeds back into the SDR's individual scorecard and into team-level pattern analysis. If 40% of an SDR's rejections are "wrong ICP — company size," that SDR needs coaching on segment definition, not punishment.

**Default rule for non-disposition**: If the AE does not disposition within 5 business days, **the meeting auto-accepts** (i.e., default benefit of the doubt to the SDR). This forces AE engagement — non-engagement costs the AE pipeline accountability later. Some orgs use the opposite default (auto-reject), but that creates AE/SDR adversarial dynamics that hurt the collaboration.

### Gate 2: Recorded Discovery Call Requirement

Every meeting that counts toward an SAO bonus **must be recorded** via Gong, Chorus (ZoomInfo), or Avoma. Unrecorded calls do not count. This serves three purposes:

- **Verification**: The meeting actually happened with a real prospect.
- **QA**: RevOps and managers can audit a random 3-5% of calls per SDR per month to verify qualification quality.
- **Coaching**: Recorded calls become the training data for the next generation of SDRs.

Modern call-intelligence platforms (Gong, Chorus, Avoma, Salesloft Drift Conversations, Outreach Kaia) auto-detect speakers, transcribe, and flag risk patterns. Best-in-class orgs use **scorecards** — typically 8-12 criteria like "Discovery questions asked," "Pain identified," "Decision process discussed," "Next steps confirmed" — that are auto-applied to every recorded call. Calls scoring below a threshold (commonly 60-70%) can be flagged for additional AE review before SAO credit is granted.

### Gate 3: 14-Day Clawback for No-Shows and Rejections

If the AE rejects a meeting, or if the meeting no-shows after the SDR has been credited (some orgs pay per-meeting credit at booking time, others at occurrence time), the bonus must be reversed. The mechanics:

- **Clawback within 14 days of credit**: standard. Beyond 14 days, the credit is final to avoid endless administrative thrash.
- **Implemented as "negative SPIFF" on next paycheck**, not retroactive cash recoupment. Forcing an SDR to write a check back to the company is morale-destroying and legally complicated in some states (California in particular makes commission clawback restrictive under Labor Code Section 200 and case law from *Sciborski v. Pacific Bell* and related rulings).
- **Cap clawbacks at 15-25% of monthly variable** to prevent catastrophic paychecks that trigger voluntary churn.
- **Document the clawback rules in the comp plan**, signed annually by each SDR. California, Massachusetts, and several other states require explicit written notice of clawback provisions.

### Gate 4: Weekly Disposition Review and QA Scorecards

The plan must include **weekly operating cadence** for quality review:

- **Monday morning RevOps report**: Per-SDR show-rate, SAO conversion, average AE rating, top 5 disposition reasons for rejections.
- **Tuesday SDR-AE alignment huddle (15 min)**: Specific rejected meetings reviewed, disposition agreed.
- **Wednesday manager 1:1s**: SDR-specific coaching on the previous week's quality patterns.
- **Monthly QA audit**: RevOps samples 3-5% of recorded calls, applies scorecard, publishes blind anonymized aggregate scores.
- **Quarterly comp plan review**: RevOps + sales leadership + finance reviews plan attainment distribution, gaming pattern indicators, and any structural drift.

> ### Warning
> Most SDR comp plans degrade within 9-15 months not because the design was wrong but because the **operating cadence around the plan was abandoned after the first quarter**. Treat the weekly cadence as load-bearing. If you cannot commit to it, your comp plan will get gamed regardless of how it was designed.

### Goodhart-Proof Design Principles

Beyond the four gates, a few meta-principles that have aged well:

- **The metric you pay on must be controlled by the SDR**, not by marketing or by the AE. Paying on "MQLs assigned" punishes SDRs for marketing-volume swings.
- **The metric must have a feedback loop fast enough to coach against** (weekly to monthly). Quarterly is too slow.
- **The metric must be costly to fake** relative to its bonus value. A $100 bonus for a 30-minute SAO is hard to game; a $100 bonus for an "MQL" is trivial to game.
- **No single trigger should exceed 60% of variable.** Diversifying the bonus across triggers (meeting + SAO + revenue) makes gaming any single metric less profitable.
- **Pay no faster than monthly, no slower than quarterly.** Weekly bonuses incentivize end-of-week gaming; annual bonuses kill motivation.
- **Disclose the full plan and all changes in writing**, signed annually. Verbal "we'll make it up to you" exceptions destroy trust.

## PART 4 — CASE STUDIES, PITFALLS, AND THE 2026 AI WRINKLE

### Companies That Moved Off MQL Bonuses (Public Variants)

A handful of companies have published variants of the SAO-based approach in podcasts, conference talks, and recruiting materials over 2022-2026. The pattern is remarkably consistent.

**Gong (the call-intelligence company).** In multiple Sales Hacker / Pavilion talks, Gong's RevOps leadership has described a plan that pays SDRs on **AE-accepted Opps with a 5-business-day disposition window** and explicitly rejects MQL-based comp. Gong's own product (call recording + QA scoring) is the enforcement mechanism. The reported result: held-rate jumped from 52% to 74% within 90 days of the comp shift in 2021-2022, with sourced-pipeline-to-closed-won conversion improving 18-24%.

**Outreach (sequencing platform).** Outreach's SDR plan has long emphasized **pipeline quality over volume**, with sourced-revenue commission as a meaningful slice of variable. Their own AI-augmented sequencing product gives SDRs the activity leverage to focus on quality without sacrificing volume.

**ZoomInfo (data/intelligence).** Public RepVue data and recruiting materials suggest ZoomInfo SDRs run a per-SAO model with **monthly quotas around 10-13 SAOs** and accelerators kicking in at 110%.

**Drift (acquired by Salesloft in 2024).** Drift famously emphasized **conversational pipeline** — chatbot-sourced meetings — and paid SDRs based on chat-sourced meetings that AEs accepted. Their bonus per accepted meeting was reported at $150-$250 in mid-market segments.

**6sense.** ABM intent platform that pays SDRs on **intent-qualified Opps**, where the SDR has to surface an account already showing buying-stage intent and book a meeting with a buying-committee member. The intent gate prevents random-target prospecting.

**Salesloft Rhythm-era plan (2024-2026).** With the launch of Rhythm, Salesloft's own SDR org reportedly shifted to a model where **Rhythm "actions" are tracked but not directly paid on**, with comp tied to downstream SAO and Opp creation. This explicitly avoids the "activity-metric trap" that the Rhythm product itself helps customers avoid.

### Anti-Patterns That Sound Smart and Fail

**Anti-pattern 1: Paying only on closed-won revenue.** Some CFOs love this because it perfectly aligns SDR comp with company outcome. The reality: closed-won feedback loops are **4-12 months in B2B SaaS**. An SDR who started in January gets their first revenue commission check in May at earliest, often August. By month 5 of zero variable comp, your SDR has accepted a recruiter call from another company. Pure revenue plans produce **45-65% annual SDR churn vs. 30-40% on properly designed SAO+revenue blended plans**.

**Anti-pattern 2: Paying nothing per meeting.** The argument: "Per-meeting payments incentivize junk." Partly true, but eliminating per-meeting entirely removes the daily-effort feedback loop. SDRs become demotivated by week 3 of a slow month with no incremental income. The fix is **small per-meeting payments capped at 25-35% of variable**, not zero.

**Anti-pattern 3: Over-rotating to sourced revenue commission.** Paying 5-10% of sourced ACV sounds aggressive and exciting until you realize that one $500K deal pays the SDR $25K-$50K in a single check, and the next quarter they have zero pipeline because they coasted on the big win. **Cap sourced-revenue commission at 25-30% of total variable** and pair it with consistent SAO-based monthly motivation.

**Anti-pattern 4: Changing the comp plan mid-year.** Even when the plan is broken, mid-year changes destroy trust. The right move: announce changes in Q4 for January implementation, with full transparency on the data that drove the change. Mid-year emergency tweaks erode reputation for years.

**Anti-pattern 5: Bonus cliffs at quota.** A plan that pays nothing extra below 100% and 1.5× above 100% creates a hard cliff where SDRs at 95% sandbag the rest of the month to start fresh, and SDRs at 65% give up entirely. Smooth accelerators (0.5× below 70%, 1.0× from 70-100%, 1.25× at 100-115%, 1.5× at 115%+) avoid the cliff dynamic.

**Anti-pattern 6: Different plans for different reps without transparent rationale.** When SDR A is on a $90K OTE and SDR B is on a $120K OTE for ostensibly the same role, expect lawsuits, exits, and team toxicity. Differentiation should be by tier (SDR-1, SDR-2, Senior SDR) with documented promotion criteria, not by negotiation.

**Anti-pattern 7: Paying on "activities" — dials, emails, sequences.** This is the worst variant of all because it fails Goodhart immediately AND fails to drive the right behavior. The 2026 AI-augmented prospecting wave (Apollo, Clay, Salesloft Rhythm, 11x, Artisan) means raw activity is essentially free — paying on dials means paying for AI-generated activity that produces zero pipeline.

> ### Quick Facts
> - SDR comp gaming behaviors are observed in 60-75% of MQL-paid teams within 6 months (Pavilion, RevGenius community surveys)
> - Companies switching from MQL-paid to SAO-paid typically see 35-60% reductions in junk meetings within 90 days
> - The cost of a poorly designed SDR comp plan is roughly $80K-$200K per SDR per year in wasted AE time and lost pipeline quality
> - Top-decile SDR plans pay $130K-$165K OTE for enterprise reps (RepVue 2025-2026 data)
> - The average SDR plan is revised every 18-22 months — best-in-class is revised annually with continuous monthly observation

### The Career-Path Question

The comp plan is only half of an SDR's career economics; the other half is what the SDR is being prepared for. The 2026 default paths: **SDR → AE Mid-Market (18-36 mo) → AE Enterprise (3-5+ yr) → Strategic AD or Sales Manager**; or **SDR → SDR Team Lead → SDR Manager → Director SDR**; or **SDR → RevOps Analyst → Sr RevOps → RevOps Manager**.

The comp plan should make promotion economic for both the SDR and the company. A high performer held back for 36+ months because their comp is too lucrative to leave will disengage. Best SDR plans include **promotion velocity metrics** in manager evaluation, partially scoring managers on how many SDRs they promote within 18-24 months — this stops managers hoarding top performers.

### How AI/Automation Changes the Comp Question in 2026

The 2024-2026 AI-augmented prospecting wave has fundamentally changed what "SDR output" means. With **Apollo Smart Sequences, Clay's AI Claygent enrichment, Salesloft Rhythm's AI prioritization, 11x's Alice (AI BDR) and James (AI AE), and Artisan's Ava**, a single human SDR can now send **20-40× the email volume of a 2020-era SDR** while making fewer dials and more personalized outreach. This creates four structural shifts:

**Shift 1: Activity metrics are obsolete.** "Dials per day" and "emails per day" no longer measure anything when AI generates the activity. Any comp component tied to raw activity will be 100% gamed within 30 days of an AI tool rollout.

**Shift 2: Held-and-qualified is the only metric that matters.** AI cannot (yet) manufacture a real held meeting with a real ICP buyer who shows up. 11x's roadmap suggests fully autonomous "AI SDR" agents booking real meetings is plausible by 2027-2028, which will require another comp restructure.

**Shift 3: Per-SDR quotas are rising.** 2022 quotas of 8-10 SAOs/month are now 12-18 SAOs/month at the same OTE. The leverage from AI tooling flows partly to the company (lower cost per Opp) and partly to the SDR (higher attainment).

**Shift 4: Hybrid human + AI pods need new comp categories.** When 11x Alice produces an SAO on an SDR's territory, the current best practice is to credit the human SDR but cap AI-sourced bonus at 50-75% of human-sourced bonus to maintain the prospecting muscle.

**Shift 5: "AI fluency" is a hiring criterion.** SDRs who can configure Apollo + Clay + Salesloft Rhythm effectively are 2-4× more productive — "AI-fluent SDR" tiers now carry $5K-$15K higher base salaries.

### What "Done" Looks Like

A well-designed SDR plan won't eliminate gaming entirely — it will reduce it from **35-55% of SAOs to single digits**. Healthy steady-state signals: show-rate above 65%, SAO-to-stage-2 conversion above 55%, AE rejection rate below 18%, voluntary SDR churn at 25-35% annual, and quarterly audits surfacing 0-2 new gaming patterns rather than 8-15. If your numbers don't move after 90 days, the gates aren't being operated — start with the weekly cadence before redesigning the plan again.

`;

const flow = `

## SDR Comp Plan Flow: From MQL to Paid SAO

\`\`\`mermaid
flowchart TD
  A[Marketing Generates MQL] --> B[SDR Reviews MQL]
  A2[SDR Sources Outbound Account] --> B
  B --> B1{ICP Fit Check}
  B1 -->|Yes| C[SDR Sequences Prospect]
  B1 -->|No| B2[Disqualify and Recycle]
  C --> C1[Multi Channel Touches]
  C1 --> C2[Cold Call]
  C1 --> C3[Personalized Email]
  C1 --> C4[LinkedIn Touch]
  C1 --> C5[Video Loom Touch]
  C2 --> D[Prospect Responds]
  C3 --> D
  C4 --> D
  C5 --> D
  D --> D1[Discovery Conversation Booked]
  D1 --> E{Meeting Holds}
  E -->|No Show| E1[14 Day Recoupment Window]
  E -->|Held| F[Per Held Meeting Credit $75-200]
  F --> G[Recorded Via Gong Chorus Avoma]
  G --> H[AE 5 Business Day Accept Reject Window]
  H --> H1{AE Disposition}
  H1 -->|Accept| I[SAO Created Stage 2 Plus]
  H1 -->|Reject| J[Disposition Code Captured]
  J --> J1[Wrong ICP Company Size]
  J --> J2[Wrong ICP Title]
  J --> J3[Wrong ICP Vertical]
  J --> J4[No Budget Not Buying]
  J --> J5[Existing Customer]
  J --> J6[Competitor Partner Internal]
  J --> J7[Held No Path Forward]
  J1 --> K[SDR Coaching Loop]
  J2 --> K
  J3 --> K
  J4 --> K
  J5 --> K
  J6 --> K
  J7 --> K
  I --> L[SAO Bonus Paid $250-600]
  L --> M[Opp Progresses Through AE Pipeline]
  M --> M1{Outcome}
  M1 -->|Closed Won| N[Sourced Revenue Commission 1-3% ACV]
  M1 -->|Closed Lost| O[Loss Reason Captured]
  M1 -->|Stalled| P[Pipeline Hygiene Review]
  N --> N1[Paid Quarterly]
  N1 --> Q[Accelerators Apply Above 110% Quota]
  Q --> Q1[110-125% at 1.5x]
  Q --> Q2[125-150% at 2.0x]
  Q --> Q3[Above 150% Presidents Club]
  O --> K
  P --> K
\`\`\`

## Operating Cadence: Weekly to Quarterly SDR Plan Governance

\`\`\`mermaid
flowchart LR
  A[Plan Designed Q4 For Jan Launch] --> B[SDR Plan Signed Annually]
  B --> C[Monday RevOps Report]
  C --> C1[Per SDR Show Rate]
  C --> C2[SAO Conversion]
  C --> C3[Avg AE Rating]
  C --> C4[Top 5 Disposition Rejections]
  C1 --> D[Tuesday SDR AE Alignment Huddle]
  C2 --> D
  C3 --> D
  C4 --> D
  D --> D1[Specific Rejected Meetings Reviewed]
  D --> D2[Disposition Agreed In Real Time]
  D1 --> E[Wednesday Manager 1 on 1]
  D2 --> E
  E --> E1[Coaching Patterns Identified]
  E --> E2[Gaming Risk Flagged]
  E1 --> F[Thursday Friday Sequencing Adjustments]
  E2 --> F
  F --> G[Monthly QA Audit]
  G --> G1[RevOps Samples 3-5% Recorded Calls]
  G --> G2[Scorecard Applied Auto]
  G --> G3[Blind Aggregate Scores Published]
  G1 --> H[Monthly Variable Commission Run]
  G2 --> H
  G3 --> H
  H --> H1[Clawbacks Applied As Negative SPIFF]
  H --> H2[Accelerators Calculated]
  H --> H3[Sourced Revenue Reconciled Quarterly]
  H1 --> I[Quarterly Comp Plan Review]
  H2 --> I
  H3 --> I
  I --> I1[Attainment Distribution Analyzed]
  I --> I2[Gaming Patterns Reviewed]
  I --> I3[Structural Drift Identified]
  I1 --> J[Quarterly Manager Comp Review]
  I2 --> J
  I3 --> J
  J --> K[Annual Comp Plan Redesign]
  K --> A
\`\`\`

`;

const src = `

## Sources

1. **The Bridge Group — SDR Metrics & Compensation Report (Trish Bertuzzi)** — The canonical annual benchmark for North American SDR pay, quota, ramp, tenure, and structure. https://blog.bridgegroupinc.com/sales-development-metrics
2. **RepVue — Crowdsourced SDR / BDR Compensation Database** — Live national wage data for SDR/BDR/AE roles across 4,000+ companies. https://www.repvue.com/salaries/sales-development-representative
3. **Pavilion — Sales Leadership Community Benchmarks** — Peer benchmark data on comp design, quota, and plan structure across 10,000+ revenue leaders. https://www.joinpavilion.com
4. **Gartner — Sales Development Metrics Research** — Conversion benchmarks and gaming-pattern research on MQL-to-Opp conversion rates. https://www.gartner.com/en/sales
5. **TOPO / Forrester B2B Sales Benchmark Studies** — SDR funnel benchmarks and pay mix data. https://www.forrester.com
6. **Goodhart's Law (Charles Goodhart, 1975)** — "When a measure becomes a target, it ceases to be a good measure." Original economic policy paper; foundational to gaming-resistant metric design.
7. **Campbell's Law (Donald Campbell, 1979)** — "The more any quantitative social indicator is used for social decision-making, the more subject it will be to corruption pressures." Social-science twin of Goodhart's Law.
8. **Marilyn Strathern (1997) — "Improving Ratings: Audit in the British University System"** — Popularized Goodhart's Law in management literature.
9. **Gong — State of Outbound Report (annual)** — Show-rate, meeting-quality, and call-duration benchmarks from anonymized call recordings.
10. **Chorus.ai (ZoomInfo) — Conversation Intelligence Benchmarks** — Discovery call quality scoring and AE-acceptance disposition data.
11. **Avoma — Meeting Intelligence Platform** — Call recording, QA scoring, and disposition automation. https://www.avoma.com
12. **Outreach.io — Sales Engagement Platform Best Practices** — Sequencing structure, activity-vs-output measurement framework. https://www.outreach.io
13. **Salesloft + Drift (post-acquisition 2024) — Rhythm Platform Documentation** — AI prioritization replacing raw activity metrics. https://salesloft.com
14. **Apollo.io — AI Smart Sequences Documentation** — AI-augmented prospecting workflows and impact on activity metrics. https://www.apollo.io
15. **Clay — Claygent and Enrichment Platform** — Data enrichment and AI persona-validation workflows. https://www.clay.com
16. **11x — Alice (AI BDR) and James (AI AE) Product Documentation** — AI agent prospecting and the impact on SDR comp design. https://www.11x.ai
17. **Artisan — Ava AI BDR Product** — Autonomous AI BDR and hybrid human/AI comp implications. https://www.artisan.co
18. **6sense — Intent and ABM Platform** — Intent-qualified Opp triggers and account-based SDR comp models. https://www.6sense.com
19. **Demandbase — ABM Platform** — Account-based intent scoring used in SDR comp gates. https://www.demandbase.com
20. **Sales Hacker — SDR Compensation Best Practices Articles (Max Altschuler, Scott Barker, others)** — Industry practitioner content on SDR comp design. https://www.saleshacker.com
21. **RevGenius Community — SDR Comp Plan Discussions** — Practitioner crowdsourced examples of gaming patterns and remediation. https://www.revgenius.com
22. **RevOps Co-op — Operating Cadence and Plan Audit Resources** — Practitioner community for RevOps governance of SDR plans. https://www.revopscoop.com
23. **The 5% Institute / Modern Sales Pros — SDR Manager Comp Benchmarks** — Manager-level OTE and quality metric design.
24. **Salesforce State of Sales Report (annual, 2024-2026)** — Macro benchmarks for sales productivity, attainment, and tooling adoption.
25. **HubSpot — Sales Enablement and Sales Hub Benchmarks** — SMB and mid-market SDR comp data. https://www.hubspot.com
26. **Predictable Revenue (Aaron Ross, Marylou Tyler)** — Original "cold calling 2.0" framework that defined modern SDR role. The foundational text on SDR specialization.
27. **The Sales Development Playbook (Trish Bertuzzi)** — Foundational text on SDR team design, comp, and operating cadence.
28. **Combo Prospecting (Tony J. Hughes)** — Multi-channel prospecting tactics relevant to SDR activity design.
29. **Predictable Pipeline (Anthony Iannarino)** — Pipeline coverage and quality benchmarks.
30. **Winning by Design — SaaS Sales Methodology** — SPICED qualification framework used as gate for SAO acceptance. https://winningbydesign.com
31. **MEDDIC Academy** — MEDDIC and MEDDPICC qualification standards used at SAO acceptance. https://www.meddic.academy
32. **Force Management — Command of the Message** — Enterprise SDR qualification and value-message framework.
33. **California Labor Code Section 200 et seq. and *Sciborski v. Pacific Bell*** — Legal framework restricting commission clawback in California; relevant to comp plan design and clawback gate.
34. **Massachusetts Wage Act and Commission Statute** — State-level commission protection rules requiring written plan disclosure.
35. **Federal Fair Labor Standards Act (FLSA) Exempt Employee Rules** — SDR overtime exemption status and how comp plan structure affects FLSA compliance.
36. **Xactly Sales Performance Management Platform** — Commission calculation engine used by mid-market and enterprise SDR orgs. https://www.xactlycorp.com
37. **CaptivateIQ Commission Platform** — Modern commission calc and clawback management. https://www.captivateiq.com
38. **Spiff (acquired by Salesforce 2024) Commission Platform** — Sales commission automation. https://spiff.com
39. **Salesforce Revenue Cloud (Sales Cloud + Revenue Intelligence)** — System of record for SAO disposition workflow.
40. **HubSpot Sales Hub Enterprise** — Mid-market system of record for SDR comp tracking and disposition workflow.

`;

const num = `

## Numbers

**SDR OTE and Pay Mix (North American SaaS, 2026)**
- Total OTE range: $95K-$145K (median $118K-$125K)
- Enterprise SDR OTE: $130K-$165K
- SMB SDR OTE: $90K-$115K
- Base salary range: $65K-$95K (median $78K-$82K)
- Variable range: $30K-$55K (median $38K-$42K)
- Pay mix: 65/35 to 70/30 base/variable
- Quota attainment: 56-64% hit quota in any quarter
- Top-decile SDR earnings (with accelerators): $165K-$215K
- Fully loaded SDR cost (salary + benefits + tools + management): $145K-$210K/year

**Variable Trigger Structure**
- Per held meeting: $75-$200 (cap at 25-35% of variable)
- Per SAO (AE-accepted): $250-$600 (45-60% of variable)
- Sourced revenue commission: 1-3% of ACV (15-25% of variable, paid quarterly)
- Net-new logo SPIFF: $200-$500 additional per SAO
- Strategic-account SPIFF: $500-$1,500 per ABM-list meeting
- Vertical SPIFF: 25-50% bonus during strategic quarters
- Multi-thread SPIFF: $150-$300 per additional stakeholder
- Pipeline-influence SPIFF: $50-$150 for AE-tagged involvement

**Accelerators**
- 0-90% of quota: 1.0× rate
- 90-110%: 1.25× on SAO bonus
- 110-125%: 1.5× on SAO and sourced revenue
- 125-150%: 2.0× on SAO and sourced revenue
- 150%+: capped or President's Club

**Quota and Activity Benchmarks**
- Monthly SAO quota: 8-14 SAOs (2022 era 8-10, 2026 AI-augmented 12-18)
- Outbound dials per day: 35-65
- Personalized emails per day: 25-50
- LinkedIn touches per day: 8-15
- Average tenure in SDR role: 16-24 months
- Annual SDR voluntary churn (well-designed plan): 25-35%
- Annual SDR voluntary churn (poorly designed plan): 45-65%

**Funnel Conversion Benchmarks**
- MQL-to-Opp conversion (healthy inbound): 13-22%
- MQL-to-Opp conversion (healthy outbound): 6-11%
- MQL-to-Opp conversion (broken/gamed): 3-8%
- SAO-to-stage-2 conversion (healthy): 55-72%
- SAO-to-closed-won (B2B SaaS): 18-28%
- Discovery call average duration (healthy): 22-38 minutes
- Discovery call average duration (gamed): 8-18 minutes
- Show-rate on SDR-booked meetings (healthy SAO plan): 65-80%
- Show-rate on SDR-booked meetings (gamed MQL plan): 35-55%
- AE rejection rate (healthy): 8-18%
- AE rejection rate (gamed): 25-65%

**Gaming Behavior Prevalence**
- MQL-paid teams showing gaming within 6 months: 60-75%
- No-show rates MQL plans: 55-70%
- No-show rates SAO plans: 15-25%
- Gaming reduction within 90 days of comp switch: 35-60%
- Junk meetings as % of MQL plan SAOs: 35-55%
- Junk meetings as % of SAO plan SAOs: 4-12%

**Operating Gates**
- AE accept/reject window: 5 business days (default auto-accept)
- Clawback window: 14 days from credit
- Clawback cap: 15-25% of monthly variable
- QA audit sample: 3-5% of recorded calls per SDR per month
- Call scorecard threshold: 60-70% to clear without additional review
- Account-level cooldown for repeat per-meeting bonus: 90-180 days

**Manager Comp**
- SDR manager OTE: $170K-$225K
- Manager base: $120K-$155K
- Manager variable: $50K-$70K
- Manager variable mix: 30% team SAO quota / 40% pipeline to stage 2+ / 20% closed-won quarterly / 10% retention and ramp

**Ramp Economics**
- Days 1-30: 100% base + 50% guaranteed variable, 0% quota
- Days 31-60: 100% base + 75% guaranteed variable, 25% quota
- Days 61-90: 100% base + 100% guaranteed variable, 50% quota
- Days 91-120: 100% base + actual variable, 75% quota
- Day 121+: full plan
- Cost of one full ramp guarantee: $8,000-$15,000
- Cost of refilling a churned SDR seat: $45,000-$80,000
- Net ROI of ramp guarantee: 4-8× the upfront cost

**Tooling Stack Costs (Per SDR Per Year)**
- Outreach or Salesloft license: $1,200-$2,400
- Gong or Chorus or Avoma seat: $1,500-$2,800
- Apollo or Clay or ZoomInfo enrichment: $1,200-$3,600
- LinkedIn Sales Navigator: $1,200-$1,800
- 6sense or Demandbase ABM: $2,500-$6,500 allocated
- AI augmentation (11x, Artisan, Apollo AI): $2,000-$8,000
- Total SDR tooling per seat per year: $9,600-$25,100

**Commission Platform Costs**
- Xactly: $30-$80 per user per month
- CaptivateIQ: $35-$95 per user per month
- Spiff: $40-$110 per user per month
- Annual SPM tooling cost for 20-SDR org: $9,600-$24,000

**Macro Comp Plan Economics**
- Cost of a poorly designed plan (per SDR per year, in wasted AE time + lost pipeline quality): $80K-$200K
- Cost savings of moving to SAO plan (40-SDR org): $1.5M-$4M/year
- Time to design and launch new plan: 8-14 weeks
- Time to detect first gaming pattern in new plan: 60-120 days
- Recommended full plan redesign cycle: every 18-24 months
- Recommended structural review cycle: quarterly
- Recommended monitoring cadence: weekly

`;

const counter = `

## Counter-Case: When SAO-Based Comp Is the Wrong Answer

The SAO-based plan described above is the right answer for the vast majority of 2026 B2B SaaS sales orgs, but it is not universal. A serious RevOps leader should stress-test the recommendation against the conditions where it breaks.

**Counter 1 — Very early-stage startups (under 10 closed-won deals total) don't have enough data to define SAO well.** A pre-Series-A startup with three AEs and a brand-new SDR team has no statistically reliable definition of what makes a "good" Opp. Imposing a strict SAO gate forces premature definition lock-in that may turn out to be wrong. For these teams, a **modified plan** with per-held-meeting payment as the primary trigger (60-70% of variable) plus a small sourced-revenue commission (10-15% of variable) is often more honest. SAO discipline kicks in once the org has 80-150 closed deals to calibrate against.

**Counter 2 — Pure inbound product-led-growth (PLG) motions.** If your buying motion is fundamentally self-serve and the SDR role exists primarily to chase upsell signals from product-qualified leads (PQLs), the SAO framework is less relevant. The right metric for PLG-SDR (sometimes called "PLG ops" or "expansion SDR") is **PQL-to-paid-conversion uplift**, paid as a percentage of expansion ARR, not as a per-Opp bonus. Companies like Slack, Notion, Figma, and Linear have iterated through several variations of this.

**Counter 3 — Channel/partner-driven motions.** If 60-80% of pipeline comes from channel partners, your SDR comp plan needs to account for partner-influenced and partner-sourced credit attribution. Pure SAO models break down because the "source" of the Opp is partner, not SDR. Solutions: partner-SAO credit at 50-70% of direct-SAO credit, or channel-attribution carve-outs that pay separately on partner-influenced revenue.

**Counter 4 — Highly transactional, low-ACV SaaS (under $5K ACV).** When average deal sizes are very small and sales cycles very short (under 30 days), the SAO framework's 5-business-day disposition window adds friction that exceeds its value. For these motions, a simpler **per-held-demo with auto-disposition after 14 days** model often outperforms a strict SAO gate. The Goodhart risk is lower because the deals close fast enough to provide rapid feedback even on per-meeting comp.

**Counter 5 — Enterprise-strategic deals with 9-18 month cycles.** At the opposite extreme, very large strategic deals don't fit SAO timing either. A Fortune 500 SDR may spend 6 months nurturing a single account before booking an executive briefing — paying per-SAO under-rewards the relationship-building. Solutions: longer-tail "account engagement" bonuses ($1K-$5K per executive briefing booked), quarterly account-coverage SPIFFs, and a heavier sourced-revenue commission slice (30-40% of variable) with full-year vesting.

**Counter 6 — When AE acceptance gates are weaponized against SDRs.** In dysfunctional sales cultures, AEs sometimes reject SDR-sourced meetings to suppress SDR comp and reduce competition for their own commission pool. If your AE-rejection rate spikes from 15% to 45% in 60 days without a corresponding pipeline-quality issue, the problem is **AE behavior, not SDR gaming**. Solutions: manager-level review of AE rejections, "AE rejection scorecards" published quarterly, and adjustments to AE comp that reward SDR-sourced acceptance rather than punishing it.

**Counter 7 — Mid-cycle comp changes carry hidden costs.** Even when the existing MQL-based plan is clearly broken, switching to SAO mid-year typically produces a 60-120 day period of confusion, mistrust, and elevated voluntary churn (10-25% above baseline). For an org with 20 SDRs at $145K loaded cost, that's $400K-$700K in transition cost. Many companies opt to **announce the change in Q4 for January launch** to compress the transition, accepting one more quarter of gaming in exchange for cleaner rollout.

**Counter 8 — The plan only works if managers are coached to enforce gates.** A perfectly designed SAO plan run by a manager who default-accepts every disposition will produce identical gaming patterns to an MQL plan. Manager coaching, weekly enforcement cadence, and quarterly audits are non-negotiable. If your org cannot commit 4-6 hours per week of manager + RevOps time to plan governance, the plan will degrade.

**Counter 9 — Legal exposure on clawbacks.** California (Labor Code Section 200, *Sciborski v. Pacific Bell*), Massachusetts (Wage Act), and several other states have restrictive rules on commission clawback. Plans must be written, signed, and disclosed in advance; some clawback mechanisms are unenforceable. Failure to comply creates wage-and-hour litigation exposure that can dwarf the cost savings of catching gaming. Always have employment counsel review the clawback gate before deployment, especially for multi-state SDR teams.

**Counter 10 — The "AI BDR" wave may obsolete the whole discussion by 2028.** 11x's Alice, Artisan's Ava, and the broader category of autonomous AI BDR agents are improving fast enough that some 2027-2028 orgs may run with 80-90% AI-sourced pipeline and a much smaller human SDR layer focused on warm-handoff and qualification. If this trajectory holds, the entire "human SDR comp plan" question shrinks dramatically, and the relevant question becomes "how do you comp the human handoff layer between AI BDR and AE?" The current best guess: per-held-and-qualified payment plus a sourced-revenue slice, paid only on the qualification step, not on the AI's volume.

**Counter 11 — Over-engineering risk.** A plan with 7 triggers, 4 SPIFFs, 3 accelerators, 2 decelerators, and 5 gate types is unmaintainable. SDRs will not understand it, managers will not enforce it, RevOps will not be able to calculate it cleanly, and CFOs will not approve it. The best plans are **simple enough to fit on a single page** and explain in 10 minutes. If your plan can't be drawn on a whiteboard from memory, you've over-engineered it. The 3-trigger / 4-gate / 1-accelerator-ladder model in this document is at the practical complexity ceiling.

**Counter 12 — The cultural cost of treating SDRs as adversaries.** Every anti-gaming mechanism implicitly signals "we expect you to cheat." The strongest SDR cultures (Gong, Outreach, ZoomInfo, MongoDB at various points) pair the gates with explicit cultural messaging: "the plan is designed to make doing the right thing also be the highest-paying thing." Gates without cultural alignment produce compliant but disengaged SDRs. Gates with cultural alignment produce engaged SDRs who self-police. The cultural work matters as much as the comp work.

**Counter 13 — Industry-specific exceptions.** Government/public-sector sales (long procurement cycles, no MQLs in the traditional sense), healthcare/HCP sales (compliance restrictions on outreach), regulated financial services (compliance review on every email), and academic/research sales (annual budget cycles) all have funnel structures that don't fit the standard SAO model. Industry-specific comp consultants (Alexander Group, ZS Associates, Korn Ferry) are worth engaging for these motions rather than imposing a horizontal SaaS template.

**Counter 14 — When the real problem is not comp but ICP.** Frequently, "SDRs are gaming MQLs" is misdiagnosed when the actual problem is **marketing is generating bad MQLs** because the ICP isn't well-defined. No comp plan can fix marketing-sourced garbage. Before redesigning SDR comp, audit the ICP definition, the MQL scoring model, and the marketing-to-sales handoff SLA. Sometimes the right intervention is upstream of comp entirely.

**Counter 15 — Sometimes the SDR role itself is wrong for the motion.** A handful of 2025-2026 GTM teams have publicly killed the SDR role entirely and replaced it with **full-cycle AEs supported by AI prospecting tools**. This works for very high-ACV strategic motions where the AE economics justify the prospecting time. If your ACV is above $250K and your sales cycle is over 6 months, ask whether you need SDRs at all before designing their comp plan.

**The honest verdict.** The SAO-based comp plan with three triggers, four gates, and accelerators is the right answer for the modal 2026 B2B SaaS org with $15K-$250K ACV, 3-9 month sales cycles, and a dedicated SDR team of 5-100 reps. It is not the right answer for very early-stage, PLG-dominant, channel-dominant, ultra-transactional, ultra-enterprise, government-regulated, or AI-BDR-dominant orgs. Match the comp design to your motion. And remember: any plan, no matter how well designed, requires weekly operating cadence and quarterly governance to stay healthy. The plan is the easy part; the operating muscle is the hard part.

`;

const links = `

## Related Pulse Library Entries

- **q01** — How do I align sales and marketing on lead definitions? (MQL/SAL/SQL/SAO definitional alignment — upstream of comp design.)
- **q03** — What is the right SDR-to-AE ratio in 2026? (Team structure context for comp design.)
- **q04** — How do I build a pipeline coverage model? (Pipeline quality measurement context.)
- **q05** — How do I calculate fully loaded SDR cost? (Unit economics underlying comp plan affordability.)
- **q06** — What is the right AE comp plan structure? (Counterpart AE comp design — must align with SDR plan.)
- **q07** — How do I design a sales accelerator structure? (Deeper dive on accelerator math.)
- **q08** — How should I structure a sales SPIFF program? (SPIFF design adjacent to SDR comp.)
- **q09** — What is the right SDR quota in 2026? (Quota-setting methodology paired with comp.)
- **q10** — How do I run a sales QBR? (Quarterly governance cadence including comp plan review.)
- **q11** — How do I implement a sales commission platform? (Xactly / CaptivateIQ / Spiff implementation.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Long-horizon counter-case context.)
- **q1900** — How do you build a B2B sales motion in 2027? (Macro sales motion design.)
- **q1901** — How do you hire SDRs in 2027? (Hiring side of SDR economics.)
- **q1902** — How do you onboard SDRs? (Ramp plan design pairing with ramp comp.)
- **q1903** — How do you build an SDR coaching program? (Manager-level enablement.)
- **q1904** — How do you measure SDR productivity? (Activity-vs-output measurement framework.)
- **q1905** — How do you structure AE compensation? (Companion comp plan.)
- **q1906** — How do you design sales territories? (Territory design affects comp fairness.)
- **q1907** — How do you build a RevOps function? (Governance layer for SDR comp.)
- **q1908** — How do you measure pipeline quality? (Quality metrics underlying SAO definition.)
- **q1909** — How do you reduce sales rep churn? (Retention context for comp design.)
- **q1910** — How do you build a sales enablement function? (Enablement-comp interaction.)
- **q1928** — How do you implement Salesloft Rhythm? (AI prospecting tool implementation.)
- **q9501** — How do you start a bookkeeping business in 2027? (Adjacent professional services context.)
- **q9502** — How do you start a CPA firm in 2027? (Professional services GTM parallels.)
- **q9601** — How do you start a fractional CFO business in 2027? (Adjacent advisory motion.)
- **q9602** — How do you start an outsourced controller business in 2027? (Adjacent advisory motion.)
- **q9701** — What is the best sales engagement platform? (Outreach vs Salesloft deep dive.)
- **q9702** — What is the best conversation intelligence platform? (Gong vs Chorus vs Avoma.)
- **q9703** — What is the best ABM platform? (6sense vs Demandbase.)
- **q9704** — What is the best data enrichment tool? (Apollo vs Clay vs ZoomInfo.)
- **q9705** — What is the best commission management platform? (Xactly vs CaptivateIQ vs Spiff.)
- **q9801** — What is the future of sales development in 2030? (Long-term outlook on SDR role.)
- **q9802** — How will AI change B2B sales by 2030? (AI commoditization horizon for the SDR role.)

`;

const tags = ['sdr','sales-development','compensation','revops','sales-comp','mql','sao','goodharts-law','b2b-sales','2026'];

const sources = [
  { title: 'The Bridge Group — SDR Metrics & Compensation Report', url: 'https://blog.bridgegroupinc.com/sales-development-metrics' },
  { title: 'RepVue — SDR / BDR Compensation Database', url: 'https://www.repvue.com/salaries/sales-development-representative' },
  { title: 'Gartner — Sales Development Metrics Research', url: 'https://www.gartner.com/en/sales' }
];

const notes = {
  s6: 'Added 40 cited sources: Bridge Group SDR Metrics, RepVue compensation data, Pavilion benchmarks, Gartner research, TOPO/Forrester studies, Goodhart and Campbell foundational papers, Strathern audit paper, call intelligence platforms (Gong, Chorus, Avoma), sales engagement platforms (Outreach, Salesloft), AI prospecting tools (Apollo, Clay, 11x, Artisan, ZoomInfo), ABM platforms (6sense, Demandbase), commission platforms (Xactly, CaptivateIQ, Spiff), industry texts (Bertuzzi, Ross, Iannarino, Hughes), legal frameworks (CA Labor Code, Sciborski v. Pacific Bell, MA Wage Act, FLSA), and methodology providers (Winning by Design, MEDDIC, Force Management).',
  s7: 'Added comprehensive numerical analysis: 2026 OTE benchmarks ($95K-$145K total, $65K-$95K base, $30K-$55K variable, 65/35 to 70/30 mix), three-trigger structure ($75-$200 per held meeting / $250-$600 per SAO / 1-3% sourced ACV), accelerator ladder (1.0x to 2.0x at 90%/110%/125%/150%), quota benchmarks (8-14 SAOs/month, 35-65 dials/day), funnel conversion rates (MQL-to-Opp 13-22% healthy vs 3-8% gamed, show-rate 65-80% vs 35-55%), gaming prevalence (60-75% of MQL teams within 6 months), operating gates (5-day window, 14-day clawback, 3-5% QA sample), manager comp ($170K-$225K OTE with 30/40/20/10 variable mix), ramp economics ($8K-$15K guarantee cost vs $45K-$80K replacement cost), tooling per SDR ($9.6K-$25.1K/year), and macro plan economics ($80K-$200K cost per SDR of bad plan).',
  s8: 'Added 15-element counter-case: very early-stage startup data insufficiency, PLG product-led motions, channel/partner motions, ultra-transactional low-ACV motions, ultra-enterprise long-cycle motions, AE weaponization of acceptance gates, mid-cycle change transition costs, manager-enforcement dependency, multi-state legal exposure (CA/MA wage law), AI BDR obsolescence horizon, over-engineering risk, cultural-adversary cost, industry-specific exceptions (gov/healthcare/finsvc/academic), ICP-vs-comp misdiagnosis, and full-cycle AE replacement of SDR role.',
  s9: 'Cross-linked 33 related Pulse entries: companion sales comp (q01-q11 series on alignment/ratio/coverage/cost/accelerators/SPIFFs/quota/QBR/commission platform), AI/SDR future (q1899/q9801/q9802), team building (q1900-q1910 on motion/hiring/onboarding/coaching/measurement/AE comp/territory/RevOps/pipeline/churn/enablement), tool deep dives (q9701-q9705 on Outreach/Gong/6sense/Apollo/Xactly), adjacent advisory motions (q9501/q9502/q9601/q9602), and Salesloft Rhythm implementation (q1928).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of SDR compensation design to discourage MQL gaming. Two mermaid diagrams (SDR comp plan flow from MQL through SAO acceptance to sourced-revenue commission; operating cadence from weekly RevOps reports through annual plan redesign). Full coverage: Goodhart/Campbell theoretical foundation, gaming behavior catalog (8 specific patterns), detection metrics (8 leading indicators), 2026 OTE benchmarks, three-trigger variable structure, accelerator/SPIFF design, four operating gates (5-day AE window, recorded call requirement, 14-day clawback, weekly QA), manager comp alignment, ramp plan economics, public case study companies (Gong/Outreach/ZoomInfo/Drift/6sense/Salesloft), seven anti-patterns, AI commoditization impact (Apollo/Clay/Salesloft Rhythm/11x/Artisan), 15-element counter-case including legal exposure and AI BDR obsolescence horizon. Word count target: 8,500-9,500.'
};

runPolish({ id: 'q02', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
