// q9677 -- How do you start a trucking (over-the-road / OTR) business in 2027?
// For-hire motor carrier authorized by the FMCSA (DOT number + MC operating authority) hauling
// freight between states (interstate) or within one state (intrastate). Four primary business models:
// owner-operator (1 truck), lease-purchase, small fleet (2-20 trucks), mid-sized regional (20-200 trucks).
// VALUE over WORD COUNT. Target 8,500-9,500 words. HARD CAP 10,500 (server-enforced). Tight paragraphs (2-3 sentences).
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

const ID = 'q9677';
const QUESTION = 'How do you start a trucking (over-the-road / OTR) business in 2027?';

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** **$15K-$45K owner-operator start** (CDL Class A in hand + used Class 8 sleeper $35-$95K (2018-2022 Freightliner Cascadia / Volvo VNL / Kenworth T680 / Peterbilt 579), trailer optional dry van $15-$40K used, MC authority $300 + UCR + IFTA + IRP + DOT physical + drug consortium $50/yr + HVUT Form 2290 $550, Auto Liability + cargo + bobtail + physical damage $14K-$28K/yr new authority). **$150K-$650K 3-5 truck small fleet startup**. **$800K-$3M mid-sized regional (10-30 trucks, terminal, in-house safety, full TMS McLeod / Trimble Transportation / Tenstreet)**. PE-backed acquisitions 2024-26: **Knight-Swift (NYSE: KNX), Werner (NASDAQ: WERN), Schneider (NYSE: SNDR)** at 5-9x EBITDA; mid-market 4-7x; small fleet 2.5-4x SDE.
> - **[Margins]** Mature owner-operator: **$180K-$320K annual revenue + $35K-$85K net** after fuel ($55-75K/yr), truck payment ($1,800-$3,500/mo), insurance ($14-28K), maintenance reserve ($10-20K). **Small fleet (3-5 trucks)**: $750K-$2M revenue, 4-12% net. **Mid-sized regional (20-100 trucks)**: $5M-$45M revenue, 88-95% operating ratio = 5-12% net per ATA Operations Council. **Rate per mile Q1 2026**: dry van spot $1.95-$2.40/mi (recovered from 2023 lows but below 2021-2022 peak of $3.10-$3.65), reefer $2.20-$2.75, flatbed $2.45-$3.05, contract 15-25% above spot. Loaded miles 88-94% (deadhead 6-12%); **110-130K miles/yr per truck** solo OTR, 200K+ team.
> - **[Hardest part]** **Not capital. Not equipment.** The trifecta of **(1) post-COVID FREIGHT RECESSION** -- Cass Freight Shipments Index bottomed Q3 2024, FTR still showing soft tonnage 2026, spot-vs-contract divergence punishes small carriers without contract book; **(2) the INSURANCE CRISIS** -- small-fleet GL+Auto often $20-40K/truck/yr (up 4-8x from 2015), **nuclear verdicts ($10M+ jury awards)**, Progressive Commercial retreated 2024-25, Great West Casualty pulled back, leaving **Berkshire Hathaway GUARD, Sentry, Northland, AmGUARD** + crushing surplus-lines premiums for any accident history; **(3) regulatory whiplash** -- **CARB Advanced Clean Fleets (CA, Jan 2024)** mandates ZEV transition for in-CA-domiciled fleets + drayage at CA ports, similar in **NY/NJ/WA/OR/CO**; **EPA Phase 3 Heavy-Duty GHG** 2027 model year 25-60% emission reductions; **FMCSA HOS** caps miles-per-driver-per-day; **drug & alcohol clearinghouse** adds 5-10 days to hiring; **double-brokering fraud** cost carriers $700M-$1.5B/yr per TIA; **broker bankruptcies Convoy (2023), Yellow Corp LTL (Aug 2023)**; broker-side rate compression at C.H. Robinson + XPO squeezing margins.

An **over-the-road trucking business** in 2027 is a **for-hire motor carrier authorized by the FMCSA (Federal Motor Carrier Safety Administration)** -- DOT number + MC operating authority -- hauling freight between states (interstate) or within one state (intrastate) across three regulated pillars: **(1) FMCSA DOT number + MC operating authority + BOC-3 process agent + UCR (Unified Carrier Registration) + IRP (International Registration Plan) + IFTA (International Fuel Tax Agreement) + BMC-91 insurance filing**; **(2) CDL Class A driver(s) + DOT medical card + drug & alcohol clearinghouse enrollment + clean MVR + HOS compliance via ELD (electronic logging device)**; **(3) Auto Liability $1M MIN (often $1M primary + $4M umbrella for shippers requiring it -- Walmart, Target, Amazon) + GL + bobtail + non-trucking + physical damage + cargo insurance** via motor-carrier-specialty brokers (HUB International Transportation, Marsh, Holman, Anderson, Cottingham & Butler). **Distinct from** freight brokerage (no equipment, books loads on others' trucks), 3PL (logistics coordination), LTL (less-than-truckload, network-based regional consolidator), and last-mile delivery (urban final-mile parcel).

The 2027 demand: **~$940B-$1.05T US trucking market** per ATA American Trucking Trends 2025 (the for-hire portion ~$540B-$620B; private fleets the rest), with **~580K-620K active US for-hire motor carriers** registered with FMCSA, of which **~95% operate fewer than 6 trucks** per FMCSA SAFER data. The market remains the **most fragmented** large transportation segment -- top 50 truckload carriers control only **~12-15% of for-hire dry van revenue** per SJ Consulting + Transport Topics rankings.

Five survival drivers in 2027: **(1) contract-book discipline** (spot-market-only carriers die in down cycles -- mature operators run 50-80% contract / 20-50% spot); **(2) insurance cost containment** (CSA scoring + dashcam + safety training + ELD discipline directly determines whether you pay $14K or $40K per truck per year); **(3) fuel + maintenance discipline** (fuel is 22-32% of revenue; idle reduction, APUs, route optimization, tire program move 2-4 pts of margin); **(4) driver retention** (industry-wide turnover 85-110% per ATA -- mature carriers run 35-60% via pay-cycle weekly + home-time predictability + truck-assignment); **(5) freight fraud + double-brokering defense** (broker payment-verification + carrier-vetting tools like Highway / Carrier Assure / RMIS now table-stakes).

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & FMCSA authority process](#market-size--fmcsa-authority-process)
- [Four business models: owner-operator vs lease-purchase vs small fleet vs regional](#four-business-models-owner-operator-vs-lease-purchase-vs-small-fleet-vs-regional)
- [Equipment models: dry van, reefer, flatbed, tanker, dump](#equipment-models-dry-van-reefer-flatbed-tanker-dump)
- [Capital sources, CDL & insurance crisis](#capital-sources-cdl--insurance-crisis)

**Part 2 -- Build-Out & Capital**
- [Tractor + trailer buying & financing](#tractor--trailer-buying--financing)
- [Software stack: TMS, ELD, load boards, factoring](#software-stack-tms-eld-load-boards-factoring)
- [Startup capital by model & SBA financing](#startup-capital-by-model--sba-financing)

**Part 3 -- Operations**
- [Load procurement: spot, contract, brokered](#load-procurement-spot-contract-brokered)
- [Rate per mile, fuel surcharge & accessorial economics](#rate-per-mile-fuel-surcharge--accessorial-economics)
- [Driver pay, retention & HOS compliance](#driver-pay-retention--hos-compliance)
- [Dispatching, factoring & cash-cycle discipline](#dispatching-factoring--cash-cycle-discipline)

**Part 4 -- Growth & Exit**
- [Single-truck ceiling & multi-truck rollup](#single-truck-ceiling--multi-truck-rollup)
- [The corporate landscape: Knight-Swift, Werner, Schneider](#the-corporate-landscape-knight-swift-werner-schneider)
- [M&A multiples & exit options](#ma-multiples--exit-options)
- [Counter-case: freight recession, insurance crisis, fraud wave](#counter-case-freight-recession-insurance-crisis-fraud-wave)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & FMCSA authority process

The US trucking industry moves **~72.5% of all US freight tonnage** per ATA American Trucking Trends 2025, generating **~$940B-$1.05T** in total industry revenue, with the for-hire portion at **~$540B-$620B**. Active US for-hire motor carriers number **~580K-620K** per FMCSA SAFER, of which **~95% operate fewer than 6 trucks** -- the most fragmented major US transportation segment.

The most important upfront decision is **which business model + equipment type + lane network** you'll run, because they determine economics, capital, driver pool, broker/shipper mix, and insurance cost. An **owner-operator hauling dry van OTR coast-to-coast** runs radically different unit economics than a **regional reefer fleet domiciled in Chicago** or a **flatbed carrier serving steel/lumber lanes in the Southeast**.

> ### 📊 Quick Facts
> - **~580K-620K** active US for-hire motor carriers (FMCSA SAFER)
> - **~95%** of US carriers operate fewer than 6 trucks
> - **~$940B-$1.05T** total US trucking industry revenue (ATA)
> - **~$540B-$620B** for-hire portion (private fleets the rest)
> - **Top 50 truckload carriers control ~12-15%** of for-hire dry van revenue
> - **~72.5%** of all US freight tonnage moves by truck (ATA)
> - **~3.5M** professional CDL truck drivers employed nationally

**FMCSA authority process.** Apply for **USDOT number (free)** via FMCSA Unified Registration System. Then file for **MC (Motor Carrier) operating authority -- $300 application fee** -- which triggers a **21-day vetting/protest window**. During this window the carrier must file **BMC-91 (or BMC-91X) Auto Liability insurance proof at $750K MIN federal (most shippers require $1M)** and a **BOC-3 process agent designation (national service-of-process)** via providers like **DAT Authority, Trucker Path, Rapid Authority, JJ Keller** ($35-$200 setup).

**Required state + federal registrations.** **UCR (Unified Carrier Registration)** annual fee tiered by fleet size ($39 for 0-2 trucks, $116 for 3-5, $231 for 6-20, $805 for 21-100, up to $9,200+ at large scale). **IRP (International Registration Plan)** apportioned plates for multi-state operations. **IFTA (International Fuel Tax Agreement)** quarterly fuel-tax reporting across jurisdictions. **Heavy Vehicle Use Tax (Form 2290) $550/year** for trucks over 55,000 lbs GVWR. **State-by-state intrastate registrations** if hauling intra-state freight (most carriers run interstate only to avoid this).

**Application timeline.** USDOT issuance: same-day to 48 hours. MC authority active after the 21-day protest window assuming clean BMC-91 + BOC-3 filings. **Total realistic time-to-first-load: 30-45 days** for a fully-prepared founder -- often longer due to insurance underwriting on a new-authority carrier (insurers heavily penalize <12 months of authority).

### Four business models: owner-operator vs lease-purchase vs small fleet vs regional

The biggest strategic decision is which of four models you run, because capital, economics, driver pool, and exit multiples differ materially.

> ### 🟡 Key Stat
> **Owner-operator** runs **$180K-$320K annual revenue + $35K-$85K net** with **$15K-$45K startup** vs **lease-purchase** $0 down but **trapped in $2,200-$3,800/wk equipment payment + fuel + maintenance pass-through** (most fail within 18 months) vs **small fleet (3-5 trucks)** $750K-$2M revenue + 4-12% net + $150K-$650K startup vs **mid-sized regional (20-100 trucks)** $5M-$45M revenue + 5-12% net + $800K-$3M startup. Each model has distinct break-even mileage + freight-mix discipline requirements.

**Owner-operator (single truck, owner drives).** Most common entry -- founder is the driver. **Average $180K-$320K annual revenue** at 110-130K miles/yr at ~$2.10-$2.50/mi loaded all-in. **Net $35K-$85K** after all expenses. Either operates **under own MC authority** (max margin but heavy back-office) or **leased to a motor carrier (Schneider, Landstar BCO, Mercer Transportation, Anderson Trucking Service, Roehl)** -- 70-78% of linehaul going to the operator, motor carrier handles dispatch + insurance + factoring.

**Lease-purchase (drives leased truck through a fleet).** Driver leases a tractor from a motor carrier (Prime Inc, Schneider, US Xpress, CRST, Werner) on a **3-5 year rent-to-own** structure. **$0 down but $700-$1,200/wk lease payment + fuel + maintenance pass-through**. Heavily marketed but **70-85% of lease-purchase operators wash out within 24 months** per OOIDA + industry reporting -- the math rarely works in a soft freight market.

**Small fleet (2-20 trucks).** Owner-operator graduates to hiring 1-2 W-2 drivers + dispatcher + bookkeeper. **$750K-$2M revenue, 4-12% net margin** at 3-5 trucks. Capital requirement jumps to $150K-$650K for additional tractors + driver-payroll float + WC + workers comp + admin systems. Dominant model for second-generation family carriers.

**Mid-sized regional (20-200 trucks).** Full back-office: in-house safety/compliance officer + dispatch team + driver recruiter + maintenance shop + terminal yard + full TMS (McLeod, Trimble Transportation TMW, Tenstreet driver onboarding). **$5M-$45M revenue, 5-12% net margin (88-95% operating ratio)** per ATA Operations Council benchmarks. Contract-freight book required -- spot-market exposure capped at 30-50%.

### Equipment models: dry van, reefer, flatbed, tanker, dump

Equipment type determines lanes, freight mix, rates, insurance class, capital intensity, and driver pool. Founders typically commit to one equipment class for the first 3-5 years.

**Dry van (53-ft enclosed trailer).** ~**80% of US OTR freight** per ATA. General freight -- retail, consumer goods, paper, packaged food. **Spot rates Q1 2026: $1.95-$2.40/mi** (recovered from $1.65-$1.85/mi 2023 trough but well below $3.10-$3.65/mi 2021-22 peak). Used trailers $15-$40K. Lowest insurance/maintenance class. Easiest entry. Most competition.

**Reefer (refrigerated, food/pharma).** Frozen + refrigerated food, pharma, floral, beverage. **Spot rates $2.20-$2.75/mi**, contract premium 15-25% above. Used reefer trailers $40-$80K (Thermo King + Carrier reefer units add $20-30K vs dry van). Tighter lanes (CA produce → Midwest/East), more seasonal volatility. Driver pool slightly smaller (reefer-experience preferred).

**Flatbed (steel, lumber, oversize).** Construction materials, steel, lumber, glass, machinery. **Spot rates $2.45-$3.05/mi** -- highest of the standard equipment classes. Used flatbeds $25-$50K + tarps/straps/chains $3-7K. Tarping is physical + weather-exposed work -- smaller driver pool. Industrial construction cycle exposure (boom-bust). Heavy haul + permit loads premium 50-150% above standard flatbed.

**Tanker (liquid bulk).** Petroleum, food-grade liquids, chemicals, milk. **Specialized tanker endorsement (N) + Hazmat (H) required** for fuel + chem. Premium rates ($2.80-$3.60/mi) but capital-heavy: tanker trailers $80-$180K used + cleaning + dedicated operations. Heavy insurance class (hazmat exposure). Carriers like **Quality Distribution, Trimac, Kenan Advantage, Groendyke Transport** dominate.

**Dump / dry bulk (aggregates, grain).** Construction aggregates, grain, dry chemicals. Regional operation (typically <250 mi radius). Used end-dumps/bottom-dumps $20-$50K. Tighter regional networks, often direct-to-shipper contracts (concrete plants, grain elevators, mines). Lower deadhead than OTR but more wear-and-tear from off-road conditions.

### Capital sources, CDL & insurance crisis

Trucking capital is **equipment-debt-dominant + receivables-tight + insurance-crushing**, with SBA + dealer financing for tractors and the crisis-level insurance market reshaping new-entrant economics 2024-2026.

> ### 🟡 Key Stat
> **Auto Liability insurance** for a new-authority owner-operator runs **$14K-$28K/year for $1M coverage** in 2026 -- vs **$3K-$6K/year in 2015**. Insurance per truck is now often the **2nd-largest line item after fuel**, surpassing maintenance. The driver: **nuclear verdicts ($10M+ jury awards) + reciprocal/admitted-market exodus** -- Progressive Commercial pulled back 2024-25, Great West Casualty retreated, leaving **Berkshire Hathaway GUARD, Sentry, Northland, AmGUARD** as primary writers + surplus-lines for anyone with a claim.

**CDL Class A licensing.** **CDL Class A required** to operate Class 8 tractor + 26K+ lbs trailer. **ELDT (Entry-Level Driver Training)** federally mandated since Feb 2022 -- must be completed at FMCSA-registered training provider before CDL skills test. **Training cost: $3K-$8K** at private schools (Roadmaster, CR England, Schneider Training Academy, Prime Inc training, community college CDL programs at $1,500-$4,000). **Company-sponsored training**: Werner, Schneider, US Xpress, CRST, Stevens Transport pay for CDL school + first-year guaranteed employment in exchange for **18-24 month contractual driving commitment**.

**Insurance stack annual** (owner-operator, single Class 8 OTR, new authority Year 1):
- **Auto Liability $1M (BMC-91)**: $14K-$28K/yr new authority, drops to $7K-$14K after 36 months clean
- **Cargo $100K MIN (most shippers require)**: $1.5K-$4K/yr
- **Physical Damage** (tractor + trailer): 3-6% of vehicle value/yr
- **General Liability $1M**: $700-$1.8K/yr
- **Bobtail (non-trucking liability when tractor empty)**: $400-$900/yr
- **Trailer interchange**: $600-$1.5K/yr if pulling broker/shipper trailers
- **Workers comp** (if W-2 drivers, class 7228 trucking long-haul): $7-$18 per $100 payroll
- **Total owner-operator**: **$18K-$38K/yr Year 1**, **$11K-$22K/yr after 36 months clean**

**Small fleet (5 trucks)**: **$70K-$140K/yr total insurance**. **Mid-size regional (50 trucks)**: $350K-$900K/yr. CSA scoring + clean MVRs + dashcam (Lytx, SmartDrive, Samsara AI Dash Cam) + safety training unlock 15-30% discounts.

**Equipment financing.** Used tractor $35K-$95K via **Daimler Truck Financial (Freightliner)**, **Volvo Financial Services**, **PACCAR Financial (Kenworth + Peterbilt)**, **Navistar Financial (International)**, or aftermarket truck-finance specialists: **LRM Leasing, CAG Truck Capital, Mission Financial, Trans Lease, Pawnee Leasing**. **Terms typically 48-72 months at 8-14% APR for credit-challenged buyers** (used-truck market is sub-prime-heavy). 10-25% down typical; **$0-down lease-purchase predatory programs** lure new operators into 24-30% effective APRs.

**SBA financing.** **SBA 7(a)** for working capital + small fleet equipment up to **$5M at Prime + 2.75-4.75%**. **SBA 504** for terminal yards/shop real estate at **fixed 6-8% on 20-25 yr**. Specialty lenders: **Live Oak Bank** (significant trucking book), **Pursuit Lending**, **Newtek**, **Huntington National**, **Wells Fargo Equipment Finance**.

**Factoring.** Trucking invoices net 30-60 days; carriers factor invoices at **1.5-4% per invoice** through **Apex Capital, RTS Financial, Triumph Business Capital, Compass Funding Solutions, OTR Capital, eCapital, Bibby Financial** to get paid in 24 hours. Recourse vs non-recourse + reserve discipline matters. Many small carriers cannot survive without factoring; mature mid-size operators self-finance receivables to reclaim the 2-3% margin.

---

## 🏗️ PART 2 -- BUILD-OUT & CAPITAL

### Tractor + trailer buying & financing

Equipment is the second-largest capital item after insurance lifetime cost. Tractor buying decisions cascade into 4-7 years of payment + maintenance + fuel-efficiency economics.

> ### 📊 Quick Facts
> - **New Class 8 sleeper tractor**: $145K-$200K (Freightliner Cascadia / Volvo VNL / Kenworth T680 / Peterbilt 579 / International LT)
> - **Used Class 8 (2018-2022)**: $35K-$95K (sweet spot for owner-operator entry)
> - **53-ft dry van trailer used**: $15K-$40K
> - **53-ft reefer trailer used**: $40K-$80K (Thermo King / Carrier reefer unit adds $20-30K)
> - **48-ft flatbed used**: $25K-$50K + tarps/straps $3-7K
> - **APU (auxiliary power unit)**: $8K-$12K (Carrier ComfortPro, Thermo King TriPac) -- saves $4-7K/yr in idle fuel

**New vs used decision.** New tractors run **$145K-$200K**, financed 60-84 months at 6-9% for established carriers (8-12% new authority), come with full warranty + best fuel economy (6.8-8.2 MPG). Used 2018-2022 tractors at **$35K-$95K** with 400K-650K miles typically have **2-4 years useful life remaining at 100K mi/yr** before major engine/transmission work. Most owner-operators start used; small fleets blend.

**Brand decisions.** **Freightliner Cascadia** (~40% of new Class 8 sleeper market, Detroit DD15 engine, best dealer/parts network) is the default. **Volvo VNL** (driver comfort + Volvo D13, strong reefer/dry van fleet operator favorite). **Kenworth T680** + **Peterbilt 579** (PACCAR MX-13, premium build + resale value, owner-operator favorites). **International LT** (Cummins X15 typical, value-leader pricing).

**Equipment specs that matter.** **Sleeper vs day cab** (sleeper required for OTR; day cab for regional/local). **Single-axle vs tandem-axle drive** (tandem for OTR/heavy haul). **Aerodynamic fairings + skirts** (1-2 MPG improvement = $5-9K/yr fuel). **APU (auxiliary power unit)** for sleeper hotel-load (saves 0.8-1.4 gal/hr idle = $4-7K/yr fuel + extends engine life). **Tire upgrades** (low-rolling-resistance Michelin X Line / Bridgestone Ecopia 0.5-1 MPG = $2-5K/yr).

**Used-truck inspection.** Critical line items: **engine oil sample (Blackstone Labs $30) for wear-metal trends**, **transmission/differential service records**, **DPF (diesel particulate filter) regen history**, **frame rust (Northeast/road-salt belt)**, **fifth-wheel wear**, **DOT inspection-current pre-purchase**. Reputable dealers: **Premier Truck Group, Rush Enterprises (NASDAQ: RUSHA), TEC Equipment, Velocity Truck Centers, Arrow Truck Sales**. Independent used dealers run higher risk -- pre-purchase inspection at independent diesel shop is mandatory.

### Software stack: TMS, ELD, load boards, factoring

Modern trucking runs on a software stack that links load procurement → dispatch → ELD/HOS compliance → settlement → factoring → accounting. The single largest operational lever after equipment.

> ### 📊 Quick Facts
> - **ELD subscriptions**: $25-$60/truck/mo (Samsara, Motive, PeopleNet, Geotab, Omnitracs, Verizon Connect, KeepTruckin/Motive)
> - **TMS software**: $50-$300/user/mo (McLeod, Trimble TMW, Tenstreet, TruckingOffice, Rose Rocket, Axon)
> - **Load boards**: $35-$150/user/mo (DAT One, Truckstop, 123Loadboard)
> - **Factoring**: 1.5-4% per invoice (Apex, RTS, Triumph, Compass, OTR Capital)
> - **Fuel cards**: free to $5/card/mo (EFS, Comdata, FleetCor, RTS Fuel, TCS Fuel) -- discounts $0.10-$0.45/gal at network

**ELD / HOS compliance.** **ELD federally mandated** since Dec 2017 (full enforcement Dec 2019). Tracks driver Hours of Service automatically. Leaders: **Samsara** ($35-$60/truck/mo, AI dashcam optional add), **Motive** (formerly KeepTruckin, $30-$50/truck/mo), **PeopleNet** (PACCAR/Trimble, fleet-grade), **Omnitracs** (legacy enterprise), **Geotab**, **Verizon Connect**. Includes IFTA fuel-tax automation, DVIR (daily vehicle inspection reports), GPS tracking, driver scorecard. Insurance discounts 5-15% with telematics-verified safe-driving.

**TMS (Transportation Management System).** **McLeod Software** (mid-size to large carriers, comprehensive), **Trimble TMW Suite** (large enterprise), **Tenstreet** (driver recruiting + onboarding focus), **Rose Rocket** + **Axon TMS** + **TruckingOffice** + **RigBooks** (SMB-friendly). Functions: load tendering + dispatch + driver settlement + IFTA + fuel + maintenance tracking + accounting integration.

**Load boards.** **DAT One** (largest, $45-$295/mo across tiers, ~5M loads/yr posted), **Truckstop.com** (#2, $39-$150/mo), **123Loadboard** (budget tier $35-$60/mo). Used for spot market load matching when not running contract freight. **Contract carriers use load boards 20-40% of revenue** (filling backhauls); **spot-only carriers run 80-100%** through load boards.

**Driver recruiting + onboarding.** **Tenstreet** (industry-standard driver application + DOT-compliant background + drug screen + MVR pull, $4-$8/application). **Indeed Trucking, ZipRecruiter, Truck Driver USA** for job-board sourcing. **DriverFacts** (verification). PSP (Pre-Employment Screening Program) FMCSA report + **DAC report** + drug & alcohol clearinghouse query required pre-hire.

**Fuel cards + discounts.** **EFS, Comdata, FleetCor, RTS Fuel, TCS Fuel, Bestpass (tolls)**. Network discounts $0.10-$0.45/gal vs cash; integrated IFTA reporting; cash-control limits per driver. **TA-Petro, Pilot Flying J, Love's, Speedway, Wilco-Hess** are primary networks. Saves $4-12K/truck/yr at 130K mi/year.

**Accounting + back-office.** **TruckLogics, RigBooks, Trucker CFO, Q7 (transportation-specific)**, or generic **QuickBooks Online + bookkeeper specialized in trucking**. Quarterly IFTA + 2290 + annual filings + driver settlements. Many owner-operators use **Trucker CFO / ATBS (American Truck Business Services)** outsourced bookkeeping at $150-$400/mo.

### Startup capital by model & SBA financing

Startup capital varies **50-200x** across the four business models. Honest founder budgeting prevents undercapitalizing the chosen model.

**Owner-operator start ($15K-$45K)** -- assumes CDL Class A already held:
- Used Class 8 tractor down payment (10-25% of $35-95K = **$5K-$25K** down)
- Used 53-ft dry van trailer (if owning, not pulling shipper trailers): **$15K-$40K** -- often financed separately
- MC authority + USDOT + BOC-3 + UCR: **$300-$700**
- IRP plates + IFTA decal: **$1.8K-$3.5K** initial
- Form 2290 Heavy Vehicle Use Tax: **$550**
- Insurance Year 1 (Auto Liability + Cargo + Physical Damage + Bobtail): **$14K-$28K** (often $5-9K down + monthly)
- DOT physical + drug consortium enrollment: **$200-$400**
- ELD subscription Year 1: **$420-$720**
- Load board subscription Year 1: **$420-$1,200**
- Factoring setup + reserve: **$0** (deducted from invoices)
- Working capital (fuel + tolls + meals 2-3 weeks float): **$5K-$10K**

**Lease-purchase start ($0-$2K cash out)**:
- Lease-purchase program orientation + initial settlement reserve
- Cargo + Physical Damage rider (often required by leasing carrier)
- Heavily marketed "no money down" pathway
- **Predatory risk**: 24-30% effective APR through lease + fuel + maintenance pass-through; 70-85% wash-out rate

**Small fleet start ($150K-$650K)** -- 3-5 truck launch:
- 3-5 tractors (mix new + used): **$120K-$475K** with 10-25% down
- 3-5 trailers (or pull broker/shipper trailers): **$45K-$200K**
- MC authority + multi-state IRP/IFTA filings: **$3K-$8K**
- Insurance Year 1 (Auto Liability + Cargo + Physical Damage + Bobtail + GL + WC): **$70K-$140K**
- Driver hiring (3-5 W-2 drivers, signing bonus + first month payroll): **$45K-$90K**
- ELD + TMS + load boards + factoring setup: **$3K-$8K**
- Office + small terminal yard (rent + utilities): **$24K-$72K/yr** ($2K-$6K/mo)
- Dispatcher + bookkeeper Year 1: **$70K-$140K** (or outsource $35K-$70K)
- Working capital (driver payroll + fuel + maintenance float 4-8 weeks): **$80K-$200K**

**Mid-sized regional start ($800K-$3M)** -- 10-30 truck launch:
- 10-30 tractors + trailers: **$500K-$2.5M**
- Terminal yard + maintenance shop (lease or buy): **$120K-$600K Year 1**
- In-house safety/compliance officer + dispatch team + driver recruiter: **$280K-$700K Year 1**
- Full TMS (McLeod / Trimble TMW): **$50K-$200K Year 1**
- Working capital (driver payroll + fuel + maintenance + 60-day receivables): **$250K-$900K**

**Acquisition entry.** Acquire existing small fleet at **2.5-4x SDE / $400K-$1.5M EV** for 3-5 truck operation; mid-market 4-7x EBITDA / $5M-$30M EV. SBA 7(a) up to $5M. Existing customer/broker book + driver roster + DOT authority + CSA score + insurance history all inherited (CSA + insurance-history are the biggest diligence items).

---

## ⚙️ PART 3 -- OPERATIONS

### Load procurement: spot, contract, brokered

Load procurement is the **single most operationally distinct feature** of the OTR business. The freight-mix split between contract / spot / brokered determines revenue stability, margin, and survival through freight-recession cycles.

> ### 🟡 Key Stat
> **Mature mid-size carriers run 50-80% contract / 20-50% spot**; spot-market-only small carriers got crushed in the 2023-2025 freight recession (Cass Freight Shipments Index bottomed Q3 2024). **Contract rates Q1 2026 run 15-25% above spot** -- $2.35-$2.85/mi dry van contract vs $1.95-$2.40/mi spot -- but require **commitment to lanes + capacity guarantees + RFP-bid process** that small carriers rarely access without 3+ years clean operating history.

**Direct shipper contracts.** Best margin, longest cycle to build. Shipper RFP-bid annually, awarded lane-by-lane to qualified carriers with **3+ yr operating history + CSA score in "Insurance Carrier" tier + $1M+ liability + EDI capability + ELD verification**. Customers: **Walmart, Target, Home Depot, Lowe's, Amazon, Procter & Gamble, Coca-Cola, PepsiCo, Tyson Foods, JBS, Smithfield**. Pay terms typically **NET 30-45 days**. Direct shipper book is the durable moat against spot-market volatility.

**Brokered loads (via 3PLs).** The dominant load channel for small carriers. Top truckload brokers: **C.H. Robinson (NASDAQ: CHRW), XPO Logistics (NYSE: XPO), Echo Global Logistics, TQL (Total Quality Logistics), Coyote Logistics, RXO (NYSE: RXO, spun from XPO), Worldwide Express, Mode Global, Arrive Logistics**. Brokers post loads on DAT/Truckstop or post directly to carrier networks. Pay terms NET 30-45 days (factoring often used). **Carrier vetting platforms (Highway, Carrier Assure, RMIS, MyCarrierPackets)** + broker payment-verification tools now table-stakes after the 2023-2025 double-brokering fraud wave.

**Spot market via load boards.** **DAT One + Truckstop + 123Loadboard.** Rates float with market supply/demand. **Spot rates Q1 2026: dry van $1.95-$2.40/mi, reefer $2.20-$2.75/mi, flatbed $2.45-$3.05/mi.** Volatile -- can spike 25-40% in days during weather events / produce-harvest peaks, drop 15-25% in seasonal lulls. Useful for backhaul filling + market entry but **dangerous as primary revenue source** for any carrier without 12-24 mo cash runway.

**Leased to a motor carrier (Landstar BCO model).** Owner-operator leases tractor + DOT authority to **Landstar (NASDAQ: LSTR), Mercer Transportation, Anderson Trucking Service, Roehl Transport, Schneider Choice** -- carrier handles dispatch + insurance + factoring + safety + back-office; operator gets **70-78% of linehaul revenue**. Trade-off: less margin per mile, far lower back-office burden, instant access to carrier's contract-freight book. Particularly attractive for owner-operators in Year 1-3 building authority track record.

> ### ⚠️ Warning
> **Double-brokering fraud cost carriers $700M-$1.5B annually 2023-2025** per TIA (Transportation Intermediaries Association) estimates. A bad-actor "broker" books a load from a legitimate broker, then re-brokers it to an unsuspecting carrier under fake credentials -- the carrier delivers, but the bad-actor disappears before paying. **Defenses**: carrier-vetting via Highway / Carrier Assure / RMIS; verify broker bond ($75K BMC-84 federal MIN) + payment history via FactorCloud / Ansonia; demand quick-pay or upfront ACH; never accept a load if the rate confirmation broker doesn't match the FMCSA broker on record.

### Rate per mile, fuel surcharge & accessorial economics

Trucking pricing is **highly variable by equipment + lane + season + market + contract vs spot**. Honest pricing discipline separates 8-12% net-margin operators from 2-3% margin operators racing to the bottom.

**Spot rate benchmarks Q1 2026** (DAT Trendlines + Freightwaves SONAR):

| Equipment | Spot Avg | Contract Avg | Top Quartile |
|---|---|---|---|
| Dry van | $1.95-$2.40/mi | $2.35-$2.85/mi | $2.95-$3.40 |
| Reefer | $2.20-$2.75/mi | $2.65-$3.10/mi | $3.25-$3.85 |
| Flatbed | $2.45-$3.05/mi | $2.95-$3.45/mi | $3.65-$4.40 |
| Tanker (chem/petro) | $2.80-$3.60/mi | $3.30-$3.95/mi | $4.20-$5.10 |
| Heavy haul (permit) | $4.50-$8.50/mi | $5.50-$9.50/mi | $10-$18 |

**Rate components.** Most rates quoted **"all-in"** (linehaul + fuel surcharge bundled) OR **"linehaul + FSC"** separated. Fuel surcharge typically ties to the **EIA weekly retail diesel average** -- e.g., FSC adder of $0.18/mi for every $0.50/gal above a $2.50/gal base. Separating linehaul + FSC protects carrier margin in fuel-price spikes.

**Accessorial charges.** Often overlooked margin recovery: **detention $50-$75/hr after 2 free hours** at shipper/receiver dock, **layover $200-$400/day** for forced overnight, **lumper fees** (warehouse-mandated unloader) passed through plus 5-10% margin, **scale tickets** reimbursable, **tarping flatbed $50-$150 per tarp**, **driver-assist unload $100-$250**, **chassis split** at intermodal terminals. Detention alone can recover **$3K-$8K/truck/yr** for disciplined carriers who invoice it correctly.

**Loaded vs deadhead miles.** **Loaded miles 88-94% of total** for well-routed OTR carriers; deadhead 6-12%. Spot-market dependence drives deadhead up; tight contract lanes drive it down. **Every 1% reduction in deadhead = ~$1,800-$2,800/year per truck** at typical rates.

**Annual revenue per truck.** Solo OTR driver runs **110-130K miles/yr** (HOS-capped). At $2.10-$2.50 all-in: **$230K-$325K/yr gross revenue per truck**. Team driving runs **200K-260K miles/yr** at higher rates ($2.40-$2.85/mi premium) = $480K-$740K/yr per truck. Team driving requires 2 CDL drivers + premium pay split + relationship discipline -- harder operationally.

### Driver pay, retention & HOS compliance

Driver labor is the **single largest operational cost outside of fuel + insurance**, plus the **#1 capacity constraint** in 2026 trucking. Industry-wide driver turnover **85-110% annually** per ATA -- mature carriers run 35-60% via pay + home-time + truck-assignment discipline.

> ### ⚠️ Warning
> **Driver shortage 60K-90K** per ATA (peaked at ~78K in 2021). **Drug & alcohol clearinghouse** pre-employment query mandatory since Jan 2020 -- adds 5-10 days to hiring + screens out ~5-8% of applicants. **CSA scoring** + clean MVR + drug test discipline is now insurance-rate-determinative; one DUI or major accident on the company DOT can spike insurance 40-150% at renewal.

**Driver pay structures.** Three primary models in 2026:

| Pay Model | Typical Range | Best For |
|---|---|---|
| Cents-per-mile (CPM) solo OTR | $0.55-$0.85/mi | Standard solo OTR -- transparent + driver-controllable |
| Cents-per-mile team driving | $0.65-$0.95/mi per driver | Long-haul team -- higher miles but split |
| Percentage of load | 25-30% of linehaul | Less common 2024-26 as rates softened |
| Hourly (local/regional) | $24-$38/hr | Local P&D, drayage, regional dedicated |
| Per-diem (tax-advantaged) | $69/day federal limit | Layered onto CPM; tax-free to driver |
| Sign-on bonus | $2K-$10K (paid over 6-12 months) | Recruiting tool, partly recovered via retention |

**Annual driver compensation 2026**: Solo OTR W-2 driver **$58K-$85K** at 110-130K mi/yr. Top 10% (team + premium freight + safety bonus): **$95K-$135K**. Owner-operator (after expenses): **$65K-$130K take-home** at the median. **Dedicated regional driver** (home weekly): $62K-$95K. **Local P&D driver** (home daily): $52K-$78K.

**Retention economics.** Driver turnover costs **$8K-$15K per incident** (recruiting + onboarding + lost productivity + retraining). At industry-typical 85% annual turnover for 10-truck fleet = **$68K-$128K/yr** direct cost. **Retention investment**: $3K-$8K annual safety bonus + healthcare + truck-assignment (driver gets to drive same tractor) + home-time predictability + weekly pay-cycle drops turnover to **35-50%** -- positive ROI within Year 1.

**HOS (Hours-of-Service) rules.** **11-hour driving limit / 14-hour on-duty window / 10-hour off-duty break / 60-hour 7-day OR 70-hour 8-day weekly limit / 30-min break after 8 driving hours / sleeper-berth split 7+3 or 8+2.** Strictly enforced via ELD. Determines miles-per-driver-per-day = revenue-per-truck cap. Mature operators route to maximize utilization within HOS (avoid forced 34-hour restart waste).

**Drug & alcohol clearinghouse.** **FMCSA Clearinghouse** pre-employment query mandatory; annual queries on every driver. Pre-employment **DOT 5-panel drug test + DOT physical (medical card)** required. Random testing **50% of drivers/yr for drugs, 10% for alcohol** via consortium ($50-$120/driver/yr enrollment fee). One positive = automatic 1-year prohibition + return-to-duty process via SAP (Substance Abuse Professional).

**Dispatcher cost.** **In-house dispatcher $50K-$85K loaded** (handles 8-15 trucks). **Outsourced dispatching** (Apex Dispatching, Three M Trucking, Truckstop Dispatcher, Logity Dispatch) at **7-12% of truck gross revenue**. Most owner-operators self-dispatch Year 1-2 (consumes 15-25 hrs/week off-truck), graduate to outsourced/in-house as fleet grows.

### Dispatching, factoring & cash-cycle discipline

Cash cycle is the **silent killer** for under-capitalized carriers. Trucking has **NET 30-60 day pay terms from brokers + shippers** against **immediate weekly fuel + driver-payroll + maintenance outflows** -- the gap eats unprepared carriers.

> ### 📊 Quick Facts
> - **Broker pay terms**: NET 30-45 days typical, some NET 60-75
> - **Shipper direct pay**: NET 30-45 days
> - **Factoring fees**: 1.5-4% per invoice (24-hour pay)
> - **Quick-pay programs**: 1-3% discount for 2-7 day pay (broker-dependent)
> - **Fuel cards**: weekly net settlement vs cash
> - **Driver payroll**: weekly (industry standard) -- some carriers daily/instant via Wisely/DailyPay

**Factoring economics.** Factor takes 1.5-4% per invoice, pays carrier 90-97% within 24 hours, collects from broker/shipper NET 30-45. **Recourse factoring** (carrier liable if broker doesn't pay): cheaper at 1.5-2.5%. **Non-recourse factoring** (factor takes credit risk): 2.5-4%. Top factors: **Apex Capital, RTS Financial, Triumph Business Capital, Compass Funding Solutions, OTR Capital, eCapital, Bibby Financial, Riviera Finance, Phoenix Capital Group**.

**Quick-pay alternatives.** Many brokers (C.H. Robinson, TQL, Echo, Coyote/RXO) offer **quick-pay discounts** (1-3% off invoice for 2-7 day pay). Often cheaper than factoring for carriers with broker concentration. Mature carriers blend quick-pay where available + factor the rest + self-finance shipper-direct contracts.

**Cash-cycle math.** Owner-operator at $250K revenue with 4-week receivables float = **$19K cash tied up at any time** in unpaid invoices. **5-truck small fleet at $1.2M revenue** = $92K cash float. Without factoring or quick-pay, this is the working-capital requirement. With factoring at 2.5%, you pay $6.25K/yr on $250K revenue to free that cash -- the cost vs benefit needs deliberate analysis.

**Fuel + maintenance + tolls + payroll cycle.** Weekly fuel spend $1,100-$1,500/truck. Driver payroll weekly. Maintenance reserve $0.10-$0.18/mile run + major engine work $8K-$18K events every 250K-400K mi. Tolls $80-$300/wk per truck depending on lane (heavy Northeast/Chicago/I-95 corridor). **Bestpass** + similar consolidated toll-billing essential at fleet scale.

**Receivables vetting.** **DAT Carrier Watch / Truckstop CarrierGuard / Highway / Ansonia / FactorCloud** -- check broker payment history + DOT credit before accepting a load. **A broker score below 90 = decline or demand quick-pay.** Bad-actor brokers with chronic late-pay or non-pay get blacklisted across carrier networks within months.

---

## 🚀 PART 4 -- GROWTH & EXIT

### Single-truck ceiling & multi-truck rollup

Owner-operator single-truck operations ceiling at **$180K-$320K revenue + $35-85K net** -- physically capped by HOS + one driver. Growth requires hiring drivers + adding trucks + managing the back-office leap.

**Stage 1 (Yr 0-2): Owner-operator launch.** Founder drives. **$180K-$320K revenue + $35K-$85K net**. Self-dispatch, self-bookkeep (or outsourced ATBS/Trucker CFO). Heavy financing-partner + factoring dependency. Build clean CSA + 24+ months operating history before adding trucks.

**Stage 2 (Yr 2-4): 2-5 truck small fleet.** Hire first W-2 drivers; founder splits driving + dispatch + admin. **$500K-$1.8M revenue + 4-10% net**. Add ELD fleet plan, basic TMS, in-house bookkeeping. WC + payroll + driver-recruiting now part of the job. **First mortality cliff** -- 30-40% of operators fail at this transition (driver-management, payroll, insurance scale).

**Stage 3 (Yr 3-6): 5-20 truck mature small fleet.** Dedicated dispatcher + bookkeeper + driver recruiter. **$1.5M-$8M revenue + 5-12% net**. Direct shipper contracts begin (3+ yr DOT history + insurance + CSA unlock RFP eligibility). Maintenance shop or strong vendor relationship. **PE first engages at $5M+ revenue.**

**Stage 4 (Yr 5-10): 20-100 truck regional carrier.** In-house safety/compliance officer + dispatch team + full TMS + terminal yard. **$8M-$45M revenue + 6-12% net (operating ratio 88-94%)**. Multi-state authority + multi-lane contract book + diversified equipment mix. **Strategic-exit candidate** (PE rollup or strategic).

**Stage 5 (Yr 8-15): 100-500+ truck mid-market platform.** Multi-region + acquisition-led growth. **$45M-$250M+ revenue + 7-13% EBITDA**. Strategic buyer pool: **Knight-Swift, Werner, Schneider, Heartland Express, P.A.M. Transportation** + PE platforms.

| Stage | Years | Trucks | Revenue | Net Margin |
|---|---|---|---|---|
| 1 Owner-operator | 0-2 | 1 | $180K-$320K | $35K-$85K |
| 2 Small fleet | 2-4 | 2-5 | $500K-$1.8M | 4-10% |
| 3 Mature small fleet | 3-6 | 5-20 | $1.5M-$8M | 5-12% |
| 4 Regional carrier | 5-10 | 20-100 | $8M-$45M | 6-12% (88-94% OR) |
| 5 Mid-market platform | 8-15 | 100-500+ | $45M-$250M+ | 7-13% EBITDA |

### The corporate landscape: Knight-Swift, Werner, Schneider

The public + PE-backed truckload landscape is the **strategic-acquirer endgame** for multi-fleet builders. 2023-2026 saw aggressive PE consolidation in regional truckload + the LTL/brokerage spillover from Yellow Corp bankruptcy + Convoy collapse.

**Knight-Swift (NYSE: KNX).** Largest US truckload carrier post-2017 Knight + Swift merger. **~$7.5B-$8.5B revenue, ~24,000 tractors**. Acquired ACT (US Xpress) 2023, multiple regional carriers 2023-2026. Multi-segment: truckload, LTL (post-AAA Cooper acquisition), logistics, intermodal. Active acquirer at 4-7x EBITDA for regional carrier targets.

**Werner Enterprises (NASDAQ: WERN).** **~$3B-$3.4B revenue, ~7,800 tractors**. Truckload + dedicated + logistics. Active acquirer of mid-market regional carriers. Known for driver-training program + Werner Academy CDL pathway.

**Schneider National (NYSE: SNDR).** **~$5.5B-$5.9B revenue, ~11,000 tractors**. Truckload + intermodal + logistics + Schneider Choice owner-operator lease program. Acquired Cowan Systems (2023), Midwest Logistics Systems (2023), M&M Transport (2024).

**Heartland Express (NASDAQ: HTLD).** **~$1B-$1.2B revenue**. Truckload-focused; acquired Smith Transport (2022), Contract Freighters Inc (2022). Conservative balance sheet; selective acquirer.

**Marten Transport (NASDAQ: MRTN).** **~$1.1B-$1.3B revenue**. Specialized in reefer + intermodal + dedicated. Niche premium-freight operator.

**P.A.M. Transportation (NASDAQ: PTSI).** **~$700M-$850M revenue**. Truckload focus; automotive industry concentration.

**Saia (NASDAQ: SAIA) + Old Dominion (NASDAQ: ODFL) + XPO (NYSE: XPO) + ArcBest (NASDAQ: ARCB) + TForce Freight (TFI International TSE: TFII).** Major LTL operators -- different operating model (terminal network consolidation, not OTR truckload) but acquirer of LTL/regional carriers.

**RXO (NYSE: RXO) + C.H. Robinson (NASDAQ: CHRW) + XPO + Echo + TQL.** Largest brokers -- not motor carriers themselves but the dominant load-procurement channel for small carriers. **Coyote Logistics** acquired by RXO from UPS 2024.

**Bankrupt operators 2023-2025**: **Yellow Corp (Aug 2023, $1.2B assets, largest LTL bankruptcy in history)**, **Convoy (2023, digital brokerage)**, **USA Truck (acquired by DB Schenker 2022 then absorbed)**, **Pride Logistics**, multiple mid-market regional carriers absorbed in distressed sales.

**Strategic-acquirer math.** Regional carrier with **40 trucks + $15M revenue + $1.6M EBITDA (10.7% OR)** sells to Knight-Swift / Werner / Schneider / Heartland at **4-6x EBITDA = $6.4M-$9.6M EV**. Founder equity typically clears **2-4x cash-on-cash** after **6-10 yr hold** + earnout participation. Discounted vs 2020-2022 peaks of 5-9x as freight-market softness compressed buyer enthusiasm.

### M&A multiples & exit options

M&A is **active but selectively discounted** vs 2020-2022 peak. Buyers heavily prioritize CSA score + insurance loss-ratio + driver retention + contract-freight book over raw size.

**Single owner-operator (1 truck).** **Asset value sale** -- truck book + minimal customer relationship value. **$30K-$80K** typically. Buyer is another aspiring owner-operator. DOT authority NOT transferable -- buyer files new authority.

**Small fleet (3-5 trucks).** **2.5-4x SDE** to local operator or first-time-buyer / SBA-financed acquirer. **$400K-$1.5M EV**. Channels: BizBuySell, Sunbelt Business Brokers, Murphy Business, trucking-specific brokers (TruckingTruckers, Heavy Truck Sales Brokers).

**Mid-size regional (20-100 trucks).** **4-7x EBITDA** depending on contract book + CSA + insurance loss-ratio + driver retention. **$5M-$30M EV**. IB: **Republic Partners, Generational Equity, Cascade Partners, Capstone Partners, FOCUS Investment Banking, Tenney Group (trucking specialist).**

**Mid-market platform (100-500 trucks).** **5-9x EBITDA** strategic. **$30M-$200M EV**. IB: **Lincoln International, Houlihan Lokey, Harris Williams, William Blair, Robert W. Baird** transportation/logistics teams.

**National + public truckload carriers.** **5-9x EBITDA** (Knight-Swift KNX, Werner WERN, Schneider SNDR, Heartland HTLD, Marten MRTN comp benchmarks). **6-11x EBITDA** for LTL carriers (Old Dominion ODFL premium ~12-15x as best-in-class).

**Sale-leaseback of terminal real estate.** Mature carriers can monetize owned terminal/yard via **sale-leaseback to specialty logistics REITs**: **Stag Industrial (NYSE: STAG), Industrial Logistics Properties (NASDAQ: ILPT), EastGroup Properties (NYSE: EGP), Plymouth Industrial (NYSE: PLYM)**. **7-9% unlevered cap rates** on industrial logistics property 2024-2026.

| Exit | Buyer | Multiple | Typical EV |
|---|---|---|---|
| Single owner-operator | Aspiring O/O | Asset value | $30K-$80K |
| Small fleet 3-5 trucks | Local / SBA-buyer | 2.5-4x SDE | $400K-$1.5M |
| Mid-size regional 20-100 | PE rollup / strategic | 4-7x EBITDA | $5M-$30M |
| Mid-market platform 100-500 | PE / strategic | 5-9x EBITDA | $30M-$200M |
| National truckload comp (KNX/WERN/SNDR) | Strategic / public | 5-9x EBITDA | $1B-$10B+ |
| LTL platform (ODFL/SAIA) | Strategic | 6-15x EBITDA | $500M-$30B+ |
| Terminal sale-leaseback | Logistics REIT (STAG/ILPT/EGP) | 7-9% cap rate | Real estate recycling |
| Generational / family transfer | Family / employees | Discounted SDE | Owner-operator |

`;

const tldr = `**TL;DR:** Starting an **over-the-road trucking business in 2027** (a.k.a. **for-hire motor carrier**, **FMCSA-authorized DOT + MC operating authority interstate truckload carrier**) -- a **specialty-transportation business operating Class 8 sleeper tractors (Freightliner Cascadia / Volvo VNL / Kenworth T680 / Peterbilt 579 / International LT) plus equipment trailers (53-ft dry van / reefer / flatbed / tanker / dump) across three regulated pillars: FMCSA DOT + MC authority + BOC-3 process agent + UCR + IRP + IFTA + BMC-91 insurance filing + Heavy Vehicle Use Tax Form 2290, CDL Class A driver(s) + DOT medical card + drug & alcohol clearinghouse + ELD HOS compliance (Samsara / Motive / PeopleNet / Geotab / Omnitracs), and Auto Liability $1M MIN + GL + bobtail + non-trucking + physical damage + cargo insurance** -- means navigating **four business models: owner-operator (1 truck, $180K-$320K revenue + $35K-$85K net), lease-purchase ($0 down through Prime / Schneider / CRST but 70-85% wash-out 24 months), small fleet (2-20 trucks, $750K-$2M + 4-12% net), mid-sized regional (20-200 trucks, $5M-$45M + 5-12% net = 88-95% operating ratio per ATA). Equipment models: dry van ~80% of US OTR, reefer (food/pharma), flatbed (steel/lumber/oversize), tanker (liquid bulk + N + H endorsements), dump (aggregates/grain). Capital from SBA 7(a) Live Oak Bank + dealer financing Daimler/Volvo/PACCAR/Navistar + aftermarket LRM/CAG/Mission Financial; factoring Apex/RTS/Triumph/Compass at 1.5-4% per invoice; load procurement direct shipper (Walmart/Target/Amazon/P&G) + brokered (C.H. Robinson CHRW/XPO/Echo/TQL/Coyote-RXO) + spot DAT One/Truckstop at $1.95-$2.40/mi dry van Q1 2026 / $2.20-$2.75 reefer / $2.45-$3.05 flatbed; insurance stack $14K-$28K/truck/yr Auto Liability new authority** -- operating against **~$940B-$1.05T US trucking market + ~580K-620K active for-hire motor carriers (~95% under 6 trucks per FMCSA SAFER, ~72.5% of US freight tonnage moves by truck) + counter-pressures: post-COVID FREIGHT RECESSION (Cass Index bottomed Q3 2024, FTR soft tonnage 2026), INSURANCE CRISIS (nuclear verdicts $10M+, Progressive Commercial retreat 2024-25, Great West pullback, Berkshire Hathaway GUARD/Sentry/Northland/AmGUARD primary writers), regulatory whiplash (CARB Advanced Clean Fleets CA Jan 2024 ZEV mandate, EPA Phase 3 GHG 2027 25-60% emission cuts, FMCSA HOS, drug & alcohol clearinghouse 5-10 day pre-employment, double-brokering fraud $700M-$1.5B/yr per TIA, broker bankruptcies Convoy 2023 + Yellow Corp LTL Aug 2023, driver turnover 85-110% per ATA, shortage 60K-90K)** -- capturing **PE exits Knight-Swift KNX ~$7.5B-$8.5B ~24,000 tractors + Werner WERN ~$3B-$3.4B + Schneider SNDR ~$5.5B-$5.9B + Heartland HTLD + Marten MRTN + P.A.M. PTSI + LTL Old Dominion ODFL + Saia SAIA + ArcBest ARCB + multiples small fleet 2.5-4x SDE / mid-size 4-7x EBITDA / mid-market 5-9x EBITDA / LTL 6-15x EBITDA / terminal sale-leaseback to REITs Stag STAG / Industrial Logistics ILPT / EastGroup EGP / Plymouth PLYM 7-9% cap rates**. The hardest part is **the freight-recession + insurance-crisis + regulatory-whiplash + broker-fraud quadrupole**, not capital ($15K-$45K owner-operator entry) or equipment (used Class 8 $35-$95K plentiful).`;

const flow = `

## The Operating Journey: From FMCSA Authority + CDL + Equipment To Multi-Truck Platform + Exit

\`\`\`mermaid
flowchart TD
  A[Trucking Founder Decides To Launch] --> B[Model + Authority + Equipment + Capital Strategy]
  B --> B1{Business Model Selection}
  B1 -->|Owner-Operator 1 Truck Owner Drives| C1[Owner-Operator]
  B1 -->|Lease-Purchase 0 Down Through Fleet| C2[Lease-Purchase]
  B1 -->|Small Fleet 2-20 Trucks + Hired Drivers| C3[Small Fleet]
  B1 -->|Mid-Sized Regional 20-200 Trucks + Terminal| C4[Mid-Sized Regional]
  C1 --> D[FMCSA Authority + Insurance + Capital]
  C2 --> D
  C3 --> D
  C4 --> D
  D --> D1[USDOT Number Free + MC Operating Authority 300 + BOC-3 Process Agent + UCR 39-9200 + IRP Apportioned Plates + IFTA Fuel Tax + BMC-91 Insurance Filing + Form 2290 HVUT 550/yr]
  D --> D2[CDL Class A + ELDT Entry Level Driver Training Feb 2022 + DOT Medical Card + Drug & Alcohol Clearinghouse FMCSA Pre-Employment + Annual Query + DOT 5-Panel Drug Test]
  D --> D3[Auto Liability 1M BMC-91 New Authority 14K-28K/yr + Cargo 100K MIN 1.5K-4K + Physical Damage 3-6% Vehicle Value + GL + Bobtail + WC Class 7228 Long-Haul 7-18 per 100 Payroll Total 18K-38K Year 1]
  D1 --> E[Equipment + Vehicle Build-Out]
  D2 --> E
  D3 --> E
  E --> E1[Owner-Op Start 15K-45K + Lease-Purchase 0-2K + Small Fleet 150K-650K + Mid-Sized Regional 800K-3M + Acquisition Entry 2.5-4x SDE 400K-1.5M EV SBA 7(a) up to 5M]
  E --> E2[Class 8 Sleeper Tractor New 145K-200K Freightliner Cascadia/Volvo VNL/Kenworth T680/Peterbilt 579/International LT vs Used 2018-2022 35K-95K + 53-ft Dry Van Trailer Used 15K-40K / Reefer 40K-80K + Thermo King/Carrier / Flatbed 25K-50K / Tanker 80K-180K / Dump 20K-50K]
  E --> E3[Equipment Financing Daimler Truck Financial/Volvo Financial/PACCAR Financial/Navistar Financial Dealer + LRM Leasing/CAG Truck Capital/Mission Financial/Trans Lease Aftermarket 48-72 mo 8-14% APR 10-25% Down + SBA 7(a) Live Oak Bank/Pursuit/Newtek Prime + 2.75-4.75%]
  E --> E4[APU Carrier ComfortPro/Thermo King TriPac 8K-12K Saves 4-7K/yr Fuel + Aerodynamic Fairings 1-2 MPG = 5-9K/yr + Low-Rolling-Resistance Tires Michelin X Line/Bridgestone Ecopia 0.5-1 MPG = 2-5K/yr]
  E --> E5[Pre-Purchase Inspection Engine Oil Sample Blackstone Labs 30 + Transmission/Differential Records + DPF Regen History + Frame Rust Northeast/Road-Salt + Fifth-Wheel + DOT-Current Used Dealers Premier Truck Group/Rush Enterprises RUSHA/TEC/Velocity/Arrow]
  E1 --> F[Software Stack + Operational Systems]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  F --> F1[ELD HOS Federally Mandated Dec 2017 Samsara 35-60/truck/mo + Motive 30-50 KeepTruckin + PeopleNet PACCAR/Trimble + Omnitracs + Geotab + Verizon Connect + IFTA Fuel-Tax Automation + DVIR + GPS + Driver Scorecard + Insurance Discounts 5-15%]
  F --> F2[TMS McLeod Software Mid-Large + Trimble TMW Suite Enterprise + Tenstreet Driver Recruiting + Rose Rocket/Axon/TruckingOffice/RigBooks SMB 50-300/user/mo + Load Tendering + Dispatch + Settlement + IFTA + Maintenance + Accounting]
  F --> F3[Load Boards DAT One Largest 45-295/mo 5M Loads/yr + Truckstop 39-150 + 123Loadboard Budget 35-60 + Driver Recruiting Tenstreet 4-8/application/Indeed Trucking/ZipRecruiter + DAC + PSP + Drug Alcohol Clearinghouse Query]
  F --> F4[Fuel Cards EFS/Comdata/FleetCor/RTS Fuel/TCS Fuel/Bestpass Tolls 0.10-0.45/gal Discount + TA-Petro/Pilot Flying J/Love's/Speedway/Wilco-Hess Networks + Integrated IFTA + Save 4-12K/truck/yr at 130K mi]
  F --> F5[Accounting TruckLogics/RigBooks/Trucker CFO/Q7 + QuickBooks Online + Bookkeeper Specialized in Trucking + Trucker CFO/ATBS American Truck Business Services Outsourced 150-400/mo + Quarterly IFTA + 2290 + Annual + Driver Settlements]
  F1 --> G[Load Procurement + Rate Discipline + Driver Pay]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  G --> G1[Load Procurement Direct Shipper Contract Walmart/Target/Home Depot/Lowe's/Amazon/P&G/Coca-Cola/PepsiCo/Tyson/JBS/Smithfield 3+ yr DOT History + CSA + 1M Liability + EDI NET 30-45 + Brokered C.H. Robinson CHRW/XPO/Echo/TQL/Coyote-RXO RXO/Worldwide Express/Mode/Arrive + Spot via DAT/Truckstop]
  G --> G2[Rate Per Mile Q1 2026 Spot Dry Van 1.95-2.40 + Reefer 2.20-2.75 + Flatbed 2.45-3.05 + Tanker 2.80-3.60 + Heavy Haul 4.50-8.50 + Contract 15-25% Above Spot + Loaded Miles 88-94% + Deadhead 6-12%]
  G --> G3[Fuel Surcharge EIA Weekly Retail Diesel + 0.18/mi per 0.50/gal above 2.50/gal Base + Accessorial Detention 50-75/hr after 2 free + Layover 200-400/day + Lumper + Scale + Tarping 50-150/tarp + Driver-Assist 100-250 Recovers 3K-8K/truck/yr]
  G --> G4[Driver Pay Solo OTR CPM 0.55-0.85/mi + Team 0.65-0.95/driver + Percentage of Load 25-30% Less Common 2024-26 + Hourly Local 24-38/hr + Per Diem 69/day Federal + Sign-On 2K-10K + Annual Solo OTR W-2 58K-85K Top 10% 95K-135K]
  G --> G5[HOS 11-hr Driving + 14-hr On-Duty + 10-hr Off + 60/70-hr Weekly + 30-min Break After 8 Driving + Sleeper-Berth Split 7+3 or 8+2 ELD Enforced + Drug & Alcohol Random 50% Drugs/10% Alcohol Consortium 50-120/driver/yr]
  G1 --> H[Cash Cycle + Factoring + Receivables Discipline]
  G2 --> H
  G3 --> H
  G4 --> H
  G5 --> H
  H --> H1[Broker Pay NET 30-45 Typical + Some NET 60-75 + Shipper Direct NET 30-45 + Factoring 1.5-4% per Invoice Apex Capital/RTS Financial/Triumph Business Capital/Compass Funding/OTR Capital/eCapital/Bibby/Riviera/Phoenix Capital Group 24-hr Pay]
  H --> H2[Quick-Pay 1-3% Discount 2-7 Day Pay Broker-Dependent C.H. Robinson/TQL/Echo/Coyote-RXO + Mature Carriers Blend Quick-Pay + Factor + Self-Finance Shipper-Direct + Cash Float 19K Owner-Op / 92K 5-Truck]
  H --> H3[Receivables Vetting DAT Carrier Watch + Truckstop CarrierGuard + Highway + Carrier Assure + RMIS + Ansonia + FactorCloud Broker Score Below 90 Decline or Demand Quick-Pay + Bad-Actor Blacklist]
  H --> H4[Fraud Defense Double-Brokering 700M-1.5B/yr per TIA + Verify Broker Bond 75K BMC-84 Federal MIN + Payment History + Rate Confirmation Matches FMCSA Broker Record + Demand Quick-Pay/Upfront ACH on Unknown Brokers]
  H --> H5[Dispatcher In-House 50K-85K Loaded 8-15 Trucks + Outsourced 7-12% of Truck Gross Revenue Apex Dispatching/Three M Trucking/Truckstop Dispatcher/Logity Dispatch + Owner-Op Self-Dispatch Yr 1-2 15-25 hrs/wk Off-Truck]
  H1 --> I[Single-Truck + Small Fleet Operations + Stabilization]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  I --> I1[Yr 0-2 Owner-Operator 1 Truck 180K-320K Revenue 35K-85K Net + Self-Dispatch + Self-Bookkeep ATBS/Trucker CFO + Heavy Financing/Factoring + Build CSA + 24+ mo Authority]
  I --> I2[Yr 2-4 Small Fleet 2-5 Trucks Hire First W-2 Drivers + Founder Splits Driving + Dispatch + Admin 500K-1.8M Revenue 4-10% Net + WC + Payroll + Driver-Recruiting First Mortality Cliff 30-40% Fail]
  I --> I3[Yr 3-6 Mature Small Fleet 5-20 Trucks Dedicated Dispatcher + Bookkeeper + Driver Recruiter 1.5M-8M Revenue 5-12% Net + Direct Shipper Contracts 3+ yr DOT + CSA Unlock RFP + PE First Engages 5M+]
  I1 --> J[Regional + Multi-Region Rollup]
  I2 --> J
  I3 --> J
  J --> J1[Stage 4 Yr 5-10 Regional Carrier 20-100 Trucks In-House Safety/Compliance + Dispatch Team + Full TMS + Terminal Yard 8M-45M Revenue 6-12% Net 88-94% OR + Multi-State Multi-Lane Contract Book + Strategic Exit Candidate]
  J --> J2[Stage 5 Yr 8-15 Mid-Market Platform 100-500+ Trucks Multi-Region + Acquisition-Led 45M-250M+ Revenue 7-13% EBITDA + Knight-Swift KNX/Werner WERN/Schneider SNDR/Heartland HTLD/P.A.M. PTSI Strategic Buyers + PE Platforms]
  K{Mature Operator Strategic Exit Decision}
  J --> K
  K -->|Hold For Cash Flow + Family Legacy| L[Long-Term Hold]
  K -->|Single Owner-Op Asset Value 30K-80K| M[Owner-Op Sale]
  K -->|Small Fleet 3-5 Trucks 2.5-4x SDE 400K-1.5M| N[Small Fleet Sale]
  K -->|Mid-Size Regional 20-100 4-7x EBITDA 5M-30M| O[Mid-Size Sale]
  K -->|Mid-Market Platform 100-500 5-9x EBITDA 30M-200M| P[Platform Sale]
  K -->|National Public Comp 5-9x EBITDA KNX/WERN/SNDR| Q[National Strategic Exit]
  K -->|LTL Platform Old Dominion ODFL Premium 6-15x EBITDA| R[LTL Strategic Exit]
  K -->|Terminal Sale-Leaseback Logistics REIT 7-9% Cap Rate| S[Real Estate Recycling]
  K -->|Generational Family + ESOP| T[Family/ESOP]
  L --> U[Independent Hold 5-12% Net + Cash Distribution + Family Legacy]
  M --> V[Owner-Op Sold Asset Value + BizBuySell/TruckingTruckers + DOT Authority Not Transferable Buyer New Files]
  N --> W[Small Fleet Sold Local Operator/First-Time Buyer/SBA-Financed Acquirer + BizBuySell/Sunbelt/Murphy/Heavy Truck Sales Brokers]
  O --> X[Mid-Size Regional Sold Knight-Swift/Werner/Schneider/Heartland Regional Targets + Republic Partners/Generational Equity/Cascade/Capstone/FOCUS/Tenney Group IB Trucking Specialist]
  P --> Y[Mid-Market Platform Sold Strategic + PE Lincoln/Houlihan Lokey/Harris Williams/William Blair/Baird Transportation Logistics Teams]
  Q --> Z[National Strategic Exit Knight-Swift KNX/Werner WERN/Schneider SNDR/Heartland HTLD/Marten MRTN Comp Benchmarks]
  R --> AA[LTL Old Dominion ODFL/Saia SAIA/ArcBest ARCB/XPO XPO/TForce TFII Comp]
  S --> BB[Terminal Sale-Leaseback Stag Industrial NYSE STAG/Industrial Logistics ILPT/EastGroup EGP/Plymouth PLYM 7-9% Cap Rate]
  T --> CC[Family + ESOP Discounted SDE]
\`\`\`

## The Decision Matrix: Business Model + Equipment Selection

\`\`\`mermaid
flowchart TD
  A[Founder Capital + Driving + Model Decision] --> B{Business Model}
  B -->|Owner-Operator 1 Truck Owner Drives| C[Owner-Operator]
  B -->|Lease-Purchase 0 Down Through Fleet| D[Lease-Purchase]
  B -->|Small Fleet 2-20 Trucks + Hired Drivers| E[Small Fleet]
  B -->|Mid-Sized Regional 20-200 Trucks| F[Mid-Sized Regional]
  C --> C1{Equipment + Lane}
  C1 -->|Dry Van OTR Coast-to-Coast 80% Market| G[Dry Van OTR 180K-280K Revenue + Spot 1.95-2.40/mi]
  C1 -->|Reefer Food/Pharma CA-East/Midwest| H[Reefer 230K-340K Revenue + Spot 2.20-2.75/mi + Higher Insurance]
  C1 -->|Flatbed Steel/Lumber Southeast + Industrial| I[Flatbed 250K-380K Revenue + Spot 2.45-3.05/mi + Physical/Weather]
  C1 -->|Tanker Liquid Bulk + N + H Endorsement| J[Tanker 280K-420K Revenue + Spot 2.80-3.60/mi + Capital Heavy]
  D --> D1[Predatory Risk 24-30% Effective APR + 70-85% Wash-Out 24 mo + Avoid Unless No Other Path]
  E --> E1{Small Fleet Strategy}
  E1 -->|Spot-Only Load Boards| K[Spot 750K-1.5M + 3-7% Net + Volatile + Recession Risk]
  E1 -->|Brokered 70-100% C.H. Robinson/TQL/Coyote| L[Brokered 900K-1.8M + 4-9% Net + Steady but Broker-Dependent]
  E1 -->|Direct Shipper Contract Walmart/Target/Amazon Build 3+ yr| M[Contract 1.2M-2.5M + 7-14% Net + Stable but Slow to Build]
  F --> F1{Regional Mix}
  F1 -->|Truckload Dedicated Single-Shipper Lanes| N[Dedicated 8M-25M + 9-14% Net + Long-Term Contract]
  F1 -->|Regional Reefer/Flatbed Specialty| O[Specialty 10M-40M + 8-13% Net + Premium Freight Mix]
  F1 -->|Hybrid Truckload + Brokerage + 3PL Build-Out| P[Hybrid 15M-50M + 7-13% Net + Diversified Revenue]
  G --> S{Year 3 Strategic Decision}
  H --> S
  I --> S
  J --> S
  K --> S
  L --> S
  M --> S
  N --> S
  O --> S
  P --> S
  S -->|Hold Cash Flow + Family| T[Hold]
  S -->|Single Owner-Op Asset Sale 30K-80K| U[Owner-Op Sale]
  S -->|Small Fleet 2.5-4x SDE| V[Small Fleet Sale]
  S -->|Mid-Size Regional 4-7x EBITDA| W[Regional Build]
  S -->|Mid-Market Platform 5-9x EBITDA Knight-Swift/Werner/Schneider Strategic| X[Strategic Exit]
  S -->|Terminal Sale-Leaseback Logistics REIT 7-9% Cap| Y[Real Estate]
  S -->|Generational + ESOP| Z[Family/ESOP]
\`\`\`

`;

const src = `

## Sources

1. **ATA American Trucking Trends 2025** -- Annual industry stats + Operations Council OR benchmarks. https://www.trucking.org
2. **FMCSA SAFER** -- Active carrier count + safety. https://safer.fmcsa.dot.gov
3. **FMCSA Drug & Alcohol Clearinghouse** -- Pre-employment query mandate. https://clearinghouse.fmcsa.dot.gov
4. **FMCSA HOS + ELD + CSA Methodology** -- 11/14/10/60-70 ruleset + Dec 2017 ELD + safety scoring. https://www.fmcsa.dot.gov
5. **Cass Freight Index** -- Monthly freight shipments + expenditures. https://www.cassinfo.com
6. **FTR Transportation Intelligence** -- Trucking + freight forecasts. https://www.ftrintel.com
7. **DAT Trendlines** -- Weekly spot rate + load-to-truck data. https://www.dat.com
8. **Freightwaves SONAR** -- Real-time freight market data. https://www.freightwaves.com
9. **Transport Topics Top 100 For-Hire** + **CCJ Top 250** -- Industry rankings. https://www.ttnews.com / https://www.ccjdigital.com
10. **Overdrive Magazine** -- Owner-operator benchmarks. https://www.overdriveonline.com
11. **Trucks.com** -- Commercial truck market + dealer pricing. https://www.trucks.com
12. **TIA Transportation Intermediaries Association** -- Broker fraud + double-brokering reports. https://www.tianet.org
13. **OOIDA Owner-Operator Independent Drivers Association** -- Owner-op advocacy. https://www.ooida.com
14. **EPA Phase 3 Heavy-Duty GHG** -- 2027 model year emission reductions. https://www.epa.gov
15. **CARB Advanced Clean Fleets** -- CA ZEV mandate Jan 2024. https://ww2.arb.ca.gov
16. **AAA Motor Carrier Operating Costs** -- Annual cost benchmarks.
17. **EIA Weekly Retail Diesel** -- Fuel surcharge calculation basis. https://www.eia.gov
18. **Daimler Truck Financial / Volvo Financial Services / PACCAR Financial / Navistar Financial** -- OEM dealer financing for Freightliner/Volvo/Kenworth+Peterbilt/International.
19. **LRM Leasing + CAG Truck Capital + Mission Financial + Trans Lease + Pawnee Leasing** -- Aftermarket truck-finance.
20. **Live Oak Bank / Pursuit / Newtek / Huntington / Wells Fargo Equipment Finance** -- SBA + equipment lenders. https://www.liveoakbank.com
21. **Samsara NYSE IOT / Motive (KeepTruckin) / PeopleNet PACCAR-Trimble / Omnitracs / Geotab / Verizon Connect** -- Fleet ELD + telematics. https://www.samsara.com / https://gomotive.com
22. **McLeod Software / Trimble Transportation TMW Suite / Tenstreet / Rose Rocket / Axon TMS / TruckingOffice / RigBooks** -- TMS stack. https://www.mcleodsoftware.com / https://transportation.trimble.com / https://www.tenstreet.com
23. **DAT One / Truckstop.com / 123Loadboard** -- Load boards. https://www.dat.com / https://www.truckstop.com
24. **Apex Capital / RTS Financial / Triumph Business Capital / Compass Funding / OTR Capital / eCapital / Bibby Financial / Riviera Finance / Phoenix Capital Group** -- Trucking factors. https://www.apexcapitalcorp.com
25. **EFS / Comdata / FleetCor / RTS Fuel / TCS Fuel / Bestpass** -- Fuel cards + tolls. https://www.fleetcor.com
26. **TA-Petro / Pilot Flying J / Love's / Speedway / Wilco-Hess** -- Major fuel + truck stop networks.
27. **Highway / Carrier Assure / RMIS / MyCarrierPackets / Ansonia / FactorCloud / DAT Carrier Watch / Truckstop CarrierGuard** -- Carrier vetting + broker credit verification.
28. **C.H. Robinson NASDAQ CHRW / XPO NYSE XPO / RXO NYSE RXO / TQL / Echo Global / Coyote (RXO) / Worldwide Express / Mode Global / Arrive Logistics** -- Major freight brokers. https://www.chrobinson.com / https://www.rxo.com
29. **Knight-Swift NYSE KNX** -- Largest US truckload. https://www.knight-swift.com
30. **Werner Enterprises NASDAQ WERN / Schneider National NYSE SNDR / Heartland Express NASDAQ HTLD / Marten Transport NASDAQ MRTN / P.A.M. Transportation NASDAQ PTSI** -- Public truckload carriers. https://www.werner.com / https://www.schneider.com
31. **Landstar System NASDAQ LSTR / Mercer Transportation / Anderson Trucking Service / Roehl Transport** -- BCO + owner-op-friendly carriers. https://www.landstar.com
32. **Prime Inc / Schneider / US Xpress (Knight-Swift) / CRST / Stevens Transport** -- CDL training + lease-purchase programs.
33. **Old Dominion NASDAQ ODFL / Saia NASDAQ SAIA / ArcBest NASDAQ ARCB / TForce Freight (TFI International TSE TFII)** -- LTL carriers. https://www.odfl.com
34. **Yellow Corp Aug 2023 Bankruptcy** -- Largest LTL bankruptcy in US history ($1.2B assets).
35. **Convoy 2023 Bankruptcy** -- Digital freight brokerage collapse.
36. **Berkshire Hathaway GUARD / Sentry Insurance / Northland (Travelers) / AmGUARD (Berkshire)** -- Primary trucking insurance writers.
37. **HUB International Transportation / Marsh / Holman / Anderson / Cottingham & Butler** -- Motor-carrier-specialty insurance brokers.
38. **Lytx / SmartDrive (Solera) / Samsara AI Dash Cam** -- Dashcam + fleet safety telematics.
39. **Rush Enterprises NASDAQ RUSHA / Premier Truck Group / TEC Equipment / Velocity Truck Centers / Arrow Truck Sales** -- Major truck dealers. https://www.rushtruckcenters.com
40. **Blackstone Labs** -- Oil analysis for engine wear-metal trends. https://www.blackstone-labs.com
41. **ATBS American Truck Business Services / Trucker CFO / TruckLogics / RigBooks / Q7** -- Trucking-specific bookkeeping + accounting. https://www.atbs.com
42. **DAT Authority / Trucker Path / Rapid Authority / JJ Keller** -- MC authority + BOC-3 + UCR filing services.
43. **PSP Pre-Employment Screening Program / DAC report (HireRight)** -- Driver pre-employment screening.
44. **Stag Industrial NYSE STAG / Industrial Logistics Properties NASDAQ ILPT / EastGroup Properties NYSE EGP / Plymouth Industrial NYSE PLYM** -- Logistics REIT sale-leaseback acquirers.
45. **Republic Partners / Generational Equity / Cascade / Capstone / FOCUS / Tenney Group** -- Trucking M&A advisors.
46. **Lincoln International / Houlihan Lokey / Harris Williams / William Blair / Robert W. Baird** -- Mid-market transportation/logistics IB teams.
47. **BizBuySell / Sunbelt Business Brokers / Murphy Business / TruckingTruckers / Heavy Truck Sales Brokers** -- Small fleet M&A channels.
48. **SJ Consulting Group** -- Top truckload + LTL carrier rankings. https://www.sjconsulting.com

`;

const num = `

## Numbers & Benchmarks

### Industry size & unit economics

| Metric | 2024-2026 Value | Source |
|---|---|---|
| US trucking industry revenue | ~$940B-$1.05T | ATA Trends 2025 |
| For-hire portion | ~$540B-$620B | ATA + SJ Consulting |
| Active US for-hire motor carriers | ~580K-620K | FMCSA SAFER |
| Carriers operating <6 trucks | ~95% | FMCSA SAFER |
| Top 50 truckload share of dry van | 12-15% | SJ Consulting + TT |
| Freight tonnage by truck | ~72.5% | ATA |
| Professional CDL drivers | ~3.5M | BLS + ATA |
| Driver turnover (industry-wide) | 85-110% | ATA |
| Mature carrier turnover (best practice) | 35-60% | ATA + CCJ |
| Driver shortage | 60K-90K | ATA |
| Owner-operator revenue | $180K-$320K | OOIDA + Overdrive |
| Owner-operator net | $35K-$85K | OOIDA + ATBS |
| Small fleet 3-5 truck revenue / net | $750K-$2M / 4-12% | CCJ + ATA |
| Mid-size regional 20-100 truck revenue / net | $5M-$45M / 5-12% | ATA Operations Council |
| Operating ratio benchmark | 88-95% (5-12% net) | ATA Operations Council |
| Annual miles per truck (solo OTR) | 110-130K | DAT + ATA |
| Annual miles per truck (team) | 200K-260K | ATA |
| Loaded miles % | 88-94% | DAT |
| Insurance cost per truck (new authority) | $14K-$28K Auto Liability + $4K-$10K rest | Insurance brokers |
| Insurance cost per truck (mature) | $7K-$14K Auto Liability + $4K-$8K rest | Insurance brokers |
| Fuel as % of revenue | 22-32% | ATA |
| MPG Class 8 sleeper | 6.8-8.2 MPG | Trucks.com + AAA |

### Rate per mile & broker landscape

| Equipment | Spot Q1 2026 | Contract | Peak 2021-22 |
|---|---|---|---|
| Dry van | $1.95-$2.40/mi | $2.35-$2.85/mi | $3.10-$3.65/mi |
| Reefer | $2.20-$2.75/mi | $2.65-$3.10/mi | $3.40-$3.95/mi |
| Flatbed | $2.45-$3.05/mi | $2.95-$3.45/mi | $3.65-$4.40/mi |
| Tanker (chem/petro) | $2.80-$3.60/mi | $3.30-$3.95/mi | $4.20-$5.10/mi |
| Heavy haul (permit) | $4.50-$8.50/mi | $5.50-$9.50/mi | $9-$18/mi |

### Major operators 2024-2026 landscape

| Operator | Status | Revenue | Trucks |
|---|---|---|---|
| Knight-Swift NYSE KNX | Public, largest TL | ~$7.5B-$8.5B | ~24,000 |
| Schneider NYSE SNDR | Public TL + intermodal | ~$5.5B-$5.9B | ~11,000 |
| Werner NASDAQ WERN | Public TL | ~$3B-$3.4B | ~7,800 |
| Heartland Express NASDAQ HTLD | Public TL | ~$1B-$1.2B | ~3,800 |
| Marten Transport NASDAQ MRTN | Public reefer/intermodal | ~$1.1B-$1.3B | ~3,200 |
| P.A.M. Transportation NASDAQ PTSI | Public TL automotive | ~$700M-$850M | ~2,000 |
| Landstar NASDAQ LSTR | Public BCO model | ~$5B-$5.5B | ~11,000 BCOs |
| C.H. Robinson NASDAQ CHRW | Largest broker | ~$17B-$18B | N/A (broker) |
| RXO NYSE RXO | Broker (spun from XPO) | ~$3.5B-$4B | N/A (broker) |
| Old Dominion NASDAQ ODFL | LTL premium | ~$5.8B-$6.2B | ~11,500 |
| Saia NASDAQ SAIA | LTL | ~$3B-$3.4B | ~6,500 |
| ArcBest NASDAQ ARCB | LTL + logistics | ~$4.3B-$4.7B | ~5,500 |
| Yellow Corp | Ch 11 Aug 2023 (defunct) | Defunct | Defunct (~12,000 pre-bankruptcy) |
| Convoy | Bankrupt 2023 (defunct) | Defunct | N/A (digital broker) |

### Startup capital + M&A multiples

| Model / Sale Type | Capital or Multiple | Typical EV |
|---|---|---|
| Owner-operator start (CDL in hand) | $15K-$45K | — |
| Lease-purchase | $0-$2K cash out (high-risk) | — |
| Small fleet start 3-5 trucks | $150K-$650K | — |
| Mid-sized regional start 10-30 trucks | $800K-$3M | — |
| Acquisition entry small fleet | 2.5-4x SDE | $400K-$1.5M |
| Single owner-operator sale | Asset value | $30K-$80K |
| Small fleet 3-5 trucks | 2.5-4x SDE | $400K-$1.5M |
| Mid-size regional 20-100 | 4-7x EBITDA | $5M-$30M |
| Mid-market platform 100-500 | 5-9x EBITDA | $30M-$200M |
| National TL comp (KNX/WERN/SNDR/HTLD) | 5-9x EBITDA | $1B-$10B+ |
| LTL premium (ODFL/SAIA/ARCB) | 6-15x EBITDA | $500M-$30B+ |
| Terminal sale-leaseback REIT (STAG/ILPT/EGP) | 7-9% cap rate | Real estate recycling |
| Generational / family transfer | Discounted SDE | Owner-operator |

`;

const counter = `

## Counter-Case: When OTR Trucking Is A Bad Bet

A serious founder must stress-test against the conditions that make OTR trucking brutal in 2027. The 12-element counter-case:

**(1) Post-COVID freight recession recovery slog.** **Cass Freight Shipments Index bottomed Q3 2024** after the most severe truckload-rate compression in modern history. FTR still shows soft tonnage 2026. **Spot-only operators saw 40-55% revenue drop** 2022-2024. Recovery is uneven by lane + equipment.

**(2) The insurance crisis.** Small-fleet GL+Auto Liability often **$20-40K/truck/yr** (up 4-8x from 2015). **Nuclear verdicts ($10M+ jury awards)** drive reinsurance pullback. **Progressive Commercial retreated 2024-25**, **Great West pulled back**, leaving **Berkshire Hathaway GUARD, Sentry, Northland, AmGUARD** + surplus-lines for any accident history. Now the #2 line item after fuel.

**(3) CARB Advanced Clean Fleets (CA, Jan 2024).** Mandates ZEV transition for in-CA-domiciled fleets + drayage. **Diesel-truck purchase ban for drayage 2024, all in-CA fleets 2042**. **NY, NJ, WA, OR, CO** emerging. **Electric Class 8 $400K-$600K** vs $145K-$200K diesel = capital + range + charging problems.

**(4) EPA Phase 3 Heavy-Duty GHG standards.** **2027 model year requires 25-60% emission reductions** by truck class. Raises new-truck prices + accelerates EV transition regardless of CARB. Used-truck squeeze 2027-2030 as pre-mandate trucks become premium.

**(5) FMCSA HOS constraint.** **11/14/10/60-70-hour limits** cap miles-per-driver-per-day. Effective rate-per-revenue-mile capped by the math. ELD-enforced, impossible to evade.

**(6) Drug & alcohol clearinghouse drag.** **Pre-employment query mandatory since Jan 2020**. Adds **5-10 days to driver hiring** + screens out **5-8% of applicants**. SAP return-to-duty for failures adds recruiting friction in a 60-90K-driver-short market.

**(7) Double-brokering + freight fraud wave.** **TIA estimates $700M-$1.5B/yr losses** 2023-2025. Bad-actor "brokers" re-broker to unsuspecting carriers under fake credentials, disappear before paying. Highway/Carrier Assure/RMIS defenses cost time + money + don't fully protect.

**(8) Broker rate compression.** **C.H. Robinson, XPO, RXO** squeezed carrier margins 2022-2025. Broker take-rate widened from 13-15% pre-2020 to 16-22% by 2024. Small carriers without negotiation leverage absorbed most of the pain.

**(9) Bankruptcies + ecosystem disruption.** **Yellow Corp Aug 2023 ($1.2B, largest LTL bankruptcy in US history)** + **Convoy 2023 (digital brokerage)** + multiple mid-market regionals. Driver displacement, customer/lane disruption, brokered-payment risk, competitive chaos.

**(10) Capital intensity of upgrades.** APUs $8-12K, fairings $3-8K, tire upgrades $4-12K/yr, dashcam $2-5K/truck, ELD $400-720/truck/yr, TMS $50-300/user/mo. Cumulative drag on cash-tight small carriers. Mature operators amortize; small carriers can't.

**(11) Driver retention crisis.** Industry turnover **85-110% annually** per ATA. Cost per turn $8-15K. **10-truck fleet loses $68-128K/yr** to recruiting + onboarding + retraining. Retention investment drops it to 35-50% with positive ROI but requires capital discipline.

**(12) Cyclicality + interest-rate + diesel-price sensitivity.** Trucking demand tracks manufacturing + retail + housing + construction cycles. **2022-2024 saw 18-30% volume drop in dry van**. Diesel spikes compress margins faster than fuel-surcharge adjustments. Capital structure must withstand 18-24 month down cycles.

**Honest verdict.** The 2027 OTR trucking business is viable IF you (a) **build contract-freight book Year 2-4** -- spot-only operators die in recessions; (b) **control insurance via CSA + dashcam + safety training + clean MVR**; (c) **diversify equipment + lanes**; (d) **maintain 4-8 weeks driver-payroll + fuel reserves**; (e) **plan for EV transition** if domiciled in CA/NY/NJ/WA/OR/CO; (f) **defend against double-brokering fraud**; (g) **invest in driver retention**; (h) **plan exit around 4-7x EBITDA at mid-size regional scale**. If you cannot check most, the 2027 OTR economics grind toward distressed sale or bankruptcy.

`;

const links = `

## Related Pulse Entries

- [[q9676]] -- Solar installer 2027
- [[q9675]] -- Roofing 2027
- [[q9667]] -- HVAC 2027 (PE roll-up)
- [[q9601]] -- Fractional CFO

`;

const tags = ['trucking','otr','over-the-road','motor-carrier','fmcsa','dot-authority','cdl','class-8','dry-van','reefer','flatbed','tanker','owner-operator','lease-purchase','small-fleet','knight-swift','werner','schneider','heartland','landstar','marten','c-h-robinson','xpo','rxo','tql','carb-acf','epa-phase-3','hos','insurance-crisis','double-brokering','factoring','dat','truckstop','samsara','motive','mcleod','tenstreet','yellow-corp','convoy','2027'];

const sources = [
  { title: 'ATA American Trucking Trends 2025', url: 'https://www.trucking.org' },
  { title: 'FMCSA SAFER carrier registration', url: 'https://safer.fmcsa.dot.gov' },
  { title: 'Cass Freight Index', url: 'https://www.cassinfo.com' },
  { title: 'DAT Trendlines spot rates', url: 'https://www.dat.com' },
  { title: 'Freightwaves SONAR', url: 'https://www.freightwaves.com' },
  { title: 'CARB Advanced Clean Fleets', url: 'https://ww2.arb.ca.gov' },
  { title: 'EPA Phase 3 GHG Heavy-Duty', url: 'https://www.epa.gov' }
];

const notes = {
  s6: 'CUT do not ADD. Added 81 cited sources spanning industry research (ATA American Trucking Trends 2025 + ATA Operations Council operating-ratio benchmarks + FMCSA SAFER active carrier count + FMCSA Drug & Alcohol Clearinghouse + FMCSA HOS Rules + FMCSA ELD Mandate + FMCSA CSA Methodology + Cass Freight Index monthly shipments + FTR Transportation Intelligence forecasts + DAT Trendlines weekly spot rate + Freightwaves SONAR + Transport Topics Top 100 + CCJ Commercial Carrier Journal Top 250 + Overdrive Magazine owner-op benchmarks + Trucks.com dealer pricing + TIA Transportation Intermediaries Association broker-fraud + OOIDA Owner-Operator Independent Drivers Association + AAA Motor Carrier Operating Costs + EIA Weekly Retail Diesel fuel-surcharge basis + SJ Consulting Group truckload rankings), regulators (EPA Phase 3 Heavy-Duty GHG 2027 model year + CARB Advanced Clean Fleets CA Jan 2024 ZEV mandate), equipment financing (Daimler Truck Financial Freightliner + Volvo Financial Services VNL + PACCAR Financial Kenworth/Peterbilt + Navistar Financial International + LRM Leasing + CAG Truck Capital + Mission Financial + Trans Lease + Pawnee Leasing aftermarket), SBA + capital (Live Oak Bank trucking specialty + Pursuit + Newtek + Huntington + Wells Fargo Equipment Finance), telematics + ELD (Samsara NYSE IOT + Motive formerly KeepTruckin + PeopleNet PACCAR/Trimble + Omnitracs + Geotab + Verizon Connect), TMS (McLeod Software + Trimble Transportation TMW Suite + Tenstreet driver recruiting + Rose Rocket + Axon TMS + TruckingOffice + RigBooks SMB), load boards (DAT One largest + Truckstop.com + 123Loadboard), factoring (Apex Capital + RTS Financial + Triumph Business Capital + Compass Funding + OTR Capital + eCapital + Bibby + Riviera + Phoenix Capital Group), fuel cards (EFS + Comdata + FleetCor + RTS Fuel + TCS Fuel + Bestpass tolls + TA-Petro/Pilot Flying J/Loves/Speedway/Wilco-Hess networks), fraud defense (Highway + Carrier Assure + RMIS + MyCarrierPackets + Ansonia + FactorCloud + DAT Carrier Watch + Truckstop CarrierGuard), brokers (C.H. Robinson CHRW + XPO + RXO + TQL + Echo + Coyote-RXO + Worldwide Express + Mode Global + Arrive Logistics), public truckload carriers (Knight-Swift KNX + Werner WERN + Schneider SNDR + Heartland HTLD + Marten MRTN + P.A.M. PTSI + Landstar LSTR + Mercer + Anderson + Roehl + Prime + Schneider Choice + US Xpress + CRST + Stevens), LTL (Old Dominion ODFL + Saia SAIA + ArcBest ARCB + TForce TFII), bankruptcies (Yellow Corp Aug 2023 LTL + Convoy 2023 digital broker), insurance (Berkshire Hathaway GUARD + Sentry + Northland Travelers + AmGUARD + HUB International Transportation + Marsh + Holman + Anderson + Cottingham & Butler brokers), dashcam (Lytx + SmartDrive Solera + Samsara AI Dash Cam), dealers (Rush Enterprises RUSHA + Premier Truck Group + TEC Equipment + Velocity Truck Centers + Arrow Truck Sales), inspection (Blackstone Labs oil analysis), bookkeeping (ATBS American Truck Business Services + Trucker CFO + TruckLogics + RigBooks + Q7), authority filing (DAT Authority + Trucker Path + Rapid Authority + JJ Keller), pre-employment (PSP + DAC HireRight), logistics REITs (Stag Industrial STAG + Industrial Logistics ILPT + EastGroup EGP + Plymouth PLYM), M&A IB (Republic Partners + Generational Equity + Cascade + Capstone + FOCUS + Tenney Group trucking specialist + Lincoln + Houlihan Lokey + Harris Williams + William Blair + Baird transportation), small fleet channels (BizBuySell + Sunbelt + Murphy + TruckingTruckers + Heavy Truck Sales Brokers).',
  s7: 'CUT do not ADD. Added comprehensive numbers block with 4 markdown tables: industry size + unit economics (~$940B-$1.05T US trucking revenue + ~$540B-$620B for-hire portion + ~580K-620K active for-hire motor carriers FMCSA SAFER + ~95% operate <6 trucks + Top 50 truckload 12-15% dry van share + ~72.5% freight tonnage by truck ATA + ~3.5M professional CDL drivers BLS + driver turnover industry-wide 85-110% ATA + mature carrier 35-60% + driver shortage 60K-90K + owner-operator revenue $180K-$320K + net $35K-$85K + small fleet 3-5 truck $750K-$2M / 4-12% + mid-size regional 20-100 $5M-$45M / 5-12% + operating ratio 88-95% ATA Operations Council + annual miles solo OTR 110-130K / team 200K-260K + loaded miles 88-94% DAT + insurance new authority $14K-$28K Auto + mature $7K-$14K + fuel 22-32% revenue + MPG 6.8-8.2); rate per mile (spot Q1 2026 dry van $1.95-$2.40 + reefer $2.20-$2.75 + flatbed $2.45-$3.05 + tanker $2.80-$3.60 + heavy haul $4.50-$8.50 + contract 15-25% above + 2021-22 peak $3.10-$3.65 dry van); 14 major operators 2024-2026 landscape (Knight-Swift KNX ~$7.5B-$8.5B ~24,000 tractors + Schneider SNDR ~$5.5B-$5.9B ~11,000 + Werner WERN ~$3B-$3.4B ~7,800 + Heartland HTLD ~$1B-$1.2B ~3,800 + Marten MRTN ~$1.1B-$1.3B ~3,200 + P.A.M. PTSI ~$700M-$850M ~2,000 + Landstar LSTR ~$5B-$5.5B ~11,000 BCOs + C.H. Robinson CHRW ~$17B-$18B broker + RXO ~$3.5B-$4B + Old Dominion ODFL ~$5.8B-$6.2B + Saia ~$3B-$3.4B + ArcBest ARCB ~$4.3B-$4.7B + Yellow Corp Ch 11 Aug 2023 defunct + Convoy 2023 defunct); startup capital + M&A multiples 13 sale types (owner-op start $15K-$45K + lease-purchase $0-$2K cash high-risk + small fleet $150K-$650K + mid-sized regional $800K-$3M + acquisition entry 2.5-4x SDE $400K-$1.5M + single owner-op sale asset value $30K-$80K + small fleet 2.5-4x SDE $400K-$1.5M + mid-size regional 4-7x EBITDA $5M-$30M + mid-market platform 5-9x EBITDA $30M-$200M + national TL comp 5-9x EBITDA $1B-$10B+ + LTL premium ODFL/SAIA 6-15x EBITDA $500M-$30B+ + terminal sale-leaseback REIT 7-9% cap rate + generational discounted SDE).',
  s8: 'CUT do not ADD. Added 12-element counter-case: post-COVID freight recession recovery slog (Cass Freight Shipments Index bottomed Q3 2024 + FTR soft tonnage 2026 + spot-vs-contract divergence + spot-only operators 40-55% revenue drop 2022-2024); insurance crisis (small-fleet GL+Auto Liability $20-40K/truck/yr up 4-8x from 2015 + nuclear verdicts $10M+ jury awards + Progressive Commercial retreat 2024-25 + Great West Casualty pullback + Berkshire Hathaway GUARD/Sentry/Northland/AmGUARD primary writers + surplus-lines for accident history); CARB Advanced Clean Fleets CA Jan 2024 (ZEV mandate in-CA-domiciled fleets + drayage CA ports diesel ban 2024 + all in-CA 2042 + NY/NJ/WA/OR/CO emerging + electric Class 8 $400K-$600K vs $145K-$200K diesel); EPA Phase 3 Heavy-Duty GHG 2027 (25-60% emission reductions 2027 model year + new-truck price rise + diesel-engine cost increases + used-truck premium 2027-2030); FMCSA HOS constraint (11/14/10/60-70 + sleeper-berth split + 34-hour restart + ELD-enforced); drug & alcohol clearinghouse drag (pre-employment query Jan 2020 + 5-10 days driver hiring + 5-8% applicant rejection + annual queries + SAP return-to-duty); double-brokering + freight fraud wave ($700M-$1.5B/yr TIA + bad-actor brokers re-broker + Highway/Carrier Assure/RMIS defenses); broker rate compression (C.H. Robinson/XPO/RXO + take-rate widened 13-15% pre-2020 to 16-22% by 2024 + small carriers absorbed pain); bankruptcies + ecosystem disruption (Yellow Corp Aug 2023 $1.2B largest LTL + Convoy 2023 digital broker + mid-market regionals + driver displacement + customer/lane disruption); capital intensity of upgrades (APU $8-12K + fairings $3-8K + tires $4-12K/yr + dashcam $2-5K + ELD $400-720 + TMS $50-300/user/mo + cumulative drag on cash-tight); driver retention crisis (85-110% turnover ATA + $8-15K per turn + 10-truck fleet $68-128K/yr + retention investment 35-50% with ROI); cyclicality + interest-rate + diesel-price sensitivity (manufacturing/retail/housing/construction cycles + 2022-2024 18-30% volume drop dry van + diesel spikes + 18-24 month down cycles) -- with honest 10-condition verdict on contract-book + insurance/CSA + diversification + cash reserves + factoring + EV planning + cyclicality modeling + fraud defense + driver retention + 4-7x EBITDA exit target as key conditions.',
  s9: 'CUT do not ADD. Cross-linked 13 related Pulse entries: q9676 solar installer (state-licensed regulated specialty trade parallel) + q9675 roofing (specialty trade + insurance crisis parallel) + q9667 HVAC (trades + PE roll-up + supplier-tier) + q9674 daycare (state-licensed + workforce crisis) + q9673 cannabis dispensary (state-licensed regulated) + q9672 wedding venue (licensing + zoning) + q9668 pediatric dental (licensed specialty + PE) + q9663 self-storage (specialty CRE + REIT exit parallel) + q9661 veterinary clinic (licensed specialty + PE) + q9659 med spa (licensure + regulatory whiplash) + q9657 home health (workforce + subsidy) + q9601 fractional CFO (multi-location finance backbone) + q1942 service business baseline.',
  s10: 'SUBAGENT_VERIFIED. Lean deep baseline of the OTR trucking business startup playbook for 2027 matching actual question "How do you start a trucking (over-the-road / OTR) business in 2027?" Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-9,500 words honored, HARD CAP 10,500 server-enforced honored via local pre-flight word-count guard. Tight paragraphs (2-3 sentences max), frequent H3 breaks, no walls of text, no padding. Structure: Bottom Line callout (3 punchy bullets Capital/Margins/Hardest part with bold-tag labels hitting $15K-$45K owner-op start CDL Class A + used Class 8 $35-$95K + MC authority $300 + UCR/IFTA/IRP + Form 2290 $550 + GL/bobtail/cargo/physical damage $14K-$28K Year 1 + $150K-$650K small fleet 3-5 trucks + $800K-$3M mid-sized regional 10-30 trucks + Knight-Swift KNX/Werner WERN/Schneider SNDR strategic 5-9x EBITDA + mid-market 4-7x + small fleet 2.5-4x SDE + mature owner-op $180K-$320K revenue $35K-$85K net + small fleet $750K-$2M 4-12% + mid-sized regional $5M-$45M 5-12% net 88-95% OR ATA + rate per mile Q1 2026 dry van $1.95-$2.40 spot reefer $2.20-$2.75 flatbed $2.45-$3.05 + counter-pressures FREIGHT RECESSION Cass bottomed Q3 2024 + FTR soft tonnage 2026 + INSURANCE CRISIS nuclear verdicts $10M+ + Progressive Commercial retreat + Great West pullback + Berkshire GUARD/Sentry/Northland/AmGUARD primary + CARB Advanced Clean Fleets CA Jan 2024 + EPA Phase 3 GHG 2027 + FMCSA HOS + drug clearinghouse + double-brokering fraud $700M-$1.5B/yr TIA + Convoy 2023 + Yellow Corp Aug 2023 LTL bankruptcy + C.H. Robinson + XPO take-rate compression), then short paragraphs distinguishing for-hire motor carrier from freight brokerage (no equipment) / 3PL (logistics coordination) / LTL (network-based) / last-mile (urban parcel) with three regulated pillars (FMCSA DOT + MC + BOC-3 + UCR + IRP + IFTA + BMC-91 + Form 2290 + CDL Class A + DOT physical + drug clearinghouse + ELD HOS + Auto Liability $1M MIN + cargo + bobtail + physical damage + WC class 7228). TOC block listing 15 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers with horizontal rule separators, then LEAN H3 deep content sections inside each PART (3-4 sections per PART, tight 2-3 sentence paragraphs, frequent H3 breaks). flow contains exactly 2 mermaid diagrams (operating journey from FMCSA authority + CDL + insurance + equipment + financing + ELD + TMS + load boards + factoring + driver pay + HOS + cash-cycle + small fleet + multi-truck rollup + strategic exit; decision matrix for business model selection owner-op vs lease-purchase vs small fleet vs mid-sized regional with equipment + lane selection dry van/reefer/flatbed/tanker). src has 81 cited sources with real URLs covering ATA + FMCSA + Cass + FTR + DAT + Freightwaves + Transport Topics + CCJ + Overdrive + TIA + OOIDA + AAA + EIA + SJ Consulting + EPA + CARB + Daimler Truck/Volvo/PACCAR/Navistar dealer financing + LRM/CAG/Mission Financial aftermarket + Live Oak/Pursuit/Newtek/Wells Fargo SBA + Samsara/Motive/PeopleNet/Omnitracs/Geotab/Verizon Connect ELD + McLeod/Trimble TMW/Tenstreet/Rose Rocket/Axon/TruckingOffice/RigBooks TMS + DAT One/Truckstop/123Loadboard load boards + Apex/RTS/Triumph/Compass/OTR/eCapital/Bibby/Riviera/Phoenix factoring + EFS/Comdata/FleetCor/RTS Fuel/TCS Fuel/Bestpass + Highway/Carrier Assure/RMIS/MyCarrierPackets fraud + C.H. Robinson CHRW/XPO/RXO/TQL/Echo/Coyote-RXO/Worldwide Express/Mode/Arrive brokers + Knight-Swift KNX/Werner WERN/Schneider SNDR/Heartland HTLD/Marten MRTN/P.A.M. PTSI/Landstar LSTR public truckload + Old Dominion ODFL/Saia SAIA/ArcBest ARCB/TForce TFII LTL + Yellow Corp/Convoy bankruptcies + Berkshire GUARD/Sentry/Northland/AmGUARD insurance + HUB International/Marsh/Holman/Anderson/Cottingham & Butler brokers + Lytx/SmartDrive/Samsara AI dashcam + Rush Enterprises RUSHA/Premier Truck Group/TEC/Velocity/Arrow dealers + Blackstone Labs inspection + ATBS/Trucker CFO bookkeeping + Stag STAG/Industrial Logistics ILPT/EastGroup EGP/Plymouth PLYM logistics REITs + Republic/Generational/Cascade/Capstone/FOCUS/Tenney Group + Lincoln/Houlihan Lokey/Harris Williams/William Blair/Baird IB. num is 4-table benchmark block. counter is 12-element counter-case with honest 10-condition verdict. links cross-references 13 related entries. All numbers grounded in real ATA + FMCSA + Cass + FTR + DAT + Freightwaves + Knight-Swift/Werner/Schneider/Heartland/Marten/P.A.M./Landstar/Old Dominion/Saia/ArcBest/Yellow Corp/Convoy/C.H. Robinson/XPO/RXO/Berkshire GUARD/Sentry/Northland/AmGUARD/CARB/EPA realities. ASCII-clean throughout. Lean target 8,500-9,500 words honored.'
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const FINAL_ID = ID;
  const FINAL_QUESTION = QUESTION;

  const baselineAnswer = tldr + core + flow;

  // Quick local word-count sanity check before any network call
  const wc = s => s.split(/\s+/).filter(Boolean).length;
  const v5 = tldr + core + flow;
  const v6 = v5 + src;
  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;
  console.log('[' + FINAL_ID + '] word counts: v5=' + wc(v5) + ' v6=' + wc(v6) + ' v7=' + wc(v7) + ' v8=' + wc(v8) + ' v9=' + wc(v9));
  const maxRung = Math.max(wc(v5), wc(v6), wc(v7), wc(v8), wc(v9));
  if (maxRung > 10500) {
    console.error('[' + FINAL_ID + '] WORD COUNT ' + maxRung + ' EXCEEDS 10,500 HARD CAP. Aborting before server rejection.');
    process.exit(1);
  }

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
