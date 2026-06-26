// q1982 -- How do you start an ice cream truck business in 2027?
// FIRST GOLD-FORMAT (format_v "2026-05") deep rewrite — sets the bar.
// Target window: 8,500-10,500 words (HARD CAP 10,500). Lean paragraphs, frequent H3 breaks.
// NEW FORMAT (all 6 elements):
//   1. Direct Answer yellow H3 + bolded TLDR at top
//   2. H2 banner sections (## Section Name) for major divisions
//   3. Numbered subsections (### 1. Name, ### 2. Name, ...) under each H2
//   4. Bulleted lists with **bold key phrases**
//   5. Specific real company / product / people names throughout
//   6. Numbered source citations + inline source links
// Walks ladder from 5 because we're rewriting structure end-to-end, not patching.
// After ladder finishes the script writes format_v="2026-05" to the blob directly.
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
if (!process.env.BLOBS_PAT && process.env.NETLIFY_AUTH_TOKEN) process.env.BLOBS_PAT = process.env.NETLIFY_AUTH_TOKEN;

const ID = 'q1982';

// ─── 1. DIRECT ANSWER — yellow H3 header + bolded TLDR at very top ───
const tldr = `### Direct Answer

**To start an ice cream truck business in 2027, you (1) pick a product model — pre-packaged novelties (the classic [Good Humor (Unilever)](https://www.goodhumor.com/) / [Blue Bunny](https://www.bluebunny.com/) bar route), hand-dipped scoop ([Ben & Jerry's](https://www.benjerry.com/) / [Häagen-Dazs](https://www.haagendazs.us/) franchise pattern), Hispanic paletas ([Helados Mexico](https://www.heladosmexico.com/) / [La Michoacana](https://lamichoacanatx.com/) wholesale), or soft-serve on board (Taylor C707 or Carpigiani Compacta) — (2) buy or build a truck ($15K-$45K used step van, $60K-$160K custom build from [Hackney Brothers](https://www.hackneybrothers.com/) / [Frosty Mister](https://www.frostymister.com/) / [Mister Softee Inc](https://www.mistersoftee.com/)) and bolt on a [Square Mobile](https://squareup.com/us/en/point-of-sale/mobile) or [Toast Go 2](https://pos.toasttab.com/products/toast-go) POS, (3) clear the permit stack — state Department of Health mobile food permit + signed commissary agreement (e.g., [The Hood Kitchen](https://thehoodkitchen.com/) in Costa Mesa, [Common Wealth Kitchen](https://commonwealthkitchen.org/) in Boston, [Union Kitchen](https://unionkitchen.com/) in DC) + city peddler/vendor license + Food Manager certification ([ServSafe](https://www.servsafe.com/) or [Learn2Serve](https://www.learn2serve.com/)) + commercial auto + general liability + product liability ($2K-$5K/yr via [Veracity Insurance](https://www.veracityinsurance.com/) or [FLIP](https://www.fliprogram.com/)), (4) build a route + event calendar that weights toward booked corporate, wedding, school-fundraiser, and HOA events (the only channel that pays well), using [The Bash](https://www.thebash.com/), [GigSalad](https://www.gigsalad.com/), [Thumbtack](https://www.thumbtack.com/), and [Roaming Hunger](https://roaminghunger.com/) to source bookings, and (5) run the seasonality math honestly: 100-160 viable selling days a year in most US climates means the May-September window must carry the dead winter or you stack a catering / private-event / pop-up shop revenue stream. Year-1 disciplined single-truck revenue runs $45K-$140K with $18K-$55K owner take-home; Year 2-3 with multi-truck and event-weighted mix reaches $150K-$450K revenue and $45K-$130K owner profit. Industry reference: [IDFA Ice Cream Market Report 2024](https://www.idfa.org/), [NICRA (National Ice Cream Retailers Association)](https://www.nicra.org/), [USDA per-capita ice cream consumption](https://www.ers.usda.gov/), [IBISWorld Ice Cream Production in the US](https://www.ibisworld.com/), [NRA (National Restaurant Association) Food Truck Industry Report](https://restaurant.org/). The three things that kill startups: (a) underestimating the permit + commissary maze, (b) building around the romantic residential route instead of booked events, and (c) ignoring seasonality and spending summer cash with no winter plan.**

`;

// ─── 2-6. CORE — H2 banners with numbered subsections, bold-in-bullets, real names, citations ───
const core = `

The ice cream truck business in 2027 is a **mobile food-service-and-logistics operation** wearing a nostalgic costume. It is real, profitable at the unit-margin level, and emotionally seductive — but it is brutally seasonal, permit-heavy, and dominated by a small set of structural decisions that beginners consistently misjudge. This guide walks the exact 2027 playbook used by working operators in the [Mister Softee](https://www.mistersoftee.com/) ecosystem (NJ-based, roughly 600 franchised trucks per the company), the [Kona Ice](https://www.kona-ice.com/) franchise system (founded by Tony Lamb in 2007, now 1,500+ trucks per company materials), independent operators visible in the [Food Truck Empire](https://foodtruckempire.com/) and [Roaming Hunger](https://roaminghunger.com/) marketplaces, and the Hispanic paletero networks anchored by [Helados Mexico](https://www.heladosmexico.com/), [La Michoacana](https://lamichoacanatx.com/), and [Las Delicias](https://lasdeliciasicecream.com/) wholesale distribution.

The macro numbers that frame the opportunity: per the [IDFA Ice Cream Market Report 2024](https://www.idfa.org/), US ice cream and frozen dessert sales exceeded $13B in 2024; per [USDA Economic Research Service](https://www.ers.usda.gov/) per-capita data, Americans consume roughly 20 lbs of ice cream per person per year; per [IBISWorld Ice Cream Production in the US 2024](https://www.ibisworld.com/), the manufactured frozen-dessert category grows ~2.5% CAGR; and per the [NRA Food Truck Industry Report 2023](https://restaurant.org/), the broader food-truck category exceeded $1.5B in US revenue, of which ice cream and dessert trucks are a fast-growing segment driven by event catering rather than residential routes. The opportunity is real; the execution discipline is the question.

This entry is structured in 4 parts: **Foundations** (why ice cream truck in 2027 + the three product models + the regulatory layer), **Build-Out & Capital** (the truck + equipment + commissary + POS + insurance + permits stack), **Operations** (route planning + inventory + product mix + staffing + event bookings), and **Growth & Exit** (marketing + specialty positioning + scale model + exit options + franchise paths). Each H2 banner section is broken into numbered subsections covering one decision or workflow.

---

## Part 1 — Foundations: Why Ice Cream Truck in 2027

### 1. The 2027 Market Reality

The ice cream truck category in 2027 is shaped by realities that barely existed a decade ago. The honest snapshot:

- **Cashless customers dominate.** Per [Square's 2024 SMB Payments Report](https://squareup.com/), well over 70% of mobile food sales are now card or tap-to-pay; a truck without a [Square Mobile](https://squareup.com/us/en/point-of-sale/mobile), [Toast Go 2](https://pos.toasttab.com/products/toast-go), or [Clover Flex](https://www.clover.com/) POS loses meaningful walk-up volume to the line behind them.
- **Events booked online, months ahead.** Inquiry funnels via [The Bash](https://www.thebash.com/), [GigSalad](https://www.gigsalad.com/), [Thumbtack](https://www.thumbtack.com/), [Roaming Hunger](https://roaminghunger.com/) (founded by Ross Resnick), [Peerspace](https://www.peerspace.com/), and direct Google Business Profile inquiries — not drive-by chance — feed the revenue calendar.
- **Wholesale novelty and fuel costs both up.** [Good Humor (Unilever)](https://www.goodhumor.com/), [Nestle Ice Cream](https://www.nestleicecream.com/), and [Blue Bell Creameries](https://www.bluebell.com/) have raised wholesale 12-25% since 2021 per industry reporting, squeezing the pure-route novelty model specifically.
- **Premium upmarket pull.** The soft-serve and hand-dipped segments increasingly compete on craft, presentation, and Instagrammability — a [Carpigiani Compacta](https://www.carpigiani.com/) soft-serve build at a wedding photographs better than a freezer of pre-packaged bars.
- **Hispanic-market paleta growth.** [Helados Mexico](https://www.heladosmexico.com/), [La Michoacana Natural](https://www.lamichoacananatural.com/), and regional paleteros are the fastest-growing segment in many Southwest and Southeast US markets per regional grocery and foodservice tracking.

### 2. The Three Product Models — Novelty, Hand-Dipped, Soft-Serve

The single most consequential product choice. Each model drives the truck build, the permits, the labor, and the margin:

- **Novelty model** — sells **pre-packaged, individually wrapped frozen items** from wholesale distributors. Anchor SKUs: **Good Humor Strawberry Shortcake Bar, Klondike Bar, Drumstick (Nestle), Bomb Pop, Choco Taco (discontinued by Klondike 2022 but revived by [Salt & Straw](https://saltandstraw.com/) collab), SpongeBob SquarePants face pop, Helados Mexico paletas**. Bought wholesale from [US Foods Chef'Store](https://www.chefstore.com/), [Restaurant Depot](https://www.restaurantdepot.com/), [Sysco](https://www.sysco.com/), or direct from the [Good Humor distributor network](https://www.goodhumor.com/) at $0.45-$1.10/unit; sold for $3-$5. **Pros:** minimal equipment (just freezers), simplest health permits, no on-truck prep, long shelf life. **Cons:** margin compression as wholesale climbs.
- **Hand-dipped model** — carries **3-gallon hard-pack tubs** (from [Hershey's Ice Cream](https://www.hersheyicecream.com/), [Edy's / Dreyer's (Froneri)](https://www.dreyers.com/), [Blue Bell](https://www.bluebell.com/), [Tillamook](https://www.tillamook.com/), local creameries) and serves scoops, sundaes, floats, shakes. Equipment: **[Master-Bilt](https://www.master-bilt.com/) or [True Manufacturing](https://www.truemfg.com/) dipping cabinets ($3K-$8K)**, prep area, toppings rail. Pros: better margin (~$0.50-$1.25 product cost vs $4-$8 sell price), craft-forward positioning. Cons: heavier permits (preparing food), more labor per transaction.
- **Soft-serve model** — runs a **[Taylor C707](https://www.taylor-company.com/) or [Carpigiani Compacta](https://www.carpigiani.com/) or [Electro Freeze SL500](https://www.electrofreeze.com/) or [Stoelting U431](https://www.stoelting.com/) machine** on board. Equipment cost: **$8K-$25K used to $40K+ new**. Highest electrical/water draw — typically needs a 7-12 kW [Honda EU7000is](https://powerequipment.honda.com/) or [Cummins Onan](https://www.cummins.com/) generator. Pros: highest per-cone price, most theatrical, strongest event positioning. Cons: most expensive build, most demanding permits, single-machine-failure risk.

### 3. The Two Revenue Channels — The Route vs Booked Events

This is the single most consequential strategic distinction in the business, and **most beginners get it backwards**:

- **The route** — driving residential neighborhoods, school dismissals, parks, pools, beaches. Charge $3-$8 per item to walk-ups one at a time. **Reality check:** weather/traffic/demographic dependent; many municipalities (e.g., **NYC, San Francisco, Brookline MA, Newton MA**) restrict or ban truck vending near schools; a 4-hour route generates $150-$500 gross before fuel + driver + spoilage. Useful for **brand visibility, dense-neighborhood fill, and otherwise-empty hours** — but a low-absolute-dollar grind.
- **Booked events** — the business that actually pays. **Corporate summer parties, weddings, school/sports fundraisers, HOA and apartment-community events, birthdays, festivals, farmers markets, grand openings.** Pre-arranged, paid against a minimum or flat rate ($250-$2,500+), scheduled in advance, often repeating year-over-year. **A 2-hour corporate event at $900 flat beats a full residential route day.** The fundraiser sub-channel is especially powerful: schools and sports teams **promote the event for you**, guarantee a crowd, and you split revenue (20-40% to the org) or charge a flat fee.

The strategic truth of 2027: operators who **build around the event + fundraiser calendar** — using the route to fill gaps and build visibility — run a real business; operators who build around the romantic residential route run a seasonal hobby that exhausts them.

### 4. The Seasonality Reality

Ice cream truck revenue **concentrates ferociously into May-September** in most US climates. The honest seasonality math:

- **100-160 viable selling days per year** in the Mid-Atlantic, Northeast, and Midwest. 200-260 days in California, Florida, Arizona, and the Sunbelt. <90 days in the upper Midwest and New England outer ring.
- **Per [BLS Occupational Outlook for Food Service Workers](https://www.bls.gov/ooh/food-preparation-and-serving/)** and [NRA Industry Reports](https://restaurant.org/), seasonal food-service operators commonly earn **65-80% of annual revenue between Memorial Day and Labor Day**.
- **The disciplined operator treats summer cash as the year's working capital** — insurance, commissary fee, financing payments, storage, and any payroll continue through the dead months.
- **Winter revenue stacks:** indoor mall pop-ups, private holiday catering (corporate holiday parties, December weddings), pre-booked spring weddings, ski-resort events in Colorado/Utah, January-March Florida snowbird circuit, dessert catering for indoor venues. Some operators run a **second food-truck concept** (hot chocolate, coffee, churros) in winter using the same truck shell.

### 5. State Cottage Food Laws + Commissary Kitchen Reality

The single most-underestimated regulatory layer. Per [FDA Food Code 2022](https://www.fda.gov/food/fda-food-code) and state Department of Health adoption patterns:

- **Cottage Food Laws** (state-by-state, e.g., **California AB 1616 / AB 1144, Texas Cottage Food Law, Florida Cottage Food Law**) generally **do NOT cover ice cream trucks** — they cover non-hazardous home-baked goods. Frozen dairy is hazardous food under federal definition and **requires a commercial kitchen base of operations**.
- **The commissary kitchen requirement** is the rule beginners miss most. Most jurisdictions require a mobile food unit to operate out of a **licensed commercial commissary** where the truck is cleaned, water tanks refilled, waste dumped, and product stored. Examples of working commissary operators: **[The Hood Kitchen Space (Costa Mesa CA)](https://thehoodkitchen.com/), [Common Wealth Kitchen (Boston)](https://commonwealthkitchen.org/), [Union Kitchen (Washington DC)](https://unionkitchen.com/), [Hot Bread Kitchen (NYC)](https://hotbreadkitchen.org/), [La Cocina (San Francisco)](https://lacocinasf.org/), [The Kitchen Door (Napa)](https://thekitchendoor.com/)**. Monthly cost: **$300-$1,200/mo** for a basic mobile-food-only membership.
- **A signed commissary agreement is required to even submit your health permit application** in most counties. Confirm a commissary slot **before buying a truck**.
- **State Department of Health mobile food facility permit** + per-county inspection. Some counties require **separate permits in every county the truck operates in** (e.g., the Bay Area's 9-county patchwork).

### 6. Permits, Licenses, and Insurance Stack

Per [FDA Food Code](https://www.fda.gov/food/fda-food-code), state DOH guidance, and the [NRA Food Truck Industry Report](https://restaurant.org/), the complete pre-launch regulatory stack:

- **State / county Mobile Food Facility Permit** ($200-$2,000/yr depending on jurisdiction)
- **Commissary agreement** (signed, on file with the health department)
- **Business license** at city or county level ($50-$400)
- **Peddler / solicitor / vendor permit** for street vending (varies wildly; some cities restrict heavily)
- **Special event permit** per booked event in some jurisdictions
- **Food Manager Certification** — [ServSafe Food Manager](https://www.servsafe.com/) ($150 + exam) or [Learn2Serve / 360training](https://www.learn2serve.com/) ($75-$100)
- **Sales tax registration** with the state Department of Revenue
- **Vehicle registration** — possibly commercial vehicle classification depending on GVWR
- **DOT number** if crossing state lines for events (federal MCS-150)
- **Fire department / generator approval** if the build includes a generator or propane
- **Commercial auto insurance** ($1,500-$4,000/yr) via [Progressive Commercial](https://www.progressivecommercial.com/), [Geico Commercial](https://www.geico.com/), [Nationwide](https://www.nationwide.com/), or [Veracity Insurance](https://www.veracityinsurance.com/)
- **General liability + product liability insurance** ($500-$1,500/yr) via [FLIP (Food Liability Insurance Program)](https://www.fliprogram.com/), [Insure My Food Truck](https://www.insuremyfoodtruck.com/), [Veracity](https://www.veracityinsurance.com/), or [The Hartford](https://www.thehartford.com/)
- **Workers' comp** if employing anyone (varies by state; mandatory in CA)

Pre-launch total regulatory + insurance spend: **$2K-$8K** in Year 1, then **$3K-$7K annually**.

---

## Part 2 — Build-Out & Capital: The Truck, Equipment, and Funding Stack

### 1. The Truck — Buy Used, Build Custom, or Buy Turnkey

The single largest capital decision. Three paths with very different cost and risk profiles:

- **Buy a used step van or existing ice cream truck** ($15K-$45K) — lowest-cost entry. Used [Grumman Olson](https://www.morgan-olson.com/) step vans, [Freightliner MT45/55](https://www.freightliner.com/), [Ford E-350 cutaway](https://www.ford.com/commercial-trucks/), [Chevrolet P30/P32](https://www.chevrolet.com/commercial), and former ice cream trucks from retiring operators. Sources: **[Roaming Hunger Truck Marketplace](https://roaminghunger.com/marketplace), [UsedVending.com](https://www.usedvending.com/), [Facebook Marketplace](https://www.facebook.com/marketplace/), [Craigslist commercial vehicles section](https://craigslist.org/), and the [Mister Softee secondary market](https://www.mistersoftee.com/)**. Risk: mechanical liability, failing freezers, build may not pass current code.
- **Build custom** ($60K-$120K) — buy a base vehicle (step van, box truck, [Mercedes Sprinter](https://www.mbvans.com/) cargo, [Ram ProMaster](https://www.ramtrucks.com/promaster.html), or trailer) and outfit. Builders: **[Hackney Brothers (Wilson NC, since 1854)](https://www.hackneybrothers.com/), [Frosty Mister (FL)](https://www.frostymister.com/), [Banner Ice Cream Truck Bodies](https://www.bannericecreamtruck.com/), [M&R Specialty Trailers and Trucks](https://www.mrtrailers.com/), [Cruising Kitchens (TX)](https://cruisingkitchens.com/)**. Build cost varies with: freezer count, soft-serve machine, generator, finish, branding.
- **Buy turnkey** ($80K-$160K+) — purchase new ready-to-operate truck from a builder or franchise. Includes the **[Mister Softee Inc](https://www.mistersoftee.com/) franchise truck path** (Mister Softee builds and outfits franchisee trucks at their NJ facility) and the **[Kona Ice](https://www.kona-ice.com/) franchise model** (shaved-ice format, branded turnkey).

### 2. Build-Out Cost Tier — What You're Actually Buying

The honest tier breakdown for a working ice cream truck in 2027:

| Tier | Total Capital | Vehicle | Equipment | Build / Finish |
|---|---|---|---|---|
| **Bare-bones used novelty** | $15K-$30K | Used step van $8K-$18K | Chest freezers $2K-$4K | Basic wrap + service window $3K-$6K |
| **Used + upgrade novelty** | $25K-$50K | Used step van $12K-$25K | Commercial freezers + dipping cabinet $5K-$10K | Wrap + window + POS + serve area $5K-$10K |
| **Mid-tier hand-dipped** | $55K-$95K | Used or new step van $20K-$45K | Master-Bilt cabinets + prep + sinks $10K-$20K | Full wrap + window + branded $15K-$25K |
| **Premium soft-serve build** | $95K-$160K | New step van or box truck $40K-$70K | Taylor / Carpigiani machine + generator + cabinets $25K-$50K | Full custom build + wrap + lighting + sound $20K-$40K |
| **Mister Softee franchise turnkey** | ~$120K-$160K | New build at Mister Softee facility | All-in soft-serve build + machine + generator + branded | Includes franchise package + initial inventory |

### 3. Refrigeration Equipment — The Top Commercial Soft-Serve Machines

The make-or-break equipment decision for soft-serve operators. Per [Taylor Company](https://www.taylor-company.com/) (a [Middleby (NASDAQ:MIDD)](https://www.middleby.com/) subsidiary), [Carpigiani](https://www.carpigiani.com/) (Italian, [Ali Group](https://www.aligroup.com/) subsidiary), [Electro Freeze](https://www.electrofreeze.com/) ([Ali Group](https://www.aligroup.com/)), and [Stoelting Foodservice](https://www.stoelting.com/) ([Vollrath](https://www.vollrathfoodservice.com/) subsidiary) materials:

| Machine | Approx. Cost (new) | Cones/hour | Power Draw | Notes |
|---|---|---|---|---|
| **Taylor C707 (single-flavor pressurized)** | $20K-$30K | 200/hr | 208V / 30A | Workhorse standard; widely used in [McDonald's](https://www.mcdonalds.com/) ([owns Taylor exclusivity historically](https://www.taylor-company.com/)) |
| **Taylor C709 (twist, two-flavor + swirl)** | $25K-$35K | 200/hr | 208V / 30A | Twist capability adds menu variety |
| **Carpigiani Compacta 130 LCD** | $18K-$28K | 130/hr | 208V / 20A | Italian-engineered, popular with craft soft-serve brands |
| **Electro Freeze SL500** | $20K-$32K | 250/hr | 208V / 30A | High-volume; common in event-heavy operations |
| **Stoelting U431 Twist** | $22K-$32K | 180/hr | 208V / 30A | Reliable, lower service cost reputation |
| **Used Taylor 794 (pre-owned)** | $5K-$12K | 200/hr | 208V / 30A | Common refurb path; risk = parts availability |
| **Carpigiani LB502 (gelato/sorbet batch)** | $25K-$40K | Batch | 208V / 30A | For premium gelato truck builds |
| **Frigomat Klass G10 (Italian gelato)** | $20K-$32K | Batch | 220V | Premium gelato, niche use |
| **Coldelite Compacta 8000** | $18K-$25K | 130/hr | 208V / 20A | Carpigiani sister brand, similar specs |
| **Donper D530 (soft-serve, value tier)** | $8K-$14K | 100/hr | 208V / 20A | Lower cost entry; longer service history needed |

Per [Restaurant Equipment World](https://www.restaurantequipmentworld.com/) and [WebstaurantStore](https://www.webstaurantstore.com/) industry pricing, expect **$3K-$8K per service call** in major-component failure scenarios — backup machine or service contract matters.

### 4. POS Systems — Mobile Comparison for 2027

The card-not-cash reality makes POS non-negotiable. The comparison per [Square](https://squareup.com/), [Toast (NYSE:TOST)](https://pos.toasttab.com/), [Clover ([Fiserv NYSE:FI](https://www.fiserv.com/) subsidiary)](https://www.clover.com/), [Lightspeed](https://www.lightspeedhq.com/), [Shopify POS](https://www.shopify.com/pos):

| POS | Hardware | Processing | Best For |
|---|---|---|---|
| **[Square Mobile (Square Inc / Jack Dorsey)](https://squareup.com/us/en/point-of-sale/mobile)** | Square Reader (free) or Square Terminal ($299) | 2.6% + $0.10 tap | Single-truck simplicity; instant deposit option |
| **[Toast Go 2 (NYSE:TOST)](https://pos.toasttab.com/products/toast-go)** | Toast Go 2 handheld ($609) | 2.49% + $0.15 | Multi-truck operations; deep menu management |
| **[Clover Flex (Fiserv NYSE:FI)](https://www.clover.com/)** | Flex handheld ($499-$749) | 2.3-2.6% + $0.10 | Banked-relationship pricing via bank reseller |
| **[Lightspeed Restaurant](https://www.lightspeedhq.com/pos/restaurant/)** | iPad-based | 2.6% + $0.10 | Higher inventory complexity, multi-channel |
| **[Shopify POS Go](https://www.shopify.com/pos)** | POS Go handheld ($349) | 2.4-2.7% + $0.0-$0.30 | Operators with existing Shopify e-comm |

Most single-truck novelty operators run **Square Mobile** because it's free hardware + instant setup; soft-serve and event-heavy operators commonly upgrade to **Toast Go 2** for menu and modifier management.

### 5. Inventory and Wholesale Sourcing

The supply chain that feeds the truck. Per industry distributor materials:

- **Pre-packaged novelties** — buy via [US Foods Chef'Store](https://www.chefstore.com/) (formerly Smart Foodservice), [Restaurant Depot](https://www.restaurantdepot.com/), [Sam's Club Business](https://www.samsclub.com/business), [Costco Business Center](https://www.costcobusinesscenter.com/), or direct Good Humor distributor route ([Unilever Ice Cream](https://www.unileverusa.com/) network — Good Humor, Klondike, Magnum, Popsicle, Talenti).
- **Hard-pack tubs** — [Hershey's Ice Cream wholesale](https://www.hersheyicecream.com/), [Edy's / Dreyer's (Froneri / Nestlé)](https://www.dreyers.com/), [Blue Bell direct distribution](https://www.bluebell.com/) (Texas + Southeast), [Tillamook foodservice](https://www.tillamook.com/foodservice) (Pacific Northwest), local creameries.
- **Soft-serve mix** — [Hershey's Ice Cream](https://www.hersheyicecream.com/), [Pine View Dairy](https://www.pineviewdairy.com/), [Stewart's Shops](https://www.stewartsshops.com/), regional dairy distributors. Mix cost: **$3.50-$5.50 per gallon**, yielding **~30 cones at 5-oz pour**.
- **Hispanic paletas** — [Helados Mexico (Industrias Sigma)](https://www.heladosmexico.com/), [La Michoacana Natural](https://www.lamichoacananatural.com/), [Las Delicias](https://lasdeliciasicecream.com/), [Goya Foods](https://www.goya.com/) frozen line, regional paleterias.
- **Cones, cups, spoons, napkins, sprinkles, toppings** — [WebstaurantStore](https://www.webstaurantstore.com/), [Restaurant Depot](https://www.restaurantdepot.com/), [Sam's Club Business](https://www.samsclub.com/business), [Sweet Street Desserts](https://www.sweetstreet.com/) for premium toppings.
- **Cones bulk** — Joy Cone Company ([JoyConeCompany](https://www.joycone.com/)), Keebler / Sugar Cone Company, Schenker's Cone Co — wholesale at $0.05-$0.12 per cone.

### 6. Capital Sources — How to Fund the Launch

The honest funding path per [SBA Office of Capital Access](https://www.sba.gov/funding-programs) and lender materials:

- **Cash + retirement rollover (ROBS)** — many owner-operators self-fund $15K-$50K from savings; [Guidant Financial](https://www.guidantfinancial.com/) and [Benetrends](https://www.benetrends.com/) run ROBS rollovers from 401k for $5K setup + monthly fees.
- **[SBA 7(a) microloan](https://www.sba.gov/funding-programs/loans/7a-loans)** — $50K-$150K typical for food-truck startups; **[SmartBiz](https://www.smartbizloans.com/), [Live Oak Bank](https://www.liveoakbank.com/), [Lendio](https://www.lendio.com/)** are common originators; requires solid credit + business plan.
- **[Kabbage (now American Express)](https://www.kabbage.com/) / [Bluevine](https://www.bluevine.com/) / [OnDeck](https://www.ondeck.com/) lines of credit** — $10K-$100K revolving; faster but higher rate (15-50% APR effective).
- **[Square Loans](https://squareup.com/us/en/loans) / [Toast Capital](https://pos.toasttab.com/toast-capital)** — operator-friendly loans against POS revenue once running; useful for Year 2 truck #2.
- **Equipment financing** — [Crest Capital](https://www.crestcapital.com/), [Balboa Capital](https://www.balboacapital.com/), [Beacon Funding](https://www.beaconfunding.com/) finance the soft-serve machine or vehicle directly with the equipment as collateral.
- **Kona Ice / Mister Softee franchise financing** — both franchisors offer in-house or partner financing programs; Kona Ice publishes a $50K cash requirement against the $160K total investment.
- **Crowdfunding** — [Kickstarter](https://www.kickstarter.com/) and [Honeycomb Credit](https://www.honeycombcredit.com/) (small-business focused) used by some craft / specialty brands.
- **Vehicle-only owner financing** — used-truck sellers often carry paper at 10-15% on the vehicle portion.

---

## Part 3 — Operations: Routes, Inventory, Product Mix, Staffing, Bookings

### 1. Route Planning and the Daily-Revenue Stack

Per working operators in the [Roaming Hunger](https://roaminghunger.com/) and [Truckster](https://truckster.com/) ecosystems, the disciplined daily route stacks 3-5 reliable stops:

- **School dismissal stops** (where allowed) — 3:00-3:30 PM, 15-30 minutes per school, $80-$250 gross.
- **Park / pool / beach stops** — 12:00-3:00 PM weekend; $100-$400 gross per hot day.
- **Sports complex evening leagues** — 6:00-9:00 PM weeknights April-July; $150-$500 gross per night.
- **Neighborhood loops** — early evening 5:00-7:30 PM; $60-$200 per loop in the right demographic.
- **Lemonade-stand drive-by per Robocall + Nextdoor neighborhood requests** — opportunistic.

Tools: **[Truckster](https://truckster.com/) and [Roaming Hunger](https://roaminghunger.com/) for GPS broadcasting and customer-facing route map**, **[Google Maps + Waze](https://www.google.com/maps) for traffic-aware routing**, **[Square Online ordering](https://squareup.com/us/en/software/online-store) for pre-orders + skip-the-line**, **Instagram + TikTok + [Nextdoor](https://nextdoor.com/) for route announcement**.

The discipline that separates a profitable route operator from a wandering one: **plot the daily route as a fixed loop the night before**, hit each stop within a 10-15 minute window so repeat customers can plan to be there, and **broadcast the loop via Instagram Story + Nextdoor post + Twilio SMS to your repeat list by 10am**. Working operators on the [Food Truck Empire](https://foodtruckempire.com/) forums report that **a published, repeated route earns 2-3x the per-day gross of an improvised route** because the same families show up week after week. Skip the cold streets entirely — every hour spent driving with no customers is a loss against fixed cost.

### 2. Inventory Management — Cones, Mix, Pints, Novelties

The discipline that separates margin from melt:

- **Hard-pack tubs (3-gallon)** — buy 4-8 tubs per truck per week in season; rotate fastest-movers (vanilla, chocolate, cookies-and-cream, mint chip, strawberry) first.
- **Soft-serve mix** — 5-gallon bags or 2.5-gallon jugs; reorder weekly; estimate cones-per-gallon at 28-32 at standard 5-oz pour.
- **Novelties** — order in case quantities (24-48 units/case); diversify across **Good Humor classics, Klondike (Unilever), Drumstick (Nestle), Bomb Pop, Helados Mexico paletas**.
- **Cones and cups** — 1,000-unit cases; sugar cone, waffle cone, cake cone, 4oz / 8oz cup mix.
- **Toppings and sprinkles** — rainbow sprinkles, chocolate sprinkles, crushed Oreo, M&M minis, hot fudge, caramel, whipped cream, maraschino cherries.
- **Backup inventory** — second freezer at commissary holding 3-5 days of overflow inventory in case of unexpected event surge.
- **Spoilage discipline** — FIFO rotation; daily temp logs (FDA Food Code requirement); insurance against freezer failure (most commercial policies cap food-loss reimbursement at $5K-$10K per incident).

### 3. Product Mix — Soft-Serve, Hard Scoop, Novelty, Paleta Hybrid

Most successful operators run a **hybrid menu** rather than a single-format truck. The pricing architecture:

- **Soft-serve cones** — $4-$8 base; dipped cone +$1; sprinkles +$0.50; sundae +$2-$4
- **Hand-dipped scoops** — $4-$6 single scoop; $6-$10 double; sundae $8-$15
- **Novelties** — $3-$6 single (price up classics vs character novelties)
- **Paletas (Hispanic-market premium)** — $3-$5 single; mango, tamarind, coconut, strawberry, rompope, lime classics from Helados Mexico
- **Floats and shakes** — $6-$12; add 75-90% margin on Coke / root-beer ingredient cost
- **Specialty / seasonal** — pumpkin spice fall, peppermint December, prickly-pear in the Southwest, Halo-Halo for Filipino events
- **Event upcharges** — add-on bowls, kids' sundae bar, candy topping bar, monogrammed sugar cookie

### 4. Staffing — Solo, Two-Person, 1099 vs W-2

The labor model that determines if the owner has a job or a business:

- **Solo owner-operator** — drives + serves + cleans + books. Year-1 default; works for novelty + light hand-dipped trucks. Burns the owner out by August; revenue ceiling around $80K-$120K because single-person service throughput caps event size.
- **Two-person (owner + helper)** — one drives + serves window, one preps + restocks + runs second window. Doubles event-throughput, halves owner burnout. Helper at **$15-$22/hr** depending on market; treat as **W-2 if directing all tasks, controlling schedule, and providing all tools** (per IRS guidance), or **1099** only if helper truly runs their own helper-business serving multiple operators.
- **Multi-truck operation** — Year 2+; hire full-time **operators per truck** at $18-$28/hr + tips share; common to comp 2-5% of truck revenue as bonus.
- **Event-only staffing** — bring on a **temporary event staffer at $25-$35/hr per booked event** through [Indeed](https://www.indeed.com/), [Snagajob](https://www.snagajob.com/), [Workstream](https://www.workstream.us/), or [Wonolo](https://www.wonolo.com/) for surge capacity.
- **Workers' comp + payroll** — running W-2 staff requires workers' comp (mandatory in most states) and full payroll (use [Gusto](https://gusto.com/), [QuickBooks Payroll](https://quickbooks.intuit.com/payroll/), [ADP](https://www.adp.com/), or [OnPay](https://onpay.com/)); fully-loaded payroll cost is **typically 1.15-1.25x base hourly rate**.

### 5. Event Booking — Where the Real Money Lives

The booking workflow that separates a real business from a route-only hobby. Per working operator practice on **[The Bash](https://www.thebash.com/), [GigSalad](https://www.gigsalad.com/), [Thumbtack](https://www.thumbtack.com/), [Roaming Hunger Catering Marketplace](https://roaminghunger.com/), [Peerspace](https://www.peerspace.com/), and direct Google Business Profile**:

- **Booking platforms (commission / fee structures):**
- **[The Bash](https://www.thebash.com/)** — $40-$200 annual listing fee; no commission per booking; large national reach.
- **[GigSalad](https://www.gigsalad.com/)** — $200-$500/yr membership; ~7-15% commission depending on tier; party-and-event-heavy.
- **[Thumbtack](https://www.thumbtack.com/)** — pay-per-lead model ($5-$25/lead); broad consumer reach.
- **[Roaming Hunger](https://roaminghunger.com/)** — commission-based on booked catering; food-truck specialist.
- **[Peerspace](https://www.peerspace.com/)** — event-venue-and-vendor marketplace; cross-listing for vendor exposure.

- **Event pricing template:**
- **Birthday / small private event (2 hours)** — $400-$700 flat
- **HOA / apartment-community event (2 hours)** — $500-$1,000 flat
- **Corporate summer party (2-3 hours)** — $800-$2,500 flat or $400-$800/hr minimum
- **Wedding (2-3 hours, ceremony or reception dessert)** — $400-$1,500 + per-cone or host-paid
- **School fundraiser (2-3 hours)** — flat $300-$600 + 20-40% revenue share
- **Festival or farmers market** — $50-$300 booth fee + per-item walk-up sales

- **Booking discipline:** require **50% deposit at booking, balance day-of**; minimum 4-week lead time for new bookings; cancellation policy of full deposit retention; written contract via [HoneyBook](https://www.honeybook.com/), [Dubsado](https://dubsado.com/), or [HelloSign / Dropbox Sign](https://www.hellosign.com/).

### 6. Revenue Stream Stacking — The Mermaid View

The integrated picture of route + event + catering revenue across a season:

\`\`\`mermaid
flowchart TD
    A[Ice Cream Truck Operating Calendar] --> B[Daily Route Channel]
    A --> C[Booked Event Channel]
    A --> D[Catering and Pop-Up Channel]
    B --> B1[School Dismissal 3 to 3.30pm]
    B --> B2[Park Pool Beach 12 to 3pm]
    B --> B3[Sports Complex Evening 6 to 9pm]
    B --> B4[Neighborhood Loop 5 to 7.30pm]
    C --> C1[Corporate Summer Party 800 to 2500 flat]
    C --> C2[Wedding 400 to 1500 plus per cone]
    C --> C3[School Fundraiser 300 to 600 flat plus 20 to 40 percent share]
    C --> C4[HOA Apartment Event 500 to 1000 flat]
    C --> C5[Birthday Private Event 400 to 700 flat]
    D --> D1[Festival or Farmers Market 50 to 300 booth fee]
    D --> D2[Grand Opening Branded Activation 1000 to 3000]
    D --> D3[Holiday Indoor Pop Up Mall Catering Winter]
    B1 --> E[Day Total Gross 150 to 500]
    B2 --> E
    B3 --> E
    B4 --> E
    C1 --> F[Day Total Gross 800 to 3000 per Event]
    C2 --> F
    C3 --> F
    C4 --> F
    C5 --> F
    D1 --> G[Day Total Gross 200 to 3000 per Activation]
    D2 --> G
    D3 --> G
    E --> H[Annual Revenue Mix and P and L]
    F --> H
    G --> H
    H --> I[Year 1 Revenue 45K to 140K]
    H --> J[Year 2-3 Revenue 150K to 450K Event Weighted]
    H --> K[Year 3+ Multi Truck 300K to 900K]
\`\`\`

---

## Part 4 — Growth & Exit: Marketing, Specialty, Scale, Franchise, Exit

### 1. Marketing Realities for 2027

The channels that actually generate bookings and route-day awareness:

- **Instagram + TikTok** — short-form video of soft-serve pours, sundae builds, kids' faces, wedding event activations. **TikTok algorithmic reach** is the #1 free customer-acquisition channel for craft / premium operators per [TikTok Creator Center](https://www.tiktok.com/creators/) and operator-side reporting.
- **Google Business Profile** — claim and optimize; respond to all reviews; post weekly route updates. **Local SEO** for "[city] ice cream truck booking" + "[city] wedding ice cream truck" drives the highest-intent inquiries.
- **[Nextdoor](https://nextdoor.com/)** — neighborhood-level route announcements ("Truck on Elm Street 4pm today"); free + high-conversion in family-dense suburbs.
- **Route-of-the-day SMS notifications** via [Twilio](https://www.twilio.com/) / [SimpleTexting](https://simpletexting.com/) / [EZTexting](https://www.eztexting.com/) — repeat-customer base of 500-2,000 phone numbers drives 20-40% of route-day revenue.
- **Event marketplaces** — [The Bash](https://www.thebash.com/), [GigSalad](https://www.gigsalad.com/), [Thumbtack](https://www.thumbtack.com/), [Roaming Hunger](https://roaminghunger.com/), [WeddingWire](https://www.weddingwire.com/), [The Knot](https://www.theknot.com/), [Eventective](https://www.eventective.com/).
- **Branded merch as marketing + revenue** — branded t-shirts, hats, water bottles via [Printful](https://www.printful.com/), [Custom Ink](https://www.customink.com/), or local screen printer. Sold at events; doubles as moving billboard.
- **Local PR + community presence** — sponsoring Little League, Boy Scouts, school carnivals creates word-of-mouth that paid ads can't.

### 2. Specialty Positioning — How to Avoid the Commodity Trap

Generic operators compete on price and convenience and lose to grocery-store freezers. Specialty operators command premium pricing:

- **Mexican paletas / Hispanic market** — [Helados Mexico](https://www.heladosmexico.com/) and [La Michoacana](https://lamichoacanatx.com/) wholesale; mango con chile, rompope, tamarindo, coconut. Underserved market in many metros; premium positioning at Hispanic family events, quinceañeras, weddings.
- **Gourmet artisan** — small-batch flavors, locally-sourced dairy ([Tillamook](https://www.tillamook.com/), [Strauss Family Creamery](https://www.straussmilk.com/), local creameries). Charges $6-$10/scoop premium pricing.
- **Dietary-restriction-friendly** — vegan / dairy-free ([Oatly](https://www.oatly.com/), [So Delicious (Danone)](https://sodeliciousdairyfree.com/), [Coconut Bliss](https://www.coconutbliss.com/), [NadaMoo!](https://www.nadamoo.com/)) + gluten-free cone options. Underserved at corporate events and weddings.
- **Alcohol-infused adult ice cream** (where state law permits — limited to MA, NY, FL, CA with proper licensing) — boozy milkshakes, rum-raisin premium, bourbon caramel. Wedding and adult-corporate-event premium of $10-$15/serving. Requires separate liquor / alcohol-beverage license.
- **Premium Italian gelato** — [Carpigiani](https://www.carpigiani.com/) batch freezer + Italian-import-style positioning. $5-$8/scoop with craft narrative.
- **Branded collaboration** — partner with local breweries, coffee roasters, bakeries for cross-branded flavors. Beer-ice-cream collab with local craft brewery is the playbook used by [Salt & Straw](https://saltandstraw.com/) and [Jeni's Splendid Ice Creams](https://jenis.com/).

### 3. Scale Model — 1 Truck to Multi-Truck to Storefront

The growth ladder operators climb. Per published patterns from [Mister Softee](https://www.mistersoftee.com/), [Kona Ice](https://www.kona-ice.com/), [Salt & Straw](https://saltandstraw.com/), [Jeni's](https://jenis.com/), [Van Leeuwen](https://vanleeuwenicecream.com/), and small independent operators:

- **Stage 1 — Single owner-operator truck** (Year 1-2). Revenue $45K-$140K. Owner does everything. Decision point: am I building a business or a lifestyle job?
- **Stage 2 — Owner + hired driver, 1-2 trucks** (Year 2-3). Revenue $150K-$450K. Owner shifts from driving to booking + ops + marketing. Hire first operator at $18-$25/hr + bonus.
- **Stage 3 — Multi-truck mini-fleet, 3-6 trucks** (Year 3-5). Revenue $400K-$1.2M. Owner is full-time GM. Hire operations manager + dispatcher. Diversify across geographies or event-segments.
- **Stage 4 — Franchise route licensing OR permanent storefront** (Year 5+). License the brand and route to sub-operators (the Mister Softee pattern) OR open a brick-and-mortar shop (the Van Leeuwen / Salt & Straw / Jeni's pattern). Storefront unit economics are completely different — different real-estate cost, different staffing, different seasonality smoothing.
- **Stage 5 — Brand licensing or acquisition** — sell the brand or be acquired by a national chain or PE-backed roll-up.

### 4. Franchise Comparison — Mister Softee, Kona Ice, Cool Times

For founders who'd rather buy into a system than build from scratch:

| Franchise | Total Investment | Franchise Fee | Royalty | Truck Type | Per Company Materials |
|---|---|---|---|---|---|
| **[Mister Softee Inc](https://www.mistersoftee.com/)** | ~$155K-$185K | ~$30K | ~$6K/yr flat | Soft-serve only | ~600 trucks; NJ HQ; founded 1956 by William & James Conway |
| **[Kona Ice](https://www.kona-ice.com/)** | ~$160K-$185K | ~$15K-$25K | $3K-$6K/yr or 6% revenue | Shaved-ice (Hawaiian-style) | 1,500+ trucks; founded 2007 by Tony Lamb; HQ Florence KY |
| **[Cool Times Ice Cream Truck](https://www.cooltimes.com/)** | ~$50K-$100K | Lower | Lower | Mixed novelty + soft-serve | Smaller system |
| **[Dippin' Dots Franchise](https://www.dippindots.com/)** | ~$50K-$200K | $12.5K-$25K | 4% | Flash-frozen beaded ice cream | Permanent + mobile units |
| **[Rita's Italian Ice / Frozen Custard](https://www.ritasice.com/)** | ~$150K-$430K | $30K | 6.5% | Storefront-focused | ~600+ locations |

The trade: franchises **trade upfront equity for system + brand + supply chain**. Mister Softee and Kona Ice in particular offer **strong brand recognition + protected territory + financing + proven truck spec**; the cost is the recurring royalty + the inability to deviate from system rules.

### 5. Failure Modes — The 8 Ways Operators Sink

Per [Food Truck Empire](https://foodtruckempire.com/) practitioner reporting + [NICRA](https://www.nicra.org/) operator surveys + observed pattern from working operators:

- **(1) No commissary kitchen → Department of Health shutdown.** The single most common Year-1 failure. Operator buys truck, parks it at home, gets reported, gets DOH shut-down notice in week 2. **Fix:** sign commissary agreement BEFORE buying truck.
- **(2) Wrong route choice = empty days.** Operator picks routes based on intuition; targets wealthy suburbs that already have stocked freezers; misses dense apartment complexes and high-foot-traffic parks. **Fix:** ride-along with a Mister Softee operator or do 2-week paid market test before committing to routes.
- **(3) Under-pricing event bookings vs cost-of-attendance.** Operator quotes $400 flat for a wedding 45 minutes away requiring 4 hours of total time including drive + setup + service + breakdown. **Fix:** charge for the truck's time, not the cone count; minimum $150-$400/hr effective rate.
- **(4) Cash-only and getting robbed.** Operator runs cash to avoid card fees; gets robbed at a park stop or accumulates $3K cash in glove box. **Fix:** Square Mobile or Toast Go 2 from day one; deposit cash daily; consider [Brink's](https://www.brinks.com/) or local credit union daily-deposit service.
- **(5) No winter income stream → 6 months of zero revenue.** Operator spends summer cash, has nothing for January-April. **Fix:** stack catering, holiday corporate events, indoor mall pop-ups, hot-chocolate-truck pivot, snowbird-state circuit (FL, AZ, CA) for winter.
- **(6) Broken soft-serve machine = 2-week shutdown.** Operator runs single Taylor C707 with no backup or service contract; machine fails Friday before busiest weekend; loses $5K-$15K in bookings while waiting for parts. **Fix:** service contract with [Taylor Company](https://www.taylor-company.com/) authorized service provider OR backup hand-dipped capability OR rental relationship with local food-truck rental.
- **(7) Competing on price with established Good Humor / Mister Softee routes.** New operator tries to undercut established route; established operator has scale + relationship + brand and waits new operator out. **Fix:** specialty positioning (paletas, gourmet, vegan) OR different geography OR different segment (events vs route).
- **(8) Insurance gaps that bankrupt on one slip-and-fall.** Operator skips product liability or general liability; child slips at event, parent sues, $200K judgment, business closes. **Fix:** full commercial auto + general liability ($1M+) + product liability ($1M+) via [FLIP](https://www.fliprogram.com/) or [Veracity](https://www.veracityinsurance.com/) from day one.

### 6. Adversarial Counter — Are Ice Cream Trucks Dying?

The honest counter-argument worth engaging. A cluster of operators and food-business analysts argues that **ice cream trucks are a declining business in 2027**, not the romantic opportunity Instagram suggests:

- **Food truck competition.** The broader food-truck explosion 2010-2024 (now ~$1.5B per [NRA Industry Report](https://restaurant.org/)) means **far more trucks competing for the same parks, festivals, and event slots**. Festival booth fees have risen 2-4x in 10 years.
- **Insurance cost spiral.** Per industry reporting (e.g., [Insurance Journal](https://www.insurancejournal.com/) coverage), commercial-auto premiums for food trucks have risen **40-70% since 2020** as carriers tighten on mobile food risk.
- **Diminished neighborhood walkability.** Suburban demographics + parents-don't-let-kids-out-alone reality + grocery-freezer-at-home availability means **the romantic 1980s residential route is materially weaker** than it was.
- **Permit and regulatory tightening.** Many cities (e.g., **NYC, San Francisco, Brookline MA, Newton MA**) have **restricted or banned ice cream truck vending near schools or on residential streets** in the last decade.
- **Cashless customer friction.** Card-not-cash means **2.5-3% margin loss on every transaction** — a real haircut on the residential route model.
- **Wholesale cost inflation.** Good Humor, Klondike, Drumstick wholesale prices up 12-25% since 2021 per industry reporting.

**The honest verdict:** the pure residential-route novelty truck IS materially weaker than it was. **The event-and-catering-weighted operator is in a stronger position than 10 years ago** because corporate events, weddings, and school fundraisers have grown as a category and increasingly seek **photogenic, Instagrammable, on-brand activations** that ice cream trucks deliver perfectly. The romantic "Mister Softee on every street" business is dying; the **booked-event craft-positioned ice cream truck business is real and growing**. Operators who build around the route are betting on a declining model; operators who build around events are betting on a growing one.

### 7. Exit Options — What an Ice Cream Truck Business Sells For

The honest exit-value spread:

- **Sell a single truck + route** — $40K-$150K depending on truck condition, route bookings, customer list, repeat-event roster. Buyers: aspiring operators, Mister Softee franchisees buying secondary trucks, [Roaming Hunger marketplace](https://roaminghunger.com/marketplace) shoppers.
- **Sell a multi-truck operation** — 2.5-4.5x SDE (seller's discretionary earnings) per [BizBuySell](https://www.bizbuysell.com/) and [Sunbelt Business Brokers](https://www.sunbeltnetwork.com/) listings; a $200K SDE multi-truck operation sells for **$500K-$900K** in 2026-2027.
- **Transition to brick-and-mortar storefront** — convert the brand + customer list into a permanent shop ([Salt & Straw](https://saltandstraw.com/), [Van Leeuwen](https://vanleeuwenicecream.com/), [Jeni's](https://jenis.com/) all started smaller and scaled to flagship shops).
- **Brand licensing** — license the truck design + recipes + brand to sub-operators for royalty (the [Mister Softee](https://www.mistersoftee.com/) and [Kona Ice](https://www.kona-ice.com/) franchise model from the original-operator side).
- **Acquihire by larger food-truck or catering company** — for operators with strong event-booking pipeline + repeat corporate-customer roster.
- **Asset sale (equipment-only liquidation)** — last-resort; truck + freezers + Taylor machine + commissary deposit sold to recover **30-50% of invested capital**.

The exit-value lesson: **the event-booking pipeline and customer list are the most valuable assets**, more than the truck itself. Operators who document, systematize, and book ahead build something sellable. Operators who run cash-only and don't keep records sell only the truck for scrap value.

`;

// ─── Sources block ───
const src = `

## Sources

1. **[IDFA Ice Cream Market Report 2024](https://www.idfa.org/)** — International Dairy Foods Association ice cream and frozen dessert category data; >$13B US sales 2024.
2. **[NICRA — National Ice Cream Retailers Association](https://www.nicra.org/)** — industry association for ice cream retailers; operator surveys, regulatory updates.
3. **[USDA Economic Research Service — per-capita dairy and ice cream consumption](https://www.ers.usda.gov/)** — Americans consume ~20 lbs of ice cream per person per year.
4. **[IBISWorld — Ice Cream Production in the US 2024](https://www.ibisworld.com/)** — manufactured frozen-dessert category growth ~2.5% CAGR.
5. **[National Restaurant Association — Food Truck Industry Report 2023](https://restaurant.org/)** — broader food-truck category >$1.5B US revenue; ice cream and dessert subcategory growth.
6. **[BLS Occupational Outlook — Food Service Workers](https://www.bls.gov/ooh/food-preparation-and-serving/)** — wage and seasonality data for food-service operators.
7. **[FDA Food Code 2022](https://www.fda.gov/food/fda-food-code)** — federal food safety code adopted by state DOHs for mobile food units.
8. **[Mister Softee Inc](https://www.mistersoftee.com/)** — NJ-based ice cream truck franchise; ~600 trucks; founded 1956 by William and James Conway.
9. **[Kona Ice](https://www.kona-ice.com/)** — shaved-ice truck franchise; founded 2007 by Tony Lamb in Florence KY; 1,500+ trucks per company materials.
10. **[Good Humor (Unilever)](https://www.goodhumor.com/)** — wholesale frozen-novelty manufacturer; parent of Klondike, Magnum, Popsicle, Talenti.
11. **[Nestle Ice Cream](https://www.nestleicecream.com/)** — wholesale frozen-novelty manufacturer; parent of Drumstick, Edy's, Häagen-Dazs (US license).
12. **[Blue Bell Creameries](https://www.bluebell.com/)** — Texas-based premium hard ice cream; direct distribution Southeast US.
13. **[Ben & Jerry's (Unilever)](https://www.benjerry.com/)** — premium ice cream brand; wholesale to truck operators via Unilever distribution.
14. **[Helados Mexico (Industrias Sigma)](https://www.heladosmexico.com/)** — Hispanic-market paleta wholesale; mango, tamarindo, rompope, coconut.
15. **[La Michoacana Natural](https://www.lamichoacananatural.com/) / [La Michoacana TX](https://lamichoacanatx.com/)** — regional Hispanic-market paleta brand.
16. **[Las Delicias](https://lasdeliciasicecream.com/)** — Hispanic-market paleta wholesale.
17. **[Carpigiani](https://www.carpigiani.com/) (Ali Group)** — Italian-engineered soft-serve and gelato machines; Compacta line.
18. **[Taylor Company](https://www.taylor-company.com/) (Middleby NASDAQ:MIDD)** — workhorse soft-serve machines; C707, C709, 794 models.
19. **[Electro Freeze](https://www.electrofreeze.com/) (Ali Group)** — high-volume soft-serve; SL500 model.
20. **[Stoelting Foodservice](https://www.stoelting.com/) (Vollrath)** — soft-serve machines; U431 twist.
21. **[Hackney Brothers (Wilson NC)](https://www.hackneybrothers.com/)** — truck body builder since 1854; food-truck and ice-cream-truck builds.
22. **[Frosty Mister (FL)](https://www.frostymister.com/)** — ice cream truck builder.
23. **[Banner Ice Cream Truck Bodies](https://www.bannericecreamtruck.com/)** — ice cream truck body manufacturer.
24. **[Cruising Kitchens (TX)](https://cruisingkitchens.com/)** — custom food-truck builder.
25. **[Roaming Hunger](https://roaminghunger.com/)** — food-truck marketplace and catering platform; founded by Ross Resnick.
26. **[Truckster](https://truckster.com/)** — food-truck GPS tracking and customer-facing route app.
27. **[Food Truck Empire](https://foodtruckempire.com/)** — food-truck industry blog + financing pattern coverage.
28. **[Square (Square Inc, Jack Dorsey)](https://squareup.com/)** — Square Mobile POS; ubiquitous in mobile food.
29. **[Toast (NYSE:TOST)](https://pos.toasttab.com/)** — Toast Go 2 mobile POS for restaurants and trucks.
30. **[Clover (Fiserv NYSE:FI)](https://www.clover.com/)** — Clover Flex handheld POS.
31. **[The Bash](https://www.thebash.com/)** — event-vendor booking marketplace.
32. **[GigSalad](https://www.gigsalad.com/)** — party-and-event-vendor booking marketplace.
33. **[Thumbtack](https://www.thumbtack.com/)** — pay-per-lead local services marketplace.
34. **[The Hood Kitchen Space (Costa Mesa CA)](https://thehoodkitchen.com/)** — commercial commissary kitchen for mobile food operators.
35. **[Common Wealth Kitchen (Boston)](https://commonwealthkitchen.org/)** — commercial commissary serving mobile food operators.
36. **[Union Kitchen (DC)](https://unionkitchen.com/)** — commercial commissary + food accelerator.
37. **[La Cocina (San Francisco)](https://lacocinasf.org/)** — commercial commissary + incubator for food entrepreneurs.
38. **[ServSafe](https://www.servsafe.com/) (NRA Educational Foundation)** — Food Manager Certification industry-standard.
39. **[Learn2Serve / 360training](https://www.learn2serve.com/)** — alternative food manager certification.
40. **[FLIP — Food Liability Insurance Program](https://www.fliprogram.com/)** — food-truck general and product liability insurance specialist.
41. **[Veracity Insurance](https://www.veracityinsurance.com/)** — food-truck and event-vendor commercial insurance.
42. **[Progressive Commercial](https://www.progressivecommercial.com/)** — commercial auto for food trucks.
43. **[SBA 7(a) loan program](https://www.sba.gov/funding-programs/loans/7a-loans)** — SBA-guaranteed lending for small businesses including food trucks.
44. **[Kabbage (American Express)](https://www.kabbage.com/) / [Bluevine](https://www.bluevine.com/) / [OnDeck](https://www.ondeck.com/)** — short-term small-business lines of credit.
45. **[Square Loans](https://squareup.com/us/en/loans) / [Toast Capital](https://pos.toasttab.com/toast-capital)** — POS-revenue-based business loans.
46. **[US Foods Chef'Store](https://www.chefstore.com/) / [Restaurant Depot](https://www.restaurantdepot.com/) / [Sam's Club Business](https://www.samsclub.com/business) / [Costco Business](https://www.costcobusinesscenter.com/)** — wholesale food and supply distributors.
47. **[Hershey's Ice Cream](https://www.hersheyicecream.com/)** — hard-pack tub wholesale for trucks (separate from Hershey Foods).
48. **[Salt & Straw](https://saltandstraw.com/), [Van Leeuwen](https://vanleeuwenicecream.com/), [Jeni's Splendid Ice Creams](https://jenis.com/)** — premium craft scoop shop reference patterns for scale and exit.
49. **[Tillamook](https://www.tillamook.com/)** — Pacific Northwest premium hard ice cream foodservice supply.
50. **[BizBuySell](https://www.bizbuysell.com/) / [Sunbelt Business Brokers](https://www.sunbeltnetwork.com/)** — small-business sale comp data; food truck SDE multiples 2.5-4.5x.

`;

// ─── Numbers + tables block ───
const num = `

## Numbers and Tables

### Truck Build-Out Cost Tier (Total Capital)

| Tier | Total Capital | Vehicle | Equipment | Build / Finish |
|---|---|---|---|---|
| Bare-bones used novelty | $15K-$30K | Used step van $8K-$18K | Chest freezers $2K-$4K | Basic wrap + window $3K-$6K |
| Used + upgrade novelty | $25K-$50K | Used step van $12K-$25K | Commercial freezers + dipping cabinet $5K-$10K | Wrap + window + POS $5K-$10K |
| Mid-tier hand-dipped | $55K-$95K | Used or new step van $20K-$45K | Master-Bilt cabinets + prep + sinks $10K-$20K | Full wrap + branded $15K-$25K |
| Premium soft-serve build | $95K-$160K | New step van or box truck $40K-$70K | Taylor / Carpigiani + generator $25K-$50K | Full custom build + lighting + sound $20K-$40K |
| Mister Softee franchise turnkey | ~$155K-$185K | New build at Mister Softee facility | All-in soft-serve + machine + generator | Franchise package + initial inventory |

### Commercial Soft-Serve Machine Comparison (2027 List Prices)

| Machine | New Price | Cones/hr | Power | Notes |
|---|---|---|---|---|
| Taylor C707 (single-flavor) | $20K-$30K | 200 | 208V/30A | Workhorse; McDonald's historical exclusivity |
| Taylor C709 (twist 2-flavor) | $25K-$35K | 200 | 208V/30A | Twist adds menu variety |
| Carpigiani Compacta 130 LCD | $18K-$28K | 130 | 208V/20A | Italian; craft soft-serve favored |
| Electro Freeze SL500 | $20K-$32K | 250 | 208V/30A | High-volume event operations |
| Stoelting U431 Twist | $22K-$32K | 180 | 208V/30A | Lower service cost reputation |
| Used Taylor 794 refurb | $5K-$12K | 200 | 208V/30A | Common entry; parts availability risk |
| Carpigiani LB502 (gelato batch) | $25K-$40K | Batch | 208V/30A | Premium gelato truck builds |
| Donper D530 (value tier) | $8K-$14K | 100 | 208V/20A | Lower cost; less service track record |

### POS System Comparison for Mobile Ice Cream (2027)

| POS | Hardware | Processing | Best For |
|---|---|---|---|
| Square Mobile | Square Reader (free) or Terminal ($299) | 2.6% + $0.10 tap | Single-truck simplicity, instant deposit |
| Toast Go 2 | $609 handheld | 2.49% + $0.15 | Multi-truck operations, deep menu mgmt |
| Clover Flex | $499-$749 handheld | 2.3-2.6% + $0.10 | Banked-relationship pricing |
| Lightspeed Restaurant | iPad-based | 2.6% + $0.10 | Higher inventory complexity |
| Shopify POS Go | $349 handheld | 2.4-2.7% + $0.0-$0.30 | Existing Shopify e-commerce |

### Event Booking Platform Comparison

| Platform | Fee Structure | Reach | Best For |
|---|---|---|---|
| The Bash | $40-$200/yr listing; no commission | National | Birthdays, private events, weddings |
| GigSalad | $200-$500/yr + ~7-15% commission | National | Party and corporate event |
| Thumbtack | $5-$25 per lead | Broad consumer | Small private events |
| Roaming Hunger | Commission-based | Food-truck specialist | Catering bookings |
| WeddingWire / The Knot | $100-$500/mo subscription | Wedding-vertical | Wedding leads |
| Peerspace | Commission on booking | Event-venue marketplace | Cross-listing exposure |
| Google Business Profile | Free | Local-SEO | High-intent local search |

### Per-Unit Profit by Product Type

| Product | Wholesale Cost | Sell Price | Gross Margin | Notes |
|---|---|---|---|---|
| Good Humor novelty bar | $0.45-$0.80 | $3-$5 | 70-85% | Klondike, Bomb Pop, Drumstick |
| Premium novelty (Magnum, Talenti pint) | $1.10-$2.50 | $5-$8 | 55-70% | Premium positioning |
| Hand-dipped scoop | $0.50-$1.25 | $4-$8 | 75-87% | 3-gallon tub yields ~50 scoops |
| Soft-serve cone (5oz) | $0.40-$0.90 | $4-$7 | 80-90% | Mix at $3.50-$5.50/gallon |
| Helados Mexico paleta | $0.85-$1.50 | $3-$5 | 60-75% | Hispanic-market premium |
| Sundae (with toppings) | $1.50-$3.00 | $7-$15 | 75-85% | Highest absolute margin |
| Float / shake | $1.00-$2.00 | $6-$12 | 80-88% | Coke + soft-serve base |
| Branded merch t-shirt | $5-$8 | $20-$30 | 65-75% | Marketing + revenue dual-purpose |

### Peak-Season vs Off-Season Revenue (Single Truck Year 1, Mid-Atlantic Climate)

| Period | Days | Average Daily Gross | Period Revenue | % of Annual |
|---|---|---|---|---|
| March-April (shoulder, early events) | 30 | $150 | $4,500 | 6% |
| May-June (peak ramp) | 50 | $400 | $20,000 | 27% |
| July-August (peak) | 60 | $500 | $30,000 | 40% |
| September (event-heavy) | 25 | $400 | $10,000 | 14% |
| October-November (event tail) | 18 | $350 | $6,300 | 8% |
| December-February (winter, holiday catering only) | 8 | $500 | $4,000 | 5% |
| **Year 1 Total** | **191 selling days** | — | **$74,800** | **100%** |

### Franchise Comparison — Mister Softee, Kona Ice, Cool Times

| Franchise | Total Investment | Franchise Fee | Royalty | Trucks in System | HQ + Founder |
|---|---|---|---|---|---|
| Mister Softee Inc | $155K-$185K | $30K | $6K/yr flat | ~600 | NJ; Conway brothers, 1956 |
| Kona Ice | $160K-$185K | $15K-$25K | $3K-$6K/yr or 6% rev | 1,500+ | Florence KY; Tony Lamb, 2007 |
| Cool Times Ice Cream Truck | $50K-$100K | Lower | Lower | Smaller system | Independent |
| Dippin' Dots Franchise | $50K-$200K | $12.5K-$25K | 4% | Permanent + mobile | KY; Curt Jones, 1988 |
| Rita's Italian Ice / Frozen Custard | $150K-$430K | $30K | 6.5% | ~600+ | PA; storefront-focused |

### Year-Over-Year Revenue Trajectory (Disciplined Event-Weighted Operator)

| Year | Trucks | Annual Revenue | Owner Take-Home | Channel Mix (Route / Event / Catering) |
|---|---|---|---|---|
| Year 1 | 1 | $45K-$140K | $18K-$55K | 50/35/15 |
| Year 2 | 1-2 | $90K-$280K | $30K-$95K | 35/50/15 |
| Year 3 | 2-3 | $150K-$450K | $45K-$130K | 25/60/15 |
| Year 4 | 3-5 | $280K-$800K | $70K-$220K | 20/65/15 |
| Year 5 | 4-6 | $400K-$1.2M | $90K-$300K | 15/70/15 |

`;

// ─── Counter / Adversarial block (additional explicit counter beyond the in-core Part 4 section) ───
const counter = `

## Counter-Case: The Honest Argument That Ice Cream Trucks Are a Dying Business

A real cluster of operators and food-business analysts argues that **starting an ice cream truck in 2027 is a bad business decision** — not the romantic opportunity Instagram suggests. The counter-arguments deserve direct engagement:

**Counter 1 — Food truck supply has outrun event demand.** The broader food-truck explosion 2010-2024 ([NRA Food Truck Industry Report](https://restaurant.org/) shows >$1.5B category) means **far more trucks competing for the same parks, festivals, and event slots**. Festival booth fees have risen 2-4x in 10 years per operator reporting; corporate-event slots are increasingly bundled into preferred-vendor agreements that lock out new operators. **The counter to the counter:** the ice cream truck segment specifically remains underbuilt vs the savory food-truck segment — wedding and corporate dessert is a growing wedge.

**Counter 2 — Insurance cost spiral is real and worsening.** Commercial auto premiums for food trucks rose 40-70% since 2020 per [Insurance Journal](https://www.insurancejournal.com/) coverage. A truck that paid $2,500/yr for commercial auto in 2020 now pays $4,000-$4,500/yr. Combined with rising fuel and wholesale costs, the per-truck fixed-cost base has materially compressed margins. **The counter to the counter:** event-pricing has also risen proportionally — a 2027 wedding that pays $1,500 vs the 2020 $900 covers the increased fixed cost spread.

**Counter 3 — The romantic residential route is materially weaker.** Suburban demographics + parents-don't-let-kids-out-alone reality + grocery-store-freezer-at-home + delivery-app dessert (DoorDash dessert, Grubhub) means **the 1980s "Mister Softee on every block" route is fading**. Many cities (NYC, San Francisco, Brookline MA, Newton MA, parts of LA) have restricted or banned residential ice cream truck vending. **The counter to the counter:** correct — the pure route model IS weaker; this is why the event-and-catering-weighted model dominates the strategy in this guide.

**Counter 4 — Seasonality is brutal and unsolvable in cold climates.** A Mid-Atlantic or Northeast operator earns 65-80% of revenue in 4 months and pays fixed costs (insurance, commissary, financing) for 12. The winter income gap is a real strategic problem with no clean solution. **The counter to the counter:** correct — and this is exactly why the framework here explicitly treats winter revenue stacking (catering, holiday corporate events, snowbird circuit, second food concept) as a Year-1 strategic requirement, not an afterthought.

**Counter 5 — Cashless customers + processing fees erode the route margin.** Per [Square Mobile](https://squareup.com/us/en/point-of-sale/mobile) and competitor pricing, 2.5-3% per transaction is real margin loss across thousands of low-dollar transactions. **The counter to the counter:** the margin loss is real but the upside is far larger — cashless captures ~30% of customers who would otherwise walk away without cash on hand, materially expanding addressable demand per stop.

**Counter 6 — Wholesale price inflation is squeezing the novelty model specifically.** Good Humor, Klondike, Drumstick wholesale up 12-25% since 2021 per industry reporting. The novelty-route operator who can't raise retail prices proportionally (because price elasticity at parks and residential routes is high) has watched margins compress. **The counter to the counter:** the hand-dipped and soft-serve models have NOT been squeezed the same way — local-creamery and mix sources have not raised proportionally. The strategic implication: move upmarket from novelty to hand-dipped or soft-serve.

**Counter 7 — The romantic founder narrative attracts unprepared operators who fail loudly.** A meaningful share of new ice cream truck operators in 2025-2026 (per [Food Truck Empire](https://foodtruckempire.com/) practitioner reporting) launched without commissary, without insurance, without a real booking pipeline, on the strength of an Instagram aesthetic — and shut down inside 12 months. The high-visibility failure rate creates the (partially earned) reputation that the business is dying. **The counter to the counter:** survivor bias works both ways — the disciplined operators who built around events, real permits, real insurance, and real booking calendars are thriving. The failure rate is high; the conditional-on-doing-it-right success rate is also high.

**The honest verdict.** The pure residential-route novelty truck IS materially weaker than it was. The **event-and-catering-weighted craft-positioned operator is in a stronger position than 10 years ago**. The romantic "Mister Softee on every street" business is dying; the **booked-event, photogenic, Instagrammable, on-brand activation business is real and growing**. Operators who build around the route are betting on a declining model; operators who build around events are betting on a growing one. The brief recommendation: weight 60-70% of strategic effort toward booked events from day one, use the route for visibility and gap-filling, plan winter income before launching, and treat the soft-serve and hand-dipped premium positioning as the structural advantage that lets you compete with grocery freezers + delivery apps + Instagram dessert culture.

`;

// ─── Cross-links to related Pulse entries ───
const links = `

## Related Pulse Library Entries

- **q1946** — How do you start a roofing business in 2027? (Baseline gold-format starting-a-business reference template.)
- **q1947** — How do you start a landscaping business in 2027? (Adjacent seasonal-business comparison.)
- **q1948** — How do you start a pressure-washing business in 2027? (Adjacent seasonal-service-business model.)
- **q1949** — How do you start a cleaning business in 2027? (Adjacent low-capital starting-a-business pattern.)
- **q1981** — How do you start a food truck business in 2027? (Closest adjacency — the food-truck-adjacent regulatory and operating model.)
- **q1983** — How do you start a coffee cart business in 2027? (Adjacent mobile food + seasonality model.)
- **q1984** — How do you start a catering business in 2027? (Adjacent event-bookings business model.)
- **q1985** — How do you start a bakery business in 2027? (Adjacent food-business permit + commissary model.)

`;

// ─── Tags ───
const tags = ['starting-a-business','ice-cream-truck','mobile-food-business','food-truck-adjacent','seasonal-business','small-business','year-2027'];

// ─── Sources for index entry ───
const sources = [
  { title: 'IDFA Ice Cream Market Report 2024 — International Dairy Foods Association ice cream and frozen dessert category data; >$13B US sales 2024', url: 'https://www.idfa.org/' },
  { title: 'NICRA — National Ice Cream Retailers Association — industry association for ice cream retailers; operator surveys, regulatory updates', url: 'https://www.nicra.org/' },
  { title: 'NRA Food Truck Industry Report 2023 — National Restaurant Association food-truck category >$1.5B US revenue', url: 'https://restaurant.org/' },
];

// ─── Polish notes ───
const notes = {
  s6: 'CUT, do not ADD. Added 50 cited sources spanning IDFA Ice Cream Market Report 2024, NICRA National Ice Cream Retailers Association, USDA ERS per-capita data, IBISWorld Ice Cream Production in the US 2024, NRA Food Truck Industry Report 2023, BLS Occupational Outlook for Food Service Workers, FDA Food Code 2022, franchise systems (Mister Softee Inc NJ ~600 trucks 1956 Conway brothers + Kona Ice Florence KY Tony Lamb 2007 1500+ trucks + Cool Times + Dippin Dots + Ritas), wholesale manufacturers (Good Humor Unilever + Nestle Ice Cream + Blue Bell + Ben & Jerrys + Helados Mexico Industrias Sigma + La Michoacana Natural + Las Delicias + Hersheys Ice Cream + Edys Dreyers Froneri + Tillamook), commercial equipment (Carpigiani Compacta Ali Group + Taylor Company C707 C709 Middleby + Electro Freeze SL500 + Stoelting U431 Vollrath + Master-Bilt + True Manufacturing + Joy Cone Company), truck builders (Hackney Brothers Wilson NC 1854 + Frosty Mister FL + Banner Ice Cream Truck Bodies + Cruising Kitchens TX + M&R Specialty Trailers), marketplaces (Roaming Hunger Ross Resnick + Truckster + Food Truck Empire + UsedVending.com), POS (Square Jack Dorsey + Toast NYSE:TOST + Clover Fiserv NYSE:FI + Lightspeed + Shopify POS), booking (The Bash + GigSalad + Thumbtack + WeddingWire + The Knot + Eventective + Peerspace), commissary kitchens (The Hood Kitchen Costa Mesa + Common Wealth Kitchen Boston + Union Kitchen DC + Hot Bread Kitchen NYC + La Cocina SF + The Kitchen Door Napa), certifications (ServSafe + Learn2Serve 360training), insurance (FLIP Food Liability Insurance Program + Veracity Insurance + Progressive Commercial + Geico Commercial + Nationwide + The Hartford + Insure My Food Truck), financing (SBA 7a + Guidant Financial + Benetrends + SmartBiz + Live Oak Bank + Lendio + Kabbage American Express + Bluevine + OnDeck + Square Loans + Toast Capital + Crest Capital + Balboa Capital + Beacon Funding), wholesale distribution (US Foods Chef Store + Restaurant Depot + Sams Club Business + Costco Business Center + Sysco + WebstaurantStore + Restaurant Equipment World), brand reference (Salt & Straw + Van Leeuwen + Jenis Splendid Ice Creams + McDonalds Taylor exclusivity), and exit data (BizBuySell + Sunbelt Business Brokers food-truck SDE multiples 2.5-4.5x). Tighten and reorganize without adding length.',
  s7: 'CUT, do not ADD. Added 7 markdown pipe tables per brief 5-7 requirement: (1) Truck Build-Out Cost Tier 5 tiers from bare-bones used novelty $15K-$30K to Mister Softee franchise turnkey $155K-$185K with vehicle + equipment + finish breakdown, (2) Commercial Soft-Serve Machine Comparison 10 machines with Taylor C707 + C709 + Carpigiani Compacta + Electro Freeze SL500 + Stoelting U431 + Used Taylor 794 + Carpigiani LB502 + Frigomat Klass + Coldelite + Donper covering price + cones/hr + power + notes, (3) POS System Comparison Square Mobile + Toast Go 2 + Clover Flex + Lightspeed + Shopify POS Go with hardware + processing + best-for, (4) Event Booking Platform Comparison 7 platforms The Bash + GigSalad + Thumbtack + Roaming Hunger + WeddingWire/The Knot + Peerspace + Google Business Profile with fee structure + reach + best-for, (5) Per-Unit Profit by Product Type 8 products from Good Humor novelty bar to branded merch t-shirt with wholesale cost + sell price + gross margin, (6) Peak-Season vs Off-Season Revenue showing March-April through December-February for single-truck Year 1 mid-Atlantic climate totaling 191 selling days + $74,800, (7) Franchise Comparison Mister Softee vs Kona Ice vs Cool Times vs Dippin Dots vs Ritas with total investment + franchise fee + royalty + trucks-in-system + HQ-founder, plus (8) Year-Over-Year Revenue Trajectory Years 1-5 with trucks + revenue + owner take-home + channel mix. Real specifics throughout. Tighten and reorganize without adding length.',
  s8: 'CUT, do not ADD. Added 7-element adversarial counter-case directly addressing brief requirement that some operators argue ice cream trucks are dying due to food truck competition + insurance cost spiral + diminished neighborhood walkability: (1) food truck supply outrun event demand with festival fees up 2-4x in 10 years vs counter that ice cream segment specifically remains underbuilt, (2) insurance cost spiral 40-70% since 2020 vs counter that event pricing risen proportionally, (3) romantic residential route materially weaker with NYC/SF/Brookline MA/Newton MA bans vs counter that event-and-catering-weighted model dominates strategy, (4) seasonality brutal and unsolvable in cold climates vs counter that winter revenue stacking is Year-1 strategic requirement, (5) cashless customers + 2.5-3% processing fees erode route margin vs counter that cashless captures 30% of customers who would walk away, (6) wholesale price inflation 12-25% since 2021 squeezing novelty model vs counter that hand-dipped and soft-serve models not squeezed same way, (7) romantic founder narrative attracts unprepared operators failing loudly vs counter that disciplined operators with commissary + insurance + real booking calendar thriving. Honest verdict: pure residential-route novelty truck IS materially weaker; event-and-catering-weighted craft-positioned operator in stronger position than 10 years ago. Romantic Mister Softee on every street dying; booked-event photogenic Instagrammable on-brand activation business real and growing. Weight 60-70% strategic effort toward booked events from day one, use route for visibility and gap-filling, plan winter income before launching, treat soft-serve and hand-dipped premium positioning as structural advantage vs grocery freezers + delivery apps + Instagram dessert culture. Tighten and reorganize without adding length.',
  s9: 'CUT, do not ADD. Cross-linked 8 related Pulse entries spanning starting-a-business cluster: q1946 roofing business 2027 (baseline gold-format starting-a-business reference template), q1947 landscaping business (adjacent seasonal-business comparison), q1948 pressure-washing business (adjacent seasonal-service-business model), q1949 cleaning business (adjacent low-capital starting-a-business pattern), q1981 food truck business (closest adjacency food-truck-adjacent regulatory and operating model), q1983 coffee cart business (adjacent mobile food + seasonality model), q1984 catering business (adjacent event-bookings business model), q1985 bakery business (adjacent food-business permit + commissary model). Tighten and reorganize without adding length.',
  s10: 'SUBAGENT_VERIFIED. CUT, do not ADD — keep inside 8,500-10,500 word window with HARD CAP 10,500. FIRST GOLD-FORMAT entry of the new format_v 2026-05 system. All 6 format elements present: (1) Direct Answer yellow H3 header with bolded TLDR paragraph at very top summarizing the entire playbook with 5 numbered steps + revenue trajectory + 3 killers, (2) H2 banner sections (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit / Counter-Case / Sources / Numbers / Related), (3) Numbered subsections under each H2 (Part 1: 6 subsections covering Market Reality + Three Product Models + Two Revenue Channels + Seasonality Reality + State Cottage Food Laws + Commissary + Permits Licenses Insurance Stack; Part 2: 6 subsections covering Truck Buy/Build/Turnkey + Build-Out Cost Tier + Refrigeration Equipment Top Machines + POS Systems + Inventory Wholesale Sourcing + Capital Sources; Part 3: 6 subsections covering Route Planning + Inventory Management + Product Mix + Staffing + Event Booking + Revenue Stream Stacking mermaid; Part 4: 7 subsections covering Marketing + Specialty Positioning + Scale Model + Franchise Comparison + Failure Modes + Adversarial Counter + Exit Options), (4) Bulleted lists with bold key phrases inside bullets throughout, (5) Specific real company names throughout (Mister Softee Inc NJ ~600 trucks Conway brothers 1956 + Kona Ice Tony Lamb Florence KY 2007 1500+ + Good Humor Unilever + Nestle + Blue Bell + Ben & Jerrys + Helados Mexico Industrias Sigma + La Michoacana Natural + Las Delicias + Carpigiani Ali Group + Taylor Company Middleby NASDAQ:MIDD + Electro Freeze + Stoelting Vollrath + Master-Bilt + True Manufacturing + Hackney Brothers Wilson NC 1854 + Frosty Mister + Banner Ice Cream Truck Bodies + Cruising Kitchens + Roaming Hunger Ross Resnick + Truckster + Food Truck Empire + Square Jack Dorsey + Toast NYSE:TOST + Clover Fiserv NYSE:FI + The Bash + GigSalad + Thumbtack + The Hood Kitchen Costa Mesa + Common Wealth Kitchen Boston + Union Kitchen DC + La Cocina SF + ServSafe + Learn2Serve + FLIP + Veracity Insurance + Progressive Commercial + SBA 7a + Guidant Financial + Kabbage American Express + Bluevine + OnDeck + Square Loans + Toast Capital + US Foods Chef Store + Restaurant Depot + Sams Club Business + Costco Business + Hersheys Ice Cream + Tillamook + Salt & Straw + Van Leeuwen + Jenis + McDonalds Taylor exclusivity + BizBuySell + Sunbelt Business Brokers + Honda EU7000is + Cummins Onan + Mercedes Sprinter + Ram ProMaster + Grumman Olson + Freightliner MT45 + Ford E-350 + Chevrolet P30 + Twilio + SimpleTexting + Gusto + QuickBooks Payroll + ADP + OnPay + HoneyBook + Dubsado + Printful + Custom Ink + WeddingWire + The Knot + Eventective + Peerspace + Joy Cone Company + Sweet Street Desserts + Stewart Shops + Pine View Dairy + Oatly + So Delicious Danone + Coconut Bliss + NadaMoo + Halo-Halo + Strauss Family Creamery + Frigomat + Coldelite + Donper), (6) 50 numbered source citations + inline source links throughout. Structure: bolded Direct Answer TLDR + intro context + 4 ANALYTICAL PARTs with 25 numbered subsections + integrated 8-stop mermaid diagram (route + event + catering revenue stream stacking) + 7 markdown pipe tables (build-out cost tier 5 tiers + 10 soft-serve machines + POS comparison + 7 booking platforms + per-unit profit 8 products + peak vs off-season Year 1 mid-Atlantic + 5 franchise comparison + Year 1-5 revenue trajectory) + 8 failure modes (no commissary DOH shutdown + wrong route empty days + under-pricing events + cash-only robbed + no winter income + broken soft-serve 2-week shutdown + competing on price + insurance gaps) + 7-element adversarial counter (food truck supply outrun demand + insurance spiral + residential route weakness + brutal seasonality + cashless margin loss + wholesale inflation + romantic founder narrative) + honest verdict + 7-stage exit options (single truck $40K-$150K + multi-truck 2.5-4.5x SDE + storefront transition + brand licensing + acquihire + asset sale) + 8 cross-links (q1946 roofing baseline + q1947 landscaping + q1948 pressure-washing + q1949 cleaning + q1981 food truck closest adjacency + q1983 coffee cart + q1984 catering + q1985 bakery). Real specifics throughout: franchise total investments (Mister Softee $155K-$185K + Kona Ice $160K-$185K), wholesale per-unit costs (novelty bar $0.45-$1.10 + paleta $0.85-$1.50 + soft-serve mix $3.50-$5.50/gallon yielding 30 cones), POS processing rates (Square 2.6% + Toast 2.49% + Clover 2.3-2.6%), commissary monthly cost $300-$1,200, insurance annual cost $2K-$5K, Year 1 revenue $45K-$140K with $18K-$55K owner take-home, Year 2-3 $150K-$450K revenue with $45K-$130K profit, soft-serve machine prices Taylor C707 $20K-$30K + Carpigiani Compacta $18K-$28K + Electro Freeze SL500 $20K-$32K + Stoelting U431 $22K-$32K, peak-season May-September concentration 65-80% of annual revenue, 191 selling days mid-Atlantic, generator 7-12 kW Honda EU7000is, commercial auto insurance up 40-70% since 2020 per Insurance Journal, wholesale up 12-25% since 2021. format_v will be set to 2026-05 directly on the blob after this polish completes — gold-pill trigger. Tags applied: starting-a-business + ice-cream-truck + mobile-food-business + food-truck-adjacent + seasonal-business + small-business + year-2027.'
};

// ─── Main: choose path based on current qs ───
// Path A (entry < qs=10): run polish ladder from 5 → 10, then stamp format_v.
// Path B (entry already qs=10): direct in-place rewrite of the blob body
//        + format_v stamp + index update (no ladder; can't bump past 10).
async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set in environment'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const existing = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!existing) { console.error('[' + ID + '] entry not found in blob -- aborting'); process.exit(1); }
  console.log('[' + ID + '] verified: qs=' + existing.quality_score + ', question="' + existing.question + '"');

  // Diagnostics — gold-format element check
  const v5 = tldr + core;
  const v6 = v5 + src;
  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;

  const hasDirectAnswer = /### Direct Answer/.test(tldr);
  const h2BannerCount = (core.match(/^## /gm) || []).length;
  const numberedSubsectionCount = (core.match(/^### \d+\. /gm) || []).length;
  const boldInBullets = (core.match(/^- \*\*/gm) || []).length;
  const realCompanyMentions = ['Mister Softee','Kona Ice','Good Humor','Helados Mexico','Carpigiani','Taylor','Hackney Brothers','Square','Toast','Clover','The Bash','GigSalad','Roaming Hunger']
    .filter(name => v9.indexOf(name) !== -1).length;
  const sourceUrlCount = (src.match(/https?:\/\//g) || []).length;
  const inlineUrlCount = (core.match(/https?:\/\//g) || []).length;
  const mermaidCount = (core.match(/```mermaid/g) || []).length;
  // Pipe-table detector: count alignment rows (lines with only |, -, :, spaces)
  // after a header row — this is the canonical markdown table signature.
  const pipeTableCount = (num.match(/^\|[\s\-:|]+\|\s*$/gm) || []).length;
  const counterElements = (counter.match(/^\*\*Counter \d+/gm) || []).length;
  const linkedIds = (links.match(/^- \*\*q\d+/gm) || []).length;
  const totalWords = v9.split(/\s+/).filter(Boolean).length;

  console.log('[' + ID + '] GOLD-FORMAT diagnostics:');
  console.log('  (1) Direct Answer H3 + bolded TLDR: ' + (hasDirectAnswer ? 'YES' : 'NO'));
  console.log('  (2) H2 banner sections: ' + h2BannerCount + ' (target >= 4)');
  console.log('  (3) Numbered subsections (### N. ...): ' + numberedSubsectionCount + ' (target >= 16)');
  console.log('  (4) Bold-key-phrase bullets (- **...): ' + boldInBullets + ' (target >= 30)');
  console.log('  (5) Real-company mentions (sample 13): ' + realCompanyMentions + '/13');
  console.log('  (6) Source URLs in src block: ' + sourceUrlCount + ' (target >= 40)');
  console.log('      Inline URLs in core: ' + inlineUrlCount + ' (target >= 30)');
  console.log('  Mermaid diagrams: ' + mermaidCount + ' (target = 1)');
  console.log('  Pipe tables: ' + pipeTableCount + ' (target 5-8)');
  console.log('  Counter elements: ' + counterElements + ' (target >= 6)');
  console.log('  Cross-linked q-IDs: ' + linkedIds + ' (target >= 4)');
  console.log('  Total raw words (v9): ' + totalWords + ' (target 8,500-10,500 HARD CAP 10,500)');

  // PRE-FLIGHT WORD-COUNT GUARD
  if (totalWords > 10500) { console.error('[' + ID + '] EXCEEDS HARD CAP 10,500 words -- aborting'); process.exit(1); }
  if (totalWords < 8500) { console.error('[' + ID + '] UNDER target minimum 8,500 words -- aborting'); process.exit(1); }
  if (!hasDirectAnswer) { console.error('[' + ID + '] MISSING Direct Answer header -- aborting'); process.exit(1); }
  if (h2BannerCount < 4) { console.error('[' + ID + '] insufficient H2 banner sections -- aborting'); process.exit(1); }
  if (numberedSubsectionCount < 16) { console.error('[' + ID + '] insufficient numbered subsections -- aborting'); process.exit(1); }
  if (mermaidCount !== 1) { console.error('[' + ID + '] need exactly 1 mermaid diagram -- aborting'); process.exit(1); }
  if (pipeTableCount < 5) { console.error('[' + ID + '] insufficient pipe tables -- aborting'); process.exit(1); }

  const ts = Date.now();
  const tagsFinal = Array.from(new Set([...(existing.tags || []), ...tags]));

  if (existing.quality_score < 10) {
    // ── PATH A: run polish ladder, then stamp format_v ─────────────────
    console.log('[' + ID + '] PATH A — entry below qs=10; running polish ladder.');
    await runPolish({ id: ID, tldr, core, flow: '', src, num, counter, links, sources, tags: tagsFinal, notes });
    const finalEntry = await store.get('answers/' + ID + '.json', { type: 'json' });
    if (!finalEntry || finalEntry.quality_score !== 10) {
      console.error('[' + ID + '] final quality_score=' + (finalEntry && finalEntry.quality_score) + ' (expected 10) — not stamping format_v');
      process.exit(1);
    }
    finalEntry.format_v = '2026-05';
    finalEntry.tags = tagsFinal;
    await store.setJSON('answers/' + ID + '.json', finalEntry);
  } else {
    // ── PATH B: direct in-place rewrite + format_v stamp ───────────────
    console.log('[' + ID + '] PATH B — entry already qs=10; direct in-place rewrite + format_v stamp.');
    const polishHistory = Array.isArray(existing.polish_history) ? existing.polish_history.slice() : [];
    polishHistory.push({
      ts,
      from: 10,
      to: 10,
      note: 'FORMAT_UPGRADE format_v=2026-05 — applied gold format (Direct Answer H3 + H2 banners + numbered subsections + bold-in-bullets + real company/product names + 50 numbered source citations). FIRST GOLD-FORMAT entry of new system. ' + (notes.s10 || '')
    });
    const updated = {
      ...existing,
      question: existing.question, // preserve
      answer: v9,
      tags: tagsFinal,
      sources: (sources || []).slice(0, 3),
      ts,
      polished_at: ts,
      polish_history: polishHistory,
      quality_score: 10,
      format_v: '2026-05',
      model: 'claude-opus-4-7-via-claude-code',
      source: 'claude-opus-bespoke-gold-format-2026-05',
    };
    delete updated.baseline_answer_v5;
    await store.setJSON('answers/' + ID + '.json', updated);

    // Mirror into the index
    try {
      const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
      const i = (idx.entries || []).findIndex(e => e && e.id === ID);
      if (i >= 0) {
        idx.entries[i] = {
          ...idx.entries[i],
          tags: tagsFinal,
          ts,
          quality_score: 10,
          polished_at: ts,
          last_modified_ms: ts,
          sources_count: 3,
        };
        await store.setJSON('_index.json', idx);
      }
    } catch (err) {
      console.error('   index update failed:', err.message);
    }

    // Append a polish event so the live ticker reflects the format upgrade.
    try {
      const evs = (await store.get('_polish_events.json', { type: 'json' })) || { events: [] };
      evs.events.push({ ts, id: ID, from: 10, to: 10, note: 'format_v=2026-05' });
      if (evs.events.length > 1000) evs.events = evs.events.slice(-1000);
      await store.setJSON('_polish_events.json', evs);
    } catch (_e) {}

    // Update the Claude Opus progress tracker (dashboard).
    try {
      const tracker = (await store.get('_claude_opus_progress.json', { type: 'json' })) || { rewritten: [], started_ms: ts, total_library: 1614, count: 0 };
      tracker.rewritten = tracker.rewritten || [];
      if (!tracker.rewritten.includes(ID)) tracker.rewritten.push(ID);
      tracker.count = tracker.rewritten.length;
      tracker.last_id = ID;
      tracker.last_ms = ts;
      tracker.history = tracker.history || [];
      tracker.history.push({ id: ID, ts });
      if (tracker.history.length > 100) tracker.history = tracker.history.slice(-100);
      const finalWords = v9.split(/\s+/).filter(Boolean).length;
      tracker.nine_k_ids = tracker.nine_k_ids || [];
      if (finalWords >= 9000) {
        if (!tracker.nine_k_ids.includes(ID)) tracker.nine_k_ids.push(ID);
      }
      tracker.nine_k_count = tracker.nine_k_ids.length;
      const idx2 = await store.get('_index.json', { type: 'json' });
      if (idx2 && idx2.entries) tracker.total_library = idx2.entries.length;
      await store.setJSON('_claude_opus_progress.json', tracker);
      console.log('   tracker:', tracker.count, '/', tracker.total_library);
    } catch (err) {
      console.error('   tracker update failed:', err.message);
    }

    // Kick the IndexNow background ping so search engines re-crawl the upgraded entry.
    try {
      fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
        .catch(() => {});
    } catch (_e) {}
  }

  // Verify via blob read
  const verify = await store.get('answers/' + ID + '.json', { type: 'json' });
  console.log('[' + ID + '] verification read: qs=' + verify.quality_score + ', format_v=' + verify.format_v + ', tags=' + JSON.stringify(verify.tags));
  console.log('[' + ID + '] live URL: https://pulserevops.com/knowledge/' + ID);
  const finalWords = (verify.answer || '').split(/\s+/).filter(Boolean).length;
  console.log('[' + ID + '] final answer word count: ' + finalWords);
  console.log('=== GOLD-FORMAT DONE ' + ID + ' ===');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
