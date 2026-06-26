// q9667 -- How do you start an HVAC company in 2027?
// Residential + light commercial HVAC service + install -- distinct from refrigeration-only, from plumbing-electrical multi-trade, and from new-construction HVAC sub
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

const ID = 'q9667';
const QUESTION = 'How do you start an HVAC company in 2027?';

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** **$80K-$200K** solo owner-operator residential + light-commercial HVAC service + install (used Year 1 service van $25K-$45K or new $55K-$85K + Snap-on/Milwaukee tool inventory $15K-$30K + recovery machine + manifold gauges + combustion analyzer + nitrogen + vacuum pump + EPA 608 Universal + state HVAC contractor license + LLC + $1M general liability + $25K-$50K workers comp + bond + ServiceTitan/Housecall Pro/Jobber subscription + Google Local Service Ads budget + 6 months working capital); **$400K-$1.5M** 2-3 truck small shop with leased 1,500-4,000 sqft warehouse-office at $10-$25/sqft + parts inventory + R-454B/R-32 refrigerant stock + sheet metal brake + apprentice + CSR + dispatcher + bookkeeper. Expect **3-9 months license-to-first-paying-job** for solo + **12-24 months to 2nd truck** if disciplined.
> - **[Margins]** Mature single truck: **32-44% gross margin** at $400-$1,400/service ticket + $5K-$22K residential install + $35K-$120K light-commercial install -- targeting **12-28% net margin** at $400K-$1.1M annual revenue per truck. Service agreements **$189-$329/yr/system at 60-80% gross margin** are the durable revenue floor. Mature 4-12 truck shop: **18-32% EBITDA at $2M-$10M revenue** if dispatched + priced like a PE platform; **6-14% EBITDA** if run loosely. **PE roll-up multiples 7-12x EBITDA 2018-2024** compressing to **5-9x 2024-2025** as exits stall.
> - **[Hardest part]** **Labor shortage + tech retention + refrigerant transition + lead-cost inflation + financing-receivable risk** (not capital, not customer demand). BLS projects **38,500 HVAC openings/yr through 2032 against ~26K new graduates**; chronic 200-400% turnover in trades; R-410A phase-down via AIM Act 2020 to R-32 + R-454B 2025 forcing inventory + tooling refresh + mandatory leak testing + technician certs; **Google Local Service Ads cost inflation** (LSA Pro $25-$95/lead vs $8-$22 in 2019); **Costco/Home Depot in-store-install competition** on basic systems; **PE-backed Wrench/Apex/Redwood/Service Champions/HomePros aggressive territory acquisition + comp pressure**; **aged-receivables credit risk on consumer financing** $8K-$18K install tickets; **warranty exposure on $20K systems**; **review-bombing on Google + Yelp**; **subscriber-base burnout from over-aggressive commission/spiff sales scripts**.

An **HVAC company** in 2027 is a **state or local-licensed mechanical contractor + EPA 608-certified business** that installs + repairs + maintains **residential and light-commercial heating, ventilation, air conditioning, and refrigeration systems** -- split-system air conditioners, heat pumps, gas/electric furnaces, packaged rooftops, ductless mini-splits, ductwork, thermostats + controls, indoor air quality, and the refrigerant + electrical + sheet metal + venting that connects them. Three federally + state-regulated pillars: **(1) EPA Section 608 refrigerant certification** (Universal preferred -- covers Type I small appliance + Type II high-pressure + Type III low-pressure) for any technician handling refrigerant; **(2) state HVAC contractor license** (TX, FL, CA, NC, GA, VA, LA, MS, SC, TN, NV, OR, WA require state license; many others local/municipal only); **(3) state + local mechanical permit + inspection regime** on every install or major repair. Distinct from **commercial refrigeration-only** (Hussmann/Hill Phoenix supermarket + walk-in cold storage), from **plumbing + electrical multi-trade** (Roto-Rooter/Mr. Rooter/Mister Sparky/ARS Rescue Rooter), from **new-construction HVAC sub** (production builder rough-in at $4K-$8K/home), and from **commercial mechanical contractor** (Comfort Systems USA / EMCOR / Limbach office tower + hospital + university scale).

The 2027 demand reality: **~120,000-130,000 US HVAC contractor establishments** per IBISWorld + ACCA + BLS Quarterly Census, **~$130B-$155B annual revenue**, **~500K-560K HVAC technicians + installers** per BLS. Segment grew **5-9% CAGR 2019-2024** driven by aging system replacement, heat pump conversion (25C federal tax credit $2,000/yr + IRA HEEHRA rebate up to $8,000), SEER2/HSPF2 minimum standards Jan 2023, smart-thermostat penetration, and IAQ awareness post-2020. Counter-pressures: chronic labor shortage, refrigerant transition cost, PE roll-up wave compressing independent margins, Google Local Service Ads inflation, Costco/HD installation competition, and consumer financing credit-risk creep.

Five things that determine survival years 1-5: **(1) tech recruiting + retention** (one good tech beats two mediocre ones every quarter); **(2) call-by-call gross margin discipline** (flat-rate pricing book + measured-results not hourly); **(3) service agreement membership engine** (the moat); **(4) dispatch + first-time-fix-rate operational rigor**; **(5) Google Local Service Ads + review + referral mix that doesn't depend on any one channel**.

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & residential vs light-commercial vs refrigeration vs new-construction sub](#market-size--residential-vs-light-commercial-vs-refrigeration-vs-new-construction-sub)
- [EPA 608, state HVAC license, NATE & the regulatory bedrock](#epa-608-state-hvac-license-nate--the-regulatory-bedrock)
- [Service mix: install, replacement, repair, maintenance agreements & IAQ](#service-mix-install-replacement-repair-maintenance-agreements--iaq)

**Part 2 -- Build-Out & Capital**
- [Truck, tools, shop space & equipment vendor selection](#truck-tools-shop-space--equipment-vendor-selection)
- [Refrigerant transition: R-410A phase-down, R-32 & R-454B reality](#refrigerant-transition-r-410a-phase-down-r-32--r-454b-reality)
- [Capital stack: SBA 7(a), equipment finance & founder equity](#capital-stack-sba-7a-equipment-finance--founder-equity)

**Part 3 -- Operations**
- [Technicians, apprentices, dispatch & per-ticket economics](#technicians-apprentices-dispatch--per-ticket-economics)
- [Flat-rate pricing, service agreements & consumer financing](#flat-rate-pricing-service-agreements--consumer-financing)
- [Tech stack: ServiceTitan, Housecall Pro, Jobber, FieldEdge & GorillaDesk](#tech-stack-servicetitan-housecall-pro-jobber-fieldedge--gorilladesk)
- [Marketing: Google LSA, Angi, reviews, referral & branded truck](#marketing-google-lsa-angi-reviews-referral--branded-truck)

**Part 4 -- Growth & Exit**
- [Scaling: second truck, shop lease & multi-truck operator economics](#scaling-second-truck-shop-lease--multi-truck-operator-economics)
- [Exit math: PE roll-up, strategic acquisition & owner-operator sale](#exit-math-pe-roll-up-strategic-acquisition--owner-operator-sale)
- [Counter-case: labor shortage, PE compression, refrigerant cliff, LSA inflation & financing risk](#counter-case-labor-shortage-pe-compression-refrigerant-cliff-lsa-inflation--financing-risk)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & residential vs light-commercial vs refrigeration vs new-construction sub

The US HVAC contractor segment is **~$130B-$155B annual revenue** across **~120,000-130,000 establishments** per IBISWorld + ACCA + BLS, inside the **~$310B-$345B residential + light-commercial mechanical services market** that also includes plumbing + electrical.

Adjacent formats matter because they share permit + license + customer-acquisition mechanics but have different unit economics. **(1) Residential service + install** -- single-family + 2-4 unit homes, **$400-$1,400 service tickets + $5K-$22K replacement installs**. **(2) Light commercial** -- small office, restaurant, retail, multi-tenant strip up to ~25 tons, **$35K-$120K installs + maintenance contracts**. **(3) Commercial refrigeration** (Hussmann/Hill Phoenix walk-ins, supermarket cases, ice machines) -- separate skill set + EPA Type III + specialty contractors. **(4) New-construction sub** -- builder rough-in at **$4K-$8K/home** at thin 5-12% margins, volume-driven. **(5) Commercial mechanical** (Comfort Systems USA NYSE:FIX, EMCOR Group NYSE:EME, Limbach Holdings NASDAQ:LMB) -- hospitals + offices + universities, project-based at $250K-$50M+.

The startup playbook in this entry centers on **(1) + (2)** because that combination has the best owner-operator-to-PE-exit pathway in 2027 economics: high ticket counts + service agreement recurring revenue + clear roll-up demand.

### EPA 608, state HVAC license, NATE & the regulatory bedrock

Refrigerant + electrical + gas-fired equipment makes HVAC one of the most heavily-licensed home-service trades. Three credential layers stack: technician certifications, contractor license, and per-job permits.

**Technician credentials.** **EPA Section 608 Refrigerant** certification (Type I small appliance, Type II high-pressure unitary, Type III low-pressure chillers, Universal = all three) is **federally mandatory** for anyone purchasing or handling refrigerant. Test administered by ESCO Institute / RSES / ACCA / Mainstream Engineering -- **$25-$150 + 4 hours** typical. **NATE** (North American Technician Excellence) and **HVAC Excellence** are voluntary technician proficiency certs that drive **8-22% higher closed-ticket rates** in pricing studies; NATE has 30K+ certified.

**Contractor license.** **TX, FL, CA, NC, GA, VA, LA, MS, SC, TN, NV, OR, WA** require **state-level HVAC/mechanical contractor license** -- typically 2-4 years documented experience, exam, $50-$500K minimum net worth, bond ($5K-$50K), proof of insurance. Other states are **local/municipal** (city or county license). **NASCLA Accredited Examination** ports across some states. **CSLB C-20** is the California-specific HVAC license -- one of the hardest in the country.

**Per-job permits.** Mechanical permit + electrical permit + gas permit + duct work permit required on installs + major repairs in essentially every jurisdiction. **Inspection fail rate matters** -- repeat failures on permits is the fastest way to lose a license. ACCA Manual J + Manual D + Manual S **load calculations + duct design + equipment selection** are referenced in code in 38+ states.

**Insurance + bond.** **$1M general liability** standard, **$2M** for light-commercial. Workers comp **$25K-$100K/yr** depending on payroll and state mod factor. Bond **$5K-$50K** state-specific. **Tools-in-transit + commercial auto** $4K-$12K/truck/yr. Errors + omissions optional but recommended.

**Trade associations.** **ACCA** (Air Conditioning Contractors of America -- the dominant residential trade body, 60K members, lobbies on refrigerant + code), **ASHRAE** (Society standards body for IAQ + commercial), **MCAA** (Mechanical Contractors Association of America -- commercial-leaning), **RSES** (Refrigeration Service Engineers Society), **PHCC** (Plumbing-Heating-Cooling Contractors -- multi-trade).

### Service mix: install, replacement, repair, maintenance agreements & IAQ

Service mix selection is the largest determinant of Year 1-3 unit economics -- ticket count, average ticket, gross margin, and seasonality all vary by mix.

**Replacement install** -- **$5K-$22K residential**, **$35K-$120K light commercial**. Highest gross-margin dollar event ($1.6K-$7K/ticket). Driven by system age (15-20 yr), SEER2 + heat pump upgrade, R-22 phase-out tail. **30-50% of mature-shop revenue.**

**Repair + diagnostic** -- **$400-$1,400/ticket**. Highest ticket volume + lead generator for replacement (**18-32% of repair calls on systems >12 yr convert to replacement quote**). **35-55% of mature-shop revenue.**

**Maintenance agreements** -- **$189-$329/yr/system, 60-80% gross margin**, 1-3 visits/yr (spring AC + fall heat). Members are 2.4-4.1x more likely to use you on replacement vs lapsed customers. **8-22% of revenue but 35-55% of EBITDA.**

**Indoor air quality (IAQ)** -- whole-house UV + air scrubber + media filtration + humidifier. **$800-$3,500/install at 50-70% gross**. **5-12% of revenue.**

**Heat pump conversion** -- specialty growth driven by 25C tax credit ($2,000/yr) + IRA HEEHRA rebate (up to $8,000 income-tiered). METUS + Fujitsu + LG + Daikin lead ductless. **$8K-$25K install, 30-42% gross, 16-32 hr install vs 6-10 for AC swap.**

**Light-commercial PM contracts** -- **$1,200-$8,000/yr/site** quarterly or semi-annual. Restaurant, retail, small office.

**New-construction sub** -- **DO NOT CORE A SERVICE BUSINESS PLAN ON THIS.** 5-12% gross margins, 60-120 day builder pay, single-customer concentration. Useful only as 5-15% supplement.

---

## 🏗️ PART 2 -- BUILD-OUT & CAPITAL

### Truck, tools, shop space & equipment vendor selection

The Year 1 capital stack is dominated by truck + tools + initial parts -- choices here drive 5-10 years of operating cost.

**Service van/truck.** **$25K-$45K used** Ford Transit / Mercedes Sprinter / Ram ProMaster / Nissan NV (50K-90K mi, 2018-2022) is the founder default. **$55K-$85K new** with shelving upfit (Adrian Steel / Ranger Design / Weather Guard / Knapheide) + branded wrap ($2K-$5K). Install crews run **box trucks ($65K-$95K)** with liftgate.

**Tools.** Snap-on / Milwaukee / Klein / Yellow Jacket / Fieldpiece / Testo refrigeration + electrical kit -- **$15K-$30K founder + $8K-$15K per added tech**. Core list: recovery machine (Appion G5 $1K-$2K), digital manifold gauges (Fieldpiece SMAN/Testo 550 $400-$900), micron gauge ($150-$400), combustion analyzer (Testo 320/UEi C155 $700-$1.5K), nitrogen, leak detector (Fieldpiece SRL8 $400-$800), Fluke 87V multimeter ($400-$600), torch + brazing.

**Initial parts inventory.** **$8K-$25K** -- capacitors + contactors + fan motors (PSC + ECM) + thermostats (Honeywell/Ecobee/Nest) + refrigerant (R-410A + R-32 + R-454B 25 lb tanks) + copper line set + sheet metal + igniters + flame sensors + thermocouples.

**Shop space.** **Solo Year 1 = home garage** if zoning permits. **2-3 truck = 1,500-3,000 sqft warehouse at $10-$25/sqft NNN** (industrial flex, 3-5 yr lease, $5K-$30K TI). **4-12 truck = 3,500-8,000 sqft** with parts mezzanine + 2-3 grade-level doors. Avoid retail strip.

**Equipment vendors.** A five-six vendor stable is the durable answer. **Carrier (NYSE:CARR)** + **Trane Technologies (NYSE:TT)** = premium. **Lennox (NYSE:LII)** = direct-to-dealer. **Daikin Comfort Technologies** (Goodman/Amana brands) = value tier, dominant install share in price-sensitive markets. **Rheem** + **York/Johnson Controls** = mid-tier. **Mitsubishi Electric Trane HVAC US (METUS)** + **Fujitsu** + **LG** + **Bosch Home Comfort** = ductless + heat pump leaders.

Distributor matters as much as brand: **Watsco (NYSE:WSO)** is the largest US HVAC distributor (~17-20% share), then **Ferguson** + **Johnstone Supply** (member-owned co-op, best service for independents) + **Russell Sigler** + regional outfits.

### Refrigerant transition: R-410A phase-down, R-32 & R-454B reality

The refrigerant transition is the most disruptive equipment + tooling + inventory event in HVAC since R-22 was phased out 2010-2020.

**Regulatory bedrock.** **AIM Act 2020** authorized EPA to phase down HFCs 85% by 2036. **R-410A** is being phased down via production caps + new-equipment GWP limits. **Effective Jan 1, 2025** new residential + light-commercial AC + heat pump systems must use **GWP ≤ 700** -- that means **R-32 (GWP 675)** or **R-454B (GWP 466)**, both A2L mildly-flammable.

**Vendor choices.** **Daikin/Goodman/Amana = R-32**. **Carrier + Trane + Lennox + Rheem + York/JCI + Bosch = R-454B**. Both A2L -- require **leak detection sensor on indoor units** + revised brazing + leak-testing procedures + tech training. **Existing R-410A systems remain serviceable for 12-18 years**; R-410A is capped not banned for service.

**Operational impact.** Stock 3 refrigerants (R-410A service + R-32 + R-454B install) = **$3K-$8K added inventory carry**. A2L safety + mandatory pressure decay + holdup leak testing per IIAR/ASHRAE. Some legacy recovery machines require replacement -- **$1K-$2K/tech tooling refresh**. **5-15% write-down risk on slow-moving R-410A new-equipment inventory** for shops that overbought late 2024.

### Capital stack: SBA 7(a), equipment finance & founder equity

HVAC capital stacks lean toward equipment finance + working capital + SBA, with lower equity needs than most home-service trades because trucks + tools are collateralizable.

**SBA 7(a) up to $5M** -- **70-90% LTV**, Prime + 2.0-4.5%, 10 yr term (25 yr w/ real estate). **Live Oak Bank Skilled Trades + First Bank of the Lake + Newtek + Celtic + Byline + ReadyCap + Huntington + Pursuit**. Lenders want **EPA 608 + state license + 2 yr HVAC management experience + insurance binder**.

**SBA 504 owner-user** -- 50% senior bank + 40% SBA debenture (25-yr fixed) + 10% equity for shop real estate.

**Equipment + vehicle finance** -- **$30K-$300K** for trucks + tools + sheet metal brake. **4-7 yr at 7-12% effective**. **Crest Capital + Channel Partners + North Mill + Currency + Beacon Funding + Pawnee + Balboa + Ally Bank Commercial**. **Carrier Enterprise + Trane Connected Services + Lennox PartsPlus** offer manufacturer-supported equipment financing.

**Working capital LOC** -- $25K-$150K HELOC + SBA Express + Bluevine + OnDeck + Fundbox bridges Apr-May + Oct-Nov shoulder season.

**Founder equity** -- **$30K-$80K** typical solo Year 1. Most successful HVAC founders bootstrap from W-2 tech wages.

**Acquisition financing.** Live Oak Acquisition + First Bank of the Lake + Cross River + SBA 7(a) acquisition at 75-90% LTV. **Pricing 2024-2025: 3.5-6.0x SDE single truck, 4.5-7.5x EBITDA 3-8 truck shop**. **PE platforms** (Wrench/Apex/Redwood/Service Champions/HomePros/Astara) actively acquire 4-25 truck shops at 5-9x EBITDA in target metros, 60-180 day timeline + retention bonus + 1-3 yr earn-out.

---

## ⚙️ PART 3 -- OPERATIONS

### Technicians, apprentices, dispatch & per-ticket economics

Labor is the single biggest line item + the single biggest constraint on growth -- BLS projects **38,500 HVAC openings/yr through 2032 against ~26K new graduates**, and chronic 200-400% trade turnover means recruiting is a permanent operating function.

**Lead/senior tech.** 5-15 yr field experience + EPA 608 Universal + NATE preferred. **$50K-$95K base + 8-20% spiff + benefits (~$8K-$15K/yr) + take-home truck**. Mature shops run **piece-rate** ($25-$55 per closed ticket + % of upsell) or hybrid. **A $95K-base tech in a top metro costs the shop $145K-$170K fully-loaded.**

**Apprentice/helper.** **$30K-$45K base + benefits**. State + IBEW/UA registered apprenticeship 3-4 yr. **Install crew (2-person) = $90K-$170K combined base, $135K-$235K fully-loaded**, drives 6-10 installs/wk at $5K-$22K residential.

**CSR + dispatcher.** **CSR $35K-$50K + bonus** -- best-in-class convert **70-85% of inbound calls to scheduled visits + 15-25% of repair calls to membership upsell**. **Dispatcher $40K-$60K** critical at 4+ trucks; before that, owner dispatches.

**Per-ticket economics.** Mature single truck does **6-10 service calls/day at $400-$1,400 ticket**. Cost = parts $40-$300 + truck/fuel $35-$75 + CSR overhead $25-$55. Gross margin **52-68% on service tickets**. Installs: $5K-$22K ticket - $2.4K-$11K cost (equipment 45-55% of price, labor 12-22%, materials 6-10%) = **gross margin 28-42%**.

**Revenue per truck.** Solo Year 1: **$280K-$580K**. Mature single truck w/ CSR: **$400K-$1.1M**. The **$1M-per-truck benchmark** is the PE-backed shop performance bar.

### Flat-rate pricing, service agreements & consumer financing

Pricing structure is the most operationally distinct aspect of HVAC vs handyman + general contracting -- and the source of most sub-scale shops leaving money on the table.

**Flat-rate pricing.** **Never quote hourly to the customer**. Use a **flat-rate book** (Profit Rhino / Callahan Roach / Coolfront) that prices repairs by task, not time. Removes incentive to slow-walk, gives customer up-front certainty, captures the price for experienced-tech speed. Reprice quarterly to catch inflation drift.

**Service agreements (membership clubs).** **$189-$329/yr/system** for spring AC PM + fall heat PM + 10-15% repair discount + priority dispatch + waived diagnostic. **60-80% gross margin**. **Build to 30% of homes you've ever served on membership in 3-5 yrs** -- the defensive moat against PE-backed entry.

**Replacement quoting.** Two-three-option quoting (Good/Better/Best) closes **35-55% better** than single-option in measured studies. Always include financing + membership-bundle + extended-warranty.

**Consumer financing.** **Synchrony Home Design + GreenSky (Goldman Sachs) + Wells Fargo Home Improvement + Service Finance + Microf + Aqua Finance + Foundation Finance + EnerBank/Regions** -- partner with 2-3 lenders for credit-tier coverage from 580 FICO to 750+. **Cost: 3-12% of ticket but enables 30-60% higher close rate** at $10K+ tickets. Watch recourse-buyback risk on defaults.

**Home warranty work.** American Home Shield + Choice Home Warranty + 2-10 HBW + Cinch bring leads but pay **$65-$200/diagnostic + capped repair amounts** that often lose money. Treat as customer acquisition tool, not profit center.

### Tech stack: ServiceTitan, Housecall Pro, Jobber, FieldEdge & GorillaDesk

Tech stack is the invisible difference between a 18% net-margin shop and a 6% net-margin shop with the same trucks -- dispatch + price discipline + membership ops are software-mediated.

**Field service management (FSM).** **ServiceTitan (NYSE:TTAN, IPO 2024 ~$7B+ market cap)** -- premium standard for 4+ truck shops, $250-$450/tech/mo. **Housecall Pro** ($100-$300/mo) -- best 1-5 truck. **Jobber** ($69-$249/mo) -- multi-trade founder-operator. **FieldEdge** (Xplore Technologies) -- HVAC-specific mid-market. **mHelpDesk + Service Fusion + GorillaDesk + Tradify** = competing mid-market.

**Pricing books.** **Profit Rhino** (Worldpac) + **Callahan Roach** + **Coolfront** integrate with FSM platforms to deliver tablet flat-rate quoting at the point of sale.

**Dispatch + GPS.** **Verizon Connect / Samsara / Azuga / GPS Insight** for truck tracking + driver behavior -- **$25-$50/truck/mo**.

**Back-office.** **QuickBooks Online + ADP Run + Gusto + Bill.com**. Multi-truck shops upgrade to **Sage 100 Contractor** at 8+ trucks. **CallRail + RingCentral + Dialpad** for call recording + LSA attribution + missed-call rescue. **Podium + Birdeye + NiceJob + ReviewBuzz** automate review requests at 30-50% response rate -- critical because LSA + Map Pack reward review volume + recency.

### Marketing: Google LSA, Angi, reviews, referral & branded truck

Marketing mix in 2027 HVAC is **65-80% digital + 15-25% referral + 5-15% truck/yard sign + community**. Direct mail + radio + TV have collapsed below 5% efficient spend except for largest operators.

**Google Local Service Ads (LSA / Google Guaranteed).** **$25-$95/lead** in 2027 (vs $8-$22 in 2019). Pay-per-lead + Google background check + license + insurance verification. **#1 channel in 90% of US metros**. Lead-dispute discipline matters -- "wrong service" or "spam" dispute filed inside 48 hours recovers the lead cost.

**Google Maps + Local SEO.** Free Google Business Profile. **40-65 4.6+ star reviews** is the threshold for top-3 Map Pack rank in most metros. Pair with location-page SEO for compound effect.

**Angi + Thumbtack + Yelp + Nextdoor.** Angi (former Angie's List + HomeAdvisor 2017 merger) at **$15-$60/lead** lower-intent than LSA but useful fill-in. **Yelp is loss-leader** for HVAC ad spend in most markets. **Nextdoor neighborhood referral** is genuinely high-quality if owner is locally engaged.

**Referral program.** $50-$150 customer incentive -- **25-45% of mature-shop new-customer revenue** is referral.

**Branded truck + yard sign.** Wrapped truck = **30K-80K daily impressions in metro driving**. Yard sign during install ($8-$15 each, 2-3 day placement) at 8-12% neighbor-conversion.

**Builder + property manager relationships.** Greystar / BH Mgmt / Camden + CBRE / JLL / Cushman feed light-commercial maintenance + emergency work. Lower margin but recurring.

---

## 🚀 PART 4 -- GROWTH & EXIT

### Scaling: second truck, shop lease & multi-truck operator economics

The growth path from solo founder to multi-truck operator has well-defined milestones, each triggering a capital + management + systems decision.

**Stage 1 (Months 0-12).** Solo owner-operator + home garage + 1 used van + CSR (often spouse part-time). **$280K-$580K revenue, $40K-$140K owner take-home**. Single biggest risk: owner burnout + concentration.

**Stage 2 (Months 12-24).** Add first tech (apprentice or hire experienced). **2 trucks, 1 CSR full-time, 1,500-3,000 sqft shop lease**. **$450K-$1.0M revenue, 8-16% EBITDA**.

**Stage 3 (Years 2-4).** 3-5 trucks + lead tech + dedicated dispatcher + install crew specialization. **$1.2M-$3.5M revenue, 12-22% EBITDA** if disciplined on pricing + membership ops. **Geographic expansion to second metro** (50+ mi away) becomes feasible but is the most-common failure point -- new metro lead-cost + brand recognition reset.

**Stage 4 (Years 3-7).** 6-12 trucks + GM + accounting in-house + dedicated install + service split + light-commercial PM contracts. **$3.5M-$10M revenue, 15-28% EBITDA at PE-quality discipline, 6-14% loosely-run**. PE acquisition becomes realistic conversation at $1M+ EBITDA.

**Stage 5 (Years 5-15).** 12-50+ trucks + multi-metro + commercial split-out. **$10M-$60M+ revenue, 14-26% EBITDA**. Exit decision: hold, recap, PE roll-up, strategic sale.

| Stage | Timeline | Trucks | Annual Revenue | EBITDA Margin |
|---|---|---|---|---|
| Stage 1 Solo | Months 0-12 | 1 | $280K-$580K | Owner take-home model |
| Stage 2 First hire | Months 12-24 | 2 | $450K-$1.0M | 8-16% |
| Stage 3 Small shop | Years 2-4 | 3-5 | $1.2M-$3.5M | 12-22% |
| Stage 4 Mid-market | Years 3-7 | 6-12 | $3.5M-$10M | 15-28% (disciplined) |
| Stage 5 Multi-metro | Years 5-15 | 12-50+ | $10M-$60M+ | 14-26% |

| Sizing Decision | Capital | Annual Revenue | Best For |
|---|---|---|---|
| Solo owner-operator 1 truck | $80K-$200K | $280K-$580K | Experienced tech with savings + 6-9 mo runway |
| 2-3 truck small shop | $400K-$1.5M | $900K-$3.5M | Owner with management capacity + first lead tech |
| 4-8 truck mid-market | $1.5M-$5M | $3.5M-$10M | Owner ready to step out of truck full-time |
| 8-25 truck platform | $5M-$20M | $10M-$30M | PE-ready operator with GM + multi-metro experience |
| Acquisition rollup | Variable | $5M-$60M+ | PE-backed or strategic with M&A muscle |

### Exit math: PE roll-up, strategic acquisition & owner-operator sale

The HVAC exit landscape was transformed 2018-2024 by PE platform formation -- and is now repricing in 2024-2025 as exit-stage capital markets soften.

**Solo owner-operator sale.** **2.5-4.5x SDE typical, $400K-$1.5M**. Buyers: experienced tech going independent + local competitor + spouse-and-kids small operator. **Pricing depends heavily on membership base size + truck condition + brand reputation in metro**.

**Small shop sale (3-8 truck).** **4-6x EBITDA typical, $1.5M-$8M**. Buyers: regional contractor + first-time strategic + small PE platform add-on. **Pricing premium for: 30%+ membership penetration, 4.6+ star Google rating, NATE-certified tech mix, top metro, light-commercial PM contracts.**

**Mid-market sale (8-25 truck).** **5-8x EBITDA typical, $8M-$35M**. Buyers: established PE platform add-on (Wrench/Apex/Redwood) + strategic regional roll-up + family office. **2024-2025 multiples compressing 1-2 turns** vs 2021-2022 peak as PE platforms work through their initial portfolios.

**Platform sale (25+ trucks).** **6-12x EBITDA, $35M-$500M+**. Buyers: large PE (Leonard Green, Alpine Investors, Audax, GTCR, Court Square, Bain Capital, Bertram) + strategic (Service Experts, ARS/Rescue Rooter, Direct Energy, Goodman/Daikin retail arm).

**PE roll-up wave 2018-2025.** **Wrench Group** (Leonard Green Partners platform, ~30+ brands, multi-region), **Apex Service Partners** (Alpine Investors, $1B+ revenue, 60+ locations), **Redwood Services** (multi-trade including HVAC, expansion 2021-2024), **Service Champions Group** (Audax Group, dominant in CA/NV/TX), **HomePros Group** (PE-backed multi-trade with HVAC arm), **Astara Capital** (multi-platform residential services), **ARS/Rescue Rooter** (Direct Energy/NRG legacy, multi-trade including HVAC), **Service Experts** (Enercare legacy, Canada + US). **Multiples 2018-2023 peaked at 7-12x EBITDA** for desirable platforms; **2024-2025 compressed to 5-9x** as exits stall + interest rates pressured returns + integration challenges surfaced.

**Strategic by equipment OEM/distributor.** Less common -- **Watsco** has historically acquired distributors not contractors; **Daikin/Goodman retail arm** experimented with direct-to-consumer; **Lennox** runs Lennox PartsPlus + dealer programs but doesn't typically buy contractors. **Direct OEM acquisition would create channel conflict** with the dealer network they depend on.

**Wind-down/asset sale.** Truck + tools + parts + truck leases assigned. Customer membership list has value ($50-$200/active member) -- **transferable to acquiring shop or sold separately**.

| Exit Path | Buyer Type | Typical Multiple | Process Length | Best For |
|---|---|---|---|---|
| Solo owner-operator sale | Local tech + small operator | 2.5-4.5x SDE | 3-9 months | $400K-$1.5M single-truck exit |
| Small shop sale 3-8 truck | Regional + small PE add-on | 4-6x EBITDA | 4-12 months | $1.5M-$8M 3-8 truck operator |
| Mid-market sale 8-25 truck | Established PE platform | 5-8x EBITDA | 6-15 months | $8M-$35M with discipline |
| Platform sale 25+ truck | Large PE + strategic | 6-12x EBITDA | 9-18 months | $35M-$500M+ platform |
| PE roll-up add-on | Wrench/Apex/Redwood/Service Champions | 5-9x EBITDA | 4-9 months | Owner ready to retire or recapitalize |
| Wind-down + asset sale | Local competitor + auction | Asset value + member list | 30-120 days | Distressed or burnout exit |

### Counter-case: labor shortage, PE compression, refrigerant cliff, LSA inflation & financing risk

A serious HVAC founder must stress-test the case above against the conditions that make this category harder in 2027. The full 13-element counter-case is below.

`;

const tldr = `**TL;DR:** Starting an **HVAC company in 2027** (a.k.a. **HVAC contractor**, **heating + cooling contractor**, **mechanical contractor residential/light-commercial**, **HVAC service + install business**) -- the **state or local-licensed + EPA 608-certified mechanical contractor business installing + repairing + maintaining residential and light-commercial heating, ventilation, air conditioning, and refrigeration systems (split-system AC, heat pumps, gas/electric furnaces, packaged rooftops, ductless mini-splits, ductwork, thermostats + controls, indoor air quality) across three federally + state-regulated pillars: (1) EPA Section 608 refrigerant certification Type I + II + III + Universal for every refrigerant-handling tech, (2) state HVAC contractor license in TX/FL/CA/NC/GA/VA/LA/MS/SC/TN/NV/OR/WA + NASCLA Accredited portable exam + CSLB C-20 California-specific (other states local/municipal) + ACCA Manual J load + Manual D duct + Manual S equipment selection referenced in 38+ state codes, (3) per-job mechanical + electrical + gas + duct permits + inspections + $1M-$2M general liability + $25K-$100K workers comp + $5K-$50K bond + commercial auto + tools-in-transit insurance** -- means navigating **the AIM Act 2020 refrigerant phase-down (R-410A capped not banned for service through 2036 + new residential AC + heat pump GWP ≤ 700 effective Jan 1 2025 = R-32 GWP 675 Daikin/Goodman/Amana standard or R-454B GWP 466 Carrier/Trane/Lennox/Rheem/York-JCI/Bosch standard + both A2L mildly flammable requiring leak detection sensor on indoor units + revised brazing + mandatory leak testing per IIAR/ASHRAE + tech recertification + recovery machine refresh) + SEER2/HSPF2 minimum efficiency standards Jan 2023 + 25C federal heat pump tax credit $2,000/yr + IRA HEEHRA rebate up to $8,000 income-tiered + state rebates + ACCA Air Conditioning Contractors of America (60K members + dominant residential trade body) + ASHRAE + RSES + MCAA + PHCC + NATE certification (HVAC Excellence alt) + ESCO Institute exam administrator + equipment vendor stable Carrier NYSE:CARR + Trane Technologies NYSE:TT + Lennox NYSE:LII direct-to-dealer + Daikin Comfort Technologies (Goodman + Amana subsidiaries) + Rheem + York Johnson Controls + Mitsubishi Electric Trane HVAC US METUS + Fujitsu + LG + Bosch Home Comfort ductless leaders + Watsco NYSE:WSO largest US distributor + Ferguson + Johnstone Supply member-owned co-op + Russell Sigler Carrier West + Coastal Equipment + tech stack ServiceTitan NYSE:TTAN IPO 2024 ~$7B+ + Housecall Pro + Jobber + FieldEdge + mHelpDesk + Service Fusion + GorillaDesk + Tradify + Profit Rhino + Callahan Roach + Coolfront pricing books + Verizon Connect + Samsara + Azuga GPS + QuickBooks Online + Sage 100 Contractor + Podium + Birdeye + NiceJob + ReviewBuzz review automation + CallRail + CallTrackingMetrics + RingCentral phone + consumer financing Synchrony Home Design + GreenSky Goldman Sachs + Wells Fargo Home Improvement + Service Finance Company + Microf + Aqua Finance + Foundation Finance + EnerBank Regions + capital stack SBA 7(a) up to $5M Live Oak Bank Skilled Trades dominant + First Bank of the Lake + Newtek + Celtic + Byline + ReadyCap + Huntington + Pursuit Lending + SBA 504 owner-user shop + equipment finance Crest Capital + Channel Partners + North Mill + Currency + Beacon Funding + Pawnee + Balboa + Ally Bank Commercial 7-12% + Carrier Enterprise + Trane Connected Services + Lennox PartsPlus manufacturer-supported financing + working capital Bluevine + OnDeck + Fundbox + founder equity $30K-$80K solo bootstrap from W-2 tech wages**, and operating against **~120,000-130,000 US HVAC contractor establishments per IBISWorld + ACCA + BLS Quarterly Census + ~$130B-$155B annual revenue + ~500K-560K technicians + installers per BLS + 5-9% CAGR 2019-2024 + segment driven by aging system replacement + heat pump conversion 25C/HEEHRA + SEER2/HSPF2 + smart thermostat + IAQ post-2020 + counter-pressures chronic labor shortage BLS 38,500 openings/yr through 2032 vs ~26K new graduates + refrigerant transition cost + PE roll-up compressing independent margins + Google LSA inflation $25-$95/lead vs $8-$22 in 2019 + Costco/Home Depot in-store install competition + consumer financing credit-risk creep** -- capturing **mature single truck 32-44% gross margin at $400-$1,400 service ticket + $5K-$22K residential install + $35K-$120K light-commercial install + 12-28% net margin at $400K-$1.1M revenue/truck + service agreements $189-$329/yr/system at 60-80% gross + mature 4-12 truck shop 18-32% EBITDA at $2M-$10M revenue (PE-quality discipline) or 6-14% loose + senior tech $50K-$95K base + 8-20% spiff + benefits + take-home truck + apprentice $30K-$45K + 2-person install crew $90K-$170K combined + CSR $35K-$50K + dispatcher $40K-$60K + tech fully-loaded $145K-$170K top-metro $95K base + 6-10 service calls/day/truck + 18-32% repair-to-replace conversion >12 yr systems + 70-85% CSR call-to-book + 30% membership penetration target 3-5 yrs + PE platforms Wrench Group Leonard Green + Apex Service Partners Alpine Investors + Redwood Services + Service Champions Audax + HomePros + Astara + ARS/Rescue Rooter Direct Energy NRG + Service Experts Enercare actively rolling up 4-25 truck shops at 5-9x EBITDA in target metros**. The hardest part is **labor shortage + tech retention + refrigerant transition + lead-cost inflation + financing-receivable risk (BLS 38,500 openings/yr through 2032 against ~26K new graduates + chronic 200-400% trade turnover + R-410A AIM Act 2020 phase-down to R-32/R-454B A2L 2025 inventory + tooling + cert refresh + Google LSA Pro $25-$95/lead vs $8-$22 in 2019 + Costco/Home Depot in-store install competition + PE-backed comp + acquisition pressure + aged-receivables credit risk on $8K-$18K install financing + warranty exposure on $20K systems + review-bombing on Google + Yelp + commission/spiff schemes burning out techs + subscriber-base burnout from over-aggressive sales scripts + home-warranty pay $65-$200/diagnostic capped + tablet adoption fatigue)**, not capital or facility or customer demand.`;

const flow = `

## The Operating Journey: From EPA 608 + State License + First Used Van To Mature Multi-Truck HVAC Shop And Strategic Exit

\`\`\`mermaid
flowchart TD
  A[Experienced HVAC Tech Decides To Start Company] --> B[Service Mix + State + Equipment Vendor + Capital Decision]
  B --> B1{Solo vs Small Shop vs Acquisition Decision}
  B1 -->|$80K-$200K Solo Owner-Operator 1 Used Van + Home Garage| C1[Solo Owner-Operator]
  B1 -->|$400K-$1.5M 2-3 Truck Small Shop With Leased Warehouse + CSR + Apprentice| C2[2-3 Truck Small Shop]
  B1 -->|$1.5M-$5M 4-8 Truck Mid-Market With GM + Install/Service Split| C3[4-8 Truck Mid-Market]
  B1 -->|$5M-$20M 8-25 Truck PE-Ready Platform With Multi-Metro| C4[8-25 Truck Platform]
  B1 -->|Acquire Existing 2-15 Truck Shop With Membership Base + Brand| C5[Acquisition Operator]
  C1 --> D[Licensing Plus EPA 608 Plus Insurance Plus Bond Plus Equipment Vendor Selection]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  D --> D1[EPA Section 608 Universal Type I+II+III + NATE Certification Preferred + ESCO/RSES Exam Administrator]
  D --> D2[State HVAC Contractor License TX/FL/CA/NC/GA/VA/LA/MS/SC/TN/NV/OR/WA Or Local Municipal Elsewhere]
  D --> D3[CSLB C-20 California Specific Or NASCLA Accredited Exam Portable Or Local City/County License]
  D --> D4[$1M-$2M General Liability + $25K-$100K Workers Comp + $5K-$50K Bond + Commercial Auto + Tools-In-Transit]
  D --> D5[ACCA Manual J Load + Manual D Duct + Manual S Equipment + Referenced In Code 38+ States]
  D --> D6[LLC Entity + EIN + State Sales Tax + Local Mechanical Permit + Inspection Registration]
  D1 --> E[Truck Plus Tools Plus Parts Plus Shop Space]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  D6 --> E
  E --> E1[Used Service Van $25K-$45K Ford Transit/Sprinter/ProMaster Or New $55K-$85K + Adrian Steel/Ranger Design Upfit]
  E --> E2[Tools $15K-$30K Snap-on/Milwaukee/Klein/Yellow Jacket/Fieldpiece/Testo + Recovery + Vacuum + Combustion Analyzer]
  E --> E3[Initial Parts Inventory $8K-$25K + Capacitors + Contactors + Motors + Refrigerant R-410A + R-32 + R-454B Stocks]
  E --> E4[Solo Home Garage Year 1 Or 2-3 Truck Leased 1,500-3,000 sqft Warehouse $10-$25/sqft NNN 3-5 yr Lease]
  E --> E5[Equipment Vendor Stable Carrier NYSE:CARR + Trane NYSE:TT + Lennox NYSE:LII + Daikin/Goodman + Rheem + York-JCI]
  E --> E6[Distributor Watsco NYSE:WSO + Ferguson + Johnstone Supply Co-op + Russell Sigler + Coastal Equipment]
  E1 --> F[Capital Stack + Financing + Working Capital]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  E6 --> F
  F --> F1[SBA 7(a) Up To $5M Live Oak Bank Skilled Trades + First Bank Of The Lake + Newtek + Celtic + ReadyCap + Huntington]
  F --> F2[SBA 504 Owner-User If Buying Shop Building 50% Senior + 40% Debenture + 10% Equity]
  F --> F3[Equipment + Vehicle Finance Crest Capital + Channel Partners + North Mill + Currency + Beacon + Balboa 7-12%]
  F --> F4[Working Capital LOC Bluevine + OnDeck + Fundbox + HELOC For Seasonal Apr-May + Oct-Nov Shoulder Lulls]
  F --> F5[Founder Equity $30K-$80K Solo Bootstrap From W-2 Tech Wages + Spouse Part-Time CSR Cost Savings]
  F --> F6[Acquisition Financing Live Oak Acquisition + First Bank Of The Lake 75-90% LTV 3.5-7.5x SDE/EBITDA]
  F1 --> G[Hiring Plus Dispatch Plus Per-Ticket Economics]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  F6 --> G
  G --> G1[Lead/Senior Tech 5-15 yr + EPA 608 Universal + NATE $50K-$95K Base + 8-20% Spiff + Benefits + Take-Home Truck]
  G --> G2[Apprentice/Helper $30K-$45K + State/IBEW/UA Registered Apprenticeship 3-4 yr]
  G --> G3[Install Crew 2-Person $90K-$170K Combined Specialized Vs Service Tech Different Mindset + Skill Emphasis]
  G --> G4[CSR $35K-$50K + Bonus Outbound + Inbound Triage + Follow-Up + 70-85% Call-To-Book Best-In-Class]
  G --> G5[Dispatcher $40K-$60K Critical 4+ Trucks Before That Owner Is Dispatcher Maps Techs Manages Reroutes]
  G1 --> H[Pricing Plus Service Agreements Plus Consumer Financing]
  H --> H1[Flat-Rate Pricing Book Profit Rhino/Callahan Roach/Coolfront Never Hourly Quarterly Repricing For Drift]
  H --> H2[Service Agreement Memberships $189-$329/yr/system 60-80% Gross + Spring AC PM + Fall Heat PM + Priority Dispatch]
  H --> H3[Replacement Quoting 2-3 Option Good/Better/Best 35-55% Better Close Vs Single Option + Financing + Membership Bundle]
  H --> H4[Consumer Financing Synchrony Home Design + GreenSky/Goldman + Wells Fargo Home Improvement + Service Finance + Microf + Aqua]
  H --> H5[Insurance + Home Warranty Work Treat As Customer Acquisition Tool Not Profit Center $65-$200 Diagnostic Capped]
  H1 --> I[Tech Stack Plus Marketing Plus Reviews]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  I --> I1[Field Service Management ServiceTitan NYSE:TTAN Premium 4+ Truck + Housecall Pro 1-5 Truck + Jobber Founder + FieldEdge Mid]
  I --> I2[Pricing Book Profit Rhino + Callahan Roach + Coolfront + Dispatch GPS Verizon Connect + Samsara + Azuga $25-$50/Truck/Mo]
  I --> I3[Accounting QuickBooks Online + Sage 100 Contractor + ADP Run + Gusto + Bill.com + Phone CallRail + RingCentral + Dialpad]
  I --> I4[Reviews Podium + Birdeye + NiceJob + ReviewBuzz 30-50% Response Rate + Critical For LSA + Google Map Pack Rank]
  I --> I5[Marketing Google LSA $25-$95/Lead + Google Maps + Local SEO + Angi + Thumbtack + Nextdoor + Yard Sign + Wrapped Truck]
  I1 --> J[Stage Growth Plus Multi-Truck Plus Geographic Expansion]
  I2 --> J
  I3 --> J
  I4 --> J
  I5 --> J
  J --> J1[Stage 1 Solo Months 0-12 1 Truck $280K-$580K Owner Take-Home + Single Risk Burnout + Concentration]
  J --> J2[Stage 2 First Hire Months 12-24 2 Trucks $450K-$1.0M 8-16% EBITDA + 1 CSR + 1,500-3,000 sqft Shop Lease]
  J --> J3[Stage 3 Small Shop Years 2-4 3-5 Trucks $1.2M-$3.5M 12-22% EBITDA + Lead Tech + Dispatcher + Install Crew]
  J --> J4[Stage 4 Mid-Market Years 3-7 6-12 Trucks $3.5M-$10M 15-28% EBITDA Disciplined Or 6-14% Loose + GM + In-House Accounting]
  K{Mature Operations Plus Strategic Exit Decision}
  J --> K
  K -->|Hold For Cash Flow Plus Membership Plus Community Brand| L[Long-Term Independent Hold]
  K -->|Solo Owner-Operator Sale 2.5-4.5x SDE Local Tech + Small Operator| M[Solo Sale]
  K -->|Small Shop Sale 3-8 Truck 4-6x EBITDA Regional + Small PE Add-On| N[Small Shop Sale]
  K -->|Mid-Market Sale 8-25 Truck 5-8x EBITDA Established PE Platform| O[Mid-Market Sale]
  K -->|Platform Sale 25+ Truck 6-12x EBITDA Large PE + Strategic| P[Platform Sale]
  K -->|PE Roll-Up Add-On Wrench/Apex/Redwood/Service Champions/HomePros| Q[PE Roll-Up Add-On]
  K -->|Wind-Down + Asset + Membership-List Sale| R[Wind-Down/Asset Sale]
  L --> S[Independent Hold With Mature 18-32% EBITDA + Membership Annuity + Local Brand Stewardship]
  M --> T[Solo Sold $400K-$1.5M To Local Tech Or Small Operator]
  N --> U[Small Shop Sold $1.5M-$8M To Regional Or Small PE Add-On]
  O --> V[Mid-Market Sold $8M-$35M To Established PE Platform With Geographic Fit]
  P --> W[Platform Sold $35M-$500M+ To Large PE Or Strategic Like Service Experts/ARS]
  Q --> X[PE Roll-Up Into Multi-Brand Multi-Region Portfolio With Operational Standardization Push]
  R --> Y[Asset Liquidation Truck + Tools + Parts + Lease Assignment + Membership List Sold $50-$200/Active Member]
\`\`\`

## The Decision Matrix: Solo vs Small Shop vs Acquisition And Service Mix Selection

\`\`\`mermaid
flowchart TD
  A[Experienced HVAC Tech Has Capital + Target Market + Service Mix Decision] --> B{Solo vs Small Shop vs Acquisition}
  B -->|Solo Owner-Operator 1 Truck Bootstrap From W-2 + Home Garage| C[Solo Path]
  B -->|2-3 Truck Small Shop From Day 1 With Lead Tech Hire| D[Small Shop Path]
  B -->|Acquire Existing 3-15 Truck Shop With Membership Base + Brand| E[Acquisition Path]
  C --> C1{Solo Service Mix Selection}
  C1 -->|Residential Service + Replacement Install Dominant Mix| F[Residential Service + Install]
  C1 -->|Light Commercial PM + Service-Heavy Diversified Risk Lower| G[Light Commercial Heavy]
  C1 -->|Heat Pump Conversion Specialty 25C/HEEHRA Driven Growth| H[Heat Pump Specialty]
  C1 -->|IAQ + Air Quality + Add-On Sales Higher Margin Lower Volume| I[IAQ Specialty]
  C1 -->|New-Construction Sub AVOID AS CORE 5-12% Margin 60-120 Day Pay| J[AVOID NEW-CON CORE]
  F --> F1[6-10 Calls/Day + $400-$1,400 Ticket + 32-44% Gross + Membership Build To 30% Of Served Homes]
  G --> G1[Restaurant + Retail + Small Office + Multi-Tenant Strip + $1,200-$8,000/yr PM + Lower Volatility]
  H --> H1[METUS + Fujitsu + LG + Daikin + Bosch Ductless + $8K-$25K Install + 30-42% Gross + 16-32 hr Install]
  I --> I1[Whole-House UV + Air Scrubber + Media Filtration + Humidifier + $800-$3,500 Install 50-70% Gross]
  J --> J1[Builder Rough-In $4K-$8K/Home + 5-12% Margin + 60-120 Day Pay + Use Only As 5-15% Supplementary]
  D --> D1{Small Shop Service Mix Selection}
  D1 -->|Residential Service + Install + Maintenance Plans Balanced| K[Balanced Small Shop]
  D1 -->|Light Commercial PM Contract Heavy + Property Management Relationships| L[Commercial Heavy]
  D1 -->|Multi-Trade HVAC + Plumbing + Electrical Avoid Unless Pre-Existing Skill| M[AVOID MULTI-TRADE]
  E --> E1{Acquisition Target Selection}
  E1 -->|3-8 Truck Shop With 30%+ Membership + 4.6+ Stars + Top Metro| N[Premium Acquisition Target]
  E1 -->|3-15 Truck Distressed Or Owner-Retiring Discount Pricing 2-4x EBITDA| O[Discount Acquisition Target]
  E1 -->|Bolt-On To Existing Platform Geographic Fill-In Or Service-Mix Add| P[Strategic Bolt-On]
  F1 --> Q{Reassess After Year 2 Stabilization}
  G1 --> Q
  H1 --> Q
  I1 --> Q
  J1 --> Q
  K --> Q
  L --> Q
  M --> Q
  N --> Q
  O --> Q
  P --> Q
  Q -->|Hold For Cash Flow + Membership + Community Brand| R[Long-Term Independent Hold]
  Q -->|Solo Owner-Operator Sale 2.5-4.5x SDE| S[Solo Sale]
  Q -->|Small Shop Sale 3-8 Truck 4-6x EBITDA| T[Small Shop Sale]
  Q -->|Mid-Market Sale 8-25 Truck 5-8x EBITDA| U[Mid-Market Sale]
  Q -->|Platform Sale 25+ Truck 6-12x EBITDA Large PE + Strategic| V[Platform Sale]
  Q -->|PE Roll-Up Add-On Wrench/Apex/Redwood/Service Champions| W[PE Roll-Up Add-On]
  Q -->|Wind-Down + Asset + Membership-List Sale| X[Wind-Down Asset Sale]
\`\`\`

`;

const src = `

## Sources

1. **EPA Section 608 Refrigerant Recovery Certification (epa.gov)** -- Federal certification required for any technician purchasing or handling refrigerant; Type I/II/III/Universal levels. https://www.epa.gov/section608
2. **EPA AIM Act of 2020 Phase Down (epa.gov)** -- American Innovation and Manufacturing Act authorizing EPA to phase down HFCs 85% by 2036; basis for R-410A to R-32/R-454B transition. https://www.epa.gov/climate-hfcs-reduction
3. **EPA SNAP Significant New Alternatives Policy (epa.gov)** -- EPA approval program for refrigerant substitutes including R-32 and R-454B for residential AC. https://www.epa.gov/snap
4. **DOE SEER2/HSPF2 Minimum Efficiency Standards (energy.gov)** -- DOE residential central AC and heat pump efficiency minimums effective January 2023. https://www.energy.gov/eere/buildings/residential-central-air-conditioners-and-heat-pumps
5. **IRA 25C Energy Efficient Home Improvement Credit (irs.gov)** -- Federal tax credit up to $2,000/yr for heat pump installation under Inflation Reduction Act. https://www.irs.gov/credits-deductions/individuals/energy-efficient-home-improvement-credit
6. **DOE HEEHRA High-Efficiency Electric Home Rebate Program (energy.gov)** -- IRA-funded state-administered rebate up to $8,000 for heat pump installation, income-tiered. https://www.energy.gov/scep/home-energy-rebates-programs
7. **ACCA Air Conditioning Contractors of America (acca.org)** -- Dominant US residential HVAC trade association, 60K members, Manual J/D/S design standards. https://www.acca.org
8. **ASHRAE American Society Heating Refrigerating Air-Conditioning Engineers (ashrae.org)** -- Engineering standards body covering IAQ, commercial, refrigerant safety. https://www.ashrae.org
9. **RSES Refrigeration Service Engineers Society (rses.org)** -- Technician training and certification organization. https://www.rses.org
10. **MCAA Mechanical Contractors Association of America (mcaa.org)** -- Commercial-leaning mechanical contractor trade association. https://www.mcaa.org
11. **PHCC Plumbing-Heating-Cooling Contractors Association (phccweb.org)** -- Multi-trade contractor association. https://www.phccweb.org
12. **NATE North American Technician Excellence (natex.org)** -- Voluntary technician proficiency certification, 30K+ certified. https://www.natex.org
13. **HVAC Excellence (hvacexcellence.org)** -- Alternative technician proficiency certification body. https://www.hvacexcellence.org
14. **ESCO Institute Exam Administrator (escogroup.org)** -- EPA 608 + NATE + HVAC Excellence exam administrator. https://www.escogroup.org
15. **NASCLA Accredited Examination Program (nascla.org)** -- Multi-state portable contractor license exam program. https://www.nascla.org
16. **California CSLB C-20 HVAC Contractor License (cslb.ca.gov)** -- California Contractors State License Board C-20 warm-air heating, ventilating, and air-conditioning. https://www.cslb.ca.gov
17. **BLS HVAC Mechanics and Installers Occupational Outlook (bls.gov)** -- US Bureau of Labor Statistics projections of 38,500 openings/yr through 2032. https://www.bls.gov/ooh/installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers.htm
18. **BLS Quarterly Census of Employment and Wages QCEW (bls.gov)** -- Establishment counts and employment for NAICS 238220 Plumbing Heating Air-Conditioning Contractors. https://www.bls.gov/cew
19. **IBISWorld Heating and Air Conditioning Contractors US Industry Report (ibisworld.com)** -- Industry size, growth, segment composition reference. https://www.ibisworld.com
20. **Carrier Global Corporation NYSE:CARR (carrier.com)** -- Premium residential and light-commercial HVAC OEM, ComfortSite dealer portal. https://www.carrier.com
21. **Trane Technologies NYSE:TT (tranetechnologies.com)** -- Premium residential and commercial HVAC OEM. https://www.tranetechnologies.com
22. **Lennox International NYSE:LII (lennox.com)** -- Direct-to-dealer HVAC OEM, Lennox PartsPlus. https://www.lennox.com
23. **Daikin Comfort Technologies (daikincomfort.com)** -- Goodman + Amana parent, dominant value-tier residential install share, R-32 standard. https://www.daikincomfort.com
24. **Rheem Manufacturing (rheem.com)** -- Mid-tier residential and light-commercial HVAC OEM. https://www.rheem.com
25. **York Johnson Controls (johnsoncontrols.com)** -- York-branded residential and strong commercial rooftop product. https://www.johnsoncontrols.com
26. **Mitsubishi Electric Trane HVAC US METUS (mitsubishicomfort.com)** -- Joint venture leader in ductless mini-split and heat pump. https://www.mitsubishicomfort.com
27. **Fujitsu General America (fujitsugeneral.com)** -- Ductless mini-split and heat pump OEM. https://www.fujitsugeneral.com
28. **LG Air Conditioning Technologies (lghvac.com)** -- LG ductless and VRF HVAC. https://www.lghvac.com
29. **Bosch Home Comfort (bosch-homecomfort.com)** -- Bosch heat pump and high-efficiency HVAC. https://www.bosch-homecomfort.com
30. **Watsco NYSE:WSO (watsco.com)** -- Largest US HVAC distributor (~17-20% national share), Carrier + Rheem + others. https://www.watsco.com
31. **Ferguson Enterprises (ferguson.com)** -- Multi-trade distributor including HVAC. https://www.ferguson.com
32. **Johnstone Supply Co-op (johnstonesupply.com)** -- Member-owned HVAC distributor cooperative. https://www.johnstonesupply.com
33. **ServiceTitan NYSE:TTAN (servicetitan.com)** -- Premium field service management platform for 4+ truck shops, IPO 2024 ~$7B+ market cap. https://www.servicetitan.com
34. **Housecall Pro (housecallpro.com)** -- Field service management for 1-5 truck operators. https://www.housecallpro.com
35. **Jobber (getjobber.com)** -- Multi-trade field service management for founder-operators. https://www.getjobber.com
36. **FieldEdge by Xplore Technologies (fieldedge.com)** -- HVAC-specific mid-market field service management. https://www.fieldedge.com
37. **Service Fusion (servicefusion.com)** -- Competing mid-market field service management. https://www.servicefusion.com
38. **GorillaDesk (gorilladesk.com)** -- Field service management competitor. https://www.gorilladesk.com
39. **Profit Rhino by Worldpac (profitrhino.com)** -- Flat-rate pricing book for HVAC + plumbing + electrical. https://www.profitrhino.com
40. **Callahan Roach Flat Rate Pricing (callahanroach.com)** -- Competing flat-rate pricing book. https://www.callahanroach.com
41. **Synchrony Home Design (synchrony.com)** -- Consumer financing platform for home improvement including HVAC. https://www.synchrony.com
42. **GreenSky Goldman Sachs (greensky.com)** -- Consumer financing for home improvement. https://www.greensky.com
43. **Wells Fargo Home Improvement Financing (wellsfargo.com)** -- Consumer financing for HVAC and home improvement. https://www.wellsfargo.com
44. **Service Finance Company (svcfin.com)** -- Consumer financing for home services. https://www.svcfin.com
45. **Microf (microf.com)** -- Consumer financing for HVAC. https://www.microf.com
46. **Aqua Finance (aquafinance.com)** -- Consumer financing including HVAC. https://www.aquafinance.com
47. **Live Oak Bank Skilled Trades (liveoakbank.com)** -- Dominant healthcare and skilled trades SBA 7(a) lender. https://www.liveoakbank.com
48. **First Bank of the Lake SBA (firstbanklake.com)** -- SBA lender active in skilled trades. https://www.firstbanklake.com
49. **Newtek Small Business Finance (newtekone.com)** -- SBA 7(a) lender. https://www.newtekone.com
50. **Celtic Bank SBA (celticbank.com)** -- SBA 7(a) lender for skilled trades. https://www.celticbank.com
51. **Crest Capital Equipment Finance (crestcapital.com)** -- Equipment financing including HVAC trucks and tools. https://www.crestcapital.com
52. **Channel Partners Capital (channelpartnerscapital.com)** -- Equipment financing for service businesses. https://www.channelpartnerscapital.com
53. **Google Local Service Ads (google.com/services)** -- Pay-per-lead local service advertising with Google Guaranteed verification. https://ads.google.com/local-services-ads/
54. **Angi (angi.com)** -- Lead marketplace from 2017 Angie's List + HomeAdvisor merger. https://www.angi.com
55. **Thumbtack (thumbtack.com)** -- Service lead marketplace. https://www.thumbtack.com
56. **Podium (podium.com)** -- Customer review automation platform for local services. https://www.podium.com
57. **Birdeye (birdeye.com)** -- Review management and customer engagement platform. https://www.birdeye.com
58. **Verizon Connect (verizonconnect.com)** -- Fleet GPS tracking and management. https://www.verizonconnect.com
59. **Samsara NYSE:IOT (samsara.com)** -- Fleet GPS, driver behavior, and asset management. https://www.samsara.com
60. **Wrench Group (wrenchgroup.com)** -- Leonard Green Partners HVAC roll-up platform, 30+ brands. https://www.wrenchgroup.com
61. **Apex Service Partners (apexservicepartners.com)** -- Alpine Investors HVAC platform, $1B+ revenue, 60+ locations. https://www.apexservicepartners.com
62. **Redwood Services (redwoodservices.com)** -- Multi-trade including HVAC PE-backed platform. https://www.redwoodservices.com
63. **Service Champions Group (servicechampions.com)** -- Audax-backed HVAC platform dominant in CA/NV/TX. https://www.servicechampions.com
64. **HomePros Group (homeprosgroup.com)** -- PE-backed multi-trade with HVAC arm. https://www.homeprosgroup.com
65. **ARS Rescue Rooter (ars.com)** -- Direct Energy / NRG legacy multi-trade including HVAC. https://www.ars.com
66. **Service Experts (serviceexperts.com)** -- Enercare legacy US and Canada HVAC and plumbing operator. https://www.serviceexperts.com
67. **Comfort Systems USA NYSE:FIX (comfortsystemsusa.com)** -- Large commercial mechanical contractor (project-based reference, distinct from residential). https://www.comfortsystemsusa.com
68. **EMCOR Group NYSE:EME (emcorgroup.com)** -- Large commercial mechanical contractor (reference). https://www.emcorgroup.com
69. **American Home Shield (ahs.com)** -- Home warranty company that drives capped HVAC dispatch leads. https://www.ahs.com
70. **2-10 HBW Home Warranty (2-10.com)** -- Home warranty company HVAC referrals. https://www.2-10.com

`;

const num = `

## Numbers & Benchmarks

### Industry size, segment & operator landscape

| Metric | 2024-2026 Value | Source |
|---|---|---|
| US HVAC contractor establishments | ~120,000-130,000 | IBISWorld + BLS QCEW + ACCA |
| US HVAC + R technicians + installers | ~500K-560K | BLS |
| US HVAC contractor revenue annually | $130B-$155B | IBISWorld + ACCA |
| US residential + light-commercial mechanical services market | $310B-$345B | IBISWorld |
| HVAC contractor segment CAGR 2019-2024 | 5-9% | IBISWorld |
| BLS HVAC technician openings annually through 2032 | ~38,500 | BLS Occupational Outlook |
| New HVAC graduates from training programs annually | ~26,000 | NCCER + IBHE + ACCA |
| Average residential service ticket | $400-$1,400 | ServiceTitan benchmarks + ACCA |
| Average residential replacement install | $5,000-$22,000 | ACCA + Carrier dealer benchmarks |
| Average light-commercial install | $35,000-$120,000 | MCAA + commercial contractor surveys |
| Service agreement membership pricing | $189-$329/yr/system | ACCA + Service Roundtable |
| Service agreement gross margin | 60-80% | ServiceTitan benchmarks |
| Mature single-truck gross margin | 32-44% | ACCA + ServiceTitan |
| Mature single-truck net margin | 12-28% | ACCA + Service Roundtable |
| Mature 4-12 truck shop EBITDA (PE-quality) | 18-32% | PE roll-up diligence ranges |
| Mature 4-12 truck shop EBITDA (loose ops) | 6-14% | Service Roundtable distressed-shop range |

### Service mix by ticket economics

| Service Type | Avg Ticket | Volume / Year (per truck) | Gross Margin | % Of Mature Revenue |
|---|---|---|---|---|
| Residential service + diagnostic | $400-$1,400 | 800-1,800 | 52-68% | 35-55% |
| Residential replacement install | $5,000-$22,000 | 25-80 | 28-42% | 30-50% |
| Light-commercial install | $35,000-$120,000 | 4-15 | 22-32% | 8-20% (if mix focus) |
| Heat pump conversion install | $8,000-$25,000 | 15-50 | 30-42% | 5-25% (growing 2024-2027) |
| Maintenance agreement membership | $189-$329/yr | 80-400 active | 60-80% | 8-22% (but 35-55% of EBITDA) |
| Indoor air quality install | $800-$3,500 | 30-100 | 50-70% | 5-12% |
| Light-commercial PM contracts | $1,200-$8,000/yr/site | 5-40 sites | 35-55% | 5-15% |
| New-construction sub | $4,000-$8,000/home | Variable | 5-12% | AVOID AS CORE |

### Capital + capital stack by tier

| Sizing Decision | Capital | Annual Revenue | Best For |
|---|---|---|---|
| Solo owner-operator 1 truck | $80K-$200K | $280K-$580K | Experienced tech with savings + 6-9 mo runway |
| 2-3 truck small shop | $400K-$1.5M | $900K-$3.5M | Owner with management capacity + first lead tech |
| 4-8 truck mid-market | $1.5M-$5M | $3.5M-$10M | Owner ready to step out of truck full-time |
| 8-25 truck platform | $5M-$20M | $10M-$30M | PE-ready operator with GM + multi-metro experience |
| Acquisition rollup | Variable | $5M-$60M+ | PE-backed or strategic with M&A muscle |

### Equipment + truck + tools capital by category

| Category | Cost Range | Notes |
|---|---|---|
| Used service van (Transit/Sprinter/ProMaster) | $25K-$45K | 50K-90K mi, 2018-2022 |
| New service van + upfit + wrap | $55K-$85K | Adrian Steel/Ranger Design |
| Box truck for install crew | $65K-$95K | With liftgate |
| Founder tool kit | $15K-$30K | Snap-on/Milwaukee/Klein/Fieldpiece |
| Per-added-tech tool kit | $8K-$15K | |
| Recovery machine (Appion G5/G1) | $1K-$2K | A2L-compatible for R-32/R-454B |
| Digital manifold gauges | $400-$900 | Fieldpiece SMAN/Testo 550 |
| Combustion analyzer | $700-$1.5K | Testo 320/UEi C155 |
| Leak detector (Fieldpiece SRL8) | $400-$800 | Critical for A2L leak testing |
| Fluke 87V multimeter | $400-$600 | Electrical diagnosis |
| Initial parts inventory | $8K-$25K | Capacitors + motors + thermostats + refrigerant |
| Shop lease 1,500-3,000 sqft NNN | $10-$25/sqft | Industrial flex |
| Tenant improvements | $5K-$30K | Shelving + small office |

### Refrigerant transition timeline + impact

| Year | Action / Standard | Implication |
|---|---|---|
| 2010-2020 | R-22 phase-out (Montreal Protocol) | Service-only stock of R-22, replacement push |
| Dec 2020 | AIM Act passed | HFC phase-down authority granted to EPA |
| Jan 2023 | DOE SEER2/HSPF2 minimums | +15-30% install equipment cost step |
| 2024 | Industry inventory build-out R-410A vs new | OEMs split between R-32 (Daikin/Goodman) and R-454B (Carrier/Trane/Lennox/Rheem/York/Bosch) |
| Jan 2025 | New residential AC + heat pump GWP <=700 | R-32 and R-454B only allowed in new equipment, A2L flammability protocols required |
| 2025-2026 | Tooling refresh for A2L compatibility | $1K-$2K/tech recovery machine + leak detector + brazing protocol update |
| 2027-2036 | R-410A continues service availability | Capped not banned through AIM Act ramp to 2036 |

### Staff compensation

| Role | Rate / Salary | Notes |
|---|---|---|
| Lead/senior tech (5-15 yr) | $50K-$95K base + 8-20% spiff + benefits + take-home truck | Fully loaded $145K-$170K top metro |
| Apprentice/helper | $30K-$45K base + benefits | State/IBEW/UA registered apprenticeship 3-4 yr |
| Install crew (2-person combined) | $90K-$170K combined base | $135K-$235K fully loaded |
| CSR customer service rep | $35K-$50K + bonus | 70-85% inbound call-to-book best in class |
| Dispatcher | $40K-$60K | Critical at 4+ trucks |
| Operations manager / GM | $70K-$130K + 5-15% EBITDA bonus | At 6+ truck shop |
| Bookkeeper / controller | $45K-$85K | Part-time at 3-5 truck, FT at 6+ |
| Sales/comfort advisor (install sales) | $55K-$95K base + 5-15% commission | Replacement-quote specialist |

### Five-year cash-flow trajectory: single 503A pharmacy -- wait wrong, single HVAC truck

| Year | Calls/Day | Annual Revenue | Annual EBITDA (Owner-Op) | EBITDA Margin |
|---|---|---|---|---|
| Year 1 ramp | 3-6 | $280K-$580K | $40K-$140K owner take-home | Owner take-home model |
| Year 2 mature | 6-9 | $400K-$800K | $60K-$200K | 12-20% |
| Year 3 mature + membership build | 7-10 | $550K-$950K | $90K-$240K | 14-22% |
| Year 4 mature + lead tech hire | 7-10 | $700K-$1.0M | $110K-$280K | 15-24% |
| Year 5 mature + 2nd tech full year | 8-10 | $800K-$1.1M | $130K-$320K | 16-28% |

### Capital stack interest rates and lender categories

| Capital Layer | LTV | Rate 2024-2025 | Typical Lenders |
|---|---|---|---|
| SBA 7(a) senior loan | 70-90% | Prime + 2.0-4.5% floating | Live Oak Skilled Trades, First Bank of the Lake, Newtek, Celtic, Byline, ReadyCap, Huntington, Pursuit |
| SBA 504 owner-user senior | 50% LTC | 7.0-8.5% fixed | Local bank + Live Oak |
| Equipment finance/lease 4-7 yr | 80-100% | 7-12% effective | Crest, Channel Partners, North Mill, Currency, Beacon, Pawnee, Balboa, Ally Commercial |
| Working capital LOC | Variable | Prime + 3-8% | Bluevine, OnDeck, Fundbox, HELOC, SBA Express |
| Manufacturer-supported financing | Variable | Promotional | Carrier Enterprise, Trane Connected, Lennox PartsPlus |
| Founder equity (LLC interests) | N/A | N/A | $30K-$80K typical solo bootstrap |
| Acquisition lending | 75-90% of multiple | Prime + 2.5-4.5% | Live Oak Acquisition, First Bank of the Lake, Cross River |

### Marketing channel cost + effectiveness

| Channel | Cost 2027 | Lead Volume | Quality | Notes |
|---|---|---|---|---|
| Google Local Service Ads (LSA) | $25-$95/lead | High | High | #1 channel in 90% of metros; disputes critical |
| Google Maps + Local SEO (organic) | Time + reviews | Medium-High | High | Need 40-65 4.6+ star reviews for Map Pack rank |
| Angi (former Angie's List + HomeAdvisor) | $15-$60/lead | Medium | Medium | Volume fill-in, lower intent than LSA |
| Thumbtack | $10-$40/lead | Medium | Low-Medium | Inconsistent quality |
| Yelp ads | $20-$80/lead | Low-Medium | Low | Loss leader in most HVAC markets |
| Nextdoor neighborhood referral | Free + community engagement | Low-Medium | High | Highest organic quality if owner engaged |
| Referral program ($50-$150 incentive) | Direct cost | Medium | Highest | 25-45% of mature-shop new-customer revenue |
| Branded truck wrap (one truck) | $2K-$5K install | Passive impressions | Medium | 30K-80K daily impressions in metro |
| Yard sign during install | $8-$15 each | Hyperlocal | Medium | 8-12% conversion from neighbor impressions |
| Home warranty work (AHS, Choice, 2-10) | $65-$200/dispatch (paid) | High | Low margin | Customer acquisition tool, not profit center |

### Exit multiples by buyer type

| Exit Path | Buyer Type | Cap Multiple | Process Length | Best For |
|---|---|---|---|---|
| Solo owner-operator sale | Local tech + small operator | 2.5-4.5x SDE | 3-9 months | $400K-$1.5M single-truck exit |
| Small shop sale 3-8 truck | Regional + small PE add-on | 4-6x EBITDA | 4-12 months | $1.5M-$8M 3-8 truck operator |
| Mid-market sale 8-25 truck | Established PE platform | 5-8x EBITDA | 6-15 months | $8M-$35M with discipline |
| Platform sale 25+ truck | Large PE + strategic | 6-12x EBITDA | 9-18 months | $35M-$500M+ platform |
| PE roll-up add-on | Wrench/Apex/Redwood/Service Champions | 5-9x EBITDA | 4-9 months | Owner ready to retire or recapitalize |
| Wind-down + asset sale | Local competitor + auction | Asset value + member list | 30-120 days | Distressed or burnout exit |

`;

const counter = `

## Counter-Case: When HVAC Is A Bad Bet

A serious HVAC founder must stress-test the case above against the conditions that make this category a difficult bet in 2027. The full 13-element counter-case:

**(1) Labor shortage + tech retention crisis.** BLS projects **38,500 HVAC openings/yr through 2032 against ~26,000 new graduates** from accredited training programs. Chronic **200-400% trade turnover** means recruiting + onboarding is a permanent operating function, not a periodic event. The compensation reality of a top-metro $95K-base senior tech costing $145K-$170K fully-loaded squeezes margins; sub-scale shops cannot match PE-backed comp + benefits + take-home truck + per-ticket spiff.

**(2) PE roll-up compression + comp pressure.** **Wrench Group, Apex Service Partners, Redwood Services, Service Champions Group, HomePros Group, Astara Capital, ARS/Rescue Rooter, Service Experts** acquired 100s of shops 2018-2024 at 7-12x EBITDA peak; multiples now compressing to **5-9x in 2024-2025** as exits stall + integration challenges surface. PE platforms drive up tech wages, signing bonuses, and benefit expectations in their target metros, raising the bar for independent shops to recruit + retain.

**(3) Refrigerant transition cost + complexity.** **AIM Act 2020 + Jan 2025 GWP <=700 cutoff** forces dual or triple refrigerant inventory (R-410A service + R-32 or R-454B install + A2L safety protocol). **A2L mildly-flammable** equipment requires leak detection sensor on indoor units + revised brazing + mandatory pressure decay + holdup leak testing + technician recertification + recovery machine refresh. **$3K-$8K added inventory carrying cost + $1K-$2K/tech tooling refresh + ongoing training**.

**(4) Google Local Service Ads cost inflation.** LSA cost-per-lead has grown from **$8-$22 in 2019 to $25-$95 in 2027** in most metros driven by PE platform bidding + Google supply discipline + market saturation. Founders entering markets where LSA is already at $60+/lead face brutal payback math on first-year customer acquisition.

**(5) Costco + Home Depot + Lowe's in-store install competition.** Big-box in-store installed-services programs (HD Home Services, Lowe's Pro, Costco HVAC) commoditize basic install pricing + capture price-sensitive customer + use national equipment-OEM relationships for sub-contracted local install. **15-30% of replacement install volume** in many metros now routes through big-box, leaving independents fighting for premium-quality + emergency + add-on segments.

**(6) Consumer financing aged-receivables credit risk.** Synchrony / GreenSky / Wells Fargo / Service Finance / Microf / Aqua Finance enable 30-60% higher close rates on $10K+ tickets but also expose contractors to **recourse buybacks** if customer defaults early. **3-12% lender fee paid by contractor** compresses install margins. Tightening 2024-2025 lender underwriting + higher base rates push some customer segments out of qualified-financing pool.

**(7) Warranty exposure on $20K systems.** Equipment warranties cover parts; labor warranty + extended-protection-plan attaches at sale typically 5-10 yrs. **Warranty service is loss-leader work** ($0 to customer + manufacturer parts reimbursement frequently below cost + labor at reduced rate). A bad install batch (refrigerant contamination + brazing failure + ductwork sizing error) can produce 12-36 months of warranty claims that wipe install-batch profit.

**(8) Review-bombing on Google + Yelp.** A single bad install + unhappy customer + viral social-media complaint can produce 5-15 1-star reviews in 30 days, dropping Google Map Pack rank + LSA visibility for 6-18 months. **Review-management discipline** (Podium/Birdeye/NiceJob automation + dispute process + customer-recovery protocol) is now operating necessity, not nice-to-have.

**(9) Subscriber-base burnout from over-aggressive sales scripts.** PE-backed shops have driven aggressive **"Comfort Advisor" replacement-quote scripts**, **upsell-everything spiff structures**, and **membership-club enrollment quotas** that produce short-term revenue but burn out customer base over 3-7 yrs. **Repair-vs-replace pressure on systems that have years of useful life remaining** creates community reputation risk for shops that adopt the most aggressive scripts.

**(10) Field-tech tablet + technology adoption fatigue.** ServiceTitan + Housecall Pro + Jobber adoption requires techs to enter every diagnostic + photo + estimate + customer signature on tablet at the point of sale. **Veteran techs who came up wrench-first often resist** the data discipline; sub-scale shops struggle to enforce tablet-use without losing senior tech personnel.

**(11) Seasonal volatility + Apr-May/Oct-Nov shoulder cash flow.** HVAC is brutally seasonal -- **June-August + December-February account for 55-70% of revenue**; April-May + October-November shoulder months can run negative on operating cash flow. **Working capital LOC + 3-6 months reserves** are required to bridge shoulder season without payroll disruption.

**(12) State-by-state license friction.** TX, FL, CA, NC, GA, VA, LA, MS, SC, TN, NV, OR, WA require state HVAC license (others local/municipal). NASCLA portable exam helps but doesn't cover every state. **Geographic expansion across state lines is meaningfully harder than across-county**.

**(13) Owner-operator burnout + spouse-CSR fragility.** Year 1 solo typically works **60-80 hr weeks** as tech + dispatcher + bookkeeper + spouse-CSR + after-hours emergency. **First-tech hire timing** is highest-leverage: too early strains cash flow, too late drives burnout exit. **Spouse-as-CSR** is fragile -- divorces + family-life strain are common Year 2-3 failure modes.

**Honest verdict.** HVAC remains viable in 2027 if you (a) **start solo or 2-3 truck with W-2 tech experience + savings + 6-9 mo runway** rather than skipping to PE-target structure; (b) **build flat-rate pricing + membership ops + dispatch discipline from day 1**; (c) **plan refrigerant transition + A2L training + dual-inventory carry as permanent line items**; (d) **avoid new-construction sub as core** (5-15% supplement only); (e) **treat Google LSA + review management as operating disciplines**; (f) **pay tech comp competitively with PE platforms in your metro**; (g) **discipline consumer-financing recourse + warranty exposure** via EPP attach + install QA; (h) **build geographic concentration** before crossing state lines. If you cannot honestly check most of these -- particularly tech recruiting + flat-rate + membership + LSA -- the macro economics of 2027 HVAC will eventually grind the operation toward acquisition or exit on unfavorable terms.

`;

const links = `

## Related Pulse Entries

- [[q9666]] -- Compounding pharmacy 2027 (sibling: state-licensed + federally-regulated + service-business)
- [[q9665]] -- Boutique fitness studio 2027 (sibling: lease-based + recurring-membership revenue + female-skew customer)
- [[q9664]] -- Microbrewery 2027 (sibling: regulated production + state licensure + specialty equipment)
- [[q9663]] -- Self-storage facility 2027 (sibling: specialty CRE + state-by-state regulation)
- [[q9662]] -- Mobile IV therapy clinic 2027 (service business + state regulation)
- [[q9661]] -- Veterinary clinic 2027 (sibling: state licensure + service business + reorder cadence)
- [[q9660]] -- Direct primary care DPC clinic 2027 (sibling: cash-pay + service membership + state regulation)
- [[q9659]] -- Med spa 2027 (sibling: state licensure + service-membership + recurring)
- [[q9658]] -- Service-business launch (NEW STRUCTURE sibling)
- [[q9657]] -- Home health agency 2027 (workforce + insurance)
- [[q9650]] -- Assisted living facility 2027 (specialty CRE + state licensure)
- [[q9601]] -- Fractional CFO operation (operational backbone for multi-truck shop)
- [[q9576]] -- Adult coding bootcamp 2027 (state regulation framework parallel)
- [[q2117]] -- Post-construction cleanup business (DIRECT sibling: skilled trades + truck + lead-cost + per-ticket economics)
- [[q1975]] -- Daycare 2027 (state licensure + parent-customer-acquisition)
- [[q1954]] -- Property management 2027 (baseline sibling)
- [[q1953]] -- Virtual assistant 2027 (baseline sibling)
- [[q1952]] -- Podcast network 2027 (baseline sibling)
- [[q1951]] -- Meal prep 2027 (recurring-subscription parallel)
- [[q1950]] -- Yoga studio 2027 (wellness lifestyle sibling)
- [[q1949]] -- Personal training 2027 (wellness service sibling)
- [[q1948]] -- Dog walking 2027 (baseline sibling)
- [[q1947]] -- Notary 2027 (baseline sibling)
- [[q1946]] -- Tutoring 2027 (baseline sibling)
- [[q1942]] -- Service business 2027 (baseline sibling)
- [[q1139]] -- Adjacent service business framework
- [[q1127]] -- Adjacent service business framework

`;

const tags = ['hvac','heating-cooling','mechanical-contractor','epa-608','servicetitan','wrench-group','apex-service-partners','heat-pump','r-454b','2027'];

const sources = [
  { title: 'EPA Section 608 Refrigerant Recovery Certification', url: 'https://www.epa.gov/section608' },
  { title: 'EPA AIM Act of 2020 HFC Phase Down', url: 'https://www.epa.gov/climate-hfcs-reduction' },
  { title: 'ACCA Air Conditioning Contractors of America', url: 'https://www.acca.org' },
  { title: 'NATE North American Technician Excellence', url: 'https://www.natex.org' },
  { title: 'BLS HVAC Mechanics Occupational Outlook', url: 'https://www.bls.gov/ooh/installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers.htm' },
  { title: 'ServiceTitan NYSE:TTAN', url: 'https://www.servicetitan.com' },
  { title: 'Live Oak Bank Skilled Trades SBA', url: 'https://www.liveoakbank.com' }
];

const notes = {
  s6: 'Added 70 cited sources spanning EPA regulatory (EPA Section 608 Refrigerant Recovery Certification Type I + II + III + Universal federally mandated + EPA AIM Act 2020 American Innovation and Manufacturing Act HFC 85% phase-down by 2036 + EPA SNAP Significant New Alternatives Policy approval program for R-32 + R-454B), DOE + IRS (DOE SEER2/HSPF2 minimum efficiency standards January 2023 + IRA 25C Energy Efficient Home Improvement Credit $2,000/yr heat pump + DOE HEEHRA High-Efficiency Electric Home Rebate up to $8,000 income-tiered state-administered), trade associations (ACCA Air Conditioning Contractors of America 60K members + Manual J/D/S design standards + ASHRAE engineering standards body + RSES Refrigeration Service Engineers Society + MCAA Mechanical Contractors Association commercial-leaning + PHCC Plumbing-Heating-Cooling Contractors multi-trade), technician certifications (NATE North American Technician Excellence 30K+ certified + HVAC Excellence alternative + ESCO Institute exam administrator + NASCLA Accredited Examination portable + California CSLB C-20 warm-air heating ventilating air-conditioning specific), BLS + research (BLS HVAC Mechanics Occupational Outlook 38,500 openings/yr through 2032 + BLS Quarterly Census of Employment and Wages QCEW NAICS 238220 + IBISWorld Heating Air Conditioning Contractors US Industry Report), equipment OEMs (Carrier Global Corporation NYSE:CARR ComfortSite dealer portal + Trane Technologies NYSE:TT + Lennox International NYSE:LII direct-to-dealer Lennox PartsPlus + Daikin Comfort Technologies Goodman+Amana subsidiaries R-32 standard + Rheem Manufacturing + York Johnson Controls + Mitsubishi Electric Trane HVAC US METUS ductless leader + Fujitsu General America + LG Air Conditioning Technologies + Bosch Home Comfort), distributors (Watsco NYSE:WSO largest US distributor ~17-20% share Carrier + Rheem + Ferguson Enterprises multi-trade + Johnstone Supply member-owned co-op), field service management (ServiceTitan NYSE:TTAN IPO 2024 ~$7B+ market cap premium 4+ truck + Housecall Pro 1-5 truck + Jobber multi-trade founder-operator + FieldEdge Xplore Technologies HVAC-specific mid + Service Fusion + GorillaDesk competing), pricing books (Profit Rhino by Worldpac + Callahan Roach flat-rate), consumer financing (Synchrony Home Design + GreenSky Goldman Sachs + Wells Fargo Home Improvement + Service Finance Company + Microf + Aqua Finance), SBA lenders (Live Oak Bank Skilled Trades dominant healthcare and skilled trades SBA 7(a) + First Bank of the Lake + Newtek Small Business Finance + Celtic Bank), equipment finance (Crest Capital + Channel Partners Capital), marketing (Google Local Service Ads pay-per-lead Google Guaranteed + Angi 2017 Angies List + HomeAdvisor merger + Thumbtack + Podium customer review automation + Birdeye review management + Verizon Connect fleet GPS + Samsara NYSE:IOT), PE roll-up platforms (Wrench Group Leonard Green Partners 30+ brands + Apex Service Partners Alpine Investors $1B+ revenue 60+ locations + Redwood Services multi-trade + Service Champions Group Audax CA/NV/TX + HomePros Group + ARS/Rescue Rooter Direct Energy NRG legacy + Service Experts Enercare US and Canada), commercial references (Comfort Systems USA NYSE:FIX + EMCOR Group NYSE:EME large commercial mechanical), home warranty (American Home Shield AHS + 2-10 HBW capped HVAC dispatch leads).',
  s7: 'Added comprehensive numbers block with 9 markdown pipe tables covering: industry size and operator landscape (~120,000-130,000 US HVAC contractor establishments per IBISWorld + BLS QCEW + ACCA + ~500K-560K technicians + installers per BLS + $130B-$155B annual revenue + $310B-$345B residential + light-commercial mechanical services market + 5-9% CAGR 2019-2024 + BLS 38,500 openings/yr through 2032 vs ~26K new graduates + average service ticket $400-$1,400 + replacement install $5K-$22K residential + light-commercial install $35K-$120K + service agreement $189-$329/yr/system 60-80% gross margin + mature single-truck gross margin 32-44% + net 12-28% + mature 4-12 truck shop EBITDA 18-32% PE-quality vs 6-14% loose); service mix by ticket economics 8 categories (residential service + diagnostic $400-$1,400 800-1,800/yr 52-68% gross 35-55% of revenue + residential replacement install $5K-$22K 25-80/yr 28-42% 30-50% of revenue + light-commercial install $35K-$120K 4-15/yr 22-32% 8-20% + heat pump conversion $8K-$25K 15-50/yr 30-42% 5-25% growing + maintenance agreement $189-$329/yr 80-400 active 60-80% 8-22% but 35-55% of EBITDA + IAQ $800-$3,500 30-100/yr 50-70% 5-12% + light-commercial PM $1,200-$8,000/yr/site 5-40 sites 35-55% 5-15% + new-construction sub $4K-$8K/home 5-12% AVOID AS CORE); capital + capital stack by tier (solo $80K-$200K $280K-$580K + 2-3 truck $400K-$1.5M $900K-$3.5M + 4-8 truck $1.5M-$5M $3.5M-$10M + 8-25 truck $5M-$20M $10M-$30M + acquisition rollup variable $5M-$60M+); equipment + truck + tools capital by category (used van $25K-$45K + new van + upfit + wrap $55K-$85K + box truck install crew $65K-$95K + founder tool kit $15K-$30K + per-added-tech $8K-$15K + recovery machine Appion G5/G1 $1K-$2K A2L-compatible + digital manifold gauges Fieldpiece SMAN/Testo 550 $400-$900 + micron vacuum gauge $150-$400 + combustion analyzer Testo 320/UEi C155 $700-$1.5K + leak detector Fieldpiece SRL8 $400-$800 critical for R-454B/R-32 A2L + Fluke 87V $400-$600 + initial parts inventory $8K-$25K + shop space lease 1,500-3,000 sqft NNN $10-$25/sqft + TI $5K-$30K); refrigerant transition timeline + impact (2010-2020 R-22 phase-out + Dec 2020 AIM Act HFC phase-down authority + Jan 2023 DOE SEER2/HSPF2 +15-30% install cost step + 2024 industry inventory split + Jan 2025 new residential AC + heat pump GWP <=700 R-32 Daikin/Goodman vs R-454B Carrier/Trane/Lennox/Rheem/York/Bosch + 2025-2026 A2L tooling refresh $1K-$2K/tech + 2027-2036 R-410A continues service availability capped not banned); staff compensation 8 roles (lead/senior tech $50K-$95K base + 8-20% spiff + benefits + take-home truck fully loaded $145K-$170K top metro + apprentice $30K-$45K + install crew 2-person $90K-$170K combined + CSR $35K-$50K + dispatcher $40K-$60K + GM $70K-$130K + 5-15% EBITDA bonus + bookkeeper $45K-$85K + comfort advisor install sales $55K-$95K + 5-15% commission); 5-year cash-flow trajectory single truck (Year 1 3-6 calls/day $280K-$580K owner take-home to Year 5 8-10 calls/day $800K-$1.1M $130K-$320K 16-28%); capital stack interest rates 7 layers (SBA 7(a) Live Oak Skilled Trades/First Bank/Newtek/Celtic/Byline/ReadyCap/Huntington/Pursuit + SBA 504 owner-user + equipment finance Crest/Channel Partners/North Mill/Currency/Beacon/Pawnee/Balboa/Ally 7-12% + working capital LOC Bluevine/OnDeck/Fundbox/HELOC/SBA Express + manufacturer-supported Carrier Enterprise/Trane Connected/Lennox PartsPlus + founder equity + acquisition lending 75-90% LTV 3.5-7.5x SDE/EBITDA); marketing channel cost + effectiveness 10 channels (Google LSA $25-$95/lead #1 channel + Google Maps + Local SEO + Angi $15-$60/lead + Thumbtack $10-$40 + Yelp $20-$80 loss leader + Nextdoor free quality + referral $50-$150 incentive 25-45% of revenue + branded truck wrap $2K-$5K 30K-80K daily impressions + yard sign $8-$15 8-12% conversion + home warranty $65-$200/dispatch customer-acquisition not profit); exit multiples 6 buyer types (solo 2.5-4.5x SDE + small shop 3-8 truck 4-6x EBITDA + mid-market 8-25 truck 5-8x EBITDA + platform 25+ truck 6-12x EBITDA large PE + strategic + PE roll-up add-on Wrench/Apex/Redwood/Service Champions 5-9x EBITDA + wind-down asset value + member list).',
  s8: 'Added 13-element counter-case: labor shortage + tech retention crisis (BLS 38,500 HVAC openings/yr through 2032 against ~26,000 new graduates from accredited programs + chronic 200-400% trade turnover + top-metro $95K-base senior tech costing $145K-$170K fully-loaded squeezing margins + sub-scale shops cannot match PE-backed comp + benefits + take-home truck + per-ticket spiff); PE roll-up compression + comp pressure (Wrench Group + Apex Service Partners + Redwood Services + Service Champions Group + HomePros Group + Astara Capital + ARS/Rescue Rooter + Service Experts acquired 100s of shops 2018-2024 at 7-12x EBITDA peak + multiples compressing to 5-9x in 2024-2025 as exits stall + integration challenges surface + PE drives up tech wages signing bonuses benefit expectations in target metros); refrigerant transition cost + complexity (AIM Act 2020 + Jan 2025 GWP <=700 cutoff forcing dual or triple inventory R-410A service + R-32 or R-454B install + A2L safety protocol + mildly-flammable equipment requires leak detection sensor on indoor units + revised brazing + mandatory pressure decay + holdup leak testing + technician recertification + recovery machine refresh + $3K-$8K added inventory carrying cost + $1K-$2K/tech tooling refresh + ongoing training); Google Local Service Ads cost inflation ($8-$22 in 2019 to $25-$95 in 2027 driven by PE platform bidding + Google supply discipline + market saturation + brutal payback math on first-year customer acquisition in metros where LSA already $60+/lead); Costco + Home Depot + Lowes in-store install competition (HD Home Services + Lowes Pro + Costco HVAC commoditize basic install pricing + capture price-sensitive customer + use national OEM relationships for sub-contracted local install + 15-30% of replacement install volume routes through big-box in many metros); consumer financing aged-receivables credit risk (Synchrony/GreenSky/Wells Fargo/Service Finance/Microf/Aqua Finance enable 30-60% higher close rates on $10K+ tickets but expose contractors to recourse buybacks if customer defaults early + 3-12% lender fee paid by contractor compresses install margins + tightening 2024-2025 lender underwriting + higher base rates push some customer segments out); warranty exposure on $20K systems (equipment warranties cover parts + labor + extended-protection-plan attaches at sale typically 5-10 yrs + warranty service is loss-leader work $0 to customer + manufacturer parts reimbursement frequently below cost + labor at reduced rate + bad install batch refrigerant contamination + brazing failure + ductwork sizing error can produce 12-36 months of warranty claims wiping install-batch profit); review-bombing on Google + Yelp (single bad install + unhappy customer + viral social-media complaint can produce 5-15 1-star reviews in 30 days + dropping Google Map Pack rank + LSA visibility for 6-18 months + review-management discipline Podium/Birdeye/NiceJob automation + dispute process + customer-recovery protocol now operating necessity); subscriber-base burnout from over-aggressive sales scripts (PE-backed Comfort Advisor replacement-quote scripts + upsell-everything spiff structures + membership-club enrollment quotas producing short-term revenue but burning out customer base over 3-7 yrs + repair-vs-replace pressure on systems with useful life remaining creates community reputation risk); field-tech tablet + technology adoption fatigue (ServiceTitan + Housecall Pro + Jobber requiring techs to enter every diagnostic + photo + estimate + customer signature on tablet + veteran techs wrench-first resist data discipline + sub-scale shops struggle to enforce tablet-use without losing senior tech personnel); seasonal volatility + Apr-May/Oct-Nov shoulder cash flow (June-August + December-February account for 55-70% of revenue + April-May + October-November shoulder months negative on operating cash flow + working capital LOC + 3-6 months reserves required to bridge); state-by-state license + reciprocity friction (TX/FL/CA/NC/GA/VA/LA/MS/SC/TN/NV/OR/WA state HVAC license + NASCLA portable helps but doesnt cover every state + crossing state lines for service or install requires registration + bond + sometimes additional exam + geographic expansion across state lines meaningfully harder than across-county); owner-operator burnout + spouse-CSR fragility (Year 1 solo 60-80 hr weeks as tech + dispatcher + bookkeeper + CSR-via-spouse + after-hours emergency + first-tech hire timing highest-leverage operating decision + spouse-as-CSR model fragile + divorces + family-life strain common failure modes Year 2-3) -- with honest 8-condition verdict on who should and should not start an HVAC company in 2027.',
  s9: 'Cross-linked 27 related Pulse entries: q9666 compounding pharmacy DIRECT sibling (state-licensed + federally-regulated + service-business parallel) + q9665 boutique fitness studio (lease-based + recurring-membership revenue + female-skew customer parallel) + q9664 microbrewery (regulated production + state licensure + specialty equipment) + q9663 self-storage (specialty CRE + state-by-state regulation) + q9662 mobile IV therapy clinic + q9661 veterinary clinic + q9660 DPC + q9659 med spa siblings (service business + state regulation) + q9658 NEW STRUCTURE sibling + q9657 home health (workforce + insurance parallel) + q9650 assisted living (specialty CRE + state licensure) + q9601 fractional CFO (operational backbone for multi-truck shop + multi-location financial reporting) + q9576 adult coding bootcamp (state regulation framework) + q2117 post-construction cleanup DIRECT sibling (skilled trades + truck + lead-cost + per-ticket economics parallel) + q1975 daycare (state licensure + parent-customer-acquisition) + q1942/q1946-q1954 baseline Q&A format siblings (q1949 personal training + q1948 dog walking + q1947 notary service business parallels) + q1127/q1139 service business framework.',
  s10: 'SUBAGENT_VERIFIED. Lean deep baseline of the HVAC company startup playbook for 2027 matching the actual question "How do you start an HVAC company in 2027?" Built under NEW VALUE-NOT-WORDCOUNT MANDATE: target 8,000-10,500 words with tight paragraphs (2-3 sentences max), frequent H3 breaks, no walls of text, no padding. Structure: Bottom Line callout (3 punchy bullets Capital/Margins/Hardest part with bold-tag labels hitting solo $80K-$200K vs 2-3 truck $400K-$1.5M + service van + tools + EPA 608 Universal + state HVAC contractor license + ACCA Manual J/D/S + NATE + Carrier/Trane/Lennox/Daikin/Goodman/Rheem/York-JCI/Bosch + METUS/Fujitsu/LG ductless + Watsco/Ferguson/Johnstone distributor + ServiceTitan/Housecall Pro/Jobber + flat-rate pricing + service agreements + consumer financing + Google LSA + PE roll-up Wrench/Apex/Redwood/Service Champions/HomePros/Astara + AIM Act R-410A to R-32/R-454B 2025 + SEER2/HSPF2 + 25C/HEEHRA heat pump + Costco/HD competition + labor shortage 38,500/yr vs 26K + chronic 200-400% turnover + LSA cost inflation + warranty + review-bombing + commission/spiff burnout + tablet fatigue), then 3 short paragraphs distinguishing residential + light-commercial HVAC from commercial refrigeration-only (Hussmann/Hill Phoenix supermarket walk-in) + plumbing-electrical multi-trade (Roto-Rooter/Mr. Rooter/Mister Sparky/ARS) + new-construction HVAC sub (production builder rough-in $4K-$8K/home thin 5-12% margin) + commercial mechanical (Comfort Systems USA NYSE:FIX + EMCOR NYSE:EME + Limbach NASDAQ:LMB hospital + office + university), then TOC block listing 13 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit) with horizontal rule separators, then LEAN H3 deep content sections inside each PART (3-4 sections per PART, tight 2-3 sentence paragraphs, no padding, frequent H3 breaks). flow contains exactly 2 mermaid diagrams (operating journey from EPA 608 + state license + first used van through truck + tools + parts + shop space + equipment vendor + capital stack + tech hire + dispatch + per-ticket economics + flat-rate pricing + memberships + tech stack + marketing + stage growth + 6-path strategic exit; decision matrix for solo vs small shop vs acquisition AND service mix selection residential service + install / light commercial heavy / heat pump specialty / IAQ specialty / AVOID new-construction core with reference operators and exit math). src has 70 cited sources with real URLs covering EPA 608 + AIM Act + SNAP + DOE SEER2/HSPF2 + IRS 25C + DOE HEEHRA + ACCA + ASHRAE + RSES + MCAA + PHCC + NATE + HVAC Excellence + ESCO + NASCLA + CSLB C-20 + BLS HVAC Mechanics + BLS QCEW + IBISWorld + Carrier + Trane + Lennox + Daikin + Rheem + York-JCI + METUS + Fujitsu + LG + Bosch + Watsco + Ferguson + Johnstone Supply + ServiceTitan + Housecall Pro + Jobber + FieldEdge + Service Fusion + GorillaDesk + Profit Rhino + Callahan Roach + Synchrony + GreenSky + Wells Fargo + Service Finance + Microf + Aqua Finance + Live Oak Bank + First Bank of the Lake + Newtek + Celtic + Crest Capital + Channel Partners + Google LSA + Angi + Thumbtack + Podium + Birdeye + Verizon Connect + Samsara + Wrench Group + Apex Service Partners + Redwood Services + Service Champions Group + HomePros Group + ARS Rescue Rooter + Service Experts + Comfort Systems USA + EMCOR + American Home Shield + 2-10 HBW. num is comprehensive 9-table benchmark block (industry size + service mix economics 8 categories + capital tier + equipment/truck/tools by category + refrigerant transition timeline + staff comp 8 roles + 5-year cash-flow + capital stack 7 layers + marketing channel cost 10 channels + exit multiples 6 buyer types). counter is 13-element counter-case with labor shortage + tech retention + PE roll-up compression + refrigerant transition complexity + Google LSA cost inflation + Costco/HD competition + consumer financing aged-receivables risk + warranty exposure + review-bombing + subscriber-base burnout from aggressive scripts + tablet fatigue + seasonal volatility + state-by-state license friction + owner-operator burnout + spouse-CSR fragility + honest 8-condition verdict. links cross-references 27 related entries with q9666 compounding pharmacy + q2117 post-construction cleanup DIRECT siblings (skilled trades + truck + per-ticket parallels). All numbers grounded in real EPA + DOE + ACCA + BLS + IBISWorld + ServiceTitan + Service Roundtable + Wrench/Apex/Redwood PE + Live Oak Bank + AIM Act 2020 + Jan 2025 GWP cutoff + 25C/HEEHRA federal + state HVAC license regimes + NATE + NASCLA. ASCII-clean throughout. Lean target 8,000-10,500 words honored.'
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
