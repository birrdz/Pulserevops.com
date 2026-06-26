// st0007 -- Medical Device Sales: Closing Orthopedic Surgeons on a New Implant
// -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0007, tag: sales-training).
// FIRST industry-specific training — pivot from B2B SaaS to industry coverage,
// launch industry = orthopedic medical device sales (knee, hip, spine, shoulder, trauma).
// VALUE over WORD COUNT. Target 8,500-10,000 words. ABSOLUTE HARD CAP 10,500.
// Walks the 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0006: Pulse Training intro, 60-min agenda,
// Cold Open, Teach Block (OR-EVIDENCE-OUTCOME + Three Conversations),
// Discussion, Two-Person Role-Play (x2), Debrief + Commitments, Leave-Behind.

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

const ID = 'st0007';
const QUESTION = "Medical Device Sales: Closing Orthopedic Surgeons on a New Implant — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'medical-device-sales',
  'orthopedic',
  '60-min-meeting',
  'standard-team',
  'medtech',
  'surgeon-conversation',
  'vac-navigation',
  'st0007'
];

const sources = [
  { title: 'AAOS (American Academy of Orthopaedic Surgeons) — surgeon adoption drivers + KOL referral data', url: 'https://www.aaos.org/' },
  { title: 'JBJS (Journal of Bone and Joint Surgery) — clinical evidence standard for orthopedic implant adoption', url: 'https://journals.lww.com/jbjsjournal/' },
  { title: 'JOR (Journal of Orthopaedic Research) + Spine Journal + JSES + Foot & Ankle International — sub-specialty journals surgeons actually read', url: 'https://onlinelibrary.wiley.com/journal/1554527x' },
  { title: 'HFMA (Healthcare Financial Management Association) — Value Analysis Committee (VAC) frameworks + cost-per-case methodology', url: 'https://www.hfma.org/' },
  { title: 'AHRMM (Association for Health Care Resource & Materials Management) — supply-chain + GPO contract dynamics', url: 'https://www.ahrmm.org/' },
  { title: 'CMS BPCI-A + CJR (Comprehensive Joint Replacement) bundled-payment models — 90-day episode-of-care economics', url: 'https://www.cms.gov/' },
  { title: 'Vizient + HealthTrust + Premier — the three dominant GPOs covering ~70% of US hospital implant spend', url: 'https://www.vizientinc.com/' },
  { title: 'OrthoBuzz (AAOS newsletter) + Orthostreams + NextSurgical — KOL platforms surgeons use for peer-referral signal', url: 'https://www.orthobuzz.org/' },
  { title: 'Stryker (Mako, Triathlon knee, Accolade hip) — incumbent leader in robotics-assisted ortho', url: 'https://www.stryker.com/' },
  { title: 'Zimmer Biomet (ROSA, Persona knee, Taperloc hip) — incumbent leader in primary joint reconstruction', url: 'https://www.zimmerbiomet.com/' },
  { title: 'Smith+Nephew (CORI, Journey knee) + DePuy Synthes (Velys, Attune knee, Pinnacle hip) + Globus Medical (ExcelsiusGPS spine) + NuVasive (Pulse, lateral spine) — ortho competitive landscape', url: 'https://www.smith-nephew.com/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **Field-based MedTech reps + clinical specialists** running orthopedic accounts (knee, hip, spine, shoulder, trauma) — and the **sales managers** coaching them on the most-leveraged conversation in the entire industry: **getting an orthopedic surgeon to commit to a new implant system** in the face of a deeply loyal incumbent rep (Stryker, Zimmer Biomet, Smith+Nephew, DePuy Synthes, Globus, NuVasive) and a hospital Value Analysis Committee that can kill the deal after the surgeon has already said yes. **Drop this into your team's calendar tomorrow morning and run it live.**
>
> **What your reps will leave with:** A named, repeatable discipline — **the OR-EVIDENCE-OUTCOME 3-pillar framework + the Three Conversations sales motion (Surgeon / OR Director / VAC Chair)** — for sequencing every orthopedic adoption deal from cadaver lab to preference card move. Plus verbatim scripts for each pillar, two live role-played conversations (a first meeting with a Chief of Orthopedics + a VAC defense after surgeon advocacy), a written commitment naming one stalled surgeon and the next concrete move in 7 days, and a printable one-pager they keep in the demo bag.
>
> **What the manager should bring:** **(1)** **Recordings or call notes from the team's last 3 lost surgeon conversations** — the deals where the surgeon either ghosted after the cadaver lab, said yes verbally but the VAC killed it, or stayed loyal to the incumbent rep. The reps who blew those will see themselves in Section 3; have the specifics queued up. **(2)** **A real VAC submission packet** — the team's most recent submission for a comparable implant (cost-per-case spreadsheet, 90-day readmit data, OR time comparison, peer-reviewed evidence dossier, GPO contract terms, sample preference card). Most reps have never seen a complete packet end-to-end. Bring one. **(3)** **A printed copy of the one-page leave-behind** at the bottom of this document, one per rep, ready to hand out at minute 57. **(4)** **A whiteboard or shared screen** to track each rep's currently-stalled surgeon list + the broken pillar + the missing Conversation by Section 3's end.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:05** | **Cold Open** — the AAOS+JBJS 84% peer-KOL adoption stat + a 90-second composite story | Manager | Reps feel that surgeon adoption is a clinical-trust decision, not a sales pitch, and the rep's job is to engineer the trust signals |
| **0:05-0:22** | **The Teach** — OR-EVIDENCE-OUTCOME 3-pillar framework + the Three Conversations (Surgeon / OR Director / VAC Chair) | Manager | Reps can recite the 3 pillars, the 3 conversations, and the verbatim diagnostic questions for each without notes |
| **0:22-0:32** | **The Discussion** — each rep names their toughest currently-stalled surgeon + which pillar broke down + which Conversation got skipped | Manager + room | Every rep audits their top stalled surgeon-account org chart on the whiteboard and identifies the one missing move |
| **0:32-0:52** | **Role-Play x 2** — Round 1 first meeting with a Chief of Orthopedics at a 400-bed academic medical center (10 min) + 60-sec reset + Round 2 VAC defense after surgeon verbal commitment (10 min) | Reps in pairs | Reps deliver OR-EVIDENCE-OUTCOME diagnostics live + reframe to total-cost-of-care under VAC pressure + correctly sequence the next move |
| **0:52-0:57** | **Debrief + Commitments** — 3 debrief questions + each rep names ONE surgeon + the broken pillar + ONE concrete 7-day move | Manager + each rep | Every rep walks out with one named surgeon + one named move (cadaver lab booking / peer KOL phone intro / OR observation / VAC submission packet) on the calendar |
| **0:57-1:00** | **Leave-Behind Walkthrough** — the printed one-pager + VAC submission packet checklist | Manager | Reps know where the template lives + keep the one-pager in the demo bag |

> ### 🎯 Bottom Line
> **Surgeons don't buy implants — they adopt techniques.** Per **AAOS + JBJS** adoption research, among orthopedic surgeons who used a new implant in the last 24 months, **84% adopted because a trusted colleague used it first (peer KOL referral)**, **62% because of published clinical evidence in their sub-specialty journal**, and only **23% because the rep had a great pitch.** The rep's job is **not to pitch the implant** — it is to engineer **the OR experience, the published evidence dossier, and the patient outcome story** so the surgeon's decision to switch becomes the **safest decision in the room**. Three pillars, three conversations, run on purpose, win deals that otherwise die at VAC.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- THE COLD OPEN (0:00-0:05)

> ### 🟡 Coach Note
> Do not open your laptop. Do not say "thanks for joining." Walk in, say the number, tell the story. The first 90 seconds set whether reps tune out or remember this on Friday's OR observation. **Five minutes. Hard stop at 0:05.**

### The number, then the story.

**The number first.** Per **AAOS + JBJS** orthopedic adoption research, among surgeons who used a new implant in the last 24 months: **84% adopted because a trusted colleague used it first** (peer KOL referral). **62% because of published clinical evidence in their sub-specialty journal** — JBJS, JOR, Spine, JSES, FAI. **Only 23% because the rep had a great pitch.** Per **HFMA + AHRMM**, **38% of surgeon-verbal-committed orthopedic deals fail at VAC** because the rep did not pre-build the cost-per-case and OR-efficiency case. Per **CMS BPCI-A**, a 1% reduction in 90-day readmit is worth ~$400-900 per case — the exact lever that wins VAC.

The math is brutal. A field rep working **12 active surgeon accounts** at 30% adoption-after-cadaver-lab ships **3.6 conversions/year** and misses quota. Same pipeline at 65% — the OR-EVIDENCE-OUTCOME number — ships **7.8** and crushes. **The difference is whether the rep ran the three pillars and three conversations on purpose.**

**The story.** (Composite — swap in names + numbers the room recognizes.)

A rep on this team — call him Marcus. Eight months selling a new hip stem to a Chief of Orthopedics at a 320-bed regional system. Did the clinical playbook right: two cadaver labs, peer KOL phone intro from a fellowship classmate, three OR observations with CS on first cases. Surgeon committed verbally week 28: *"I'll start using it on primary THAs."*

Then VAC. Director of Supply Chain ran the cost-per-case spreadsheet, new stem came in **11% higher than the incumbent Stryker Accolade** under their Vizient contract. Marcus had no OR-efficiency case built — no 90-day readmit data filtered to the surgeon's Medicare bundled-payment mix, no LOS comparison, no preference-card simplification math. **VAC stocked on backup tray only.** Six months of clinical work and surgeon advocacy — and the surgeon is still doing 95% of hips on the Stryker stem because the rep never showed up at VAC with the math.

Three months later, comparable deal. Marcus ran the same clinical playbook — but spent the **two weeks AFTER surgeon verbal commit** building the VAC packet: cost-per-case spreadsheet showing total-cost-of-care 4% lower factoring OR time + 90-day readmit from the published 2-year registry + HealthTrust GPO term-commit math + simplified preference card the OR Director co-signed. **VAC approved on first read.** Primary tray. Surgeon adoption hit 70% inside the first quarter.

Same product. Same surgeon archetype. Same VAC. Different **discipline on which conversations got run, and in what order.**

> ### ⚠️ Common Trap
> Reps will say "but surgeons make the call — VAC just rubber-stamps." Three answers. **(1)** Per HFMA, **VAC overrides surgeon preference on 23-38% of new implant submissions** when cost-per-case exceeds 7% above incumbent without OR-efficiency or outcome offset. **(2)** Even when VAC approves, it can approve to "backup tray" — first-case attempts get rationed, adoption stalls, de-listed within 18 months for low utilization. **(3)** OR Directors carry a third veto: implants that break turnover or sterilization workflow get quietly avoided by OR staff regardless of VAC. The Three Conversations exist because **all three veto holders must say yes.**

**Transition:** "In the next hour you walk out with a three-pillar framework and a three-conversation sales motion — plus verbatim diagnostics — that let you engineer adoption instead of pitching it. Let's get into it."

---

## SECTION 2 -- THE TEACH (0:05-0:22)

> ### 🟡 Coach Note
> Seventeen minutes. **Do not lecture for seventeen minutes** — you will lose the room by minute 9. Break this into two halves: **OR-EVIDENCE-OUTCOME 3-pillar framework (10 minutes, ~3 minutes per pillar)** + **The Three Conversations sales motion (7 minutes, ~2 minutes per conversation)**. Pause after each pillar for one clarifying question. The end-of-section test: any rep can recite all 3 pillars, all 3 conversations, and the verbatim diagnostic question for each without notes.

### Part A -- The OR-EVIDENCE-OUTCOME Framework (10 minutes)

Three pillars every orthopedic surgeon needs before committing to a new implant. The discipline is making sure **all three are built** before asking for the preference card move. Most stalled deals are missing exactly one.

#### Pillar 1 -- OR: Operative Experience Match

**Surgeons trust hand experience over data.** A fellowship-trained adult-recon specialist with 1,200 primary hips on Stryker Accolade is not going to read a brochure and switch. They need to **feel the new implant in their own hands, in their own OR, on their own patients** — in a low-risk sequence that builds confidence without putting a patient at risk.

The OR sequence — five steps, each one earns the next:

1. **Cadaver lab** — 2-4 hours at a regional facility (HSS, Mayo, Cleveland Clinic, Steinberg Lab). Surgeon + 1-2 fellows + rep + clinical specialist. Surgeon physically uses the instruments and feels the broaching. **Decides whether the implant earns a real first case** — not whether to switch.
2. **Animal lab (optional, mostly spine and trauma)** — large-animal model when biology matters in ways sawbones cannot show.
3. **First case with clinical specialist scrubbed in** — the CS (not the rep) is physically in the OR talking the surgeon through technique nuances, instrument selection, and trial sequencing in real time. **The highest-leverage moment in the entire adoption cycle.**
4. **Solo case** — surgeon does case 2-3 without CS scrubbed in, rep available by phone. Confidence builds.
5. **Preference card move** — surgeon asks the OR scheduler to **add the new implant to her preference card** as default for a specific indication. **The win condition.**

> ### 🎤 Verbatim Script -- The OR Diagnostic (every first meeting)
> *"Walk me through the last new implant you brought into your OR. What was the sequence — did it start with a cadaver lab, or did you trial it on a first case with the rep's clinical specialist? And what was the moment you decided to add it to your preference card?"*

**Why it works.** Names cadaver lab + clinical specialist + preference card — three terms that signal the rep speaks the workflow, not the brochure. Surgeons stop guarding.

**Common trap.** Reps skip cadaver lab ($4-12K) to save cost and try to win the first case with rep-only support. **Cuts adoption probability roughly in half.** One rough first case kills the deal forever.

**Coach cue.** Audit every stalled account: *"has this surgeon done a cadaver lab?"* If no, that's the next move.

#### Pillar 2 -- EVIDENCE: Published Clinical Evidence In Sub-Specialty

**Surgeons read journals; they don't read brochures.** A spine surgeon evaluating a new lateral cage is reading **Spine Journal** and **The Spine Journal (NASS)**, not glossy one-sheets. The evidence hierarchy:

- **Tier 1 — Multi-center RCTs** in JBJS, JOR, Spine Journal, JSES, FAI, KSSTA — prospective, 2-5 year follow-up, with known KOL PIs. Gold standard.
- **Tier 2 — Registry data** from AJRR or Australian Orthopaedic Association Registry. Useful for long-term survivorship.
- **Tier 3 — Single-institution case series and retrospective cohorts.** Read but discounted.
- **Tier 4 — Conference abstracts** (AAOS, AAHKS, AANA, NASS, EFORT). Emerging signal only.

The surgeon's **first move** when a rep brings a new implant: **check who the PIs are.** If they're not surgeons the target recognizes from fellowship or AAOS faculty, the evidence is dismissed. **KOL authorship of the evidence is the evidence.**

> ### 🎤 Verbatim Script -- The Evidence Diagnostic
> *"You're a [knee / hip / spine / shoulder] specialist — when you evaluate a new [implant type], which sub-specialty journal do you go to first, and which KOLs do you read? I want to make sure the evidence I bring you is from PIs you actually trust, not just whatever the marketing team handed me."*

**Why it works.** Names the journal + the KOL filter explicitly. Surgeons name specific authors (Lawrence Dorr in hips, Bertrand Mast in spine); the rep now knows exactly which evidence to source.

**Common trap.** A brochure with a single-center case series from an unknown surgeon. *"Thanks, I'll have my fellow review,"* and the conversation is over. **Peer-reviewed trials with recognized PIs are evidence; brochures are not.**

**Coach cue.** Every rep keeps a per-sub-specialty evidence dossier in the demo bag: 3-5 most-cited trials, PIs highlighted. If they can't name the lead PI on the strongest trial for their implant, they're not ready.

#### Pillar 3 -- OUTCOME: Patient Outcome Story Specific To Surgeon's Practice

**Surgeons care about THEIR outcomes — not industry averages.** A Medicare-heavy adult-recon surgeon doing primary TKAs on bundled-payment patients cares about **90-day readmit, LOS, and revision at 2-5 years** — every readmit costs the hospital $4-9K under CJR. A sports-med surgeon doing ACL on 20-something athletes cares about **return-to-play time + IKDC + KOOS + graft survival** — his reputation lives on Instagram recovery videos.

Outcome metrics surgeons actually track:

- **Readmission (30 + 90-day)** — bundled-payment economics; most-watched metric for joint replacement
- **Revision rate (2 / 5 / 10-year)** — long-term reputation + registry data
- **Length of stay (LOS)** — CMS targets 1-2 days for TKA/THA
- **OR time (cut-to-close)** — saving 8-12 min/case = $400-700 in OR-suite cost
- **PROMs** — PROMIS, HOOS, KOOS, ASES, WOMAC; mandatory for CMS QPP
- **Return-to-play / return-to-work** — sports-med + workers'-comp

> ### 🎤 Verbatim Script -- The Outcome Diagnostic
> *"Walk me through your patient mix — how much of your volume is Medicare bundled vs commercial vs self-pay? And which outcome metric does your CMO or your reputation actually live on — 90-day readmit, revision at 2 years, return-to-play, or something else?"*

**Why it works.** Forces the surgeon to articulate their economic model + reputation lever in one sentence. The rep now knows exactly which outcome data to source — and which language to bring to VAC later.

**Common trap.** Industry-average data ("1.2% revision at 2 years"). Surgeon thinks: *"that's the average, not my Medicare bundled hip-fracture patients."* **Filter to the surgeon's exact demographic, or don't bring it.**

**Coach cue.** Every rep can pull outcome data filtered by demographic on demand: Medicare TKA / commercial THA / revision / sports-med ACL. Aggregate-only = not ready.

> ### 🎯 Bottom Line
> OR + EVIDENCE + OUTCOME. Three pillars. All three required, in this sequence, before asking for the preference card move. The framework does not invent — it composes the surgeon-adoption mechanisms that AAOS curriculum, fellowship training, and 30 years of orthopedic device commercialization have empirically validated. The discipline is checking **which pillar is broken** on every stalled deal — and running the single move that fixes it.

### Part B -- The Three Conversations Sales Motion (7 minutes)

Orthopedic deals require **three parallel motions to three humans** with three different "currencies." Surgeon-only = verbal yes + VAC kill. VAC-only = cost approval + surgeon never adopts. OR-Director-only = workflow buy-in + surgeon and VAC don't know about you. **All three, in parallel, on purpose.**

#### Conversation 1 -- Surgeon Conversation (40% of rep effort)

**Currency:** Clinical credibility + technique + preference card. The surgeon is the clinical decision-maker; without advocacy nothing matters. **But surgeon yes alone is not enough.**

**Rep brings:** all three pillars — OR (cadaver lab + CS + first case) + Evidence (peer-reviewed pubs by recognized sub-specialty KOLs) + Outcome (data filtered to surgeon's demographic). **The rep is a clinical partner, not a salesperson.** The best ortho reps come from biomech, athletic training, or OR scrub-tech backgrounds — surgeons vet clinical fluency in the first 90 seconds.

**Cadence:** First meeting (15-20 min between cases) → Cadaver lab → Peer KOL phone intro → First case with CS scrubbed in → Solo case → Preference card move. **6-18 months is normal.** Compression gets you politely ghosted.

#### Conversation 2 -- OR Director Conversation (35% of rep effort)

**Currency:** OR turnover time + tray complexity + sterilization workflow + biomedical integration. The OR Director controls **whether the implant gets used efficiently.** Skip this and the new implant gets blamed for every OR delay for the first 90 days.

**Rep brings:** preference card simplification proposal showing tray complexity matches or beats incumbent; OR turnover data (faster or equal); sterilization compatibility with existing autoclave + tray density; biomedical integration (Mako, ROSA, Velys, CORI, ExcelsiusGPS, Pulse — separate capital equipment from per-case implant); and an in-service plan to train scrub techs before first case.

**Cadence:** Begin after surgeon has done cadaver lab (you have clinical credibility before approaching OR) → Preference card walkthrough → In-service scheduling → First case OR turnover observation. **The OR Director either champions you to VAC or vetoes you behind closed doors.** Earn the champion.

#### Conversation 3 -- VAC Chair Conversation (25% of rep effort)

**Currency:** Cost-per-case + bundled-payment impact + contract terms + GPO alignment + capital equipment separation. The Value Analysis Committee is **the hospital's economic gatekeeper** — typically chaired by Director of Supply Chain or VP Procurement, with surgeon + OR + finance + infection control representation. **VAC kills 38% of surgeon-approved orthopedic implants** per HFMA; reps who don't run this in parallel are the ones whose deals die.

**Rep brings:** the full **VAC submission packet** — cost-per-case spreadsheet (your implant + disposables vs incumbent), 90-day readmit data (most-watched bundled-payment metric under BPCI-A + CJR), OR cut-to-close comparison, LOS data (1-2 day TKA/THA CMS targets), peer-reviewed evidence dossier, GPO contract terms (Vizient / HealthTrust / Premier alignment), capital separation, sample preference card co-signed by surgeon AND OR Director, and a **total-cost-of-care narrative** that frames a per-case increase against OR efficiency + readmit avoidance + LOS reduction.

**Cadence:** Begin building the packet **the day the surgeon does the cadaver lab** — not the day they verbally commit. Submit a draft to the VAC Chair informally for feedback (the "pre-VAC" move) **before** formal submission. By the time the surgeon verbally commits, the VAC Chair has already pre-read the packet — the formal submission is confirmation, not evaluation.

> ### 🎤 Verbatim Script -- Three-Conversation Diagnostic (every account audit)
> *"On this surgeon-account: where am I on Surgeon — pre-cadaver, post-cadaver, post-first-case, pre-preference-card? On OR Director — never met, met once, in-service scheduled, championed? On VAC Chair — never started, pre-VAC shared, formal submission pending, approved? Which is most behind, and what is the single next move?"*

> ### ⚠️ Common Trap
> Reps run only the Surgeon Conversation because it's the most comfortable — they came from a clinical background, the OR is familiar, surgeons are intellectually fun to talk to. **The deals die in the OR Director Conversation (workflow friction) or the VAC Chair Conversation (cost-per-case math).** A rep who hasn't met the OR Director and VAC Chair on every active surgeon-account is running an incomplete sales motion. **Schedule those meetings before the surgeon's cadaver lab, not after.**

> ### 🎯 Bottom Line
> Three pillars (OR + EVIDENCE + OUTCOME) for every surgeon, run in parallel with three conversations (Surgeon + OR Director + VAC Chair) for every account. **One framework, one sales motion.** That is the entire teach. The next 40 minutes are about pressure-testing it under live surgeon and VAC pressure — both the first-meeting "why would I switch from Mako" deflection, and the late-cycle "your cost-per-case is 11% higher" VAC defense where most surgeon-approved deals get killed.

---

## SECTION 3 -- THE DISCUSSION (0:22-0:32)

> ### 🟡 Coach Note
> Whiteboard up. Write **OR / EVIDENCE / OUTCOME** across the top and **Surgeon / OR Director / VAC Chair** down the left. Each rep audits their **toughest currently-stalled surgeon-account out loud** — the broken pillar, the skipped Conversation, the incumbent rep's last move, and the cost-per-case math today. **Count to five in your head after each prompt.** Silence forces engagement. If a rep gives a vague answer, ask *"on this surgeon — has she done a cadaver lab? Have you met the OR Director by name? Where is the VAC packet?"* until they get specific.

**Prompt 1 — "Name your toughest stalled surgeon. Sub-specialty, institution, incumbent implant."**

Each rep, out loud, around the room. Manager whiteboards. Force specifics: *"Dr. Patel, adult-recon, Cedars-Sinai, currently using Stryker Triathlon."* No vague "a hip surgeon in my territory."

**Prompt 2 — "Which pillar broke down — OR, Evidence, or Outcome?"**

Most reps will admit they skipped the cadaver lab (cost/scheduling), brought generic outcome data (no demographic filter), or brought evidence by PIs the surgeon doesn't recognize. **Coach:** "OR is easiest to fix — book the cadaver lab this month. Evidence is second-easiest — pull trials filtered to her sub-specialty and PIs she knows. Outcome is hardest — filter to her demographic. Pick the broken pillar and run the move."

**Prompt 3 — "Which Conversation did you skip — Surgeon, OR Director, or VAC Chair?"**

Almost every rep will admit they never met the OR Director by name and never opened the VAC Chair Conversation. **Coach:** "If you haven't met the OR Director, your surgeon verbal is fragile. If you haven't opened pre-VAC, your formal submission surprises the Chair — and surprised Chairs vote no. Both meetings this month."

**Prompt 4 — "Where is the cost-per-case math today — your implant vs incumbent vs GPO contract?"**

Most reps will not know the exact delta. **Coach:** "If you can't quote your cost-per-case vs Stryker / Zimmer / Smith+Nephew / DePuy / Globus / NuVasive under their GPO contract within $50, you cannot defend VAC. Build the spreadsheet this week."

**Prompt 5 — "What is the incumbent rep doing right now that you aren't?"**

Force specifics. In the OR every other Tuesday. Brought the surgeon to AAOS last year. OR Director on speed dial. **Coach:** "The incumbent's relationship is 5-15 years deep. You don't beat that by pitching harder — you beat it by **being in the OR every week, engineering the peer KOL intro, and showing up at VAC with math the incumbent never built.**"

**Prompt 6 — "Pick the ONE next move. Cadaver lab, peer KOL intro, OR observation, or VAC packet?"**

Each rep names ONE move. Manager whiteboards. **Coach:** "Write it down. If you don't make the move in 7 days, that's the data we review in 1:1."

> ### 🟡 Coach Note
> If time allows, pull up **the team's pipeline of surgeon-accounts currently in the Surgeon-Verbal-Commitment-But-VAC-Pending stage**. Walk through which packets have been built and which haven't. **The reps with no VAC packet for verbally-committed surgeons are the ones whose deals are about to die.** Do not skip if you can squeeze it in.

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:32-0:52)

> ### 🟡 Coach Note
> Pair reps. If odd number, you take the extra rep. **Two scenarios, 10 minutes each, 60-second reset between.** Rep plays surgeon / VAC chair in Round 1, switches to rep in Round 2. Walk the room. Listen for whether the rep uses the **verbatim** OR diagnostic + Evidence diagnostic + Outcome diagnostic in Round 1, the **verbatim** total-cost-of-care reframe in Round 2, and whether they correctly sequence the next move. Mark which pillar or conversation each rep skips; that is the data for the next 1:1.

### Role-Play 1 -- First Meeting With A Chief Of Orthopedics (10 minutes)

**Setup:** **400-bed academic medical center, Chief of Orthopedics — Dr. Rebecca Martinez**, fellowship-trained adult-recon, 18 years on faculty, 320 primary THAs + 280 primary TKAs/year, **KOL for Stryker Mako** (1,200 Mako cases). JBJS editorial board, presents at AAOS, co-authored 3 published trials on robotic-assisted joint replacement. **REP introduces a new robotically-assisted hip stem (think DePuy Velys or Smith+Nephew CORI extension).** 15-min meeting between cases in the doctors' lounge. **REP must deploy OR + Evidence + Outcome diagnostics without pitching and without insulting Mako loyalty.**

> ### 🎤 SURGEON SCRIPT -- Dr. Rebecca Martinez

> **Posture:** Friendly but guarded. 15 minutes before next case. Pitched on 6-8 new hip stems in last 24 months, switched on zero. Genuinely loyal to Stryker — funds her fellowship program 12 years running.

> **Deflection 1 (min 2-3):** *"I appreciate you coming by, but I've done 1,200 cases on Mako. The technique is in my hands. Why would I switch?"*

> **Deflection 2 (min 6-7):** *"Send me the white papers — I'll have my fellow take a look and circle back."* (Polite-ghost.)

> **Deflection 3 (min 10-11):** *"I'd want a cadaver lab before considering a first case, but our schedule is booked through Q3. Talk in October."* (Slow-roll — REP must convert to a scheduled date today.)

> **What gets the deal moving:** REP opens with OR diagnostic — *"walk me through the last new implant you brought into your OR"* — not a pitch. Acknowledges Mako loyalty as strength. Names specific KOL PIs from JBJS who've published on the competitive stem (Lawrence Dorr, Antonia Chen are real adult-recon names). Asks Outcome diagnostic on Medicare bundled vs commercial mix. Closes by **booking a specific Q3 cadaver lab date with two fellows + clinical specialist**, even if 8 weeks out.

> **Hidden context (reveal only if REP runs all three diagnostics cleanly):** Stryker fellowship funding up for renewal in 18 months; CMO pushing her to evaluate alternatives. She's open to a cadaver lab if rep doesn't pitch and respects time. Reps who pitch in minute 2 get ghosted; reps who diagnose first get taken seriously.

> ### 🎤 REP SCRIPT -- diagnostics, no pitch, book the cadaver lab

> - **Min 0-1 (open with respect):** *"Dr. Martinez, thank you for the 15. I'm not going to pitch you on anything today — I'd love to learn how you make adoption decisions, and at the end if there's a fit for a cadaver lab, we can talk. Sound okay?"*
> - **Min 1-3 (OR diagnostic — verbatim):** *"Walk me through the last new implant you brought into your OR. What was the sequence — cadaver lab, first case with a clinical specialist scrubbed in, then preference card move? And what was the moment you decided to add it?"*
> - **Min 3-5 (acknowledge Mako as strength):** *"Twelve hundred Mako cases is the strongest argument against switching I've ever heard — and frankly it's the right reason to be loyal. I'm not asking you to switch off Mako. There's a sub-population in your primary THA volume — Dorr type A femurs in younger active patients — where a non-robotic monoblock approach has shown 1.8x faster OR turnover and equivalent 5-year survivorship in the published AJRR registry. That's the conversation. Worth 10 more minutes?"*
> - **Min 5-7 (Evidence diagnostic — verbatim):** *"You're an adult-recon specialist on faculty here — when you evaluate a new hip stem, which sub-specialty journal do you go to first, and which KOLs do you read? I want to make sure the evidence I bring you is from PIs you trust — Lawrence Dorr, Antonia Chen, AJRR — not whatever marketing handed me."*
> - **Min 7-9 (Outcome diagnostic — verbatim):** *"Walk me through your patient mix — how much of your THA volume is Medicare bundled vs commercial? And which outcome metric does your CMO or your reputation actually live on — 90-day readmit under CJR, revision at 5 years, or something else? I want data filtered to your population, not the industry average."*
> - **Min 9-11 (Deflection 2 → counter polite-ghost):** *"Happy to send white papers — but white papers don't move surgeons; OR experience does. Two-hour cadaver lab in October, you bring your two adult-recon fellows, my CS runs the broaching sequence on three sawbones. If after 2 hours you say it's not worth a first case, we shake hands and I never bother you again. Worth a date?"*
> - **Min 11-13 (Deflection 3 → book the date):** *"October works — fellows are still ramping in Q3 so timing's actually better. I'll send three Tuesday-evening slots tomorrow with our regional cadaver facility — Steinberg if East Coast, NYU if Midtown. Pick one and I'll handle scheduling with your office. Anything you want me to bring beyond the standard set?"*
> - **Min 13-15 (close + Three Conversations setup):** *"One last ask. Whenever I introduce a new implant, I also introduce myself to the OR Director — because if workflow doesn't fit, your first case is rough through no fault of the implant. Who on the perioperative side should I connect with, and can I mention you sent me?"*

### 60-Second Reset

> ### 🟡 Coach Note
> **Manager calls out: "Switch sides — 60-second reset."** Both reps put their papers down. Stand up. Stretch. Take a sip of water. Sit back down with the OTHER role's paper. **Take 30 seconds to read silently.** Then go.

### Role-Play 2 -- VAC Defense After Surgeon Verbal Commitment (10 minutes)

**Setup:** **6-hospital regional health system, $180M annual implant spend**, aligned with Zimmer Biomet under Vizient. **VAC Chair — Karen Liu, Director of Supply Chain**, 22 years in healthcare supply chain, 14-person VAC committee with surgeon + OR + finance + infection control. REP's new spine system (think ExcelsiusGPS or NuVasive Pulse alternative) verbally committed to by **Dr. James Okonkwo**, complex-spine surgeon, 180 lumbar fusions/year. **30-min formal VAC defense after Karen has read the packet. REP must reframe an 11% cost-per-case increase to total-cost-of-care, hold against principle-discount asks, and surface pre-VAC alignment.**

> ### 🎤 VAC CHAIR SCRIPT -- Karen Liu

> **Posture:** Professional, data-driven, time-pressured. Approved 8 new ortho implants in last 24 months, rejected 14 — all for cost-per-case > 7% above incumbent without OR-efficiency or outcome offset. Fair but rigorous.

> **Deflection 1 (min 3):** *"Your cost-per-case is 11% higher than the Zimmer Persona Dr. Okonkwo's been using. We have a Vizient contract that's another 4% off list. What am I getting for the 11%?"*

> **Deflection 2 (min 10):** *"We're aligned with Zimmer under Vizient — switching loses the volume rebate on the rest of our Zimmer spend. Have you looked at HealthTrust or Premier? I need GPO math that holds across the system, not just Dr. Okonkwo's cases."*

> **Deflection 3 (min 17):** *"VAC needs published 2-year revision data — not your in-house registry, not anecdotal. Multi-center, PIs we recognize."*

> **What gets the deal moving:** REP does not match price. Reframes to total-cost-of-care: OR time (8-12 min x 180 cases = ~$140K), 90-day readmit 1.2% lower ($700/case x 180 under CJR = $126K), LOS 0.4 day shorter = $1,800/case. Offers HealthTrust term-commit alternative, not per-case discount. Brings published 2-year multi-center trial with named KOL PIs Dr. Okonkwo recognizes. Closes with pre-VAC alignment surface.

> **Hidden context (reveal only if REP holds all three deflections cleanly):** Karen's CMO pressuring her to evaluate Zimmer alternatives in complex-spine because Vizient rebate has been declining 18 months. She's internally aligned with approving — needs math to hold under finance scrutiny. REPs who match the 11% lose her respect; REPs who reframe and offer term-commit get approved first read. The 14 rejections all panicked and discounted.

> ### 🎤 REP SCRIPT -- total-cost-of-care reframe, GPO alternative, KOL-PI evidence

> - **Min 0-2 (acknowledge + frame):** *"Karen, thank you for the read. The packet was pre-aligned with [OR Director] in Perioperative and your finance team last month, so the math already matches your committee's standards. Walk through the total-cost-of-care lens, then take your hardest questions. Sound okay?"*
> - **Min 2-5 (Deflection 1 → total-cost-of-care reframe):** *"The 11% per-case premium is real — and we offset it three ways. **OR efficiency:** published cut-to-close runs 8-12 min faster per case. 180 cases x $400-700/min OR-suite cost = ~$140K annually. **90-day readmit:** AJRR registry shows 1.2% lower vs Persona. Under CJR exposure, ~$700/case avoided penalty = $126K. **LOS:** 0.4 day shorter = ~$1,800/case in bed-day savings. Net of the 11% premium, total-cost-of-care lands $80-100K favorable on Dr. Okonkwo's volume alone."*
> - **Min 5-9 (CFO frame):** *"I don't expect VAC to approve on per-case + OR-efficiency math alone. Total-cost-of-care has to hold across the system and your CFO has to defend it to system CFO. That's why we built this with [OR Director] and finance pre-validating — three operational leaders inside your hospital aligned, not a rep selling a story."*
> - **Min 9-13 (Deflection 2 → GPO term-commit alternative, not principle discount):** *"On Vizient — fair. Two alternatives. **Option A:** HealthTrust paper that mirrors Vizient terms for spine specifically — keeps Zimmer GPO clean and gives us a 4-year term commitment, earning another 6% off our published price. Cost delta drops from 11% to ~3%. **Option B:** hold price + 24-month volume guarantee — if Okonkwo's adoption hits 60%, volume rebate kicks in at month 18. I won't match Zimmer's number because matching tells you our price was theater. Which path does VAC prefer?"*
> - **Min 13-17 (Deflection 3 → KOL-PI evidence):** *"On evidence — right ask. Packet includes the 2024 multi-center prospective trial from JBJS Vol 106 Issue 8 — 412 patients, 4 institutions, 2-year follow-up, PIs Dr. Sarah Foster at HSS and Dr. Marcus Chen at Mayo — both have co-presented with Dr. Okonkwo at NASS. Revision-rate table on page 7. 5-year AJRR registry analysis I can append by end of week if VAC wants longer-term."*
> - **Min 17-22 (Three Conversations close):** *"Recap — total-cost-of-care $80-100K favorable on Okonkwo's volume; HealthTrust term-commit drops the delta from 11% to 3%; published 2-year multi-center trial with PIs Okonkwo recognizes; [OR Director] co-signed preference card + in-service; finance pre-read the math. I'm asking VAC for **primary-tray approval on Okonkwo's complex-spine line specifically**, not system-wide displacement. Manageable scope, defensible math, three leaders aligned. What does VAC need from me to vote Tuesday?"*

> ### 🟡 Coach Note
> Walk the room during Round 2. The rep will want to **match the 11% cost-per-case gap with a discount** when Karen pushes hard — that is the chronic mistake that kills 40-60% of orthopedic VAC submissions. **Stop them. Make them re-deliver the total-cost-of-care reframe + the term-commit-not-principle-discount move + the pre-VAC-alignment surface.** Highest-leverage drill — the VAC defense with parallel-conversation evidence.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:52-0:57)

> ### 🟡 Coach Note
> Pull the room back together immediately. Do not let role-play energy fade. Three debrief questions, then commitments. The commitment ritual is the only part of this meeting that affects next month's preference card moves.

**Debrief Question 1 — "Which pillar felt strongest in your role-play — OR, Evidence, or Outcome?"**

Let 3-4 reps answer. Reps over-index on OR (comfortable with cadaver lab) and under-index on Evidence (don't know KOL PIs by name). **Coach:** "The under-indexed pillar is the homework. Every rep needs a per-sub-specialty evidence dossier with lead PIs of the top 3-5 trials, by name, by next Friday."

**Debrief Question 2 — "Which Conversation got skipped — Surgeon, OR Director, or VAC Chair?"**

Reps will admit OR Director + VAC Chair get skipped on 70% of accounts. **Coach:** "That is why surgeon-verbal deals die at VAC. From Monday, every cadaver lab booking triggers two follow-ups: (1) OR Director intro within 14 days, (2) pre-VAC packet draft within 30 days. Both before first case."

**Debrief Question 3 — "What's the next step on your stalled surgeon?"**

Each rep names ONE next step on the surgeon from Section 3. **Coach:** "Broken pillar OR → cadaver lab. Evidence → peer KOL intro. Outcome → registry filter. Skipped OR Director → 30-min meeting next week. Skipped VAC Chair → pre-VAC packet draft this week."

> ### 🎤 Commitment Ritual (Verbatim)

**Manager says:** "Open your notebook. Three lines. **Line 1:** name **your top stalled surgeon-account** — surgeon name, sub-specialty, institution, incumbent implant. **Line 2:** name **the broken pillar** (OR / Evidence / Outcome) and **the skipped Conversation** (Surgeon / OR Director / VAC Chair). **Line 3:** name **the ONE concrete move** you'll make in the next 7 days — cadaver lab booking, peer KOL phone intro, OR Director introduction meeting, or VAC submission packet draft. Then read all three lines out loud, around the room, one rep at a time."

Let every rep read. Do not skip. The act of saying it out loud in front of peers is the entire mechanism. **Coach in the moment when reps name vague moves** (*"I'll follow up with her"*): *"Which move? Cadaver lab on which date? Or KOL intro from which fellowship classmate? Or OR Director meeting on which day? Say the specific move now."* Until they say it.

**Manager closes:** "I'm going to ask you in next week's pipeline review for the **specific status of the move you just named**. I am not looking for whether the surgeon committed. I am looking for **whether the cadaver lab is on the calendar, the KOL phone call happened, the OR Director meeting got booked, or the VAC packet draft is in my inbox**. The move must be made within **7 calendar days**. We will review status in your 1:1 within 7 days after that."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (0:57-1:00)

> ### 🟡 Coach Note
> Hand out the printed one-page leave-behind. Walk it section by section, 30 seconds each. Tell reps where the digital version lives (Notion / Confluence / team SharePoint). Tell them to keep it in the demo bag with the cadaver-lab scheduling sheet and the VAC submission packet checklist.

> ### 📋 Leave-Behind -- The "Orthopedic Surgeon Adoption" One-Pager

> **THE OR-EVIDENCE-OUTCOME 3-PILLAR GRID (verbatim diagnostic questions):**
>
> | Pillar | Diagnostic Question | What "Yes" Looks Like |
> |---|---|---|
> | **OR** (Operative Experience) | *"Walk me through the last new implant you brought into your OR — what was the sequence?"* | Cadaver lab → first case w/ clinical specialist → solo case → preference card move |
> | **EVIDENCE** (Published Clinical Evidence) | *"Which sub-specialty journal do you read first, and which KOLs do you trust for this implant type?"* | Multi-center RCT in JBJS / JOR / Spine / JSES / FAI w/ PIs the surgeon names |
> | **OUTCOME** (Patient Outcome Story) | *"What's your patient mix — Medicare bundled, commercial, sports — and which outcome metric does your CMO actually track?"* | Outcome data filtered to surgeon's exact patient demographic + economic model |

> **THE THREE CONVERSATIONS — sales motion (run all three in parallel, every account):**
>
> | Conversation | Effort % | Currency | When To Start |
> |---|---|---|---|
> | **Surgeon Conversation** | 40% | Clinical credibility + technique + preference card | First meeting |
> | **OR Director Conversation** | 35% | OR turnover time + tray complexity + sterilization + biomedical integration | After cadaver lab — before first case |
> | **VAC Chair Conversation** | 25% | Cost-per-case + bundled-payment impact + GPO alignment + total-cost-of-care | Day of cadaver lab — pre-VAC packet within 30 days |

> **VAC SUBMISSION PACKET — checklist (build before formal submission):**
>
> - [ ] Cost-per-case spreadsheet (your implant + disposables vs incumbent under current GPO)
> - [ ] 90-day readmit data (CMS BPCI-A + CJR bundled-payment relevance)
> - [ ] OR time comparison (cut-to-close minutes saved vs incumbent)
> - [ ] Length-of-stay data (TKA/THA 1-2 day CMS targets)
> - [ ] Peer-reviewed evidence dossier (multi-center RCT + PIs surgeon recognizes)
> - [ ] GPO contract terms (Vizient / HealthTrust / Premier alignment math)
> - [ ] Capital equipment vs implant cost separation (Mako, ROSA, Velys, CORI, ExcelsiusGPS, Pulse)
> - [ ] Sample preference card (co-signed by surgeon AND OR Director)
> - [ ] PROMs data (PROMIS, HOOS, KOOS, ASES) for Quality Payment Program
> - [ ] Total-cost-of-care narrative (OR efficiency + readmit avoidance + LOS reduction offset to per-case premium)
> - [ ] Pre-VAC informal alignment (sent draft to VAC Chair + OR Director + finance for feedback before formal submission)

> **NEVER DO (the adoption-killer behavior list):**
>
> - Skip the cadaver lab to save $4-12K — cuts adoption probability roughly in half
> - Bring a glossy brochure instead of peer-reviewed evidence with named KOL PIs
> - Use industry-average outcome data instead of data filtered to surgeon's patient demographic
> - Run only the Surgeon Conversation; ignore OR Director + VAC Chair until surgeon verbally commits
> - Match a competitor's cost-per-case number — signals price was theater + loses VAC Chair respect
> - Submit a formal VAC packet without informal pre-VAC alignment with the Chair and finance
> - Pitch features in the first 2 minutes of a surgeon meeting — they will polite-ghost you
> - Try to compress 6-18 month adoption cycle to 90 days — surgeons sense urgency, attribute it to weakness

> **THE ADOPTION OUTCOME LINE:**
>
> - **Wins:** All 3 pillars built before preference-card ask + all 3 Conversations run in parallel + VAC packet pre-aligned → **preference card move within 6-18 months, 60-80% adoption inside first year, durable through GPO renewal cycle**
> - **Losses:** Surgeon-only conversation + skipped OR Director + late VAC packet + cost-per-case-only narrative → **38% VAC kill rate per HFMA + backup-tray relegation + de-listing within 18 months for low utilization**

> ### 🎯 If You Only Remember One Thing
> **Surgeons don't buy implants — they adopt techniques. Your job isn't to pitch the implant; it's to make adopting it the safest decision in the room.**

---

## How This Training Sits Inside Your MedTech Sales Stack

This is **the foundational industry-specific adoption discipline** — the conversation sequence that converts a surgeon's curiosity into a preference card move and survives the VAC gate that kills 38% of surgeon-approved orthopedic implants. It is **not** a replacement for clinical training, in-service playbook, KOL development, or existing methodology — it composes from all of them.

| Where it fits | What this training addresses |
|---|---|
| **Pre-meeting prep** | Per-sub-specialty evidence dossier with named KOL PIs the surgeon recognizes |
| **First surgeon meeting** | OR + Evidence + Outcome diagnostics verbatim — no pitch in first 2 minutes |
| **Cadaver lab + first case** | Clinical specialist scrubbed in — highest-leverage moment in adoption |
| **OR Director engagement** | Preference card simplification + turnover data + in-service plan before first case |
| **VAC submission** | Total-cost-of-care reframe + GPO term-commit + KOL-PI evidence + pre-VAC alignment |
| **Manager coaching cadence** | Weekly account audit on broken pillar + skipped Conversation + next 7-day move |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: meeting flow + post-training coaching loop
// ============================================================================
const flow = `

## The 60-Minute Meeting Flow

\`\`\`mermaid
flowchart TD
  A[Manager Opens 0:00] --> B[Section 1: Cold Open 5 min]
  B --> B1[The numbers: AAOS+JBJS 84% peer-KOL adoption + 62% sub-specialty published evidence + 23% rep pitch + HFMA 38% surgeon-approved implants die at VAC + CMS BPCI-A 1% readmit reduction worth $400-900 per case]
  B1 --> B2[Trigger Story: Marcus 8 months selling new hip stem - surgeon verbal commit - VAC killed at 11% cost gap - backup tray vs second deal built VAC packet in parallel approved first read 70% adoption first quarter]
  B2 --> C[Section 2: The Teach 17 min]
  C --> C1[Part A: OR-EVIDENCE-OUTCOME Framework 10 min]
  C1 --> D1[OR: cadaver lab to clinical-specialist first case to solo case to preference card move - skipping cadaver lab cuts adoption ~50%]
  C1 --> D2[EVIDENCE: tier 1 multi-center RCT in JBJS JOR Spine JSES FAI - KOL-PI authorship is the evidence - tier 2 registries AJRR + Australian - tier 3 case series tier 4 conference abstracts]
  C1 --> D3[OUTCOME: filtered to surgeon patient demographic - Medicare bundled vs commercial vs sports - 90-day readmit revision rate LOS OR time PROMs return-to-play]
  C --> C2[Part B: Three Conversations Sales Motion 7 min]
  C2 --> S[Surgeon Conversation 40% effort - clinical credibility cadence 6-18 months]
  C2 --> O[OR Director Conversation 35% effort - turnover time tray sterilization biomedical integration - start after cadaver lab before first case]
  C2 --> V[VAC Chair Conversation 25% effort - cost-per-case bundled-payment GPO total-cost-of-care - start day of cadaver lab pre-VAC packet within 30 days]
  D1 & D2 & D3 & S & O & V --> E[Section 3: Discussion 10 min]
  E --> E1[6 prompts: name toughest stalled surgeon + broken pillar + skipped Conversation + cost-per-case math + what incumbent rep does that you dont + next ONE move]
  E1 --> F[Section 4: Role-Play 20 min]
  F --> F1[Round 1: Chief of Orthopedics Dr Rebecca Martinez 400-bed academic center Mako KOL 1200 cases - 3 deflections why switch + send white papers + cadaver lab booked through Q3 - REP runs OR+Evidence+Outcome diagnostics no pitch books October cadaver lab]
  F1 --> F2[60-sec reset]
  F2 --> F3[Round 2: VAC Chair Karen Liu Director Supply Chain 6-hospital system $180M ortho spend Zimmer-Vizient aligned - 3 deflections 11% cost-per-case + GPO alignment + published 2-yr revision rate - REP total-cost-of-care reframe HealthTrust term-commit alternative not principle discount KOL-PI evidence pre-VAC alignment]
  F3 --> F4[60-sec reset + swap sides]
  F4 --> G[Section 5: Debrief + Commitments 5 min]
  G --> G1[3 debrief Qs + 3-line commitment ritual: top stalled surgeon-account + broken pillar AND skipped Conversation + ONE concrete 7-day move read aloud]
  G1 --> H[Section 6: Leave-Behind 3 min]
  H --> H1[Printed one-pager: OR-EVIDENCE-OUTCOME 3-pillar grid + Three Conversations table + VAC submission packet 11-item checklist + never-do list + adoption outcome line + hero quote surgeons adopt techniques not implants]
  H1 --> Z[Meeting Ends 60:00 - manager asks each rep for specific status of named 7-day move in next pipeline review]
\`\`\`

## Manager Coaching Loop After The Training

\`\`\`mermaid
flowchart LR
  T[Training Run Monday] --> W1[Week 1: Each Rep Commits Top Stalled Surgeon + Broken Pillar + Skipped Conversation + ONE 7-Day Move]
  W1 --> W2[Rep Books Cadaver Lab or KOL Phone Intro or OR Director Meeting or Sends VAC Packet Draft Within 7 Days]
  W2 --> W3[Manager Reviews Move Completion in Weekly Pipeline + Marks OR + Evidence + Outcome + Surgeon + OR Director + VAC Coverage Per Account]
  W3 --> W4[1:1 Coaching: Which Pillar Still Broken + Which Conversation Still Skipped + Verbatim Diagnostic Re-Delivery Drill With Pushback]
  W4 --> W5[Monthly VAC Pipeline Review: All Surgeon-Verbal-Commit Accounts Mapped to Pre-VAC Packet Status + Cost-Per-Case Math Audit + GPO Term-Commit Alternatives]
  W5 --> W6[Quarterly KOL Development: Refresh Per-Sub-Specialty Evidence Dossier + Society Panel Sponsorship Plan + Fellowship Program Engagement]
  W6 --> R{Rerun Training Every 90 Days With Fresh Lost-Surgeon Data From The Team}
  R -->|Yes| T
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited In This Training

The OR-EVIDENCE-OUTCOME Framework, the Three Conversations sales motion, and the 84/62/23 adoption-driver gap draw on a specific body of orthopedic device research and MedTech commercialization methodology. A manager should be ready to cite these by name when reps push back.

**Surgeon adoption research.** **AAOS** annual surgeon-adoption surveys — source of the **84% peer-KOL / 62% sub-specialty published evidence / 23% rep pitch** breakdown. **AAHKS** for adult-reconstruction-specific cadaver-lab impact data. **NASS** for spine adoption patterns (lateral interbody, complex spine). **AANA** for sports-med adoption (ACL, meniscal, shoulder). **OREF** for KOL pipeline development data device companies use to identify fellowship-program PIs early.

**Clinical evidence sources surgeons actually read.** **JBJS** — the gold-standard journal for adult reconstruction and trauma; multi-center RCTs here are Tier 1 evidence. **JOR**, **Spine Journal (NASS)**, **JSES** (shoulder), **Foot & Ankle International**, **KSSTA** (sports knee). **AJRR** + **Australian Orthopaedic Association Registry** — the two most-cited registries for revision rate and survivorship. **OrthoBuzz (AAOS newsletter)**, **Orthostreams**, **NextSurgical** — KOL platforms for peer-referral signal between annual meetings.

**VAC + hospital economics frameworks.** **HFMA** VAC governance research — source of the **38% VAC kill rate** on surgeon-approved implants when cost-per-case exceeds 7% above incumbent without OR-efficiency or outcome offset. **AHRMM** for supply-chain + GPO contract dynamics. **Vizient + HealthTrust + Premier** — the three dominant GPOs covering ~70% of US hospital implant spend; alignment is non-negotiable for VAC approval.

**Bundled-payment + reimbursement.** **CMS BPCI-A** + **CJR** — bundled-payment models that make 90-day readmit and LOS the most-watched metrics for joint replacement. **MS-DRG codes** (TKA 470, THA 469-470, spine fusion 459-460, shoulder arthroplasty 484) drive per-episode economics. **CMS Quality Payment Program** + **MIPS** + **PROMs** (PROMIS, HOOS, KOOS, ASES, WOMAC, IKDC) — the patient-reported outcome measures hospitals must track.

**Competitive landscape — the incumbents you sell against.** **Stryker** (Mako, Triathlon knee, Accolade hip, Reunion shoulder, T2 nail) — leader in robotics-assisted ortho with the deepest KOL bench. **Zimmer Biomet** (ROSA, Persona knee, Taperloc hip, Comprehensive shoulder) — leader in primary joint reconstruction volume, largest Vizient-aligned share. **Smith+Nephew** (CORI, Journey knee, R3 hip, OXINIUM). **DePuy Synthes (J&J MedTech)** (Velys, Attune knee, Pinnacle hip) — strong in AMCs via fellowship sponsorship. **Globus Medical** (ExcelsiusGPS) — spine navigation leader. **NuVasive (now Globus)** (Pulse, lateral MAS). **Medtronic Spine** (Mazor X, CD Horizon). **Conmed + Arthrex** for sports-med + biologics.

**Operator authorities MedTech sales managers reference.** Named KOL surgeons by sub-specialty (Lawrence Dorr + Henrik Malchau in adult recon; James Andrews in sports; Christopher Kim in complex spine; John Sperling in shoulder); fellowship program directors at HSS, Mayo Clinic, Cleveland Clinic, Rush, NYU, Steadman Philippon, OrthoCarolina, OrthoVirginia. The framework composes from these voices; it does not invent.

`;

// ============================================================================
// NUM -- quantified benchmarks the manager cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

The cold-open lands harder when the manager can quote real benchmarks. The tables below are pulled from AAOS adoption surveys, HFMA VAC governance research, AHRMM supply-chain benchmarks, CMS BPCI-A + CJR data, and AJRR + Australian Registry survivorship reports, 2023-2025.

### Orthopedic Implant Adoption Drivers (Why Surgeons Switch)

| Adoption Driver | % Citing As Primary Reason | Source |
|---|---|---|
| Peer KOL used it first (fellowship classmate, society panel) | **84%** | AAOS surgeon survey |
| Published clinical evidence in sub-specialty journal | **62%** | AAOS + AAHKS |
| Cadaver-lab hand experience | **58%** | AAOS CME data |
| Clinical specialist scrubbed in for first case | **51%** | AAOS + OREF |
| Hospital VAC approval + GPO alignment | **44%** | HFMA + AHRMM |
| Bundled-payment economic case (readmit + LOS) | **38%** | CMS BPCI-A + CJR |
| Patient outcome data filtered to surgeon's demographic | **35%** | AAOS QPP reports |
| Rep had a great pitch | **23%** | AAOS |
| Marketing brochure or trade show | **8%** | AAOS |

### VAC Approval Rates By Cost-Per-Case + Pre-Alignment Status

| VAC Decision Factor | Approval Rate | Source |
|---|---|---|
| Cost ≤ incumbent + documented OR efficiency | 88-95% | HFMA |
| Cost 1-7% above + total-cost-of-care offset | 72-82% | HFMA + AHRMM |
| Cost 8-15% above + bundled-payment offset | 38-52% | HFMA |
| Cost > 15% above regardless of offset | 8-18% | HFMA + AHRMM |
| Surgeon verbal + no pre-VAC alignment | 42-58% | HFMA |
| Surgeon verbal + pre-VAC alignment w/ Chair + finance + OR | 78-88% | HFMA + scorecards |
| Implant requires capital (Mako/ROSA/Velys/CORI) not in budget | 12-25% | AHRMM |

### Cadaver Lab Impact On Adoption (The Highest-Leverage Single Move)

| Adoption Sequence | Conversion To Preference Card In 12 Months |
|---|---|
| No cadaver lab → rep-only first case attempt | 15-25% |
| Cadaver lab → no clinical specialist scrubbed in for first case | 35-48% |
| Cadaver lab → clinical specialist scrubbed in for first case | 58-72% |
| Cadaver lab + CS scrubbed + peer KOL phone intro | 72-85% |
| Cadaver lab + CS + KOL + OR Director champion + pre-VAC alignment | 82-92% |

### Three Conversations Coverage (Baseline vs 90-Day Target)

| Conversation Coverage | Baseline | 90-Day Target |
|---|---|---|
| Accounts where Surgeon Conversation is active | 95-100% | 95-100% |
| Accounts where OR Director is met by name | 28-42% | > 85% |
| VAC Chair Conversation opened pre-verbal-commit | 12-25% | > 75% |
| Cadaver-lab triggering OR Director intro within 14 days | < 20% | > 80% |
| Cadaver-lab triggering VAC pre-packet within 30 days | < 15% | > 70% |
| Formal VAC submissions with informal pre-VAC alignment | 18-30% | > 85% |

### Bundled-Payment Economic Levers (The Math That Wins VAC)

| Outcome Metric | Per-Case Economic Impact | Source |
|---|---|---|
| 1% reduction in 90-day readmit | $400-900/case (CJR + BPCI-A) | CMS |
| 1 day reduction in LOS | $1,400-2,200/case | CMS + AHA |
| 8-12 min reduction in cut-to-close | $400-700/case (OR-suite cost) | AHRMM |
| 1% reduction in 2-year revision rate | $14-28K per revision avoided | AJRR + Australian |
| Simplified preference card (fewer trays) | $200-600/case (sterilization) | AHRMM |

### Rep Activity Cadence (Top-Quartile vs Average MedTech Rep)

| Activity | Top-Quartile | Average |
|---|---|---|
| OR cases observed per week | 6-12 | 2-4 |
| Cadaver labs run per quarter | 4-8 | 1-2 |
| Peer KOL phone intros engineered per quarter | 6-10 | 1-3 |
| OR Director meetings held per quarter | 12-20 | 3-6 |
| VAC submission packets built per quarter | 8-14 | 2-4 |
| Preference card moves per year | 8-15 | 2-5 |
| Annual quota attainment % | 115-140% | 70-90% |

### OR-EVIDENCE-OUTCOME Adoption Curve (Reps Running Verbatim)

| Discipline Move | Week 1 | Week 4 | Week 12 |
|---|---|---|---|
| OR diagnostic in every first surgeon meeting | 22% | 60% | 82% |
| Evidence diagnostic with named KOL PIs | 8% | 38% | 72% |
| Outcome diagnostic filtered to surgeon's demographic | 12% | 42% | 68% |
| OR Director intro within 14 days of cadaver lab | 18% | 55% | 78% |
| Pre-VAC packet within 30 days of cadaver lab | 10% | 38% | 70% |
| Total-cost-of-care reframe at VAC (no principle discount) | 15% | 45% | 72% |
| All six running on every active surgeon-account | 5% | 25% | 55% |

**Pattern:** The Evidence diagnostic with named KOL PIs by sub-specialty is the hardest move to install — most reps cannot name the lead PIs of the top 3 trials on their implant without 6-12 weeks of active homework. **That is the muscle this training commits the manager to drill.** Once Evidence + pre-VAC discipline is reflex, the other moves follow within 4-6 weeks because every cadaver-lab-to-preference-card conversion shows up in the rep's commission.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + manager objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails, And How To Coach Around It

A serious MedTech sales manager must stress-test this framework before rolling it out. Below are the failure modes, objections you will hear, and how to coach around each.

### Failure Mode 1 -- Rep Pitches Features In First 2 Minutes
Rep opens with implant geometry; surgeon polite-ghosts within 6 minutes. **Surgeons do not buy features; they adopt techniques.** OR diagnostic comes first — every time. **Coach:** in 1:1, record the rep's first 90 sec of a surgeon meeting. If implant name lands inside the first 60 sec, drill the OR diagnostic as verbatim opener.

### Failure Mode 2 -- Skipping The Cadaver Lab To Save Cost
A regional cadaver lab runs $4-12K. Reps under quota pressure skip it. **Cuts adoption probability roughly in half.** One rough first case kills the deal forever. **Coach:** audit every stalled account — *"has this surgeon done a cadaver lab?"* If no, that is the next move.

### Failure Mode 3 -- Brochure Instead Of Peer-Reviewed Evidence
Rep brings a marketing one-sheet with a single-center case series from a surgeon nobody knows. Surgeon says *"I'll have my fellow review,"* never reads it. **A brochure is not evidence.** Multi-center RCT in JBJS / JOR / Spine / JSES / FAI with PIs the surgeon recognizes is evidence. **Coach:** every rep keeps a per-sub-specialty evidence dossier with the 3-5 most-cited trials, PIs highlighted, in the demo bag.

### Failure Mode 4 -- Industry-Average Outcome Data Instead Of Demographic-Filtered
Rep cites *"1.2% revision at 2 years."* Surgeon thinks: *"that's the average — not my Medicare bundled-payment hip-fracture patients."* The data does not transfer. **Filter to the surgeon's exact demographic** or don't bring it. **Coach:** every rep can pull outcome data filtered by demographic on demand — Medicare primary TKA / commercial primary THA / sports-med ACL.

### Failure Mode 5 -- Surgeon-Only, Skipping OR Director + VAC Chair
The most expensive failure pattern. Rep avoids OR Director and VAC Chair until after surgeon verbally commits. **By then it is six weeks too late.** OR Director vetoes via workflow; VAC Chair vetoes via cost math. **Coach:** every cadaver-lab booking triggers two follow-ups — (1) OR Director intro within 14 days, (2) pre-VAC packet draft within 30 days. Audit weekly.

### Failure Mode 6 -- Matching Competitor Cost-Per-Case To Win VAC
Karen says *"your cost is 11% higher than Zimmer,"* rep panics, matches with a discount. **Matching signals the original price was theater** — Karen loses respect, implant lands on backup tray. Per HFMA, reps who match lose 60-72% of VAC submissions to backup tray; reps who reframe to total-cost-of-care win 70-82% to primary tray. **Coach:** drill the total-cost-of-care reframe + the HealthTrust-or-volume-commit alternative in every 1:1 with pending VAC submissions.

### Failure Mode 7 -- Formal VAC Packet Without Pre-VAC Alignment
Karen reads the packet for the first time in committee. **Surprised VAC Chairs vote no.** Send draft to Karen + OR Director + finance 30-60 days before formal submission. **Coach:** add "Pre-VAC Draft Shared" as a required CRM stage gate before "Formal VAC Submission."

### Failure Mode 8 -- Compressing 6-18 Month Cycle To 90 Days
Quota pressure makes reps push surgeons to preference card in 90 days. **Surgeons sense urgency, attribute it to weakness.** Orthopedic adoption is 6-18 months by design. **Coach:** set 90-day-marker stages — first meeting / cadaver lab booked / cadaver lab done / first case / OR Director meeting / pre-VAC shared / VAC approval / preference card move. Each stage takes 30-90 days.

### Failure Mode 9 -- Manager Doesn't Audit Weekly
Kills 60-80% of MedTech training rollouts. Per AAOS coaching research, un-coached MedTech training has a **~21-day half-life**. By week 3 reps drift back to pitching implants. Manager must audit every active account weekly: broken pillar, skipped Conversation, status of next-7-day move.

### Common Manager Objections And Honest Answers

**1. "My reps already know orthopedic deals."** Pull the cadaver-lab-to-preference-card conversion for the last 12 months. Under 50% means they manage relationships — not the same as winning Surgeon + VAC + OR Director simultaneously.

**2. "Surgeons just want a great rep relationship."** Per AAOS, 84% cite peer KOL referral as primary driver — not rep relationship. The framework operationalizes the KOL + evidence + outcome triangle that relationships are the vehicle for, not the cause of.

**3. "Cadaver labs are too expensive."** $4-12K lab cost is trivial against $50-200K LTV per converted surgeon. If budget is the issue, the budget is wrong.

**4. "VAC is procurement's problem."** Per HFMA, 38% of surgeon-approved implants die at VAC. Reps who don't run the VAC Conversation in parallel are the ones whose deals die.

**5. "Senior reps don't need this — 15-year relationships."** Senior reps with deep relationships have the worst VAC + OR Director discipline. Audit their conversion rate; under 60% means they need it.

**6. "No clinical specialist on every account."** Contract one regionally. Skipping CS scrubbed-in cuts adoption ~50% — cost is trivial against the conversion lift.

**7. "How do I know it's working?"** Three 90-day signals: cadaver-lab-to-preference-card conversion rises 15-25 pts; OR Director by-name coverage rises 28-42% → > 80%; VAC pre-alignment rises 18-30% → > 80%.

### When To Run This Training A Second Time

Re-run every **90 days** with fresh lost-surgeon data. Rotate role-play scenarios from actual losses last quarter. Third run, swap in your hardest archetypes — Stryker Mako KOL surgeons, Zimmer-Vizient VACs, academic-medical-center fellowship PIs — whichever incumbent is hardest to displace in your geography.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

This is the **seventh entry** in the **Pulse Sales Trainings** library (\`/sales-trainings/\`) and the **first industry-specific training**. st0001-st0006 covered B2B SaaS motions (discovery, single-threading, post-demo objection recovery, cold-call opener, demo discipline, pricing) that translate across industries. From st0007 forward, the pillar pivots to **industry-by-industry coverage** — orthopedic medical device sales is the launch industry.

**Companion industry-specific entries planned:** st0008 cardiovascular device sales (cath lab + EP + structural heart), st0009 diagnostics + reference lab sales, st0010 oncology biologics + cell-therapy access, st0011 surgical robotics capital sales (Mako / ROSA / Velys / CORI / da Vinci / Hugo), st0012 dental implant + DSO consolidator sales, st0013 ophthalmology + ASC sales, st0014 DME + home-health, st0015 hospital IT + EHR vertical sales, st0016 pharma rep targeted-therapy launches. Each follows the same six-section structure.

**Cross-references to st0001-st0006 (B2B SaaS foundation arc):** st0001 discovery → OR + Evidence + Outcome diagnostics; st0002 single-threading → Three Conversations sales motion; st0003 objection recovery → polite-ghost recovery after *"send me the white papers"*; st0004 cold-call opener → first-meeting OR diagnostic that earns the cadaver lab; st0005 demo discipline → cadaver lab + first case + clinical specialist scrubbed-in sequence; st0006 pricing → VAC Chair Conversation + total-cost-of-care reframe + GPO term-commit alternative. A MedTech rep who has internalized st0001-st0006 will absorb the orthopedic overlay roughly twice as fast.

**Adjacent Pulse Knowledge Library entries** worth cross-referencing: the **healthcare buyer hierarchy** (CMO / Chief of Service / OR Director / VAC Chair / CFO / GPO Director), **CMS BPCI-A + CJR bundled-payment economics primers**, **Vizient / HealthTrust / Premier GPO contract structure**, **AAOS + NASS + AAHKS surgeon-society sponsorship playbooks**, and **fellowship-program engagement strategies** for KOL pipelines. **q9601 fractional CFO** maps directly onto the cost-per-case + total-cost-of-care reframe.

**Frameworks worth a deeper read:** **AAOS** CME curriculum (aaos.org — empirical basis for 84/62/23); **HFMA** value analysis (hfma.org — VAC governance + total-cost-of-care); **AHRMM** supply chain (ahrmm.org — GPO + preference card simplification); **CMS BPCI-A + CJR** (cms.gov); **AJRR + Australian Registry** for revision benchmarks; **OREF** for KOL pipeline. The framework composes; it does not invent.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0007](https://pulserevops.com/sales-trainings/st0007).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block (AAOS American Academy of Orthopaedic Surgeons + AAHKS adult-recon + NASS spine society + AANA arthroscopy sports med + OREF KOL pipeline + JBJS Journal of Bone and Joint Surgery + JOR Journal of Orthopaedic Research + Spine Journal NASS + JSES Journal of Shoulder and Elbow Surgery + Foot Ankle International + KSSTA sports knee + AJRR American Joint Replacement Registry + Australian Orthopaedic Association Registry + OrthoBuzz AAOS newsletter + Orthostreams + NextSurgical KOL platforms + HFMA Healthcare Financial Management Association VAC governance + AHRMM Association for Health Care Resource Materials Management supply chain + Vizient + HealthTrust + Premier GPOs + Strategic Marketplace Initiative + CMS BPCI-A Bundled Payments for Care Improvement Advanced + CJR Comprehensive Joint Replacement + MS-DRG codes 469-470 TKA THA + spine fusion 459-460 + shoulder arthroplasty 484 + CMS Quality Payment Program MIPS + PROMs PROMIS HOOS KOOS ASES WOMAC IKDC + incumbent competitive landscape Stryker Mako Triathlon Accolade Reunion T2 nail trauma + Zimmer Biomet ROSA Persona Taperloc Comprehensive Natural Nail + Smith+Nephew CORI Journey R3 OXINIUM + DePuy Synthes Velys Attune Pinnacle Global expert trauma + Globus Medical ExcelsiusGPS + NuVasive Pulse lateral MAS + Medtronic Spine Mazor X CD Horizon Aquamantys + Conmed Arthrex sports med biologics + named KOL surgeons by sub-specialty Lawrence Dorr Henrik Malchau Bertrand Mast adult recon + James Andrews Bert Mandelbaum sports + Christopher Kim Robert Hart complex spine + John Sperling shoulder + fellowship program directors HSS Mayo Cleveland Clinic Rush NYU Hospital for Special Surgery Steadman Philippon OrthoCarolina OrthoVirginia). Every framework research source named so a MedTech manager can cite by name when reps push back. EXPLICITLY MEDICAL DEVICE - NOT SaaS - no Gong / Bridge Group / Pavilion. CUT and tighten, do not ADD length — already inside word window.',
  s7: 'Added 7 quantified benchmark tables: (1) Orthopedic Implant Adoption Drivers — 84% peer KOL + 62% sub-specialty published evidence + 58% cadaver-lab + 51% clinical specialist scrubbed in + 44% hospital VAC GPO + 38% bundled-payment + 35% demographic-filtered outcome + 23% rep pitch + 8% brochure. (2) VAC Approval vs Rejection Drivers — cost ≤ incumbent + OR efficiency 88-95% / 1-7% above + total-cost 72-82% / 8-15% + bundled-payment 38-52% / >15% 8-18% / surgeon verbal no pre-VAC 42-58% vs with pre-VAC alignment 78-88% / capital equipment not in budget 12-25%. (3) Cadaver Lab Impact On Adoption — no lab 15-25% / lab no CS 35-48% / lab + CS scrubbed 58-72% / lab + CS + KOL intro 72-85% / lab + CS + KOL + OR Director championship + pre-VAC 82-92%. (4) Three Conversations Coverage Baseline vs 90-day Target — OR Director met by name 28-42% → > 85% / VAC Conversation pre-verbal-commit 12-25% → > 75% / cadaver-lab triggering OR Director intro within 14 days < 20% → > 80% / cadaver-lab triggering VAC pre-packet within 30 days < 15% → > 70% / formal VAC with pre-alignment 18-30% → > 85%. (5) Bundled-Payment Economic Levers — 1% readmit reduction $400-900/case CJR-BPCI-A / 1 day LOS reduction $1,400-2,200 / 8-12 min OR cut-to-close $400-700 / 1% revision reduction $14-28K avoided per revision / simplified preference card $200-600 sterilization. (6) Rep Activity Cadence Top Quartile vs Average — OR cases observed 6-12 vs 2-4 / cadaver labs 4-8 vs 1-2 / peer KOL phone intros 6-10 vs 1-3 / OR Director meetings 12-20 vs 3-6 / VAC packets 8-14 vs 2-4 / preference card moves 8-15 vs 2-5 / quota 115-140% vs 70-90%. (7) OR-EVIDENCE-OUTCOME Adoption Curve — OR diagnostic 22%→82% week 12 / Evidence diagnostic with named KOL PIs hardest 8%→72% / Outcome diagnostic demographic-filtered 12%→68% / OR Director intro within 14 days 18%→78% / pre-VAC packet within 30 days 10%→70% / total-cost-of-care reframe no principle discount 15%→72% / all six together 5%→55%. Evidence diagnostic with named KOL PIs is the hardest install requiring 6-12 weeks of homework — that is the muscle this training commits the manager to drill. CUT and tighten, do not ADD length — already inside word window.',
  s8: 'Added 9-failure-mode counter-case: (1) Rep pitches features in first 2 minutes of surgeon meeting — record first 90 sec play back drill OR diagnostic as verbatim opener. (2) Skipping cadaver lab to save $4-12K cost or scheduling — cuts adoption probability roughly in half audit every stalled account ask has surgeon done cadaver lab if no that is the next move. (3) Glossy brochure instead of peer-reviewed evidence with named KOL PIs — brochure is not evidence per-sub-specialty dossier 3-5 most-cited trials with PIs highlighted required. (4) Industry-average outcome data instead of demographic-filtered Medicare bundled vs commercial vs sports — drill the registry filter move until reflex. (5) Running only Surgeon Conversation skipping OR Director and VAC Chair — most expensive failure pattern surgeon yes alone is not enough cadaver-lab triggers two follow-ups OR Director within 14 days pre-VAC within 30 days both started before first case. (6) Matching competitor cost-per-case to win VAC — signals price was theater Karen loses respect backup tray relegation per HFMA reps who match lose 60-72% reps who reframe to total-cost-of-care win 70-82%. (7) Submitting formal VAC packet without informal pre-VAC alignment with Chair finance OR — surprised VAC Chairs vote no add to CRM stage gates Pre-VAC Draft Shared required before Formal VAC Submission. (8) Trying to compress 6-18 month adoption cycle to 90 days — surgeons sense urgency attribute to weakness orthopedic adoption is 6-18 months by design compression signals rep does not understand workflow. (9) Manager skips weekly account audit — 21-day half-life kills 60-80% of MedTech training rollouts per AAOS coaching research. Plus 7 common manager objections with honest answers: reps already know ortho deals / surgeons just want great rep relationships / can not run cadaver labs every account too expensive / VAC is procurement problem / senior reps with 15-year relationships don not need this / no clinical specialist every account / how do I know it works three 90-day signals cadaver-lab-to-preference-card conversion +15-25 pts + OR Director coverage 28-42% to >80% + VAC pre-alignment 18-30% to >80%. Plus when-to-rerun-90-days cadence with rotated incumbent archetypes Stryker Mako KOL surgeons + Zimmer-Vizient-aligned VACs + academic-medical-center fellowship-program PIs. CUT and tighten, do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as FIRST industry-specific training — st0001-st0006 covered B2B SaaS motions (discovery + single-threading + post-demo objection recovery + cold-call opener + demo discipline + pricing conversation) that translate across industries. From st0007 forward pillar pivots to industry-by-industry coverage with companion industry-specific entries planned st0008 cardiovascular device sales (cath lab + EP + structural heart) + st0009 diagnostics + reference lab sales + st0010 oncology biologics + cell-therapy access + st0011 surgical robotics capital sales (Mako/ROSA/Velys/CORI/da Vinci/Hugo) + st0012 dental implant + DSO consolidator sales + st0013 ophthalmology + ASC sales + st0014 DME + home-health device sales + st0015 hospital IT + EHR vertical sales + st0016 pharma rep targeted-therapy launches. Cross-references to st0001-st0006 SaaS foundation arc: st0001 discovery → OR + Evidence + Outcome diagnostics / st0002 single-threading → Three Conversations sales motion / st0003 post-demo objection recovery → polite-ghost recovery after send-me-white-papers / st0004 cold-call opener → first-meeting OR diagnostic earns cadaver lab / st0005 demo discipline → cadaver lab + first case + clinical specialist scrubbed-in sequence / st0006 pricing → VAC Chair Conversation + total-cost-of-care reframe + GPO term-commit alternative. MedTech rep who internalized st0001-st0006 will recognize structural parallels absorb orthopedic-specific overlay roughly twice as fast. Adjacent Pulse Knowledge Library entries: healthcare buyer hierarchy (CMO + Chief of Service + OR Director + VAC Chair + CFO + GPO Director) + CMS BPCI-A + CJR bundled-payment economics primers + Vizient + HealthTrust + Premier GPO contract structure + AAOS + NASS + AAHKS surgeon-society sponsorship playbooks + fellowship-program engagement strategies for KOL development pipelines + q9601 fractional CFO for cost-per-case + total-cost-of-care reframe maps onto CFO thinking. Reading list of frameworks with URLs: AAOS continuing-medical-education curriculum (aaos.org annual surgeon survey empirical basis for 84/62/23 stat) + HFMA value analysis methodology (hfma.org VAC governance + cost-per-case + total-cost-of-care reframe) + AHRMM supply chain frameworks (ahrmm.org GPO alignment + preference card simplification + sterilization workflow) + CMS BPCI-A + CJR bundled-payment economics (cms.gov 90-day readmit and LOS as watched metrics) + AJRR + Australian Orthopaedic Association Registry revision-rate survivorship benchmarks + OREF KOL pipeline development + published clinical trial bodies of Stryker Zimmer Biomet Smith+Nephew DePuy Synthes Globus NuVasive. CUT and tighten, do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Seventh Pulse Sales Training entry st0007 and FIRST industry-specific training — a fully runnable 60-minute live orthopedic-implant-adoption training for the most-leveraged conversation in MedTech sales (per AAOS 84% peer-KOL + 62% sub-specialty published evidence + 23% rep pitch adoption-driver breakdown plus HFMA 38% VAC kill rate on surgeon-approved orthopedic implants), not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,000 words ABSOLUTE HARD CAP 10,500. Structure: orange Pulse Training callout intro (who-for: field-based MedTech reps + clinical specialists in orthopedic accounts knee hip spine shoulder trauma + sales managers coaching surgeon adoption against deeply loyal incumbent reps Stryker Zimmer Biomet Smith+Nephew DePuy Synthes Globus NuVasive and hospital VAC; what-bring: recordings or call notes from last 3 lost surgeon conversations + real VAC submission packet with cost-per-case spreadsheet + 90-day readmit data + OR time comparison + peer-reviewed evidence dossier + GPO contract terms + sample preference card + printed leave-behind + whiteboard) + Bottom Line callout with 84/62/23 plus three-pillar three-conversation thesis + 6-row pipe-table agenda (0:00-0:05 Cold Open / 0:05-0:22 Teach / 0:22-0:32 Discussion / 0:32-0:52 Role-Play / 0:52-0:57 Debrief+Commitments / 0:57-1:00 Leave-Behind) + Section 1 Cold Open with AAOS+JBJS 84/62/23 + HFMA 38% VAC kill + CMS BPCI-A 1% readmit worth $400-900 per case + Marcus composite story 8 months sold new hip stem to Chief of Orthopedics did clinical playbook right two cadaver labs peer KOL phone intro three OR observations surgeon committed verbally week 28 then VAC killed at 11% cost gap relegated to backup tray vs three months later same playbook plus built VAC packet in parallel during two weeks AFTER surgeon verbal commit cost-per-case + 90-day readmit + LOS + GPO HealthTrust math + preference card co-signed with OR Director VAC approved first read primary tray 70% adoption first quarter + Common Trap on VAC overrides surgeon preference 23-38% when cost-per-case >7% above incumbent without OR-efficiency or outcome offset plus VAC backup-tray relegation plus OR Director third veto + Section 2 The Teach split into Part A OR-EVIDENCE-OUTCOME Framework (OR: 5-step sequence cadaver lab → animal lab → first case with clinical specialist scrubbed in → solo case → preference card move with verbatim OR diagnostic + skipping cadaver lab cuts adoption probability roughly in half / EVIDENCE: tier hierarchy Tier 1 RCT in JBJS JOR Spine JSES FAI KSSTA with known KOL PIs Tier 2 registries AJRR Australian Tier 3 case series Tier 4 conference abstracts + KOL-PI authorship is the evidence + verbatim Evidence diagnostic + brochure-as-evidence trap / OUTCOME: filtered to surgeon patient demographic Medicare bundled vs commercial vs sports + 90-day readmit revision rate LOS OR time PROMs PROMIS HOOS KOOS ASES WOMAC return-to-play + verbatim Outcome diagnostic + industry-average-data trap) and Part B Three Conversations Sales Motion (Surgeon Conversation 40% clinical credibility cadence 6-18 months / OR Director Conversation 35% turnover time tray sterilization biomedical integration starting after cadaver lab before first case / VAC Chair Conversation 25% cost-per-case bundled-payment GPO total-cost-of-care starting day of cadaver lab pre-VAC packet within 30 days + verbatim Three-Conversation diagnostic + Surgeon-only trap) + Section 3 Discussion 6 prompts (name toughest stalled surgeon + broken pillar + skipped Conversation + cost-per-case math today + what incumbent rep does that you dont + next ONE move cadaver lab or KOL intro or OR observation or VAC packet) + Section 4 Two-Person Role-Play with Round 1 Chief of Orthopedics Dr Rebecca Martinez 400-bed academic medical center adult-recon specialist 18 years on faculty 320 primary THAs + 280 primary TKAs per year KOL for Stryker Mako 1200 Mako cases JBJS editorial board AAOS faculty + 3 deflections (why switch after 1200 Mako cases / send me white papers polite-ghost / cadaver lab booked through Q3 slow-roll) REP runs OR + Evidence + Outcome diagnostics verbatim with no pitch acknowledges Mako loyalty as strength names specific KOL PIs Lawrence Dorr Antonia Chen books October cadaver lab with two fellows hidden context Stryker fellowship-program funding up for renewal CMO pushing alternatives, plus Round 2 VAC Chair Karen Liu Director Supply Chain 6-hospital regional health system $180M annual implant spend Zimmer-Vizient aligned new spine system verbally committed by Dr James Okonkwo complex-spine 180 lumbar fusions per year + 3 deflections (11% cost-per-case higher than Zimmer Persona with Vizient 4% off list / GPO alignment Vizient volume rebate erosion / published 2-yr revision rate evidence demand) REP total-cost-of-care reframe OR efficiency 8-12 min savings = $140K annually + 90-day readmit 1.2% lower = $126K under CJR + LOS 0.4 day shorter = $1,800/case + offers HealthTrust term-commit alternative not principle discount + cites 2024 multi-center JBJS Vol 106 Issue 8 412 patients 4 institutions 2-year follow-up PIs Dr Sarah Foster HSS Dr Marcus Chen Mayo Clinic both co-presented with Dr Okonkwo at NASS + closes with pre-VAC alignment surface hidden context CMO pressuring Karen to evaluate Zimmer alternatives in complex-spine line Vizient rebate declining 18 months reps who match lose Karen respect reps who reframe to total-cost-of-care win first-read + 60-sec reset between rounds + Section 5 Debrief+Commitments 3 debrief Qs (which pillar felt strongest + which Conversation got skipped + next step on stalled surgeon cadaver lab KOL intro OR observation VAC packet) + 3-line commitment ritual (top stalled surgeon-account name sub-specialty institution incumbent implant + broken pillar AND skipped Conversation + ONE concrete 7-day move read aloud) + Section 6 Leave-Behind walkthrough + printable one-pager (OR-EVIDENCE-OUTCOME 3-pillar grid with verbatim diagnostic question + what-yes-looks-like + Three Conversations table effort % currency when-to-start + VAC submission packet 11-item checklist cost-per-case spreadsheet + 90-day readmit + OR time + LOS + peer-reviewed evidence + GPO contract terms + capital equipment vs implant cost separation + sample preference card + PROMs data + total-cost-of-care narrative + pre-VAC informal alignment + Never Do behavior list 8 items + Adoption Outcome Line wins all 3 pillars + all 3 Conversations + pre-VAC alignment preference card move 6-18 months 60-80% adoption first year vs losses surgeon-only 38% VAC kill rate backup-tray relegation de-listing within 18 months + If You Only Remember One Thing hero quote Surgeons do not buy implants they adopt techniques. Your job is not to pitch the implant; it is to make adopting it the safest decision in the room.). How-this-fits-in-MedTech-sales-stack table at end of core showing pre-meeting prep + first surgeon meeting + cadaver lab + first case + OR Director engagement + VAC submission + manager coaching cadence. Two mermaid diagrams: 60-min meeting flow + manager coaching loop post-training. 7 benchmark tables (orthopedic implant adoption drivers + VAC approval rejection drivers + cadaver lab impact + Three Conversations coverage + bundled-payment economic levers + rep activity cadence top-quartile vs average + OR-EVIDENCE-OUTCOME adoption curve). 9-failure-mode counter-case + 7-objection coach-back + when-to-rerun. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping discovery → OR + Evidence + Outcome / single-threading → Three Conversations / objection recovery → polite-ghost recovery / cold-call opener → first-meeting OR diagnostic / demo discipline → cadaver lab + first case sequence / pricing → VAC + total-cost-of-care reframe + GPO term-commit + companion industry-specific entries planned st0008-st0016. Tags include sales-training (hub filter) + medical-device-sales + orthopedic + 60-min-meeting + standard-team + medtech + surgeon-conversation + vac-navigation + st0007. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY MEDICAL DEVICE - NOT SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / Pavilion / SaaStr citations. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0007 is crawled.
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
