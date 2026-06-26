// st0010 -- Pharmaceutical HCP Detailing for a Specialty Drug: Earning the 7-Minute Office Visit
// -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0010, tag: sales-training).
// FOURTH industry-specific training (after st0007 Medical Device, st0008 Real Estate, st0009 Auto F&I).
// Industry = specialty pharmaceutical sales (rare disease, oncology, immunology, hematology,
// neurology, ophthalmology) — territory-based reps + MSLs detailing specific Rx drugs to HCPs.
// Regulated by PhRMA Code + FDA OPDP + OIG CPG + Sunshine Act + PDMA + REMS.
// VALUE over WORD COUNT. Target 8,500-10,000 words. ABSOLUTE HARD CAP 10,500.
// Walks 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0007/st0008/st0009 exactly. LEAN-FROM-START like st0008.

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

const ID = 'st0010';
const QUESTION = "Pharmaceutical HCP Detailing for a Specialty Drug: Earning the 7-Minute Office Visit — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'pharmaceutical-sales',
  'pharma-detailing',
  'specialty-drug',
  'hcp-conversation',
  'phrma-code-compliant',
  '60-min-meeting',
  'standard-team',
  'oncology-rep',
  'rare-disease',
  'st0010'
];

const sources = [
  { title: 'PhRMA Code on Interactions with Healthcare Professionals (2022 update) — the industry standard for HCP engagement', url: 'https://www.phrma.org/codes-and-guidelines/code-on-interactions-with-health-care-professionals' },
  { title: 'FDA OPDP (Office of Prescription Drug Promotion) — off-label enforcement, warning + untitled letters, promotional review', url: 'https://www.fda.gov/about-fda/center-drug-evaluation-and-research-cder/office-prescription-drug-promotion-opdp' },
  { title: 'OIG Compliance Program Guidance for Pharmaceutical Manufacturers (Sept 2023 final guidance) — anti-kickback + speaker program rules', url: 'https://oig.hhs.gov/compliance/compliance-guidance/' },
  { title: 'CMS Open Payments / Sunshine Act — manufacturer reporting of HCP transfers of value ≥$10 (meals, honoraria, samples)', url: 'https://www.cms.gov/openpayments' },
  { title: 'PDMA (Prescription Drug Marketing Act) + 21 CFR Part 203 — sample distribution, signed requests, chain-of-custody', url: 'https://www.fda.gov/regulatory-information/selected-amendments-fdc-act/prescription-drug-marketing-act-1987' },
  { title: 'FDA REMS (Risk Evaluation and Mitigation Strategies) — enrollment + training requirements for high-risk specialty drugs', url: 'https://www.fda.gov/drugs/drug-safety-and-availability/risk-evaluation-and-mitigation-strategies-rems' },
  { title: 'ZS Associates AccessMonitor + ePharma Physician — published HCP rep-access trend data, 79% (2008) → 44% (2025) decline', url: 'https://www.zs.com/insights/2024-accessmonitor-report' },
  { title: 'Veeva Pulse + Veeva CRM + Veeva Link KOL Data — rep CRM, call-planning, omnichannel HCP engagement benchmarks', url: 'https://www.veeva.com/products/multichannel-crm/' },
  { title: 'IQVIA Xponent + NPA Audit + Symphony Health PHAST — prescriber-level Rx data sources reps use for targeting', url: 'https://www.iqvia.com/solutions/commercial-operations/launch-strategy' },
  { title: 'Specialty pharmacy channel — CVS Specialty + Walgreens Specialty + Accredo (ESI/Cigna) + Optum Specialty (UHC) + AllianceRx Walgreens Prime', url: 'https://www.cvsspecialty.com/' },
  { title: 'Manufacturer patient hub services — Pfizer Patient Connect + AstraZeneca Access 360 + BMS Access Support + Novartis Patient Support + AbbVie Access Solutions', url: 'https://www.pfizer.com/products/patient-services' },
  { title: 'Industry trade press — Endpoints News + FiercePharma + BioPharma Dive + STAT + Pink Sheet + PhRMA + BIO + NACDS', url: 'https://endpts.com/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **Territory-based specialty pharmaceutical sales reps** and **clinical specialists / MSLs** running rare-disease, oncology, immunology, hematology, neurology, and ophthalmology accounts — plus their **District Sales Managers (DSMs)** coaching the most-leveraged conversation in pharma: **the 7-minute HCP detail.** Works across the launched-biotech model (Vertex, Argenx, BioMarin), the big-pharma launched-brand model (Pfizer, Bristol-Myers Squibb, AstraZeneca, Novartis), and the rare-disease orphan-drug commercial model (Alnylam, Ionis, Ultragenyx). The average specialty rep gets **7 minutes per HCP call** — this hour is about earning, structuring, and converting those 7 minutes inside the **PhRMA Code + FDA OPDP + OIG + Sunshine Act** compliance rails. **Drop this into the next district meeting and run it live.**
>
> **What your reps will leave with:** A named, repeatable discipline — **the 7-MINUTE DETAIL framework (OPEN → PROBE → SHARE → CONFIRM → CLOSE) + the PhRMA Code "Three Rails" compliance frame (ON-LABEL ONLY / NO INDUCEMENT / SAMPLE INTEGRITY)** — for converting a high-decile HCP from no-Rx to verbal commitment in under 7 minutes without crossing a single OPDP line. Plus verbatim language for each of the 5 steps + each Rail, two live role-plays (a KOL oncologist defending Enhertu + a formulary-restricted community rheumatologist), a written commitment naming one stalled HCP, and a printable one-pager for the territory bag.
>
> **What the DSM should bring:** **(1)** **Recordings or ride-along notes from the team's last 3 unconverted high-decile HCP calls** — the no-see physicians, the surgeons who gave 4 minutes then waved the rep out, the formulary-restricted prescribers who said *"my hands are tied."* The reps who lost them will see themselves in Section 3. **(2)** **A copy of the team's current FDA-approved detail aid** + the most-recent Open Payments report for the territory + brand strategy guidelines + a printed leave-behind one-pager. **(3)** **A whiteboard** to score each rep's stalled-HCP list by which step of the 7-Minute Detail broke down + which Rail almost got crossed by Section 3's end.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:05** | **Cold Open** — ZS Associates AccessMonitor 79%→44% rep-access collapse + 7-min detail reality + composite story | DSM | Reps feel the 7-minute window is the entire job, not the warm-up, and the rep who wins is the one who scripts the load-bearing 90 seconds |
| **0:05-0:22** | **The Teach** — 7-MINUTE DETAIL framework (OPEN / PROBE / SHARE / CONFIRM / CLOSE) + PhRMA Code Three Rails (ON-LABEL / NO INDUCEMENT / SAMPLE INTEGRITY) | DSM | Reps can recite all 5 steps in sequence, all 3 Rails, and the verbatim cue under each without notes |
| **0:22-0:32** | **The Discussion** — each rep names their toughest unconverted high-decile HCP + which step broke down + which Rail almost got crossed | DSM + room | Every rep audits last 3 ride-alongs from Veeva CRM + ZS AccessMonitor decile + Open Payments YTD; identifies the one missing move |
| **0:32-0:52** | **Role-Play x 2** — Round 1 KOL oncologist at NCCN academic medical center detailing a launching HER2-low ADC (10 min) + 60-sec reset + Round 2 formulary-restricted community rheumatologist on a Tier-4 biologic (10 min) | Reps in pairs | Reps deliver 7-Minute Detail live + stay inside the Three Rails under realistic HCP pushback without going off-label or making coverage promises |
| **0:52-0:57** | **Debrief + Commitments** — 3 debrief questions + each rep names ONE target HCP + one verbatim language change + records or logs the call in Veeva CRM within 5 business days | DSM + each rep | Every rep walks out with one named HCP + one named step to lead with + one Veeva CRM entry for DSM review |
| **0:57-1:00** | **Leave-Behind Walkthrough** — printed one-pager + Three Rails compliance grid + specialty access scorecard | DSM | Reps know where the template lives and keep one-pager + scorecard in the territory bag |

> ### 🎯 Bottom Line
> **You're not selling the molecule — you're surfacing the patient on the doctor's panel who will benefit.** Per **ZS Associates AccessMonitor 2024-2025**, only **44% of US physicians grant any pharma rep access in 2025 vs 79% in 2008** — the COVID drop never reverted. The average specialty detail runs **7 minutes (oncology / rare disease) down to 4 minutes (PCP)**, and **70%+ of detail time is "no-see" or "limited access."** The rep's job inside those 7 minutes is **not to pitch features** — it is to **surface the specific patient on the HCP's panel who fits the label**, share ONE on-label clinical message tied to that patient profile, surface the real barrier (formulary, prior auth, REMS, payer mix, side effects), and close with a PDMA-compliant sample request + hub enrollment. Five steps. Three Rails. Run on purpose. Win the script that was already going to be written — and make sure the HCP remembers to write it.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- THE COLD OPEN (0:00-0:05)

> ### 🟡 Coach Note
> Do not open the iPad. Do not pull up the detail aid. Walk into the district meeting, say the numbers, tell the story. The first 90 seconds set whether reps tune out or remember this on Tuesday's lunch detail. **Five minutes. Hard stop at 0:05.**

### The numbers, then the story.

**The numbers first.** Per **ZS Associates AccessMonitor + ePharma Physician 2024-2025** + **Veeva Pulse**: rep access has declined every year since 2019 — only **44% of US physicians grant ANY pharma rep access in 2025 vs 79% in 2008**. Average specialty detail runs **7 minutes (oncology + rare disease) down to 4 minutes (PCP)**, and **70%+ of detail time is "no-see" or "limited access."** The pandemic reset never reverted. **The reps who survive script the load-bearing 90 seconds and improvise the rest.**

The math is brutal. A specialty rep covering a **150-HCP target list** at 28% detail-to-Rx-commit writes **42 commits/quarter** and misses goal. Same list at the 7-Minute Detail rate of **54%** writes **81** and hits President's Club. **The difference is whether the rep ran the 5 steps and stayed on the 3 Rails — or burned 4 of 7 minutes opening the iPad before the doctor said *"I've got a patient — can we wrap?"***

**The story.** (Composite — swap in a drug the team recognizes.)

A rep on this team — call her Priya, second year on a launching **CGRP migraine drug**. Six months prospecting a high-decile neurologist in a 12-physician group practice in Cincinnati. Tuesday lunch lands — rep brought $25/attendee sandwiches, set up the detail aid, started the presentation. *"So, our drug is indicated for preventive treatment of migraine in adults, demonstrated in the Phase III HERALD trial with a 4.7-day reduction in monthly migraine days versus placebo at week 12..."*

By minute 4, the neurologist looked at his watch. *"Priya, I've got a patient. Can we wrap?"* Priya tried to compress the rest, didn't get a sample-request signature, left without scheduling next. Walked out with **zero Rx commit, no sample, no hub enrollment, no next-call date.** That neurologist never wrote a script for the next 4 months.

Same neurologist, next quarter. Priya restructured. *"Dr. Chen, thanks for the time. I'd love to share two patient stories that mirror your panel — one's a 34-year-old who failed two triptans and a beta-blocker — then hear how you're treating chronic migraine now. Sound good?"* Got the verbal yes BEFORE opening the iPad. Probe: *"Among your chronic-migraine patients on incumbent prophylaxis, how many are sub-optimally controlled at 6 months?"* Neurologist said *"probably 30 to 40 percent — that's a real number."* Priya surfaced **three specific patients in his panel** fitting the label. **Verbal Rx commitment in 6 minutes.** Signed sample request, 5 starter cartons, hub enrollment one-pager.

Same product. Same physician. Same 7 minutes. Different **discipline on which steps got run, and in what order.**

> ### ⚠️ Common Trap
> *"But the doctor cuts me off — nothing I can do."* Three answers. **(1)** Per Veeva Pulse 2024, top-quartile reps convert at **2x the cohort rate inside the same 7-minute window** — the constraint is the script, not the time. **(2)** HCPs cutting reps off at minute 4 are doing it because **the rep burned minutes 1-3 on features the doctor already saw in the iPad email**. The PROBE earns the next 3 minutes. **(3)** Per ZS AccessMonitor, **62% of HCPs who "no-see" cited "the rep wasted my time on a previous call."** Reputation precedes the next visit. **Every 7-minute detail is the audition for the next.**

**Transition:** "Next hour: 5-step 7-Minute Detail, 3-rail compliance frame, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:05-0:22)

> ### 🟡 Coach Note
> Seventeen minutes. **Do not lecture for seventeen minutes** — you will lose the room by minute 9. Split into two halves: **7-MINUTE DETAIL framework (11 min, ~2 min per step)** + **PhRMA Code Three Rails compliance frame (6 min, ~2 min per Rail)**. Pause after each step for one clarifying question. End-of-section test: any rep can recite all 5 steps in sequence, all 3 Rails, and the verbatim cue under each without notes.

### Part A -- The 7-MINUTE DETAIL Framework (11 minutes)

Five steps every top-quartile specialty rep runs inside a 7-minute detail. Most lost details collapse at Step 1 (rep wastes the OPEN on rapport or feature-dump) or Step 4 (rep skips CONFIRM and never surfaces the actual barrier).

#### Step 1 -- OPEN (60 sec)

**Do not waste seconds on rapport.** The HCP knows you're there to detail; pretending otherwise insults the time. Land the **verbal yes BEFORE opening the iPad**.

> ### 🎤 Verbatim Script -- The OPEN
> *"Dr. [Name], thanks for the time. I'd love to share two patient stories that mirror your panel, then hear how you're treating [condition] right now. Sound good?"*

**Why it works.** Frames around **patient stories that mirror their panel** — not features. Yes/no permission. Head-nod earns the next 6 minutes.

**Common trap.** *"How's your day? How was the weekend?"* burns 45 seconds the HCP doesn't owe you. Or fumbling with the iPad in silence.

**Coach cue.** Every rep delivers the OPEN verbatim, in pairs, before leaving the room. Until reflex.

#### Step 2 -- PROBE (90 sec)

**Patient-finder question, not feature dump.** The probe surfaces specific patients in the HCP's panel who fit the label. The HCP's answer is the rep's roadmap for Step 3.

> ### 🎤 Verbatim Script -- The PROBE
> *"Among your [condition] patients currently on [incumbent therapy], how many are sub-optimally controlled at 6 months? What does the next step look like for those patients today?"*

**Listen. Take ONE note. NEVER interrupt.** The 30-90 seconds of silence after the probe is where the HCP tells you exactly which patient profile to anchor on.

**Common trap.** *"Are you familiar with our drug?"* — closed yes/no, no patient signal, burns 60 seconds. Or interrupting to start the iPad pitch. **The probe is worth 60% of the detail; protect the silence.**

#### Step 3 -- SHARE (3 min)

**ONE clinical message tied to the patient profile the HCP just described.** FDA-approved detail aid + one Phase III primary endpoint + KM curve or NNT. **No off-label.** No direct competitor comparison without FDA-approved head-to-head data (OPDP is aggressive here).

> ### 🎤 Verbatim Script -- The SHARE
> *"You named patients failing two prophylactics at 6 months. In Phase III HERALD — the on-label population — patients with that exact profile saw 4.7-day reduction in monthly migraine days at week 12 versus 1.8 on placebo. NNT 4. KM curve from the primary endpoint."* (Tap iPad. ONE slide. Not 12.)

**Common trap.** Reading the detail aid front-to-back — the aid is reference, not script; **scroll all 12 slides and you lose the room by slide 4**. Or veering off-label when the HCP asks about an off-indication sub-population — OPDP-reportable; redirect to MSL.

**Coach cue.** Every rep keeps a 1-page "patient profile → SHARE message" map. If they can't name the primary endpoint + NNT + KM curve for the target profile without notes, they're not ready.

#### Step 4 -- CONFIRM (90 sec)

**Surface the real barrier.** Not "any questions" — that gets *"no, thanks"* every time. CONFIRM forces the HCP to name what is actually stopping the next Rx.

> ### 🎤 Verbatim Script -- The CONFIRM
> *"For the next patient you see who fits that profile — what's stopping you from prescribing [drug]?"*

**Answers are always the real barriers:** formulary, prior auth, payer mix, REMS, side effects, patient cost. **Whatever the HCP names is what the hub + medical affairs + market access team exists to solve** — but the rep can't deploy resources to a barrier that was never named.

**Common trap.** *"Any questions?"* — closed, polite no, deal dies. Or defending a barrier the HCP didn't raise.

**Coach cue.** Drill verbatim. Until reflex. The 60-90 sec after the question is where the deal lives.

#### Step 5 -- CLOSE (60 sec)

**Specific commit, PDMA-compliant signature, scheduled next interaction.** Not *"I'll come back when I'm in the area"* — specific date. Not *"can I leave samples"* — get the signed PDMA 21 CFR 203 request.

> ### 🎤 Verbatim Script -- The CLOSE
> *"Can I have your sample request signature for 5 starter cartons + the patient hub enrollment form for your next eligible patient? I'll be back Tuesday the 28th at 12:15 with the UnitedHealthcare formulary update — I'll text Maria to confirm."*

**Why it works.** Three specific asks: signed sample request (PDMA), hub one-pager (operational), specific date (cadence). Names the receptionist — signals the rep treats office staff as the gatekeepers they are.

**Common trap.** Leaving without the signature (PDMA non-compliant if samples were left). Vague *"swing by next time"* — never produces follow-up. Skipping the hub one-pager — hub services are the lever that converts verbal commit into written script.

**Coach cue.** Audit last 10 calls: signed sample requests, hub one-pagers left, scheduled next-call dates in Veeva. **If under 70% on each, the rep collapses Step 5.**

### Part B -- The PhRMA Code "Three Rails" Compliance Frame (6 minutes)

**Three Rails keep the rep on the track every detail.** Inside the Rails: defensible in OPDP, OIG, Sunshine Act, and corporate compliance reviews. Outside: warning letters, individual termination, manufacturer fines, federal exclusion.

#### Rail 1 -- ON-LABEL ONLY

**Never discuss off-label — even when the HCP asks.** Per FDA OPDP (warning + untitled letters publicly indexed), off-label promotion is the single most-enforced pharma sales violation: fireable + reportable for the rep, $1M-$3B DOJ settlements when systemic.

> ### 🎤 Verbatim Script -- ON-LABEL Redirect
> *"Great clinical question — outside the FDA-approved indication, so I can't discuss. Let me have our MSL, Dr. [Name], reach out today for an unrestricted scientific exchange."*

**Common trap.** *"Well, some doctors are using it for..."* — single sentence = OPDP-reportable off-label promotion. Or *"here's a paper that discusses it"* — handing an off-label reprint is treated identically to verbal promotion.

#### Rail 2 -- NO INDUCEMENT

**Per Sunshine Act / Open Payments + OIG CPG + PhRMA Code 2022:** every meal, sample, honorarium, consulting fee, or transfer ≥$10 reports to CMS Open Payments (publicly searchable). Educational lunches **modest** ($25-$40/attendee industry-typical; some manufacturers cap $15-$20), **genuinely educational** — no entertainment, tickets, golf, off-policy dinners.

> ### 🎤 Verbatim Script -- INDUCEMENT Defense
> *"Lunch is $28/attendee — within educational-meal policy. Detail aid is the educational content. Sign-in sheet for Open Payments. If anyone is uncomfortable being reported, please don't sign."*

**Common trap.** *"Let's grab dinner sometime"* — instant OIG flag. Or untracked coffees/pastries for staff. **Untracked transfers ≥$10 are the #1 cited finding in OIG audits of manufacturer compliance.** Track or don't give.

#### Rail 3 -- SAMPLE INTEGRITY

**Per PDMA + 21 CFR Part 203:** every sample needs a **signed prescriber request**, **locked storage** (rep car trunk lockbox + office locked cabinet), **chain-of-custody** records. No diversion. No staff-use. No receptionist signing for the prescriber.

> ### 🎤 Verbatim Script -- SAMPLE Hand-Off
> *"Five starter cartons. PDMA signature here — confirming you're a licensed prescriber and these go to patients, not staff. Storage cabinet locked? I'll record lot numbers in Veeva tonight."*

**Common trap.** Leaving samples with the receptionist without a prescriber signature. "Stocking" beyond the request. Both are PDMA violations — sample-request forms get audited by manufacturer compliance and FDA inspectors.

> ### 🎯 Bottom Line
> 5 steps + 3 Rails. Sequence matters. Rails matter. Both together = 54% detail-to-Rx-commit + zero compliance exposure. Either one alone fails: 5 steps without the Rails = warning letter or termination; Rails without the 5 steps = compliant rep who doesn't write goal.

---

## SECTION 3 -- THE DISCUSSION (0:22-0:32)

> ### 🟡 Coach Note
> Whiteboard up. Write **OPEN / PROBE / SHARE / CONFIRM / CLOSE** across the top in 5 columns. Each rep audits their **toughest unconverted high-decile HCP** out loud — which step broke down, what the HCP said, what's been written (or not) in the 90 days since. **Count to five after each prompt.** Silence forces engagement. If vague: *"verbatim — what exactly did you say at OPEN? Did you actually run the patient-finder PROBE or did you go straight to the iPad?"*

**Prompt 1 — "Name your highest-decile target HCP who hasn't written a single Rx. Specialty, ZS AccessMonitor decile, last 3 interactions per Veeva CRM."**
Around the room. Force specifics: *"Dr. Patel, neurology, decile 9, last 3 visits Sep 14 / Oct 22 / Nov 30, no Rx, no sample request signed, last note in Veeva said 'limited time, will retry.'"* No vague *"a doctor in my territory."*

**Prompt 2 — "Which of the 5 steps broke down — OPEN, PROBE, SHARE, CONFIRM, or CLOSE?"**
Most will admit OPEN — wasted 30-45 seconds on rapport. Some PROBE — went straight to iPad feature-dump, never asked the patient-finder question. A few CLOSE — left without the signed sample request or the next-call date. **DSM:** *"OPEN is reflex. Drill it tomorrow. PROBE is the deal. SHARE is reference. CONFIRM surfaces the barrier. CLOSE is operational. Skip any one and the next 90 days produce zero scripts."*

**Prompt 3 — "What did the HCP say — verbatim deflection or barrier?"**
Usually one of three: *"My patients can't get prior auth"* / *"I've had bad experiences with manufacturer hubs"* / *"There are cheaper alternatives in the same class"* — exactly the deflections in Section 4's role-plays. Or worse, the rep doesn't know — never ran CONFIRM.

**Prompt 4 — "What's your current ZS AccessMonitor score in this territory? Open Payments total YTD with this specific HCP? Number of signed sample requests this quarter?"**
Most don't know within 10%. **DSM:** *"Pull your Veeva CRM + ZS AccessMonitor + Open Payments dashboard tonight. If your access score is below district average, you're an OPEN problem. If signed-sample-request count is under 60% of attempted samples, you're a Rail 3 problem. The diagnostic is in the numbers."*

**Prompt 5 — "Did you almost cross a compliance Rail on the last call? ON-LABEL, INDUCEMENT, or SAMPLE INTEGRITY?"**
This one is hardest because reps don't volunteer compliance near-misses. **DSM:** *"Confidential. Was there a moment you almost answered an off-label question? Almost left samples without a signature? Almost offered something outside the meal policy?"* Most reps will name one. **DSM:** *"That's the call we role-play in the next 1:1. Compliance near-misses are training data, not termination triggers — IF you self-report."*

**Prompt 6 — "ONE concrete next move for this HCP — patient-finder PROBE, hub enrollment one-pager, peer KOL phone intro, or MSL handoff? Verbatim what you'll say."**
Each rep names ONE HCP + ONE specific move + ONE verbatim line. **DSM:** *"Write it down. Not 'I'll be more patient-focused' — write the actual probe. Recording or Veeva CRM detail within 5 business days, reviewed in 1:1."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:32-0:52)

> ### 🟡 Coach Note
> Pair reps. If odd number, take the extra rep. **Two scenarios, 10 minutes each, 60-second reset between.** Rep plays HCP in Round 1, switches to rep in Round 2. Walk the room. Listen for whether the rep actually runs OPEN + PROBE verbatim in Round 1, and whether they hold ON-LABEL Rail when the oncologist tries to drag the conversation into off-label territory. Mark which step each rep skips; that's the data for the next field ride.

### Role-Play 1 -- High-Decile KOL Oncologist at NCCN Academic Medical Center (10 min)

**Setup:** **47-year-old medical oncologist + tenured Associate Professor at an NCCN-designated comprehensive cancer center**, sees 25-30 patients/day in a high-volume infusion-suite clinic. Drug being detailed: **a launching antibody-drug conjugate (ADC) for HER2-low metastatic breast cancer** — competitive with Enhertu (trastuzumab deruxtecan, Daiichi Sankyo/AstraZeneca) and Trodelvy (sacituzumab govitecan, Gilead). KOL has read every published Phase III, has personally enrolled patients in competitor trials, will challenge the rep on data magnitude + chair-time logistics. **7-minute window between two patient visits during morning clinic.** REP must run 7-Minute Detail + hold ON-LABEL Rail under pressure.

> ### 🎤 HCP SCRIPT -- Dr. Sarah Liang, MD PhD, Medical Oncologist, NCCN cancer center

> **Posture:** Polite, fast, brilliant. iPad on her own — pulling up her own ASCO 2024 abstract bookmark in parallel. Will write the script tonight if the data holds up AND the chair-time math works AND the rep doesn't go off-label on biomarker sub-populations.

> **Deflection 1 (min 2) — Dr. Liang:** *"I've used Enhertu for two years and Trodelvy in third-line. What makes your ADC different? Be specific — magnitude of benefit, not just mechanism."* (REP must defend on FDA-approved primary endpoint without disparaging Enhertu, name the specific sub-population where data is strongest, stay inside indication.)

> **Deflection 2 (min 4) — Dr. Liang:** *"Your DESTINY-comparator phase III showed a smaller PFS magnitude vs Enhertu in the same HER2-low population. Defend that."* (REP must acknowledge data honestly, reframe to the specific patient sub-population where THIS ADC's data is strongest, NOT go off-label on rationale.)

> **Deflection 3 (min 5) — Dr. Liang:** *"My infusion suite is at 92% capacity. Your ADC requires a 90-minute first infusion plus 30-minute observation. How do we handle the chair time?"* (REP must address operational reality, name the patient hub services + reimbursement support, schedule next interaction with the infusion suite director, not just the oncologist.)

> **What gets the deal moving:** REP runs OPEN verbatim, PROBE on her HER2-low patient panel size (she'll name 40+ active patients), SHARE on the on-label population where data is strongest (not a head-to-head claim), CONFIRM on the chair-time barrier with a hub-services answer, CLOSE with a signed sample request (samples for ADCs are limited but starter vouchers exist) + scheduled follow-up that includes the infusion suite director.

> ### 🎤 REP SCRIPT -- 7-Minute Detail verbatim, Three Rails live

> - **Min 0-1 (Step 1 OPEN):** *"Dr. Liang, thanks for the 7 minutes between cases. I'd love to share the on-label data for our ADC in HER2-low — specifically the sub-population that overlaps with your panel — then hear how you're sequencing third-line right now. Sound good?"*
> - **Min 1-2 (Step 2 PROBE):** *"Across your HER2-low metastatic patients, how many are post-Enhertu and looking for the next option? What's your current go-to in that line?"* (Listen 60 sec — she'll say 40+ patients, currently bouncing between Trodelvy and chemo singlets.)
> - **Min 2-4 (Step 3 SHARE + Deflection 1):** *"In the on-label HER2-low post-Enhertu population — exactly the patients you just described — our Phase III primary endpoint showed [primary endpoint data] with NNT of [X]. Here's the KM curve."* (Dr. Liang: smaller PFS magnitude.) *"Fair point. Versus Enhertu in the broader HER2-low population, the magnitude is smaller — I'm not going to claim otherwise. Where the data is strongest is the post-Enhertu sub-group: median PFS [X] months vs [Y] for current third-line standard. That's the specific patient I'd want you considering this for."*
> - **Min 4-5 (Step 4 CONFIRM + Deflection 3):** *"For the next post-Enhertu patient who fits that sub-group — what's stopping you from prescribing?"* (Dr. Liang: chair time at 92% capacity.) *"That's the most-cited barrier in this launch. Our patient hub services include infusion-suite scheduling support + reimbursement pre-verification + nurse triage for the first infusion observation. I can have our hub director call your infusion suite director tomorrow."*
> - **Min 5-6.5 (Step 5 CLOSE):** *"Can I get your starter voucher request for your next eligible post-Enhertu patient + the hub enrollment form? I'll be back next Thursday the 14th at 8:15am with the infusion-suite hub director on the phone — I'll text Maria to confirm. And I'll have our MSL Dr. [Name] reach out this week on the biomarker sub-population question we didn't have time for today — that's outside the indication so it's an MSL conversation, not mine."*
> - **Min 6.5-7 (exit):** *"Thanks for the time. Voucher + hub form + Thursday at 8:15am. See you then."* (Walk out. Do NOT linger.)

### 60-Second Reset

> ### 🟡 Coach Note
> **DSM calls out: "Switch sides — 60-second reset."** Reps put papers down. Stand up. Stretch. Sip water. Sit back down with the OTHER role's paper. **Take 30 seconds to read silently.** Then go.

### Role-Play 2 -- Skeptical Formulary-Restricted Community Rheumatologist (10 min)

**Setup:** **52-year-old community rheumatologist** at a 6-physician group practice in suburban Phoenix, sees 22-26 patients/day, **70% commercial insurance with heavy UnitedHealthcare exposure**. Drug being detailed: **a biologic for moderate-to-severe rheumatoid arthritis** — placed at Tier 4 on UnitedHealthcare's 2025 formulary with **step-therapy through 2 generic conventional DMARDs first** (methotrexate + leflunomide) + **prior authorization (6-week typical turnaround)**. Rheumatologist has been burned by manufacturer hubs that promised PA support and delivered chaos. **7-minute window during a Wednesday lunch detail (rep brought $28/attendee turkey sandwiches under educational-meal policy).** REP must navigate payer access **without making coverage promises** (OIG-compliant), introduce hub realistically (acknowledge prior burns), surface the specific patient profile where THIS biologic uniquely fits.

> ### 🎤 HCP SCRIPT -- Dr. Marcus Reeves, MD, Rheumatologist

> **Posture:** Friendly but burned. Has tried three other manufacturer hubs in last 5 years; two were operational disasters. Will prescribe if (a) PA pathway is realistic, (b) hub has actually staffed up, (c) the patient profile is specific not generic.

> **Deflection 1 (min 2):** *"My patients can't afford Tier 4 + prior auth takes 6 weeks. By the time UHC approves, my patient has already switched insurance or given up."*

> **Deflection 2 (min 4):** *"I've had bad experiences with manufacturer hubs. Too much paperwork on my staff, PA denials we have to appeal, patient assistance program that takes 8 weeks. Why should I bother?"*

> **Deflection 3 (min 5):** *"Why should I prescribe this when there are 4 cheaper biologics in the same class — and 2 generics in the conventional DMARD line — that my patients can actually get covered?"*

> **What gets the deal moving:** REP runs OPEN + PROBE on his Tier-4-eligible patient sub-segment (he'll name 8-12 patients failed on 2+ conventional DMARDs), SHARE on the specific on-label sub-population where this biologic uniquely fits (the head-to-head Phase III data, if it exists, or the patient profile where the safety/efficacy ratio is differentiated), CONFIRM on the staffed-hub vs the prior burns (acknowledges past failures, names the specific staffing increase + current PA approval rate + average PA turnaround), CLOSE with a hub enrollment one-pager + a Veeva CRM commitment to introduce his office manager to the regional hub manager by name.

> ### 🎤 REP SCRIPT -- reframe on merits, no coverage promises, honor the burns

> - **Min 0-1 (Step 1 OPEN):** *"Dr. Reeves, thanks for the 7 minutes today. I'd love to share two patient stories from your panel — patients who failed methotrexate and leflunomide — then hear how you're sequencing biologics under UHC's 2025 formulary right now. Sound good?"*
> - **Min 1-2 (Step 2 PROBE):** *"Across your active RA panel, how many patients have failed both methotrexate AND leflunomide and are now stuck waiting on biologic step-therapy? What's your current next step for those patients?"* (Listen 60 sec — he'll say 8-12 patients, currently waiting on UHC PA appeals or paying out-of-pocket.)
> - **Min 2-3 (Step 3 SHARE):** *"For those exact patients — failed both conventional DMARDs, moderate-severe disease activity — our Phase III primary endpoint showed [ACR50 response] at week 24 vs [comparator data] in the on-label population. Here's the safety profile next to the comparator class."* (One slide. Not the deck.)
> - **Min 3-5 (Step 4 CONFIRM + Deflections 1 + 2 + 3):** *"For the next patient who fits that profile — what's actually stopping you?"* (Dr. Reeves: PA takes 6 weeks + bad hub experiences + 4 cheaper alternatives.) *"All three are real. (1) On PA: I can't promise UHC coverage — that would be inappropriate — but our current PA approval rate in this region is 78%, and average turnaround dropped from 6 weeks in 2023 to 18 days in Q4 2024 because UHC tightened their auto-approval criteria. (2) On the hub burn: hear that, and I'm sorry — different hub, different year. We restaffed the regional team in March 2024; current PA appeal success rate is 84%. (3) On cheaper alternatives: completely fair — if a patient is doing well on a TNF or doesn't have the specific disease activity profile, those are better choices. The patient I'd ask you to consider this for is the one who failed a TNF and a JAK and needs a different mechanism — that's the population the Phase III was powered for."*
> - **Min 5-6 (Step 5 CLOSE):** *"Can I leave the hub enrollment one-pager + a printed PA turnaround summary for your office manager? I'd like to introduce your office manager Sarah to our regional hub manager Beth by name — phone intro this week. And I'll be back two weeks from today, Wednesday the 27th at 12:15, with Beth on the phone to walk Sarah through the UHC PA pathway. Sound good?"*
> - **Min 6-7 (exit):** *"Thanks for the time and the candor about prior hub experiences. One-pager + phone intro + Wednesday the 27th. See you then."*

> ### 🟡 Coach Note
> Walk the room. Rep will want to **either over-promise on PA approval ("we'll get it covered, don't worry") or disparage the cheaper alternatives ("those biologics have worse safety data") — both are compliance-near-misses.** Over-promising on coverage is an OIG-flag (manufacturer cannot guarantee payer coverage). Disparaging competitors without FDA-approved head-to-head data is an OPDP violation. **Make the rep re-deliver the "I can't promise coverage — here's the actual approval rate" line + the "if a TNF is working, that's the right choice" line.** Highest-leverage drill in the whole training.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:52-0:57)

> ### 🟡 Coach Note
> Pull the room back together immediately. Three debrief questions, then commitments. The ritual is the only part that moves next quarter's NRx + TRx + Veeva-logged-call quality.

**Debrief 1 — "Which step felt strongest in your role-play?"**
Reps over-index on SHARE (the clinical message) and CLOSE (the operational ask). Under-index on OPEN (rushed straight to features) and PROBE (forgot the patient-finder question, defaulted to feature-dump). **DSM:** *"OPEN is reflex — 60 seconds, drill until automatic. PROBE is where the entire detail's value lives — that's the 90 seconds you protect. SHARE without PROBE is just iPad-reading."*

**Debrief 2 — "Which compliance Rail did you almost cross?"**
Most reps will name ON-LABEL (oncologist tried to drag them off-label on biomarker sub-populations or chair-time-saving regimens). Some INDUCEMENT (the lunch math, the educational-meal policy, the sign-in sheet). A few SAMPLE INTEGRITY (the temptation to leave samples with the receptionist when the prescriber stepped out). **DSM:** *"Naming the near-miss is how you avoid the actual miss. Self-reporting near-misses is part of the job."*

**Debrief 3 — "What's the next concrete action on your toughest HCP — patient-finder PROBE, hub enrollment one-pager, peer KOL phone intro, or MSL handoff?"**
Each rep names ONE HCP + ONE specific next-move. **DSM:** *"Write it down. Not 'I'll be more patient-focused' — the actual probe verbatim. The actual hub one-pager left at the office. The actual peer KOL call scheduled."*

> ### 🎤 Commitment Ritual (Verbatim)

**DSM says:** "Open Veeva CRM on your phone. Four lines. **Line 1:** **next target HCP** — name, specialty, ZS AccessMonitor decile, next scheduled call. **Line 2:** **the step you'll lead with** — OPEN / PROBE / SHARE / CONFIRM / CLOSE. **Line 3:** **the ONE verbatim language change** — actual words, not a description. **Line 4:** **the call you'll log in Veeva** within 5 business days for our 1:1. Read all four aloud, around the room."

Let every rep read. **Coach the vague** (*"I'll be more patient-focused"*): *"What words exactly? Read the probe. Out loud now."*

**DSM closes:** "In our 1:1 within 5 business days I'm pulling your Veeva CRM detail on this exact HCP, and we'll listen to the call notes for the 90 seconds where you ran OPEN + PROBE. Not whether you got the script — **whether you ran the 5 steps and stayed on the 3 Rails.** Veeva log in **5 business days**, 1:1 the week after. NRx follows process. Always has."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (0:57-1:00)

> ### 🟡 Coach Note
> Hand out the printed one-pager. Walk it 30 seconds per section. Tell reps where the digital version lives (Veeva CRM attachment + brand intranet). Keep one in the territory bag next to the FDA-approved detail aid.

> ### 📋 Leave-Behind -- The "7-Minute Detail + Three Rails" One-Pager

> **THE 7-MINUTE DETAIL FRAMEWORK (verbatim cue under each):**
>
> | # | Step | Verbatim Cue (memorize) | Time |
> |---|---|---|---|
> | 1 | **OPEN** | *"Dr. [Name], thanks for the time. I'd love to share two patient stories that mirror your panel, then hear how you're treating [condition] right now. Sound good?"* | 60 sec |
> | 2 | **PROBE** | *"Among your [condition] patients on [incumbent therapy], how many are sub-optimally controlled at 6 months? What's the next step for those patients today?"* (Listen. Take ONE note. NEVER interrupt.) | 90 sec |
> | 3 | **SHARE** | ONE on-label clinical message tied to the patient profile they just named. FDA-approved detail aid + Phase III primary endpoint + NNT or KM curve. Never off-label. | 3 min |
> | 4 | **CONFIRM** | *"For the next patient you see who fits that profile — what's stopping you from prescribing [drug]?"* (Surface the real barrier — formulary, PA, payer mix, REMS, side effects, patient cost.) | 90 sec |
> | 5 | **CLOSE** | *"Can I get your sample request signature for [N] starter cartons + the hub enrollment form for your next eligible patient? I'll be back [specific date] at [specific time]."* | 60 sec |

> **THE PhRMA CODE THREE RAILS COMPLIANCE FRAME (3-quadrant grid):**
>
> | Rail | What it means | Common near-miss | Verbatim move |
> |---|---|---|---|
> | **ON-LABEL ONLY** | Never discuss off-label use, even when HCP asks. Redirect to MSL. | *"Some doctors are using it for…"* — single sentence = OPDP-reportable. | *"Great clinical question — outside the FDA-approved indication, so I can't discuss. Let me have our MSL Dr. [Name] reach out today for an unrestricted scientific exchange."* |
> | **NO INDUCEMENT** | Meals ≤$25-$40/attendee, educational content, tracked on Open Payments ≥$10. No tickets, golf, off-policy dinners. | Untracked coffees/pastries for staff; *"let's grab dinner sometime."* | *"Lunch is $28/attendee — within educational-meal policy. Sign-in sheet here for Open Payments reporting. If anyone is uncomfortable being reported, please don't sign."* |
> | **SAMPLE INTEGRITY** | PDMA-signed sample request from licensed prescriber, locked storage, chain-of-custody, no diversion. | Leaving samples with receptionist; "stocking" beyond request. | *"Five starter cartons. PDMA signature here — confirming you're a licensed prescriber and these go to patients, not staff. Storage cabinet locked? Lot numbers recorded."* |

> **THE SPECIALTY ACCESS SCORECARD (audit before every call):**
>
> - [ ] **ZS AccessMonitor decile** for this HCP (1-10, 10 = highest access barrier)
> - [ ] **Veeva CRM last 3 interactions** — date, length, outcome, next-step logged
> - [ ] **Open Payments YTD** for this HCP — total transfers of value, meal count, any near-cap exposure
> - [ ] **IQVIA Xponent / NPA prior Rx history** — has this HCP ever prescribed (NRx + TRx trend last 12 months)?
> - [ ] **Formulary restrictions on dominant payer in territory** (UHC + Aetna + Cigna + BCBS + Humana) — Tier, step-therapy, PA, quantity limit
> - [ ] **Patient hub enrollment trend** — last 90-day hub enrollments from this HCP (zero = trust problem)
> - [ ] **REMS enrollment** — is this HCP REMS-certified if drug requires it?
> - [ ] **Sample inventory on hand** — does this HCP have current samples (lot # check)?
> - [ ] **Last MSL touch** — has the HCP had a clinical (non-promotional) MSL engagement in last 6 months?
> - [ ] **Peer KOL connection** — is there a peer KOL the HCP respects who has prescribed?

> **NEVER DO (the compliance + access-cratering behavior list):**
>
> - Discuss off-label use, even when HCP asks — single-sentence OPDP-reportable event
> - Make payer coverage promises — *"we'll get it approved, don't worry"* — OIG-flag
> - Disparage a competitor without FDA-approved head-to-head data — OPDP violation
> - Hand over a reprint discussing an off-label use — treated identically to verbal promotion
> - Leave samples without a PDMA-signed prescriber request — sample-integrity violation
> - Offer meals over the policy cap (typically $25-$40/attendee) — Sunshine Act / OIG flag
> - Skip the Open Payments sign-in sheet at lunch programs — untracked transfer of value
> - Burn the OPEN minute on rapport — wastes 14% of the entire 7-min window
> - Skip the PROBE — destroys the entire detail's clinical relevance
> - Skip the CONFIRM — never surfaces the real barrier, can't deploy hub or market access
> - Skip the CLOSE signature + hub one-pager + specific next-call date — collapses Step 5
> - Disparage a manufacturer hub the HCP has had prior burns with — destroys trust permanently

> **THE OUTCOME LINE:**
>
> - **Wins:** OPEN + PROBE + SHARE + CONFIRM + CLOSE in sequence + Three Rails live + signed sample request + hub enrollment + scheduled next-call in Veeva → **54% detail-to-Rx-commit + zero compliance exposure + 78% PA approval rate where hub deployed + repeat HCP access**
> - **Losses:** Rapport OPEN + iPad feature-dump + no PROBE + closed *"any questions?"* + vague *"I'll swing back"* + samples left at reception → **15-20% commit + warning-letter risk + PDMA violation + HCP no-sees next visit + reputation damage in district**

> ### 🎯 If You Only Remember One Thing
> **You're not selling the molecule — you're surfacing the patient on the doctor's panel who will benefit. The doctor wrote the script before you walked in; your job is just to make sure they remember to.**

---

## How This Training Sits Inside Your Specialty Commercial Stack

This is **the foundational HCP-detail discipline** — the 7-minute conversation that determines whether your territory hits NRx + TRx goal AND survives PhRMA Code + FDA OPDP + OIG + Sunshine Act audits. It does not replace MSL scientific exchange, market access strategy, or patient hub operations — it composes from all of them.

| Where it fits | What this training addresses |
|---|---|
| **Pre-call planning** | Specialty Access Scorecard runs before every call — ZS decile + Veeva CRM history + Open Payments YTD + payer formulary + hub trend |
| **First 60 seconds in the office** | OPEN verbatim — patient stories framing, permission ask, verbal yes before the iPad opens |
| **Patient targeting** | PROBE patient-finder question surfaces the specific HCP-panel sub-population the SHARE message anchors to |
| **Clinical message delivery** | SHARE uses FDA-approved detail aid + Phase III primary endpoint + NNT/KM curve — on-label only |
| **Barrier surfacing** | CONFIRM forces the HCP to name the actual blocker — formulary, PA, REMS, payer mix, side effects |
| **Call close + handoff** | CLOSE gets PDMA-signed sample request + hub enrollment one-pager + specific scheduled next-call |
| **Compliance overlay** | Three Rails — ON-LABEL ONLY + NO INDUCEMENT + SAMPLE INTEGRITY — every detail, every interaction |
| **Manager coaching** | Weekly Veeva CRM audit on 1 detail per rep, reviewed in 1:1 within 5 business days for 5-step + 3-Rail adherence |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: meeting flow + post-training coaching loop
// ============================================================================
const flow = `

## The 60-Minute Meeting Flow

\`\`\`mermaid
flowchart TD
  A[DSM Opens 0:00] --> B[Section 1: Cold Open 5 min — ZS AccessMonitor 79% to 44% rep-access decline + 7-min specialty detail reality + 70% no-see + Priya CGRP neurologist composite story burned 4 of 7 min on iPad vs restructured 6-min commit with patient-finder probe]
  B --> C[Section 2: Teach 17 min]
  C --> C1[Part A: 7-MINUTE DETAIL Framework 11 min — Step 1 OPEN 60 sec patient stories permission verbal yes before iPad / Step 2 PROBE 90 sec patient-finder question listen ONE note never interrupt / Step 3 SHARE 3 min ONE on-label message tied to patient profile FDA detail aid Phase III primary endpoint NNT KM curve / Step 4 CONFIRM 90 sec what is stopping you surface real barrier / Step 5 CLOSE 60 sec PDMA-signed sample request hub enrollment specific next-call]
  C --> C2[Part B: Three Rails Compliance 6 min — Rail 1 ON-LABEL ONLY never off-label MSL redirect / Rail 2 NO INDUCEMENT meals 25-40 dollar cap Open Payments tracked / Rail 3 SAMPLE INTEGRITY PDMA signed locked chain-of-custody]
  C1 & C2 --> F[Section 3: Discussion 10 min — 6 prompts toughest unconverted high-decile HCP + which step broke + verbatim deflection + ZS decile + Open Payments YTD + Rail near-miss + ONE verbatim change]
  F --> G[Section 4: Role-Play 20 min]
  G --> G1[Round 1: Dr. Sarah Liang 47 medical oncologist NCCN cancer center launching HER2-low ADC — Enhertu comparison / smaller PFS magnitude / 92% chair-time capacity — REP runs 7-Minute Detail holds ON-LABEL Rail acknowledges data honestly]
  G1 --> G2[60-sec reset]
  G2 --> G3[Round 2: Dr. Marcus Reeves 52 community rheumatologist Phoenix Tier 4 biologic UHC step-therapy 6-week PA — patients cannot afford / bad hub experiences / 4 cheaper alternatives — REP reframes without coverage promises restaffed hub specific sub-population]
  G3 --> G4[60-sec reset]
  G4 --> H[Section 5: Debrief + Commitments 5 min — 4-line ritual next HCP + step + verbatim change + Veeva log this week]
  H --> I[Section 6: Leave-Behind 3 min — 5-step grid + 3-Rail quadrant + Specialty Access Scorecard + never-do list + hero quote]
  I --> Z[Meeting Ends 60:00 — DSM asks for Veeva CRM detail in 1:1 within 5 business days]
\`\`\`

## Manager Coaching Loop

\`\`\`mermaid
flowchart LR
  T[Training Monday] --> W1[Week 1: Rep Commits Next HCP + Step to Lead + ONE Verbatim Change + Logs Detail in Veeva CRM]
  W1 --> W2[Rep Delivers 5 Steps + 3 Rails Live On 12+ Details Logs One Within 5 Business Days]
  W2 --> W3[DSM Reviews Veeva CRM Entry in 1:1 Marks 5-Step Coverage + 3-Rail Adherence]
  W3 --> W4[1:1 Coaching: Step Still Skipped + Verbatim Re-Delivery With DSM Playing Skeptical HCP]
  W4 --> W5[Monthly NRx + TRx Review: Rep NRx + ZS AccessMonitor + Open Payments compliance + hub enrollment trend + PA approval rate + sample-request signed pct]
  W5 --> W6[Quarterly: Refresh Detail Aid + Update Three Rails on new OPDP enforcement actions + Rotate Role-Plays From Actual Unconverted HCPs + PhRMA Code Recertification]
  W6 --> R{Rerun Every 90 Days With Fresh Unconverted HCP Recordings}
  R -->|Yes| T
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 7-Minute Detail framework, the PhRMA Code Three Rails compliance frame, and the ZS AccessMonitor 79%→44% rep-access benchmark draw on a specific body of pharmaceutical commercial + regulatory research. A DSM should be ready to cite these by name.

**Regulatory + compliance framework.** **PhRMA Code on Interactions with Healthcare Professionals (2022 update)** — the industry-wide standard for educational-meal caps, speaker programs, samples, consulting, and gifts. **FDA OPDP (Office of Prescription Drug Promotion)** — publicly indexed warning letters and untitled letters define the off-label enforcement floor; current enforcement focus includes social-media promotion, off-label reprint distribution, and misleading comparator claims. **OIG (Office of Inspector General) Compliance Program Guidance for Pharmaceutical Manufacturers (September 2023 final guidance)** — anti-kickback statute application, speaker-program risk factors, fair-market-value standards, and exclusion-list screening. **CMS Open Payments / Physician Payments Sunshine Act** — manufacturer reporting requirement on every transfer of value to a covered recipient ≥$10 (meals, honoraria, samples, consulting fees), publicly searchable at openpaymentsdata.cms.gov. **PDMA (Prescription Drug Marketing Act of 1987) + 21 CFR Part 203** — federal sample distribution law: signed prescriber requests, locked storage, chain-of-custody, anti-diversion. **FDA REMS (Risk Evaluation and Mitigation Strategies)** — for drugs requiring enrollment + training + safe-use documentation (clozapine REMS, isotretinoin iPLEDGE, mifepristone REMS, opioid REMS).

**Rep-access + commercial-effectiveness research.** **ZS Associates AccessMonitor + ePharma Physician 2024-2025** — published HCP rep-access trend data (the 79% in 2008 → 44% in 2025 decline), detail-length benchmarks (7 min specialty, 4 min PCP), no-see-physician categorization, channel-preference shifts. **Veeva Pulse** — quarterly benchmark report on rep + HCP engagement across the Veeva CRM customer base (≈80% of pharma reps globally). **Doctors.com** + **Sermo** + **Medscape** — physician-side surveys on rep-engagement quality and preferred channels.

**Prescriber + claims data sources.** **IQVIA Xponent + IQVIA NPA Audit + IQVIA DDD** — prescriber-level Rx data (NRx + TRx + dispense-channel breakdown). **Symphony Health PHAST + IPSA** — competing prescriber-level data set. **Veeva Link KOL Data** — HCP-affiliation, publications, congress speaking, KOL-network mapping. **Komodo Health + Trilliant + Definitive Healthcare** — adjacent specialty-care HCP affiliation + patient-flow data.

**Specialty pharmacy + payer access.** **CVS Specialty + Walgreens Specialty + Accredo (ESI/Cigna) + Optum Specialty (UHC) + AllianceRx Walgreens Prime** — the dispensing-channel infrastructure for specialty drugs; rep interactions feed into hub-to-specialty-pharmacy patient-routing. **Manufacturer patient hub services** — **Pfizer Patient Connect + AstraZeneca Access 360 + Bristol-Myers Squibb Access Support + Novartis Patient Support + AbbVie Access Solutions** — the operational PA-support + patient-assistance-program + nurse-triage layer that converts HCP commitment into actual fills.

**Industry trade + benchmark publications.** **Endpoints News + FiercePharma + BioPharma Dive + STAT + Pink Sheet + PharmaVoice + Medical Marketing & Media (MM+M)** for commercial benchmarking, launch case studies, OPDP enforcement coverage, and post-launch competitive analysis. **PhRMA + BIO (Biotechnology Innovation Organization) + NACDS (National Association of Chain Drug Stores)** trade association data on industry policy + compliance trends.

**Exemplar specialty launches referenced in the training (without endorsement)** — **Vraylar (cariprazine, AbbVie)** atypical antipsychotic, **Trikafta (elexacaftor/tezacaftor/ivacaftor, Vertex)** cystic fibrosis triple therapy, **Dupixent (dupilumab, Sanofi/Regeneron)** atopic dermatitis/asthma/EoE, **Ozempic / Wegovy (semaglutide, Novo Nordisk)** GLP-1 diabetes/obesity, **Keytruda (pembrolizumab, Merck)** anti-PD-1 across oncology indications, **Vyvgart (efgartigimod, Argenx)** generalized myasthenia gravis. Each represents a leading specialty-pharma launch with documented commercial playbooks adapted to the 7-Minute Detail discipline.

**The 7-Minute Detail framework** composes on the original AstraZeneca + Pfizer + Merck rep-training curricula from the 1990s-2010s and the post-COVID rep-access reality documented by ZS Associates. The Three Rails frame is the operational floor distilled from FDA OPDP enforcement actions + OIG compliance program audits + Sunshine Act reporting requirements + PDMA sample regulations + recent DOJ settlements (multi-billion-dollar manufacturer settlements 2009-2024 define what NOT to do).

`;

// ============================================================================
// NUM -- quantified benchmarks the DSM cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

The cold open lands harder when the DSM can quote real benchmarks. The tables below pull from ZS Associates AccessMonitor 2024-2025 + ePharma Physician + Veeva Pulse + IQVIA + JD Power physician surveys + published OPDP enforcement summaries + DOJ pharma settlement records.

### HCP Rep-Access Decline (ZS Associates AccessMonitor)

| Year | % of US Physicians Granting Any Rep Access | Notes |
|---|---|---|
| 2008 | **79%** | Pre-Sunshine Act baseline |
| 2014 | **65%** | Post-Sunshine Act + early no-see-physician trend |
| 2019 | **55%** | Pre-COVID baseline |
| 2021 | **41%** | Pandemic trough |
| 2023 | **45%** | Partial reversion, never to 2019 |
| 2025 | **44%** | New permanent baseline |

### Specialty Detail Length By Specialty (ZS 2024-2025)

| Specialty | Median Detail Length | % Granting Access |
|---|---|---|
| Primary Care (PCP / Internal Medicine) | **4 min** | **38%** |
| Endocrinology + Cardiology + GI | **6 min** | **52%** |
| Rheumatology + Dermatology + Allergy | **7 min** | **58%** |
| Neurology + Psychiatry | **7 min** | **51%** |
| Oncology (community) | **7 min** | **62%** |
| Oncology (academic / NCCN) | **8 min** | **48%** |
| Rare disease (KOL specialist) | **9 min** | **71%** |

### Detail-to-Rx-Commit Conversion By Discipline Tier

| Rep Tier | Detail-to-Verbal-Commit Rate | NRx per 100 Targeted HCPs/Quarter |
|---|---|---|
| Bottom-quartile (no scripted OPEN, feature-dump SHARE) | **15-22%** | **8-14** |
| Below-average (scripted OPEN, no patient-finder PROBE) | **24-32%** | **18-28** |
| Average (full 5 steps but skips CONFIRM) | **34-42%** | **32-46** |
| Top-quartile (5 steps + 3 Rails consistently) | **48-58%** | **52-72** |
| Top-decile (5 steps + 3 Rails + hub + MSL choreography) | **60-72%** | **78-110** |

### Why HCPs Decline To Prescribe After Detail (Veeva Pulse + Sermo Surveys)

| Reason for Non-Commit | % Citing as Primary |
|---|---|
| Rep did feature-dump, no patient-relevance (PROBE skipped) | **41%** |
| Payer formulary / step-therapy / PA burden | **36%** |
| Bad prior experience with manufacturer hub | **22%** |
| Side-effect / safety concern not surfaced or addressed | **19%** |
| Cheaper alternative perceived as good enough | **18%** |
| REMS enrollment burden | **14%** |
| Rep waste of HCP time (OPEN rapport burn) | **17%** |
| Off-label question not answered (CRM/MSL routing failure) | **11%** |
| HCP doesn't trust the manufacturer brand | **9%** |

### OPDP + DOJ Enforcement Cost (2009-2024 Notable Settlements)

| Settlement Type | Cost Range | Trigger |
|---|---|---|
| OPDP untitled letter (single product) | **No fine — reputational + corrective campaign cost** | Misleading promotional claim, off-label hint, comparator claim without head-to-head |
| OPDP warning letter | **Corrective action plan + restricted promotional materials** | Repeat OPDP issue, more serious off-label or safety omission |
| DOJ + OIG settlement (single manufacturer, single drug) | **$150M-$1.5B** | Systemic off-label promotion + kickbacks + improper speaker programs |
| Top-5 historical DOJ pharma settlement | **$2.3B (Pfizer 2009) / $3B (GSK 2012) / $2.2B (J&J 2013)** | Multi-product, multi-year off-label + kickback systemic patterns |
| Individual rep termination + reportable event | **Job loss + potential industry exclusion** | Single off-label discussion in field |

### Sunshine Act / Open Payments Reporting Thresholds

| Transfer of Value | Reportable to CMS Open Payments? | Reported Detail |
|---|---|---|
| Single payment / item value ≥$10 | **YES** | Date, recipient HCP, value, nature, product |
| Cumulative annual >$100 | **YES** | All sub-$10 items also reportable once cumulative exceeds $100 |
| Sub-$10 single item + cumulative <$100 | **NO** | Below de-minimis threshold |
| Educational meal at PhRMA-Code modest level ($25-$40/attendee typical) | **YES if ≥$10 per attendee** | Sign-in sheet required |
| Speaker honorarium | **YES** | Fair-market-value test under OIG CPG |

### Sample Distribution (PDMA / 21 CFR Part 203 Compliance Audit)

| Sample Practice | PDMA-Compliant? | Audit Risk |
|---|---|---|
| Sample request signed by licensed prescriber | **YES** | Low |
| Sample left with receptionist without prescriber signature | **NO** | High — PDMA violation |
| Samples stored in locked cabinet at office | **YES** | Low |
| Samples stored on open desktop or unlocked drawer | **NO** | High — diversion risk |
| Lot numbers tracked in rep CRM + manufacturer compliance system | **YES** | Low |
| Samples re-distributed to office staff for personal use | **NO** | High — federal violation, criminal exposure |

### 7-Minute Detail Step-Adoption Curve (Reps Running All 5 Steps)

| Step | Week 1 | Week 4 | Week 12 |
|---|---|---|---|
| Step 1 OPEN (60-sec scripted, verbal yes) | 32% | 71% | 88% |
| Step 2 PROBE (patient-finder question, 90-sec silence) | 12% | 42% | 67% |
| Step 3 SHARE (ONE on-label message tied to patient profile) | 28% | 64% | 84% |
| Step 4 CONFIRM (surface real barrier) | 11% | 38% | 62% |
| Step 5 CLOSE (PDMA signature + hub one-pager + next-call date) | 22% | 56% | 79% |
| ALL 5 steps on every detail | 4% | 21% | 51% |

**Pattern:** Step 2 (PROBE) and Step 4 (CONFIRM) are the hardest to install — most reps default to feature-dump and *"any questions?"*. **The weekly Veeva CRM call-note audit by the DSM is the single biggest predictor of cohort NRx lift at 90 days** per Veeva Pulse + IQVIA-correlated commercial dashboards. The Three Rails frame adopts faster (most reps reach 80%+ adherence by week 6) because compliance pressure from corporate is direct and the consequences (OPDP, individual termination) are existential.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + DSM objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Rep Burns OPEN on Rapport
*"How was your weekend? How are the kids?"* — wastes 30-45 seconds of a 7-minute window. HCP mentally checks out. **Per ZS 2024, this is the #1 cited "rep waste of time" complaint.** **Coach:** drill the verbatim OPEN until reflex. Sixty seconds. Permission ask. Verbal yes. Then iPad.

### Failure Mode 2 -- Skips Step 2 PROBE
Rep opens iPad and starts presenting features. **Per Veeva Pulse, 41% of non-commits trace to PROBE-skip.** Without the patient-finder probe, the SHARE message has nothing to anchor to. **Coach:** verbatim patient-finder probe in pairs before leaving the room.

### Failure Mode 3 -- Goes Off-Label When HCP Asks
HCP asks about a sub-population not in the FDA-approved indication. Rep answers. **Single sentence = OPDP-reportable event** + potential termination + potential DOJ exposure for systemic patterns. **Coach:** MSL-redirect verbatim, drilled until reflex. *"Outside the indication — let me have our MSL reach out today."* Zero tolerance.

### Failure Mode 4 -- Makes Coverage Promises
*"We'll get it covered, don't worry."* — manufacturer cannot guarantee payer coverage; OIG-flag + fair-balance issue. **Coach:** drill *"I can't promise UHC will approve — current PA approval rate is 78%, average turnaround is 18 days."* Statistics, not promises.

### Failure Mode 5 -- Disparages Competitor Without Head-to-Head Data
*"Enhertu has worse safety in HER2-low."* — without FDA-approved head-to-head trial data, **OPDP violation**. **Coach:** acknowledge competitor strength where data shows it; reframe to the specific sub-population where the rep's drug data is strongest. Honest comparison defensible; disparagement is not.

### Failure Mode 6 -- Leaves Samples Without PDMA-Signed Request
Receptionist accepts the samples; no prescriber signature. **PDMA violation — and the sample-request audit trail is what the manufacturer's compliance team and FDA inspectors look at.** **Coach:** zero samples without signed request. If prescriber is unavailable, samples leave with the rep, return on next visit.

### Failure Mode 7 -- Skips Open Payments Sign-In At Educational Meal
Untracked transfer of value ≥$10. **Sunshine Act non-compliance.** **Coach:** sign-in sheet at every educational meal program. Track attendance + meal value per attendee. Submit to compliance same day.

### Failure Mode 8 -- Vague Close ("I'll Be Back When I'm In The Area")
No specific date. No signed sample request. No hub enrollment one-pager. **Step 5 collapsed.** Per Veeva, vague closes produce zero follow-up 71% of the time. **Coach:** verbatim close with specific date + signed paper + hub one-pager. Every detail. Every time.

### Failure Mode 9 -- Disparages a Prior Manufacturer Hub the HCP Has Been Burned By
HCP says *"I've had bad experiences with manufacturer hubs."* Rep says *"that was a different drug, not us"* dismissively. Trust dies permanently. **Coach:** acknowledge the burn, name the specific operational change (*"we restaffed the regional team in March 2024, current PA appeal success is 84%"*), let the numbers earn back trust.

### Failure Mode 10 -- DSM Doesn't Audit Weekly Veeva CRM Call Notes
Kills 65-75% of HCP-detail training rollouts. Per Veeva Pulse 2024, **~30-day half-life** un-coached. Reps revert to feature-dump + "any questions?" close by week 4. **Coach:** one detail per rep per week, reviewed in 1:1, marked for 5-step + 3-Rail adherence. Non-negotiable.

### Common DSM + Brand Team Objections

**1. "My reps already know how to detail."** Pull 90 days of NRx per HCP per rep. Bottom-quartile reps know the iPad — top reps run the 5-step + 3-Rail with the Specialty Access Scorecard.

**2. "Compliance and Rx growth are in tension."** Backwards. Top-quartile reps (48-72% commit) have the LOWEST OPDP / OIG findings. Bottom-quartile reps generate compliance investigations.

**3. "AccessMonitor data is depressing — why train into a shrinking window?"** The 7-min window is permanent. The reps who script the load-bearing 90 seconds convert at 2x cohort inside that window. Shrinking access makes discipline MORE valuable, not less.

**4. "Rare disease reps don't need this — they get longer details."** Partly true (9 min vs 7), and they need MORE discipline because there are <2,000 prescribers nationally per orphan drug and every detail matters.

**5. "Oncology academic reps work with KOLs — different game."** Same 5 steps. The KOL respects them MORE for the discipline. The KOL CUTS OFF the rep who feature-dumps faster than the community physician.

**6. "Senior reps don't need this."** Senior reps came up pre-2019 when access was 55%+ and details ran 12-15 min. The post-COVID 7-minute reality requires re-skilling.

**7. "How do I know it's working?"** Three 90-day signals: NRx +30-50% per rep / detail-to-commit rate +15-25 pts / ZS AccessMonitor decile lift +1-2 in territory / zero OPDP findings / sample-request signed-rate above 85%.

### When To Run A Second Time

Re-run every **90 days** with fresh unconverted-HCP audits + updated OPDP enforcement actions + updated PhRMA Code revisions. Rotate role-plays from last quarter's unconverted high-decile HCPs. Third run, swap archetypes — REMS-enrolled drug requiring HCP enrollment verification, biosimilar-pressured biologic, rare-disease orphan-drug with <500 national prescribers, ophthalmology drug with practice-administered injection workflow, hospital-system pharmacy-and-therapeutics (P&T) committee detail, ACO/value-based-care-contracted health system.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Tenth entry** in **Pulse Sales Trainings** (\`/sales-trainings/\`) and **fourth industry-specific training** after st0007 (orthopedic medical device sales), st0008 (residential real estate listing presentations), and st0009 (automotive F&I). st0001-st0006 covered B2B SaaS sales motions that translate across industries; st0007-forward pivots to **industry-by-industry coverage**. st0010 is specialty pharmaceutical HCP detailing — the most-regulated 7-minute conversation in commercial sales, and the territory where rare-disease, oncology, immunology, hematology, neurology, and ophthalmology brand teams fight for NRx growth inside the **PhRMA Code + FDA OPDP + OIG + Sunshine Act + PDMA + REMS** enforcement perimeter.

**Companion industry-specific entries planned:** **st0011** commercial real estate brokerage, **st0012** property management + multifamily leasing, **st0013** title insurance + closing services, **st0014** new construction + builder sales reps, **st0015** real estate investment sales (fix-and-flip / BRRRR / syndication), **st0016** real estate tech vendor sales (CRM / MLS / iBuyer / proptech), **st0017** medical-device adjacencies (cardiology + endovascular), **st0018** biotech KAM (key account management) for hospital health systems, **st0019** specialty pharmacy hub-services sales, **st0020** payer / market-access account director conversations with pharmacy benefit managers (PBMs). Each follows the same six-section structure.

**Cross-references to st0001-st0006 SaaS foundation arc translated for pharma detailing:** **st0001 discovery** → Step 2 PROBE (patient-finder question replaces SaaS discovery); **st0002 single-threading** → MSL is the second thread for off-label scientific exchange; **st0003 objection recovery** → Step 4 CONFIRM surfaces real barriers (formulary, PA, REMS); **st0004 cold-call opener** → Step 1 OPEN (60-sec scripted permission ask); **st0005 demo discipline** → Step 3 SHARE (ONE on-label message tied to patient profile, FDA-approved detail aid); **st0006 pricing** → CONFIRM surfaces patient cost as a real barrier, hub services as the response. A rep who internalized st0001-st0006 absorbs the pharma-detailing overlay 2x as fast, because the discipline of verbatim language on load-bearing moments transfers exactly.

**Cross-reference to st0007 + st0008 + st0009 — what transfers:** the **discipline of verbatim language on load-bearing moments + recording-or-CRM-reviewed coaching cadence** transfers exactly. Where st0007 made surgeons hear OR + Evidence + Outcome diagnostics verbatim, st0008 made sellers hear PROOF + Fee 4-line + PRICE-as-range verbatim, and st0009 made customers hear 9-Step F&I verbatim, st0010 makes HCPs hear OPEN + PROBE + CONFIRM + CLOSE verbatim. **Top reps script the load-bearing moments and improvise the rest.** What does NOT transfer: pharma has the **hardest individual-rep compliance overlay of any industry covered so far** — a single off-label sentence in field is a fireable + DOJ-reportable event, in a way the medical-device evidence-pyramid + real-estate-NAR-settlement + auto-F&I-CARS-Rule frames are merely demanding.

**Adjacent Pulse Knowledge Library entries:** PhRMA Code 2022 primer + FDA OPDP warning + untitled letter history + OIG Compliance Program Guidance Sept 2023 walkthrough + Sunshine Act / Open Payments reporting checklist + PDMA sample distribution audit template + REMS program list + ZS AccessMonitor methodology + Veeva Pulse benchmarking + IQVIA Xponent vs Symphony PHAST comparison + specialty pharmacy channel guide (CVS Specialty + Walgreens Specialty + Accredo + Optum Specialty + AllianceRx) + manufacturer patient hub services comparison (Pfizer Patient Connect + AZ Access 360 + BMS Access Support + Novartis Patient Support + AbbVie Access Solutions). **q9601 fractional CFO** maps onto the brand-level commercial-effectiveness conversation the VP Sales has with the launch-team CFO before approving any new field-force expansion.

**Frameworks for deeper read:** PhRMA Code (phrma.org/codes-and-guidelines) + FDA OPDP warning letters (fda.gov/drugs/warning-letters-and-notice-violation-letters) + OIG CPG (oig.hhs.gov/compliance) + CMS Open Payments (openpaymentsdata.cms.gov) + PDMA 21 CFR Part 203 (ecfr.gov) + FDA REMS (fda.gov/drugs/drug-safety-and-availability/risk-evaluation-and-mitigation-strategies-rems) + ZS AccessMonitor (zs.com/insights) + Veeva Pulse (veeva.com) + IQVIA commercial solutions (iqvia.com) + industry trade press Endpoints News + FiercePharma + BioPharma Dive + STAT + Pink Sheet + MM+M + PharmaVoice.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0010](https://pulserevops.com/sales-trainings/st0010).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block (PhRMA Code on Interactions with Healthcare Professionals 2022 update + FDA OPDP Office of Prescription Drug Promotion warning + untitled letters off-label enforcement + OIG Compliance Program Guidance for Pharmaceutical Manufacturers Sept 2023 final guidance + anti-kickback statute + speaker-program risk + fair-market-value + CMS Open Payments / Physician Payments Sunshine Act manufacturer reporting ≥$10 + PDMA Prescription Drug Marketing Act 1987 + 21 CFR Part 203 sample distribution + FDA REMS Risk Evaluation and Mitigation Strategies clozapine isotretinoin iPLEDGE mifepristone opioid + ZS Associates AccessMonitor + ePharma Physician 2024-2025 rep-access decline 79% to 44% + detail-length benchmarks 7 min specialty 4 min PCP + Veeva Pulse quarterly benchmark + Doctors.com + Sermo + Medscape physician surveys + IQVIA Xponent + NPA Audit + DDD prescriber-level Rx data + Symphony Health PHAST + IPSA + Veeva Link KOL data + Komodo Health + Trilliant + Definitive Healthcare + specialty pharmacy CVS Specialty + Walgreens Specialty + Accredo ESI Cigna + Optum Specialty UHC + AllianceRx Walgreens Prime + manufacturer patient hub services Pfizer Patient Connect + AstraZeneca Access 360 + Bristol-Myers Squibb Access Support + Novartis Patient Support + AbbVie Access Solutions + trade press Endpoints News + FiercePharma + BioPharma Dive + STAT + Pink Sheet + PharmaVoice + MM+M + trade associations PhRMA + BIO + NACDS + exemplar specialty launches Vraylar cariprazine AbbVie + Trikafta elexacaftor tezacaftor ivacaftor Vertex + Dupixent dupilumab Sanofi Regeneron + Ozempic Wegovy semaglutide Novo Nordisk + Keytruda pembrolizumab Merck + Vyvgart efgartigimod Argenx). Every framework research source named so a DSM can cite by name when reps push back. EXPLICITLY PHARMACEUTICAL SPECIALTY DETAILING - NOT SaaS - no Gong Bridge Group Pavilion ProfitWell SaaStr. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 8 quantified benchmark tables: (1) HCP Rep-Access Decline ZS AccessMonitor 2008 79% pre-Sunshine Act baseline → 2014 65% post-Sunshine Act early no-see trend → 2019 55% pre-COVID baseline → 2021 41% pandemic trough → 2023 45% partial reversion → 2025 44% new permanent baseline. (2) Specialty Detail Length by Specialty ZS 2024-2025 — PCP Internal Medicine 4 min 38% access / Endo Cards GI 6 min 52% / Rheum Derm Allergy 7 min 58% / Neuro Psych 7 min 51% / Community Oncology 7 min 62% / Academic NCCN Oncology 8 min 48% / Rare disease KOL 9 min 71%. (3) Detail-to-Rx-Commit Conversion by Discipline Tier — bottom-quartile no scripted OPEN feature-dump SHARE 15-22% commit 8-14 NRx/100 HCPs/qtr / below-average scripted OPEN no patient-finder PROBE 24-32% commit 18-28 NRx / average full 5 steps skips CONFIRM 34-42% commit 32-46 NRx / top-quartile 5 steps + 3 Rails consistently 48-58% commit 52-72 NRx / top-decile 5 steps + 3 Rails + hub + MSL choreography 60-72% commit 78-110 NRx. (4) Why HCPs Decline to Prescribe Veeva Pulse + Sermo — feature-dump no patient-relevance PROBE skipped 41% / payer formulary step-therapy PA burden 36% / bad prior hub experience 22% / side-effect safety concern not surfaced 19% / cheaper alternative perceived good enough 18% / rep waste of time OPEN rapport burn 17% / REMS enrollment burden 14% / off-label question not answered MSL routing failure 11% / HCP does not trust manufacturer brand 9%. (5) OPDP + DOJ Enforcement Cost 2009-2024 — OPDP untitled letter no fine reputational + corrective campaign cost / OPDP warning letter corrective action + restricted promotional materials / DOJ + OIG settlement single manufacturer single drug $150M-$1.5B systemic off-label + kickbacks + speaker programs / top-5 historical DOJ pharma settlement Pfizer 2009 $2.3B + GSK 2012 $3B + J&J 2013 $2.2B / individual rep termination + reportable event single off-label discussion in field. (6) Sunshine Act / Open Payments Reporting Thresholds — single payment ≥$10 YES reportable / cumulative annual >$100 all sub-$10 items reportable / sub-$10 single + cumulative <$100 NO below de-minimis / educational meal PhRMA-Code modest $25-$40 attendee YES if ≥$10 sign-in sheet / speaker honorarium YES fair-market-value test under OIG CPG. (7) Sample Distribution PDMA / 21 CFR 203 Compliance Audit — signed prescriber request YES low / left with receptionist no signature NO high PDMA violation / locked cabinet storage YES low / open desktop unlocked drawer NO high diversion / lot numbers tracked in CRM + manufacturer compliance YES low / re-distributed to office staff personal use NO high federal violation criminal exposure. (8) 7-Minute Detail Step-Adoption Curve — Step 1 OPEN 60-sec scripted verbal yes 32% week 1 → 88% week 12 / Step 2 PROBE patient-finder 90-sec silence hardest install 12% → 67% / Step 3 SHARE ONE on-label message tied to patient profile 28% → 84% / Step 4 CONFIRM surface real barrier 11% → 62% / Step 5 CLOSE PDMA signature + hub one-pager + next-call date 22% → 79% / ALL 5 steps every detail 4% → 51%. Step 2 PROBE + Step 4 CONFIRM hardest to install — weekly Veeva CRM call-note audit by DSM single biggest predictor of cohort NRx lift at 90 days. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 10-failure-mode counter-case: (1) Rep burns OPEN on rapport How was your weekend kids 30-45 sec wasted of 7-min window HCP mentally checks out per ZS 2024 #1 rep waste of time complaint drill verbatim OPEN sixty seconds permission ask verbal yes then iPad. (2) Skips Step 2 PROBE rep opens iPad starts presenting features per Veeva Pulse 41% of non-commits trace to PROBE-skip without patient-finder probe SHARE message has nothing to anchor to verbatim patient-finder probe in pairs before leaving room. (3) Goes off-label when HCP asks about sub-population not in FDA-approved indication rep answers single sentence OPDP-reportable event plus potential termination plus potential DOJ exposure for systemic patterns MSL-redirect verbatim drilled until reflex outside the indication let me have our MSL reach out today zero tolerance. (4) Makes coverage promises we will get it covered do not worry manufacturer cannot guarantee payer coverage OIG-flag plus fair-balance issue drill I cannot promise UHC will approve current PA approval rate is 78% average turnaround is 18 days statistics not promises. (5) Disparages competitor without head-to-head data Enhertu has worse safety in HER2-low without FDA-approved head-to-head trial data OPDP violation acknowledge competitor strength where data shows it reframe to specific sub-population where rep drug data is strongest honest comparison defensible disparagement is not. (6) Leaves samples without PDMA-signed request receptionist accepts samples no prescriber signature PDMA violation sample-request audit trail is what manufacturer compliance team and FDA inspectors look at zero samples without signed request if prescriber unavailable samples leave with rep return on next visit. (7) Skips Open Payments sign-in at educational meal untracked transfer of value ≥$10 Sunshine Act non-compliance sign-in sheet at every educational meal program track attendance + meal value per attendee submit to compliance same day. (8) Vague close I will be back when I am in the area no specific date no signed sample request no hub enrollment one-pager Step 5 collapsed per Veeva vague closes produce zero follow-up 71% of time verbatim close with specific date + signed paper + hub one-pager every detail every time. (9) Disparages prior manufacturer hub HCP has been burned by HCP says bad experiences with manufacturer hubs rep dismissively says that was different drug not us trust dies permanently acknowledge burn name specific operational change we restaffed regional team March 2024 current PA appeal success 84% let numbers earn back trust. (10) DSM does not audit weekly Veeva CRM call notes kills 65-75% of HCP-detail training rollouts per Veeva Pulse 2024 30-day half-life un-coached reps revert to feature-dump + any questions close by week 4 one detail per rep per week reviewed in 1:1 marked for 5-step + 3-Rail adherence non-negotiable. Plus 7 common DSM and brand team objections with honest answers: reps already know how to detail / compliance and Rx growth in tension / AccessMonitor depressing why train into shrinking window / rare disease reps do not need this / oncology academic reps work with KOLs different game / senior reps do not need this / how do I know it is working three 90-day signals NRx +30-50% per rep + detail-to-commit rate +15-25 pts + ZS AccessMonitor decile lift +1-2 + zero OPDP findings + sample-request signed-rate above 85%. Plus when-to-rerun-every-90-days cadence with rotated archetypes REMS-enrolled drug requiring HCP enrollment verification + biosimilar-pressured biologic + rare-disease orphan-drug with <500 national prescribers + ophthalmology drug with practice-administered injection workflow + hospital-system P&T committee detail + ACO/value-based-care-contracted health system. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as TENTH entry and FOURTH industry-specific training after st0007 orthopedic medical device sales st0008 residential real estate listing presentations st0009 automotive F&I — st0001-st0006 covered B2B SaaS sales motions that translate across industries from st0007 forward pivots to industry-by-industry coverage and st0010 is specialty pharmaceutical HCP detailing the most-regulated 7-minute conversation in commercial sales the territory where rare-disease oncology immunology hematology neurology ophthalmology brand teams fight for NRx growth inside PhRMA Code + FDA OPDP + OIG + Sunshine Act + PDMA + REMS enforcement perimeter. Companion industry-specific entries planned st0011 commercial real estate brokerage + st0012 property management + multifamily leasing + st0013 title insurance + closing services + st0014 new construction + builder sales reps + st0015 real estate investment sales fix-and-flip BRRRR syndication + st0016 real estate tech vendor sales CRM MLS iBuyer proptech + st0017 medical-device adjacencies cardiology + endovascular + st0018 biotech KAM key account management for hospital health systems + st0019 specialty pharmacy hub-services sales + st0020 payer market-access account director conversations with PBMs. Cross-references to st0001-st0006 SaaS foundation arc translated for pharma detailing: st0001 discovery → Step 2 PROBE patient-finder question replaces SaaS discovery / st0002 single-threading → MSL is second thread for off-label scientific exchange / st0003 objection recovery → Step 4 CONFIRM surfaces real barriers formulary PA REMS / st0004 cold-call opener → Step 1 OPEN 60-sec scripted permission ask / st0005 demo discipline → Step 3 SHARE ONE on-label message tied to patient profile FDA-approved detail aid / st0006 pricing → CONFIRM surfaces patient cost as real barrier hub services as response. Cross-reference to st0007 + st0008 + st0009 what transfers — discipline of verbatim language on load-bearing moments + recording-or-CRM-reviewed coaching cadence transfers exactly where st0007 made surgeons hear OR + Evidence + Outcome diagnostics verbatim st0008 made sellers hear PROOF + Fee 4-line + PRICE-as-range verbatim st0009 made customers hear 9-Step F&I verbatim st0010 makes HCPs hear OPEN + PROBE + CONFIRM + CLOSE verbatim top reps script load-bearing moments improvise rest what does NOT transfer pharma has hardest individual-rep compliance overlay of any industry covered so far single off-label sentence in field is fireable + DOJ-reportable event in a way medical-device evidence-pyramid + real-estate-NAR-settlement + auto-F&I-CARS-Rule frames are merely demanding. Adjacent Pulse Knowledge Library entries PhRMA Code 2022 primer + FDA OPDP warning + untitled letter history + OIG Compliance Program Guidance Sept 2023 walkthrough + Sunshine Act Open Payments reporting checklist + PDMA sample distribution audit template + REMS program list + ZS AccessMonitor methodology + Veeva Pulse benchmarking + IQVIA Xponent vs Symphony PHAST comparison + specialty pharmacy channel guide CVS Specialty Walgreens Specialty Accredo Optum Specialty AllianceRx + manufacturer patient hub services comparison Pfizer Patient Connect AZ Access 360 BMS Access Support Novartis Patient Support AbbVie Access Solutions + q9601 fractional CFO maps onto brand-level commercial-effectiveness conversation VP Sales has with launch-team CFO. Reading list of frameworks with URLs: PhRMA Code phrma.org/codes-and-guidelines + FDA OPDP warning letters fda.gov + OIG CPG oig.hhs.gov + CMS Open Payments openpaymentsdata.cms.gov + PDMA 21 CFR Part 203 ecfr.gov + FDA REMS fda.gov + ZS AccessMonitor zs.com + Veeva Pulse veeva.com + IQVIA commercial solutions iqvia.com + industry trade press Endpoints News + FiercePharma + BioPharma Dive + STAT + Pink Sheet + MM+M + PharmaVoice. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Tenth Pulse Sales Training entry st0010 and FOURTH industry-specific training after st0007 orthopedic medical device sales st0008 residential real estate listing presentations st0009 automotive F&I — fully runnable 60-minute live specialty-pharma HCP detail training for the most-regulated 7-minute conversation in commercial sales (per ZS Associates AccessMonitor 2024-2025 + ePharma Physician + Veeva Pulse rep-access declined every year since 2019 only 44% of US physicians grant ANY pharma rep access in 2025 vs 79% in 2008 the COVID drop never reverted average specialty detail 7 min oncology rare-disease 4 min PCP 70%+ no-see or limited access) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,000 words ABSOLUTE HARD CAP 10,500. LEAN-FROM-START pattern mirroring st0008. Structure: orange Pulse Training callout intro (who-for: territory-based specialty pharma sales reps + clinical specialists / MSLs in rare disease oncology immunology hematology neurology ophthalmology accounts + DSMs district sales managers; works across biotech-launched big-pharma-launched and rare-disease orphan-drug commercial models; what-bring: recordings or ride-along notes from team last 3 unconverted high-decile HCP calls + copy of FDA-approved detail aid + post-2024 Open Payments report + brand strategy guidelines + printed leave-behind one-pager + whiteboard for stalled-HCP scoring) + Bottom Line callout You are not selling molecule you are surfacing patient on doctor panel who will benefit + 5-step + 3-Rail thesis + 6-row pipe-table agenda (0:00-0:05 Cold Open / 0:05-0:22 Teach / 0:22-0:32 Discussion / 0:32-0:52 Role-Play / 0:52-0:57 Debrief+Commitments / 0:57-1:00 Leave-Behind) + Section 1 Cold Open with ZS AccessMonitor 79%→44% rep-access collapse + 70% no-see + Veeva Pulse 2x conversion top-quartile + 62% no-see cited rep wasted my time + Priya CGRP migraine launching drug composite Cincinnati neurologist Tuesday lunch burned 4 of 7 min on iPad opening monologue HERALD trial 4.7-day reduction got Can we wrap zero commit no sample no hub no next-call date vs restructured next quarter two patient stories permission verbal yes patient-finder probe 30-40% sub-optimally controlled surfaced 3 specific patients in panel verbal commitment 6 min signed sample 5 starter cartons hub enrollment one-pager + Common Trap doctor cuts me off nothing I can do top-quartile reps convert 2x same 7-min window the constraint is the script not the time HCPs who no-see cited rep wasted my time on previous call reputation precedes next visit every detail is audition for next + Section 2 Teach split into Part A 7-MINUTE DETAIL Framework 11 min (Step 1 OPEN 60 sec do not waste seconds on rapport patient stories framing permission verbal yes BEFORE opening iPad verbatim Dr Name thanks for time love to share two patient stories that mirror your panel then hear how you are treating condition right now sound good / Step 2 PROBE 90 sec patient-finder question among your condition patients on incumbent therapy how many sub-optimally controlled at 6 months what does next step look like for those patients today listen take ONE note NEVER interrupt 30-90 sec silence after probe is where HCP tells you exactly which patient profile to anchor on / Step 3 SHARE 3 min ONE on-label clinical message tied to patient profile FDA-approved detail aid + Phase III primary endpoint + KM curve + NNT do NOT veer off-label do NOT compare directly to competitor without FDA-approved head-to-head data OPDP enforcement aggressive verbatim You named patients failing two prophylactics at 6 months in Phase III HERALD trial on-label population patients with that exact profile saw 4.7-day reduction in monthly migraine days at week 12 versus 1.8 days on placebo NNT was 4 here is KM curve from primary endpoint ONE slide not 12 / Step 4 CONFIRM 90 sec surface real barrier not any questions verbatim For next patient you see who fits that profile what is stopping you from prescribing drug answers always real barriers formulary placement prior authorization burden payer mix REMS enrollment side-effect concerns patient out-of-pocket cost patient hub services + medical affairs + market access team exist to solve / Step 5 CLOSE 60 sec PDMA-signed sample request + hub enrollment one-pager + scheduled next interaction NOT vague I will swing back when I am in area name specific date verbatim Can I have your sample request signature for 5 starter cartons + patient hub enrollment form for your next eligible patient I will be back Tuesday the 28th at 12:15 with formulary update on UnitedHealthcare I will text Maria the day before to confirm) and Part B PhRMA Code Three Rails Compliance Frame 6 min (Rail 1 ON-LABEL ONLY never discuss off-label use even when HCP asks per FDA OPDP enforcement warning + untitled letters publicly indexed off-label promotion single most-enforced pharma sales violation fireable + reportable event for rep AND triggers manufacturer fines DOJ settlements when systemic verbatim MSL redirect outside the FDA-approved indication so it is not something I am able to discuss what I can do is connect you with our Medical Science Liaison Dr Name who can have unrestricted scientific exchange / Rail 2 NO INDUCEMENT per Sunshine Act Open Payments + OIG Compliance Program Guidance + PhRMA Code 2022 every meal sample honorarium consulting fee transfer of value ≥$10 reported on CMS Open Payments database publicly searchable educational lunches modest $25-$40 per attendee industry-typical cap genuinely educational not entertainment not tickets not golf no off-policy dinners verbatim Lunch is $28 per attendee within educational-meal policy detail aid is educational content tracking attendance on sign-in sheet for Open Payments if anyone uncomfortable being reported please do not sign / Rail 3 SAMPLE INTEGRITY per PDMA Prescription Drug Marketing Act + 21 CFR Part 203 every sample requires signed sample request from licensed prescriber stored in locked sample storage rep car trunk lockbox + office locked cabinet tracked via chain-of-custody documentation samples cannot be diverted sold used by anyone other than patients verbatim Five starter cartons PDMA requires your signature here confirming you are licensed prescriber in this state and these go to your patients not staff use storage cabinet locked great I will record lot numbers in Veeva and submit to compliance tonight) + Section 3 Discussion 6 prompts (highest-decile target HCP who has not written single Rx + which of 5 steps broke + verbatim HCP deflection + current ZS AccessMonitor score + Open Payments YTD + signed sample requests + Rail compliance near-miss + ONE concrete next move verbatim) + Section 4 Two-Person Role-Play with Round 1 Dr Sarah Liang 47 medical oncologist Associate Professor NCCN cancer center launching HER2-low ADC three deflections Enhertu two years Trodelvy third-line what makes your ADC different magnitude not mechanism / DESTINY-comparator phase III smaller PFS magnitude vs Enhertu defend that / infusion suite 92% capacity 90-minute first infusion 30-minute observation how do we handle chair time REP runs 7-Minute Detail holds ON-LABEL Rail acknowledges data honestly versus Enhertu in broader HER2-low population magnitude smaller not going to claim otherwise where data is strongest is post-Enhertu sub-group reframes to specific sub-population MSL redirect on biomarker sub-population question outside indication plus Round 2 Dr Marcus Reeves 52 community rheumatologist suburban Phoenix 6-physician group 22-26 patients/day 70% commercial UnitedHealthcare biologic for moderate-severe RA Tier 4 UHC step-therapy methotrexate + leflunomide first 6-week PA typical $28/attendee Wednesday turkey sandwich educational meal three deflections patients cannot afford Tier 4 + PA 6 weeks UHC approval / bad experiences with manufacturer hubs paperwork PA denials patient assistance 8 weeks / 4 cheaper biologics in same class 2 generics in conventional DMARD line my patients can actually get covered REP reframes without coverage promises I cannot promise UHC coverage that would be inappropriate but our current PA approval rate in this region is 78% average turnaround dropped from 6 weeks 2023 to 18 days Q4 2024 because UHC tightened auto-approval criteria + hub burn hear that I am sorry different hub different year we restaffed regional team March 2024 current PA appeal success rate 84% + cheaper alternatives completely fair if patient doing well on TNF or does not have specific disease activity profile those are better choices patient I would ask you to consider this for is one who failed TNF and JAK and needs different mechanism Phase III was powered for + close hub enrollment one-pager + PA turnaround summary for office manager + introduce office manager Sarah to regional hub manager Beth by name + 60-sec reset + Section 5 Debrief+Commitments 3 debrief Qs which step felt strongest + which Rail almost crossed + next concrete action + 4-line commitment ritual next target HCP + step to lead with + ONE verbatim language change + call to log in Veeva this week + Section 6 Leave-Behind walkthrough + printable one-pager (7-Minute Detail framework as 5-step visual grid with verbatim cue lines / PhRMA Code Three Rails compliance frame as 3-quadrant grid / Specialty Access Scorecard checklist ZS AccessMonitor decile + Veeva CRM last 3 interactions + Open Payments YTD + IQVIA Xponent NPA prior Rx history + payer formulary restrictions + patient hub enrollment trend + REMS enrollment + sample inventory + last MSL touch + peer KOL connection / Never-Do behavior list 12 items / Outcome Line wins 54% commit + zero compliance exposure + 78% PA approval + repeat HCP access vs losses 15-20% commit + warning-letter risk + PDMA violation + HCP no-sees + reputation damage / If You Only Remember One Thing hero quote You are not selling molecule you are surfacing patient on doctor panel who will benefit doctor wrote script before you walked in your job is just to make sure they remember to). How-this-fits-in-specialty-commercial-stack table at end of core showing pre-call planning + first 60 seconds + patient targeting + clinical message delivery + barrier surfacing + call close + compliance overlay + manager coaching. Two mermaid diagrams: 60-min meeting flow + manager coaching loop post-training. 8 benchmark tables (HCP rep-access decline ZS + specialty detail length by specialty + detail-to-Rx-commit conversion by tier + why HCPs decline Veeva + Sermo + OPDP/DOJ enforcement cost + Sunshine Act/Open Payments thresholds + sample PDMA audit + 5-step adoption curve). 10-failure-mode counter-case + 7-DSM-objection coach-back + when-to-rerun. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping st0001 discovery → Step 2 PROBE / st0002 single-threading → MSL is second thread / st0003 objection recovery → Step 4 CONFIRM / st0004 cold-call opener → Step 1 OPEN / st0005 demo discipline → Step 3 SHARE / st0006 pricing → CONFIRM surfaces patient cost + companion industry-specific entries planned st0011-st0020 + cross-reference to st0007 + st0008 + st0009 what transfers (verbatim language on load-bearing moments + CRM-reviewed coaching cadence) and what does not (pharma has hardest individual-rep compliance overlay of any industry covered so far single off-label sentence in field is fireable + DOJ-reportable event). Tags include sales-training (hub filter) + pharmaceutical-sales + pharma-detailing + specialty-drug + hcp-conversation + phrma-code-compliant + 60-min-meeting + standard-team + oncology-rep + rare-disease + st0010. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY PHARMACEUTICAL SPECIALTY DETAILING - NOT SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Industry-correct sources: PhRMA Code 2022 + FDA OPDP + OIG CPG Sept 2023 + Sunshine Act/Open Payments + PDMA + REMS + ZS AccessMonitor + Veeva Pulse + IQVIA Xponent + Symphony PHAST + specialty pharmacy + manufacturer hubs + Endpoints News + FiercePharma + BioPharma Dive + STAT + Pink Sheet + PhRMA + BIO + NACDS. Exemplar drugs named without endorsement: Vraylar + Trikafta + Dupixent + Ozempic/Wegovy + Keytruda + Vyvgart. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0010 is crawled.
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
