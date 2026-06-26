# How do you calibrate interview expectations for different sales stages (SDR vs AE vs Sales Engineer)?

The honest answer most hiring managers will not say out loud: you are interviewing for three almost entirely different jobs, and you should be testing for three almost entirely different things. The candidate who would be a phenomenal SDR will frequently make a mediocre AE, the candidate who closes seven-figure deals will often be a terrible SE, and the SE who delights customers on a demo will rarely survive the cold-call grind. The mistake most teams make is using one interview loop, one scorecard, and one ramp expectation across all three. That is how you end up with a six-figure ramp investment that quietly washes out at month five and nobody can explain why. This entry breaks down what to test for, what ramp curve to expect, and what termination trigger to set for each of the three core stages, drawing on hiring frameworks used by RepVue-tracked SaaS orgs, the Bridge Group 2025 SDR Metrics Report, and the Pavilion Sales Compensation Benchmarks 2024.

## Direct Answer

Calibrate by three axes: (1) the dominant skill the role demands eight hours a day, (2) the ramp window your business model can actually afford, and (3) the termination trigger that lets you fail fast without burning culture. For SDRs, you are hiring activity tolerance and coachability — test for resilience and call willingness, expect productivity by day 60, and fire by day 120 if pipeline-sourced meetings are below 60% of cohort median. For AEs, you are hiring deal navigation and forecast discipline — test for discovery instincts and complex-deal pattern recognition, expect first closed-won by day 90 and full quota by month six, and fire by month seven if attainment is below 50% of the prorated target and pipeline coverage is below 2.5x. For Sales Engineers, you are hiring technical credibility and consultative storytelling — test for whiteboard fluency, objection handling under load, and the ability to translate ambiguity into a recommended architecture; expect demo-ready by day 45, expect 80% win-rate contribution by month four, and fire by month six if the AEs who work with them are asking for a different SE on every deal. Different jobs, different bars, different timelines, different exit criteria. Stop running one loop.

## 1. The Three Roles Are Not Variations Of One Job

### 1.1 SDR: The Activity Athlete

The SDR job is closer to an athletic discipline than a sales job. You will make 60 to 120 outbound touches a day for 18 to 24 months. You will be rejected, ghosted, ignored, and occasionally insulted. Then, on a Tuesday at 2:47 PM, you will catch a VP of RevOps in a good mood and book a meeting that turns into a $480,000 ACV deal — and your AE will get the commission while you get a $750 SPIFF and the satisfaction of seeing your name in the pipeline-sourced report. The Bridge Group 2025 SDR Metrics Report puts median SDR tenure at 16 months, with 38% of SDRs promoted to AE within 22 months and 41% washing out before month 12. That is the baseline reality. Interview for that reality.

The skill you are testing for is not "sales skill" in the abstract. It is the specific combination of:
- Activity tolerance: Can this human pick up the phone 80 times a day without quitting in week four?
- Coachability: When the manager rewrites their opener, do they say "got it" and run it, or do they spend 20 minutes explaining why their version was fine?
- Curiosity at the right depth: They need to know enough about your buyer to ask one decent question, not enough to lead a discovery call.
- Resilience under public failure: Bad call logged in Gong, manager replays it in front of the team — do they take the note or do they shut down for three days?

Test signals that work:
- Live cold-call simulation against an unfamiliar persona, recorded, replayed for the candidate, then re-run with the manager's coaching applied. Watch whether the second attempt actually incorporates the note. Candidates who incorporate the coaching score in the top quartile of 12-month attainment in the Sales Hacker 2024 study of 1,400 hires.
- A 5-question rapid-fire on their pipeline math from their last role. "What was your dial volume last Tuesday? What was your connect rate? How many meetings did you book last month? What was your show rate?" If they cannot answer in 90 seconds, they were not actually paying attention to their own job.
- A homework prompt: "Draft three personalized outbound emails to a CFO at a 400-person fintech." Look for specificity, business-context literacy, and zero LinkedIn-generated word salad.

What you are NOT testing for: deal closing, contract negotiation, multi-threading senior buyers, ROI modeling. Those are AE skills. If you accidentally hire an "SDR" who excels at those, you have hired an AE in disguise and they will leave in nine months because the job is beneath them.

### 1.2 AE: The Navigator Of Complexity

The AE job is fundamentally about navigation. The deal is a maze with five to nine humans, three competing priorities, two budget cycles, one procurement gauntlet, and at least one champion who will quietly quit on you in week eleven. The job is to read the maze, build a path, multi-thread the buying committee, and bring the deal in inside the quarter on roughly the price you forecast. Top performers do this through pattern recognition built over hundreds of deals. New AEs do not have that pattern library yet — your job is to assess whether they have the cognitive substrate to build one.

The skill you are testing for:
- Discovery instinct: Do they go three layers deep on "why now" or do they accept the first surface answer?
- Forecast discipline: Can they look at a deal and tell you what stage it is actually in, not what stage the rep wants it to be in?
- Multi-thread instinct: Do they reflexively ask "who else is involved?" or do they happily ride one champion off a cliff?
- Loss intelligence: Can they tell you why they lost their three most recent losses without blaming "budget" or "timing"?
- Champion-building craft: Do they know how to arm a champion with a business case, or do they just send a deck and hope?

Test signals that work:
- A live mock discovery call with a senior interviewer playing a real persona. Score on the number and depth of qualifying questions, on whether they actually paraphrase what they heard, and on whether they leave with a next step or a vague "I'll send the deck over."
- A deal teardown: "Walk me through your largest closed-won and your most painful closed-lost from the last 12 months. Show me the org chart. Show me who the economic buyer was and how you got to them. Show me the moment the deal almost died and what you did." Top candidates can talk about a deal for 40 minutes without running out of useful detail.
- A forecast exercise: hand them a snapshot of five deals with stage, age, last activity, and amount; ask which they would call commit, best-case, and pipeline, and why. The candidate who calls a 47-day-old deal with no exec sponsor "commit" because the rep said so will probably do that on your team too.

The ramp ladder for AEs is unforgiving in the modern SaaS environment. Pavilion's 2024 Benchmarks put median time-to-first-closed-won at 84 days for mid-market AEs and 132 days for enterprise AEs. That is the floor, not the average. If a candidate is selling you on closing a $200,000 deal in month two, either they are exaggerating or your sales cycle is dangerously short and you should investigate before you hire them.

### 1.3 Sales Engineer: The Translator In The Room

The SE is the only person in a deal who is simultaneously trusted by the customer's engineers AND aligned to the AE's commission number. That dual-loyalty is the entire job. The customer's technical buyer believes the SE because the SE speaks their language and can be called out on bad answers. The AE relies on the SE because the SE can move a deal in 15 minutes that the AE could not move in three weeks. Get the SE wrong and your deal flow chokes precisely at the highest-value moments.

The skill you are testing for:
- Technical depth that matches your product surface area. Not "knows Python" but "can architect a webhook ingestion pipeline on the whiteboard while the prospect's senior engineer interrupts every 90 seconds."
- Demo storytelling: Can they take a feature and tell a buyer-relevant story, or do they just walk through screens?
- Objection handling under live technical pressure: When the prospect's engineer says "your API rate limit is unworkable for our scale," do they panic, lie, or actually engage?
- Translation skill: Can they sit between an AE who needs to close and a CTO who needs to be respected, and make both feel heard?
- Discovery contribution: Top SEs run their own discovery thread on technical fit while the AE handles the commercial thread, doubling deal intelligence.

Test signals that work:
- A live demo against a panel that includes one customer-style interviewer (skeptical, not adversarial), one AE-style interviewer (commercial focus), and one engineer (technical depth). Score on whether the SE adapts their messaging in real time to each audience.
- A whiteboard problem: "We have a customer with 80 million records, a legacy Oracle DB, and a 45-day implementation window. Draw what the integration looks like." Watch for whether they ask clarifying questions before they draw, whether they leave room for the customer's reality, and whether they can adjust mid-draw when you change a constraint.
- A "bad demo" review: send them a recording of an intentionally mediocre demo from your own team and ask for a written critique. The depth of the critique tells you everything about their internal bar.

SEs ramp differently than AEs. They are usually demo-capable in 30 to 45 days because the demo flow is teachable. They are not deal-effective until month four to six, because deal effectiveness requires understanding your specific buyer's pain patterns, your AEs' working styles, and your product's quiet limitations — and that knowledge only comes from being in 25 to 40 live deal cycles.

## 2. Ramp Calibration: What You Should Actually Expect

### 2.1 The SDR Ramp Curve (0 to 120 Days)

- Days 1 to 14: Onboarding and shadowing. Outputs: zero meetings expected. Inputs: completing certification, listening to 40+ recorded calls, drafting their own opener.
- Days 15 to 30: First touches, supervised. Outputs: 1 to 3 meetings, probably from warm lists. Inputs: 40 to 60 dials per day, manager listens to 5 calls per week.
- Days 31 to 60: Independent activity, building cadence. Outputs: 4 to 8 meetings/month, 50% show rate is a passing grade.
- Days 61 to 90: At-tempo. Outputs: 7 to 12 meetings/month booked, 60%+ show rate, pipeline-sourced opportunities starting to convert.
- Days 91 to 120: Full productivity. Outputs: cohort median or better. By day 120, you should know whether this person is going to make it.

The Bridge Group 2025 data shows top-quartile SDRs hit 100% of quota by month four and stay there. Bottom-quartile SDRs hit 60% by month four and never climb. The pattern is set early.

### 2.2 The AE Ramp Curve (0 to 270 Days)

- Days 1 to 30: Product, persona, ICP, pipeline inheritance, shadow deals. Output: zero closed-won expected. Activity: 5 to 10 meetings/week with prospects, mostly inherited.
- Days 31 to 60: First independent discovery calls. Output: 2 to 4 active opportunities of their own creation. Pipeline coverage: at least 1.0x prorated quota.
- Days 61 to 90: First closed-wons land for mid-market AEs. For enterprise AEs, expect zero closed-won but 5 to 8 active opps with executive engagement.
- Days 91 to 180: Building book of business. Output: 40 to 70% of prorated quota. Pipeline coverage: 2.5x to 3.5x for following quarter.
- Days 181 to 270: Full productivity. Output: 80%+ of quota at month nine is the bar for keeping the seat. Pipeline coverage: 3x sustained.

The single most useful signal at month four is pipeline-build velocity. A new AE who has not built 2x pipeline coverage by month four will not hit quota at month nine — Pavilion's 2024 data shows a 91% correlation between month-four pipeline coverage and month-nine attainment.

### 2.3 The SE Ramp Curve (0 to 180 Days)

- Days 1 to 21: Product certification, shadow 10+ live demos, build their own demo environment.
- Days 22 to 45: First independent demos on routine deals. Demo win-rate contribution measured loosely.
- Days 46 to 90: Paired with 3 to 5 AEs, supporting their pipeline. Expect demo-stage to proposal-stage conversion to be at cohort median by month three.
- Days 91 to 180: Full productivity. Should be the requested SE on competitive deals. AEs they support should show 5 to 10 point lift in technical-stage win rate.

The most useful SE signal at month four is which AEs are pulling this SE into their biggest deals. If senior AEs are routing around this SE, you have a problem that will not self-correct.

## 3. The Interview Loop Architecture, By Role

### 3.1 SDR Loop (Total Time: ~3.5 Hours)

1. Recruiter screen (30 min): Compensation expectations, geography, work authorization, motivation.
2. Hiring manager interview (45 min): Job preview, resilience probe, coachability probe.
3. Live role-play (45 min): Cold-call simulation with replay and re-attempt.
4. Homework debrief (30 min): Review the three outbound emails they wrote.
5. Cross-functional bar raiser (45 min): A senior AE or RevOps leader interviews for culture and growth trajectory.

Decision criteria: 4 of 5 interviewers must score "strong yes." No single veto needed if 4 of 5 agree.

### 3.2 AE Loop (Total Time: ~6 Hours)

1. Recruiter screen (30 min).
2. Hiring manager (60 min): Career story, deal stories, quota history with documentation requested.
3. Mock discovery call (60 min): Live with a senior interviewer.
4. Deal teardown (60 min): Largest closed-won + most painful closed-lost.
5. Forecast exercise (45 min).
6. Executive bar raiser (45 min): VP of Sales or CRO probes for judgment, leverage, and long-term trajectory.
7. Reference checks (3 to 5, including at least one named manager from the W-2 history): Verify quota attainment claims numerically.

Decision criteria: hiring manager + bar raiser veto power. Any single "strong no" from those two ends the process. Other three roles vote.

### 3.3 SE Loop (Total Time: ~5.5 Hours)

1. Recruiter screen (30 min).
2. Hiring manager (45 min).
3. Technical depth interview (60 min): Whiteboard architecture problem with senior engineer present.
4. Live demo (60 min): Three-audience panel.
5. Bad-demo critique debrief (45 min).
6. AE partnership interview (45 min): A top-performing AE interviews them for working style and trust.
7. Reference checks (3 to 5).

Decision criteria: technical interviewer + AE partnership interviewer veto power.

## 4. Termination Triggers: Failing Fast Without Burning Culture

### 4.1 SDR Termination Trigger

By day 120, the SDR must be at 60% of cohort median for pipeline-sourced meetings booked. If they are below that line at day 120, the conversation is not "let's keep trying." The conversation is a documented 30-day performance plan with specific weekly milestones, followed by an exit if those milestones miss. The Bridge Group 2025 data is clear: SDRs who are below 60% at month four are below 70% at month seven 84% of the time. Hope is not a hiring strategy and it is not a retention strategy.

### 4.2 AE Termination Trigger

By month seven, the AE must be at 50% of prorated quota AND have 2.5x pipeline coverage for Q+1. If either fails, the conversation is a 60-day documented PIP with milestone-based exit criteria. Pavilion 2024 data shows AEs who miss both thresholds at month seven recover to quota in fewer than 12% of cases.

### 4.3 SE Termination Trigger

By month six, the SE must be the requested SE on at least 30% of their AEs' qualified opportunities. If AEs are routing around them, the SE is failing the trust test that is the entire job. PIP for 60 days with specific deal-engagement milestones, then exit if no improvement.

## 5. The Three Mistakes Most Teams Make

Mistake one: using AE-style behavioral interviews on SDR candidates. You end up filtering for people who can talk about deals they have not done, instead of for people who will pick up the phone 80 times a day for 18 months. Test for the job, not for a poetic description of the job.

Mistake two: expecting AEs to ramp on an SDR timeline. The board wants closed-won in 60 days. Your AE will produce closed-won in 84 to 132 days because that is what the data says. Either change the model or change the expectation, but do not blame the rep for math.

Mistake three: hiring SEs as if they are junior AEs with a CS degree. The SE job is its own discipline, with its own success curve and its own failure mode (low AE pull-through). Interview for it directly. Pay it directly. Manage it directly.

## 6. The One-Page Calibration Cheat Sheet

| Axis | SDR | AE | SE |
| --- | --- | --- | --- |
| Core skill | Activity tolerance + coachability | Deal navigation + forecast discipline | Technical credibility + translation |
| Test signal | Live cold-call + coaching incorporation | Mock discovery + deal teardown + forecast | Whiteboard + live demo + bad-demo critique |
| Ramp to productivity | 90 to 120 days | 180 to 270 days | 120 to 180 days |
| First milestone | 7+ meetings/month by day 90 | First closed-won by day 90 (mid-market) | Demo-ready by day 45 |
| Termination trigger | <60% cohort median at day 120 | <50% quota + <2.5x coverage at month 7 | <30% AE-requested rate at month 6 |
| Loop length | 3.5 hours | 6 hours | 5.5 hours |
| Veto holders | None (4-of-5 agreement) | HM + executive bar raiser | Technical interviewer + AE partnership |
| Reference count | 2 to 3 | 3 to 5 with quota verification | 3 to 5 with deal-collaboration verification |

## 7. What This Looks Like When You Get It Right

A team that calibrates correctly looks like this in 18 months: SDR cohort attainment stabilizes at 75% (versus the 52% industry median in the Bridge Group 2025 data), because you are filtering for the right traits and exiting bottom performers by day 120. AE cohort attainment stabilizes at 68% (versus the 43% Pavilion 2024 median), because you are interviewing for navigation and forecasting and giving them 270 days to ramp before judging them. SE bench strength becomes a competitive advantage — your AEs fight over the good ones, your win rate on technically complex deals climbs 8 to 12 points, and the engineering team starts treating your SEs as the customer-facing version of themselves.

A team that does not calibrate correctly looks like this in 18 months: SDR turnover at 65%, AE turnover at 48%, an SE function that everyone agrees is a bottleneck but nobody can fix, a CRO who is convinced the market is broken, and a board deck that quietly downgrades the new-logo plan two quarters in a row. The market is not broken. The interview loop is.

Different jobs, different bars, different timelines, different exit criteria. That is the entire discipline. Build the loops accordingly, set the ramp expectations honestly, and pull the termination trigger on time. The teams that do this consistently are the teams that show up on the RepVue top-200 list year after year. The ones that do not are the ones with permanently open requisitions and a CRO search starting in Q3.

## 8. Compensation Calibration: Pay The Role You Hired

Calibration extends past the offer letter. If your SDR comp plan rewards activity only, you will get great activity and weak meeting quality. If your AE plan rewards new logo only, you will get aggressive logos and a renewal cliff in year two. If your SE plan rewards a flat salary with no deal participation, you will get an SE who treats every demo identically and never gets pulled into the hardest deals on purpose. The Pavilion 2024 Sales Compensation Benchmarks show three patterns that consistently outperform.

For SDRs, 70/30 base-to-variable splits with the variable weighted 70% on qualified meetings held and 30% on pipeline-sourced closed-won (paid out at deal close, even though the SDR may have moved roles by then). The 30% closed-won kicker is the single highest-impact change a team can make to SDR meeting quality. The Bridge Group 2025 cohort of teams that adopted this structure showed a 19% lift in meeting-to-opportunity conversion within two quarters.

For AEs, 50/50 base-to-variable splits remain the modern SaaS standard for mid-market and enterprise roles. The variable should pay accelerators above 100% attainment that are at least 1.5x the on-target rate per dollar booked, with a second accelerator at 150% attainment of at least 2.0x. The math signal you are sending is "we want you to overachieve, and we will fund it." Teams that cap commissions at 100% see top-quartile AEs leave within 14 months 73% of the time, per Pavilion 2024 data.

For SEs, 75/25 or 80/20 base-to-variable splits where the variable is tied to the win rate or attainment of the AEs they support. This aligns SE behavior with deal outcomes without making them feel like junior AEs. The variable can be either a flat percentage of the books in the deals they supported or a quarterly MBO tied to AE pull-through metrics.

The compensation lesson generalizes: the role's success metric and the role's pay metric must be the same metric. If they are not, the rep will optimize the pay metric and ignore the success metric, and your CFO will eventually wonder why the team is hitting plan but the customer base is unhealthy.

## 9. The Role-Sequencing Question: Hire In What Order?

Founders building from zero often ask: should I hire the SDR first, the AE first, or the SE first? The data-supported answer depends entirely on your ACV and sales motion. The First Round Capital 2024 Founders' Sales Survey of 412 early-stage companies gives a useful framework.

If your ACV is below $25,000, hire AEs first who can do their own prospecting. Adding an SDR before you have product-market fit creates a meeting flood that converts at 3% and burns the AE's confidence. SE function is unnecessary at this ACV — the AE can demo.

If your ACV is between $25,000 and $100,000, hire AEs first, add SDRs at the point where AEs are spending more than 35% of their time on prospecting, and add a part-time SE function once deals routinely involve more than two technical interviews. Most companies in this band hire SEs about 18 months too late, per the First Round survey.

If your ACV is above $100,000, the SE is often the first specialized hire after the founding AE, because deals at this ACV almost always require deep technical validation. The mistake is hiring SDRs early at this ACV — enterprise buyers do not respond to volume-based outbound, and the SDR cohort attainment in this segment is brutal (33% median, per Bridge Group 2025).

Sequencing wrongly does not just slow you down. It builds a cost structure that the company cannot grow into for two to four quarters, which is enough to delay the next funding round or compress the next valuation.

## 10. Manager Calibration: The Hidden Variable

Almost nothing about role calibration matters if the front-line manager is not calibrated to the role they manage. A great SDR manager runs the team like a sports program: weekly metrics, public scoreboards, recorded-call reviews, structured coaching cycles. A great AE manager runs deal reviews like a chess club: pattern recognition, multi-thread mapping, forecast discipline, weekly one-on-ones that are 80% deal coaching and 20% career. A great SE manager runs a craft guild: peer-review of demos, shared playbooks, technical depth refreshes, demo-environment hygiene.

The most common failure mode is a great AE getting promoted to manage SDRs without retraining their instincts. They start coaching SDRs on close-stage objections instead of opener quality and connect-rate optimization. The SDR cohort wilts. Similarly, an AE manager who used to be an SE will often coach AEs into over-investing in technical proof and under-investing in commercial motion.

The fix is structural: have each manager certified annually on the calibration model for their specific layer. The SDR manager certification covers cohort metrics, ramp curve, and termination trigger discipline. The AE manager certification covers pipeline math, forecast discipline, and PIP execution. The SE manager certification covers demo quality rubrics and AE-partnership health metrics. Without this manager-layer calibration, the hiring loop calibration described above only takes you part of the way.

## 11. A Final Note On Honesty

The biggest favor a hiring leader can do for a candidate is be honest about which role they are interviewing for and what success looks like in that role. Tell the SDR candidate that month four is the cliff and what the bar is. Tell the AE candidate that the ramp is 270 days, that month-four pipeline coverage is the leading indicator, and that the PIP trigger sits at month seven. Tell the SE candidate that AE pull-through is the success metric and that they will be measured on which AEs request them by name. Candidates who hear this and lean in are the candidates you want. Candidates who flinch are doing both of you a favor by self-selecting out.

The teams that calibrate roles correctly are not the teams with the cleverest interview questions or the prettiest scorecards. They are the teams who have done the boring, careful work of figuring out exactly what each seat needs to produce, exactly when that production needs to land, and exactly what the early-warning signal looks like when it is not landing. That work compounds. Three years in, those teams have a hiring engine that other companies cannot replicate inside one year, because the calibration model is downstream of hundreds of small decisions made consistently. That is the moat. Build it on purpose.

## 12. Scorecards That Work: Practical Templates

Most interview scorecards fail one of three ways. They use the same five-trait template for every role (so you cannot tell an SDR loop from an SE loop). They use vague Likert scales without anchored definitions (so a "4" from one interviewer is a "2" from another). Or they fail to require evidence (so interviewers vote on vibes). A scorecard that actually drives calibration solves all three.

For SDRs, the scorecard should track six anchored dimensions: cold-call willingness (evidence: did they actually pick up the phone in the role-play without prompting?), coaching incorporation (evidence: did the second attempt change after the coaching note?), curiosity at depth (evidence: how many follow-up questions did they ask the manager?), written craft (evidence: were the three emails specific or generic?), drive observable on Zoom (evidence: did they lean forward or lean back?), and integrity (evidence: did their pipeline math add up?). Each dimension scored 1 to 4 with anchored definitions. Total: 24-point scale. Hire threshold: 18.

For AEs, the scorecard should track eight dimensions: discovery instinct, multi-thread instinct, forecast discipline, loss intelligence, champion craft, business acumen, written craft (email and follow-up quality), and integrity. Each scored 1 to 4 with anchored definitions tied to specific moments in the loop. Total: 32-point scale. Hire threshold: 24.

For SEs, the scorecard tracks seven dimensions: technical depth at your surface area, demo storytelling, real-time objection handling, translation skill, discovery contribution, written craft (the bad-demo critique becomes a written artifact you can score), and integrity. Each scored 1 to 4. Total: 28-point scale. Hire threshold: 21.

The two non-obvious lessons from anchored scorecards: first, decisions converge across interviewers when anchors are specific (the inter-rater reliability climbs from ~0.4 with unanchored Likert to ~0.7 with anchored, per the Harvard Business Review 2023 hiring meta-analysis). Second, the "integrity" dimension is the highest-stakes signal and the one most often missed. If a candidate misrepresents their last role's quota number by more than 5%, that single signal predicts forward-looking performance issues more than any other dimension in the loop.

## 13. The Reference-Check Discipline

Most reference checks are theater. The candidate hands you three friends, the friends say nice things, you close the loop. That is not a reference check; that is a courtesy call. A real reference check, especially for AE and SE hires, is a structured 25-to-40-minute conversation that probes for the specific dimensions you scored in the loop. Three patterns separate signal from theater.

First, ask for managed-by references, not peer references. Peer references will say almost anything nice. The candidate's most recent direct manager, even one not on their offered list, will give you the truest signal. Use LinkedIn to identify and reach out cold if necessary. Many will take the call.

Second, ask for behavioral, evidence-based answers. "Tell me about a deal Sarah ran that did not go as planned. What did she do? What would you have done differently?" If the reference cannot give a specific deal, the reference does not actually remember Sarah's performance, which is itself a signal.

Third, verify the numbers. The candidate said they hit 137% of $1.2M quota at their last role. Ask the reference: "When Sarah talks about her attainment at your company, what number does she usually quote? Does that match your recollection?" The pause before the answer is the answer.

The Sales Hacker 2024 hiring report found that teams that ran structured 25-minute reference calls with at least one managed-by reference reduced ramp failure rates by 28% compared to teams that ran traditional courtesy-call references. The cost is two extra hours per hire. The payoff is enormous.

## 14. The 90-Day In-Seat Review: Closing The Calibration Loop

Calibration is not finished when the candidate signs. It is finished when the 90-day in-seat review confirms or rejects every scoring signal the loop produced. This is the single most underused practice in sales hiring and the single most powerful upgrade to interview accuracy over time.

The mechanic: at day 90, the hiring manager fills out the same scorecard the loop used, scoring the new hire on the same anchored dimensions. The new hire's scorecard from the loop and from day 90 are compared. Dimensions that scored high in the loop but low at day 90 are surfaced as predictive failures of your loop. Dimensions that scored low in the loop but high at day 90 are surfaced as predictive false negatives.

After 20 to 30 hires across roles, patterns emerge. Maybe your AE loop systematically over-credits "discovery instinct" from candidates who interview well but cannot actually run discovery in live deals. Maybe your SE loop systematically under-credits SEs who interview quietly but become AE favorites within six months. These patterns are gold. They become the inputs to your next loop redesign.

Without the 90-day calibration loop, the interview process is a black box. With it, the interview process is a learning system. The teams that build the learning system are the teams whose hiring quality improves year over year. The teams that do not are the teams whose hiring quality oscillates based on which managers are doing the hiring this quarter.

## 15. Closing The Loop: One Calibration Story

A mid-market SaaS company with about 80 reps ran the analysis described in this entry across an 18-month window. They re-architected their loops to match the role they were actually hiring for. They moved their AE termination trigger from month nine to month seven and tied it to pipeline coverage as well as attainment. They added a structured demo critique to their SE loop. They installed a 90-day in-seat review across all roles. The results, measured at the 24-month mark: SDR cohort attainment moved from 51% to 73%. AE cohort attainment moved from 44% to 67%. SE-supported deal win rate moved from 41% to 53%. The cost of the redesign was approximately 140 hours of senior leadership time. The revenue lift attributable to the change was estimated at $14.2M of incremental new ARR in the first year. The ROI is not subtle.

Calibration done correctly is one of the highest-leverage things a sales leader can spend their time on. It is also one of the least glamorous. It does not show up on a slide. It does not generate a press release. It just quietly compounds into the team's win rate, the team's retention, the company's burn efficiency, and ultimately the company's valuation. The leaders who do this work consistently are the ones who, four years later, are running the GTM organizations everyone else tries to recruit from.

Hire the right people for the right roles with the right bar. Pay them the right way. Manage them with calibrated managers. Run the 90-day review. Adjust the loop. Repeat. That is the discipline. Everything else is decoration.

## 16. Cross-Role Promotion Calibration: When To Move Someone Up

A separate but related calibration question is when to promote an SDR to AE, or an AE into SE-adjacent technical roles, or an SE into AE. The defaults here are usually wrong. Promoting an SDR to AE at the 18-month mark just because they are "ready" without checking whether they have demonstrated the AE-flavored skills (discovery instinct, multi-thread instinct, forecast discipline) leads to a 60% failure rate at month nine of the new role, per the LinkedIn Sales Solutions 2024 internal mobility study.

A better promotion calibration: any internal candidate goes through 60% of the external loop for the target role. The hiring manager runs a deal teardown of the deals the SDR was attached to (yes, the SDR can describe what they observed even though they did not own the close). The bar raiser runs the forecast exercise. The mock discovery call is run live. If they clear the same bar an external candidate would have to clear, they get the role. If they do not, they get a documented development plan and a re-evaluation in six months. The painful conversation is the loyalty bias one: senior leaders often want to promote based on tenure and effort, not on demonstrated readiness. Calibration discipline says no. The cost of promoting an unready SDR to AE is twofold: you lose a productive SDR (because you cannot un-promote them) and you create an AE seat that will likely fail by month nine. The right answer is to keep the SDR producing and grow them through targeted development until they actually clear the bar.

The same logic applies in reverse for SEs who want to move to AE. Some SEs are gifted commercial operators in disguise and will outperform veteran AEs once they get the seat. Some SEs are pure craftspeople who will be miserable carrying a number. The calibration tool is the same: run them through the AE loop with the same anchored scorecard. The signal is honest. The conversation is sometimes hard. The outcome is dramatically better than the alternative of guessing based on golf-course chemistry.

The deeper point: role calibration is not a one-time event at the offer letter stage. It is an ongoing discipline that continues every time someone moves seats inside your organization. The teams that treat internal promotion as carefully as external hiring are the teams that build benches deep enough to absorb the inevitable departures without losing momentum. The teams that promote on tenure alone are the teams that look strong on the org chart and weak on the new-logo report. The org chart lies. The new-logo report does not.
