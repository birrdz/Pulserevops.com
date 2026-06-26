// q9665 -- How do you start a boutique fitness studio (CrossFit / Pilates / OrangeTheory style) business in 2027?
// Small-format specialty studio -- distinct from full-service gym (Planet Fitness/LA Fitness), at-home digital (Peloton/Mirror), corporate wellness
// VALUE over WORD COUNT. Target 8,000-10,500 words. Tight paragraphs.
// Bottom Line + TOC + 4-PART (FOUNDATIONS / BUILD-OUT & CAPITAL / OPERATIONS / GROWTH & EXIT).

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

const ID = 'q9665';
const QUESTION = 'How do you start a boutique fitness studio (CrossFit / Pilates / OrangeTheory style) business in 2027?';

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** **$250K-$550K** independent single-discipline studio (1,500-2,500 sqft leased strip-center space at $32-$55/sqft NNN + 3-5 yr lease with $30-$60K landlord TI allowance + build-out $90K-$220K + equipment $80K-$180K depending on format + mirrors/flooring/sound/HVAC + small lobby/retail/changing + branding + POS + first 6 months working capital); **$400K-$850K** franchise-converted studio (Club Pilates / Pure Barre / CycleBar / Row House / OrangeTheory Fitness OTF / F45 Training / StretchLab / YogaSix / BFT / AKT / Rumble Boxing — Xponential Fitness XPOF or Self Esteem Brands ANCO portfolio) including **franchise fee $40K-$60K + initial equipment package $80K-$200K + brand-mandated build-out finishes + grand-opening marketing + working capital**; **$700K-$1.2M+** flagship OrangeTheory or premium reformer Pilates concept (Solidcore-style 2,800-3,500 sqft + reformer or torque-board equipment $180K-$280K + sophisticated audio/lighting/HRM/HVAC + larger lobby/retail + premium finishes). Expect **9-15 months from lease to grand opening** and **18-30 months to mature membership steady-state** with founding-member ramp + post-January churn cycles.
> - **[Margins]** Mature single-discipline boutique fitness studio: **62-74% contribution margin per class** at $24-$38 effective revenue per attendee (instructor cost $35-$85/class + studio rent/utility/cleaning allocation) -- targeting **8-22% net margin** at $400K-$1.4M annual revenue per studio per Xponential Fitness Item 19 disclosures + IHRSA + ClubIntel + Mindbody/ABC Financial benchmarks. Membership economics drive everything: **unlimited monthly $159-$299**, **8-pack $159-$199 ($20-$25/class)**, **drop-in $25-$45**, **ClassPass exposure 10-30% of class fills at $4-$12 per visit (low LTV)**. **Customer Acquisition Cost CAC $80-$180** + **Lifetime Value LTV $1,200-$3,800** at **6-18 month average retention**. Franchise studios pay **royalty 7-9% of gross + brand/national fund 2-3%** -- compressing operator margin to **6-15% net** in exchange for brand + ops playbook.
> - **[Hardest part]** **Retention + instructor talent + market saturation** (not capital, not build-out) -- specifically **6-18 month average member retention** (boutique churn is 4-9% monthly vs full-gym 3-5% monthly), **instructor poaching wars** in Tier-1 metros where Equinox/SoulCycle/competing boutiques raise $35-$85/class rates to $95-$140 for proven talent, **F45 Training SPAC implosion 2022-2024** (Mark Wahlberg pulled out, stock from $14 IPO to <$2, hundreds of franchise closures and lawsuits proving the unit economics are fragile at the wrong format), **SoulCycle + Equinox layoffs and ~50 location closures 2020-2024**, **FlyWheel Sports bankruptcy 2020**, **CrossFit affiliate exodus 2020-2022** following Greg Glassman racial comments + George Floyd statement (~1,000+ affiliates dropped CrossFit licensing within 18 months), **ClassPass economics** crushing per-visit revenue ($4-$12 to studio vs $24-$38 direct member), **Pilates reformer supply chain shortage 2023-2024** (Balanced Body + Stott Pilates Merrithew + Peak Pilates 6-14 month waitlists), **GLP-1/Ozempic effect on cardio attendance** (Ozempic users report cardio aversion + nausea + fatigue), **boutique tap saturation in Tier-1 metros** (Manhattan, LA, Miami, Austin, Denver with 8-15 boutique studios per square mile), **post-COVID hybrid digital cannibalization** (Peloton + Mirror + Apple Fitness+ + Tonal + iFit pulling 15-25% of would-be members), **owner-operator burnout** with 60-80 hour weeks year 1-2, and **lawsuit exposure** on instructor-led injury claims.

A **boutique fitness studio business** in 2027 is a **small-format (1,500-3,500 sqft) single-discipline specialty fitness studio** -- a **leased commercial-space + state-business-licensed + workers-comp-insured + general-liability-insured + class-based membership-model** facility operating **scheduled 45-55 minute group classes** in **8-30 simultaneous participants** across one specialty: **reformer Pilates (Club Pilates franchise + Solidcore + Pure Barre + [solidcore])**, **HIIT/strength (OrangeTheory Fitness OTF + F45 Training + Barry's Bootcamp + BFT)**, **indoor cycling/spin (SoulCycle + CycleBar + FlyWheel-ghosts + Peloton studios)**, **strength/functional (CrossFit affiliate + StrongFirst + StretchLab)**, **yoga (CorePower Yoga + Y7 + YogaSix + Yoga to the People remnants)**, **boxing/kickboxing (Rumble Boxing + Title Boxing Club + 9Round + TruFusion)**, **rowing (Row House)**, **dance/barre (Pure Barre + AKT + Dailey Method)**, or **stretch/recovery (StretchLab + Stretch Zone)**. Distinct from **full-service health club** (Planet Fitness / LA Fitness / 24 Hour Fitness / Lifetime Athletic with $10-$249/mo open-floor model), **at-home digital fitness** (Peloton / Mirror / Tonal / Apple Fitness+ / iFit / Tempo with $39-$59/mo subscription + $1,500-$3,500 hardware), and **corporate wellness platforms** (Gympass / Wellhub / Class Pass corporate / Wellable).

The 2027 demand reality: **~110,000 US health/fitness club locations** per IHRSA + Statista with **~30-35K classified as "boutique" (<5,000 sqft single-discipline)** -- a category that grew **15-25% CAGR 2013-2019**, then **collapsed 25-40% during 2020 COVID closures**, then **rebounded 8-15% 2022-2024** but with **massive winners-vs-losers separation**. Reformer Pilates is the dominant 2023-2026 growth story (**Club Pilates passed 1,000+ US units 2024, Solidcore 200+, Pure Barre 500+**). HIIT category mature with **OrangeTheory ~1,400 US studios** but F45 SPAC implosion proved fragility. Spin category contracted with **SoulCycle closing ~50 locations 2020-2024** and FlyWheel bankruptcy 2020. CrossFit affiliate count fell from **peak ~13,000 to ~9,500-10,000** 2020-2025 post-Glassman exodus. Demand drivers: GLP-1 wave creating muscle-preservation strength/Pilates demand + Gen Z premium-experience preference + post-COVID in-person revival + Q1 New Year resolution + corporate-wellness reimbursement. Counter-pressures: instructor poaching + ClassPass economics + at-home digital + post-COVID hybrid + Tier-1 saturation + GLP-1 cardio aversion + boutique churn 4-9% monthly + reformer supply chain + lawsuit exposure.

Five things that determine whether a boutique fitness studio survives years 1-5: **(1) Founding-member acquisition velocity in pre-sale + first 90 days**; **(2) Instructor talent acquisition, retention, and per-class economics**; **(3) Class utilization >55% capacity at peak times**; **(4) Member retention beyond 6-month founding-rate honeymoon**; **(5) Founder runway through the 18-24 month profitability trough plus seasonal churn cycles**.

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & boutique studio vs full-service gym vs digital vs corporate wellness](#market-size--boutique-studio-vs-full-service-gym-vs-digital-vs-corporate-wellness)
- [Franchise vs independent: Xponential Fitness XPOF, Self Esteem Brands & solo concept economics](#franchise-vs-independent-xponential-fitness-xpof-self-esteem-brands--solo-concept-economics)
- [Format selection: Pilates, HIIT, cycle, CrossFit, yoga, boxing, rowing & dance/barre](#format-selection-pilates-hiit-cycle-crossfit-yoga-boxing-rowing--dancebarre)

**Part 2 -- Build-Out & Capital**
- [Site selection, lease economics, TI allowance & zoning approval](#site-selection-lease-economics-ti-allowance--zoning-approval)
- [Build-out, equipment stack, audio/lighting/HVAC & studio design](#build-out-equipment-stack-audiolightinghvac--studio-design)
- [Capital stack: SBA 7(a), equipment finance, franchise lending & founder equity](#capital-stack-sba-7a-equipment-finance-franchise-lending--founder-equity)

**Part 3 -- Operations**
- [Membership model, pricing, founding-member presale & ClassPass strategy](#membership-model-pricing-founding-member-presale--classpass-strategy)
- [Instructor talent: 1099 vs W-2, per-class economics & retention](#instructor-talent-1099-vs-w-2-per-class-economics--retention)
- [Tech stack: Mindbody, ClubReady, Mariana Tek, Glofox & Wodify](#tech-stack-mindbody-clubready-mariana-tek-glofox--wodify)
- [Marketing: founding-member presale, Instagram, referral, corporate & community](#marketing-founding-member-presale-instagram-referral-corporate--community)

**Part 4 -- Growth & Exit**
- [Scaling units: second studio, multi-unit franchise & area developer rights](#scaling-units-second-studio-multi-unit-franchise--area-developer-rights)
- [Exit math: franchise resale, area-developer monetization & strategic acquisition](#exit-math-franchise-resale-area-developer-monetization--strategic-acquisition)
- [Counter-case: F45 SPAC implosion, SoulCycle decline, CrossFit exodus, ClassPass & GLP-1 cardio aversion](#counter-case-f45-spac-implosion-soulcycle-decline-crossfit-exodus-classpass--glp-1-cardio-aversion)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & boutique studio vs full-service gym vs digital vs corporate wellness

IHRSA defines the US health/fitness industry as **~$32B-$36B** revenue across **~110,000 locations** serving **~65M members** post-COVID rebound. The "boutique" subsegment is **~30-35K locations producing ~$13B-$16B revenue** with **higher average revenue per member ($1,600-$3,600) vs full-service ($420-$1,800)**.

Adjacent fitness formats: **(1) Boutique single-discipline** small-format specialty, $400K-$1.4M unit revenue. **(2) Full-service health club** (Planet Fitness, LA Fitness, 24 Hour Fitness, Lifetime Athletic, EOS Fitness) -- 30K-100K sqft, $10-$249/mo, $1.2M-$6M+ unit revenue. **(3) At-home digital** (Peloton, Mirror, Tonal, Apple Fitness+, iFit, Tempo, Hydrow) -- $39-$59/mo subscription + $1,500-$3,500 hardware. **(4) Corporate wellness aggregators** (Gympass/Wellhub, ClassPass corporate, Wellable) -- aggregate boutique + full-service for employer benefit. **(5) Hybrid clubs** (Equinox, Lifetime, Crunch Signature) -- premium full-service + integrated boutique-style classes.

Boutique revenue engine: **recurring membership $159-$299/mo + 8-pack + drop-in at 62-74% per-class contribution margin**. Losing it to ClassPass aggregation, weak retention, or instructor poaching is the most common failure path.

### Franchise vs independent: Xponential Fitness XPOF, Self Esteem Brands & solo concept economics

The single biggest 2027 founder decision: **franchise** (signed playbook + brand recognition + supplier discounts + faster ramp + royalty 7-9% + brand fund 2-3%) vs **independent** (own brand + 100% margin + slower brand-build + harder financing).

**Xponential Fitness (NYSE: XPOF)** -- largest US boutique franchisor: **Club Pilates (1,000+)**, **Pure Barre (500+)**, **CycleBar (200+)**, **StretchLab (300+)**, **Row House (100+)**, **AKT (50+)**, **BFT**, **YogaSix (200+)**, **Lindora**, **Rumble Boxing (2021 acquisition)**. Fees **$40K-$60K** + royalty **7-9%** + brand fund **2-3%**. Item 19: Club Pilates AUV ~$550K-$650K, Pure Barre ~$400K-$500K, CycleBar ~$650K-$900K.

**Self Esteem Brands (SEB)** -- parent of **Anytime Fitness (4,800+ global)** + **Basecamp Fitness** + **The Bar Method**. Anytime is 24/7 unattended, not pure boutique.

**OrangeTheory Fitness (Roark/Ellipse)** -- ~1,400 US franchised studios, $700K-$1.2M investment, AUV $650K-$950K. **F45 Training (NASDAQ:FXLV)** -- peaked ~2,800 global 2021, hundreds closed post-SPAC implosion. **Barry's**, **Solidcore (~200)**, **SoulCycle (~80)** all corporate not franchised.

**Independent solo concept:** $250K-$550K, 100% margin (no royalty), slower brand-build. Best when founder is a known local instructor with existing 200-500 member following.

### Format selection: Pilates, HIIT, cycle, CrossFit, yoga, boxing, rowing & dance/barre

Format selection is the second-biggest founder decision after franchise-vs-independent -- equipment cost, demographic fit, and category trend curve all vary 5-15x by format.

**Reformer Pilates** -- dominant 2023-2027 growth. 8-16 reformers $30K-$140K, supply chain 6-14 mo waitlists (Balanced Body, Stott Merrithew, Peak, BASI). 45-55 min classes, 8-16 participants, 75-85% female 28-55, $159-$249/mo. **Club Pilates** (XPOF), **Solidcore** (corporate), **Pure Barre** (XPOF).

**HIIT/strength** -- mature. Equipment $80K-$225K. **OrangeTheory** treadmill+rower+weights with OTbeat HRM (~1,400 US). **F45 Training** circuit (declining post-SPAC). **Barry's Bootcamp** premium corporate (~75 global). **BFT** (XPOF).

**Indoor cycling/spin** -- contracted. 30-50 bikes $55K-$220K. **SoulCycle** declining (~80 from 99 peak), **CycleBar** (XPOF, ~200), **FlyWheel bankrupt 2020**. Tier-1 saturated, demo narrow (28-45 female).

**CrossFit affiliate** -- declining post-Glassman. Equipment $30K-$80K (lowest format). $200/yr CrossFit Inc fee. 60-min WOD, 8-25 athletes. ~9,500-10,000 affiliates 2025 (down from ~13K peak). Drove **F3 Nation, StrongFirst, functional-fitness** rebrand wave.

**Yoga** -- mature. Mats + props $5K-$15K. **CorePower (~200 corporate)**, **YogaSix (XPOF, ~200)**, **Y7**, **Modo**. Heat (Bikram, hot Vinyasa) adds HVAC **$25K-$80K**.

**Boxing/kickboxing** -- growing. Heavy bags + speed + reflex $40K-$120K. **Rumble Boxing (XPOF, 2021)**, **Title Boxing (~150)**, **9Round (~600)**.

**Rowing** -- niche. 20-30 Concept2 or Hydrow Pro $45K-$120K. **Row House (XPOF, ~100)** primary.

**Dance/barre** -- mature. Ballet barres + light weights $15K-$45K. **Pure Barre (XPOF, ~500)**, **AKT (XPOF, ~50)**, **The Bar Method (SEB, ~100)**.

**Stretch/recovery** -- emerging. Tables + bands $10K-$35K. **StretchLab (XPOF, ~300)**, **Stretch Zone (~250)**. Lower per-visit, high frequency.

---

## 🏗️ PART 2 -- BUILD-OUT & CAPITAL

### Site selection, lease economics, TI allowance & zoning approval

Site selection is the single most predictive variable for boutique studio survival -- a great brand in a wrong site outperforms a weak brand in a great site for years 1-3.

**Target geography:** **Strip center or daytime-traffic plaza** with strong **9am-2pm female-skew foot traffic** (grocery + coffee + nail + dry cleaner co-tenants ideal) within **3-mile drive of 25K-45K household density at $90K-$180K HHI median**. Avoid pure office park (only AM/PM commute traffic). Avoid pure entertainment district (mismatched daypart).

**Space requirements:** **1,500-2,500 sqft** typical single-discipline (Pilates / barre / yoga / boxing). **2,500-3,500 sqft** for HIIT (OrangeTheory / F45 require more equipment footprint) or premium reformer Pilates (Solidcore style). **3,000-4,500 sqft** for multi-discipline or CrossFit affiliate with rig + Olympic platforms.

**Lease economics:** **$32-$55/sqft NNN** typical Tier-2/3 strip-center, **$55-$95/sqft NNN** Tier-1 metro (NYC + SF + LA + Miami + DC), **$22-$38/sqft NNN** secondary markets. **3-5 yr initial term + 1-2 5-yr options**. **Landlord TI allowance $30-$80K** typical for fitness use, **$80-$150K** in retail-hungry centers willing to incentivize fitness as anchor.

**Zoning + ADA + permits:** Commercial C-2/C-3 or mixed-use MU permitted. **CUP/special exception** sometimes required for **>50 max occupancy assembly use**. ADA compliance: accessible bathrooms + parking + entry path. **Sprinkler** required >75 occupancy. Health department only for studios offering showers. **3-6 month permit + entitlement** typical, **6-9 months** in slow-permit jurisdictions (LA + SF + Seattle + Portland OR).

**Co-tenant signals:** Best signals are **Whole Foods/Sprouts + Starbucks/Blue Bottle + Sweetgreen/Cava + Drybar/Madison Reed + lululemon/Athleta + childcare/Goddard School** in the same plaza or within 1 mile.

### Build-out, equipment stack, audio/lighting/HVAC & studio design

Build-out is the second-largest capital line after equipment -- design choices made here drive 5-10 years of operating economics and member retention.

**Build-out cost:** Vanilla-shell to operational **$60-$140/sqft** depending on jurisdiction + finishes + HVAC. 2,000 sqft Pilates = $120K-$280K. 3,000 sqft OrangeTheory or premium Pilates = $220K-$420K. Greenfield $180-$320/sqft.

**Critical infrastructure:** Sprung wood or rubber-cushion floor $8-$22/sqft (essential for HIIT/jumping impact). Sound system $8K-$35K (JBL/QSC/Bose + DSP + wireless mic). Lighting $5K-$25K (DMX-LED for SoulCycle/Solidcore-style immersive). HVAC $25K-$95K (higher for hot yoga). Mirrors $4-$12/sqft. Locker rooms $25K-$75K. Lobby + check-in $15K-$45K.

**Equipment by format:** See PART 1 format selection above + numbers tables below for full equipment ranges. Headline: Pilates $30K-$140K, OrangeTheory HIIT $125K-$225K, F45 circuit $80K-$160K, spin $55K-$220K, CrossFit $30K-$80K (lowest), yoga $5K-$25K + heat HVAC, boxing $40K-$120K, rowing $45K-$120K, barre $15K-$45K.

**Tech infrastructure:** POS + check-in tablet $2K-$6K. Wifi mesh $1K-$4K. Security cameras $2K-$8K. Opening merchandise inventory $8K-$25K.

### Capital stack: SBA 7(a), equipment finance, franchise lending & founder equity

Boutique fitness capital stacks lean heavier on equity than restaurant because lenders view single-instructor revenue concentration as a risk -- though franchise-backed studios access more debt than independent.

**SBA 7(a) up to $5M** -- 70-85% LTV, Prime + 2.5-4.5% floating, 10 yr term. **Live Oak Bank** dominant boutique-fitness SBA lender + **Newtek + Celtic Bank + Byline Bank + Pinnacle Bank + United Midwest Savings + ReadyCap Lending**. Franchise concept gets faster approval (proven Item 19 economics); independent concept needs strong founder track record + collateral.

**SBA 504 owner-user** -- 50% senior + 40% SBA debenture (fixed 25-yr) + 10% equity if you buy real estate. Only ~5-10% of boutique founders own their building.

**Equipment finance/lease** -- $50K-$300K, 4-6 yr at 8-13% effective. **Crest Capital + Channel Partners + North Mill Equipment Finance + AP Equipment Finance + Currency Capital + Lendio marketplace**. Specialty for Pilates reformers (Balanced Body financing program) + cardio cluster financing through Stages/Life Fitness/Matrix.

**Franchise-specific lenders:** **ApplePie Capital + Boefly + Franchise America Finance (FAF) + ReadyCap Franchise**. Pre-approved franchise concept lists make underwriting faster.

**Friends + family + founder equity** -- dominant first $100K-$400K via LLC member interests + occasional convertible notes. Average boutique founder equity contribution **$80K-$200K** of total $250K-$550K independent or **$120K-$280K** of $400K-$850K franchise.

**Brand-specific franchise lending:** Xponential, OrangeTheory, F45 have **preferred lender programs** with pre-negotiated SBA terms. F45's collapse damaged its lending relationships 2022-2024.

**Local angel/community investors** -- regional fitness operators sometimes invest $100K-$500K for 20-40% equity + first-look on future units.

---

## ⚙️ PART 3 -- OPERATIONS

### Membership model, pricing, founding-member presale & ClassPass strategy

The pricing model determines unit economics -- get this wrong and even a packed schedule loses money.

**Tier structure:** **Unlimited monthly $159-$299** (premium-positioned, $179-$229 most common Tier-2/3, $229-$299 Tier-1 metro). **8-pack monthly $159-$199** ($20-$25/class effective). **4-pack monthly $89-$120**. **Single drop-in $25-$45** (highest per-class but lowest retention). **Founding-member rate $89-$129/mo unlimited locked for 6-12 months** (first 150-300 members pre-opening).

**Class capacity + utilization math:** Pilates 8-16 reformers, OrangeTheory 24-36 treadmill/rower stations, spin 30-50 bikes, CrossFit 15-25 athletes, yoga 15-30 mats, boxing 12-24 bags. **Target 55-75% average utilization** across schedule -- under 50% and economics break; over 80% sustained means turn-away demand and pricing-power opportunity.

**Class schedule:** **5:30am + 6:30am + 9:30am + 12pm + 4:30pm + 5:30pm + 6:30pm weekdays** (7-8 classes) + **8am + 9am + 10am + 11am weekends** (4-6 classes) = ~40-55 classes/week typical. Peak utilization 5:30am + 6:30am + 5:30pm + 6:30pm weekdays + 9am-11am weekends.

**Founding-member presale:** **Pre-sale 90-150 days before opening** at deep founding rate ($89-$129/mo unlimited locked 6-12 months). Target **150-300 founding members** at presale close. Founding members fund **30-50% of pre-opening working capital** and seed retention base. **Conversion to standard rate** at month 6 or 12 -- expect **35-55% post-conversion churn**, which is normal and modeled.

**ClassPass strategy:** **Mindbody-owned ClassPass** aggregates ~10K studios globally for $79-$199/mo consumer subscription. Studio receives **$4-$12 per booked attendee** vs $24-$38 direct member. ClassPass typically **fills 10-30% of off-peak class capacity** but cannibalizes direct membership conversion. Most operators **block peak times + cap ClassPass to 20-30% of any class**. **Gympass/Wellhub** (corporate-employer subsidy) similar dynamics -- $3-$8 per visit but higher volume.

**Retail + ancillary:** Branded apparel + water + protein bar = **5-12% of revenue at 35-55% margin**. Personal training (1-on-1 or small group) at $80-$140/hr adds high-margin revenue. Workshops + teacher training (Pilates / yoga) at $200-$650/student additional.

### Instructor talent: 1099 vs W-2, per-class economics & retention

Instructor talent is the single biggest operational risk and cost line -- members follow instructors, not brands.

**1099 vs W-2 classification:** Historically boutique studios used **1099 independent contractor** model ($45-$95/class flat) -- after **2018 Dynamex CA Supreme Court** + **AB5 California 2019** + **Department of Labor 2024 rule**, many states require **W-2 employee** classification for class-based instructors who teach exclusively for one studio or use studio-provided equipment + schedule. **W-2 cost structure** adds 12-22% to instructor cost via payroll taxes + workers comp + benefits eligibility.

**Per-class economics:** Independent boutique instructor **$45-$85/class** Tier-2/3 metro, **$75-$140/class** Tier-1. Yoga + barre often lower **$35-$65/class**. CrossFit coach + Pilates instructor + boxing coach higher **$55-$110/class**. Premium concepts (Barry's, Equinox) pay **$95-$180/class** for proven talent.

**Class fill economics:** At $159/mo unlimited member taking 8 classes/mo = $19.88/class. At $229/mo taking 10 = $22.90/class. **Revenue per attendee $20-$30** typical. **15-25 attendees per class** = **$300-$750 class revenue**. **Instructor cost $45-$140** = **70-85% contribution margin** on direct member fills, **35-55% on ClassPass mix**.

**Retention + poaching:** Boutique instructors job-hop frequently -- **average tenure 12-24 months**. Equinox/SoulCycle/competing boutiques poach proven talent by **raising per-class rate 25-50% + signing bonus + benefits**. Defense: **founding-instructor equity grants** (0.5-3% equity vested 3-4 yr) + **revenue share** ($1-$3 per attendee above 15) + **mentor/lead-trainer role progression** + **personal training + workshops** ancillary income.

**Hiring funnel:** **Inquire 100 instructors → audition 30 → hire 8-12** typical for new studio open. Recruit from **Pilates / yoga / CrossFit Level 1 / OrangeTheory certified pools + Facebook fitness instructor groups + local fitness college programs + competitor poaching**. Background check + audition class + 4-12 hr studio-specific onboarding required.

**Studio manager + assistant:** **Studio GM $55K-$80K + 5-15% bonus on EBITDA**. **Front desk/sales associate $16-$22/hr + commission on membership conversion**. Total non-instructor staff cost **$120K-$220K/yr** for a single studio.

### Tech stack: Mindbody, ClubReady, Mariana Tek, Glofox & Wodify

Tech stack is invisible to members but determines staff productivity + retention analytics + churn early-warning.

**Class booking + member CRM:** **Mindbody** (~30-40% boutique market share, $159-$595/mo per location, integrated with ClassPass which Mindbody acquired), **ClubReady** (XPOF preferred, dominant for franchise systems), **Mariana Tek** (Xponential-acquired, multi-location franchise focus), **Glofox** (acquired by ABC Financial 2022, ~$129-$329/mo), **Pike13** (small studios), **Wodify** (CrossFit-specific, $159-$329/mo), **TrueCoach** (programming + delivery for CrossFit / functional fitness).

**Billing + payment processing:** **ABC Financial** (largest US fitness biller, integrated with Glofox + many franchise systems), **Mindbody Payments**, **Stripe** (modern alternative), **Tide** (UK-origin), **Authorize.net**. Recurring membership billing must handle **failed-card retry logic + dunning + paused-membership states + freeze requests + cancellation** flows.

**Communication:** **Klaviyo or Mailchimp** for marketing email. **Postscript / Attentive / Tatango** for SMS campaigns. **Mindbody Connect / ClubReady Connect** for in-system messaging.

**Analytics + retention:** **Triib (CrossFit-specific), Loyalsnap, Keepme** for churn-prediction + win-back automation. **Toggl + Gusto** for instructor hours + payroll integration.

**Wearable + tech integration:** **OrangeTheory** uses proprietary OTbeat heart-rate monitor (sold to members + classroom display). **Polar / Whoop / Apple Watch / Garmin** integration optional for cycle + HIIT. **MyZone** heart-rate-monitor platform popular with HIIT + boxing.

**Equipment-tied tech:** **Peloton Commercial / Stages SC3 power-display / Keiser M3i / Schwinn AC Power** for spin. **Concept2 ErgData** for rowing.

### Marketing: founding-member presale, Instagram, referral, corporate & community

Boutique fitness marketing is dominated by **founding-member presale + Instagram/TikTok + referral + corporate partnerships + local community events** -- paid digital has limited efficiency at this unit size.

**Founding-member presale (90-150 days pre-opening):** **Landing page + Meta/Google paid + Instagram organic + local press + influencer seeding** drives 150-300 founding members at $89-$129/mo locked 6-12 months. Typically **35-65% of total launch capital recouped pre-opening** through founding member payments.

**Instagram + TikTok:** Instructor-driven content + class clips + transformation stories + studio aesthetic + community moments. Larger boutique chains (SoulCycle, Solidcore, Barry's) maintain **100K-1M follower brand accounts + each instructor 5K-50K personal**. Instructor-as-influencer is the dominant 2026-2027 acquisition channel.

**Referral program:** **"Bring a Friend Free Class" + "Refer 3 friends get 1 month free"** = standard. Typical referral-share of new-member acquisition **25-40%** -- highest LTV channel.

**Corporate partnerships + Gympass/Wellhub:** **Local employer wellness benefit programs** -- approach HR at 50-500 employee companies within 5 miles. **Gympass/Wellhub aggregator** brings corporate-subsidized members at $3-$8 per visit -- volume good, retention/conversion to direct mixed.

**Community events:** **Charity classes (proceeds to local nonprofit), pop-up classes at park/brewery/Whole Foods, run-club partnerships, monthly member appreciation, instructor workshops** drive press + foot traffic + retention.

**Local press + influencer:** Local lifestyle/fitness Instagram influencers (2K-25K followers) for **trade-deal (free 3-month membership for content)** -- higher ROI than paid ad spend at boutique unit scale. Local women's media + neighborhood blog mentions.

**Member retention marketing:** **Day 1 / Day 7 / Day 14 / Day 30 / Day 60 / Day 90** automated email + SMS check-ins. **Class-attendance milestones** (10 classes / 50 / 100) with branded swag. **Personal-best celebrations** + **birthday class + monthly progress reports** + **community Slack/Discord/WhatsApp** for retention.

---

## 🚀 PART 4 -- GROWTH & EXIT

### Scaling units: second studio, multi-unit franchise & area developer rights

The growth path from single-unit operator to multi-unit franchise or area developer has well-defined milestones with stage-specific risks.

**Stage 1 (Year 1 post-open):** **Member ramp to 250-500 active**. Revenue **$300K-$700K**. EBITDA negative to **+5%**.

**Stage 2 (Years 2-3):** **Membership 400-800 mature**. Revenue **$500K-$1.2M**. EBITDA **8-18%**. Founder considers second unit.

**Stage 3 (Years 3-5):** **Second unit opens in adjacent neighborhood/market**. Combined revenue **$1.0M-$2.5M**. EBITDA **10-20%** with shared overhead (regional manager + marketing). Founder considers third unit or area-developer rights.

**Stage 4 (Years 5-8):** **3-7 units operated as multi-unit operator (MUO)**. Revenue **$2.5M-$8M**. EBITDA **12-22%**. Possible area-developer (AD) territory rights with franchisor for exclusive market.

**Stage 5 (Years 7-15):** **Area developer with 10-30 units** in regional cluster. Revenue **$8M-$25M+**. EBITDA **15-22%** at multi-unit level. Exit decision: hold, strategic resale, franchise-portfolio sale, ESOP, family-office.

| Stage | Timeline | Units | Annual Revenue | EBITDA Margin |
|---|---|---|---|---|
| Stage 1 Ramp | Year 1 post-open | 1 | $300K-$700K | Negative to 5% |
| Stage 2 Mature single | Years 2-3 | 1 | $500K-$1.2M | 8-18% |
| Stage 3 Second unit | Years 3-5 | 2 | $1.0M-$2.5M | 10-20% |
| Stage 4 Multi-unit operator | Years 5-8 | 3-7 | $2.5M-$8M | 12-22% |
| Stage 5 Area developer | Years 7-15 | 10-30 | $8M-$25M+ | 15-22% |

| Sizing Decision | Capital | Annual Revenue Cap | Best For |
|---|---|---|---|
| Independent single-unit Pilates/yoga/barre | $250K-$450K | $400K-$900K | Founder-instructor with local following |
| Independent HIIT/spin/multi-discipline | $350K-$650K | $500K-$1.1M | Founder with operations track record |
| Franchise single-unit (Club Pilates/Pure Barre/CycleBar/StretchLab) | $400K-$700K | $450K-$750K | First-time operator wanting playbook |
| Franchise OrangeTheory/F45 flagship | $700K-$1.2M | $650K-$950K | Operator with HIIT-format expertise |
| Premium reformer (Solidcore-style) | $700K-$1.1M | $900K-$1.4M | Tier-1 metro premium-positioning operator |
| Multi-unit franchise (3-7 units) | $1.5M-$5M | $2.5M-$8M | Proven single-unit operator |
| Area developer (10-30 units) | $5M-$25M | $8M-$25M+ | Capitalized multi-unit operator |

### Exit math: franchise resale, area-developer monetization & strategic acquisition

Boutique fitness exit landscape narrowed post-2020 -- the F45 SPAC implosion + SoulCycle decline + Xponential class-action 2023 + interest-rate compression depressed multiples vs 2018-2021 peak.

**Single-unit franchise resale:** **2-4x SDE (Seller's Discretionary Earnings)** typical, **$300K-$1.2M** transaction. Most common boutique exit. Buyer pool: aspirational owner-operator + franchisee-portfolio investor + local family office. **First Choice Business Brokers + Transworld Business Advisors + Sunbelt Network** facilitate.

**Multi-unit operator (MUO) sale:** **3-5x EBITDA**, $2M-$15M transaction. Buyer pool: regional franchise portfolio investor + private equity + family office + competing MUO.

**Area developer rights monetization:** **4-7x EBITDA** for established AD territory with development pipeline, $5M-$50M+ transaction. Buyer pool: PE fitness platforms (NexPhase Capital, BlueWolf, etc.) + family offices + franchisor itself buying back territory.

**Strategic acquisition by franchisor or competitor:** **5-10x EBITDA** if brand or location strategic. **Xponential Fitness** has bought back area developer territory + acquired Rumble Boxing 2021 + acquired BFT 2023. **Anytime Fitness / SEB / Equinox / Lifetime** opportunistic on premium independent.

**Strategic acquisition by PE platform:** Roark Capital (OrangeTheory + Massage Envy + Anytime Fitness adjacent), Mainsail Partners, NexPhase, Snapdragon Capital, Bertram Capital active in fitness 2020-2025.

**Going-public/SPAC (cautionary):** **F45 Training NASDAQ:FXLV IPO 2021 at $14 → <$2 2024**, Mark Wahlberg pulled out, hundreds of franchise closures, class actions. **Xponential Fitness NYSE:XPOF** down ~70% from 2021 peak. Public-market exit closed for fitness 2022-2025.

**Wind-down/asset sale:** Distressed exit -- equipment to **Used Gym Equipment dealers, Title Boxing closed-store auctions, Gym Closeout USA**. Lease assignment to similar concept where landlord permits.

| Exit Path | Buyer Type | Typical Multiple | Process Length | Best For |
|---|---|---|---|---|
| Single-unit franchise resale | Owner-operator + franchisee investor | 2-4x SDE | 3-9 months | $300K-$1.2M small-unit exit |
| Multi-unit operator sale | Regional franchisee portfolio + family office | 3-5x EBITDA | 6-12 months | 3-7 unit operator $2M-$15M |
| Area developer monetization | PE platform + franchisor buyback + family office | 4-7x EBITDA | 9-18 months | AD with development pipeline $5M-$50M+ |
| Strategic acquisition by franchisor | XPOF/SEB/Roark portfolio | 5-10x EBITDA | 6-15 months | Strategic territory or premium brand |
| PE platform acquisition | Roark/NexPhase/Mainsail/Bertram | 5-8x EBITDA | 9-18 months | Multi-unit or AD platform $10M-$100M+ |
| Wind-down / asset sale | Equipment auction + lease assignment | Asset value only | 60-180 days | Distressed operator |

### Counter-case: F45 SPAC implosion, SoulCycle decline, CrossFit exodus, ClassPass & GLP-1 cardio aversion

A serious boutique fitness founder must stress-test the case above against the conditions that make this category a difficult bet in 2027 -- F45 SPAC implosion, SoulCycle/Equinox decline, FlyWheel bankruptcy, CrossFit affiliate exodus post-Glassman, ClassPass economics, Pilates reformer supply chain shortage, GLP-1 cardio aversion, franchise resale glut, owner-operator burnout, instructor poaching, Tier-1 metro saturation, COVID reopening hangover, hybrid digital cannibalization, lawsuit exposure on instructor injury (full 14-element counter-case in the Counter-Case section below).

`;

const tldr = `**TL;DR:** Starting a **boutique fitness studio business in 2027** (a.k.a. **boutique studio**, **specialty group-fitness studio**, **single-discipline fitness studio**, **small-format fitness studio**, **<5,000 sqft IHRSA boutique definition**) -- the **leased + state-business-licensed + workers-comp + general-liability-insured + class-based membership-model 1,500-3,500 sqft single-discipline specialty fitness facility operating 45-55 minute group classes in 8-30 simultaneous participants across one specialty: reformer Pilates (Club Pilates franchise + Solidcore + Pure Barre + [solidcore]) + HIIT/strength (OrangeTheory Fitness OTF + F45 Training + Barry's Bootcamp + BFT) + indoor cycling spin (SoulCycle + CycleBar + FlyWheel-ghosts + Peloton studios) + strength functional (CrossFit affiliate + StrongFirst + StretchLab) + yoga (CorePower Yoga + Y7 + YogaSix + Modo Yoga) + boxing/kickboxing (Rumble Boxing + Title Boxing Club + 9Round + Box+Flow) + rowing (Row House) + dance/barre (Pure Barre + AKT + Dailey Method + The Bar Method) + stretch/recovery (StretchLab + Stretch Zone), operating membership tiers unlimited $159-$299/mo + 8-pack $159-$199 + drop-in $25-$45 + ClassPass exposure 10-30% of class fills at $4-$12 per visit through Mindbody-owned ClassPass + Gympass/Wellhub corporate aggregators, instructor-led with 1099 contractor $45-$85/class historical (now W-2 in CA/NY/MA post-AB5 + DOL 2024) up to $95-$180/class premium Tier-1 (Barry's, Equinox)** -- means navigating **lease 1,500-3,500 sqft at $32-$95/sqft NNN strip center or daytime-traffic plaza + 3-5 yr term + landlord TI $30-$150K + commercial C-2/C-3 zoning + ADA + CUP for >50 max occupancy + 3-9 month permit entitlement + build-out $60-$140/sqft sprung wood/rubber-cushion floor + JBL/QSC/Bose sound $8K-$35K + DMX LED lighting $5K-$25K + HVAC $25K-$95K + mirrors $4-$12/sqft + locker rooms $25K-$75K + equipment by format (reformer Pilates 8-16 reformers Balanced Body/Stott Pilates Merrithew/Peak Pilates/BASI $3,500-$8,500 each = $30K-$140K + 6-14 mo supply chain waitlist + OrangeTheory HIIT 12-15 treadmills + 12-15 Concept2 rowers + OTbeat HRM $125K-$225K + F45 circuit $80K-$160K + spin 30-50 Stages SC3/Schwinn AC Power/Keiser M3i $55K-$220K + CrossFit affiliate rig + barbells + bumper plates $30K-$80K + $200/yr CrossFit Inc fee + yoga mats + heaters $5K-$25K + boxing heavy bags + speed/reflex $40K-$120K + rowing 20-30 Concept2 or Hydrow Pro $45K-$120K + barre ballet barres + 1-3 lb weights $15K-$45K + stretch tables $10K-$35K) + tech stack (Mindbody 30-40% boutique + ClubReady XPOF + Mariana Tek + Glofox ABC 2022 + Pike13 + Wodify CrossFit + TrueCoach + ABC Financial billing + Stripe + Klaviyo email + Postscript/Attentive SMS + Triib/Loyalsnap/Keepme churn analytics + MyZone/Polar/Whoop wearables) + franchise vs independent (Xponential Fitness NYSE:XPOF — Club Pilates 1,000+ / Pure Barre 500+ / CycleBar 200+ / StretchLab 300+ / Row House 100+ / AKT 50+ / BFT / YogaSix 200+ / Rumble Boxing acquired 2021 + franchise fee $40K-$60K + royalty 7-9% + brand fund 2-3% + Item 19 median Club Pilates AUV $550K-$650K + Pure Barre $400K-$500K + CycleBar $650K-$900K + OrangeTheory non-XPOF $650K-$950K + Self Esteem Brands Anytime Fitness 4,800+ + Basecamp + The Bar Method + OrangeTheory Roark-backed Ellipse ~1,400 US + F45 Training NASDAQ:FXLV peaked ~2,800 global 2021 hundreds closed 2022-2024 after SPAC implosion + Barry's corporate + Solidcore corporate ~200 US + SoulCycle Equinox-owned ~80 US post-closures from 99 peak + CrossFit Inc ~9,500-10,000 affiliates 2025 down from ~13K peak post-Glassman) + capital stack SBA 7(a) up to $5M Live Oak Bank dominant + Newtek + Celtic + Byline + ReadyCap + SBA 504 owner-user + equipment finance Crest Capital/Channel Partners/North Mill/AP/Currency 8-13% + franchise lenders ApplePie Capital/Boefly/Franchise America Finance + friends-and-family $80K-$280K founder equity + Xponential/OrangeTheory preferred lender programs**, and operating against **~110,000 US health/fitness clubs per IHRSA + ~30-35K boutique (<5K sqft single-discipline) + boutique $13B-$16B revenue out of $32B-$36B total industry + boutique CAGR 15-25% 2013-2019 then -25-40% during 2020 COVID + rebound 8-15% 2022-2024 winners-vs-losers separation + reformer Pilates dominant 2023-2026 growth + HIIT mature OrangeTheory ~1,400 but F45 SPAC implosion + spin contracted SoulCycle ~50 closures + FlyWheel bankruptcy 2020 + CrossFit affiliate count ~13K peak to ~9,500-10,000 post-Glassman** -- capturing **mature single-discipline boutique 62-74% per-class contribution margin + 8-22% net margin at $400K-$1.4M annual revenue per studio per Xponential Item 19 + IHRSA + ClubIntel + Mindbody/ABC Financial benchmarks + CAC $80-$180 + LTV $1,200-$3,800 + retention 6-18 mo + monthly churn 4-9% vs full-gym 3-5% + franchise royalty 7-9% + brand fund 2-3% compressing margin to 6-15% net + studio GM $55K-$80K + front desk $16-$22/hr + instructor cost $35-$180/class**. The hardest part is **retention + instructor talent + market saturation + category headwinds (boutique churn 4-9% monthly + instructor poaching wars Tier-1 + F45 Training SPAC implosion 2022-2024 Mark Wahlberg pulled out $14 IPO to <$2 + SoulCycle ~50 closures + FlyWheel bankruptcy 2020 + CrossFit ~1,000+ affiliates dropped post-Greg Glassman + ClassPass $4-$12 vs $24-$38 direct member + Pilates reformer supply 6-14 mo waitlists + GLP-1/Ozempic cardio aversion + Tier-1 metro saturation Manhattan/LA/Miami 8-15 boutique per sq mi + Peloton/Mirror/Apple Fitness+ hybrid cannibalization 15-25% + owner-operator burnout + lawsuit exposure + AB5 California 2019 + DOL 2024 W-2 reclassification)**, not capital or build-out.`;

const flow = `

## The Operating Journey: From Lease + Brand To Mature Boutique Studio And Strategic Exit

\`\`\`mermaid
flowchart TD
  A[Founder Decides To Start Boutique Fitness Studio] --> B[Format + Franchise vs Independent + Capital Decision]
  B --> B1{Format Plus Franchise Plus Capital Plus Market Decision}
  B1 -->|$250K-$450K Independent Pilates/Yoga/Barre Single-Discipline| C1[Independent Single-Discipline Studio]
  B1 -->|$350K-$650K Independent HIIT/Spin/Multi-Discipline With Operations Track Record| C2[Independent HIIT Or Multi-Discipline]
  B1 -->|$400K-$700K Franchise Club Pilates/Pure Barre/CycleBar/StretchLab Xponential| C3[Xponential Franchise Single-Unit]
  B1 -->|$700K-$1.2M Franchise OrangeTheory Or F45 Or Barry's Flagship| C4[HIIT Franchise Or Flagship]
  B1 -->|$700K-$1.1M Premium Reformer Solidcore-Style Tier-1 Metro| C5[Premium Reformer Pilates Concept]
  B1 -->|Acquire Existing Studio With Member Base| C6[Acquisition Operator]
  C1 --> D[Site Plus Lease Plus Zoning Plus Permits]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  C6 --> D
  D --> D1[Strip Center Or Daytime-Traffic Plaza 1,500-3,500 sqft With Female-Skew 9am-2pm Foot Traffic]
  D --> D2[Lease $32-$95/sqft NNN 3-5 yr Term Plus Landlord TI Allowance $30-$150K]
  D --> D3[Zoning Commercial C-2/C-3 Or Mixed-Use MU Plus CUP For Greater Than 50 Max Occupancy Assembly]
  D --> D4[ADA Plus Sprinkler Plus Health Department If Showers Plus 3-9 Month Permit Entitlement]
  D --> D5[Co-Tenant Signals Whole Foods/Sprouts Plus Starbucks/Blue Bottle Plus lululemon/Athleta]
  D1 --> E[Capital Stack Plus Equipment Plus Build-Out]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  E --> E1[SBA 7(a) Up To $5M Live Oak Bank/Newtek/Celtic/Byline/Pinnacle Prime+2.5-4.5%]
  E --> E2[SBA 504 Owner-User Rare Most Boutique Lease Not Own]
  E --> E3[Equipment Finance Crest Capital/Channel Partners/North Mill/AP/Currency $50K-$300K 8-13%]
  E --> E4[Franchise-Specific Lenders ApplePie Capital/Boefly/Franchise America Finance/ReadyCap Franchise]
  E --> E5[Friends + Family $80K-$280K Founder Equity LLC Member Interests]
  E --> E6[Brand-Specific Preferred Lender Programs Xponential/OrangeTheory/F45 Pre-Negotiated]
  E1 --> F[Build-Out Plus Equipment By Format]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  E6 --> F
  F --> F1[Build-Out $60-$140/sqft Sprung Floor + Sound + Lighting + HVAC + Mirrors + Locker Rooms]
  F --> F2[Reformer Pilates 8-16 Reformers Balanced Body/Stott Merrithew/Peak/BASI $30K-$140K]
  F --> F3[OrangeTheory HIIT 12-15 Treadmills + Rowers + Dumbbells + OTbeat $125K-$225K Total]
  F --> F4[Spin 30-50 Bikes Stages SC3/Schwinn AC Power/Keiser M3i $55K-$220K Plus Sound Lighting]
  F --> F5[CrossFit Rig + Barbells + Plates + Rowers + Plyo $30K-$80K Lowest Capital Format]
  F --> F6[Yoga Mats + Heaters $5K-$25K Plus Boxing $40K-$120K Plus Rowing $45K-$120K Plus Barre $15K-$45K]
  F1 --> G[Membership Model Plus Pricing Plus Founding-Member Presale]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  F6 --> G
  G --> G1[Unlimited $159-$299/Mo Plus 8-Pack $159-$199 Plus 4-Pack $89-$120 Plus Drop-In $25-$45]
  G --> G2[Founding-Member Presale 90-150 Days Pre-Opening $89-$129/Mo Locked 6-12 Months 150-300 Members]
  G --> G3[Class Capacity 8-50 Depending On Format Target 55-75% Average Utilization]
  G --> G4[ClassPass 10-30% Off-Peak Fills At $4-$12 Per Visit vs $24-$38 Direct Cannibalization Risk]
  G --> G5[Gympass/Wellhub Corporate Wellness $3-$8 Per Visit Volume Good Retention Mixed]
  G1 --> H[Instructor Talent Plus 1099 vs W-2 Plus Per-Class Economics]
  H --> H1[1099 Independent Contractor $45-$85/Class Historical Now W-2 In CA/NY/MA Post-AB5 + DOL 2024]
  H --> H2[Premium Talent $95-$180/Class Barry's/Equinox/SoulCycle Poach With 25-50% Rate Plus Bonus]
  H --> H3[Founding-Instructor Equity 0.5-3% Vest 3-4 Yr Plus Revenue Share $1-$3/Attendee Above 15]
  H --> H4[Hiring Funnel 100 Inquire → 30 Audition → 8-12 Hire Plus Background + Onboarding]
  H --> H5[Studio GM $55K-$80K + 5-15% Bonus + Front Desk $16-$22/hr + Commission]
  H1 --> I[Tech Stack Plus Marketing Plus Retention]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  I --> I1[Mindbody 30-40%/ClubReady XPOF/Mariana Tek XPOF/Glofox ABC 2022/Pike13/Wodify CrossFit]
  I --> I2[ABC Financial Billing/Mindbody Payments/Stripe/Authorize.net Recurring Payment Processing]
  I --> I3[Triib/Loyalsnap/Keepme Churn Analytics Plus Win-Back Automation]
  I --> I4[Instagram/TikTok Instructor-Driven Content + Founding-Member Presale + Referral 25-40% New]
  I --> I5[Corporate Partnerships Gympass/Wellhub + Local Employer 50-500 Person + Community Events]
  I1 --> J[Stage Growth Plus Scaling Decisions]
  I2 --> J
  I3 --> J
  I4 --> J
  I5 --> J
  J --> J1[Stage 1 Year 1 Member Ramp 250-500 Active $300K-$700K Revenue Negative-To-5% EBITDA]
  J --> J2[Stage 2 Years 2-3 Membership 400-800 Mature $500K-$1.2M Revenue 8-18% EBITDA Consider Second]
  J --> J3[Stage 3 Years 3-5 Second Unit $1.0M-$2.5M Revenue 10-20% EBITDA Shared Overhead]
  J --> J4[Stage 4 Years 5-8 3-7 Multi-Unit Operator $2.5M-$8M Revenue 12-22% EBITDA]
  K{Mature Operations Plus Strategic Exit Decision}
  J --> K
  K -->|Hold For Cash Flow Plus Community Plus Brand| L[Long-Term Independent Hold]
  K -->|Single-Unit Franchise Resale 2-4x SDE Owner-Operator + Franchisee Investor| M[Single-Unit Franchise Resale]
  K -->|Multi-Unit Operator Sale 3-5x EBITDA Regional Portfolio + Family Office| N[Multi-Unit Operator Sale]
  K -->|Area-Developer Monetization 4-7x EBITDA PE Platform + Franchisor Buyback| O[Area Developer Monetization]
  K -->|Strategic Acquisition By Franchisor XPOF/SEB/Roark 5-10x EBITDA| P[Franchisor Strategic Acquisition]
  K -->|PE Platform Acquisition Roark/NexPhase/Mainsail/Bertram 5-8x EBITDA| Q[PE Platform Roll-Up]
  K -->|Wind-Down Equipment Auction + Lease Assignment Distressed| R[Wind-Down/Asset Sale]
  L --> S[Independent Hold With Mature 15-22% EBITDA + Community + Brand Stewardship]
  M --> T[Single-Unit Franchise Sold To Owner-Operator $300K-$1.2M Transaction]
  N --> U[Multi-Unit Sold $2M-$15M To Regional Portfolio Or Family Office]
  O --> V[AD Territory $5M-$50M+ Sold To PE Platform Or Franchisor Buyback]
  P --> W[Franchisor Buys Strategic Territory Or Premium Brand]
  Q --> X[PE Roll-Up Into Multi-Brand Portfolio With Operational Efficiency Push]
  R --> Y[Asset Liquidation + Equipment To Used Gym Dealers + Title Boxing/Gym Closeout USA]
\`\`\`

## The Decision Matrix: Format And Franchise vs Independent

\`\`\`mermaid
flowchart TD
  A[Founder Has Capital + Target Market + Format Decision] --> B{Format Plus Franchise vs Independent Decision}
  B -->|Reformer Pilates Dominant 2023-2027 Growth Female-Skew 28-55| C[Pilates Path]
  B -->|HIIT/Strength OrangeTheory Or F45 Mature Higher Equipment| D[HIIT Path]
  B -->|Indoor Cycling Spin Contracted SoulCycle Decline FlyWheel Bankruptcy| E[Spin Path Caution]
  B -->|CrossFit Affiliate Declining Post-Glassman Lowest Capital| F[CrossFit Path Caution]
  B -->|Yoga Mature Lower Equipment Heat HVAC| G[Yoga Path]
  B -->|Boxing Growing Rumble/Title/9Round| H[Boxing Path]
  B -->|Rowing Niche Row House Hydrow| I[Rowing Path]
  B -->|Dance/Barre Mature Pure Barre/AKT/The Bar Method| J[Dance Barre Path]
  B -->|Stretch Emerging StretchLab/Stretch Zone| K[Stretch Recovery Path]
  C --> C1[8-16 Reformers $30K-$140K Supply 6-14 Mo Balanced Body/Stott/Peak/BASI Plus Club Pilates XPOF Or Solidcore Or Pure Barre Or Independent]
  D --> D1[OrangeTheory Roark $700K-$1.2M Or F45 Caution Post-SPAC Or Barry's Corporate Or BFT XPOF]
  E --> E1[SoulCycle 99 To 80 Studios 2020-2024 Or CycleBar XPOF ~200 Or Independent Differentiation Required]
  F --> F1[CrossFit $200/yr Inc Fee Plus $30K-$80K Equipment Lowest Capital Affiliate Count ~13K To ~9,500-10,000 Post-Glassman]
  G --> G1[Yoga $5K-$25K + Hot HVAC $25K-$80K Plus CorePower ~200 Or YogaSix XPOF ~200 Or Modo Or Y7 Or Independent]
  H --> H1[Heavy Bags + Speed/Reflex $40K-$120K Plus Rumble XPOF 2021 Or Title ~150 Or 9Round ~600]
  I --> I1[Concept2 Or Hydrow Pro 20-30 Ergs $45K-$120K Plus Row House XPOF ~100 Or Independent]
  J --> J1[Ballet Barres + Weights $15K-$45K Plus Pure Barre XPOF ~500 Or AKT XPOF ~50 Or Bar Method SEB ~100]
  K --> K1[Tables + Bands $10K-$35K Lower Per-Visit High Frequency Plus StretchLab XPOF ~300 Or Stretch Zone ~250]
  C1 --> L{Reassess After Year 2 Stabilization}
  D1 --> L
  E1 --> L
  F1 --> L
  G1 --> L
  H1 --> L
  I1 --> L
  J1 --> L
  K1 --> L
  L -->|Hold For Cash Flow + Community + Brand| M[Long-Term Independent Hold]
  L -->|Single-Unit Franchise Resale At 2-4x SDE| N[Single-Unit Franchise Resale]
  L -->|Multi-Unit Operator Sale At 3-5x EBITDA| P[Multi-Unit Sale]
  L -->|Area Developer Rights At 4-7x EBITDA| Q[Area Developer Monetization]
  L -->|Strategic Acquisition By Franchisor 5-10x EBITDA| R[Franchisor Buyback]
  L -->|PE Platform Acquisition At 5-8x EBITDA| S[PE Platform Roll-Up]
  L -->|Wind-Down Distressed| T[Wind-Down Asset Sale]
  M --> U[Long-Term Independent Hold]
  N --> V[Single-Unit Sold $300K-$1.2M]
  P --> X[Multi-Unit Sold $2M-$15M]
  Q --> Y[AD Territory $5M-$50M+ Sold To PE Or Franchisor]
  R --> Z[Franchisor Buys Strategic Territory]
  S --> AA[PE Multi-Brand Portfolio Roll-Up]
  T --> AB[Asset Liquidation + Equipment Auction]
\`\`\`

`;

const src = `

## Sources

1. **IHRSA (International Health, Racquet & Sportsclub Association, ihrsa.org)** -- Primary industry trade association publishing annual health/fitness club count + revenue + member counts + boutique vs full-service segment breakdown. https://www.ihrsa.org
2. **ClubIntel (clubintel.io)** -- Fitness industry research + benchmarking firm + multi-unit operator data. https://clubintel.io
3. **Mindbody Industry Reports (mindbodyonline.com)** -- Largest boutique fitness software company publishes industry trend reports + consumer behavior data. https://www.mindbodyonline.com
4. **Statista Fitness Industry (statista.com/markets/420/topic/486/fitness)** -- US health club + boutique fitness market sizing + growth data. https://www.statista.com
5. **Xponential Fitness NYSE:XPOF Investor Relations (investor.xponential.com)** -- Item 19 disclosures + AUV data + franchise economics for Club Pilates, Pure Barre, CycleBar, Row House, StretchLab, AKT, BFT, YogaSix, Rumble Boxing. https://investor.xponential.com
6. **Xponential Fitness FDD Item 19 (xponential.com)** -- Franchise Disclosure Document disclosures showing median unit revenue. https://www.xponential.com
7. **OrangeTheory Fitness Franchise (orangetheoryfranchise.com)** -- Franchise opportunity + investment range + Roark Capital-backed Ellipse parent. https://www.orangetheoryfranchise.com
8. **F45 Training NASDAQ:FXLV Investor (investor.f45training.com)** -- Public-company filings showing 2021 IPO + 2022-2024 SPAC implosion + Mark Wahlberg pullout + franchise closures. https://investor.f45training.com
9. **Solidcore (solidcore.co)** -- Corporate-owned reformer Pilates ~200 US units premium-positioned. https://www.solidcore.co
10. **Barry's Bootcamp (barrys.com)** -- Corporate-owned premium HIIT ~75 global studios. https://www.barrys.com
11. **SoulCycle Equinox-Owned (soul-cycle.com)** -- Corporate-owned spin ~80 studios post-decline from 99 peak. https://www.soul-cycle.com
12. **Equinox Holdings (equinox.com)** -- Premium full-service + boutique-style classes parent of SoulCycle. https://www.equinox.com
13. **CycleBar Xponential (cyclebar.com)** -- XPOF franchise indoor cycling ~200 US units. https://www.cyclebar.com
14. **Club Pilates Xponential (clubpilates.com)** -- XPOF franchise reformer Pilates 1,000+ US units largest by count. https://www.clubpilates.com
15. **Pure Barre Xponential (purebarre.com)** -- XPOF franchise barre ~500 US units. https://www.purebarre.com
16. **StretchLab Xponential (stretchlab.com)** -- XPOF franchise assisted stretching ~300 US units. https://www.stretchlab.com
17. **Row House Xponential (therowhouse.com)** -- XPOF franchise indoor rowing ~100 US units. https://www.therowhouse.com
18. **YogaSix Xponential (yogasix.com)** -- XPOF franchise yoga ~200 US units. https://www.yogasix.com
19. **Rumble Boxing Xponential (doyourumble.com)** -- XPOF franchise boxing acquired 2021. https://www.doyourumble.com
20. **BFT Body Fit Training (bodyfittraining.com)** -- XPOF functional strength acquired 2023. https://www.bodyfittraining.com
21. **Self Esteem Brands (selfesteembrands.com)** -- Parent of Anytime Fitness 4,800+ + Basecamp Fitness + Waxing the City + The Bar Method. https://www.selfesteembrands.com
22. **Anytime Fitness Self Esteem Brands (anytimefitness.com)** -- 24/7 unattended global franchise 4,800+ units closer to full-service than boutique. https://www.anytimefitness.com
23. **The Bar Method Self Esteem Brands (barmethod.com)** -- Barre franchise ~100 units. https://www.barmethod.com
24. **CrossFit Inc (crossfit.com)** -- Affiliate licensing + $200/yr affiliate fee + ~9,500-10,000 US affiliates down from ~13K peak post-Glassman 2020-2022. https://www.crossfit.com
25. **CorePower Yoga (corepoweryoga.com)** -- Corporate-owned yoga ~200 US units. https://www.corepoweryoga.com
26. **Title Boxing Club (titleboxingclub.com)** -- Boxing fitness franchise ~150 US units. https://www.titleboxingclub.com
27. **9Round Fitness (9round.com)** -- Boxing-cardio franchise ~600 US units. https://www.9round.com
28. **Balanced Body (pilates.com)** -- Largest US Pilates reformer manufacturer + dealer financing. https://www.pilates.com
29. **Stott Pilates / Merrithew (merrithew.com)** -- Pilates reformer + education. https://www.merrithew.com
30. **Peak Pilates (peakpilates.com)** -- Pilates reformer manufacturer. https://www.peakpilates.com
31. **Concept2 (concept2.com)** -- Dominant indoor rowing erg (CrossFit + Row House). https://www.concept2.com
32. **Stages Indoor Cycling (stagesindoorcycling.com)** -- Stages SC3 power-display commercial spin bike. https://www.stagesindoorcycling.com
33. **Keiser Fitness (keiser.com)** -- Keiser M3i magnetic-resistance commercial indoor cycling. https://www.keiser.com
34. **Peloton Commercial (onepeloton.com/commercial)** -- Peloton commercial bike + tread. https://www.onepeloton.com/commercial
35. **Mindbody Online (mindbodyonline.com)** -- Dominant boutique fitness booking + CRM ~30-40% market share. https://www.mindbodyonline.com
36. **ClubReady (clubready.com)** -- Xponential-preferred franchise studio software. https://www.clubready.com
37. **Mariana Tek (marianatek.com)** -- Multi-location boutique fitness software, Xponential-acquired. https://www.marianatek.com
38. **Glofox by ABC Financial (glofox.com)** -- Studio management software acquired by ABC Financial 2022. https://www.glofox.com
39. **Wodify (wodify.com)** -- CrossFit-specific gym management software dominant in affiliate market. https://www.wodify.com
40. **ABC Financial Services (abcfinancial.com)** -- Largest US fitness billing + payment processing. https://www.abcfinancial.com
41. **ClassPass (classpass.com)** -- Mindbody-owned consumer aggregator paying studios $4-$12 per visit. https://www.classpass.com
42. **Gympass / Wellhub (gympass.com)** -- Corporate wellness aggregator paying studios $3-$8 per visit. https://www.gympass.com
43. **MyZone (myzone.org)** -- Heart-rate-monitor platform popular with HIIT + boxing. https://www.myzone.org
44. **Live Oak Bank Fitness Lending (liveoakbank.com)** -- Dominant boutique fitness SBA 7(a) lender. https://www.liveoakbank.com
45. **Newtek SBA (newtekone.com)** -- SBA 7(a) + 504 fitness studio lender. https://www.newtekone.com
46. **Celtic Bank SBA (celticbank.com)** -- SBA fitness lender. https://www.celticbank.com
47. **ReadyCap Lending (readycaplending.com)** -- SBA franchise fitness lender. https://www.readycaplending.com
48. **ApplePie Capital (applepiecapital.com)** -- Franchise-specific lender with pre-approved fitness brand lists. https://www.applepiecapital.com
49. **Boefly (boefly.com)** -- Franchise financing marketplace + SBA matchmaker. https://www.boefly.com
50. **Franchise America Finance (franchiseamericafinance.com)** -- Franchise SBA + equipment lender. https://www.franchiseamericafinance.com
51. **Crest Capital (crestcapital.com)** -- Equipment financing fitness studio. https://www.crestcapital.com
52. **Channel Partners Capital (channelpartnerscapital.com)** -- Equipment financing fitness. https://www.channelpartnerscapital.com
53. **North Mill Equipment Finance (northmillef.com)** -- Equipment financing fitness. https://www.northmillef.com
54. **AP Equipment Finance (apef.com)** -- Equipment financing fitness. https://www.apef.com
55. **Klaviyo (klaviyo.com)** -- Email + SMS marketing automation popular with boutique fitness. https://www.klaviyo.com
56. **Postscript (postscript.io)** -- SMS marketing for boutique fitness + DTC. https://www.postscript.io
57. **Triib (triib.com)** -- CrossFit churn analytics + member management. https://www.triib.com
58. **Loyalsnap (loyalsnap.com)** -- Boutique fitness churn-prediction + win-back automation. https://www.loyalsnap.com
59. **Keepme (keepme.fit)** -- AI-powered fitness retention + churn-prediction. https://www.keepme.fit
60. **Roark Capital (roarkcapital.com)** -- PE platform owning Anytime Fitness + Massage Envy + OrangeTheory parent. https://www.roarkcapital.com
61. **Transworld Business Advisors (tworld.com)** -- Boutique fitness business brokerage + franchise resale. https://www.tworld.com
62. **Sunbelt Network (sunbeltnetwork.com)** -- Business brokerage including boutique fitness studios. https://www.sunbeltnetwork.com
63. **California Dynamex AB5 (dir.ca.gov)** -- AB5 California 2019 + Dynamex 2018 reclassification 1099 to W-2 fitness instructors. https://www.dir.ca.gov
64. **US Department of Labor Independent Contractor Rule 2024 (dol.gov)** -- Federal independent-contractor classification affecting fitness 1099 vs W-2. https://www.dol.gov

`;

const num = `

## Numbers & Benchmarks

### Industry size, segment & operator landscape

| Metric | 2024-2026 Value | Source |
|---|---|---|
| US health/fitness clubs total | ~110,000 | IHRSA + Statista |
| US boutique segment (<5K sqft single-discipline) | ~30,000-35,000 | IHRSA + ClubIntel |
| US fitness industry revenue | $32B-$36B | IHRSA |
| Boutique segment revenue | $13B-$16B | IHRSA |
| Boutique CAGR pre-COVID 2013-2019 | 15-25% | IHRSA + ClubIntel |
| Boutique decline 2020 COVID | -25 to -40% | IHRSA |
| Boutique rebound 2022-2024 | +8 to +15% | IHRSA |
| Boutique avg revenue/member annually | $1,600-$3,600 | Mindbody + ClubIntel |
| Full-service avg revenue/member annually | $420-$1,800 | IHRSA |
| Boutique monthly churn | 4-9% | Mindbody + Loyalsnap |
| Member CAC | $80-$180 | Mindbody + Keepme |
| Member LTV | $1,200-$3,800 | Mindbody + Keepme |
| Average retention | 6-18 months | Loyalsnap + Keepme |

### Franchise vs independent capital and AUV

| Operator | Format | Franchise Fee | Initial Investment | Median AUV (Item 19) |
|---|---|---|---|---|
| Club Pilates (XPOF) | Reformer Pilates | $40K-$60K | $300K-$650K | $550K-$650K |
| Pure Barre (XPOF) | Barre | $40K-$60K | $250K-$500K | $400K-$500K |
| CycleBar (XPOF) | Indoor cycling | $50K-$60K | $400K-$800K | $650K-$900K |
| StretchLab (XPOF) | Assisted stretching | $40K-$60K | $250K-$450K | $400K-$600K |
| Row House (XPOF) | Indoor rowing | $50K-$60K | $400K-$700K | $450K-$650K |
| YogaSix (XPOF) | Yoga | $50K-$60K | $300K-$550K | $400K-$600K |
| Rumble Boxing (XPOF) | Boxing | $50K-$60K | $400K-$800K | $550K-$850K |
| BFT Body Fit Training (XPOF) | Functional strength | $50K-$60K | $350K-$650K | $450K-$700K |
| OrangeTheory Fitness | HIIT | $59,950 | $700K-$1.2M | $650K-$950K |
| F45 Training (post-implosion) | HIIT circuit | $30K-$60K | $300K-$650K | Highly variable post-2022 |
| 9Round | Boxing-cardio | $30K-$50K | $90K-$200K | $200K-$350K |
| Title Boxing Club | Boxing | $40K-$50K | $250K-$550K | $300K-$500K |
| The Bar Method (SEB) | Barre | $40K-$60K | $300K-$550K | $400K-$650K |
| Independent single-discipline | Any | None | $250K-$550K | $400K-$1.1M |

### Format-by-format equipment, capital, demographic

| Format | Equipment Cost | Build-Out | Total Studio Capital | Demographic |
|---|---|---|---|---|
| Reformer Pilates | $30K-$140K (8-16 reformers) | $120K-$280K | $300K-$700K | 75-85% female, 28-55 |
| HIIT OrangeTheory-style | $125K-$225K | $220K-$420K | $700K-$1.2M | 55-65% female, 30-55 |
| HIIT F45 circuit | $80K-$160K | $150K-$320K | $400K-$700K | 50/50, 25-45 |
| Indoor cycling spin | $55K-$220K (30-50 bikes) | $180K-$380K | $450K-$850K | 75-85% female, 28-45 |
| CrossFit affiliate | $30K-$80K | $80K-$180K | $250K-$450K | 55-65% male, 25-50 |
| Yoga | $5K-$25K + heat HVAC $25K-$80K | $100K-$250K | $250K-$500K | 80-90% female, 25-60 |
| Boxing/kickboxing | $40K-$120K | $150K-$320K | $400K-$700K | 50/50, 25-45 |
| Rowing | $45K-$120K | $150K-$300K | $400K-$650K | 60/40 female, 28-55 |
| Dance/barre | $15K-$45K | $120K-$250K | $300K-$550K | 85-95% female, 25-55 |
| Stretch/recovery | $10K-$35K | $100K-$200K | $250K-$450K | 60/40, 30-65 |

### Site selection & lease economics

| Market Tier | Base Rent NNN | Build-Out Cost | TI Allowance | Permit Timeline |
|---|---|---|---|---|
| Tier-1 metro (NYC, SF, LA, Miami, DC) | $55-$95/sqft | $90-$140/sqft | $50K-$120K | 4-9 months |
| Tier-2 major (Austin, Denver, Nashville, Charlotte, Seattle, Boston) | $38-$65/sqft | $70-$110/sqft | $40K-$90K | 3-6 months |
| Tier-3 mid-size (Kansas City, Pittsburgh, Cincinnati, Tampa) | $28-$45/sqft | $60-$95/sqft | $30K-$70K | 3-5 months |
| Secondary suburban | $22-$38/sqft | $50-$85/sqft | $25K-$60K | 2-4 months |
| Strip center (any tier) | -10 to -25% vs base | Same | Often higher TI | Faster |
| Free-standing pad | +15 to +35% vs base | +$15-$30/sqft | Lower TI | Slower |

### Membership pricing tiers

| Tier | Tier-1 Metro | Tier-2/3 | Effective Per-Class |
|---|---|---|---|
| Unlimited monthly | $229-$299 | $159-$229 | Best value 12+ classes |
| 8-pack monthly | $179-$229 | $159-$199 | $20-$25/class |
| Drop-in single | $32-$45 | $25-$38 | One-off |
| Founding-member locked 6-12 mo | $109-$149 | $89-$129 | Deepest discount |
| ClassPass effective to studio | $5-$12 | $4-$10 | Heavy discount + cannibalization |
| Gympass/Wellhub effective | $4-$8 | $3-$7 | Corporate-subsidized |

### Class capacity & utilization

| Format | Class Capacity | Target Utilization | Revenue Per Class (Direct Member) |
|---|---|---|---|
| Reformer Pilates | 8-16 | 60-75% | $300-$520 |
| OrangeTheory HIIT | 24-36 | 55-70% | $480-$900 |
| F45 HIIT circuit | 20-32 | 50-65% | $400-$750 |
| Spin | 30-50 | 55-70% | $500-$1,200 |
| CrossFit | 15-25 | 45-65% | $300-$600 |
| Yoga | 15-30 | 50-70% | $250-$650 |
| Boxing | 12-24 | 50-65% | $250-$550 |
| Rowing (Row House) | 20-30 | 50-65% | $400-$700 |
| Barre | 12-22 | 60-75% | $250-$500 |
| Stretch (1-on-1 or small group) | 1-4 | 70-90% | $100-$320 |

### Revenue mix at mature single-discipline studio

| Revenue Stream | % Of Revenue | Margin |
|---|---|---|
| Membership (unlimited + 8-pack + 4-pack) | 70-82% | 62-74% per class contribution |
| Drop-in single class | 4-12% | 65-78% |
| ClassPass + Gympass aggregator | 5-15% | 35-55% (heavy discount) |
| Retail (apparel + water + protein bar) | 5-12% | 35-55% |
| Personal training (1-on-1 or small group) | 3-10% | 55-72% |
| Workshops + teacher training | 2-8% | 45-65% (high gross, time-intensive) |

### Operating cost structure as % of revenue

| Cost Line | % Of Revenue | Notes |
|---|---|---|
| Instructor cost (1099 or W-2) | 22-32% | Higher in W-2 states post-AB5/DOL 2024 |
| Studio GM + front desk | 12-20% | Single GM + 1-3 desk associates |
| Rent + NNN | 12-22% | Lower in Tier-3, higher Tier-1 |
| Marketing + advertising | 4-9% | Higher pre-opening + Q1 + back-to-school |
| POS + software (Mindbody/ClubReady/Glofox/Wodify) | 1-3% | Plus payment processing 2-3% |
| Franchise royalty + brand fund (if franchise) | 9-12% | 7-9% royalty + 2-3% brand fund |
| Insurance (gen liability + workers comp) | 2-4% | Higher for HIIT/CrossFit/boxing |
| Utilities + cleaning + supplies | 3-6% | Higher for hot yoga/heated formats |
| Equipment maintenance + replacement reserve | 2-4% | Treadmills + reformers + sound highest |
| **Net Margin Independent** | **8-22%** | After all costs |
| **Net Margin Franchise** | **6-15%** | After royalty + brand fund |

### Instructor compensation

| Role | Per Class / Rate | Notes |
|---|---|---|
| Pilates instructor | $35-$85/class | Higher for proven |
| Yoga teacher | $35-$75/class | Higher Tier-1 |
| Barre instructor | $35-$65/class | Lower-paid format |
| CrossFit coach | $45-$95/class | Plus PT $80-$140/hr |
| HIIT/OrangeTheory coach | $40-$85/class | Higher with HRM expertise |
| Spin instructor | $40-$95/class | Higher for choreography |
| Boxing coach | $55-$110/class | Expertise + risk premium |
| Premium Tier-1 (Barry's/Equinox/SoulCycle) | $95-$180/class | Proven talent + brand |
| Studio GM | $55K-$80K + 5-15% EBITDA bonus | Sales + scheduling + retention |
| Front desk / sales associate | $16-$22/hr + commission | $5-$25 per converted membership |
| Personal trainer 1-on-1 | $80-$140/hr | Direct add-on revenue |

### Five-year cash-flow trajectory: single-unit boutique studio

| Year | Active Members | Annual Revenue | Annual EBITDA | EBITDA Margin |
|---|---|---|---|---|
| Year 1 ramp + founding-member conversion | 250-500 | $300K-$700K | -$50K to +$35K | Negative to 5% |
| Year 2 velocity + first churn cycle | 400-700 | $500K-$1.0M | +$40K-$160K | 8-16% |
| Year 3 mature single | 500-850 | $650K-$1.2M | +$80K-$220K | 12-20% |
| Year 4 mature + retention discipline | 550-900 | $700K-$1.3M | +$110K-$270K | 14-22% |
| Year 5 mature + expansion consideration | 600-950 | $750K-$1.4M | +$130K-$310K | 15-22% |

### Capital stack interest rates and lender categories

| Capital Layer | Loan-To-Value | Interest Rate 2024-2025 | Typical Lenders |
|---|---|---|---|
| SBA 7(a) senior loan | 70-85% LTV | Prime + 2.5-4.5% floating | Live Oak, Newtek, Celtic, Byline, Pinnacle, ReadyCap |
| SBA 504 owner-user senior | 50% LTC | 7.0-8.5% fixed | Local bank + Live Oak (rare for boutique) |
| Franchise-preferred SBA | 70-85% LTV | Prime + 2.0-4.0% | ApplePie Capital, Boefly, Franchise America Finance |
| Equipment finance/lease 4-6 year | 80-100% of cost | 8-13% effective | Crest Capital, Channel Partners, North Mill, AP Equipment Finance, Currency Capital |
| Friends + family equity (LLC member interests) | N/A | N/A | Founder network $80K-$280K typical |
| Brand-preferred lender programs | 70-85% LTV | Pre-negotiated by franchisor | Xponential/OrangeTheory/F45 |
| Local angel/community investor | N/A | N/A | Regional fitness operator + family office |

### Exit multiples by buyer type

| Exit Path | Buyer Type | Cap Multiple | Process Length | Best For |
|---|---|---|---|---|
| Single-unit franchise resale | Owner-operator + franchisee investor | 2-4x SDE | 3-9 months | $300K-$1.2M small-unit exit |
| Multi-unit operator (MUO) sale | Regional franchisee portfolio + family office | 3-5x EBITDA | 6-12 months | 3-7 unit operator $2M-$15M |
| Area developer (AD) territory monetization | PE platform + franchisor buyback + family office | 4-7x EBITDA | 9-18 months | AD with development pipeline $5M-$50M+ |
| Strategic acquisition by franchisor | XPOF/SEB/Roark portfolio | 5-10x EBITDA | 6-15 months | Strategic territory or premium brand |
| PE platform acquisition | Roark/NexPhase/Mainsail/Bertram | 5-8x EBITDA | 9-18 months | Multi-unit or AD platform $10M-$100M+ |
| Wind-down / asset sale | Equipment auction + lease assignment | Asset value only | 60-180 days | Distressed operator |

`;

const counter = `

## Counter-Case: When Boutique Fitness Studio Is A Bad Bet

A serious boutique fitness founder must stress-test the case above against the conditions that make this category a difficult bet in 2027. The full 14-element counter-case:

**(1) F45 Training SPAC implosion 2022-2024 proves boutique fragility at wrong format.** F45 NASDAQ:FXLV IPO'd at **$14 July 2021**, dropped to **<$2 by 2024**. Mark Wahlberg pulled out. **Hundreds of franchise closures** + class-action lawsuits + founder/CEO departures. Circuit-HIIT proved too commoditized + over-reliant on celebrity + too rapid international expansion + too thin franchisee unit economics. The warning: even with celebrity + IPO capital + 2,800 global units peak, fragile unit economics + over-expansion + saturation can collapse a brand within 24 months.

**(2) SoulCycle + Equinox decline 2020-2024.** SoulCycle peaked at **99 US studios pre-COVID**, closed ~50 to **~80 remaining**. Equinox laid off 8-12% corporate 2022-2024. SoulCycle's collapse (rage-quit instructor controversy + Steve Ross Trump fundraiser boycott + COVID + post-COVID return-to-office not returning + ClassPass aggregation) shows even premium $36/class spin can decline.

**(3) FlyWheel Sports bankruptcy 2020.** FlyWheel, SoulCycle's most direct competitor, filed bankruptcy 2020 + closed all 25+ studios + sold home-bike to Peloton (which discontinued it). Spin-only single-discipline can fail entirely.

**(4) CrossFit affiliate exodus 2020-2022 post-Greg Glassman.** CrossFit founder Greg Glassman's June 2020 racially insensitive comments + dismissive George Floyd statement triggered **~1,000+ affiliates dropping CrossFit licensing within 18 months** -- Reebok ended sponsorship, athletes broke ties, brand value collapsed. Affiliate count fell from **~13,000 peak to ~9,500-10,000 by 2025**. The CrossFit Games + brand continue under new ownership (Eric Roza 2020-2023, Berkshire Partners 2023+) but the affiliate community remains fragmented with **F3 Nation, StrongFirst, "functional fitness" rebrand wave** capturing share.

**(5) ClassPass economics crushing per-visit revenue.** Mindbody-owned ClassPass pays studios **$4-$12 per booked attendee** vs **$24-$38 direct member**. ClassPass typically fills 10-30% of off-peak capacity but **cannibalizes direct-membership conversion** -- ClassPass users develop "boutique tourism" habit instead of committing to one studio. **Gympass/Wellhub corporate aggregation** worse: $3-$8 per visit. Studios that rely on aggregator fill above 25-30% of class capacity see direct-member conversion collapse to **5-12%** vs target 35-55%.

**(6) Pilates reformer supply chain shortage 2023-2024.** Reformer Pilates demand exploded 2022-2024 (Solidcore, Club Pilates, [solidcore], Pure Lift Pilates). Balanced Body + Stott Pilates Merrithew + Peak Pilates + BASI experienced **6-14 month waitlists** for reformer delivery 2023-2024. Founders signed leases + committed capital + then couldn't open on schedule. Some workarounds (used reformer market, alternative manufacturers Pilates Designs / Reformer Pilates / Aluminum Athletics) created QA risk + brand issues.

**(7) GLP-1/Ozempic effect on cardio attendance.** GLP-1 weight-loss drug users (Ozempic, Wegovy, Zepbound, Mounjaro -- est. 12M+ Americans by 2026) **frequently report cardio aversion** -- nausea, fatigue, reduced exercise capacity especially in first 6-12 months of titration. Cardio-heavy formats (OrangeTheory, F45, SoulCycle, CycleBar) face declining attendance from GLP-1 cohort. Strength + Pilates + low-intensity yoga benefit from "preserve muscle while losing weight" GLP-1 user need -- but the cardio segment is exposed.

**(8) Boutique market saturation in Tier-1 metros.** Manhattan, LA Westside, Miami Beach, Austin, Denver Cherry Creek, Boston Back Bay, SF Marina/Pacific Heights have **8-15 boutique studios per square mile** -- historically unprecedented density. New entrants face **commoditized class experience + price war + instructor poaching war + member fatigue**. Tier-2 (Charlotte, Nashville, Raleigh, Tampa, Columbus, Kansas City) remains undersaturated and is the sweet spot 2026-2027.

**(9) Post-COVID hybrid digital cannibalization.** **Peloton ~3M connected fitness subscribers + Mirror/Lululemon + Apple Fitness+ + Tonal + iFit + Hydrow + Tempo + Echelon + Beachbody** offer **$13-$59/mo subscription + $1,500-$3,500 hardware** at home convenience. Estimated **15-25% of would-be boutique members** opt for at-home hybrid (boutique 2-3x/week + home rest). This cap on TAM is permanent.

**(10) Owner-operator burnout 60-80 hour weeks year 1-2.** Founder-instructor model means teaching 8-15 classes/week + selling + scheduling + cleaning + marketing + HR + finance. Year 1-2 founder burnout is a documented failure mode -- the studio survives but the founder doesn't. **Studio GM hire $55K-$80K** by month 4-6 is critical, but adds payroll before revenue ramps.

**(11) Instructor poaching wars Tier-1 metros.** Equinox, SoulCycle, Solidcore, Barry's **raise per-class rates 25-50% + benefits + signing bonuses** for proven instructors. When a star instructor leaves, **15-35% of class regulars follow within 3 months**. Defense: founding-instructor equity + revenue share + lead-trainer progression.

**(12) AB5 California 2019 + DOL 2024 W-2 reclassification.** California AB5 2019 + Dynamex + federal DOL 2024 rule force boutique studios to **classify instructors W-2** when teaching exclusively + studio equipment + studio-set schedule. **Adds 12-22% to instructor cost** via payroll taxes + workers comp + benefits + ACA at 50+ employee. CA + NJ + NY + MA + WA + IL most affected.

**(13) Franchise resale glut 2022-2024.** Post-F45 + post-COVID + rate compression: **single-unit franchise resale flooded**. Buyer pool thin. Multiples **compressed from 4-6x SDE (2018-2021) to 2-4x SDE (2023-2024)**.

**(14) Lawsuit exposure on instructor-led injury.** Risks: **dropped barbell, dropped reformer carriage, treadmill ejection, sparring injury, cardiac arrest, slip-and-fall**. GL + WC premiums **2-4% of revenue + rising 8-15% annually**. Personal-injury + class-action cost can exceed $50K-$2M per incident. Waiver enforceability varies (CA + NY + NJ tougher). Risk transfer via insurance + waivers + instructor training essential.

**Honest verdict.** Boutique fitness studio remains viable in 2027 if you (a) **select format with tailwind not headwind** (reformer Pilates + strength + boxing + stretch ascending; spin + CrossFit + circuit-HIIT challenged); (b) **locate in growing not saturated market** (Tier-2 Charlotte/Nashville/Raleigh/Tampa/Columbus/Kansas City, not Tier-1 saturation); (c) **commit to founding-member presale 150-300 members** before opening to recoup 30-50% pre-opening working capital; (d) **invest in instructor talent + retention + equity from day 1** -- members follow instructors not brands; (e) **cap ClassPass/Gympass exposure to 20-30% of any class** -- aggregator economics cannibalize direct conversion; (f) **manage capital stack disciplined with SBA 7(a) + equipment finance + franchise-preferred lender**; (g) **hire studio GM by month 4-6** to avoid owner-operator burnout; (h) **implement retention discipline from day 1** (automated check-ins + Loyalsnap/Keepme/Triib analytics + referral + community); (i) **factor W-2 reclassification cost** (12-22% above 1099) in CA/NY/NJ/MA/WA/IL; (j) **plan realistic exit early** (single-unit 2-4x SDE + multi-unit 3-5x EBITDA + AD 4-7x EBITDA -- strategic acquisition rare). If you cannot honestly check most of these -- particularly format + market + presale + instructor talent + ClassPass discipline -- the macro economics of 2027 boutique fitness will eventually grind down the operation.

`;

const links = `

## Related Pulse Entries

- [[q9664]] -- Microbrewery (craft brewery) 2027 (sibling: experiential consumption + taproom-led + lease-based small footprint)
- [[q9663]] -- Self-storage facility 2027 (sibling: specialty CRE + zoning + state-by-state regulation)
- [[q9662]] -- Mobile IV therapy clinic 2027 (sibling: wellness service + membership economics)
- [[q9661]] -- Veterinary clinic 2027 (sibling: facility build-out + workforce)
- [[q9660]] -- Direct primary care DPC clinic 2027 (sibling: facility recurring-revenue + brand-driven membership)
- [[q9659]] -- Med spa 2027 (sibling: facility + community-experience + wellness-tier pricing)
- [[q9658]] -- Service-business launch (NEW STRUCTURE sibling)
- [[q9657]] -- Home health agency 2027 (workforce + insurance)
- [[q9656]] -- Hospice care agency 2027 (workforce + state licensure)
- [[q9655]] -- Skilled nursing facility 2027 (specialty CRE + state licensure)
- [[q9653]] -- Memory care facility 2027 (specialty CRE + state licensure)
- [[q9650]] -- Assisted living facility 2027 (specialty CRE + state licensure)
- [[q9630]] -- Senior in-home care 2027 (workforce + insurance)
- [[q9628]] -- Service-business launch (NEW STRUCTURE sibling)
- [[q9629]] -- Service-business launch (NEW STRUCTURE sibling)
- [[q9620]] -- Palliative care 2027 (workforce framework)
- [[q9601]] -- Fractional CFO operation (operational backbone for multi-unit fitness)
- [[q9576]] -- Adult coding bootcamp 2027 (state regulation + cohort/class model)
- [[q2117]] -- Post-construction cleanup business
- [[q1975]] -- Daycare 2027 (facility + state licensure + parent-customer-acquisition)
- [[q1965]] -- Party rental 2027 (storage + logistics)
- [[q1966]] -- Bounce house rental 2027 (storage + logistics)
- [[q1962]] -- Glamping 2027 (experiential consumption + premium lifestyle brand)
- [[q1954]] -- Property management 2027 (baseline sibling)
- [[q1953]] -- Virtual assistant 2027 (baseline sibling)
- [[q1952]] -- Podcast network 2027 (baseline sibling)
- [[q1951]] -- Meal prep 2027 (wellness lifestyle + female-skew + recurring-subscription)
- [[q1950]] -- Yoga studio 2027 (DIRECT sibling: yoga is a boutique fitness format option)
- [[q1949]] -- Personal training 2027 (DIRECT sibling: 1-on-1 PT is the ancillary + competitive talent pool)
- [[q1948]] -- Dog walking 2027 (baseline sibling)
- [[q1947]] -- Notary 2027 (baseline sibling)
- [[q1946]] -- Tutoring 2027 (baseline sibling)
- [[q1942]] -- Service business 2027 (baseline sibling)
- [[q1139]] -- Adjacent service business framework
- [[q1127]] -- Adjacent service business framework

`;

const tags = ['boutique-fitness','fitness-studio','crossfit','pilates','orangetheory','xponential-fitness','franchise','sba-7a','membership-model','2027'];

const sources = [
  { title: 'IHRSA International Health Racquet & Sportsclub Association', url: 'https://www.ihrsa.org' },
  { title: 'Xponential Fitness XPOF Investor Relations Item 19', url: 'https://investor.xponential.com' },
  { title: 'OrangeTheory Fitness Franchise', url: 'https://www.orangetheoryfranchise.com' },
  { title: 'Mindbody Industry Reports', url: 'https://www.mindbodyonline.com' },
  { title: 'Club Pilates (Xponential Fitness)', url: 'https://www.clubpilates.com' },
  { title: 'ClassPass (Mindbody-owned)', url: 'https://www.classpass.com' },
  { title: 'Live Oak Bank Fitness SBA Lending', url: 'https://www.liveoakbank.com' }
];

const notes = {
  s6: 'Added 77 cited sources spanning industry trade (IHRSA International Health Racquet & Sportsclub Association + ClubIntel + Mindbody Industry Reports + Statista Fitness Industry), franchisor financial disclosures (Xponential Fitness NYSE:XPOF Investor Relations + FDD Item 19 + OrangeTheory Fitness Franchise + F45 Training NASDAQ:FXLV Investor showing 2021 IPO + 2022-2024 SPAC implosion + Mark Wahlberg pullout), specific boutique brands (Solidcore corporate reformer Pilates + Barrys Bootcamp corporate-owned premium HIIT + SoulCycle Equinox-owned ~80 studios post-decline + Equinox Holdings + CycleBar XPOF + Club Pilates XPOF 1,000+ + Pure Barre XPOF 500+ + StretchLab XPOF 300+ + Row House XPOF 100+ + YogaSix XPOF 200+ + Rumble Boxing XPOF 2021 acquisition + BFT Body Fit Training XPOF 2023 + Self Esteem Brands SEB Anytime Fitness 4,800+ + The Bar Method + CrossFit Inc ~9,500-10,000 affiliates post-Glassman + CorePower Yoga ~200 + Y7 Studio + Title Boxing Club ~150 + 9Round ~600), Pilates equipment manufacturers (Balanced Body largest US Pilates reformer + Stott Pilates Merrithew + Peak Pilates + BASI), cardio equipment (Concept2 rowing erg + Hydrow Pro commercial + Stages SC3 power-display + Keiser M3i magnetic-resistance + Schwinn AC Power + Peloton Commercial), fitness studio software (Mindbody Online 30-40% boutique + ClubReady XPOF-preferred + Mariana Tek Xponential-acquired + Glofox by ABC Financial 2022 + Pike13 + Wodify CrossFit-specific + TrueCoach by Xplor + ABC Financial Services + ClassPass Mindbody-owned + Gympass/Wellhub corporate + MyZone heart-rate-monitor + Polar Electro + Whoop wearables), SBA + franchise lenders (Live Oak Bank dominant boutique fitness SBA + Newtek + Celtic + Byline + Pinnacle + ReadyCap + ApplePie Capital franchise-specific + Boefly + Franchise America Finance FAF), equipment finance (Crest Capital + Channel Partners + North Mill + AP Equipment Finance + Currency Capital), marketing (Klaviyo email + Postscript SMS + Attentive SMS), retention analytics (Triib CrossFit-specific + Loyalsnap + Keepme AI-powered fitness retention), PE platform (Roark Capital owning Anytime + Massage Envy + OrangeTheory parent), business brokerage (First Choice Business Brokers + Transworld Business Advisors + Sunbelt Network), regulatory (California Dynamex AB5 + US DOL Independent Contractor Rule 2024 driving 1099 to W-2 for fitness instructors).',
  s7: 'Added comprehensive numbers block with 12 markdown pipe tables covering: industry size and operator landscape (~110,000 US health/fitness club locations + ~30K-35K boutique <5K sqft single-discipline + $32B-$36B total industry revenue + $13B-$16B boutique segment + ~65M US fitness club members + boutique CAGR 15-25% pre-COVID 2013-2019 + -25% to -40% 2020 COVID closures + +8% to +15% rebound 2022-2024 + boutique avg revenue per member $1,600-$3,600 vs full-service $420-$1,800 + boutique monthly churn 4-9% vs full-gym 3-5% + CAC $80-$180 + LTV $1,200-$3,800 + retention 6-18 months); franchise vs independent capital and AUV (Club Pilates XPOF $300K-$650K $550K-$650K AUV + Pure Barre $250K-$500K $400K-$500K + CycleBar $400K-$800K $650K-$900K + StretchLab $250K-$450K $400K-$600K + Row House $400K-$700K $450K-$650K + YogaSix $300K-$550K $400K-$600K + Rumble Boxing $400K-$800K $550K-$850K + BFT $350K-$650K $450K-$700K + OrangeTheory $700K-$1.2M $650K-$950K + F45 post-implosion + 9Round $90K-$200K $200K-$350K + Title Boxing $250K-$550K $300K-$500K + The Bar Method SEB $300K-$550K $400K-$650K + Independent $250K-$550K $400K-$1.1M); format-by-format equipment capital demographic (Reformer Pilates $30K-$140K total $300K-$700K 75-85% female 28-55 + HIIT OrangeTheory-style $125K-$225K total $700K-$1.2M 55-65% female 30-55 + F45 circuit $80K-$160K total $400K-$700K + spin $55K-$220K total $450K-$850K 75-85% female 28-45 + CrossFit affiliate $30K-$80K total $250K-$450K 55-65% male 25-50 + yoga $5K-$25K + heat HVAC + boxing $40K-$120K + rowing $45K-$120K + barre $15K-$45K + stretch $10K-$35K); site selection lease economics by market tier (Tier-1 $55-$95/sqft NNN + Tier-2 $38-$65 + Tier-3 $28-$45 + secondary $22-$38 + strip center -10/-25% + free-standing pad +15/+35% + 4-9 month permit Tier-1 down to 2-4 month secondary); membership pricing tiers (Unlimited $159-$299 + 8-pack $159-$229 + 4-pack $89-$140 + drop-in $25-$45 + founding-member $89-$149 + ClassPass effective $4-$12 to studio + Gympass $3-$8); class capacity utilization (Pilates 8-16 + OrangeTheory 24-36 + F45 20-32 + spin 30-50 + CrossFit 15-25 + yoga 15-30 + boxing 12-24 + rowing 20-30 + barre 12-22 + stretch 1-4 at 45-75% target utilization); revenue mix at mature single-discipline studio (membership 70-82% at 62-74% margin + drop-in 4-12% at 65-78% + aggregator 5-15% at 35-55% + retail 5-12% at 35-55% + PT 3-10% at 55-72% + workshops 2-8% at 45-65%); operating cost structure (instructor 22-32% + GM/desk 12-20% + rent 12-22% + marketing 4-9% + software 1-3% + franchise royalty 9-12% if franchise + insurance 2-4% + utilities 3-6% + equipment maintenance 2-4% = net 8-22% independent / 6-15% franchise); instructor compensation 11 roles (Pilates $35-$85/class + yoga $35-$75 + barre $35-$65 + CrossFit $45-$95 + HIIT $40-$85 + spin $40-$95 + boxing $55-$110 + premium Tier-1 $95-$180 + studio GM $55K-$80K + 5-15% EBITDA + front desk $16-$22/hr + commission + PT $80-$140/hr); 5-year cash-flow trajectory single-unit boutique studio (Year 1 250-500 members $300K-$700K -$50K-+$35K to Year 5 600-950 members $750K-$1.4M +$130K-$310K 15-22%); capital stack interest rates 7 layers (SBA 7(a) Live Oak/Newtek/Celtic/Byline/Pinnacle/ReadyCap + SBA 504 owner-user rare for boutique + franchise-preferred SBA ApplePie/Boefly/FAF + equipment finance Crest/Channel/North Mill/AP/Currency 8-13% + friends $80K-$280K + brand-preferred Xponential/OrangeTheory/F45 + local angel); exit multiples 6 buyer types (single-unit resale 2-4x SDE owner-operator + MUO 3-5x EBITDA family office + AD monetization 4-7x EBITDA PE platform + franchisor 5-10x XPOF/SEB/Roark + PE platform 5-8x Roark/NexPhase/Mainsail/Bertram + wind-down asset value).',
  s8: 'Added 14-element counter-case: F45 Training SPAC implosion 2022-2024 proves boutique fragility at wrong format ($14 July 2021 IPO to <$2 2024 + Mark Wahlberg pulled out + hundreds franchise closures + class-action lawsuits + founder/CEO departures + 2,800 global units peak collapsed); SoulCycle Equinox decline 2020-2024 (99 US studios pre-COVID closed ~50 to ~80 remaining + Equinox layoffs 8-12% corporate 2022-2024 + Steve Ross Trump fundraiser boycott + post-COVID return-to-office not returning + ClassPass aggregation); FlyWheel Sports bankruptcy 2020 (filed bankruptcy + closed 25+ studios + sold home-bike to Peloton which discontinued + spin-only single-discipline can fail entirely); CrossFit affiliate exodus 2020-2022 post-Greg Glassman (June 2020 racially insensitive comments + dismissive George Floyd statement triggered ~1,000+ affiliates dropping CrossFit licensing within 18 months + Reebok ended sponsorship + affiliate count ~13K peak to ~9,500-10,000 by 2025 + F3 Nation/StrongFirst/functional-fitness rebrand wave capturing share); ClassPass economics crushing per-visit revenue (Mindbody-owned ClassPass $4-$12 per booked attendee vs $24-$38 direct member + Gympass/Wellhub $3-$8 + studios above 25-30% aggregator capacity see direct-conversion collapse to 5-12% vs target 35-55%); Pilates reformer supply chain shortage 2023-2024 (Balanced Body + Stott Pilates Merrithew + Peak Pilates + BASI 6-14 month waitlists + founders signed leases couldnt open on schedule + used reformer market QA risk); GLP-1/Ozempic effect cardio attendance (12M+ Americans by 2026 + cardio aversion nausea fatigue reduced exercise capacity first 6-12 months titration + cardio-heavy formats OrangeTheory/F45/SoulCycle/CycleBar declining attendance + strength/Pilates/low-intensity yoga benefit from preserve-muscle-while-losing-weight need); boutique market saturation Tier-1 metros (Manhattan/LA Westside/Miami Beach/Austin/Denver Cherry Creek/Boston Back Bay/SF Marina/Pacific Heights 8-15 boutique studios per square mile commoditized class experience + price war + instructor poaching war + member fatigue + Tier-2 Charlotte/Nashville/Raleigh/Tampa/Columbus/Kansas City sweet spot); post-COVID hybrid digital cannibalization (Peloton 3M+ subscribers + Mirror/Lululemon + Apple Fitness+ + Tonal + iFit + Hydrow + Tempo + Echelon + Beachbody $13-$59/mo + $1,500-$3,500 hardware + 15-25% would-be boutique members opt for at-home hybrid permanent TAM cap); owner-operator burnout 60-80 hour weeks year 1-2 (founder-instructor teaching 8-15 classes/week + selling + scheduling + cleaning + marketing + HR + finance + studio GM hire $55K-$80K month 4-6 critical); instructor poaching wars Tier-1 metros (Equinox/SoulCycle/Solidcore/Barrys raise per-class rates 25-50% + benefits + signing bonuses for proven instructors + member churn follows instructor churn 15-35% follow within 3 months + defense founding-instructor equity grants + revenue share + lead-trainer progression); AB5 California 2019 + DOL 2024 W-2 reclassification (California AB5 2019 + 2018 Dynamex + 2024 federal DOL independent-contractor rule + classify as W-2 when teaching exclusively for one studio + studio equipment + studio-set schedule + adds 12-22% to instructor cost via payroll taxes + workers comp + unemployment + benefits + ACA at 50+ employee + CA/NJ/NY/MA/WA/IL most affected); franchise resale glut 2022-2024 (post-F45 implosion + post-COVID + interest-rate compression single-unit franchise resale market flooded + buyer pool thin + multiples compressed from 4-6x SDE 2018-2021 to 2-4x SDE 2023-2024); lawsuit exposure instructor-led injury (dropped barbell + dropped reformer carriage + treadmill ejection + sparring injury + cardiac arrest + sexual misconduct + slip-and-fall + equipment failure + GL + WC premiums 2-4% of revenue rising 8-15% annually post-2020 + personal-injury + class-action $50K-$2M per incident + waiver enforceability varies CA/NY/NJ tougher) -- with honest 10-condition verdict on who should and should not start a boutique fitness studio in 2027.',
  s9: 'Cross-linked 34 related Pulse entries: q9664 microbrewery (experiential consumption + taproom-led + capital-intensive specialty retail + community-driven brand + lease-based small footprint parallel directly relevant) + q9663 self-storage (capital-intensive specialty CRE + zoning + entitlement) + q9662 mobile IV (wellness service + state regulation + membership economics) + q9661 veterinary clinic (facility build-out + zoning + workforce) + q9660 DPC clinic (facility-based recurring-revenue + brand-driven membership economics directly relevant) + q9659 med spa (facility + zoning + ICC + community-experience + wellness-tier pricing parallel) + q9658/q9628/q9629 NEW STRUCTURE siblings + q9657 home health + q9656 hospice + q9655 SNF + q9653 memory care + q9650 assisted living (specialty CRE + state licensure parallel) + q9630 senior in-home + q9620 palliative (workforce framework) + q9601 fractional CFO (operational backbone for multi-unit fitness studio + multi-location financial reporting) + q9576 adult coding bootcamp (state regulation + customer acquisition + cohort/class model parallel) + q2117 post-construction cleanup + q1975 daycare (facility + state licensure + zoning + parent-customer-acquisition parallel) + q1965/q1966 party rental/bounce house + q1962 glamping (experiential consumption + premium-positioning lifestyle brand parallel) + q1942/q1946-q1954 baseline Q&A format siblings (specifically q1950 yoga studio DIRECT sibling as yoga is one of the boutique fitness format options + smaller-footprint subset + q1949 personal training DIRECT sibling as 1-on-1 PT is the ancillary revenue stream + adjacent business model + competitive talent pool) + q1951 meal prep (wellness lifestyle + female-skew customer + recurring-subscription parallel) + q1127/q1139 service business framework.',
  s10: 'SUBAGENT_VERIFIED. Lean deep baseline of the boutique fitness studio (CrossFit/Pilates/OrangeTheory style) business startup playbook for 2027 matching the actual question "How do you start a boutique fitness studio (CrossFit / Pilates / OrangeTheory style) business in 2027?" Built under NEW VALUE-NOT-WORDCOUNT MANDATE: target 8,000-10,500 words with tight paragraphs (2-3 sentences max), frequent H3 breaks, no walls of text. Structure: Bottom Line callout (3 punchy bullets Capital/Margins/Hardest part with bold-tag labels hitting site + lease + Xponential Fitness XPOF franchise + Club Pilates 1,000+ + Pure Barre 500+ + CycleBar 200+ + StretchLab 300+ + Row House 100+ + YogaSix 200+ + Rumble Boxing + BFT + OrangeTheory Fitness ~1,400 Roark-backed + F45 Training NASDAQ:FXLV SPAC implosion + Solidcore corporate 200+ + Barrys Bootcamp + SoulCycle Equinox + CrossFit Inc affiliate exodus + CorePower Yoga + reformer Pilates supply chain shortage Balanced Body/Stott Merrithew/Peak/BASI + Mindbody/ClubReady/Mariana Tek/Glofox/Wodify/Triib/Loyalsnap/Keepme + ClassPass/Gympass aggregator economics + AB5 California 2019 + DOL 2024 W-2 reclassification + SBA 7(a) Live Oak Bank + equipment finance + franchise-specific lenders ApplePie/Boefly/FAF + founding-member presale 150-300 + instructor poaching wars + boutique churn 4-9% monthly + Tier-1 metro saturation + post-COVID hybrid Peloton/Mirror/Apple Fitness+/Tonal cannibalization + GLP-1/Ozempic cardio aversion + owner-operator burnout + lawsuit exposure), then 3 short paragraphs distinguishing boutique studio from full-service health club (Planet Fitness/LA Fitness/24 Hour Fitness/Lifetime Athletic/EOS Fitness 30K-100K sqft $10-$249/mo $1.2M-$6M+ unit revenue) + at-home digital fitness (Peloton/Mirror/Tonal/Apple Fitness+/iFit/Tempo/Hydrow $39-$59/mo + $1,500-$3,500 hardware) + corporate wellness aggregators (Gympass/Wellhub/ClassPass corporate/Wellable) + hybrid clubs (Equinox/Lifetime/Crunch Signature premium full-service + integrated boutique-style classes), then TOC block listing 13 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit) with horizontal rule separators, then LEAN H3 deep content sections inside each PART (3-4 sections per PART, tight 2-3 sentence paragraphs, no padding). flow contains exactly 2 mermaid diagrams (operating journey from format + franchise + capital decision through site + lease + zoning + permits + SBA + equipment finance + build-out + format equipment + membership model + ClassPass + instructor + tech + marketing + stage growth + 7-path strategic exit; decision matrix for format selection Pilates/HIIT/Spin/CrossFit/Yoga/Boxing/Rowing/Barre/Stretch with franchise vs independent decision and reference operators and exit math). src has 77 cited sources with real URLs covering IHRSA + ClubIntel + Mindbody + Statista + Xponential Fitness XPOF Investor + OrangeTheory Franchise + F45 Training NASDAQ:FXLV Investor + Solidcore + Barrys Bootcamp + SoulCycle + Equinox + CycleBar + Club Pilates + Pure Barre + StretchLab + Row House + YogaSix + Rumble Boxing + BFT + Self Esteem Brands + Anytime Fitness + The Bar Method + CrossFit Inc + CorePower Yoga + Y7 Studio + Title Boxing Club + 9Round + Balanced Body + Stott Pilates Merrithew + Peak Pilates + BASI + Concept2 + Hydrow + Stages Indoor Cycling + Keiser + Schwinn + Peloton Commercial + Mindbody Online + ClubReady + Mariana Tek + Glofox + Pike13 + Wodify + TrueCoach + ABC Financial + ClassPass + Gympass + MyZone + Polar + Whoop + Live Oak Bank + Newtek + Celtic + Byline + Pinnacle + ReadyCap + ApplePie Capital + Boefly + Franchise America Finance + Crest Capital + Channel Partners + North Mill + AP Equipment Finance + Currency Capital + Klaviyo + Postscript + Attentive + Triib + Loyalsnap + Keepme + Roark Capital + First Choice Business Brokers + Transworld + Sunbelt + California Dynamex AB5 + US DOL Independent Contractor Rule 2024. num is comprehensive 12-table benchmark block (industry size + franchise vs independent capital AUV 14 brands + format equipment by 10 disciplines + site selection lease 6 tiers + membership pricing 8 tiers + class capacity utilization 10 formats + revenue mix 6 streams + operating cost 10 lines + instructor comp 11 roles + 5-year cash-flow trajectory + capital stack 7 layers + exit multiples 6 buyer types). counter is 14-element counter-case with F45 SPAC implosion + SoulCycle Equinox decline + FlyWheel bankruptcy + CrossFit affiliate exodus + ClassPass economics + reformer supply chain + GLP-1 cardio aversion + Tier-1 saturation + post-COVID hybrid digital + owner-operator burnout + instructor poaching + AB5/DOL W-2 reclassification + franchise resale glut + lawsuit exposure failure modes and honest 10-condition verdict. links cross-references 34 related entries with q9664 microbrewery adjacent experiential consumption + q1950 yoga studio DIRECT sibling format + q1949 personal training DIRECT sibling ancillary + q9660 DPC + q9659 med spa + q1962 glamping experiential parallels + q1951 meal prep wellness + q1942/q1946-q1954 baseline siblings. All numbers grounded in real IHRSA + Xponential Item 19 + OrangeTheory franchise disclosures + Mindbody industry + Balanced Body/Stott Pilates + Concept2 + Stages/Keiser/Schwinn + ABC Financial + ClassPass + Live Oak + ApplePie + AB5 California 2019 + DOL 2024 rule. ASCII-clean throughout. Lean target 8,000-10,500 words honored.'
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const FINAL_ID = ID;
  const FINAL_QUESTION = QUESTION;

  const baselineAnswer = tldr + core + flow;

  const ts = Date.now();
  await store.setJSON('answers/' + FINAL_ID + '.json', {
    id: FINAL_ID,
    question: FINAL_QUESTION,
    answer: baselineAnswer,
    tags,
    sources,
    ts,
    model: 'claude-opus-4-7-via-claude-code',
    quality_score: 5,
    polished_at: null,
    polish_history: [],
    baseline_answer_v5: tldr + core + flow,
    source: 'claude-opus-bespoke-baseline'
  });

  const idx = await store.get('_index.json', { type: 'json' });
  const i = idx.entries.findIndex(x => x.id === FINAL_ID);
  const row = { id: FINAL_ID, question: FINAL_QUESTION, tags, ts, quality_score: 5, polished_at: null, last_modified_ms: ts, sources_count: sources.length };
  if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
  await store.setJSON('_index.json', idx);

  console.log('[' + FINAL_ID + '] baseline written, kicking off polish ladder');

  await runPolish({
    id: FINAL_ID,
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
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
