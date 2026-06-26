// q9663 -- How do you start a self-storage facility business in 2027?
// Non-climate or climate-controlled storage real estate -- distinct from moving services and valet storage (Clutter)
// NEW MANDATE: VALUE over WORD COUNT. Target 8,000-10,500 words. Tight paragraphs.
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

const ID = 'q9663';
const QUESTION = 'How do you start a self-storage facility business in 2027?';

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** **$1.8M-$4.5M** rural/tertiary-market drive-up conversion or small ground-up (3-5 acres land $150K-$600K + 30K-50K rentable sqft single-story drive-up at $45-$75/sqft + paving + fencing + gate + Janus smart-entry + SiteLink/Storable software + signage + Class III environmental + civil engineering + zoning + 12-24 month entitlement); **$4.5M-$9M** suburban primary-market drive-up + partial climate-controlled mix (5-10 acres $400K-$1.2M + 50K-80K rentable sqft hybrid build at $55-$110/sqft); **$9M-$22M+** infill multi-story climate-controlled in top-50 MSA (2-5 acre site $750K-$3.5M + 70K-110K rentable sqft 3-4 story at $90-$160/sqft + elevators + HVAC + ICC + sprinkler + 18-36 month entitlement-to-CO); **$300K-$750K** to acquire third-party management contract on existing facility (Extra Space TPM, CubeSmart TPM, NSA, Storage Asset Management, Absolute Storage). Expect **18-36 months from LOI to certificate of occupancy** on ground-up and **18-36 months lease-up to stabilized 90-94% physical occupancy** at typical $0.80-$2.50/rentable-sqft/mo street rate.
> - **[Margins]** Mature stabilized facility: **30-35% operating expense ratio**, **65-70% NOI margin**, **5.5-7.5% cap rate** on top-25 MSA stabilized (PSA/EXR/CUBE comparable), **6.5-8.5% cap rate** secondary, **8-11% cap rate** tertiary/rural -- targeting **8-11% levered IRR** over 7-10 year hold per Inside Self-Storage + SSA + Green Street + Marcus & Millichap + JLL self-storage benchmarks. Revenue per available foot (RevPAF) **$10-$26 annually** primary MSA, **$7-$14** secondary, **$5-$10** tertiary. ECRI (Existing Customer Rate Increases) drives 30-55% of same-store revenue growth at PSA/EXR/CUBE -- the dominant operator economic lever invisible to first-time underwriters. Tenant insurance attach **65-85% at $11-$22/mo** generates $1.50-$3.50 per occupied sqft annually via SBOA Tenant Insurance + Bader Company + Ponderosa programs.
> - **[Hardest part]** **Site selection + zoning + entitlement risk + supply/demand discipline** (not capital, not construction) -- specifically the **3-mile/5-mile/10-mile rentable-sqft-per-capita supply test** (Radius+ + Union Realtime + Yardi Matrix + STR benchmarks: oversupplied if >9-10 sqft/capita in 3-mile primary or >7-8 in secondary), **NIMBY pushback in residential-adjacent and downtown infill** (San Francisco moratorium 2018-ongoing + Boulder + Seattle 2020-2024 + Pasadena + many CA/CO/WA municipal restrictions), **industrial M-1/M-2 zoning + self-storage overlay districts** vs special-use-permit (SUP) variances, **Sun Belt oversupply hangover 2022-2026** (FL/TX/AZ/NV/GA new construction wave 2017-2022 still digesting), **construction cost inflation +28-45% 2020-2024 per ENR + Turner + Mortenson** compressing development yield-on-cost from historical 8.5-10% target to 6.5-8% achievable, **cap-rate compression 2018-2022 reversing 2023-2025** with rates moving 75-150bps wider repricing existing portfolios down, **insurance premium increases +30-60% 2023-2025** especially tornado/hurricane-exposed Sun Belt, **REIT consolidation** (Extra Space + Life Storage merger 2023 created ~3,800-facility EXR; PSA + Simply SSI; CubeSmart + Storage West) closing acquisition arbitrage, and **discount-rate-platform pricing wars** (SpareFoot + Storable Marketplace) eroding first-month-free + reservation-fee competitive moats once held by REITs.

A **self-storage facility business** in 2027 is a **commercial real estate asset class** -- you are developing, acquiring, or operating a **fenced, gated, individually-padlocked self-service rental storage compound** with **non-climate-controlled drive-up units (single-story rows of garage-style metal doors)** and/or **climate-controlled units (interior corridor multi-story building with HVAC at 55-80°F and 30-50% humidity)** rented month-to-month to **household/residential tenants (75-85% of demand) + small-business tenants (15-25%, often e-commerce inventory + contractor tools + medical/legal records)** at typical **5x5 / 5x10 / 10x10 / 10x15 / 10x20 / 10x30 unit sizes plus vehicle/RV/boat parking**. Distinct from **moving services** (interstate van line + local mover with Class A/B truck + DOT/FMCSA hours of service + workers comp dominant), **valet storage like Clutter or MakeSpace** (operator-mediated pickup + warehouse storage + delivery app on demand), **records-management storage** (Iron Mountain commercial document custody with audit/retention compliance), and **portable container storage** (PODS + 1-800-PACK-RAT + Smartbox steel container delivered/picked-up). Self-storage sits at the **passive-real-estate, low-labor, high-stabilized-margin, REIT-traded, cap-rate-priced** end of the storage spectrum -- closer in financial structure to a strip-center or multifamily property than to a service business.

The honest 2027 demand reality: total US self-storage inventory **~2.1B-2.3B rentable sqft across ~52,000-60,000 facilities** per Self-Storage Association (SSA) + Inside Self-Storage + Yardi Matrix + STR + Radius+. Industry revenue **$28B-$32B 2024** per SSA + Green Street. **~11-12% of US households use self-storage** -- the highest penetration globally and roughly 2-3x European/Asian rates. Roughly **80-85% of US facilities are owned by single-asset or small-portfolio (<10 facility) independent operators** with **15-20% controlled by the 4 public REITs + top-50 private operators** (Public Storage NYSE: PSA ~3,000 facilities, Extra Space Storage NYSE: EXR ~3,800 post-Life Storage merger 2023, CubeSmart NYSE: CUBE ~1,500, National Storage Affiliates NYSE: NSA ~1,000, plus Prime Storage, StorageMart, MetroStorage, U-Haul Self-Storage division, William Warren Group, Westport Properties, SROA Capital). Demand drivers: household formation + interstate migration (Sun Belt continuing 2025-2027 despite slowdown) + downsizing (Boomer + Silent Gen aging-in-place transitions) + e-commerce small-business inventory + remote-work home-office encroachment displacing residential storage + lifestyle/RV/boat parking + climate-controlled wine/records premium. Counter-pressures: Sun Belt oversupply 2022-2026 hangover + REIT consolidation + construction cost inflation + insurance premium increases + municipal moratoriums + cap-rate compression reversal + ECRI consumer fatigue + discount-platform pricing wars.

Five things that determine whether a self-storage developer or operator survives years 1-5: **(1) Site selection + 3/5/10-mile demand/supply test + zoning entitlement risk**; **(2) Format selection (drive-up vs climate-controlled vs hybrid) matched to MSA economics + construction cost discipline**; **(3) Lease-up velocity + revenue management discipline (ECRI + rate optimization + tenant insurance attach)**; **(4) Capital stack (SBA 504 owner-user vs CMBS stabilized vs bridge lease-up vs construction loan 65-70% LTC) + interest-rate sensitivity**; **(5) Exit positioning (independent sale to local operator vs REIT acquisition vs third-party management transition vs portfolio aggregation for institutional sale)**.

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & self-storage vs moving vs valet vs records vs portable container](#market-size--self-storage-vs-moving-vs-valet-vs-records-vs-portable-container)
- [Demand drivers, REIT landscape & private operator ecosystem](#demand-drivers-reit-landscape--private-operator-ecosystem)
- [Site selection, 3/5/10-mile supply test, zoning & entitlement risk](#site-selection-3510-mile-supply-test-zoning--entitlement-risk)

**Part 2 -- Build-Out & Capital**
- [Format selection: drive-up, climate-controlled, hybrid & multi-story infill](#format-selection-drive-up-climate-controlled-hybrid--multi-story-infill)
- [Construction cost stack, ICC/ADA compliance & development timeline](#construction-cost-stack-iccada-compliance--development-timeline)
- [Capital stack: SBA 504, CMBS, bridge debt, construction loans & equity sources](#capital-stack-sba-504-cmbs-bridge-debt-construction-loans--equity-sources)

**Part 3 -- Operations**
- [Unit mix, pricing, ECRI revenue management & tenant insurance economics](#unit-mix-pricing-ecri-revenue-management--tenant-insurance-economics)
- [Management software, smart entry, security & operations stack](#management-software-smart-entry-security--operations-stack)
- [Third-party management vs self-operated & on-site vs remote operations](#third-party-management-vs-self-operated--on-site-vs-remote-operations)
- [Marketing: SpareFoot/Storable Marketplace, Google LSA, organic & B2B contractor channel](#marketing-sparefootstorable-marketplace-google-lsa-organic--b2b-contractor-channel)

**Part 4 -- Growth & Exit**
- [Lease-up trajectory, stabilization milestones & portfolio scaling](#lease-up-trajectory-stabilization-milestones--portfolio-scaling)
- [Exit math: REIT acquisition, private buyer, portfolio aggregation & 1031 path](#exit-math-reit-acquisition-private-buyer-portfolio-aggregation--1031-path)
- [Counter-case: oversupply, cap-rate reversal, insurance inflation & municipal moratoriums](#counter-case-oversupply-cap-rate-reversal-insurance-inflation--municipal-moratoriums)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & self-storage vs moving vs valet vs records vs portable container

A self-storage facility is a **commercial real estate asset** -- a fenced, gated, gate-coded compound of individually-padlocked rental storage units leased month-to-month to household and small-business tenants. The asset class sits in the **specialty CRE category** alongside data centers, manufactured housing, and life-science labs.

US self-storage inventory **~2.1B-2.3B rentable sqft across ~52,000-60,000 facilities** per SSA + Inside Self-Storage + Yardi Matrix + STR + Radius+. Industry revenue **$28B-$32B 2024**. Per-capita inventory **~6.5-7.0 rentable sqft per person** -- highest globally. **~11-12% of US households use self-storage**, roughly **35-42 million Americans** at any given moment.

Adjacent storage formats structurally distinguished: **(1) Self-storage (this entry)** passive CRE, $1.8M-$22M+ capital, 30-35% opex ratio, 5.5-11% cap rates by tier. **(2) Moving services** Class A/B truck + DOT/FMCSA + workers comp + Mayflower/United/Allied van line affiliation -- service business not real estate. **(3) Valet storage (Clutter [acquired by IronMountain 2024], MakeSpace [shut down 2023], Stuf, Trove)** operator-mediated pickup + warehouse + delivery app -- venture-funded service model, mostly unprofitable. **(4) Records management (Iron Mountain NYSE: IRM, Recall, Access)** commercial document custody with audit/retention compliance + climate + fire suppression. **(5) Portable container (PODS, 1-800-PACK-RAT, Smartbox, U-Box)** steel container delivered to customer driveway, picked up and warehoused. **(6) Industrial small-bay flex (Iron Mountain Outdoor Storage, IOS)** vehicle/contractor outdoor parking -- adjacent asset class growing 2023-2026.

Revenue model: **~85-92% rental income + 5-12% tenant insurance commission + 1-4% late fees + administrative fees + lock/box retail + truck rental kickback (U-Haul affiliate)**. Payment is month-to-month auto-pay credit/ACH, no annual leases, easy entry/exit -- the structural feature that lets self-storage outperform other CRE in recessions (PSA + EXR same-store revenue stayed positive 2008-2010 while office + retail collapsed).

### Demand drivers, REIT landscape & private operator ecosystem

Self-storage demand drivers fall into four buckets: **(1) Disruption events** (death + divorce + downsizing + dislocation -- "4 D's" industry shorthand), **(2) Lifestyle/recreational** (RV/boat/motorcycle + holiday decor + sports gear), **(3) Small-business inventory** (e-commerce + contractor tools + medical/legal records + sample/showroom storage), **(4) Aging demographics** (Boomer + Silent Gen downsizing as housing footprint shrinks). The **household formation + interstate migration tailwind** (Sun Belt Florida + Texas + Arizona + Nevada + Carolinas continuing 2025-2027 despite cooling) is the dominant macro driver.

**Public REIT landscape (4 majors + 1 mid-cap):** **Public Storage (NYSE: PSA)** ~3,000 facilities + 218M rentable sqft + $47B-$58B market cap depending on rate cycle -- the dominant brand, oldest (founded 1972), highest ECRI discipline. **Extra Space Storage (NYSE: EXR)** ~3,800 facilities post-Life Storage merger 2023 ($12.7B deal) + 280M rentable sqft + $35B-$45B market cap -- merged-entity scale, third-party management leader (~$8B AUM). **CubeSmart (NYSE: CUBE)** ~1,500 facilities + 105M sqft + $9B-$12B market cap -- mid-cap focus on top-25 MSA. **National Storage Affiliates (NYSE: NSA)** ~1,000 facilities + 60M sqft + $4B-$6B market cap -- "Participating Regional Operator" partnership structure (Personal Mini Storage + Optivest + Northwest Self Storage + Move It).

**Private operator ecosystem:** Prime Storage (~280 facilities, Blackstone backing), StorageMart (~250 facilities, founded 1999 in Columbia MO), MetroStorage (~140), U-Haul Self-Storage Division (~1,500 facilities tied to U-Haul truck rental network), William Warren Group (~190 StorQuest-branded), Westport Properties (~100), SROA Capital (~100+), Strat Storage Holdings, Reliant Real Estate Management, Andover Properties, Heitman Self-Storage. Independent single-asset and small-portfolio operators control **~80-85% of US facility count**.

### Site selection, 3/5/10-mile supply test, zoning & entitlement risk

Site selection is the **single biggest determinant of long-term facility economics**. Get it wrong and no amount of operational excellence can rescue the investment.

**The supply test is non-negotiable.** Pull a **3-mile, 5-mile, and 10-mile rentable-sqft-per-capita analysis** via Radius+ (the industry-standard tool), Union Realtime, Yardi Matrix, or STR Self-Storage. Industry rule of thumb: **oversupplied if >9-10 sqft/capita in 3-mile primary urban**, **>7-8 in suburban**, **>5-6 in rural/tertiary**. The Sun Belt 2017-2022 construction wave pushed many submarkets in FL/TX/AZ/NV/GA to **12-16 sqft/capita** -- still digesting through 2026.

**Zoning typically requires industrial M-1/M-2 designation** or self-storage-specific overlay districts. Many municipalities have created **self-storage-overlay zones** to permit by-right in industrial corridors while restricting residential-adjacent infill. Where industrial zoning is unavailable, a **special-use permit (SUP) or conditional-use permit (CUP)** with public hearing + planning commission + city council approval is required -- adding **6-18 months to entitlement timeline** and **20-40% probability of NIMBY-driven denial** in residential-adjacent or downtown infill contexts.

**NIMBY pushback hot spots:** **San Francisco** (2018 moratorium still in effect), **Boulder CO** (2020-2024 restrictions), **Seattle** (multifamily-priority zoning), **Pasadena**, **Berkeley**, **Cambridge MA**, **Brooklyn**, **Portland OR**, much of the **CA coastal corridor + denser CO/WA/MA municipalities**. Always engage **land-use counsel familiar with self-storage entitlement (Stoel Rives, Manatt Phelps, Allen Matkins, Goulston & Storrs, Cox Castle Nicholson)** before LOI -- the **entitlement risk premium** is the single biggest hidden development cost.

---

## 🏗️ PART 2 -- BUILD-OUT & CAPITAL

### Format selection: drive-up, climate-controlled, hybrid & multi-story infill

Self-storage format selection is **driven by site geometry + MSA economics + competitive set**, not founder preference.

**Drive-up single-story ($45-$75/sqft)** -- traditional garage-door rows on **3-7 acres** for 40K-80K rentable sqft. Best for **suburban + rural + secondary MSA** at $150K-$600K/acre land. Construction **8-14 months**. Lower revenue ($0.80-$1.50/sqft/mo) but lower opex too.

**Climate-controlled multi-story ($90-$160/sqft)** -- 3-4 story interior-corridor with HVAC at 55-80°F and 30-50% humidity, elevators, restrooms. **1-3 acres infill** at $750K-$3.5M land in primary MSA, $1.50-$2.50/sqft/mo street rates. Construction **12-22 months** including elevators + ICC fire-rated build-out.

**Hybrid (drive-up + climate) ($55-$110/sqft blended)** -- 60-70% drive-up + 30-40% climate on **4-7 acre suburban site**, climate building front + drive-up rows behind. **Dominant new-construction format 2022-2026** capturing both customer segments.

**Big-box conversion ($35-$80/sqft)** -- vacant Kmart + Office Depot + Toys R Us + Bed Bath & Beyond + Sears boxes converted to climate-controlled. **Dominant 2018-2024 supply source** post-Amazon. Constrained by column spacing + ceiling height + loading dock + zoning approval.

**Multi-story infill top-25 MSA ($110-$220/sqft fully loaded)** -- 5-7 story climate in Manhattan, Brooklyn, SF, downtown LA, Boston, DC, Chicago Loop with $185+/sqft land + complex ICC + sprinkler + elevator. PSA + EXR + CUBE + UOVO pioneered with $3-$5+/sqft/mo street rates.

### Construction cost stack, ICC/ADA compliance & development timeline

Construction cost has **inflated 28-45% 2020-2024** per ENR Building Cost Index + Turner Building Cost Index + Mortenson Construction Cost Index -- the dominant headwind for self-storage development underwriting.

**Drive-up hard cost:** Site work + paving + utilities $8-$18/sqft, foundation $6-$12, shell + roof $18-$32, doors + locks $4-$8, fencing + gate + lighting $3-$6, signage $0.50-$1.50. **Total $45-$75/sqft.**

**Climate-controlled hard cost:** Site work $8-$18, foundation $8-$15, multi-story shell $35-$55, HVAC $12-$22, elevators $6-$15, corridors + doors $14-$25, sprinklers + fire alarm $5-$10, electrical $6-$12, finishes $2-$5. **Total $90-$160/sqft.**

**Soft costs (15-25% of hard):** Civil + architectural + MEP, environmental Phase I/II, geotech, traffic study, zoning + entitlement legal, permit + impact fees, construction loan interest, developer fee.

**ICC compliance:** Climate multi-story must meet **IBC Group S-1 storage occupancy** + NFPA 13 sprinklers + egress + ADA. **Janus International (NYSE: JBI) Nokē Smart Entry** is the dominant smart-entry + door supplier with Bluetooth/cellular locks.

**ADA compliance:** ~5% minimum of units + 1 per type meet accessibility requirements (door width + hardware height + slope + accessible parking). Pre-1992 facilities often require retrofit at ownership transitions.

**Development timeline:** **Entitlement 12-24 months** (longer in NIMBY municipalities), **construction 8-22 months**, **stabilization to 90-94% physical occupancy month 30-60**. Total **LOI-to-stabilization 36-72 months**.

### Capital stack: SBA 504, CMBS, bridge debt, construction loans & equity sources

The self-storage capital stack has **distinct lenders by asset stage** -- ground-up construction vs lease-up vs stabilized vs portfolio.

**SBA 504 owner-user (up to $5M total)** -- dominant first-facility path. **50% senior bank + 40% SBA 504 debenture (fixed 20-25 year) + 10% borrower equity**. Owner-occupancy 51% (satisfied because owner *is* operator). Works for **rural/secondary $2M-$5M deals**, not larger primary-MSA climate.

**Construction loans ($5M-$50M, 65-70% LTC)** -- Wells, KeyBank, BMO, M&T, Live Oak, Stearns + debt funds Walker & Dunlop, Berkadia, JLL. Floating **SOFR + 250-450bps**, 24-48 month term, recourse for first-time developers, **converted to fixed-rate permanent at stabilization (75-80% LTV)**.

**Bridge debt for lease-up ($3M-$30M, 60-70% LTV)** -- bridges **18-36 month gap between CO and stabilization** when DSCR is below permanent thresholds. SOFR + 350-600bps, 24-36 month IO, non-recourse. Lenders: Madison Realty, ACORE, Greystone, Ready Capital.

**CMBS for stabilized ($5M-$100M+, 65-75% LTV)** -- conduit for 90%+ occupied. Fixed **5.5-7.5%** 10-year + 30-year amortization, non-recourse. KeyBank, Wells, Goldman, Citi, Deutsche, JPM, Barclays.

**Life company permanent** -- lowest-cost for top-quality stabilized. Prudential, MetLife, NY Life, Northwestern Mutual, Pacific Life, Voya. **25-50bps below CMBS** for top-tier sponsor. Reserved for **top-25 MSA + clean asset**.

**Equity sources:** Sponsor capital + 1031 rolling equity + LP from family offices + dedicated funds (Heitman, Prime, SROA, Andover, Strat). LP typically **8-10% pref + 20-30% promote + 10-15% catch-up**.

---

## ⚙️ PART 3 -- OPERATIONS

### Unit mix, pricing, ECRI revenue management & tenant insurance economics

Self-storage operations are dominated by **revenue management discipline** -- specifically ECRI (Existing Customer Rate Increases), street-rate dynamic pricing, and tenant insurance attach.

**Standard unit mix percentages (rentable sqft basis):** 5x5 (~3-5%), 5x10 (~12-18%), 10x10 (~22-30%), 10x15 (~14-20%), 10x20 (~20-26%), 10x30 (~6-12%), vehicle/RV/boat parking (~5-15% depending on land availability). **10x10 + 10x15 are the demand workhorses** -- the apartment-downsizer and household-overflow sweet spots.

**Street rate pricing (median by MSA tier):** 5x5 **$25-$85/mo**, 5x10 **$45-$135/mo**, 10x10 **$95-$285/mo**, 10x15 **$135-$385/mo**, 10x20 **$165-$485/mo**, 10x30 **$235-$685/mo**, climate-controlled adds **20-50% premium**, vehicle parking **$45-$185/mo** depending on covered vs uncovered + size. Manhattan/SF/LA climate-controlled tops $4-$5+/sqft/mo; rural Midwest drive-up bottoms $0.60-$0.90/sqft/mo.

**ECRI -- the dominant lever.** PSA + EXR + CUBE raise existing tenant rates **8-18% per event** every **6-12 months** after initial lease-up. Moving costs typically exceed the rate increase, so most customers absorb it. ECRI drives **30-55% of same-store revenue growth** at REIT operators -- invisible to first-time underwriters who model street-rate growth alone.

**Dynamic street-rate pricing** -- REITs run daily price-optimization algorithms based on competitor scrape + occupancy + lead volume. Independents using SiteLink + Storable + Easy Storage Solutions + Storage Commander + Doorswap can replicate at smaller scale.

**Tenant insurance attach -- the hidden margin enhancer.** 65-85% of customers buy at **$11-$22/mo for $2K-$10K coverage**. Operators earn **60-85% commission** as agents for SBOA + Bader + Ponderosa + MiniCo. Generates **$1.50-$3.50 per occupied sqft annually**.

**Other ancillary:** Late fees $15-$45 (25-35% of tenants late 1+/yr), admin fees $20-$45 at move-in, lock/box retail $12-$28, U-Haul truck rental kickback $25-$45 (50-150 rentals/mo).

### Management software, smart entry, security & operations stack

Self-storage operations stack consolidates around 4-5 dominant software platforms + Janus International smart-entry hardware + standard security setup.

**Property management software (PMS) -- the operations core:** **SiteLink (acquired by Storable 2019)** dominant ~40-50% market share, deep PSA/EXR/CUBE historical roots. **Easy Storage Solutions** ~15-20% share. **Storage Commander** ~10-15%. **Doorswap (Storable)** ~8-12%. **Storedge (Storable)** another Storable product. Cost **$95-$385/mo/facility** depending on integration depth + reporting + revenue management add-ons.

**Smart entry + IoT:** **Janus International (NYSE: JBI) Nokē Smart Entry** dominant (~50-60% new-install market share) -- Bluetooth/cellular smart padlocks + door sensors + tenant mobile app + remote unlock. Alternatives: **OpenTech IoE**, **PTI Storage Security**, **Salto KS**. Per-unit smart-entry cost $35-$95/door + monthly platform fee $0.40-$1.20/unit. ROI from labor reduction + remote operations + premium pricing for smart-access tier.

**Gate + access control:** **DoorKing, Liftmaster Commercial, FAAC, HySecurity, Sentex, OpenPath** for vehicle gate + keypad. Typical install $4K-$18K depending on slide vs swing + traffic volume.

**Surveillance:** **Avigilon, Hanwha, Axis Communications, Eagle Eye Networks, Verkada** IP camera systems. Typical 16-48 camera install $18K-$85K depending on facility size + analytics + retention requirements.

**Lighting:** LED retrofit standard 2018+ for energy + insurance discount. Motion-activated interior climate-controlled hallway lighting typical.

**Marketing + lead-gen integrations:** SpareFoot + Storable Marketplace (aggregator listing) + Google Local Services Ads + Google My Business + Yelp + Facebook + website with online rental capability. **70-85% of new rentals come through online channels** vs walk-in.

### Third-party management vs self-operated & on-site vs remote operations

The fundamental ops decision: **third-party manage (TPM) vs self-operate**, and **staffed on-site vs remote/unmanned**.

**TPM -- dominant for non-operating owners:** Extra Space TPM (~$8B AUM), CubeSmart TPM, NSA TPM, Storage Asset Management, Absolute Storage Management, Argus, Heitman. Fee **5-7% of gross + incentive**. Brings brand + national marketing + revenue management + tenant insurance + smart-entry stack. Independents increasingly outsource as the operational sophistication gap with REITs has widened.

**Self-operated -- hands-on owner-operators:** Owner runs SiteLink + Storable + own marketing. Saves 5-7% fee but requires expertise + tech investment. Best for **1-5 facility clusters** with active founder.

**Staffed on-site vs unmanned remote:** Traditional model is **on-site resident manager + 1-2 part-time assistants** at $45K-$95K total labor. Modern trend toward **unmanned remote-operated** with smart entry + remote rental + call center -- pioneered by **Spartan Investment Group + Reliant + StoragePRO**. Saves $45K-$95K/yr per facility.

**Hybrid kiosk model:** Touchscreen self-service + part-time attendant during peak windows. Popular at 30K-60K sqft suburban facilities.

### Marketing: SpareFoot/Storable Marketplace, Google LSA, organic & B2B contractor channel

Self-storage customer acquisition is **dominated by online aggregators + Google + REIT-brand walk-in**, with B2B contractor + multifamily property manager channel as a sustained second tier.

**Online aggregator marketplace:** **SpareFoot (Storable 2020) + Storable Marketplace** drive 30-50% of independent rentals at **$30-$185 per move-in lead**. REITs have largely **stopped paying SpareFoot fees** by routing to own brands -- independents stuck paying the platform tax.

**Google LSA + Google Ads:** "self storage near me," "storage units [city]," "climate controlled storage [city]" at **$8-$25 CPC** in top-25 MSA. GMB optimization + organic local SEO drive 25-40% at well-optimized independents.

**REIT brand walk-in + digital moat:** PSA/EXR/CUBE direct brand traffic + brand-search SEO + walk-in = ~50-65% of REIT rentals come without paid acquisition cost. **15-25% lower CAC** than independents at scale.

**B2B contractor + multifamily:** Contractor + GC referrals + multifamily PM partnerships + apartment-locator + move-management coordinator. Typical $25-$75 referral credit.

**Move-management partnerships:** **Caring Transitions, Smooth Transitions, MoveOn** -- senior-focused move managers refer downsizing tenants.

**Pricing wars:** Discount-platform competition (SpareFoot featured tier + StoragePay) eroded historical 4-6% first-month-free floor to **5-8 days free or $1/first-month** in oversupplied markets.

---

## 🚀 PART 4 -- GROWTH & EXIT

### Lease-up trajectory, stabilization milestones & portfolio scaling

The self-storage growth path from ground-up CO to mature stabilized facility follows a well-mapped trajectory that determines refinancing + exit timing.

**Stage 1 (Months 1-6 post-CO): Initial lease-up.** Pre-leasing during construction + signage + Google LSA + SpareFoot + grand opening (50% off first month + free truck + lock). Target **15-30% occupancy month 6**. Revenue minimal; cash burn high.

**Stage 2 (Months 6-18): Velocity lease-up.** Target **3-6% physical occupancy per month**. Reach **50-70% by month 18**. Begin **first ECRI cycle** for tenants past 6-month tenure. Bridge debt typical.

**Stage 3 (Months 18-36): Stabilization.** Reach **85-94% occupancy month 24-36**. RevPAF approaches market norms. **DSCR reaches 1.20-1.40x** supporting refinance to CMBS or life-company. Mature **ECRI cadence every 6-12 months 8-18%**.

**Stage 4 (Years 3-7): Mature operations.** 90-94% physical + **90-95% economic occupancy**. Same-store revenue growth **3-6% normal market** via ECRI + street-rate + tenant insurance. Opex ratio settles at **30-35%**.

**Stage 5 (Years 5-10): Portfolio or exit.** Hold for cash flow + ECRI + appreciation, refinance/recapitalize, or sell to REIT / private buyer.

| Stage | Timeline | Physical Occupancy | Same-Store Revenue Growth | Financing Stage |
|---|---|---|---|---|
| 1 Initial lease-up | Months 1-6 | 0-30% | Not applicable | Construction loan |
| 2 Velocity lease-up | Months 6-18 | 30-70% | High (lease-up driven) | Construction loan extending |
| 3 Stabilization | Months 18-36 | 70-94% | 8-25% lease-up tail | Bridge debt → CMBS |
| 4 Mature operations | Years 3-7 | 90-94% | 3-6% normal market | CMBS / life co permanent |
| 5 Portfolio or exit | Years 5-10 | 90-94% | 2-5% mature steady | Exit / recapitalize |

| Format | Stabilized Cap Rate | Year 3 RevPAF Target | Year 3 NOI Margin |
|---|---|---|---|
| Top-25 MSA climate-controlled multi-story | 5.5-6.5% | $18-$26 | 67-72% |
| Top-25 MSA hybrid (drive-up + climate) | 6.0-7.0% | $14-$20 | 65-70% |
| Secondary MSA drive-up | 6.5-7.5% | $10-$15 | 63-68% |
| Secondary MSA climate-controlled | 6.5-7.5% | $13-$18 | 63-68% |
| Tertiary/rural drive-up | 8.0-9.5% | $7-$11 | 60-65% |
| Tertiary/rural hybrid | 8.5-10% | $8-$12 | 60-65% |

### Exit math: REIT acquisition, private buyer, portfolio aggregation & 1031 path

The self-storage exit landscape offers **four distinct strategic paths** with different valuation outcomes.

**Independent sale (3-7x EBITDA / 6.5-9.5% cap):** Sell to local operator or regional aggregator (Prime, Andover, Strat, family office). Broker-led process (Cushman & Wakefield, Marcus & Millichap, JLL, Newmark, Colliers, Argus). Typical 4-6 month process.

**REIT acquisition (5.5-7.5% cap, premium pricing):** PSA + EXR + CUBE + NSA acquire **top-50 MSA + climate or hybrid + 90%+ occupied + 25K+ sqft + clean** facilities. Premium reflects ECRI upside + portfolio synergies + lower cost of capital. Discipline tightened 2023-2025.

**PE / portfolio aggregator (6-8% cap):** Prime Storage (Blackstone), SROA, Heitman, GIC, Brookfield, Carlyle. Typically acquires **3-15 facility portfolios** at **25-75 bps tighter cap** vs single-facility via operating leverage + brand layering.

**1031 like-kind exchange:** Section 1031 defers capital gain via reinvestment within 180 days. Common for owner-operators **stepping up from single to multi-facility portfolio** or diversifying into other CRE.

**TPM transition (alternative to sale):** Some owners **transition to Extra Space, CubeSmart, NSA, or Storage Asset Management TPM** rather than sell -- retains ownership + 1031 future + reduces operational burden for 5-7% fee. Useful for **aging operators not yet ready to sell**.

| Exit Path | Buyer Type | Typical Cap Rate | Process Length | Best For |
|---|---|---|---|---|
| Independent sale to local operator | Single-asset local buyer | 6.5-9.5% | 4-6 months | Rural + tertiary + single facility |
| REIT acquisition | PSA / EXR / CUBE / NSA | 5.5-7.5% | 6-12 months | Top-50 MSA + climate + 90%+ occupied + 25K+ sqft |
| PE portfolio aggregator | Prime / SROA / Heitman / Carlyle | 6-8% | 6-9 months | 3-15 facility portfolios |
| 1031 exchange | Self-reinvestment | N/A defer | 180-day deadline | Owner-operators stepping up |
| TPM transition (no sale) | Extra Space / CubeSmart / NSA TPM | N/A retain | 90-120 days | Aging owners retaining asset |

### Counter-case: oversupply, cap-rate reversal, insurance inflation & municipal moratoriums

A serious self-storage developer or operator must stress-test the case above against the conditions that make this asset class a bad bet -- Sun Belt oversupply 2022-2026 hangover, cap-rate compression reversal 2023-2025, construction cost inflation, insurance premium increases, REIT consolidation closing arbitrage, municipal moratoriums, discount-platform pricing wars, ECRI consumer fatigue, capital-intensity vs adjacent CRE, and adjacent CRE asset classes that may fit better (full 12-element counter-case in the Counter-Case section below).

`;

const tldr = `**TL;DR:** Starting a **self-storage facility business in 2027** (a.k.a. **self storage**, **mini-storage**, **storage units**, **storage facility**, or **drive-up + climate-controlled storage**) -- the **commercial real estate asset class developing or acquiring fenced, gated, individually-padlocked self-service rental storage compounds with non-climate-controlled drive-up units (single-story rows of garage-style metal doors at $45-$75/sqft construction cost) and/or climate-controlled units (interior corridor multi-story building with HVAC at 55-80°F and 30-50% humidity at $90-$160/sqft construction cost) rented month-to-month to household residential tenants (~75-85% of demand) plus small-business tenants (~15-25%) at standard 5x5 / 5x10 / 10x10 / 10x15 / 10x20 / 10x30 unit sizes plus vehicle/RV/boat parking under industrial M-1/M-2 zoning or self-storage overlay districts or special-use permit (SUP) variances** -- means navigating **site selection + 3-mile/5-mile/10-mile rentable-sqft-per-capita supply test via Radius+ + Union Realtime + Yardi Matrix + STR Self-Storage benchmarks (oversupplied >9-10 sqft/capita primary urban 3-mile or >7-8 suburban or >5-6 tertiary) + zoning + entitlement risk (NIMBY pushback in San Francisco moratorium 2018-ongoing + Boulder CO 2020-2024 + Seattle 2021-2024 + Pasadena + Berkeley + Cambridge MA + Brooklyn + Portland OR + much of CA coastal corridor + denser CO/WA/MA municipalities) + land-use counsel (Stoel Rives + Manatt Phelps + Allen Matkins + Goulston Storrs + Saul Ewing + Cox Castle Nicholson) + ICC International Building Code Group S-1 storage occupancy + NFPA 13 sprinklers + ADA accessibility 5% minimum + Janus International (NYSE: JBI) Nokē Smart Entry rolling steel doors + capital stack (SBA 504 owner-user up to $5M total project at 50/40/10 senior/SBA/equity + construction loans 65-70% LTC at SOFR+250-450bps from Wells/KeyBank/BMO/M&T/Live Oak/Stearns + bridge debt for lease-up 60-70% LTV at SOFR+350-600bps + CMBS for stabilized 65-75% LTV at 5.5-7.5% from KeyBank/Wells/Goldman/Citi/Deutsche/JP Morgan + life company permanent from Prudential/MetLife/NY Life/Northwestern Mutual/Pacific Life/Voya) + management software (SiteLink + Storable + Easy Storage Solutions + Storage Commander + Doorswap) + smart entry (Janus Nokē + OpenTech IoE + PTI + Salto KS) + gate (DoorKing + Liftmaster + FAAC + HySecurity + Sentex + OpenPath) + surveillance (Avigilon + Hanwha + Axis + Eagle Eye + Verkada) + tenant insurance (SBOA + Bader + Ponderosa + MiniCo) + third-party management (Extra Space TPM ~$8B AUM + CubeSmart TPM + NSA TPM + Storage Asset Management + Absolute Storage Management + Argus + Heitman) + customer acquisition (SpareFoot + Storable Marketplace $30-$185 per move-in + Google LSA + Google Ads + Google My Business + B2B contractor + multifamily property manager + move-management Caring Transitions/Smooth Transitions/MoveOn referrals)**, and operating against **~52,000-60,000 US facilities containing ~2.1B-2.3B rentable sqft generating $28B-$32B 2024 US self-storage revenue per SSA + Inside Self-Storage + Yardi Matrix + STR + Radius+ at ~11-12% US household penetration roughly 35-42 million Americans (highest globally)** -- capturing **typical stabilized facility 30-35% operating expense ratio + 65-70% NOI margin + 5.5-7.5% cap rate top-25 MSA stabilized + 6.5-8.5% secondary + 8-11% tertiary/rural + 8-11% levered IRR over 7-10 year hold + revenue per available foot (RevPAF) $10-$26 annually primary MSA + $7-$14 secondary + $5-$10 tertiary + ECRI (Existing Customer Rate Increases) 8-18% per increase event every 6-12 months driving 30-55% of same-store revenue growth + tenant insurance attach 65-85% at $11-$22/mo generating $1.50-$3.50 per occupied sqft commission with reference operators Public Storage (NYSE: PSA ~3,000 facilities + 218M sqft + $47B-$58B market cap founded 1972) + Extra Space Storage (NYSE: EXR ~3,800 post-Life Storage merger 2023 $12.7B deal + 280M sqft + $35B-$45B market cap + third-party management leader) + CubeSmart (NYSE: CUBE ~1,500 facilities + 105M sqft) + National Storage Affiliates (NYSE: NSA ~1,000 facilities Participating Regional Operator structure) + private operators Prime Storage (Blackstone ~280) + StorageMart (~250) + MetroStorage (~140) + U-Haul Self-Storage Division (~1,500) + William Warren Group StorQuest (~190) + Westport Properties + SROA Capital + Andover + Heitman**. The hardest part is **site selection + 3/5/10-mile supply test + zoning entitlement + NIMBY moratoriums + Sun Belt oversupply 2022-2026 hangover (FL/TX/AZ/NV/GA new construction wave 2017-2022 pushing many submarkets to 12-16 sqft/capita still digesting through 2026) + construction cost inflation +28-45% 2020-2024 per ENR + Turner + Mortenson compressing development yield-on-cost from 8.5-10% historical to 6.5-8% achievable + cap-rate compression 2018-2022 reversing 2023-2025 with rates 75-150bps wider repricing existing portfolios down + insurance premium increases +30-60% 2023-2025 especially tornado/hurricane-exposed Sun Belt + REIT consolidation (Extra Space + Life Storage 2023 + CubeSmart + Storage West) closing acquisition arbitrage + discount-rate-platform pricing wars (SpareFoot featured tier + StoragePay first-month-free) eroding promotional floor + ECRI consumer fatigue + interest-rate sensitivity on CMBS refinancings**, not capital.`;

const flow = `

## The Operating Journey: From Site Identification To Stabilized Asset And Strategic Exit

\`\`\`mermaid
flowchart TD
  A[Founder Or Sponsor Decides To Develop/Acquire Self-Storage] --> B[Market Selection Plus Format Decision]
  B --> B1{MSA Plus Site Plus Format Plus Capital Stack Decision}
  B1 -->|$1.8M-$4.5M Rural/Tertiary Drive-Up Conversion Or Small Ground-Up| C1[Rural/Tertiary Drive-Up Developer]
  B1 -->|$4.5M-$9M Suburban Hybrid Drive-Up Plus Climate-Controlled| C2[Suburban Hybrid Developer]
  B1 -->|$9M-$22M+ Infill Multi-Story Climate-Controlled Top-25 MSA| C3[Infill Multi-Story Developer]
  B1 -->|$300K-$750K Acquire TPM Contract On Existing Facility| C4[TPM Acquisition Operator]
  B1 -->|Acquire Stabilized Or Lease-Up Facility For Recapitalization| C5[Acquisition-Plus-Reposition Operator]
  C1 --> D[Site Identification Plus Supply Test Plus Zoning Plus Entitlement]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  D --> D1[3-Mile/5-Mile/10-Mile Rentable Sqft Per Capita Via Radius+/Union Realtime/Yardi Matrix/STR]
  D --> D2[Land-Use Counsel Stoel Rives/Manatt Phelps/Allen Matkins/Goulston Storrs/Saul Ewing/Cox Castle]
  D --> D3[Industrial M-1/M-2 Zoning Or Self-Storage Overlay Or Special-Use Permit With Public Hearing]
  D --> D4[Environmental Phase I/II Plus Geotech Plus Traffic Study Plus Civil Engineering]
  D --> D5[Entitlement 12-24 Months Plus NIMBY Risk In San Francisco/Boulder/Seattle/Pasadena/Berkeley/Brooklyn]
  D1 --> E[Capital Stack Plus Construction Loan Plus Equity]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  E --> E1[SBA 504 Owner-User Up To $5M Total At 50/40/10 Senior/SBA/Equity For Rural Single-Facility]
  E --> E2[Construction Loan 65-70% LTC At SOFR+250-450bps From Wells/KeyBank/BMO/M&T/Live Oak/Stearns]
  E --> E3[Bridge Debt For Lease-Up 60-70% LTV At SOFR+350-600bps From Debt Funds]
  E --> E4[CMBS For Stabilized 65-75% LTV At 5.5-7.5% From KeyBank/Wells/Goldman/Citi/Deutsche/JPM]
  E --> E5[Life Company Permanent From Prudential/MetLife/NY Life/Northwestern Mutual/Pacific Life/Voya]
  E --> E6[LP Equity From Family Office Plus 1031 Exchange Plus Dedicated Self-Storage Funds]
  E1 --> F[Construction Plus ICC/ADA Compliance Plus Smart Entry Plus Security]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  E6 --> F
  F --> F1[Drive-Up Hard Cost $45-$75/Sqft Plus Climate-Controlled $90-$160/Sqft Plus Conversion $35-$80/Sqft]
  F --> F2[ICC IBC Group S-1 Storage Occupancy Plus NFPA 13 Sprinklers Plus ADA 5% Minimum]
  F --> F3[Janus International NYSE JBI Nokē Smart Entry Plus Rolling Steel Doors]
  F --> F4[Gate Plus DoorKing/Liftmaster/FAAC/HySecurity Plus Avigilon/Hanwha/Axis Surveillance]
  F --> F5[Construction Timeline 8-22 Months Plus CO Plus Initial Lease-Up Start]
  F1 --> G[Property Management Software Plus Smart Entry Plus Operations Stack]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  G --> G1[SiteLink Storable Easy Storage Solutions Storage Commander Doorswap $95-$385/Mo/Facility]
  G --> G2[Janus Nokē Plus OpenTech IoE Plus PTI Plus Salto KS Smart Entry Per-Door $35-$95]
  G --> G3[Tenant Insurance SBOA Plus Bader Plus Ponderosa Plus MiniCo 65-85% Attach At $11-$22/Mo]
  G --> G4[U-Haul Affiliate Truck Rental Plus Lock/Box Retail Plus Late Fee Plus Admin Fee]
  G --> G5[Third-Party Management Decision Extra Space TPM/CubeSmart TPM/NSA TPM Vs Self-Operated]
  G1 --> H[Lease-Up Plus Marketing Plus ECRI Revenue Management]
  H --> H1[SpareFoot Plus Storable Marketplace $30-$185 Per Move-In Driving 30-50% Independent Leads]
  H --> H2[Google Local Services Ads Plus Google Ads Plus Google My Business Plus Yelp Plus Organic]
  H --> H3[B2B Contractor Plus Multifamily PM Plus Move-Management Caring Transitions Referrals]
  H --> H4[Pre-Leasing Construction Plus Grand Opening 50% Off First Month Plus Free Truck Plus Lock]
  H --> H5[ECRI 8-18% Per Increase Event Every 6-12 Months Driving 30-55% Same-Store Revenue Growth]
  H1 --> I[Lease-Up Stages Plus Stabilization Plus Refinancing]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  I --> I1[Stage 1 Months 1-6 Initial Lease-Up Target 15-30% Physical Occupancy]
  I --> I2[Stage 2 Months 6-18 Velocity Lease-Up Target 50-70% Plus First ECRI Cycle]
  I --> I3[Stage 3 Months 18-36 Stabilization 85-94% Plus DSCR 1.20-1.40x Plus Refinance Bridge To CMBS]
  I --> I4[Stage 4 Years 3-7 Mature Operations 30-35% Opex Ratio Plus 3-6% Same-Store Growth]
  J{Mature Operations Plus Strategic Exit Decision}
  I --> J
  J -->|Hold For Cash Flow Plus ECRI Plus Appreciation Plus 1031 Future| K[Long-Term Hold]
  J -->|Refinance Plus Recapitalize Pulling Equity For Next Deal| L[Recapitalization]
  J -->|Sell To Local Operator At 6.5-9.5% Cap Rate Single-Asset Process| M[Independent Sale]
  J -->|Sell To REIT PSA/EXR/CUBE/NSA At 5.5-7.5% Cap Top-50 MSA Climate| N[REIT Acquisition Exit]
  J -->|Sell Portfolio To Prime/SROA/Heitman/Carlyle At 6-8% Portfolio Premium| O[PE Portfolio Aggregator Exit]
  J -->|1031 Like-Kind Exchange Reinvesting In Replacement Property 180-Day Deadline| P[1031 Step-Up]
  J -->|Transition To TPM With Extra Space/CubeSmart/NSA Retaining Ownership| Q[TPM Transition Exit]
  K --> R[Long-Term Cash-Flow Hold With Mature ECRI Plus Same-Store Growth]
  L --> S[Refinance Pulling Equity For Next Acquisition Or Development]
  M --> T[Single-Asset Sale Process 4-6 Months At 6.5-9.5% Cap]
  N --> U[REIT Premium Pricing 5.5-7.5% Cap Plus 6-12 Month Process]
  O --> V[Portfolio Premium 25-75bps Tighter Cap Vs Single Sale Plus 6-9 Month Process]
  P --> W[Tax-Deferred Compounding Step-Up Into Multi-Facility Portfolio]
  Q --> X[Aging-Owner Retention Path With 5-7% TPM Fee Plus 1031 Future Optionality]
\`\`\`

## The Decision Matrix: Format Selection And Market Tier

\`\`\`mermaid
flowchart TD
  A[Founder Or Sponsor Has Capital Plus Target Market Plus Format Decision] --> B{Market Tier Plus Land Cost Plus Format Plus Capital Decision}
  B -->|Top-25 MSA Plus $750K-$3.5M Infill Land Plus $9M-$22M+ Capital Plus Climate-Controlled| C[Infill Multi-Story Climate-Controlled]
  B -->|Top-50 MSA Plus $400K-$1.2M Suburban Land Plus $4.5M-$9M Capital Plus Hybrid| D[Suburban Hybrid Developer]
  B -->|Secondary MSA Plus $250K-$700K Land Plus $3M-$6M Capital Plus Drive-Up Or Hybrid| E[Secondary Market Operator]
  B -->|Tertiary/Rural Plus $150K-$600K Land Plus $1.8M-$4.5M Capital Plus Drive-Up| F[Rural/Tertiary Drive-Up Operator]
  B -->|Conversion Of Big-Box Retail/Industrial At $35-$80/Sqft Vs $90-$160/Sqft Ground-Up| G[Big-Box Conversion Developer]
  B -->|Acquire Existing Facility With Operating Track Record Vs Develop Ground-Up| H[Acquisition-Plus-Reposition Operator]
  B -->|TPM Contract Acquisition With Existing Owner Retaining Real Estate| I[TPM Operator]
  C --> C1[5.5-6.5% Stabilized Cap Plus $18-$26 RevPAF Plus 67-72% NOI Margin Plus 18-36 Month Entitlement]
  C --> C2[Highest Revenue Per Foot But Highest Construction Cost Plus Longest Timeline]
  D --> D1[6.0-7.0% Stabilized Cap Plus $14-$20 RevPAF Plus 65-70% NOI Margin Plus 12-24 Month Entitlement]
  D --> D2[Dominant New-Construction Format 2022-2026 Capturing Both Customer Segments]
  E --> E1[6.5-7.5% Stabilized Cap Plus $10-$15 RevPAF Plus 63-68% NOI Margin Plus 9-18 Month Entitlement]
  E --> E2[Solid Risk-Adjusted Returns Plus Lower Entitlement Risk Plus Reasonable Construction Cost]
  F --> F1[8-11% Stabilized Cap Plus $5-$10 RevPAF Plus 60-65% NOI Margin Plus 6-12 Month Entitlement]
  F --> F2[SBA 504 Owner-User Path Up To $5M Plus Lower Land Cost Plus Faster Entitlement]
  G --> G1[Lower Construction Cost $35-$80/Sqft Plus Faster Timeline Plus Constrained By Column/Ceiling]
  G --> G2[Dominant 2018-2024 Supply Source Vacant Kmart/Office Depot/Toys R Us/Bed Bath/Sears Boxes]
  H --> H1[Operating Track Record Plus DSCR Plus Existing Tenant Base Plus Faster Cash Flow]
  H --> H2[Subject To Cap-Rate Compression Reversal 2023-2025 Repricing Existing Portfolios Down]
  I --> I1[Recurring 5-7% TPM Fee Revenue Plus Brand Layering Plus Lower Capital Intensity]
  I --> I2[Reference TPM Operators Extra Space TPM ~$8B AUM Plus CubeSmart TPM Plus NSA TPM]
  C2 --> J{Reassess After Stabilization Year 3}
  D2 --> J
  E2 --> J
  F2 --> J
  G2 --> J
  H2 --> J
  I2 --> J
  J -->|Hold For Cash Flow Plus ECRI Plus Appreciation Plus 1031 Future| K[Long-Term Cash-Flow Hold]
  J -->|Sell To REIT PSA/EXR/CUBE/NSA At Premium Cap 5.5-7.5%| L[REIT Acquisition Exit]
  J -->|Sell Portfolio To Prime/SROA/Heitman/Carlyle At Portfolio Premium 6-8%| M[PE Portfolio Aggregator]
  J -->|1031 Step-Up Into Multi-Facility Portfolio Compounding Tax-Deferred| N[1031 Compounding Strategy]
  K --> O[Long-Term Hold With Mature ECRI Plus Same-Store Growth 3-6% Annually]
  L --> P[REIT Premium Pricing Top-50 MSA Climate Plus 25K+ Sqft Plus 90%+ Occupied]
  M --> Q[Portfolio 3-15 Facilities At 25-75bps Tighter Cap Vs Single Sale]
  N --> R[Tax-Deferred Multi-Facility Compounding Strategy Over 10-30 Year Horizon]
\`\`\`

`;

const src = `

## Sources

1. **Self-Storage Association (SSA, selfstorage.org)** -- Primary industry trade association tracking ~52,000-60,000 US facilities containing ~2.1B-2.3B rentable sqft generating $28B-$32B 2024 revenue. https://www.selfstorage.org
2. **Inside Self-Storage (insideselfstorage.com)** -- Dominant industry trade publication covering operations + development + M&A + regulatory developments. https://www.insideselfstorage.com
3. **Yardi Matrix Self-Storage** -- Industry data + research platform tracking supply + demand + rates + occupancy by MSA. https://www.yardimatrix.com/Self-Storage
4. **STR Self-Storage (STR / CoStar Group)** -- Industry benchmarking data on RevPAF + occupancy + rates by MSA tier. https://str.com
5. **Radius+ (radiusplus.com)** -- Dominant supply/demand analysis tool for self-storage site selection. https://www.radiusplus.com
6. **Union Realtime (unionrealtime.com)** -- Self-storage location intelligence + supply analytics platform. https://www.unionrealtime.com
7. **Green Street Self-Storage Research** -- Public REIT equity research on PSA + EXR + CUBE + NSA. https://www.greenstreet.com
8. **Marcus & Millichap National Self-Storage Group** -- Investment sales brokerage + research reports on cap rates and transaction volume. https://www.marcusmillichap.com/research/self-storage
9. **JLL Self-Storage Capital Markets** -- Investment sales + debt + equity advisory for institutional self-storage. https://www.jll.com/en/industries/self-storage
10. **Cushman & Wakefield Self-Storage Group** -- Brokerage + capital markets + valuation for self-storage. https://www.cushmanwakefield.com
11. **Newmark Self-Storage** -- Investment sales + debt advisory for self-storage transactions. https://www.nmrk.com
12. **Colliers Self-Storage** -- Brokerage + research on self-storage sector. https://www.colliers.com
13. **Argus Self-Storage Advisors** -- Specialty self-storage brokerage + advisory. https://www.argus-selfstorage.com
14. **Public Storage (NYSE: PSA)** -- ~3,000 facilities + 218M rentable sqft + $47B-$58B market cap, dominant brand founded 1972. https://www.publicstorage.com
15. **Extra Space Storage (NYSE: EXR)** -- ~3,800 facilities post-Life Storage merger 2023 ($12.7B deal) + 280M sqft + $35B-$45B market cap + third-party management leader. https://www.extraspace.com
16. **CubeSmart (NYSE: CUBE)** -- ~1,500 facilities + 105M sqft + $9B-$12B market cap. https://www.cubesmart.com
17. **National Storage Affiliates (NYSE: NSA)** -- ~1,000 facilities + 60M sqft + $4B-$6B market cap + Participating Regional Operator structure. https://www.nationalstorageaffiliates.com
18. **Prime Storage (Blackstone backing)** -- ~280 facilities, private operator. https://www.primestorage.com
19. **StorageMart (storagemart.com)** -- ~250 facilities, founded 1999 in Columbia MO. https://www.storagemart.com
20. **MetroStorage (metrostorage.com)** -- ~140 facilities. https://www.metrostorage.com
21. **U-Haul Self-Storage Division** -- ~1,500 facilities tied to U-Haul truck rental network. https://www.uhaul.com/Storage
22. **William Warren Group (StorQuest)** -- ~190 StorQuest-branded facilities. https://www.storquest.com
23. **Westport Properties (westport-properties.net)** -- ~100 facilities. https://www.westport-properties.net
24. **SROA Capital (sroacapital.com)** -- ~100+ facilities. https://www.sroacapital.com
25. **Reliant Real Estate Management** -- Private self-storage operator + investor. https://www.reliant-mgmt.com
26. **Andover Properties (andoverproperties.com)** -- Storage Williams self-storage operator. https://www.andoverproperties.com
27. **Heitman Self-Storage** -- Institutional real-estate investment manager. https://www.heitman.com
28. **Strat Storage Holdings** -- Private self-storage operator. https://www.stratstoragepartners.com
29. **Spartan Investment Group (FreeUp Storage)** -- Self-storage acquisition + remote operations pioneer. https://www.spartan-investors.com
30. **SiteLink (Storable)** -- Dominant property management software ~40-50% market share. https://www.sitelink.com
31. **Storable (storable.com)** -- Self-storage technology platform (SiteLink + Doorswap + Storedge + SpareFoot + Storable Marketplace). https://www.storable.com
32. **Easy Storage Solutions (easystoragesolutions.com)** -- Property management software ~15-20% market share. https://www.easystoragesolutions.com
33. **Storage Commander (storagecommander.com)** -- Property management software platform. https://www.storagecommander.com
34. **Doorswap (Storable)** -- Self-storage management software (~8-12% share). https://www.doorswap.com
35. **Janus International (NYSE: JBI)** -- Dominant smart entry (Nokē Smart Entry) + rolling steel door manufacturer. https://www.janusintl.com
36. **OpenTech IoE (opentechalliance.com)** -- IoT smart-storage platform. https://www.opentechalliance.com
37. **PTI Security Systems (ptisecurity.com)** -- Self-storage access control + security. https://www.ptisecurity.com
38. **Salto KS (saltoks.com)** -- Cloud-based access control used in self-storage. https://www.saltoks.com
39. **SBOA Tenant Insurance (sboaprogram.com)** -- Leading tenant insurance program for self-storage. https://www.sboaprogram.com
40. **Bader Company (badercompany.com)** -- Tenant insurance + property insurance for self-storage. https://www.badercompany.com
41. **Ponderosa Insurance (ponderosains.com)** -- Self-storage specialty insurance. https://www.ponderosains.com
42. **MiniCo (minico.com)** -- Self-storage specialty insurance. https://www.minico.com
43. **DoorKing (doorking.com)** -- Vehicular gate + access control. https://www.doorking.com
44. **Liftmaster Commercial (liftmaster.com/commercial)** -- Commercial gate operators. https://www.liftmaster.com/commercial
45. **FAAC USA (faacusa.com)** -- Gate operators + access controls. https://www.faacusa.com
46. **HySecurity (hysecurity.com)** -- High-security vehicular gates. https://www.hysecurity.com
47. **Sentex (sentexsystems.com)** -- Self-storage access control systems. https://www.sentexsystems.com
48. **OpenPath (openpath.com)** -- Mobile cloud access control. https://www.openpath.com
49. **Avigilon (avigilon.com)** -- IP video surveillance. https://www.avigilon.com
50. **Hanwha Vision America (hanwhavisionamerica.com)** -- IP security cameras. https://www.hanwhavisionamerica.com
51. **Axis Communications (axis.com)** -- Network video + access control. https://www.axis.com
52. **Eagle Eye Networks (een.com)** -- Cloud-based video surveillance. https://www.een.com
53. **Verkada (verkada.com)** -- Cloud-managed video security. https://www.verkada.com
54. **SpareFoot (sparefoot.com)** -- Self-storage aggregator marketplace acquired by Storable 2020. https://www.sparefoot.com
55. **Storable Marketplace (storable.com/marketplace)** -- Self-storage rental marketplace platform. https://www.storable.com
56. **Google Local Services Ads (LSA)** -- Pay-per-lead local advertising platform. https://ads.google.com/local-services-ads
57. **Google My Business (business.google.com)** -- Local business profile + search optimization. https://www.business.google.com
58. **SBA 504 Loan Program (sba.gov/funding-programs/loans/504-loans)** -- Owner-user CRE financing up to $5M total project. https://www.sba.gov/funding-programs/loans/504-loans
59. **CMBS conduit lending overview (mbsdata.org)** -- Commercial mortgage-backed securities for stabilized CRE. https://www.mbsdata.org
60. **ENR Building Cost Index (enr.com)** -- Engineering News-Record construction cost index showing +28-45% inflation 2020-2024. https://www.enr.com
61. **Turner Building Cost Index (turnerconstruction.com)** -- Construction cost benchmark. https://www.turnerconstruction.com/cost-index
62. **Mortenson Construction Cost Index** -- Construction cost benchmark. https://www.mortenson.com
63. **ICC International Building Code (iccsafe.org)** -- IBC Group S-1 storage occupancy + NFPA 13 sprinklers + ADA compliance. https://www.iccsafe.org
64. **NFPA 13 Standard for Installation of Sprinkler Systems (nfpa.org)** -- Sprinkler requirements for self-storage. https://www.nfpa.org
65. **ADA National Network (adata.org)** -- Americans with Disabilities Act compliance resources. https://adata.org
66. **City of San Francisco Self-Storage Moratorium (sfplanning.org)** -- 2018 moratorium on new self-storage in commercial corridors, still in effect. https://sfplanning.org
67. **City of Boulder CO self-storage zoning restrictions** -- 2020-2024 land-use restrictions on new self-storage. https://bouldercolorado.gov/planning
68. **City of Seattle multifamily-priority zoning** -- 2021-2024 zoning displaced storage for housing priorities. https://www.seattle.gov/sdci
69. **Caring Transitions (caringtransitions.com)** -- Senior-focused move management referral network. https://www.caringtransitions.com
70. **Smooth Transitions (smoothtransitionsmove.com)** -- Senior downsizing + move management. https://www.smoothtransitionsmove.com
71. **MoveOn Move Management** -- Senior + estate move management. https://www.moveon.com
72. **Storage Asset Management (storageasset.com)** -- Independent third-party management. https://www.storageasset.com
73. **Absolute Storage Management (absolutemgmt.com)** -- Independent third-party management. https://www.absolutemgmt.com
74. **Argus Self Storage Sales Network (argus-selfstorage.com)** -- Specialty self-storage brokerage. https://www.argus-selfstorage.com
75. **Iron Mountain Outdoor Storage IOS (NYSE: IRM)** -- Adjacent industrial outdoor storage asset class. https://www.ironmountain.com

`;

const num = `

## Numbers & Benchmarks

### Industry size, demand reality & operator landscape

| Metric | 2024-2026 Value | Source |
|---|---|---|
| US self-storage facility count | ~52,000-60,000 | SSA + Inside Self-Storage + Yardi Matrix |
| US rentable sqft total | ~2.1B-2.3B | SSA + STR + Radius+ |
| US industry revenue 2024 | $28B-$32B | SSA + Green Street |
| Per-capita inventory | ~6.5-7.0 rentable sqft/person | Industry data (highest globally) |
| US household penetration | ~11-12% | SSA |
| Approximate users at any moment | 35-42 million Americans | SSA |
| Public REIT share of facility count | ~10-15% | Industry data |
| Top-50 private operator share | ~5-10% | Industry data |
| Independent operator share (<10 facility) | ~80-85% | Industry data |
| PSA facility count | ~3,000 | Public Storage 10-K |
| PSA rentable sqft | 218M | Public Storage 10-K |
| EXR facility count post-Life Storage merger 2023 | ~3,800 | Extra Space 10-K |
| EXR rentable sqft | 280M | Extra Space 10-K |
| EXR Life Storage merger deal value | $12.7B | 2023 merger announcement |
| CUBE facility count | ~1,500 | CubeSmart 10-K |
| NSA facility count | ~1,000 | NSA 10-K |
| U-Haul Self-Storage Division facility count | ~1,500 | U-Haul materials |
| Sun Belt oversupply threshold | 12-16 sqft/capita | Radius+ + Yardi Matrix |
| Construction cost inflation 2020-2024 | +28-45% | ENR + Turner + Mortenson |

### Site selection & supply test thresholds

| Market Tier | Healthy 3-Mile Sqft/Capita | Oversupplied Threshold | Land Cost Range |
|---|---|---|---|
| Primary urban (top-25 MSA) | 5-9 sqft/capita | >9-10 sqft/capita | $750K-$3.5M for 2-5 acre infill |
| Suburban primary (top-50 MSA) | 4-7 sqft/capita | >7-8 sqft/capita | $400K-$1.2M for 5-10 acre |
| Secondary MSA | 3-5 sqft/capita | >5-6 sqft/capita | $250K-$700K for 4-8 acre |
| Tertiary/rural | 2-4 sqft/capita | >4-5 sqft/capita | $150K-$600K for 3-7 acre |

### Construction cost stack by format

| Format | Construction Cost | Typical Footprint | Construction Timeline |
|---|---|---|---|
| Drive-up single-story | $45-$75/sqft | 30K-80K rentable sqft on 3-7 acres | 8-14 months |
| Hybrid (drive-up + climate) | $55-$110/sqft blended | 50K-80K rentable sqft on 4-7 acres | 10-18 months |
| Climate-controlled multi-story (3-4 story) | $90-$160/sqft | 70K-110K rentable sqft on 1-3 acres | 12-22 months |
| Infill multi-story top-25 MSA (5-7 story) | $110-$220/sqft | 60K-120K rentable sqft on 0.5-2 acres | 18-30 months |
| Big-box retail/industrial conversion | $35-$80/sqft | 30K-80K rentable sqft | 6-12 months |

### Startup capital stack by format and market tier

| Configuration | Total Capital | SBA 504 Eligible | Time to CO | Time to Stabilization |
|---|---|---|---|---|
| Rural/tertiary drive-up ground-up | $1.8M-$4.5M | Yes if <$5M | 14-24 months | 36-60 months |
| Secondary MSA drive-up or hybrid | $3M-$6M | Partial | 18-30 months | 36-54 months |
| Suburban hybrid drive-up + climate-controlled | $4.5M-$9M | No (over cap) | 18-30 months | 36-54 months |
| Top-25 MSA infill multi-story climate-controlled | $9M-$22M+ | No | 24-42 months | 48-72 months |
| Conversion of big-box retail/industrial | $2M-$8M | Partial | 9-15 months | 30-48 months |
| TPM contract acquisition | $300K-$750K | No | 90-120 days | N/A operate existing |
| Acquisition of stabilized facility | $3M-$25M+ | No | 4-6 months | Already stabilized |

### Stabilized cap rates & RevPAF by market tier

| Format / Market Tier | Stabilized Cap Rate | RevPAF (Annual) | NOI Margin |
|---|---|---|---|
| Top-25 MSA infill climate-controlled multi-story | 5.5-6.5% | $18-$26 | 67-72% |
| Top-25 MSA hybrid drive-up + climate | 6.0-7.0% | $14-$20 | 65-70% |
| Top-50 MSA drive-up suburban | 6.5-7.5% | $10-$15 | 63-68% |
| Top-50 MSA climate-controlled | 6.5-7.5% | $13-$18 | 63-68% |
| Secondary MSA drive-up | 7.0-8.0% | $8-$13 | 62-67% |
| Tertiary/rural drive-up | 8.0-9.5% | $7-$11 | 60-65% |
| Tertiary/rural hybrid | 8.5-10% | $8-$12 | 60-65% |

### Unit mix percentages and pricing by size

| Unit Size | % Of Typical Mix | Street Rate Median | Climate-Controlled Premium |
|---|---|---|---|
| 5x5 (closet) | 3-5% | $25-$85/mo | +25-50% |
| 5x10 (small) | 12-18% | $45-$135/mo | +20-45% |
| 10x10 (workhorse) | 22-30% | $95-$285/mo | +20-40% |
| 10x15 (mid-large) | 14-20% | $135-$385/mo | +15-35% |
| 10x20 (large) | 20-26% | $165-$485/mo | +15-30% |
| 10x30 (extra-large) | 6-12% | $235-$685/mo | +15-25% |
| Vehicle/RV/boat parking | 5-15% | $45-$185/mo | N/A (typically outdoor) |

### Revenue mix at mature stabilized facility

| Revenue Stream | % Of Revenue | Margin |
|---|---|---|
| Rental income (unit + parking) | 85-92% | 65-75% net of opex |
| Tenant insurance commission | 5-12% | 80-92% commission margin |
| Late fees | 1-3% | 95%+ margin |
| Administrative + admin fees + lock/box retail | 1-3% | 50-65% margin |
| U-Haul affiliate truck rental kickback | 0.5-2% | 50-70% margin |

### ECRI (Existing Customer Rate Increase) economics

| Metric | Typical Range | Notes |
|---|---|---|
| ECRI frequency | Every 6-12 months | After initial 4-6 month tenure |
| ECRI magnitude | 8-18% per event | REIT discipline higher than independent |
| Annual effective rate growth | 6-14% | Compounded across ECRI events |
| % Of same-store revenue growth from ECRI | 30-55% | Dominant economic lever |
| Customer move-out rate after ECRI | 5-12% incremental | Moving costs exceed rate increase for most |
| ECRI revenue capture vs theoretical maximum | 75-85% | Net of move-out losses |

### Tenant insurance economics

| Metric | Typical Range | Source |
|---|---|---|
| Attach rate | 65-85% of tenants | SBOA + Bader benchmarks |
| Monthly premium | $11-$22/mo | $2K-$10K coverage |
| Operator commission rate | 60-85% of premium | Agent program |
| Annual revenue per occupied sqft | $1.50-$3.50 | Pure margin |
| % Of facility NOI from tenant insurance | 8-15% | At mature stabilization |

### Operating expense breakdown at stabilized facility

| Cost Line | % Of Revenue | Notes |
|---|---|---|
| Property taxes | 12-18% | Highest in NJ/IL/TX/NY |
| Insurance | 4-9% | +30-60% 2023-2025 Sun Belt |
| Property management (TPM 5-7% or in-house) | 5-9% | TPM fee or self-operated labor |
| On-site labor (if staffed) | 3-7% | $45K-$95K total |
| Marketing + paid acquisition | 2-5% | SpareFoot + Google + organic |
| Repairs + maintenance | 2-4% | LED + HVAC + paving + roof |
| Utilities (especially climate-controlled HVAC) | 1-4% | Higher for climate facilities |
| Other operating (security + landscaping + admin) | 1-3% | |
| **Total Operating Expense Ratio** | **30-35%** | Stabilized norm |
| **NOI Margin** | **65-70%** | Stabilized norm |

### Five-year cash-flow trajectory: suburban hybrid 60K sqft facility

| Year | Physical Occupancy | Annual Revenue | Annual NOI | Yield-on-Cost |
|---|---|---|---|---|
| Year 1 (lease-up start) | 15-30% | $250K-$500K | $50K-$150K | 1-3% |
| Year 2 (velocity lease-up) | 50-70% | $700K-$1.2M | $300K-$600K | 4-8% |
| Year 3 (stabilization) | 85-94% | $1.1M-$1.6M | $650K-$1.05M | 8-12% |
| Year 4 (mature) | 90-94% | $1.15M-$1.7M | $720K-$1.15M | 9-13% |
| Year 5 (mature + ECRI) | 90-94% | $1.22M-$1.8M | $785K-$1.22M | 10-14% |

### Capital stack interest rates and lender categories

| Capital Layer | Loan-To-Cost/Value | Interest Rate Range 2024-2025 | Typical Lenders |
|---|---|---|---|
| SBA 504 senior bank loan | 50% LTC | 7.0-8.5% | Live Oak, Stearns, M&T, BMO |
| SBA 504 debenture | 40% LTC | 6.5-7.5% fixed 25 year | SBA via CDC |
| Equity (borrower) | 10% LTC | N/A | Borrower |
| Construction loan | 65-70% LTC | SOFR + 250-450bps | Wells, KeyBank, BMO, M&T |
| Bridge debt (lease-up) | 60-70% LTV | SOFR + 350-600bps | Walker & Dunlop, Madison Realty, ACORE |
| CMBS permanent | 65-75% LTV | 5.5-7.5% fixed 10-year | KeyBank, Wells, Goldman, Citi |
| Life company permanent | 55-65% LTV | 5.25-7.0% fixed 10-15 year | Prudential, MetLife, NY Life, Northwestern |
| LP equity | Above debt | 8-10% pref + promote | Family offices, dedicated funds |

### Exit multiples and buyer types

| Exit Path | Buyer Type | Cap Rate Range | Process Length | Best For |
|---|---|---|---|---|
| Independent sale to local operator | Single-asset local | 6.5-9.5% | 4-6 months | Rural + tertiary + single facility |
| Regional aggregator (Andover, Strat, SROA) | Mid-size operator | 6-8% | 5-8 months | Single or small portfolio |
| REIT acquisition (PSA / EXR / CUBE / NSA) | Public REIT | 5.5-7.5% | 6-12 months | Top-50 MSA + climate + 90%+ occupied + 25K+ sqft |
| PE portfolio (Prime / Heitman / Carlyle / Brookfield) | PE platform | 6-8% | 6-9 months | 3-15 facility portfolios |
| 1031 exchange (self-reinvestment) | Owner re-deployment | N/A defer | 180-day deadline | Owner-operators stepping up |
| TPM transition (retain ownership) | TPM operator | N/A retain | 90-120 days | Aging owners |

### REIT vs independent operator competitive metrics

| Metric | REIT (PSA/EXR/CUBE/NSA) | Independent Single-Asset |
|---|---|---|
| Customer acquisition cost | 15-25% lower | Higher (SpareFoot tax) |
| Brand recall + direct traffic | 50-65% of rentals | 5-15% of rentals |
| Revenue management sophistication | Daily dynamic pricing + ML | Manual or basic SiteLink |
| Tenant insurance attach rate | 75-85% | 55-70% |
| ECRI discipline | Every 6-9 months 8-18% | Less frequent or smaller |
| Property tax appeal expertise | In-house team | Outsourced or self |
| Cost of capital | 5.5-7.0% blended | 6.5-9.0% blended |
| Same-store revenue growth | 3-6% normal market | 1-4% normal market |

`;

const counter = `

## Counter-Case: When Self-Storage Is A Bad Bet

A serious self-storage developer or operator must stress-test the case above against the conditions that make this asset class a bad bet. The full 12-element counter-case:

**(1) Sun Belt oversupply 2022-2026 hangover.** The 2017-2022 construction wave pushed **FL/TX/AZ/NV/GA** to **12-16 sqft/capita** -- well above healthy 5-9. Phoenix, Tampa, Orlando, DFW, Vegas, Atlanta newer facilities still lease-up-incomplete 36-60 months post-CO with **15-30% concessions** and **occupancy stuck 70-85%**. If your submarket reads oversupplied on Radius+ + Yardi Matrix, **do not develop**.

**(2) Cap-rate compression reversal 2023-2025.** Caps compressed from **7-8% pre-2018 to 4.5-5.5% 2020-2022** as institutional capital flooded the class. Fed rate cycle reversed dramatically with caps **75-150bps wider 2023-2025**, repricing portfolios down 10-25%. CMBS slowed; refis difficult; bridge extensions necessary. 2021-2022 sub-5.5% cap acquisitions face brutal exit math.

**(3) Construction cost inflation +28-45% 2020-2024.** ENR + Turner + Mortenson show climate hard cost from $65-$110/sqft pre-2020 to $90-$160/sqft 2024. **Yield-on-cost compressed from 8.5-10% historical to 6.5-8% achievable** -- top-25 MSA infill deals math-marginal at best.

**(4) Insurance premium increases +30-60% 2023-2025.** Property insurance up **30-60%** especially **tornado/hurricane Sun Belt** (FL + TX coastal + AL + LA + Carolinas). Some carriers exited; remaining tightened on roof age + wind/hail + sprinklers. Insurance moved from **2-4% of revenue historical to 4-9% 2024+** -- compressing NOI.

**(5) Municipal moratoriums and NIMBY.** **SF 2018 moratorium** still in effect, **Boulder 2020-2024**, **Seattle multifamily-priority**, **Pasadena**, **Berkeley**, **Cambridge MA**, **Brooklyn**, **Portland OR**, widening suburban infill denials. Entitlement risk **6-18 months + 20-40% denial probability** in active anti-storage municipalities. Look elsewhere.

**(6) REIT consolidation closing acquisition arbitrage.** **EXR + Life Storage $12.7B 2023**, **CubeSmart + Storage West**, **PSA + Simply SSI** -- consolidation reduced institutional buyers. PSA + EXR + CUBE + NSA increasingly **selective** (top-50 MSA + climate + 90%+ + 25K+ + clean) and acquisition caps firmed **75-150bps 2023-2025**. Build-for-REIT-sale strategy harder to execute.

**(7) Discount-rate platform pricing wars.** SpareFoot + Storable Marketplace + StoragePay eroded historical 4-6% promotional floor to **5-8 days free + $1/first-month + free truck** in oversupplied markets. Promotional drag **8-15% of GPR** during lease-up. Independents pay SpareFoot fees (REITs do not) -- **15-25% CAC disadvantage** vs REIT brand walk-in.

**(8) ECRI consumer fatigue + regulation risk.** **CA + MD + NY considered** price-gouging legislation limiting ECRI above-CPI or during emergency declarations. SSA lobbied against. Consumer awareness grown via social media + news 2022-2025 with churn at first ECRI. **30-55% of same-store growth driven by ECRI is partially at risk** if regulation/behavior shifts.

**(9) Interest rate sensitivity on CMBS refis.** $10M CMBS originated 2020 at 3.75% refis 2030 at 6.5% -- **debt service +75-100%** at same balance. 2020-2022 vintage CMBS face **refinance walls 2025-2032**. Stress-test refi math at 6.5-7.5% with recapitalization plan.

**(10) Climate/insurance physical-risk reinsurance.** Tornado + hurricane + wildfire reinsurance compressed 2023-2025 with Munich Re + Swiss Re + Hannover Re + Lloyd's pulling FL/AL/TX/LA/MS/Carolinas coverage. **Escalating premiums + deductibles + co-insurance**; some carriers refusing renewal. Long-term insurability of Sun Belt facilities is open question.

**(11) Capital intensity vs adjacent CRE.** $1.8M-$22M+ per facility is comparable to small multifamily or strip-retail -- without multifamily's 12-month lease cash-flow durability or credit-tenant retail's tenant quality. Risk-adjusted returns may not justify capital intensity vs industrial small-bay flex, MHC, or single-tenant net-lease.

**(12) Adjacent asset classes that may fit better.** Consider **industrial outdoor storage (IOS)** vehicle/contractor parking lower-capex; **manufactured housing communities (MHC)** durable cash flow + sticky tenants; **small-bay industrial flex** 1K-5K sqft units with B2B base; **single-tenant net-lease** (Dollar General, Walgreens, Starbucks) credit-tenant + passive; **traditional multifamily** 12-month leases with sticky cash flow.

**Honest verdict.** Self-storage remains a viable institutional + entrepreneurial CRE asset class in 2027 if you (a) pass the **3-mile/5-mile/10-mile rentable-sqft-per-capita supply test** with explicit Sun Belt skepticism; (b) underwrite **18-36 month entitlement timeline + 18-36 month lease-up + 36-60 month total deal cycle** without compressing assumptions; (c) underwrite **6.5-8% achievable yield-on-cost** not historical 8.5-10% target; (d) maintain disciplined capital stack with SBA 504 (sub-$5M) + construction loan (65-70% LTC) + bridge debt for lease-up + CMBS for stabilized; (e) implement professional revenue management with ECRI + dynamic pricing + tenant insurance attach optimization (or contract Extra Space TPM / CubeSmart TPM / NSA TPM / Storage Asset Management); (f) plan **strategic exit early** (REIT acquisition vs PE portfolio vs 1031 step-up vs TPM retention); and (g) avoid Sun Belt oversupplied submarkets, top-cap-rate compression vintage acquisitions, and NIMBY-active municipalities. If any of these conditions fails -- particularly the supply test + yield-on-cost discipline + capital stack discipline -- self-storage becomes a capital-intensive way to underperform alternative CRE asset classes.

`;

const links = `

## Related Pulse Entries

- [[q9662]] -- How do you start a mobile IV therapy clinic in 2027? (sibling: capital + workforce + regulation framework parallel for service business adjacent to CRE)
- [[q9661]] -- How do you start a veterinary clinic in 2027? (sibling: real estate + facility build-out + zoning + workforce parallel)
- [[q9660]] -- How do you start a direct primary care DPC clinic in 2027? (sibling: facility-based recurring-revenue model adjacent)
- [[q9659]] -- How do you start a med spa in 2027? (sibling: facility build-out + zoning + ICC compliance parallel)
- [[q9657]] -- How do you start a home health agency in 2027? (sibling: workforce + insurance + service business framework)
- [[q9656]] -- How do you start a hospice care agency in 2027? (sibling: workforce + insurance framework)
- [[q9655]] -- How do you start a skilled nursing facility in 2027? (sibling: clinical facility CRE + state licensure parallel to self-storage as specialty CRE)
- [[q9653]] -- How do you start a memory care facility in 2027? (sibling: specialty CRE + state licensure)
- [[q9652]] -- How do you start an adult day care in 2027? (sibling: facility + state licensure)
- [[q9650]] -- How do you start an assisted living facility in 2027? (sibling: specialty senior-living CRE + state licensure parallel to self-storage CRE)
- [[q9630]] -- How do you start a senior in-home care service in 2027? (sibling: workforce + insurance framework)
- [[q9620]] -- How do you start a palliative care service in 2027? (sibling: workforce + insurance framework)
- [[q9601]] -- How do you set up a fractional CFO operation? (operational backbone applicable to multi-facility self-storage portfolio bookkeeping + financial reporting + DSCR monitoring)
- [[q9628]] -- Recent service-business launch entry (NEW STRUCTURE sibling)
- [[q9629]] -- Recent service-business launch entry (NEW STRUCTURE sibling)
- [[q9576]] -- How do you start an adult coding bootcamp in 2027? (sibling: state regulation + customer acquisition)
- [[q2117]] -- How do you start a post-construction cleanup business? (adjacent service business + customer acquisition + B2B)
- [[q1975]] -- How do you start a daycare in 2027? (sibling: facility + state licensure + zoning parallel)
- [[q1962]] -- How do you start a glamping business in 2027? (sibling: land + hospitality CRE + zoning parallel to self-storage land acquisition)
- [[q1965]] -- How do you start a party rental business in 2027? (sibling: storage + logistics + facility)
- [[q1966]] -- How do you start a bounce house rental business in 2027? (sibling: storage + warehouse + logistics)
- [[q1946]] -- How do you start a tutoring business in 2027? (Q&A baseline format sibling)
- [[q1947]] -- How do you start a notary business in 2027? (Q&A baseline format sibling)
- [[q1948]] -- How do you start a dog walking business in 2027? (Q&A baseline format sibling)
- [[q1949]] -- How do you start a personal training business in 2027? (Q&A baseline format sibling)
- [[q1950]] -- How do you start a yoga studio in 2027? (Q&A baseline format sibling)
- [[q1951]] -- How do you start a meal prep business in 2027? (Q&A baseline format sibling)
- [[q1952]] -- How do you start a podcast network in 2027? (Q&A baseline format sibling)
- [[q1953]] -- How do you start a virtual assistant business in 2027? (Q&A baseline format sibling)
- [[q1954]] -- How do you start a property management business in 2027? (Q&A baseline format sibling, adjacent CRE management)
- [[q1942]] -- How do you start a service business in 2027? (Q&A baseline format sibling)
- [[q1139]] -- Adjacent service business operating framework
- [[q1127]] -- Adjacent service business operating framework

`;

const tags = ['self-storage','storage-facility','climate-controlled-storage','drive-up-storage','public-storage-psa','extra-space-exr','cubesmart-cube','sba-504','cmbs-stabilized','2027'];

const sources = [
  { title: 'Self-Storage Association (SSA)', url: 'https://www.selfstorage.org' },
  { title: 'Inside Self-Storage', url: 'https://www.insideselfstorage.com' },
  { title: 'Public Storage (NYSE: PSA)', url: 'https://www.publicstorage.com' },
  { title: 'Extra Space Storage (NYSE: EXR)', url: 'https://www.extraspace.com' },
  { title: 'CubeSmart (NYSE: CUBE)', url: 'https://www.cubesmart.com' },
  { title: 'Radius+ supply analysis', url: 'https://www.radiusplus.com' },
  { title: 'Janus International (NYSE: JBI) Nokē Smart Entry', url: 'https://www.janusintl.com' }
];

const notes = {
  s6: 'Added 75 cited sources spanning industry trade (Self-Storage Association SSA + Inside Self-Storage + Yardi Matrix Self-Storage + STR Self-Storage CoStar + Radius+ + Union Realtime), public REITs (Public Storage NYSE PSA ~3,000 facilities + 218M sqft + $47B-$58B market cap founded 1972 + Extra Space Storage NYSE EXR ~3,800 facilities post-Life Storage merger 2023 $12.7B deal + 280M sqft + $35B-$45B market cap third-party management leader + CubeSmart NYSE CUBE ~1,500 facilities + 105M sqft + National Storage Affiliates NYSE NSA ~1,000 facilities + 60M sqft Participating Regional Operator structure), private operators (Prime Storage Blackstone ~280 + StorageMart ~250 + MetroStorage ~140 + U-Haul Self-Storage Division ~1,500 + William Warren Group StorQuest ~190 + Westport Properties ~100 + SROA Capital + Reliant + Andover + Heitman + Strat + Spartan Investment Group FreeUp Storage), property management software (SiteLink Storable dominant 40-50% market share + Easy Storage Solutions 15-20% + Storage Commander 10-15% + Doorswap Storable 8-12% + Storedge), smart entry (Janus International NYSE JBI Nokē Smart Entry dominant 50-60% + OpenTech IoE + PTI Security + Salto KS), tenant insurance (SBOA Tenant Insurance + Bader Company + Ponderosa Insurance + MiniCo), gate access (DoorKing + Liftmaster Commercial + FAAC USA + HySecurity + Sentex + OpenPath), surveillance (Avigilon + Hanwha Vision America + Axis Communications + Eagle Eye Networks + Verkada), aggregator marketplace (SpareFoot acquired by Storable 2020 + Storable Marketplace + Google Local Services Ads + Google My Business), capital sources (SBA 504 Loan Program up to $5M + CMBS conduit lending overview), construction benchmarks (ENR Building Cost Index + Turner Building Cost Index + Mortenson Construction Cost Index showing +28-45% inflation 2020-2024), code/compliance (ICC International Building Code IBC Group S-1 + NFPA 13 Sprinklers + ADA National Network), zoning/moratoriums (San Francisco 2018 moratorium + Boulder CO 2020-2024 restrictions + Seattle 2021-2024 multifamily-priority zoning), move-management referral (Caring Transitions + Smooth Transitions + MoveOn Move Management), TPM operators (Storage Asset Management + Absolute Storage Management + Argus Self Storage Sales Network), brokerage/research (Green Street Self-Storage Research + Marcus & Millichap National Self-Storage + JLL Self-Storage Capital Markets + Cushman & Wakefield + Newmark + Colliers + Argus Self-Storage Advisors), and adjacent asset class (Iron Mountain Outdoor Storage IOS NYSE IRM).',
  s7: 'Added comprehensive numbers block with 15 markdown pipe tables covering: industry size and operator landscape (US ~52,000-60,000 facilities + ~2.1B-2.3B rentable sqft + $28B-$32B 2024 revenue + ~6.5-7.0 sqft/capita highest globally + ~11-12% household penetration + 35-42M Americans + REIT/private/independent share + PSA 3,000/218M + EXR 3,800/280M post-Life Storage $12.7B + CUBE 1,500/105M + NSA 1,000/60M + U-Haul 1,500 + Sun Belt 12-16 sqft/capita oversupply + ENR construction +28-45%); site selection thresholds across 4 market tiers (primary urban + suburban primary + secondary MSA + tertiary/rural with healthy + oversupplied + land cost ranges); construction cost stack by 5 formats (drive-up $45-$75/sqft + hybrid $55-$110 + climate multi-story $90-$160 + infill top-25 5-7 story $110-$220 + big-box conversion $35-$80 with footprints and timelines); startup capital stack by 7 configurations (rural drive-up $1.8M-$4.5M + secondary $3M-$6M + suburban hybrid $4.5M-$9M + top-25 infill $9M-$22M+ + conversion $2M-$8M + TPM acquisition $300K-$750K + stabilized acquisition $3M-$25M+); stabilized cap rates and RevPAF across 7 market/format combinations (5.5% top-25 climate to 10% tertiary rural with RevPAF $5-$26); unit mix percentages and pricing across 7 sizes with climate premium; revenue mix 5 streams at mature stabilized; ECRI economics 6 metrics (frequency 6-12 months + magnitude 8-18% + annual effective 6-14% + 30-55% same-store growth + move-out 5-12% + capture 75-85%); tenant insurance economics 5 metrics (65-85% attach + $11-$22/mo + 60-85% commission + $1.50-$3.50 per sqft + 8-15% NOI contribution); operating expense breakdown 8 cost lines totaling 30-35% opex 65-70% NOI; 5-year cash-flow trajectory for suburban hybrid 60K sqft facility (Year 1 $250K-$500K rev to Year 5 $1.22M-$1.8M with yield-on-cost 1-3% lease-up to 10-14% mature); capital stack interest rates across 8 layers (SBA 504 + construction loan SOFR+250-450 + bridge debt SOFR+350-600 + CMBS 5.5-7.5% + life co + LP equity); exit multiples and 6 buyer types (independent + regional + REIT + PE portfolio + 1031 + TPM); REIT vs independent operator competitive metrics 8 dimensions (CAC + brand recall + revenue management + tenant insurance + ECRI + property tax + cost of capital + same-store growth).',
  s8: 'Added 12-element counter-case: Sun Belt oversupply 2022-2026 hangover (FL/TX/AZ/NV/GA 12-16 sqft/capita Phoenix Tampa Orlando DFW Vegas Atlanta extended lease-up 36-60 months 15-30% concessions 70-85% occupancy stuck do-not-develop if oversupplied); cap-rate compression reversal 2023-2025 (7-8% pre-2018 to 4.5-5.5% 2020-2022 reversing 75-150bps wider repricing portfolios down 10-25% CMBS slowing refi difficult bridge extensions); construction cost inflation +28-45% 2020-2024 (ENR Turner Mortenson climate-controlled $65-$110 to $90-$160 yield-on-cost 8.5-10% to 6.5-8% top-25 infill math-marginal); insurance premium increases +30-60% 2023-2025 (tornado/hurricane Sun Belt FL TX coastal AL LA Carolinas tornado alley carriers exiting tightening underwriting on roof age wind/hail sprinkler insurance 2-4% to 4-9% of revenue compressing NOI no clear inflection); municipal moratoriums and NIMBY (San Francisco 2018 moratorium Boulder CO 2020-2024 Seattle 2021-2024 multifamily priority Pasadena Berkeley Cambridge MA Brooklyn Portland 6-18 months 20-40% denial probability); REIT consolidation closing arbitrage (EXR+Life Storage $12.7B 2023 CubeSmart+Storage West PSA+Simply SSI top-50 MSA climate 90%+ 25K+ acquisition cap firmed 75-150bps); discount-rate platform pricing wars (SpareFoot Storable Marketplace StoragePay 5-8 days free $1 first-month promotional drag 8-15% of GPR independents pay SpareFoot fees REITs do not 15-25% CAC disadvantage); ECRI consumer fatigue + state regulation risk (CA MD NY considered price-gouging legislation limiting ECRI above-CPI or emergency declarations SSA lobbying social media news coverage 2022-2025 churn at first ECRI 30-55% same-store growth partially at risk); interest rate sensitivity CMBS refinancings ($10M 2020 3.75% refi 2030 6.5% debt service +75-100% 2020-2022 vintage refinance walls 2025-2032 stress-test refi at 6.5-7.5% recapitalization plan); climate/insurance physical-risk reinsurance compression (Munich Re Swiss Re Hannover Re Lloyd s pulling FL AL TX LA MS Carolinas tornado/hurricane premiums deductibles co-insurance escalating some refusing renewal long-term insurability open question Sun Belt growth markets); capital intensity vs adjacent CRE ($1.8M-$22M+ comparable small multifamily strip-retail no cash-flow durability of multifamily 12-month leases no tenant-credit quality of credit-tenant retail risk-adjusted returns may not justify); adjacent asset classes (industrial outdoor storage IOS vehicle/contractor parking lower capital simpler ops similar cap + MHC manufactured housing durable cash flow sticky tenants lower capex + small-bay industrial flex B2B tenant + single-tenant net-lease Dollar General Walgreens Starbucks credit-tenant + traditional multifamily 12-month leases) -- with honest 7-condition verdict on who should and should not develop.',
  s9: 'Cross-linked 32 related Pulse entries: q9662 mobile IV therapy (sibling capital workforce regulation framework parallel for service business adjacent to CRE) + q9661 veterinary clinic (sibling real estate facility build-out zoning workforce parallel) + q9660 DPC (facility-based recurring revenue) + q9659 med spa (facility + zoning + ICC compliance parallel) + q9657 home health + q9656 hospice + q9655 SNF (specialty clinical CRE state licensure parallel to self-storage as specialty CRE) + q9653 memory care + q9652 adult day care + q9650 assisted living (specialty senior-living CRE parallel) + q9630 senior in-home + q9620 palliative (workforce framework) + q9601 fractional CFO (operational backbone applicable to multi-facility self-storage portfolio bookkeeping financial reporting DSCR monitoring) + q9628/q9629 NEW STRUCTURE siblings + q9576 adult coding bootcamp + q2117 post-construction cleanup + q1975 daycare (facility state licensure zoning parallel) + q1962 glamping (land + hospitality CRE + zoning parallel to self-storage land acquisition) + q1965 party rental + q1966 bounce house (storage warehouse logistics) + q1942/q1946-q1954 baseline Q&A format siblings including q1954 property management (adjacent CRE management) + q1127/q1139 service business framework.',
  s10: 'SUBAGENT_VERIFIED. Lean deep baseline of the self-storage facility business startup playbook for 2027 matching the actual question "How do you start a self-storage facility business in 2027?" Built under NEW VALUE-NOT-WORDCOUNT MANDATE: target 8,000-10,500 words with tight paragraphs (2-3 sentences max), frequent H3 breaks, no walls of text. Structure: Bottom Line callout (3 punchy bullets Capital/Margins/Hardest part with bold-tag labels hitting site selection + 3/5/10-mile supply test + zoning + entitlement + NIMBY + Sun Belt oversupply + construction cost inflation + cap-rate compression reversal + insurance premium increases + REIT consolidation + discount platform + ECRI + PSA + EXR + CUBE + NSA + Prime + StorageMart + Janus Noke + SiteLink + SBOA + Bader + Ponderosa + Extra Space TPM + CubeSmart TPM + Storage Asset Management + SBA 504 + CMBS + bridge debt + construction loans), then 3 short paragraphs distinguishing self-storage from moving services + valet storage (Clutter MakeSpace) + records management (Iron Mountain) + portable container (PODS) + industrial outdoor storage IOS, then TOC block listing 13 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit) with horizontal rule separators, then LEAN H3 deep content sections inside each PART (3-4 sections per PART, tight 2-3 sentence paragraphs, no padding). flow contains exactly 2 mermaid diagrams (operating journey from site identification through supply test + zoning + entitlement + capital stack + construction + ICC ADA + smart entry + PMS + lease-up + ECRI + stabilization + 7-path strategic exit; decision matrix for format selection top-25 infill multi-story vs suburban hybrid vs secondary drive-up vs rural drive-up vs big-box conversion vs acquisition vs TPM with cap rates and timelines). src has 75 cited sources with real URLs covering SSA + Inside Self-Storage + Yardi Matrix + STR + Radius+ + Union Realtime + Green Street + Marcus & Millichap + JLL + Cushman Wakefield + Newmark + Colliers + Argus + PSA + EXR + CUBE + NSA + Prime + StorageMart + MetroStorage + U-Haul + William Warren StorQuest + Westport + SROA + Reliant + Andover + Heitman + Strat + Spartan FreeUp + SiteLink + Storable + Easy Storage Solutions + Storage Commander + Doorswap + Janus International NYSE JBI Noke + OpenTech IoE + PTI + Salto KS + SBOA + Bader + Ponderosa + MiniCo + DoorKing + Liftmaster + FAAC + HySecurity + Sentex + OpenPath + Avigilon + Hanwha + Axis + Eagle Eye + Verkada + SpareFoot + Storable Marketplace + Google LSA + Google My Business + SBA 504 + CMBS + ENR + Turner + Mortenson + ICC IBC + NFPA 13 + ADA + San Francisco moratorium + Boulder + Seattle + Caring Transitions + Smooth Transitions + MoveOn + Storage Asset Management + Absolute Storage Management + Argus Sales Network + Iron Mountain Outdoor Storage IOS. num is comprehensive 15-table benchmark block (industry size + supply test thresholds + construction cost by 5 formats + startup capital by 7 configs + stabilized cap rates and RevPAF across 7 + unit mix and pricing 7 sizes + revenue mix 5 + ECRI economics 6 + tenant insurance economics 5 + operating expense 8 lines + 5-year cash-flow trajectory + capital stack interest rates 8 layers + exit multiples 6 buyer types + REIT vs independent 8 dimensions). counter is 12-element counter-case with Sun-Belt-oversupply / cap-rate-compression-reversal / construction-cost-inflation / insurance-premium-increases / municipal-moratoriums-NIMBY / REIT-consolidation-arbitrage / discount-platform-pricing-wars / ECRI-consumer-fatigue-regulation / interest-rate-sensitivity-CMBS / climate-insurance-reinsurance-compression / capital-intensity-vs-adjacent-CRE / adjacent-asset-classes-may-fit-better failure modes and honest 7-condition verdict. links cross-references 32 related entries with q9662 mobile IV + q9661 veterinary + q9660 DPC + q9659 med spa + q9655 SNF + q9650 assisted living as siblings (CRE + facility + state licensure parallels), q9628/q9629 NEW STRUCTURE, q9601 operational backbone, q1962 glamping land/hospitality CRE, q1954 property management adjacent CRE, q1942/q1946-q1954 baseline siblings. All numbers grounded in real SSA + Inside Self-Storage + Yardi Matrix + STR + Radius+ + Green Street + Marcus & Millichap + JLL self-storage benchmarks + PSA/EXR/CUBE/NSA 10-Ks + EXR Life Storage 2023 $12.7B merger + ENR Turner Mortenson construction cost +28-45% / SBA 504 program / CMBS conduit / ICC IBC Group S-1 / NFPA 13 / ADA / San Francisco moratorium 2018 / Boulder CO 2020-2024 / Seattle 2021-2024 / Janus International NYSE JBI Noke smart entry / SiteLink Storable / SBOA Bader Ponderosa MiniCo tenant insurance / Extra Space CubeSmart NSA TPM. ASCII-clean throughout. Lean target 8,000-10,500 words honored.'
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
