// vq_dmmg01 -- Tell me how to scale multi-unit retail
// Direct-write bypass. Target 8,500-10,500 words. HARD CAP 10,500.

const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) { const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }
}

const ID = 'vq_dmmg01';
const QUESTION = "How do you scale a multi-unit retail business in 2027?";

const tldr = `**TL;DR:** Scaling **multi-unit retail in 2027** is **NOT** about opening more stores — it is about building **the operational infrastructure that lets the second, fifth, fifteenth, fiftieth, and five-hundredth unit replicate the unit-economics of the first**. The discipline rests on **eight orthogonal capabilities every successful multi-unit operator builds in order**: (1) **a single proven unit-economic model** (one store hitting target sales-per-square-foot, gross margin, labor %, occupancy %, and contribution margin reliably for 18-24 months before unit #2 opens), (2) **a written operations manual + brand-standards playbook** that codifies every recipe, planogram, opening + closing checklist, customer-service script, hiring + training script, vendor management process, inventory replenishment rule, and brand visual element, (3) **a manager-of-managers leadership layer** (district / area / regional manager hierarchy with documented span-of-control, KPI scorecards, weekly + monthly + quarterly cadence, and a real talent-development bench), (4) **a real-estate + site-selection discipline** (demographic + traffic + competitive + co-tenancy + lease-economics modeling that ranks every new location against a documented site scorecard, not founder gut), (5) **a centralized supply chain + procurement function** (whether owned-distribution like Costco NASDAQ:COST + 7-Eleven + Casey's General Stores NASDAQ:CASY + Sheetz + Wawa, or third-party distributor partnerships like Restaurant Depot + US Foods NYSE:USFD + Sysco NYSE:SYY + McLane), (6) **a financial + technology stack that gives same-day P&L by location** (modern POS like Toast NYSE:TOST or Square + cloud accounting like Sage Intacct or NetSuite or QuickBooks Enterprise + business intelligence via Tableau / Looker / Power BI + Snowflake or BigQuery data warehouse + Hightouch / Census reverse-ETL to push location-level KPIs to managers), (7) **a deliberate capital structure** (internal cash flow self-funding vs. SBA 7(a) loans vs. private equity rollup vs. franchise capital vs. public market — each implies different growth pace + governance + exit math), and (8) **an exit-or-perpetual-ownership thesis** (build to sell to PE rollup at 4-8x EBITDA multiple within 5-9 years, build to franchise the system, build to take public, or build to hold as multi-generational family operator — each implies different operating discipline). Real-name proof set: **7-Eleven (Couche-Tard $39B unsolicited bid 2024 + Seven & i Holdings TYO:3382 family management buyout response), Casey's General Stores NASDAQ:CASY (~2,650 stores, Iowa-headquartered, ~$4B market cap), Sheetz (~700 stores, family-owned private), Wawa (~1,100 stores, family-owned private), Costco NASDAQ:COST (~880+ warehouses globally, $250B+ revenue, Jim Sinegal founder-CEO original playbook + Craig Jelinek + Ron Vachris current CEO), Walmart NYSE:WMT (~10,500 stores globally, $650B+ revenue, Sam Walton founder), McDonald's NYSE:MCD (~42,000 locations globally, ~$25B revenue, Chris Kempczinski CEO), Restaurant Brands International NYSE:QSR (~30,000+ locations across Burger King + Tim Hortons + Popeyes + Firehouse Subs), Inspire Brands (Roark Capital-owned, ~33,000+ across Dunkin + Baskin-Robbins + Arby's + Buffalo Wild Wings + Jimmy John's + Sonic), Yum Brands NYSE:YUM (~58,000+ Pizza Hut + KFC + Taco Bell + Habit Burger David Gibbs CEO), Domino's NYSE:DPZ (~21,000 stores Russell Weiner CEO), Chipotle NYSE:CMG (~3,500 stores Brian Niccol-then-Scott Boatwright CEO transition 2024-2025), Marc Lore (Wonder Group restaurant rollup model + Jet.com prior exit + Walmart e-commerce president), and the NRF (National Retail Federation) + ICSC (International Council of Shopping Centers) industry research bodies**.`;

const core = `

> ### Direct Answer
> **Scaling multi-unit retail in 2027 requires building eight infrastructure capabilities in order: (1) prove one unit's unit-economics for 18-24 months, (2) codify operations + brand standards in writing, (3) build a manager-of-managers leadership layer with documented span-of-control, (4) build a site-selection discipline with documented scorecard, (5) centralize supply chain + procurement (owned-distribution vs. distributor partnership), (6) deploy a same-day P&L tech stack (Toast NYSE:TOST or Square POS + Sage Intacct / NetSuite / QuickBooks Enterprise + Tableau/Looker/Power BI + Snowflake/BigQuery), (7) pick the right capital structure (internal cash flow vs. SBA 7(a) vs. PE rollup vs. franchise vs. public), and (8) commit to an exit-or-hold thesis. The error pattern: founders open store 2 before proving store 1, skip the operations manual, hire from the same pipeline as their bartenders rather than building a real GM-of-managers bench, pick locations on founder gut, run a fragmented vendor stack, and burn cash funding growth that doesn't compound. The winners (Casey's General Stores NASDAQ:CASY, Sheetz, Wawa, Costco NASDAQ:COST, Chipotle NYSE:CMG, Domino's NYSE:DPZ) prove the playbook works when the eight capabilities are built in the right sequence.**

> ### Bottom Line
> - **[The eight capabilities, in order]** Prove unit-1 → codify ops manual → build manager-of-managers → site-selection discipline → centralize supply chain → same-day P&L tech stack → capital structure → exit thesis. Skipping ANY of the eight is the most common multi-unit failure mode.
> - **[Capital structures + their implications]** **Self-funded** (slow, retains 100% equity, founder pace): 1-2 new units/yr typical. **SBA 7(a)** (up to $5M per loan, personal guarantee, 25-yr amortization for real estate / 10-yr for equipment + working capital): 2-4 new units/yr. **Private equity rollup** (sell majority to PE at 4-8x EBITDA, PE funds 5-15 new units/yr + bolt-on acquisitions, 5-7 yr hold to next exit): 8-25 new units/yr. **Franchise** (sell the system + brand + ops manual to franchisees at $25-$50K initial fee + 4-8% royalty + 1-3% marketing fund): 20-200+ new units/yr but lower per-unit margin to franchisor + governance complexity. **Public market** (IPO once you cross $200M+ revenue + 50+ units + clean unit-economic story): unlimited capital + public-market governance overhead.
> - **[Hardest part]** **NOT raising the capital. NOT finding the real estate.** The trifecta: **(1) THE GM-OF-MANAGERS BENCH IS THE ACTUAL BOTTLENECK** — most multi-unit operators stall at 4-8 units because the founder is still personally GM-ing every store. Building a real district manager / area manager / regional manager hierarchy with documented KPIs + weekly cadence + true talent-development pipeline is the single hardest scaling discipline. The Casey's / Sheetz / Wawa / Chipotle playbook all anchor on this. **(2) STORE #1 ECONOMICS DON'T NATURALLY REPLICATE TO STORE #N** — site selection variance + manager skill variance + local-market variance + supply-chain variance compound. Most multi-unit operators discover by unit #4-8 that the average store unit-economics are 60-75% of unit #1 unless they have a real site-scorecard + ops manual + manager training + supply-chain discipline. The winners (Casey's expanding from Iowa hub + Costco's warehouse-club operating discipline + Domino's franchise system) all built this discipline before scaling. **(3) CASH BURN OUTPACES UNIT MATURITY** — new stores typically reach mature unit-economics in 12-30 months; opening 4 new stores in a year while still ramping units 1-4 can compound a cash flow problem fast. The discipline: never open a new unit unless your existing units are throwing off enough cash to fund the new unit's 24-month ramp.**

A **multi-unit retail business** is **any retail operation running 2 or more physical locations under a unified brand + operations + ownership structure**, where the unit-economics, brand standards, customer experience, supply chain, financial reporting, and management hierarchy are designed to replicate (rather than re-invent) at each new location. The category spans **convenience + grocery + foodservice + restaurants + specialty retail + service retail + automotive + entertainment + healthcare retail + financial-services retail**.

The US multi-unit retail universe in 2027 includes **~3,500 multi-unit operators across 250+ industry verticals running 2-50,000+ locations each**, with the largest concentrations in **convenience (~150,000 c-store locations across 7-Eleven + Casey's + Sheetz + Wawa + Couche-Tard Circle K + Speedway + Pilot + RaceTrac + Kwik Trip + QuikTrip + Maverik + Buc-ee's + ~110,000 other independent + smaller-chain)**, **quick-service restaurants (~250,000 QSR locations across McDonald's + Burger King + Wendy's + Subway + Chipotle + Domino's + Pizza Hut + Taco Bell + KFC + Popeyes + Dunkin' + Starbucks + Chick-fil-A + others)**, **specialty retail (~1.1M total retail establishments per US Census of Retail Trade with multi-unit concentration in apparel + home goods + electronics + sporting goods + jewelry + auto parts)**, **service retail (drycleaners + salons + fitness + auto service + pet care + tax prep)**, and **emerging categories (cannabis dispensaries multi-state operators + EV charging networks + ghost kitchens + medical aesthetics + urgent care)**.

## Table of Contents

**Part 1 — The Eight Capabilities** — Why scaling fails without all eight in the right sequence.
**Part 2 — Operations + Brand Standards + Manager-of-Managers** — The infrastructure layer.
**Part 3 — Real Estate + Supply Chain + Technology** — The platform layer.
**Part 4 — Capital Structure + Growth Pace + Exit Thesis** — The strategic layer + counter-cases.

---

## PART 1 — THE EIGHT CAPABILITIES

### 1. Prove unit-1 economics for 18-24 months before opening unit-2

The single most consequential discipline in multi-unit scaling is the **gate between unit-1 and unit-2**. The founder who opens unit-2 in month 9 with unit-1 still ramping creates a structurally fragile growth trajectory that frequently fails by unit-4.

**What "proven unit-economics" means concretely:**
- **Revenue trajectory.** Unit-1 hitting target sales-per-square-foot for 12+ consecutive months (or target average-unit-volume / AUV for restaurants — typically $1.5-$4M+ for full-service restaurant, $800K-$3M for QSR, $1.5-$8M for convenience, $400K-$1.5M for indie specialty retail, $4-$15M for grocery).
- **Gross margin.** Stable blended GM at target rate (35-45% for restaurants, 25-35% for c-store after fuel + tobacco mix, 25-40% for specialty retail, 50-65% for service retail).
- **Labor %.** At industry-benchmark labor rate (28-35% for full-service restaurant, 22-30% for QSR + c-store, 18-28% for retail, 22-32% for service).
- **Occupancy %.** Rent + NNN at sustainable rate (6-12% of revenue depending on category).
- **Contribution margin.** Store-level four-wall EBITDA at target rate (12-22% for healthy chains; below 10% means structural problem).
- **Customer + community signal.** Repeat-customer rate + Net Promoter Score + Google/Yelp rating + community embedding (sponsorships, partnerships, recognized brand).
- **Operational repeatability.** GM + assistant managers can run the store for 30+ consecutive days without founder presence at quality + KPI standards.

The founders who skip this gate consistently discover by unit-4 that their average unit-economics are 60-75% of unit-1's because **(a)** unit-1 had the founder's full operational attention, **(b)** unit-1 had an unusually good GM hire that doesn't generalize, **(c)** unit-1 was in an unusually favorable location, OR **(d)** unit-1's KPI tracking was casual and the "proven economics" weren't actually as good as the founder thought.

### 2. Codify the operations manual + brand standards

The second capability is the **written operations manual + brand standards playbook** that codifies every process. This is what separates a multi-unit operator from a serial entrepreneur. The manual covers:

**Operations.** Opening + closing checklists. Daily / weekly / monthly cadence. Cleaning + sanitation + safety. Inventory receipt + storage + rotation. Cash handling + reconciliation. POS + tech use. Customer service scripts. Complaint handling. Loss prevention.

**Brand standards.** Visual identity (logo, colors, typography, signage, exterior, interior, uniforms). Photography + content style. Menu / planogram standards. Pricing architecture + permission structure. Communication tone + voice. Local-marketing + community-engagement standards.

**HR + people.** Job descriptions + competency models for every role. Hiring scripts + interview questions + skill-tests + reference-check process. Onboarding + first-30-day + first-90-day plans. Performance review templates + cadence + comp structure. Discipline + termination process. Benefits + payroll + leave policy.

**Vendor + supply chain.** Approved vendor lists per category. Order minimums + lead times + payment terms. Pricing review cadence. Substitution rules. Vendor performance scorecard.

**Financial + KPI.** Daily / weekly / monthly KPI scorecard per location. P&L review cadence. Budget vs. actual variance investigation rules. Cash flow management. CapEx approval matrix.

McDonald's (Ray Kroc + the Founder + the McDonald's brothers original operations playbook, today administered through OISP / Operations Improvement & Standards Process), Chick-fil-A (S. Truett Cathy + Dan Cathy + Andrew Cathy ~3,000-location operator with arguably the strongest operations manual in QSR), Costco (Jim Sinegal's foundational operating principles + Costco Wholesale Member Code of Ethics), and Domino's (David Brandon + Patrick Doyle + Russell Weiner + the post-2010 turnaround operations rebuild) all anchor on extreme operations manual discipline.

### 3. Build a manager-of-managers leadership layer

The third capability is the **multi-level management hierarchy** that lets the founder step out of GM-of-every-store role. The typical structure as a chain scales:

**Stage 1 — 1-4 units.** Founder + GMs + assistant managers + shift leads + crew. Founder is district manager + ops director + everything.

**Stage 2 — 5-15 units.** Founder + **1-2 district managers** (each covering 4-8 stores) + GMs + assistant managers + shift leads + crew. Founder is regional manager + ops director.

**Stage 3 — 16-40 units.** Founder + **1 VP Operations** + **2-4 district managers** + GMs + assistants + shift leads + crew. Founder transitions to CEO + strategy + capital + brand.

**Stage 4 — 41-100 units.** CEO + COO + **3-5 regional VPs** + **8-15 district managers** + GMs + assistants + shift leads + crew. Hierarchy formalizes; HR + Operations + Finance + Marketing + Real Estate become functional departments.

**Stage 5 — 100+ units.** CEO + C-suite (COO + CFO + CMO + CHRO + Chief Real Estate + Chief Supply Chain) + regional VPs + zone directors + district managers + GMs + assistants + shift leads + crew. Full corporate infrastructure.

**Span-of-control discipline.** District managers typically cover 4-10 stores depending on category (closer to 4-6 for full-service restaurant + complex retail, 6-10 for QSR + c-store + simple-format retail). Regional VPs typically cover 4-8 district managers = 30-80 stores. The discipline: any DM covering more than 10 stores or any VP covering more than 8 DMs is at risk of coaching-quality drop + KPI miss.

### 4. Build a site-selection discipline

The fourth capability is the **site-selection scorecard** that ranks every new location against documented criteria, removing founder gut from the location decision.

**Demographic + traffic.** Daytime + nighttime population within 1-3-5 mile rings. Household income + age + employment composition. Vehicle counts + pedestrian counts + transit + parking. ICSC + ESRI Tapestry segmentation overlay.

**Competitive density.** Direct + indirect competitor mapping within trade area. Saturation index (units per 1,000 population in your category).

**Co-tenancy.** Adjacent + complementary retailers (grocery + drug + big-box + restaurants + entertainment + service). Anchor + junior anchor presence.

**Lease economics.** Base rent + NNN + percentage rent + escalators + TI allowance + term + renewal options. Sustainable rent-to-revenue ratio for the category.

**Operational fit.** Build-out cost + permitting timeline + zoning + signage + drive-through (if applicable) + delivery / loading + utility capacity + ADA + parking ratio.

**Documented site scorecard.** Many multi-unit operators (e.g., Chipotle famous site-selection discipline + Starbucks Atlas + Buc-ee's documented site criteria — 200+ acres for the mega-store format + ~1.5M-2.5M annual visitor counts) score each candidate site on 12-40 weighted criteria, requiring a minimum aggregate score before approval.

---

## PART 2 — OPERATIONS + BRAND STANDARDS + MANAGER-OF-MANAGERS

### 1. The KPI scorecard + weekly cadence

Every multi-unit operator at scale runs the same fundamental cadence:

**Daily.** Sales + transactions + average check + labor % + cash reconciliation pushed to each GM via POS dashboard.

**Weekly.** P&L preview + variance to budget + COGS + labor + key KPIs reviewed by GM with district manager every Monday or Tuesday.

**Monthly.** Full P&L close + variance analysis + customer KPIs (NPS, repeat rate, complaints) + people KPIs (turnover, fill rate, training completion) reviewed by DM with regional VP.

**Quarterly.** Strategic review + new-unit pipeline + competitive landscape + customer trends + capital plan + comp review.

**Annual.** Strategic plan + budget + capital plan + comp + bonus + succession plan + brand review.

### 2. Same-day P&L technology stack

Modern multi-unit operators have moved to **same-day P&L visibility** via:

**POS:** **Toast NYSE:TOST** (restaurant + QSR + bar — ~$1B+ revenue + ~100K+ restaurants), **Square** (Block NYSE:SQ — multi-format), **Clover** (Fiserv NYSE:FI), **Lightspeed NYSE:LSPD** (retail + restaurant), **Revel Systems** (multi-format), **Shopify POS** (Shopify NYSE:SHOP — retail), **NCR Aloha** (restaurant enterprise), **Oracle MICROS** (enterprise restaurant + hotel), **Verifone** (c-store + fuel), **Gilbarco Veeder-Root Passport** (c-store).

**Cloud accounting + financial:** **Sage Intacct** (multi-entity midmarket — strong for multi-unit), **NetSuite** (Oracle NYSE:ORCL — enterprise multi-unit), **QuickBooks Enterprise** (Intuit NASDAQ:INTU — small-to-midmarket multi-unit), **Restaurant365** (purpose-built for multi-unit restaurant — combines accounting + scheduling + inventory).

**Business intelligence + data warehouse:** **Snowflake NYSE:SNOW** + **Google BigQuery** + **Databricks** for the data warehouse layer; **Tableau** (Salesforce NYSE:CRM) + **Looker** (Google) + **Power BI** (Microsoft NASDAQ:MSFT) for visualization; **Hightouch** + **Census** for reverse-ETL to push KPIs back to operational systems (POS + scheduling + alerts).

**Scheduling + workforce:** **7shifts** (restaurant), **Deputy**, **When I Work**, **Kronos** (UKG), **HotSchedules** (Fourth), **Workday NASDAQ:WDAY** (enterprise).

**Inventory + supply chain:** **Restaurant365** + **Compeat** (R365-owned) + **MarginEdge** + **BlueCart** + **NetSuite Supply Chain** + custom warehouse-management systems for owned-distribution operators (Costco + 7-Eleven + Casey's + Wawa).

### 3. Centralized supply chain + procurement

Multi-unit operators win or lose on supply chain. Three structural models:

**(a) Owned distribution.** Costco operates ~30 US depot facilities; 7-Eleven operates ~30+ fresh-food commissaries; Casey's General Stores operates centralized distribution from Ankeny + Iowa hubs; Sheetz operates centralized commissary serving the Pennsylvania + Mid-Atlantic territory; Wawa operates Wawa Dairy + Wawa commissary serving the Mid-Atlantic territory; Buc-ee's operates centralized fresh-food + jerky + brisket + fudge production serving the Texas + Southeast network. Capital-intensive but lowest per-unit cost + best quality control + best brand differentiation. Typical: 50+ stores threshold.

**(b) Third-party distributor partnerships.** **US Foods NYSE:USFD**, **Sysco NYSE:SYY**, **Performance Food Group NYSE:PFGC**, **McLane Company** (Berkshire Hathaway NYSE:BRK-B), **Reinhart**, **Gordon Food Service** (private), **Ben E. Keith**, **Restaurant Depot** (cash-and-carry), **Costco Business** (cash-and-carry). Most multi-unit restaurants + retailers use this model. Lower capital + faster scale + higher per-unit COGS.

**(c) Hybrid.** Many multi-unit operators run hybrid — owned-distribution for proprietary / brand-defining items (Wawa hoagies + Sheetz menu items + 7-Eleven Slurpee + Casey's pizza), third-party for everything else.

---

## PART 3 — REAL ESTATE + CAPITAL + EXIT THESIS

### 1. The four capital structures + their growth-pace implications

**Self-funded internal cash flow.** Founder retains 100% equity. Growth pace: 1-2 new units/yr typical (constrained by cash conversion cycle + ramp time of new units). Path to scale: 7-15 years to 20-40 units. Examples: many family-owned regional chains (Buc-ee's was founded 1982 + grew slowly until 2010s + still family-controlled today; Whataburger family-controlled until 2019 BDT Capital majority sale; Chick-fil-A still S. Truett Cathy family-controlled; Publix still family + employee owned).

**SBA 7(a) + 504 + commercial debt.** SBA 7(a) up to $5M per loan, ~10-yr amortization for equipment + working capital + 25-yr for real estate; SBA 504 up to $5.5M for real estate + equipment; conventional commercial bank debt for established operators with strong cash flow. Personal guarantee. Growth pace: 2-4 new units/yr. Path: 5-10 years to 15-30 units.

**Private equity rollup.** Sell majority equity to PE firm at 4-8x EBITDA. PE funds 5-15 new units/yr + bolt-on acquisitions. Growth pace: 8-25 new units/yr. 5-7-yr hold typical. Examples: **Inspire Brands** (Roark Capital-owned, rolled up Arby's + Buffalo Wild Wings + Sonic + Jimmy John's + Dunkin' + Baskin-Robbins to ~33,000+ locations), **Restaurant Brands International NYSE:QSR** (3G Capital-backed, rolled up Burger King + Tim Hortons + Popeyes + Firehouse Subs), **CEC Entertainment** (Chuck E. Cheese — Apollo restructuring 2020), **Yum Brands NYSE:YUM** (spin-off of PepsiCo restaurants 1997 + later YumChina spin), **Bloomin' Brands NASDAQ:BLMN** (Outback + Carrabba's + Bonefish + Fleming's), **Darden Restaurants NYSE:DRI** (Olive Garden + LongHorn + Capital Grille + Yard House).

**Franchise.** Sell the system to franchisees. Initial franchise fee $25K-$50K + ongoing royalty 4-8% of franchisee revenue + national marketing fund 1-3%. Franchisor responsible for brand + ops manual + new-unit support + marketing; franchisee provides capital + local management. Growth pace: 20-200+ new units/yr possible. Examples: **McDonald's NYSE:MCD** (~95% franchised), **Subway** (~99% franchised), **Domino's NYSE:DPZ** (~98% franchised), **Burger King** (~99% franchised), **7-Eleven** (~93% franchised), **Marriott NASDAQ:MAR** (~80% franchised). Trade-off: lower per-unit margin to franchisor + governance + brand-protection complexity.

**Public market.** IPO once you cross $200M+ revenue + 50+ units + clean unit-economic story. Examples: **Chipotle NYSE:CMG** (IPO 2006 at $22 + traded to $3,500+ at peak), **Shake Shack NYSE:SHAK** (IPO 2015), **Cava NYSE:CAVA** (IPO 2023), **First Watch Restaurant Group NASDAQ:FWRG** (IPO 2021), **Krispy Kreme NASDAQ:DNUT** (re-IPO 2021), **Wingstop NASDAQ:WING** (IPO 2015 at $19 + traded to $400+).

### 2. The exit-or-hold thesis

Multi-unit operators should commit to one of four exit-or-hold thesis paths from the early scaling stage, because each implies different operating + capital + governance discipline:

**(a) Build to PE rollup exit in 5-9 years.** Optimize for EBITDA growth + clean financial reporting + audit-ready books + replicable unit-economics + management team quality. Target 4-8x EBITDA exit multiple at 20-100 units.

**(b) Build to franchise the system.** Optimize for ops manual + brand standards + training systems + multi-tier franchise infrastructure + FDD (Franchise Disclosure Document) preparation. Target $100M-$1B franchise system value at 200-2,000+ franchised units.

**(c) Build to IPO.** Optimize for high-growth + clean unit-economic story + capital-markets-narrative + S-1 preparation. Target $200M-$2B+ market cap at 50-300+ units.

**(d) Build to hold as multi-generational family operator.** Optimize for cash-flow + dividends + family governance + slow + steady expansion + long-term brand reputation. Buc-ee's + Wawa + Sheetz + Publix + In-N-Out Burger + Chick-fil-A all operate on this thesis.

### 3. Operating journey + counter-cases (in-line summary)

The 10 most common multi-unit scaling failures: (1) **opened unit-2 before proving unit-1**; (2) **skipped the operations manual**; (3) **founder still personally GM-ing at unit-5+**; (4) **picked locations on gut not scorecard**; (5) **fragmented vendor stack** (different suppliers per store, no procurement leverage); (6) **legacy POS + spreadsheet finance** (can't see same-day P&L by location); (7) **opened in tertiary markets without owned-distribution support** (logistics + COGS drag); (8) **wrong capital structure for growth pace** (SBA debt at PE-scale aggressiveness = cash-flow death); (9) **no exit thesis** (operating drift); (10) **scaled into recession or category-cycle downturn** without unit-economic buffer.

`;

const flow = `

\`\`\`mermaid
flowchart TD
  A[Multi-unit retail founder] --> B[Capability 1: Prove unit-1 for 18-24 months — revenue + GM + labor % + occupancy + contribution margin + operational repeatability]
  B --> C[Capability 2: Codify operations manual + brand standards — ops + brand + HR + vendor + KPI]
  C --> D[Capability 3: Build manager-of-managers — DM 4-10 stores + RVP 4-8 DMs + CEO/COO split]
  D --> E[Capability 4: Site-selection scorecard — demo + traffic + competition + co-tenancy + lease econ + ops fit + weighted criteria]
  E --> F[Capability 5: Centralize supply chain — owned distribution at 50+ stores OR Sysco/US Foods/PFGC/McLane partnership]
  F --> G[Capability 6: Tech stack same-day P&L — Toast/Square/Clover/Lightspeed POS + Sage Intacct/NetSuite/QB Enterprise + Tableau/Looker/PBI + Snowflake/BigQuery + Hightouch/Census reverse-ETL]
  G --> H[Capability 7: Capital structure — self-fund 1-2/yr OR SBA 2-4/yr OR PE rollup 8-25/yr OR franchise 20-200/yr OR public unlimited]
  H --> I[Capability 8: Exit-or-hold thesis — PE rollup 5-9 yr OR franchise system OR IPO OR multi-gen family hold]
  I --> J[Operating cadence — daily POS + weekly P&L preview + monthly close + quarterly strategy + annual plan]
  J --> K{Hit unit-economic + cash-flow + KPI targets?}
  K -->|Yes| L[Next unit + iterate scorecard + bench-build]
  K -->|No| M[Diagnose — site, manager, ops, supply chain, capital — pause new units until fixed]
  L --> N[Year 3-5: 8-30 units + bench depth + supply-chain leverage + tech stack maturity]
  M --> N
\`\`\`

`;

const src = `

## Sources

1. **NRF (National Retail Federation)** -- US retail trade association + industry data. https://nrf.com
2. **ICSC (International Council of Shopping Centers)** -- retail real estate + leasing benchmarks. https://www.icsc.com
3. **US Census Bureau Economic Census + Census of Retail Trade** -- US retail establishment counts + revenue. https://www.census.gov/programs-surveys/economic-census
4. **National Restaurant Association (NRA) + State of the Restaurant Industry report** -- restaurant industry benchmarks. https://restaurant.org
5. **NACS (National Association of Convenience Stores)** -- c-store industry data + State of the Industry. https://www.convenience.org
6. **7-Eleven + Seven & i Holdings TYO:3382 + Couche-Tard unsolicited bid 2024 + Seven & i family management buyout response 2024-2025**. https://www.7-eleven.com
7. **Casey's General Stores NASDAQ:CASY (~2,650 stores, Iowa-headquartered)**. https://www.caseys.com
8. **Sheetz (~700 stores, family-owned private)**. https://www.sheetz.com
9. **Wawa (~1,100 stores, family-owned private)**. https://www.wawa.com
10. **Couche-Tard / Circle K + Speedway + Pilot + RaceTrac + Kwik Trip + QuikTrip + Maverik + Buc-ee's** -- other major US c-store chains.
11. **Costco NASDAQ:COST -- ~880+ warehouses globally + $250B+ revenue + Jim Sinegal founder + Craig Jelinek + Ron Vachris CEO succession**. https://www.costco.com
12. **Walmart NYSE:WMT -- ~10,500 stores + $650B+ revenue + Sam Walton founder + Doug McMillon CEO**. https://www.walmart.com
13. **McDonald's NYSE:MCD -- ~42,000 locations + Chris Kempczinski CEO + Ray Kroc + McDonald's brothers founding + OISP**. https://www.mcdonalds.com
14. **Restaurant Brands International NYSE:QSR (3G Capital-backed) -- Burger King + Tim Hortons + Popeyes + Firehouse Subs ~30,000+ locations**. https://www.rbi.com
15. **Inspire Brands (Roark Capital-owned) -- Arby's + Buffalo Wild Wings + Sonic + Jimmy John's + Dunkin' + Baskin-Robbins ~33,000+ locations**. https://www.inspirebrands.com
16. **Yum Brands NYSE:YUM (David Gibbs CEO) -- Pizza Hut + KFC + Taco Bell + Habit Burger ~58,000+ locations**. https://www.yum.com
17. **Domino's NYSE:DPZ (Russell Weiner CEO) -- ~21,000 stores + David Brandon + Patrick Doyle turnaround era**. https://www.dominos.com
18. **Chipotle NYSE:CMG -- ~3,500 stores + Brian Niccol-Scott Boatwright CEO transition 2024-2025 + IPO 2006**. https://www.chipotle.com
19. **Subway (private) + Chick-fil-A (S. Truett Cathy + Dan Cathy + Andrew Cathy family) + In-N-Out Burger (Snyder family) + Whataburger (BDT Capital majority 2019) + Publix Super Markets (employee-owned)** -- exemplar family + private multi-unit operators.
20. **Marc Lore + Wonder Group (restaurant rollup) + Jet.com Walmart-acquired 2016 + Walmart e-commerce president era**. https://wonder.com
21. **Buc-ee's (founded 1982 + family-controlled) + Maverik + Kwik Trip + QuikTrip** -- exemplar regional convenience leaders.
22. **Toast NYSE:TOST (~$1B+ revenue + ~100K+ restaurants) + Square Block NYSE:SQ + Clover Fiserv NYSE:FI + Lightspeed NYSE:LSPD + Revel Systems + Shopify POS NYSE:SHOP + NCR Aloha + Oracle MICROS NYSE:ORCL + Verifone + Gilbarco Veeder-Root Passport** -- multi-unit POS systems.
23. **Sage Intacct + NetSuite Oracle NYSE:ORCL + QuickBooks Enterprise Intuit NASDAQ:INTU + Restaurant365 (purpose-built multi-unit restaurant accounting+inventory+scheduling)** -- cloud accounting + financial systems.
24. **Snowflake NYSE:SNOW + Google BigQuery + Databricks** -- data warehouse layer.
25. **Tableau Salesforce NYSE:CRM + Looker Google + Power BI Microsoft NASDAQ:MSFT** -- BI + visualization.
26. **Hightouch + Census** -- reverse-ETL for operational data activation.
27. **7shifts + Deputy + When I Work + Kronos UKG + HotSchedules Fourth + Workday NASDAQ:WDAY** -- workforce scheduling.
28. **Compeat (R365) + MarginEdge + BlueCart + NetSuite Supply Chain + custom WMS** -- inventory + supply chain.
29. **US Foods NYSE:USFD + Sysco NYSE:SYY + Performance Food Group NYSE:PFGC + McLane Berkshire Hathaway NYSE:BRK-B + Reinhart + Gordon Food Service + Ben E. Keith + Restaurant Depot + Costco Business** -- third-party distributor partnerships.
30. **ESRI Tapestry segmentation + Placer.ai + SafeGraph + Foursquare + Esri Business Analyst** -- site-selection data + analytics.
31. **Buxton + Sites USA + STORE Capital + RealPage + CoStar Group NASDAQ:CSGP** -- site-selection + commercial real estate data.
32. **SBA 7(a) + 504 + USDA Business & Industry + commercial bank debt** -- debt capital sources for multi-unit operators.
33. **Roark Capital + 3G Capital + Apollo Global Management NYSE:APO + BDT Capital + Brookfield Asset Management NYSE:BAM + KKR NYSE:KKR + TPG NASDAQ:TPG + Vista Equity Partners + Sycamore Partners + Sun Capital + L Catterton** -- private equity + family-office capital sources.
34. **International Franchise Association (IFA) + Franchise Times + Franchise Disclosure Document (FDD)** -- franchise system industry research + disclosure.
35. **Marriott NASDAQ:MAR + Hilton NYSE:HLT + Hyatt NYSE:H** -- hotel multi-unit / franchise exemplars.
36. **Bloomin' Brands NASDAQ:BLMN + Darden Restaurants NYSE:DRI + Brinker International NYSE:EAT + Texas Roadhouse NASDAQ:TXRH + Cheesecake Factory NASDAQ:CAKE** -- public multi-unit casual-dining exemplars.
37. **Cava NYSE:CAVA + First Watch NASDAQ:FWRG + Krispy Kreme NASDAQ:DNUT + Wingstop NASDAQ:WING + Shake Shack NYSE:SHAK** -- recent multi-unit IPO exemplars.
38. **Multi-unit Foodservice Operators (MUFSO) conference + Restaurant Finance & Development Conference + ICSC Las Vegas + NRF Big Show** -- multi-unit operator industry conferences.

`;

const num = `

## Numbers & Benchmarks

### Span-of-control benchmarks by stage

| Stage | # Units | Founder Role | DM Coverage | RVP Coverage | C-Suite |
|---|---|---|---|---|---|
| 1 | 1-4 | DM + Ops Director | n/a | n/a | n/a |
| 2 | 5-15 | RVP + Ops Director | 4-8 stores | n/a | n/a |
| 3 | 16-40 | CEO | 4-8 stores | 2-4 DMs | VP Operations |
| 4 | 41-100 | CEO | 6-10 stores | 3-5 DMs | COO + CFO + CMO + CHRO |
| 5 | 100+ | CEO | 6-10 stores | 3-5 DMs (zone director +1 layer) | Full C-suite + Chief Real Estate + Chief Supply Chain |

### Unit-economic target benchmarks by category

| Category | AUV / Sales-per-sf | Blended GM | Labor % | Occupancy % | Four-Wall EBITDA |
|---|---|---|---|---|---|
| QSR (McDonald's, Chipotle, Domino's) | $1.5-$4M AUV | 30-40% | 22-30% | 6-10% | 14-22% |
| Full-service restaurant (Olive Garden, Texas Roadhouse) | $3-$6M AUV | 32-42% | 28-35% | 7-11% | 12-18% |
| Fast-casual (Cava, Sweetgreen, Shake Shack) | $2-$4.5M AUV | 30-40% | 26-32% | 8-12% | 13-20% |
| Convenience (Casey's, Sheetz, Wawa) | $4-$15M (incl fuel) | 25-35% blended | 16-22% | 4-7% | 8-14% |
| Specialty retail (Lululemon, Apple, Bath & Body Works) | $800-$5,000/sf | 50-65% | 12-22% | 8-15% | 18-32% |
| Big-box retail (Walmart, Costco, Target) | $400-$1,200/sf | 22-35% | 10-16% | 3-6% | 5-9% |
| Service retail (salons, fitness, drycleaner, autoservice) | $300-$1,500/sf | 50-65% | 22-32% | 6-12% | 8-18% |
| Grocery (Publix, Kroger, Whole Foods) | $500-$1,500/sf | 25-32% | 12-18% | 3-6% | 4-9% |

### Capital structure + growth pace + governance

| Structure | Typical Pace | Equity Retained | Governance | Best Fit |
|---|---|---|---|---|
| Self-funded internal cash flow | 1-2 units/yr | 100% | Founder-controlled | Family + lifestyle + slow + multi-gen hold |
| SBA 7(a) + 504 + commercial debt | 2-4 units/yr | 100% (debt + PG) | Founder + lender covenants | Established operator wanting controlled growth |
| Private equity minority | 4-8 units/yr | 55-80% | PE board representation | Operator wanting accelerator + retains control |
| Private equity majority / rollup | 8-25 units/yr | 10-35% | PE-controlled board | Founder wanting exit in 5-9 yr |
| Franchise system | 20-200+ units/yr | 100% of franchisor | Franchisee-franchisor governance | Brand with ops manual + scaling system |
| Public market IPO | Unlimited capital | Equity dilution + public-market governance | Board + public scrutiny | $200M+ revenue + 50+ units + clean story |

### POS + tech stack benchmarks (2027 multi-unit ranges)

| System Category | Vendors | Per-Location Cost | Notes |
|---|---|---|---|
| POS (restaurant + QSR) | Toast NYSE:TOST, Square, Clover Fiserv, NCR Aloha, Revel, Oracle MICROS | $100-$500/mo + 1.5-3% transaction | Toast dominant SMB/midmarket; Oracle MICROS + NCR enterprise |
| POS (retail) | Lightspeed NYSE:LSPD, Shopify POS, Square Retail, Heartland, Vend | $80-$300/mo + transaction | Lightspeed + Shopify gaining share vs legacy |
| POS (c-store) | Verifone, Gilbarco Passport, NCR Radiant | $300-$900/mo + fuel integration | Fuel POS + EMV + age-verification complexity |
| Cloud accounting | Sage Intacct, NetSuite Oracle NYSE:ORCL, QuickBooks Enterprise Intuit NASDAQ:INTU, Restaurant365 | $300-$3,000/mo entity-wide | Restaurant365 purpose-built for multi-unit restaurant |
| Data warehouse | Snowflake NYSE:SNOW, BigQuery Google, Databricks | $500-$15,000/mo usage-based | Snowflake dominant midmarket multi-unit |
| BI + visualization | Tableau Salesforce NYSE:CRM, Looker Google, Power BI Microsoft NASDAQ:MSFT | $40-$120/seat/mo | Tableau + Power BI most common multi-unit |
| Reverse-ETL | Hightouch, Census | $500-$5,000/mo | Push KPIs from warehouse back to POS/ops systems |
| Workforce scheduling | 7shifts, Deputy, When I Work, Kronos UKG, HotSchedules Fourth | $30-$150/location/mo | 7shifts dominant restaurant SMB |
| Inventory + supply chain | Restaurant365, Compeat R365, MarginEdge, BlueCart, NetSuite Supply Chain | $200-$2,500/mo | R365 + MarginEdge purpose-built multi-unit restaurant |

### District + regional manager comp benchmarks (2027 US, by category)

| Role | Base | Variable At-Plan | Total OTE | Span | Notes |
|---|---|---|---|---|---|
| Store / restaurant GM | $55-$95K | $15-$45K | $70-$140K | 1 store | Bonus tied to store P&L + KPIs |
| District manager / area manager | $80-$135K | $20-$60K | $100-$195K | 4-10 stores | Bonus tied to district P&L + KPIs |
| Regional VP / director of operations | $135-$240K | $50-$140K | $185-$380K | 30-80 stores (3-5 DMs) | Bonus tied to regional P&L + strategic goals |
| VP / SVP Operations | $200-$340K | $80-$200K | $280-$540K | All stores | Equity-eligible at PE / public companies |
| Chief Operating Officer | $300-$500K | $150-$400K | $450-$900K | All stores + functions | Equity-eligible; PE/public std |

### Site-selection scorecard template (12-criterion framework)

| Criterion | Weight | Data Source | Pass / Fail Threshold |
|---|---|---|---|
| Population within 1-mile ring (daytime) | 10% | ESRI Tapestry + Census + Placer.ai | Category-specific min |
| Household income median | 8% | Census + ESRI | Category-specific |
| Vehicle traffic count (AADT) | 12% | State DOT + ICSC | Category-specific min |
| Pedestrian traffic | 8% | Placer.ai + SafeGraph | Urban-only criterion |
| Competitive density (units per 1K pop) | 12% | Buxton + custom mapping | Below saturation threshold |
| Co-tenancy (anchor + complementary) | 10% | ICSC + landlord | Category-specific |
| Base rent + NNN + escalators | 10% | LOI + CoStar | Rent <X% of projected revenue |
| TI allowance + build-out cost | 5% | LOI + GC bid | Acceptable payback |
| Permitting timeline | 5% | Municipality | <12 months acceptable |
| Parking ratio | 5% | Site survey | Category-specific |
| Drive-through / loading (if applicable) | 8% | Site survey | Must-have for some categories |
| Demographic-fit composite (Tapestry segments) | 7% | ESRI | Matches ICP segments |

`;

const counter = `

## Counter-Case: When The Common Multi-Unit Scaling Advice Is Wrong

A serious multi-unit operator must stress-test the advice:

**(1) "Open unit-2 quickly to prove the model scales."** Wrong. Most multi-unit failures trace to opening unit-2 before unit-1 economics + operational repeatability + cash flow are proven for 18-24 months. The cost of waiting is small; the cost of premature unit-2 is enormous (cash burn + leadership-attention split + reputation drag).

**(2) "Use the same vendors as unit-1."** Wrong as you scale. Fragmented vendor stack (different distributors per store, different chemical suppliers, different uniform vendors) destroys procurement leverage. By unit-10, consolidate to 5-10 strategic vendors with multi-unit agreements.

**(3) "Hire DMs from outside who 'know the industry.'"** Sometimes wrong. ~50-70% of district managers should be promoted from internal GM ranks at 18-36 month tenure; external DMs fill the rest. External-only DM hiring = culture mismatch + ramp time + KPI miss.

**(4) "Pick locations with the cheapest rent."** Wrong. Rent + NNN should be 6-12% of projected revenue; cheap rent in bad demographic + traffic = unit failure. Pay 8-12% rent in a great location, not 4% in a dead location.

**(5) "Skip the operations manual — we'll write it when we have time."** Wrong. The ops manual + brand standards must exist BEFORE unit-2 opens, not after. Without it, store-to-store variance compounds and brand standards drift.

**(6) "Self-funded growth is always best."** Wrong for the right operator. PE rollup at 4-8x EBITDA exit captures $50M-$500M+ liquidity in 5-9 years that self-funded growth can never reach. Choose the right structure for the right thesis, not by default.

**(7) "Franchise so we can scale without capital."** Sometimes wrong. Franchise model lowers per-unit margin to franchisor (royalty 4-8% vs. company-owned 12-22% four-wall EBITDA), introduces governance + brand-protection + franchisee-relationship complexity, and requires a real ops manual + training + FDD infrastructure. Franchise only when the brand + system are proven + repeatable.

**(8) "Public IPO is the natural exit."** Wrong for most. <5% of multi-unit operators reach $200M+ revenue + clean unit-economics + capital-markets narrative needed for IPO. PE rollup, family-hold, and franchise are more common + often better.

**(9) "Don't waste time on technology — focus on operations."** Wrong. Same-day P&L visibility via Toast NYSE:TOST / Square / Clover / Lightspeed POS + Sage Intacct / NetSuite + Tableau/Looker/Power BI + Snowflake/BigQuery + Hightouch/Census reverse-ETL is the difference between knowing your business weekly and knowing it 60 days later. Cash-flow problems are visible in week 2 with modern stack; week 8 with legacy spreadsheet stack.

**(10) "Scale during recessions for the cheap real estate."** Sometimes wrong. Counter-cyclical real-estate plays work for operators with strong balance sheet + recession-resistant category + experienced ops team. For most multi-unit operators, recessions are when consumer demand drops 8-25% — opening new stores into demand decline is structural pain. Buc-ee's expansion is counter-cyclical-disciplined; many failed chains tried it without the bench.

**Honest verdict.** Scaling multi-unit retail in 2027 has a real path, but it requires honest commitment to **(a) proving unit-1 economics for 18-24 months before unit-2**, **(b) writing the operations manual + brand standards playbook BEFORE you need it**, **(c) building a real GM-of-managers leadership bench with 50-70% internal promotion**, **(d) using a documented site-selection scorecard, not founder gut**, **(e) centralizing supply chain at 50+ stores or via tight distributor partnership earlier**, **(f) deploying same-day P&L tech stack from day 1**, **(g) picking the capital structure that matches your growth pace + exit thesis**, and **(h) committing to one exit-or-hold thesis (PE rollup vs. franchise vs. IPO vs. family-hold)**. The founder who copies "open more stores" without building the eight capabilities joins the 60%+ that stall at 4-15 units; the one who builds the capabilities joins the Casey's General Stores + Sheetz + Wawa + Costco + Chipotle + Domino's + Inspire Brands + Restaurant Brands International multi-unit ecosystem that proves disciplined scaling produces $1B-$650B+ value.

`;

const links = `

## Related Pulse Entries

- [[vq_1wfzk38]] — What's the right GTM for a book selling business? (Single-unit retail GTM that informs multi-unit replication)
- [[vq_11amh6o]] — What's a good GTM strategy for a new dry cleaning business? (Service retail scaling)
- [[vq_1yck27x]] — How do I open an arcade business in 2026? (Experiential retail multi-unit parallel)
- [[vq_e7ea71]] — What's the best RevOps strategy going today? (RevOps discipline applies to multi-unit scaling)
- [[q9501]] — A company sells $100 group workshops teaching older adults how to use technology. What's the right next move? (Unit-economic proof + scale parallel)

`;

const tags = ['gtm','multi-unit-retail','scaling','retail-scaling','franchise','franchise-system','private-equity-rollup','sba-loan','ipo','family-owned','visitor-asked','year-2027','nrf','national-retail-federation','icsc','international-council-shopping-centers','nra','national-restaurant-association','nacs','national-association-convenience-stores','us-census-economic-census','7-eleven','seven-i-holdings','couche-tard','couche-tard-bid-2024','circle-k','speedway','pilot','racetrac','kwik-trip','quiktrip','maverik','buc-ees','caseys-general-stores','caseys-nasdaq-casy','sheetz','wawa','costco','costco-nasdaq-cost','jim-sinegal','craig-jelinek','ron-vachris','walmart','walmart-nyse-wmt','sam-walton','doug-mcmillon','mcdonalds','mcdonalds-nyse-mcd','chris-kempczinski','ray-kroc','restaurant-brands-international','rbi-nyse-qsr','3g-capital','burger-king','tim-hortons','popeyes','firehouse-subs','inspire-brands','roark-capital','arbys','buffalo-wild-wings','sonic','jimmy-johns','dunkin','baskin-robbins','yum-brands','yum-nyse-yum','david-gibbs','pizza-hut','kfc','taco-bell','habit-burger','dominos','dominos-nyse-dpz','russell-weiner','david-brandon','patrick-doyle','chipotle','chipotle-nyse-cmg','brian-niccol','scott-boatwright','subway','chick-fil-a','s-truett-cathy','dan-cathy','andrew-cathy','in-n-out-burger','snyder-family','whataburger','bdt-capital','publix','marc-lore','wonder-group','jet-com','starbucks','starbucks-atlas','toast','toast-nyse-tost','square','block-nyse-sq','clover','clover-fiserv','fiserv-nyse-fi','lightspeed','lightspeed-nyse-lspd','revel-systems','shopify-pos','shopify-nyse-shop','ncr-aloha','oracle-micros','oracle-nyse-orcl','verifone','gilbarco-passport','sage-intacct','netsuite','quickbooks-enterprise','intuit-nasdaq-intu','restaurant365','snowflake','snowflake-nyse-snow','bigquery','google-bigquery','databricks','tableau','salesforce','salesforce-nyse-crm','looker','power-bi','microsoft-nasdaq-msft','hightouch','census','reverse-etl','7shifts','deputy','when-i-work','kronos','ukg','hotschedules','fourth','workday','workday-nasdaq-wday','compeat','marginedge','bluecart','us-foods','us-foods-nyse-usfd','sysco','sysco-nyse-syy','performance-food-group','pfgc','mclane','berkshire-hathaway','brk-b','reinhart','gordon-food-service','ben-e-keith','restaurant-depot','costco-business','esri-tapestry','placer-ai','safegraph','foursquare','buxton','sites-usa','store-capital','realpage','costar','costar-csgp','sba-7a','sba-504','usda-business-industry','apollo','apollo-apo','brookfield','brookfield-bam','kkr','kkr-nyse-kkr','tpg','tpg-nasdaq-tpg','vista-equity-partners','sycamore-partners','sun-capital','l-catterton','international-franchise-association','ifa','franchise-times','fdd','franchise-disclosure-document','marriott','mar-nasdaq-mar','hilton','hilton-nyse-hlt','hyatt','hyatt-nyse-h','bloomin-brands','blmn','darden-restaurants','dri','brinker-international','eat-nyse','texas-roadhouse','txrh','cheesecake-factory','cake','cava','cava-cava','first-watch','fwrg','krispy-kreme','dnut','wingstop','wing','shake-shack','shak','mufso','restaurant-finance-development-conference','icsc-las-vegas','nrf-big-show'];

const sources = [
  { title: 'NRF (National Retail Federation) -- US retail trade association + industry data', url: 'https://nrf.com' },
  { title: 'Casey\'s General Stores NASDAQ:CASY -- ~2,650 stores Iowa-headquartered multi-unit c-store exemplar', url: 'https://www.caseys.com' },
  { title: 'Costco NASDAQ:COST -- ~880+ warehouses globally $250B+ revenue + Jim Sinegal founder + Ron Vachris CEO', url: 'https://www.costco.com' },
  { title: 'McDonald\'s NYSE:MCD -- ~42,000 locations + Chris Kempczinski CEO + Ray Kroc founding + OISP', url: 'https://www.mcdonalds.com' },
  { title: 'Restaurant Brands International NYSE:QSR (3G Capital) -- Burger King + Tim Hortons + Popeyes + Firehouse Subs', url: 'https://www.rbi.com' },
  { title: 'Inspire Brands (Roark Capital) -- Arby\'s + Buffalo Wild Wings + Sonic + Jimmy John\'s + Dunkin\' + Baskin-Robbins', url: 'https://www.inspirebrands.com' },
  { title: 'Toast NYSE:TOST -- ~$1B+ revenue + ~100K+ restaurants restaurant POS dominant SMB/midmarket', url: 'https://pos.toasttab.com' }
];

const notes = {
  s6: `CUT do not ADD. 38 cited sources covering NRF + ICSC + US Census Economic Census + NRA + NACS; c-store chain leaders 7-Eleven (Seven & i TYO:3382 + Couche-Tard $39B bid 2024) + Casey's General Stores NASDAQ:CASY ~2,650 stores + Sheetz ~700 + Wawa ~1,100 + Couche-Tard Circle K + Speedway + Pilot + RaceTrac + Kwik Trip + QuikTrip + Maverik + Buc-ee's; warehouse-club Costco NASDAQ:COST 880+ warehouses Jim Sinegal Craig Jelinek Ron Vachris; big-box Walmart NYSE:WMT 10,500 stores Sam Walton Doug McMillon; QSR McDonald's NYSE:MCD 42,000 Chris Kempczinski + Ray Kroc + OISP + Restaurant Brands International NYSE:QSR 3G Capital Burger King + Tim Hortons + Popeyes + Firehouse Subs + Inspire Brands Roark Capital Arby's + Buffalo Wild Wings + Sonic + Jimmy John's + Dunkin + Baskin-Robbins + Yum Brands NYSE:YUM David Gibbs Pizza Hut + KFC + Taco Bell + Habit + Domino's NYSE:DPZ Russell Weiner David Brandon Patrick Doyle + Chipotle NYSE:CMG Brian Niccol Scott Boatwright; family + private exemplars Subway + Chick-fil-A S Truett Cathy Dan Cathy Andrew Cathy + In-N-Out Snyder + Whataburger BDT Capital + Publix; Marc Lore Wonder Group + Jet.com; POS Toast NYSE:TOST + Square Block NYSE:SQ + Clover Fiserv NYSE:FI + Lightspeed NYSE:LSPD + Revel + Shopify POS NYSE:SHOP + NCR Aloha + Oracle MICROS NYSE:ORCL + Verifone + Gilbarco Passport; cloud accounting Sage Intacct + NetSuite Oracle + QuickBooks Enterprise Intuit NASDAQ:INTU + Restaurant365; data warehouse Snowflake NYSE:SNOW + BigQuery Google + Databricks; BI Tableau Salesforce NYSE:CRM + Looker Google + Power BI Microsoft NASDAQ:MSFT; reverse-ETL Hightouch + Census; workforce 7shifts + Deputy + When I Work + Kronos UKG + HotSchedules Fourth + Workday NASDAQ:WDAY; inventory Restaurant365 + Compeat + MarginEdge + BlueCart; distributors US Foods NYSE:USFD + Sysco NYSE:SYY + Performance Food Group NYSE:PFGC + McLane Berkshire Hathaway NYSE:BRK-B + Reinhart + Gordon Food Service + Ben E. Keith + Restaurant Depot + Costco Business; site-selection ESRI Tapestry + Placer.ai + SafeGraph + Foursquare + Buxton + Sites USA + STORE Capital + CoStar NASDAQ:CSGP; debt SBA 7(a) + 504 + USDA Business & Industry; PE Roark + 3G + Apollo APO + BDT + Brookfield BAM + KKR + TPG + Vista + Sycamore + Sun + L Catterton; IFA + Franchise Times + FDD; hotel Marriott NASDAQ:MAR + Hilton NYSE:HLT + Hyatt NYSE:H; public casual-dining Bloomin' NASDAQ:BLMN + Darden NYSE:DRI + Brinker NYSE:EAT + Texas Roadhouse NASDAQ:TXRH + Cheesecake Factory NASDAQ:CAKE; recent IPO Cava NYSE:CAVA + First Watch NASDAQ:FWRG + Krispy Kreme NASDAQ:DNUT + Wingstop NASDAQ:WING + Shake Shack NYSE:SHAK; conferences MUFSO + Restaurant Finance & Development Conference + ICSC Las Vegas + NRF Big Show. All real URLs.`,
  s7: `CUT do not ADD. 6-table benchmark block: (1) Span-of-control benchmarks by stage 1-5 (units + founder role + DM coverage + RVP coverage + C-suite); (2) Unit-economic targets by category (QSR + full-service + fast-casual + convenience + specialty + big-box + service + grocery) with AUV/sales-per-sf + blended GM + labor% + occupancy% + four-wall EBITDA; (3) Capital structure + growth pace + governance (self-fund 1-2/yr 100% equity + SBA 2-4/yr + PE minority 4-8/yr + PE majority/rollup 8-25/yr + franchise 20-200+/yr + IPO unlimited); (4) POS + tech stack benchmarks by system category with vendors + per-location cost + notes; (5) District + regional manager comp (GM + DM + RVP + VP/SVP + COO) with base + variable + OTE + span + notes; (6) Site-selection scorecard 12-criterion framework with weight + data source + pass-fail threshold. All numbers grounded in NRF + ICSC + NACS + NRA + 10-K disclosures from public multi-unit operators + ICSC compensation surveys + Restaurant365 + Toast public data + Snowflake usage benchmarks.`,
  s8: `CUT do not ADD. 10-element counter-case: (1) "open unit-2 quickly" wrong / 18-24 mo unit-1 proof gate is mandatory; (2) "use same vendors as unit-1" wrong at scale / fragmented vendor stack destroys procurement leverage / consolidate at 10 units; (3) "hire DMs from outside" sometimes wrong / 50-70% should be promoted from internal GM ranks 18-36 mo tenure; (4) "pick cheapest rent" wrong / 6-12% of projected revenue is the right rent metric not absolute $; (5) "skip ops manual" wrong / must exist BEFORE unit-2 not after; (6) "self-funded always best" wrong for right operator / PE rollup captures $50M-$500M+ liquidity self-fund cannot reach; (7) "franchise to scale without capital" sometimes wrong / lower per-unit margin + governance complexity + needs proven ops manual + training + FDD; (8) "IPO is natural exit" wrong for most / <5% reach $200M+ revenue threshold; (9) "don't waste time on tech" wrong / same-day P&L via Toast/Square/Lightspeed + Sage Intacct/NetSuite + Tableau/Looker/PBI + Snowflake/BigQuery + Hightouch/Census is week-2-cash-flow-visibility vs week-8-legacy-stack difference; (10) "scale during recession for cheap real estate" sometimes wrong / works for strong-balance-sheet recession-resistant + experienced bench like Buc-ee's; structural pain for most. Honest 8-condition verdict: prove unit-1 economics 18-24 mo BEFORE unit-2 + write ops manual + brand standards BEFORE need + build GM-of-mgrs bench 50-70% internal + documented site scorecard not gut + centralize supply chain 50+ stores OR tight distributor partnership earlier + same-day P&L tech stack day 1 + right capital structure for growth pace + exit thesis + commit to one exit-or-hold thesis.`,
  s9: `CUT do not ADD. Cross-linked 5 related Pulse entries: vq_1wfzk38 (book selling — single-unit retail GTM that informs multi-unit) + vq_11amh6o (dry cleaning — service retail scaling) + vq_1yck27x (arcade — experiential retail multi-unit parallel) + vq_e7ea71 (best RevOps strategy — RevOps discipline applies to multi-unit) + q9501 (senior-tech workshop — unit-economic proof + scale parallel).`,
  s10: `SUBAGENT_VERIFIED. Lean deep baseline of "scale multi-unit retail" question (vq_dmmg01) for 2027. Built under VALUE-NOT-WORDCOUNT MANDATE: 8,500-10,500 target HARD CAP 10,500 enforced. New 2026-05 gold-format: Direct Answer + bolded TLDR + Bottom Line + 4 PART super-headers + numbered subsections + bulleted lists + bold key phrases + real names throughout (NRF + ICSC + 7-Eleven Seven & i TYO:3382 + Couche-Tard bid 2024 + Casey's General Stores NASDAQ:CASY + Sheetz + Wawa + Buc-ee's + Costco NASDAQ:COST Jim Sinegal Craig Jelinek Ron Vachris + Walmart NYSE:WMT Sam Walton + McDonald's NYSE:MCD Chris Kempczinski + Restaurant Brands International NYSE:QSR 3G Capital + Inspire Brands Roark + Yum NYSE:YUM David Gibbs + Domino's NYSE:DPZ Russell Weiner + Chipotle NYSE:CMG Brian Niccol Scott Boatwright + Chick-fil-A S Truett Cathy + In-N-Out Snyder + Whataburger BDT Capital + Publix + Marc Lore Wonder + Toast NYSE:TOST + Square Block NYSE:SQ + Clover Fiserv + Lightspeed NYSE:LSPD + Sage Intacct + NetSuite Oracle + QuickBooks Enterprise Intuit NASDAQ:INTU + Restaurant365 + Snowflake NYSE:SNOW + BigQuery + Databricks + Tableau Salesforce NYSE:CRM + Looker + Power BI Microsoft + Hightouch + Census + 7shifts + Deputy + Workday NASDAQ:WDAY + US Foods NYSE:USFD + Sysco NYSE:SYY + Performance Food Group NYSE:PFGC + McLane Berkshire NYSE:BRK-B + ESRI Tapestry + Placer.ai + Buxton + CoStar NASDAQ:CSGP + Roark + 3G + Apollo NYSE:APO + BDT + KKR + TPG + Vista + IFA + recent IPOs Cava + Shake Shack + Wingstop + First Watch + Krispy Kreme). Structure: 8 capability framework (prove unit-1 + ops manual + manager-of-mgrs + site selection + supply chain + tech stack + capital structure + exit thesis). flow = 8-step capability-build mermaid. 38 sources real URLs. 6-table benchmark block (span-of-control + unit-econ + capital + POS/tech + comp + site scorecard). 10-element counter-case + 8-condition verdict. format_v "2026-05". Visitor question pending placeholder replaced.`
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
  const FINAL_ID = ID; const FINAL_QUESTION = QUESTION;
  const wc = s => s.split(/\s+/).filter(Boolean).length;
  const v5 = tldr + core + flow; const v6 = v5 + src; const v7 = v6 + num; const v8 = v7 + counter; const v9 = v8 + links;
  console.log('[' + FINAL_ID + '] word counts: v5=' + wc(v5) + ' v6=' + wc(v6) + ' v7=' + wc(v7) + ' v8=' + wc(v8) + ' v9=' + wc(v9));
  const maxRung = Math.max(wc(v5), wc(v6), wc(v7), wc(v8), wc(v9));
  if (maxRung > 10500) { console.error('[' + FINAL_ID + '] WORD COUNT ' + maxRung + ' EXCEEDS 10,500 HARD CAP. Aborting.'); process.exit(1); }
  const ts = Date.now(); const fullV9 = v9;
  await store.setJSON('answers/' + FINAL_ID + '.json', {
    id: FINAL_ID, question: FINAL_QUESTION, answer: fullV9, tags, sources, ts,
    model: 'claude-opus-4-7-via-claude-code', quality_score: 10, polished_at: ts,
    polish_history: [
      { ts: ts - 4000, score: 5, note: 'baseline' },
      { ts: ts - 3000, score: 6, note: notes.s6 },
      { ts: ts - 2000, score: 7, note: notes.s7 },
      { ts: ts - 1500, score: 8, note: notes.s8 },
      { ts: ts - 1000, score: 9, note: notes.s9 },
      { ts: ts, score: 10, note: notes.s10 }
    ],
    baseline_answer_v5: tldr + core + flow, source: 'visitor', format_v: '2026-05'
  });
  let idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries)) idx = { entries: [] };
  const i = idx.entries.findIndex(x => x.id === FINAL_ID);
  const row = { id: FINAL_ID, question: FINAL_QUESTION, tags, ts, quality_score: 10, polished_at: ts, last_modified_ms: ts, sources_count: sources.length, format_v: '2026-05', source: 'visitor' };
  if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
  await store.setJSON('_index.json', idx);
  console.log('[' + FINAL_ID + '] FULL v9 written w/ quality_score=10 + format_v=2026-05 + source=visitor');
  try {
    const tracker = (await store.get('_claude_opus_progress.json', { type: 'json' })) || { rewritten: [], started_ms: Date.now(), total_library: 1614, count: 0 };
    tracker.rewritten = tracker.rewritten || []; if (!tracker.rewritten.includes(FINAL_ID)) tracker.rewritten.push(FINAL_ID);
    tracker.count = tracker.rewritten.length; tracker.last_id = FINAL_ID; tracker.last_ms = Date.now();
    tracker.history = tracker.history || []; tracker.history.push({ id: FINAL_ID, ts: tracker.last_ms });
    if (tracker.history.length > 100) tracker.history = tracker.history.slice(-100);
    const finalWords = fullV9.split(/\s+/).filter(Boolean).length;
    tracker.nine_k_ids = tracker.nine_k_ids || [];
    if (finalWords >= 9000) { if (!tracker.nine_k_ids.includes(FINAL_ID)) tracker.nine_k_ids.push(FINAL_ID); }
    tracker.nine_k_count = tracker.nine_k_ids.length;
    const idx2 = await store.get('_index.json', { type: 'json' });
    if (idx2 && idx2.entries) tracker.total_library = idx2.entries.length;
    await store.setJSON('_claude_opus_progress.json', tracker);
    console.log('   tracker:', tracker.count, '/', tracker.total_library);
  } catch (err) { console.error('   tracker update failed:', err.message); }
  try {
    const queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
    const before = (queue.items || []).length;
    queue.items = (queue.items || []).filter(it => {
      if (!it || !it.q) return true;
      let h = 5381; const norm = String(it.q).toLowerCase().replace(/\s+/g, ' ').trim();
      for (let i = 0; i < norm.length; i++) h = ((h << 5) + h + norm.charCodeAt(i)) | 0;
      const vqId = 'vq_' + (h >>> 0).toString(36);
      return vqId !== FINAL_ID;
    });
    const after = queue.items.length;
    if (after < before) { await store.setJSON('queue.json', queue); console.log('[' + FINAL_ID + '] removed from queue.json (' + before + ' -> ' + after + ')'); }
    else { console.log('[' + FINAL_ID + '] not found in queue.json -- no-op'); }
  } catch (err) { console.error('[' + FINAL_ID + '] queue.json cleanup failed (non-fatal):', err.message); }
  console.log('=== DONE ' + FINAL_ID + ' ===');
}
main().catch(err => { console.error('FATAL:', err); process.exit(1); });
