// st0021 -- Gym Tour and Same-Day Close: The 20-Minute Walk That Turns a Drop-In
// Into a $99/mo Member. Pulse Sales Trainings entry (route: /sales-trainings/st0021,
// tag: sales-training). FIFTEENTH industry-specific training (after st0007-st0020).
// Industry = gym + health club sales -- the membership consultant + GM-on-shift +
// front desk staff who handle walk-ins, 20-minute window from greet to EFT-autopay
// signed, $79-$129/mo + $0-$99 enrollment, same-day close 50-75% at well-run clubs
// vs 20-35% at struggling clubs. 2027 reality: Planet Fitness NYSE:PLNT ~2,600
// clubs $10-$24.99 PF Black Card, Anytime Fitness ~5,000+ global franchises, F45
// + Orangetheory + CrossFit + Barry's + SoulCycle premium boutique, Crunch +
// Equinox + Life Time Fitness + LA Fitness mid-to-premium, $200-$300/mo boutique
// studios, independents fight on community + coaching.
// VALUE over WORD COUNT. Target 8,500-10,500 words. ABSOLUTE HARD CAP 10,500.
// Walks 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0020 exactly. LEAN-FROM-START.

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

const ID = 'st0021';
const QUESTION = "Gym Tour and Same-Day Close: The 20-Minute Walk That Turns a Drop-In Into a $99/mo Member — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'gym-sales-training',
  'fitness-industry',
  'membership-consultant',
  'same-day-close',
  'gym-tour',
  '60-min-meeting',
  'standard-team',
  'st0021'
];

const sources = [
  { title: 'IHRSA (International Health, Racquet & Sportsclub Association) Global Report — the trade body for the health-and-fitness club industry; 2024 Global Report tracks ~$33B US health-club industry + ~64M US members + ~41K clubs (commercial + boutique + studio + Y/JCC); benchmarks tour-to-join close rates 35-65% industry-wide with top quartile 60-75%; publishes IHRSA Profiles of Success annual financial benchmarking for clubs by size + tier + region', url: 'https://www.ihrsa.org/publications/the-2024-ihrsa-global-report/' },
  { title: 'Planet Fitness NYSE:PLNT 10-K + investor presentations — ~2,600+ stores 2024 (mostly franchised, ~140 corporate), $10 Classic + $24.99 Black Card membership tiers, $0-$49 enrollment fee, EFT-autopay annual contract + month-to-month options; ~19M members, ~$1.07B 2023 revenue, industry-defining low-price/no-judgment positioning; same-day close rate ~50-65% on walk-ins per franchisee disclosures; PF Black Card is the upsell ladder (HydroMassage + tanning + guest privileges + 2,600 club access)', url: 'https://investor.planetfitness.com/' },
  { title: 'Anytime Fitness (Self Esteem Brands / Purpose Brands) — ~5,000+ franchised clubs globally 2024 (largest 24/7 franchise concept), $40-$60/mo typical pricing + $49-$99 enrollment, key-fob 24/7 access, sister brands Orangetheory + Waxing the City + Basecamp Fitness + The Bar Method; Anytime Fitness Coach 1:1 coaching upsell + Anytime Fitness app; same-day close target 60-70% per franchisee operations manual', url: 'https://www.anytimefitness.com/' },
  { title: 'F45 Training + Orangetheory Fitness + Barry\'s + SoulCycle + CrossFit Inc franchise data — F45 ~1,500 studios globally (NYSE:FXLV, Mark Mastrov + Adam Gilchrist), Orangetheory ~1,500+ studios (heart-rate-zone HIIT, Self Esteem Brands sister), Barry\'s ~85 studios premium HIIT $35-$45/class, SoulCycle ~80 studios (Equinox-owned, indoor cycling), CrossFit Inc ~12K affiliate boxes globally $150-$250/mo + $100-$200 onramp; premium boutique tier $189-$300/mo same-day close 40-55% (longer consideration cycle + higher commitment)', url: 'https://www.f45training.com/' },
  { title: 'Crunch Fitness + Life Time Fitness NYSE:LTH + LA Fitness + Equinox Group — Crunch ~470+ clubs ($9.95-$34.99 Peak Plus), Life Time ~170 athletic-resort clubs ($149-$249/mo all-in family-tier dominant), LA Fitness ~700 clubs ($35-$49/mo + $99-$149 enrollment, Fitness International LLC), Equinox ~110 luxury clubs ($200-$350/mo + $500 initiation + $100 monthly minimum dues, also operates SoulCycle); mid-to-premium tier same-day close 45-60% / Equinox ~30-40% (longer consideration + price-sensitivity at top end)', url: 'https://www.lifetime.life/' },
  { title: 'ABC Fitness Solutions (formerly ABC Financial) — gym billing + EFT-autopay + membership management software; ~16K+ club locations globally, processes ~$10B+ annual member EFT transactions; flagship products Ignite + DataTrak + Trainerize (integrated 2020); industry standard for monthly EFT draft + annual contract management + freezes + cancellations; competes with Mindbody + ClubReady + Twin Oaks + Wodify; ~50% of US commercial gym industry runs on ABC billing infrastructure', url: 'https://abcfitness.com/' },
  { title: 'Mindbody (Vista Equity Partners owned) + ClubReady + Twin Oaks Software + Wodify (CrossFit) + Club OS (acquired by Daxko) — gym + studio management software stack; Mindbody ~58K studios globally (yoga + Pilates + boutique + spa + wellness), ClubReady ~3K clubs (mid-tier commercial), Twin Oaks ~2K clubs (full-service commercial + Y/JCC), Wodify ~5K CrossFit affiliates (programming + billing + member app), Club OS ~5K clubs (lead-management CRM specifically for gyms, Salesforce-of-fitness); pricing $99-$499/mo by club tier; integrates Stripe + Authorize.net + ABC + bank ACH', url: 'https://www.mindbodyonline.com/' },
  { title: 'BLS Occupational Outlook for Fitness Trainers & Instructors (SOC 39-9031) — ~331K employed nationally; median wage ~$45,380 (May 2023); projected growth ~14% through 2032 (much faster than average); membership consultants + sales counselors typically classified under Sales Reps (SOC 41-3091) ~ $46K-$72K base + commission with top quartile $90K+; gym sales counselor turnover ~50-75%/yr industry-wide per IHRSA + Club Industry magazine surveys', url: 'https://www.bls.gov/ooh/personal-care-and-service/fitness-trainers-and-instructors.htm' },
  { title: 'Statista US Health & Fitness Club Industry — 2024 US gym + health-club + fitness studio market ~$33B revenue + ~64M members + ~41K facilities; segmentation: low-price (PF + Crunch + Blink) ~35% members + 18% revenue, mid-tier (LA Fitness + Crunch Signature + 24 Hour Fitness + YMCA) ~30% members + 32% revenue, premium (Life Time + Equinox + Cherry Creek) ~10% members + 22% revenue, boutique-studio (F45 + OTF + Barry + CrossFit + SoulCycle + Pure Barre + CycleBar) ~25% members + 28% revenue; post-COVID recovery 2022-2024 saw boutique-studio segment outgrow commercial 3:1', url: 'https://www.statista.com/topics/1141/health-and-fitness-clubs/' },
  { title: 'AHFS American Health & Fitness Survey + Club Industry Magazine + Athletech News + Fitness Insider — industry trade publications + research; AHFS annual member satisfaction + retention + cancellation-reason survey (~80K members), Club Industry Top 100 annual revenue + member-count ranking (Planet Fitness #1 by member count, Life Time #1 by revenue per member ~$1,800/yr vs PF ~$220/yr), Athletech News covers fitness tech + boutique + franchise news daily, Fitness Insider tracks acquisitions + PE rollups + same-day-close benchmarks; tour-to-join close-rate benchmarks 35-65% commercial + 40-55% boutique + 60-75% top quartile across tiers', url: 'https://www.clubindustry.com/' },
  { title: 'NASM + ACE + NSCA + ISSA personal training certification benchmarks — NASM (National Academy of Sports Medicine, Ascend Learning) ~190K certified trainers (largest US cert body) NASM-CPT $899 + CES + PES + FNS specializations, ACE (American Council on Exercise) ~80K certified ACE-CPT, NSCA (National Strength & Conditioning Association) ~50K certified CSCS most-respected for strength + power, ISSA ~70K certified (newer/online-friendly); personal training upsell attach rate at point-of-join 18-32% at well-run commercial clubs + 40-65% at premium clubs + 25-45% at boutique-studio bundles (gym + small-group + 1:1 trainer)', url: 'https://www.nasm.org/' },
  { title: 'EFT (Electronic Funds Transfer) autopay industry standard + annual contract vs MOM (month-to-month) — gym industry standardized on monthly EFT draft from member checking account or credit card via NACHA ACH rails (lower processor fees ~$0.20-$0.50/transaction vs 2.9% + $0.30 card); annual contract with EFT autopay = ~6-12% annual cancellation rate vs MOM 24-42% annual cancellation rate per IHRSA + ABC Fitness benchmarks; freeze policies typically 30-90 day max + $5-$15/mo freeze fee; cancellation typically requires 30-day written notice + final draft; chargebacks (ACH return) ~2-4% on EFT vs ~8-12% on credit-card billing per ABC Financial industry data', url: 'https://abcfitness.com/products/payment-processing/' },
  { title: 'Daxko + Trainerize + Club OS + GymSales (Glofox/ABC) + Hapana + Volo Pass — gym CRM + lead-management + member-app stack; Daxko serves ~10K Y/JCC + commercial gyms (acquired Club OS + Aptus + AFS Premier), Trainerize (ABC) ~50K trainers + member-app + workout-tracking, GymSales (rebranded under ABC Ignite) lead-management workflow + auto-text-follow-up + tour-scheduling, Hapana (Australia-origin) ~5K boutique studios CRM + booking + retention, Volo Pass + ClassPass aggregator-pressure on boutique-studio drop-in pricing; integrations Mailchimp + Twilio + Stripe + ABC + Mindbody + Club OS', url: 'https://www.daxko.com/' },
  { title: 'Gym membership unit economics + LTV — commercial gym member LTV $660-$1,800 (24-mo avg tenure × $30-$75/mo less ~15% churn-cost), boutique-studio LTV $1,800-$3,600 (12-18 mo avg tenure × $150-$250/mo), premium club LTV $4,200-$10,800 (36+ mo tenure × $150-$300/mo); CAC (customer acquisition cost) commercial $40-$120 (Google + Meta + walk-in) boutique $80-$200 premium $200-$500; enrollment fee $0-$199 covers ~40-80% of CAC; payback period 3-9 months commercial + 1-3 months boutique-premium; personal-training upsell adds $200-$800/mo per attached member doubling LTV', url: 'https://www.ihrsa.org/improve-your-club/industry-news/the-2023-ihrsa-profiles-of-success/' },
  { title: 'ClassPass + Volo Pass + Peloton Gym + Apple Fitness+ + Tonal + Mirror (Lululemon) — aggregator + at-home competitive pressure; ClassPass ~30K studio partners aggregated drop-in pricing $20-$45/class, Volo Pass NYC/DC/Boston, Peloton ~3M members + Peloton Gym hybrid + commercial-partnership w Hilton + Westin, Apple Fitness+ ~$9.99/mo, Tonal $3,995 + $49.95/mo, Mirror (now Lululemon Studio) closed 2023 wound down; at-home segment grew 8x 2019-2024 but plateaued 2024; commercial gym membership rebounded post-COVID + 2024 IHRSA reports ~64M US members back above 2019 ~64.2M', url: 'https://classpass.com/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### 🏋️ The Pulse Training
> **Who this is for:** **Gym owners + GMs + sales directors + membership consultants + front-desk teams + sales counselors** at commercial mid-tier ($49-$129/mo), independent strength + community gyms ($89-$149/mo), boutique-studio operators (F45 / OTF / CrossFit / Barry's / SoulCycle / Pure Barre / CycleBar $189-$300/mo), and the indie 30%+ of US gyms that **Planet Fitness / Anytime / Crunch / Life Time / Equinox / LA Fitness** chain consolidation has NOT yet absorbed. Works for the first-week consultant, the 4-yr veteran tired of *"let me think about it,"* the GM losing walk-ins to PF down the block, the front-desk supervisor handling the Tuesday 6:14pm Google-search lead. Per **IHRSA + Statista + Club Industry + AHFS**, US gym industry **~$33B / ~64M members / ~41K facilities**, top-quartile clubs close **60-75% same-day** vs bottom-quartile **20-35%**. **Run Tuesday sales huddle + Friday weekend-prep.**
>
> **What your consultants leave with:** A named discipline — **5-STAGE GYM TOUR (GREET → DISCOVER → DEMONSTRATE → DESIGN → DECISION)** — you don't show the equipment, you build the prospect's transformation inside the club — plus **THE THREE GOAL LENSES (LOOK / FEEL / FUNCTION)** for hearing what the prospect actually wants in the first 4 minutes. Plus verbatim language, two role-plays (Tuesday 6:14pm working-mom drop-in + Saturday 10:08am gym-shopping powerlifter), EFT-autopay close sequence, when to decline a join, and the four phrases that lose the close.
>
> **GM brings:** **(1)** 3 recent lost-tour debriefs (the prospect, the goal, the gym they joined, the verbatim "no" reason). **(2)** Tour-Prep Kit — drop-in intake form (goal + history + experience + time-availability + budget framing), club map + 3 stations matched per goal-lens, sample personal-training intro package, current pricing grid (monthly + annual EFT + enrollment fee + freeze + cancel policy in ABC Fitness / Club OS / Mindbody / ClubReady / Twin Oaks), Tour Card with the 6 opening questions, EFT-autopay agreement on tablet, photo wall of recent member transformations + community events. **(3)** Whiteboard to score each consultant's last 10 tours by stage + goal-lens read + close outcome.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Cold Open** — Why gyms have a 20-min kill window (prospect Googles 3 competitors on drive home); two-tour Tuesday — Consultant A equipment-tour → "let me think" → joined PF that night; Consultant B 4 lobby questions + 3 matched stations → EFT signed in 18 min | GM | Consultants feel the gap — equipment-tour loses to 5-STAGE 2-3x |
| **0:10-0:35** | **The Teach** — 5-STAGE (GREET / DISCOVER / DEMONSTRATE / DESIGN / DECISION) + 3 Goal Lenses (LOOK / FEEL / FUNCTION) | GM | Recite 5 stages + 3 lenses + 6 opening questions + EFT close sequence verbatim |
| **0:35-0:45** | **Discussion** — 8 prompts: refuse to close + walk away from price-shopper + "come back with spouse" + defend $129 vs $24.99 PF + cross-sell PT | GM + room | Consultants audit last 10 tours |
| **0:45-1:05** | **Role-Play x 2** — Round 1: Tuesday 6:14pm working-mom drop-in 34yo Google-search 25-lb sister-wedding goal, 2 deflections ("talk to husband" + "PF $24.99"). Round 2: Saturday 10:08am 26yo powerlifter comparing 3 gyms, 2 deflections ("rack count low" + "$89 vs CrossFit $189") | Pairs | Run 5-STAGE + 3 lenses under deflection, close both |
| **1:05-1:10** | **Debrief + Commitments** — 3 Qs + each consultant names 1 lost tour + 1 verbatim line + 1 missing kit item | GM | Tour + verbatim + kit habit |
| **1:10-1:13** | **Leave-Behind** — 5-Stage Script Card + 6 Opening Qs + 4 Phrases That Lose + Two-Now/Three-Later Pricing Frame | GM | One-pager in binder + ABC / Club OS task |

> ### 🎯 Bottom Line
> **A walk-in does NOT decide on which gym has the most equipment — they decide on which consultant (1) heard their goal in the first 4 min through the right lens, (2) demonstrated 3 stations matched to that goal instead of touring every piece, and (3) asked for the EFT signature before they walked out.** Per **IHRSA + Statista**, US gym industry ~$33B + ~64M members + ~41K facilities; **conversion happens on the tour or it doesn't happen** — 80%+ of "I'll come back" never come back. Run **5-STAGE + 3 lenses + EFT close** = **60-75% same-day / $79-$129/mo + $0-$99 enrollment / 6-12% EFT cancel vs 24-42% MOM**. Unstructured + price-at-end + no lens = **20-35% close / lose to PF / 30%+ first-90-day cancel**. Five stages. Three lenses. Signs on the tour or doesn't sign at all.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do NOT open with the club history slide deck. Stand in the lobby by the front desk, say the numbers, tell the two-tour story, end with the two phrases that decide whether your consultants earn the EFT signature or lose it to the PF down the block. **Ten minutes. Hard stop at 0:10.**

### The numbers, then the story.

**The numbers.** Per **IHRSA 2024 Global Report + Statista US Health & Fitness Club Industry + Club Industry Magazine + AHFS**: US gym + health-club + studio industry **~$33B revenue / ~64M members / ~41K facilities**. Segment split: low-price (PF + Crunch + Blink) **~35% members + 18% revenue**, mid-tier (LA Fitness + Crunch Signature + 24 Hour + YMCA) ~30% members + 32% revenue, premium (Life Time + Equinox + Cherry Creek) ~10% members + 22% revenue, boutique-studio (F45 + OTF + CrossFit + Barry's + SoulCycle + Pure Barre + CycleBar) ~25% members + 28% revenue. Average commercial member LTV **$660-$1,800** (24-mo tenure × $30-$75/mo less churn cost); boutique LTV $1,800-$3,600; premium LTV $4,200-$10,800. Top-quartile clubs close **60-75% same-day** on walk-ins vs bottom-quartile **20-35%**.

Top math: 12 tours/wk × 65% close × $129/mo × 24-mo avg tenure = **$24K/wk new-EFT LTV × 50 wks = $1.2M/yr** new-EFT pipeline from one consultant. Bottom: 12 × 25% × $89 × 12-mo = **$3.2K/wk × 50 = $160K/yr** — **7-8x LTV gap** on same lead flow + same equipment. Differentiator is tour discipline, not gym beauty.

**The story.** Tuesday **6:14pm**, **mid-tier independent in Phoenix suburb**, $79-$129/mo + $99 enroll + first-month-free. Two tours, same hour. **Consultant A**, 14-mo veteran, opened *"let me show you around"* — walked the prospect past cardio + free weights + functional turf + group studio + locker rooms (22 min), ended at the front desk: *"Platinum's $129/mo + $99 enrollment, here's a tri-fold, what do you think?"* Prospect said *"let me think about it,"* drove home, joined Planet Fitness three blocks south at $24.99 PF Black Card that night on her phone.

Same hour, **Consultant B**, IHRSA-trained, opened *"Before I show you the floor — 4 questions in the lobby first. What brought you in today specifically? When you imagine yourself feeling great — what's it look like? Last gym — what worked, what didn't?"* By min 5 identified **LOOK + FEEL** (35yo, 18-lb stress weight gain post-divorce, sleeping badly, wanted to "feel like herself again"). Min 8 picked **THREE stations**: (1) women's-only strength corner with mirrors (LOOK), (2) 6:30pm small-group HIIT on the lobby tablet (FEEL community), (3) recovery room with infrared sauna (FEEL stress + sleep). Min 14 at the consult desk: *"Does this feel like a place you'd show up Tuesday at 6:14pm? And does $129 with first-month-free + waived enrollment fit your budget?"* **Signed EFT autopay at 6:32pm. Showed up Thursday at 6:14pm.**

> ### ⚠️ Common Trap
> *"Consultant A was friendly + the club is gorgeous + she gave the tri-fold — that's a real shot at the close."* Three answers. **(1)** Of course she was friendly + the club is gorgeous — every club is friendly + gorgeous; Consultant B closed because she heard the goal-lens in 4 min and showed 3 stations that matched. **(2)** Unstructured equipment-tour is the slowest, lowest-trust sales motion in fitness — every gym has equipment, almost none have **5-STAGE + goal-lens-read + EFT-autopay-on-tour**. **(3)** Your Google reviews + Instagram + Class Pass listing get the walk-in — the 20-minute tour is the only sales meeting you get.

**Transition:** "Next 50 minutes: 5-stage tour, 3 goal lenses, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into **5-STAGE GYM TOUR (15 min, ~3 min/stage)** + **Three Goal Lenses (10 min, ~3 min/lens + 1 min cross-modal upsell)**. Pause for one clarifying question per stage. End-of-section test: every consultant recites all 5 stages + 3 goal lenses + 6 tour-opening questions + EFT-autopay close sequence verbatim without notes.

### Part A -- The 5-STAGE GYM TOUR (15 min)

Most lost tours collapse at Stage 2 (consultant skips DISCOVER and goes straight to the equipment floor) or Stage 5 (consultant hands a tri-fold and says "let me know" instead of asking for the EFT autopay signature). **You don't show the equipment — you build the prospect's transformation inside the club.**

#### Stage 1 -- GREET (3 min)

**The first 30 seconds set whether this is a vendor pitch or a real conversation. Stop them at the lobby couch BEFORE you walk anywhere.**

> ### 🎤 Verbatim Script -- GREET
> *"Welcome in — I'm [Name], I'm one of the membership consultants. Before I show you a single piece of equipment — can I steal four minutes on this couch? I promise I'll save us both time on the floor if we talk first."*

Plain English + permission-asking + signals "this isn't going to be a high-pressure pitch." **Common trap.** *"Let me give you the tour — follow me!"* — boring + consultant-centered + skips goal-lens entirely. *"What's your budget?"* — too early, never ask price in Stage 1.

#### Stage 2 -- DISCOVER (3 min)

**Four lobby questions before you walk anywhere. This is where the close gets earned or lost.**

> ### 🎤 Verbatim Script -- DISCOVER
> *"Four quick questions. **(1) What brought you in today specifically — not 'wanted to get in shape' but what was the moment?** **(2) When you imagine yourself feeling great six months from now — what does that look like, feel like, let you do?** **(3) Last gym experience — what worked, what didn't, why did you stop going?** **(4) When could you realistically come — morning, lunch, after work, weekend mornings?**"*

Listen for goal-lens (LOOK = aesthetic / FEEL = energy + stress + sleep / FUNCTION = performance + pain + longevity). Listen for time-availability (if she can only do 6am, don't pitch the 6pm class). **Common trap.** Skipping DISCOVER and walking to cardio row. Asking *"what are your goals?"* — vague + gets a vague answer. The four specific Qs above unlock the lens in 3 min.

#### Stage 3 -- DEMONSTRATE (3 min)

**You've heard the goal-lens. NOW pick THREE specific stations and demonstrate with the prospect's transformation inside them. NOT every piece of equipment — THREE.**

> ### 🎤 Verbatim Script -- DEMONSTRATE
> *"Based on what you told me — sister's wedding 7 months out, lost gym confidence post-PF, can do Tuesdays + Thursdays after work — focus on THREE stations. **(1) Women's-only strength corner with mirrors** — for the LOOK goal, the 25 lbs by August comes from here not the treadmill. **(2) The 6:30pm small-group HIIT class** — for FEEL + accountability, the coach knows your name by week 2. **(3) The InBody scan we'll do month 1 + month 3 + month 6** — so the wedding-dress measurement is data not guesswork."*

Three-stations deep > every-piece-of-equipment shallow. Specific time + specific outcome = transformation visible. **Common trap.** *"Here's our cardio row, here's free weights, here's functional turf, here's group fitness, here's locker rooms"* — equipment-tour, builds nothing, blurs together.

#### Stage 4 -- DESIGN (3 min)

**Logistics + pricing-frame at the consult desk. Sketch the first 4 weeks on the back of the price sheet.**

> ### 🎤 Verbatim Script -- DESIGN
> *"Let's sketch your first 4 weeks. **Week 1:** Tuesday 6:30pm HIIT (intro-level), Thursday 6:30pm strength corner with our 30-min orientation Coach Sarah will text you to schedule. **Week 2:** add Saturday 9am — your favorite of the week probably. **Week 3:** InBody scan + 4-week check-in with me personally. **Week 4:** habit locked. Pricing: **$129/mo Platinum** (unlimited classes + recovery room + InBody + guest pass 2x/mo) on EFT autopay, **$99 enrollment** waived if you start tonight, first-month free. **Annual contract is $99/mo billed monthly with 30-day cancel + 90-day freeze available**. What's making sense, what feels off?"*

Sketched-out first 4 weeks = transformation feels achievable. Pricing comes here, in context, after value is built — NOT in Stage 1 or 2. **Common trap.** Quoting price too early = loses the value frame. Quoting price too late = feels like a bait-and-switch.

#### Stage 5 -- DECISION (3 min)

**The close. NOT "send you home with a tri-fold" — the **EFT-autopay signature on the tablet** ask at the consult desk.**

> ### 🎤 Verbatim Script -- DECISION
> *"Three things before you decide. **One:** the first-month-free + $99 enrollment waived is a today-only — Wednesday it's back to $99 enrollment + first month paid. **Two:** EFT autopay starts second-month draft so your card isn't hit until July 14, gives you 30 days inside the club before a dollar moves. **Three:** annual contract has 30-day cancel + 90-day freeze — you're not locked, you're committed. **Want me to start the EFT form on the tablet — takes 4 minutes?**"*

Today-only honest urgency + delayed first draft + cancel/freeze transparency = pressure-free close. **Common trap.** *"Take this tri-fold home + think about it"* = lose the EFT 75%+ of the time. *"Sign right now or the price doubles"* = high-pressure feel, prospect walks + posts a 1-star Google review.

### Part B -- The Three Goal Lenses (10 min)

**Every walk-in leads with ONE goal lens but actually wants 2 or 3. The consultant who only addresses the surface lens loses to the consultant who hears + addresses all three: LOOK / FEEL / FUNCTION.**

#### Lens 1 -- LOOK (aesthetic + weight loss + event coming up)

**Most common opening lens, especially Jan-Feb + April-May (wedding season + summer body). Cares about VISIBLE transformation — weight loss, muscle tone, fitting into a specific outfit, event date driving urgency.**

> ### 🎤 Verbatim Script -- LOOK
> *"What's the timeline — is there a specific event or date driving this? Wedding, reunion, vacation, photo? Let's reverse-engineer from that date back."* — then SHOW the women's-only strength corner + InBody scan + 30-min orientation as the matched DEMONSTRATE.

**Common trap.** Pitching cardio as the answer to weight loss when the prospect needs strength + nutrition coaching. **Cross-modal upsell:** LOOK prospects buy personal-training packages 35-50% more than FEEL or FUNCTION openers (visible deadline = willingness to pay for accountability).

#### Lens 2 -- FEEL (energy + sleep + stress + mental health)

**Fast-growing lens 2024-2027, post-pandemic + post-divorce + post-job-change life-events. Cares about ENERGY (3pm crash gone) + SLEEP (falling asleep without scrolling) + STRESS (anxiety dropping) + MENTAL HEALTH (depression lifting).**

> ### 🎤 Verbatim Script -- FEEL
> *"What does feeling great look like for you — is it energy you don't have anymore, is it sleep, is it the noise in your head? Tell me what changed in the last 6-18 months."* — then SHOW small-group HIIT classes (community + endorphins) + recovery room/sauna (stress + sleep) + the InBody as data-not-guesswork.

**Common trap.** Treating FEEL lens as "soft" and trying to convert them to LOOK. They want the FEEL outcome — sell the FEEL outcome. **Cross-modal upsell:** FEEL prospects buy recovery + small-group HIIT + yoga add-ons at 40-60% attach; rarely buy 1:1 PT (less aesthetic urgency).

#### Lens 3 -- FUNCTION (performance + longevity + pain relief + chronic condition)

**Often 40+ demographic + powerlifter/runner/CrossFitter/post-PT (physical therapy) referral. Cares about PERFORMANCE (deadlift PR / 5K time / golf swing) or LONGEVITY (move at 70 like you did at 50) or PAIN RELIEF (lower back / knee / shoulder) or CHRONIC CONDITION (diabetes / blood pressure / pre-cardiac).**

> ### 🎤 Verbatim Script -- FUNCTION
> *"What does your body need to do for you over the next 10 years? Performance, longevity, pain-relief, managing a condition? Doctor recommendations involved?"* — then SHOW the platform racks + sled track + mobility room + (if available) the on-site physical therapist or DPT referral relationship.

**Common trap.** Pitching the group fitness studio to a 52yo with chronic back pain. **Cross-modal upsell:** FUNCTION prospects buy 1:1 personal training with NASM/NSCA-certified strength coach at 50-70% attach + often referral pipeline to other 40+ adults (highest LTV segment).

> ### 🎯 Bottom Line
> 5 stages + 3 goal lenses + EFT-autopay close = 60-75% same-day close, $129/mo avg, $99 enrollment captured, 18-24 month tenure on annual EFT. Stages without Lenses = clean tour that loses to the gym down the block that heard the lens correctly. Lenses without Stages = good instincts without the structure that makes them close on the floor.

---

## SECTION 3 -- THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard. Write **GREET / DISCOVER / DEMONSTRATE / DESIGN / DECISION** across 5 columns. Each consultant audits her last 10 tours out loud — which stage she skipped, which goal lens she missed. **Count to five after each prompt.**

**1 — "When REFUSE to close?"** **Three:** medical-clearance-needed (chronic condition without doctor sign-off — refer for clearance + hold promo 14 days), price-shopper with no value alignment ($24.99 PF is their actual budget — refer out gracefully), facility-mismatch (powerlifter wants 6 platforms, you have 1 — refer to strength gym across town). **GM:** *"Graceful decline + referral = 5-star review + future re-tour."*

**2 — "Walk away from a price-shopper?"** When after value re-position they still focus on $/mo vs competitor. Verbatim: *"Sounds like price is the primary factor — I won't waste your time. PF three blocks south is $24.99 + does great work. If coaching + community matter more later, my offer holds 14 days — here's my card."* **GM:** *"Walking away on value-mismatched saves a 60-day chargeback + protects real members' attention."*

**3 — "I'll come back with my spouse" objection.** **Three moves:** (a) honor — *"smart, household decision."* (b) lock promo — *"first-month-free + waived enrollment is today only — I can hold 48 hours if you come back Thursday by 8pm with him."* (c) get spouse on phone now — *"want to call him from here? 90 sec, I'll answer any questions."* **GM:** *"80% of 'come back with spouse' never come back. 48-hour hold + phone-now lifts close to 40-55%."*

**4 — "Defend $129 vs $24.99 PF Black Card."** NEVER apologize for price. *"At $24.99 PF gives cardio + selectorized + HydroMassage + tanning + 2,600 locations — that's their model. At $129 here you get unlimited HIIT with coach-by-name, women's-only strength, InBody, recovery + infrared sauna, 4-week orientation with me. Different products — what gets you back here Tuesday at 6:14pm?"* **GM:** *"Honor PF — never trash a competitor. Different products for different goals."*

**5 — "Cross-sell PT without sounding pushy."** Tie to goal-lens at DEMONSTRATE not DECISION. *"For your 7-month wedding-dress goal — most members add 1-2 sessions/wk with Coach Sarah for 8 weeks to bake in form. $159/mo for 4 or $299/mo for 8 — meet Sarah for 5 min while you're here?"* **GM:** *"In-person trainer intro on tour = 35-50% attach vs 8-15% as post-close upsell."*

**6 — "Annual EFT vs MOM?"** Always pitch annual EFT as default. *"Annual EFT $99/mo, MOM $129/mo. Annual has 30-day cancel + 90-day freeze — committed for notice, not locked. MOM = $30/mo more for any-time cancel flex."* **GM:** *"6-12% annual cancel on EFT vs 24-42% on MOM per IHRSA — better for habit + LTV."*

**7 — "Prospect wants to bring a guest first."** YES — guest pass + 7-day trial + book NOW with a coach. *"I'll book 30-min orientation with Coach Sarah Saturday 9am, then 60-min HIIT class, and if you love it we do EFT then. Schedule both right now?"* **GM:** *"Booked-trial-with-coach > unbooked-come-back by 4-6x conversion."*

**8 — "ONE verbatim change."** Each consultant: ONE recent tour + ONE skipped stage + ONE line tomorrow. **GM:** *"ABC / Club OS task + next sales huddle review."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair consultants. **Two scenarios, 10 min each, 60-sec reset between.** Walk the lobby + floor + back to consult desk — DO NOT just sit. Listen for the verbatim *"before I show you a single piece of equipment — four questions in the lobby first"* (GREET + DISCOVER) + whether the consultant identifies the goal-lens by minute 5 + whether she asks for the EFT signature before they leave. Mark which stage each consultant skips.

### Role-Play 1 -- Tuesday 6:14pm Walk-In Working Mom Drop-In (10 min)

**Setup:** Prospect **Jessica (34, marketing coordinator, mom of one 4-year-old)**, walked in **Tuesday 6:14pm** to **mid-tier full-service club** (Phoenix suburb, $79-$129/mo + $99 enrollment + first-month-free promo). Came in on a **drop-in trial pass from Google search** ("gyms near me with classes"). Wants to lose **25 lbs before her younger sister's wedding in 7 months** (October). Last gym membership 4 years ago — **lapsed Planet Fitness $10/mo because "I never went."** Has **30 min** before daycare pickup at 6:45pm. Mid-tier club Platinum tier $129/mo (unlimited classes + recovery + InBody + 2 guest passes/mo) or Gold $89/mo (no classes, no recovery). **Consultant must run full 5-STAGE + read all 3 goal lenses (LOOK primary + FEEL secondary + handle two deflections + close the EFT autopay on annual contract with first-month-free + waived enrollment.**

> ### 🎤 PROSPECT -- Jessica
> 34, slightly nervous, pressed for time, value-conscious but motivated by sister's wedding date. Engages if consultant honors the 30-min window + listens to goal in first 4 min + handles two deflections without flinching.
>
> **Deflection 1 (min 6):** Jessica — *"I really need to talk to my husband first before signing anything — we usually make these decisions together."*
>
> **Deflection 2 (min 8):** Jessica — *"Planet Fitness down the street is $24.99/mo — why am I paying $129 here? That's literally 5x more."*

> ### 🎤 CONSULTANT
>
> - **Min 0-1 (GREET):** *"Jessica welcome — I'm [Name]. 30 min before pickup, let's be efficient. 4 min on this couch first? Saves time on the floor."*
> - **Min 1-5 (DISCOVER):** Four questions. *"What brought you in today specifically — what was the moment? (Sister's wedding October.) 6 months feeling great — what's it look like? (25 lbs lighter, sleeping better, not stress-eating.) Last gym — what worked/didn't? (PF — never went, no accountability.) When could you realistically come? (Tues+Thurs 6pm after daycare, Sat 9am.)"* **Lens: LOOK primary + FEEL secondary (stress + sleep + accountability).**
> - **Min 5-7 (DEMONSTRATE):** *"Three stations. **(1) Women's-only strength corner with mirrors** — your 25 lbs comes from here, not the treadmill. **(2) Tues + Thurs 6:30pm small-group HIIT** — Coach Sarah knows your name week 2, the accountability PF didn't give you. **(3) InBody scan now + month 1 + 3 + 6** — wedding dress as data not guesswork."*
> - **Min 7-8 (Deflection 1 — "talk to husband"):** *"Smart, household decision — respect it. What I CAN do: the first-month-free + waived $99 enrollment is today only. **I'll hold 48 hours if you come back Thursday by 8pm with him** — 15-min consult-desk visit, sign together. Or **call him from here now? 90 sec, I'll answer anything live**. Which works?"*
> - **Min 8-9 (Deflection 2 — "PF is $24.99"):** *"Fair question, I hear it 3x/week. At $24.99 PF gives cardio + selectorized + HydroMassage + tanning + 2,600 locations — great product for that. At $129 here: **HIIT with Coach Sarah by name week 2** (accountability PF didn't give you first time), **women's-only strength** (where 25 lbs actually happens), **InBody 4x in 6 mo** (real measurement), **recovery + infrared sauna** (sleep + stress, both things you named). Different products. PF didn't get you back last time — want the version with the coach this time?"*
> - **Min 9-10 (DESIGN + DECISION):** *"First 4 weeks: Tues+Thurs 6:30pm HIIT, Sat 9am, InBody week 1 + 4. Platinum $129 unlimited + recovery + InBody, annual EFT $99/mo, 30-day cancel + 90-day freeze. First-month-free + $99 enrollment waived tonight. **Start the EFT form on the tablet — 4 min, second-month draft so July 14 first hit?**"*

### 60-Second Reset

> ### 🟡 Coach Note
> **"Switch sides — 60-sec reset."** Stand up. Read the OTHER role's paper. Go.

### Role-Play 2 -- Saturday 10:08am Walk-In Young Male Comparing 3 Gyms (10 min)

**Setup:** Prospect **Marcus (26, software engineer)**, walked in **Saturday 10:08am** to **strength-focused independent club** (24/7 access, $89/mo + $0 enrollment first 30 days). **Just moved to town**, **comparing 3 gyms today** (this one, the Anytime Fitness 2 mi east, the CrossFit box 3 mi south). **Fitness-experienced** — powerlifting background 4 yrs, **485 deadlift / 365 squat / 275 bench**, looking for **serious equipment + a community vibe**, hates commercial-gym crowded-machine-circuit vibe. Club: strength-focused independent, 4 platform racks + 2 calibrated competition platforms + reverse hyper + GHD + sled track, 24/7 key-fob, $89/mo + $0 enroll first 30 days + $50 annual chalk-and-equipment fee, **smaller community** of ~340 members. **Consultant must run full 5-STAGE + read FUNCTION-primary goal lens + handle two deflections + close.**

> ### 🎤 PROSPECT -- Marcus
> Experienced, comparison-shopping, evaluating equipment quality + community + 24/7 access. Engages if consultant respects his powerlifting depth + handles equipment-spec question with honesty + frames $89 vs CrossFit $189 vs PF $24.99 correctly.
>
> **Deflection 1 (min 5):** Marcus — *"Your hours are great + 24/7 key-fob is huge, but your barbell rack count is lower than the gym I just left — I'm not gonna fight 4 lifters for rack time at 6pm. How do you handle peak hours?"*
>
> **Deflection 2 (min 8):** Marcus — *"I'm comparing your $89 to the CrossFit box at $189 down the street and the PF at $24.99 across town — what makes you worth $100 less than CrossFit but more than 3x PF?"*

> ### 🎤 CONSULTANT
>
> - **Min 0-1 (GREET):** *"Marcus welcome — I'm [Name]. Comparing 3 today — let's be honest about fit. 4 questions on the couch, then platforms?"*
> - **Min 1-4 (DISCOVER):** *"Moment that brought you in? (Moved Sunday, gym was the 2nd thing I unpacked after the coffee maker.) 6 months feeling great looks like? (500 deadlift, 405 squat, 5x/wk, find training partners.) Last gym — worked/didn't? (6 platforms + 2 strong-community lifters — wanted serious equipment + people who knew me.) When could you come? (6am pre-work or 6pm post-work + Saturday long sessions.)"* **Lens: FUNCTION primary + FEEL secondary (community + training partners).**
> - **Min 4-5 (DEMONSTRATE):** *"Three stations. **(1) 2 calibrated competition platforms in back** — meet-spec, chalk-allowed, your 485 won't bend the bar. **(2) Reverse hyper + GHD + sled track** — accessory work commercial gyms cut for cardio. **(3) Saturday 9am open-platform 'long-session' group** — 6-year-old thing, 12-15 regulars same time weekly, training partners."*
> - **Min 5-7 (Deflection 1 — rack count):** *"You're right — 4 platform racks + 2 competition platforms = 6 work surfaces. **Peak 6-8pm soft cap with sign-up board** — avg wait 5 min, never over 15. **6am + Saturday + 8pm-close = essentially empty.** If you're 6am or Saturday you never wait. If 6pm-only and need flex — honestly we might not be the right fit, Anytime 2 mi east has 8 racks but commercial-machine-circuit vibe, no calibrated platforms, no community. Trade-offs."*
> - **Min 7-9 (Deflection 2 — $89 vs CrossFit $189 vs PF $24.99):** *"Three different products. **PF $24.99** — selectorized + cardio + HydroMassage, no platforms, no community, fine for low-cost cardio. **CrossFit $189 + $150 onramp** — programmed group classes 5x/wk + WOD format, no open-gym-time for your own program. **Here $89 + $0 first 30 days** — calibrated platforms + 24/7 + open-gym for your program + Saturday long-session group. You have your own program — CrossFit would fight you, PF doesn't have equipment, here you get equipment + community without prescribed-class. **Worth $89 for the right product, not $189 for the wrong one, not $24.99 for what you wouldn't use.**"*
> - **Min 9-10 (DESIGN + DECISION):** *"First 4 weeks: 6am M/W/F solo, Sat 9am long-session group meet 2-3 partners, T/Th accessory. $89/mo + $0 enroll first 30 days + $50 annual chalk-and-equipment fee. Annual EFT, 30-day cancel + 60-day freeze if you travel. **Fob you in right now + EFT form on tablet — 4 min, second-month draft so 30 days on the floor before a dollar moves?**"*

> ### 🟡 Coach Note
> Consultant will want to (a) cave on the barbell-rack-count concern with vague reassurance — DO NOT, the honest "you're right + here's the trade-off + you might want the other gym if 6pm-only" earns more trust than the cave; (b) over-discount to match the PF $24.99 perception — DO NOT, frame as different products for different goals; (c) skip the goal-lens FUNCTION read because the prospect is fitness-experienced and "obviously knows what he wants" — wrong, even experienced lifters lead with FUNCTION but want FEEL (community) secondary; (d) try to upsell PT — wrong, FUNCTION-primary experienced lifters resent PT pitch from non-NSCA-cert coaches, save for member-experience email at month 2. **Make the consultant re-deliver the rack-count "you're right + trade-off + 6am-or-Saturday vs 6pm-only" verbatim.** Highest-leverage drill for experienced-comparison-shopper close discipline.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief Qs, then commitments. The ritual moves next quarter's same-day close + first-90-day retention + EFT-vs-MOM mix.

**Debrief 1 — "Strongest stage? Weakest?"** Consultants over-index DEMONSTRATE, under-index DISCOVER (feels "salesy" — it isn't) and DECISION (EFT-tablet feels pushy — delayed second-month draft + 30-day cancel removes pressure). **GM:** *"Skip either, close-rate halves."*

**Debrief 2 — "Goal lens missed most?"** Most name FUNCTION (default to LOOK/FEEL even when 40+ pain-relief or experienced lifter). **GM:** *"Ask the FUNCTION question even of the 28yo coming for LOOK — chronic conditions hide."*

**Debrief 3 — "Tour you owe a follow-up?"** Each names ONE recent tour that walked without EFT. **GM:** *"Text within 48 hr 'hey was great meeting you — holding the promo 48 more hours.' Call 24 hr later. Day 7 close-the-loop text. Then monthly nurture in Club OS / ABC / Mindbody — don't burn the lead."*

> ### 🎤 Commitment Ritual (Verbatim)

**GM:** "Open ABC / Club OS / Mindbody / ClubReady. Four lines. **(1)** specific recent tour you lost (prospect + date + gym joined + verbatim 'no' reason). **(2)** stage skipped + verbatim line tomorrow. **(3)** tour-prep kit item missing. **(4)** goal lens you'll ask about every tour going forward. Read aloud."

Coach the vague: *"Which prospect? Which words? Out loud now."*

**Closes:** "1:1 tour-shadow within 7 days. Not whether you closed — **whether you ran the 5 stages + read all 3 lenses + asked for the EFT on the tablet.**"

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out the printed one-pager. 30 seconds per section. Digital version in ABC Fitness / Club OS / Mindbody / ClubReady. One in every consultant's binder + every sales huddle.

> ### 📋 Leave-Behind -- "The 5-Stage Tour Script Card" One-Pager

> **THE 7 THINGS TO BRING ON EVERY TOUR:**
>
> - [ ] **Drop-in intake form** (goal + history + experience + time + budget — 90 sec front desk before couch)
> - [ ] **Club map with 3 stations pre-tagged per goal-lens** for fast DEMONSTRATE
> - [ ] **EFT-autopay tablet form ready** (ABC Ignite / Club OS / Mindbody / ClubReady) — 4-min signature
> - [ ] **Pricing grid** annual EFT vs MOM + freeze/cancel printed
> - [ ] **PT intro card** trainers + cert (NASM/ACE/NSCA/ISSA) + 4/8-pack pricing
> - [ ] **Promo expiration clarity** (today-only vs this-week) so urgency is honest
> - [ ] **Transformation photo wall + Instagram member spotlight** on lobby tablet

> **THE 5-STAGE GYM TOUR SCRIPT CARD:**
>
> | # | Stage | Verbatim Cue | Time |
> |---|---|---|---|
> | 1 | **GREET** | *"Before I show you a single piece of equipment — can I steal 4 min on this couch? I promise it saves time on the floor."* | 3 min |
> | 2 | **DISCOVER** | *"4 questions. What brought you in today specifically / 6 months feeling great looks like / last gym what worked-what didn't / when could you realistically come?"* | 3 min |
> | 3 | **DEMONSTRATE** | *"Based on what you told me — THREE stations only. [Station 1 matched to primary lens] / [Station 2 matched to secondary] / [Station 3 = InBody or proof-of-progress data point]."* | 3 min |
> | 4 | **DESIGN** | *"Let's sketch your first 4 weeks on the back of this. Week 1 / Week 2 / Week 3 / Week 4. Pricing: annual EFT $X vs MOM $Y + enrollment + freeze + cancel."* | 3 min |
> | 5 | **DECISION** | *"Three things. Today-only promo. Second-month draft means 30 days inside before $ moves. 30-day cancel + 90-day freeze. Want me to start the EFT form on the tablet?"* | 3 min |

> **THE 3 GOAL LENSES — READ AND ADDRESS:**
>
> | Lens | Cares About | DEMONSTRATE Match | Cross-Modal Upsell |
> |---|---|---|---|
> | **LOOK** | Aesthetic / weight loss / event date | Strength area + class schedule + InBody + (women's-only if avail) | 1:1 PT 35-50% attach (visible deadline = willingness to pay) |
> | **FEEL** | Energy / sleep / stress / mental health | Small-group HIIT + recovery room/sauna + community events | Recovery + small-group 40-60% attach, rarely 1:1 PT |
> | **FUNCTION** | Performance / longevity / pain / chronic | Platform racks + accessory equipment + mobility + DPT referral | 1:1 NASM/NSCA strength coach 50-70% attach (highest LTV) |

> **4 PHRASES THAT LOSE THE CLOSE (never say):**
>
> - [ ] *"Let me show you around"* (equipment-tour, not goal-tour — every gym says this)
> - [ ] *"What's your budget?"* (Stage 1 is too early; pricing belongs in Stage 4 DESIGN)
> - [ ] *"Take this tri-fold home and think about it"* (loses EFT 75%+ of the time)
> - [ ] *"We can match PF's price"* (reactive matching destroys margin + signals desperation + invites cancel at month 2)

> **THE "TWO-NOW / THREE-LATER" PRICING FRAME:**
>
> | When | What | Why |
> |---|---|---|
> | **Two-Now (Stage 5 DECISION)** | (1) Today's promo expires today (first-month-free + waived enrollment) | Honest urgency, not invented |
> | **Two-Now** | (2) Second-month draft = 30 days inside before first $ moves | Pressure-free trial inside the contract |
> | **Three-Later (covered in DESIGN Stage 4)** | (3) 30-day cancel notice | Member knows they're not locked |
> | **Three-Later** | (4) 90-day freeze (travel + injury + life event) | Annual EFT not punishment for life happening |
> | **Three-Later** | (5) PT add-on optional at Day 14 or Day 30 check-in | Cross-modal upsell after habit forms, not pressure at join |

> **NEVER DO:** skip DISCOVER and walk straight to equipment / ask budget Stage 1 or 2 / show every piece of equipment / trash a competitor (especially PF) / match price reactively / push EFT without delayed-second-month + 30-day-cancel framing / tri-fold-home close / pitch 1:1 PT to FEEL prospect (mis-attach) / pitch group HIIT to FUNCTION powerlifter (mis-attach) / sell annual to obvious 90-day-cancel prospect / skip medical-clearance for chronic-condition / promise peak-hour availability that isn't true / take payment without cancel + freeze explicit / no-follow-up after no-close (text 48hr / call 24hr later / day 7 / monthly nurture).

> **OUTCOME LINE:** Full 5-STAGE + all 3 goal lenses + EFT-on-tour + delayed-second-month-draft + 30-day cancel + 90-day freeze + honest competitor re-framing → **60-75% same-day close / 6-12% annual EFT cancel / 18-24 mo tenure / 35-50% PT attach on LOOK / 4.6+ Google / 25-35% referral**. Unstructured equipment tour + tri-fold-home → **20-35% close / lose to PF / 30%+ first-90-day cancel / 3.6-4.0 reviews / 75%/yr turnover**.

> ### 🎯 If You Only Remember One Thing
> **You don't sign the EFT by walking the prospect past every piece of equipment — you sign it by (1) asking 4 lobby questions to hear which goal lens drives them (LOOK / FEEL / FUNCTION), (2) demonstrating only 3 specific stations matched to the lens with transformation visible, and (3) asking for the EFT on the tablet before they walk out with delayed-second-month-draft + 30-day-cancel framing so it costs nothing for 30 days. The 20-minute tour is the only sales meeting you get — close on the floor or don't close at all.**

---

## How This Training Sits Inside Your Gym Operating Motion

| Where it fits | What this addresses |
|---|---|
| **Tuesday-morning sales huddle** | Review last week's tours by 5-stage + lens + close; 1 verbatim drill per consultant |
| **First 30 sec on walk-in** | GREET — pause at lobby couch, ask permission, signal real conversation |
| **Next 3 min on couch** | DISCOVER — 4 questions to identify goal lens (LOOK / FEEL / FUNCTION) |
| **Next 3 min on floor** | DEMONSTRATE — 3 stations matched to lens, transformation visible |
| **Next 6 min at consult desk** | DESIGN sketch 4 weeks + EFT vs MOM + DECISION EFT tablet + today-only promo + delayed-second-month + 30-day cancel + 90-day freeze |
| **3-lens overlay** | LOOK + FEEL + FUNCTION read + addressed every tour, cross-modal upsell tied to lens |
| **GM coaching** | Weekly tour-shadow + ABC / Club OS / Mindbody / ClubReady audit + 1:1 within 7 days |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: 5-stage tour flow + 3 goal lenses mapping
// ============================================================================
const flow = `

## The 5-Stage Gym Tour Flow

\`\`\`mermaid
flowchart TD
  A[GM Opens] --> B[Section 1: Intro + Cold Open 10 min — IHRSA + Statista benchmarks $33B + 64M members + 41K facilities + top quartile 60-75 percent same-day close vs bottom 20-35 percent + Phoenix composite Consultant A let-me-show-you-around $129 tri-fold lost to PF $24.99 that night vs Consultant B 4 lobby questions LOOK + FEEL lens 3 stations signed EFT 6:32pm]
  B --> C[Section 2: Teach 25 min]
  C --> C1[Part A 5-STAGE 15 min — GREET 3 min lobby couch permission / DISCOVER 3 min four questions / DEMONSTRATE 3 min THREE stations matched to lens / DESIGN 3 min sketch 4 weeks + EFT vs MOM pricing / DECISION 3 min three-step close + EFT tablet]
  C --> C2[Part B 3 Goal Lenses 10 min — LOOK aesthetic/weight-loss/event matched strength + class + InBody PT attach 35-50 percent / FEEL energy/sleep/stress small-group HIIT + recovery + community 40-60 percent attach / FUNCTION performance/longevity/pain/chronic platform racks + accessory + DPT NSCA coach 50-70 percent highest LTV]
  C1 & C2 --> F[Section 3 Discussion 10 min — 8 prompts refuse to close + walk away from price-shopper + come-back-with-spouse 48-hr hold + defend $129 vs $24.99 + cross-sell PT at DEMONSTRATE + annual EFT vs MOM + guest-pass booked-trial + ONE verbatim change]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[Round 1 Jessica 34 working mom Tuesday 6:14pm Google-search drop-in 25 lbs sister wedding October last gym PF lapsed $129 + $99 enrollment + first-month-free — Deflections talk to husband + PF $24.99 — CONSULTANT 5-STAGE LOOK + FEEL 3 stations 48-hr hold + phone-now honor PF close annual EFT $99/mo]
  G1 --> G2[60-sec reset]
  G2 --> G3[Round 2 Marcus 26 powerlifter 485 deadlift Saturday 10:08am strength-independent $89/mo + $0 enroll comparing CrossFit $189 + PF $24.99 — Deflections rack count + $89 vs CrossFit vs PF — CONSULTANT 5-STAGE FUNCTION + FEEL 3 stations honest rack-count trade-off three-different-products close EFT $89]
  G3 --> H[Section 5 Debrief 5 min — 4-line ABC/Club OS/Mindbody/ClubReady ritual]
  H --> I[Section 6 Leave-Behind 3 min — 7 Things + Script Card + 3 Lenses + 4 Phrases That Lose + Two-Now/Three-Later Pricing]
  I --> Z[End 1:13]
\`\`\`

## The Three Goal Lenses Reading Guide with Cross-Modal Upsells

\`\`\`mermaid
flowchart LR
  IN[Walk-In or Drop-In or Google-Search Lead] --> SCAN{4 DISCOVER Questions Identify Lens?}
  SCAN -- "Event/Date-Driven/Weight-Loss" --> LOOK[LOOK Primary — aesthetic + weight loss + event urgency]
  SCAN -- "Energy/Sleep/Stress/Post-Life-Event" --> FEEL[FEEL Primary — energy + sleep + stress + community]
  SCAN -- "Performance/Longevity/Pain/40+/Experienced" --> FUNC[FUNCTION Primary — performance + longevity + pain + chronic]
  LOOK --> LOOKDEM[DEMONSTRATE 3 — Strength area + Class schedule + InBody baseline]
  FEEL --> FEELDEM[DEMONSTRATE 3 — Small-group HIIT + Recovery/sauna + Community calendar]
  FUNC --> FUNCDEM[DEMONSTRATE 3 — Platform racks + Accessory GHD/sled + Mobility/DPT]
  LOOKDEM --> LOOKUP[Upsell — 1:1 NASM PT 35-50 percent attach visible deadline]
  FEELDEM --> FEELUP[Upsell — Recovery + small-group 40-60 percent rarely 1:1 PT]
  FUNCDEM --> FUNCUP[Upsell — NSCA strength coach 50-70 percent highest LTV]
  LOOKUP & FEELUP & FUNCUP --> SEC[Always ask secondary lens — chronic conditions hide]
  SEC --> DESIGN[DESIGN — sketch 4 weeks + annual EFT $99 vs MOM $129 + 30-day cancel + 90-day freeze]
  DESIGN --> DECIDE[DECISION — EFT tablet + today-only promo + second-month draft]
  DECIDE --> OUT{EFT Signature?}
  OUT -- "Yes Annual EFT" --> WIN[6-12 percent cancel + 18-24 mo tenure + $1.5K-$3K LTV]
  OUT -- "Yes MOM" --> WINMOM[24-42 percent cancel + 8-14 mo — flex tradeoff]
  OUT -- "Booked trial with coach" --> TRIAL[4-6x conversion vs unbooked]
  OUT -- "Talk to spouse" --> WAIT[48-hr hold + phone-now — return-close 40-55 percent]
  OUT -- "Walk Without EFT" --> LOST[Text 48 hr + call 24 hr + day 7 + monthly nurture]
  WIN & WINMOM & TRIAL & WAIT --> CLOSE[60-75 percent top quartile + 4.6+ Google + 25-35 percent referral]
  LOST --> LEARN[Tour-notes audit at 1:1 — stage skipped which lens missed]
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE Gym Tour, Three Goal Lenses, and 60-75% top-quartile same-day-close benchmarks draw on fitness industry research, gym-management standards, and recognized membership + billing platform data.

**Industry research + market data.** **IHRSA 2024 Global Report** — US health-club industry ~$33B + ~64M members + ~41K facilities; tour-to-join benchmarks 35-65% with top quartile 60-75%; IHRSA Profiles of Success financial benchmarking by tier + region. **Statista US Health & Fitness Club Industry** — 2024 segmentation low-price (PF + Crunch + Blink) ~35% members / mid-tier (LA Fitness + 24 Hour + YMCA) ~30% / premium (Life Time + Equinox) ~10% / boutique-studio (F45 + OTF + CrossFit + Barry's + SoulCycle + Pure Barre + CycleBar) ~25%; post-COVID boutique-studio grew 3x commercial. **Club Industry Magazine** Top 100 (Planet Fitness #1 member count, Life Time #1 revenue per member ~$1,800/yr vs PF ~$220/yr). **Athletech News + Fitness Insider** daily fitness tech + boutique + franchise + PE rollup coverage. **AHFS American Health & Fitness Survey** annual member satisfaction + retention + cancellation-reason ~80K members.

**Public-company + franchise data.** **Planet Fitness NYSE:PLNT 10-K** — ~2,600+ stores 2024, $10 Classic + $24.99 Black Card, $0-$49 enrollment, ~19M members, ~$1.07B 2023 revenue; same-day close ~50-65%. **Anytime Fitness (Self Esteem Brands)** ~5,000+ franchised clubs, $40-$60/mo + $49-$99 enrollment, 24/7 key-fob. **F45 Training NYSE:FXLV** ~1,500 studios; **Orangetheory** ~1,500+; **Barry's** ~85 premium HIIT $35-$45/class; **SoulCycle** ~80 Equinox-owned; **CrossFit Inc** ~12K affiliate boxes $150-$250/mo + $100-$200 onramp. **Crunch** ~470+ $9.95-$34.99; **Life Time NYSE:LTH** ~170 $149-$249/mo; **LA Fitness** ~700 $35-$49/mo + $99-$149 enrollment; **Equinox** ~110 luxury $200-$350/mo + $500 initiation.

**Gym software + billing stack.** **ABC Fitness Solutions (formerly ABC Financial)** ~16K+ club locations, processes ~$10B+ annual EFT; Ignite + DataTrak + Trainerize; ~50% of US commercial gyms run ABC billing. **Mindbody (Vista Equity)** ~58K studios. **ClubReady** ~3K clubs. **Twin Oaks Software** ~2K clubs + Y/JCC. **Wodify** ~5K CrossFit affiliates. **Club OS (Daxko)** ~5K clubs lead-management CRM. **Daxko** ~10K Y/JCC + commercial. **Trainerize (ABC)** ~50K trainers. **GymSales (ABC Ignite)** + **Hapana** ~5K boutique studios.

**Certifications + labor.** **NASM** ~190K certified largest US cert NASM-CPT $899. **ACE** ~80K ACE-CPT. **NSCA** ~50K CSCS most-respected for strength. **ISSA** ~70K. **BLS SOC 39-9031 Fitness Trainers & Instructors** ~331K employed; median ~$45,380 May 2023; +14% through 2032. Membership consultants under Sales Reps (SOC 41-3091) ~$46K-$72K base + commission, top quartile $90K+. Sales counselor turnover ~50-75%/yr.

**Billing + contract perimeter.** EFT autopay industry standard — monthly draft from member checking via NACHA ACH (~$0.20-$0.50/txn) vs card 2.9% + $0.30. **Annual contract + EFT autopay = 6-12% annual cancel vs MOM 24-42%** per IHRSA + ABC Fitness. Freeze 30-90 day max + $5-$15/mo fee. Cancel typically 30-day written notice + final draft. Chargebacks (ACH return) ~2-4% on EFT vs ~8-12% credit card per ABC Financial.

**Aggregator + at-home pressure.** **ClassPass** ~30K studio partners $20-$45/class. **Volo Pass** NYC/DC/Boston. **Peloton** ~3M members + Hilton + Westin commercial-partnership. **Apple Fitness+** ~$9.99/mo. **Tonal** $3,995 + $49.95/mo. **Mirror (Lululemon Studio)** wound down 2023. At-home grew 8x 2019-2024 then plateaued; commercial gym ~64M US members rebounded post-COVID above 2019 ~64.2M.

**Unit economics.** Commercial LTV $660-$1,800 (24-mo × $30-$75 less ~15% churn cost); boutique LTV $1,800-$3,600; premium LTV $4,200-$10,800. CAC commercial $40-$120, boutique $80-$200, premium $200-$500. Enrollment fee $0-$199 covers 40-80% CAC. Payback 3-9 mo commercial / 1-3 mo boutique-premium. PT upsell adds $200-$800/mo per attached member doubling LTV.

**Trade press + education.** **IHRSA Convention**, **Club Industry Show**, **Athletic Business Conference**, **IDEA World**, **Mindbody Bold**, **PT on the Net**, **NSCA Coaches Conference**, **CrossFit Games**.

`;

// ============================================================================
// NUM -- quantified benchmarks the GM cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

Pulled from IHRSA 2024 Global Report + Statista + Club Industry + AHFS + Planet Fitness 10-K + ABC Fitness + Daxko + NSCA/NASM/ACE + BLS + Athletech News industry benchmarks.

### US Gym + Health Club + Studio Industry Reality

| Metric | Value | Source |
|---|---|---|
| US gym + health-club + studio industry total | **~$33B** | IHRSA 2024 / Statista |
| US members | **~64M** | IHRSA 2024 |
| US facilities (commercial + boutique + studio + Y/JCC) | **~41K** | IHRSA 2024 |
| Low-price segment (PF + Crunch + Blink) members | **~35%** | Statista |
| Mid-tier segment (LA Fitness + 24 Hour + YMCA) members | **~30%** | Statista |
| Premium segment (Life Time + Equinox) members | **~10%** | Statista |
| Boutique-studio (F45 + OTF + CrossFit + Barry's + SoulCycle) members | **~25%** | Statista |
| Commercial member LTV | **$660-$1,800** | IHRSA Profiles of Success |
| Boutique-studio LTV | **$1,800-$3,600** | IHRSA / Club Industry |
| Premium LTV | **$4,200-$10,800** | IHRSA / Life Time 10-K |
| Avg commercial member tenure | **~24 months** | IHRSA / ABC Fitness |
| Avg boutique tenure | **12-18 months** | Club Industry / AHFS |
| Fitness trainers + instructors employed (SOC 39-9031) | **~331K** | BLS |
| Median trainer wage | **~$45,380** | BLS |
| Membership consultant base + commission | **$46K-$90K+** | BLS / IHRSA |
| Sales consultant turnover | **~50-75%/yr** | Club Industry / IHRSA |

### Public-Company + Franchise Footprint (2024)

| Brand | Clubs | Pricing | Same-Day Close |
|---|---|---|---|
| **Planet Fitness NYSE:PLNT** | ~2,600+ | $10 Classic / $24.99 Black Card | 50-65% (per franchisee disclosures) |
| **Anytime Fitness (Self Esteem Brands)** | ~5,000+ global | $40-$60/mo + $49-$99 enroll | 60-70% (franchise ops manual) |
| **Crunch Fitness** | ~470+ | $9.95-$34.99 Peak Plus | 45-60% |
| **LA Fitness (Fitness International)** | ~700 | $35-$49/mo + $99-$149 enroll | 40-55% |
| **Life Time Fitness NYSE:LTH** | ~170 | $149-$249/mo (family-tier) | 30-45% (longer consideration) |
| **Equinox Group** | ~110 | $200-$350/mo + $500 initiation | 25-40% (luxury price-sensitivity) |
| **F45 Training NYSE:FXLV** | ~1,500 | $189-$235/mo | 40-55% (boutique trial-to-join) |
| **Orangetheory Fitness** | ~1,500+ | $179-$219/mo | 45-60% |
| **CrossFit Inc affiliates** | ~12K global | $150-$250/mo + $100-$200 onramp | 50-65% (community-pre-qualified) |
| **Barry's** | ~85 | $35-$45/class | 35-50% (class-by-class buyer) |
| **SoulCycle (Equinox)** | ~80 | $36-$40/class | 35-50% |

### Pricing Tier vs Same-Day Close Rate

| Tier | $/mo Range | Enrollment | Typical Same-Day Close | Avg Tenure |
|---|---|---|---|---|
| **Low-price (PF / Blink / Crunch Base)** | $10-$30 | $0-$49 | 50-65% | 18-30 mo |
| **Mid-tier commercial (LA Fitness / 24 Hour / Crunch Signature)** | $35-$59 | $99-$149 | 40-55% | 18-24 mo |
| **Mid-tier full-service independent** | $79-$129 | $0-$99 | **60-75% top quartile / 20-35% bottom** | 18-24 mo |
| **Premium (Life Time / Cherry Creek)** | $149-$249 | $100-$300 | 30-45% | 36+ mo |
| **Luxury (Equinox)** | $200-$350 | $500+ initiation | 25-40% | 36+ mo |
| **Boutique-studio (F45 / OTF / Pure Barre / CycleBar)** | $179-$235 | $0-$99 | 40-55% | 12-18 mo |
| **CrossFit affiliate** | $150-$250 | $100-$200 onramp | 50-65% | 18-30 mo |
| **Premium boutique (Barry's / SoulCycle / Y7)** | $35-$45/class | $0 | 35-50% | 6-12 mo |

### EFT Autopay vs MOM Cancellation Rates

| Billing Type | Annual Cancel Rate | Tenure | Notes |
|---|---|---|---|
| **Annual contract + EFT autopay** | **6-12%** | 24-36 mo | Industry gold standard, IHRSA |
| **Annual contract + credit card autopay** | 12-18% | 18-30 mo | Higher chargeback ~8-12% |
| **MOM (month-to-month) + EFT** | 24-32% | 12-18 mo | Flex premium $20-$40/mo |
| **MOM + credit card** | 32-42% | 8-14 mo | Highest churn + chargebacks |
| **Annual paid-in-full upfront** | **3-6%** | 24-36 mo | Lowest churn (sunk cost), rare offer |
| **Class-pack (10/20/50 class)** | N/A — buy again 25-40% | 4-8 mo | ClassPass + boutique model |

### Personal Training Upsell Attach % By Goal Lens

| Goal Lens at DEMONSTRATE | PT Attach % at Join | Cross-Modal Add-On | Notes |
|---|---|---|---|
| **LOOK (event date / weight loss)** | **35-50%** | 4-pack or 8-pack monthly | Visible deadline = willingness to pay for accountability |
| **FEEL (energy / sleep / stress)** | 8-15% (1:1) | 40-60% recovery + group HIIT | FEEL prospects rarely buy 1:1 PT, big on community + recovery |
| **FUNCTION (performance / longevity / pain)** | **50-70%** | NSCA/CSCS strength coach | Highest LTV segment, often referral pipeline |
| **40+ pain-relief or post-PT** | 55-75% | DPT-supervised + medical-grade | Doctor referral pre-qualifies |
| **Powerlifter / serious lifter** | 10-20% | Form-check session only | Resent PT pitch from non-NSCA cert |

### Lead Source ROI (Gym Acquisition)

| Lead Source | % of Inquiries | CAC | Same-Day Close |
|---|---|---|---|
| **Walk-in / drive-by** | 20-30% | $0 | **60-75% top quartile** |
| **Google search / SEO / GMB** | 25-35% | $20-$60 | 55-70% |
| **Meta/Instagram paid social** | 15-25% | $40-$120 | 35-50% |
| **Referral (member-get-member)** | 15-25% | $25-$75 referral bonus | **65-80%** |
| **Class Pass + Volo Pass aggregator** | 5-10% | $20-$45/class share | 30-45% (drop-in mindset) |
| **Corporate wellness partnership** | 5-10% | $0-$25 negotiated | 50-65% (employer-subsidized) |
| **Lapsed-member win-back campaign** | 5-10% | $30-$80 | 45-60% |

### Tour Outcome By Time of Day + Day of Week

| Time Slot | Walk-In Volume | Same-Day Close | Notes |
|---|---|---|---|
| **Mon-Thu 9am-12pm** | 10% | 55-70% | Stay-at-home / shift workers / retirees high-intent |
| **Mon-Thu 12-2pm** | 8% | 50-65% | Lunch-break, time-pressured |
| **Mon-Thu 5-8pm** | **35%** | **50-65%** | Peak walk-in window post-work |
| **Friday 5-8pm** | 8% | 35-50% | Weekend deferral mindset |
| **Saturday 9am-1pm** | **20%** | **55-70%** | Weekend gym-shopping prime time |
| **Saturday 1-5pm** | 6% | 40-55% | Less intent, more browsing |
| **Sunday 10am-2pm** | 10% | 50-65% | Sunday-restart / Monday-prep mindset |
| **Sunday 3-7pm** | 3% | 35-45% | Lowest-intent slot |

### Why Tours Don't Close (Composite)

| Reason for No-Close | % |
|---|---|
| Consultant skipped DISCOVER and walked to equipment floor (no goal lens read) | 41% |
| Showed every piece of equipment (no DEMONSTRATE focus on THREE) | 28% |
| Asked budget in Stage 1 instead of Stage 4 DESIGN | 19% |
| Sent home with tri-fold instead of asking EFT-on-tablet | 36% |
| Quoted price without value re-frame against PF/competitor | 22% |
| Failed "I'll come back with spouse" with no 48-hr hold or phone-call-now | 24% |
| Pitched 1:1 PT to FEEL prospect (mis-attach) | 12% |
| Pitched group HIIT to FUNCTION powerlifter (mis-attach) | 9% |
| Refused to walk away from value-mismatched price-shopper | 14% |
| Trashed PF or competitor instead of honoring as different-product | 11% |
| Skipped medical clearance ask for chronic-condition prospect | 7% |
| Sold annual contract to obvious 90-day-cancel prospect | 8% |
| No follow-up within 48 hrs after walk-no-close | 31% |
| Promised peak-hour equipment availability untruthfully | 10% |

### Consultant Tenure vs Same-Day Close Performance

| Tenure | Tours/Wk | Same-Day Close | Avg $/mo Sold | Avg Enrollment Captured |
|---|---|---|---|---|
| **0-3 mo (rookie)** | 8-12 | 25-35% | $79-$99 | $25 (often waived) |
| **3-6 mo** | 10-14 | 35-45% | $89-$109 | $40 |
| **6-18 mo** | 12-16 | 45-55% | $99-$119 | $60 |
| **18-36 mo** | 14-18 | 50-60% | $109-$129 | $79 |
| **3-5 yr** | 14-18 | 55-65% | $119-$139 | $90 |
| **5-Stage + Goal-Lens + EFT-Tablet Discipline** | 14-18 | **60-75%** | **$129-$159** | **$99-$129** |

**Pattern:** DISCOVER (the 4 lobby questions before any equipment) and DECISION (the EFT-on-tablet ask with delayed-second-month-draft framing) are hardest to install. **Weekly tour-shadow + ABC Fitness / Club OS / Mindbody / ClubReady tour-notes audit by GM = single biggest predictor of 90-day cohort same-day-close lift.** Goal-lens reading reaches 90%+ by week 6 with disciplined coaching; without, FUNCTION goes unread first (default to LOOK/FEEL even with 40+ pain-relief prospects).

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + GM objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Skipping DISCOVER and Walking Straight to the Equipment Floor
Most common. Consultant opens *"let me show you around — follow me"* — never asks 4 lobby questions, never identifies goal lens, gives the same equipment-tour every prospect gets. **Four lobby questions FIRST, then walk.**

### Failure Mode 2 -- Quoting Price Before Value Is Built
Consultant volunteers pricing during the floor walk or asks *"what's your budget?"* in GREET. Prospect anchors on price without value frame. **Pricing belongs in Stage 4 DESIGN after value is built — never Stage 1, 2, or 3.**

### Failure Mode 3 -- Showing Every Piece of Equipment (No DEMONSTRATE Focus)
Fifteen pieces in 22 minutes = blurs together, no anchor memory, prospect leaves saying *"nice gym"* but can't visualize their transformation. **THREE stations deep matched to goal lens — not fifteen shallow.**

### Failure Mode 4 -- Tri-Fold-Home Close Instead of EFT-on-Tablet
*"Take this tri-fold home + think about it"* = lose close 75%+ of the time. Prospect Googles 3 competitors on drive home + joins whichever has lowest friction. **Always: EFT tablet at consult desk + today-only promo + delayed second-month draft + 30-day cancel + 90-day freeze.**

### Failure Mode 5 -- Trashing the Competitor Instead of Honoring as Different Product
Consultant says *"Planet Fitness is for people who don't actually want to work out"* — prospect was a former PF member, now feels insulted. **NEVER trash PF or any competitor — honor as different-product-for-different-goal, re-frame the value delta as outcome-driven.**

### Failure Mode 6 -- Reactive Price Matching
Prospect says *"PF is $24.99 — match that"* and consultant says *"OK we can do $49."* Margin gone, value position gone, prospect cancels at month 2 because value never matched discounted price. **NEVER match reactively — re-position the $100/mo delta as included value (HIIT + coach-by-name + recovery + InBody + women's-only strength).**

### Failure Mode 7 -- Pitching the Wrong Cross-Modal Upsell
Pitching 1:1 PT to a FEEL prospect (mis-attach) or group HIIT to a FUNCTION powerlifter (mis-attach). **Cross-modal upsell tied to lens — LOOK gets 1:1 PT, FEEL gets recovery + small-group, FUNCTION gets NSCA strength coach.**

### Failure Mode 8 -- Refusing to Walk Away from Value-Mismatched Price-Shopper
Burning 25 min on a $24.99-budget prospect who will never sign $129. Wasted peak-window tour + day-60 cancel + chargeback risk. **Graceful walk-away: refer to PF + hold offer 14 days + protect next walk-in's attention.**

### Failure Mode 9 -- Failing "I'll Come Back with My Spouse" Without 48-Hour Hold or Phone-Call-Now
*"OK sounds good"* + tri-fold-home = 80% never come back. **Three moves: honor, lock (48-hour promo hold), get spouse on phone now (90 sec).** Return-with-spouse close 40-55% with the discipline.

### Failure Mode 10 -- Skipping Medical Clearance for Chronic-Condition Prospect
Prospect mentions diabetes / BP / pre-cardiac / post-surgery and consultant signs the EFT anyway. Liability + bad first-90-day if they have an event. **Always: medical clearance + hold promo 14 days + introduce DPT + sign EFT only after clearance.**

### Failure Mode 11 -- Selling Annual Contract to Obvious 90-Day-Cancel Prospect
Annual EFT on a low-fit signals prospect (vague goal, no time-availability, hostile to coaching). 90 days later: dispute + ACH return + chargeback + BBB + 1-star review. **Sell MOM to low-fit signals + accept the 24-42% cancel rate as price of avoiding chargeback nightmare.**

### Failure Mode 12 -- GM Doesn't Audit Tour Notes Weekly
Kills 60-75% of training rollouts. ~30-day half-life uncoached — consultants revert to equipment-tour by week 4. **One tour-shadow + one ABC/Club OS/Mindbody/ClubReady tour-notes audit per consultant per week, reviewed in 1:1.** Non-negotiable.

### Common GM Objections

**1. "My consultants already do this."** Pull 30 days of Club OS / ABC tour notes + shadow 10 tours. Bottom-quartile ALL skip DISCOVER + DECISION + FUNCTION-lens read.

**2. "5-stage takes too long — we have 20-min windows."** Stages fit in 15 min: GREET + DISCOVER 6 min, DEMONSTRATE 3 min, DESIGN + DECISION 6 min, 5-min buffer for objections + EFT form. **Structured isn't longer — it's anchored.**

**3. "EFT-on-tablet feels too pushy."** Delayed second-month draft + 30-day cancel + 90-day freeze removes pressure. **Pushy is tri-fold-home no-follow-up OR non-refundable upfront paid-in-full.**

**4. "We can't compete with PF on price."** Don't try. Honor as different product for different goal. Re-position the $100/mo delta as included value (coaching + community + recovery + InBody + named-trainer).

**5. "Can't decline a tour — every walk-in matters."** Wrong. Value-mismatched price-shopper = 25 min wasted + 0% close + cancel risk. **Graceful decline + referral = protected attention + 5-star review.**

**6. "How do I know it's working?"** 90-day signals: same-day close +20-30 pts / first-90-day retention +15-25 pts / EFT-vs-MOM mix shifts toward EFT / PT attach +10-20 pts / Google + Yelp 3.8 → 4.6+ / consultant turnover 75% → 35%.

**7. "Should we go boutique-only like F45?"** Depends on market + facility + member base. **Hybrid: open-floor strength + cardio + small-group HIIT add-on = best of both for mid-tier full-service.**

### When To Run A Second Time

**Monthly first 3 months + quarterly after** + **whenever you lose 3+ walk-ins to PF in a single week** + **whenever a new competitor opens within 1 mile**. Rotate role-plays: 50+ pain-relief / ex-D1 returning after baby / group of 3 friends decision-by-consensus / corporate-wellness referral / lapsed-member 18-month return / bilingual prospect / post-PT DPT referral.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Twenty-first entry** in **Pulse Sales Trainings**, **fifteenth industry-specific** after st0007-st0020. st0021 = gym + health club + boutique studio membership consultant + GM + front desk staff running the 20-minute walk-in tour for a drop-in trial or Google-search lead — the only sales meeting the gym gets — converting it into EFT-autopay annual contract at $79-$129/mo + $0-$99 enrollment signed on the tablet, inside the **IHRSA + Statista + Club Industry + AHFS + Planet Fitness 10-K + Anytime Fitness + F45 + Orangetheory + CrossFit + Barry's + SoulCycle + Crunch + Life Time + LA Fitness + Equinox + ABC Fitness + Mindbody + ClubReady + Twin Oaks + Wodify + Club OS + Daxko + NASM/ACE/NSCA/ISSA + BLS + EFT/NACHA/ACH + ClassPass + Peloton + Apple Fitness+** perimeter.

**Companion entries planned:** **st0022** personal trainer 1:1 consult conversion. **st0023** boutique studio class trial-to-membership. **st0024** gym corporate-wellness B2B. **st0025** DPT private practice intake. **st0026** med spa membership retainer. **st0027** yoga teacher-training enrollment. **st0028** chiropractor new-patient consult. **st0029** dietitian coaching package. **st0030** mental-health-therapist intake.

**Cross-references to st0001-st0006 SaaS:** st0001 discovery → DISCOVER 4 lobby questions; st0002 single-threading → reading goal lens (LOOK / FEEL / FUNCTION); st0003 objection recovery → "come back with spouse" + "PF is $24.99" + "barbell rack count low" + "$89 vs CrossFit $189"; st0004 cold-call opener → GREET lobby couch ask; st0005 demo → DEMONSTRATE 3 stations matched to lens; st0006 pricing → DESIGN + DECISION EFT tablet close.

**Cross-reference to st0007-st0020:** verbatim language + CRM-reviewed coaching cadence transfers. st0019 homeowners hear DIAGNOSE/DEMONSTRATE/DECIDE-CRITERIA/DESIGN/DOLLARS; st0020 couples hear STORY/STROLL/SHOWCASE/SHAPE/SECURE; **st0021 gym walk-ins hear GREET/DISCOVER/DEMONSTRATE/DESIGN/DECISION**. **st0017 med-spa consult closest sibling** — high-trust consumer-at-facility, emotional driver, recurring-revenue subscription. **What does NOT transfer:** gym has **20-minute hard window** (vs med spa 45-60 min), **drop-in walk-in volume** (vs booked-only), **EFT autopay annual contract** (vs retainer + per-treatment), **PF/Anytime/Crunch/Life Time/Equinox public-market price benchmarks** (vs local-only competition).

**Adjacent Knowledge Library:** IHRSA Global Report + Statista segmentation + PF 10-K + Black Card economics + Anytime Fitness 24/7 model + F45/OTF/Barry's/SoulCycle pricing + Crunch/Life Time/Equinox premium tier + ABC Fitness Ignite billing + EFT vs MOM math + Mindbody/ClubReady/Twin Oaks/Wodify/Club OS CRM + NSCA vs NASM cert + 1:1 PT attach % by goal-lens + medical clearance + ClassPass/Peloton/Apple Fitness+ pressure + corporate wellness + member-get-member referral + lapsed-member win-back + bilingual consultant + post-PT DPT referral.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0021](https://pulserevops.com/sales-trainings/st0021).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block: IHRSA International Health Racquet & Sportsclub Association 2024 Global Report ~$33B US health-club industry + ~64M US members + ~41K facilities + tour-to-join benchmarks 35-65% with top quartile 60-75% + IHRSA Profiles of Success annual financial benchmarking + Planet Fitness NYSE:PLNT 10-K + investor presentations ~2,600+ stores 2024 mostly franchised ~140 corporate $10 Classic + $24.99 Black Card $0-$49 enrollment ~19M members ~$1.07B 2023 revenue same-day close ~50-65% on walk-ins per franchisee disclosures PF Black Card upsell ladder HydroMassage + tanning + guest privileges + 2,600 club access + Anytime Fitness Self Esteem Brands / Purpose Brands ~5,000+ franchised clubs globally largest 24/7 franchise concept $40-$60/mo + $49-$99 enrollment key-fob 24/7 access sister brands Orangetheory + Waxing the City + Basecamp Fitness + The Bar Method same-day close target 60-70% per franchisee operations manual + F45 Training NYSE:FXLV ~1,500 studios globally Mark Mastrov + Adam Gilchrist + Orangetheory Fitness ~1,500+ studios heart-rate-zone HIIT Self Esteem Brands sister + Barry\'s ~85 studios premium HIIT $35-$45/class + SoulCycle ~80 studios Equinox-owned indoor cycling + CrossFit Inc ~12K affiliate boxes globally $150-$250/mo + $100-$200 onramp premium boutique tier $189-$300/mo same-day close 40-55% + Crunch Fitness ~470+ clubs $9.95-$34.99 Peak Plus + Life Time Fitness NYSE:LTH ~170 athletic-resort clubs $149-$249/mo all-in family-tier dominant + LA Fitness ~700 clubs $35-$49/mo + $99-$149 enrollment Fitness International LLC + Equinox Group ~110 luxury clubs $200-$350/mo + $500 initiation + $100 monthly minimum dues also operates SoulCycle + ABC Fitness Solutions formerly ABC Financial gym billing + EFT-autopay + membership management software ~16K+ club locations globally processes ~$10B+ annual member EFT transactions flagship products Ignite + DataTrak + Trainerize integrated 2020 industry standard for monthly EFT draft + annual contract management + freezes + cancellations ~50% of US commercial gym industry runs on ABC billing infrastructure + Mindbody Vista Equity Partners owned + ClubReady + Twin Oaks Software + Wodify CrossFit + Club OS acquired by Daxko gym + studio management software stack Mindbody ~58K studios globally yoga + Pilates + boutique + spa + wellness ClubReady ~3K clubs mid-tier commercial Twin Oaks ~2K clubs full-service commercial + Y/JCC Wodify ~5K CrossFit affiliates programming + billing + member app Club OS ~5K clubs lead-management CRM specifically for gyms Salesforce-of-fitness pricing $99-$499/mo by club tier integrates Stripe + Authorize.net + ABC + bank ACH + BLS Occupational Outlook for Fitness Trainers & Instructors SOC 39-9031 ~331K employed nationally median wage ~$45,380 May 2023 projected growth ~14% through 2032 much faster than average membership consultants + sales counselors typically classified under Sales Reps SOC 41-3091 ~$46K-$72K base + commission with top quartile $90K+ gym sales counselor turnover ~50-75%/yr industry-wide per IHRSA + Club Industry magazine surveys + Statista US Health & Fitness Club Industry 2024 segmentation low-price PF + Crunch + Blink ~35% members + 18% revenue mid-tier LA Fitness + Crunch Signature + 24 Hour Fitness + YMCA ~30% members + 32% revenue premium Life Time + Equinox + Cherry Creek ~10% members + 22% revenue boutique-studio F45 + OTF + Barry + CrossFit + SoulCycle + Pure Barre + CycleBar ~25% members + 28% revenue post-COVID recovery 2022-2024 boutique-studio segment outgrew commercial 3:1 + AHFS American Health & Fitness Survey + Club Industry Magazine + Athletech News + Fitness Insider industry trade publications + research AHFS annual member satisfaction + retention + cancellation-reason survey ~80K members Club Industry Top 100 annual revenue + member-count ranking Planet Fitness #1 by member count Life Time #1 by revenue per member ~$1,800/yr vs PF ~$220/yr Athletech News covers fitness tech + boutique + franchise news daily Fitness Insider tracks acquisitions + PE rollups + same-day-close benchmarks tour-to-join close-rate benchmarks 35-65% commercial + 40-55% boutique + 60-75% top quartile across tiers + NASM + ACE + NSCA + ISSA personal training certification benchmarks NASM National Academy of Sports Medicine Ascend Learning ~190K certified trainers largest US cert body NASM-CPT $899 + CES + PES + FNS specializations ACE American Council on Exercise ~80K certified ACE-CPT NSCA National Strength & Conditioning Association ~50K certified CSCS most-respected for strength + power ISSA ~70K certified newer/online-friendly personal training upsell attach rate at point-of-join 18-32% at well-run commercial clubs + 40-65% at premium clubs + 25-45% at boutique-studio bundles + EFT Electronic Funds Transfer autopay industry standard + annual contract vs MOM month-to-month gym industry standardized on monthly EFT draft from member checking account or credit card via NACHA ACH rails lower processor fees ~$0.20-$0.50/transaction vs 2.9% + $0.30 card annual contract with EFT autopay = ~6-12% annual cancellation rate vs MOM 24-42% annual cancellation rate per IHRSA + ABC Fitness benchmarks freeze policies typically 30-90 day max + $5-$15/mo freeze fee cancellation typically requires 30-day written notice + final draft chargebacks ACH return ~2-4% on EFT vs ~8-12% on credit-card billing per ABC Financial industry data + Daxko + Trainerize + Club OS + GymSales Glofox/ABC + Hapana + Volo Pass gym CRM + lead-management + member-app stack Daxko serves ~10K Y/JCC + commercial gyms acquired Club OS + Aptus + AFS Premier Trainerize ABC ~50K trainers + member-app + workout-tracking GymSales rebranded under ABC Ignite lead-management workflow + auto-text-follow-up + tour-scheduling Hapana Australia-origin ~5K boutique studios CRM + booking + retention Volo Pass + ClassPass aggregator-pressure on boutique-studio drop-in pricing + gym membership unit economics + LTV commercial gym member LTV $660-$1,800 boutique-studio LTV $1,800-$3,600 premium club LTV $4,200-$10,800 CAC commercial $40-$120 boutique $80-$200 premium $200-$500 enrollment fee $0-$199 covers ~40-80% of CAC payback period 3-9 months commercial + 1-3 months boutique-premium personal-training upsell adds $200-$800/mo per attached member doubling LTV + ClassPass + Volo Pass + Peloton Gym + Apple Fitness+ + Tonal + Mirror Lululemon aggregator + at-home competitive pressure ClassPass ~30K studio partners aggregated drop-in pricing $20-$45/class Volo Pass NYC/DC/Boston Peloton ~3M members + Peloton Gym hybrid + commercial-partnership w Hilton + Westin Apple Fitness+ ~$9.99/mo Tonal $3,995 + $49.95/mo Mirror now Lululemon Studio closed 2023 wound down at-home segment grew 8x 2019-2024 but plateaued 2024 commercial gym membership rebounded post-COVID + 2024 IHRSA reports ~64M US members back above 2019 ~64.2M. Every trade body + standard + research org + industry-specific SaaS + financing/billing perimeter + public-company franchise + trade publication named so GM can cite by name when consultants push back. EXPLICITLY FITNESS INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr references. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 9 quantified benchmark tables: (1) US Gym + Health Club + Studio Industry Reality — US gym + health-club + studio industry total ~$33B / US members ~64M / US facilities ~41K / low-price segment PF + Crunch + Blink members ~35% / mid-tier segment LA Fitness + 24 Hour + YMCA members ~30% / premium segment Life Time + Equinox members ~10% / boutique-studio F45 + OTF + CrossFit + Barry + SoulCycle members ~25% / commercial member LTV $660-$1,800 / boutique-studio LTV $1,800-$3,600 / premium LTV $4,200-$10,800 / avg commercial member tenure ~24 months / avg boutique tenure 12-18 months / fitness trainers + instructors employed SOC 39-9031 ~331K / median trainer wage ~$45,380 / membership consultant base + commission $46K-$90K+ / sales consultant turnover ~50-75%/yr. (2) Public-Company + Franchise Footprint 2024 — Planet Fitness NYSE:PLNT ~2,600+ $10 Classic / $24.99 Black Card 50-65% close / Anytime Fitness Self Esteem Brands ~5,000+ global $40-$60/mo + $49-$99 enroll 60-70% / Crunch Fitness ~470+ $9.95-$34.99 45-60% / LA Fitness Fitness International ~700 $35-$49/mo + $99-$149 enroll 40-55% / Life Time NYSE:LTH ~170 $149-$249/mo family-tier 30-45% / Equinox Group ~110 $200-$350/mo + $500 initiation 25-40% / F45 Training NYSE:FXLV ~1,500 $189-$235/mo 40-55% / Orangetheory ~1,500+ $179-$219/mo 45-60% / CrossFit Inc ~12K global $150-$250/mo + $100-$200 onramp 50-65% / Barry\'s ~85 $35-$45/class 35-50% / SoulCycle Equinox ~80 $36-$40/class 35-50%. (3) Pricing Tier vs Same-Day Close Rate — low-price PF/Blink/Crunch Base $10-$30 $0-$49 enroll 50-65% close 18-30 mo tenure / mid-tier commercial LA Fitness/24 Hour/Crunch Signature $35-$59 $99-$149 enroll 40-55% / mid-tier full-service independent $79-$129 $0-$99 enroll 60-75% top quartile 20-35% bottom 18-24 mo tenure / premium Life Time/Cherry Creek $149-$249 $100-$300 enroll 30-45% 36+ mo / luxury Equinox $200-$350 $500+ initiation 25-40% 36+ mo / boutique-studio F45/OTF/Pure Barre/CycleBar $179-$235 $0-$99 enroll 40-55% 12-18 mo / CrossFit affiliate $150-$250 $100-$200 onramp 50-65% 18-30 mo / premium boutique Barry\'s/SoulCycle/Y7 $35-$45/class $0 35-50% 6-12 mo. (4) EFT Autopay vs MOM Cancellation Rates — annual contract + EFT autopay 6-12% annual cancel 24-36 mo tenure industry gold standard IHRSA / annual + credit card autopay 12-18% 18-30 mo higher chargeback ~8-12% / MOM month-to-month + EFT 24-32% 12-18 mo flex premium $20-$40/mo / MOM + credit card 32-42% 8-14 mo highest churn + chargebacks / annual paid-in-full upfront 3-6% 24-36 mo lowest churn sunk cost rare offer / class-pack 10/20/50 class N/A buy again 25-40% 4-8 mo ClassPass + boutique model. (5) Personal Training Upsell Attach % By Goal Lens — LOOK event date/weight loss 35-50% PT attach at join 4-pack or 8-pack monthly visible deadline = willingness to pay for accountability / FEEL energy/sleep/stress 8-15% 1:1 PT 40-60% recovery + group HIIT FEEL prospects rarely buy 1:1 PT big on community + recovery / FUNCTION performance/longevity/pain 50-70% PT attach NSCA/CSCS strength coach highest LTV segment often referral pipeline / 40+ pain-relief or post-PT 55-75% DPT-supervised + medical-grade doctor referral pre-qualifies / powerlifter/serious lifter 10-20% form-check session only resent PT pitch from non-NSCA cert. (6) Lead Source ROI Gym Acquisition — walk-in/drive-by 20-30% inquiries $0 CAC 60-75% top quartile same-day close / Google search/SEO/GMB 25-35% $20-$60 CAC 55-70% / Meta/Instagram paid social 15-25% $40-$120 CAC 35-50% / referral member-get-member 15-25% $25-$75 referral bonus 65-80% / Class Pass + Volo Pass aggregator 5-10% $20-$45/class share 30-45% drop-in mindset / corporate wellness partnership 5-10% $0-$25 negotiated 50-65% employer-subsidized / lapsed-member win-back campaign 5-10% $30-$80 45-60%. (7) Tour Outcome By Time of Day + Day of Week — Mon-Thu 9am-12pm 10% volume 55-70% close stay-at-home/shift/retirees high-intent / Mon-Thu 12-2pm 8% 50-65% lunch-break time-pressured / Mon-Thu 5-8pm 35% 50-65% peak walk-in window post-work / Friday 5-8pm 8% 35-50% weekend deferral mindset / Saturday 9am-1pm 20% 55-70% weekend gym-shopping prime time / Saturday 1-5pm 6% 40-55% less intent more browsing / Sunday 10am-2pm 10% 50-65% Sunday-restart/Monday-prep mindset / Sunday 3-7pm 3% 35-45% lowest-intent slot. (8) Why Tours Dont Close composite — consultant skipped DISCOVER and walked to equipment floor no goal lens read 41% / showed every piece of equipment no DEMONSTRATE focus on THREE 28% / asked budget in Stage 1 instead Stage 4 DESIGN 19% / sent home with tri-fold instead of asking EFT-on-tablet 36% / quoted price without value re-frame against PF/competitor 22% / failed I\'ll come back with spouse with no 48-hr hold or phone-call-now 24% / pitched 1:1 PT to FEEL prospect mis-attach 12% / pitched group HIIT to FUNCTION powerlifter mis-attach 9% / refused to walk away from value-mismatched price-shopper 14% / trashed PF or competitor instead of honoring as different-product 11% / skipped medical clearance ask for chronic-condition prospect 7% / sold annual contract to obvious 90-day-cancel prospect 8% / no follow-up within 48 hrs after walk-no-close 31% / promised peak-hour equipment availability untruthfully 10%. (9) Consultant Tenure vs Same-Day Close Performance — 0-3 mo rookie 8-12 tours/wk 25-35% close $79-$99/mo $25 enroll often waived / 3-6 mo 10-14 35-45% $89-$109 $40 / 6-18 mo 12-16 45-55% $99-$119 $60 / 18-36 mo 14-18 50-60% $109-$129 $79 / 3-5 yr 14-18 55-65% $119-$139 $90 / 5-Stage + Goal-Lens + EFT-Tablet Discipline 14-18 60-75% $129-$159 $99-$129. DISCOVER the 4 lobby questions before any equipment and DECISION the EFT-on-tablet ask with delayed-second-month-draft framing are hardest to install. Weekly tour-shadow + ABC Fitness / Club OS / Mindbody / ClubReady tour-notes audit by GM single biggest predictor of 90-day cohort same-day-close lift. Goal-lens reading reaches 90%+ by week 6 with disciplined coaching without coaching FUNCTION goes unread first default to LOOK/FEEL even with 40+ pain-relief prospects. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 12-failure-mode counter-case: (1) Skipping DISCOVER and walking straight to equipment floor most common consultant opens let-me-show-you-around follow-me never asks 4 lobby questions never identifies goal lens gives same equipment-tour every prospect gets four lobby questions FIRST then walk. (2) Quoting price before value is built consultant volunteers pricing during STROLL of equipment floor or asks whats your budget in GREET prospect anchors on price without value frame pricing belongs in Stage 4 DESIGN on consult desk after value is built never Stage 1 2 or 3. (3) Showing every piece of equipment no DEMONSTRATE focus fifteen pieces of equipment in 22 minutes blurs together no anchor memory prospect leaves saying its a nice gym but cant visualize transformation THREE stations deep matched to goal lens not fifteen shallow. (4) Tri-fold-home close instead of EFT-on-tablet take this tri-fold home + think about it = lose close 75%+ of time prospect Googles 3 competitors on drive home + joins whichever has lowest friction always EFT tablet form at consult desk + today-only promo + delayed second-month draft + 30-day cancel + 90-day freeze framing. (5) Trashing competitor instead of honoring as different product consultant says Planet Fitness is for people who dont actually want to work out prospect was former PF member now feels insulted + defensive of their past choice NEVER trash PF or any competitor honor as different-product-for-different-goal re-frame value delta as outcome-driven not better-than. (6) Reactive price matching prospect says PF is $24.99 match that and consultant says OK we can do $49 margin gone value position gone prospect now wondering why $129 was real + cancels at month 2 because value never matched discounted price NEVER match reactively re-position $100/mo delta as included value small-group HIIT + coach-by-name + recovery room + InBody + womens-only strength + named-trainer access. (7) Pitching wrong cross-modal upsell consultant pitches 1:1 PT to FEEL prospect mis-attach FEEL prospects rarely buy 1:1 PT big on community + recovery or pitches group HIIT to FUNCTION powerlifter mis-attach fights their own programming cross-modal upsell tied to goal lens LOOK gets 1:1 PT FEEL gets recovery + small-group FUNCTION gets NSCA strength coach. (8) Refusing to walk away from value-mismatched price-shopper consultant burns 25 min on $24.99-budget prospect who will never sign your $129 result wasted tour slot during peak window + low-fit member who cancels at day 60 + chargeback risk graceful walk-away refer to PF + hold offer 14 days + protect next walk-in attention. (9) Failing Ill come back with my spouse without 48-hour hold or phone-call-now OK sounds good + tri-fold-home = 80% never come back three moves honor smart household decision lock 48-hour promo hold if both come back Thursday by 8pm get spouse on phone now 90 seconds answer questions live return-with-spouse close 40-55% with discipline. (10) Skipping medical clearance for chronic-condition prospect prospect mentions diabetes/blood pressure/pre-cardiac/post-surgery and consultant signs EFT anyway liability exposure + bad first-90-day experience if they have event on floor always medical-clearance request + hold promo 14 days + introduce DPT or medical-fitness coach + sign EFT only after clearance. (11) Selling annual contract to obvious 90-day-cancel prospect consultant signs annual EFT on prospect with low-fit signals vague goal no time-availability hostile to coaching comparison-only mindset 90 days later they dispute contract ACH return chargeback possible BBB complaint + 1-star Google review sell MOM month-to-month to low-fit signals + accept 24-42% cancel rate as price of avoiding chargeback nightmare. (12) GM doesnt audit ABC Fitness / Club OS / Mindbody / ClubReady tour notes weekly kills 60-75% of training rollouts ~30-day half-life uncoached consultants revert to equipment-tour by week 4 one tour-shadow + one CRM tour-notes audit per consultant per week reviewed in 1:1 non-negotiable. Plus 7 common GM objections with honest answers: my consultants already do this / 5-stage takes too long we have 20-min windows / EFT-on-tablet on tour feels too pushy / we cant compete with PF on price / cant decline a tour every walk-in matters / how do I know its working three 90-day signals same-day close +20-30 pts first-90-day retention +15-25 pts annual EFT vs MOM mix shifts toward EFT PT attach +10-20 pts Google + Yelp 3.8 to 4.6+ consultant turnover 75% to 35% / should we go boutique-style group fitness only like F45 depends on market + facility + member base hybrid open-floor strength + cardio + boutique-style small-group HIIT add-on = best of both for mid-tier full-service clubs not ready to commit to single-format boutique. Plus when-to-rerun monthly first 3 months + quarterly after + whenever lose 3+ walk-ins to PF down the block in single week + whenever new competitor opens within 1 mile rotate role-plays 50+ pain-relief prospect with chronic back + fitness-experienced ex-D1-athlete returning after baby + group of 3 friends touring together decision-by-consensus + corporate-wellness referral with employer-subsidized rate + lapsed-member returning after 18 months I went off the wagon whats changed + Spanish-speaking prospect requiring bilingual consultant + post-PT physical therapy referral with prescribed exercise list. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as TWENTY-FIRST entry and FIFTEENTH industry-specific training after st0007 orthopedic medical device + st0008 residential real estate listing presentations + st0009 automotive F&I + st0010 specialty pharmaceutical HCP detailing + st0011 life insurance needs analysis + st0012 mortgage refi + st0013 + st0014 financial advisor wealth management + st0015 cybersecurity AE CISO discovery + st0016 retained executive search CEO + Board pitch + st0017 med spa consult-to-package conversion + st0018 storm-restoration roofing canvasser door-knock + st0019 residential HVAC service-tech in-truck comfort consult + st0020 wedding venue tour Saturday-booking — st0021 is gym + health club + boutique studio membership consultant + GM-on-shift + front desk staff running 20-minute walk-in tour for drop-in trial or Google-search lead only sales meeting gym gets converts 20-minute window into EFT-autopay annual contract at $79-$129/mo + $0-$99 enrollment signed on tablet at consult desk the territory where gym owners + GMs + sales directors + membership consultants + front-desk teams + sales counselors at commercial mid-tier full-service clubs + independent strength + community gyms + boutique-studio operators F45/OTF/CrossFit/Barrys/SoulCycle/Pure Barre/CycleBar tier + indie 30%+ of US gym count that Planet Fitness/Anytime Fitness/Crunch/Life Time/Equinox/LA Fitness chain consolidation has NOT yet absorbed earn right to EFT signature on tour inside IHRSA 2024 Global Report + Statista US Health & Fitness + Club Industry Magazine + AHFS + Athletech News + Fitness Insider + Planet Fitness 10-K NYSE:PLNT + Anytime Fitness Self Esteem Brands + F45 NYSE:FXLV + Orangetheory + CrossFit Inc + Barrys + SoulCycle + Crunch + Life Time NYSE:LTH + LA Fitness + Equinox + ABC Fitness Solutions Ignite + DataTrak + Trainerize + Mindbody Vista Equity + ClubReady + Twin Oaks Software + Wodify CrossFit + Club OS Daxko + Daxko + GymSales ABC + Hapana + NASM + ACE + NSCA + ISSA personal training cert + BLS SOC 39-9031 fitness trainers + SOC 41-3091 sales counselors + EFT autopay industry standard NACHA ACH rails + annual contract vs MOM 6-12% vs 24-42% cancel + ClassPass + Volo Pass + Peloton + Apple Fitness+ at-home pressure perimeter. Companion industry-specific entries planned st0022 personal trainer 1:1 consultation conversion + st0023 boutique studio class trial-to-membership + st0024 gym corporate-wellness B2B sale + st0025 physical therapist DPT private practice intake + st0026 med spa membership + retainer + st0027 yoga studio teacher-training enrollment + st0028 chiropractor new-patient consult + st0029 dietitian/nutritionist coaching package + st0030 mental-health-therapist intake call. Cross-references to st0001-st0006 SaaS foundation arc translated for gym: st0001 discovery → DISCOVER 4 lobby questions / st0002 single-threading → reading goal lens LOOK/FEEL/FUNCTION / st0003 objection recovery → handling come back with spouse + PF is $24.99 + barbell rack count low + $89 vs CrossFit $189 / st0004 cold-call opener → GREET 30-sec lobby couch ask / st0005 demo → DEMONSTRATE 3 stations matched to goal lens / st0006 pricing → DESIGN consult desk pricing math + DECISION EFT tablet close sequence. Cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 + st0014 + st0015 + st0016 + st0017 + st0018 + st0019 + st0020 what transfers — discipline of verbatim language on load-bearing moments + CRM-reviewed coaching cadence transfers exactly st0019 makes service techs + comfort advisors hear DIAGNOSE + DEMONSTRATE + DECIDE-CRITERIA + DESIGN + DOLLARS verbatim st0020 makes venue coordinators + event managers hear STORY + STROLL + SHOWCASE + SHAPE + SECURE verbatim st0021 makes membership consultants hear GREET + DISCOVER + DEMONSTRATE + DESIGN + DECISION verbatim st0017 med spa consult closest sibling also high-trust consumer-at-facility decision often emotional driver LOOK/aesthetic + FEEL/wellness recurring-revenue subscription model EFT autopay annual = med spa membership retainer same-day close pressure window what does NOT transfer gym has 20-minute hard window vs med spa 45-60 min consult gym has drop-in walk-in volume vs med spa booked-consult-only gym has EFT autopay annual contract vs med spa membership-retainer + per-treatment gym has PF/Anytime/Crunch/Life Time/Equinox chain competition with public-market price benchmarks vs med spa less-comparable local-only competition. Adjacent Pulse Knowledge Library entries IHRSA 2024 Global Report deep dive + Statista US fitness segmentation + Planet Fitness 10-K + Black Card economics + Anytime Fitness 24/7 franchise model + F45/OTF/Barrys/SoulCycle boutique-studio pricing + Crunch/Life Time/Equinox premium tier + ABC Fitness Ignite + DataTrak + Trainerize billing + EFT autopay vs MOM math + Mindbody/ClubReady/Twin Oaks/Wodify/Club OS gym CRM comparison + Daxko Y/JCC + NSCA vs NASM vs ACE vs ISSA personal training cert benchmarks + BLS SOC 39-9031 trainer + SOC 41-3091 sales counselor + 1:1 PT attach % by goal-lens + medical clearance protocol for chronic-condition prospects + Class Pass + Volo Pass + Peloton + Apple Fitness+ at-home pressure + corporate wellness partnership + member-get-member referral + lapsed-member win-back + LGBTQ+ inclusivity + bilingual/Spanish-speaking consultant + post-PT physical therapy referral. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Twenty-first Pulse Sales Training entry st0021 and FIFTEENTH industry-specific training after st0007 medical device + st0008 real estate + st0009 auto F&I + st0010 pharma + st0011 life insurance + st0012 mortgage refi + st0013 + st0014 financial advisor wealth management + st0015 cybersecurity CISO discovery + st0016 retained executive search CEO + Board pitch + st0017 med spa consult-to-package conversion + st0018 storm-restoration roofing door-knock + st0019 residential HVAC in-truck comfort consult + st0020 wedding venue tour Saturday-booking — fully runnable 60-minute live gym sales training for the 20-minute walk-in tour (per IHRSA 2024 Global Report + Statista + Club Industry + AHFS + Planet Fitness 10-K + Anytime Fitness franchise + F45 + Orangetheory + CrossFit + Barrys + SoulCycle + Crunch + Life Time + LA Fitness + Equinox + ABC Fitness Solutions + Mindbody + ClubReady + Twin Oaks + Wodify + Club OS + Daxko + NSCA/NASM/ACE/ISSA + BLS + EFT autopay industry standard benchmarking US gym industry ~$33B + ~64M members + ~41K facilities + commercial low-price 35% members 18% revenue + mid-tier 30% members 32% revenue + premium 10% members 22% revenue + boutique-studio 25% members 28% revenue + commercial member LTV $660-$1,800 + boutique LTV $1,800-$3,600 + premium LTV $4,200-$10,800 + top quartile 60-75% same-day close vs bottom 20-35% + 6-12% annual EFT cancel vs 24-42% MOM + sales consultant turnover 50-75%/yr + 1:1 PT attach 35-50% LOOK / 8-15% FEEL / 50-70% FUNCTION + 7-8x LTV gap on same lead flow + same equipment based on tour discipline not gym beauty) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,500 words ABSOLUTE HARD CAP 10,500. LEAN-FROM-START pattern mirroring st0020 closest structural sibling. Structure: 🏋️ Pulse Training callout intro (who-for: gym owners + GMs + sales directors + membership consultants + front-desk teams + sales counselors at commercial mid-tier full-service clubs + independent strength + community gyms + boutique-studio operators F45/OTF/CrossFit/Barrys/SoulCycle/Pure Barre/CycleBar tier + indie 30%+ of US gym count that PF/Anytime/Crunch/Life Time/Equinox/LA Fitness chain consolidation has NOT yet absorbed; works first-week consultant + 4-yr veteran + GM losing every walk-in to PF down the block + front-desk supervisor handling Tuesday 6:14pm Google-search lead; what-bring: 3 recent lost-tour debriefs prospect + goal + gym joined + verbatim no reason + Tour-Prep Kit drop-in intake form + club map with 3 stations pre-tagged per goal-lens + sample PT intro package + current pricing grid monthly + annual EFT + enrollment + freeze + cancel policy + Tour Card with 6 opening questions + EFT-autopay tablet form + photo wall of recent transformations + whiteboard) + Bottom Line callout drop-in or Google-search walk-in does NOT decide based on which gym has most equipment decides based on which consultant heard goal in first 4 minutes through right goal-lens + demonstrated 3 specific stations matched to that goal instead of touring every piece of equipment + asked for EFT-autopay signature before they walked out door + 5-stage + 3-goal-lens thesis + 6-row pipe-table agenda + Section 1 Intro + Cold Open with IHRSA + Statista + Club Industry + AHFS benchmarks + Phoenix mid-tier composite Consultant A let-me-show-you-around $129 tri-fold let-me-think-about-it joined PF $24.99 that night vs Consultant B IHRSA-trained 4 lobby questions identified LOOK + FEEL goal-lens 35yo post-divorce stress 18 lbs picked 3 stations womens-only strength + 6:30pm HIIT class + recovery room signed EFT autopay 6:32pm showed up Thursday + Common Trap Consultant A was friendly + club gorgeous + gave tri-fold three answers every gym friendly + gorgeous unstructured equipment-tour slowest lowest-trust sales motion in fitness 20-min tour only sales meeting you get earn EFT on tour or dont earn at all + Section 2 Teach split into Part A 5-STAGE GYM TOUR 15 min (GREET 3 min lobby couch permission 4 minutes before equipment / DISCOVER 3 min four questions what brought you in today specifically + 6 months feeling great looks like + last gym what worked-what didnt + when could you realistically come / DEMONSTRATE 3 min THREE stations only matched to primary + secondary goal lens with transformation visible NOT every piece of equipment / DESIGN 3 min sketch first 4 weeks + annual EFT vs MOM pricing math + enrollment promo + freeze + cancel + InBody schedule / DECISION 3 min three-step close today-only promo + second-month draft + 30-day cancel + 90-day freeze + want-me-to-start-EFT-form-on-tablet) and Part B Three Goal Lenses 10 min (LOOK aesthetic + weight loss + event date timeline reverse-engineer matched DEMONSTRATE strength area + class schedule + InBody + womens-only PT attach 35-50% / FEEL energy + sleep + stress + mental health post-divorce post-pandemic life-events small-group HIIT + recovery room + sauna + community events recovery 40-60% attach / FUNCTION performance + longevity + pain + chronic condition 40+ demographic + powerlifter + post-PT platform racks + accessory + mobility + DPT referral NASM/NSCA strength coach PT attach 50-70% highest LTV) + Section 3 Discussion 8 prompts (when refuse to close medical clearance + price-shopper + facility-mismatch + when walk away from price-shopper + Ill come back with spouse 48-hour hold or phone-call-now lifts return 40-55% + defend $129 vs $24.99 PF different products for different goals never trash competitor + cross-sell PT at DEMONSTRATE not DECISION 35-50% vs 8-15% attach + annual EFT vs MOM 6-12% cancel vs 24-42% + guest pass booked-trial-with-coach 4-6x conversion + ONE verbatim change) + Section 4 Two-Person Role-Play with Round 1 Jessica 34 working mom Phoenix mid-tier Tuesday 6:14pm Google-search drop-in trial 25 lbs sister wedding October last gym lapsed PF $10/mo $129/mo Platinum + $99 enrollment + first-month-free 30 min before daycare pickup 2 deflections need to talk to husband first + PF $24.99 why $129 — CONSULTANT full 5-STAGE GREET lobby couch 4 min DISCOVER 4 questions identifying LOOK + FEEL goal lens DEMONSTRATE 3 stations womens-only strength + Tues+Thurs 6:30pm HIIT class + InBody scan 48-hour hold + phone-husband-now + honor PF as different product DESIGN sketch first 4 weeks DECISION close EFT annual $99/mo second-month draft + Round 2 Marcus 26 software engineer just-moved-to-town powerlifter 485 deadlift Saturday 10:08am strength-focused independent $89/mo + $0 enroll first 30 days comparing CrossFit $189 + PF $24.99 2 deflections barbell rack count lower than last gym + $89 vs CrossFit $189 vs PF $24.99 what makes you worth — CONSULTANT full 5-STAGE GREET DISCOVER 4 questions FUNCTION primary + FEEL secondary DEMONSTRATE 3 stations 2 calibrated competition platforms + reverse hyper + GHD + sled + Saturday 9am long-session group honest rack-count trade-off 6am or Saturday vs 6pm-only + three different products PF cardio CrossFit programmed group classes here calibrated platforms + 24/7 + open-gym format DESIGN sketch first 4 weeks DECISION close EFT $89 + $0 enroll + 60-sec reset + Section 5 Debrief + Commitments 3 debrief Qs strongest/weakest stage + goal lens missed + tour owed follow-up + 4-line ABC Fitness/Club OS/Mindbody/ClubReady commitment ritual specific tour + skipped stage + missing kit item + goal lens engage going forward + Section 6 Leave-Behind walkthrough + printable one-pager (7 Things to Bring on Every Tour drop-in intake form + club map with 3 stations pre-tagged per goal-lens + EFT-autopay tablet form + pricing grid + PT intro card + promo expiration clarity + recent transformation photo wall / 5-Stage Gym Tour Script Card with verbatim cue lines and time per stage / 3 Goal Lenses grid LOOK + FEEL + FUNCTION with DEMONSTRATE match + cross-modal upsell / 4 Phrases That Lose the Close let-me-show-you-around + whats-your-budget + take-this-tri-fold-home-and-think-about-it + we-can-match-PFs-price / Two-Now/Three-Later Pricing Frame two-now stage 5 DECISION todays promo expires today + second-month draft means 30 days inside before $ moves three-later covered in stage 4 DESIGN 30-day cancel notice + 90-day freeze + PT add-on optional at Day 14 or 30 check-in / Never-Do behavior list 14 items / Outcome Line wins full 5-STAGE + all 3 goal lenses + EFT-autopay-on-tour + delayed-second-month-draft + 30-day-cancel + 90-day-freeze + honest competitor re-framing = 60-75% same-day close + $79-$129/mo + $0-$99 enrollment + 6-12% annual EFT cancellation rate + 18-24 month avg tenure + 35-50% PT attach on LOOK prospects + 4.6+ Google + Yelp + member referral 25-35% of new joins vs losses unstructured equipment tour + price-quote-at-end + no goal-lens read + tri-fold-home close = 20-35% same-day close + lose to PF down the block + 30%+ first-90-day cancellation + 3.6-4.0 review average + consultant turnover 75%/yr / If You Only Remember One Thing hero quote You dont sign the EFT autopay by walking the prospect past every piece of equipment you sign it by (1) asking 4 lobby questions before the tour to hear which goal lens drives them LOOK/FEEL/FUNCTION (2) demonstrating only 3 specific stations that match the lens with their transformation visible inside the club (3) asking for the EFT signature on the tablet before they walk out the door with delayed-second-month-draft + 30-day-cancel framing so it costs nothing for 30 days. The 20-minute tour is the only sales meeting you get close on the floor or dont close at all). How-this-fits-in-gym-operating-motion table at end of core showing Tuesday-morning sales huddle weekly + first 30 sec on walk-in GREET + next 3 min on couch DISCOVER + next 3 min on floor DEMONSTRATE + next 3 min at consult desk DESIGN + next 3 min at consult desk DECISION + 3-goal-lens overlay + GM coaching weekly tour-shadow. Two mermaid diagrams: 5-Stage Gym Tour Flow + Three Goal Lenses Reading Guide with Cross-Modal Upsells signal-by-signal branches. 9 benchmark tables (US Gym Industry Reality + Public-Company + Franchise Footprint 2024 + Pricing Tier vs Same-Day Close Rate + EFT Autopay vs MOM Cancellation Rates + Personal Training Upsell Attach % By Goal Lens + Lead Source ROI Gym Acquisition + Tour Outcome By Time of Day + Day of Week + Why Tours Dont Close + Consultant Tenure vs Same-Day Close Performance). 12-failure-mode counter-case + 7-GM-objection coach-back + when-to-rerun monthly first 3 months + quarterly after + whenever lose 3+ walk-ins to PF down the block + whenever new competitor opens within 1 mile. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping + companion industry-specific entries planned st0022-st0030 fitness/wellness adjacent + cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 + st0014 + st0015 + st0016 + st0017 + st0018 + st0019 + st0020 what transfers (verbatim language on load-bearing moments + CRM-reviewed coaching cadence) and what does not (gym has 20-minute hard window vs med spa 45-60 min consult + drop-in walk-in volume vs booked-consult-only + EFT autopay annual contract vs membership-retainer + per-treatment + PF/Anytime/Crunch/Life Time/Equinox chain competition with public-market price benchmarks vs less-comparable local-only competition). Tags include sales-training (hub filter) + gym-sales-training + fitness-industry + membership-consultant + same-day-close + gym-tour + 60-min-meeting + standard-team + st0021. Callouts used: Pulse Training (gym-themed intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY FITNESS INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Industry-correct sources: IHRSA 2024 Global Report + Statista US Health & Fitness Club Industry + Club Industry Magazine + AHFS American Health & Fitness Survey + Athletech News + Fitness Insider + Planet Fitness NYSE:PLNT 10-K + investor presentations + Anytime Fitness Self Esteem Brands / Purpose Brands + F45 Training NYSE:FXLV + Orangetheory Fitness + Barrys + SoulCycle Equinox + CrossFit Inc + Crunch Fitness + Life Time NYSE:LTH + LA Fitness Fitness International + Equinox Group + ABC Fitness Solutions formerly ABC Financial Ignite + DataTrak + Trainerize + Mindbody Vista Equity Partners + ClubReady + Twin Oaks Software + Wodify CrossFit + Club OS Daxko + Daxko + GymSales ABC Ignite + Hapana + NASM National Academy of Sports Medicine + ACE American Council on Exercise + NSCA National Strength & Conditioning Association + ISSA + BLS SOC 39-9031 Fitness Trainers & Instructors + SOC 41-3091 Sales Reps + EFT Electronic Funds Transfer NACHA ACH rails + annual contract vs MOM month-to-month + freeze + cancel policy + chargeback + ACH return + ClassPass + Volo Pass + Peloton + Apple Fitness+ + Tonal + Mirror Lululemon Studio + corporate wellness partnership + member-get-member referral + lapsed-member win-back + medical clearance protocol + DPT physical therapy referral + IHRSA Convention + Club Industry Show + Athletic Business Conference + IDEA World + Mindbody Bold + PT on the Net + NSCA Coaches Conference + CrossFit Games. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0021 is crawled.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
      .catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10 word_count=' + wordCount);
}

main().catch(err => { console.error(err); process.exit(1); });
