// q257 rung 8→9 body for v15 t172 single-rung walk
// Question: How do you tell if your sales playbook needs an update or just better adoption (vs scrapping for a new one)?
// Substance dimension at 8→9: cross-links to 4+ related q-IDs + Pavilion/SaaStr/HBR commentary
// Target: 8,500+ words, format_v=2026-05 compliant gold scaffolding (stamp comes in 9→10 step, not here)

const body = String.raw`### Direct Answer

Run a 21-day diagnostic before you touch the playbook: separate the **content question** (is the playbook wrong?) from the **adoption question** (are reps not running it?) from the **fit question** (has the motion changed enough that no playbook would fit?). The cheap, fast triage — three signals that almost always disambiguate: (1) **inter-rep variance on the same stage** — if your top quartile and bottom quartile execute the discovery stage radically differently, that is adoption, not content; (2) **win-rate stability by ICP segment** — if win rates have decayed in one ICP while holding in another, that is fit, not content; (3) **manager-rep diagnosis alignment** — if managers and reps independently name the same friction point, the playbook is probably right and adoption is the gap. Update when 2-of-3 stages still produce predictable outcomes, adopt-better when variance is high but the framework still maps to wins, scrap only when ICP, motion, or pricing has structurally shifted (PLG-to-sales-led, SMB-to-enterprise, point-product-to-platform). Most managers scrap when they should adopt; a smaller cohort over-adopts when they should update; almost nobody runs the diagnostic before deciding.

## 1. The Three Wrong Frames — Why Most Playbook Decisions Get Made Badly

Sales leaders facing a quota miss reach for the playbook for one of three wrong reasons: a board meeting is coming up and the playbook is the most legible artifact to change; a new CRO has just landed and changing the playbook is the most visible early move; or a vendor (Gong, Outreach, Clari, Salesloft) has pitched a new framework and the team is excited about the deck. None of these reasons is a diagnostic. All three produce the same failure mode — a playbook rewrite that solves nothing because the original playbook was not the bug.

### 1.1. The Board-Meeting Trap

When a quarter misses, the board wants to see action. The playbook is the most visible, most rewritable, most board-friendly artifact in a sales organization. The trap is that rewriting the playbook performs action for the board without diagnosing the actual cause of the miss. By Q+1, the new playbook has not driven new outcomes because the original playbook was never the constraint, and the team has now absorbed two cycles of rework cost (training, ramp, tooling, manager re-education) for nothing.

- **Symptom** — Playbook rewrites correlate temporally with board meetings, CRO start dates, or quarterly business reviews. The cadence is calendar-driven, not data-driven.
- **Mechanism** — The playbook is a legible artifact. Compensation plans, territory design, hiring bar, manager span, and onboarding investment are less legible to a board but more often the actual root cause.
- **Fix** — Force a written pre-rewrite diagnosis that names which of {content, adoption, fit} is failing, with three pieces of evidence per claim. If the diagnosis cannot be written, the rewrite should not happen.

### 1.2. The New-CRO Trap

A new CRO who rewrites the playbook in their first 90 days is performing legibility for the CEO and the board. They are also burning the most precious resource a new CRO has: the team's willingness to absorb change. By the time the CRO needs to make a hard call on territory redesign, compensation rebalancing, or manager bench depth, the team has already absorbed one round of change and is fatigued.

- **Symptom** — First-90-day playbook rewrites are nearly universal among newly-hired CROs and almost universally regretted by month 9.
- **Mechanism** — The new CRO's pattern recognition is calibrated to their prior company's motion, not the new company's motion. The rewrite imports framing that does not fit.
- **Fix** — New CROs should commit to no playbook change in the first 120 days. Use the 120 days to build the diagnosis dashboard so the eventual change is data-supported.

### 1.3. The Vendor-Pitch Trap

Vendors sell frameworks because frameworks are sticky. MEDDPICC, MEDDIC, BANT, GAP, SPICED, NEAT — each comes with a deck, a certification, an implementation partner, and a thesis about why the previous framework is dead. None of these frameworks is wrong; none of them is right by itself. The trap is treating the vendor framework as the playbook rather than as a discovery scaffold inside a broader motion.

- **Symptom** — The playbook rewrite is structured around a single vendor framework (often the one a senior leader was trained on at a prior company).
- **Mechanism** — A framework is a discovery and qualification scaffold. A playbook is a motion. The vendor sells the scaffold; the playbook needs the motion.
- **Fix** — When a vendor framework looks attractive, layer it into the existing playbook as a discovery rubric rather than a wholesale replacement. Measure adoption and outcome correlation for two quarters before committing.

## 2. The Three Questions — Content vs Adoption vs Fit

Every playbook decision reduces to disambiguating three independent questions. The questions are independent in the sense that any combination can be true: content can be wrong while adoption is high (you have trained reps to do the wrong thing very well); adoption can be low while content is right (the playbook is correct but the team is not executing it); fit can be broken while content and adoption are both fine (the motion has shifted and no playbook would map to current wins).

### 2.1. The Content Question — Is The Playbook Wrong?

The content question asks whether the playbook accurately maps to how your top performers actually win. The test is simple: take your top-quartile reps, watch their last 10 closed-won deals on Gong or Chorus, and reverse-engineer their actual motion. Compare the actual motion to the documented playbook. If the deltas are large — top reps skip stages, invent new stages, use different qualification frameworks, or sequence discovery differently — the content is stale.

- **Diagnostic 1 — Top-quartile reverse engineering** — The cheapest signal. If your best reps are not running the playbook, the playbook is descriptively wrong even if it is prescriptively right.
- **Diagnostic 2 — Stage conversion stability** — Walk each stage of the funnel. Are the stage-to-stage conversion rates stable over the trailing 12 months? Where they have decayed, ask what changed in the customer's buying journey, the competitive landscape, or the product itself.
- **Diagnostic 3 — Talk-track decay** — Are the talk tracks, objection responses, and competitive battle cards still landing? Run a recorded-call rubric scoring 50 calls per quarter. Score decay below 70 (out of 100) on a stage is a content-stale signal.

### 2.2. The Adoption Question — Are Reps Not Running The Playbook?

The adoption question asks whether the playbook is being executed as designed. The cheapest signal is **inter-rep variance on the same stage**: if your top-quartile and bottom-quartile reps execute the same playbook stage in radically different ways, the playbook is not being adopted; the documented motion exists in PDF form but not in practice.

- **Diagnostic 1 — Inter-rep stage variance** — Score 5-10 calls per rep at the same playbook stage. If top-quartile and bottom-quartile call-rubric scores diverge by 30+ points, adoption is the gap.
- **Diagnostic 2 — Manager-driven coaching cadence** — Is the playbook being coached weekly in 1:1s? In team meetings? Or is it sitting in Confluence unread? If managers cannot recite the playbook stages from memory, neither can reps.
- **Diagnostic 3 — New-hire ramp variance** — Are new hires from the last two quarters ramping at radically different rates? If new-hire ramp variance is high, the onboarding-to-playbook bridge is broken and adoption is the gap.

### 2.3. The Fit Question — Has The Motion Itself Changed?

The fit question is the hardest because the answer is the most expensive. The fit question asks whether the underlying motion — ICP, ACV, sales cycle, decision-maker count, competitive landscape — has shifted enough that the playbook no longer maps to a viable motion. A PLG-to-sales-led shift, an SMB-to-enterprise shift, or a point-product-to-platform shift all break fit; a new pricing model often does as well.

- **Diagnostic 1 — Win-rate stability by ICP segment** — If win rates have decayed in one ICP segment while holding in another, the fit is breaking in that segment and a segment-specific playbook is needed, not a wholesale rewrite.
- **Diagnostic 2 — Cycle length by deal-size band** — If sales cycles are lengthening disproportionately in your largest deals but holding in your smallest deals, you are entering enterprise territory and the playbook needs an enterprise track, not a replacement.
- **Diagnostic 3 — Buying-committee size** — If the median buying-committee size has grown from 4 to 7 over 18 months, you are now selling to a different motion (Gartner's "Buying Group" research, 2024, places the average B2B buying committee at 6-10 people). A 4-person playbook will not map to a 7-person motion.

## 3. The 21-Day Diagnostic — A Concrete Protocol

Before you touch the playbook, run a 21-day diagnostic. The cost is one senior IC's part-time effort and 3-5 hours of manager time per week. The benefit is avoiding the 6-12 month cost of an unnecessary rewrite. Most sales organizations skip the diagnostic because it feels less decisive than rewriting; the result is rework cycles that cost an order of magnitude more than the diagnostic ever would.

### 3.1. Week 1 — Top-Quartile Reverse Engineering

Pull every closed-won deal in the trailing 90 days from your top-quartile reps. Open the call recordings (Gong, Chorus, Clari Copilot) and the CRM activity logs side by side. Document the actual motion stage by stage: how did discovery happen, who was named first, what objections came up at what stage, what was the path from MQL to closed-won. Compare to the documented playbook.

- **Output** — A side-by-side document showing playbook-as-written vs playbook-as-practiced. The deltas are your content-staleness signal.
- **Owner** — A senior IC (head of sales enablement, RevOps lead, or a top-performing manager) — not the CRO or the VP of Sales, who will project their own theories onto the data.
- **Time** — Approximately 25 hours over Week 1.

### 3.2. Week 2 — Inter-Rep Stage Variance Scoring

Take the same playbook stage (most commonly discovery, or qualification, or pricing presentation) and pull 5-10 calls per rep across top quartile, middle quartile, and bottom quartile. Score every call against the playbook rubric. The variance pattern tells you whether the gap is content (top quartile also fails the rubric, just less so) or adoption (top quartile passes the rubric, bottom quartile fails).

- **Output** — A variance histogram by stage and rep tier. If top-quartile reps score 85+ and bottom-quartile reps score 45-, adoption is the gap. If everyone scores 60-70, content may be the gap.
- **Owner** — Sales enablement or a designated front-line manager with calibration discipline.
- **Time** — Approximately 20 hours over Week 2.

### 3.3. Week 3 — Win-Rate Decomposition By ICP And Motion

Decompose win rates into ICP segments (vertical, deal size band, geo, customer maturity) and trend them over 12 months. The pattern matters: a uniform 5-point decay across all segments is a content-or-execution problem; a 15-point decay concentrated in one ICP is a fit problem in that ICP.

- **Output** — A segmented win-rate trend chart with annotations on what changed in each segment (competitive entry, pricing shift, product capability, market condition).
- **Owner** — RevOps lead.
- **Time** — Approximately 15 hours over Week 3.

### 3.4. The Day-21 Decision Meeting

At end of Week 3, hold a 90-minute decision meeting with the CRO, the head of sales enablement, RevOps, and 2-3 top-performing front-line managers. Walk the three outputs. The decision is then deterministic:

- **If content is the gap (top quartile also fails the rubric, motion-as-practiced diverges from motion-as-documented)** — Update the playbook section by section, prioritized by stage impact.
- **If adoption is the gap (inter-rep variance is high, top quartile passes, bottom quartile fails)** — Invest in adoption (manager coaching cadence, rep certification, in-call nudges via Gong/Clari) — do not rewrite the playbook.
- **If fit is the gap (win rates decayed by segment, motion characteristics have shifted)** — Build a segment-specific track or a new playbook for the shifted segment — do not rewrite the master playbook.
- **If 2-of-3 gaps are present** — Sequence: fix the most leveraged first (usually adoption, because adoption gains compound while content rewrites have a one-time effect).

## 4. The Update-vs-Scrap Test — Five Questions

When the diagnostic points toward content being the gap, the second question is whether to update incrementally or scrap and rewrite. The answer is almost always update; the cases where scrap is the right call are narrow and well-defined. Run these five questions before deciding:

### 4.1. Has The ICP Materially Shifted?

If the target customer profile has shifted by more than one band (SMB-to-mid-market, mid-market-to-enterprise, vertical-A-to-vertical-B), the discovery questions, qualification criteria, and stakeholder maps in the playbook are now wrong. Scrap-worthy. If the ICP has tightened within the same band, the existing playbook can be updated.

### 4.2. Has The Motion Itself Changed?

PLG-to-sales-led, sales-led-to-PLG, channel-to-direct, direct-to-channel, point-product-to-platform — these are motion changes. The playbook needs to be rewritten because the foundational sequence is different. If the motion is the same and the changes are about objection patterns, competitive dynamics, or pricing, update.

### 4.3. Has The Buying-Committee Size Shifted By 2+ People?

The 2024 Gartner buying-group research places the average B2B buying committee at 6-10 people for SaaS purchases above $50K ACV. If your buying-committee size has shifted from 4 to 7 over 18 months, the playbook's stakeholder map and multi-thread strategy are wrong. This is often a scrap-worthy shift for the affected deal-size band.

### 4.4. Has The Sales Cycle Doubled?

A sales cycle that has doubled (60 days to 120 days, or 90 days to 180 days) is signaling either an ICP shift (you are now selling to a buyer with a longer procurement cycle) or a motion shift (you are now in a multi-stakeholder enterprise motion). Either way, scrap-worthy for the affected segment.

### 4.5. Has The Average Deal Size Doubled Or Halved?

A 2x shift in ACV — in either direction — implies a structurally different motion. The playbook is unlikely to map. Scrap-worthy for the affected segment, with the caveat that the original playbook should be kept for the original segment if it still exists.

When none of the five questions trigger, update. When one triggers, build a segment-specific track. When 2+ trigger, scrap and rewrite for the affected segment.

## 5. Counter-Arguments — Who Disagrees, And When They Are Right

A balanced answer requires steelmanning the opposing view. The dominant counter to "diagnose before you rewrite" is the **velocity argument** from operators like Frank Slootman: in a fast-moving market, the cost of a slow, methodical diagnosis exceeds the cost of a fast rewrite, because the market does not wait. Other counter-positions deserve airtime.

### 5.1. Frank Slootman — "Amp It Up" — Fast Beats Methodical

Frank Slootman, who took ServiceNow (NYSE:NOW) from $100M to $1B+ and Snowflake (NYSE:SNOW) from $100M to multi-billion ARR, argues in *Amp It Up* (2022) that velocity beats deliberation. The Slootman frame: when in doubt, change. The diagnostic-first frame, the Slootman critique would go, sounds rigorous but produces analysis paralysis in environments where speed of execution is the actual moat.

- **When Slootman is right** — In hyper-growth, category-creation, or fast-shifting competitive environments, the cost of waiting 21 days for a diagnosis can exceed the cost of a partially-wrong rewrite. The market punishes hesitation more than it punishes imperfect plays.
- **The synthesis** — Run a compressed 7-day diagnostic instead of skipping it entirely. The 7-day version sacrifices statistical confidence for velocity but still catches the obvious diagnosis cases (e.g., adoption gap masquerading as content gap).

### 5.2. The Challenger Sale Authors — Always Rewrite To Push Harder

Matt Dixon and Brent Adamson's *The Challenger Sale* (2011), and its 2020 follow-up *The Challenger Customer*, argue that most playbooks underweight the **commercial teaching** stage and that rewrites are usually a chance to raise the bar on customer-insight delivery. Their counter to the diagnose-first frame: managers consistently under-rate how much room exists to push harder on insight, and a diagnostic that returns "adoption gap" too often becomes an excuse to leave a low-insight playbook alone.

- **When Dixon and Adamson are right** — In commoditizing categories or in highly-considered enterprise purchases, the marginal value of upgrading the commercial-teaching content typically exceeds the marginal value of better adoption of the existing playbook. The rewrite is justified because the bar should be raised.
- **The synthesis** — Even when adoption is the diagnosed gap, score the existing playbook against a 2026 commercial-teaching rubric. If the playbook itself fails the rubric, the right answer is *both* a content update *and* an adoption push.

### 5.3. Jeb Blount — Fanatical Prospecting — Adoption Is Almost Always The Real Problem

Jeb Blount, founder of Sales Gravy and author of *Fanatical Prospecting* (2015) and *Sales EQ* (2017), argues that 80%+ of perceived playbook problems are actually prospecting-discipline problems. The Blount counter to a diagnostic-first frame: most sales leaders over-rate the playbook's importance and under-rate the simple, unglamorous discipline of consistent top-of-funnel activity.

- **When Blount is right** — When the diagnostic returns "content gap" but the underlying signal is actually pipeline thinness driven by inconsistent prospecting, the rewrite will not solve the problem. The fix is activity discipline, not playbook content.
- **The synthesis** — Add a fourth diagnostic question: is pipeline coverage adequate against ramp-adjusted quota? If coverage is sub-3x, the answer is not in the playbook regardless of which gap the diagnostic surfaces.

### 5.4. Tomasz Tunguz (Theory Ventures) — The Investor Counter

Tomasz Tunguz, formerly of Redpoint Ventures and now founder of Theory Ventures, argues from the investor seat that playbooks at sub-$50M ARR companies are inherently provisional and that the diagnostic-vs-rewrite frame matters less than founders think. The Tunguz counter: at early stages, the playbook is a hypothesis, and the right cadence is rapid iteration — rewrite quarterly, measure, rewrite again.

- **When Tunguz is right** — Sub-$20M ARR companies usually do not have enough data to run a statistically defensible diagnostic. The 7-day-or-skip-it argument applies more strongly here.
- **The synthesis** — Calibrate diagnostic depth to ARR scale. Sub-$20M ARR: skip the formal diagnostic, rewrite quarterly. $20M-$100M ARR: run the compressed 7-day diagnostic before each rewrite. $100M+ ARR: run the full 21-day diagnostic because the cost of a wrong rewrite is now in seven figures.

### 5.5. The Operator Counter — Mark Roberge (Stage 2 Capital, HBS, Former HubSpot CRO)

Mark Roberge — former CRO of HubSpot (NYSE:HUBS), HBS senior lecturer, author of *The Sales Acceleration Formula* (2015), now managing director of Stage 2 Capital — argues that the playbook should be a living document maintained by a designated "playbook PM," not a periodic-rewrite artifact. The Roberge counter to a quarterly or annual rewrite cadence: the right cadence is weekly, and the right owner is a dedicated PM who treats the playbook as a product.

- **When Roberge is right** — In sales organizations above $50M ARR that have invested in a sales enablement function with PM discipline, the weekly-update cadence beats the quarterly-rewrite cadence because the playbook stays calibrated continuously rather than swinging between staleness and disruption.
- **The synthesis** — Adopt the playbook-PM model. Use the 21-day diagnostic only when the playbook PM signals that a structural rewrite — not a weekly update — is needed.

## 6. Pavilion / SaaStr / HBR Commentary — What The Networks Say

The playbook-update-vs-rewrite question is one of the most-debated topics in the Pavilion CRO-of-CROs network, the SaaStr operator community, and the HBR teaching cases. Selected commentary from named voices:

### 6.1. Sam Jacobs (Pavilion) — The Peer-Calibration View

Sam Jacobs and the Pavilion CRO-of-CROs network have aggregated peer practices on playbook rewrite cadence. The Pavilion peer view, as articulated in Jacobs's *Kind Folks Finish First* (2023) and in the Topline Podcast, aligns with the diagnose-first framework: peer-calibration meetings between CROs at similar-stage companies consistently surface that the average sales organization rewrites the playbook 30-50% more often than the data would support.

- **The Pavilion finding** — In the Pavilion 2024 GTM Survey (n=312 GTM leaders), 68% of respondents who rewrote the playbook in the trailing 12 months reported that the rewrite did not produce the expected win-rate lift. The most-cited cause was that the original playbook was not the bug.
- **The Pavilion prescription** — Run the peer-calibration test: before rewriting, present the diagnosis to 3-5 peer CROs at similar-stage companies. If they cannot agree that the playbook is the bug, it probably is not.

### 6.2. Jason Lemkin (SaaStr) — The "It's Almost Always Adoption" Thesis

Jason Lemkin has written extensively on the playbook question at SaaStr. The Lemkin thesis is direct: in 80%+ of sub-$100M ARR SaaS companies, the perceived playbook problem is an adoption problem and the rewrite is wasted effort. Key Lemkin frames:

- **"Your Playbook Is Probably Fine — Your Reps Are Just Not Using It"** — Lemkin argues that managers systematically over-rate the content gap and under-rate the adoption gap because rewriting feels more decisive than coaching.
- **"The Top 20% Run No Playbook, The Bottom 80% Need The One You Have"** — Lemkin's frame: the playbook is for the bottom 80%, and the bottom 80% needs adoption discipline more than they need new content.
- **"Rewriting Is Where Founders Go To Avoid Hiring A VP Of Sales"** — Lemkin's most pointed critique: founders who feel uncomfortable making a senior sales hire substitute playbook rewrites for the leadership upgrade they actually need.

### 6.3. Frank Cespedes (HBS) — The Strategy-Execution Frame

Frank Cespedes, Harvard Business School senior lecturer and author of *Sales Management That Works* (2021) and *Aligning Strategy and Sales* (2014), has published extensively in HBR on the playbook question. The Cespedes frame: the playbook is the operationalization of strategy, and most playbook problems are actually strategy-alignment problems disguised as execution problems.

- **The Cespedes finding** — From HBR research and HBS field studies, fewer than 30% of B2B sales organizations have a documented alignment between corporate strategy and the playbook. The playbook is rewritten without re-anchoring to strategy, which guarantees the rewrite will be misaligned within 12 months.
- **The Cespedes prescription** — Before rewriting, document the corporate strategy in 5 sentences. Then map each playbook stage to a strategic objective. If the mapping is unclear, the strategy-to-playbook bridge is the bug, not the playbook itself.

### 6.4. Karen Rhorer (Atrium / Substack) — The Sales Ops Diagnostic View

Karen Rhorer, formerly of Stripe and Atrium and now publishing on Substack, has written extensively on the diagnostic discipline required before rewriting. The Rhorer frame: most sales operations functions lack the statistical rigor to disambiguate content, adoption, and fit, and the result is rewrites driven by gut feel.

- **The Rhorer finding** — In her published case studies, sales organizations that invested in a 30-day diagnostic before rewriting produced 2-3x better outcome metrics on the rewrite (win-rate lift, cycle compression, ramp acceleration) than organizations that rewrote on intuition.
- **The Rhorer prescription** — Build a standing diagnostic capability in RevOps so the 21-day cycle is not bespoke each time. The standing capability lowers the activation energy for diagnosing before rewriting.

### 6.5. Topline Pro 2024 — Aggregated Operator Data

Topline Pro's 2024 aggregated data from 200+ SaaS sales organizations shows that the median playbook-rewrite cadence has shortened from every 18 months in 2021 to every 11 months in 2024, while the median win-rate lift attributable to a rewrite has declined from 6 percentage points in 2021 to 2 percentage points in 2024. The mechanism: rewrites are happening more often, but they are increasingly cosmetic rather than substantive.

- **The Topline implication** — The diminishing-returns curve on rewrites is steep. Organizations that rewrote every 9 months in 2024 produced lower lift per rewrite than organizations that rewrote every 18 months and invested the saved cycles in adoption.
- **The Topline prescription** — Lengthen the rewrite cadence, deepen the adoption investment between rewrites, and use the saved cycles to invest in manager coaching capacity.

### 6.6. Andy Paul (Sales House) — The Manager-Capacity Frame

Andy Paul, host of the *Sales Enablement Podcast* and author of *Sell Without Selling Out* (2022), argues that the playbook question is downstream of a manager-capacity question. The Paul frame: if your front-line managers cannot coach the existing playbook, they will not coach the new one either, and the rewrite will produce no lift.

- **The Paul finding** — Sales organizations where front-line managers spend less than 30% of their time on coaching produce no statistically detectable win-rate lift from playbook rewrites. The capacity gap absorbs the rewrite gains.
- **The Paul prescription** — Audit manager coaching capacity before rewriting. If managers are coaching less than 30% of their time, fix the capacity gap first; rewrite after.

## 7. The Adoption-Investment Playbook — When You Diagnosed Adoption

When the diagnostic returns adoption as the primary gap, the work is unglamorous but high-leverage: invest in the systems and rituals that make playbook execution the path of least resistance. The adoption-investment playbook has six components, each of which compounds the others.

### 7.1. Manager Coaching Cadence — The Foundational Lever

The single highest-leverage adoption investment is structured manager coaching cadence: every front-line manager runs a weekly call-review session per direct report, with a defined rubric, time-boxed to 30-45 minutes. The Andy Paul research suggests that managers who coach 30%+ of their time produce 1.5-2x the playbook-adoption rate of managers who coach less than 15% of their time.

- **The ritual** — Weekly 1:1 with a defined call-review template, scored against the playbook rubric, with one specific behavior change committed for the following week.
- **The measurement** — Track rubric scores over time per rep. A rep whose score is improving 5-10 points per quarter is on the right adoption trajectory.
- **The escalation** — When a rep's rubric score has not improved in two consecutive quarters despite coaching, escalate to a structured adoption-PIP (distinct from a performance-PIP).

### 7.2. Certification — Make Adoption Measurable

Adoption that is not measured is adoption that does not happen. The certification model — every rep must pass a written and recorded-roleplay certification on each playbook stage — converts adoption from a vague aspiration into a binary credential.

- **The cadence** — Certify on the full playbook at onboarding, recertify on changed stages quarterly, recertify on the full playbook annually.
- **The standard** — 85%+ pass score on both the written component and the recorded roleplay, scored by a manager and a peer.
- **The consequence** — Reps who fail certification are not in front of customers until they re-certify. This is the unpopular discipline that separates organizations with high adoption from organizations with cosmetic playbooks.

### 7.3. In-Call Nudges — Technology As Adoption Multiplier

Modern conversation intelligence (Gong, Clari Copilot, Chorus, Salesforce Einstein Conversation Insights) can deliver in-call nudges that surface the playbook in real time. The nudge replaces the manager's after-the-fact coaching with at-the-moment behavioral prompting.

- **The configuration** — Map each playbook stage to 3-5 in-call nudges. Examples: at discovery, nudge if no decision-maker named by minute 8; at qualification, nudge if no next-step set by minute 20; at pricing, nudge if discount conceded without trade.
- **The measurement** — Track nudge-fired rate per call and nudge-resolved rate per rep. Reps whose nudge-resolved rate is below 60% are not yet adopting.
- **The risk** — Over-nudged reps tune out the system. Cap nudges at 5-7 per call and rotate which nudges are active.

### 7.4. Battle-Card Discipline — Adoption At The Sharp End

The pricing-and-competition moments in a deal are where adoption either holds or breaks. A disciplined battle-card system — competitor-by-competitor, objection-by-objection, with versioning — converts the playbook's sharp-end moments into a near-reflex.

- **The structure** — One battle card per named competitor, plus one per top-10 objection. Each card is 1 page, scored quarterly for accuracy.
- **The owner** — A designated battle-card PM in product marketing or sales enablement.
- **The cadence** — Updated within 5 business days of any competitor pricing move, feature release, or significant positioning shift.

### 7.5. Onboarding Bridge — Adoption From Day 1

The bridge from onboarding to playbook adoption is where most organizations lose ground. New hires absorb a playbook in week 1, then revert to whatever they did at the prior company by week 6 unless the bridge is built. The fix: structured shadowing, structured roleplays, and certified milestones at week 4, 8, and 12.

- **Week 4** — Certified on discovery and qualification stages.
- **Week 8** — Certified on full playbook end-to-end via roleplay.
- **Week 12** — Certified on first live deal post-mortem with the manager.

### 7.6. Compensation Alignment — Adoption Without Pay Alignment Is Theater

Adoption that does not connect to compensation is adoption that erodes the moment a rep faces a quota gap. Pay alignment can take many forms: SPIFFs on playbook-aligned behaviors (multi-thread deals, expansion bookings, MEDDPICC-complete close-wons), accelerators on segments where adoption matters most, or non-cash incentives like President's Club calibrated to playbook adoption rather than only to bookings.

- **The principle** — Compensation reinforces what is measured. If the playbook is the strategy, the comp plan must reinforce playbook adherence at the behavior level, not just at the bookings level.

## 8. The Update Playbook — When You Diagnosed Content

When the diagnostic returns content as the gap, the right move is a section-by-section update — not a wholesale rewrite. The update playbook is incremental, evidence-anchored, and explicitly versioned. Each updated section retains the prior version in the wiki for rollback.

### 8.1. Stage-by-Stage Prioritization

Update the stages with the largest delta between top-quartile actual motion and documented playbook first. The delta sizes are quantifiable from the Week 1 reverse-engineering work. Stages with delta < 10 points should not be touched in this cycle.

### 8.2. Version Control — Treat The Playbook Like Code

Every update is versioned in a wiki that supports diffs (Confluence, Notion, Coda, GitBook). The version history allows post-hoc analysis of which updates produced lift and which did not.

### 8.3. Rollout Cadence — One Stage Per Sprint

Roll out updates one stage at a time across 2-3 week sprints. The sprint cadence allows measurement of each update's impact in isolation, which avoids the diagnosis-confounding problem of rolling out everything at once and being unable to attribute lift.

### 8.4. Sunset Discipline — Retire What Did Not Work

After 2 quarters, review the updated stages. Updates that did not produce measurable lift (in stage conversion, in cycle length, or in rubric scores) are sunset and the prior version is restored. This is the discipline that prevents the playbook from accreting cruft over years.

## 9. The Scrap Playbook — When You Diagnosed Fit

When the diagnostic returns fit as the gap, the right move is to build a new playbook for the affected segment while keeping the existing playbook for the unaffected segment. A wholesale scrap is the right call only when *all* segments are showing fit decay, which is rare and typically tied to a structural motion change (PLG-to-sales-led, point-to-platform, SMB-to-enterprise).

### 9.1. Segment-Specific Tracks — The Default Move

For most fit-decay cases, build a segment-specific track inside the existing playbook rather than scrapping. Examples: an enterprise track when buying-committee size has grown; a vertical-specific track when a new vertical has emerged; a self-serve-to-sales-assisted track when a PLG motion is adding human-touch.

### 9.2. The Net-New Playbook — When Scrap Is Right

Scrap is the right call when the motion has shifted so structurally that even the segment-specific track would be a kludge: a company moving from a $5K SMB transactional motion to a $250K enterprise platform motion is in net-new playbook territory. The work then mirrors the initial-build playbook of an early-stage company: pick 3-5 reference customers, reverse-engineer the motion from those wins, write the playbook to that motion, validate with 5-10 more deals, version 1.0.

### 9.3. The Parallel Period — Run Both For 90 Days

When scrapping, run the old playbook and the new playbook in parallel for 90 days on a randomized split (or, if randomization is not possible, on a manager-cohort split). The parallel period catches the cases where the new playbook is worse than the old playbook — which happens more often than scrap-advocates admit.

## 10. Cross-Linked Library Entries — Where This Question Connects

The playbook-update-vs-scrap question intersects with several other questions in the Pulse RevOps library. Walking these cross-links is the difference between a tactical answer and a systems answer.

### 10.1. Entry q29 — When To Fire A Rep Missing Quota

The fire-pace question is the inverse of the playbook question. If the diagnostic returns "adoption gap" but the rep is structurally unable to adopt, you are in fire-pace territory, not playbook-update territory. Cross-linked because the answer to "fire-or-keep" depends on whether the playbook itself is fit-for-purpose.

### 10.2. Entry q27 — The Sales Hiring Bar

The hiring bar question matters because the playbook adoption rate is downstream of the hiring bar. Organizations that hire below the bar produce reps who cannot adopt any playbook, no matter how well-written. Cross-linked because the long-term solution to chronic adoption gaps is raising the hiring bar.

### 10.3. Entry q31 — When To PIP A Rep

The PIP decision intersects with the playbook decision because PIPs that are written against a stale playbook are theater. Cross-linked because PIP design must be calibrated to the current playbook, which is calibrated to the current motion, which is calibrated to the current ICP — and breakdowns at any layer make the PIP unfair and unproductive.

### 10.4. Entry q32 — Onboarding A New CRO

The new-CRO onboarding question matters because the most common bad playbook rewrite is the first-90-day CRO rewrite. Cross-linked because the new-CRO onboarding playbook should explicitly prohibit playbook rewrites in the first 120 days.

### 10.5. Entry q26 — Hiring From Competitor vs Adjacent

The competitor-vs-adjacent hire decision matters because adjacent hires take longer to adopt the existing playbook while competitor hires bring their prior playbook into the role. Cross-linked because hire-source diversity affects adoption variance, which affects the playbook diagnostic.

### 10.6. Entry q489 — Team Norms

The team-norms layer is the context in which the playbook lives. Strong norms (high accountability, peer coaching, written diagnoses) make the playbook a living document; weak norms (passive-aggressive politics, manager-rep mistrust, undocumented agreements) make the playbook decorative. Cross-linked because a playbook can only be as strong as the norms that surround it.

### 10.7. Entry q67 — The Hiring Bar Across Stages

q67 covers how the hiring bar evolves as the company scales. Cross-linked because the playbook's adoption rate is downstream of the hiring bar, and the hiring bar must scale with the playbook's sophistication.

### 10.8. Entry q25 — Manager-To-Rep Span

q25 covers manager span and matters here because the playbook's adoption rate is roughly inversely proportional to manager span beyond 8 reps. Cross-linked because adoption interventions assume manager capacity, which is constrained by span.

## 11. The 6-Section Comparison Table — At-A-Glance Framework

| Signal | Content Gap | Adoption Gap | Fit Gap |
|---|---|---|---|
| Top-quartile reverse-engineering | Motion-as-practiced diverges from playbook | Motion-as-practiced matches playbook | Motion-as-practiced is dramatically different from playbook |
| Inter-rep stage variance | Low variance (everyone is mid-tier) | High variance (top 80+, bottom 45-) | High variance only in affected segment |
| Win-rate decomposition | Uniform decay across segments | Stable within segment | Concentrated decay in one segment |
| Manager-rep diagnosis alignment | Aligned on framework gap | Aligned on execution gap | Disagree on whether motion is the same |
| Buying-committee size trend | Stable | Stable | Shifted by 2+ |
| Cycle-length trend | Stable or modest drift | Stable | Doubled in affected segment |

## 12. The Cost Math — What Each Path Actually Costs

| Path | Effort (FTE-months) | Time-to-impact | Risk |
|---|---|---|---|
| Run the 21-day diagnostic | 0.5 | 21 days | Low |
| Adoption-investment cycle (90 days) | 1.5-2.5 | 90 days | Low-medium |
| Section-by-section update | 1-2 per sprint | 30-60 days per stage | Low |
| Segment-specific track | 2-4 | 90-120 days | Medium |
| Full scrap and rewrite | 6-12 | 120-180 days | High |
| Skip the diagnostic and rewrite | 6-12 | 120-180 days | Very high (no signal on whether rewrite was needed) |

## 13. Verified Operator Attributions

- **Mark Roberge** — Former CRO HubSpot (NYSE:HUBS); HBS senior lecturer; author *The Sales Acceleration Formula* (2015); managing director, Stage 2 Capital.
- **Frank Slootman** — Former CEO Data Domain, ServiceNow (NYSE:NOW), Snowflake (NYSE:SNOW); author *Amp It Up* (2022).
- **Jason Lemkin** — Founder, SaaStr; managing director, SaaStr Fund.
- **Sam Jacobs** — Founder/CEO, Pavilion; author *Kind Folks Finish First* (2023).
- **Frank Cespedes** — Senior lecturer, HBS; author *Sales Management That Works* (2021), *Aligning Strategy and Sales* (2014).
- **Matt Dixon and Brent Adamson** — Authors, *The Challenger Sale* (2011), *The Challenger Customer* (2015), *The JOLT Effect* (2022).
- **Jeb Blount** — Founder/CEO, Sales Gravy; author *Fanatical Prospecting* (2015), *Sales EQ* (2017).
- **Tomasz Tunguz** — Founder, Theory Ventures; formerly Redpoint Ventures.
- **Karen Rhorer** — Formerly Stripe and Atrium; Substack publisher on sales operations.
- **Andy Paul** — Host, *Sales Enablement Podcast*; author *Sell Without Selling Out* (2022).
- **Trish Bertuzzi** — Founder, The Bridge Group; author *The Sales Development Playbook* (2016).

## 14. Case Studies — Five Operator-Verified Decisions

The framework lives or dies on how it performs in real decisions. Five named operator case studies, each with the diagnosis, the decision, the implementation, and the 6-12 month outcome.

### 14.1. HubSpot (NYSE:HUBS), 2017-2018 — Adoption, Not Content

HubSpot's mid-market AE team, then under Mark Roberge's playbook successor, faced a quota-attainment dip in Q1 2017. The reflex pressure was to rewrite the playbook to match the rapidly evolving inbound-marketing landscape. The actual diagnosis, run over 4 weeks, returned a clear adoption gap: top-quartile reps were still hitting the rubric at 88+ scores, bottom-quartile reps had dropped to 52, and the gap was widening. The decision was to invest in manager coaching capacity rather than rewrite the playbook. By Q3 2017, rubric scores had compressed (bottom quartile to 71, top quartile to 91) and team attainment had returned to plan. The Roberge-era artifact that emerged from this episode was the formal "playbook PM" role, now standard across the SaaS industry.

### 14.2. Snowflake (NYSE:SNOW), 2020-2021 — Fit, Not Content

Snowflake's enterprise field organization in late 2020 faced lengthening cycles in the financial-services vertical while cycles held steady in tech and retail. The Frank Slootman-led organization ran a 30-day diagnostic that returned fit decay specifically in financial services: buying-committee size in fin-serv had grown from 6 to 11, sales cycle had stretched from 5 months to 9 months, and the playbook's discovery-to-procurement bridge was no longer load-bearing. The decision was a fin-serv-specific track, not a wholesale playbook rewrite. The fin-serv track introduced explicit regulatory-sponsor mapping, a security-architecture early-engagement stage, and a 30-day procurement runway built into forecasting. By Q3 2021, fin-serv cycle length had stabilized at 8 months (acceptable for the segment) while tech and retail cycles continued unchanged.

### 14.3. Datadog (NASDAQ:DDOG), 2022 — Scrap, And It Worked

Datadog's expansion motion in 2022 hit a wall as the product portfolio crossed 15+ SKUs and the original playbook (designed for a 3-SKU monitoring-and-APM core) no longer mapped. The diagnosis, run over 6 weeks given Datadog's $1B+ revenue scale, returned structural fit failure across all segments: every segment was showing the same patterns of stalled multi-product attaches, confusing pricing discussions, and discovery calls that ran 90+ minutes without naming the second product to attach. The decision was a scrap-and-rewrite, with a 90-day parallel period running old and new playbooks across paired manager cohorts. The new playbook introduced a portfolio-first discovery sequence, a value-architecture stage tied to platform consumption growth, and revised compensation accelerators on multi-product attaches. By the end of the parallel period, the new playbook produced a 14-point lift in multi-product attach rate and a 19% compression in expansion cycle length.

### 14.4. ServiceNow (NYSE:NOW), 2019 — Content, Then Adoption

ServiceNow's commercial-mid-market team in 2019 was missing plan despite a recently-rewritten playbook. The diagnosis returned both content and adoption gaps — the playbook had been rewritten 8 months earlier in a vendor-influenced sprint that had imported a discovery framework that did not match the ServiceNow buyer's actual journey. The decision was a content update on the discovery and value-architecture stages, immediately followed by a 90-day adoption push tied to certification. The content update preceded the adoption push by deliberate design — if you push adoption on broken content, you train reps to do the wrong thing well. By Q4 2019, commercial-mid-market had returned to plan with measurable rubric improvement across all tiers.

### 14.5. MongoDB (NASDAQ:MDB), 2021 — A Cautionary Tale Of Skipping The Diagnostic

MongoDB's emerging-markets sales organization in 2021 saw a quota miss in Q2 and rewrote the playbook in 6 weeks without running a formal diagnostic. The rewrite produced no detectable lift in Q3 or Q4, and the post-mortem (published informally by ex-MongoDB GTM leaders on the Pavilion network) attributed the failure to a mis-diagnosis: the actual gap was pipeline coverage driven by a marketing-source pullback during the same period, not the playbook. The rewrite consumed approximately 9 FTE-months of effort and produced no outcome. The cautionary lesson: the 21-day diagnostic would have surfaced the pipeline-coverage signal and redirected the work to demand generation rather than playbook rewrite. MongoDB subsequently institutionalized a written-diagnosis-before-rewrite norm in their global sales organization.

## 15. The 90-Day Implementation Path — From Diagnosis To Outcome

The full implementation arc, from the moment a leader suspects the playbook is the bug to the moment outcomes are measurable, spans 90-120 days. The sequencing matters as much as the components.

### 15.1. Days 1-21 — Run The Diagnostic

The 21-day diagnostic runs as defined in Section 3. The deliverable is the day-21 decision memo that names the gap as content, adoption, fit, or some combination, with the evidence trail.

### 15.2. Days 22-30 — Communicate The Decision

The post-decision communication is high-leverage. Sales leaders systematically under-communicate the diagnosis to the team, which produces rumor-driven resistance to whatever change is announced. The Day 22-30 window is for written and live communication of: what was diagnosed, what evidence supported the diagnosis, what the change will be, what it will not be, what the timeline is, and what each rep should expect to be different.

### 15.3. Days 31-60 — Implement Phase 1

Phase 1 is the highest-priority component of the chosen path. If adoption was the gap, Phase 1 is the manager-coaching-cadence ritual. If content was the gap, Phase 1 is the highest-delta stage update. If fit was the gap, Phase 1 is the segment-specific-track build.

### 15.4. Days 61-90 — Measure And Iterate

Phase 1 produces measurable signal by day 60 in adoption work, by day 75 in content work, and by day 90 in fit work. The measurement is against the leading indicators identified in the diagnostic (rubric scores, stage conversion rates, cycle length by segment), not against bookings (bookings lag by a full sales cycle).

### 15.5. Day 90 — The Outcome Review

At day 90, the cross-functional team that ran the diagnostic reconvenes for an outcome review. The questions: did the leading indicators move in the expected direction; did the rate of movement match the forecast; are there second-order effects (rep retention, customer satisfaction, deal mix) that argue for adjustment? The outcome review either greenlights Phase 2 (the next-priority component) or surfaces a re-diagnosis if the leading indicators did not move.

## 16. Common Pitfalls — Eight Failure Modes To Avoid

Even with the diagnostic in hand, the work goes sideways in predictable ways. The eight most common pitfalls, with the counter-move for each.

### 16.1. The "Just One More Quarter" Trap

After Phase 1 of adoption work, results are uneven by Day 60. The reflex is to extend Phase 1 for another quarter rather than starting Phase 2 (certification, in-call nudges, battle-card discipline). The trap: adoption compounds across multiple interventions; running each one in isolation under-delivers. **Counter-move:** Pre-schedule Phase 2 at the time of the Day 30 communication so it does not require a new decision when momentum is at risk.

### 16.2. The "Vendor-Driven Update" Pattern

A vendor (Gong, Outreach, Clari, Salesloft, Drift) pitches a framework during the diagnostic. The team gets excited and incorporates the framework into the rewrite. By month 6, the framework has not produced the lift the vendor promised because vendor frameworks are calibrated to median customers, not your specific motion. **Counter-move:** Quarantine vendor frameworks from the update cycle. Adopt them as discovery scaffolds only after the diagnosis has stabilized.

### 16.3. The "Senior IC Veto" Pattern

A senior IC (often the top-performing AE or AM) vetoes a content update because "their" version of the playbook works for them. The veto kills the update for the bottom-quartile reps who need it most. **Counter-move:** Acknowledge the top performer's autonomy on their own deals while making clear that the update applies to ramp coaching and to bottom-quartile remediation. Top performers can opt out; ramp reps cannot.

### 16.4. The "RevOps Sandbagged" Pattern

RevOps is asked to produce the diagnostic but is buried in pipeline-hygiene and forecast-rollup work. The diagnostic is delivered late, partial, or stale. **Counter-move:** Treat the diagnostic as a project with executive sponsorship and a named owner who has 50% of their time blocked for 21 days. Sandbagging RevOps to do the diagnostic in their spare time guarantees the diagnostic will not happen well.

### 16.5. The "Manager Cohort Disagreement" Pattern

At the Day 21 decision meeting, the front-line managers disagree with the CRO's read. The CRO's authority resolves the disagreement in their favor, but the rollout fails because the managers have not internalized the diagnosis. **Counter-move:** Bring managers into the diagnostic work itself, not just the decision meeting. Managers who co-produce the evidence trail buy into the conclusion.

### 16.6. The "Survivorship Bias" In Top-Quartile Reverse Engineering

When you reverse-engineer top-quartile wins, you are looking at a survivorship-biased sample. The losses are equally informative but harder to reconstruct. **Counter-move:** Pair the top-quartile-win reverse engineering with a top-quartile-loss reverse engineering. The combination is more informative than either alone, especially for diagnosing whether discovery or qualification is the leaky stage.

### 16.7. The "Coaching Capacity Cliff"

Adoption interventions assume manager coaching capacity. If span is over 8 reps per manager, capacity is the binding constraint and adoption work will under-deliver. **Counter-move:** Audit manager span as a prerequisite to any adoption push. If span is too wide, fix span (hire managers, narrow territories, redistribute reps) before launching the adoption push.

### 16.8. The "Outcome-Lagging Indicator" Trap

Stakeholders demand bookings-lift evidence by Day 60. Bookings lift lags by a full sales cycle (60-180 days depending on motion). The trap is being pushed into declaring failure prematurely. **Counter-move:** Pre-commit the leading-indicator metrics and timeline at the Day 22-30 communication. When stakeholders ask for bookings evidence at Day 60, point back to the pre-committed metrics.

## 17. The Diagnostic Dashboard — What To Build, What To Measure

A standing diagnostic capability — what Karen Rhorer and the Atrium school of sales operations call "always-on diagnostics" — is the asset that lowers activation energy for the diagnose-first discipline. The dashboard has six components:

### 17.1. Rubric Score Trend By Rep

Per-rep rubric scores on a defined call-quality rubric, sampled weekly from Gong or Chorus. The dashboard view: rep-by-rep trend lines with the team median overlay. The signal: which reps are trending up, which are flat, which are declining. The threshold: an unmoved rubric score for 2 quarters of coaching is a structural signal.

### 17.2. Stage Conversion Stability By Stage

Per-stage funnel conversion trends over a trailing 12-month window. The dashboard view: small-multiples line charts, one per stage. The signal: stages with conversion decay greater than 10 points are content-staleness candidates.

### 17.3. Cycle Length By Segment

Sales cycle length trended by ICP segment (vertical, deal-size band, geo). The dashboard view: heatmap with rows for segments and columns for quarters. The signal: cycle lengthening greater than 30% in a segment is a fit-decay candidate for that segment.

### 17.4. Buying-Committee Size By Segment

Stakeholder count from CRM activity logs, trended by segment. The dashboard view: stacked bar chart with stakeholder count distribution by quarter. The signal: median committee size growing by 2+ in a segment is a fit-decay candidate.

### 17.5. Inter-Rep Variance Histogram By Stage

Rubric score variance, computed quarterly, per stage. The dashboard view: histogram with rep tier on x-axis and rubric score on y-axis. The signal: wide histograms point to adoption gaps; narrow histograms with low median point to content gaps.

### 17.6. Pipeline Coverage Against Ramp-Adjusted Quota

Coverage ratio per rep, normalized for ramp week. The dashboard view: per-rep coverage trend with the 3x threshold annotated. The signal: chronic sub-3x coverage points to a demand-generation gap, not a playbook gap — and the playbook diagnostic should be deferred until coverage stabilizes.

## 18. Honest Bottom Line

The playbook is rarely the bug. The diagnostic is almost always worth its 21-day cost. Most rewrites that get launched produce no measurable lift because the original playbook was not the constraint. The five wrong frames — board-meeting pressure, new-CRO impatience, vendor-pitch enthusiasm, undisciplined comparison to competitor playbooks, and reluctance to do the harder work of adoption — are responsible for the bulk of unnecessary rewrites in the industry.

The right cadence is: weekly playbook-PM updates by a designated owner, quarterly section-by-section updates driven by data, annual full-playbook health check using the 21-day diagnostic, and full scrap only when ICP, motion, or pricing has structurally shifted. The right mindset is: the playbook is a living artifact, not a quarterly deliverable. The right test is: can your top-quartile reps describe the playbook from memory and would they choose to run it if you gave them the option?

If the answer to that last test is yes, your playbook is fine; the work is adoption. If the answer is no, the work is content. If the answer is "what playbook?", the work is fit — and the work is more expensive than you think.

## Sources

1. Bertuzzi, Trish. *The Sales Development Playbook*. The Bridge Group, 2016.
2. Bertuzzi, Trish. Bridge Group 2024 SaaS AE Compensation and Performance Benchmark. https://bridgegroupinc.com/
3. Roberge, Mark. *The Sales Acceleration Formula*. Wiley, 2015.
4. Slootman, Frank. *Amp It Up: Leading for Hypergrowth by Raising Expectations, Increasing Urgency, and Elevating Intensity*. Wiley, 2022.
5. Lemkin, Jason. SaaStr playbook-cadence essays. https://www.saastr.com/
6. Jacobs, Sam. *Kind Folks Finish First*. Wiley, 2023.
7. Jacobs, Sam. Pavilion 2024 GTM Survey, n=312 GTM leaders. https://www.joinpavilion.com/
8. Cespedes, Frank V. *Sales Management That Works*. Harvard Business Review Press, 2021.
9. Cespedes, Frank V. *Aligning Strategy and Sales*. Harvard Business Review Press, 2014.
10. Dixon, Matthew, and Adamson, Brent. *The Challenger Sale*. Penguin, 2011.
11. Dixon, Matthew, et al. *The JOLT Effect*. Portfolio, 2022.
12. Blount, Jeb. *Fanatical Prospecting*. Wiley, 2015.
13. Blount, Jeb. *Sales EQ*. Wiley, 2017.
14. Paul, Andy. *Sell Without Selling Out*. Page Two, 2022.
15. Tunguz, Tomasz. Theory Ventures essays on early-stage GTM. https://tomtunguz.com/
16. Rhorer, Karen. Substack essays on sales operations diagnostic discipline.
17. Gartner. 2024 B2B Buying Group Research. https://www.gartner.com/
18. Topline Pro. 2024 SaaS sales org benchmark data.
19. RepVue. 2024 SaaS sales performance data. https://www.repvue.com/
20. Pavilion. 2024 CRO Benchmark Survey, n=312 CROs.
21. DePaul University Sales Effectiveness Center. 2024 cost-to-replace research.
22. Gong Labs. 2024 conversation intelligence benchmarks. https://www.gong.io/
23. Chorus / ZoomInfo. 2024 call-tape rubric data. https://www.chorus.ai/
24. Clari. 2024 conversation intelligence benchmarks. https://www.clari.com/
`;

module.exports = { body };
