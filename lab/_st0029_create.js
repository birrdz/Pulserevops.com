// st0029 -- Commercial Janitorial Service-Contract Bid Walk (Multi-Tenant
// Office / Class A Building) 2027. Pulse Sales Trainings entry (route:
// /sales-trainings/st0029, tag: sales-training). TWENTY-NINTH entry,
// TWENTY-THIRD industry-specific training after st0007-st0028. Industry =
// commercial janitorial / building-services account rep walking a Property
// Manager / Facilities Director / Building Owner / Procurement through a
// janitorial service-contract bid right when they're comparison-shopping
// after a tenant-complaint escalation OR a multi-building portfolio rebid.
// Touches OSHA + GBAC STAR + CIMS (Cleaning Industry Management Standard,
// ISSA) + LEED O+M + ISSA Value of Clean + green-cleaning (Green Seal /
// EcoLogo) + workloading (ISSA 612 cleaning-times) + day-cleaning vs
// night-cleaning + the "scope-creep specials" trap. Five fixed sections.
//
// NOTE: this entry does NOT use polish-helper/runPolish. The shell is
// written directly to the blob at quality_score 5 (st#### ids are rejected
// by pulse-blob-writer), then the polish ladder 5->6->7->8->9 is walked via
// HTTP POSTs to pulse-blob-polish (which accepts st#### ids). STOP at qs9.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ID = 'st0029';
const QUESTION = "Commercial Janitorial Service-Contract Bid Walk (Class A Office Building) 2027 — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'st0029',
  'commercial-janitorial-bid-walk-training',
  'commercial-janitorial',
  'building-services',
  'office-cleaning-contract',
  'janitorial-service-contract-bid',
  'cims-iso-issa',
  'gbac-star',
  'green-cleaning',
  'workloading-issa-612',
  'facility-management',
  '60-min-meeting',
  'standard-team'
];

const sources = [
  { title: 'ISSA — The Worldwide Cleaning Industry Association (Rosemont IL, ~10,500 member companies, CEO John Barrett) — the dominant trade body for commercial janitorial / building-service contractors (BSCs), distributors, and manufacturers. ISSA owns CIMS (Cleaning Industry Management Standard) + CIMS-GB (Green Building) third-party certification, the ISSA Cleaning Times / ISSA 612 workloading standard, the Value of Clean research program, and the GBAC (Global Biorisk Advisory Council) division running GBAC STAR facility accreditation. Per ISSA + IBISWorld, the US Janitorial Services industry is ~$90B+ in 2024, ~1.2M+ workers, ~40-55% of cost in direct labor, with the top consolidators (ABM, Aramark, Sodexo, ISS, C&W Services, Pritchard, SBM) holding only a low double-digit combined share — a deeply fragmented market where mid-market regional BSCs win on bid-walk discipline.', url: 'https://www.issa.com/' },
  { title: 'ABM Industries NYSE:ABM (CEO Scott Salmirs, New York NY) — the largest US facility-services contractor, ~$8.4B revenue, ~100,000+ employees, janitorial + parking + engineering + electrical across aviation, commercial real estate, education, and industrial. ABM Building & Industry segment is the benchmark for Class A office janitorial pricing and the ABM GreenCare green-cleaning program. Competes for multi-tenant office and portfolio janitorial against Aramark NYSE:ARMK (Philadelphia PA, ~$19B), Sodexo EPA:SW (France, ~€24B), ISS A/S CPH:ISS (Denmark), C&W Services (Cushman & Wakefield facilities arm), Pritchard Industries, SBM Management, Harvard Maintenance, and thousands of regional building-service contractors. The pivotal 2024-2027 dynamic: post-COVID office-occupancy volatility + hybrid-work density changes forcing janitorial scope + frequency renegotiation at nearly every Class A office MSA renewal.', url: 'https://www.abm.com/' },
  { title: 'BSCAI — Building Service Contractors Association International (Fairfax VA) + CMI (Cleaning Management Institute) + CIRI (Cleaning Industry Research Institute) — the BSC trade-education + certification + research perimeter. BSCAI runs the Registered Building Service Manager (RBSM) credential, contract-administration education, and annual contractor benchmarking on gross margin, labor burden, supervisor span-of-control, and contract-retention. BSCAI + CIRI benchmarking consistently shows commercial janitorial contractor gross margin at 8-22% (a thin-margin service business where workloading accuracy, scope-control, and supervision span are the entire profit lever), retention 70-92%, and annual price escalation 0-6%.', url: 'https://www.bscai.org/' },
  { title: 'GBAC STAR Facility Accreditation (Global Biorisk Advisory Council, an ISSA division) + Green Seal GS-42 (Commercial & Institutional Cleaning Services standard) + UL ECOLOGO + USGBC LEED O+M (Operations & Maintenance) + OSHA bloodborne-pathogen 29 CFR 1910.1030 + Hazard Communication 29 CFR 1910.1200 + the EPA Safer Choice program — the standards, accreditation, and regulatory perimeter every commercial janitorial bid sits inside. GBAC STAR became a tenant-facing trust signal post-2020; LEED O+M requires a documented green-cleaning policy + Green Seal / EcoLogo certified products; OSHA HazCom + bloodborne-pathogen training compliance is a direct janitorial-contractor liability and a frequent procurement disqualifier.', url: 'https://www.gbac.org/' }
];

const tldr = `> ### 🧹 The Pulse Training
> **Who this is for:** **Commercial janitorial / building-service-contractor (BSC) account reps + branch managers + operations managers** at **ABM NYSE:ABM / Aramark NYSE:ARMK / Sodexo / ISS / C&W Services / Pritchard / SBM / Harvard Maintenance** and the thousands of **mid-market regional BSCs** bidding **Class A multi-tenant office janitorial service-contracts (MSAs)** to **Property Managers, Facilities Directors, building owners, and Procurement** — right when the account is comparison-shopping after a **tenant-complaint escalation** or a **multi-building portfolio rebid**. Per **ISSA + IBISWorld + BSCAI + CIRI**: top-quartile BSCs run **15-22% contract GM + 88-94% retention + 3-6%/yr escalation + 10-14 supervisor span-of-control + 35-50% green/GBAC attach + 80-92% scope-walk completion**; median **9-15% GM / 1-3% escalation**; bottom **5-9% GM / 0% escalation**.
>
> **What teams leave with:** a **5-STAGE BID WALK (SURVEY → SPEC → SHOW → SOLVE → SECURE)** + the **4 conversations every janitorial rep avoids** (workloading honesty / day-cleaning reframe / scope-creep "specials" / complaint-prompted rebid urgency). Plus verbatim scripts, two role-plays, an MSA quartile self-diagnosis, an ISSA 612 workloading walkthrough, and a green-cleaning + GBAC STAR attach playbook.
>
> **Branch manager brings:** (1) three recent lost-bid debriefs. (2) Bid Walk Kit — SURVEY scorecard + ISSA 612 cleaning-times workloading sheet + CIMS / CIMS-GB + GBAC STAR + Green Seal GS-42 cross-walk + day-cleaning vs night-cleaning calculator + scope-of-work (SOW) frequency matrix + periodic-work schedule. (3) whiteboard the last 10 bids by outcome, price-per-square-foot, green attach, and retention.

## MEETING AGENDA — 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Cold Open** — Rep A emailed a flat $0.085/sq-ft/mo quote on a 140k-sq-ft Class A office after a restroom-complaint escalation, lost to a regional BSC on a documented scope-walk. Rep B walked the building floor-by-floor, ran SURVEY-SPEC-SHOW-SOLVE-SECURE, attached day-cleaning + GBAC STAR, and closed a 3-building portfolio MSA above the incumbent's flat rate. | Branch Mgr | Bid-walk-anchored MSA beats price-anchored cold-quote |
| **0:10-0:35** | **Teach** — 5-STAGE (SURVEY/SPEC/SHOW/SOLVE/SECURE) + 4 avoided conversations + MSA quartile self-diagnosis + 3 standards lenses (CIMS / GBAC STAR / Green Seal + LEED O+M) | Branch Mgr | Recite 5 stages + 4 avoided + 3 lenses + ISSA 612 logic |
| **0:35-0:45** | **Discussion** — 8 prompts on incumbent defense / portfolio-rebid navigation / when to walk away / green-attach hesitancy / workloading honesty / OSHA disqualifiers / day-cleaning resistance / supply pass-through | Branch Mgr + room | Audit last 10 bids by quartile behavior |
| **0:45-1:05** | **Role-Play x 2** — R1: Property Manager at a 140k-sq-ft Class A office post-tenant-complaint. R2: Procurement Lead at a 6-building, 720k-sq-ft office portfolio rebid. | Pairs | Run 5-STAGE under two buyer archetypes |
| **1:05-1:10** | **Debrief + Commitments** — 3 Qs + 1 lost bid + 1 verbatim line + 1 avoided conversation | Branch Mgr | Bid-walk-first habit + green + day-cleaning discipline |
| **1:10-1:13** | **Leave-Behind** — 5-Stage Bid Walk Script Card + MSA Quartile Self-Diagnosis + ISSA 612 Workloading Cheat-Sheet + Green/GBAC Attach Pitch | Branch Mgr | One-pager in every account-rep bag |

> ### 🎯 Bottom Line
> A Property Manager doesn't drop the incumbent because your price-per-square-foot is a penny lower — she drops them because you walked every floor, every restroom, every entrance, and the loading dock; built the scope of work from **ISSA 612 cleaning-times workloading** instead of a guessed rate; showed her the **CIMS + GBAC STAR + Green Seal GS-42** gaps in the incumbent's program; and proved a **day-cleaning** shift would cut her after-hours energy cost while making the cleaning visible to tenants. Run the **5-STAGE BID WALK + 4 avoided conversations + MSA quartile self-diagnosis + 3 standards lenses + green/GBAC attach** and you lift contract value, hold 88%+ retention, and protect 15-22% GM. Skip the walk, quote flat, guess the workloading, and you win the cheap accounts you later lose money on. Five stages. Four avoided conversations. Walk the building before you price the building.

`;

const core = `---

## SECTION 1 — INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do NOT open with the ABM GreenCare brochure or a price sheet. Whiteboard. Say the **ISSA + IBISWorld + BSCAI + CIRI** quartile numbers, the two-rep cold open, the four avoided conversations, and the three standards lenses (CIMS / GBAC STAR / Green Seal + LEED O+M). Ten minutes. Hard stop at 0:10.

### The numbers, then the story.

**The numbers.** The US janitorial-services industry is ~$90B+ in 2024 with ~1.2M+ workers, and it is brutally fragmented — the largest national contractors hold only a low double-digit combined share. Per **ISSA + IBISWorld + BSCAI + CIRI** benchmarking: **top-quartile** building-service contractors run **15-22% contract gross margin + 88-94% retention + 3-6%/yr escalation + 10-14 cleaners per supervisor span-of-control + 35-50% green/GBAC attach + 80-92% scope-walk completion**. **Median** runs **9-15% GM / 1-3% escalation**. **Bottom** runs **5-9% GM / 0% escalation**. Janitorial is a thin-margin labor business: 40-55% of contract cost is direct cleaning labor, so workloading accuracy, scope control, and supervisor span are nearly the entire profit lever.

**The squeeze.** Hybrid work made office occupancy volatile and uneven — Tuesday-Wednesday-Thursday peaks, dead Mondays and Fridays — which means the night-cleaning, fixed-frequency program that was priced in 2019 is now mis-loaded at almost every Class A office. Tenant expectations rose post-2020: restrooms, touchpoints, and indoor-air signals are now lease-renewal conversations, and GBAC STAR accreditation became a tenant-facing trust signal. The bid is no longer a rate — it is a re-engineering of scope, frequency, and shift timing.

**The story.** **Rep A** emailed a flat **$0.085/sq-ft/mo** quote on a **140,000-sq-ft Class A office** after a restroom-complaint escalation. No walk. No workloading. No standards conversation. Lost to a regional BSC who walked the building.

**Rep B** walked that same building floor-by-floor with the Property Manager. SURVEY every restroom, entrance, elevator lobby, break room, stairwell, and the loading dock. SPEC the scope of work from **ISSA 612 cleaning-times workloading** — not a guessed rate. SHOW the incumbent's CIMS + GBAC STAR + Green Seal gaps on a two-panel reveal. SOLVE with a re-frequencied night program plus a **day-porter shift** and a green-cleaning upgrade. SECURE a 3-year MSA with a CPI escalator and a supply pass-through clause — then expanded it into the owner's 3-building portfolio.

> ### ⚠️ Common Trap
> *"Rep A lost because the regional guy lowballed."* No. The regional BSC quoted **at or above** Rep A on price-per-square-foot. The Property Manager picked the walk: a documented, floor-by-floor scope of work she could defend to her tenants and her owner. A flat per-square-foot quote with no walk is a race to the bottom — you win the building you later lose money cleaning. SURVEY before SPEC. SPEC before SHOW.

**Transition:** "Next 50 minutes: the 5-stage bid walk, 4 avoided conversations, 3 standards lenses, two role-plays. Let's go."

---

## SECTION 2 — THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into 5-STAGE (12 min, ~2.5 min/stage) + Four Avoided Conversations (8 min) + Three Standards Lenses (3 min) + MSA Quartile Self-Diagnosis (2 min). End-of-section test: every rep recites all 5 stages, all 4 avoided conversations, and the ISSA 612 workloading logic without notes.

### Part A — The 5-STAGE BID WALK (12 min)

Most lost commercial janitorial bids collapse at Stage 1 (skipped scope-walk, quote emailed from a floor plan) or Stage 3 (the rep never shows the buyer what the incumbent's program is actually missing). You do not win a Class A office MSA with a price-per-square-foot — you EARN it by SURVEYING the building floor-by-floor, SPEC-ing the scope of work from real workloading math, SHOWING the buyer the standards and frequency gaps, SOLVING with a re-engineered program, and SECURING a multi-year MSA with the right escalator and pass-through clauses.

#### Stage 1 — SURVEY (2.5 min)

The bid starts with a physical, floor-by-floor scope-walk: **restrooms (fixture count, traffic, finish), entrances + elevator lobbies, tenant suites + common corridors, break rooms + pantries, conference floors, stairwells, loading dock + trash room, exterior glass + entry mats**. Count fixtures. Note floor types (carpet, VCT, terrazzo, polished concrete) because each carries a different cleaning time. The Property Manager and the Facilities Director must SEE the rep walking the building with a scorecard — not handing a quote at the lobby desk.

> ### 🎤 Verbatim Script — SURVEY
> *"Karen — let's walk it. **Eight floors. 22 restrooms, two of them high-traffic on the lobby and food-court levels. Three tenant move-ins this quarter changed your density. The loading-dock trash room has no scheduled detail. Entry mats are undersized for this much glass and foot traffic. Stairwell B hasn't been detailed in a while.** Forty minutes of walking. Your current contractor's last six monthly inspection reports don't mention any of this. That gap list IS the bid conversation."*

**Common trap.** Quoting from a floor plan or a CoStar square-footage number. Median scope-walk completion is 50-65%; top-quartile is 80-92%. No SURVEY = no workloading accuracy = a rate you either lose money on or lose the bid on.

#### Stage 2 — SPEC (2.5 min)

Build the scope of work from **ISSA 612 cleaning-times workloading**, not a guessed rate. ISSA 612 publishes standardized production rates — how long it takes a trained cleaner to vacuum a square foot of carpet, service a restroom fixture, damp-mop hard floor, dust horizontal surfaces. You add the building's actual measured areas and fixture counts, apply the frequencies the building needs, and the labor hours fall out as math. That is your true cost. The scope-of-work document then lists every task by area and by frequency — daily, weekly, monthly, quarterly, annual.

> ### 🎤 Verbatim Script — SPEC
> *"Karen — here is the scope built from ISSA 612 workloading, not a rate I guessed. **Your 140,000 cleanable square feet, your 22 restrooms at this fixture count and traffic, your carpet-vs-hard-floor mix — that workloads to a specific number of cleaner-hours per night, plus a defined periodic schedule.** Your current contractor is staffing roughly 20% under that. That is why your restrooms get complaints on Thursdays. The fix is not a lower price — it is the right scope, correctly loaded."*

**Common trap.** Skipping the workloading and matching the incumbent's hours. If the incumbent is under-loaded, you inherit the complaints; if they are over-loaded, you leave margin on the table. Bottom-quartile reps use one rate template for every building.

#### Stage 3 — SHOW (2.5 min)

Two-panel reveal. Left: the **incumbent's current program** — frequency gaps, under-loaded restrooms, no green-cleaning policy, no GBAC STAR, no documented periodic schedule, supervisor span stretched thin. Right: the **re-engineered program** — correct workloading, a defined periodic schedule, a green-cleaning upgrade, an optional day-porter shift, and CIMS-aligned management documentation.

> ### 🎤 Verbatim Script — SHOW
> *"Karen — left side, your current program: night-only, under-loaded restrooms, no written periodic schedule, no green-cleaning policy, no GBAC STAR, one supervisor over far too many buildings. Right side, proposed: workloaded staffing, a written 12-month periodic schedule, Green Seal GS-42 certified chemistry, a day-porter for restrooms and high-touch surfaces during occupied hours, CIMS-aligned reporting, and an inspection cadence you can show your tenants. Same building — a program you can actually defend."*

**Common trap.** Leaving the incumbent's program intact and bidding a penny lower on the same scope. The bid IS the program redesign — not the price sheet.

#### Stage 4 — SOLVE (2.5 min)

Build the proposal in components. **(1) Base night-cleaning** — correctly workloaded. **(2) Day-porter / day-cleaning shift** — priced as its own line, justified by tenant visibility and reduced after-hours HVAC + lighting energy load. **(3) Periodic / project work** — carpet extraction, hard-floor refinish, high-dusting, on a scheduled calendar, NOT billed ad-hoc as "specials." **(4) Green-cleaning + GBAC STAR** — as an attach, supporting the building's LEED O+M and tenant ESG asks.

> ### 🎤 Verbatim Script — SOLVE
> *"Karen — four components. **(1) Base night program, correctly workloaded.** **(2) A day-porter shift** for restrooms and lobbies during occupied hours — priced separately, and it cuts the after-hours energy you burn keeping the building lit for a night crew. **(3) A 12-month periodic schedule** — carpet extraction, floor refinishing, high-dusting, all scheduled and in the contract price, so you stop getting surprise 'special' invoices. **(4) Green-cleaning with Green Seal GS-42 chemistry plus a GBAC STAR pathway** for your LEED O+M and your tenants' ESG reporting. That is a program, not a rate."*

**Common trap.** One blended per-square-foot number. Components let the buyer see value, choose tiers, and stop treating periodic work as a surprise.

#### Stage 5 — SECURE (2.5 min)

Lock a **3-year MSA** with a **CPI-based escalator (typically 3-5%/yr or CPI+1-2%)**, a **supply / consumables pass-through clause**, a **scope-change governance process**, a **wage-rate adjustment clause** (for minimum-wage and prevailing-wage moves), and **portfolio expansion language** so the owner's other buildings auto-enroll at portfolio economics.

> ### 🎤 Verbatim Script — SECURE
> *"Karen — the MSA. **Three-year term. CPI-based escalator so we are never renegotiating mid-contract. A consumables pass-through clause** — paper, liners, soap move with the market, not buried in my margin. **A wage-adjustment clause** for minimum-wage changes. **A written scope-change process** so add-ons get priced, not absorbed. And **portfolio language** — when the owner brings the other two buildings over, they enroll at portfolio rates. For-cause termination with a 30-day cure. That is a contract that protects both of us."*

**Common trap.** A one-year term with no escalator and no pass-through. In a 40-55%-labor business with minimum-wage and supply inflation, a flat one-year deal is a guaranteed margin loss — and it signals to procurement that you have not thought past the first invoice.

### Part B — The Four Conversations Every Janitorial Rep Avoids (8 min)

Per **ISSA + BSCAI + CIRI**, four conversations explain most of the gross-margin gap between top-quartile and bottom-quartile BSCs. Reps avoid them out of fear of losing the bid.

#### Conversation 1 — "Your incumbent is under-loaded — that is why your restrooms get complaints"

Most struggling Class A janitorial accounts are simply under-staffed for the real workloading. **Script:** *"Karen — your incumbent staffs roughly 20% below what ISSA 612 workloading says this building needs at these frequencies. They did not lowball you to be generous — they lowballed to win, and the under-staffing is showing up as your Thursday restroom complaints. The honest fix is correct workloading. That may not be the cheapest bid on your desk — it is the one whose restrooms pass inspection in month nine."*

#### Conversation 2 — "Move part of this to day-cleaning — it costs less to run and tenants see it"

Day-cleaning (and day-porter) shifts feel like a service downgrade to buyers until you reframe. **Script:** *"Karen — counter-intuitive: a day-porter shift plus partial day-cleaning usually lowers your total cost of occupancy. A night-only crew means the building runs HVAC and lighting for an empty floor. Day-cleaning shrinks that after-hours energy load, cleaning becomes visible to tenants instead of invisible, and your restroom response time during the workday goes from 'tomorrow night' to 'twenty minutes.' It is not less service — it is service your tenants actually witness."*

#### Conversation 3 — "Stop paying for 'specials' — put the periodic work in the contract"

Under-loaded contracts hide their true cost in ad-hoc "special" invoices for carpet and floor work. **Script:** *"Karen — pull your last twelve months of invoices. I will bet there are several thousand dollars of 'specials' — carpet extraction, floor stripping, high-dusting — billed on top of your monthly rate. That is not extra service; that is periodic work that belongs in a written schedule and in the contract price. Put it on a 12-month calendar and your budget becomes predictable and your floors stop getting neglected until they look bad enough to complain about."*

#### Conversation 4 — "Your tenant complaint started a clock — your incumbent is the contractor that let it happen"

A complaint-prompted rebid is the highest-urgency buying window, and the buyer is anxious. **Script:** *"Karen — the complaint escalation that brought me in did not happen by accident. It is the predictable result of an under-loaded program with no written periodic schedule and no day coverage. Three reframes. (1) This is an operational gap, not bad luck — it is fixable with correct workloading. (2) Your tenants and your owner now want documentation — a CIMS-aligned program and inspection cadence gives you that. (3) Your incumbent's own inspection reports, if you pull them, will show the gap was visible for months. Let me show you a 90-day stabilization plan."*

### Part C — The Three Standards Lenses (3 min)

Every commercial janitorial account rep must fluently navigate three standards lenses. Reps who cannot speak them lose on credibility alone.

**Lens 1 — CIMS / CIMS-GB (ISSA).** The Cleaning Industry Management Standard is the ISSA-owned, third-party certification of a contractor's *management systems* — quality, human resources, health & safety, service delivery, management commitment. CIMS-GB adds a Green Building dimension aligned to LEED O+M. A CIMS-certified BSC is signaling to procurement that the *organization*, not just the crew, is auditable.

**Lens 2 — GBAC STAR.** GBAC (Global Biorisk Advisory Council, an ISSA division) STAR is a *facility* accreditation for cleaning, disinfection, and infectious-disease prevention protocols. Post-2020 it became a tenant-facing and lease-marketing trust signal; a BSC that can run a building to GBAC STAR gives the Property Manager something to show prospective tenants.

**Lens 3 — Green Seal GS-42 + LEED O+M + OSHA.** Green Seal GS-42 is the standard for commercial cleaning *services*; Green Seal / UL ECOLOGO certified products plus a documented green-cleaning policy are required for LEED O+M. And OSHA HazCom (29 CFR 1910.1200) and bloodborne-pathogen (29 CFR 1910.1030) training compliance is a hard procurement gate — fail it and you are disqualified before price is even read.

### Part D — MSA Portfolio Quartile Self-Diagnosis (2 min)

Every branch manager self-diagnoses on five metrics: **contract GM % + retention rate + annual escalation + supervisor span-of-control + green/GBAC attach**. The numbers are non-negotiable per ISSA + BSCAI + CIRI. The room learns instantly which quartile it is in and which two metrics block the next jump.

> ### 🎯 Bottom Line
> Five stages + four avoided conversations + three standards lenses + quartile self-diagnosis + green/GBAC attach = contract-value lift, 88%+ retention, and 15-22% GM. Stages without the avoided conversations is a competent crew that loses the next rebid. The avoided conversations without the stages is honesty with no program behind it.

---

## SECTION 3 — THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard five columns SURVEY/SPEC/SHOW/SOLVE/SECURE and four rows WORKLOADING / DAY-CLEANING / SPECIALS / COMPLAINT-URGENCY. Each rep audits the last 10 bids out loud — stage skipped, conversation ducked, quartile behavior. Count to five after each prompt.

**1 — "When do you walk away from a complaint-prompted bid?"** When the buyer refuses the scope-walk AND wants a sub-workloaded price AND will not sign past one year. Branch Mgr: *"That is a building that will complain about you in nine months. Walk."*

**2 — "How do you navigate a multi-building portfolio rebid?"** Win the walk on the worst-performing building first, prove the program, then price the portfolio. Branch Mgr: *"The portfolio is won one building at a time, on the building that hurts most."*

**3 — "When does workloading honesty backfire?"** Almost never — but if active complaints are severe, stabilize staffing first and present the full workloaded number after month one. Branch Mgr: *"Stabilize, then show the math. Never hide it."*

**4 — "Does ABM or a national always win the big portfolio?"** No. Nationals win on balance-sheet and geography; regionals win on the walk, supervisor span, and a Property Manager who can reach a decision-maker. Branch Mgr: *"Do not fight on logo. Fight on the documented program."*

**5 — "A green-cleaning ask comes in late — bolt-on or rebuild?"** Rebuild the chemistry and the policy properly — Green Seal GS-42 is a service standard, not a product swap. Branch Mgr: *"Green is a program, not a label."*

**6 — "Day-cleaning resistance — how do you coach the rep?"** Ride two bids, script the energy-cost and visibility reframe, let the branch manager carry the shift-change conversation. Branch Mgr: *"Day-cleaning is branch-manager work — it changes the buyer's whole operating picture."*

**7 — "Supply pass-through — bury it or break it out?"** Break it out. Buyers respect a clean consumables clause and resent discovering it inside a blended rate. Branch Mgr: *"Transparency on supply is a trust signal, not a weakness."*

**8 — "One verbatim change this week."** Each rep names one stage skipped and one conversation ducked on a live bid. Branch Mgr: *"CRM task, Monday huddle, ride-along."*

---

## SECTION 4 — TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair the account reps. Two scenarios, 10 minutes each, 60-second reset between. Walk the imaginary building. Listen for verbatim *"ISSA 612 workloading,"* *"CIMS,"* *"GBAC STAR,"* *"Green Seal GS-42,"* and whether the rep delivers the workloading-honesty and day-cleaning reframes without flinching, and whether she pivots from price-per-square-foot to a four-component MSA.

### Role-Play 1 — Property Manager Karen Doyle at a 140k-sq-ft Class A Office Post-Tenant-Complaint (10 min)

**Setup:** Karen Doyle, Property Manager at a 140,000-sq-ft, 8-floor Class A multi-tenant office managed for an institutional owner. The 1-year janitorial contract with the incumbent is up in 75 days at a flat $0.085/sq-ft/mo. Two anchor tenants escalated restroom and common-area complaints to the leasing team; the owner asked Karen to rebid. Bids went to the incumbent, ABM, one other national, and your regional BSC. The rep is Marcus Hale, senior account rep, 7 years in commercial janitorial, CIMS-certified company. Run the full 5-STAGE and close a 3-year MSA with a day-porter shift and a green/GBAC attach.

> ### 🎤 PROSPECT — Karen Doyle
> 44, 9-year property manager, RPA-credentialed, budget-accountable to an institutional owner, distrusts "vendor upsell," leads with TENANT-SATISFACTION primary, BUDGET secondary.
>
> **Deflection 1 (min 4):** *"We've been at $0.085 a square foot for three years and the incumbent says they can hold it. You walked the building, fine — but why would I pay more when I can just push my current contractor to fix the restrooms?"*
>
> **Deflection 2 (min 8):** *"A day-porter shift and a GBAC STAR program both sound like things you invented to raise my number. My tenants want clean restrooms, not an accreditation plaque."*

> ### 🎤 ACCOUNT REP — Marcus Hale
> - **Min 0-3 (SURVEY + SPEC):** *"Karen — we walked all eight floors. 22 restrooms, two high-traffic. Three tenant move-ins changed your density. The loading-dock trash room has no scheduled detail. I built the scope from ISSA 612 workloading: your building at these frequencies needs a specific cleaner-hour count, and your incumbent is staffing roughly 20% under it. The Thursday restroom complaints are not bad luck — they are an under-loaded program."*
> - **Min 3-5 (SHOW + SOLVE):** *"Four components. (1) Base night program, correctly workloaded. (2) A day-porter shift for restrooms and lobbies during occupied hours — priced separately, and it lowers your after-hours HVAC and lighting load. (3) A written 12-month periodic schedule so carpet and floor work stop arriving as surprise 'special' invoices. (4) Green Seal GS-42 chemistry plus a GBAC STAR pathway for your LEED O+M and your tenants' ESG asks."*
> - **Min 5-7 (Deflection 1 — just push the incumbent):** *"You can push them — but they have been under-loaded for three years and the math has not changed. Pushing a sub-workloaded contractor gets you a good month and then the same Thursday complaints. The fix is not pressure on the same staffing; it is correct staffing. And the incumbent's own inspection reports will show the gap was visible for months."*
> - **Min 7-9 (Deflection 2 — day-porter and GBAC are upsell):** *"Fair challenge. The day-porter is not a plaque — it is the difference between a restroom problem fixed in twenty minutes versus tomorrow night, and it shrinks the energy you burn lighting an empty building for a night crew. GBAC STAR is something you show a prospective tenant on a tour; it is a leasing asset, not a vanity line. If either does not earn its line, cut it — but let me show you the cost first."*
> - **Min 9-10 (SECURE):** *"Two asks. (1) A 3-year MSA: workloaded base, day-porter line, 12-month periodic schedule, Green Seal GS-42, CPI escalator, consumables pass-through, written scope-change process, for-cause termination with a 30-day cure. (2) Introduce me to the owner's facilities lead — when this building stabilizes, the other two in the portfolio should enroll at portfolio rates. Sign and I deliver a 90-day stabilization plan with a weekly inspection cadence you can forward to your tenants."*

### 60-Second Reset

> ### 🟡 Coach Note
> "Switch sides — 60-second reset." Stand up. Read the other role's sheet. Go.

### Role-Play 2 — Procurement Lead Daniel Reyes on a 6-Building, 720k-sq-ft Office Portfolio Rebid (10 min)

**Setup:** Daniel Reyes, Procurement Lead for a regional commercial-real-estate owner with a 6-building, 720,000-sq-ft suburban office portfolio. The portfolio's janitorial MSA is up in 60 days; the incumbent national contractor quoted a flat portfolio renewal. Daniel has an RFP out to the incumbent, ABM, and your regional BSC. The CFO wants total facility spend down, and the asset-management team wants a green-cleaning and GBAC STAR story for the portfolio's leasing pitch. Run the full 5-STAGE and close a 3-year portfolio MSA.

> ### 🎤 PROSPECT — Daniel Reyes
> 38, 6-year procurement lead, CPSM-credentialed, RFP-disciplined, distrusts margin-padding and pricing games, leads with PROCUREMENT-CRITERIA primary, PORTFOLIO-GREEN-STORY secondary.
>
> **Deflection 1 (min 4):** *"The incumbent quoted the whole portfolio flat and they already know all six buildings. Your number is higher and you would be learning our buildings on our dime. Why would procurement take that risk?"*
>
> **Deflection 2 (min 8):** *"ABM has the GBAC STAR and green-cleaning program built and a national balance sheet behind it. You are a regional. Why are you the safer portfolio bet?"*

> ### 🎤 ACCOUNT REP — Marcus Hale
> - **Min 0-3 (SURVEY + SPEC):** *"Daniel — we walked all six buildings, not just the flagship. Buildings 2 and 5 are badly under-loaded; the incumbent's flat portfolio number is averaging across them and hiding it. I workloaded each building from ISSA 612 — a flat portfolio rate is exactly how two of your six buildings ended up neglected. Procurement's risk is not a new vendor; it is renewing a flat number that masks the worst buildings."*
> - **Min 3-5 (SHOW + SOLVE):** *"Per-building components. Each building: workloaded base, a day-porter where occupancy justifies it, a 12-month periodic schedule. Portfolio-wide: Green Seal GS-42 chemistry, a CIMS-aligned management system, and a GBAC STAR pathway your asset-management team can put in the leasing pitch. One program, six buildings, fully documented."*
> - **Min 5-7 (Deflection 1 — incumbent knows the buildings):** *"They know the buildings — and two of them are under-loaded under their watch. 'Knowing the buildings' has not fixed Buildings 2 and 5. We walked all six and workloaded all six; our transition plan is documented per building. The risk is not the new vendor — it is renewing the contractor whose flat rate created the neglected buildings."*
> - **Min 7-9 (Deflection 2 — ABM has scale):** *"ABM is excellent and I will not pretend otherwise. The difference: on a 6-building suburban portfolio, supervisor span-of-control and a Property Manager who can reach a decision-maker decide the outcome. We are CIMS-certified, we run Green Seal GS-42, and we have a GBAC STAR pathway — the same standards — with a tighter supervisor span and a regional response time a national branch cannot match here."*
> - **Min 9-10 (SECURE):** *"Three asks. (1) A 3-year portfolio MSA: per-building workloaded scope, CPI escalator, consumables pass-through, a wage-adjustment clause, a written scope-change process. (2) A CFO and asset-management debrief — I will bring the per-building workloading and the GBAC STAR leasing brief. (3) Start with Buildings 2 and 5 on a 90-day stabilization so procurement sees proof before the full portfolio cuts over."*

> ### 🟡 Coach Note
> The rep will want to (a) match the incumbent's flat portfolio rate — do not, it re-creates the neglected buildings; (b) concede the green story to ABM — do not, CIMS + Green Seal GS-42 + GBAC STAR is the same standard set; (c) skip the CFO and asset-management debrief — do not, the portfolio leasing story is the real buyer; (d) accept "we'll think about it" without delivering the per-building workloading and GBAC STAR brief — the brief IS the close.

---

## SECTION 5 — DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief questions, then commitments. The ritual moves next quarter's contract-value lift, green attach, and MSA quartile movement.

**Debrief 1 — "Strongest stage? Weakest?"** Reps over-index SURVEY and under-index SHOW (the incumbent-gap reveal feels confrontational) and SECURE (the multi-year MSA feels presumptuous). Branch Mgr: *"Skip SHOW or SECURE and you win a one-year flat deal you lose money on."*

**Debrief 2 — "Which avoided conversation did you dodge most?"** Most name workloading honesty. Branch Mgr: *"When you flinch on workloading, you either inherit the complaints or lose the bid. Top-quartile shows the math."*

**Debrief 3 — "Which bid do you owe a redo?"** Each rep names one recent bid lost flat or without a green attach. Branch Mgr: *"Email within 48 hours: 'Karen — I pulled your last twelve months of specials and re-walked the building. Thirty-minute call?' A mid-cycle re-approach is a real second chance."*

> ### 🎤 Commitment Ritual (Verbatim)

**Branch Mgr:** "Open the CRM. Four lines. (1) A bid that closed flat or without a green attach — building, contract value, the avoided conversation, the 'flat' language. (2) The stage you skipped and the verbatim line to redeliver. (3) The avoided conversation you ducked and the reframe. (4) One account that needs a workloading or day-cleaning conversation booked within 30 days. Read it aloud."

Coach the vague: *"Which building? Which gap? Which number? Say it out loud now."*

**Closes:** "I shadow one bid walk with each of you within 14 days. The grade is not whether you held the account — it is whether you ran SURVEY, delivered the SHOW gap reveal, and asked for the multi-year MSA."

---

## SECTION 6 — LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out the one-pager. 30 seconds per section. Digital copy in the CRM and the branch SharePoint. One in every account-rep bag and on the branch war-room wall.

> ### 📋 Leave-Behind — "The 5-Stage Bid Walk Script Card" One-Pager

> **8 THINGS TO BRING ON EVERY JANITORIAL BID:** (1) SURVEY scorecard (restrooms + fixture count + entrances + lobbies + suites + break rooms + stairwells + loading dock + glass + mats). (2) ISSA 612 cleaning-times workloading sheet. (3) CIMS / CIMS-GB + GBAC STAR + Green Seal GS-42 cross-walk. (4) Day-cleaning vs night-cleaning energy + visibility calculator. (5) Scope-of-work frequency matrix (daily / weekly / monthly / quarterly / annual). (6) 12-month periodic / project-work schedule template. (7) MSA template (3-year + CPI escalator + consumables pass-through + wage-adjustment clause + scope-change process + portfolio language). (8) OSHA HazCom + bloodborne-pathogen training records and certificates of insurance.

> **THE 5-STAGE BID WALK SCRIPT CARD:** **(1) SURVEY** — *"Let's walk it — every floor, every restroom, the loading dock. Your incumbent's inspection reports don't mention any of this."* **(2) SPEC** — *"Scope built from ISSA 612 workloading, not a guessed rate — your incumbent is staffing ~20% under."* **(3) SHOW** — *"Left: current program gaps. Right: re-engineered, workloaded, green, documented."* **(4) SOLVE** — *"Four components: base + day-porter + 12-month periodic + green/GBAC."* **(5) SECURE** — *"3-year MSA, CPI escalator, consumables pass-through, wage clause, scope-change process, portfolio language."*

> **THE 4 AVOIDED CONVERSATIONS:** (1) **Workloading honesty** — the incumbent is under-loaded; correct workloading, not a lower price. (2) **Day-cleaning reframe** — lower energy cost, visible service, faster restroom response. (3) **Specials** — put periodic work in a written schedule and the contract price. (4) **Complaint urgency** — it is an operational gap, not bad luck; deliver a 90-day stabilization plan.

> **MSA QUARTILE SELF-DIAGNOSIS:** Top-quartile **15-22% GM / 88-94% retention / 3-6% escalation / 10-14 supervisor span / 35-50% green-GBAC attach / 80-92% scope-walk**. Median 9-15% / 78-86% / 1-3% / 8-12 / 15-25% / 50-65%. Bottom 5-9% / 65-75% / 0% / 6-9 / <10% / <40%.

> **THE 10-POINT CIMS + GBAC + GREEN + OSHA AUDIT CHECKLIST:** (1) CIMS / CIMS-GB management-system certification. (2) GBAC STAR facility pathway. (3) Green Seal GS-42 service standard. (4) Green Seal / UL ECOLOGO certified products + written green-cleaning policy. (5) LEED O+M green-cleaning alignment. (6) OSHA HazCom 29 CFR 1910.1200. (7) OSHA bloodborne-pathogen 29 CFR 1910.1030 training. (8) ISSA 612 workloading documentation. (9) Written 12-month periodic schedule. (10) Inspection cadence + reporting the buyer can forward to tenants.

> **NEVER DO:** quote flat per-square-foot without a walk / guess the workloading / match an under-loaded incumbent's hours / bill periodic work as ad-hoc "specials" / hide the consumables cost in a blended rate / sign a one-year term with no escalator / pitch a buyer on a logo instead of a documented program / skip the OSHA compliance pack / single-thread the Property Manager when the owner and CFO are the real buyers.

> **OUTCOME LINE:** Full discipline -> contract-value lift, 88%+ retention, 15-22% GM, 3-6%/yr escalation, 35-50% green/GBAC attach. Flat-bid, skip-walk, guess-workload, no-green -> win cheap accounts you lose money on, 65-75% retention, 5-9% GM, 0% escalation, churn at every rebid.

> ### 🎯 If You Only Remember One Thing
> You do not win a Class A office janitorial MSA with a price-per-square-foot — you win it by (1) walking the building floor-by-floor and surveying every restroom, entrance, and the loading dock (SURVEY + SPEC), (2) building the scope from ISSA 612 workloading and showing the buyer the incumbent's frequency, green, and CIMS gaps on a two-panel reveal (SHOW), and (3) delivering a four-component program — workloaded base, day-porter shift, 12-month periodic schedule, green + GBAC attach — under a multi-year MSA with a CPI escalator and a consumables pass-through (SOLVE + SECURE). Every building you win on a flat un-walked rate is a building you lose money cleaning and lose at the next rebid; every building you win on a documented, workloaded, green program is a building a national consolidator cannot easily take from you.

---

## How This Training Sits Inside Your Branch Operating Motion

**Monday branch huddle** — prior week's bids plus one verbatim drill. **Bid Day 1** SURVEY walk. **Day 2-3** SPEC workloading from ISSA 612. **Day 4** SHOW two-panel reveal. **Day 5** SOLVE four-component proposal. **Day 7** SECURE the MSA. The four avoided conversations overlay every cycle. **Branch quartile review** quarterly with a 90-day operating-model fix.

`;

const flow = `

## The 5-Stage Janitorial Bid Walk Flow

\`\`\`mermaid
flowchart TD
  A[Branch Mgr Opens] --> B[Section 1 Cold Open: ISSA + IBISWorld + BSCAI + CIRI quartile spread + Rep A flat per-sq-ft email lost vs Rep B floor-by-floor walk wins 3-building portfolio MSA]
  B --> C[Section 2 Teach 25 min]
  C --> C1[Part A 5-STAGE: SURVEY floor-by-floor scope-walk / SPEC ISSA 612 workloading / SHOW incumbent-gap two-panel reveal / SOLVE four-component program / SECURE 3-yr MSA with escalator + pass-through]
  C --> C2[Part B 4 Avoided: workloading honesty / day-cleaning reframe / specials into periodic schedule / complaint urgency]
  C --> C3[Part C 3 Lenses: CIMS + CIMS-GB / GBAC STAR / Green Seal GS-42 + LEED O+M + OSHA]
  C --> C4[Part D MSA Quartile Self-Diagnosis 5 metrics]
  C1 & C2 & C3 & C4 --> F[Section 3 Discussion 8 prompts]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[R1 Karen Doyle PM 140k-sq-ft Class A office post-tenant-complaint: 5-STAGE + day-porter + green/GBAC + 3-yr MSA]
  G1 --> G2[60-sec reset]
  G2 --> G3[R2 Daniel Reyes Procurement 6-building 720k-sq-ft portfolio rebid: 5-STAGE + per-building workloading + GBAC STAR leasing brief]
  G3 --> H[Section 5 Debrief CRM ritual]
  H --> I[Section 6 Leave-Behind]
  I --> Z[End 1:13]
\`\`\`

## The Scope + Green + Periodic Decision Tree

\`\`\`mermaid
flowchart LR
  IN[Janitorial bid invitation arrives] --> SCAN{Scope-walk SURVEY + SPEC reveals condition}
  SCAN -- well-loaded, no complaints, no green ask --> CLEAN[Competitive renewal: match scope + modest escalator + QBR cadence]
  SCAN -- under-loaded OR tenant complaint OR portfolio rebid --> UPLIFT{Buyer accepts four-component program}
  SCAN -- severe complaints + active escalation --> CRISIS[90-day stabilization plan + interim staffing surge]
  UPLIFT -- accepts day-porter + green + periodic schedule --> WIN[Close 3-yr MSA + retention + GM protected]
  UPLIFT -- declines first --> ESCALATE[Branch-mgr reconsideration + per-building workloading brief]
  ESCALATE -- accepts 2nd pass --> WIN
  ESCALATE -- declines twice --> NONRENEW{Walk-away criteria met}
  CRISIS -- signs stabilization MSA --> WIN
  CRISIS -- wants flat sub-workloaded rate --> WARN[Workloading-gap brief + decline-to-bid-low]
  WARN -- buyer accepts correct workloading --> WIN
  WARN -- buyer signs a lowball competitor --> NONRENEW
  NONRENEW -- refuses walk + sub-workload price + one-year term --> EXIT[Walk away from the bid]
  WIN --> NEXT[Quarterly QBR + annual periodic-schedule review + green/GBAC renewal + portfolio expansion]
\`\`\`

`;

const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE Bid Walk, the four avoided conversations, the three standards lenses, the MSA quartile framework, and the contract-value benchmarks draw on commercial janitorial / building-service-contractor industry research, the ISSA standards and workloading bodies of knowledge, BSC trade-association benchmarking, and the federal OSHA + EPA + USGBC regulatory and certification perimeter.

**Industry benchmarking and standards.** **ISSA — The Worldwide Cleaning Industry Association** (Rosemont IL), owner of **CIMS / CIMS-GB**, the **ISSA 612 cleaning-times workloading standard**, the **Value of Clean** research program, and the **GBAC (Global Biorisk Advisory Council) / GBAC STAR** accreditation. **BSCAI — Building Service Contractors Association International** (Fairfax VA) and the **Cleaning Industry Research Institute (CIRI)** for BSC gross-margin, retention, escalation, and supervisor span-of-control benchmarking. Top-quartile 15-22% contract GM + 88-94% retention + 3-6% escalation; median 9-15% / 1-3%; bottom 5-9% / 0%.

**Facility-services contractors.** **ABM Industries NYSE:ABM** (Scott Salmirs, New York NY, ~$8.4B revenue, ~100,000+ employees) and the ABM GreenCare program. **Aramark NYSE:ARMK** (Philadelphia PA, ~$19B). **Sodexo EPA:SW** (France, ~€24B). **ISS A/S CPH:ISS** (Denmark). **C&W Services** (Cushman & Wakefield facilities arm), **Pritchard Industries, SBM Management, Harvard Maintenance**, and the thousands of mid-market regional BSCs that make the ~$90B+ US janitorial-services industry one of the most fragmented service markets in the country.

**Standards, accreditation, and regulatory perimeter.** **GBAC STAR** facility accreditation. **Green Seal GS-42** (Commercial & Institutional Cleaning Services standard) and **UL ECOLOGO** certified products. **USGBC LEED O+M** green-cleaning policy requirements. **EPA Safer Choice**. **OSHA Hazard Communication 29 CFR 1910.1200** and **OSHA bloodborne-pathogen 29 CFR 1910.1030** — the compliance gates that disqualify a contractor before price is read.

**Industry data.** **IBISWorld** Janitorial Services in the US industry reports for market size (~$90B+, ~1.2M+ workers) and concentration. **BSCAI** Registered Building Service Manager (RBSM) credential and contract-administration education. Direct labor at 40-55% of contract cost is the structural reason workloading accuracy and supervisor span-of-control are the entire profit lever in commercial janitorial.

`;

const num = `

## 📊 The Numbers Behind The Training

Pulled from ISSA + IBISWorld + BSCAI + CIRI benchmarking, ABM and Aramark public disclosures, the ISSA 612 workloading standard, and the GBAC STAR + Green Seal GS-42 + LEED O+M + OSHA standards and regulatory perimeter.

### Commercial Janitorial Contractor Operating Benchmarks 2024 (ISSA + BSCAI + CIRI)

| Metric | Top-Quartile | Median | Bottom |
|---|---|---|---|
| **Contract gross margin** | **15-22%** | 9-15% | 5-9% |
| **Contract retention rate** | **88-94%** | 78-86% | 65-75% |
| **Annual price escalation** | **3-6%** | 1-3% | 0% |
| **Supervisor span-of-control (cleaners per supervisor)** | **10-14** | 8-12 | 6-9 |
| **Green / GBAC STAR attach** | **35-50%** | 15-25% | <10% |
| **Scope-walk completion rate** | **80-92%** | 50-65% | <40% |
| **Periodic work inside contract (vs ad-hoc "specials")** | **80-95%** | 50-70% | <40% |
| **Quarterly QBR delivery** | **75-90%** | 40-60% | <25% |

### US Janitorial-Services Industry + Contractor Landscape (2024)

| Contractor | Ticker / Status | Revenue | Notes |
|---|---|---|---|
| **Aramark** | **NYSE:ARMK** | ~$19B | Facilities + food + uniform |
| **Sodexo** | **EPA:SW** | ~€24B | Global facilities management |
| **ABM Industries** | **NYSE:ABM** | ~$8.4B | Largest US pure facility-services |
| **ISS A/S** | **CPH:ISS** | global | Global facility services |
| **C&W Services** | division of Cushman & Wakefield | regional | CRE-attached facilities |
| **Harvard Maintenance / Pritchard / SBM** | private | regional-national | Large regional BSCs |
| **Regional / local BSCs** | private | fragmented | The bulk of a ~$90B+ market |

### Class A Office Janitorial Pricing Reference 2024-2027 ($/sq-ft/mo, cleanable area)

| Building Type | Night-Only Base | + Day-Porter | + Full Day-Cleaning + Green |
|---|---|---|---|
| **Class A multi-tenant office** | $0.07-$0.11 | $0.09-$0.14 | $0.12-$0.18 |
| **Class B office** | $0.05-$0.09 | $0.07-$0.11 | $0.09-$0.14 |
| **Medical office building** | $0.10-$0.16 | $0.13-$0.20 | $0.16-$0.26 |
| **Suburban office portfolio (per building)** | $0.06-$0.10 | $0.08-$0.13 | $0.11-$0.16 |

### Janitorial Cost Structure (typical commercial contract)

| Cost Component | Share of Contract |
|---|---|
| **Direct cleaning labor** | 40-55% |
| **Labor burden (payroll tax, workers' comp, benefits)** | 12-20% |
| **Supervision + management** | 6-12% |
| **Consumables + supplies (paper, liners, chemistry)** | 5-10% |
| **Equipment + amortization** | 3-6% |
| **Overhead + contract gross margin** | balance |

### Tenant-Complaint + Lost-Account Cost Stack

| Cost Component | Low | High |
|---|---|---|
| **Lost janitorial contract (annualized, mid-size Class A)** | $90K | $300K+ |
| **Emergency interim-staffing surge** | $5K | $25K |
| **Re-bid / transition cost (mobilization, training)** | $8K | $35K |
| **Tenant-retention / lease-concession exposure** | $10K | $150K+ |
| **Ad-hoc "specials" overspend (annualized)** | $4K | $30K |

### ISSA 612 Workloading Logic (illustrative production-rate concept)

| Task Area | Workloading Driver | Why It Matters |
|---|---|---|
| **Carpeted office** | sq-ft per cleaner-hour, vacuuming + spot | Largest area, sets base hours |
| **Hard floor (VCT / terrazzo)** | sq-ft per cleaner-hour, mop + buff | Periodic refinish drives project schedule |
| **Restrooms** | minutes per fixture, by traffic tier | #1 complaint source if under-loaded |
| **Entrances + lobbies** | high-frequency, glass + mats + touchpoints | Tenant-visible, first impression |
| **Periodic / project** | scheduled calendar, not ad-hoc | Belongs in contract, not "specials" |

### Day-Cleaning vs Night-Cleaning Trade-Off

| Factor | Night-Only | Day-Porter Hybrid | Heavy Day-Cleaning |
|---|---|---|---|
| **After-hours HVAC + lighting load** | highest | reduced | lowest |
| **Restroom response time during workday** | next night | ~20 minutes | immediate |
| **Tenant visibility of service** | invisible | partial | high |
| **Labor scheduling flexibility** | rigid | moderate | high |

**Pattern:** SHOW (the incumbent-gap reveal) and SOLVE (the four-component program) are the hardest stages to install — they feel confrontational and presumptuous. Weekly bid-walk shadowing plus a monthly workloading drill plus a quarterly quartile diagnosis is the single biggest predictor of next-quarter contract-value lift. Green/GBAC attach reaches 35%+ within a few months once the branch manager carries the standards conversation.

`;

const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Counter 1 — Small Single-Tenant Building With No Complaints
A 12,000-sq-ft single-tenant building, no complaints, no green ask, a tenant who wants the lowest defensible night rate. The full 5-STAGE is over-engineered. Right move: a lean SURVEY, a competitive workloaded base, an annual QBR — not a four-component MSA.

### Counter 2 — Building In Active Sale Or Repositioning
The asset is listed, in an LOI, or mid-repositioning. A 3-year MSA may not survive the ownership change. Right move: walk, leave the workloading findings, and re-approach the new owner or asset manager after the transaction.

### Counter 3 — Major Tenant Build-Out Or Renovation Underway
With construction dust, temporary walls, and shifting occupancy, the scope-walk findings are not stable. Right move: a short construction-cleanup scope, then a full workloaded bid once the build-out completes.

### Counter 4 — Procurement Mandate Is A Pure Reverse Auction
Some procurement processes are rate-only reverse auctions with no scope-walk allowed. The 5-STAGE cannot run. Right move: bid the documented workloaded minimum, decline to chase below cost, and note the building as a likely complaint-driven re-bid in 12-18 months.

### Failure Mode 5 — Bidding Flat To "Keep It Simple"
A rep wins on a flat per-square-foot rate, then absorbs minimum-wage and supply inflation with no escalator and no pass-through. Margin erodes for three years and the account renews at a loss.

### Failure Mode 6 — Skipping The Scope-Walk
Quoting from a CoStar square-footage number or a floor plan. Median scope-walk completion is 50-65% versus top-quartile 80-92%. No walk = no workloading accuracy = a rate that is wrong in one direction or the other.

### Failure Mode 7 — Matching An Under-Loaded Incumbent
The rep matches the incumbent's cleaner-hours to look price-competitive and inherits the same restroom complaints in month nine. Workloading honesty exists precisely to avoid this.

### Failure Mode 8 — Treating Periodic Work As "Specials"
Carpet extraction, floor refinishing, and high-dusting billed ad-hoc instead of scheduled. The buyer's budget becomes unpredictable and the floors get neglected until they look bad enough to complain about.

### Failure Mode 9 — Pitching Logo Instead Of Program
A regional rep apologizing for not being a national, or a national rep coasting on brand. Buyers in fragmented janitorial markets buy the documented program and the supervisor span, not the logo.

### Failure Mode 10 — Ignoring The OSHA Compliance Pack
Skipping HazCom and bloodborne-pathogen training documentation. Procurement disqualifies non-compliant contractors before price is even read.

### Common Branch-Manager Objections

**1. "Buyers will not accept a price increase."** Top-quartile retention is 88-94% *while* escalating 3-6%/yr. Anchor to ISSA + BSCAI benchmarking, the CPI escalator, and the consumables pass-through clause.

**2. "Green and GBAC are for trophy towers, not our buildings."** Wrong. LEED O+M, tenant ESG asks, and GBAC STAR as a leasing signal are now mainstream across Class A and much of Class B office.

**3. "How do I know it is working?"** 90-day signals: scope-walk completion up 30-50 points, green/GBAC attach above 25%, workloading documented on every bid, MSA quartile movement within 12 months.

**4. "When do we walk away?"** When the buyer refuses the walk AND wants a sub-workloaded rate AND will not sign past one year, or runs a pure reverse auction below cost.

### When To Run This Training Again

Monthly for the first three months, then quarterly. Re-run on a minimum-wage change, an OSHA or Green Seal standard revision, a LEED O+M update, after the branch loses two flat bids or a portfolio rebid in a quarter, and before major bid seasons. Rotate the role-plays: single-tenant building, Class A multi-tenant office, suburban office portfolio, medical office building, and a mixed-use property.

`;

const links = `

## 🔗 Related Pulse Content

This is the **twenty-ninth entry** in Pulse Sales Trainings and the **twenty-third industry-specific** training after st0007-st0028. st0029 covers commercial janitorial / building-service-contractor (BSC) account reps and branch managers at **ABM NYSE:ABM / Aramark NYSE:ARMK / Sodexo / ISS / C&W Services** and mid-market regional BSCs walking Property Managers, Facilities Directors, building owners, and Procurement through Class A office janitorial service-contract bids — inside the **ISSA / CIMS / CIMS-GB / ISSA 612 / GBAC STAR / Green Seal GS-42 / LEED O+M / OSHA** standards and regulatory perimeter. 2027 reality: hybrid-work occupancy volatility forced scope-and-frequency renegotiation at nearly every Class A office renewal, GBAC STAR became a tenant-facing leasing signal, and green-cleaning moved from trophy-tower nicety to mainstream procurement criterion.

**Closest siblings across the library:** [q9610 — How do you start a commercial cleaning business in 2027?](https://pulserevops.com/answer/q9610) is the direct industry-economics companion to this sales-training entry. [q9614 — How do you start a handyman service business in 2027?](https://pulserevops.com/answer/q9614) and [q9678 — How do you start a landscaping company in 2027?](https://pulserevops.com/answer/q9678) are the adjacent building-and-grounds service-contract trades that share the bid-walk, workloading, and recurring-MSA structure. [q9663 — How do you start a self-storage facility business in 2027?](https://pulserevops.com/answer/q9663) shares the facility-operations and recurring-revenue lens. Within Sales Trainings, **st0027** (commercial HVAC service agreements) and **st0019** (residential HVAC) are sister facility-services bid-walk trainings, and **st0028** (commercial pest-control restaurant bid-walk) is the closest structural sibling — same five-stage SURVEY-anchored walk, same standards-and-audit-defensibility spine. What does NOT transfer: the janitorial-specific ISSA 612 workloading math, the CIMS / GBAC STAR / Green Seal GS-42 standards stack, the day-cleaning-vs-night-cleaning shift economics, and the per-square-foot Class A office pricing structure.

**Companion entries planned:** **st0030** commercial plumbing + backflow + grease-trap preventive-maintenance bid. **st0031** commercial landscaping + grounds-maintenance portfolio MSA. **st0032** waste, recycling, and composting commercial service-contract.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings).

`;

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // Baseline (~moderate) answer = tldr + core + a single mermaid flow.
  // Polish ladder later POSTs the fuller answer (src/num/counter/links) via pulse-blob-polish.
  const baselineAnswer = tldr + core + flow;
  const baseWords = baselineAnswer.split(/\s+/).filter(Boolean).length;
  const baseChars = baselineAnswer.length;
  console.log('[' + ID + '] baseline chars:', baseChars, 'words:', baseWords);
  if (baseChars < 800) { console.error('baseline under 800 chars'); process.exit(1); }
  if (!/```mermaid\s+flowchart\s+TD/.test(baselineAnswer)) { console.error('baseline missing mermaid flowchart TD'); process.exit(1); }

  const ts0 = Date.now();
  await store.setJSON('answers/' + ID + '.json', {
    id: ID,
    question: QUESTION,
    answer: baselineAnswer,
    tags,
    sources: sources.slice(0, 2),
    ts: ts0,
    model: 'claude-opus-4-7-via-claude-code',
    quality_score: 5,
    polished_at: null,
    polish_history: [],
    source: 'claude-opus-bespoke-seed',
    format_v: '2026-05'
  });
  console.log('[' + ID + '] wrote answers/' + ID + '.json at quality_score 5');

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const i = idx.entries.findIndex(x => x.id === ID);
  const row = { id: ID, question: QUESTION, tags, ts: ts0, quality_score: 5, polished_at: null, last_modified_ms: ts0, sources_count: 2, format_v: '2026-05' };
  if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
  await store.setJSON('_index.json', idx);
  console.log('[' + ID + '] index updated, entries:', idx.entries.length);
  console.log('=== SHELL DONE ' + ID + ' === quality_score=5');
}

main().catch(err => { console.error(err); process.exit(1); });
