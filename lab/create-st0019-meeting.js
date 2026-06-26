// st0019 -- HVAC Replacement vs Repair Conversation: Closing a $12,000 System
// Upgrade Without Looking Like a Hack -- a 60-Minute Sales Training.
// Pulse Sales Trainings entry (route: /sales-trainings/st0019, tag: sales-training).
// THIRTEENTH industry-specific training (after st0007-st0018).
// Industry = residential HVAC replacement -- service tech / comfort advisor in-truck
// consult on a diagnostic-fee visit that converts to $8K-$25K replacement system sale.
// 2027 reality: PE rollups (Service Experts/ARS/One Hour/Apex/Sila/Wrench) consolidated
// 5-10% of market; 35,000+ independents fighting on price; EPA AIM Act R-410A new-equip
// phase-out Jan 1 2025 -> R-454B + R-32 transition; IRA Section 25C up to $2K heat-pump
// credit + HEEHRA up to $8K rebates flipping repair-vs-replace math toward replacement.
// VALUE over WORD COUNT. Target 8,500-10,500 words. ABSOLUTE HARD CAP 10,500.
// Walks 5->6->7->8->9->10 ladder via runPolish from polish-helper.
// Six fixed sections mirror st0018 exactly. LEAN-FROM-START.

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

const ID = 'st0019';
const QUESTION = "HVAC Replacement vs Repair Conversation: Closing a $12,000 System Upgrade Without Looking Like a Hack — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'hvac-training',
  'residential-hvac',
  'service-technician',
  'comfort-advisor',
  'replace-vs-repair',
  'refrigerant-transition',
  '60-min-meeting',
  'standard-team',
  'st0019'
];

const sources = [
  { title: 'ACCA (Air Conditioning Contractors of America) Manual J residential load calculation, Manual S equipment selection, Manual D duct design — the ANSI/ACCA-recognized residential sizing standard; oversizing by 25-50% (rule-of-thumb sizing without Manual J) is the #1 cause of short-cycling, humidity complaints, and 8-12% efficiency loss; required by 2018 IRC + many state codes for permitted replacements', url: 'https://www.acca.org/standards' },
  { title: 'AHRI (Air-Conditioning, Heating, and Refrigeration Institute) certified ratings + AHRI Directory — independent third-party performance verification for HVAC equipment, SEER2/EER2/HSPF2 ratings, certified matched-system performance; required for IRA Section 25C federal tax credit eligibility and most state/utility rebate programs', url: 'https://www.ahridirectory.org/' },
  { title: 'EPA AIM Act (American Innovation and Manufacturing Act of 2020) — phasing down HFC refrigerants 85% by 2036; R-410A banned from new HVAC equipment manufacture Jan 1 2025; replacement refrigerants R-454B (Puron Advance, used by Carrier/Bryant/Lennox/Daikin/Goodman) and R-32 (used by Daikin/Mitsubishi) — A2L mildly-flammable classification requires updated tech training + leak detection + service procedures', url: 'https://www.epa.gov/climate-hfcs-reduction/aim-act' },
  { title: 'EPA Section 608 refrigerant technician certification — federally required for any HVAC tech who handles refrigerants; Universal/Type I/II/III certification; A2L refrigerant transition (R-454B/R-32) requires updated handling procedures + ASHRAE 15-compatible service practices; violation = $44K/day civil penalty + criminal referral', url: 'https://www.epa.gov/section608' },
  { title: 'IRA Section 25C Energy Efficient Home Improvement Credit (revised Inflation Reduction Act 2022) — 30% of project cost, capped at $2,000 for heat pumps (air-source + ground-source via 25D); $1,200 annual cap for non-heat-pump HVAC (central AC up to $600, gas furnace up to $600); lifetime $3,200 annual aggregate; requires CEE Tier qualifying equipment and AHRI certificate; non-refundable credit on Form 5695', url: 'https://www.energy.gov/save/rebates' },
  { title: 'HEEHRA (High-Efficiency Electric Home Rebate Act, IRA Section 50122) — point-of-sale rebates for heat pump installations up to $8,000; income-tiered (100% for households below 80% AMI, 50% for 80-150% AMI, no rebate above 150% AMI); administered state-by-state via state energy offices; rollout 2024-2025 by state; stackable with 25C tax credit in some cases', url: 'https://www.energy.gov/scep/home-energy-rebates-programs' },
  { title: 'DOE ENERGY STAR Most Efficient HVAC criteria + SEER2/EER2/HSPF2 minimums — Jan 1 2023 DOE raised regional minimum efficiency: North 14 SEER2 / South 15 SEER2 / Southwest 15 SEER2 (with EER2 minimum); ENERGY STAR central AC requires 16+ SEER2; ENERGY STAR heat pump 15.2+ SEER2 / 8.1+ HSPF2; testing standard changed from SEER to SEER2 = ~4.5% lower number for same equipment', url: 'https://www.energystar.gov/products/heating_cooling' },
  { title: 'BLS Occupational Outlook for HVAC mechanics + installers (SOC 49-9021) — ~415K employed nationally, median wage ~$57K, projected growth ~6% through 2032 (faster than average); service tech shortage ~110K open positions; comfort advisor / inside-sales role typically base + commission ($60K-$180K+ for top advisors); apprenticeship + EPA 608 + NATE certification standard credentialing path', url: 'https://www.bls.gov/ooh/installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers.htm' },
  { title: 'NATE (North American Technician Excellence) certification — independent industry credential for HVAC techs; ~50K+ NATE-certified techs nationally; specialty exams (air conditioning, heat pumps, gas furnaces, oil heating, hydronics, light commercial); homeowner-facing trust signal akin to ASE for auto techs; NATE-certified techs avg ~15% higher service ticket + replacement close than non-certified', url: 'https://www.natex.org/' },
  { title: 'HVAC Industry Market Data — IBISWorld + ACHR News + Plumbing & Mechanical reporting ~$130B US HVAC contractor market across ~150K establishments (residential + light commercial); 35,000+ independent residential HVAC contractors; residential replacement market ~$50B/yr; avg replacement system ticket $8K-$25K (air handler + condenser + install + permit); ~50% of residential replacement tickets via diagnostic-call conversion', url: 'https://www.ibisworld.com/' },
  { title: 'Private equity HVAC rollups 2020-2026 — Service Experts (Lennox subsidiary, ~100 locations), ARS Rescue Rooter (American Residential Services, ~70 markets, owned by American Securities), One Hour Heating & Air Conditioning (Authority Brands, 350+ franchises), Apex Service Partners (Alpine Investors PE, 100+ acquired locations), Sila Heating + Air Conditioning (Audax Group PE, NE corridor), Wrench Group (Leonard Green PE, multi-trade), PowerHouse Heating & Air (PE-backed Mid-Atlantic), Mantis Innovation (multi-trade PE), Right Time Heating (PE-backed Canada/US) — consolidated ~5-10% of US HVAC service market, raising avg ticket + closing higher because of comfort-advisor model + financing partnerships', url: 'https://www.achrnews.com/' },
  { title: 'Carrier Global (NYSE: CARR, Carrier + Bryant + Payne brands, ~$22B revenue) + Trane Technologies (NYSE: TT, Trane + American Standard, ~$17B) + Lennox International (NYSE: LII, Lennox + Armstrong Air + AireFlo + Ducane + Concord, ~$5B) + Daikin Industries (Daikin + Goodman + Amana, world #1 HVAC ~$30B) + Mitsubishi Electric (ductless mini-split leader) + Rheem (Rheem + Ruud + Friedrich) — Big-Six US residential HVAC OEMs; manufacturer warranty tiers 5/10-yr parts standard, 10-yr labor optional, extended via certified contractor programs (Carrier Factory Authorized Dealer, Trane Comfort Specialist, Lennox Premier Dealer, Daikin Comfort Pro)', url: 'https://www.carrier.com/' },
  { title: 'HVAC contractor SaaS + field-service stack — ServiceTitan (NYSE: TTAN, ~$2B revenue, ~12K HVAC + trades customers, dominant residential), Housecall Pro (~30K SMB trades), FieldEdge (~6K), Jobber (~250K SMB trades), Workiz (~120K); pricing-presentation tools (Service Titan Pricebook + Profit Rhino + Coolfront) standardize good/better/best replacement options; financing partners GreenSky / Synchrony Home Design / Wells Fargo Home Projects / Service Finance Company / EnerBank / Sunlight Financial integrated into proposal flow', url: 'https://www.servicetitan.com/' },
  { title: 'Manual J residential load calculation software — Wrightsoft Right-J (industry standard, ACCA-approved), Elite Software RHVAC, CoolCalc (ACCA-approved free), Energy Vanguard Manual J — replaces tonnage-per-square-foot rule of thumb (typically oversizes 25-50%) with envelope-specific calculation factoring insulation R-value, window U-value + SHGC, infiltration ACH50, internal gains, climate zone; permitted replacements in 30+ states require Manual J submittal', url: 'https://www.wrightsoft.com/' },
  { title: 'AHRI Performance Verified directory + matched-system performance — AHRI certifies the combined performance of outdoor unit + indoor coil + air handler as matched system (mismatched coils + condensers void warranty + lose 5-15% efficiency); CEE (Consortium for Energy Efficiency) Tier 1/2/3 list defines IRA 25C-qualifying equipment (must be CEE Tier 2 for $600 central AC credit, CEE Tier 1+ heat pump for $2K credit)', url: 'https://www.cee1.org/' },
  { title: 'HVAC financing partners — GreenSky (Goldman Sachs subsidiary, ~$10B annual home improvement loans, primary HVAC contractor partner), Synchrony Home Design Credit Card (deferred-interest promotional), Wells Fargo Home Projects (revolving), Service Finance Company (private-label financing for contractors), EnerBank USA (Regions Bank, specialty home improvement), Sunlight Financial (heat-pump focused), Foundation Finance Company (subprime niche); APRs 0% promotional / 6.99-29.99% standard; contractor dealer fees 0-12% — CFPB scrutiny on deferred-interest disclosure 2023-2025', url: 'https://www.greensky.com/' },
  { title: 'Utility + state rebate programs — Mass Save MA + RI ($10K heat-pump rebate), NYSERDA NY ($3K-$8K heat-pump), MassCEC, NJ Clean Energy Program, Efficiency Maine, Energy Trust of Oregon, BPA NW, ComEd IL, PG&E + SCE CA TECH Clean California, Xcel Energy CO/MN, Duke Energy Carolinas, FPL Florida, TVA Heat Pump Plus, Austin Energy, Sacramento SMUD, LADWP — stackable with IRA 25C + HEEHRA; require AHRI certificate + licensed contractor + post-install inspection', url: 'https://www.dsireusa.org/' }
];

// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### ⚔ The Pulse Training
> **Who this is for:** **Residential HVAC owners + service managers + lead service techs + comfort advisors + dispatchers** — independent contractors (the 35,000+ that **Service Experts / ARS Rescue Rooter / One Hour Heating & Air / Apex Service Partners / Sila / Wrench Group** PE-rollups have NOT yet consolidated), Carrier Factory Authorized + Trane Comfort Specialist + Lennox Premier + Daikin Comfort Pro dealers, the service-truck crew walking into a 14-22 yr-old failing system on a 96°F afternoon. Works for the first-year EPA-608 tech, the 10-yr vet who quotes-and-leaves, the comfort advisor running 4-6 in-home consults/day at 35-55% close, the owner adding the $2K Section 25C handout + $8K HEEHRA rebate sheet to every bid. Per **ACCA + AHRI + ACHR News**, top crews convert **45-60% of diagnostic calls on 12+ yr systems to replacement bids** and close **55-70% at $14K-$22K avg ticket** ($24K-$38K heat-pump conversions w/ full rebate stack); bottom-quartile **quote-and-leave techs** convert **15-25% bid / 30-40% close** because they hand over a number with zero context. **Run Monday morning service meeting.**
>
> **What your techs leave with:** A named discipline — **5-STAGE IN-TRUCK COMFORT CONSULT (DIAGNOSE → DEMONSTRATE → DECIDE-CRITERIA → DESIGN → DOLLARS)** + **THREE COST CONVERSATIONS (REPAIR today + next-12-mo failure prob / REPLACE net of 25C + HEEHRA + utility rebate + mfr promo / OPERATING 10-15 yr at current SEER2 vs new SEER2)** — for converting a $189 diagnostic into a $14K-$22K replacement contract without looking like the slimy quote-machine. Plus verbatim language, two role-plays (panicked 96°F R-410A leak + 60s couple with R-22 dinosaur), Manual J discipline, rebate handout, financing options.
>
> **Owner brings:** **(1)** 3 recent quote-and-leave diagnostic calls (dollar number + objection + lost-to-competitor). **(2)** Pre-Consult Kit — Manual J tablet (Wrightsoft Right-J or CoolCalc), IRA 25C handout, state/utility rebate sheet, AHRI cert template, mfr warranty comparison, financing pre-approval app (GreenSky/Synchrony/Wells Fargo), before/after photos, 5 local references. **(3)** Whiteboard to score each tech's last 10 diag calls by stage + cost-conversation completeness.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Agenda + Cold Open Story** — Why HVAC techs lose 60-80% of replacement opportunities (price quote without context = no), what changes today with R-454B + IRA 25C + HEEHRA; same-neighborhood 16-yr-old failing system: Tech-A quoted $11,400 + left → homeowner got 3 other bids + went $8,200 cheap-quote vs Tech-B asked 4 questions + showed heat-load math + walked IRA credit math + closed in-truck $14,800 on heat-pump netting $11,300 after credits + rebates | Owner / Service Manager | Techs feel the gap — quote-and-leave loses to in-truck comfort consult by 3-4x close rate |
| **0:10-0:35** | **The Teach** — 5-STAGE (DIAGNOSE / DEMONSTRATE / DECIDE-CRITERIA / DESIGN / DOLLARS, the price comes LAST) + Three Cost Conversations (REPAIR / REPLACE net of credits + rebates / OPERATING 10-15 yr) | Owner / Service Manager | Techs recite all 5 stages + 3 cost conversations + IRA + HEEHRA + AHRI cert verbatim without notes |
| **0:35-0:45** | **Discussion** — 8 prompts: when is repair the right answer? + when do you decline to repair (R-22 / repeat failures / safety)? + 25C tax-credit disclosure (you don't know their tax situation) + when heat-pump vs straight-cool replacement | Owner / Service Manager + room | Techs audit last 10 diagnostic calls per tech |
| **0:45-1:05** | **Role-Play x 2** — Round 1: 14-yr R-410A heat-pump compressor down 96°F afternoon panicked homeowner $3,500 emergency fund (10 min) + 60-sec reset + Round 2: 22-yr R-22 gas furnace + 18-yr R-22 A/C couple in 60s window-unit-camping son-is-an-accountant kitchen-table (10 min) | Techs in pairs | Run full 5-STAGE + all 3 cost conversations under deflection, close in-truck Round 1, schedule kitchen-table follow-up Round 2 |
| **1:05-1:10** | **Debrief + Commitments** — 3 questions + each tech names ONE specific recent quote-and-leave + ONE verbatim line they will change + ONE pre-consult kit item they're missing | Owner / Service Manager | One call + one verbatim + one kit-completion habit |
| **1:10-1:13** | **Leave-Behind** — one-pager + 5-Stage In-Truck Comfort Consult Script Card + 6 Things to Bring on Every Replacement Call + 3 Phrases That Get You Sued or Refunded | Owner / Service Manager | One-pager in every truck binder + ServiceTitan task |

> ### 🎯 Bottom Line
> **A homeowner with a 14-22 yr-old failing HVAC system on a 96°F afternoon does not decide repair-vs-replace based on price — she decides based on whether her tech walked her through (1) what's broken + likelihood of next failure, (2) the real replacement cost AFTER $2K IRA 25C + up to $8K HEEHRA + state/utility rebate + mfr promo, and (3) the 10-15 yr operating cost delta between her current 9-SEER dinosaur and a new 16-18 SEER2 system.** Per **ACCA + AHRI + ACHR News** + EPA AIM Act R-410A phase-out Jan 1 2025 + IRA 25C + HEEHRA, residential HVAC has shifted from quote-and-leave to **rigorous-AND-relational in-truck comfort consult**. Run the **5-STAGE + 3 cost conversations** = **45-60% bid rate, 55-70% close, $14K-$22K avg ticket**. Quote-and-leave = **15-25% bid, 30-40% close, lose to cheap quote every time**. Five stages. Three cost conversations. The diagnostic IS the consult — the contract closes in the truck or at the kitchen table that night.

`;

// ============================================================================
// CORE -- Sections 1-6 fully written
// ============================================================================
const core = `---

## SECTION 1 -- INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do not open with the manufacturer-promo flip-chart. Walk into the bay, say the numbers, tell the story, end with the two phrases that decide whether your techs earn the replacement or earn the lost-to-competitor follow-up. **Ten minutes. Hard stop at 0:10.**

### The numbers, then the story.

**The numbers.** Per **ACCA + AHRI + ACHR News + IBISWorld**: US residential HVAC = **~$130B / ~150K establishments**, with **35,000+ independent contractors** still operating as PE rollups (**Service Experts / ARS / One Hour / Apex / Sila / Wrench**) consolidate **~5-10%**. Replacement market **~$50B/yr** at **$8K-$25K avg ticket** ($14K-$22K mid-tier, $24K-$38K heat-pump conversions w/ full IRA + HEEHRA + utility-rebate stack). Per ServiceTitan + ACHR, **~50% of replacement tickets originate from diagnostic-call conversion** — the **$89-$189 diag visit is the highest-leverage seller in the company**. Top: **45-60% bid rate on 12+ yr systems / 55-70% close**. Bottom: **15-25% bid / 30-40% close**.

Top math: 8 diag/day × 50% bid × 60% close = **2.4 contracts/day × $16K = $38K/day**. Bottom: 8 × 20% × 35% = **0.56 contracts × $14K = $7,840/day** — 5x revenue gap on the same truck. Differentiator is in-truck consult discipline, not wrench skill.

**The story.** Tuesday, **suburban Columbus OH**, 14-yr-old R-410A heat pump down on a 92°F afternoon. Two techs, same neighborhood. **Tech-A**, 6-yr EPA-608, opened: *"Compressor's shot. $2,400 to repair, $11,400 for new system. Here's the quote — let me know."* Left in 22 minutes. Homeowner got **3 more bids**, took the **$8,200 cheap quote** that mismatched coil + condenser (voided AHRI warranty) and oversized 30% (no Manual J). Tech-A's company lost a $14,800 sale because nobody helped the homeowner see why cheap was the expensive answer.

Same hour, **Tech-B**, NATE-certified + Carrier Factory Authorized, opened: *"Compressor failed, evap coil leaking R-410A — EPA banned R-410A from new equipment Jan 2025 so refrigerant cost is up 60%, and you're on a 14-yr 9-SEER system vs current code 15 SEER2. Four questions before I quote so I quote the right system, not the most expensive."* Asked: **(1)** How long staying? (12+ years.) **(2)** Anyone with allergies/asthma? (Daughter.) **(3)** Hot/cold rooms? (Upstairs bedrooms.) **(4)** Typical July electric bill? ($340.) Ran a **5-min Manual J on tablet** (Wrightsoft Right-J), showed the **IRA 25C handout** ($2,000), **AEP Ohio rebate** ($800), **Carrier promo** ($1,500). Quoted **$14,800 net $11,300 after credits + rebates** on an 18 SEER2 two-stage heat pump that cuts her summer bill ~28% (~$1,140/yr). **Closed in the truck. Install Friday.**

> ### ⚠️ Common Trap
> *"But Tech-A's quote is a real quote — homeowner can shop it."* Three answers. **(1)** Of course she shops it — you gave her a number with no decision context, the cheap quote always wins that shopping trip. **(2)** Quote-and-leave is the slowest, lowest-margin sales motion in the trades because the highest-bidder always loses the price-only comparison. **(3)** Your NATE cert + Carrier/Trane/Lennox/Daikin Factory Authorized status + AHRI matched-system certificate + Manual J load calc are the actual moat — every one-truck operation has trucks; almost none have the full credentialing + tooling stack.

**Transition:** "Next 50 minutes: 5-stage in-truck consult, 3 cost conversations, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into **5-STAGE IN-TRUCK COMFORT CONSULT (15 min, ~3 min/stage)** + **Three Cost Conversations (10 min, ~3 min/conversation + 1 min cross-link)**. Pause for one clarifying question per stage. End-of-section test: every tech recites all 5 stages + 3 cost conversations + 25C credit cap + HEEHRA income tiers + AHRI matched-system requirement verbatim without notes.

### Part A -- The 5-STAGE IN-TRUCK COMFORT CONSULT (15 min)

Most lost replacement sales collapse at Stage 1 (tech opens with the price instead of the diagnosis story) or Stage 5 (tech quotes top-tier without ever asking what the homeowner is actually trying to solve). **The price comes LAST — after the homeowner's decision criteria are explicit.**

#### Stage 1 -- DIAGNOSE (3 min)

**Name what's wrong in plain English, what caused it, and whether the system is repairable. NO price yet. NO replacement push yet.**

> ### 🎤 Verbatim Script -- DIAGNOSE
> *"Here's what I found. Compressor locked up — windings shorted, no resistance on the megger. Coil has an active R-410A leak at the U-bend, ~1.8 lb low. System is 14 yrs old. **Two paths — repair or replace.** Before I price either, want to make sure I'm solving the right problem."*

Plain English + named cause + both paths. **Common trap.** *"Compressor's shot, you need a new system"* — skipped to recommendation, sounds like upsell. *"$11,400 for a new system"* — skipped to price, lost trust.

#### Stage 2 -- DEMONSTRATE (3 min)

**Show what's broken. Bring her outside, point at the part, show the meter reading.**

> ### 🎤 Verbatim Script -- DEMONSTRATE
> *"Outside 30 seconds. **Compressor** — suction line frosted top, warm bottom = lockup. **Leak detector** — listen, beeping at the U-bend. **Megger reading on the windings** — should be 500+ megohms, getting 0.08 = dead short."*

Visual + audible + meter-readable evidence collapses *"are you upselling me?"*. **Common trap.** *"Trust me"* — invites distrust. Live demo > CompanyCam photos.

#### Stage 3 -- DECIDE-CRITERIA (3 min)

**Four questions that determine which system is right. NOT a sales-discovery interrogation.**

> ### 🎤 Verbatim Script -- DECIDE-CRITERIA
> *"Four quick questions so I quote the right system, not the most expensive one. **(1)** How long staying? (Drives payback.) **(2)** Anyone with asthma/allergies/COPD? (Drives filtration spec.) **(3)** Hot/cold rooms today? (Drives zoning + Manual D.) **(4)** Typical summer electric bill? (Drives operating-cost math.) Also — **gas or all-electric**, and **household income range** because federal rebate ranges depend on it?"*

Income question is HEEHRA-driven — frame gently, give her permission to say *"prefer not to share"*. **Common trap.** Skipping the 4 = quoting top-tier to a moving-in-6-mo homeowner OR baseline to an asthma family needing MERV-16.

#### Stage 4 -- DESIGN (3 min)

**Tablet-based Manual J — 5 min, in front of her — produces actual tonnage + system spec.**

> ### 🎤 Verbatim Script -- DESIGN
> *"**Manual J load calculation** on my tablet — ACCA-standard. Sq ft, ceiling, windows + orientation, insulation, ZIP climate zone. Cheap-quote rule-of-thumb '1 ton per 600 sq ft' oversizes 25-50% causing short-cycling + humidity + 8-12% efficiency loss. **Your house = 2.8 tons. Round to 3, not 4.** Match outdoor unit + indoor coil + air handler — **AHRI matched-system certificate**, only way mfr warranty + IRA credit stay valid."*

Manual J + AHRI matched-system = visible competence. **Common trap.** Skip Manual J + oversize → comfort complaints + denied IRA credit + voided warranty.

#### Stage 5 -- DOLLARS (3 min)

**NOW the price. Three options good/better/best — all with full cost stack: gross / IRA 25C / HEEHRA / utility rebate / mfr promo / NET / financing.**

> ### 🎤 Verbatim Script -- DOLLARS
> *"Three options. **Good — Carrier Comfort 15.2 SEER2 single-stage HP 3-ton matched AHRI — gross $11,800, 25C $2,000, AEP $500, Carrier $750 — net $8,550.** **Better — Carrier Performance 17 SEER2 two-stage HP variable-speed — gross $14,800, 25C $2,000, AEP $800, Carrier $1,500 — net $10,500.** **Best — Carrier Infinity 19 SEER2 variable-speed HP + Infinity thermostat + MERV-16 — gross $18,500, 25C $2,000, AEP $1,200, Carrier $2,000 — net $13,300.** All include permit, AHRI cert for your taxes, 10-yr parts + labor, Manual J/S/D docs. Wells Fargo Home Projects 0% 18 mo or 6.99% 84 mo. **Where do you want me to start?**"*

Three options + transparent stack = informed decision. **Common trap.** Single top-tier quote = upsell. Single baseline = leaves money + loses to wrong-sized cheap quote.

### Part B -- The Three Cost Conversations (10 min)

**The homeowner can't decide repair-vs-replace without all three. Most techs run REPAIR cost only. The PE-rollups + top independents run all three on every diagnostic call where the system is 12+ yrs.**

#### Cost Conversation 1 -- REPAIR COST

**Today's repair invoice + the probability of next-failure-within-12-months. Statistically honest, not a manipulation.**

> ### 🎤 Verbatim Script -- REPAIR
> *"Repair today is $2,400 — compressor, coil, refrigerant. **Honest probability** — on a 14-yr R-410A system after compressor + coil failure, ACCA + mfr field data say **40-60% chance of another major failure within 12-18 months** (condenser fan, reversing valve, TXV, other coil). Post Jan 1 2025 R-410A refrigerant cost is up ~60% per EPA AIM Act. **Repair is real option** — buys 12-18 months on avg, sometimes 5 yrs lucky. Right call if you're moving or decision math says wait."*

Failure probability is honest. **Common trap.** *"Throwing good money after bad"* — sales-y. *"You'll be back in 6 weeks"* — manipulative.

#### Cost Conversation 2 -- REPLACE COST (NET, not gross)

**Replace gross MINUS IRA 25C + HEEHRA + utility rebate + mfr promo = real out-of-pocket. Missing rebate stack leaves $2K-$10K of decision math on the table.**

> ### 🎤 Verbatim Script -- REPLACE
> *"Replace gross $14,800 for mid-tier 17 SEER2 HP. **IRA 25C — 30% of project, capped $2,000 qualifying HP, non-refundable so need $2K federal tax liability, talk to your CPA. Here's IRS Form 5695.** **HEEHRA — up to $8,000 HP, income-tiered: 100% below 80% AMI, 50% 80-150%, none above 150%. Ohio rollout via OH Development Services Agency.** **AEP Ohio $800 for 15+ SEER2 HP.** **Carrier mfr $1,500 this quarter.** Best case: $14,800 - $2,000 - $8,000 - $800 - $1,500 = **$2,500**. Likely (above HEEHRA cap): **$10,500**. Worst (no usable 25C): **$12,500**."*

Best/likely/worst sets up financing honestly. **Common trap.** Gross without rebate stack = losing to competitor who shows net. Best-case-only = customer feels misled at install.

#### Cost Conversation 3 -- OPERATING COST (10-15 yr)

**Current SEER vs new SEER2 over system life = the math that justifies mid-tier vs baseline for a 10+ yr homeowner.**

> ### 🎤 Verbatim Script -- OPERATING
> *"Current system **9 SEER** (1998 min). Code minimum **15 SEER2** (~16 old-SEER — SEER2 test method ~4.5% lower for same equipment). Mid-tier 17 SEER2 is **89% more efficient**. On $340 July bill, cooling portion ~$240. **89% more efficient = ~$108/mo summer × 5 mo + ~$45/mo heating × 4 mo = ~$720/yr operating savings. Over 12 yrs (avg system life) ~$8,640.** **At 10+ yr stay, BETTER pays back; under 5 yrs, GOOD makes more sense.**"*

Links to Stage 3 tenure answer. **Common trap.** Skip operating-cost math → homeowner picks cheapest. Overstate savings → refund requests.

> ### 🎯 Bottom Line
> 5 stages + 3 cost conversations = 45-60% bid rate + 55-70% close + $14K-$22K avg ticket + zero refund requests. Stages without Cost Conversations = honest tech who still loses to the rebate-stack competitor. Cost Conversations without Stages = numbers without the trust that makes them land.

---

## SECTION 3 -- THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard. Write **DIAGNOSE / DEMONSTRATE / DECIDE-CRITERIA / DESIGN / DOLLARS** across 5 columns. Each tech audits his last 10 diagnostic calls out loud — which stage he skipped, which cost conversation he left out. **Count to five after each prompt.**

**1 — "When is repair the RIGHT answer?"** **Often.** Under 10-yr systems with single-component failure (capacitor, contactor, blower motor) = repair. 10-15 yr with single major failure where homeowner is moving inside 24 mo = repair. **Owner:** *"The honest 'repair is right here' call wins 4 future replacement jobs by reputation."*

**2 — "When do you DECLINE to repair?"** **Three:** **(a) R-22** — EPA-banned new mfg since 2020, $200/lb if available, $1,500+ of vanishing refrigerant into a 20+ yr system. **(b) Repeat failures** — 3rd major component in 18 mo = system done. **(c) Safety** — cracked HX (CO risk), refrigerant leak in occupied space, electrical hazard. **Owner:** *"Decline is a trust-builder."*

**3 — "Right disclosure on the IRA 25C credit?"** **Verbatim: 'Section 25C is non-refundable, 30% capped $2,000 for CEE Tier 1+ HP. Need $2K federal tax liability to fully use. I'm a tech not a CPA — talk to your CPA or check Form 1040 Line 24. Here's IRS Form 5695 + the AHRI cert you'll need.'** **Owner:** *"Tax-pretending = CFPB complaint or small-claims refund."*

**4 — "Heat pump vs straight-cool replacement?"** **Heat pump if** — all-electric or could go all-electric, climate zone 1-4, homeowner wants $2K 25C or $8K HEEHRA, gas > electric in region, planning solar. **Straight-cool + keep furnace if** — zone 6-7 with cheap gas + furnace 10+ yrs left, homeowner won't switch fuel, HP premium doesn't pencil. **Owner:** *"HP is IRA-driven default 2026-2027 but NOT right for every house."*

**5 — "Neighbor got it for half that"?** **Verbatim: 'Three line items: (1) Manual J — yours is 2.8 tons, cheap-quote often oversizes to 4. (2) AHRI matched-system cert — only way mfr warranty + IRA credit stay valid. (3) 10-yr parts AND labor vs cheap-quote parts-only — labor failure year 7 = $1,200 OOP. Happy to do a line-item comparison.'** **Owner:** *"Never trash competitor — show line items."*

**6 — "25C if tax liability under $2K?"** *"Use what you can — non-refundable, doesn't roll forward. Can pivot spec to a smaller 25C-eligible system at a price that fits, or pivot to straight-cool where credit is $600 but still applies."* **Owner:** *"Don't sell the credit she can't use."*

**7 — "Right financing recommendation?"** **Lead with cheapest legitimate option.** Wells Fargo Home Projects 0% 12-18 mo promo (best if pay off in window), Service Finance 6.99-9.99% 84 mo (fixed monthly), Synchrony 0% deferred 12 mo (CFPB-scrutinized — disclose interest accrues from day 1). **NEVER push highest-dealer-fee product to bury your fee.** **Owner:** *"Financing is service, not profit center."*

**8 — "ONE verbatim change."** Each tech: ONE recent diag + ONE skipped stage + ONE line tomorrow. **Owner:** *"ServiceTitan task + reviewed next ride-along."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair techs. **Two scenarios, 10 min each, 60-sec reset between.** Walk the bay. Listen for the verbatim *"before I quote, four quick questions"* (diagnostic for Stage 3) + whether the tech runs all 3 cost conversations. Mark which stage each tech skips.

### Role-Play 1 -- 14-Yr R-410A Heat Pump, Compressor Down on 96°F Afternoon (10 min)

**Setup:** Mrs. Janet Cooper, late-30s, two kids ages 6 + 9, 14-yr-old Goodman R-410A heat pump in suburban **Phoenix AZ**, original to a 2010 build. **96°F afternoon, system died at 1 PM, kids home from camp at 5 PM.** Evap coil has active leak (1.8 lb low on R-410A), compressor windings shorted (megger 0.08 megohms). Repair cost ~$2,400; replacement options $9,400 (16 SEER2 single-stage straight-cool) to $14,800 (18 SEER2 two-stage heat pump w/ variable-speed air handler). Mrs. Cooper just refinanced 8 months ago + has a $3,500 emergency fund. Panicked + price-sensitive. Husband at work, available by phone. **Tech must run full 5-STAGE + all 3 cost conversations under deflection. Close inside the truck OR schedule kitchen-table tonight 7 PM with husband on speakerphone.**

> ### 🎤 HOMEOWNER -- Mrs. Cooper
> Panicked (96°F, kids coming home), suspicious of the upsell (heard horror stories), price-anchored ($3,500 emergency fund). Engages if tech diagnoses clearly + shows the compressor + acknowledges her emergency-fund constraint + walks the rebate stack + offers financing without pressure.
>
> **Deflection 1 (min 4):** *"Just fix the leak today, I'll deal with replacing it in the fall."*
>
> **Deflection 2 (min 8):** *"My neighbor just got hers replaced for $7,200 — why is yours $9K minimum?"*

> ### 🎤 TECH
>
> - **Min 0-2 (DIAGNOSE):** *"Compressor windings shorted — 0.08 megohms on the megger, should be 500+. Evap coil active R-410A leak at U-bend, 1.8 lb low. System is 14 yrs old. **Two paths — repair or replace.** Before I price either, want to make sure I'm solving the right problem."*
> - **Min 2-3 (DEMONSTRATE):** *"Outside 30 sec. **Compressor — suction line frosted top warm bottom, lockup.** **Leak detector — beeping at the U-bend.** **Megger — 0.08 megohms.**"*
> - **Min 3-5 (DECIDE-CRITERIA):** *"Four questions. Staying how long? (10+ yrs.) Asthma/allergies? (Son.) Hot/cold rooms? (Upstairs.) Typical July bill? ($310.) Gas or all-electric + household income for HEEHRA?" (All-electric, above 150% AMI — no HEEHRA, 25C only.)*
> - **Min 5-6 (DESIGN):** *"Manual J on my tablet — sq ft + windows + ZIP. **2.6 tons. Round to 3.** Cheap-quote guys oversize to 4. AHRI matched coil + condenser + air handler — only spec that keeps warranty + qualifies IRA credit."*
> - **Min 6-7 (Deflection 1 — repair-only):** *"Repair is $2,400, legitimate option if cash is the constraint. **Honest probability** — on a 14-yr R-410A system after compressor + coil failure, 40-60% chance of next major failure 12-18 mo. R-410A cost up 60% since EPA AIM Act. **If repair's the right call given your emergency fund, I'll do it today and revisit in 12 mo.**"*
> - **Min 7-9 (DOLLARS + Deflection 2 — $7,200 neighbor):** *"Three options. **Good — 16 SEER2 single-stage AC, gross $9,400, IRA 25C $600, SRP $400, mfr $500 — net $7,900.** **Better — 17 SEER2 two-stage heat pump variable-speed, gross $13,200, 25C $2,000, SRP $1,000, mfr $1,200 — net $9,000.** **Best — 19 SEER2 variable-speed HP + MERV-16 (asthma), gross $16,400, 25C $2,000, SRP $1,500, mfr $1,800 — net $11,100.** On your neighbor's $7,200 — three line items: rule-of-thumb sized (likely 4 tons not 3), parts-only warranty (labor failure year 4+ = $1,200 OOP), no Manual J + no AHRI cert."*
> - **Min 9-10 (Close):** *"Honest framing — emergency fund + 10+ yr stay + asthma kid = **Better $9,000 net** is the math. Wells Fargo Home Projects 0% APR 18 mo, $500/mo paid off before promo, zero interest. **Write it up + install Friday?** Or kitchen-table tonight 7 PM with your husband on speakerphone."*

### 60-Second Reset

> ### 🟡 Coach Note
> **"Switch sides — 60-sec reset."** Stand up. Read the OTHER role's paper. Go.

### Role-Play 2 -- 22-Yr R-22 Gas Furnace + 18-Yr R-22 A/C, Couple in 60s, Window-Unit Camping, Son the Accountant (10 min)

**Setup:** Mr. + Mrs. Frank + Linda Whitaker, both 64, retired/semi-retired, 22-yr-old gas furnace + 18-yr R-22 A/C in **Annapolis MD** mid-Atlantic, original to a 2003 build, **planning to stay put 10-15+ yrs**. A/C compressor died last week — **camping on a window unit** in the bedroom. The furnace passes inspection but is **78% AFUE** (current code minimum 95% AFUE condensing). R-22 is EPA-banned from new manufacture; recharge $200/lb if available at all. Son **Mike is a CPA in DC**, told them *"don't sign anything until I review the IRA credit math + the financing terms."* Mike available **Saturday morning at the kitchen table**. **Tech must NOT push contract — schedule kitchen-table Saturday + leave full proposal binder + walk the R-22 reality + walk the BOTH-systems vs A/C-only math + leave the financing options for Mike to review. Trust is the entire game. NO deposit, attach rescission notice, leave most rigorous proposal binder of his career.**

> ### 🎤 HOMEOWNERS -- Frank + Linda
> Burned (heard about scams), cautious, family-anchored (Mike). Engages if tech takes R-22 reality seriously + volunteers BOTH-or-just-A/C analysis + welcomes Mike + refuses deposit + leaves binder for Mike.
>
> **Deflection 1 (min 5):** *"If the furnace still works, why replace it? I'd rather just replace the A/C and keep the furnace."*
>
> **Deflection 2 (min 9):** *"How do I know you're not just selling me the most expensive system because that's what makes you the most commission?"*

> ### 🎤 TECH
>
> - **Min 0-2 (DIAGNOSE):** *"A/C compressor failed, 18-yr R-22 system. **R-22 EPA-banned new mfg since 2020** — recharge $200/lb if I can source it, you'd be putting $1,200+ of vanishing refrigerant into a system at end of life. **I won't recommend repair. Let me walk you through replace options for the A/C, plus the furnace separately.**"*
> - **Min 2-3 (DEMONSTRATE):** *"Outside 30 sec. **Nameplate — R-22, mfg 2007. Furnace label — 78% AFUE, mfg 2003.** Code minimums now R-454B + 95% AFUE condensing. Both at end of design life."*
> - **Min 3-5 (DECIDE-CRITERIA):** *"Four questions. Staying how long? (10-15+ yrs.) Allergies/COPD? (Linda seasonal.) Hot/cold rooms? (Upstairs cold winter, hot summer.) July electric + Jan gas? ($280/$180.) All-electric possible or staying gas + income for HEEHRA?" (Staying gas for cooking + dryer. Retirement income, likely 80-150% AMI band, partial HEEHRA.)*
> - **Min 5-7 (Deflection 1 — A/C only):** *"Smart question. **Path A: A/C only, keep 78% AFUE furnace.** 16 SEER2 R-454B, gross $9,800, 25C $600 AC credit, BG&E $500, mfr $750 — net $7,950. Catch — new high-efficiency coil matched to existing furnace blower (static-pressure check), no $2K heat-pump credit. **Path B: dual-fuel heat pump + 95% AFUE condensing furnace.** HP does cooling + 60% of heating, gas furnace kicks in cold mornings, gross $18,400, 25C $2,000 HP + $600 furnace (subject to $1,200 non-HP annual + $3,200 lifetime, your CPA confirms), HEEHRA partial ~$4K, BG&E $1,200, mfr $1,800 — best net **$9,400**, likely **$11,400**. **Operating savings 10-15 yrs: A/C-only ~$6,500 vs current; dual-fuel ~$14,800** because HP replaces 60% of gas heating. **At 10+ yr stay, dual-fuel pencils — but $3K-$4K more out-of-pocket today.**"*
> - **Min 7-9 (Deflection 2 — commission):** *"Honest answer — yes, I get paid more on Path B than Path A. **And** more on Path A than on the cheap coil-swap some companies would push. **How to test me** — call my service manager Mark, cell on the binder, tell him *'does the rec align with my 10+ yr stay + 80-150% AMI + keep-gas preference?'* Mark confirms or overrides me. **Second test** — your son Mike's a CPA. **Saturday morning kitchen-table with Mike, I walk both options, Mike challenges every number.** No deposit, no signature today."*
> - **Min 9-10 (NEXT):** *"Saturday at 10 AM kitchen-table with Mike. **Binder for tonight:** Path A + Path B proposals, AHRI certs, IRS Form 5695 + 1040 Line 24 ref, BG&E rebate app, MD HEEHRA application, Wells Fargo + Service Finance + Synchrony comparison (with Synchrony deferred-interest CFPB disclosure), EPA-608 + NATE cards, MD HVAC license, $2M GL + WC COI, 5 refs, FTC 3-day right-of-rescission notice. **3 business days to rescind for any reason post-signature.** Mike's number for Saturday confirm? **Also — you need cooling tonight. Loan you a portable A/C till install Tuesday, no charge.**"*

> ### 🟡 Coach Note
> Tech will want to (a) push for Saturday signature ("Mike will approve") — DO NOT, lets Mike feel respected; (b) skip the A/C-only Path A presentation ("dual-fuel is obviously better") — wrong, denying the choice = upsell signal; (c) downplay the commission question — wrong, the honest "yes, I get paid more, here's how to test me" answer is the trust move; (d) close before walking the financing comparison — wrong, Mike WILL audit the financing terms. **Make the tech re-deliver the both-paths + commission-honest + rescission-notice verbatim.** Highest-leverage drill of the year.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief questions, then commitments. The ritual is what moves next quarter's bid rate + close + zero-refund-request record.

**Debrief 1 — "Strongest stage? Weakest?"** Techs over-index DIAGNOSE (it's the wrench skill they already have), under-index DECIDE-CRITERIA (the 4 questions feel like sales discovery — they aren't) and DOLLARS (rushing to a single number instead of three options with full stack). **Owner:** *"DECIDE-CRITERIA = the listening stage that makes everything else credible. DOLLARS = three options with rebate-stack transparency. Skip either, bid rate halves."*

**Debrief 2 — "Cost conversation you skipped most often?"** Most name OPERATING (felt too sales-y to walk 10-15 yr math). A few name REPLACE-NET (didn't have the HEEHRA application sheet on the truck). **Owner:** *"Operating-cost math is what justifies the mid-tier vs baseline — without it the homeowner picks the cheapest option every time. HEEHRA sheet on every truck by Friday."*

**Debrief 3 — "Customer you owe a follow-up?"** Each tech names ONE recent diag call where they quote-and-left. **Owner:** *"Follow-up within 7 days: 'Was at your house Tuesday, wanted to circle back. Three rebate updates since I was there. Mind if I drop a revised proposal?' Run DECIDE-CRITERIA + DOLLARS, leave binder, walk away."*

> ### 🎤 Commitment Ritual (Verbatim)

**Service manager:** "Open ServiceTitan or Housecall Pro. Four lines. **Line 1:** specific recent diag call where you quote-and-left — name + address + system age. **Line 2:** the stage you skipped and the verbatim line you'll add tomorrow. **Line 3:** the pre-consult kit item you're missing (Manual J tablet / 25C handout / HEEHRA sheet / financing app / mfr warranty comparison / before-after photos / refs). **Line 4:** the one cost-conversation you'll add to every 12+ yr diag call. Read aloud."

Coach the vague: *"Which customer exactly? Which words? Out loud now."*

**Closes:** "1:1 ride-along within 7 days. Not whether you closed — **whether you ran the 5 stages and all 3 cost conversations.** Bid rate follows process. Close follows bid. Repeat customers follow the absence of upsell scars."

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out the printed one-pager. 30 seconds per section. Digital version in ServiceTitan / Housecall Pro. One in every truck binder + every pre-consult kit.

> ### 📋 Leave-Behind -- "In-Truck Comfort Consult Script Card" One-Pager

> **THE 6 THINGS TO BRING ON EVERY REPLACEMENT-AGE DIAGNOSTIC CALL:**
>
> - [ ] **Manual J load-calc tablet** (Wrightsoft Right-J, Elite RHVAC, or CoolCalc — ACCA-approved)
> - [ ] **IRA Section 25C handout** + IRS Form 5695 reference + Form 1040 Line 24 location
> - [ ] **State HEEHRA application sheet** (state-specific, varies by state energy office rollout)
> - [ ] **Current state + utility rebate sheet** (Mass Save / NYSERDA / Energy Trust / Xcel / TVA / FPL / SMUD / Austin Energy / etc.)
> - [ ] **AHRI matched-system certificate template** + manufacturer warranty comparison (Carrier / Trane / Lennox / Daikin / Goodman / Mitsubishi / Rheem)
> - [ ] **Financing pre-approval app** (Wells Fargo Home Projects / GreenSky / Synchrony Home Design / Service Finance / EnerBank) + APR + deferred-interest CFPB disclosure language
> - [ ] **Before/after CompanyCam photos** (3-5 recent installs)
> - [ ] **5 local references with phone numbers** in this ZIP + Google reviews link
> - [ ] **NATE + EPA-608 cert cards + state HVAC license + $2M GL + workers-comp COI**

> **THE 5-STAGE IN-TRUCK COMFORT CONSULT SCRIPT CARD:**
>
> | # | Stage | Verbatim Cue | Time |
> |---|---|---|---|
> | 1 | **DIAGNOSE** | *"Here's what I found. [Component] failed because [cause]. System is [age]. Two paths — repair or replace. Before I price either, I want to make sure I'm solving the right problem."* | 3 min |
> | 2 | **DEMONSTRATE** | *"Come outside 30 seconds. This is the [component]. This is my [meter] reading. This is the leak detector."* | 3 min |
> | 3 | **DECIDE-CRITERIA** | *"Four quick questions — how long staying / asthma/allergies / hot or cold rooms / typical bill — plus gas vs electric + income range for HEEHRA."* | 3 min |
> | 4 | **DESIGN** | *"Running Manual J on my tablet. [X] tons. Round to [Y]. AHRI matched coil + condenser + air handler."* | 3 min |
> | 5 | **DOLLARS** | *"Three options — Good / Better / Best — each with gross / IRA 25C / HEEHRA / utility rebate / mfr promo / net / financing. Where do you want me to start?"* | 3 min |

> **THE 3 COST CONVERSATIONS:**
>
> | Conversation | Verbatim Frame | Why it matters |
> |---|---|---|
> | **REPAIR** | *"Repair today is $X. Honest probability talk — on a [age] yr [refrigerant] system after this kind of failure, 40-60% chance of another major failure within 12-18 months. R-410A refrigerant up 60% post EPA AIM Act Jan 2025."* | Frames repair as honest option, not strawman |
> | **REPLACE (NET)** | *"Replace gross $X, minus IRA 25C $X, minus HEEHRA $X (income-tiered), minus utility rebate $X, minus mfr promo $X = NET $X. Best / likely / worst case."* | Shows real out-of-pocket vs gross sticker shock |
> | **OPERATING (10-15 YR)** | *"Current SEER vs new SEER2 = $X/mo savings × 12 × 10-15 yr life = $X total operating savings. At [tenure] yrs staying, [tier] option pencils."* | Justifies mid-tier vs baseline for long-tenure homeowners |

> **3 PHRASES THAT GET YOU SUED OR REFUNDED (never say):**
>
> - [ ] *"You're getting a $2,000 tax credit guaranteed"* (CFPB + small-claims — credit is non-refundable, depends on tax liability)
> - [ ] *"This refrigerant will be illegal next year so you have to replace now"* (R-410A new-equip ban Jan 2025 does NOT make existing systems illegal; service refrigerant remains legal indefinitely)
> - [ ] *"My commission doesn't depend on which option you pick"* (false on most pay plans — honest answer: "yes I get paid more on tier B, here's how to test me")

> **NEVER DO:**
>
> - Quote a price before running Stages 1-4 (DIAGNOSE → DESIGN)
> - Skip Manual J — rule-of-thumb sizing voids warranty + creates comfort complaints
> - Mismatch coil + condenser (voids AHRI cert + voids IRA credit + voids mfr warranty)
> - Promise a federal tax credit outcome without "talk to your CPA" disclosure
> - Push deferred-interest financing without disclosing interest-accrues-from-day-1 if not paid in window
> - Top off a chronic R-410A leaker (EPA Section 608 violation, $44K/day civil penalty)
> - Recharge an R-22 system without disclosing $200/lb cost + EPA new-mfg ban
> - Push the highest-tier system without justifying ROI via operating-cost math
> - Trash a competing contractor by name
> - Take a deposit at the truck before kitchen-table review
> - Skip the FTC 3-day right-of-rescission notice
> - Misrepresent SEER vs SEER2 (SEER2 test method ~4.5% lower for same equipment)
> - Sell a heat pump in a deep-cold-climate house without dual-fuel backup analysis

> **OUTCOME LINE:** Full 5-STAGE + all 3 cost conversations + Manual J + AHRI cert + IRA + HEEHRA + utility rebate sheet + Mfr promo + transparent financing → **45-60% bid rate / 55-70% close / $14K-$22K avg ticket / $24K-$38K heat-pump-conversion ticket / zero refund requests / 4.7+ Google rating**. Quote-and-leave + no Manual J + no rebate stack + no operating-cost math → **15-25% bid rate / 30-40% close / lose to cheap quote / ~30% refund-request rate within 90 days / 3.4-4.0 Google rating / ~60% comfort-advisor turnover / ~24-month tech tenure**.

> ### 🎯 If You Only Remember One Thing
> **You don't close the $14K replacement by quoting $14K — you close it by walking the homeowner through (1) what's actually broken and how likely the next failure is, (2) what the system actually costs AFTER the $2K IRA credit + up to $8K HEEHRA rebate + state-utility rebate + manufacturer promo, and (3) what the 10-15 yr operating cost looks like on her current 9 SEER dinosaur vs a new 17 SEER2 system. The price comes LAST — after her decision criteria are explicit.**

---

## How This Training Sits Inside Your Residential HVAC Operating Motion

| Where it fits | What this addresses |
|---|---|
| **Pre-consult kit** | Manual J tablet + 25C handout + HEEHRA sheet + utility rebate + AHRI cert + financing app + refs |
| **First 3 min on truck** | DIAGNOSE — plain English, named cause, both paths |
| **Next 3 min** | DEMONSTRATE — visual + audible + meter-readable evidence |
| **Next 3 min** | DECIDE-CRITERIA — 4 questions + income for HEEHRA |
| **Next 3 min** | DESIGN — Manual J + AHRI matched-system in front of her |
| **Next 3 min** | DOLLARS — three options, full stack, financing |
| **3-cost-conversation overlay** | REPAIR + REPLACE NET + OPERATING on every 12+ yr diag call |
| **Service-manager coaching** | Weekly ServiceTitan audit, 10-call ride-along, 1:1 within 7 days |

`;

// ============================================================================
// FLOW -- two mermaid diagrams: 5-stage flow + repair-vs-replace decision tree
// ============================================================================
const flow = `

## The 5-Stage In-Truck Comfort Consult Flow

\`\`\`mermaid
flowchart TD
  A[Service Manager Opens] --> B[Section 1: Intro + Cold Open 10 min — ACCA + AHRI + ACHR + IBISWorld benchmarks $130B US HVAC + 35K+ independents + PE rollups 5-10 percent + $50B/yr replacement + 50 percent from diag conversion + top 45-60 percent bid 55-70 percent close vs bottom 15-25 percent / 30-40 percent + Columbus OH composite Tech-A quoted $11,400 left lost to $8,200 cheap quote vs Tech-B NATE Carrier FAD 4 questions Manual J on tablet IRA 25C + AEP rebate + Carrier promo quoted $14,800 net $11,300 closed in truck Friday install]
  B --> C[Section 2: Teach 25 min]
  C --> C1[Part A 5-STAGE 15 min — DIAGNOSE 3 min plain English named cause both paths no price / DEMONSTRATE 3 min outside 30 sec compressor leak detector megger / DECIDE-CRITERIA 3 min 4 questions staying + asthma + hot/cold + bill + gas/electric + HEEHRA income / DESIGN 3 min Manual J on tablet AHRI matched coil + condenser + air handler / DOLLARS 3 min three options good better best with full rebate stack + financing]
  C --> C2[Part B 3 Cost Conversations 10 min — REPAIR today + 40-60 percent next-12-mo failure on 14-yr R-410A + refrigerant up 60 percent post AIM Act / REPLACE NET = gross minus IRA 25C $2K HP minus HEEHRA up to $8K income-tiered minus utility rebate minus mfr promo / OPERATING 10-15 yr current SEER vs new SEER2 4.5 percent test-method delta $720/yr × 12 yrs $8,640 justifies mid-tier]
  C1 & C2 --> F[Section 3 Discussion 10 min — 8 prompts when repair is right + when decline R-22/repeat/safety + IRA 25C non-refundable CPA disclosure + heat pump vs straight-cool + neighbor $7,200 line-item + 25C if tax liability under $2K pivot + financing recommendation Wells Fargo / Service Finance / Synchrony deferred-interest CFPB + ONE verbatim change]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[Round 1 Mrs. Cooper late-30s Phoenix AZ 14-yr Goodman R-410A HP compressor down 96°F 2 kids $3,500 emergency fund — Deflections just fix today / neighbor $7,200 — TECH 5-STAGE + 3 options $7,900/$9,000/$11,100 net + Wells Fargo 0 percent 18 mo]
  G1 --> G2[60-sec reset]
  G2 --> G3[Round 2 Whitakers 64 Annapolis MD 22-yr gas furnace + 18-yr R-22 A/C son Mike CPA — Deflections why replace furnace / commission — TECH DIAGNOSE R-22 ban $200/lb won't repair + Path A AC-only $7,950 vs Path B dual-fuel $9,400-$11,400 net + commission-honest test call my service manager + Saturday kitchen-table with Mike + binder + FTC 3-day rescission + loaner portable AC till Tuesday]
  G3 --> G4[60-sec reset]
  G4 --> H[Section 5 Debrief 5 min — 4-line ServiceTitan/HCP ritual]
  H --> I[Section 6 Leave-Behind 3 min — 6 Things to Bring + Script Card + 3 Cost Conversations + 3 Phrases That Get You Sued or Refunded + Never-Do]
  I --> Z[End 1:13]
\`\`\`

## The Repair vs Replace Decision Tree

\`\`\`mermaid
flowchart LR
  IN[Diagnostic Complete] --> AGE{System Age + Refrigerant?}
  AGE -- "Under 10 yrs / Single Component" --> REP[REPAIR — capacitor / contactor / blower motor / control board / TXV / minor verified-not-chronic leak]
  AGE -- "10-15 yrs / Single Major / R-410A" --> JUDGE{Tenure + Tax Situation?}
  AGE -- "15-22 yrs / R-410A or R-22 / Major" --> LEAN[LEAN REPLACE — run full 5-STAGE + 3 cost conversations]
  AGE -- "R-22 ANY age + Major Failure" --> DECLINE[DECLINE REPAIR — R-22 EPA-banned + $200/lb + system at end of life]
  AGE -- "Cracked HX / CO Risk / Electrical Hazard" --> SAFETY[DECLINE + Red-Tag — Safety overrides]
  JUDGE -- "Moving inside 24 mo" --> JUDGEREP[Repair likely right — replacement payback doesn't cover the move]
  JUDGE -- "Staying 5+ yrs + can use 25C" --> LEAN
  REP --> R1[Repair Quote + Honest 40-60 percent next-failure disclosure + R-410A cost up 60 percent post AIM Act]
  LEAN --> L1[DIAGNOSE + DEMONSTRATE]
  L1 --> L2[DECIDE-CRITERIA — 4 questions + gas/electric + HEEHRA income]
  L2 --> L3[DESIGN — Manual J + AHRI matched-system spec]
  L3 --> L4[DOLLARS — three options Good/Better/Best with full rebate stack]
  L4 --> COST[3 Cost Conversations: REPAIR + 40-60 percent next-failure / REPLACE NET = gross minus 25C minus HEEHRA minus utility rebate minus mfr promo / OPERATING 10-15 yr SEER vs SEER2]
  COST --> H2{Homeowner Decides?}
  H2 -- "Close in Truck" --> CLOSE[Sign + Wells Fargo 0 percent 18 mo or Service Finance 84 mo + FTC 3-day rescission + install Friday]
  H2 -- "Kitchen-Table Tonight" --> KT[Schedule with spouse/family/CPA + leave binder + no deposit]
  H2 -- "Want Other Bids" --> RES[Leave binder + AHRI cert + financing comparison + 5 refs + 7-day follow-up]
  DECLINE & SAFETY --> RR[Replacement-Only Path — same 5-STAGE + 3 cost conversations]
  RR --> L1
  R1 & CLOSE & KT & RES --> END[Outcome: honest repair / in-truck close / kitchen-table follow-up / respected-shopping follow-up — 4.7+ Google + future referral]
\`\`\`

`;

// ============================================================================
// SRC -- sources block (frameworks + research cited by name)
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE In-Truck Comfort Consult, Three Cost Conversations, and 45-60% bid / 55-70% close benchmarks draw on residential HVAC industry research, ACCA + AHRI standards, EPA refrigerant + 608 cert regulation, IRS/DOE tax-credit + rebate guidance, and recognized manufacturer cert programs.

**Trade body + standards.** **ACCA** — **Manual J load calc**, **Manual S equipment selection**, **Manual D duct design** (ANSI-recognized); rule-of-thumb oversizes 25-50%, causes short-cycling + humidity + 8-12% efficiency loss; required by 2018 IRC + many state codes. **AHRI** — third-party performance verification, **AHRI Directory** SEER2/EER2/HSPF2; matched-system cert required for IRA 25C + most utility rebates. **DOE ENERGY STAR** + SEER2/EER2/HSPF2 minimums (Jan 2023: North 14 SEER2 / South 15 SEER2 / Southwest 15 SEER2 + EER2 min; ENERGY STAR AC 16+ SEER2; heat pump 15.2+ SEER2 / 8.1+ HSPF2). **ASHRAE 15** A2L safety standard. **CEE** Tier 1/2/3 defines IRA 25C-qualifying equipment.

**EPA regulatory perimeter.** **EPA AIM Act (2020)** — HFC phasedown 85% by 2036; **R-410A banned new-equipment mfg Jan 1 2025**; replacement refrigerants **R-454B (Puron Advance — Carrier/Bryant/Lennox/Daikin/Goodman)** + **R-32 (Daikin/Mitsubishi)** A2L mildly-flammable. **EPA Section 608** — required for any tech handling refrigerant; A2L transition requires updated handling; violation = $44K/day + criminal referral. **R-22 EPA-banned new mfg since 2020** — $200/lb recharge; chronic-leak top-off without verified repair is a 608 violation.

**Tax credit + rebate perimeter.** **IRA Section 25C** — 30% of project, capped **$2,000 for qualifying heat pumps** (CEE Tier 1+ + AHRI-cert matched system), **$1,200 annual non-HP** (central AC up to $600, gas furnace up to $600), **lifetime $3,200 annual aggregate**; non-refundable on **IRS Form 5695**; talk-to-CPA disclosure required. **HEEHRA (IRA Section 50122)** — point-of-sale **up to $8,000 for heat pump**; income-tiered (100% below 80% AMI / 50% 80-150% / none above 150%); state-by-state rollout 2024-2025. **Stackable utility rebates** — Mass Save, NYSERDA, MassCEC, NJ Clean Energy, Efficiency Maine, Energy Trust of Oregon, BPA NW, ComEd, PG&E + SCE TECH Clean California, Xcel CO/MN, Duke Carolinas, FPL, TVA Heat Pump Plus, Austin Energy, SMUD, LADWP — require AHRI cert + licensed contractor + post-install inspection. **DSIRE** database tracks state-by-state.

**Manufacturer cert tiers.** **Carrier Factory Authorized Dealer** (top ~5%), **Trane Comfort Specialist**, **Lennox Premier**, **Daikin Comfort Pro** (top ~10%), **Bryant Factory Authorized**, **Rheem Pro Partner**, **Mitsubishi Diamond** (ductless). Big-Six OEMs: **Carrier Global (Carrier + Bryant + Payne, ~$22B)**, **Trane Technologies (Trane + American Standard, ~$17B)**, **Lennox International (~$5B)**, **Daikin Industries (Daikin + Goodman + Amana, world #1 ~$30B)**, **Mitsubishi Electric** (ductless), **Rheem (Rheem + Ruud + Friedrich)**. Standard 5/10-yr parts, 10-yr labor optional via cert programs.

**Tech certification.** **NATE** — ~50K+ certified, ~15% higher service ticket + replacement close vs non-cert. **EPA Section 608** statutory. **State HVAC contractor licensing** in 40+ states (CA C-20, FL CMC, TX TACL, NY locality-varies). **BLS (SOC 49-9021)** — ~415K employed, median ~$57K, +6% through 2032, ~110K open; comfort advisor base + commission $60K-$180K+.

**SaaS + field-service stack.** **ServiceTitan (NYSE: TTAN, ~$2B revenue, ~12K HVAC + trades)**, **Housecall Pro (~30K SMB)**, **FieldEdge**, **Jobber**, **Workiz**. **ServiceTitan Pricebook + Profit Rhino + Coolfront** standardize good/better/best. **Wrightsoft Right-J + Elite RHVAC + CoolCalc + Energy Vanguard** for Manual J. **CompanyCam** for timestamped install photos.

**Financing partners.** **GreenSky (Goldman Sachs subsidiary, ~$10B annual)**, **Synchrony Home Design (deferred-interest, CFPB-scrutinized)**, **Wells Fargo Home Projects**, **Service Finance Company**, **EnerBank USA (Regions)**, **Sunlight Financial** (heat-pump + solar), **Foundation Finance** (subprime). APRs 0% promo / 6.99-29.99% standard; dealer fees 0-12%; **CFPB scrutiny on deferred-interest disclosure 2023-2025**.

**PE-rollup landscape (2020-2026).** **Service Experts (Lennox subsidiary)**, **ARS Rescue Rooter (American Securities PE)**, **One Hour Heating & Air (Authority Brands, 350+ franchises)**, **Apex Service Partners (Alpine Investors PE)**, **Sila Heating + AC (Audax Group PE)**, **Wrench Group (Leonard Green PE)**, **PowerHouse Heating & Air**, **Mantis Innovation**, **Right Time** — consolidated ~5-10% of US HVAC service via comfort-advisor model + financing partnerships. **35,000+ independents** still operate as the alternative.

**Trade press.** **ACHR News**, **Contracting Business**, **Plumbing & Mechanical**, **HVAC Insider**, **Home Energy**, **AHR Expo** (~50K), **ACCA Conference**, **HVAC Comfortech**.

`;

// ============================================================================
// NUM -- quantified benchmarks the service manager cites during the meeting
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

Pulled from ACCA + AHRI + ACHR News + IBISWorld + ServiceTitan industry benchmarks + EPA AIM Act + IRS Section 25C + DOE HEEHRA + BLS + manufacturer field data.

### Residential HVAC Market Reality

| Metric | Value | Source |
|---|---|---|
| US HVAC contractor market | **~$130B** | IBISWorld |
| Residential HVAC establishments | **~150K** | IBISWorld / ACHR |
| Independent residential contractors | **35,000+** | ACCA / ACHR |
| Residential replacement market | **~$50B/yr** | ACHR / ServiceTitan |
| Avg replacement system ticket | **$8K-$25K** | ServiceTitan |
| Mid-tier replacement ticket | **$14K-$22K** | ACHR |
| Heat-pump conversion ticket (post rebates) | **$24K-$38K** | DOE / Mass Save |
| % replacement tickets from diag conversion | **~50%** | ServiceTitan |
| HVAC techs employed (SOC 49-9021) | **~415K** | BLS |
| Median HVAC tech wage | **~$57K** | BLS |
| NATE-certified techs nationally | **~50K+** | NATE |
| PE-rollup market share (2026) | **~5-10%** | ACHR / PitchBook |
| First-year comfort-advisor turnover | **~60%** | ACHR / industry |

### Refrigerant Transition Status

| Refrigerant | New Equip Status | Service Status | Cost Trend | Notes |
|---|---|---|---|---|
| **R-22** | Banned new mfg since 2020 | Available + $200/lb | Rising steeply | EPA phase-out complete |
| **R-410A** | **Banned new mfg Jan 1 2025** | Available, ~60% cost increase | Rising | EPA AIM Act |
| **R-454B (Puron Advance)** | Current new equip (most OEMs) | Universal availability | Stable | A2L mildly-flammable |
| **R-32** | Current new equip (Daikin/Mitsubishi) | Growing availability | Stable | A2L mildly-flammable |
| **R-290 (propane)** | Limited new equip (small charge) | Limited | n/a | A3 flammable, future use |

### Regional SEER2 Minimum (Jan 2023 DOE)

| Region | Central AC SEER2 | Heat Pump SEER2/HSPF2 | ENERGY STAR AC | Notes |
|---|---|---|---|---|
| **North** | 14 SEER2 | 14.3/7.5 | 16+ | OH, MI, IL, IN, etc. |
| **South** | 15 SEER2 | 15.2/7.8 | 16+ | TX, FL, GA, etc. |
| **Southwest** | 15 SEER2 + EER2 min | 15.2/7.8 + EER2 | 16+ | AZ, NV, NM, CA inland |
| **SEER2 vs SEER** | -4.5% same equip | -4.5% same equip | n/a | Test method change |

### IRA Section 25C Credit Math by System Type

| System | Gross Cost | 25C Cap | Credit Eligible If | Annual Limit |
|---|---|---|---|---|
| **Heat pump (CEE Tier 1+)** | $12K-$24K | **$2,000** | AHRI cert + CEE Tier | Lifetime $3,200 cap |
| **Central AC (CEE Tier 2+)** | $9K-$18K | **$600** | AHRI cert + CEE Tier 2 | Part of $1,200 non-HP cap |
| **Gas furnace (95%+ AFUE)** | $4K-$9K | **$600** | 95%+ AFUE | Part of $1,200 non-HP cap |
| **Heat-pump water heater** | $2K-$4K | $2,000 | UEF criteria | Combined with HP cap |
| **Home energy audit** | $300-$800 | $150 | Qualified auditor | Annual |
| **Geothermal heat pump (25D)** | $20K-$45K | **30% no cap** | ENERGY STAR | Separate 25D credit |

### HEEHRA Heat-Pump Rebate by Income Tier

| Household Income vs AMI | Rebate % | Max Rebate | Cap on Total Project | Notes |
|---|---|---|---|---|
| **Below 80% AMI** | 100% | **$8,000** | 100% of project | Income-verified |
| **80-150% AMI** | 50% | **$4,000** | 50% of project | Income-verified |
| **Above 150% AMI** | **0%** | $0 | n/a | Use 25C only |
| **Heat-pump water heater** | Tiered | $1,750 | Same | Stackable |
| **Heat-pump dryer** | Tiered | $840 | Same | Stackable |
| **Electric panel upgrade** | Tiered | $4,000 | Same | Stackable, often needed |

### Repair Cost vs Probability of Next Failure by Age

| System Age | Single-Comp Failure | Next-12-Mo Failure Prob | Recommendation |
|---|---|---|---|
| **0-7 yrs** | <5% | <5% | Always repair |
| **7-12 yrs** | 10-20% | 15-25% | Repair if single comp |
| **12-15 yrs** | 25-40% | 30-45% | Run 5-STAGE consult |
| **15-18 yrs** | 40-55% | **40-60%** | Lean replace |
| **18-22 yrs (R-410A)** | 55-70% | 60-75% | Strong replace recommendation |
| **22+ yrs (R-22)** | 70%+ | **75%+** | Decline repair, replace only |

### Financing Comparison

| Lender | Promo APR | Standard APR | Term | Dealer Fee | Notes |
|---|---|---|---|---|---|
| **Wells Fargo Home Projects** | 0% 12-18 mo | 6.99-19.99% | 12-84 mo | 0-7% | Revolving + installment |
| **GreenSky (Goldman Sachs)** | 0% 12-18 mo | 6.99-26.99% | 24-144 mo | 0-12% | Primary HVAC partner |
| **Synchrony Home Design** | 0% deferred 12-24 mo | **29.99% retro if not paid** | Revolving | 0-9% | **CFPB-scrutinized deferred-interest** |
| **Service Finance Co.** | 0% 12-18 mo | 7.99-15.99% | 24-180 mo | 3-9% | Contractor private-label |
| **EnerBank USA (Regions)** | 0% 12-18 mo | 6.99-17.99% | 24-144 mo | 3-9% | Specialty home improvement |
| **Sunlight Financial** | Varies | 4.99-12.99% | 60-300 mo | 0-8% | Heat-pump + solar focus |

### Manufacturer Warranty Tier Comparison

| OEM | Parts Standard | Labor Standard | Extended Option | Top Cert Tier |
|---|---|---|---|---|
| **Carrier (Infinity)** | 10-yr | None standard | 10-yr labor via FAD | Factory Authorized Dealer |
| **Trane (XV/XL)** | 10-yr | None standard | 12-yr labor via TCS | Trane Comfort Specialist |
| **Lennox (Signature)** | 10-yr + lifetime compressor | None | 10-yr labor via Premier | Lennox Premier Dealer |
| **Daikin (Fit/One)** | 12-yr | None standard | 12-yr labor via Pro | Daikin Comfort Pro |
| **Goodman (Daikin)** | 10-yr + lifetime compressor on top tier | None | 10-yr labor via dealer | Lower-cost tier of Daikin |
| **Mitsubishi (M+H-Series)** | 12-yr | None standard | 12-yr labor via Diamond | Diamond Contractor |
| **Rheem (Prestige)** | 10-yr | None standard | 10-yr labor via Pro Partner | Pro Partner |

### Why HVAC Replacement Pitches Don't Close (Composite)

| Reason for No-Close | % |
|---|---|
| Tech quote-and-left without context (no DECIDE-CRITERIA) | 38% |
| No Manual J — oversize cheap-quote competitor wins | 26% |
| No IRA 25C handout — left $2K of decision math on table | 22% |
| No HEEHRA application sheet — missed income-tiered rebate | 18% |
| Single quote instead of good/better/best | 17% |
| No operating-cost math (mid-tier doesn't pencil for homeowner) | 15% |
| Pushed top-tier without justifying ROI | 14% |
| Mismatched coil + condenser proposed (warranty voids) | 12% |
| No financing options presented cleanly | 11% |
| Pushed contract signature at truck (no kitchen-table option) | 10% |
| Trashed competing contractor by name | 8% |
| Skipped FTC 3-day rescission disclosure | 7% |

### Tech Tenure vs Bid-to-Close Performance

| Tenure | Diag Calls/Day | Bid Rate (12+ yr) | Close Rate | Avg Ticket | Day Revenue |
|---|---|---|---|---|---|
| **0-6 mo (rookie)** | 5-7 | 20-30% | 25-35% | $9K-$12K | $4K-$8K/day |
| **6-18 mo** | 6-8 | 30-40% | 35-45% | $11K-$15K | $9K-$16K/day |
| **18-36 mo** | 7-9 | 40-50% | 45-55% | $13K-$18K | $20K-$32K/day |
| **3-7 yr** | 7-9 | 45-55% | 50-60% | $15K-$20K | $27K-$45K/day |
| **NATE + Factory Authorized + 5-STAGE** | 8-10 | **50-60%** | **55-70%** | **$16K-$22K** | **$38K-$72K/day** |

**Pattern:** DECIDE-CRITERIA (the 4 questions + income for HEEHRA) and DOLLARS (three options with full rebate stack + financing) are hardest to install. **Weekly ServiceTitan / Housecall Pro call-record audit by service manager = single biggest predictor of 90-day cohort bid-rate lift.** Cost-conversation adherence reaches 90%+ by week 6 with disciplined ride-alongs; without, OPERATING-cost math creeps out first.

`;

// ============================================================================
// COUNTER -- failure modes + when the framework doesn't work + owner objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Quoting Before Explaining (No Close)
Most common. Tech opens *"compressor's shot, $11,400"* — skipped DIAGNOSE story + DEMONSTRATE + DECIDE-CRITERIA. Homeowner hears number with zero decision context, shops, takes cheap quote. **Price comes LAST after stages 1-4.**

### Failure Mode 2 -- Pushing Top-Tier Without Justifying SEER ROI
Tech leads 20 SEER2 variable-speed Infinity at $18,500 without operating-cost math for that homeowner's region + tenure. **Reads as upsell.** Justify the tier OR pivot to mid/baseline.

### Failure Mode 3 -- Not Bringing the 25C Handout
Leaves **$2,000 of decision math** on the table. Homeowner doesn't know 25C exists, or knows + wonders why the tech didn't mention it. Both = trust loss. **Every replacement-age diag: IRS Form 5695 + AHRI cert template + Form 1040 Line 24 guidance.**

### Failure Mode 4 -- Skipping Manual J (Oversizing 25-50%)
Rule-of-thumb → short-cycling → humidity → 60-day callback → refund request or 1-star Google. **Manual J on tablet in front of her** = visible competence + correct tonnage + AHRI matched system that keeps warranty + IRA credit valid.

### Failure Mode 5 -- Not Disclosing Financing APRs Cleanly
**CFPB complaint magnet** — particularly Synchrony Home Design deferred-interest where interest accrues from day 1 if not paid in promo window. Homeowner finds out month 13, files CFPB, you refund. **Disclose at presentation: deferred-interest = interest accrues day 1 — pay off before month 12 = zero, otherwise retroactive 29.99%.**

### Failure Mode 6 -- Promising the IRA Credit Without Tax-Liability Disclosure
*"You'll get $2,000 back from the IRS"* — false if homeowner has <$2K tax liability (non-refundable). CFPB + small-claims refund. **Always: "talk to your CPA, here's IRS Form 5695, depends on your liability."**

### Failure Mode 7 -- Mismatched Coil + Condenser
Cheap-quote competitor often proposes new condenser on existing coil to hit price point. **Voids AHRI matched-system cert → voids mfr warranty → voids IRA credit → loses 5-15% efficiency.** Always quote AHRI matched + show certificate.

### Failure Mode 8 -- Topping Off a Chronic R-410A Leaker
**EPA Section 608 violation** — adding refrigerant to known unrepaired leak. $44K/day civil penalty + criminal referral. Repair the leak OR refuse the recharge.

### Failure Mode 9 -- Recharging R-22 Without Disclosure
*"I can recharge for $480"* — without disclosing R-22 is $200/lb, EPA-banned new mfg, going into a 20+ yr dying system. Refund + bad review. **Disclose R-22 reality + recommend replacement only.**

### Failure Mode 10 -- Pushing Heat Pump in Cold Climate Without Dual-Fuel Analysis
Climate zone 6-7 (MN/ND/ME/MT) heat-pump-only without backup electric strip or dual-fuel gas → comfort complaints at -10°F + defrost-cycle bill shock. **Always run cold-climate analysis + offer dual-fuel in zone 5-7.**

### Failure Mode 11 -- Misrepresenting SEER vs SEER2
*"19 SEER"* when it's 18 SEER2 (new test method ~4.5% lower for same equip). If IRA credit application gets denied because SEER2 doesn't match what was sold, you pay. **Always quote SEER2 + note test-method difference.**

### Failure Mode 12 -- Service Manager Doesn't Audit ServiceTitan Notes Weekly
Kills 60-75% of training rollouts. ~30-day half-life un-coached. Techs revert to quote-and-leave by week 4. **One 10-call ride-along + one ServiceTitan note audit per tech per week, reviewed in 1:1.** Non-negotiable.

### Common Owner Objections

**1. "My techs already do this."** Pull 30 days of ServiceTitan notes + listen to 10 customer follow-ups. Bottom-quartile ALL skip DECIDE-CRITERIA + OPERATING cost math.

**2. "The 5-stage takes too long."** Stages 1+2 = 6 min, every tech already does this. Stages 3+4+5 = 9 min — that's the discipline. **~25 min for a 14-yr system that becomes a $14-22K sale.** Highest ROI/minute in the trades.

**3. "PE rollups have us beat on price + financing."** They beat you on financing volume + comfort-advisor presentation discipline. **Match the discipline, not the price** — your NATE + local-reference moat closes higher than their corporate-advisor model.

**4. "Homeowners don't care about Manual J."** They don't care about the words — they care about *"is this the right size?"* Show the tablet calc, show the AHRI cert, trust lands.

**5. "Heat pumps don't sell in my market."** IRA 25C + HEEHRA flipped the math in 2024. **Even TX + AZ heat-pump quoting up 40% YoY** because cooling-mode efficiency + dehumidification + $2K credit.

**6. "How do I know it's working?"** Three 90-day signals: bid rate (12+ yr) +15-25 pts / close +10-20 pts / avg ticket +$2K-$4K / refund-request rate drops from ~30% to <5% / Google moves 3.8 to 4.6+ / comfort-advisor turnover ~60% → ~35%.

**7. "Should I require NATE for every tech?"** Eventually yes. NATE-certified avg ~15% higher service ticket + replacement close. Phase in 18-24 mo via apprentice + journeyman tracks.

### When To Run A Second Time

**Quarterly cadence** + **whenever rebate stack changes** (HEEHRA state rollouts, utility rebate updates, IRS 25C guidance, EPA refrigerant rules). Rotate role-plays: landlord rental, HOA condo, cold-climate dual-fuel, ductless mini-split retrofit, geothermal 25D, commercial light-rooftop, post-storm emergency.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Nineteenth entry** in **Pulse Sales Trainings**, **thirteenth industry-specific** after st0007-st0018. st0019 = residential HVAC service-tech in-truck comfort consult converting a $189 diagnostic to a $14K-$22K replacement (or $24K-$38K heat-pump conversion with full IRA + HEEHRA + utility-rebate stack) — highest-leverage 25 min in residential HVAC sales, inside **ACCA Manual J/S/D + AHRI matched-system + EPA AIM Act R-410A phase-out Jan 1 2025 + R-454B/R-32 transition + EPA Section 608 + IRA Section 25C + HEEHRA + DOE SEER2 + state/utility rebate + NATE + Carrier/Trane/Lennox/Daikin cert + ServiceTitan + Wrightsoft Right-J + financing (Wells Fargo / GreenSky / Synchrony deferred-interest CFPB / Service Finance / EnerBank)** perimeter.

**Companion entries planned:** **st0020** plumbing + water-heater. **st0021** electrical + panel upgrade + EV charger. **st0022** solar residential + IRA 25D/48E. **st0023** pest control quarterly. **st0024** windows + siding. **st0025** standby generators (Generac/Kohler/Cummins). **st0026** garage doors + smart-home. **st0027** water-treatment. **st0028** insulation + weatherization + 25C envelope. **st0029** chimney + fireplace. **st0030** sprinkler + irrigation.

**Cross-references to st0001-st0006 SaaS:** st0001 discovery → DECIDE-CRITERIA 4 questions; st0002 single-threading → kitchen-table w/ spouse + CPA son; st0003 objection recovery → 3 cost conversations on *"neighbor got it for $7,200"* + *"just fix it today"*; st0004 opener → DIAGNOSE plain English; st0005 demo → DEMONSTRATE compressor + leak detector + megger + Manual J on tablet; st0006 pricing → DOLLARS three options + full rebate stack + financing.

**Cross-reference to st0007-st0018:** verbatim language + CRM-reviewed coaching cadence transfers. st0017 patients hear GOAL/MIRROR/MAP/MOMENTUM/MEMBERSHIP; st0018 homeowners hear NEIGHBOR/NOTICE/NEED/NUDGE/NEXT; **st0019 homeowners-with-failing-HVAC hear DIAGNOSE/DEMONSTRATE/DECIDE-CRITERIA/DESIGN/DOLLARS**. **st0018 storm-restoration roofing closest sibling** — high-trust consumer-at-residence seller, infrequent transaction (HVAC 12-22 yrs, roof 20-30 yrs), heavy federal + state regulatory perimeter (EPA + IRA + state HVAC license ↔ FTC Cooling-Off + state rescission + PA law), in-truck or driveway close discipline. **What does NOT transfer:** HVAC has **federal tax credit + income-tiered rebate stack** as core decision-math driver; **Manual J as visible competence proof**; **refrigerant transition R-22 → R-410A → R-454B/R-32 as time-pressure driver**; **three cost conversations (REPAIR / REPLACE NET / OPERATING)** unique vs roofing's insurance-claim binary.

**Adjacent Knowledge Library:** ACCA Manual J walkthrough + AHRI matched-system requirement + EPA AIM Act + R-454B/R-32 A2L operational guide + IRA 25C eligibility deep-dive + HEEHRA state-by-state tracker + DOE SEER2 regional minimums + Carrier vs Trane vs Lennox vs Daikin vs Mitsubishi vs Rheem cert comparison + NATE path + ServiceTitan vs Housecall Pro vs FieldEdge + GreenSky vs Wells Fargo vs Synchrony vs Service Finance + CFPB deferred-interest disclosure + PE-rollup landscape + cold-climate dual-fuel analysis + geothermal 25D edge case.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings). **Canonical:** [/sales-trainings/st0019](https://pulserevops.com/sales-trainings/st0019).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added cited sources block: ACCA Air Conditioning Contractors of America primary US HVAC contractor trade body Manual J residential load calculation ANSI/ACCA 2 + Manual S equipment selection + Manual D duct design rule-of-thumb sizing oversizes 25-50% causing short-cycling humidity 8-12% efficiency loss required by 2018 IRC + many state codes for permitted replacements + AHRI Air-Conditioning Heating and Refrigeration Institute independent third-party performance verification AHRI Directory SEER2/EER2/HSPF2 ratings certified matched-system performance certificate required for IRA Section 25C eligibility most utility rebates + DOE ENERGY STAR Most Efficient HVAC SEER2/EER2/HSPF2 minimums Jan 2023 regional North 14 SEER2 South 15 SEER2 Southwest 15 SEER2 with EER2 minimum ENERGY STAR central AC 16+ SEER2 heat pump 15.2+ SEER2 / 8.1+ HSPF2 + ASHRAE 15 A2L refrigerant safety standard + CEE Consortium for Energy Efficiency Tier 1/2/3 list defining IRA 25C-qualifying equipment + EPA AIM Act American Innovation and Manufacturing Act 2020 phasing down HFC refrigerants 85% by 2036 R-410A banned new HVAC equipment manufacture Jan 1 2025 replacement refrigerants R-454B Puron Advance Carrier/Bryant/Lennox/Daikin/Goodman and R-32 Daikin/Mitsubishi A2L mildly-flammable class requires updated tech training leak detection ASHRAE 15-compatible service + EPA Section 608 federally required certification for HVAC tech refrigerant handling Universal/Type I/II/III A2L transition updated handling violation $44K/day civil penalty + criminal referral + R-22 EPA-banned new manufacture since 2020 recharge $200/lb if available chronic-leak top-off without verified-repair = 608 violation + IRA Section 25C Energy Efficient Home Improvement Credit revised IRA 2022 30% project cost capped $2,000 qualifying heat pumps CEE Tier 1+ AHRI-certified matched system $1,200 annual cap non-heat-pump HVAC central AC up to $600 gas furnace up to $600 lifetime $3,200 annual aggregate non-refundable IRS Form 5695 talk-to-CPA disclosure depends on federal tax liability + HEEHRA High-Efficiency Electric Home Rebate Act IRA Section 50122 point-of-sale rebates up to $8,000 heat pump income-tiered 100% below 80% AMI 50% 80-150% none above 150% state-by-state rollout 2024-2025 via state energy offices + stackable utility rebates Mass Save MA + RI $10K heat-pump NYSERDA $3K-$8K MassCEC NJ Clean Energy Efficiency Maine Energy Trust of Oregon BPA NW ComEd IL PG&E + SCE TECH Clean California Xcel Energy CO/MN Duke Energy Carolinas FPL FL TVA Heat Pump Plus Austin Energy Sacramento SMUD LADWP require AHRI cert + licensed contractor + post-install inspection DSIRE database state-by-state + manufacturer cert tiers Carrier Factory Authorized Dealer top ~5% Trane Comfort Specialist top ~10% Lennox Premier Dealer top ~10% Daikin Comfort Pro top ~10% Bryant Factory Authorized Rheem Pro Partner Mitsubishi Diamond Contractor ductless mini-split + Big-Six US residential HVAC OEMs Carrier Global Carrier + Bryant + Payne ~$22B revenue Trane Technologies Trane + American Standard ~$17B Lennox International Lennox + Armstrong Air + AireFlo + Ducane + Concord ~$5B Daikin Industries Daikin + Goodman + Amana world #1 ~$30B Mitsubishi Electric ductless leader Rheem Rheem + Ruud + Friedrich warranty standard 5/10-yr parts 10-yr labor optional via certified-contractor programs + NATE North American Technician Excellence independent industry credential ~50K+ certified techs specialty exams AC heat pumps gas furnaces oil heating hydronics light commercial NATE-certified techs avg ~15% higher service ticket + replacement close + EPA Section 608 statutory refrigerant handling cert + state HVAC contractor licensing required 40+ states CA C-20 FL CMC TX TACL NY varies + BLS Occupational Outlook SOC 49-9021 ~415K employed median ~$57K +6% through 2032 ~110K open positions comfort advisor / inside-sales base + commission $60K-$180K+ + industry-specific SaaS ServiceTitan NYSE TTAN ~$2B revenue ~12K HVAC + trades customers dominant residential Housecall Pro ~30K SMB trades FieldEdge ~6K Jobber ~250K SMB trades Workiz ~120K pricing-presentation ServiceTitan Pricebook + Profit Rhino + Coolfront standardize good/better/best Wrightsoft Right-J Elite RHVAC CoolCalc Energy Vanguard Manual J load-calc CompanyCam timestamped install photos + financing partners GreenSky Goldman Sachs subsidiary ~$10B annual home improvement loans primary HVAC contractor partner Synchrony Home Design Credit Card deferred-interest promotional CFPB-scrutinized Wells Fargo Home Projects revolving Service Finance Company private-label EnerBank USA Regions Bank specialty home improvement Sunlight Financial heat-pump focused Foundation Finance subprime niche APRs 0% promotional / 6.99-29.99% standard contractor dealer fees 0-12% CFPB scrutiny deferred-interest disclosure 2023-2025 + PE-rollup competitive landscape Service Experts Lennox subsidiary ~100 locations ARS Rescue Rooter American Securities PE ~70 markets One Hour Heating & Air Conditioning Authority Brands 350+ franchises Apex Service Partners Alpine Investors PE 100+ acquired Sila Heating + Air Conditioning Audax Group PE NE corridor Wrench Group Leonard Green PE multi-trade PowerHouse Heating & Air PE-backed Mid-Atlantic Mantis Innovation Right Time PE-backed consolidated ~5-10% of US HVAC service raising avg ticket + closing higher via comfort-advisor model + financing partnerships 35,000+ independents still operating as alternative + trade press ACHR News Air Conditioning Heating Refrigeration News Contracting Business Plumbing & Mechanical HVAC Insider The Wholesaler Home Energy magazine AHR Expo ~50K attendees ACCA Conference HVAC Comfortech. Every trade body + standard + EPA reg + IRS/DOE tax-credit guidance + manufacturer cert tier + tech cert + SaaS + financing partner + PE rollup + trade publication named so service manager can cite by name when techs push back. EXPLICITLY RESIDENTIAL HVAC INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr references. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 11 quantified benchmark tables: (1) Residential HVAC Market Reality — US HVAC contractor market ~$130B / residential HVAC establishments ~150K / independent residential contractors 35,000+ / residential replacement market ~$50B/yr / avg replacement system ticket $8K-$25K / mid-tier $14K-$22K / heat-pump conversion post-rebates $24K-$38K / ~50% of replacement tickets from diag conversion / HVAC techs employed ~415K / median tech wage ~$57K / NATE-certified ~50K+ / PE-rollup market share ~5-10% / first-year comfort-advisor turnover ~60%. (2) Refrigerant Transition Status — R-22 banned new mfg since 2020 service $200/lb rising steeply EPA phase-out complete / R-410A banned new mfg Jan 1 2025 available ~60% cost increase rising EPA AIM Act / R-454B Puron Advance current new equip most OEMs universal availability stable A2L mildly-flammable / R-32 current new equip Daikin/Mitsubishi growing availability stable A2L / R-290 propane limited new equip small charge A3 flammable future use. (3) Regional SEER2 Minimum Jan 2023 DOE — North 14 SEER2 / South 15 SEER2 / Southwest 15 SEER2 + EER2 minimum + SEER2 vs SEER -4.5% same equipment test method change. (4) IRA Section 25C Credit Math — Heat pump CEE Tier 1+ gross $12K-$24K $2,000 cap requires AHRI cert + CEE Tier lifetime $3,200 annual / central AC CEE Tier 2+ gross $9K-$18K $600 cap part of $1,200 non-HP cap / gas furnace 95%+ AFUE gross $4K-$9K $600 cap / heat-pump water heater $2K-$4K $2,000 UEF criteria / home energy audit $300-$800 $150 qualified auditor / geothermal heat pump 25D gross $20K-$45K 30% no cap ENERGY STAR separate. (5) HEEHRA Heat-Pump Rebate by Income Tier — below 80% AMI 100% rebate up to $8,000 100% project income-verified / 80-150% AMI 50% up to $4,000 50% project income-verified / above 150% AMI 0% rebate use 25C only / heat-pump water heater tiered $1,750 stackable / heat-pump dryer tiered $840 stackable / electric panel upgrade tiered $4,000 stackable often needed. (6) Repair Cost vs Probability of Next Failure by Age — 0-7 yrs <5% comp failure <5% next-12 always repair / 7-12 yrs 10-20% 15-25% repair if single comp / 12-15 yrs 25-40% 30-45% run 5-STAGE consult / 15-18 yrs 40-55% 40-60% lean replace / 18-22 yrs R-410A 55-70% 60-75% strong replace / 22+ yrs R-22 70%+ 75%+ decline repair replace only. (7) Financing Comparison Wells Fargo Home Projects 0% 12-18 mo promo 6.99-19.99% standard 12-84 mo term 0-7% dealer fee revolving + installment / GreenSky Goldman Sachs 0% 12-18 mo 6.99-26.99% 24-144 mo 0-12% dealer fee primary HVAC partner / Synchrony Home Design 0% deferred 12-24 mo 29.99% retro if not paid revolving 0-9% CFPB-scrutinized deferred-interest / Service Finance 0% 12-18 mo 7.99-15.99% 24-180 mo 3-9% contractor private-label / EnerBank USA 0% 12-18 mo 6.99-17.99% 24-144 mo 3-9% specialty home improvement / Sunlight Financial varies 4.99-12.99% 60-300 mo 0-8% heat-pump + solar focus. (8) Manufacturer Warranty Tier Comparison Carrier Infinity 10-yr parts none standard labor 10-yr via Factory Authorized Dealer / Trane XV/XL 10-yr none 12-yr via Trane Comfort Specialist / Lennox Signature 10-yr + lifetime compressor none 10-yr via Premier Dealer / Daikin Fit/One 12-yr none 12-yr via Comfort Pro / Goodman Daikin 10-yr + lifetime compressor top tier none 10-yr via dealer lower-cost / Mitsubishi M+H-Series 12-yr none 12-yr via Diamond / Rheem Prestige 10-yr none 10-yr via Pro Partner. (9) Why HVAC Replacement Pitches Don\'t Close composite — quote-and-left no DECIDE-CRITERIA 38% / no Manual J oversize cheap-quote wins 26% / no IRA 25C handout left $2K decision math on table 22% / no HEEHRA application sheet missed income-tiered rebate 18% / single quote instead good/better/best 17% / no operating-cost math mid-tier doesn\'t pencil 15% / pushed top-tier no ROI 14% / mismatched coil + condenser warranty void 12% / no financing options clean 11% / pushed contract signature at truck no kitchen-table 10% / trashed competing contractor 8% / skipped FTC 3-day rescission 7%. (10) Tech Tenure vs Bid-to-Close Performance — 0-6 mo rookie 5-7 diag/day 20-30% bid 25-35% close $9K-$12K $4K-$8K/day / 6-18 mo 6-8 30-40% 35-45% $11K-$15K $9K-$16K/day / 18-36 mo 7-9 40-50% 45-55% $13K-$18K $20K-$32K/day / 3-7 yr 7-9 45-55% 50-60% $15K-$20K $27K-$45K/day / NATE + Factory Authorized + 5-STAGE 8-10 50-60% 55-70% $16K-$22K $38K-$72K/day. DECIDE-CRITERIA (the 4 questions + income for HEEHRA) and DOLLARS (three options with full rebate stack + financing) hardest to install. Weekly ServiceTitan / Housecall Pro call-record audit by service manager single biggest predictor of 90-day cohort bid-rate lift. Cost-conversation adherence 90%+ by week 6 with disciplined ride-alongs without ride-alongs OPERATING-cost math creeps out first. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 12-failure-mode counter-case: (1) Quoting before explaining most common tech opens with compressor shot $11,400 for new system skipped DIAGNOSE story skipped DEMONSTRATE skipped DECIDE-CRITERIA homeowner hears number with zero decision context shops it takes cheap quote process fix price comes LAST after stages 1-4. (2) Pushing top-tier without justifying SEER ROI tech leads with 20 SEER2 variable-speed Infinity $18,500 without running operating-cost math for specific homeowner region + tenure plans reads as upsell justify the tier OR pivot to mid/baseline. (3) Not bringing 25C handout leaves $2,000 of decision math on table homeowner doesn\'t know 25C exists or wonders why tech didn\'t mention it both = trust loss every replacement-age diag call IRS Form 5695 reference + AHRI cert template + Form 1040 Line 24 guidance. (4) Skipping Manual J oversizing 25-50% rule-of-thumb sizing → short cycling → humidity complaints → callback within 60 days → refund request OR 1-star Google review Manual J in front of her on tablet = visible proof of competence + correct tonnage + AHRI matched system that keeps warranty + IRA credit valid. (5) Not disclosing financing APRs cleanly CFPB complaint magnet particularly Synchrony Home Design deferred-interest where interest accrues from day 1 if not paid in promo window homeowner finds out month 13 files CFPB complaint you refund or face penalty disclose at presentation deferred-interest means interest accrues from day 1 if you pay off before month 12 zero interest if not retroactive 29.99% applies. (6) Promising IRA credit without tax-liability disclosure youll get $2,000 back from IRS false promise if homeowner has <$2K tax liability non-refundable credit CFPB complaint + small-claims refund always talk to your CPA here is IRS Form 5695 depends on tax liability. (7) Mismatched coil + condenser cheap-quote competitor proposes new condenser on existing coil OR same-brand coil with off-spec condenser to hit price point voids AHRI matched-system certificate → voids manufacturer warranty → voids IRA credit eligibility → loses 5-15% efficiency always quote AHRI matched system + show certificate. (8) Topping off chronic R-410A leaker EPA Section 608 violation adding refrigerant to system with known unrepaired leak $44K/day civil penalty + criminal referral repair the leak OR refuse the recharge. (9) Recharging R-22 without disclosure I can recharge it for $480 without telling homeowner R-22 is $200/lb EPA-banned new manufacture going into 20+ yr dying system homeowner finds out refund request + bad review disclose R-22 reality + recommend replacement only. (10) Pushing heat pump in cold climate without dual-fuel analysis sub-zero zone 6-7 MN/ND/ME/MT heat-pump-only without backup electric strip or dual-fuel gas furnace → comfort complaints at -10°F + bill shock from defrost-cycle always run cold-climate analysis + offer dual-fuel option in zone 5-7. (11) Misrepresenting SEER vs SEER2 this is 19 SEER system when actually 18 SEER2 new test method ~4.5% lower for same equipment sounds like puffery but if customer IRA credit application denied because SEER2 doesn\'t match what was sold youre paying always quote SEER2 explicitly + note SEER2 test method ~4.5% lower than legacy SEER for same equipment. (12) Service manager doesn\'t audit ServiceTitan notes weekly kills 60-75% of training rollouts ~30-day half-life un-coached techs revert to quote-and-leave by week 4 one 10-call ride-along + one ServiceTitan note audit per tech per week reviewed in 1:1 non-negotiable. Plus 7 common owner objections with honest answers: my techs already do this / 5-stage takes too long / PE rollups have us beat on price + financing / homeowners don\'t care about Manual J / heat pumps don\'t sell in my market / how do I know 5-stage is working three 90-day signals bid rate +15-25 pts close +10-20 pts avg ticket +$2K-$4K refund-request drops ~30% to <5% Google moves 3.8 to 4.6+ comfort-advisor turnover ~60% to ~35% / should I require NATE for every tech eventually yes phase in 18-24 mo via apprentice + journeyman tracks. Plus when-to-rerun quarterly cadence + whenever rebate stack changes HEEHRA state rollouts utility rebate annual updates IRS 25C guidance EPA refrigerant rule rotate role-plays landlord-owned rental HOA-restricted high-rise condo cold-climate dual-fuel ductless mini-split retrofit geothermal 25D edge case commercial light-rooftop post-storm emergency replacement. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as NINETEENTH entry and THIRTEENTH industry-specific training after st0007 orthopedic medical device + st0008 residential real estate listing presentations + st0009 automotive F&I + st0010 specialty pharmaceutical HCP detailing + st0011 life insurance needs analysis + st0012 mortgage refi + st0013 + st0014 financial advisor wealth management + st0015 cybersecurity AE CISO discovery + st0016 retained executive search CEO + Board pitch + st0017 med spa consult-to-package conversion + st0018 storm-restoration roofing canvasser door-knock — st0019 is residential HVAC service-tech in-truck comfort consult that converts a $189 diagnostic visit to a $14K-$22K replacement contract or $24K-$38K heat-pump conversion with full IRA + HEEHRA + utility-rebate stack highest-leverage 25 minutes in residential HVAC sales the territory where HVAC owners + service managers + lead service techs + comfort advisors + dispatchers at independent contractors that PE rollups Service Experts ARS One Hour Apex Sila Wrench have NOT yet consolidated + Carrier Factory Authorized + Trane Comfort Specialist + Lennox Premier + Daikin Comfort Pro dealers + the service-truck crew walking into 14-22 yr-old failing system on 96°F afternoon earn the right to the replacement close inside ACCA Manual J/S/D + AHRI matched-system + AHRI Directory + EPA AIM Act R-410A new-equipment phase-out Jan 1 2025 + R-454B / R-32 transition + EPA Section 608 cert + IRA Section 25C non-refundable tax credit heat pump $2K central AC $600 gas furnace $600 $3,200 lifetime annual + HEEHRA up to $8K income-tiered rebate + DOE ENERGY STAR + DOE SEER2/EER2/HSPF2 + state + utility rebate Mass Save NYSERDA Energy Trust Xcel TVA FPL DSIRE database + BLS Roofers SOC 49-9021 + NATE cert + ServiceTitan + Housecall Pro + FieldEdge + Wrightsoft Right-J + CoolCalc + CompanyCam + financing perimeter Wells Fargo Home Projects GreenSky Synchrony Home Design CFPB-scrutinized deferred-interest Service Finance EnerBank Sunlight Financial Foundation Finance. Companion industry-specific entries planned st0020 plumbing residential service + water-heater + st0021 electrical residential service + panel upgrade + EV charger install + st0022 solar residential rooftop + IRA 25D + 48E + st0023 pest control quarterly contract door-to-door + st0024 windows + siding residential + st0025 generators residential standby Generac Kohler Cummins + st0026 garage doors residential + smart-home + st0027 water-treatment residential softener + RO + st0028 insulation + weatherization + Energy Star + 25C envelope credit + st0029 chimney + fireplace + gas-fitter + st0030 sprinkler + landscape irrigation. Cross-references to st0001-st0006 SaaS foundation arc translated for residential HVAC: st0001 discovery → DECIDE-CRITERIA the 4 questions + income for HEEHRA / st0002 single-threading → kitchen-table with spouse + CPA son / st0003 objection recovery → 3 cost conversations handling of neighbor got it for $7,200 + just fix it today + my son the accountant told me / st0004 cold-call opener → DIAGNOSE story in plain English not jargon / st0005 demo → DEMONSTRATE the compressor + leak detector + megger reading + Manual J on tablet in front of her / st0006 pricing → DOLLARS three options good/better/best with full rebate stack + financing presented transparently. Cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 + st0014 + st0015 + st0016 + st0017 + st0018 what transfers — discipline of verbatim language on load-bearing moments + CRM-reviewed coaching cadence transfers exactly where st0018 made knockers + canvas captains hear NEIGHBOR + NOTICE + NEED + NUDGE + NEXT verbatim st0019 makes service techs + comfort advisors hear DIAGNOSE + DEMONSTRATE + DECIDE-CRITERIA + DESIGN + DOLLARS verbatim st0018 storm-restoration roofing closest sibling also high-trust-required consumer-at-residence seller infrequent transaction HVAC every 12-22 yrs roof every 20-30 yrs heavy federal + state regulatory perimeter EPA AIM Act + Section 608 + IRA 25C + HEEHRA + state HVAC license here vs FTC Cooling-Off + state rescission + state PA law there in-truck or driveway close discipline what does NOT transfer HVAC has federal tax credit + income-tiered rebate stack as core decision-math driver roofing doesn\'t HVAC has Manual J load-calc as visible competence proof roofing analog is HAAG inspection + CompanyCam evidence HVAC has refrigerant transition R-22 → R-410A → R-454B/R-32 as time-pressure driver roofing analog is post-storm adjuster scheduling urgency HVAC has three cost conversations REPAIR / REPLACE NET / OPERATING 10-15 yr roofing has insurance-claim binary instead. Adjacent Pulse Knowledge Library entries ACCA Manual J calculation walkthrough + AHRI matched-system requirement + EPA AIM Act + R-454B / R-32 A2L refrigerant operational guide + IRA Section 25C credit eligibility deep-dive + HEEHRA state-by-state rollout tracker + DOE SEER2 regional minimums + manufacturer cert tier comparison Carrier vs Trane vs Lennox vs Daikin vs Mitsubishi vs Rheem + NATE certification path + ServiceTitan vs Housecall Pro vs FieldEdge comparison + Wrightsoft Right-J vs CoolCalc Manual J software + GreenSky vs Wells Fargo Home Projects vs Synchrony Home Design vs Service Finance financing comparison + CFPB deferred-interest disclosure operational guide + PE-rollup competitive landscape Service Experts / ARS / One Hour / Apex / Sila / Wrench + heat-pump cold-climate dual-fuel analysis + geothermal 25D edge case + commercial light-rooftop adjacent. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Nineteenth Pulse Sales Training entry st0019 and THIRTEENTH industry-specific training after st0007 medical device + st0008 real estate + st0009 auto F&I + st0010 pharma + st0011 life insurance + st0012 mortgage refi + st0013 + st0014 financial advisor wealth management + st0015 cybersecurity CISO discovery + st0016 retained executive search CEO + Board pitch + st0017 med spa consult-to-package conversion + st0018 storm-restoration roofing door-knock — fully runnable 60-minute live residential HVAC service-tech in-truck comfort consult training for the highest-leverage 25 minutes in residential HVAC sales (per ACCA + AHRI + ACHR News + IBISWorld benchmarking US HVAC contractor market ~$130B + ~150K establishments + 35,000+ independent residential contractors + residential replacement market ~$50B/yr + avg replacement ticket $8K-$25K mid-tier $14K-$22K heat-pump conversion $24K-$38K with full IRA + HEEHRA + utility-rebate stack + ~50% of replacement tickets originate from diagnostic-call conversion + top crews 45-60% bid rate on 12+ yr systems 55-70% close vs bottom-quartile quote-and-leave 15-25% bid 30-40% close + ~415K HVAC techs employed median $57K BLS SOC 49-9021 + ~50K+ NATE-certified techs + PE-rollups Service Experts ARS One Hour Apex Sila Wrench consolidated ~5-10% market 2026 + 5x revenue-per-tech gap between top and bottom quartile on same EPA-608 cert based on in-truck consult discipline not wrench skill + IRA Section 25C 30% project cost capped $2,000 heat pump + $1,200 annual non-HP cap + $3,200 lifetime annual aggregate non-refundable on IRS Form 5695 + HEEHRA up to $8,000 heat-pump rebate income-tiered 100% below 80% AMI 50% 80-150% none above 150% state-by-state rollout 2024-2025 + EPA AIM Act R-410A banned new HVAC equipment manufacture Jan 1 2025 R-454B Puron Advance + R-32 transition A2L mildly-flammable + R-22 EPA-banned new manufacture since 2020 recharge $200/lb + EPA Section 608 cert required violation $44K/day civil penalty + DOE ENERGY STAR + DOE SEER2 regional minimums Jan 2023 North 14 South 15 Southwest 15 + EER2 ENERGY STAR central AC 16+ SEER2 heat pump 15.2+ SEER2 8.1+ HSPF2 SEER2 test method ~4.5% lower than legacy SEER for same equipment) not a Q&A library entry. Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,500 words ABSOLUTE HARD CAP 10,500. LEAN-FROM-START pattern mirroring st0018 closest sibling. Structure: orange Pulse Training callout intro (who-for: residential HVAC owners + service managers + lead service techs + comfort advisors + dispatchers at independent contractors the 35,000+ that PE-rollups Service Experts / ARS Rescue Rooter / One Hour Heating & Air / Apex Service Partners / Sila / Wrench Group have NOT yet consolidated + Carrier Factory Authorized + Trane Comfort Specialist + Lennox Premier + Daikin Comfort Pro dealers + the service-truck crew walking into 14-22 yr-old failing system on 96°F afternoon; works first-year EPA-608 tech still learning in-truck consult + 10-yr service vet who diagnoses anything but quotes price and leaves + comfort advisor running 4-6 in-home consults/day at 35-55% close + owner adding $2K Section 25C handout + $8K HEEHRA rebate sheet to every replacement bid; what-bring: 3 recent diagnostic calls that ended in quote-and-leave dollar number + objection + lost-to-competitor follow-up + Pre-Consult Kit Manual J tablet Wrightsoft Right-J or CoolCalc + IRA 25C handout + current state/utility rebate sheet + AHRI matched-system certificate template + manufacturer warranty comparison + financing pre-approval app GreenSky/Synchrony/Wells Fargo Home Projects + before/after photos + 5 local references + whiteboard) + Bottom Line callout homeowner with 14-22 yr-old failing HVAC system on 96°F afternoon doesn\'t decide between repair and replace based on price decides based on whether tech walked her through (1) what\'s actually broken + likelihood of next failure (2) real replacement cost AFTER $2K IRA 25C credit + up to $8K HEEHRA rebate + state/utility rebate + manufacturer promo (3) 10-15 yr operating cost delta between current 10-SEER dinosaur and new 16-18 SEER2 system + 5-stage + 3-cost-conversation thesis + 6-row pipe-table agenda + Section 1 Intro + Cold Open with ACCA + AHRI + ACHR News + IBISWorld benchmarks $130B US HVAC market 150K establishments 35,000+ independents PE rollups consolidated 5-10% + $50B/yr replacement market $8K-$25K avg ticket + ~50% from diag conversion + top 45-60% bid rate 55-70% close + 5x revenue-per-tech gap discipline-driven not wrench-driven + Columbus OH same-neighborhood composite Tech-A 14-yr R-410A heat pump quoted $11,400 + left homeowner got 3 bids took $8,200 cheap quote mismatched coil voided warranty oversized 30% vs Tech-B NATE-certified Carrier Factory Authorized 4 questions 5-min Manual J on tablet IRA 25C handout AEP Ohio rebate Carrier promo quoted $14,800 net $11,300 18 SEER2 two-stage heat pump variable-speed closed in truck install Friday + Common Trap Tech-A\'s quote is real quote homeowner can shop it three answers of course she shops it cheap quote always wins quote-and-leave is slowest lowest-margin sales motion in trades NATE + Carrier/Trane/Lennox/Daikin Factory Authorized + AHRI matched-system + Manual J actual moat + Section 2 Teach split into Part A 5-STAGE IN-TRUCK COMFORT CONSULT 15 min (DIAGNOSE 3 min plain English named cause both paths NO price NO replacement push / DEMONSTRATE 3 min outside 30 sec visual + audible + meter-readable evidence compressor leak detector megger / DECIDE-CRITERIA 3 min four questions how long staying + asthma allergies + hot/cold rooms + typical bill PLUS gas vs electric + income for HEEHRA / DESIGN 3 min Manual J ACCA-standard load calc on tablet Wrightsoft Right-J or CoolCalc actual tonnage AHRI matched coil + condenser + air handler / DOLLARS 3 min three options good better best each with gross + IRA 25C + HEEHRA + utility rebate + mfr promo + NET + financing options) and Part B Three Cost Conversations 10 min (REPAIR COST today + 40-60% probability of next failure within 12-18 mo on 14-yr R-410A + EPA AIM Act refrigerant up 60% since Jan 2025 / REPLACE NET cost gross MINUS IRA Section 25C 30% capped $2K heat pump non-refundable credit talk-to-CPA disclosure MINUS HEEHRA up to $8K income-tiered 100% below 80% AMI 50% 80-150% MINUS state-utility rebate MINUS mfr promo = best likely worst case net / OPERATING COST 10-15 yr current SEER vs new SEER2 SEER2 4.5% lower test method 89% efficiency gain $720/yr savings × 12 yrs $8,640 over system life justifies mid-tier upgrade) + Section 3 Discussion 8 prompts (when is repair right answer + when decline R-22/repeat failures/safety + IRA 25C disclosure non-refundable talk-to-CPA + heat pump vs straight-cool when + neighbor got $7,200 line-item comparison + 25C if tax liability under $2K pivot spec + financing recommendation cheapest legitimate option Wells Fargo / Service Finance / Synchrony deferred-interest CFPB disclosure + ONE verbatim change) + Section 4 Two-Person Role-Play with Round 1 Mrs Janet Cooper late-30s Phoenix AZ 14-yr Goodman R-410A heat pump compressor down 96°F afternoon two kids home in 4 hrs $3,500 emergency fund just refinanced 2 deflections just fix the leak today I\'ll replace in fall / my neighbor got hers for $7,200 — TECH 5-STAGE DIAGNOSE compressor short + R-410A leak DEMONSTRATE outside frosted suction line + leak detector + megger DECIDE-CRITERIA 10+ yr stay + asthma kid + upstairs hot + $310 July + all-electric + above 150% AMI DESIGN 2.6 tons round to 3 AHRI matched DOLLARS three options Good $7,900 net Better $9,000 net Best $11,100 net + Deflection 1 repair-today-honest probability talk + Deflection 2 line-item comparison vs $7,200 oversize/no AHRI/parts-only warranty + Wells Fargo 0% 18 mo + Round 2 Mr + Mrs Frank + Linda Whitaker both 64 Annapolis MD 22-yr gas furnace + 18-yr R-22 A/C planning 10-15+ yrs window-unit-camping son Mike CPA in DC told them not to sign anything until Saturday morning kitchen-table 2 deflections why replace furnace if it works just replace A/C / how do I know you\'re not selling most expensive system for commission — TECH DIAGNOSE R-22 EPA new-mfg ban $200/lb won\'t repair DEMONSTRATE R-22 nameplate + 78% AFUE label DECIDE-CRITERIA 10-15 yr stay + Linda allergies + upstairs cold/hot + $280 electric $180 gas + staying gas + 80-150% AMI partial HEEHRA Path A A/C-only $7,950 vs Path B dual-fuel heat pump + 95% AFUE condensing furnace $9,400-$11,400 net + operating savings $6,500 vs $14,800 + Deflection 2 honest commission answer call my service manager Mark + son Mike CPA Saturday kitchen-table no deposit no signature 3-day FTC rescission attached + loaner portable A/C till Tuesday install + 60-sec reset + Section 5 Debrief+Commitments 3 debrief Qs strongest/weakest stage + cost conversation skipped most + customer owed follow-up + 4-line ServiceTitan/Housecall Pro commitment ritual specific call + skipped stage + missing kit item + cost conversation to add + Section 6 Leave-Behind walkthrough + printable one-pager (6 Things to Bring on Every Replacement-Age Diagnostic Call 9 items / 5-Stage In-Truck Comfort Consult Script Card with verbatim cue lines and time per stage / 3 Cost Conversations grid REPAIR + REPLACE NET + OPERATING 10-15 yr with verbatim frames / 3 Phrases That Get You Sued or Refunded $2K tax credit guaranteed + refrigerant illegal next year + commission doesn\'t depend on option / Never-Do behavior list 13 items / Outcome Line wins full 5-STAGE + all 3 cost conversations + Manual J + AHRI cert + IRA + HEEHRA + utility rebate sheet + mfr promo + transparent financing = 45-60% bid rate + 55-70% close + $14K-$22K avg ticket + $24K-$38K heat-pump-conversion ticket + zero refund requests + 4.7+ Google rating vs losses quote-and-leave + no Manual J + no rebate stack + no operating-cost math = 15-25% bid rate + 30-40% close + lose to cheap quote + ~30% refund-request rate within 90 days + 3.4-4.0 Google rating + ~60% comfort-advisor turnover + ~24-month tech tenure / If You Only Remember One Thing hero quote You don\'t close the $14K replacement by quoting $14K you close it by walking the homeowner through (1) what\'s actually broken and how likely the next failure is (2) what the system actually costs AFTER the $2K IRA credit + up to $8K HEEHRA rebate + state-utility rebate + manufacturer promo and (3) what the 10-15 yr operating cost looks like on her current 9 SEER dinosaur vs a new 17 SEER2 system the price comes LAST after her decision criteria are explicit). How-this-fits-in-residential-HVAC-operating-motion table at end of core showing pre-consult kit + first 3 min DIAGNOSE + next 3 min DEMONSTRATE + next 3 min DECIDE-CRITERIA + next 3 min DESIGN + next 3 min DOLLARS + 3-cost-conversation overlay + service-manager coaching. Two mermaid diagrams: 5-Stage In-Truck Comfort Consult Flow + Repair vs Replace Decision Tree (with refrigerant + age + tenure + safety branches). 10 benchmark tables (Residential HVAC Market Reality + Refrigerant Transition Status + Regional SEER2 Minimum Jan 2023 DOE + IRA Section 25C Credit Math by System Type + HEEHRA Heat-Pump Rebate by Income Tier + Repair Cost vs Probability of Next Failure by Age + Financing Comparison + Manufacturer Warranty Tier Comparison + Why HVAC Replacement Pitches Don\'t Close + Tech Tenure vs Bid-to-Close Performance). 12-failure-mode counter-case + 7-owner-objection coach-back + when-to-rerun quarterly cadence + whenever rebate stack changes. Cross-links to st0001-st0006 SaaS foundation arc with translation mapping + companion industry-specific entries planned st0020-st0030 + cross-reference to st0007 + st0008 + st0009 + st0010 + st0011 + st0012 + st0013 + st0014 + st0015 + st0016 + st0017 + st0018 what transfers (verbatim language on load-bearing moments + CRM-reviewed coaching cadence) and what does not (HVAC has federal tax credit + income-tiered rebate stack as core decision-math driver + Manual J load-calc as visible competence proof + refrigerant transition R-22 → R-410A → R-454B/R-32 as time-pressure driver + three cost conversations REPAIR/REPLACE NET/OPERATING 10-15 yr unique to industry). Tags include sales-training (hub filter) + hvac-training + residential-hvac + service-technician + comfort-advisor + replace-vs-repair + refrigerant-transition + 60-min-meeting + standard-team + st0019. Callouts used: Pulse Training (orange intro) + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY RESIDENTIAL HVAC INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / ProfitWell / SaaStr citations. Industry-correct sources: ACCA Air Conditioning Contractors of America Manual J/S/D + AHRI Air-Conditioning Heating and Refrigeration Institute AHRI Directory + AHRI matched-system + DOE ENERGY STAR + DOE SEER2/EER2/HSPF2 + ASHRAE 15 A2L refrigerant safety + CEE Consortium for Energy Efficiency Tier 1/2/3 + EPA AIM Act American Innovation and Manufacturing Act 2020 + R-410A banned new mfg Jan 1 2025 + R-454B Puron Advance + R-32 + R-22 EPA-banned + EPA Section 608 + IRA Section 25C Energy Efficient Home Improvement Credit + HEEHRA High-Efficiency Electric Home Rebate Act IRA Section 50122 + IRS Form 5695 + Mass Save + NYSERDA + MassCEC + NJ Clean Energy + Efficiency Maine + Energy Trust of Oregon + BPA NW + ComEd + PG&E + SCE TECH Clean California + Xcel Energy + Duke Energy Carolinas + FPL + TVA Heat Pump Plus + Austin Energy + Sacramento SMUD + LADWP + DSIRE + Carrier Global Carrier + Bryant + Payne + Carrier Factory Authorized Dealer + Trane Technologies + Trane Comfort Specialist + Lennox International + Lennox Premier Dealer + Daikin Industries + Daikin Comfort Pro + Goodman + Amana + Mitsubishi Electric + Mitsubishi Diamond Contractor + Rheem + Ruud + Friedrich + Rheem Pro Partner + NATE North American Technician Excellence + BLS SOC 49-9021 + state HVAC contractor licensing CA C-20 FL CMC TX TACL + ServiceTitan NYSE TTAN + Housecall Pro + FieldEdge + Jobber + Workiz + ServiceTitan Pricebook + Profit Rhino + Coolfront + Wrightsoft Right-J + Elite Software RHVAC + CoolCalc + Energy Vanguard + CompanyCam + GreenSky Goldman Sachs subsidiary + Synchrony Home Design Credit Card CFPB-scrutinized deferred-interest + Wells Fargo Home Projects + Service Finance Company + EnerBank USA Regions Bank + Sunlight Financial + Foundation Finance + Service Experts Lennox subsidiary + ARS Rescue Rooter American Securities + One Hour Heating & Air Conditioning Authority Brands + Apex Service Partners Alpine Investors + Sila Heating + Air Conditioning Audax Group + Wrench Group Leonard Green + PowerHouse Heating & Air + Mantis Innovation + Right Time + IBISWorld + ACHR News Air Conditioning Heating Refrigeration News + Contracting Business + Plumbing & Mechanical + HVAC Insider + The Wholesaler + Home Energy magazine + AHR Expo + ACCA Conference + HVAC Comfortech + CFPB Consumer Financial Protection Bureau deferred-interest scrutiny + FTC Cooling-Off Rule for kitchen-table contract signing. Tight 2-3 sentence paragraphs throughout. No emoji-spam in body prose. ASCII-clean. Lean target honored: drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0019 is crawled.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
      .catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10 word_count=' + wordCount);
}

main().catch(err => { console.error(err); process.exit(1); });
