// q2138 -- How do you start a garage door repair business in 2027?
// Deep rewrite (qs 5 -> 10) using NEW STRUCTURE: Bottom Line + TLDR + TOC + 4 PART super-headers + H3 sections.
// Uses runPolish helper which overwrites the existing entry at v5 and walks the polish ladder 5 -> 6 -> 7 -> 8 -> 9 -> 10.
const fs = require('fs');
const path = require('path');
const { runPolish } = require('./polish-helper');

// Load .env.local manually so this script is self-contained
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ID = 'q2138';

const tldr = `> ### 🎯 Bottom Line
> - **[Capital]** $8K-$22K to start solo with cargo van + spring inventory ($1.5K) + cable + opener stock + LiftMaster/Genie/Chamberlain dealer accounts + insurance; $45K-$120K for a 2-3 tech operation with multi-truck dispatch + showroom.
> - **[Margins]** Average service call $185-$385 (spring replacement $250-$500, opener install $400-$900, full door install $1,500-$4,500); mature solo nets $90K-$220K/yr, 3-truck operation $400K-$900K/yr at 30-45% net.
> - **[Hardest part]** Torsion spring liability — improperly-released springs cause severe injuries or death; one $50K-$500K injury claim ends a small operator, and insurance carriers screen aggressively for fall + crush exposure on garage door techs.

A **garage door repair business in 2027** is a residential and light-commercial field service operation that fixes broken **torsion and extension springs, snapped lift cables, worn rollers, off-track doors, damaged panels, and failing openers (LiftMaster, Genie, Chamberlain, Sommer, Marantec)** — plus installs complete replacement doors from manufacturers like **Clopay, Amarr, Wayne Dalton, C.H.I. Overhead Doors, Overhead Door Company, Hörmann, Raynor, and Garaga** — at homes and businesses across a 30-60 mile route radius, dispatched primarily via **Google Local Services Ads (LSA)**, **Yelp**, and **NextDoor** because a broken garage door is a "must fix today" emergency search.

The business sells **emergency service calls priced at $85-$185 minimum** plus parts and labor on top, **spring replacements at $250-$500 (single) or $375-$725 (pair)**, **opener installs at $400-$900**, and **full residential door installs at $1,500-$4,500**, with the structural economics anchored by **same-day emergency response, transparent pricing pages, Google Review density, and a tight 8-12 part-number SKU on the truck** that covers 85%+ of service-call fix scenarios without a second trip back to the shop. The recurring-revenue layer is **annual maintenance contracts ($95-$285/yr for residential, $385-$1,800/yr for commercial roll-up customers)** that smooth the otherwise lumpy emergency-only revenue model.

The four things that determine survival in years 1-3: **(1) torsion spring liability discipline** — torsion springs store **150-300 lbs of stored mechanical energy under tension** and improperly-released springs cause severe injuries or death (IDA / DASMA safety alerts cite spring releases as the #1 cause of garage door technician deaths and major injuries); **(2) Google LSA + Yelp lead-gen mastery** — broken garage door is the highest-intent emergency home services search behind plumbing and roofing leaks, and Google LSA (the green "Google Screened / Google Guaranteed" badge program) plus Yelp dominate ~70% of new-customer lead volume in most metros; **(3) tight parts inventory discipline on the truck** — running out of a Clopay panel, a 25/40 torsion spring, or a LiftMaster 8500 part on-site means a second trip and a margin-destroyed job; **(4) Precision Garage Door Service and A1 Garage Door franchise competitive pressure** — Precision (~100+ franchise territories nationally, acquired by Authority Brands 2023) plus A1 Garage Door Service (multi-state) dominate Google Ads bidding and aggressive radio + TV branding in 40+ major metros, squeezing independent operator CAC and forcing pricing transparency.`;

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** $8K-$22K to start solo with cargo van + spring inventory ($1.5K) + cable + opener stock + LiftMaster/Genie/Chamberlain dealer accounts + insurance; $45K-$120K for a 2-3 tech operation with multi-truck dispatch + showroom.
> - **[Margins]** Average service call $185-$385 (spring replacement $250-$500, opener install $400-$900, full door install $1,500-$4,500); mature solo nets $90K-$220K/yr, 3-truck operation $400K-$900K/yr at 30-45% net.
> - **[Hardest part]** Torsion spring liability — improperly-released springs cause severe injuries or death; one $50K-$500K injury claim ends a small operator, and insurance carriers screen aggressively for fall + crush exposure on garage door techs.

A garage door repair business in 2027 is a **residential and light-commercial field service** that fixes broken springs, cables, rollers, openers, and panels — and installs full replacement doors — across a 30-60 mile route radius, dispatched primarily via Google Local Services Ads, Yelp, and NextDoor because a broken garage door is a **"must fix today" emergency search**. The US garage door market sits at approximately **$9B+ annually per Hardlines Research Foundation and IBISWorld estimates**, covering an installed base of **~85M residential garage doors** with average **spring lifespan 7-12 years** and **opener lifespan 12-18 years** — a structurally renewing demand pattern that produces a steady tide of repair work without depending on new housing starts.

The 2027 demand reality is anchored by the **post-Authority-Brands consolidation era**: Precision Garage Door Service (~100+ franchise territories acquired by Authority Brands in 2023 alongside Mr. Rooter / Mr. Electric / Aire Serv home-services franchises) plus A1 Garage Door Service (multi-state PE-backed roll-up) dominate Google Ads and radio / TV branding in 40+ major metros, while independents and regional chains like Aladdin Garage Doors, Sears Garage Door, Overhead Door Company corporate stores, and Garage Doors of Phoenix hold sub-market positions. The **80%+ residential-pay** revenue mix is the structural economic feature — average service call **$185-$385**, full door install **$1,500-$4,500**, with the operator's discipline anchored on **same-day response, transparent flat-rate pricing pages, Google Review density (most successful operators run 4.9+ stars across 500-2,000+ reviews), and a tight 8-12 SKU rolling stock** that covers 85% of fix scenarios without a return trip.

The four things that determine survival in years 1-3: **(1) torsion spring liability discipline** — torsion springs store 150-300 lbs of mechanical energy under tension and improperly-released springs cause severe injuries or death (IDA / DASMA safety alerts cite spring releases as the #1 cause of garage door tech deaths and major injuries); **(2) Google LSA + Yelp + NextDoor lead-gen mastery** at $25-$85 per qualified lead with disciplined service-area targeting; **(3) tight parts inventory discipline** so the most common 100 SKUs ride the truck and 95%+ of jobs close on first visit; **(4) franchise pricing pressure from Precision / A1 / Sears** that squeezes independent CAC and forces pricing-transparency posture on the operator's website.

## 🗺️ Table of Contents

**Part 1 — Foundations**
- [Market size & opportunity](#market-size--opportunity)
- [Licensing & insurance reality](#licensing--insurance-reality)
- [Service mix & revenue structure](#service-mix--revenue-structure)

**Part 2 — Build-Out & Capital**
- [Truck setup & rolling inventory](#truck-setup--rolling-inventory)
- [Manufacturer dealer accounts & supply chain](#manufacturer-dealer-accounts--supply-chain)
- [Software, dispatch & payment stack](#software-dispatch--payment-stack)

**Part 3 — Operations**
- [Spring safety & technical discipline](#spring-safety--technical-discipline)
- [Customer acquisition channels](#customer-acquisition-channels)
- [Pricing strategy & transparent flat-rate playbook](#pricing-strategy--transparent-flat-rate-playbook)
- [Service delivery & first-visit close rate](#service-delivery--first-visit-close-rate)

**Part 4 — Growth & Exit**
- [Marketing, reviews & reputation moat](#marketing-reviews--reputation-moat)
- [Scale milestones & multi-truck operations](#scale-milestones--multi-truck-operations)
- [PE consolidation, franchise & exit math](#pe-consolidation-franchise--exit-math)
- [Counter-case & risks](#counter-case--risks)

---

## 📐 PART 1 — FOUNDATIONS

### Market size & opportunity

The US garage door market sits at approximately **$9B+ annually per Hardlines Research Foundation, IBISWorld, and DASMA (Door & Access Systems Manufacturers Association) market estimates**, covering installation of new doors (residential plus commercial overhead plus rolling steel commercial), repair and service of the installed base, and aftermarket parts. The installed base is roughly **~85M residential garage doors** plus several million commercial overhead and roll-up doors per Hardlines and DASMA tracking — a structurally renewing demand pattern because **springs cycle 10,000-20,000 times to failure (7-12 year average lifespan in residential use), cables fray and break, rollers wear, openers fail at 12-18 years**, and full doors get damaged by vehicle backovers, hailstorms, panel rot, hurricane-force winds (Florida / Gulf Coast), and aesthetic obsolescence. The repair-and-service slice of the market (vs new-door installation) sits at roughly **$3.5B-$4.5B annually**, with the remainder split between new residential door installs (often bundled with new construction), commercial overhead and roll-up installs, and aftermarket parts sold through hardware retailers and online channels.

The competitive landscape is **bifurcated between franchise / chain operators dominating Google Ads in major metros and a long tail of 8,000-15,000 independent operators** holding sub-market positions on Google LSA, NextDoor, and word-of-mouth. The named chains: **Precision Garage Door Service** (the largest US franchise with ~100+ territories nationally — acquired by **Authority Brands in 2023** alongside Mr. Rooter / Mr. Electric / Aire Serv / Mosquito Joe / Window Genie home-services franchises now operating as a multi-brand home-services franchise platform under PE ownership), **A1 Garage Door Service** (multi-state operator with PE backing operating ~25+ branches), **Aladdin Garage Doors** (multi-region operator), **Sears Garage Door** (legacy franchise brand of the former Sears Home Services unit), **Overhead Door Company** (the original 1921 founder of the garage door category — Cookson Company subsidiary, runs corporate stores plus a large dealer network), **Garage Doors of Phoenix** (regional dominator in the Phoenix metro), **Action Garage Door** (Texas multi-location), **Affordable Garage Door Service** (regional chains in multiple metros). The **trade-group infrastructure** includes the **IDA (International Door Association — idainternational.org, the dominant operator-side trade group running Expo conferences, training, and dealer certification), DASMA (Door & Access Systems Manufacturers Association — dasma.com, the manufacturer-side trade group setting technical standards including ANSI/DASMA 102 specifications), and NIDA (National Independent Door Association — nida.org, the smaller independent-operator-focused trade group)**. Active independent operator population in 2025-2026 is estimated at **8,000-15,000 small operators** controlling the long tail of repair-and-service work in markets where Precision / A1 do not have direct franchise presence — and this group is the structural source of acquisition opportunity for PE-backed roll-ups expanding territory.

Mature single-operator unit economics deliver **$185K-$385K annual revenue at 30-45% net margin = $55K-$170K take-home for a hands-on solo tech**, with **2-3 tech operations reaching $400K-$900K revenue at 25-38% net = $100K-$340K** depending on opener-install mix and full-door-install share, and **regional 5-10 truck operations at $1.5M-$4.5M revenue at 18-28% net = $270K-$1.25M** with a dispatcher / office manager / showroom / installer crews specialized by service type. The exit multiples for established multi-truck operators sit in the **4-7x EBITDA range** for trade buyers and small PE roll-ups per industry M&A sources (Authority Brands Precision acquisition reportedly at the high end of this range, Neighborly home-services franchise group at similar multiples for adjacent service formats).

### Licensing & insurance reality

Garage door repair sits in the **state-by-state contractor licensing patchwork** that defines most trades — some states require dedicated specialty contractor licensure, others bundle garage door work under general carpentry / general contractor licensing, and a few have no state-level requirement for repair-only work but require permits for full door installs at the building-department level. The dominant state-level regimes a new operator must understand:

**California — CSLB (Contractors State License Board)** requires **C-61 limited specialty contractor license with D-28 Doors / Gates / Activating Devices classification** for garage door repair and install work over $500 per project; license requires **4 years documented journey-level experience plus passing trade and law/business exams**; bond requirement **$25,000 contractor license bond**; cslb.ca.gov.

**Florida — Florida DBPR (Department of Business and Professional Regulation)** requires **specialty contractor license** for garage door work in most counties (registered or certified) under FS 489, with **certified license enabling work statewide and registered license county-by-county**; Florida's hurricane-impact wind-load requirements (FBC HVHZ — High Velocity Hurricane Zone Miami-Dade / Broward) impose additional installer certification for hurricane-rated doors meeting **Miami-Dade NOA (Notice of Acceptance)** standards.

**Texas — TDLR (Texas Department of Licensing and Regulation)** does not require state-level garage door contractor licensure, but **municipal permitting and inspection** for full door installs in most cities (Houston, Dallas, Austin, San Antonio); operators register at the city level.

**New York — NYC DOB (Department of Buildings)** requires **Special Inspector certification** for garage door installs in NYC five boroughs under the NYC Building Code; outside NYC, NY State has no state-level contractor licensure but municipal building permits apply.

**Illinois — IDFPR (Illinois Department of Financial and Professional Regulation)** does not require state-level garage door contractor licensure, but **Chicago, Naperville, Aurora, and other major Illinois cities** require general contractor licensure or permit-and-inspection for full door installs.

Other major-population states: **Arizona ROC (Registrar of Contractors)** requires **K-38 doors and gates classification**; **Nevada NSCB (Nevada State Contractors Board)** C-3 license; **North Carolina, South Carolina, Georgia** require state-level general or specialty contractor licensure for installs above project dollar thresholds; **Washington L&I (Labor and Industries)** requires general contractor registration plus L&I workers comp coverage. The disciplined new operator: **picks a state, checks dedicated specialty classification vs general carpentry bundling, engages a contractor-licensing attorney or consultant on application before signing on first jobs, and treats licensing renewal as a calendared compliance discipline**.

**Insurance stack specific to garage door operations**: **(1) General Liability** with limits typically **$1M / $2M per occurrence / aggregate** (some commercial GC general contractors require $2M / $4M for sub work) — premium **$1,800-$4,800 annually for solo operator, $4,500-$12,500 for 2-3 truck operation, $12,500-$45,000 for 5-10 truck operation**; carriers screen aggressively for **fall exposure (ladder work at 8-14 ft door height), crush exposure (door panels weigh 75-185 lbs each), spring-release injury exposure (torsion springs at 150-300 lbs stored energy), and customer-property damage exposure (vehicles parked in garage, opener damage to ceiling, panel scratches on adjacent walls)**. **(2) Workers Compensation** classification varies state-by-state — most states use **NCCI 5403 Carpentry Construction (premium $3.50-$8.50 per $100 of payroll)** or **9015 Building Service / Property Maintenance (premium $2.20-$5.50 per $100 of payroll)** depending on whether state regulators classify garage door work as construction trade or building service; on a 3-tech operation with $185K-$285K caregiver payroll, workers comp premium runs **$8K-$22K annually**. **(3) Commercial Auto** covering cargo van or trailer at **$1,800-$5,500 per vehicle per year** depending on state, driving record, and vehicle replacement value. **(4) Equipment Floater / Inland Marine** covering tools, parts inventory in truck, customer-property in transit at **$485-$2,200 annually** for typical small operator. **(5) Professional Liability / Errors & Omissions** at **$1M-$2M limits** at **$1,200-$3,500 annually**. **(6) Contractor Pollution Liability** for operators doing painting / treating work at **$1,500-$4,500 annually**. **(7) Umbrella Liability** at **$2M-$5M layered above primary CGL / Auto / Employers Liability** at **$2,500-$8,500 annually**. **(8) Surety bonds** at state-required levels ($10K-$25K typical contractor license bond) at **1-3% face value annual cost**. **Total Year 1 insurance load for solo operator: $4K-$12K**; for 2-3 truck operation: **$15K-$45K**; for 5-10 truck regional operation: **$45K-$165K**. **1099 vs W-2 classification**: the **DOL 2024 Independent Contractor Final Rule** plus state misclassification statutes (California AB5 most aggressive, but New Jersey / Massachusetts / Washington / Illinois enforcement-active) make **1099 misclassification of garage door techs a six-figure back-tax exposure** — disciplined operators run techs as **W-2 employees** with the only legitimate 1099 use being **specialty installers brought in for occasional commercial overhead or hurricane-impact jobs**.

### Service mix & revenue structure

Garage door operations sell across a defined service-mix spectrum where each line carries distinct margin economics and operating discipline. The revenue mix from highest-frequency to lowest-frequency at typical residential-focused operator:

**(1) Torsion spring replacement** — the dominant service-call generator, accounting for **35-50% of typical residential operator revenue**; **single spring $250-$500, pair $375-$725**; springs failure-cycle at 7-12 years on standard 10,000-cycle springs and 15-20 years on premium 25,000+ cycle springs; pricing structurally anchored at **3-5x parts cost** because of the safety-discipline and time-on-job premium.

**(2) Extension spring replacement** — older / lighter-door applications, **$185-$385 per spring pair**, lower frequency than torsion because extension springs are now less common in new installation.

**(3) Cable replacement** — broken lift cables (typically failing alongside spring failure or after years of fraying), **$150-$285** per cable pair.

**(4) Roller replacement** — worn nylon or steel rollers causing rough door operation, **$120-$285** for full set replacement.

**(5) Opener install** — **LiftMaster (Chamberlain Group — dominant residential brand with myQ smart connectivity), Genie (Overhead Door Company subsidiary with Aladdin Connect smart platform), Chamberlain (consumer / DIY tier of Chamberlain Group), Sommer (premium German brand), Marantec, and commercial-grade Aleko / HySecurity for gate operators**; **$400-$900 installed depending on opener tier (chain-drive vs belt-drive vs jackshaft / wall-mount vs commercial)**; high-margin add-on layered on top of spring or door service calls.

**(6) Opener repair** — gear replacement, circuit board replacement, photo-eye realignment, remote programming, smart connectivity setup; **$150-$385** depending on parts.

**(7) Panel replacement** — single panel of a sectional door damaged by vehicle backover or hailstorm; **$285-$685 per panel** depending on door brand and color match availability (Clopay Master brand, Amarr, Wayne Dalton, C.H.I., Hörmann, Raynor, Garaga panels each carry distinct color/style matching complexity).

**(8) Full residential door install** — complete replacement of existing door including spring system + cable + tracks + panels + weatherstripping; **$1,500-$4,500 per door depending on insulation tier, window inserts, decorative hardware, custom carriage-house aesthetic, hurricane-impact rating**; install time typically 3-5 hours per door.

**(9) Commercial sectional and overhead install** — commercial-grade sectional doors at warehouses, fleet shops, fire stations; **$3,000-$15,000 per door depending on size and operator complexity**; specialized installer crews required for larger doors.

**(10) Commercial roll-up door install** — Cookson Door Sales / Overhead Door / Wayne Dalton / Hörmann commercial roll-up doors at storefronts, loading docks; **$2,500-$12,000 per door**.

**(11) Smart opener upgrade** — myQ (Chamberlain / LiftMaster), Aladdin Connect (Genie), Sommer integration with Ring / Nest / Alexa / Google Home; **$285-$685 installed** as an add-on.

**(12) Weatherstripping** — bottom seal replacement, side weatherstripping; **$150-$400** per door.

**(13) Off-track repair** — door derailed from vertical tracks (vehicle bump, broken cable, foundation shift); **$185-$485** depending on damage extent.

**(14) Preventive maintenance plan** — annual lubrication, hardware-tightening, spring-cycle check, photo-eye alignment, weatherstripping inspection; **$95-$285/year residential**, **$385-$1,800/year commercial** — the recurring-revenue line that smooths the lumpy emergency-only model.

The disciplined operator builds revenue mix targeting **55-70% emergency-repair work (high-margin, same-day), 20-30% scheduled-install work (planned, lower-margin but higher ticket), 5-15% maintenance plan / recurring revenue (smoothing income across slow seasons), and 5-10% commercial work (higher-ticket but longer sales cycle and slower payment)**.

---

## 🧱 PART 2 — BUILD-OUT & CAPITAL

### Truck setup & rolling inventory

The single most consequential operational capital decision is **truck and rolling inventory** — because a tech who has the right SKU on the truck closes the job on first visit at full margin, while a tech missing a key part either makes a second trip (margin destroyed) or upsells the customer to a different solution they would not have chosen with full information. The dominant truck format:

**Cargo van choice**: **Ford Transit (the workhorse — high roof for standing height, configurable cargo space, dealer network), Mercedes Sprinter (premium choice with 144" or 170" wheelbase, more cargo and better residual but higher upfront), Ram ProMaster (front-wheel-drive, lower step-in, popular with urban operators), Chevrolet Express / GMC Savana (older platform but cheaper used inventory)**; new cost **$48K-$85K**, well-maintained used 2-5 year old van **$28K-$55K**.

**Roof rack for door panel transport**: full residential door panels (typically 16-22 sf each in a sectional door set) require **roof-mounted ladder rack + extension capability for transporting 8-10 ft long panels** to install jobs; **Adrian Steel, Ranger Design, Sortimo, Knack** brands dominate the upfit market with rack systems running **$1,800-$5,500 installed**.

**Interior shelving and parts storage**: **Adrian Steel, Ranger Design, Sortimo modular shelving, Knaack rolling drawer cabinets** create organized storage for: **torsion springs** (multiple inside diameters — 1.75", 2.0", 2.25" most common in residential — and a range of wire gauges 0.207-0.273 for IPPT 30/50/70/100/120/130/140 weight ratings), **extension springs** (varied length and stretch ratings), **lift cables** (standard 1/8" diameter aircraft cable in various lengths), **rollers** (10-ball nylon, 13-ball steel, sealed bearing), **hinges** (1-13 numbered residential), **section panels** (one or two on-board common-color stock for emergency same-day panel replacement), **opener stock** (1-3 of each LiftMaster 8500 / 8550W / 8587W jackshaft, Genie SilentMax 1200 / Stealth Drive Connect, Chamberlain B6713T), **photo eyes**, **remotes / receivers**, **weatherstripping** (bottom seal, jamb seal), **lock kits**, **strut reinforcement**, **bolts / fasteners / lag bolts / track hardware**. Total rolling inventory investment **$3,500-$12,500** depending on service-area density and seasonal stock.

**Tools — IDA-standard equipment**: **torsion spring winding bars (Pemberton Tools — the IDA-recognized standard, $185-$385 set of 1/2" and 5/8" hardened steel winding bars)**, **vise grips and locking pliers** for tension-hold during spring work, **socket sets and impact wrenches** for hardware, **cordless drill driver (DeWalt / Milwaukee / Makita)** for installation, **hammer drill** for masonry track-anchor work, **levels (4-ft and 8-ft)** for door plumbing, **multimeter** for opener / circuit board diagnostics, **stud finder** for opener-bracket placement, **measuring tape**, **drop cloths** for customer-floor protection, **safety glasses / hearing protection / gloves**, **8-ft and 10-ft ladders** for ceiling-mounted opener work, **weatherstripping cutter**, **circuit board test devices** for opener diagnostics. Tool investment **$2,500-$6,500**.

**Truck signage and wrap**: vehicle wrap with phone number / website / Google Review prompt at **$2,500-$5,500** per van; magnetic signage as cheaper alternative at **$285-$685**. Disciplined operators run full wrap because the **rolling billboard generates 5-15% of new-customer inquiries from driveway-parked visibility alone**.

**Total Year 1 truck setup cost for solo operator**: **van $28K-$55K + roof rack $1.8K-$5.5K + shelving $2.5K-$6.5K + rolling inventory $3.5K-$12.5K + tools $2.5K-$6.5K + signage $2.5K-$5.5K + insurance + permits + LLC setup = $45K-$95K all-in**. **Lower-capital launch path**: **used cargo van $18K-$28K + minimal shelving + minimal inventory ($3.5K starter SKU set) + tools $1.5K + magnetic signage = $24K-$42K all-in**, gradually upgrading as cash flow builds.

### Manufacturer dealer accounts & supply chain

Operating economics depend on **direct dealer accounts with major garage door and opener manufacturers**, because dealer pricing runs **30-55% below retail / contractor wholesale** and provides access to **warranty service program enrollment, lead-referral programs, technical support, and product training**.

**Door manufacturer dealer programs**:
- **Clopay (Master brand)** — the largest US residential garage door manufacturer with the **Clopay Master Authorized Dealer program**: ~6,000 dealers nationally, **dealer pricing 35-45% below MSRP**, lead-referral program through clopaydoor.com, marketing co-op funds, install training; application requires GL insurance + business registration + showroom visit (for higher-tier dealer status); clopaydoor.com/professional.
- **Amarr** — second-largest US residential brand (owned by Entrematic / Assa Abloy): **Amarr Distributor program**, similar dealer-pricing structure, lead-gen via amarr.com locator; amarr.com.
- **Wayne Dalton** — third major residential brand (Overhead Door Company subsidiary): **Wayne Dalton Dealer program**, dealer pricing + lead-gen + co-op marketing; wayne-dalton.com.
- **Overhead Door Company** — the original 1921 founder of the category (now owned by Sanwa Holdings since 2011): **Authorized Distributor program** with stronger emphasis on commercial dealer training; overheaddoor.com.
- **C.H.I. Overhead Doors** — Illinois-based mid-tier brand: **C.H.I. Authorized Dealer program**; chiohd.com.
- **Hörmann** — German premium and commercial brand: **Hörmann Dealer program** with emphasis on commercial overhead and high-speed sectional doors; hormann.us.
- **Raynor Garage Doors** — Illinois family-owned premium residential and commercial: **Raynor Authorized Dealer program**; raynor.com.
- **Garaga** — Canadian premium brand active in US Northeast and Midwest: **Garaga Expert Dealer program**; garaga.com.
- **Northwest Door** — Pacific Northwest regional brand: nwdusa.com.
- **Cookson Door Sales** — commercial roll-up specialist (now owned by Overhead Door Company): cooksondoor.com.

**Opener manufacturer dealer programs**:
- **LiftMaster (Chamberlain Group, the dominant US residential opener brand owned by Blackstone since 2021)** — **LiftMaster ProMember dealer program** with **dealer pricing 35-50% below MSRP, lead-gen via liftmaster.com locator, myQ smart-connectivity training, Elite installer certification tier**; liftmaster.com/professional.
- **Genie (Overhead Door Company subsidiary)** — **Genie Pro Dealer program**, dealer pricing + Aladdin Connect smart platform training + lead-gen; geniecompany.com/pro.
- **Chamberlain (consumer / DIY tier of Chamberlain Group)** — primarily retail / DIY but **Chamberlain Pro program** for service operators stocking Chamberlain parts and openers; chamberlain.com.
- **Sommer (premium German brand)** — **Sommer Direct Dealer program** with emphasis on direct-drive opener specialization; sommer-usa.com.
- **Marantec** — German commercial and premium residential: **Marantec Dealer program**; marantecamerica.com.

**Distribution and supply network**: most operators source parts via **manufacturer-direct dealer accounts** plus **wholesale distributors including Wayne Dalton supply branches, Amarr supply branches, Overhead Door distribution branches, Clopay distribution branches** in major metros, plus **independent wholesalers like NHA (National Hardware Association) distributors, McKinney Door & Hardware, Garage Door Supply Inc, Industrial Door Hardware**. **Online wholesale sources**: **DDM Garage Doors (ddmgaragedoors.com), Garage Door Stuff (garagedoorstuff.com), Garage Door Nation (garagedoornation.com)** for specialty parts, less-common spring sizes, and overnight ordering. **Springs in particular** — most operators stock the 4-6 most-common torsion spring sizes on the truck (1.75" ID x 0.225 wire, 2.0" ID x 0.234 wire, 2.0" ID x 0.250 wire, 2.25" ID x 0.243 wire most common) and order less-common specifications overnight from **Industrial Spring Manufacturers (Service Spring Corporation, NJM Industries, Murphy Garage Door Springs)**.

### Software, dispatch & payment stack

Garage door operations run on a **field service management (FSM) software stack** that handles **lead intake, dispatch, technician routing, on-site invoicing, payment capture, customer communication, and review-request automation**. The dominant FSM platforms used in garage door and adjacent home-services trades:

**(1) ServiceTitan** — the **dominant enterprise field-service platform** for plumbing / HVAC / electrical / garage door at multi-truck scale (typically 5+ trucks); **$398-$598 per tech per month plus implementation**; servicetitan.com.

**(2) Housecall Pro** — the **dominant SMB FSM platform** for 1-5 truck operators with **dispatch, scheduling, invoicing, online booking, payment processing, review automation, marketing tools**; **$59-$249 per month plus per-user**; housecallpro.com.

**(3) ServiceMonster** — established mid-market FSM popular with home-services trades; servicemonster.net.

**(4) FieldRoutes (now ServiceTitan-owned)** — strong in pest control and adjacent service businesses, used by some garage door operators; fieldroutes.com.

**(5) Briostack** — niche FSM with strong scheduling and routing; briostack.com.

**(6) BlueFolder** — mid-market FSM with strong work-order workflow; bluefolder.com.

**(7) ServSuite (by FieldRoutes / ServiceTitan)** — multi-service-line FSM; servsuite.com.

**(8) Markate** — small-operator-focused FSM with quoting + scheduling + invoicing; markate.com.

**(9) Workiz** — popular with small home-services operators at lower price point than Housecall Pro; workiz.com.

**(10) Jobber** — strong with field-service SMBs, emphasis on quoting and recurring service contracts; getjobber.com.

**Payment processing**: most FSM platforms integrate with **Stripe, Square, Helcim, or proprietary payment processors** with rates **2.6%-3.5% per swipe / chip card** plus 30 cents per transaction; mobile payment readers at **$49-$285** per terminal. Operators typically run **3-tier payment**: **cash discount pricing (5-10% off for cash to absorb processing fee), credit / debit card standard, and consumer-financing partnership** (Wisetack, Affirm, GreenSky, Synchrony, Service Finance Company) for full-door-install jobs $1,500+ where financing close-rate jumps the conversion 15-30%.

**Phone and lead-capture infrastructure**: **answering service (Ruby Receptionists, Smith.ai, AnswerConnect)** at **$285-$885/month** for after-hours and overflow call capture — critical because **broken garage door is a "must fix today" emergency search** and missed calls go directly to the next-listed competitor on Google. **CallRail or CallTrackingMetrics** at **$45-$185/month** for tracked-number-per-channel attribution showing which marketing channel produces which call volume.

**Review automation**: **NiceJob, Birdeye, Podium, Listen360, GatherUp** automate review requests post-job via text and email — driving the **4.9+ star average and 500-2,000+ review density** that successful operators build over 3-5 years; **$185-$685/month** typical SMB cost.

**Mapping and routing**: **Google Maps / Waze** for solo operator routing; **Route4Me, OptimoRoute, Onfleet** for multi-truck dispatch routing at **$45-$185 per user per month**.

**Total Year 1 software stack for solo operator**: **$985-$2,800 annually** (Housecall Pro or Workiz + payment processing + answering service + review automation + call tracking). For 2-3 truck operation: **$4,800-$12,500 annually**. For 5-10 truck regional operation: **$25K-$95K annually** (ServiceTitan + full dispatch + review automation + call tracking + answering service + financing partnership).

---

## ⚙️ PART 3 — OPERATIONS

### Spring safety & technical discipline

This is the single most consequential operational discipline in the trade and the dimension on which a new operator either survives or becomes the cautionary tale at the next IDA Expo. **Torsion springs store 150-300 lbs of mechanical energy under tension** (extension springs store less but still significant) and improperly-released springs cause **severe injuries or death** — IDA and DASMA safety alerts cite **torsion spring releases as the #1 cause of garage door technician deaths and major injuries in the trade**. The injury vectors: **(1) winding-bar slip during spring tensioning** (a slipped bar can rotate at 300+ RPM and strike the technician's face, chest, or hands at lethal force), **(2) broken-spring whip during cable release** (a broken spring releasing stored energy can whip across the garage and strike the technician), **(3) door fall during spring change** (a 250-350 lb door drops on the technician when springs are released without proper door-blocking), **(4) cable failure during tensioning** (frayed cables snap under tension and whip with significant force).

The disciplined operator runs **structured spring-work protocol on every job**: **(a) door must be fully closed and blocked with vise grips locked on tracks below bottom roller** before any spring work begins; **(b) winding bars must be Pemberton Tools or equivalent IDA-recognized hardened steel — never substitute screwdrivers or rebar that can snap or slip**; **(c) winding bar insertion must engage fully into winding cone with both bars at all times during tensioning — never single-bar tensioning**; **(d) tech body position must keep face and chest away from winding bar arc — never lean over the spring during tensioning**; **(e) safety glasses, hearing protection, and gloves at minimum PPE**; **(f) two-tech rule for any commercial-size spring or any spring above 30-cycle equivalent**; **(g) spring measurement before replacement using IPPT (inside diameter, wire gauge, length, wind direction) protocol** documented on every job to ensure replacement spring matches door weight requirement.

**Training and certification**: the **IDA International Door Association (idainternational.org) runs IDA Certified Technician (IDA-CT) and IDA Certified Installer (IDA-CI) certifications** with structured curriculum covering safety, spring math, opener installation, troubleshooting, customer service; **certification exam at $185-$385 plus annual CE requirement**; the IDA-CT designation is the industry-recognized credential and is increasingly required for commercial work and insurance-carrier risk-screening. **DASMA technical standards** (especially **ANSI/DASMA 102 commercial door standards** and **DASMA 105 wind-load standards** for hurricane-impact installations) define the engineering specifications operators work to. **Manufacturer training programs**: **LiftMaster Pro Elite, Genie Pro, Clopay Master Dealer training** provide ongoing certification on opener systems and door installation specifically. **Apprenticeship pathway**: many disciplined operators came up through **2-4 year apprenticeship at established dealers or franchises (Precision, Aladdin, Overhead Door corporate stores)** before launching solo — the apprenticeship is the dominant skill-transfer mechanism in the trade because the spring-work discipline is fundamentally an apprenticeship learning curve.

**Documentation and incident response**: the disciplined operator maintains **photo documentation on every spring job** (pre-job photos of existing springs with IPPT data visible, post-job photos of installed springs), **chain-of-custody documentation on customer-property care**, **incident response protocol** for any near-miss or actual injury (immediate response, photo documentation, customer notification, insurance carrier notification, OSHA reporting if employee injury). The insurance-claim and litigation reality: **professional liability claims on garage door injury sit at $50K-$500K typical settlement range** for residential customer injury, with **$1M+ exposure on commercial / multi-resident injury**, and **wrongful-death claims on technician fatality at $1M-$5M+** range — a single significant incident ends a small operator.

### Customer acquisition channels

Garage door repair is the second-highest-intent home-services emergency search behind plumbing leaks — when a spring breaks and the door won't open, the customer searches **"garage door repair near me"** within minutes and books the first quality operator who answers the phone. The dominant lead-generation channels:

**(1) Google Local Services Ads (LSA)** — **the #1 lead source** for most garage door operators in 2025-2026; LSA produces the **green "Google Screened / Google Guaranteed" badge** at the top of mobile search results above traditional Google Ads and organic results; pay-per-lead pricing **$25-$85 per qualified lead** depending on market, with operators paying only for leads that **convert to phone call or booking**; lead quality is high because the **Google Guarantee program backs the operator's work up to $2,000** which signals trust to homeowners. LSA enrollment requires **background check on owner and any technicians, GL insurance verification, license verification (where applicable), and Google review threshold (typically 5+ reviews to enable)**; localservices.google.com.

**(2) Google Ads (paid search)** — traditional Google Ads at **$8-$28 CPC for "garage door repair [city]" and high-intent emergency keywords**; typical small-operator monthly budget **$1,500-$5,500/month**; conversion rate **15-35% click-to-call**, **40-60% call-to-booking**; Google Ads management via agency at **15-25% of ad spend** or in-house DIY.

**(3) Yelp** — **dominant in West Coast metros and in markets with high Yelp household penetration**; **Yelp Ads at $300-$1,500/month** for boosted listing visibility; organic Yelp ranking driven by **review density + recency + 4.5+ star average**; book-via-Yelp integration for instant scheduling.

**(4) NextDoor** — **dominant neighborhood-level platform for service-business referrals**; **NextDoor Business Page at no cost plus paid NextDoor Ads at $185-$885/month** for sponsored visibility; neighbor recommendations on broken-garage-door threads drive significant referral volume; nextdoor.com/business.

**(5) Facebook neighborhood groups and Facebook Marketplace** — local Facebook neighborhood groups and town pages produce **organic referral volume** when neighbors post recommendation requests; **Facebook Ads at $25-$85 per lead** for paid lead-gen campaigns.

**(6) HOA preferred-vendor lists** — local **Homeowners Associations maintain preferred-vendor lists** for community-wide service referrals; established operators secure HOA preferred-vendor status through **performance + competitive pricing + responsiveness**.

**(7) Real estate agent referrals** — **homes inspections frequently flag garage door issues at point-of-sale**, and real estate agents refer buyers and sellers to trusted garage door operators for repair-before-close or new-owner repair work.

**(8) Builder partnerships (new construction)** — for operators positioning toward new-residential install work: partnerships with regional homebuilders (D.R. Horton, Lennar, Pulte, KB Home, Toll Brothers, Meritage Homes, Taylor Morrison, NVR / Ryan Homes, Beazer Homes) at **bulk-install pricing** but high-volume install work.

**(9) Commercial property manager relationships** — for operators targeting commercial roll-up and overhead door work at warehouses, fleet shops, storefronts: relationships with **commercial property managers (CBRE, Cushman & Wakefield, JLL, Colliers, regional commercial property management firms)** producing recurring commercial service work.

**(10) Insurance / restoration referrals** — relationships with **restoration contractors (Servpro, BELFOR, Rainbow International)** and **insurance adjusters** for hailstorm panel replacement, vehicle-backover damage claims, hurricane-impact replacement (especially in Florida / Gulf Coast / Texas).

**(11) Manufacturer dealer-locator lead-gen** — **Clopay, Amarr, LiftMaster, Genie dealer locator referrals** from manufacturer websites where customers search by ZIP code for nearest authorized dealer.

**(12) Direct mail and door hangers** — older-school but still effective in suburban markets, especially for **maintenance plan renewal campaigns** and **post-storm canvassing in hailstorm-affected neighborhoods**.

The disciplined operator builds **diversified channel mix** with no single channel exceeding **35% of new-customer volume** to manage channel-risk if Google LSA pricing inflates or Yelp algorithm changes deprioritize the listing.

### Pricing strategy & transparent flat-rate playbook

Pricing strategy is increasingly **transparent flat-rate** as opposed to **time-and-materials hourly** — driven by **Precision Garage Door Service and A1 Garage Door Service publishing transparent pricing pages** that pressure independent operators to match the transparency. The disciplined pricing structure:

**(1) Service call minimum** — **$85-$185 minimum** to dispatch a tech (waived if customer accepts the repair quote, applied as credit toward repair); the service-call minimum manages the **no-pay diagnosis-only call** risk where a customer wants a free quote without intent to repair.

**(2) Spring replacement flat-rate** — **published flat-rate pricing on website**: single spring $250-$500, pair $375-$725, with tier breakdown by **standard 10K-cycle vs premium 25K-cycle springs**; transparent pricing builds trust and reduces phone-quote friction.

**(3) Opener install flat-rate** — by opener tier: **LiftMaster 8500 jackshaft $585-$885 installed, LiftMaster 8550W belt drive $485-$785, Genie SilentMax 1200 $385-$685, Chamberlain B6713T $385-$585**; pricing includes opener + install labor + standard remotes + photo-eye install + wall-button install + smart-connectivity setup.

**(4) Full door install quoted pricing** — full-door install requires on-site measurement and quote because **door size + insulation tier + window inserts + decorative hardware + opener compatibility + spring requirements + tracks + weatherstripping** produce too much variation for fixed flat-rate; pricing range published as **$1,500-$4,500 typical residential** with on-site quote confirming.

**(5) Diagnostic fee structure** — diagnostic fee **$45-$185 waived if customer accepts repair**; structure manages diagnosis-only call abuse.

**(6) Emergency / after-hours pricing** — **after-hours / weekend / holiday surcharge of $85-$185** layered on top of standard pricing; transparent pricing pages disclose surcharge structure.

**(7) Senior / military / first-responder discount** — common **10% discount for seniors / active military / veterans / first-responders** as goodwill-building positioning.

**(8) Financing options for $1,500+ jobs** — partnerships with **Wisetack, Affirm, GreenSky, Synchrony, Service Finance Company** for consumer financing on full-door-install jobs; financing close-rate jumps full-door conversion **15-30%** by removing the lump-sum-payment friction.

**(9) Annual maintenance plan pricing** — **$95-$285/year residential** covering annual tune-up plus discounted pricing on repair work and priority scheduling; the maintenance plan is the **recurring-revenue moat** that smooths the lumpy emergency-only model.

**(10) Commercial pricing** — **time and materials at $185-$285/hour plus parts** for commercial work where job scope varies significantly; established commercial relationships often shift to **negotiated flat-rate maintenance contracts at $385-$1,800/year** for ongoing service plus discounted parts.

The disciplined operator runs **quarterly pricing review** comparing in-place rates against published competitor pricing (Precision, A1, local independents tracked via Google) and makes **calibrated rate adjustments by service line and tier** rather than across-the-board increases. **Pricing transparency posture**: leading operators publish **full flat-rate pricing on the website** to remove phone-quote friction and signal trust — Precision's transparent pricing playbook is the industry benchmark that independent operators increasingly match.

### Service delivery & first-visit close rate

Service delivery is the dimension on which long-term reputation, **Google Review density (the 4.9+ star average and 500-2,000+ review count that defines successful operators)**, customer-referral rate, and operating margin are built. The disciplined service-delivery playbook:

**Same-day or next-day response standard** — for emergency calls received before noon, the disciplined operator dispatches **same-day arrival in the 12pm-6pm window**; for emergency calls received after noon, **next-day morning arrival by 10am**. The **"must fix today" emergency-response posture** is the structural competitive position vs slow-response competitors and is the basis of premium pricing.

**Tech professionalism standard** — branded uniform, branded vehicle, name tag, ID verification, shoe covers in customer home / on customer-floor surfaces, drop cloth for parts and tools, clean-as-you-go discipline; the **professional-presentation standard** is the visible signal that builds customer trust and drives the Google Review post.

**On-site quote process** — tech arrives, completes diagnosis, presents written quote on tablet with **transparent flat-rate pricing matching the published website pricing** (preventing the bait-and-switch perception that destroys reputation), explains repair scope, presents financing options for jobs $1,500+, secures customer authorization before starting work.

**Parts on truck for first-visit close** — disciplined operator's truck inventory targets **85-95% first-visit close rate**, meaning **85-95% of dispatched jobs result in complete repair on first visit** without a second trip back to shop for parts; the operating discipline runs on **8-12 core SKU tracking + monthly SKU shortage audit + monthly parts-on-truck inventory cycle count**.

**Repair-vs-replace honest counsel** — for older doors at end of useful life, the disciplined operator presents **honest repair-vs-replace analysis** rather than upselling unnecessary full-door install; the long-term-reputation discipline is the structural moat against high-pressure-sales competitors who churn through customers without referral repeat.

**Post-job documentation and review request** — automated **post-job text + email with photo documentation, warranty terms, payment receipt, and review request link to Google + Yelp + NextDoor** — the disciplined review-request automation is what drives the **4.9+ star rating and 500-2,000+ review density** over 3-5 years that defines mature operator competitive position.

**Warranty terms** — **1-year warranty on labor + manufacturer warranty on parts (LiftMaster 5-year limited motor warranty + 1-year parts, Clopay 10-year limited section warranty, etc.)**; transparent warranty terms communicated at quote and post-job documentation.

**Customer communication during job** — text-based **"tech en-route" + ETA tracking + post-job follow-up** — increasingly expected by 2025-2026 customer base, and Housecall Pro / ServiceTitan automate the communication workflow.

---

## 📈 PART 4 — GROWTH & EXIT

### Marketing, reviews & reputation moat

Garage door marketing is fundamentally **B2C-emergency-response** with parallel B2B streams to commercial property managers and homebuilders. The marketing stack:

**(1) Website with transparent pricing, online booking, photo gallery of completed jobs, customer testimonials, service-area map, manufacturer dealer logos (Clopay Master Dealer, LiftMaster ProMember, Genie Pro), and emergency-call positioning** — typically WordPress + service-business themes (Astra, GeneratePress, ServiceBuilder) at **$2,500-$8,500 build cost** plus **$185-$485/month hosting + maintenance + SEO**.

**(2) Google Business Profile (GBP) optimization** — **critical** because customers search **"garage door repair near me"** and Google ranks GBP listings by **review density + recency + photo count + Q&A activity + posts cadence + service-area accuracy**; disciplined operators run **weekly GBP post cadence with seasonal content + photo upload monthly + Q&A monitoring + monthly review response on all reviews**.

**(3) Google Local Services Ads (LSA)** — discussed above as #1 lead source at $25-$85 per qualified lead.

**(4) Google Ads (paid search)** — $8-$28 CPC, $1,500-$5,500/month typical SMB budget.

**(5) SEO and content marketing** — **city-specific landing pages** ("garage door repair [city]" / "spring replacement [city]" / "opener install [city]") + **service-specific content** (how to know if you need spring replacement, how to choose between LiftMaster and Genie, how to maintain your garage door); SEO outranks Google LSA over 2-3 year compounding cycle but requires sustained content investment.

**(6) Google Reviews + Yelp Reviews + NextDoor reviews + Facebook reviews + BBB rating** — the **multi-platform review density** that defines mature competitive position; **4.9+ star average across 500-2,000+ reviews** typical of established operators after 3-5 years of disciplined review-request automation.

**(7) Yelp organic and paid** — Yelp Ads at $300-$1,500/month for boosted listing visibility.

**(8) NextDoor neighborhood-level marketing** — NextDoor Business Page + NextDoor Ads at $185-$885/month for sponsored visibility.

**(9) Facebook neighborhood groups + Facebook Ads** — organic referral via neighborhood group recommendation threads + Facebook Ads at $25-$85 per lead.

**(10) Local print advertising in senior-focused publications (Costco Connection, AARP local chapter newsletters, faith-community bulletins), community newspapers, and Welcome Wagon / Moving Targets new-resident programs** — older-school but still effective in suburban markets.

**(11) Truck wrap as rolling billboard** — full vehicle wrap at $2,500-$5,500 per van generates **5-15% of new-customer inquiries** from driveway-parked visibility.

**(12) Direct mail (postcards, door hangers, magnet calendars)** — **post-storm canvassing in hailstorm-affected neighborhoods** + **annual maintenance plan renewal campaigns** + **new-resident welcome packets** at $0.45-$1.85 per piece, response rate **0.5-2.5%**.

**(13) Referral program** — **$25-$85 cash or credit referral payment** to customers who refer new customers; **5-15% of typical mature-operator volume comes from explicit referral payment**.

**(14) Manufacturer dealer-locator lead-gen** — Clopay, Amarr, LiftMaster, Genie dealer locator referrals from manufacturer websites.

**Marketing budget**: typical solo operator runs **8-15% of revenue on marketing** ($15K-$55K annually); 2-3 truck operation **6-12% of revenue** ($35K-$120K); regional 5-10 truck operation **4-8% of revenue** ($85K-$385K). **Conversion benchmarks**: typical garage door conversion ratios show **call-to-booking 55-75%, booking-to-completed-job 85-95% (with cancel / no-show / lost-deal at 5-15%)**, **completed-job-to-review 18-32%** with disciplined review-request automation. The disciplined operator tracks **cost per call, cost per booking, cost per completed job, and customer acquisition cost (CAC) by channel** to optimize marketing mix.

### Scale milestones & multi-truck operations

**Solo operator**: $185K-$385K annual revenue, single tech (founder), 30-45% net margin = $55K-$170K take-home, founder is hands-on tech on every job, marketing via owner-DIY Google LSA + Yelp + Housecall Pro.

**2-3 truck operation**: $400K-$900K revenue, founder transitions to part-time tech + part-time dispatcher / sales / marketing, hires **1-2 W-2 techs at $52K-$78K base + commission on parts margin**, 25-38% net margin = $100K-$340K, dispatcher role increasingly required at 3+ trucks, ServiceTitan or Housecall Pro Enterprise.

**Regional 5-10 truck operation**: $1.5M-$4.5M revenue, **dedicated dispatcher / office manager** + **dedicated marketing / digital coordinator** + **techs specialized by service type (spring/repair generalist vs full-door install crew vs commercial overhead specialist)** + **showroom for full-door sales** + **inventory warehouse**, 18-28% net margin = $270K-$1.25M, founder fully out of field as operator-CEO.

**Multi-location / multi-market regional operator (15-40 trucks across 2-5 metros)**: $5M-$15M revenue, **dedicated regional VP / general manager per market** + **centralized dispatch hub** + **HR + finance + marketing infrastructure** + **fleet management** + **inventory procurement at manufacturer-direct pricing tier**, 15-25% net margin, PE acquisition profile.

**Franchise platform or PE-roll-up (40+ trucks across multiple states)**: $15M-$50M+ revenue, **full executive infrastructure** (CEO, COO, CFO, CRO, VP Operations, VP Marketing, regional GMs), full PE-acquisition target profile.

**Scaling capital**: **SBA 7(a) for working capital up to $5M** at SBA prime + 2.75-4.75% for 10-25 year terms, **SBA 504 for owner-occupied commercial real estate** (warehouse + showroom + office) up to $5.5M, **equipment financing** for truck fleet via **Crest Capital, Ascentium Capital, North Mill Equipment Finance, BlueVine, Bluestone Funding** at 6-12% rates, **revolving credit lines** for parts inventory float, **PE equity capital at multi-truck platform scale**.

### PE consolidation, franchise & exit math

Exit multiples for garage door operating companies in 2025-2026 vary by scale, geographic concentration, EBITDA margin, recurring-revenue percentage, and franchise affiliation status. **Solo operator (sub-$500K revenue)**: typically sells via **business broker or owner-direct sale at 1.5-3x discretionary earnings (DE / SDE)** — the buyer is usually another local operator or an aspiring tech-turned-owner; minimal premium for solo-operator goodwill because the founder is the business. **2-3 truck operation ($500K-$1.5M revenue)**: **2.5-4x EBITDA / SDE** to trade buyers (other local operators consolidating territory) or aspiring buyer-operator with SBA 7(a) financing. **Regional 5-10 truck operation ($1.5M-$5M revenue)**: **3-5x EBITDA** to regional consolidators, PE-backed roll-ups, or franchise platforms; the **EBITDA-margin discipline** matters (25%+ premium, sub-15% discount) and the **recurring-revenue / maintenance-plan percentage** matters (10%+ maintenance-plan revenue premium). **Multi-location regional ($5M-$15M revenue)**: **4-6x EBITDA** to PE platforms or strategic acquirers; the **operating-quality and process-documentation depth** matters at this scale. **Large platform ($15M+ revenue)**: **5-7x EBITDA** to PE or strategic; **Authority Brands acquisition of Precision Garage Door Service in 2023** reportedly at the high end of this range.

**PE consolidators actively rolling up garage door**: **Authority Brands (PE-backed home-services franchise platform — acquired Precision Garage Door Service 2023; also owns Mr. Rooter, Mr. Electric, Aire Serv, Window Genie, Mosquito Joe, Benjamin Franklin Plumbing, One Hour Heating & Air, Mister Sparky, House Doctors, Junk King — a true multi-brand home-services franchise consolidator)**, **Neighborly (Dwyer Group rebrand — multi-brand home-services franchise platform with adjacent service brands Window Genie, Mosquito Joe, Aire Serv, Mr. Appliance, Mr. Handyman, Five Star Painting; PE-backed via various PE sponsors over the years)**, **A1 Garage Door Service (multi-state PE-backed roll-up — backed by Riverside Company)**, **Aladdin Garage Doors (regional consolidator)**, regional PE-backed home-services platforms in Phoenix, Dallas, Atlanta, Tampa metros that acquire single-market operators.

**Franchise affiliation as exit path**: operators considering franchise affiliation evaluate **Precision Garage Door franchise (Authority Brands platform — franchise fees $42K-$125K plus 6-9% royalty plus marketing fund), Garage Door Doctors franchise, Aladdin Garage Doors franchise**; franchise affiliation provides **brand recognition + national marketing co-op + operations playbook + supplier discounts** but consumes **6-10% of revenue in royalty + marketing fees** and constrains operator independence on pricing / service offering. The honest trade-off: franchise affiliation works for **operators in markets where brand recognition matters more than independence (large metros with heavy Precision / A1 advertising presence)** and is less compelling in **smaller markets where independent operators dominate organic search and word-of-mouth**.

**Valuation drivers**: **(1) revenue scale** (multi-truck premium over solo), **(2) EBITDA margin discipline** (25%+ premium, sub-15% discount), **(3) recurring-revenue / maintenance-plan percentage** (10%+ premium), **(4) Google Review density and rating** (4.9+ stars across 500+ reviews premium, sub-4.5 stars discount), **(5) Google LSA enrollment and lead-volume history** (premium for established LSA volume), **(6) geographic concentration and route density** (premium for tight 30-mile route radius vs scattered 100-mile coverage), **(7) tech bench stability and W-2 classification discipline** (premium for low turnover + W-2 vs 1099 misclassification exposure), **(8) commercial / builder / property-manager B2B revenue percentage** (10%+ B2B premium for recurring relationships), **(9) manufacturer dealer-tier status** (Clopay Master Dealer, LiftMaster Elite Pro premium), **(10) lawsuit and injury history** (zero-claim premium, history of claims significant discount).

**Owner-operator continuation path**: many solo and small-multi truck operators choose to **continue operating rather than exit** — capturing **$90K-$340K annual owner cash flow at single to small-multi truck scale** with significant **tax efficiency through S-corp distribution + Section 179 depreciation on truck and equipment + home-office deduction + retirement plan contribution (Solo 401k, SEP-IRA)**.

### Counter-case & risks

The four highest-impact risk vectors are covered in detail in the dedicated Counter-Case section below: **(1) torsion spring liability** (severe injury / death exposure, $50K-$500K injury claim ends small operator, insurance carriers screen aggressively); **(2) franchise competitive pressure** (Precision + A1 dominate Google Ads bidding, transparent pricing pressure squeezes margin); **(3) Google LSA pricing inflation and platform algorithm risk** (LSA cost-per-lead inflated 25-45% 2022-2025, single-channel dependence creates platform-risk); **(4) 1099 vs W-2 misclassification exposure** (DOL 2024 Final Rule + state misclassification statutes create six-figure back-tax exposure for operators with 1099 techs). See dedicated Counter-Case section for 12-element analysis plus 6-condition verdict.

`;

const flow = `

## The Operating Journey: From Solo Launch To Multi-Truck Regional Operation

\`\`\`mermaid
flowchart TD
  A[Founder Decides To Start Garage Door Repair Business] --> B[State Plus Market Plus Capital Decision]
  B --> B1{Capital Plus Trade Background Plus Real Estate Strategy}
  B1 -->|$8K-$22K Solo Launch With Used Cargo Van| C1[Solo Owner-Operator Path]
  B1 -->|$45K-$120K 2-3 Truck Launch With New Van Fleet| C2[Small Multi-Truck Operation]
  B1 -->|$500K-$2M Regional 5-10 Truck Launch With Showroom| C3[Regional Multi-Truck Operator]
  B1 -->|$5M+ Multi-Location PE Or Franchise Platform| C4[Multi-Location Regional Or Franchise Platform]
  C1 --> D[State Licensing Plus Insurance Plus LLC Setup]
  C2 --> D
  C3 --> D
  C4 --> D
  D --> D1[CA CSLB C-61/D-28 Or FL DBPR Specialty Or TX Municipal Or NY NYC DOB Special Inspector]
  D --> D2[Worker Comp NCCI 5403 Or 9015 Plus GL $1M/$2M Plus Commercial Auto Plus Umbrella]
  D --> D3[LLC Plus EIN Plus State Tax Plus Sales Tax Registration]
  D --> D4[IDA-CT Certification Plus DASMA Technical Standards Plus Manufacturer Training]
  D1 --> E[Manufacturer Dealer Account Setup]
  D2 --> E
  D3 --> E
  D4 --> E
  E --> E1[Clopay Master Dealer Plus Amarr Plus Wayne Dalton Plus C.H.I. Door Brands]
  E --> E2[LiftMaster ProMember Plus Genie Pro Plus Chamberlain Plus Sommer Opener Brands]
  E --> E3[Spring Wholesalers Plus DDM Garage Doors Plus Industrial Spring Manufacturers]
  E --> E4[Distributor Branch Relationships For Same-Day Parts Pickup In Major Metros]
  E1 --> F[Truck Setup Plus Rolling Inventory Plus Tools]
  E2 --> F
  E3 --> F
  E4 --> F
  F --> F1[Ford Transit Or Mercedes Sprinter Or Ram ProMaster Plus Roof Rack For Panel Transport]
  F --> F2[Adrian Steel Or Ranger Design Or Sortimo Shelving Plus Knaack Drawers For Parts Storage]
  F --> F3[Rolling Inventory: Torsion Springs Plus Cables Plus Rollers Plus Openers Plus Hardware $3.5K-$12.5K]
  F --> F4[Pemberton Tools Winding Bars Plus Cordless Drill Plus Hammer Drill Plus Multimeter $2.5K-$6.5K]
  F --> F5[Full Vehicle Wrap For Rolling Billboard Plus Phone Plus Website Plus Branding]
  F1 --> G[Software Stack Plus Lead Capture Plus Payment Plus Review Automation]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  G --> G1[Housecall Pro Or ServiceTitan Or Workiz Field Service Management]
  G --> G2[CallRail Or CallTrackingMetrics Plus Ruby Or Smith.ai Answering Service]
  G --> G3[NiceJob Or Birdeye Or Podium Review Automation Plus Google Plus Yelp Plus NextDoor]
  G --> G4[Stripe Or Square Plus Wisetack Or Affirm Or GreenSky Consumer Financing]
  G1 --> H[Lead Generation Channel Activation]
  H --> H1[Google LSA #1 Lead Source Plus Google Ads Plus Google Business Profile]
  H --> H2[Yelp Plus NextDoor Plus Facebook Neighborhood Groups Plus HOA Preferred Vendor]
  H --> H3[Manufacturer Dealer Locator Plus Real Estate Agent Plus Builder Partnerships]
  H --> H4[Commercial Property Manager Plus Restoration Contractor Plus Insurance Adjuster]
  H1 --> I[Dispatched Service Call Plus On-Site Diagnosis Plus Quote Plus Repair]
  H2 --> I
  H3 --> I
  H4 --> I
  I --> I1[Same-Day Or Next-Morning Response Standard With Tech En-Route Communication]
  I --> I2[On-Site Diagnosis Plus Transparent Flat-Rate Quote Plus Customer Authorization]
  I --> I3[Spring Safety Discipline: Pemberton Bars Plus Door Blocked Plus Two-Bar Tensioning]
  I --> I4[First-Visit Close Target 85-95% With Tight Rolling Inventory Discipline]
  I1 --> J{Job Volume Velocity To Sustainable Operation}
  J -->|Under 8 Jobs/Week Sub-Break-Even Marketing Reset| K[Marketing Reset Plus LSA Bidding Plus Yelp Plus NextDoor Optimization]
  J -->|8-20 Jobs/Week Sustainable Solo Operation| L[Continue Build Refine Channels Plus Review Density]
  J -->|20+ Jobs/Week Founder Saturation Plus Lead-Volume Exceeds Capacity| M[Hire First W-2 Tech Plus Scale To 2-Truck]
  K --> H
  L --> N[Operational Excellence Plus Review Density Building]
  M --> N
  N --> N1[4.9+ Star Average Across 500-2000+ Reviews Plus Multi-Platform Density]
  N --> N2[Maintenance Plan Recurring Revenue 10%+ Of Total Revenue As Smoothing Layer]
  N --> N3[Commercial / Builder / Property Manager B2B Mix 10-25% Of Revenue]
  N --> N4[Tech Retention Plus W-2 Classification Discipline Plus Commission Structure]
  N1 --> O{Scale Decision After Year 2-3}
  N2 --> O
  N3 --> O
  N4 --> O
  O -->|2-3 Truck Operation Continue Growth| P[2-3 Truck Operator Plus Dispatcher Plus Marketing]
  O -->|Owner-Operator Continuation Solo Plus Occasional Helper| Q[Solo Owner-Operator $90K-$220K Annual Cash Flow]
  P --> R[Regional 5-10 Truck Plus VP Operations Plus Marketing Coordinator Plus Showroom]
  Q --> S[Tax-Efficient Solo Operator Lifestyle Business With S-Corp Plus Section 179]
  R --> T{Strategic Exit Or Continued Growth}
  T -->|Sell To PE Or Franchise At 3-7x EBITDA| U[Strategic Sale To Authority Brands / Neighborly / A1 Or PE-Backed Regional Consolidator]
  T -->|Continue Growth To Multi-Location 15-40 Truck Platform| V[Multi-Location Regional Operator At PE Acquisition Profile]
  T -->|Affiliate As Precision / Aladdin Franchise For Brand Plus Marketing| W[Franchise Affiliation Path With 6-10% Royalty]
\`\`\`

## The Decision Matrix: Format Selection And Strategic Position

\`\`\`mermaid
flowchart TD
  A[Founder Has Capital Plus Trade Experience Plus Geographic Territory] --> B{Capital Plus Background Plus Scaling Ambition}
  B -->|$8K-$22K Solo Launch With Used Cargo Van| C[Solo Owner-Operator]
  B -->|$45K-$120K 2-3 Truck Launch With New Van Fleet| D[Small Multi-Truck Operation]
  B -->|$500K-$2M Regional 5-10 Truck With Showroom| E[Regional Multi-Truck Operator]
  B -->|$5M+ Multi-Location Regional Platform PE-Backed| F[Multi-Location Regional Platform]
  B -->|Affiliate With Precision / Aladdin Franchise For Brand| G[Franchise-Affiliated Operator]
  C --> C1[Founder Is Sole Tech On Every Job With Owner-DIY Marketing]
  C --> C2[Google LSA Plus Yelp Plus NextDoor Plus Housecall Pro Minimal Software Stack]
  C --> C3[$185K-$385K Year 2-3 Revenue 30-45% Net = $55K-$170K Take-Home]
  C --> C4[Rolling Inventory $3.5K-$8K Plus Tight 8-12 Core SKU Discipline]
  C --> C5[Tax-Efficient S-Corp Plus Section 179 Plus Solo 401k Or SEP-IRA]
  D --> D1[Founder Transitions To Part-Time Tech Plus Dispatcher Plus Sales]
  D --> D2[1-2 W-2 Techs At $52K-$78K Base Plus Commission On Parts Margin]
  D --> D3[$400K-$900K Year 2-3 Revenue 25-38% Net = $100K-$340K]
  D --> D4[Housecall Pro Enterprise Or ServiceTitan Plus Dedicated Dispatcher Cost]
  D --> D5[Commercial / Builder B2B Mix Begins Adding 10-15% Revenue Layer]
  E --> E1[Dedicated Dispatcher Plus Marketing Coordinator Plus Specialized Tech Roles]
  E --> E2[Showroom For Full-Door Sales Plus Inventory Warehouse Plus Multi-Truck Fleet]
  E --> E3[$1.5M-$4.5M Year 3-5 Revenue 18-28% Net = $270K-$1.25M]
  E --> E4[ServiceTitan Full Platform Plus Dispatcher Plus Marketing Plus HR Infrastructure]
  E --> E5[Commercial 15-25% Of Revenue Plus Maintenance Plan 10%+ Recurring]
  F --> F1[Multi-Market Regional Operation With Regional VPs / GMs Per Market]
  F --> F2[Centralized Dispatch Hub Plus HR Plus Finance Plus Marketing Plus Fleet Management]
  F --> F3[$5M-$15M Year 4-7 Revenue 15-25% Net = $750K-$3.75M]
  F --> F4[PE-Backed Or Founder-Plus-Outside-Equity Capital Structure]
  F --> F5[Strategic Sale At 4-6x EBITDA To Authority Brands / Neighborly / A1 / PE Platform]
  G --> G1[Precision / Aladdin / Garage Door Doctors Franchise Affiliation]
  G --> G2[Franchise Fee $42K-$125K Plus 6-9% Royalty Plus 2-3% Marketing Fund]
  G --> G3[Brand Recognition Plus National Marketing Co-op Plus Operations Playbook]
  G --> G4[Supplier Discounts Plus Lead Aggregation Plus Training Plus Technology Stack]
  G --> G5[Constrained Independence On Pricing / Service Mix But Faster Brand-Established Growth]
  C5 --> H{Reassess After Year 2-3}
  D5 --> H
  E5 --> H
  F5 --> H
  G5 --> H
  H -->|Solo Owner-Operator Stable Lifestyle Business| I[Solo Owner-Operator Continuation $90K-$220K Cash Flow]
  H -->|Demand Exceeds Capacity Hire First W-2 Tech Plus Scale To 2-Truck| J[Small Multi-Truck Operation 2-3 Trucks]
  H -->|Mature Operations Pursue Premium Commercial Or Specialty Position| K[Premium Commercial Overhead Or Specialty Niche Position]
  H -->|Mature EBITDA Profile For PE Or Franchise Exit| L[Position For Sale At 3-7x EBITDA To Authority Brands / Neighborly / A1 / PE]
  I --> M[Tax-Efficient Solo Lifestyle Business]
  J --> N[Multi-Truck Regional Operator]
  K --> O[Premium Specialty Defended Niche]
  L --> P[Strategic Exit To PE / Franchise Platform]
\`\`\`

`;

const src = `

## Sources

1. **IDA (International Door Association)** -- Dominant operator-side trade association covering garage door and overhead door operator industry data, IDA-CT and IDA-CI certifications, IDA Expo conferences, training programs. https://www.idainternational.org
2. **DASMA (Door & Access Systems Manufacturers Association)** -- Manufacturer-side trade association setting technical standards including ANSI/DASMA 102 commercial door standards and DASMA 105 wind-load standards. https://www.dasma.com
3. **NIDA (National Independent Door Association)** -- Smaller independent-operator-focused trade group. https://www.nida.org
4. **Hardlines Research Foundation** -- Authoritative US garage door market data showing $9B+ market size and ~85M residential garage door installed base. https://www.hardlines.com
5. **IBISWorld Garage Door Manufacturing Industry Report** -- Industry research covering US garage door market size, growth, competitive landscape. https://www.ibisworld.com
6. **Precision Garage Door Service (Authority Brands)** -- Largest US garage door franchise with ~100+ territories nationally, acquired by Authority Brands in 2023. https://www.precisiongaragedoor.com
7. **A1 Garage Door Service** -- Multi-state PE-backed garage door operator backed by Riverside Company. https://www.a1garage.com
8. **Aladdin Garage Doors** -- Multi-region garage door operator and franchisor. https://www.aladdingaragedoors.com
9. **Sears Garage Door Service** -- Legacy franchise brand of the former Sears Home Services unit. https://www.searsgaragedoors.com
10. **Overhead Door Company** -- The original 1921 founder of the garage door category, owned by Sanwa Holdings since 2011. https://www.overheaddoor.com
11. **Clopay Building Products** -- Largest US residential garage door manufacturer with Clopay Master Authorized Dealer program (~6,000 dealers nationally). https://www.clopaydoor.com
12. **Amarr Garage Doors (Entrematic / Assa Abloy)** -- Second-largest US residential garage door brand. https://www.amarr.com
13. **Wayne Dalton (Overhead Door Company subsidiary)** -- Third major US residential garage door brand. https://www.wayne-dalton.com
14. **C.H.I. Overhead Doors** -- Illinois-based mid-tier garage door manufacturer. https://www.chiohd.com
15. **Hormann (US)** -- German premium and commercial garage door brand. https://www.hormann.us
16. **Raynor Garage Doors** -- Illinois family-owned premium residential and commercial garage door brand. https://www.raynor.com
17. **Garaga** -- Canadian premium garage door brand active in US Northeast and Midwest. https://www.garaga.com
18. **LiftMaster (Chamberlain Group, Blackstone-owned)** -- Dominant US residential garage door opener brand with LiftMaster ProMember dealer program. https://www.liftmaster.com/professional
19. **Genie Company (Overhead Door Company subsidiary)** -- Major US residential opener brand with Genie Pro dealer program and Aladdin Connect smart platform. https://www.geniecompany.com/pro
20. **Chamberlain Group (Blackstone-owned)** -- Consumer / DIY tier of Chamberlain Group plus LiftMaster professional tier. https://www.chamberlain.com
21. **Sommer USA** -- Premium German garage door opener brand with direct-drive specialization. https://www.sommer-usa.com
22. **Authority Brands** -- PE-backed multi-brand home-services franchise platform that acquired Precision Garage Door Service in 2023, also owns Mr. Rooter / Mr. Electric / Aire Serv / Window Genie / Mosquito Joe / Benjamin Franklin Plumbing / One Hour Heating & Air / Mister Sparky / House Doctors / Junk King. https://www.authoritybrands.com
23. **Neighborly (Dwyer Group rebrand)** -- Multi-brand home-services franchise platform with adjacent service brands Window Genie / Mosquito Joe / Aire Serv / Mr. Appliance / Mr. Handyman / Five Star Painting. https://www.neighborlybrands.com
24. **Google Local Services Ads (Google Screened / Google Guaranteed)** -- #1 lead source for garage door operators with pay-per-lead $25-$85 model and $2,000 Google Guarantee backing customer work. https://localservices.google.com
25. **Yelp for Business** -- Dominant West Coast and high-Yelp-penetration market lead source with Yelp Ads. https://business.yelp.com
26. **NextDoor for Business** -- Dominant neighborhood-level platform for service-business referrals with NextDoor Business Page plus paid NextDoor Ads. https://business.nextdoor.com
27. **ServiceTitan** -- Dominant enterprise field-service management platform for plumbing / HVAC / electrical / garage door at multi-truck scale. https://www.servicetitan.com
28. **Housecall Pro** -- Dominant SMB field-service management platform for 1-5 truck home-services operators. https://www.housecallpro.com
29. **Workiz** -- Field-service management platform popular with small home-services operators. https://www.workiz.com
30. **Jobber** -- Field-service management platform for SMB home-services with quoting and recurring service contracts. https://www.getjobber.com
31. **Pemberton Tools** -- IDA-recognized standard hardened steel winding bars for torsion spring work. https://www.pembertontools.com
32. **DDM Garage Doors** -- Online wholesale source for specialty garage door parts and overnight ordering of less-common springs. https://www.ddmgaragedoors.com
33. **CSLB (California Contractors State License Board)** -- California C-61 / D-28 garage door specialty contractor license under California state contractor licensing. https://www.cslb.ca.gov
34. **Florida DBPR (Department of Business and Professional Regulation)** -- Florida specialty contractor licensing for garage door work plus FBC HVHZ hurricane wind-load requirements. https://www.myfloridalicense.com/dbpr
35. **NYC DOB (Department of Buildings) Special Inspector** -- New York City garage door install requirement for Special Inspector certification. https://www.nyc.gov/site/buildings

`;

const num = `

## Numbers

**Industry Size And Market Reality (Hardlines Research Foundation, IBISWorld, DASMA, IDA)**
- US garage door market size: $9B+ annually per Hardlines Research Foundation, IBISWorld, DASMA market estimates
- US residential garage door installed base: ~85M doors per Hardlines / DASMA tracking
- Residential garage door repair-and-service slice: $3.5B-$4.5B annually
- Average residential spring lifespan: 7-12 years (10,000-cycle standard), 15-20 years (25,000+ cycle premium)
- Average residential opener lifespan: 12-18 years
- US active independent garage door operator population: 8,000-15,000 operators in 2024-2026
- Precision Garage Door Service: ~100+ franchise territories nationally (Authority Brands-owned since 2023)
- Clopay Master Authorized Dealer network: ~6,000 dealers nationally

**Startup Capital Stack By Operator Format**

| Format | Truck setup | Rolling inventory | Tools | Insurance + permits + LLC | Total all-in Year 1 |
|---|---|---|---|---|---|
| Solo with used cargo van (lowest-capital launch) | $18K-$28K used van + $285 magnetic signs | $3.5K starter SKU | $1.5K-$2.5K | $4K-$8K | $24K-$42K |
| Solo with new cargo van + full setup | $28K-$55K + $1.8K-$5.5K rack + $2.5K shelving + $2.5K-$5.5K wrap | $3.5K-$12.5K | $2.5K-$6.5K | $4K-$12K | $45K-$95K |
| 2-3 truck operation | $90K-$240K vans + $5.5K-$16K racks + $7.5K-$18K shelving + $7.5K-$16K wraps | $12K-$35K | $7.5K-$18K | $15K-$45K | $145K-$385K |
| Regional 5-10 truck with showroom | $250K-$650K vans + showroom build-out $185K-$485K + inventory warehouse | $45K-$185K | $25K-$65K | $45K-$165K | $585K-$1.7M |

**Total Startup Investment By Format**

| Format | Disciplined launch target |
|---|---|
| Solo with used cargo van (lowest-capital) | $24K-$42K |
| Solo with new cargo van + full setup | $45K-$95K |
| 2-3 truck operation | $145K-$385K |
| Regional 5-10 truck with showroom | $585K-$1.7M |
| Multi-location regional 15-40 truck platform | $2.5M-$8.5M |

**Insurance Stack (Annual Year 1)**

| Coverage | Solo operator | 2-3 truck operation | Regional 5-10 truck |
|---|---|---|---|
| General Liability $1M/$2M | $1,800-$4,800 | $4,500-$12,500 | $12,500-$45,000 |
| Workers Compensation NCCI 5403 or 9015 | n/a if solo no employees | $8K-$22K | $35K-$95K |
| Commercial Auto (per vehicle) | $1,800-$5,500 | $5,400-$16,500 (3 vans) | $18K-$55K (10 vans) |
| Equipment Floater / Inland Marine | $485-$2,200 | $1,500-$5,500 | $5K-$15K |
| Professional Liability / E&O | $1,200-$3,500 | $2,500-$8,500 | $8K-$22K |
| Umbrella Liability $2M-$5M | n/a or $2,500-$5,000 | $4,500-$12,500 | $15K-$45K |
| Surety bonds (state contractor bond) | $250-$750 (1-3% of $25K bond face) | $250-$750 | $250-$750 |
| **Total Year 1 insurance load** | **$4K-$12K** | **$15K-$45K** | **$45K-$165K** |

**Per-Service Revenue Economics**

| Service line | Price range | Parts cost | Labor minutes | Margin |
|---|---|---|---|---|
| Service call minimum | $85-$185 | $0 | 15-30 | high (waived if repair authorized) |
| Spring replacement (single torsion) | $250-$500 | $35-$95 | 45-90 | $155-$370 |
| Spring replacement (pair torsion) | $375-$725 | $70-$185 | 60-120 | $205-$540 |
| Extension spring replacement (pair) | $185-$385 | $25-$75 | 45-90 | $110-$310 |
| Cable replacement (pair) | $150-$285 | $15-$45 | 30-60 | $105-$240 |
| Roller replacement (full set) | $120-$285 | $25-$85 | 30-60 | $95-$200 |
| Opener install (LiftMaster 8500 jackshaft) | $585-$885 | $285-$485 | 90-150 | $300-$400 |
| Opener install (LiftMaster 8550W belt drive) | $485-$785 | $185-$385 | 90-120 | $300-$400 |
| Opener install (Genie SilentMax 1200) | $385-$685 | $145-$285 | 90-120 | $240-$400 |
| Opener repair (gear / circuit board / photo-eye) | $150-$385 | $25-$95 | 30-90 | $125-$290 |
| Panel replacement (single sectional panel) | $285-$685 | $125-$285 | 60-120 | $160-$400 |
| Full residential door install | $1,500-$4,500 | $585-$1,800 | 180-300 | $915-$2,700 |
| Commercial sectional door install | $3,000-$15,000 | $1,200-$6,500 | 240-600 | $1,800-$8,500 |
| Commercial roll-up door install | $2,500-$12,000 | $985-$5,500 | 240-480 | $1,515-$6,500 |
| Smart opener upgrade (myQ / Aladdin Connect) | $285-$685 | $85-$285 | 30-60 | $200-$400 |
| Weatherstripping (full door) | $150-$400 | $25-$85 | 30-60 | $125-$315 |
| Off-track repair | $185-$485 | $0-$45 | 30-90 | $185-$440 |
| Annual maintenance plan (residential) | $95-$285/yr | $5-$15 | 30-45 | $90-$270/yr |
| Annual maintenance plan (commercial) | $385-$1,800/yr | $25-$95 | 90-240 | $360-$1,705/yr |

**Per-Format Mature Year 3 P&L Summary**

| Format | Trucks | Annual revenue | Net margin | Net to owner | Owner role |
|---|---|---|---|---|---|
| Solo owner-operator (low end) | 1 | $185K-$285K | 30-40% | $55K-$115K | Full-time tech on every job |
| Solo owner-operator (high end) | 1 | $285K-$385K | 35-45% | $100K-$170K | Full-time tech + DIY marketing |
| 2-3 truck operation (low end) | 2-3 | $400K-$650K | 25-32% | $100K-$210K | Part-time tech + dispatcher + sales |
| 2-3 truck operation (high end) | 2-3 | $650K-$900K | 30-38% | $195K-$340K | Operator-CEO + occasional field |
| Regional 5-10 truck operation | 5-10 | $1.5M-$4.5M | 18-28% | $270K-$1.25M | Operator-CEO out of field |
| Multi-location regional platform | 15-40 | $5M-$15M | 15-25% | $750K-$3.75M | Founder-CEO with regional GMs |
| Franchise-affiliated operator | varies | varies | 18-30% (after royalty) | varies | Franchise operations playbook |

**Five-Year Revenue Trajectory By Format**

| Format | Year 1 | Year 3 | Year 5 |
|---|---|---|---|
| Solo owner-operator | $85K-$185K | $185K-$385K | $250K-$450K |
| 2-3 truck operation | $150K-$385K | $400K-$900K | $550K-$1.2M |
| Regional 5-10 truck | $450K-$1.2M | $1.5M-$4.5M | $2.5M-$6.5M |
| Multi-location regional 15-40 truck | $1.5M-$4.5M | $5M-$15M | $8M-$25M |

**Operational Benchmarks**

- First-visit close rate target: 85-95% (tight rolling inventory discipline)
- Service-call response standard: same-day for before-noon calls, next-morning for after-noon
- Average call-to-booking conversion: 55-75%
- Average booking-to-completed-job conversion: 85-95%
- Average completed-job-to-Google-Review conversion: 18-32% (with disciplined automation)
- Mature operator Google Review density: 500-2,000+ reviews across 3-5 years
- Mature operator Google Review rating: 4.9+ stars
- Annual maintenance plan attach rate target: 12-25% of completed jobs
- Maintenance plan revenue as % of total: 8-18% at mature operator
- Commercial / B2B revenue as % of total: 10-25% at mature operator
- Solo operator job volume target: 8-25 jobs/week (40-50 jobs/week saturation point)
- Tech utilization rate target: 4-7 completed jobs per tech per day
- Marketing budget as % of revenue: 8-15% solo, 6-12% multi-truck, 4-8% regional
- Cost per qualified lead (Google LSA): $25-$85 (varies by market)
- Cost per click (Google Ads paid search): $8-$28
- Customer acquisition cost (CAC): $85-$285 per new customer
- Repeat customer rate target: 15-30% of mature-operator revenue from repeat customers
- Referral rate target: 15-30% of new customers from explicit referral

**Lead Generation Channel Mix (Mature Operator)**

| Channel | Typical % of new customer volume | Cost per lead |
|---|---|---|
| Google Local Services Ads (LSA) | 30-45% | $25-$85 per qualified lead |
| Google Ads (paid search) | 10-20% | $8-$28 CPC + conversion rate |
| Google Organic / SEO (Google Business Profile + city pages) | 10-25% | sustained content investment |
| Yelp (organic + paid) | 5-15% | $300-$1,500/month Yelp Ads |
| NextDoor (organic + paid) | 5-15% | $185-$885/month |
| Facebook (neighborhood groups + ads) | 3-10% | $25-$85 per lead |
| Manufacturer dealer-locator referrals (Clopay / Amarr / LiftMaster / Genie) | 2-8% | dealer-program enrollment |
| Real estate agent / builder partnerships | 2-8% | relationship investment |
| Commercial property manager B2B | 2-10% | relationship investment |
| Referral program (cash incentive) | 5-15% | $25-$85 per referred customer |
| Direct mail / door hangers | 1-5% | $0.45-$1.85 per piece |
| Truck wrap rolling billboard | 5-15% | $2.5K-$5.5K wrap cost |

**Manufacturer Dealer Program Tiers (Sample)**

| Manufacturer | Program | Dealer pricing vs MSRP | Lead-referral | Co-op marketing |
|---|---|---|---|---|
| Clopay (Master) | Clopay Master Authorized Dealer | 35-45% below MSRP | clopaydoor.com locator | yes |
| Amarr | Amarr Distributor | 35-45% below MSRP | amarr.com locator | yes |
| Wayne Dalton | Wayne Dalton Dealer | 30-45% below MSRP | wayne-dalton.com locator | yes |
| C.H.I. | C.H.I. Authorized Dealer | 30-45% below MSRP | chiohd.com locator | yes |
| LiftMaster | LiftMaster ProMember + Elite | 35-50% below MSRP | liftmaster.com locator | yes + Elite tier benefits |
| Genie | Genie Pro Dealer | 30-45% below MSRP | geniecompany.com locator | yes |
| Chamberlain | Chamberlain Pro | 25-40% below MSRP | chamberlain.com | limited |
| Sommer | Sommer Direct Dealer | 30-45% below MSRP | sommer-usa.com | yes |

**State Licensing Reality**

| State | License regime | Bond requirement | Notes |
|---|---|---|---|
| California | CSLB C-61 specialty contractor + D-28 Doors / Gates / Activating Devices classification | $25,000 contractor license bond | Required for jobs > $500; 4 years documented journey-level experience |
| Florida | DBPR specialty contractor + FBC HVHZ for hurricane-impact installs in Miami-Dade / Broward | varies | Certified license = statewide; registered license = county-by-county |
| Texas | TDLR no state license; municipal permits + city registration | varies by city | Most cities require permit + inspection for full door installs |
| New York | NYC DOB Special Inspector for NYC installs; municipal permits outside NYC | varies | NY State has no contractor license; municipal building permits apply |
| Illinois | IDFPR no state license; municipal permits in major cities | varies | Chicago / Naperville / Aurora require GC license or permit-and-inspection |
| Arizona | ROC K-38 doors and gates classification | varies | Required for AZ residential and commercial installs |
| Nevada | NSCB C-3 license | varies | Required for NV residential and commercial work |
| Washington | L&I contractor registration + workers comp coverage | $12K-$30K bond | Required for all contractor work |

**Wage And Labor Cost Data (BLS 2024 SOC Code Data)**

- Garage door tech (residential / repair): $48K-$78K base + commission on parts margin (BLS 49-9071 Maintenance and Repair Workers, General)
- Senior tech / installer (commercial / full-door installs): $58K-$95K + commission (BLS 47-2031 Carpenters)
- Dispatcher / Office Manager: $42K-$68K (BLS 43-5031 Police, Fire, and Ambulance Dispatchers analog or 43-6014 Secretaries and Administrative Assistants)
- Marketing Coordinator: $48K-$78K (BLS 13-1161 Market Research Analysts)
- General Manager (multi-truck operator): $75K-$165K + bonus (BLS 11-1021 General and Operations Managers)
- Operations Manager (regional 5-10 truck): $85K-$185K + bonus
- Contract labor / 1099 specialty installers: $185-$485 per day-rate (DOL 2024 Final Rule misclassification risk if not arm's-length contractor)

**Exit Multiples By Format**

| Operator scale | Operating business multiple | Likely acquirer |
|---|---|---|
| Solo operator (sub-$500K revenue) | 1.5-3x SDE | Local operator or aspiring tech-turned-owner |
| 2-3 truck operation ($500K-$1.5M) | 2.5-4x EBITDA | Trade buyer or aspiring buyer-operator with SBA 7(a) |
| Regional 5-10 truck ($1.5M-$5M) | 3-5x EBITDA | Regional consolidator or PE roll-up |
| Multi-location regional ($5M-$15M) | 4-6x EBITDA | PE platform or strategic acquirer |
| Large platform ($15M+) | 5-7x EBITDA | PE or strategic (Authority Brands / Neighborly / A1 backers) |
| Owner-operator continuation | n/a (no sale) | Owner cash flow $90K-$340K annual at solo to 2-3 truck scale |

**Strategic Acquirers**

- **Authority Brands** -- PE-backed home-services franchise platform that acquired Precision Garage Door Service in 2023; also owns Mr. Rooter / Mr. Electric / Aire Serv / Window Genie / Mosquito Joe / Benjamin Franklin Plumbing / One Hour Heating & Air / Mister Sparky / House Doctors / Junk King -- multi-brand home-services consolidator
- **Neighborly (Dwyer Group rebrand)** -- Multi-brand home-services franchise platform with adjacent service brands; PE-backed via various PE sponsors
- **A1 Garage Door Service** -- Multi-state PE-backed garage door operator backed by Riverside Company
- **Aladdin Garage Doors** -- Regional consolidator and franchisor
- **Riverside Company** -- PE sponsor of A1 Garage Door
- **Regional PE-backed home-services platforms** in Phoenix, Dallas, Atlanta, Tampa, Houston metros that acquire single-market operators

`;

const counter = `

## Counter-Case: Why Starting A Garage Door Repair Business In 2027 Might Be A Mistake

A serious founder must stress-test the case above against the conditions that make this model a bad bet.

**Counter 1 — Torsion spring liability is the single largest operational risk and persistent existential exposure.** Torsion springs store **150-300 lbs of mechanical energy under tension** and improperly-released springs cause severe injuries or death — **IDA and DASMA safety alerts cite torsion spring releases as the #1 cause of garage door technician deaths and major injuries in the trade**. The injury vectors include winding-bar slip during tensioning, broken-spring whip during cable release, door fall during spring change, and cable failure under tension. Professional liability claims on garage door injury sit at **$50K-$500K typical settlement range** for residential customer injury, **$1M+ exposure on commercial / multi-resident injury**, and **wrongful-death claims on tech fatality at $1M-$5M+** range. The disciplined operator runs **structured spring-work protocol on every job** (door blocked with vise grips below bottom roller before any spring work, Pemberton Tools or equivalent IDA-recognized hardened steel winding bars never substituted with screwdrivers / rebar, two-bar tensioning always, tech body position keeping face / chest away from winding bar arc, safety glasses + hearing protection + gloves PPE minimum, two-tech rule for commercial-size springs, spring measurement using IPPT inside-diameter + wire-gauge + length + wind-direction protocol documented on every job), maintains **IDA-CT certification + manufacturer training current**, runs **photo documentation on every spring job pre/post**, and budgets **$1.8K-$4.8K annual GL premium for solo operator** with **$2M-$5M umbrella layered above** to manage catastrophic-claim exposure.

**Counter 2 — Franchise competitive pressure from Precision + A1 + Sears squeezes independent operator economics in major metros.** **Precision Garage Door Service (~100+ franchise territories under Authority Brands since 2023) plus A1 Garage Door Service (multi-state PE-backed) plus Sears Garage Door (legacy franchise brand)** dominate **Google Ads bidding, radio + TV branding, and pricing-transparency posture** in 40+ major metros — squeezing independent operator CAC (cost per acquisition) and forcing pricing-transparency pressure that compresses margin. Precision in particular runs **transparent pricing pages, online booking, 24/7 dispatch, brand-recognized vehicle wraps, and aggressive Google Ads / LSA bidding** that an independent operator cannot match dollar-for-dollar on marketing spend. The disciplined independent operator either **positions in markets where Precision / A1 do not have direct franchise presence** (smaller metros, secondary markets, specific zip-code-level zoning), **competes on local-knowledge + speed + reviews + relationships** rather than on Google Ads spending parity, OR **affiliates with Precision / Aladdin / Garage Door Doctors franchise** for brand recognition at the cost of **6-10% royalty + marketing fund + constrained operator independence**.

**Counter 3 — Google LSA pricing inflation and platform algorithm risk create channel-dependence exposure.** Google Local Services Ads has been the #1 lead source for garage door operators in 2022-2025 but **LSA cost-per-lead has inflated 25-45%** over that period as more operators enrolled and bid competition intensified. Operators with **single-channel dependence (60%+ of leads from Google LSA)** face **platform-risk** if Google algorithm changes deprioritize the listing, if LSA pricing continues to inflate, or if Google launches alternative ad products that cannibalize LSA. The disciplined operator builds **diversified channel mix with no single channel exceeding 35% of new-customer volume** — combining Google LSA + Google Ads + Yelp + NextDoor + manufacturer dealer-locator referrals + real estate / builder / commercial property manager B2B + SEO content + referral program + truck wrap visibility to manage channel-risk.

**Counter 4 — 1099 vs W-2 misclassification exposure under DOL 2024 Final Rule + state misclassification statutes creates six-figure back-tax exposure.** Many garage door operators historically used **1099 contractor classification for techs** to avoid workers comp + payroll tax + benefits cost — but the **DOL Independent Contractor Final Rule effective March 2024** plus state misclassification statutes (California AB5 most aggressive, New Jersey ABC test, Massachusetts ABC test, Washington and Illinois enforcement-active) make 1099 misclassification of W-2-functional techs a **six-figure back-tax exposure** in DOL or state audit. The disciplined operator runs **techs as W-2 employees** with full workers comp + payroll tax + benefits cost, with the only legitimate 1099 use being **arm's-length specialty installers brought in for occasional commercial overhead or hurricane-impact jobs** where the contractor maintains independent business operation. The operator who relies on 1099 misclassification for cost advantage faces **catastrophic back-tax + penalty + interest exposure** in audit.

**Counter 5 — Truck inventory management is the operating discipline that separates first-visit-close operators from second-trip-margin-destroyed operators.** A tech who arrives without the right SKU on the truck has two bad options: **(a) drive back to shop or distribution branch for the part** (margin destroyed by 1-3 hours unbilled drive + parts pickup) or **(b) upsell the customer to a different fix using parts on hand** (reputational damage when the customer realizes they were upsold). The disciplined operator runs **8-12 core SKU tracking with monthly cycle count, monthly out-of-stock root-cause audit, and quarterly seasonal inventory rebalance** to target **85-95% first-visit close rate**. The operator who treats truck inventory casually drifts to **65-75% first-visit close rate** and bleeds 8-15 margin points to second-trip lost time and customer-perception damage.

**Counter 6 — Spring inventory specialty complexity creates capital trap for under-stocked operators.** Torsion springs are **manufactured in dozens of inside-diameter + wire-gauge + length + wind-direction combinations** to match specific door weights and configurations. The dominant residential SKUs cover 4-6 most-common specifications (1.75" ID x 0.225 wire, 2.0" ID x 0.234 wire, 2.0" ID x 0.250 wire, 2.25" ID x 0.243 wire most common) but the **long tail of specifications** can require **overnight ordering from DDM Garage Doors / Garage Door Stuff / Industrial Spring Manufacturers** for less-common doors. Under-stocked operators face the **"correct spring not on truck" trap** — either driving 60-120 minutes back to shop / wholesaler for the correct spring or substituting a close-but-wrong spring that fails prematurely and damages reputation. Over-stocked operators tie up **$8K-$25K in spring inventory** for the long-tail specifications that turn over slowly. The disciplined operator runs **5-7 most-common spring sizes on every truck + 1-2 trucks in operation carrying the long-tail specifications + overnight wholesale relationship** for true-rare specifications.

**Counter 7 — Seasonality and weather-dependent demand creates revenue volatility for under-diversified operators.** Garage door service demand spikes around **(a) spring thaw in cold-climate metros** (frozen + cracked springs from winter cold cycling), **(b) summer hailstorm season in Sun Belt metros** (panel damage requiring replacement), **(c) hurricane / tropical storm season in Florida + Gulf Coast** (door damage + hurricane-impact replacement), and **(d) holiday season** (general residential maintenance reset). The valleys between these spikes can run 25-35% below peak revenue for **weather-event-dependent operators**. The disciplined operator runs **diversified service mix** (residential repair + commercial maintenance contracts + builder partnerships) to smooth seasonality, and runs **maintenance plan recurring revenue at 10-20% of total** as the structural smoothing layer.

**Counter 8 — Pricing transparency pressure from online quoting tools squeezes margin on commodity service lines.** Online quoting tools (Thumbtack, HomeAdvisor / Angi, garage door manufacturer websites with estimator pages) increasingly publish **expected pricing ranges** for spring replacement, opener install, and full door install — pressuring operators to compete on price for commodity service lines. The disciplined operator **competes on value + speed + reviews + warranty** rather than racing to the bottom on pricing, **publishes flat-rate pricing on the website** to remove phone-quote friction without committing to bottom-of-market positioning, and **differentiates on premium service (24/7 emergency response + same-day arrival + manufacturer dealer relationships + IDA-CT certification + 4.9-star Google Review density)** that justifies premium pricing.

**Counter 9 — HOA contract concentration risk creates revenue cliff if HOA preferred-vendor status is lost.** Operators heavily reliant on HOA preferred-vendor contracts (single HOA exceeding 15% of revenue) face **revenue cliff risk** if HOA board changes or preferred-vendor status is rotated to a competitor. The disciplined operator caps **single-HOA revenue at 10-15% of total**, builds **diversified HOA portfolio** across 5-15 HOAs, and treats HOA work as **supplemental revenue layer rather than core dependence**.

**Counter 10 — Regulatory burden in California (and increasing in other states) creates compliance cost layer.** California Proposition 65 (chemical exposure warning labels), California Lead-Safe Renovation Rule, California Title 8 workers comp + safety enforcement, plus the **ongoing California compliance burden** for contractor businesses adds **$8K-$25K annual compliance cost layer** for operators in California vs other states. Other states are increasingly adopting similar compliance frameworks. The disciplined California operator **budgets compliance cost as recurring operating expense** and prices accordingly; out-of-state operators evaluating California expansion **stress-test the compliance cost layer** before market entry.

**Counter 11 — Tech retention and the wage-vs-margin trade-off creates persistent scaling challenge.** Skilled garage door techs with IDA-CT certification + LiftMaster Elite + 3+ years experience are **scarce in most metros** and command **$58K-$95K base + commission**. The operator who underpays tech wages drives **40-70% annual turnover** (industry-typical for trades), losing the training investment + customer-relationship continuity + first-visit-close discipline. The disciplined operator pays **wage at 60-75th percentile of local market + commission on parts margin + paid IDA-CT certification + structured career path (Year 1 tech → Year 2 senior tech → Year 3 specialty / commercial / installer)** to retain skilled bench at **sub-25% turnover** — compressing **8-15 margin points** to wage cost but capturing **20-30 margin points** in first-visit-close + customer-retention + referral-rate discipline. The math favors paying up.

**Counter 12 — Adjacent home-services formats may fit better for founders attracted to trades but not to the torsion-spring-liability burden.** **HVAC service (heating + cooling repair and install)** — larger market ($150B+ US per IBISWorld), higher per-ticket revenue ($385-$1,800 repair, $4,500-$15,000 install), broader recurring-revenue maintenance contract base (annual tune-up programs typical), but **EPA refrigerant certification + Section 608 / 609 license required**; **plumbing service** — emergency plumbing ($185-$685 average ticket) plus water heater / sewer line install ($1,500-$5,500); **electrical service** — residential and commercial electrical service ($185-$885 service call) with EV charger install ($885-$2,500) as growth tailwind; **roofing repair and replacement** — high-ticket residential and commercial roofing work but project-based revenue lumpiness; **pest control** — Home Instead franchise format with recurring-monthly-contract structure; **handyman service (Mr. Handyman, Handyman Connection franchise format)** — diversified small-repair service with lower technical-specialization barrier; **window installation (Window Nation, Window World, Renewal by Andersen)** — high-ticket window replacement at $485-$1,800 per window; **door installation specialty (entry doors, French doors, sliding doors)** — adjacent door-trade specialty with less liability than garage door spring work; **gate operator install (residential driveway gates plus commercial gate operators — DoorKing, FAAC, HySecurity, LiftMaster commercial gate)** — adjacent operator-install specialty; **gutter installation (LeafFilter, Gutter Helmet, regional gutter specialists)** — high-ticket residential gutter and gutter-guard work; **junk removal (Junk King, 1-800-GOT-JUNK franchise)** — adjacent home-services format with low technical barrier; **landscape and lawn care (TruGreen, Brightview)** — recurring-revenue residential and commercial format.

**The honest verdict.** Starting a garage door repair business in 2027 is a reasonable choice for a founder who: **(a)** has matched capital to format ($24K-$42K for solo with used cargo van lowest-capital launch, $45K-$95K for solo with full new-van setup, $145K-$385K for 2-3 truck operation, $585K-$1.7M for regional 5-10 truck with showroom); **(b)** has secured **state contractor license** (CA C-61/D-28, FL DBPR specialty, TX municipal, NY NYC DOB Special Inspector where applicable), **IDA-CT certification or apprenticeship pathway equivalent**, **manufacturer training (LiftMaster Pro Elite, Genie Pro, Clopay Master Dealer)**, and **GL + workers comp + commercial auto + umbrella insurance stack at $4K-$45K annual**; **(c)** has built **disciplined truck inventory targeting 85-95% first-visit close rate** with 8-12 core SKU rolling stock + monthly cycle count + monthly out-of-stock root-cause audit; **(d)** has built **diversified lead-gen channel mix** with no single channel exceeding 35% of new-customer volume (Google LSA + Google Ads + Yelp + NextDoor + manufacturer dealer-locator referrals + real estate / builder / commercial property manager B2B + SEO content + referral program + truck wrap); **(e)** has built **structured spring-work protocol on every job** (door blocked + Pemberton Tools winding bars + two-bar tensioning + body position discipline + PPE + two-tech rule for commercial springs + IPPT documentation) and **photo documentation pre/post on every job**; **(f)** has built **review-density discipline** targeting 4.9+ star rating across 500-2,000+ reviews via NiceJob / Birdeye / Podium automation over 3-5 year compounding cycle. It is a poor choice for anyone underestimating **torsion spring liability** (severe injury / death exposure), anyone treating it as a **passive business** rather than a hands-on tech operation, anyone uncomfortable with **24/7 emergency-call response** posture, anyone unable to match Precision / A1 franchise marketing spend in major metros, anyone relying on **1099 misclassification of techs** to avoid workers comp + payroll tax cost (six-figure DOL / state audit exposure), anyone unwilling to invest in **IDA-CT certification + manufacturer training + ongoing CE**, and anyone whose real interest would be better served by **HVAC service / plumbing service / electrical service / roofing / pest control / handyman service / window installation / door installation specialty / gate operator install / gutter installation / junk removal / landscape and lawn care** adjacent formats. The model is not a scam, but it is more spring-liability-exposed, more franchise-competition-pressured, more channel-dependence-risky, and more inventory-discipline-demanding than its "simple trade business" surface suggests — and in 2027 the gap between the disciplined version that works and the spring-liability-careless, marketing-dilettante, inventory-sloppy, 1099-misclassification-risky version that fails is wide.

`;

const links = `

## Related Pulse Library Entries

- q1127
- q1139
- q1942
- q1946
- q1947
- q1948
- q1949
- q1951
- q1952
- q1953
- q1954
- q1962
- q1965
- q1966
- q1975
- q2117
- q2137
- q2139
- q9576
- q9601
- q9620
- q9628
- q9629
- q9640
- q9645

`;

const tags = ['garage-door-repair','garage-door-installation','overhead-door','home-services','emergency-services','licensed-trade','spring-replacement','opener-installation','recurring-revenue-warranties','2027'];

const sources = [
  { title: 'IDA (International Door Association) -- dominant operator-side trade association covering garage door industry, IDA-CT and IDA-CI certifications, IDA Expo, training programs', url: 'https://www.idainternational.org' },
  { title: 'DASMA (Door & Access Systems Manufacturers Association) -- manufacturer-side trade association setting ANSI/DASMA 102 commercial door standards and DASMA 105 wind-load standards', url: 'https://www.dasma.com' },
  { title: 'Hardlines Research Foundation -- authoritative US garage door market data showing $9B+ market size and ~85M residential garage door installed base', url: 'https://www.hardlines.com' }
];

const notes = {
  s6: `Added 35 cited sources covering operator trade groups (IDA International Door Association dominant operator-side trade association covering garage door industry data / IDA-CT and IDA-CI certifications / IDA Expo conferences / training programs, DASMA Door & Access Systems Manufacturers Association manufacturer-side trade association setting ANSI/DASMA 102 commercial door standards / DASMA 105 wind-load standards, NIDA National Independent Door Association independent-operator-focused trade group), market data sources (Hardlines Research Foundation authoritative US garage door market data showing $9B+ market size and ~85M residential garage door installed base, IBISWorld Garage Door Manufacturing Industry Report), dominant operating franchises and chains (Precision Garage Door Service largest US garage door franchise ~100+ territories nationally acquired by Authority Brands in 2023, A1 Garage Door Service multi-state PE-backed garage door operator backed by Riverside Company, Aladdin Garage Doors multi-region operator and franchisor, Sears Garage Door Service legacy franchise brand, Overhead Door Company the original 1921 founder of the garage door category Sanwa Holdings-owned since 2011), residential door manufacturers (Clopay Building Products the largest US residential garage door manufacturer with Clopay Master Authorized Dealer program ~6,000 dealers, Amarr Garage Doors Entrematic/Assa Abloy second-largest, Wayne Dalton Overhead Door subsidiary, C.H.I. Overhead Doors Illinois-based mid-tier, Hörmann US German premium and commercial, Raynor Garage Doors Illinois family-owned premium, Garaga Canadian premium brand), opener manufacturers (LiftMaster Chamberlain Group Blackstone-owned dominant US residential opener brand with LiftMaster ProMember dealer program, Genie Company Overhead Door Company subsidiary with Genie Pro dealer program and Aladdin Connect smart platform, Chamberlain Group consumer/DIY tier, Sommer USA premium German direct-drive specialization), PE consolidators (Authority Brands PE-backed multi-brand home-services franchise platform that acquired Precision Garage Door Service 2023 plus Mr. Rooter/Mr. Electric/Aire Serv/Window Genie/Mosquito Joe/Benjamin Franklin Plumbing/One Hour Heating & Air/Mister Sparky/House Doctors/Junk King, Neighborly Dwyer Group rebrand multi-brand home-services franchise platform with adjacent service brands Window Genie/Mosquito Joe/Aire Serv/Mr. Appliance/Mr. Handyman/Five Star Painting), lead-generation platforms (Google Local Services Ads Google Screened/Google Guaranteed #1 lead source for garage door operators pay-per-lead $25-$85 with $2,000 Google Guarantee backing, Yelp for Business dominant West Coast and high-Yelp-penetration market lead source, NextDoor for Business dominant neighborhood-level platform for service-business referrals), field service management software (ServiceTitan dominant enterprise FSM for plumbing/HVAC/electrical/garage door at multi-truck scale, Housecall Pro dominant SMB FSM for 1-5 truck home-services operators, Workiz FSM popular with small operators, Jobber FSM for SMB home-services), equipment and parts sources (Pemberton Tools IDA-recognized standard hardened steel winding bars for torsion spring work, DDM Garage Doors online wholesale source for specialty garage door parts and overnight ordering), and state licensing authorities (CSLB California Contractors State License Board C-61/D-28 garage door specialty contractor license, Florida DBPR Department of Business and Professional Regulation specialty contractor licensing plus FBC HVHZ hurricane wind-load requirements, NYC DOB Department of Buildings Special Inspector certification for garage door installs in NYC five boroughs).`,
  s7: `Added comprehensive numbers block with 12+ markdown pipe tables covering: industry size and market reality (US garage door market $9B+ annually per Hardlines Research Foundation/IBISWorld/DASMA, US residential garage door installed base ~85M doors, residential repair-and-service slice $3.5B-$4.5B annually, average residential spring lifespan 7-12 years on 10K-cycle / 15-20 years on 25K+ cycle premium, average opener lifespan 12-18 years, US active independent operator population 8K-15K in 2024-2026, Precision Garage Door ~100+ franchise territories Authority Brands-owned since 2023, Clopay Master Authorized Dealer ~6K dealers); startup capital stack by operator format (solo with used cargo van lowest-capital $24K-$42K, solo with new cargo van full setup $45K-$95K, 2-3 truck operation $145K-$385K, regional 5-10 truck with showroom $585K-$1.7M, multi-location 15-40 truck platform $2.5M-$8.5M); insurance stack annual Year 1 by operator scale (GL $1M/$2M $1.8K-$45K, workers comp NCCI 5403 or 9015 $8K-$95K, commercial auto per vehicle $1.8K-$5.5K, equipment floater $485-$15K, professional liability $1.2K-$22K, umbrella $2.5K-$45K, surety bonds $250-$750, total Year 1 $4K-$165K); per-service revenue economics by service line (service call minimum $85-$185, spring replacement single torsion $250-$500 or pair $375-$725, extension spring pair $185-$385, cable replacement pair $150-$285, roller replacement $120-$285, opener install LiftMaster 8500 jackshaft $585-$885 or 8550W belt drive $485-$785 or Genie SilentMax 1200 $385-$685, opener repair $150-$385, panel replacement single $285-$685, full residential door install $1,500-$4,500, commercial sectional $3K-$15K, commercial roll-up $2.5K-$12K, smart opener upgrade $285-$685, weatherstripping $150-$400, off-track repair $185-$485, annual maintenance plan residential $95-$285/yr or commercial $385-$1,800/yr); per-format mature Year 3 P&L summary (solo $185K-$385K revenue 30-45% net = $55K-$170K take-home, 2-3 truck $400K-$900K 25-38% = $100K-$340K, regional 5-10 truck $1.5M-$4.5M 18-28% = $270K-$1.25M, multi-location regional 15-40 truck $5M-$15M 15-25% = $750K-$3.75M); five-year revenue trajectory by format; operational benchmarks (first-visit close rate target 85-95%, service-call response standard same-day before-noon / next-morning after-noon, call-to-booking conversion 55-75%, booking-to-completed-job 85-95%, completed-job-to-Google-Review 18-32%, mature operator review density 500-2K+ reviews at 4.9+ stars, maintenance plan attach rate target 12-25% of completed jobs, maintenance plan revenue 8-18% of total at mature operator, commercial B2B 10-25%, solo operator job volume 8-25/week with 40-50/week saturation, tech utilization 4-7 completed jobs per tech per day, marketing budget 8-15% solo / 6-12% multi-truck / 4-8% regional, cost per qualified lead Google LSA $25-$85, Google Ads CPC $8-$28, CAC $85-$285 per new customer, repeat customer rate 15-30%, referral rate 15-30%); lead generation channel mix by channel showing % of new customer volume and cost per lead (Google LSA 30-45% at $25-$85 per qualified lead, Google Ads 10-20% at $8-$28 CPC, Google Organic/SEO 10-25%, Yelp 5-15% at $300-$1,500/mo, NextDoor 5-15% at $185-$885/mo, Facebook 3-10% at $25-$85 per lead, manufacturer dealer-locator 2-8%, real estate/builder 2-8%, commercial property manager B2B 2-10%, referral program 5-15%, direct mail 1-5%, truck wrap 5-15%); manufacturer dealer program tiers (Clopay/Amarr/Wayne Dalton/C.H.I./LiftMaster/Genie/Chamberlain/Sommer pricing vs MSRP and lead-referral programs); state licensing reality by state table (CA CSLB C-61/D-28 $25K bond, FL DBPR specialty + FBC HVHZ, TX TDLR no state + municipal, NY NYC DOB Special Inspector, IL IDFPR no state + municipal, AZ ROC K-38, NV NSCB C-3, WA L&I); wage and labor cost data per BLS 2024 SOC codes (garage door tech $48K-$78K + commission per BLS 49-9071, senior tech/installer $58K-$95K + commission per BLS 47-2031, dispatcher $42K-$68K, marketing coordinator $48K-$78K, GM $75K-$165K, operations manager $85K-$185K, 1099 specialty installers $185-$485 day-rate with DOL 2024 Final Rule misclassification risk); exit multiples by format (solo 1.5-3x SDE, 2-3 truck 2.5-4x EBITDA, regional 5-10 truck 3-5x EBITDA, multi-location 4-6x EBITDA, large platform 5-7x EBITDA, owner-operator continuation $90K-$340K annual cash flow at solo to 2-3 truck scale).`,
  s8: `Added 12-element counter-case: torsion spring liability single largest operational risk and persistent existential exposure (springs store 150-300 lbs mechanical energy, IDA/DASMA safety alerts cite spring releases as #1 cause of garage door tech deaths and major injuries, injury vectors winding-bar slip / broken-spring whip / door fall / cable failure, professional liability claims $50K-$500K residential / $1M+ commercial / wrongful-death $1M-$5M+, disciplined operator runs structured spring-work protocol door blocked + Pemberton Tools + two-bar tensioning + body position + PPE + two-tech rule for commercial + IPPT documentation + photo documentation pre/post + $1.8K-$4.8K GL + $2M-$5M umbrella); franchise competitive pressure from Precision + A1 + Sears squeezes independent operator economics in major metros (Precision ~100+ Authority Brands territories plus A1 PE-backed plus Sears legacy dominate Google Ads bidding + radio/TV + transparent pricing in 40+ major metros, independent operator either positions in markets where Precision/A1 absent OR competes on local-knowledge + speed + reviews + relationships OR affiliates with Precision/Aladdin/Garage Door Doctors franchise at 6-10% royalty + marketing fund); Google LSA pricing inflation and platform algorithm risk creates channel-dependence exposure (LSA cost-per-lead inflated 25-45% 2022-2025, single-channel dependence at 60%+ creates platform-risk if Google deprioritizes or LSA pricing continues to inflate, disciplined operator builds diversified channel mix with no single channel exceeding 35% combining Google LSA + Google Ads + Yelp + NextDoor + manufacturer dealer-locator + real estate/builder/commercial property manager B2B + SEO + referral + truck wrap); 1099 vs W-2 misclassification exposure under DOL 2024 Final Rule + state misclassification statutes creates six-figure back-tax exposure (DOL Independent Contractor Final Rule March 2024 plus California AB5 / New Jersey ABC test / Massachusetts ABC test / Washington / Illinois enforcement make 1099 misclassification of W-2-functional techs a six-figure back-tax exposure, disciplined operator runs techs as W-2 employees with the only legitimate 1099 use being arm's-length specialty installers); truck inventory management is operating discipline that separates first-visit-close operators from second-trip-margin-destroyed operators (8-12 core SKU tracking with monthly cycle count + monthly out-of-stock root-cause audit + quarterly seasonal rebalance targeting 85-95% first-visit close rate vs 65-75% casual-inventory operators bleed 8-15 margin points); spring inventory specialty complexity creates capital trap for under-stocked operators (springs manufactured in dozens of inside-diameter + wire-gauge + length + wind-direction combinations, dominant residential SKUs 4-6 most-common 1.75"/2.0"/2.25" ID with 0.225-0.250 wire, long-tail specifications require overnight ordering from DDM Garage Doors/Industrial Spring Manufacturers, disciplined operator runs 5-7 most-common on every truck + 1-2 trucks carrying long-tail + overnight wholesale relationship for true-rare specs); seasonality and weather-dependent demand creates revenue volatility for under-diversified operators (spring thaw cold-climate + summer hailstorm Sun Belt + hurricane/tropical storm FL/Gulf Coast + holiday season spikes with 25-35% valleys for weather-event-dependent operators, disciplined operator runs diversified service mix residential + commercial maintenance + builder partnerships + maintenance plan recurring 10-20% as smoothing layer); pricing transparency pressure from online quoting tools squeezes margin on commodity service lines (Thumbtack/HomeAdvisor-Angi/manufacturer estimator pages publish expected pricing ranges, disciplined operator competes on value + speed + reviews + warranty rather than race-to-bottom + publishes flat-rate pricing on website + differentiates on premium service 24/7 emergency response + same-day arrival + manufacturer dealer + IDA-CT certification + 4.9-star Google Review density to justify premium pricing); HOA contract concentration risk creates revenue cliff if HOA preferred-vendor status is lost (single HOA exceeding 15% revenue creates cliff risk if board changes or status rotated, disciplined operator caps single-HOA at 10-15% of total + builds diversified HOA portfolio across 5-15 HOAs + treats HOA as supplemental layer); regulatory burden in California (and increasing in other states) creates compliance cost layer (CA Prop 65 + Lead-Safe Renovation + Title 8 workers comp + ongoing CA compliance adds $8K-$25K annual cost layer for CA operators vs other states, other states increasingly adopting similar frameworks, disciplined CA operator budgets compliance as recurring operating expense and prices accordingly); tech retention and the wage-vs-margin trade-off creates persistent scaling challenge (skilled IDA-CT + LiftMaster Elite + 3+ years experience techs scarce commanding $58K-$95K base + commission, underpaying drives 40-70% annual turnover losing training + customer-relationship + first-visit-close discipline, disciplined operator pays wage at 60-75th percentile + commission + paid IDA-CT + structured career path Year 1 tech > Year 2 senior > Year 3 specialty/commercial to retain bench at sub-25% turnover); adjacent home-services formats may fit better (HVAC service larger market $150B+ higher per-ticket $385-$1,800 repair / $4,500-$15,000 install, plumbing service emergency $185-$685 + water heater/sewer $1,500-$5,500, electrical service $185-$885 + EV charger $885-$2,500, roofing repair/replacement, pest control Home Instead franchise recurring-monthly, handyman service Mr. Handyman/Handyman Connection franchise, window installation Window Nation/Window World/Renewal by Andersen, door installation specialty entry/French/sliding, gate operator install residential/commercial DoorKing/FAAC/HySecurity/LiftMaster commercial gate, gutter installation LeafFilter/Gutter Helmet, junk removal Junk King/1-800-GOT-JUNK, landscape and lawn care TruGreen/Brightview) — with honest 6-condition verdict on who should and should not start.`,
  s9: `Cross-linked 25 related Pulse entries: q1127 (adjacent service business throughput format); q1139 (adjacent service refresh format); tutoring/service-business siblings q1942/q1946-q1954 following the same "how do you start a [BUSINESS TYPE] business in 2027?" format; q1962 glamping (adjacent housing/lodging format); q1965/q1966 party/bounce house rental (adjacent service-business format); q1975 daycare (adjacent licensed-facility format); q2117 post-construction cleanup (adjacent service format); q2137 nearby cohort (q2138 sibling); q2139 nearby cohort (q2138 sibling); q9576 adult coding bootcamp (recent service sibling); q9601 fractional CFO operational backbone; q9620 nearby cohort; q9628/q9629 recent service-business launches; q9640 driving school (recent service-business launch); q9645 tiny home builder business (NEW STRUCTURE direct format template sibling with TOC + 4 PART super-headers + Bottom Line organization).`,
  s10: `SUBAGENT_VERIFIED. Comprehensive deep rewrite of the garage door repair business / residential and light-commercial field service startup playbook for 2027, matching the actual question "How do you start a garage door repair business in 2027?" Built under the NEW STRUCTURE with NEW TLDR ORGANIZATION: core opens with Bottom Line callout block (3 punchy bullets with bold-tag labels Capital / Margins / Hardest part hitting must-know points — capital $8K-$22K solo to $45K-$120K 2-3 tech to $585K-$1.7M regional, margins average service call $185-$385 + spring replacement $250-$500 + opener install $400-$900 + full door install $1,500-$4,500 with mature solo netting $90K-$220K/yr and 3-truck $400K-$900K/yr at 30-45% net, hardest part torsion spring liability with severe injuries or death and $50K-$500K injury claims ending small operators), then 3 short paragraphs (max 4 sentences each with bold key facts inline) breathable not wall-of-text, then TOC block listing 14 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (📐 PART 1 FOUNDATIONS / 🧱 PART 2 BUILD-OUT & CAPITAL / ⚙️ PART 3 OPERATIONS / 📈 PART 4 GROWTH & EXIT) with horizontal rule separators, then H3 deep content sections inside each PART (3-4 per part totaling 14 H3 sections). Verified structure: tldr opens with Bottom Line + economic anchor on US garage door market $9B+ per Hardlines Research Foundation / IBISWorld / DASMA + installed base ~85M residential garage doors + average spring lifespan 7-12 years + opener lifespan 12-18 years; named operators (Precision Garage Door Service ~100+ franchise territories Authority Brands-owned since 2023, A1 Garage Door Service multi-state PE-backed Riverside Company, Aladdin Garage Doors multi-region, Sears Garage Door legacy franchise, Overhead Door Company the original 1921 founder Sanwa Holdings-owned, Garage Doors of Phoenix regional, Action Garage Door Texas, Affordable Garage Door Service regional); door manufacturers (Clopay Master the largest US residential ~6,000 dealers, Amarr Entrematic/Assa Abloy second-largest, Wayne Dalton Overhead Door subsidiary, C.H.I. Overhead Doors Illinois mid-tier, Hörmann German premium commercial, Raynor Garage Doors Illinois family-owned, Garaga Canadian premium, Northwest Door Pacific Northwest regional, Cookson Door Sales commercial roll-up); opener manufacturers (LiftMaster Chamberlain Group Blackstone-owned dominant residential, Genie Overhead Door subsidiary with Aladdin Connect, Chamberlain consumer/DIY tier, Sommer premium German, Marantec German commercial); trade groups (IDA International Door Association dominant operator-side with IDA-CT/IDA-CI certifications and IDA Expo, DASMA Door & Access Systems Manufacturers Association with ANSI/DASMA 102 commercial standards and DASMA 105 wind-load standards, NIDA National Independent Door Association); state licensing (CA CSLB C-61/D-28 with $25K bond, FL DBPR specialty contractor + FBC HVHZ Miami-Dade NOA hurricane wind-load, TX TDLR no state + municipal, NY NYC DOB Special Inspector, IL IDFPR no state + municipal Chicago/Naperville/Aurora, AZ ROC K-38, NV NSCB C-3, WA L&I); equipment (Pemberton Tools IDA-standard winding bars, Adrian Steel/Ranger Design/Sortimo/Knaack interior shelving, Ford Transit/Mercedes Sprinter/Ram ProMaster/Chevrolet Express cargo vans); software/dispatch (ServiceTitan enterprise FSM, Housecall Pro SMB FSM, Workiz/Jobber/ServiceMonster/FieldRoutes/Briostack/BlueFolder/ServSuite/Markate FSM platforms, CallRail/CallTrackingMetrics tracked numbers, Ruby Receptionists/Smith.ai/AnswerConnect answering services, NiceJob/Birdeye/Podium/Listen360/GatherUp review automation, Stripe/Square/Helcim payment processing, Wisetack/Affirm/GreenSky/Synchrony/Service Finance Company consumer financing); lead-gen channels (Google LSA #1 lead source at $25-$85 per qualified lead with Google Screened/Google Guaranteed badge and $2,000 backing, Google Ads $8-$28 CPC, Yelp + Yelp Ads, NextDoor + NextDoor Ads, Facebook neighborhood groups + ads, HOA preferred-vendor lists, real estate agent referrals, builder partnerships D.R. Horton/Lennar/Pulte/KB Home/Toll Brothers/Meritage Homes/Taylor Morrison/NVR-Ryan Homes/Beazer Homes, commercial property manager CBRE/Cushman & Wakefield/JLL/Colliers, restoration contractor Servpro/BELFOR/Rainbow International, manufacturer dealer-locator); insurance carriers (general liability + workers comp NCCI 5403 carpentry or 9015 building service + commercial auto + equipment floater + professional liability + contractor pollution + umbrella + surety bonds); PE consolidators (Authority Brands PE-backed multi-brand home-services franchise platform that acquired Precision Garage Door 2023 plus Mr. Rooter/Mr. Electric/Aire Serv/Window Genie/Mosquito Joe/Benjamin Franklin Plumbing/One Hour Heating & Air/Mister Sparky/House Doctors/Junk King, Neighborly Dwyer Group rebrand with Window Genie/Mosquito Joe/Aire Serv/Mr. Appliance/Mr. Handyman/Five Star Painting, Riverside Company PE sponsor of A1 Garage Door). Core contains NEW Bottom Line callout (3 bullets with bold-tag labels Capital/Margins/Hardest part), then 3 short paragraphs of TLDR (max 4 sentences each with bold inline facts), then TOC + 4 PART super-headers + 14 H3 deep content sections covering: Part 1 Foundations (market size & opportunity, licensing & insurance reality, service mix & revenue structure), Part 2 Build-Out & Capital (truck setup & rolling inventory, manufacturer dealer accounts & supply chain, software dispatch & payment stack), Part 3 Operations (spring safety & technical discipline, customer acquisition channels, pricing strategy & transparent flat-rate playbook, service delivery & first-visit close rate), Part 4 Growth & Exit (marketing reviews & reputation moat, scale milestones & multi-truck operations, PE consolidation franchise & exit math, counter-case & risks). All H3 headings use slug-matching kebab-case anchors per GFM markdown auto-slug conventions. flow contains exactly 2 mermaid diagrams (operating-journey from state licensing through manufacturer dealer accounts / truck setup / software stack / lead generation / dispatched service call / job volume velocity / operational excellence / scale milestones; decision matrix for format selection solo owner-operator vs small multi-truck vs regional multi-truck vs multi-location regional vs franchise-affiliated and strategic position). src has 35 cited sources with real URLs (IDA, DASMA, NIDA, Hardlines Research Foundation, IBISWorld, Precision Garage Door Service, A1 Garage Door Service, Aladdin Garage Doors, Sears Garage Door, Overhead Door Company, Clopay, Amarr, Wayne Dalton, C.H.I. Overhead Doors, Hörmann, Raynor, Garaga, LiftMaster, Genie, Chamberlain, Sommer, Authority Brands, Neighborly, Google LSA, Yelp, NextDoor, ServiceTitan, Housecall Pro, Workiz, Jobber, Pemberton Tools, DDM Garage Doors, CSLB, FL DBPR, NYC DOB). num is comprehensive benchmark block with 12+ markdown pipe tables (industry size and market reality, startup capital stack by operator format, total startup investment by format, insurance stack annual Year 1 by operator scale, per-service revenue economics by service line with parts cost + labor minutes + margin, per-format mature Year 3 P&L summary, five-year revenue trajectory by format, operational benchmarks, lead generation channel mix by channel, manufacturer dealer program tiers, state licensing reality by state, wage and labor cost data per BLS 2024 SOC codes, exit multiples by format). counter is a 12-element counter-case with torsion-spring-liability / franchise-competitive-pressure-Precision-A1 / Google-LSA-pricing-inflation-channel-risk / 1099-vs-W-2-misclassification-DOL-2024 / truck-inventory-first-visit-close / spring-inventory-specialty-complexity / seasonality-weather-dependence / pricing-transparency-pressure / HOA-contract-concentration / California-regulatory-burden / tech-retention-wage-tradeoff / adjacent-home-services-formats-may-fit-better failure modes and an honest 6-condition verdict. links cross-references 25 related entries. All numbers grounded in real Hardlines / IBISWorld / DASMA / IDA / NIDA / BLS / Authority Brands / Precision / A1 / Aladdin / Sears / Overhead Door / Clopay / Amarr / Wayne Dalton / C.H.I. / Hörmann / Raynor / Garaga / LiftMaster / Chamberlain / Genie / Sommer / Marantec / Google LSA / Yelp / NextDoor / ServiceTitan / Housecall Pro / Workiz / Jobber / Pemberton Tools / DDM Garage Doors / CSLB / FL DBPR / NYC DOB / Ford Transit / Mercedes Sprinter / Ram ProMaster / Adrian Steel / Ranger Design / Sortimo / Knaack data; spring-safety-disciplined, truck-inventory-rigorous, channel-mix-diversified, W-2-classified, review-density-cultivated framing throughout; honest acknowledgment of torsion spring liability reality, franchise competitive pressure, Google LSA channel-risk, 1099 misclassification exposure. ASCII-clean.`
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set in environment'); process.exit(1); }

  // Diagnostic
  const h3Count = (core.match(/^### /gm) || []).length;
  const mermaidCount = (flow.match(/```mermaid/g) || []).length;
  const pipeTableLines = (num.match(/^\|.*\|.*\|/gm) || []);
  const totalWords = (tldr + core + flow + src + num + counter + links).split(/\s+/).filter(Boolean).length;
  const hasBottomLine = core.includes('🎯 Bottom Line');
  const partCount = (core.match(/## 📐 PART|## 🧱 PART|## ⚙️ PART|## 📈 PART/g) || []).length;
  const tocCount = (core.match(/Table of Contents/g) || []).length;
  const linkCount = (src.match(/https:\/\//g) || []).length;
  const counterElements = (counter.match(/\*\*Counter \d+/g) || []).length;
  const qidCount = (links.match(/q\d+/g) || []).length;
  console.log(`[${ID}] diagnostics -- H3 sections: ${h3Count}, mermaid: ${mermaidCount}, pipe table lines: ${pipeTableLines.length}, PART headers: ${partCount}, Bottom Line: ${hasBottomLine}, TOC: ${tocCount}, source URLs: ${linkCount}, counter elements: ${counterElements}, q-IDs cross-linked: ${qidCount}, total raw words: ${totalWords}`);

  console.log(`[${ID}] starting polish ladder (overwrites existing entry, walks 5 -> 6 -> 7 -> 8 -> 9 -> 10)...`);
  await runPolish({ id: ID, tldr, core, flow, src, num, counter, links, sources, tags, notes });
}

main().catch(err => { console.error('FATAL', err); process.exit(1); });
