// st0032 -- The Closed-Lost Win-Back Sprint: Re-Engaging Dead Deals Without
// Begging -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0032, tag:
// sales-training). Six-section runnable 60-minute meeting template. New core
// sales-coaching topic (not an industry-vertical entry): coaching reps + sales
// managers to systematically re-engage closed-lost opportunities -- the 6-12
// month-old "we went with someone else" / "no decision" / "timing" deals --
// and convert a measurable share back into pipeline without discounting,
// without begging, and without burning the relationship.
// Stages: SEGMENT / SIGNAL / SCRIPT / SEQUENCE / SIT-DOWN / SCORE.
// Creates shell at quality_score 5 via direct blob write, then polishes
// 5 -> 6 -> 7 -> 8 -> 9 via pulse-blob-polish POSTs.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const BLOBS_PAT = 'nfp_JSsTaZjcMASrsrXJRgt6yG4Zipnovvwia6f0';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const ID = 'st0032';
const QUESTION = "The Closed-Lost Win-Back Sprint: Re-Engaging Dead Deals Without Begging — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'st0032',
  'closed-lost-win-back',
  'win-back-sprint',
  'pipeline-reactivation',
  'dead-deal-revival',
  'no-decision-recovery',
  'lost-deal-debrief',
  'revops-pipeline-recycling',
  'displacement-selling',
  'sales-manager-coaching',
  '60-min-meeting',
  'standard-team'
];

const baseAnswer = `> ### 🔁 The Pulse Training
> **Who this is for:** **AEs, SDRs, account managers, and front-line sales managers** who have a graveyard of closed-lost opportunities sitting untouched in the CRM. Every B2B sales org loses 60-75% of its qualified pipeline — and most of that "loss" is recoverable. This 60-minute training teaches the **CLOSED-LOST WIN-BACK SPRINT**: a repeatable motion to re-open dead deals **without discounting, without begging, and without torching the relationship**. Run it once a quarter, ideally 30-45 days before quarter-end when reps need pipeline and the easiest pipeline is the pipeline you already created once.
>
> **What teams leave with:** The **6-STAGE WIN-BACK SPRINT (SEGMENT → SIGNAL → SCRIPT → SEQUENCE → SIT-DOWN → SCORE)**, the **4 win-back myths** that keep reps frozen, two role-plays, a re-engagement script library, and a leave-behind one-pager.

## MEETING AGENDA — 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Cold Open** — Rep A blasts "just checking in" to 40 lost deals, gets 1 reply (unsubscribe). Rep B segments 40 down to 9, watches for trigger events, leads with a reason to talk — books 4 meetings, closes 1 | Manager | Win-back is a motion, not a follow-up |
| **0:10-0:35** | **Teach** — 6-STAGE SPRINT + 4 win-back myths + the loss-reason taxonomy | Manager | Recite 6 stages + 4 myths |
| **0:35-0:45** | **Discussion** — 8 prompts on which deals to revive, which to bury, trigger events, discount discipline | Manager + room | Audit last 20 losses |
| **0:45-1:05** | **Role-Play x 2** — R1: "no-decision" deal 8 months cold. R2: "we picked a competitor" deal at renewal window | Pairs | Run the sprint live |
| **1:05-1:10** | **Debrief + Commitments** — pick 5 deals, name the trigger, book the touch | Manager | Sprint list built in the room |
| **1:10-1:13** | **Leave-Behind** — Win-Back Sprint Card + script library | Manager | One-pager in every rep's hands |

> ### 🎯 Bottom Line
> A buyer who told you "no" 9 months ago is not the same buyer today. Vendors fail, champions get promoted, budgets reset, contracts come up for renewal, and "no decision" quietly becomes "still no solution." The win-back sprint is how you catch that moment on purpose instead of by luck. **Reps who run the sprint convert 8-15% of revived deals; reps who "check in" convert under 2% and train buyers to ignore them.** Six stages. Four myths. A reason to talk — every time.

---

## SECTION 1 — INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do not open with a CRM report. Open with the two-rep story and the one number that matters: most teams never touch 80%+ of their closed-lost pipeline. Ten minutes. Hard stop at 0:10.

### The numbers, then the story.

**The numbers.** A typical B2B team converts 15-25% of qualified opportunities to closed-won. The other 75-85% goes to closed-lost — and the dominant single sub-reason is not "lost to competitor," it is **"no decision."** Indecision, not competition, is the largest line item in the loss column. Yet "no decision" is the *most* recoverable loss type, because nothing was actually solved — the buyer's problem is still sitting there, now older and more expensive.

**The story.** **Rep A** exported 40 closed-lost deals and sent all 40 the same email: *"Hi — just checking in to see if anything has changed on your end!"* Result: 3 opens, 1 reply, and that reply was an unsubscribe. The list is now colder than before.

**Rep B** took the same 40, threw out 18 that were genuinely dead (company acquired, champion gone, hard "never"), and kept 22. Of those, she flagged 9 that hit a **trigger event** — a competitor's contract renewal window, a new VP, a funding round, a job posting that signaled the old pain was back. She reached out to those 9 with a *specific reason*, not a check-in. She booked 4 meetings and closed 1 — a deal that had been dead for 8 months.

> ### ⚠️ Common Trap
> *"Win-back is just persistent follow-up."* No. Follow-up pushes the same conversation that already failed. Win-back waits for the world to change, then leads with what changed. Same buyer, new context, new conversation.

**Transition:** "Next 50 minutes — the 6-stage sprint, the 4 myths, two role-plays."

---

## SECTION 2 — THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. 6-STAGE (15 min) + 4 myths (7 min) + loss-reason taxonomy (3 min). Test: every rep recites the 6 stages and the 4 myths cold.

### Part A — The 6-Stage Win-Back Sprint

You do not win back a dead deal by emailing harder. You **SEGMENT** the graveyard so you only spend time on revivable deals, you watch for a **SIGNAL** that the buyer's world changed, you **SCRIPT** an opener that leads with that change instead of a check-in, you run a short multi-touch **SEQUENCE**, you earn a **SIT-DOWN** that re-discovers (never re-pitches), and you **SCORE** the sprint so the motion compounds every quarter.

#### Stage 1 — SEGMENT

Most closed-lost lists are 60-80% genuinely dead. Wasting touches on dead deals trains buyers to ignore you and burns your domain reputation. Sort every lost deal into four buckets: **Revivable** (no-decision, lost-to-status-quo, timing/budget) — these are the gold. **Watch** (lost-to-competitor, but the competitor contract renews on a knowable date). **Dormant** (champion left, reorg — re-qualify the new person before anything else). **Dead** (acquired, went out of business, hard "never," abusive). Only Revivable and Watch go into the sprint.

#### Stage 2 — SIGNAL

A win-back touch with no reason behind it is a check-in, and check-ins fail. The signal is your reason. Trigger events worth watching: a new executive in the buying group, a funding round or earnings miss, the competitor's contract renewal window, a relevant job posting, an M&A event, a public incident or outage, a product launch on your side that closes the exact gap that lost you the deal, or your old champion resurfacing at a new company. No signal, no touch — you wait.

#### Stage 3 — SCRIPT

The opener leads with the signal and asks for nothing on the first line. Bad: "Just checking in to see if anything changed." Good: "Saw you brought on a new VP of Ops — when we spoke last year, the blocker was that your team had no bandwidth to switch. Curious whether that calculus changed with the new leadership." You name the *original loss reason* out loud — it shows you listened, and it gives the buyer permission to admit the situation moved.

#### Stage 4 — SEQUENCE

One email is not a sprint. Run a tight 3-4 touch sequence over 10-14 days across two channels — email, phone, and one social touch — each touch adding a new angle, never repeating "did you see my email." Then stop. A clean stop preserves the relationship for the next trigger; nagging destroys it.

#### Stage 5 — SIT-DOWN

When the buyer agrees to talk, the meeting is **re-discovery, not re-pitch**. Everything you knew may be stale. Re-run discovery: What changed? Who is involved now? What did the "no decision" cost you? Is the original pain better, worse, or gone? Only after re-discovery do you decide whether this is a real opportunity again.

#### Stage 6 — SCORE

Win-back compounds only if you measure it. Track revived-to-meeting rate, meeting-to-reopened rate, reopened-to-won rate, and average days-from-loss-to-revival. Feed the patterns back: which loss reasons revive best, which triggers convert, which scripts land. Next quarter's sprint starts smarter.

### Part B — The 4 Win-Back Myths

**Myth 1 — "If they wanted us, they'd call."** Buyers do not call. They are busy, and the pain that lost you the deal rarely announces itself. Revival is the seller's job.

**Myth 2 — "I need a discount to reopen it."** Discounting on re-entry tells the buyer the first price was a lie and anchors every future negotiation down. Reopen on a *changed reason*, not a changed price.

**Myth 3 — "Reaching out again looks desperate."** Begging looks desperate. A specific, well-timed, signal-led message looks informed. The difference is whether you have a reason.

**Myth 4 — "Lost to a competitor means it's over."** It means it is over *until that contract renews.* Competitor deals are not dead — they are scheduled. Put the renewal date in your calendar and run the sprint 90-120 days before it.

### Part C — The Loss-Reason Taxonomy

Win-back priority follows loss reason. **No decision / status quo** = highest revival odds — nothing was solved. **Timing / budget** = high — the clock and the budget cycle both reset. **Lost to competitor** = medium, scheduled to the renewal date. **Lost on product gap** = revive only if you have since shipped the fix. **Lost on price with no value gap** = low — re-qualify hard before spending a touch. **Bad fit** = do not revive; it was the right call.

\`\`\`mermaid
flowchart TD
  A[Manager Opens] --> B[Section 1 Cold Open — Rep A blasts 40 check-ins gets 1 unsubscribe vs Rep B segments to 9 signal-led books 4 closes 1]
  B --> C[Section 2 Teach 25 min]
  C --> C1[Part A 6-STAGE — SEGMENT graveyard into Revivable Watch Dormant Dead / SIGNAL trigger events / SCRIPT signal-led opener / SEQUENCE 3-4 touch 10-14 day / SIT-DOWN re-discovery not re-pitch / SCORE the sprint]
  C --> C2[Part B 4 Myths — they would call / need a discount / looks desperate / competitor loss is over]
  C --> C3[Part C Loss-Reason Taxonomy — no-decision highest revival down to bad-fit do not revive]
  C1 & C2 & C3 --> D[Section 3 Discussion 8 prompts audit last 20 losses]
  D --> E[Section 4 Role-Play x2 — no-decision 8 months cold / lost-to-competitor at renewal window]
  E --> F[Section 5 Debrief pick 5 deals name trigger book touch]
  F --> G[Section 6 Leave-Behind Win-Back Sprint Card]
  G --> H[Manager Closes — sprint list built in the room]
\`\`\`

---

## SECTION 3 — THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard the 4 buckets. Each rep audits their last 20 losses out loud and sorts them. Count to five after each prompt.

**1 — "Which loss reason in your graveyard is most revivable?"** Almost always "no decision." Manager: "That is your sprint list. Start there."

**2 — "When do you bury a deal for good?"** Company acquired, champion gone with no warm intro to the replacement, hard documented "never," or three signal-led sprints with zero engagement. Manager: "Dead is a decision. Make it on purpose so you stop spending touches."

**3 — "Best trigger event you have ever used to reopen a deal?"** Collect real answers — new exec, funding, competitor outage, your own product launch. Manager: "That is the SIGNAL stage. Build a watch list."

**4 — "A buyer says 'we're happy with the competitor.' Now what?"** Find the renewal date. Manager: "Happy today, renewing in 7 months. Calendar it, sprint 90-120 days out."

**5 — "When is a discount the right re-entry move?"** Rarely — only if their requirements genuinely shrank. Manager: "Reopen on a changed reason, not a changed price."

**6 — "How many touches before you stop?"** 3-4 over 10-14 days, then a clean stop. Manager: "Stopping well is what lets you come back next trigger."

**7 — "Re-discovery vs re-pitch — what do you ask first?"** "What's changed since we last spoke?" Manager: "Never assume last year's notes are still true."

**8 — "One dead deal you will revive this week — name the trigger."** Each rep names a deal and the specific signal. Manager: "No signal, no deal. Find the reason first."

---

## SECTION 4 — TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair reps. Two scenarios, 10 minutes each, 60-second reset. Listen for a signal-led opener and re-discovery before any pitch.

### Role-Play 1 — The "No Decision" Deal, 8 Months Cold (10 min)

**Setup:** Eight months ago, a mid-market ops director ran a full eval, liked the product, then went dark and the deal was marked "no decision — timing." The rep just saw the company posted a job for a process-improvement manager. That is the signal. The rep must open on the signal, name the original blocker, and earn a re-discovery call — no pitch, no discount.

> ### 🎤 PROSPECT — Ops Director
> Polite, busy, mildly embarrassed the project stalled. Will engage if the rep gives a real reason and does not make her feel sold-to.
>
> **Deflection (min 5):** "Honestly we just never got to it — same as last year. I don't want to restart a whole process."

### Role-Play 2 — Lost to a Competitor, at the Renewal Window (10 min)

**Setup:** A year ago this deal went to a competitor. The rep tracked the competitor's standard 12-month contract and it renews in 100 days. The buyer also had a service outage last quarter (public signal). The rep must reach out 90-120 days before renewal, lead with the outage as the reason, and re-discover whether the competitor delivered — without trash-talking.

> ### 🎤 PROSPECT — VP of Operations
> Loyal-by-default, does not want to admit the competitor disappointed, but the outage stung.
>
> **Deflection (min 6):** "We've been with them a year, switching is a hassle, and I don't want to relive a sales cycle."

---

## SECTION 5 — DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief questions, then build the sprint list live.

**Debrief 1 — "Which stage was hardest?"** Usually SIGNAL — reps want to skip straight to the email. Manager: "No signal, no touch. The reason is the work."

**Debrief 2 — "Which myth do you personally believe?"** Most admit "looks desperate." Manager: "Desperate is a check-in. Informed is a signal. Pick one."

**Debrief 3 — "Re-pitch or re-discover?"** Reps default to re-pitch. Manager: "Last year's notes are stale. Re-discover first, every time."

> ### 🎤 Commitment Ritual
> Open the CRM. Each rep writes **five closed-lost deals**, the **bucket** each falls in, the **trigger** they will watch or use, and the **first touch date**. Read aloud. Manager coaches the vague: "Which deal? Which signal? Which date? Out loud now."

---

## SECTION 6 — LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 📋 Leave-Behind — "The Win-Back Sprint Card" One-Pager

> **THE 6-STAGE SPRINT:** (1) **SEGMENT** the graveyard — Revivable / Watch / Dormant / Dead; only the first two get touched. (2) **SIGNAL** — never reach out without a trigger event. (3) **SCRIPT** — lead with the signal, name the original loss reason, ask for nothing on line one. (4) **SEQUENCE** — 3-4 touches over 10-14 days, two channels, then a clean stop. (5) **SIT-DOWN** — re-discovery, not re-pitch. (6) **SCORE** — measure revived-to-meeting, reopened, and won; feed patterns into next quarter.

> **THE 4 MYTHS:** They'd call if they wanted us (they won't). I need a discount (you need a reason). It looks desperate (only without a signal). Competitor loss is over (it's scheduled to the renewal date).

> **NEVER DO:** Blast "just checking in." Discount to reopen. Re-pitch before re-discovering. Touch a Dead-bucket deal. Reach out with no signal. Nag past a clean stop.

> ### 🎯 If You Only Remember One Thing
> A "no" from 9 months ago is not a "no" today — it is an unanswered question that got older and more expensive. Win-back is not following up harder; it is waiting for the buyer's world to change, then being the first person to call with a reason. Segment the graveyard, watch for the signal, lead with what changed, re-discover before you re-pitch, and score the motion so it compounds. Every untouched closed-lost deal is either a future competitor's reference or your next quarter's pipeline — the sprint decides which.`;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: BLOBS_PAT });
  const now = Date.now();
  const record = {
    id: ID,
    question: QUESTION,
    answer: baseAnswer,
    tags,
    sources: [],
    ts: now,
    model: 'claude-opus-4-7-via-claude-code',
    quality_score: 5,
    polished_at: null,
    polish_history: []
  };
  await store.setJSON('answers/' + ID + '.json', record);
  console.log('Wrote answers/' + ID + '.json — answer chars:', baseAnswer.length);

  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) throw new Error('index missing/malformed');
  const exists = idx.entries.some(e => e.id === ID);
  if (!exists) {
    idx.entries.unshift({ id: ID, question: QUESTION, tags, ts: now, quality_score: 5, polished_at: null });
    await store.setJSON('_index.json', idx);
    console.log('Unshifted ' + ID + ' onto _index.json — total entries now:', idx.entries.length);
  } else {
    console.log(ID + ' already in index — skipped unshift');
  }
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
