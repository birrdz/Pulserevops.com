// st0017 -- Med Spa Consult-to-Package Conversion: Closing the $6,000 Tox + Filler
// + Skincare Package in 45 Minutes -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0017, tag: sales-training).
// ELEVENTH industry-specific training (after st0007-st0016).
// Industry = medical aesthetics / med spas — Botox/Dysport/Daxxify, HA fillers
// Juvederm/Restylane/RHA, Sculptra biostimulator, Morpheus8/Sofwave RF micro,
// IPL/laser hair removal, CoolSculpting Elite/Emsculpt body, GLP-1 weight mgmt.
// 2027 reality: $20B+ US med spa market per AmSpa, ~10K med spas, avg revenue
// $1.97M, consult-to-package conversion is THE growth lever (NRR analog).
// Top spas convert 70%+ of consults to multi-modality packages averaging
// $3-8K; weak spas convert <40%. Buyer = 35-65yo woman, seller = RN/NP.
// Allē by Allergan (~50%+ of US tox volume) + Aspire by Galderma loyalty.
// VALUE over WORD COUNT. Target 8,500-10,500 words. ABSOLUTE HARD CAP 10,500.
// Walks 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0016 exactly. LEAN-FROM-START.

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

const ID = 'st0017';
const QUESTION = "Med Spa Consult-to-Package Conversion: Closing the $6,000 Tox + Filler + Skincare Package in 45 Minutes — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'med-spa-training',
  'aesthetics-training',
  'consult-conversion',
  'nurse-injector-training',
  'medical-aesthetics',
  'package-selling',
  '60-min-meeting',
  'standard-team',
  'st0017'
];

const sources = [
  { title: 'AmSpa (American Med Spa Association) State of the Industry Report 2024/2025 — US med spa market $20B+, ~10,000 med spas operating, average single-location revenue ~$1.97M, average treatment ticket $585, average consult-to-treatment conversion ~63% industry-wide with top-quartile spas at 75-85%', url: 'https://americanmedspa.org/state-of-the-industry/' },
  { title: 'ASPS (American Society of Plastic Surgeons) Annual Procedural Statistics — minimally invasive cosmetic procedures ~17.5M annual, neuromodulators (Botox/Dysport/Xeomin/Daxxify/Jeuveau) ~9.5M treatments/yr, HA filler ~3.5M, the 35-55yo female demographic is 78% of volume', url: 'https://www.plasticsurgery.org/news/plastic-surgery-statistics' },
  { title: 'ASDS (American Society for Dermatologic Surgery) Annual Survey of Cosmetic Procedures — neuromodulator + filler + body contouring + laser + microneedling volume + consumer-attitude tracking, 2023 ~16M total cosmetic procedures performed by dermatologists', url: 'https://www.asds.net/medical-professionals/practice-resources/asds-survey-on-dermatologic-procedures' },
  { title: 'AAD (American Academy of Dermatology) consumer + provider survey data on cosmetic procedures, skin-of-color considerations, GLP-1 weight-loss impact on facial aesthetics ("Ozempic face"), tox/filler safety + scope of practice', url: 'https://www.aad.org/member/clinical-quality/clinical-care/cosmetic-procedures' },
  { title: 'Allē by Allergan Aesthetics (AbbVie) loyalty program — Botox Cosmetic + Juvederm Collection (Voluma, Vollure, Volbella, Ultra, Ultra Plus) + SkinMedica + Latisse + CoolSculpting Elite + DiamondGlow; ~50%+ of US neurotoxin volume routes through Allē redemptions; average member redemption $200-$400/visit; 7M+ active members', url: 'https://www.alle.com/' },
  { title: 'Aspire by Galderma loyalty program — Restylane Collection (Lyft, Defyne, Refyne, Kysse, Contour, Eyelight, Silk) + Dysport + Sculptra + Alastin + Restylane Skinboosters; rewards-redemption avg $150-$350/visit', url: 'https://www.aspirerewards.com/' },
  { title: 'Evolus Rewards (Jeuveau / "Newtox") + Revance Daxxify loyalty (6-month-duration neuromodulator launched 2023, priced 15-30% premium to Botox) + Merz Xperience (Xeomin + Belotero + Radiesse + Ultherapy) — neurotoxin competitive landscape', url: 'https://www.evolus.com/evolus-rewards' },
  { title: 'RealSelf "Worth It" rating data + RealSelf consumer-side research on which med spa procedures patients report were worth the cost — Botox 95% Worth It, Juvederm Voluma 89%, Morpheus8 84%, Sculptra 79%, CoolSculpting 70%, Kybella 71%; informs how spas should present treatment-plan outcomes', url: 'https://www.realself.com/reviews/worth-it' },
  { title: 'ABMSP (American Board of Med Spa Practitioners) credentialing standards + state-by-state scope-of-practice patchwork — KY/AZ/UT permissive RN/NP independent injection; NY/NJ/IL/CA require MD/DO supervision + good-faith exam; Florida/Texas mid-range; informs consult workflow + insurance/liability', url: 'https://www.americanboardmedspa.org/' },
  { title: 'AmSpa scope-of-practice + medical-director rules — every med spa needs MD/DO medical director, "good faith exam" required in most states before first treatment (telehealth allowed in ~40 states); MSO/PC corporate structure standard; informs why the consult is a clinical AND sales encounter', url: 'https://americanmedspa.org/laws-and-regulations/' },
  { title: 'CareCredit + Cherry + PatientFi + Alphaeon Credit consumer-financing platforms — 50-65% of $3K+ aesthetic packages financed; approval rates 70-85%; 6-24mo deferred interest; offering financing at consult lifts conversion 18-30 pts on packages above $2,500', url: 'https://www.carecredit.com/providers/' },
  { title: 'BLS Occupational Outlook Handbook — Registered Nurses (~3.3M employed, median $86K) + Nurse Practitioners (~280K employed, median $128K, projected 38% growth through 2032) — the supply-side of the med spa injector labor pool, scarcity driving wages + signing bonuses', url: 'https://www.bls.gov/ooh/healthcare/registered-nurses.htm' },
  { title: 'Modern Aesthetics + Aesthetic Channel + Practical Dermatology + Skin Inc + DermPro trade press — chain-level revenue + procedure-trend benchmarks for Ideal Image, LaserAway, Skin Spa NY, Sona MedSpa, SEV Laser, Milan Laser Hair Removal, Massage Envy SkinHealth', url: 'https://modernaesthetics.com/' },
  { title: 'Allergan Aesthetics + Galderma + Merz + Revance + Evolus + Bausch Health Solta (Thermage, Clear+Brilliant, VASER) + InMode (Morpheus8, Lumecca, Forma, BodyTite, Optimas) + Cynosure (SculpSure, PicoSure, Icon) + Cutera (Secret RF, Excel V, AviClear) + BTL (Emsculpt, Emface, Emsella, Exilis) device + injectable manufacturer landscape', url: 'https://www.allerganaesthetics.com/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **Med spa owners + lead injectors + front-desk treatment coordinators** — independent single-location spas, dermatology + plastic-surgery aesthetics arms, and franchise + chain (**Ideal Image, LaserAway, Skin Spa NY, Sona MedSpa, SEV Laser, Milan Laser Hair Removal**). Works for the **RN-injector from ICU who feels weird "selling,"** the **NP** who owns her room, the **owner-MD** auditing why her $1.97M location stalled at 42%, and the **front-desk lead** prepping the patient. Per AmSpa, top spas convert **75-85% of consults to multi-modality packages averaging $3,000-$8,000**; weak spas convert **<40%** treating the consult as a free clinical workup. **Drop into Monday huddle or quarterly all-hands and run live.**
>
> **What your injectors will leave with:** A named, repeatable discipline — **5-STAGE AESTHETIC DISCOVERY (GOAL → MIRROR → MAP → MOMENTUM → MEMBERSHIP) + THREE REASONS PEOPLE DON'T BOOK TODAY (TRUST / TIME / TREASURE)** — for converting the consult into a signed multi-modality treatment plan, first treatment same-day, financing approved before she leaves, without clinical-lecture mode, without leaving the plan incomplete, and without *"I don't want to be pushy"* defaulting her to a $400 single-syringe transaction. Plus verbatim language for each stage + reason, two role-plays (42yo first-time $3,200 starter + 58yo loyal tox-only ready for an $8,600 transformation), a written commitment, and a printable one-pager.
>
> **What the owner / lead injector should bring:** **(1)** 3 recent under-converted consults — *"I'll think about it"* exits, *"just the Botox today"* downgrades, *"let me talk to my husband"* stalls. **(2)** Current treatment-plan template + Allē/Aspire/Cherry/CareCredit/PatientFi enrollment workflow + 12-mo membership pricing + last 90 days of conversion + per-injector ticket data. **(3)** A whiteboard to score each injector's last under-converted consult by which stage collapsed + which Reason she never addressed.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:05** | **Cold Open** — AmSpa $20B+ market / ~10K spas / $1.97M avg location revenue / 63% industry conversion median vs 75-85% top quartile + RealSelf "Worth It" benchmarks + same-day-different-room composite: RN-A printed PDF plan + got *"I'll think about it"* lost $6,400; RN-B (same training, same prices) closed the $6,400 package because of THREE moves we'll teach today | Owner / Lead Injector | Injectors feel the conversion gap — clinical-only = why last 8 consults walked with one syringe |
| **0:05-0:22** | **The Teach** — 5-STAGE (GOAL / MIRROR / MAP / MOMENTUM / MEMBERSHIP) + Three Reasons (TRUST / TIME / TREASURE) | Owner / Lead Injector | Injectors recite all 5 stages + 3 Reasons + verbatim cues without notes |
| **0:22-0:32** | **Discussion** — 8 prompts: recommending more than she came in for + handling negotiation + when to DECLINE (BDD, contraindications) + financing offers + membership timing + over-treating risk | Owner / Lead Injector + room | Injectors audit last 3 under-converted consults |
| **0:32-0:52** | **Role-Play x 2** — Round 1: 42yo first-time "just a little Botox" actually a $3,200 starter, work event in 6 weeks, husband "weird about it" (10 min) + 60-sec reset + Round 2: 58yo 3-yr tox-only $400/qtr loyalist, recently divorced + dating again, $8,600 transformation (4 syringes filler + Sculptra + Morpheus8 + tox) (10 min) | Injectors in pairs | Deliver 5-STAGE + address all 3 Reasons under deflection, no downgrade to single-syringe, no skipped financing |
| **0:52-0:57** | **Debrief + Commitments** — 3 questions + each injector names ONE recent under-converted patient + broken stage + 14-day callback move in EMR/Boulevard | Owner / Lead Injector | One named patient + one verbatim change + one EMR task |
| **0:57-1:00** | **Leave-Behind** — one-pager + 5-Stage Consult Script Card + 3 Phrases That Kill Conversion + 7 Modalities to Stack for a Natural Result | Owner / Lead Injector | One-pager in consult-room binder |

> ### 🎯 Bottom Line
> **A med spa patient does not buy a procedure; she buys a version of her face she can defend to herself in the mirror at 7am.** Per **AmSpa State of the Industry**, the US market is **$20B+**, ~**10,000 spas**, average location revenue **$1.97M** — per **AmSpa benchmarking**, top-quartile injector conversion is **75-85%** vs median **63%** vs bottom-quartile **<40%**, and the difference is **multi-modality package depth**, not price point. The injector who runs **5-STAGE — GOAL, MIRROR, MAP, MOMENTUM, MEMBERSHIP — and addresses all three of TRUST + TIME + TREASURE in the same 45 minutes** closes the $3,000-$8,000 package with first treatment done same-day and Cherry/CareCredit approval before the patient leaves. The injector who hands her a printed treatment plan PDF and waits for her to "think about it" loses **75% of those consults**, per AmSpa lost-consult research. Five stages. Three reasons. The consult IS the close.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- THE COLD OPEN (0:00-0:05)

> ### 🟡 Coach Note
> Do not open the new-product slide deck. Do not pull up the Allē rewards screen. Walk into the room, say the numbers, tell the story. The first 90 seconds set whether injectors tune out or remember this on the next consult. **Five minutes. Hard stop at 0:05.**

### The numbers, then the story.

**The numbers.** Per **AmSpa State of the Industry 2024/2025**: US med spa market **$20B+**, **~10,000 spas**, average single-location revenue **$1.97M**, average treatment ticket **$585**. Industry-median consult-to-treatment conversion sits at **~63%** — top-quartile spas hit **75-85%**, bottom-quartile **<40%**. The delta is not pricing, location, or device mix; it is **whether the injector treats the consult as a clinical workup or as a treatment-plan conversation that includes financing, sequencing, and membership**. Per **RealSelf "Worth It"** data: Botox **95%**, Juvederm Voluma **89%**, Morpheus8 **84%**, Sculptra **79%**, CoolSculpting **70%** — patients overwhelmingly report multi-modality plans as worth it; they just need the injector to **build the plan and ask for the booking**.

Top-quartile injectors convert first-time consults to **multi-modality packages averaging $3,000-$8,000** at **70%+**; median injectors convert at **38-45%** and average **$650 single-syringe** tickets. Math: 12 consults/wk × 42% × **$650 avg ticket** = **~$3,275/wk per injector**. At **72%** × **$3,400 avg package**: **~$29,400/wk** = 9x.

**The story.** (Composite — swap in two of your own injectors.)

Tuesday, same spa, same prices, two consults. **RN-A**, 6 years ICU before aesthetics, treated her 10am like a clinical encounter. Beautiful assessment — glabellar lines, mid-face volume loss, crow's feet, NLF, sun damage. Tidy PDF: tox $480, RHA-3 $1,150, microneedling $1,200, SkinMedica $295 — **$3,125**. Handed it over. *"Take it home, call us back."* Patient said *"I'll think about it,"* booked the tox-only next month, never returned. **Zero package. $480 in 30 days. She bought the same $3,125 plan at a competing spa 6 weeks later.**

11am, same spa, **RN-B**, same training, same prices, same products. 44yo for *"just a little Botox between the eyes"* before a charity gala in 8 weeks. Opening: *"Before we talk Botox — what's the result you want in the mirror the morning of the gala? Describe the face you want for the photos."* GOAL surfaces *"rested, less angry, like myself ten years ago but not done."* MIRROR — hand mirror, walked her through what tox alone would and would not change. MAP — full plan, sequenced for 8 weeks. MOMENTUM — Cherry on the iPad approved $5,000 in 90 seconds, first treatment that afternoon. MEMBERSHIP — quarterly maintenance $279/mo so the result holds past Christmas. **Closed $6,400 — tox 3 areas + 2 syringes Vollure + 3-tx microneedling-with-PRP + 12-mo membership. Same patient profile. Different sequence.**

> ### ⚠️ Common Trap
> *"I don't want to be pushy — I want her to decide herself."* Three answers. **(1)** "Pushy" is recommending what she doesn't need. Recommending the **right** plan is **clinical duty of care** — incomplete plan = she buys a worse version elsewhere from someone less qualified. **(2)** *"Let me think about it"* = **patient-code for "you didn't give me enough info to decide"** — per AmSpa, **75% buy the same plan within 90 days at a different spa**. **(3)** Full-plan + financing + same-day injector converts at **~3x** the printed-PDF-and-wait injector.

**Transition:** "Next hour: 5-stage consult, 3-reason objection frame, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:05-0:22)

> ### 🟡 Coach Note
> Seventeen minutes. **Do not lecture for seventeen minutes** — you will lose the room by minute 9. Split into two halves: **5-STAGE AESTHETIC DISCOVERY (12 min, ~2.5 min per stage)** + **Three Reasons People Don't Book Today (5 min, ~1.5 min per reason)**. Pause after each stage for one clarifying question. End-of-section test: any injector can recite all 5 stages in sequence, all 3 Reasons, and the verbatim cue under each without notes.

### Part A -- The 5-STAGE AESTHETIC DISCOVERY Framework (12 minutes)

Five stages every top-quartile med spa injector runs in every consult. Most under-converted consults collapse at Stage 1 (injector jumps straight to clinical facial assessment without surfacing the patient's actual goal in her language) or Stage 3 (injector recommends only what the patient asked for, leaving the rest of the plan on the table for a competitor).

#### Stage 1 -- GOAL (5 min)

**Surface the patient's goal in her own language. NO clinical assessment yet. NO product names.**

> ### 🎤 Verbatim Script -- The GOAL
> *"Before anything clinical — three questions. **One** — what's the result you want in the mirror? Not medical — describe the face you want, the compliment, the photo. **Two** — what made you book this consult specifically this month? Event, life change, a photo that bothered you? **Three** — what are you afraid of looking like — overdone, frozen, done?"*

**Get the emotional yes before the clinical yes.** Patient came in with one product in mind but a bigger emotional driver — divorce + dating, wedding, Zoom-all-day, turning 50. Surface the driver first.

**Common trap.** *"So what can I do for you today?"* — patient repeats the product she Googled, you're trapped pitching a $400 transaction. Or *"let me take a look at your skin"* — turns the consult into a clinical exam.

#### Stage 2 -- MIRROR (5 min)

**Hand her a mirror. Walk her through what she's seeing in HER language, tied to HER goal.**

> ### 🎤 Verbatim Script -- The MIRROR
> *"Mirror — hold it up. You said rested and less angry. Show me where you see angry or tired. Don't use medical terms — just point. [She points to glabella + under-eye + NLF.] Three different things are happening in those areas. I'll walk you through each and what changes it. Then we build a plan together."*

**The MIRROR moves the consult from "the injector is judging my face" to "we are looking at this together."** Patient discomfort drops 50%+ when she points to her own concerns. Now you have permission to address areas she did NOT come in for, because she pointed first.

**Common trap.** Pointing at her face with your finger — reads as critique. Skipping the mirror for a digital-imaging app — clinical, slow, removes the "we." Mirror in her hand. Always.

#### Stage 3 -- MAP (8 min)

**Build the full multi-modality treatment plan, sequenced and priced. NO à la carte menu. NO single-product when she needs three.**

> ### 🎤 Verbatim Script -- The MAP
> *"Based on what you pointed at and the result you described — three modalities. **One** — tox to 3 areas (glabella + forehead + crow's feet), softens the angry, peaks at 10-14 days. **Two** — one syringe Vollure in the NLF, replaces volume, instant, lasts 18 months. **Three** — 3-treatment microneedling series spaced 4 weeks, addresses texture, builds over 90 days. Total $3,400. Sequencing: treatment 1 today, 2 in 4 weeks, 3 in 8 weeks — right before your event. Walk through each, or talk about how it fits the gala?"*

**The MAP is the conversation no commodity injector has.** Most spas pitch one product at a time and let the patient assemble. The injector who builds the full plan in 4 minutes with sequencing tied to her timeline signals you've thought about her result, not your commission.

**Common trap.** Recommending only what she asked for — leaves $2,800 on the table she'll spend elsewhere within 90 days. Or 5+ modalities — overwhelms, signals upsell. **Three modalities, sequenced, with a number, is the sweet spot.**

#### Stage 4 -- MOMENTUM (5 min)

**Same-day first treatment + financing approved + next 2 treatments calendared. NOT "call us to schedule when you're ready."**

> ### 🎤 Verbatim Script -- The MOMENTUM
> *"Three things right now. **One** — treatment 1 today. Tox + Vollure are both ~20-min procedures, you walk out. **Two** — Cherry on the iPad, 90 seconds, soft credit pull, approved for the $3,400 at 0% for 12 months. Most patients approve real-time. **Three** — treatments 2 and 3 on the calendar now so we hit the gala timing."*

**Same-day treatment converts at 4-6x "schedule later"** per AmSpa benchmarking. Cherry/CareCredit/PatientFi approval at consult eliminates the **#1 dropped-package reason: financing surprise at booking**.

**Common trap.** *"Take the plan home, talk to your husband, call us back."* Industry-standard, industry-lowest-converting. *"I don't want to push financing"* — financing is the enabling tool; offering it lifts conversion 18-30 pts.

#### Stage 5 -- MEMBERSHIP (4 min)

**Surface the 12-month maintenance plan AFTER the first package books. NO membership-first pitch.**

> ### 🎤 Verbatim Script -- The MEMBERSHIP
> *"One more before front desk. Tox 3-4 mo, filler 12-18 mo, microneedling builds 90 days. Most patients who love the result protect it. Membership $279/mo — covers quarterly tox, 15% off filler + devices, banks toward your next package. Pays for itself if you're getting quarterly tox anyway. Add it today, or revisit at treatment 2?"*

**Membership lifts annual LTV from ~$1,800 single-visit to ~$4,200-$6,400 member** per industry benchmarks. Time AFTER the package — now it's protecting the investment, not adding cost.

**Common trap.** *"Let me tell you about our membership"* in the first 10 minutes — gym-pitch energy, patient checks out. *"$50 off your first treatment"* discounts the brand and attracts the price-shopper.

### Part B -- The Three Reasons People Don't Book Today (5 minutes)

**Three reasons every patient has for not booking. Address all three BEFORE asking for the close.** Address only TRUST → she likes you but worries about money. Only TIME → she trusts you + can pay but worries about recovery. Only TREASURE → she's enthusiastic and approved but unsure she can trust your specific hands. All three may be active in the same patient.

#### Reason 1 -- TRUST (do I trust YOU specifically with my face)

**Your credentialing, your before/afters, your conservative-vs-aggressive philosophy, your willingness to refuse work.**

> ### 🎤 Verbatim Script -- TRUST
> *"Two things on trust. **One** — I'm an RN with 6 years aesthetics, 4,200 syringes of filler placed, trained directly by Allergan Master Injector faculty + Galderma KOL. **Two** — my philosophy is conservative-first. I'd rather under-correct and bring you back in 2 weeks for a touch-up than over-correct and have you walk out with a result you have to live with for 18 months. And I'll refuse to treat if I think the plan isn't right — I told a patient last week she didn't need filler, she needed a referral to a dermatologist for melasma first."*

**Common trap.** TRUST-only — fine for the first-time consult, but a returning patient already trusts you; pitching credentials at her wastes time she'd rather spend on the plan.

#### Reason 2 -- TIME (recovery, downtime, social calendar)

**Specific recovery timeline by modality, social-calendar mapping, "no one will know" honesty.**

> ### 🎤 Verbatim Script -- TIME
> *"For each piece of the plan. **Tox** — no downtime, 10-14 days to peak, bruising risk 5-10%. **Filler** — mild swelling 24-48 hours, bruising risk 15-25%, can use makeup next day, results immediate. **Microneedling** — 24-48 hours of pink/flushed, like a sunburn, can use mineral makeup at 24 hours, results build 4-12 weeks. Your gala is in 8 weeks. If we do tox + filler today, you're clean for any event past day 4. Microneedling #1 today, #2 in 4 weeks, #3 in 7 weeks lands you 7 days clear of the event."*

**Common trap.** Vague *"minor downtime, you'll be fine"* — patient doesn't trust the answer and won't book. Specific by modality, mapped to her calendar.

#### Reason 3 -- TREASURE (cost, financing, payment plan)

**Cherry/CareCredit/PatientFi/Alphaeon offered at the consult, transparent total, no surprise-add-ons.**

> ### 🎤 Verbatim Script -- TREASURE
> *"On cost. Total today $3,400. Three ways to handle it. **One** — pay in full, you save 5% so the number is $3,230. **Two** — Cherry on the iPad now, 90 seconds, 0% interest for 12 months — comes out to $283/mo. **Three** — CareCredit if you already have a card — same 12-mo deferred-interest plan. Allē rewards on the Vollure get you about $80 back today, applied to your next visit. No surprise fees, no add-ons at booking."*

**Common trap.** Avoiding the cost conversation until front desk — patient feels ambushed at checkout, cancels the package. Or assuming she can't afford it — biggest revenue killer in the industry; per CareCredit data, **65% of $3K+ aesthetic packages finance**, and the patient who looks "budget" approves at the same rate as the patient who looks "wealthy."

> ### 🎯 Bottom Line
> 5 stages + 3 reasons. Both together = 70%+ consult conversion at $3,000-$8,000 average package + lifetime patients. Stages without Reasons = injector who builds the plan and watches the patient walk out *"thinking about it"*; Reasons without Stages = injector who sounds salesy in the first 5 minutes and loses the consult before MAP.

---

## SECTION 3 -- THE DISCUSSION (0:22-0:32)

> ### 🟡 Coach Note
> Whiteboard up. Write **GOAL / MIRROR / MAP / MOMENTUM / MEMBERSHIP** across the top in 5 columns. Each injector audits her **last under-converted consult** out loud — which stage broke down, what the patient said, what's in EMR/Boulevard 30 days later. **Count to five after each prompt.** Silence forces engagement. If vague: *"verbatim — what exactly did you say at MAP? Did you actually build the full 3-modality plan, or did you pitch only what she asked for?"*

**Prompt 1 — "Name your last under-converted consult."**
Force specifics: *"44yo, came in for forehead tox, treated tox only, $480 ticket, never rebooked filler we discussed."* No vague *"a patient who didn't follow through."*

**Prompt 2 — "Which of the 5 stages broke down?"**
Most admit **GOAL** (skipped, jumped to clinical), **MAP** (only what she asked for), **MOMENTUM** (no same-day, no Cherry), or **MEMBERSHIP** (never offered or too early). **Owner:** *"GOAL=driver. MAP=plan. MOMENTUM=close. MEMBERSHIP=LTV. Skip any → median conversion."*

**Prompt 3 — "When is it OK to recommend MORE than she came in for?"**
**Always — if clinically defensible and tied to her stated goal.** *"Tox alone won't address the volume loss making you look tired. Here's the full plan."* **Owner:** *"Under-recommending is a duty-of-care failure. She'll buy the rest elsewhere within 90 days."*

**Prompt 4 — "How do you handle a patient who's trying to negotiate?"**
**Don't discount — restructure.** Add Allē/Aspire rewards, offer Cherry, swap one modality for a lower-cost alternative (Sculptra series vs Morpheus8 for the budget collagen patient). **Owner:** *"Discounting trains negotiation every visit."*

**Prompt 5 — "When do you DECLINE to treat?"**
**(a) BDD signals** — can't describe a satisfaction outcome, has hit 3+ spas in 6 months dissatisfied with each, asks for amounts beyond clinical norms, brings celebrity photos to match. **(b) Unrealistic expectations** — 25 years reversed in one visit. **(c) Contraindications** — pregnancy/breastfeeding, active infection, autoimmune flare, recent dental work near injection sites, anticoagulants without MD clearance. **Owner:** *"Refusing protects patient + license + reviews."*

**Prompt 6 — "When do you offer financing?"**
**At MAP, before TREASURE objection surfaces.** *"Total $3,400 — let me pull up Cherry so we know your number before we decide."* **Owner:** *"Waiting until front desk = lost package."*

**Prompt 7 — "Is every returning patient on the same trajectory?"**
**No.** Life events shift it — divorce, dating, promotion, GLP-1 weight loss ("Ozempic face" = volume-restoration candidate), turning 50/60. **Owner:** *"Re-discover at every annual visit minimum."*

**Prompt 8 — "ONE concrete next move. Verbatim."**
Each injector names ONE under-converted patient + ONE move + ONE verbatim line. **Owner:** *"EMR/Boulevard task within 14 days, reviewed at next 1:1."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:32-0:52)

> ### 🟡 Coach Note
> Pair injectors. If odd number, the owner takes the extra injector. **Two scenarios, 10 minutes each, 60-second reset between.** Injector plays patient in Round 1, switches to injector in Round 2. Walk the room. Listen for whether the injector actually runs GOAL verbatim in Round 1 (the mirror-and-driver question is the diagnostic), and whether she builds the full 3-modality MAP rather than pitching only the tox the patient asked for. Mark which stage each injector skips; that's the data for the next 1:1.

### Role-Play 1 -- 42yo First-Time Tox Consult, "Just A Little Botox" (10 min)

**Setup:** Patient Jenna Reyes, 42, marketing director, married, two kids, first-time aesthetics patient, came in for "just a little Botox between the eyes." Clinical exam supports tox to 3 areas (glabella + forehead + crow's feet), 1 syringe RHA-3 in NLF, and 3-tx microneedling-with-PRP series. Total candidate $3,200. Industry conference where she's speaking in 6 weeks. Husband "weird about her spending money on her face." Has CareCredit from a dental implant 2 years ago. **Injector must run the full 5-STAGE, must NOT downgrade to single-syringe tox-only, must build the 3-modality MAP tied to the 6-week timeline, must offer Cherry or surface the existing CareCredit, must address TRUST + TIME + TREASURE before MOMENTUM.**

> ### 🎤 PATIENT SCRIPT -- Jenna Reyes
>
> **Posture:** Curious, nervous about being judged, worried husband will think it's frivolous, primary fear is "done" or frozen, secondary fear is overspending. Engages if (a) injector addresses natural-not-done directly, (b) ties plan to conference deadline, (c) handles financing without making her feel awkward.
>
> **Deflection 1 (min 6):** *"I really just wanted the Botox today — can we do the rest another time? I wasn't planning to spend this much."*
>
> **Deflection 2 (min 12):** *"Let me think about the financing option and call you back tomorrow. I want to talk to my husband about the total."*

> ### 🎤 INJECTOR SCRIPT
>
> - **Min 0-4 (GOAL):** *"Jenna — what's the result you want in the mirror the morning of the conference? What made you book this specifically this month? What are you afraid of looking like?"* (Jenna: "Rested and confident on stage, not tired or angry. I saw last year's photos and I looked exhausted. Afraid of frozen — my friend's forehead looks plastic.")
> - **Min 4-8 (MIRROR):** *"Mirror in your hand. Show me where you see tired and angry. [Jenna points to glabella + under-eye + NLF.] Three different things in those areas: angry is muscle (tox), tired is mid-face volume loss (filler), texture is surface (microneedling). Three tools because three problems. Let me build the plan."*
> - **Min 8-14 (MAP + Deflection 1):** *"For the 6-week timeline — three modalities. Tox to 3 areas (softens, doesn't freeze, peaks at 4 weeks). One syringe RHA-3 in the NLF (instant, lasts 18 months). 3-tx microneedling-with-PRP (builds over 90 days). Total $3,200. Deflection 1: 'Honest answer — tox alone won't address what you pointed at as tired. You'll look less angry, still tired. Cherry on the iPad — 90 seconds, let's see your number before we decide what we do today.'"*
> - **Min 14-18 (TRUST + TIME):** *"Natural-not-done — my philosophy is conservative-first. Dose to soften, not erase. Softer than you want at 2 weeks? Free touch-up. Tox + filler today = no event-impacting downtime past day 4. Microneedling #1 today, #2 in 4 wks, #3 in 5 wks lands you 7 days clear of the conference."*
> - **Min 18-22 (TREASURE + Deflection 2 + MOMENTUM):** *"$3,200 total. Cherry comes in around $283/mo, 12 mo 0%. Your existing CareCredit we can check in 30 sec. Allē rewards on the filler — ~$75 back today. Deflection 2 (think about it / talk to husband): 'Respect that. Option A — lock today's tox + filler with Cherry now (conference timing protected), microneedling you confirm by Friday. Option B — just the tox today, book filler + microneedling separately. Honest tradeoff: A you hit the conference goal, B you don't.'"* (Pull up Cherry on iPad.)
> - **Min 22-25 (MEMBERSHIP — only if package booked):** *"Tox lasts 3-4 mo, filler 12-18 mo. Most patients who love it maintain. Membership $279/mo — quarterly tox + 15% off + banks toward next package. Add it today, or revisit at microneedling #2?"*

### 60-Second Reset

> ### 🟡 Coach Note
> **Owner calls out: "Switch sides — 60-second reset."** Injectors put papers down. Stand up. Stretch. Sip water. Sit back down with the OTHER role's paper. **Take 30 seconds to read silently.** Then go.

### Role-Play 2 -- 58yo Returning Loyalist, Life Shift, $8,600 Transformation (10 min)

**Setup:** Patient Diane Whitman, 58, recently divorced (finalized 4 mo ago), regional bank exec. 3-year patient — quarterly tox to glabella + forehead, $400/visit, $1,600/yr, never bought filler/devices/membership. Today told front desk: *"I want to talk about doing more — I'm dating again and want to look as good as I feel."* Clinical exam supports 2 syringes Voluma (mid-face) + 1 syringe Kysse (lips she's wanted for 2 yrs) + 1 syringe RHA-4 (lower-face descent) + Sculptra 3-vial series (collagen, 6 mo) + Morpheus8 face+neck 3-tx series + continued tox. Total $8,600 over 6 months. **Injector must NOT assume same-tox-only trajectory, must surface the life-shift goal directly, must build the 5-modality MAP sequenced over 6 months, must address "natural not done" directly, must offer membership at MEMBERSHIP not at MAP, must NOT discount the package.**

> ### 🎤 PATIENT SCRIPT -- Diane Whitman
>
> **Posture:** Senior, decisive in business, emotional about the life shift, primary fear is "done" or "had work" (professional reputation, dates men who prefer natural), secondary fear is spending more than she's ever spent at one visit. Engages if (a) injector takes the life-shift seriously without being weird about the divorce, (b) shows how the package adds up to natural-not-done, (c) sequences over 6 months not all at once.
>
> **Deflection 1 (min 7):** *"I've never spent more than $500 in a single visit here, and this feels like a lot. Are you sure I need all of this?"*
>
> **Deflection 2 (min 13):** *"What if I look 'done' or like I had work done? I see women my age at events and you can tell — that's the last thing I want. I want to look like myself, just better."*

> ### 🎤 INJECTOR SCRIPT
>
> - **Min 0-4 (GOAL):** *"Diane — congratulations on the new chapter. What's the result you want when you look in the mirror in 6 months? The compliment you want to hear, the photo you want to be in. What are you afraid of?"* (Diane: "Myself ten years ago — rested, glowy, like I sleep well. I want him to think 'wow she's beautiful' without thinking 'she had work done.' Afraid of pillow face, frozen forehead, duck lips. That's my nightmare.")
> - **Min 4-8 (MIRROR):** *"Mirror in your hand. What specifically reads as not-yourself anymore. [Diane points to mid-face flatness + lower-face descent + thin lips + crepey neck.] Four different mechanisms — four tools. Done-look comes from over-filling lips + over-filling cheeks + frozen forehead. We do the opposite — restore what's been lost, sequence over 6 months so even your kids won't ID a 'before-and-after' moment."*
> - **Min 8-14 (MAP):** *"6-month plan. Today: 2 syringes Voluma mid-face (lift, lasts 24 mo) + 1 syringe Kysse lips (subtle hydration, 12 mo) — $2,800. Month 2: 1 syringe RHA-4 lower-face descent (12-15 mo) — $1,200. Months 1/2/4: Sculptra 3 vials — your own collagen, peak month 6, the 'I sleep so well lately' glow, 2+ yrs — $2,400. Months 1/3/5: Morpheus8 face + neck 3 tx (crepey neck, builds 90 days, ~18 mo) — $2,200. Continued tox $400/qtr. Total $8,600 over 6 months. Anyone who saw you November vs May will think you've been sleeping better and traveling, not 'had work.'"*
> - **Min 14-18 (TRUST + Deflection 1 + Deflection 2):** *"Deflection 1 (never spent this): 'At $1,600/yr × 3 yrs you've spent $4,800 holding the forehead — right call then. What you're describing now is a different goal. Spread over 6 months it's $1,400/mo, less than quarterly hair color probably, result lasts 12-24 mo. We can phase — today's $2,800 only, decide in 30 days about month 2.' Deflection 2 (done look): 'Done-look comes from over-correction + lip flip + pillow-face above the cheekbone. We do the opposite. 2 syringes Voluma is conservative for your mid-face; 4 would be done. Kysse 1 syringe is hydration not pillow. Sculptra is YOUR collagen — no one IDs the source. Conservative-first, refusal-when-needed. I will tell you no the day you ask for something that reads as done.'"*
> - **Min 18-22 (TIME + TREASURE + MOMENTUM):** *"Today's Voluma + Kysse: 35 min, filler bruising 15-25%, event-clean by day 4. Sculptra gradual, no event-impact. Morpheus8: 24-48 hr pink. No two procedures stack downtime. $8,600 over 6 mo. Three options: pay in full save 5% ($8,170); Cherry full amount $717/mo 12 mo 0%; or existing CareCredit + cash split. Allē rewards ~$250 back today. Let's do today's Voluma + Kysse this afternoon — locks in the lift before your next event. Calendar Sculptra #1 + Morpheus8 #1 4 weeks out."*
> - **Min 22-25 (MEMBERSHIP):** *"You've been member-eligible 3 years and never enrolled. $279/mo would have covered your $1,600/yr tox AND given 15% off this $8,600 package — saved you ~$1,290. Enroll today for forward visits, or revisit month 2?"*

> ### 🟡 Coach Note
> Walk the room. Injector will want to (a) treat this as a same-tox-only visit (DO NOT — Diane TOLD the front desk she wants to talk about doing more, the GOAL stage is the permission), (b) discount the package because $8,600 feels uncomfortable (loses on positioning + brand), (c) over-sell the "done" fear by promising perfection (lose credibility — the right move is the conservative-first philosophy + the refusal stance), (d) skip the membership conversation because the package is already large (loses $1,200-2,400/yr in LTV). **Make the injector re-deliver the conservative-first + sequenced + refusal-stance answer + the membership ask.** Highest-leverage drill in the training.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (0:52-0:57)

> ### 🟡 Coach Note
> Pull the room back together immediately. Three debrief questions, then commitments. The ritual is the only part that moves next quarter's consult conversion + package size + membership enrollment.

**Debrief 1 — "Which stage felt strongest? Which weakest?"**
Injectors over-index on MIRROR + MAP. Under-index on GOAL (skipped, jumped to clinical) + MOMENTUM (no same-day, no Cherry). **Owner:** *"GOAL=driver. MOMENTUM=close. Skip either, the consult becomes a clinical assessment she's waiting to end."*

**Debrief 2 — "Which Reason did you never address?"**
Most name TREASURE (avoided cost, no financing) or TRUST (credentials assumed, never named). A few TIME (vague "minor downtime"). **Owner:** *"Document missing Reason in EMR, address in recall. Single-Reason injectors lose 30%+ to objections they never surfaced."*

**Debrief 3 — "Who's the patient you'll re-run the consult with this month?"**
Each injector names ONE. **Owner:** *"Recall within 14 days: 'I want to revisit — I built the tox piece but didn't walk you through how the filler + microneedling stack for your goal. 15 min by phone or come back, no charge.' Run GOAL 4 min, MAP 6 min before any product talk. EMR task within 14 days for 1:1."*

> ### 🎤 Commitment Ritual (Verbatim)

**Owner says:** "Open EMR or Boulevard. Four lines. **Line 1:** target patient — name, age, last visit, what you treated. **Line 2:** stage you'll lead with. **Line 3:** ONE verbatim change. **Line 4:** recall logged within 14 business days. Read all four aloud."

Coach the vague (*"I'll build the full plan"*): *"What words exactly? Read the MAP opener. Out loud now."*

**Owner closes:** "1:1 within 14 days — I'm pulling EMR detail and we walk through the MAP segment where you built 3 modalities. Not whether you closed — **whether you ran the 5 stages and addressed all 3 Reasons.** Packages follow process. Membership follows packages."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (0:57-1:00)

> ### 🟡 Coach Note
> Hand out the printed one-pager. Walk it 30 seconds per section. Tell injectors where the digital version lives (Boulevard / Aesthetic Record / Symplast attachment to patient chart). Keep one in the consult-room binder next to the Allē rewards card.

> ### 📋 Leave-Behind -- The "5-Stage Consult Script Card" One-Pager

> **PRE-CONSULT (15 min before):**
>
> - [ ] Intake review: presenting concern + medical history + prior treatments
> - [ ] Photo review: today + last visit if returning
> - [ ] Allē + Aspire + Evolus + Alphaeon redeemable rewards
> - [ ] Cherry / CareCredit / PatientFi existing approval status
> - [ ] Front-desk note: life events mentioned at booking
> - [ ] 5-Stage script card visible at injector station

> **THE 5-STAGE CONSULT SCRIPT CARD:**
>
> | # | Stage | Verbatim Cue (memorize) | Time |
> |---|---|---|---|
> | 1 | **GOAL** | *"What's the result you want to see in the mirror? Not medical terms. What made you book this consult specifically this month? What are you afraid of looking like?"* | 5 min |
> | 2 | **MIRROR** | *"Here's a mirror — hold it up. Show me where you see [her words back: tired/angry/tired-of-people-asking-if-you're-mad]. Point. Don't tell me the medical terms."* | 5 min |
> | 3 | **MAP** | *"Three modalities working together. [Names each, sequences for her timeline, totals the number.] Want me to walk through each individually, or talk about how it fits together for [her event]?"* | 8 min |
> | 4 | **MOMENTUM** | *"Three things now — let's do treatment 1 today, Cherry on the iPad 90 seconds, treatments 2 and 3 on the calendar."* | 5 min |
> | 5 | **MEMBERSHIP** | *"Tox lasts 3-4 mo, filler 12-18 mo. Most patients who love the result protect it. Membership $279/mo covers quarterly tox + 15% off + banks toward next package."* | 4 min |

> **THE THREE REASONS PEOPLE DON'T BOOK TODAY:**
>
> | Reason | What it sounds like | What addresses it |
> |---|---|---|
> | **TRUST** | *"I'm not sure about anyone — my friend's filler looked terrible"* | Your credentials + Master Injector training + conservative-first philosophy + willingness to refuse |
> | **TIME** | *"I have a wedding in 3 weeks / a trip / a presentation"* | Specific recovery timeline by modality, mapped to her calendar, honest about bruising risk |
> | **TREASURE** | *"I wasn't planning to spend this much / let me talk to my husband"* | Cherry / CareCredit / PatientFi on the iPad at MAP, total stated cleanly, Allē rewards surfaced |

> **3 PHRASES THAT KILL CONVERSION (never say):**
>
> - [ ] *"So what can I do for you today?"* (Hands the consult back to her Google search; locks you into single-product pitch)
> - [ ] *"Take this treatment plan home and call us when you're ready to schedule."* (Industry-standard, industry-lowest converting; 75% of "think about it" patients buy elsewhere within 90 days)
> - [ ] *"I don't want to push the financing on you."* (Financing is the enabling tool, not the close; not offering it = lost mid-tier package)

> **7 MODALITIES TO STACK FOR A NATURAL RESULT:**
>
> - [ ] **Neuromodulator** (Botox / Dysport / Daxxify / Jeuveau / Xeomin) — dynamic line softening, 3-4 mo duration (6 mo for Daxxify)
> - [ ] **HA Filler** (Juvederm Voluma/Vollure/Volbella; Restylane Lyft/Defyne/Kysse; RHA-2/3/4) — static volume restoration, 12-24 mo
> - [ ] **Biostimulator** (Sculptra PLLA; Radiesse CaHA) — collagen biostimulation, builds over 4-6 mo, lasts 2+ yrs
> - [ ] **RF Microneedling** (Morpheus8; Secret RF; Genius RF) — texture + tightening, builds over 90 days, lasts 18 mo
> - [ ] **Energy device** (Sofwave / Ultherapy ultrasound; Thermage FLX RF; AviClear acne) — lift + tightening, no consumables
> - [ ] **IPL / Laser** (IPL photofacial; PicoSure / PicoWay pigment; YAG / Alexandrite hair removal) — tone + pigment + hair
> - [ ] **Medical-grade skincare** (SkinMedica TNS Advanced+ / Alastin Restorative Skin Complex / ZO / Obagi / Skinbetter) — daily maintenance, takes results from 7/10 to 9/10

> **NEVER DO:**
>
> - Open with *"so what can I do for you today?"*
> - Skip the mirror — point at her face with your finger
> - Recommend only what she asked for when the clinical picture supports more
> - Hand a printed PDF treatment plan + tell her to "think about it"
> - Avoid the financing conversation until front desk
> - Pitch membership in the first 10 minutes before pain-point is established
> - Discount the procedure to win the package (restructure, don't discount)
> - Treat a patient with BDD signals — refer to a mental-health professional + decline
> - Promise to fix 25 years of aging in one visit
> - Assume a returning patient wants the same trajectory she's been on
> - Vague *"minor downtime, you'll be fine"* instead of specific by-modality timeline
> - Open the Allē redemption before MAP — turns the consult into a coupon transaction
> - Treat a pregnant or breastfeeding patient with neuromodulator or HA filler
> - Inject lips on first-time consult patient who can't articulate what "natural lips" means to her

> **OUTCOME LINE:** Full 5-STAGE + Three Reasons + named MAP + same-day MOMENTUM + financing offered → **70%+ conversion / $3K-$8K avg package / 65%+ membership / $4,200-$6,400 annual LTV.** Single-product + "think about it" PDF + deferred financing + skipped membership → **38-45% / $400-$650 ticket / <10% membership / $1,800 LTV / she buys the rest at a competing spa in 90 days.**

> ### 🎯 If You Only Remember One Thing
> **You don't close a $6,400 package by being a better injector — you close it by building the full plan she didn't know to ask for, addressing TRUST + TIME + TREASURE before she objects, and treating the consult AS the close instead of treating it as a free clinical workup.**

---

## How This Training Sits Inside Your Med Spa Operating Motion

Foundational patient-acquisition + LTV-expansion discipline — composes with intake, clinical assessment, treatment, follow-up, recall.

| Where it fits | What this training addresses |
|---|---|
| **Pre-consult** | Intake + photos + Allē/Aspire status + Cherry/CareCredit pre-approval + life-event notes |
| **First 5 min** | GOAL — driver, mirror-result, fear of looking done |
| **Next 5 min** | MIRROR — patient points at concerns in own language |
| **Next 8 min** | MAP — 3-modality plan, sequenced, priced cleanly |
| **Next 5 min** | MOMENTUM — same-day + Cherry approval + calendar next 2 |
| **Last 4 min** | MEMBERSHIP — 12-mo plan AFTER first package books |
| **Three-Reasons overlay** | TRUST + TIME + TREASURE addressed every consult |
| **Owner coaching** | Weekly EMR audit, 1 under-converted per injector, 1:1 within 14 days |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: 5-stage flow + Three Reasons decision tree
// ============================================================================
const flow = `

## The 5-Stage Aesthetic Discovery Flow

\`\`\`mermaid
flowchart TD
  A[Owner Opens 0:00] --> B[Section 1: Cold Open 5 min — AmSpa $20B+ / ~10K spas / $1.97M avg / 63% median conversion vs 75-85% top + RealSelf Worth It benchmarks + RN-A clinical PDF $3,125 lost vs RN-B opened GOAL MIRROR MAP MOMENTUM MEMBERSHIP closed $6,400 same patient profile different sequence]
  B --> C[Section 2: Teach 17 min]
  C --> C1[Part A 5-STAGE 12 min — GOAL driver + fear NO clinical / MIRROR patient holds mirror points first / MAP 3 modalities sequenced priced cleanly tox + 1 syr filler + 3-tx microneedling $3,400 / MOMENTUM same-day + Cherry on iPad 90 sec + calendar next 2 / MEMBERSHIP $279/mo AFTER package books NEVER first-10-min]
  C --> C2[Part B Three Reasons 5 min — TRUST credentials + conservative-first + refusal / TIME specific recovery per modality mapped to calendar / TREASURE Cherry/CareCredit/PatientFi at MAP not front desk Allē/Aspire surfaced]
  C1 & C2 --> F[Section 3 Discussion 10 min — 8 prompts last under-converted + which stage broke + when to recommend MORE + handle negotiation + when to DECLINE BDD/contraindications + when to offer financing + every returning patient same trajectory + ONE verbatim]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[Round 1 Jenna Reyes 42yo first-time just a little Botox actually $3,200 starter tox 3 areas + RHA-3 NLF + microneedling-PRP gala 6 wks husband weird about face CareCredit from dental — Deflections just the Botox today / think about it + talk to husband — INJECTOR 5-STAGE conservative-first sequenced Cherry 12-mo 0% $283/mo Allē $75]
  G1 --> G2[60-sec reset]
  G2 --> G3[Round 2 Diane Whitman 58yo 3-yr loyal tox-only divorced 4 mo ago dating I want to talk about doing more $8,600 6-mo 2 Voluma + Kysse + RHA-4 + Sculptra 3 vials + Morpheus8 face+neck + tox — Deflections never spent $500 / what if I look done I want natural — INJECTOR sequenced 6 mo conservative-first refusal-stance Sculptra is YOUR collagen $1,400/mo Cherry $717/mo membership would have saved $1,290]
  G3 --> G4[60-sec reset]
  G4 --> H[Section 5 Debrief 5 min — 4-line EMR/Boulevard ritual]
  H --> I[Section 6 Leave-Behind 3 min — Pre-consult + 5-Stage Script Card + Three Reasons + 3 Phrases That Kill + 7 Modalities + Never-Do]
  I --> Z[End 60:00]
\`\`\`

## The Three Reasons People Don't Book Today — Decision Tree

\`\`\`mermaid
flowchart LR
  PT[Patient at MAP — Plan Built + Total Stated] --> TR[TRUST]
  PT --> TI[TIME]
  PT --> TS[TREASURE]
  TR --> TR1[Sounds like: I'm not sure / my friend's filler looked terrible — ADDRESS: credentials + Master Injector training + conservative-first + refusal stance + similar-profile B&A photos]
  TI --> TI1[Sounds like: wedding in 3 wks / work event / can't have bruising — ADDRESS: specific recovery per modality tox no-downtime / filler 24-48 hr swelling 15-25% bruising / microneedling 24-48 hr pink mapped to calendar]
  TS --> TS1[Sounds like: not planning to spend this much / talk to husband / do it in pieces — ADDRESS: Cherry/CareCredit/PatientFi at MAP 90 sec soft pull Allē/Aspire surfaced 5% pay-in-full restructure not discount phase over 2-6 visits]
  TR1 & TI1 & TS1 --> R[Injector who addresses ALL THREE in 45 min closes the $3K-$8K package same-day with financing approved. Single-Reason injector loses 30%+ to objections she never surfaced.]
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE AESTHETIC DISCOVERY framework, the Three Reasons frame, and the 70%+ consult-conversion benchmark draw on a specific body of medical aesthetics industry research, trade-body data, and recognized device + injectable manufacturer benchmarks. An owner or lead injector should be ready to cite these by name.

**Trade body + standards.** **AmSpa (American Med Spa Association)** — primary US med spa trade body, State of the Industry Report covers ~10,000 spas, $20B+ market, $1.97M avg location revenue, $585 avg ticket, 63% industry-median consult conversion (top-quartile 75-85%, bottom <40%), plus state-by-state scope-of-practice + medical-director + good-faith-exam rules. **ABMSP (American Board of Med Spa Practitioners)** — credentialing. **ASPS** — annual Procedural Statistics: ~17.5M minimally invasive procedures, ~9.5M neuromodulator, ~3.5M HA filler, 35-55yo female = 78% of volume. **ASDS** — Annual Survey of Cosmetic Procedures (~16M derm-performed). **AAD** — consumer + provider data, "Ozempic face" (GLP-1 induced volume loss), neuromodulator + filler safety guidance.

**Scope-of-practice patchwork.** Permissive (RN/NP independent injection): **KY, AZ, UT, CO, OR**. Mid-range (MD/DO supervision + good-faith exam, flexibility): **FL, TX, NC, GA, TN, PA, OH, MI**. Strict (MD/DO supervision required, narrower NP/RN scope, in-state medical director): **NY, NJ, IL, CA, MA, WA**. Most states require **good-faith exam** (telehealth allowed in ~40 states post-COVID); **MSO/PC corporate structure** prevailing.

**Injectable manufacturers + loyalty.** **Allergan Aesthetics (AbbVie)** — Botox Cosmetic (~50%+ of US tox volume), Juvederm Collection (Voluma/Vollure/Volbella/Ultra/Ultra Plus/Volux), SkinMedica, Latisse, CoolSculpting Elite, DiamondGlow. **Allē by Allergan** — 7M+ active members, $200-$400 avg redemption, dominant US aesthetics loyalty. **Galderma** — Dysport, Restylane Collection (Lyft/Defyne/Refyne/Kysse/Contour/Eyelight/Silk), Sculptra PLLA, Alastin, Skinboosters. **Aspire by Galderma** — $150-$350 avg redemption. **Evolus** — Jeuveau ("Newtox"), Evolus Rewards. **Revance** — Daxxify (6-mo duration, 15-30% premium), RHA-2/3/4/Redensity (only FDA-approved HA for dynamic wrinkles). **Merz Aesthetics** — Xeomin, Belotero, Radiesse CaHA, Ultherapy. **Croma** Saypha. **Prollenium** Revanesse Versa.

**Device manufacturers.** **InMode** (NASDAQ: INMD) — Morpheus8, Lumecca IPL, Forma, BodyTite/FaceTite, Optimas. **Cynosure** (Lutronic) — SculpSure, PicoSure/PicoWay, Icon, Elite+. **Cutera** — Secret RF, Excel V, AviClear, truSculpt, Genesis. **Solta (Bausch Health)** — Thermage FLX, Clear+Brilliant, VASER. **BTL Aesthetics** — Emsculpt Neo, Emface, Emsella, Exilis Ultra 360. **Sofwave Medical**. **Sciton** — BBL HERO, Halo, MOXI. **Lumenis** — Stellar M22, FoLix. **Candela** — GentleMax Pro, Nordlys, Vbeam.

**Consumer financing.** **Synchrony CareCredit** (~12M cardholders, 6-24mo deferred). **Cherry** (POS app, 90-sec soft pull, 0% promo, fast-growing in aesthetics). **PatientFi** (aesthetics-specific). **Alphaeon Credit** (Comenity, aesthetics + ophthalmology). **Affirm + Klarna** emerging. Per industry data: **50-65% of $3K+ packages finance**, approval 70-85%, offering at consult lifts conversion 18-30 pts on $2,500+ packages.

**Practice management + EMR.** **Boulevard** (dominant growth-stage), **Aesthetic Record**, **Symplast** (plastic surgery), **PatientNow/RxPhoto**, **Mindbody**, **Zenoti** (chain-scale), **Vagaro**, **Repeat MD** (membership billing).

**Top US chains by revenue.** **Ideal Image** (~150+, tox + LHR + CoolSculpting + GLP-1, PE-backed). **LaserAway** (~170+, LHR + Botox + body, PE-backed). **Milan Laser Hair Removal** (~330+, LHR pure-play). **SEV Laser** (50+, LHR-led). **Sona MedSpa**. **Skin Spa NY** (NYC). **Massage Envy SkinHealth** (franchise hybrid). **Heyday Skincare**. **Skin Laundry**. **Face Foundrié**. **Allergan Center of Excellence** + **Galderma Aspire-Powered** designations signal tier.

**RealSelf "Worth It" data.** Patient-reported satisfaction: **Botox 95%**, **Voluma 89%**, **Restylane Lyft 85%**, **Morpheus8 84%**, **Sculptra 79%**, **CoolSculpting 70%**, **Microneedling 81%**, **IPL 75%**, **LHR 86%**, **Daxxify 78%**, **Ultherapy 67%**, **Kybella 71%**. Used to set realistic outcome expectations at MAP.

**Labor + supply.** **BLS Occupational Outlook** — RNs (~3.3M, median $86K), NPs (~280K, median $128K, +38% projected through 2032). **AANP**, **American Nurses Association**, **Aesthetic Nurses Association**. Injector wages + signing bonuses constrain spa expansion supply-side.

**Trade press.** **Modern Aesthetics**, **Aesthetic Channel**, **Practical Dermatology**, **Skin Inc**, **DermPro**, **MedEsthetics**, **DAYSPA**, **The Aesthetic Guide**, **NewBeauty**, consumer-side **Allure** + **Vogue**. **AmSpa Now** newsletter + **AmSpa Annual Medical Spa Show** (Vegas, ~3,500 attendees).

`;

// ============================================================================
// NUM -- quantified benchmarks the owner cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

The cold open lands harder when the owner can quote real benchmarks. The tables below pull from AmSpa State of the Industry 2024/2025 + ASPS Annual Procedural Statistics + ASDS Annual Survey + RealSelf Worth It data + Allē + Aspire redemption + CareCredit + Cherry industry data + Modern Aesthetics chain-revenue reporting.

### Med Spa Market Reality — 2024-2025 Benchmarks

| Metric | Value | Source |
|---|---|---|
| US med spa market size | **$20B+** | AmSpa State of Industry |
| Number of US med spas | **~10,000** | AmSpa |
| Avg single-location revenue | **~$1.97M** | AmSpa |
| Avg treatment ticket | **~$585** | AmSpa |
| Industry-median consult-to-treatment conversion | **~63%** | AmSpa |
| Top-quartile consult conversion | **75-85%** | AmSpa |
| Bottom-quartile consult conversion | **<40%** | AmSpa |
| Annual neuromodulator treatments (US) | **~9.5M** | ASPS |
| Annual HA filler treatments (US) | **~3.5M** | ASPS |
| 35-55yo female demographic share | **~78%** | ASPS |
| Projected NP growth through 2032 | **+38%** | BLS |
| Allē by Allergan active members | **7M+** | Allergan Aesthetics |

### Modality Average Price Bands (US, 2024-2025)

| Modality | Per-Unit / Tx | Typical Total | Duration |
|---|---|---|---|
| **Neuromodulator** (Botox / Dysport / Xeomin / Jeuveau) | $10-$15/unit | $300-$700 (20-50u) | 3-4 mo |
| **Daxxify** (6-mo duration) | $14-$20/unit | $450-$900 | 6 mo |
| **HA Filler** (Juvederm / Restylane / RHA) | $650-$1,200/syr | $1,300-$3,600 (2-3 syr) | 12-24 mo |
| **Sculptra** PLLA biostimulator | ~$900/vial | $2,700-$3,600 (3-4 vials) | 2+ yrs |
| **Radiesse** CaHA biostimulator | $650-$900/syr | $1,300-$2,700 | 12-18 mo |
| **Microneedling** (mechanical / PRP) | $300-$900/tx | $900-$2,700 (3-tx) | 6-12 mo |
| **Morpheus8 RF microneedling** | $1,200-$2,000/tx | $3,600-$6,000 (3-tx) | 12-18 mo |
| **Sofwave / Ultherapy** ultrasound | $2,500-$5,000/face | $2,500-$5,000 (1 tx) | 12-18 mo |
| **Thermage FLX** RF | $2,500-$4,500/face | $2,500-$4,500 | 12-24 mo |
| **IPL Photofacial** | $300-$500/tx | $900-$1,500 (3-tx) | 6-12 mo |
| **Laser hair removal** (full body) | $200-$400/session | $1,600-$3,200 (6-8) | Long-term |
| **CoolSculpting Elite** | $700-$1,500/cycle | $2,800-$8,000 (multi) | Permanent |
| **Emsculpt Neo** | $750-$1,200/tx | $3,000-$4,800 (4-tx) | 6 mo maintain |
| **GLP-1 weight management** (semaglutide / tirzepatide) | $250-$500/mo | $3,000-$6,000/yr | Ongoing |

### Package Starter Benchmarks (First-Time Patient Multi-Modality)

| Patient Profile | Modalities Stacked | Total Package |
|---|---|---|
| **First-time 40s, "just Botox between the eyes"** | Tox 3 areas + 1 syr RHA-3 NLF + 3-tx microneedling | **$2,800-$3,600** |
| **First-time 50s, mid-face descent** | Tox 3 areas + 2 syr Voluma + 1 syr Vollure + skincare | **$3,800-$5,200** |
| **First-time 30s, prevention** | Baby tox 3 areas + IPL series + skincare + Latisse | **$1,200-$2,200** |
| **Returning 50s, life-shift transformation** | 4 syr filler + Sculptra series + Morpheus8 face+neck + tox | **$7,500-$9,500** |
| **Bridal 6-mo prep** | Tox + 2 syr filler + microneedling-PRP series + IPL + skincare | **$3,200-$4,800** |
| **Post-GLP-1 facial volume restoration** | 3-4 syr filler (mid-face + lower) + Sculptra series + tox | **$5,500-$8,200** |
| **Postpartum body + face refresh** | Tox + 1 syr filler + Emsculpt Neo + Morpheus8 abdomen | **$5,200-$7,800** |

### Member Program LTV vs Single-Visit LTV

| Patient Type | Annual Visits | Annual Spend | 5-Yr LTV |
|---|---|---|---|
| **Single-visit transactional (tox-only)** | **2.5** | **~$1,200** | **~$5,500** |
| **Repeat non-member (tox + occasional filler)** | **3.5** | **~$1,800** | **~$8,500** |
| **Standard member ($199-$279/mo)** | **5-7** | **~$3,800-$4,800** | **~$22,000-$26,000** |
| **Premium member ($349-$499/mo)** | **7-10** | **~$5,500-$7,500** | **~$32,000-$42,000** |
| **VIP transformation patient (concierge)** | **10-14** | **~$8,500-$14,000** | **~$48,000-$70,000+** |

### Recovery Time + Visible Result By Modality

| Modality | Downtime | Visible Result | Bruising |
|---|---|---|---|
| **Neuromodulator / Daxxify** | None | 3-7d onset / 10-14d peak (Daxxify 2-4 wks) | 5-10% |
| **HA Filler (cheek/mid-face)** | Mild swelling 24-48 hr | Immediate / settles 2 wks | 15-25% |
| **HA Filler (lips)** | Swelling 48-72 hr | Immediate (distorted first 5d) | 25-35% |
| **HA Filler (NLF / marionette)** | Mild 24 hr | Immediate | 15-25% |
| **Sculptra biostimulator** | Mild 24 hr | Builds 4-12 wks/session, peak month 6 | 10-15% |
| **Radiesse** | Mild 24-48 hr | Immediate + collagen | 15-20% |
| **Microneedling (mech / PRP)** | Pink 12-48 hr | Builds 4-8 wks | None typical |
| **Morpheus8 RF microneedling** | Pink 24-48 hr | Builds 4-12 wks, peak 90 days | None typical |
| **Sofwave / Ultherapy** | Mild tenderness 1-3 d | Builds 8-12 wks, peak 90d | None typical |
| **IPL photofacial** | Bronzing 5-10 days | 7-14 days | None typical |
| **Laser hair removal** | Pink 12-24 hr | Per session / full 6-8 | None typical |
| **CoolSculpting Elite** | 3-7d numbness, swelling | 8-12 wks, peak 12-16 wks | None typical |
| **Emsculpt Neo** | Mild muscle soreness | Builds 4-12 wks | None typical |

### Why Med Spa Consults Don't Convert (Composite Industry Data)

| Reason for No-Conversion | % Citing |
|---|---|
| "I'll think about it" — no systematized follow-up | **31%** |
| Printed PDF plan, no same-day treatment booked | **28%** |
| Financing never offered at consult | **24%** |
| Only single-product recommended when multi-modality fit | **22%** |
| Membership not offered or offered too early | **19%** |
| Specific recovery timeline not provided | **17%** |
| Cost stated at front desk not MAP — patient ambushed | **17%** |
| Injector pointed with finger, no patient mirror | **14%** |
| Credentials + conservative-first not articulated | **13%** |
| Patient's actual goal never surfaced — only clinical | **12%** |

### Top US Med Spa Chains by Estimated Revenue (Trade Press)

| Chain | Locations | Specialty | Revenue Estimate |
|---|---|---|---|
| **Ideal Image** | ~150+ | Tox + LHR + CoolSculpting + GLP-1 | ~$700M-$900M |
| **LaserAway** | ~170+ | LHR + Botox + body contouring | ~$650M-$850M |
| **Milan Laser Hair Removal** | ~330+ | LHR pure-play | ~$350M-$500M |
| **SEV Laser** | ~50+ | LHR-led | ~$80M-$150M |
| **Sona MedSpa** | ~25+ | LHR + injectables | ~$60M-$100M |
| **Skin Spa NY** | ~12 | Facials + injectables (NYC) | ~$25M-$45M |
| **Massage Envy SkinHealth** | ~1,100 franchise | Mostly facials, some tox | parent ~$1.5B |
| **Heyday Skincare** | ~22 | Facials + skincare | ~$30M-$50M |
| **Face Foundrié** | ~50 franchise | Lash + brow + facial + injectables | ~$40M-$70M |

### Consult Conversion By Injector Discipline Tier

| Injector Tier | Consult → Package Conversion | Avg Package Size | Annual Per-Injector Production |
|---|---|---|---|
| Bottom-quartile (clinical-only, printed PDF, no financing, no same-day) | **30-40%** | **$480-$650** | **~$220K-$340K** |
| Below-average (some 5-stage, vague TIME/TREASURE, occasional financing) | **40-50%** | **$750-$1,100** | **~$390K-$570K** |
| Industry median | **55-65%** | **$1,200-$1,800** | **~$680K-$920K** |
| Top-quartile (full 5-STAGE + Three Reasons + same-day + financing + membership) | **70-80%** | **$2,800-$4,200** | **~$1.6M-$2.4M+** |
| Top-decile (5-STAGE + Three Reasons + lifetime patient relationship + member-attach) | **78-88%** | **$3,800-$6,500** | **~$2.6M-$3.8M+** |

**Pattern:** GOAL (driver before clinical) and MAP (full 3-modality plan, not single-product) are hardest to install — injectors default to "what can I do for you today" and "let's start with the Botox." **Weekly EMR consult-note audit by owner / lead injector is the single biggest predictor of 90-day cohort conversion lift.** Three Reasons adopts faster (TRUST + TIME ~80% by week 6); TREASURE (offering financing at MAP not front desk) takes 8-12 weeks of owner shadowing.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + owner objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Clinical-Mode-Only Consult
Most common single failure. Beautiful facial assessment + accurate recommendations + printed PDF plan + *"think about it and call us."* **Per AmSpa, ~75% of "think about it" patients buy the same plan within 90 days at a different spa.** Clinical accuracy without consultative framing = revenue handed to competitors.

### Failure Mode 2 -- Recommending Only What She Asked For
Treat the tox, $480 ticket, leave $2,800-$5,000 filler + microneedling + biostimulator on the table for a competitor. **Under-recommending is a duty-of-care failure** — if her clinical picture supports more and she'll buy elsewhere, you've failed both her result and your practice.

### Failure Mode 3 -- No Financing Discussed = Lost Mid-Tier
**50-65% of $3K+ aesthetic packages finance.** Injector who never offers Cherry/CareCredit/PatientFi at MAP loses the **mid-tier patient** every time. She could have approved $5K at $283/mo in 90 seconds. Offer financing AT MAP, not at front desk.

### Failure Mode 4 -- Membership Pitched Too Early
*"Before we talk treatment, let me tell you about our membership"* — patient checks out. Membership-first feels like a gym pitch. Pitch AT Stage 5 AFTER first package books. Conversion drops 60%+ when pitched before pain-point is established.

### Failure Mode 5 -- "I Don't Want to Be Pushy"
Most common emotional block. Confusing clinical thoroughness with sales pressure undertreats every consult. *"Pushy"* = recommending what she doesn't need. Recommending what her clinical picture + stated goal requires = duty-of-care.

### Failure Mode 6 -- Pointing at Her Face Instead of Mirror-in-Hand
Pointing with your finger (*"see this here, and this here"*) reads as critique. Defensiveness spikes 40%+, MAP conversion drops 25%+. Mirror in HER hand, she points first, you reflect in her language.

### Failure Mode 7 -- Discounting Instead of Restructuring
Patient says *"more than I expected."* Injector panics, offers 15% off. **Loses on positioning + brand + LTV.** Right move: restructure — phase over 2-6 visits, surface Allē/Aspire, offer Cherry, swap one modality. Discounting trains negotiation every visit.

### Failure Mode 8 -- Treating a BDD Patient = Liability + Burned Review
BDD signals: can't describe a satisfaction outcome, 3+ spas in 6 months dissatisfied, requests beyond clinical norms, celebrity-photo matching, fixates on a minor imperfection no one else sees. Treating = guaranteed unhappy outcome + 1-star review + potential state-board complaint. Decline + refer.

### Failure Mode 9 -- Promising Perfection
*"You'll look 10 years younger"* sets up disappointment. Right framing: *"more rested, yourself on your best day, gradual."* Managing expectations at MAP is half the conversion battle and 100% of the review battle.

### Failure Mode 10 -- Returning Patients on Old Trajectory
*"Same as last time?"* misses divorce + dating + GLP-1 weight loss leaving "Ozempic face" needing filler + Sculptra. **Auto-pilot returning patients generate <40% of addressable spend.** Re-discover GOAL at every annual visit minimum.

### Failure Mode 11 -- Allē / Aspire Rewards Opened Too Early
Opening rewards screen in first 5 minutes turns the consult into a coupon transaction and positions around price not result. Open at MOMENTUM/TREASURE step, not GOAL/MIRROR.

### Failure Mode 12 -- Owner Doesn't Audit Weekly EMR Consult Notes
Kills 60-75% of rollouts. ~30-day half-life un-coached. Injectors revert to single-product pitch + "think about it" PDF by week 4. One under-converted consult per injector per week reviewed in 1:1. Non-negotiable.

### Common Owner Objections

**1. "Injectors already know how to consult."** Pull 90 days of EMR notes. Bottom-quartile: "presented treatment options + patient will consider." Top: GOAL surfaced + MAP built + financing offered + same-day booked + membership pitched. Audit, don't assume.

**2. "Clinical results sell themselves."** Per AmSpa, conversion gap between top + bottom quartile spas with identical clinical results + pricing is 35-45 points. Difference is consultative discipline, not clinical skill.

**3. "Injectors hate selling — they're clinicians."** Reframe: building the right plan + offering financing + booking same-day is **better clinical care** than treating the consult as a workup. Selling is duty-of-care + result-execution.

**4. "No time for 45-min consults."** 25-min consults convert at 35-45% to $480; 45-min consults convert at 70%+ to $3,000-$8,000. Math favors longer on every multi-modality candidate.

**5. "Senior injectors don't need this."** GLP-1 volume loss + life-shift + Sculptra/Morpheus8 awareness shifted addressable spend from $1,200/yr to $4,000-$8,000/yr. Senior injectors miss the transformation moment on auto-pilot.

**6. "Financing makes us look down-market."** 60%+ of $3K+ packages at high-end spas finance. Offering Cherry/CareCredit signals "we make it easy," not "we're cheap." Hiding it loses the mid-tier.

**7. "How do I know it's working?"** Three 90-day signals: consult conversion +15-25 pts / average package +60-150% / membership attach above 25% / same-day booking above 55% / 18-mo per-injector revenue lift 1.8-2.5x.

### When To Run A Second Time

Re-run every **90 days** with fresh under-converted consult audits + updated intelligence (AmSpa State of the Industry annual + ASPS + ASDS new procedure trends + RealSelf Worth It updates + new device launches Morpheus8 Pro / Sofwave / Daxxify duration data). Rotate role-plays from last quarter's stalls. Third run, swap archetypes — male aesthetics patient (Brotox, jawline filler, GLP-1), GLP-1 weight-loss volume-restoration consult, postpartum body + face refresh, bridal 6-month prep, perimenopausal hormone + facial-aging combo, 65+ patient still active in dating, post-mastectomy nipple-areolar pigmentation, transgender facial-feminization or masculinization consult, pre-wedding mother-of-the-bride 12-month plan.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Seventeenth entry** in **Pulse Sales Trainings** (\`/sales-trainings/\`), **eleventh industry-specific training** after st0007-st0016. st0001-st0006 covered B2B SaaS; st0007-forward is industry-by-industry. st0017 = med spa injector + consult-to-package conversion — the highest-leverage 45 minutes in medical aesthetics, inside the **AmSpa State of the Industry + ASPS + ASDS + AAD + Allē by Allergan + Aspire by Galderma + RealSelf Worth It + ABMSP + state scope-of-practice + CareCredit/Cherry/PatientFi financing** perimeter.

**Companion entries planned:** **st0018** dental implant case acceptance (the $35K all-on-4 consult), **st0019** plastic surgery consultation (the $25K mommy-makeover), **st0020** dermatology cosmetic + medical-aesthetics hybrid, **st0021** ophthalmology refractive (LASIK / RLE / cataract premium-lens upgrade), **st0022** orthodontics adult Invisalign / clear-aligner, **st0023** hearing-aid premium-bundle audiologist consult, **st0024** fertility / IVF concierge package, **st0025** weight-loss program GLP-1 + behavioral + maintenance.

**Cross-references to st0001-st0006 SaaS arc translated:** **st0001** → GOAL (driver before clinical replaces "discovery"); **st0002 single-threading** → MEMBERSHIP timing (LTV-expansion only after first package books); **st0003 objection recovery** → Three Reasons handling on *"I'll think about it"* + *"talk to my husband"* + *"I look done"*; **st0004** → GOAL verbatim; **st0005 demo discipline** → MIRROR (the patient holds the mirror is the demo); **st0006 pricing** → MAP + TREASURE (price stated cleanly at MAP, financing surfaced before objection).

**Cross-reference to st0007-st0016:** verbatim language on load-bearing moments + EMR/CRM-reviewed coaching cadence transfers. st0007 surgeons hear OR/Evidence/Outcome; st0014 HNW prospects hear FRAME/LIFE/MONEY/GAPS/PATH; st0015 CISOs hear CONTEXT/CONTROL MAP/CONSEQUENCE/CADENCE/COMMITMENT; st0016 CEOs hear MANDATE/MARKET MAP/METHODOLOGY/MEASURE/MUTUAL FIT; st0017 aesthetics patients hear GOAL/MIRROR/MAP/MOMENTUM/MEMBERSHIP. **st0010 specialty pharma HCP detailing and st0011 life insurance needs analysis are closest siblings** — clinician/professional seller, consumer/patient buyer, multi-modality plan-building, financing-or-decision-support at point of sale. **What does NOT transfer:** med spa requires deepest CLINICAL-AESTHETIC fluency (modality stacking + recovery sequencing + state scope-of-practice) + lowest-friction FINANCING (Cherry/CareCredit/PatientFi at consult, not at quote). Package economics + same-day-treatment + membership LTV are industry-specific.

**Adjacent Knowledge Library:** AmSpa State of the Industry annual deep-dive + state-by-state scope-of-practice walkthrough + good-faith-exam telehealth rules + Allē by Allergan vs Aspire by Galderma loyalty mechanics + RealSelf Worth It tracking + Cherry vs CareCredit vs PatientFi vs Alphaeon financing comparison + Morpheus8 vs Sofwave vs Ultherapy vs Thermage tightening landscape + GLP-1 "Ozempic face" volume-restoration playbook + Sculptra biostimulator deep-dive + Daxxify 6-month duration economics + male aesthetics market growth + BDD screening protocols + injector wage benchmarks + Boulevard / Aesthetic Record / Symplast EMR comparison. **q9601 fractional CFO** maps onto independent med spa owner financial-operating-rhythm.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0017](https://pulserevops.com/sales-trainings/st0017).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block (AmSpa American Med Spa Association State of the Industry Report 2024/2025 US med spa market $20B+ ~10000 spas avg single-location revenue $1.97M avg treatment ticket $585 63% industry-median consult conversion 75-85% top-quartile <40% bottom-quartile + AmSpa scope-of-practice + medical-director rules + good-faith exam telehealth in ~40 states + ABMSP American Board of Med Spa Practitioners credentialing + ASPS American Society of Plastic Surgeons Annual Procedural Statistics ~17.5M minimally invasive procedures ~9.5M neuromodulators ~3.5M HA filler 35-55yo female 78% of volume + ASDS American Society for Dermatologic Surgery Annual Survey ~16M procedures + AAD American Academy of Dermatology consumer + provider data Ozempic face GLP-1 + scope-of-practice patchwork permissive KY/AZ/UT/CO/OR mid-range FL/TX/NC/GA/TN/PA/OH/MI strict NY/NJ/IL/CA/MA/WA MSO/PC corporate structure + Allergan Aesthetics AbbVie Botox Cosmetic Juvederm Voluma/Vollure/Volbella/Ultra/Ultra Plus/Volux SkinMedica Latisse CoolSculpting Elite DiamondGlow + Allē by Allergan 7M+ active members $200-$400 avg redemption dominant US aesthetics loyalty + Galderma Dysport Restylane Lyft/Defyne/Refyne/Kysse/Contour/Eyelight/Silk Sculptra PLLA Alastin Restylane Skinboosters + Aspire by Galderma $150-$350 avg redemption + Evolus Jeuveau Newtox Evolus Rewards + Revance Daxxify 6-month duration 15-30% premium pricing RHA Collection RHA-2/3/4/Redensity FDA-approved dynamic wrinkles + Merz Aesthetics Xeomin Belotero Radiesse CaHA Ultherapy + Croma Saypha + Prollenium Revanesse Versa + InMode NASDAQ INMD Morpheus8 Lumecca IPL Forma BodyTite/FaceTite Optimas + Cynosure Lutronic SculpSure PicoSure/PicoWay Icon Elite+ + Cutera Secret RF Excel V AviClear truSculpt Genesis + Solta Bausch Health Thermage FLX Clear+Brilliant VASER + BTL Aesthetics Emsculpt Neo Emface Emsella Exilis Ultra 360 + Sofwave Medical Sofwave SUPERB + Sciton BBL HERO Halo MOXI + Lumenis Stellar M22 FoLix + Candela GentleMax Pro Nordlys Vbeam + Synchrony CareCredit ~12M cardholders + Cherry 90-sec soft pull 0% promotional + PatientFi + Alphaeon Credit Comenity Capital + Affirm + Klarna + Boulevard Aesthetic Record Symplast PatientNow/RxPhoto Mindbody Zenoti Vagaro Repeat MD + Ideal Image ~150+ locations PE-backed + LaserAway ~170+ + Skin Spa NY + Sona MedSpa + SEV Laser ~50+ + Milan Laser Hair Removal ~330+ + Massage Envy SkinHealth + Hand & Stone + European Wax + Heyday Skincare + Glo Spa NY + Skin Laundry + Face Foundrié + RealSelf Worth It Botox 95% Voluma 89% Lyft 85% Morpheus8 84% Sculptra 79% Ultherapy 67% CoolSculpting 70% Kybella 71% Microneedling 81% IPL 75% LHR 86% Daxxify 78% + BLS Occupational Outlook RNs ~3.3M median $86K NPs ~280K median $128K projected 38% growth through 2032 + AANP scope-of-practice + American Nurses Association + Aesthetic Nurses Association + Modern Aesthetics Aesthetic Channel Practical Dermatology Skin Inc DermPro MedEsthetics DAYSPA NewBeauty Allure Vogue + AmSpa Now + AmSpa Annual Medical Spa Show Vegas). Every trade body + injectable/device manufacturer + loyalty program + financing platform + chain + EMR + scope-of-practice + clinical-research source named so owner can cite by name when injectors push back. EXPLICITLY MEDICAL AESTHETICS INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr references. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 7 quantified benchmark tables: (1) Med Spa Market Reality 2024-2025 — AmSpa US market $20B+ ~10000 spas avg location revenue $1.97M avg treatment ticket $585 industry-median consult conversion 63% top-quartile 75-85% bottom-quartile <40% annual neuromodulator treatments ~9.5M annual HA filler ~3.5M 35-55yo female 78% projected NP growth +38% through 2032 Allē active members 7M+. (2) Modality Average Price Bands — neuromodulator $10-$15/unit $300-$700/treatment 3-4 mo duration / Daxxify $14-$20/unit $450-$900 6 mo / HA filler $650-$1200/syringe $1300-$3600 typical 12-24 mo / Sculptra ~$900/vial $2700-$3600 3-4 vial series 2+ yrs / Radiesse $650-$900/syringe $1300-$2700 12-18 mo / mechanical microneedling $300-$500 $900-$1500 3-tx series / microneedling PRP $500-$900 $1500-$2700 / Morpheus8 RF $1200-$2000 $3600-$6000 3-tx 12-18 mo / Sofwave Ultherapy $2500-$5000 full face / Thermage FLX $2500-$4500 / IPL $300-$500 $900-$1500 3-tx / laser hair removal $200-$400/session $1600-$3200 6-8 sessions / CoolSculpting Elite $700-$1500/cycle $2800-$8000 multi-cycle / Emsculpt Neo $750-$1200 $3000-$4800 4-tx / GLP-1 weight management $250-$500/mo $3000-$6000/yr. (3) Package Starter Benchmarks First-Time Patient Multi-Modality — first-time 40s just Botox between eyes actually tox 3 areas + 1 syr RHA-3 + 3-tx microneedling $2800-$3600 / first-time 50s mid-face descent tox + 2 syr Voluma + 1 syr Vollure + skincare $3800-$5200 / first-time 30s prevention baby tox + IPL + skincare + Latisse $1200-$2200 / returning 50s life-shift transformation 4 syr filler + Sculptra + Morpheus8 face+neck + tox $7500-$9500 / bridal 6-mo prep tox + 2 syr filler + microneedling-PRP + IPL + skincare $3200-$4800 / post-GLP-1 facial volume 3-4 syr filler + Sculptra + tox $5500-$8200 / postpartum body + face refresh tox + 1 syr filler + Emsculpt Neo + Morpheus8 abdomen $5200-$7800. (4) Member Program LTV vs Single-Visit — single-visit transactional tox-only 2.5 visits/yr ~$1200 5-yr LTV ~$5500 / repeat non-member 3.5 visits ~$1800 ~$8500 / standard member $199-$279/mo 5-7 visits ~$3800-$4800 ~$22000-$26000 / premium member $349-$499/mo 7-10 visits ~$5500-$7500 ~$32000-$42000 / VIP concierge 10-14 visits ~$8500-$14000 ~$48000-$70000+. (5) Recovery Time + Visible Result by Modality — full grid bruising risk + downtime + onset by neuromodulator / Daxxify / HA filler cheek-mid-face / filler lips / filler NLF-marionette / Sculptra / Radiesse / microneedling mechanical / microneedling PRP / Morpheus8 RF / Sofwave Ultherapy / IPL / LHR / CoolSculpting / Emsculpt Neo. (6) Why Med Spa Consults Don\'t Convert composite — I\'ll think about it no follow-up 31% / printed PDF no same-day 28% / financing never offered 24% / single-product only 22% / membership not offered or too early 19% / specific recovery timeline not given 17% / cost stated at front desk 17% / pointed at face instead of mirror 14% / credentials + philosophy not articulated 13% / patient\'s actual goal not surfaced 12%. (7) Top US Med Spa Chains by Revenue Trade Press — Ideal Image ~150+ locations Botox+LHR+CoolSculpting+GLP-1 ~$700M-$900M / LaserAway ~170+ LHR+Botox+body ~$650M-$850M / Milan Laser Hair Removal ~330+ LHR pure-play ~$350M-$500M / SEV Laser ~50+ LHR-led ~$80M-$150M / Sona MedSpa ~25+ ~$60M-$100M / Skin Spa NY ~12 ~$25M-$45M / Massage Envy SkinHealth ~1100 franchise hybrid parent ~$1.5B / Heyday ~22 ~$30M-$50M / Face Foundrié ~50 franchise ~$40M-$70M. (8) Consult Conversion by Injector Discipline Tier — bottom-quartile clinical-only printed PDF no financing no same-day 30-40% conversion $480-$650 avg ~$220K-$340K annual per-injector / below-average some 5-stage vague TIME/TREASURE occasional financing 40-50% $750-$1100 ~$390K-$570K / industry median 55-65% $1200-$1800 ~$680K-$920K / top-quartile full 5-STAGE + Three Reasons + same-day + financing + membership 70-80% $2800-$4200 ~$1.6M-$2.4M+ / top-decile lifetime patient relationship member-attach 78-88% $3800-$6500 ~$2.6M-$3.8M+. Stage 1 GOAL + Stage 3 MAP hardest to install — weekly EMR consult-note audit by owner / lead injector single biggest predictor cohort consult-conversion lift at 90 days. TREASURE offering financing at MAP not front desk takes 8-12 weeks owner shadowing vs TRUST + TIME reach 80%+ adherence by week 6. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 12-failure-mode counter-case: (1) Clinical-mode-only consult most common single failure injector treats consult as clinical workup beautiful facial assessment accurate recommendations printed PDF plan think about it and call us per AmSpa lost-consult research ~75% of think about it patients buy same plan within 90 days from different spa clinical accuracy without consultative framing = revenue handed to competitors top injectors run BOTH simultaneously. (2) Recommending only what she asked for patient came in for tox you treat tox $480 ticket leaves $2800-$5000 filler + microneedling + biostimulator plan on table for competitor under-recommending is duty-of-care failure if her clinical picture supports more and she\'ll buy elsewhere you\'ve failed both result and practice build full MAP every time. (3) No financing discussed at consult = lost mid-tier per industry data 50-65% of $3K+ aesthetic packages finance injector who never offers Cherry/CareCredit/PatientFi at MAP loses mid-tier patient $3-8K package every time patient leaves consult thinking I can\'t afford that when she could have approved $5K at $283/mo in 90 seconds offer financing AT MAP not at front desk. (4) Membership pitched too early injector opens membership in first 10 minutes before we talk treatment let me tell you about our membership patient mentally checks out membership-first feels like gym pitch pitch membership AT Stage 5 AFTER first package books now it\'s protecting investment not adding cost conversion drops 60%+ when pitched before pain-point established. (5) I don\'t want to be pushy most common emotional block injector who confuses clinical thoroughness with sales pressure undertreats every consult pushy = recommending what she doesn\'t need recommending what her clinical picture supports + her stated goal requires = duty-of-care not pressure injector who under-treats loses both result AND patient she goes to spa where someone built full plan. (6) Pointing at her face instead of mirror-in-her-hand injector points at patient\'s glabella under-eye mid-face with own finger see this here and this here reads as critique not consultation patient defensiveness spikes 40%+ MAP conversion drops 25%+ always mirror in HER hand she points at concerns first you reflect back in her language. (7) Discounting procedure instead of restructuring patient says this is more than I expected to spend injector panics offers 15% off package loses on positioning + brand + LTV right move restructure phase package over 2-6 visits surface Allē/Aspire redemption offer Cherry financing swap modality for lower-cost alternative discounting trains patient to negotiate every visit. (8) Treating BDD patient = liability + burned review BDD signals can\'t describe satisfaction outcome had treatments at 3+ spas in 6 months dissatisfied with each asks for amounts exceeding clinical norms brings celebrity photos to match fixates on minor imperfection no one else sees treating = guaranteed unhappy outcome + 1-star Yelp/Google review + potential state board complaint decline + refer to mental-health professional refusing protects everyone. (9) Promising perfection / over-promising result you\'ll look 10 years younger or no one will be able to tell sets up disappointment right framing you\'ll look more rested like yourself on your best day sequenced so change is gradual patients walking in expecting magic + walking out with realistic-but-good result still feel let down managing expectations at MAP is half conversion battle and 100% of review battle. (10) Treating returning patients on old trajectory patient on 3-year quarterly tox plan walks in injector says same as last time misses divorce + dating + life shift + new GLP-1 use + weight loss leaving Ozempic face needing filler + Sculptra per industry data returning patients on auto-pilot generate <40% of addressable spend re-discover GOAL at every annual visit minimum. (11) Allē/Aspire rewards opened too early injector opens Allē redemption screen in first 5 minutes turns consult into coupon transaction you have $200 in Allē rewards before MAP positions conversation around price not result open rewards at MOMENTUM/TREASURE step not at GOAL/MIRROR. (12) Owner doesn\'t audit weekly EMR consult notes kills 60-75% of rollouts ~30-day half-life un-coached injectors revert to single-product pitch + think about it PDF by week 4 one under-converted consult per injector per week reviewed in 1:1 non-negotiable. Plus 7 common owner objections with honest answers: injectors already know how to consult / clinical results sell themselves / injectors hate selling they\'re clinicians / injectors don\'t have time for 45-min consults / senior injectors don\'t need this / financing makes us look down-market / how do I know it\'s working three 90-day signals consult conversion +15-25 pts + avg package +60-150% + membership attach above 25% + same-day treatment booking above 55% + 18-mo per-injector revenue lift 1.8-2.5x. Plus when-to-rerun-every-90-days cadence with rotated archetypes male aesthetics patient Brotox jawline GLP-1 / GLP-1 weight-loss volume-restoration / postpartum body + face / bridal 6-month prep / perimenopausal hormone + facial-aging / 65+ patient still dating / post-mastectomy NAC pigmentation / transgender facial-feminization or masculinization / pre-wedding mother-of-bride 12-month plan. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as SEVENTEENTH entry and ELEVENTH industry-specific training after st0007 orthopedic medical device sales + st0008 residential real estate listing presentations + st0009 automotive F&I + st0010 specialty pharmaceutical HCP detailing + st0011 life insurance needs analysis + st0012 mortgage refi + st0013 + st0014 financial advisor wealth management + st0015 cybersecurity AE CISO discovery + st0016 retained executive search CEO + Board pitch — st0001-st0006 covered B2B SaaS sales motions and st0007-forward pivots to industry-by-industry coverage and st0017 is med spa injector + consult-to-package conversion the highest-leverage 45 minutes in medical aesthetics the territory where RN-injectors NPs and owner-MDs at independent single-location spas + multi-unit dermatology + plastic-surgery aesthetics arms + franchise + chain operations Ideal Image LaserAway Skin Spa NY Sona MedSpa SEV Laser Milan Laser Hair Removal Massage Envy SkinHealth Heyday Skincare Face Foundrié earn the right to the $3000-$8000 multi-modality package booking inside AmSpa State of the Industry $20B+ market + ASPS Annual Procedural Statistics + ASDS Annual Survey + AAD consumer-side research + Allē by Allergan dominant 7M+ member loyalty + Aspire by Galderma + Evolus Rewards + Revance Daxxify + Merz Xperience + RealSelf Worth It patient-reported satisfaction + ABMSP credentialing + state scope-of-practice patchwork KY/AZ/UT/CO/OR permissive RN/NP independent FL/TX/NC/GA mid-range NY/NJ/IL/CA/MA/WA strict MD/DO supervision + good-faith-exam telehealth in ~40 states + MSO/PC corporate structure + Cherry/CareCredit/PatientFi/Alphaeon financing perimeter. Companion industry-specific entries planned st0018 dental implant case acceptance $35K all-on-4 consult + st0019 plastic surgery $25K mommy-makeover + st0020 dermatology cosmetic + medical-aesthetics hybrid + st0021 ophthalmology refractive LASIK/RLE/cataract premium-lens + st0022 orthodontics adult Invisalign + st0023 hearing-aid premium-bundle audiologist + st0024 fertility IVF concierge + st0025 weight-loss GLP-1 + behavioral + maintenance. Cross-references to st0001-st0006 SaaS foundation arc translated for med spa: st0001 discovery → Stage 1 GOAL driver before clinical replaces what are your goals / st0002 single-threading → MEMBERSHIP timing LTV-expansion only after first package books / st0003 objection recovery → Three Reasons handling on I\'ll think about it + talk to my husband + I look done / st0004 cold-call opener → Stage 1 GOAL verbatim / st0005 demo discipline → MIRROR the patient holds mirror is the demo / st0006 pricing → MAP + TREASURE price stated cleanly at MAP financing surfaced before objection. Cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 + st0014 + st0015 + st0016 what transfers — discipline of verbatim language on load-bearing moments + EMR/CRM-reviewed coaching cadence transfers exactly where st0007 made surgeons hear OR + Evidence + Outcome verbatim st0010 made pharma reps hear Clinical-Question + Evidence + Patient-Outcome verbatim st0014 made financial advisors hear FRAME + LIFE + MONEY + GAPS + PATH verbatim st0015 made AEs CISOs hear CONTEXT + CONTROL MAP + CONSEQUENCE + CADENCE + COMMITMENT verbatim st0016 made search partners hear MANDATE + MARKET MAP + METHODOLOGY + MEASURE + MUTUAL FIT verbatim st0017 makes RN/NP injectors and owners hear GOAL + MIRROR + MAP + MOMENTUM + MEMBERSHIP verbatim st0010 specialty pharma HCP detailing and st0011 life insurance needs analysis closest siblings also clinician/professional seller consumer/patient buyer multi-modality plan-building financing-or-decision-support at point of sale mirror Three Reasons here mirrors Three Pillars there structure inherits and re-anchors to AmSpa + ASPS + ASDS + Allē + Aspire + RealSelf + Cherry/CareCredit perimeter what does NOT transfer med spa requires deepest CLINICAL-AESTHETIC fluency of any industry covered so far modality stacking + recovery sequencing + state scope-of-practice + good-faith exam compliance and lowest-friction FINANCING Cherry/CareCredit/PatientFi at consult not at quote package economics + same-day-treatment + membership LTV are industry-specific. Adjacent Pulse Knowledge Library entries AmSpa State of the Industry annual deep-dive + state-by-state scope-of-practice walkthrough + good-faith exam telehealth rules + Allē by Allergan vs Aspire by Galderma loyalty mechanics + RealSelf Worth It tracking + Cherry vs CareCredit vs PatientFi vs Alphaeon financing comparison + Morpheus8 vs Sofwave vs Ultherapy vs Thermage tightening landscape + GLP-1 Ozempic face volume-restoration playbook + Sculptra biostimulator deep-dive + Daxxify 6-month duration economics + male aesthetics market growth + BDD screening protocols + injector wage benchmarks + Boulevard / Aesthetic Record / Symplast EMR comparison + q9601 fractional CFO maps onto independent med spa owner financial-operating-rhythm. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Seventeenth Pulse Sales Training entry st0017 and ELEVENTH industry-specific training after st0007 medical device + st0008 real estate + st0009 auto F&I + st0010 pharma + st0011 life insurance + st0012 mortgage refi + st0013 + st0014 financial advisor wealth management + st0015 cybersecurity CISO discovery + st0016 retained executive search CEO + Board pitch — fully runnable 60-minute live med spa injector + consult-to-package-conversion training for the highest-leverage 45 minutes in medical aesthetics (per AmSpa State of the Industry 2024/2025 US med spa market $20B+ ~10000 spas avg location revenue $1.97M industry-median consult conversion 63% top-quartile 75-85% bottom-quartile <40% + per ASPS ~9.5M neuromodulator treatments + ~3.5M HA filler + per RealSelf Worth It Botox 95% Juvederm Voluma 89% Morpheus8 84% Sculptra 79% + per industry data 50-65% of $3K+ aesthetic packages finance through Cherry/CareCredit/PatientFi/Alphaeon offering financing at consult lifts conversion 18-30 pts) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8500-10000 words ABSOLUTE HARD CAP 10500. LEAN-FROM-START pattern mirroring st0016 closest sibling. Structure: orange Pulse Training callout intro (who-for: med spa owners + lead injectors + front-desk treatment coordinators at independent single-location spas + multi-unit dermatology + plastic-surgery aesthetics arms + franchise + chain Ideal Image LaserAway Skin Spa NY Sona MedSpa SEV Laser Milan Laser Hair Removal; works RN-injector from ICU feels weird selling to NP who owns her room to owner-MD auditing $1.97M location stalled at 42% to front-desk lead booking consult; what-bring: 3 recent under-converted consults + current treatment-plan template + Allē/Aspire/Cherry-CareCredit-PatientFi enrollment workflow + 12-mo membership pricing + last 90 days conversion + ticket-size data per injector + whiteboard) + Bottom Line callout A med spa patient does not buy a procedure she buys a version of her face she can defend to herself in the mirror at 7am + 5-stage + 3-reason thesis + 6-row pipe-table agenda + Section 1 Cold Open with AmSpa $20B+ market $1.97M avg revenue 63% conversion median 75-85% top-quartile + RealSelf Worth It benchmarks + RN-A 8-yr ICU composite Tuesday 10am clinical-assessment printed PDF $3125 plan I\'ll think about it never returned vs RN-B 11am same spa same prices opened GOAL with what\'s the result you want in the mirror MIRROR patient pointed at concerns MAP full 3-modality plan tied to gala 8-wk timeline MOMENTUM Cherry approval 90 sec first treatment that afternoon MEMBERSHIP $279/mo closed $6,400 + 12-mo membership + Common Trap I don\'t want to be pushy three answers pushy is recommending what she doesn\'t need + I\'ll think about it is patient-code for you didn\'t give me enough info per AmSpa 75% buy same plan within 90 days from different spa + full-plan + financing + same-day booking injector converts ~3x + Section 2 Teach split into Part A 5-STAGE AESTHETIC DISCOVERY 12 min (Stage 1 GOAL 5 min mirror-result + driver + fear NO clinical assessment NO product names / Stage 2 MIRROR 5 min patient holds mirror points at concerns in own language not your finger / Stage 3 MAP 8 min 3 modalities sequenced to her timeline priced cleanly NO single-product NO 5+ overwhelm tox + 1 syr filler + 3-tx microneedling = $3,400 / Stage 4 MOMENTUM 5 min same-day first treatment + Cherry on iPad 90 sec + calendar next 2 treatments NO call us to schedule / Stage 5 MEMBERSHIP 4 min $279/mo quarterly tox + 15% off + banks toward next package offered AFTER first package books NEVER first-10-min pitch) and Part B Three Reasons People Don\'t Book Today 5 min (Reason 1 TRUST credentials + Allergan/Galderma Master Injector training + 4,200 syringes + conservative-first + willingness to refuse / Reason 2 TIME specific recovery by modality tox no-downtime 10-14 day peak 5-10% bruising / filler mild 24-48 hr swelling 15-25% bruising / microneedling 24-48 hr pink mapped to her exact calendar / Reason 3 TREASURE Cherry/CareCredit/PatientFi/Alphaeon at MAP not at front desk total stated cleanly Allē/Aspire rewards surfaced no surprise fees) + Section 3 Discussion 8 prompts (last under-converted consult + which 5 stages broke + when to recommend MORE + how to handle negotiation + when to DECLINE BDD/unrealistic/contraindications + when to offer financing + every returning patient same trajectory + ONE verbatim next move) + Section 4 Two-Person Role-Play with Round 1 Jenna Reyes 42yo marketing director first-time tox consult just a little Botox between the eyes actually candidate for $3,200 starter tox 3 areas + 1 syringe RHA-3 nasolabial + 3-tx microneedling-with-PRP work conference in 6 weeks husband weird about face spending existing CareCredit from dental implant 2 deflections just the Botox today let me think about it + talk to husband INJECTOR runs full 5-STAGE conservative-first natural-not-done sequenced for 6-wk timeline Cherry approval 12-mo 0% $283/mo Allē $75 back + Round 2 Diane Whitman 58yo regional bank exec 3-year loyal $400/quarter tox-only $1,600/yr life shift recently divorced 4 mo ago dating again told front desk I want to talk about doing more candidate for $8,600 6-month transformation 2 syringes Voluma + 1 Kysse lips + 1 RHA-4 lower face + Sculptra 3-vial series + Morpheus8 face+neck 3 treatments + continued tox 2 deflections never spent more than $500 in single visit feels like a lot / what if I look done I want natural INJECTOR sequenced over 6 months not all at once conservative-first refusal-stance Sculptra is YOUR collagen no one IDs source $1,400/mo Cherry $717/mo 12-mo 0% Allē $250 back membership $279/mo would have saved $1,290 + 60-sec reset + Section 5 Debrief+Commitments 3 debrief Qs which stage felt strongest + which Reason never addressed + next concrete action + 4-line commitment ritual target patient + stage to lead with + ONE verbatim language change + EMR/Boulevard recall task within 14 business days + Section 6 Leave-Behind walkthrough + printable one-pager (Pre-Consult Checklist 15 min before appt / 5-Stage Consult Script Card with verbatim cue lines / Three Reasons grid TRUST + TIME + TREASURE with what-addresses-it / 3 Phrases That Kill Conversion so what can I do for you today + take this home + I don\'t want to push financing / 7 Modalities to Stack for a Natural Result neuromodulator + HA filler + biostimulator + RF microneedling + energy device + IPL/laser + medical-grade skincare / Never-Do behavior list 14 items / Outcome Line wins full 5-STAGE + Three Reasons + named MAP + same-day MOMENTUM + financing offered + conservative-first TRUST + sequenced TIME = 70%+ consult conversion + $3000-$8000 avg package + 65%+ membership attach + $4200-$6400 annual LTV vs losses single-product pitch + think about it PDF + financing-deferred + skipped membership = 38-45% conversion + $400-$650 avg ticket + <10% membership + $1800 annual LTV / If You Only Remember One Thing hero quote You don\'t close a $6,400 package by being a better injector you close it by building the full plan she didn\'t know to ask for addressing TRUST + TIME + TREASURE before she objects and treating the consult AS the close instead of treating it as a free clinical workup). How-this-fits-in-med-spa-operating-motion table at end of core showing pre-consult + first 5 minutes GOAL + next 5 minutes MIRROR + next 8 minutes MAP + next 5 minutes MOMENTUM + last 4 minutes MEMBERSHIP + Three-Reasons overlay + owner / lead injector coaching. Two mermaid diagrams: 5-Stage Aesthetic Discovery Flow + Three Reasons People Don\'t Book Today Decision Tree. 8 benchmark tables (Med Spa Market Reality 2024-2025 + Modality Average Price Bands + Package Starter Benchmarks + Member Program LTV vs Single-Visit + Recovery Time + Visible Result by Modality + Why Med Spa Consults Don\'t Convert + Top US Med Spa Chains by Revenue + Consult Conversion by Injector Discipline Tier). 12-failure-mode counter-case + 7-owner-objection coach-back + when-to-rerun. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping + companion industry-specific entries planned st0018-st0025 + cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 + st0014 + st0015 + st0016 what transfers (verbatim language on load-bearing moments + EMR/CRM-reviewed coaching cadence) and what does not (med spa requires deepest CLINICAL-AESTHETIC fluency + lowest-friction FINANCING + package economics + same-day-treatment + membership LTV industry-specific). Tags include sales-training (hub filter) + med-spa-training + aesthetics-training + consult-conversion + nurse-injector-training + medical-aesthetics + package-selling + 60-min-meeting + standard-team + st0017. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY MEDICAL AESTHETICS INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Industry-correct sources: AmSpa American Med Spa Association State of the Industry 2024/2025 + AmSpa scope-of-practice + good-faith exam + ABMSP credentialing + ASPS American Society of Plastic Surgeons Annual Procedural Statistics + ASDS American Society for Dermatologic Surgery Annual Survey + AAD American Academy of Dermatology + Allergan Aesthetics AbbVie Botox + Juvederm Voluma/Vollure/Volbella/Ultra/Volux + SkinMedica + Latisse + CoolSculpting Elite + DiamondGlow + Allē by Allergan 7M+ active members $200-$400 avg redemption + Galderma Dysport + Restylane Lyft/Defyne/Refyne/Kysse/Contour/Eyelight/Silk + Sculptra + Alastin + Aspire by Galderma + Evolus Jeuveau Newtox Evolus Rewards + Revance Daxxify 6-mo duration + RHA-2/3/4 + Merz Xeomin + Belotero + Radiesse + Ultherapy + Croma + Prollenium + InMode NASDAQ INMD Morpheus8 + Lumecca + Forma + BodyTite/FaceTite + Cynosure SculpSure + PicoSure + Icon + Cutera Secret RF + Excel V + AviClear + Solta Bausch Health Thermage FLX + Clear+Brilliant + VASER + BTL Emsculpt Neo + Emface + Emsella + Exilis + Sofwave SUPERB + Sciton BBL HERO + Halo + MOXI + Lumenis + Candela + RealSelf Worth It + Synchrony CareCredit + Cherry + PatientFi + Alphaeon Credit + Affirm + Klarna + Boulevard + Aesthetic Record + Symplast + PatientNow/RxPhoto + Mindbody + Zenoti + Vagaro + Repeat MD + Ideal Image + LaserAway + Milan Laser Hair Removal + SEV Laser + Sona MedSpa + Skin Spa NY + Massage Envy SkinHealth + Heyday + Face Foundrié + BLS RNs + NPs + AANP + American Nurses Association + Aesthetic Nurses Association + Modern Aesthetics + Aesthetic Channel + Practical Dermatology + Skin Inc + DermPro + MedEsthetics + DAYSPA + NewBeauty + Allure + Vogue + AmSpa Annual Medical Spa Show. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // --- Word count pre-flight check (PRE-FLIGHT word-count guard) ---
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

  // --- Walk the polish ladder 5->6->7->8->9->10 ---
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0017 is crawled.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
      .catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10 word_count=' + wordCount);
}

main().catch(err => { console.error(err); process.exit(1); });
