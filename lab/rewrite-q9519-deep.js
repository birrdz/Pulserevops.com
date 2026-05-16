// q9519 — What is the operator playbook for a 25-minute weekly pipeline review that drives real forecast accuracy?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** A 25-minute weekly pipeline review only drives forecast accuracy if you treat the time box as a **constraint that forces triage**, not a status update you rush through. The review fails by default — it becomes a **happy-hour status meeting** where reps narrate deals ("good call last week, sending the proposal, feeling good"), the manager nods, nothing changes, and the forecast stays exactly as wrong as it was. The fix is structural. First, **the prep makes the meeting short**: reps update CRM before the meeting (close dates honest, stages real, next steps logged), the manager pre-reads and flags the 6-10 deals worth inspecting, so the 25 minutes is execution not discovery. Second, **you do not review every deal** — you triage to the deals that matter this period (commit deals, big best-case deals, slipped deals, at-risk deals) and skip the early-pipeline noise. Third, **the review must do exactly three things**: pressure-test the commit, unstick the deals that can swing the number, and catch the risks early — everything else is theater. The agenda is minute-by-minute: **0-3** the number vs quota and the gap; **3-8** commit deals pressure-tested against real criteria; **8-16** the swing deals that can still move the number, unstuck with actions; **16-22** risks and slips; **22-25** actions, owners, dates. Every deal discussed ends with **an action, an owner, and a date** — a review that produces no actions was a status update wearing a review's clothes. The deal-inspection questions are MEDDPICC-driven ("who is the economic buyer and have you met them," "what is the compelling event," "what does the mutual action plan say next"), never the useless "how's it going." "Commit" must mean **specific criteria are met**, not that the rep feels good. Catch the slip in **week one**, not week three — the deal that has been "closing next week" for a month is the single biggest forecast killer. Tooling: Salesforce reports and dashboards as the system of record, plus Clari, Gong, or BoostUp for the deal-inspection and risk-signal view. The weekly review nests inside a **cadence architecture** — weekly 25-minute review, monthly deeper deal review, quarterly business review — and the CRO's review of managers mirrors the managers' review of reps up the hierarchy. Measure whether it works: **forecast accuracy trend, slip rate, commit-to-close conversion, and each rep's forecasting accuracy improving over quarters**. The counter-case is real: a rigid 25-minute playbook is the wrong fit for a tiny team, for an enterprise team with four deals a quarter that each need 30 minutes alone, and when the forecast is wrong because pipeline generation or product-market fit is broken — no review cures a coverage problem. Over-proceduralizing the review can kill the judgment and coaching that actually moved deals. Net: the 25-minute review is a forcing function for discipline, not a magic ritual — it works when the prep is real, the triage is honest, and every minute produces an action.`;

const core = `

## Why Most Pipeline Reviews Fail

Walk into almost any weekly sales meeting and you will see the same scene. The manager pulls up the pipeline report. The first rep starts talking. "So, the Acme deal — had a good call last week, they're really engaged, I'm sending over the proposal Thursday, feeling good about end of month." The manager nods. "Great, keep me posted." Next rep. "Beta Corp is moving, champion loves us, just waiting on legal." Nod. "Awesome." Twenty-five minutes later — or forty, because nobody enforced the clock — everyone leaves, the forecast is unchanged, and the exact same deals will get narrated again next week in the exact same words. This is the **happy-hour status update**, and it is the default state of pipeline review across most sales organizations. It feels productive because people talked about deals. It produces nothing because talking about deals is not the same as inspecting them, and a manager nodding is not the same as a manager pressure-testing.

The failure is not that managers are lazy or reps are dishonest. The failure is structural. A status update is **rep-led narration**: the rep controls the framing, picks the words, decides what to emphasize and what to skip. Of course the rep says "feeling good" — the rep is forecasting their own deal and is, on average, optimistic. A review that runs on rep narration is a review that inherits the rep's optimism wholesale. The manager's job in a real review is to be the counterweight to that optimism, and you cannot be a counterweight by nodding.

The second structural failure is **no triage**. The status-update review goes rep by rep, deal by deal, top to bottom, giving roughly equal airtime to a $12K deal that is going to close no matter what and a $180K deal that is the difference between hitting quota and missing it. Equal airtime to unequal deals is a guarantee that the deals that matter get the same shallow treatment as the deals that do not.

The third failure is **no output**. The status-update review ends and nothing is different. No deal changed stage because of something said in the room. No risk got surfaced that was not already known. No rep left with a clearer next step than they walked in with. The forecast number at the end of the meeting equals the forecast number at the start. If you can cancel the meeting and lose nothing, the meeting was theater.

The cost of theater is not just wasted time — it is **forecast inaccuracy that compounds**. Every week the slip goes uncaught, the deal stays in the forecast at the wrong date. Every week the commit goes unchallenged, the number stays inflated. By the last week of the quarter, the gap between the forecast and reality is large, and it is too late to do anything about it. The weekly review is the only mechanism that catches these errors while there is still time to act. A review that does not catch them is worse than no review, because it creates the *illusion* that the pipeline is being managed.

## The 25-Minute Constraint Is The Feature

The instinct, when a review feels shallow, is to make it longer. Give it an hour. Give it ninety minutes. Go deeper on every deal. This is exactly backwards. A longer review does not become a better review — it becomes a longer status update, because the structural problems (rep narration, no triage, no output) scale right along with the clock. The fix is not more time. The fix is a **hard time box that forces triage**.

Twenty-five minutes is not enough time to review every deal in a healthy pipeline. That is the point. The constraint makes it physically impossible to do the lazy thing — go rep by rep, deal by deal — and forces the disciplined thing: decide, before the meeting, which deals are worth the room's attention, and spend the time only on those. The constraint is a forcing function. Remove it and the discipline evaporates.

There is a reason 25 minutes specifically, rather than 30. A 30-minute meeting expands to fill 30 minutes; a 25-minute meeting leaves a 5-minute buffer before the next thing, which means it actually ends on time, and "ends on time" is a discipline signal the whole team reads. A review that reliably ends at minute 25 tells the team that the time box is real. A review that bleeds to minute 40 tells the team the time box is a suggestion, and once it is a suggestion, the triage discipline that depends on it is gone too.

The time box also changes the *kind* of conversation that happens. When everyone knows there are 25 minutes and 8 deals to get through, nobody has the luxury of rambling. The rep cannot narrate for four minutes because there is not four minutes to give. The manager cannot rabbit-hole on a pet deal because the clock is visible and shared. The constraint compresses the conversation down to its load-bearing parts: what is the deal, what is the risk, what is the next action, who owns it, by when. Everything that is not load-bearing gets squeezed out — and almost everything in a status update is not load-bearing.

It helps to say the quiet part out loud to the team: "We have 25 minutes. We are not going to review every deal. We are going to review the deals that decide whether we hit the number, and we are going to skip the rest. If your deal does not come up, that is good news — it means it is either safe or it is early. If your deal comes up, it is because it matters and it needs something." Framed that way, the constraint stops feeling like a limitation and starts feeling like the design.

## The Prep Requirement

Here is the thing that makes the 25-minute review possible, and it is the thing most teams skip: **the review is 25 minutes because the prep already happened.** The meeting is short not because the work is small but because the work was done before the meeting started. A review that tries to do the prep work live — pulling reports in the room, reps updating close dates on the call, the manager seeing the pipeline for the first time as the meeting begins — cannot be 25 minutes, because discovery is slow and discovery in front of an audience is slower.

Prep has three parts, and all three have to happen.

**Rep prep — CRM hygiene before the meeting.** Every rep updates their deals before the review, not during it. Close dates reflect reality, not hope. Stages are honest — a deal is in "proposal" because a proposal is out, not because the rep wishes it were further along. Next steps are logged with dates. Amounts are current. This is non-negotiable, and it has to be enforced: the rep who shows up with a stale pipeline gets their deals inspected hardest, in front of the team, every time, until the hygiene is automatic. The enforcement is not cruelty — it is the only thing that makes the rule real.

**Manager prep — the pre-read.** The manager looks at the pipeline before the meeting, not in it. The manager's pre-read produces a short list: the 6-10 deals worth the room's time this week, and for each one, the specific question or concern. The manager walks into the room knowing "I need to pressure-test the Acme commit, I need to find out why Beta slipped, I need to get the team unstuck on the Gamma legal review." The pre-read converts the 25 minutes from *discovery* (figuring out what to talk about) into *execution* (working the list). Discovery is what makes reviews long. Execution is what makes them short.

**The shared artifact.** There should be one view — a Salesforce dashboard, a Clari board, a saved report — that everyone is looking at, and it should be the same view every week. Reps know what the manager is going to see. The manager knows the data is current because the reps updated it. Nobody is surprised by the screen. The artifact is the contract: this is what we review, this is what "prepared" means, and if your deal looks bad on this screen, that is a conversation we are having today.

When prep is real, the 25 minutes works. When prep is skipped, no agenda in the world saves the meeting — it will run long, it will be shallow, and it will produce nothing. Prep is not a nice-to-have around the edges of the review. Prep is the review. The 25 minutes is just the visible tip.

## The Three Things The Review Must Do

A weekly pipeline review that drives forecast accuracy does exactly three things. Everything else that happens in the room is, at best, a distraction and, at worst, theater.

**One: pressure-test the commit.** The commit is the number the team is telling the company it will deliver. If the commit is wrong, the forecast is wrong, full stop. The review's first job is to take every deal in the commit and ask: is this actually commit, or does it just feel like commit? Pressure-testing means challenging the rep's optimism with specific criteria — not "are you sure?" (the rep will always say yes) but "walk me through why this is commit: who signed off, what is the compelling event, what is left between here and signature." A commit deal that cannot survive that questioning is not a commit deal, and finding that out in week two is the entire value of the exercise.

**Two: unstick the deals that can move the number.** Below the commit sits a band of deals that *could* close this period but are stuck — waiting on something, blocked by something, missing something. These are the swing deals, and they are where the review creates leverage. A 25-minute review cannot move a deal that is not movable, but it can absolutely identify the blocker on a movable deal and assign the action that clears it. The manager who hears "stuck on legal review" and responds "okay — what specifically is legal stuck on, who is the right person, do you need me or our legal team to call their legal team, what is the date we get it back" has just done the highest-leverage thing a review can do.

**Three: catch the risks early.** The third job is to find the deals that are about to go wrong before they go wrong. The slip that is forming. The champion who went quiet. The deal that has been one week from close for a month. The competitor who just showed up. Catching a risk in week one means there are eleven weeks to respond. Catching it in week twelve means writing it off. The review is the early-warning system, and an early-warning system that only warns you late is just a record-keeper.

Three jobs. Pressure-test the commit, unstick the swing deals, catch the risks early. If you find yourself doing something in the review that is not one of these three — celebrating a closed deal, doing deep skill coaching, solving a deal yourself, listening to a deal narration that has no decision attached — you have drifted, and the drift is what turns the review back into a status update. The three jobs are the guardrails.

## The Triage Model — Don't Review Every Deal

The single highest-leverage decision in pipeline review is the decision *not* to review most of the pipeline. A healthy rep has dozens of open opportunities. A healthy team has hundreds. Twenty-five minutes against hundreds of deals is mathematically absurd unless you triage hard, and triage means having an explicit rule for which deals get the room and which do not.

The deals that get reviewed are the deals that **matter to this period's number**:

**Commit deals.** Every deal in the commit category gets pressure-tested, every week, because the commit is the promise and the promise must be defensible. There is no skipping a commit deal.

**Big best-case deals.** The large deals sitting just below commit — the ones that, if they came in, would change the quarter. These get reviewed because their upside is material. A $200K best-case deal is worth more review time than ten $15K commit deals combined.

**Slipped deals.** Any deal whose close date moved — especially any deal whose close date moved *again*. A slip is a signal, and an un-inspected slip is a forecast error waiting to happen. Slipped deals get reviewed every time they slip.

**At-risk deals.** Deals showing risk signals — engagement dropped, a stage stalled too long, a champion went dark, a competitor entered, the next step is overdue. Whether the deal is in commit or best-case, a risk signal earns it a spot in the review.

The deals that get **skipped**:

**Early-pipeline noise.** Deals in the first stage or two, far from close, not relevant to this period. They matter for future quarters and they belong in a different conversation (the monthly deal review, the 1:1) — they do not belong in a weekly review that is about *this* period's number.

**Unchanged, healthy deals.** A deal that is progressing on schedule, with a current next step, no risk signals, and no change since last week, does not need the room. Reviewing a deal that is fine is a waste of the only scarce resource the meeting has: attention.

**Tiny deals.** Deals too small to move the number, however they go. A $4K deal does not earn 90 seconds of an 8-person team's time. It just does not.

The triage rule has to be explicit and the team has to know it, because the triage rule is also a behavioral message: deals that are clean and on-track do not get inspected, deals that are messy or stalled do. That asymmetry is a feature. It rewards the rep who keeps a clean, honest pipeline by leaving them alone, and it concentrates scrutiny exactly where scrutiny pays off. A team that internalizes "clean pipeline means the review skips me" will keep cleaner pipelines, which makes the prep better, which makes the review shorter, which is the whole flywheel.

## The Agenda — Minute By Minute

The 25-minute review runs on a fixed, minute-by-minute agenda. The agenda is not a suggestion to be loosely followed — it is the structure that makes the time box hold. Everyone knows it, the manager runs it, and the clock is visible.

**Minutes 0-3: The number.** Open with the number, not with a deal. Where is the team against quota for the period? What is the committed number, what is the gap to quota, what is the best-case ceiling? This is the frame for everything that follows. Three minutes, no deal discussion, just orientation: here is where we are, here is the hole we are filling, here is what would fill it. Starting with the number means every deal conversation that follows is implicitly measured against "does this help close the gap."

**Minutes 3-8: Commit deals pressure-tested.** Five minutes on the commit. Not narration — pressure-testing. Each commit deal gets a fast, hard look: why is this commit, what is the compelling event, what is the single thing that could still go wrong, what is the next step and is it on track. Five minutes is tight, which is the point — it forces the manager to ask only the load-bearing question per deal and forces the rep to answer in evidence, not adjectives. A commit deal that wobbles under five minutes of pressure-testing was not really commit.

**Minutes 8-16: The swing deals.** Eight minutes — the largest block — on the deals that can still move the number. These are the best-case and stuck-but-movable deals. This is where the review does its real work: identify the blocker, assign the action, set the date. The manager is not solving the deal here — the manager is making sure the rep leaves with a concrete, owned, dated next action that clears the blocker. Eight minutes, three to five deals, one action each.

**Minutes 16-22: Risks and slips.** Six minutes on what is going wrong. The slipped deals — why did the date move, is the new date real, what changed. The risk-signal deals — the quiet champion, the stalled stage, the overdue next step. The job here is to decide, per deal: does this stay in the forecast, move out of the forecast, or get a recovery action. A slip that gets a recovery action is being managed. A slip that gets a shrug is a future miss.

**Minutes 22-25: Actions and owners.** Three minutes to close the loop. The manager reads back every action assigned in the meeting: deal, action, owner, date. No new discussion — just confirmation. Everyone leaves knowing exactly what they committed to. This is the step that converts a conversation into accountability, and skipping it is the most common reason a review feels productive in the room and produces nothing by next week.

Twenty-five minutes. The number, the commit, the swing deals, the risks, the actions. The proportions matter — the largest block goes to the swing deals because that is where the review has the most leverage, and the smallest blocks bookend it with orientation and accountability.

## The Deal-Inspection Questions That Work

The difference between a review that inspects and a review that narrates is the question the manager asks. "How's it going?" invites narration — the rep tells a story, picks the framing, leads with the good news. The questions that actually inspect a deal are specific, evidence-seeking, and uncomfortable to answer with adjectives. They come straight out of a qualification framework — MEDDIC, MEDDPICC, whatever the team runs — and they map to the things that actually determine whether a deal closes.

**On the economic buyer:** "Who is the economic buyer — the person who can actually sign and release budget? Have you personally met them? When? What did they say? If you have not met them, what is your plan to, and by when?" A commit deal where the rep has never met the economic buyer is not a commit deal. It is a hope.

**On the compelling event:** "What is the compelling event — the reason this closes by the date you have, rather than three months later? What happens to the buyer if it slips?" If there is no compelling event, the close date is arbitrary, and an arbitrary close date is a slip waiting to happen.

**On the decision process:** "Walk me through the steps between here and a signed contract. Who else has to say yes? What is the procurement process? Has this buyer bought something like this before, and how did that go?" A rep who cannot describe the path to signature does not control the deal.

**On the mutual action plan:** "What does the mutual action plan say the next joint step is? Is the buyer working it with you, or are you working it alone? When did the buyer last do something on the plan?" A mutual action plan the buyer is not touching is a document, not a deal.

**On the metrics and pain:** "What is the quantified business problem this solves? Whose number does it move? Has the buyer agreed to that number, or is it your math?" A deal sold on features and good vibes closes worse than a deal sold on a number the buyer owns.

**On the competition:** "Who else is in this? What does the buyer like about them? If you lost this deal, what would the reason be?" The rep who says "no competition" is usually the rep who has not asked.

Notice the shape of all of these: they ask for evidence, they have a date attached, and they cannot be answered with "feeling good." The manager's discipline is to ask the load-bearing question and then *be quiet* — let the rep fill the silence with the answer, and notice whether the answer is specific or vague. Vague is the signal. The useless question — "how's it going," "are you confident," "still on track?" — gets a confident, vague answer every time, and tells the manager nothing.

## Commit Discipline — What "Commit" Must Mean

The word "commit" does enormous work in a forecast, and on most teams it means almost nothing. It means the rep feels good. It means the deal has been around a while. It means the rep does not want the manager bothering them about it. None of that is a definition, and a category without a definition cannot produce an accurate forecast.

"Commit" has to mean **specific, checkable criteria are met** — and the review's job is to enforce that meaning every single week. The exact criteria vary by company, but a workable bar looks like: the economic buyer is identified and has been met; there is a real compelling event with a date; the buyer has verbally agreed to move forward; pricing has been presented and is not a blocker; the path to signature is known and short; the mutual action plan is current and the buyer is working it; there are no unresolved red flags. A deal that clears all of those is a commit deal. A deal that misses one or more is a best-case deal, and calling it commit is just lying to the forecast.

The review enforces this by making the rep *defend* the commit designation, not just assert it. "You have this as commit — walk me through the criteria." If the rep cannot, the deal moves to best-case in the room, on the spot. This is uncomfortable the first few times and then it becomes culture. Reps learn that "commit" is a claim they have to back up, so they stop putting deals in commit that they cannot back up, and the commit category slowly becomes what it is supposed to be: the deals that are actually going to close.

The payoff is direct. A commit category that means something produces a forecast that means something. A commit-to-close conversion rate that sits reliably at 85-90%+ is the signature of a team with real commit discipline. A conversion rate bouncing between 50% and 70% is the signature of a team where "commit" means "the rep feels good," and that team's forecast is a guess wearing a suit.

## Catching The Slip Early

The most expensive deal in any pipeline is the one that has been "closing next week" for the last month. It sits in the forecast, at a date that keeps moving, quietly making the number look better than it is, until the quarter ends and it is still not closed. Every sales org has these deals. The job of the weekly review is to catch them in **week one**, not week three, and definitely not week twelve.

A slip is a close-date change, and every close-date change is a signal that something the rep believed last week turned out not to be true. The review has to treat it that way. When a deal slips, the question is not "okay, what's the new date" — that just relocates the fiction. The question is: "The date moved. What specifically changed? What did you believe last week that you do not believe now? And why is the *new* date real — what makes you confident this one holds when the last one did not?"

A deal that slips once gets that questioning. A deal that slips twice gets escalated — the manager goes deeper, maybe joins the next call, maybe the deal comes out of the forecast entirely until it re-earns its place. A deal that slips three times is not a deal with a date problem. It is a deal that is not real, and the kindest thing the review can do is say so, take it out of the forecast, and let the rep stop carrying a ghost.

The reason early catching matters so much is **time to respond**. A slip caught in week one of the quarter is a problem with eleven weeks of runway — there is time to fix the blocker, escalate, find a replacement deal, adjust the forecast honestly. A slip caught in week twelve is just a miss with paperwork. The entire economic value of a weekly cadence — versus a monthly one — is that weekly catches the slip while there is still time to do something. Squander that by not inspecting slips, and you might as well review monthly.

## The Action-Orientation Rule

Here is the rule that separates a review from a status update, and it is simple enough to put on the wall: **every deal discussed ends with an action, an owner, and a date.** No exceptions. If a deal comes up in the review and the conversation ends without a concrete next action assigned to a specific person with a specific date, then that deal discussion was a status update, and status updates do not belong in the review.

This rule is doing more work than it looks like. It forces the conversation to *go somewhere*. A manager who knows that every deal has to end in an action cannot just nod — the nod does not satisfy the rule. The rule pulls every deal conversation toward "so what do we do about it," which is the only question that changes outcomes. It also makes the review self-policing: if you cannot land an action on a deal, that is a signal the deal either did not need the room (skip it next time) or the conversation was too shallow to be useful (go deeper or take it offline).

"Action" has a specific meaning here. "Follow up with the buyer" is not an action — it is a category of action. "Email the economic buyer by Thursday to get a date for the security review, and if no response by Monday, escalate to me to call their VP" is an action. It is specific, it is owned, it has a date, and the manager can check next week whether it happened. The specificity is what makes it accountable, and accountability is what makes the next review easier — because next week's review opens, implicitly, with "did the actions from last week happen," and a rep who knows that question is coming does the actions.

The minutes 22-25 readback exists to enforce this rule. The manager reads back the full action list — deal, action, owner, date — and that readback is the moment the review becomes binding. A review with no readback tends to produce actions that evaporate by Tuesday. A review with a disciplined readback produces a list the team is actually held to. Over a quarter, the difference between those two is the difference between a forecast that improves and a forecast that does not.

## Manager Prep — The Pre-Read

The manager's pre-read is the highest-leverage 15-20 minutes in the manager's week, and most managers skip it. Skipping it is why their reviews run 50 minutes and produce nothing — they are doing discovery in the room, in front of an audience, which is the slowest possible way to figure out what to talk about.

The pre-read is straightforward. Before the review, the manager opens the shared pipeline view and works through it with a specific goal: produce the list of 6-10 deals that need the room this week, and for each one, the specific reason and the specific question. The manager is looking for: commit deals that need pressure-testing, swing deals that look stuck, deals that slipped since last week, deals throwing risk signals (overdue next step, stage stalled, engagement dropped, no activity logged). For each deal that makes the list, the manager writes down — actually writes down — the question or concern: "Acme commit — rep has never named the economic buyer, pressure-test." "Beta slipped to next month — second slip, find out what changed." "Gamma stuck three weeks in legal — what specifically, do they need help."

That list is the agenda. The manager walks into the review with it and works it. The 25 minutes is execution against a prepared list, not discovery from a blank page. This is the single biggest difference between a manager whose reviews are tight and useful and a manager whose reviews are long and hollow — not talent, not experience, just whether the pre-read happened.

A good pre-read also surfaces *patterns*, not just deals. If three reps all have deals stuck at the same stage, that is not three deal problems — it is one process problem, and the manager should note it (and probably take it to a different meeting, not burn review time on it). If one rep's entire pipeline slipped, that is a coaching conversation for the 1:1, flagged during the pre-read. The pre-read is where the manager sees the forest; the review is where the team works the specific trees.

## Rep Prep — The CRM Hygiene

The rep's prep job is CRM hygiene, and it has to happen *before* the review, every week, without being asked. Close dates accurate — reflecting what the rep actually believes, not what they wish. Stages honest — a deal is in the stage it has actually reached, with the actual exit criteria met, not the stage the rep would like it to be in. Next steps logged, with dates. Amounts current. Activity recorded. The whole pipeline, current and true, before the meeting starts.

This matters for a mechanical reason and a behavioral reason. Mechanically: the review runs on the shared pipeline view, and if that view is stale, the review is reviewing fiction. The manager's pre-read is worthless if it is built on close dates from three weeks ago. The triage is worthless if "slipped deals" cannot be identified because nobody updates close dates. Stale CRM does not just slow the review down — it makes the review *wrong*.

Behaviorally: rep CRM hygiene only happens if it is enforced, and the cleanest enforcement mechanism is the review itself. The rule the team has to know is simple — **the rep who shows up with a stale pipeline gets their deals inspected hardest.** Not as punishment, but as natural consequence: if the manager cannot trust the data, the manager has to dig, and digging in the review is uncomfortable and public. A rep who experiences "my pipeline was stale so I got grilled in front of the team" twice will keep a clean pipeline. A rep who experiences no consequence for stale data will never update anything, because updating is work and work without consequence does not get done.

The flip side is the reward, and it should be just as explicit: a rep with a clean, honest, current pipeline mostly gets *skipped* by the review. Their on-track deals do not get inspected because the triage rule says clean and on-track deals are skipped. The rep learns that hygiene buys them autonomy — keep the pipeline real and the review leaves you alone; let it rot and the review lives in your deals. That trade is the right incentive, and a team that internalizes it makes the prep self-sustaining.

One more thing: the rep prep cannot include live data entry in the meeting. If the review pauses while a rep updates a close date on the call, the time box is already broken and the prep discipline is already gone. Data entry happens before. The review only consumes data; it never produces it.

## The Forecast-Accuracy Connection

It is worth being explicit about *how* a 25-minute weekly review actually compounds into forecast accuracy, because the connection is not obvious and the mechanism is what justifies the whole exercise.

**It catches slips while they are cheap.** Forecast inaccuracy is, mostly, deals being in the forecast at the wrong date or the wrong probability. The weekly review catches the date errors early — week one instead of week twelve — which means the forecast gets corrected while there is still time for the correction to be acted on. Eleven weeks of runway versus zero.

**It enforces a real definition of commit.** A forecast is only as good as its categories, and "commit" is the load-bearing category. A review that pressure-tests every commit deal every week keeps the commit category honest, and an honest commit category is most of an honest forecast. The commit-to-close conversion rate stabilizes, and a stable conversion rate is a predictable forecast.

**It builds the rep's forecasting muscle.** This is the slow compounding part and the most valuable. Every week, the rep has to defend their deals against specific questions. Over a quarter, the rep starts *pre-answering* those questions — anticipating "who is the economic buyer, what is the compelling event, why is this date real" before the manager asks. Over a year, the rep internalizes the questions and becomes a genuinely better forecaster of their own deals. A team of reps who forecast their own deals accurately is a team whose aggregate forecast is accurate, and the weekly review is the training mechanism that gets them there. The review is not just inspecting the forecast — it is *teaching the team to produce a better one*.

**It creates a weekly correction loop.** A monthly or quarterly forecast process corrects slowly — by the time an error is visible, it is often too late. A weekly loop corrects fast. Small errors get caught and fixed weekly, before they compound into large errors. The accuracy is not from any single review being brilliant; it is from the cadence being tight enough that errors never get the chance to grow.

Put together: the weekly review makes the forecast accurate by catching errors early, keeping the categories honest, training the reps to forecast well, and correcting on a tight loop. None of those is dramatic in any single week. All of them compound over quarters. That compounding is the entire return on the 25 minutes.

## The Cadence Architecture

The 25-minute weekly review does not stand alone. It is one layer in a cadence architecture, and it only works if the other layers exist to absorb the things the weekly review deliberately does not do.

**The weekly review (25 minutes).** Purpose: this period's number. Pressure-test commit, unstick swing deals, catch risks early. Deliberately narrow — it does not do early pipeline, it does not do deep coaching, it does not do strategy. It does the number, this week.

**The monthly deal review (60-90 minutes).** Purpose: the deeper look. This is where the bigger strategic deals get a full inspection — the full MEDDPICC walk, the account map, the multi-thread strategy. It is where early-pipeline health gets examined — is enough new pipeline being created, at the right quality. It is where the deals the weekly review keeps skipping finally get attention. The monthly review is slower and broader by design, and its existence is what *lets* the weekly review be fast and narrow.

**The quarterly business review (half-day or more).** Purpose: the system. Did the forecast prove accurate over the quarter — and if not, where did it break? What do the trends say about pipeline coverage, win rates, sales cycle, conversion by stage? What needs to change in the motion, the territory, the comp, the process? The QBR looks at the machine, not the deals.

**Up the hierarchy.** The same architecture repeats one level up. The CRO runs a weekly review of the managers that mirrors the managers' weekly review of reps — same 25-minute discipline, same triage, same three jobs, but the unit of inspection is the manager's roll-up instead of the rep's deals. The rolling cadence goes all the way up: rep deals roll into manager forecast, manager forecast rolls into the CRO's number, and each level inspects the level below with the same playbook.

The reason the architecture matters: a weekly review that tries to do everything — this period's number *and* early pipeline *and* deep coaching *and* strategy — cannot be 25 minutes and cannot be focused. The narrowness of the weekly review is only sustainable because the monthly and quarterly layers exist to catch what it drops. Skip those layers, and either the weekly review bloats to cover them or the dropped things just never get done. The cadence is a system; the 25-minute review is one well-defined component of it.

## The 1:1 vs Team Review Question

A recurring source of confusion is what belongs in the team pipeline review versus what belongs in the rep's 1:1, and getting this wrong is a common way the 25-minute review gets wrecked.

**The team review** is for the things that benefit from the team being in the room: forecast roll-up and the team's collective number, deals where another rep or the manager can help unstick something, risk patterns worth the team seeing, and the shared accountability of public action assignment. It is fast, it is about *this period's number across the team*, and it is deliberately not personal.

**The 1:1** is for the things that should not happen in front of the team: deep skill coaching, a rep's individual performance and development, a rep's whole-pipeline health and quota path, the hard conversation about a rep whose deals keep slipping, the territory and quota and comp conversations. The 1:1 is where the manager and the rep go deep on *that rep* — their skills, their gaps, their growth.

The failure mode is mixing them. When the team review drifts into coaching one rep on their discovery technique, the other seven people are watching a 1:1 they should not be in, the time box is blown, and the rep being coached is being coached in public, which is worse coaching. When the 1:1 turns into a deal-by-deal pipeline status walk, the deep coaching that should happen there never does, and the manager has effectively run two pipeline reviews and zero coaching sessions.

The clean rule: **the team review inspects the forecast; the 1:1 develops the rep.** A deal can come up in both — in the team review because it affects the number and needs an action, in the 1:1 because the *way the rep is running it* reveals a skill gap worth coaching. But the lens is different, and keeping the lenses separate is what keeps both meetings working. If the manager finds the team review constantly drifting into 1:1 territory, that is usually a sign the 1:1s are not happening or not working, and the fix is to fix the 1:1, not to let the team review absorb its job.

## Running It Across A Multi-Manager Org

In an org with multiple managers, the 25-minute review is not one meeting — it is a pattern that repeats at every level, and the discipline of the pattern is what makes the whole forecast roll up cleanly.

Each frontline manager runs the 25-minute review with their reps. Same agenda, same triage, same three jobs. The output of each of those reviews is a manager-level forecast that has been pressure-tested at the deal level. Then the CRO (or VP) runs a 25-minute review *with the managers*, and it mirrors the rep-level review exactly: open with the number (the org's number versus target), pressure-test the commit (but now the unit is each manager's committed roll-up), work the swing (which manager's segment can still move, what is stuck, what is the action), catch the risks (whose forecast looks shaky, whose pipeline thinned, whose commit-to-close history says discount their number). The manager defends their roll-up the way a rep defends their deals.

This rolling, mirrored cadence does a few important things. It means **the same discipline applies at every level** — a manager who pressure-tests their reps' commits but cannot defend their own roll-up to the CRO feels that asymmetry and closes it. It means **the forecast is inspected multiple times on its way up** — deal-level by the manager, roll-up-level by the CRO — so errors get caught at whatever level they live at. And it means **the playbook is consistent**, which matters enormously when managers move teams, reps get promoted to manager, or the org scales: everyone already knows how a review runs because every review runs the same way.

For the CRO, the manager-level review also surfaces something the rep-level review cannot: *which managers forecast accurately*. Over a few quarters, the CRO learns that Manager A's commit is gold and Manager B's commit needs a 15% haircut. That calibration — knowing which roll-ups to trust at face value and which to discount — is itself a major input to the org-level forecast, and it only emerges from running the mirrored review consistently enough to see the pattern.

## The Tooling

The 25-minute review needs the right tools, but it is worth being clear about what the tools do and do not do: the tools provide the *view*, the discipline provides the *review*. A great dashboard run by a manager who nods is still theater. But the right tooling makes the prep faster and the inspection sharper, and that is not nothing.

**Salesforce (or the CRM) is the system of record.** This is where the pipeline lives, where reps do their hygiene, where stages and close dates and amounts and next steps are tracked. The review's shared artifact is usually a saved Salesforce report or dashboard — the same view every week, filtered to the current period, sorted by forecast category. If the CRM data is not clean, nothing downstream works, which is why rep hygiene is non-negotiable.

**Forecasting and deal-inspection platforms — Clari, Gong, BoostUp, and similar.** These sit on top of the CRM and add the things a raw CRM report does not give you: a clean forecast roll-up by category and by rep, deal-level risk scoring, activity and engagement signals (is the buyer actually responding, has the champion gone quiet), and slip tracking that flags close-date changes automatically. For the manager's pre-read, this is the highest-value tooling — it surfaces the at-risk and slipped deals automatically instead of making the manager hunt for them. Gong specifically adds the conversation-intelligence layer: the manager can see what was actually said on the calls, not just what the rep logged.

**The pre-built review dashboard.** Whatever the tool stack, the team should have one purpose-built review view, and during the 25 minutes that view is what is on the screen. It shows the number and the gap at the top, then the commit deals, then the swing deals, then the slips and risks — roughly in agenda order, so the meeting can move down the screen. Building that view once and using it every week is part of what makes the review repeatable.

What the screen looks like during the review: the number and gap up top, a tight list of the triaged deals (not the whole pipeline — the triaged list), risk flags visible, last activity visible, next step and its date visible. The manager drives the screen, the team follows it, and the screen *is* the agenda. What the screen should not be: the entire raw pipeline, scrolled through deal by deal. If the team is scrolling the full pipeline, the triage did not happen, and the tooling is being used to enable the status update instead of prevent it.

## The Behaviors That Kill The 25 Minutes

Even with the right structure, a handful of specific behaviors will quietly destroy the review. Naming them is the first step to policing them.

**Rep deal-narration.** The rep tells the story of the deal — the call went well, they are engaged, the proposal is going out — and the manager lets it run. Narration is the default and it is the enemy. The fix: the manager interrupts narration with a specific question. The rep does not get to narrate; the rep gets asked and answers.

**The manager solving the deal.** The rep describes a blocker and the manager, instead of coaching the rep to solve it, solves it themselves — "I'll call their VP." Occasionally the manager genuinely should step in, but as a habit it is poison: it trains reps to bring problems and wait for rescue instead of bringing problems and a plan. The fix: the manager asks "what is your plan to clear this," and only adds manager-level help on top of the rep's plan, not instead of it.

**Rabbit-holing one deal.** Eight minutes on a single fascinating deal, and the other seven deals get thirty seconds each. The fix: the time box per block is real, and the manager says "we have spent our time on this one — next step, owner, date, and let's take the rest offline."

**Live CRM updates.** A rep updates a close date or a stage during the meeting. The fix: it does not happen. Data entry is prep. The review consumes data, never produces it. A rep who needs to update something does it after, and notes it as an action.

**No time box enforcement.** The meeting drifts to 40 minutes and everyone learns the 25 is a fiction. The fix: the clock is visible, the manager ends at 25 even mid-sentence, and "we ran out of time, take it offline" is said often enough that the team believes the box is real.

**Skipping the action readback.** The meeting ends on a deal discussion, no readback, and the actions evaporate. The fix: minutes 22-25 are sacred. Every meeting ends with the readback, no exceptions.

**Celebrating closed deals.** Closed deals are great and they belong in a different moment — the team channel, the start of the broader sales meeting, the 1:1. They do not belong in the 25-minute review, because a closed deal needs no action and the review is for deals that need actions. The fix: celebrate elsewhere; keep the review for live deals.

Each of these behaviors is individually small and collectively fatal. A review can have a perfect agenda on paper and still be a status update if the manager lets narration run, solves the deals, rabbit-holes, and skips the readback. The structure is necessary; policing the behaviors is what makes the structure real.

## Coaching In The Review vs Coaching Outside It

There is a real tension in pipeline review between *inspecting* and *coaching*, and resolving it well is part of the playbook. The 25-minute review is primarily an inspection-and-unsticking meeting. It is not the place for deep skill coaching — and trying to make it the place for deep skill coaching is one of the surest ways to blow the time box and make the coaching bad on top of it.

The distinction: **the review coaches the deal; the 1:1 coaches the rep.** In the review, when a deal is stuck, the manager helps the rep figure out the next move on *that deal* — that is coaching, in a narrow, deal-specific, action-oriented sense, and it belongs in the review because it directly serves the number. What does not belong is the broader skill conversation: "you tend to skip discovery on the economic buyer across all your deals, let's work on your discovery technique." That is real coaching, it is valuable, and it should happen in the 1:1 where there is time for it, where it can be done privately, and where it will not consume the eight people sitting in the team review.

The reason to keep them separate is partly time-box mechanics and partly coaching quality. Skill coaching done in 90 seconds between two other deals is bad coaching — it is too rushed to land. Skill coaching done in front of the team is bad coaching — it is too public to be received well. The 1:1 gives skill coaching the time and the privacy it needs to actually work.

What the review *does* feed the 1:1: the manager, watching a rep defend deals every week, sees the patterns. This rep consistently cannot name the economic buyer. That rep's deals slip because there is never a real compelling event. A third rep narrates instead of inspecting because they have not actually done the qualification. Those patterns, spotted in the review, become the agenda for the 1:1. So the review and the 1:1 are connected — the review surfaces the coaching topics, the 1:1 does the coaching — but they are not the same meeting, and collapsing them makes both worse. Keep the review for forecast and unsticking. Take the skill coaching to the 1:1. Both work better for the separation.

## Measuring Whether The Review Works

A review is a process, and a process that is not measured drifts back toward theater. There are four metrics that tell you whether the 25-minute review is actually driving forecast accuracy, and they should be tracked over quarters, not weeks.

**Forecast accuracy trend.** The headline metric: how close did the committed forecast come to actual closed revenue, and is that gap shrinking over time? A team running the review well sees forecast accuracy tighten quarter over quarter — not because any single forecast is perfect, but because the weekly correction loop keeps getting better. If accuracy is flat or worsening, the review is not doing its job, regardless of how it feels in the room.

**Slip rate.** What percentage of deals have their close date pushed, and how many times? A healthy review *drives the slip rate down over time*, because early slip-catching plus honest commit criteria mean fewer deals were on fictional dates to begin with. Tracking slip rate by rep also surfaces who needs coaching: the rep whose deals slip constantly has a qualification problem the 1:1 should address.

**Commit-to-close conversion.** Of the deals marked commit, what percentage actually closed in the period? This is the direct measure of commit discipline. A team with real commit criteria, enforced weekly, converges on a high and stable conversion — 85-90%+. A team where "commit" means "feels good" shows a volatile conversion bouncing between 50% and 75%. The number and its *stability* both matter; a stable conversion is a forecastable one.

**Rep forecasting accuracy over time.** The slow, compounding metric: is each individual rep getting better at predicting their own deals? Track each rep's personal forecast accuracy quarter over quarter. The whole theory of the review is that pressure-testing deals weekly trains reps to forecast better — if that is working, you see it in the rep-level accuracy trend improving over a year. If rep-level accuracy is flat, the review is inspecting but not teaching, and that is a coaching gap to close.

These four together tell the story. Forecast accuracy is the outcome; slip rate and commit conversion are the leading indicators that explain it; rep forecasting accuracy is the long-term capability being built. A team that watches all four — and adjusts the review when they go the wrong way — has a review that improves. A team that runs the review on autopilot and never measures it has a review that slowly rots back into the happy-hour status update it started as.

## Adapting It By Motion

The 25-minute review is a template, not a law, and it has to be tuned to the sales motion. The same playbook runs differently for a transactional SMB team and an enterprise team, and forcing one shape onto the other breaks it.

**Transactional / SMB motion.** High deal volume, short cycles, smaller deal sizes, lots of deals in the pipeline at once. Here the review is more about **velocity and volume** than deep per-deal inspection. The triage is even more aggressive — you cannot inspect individual deals when each rep has fifty in flight, so the review works in cohorts and patterns: which stage is converting below benchmark, which week of deals is slipping, is the volume of new pipeline keeping pace with the close rate. Individual deals come up only when they are unusually large or unusually stuck. The 25 minutes holds, but it is spent on flow, not on six deep deal inspections.

**Enterprise motion.** Low deal volume, long cycles, large deal sizes, few deals that each matter enormously. Here the review goes **deep on few deals**. A rep might have eight to fifteen open opportunities, and three of them are the quarter. The triage still applies, but the reviewed set is small and the inspection per deal is deeper — the full MEDDPICC walk, the account map, the multi-threading status. In a pure enterprise motion, the weekly review might genuinely be the wrong container for the biggest deals (see the counter-case) — those may need their own dedicated deal reviews — and the 25-minute weekly becomes a pulse check plus risk scan rather than a full inspection.

**Mid-market** sits between, and most teams are some blend. The point is not that there is one true review — the point is that the *structure* (time box, prep, triage, three jobs, action orientation) is constant, while the *content* (how many deals, how deep, cohorts versus individual deals) flexes with the motion. A VP who imports the SMB review into an enterprise team will under-inspect the deals that decide the quarter. A VP who imports the enterprise review into an SMB team will inspect six deals deeply and ignore the other three hundred that, in aggregate, are the actual number. Tune the content to the motion; keep the structure.

## 5 Real-World Scenarios

**Scenario 1: The review is pure status theater.** A 6-rep team. The weekly review runs 45 minutes, goes rep by rep, every rep narrates every deal, the manager nods, nothing changes, and the forecast missed by 22% last quarter. The fix is a hard reset: announce the new format, install the 25-minute time box and the minute-by-minute agenda, require CRM hygiene before the meeting, and the manager starts doing the pre-read. Week one feels rough — reps are not used to being asked specific questions instead of narrating. By week four it is normal. The first visible win is usually a slip caught early that would previously have been caught in the last week. Within a quarter, forecast accuracy moves because the correction loop finally exists.

**Scenario 2: The manager who solves every deal.** A talented manager, ex-top-rep, who hears every blocker and immediately says "I'll handle it." The team's deals move — but only because the manager is personally moving them, the reps are not developing, and the manager is the bottleneck. The fix is a behavior change in the review: the manager makes themselves ask "what is *your* plan" before offering help, every time. The manager still helps — but on top of the rep's plan, not instead of it. It feels slower for a quarter. Then the reps start showing up with plans, and the manager's leverage multiplies because they are coaching instead of doing.

**Scenario 3: The quarter is behind and the review must triage hard.** Week 7 of the quarter, the team is at 40% of quota, the gap is large. This is when triage discipline matters most. The review stops giving any time to deals that cannot close this quarter — they are noise right now. Every minute goes to: which commit deals are real (pressure-test hard, because a fake commit now is a disaster), which swing deals can be pulled in (and what is the action to pull them), and what is the honest best case. The review might also explicitly become "what do we do" — pull-forward plays, exec sponsorship on the biggest swings, an honest re-forecast up the chain. A behind quarter is exactly when a status-update review is most fatal and a triage review is most valuable.

**Scenario 4: A new manager learning the cadence.** A newly promoted manager, great rep, has never run a review. The trap is that they run it like a peer conversation — collegial, narration-friendly, no time box, no hard questions because the reps were their peers last month. The fix is to give them the playbook explicitly: the agenda, the question bank, the triage rule, the action-readback discipline — and to have their own manager run the mirrored review on *them* so they experience the receiving end. New managers do not need to invent the review; they need a template and a few quarters of reps to run it consistently.

**Scenario 5: A remote team running it async-assisted.** A fully distributed team across time zones. The live 25-minute review still happens on video, but the prep is more formalized: reps update CRM and add a short async note on each triaged deal *before* the meeting, the manager's pre-read incorporates those notes, and the conversation-intelligence tool (Gong or similar) means the manager can have actually reviewed call recordings async rather than relying on narration. The live review is even tighter because more discovery moved async. The risk is that "async-assisted" becomes "async-only" and the review degrades into a shared doc nobody pressure-tests — so the live 25 minutes stays sacred, it is just better-prepped.

## The Decision Framework

For a VP or manager standing up — or fixing — a weekly pipeline review, the framework is a sequence, and the order matters.

**Set the time box.** Commit to 25 minutes, publicly, and mean it. The time box is the forcing function; without it, nothing else holds. Make the clock visible and end on time, every time, until the team believes it.

**Require the prep.** Define what rep prep means (CRM hygiene before the meeting) and what manager prep means (the pre-read producing the triaged list). Enforce rep prep through the review itself — stale pipelines get inspected hardest. The prep is what makes the 25 minutes possible; install it before anything else.

**Triage to the deals that matter.** Make the triage rule explicit: commit deals, big best-case deals, slipped deals, at-risk deals get the room; early pipeline, unchanged healthy deals, tiny deals get skipped. Tell the team the rule so they understand why their deal did or did not come up.

**Run the minute-by-minute agenda.** The number (0-3), commit pressure-tested (3-8), swing deals unstuck (8-16), risks and slips (16-22), actions and owners (22-25). Run it the same way every week so it becomes muscle memory.

**End every deal with an action.** Action, owner, date — no exceptions. Do the readback in the final three minutes. This is what converts the review from conversation to accountability.

**Measure forecast accuracy.** Track the four metrics — forecast accuracy trend, slip rate, commit-to-close conversion, rep forecasting accuracy over time. The review is a process; an unmeasured process drifts.

**Tune.** Adjust the content to the motion (SMB velocity vs enterprise depth), watch the metrics, and fix the review when they go the wrong way. The structure is constant; the content flexes.

Follow the sequence and the review works. Skip a step — usually the prep, sometimes the measurement — and the review slides back toward the status update. The framework is not complicated. It is just unforgiving about the order.

## 5-Year Outlook

The weekly pipeline review in five years is recognizably the same meeting — humans, a time box, deals, decisions — but the prep and the inspection get a major AI upgrade, and that upgrade makes the human 25 minutes *more* valuable, not less.

**AI-prepped reviews.** The manager's pre-read is the first thing AI takes over. Instead of the manager manually scanning the pipeline to build the triaged list, the forecasting platform's AI surfaces it: here are the 8 deals that need the room this week, here is why each one made the list, here is the risk signal that flagged it, here is the close-date change, here is the engagement drop. The AI does the discovery; the manager does the judgment. The pre-read goes from 20 minutes of hunting to 5 minutes of reviewing the AI's list and overriding where the manager's judgment disagrees.

**AI-surfaced risk and questions.** The conversation-intelligence and forecasting tools already flag risk; in five years they flag it earlier and more precisely, and they suggest the inspection questions. "This commit deal — the rep has not had contact with the economic buyer in 18 days, and the last call did not mention a compelling event. Suggested question: confirm the compelling event and the EB's commitment." The AI is not making the call; it is loading the manager's question for them.

**AI-drafted forecasts the human pressure-tests.** Increasingly the *first-draft forecast* is the AI's — based on deal signals, historical conversion, engagement data — and the review becomes the human pressure-test of the machine's number. The rep and manager are no longer assembling the forecast from scratch; they are interrogating and correcting an AI baseline, which is faster and arguably starts from a less optimistic place than rep self-reporting.

**What stays human.** The judgment stays human. The AI can flag that a champion went quiet; it cannot know that the champion is quiet because they are about to be promoted into the buying role, which the rep learned on a call. The AI can score a deal as at-risk; it cannot decide whether to escalate, pull in an exec, or let the rep run it. The coaching stays human — the manager watching a rep defend deals and seeing the skill gap. And the accountability stays human — the action, the owner, the date, the readback, the social contract of committing in front of the team.

Net: in five years the 25-minute review is better-prepped, sharper, and starts from a more honest baseline, because AI removed most of the discovery and surfacing work. The human time gets concentrated on the highest-leverage things — judgment, decision, coaching, accountability — which is exactly where it should have been all along. The constraint, the triage, the three jobs, the action orientation: all still there. The AI just makes the prep that powers them nearly free.

## Final Framework

The operator playbook for a 25-minute weekly pipeline review that drives real forecast accuracy comes down to a small set of load-bearing pieces.

**The agenda template.** 0-3: the number versus quota and the gap. 3-8: commit deals pressure-tested against criteria. 8-16: the swing deals that can move the number, unstuck with actions. 16-22: risks and slips, each one decided. 22-25: action readback — deal, action, owner, date.

**The deal-inspection question bank.** Who is the economic buyer and have you met them? What is the compelling event and what happens if it slips? Walk me through the path to signature. What does the mutual action plan say is next, and is the buyer working it? What is the quantified problem and whose number does it move? Who is the competition and why would you lose? Never "how's it going."

**The prep checklist.** Reps: close dates honest, stages real, next steps logged with dates, amounts current — before the meeting. Manager: pre-read the pipeline, produce the triaged list of 6-10 deals, write the specific question for each. Shared: one review dashboard, same view every week.

**The triage rule.** Review: commit deals, big best-case deals, slipped deals, at-risk deals. Skip: early pipeline, unchanged healthy deals, tiny deals.

**The accuracy scorecard.** Forecast accuracy trend (is the gap shrinking). Slip rate (is it falling). Commit-to-close conversion (is it high and stable). Rep forecasting accuracy over time (is each rep getting better).

**The rules that hold it together.** The time box is real and enforced. The prep makes the meeting short. Triage hard — do not review every deal. Every deal ends with an action, an owner, a date. The review inspects the forecast; the 1:1 develops the rep. The weekly review nests inside the monthly deal review and quarterly business review. Measure it, or it rots.

That is the playbook. None of it is exotic. All of it is hard to sustain, because the gravity of every sales meeting pulls toward the comfortable happy-hour status update, and only deliberate, enforced discipline keeps the review doing the three things — pressure-test the commit, unstick the swing deals, catch the risks early — that actually make a forecast accurate. The 25 minutes is not the point. The discipline the 25 minutes forces is the point.

`;

const flow = `

## The 25-Minute Review Agenda And Triage Filter

\`\`\`mermaid
flowchart TD
  A[Full Pipeline Hundreds Of Deals] --> B{Triage Filter Applied In Manager Pre-Read}
  B -->|Review| C1[Commit Deals]
  B -->|Review| C2[Big Best-Case Deals]
  B -->|Review| C3[Slipped Deals]
  B -->|Review| C4[At-Risk Signal Deals]
  B -->|Skip| S1[Early Pipeline Noise]
  B -->|Skip| S2[Unchanged Healthy Deals]
  B -->|Skip| S3[Tiny Deals]
  C1 --> D[Triaged List 6 To 10 Deals]
  C2 --> D
  C3 --> D
  C4 --> D
  D --> E1[Minutes 0-3 The Number Versus Quota And Gap]
  E1 --> E2[Minutes 3-8 Commit Deals Pressure-Tested]
  E2 --> E3[Minutes 8-16 Swing Deals Unstuck With Actions]
  E3 --> E4[Minutes 16-22 Risks And Slips Each One Decided]
  E4 --> E5[Minutes 22-25 Action Readback Deal Owner Date]
  E5 --> F[Every Deal Has Action Owner Date]
  F --> G[Forecast Corrected This Week With Runway To Act]
  G --> H[Compounds Into Forecast Accuracy Over Quarters]
\`\`\`

## The Deal-Triage Decision Tree

\`\`\`mermaid
flowchart TD
  A[Open Deal In Pipeline] --> B{In The Commit Category}
  B -->|Yes| R1[REVIEW Pressure-Test The Commit Criteria]
  B -->|No| C{Large Best-Case Deal That Could Swing The Quarter}
  C -->|Yes| R2[REVIEW Unstick It Assign Action]
  C -->|No| D{Close Date Slipped Since Last Week}
  D -->|Yes| R3[REVIEW Why Did It Move Is New Date Real]
  D -->|No| E{Showing A Risk Signal Quiet Champion Stalled Stage Overdue Next Step}
  E -->|Yes| R4[REVIEW Decide Keep Move Out Or Recover]
  E -->|No| F{Early Stage Far From Close}
  F -->|Yes| S1[SKIP Belongs In Monthly Deal Review]
  F -->|No| G{Too Small To Move The Number}
  G -->|Yes| S2[SKIP Not Worth Team Attention]
  G -->|No| H{Healthy On-Track Unchanged Since Last Week}
  H -->|Yes| S3[SKIP Clean Pipeline Earns Autonomy]
  H -->|No| R5[REVIEW If Genuinely Uncertain Default To Inspect]
  R1 --> Z[Triaged List For The 25-Minute Review]
  R2 --> Z
  R3 --> Z
  R4 --> Z
  R5 --> Z
\`\`\`

`;

const src = `

## Sources

1. **MEDDIC / MEDDPICC Qualification Framework** — The deal-qualification methodology underpinning the inspection question bank (Metrics, Economic buyer, Decision criteria, Decision process, Paper process, Identify pain, Champion, Competition). Originated at PTC; widely adopted across enterprise SaaS sales.
2. **The MEDDICC Organization / Andy Whyte, "MEDDICC" (book)** — Practitioner reference on applying MEDDICC to deal inspection and forecast discipline. https://www.meddicc.com
3. **Clari — Revenue Operations and Forecasting Platform** — Forecast roll-up, deal-level risk scoring, slip tracking, and pipeline inspection tooling referenced in the tooling section. https://www.clari.com
4. **Gong — Revenue Intelligence / Conversation Intelligence Platform** — Call-recording analysis, deal-warning signals, and engagement tracking used to inspect deals on evidence rather than rep narration. https://www.gong.io
5. **BoostUp — Revenue Intelligence and Forecasting Platform** — Forecast accuracy, deal inspection, and pipeline analytics tooling. https://www.boostup.ai
6. **Salesforce — CRM as System of Record** — Pipeline, stages, close dates, forecast categories, and saved-report/dashboard architecture for the shared review artifact. https://www.salesforce.com
7. **Salesforce Forecasting / Collaborative Forecasts Documentation** — Forecast category definitions (Commit, Best Case, Pipeline, Closed) and roll-up mechanics. https://help.salesforce.com
8. **The Force Management — Command of the Message / Command of the Sale** — Sales methodology covering compelling events, value framing, and forecast qualification rigor.
9. **Winning by Design — Sales Process and Pipeline Frameworks** — Bowtie model, stage-conversion benchmarking, and revenue-cadence design. https://winningbydesign.com
10. **John McMahon, "The Qualified Sales Leader" (book)** — Practitioner reference on running forecast calls, commit discipline, and the CRO-to-manager review cadence.
11. **Sandler / "The Sandler Rules" — Mutual Action Plan and Up-Front Contract concepts** — Source material for the mutual-action-plan inspection questions.
12. **Pavilion (formerly Revenue Collective) — Sales Leadership Community Resources** — Operator playbooks on weekly pipeline-review cadence and forecast-meeting structure.
13. **SaaStr — Pipeline Review and Forecast Cadence Content** — VP Sales and CRO practitioner content on weekly review discipline and time-boxing. https://www.saastr.com
14. **Harvard Business Review — "Why Sales Forecasts Are So Often Wrong"** — Research on systematic optimism bias in rep-reported forecasts.
15. **CSO Insights / Gartner Sales Research — Forecast Accuracy Benchmarks** — Industry data on commit-to-close conversion rates and forecast-accuracy distributions.
16. **Mike Weinberg, "Sales Management. Simplified." (book)** — Practitioner reference on running effective team sales meetings and avoiding the status-update trap.
17. **The Brutal Truth / B2B Sales Methodology Sources** — Deal-inspection question design and the distinction between narration and inspection.
18. **HubSpot Sales — Pipeline Management and Forecast Category Documentation** — Alternative CRM reference for pipeline stages and forecast categories. https://www.hubspot.com
19. **Outreach / Salesloft — Sales Engagement and Activity Signal Data** — Engagement and activity-signal tracking that feeds risk identification in the pre-read.
20. **Atrium / RevOps Analytics Sources** — Slip-rate, stage-conversion, and rep-level forecast-accuracy measurement methodology.
21. **Force Management & MEDDICC Field Notes — Compelling Event Definition** — Operational definition of a compelling event as a dated, consequence-bearing buyer deadline.
22. **The RevOps Co-op / Modern Sales Pros Communities** — Operator discussions of cadence architecture (weekly / monthly / quarterly) and multi-manager roll-up review.
23. **Gartner — "The New Sales Forecasting Model"** — Research on inspection-based versus narration-based forecasting and accuracy outcomes.
24. **Korn Ferry / Miller Heiman Strategic Selling — Blue Sheet and Buying Influences** — Source material for economic-buyer and decision-process inspection questions.

`;

const num = `

## Numbers

**The Time Box**
- Weekly review length: 25 minutes (hard time box)
- Buffer before next meeting: 5 minutes (why 25, not 30)
- Minutes 0-3: the number versus quota and the gap (3 min)
- Minutes 3-8: commit deals pressure-tested (5 min)
- Minutes 8-16: swing deals unstuck with actions (8 min — largest block)
- Minutes 16-22: risks and slips (6 min)
- Minutes 22-25: action readback (3 min)

**Prep Investment**
- Manager pre-read: 15-20 minutes before the review
- Rep CRM hygiene: typically 20-40 minutes per rep before the review
- Triaged deal list size: 6-10 deals per weekly review
- Discovery moved out of the meeting via prep: the entire reason 25 minutes is possible

**Triage Ratios (Illustrative Healthy Team)**
- Open deals per rep (enterprise motion): 8-15
- Open deals per rep (SMB motion): 30-60+
- Deals reviewed in the weekly review: 6-10 across the whole team
- Percentage of total pipeline reviewed weekly: often under 5-10%
- Percentage skipped by triage: the large majority — by design

**Cadence Architecture**
- Weekly review: 25 minutes — this period's number
- Monthly deal review: 60-90 minutes — deeper deals, early-pipeline health
- Quarterly business review: half-day+ — the system, trends, the motion
- CRO review of managers: 25 minutes, mirrors the rep-level review

**Forecast Accuracy Benchmarks**
- Commit-to-close conversion, disciplined team: 85-90%+ and stable
- Commit-to-close conversion, "feels good" team: 50-75% and volatile
- Forecast accuracy goal: gap between committed and actual shrinking quarter over quarter
- Slip rate goal: declining over time as commit criteria and early-catching take hold

**Slip Catching Economics**
- Slip caught in week 1 of quarter: ~11 weeks of runway to respond
- Slip caught in week 12 of quarter: 0 weeks — it is just a miss
- Deal that slips once: gets hard questioning on what changed
- Deal that slips twice: gets escalated, manager may join next call
- Deal that slips three times: not a date problem — remove from forecast

**The Four Scorecard Metrics**
- Forecast accuracy trend: committed number vs actual closed, tracked quarterly
- Slip rate: percentage of deals with pushed close dates, and push frequency
- Commit-to-close conversion: percentage of commit deals that closed in period
- Rep forecasting accuracy: each rep's personal forecast accuracy, quarter over quarter

**Commit Criteria Checklist (Workable Bar)**
- Economic buyer identified AND personally met
- Real compelling event with a date
- Buyer has verbally agreed to move forward
- Pricing presented and not a blocker
- Path to signature known and short
- Mutual action plan current and buyer is working it
- No unresolved red flags
- Miss one or more: it is best-case, not commit

**Deal-Inspection Question Bank (Core 6)**
- Economic buyer: who, have you met them, when, what did they say
- Compelling event: what is it, what happens to the buyer if it slips
- Decision process: walk me through the path to a signed contract
- Mutual action plan: what is next, is the buyer working it
- Metrics and pain: quantified problem, whose number, did the buyer agree
- Competition: who else, what do they like, why would you lose

**Behaviors That Kill The Review (7)**
- Rep deal-narration instead of being inspected
- Manager solving the deal instead of coaching the rep
- Rabbit-holing one deal at the expense of the rest
- Live CRM updates during the meeting
- No time box enforcement (drifts to 40+ minutes)
- Skipping the action readback
- Celebrating closed deals in the review (belongs elsewhere)

**Motion Adaptation**
- SMB / transactional: review flow and cohorts, not 6 deep inspections
- Enterprise: deep on few deals, biggest deals may need dedicated reviews
- Mid-market: a blend — structure constant, content flexes
- Constant across all motions: time box, prep, triage, three jobs, action orientation

**The Three Jobs (everything else is theater)**
- 1: Pressure-test the commit
- 2: Unstick the deals that can move the number
- 3: Catch the risks early

**Decision Framework Sequence (7 steps, order matters)**
- 1: Set the time box
- 2: Require the prep
- 3: Triage to the deals that matter
- 4: Run the minute-by-minute agenda
- 5: End every deal with an action
- 6: Measure forecast accuracy
- 7: Tune to the motion

`;

const counter = `

## Counter-Case: When The Rigid 25-Minute Playbook Is The Wrong Fit

The 25-minute playbook is a strong default for most sales teams most of the time. But a serious operator should know exactly when it is the wrong tool, because applying it where it does not fit does real damage — it can kill the judgment and coaching that were actually moving deals, and it can create a false sense of rigor over a forecast that is broken for reasons no review can fix.

**Counter 1 — The tiny team where a looser conversation genuinely works better.** A two- or three-person sales team with a manager who is close to every deal does not need a triage filter, a minute-by-minute agenda, and an action readback. The manager already knows every deal in detail; the overhead of the formal playbook buys nothing and costs the natural, high-bandwidth conversation that a small team can have. Forcing the 25-minute structure on a 3-person team is proceduralizing something that did not need a procedure. Small teams should keep the *principles* — inspect don't narrate, catch slips early, end with actions — but the formal apparatus is overkill until the team is large enough that the manager cannot hold every deal in their head.

**Counter 2 — The enterprise team with four deals a quarter that each need 30 minutes alone.** At the far enterprise end — six- and seven-figure deals, year-long cycles, a rep carrying three to six opportunities — the 25-minute weekly review is the wrong container for the deals that decide the quarter. A single strategic deal can need 30-45 minutes of deep inspection on its own: the account map, the buying committee, the multi-thread status, the procurement path, the competitive dynamics. Trying to cram that into a shared 25-minute review either shortchanges the deal or blows the time box. The right structure here is dedicated per-deal reviews for the handful of deals that matter, with the weekly "review" reduced to a fast pulse-and-risk-scan. The 25-minute playbook assumes enough deal volume that triage-and-inspect-the-top-8 is the right move; pure enterprise violates that assumption.

**Counter 3 — When the review is disciplined but the forecast is still wrong because the real problem is upstream.** This is the most important counter-case, because it is the one that fools people. A team can run a flawless 25-minute review — perfect prep, hard triage, real commit criteria, every deal ending in an action — and still miss the forecast badly, quarter after quarter. When that happens, the review is not the problem and tightening the review further will not help. The problem is upstream. **Pipeline generation:** if the team has 1.5x coverage when it needs 3-4x, no amount of inspecting the existing deals creates the deals that are not there. The review can only manage the pipeline that exists; it cannot manufacture pipeline. **Product-market fit:** if deals are stalling because the product genuinely does not solve the buyer's problem well enough, the review will dutifully catch every slip and assign every action, and the deals will still not close, because the blocker is the product, not the process. **Targeting:** if the ICP is wrong and the team is selling to buyers who will never really buy, the review inspects deals that were never real. In all three cases, a disciplined review actually does harm by *obscuring* the real problem — it makes leadership feel like the pipeline is being well managed, which delays the harder conversation about coverage, fit, or targeting. The review is a downstream control. It cannot fix an upstream break, and treating it as if it can is a classic, expensive mistake.

**Counter 4 — When over-proceduralizing the review kills the judgment and coaching that actually moved deals.** The 25-minute playbook is a forcing function, and forcing functions have a cost: they can crowd out the unstructured, judgment-heavy conversation that is sometimes exactly what a deal or a rep needs. If the manager is so rigidly working the agenda and the clock that they cut off the rep who was three sentences from a real insight about why the deal is actually stuck — that is the playbook destroying value. If "every deal ends with an action" becomes so mechanical that the team manufactures hollow actions just to satisfy the rule — "follow up with the buyer" — the rule has become theater of a different kind. If the time box is enforced so hard that a genuinely important, genuinely complex deal never gets the conversation it needs because "we're out of time" — the discipline has eaten the substance. The playbook is a servant, not a master. A great manager uses the structure to *prevent the lazy default* (narration, no triage, no output) and then has the judgment to break the structure when a specific deal or rep genuinely needs more. A manager who cannot tell the difference between "the team is drifting into a status update" (enforce the structure) and "this deal needs a real conversation" (suspend the structure) will, with the best intentions, proceduralize the judgment right out of the room.

**Counter 5 — When the team's deals are so heterogeneous that a single agenda cannot serve them.** Some teams carry a genuinely mixed bag — a few transactional deals, a few mid-market deals, one or two enterprise whales — all in the same rep's pipeline. A single 25-minute agenda with a single triage rule struggles here, because the right inspection depth for the whale is wrong for the transactional deal and vice versa. These teams often need a split cadence — a fast transactional pulse plus separate deeper reviews for the large deals — rather than one review trying to serve every deal type.

**The honest verdict.** The 25-minute weekly pipeline review is the right default for the large middle of the market: teams with enough deal volume that triage matters, deals consistent enough that one agenda serves them, a manager far enough from the deals that structure adds rigor, and a pipeline healthy enough that inspection is the actual constraint. Outside that middle — tiny teams, pure enterprise, broken pipeline generation or product-market fit, heterogeneous deal mixes — the playbook needs to be adapted or set aside, and the operator's real skill is knowing which situation they are in. The worst outcome is running a beautiful 25-minute review every week while the forecast misses every quarter because the problem was never the review. Discipline in the review is necessary. It is not always sufficient, and it is occasionally beside the point.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a bookkeeping business in 2027? (RevOps-adjacent operator playbook reference.)
- **q9502** — How do you start a CPA firm in 2027? (Adjacent professional-services operator content.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Pipeline-generation upstream of the review.)
- **q9520** — How do you run a quarterly business review that actually changes the sales motion? (The QBR layer of the cadence architecture.)
- **q9521** — What is the operator playbook for a monthly deal review? (The monthly layer that absorbs what the weekly review skips.)
- **q9522** — How do you build a sales forecast that leadership can trust? (Forecast construction; the review pressure-tests this.)
- **q9523** — What does MEDDPICC actually look like in practice? (The qualification framework behind the inspection question bank.)
- **q9524** — How do you define forecast categories that mean something? (Commit / best-case / pipeline definitions enforced by the review.)
- **q9525** — How do you run a 1:1 with a sales rep that drives performance? (The 1:1 layer — where deep skill coaching belongs.)
- **q9526** — What is a compelling event and how do you pressure-test one? (Core deal-inspection question deep dive.)
- **q9527** — How do you identify and meet the economic buyer? (Core deal-inspection question deep dive.)
- **q9528** — How do you build and run a mutual action plan? (Core deal-inspection question deep dive.)
- **q9529** — How do you measure and improve sales forecast accuracy? (The accuracy scorecard deep dive.)
- **q9530** — How do you catch a slipping deal before it slips? (Early-slip-catching deep dive.)
- **q9531** — How do you coach a sales rep to forecast their own deals accurately? (The rep-forecasting-muscle compounding mechanism.)
- **q9532** — What is the right pipeline coverage ratio by sales motion? (Upstream pipeline-generation health — counter-case context.)
- **q9533** — How does a CRO run a forecast review with frontline managers? (The mirrored multi-manager roll-up review.)
- **q9534** — How do you set up Salesforce dashboards for pipeline review? (The shared-artifact tooling deep dive.)
- **q9535** — Clari vs Gong vs BoostUp — which revenue intelligence tool? (The deal-inspection tooling comparison.)
- **q9536** — How do you run pipeline review for a transactional SMB sales team? (Motion-specific adaptation deep dive.)
- **q9537** — How do you run pipeline review for an enterprise sales team? (Motion-specific adaptation deep dive.)
- **q9538** — How do you fix a sales team where the forecast is always wrong? (Diagnostic playbook — review vs upstream problems.)
- **q9539** — How do you build a weekly sales cadence that scales? (The full cadence architecture.)
- **q9540** — What sales meetings should a VP of Sales actually run? (Meeting-portfolio design context.)
- **q9541** — How do you run a pipeline review on a fully remote sales team? (Async-assisted review adaptation.)
- **q9542** — How do you onboard a newly promoted sales manager? (New-manager scenario deep dive.)
- **q9543** — How do you triage a sales quarter that is behind? (Behind-quarter scenario deep dive.)
- **q9544** — What is the difference between sales inspection and sales coaching? (The inspect-vs-coach distinction deep dive.)
- **q9545** — How will AI change sales forecasting by 2030? (The 5-year-outlook context.)
- **q9601** — How do you start a fractional CFO business in 2027? (RevOps-adjacent operator content.)

`;

const tags = ['sales','revops','pipeline-review','forecast-accuracy','sales-management','meddpicc','sales-cadence','crm','vp-sales','operator-playbook'];

const sources = [
  { title: 'MEDDIC / MEDDPICC Qualification Framework', url: 'https://www.meddicc.com' },
  { title: 'Clari — Revenue Operations and Forecasting Platform', url: 'https://www.clari.com' },
  { title: 'Gong — Revenue Intelligence Platform', url: 'https://www.gong.io' }
];

const notes = {
  s6: 'Added 24 cited sources: MEDDIC/MEDDPICC qualification framework and the MEDDICC organization/Andy Whyte book, revenue intelligence and forecasting platforms (Clari, Gong, BoostUp, Outreach, Salesloft, Atrium), Salesforce as CRM system of record plus Collaborative Forecasts documentation, sales methodology sources (Force Management Command of the Message, Winning by Design, Sandler, Miller Heiman Strategic Selling), practitioner books (John McMahon "The Qualified Sales Leader", Mike Weinberg "Sales Management. Simplified."), research on forecast optimism bias (HBR, Gartner, CSO Insights), and operator communities (Pavilion, SaaStr, RevOps Co-op, Modern Sales Pros).',
  s7: 'Added comprehensive numerical analysis: the 25-minute time box broken down minute-by-minute (0-3 number, 3-8 commit, 8-16 swing deals, 16-22 risks, 22-25 readback), prep investment (15-20 min manager pre-read, 20-40 min rep hygiene), triage ratios by motion (8-15 enterprise vs 30-60+ SMB open deals per rep, 6-10 deals reviewed weekly, <5-10% of pipeline reviewed), cadence architecture timings, forecast accuracy benchmarks (85-90%+ commit-to-close for disciplined teams vs 50-75% volatile for "feels good" teams), slip-catching economics (week 1 = 11 weeks runway, week 12 = a miss), the four scorecard metrics, the commit criteria checklist, the core-6 deal-inspection question bank, the 7 review-killing behaviors, motion adaptations, the three jobs, and the 7-step decision framework sequence.',
  s8: 'Added 5-part counter-case on when the rigid 25-minute playbook is the wrong fit: the tiny team where a looser high-bandwidth conversation works better and the formal apparatus is overkill; the pure-enterprise team with four deals a quarter that each need 30+ minutes of dedicated inspection; the critical case where the review is disciplined but the forecast is still wrong because the real problem is upstream (pipeline generation coverage, product-market fit, or ICP targeting) and a disciplined review actively obscures the real problem; when over-proceduralizing kills the judgment and coaching that actually moved deals (cutting off real insight, manufacturing hollow actions, time-boxing away substance); and the heterogeneous-deal-mix team where one agenda cannot serve transactional and enterprise deals in the same pipeline. Honest verdict on the right default middle of the market vs the edges.',
  s9: 'Cross-linked 29 related Pulse entries: the cadence-architecture layers (q9520 QBR, q9521 monthly deal review, q9539 weekly cadence, q9540 VP meeting portfolio), forecast and qualification deep dives (q9522 trustworthy forecast, q9523 MEDDPICC in practice, q9524 forecast categories, q9526 compelling event, q9527 economic buyer, q9528 mutual action plan, q9529 forecast accuracy measurement, q9530 catching slips), coaching and people (q9525 1:1s, q9531 rep forecasting muscle, q9544 inspection vs coaching, q9542 new manager onboarding), upstream and diagnostic (q9532 pipeline coverage, q9538 fixing a wrong forecast, q9543 triaging a behind quarter), multi-manager and motion adaptations (q9533 CRO review, q9536 SMB review, q9537 enterprise review, q9541 remote review), tooling (q9534 Salesforce dashboards, q9535 Clari vs Gong vs BoostUp), outlook (q9545 AI sales forecasting 2030), and RevOps-adjacent operator content (q9501, q9502, q1899, q9601).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the operator playbook for a 25-minute weekly pipeline review that drives real forecast accuracy. Two mermaid diagrams (the 25-minute agenda with the triage filter shown upstream feeding the minute-by-minute flow; the deal-triage decision tree determining which deals get reviewed vs skipped). Full coverage: why most reviews fail (the happy-hour status update — rep narration, no triage, no output), the 25-minute constraint as a feature that forces triage, the prep requirement (rep CRM hygiene + manager pre-read + shared artifact), the three jobs (pressure-test commit, unstick swing deals, catch risks early), the triage model (review commit/big-best-case/slipped/at-risk; skip early-pipeline/unchanged/tiny), the minute-by-minute agenda (0-3 number, 3-8 commit, 8-16 swing, 16-22 risks, 22-25 readback), the MEDDPICC-driven deal-inspection question bank, commit discipline and what "commit" must mean, catching the slip early (week 1 vs week 3), the action-orientation rule (action/owner/date, no exceptions), manager pre-read and rep CRM hygiene, the forecast-accuracy connection (early slip catching + honest categories + rep forecasting muscle + weekly correction loop), the cadence architecture (weekly/monthly/quarterly + CRO mirror), the 1:1 vs team review question, running it across a multi-manager org, the tooling (Salesforce + Clari/Gong/BoostUp + the pre-built review dashboard), the behaviors that kill the 25 minutes, coaching in vs outside the review, measuring whether it works (forecast accuracy trend, slip rate, commit-to-close conversion, rep forecasting accuracy), adapting by motion (SMB velocity vs enterprise depth), 5 real-world scenarios, the 7-step decision framework, the 5-year outlook (AI-prepped reviews), and a final framework. Counter-case covers tiny teams, pure enterprise, upstream-problem masking, over-proceduralization killing judgment, and heterogeneous deal mixes.'
};

runPolish({ id: 'q9519', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
