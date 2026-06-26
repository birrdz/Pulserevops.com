// q9669 -- How do you start a food truck business in 2027?
// Mobile food service from a truck/trailer -- distinct from ghost kitchen, brick-and-mortar restaurant, and pop-up catering
// VALUE over WORD COUNT. Target 8,000-10,500 words (AIM 8,500-9,500). Tight paragraphs (2-3 sentences).
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

const ID = 'q9669';
const QUESTION = 'How do you start a food truck business in 2027?';

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** **$80K-$200K** single owner-operator truck (used step van retrofit Freightliner MT45/Workhorse W42/Grumman Olson $25K-$65K + $40K-$90K build-out gas line + 80-gal fresh water + 3-compartment sink + Type-1 hood + propane + 6-burner range + flat-top + fryer + reach-in refrigeration + Honda EU7000is generator + commissary kitchen lease $400-$1,500/mo + state mobile food vendor permit + local health permit + commissary affidavit + GL insurance + propane fire suppression + POS Square/Toast/Clover + initial inventory + working capital); **$200K-$450K** new custom build via Cruising Kitchens, M&R Specialty Trailers, Apollo Custom Manufacturing, United Food Truck Builders + secondary trailer or 2-truck mini-fleet. Expect **3-9 months permit-to-first-service** + **18-30 months to second truck** + **NYC/LA permit lottery years-long wait**.
> - **[Margins]** Mature owner-operator truck: **28-38% gross + 10-22% net** at **$11-$18 avg ticket + 80-180 covers/day + $15K-$45K/mo revenue ($180K-$540K/yr)**. Food cost 28-34%; labor 22-32%; commissary + permits + insurance + fuel + propane + commission 18-26%. Mature 3-5 truck mini-fleet: **12-20% blended EBITDA at $600K-$2.5M revenue** if booking discipline + brand pull + catering anchor; **3-9%** if spray-and-pray events + no catering pipeline. **Sale multiples 1.5-3.0x SDE single truck + 3.0-5.0x EBITDA mini-fleet brand**.
> - **[Hardest part]** **Weather + seasonality + permit lottery + commissary scarcity + commission compression + owner burnout** (not capital, not concept). One rainy Saturday = 50% revenue loss; Nov-Feb Northern death zone halves annual ceiling; NYC Mobile Food Vending Permit lottery is years-long + LA Bureau of Street Services restricts zones + SF restricts mobile vending bans + Austin permit cap + Portland pod scarcity; commissary rents in coastal metros $1,500-$3,000/mo squeeze unit economics; Roaming Hunger/BestFoodTrucks 10-20% booking commission + DoorDash/Uber Eats hybrid 18-30% delivery fees; food cost inflation 30-60% post-COVID; restaurant lobby pushing brick-and-mortar protection ordinances; CA Advanced Clean Fleets EV transition 2025+ adds $40K-$120K per replacement cycle; Instagram algorithm reach collapse 2024-2026; 14-hour owner-operator days driving 30-50% Year 1-3 exit.

A **food truck business** in 2027 is a **state-and-local-permitted mobile food service operation** running prepared food from a self-contained truck or towable trailer kitchen at street locations, breweries, office parks, festivals, weddings, and corporate events. Three regulated pillars: **(1) state mobile food vendor or retail food establishment license**, **(2) local city or county health department mobile food unit permit + plan review**, **(3) commissary kitchen affidavit** (a licensed commercial kitchen used for prep, water fill, waste dump, and overnight parking — required in **44 of 50 US states**). Distinct from **ghost / cloud kitchens** (fixed-location delivery-only), **brick-and-mortar restaurants** (lease + Type-2 facility), and **pop-up catering** (intermittent at host venues without a mobile unit).

The 2027 demand reality: **~36,000-42,000 active US food trucks + trailers** per IBISWorld + National Food Truck Association + state DMV mobile food unit registrations, generating **~$2.5B-$3.2B annual revenue** and growing **4-7% CAGR** as brewery + office-park + festival programming rebuilt post-COVID and corporate-catering Fridays became the dominant high-margin channel. Average unit revenue **$180K-$540K/yr** with **10-22% net** for disciplined owner-operators; high-volume brand-backed trucks (Kogi BBQ-tier) clear **$650K-$1.4M**.

Five things that determine survival years 1-3: **(1) menu discipline** (a 6-8 item menu with one signature item beats a 22-item menu), **(2) location + booking pipeline** (brewery rotations + corporate Fridays + festival circuit beats roaming hope), **(3) cost-control hygiene** (food cost ≤32% + labor ≤30% or the math breaks), **(4) social media + Instagram Stories** location-of-the-day reach, **(5) owner physical + mental endurance** for 12-14 hr service days plus prep.

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & food truck vs ghost kitchen vs restaurant vs pop-up catering distinction](#market-size--food-truck-vs-ghost-kitchen-vs-restaurant-vs-pop-up-catering-distinction)
- [NFTA, state mobile food vendor & local health permits + commissary mandate](#nfta-state-mobile-food-vendor--local-health-permits--commissary-mandate)
- [Menu strategy: signature item, 6-8 item discipline & cuisine selection](#menu-strategy-signature-item-6-8-item-discipline--cuisine-selection)

**Part 2 -- Build-Out & Capital**
- [Truck vs trailer: step van retrofit, custom build & equipment selection](#truck-vs-trailer-step-van-retrofit-custom-build--equipment-selection)
- [Kitchen equipment, propane, generator & POS integration](#kitchen-equipment-propane-generator--pos-integration)
- [Capital stack: SBA microloan, equipment finance, founder equity & working capital](#capital-stack-sba-microloan-equipment-finance-founder-equity--working-capital)

**Part 3 -- Operations**
- [Staff: owner-operator, line cook, prep & weekend crew](#staff-owner-operator-line-cook-prep--weekend-crew)
- [Bookings: breweries, corporate Fridays, festivals & wedding catering](#bookings-breweries-corporate-fridays-festivals--wedding-catering)
- [Tech stack: Square/Toast/Clover POS, Roaming Hunger & BestFoodTrucks](#tech-stack-squaretoastclover-pos-roaming-hunger--bestfoodtrucks)
- [Marketing: Instagram Stories, TikTok, location-of-the-day & review engine](#marketing-instagram-stories-tiktok-location-of-the-day--review-engine)

**Part 4 -- Growth & Exit**
- [Scaling: second truck, brand expansion & brick-and-mortar conversion](#scaling-second-truck-brand-expansion--brick-and-mortar-conversion)
- [Exit math: mini-fleet sale, brick-and-mortar pivot & franchise model](#exit-math-mini-fleet-sale-brick-and-mortar-pivot--franchise-model)
- [Counter-case: weather, permit lottery, commissary scarcity, commission squeeze & owner burnout](#counter-case-weather-permit-lottery-commissary-scarcity-commission-squeeze--owner-burnout)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & food truck vs ghost kitchen vs restaurant vs pop-up catering distinction

The US mobile food unit segment is **~$2.5B-$3.2B annual revenue** across **~36,000-42,000 active trucks + trailers** per IBISWorld + NFTA + state DMV mobile food unit registrations, inside the **~$1.05T-$1.15T total US foodservice market** per NRA + BLS.

Adjacent mobile + small-footprint formats share food-handling mechanics but differ in unit economics. **(1) Food truck / trailer** (this entry) — self-contained mobile kitchen + street + event service, **$180K-$540K avg revenue/unit**, **10-22% net** mature. **(2) Ghost / cloud kitchen** — fixed-location delivery-only, **$300K-$1.2M revenue**, **8-18% net**, no dining-room labor. **(3) Brick-and-mortar restaurant** — lease + dining room + Type-2 facility, **$650K-$2.4M revenue**, **3-12% net**, far higher capital + risk. **(4) Pop-up catering** — chef + crew brings food to host venue, no mobile unit, intermittent + event-driven.

This entry centers on food truck / trailer because it has the lowest capital threshold among full-kitchen formats ($80K-$200K vs $400K-$1.5M restaurant), the strongest direct-to-consumer brand pull (Instagram + social), and the most flexible revenue mix (street + brewery + corporate + festival + catering).

### NFTA, state mobile food vendor & local health permits + commissary mandate

Mobile food regulation in the US is a **three-layer permit stack** — state retail food establishment license, local health department mobile food unit permit, and (in most states) a licensed commissary kitchen affidavit.

**State mobile food vendor / retail food establishment license.** Issued by state Department of Agriculture or Department of Health. Typical fee **$100-$500/yr**. Requires food safety plan + manager certification (**ServSafe Manager** or state equivalent) + facility inspection.

**Local health department mobile food unit permit.** Issued by city or county health department — **the binding permit**. Typical fee **$150-$2,500/yr**. Requires plan review of truck/trailer build (3-compartment sink + handwash + 40-80 gal fresh water + 50-100 gal gray water + Type-1 hood with fire suppression + mechanical ventilation + thermometer + propane certification). **Inspection 1-4x/yr**.

**Commissary kitchen affidavit.** **44 of 50 US states require** a licensed commercial kitchen for prep, water fill, waste dump, and overnight unit parking. Commissary cost **$400-$1,500/mo shared** (Cookbench, The Hatchery Chicago, Hudson Kitchen, Smelt, CommonWealth Kitchen, La Cocina SF, Union Kitchen DC). Coastal-metro commissary **$1,500-$3,000/mo** + waitlist. **CA, FL, NY, MA, NJ, IL** have especially strict commissary enforcement.

**City-specific street vending permit.** **NYC Mobile Food Vending Permit** — historically capped + multi-year lottery wait via NYC DOHMH supervisory license + permit; 2022 expansion adding ~445/yr through 2032. **LA Bureau of Street Services** — Sidewalk Vending Program + restricted zones. **SF** — Mobile Food Facility permit + restricted zones near brick-and-mortar restaurants. **Austin** — food truck permit + zoning + spacing rules per Austin Public Health. **Portland** — food cart pod model + pod operator permit. **Miami-Dade** — Mobile Food Dispensing Vehicle permit. **Chicago** — Mobile Food Dispenser + Mobile Food Preparer two-tier. Permit research is **the first 30-day deliverable** of any serious launch.

**Trade associations + advocacy.** **National Food Truck Association (NFTA)** (~thousands of operator members + state-level lobbying), **National Restaurant Association (NRA)** (umbrella; advocacy on mobile vending issues), **state food truck associations** (CA, TX, FL, GA, OR, WA active).

### Menu strategy: signature item, 6-8 item discipline & cuisine selection

Menu design is the single biggest determinant of Year 1-2 unit economics — covers per hour, food cost, prep complexity, and signature recognition all flow from menu architecture.

**Signature item discipline.** **One headline item** drives 40-65% of orders, social media reach, and brand identity. Korean BBQ taco (Kogi), Nashville hot chicken sandwich, smashed burger, birria taco, lobster roll, pulled pork sandwich, brisket plate, Detroit-style square slice. **Without a signature item there is no brand**.

**6-8 item menu max.** **More than 8 items kills speed + raises food cost waste**. Best-in-class trucks ship 4-6 entree variants + 2-3 sides + 1-2 drinks. Smaller menu = faster service = more covers/hr = higher daily revenue.

**Cuisine fit + cost structure.** **Tacos, burgers, BBQ, fried chicken, lobster rolls, pierogi, arepas, banh mi, ramen, shawarma, birria** — high taste-density + manageable food cost (28-34%) + photogenic for Instagram. **Avoid**: full pasta service (slow), full sushi (cold-chain risk), large-plate steakhouse (low covers/hr).

**Price-point band.** **$11-$18 avg ticket** is the sweet spot — high enough to clear $14-$17 contribution after food cost, low enough for impulse purchase + corporate Friday + brewery pairing.

**Dietary breadth.** **One vegetarian + one gluten-free option** unlocks **15-30% of orders** (catering RFPs especially require). Vegan optional but reduces vegan-specific exclusion in corporate bookings.

---

## 🏗️ PART 2 -- BUILD-OUT & CAPITAL

### Truck vs trailer: step van retrofit, custom build & equipment selection

The truck vs trailer decision is the **single biggest capital + lifestyle + regulatory decision** in launch — it locks in 5-10 years of cost structure, regulation, and revenue ceiling.

**Used step van retrofit.** **$25K-$65K used chassis** (Freightliner MT45/MT55, Workhorse W42, Grumman Olson, International, Utilimaster, GMC P30) + **$40K-$90K build-out** = **$65K-$155K all-in**. Pros: lower capital, faster build (8-16 weeks), depreciation absorbed. Cons: 100K-300K mile chassis, transmission + brake risk, retrofit fits limited galley footprint.

**New custom truck build.** **$80K-$200K** via **Cruising Kitchens (San Antonio), M&R Specialty Trailers (FL), Apollo Custom Manufacturing (TX), United Food Truck Builders, Concession Nation, Food Truck Empire builds**. Turnkey 14-26 week build. Pros: warranty, modern chassis, custom layout, code-compliant by design. Cons: $50K-$120K capital premium + waitlist.

**Towable trailer.** **$35K-$120K** typical (10-28 ft single-axle to dual-axle). Builders: **M&R Specialty Trailers, Concession Nation, Apollo, Trailer Concessions, Cargo Craft**. Pros: lighter regulation in some markets (treated as non-motorized in CA + TX + FL), separable from tow vehicle (Ford F-250/F-350/RAM 2500/Chevy Silverado 2500 $20K-$60K used) means insurance + maintenance separation. Cons: tow + park logistics, weather exposure, ramp ergonomics.

**Choose truck if** — high-mileage city circuit + permits favor motorized + breweries with cramped lots. **Choose trailer if** — primarily festival + corporate park + brewery rotation + lower capital + easier sale at exit.

### Kitchen equipment, propane, generator & POS integration

Kitchen + power + POS infrastructure is the second-largest capital category and drives 7-15 yrs of operating cost.

**Cooking line.** **6-burner range $4K-$8K** (Vulcan, Wolf, Garland, American Range) + **flat-top griddle $2K-$5K** + **fryer $1.5K-$4K** (Pitco, Frymaster) + **char-broiler $1.5K-$4K** (optional) + **convection oven or salamander $2K-$5K** (optional). Most owner-operator trucks: range + flat-top + fryer = $7.5K-$17K cookline core.

**Refrigeration + prep.** **Reach-in refrigeration $3K-$8K** + **undercounter refrigerator $1.5K-$3.5K** + **prep tables + cutting boards $1.5K-$4K** + **3-compartment sink + handwash $1K-$3K**. **True, Beverage-Air, Turbo Air, Atosa** dominant brands.

**Ventilation + fire suppression.** **Type-1 hood + exhaust $4K-$12K** + **Ansul R-102 wet-chemical fire suppression $2K-$5K** (required by NFPA 96 + local code). Fire-marshal inspection annual.

**Propane + water.** **Propane tank 40-100 lb $400-$800** + regulator + leak detector. **Fresh water tank 40-80 gal + gray water tank 50-100 gal + water heater $1.5K-$3.5K**.

**Generator.** **Honda EU7000is $5.5K-$7.5K** is the gold-standard (quiet 52-60 dB, inverter, fuel-efficient). Alternatives: **Generac GP7500E, Champion 7500W, Yamaha EF6300iSDE**. Plug-and-play preferred over hardwired alternator for resale + service flexibility. **Some pods + breweries provide shore power** ($25-$75/event) eliminating generator need.

**POS + payment processing.** **Square for Restaurants $0-$60/mo + 2.6%+10¢ in-person**, **Toast Now $0-$165/mo + 2.49-3.5%**, **Clover Flex $14.95-$70/mo + 2.3-2.6%**, **Revel Systems $99-$300/mo enterprise**. Square dominant for owner-operator (no contract, fast deploy, integrated KDS + online ordering). Toast preferred for multi-truck mini-fleet (kitchen routing + payroll integrations).

**Total equipment + build-out.** **$40K-$90K used retrofit** vs **$60K-$140K new custom** depending on cuisine + cookline complexity + refrigeration density.

### Capital stack: SBA microloan, equipment finance, founder equity & working capital

Food truck capital stacks lean toward equipment finance + SBA microloan + founder equity + occasionally a small commercial loan, reflecting the low asset base + chassis-collateral mismatch.

**Founder equity.** **$25K-$80K** typical. New owner-operator typically self-funds 30-60% of build via savings + family + 401(k) loan (Solo 401(k) up to $50K). Bootstrap is the dominant pattern.

**SBA microloan.** **$500-$50K via SBA-approved intermediary lenders** (Accion Opportunity Fund, Justine Petersen, LiftFund, CDC Small Business Finance, Pacific Community Ventures). Rate **8-13%**, 6-yr term. Often combined with technical assistance.

**SBA 7(a) (rare for trucks).** **$50K-$500K** for established operator with collateral + 2+ yr track record. Underwriting tough because chassis depreciates fast. **Live Oak Bank, Huntington, Wells Fargo SBA** occasionally fund food truck SBA but require strong personal credit + 20-30% down + commissary lease + signed booking pipeline.

**Equipment finance.** **$25K-$120K** for truck build + kitchen equipment. **5-7 yr at 9-16% effective**. **Balboa Capital, Crest Capital, Direct Capital, Beacon Funding, US Capital, National Funding**. Truck builders (Cruising Kitchens, M&R, Apollo) bundle in-house financing through partners.

**Working capital + LOC.** **$10K-$50K LOC** (Bluevine, OnDeck, Kabbage, business credit card) for first-90-day food cost + commissary + insurance + propane + payroll lag. Mandatory — uncovered Year 1 working capital is the #1 cause of Month 6-12 distress.

**Crowdfunding + community.** **Kickstarter, Indiegogo, Mainvest, Honeycomb Credit** raise $10K-$80K for cuisine-driven launches with strong local fan base. Less common than restaurant but functional for specialty cuisine (vegan, regional Mexican, BBQ).

**Total capital stack typical.** **$80K-$200K owner-operator** (60% equity + 30% equipment finance + 10% LOC) vs **$200K-$450K custom-build + early-mini-fleet** (40% equity + 35% equipment finance + 15% SBA + 10% LOC).

---

## ⚙️ PART 3 -- OPERATIONS

### Staff: owner-operator, line cook, prep & weekend crew

Labor is the second-biggest line item after food cost — and the truck's tight footprint makes staffing decisions especially constrained.

**Owner-operator.** Year 1-2: **owner works 60-80 hrs/wk** across prep + service + bookings + social + admin. Owner take-home **$28K-$95K Year 1-2** depending on cuisine + volume + debt service; Year 3-5 mature **$55K-$140K** if disciplined.

**Line cook.** **$15-$22/hr part-time + $32K-$48K full-time**. Critical for owner sanity. Best to hire by Month 4-8 if revenue ramp supports. Pediatric food truck talent pipeline is **the brewery + restaurant adjacent line cook**.

**Prep cook (commissary).** **$14-$20/hr part-time, 10-25 hrs/wk**. Handles morning prep at commissary so service crew rolls efficient. **$13-$18K/yr added cost** but unlocks 30-50% more covers/day.

**Weekend service crew.** **$13-$20/hr**, 8-16 hr shifts on Sat-Sun festival + brewery + catering. Often culinary students or restaurant-industry side hustlers.

**Per-shift economics.** Mature owner-operator truck targets **80-180 covers/shift** + **$11-$18 avg ticket** = **$880-$3,240/shift gross**. Best brewery + festival shifts clear **$3,500-$7,500**; corporate Friday lunches **$1,800-$4,200**. Costs: food **28-34%** + labor **22-32%** + commissary + permits + insurance + fuel + propane + commission **18-26%** = net **10-22%**.

### Bookings: breweries, corporate Fridays, festivals & wedding catering

Booking pipeline is **the single biggest determinant of revenue volatility** — anchor-tenant relationships beat spray-and-pray every time.

**Brewery rotations.** **The single most consistent channel** in 2027. Breweries (taprooms without kitchens) want rotating food trucks **2-5 days/week**. Typical: **$0-$50 site fee** + 100% retail revenue + brewery social-media boost. Build 4-8 brewery anchors within 30-mi radius — **2-3 nights/wk + 1-2 weekend lunches** baseline.

**Corporate Friday + office park.** **$1,800-$4,200/shift** (11am-1:30pm). Tech + insurance + healthcare offices schedule rotating trucks for employee perks. Direct outreach + **MOGL, Roaming Hunger Office, BestFoodTrucks Corporate** marketplaces. **10-20% commission** on platform-sourced bookings.

**Wedding + private catering.** **$1,800-$8,500/event** for 80-300 guests. **Highest-margin channel** (40-55% gross). Couples want **food truck cocktail-hour + reception food** as alternative to traditional catering. Lead via **The Knot, WeddingWire, Zola, Yelp**, wedding planners, venue referral.

**Festival circuit.** **$3,500-$7,500/event peak** at music + craft + food + cultural festivals. **$150-$1,500 booth fee** + 10-20% revenue share at some. **Coachella, ACL, Lollapalooza** are aspirational; regional festivals (state fairs, beer-fests, food-truck-festivals, farmers markets) drive most volume.

**Roaming Hunger + BestFoodTrucks + Truckster.** **10-20% commission** booking platforms aggregate corporate + wedding + event leads. Critical Year 1-2 for pipeline; Year 3+ owners reduce dependency by direct-booking repeat clients.

**Hybrid: street + drive-up + DoorDash/Uber Eats.** **DoorDash + Uber Eats food truck pilots** (active in select metros) take **18-30% commission** + **delivery driver wait time** — generally **margin-negative** for trucks vs restaurants. Most operators decline.

### Tech stack: Square/Toast/Clover POS, Roaming Hunger & BestFoodTrucks

Tech stack is the invisible difference between a 20% net truck + a 7% net truck — scheduling, payment, and CRM data are all software-mediated.

**POS + payment.** **Square for Restaurants** dominant single-truck (no contract, 2.6%+10¢, free POS app, integrated KDS + online ordering + gift cards). **Toast Now** for 2+ truck mini-fleet (kitchen routing + payroll + multi-location reporting). **Clover Flex** middle option. **Revel Systems** enterprise.

**Booking platforms.** **Roaming Hunger** (largest US food truck booking marketplace, 10-20% commission), **BestFoodTrucks** (similar marketplace), **Truckster** (newer entrant, lower commission), **MOGL** (corporate event focus), **Cater2.me + ezCater** (corporate catering aggregation).

**Scheduling + tracking.** **Streetfood Finder** (consumer-facing truck location app), **FoodTrucksIn** (regional directories). Owner-operators update **Instagram Stories + Google Business Profile location-of-the-day** daily.

**Accounting + payroll.** **QuickBooks Online $30-$200/mo + Gusto $40-$80/mo + ADP Run** for payroll + 1099 + tip reporting. **Bill.com** for vendor payments. **Bench, Xendoo, Pilot** for outsourced bookkeeping ($200-$800/mo).

**Inventory + food cost.** **MarketMan, Restaurant365, MarginEdge** for food cost tracking (typically Year 2+ when revenue justifies $100-$400/mo subscription). Many owner-operators use **Google Sheets + weekly inventory count** through Year 1.

**Marketing CRM.** **Mailchimp + Klaviyo + ConstantContact** for email blasts to catering leads + brewery partners. **Loyalty: Square Loyalty, Toast Loyalty, Belly** for repeat-customer punch cards.

### Marketing: Instagram Stories, TikTok, location-of-the-day & review engine

Marketing mix in 2027 food truck is **35-55% Instagram + 15-30% word-of-mouth + 10-20% Google + 10-15% platform/marketplace**. Social media is the operating reality, not the marketing nice-to-have.

**Instagram Stories location-of-the-day.** **The single highest-leverage marketing activity**. Post Stories + Reels + grid post 30-90 min before service with **location pin + time window + menu photo + signature item**. **5K-30K followers** is the practical threshold for consistent foot traffic. Post 1-3x/day during service window.

**TikTok food content.** **Food-truck content has 8-25x reach of restaurant content** on TikTok 2024-2026 — operators (truck build, prep, signature-item drop, satisfying-food shots) build 50K-500K followers fast. Translation to revenue requires **clear location + menu callouts** in caption + bio.

**Google Business Profile + reviews.** **50-200 reviews at 4.6+ stars** is the foot-traffic decisive threshold. Update GBP with daily location (when on consistent schedule) or weekly with brewery rotation.

**Roaming Hunger + BestFoodTrucks profile.** Free profile + paid promotion + booking pipeline. Critical for corporate + wedding lead-flow Year 1-2.

**Brewery + venue social cross-promotion.** Brewery posts truck schedule on their Instagram + email + Untappd; truck posts brewery schedule. **2-4x reach amplification** vs solo posting.

**Festival + community word-of-mouth.** Street festivals + farmers markets + food-truck-festivals build the deep neighborhood loyalty + organic Yelp reviews + WOMM that compounds 2-5 yrs.

**Wedding/event referral.** Wedding planners + venue managers + corporate event coordinators repeat-book successful trucks. **20-40% of mature catering revenue** comes from repeat referral.

---

## 🚀 PART 4 -- GROWTH & EXIT

### Scaling: second truck, brand expansion & brick-and-mortar conversion

The growth path from single owner-operator truck to multi-truck brand or brick-and-mortar has well-defined milestones, each triggering a capital + management + format decision.

**Stage 1 (Months 0-12).** Solo owner-operator + 0-1 part-time crew. **$120K-$280K Year 1 revenue, $15K-$70K owner take-home** after debt service + commissary. Risk: permit lag + booking pipeline ramp + Year 1 burnout.

**Stage 2 (Years 1-3).** Add line cook + weekend crew + 6-12 brewery + corporate anchor accounts + 8-20 catering events/yr. **$200K-$450K revenue, 12-20% net + $45K-$110K take-home**.

**Stage 3 (Years 2-5).** Second truck (new build $100K-$200K or used $50K-$120K). **$400K-$900K revenue, 12-18% blended net + $80K-$160K take-home**. Requires general manager / second owner-operator + central commissary + shared brand.

**Stage 4 (Years 4-8).** 3-5 truck mini-fleet + central kitchen + dedicated catering account manager. **$900K-$2.5M revenue, 12-20% EBITDA**. Catering + festival + corporate accounts become 50-70% of revenue.

**Stage 5 (Years 5-12).** Brand expansion via **(a) brick-and-mortar restaurant + flagship**, **(b) franchise / licensing model**, **(c) packaged retail (sauce + spice + frozen)**, or **(d) ghost kitchen + delivery pivot**. **$2M-$15M revenue** if successful — many trucks fail at this transition.

| Stage | Timeline | Trucks | Annual Revenue | Net Margin |
|---|---|---|---|---|
| Stage 1 Solo launch | Months 0-12 | 1 | $120K-$280K | Owner take-home |
| Stage 2 Mature solo | Years 1-3 | 1 | $200K-$450K | 12-20% |
| Stage 3 Two trucks | Years 2-5 | 2 | $400K-$900K | 12-18% |
| Stage 4 Mini-fleet | Years 4-8 | 3-5 | $900K-$2.5M | 12-20% EBITDA |
| Stage 5 Brand expansion | Years 5-12 | 5+ / BAM / franchise | $2M-$15M | 8-18% |

| Sizing Decision | Capital | Annual Revenue | Best For |
|---|---|---|---|
| Solo owner-operator used retrofit | $80K-$155K | $200K-$450K | First-time founder + bootstrap + cuisine passion |
| Solo new custom build | $200K-$450K | $250K-$540K | Established cuisine + investor capital + premium brand |
| Trailer + tow vehicle | $55K-$180K | $180K-$420K | Festival + corporate park focus + lower regulation states |
| 2-truck mini-fleet | $200K-$500K | $400K-$900K | Year 2-3 expansion with proven concept |
| 3-5 truck mini-fleet + central kitchen | $500K-$1.5M | $900K-$2.5M | Year 4+ operator with catering pipeline + GM bench |
| Brick-and-mortar conversion + truck brand | $400K-$1.5M BAM + 1-3 trucks | $1.5M-$5M | Mature brand with location + lease + concept fit |

### Exit math: mini-fleet sale, brick-and-mortar pivot & franchise model

The food truck exit landscape is dominated by **owner-operator burnout exits + single-truck flips + the occasional successful brand transition to brick-and-mortar or franchise** — true brand exits are rare but lucrative when they happen.

**Single truck owner-operator sale.** **$45K-$180K typical** = build-cost less depreciation + permits + brand premium. **1.5-3.0x SDE** if profitable. Buyer: aspiring owner-operator + small fleet operator + culinary entrepreneur. Process **2-6 months** via Craigslist + Facebook Marketplace + UsedVending + RoamingHunger Marketplace + BizBuySell.

**Mini-fleet sale (2-5 trucks).** **$200K-$1.2M** = **3.0-5.0x SDE/EBITDA** if brand pull + catering pipeline + commissary lease assignable. Buyer: regional restaurant group + private investor + restaurant operator with capital. Process **4-10 months**.

**Brand + IP licensing / franchise.** **Kogi BBQ, The Halal Guys, The Cheesecake Truck, Cousins Maine Lobster, The Lime Truck, Mighty Bento, The Grilled Cheese Truck** are examples of food truck brands that scaled to franchise / BAM / licensing. **Cousins Maine Lobster** notably franchised 40+ units across US. Royalties **5-8% revenue + 2-4% marketing**.

**Brick-and-mortar conversion.** **$400K-$1.5M restaurant build-out** funded by truck brand momentum + customer base + investor. Common path: 2-3 year mature truck → flagship BAM → trucks become marketing + overflow. **30-50% of trucks that attempt BAM transition fail within 24 months** (different cost structure, lease commitment, kitchen labor scale).

**Asset wind-down.** **$25K-$90K** truck + equipment liquidation via UsedVending, RoamingHunger Marketplace, Facebook Marketplace, eBay Motors. Permits typically don't transfer (NYC permits historically transferable but tightly controlled).

**Acquihire by restaurant group.** Restaurant groups (especially in big metros) acquire popular food truck brands for **brand + chef + customer base** as a path to a new BAM concept. **$150K-$800K** typical + 1-3 yr earn-out.

| Exit Path | Buyer Type | Typical Multiple | Process Length | Best For |
|---|---|---|---|---|
| Single truck owner-operator sale | Aspiring operator + small fleet | 1.5-3.0x SDE | 2-6 months | $45K-$180K single-truck exit |
| Mini-fleet sale 2-5 trucks | Regional restaurant group + investor | 3.0-5.0x SDE/EBITDA | 4-10 months | $200K-$1.2M established brand |
| Franchise / licensing | Single-unit franchisees | 5-8% royalty + 2-4% marketing | 12-36 months | Mature brand with playbook |
| Brick-and-mortar conversion | Self + investor | Build cost not multiple | 18-30 months | Mature brand + capital + chef bench |
| Asset wind-down | Used-truck buyer | Equipment liquidation | 30-90 days | Distressed or burnout exit |
| Acquihire by restaurant group | Local restaurant group | $150K-$800K + earn-out | 4-9 months | Brand + customer base | concept fit |

### Counter-case: weather, permit lottery, commissary scarcity, commission squeeze & owner burnout

A serious food truck founder must stress-test the case above against the conditions that make this category harder in 2027. The full 14-element counter-case is below.

`;

const tldr = `**TL;DR:** Starting a **food truck business in 2027** (a.k.a. **mobile food unit**, **food truck**, **food trailer**, **mobile food service operation**) -- the **state-and-local-permitted self-contained mobile food kitchen run from a step-van truck or towable trailer serving prepared food at street locations + breweries + office parks + festivals + weddings + corporate Friday lunches + farmers markets + cultural events across three regulatory pillars: (1) state mobile food vendor or retail food establishment license issued by state Department of Agriculture or Department of Health $100-$500/yr requiring food safety plan + ServSafe Manager certification, (2) local city or county health department mobile food unit permit $150-$2,500/yr with plan review of build (3-compartment sink + handwash + 40-80 gal fresh + 50-100 gal gray water + Type-1 hood with Ansul R-102 fire suppression + mechanical ventilation + propane certification) + 1-4x/yr inspection, (3) commissary kitchen affidavit (44 of 50 states require licensed commercial kitchen for prep + water fill + waste dump + overnight parking) + city-specific street vending permits NYC Mobile Food Vending Permit DOHMH multi-year lottery wait + LA Bureau of Street Services restricted zones + SF Mobile Food Facility permit + Austin food truck ordinance + Portland food cart pod + Miami-Dade Mobile Food Dispensing Vehicle + Chicago Mobile Food Dispenser/Preparer two-tier** -- means navigating **NFTA National Food Truck Association advocacy + NRA National Restaurant Association umbrella + state food truck associations (CA + TX + FL + GA + OR + WA active) + truck chassis used step van Freightliner MT45/MT55 + Workhorse W42 + Grumman Olson + International + Utilimaster + GMC P30 $25K-$65K used + $40K-$90K build-out = $65K-$155K all-in + new custom build $80K-$200K via Cruising Kitchens San Antonio + M&R Specialty Trailers FL + Apollo Custom Manufacturing TX + United Food Truck Builders + Concession Nation + towable trailer $35K-$120K via M&R + Concession Nation + Apollo + Trailer Concessions + Cargo Craft + tow vehicle Ford F-250/F-350 + RAM 2500 + Chevy Silverado 2500 $20K-$60K used + kitchen cookline Vulcan/Wolf/Garland/American Range 6-burner $4K-$8K + flat-top $2K-$5K + fryer $1.5K-$4K Pitco/Frymaster + char-broiler optional + convection oven optional + reach-in refrigeration True/Beverage-Air/Turbo Air/Atosa $3K-$8K + undercounter + prep tables + 3-comp sink + handwash $1K-$3K + Type-1 hood + Ansul fire suppression $6K-$17K + propane tank 40-100 lb $400-$800 + fresh + gray water + water heater $1.5K-$3.5K + generator Honda EU7000is $5.5K-$7.5K preferred or Generac GP7500E + Champion 7500W + Yamaha EF6300iSDE + commissary kitchen lease $400-$1,500/mo shared (Cookbench + The Hatchery Chicago + Hudson Kitchen + Smelt + CommonWealth Kitchen + La Cocina SF + Union Kitchen DC) or coastal-metro $1,500-$3,000/mo + waitlist + general liability insurance $1K-$3K/yr Progressive Commercial + Geico Commercial + Insure My Food Truck + FLIP Food Liability Insurance Program + workers comp + food spoilage coverage + propane fire risk coverage + POS Square for Restaurants $0-$60/mo + 2.6%+10¢ + Toast Now $0-$165/mo + 2.49-3.5% + Clover Flex $14.95-$70/mo + 2.3-2.6% + Revel Systems $99-$300/mo + booking platforms Roaming Hunger 10-20% commission + BestFoodTrucks + Truckster lower commission + MOGL corporate event + Cater2.me + ezCater corporate catering + accounting QuickBooks Online + Gusto + ADP Run + Bench/Xendoo/Pilot outsourced + inventory MarketMan + Restaurant365 + MarginEdge + marketing Instagram Stories + Reels + TikTok food-content + Google Business Profile reviews + GBP location-of-the-day + Mailchimp + Klaviyo + ConstantContact email + Square Loyalty + Toast Loyalty + Belly punch-card + Streetfood Finder + FoodTrucksIn directories + capital stack founder equity $25K-$80K + SBA microloan $500-$50K Accion Opportunity Fund + Justine Petersen + LiftFund + CDC Small Business Finance + Pacific Community Ventures 8-13% 6-yr + SBA 7(a) rare $50K-$500K Live Oak + Huntington + Wells Fargo + equipment finance Balboa + Crest + Direct Capital + Beacon Funding + US Capital + National Funding 9-16% 5-7 yr + working capital LOC Bluevine + OnDeck + Kabbage + business credit card $10K-$50K + crowdfunding Kickstarter + Indiegogo + Mainvest + Honeycomb Credit + menu discipline 6-8 item max + signature item (Korean BBQ taco Kogi + Nashville hot chicken + smashed burger + birria taco + lobster roll + pulled pork + brisket + Detroit-style slice) + $11-$18 avg ticket sweet spot + bookings brewery rotations $0-$50 site fee 2-5 days/wk + corporate Friday office park $1,800-$4,200/shift + wedding catering $1,800-$8,500/event highest margin via The Knot + WeddingWire + Zola + festival circuit $3,500-$7,500 peak Coachella + ACL + Lollapalooza aspirational + regional festivals state fairs + beer-fests + food-truck-festivals + farmers markets primary volume + brand exit franchise model Cousins Maine Lobster 40+ franchise + The Halal Guys + Kogi + The Cheesecake Truck + The Lime Truck + Mighty Bento + The Grilled Cheese Truck + brick-and-mortar conversion + acquihire by restaurant group**, and operating against **~36,000-42,000 active US food trucks + trailers per IBISWorld + NFTA + state DMV registrations + ~$2.5B-$3.2B annual revenue + 4-7% CAGR + inside ~$1.05T-$1.15T total US foodservice market + counter-pressures weather (one rainy Saturday = 50% revenue loss) + seasonality Nov-Feb Northern death zone halves annual ceiling + NYC permit lottery years-long + LA street services restricted zones + SF brick-and-mortar protection zones + Austin permit cap + Portland pod scarcity + commissary scarcity coastal $1,500-$3,000/mo waitlist + Roaming Hunger/BestFoodTrucks 10-20% commission + DoorDash/Uber Eats 18-30% margin-negative hybrid + food cost inflation 30-60% post-COVID + labor shortage restaurant-adjacent + generator noise/emissions ordinances + propane fire risk + theft from parked trucks + restaurant lobby brick-and-mortar protection ordinances + CA Advanced Clean Fleets EV transition 2025+ $40K-$120K replacement cycle + Instagram algorithm reach collapse 2024-2026 + SmileDirect-equivalent direct-to-consumer ghost-kitchen migration + customer COVID-era preference for delivery-only + owner burnout 14-hour days driving 30-50% Year 1-3 exit** -- capturing **mature owner-operator truck 28-38% gross + 10-22% net at $11-$18 avg ticket + 80-180 covers/day + $15K-$45K/mo revenue ($180K-$540K/yr) + food cost 28-34% + labor 22-32% + commissary + permits + insurance + fuel + propane + commission 18-26% + mature 3-5 truck mini-fleet 12-20% blended EBITDA at $600K-$2.5M revenue if booking discipline + brand pull + catering anchor (3-9% if spray-and-pray + no catering pipeline) + sale multiples 1.5-3.0x SDE single truck + 3.0-5.0x EBITDA mini-fleet brand + owner-operator take-home $28K-$95K Year 1-2 + $55K-$140K Year 3-5 mature + line cook $15-$22/hr part-time + $32K-$48K full-time + prep cook commissary $14-$20/hr 10-25 hrs/wk + weekend service crew $13-$20/hr + best brewery + festival shifts $3,500-$7,500 + corporate Friday $1,800-$4,200 + wedding catering 40-55% gross**. The hardest part is **weather + seasonality + permit lottery + commissary scarcity + commission compression + owner burnout (one rainy Saturday = 50% revenue loss + Nov-Feb Northern death zone + NYC/LA/SF/Austin/Portland permit lottery + commissary rents in coastal metros $1,500-$3,000/mo + Roaming Hunger/BestFoodTrucks/DoorDash commission stack + food cost inflation + restaurant-lobby brick-and-mortar protection + CA EV transition + Instagram algorithm + owner-operator 14-hour days + 30-50% Year 1-3 exit rate)**, not capital or concept.`;

const flow = `

## The Operating Journey: From Concept + Cuisine + Permits + Truck Build To Mature Multi-Truck Brand And Strategic Exit

\`\`\`mermaid
flowchart TD
  A[Aspiring Food Truck Founder Decides To Launch] --> B[Concept + Cuisine + Truck vs Trailer + Permit + Capital Strategy]
  B --> B1{Truck vs Trailer vs Mini-Fleet From Day 1 vs Acquisition}
  B1 -->|$80K-$155K Used Step Van Retrofit Freightliner MT45/Workhorse W42/Grumman Olson| C1[Used Truck Retrofit]
  B1 -->|$200K-$450K New Custom Build Cruising Kitchens/M&R/Apollo/United Food Truck Builders| C2[New Custom Truck]
  B1 -->|$55K-$180K Trailer + Tow Vehicle Ford F-250/RAM 2500/Chevy 2500| C3[Trailer + Tow Path]
  B1 -->|$200K-$500K Two Truck Mini-Fleet From Day 1 Proven Concept| C4[2-Truck Day 1]
  B1 -->|Acquire Existing Food Truck With Brand + Pipeline 1.5-3.0x SDE| C5[Acquisition Path]
  C1 --> D[Permits Plus Commissary Plus Insurance Plus Build-Out Plus Brand]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  D --> D1[State Mobile Food Vendor / Retail Food Establishment License + ServSafe Manager Cert $100-$500/yr]
  D --> D2[Local Health Department Mobile Food Unit Permit + Plan Review + 1-4x/yr Inspection $150-$2,500/yr]
  D --> D3[Commissary Kitchen Affidavit Required In 44 of 50 States $400-$3,000/mo Cookbench/Hudson Kitchen/Hatchery Chicago/Smelt/La Cocina/Union Kitchen]
  D --> D4[City-Specific Street Vending Permit NYC DOHMH Mobile Food Vending + LA Bureau of Street Services + SF Mobile Food Facility + Austin + Portland Pod + Miami-Dade + Chicago Two-Tier]
  D --> D5[Propane Certification + Type-1 Hood + Ansul R-102 Fire Suppression + Fire Marshal Annual + NFPA 96]
  D --> D6[General Liability Insurance $1K-$3K/yr Progressive Commercial + Geico + Insure My Food Truck + FLIP + Workers Comp + Food Spoilage + Propane Fire Coverage]
  D1 --> E[Truck Build + Cookline + Refrigeration + Power + POS]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  D6 --> E
  E --> E1[Used Step Van Retrofit $25K-$65K Chassis + $40K-$90K Build-Out = $65K-$155K All-In]
  E --> E2[New Custom Truck $80K-$200K Cruising Kitchens/M&R Specialty Trailers/Apollo Custom Manufacturing/United Food Truck Builders/Concession Nation 14-26 wk Build]
  E --> E3[Trailer $35K-$120K M&R/Concession Nation/Apollo/Trailer Concessions/Cargo Craft + Tow Vehicle $20K-$60K Used]
  E --> E4[Cookline Vulcan/Wolf/Garland/American Range 6-Burner $4K-$8K + Flat-Top $2K-$5K + Fryer Pitco/Frymaster $1.5K-$4K + Optional Char-Broiler + Convection Oven]
  E --> E5[Refrigeration True/Beverage-Air/Turbo Air/Atosa Reach-In $3K-$8K + Undercounter $1.5K-$3.5K + Prep Tables + 3-Comp Sink + Handwash $1K-$3K]
  E --> E6[Type-1 Hood + Exhaust $4K-$12K + Ansul R-102 Wet-Chemical Fire Suppression $2K-$5K + NFPA 96 Compliance]
  E --> E7[Propane Tank 40-100 lb $400-$800 + Regulator + Leak Detector + Fresh Water 40-80 gal + Gray Water 50-100 gal + Water Heater $1.5K-$3.5K]
  E --> E8[Generator Honda EU7000is $5.5K-$7.5K Gold Standard Quiet 52-60 dB Inverter + Alternatives Generac GP7500E/Champion 7500W/Yamaha EF6300iSDE + Shore Power $25-$75/event Available]
  E --> E9[POS Square for Restaurants $0-$60/mo + 2.6%+10¢ Owner-Operator Dominant + Toast Now $0-$165/mo + 2.49-3.5% Mini-Fleet + Clover Flex + Revel Systems Enterprise]
  E1 --> F[Capital Stack + Financing + Working Capital]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  E6 --> F
  E7 --> F
  E8 --> F
  E9 --> F
  F --> F1[Founder Equity $25K-$80K Typical Self-Fund 30-60% + Family + 401(k) Loan Solo 401(k) Up To $50K]
  F --> F2[SBA Microloan $500-$50K Accion Opportunity Fund + Justine Petersen + LiftFund + CDC Small Business Finance + Pacific Community Ventures 8-13% 6-yr]
  F --> F3[SBA 7(a) Rare $50K-$500K Live Oak Bank + Huntington + Wells Fargo SBA Requires Strong Credit + 20-30% Down + Commissary Lease + Booking Pipeline]
  F --> F4[Equipment Finance $25K-$120K Balboa Capital + Crest Capital + Direct Capital + Beacon Funding + US Capital + National Funding 9-16% 5-7 yr]
  F --> F5[Working Capital LOC $10K-$50K Bluevine + OnDeck + Kabbage + Business Credit Card First-90-Day Food Cost + Commissary + Insurance + Propane + Payroll Lag]
  F --> F6[Crowdfunding Kickstarter + Indiegogo + Mainvest + Honeycomb Credit $10K-$80K Cuisine-Driven Strong Local Fan Base]
  F --> F7[Truck Builder In-House Financing Cruising Kitchens/M&R/Apollo Bundle Through Partners]
  F1 --> G[Staff + Service + Per-Shift Economics]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  F6 --> G
  F7 --> G
  G --> G1[Owner-Operator 60-80 hrs/wk Prep + Service + Bookings + Social + Admin + Take-Home $28K-$95K Year 1-2 + $55K-$140K Year 3-5]
  G --> G2[Line Cook $15-$22/hr Part-Time + $32K-$48K Full-Time Hire By Month 4-8 If Revenue Supports + Brewery + Restaurant Adjacent Talent Pipeline]
  G --> G3[Prep Cook Commissary $14-$20/hr 10-25 hrs/wk Morning Prep Unlocks 30-50% More Covers/Day + $13K-$18K/yr Added Cost]
  G --> G4[Weekend Service Crew $13-$20/hr 8-16 hr Shifts Sat-Sun Festival + Brewery + Catering + Culinary Students + Restaurant Side Hustlers]
  G --> G5[Per-Shift Target 80-180 Covers + $11-$18 Avg Ticket = $880-$3,240/Shift Gross + Best Brewery/Festival $3,500-$7,500 + Corporate Friday $1,800-$4,200]
  G1 --> H[Booking Pipeline + Channel Mix]
  H --> H1[Brewery Rotations 2-5 days/wk $0-$50 Site Fee + 100% Retail + Social Boost + 4-8 Anchor Breweries Within 30 mi]
  H --> H2[Corporate Friday + Office Park $1,800-$4,200/shift Direct Outreach + MOGL + Roaming Hunger Office + BestFoodTrucks Corporate 10-20% Commission]
  H --> H3[Wedding + Private Catering $1,800-$8,500/event 80-300 Guests Highest Margin 40-55% Gross + The Knot + WeddingWire + Zola + Wedding Planners + Venue Referral]
  H --> H4[Festival Circuit $3,500-$7,500 Peak $150-$1,500 Booth Fee + 10-20% Revenue Share + Coachella/ACL/Lollapalooza Aspirational + Regional Festivals Primary Volume]
  H --> H5[Roaming Hunger + BestFoodTrucks + Truckster 10-20% Commission Aggregate Corporate + Wedding + Event Leads Critical Year 1-2 Reduce Year 3+]
  H --> H6[DoorDash/Uber Eats Hybrid 18-30% Commission Generally Margin-Negative Most Operators Decline]
  H1 --> I[Tech Stack + Marketing + Reviews]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  H6 --> I
  I --> I1[POS Square for Restaurants Single-Truck Dominant + Toast Now Mini-Fleet + Clover Middle + Revel Enterprise + Integrated KDS + Online Ordering + Gift Cards]
  I --> I2[Booking Platforms Roaming Hunger Largest US Marketplace + BestFoodTrucks + Truckster Newer + MOGL Corporate + Cater2.me + ezCater Corporate Catering]
  I --> I3[Scheduling + Tracking Streetfood Finder Consumer App + FoodTrucksIn Regional + Instagram Stories + Google Business Profile Location-Of-The-Day Daily Update]
  I --> I4[Accounting QuickBooks Online $30-$200/mo + Gusto $40-$80/mo + ADP Run + Bill.com + Bench/Xendoo/Pilot Outsourced $200-$800/mo]
  I --> I5[Inventory + Food Cost MarketMan + Restaurant365 + MarginEdge Year 2+ When Revenue Justifies $100-$400/mo + Google Sheets Through Year 1]
  I --> I6[Marketing Instagram Stories Location-Of-The-Day 5K-30K Followers Practical Threshold + TikTok Food-Content 8-25x Reach + Google Business Profile 50-200 Reviews 4.6+ Stars + Brewery Cross-Promo 2-4x Amplification]
  I1 --> J[Stage Growth + Mini-Fleet + Brand Expansion]
  I2 --> J
  I3 --> J
  I4 --> J
  I5 --> J
  I6 --> J
  J --> J1[Stage 1 Solo Launch Months 0-12 1 Truck $120K-$280K $15K-$70K Owner Take-Home + Permit Lag + Booking Pipeline Ramp + Burnout Risk]
  J --> J2[Stage 2 Mature Solo Years 1-3 1 Truck $200K-$450K 12-20% Net + Line Cook + Weekend Crew + 6-12 Brewery + Corporate Anchors + 8-20 Catering Events]
  J --> J3[Stage 3 Two Trucks Years 2-5 2 Trucks $400K-$900K 12-18% Net + GM/Second Owner-Operator + Central Commissary + Shared Brand]
  J --> J4[Stage 4 Mini-Fleet Years 4-8 3-5 Trucks $900K-$2.5M 12-20% EBITDA + Central Kitchen + Dedicated Catering Account Manager + Catering/Festival/Corporate 50-70% Revenue]
  K{Mature Operations Plus Strategic Exit Decision}
  J --> K
  K -->|Hold For Cash Flow + Brand + Community| L[Long-Term Independent Hold]
  K -->|Single Truck Owner-Operator Sale 1.5-3.0x SDE| M[Solo Truck Sale]
  K -->|Mini-Fleet Sale 2-5 Trucks 3.0-5.0x SDE/EBITDA| N[Mini-Fleet Sale]
  K -->|Franchise / Licensing Model 5-8% Royalty + 2-4% Marketing| O[Franchise]
  K -->|Brick-and-Mortar Conversion $400K-$1.5M Flagship + Trucks As Marketing| P[BAM Conversion]
  K -->|Acquihire By Restaurant Group $150K-$800K + 1-3 yr Earn-Out| Q[Acquihire]
  K -->|Asset Wind-Down + Used Truck Liquidation| R[Wind-Down]
  L --> S[Independent Hold With Mature 12-22% Net + Brewery + Catering Anchor + Community Brand]
  M --> T[Solo Truck Sold $45K-$180K Via Craigslist + Facebook Marketplace + UsedVending + RoamingHunger Marketplace + BizBuySell]
  N --> U[Mini-Fleet Sold $200K-$1.2M To Regional Restaurant Group + Private Investor + Restaurant Operator]
  O --> V[Franchise Like Cousins Maine Lobster 40+ Units + The Halal Guys + Kogi BBQ + The Cheesecake Truck + Royalty Stream]
  P --> W[Brick-and-Mortar Restaurant Built $400K-$1.5M Trucks Become Marketing + Overflow + 30-50% Fail Within 24 Months]
  Q --> X[Acquihired By Local Restaurant Group $150K-$800K + Brand + Chef + Customer Base For New BAM Concept]
  R --> Y[Asset Liquidation $25K-$90K Truck + Equipment Via UsedVending/RoamingHunger Marketplace/Facebook/eBay Motors + Permits Mostly Non-Transferable]
\`\`\`

## The Decision Matrix: Concept + Truck vs Trailer + Permit Path + Service Channel + Capital Selection

\`\`\`mermaid
flowchart TD
  A[Food Truck Founder Has Cuisine + Target Market + Capital + Channel + Permit Strategy Decision] --> B{Truck vs Trailer vs Mini-Fleet vs Acquisition}
  B -->|Used Step Van Retrofit Lower Capital + Faster Launch + Higher Maintenance| C[Used Retrofit]
  B -->|New Custom Truck Higher Capital + Warranty + Modern Chassis + Code-Compliant| D[New Custom]
  B -->|Towable Trailer + Tow Vehicle Festival/Corporate Focus + Lower Regulation Some States| E[Trailer Path]
  B -->|2-Truck Mini-Fleet From Day 1 Proven Cuisine + Investor Capital| F[Mini-Fleet Day 1]
  B -->|Acquire Existing Truck With Brand + Pipeline 1.5-3.0x SDE| G[Acquisition]
  C --> C1{Cuisine + Menu + Channel Selection}
  C1 -->|Tacos/Burgers/BBQ/Fried Chicken/Birria Photogenic + Manageable Food Cost 28-34%| H[High-Velocity Cuisine]
  C1 -->|Lobster Roll/Pierogi/Arepas/Banh Mi/Ramen/Shawarma Cuisine-Niche + Premium Pricing| I[Niche Cuisine]
  C1 -->|Vegan/Plant-Based/Gluten-Free Specialty Dietary Focus + Smaller Audience| J[Dietary Specialty]
  C1 -->|Full Pasta/Sushi/Steakhouse AVOID Slow + Cold-Chain Risk + Low Covers/Hr| K[AVOID Slow Cuisine]
  C1 -->|Dessert/Coffee/Smoothie/Boba Lower Ticket + Higher Margin + Different Permit Class| L[Dessert/Beverage]
  H --> H1[80-180 Covers/Day + $11-$18 Ticket + $15K-$45K/mo + Brewery + Corporate + Festival + Catering Mix]
  I --> I1[60-140 Covers/Day + $15-$24 Ticket + Premium Brand + Wedding + Corporate Premium]
  J --> J1[40-100 Covers/Day + $13-$19 Ticket + Loyal Niche + Whole Foods/Healthy Brand Cross-Promotion]
  K --> K1[Speed + Cold-Chain Failure Modes + Margin Collapse + AVOID]
  L --> L1[120-280 Cups/Day + $5-$9 Ticket + Coffee Shop + Festival + Lower Permit Tier]
  D --> D1{New Truck Channel + Brand Strategy}
  D1 -->|Brewery + Corporate + Festival Brand Build + Catering Pipeline| M[Premium Channel Mix]
  D1 -->|Festival + Tour Circuit Multi-State Premium Brand + Higher Capital Logistics| N[Festival Tour]
  E --> E1{Trailer Channel Selection}
  E1 -->|Festival + Corporate Park Drop-Off Lower Capital + Lower Regulation| O[Festival/Corporate Trailer]
  E1 -->|Brewery Stationary Multi-Week Pad-Mounted Lower Move Cost| P[Stationary Brewery]
  F --> F1{Mini-Fleet Strategy}
  F1 -->|Two Different Cuisines Diversification + Wider Booking Reach| Q[Diversified Mini-Fleet]
  F1 -->|Two Same Brand Trucks Double Coverage + Brand Concentration| R[Brand-Concentrated]
  G --> G1{Acquisition Target}
  G1 -->|Profitable Existing Truck With Brand + Pipeline 1.5-3.0x SDE| S[Premium Acquisition]
  G1 -->|Distressed or Burnout Discount Sale $25K-$80K Equipment Only| T[Discount Acquisition]
  H1 --> U{Reassess After Year 2 Stabilization}
  I1 --> U
  J1 --> U
  L1 --> U
  M --> U
  N --> U
  O --> U
  P --> U
  Q --> U
  R --> U
  S --> U
  T --> U
  U -->|Hold For Cash Flow + Brand + Catering Anchor| V[Long-Term Hold]
  U -->|Single Truck Sale 1.5-3.0x SDE| W[Solo Sale]
  U -->|Mini-Fleet Sale 3.0-5.0x SDE/EBITDA| X[Mini-Fleet Sale]
  U -->|Franchise / Licensing Cousins Maine Lobster Path| Y[Franchise]
  U -->|Brick-and-Mortar Conversion + Flagship + Trucks As Marketing| Z[BAM Conversion]
  U -->|Acquihire By Restaurant Group| AA[Acquihire]
  U -->|Wind-Down + Asset Liquidation| AB[Wind-Down]
\`\`\`

`;

const src = `

## Sources

1. **National Food Truck Association NFTA (nationalfoodtrucks.org)** -- Primary US food truck operator trade association with state-level lobbying + advocacy + best-practices resources. https://www.nationalfoodtrucks.org
2. **National Restaurant Association NRA (restaurant.org)** -- Umbrella US restaurant + foodservice trade association with mobile-vending advocacy. https://www.restaurant.org
3. **FDA Food Code (fda.gov)** -- Federal model food code adopted in part by states for mobile food unit regulation. https://www.fda.gov/food/retail-food-protection/fda-food-code
4. **CDC Food Safety (cdc.gov)** -- Federal food safety guidance for retail + mobile food operators. https://www.cdc.gov/foodsafety/
5. **NFPA 96 Standard for Ventilation Control + Fire Protection of Commercial Cooking Operations (nfpa.org)** -- Federal standard for Type-1 hood + Ansul fire suppression compliance. https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=96
6. **ServSafe Manager Certification (servsafe.com)** -- National Restaurant Association food safety manager certification accepted in most jurisdictions. https://www.servsafe.com
7. **NYC Department of Health and Mental Hygiene DOHMH Mobile Food Vending (nyc.gov/health)** -- NYC Mobile Food Vending Permit program + supervisory license + permit lottery + 2022 expansion. https://www.nyc.gov/site/doh/business/health-academy/food-protection-course-bookings.page
8. **LA Bureau of Street Services BSS (streetsla.lacity.org)** -- Los Angeles sidewalk vending program + mobile food restricted zones. https://streetsla.lacity.org
9. **San Francisco Department of Public Health Mobile Food Facility (sfdph.org)** -- SF mobile food facility permit + restricted zones near brick-and-mortar restaurants. https://www.sfdph.org
10. **Austin Public Health Mobile Food Permit (austintexas.gov/health)** -- Austin food truck permit + zoning + spacing rules. https://www.austintexas.gov/department/austin-public-health
11. **Portland Oregon Food Cart Program (portland.gov)** -- Portland food cart pod model + pod operator permit framework. https://www.portland.gov
12. **Miami-Dade County Mobile Food Dispensing Vehicle (miamidade.gov)** -- Miami-Dade mobile food vehicle permit program. https://www.miamidade.gov
13. **Chicago Mobile Food Dispenser + Preparer (chicago.gov)** -- Chicago two-tier mobile food permit Dispenser + Preparer. https://www.chicago.gov
14. **IBISWorld Food Trucks in the US Industry Report (ibisworld.com)** -- Industry size + growth + segment composition for US food trucks. https://www.ibisworld.com
15. **BLS Bureau of Labor Statistics Foodservice (bls.gov)** -- US labor + wage + employment data for foodservice + cooks + servers. https://www.bls.gov
16. **SBA Small Business Administration Microloan Program (sba.gov)** -- Federal $500-$50K microloan program through SBA-approved intermediaries. https://www.sba.gov/funding-programs/loans/microloans
17. **SBA 7(a) Loan Program (sba.gov)** -- SBA's primary loan guarantee program for small business. https://www.sba.gov/funding-programs/loans/7a-loans
18. **Accion Opportunity Fund (aofund.org)** -- SBA-approved microloan intermediary for small business lending including food trucks. https://aofund.org
19. **Justine Petersen Microloan (justinepetersen.org)** -- SBA microloan intermediary serving entrepreneurs. https://www.justinepetersen.org
20. **LiftFund Microloan + SBA Lending (liftfund.com)** -- SBA microloan + 7(a) intermediary serving Texas + Southwest. https://www.liftfund.com
21. **CDC Small Business Finance (cdcloans.com)** -- SBA-approved lending intermediary for small business + microloans. https://cdcloans.com
22. **Pacific Community Ventures (pacificcommunityventures.org)** -- CDFI providing SBA microloans + technical assistance to small businesses. https://www.pacificcommunityventures.org
23. **Live Oak Bank SBA (liveoakbank.com)** -- Major SBA 7(a) lender across small business sectors. https://www.liveoakbank.com
24. **Huntington National Bank SBA Lending (huntington.com)** -- Major SBA lender. https://www.huntington.com
25. **Wells Fargo SBA Lending (wellsfargo.com)** -- Major SBA lender. https://www.wellsfargo.com
26. **Balboa Capital Equipment Finance (balboacapital.com)** -- Equipment finance lender across small business sectors including food trucks. https://www.balboacapital.com
27. **Crest Capital Equipment Finance (crestcapital.com)** -- Equipment finance lender for vehicles + heavy equipment. https://www.crestcapital.com
28. **Direct Capital Equipment Finance (directcapital.com)** -- Equipment finance lender. https://www.directcapital.com
29. **Beacon Funding Equipment Finance (beaconfunding.com)** -- Equipment finance specialized in truck + commercial vehicle. https://www.beaconfunding.com
30. **National Funding Small Business Loans (nationalfunding.com)** -- Working capital + equipment finance lender. https://www.nationalfunding.com
31. **Bluevine Business Line of Credit (bluevine.com)** -- Working capital + LOC lender for small business. https://www.bluevine.com
32. **OnDeck Small Business Loans (ondeck.com)** -- Small business term + LOC lender. https://www.ondeck.com
33. **Kabbage by American Express (kabbage.com)** -- Small business LOC + working capital lender. https://www.kabbage.com
34. **Kickstarter Crowdfunding (kickstarter.com)** -- Reward-based crowdfunding platform used by food truck launches. https://www.kickstarter.com
35. **Indiegogo Crowdfunding (indiegogo.com)** -- Reward + equity crowdfunding platform. https://www.indiegogo.com
36. **Mainvest Small Business Revenue-Share Investing (mainvest.com)** -- Revenue-share crowd investing platform for small business including food trucks. https://www.mainvest.com
37. **Honeycomb Credit Small Business Loans (honeycombcredit.com)** -- Community small business lending platform. https://www.honeycombcredit.com
38. **Cruising Kitchens Custom Food Truck Builds (cruisingkitchens.com)** -- San Antonio custom food truck + trailer manufacturer. https://www.cruisingkitchens.com
39. **M&R Specialty Trailers and Trucks (mrtrailers.com)** -- Florida custom food trailer + truck manufacturer. https://www.mrtrailers.com
40. **Apollo Custom Manufacturing (apollocustommfg.com)** -- Texas custom food truck + trailer manufacturer. https://www.apollocustommfg.com
41. **United Food Truck Builders (unitedfoodtrucks.com)** -- Custom food truck manufacturer. https://www.unitedfoodtrucks.com
42. **Concession Nation (concessionnation.com)** -- Custom food truck + trailer manufacturer. https://www.concessionnation.com
43. **Freightliner MT45 + MT55 Step Vans (freightliner.com)** -- Common chassis for food truck retrofit. https://www.freightliner.com
44. **Workhorse W42 Step Van (workhorse.com)** -- Step van chassis used in food truck retrofits. https://www.workhorse.com
45. **Vulcan Commercial Cooking Equipment (vulcanequipment.com)** -- 6-burner range + commercial cooking equipment manufacturer. https://www.vulcanequipment.com
46. **Wolf Commercial Cooking Equipment (wolfrange.com)** -- Commercial range manufacturer. https://www.wolfrange.com
47. **Garland Commercial Range (garlandgroup.com)** -- Commercial cooking equipment manufacturer. https://www.garlandgroup.com
48. **American Range (americanrange.com)** -- Commercial range manufacturer. https://www.americanrange.com
49. **Pitco Fryer (pitco.com)** -- Commercial fryer manufacturer. https://www.pitco.com
50. **Frymaster Commercial Fryer (frymaster.com)** -- Commercial fryer manufacturer. https://www.frymaster.com
51. **True Refrigeration Commercial (truemfg.com)** -- Commercial refrigeration manufacturer. https://www.truemfg.com
52. **Beverage-Air Commercial Refrigeration (beverage-air.com)** -- Commercial refrigeration manufacturer. https://www.beverage-air.com
53. **Turbo Air Commercial Refrigeration (turboairinc.com)** -- Commercial refrigeration manufacturer. https://www.turboairinc.com
54. **Atosa Commercial Refrigeration + Cooking (atosausa.com)** -- Commercial kitchen equipment manufacturer. https://www.atosausa.com
55. **Ansul R-102 Fire Suppression (ansul.com)** -- Wet-chemical kitchen fire suppression system manufacturer (Johnson Controls). https://www.ansul.com
56. **Honda EU7000is Inverter Generator (honda.com)** -- Gold-standard quiet inverter generator for food trucks. https://powerequipment.honda.com
57. **Generac GP7500E Generator (generac.com)** -- Commercial portable generator. https://www.generac.com
58. **Square for Restaurants POS (squareup.com)** -- Dominant single-truck POS + payment processing platform. https://squareup.com/us/en/restaurants
59. **Toast POS Restaurant + Mobile (pos.toasttab.com)** -- Restaurant POS used by larger food truck operations + mini-fleets. https://pos.toasttab.com
60. **Clover POS by Fiserv (clover.com)** -- POS + payment processing platform. https://www.clover.com
61. **Revel Systems POS (revelsystems.com)** -- Enterprise restaurant POS platform. https://revelsystems.com
62. **Roaming Hunger Food Truck Booking (roaminghunger.com)** -- Largest US food truck booking marketplace 10-20% commission. https://www.roaminghunger.com
63. **BestFoodTrucks (bestfoodtrucks.com)** -- Food truck booking + tracking marketplace. https://www.bestfoodtrucks.com
64. **Truckster Food Truck Platform (truckster.com)** -- Food truck booking + scheduling platform. https://www.truckster.com
65. **MOGL Corporate Catering + Events (mogl.com)** -- Corporate event + catering marketplace. https://www.mogl.com
66. **Cater2.me Corporate Catering (cater2.me)** -- Corporate catering marketplace including food trucks. https://www.cater2.me
67. **ezCater Corporate Catering Marketplace (ezcater.com)** -- Largest US corporate catering marketplace. https://www.ezcater.com
68. **Streetfood Finder Food Truck Tracker (streetfoodfinder.com)** -- Consumer-facing food truck location tracker app. https://www.streetfoodfinder.com
69. **Progressive Commercial Food Truck Insurance (progressivecommercial.com)** -- Commercial auto + general liability + food truck insurance carrier. https://www.progressivecommercial.com
70. **Geico Commercial Food Truck Insurance (geico.com/commercial)** -- Commercial auto + general liability insurance carrier. https://www.geico.com/commercial
71. **Insure My Food Truck (insuremyfoodtruck.com)** -- Specialty food truck insurance broker. https://www.insuremyfoodtruck.com
72. **FLIP Food Liability Insurance Program (fliprogram.com)** -- Specialty food vendor + truck liability insurance program. https://www.fliprogram.com
73. **The Knot Wedding Catering Marketplace (theknot.com)** -- Wedding planning + vendor marketplace including food truck catering. https://www.theknot.com
74. **WeddingWire Vendor Marketplace (weddingwire.com)** -- Wedding vendor marketplace. https://www.weddingwire.com
75. **Zola Wedding Planning + Vendor Marketplace (zola.com)** -- Wedding registry + vendor marketplace. https://www.zola.com
76. **UsedVending Food Truck Marketplace (usedvending.com)** -- Used food truck + concession trailer resale marketplace. https://www.usedvending.com
77. **BizBuySell Small Business Marketplace (bizbuysell.com)** -- Largest US small business + food truck for-sale marketplace. https://www.bizbuysell.com
78. **MarketMan Restaurant Inventory (marketman.com)** -- Restaurant inventory + food cost tracking software. https://www.marketman.com
79. **Restaurant365 Restaurant Operations Platform (restaurant365.com)** -- Restaurant accounting + inventory + scheduling + food cost. https://www.restaurant365.com
80. **MarginEdge Restaurant Food Cost (marginedge.com)** -- Restaurant food cost + invoice automation. https://www.marginedge.com
81. **QuickBooks Online Small Business Accounting (quickbooks.intuit.com)** -- Small business accounting software. https://quickbooks.intuit.com
82. **Gusto Small Business Payroll (gusto.com)** -- Small business payroll + benefits + HR platform. https://gusto.com
83. **ADP Run Small Business Payroll (adp.com/run)** -- Small business payroll service. https://www.adp.com/what-we-offer/products/run-powered-by-adp.aspx
84. **CA Air Resources Board Advanced Clean Fleets (arb.ca.gov)** -- California regulation phasing in zero-emission medium + heavy-duty trucks 2025+. https://ww2.arb.ca.gov/our-work/programs/advanced-clean-fleets
85. **Cousins Maine Lobster Franchise (cousinsmainelobster.com)** -- Example of food truck brand scaled to franchise with 40+ units. https://www.cousinsmainelobster.com
86. **The Halal Guys Franchise (thehalalguys.com)** -- NYC food cart brand scaled to international franchise. https://thehalalguys.com
87. **Kogi BBQ (kogibbq.com)** -- Iconic LA Korean BBQ taco truck founded by Roy Choi 2008. https://kogibbq.com

`;

const num = `

## Numbers & Benchmarks

### Industry size, operator landscape & unit economics

| Metric | 2024-2026 Value | Source |
|---|---|---|
| Active US food trucks + trailers | ~36,000-42,000 | IBISWorld + NFTA + state DMV registrations |
| US food truck annual revenue (segment) | $2.5B-$3.2B | IBISWorld + NFTA |
| Total US foodservice market | $1.05T-$1.15T | NRA + BLS |
| Food truck segment CAGR | 4-7% | IBISWorld |
| Avg revenue per truck (full-time owner-operator) | $180K-$540K/yr | NFTA + Roaming Hunger operator surveys |
| Avg revenue per truck (high-volume brand) | $650K-$1.4M/yr | Kogi-tier + Cousins Maine Lobster operator data |
| Avg ticket | $11-$18 | POS aggregator data Square/Toast |
| Avg covers per shift (owner-operator) | 80-180 | NFTA + Roaming Hunger surveys |
| Avg gross margin owner-operator truck | 28-38% | Industry benchmarks + IBISWorld |
| Avg net margin owner-operator truck | 10-22% | Industry benchmarks |
| Mini-fleet (3-5 truck) blended EBITDA disciplined | 12-20% | Operator + acquirer diligence ranges |
| Mini-fleet blended EBITDA spray-and-pray | 3-9% | Operator surveys |
| Food cost % | 28-34% | Restaurant + truck benchmarks |
| Labor cost % | 22-32% | Industry benchmarks |
| Commissary + permits + insurance + fuel + propane + commission % | 18-26% | Operator P&L surveys |
| States requiring commissary kitchen affidavit | 44 of 50 | NFTA + state health departments |
| Year 1-3 owner exit rate | 30-50% | NFTA + IBISWorld |

### Service mix by channel economics

| Channel | Avg Revenue / Shift or Event | Commission / Fee | Gross Margin | % of Mature Revenue |
|---|---|---|---|---|
| Brewery rotation (2-5 nights/wk) | $1,400-$3,800/shift | $0-$50 site fee | 28-38% | 30-45% |
| Corporate Friday + office park | $1,800-$4,200/shift | 10-20% if platform-booked | 30-40% | 15-30% |
| Wedding + private catering | $1,800-$8,500/event | 0-15% if planner | 40-55% | 15-30% (highest margin) |
| Festival circuit | $3,500-$7,500 peak / $150-$1,500 booth | $150-$1,500 + 10-20% revenue share | 25-38% | 10-20% |
| Farmers market | $400-$1,800/market | $35-$150 booth | 30-40% | 5-15% |
| Street + roaming | $500-$1,800/shift | Permit + parking | 28-38% | 0-15% (volatile) |
| DoorDash/Uber Eats hybrid | Variable | 18-30% commission | 8-18% (margin-negative typical) | 0-5% (most decline) |

### Capital + capital stack by tier

| Sizing Decision | Capital | Annual Revenue | Best For |
|---|---|---|---|
| Solo owner-operator used retrofit | $80K-$155K | $200K-$450K | First-time founder + bootstrap + cuisine passion |
| Solo new custom build | $200K-$450K | $250K-$540K | Established cuisine + investor capital + premium brand |
| Trailer + tow vehicle | $55K-$180K | $180K-$420K | Festival + corporate park focus + lower regulation states |
| 2-truck mini-fleet | $200K-$500K | $400K-$900K | Year 2-3 expansion with proven concept |
| 3-5 truck mini-fleet + central kitchen | $500K-$1.5M | $900K-$2.5M | Year 4+ operator with catering pipeline + GM bench |
| Brick-and-mortar conversion + truck brand | $400K-$1.5M BAM + 1-3 trucks | $1.5M-$5M | Mature brand with location + lease + concept fit |

### Truck + equipment + build-out capital by category

| Category | Cost Range | Notes |
|---|---|---|
| Used step van chassis | $25K-$65K | Freightliner MT45/MT55 + Workhorse W42 + Grumman Olson + International + Utilimaster + GMC P30 |
| Used step van retrofit build-out | $40K-$90K | Gas line + water + sink + hood + propane + cookline + refrigeration |
| New custom truck build (turnkey) | $80K-$200K | Cruising Kitchens + M&R + Apollo + United Food Truck Builders + Concession Nation |
| Towable trailer | $35K-$120K | 10-28 ft single-axle to dual-axle M&R + Concession Nation + Apollo + Trailer Concessions + Cargo Craft |
| Tow vehicle | $20K-$60K | Ford F-250/F-350 + RAM 2500 + Chevy Silverado 2500 used |
| 6-burner range | $4K-$8K | Vulcan + Wolf + Garland + American Range |
| Flat-top griddle | $2K-$5K | Cookline workhorse |
| Fryer | $1.5K-$4K | Pitco + Frymaster |
| Char-broiler (optional) | $1.5K-$4K | Open-flame grill |
| Convection oven (optional) | $2K-$5K | Baking + finishing |
| Reach-in refrigeration | $3K-$8K | True + Beverage-Air + Turbo Air + Atosa |
| Undercounter refrigeration | $1.5K-$3.5K | Line refrigeration |
| Prep tables + cutting boards | $1.5K-$4K | Stainless prep |
| 3-comp sink + handwash | $1K-$3K | NSF-certified |
| Type-1 hood + exhaust | $4K-$12K | NFPA 96 compliant |
| Ansul R-102 fire suppression | $2K-$5K | Wet-chemical kitchen fire suppression |
| Propane tank 40-100 lb + regulator + leak detector | $400-$800 | Fuel + safety |
| Fresh + gray water + water heater | $1.5K-$3.5K | 40-80 gal fresh + 50-100 gal gray |
| Honda EU7000is generator | $5.5K-$7.5K | Gold-standard inverter |
| Generac/Champion/Yamaha generator alternative | $3K-$6K | Lower-cost alternatives |
| POS hardware (Square Stand + KDS) | $500-$3K | Square/Toast/Clover hardware |
| Initial inventory (food + paper + propane) | $4K-$12K | First 2 weeks operating supply |
| Commissary first month + deposit | $800-$4,500 | Lease deposit + first month |
| Permits + licenses (Year 1 all-in) | $1.5K-$6K | State + local + commissary + propane + GL insurance |

### Permit + commissary costs by city tier

| City Tier | Local Health Mobile Food Unit Permit | Commissary Lease | Notes |
|---|---|---|---|
| Tier 1 coastal metro (NYC, SF, LA, Boston, Seattle) | $800-$2,500/yr | $1,500-$3,000/mo | Multi-year permit waitlists in NYC; restricted zones in SF/LA |
| Tier 2 major metro (Chicago, Austin, Portland, Miami, DC) | $400-$1,500/yr | $700-$1,800/mo | Permit caps in Austin; pod model in Portland |
| Tier 3 secondary metro (Nashville, Raleigh, Indianapolis, Phoenix) | $250-$900/yr | $500-$1,200/mo | Generally more permit-friendly |
| Tier 4 small metro + rural | $150-$500/yr | $400-$800/mo | Minimal waitlist; commissary may be scarce |

### Payor + booking channel economics

| Channel | Site Fee / Commission | Per-Shift / Event Revenue | Frequency | Margin |
|---|---|---|---|---|
| Brewery rotation | $0-$50 site fee | $1,400-$3,800/shift | 2-5x/wk anchor | 28-38% |
| Corporate Friday office park (direct) | None direct | $1,800-$4,200/shift | 1-3x/wk | 30-40% |
| Corporate via Roaming Hunger/MOGL/BestFoodTrucks | 10-20% commission | $1,800-$4,200/shift | Year 1-2 primary | 25-32% |
| Wedding + private catering (direct) | None direct | $1,800-$8,500/event | 8-25/yr mature | 40-55% |
| Wedding via The Knot / WeddingWire / planner | 0-15% if planner | $1,800-$8,500/event | 8-25/yr mature | 35-50% |
| Festival booth | $150-$1,500 + 10-20% rev share | $3,500-$7,500 peak | 8-25/yr | 25-38% |
| Farmers market | $35-$150 booth | $400-$1,800/market | 30-50/yr regional | 30-40% |
| Street + roaming | Parking + permit | $500-$1,800/shift volatile | Daily option | 28-38% |
| DoorDash + Uber Eats hybrid | 18-30% commission | Variable | Most decline | 8-18% margin-negative |

### Staff compensation

| Role | Rate / Salary | Notes |
|---|---|---|
| Owner-operator | $28K-$95K take-home Year 1-2 / $55K-$140K Year 3-5 | 60-80 hrs/wk Year 1-2 |
| Line cook | $15-$22/hr part-time / $32K-$48K full-time | Brewery + restaurant adjacent talent |
| Prep cook (commissary morning) | $14-$20/hr 10-25 hrs/wk | Unlocks 30-50% more covers/day |
| Weekend service crew | $13-$20/hr 8-16 hr shifts | Culinary students + side hustlers |
| General manager / second owner-operator (Stage 3+) | $48K-$78K + bonus | Required for 2-truck operations |
| Catering account manager (Stage 4+) | $48K-$72K + commission | Required when catering >35% of revenue |
| Marketing / social (often outsourced) | $300-$1,500/mo contractor | Instagram + TikTok content |

### Five-year cash-flow trajectory: solo owner-operator food truck

| Year | Covers/Day | Annual Revenue | Annual EBITDA / Take-Home | Net Margin |
|---|---|---|---|---|
| Year 1 permit + ramp | 35-90 | $120K-$280K | $15K-$70K take-home | Owner take-home model |
| Year 2 mature solo + anchors | 60-130 | $200K-$400K | $35K-$95K | 12-20% |
| Year 3 hygiene + catering pipeline | 80-160 | $260K-$480K | $50K-$120K | 14-22% |
| Year 4 add line cook + 2nd truck launch | 100-200 (2 trucks Y4) | $400K-$900K | $80K-$160K | 12-18% blended |
| Year 5 mature mini-fleet + catering | 200-450 (2-3 trucks) | $700K-$1.8M | $130K-$320K EBITDA | 14-20% |

### Capital stack interest rates and lender categories

| Capital Layer | LTV | Rate 2024-2025 | Typical Lenders |
|---|---|---|---|
| Founder equity | N/A | N/A | $25K-$80K typical |
| SBA microloan | Up to 100% of $50K | 8-13% | Accion Opportunity Fund, Justine Petersen, LiftFund, CDC Small Business Finance, Pacific Community Ventures |
| SBA 7(a) (rare for trucks) | 70-85% | Prime + 2.0-4.0% | Live Oak Bank, Huntington, Wells Fargo SBA |
| Equipment finance 5-7 yr | 80-100% | 9-16% effective | Balboa Capital, Crest Capital, Direct Capital, Beacon Funding, US Capital, National Funding |
| Truck builder in-house financing | Variable | Variable | Cruising Kitchens, M&R, Apollo bundle through partners |
| Working capital LOC | Variable | Prime + 4-9% | Bluevine, OnDeck, Kabbage, business credit card |
| Crowdfunding | N/A | N/A | Kickstarter, Indiegogo, Mainvest, Honeycomb Credit |
| Acquisition financing | 70-85% | Prime + 2.5-5.0% | Live Oak, Huntington, regional + SBA |

### Marketing channel cost + effectiveness

| Channel | Cost 2027 | Lead Volume | Quality | Notes |
|---|---|---|---|---|
| Instagram Stories + Reels location-of-the-day | Owner time | Highest | Highest | 5K-30K followers practical threshold |
| TikTok food content | Owner time | Medium-High | Medium | 8-25x reach vs restaurant content; translation requires location callout |
| Google Business Profile + reviews | Time + service quality | Medium | High | 50-200 reviews at 4.6+ stars decisive |
| Roaming Hunger + BestFoodTrucks profile | Free + 10-20% commission on bookings | Medium-High | Medium-High | Critical Year 1-2 corporate + wedding |
| Brewery cross-promotion | Time | Medium-High | High | 2-4x amplification vs solo posting |
| Festival + farmers market presence | Booth fee + time | Medium | High | Builds organic WOMM + Yelp |
| Wedding planner + venue referral | Relationship time | Medium | Highest | 20-40% of mature catering revenue |
| Email + SMS (Mailchimp + Klaviyo) | $20-$100/mo + list | Medium | High | Repeat catering + corporate |
| Yelp ads | $25-$80/lead | Low-Medium | Medium | Less effective than restaurant |
| Google LSA + paid search | $5-$30/click | Low-Medium | Medium | Limited use vs Instagram |

### Exit multiples by buyer type

| Exit Path | Buyer Type | Cap Multiple | Process Length | Best For |
|---|---|---|---|---|
| Single truck owner-operator sale | Aspiring operator + small fleet | 1.5-3.0x SDE | 2-6 months | $45K-$180K single-truck exit |
| Mini-fleet sale 2-5 trucks | Regional restaurant group + investor | 3.0-5.0x SDE/EBITDA | 4-10 months | $200K-$1.2M established brand |
| Franchise / licensing | Single-unit franchisees | 5-8% royalty + 2-4% marketing | 12-36 months | Mature brand with playbook |
| Brick-and-mortar conversion | Self + investor | Build cost not multiple | 18-30 months | Mature brand + capital + chef bench |
| Acquihire by restaurant group | Local restaurant group | $150K-$800K + 1-3 yr earn-out | 4-9 months | Brand + chef + customer base for new BAM |
| Asset wind-down | Used-truck buyer | Equipment liquidation $25K-$90K | 30-90 days | Distressed or burnout exit |

`;

const counter = `

## Counter-Case: When Food Truck Is A Bad Bet

A serious food truck founder must stress-test the case above against the conditions that make this category a difficult bet in 2027. The full 14-element counter-case:

**(1) Weather + rain volatility.** **One rainy Saturday = 50% revenue loss** on what should be a $3.5K-$7.5K festival or brewery shift. Weather forecasts are not actionable 7-14 days out for event scheduling. **Year 1-2 operators lose 8-22% of expected annual revenue to weather** vs forecast. Cannot insure against. Hard cost: cancelled bookings + spoiled prep food + crew already on payroll.

**(2) Seasonality + Northern death zone.** **Nov-Feb in Northern climates (Boston, Chicago, Denver, Minneapolis, Seattle, NYC)** kills outdoor service. Brewery patios close, festivals stop, corporate-park lunch demand halves. **40-60% revenue concentration in May-Sep** is typical for Northern operators. Winter pivot options (commissary catering, indoor pop-ups, mall food court rotations) are partial — most Northern trucks accept a 5-month soft season.

**(3) Permit lottery + city-specific scarcity.** **NYC Mobile Food Vending Permit** historically capped at ~5,100 (~2,800 borough-wide year-round + ~2,100 seasonal/restricted) with multi-year lottery wait. 2022 expansion adds ~445/yr through 2032 but waitlist remains years long. **LA Bureau of Street Services** restricted zones near brick-and-mortar restaurants. **SF Mobile Food Facility** restricted zones. **Austin permit cap + spacing rules**. **Portland pod scarcity** with multi-year waitlist for top pods. **Chicago two-tier Dispenser/Preparer** restricts hot food without commissary kitchen affiliation. **Plan permit research as the first 30-day deliverable** — don't sign a build contract before permits clear.

**(4) Commissary kitchen scarcity + cost.** **44 of 50 states require commissary kitchen affidavit** — and in coastal metros (SF, NYC, LA, Boston, Seattle) commissary rents have hit **$1,500-$3,000/mo + 12-36 month waitlist** at top operators (La Cocina SF, Hudson Kitchen NJ, Union Kitchen DC, CommonWealth Kitchen Boston). Smaller markets have commissary scarcity in a different way — single commissary monopoly + price control + scheduling chaos.

**(5) Roaming Hunger / BestFoodTrucks / platform commission compression.** **10-20% commission on platform-sourced bookings** is industry standard — and stacks with credit-card processing (2.6-3%) + payroll taxes (7.65%) + workers comp + insurance + commissary lease. **DoorDash + Uber Eats food truck pilots take 18-30% commission** + delivery driver wait time + parking — **margin-negative for most truck operators** vs brick-and-mortar restaurants where pickup makes the math work. Operators must build direct booking relationships to escape commission compression Year 2+.

**(6) Brick-and-mortar restaurant lobby + protectionist ordinances.** **National Restaurant Association + state restaurant associations** lobby against mobile food vendors near brick-and-mortar restaurants — SF, LA, Boston, Philadelphia have **restricted zones banning food trucks within 150-300 ft of restaurants**. New ordinances in 2024-2025 (Nashville, Charleston, certain Texas cities) tightened. Future restaurant-protection legislation is a real political risk in any growing food-truck metro.

**(7) Food cost inflation post-COVID.** **Beef + chicken + dairy + eggs + propane + paper-product costs inflated 30-60% 2020-2024**. Many trucks lock menu prices via consumer-expectation inertia + Instagram-photo consistency — making margin compression brutal. **Menu engineering + price increases every 6-9 months + commissary group purchasing + brewery + restaurant supply partnerships** are partial mitigations.

**(8) Labor shortage + same restaurant-industry pressures.** Food truck labor pulls from the same brewery + restaurant labor pool that is **30-50% short-staffed in many metros 2022-2026**. Line cooks demand **$18-$25/hr part-time** vs $13-$16/hr 2019 baseline. Weekend crew is brutal to retain — Sat-Sun 10-hour shifts in 90°F+ conditions burn out fast. **Year 1-3 line cook turnover 60-100%/yr** is industry baseline.

**(9) Owner-operator burnout + 14-hour days.** Owner-operator works **60-80 hrs/wk Year 1-2** across prep + service + bookings + social + admin. **30-50% Year 1-3 exit rate** is driven primarily by burnout — physical (12-14 hr service days in hot truck cab) + mental (booking pipeline anxiety + cash flow + permit hassle + crew management). **Many founders exit Year 2-3 for restaurant employment or career pivot** with truck listed on Facebook Marketplace at 40-60% of build cost.

**(10) Theft + vandalism + parked-truck risk.** Trucks parked overnight (even at commissary) face **window break-in + generator theft + propane tank theft + catalytic converter cut**. Catalytic converter theft alone hit **$1,500-$3,500/incident** 2022-2024. Comprehensive insurance helps but premium runs $2K-$5K/yr more for high-theft metros (Bay Area, LA, Phoenix, Dallas).

**(11) Generator noise + emissions ordinances.** Cities tightening on **portable generator noise (60 dB+ banned in residential zones after 9pm)** and **EPA Tier 4 emissions** for portable gensets. **Brewery + festival + corporate pads requiring shore power** (lower generator dependence) is the partial workaround. Honda EU7000is at 52-60 dB inverter is the gold standard — older Generac/Champion at 70-85 dB face exposure to ordinance enforcement.

**(12) CA Advanced Clean Fleets EV transition 2025+.** **California Air Resources Board (CARB) Advanced Clean Fleets** regulation phasing in zero-emission medium + heavy-duty truck purchases starting 2024 (drayage), expanding 2027+ (fleet purchases). **Step van EV replacement adds $40K-$120K** per cycle vs diesel. CA food trucks targeting 2030-2035 transition are starting capital planning now. Other states (NY, NJ, MA, OR, WA) following CA lead.

**(13) Instagram algorithm reach collapse + social fatigue.** **Instagram organic reach for small business has dropped 50-80% 2022-2026** as Meta pushed Reels + paid promotion. Food truck Stories + grid posts that previously generated foot traffic now require paid boost ($15-$50/post) or hyper-consistent content schedule. **TikTok food content has 8-25x reach but converts to actual foot traffic at lower rate** because audience is national not local. **Social media is hard work that has gotten harder**.

**(14) Customer COVID-era preference for delivery + ghost kitchen migration.** **Consumer behavior shift toward DoorDash + Uber Eats + Grubhub delivery + ghost-kitchen-only concepts** 2020-2024 has compressed walk-up + brewery + festival demand for mobile food in some markets. **Younger consumer (Gen Z + millennial)** delivery-default behavior reduces street-vending impulse purchase frequency. **Hybrid (DoorDash + truck) is margin-negative** per (5) above. Truck operators need brewery + corporate + wedding catering pipeline as primary revenue to insulate.

**Honest verdict.** The food truck business remains a viable entrepreneurial path in 2027 if you (a) **secure city + state + commissary permits before signing a build contract** with realistic expectation of 90-270 day timeline + lottery exposure in NYC/LA/SF/Austin/Portland; (b) **discipline menu to 6-8 items + 1 signature item** rather than trying to be a full restaurant menu on wheels; (c) **build a booking pipeline anchored on brewery rotations + corporate Fridays + wedding catering + festival circuit** rather than relying on roaming + walk-up; (d) **maintain food cost ≤32% + labor ≤30% + commission ≤15% blended** through menu engineering + direct booking discipline + group purchasing; (e) **invest in Instagram Stories + Reels + TikTok content + brewery cross-promo + Google Business Profile reviews** as the operating reality not the marketing nice-to-have; (f) **plan for weather + seasonality + permit + commissary + commission compression + food inflation + labor + EV transition** as line items in the financial model not surprises; (g) **honestly assess physical + mental endurance for 60-80 hr/wk Year 1-2** before signing a 10-yr equipment lease; (h) **commit to either path** (single owner-operator hold for cash flow OR mini-fleet/franchise/BAM brand expansion) rather than vacillating between them. If you cannot honestly check most of these — particularly permits + commissary + booking pipeline + cost discipline + endurance — the economics of 2027 mobile food will grind the truck toward a Year 2-3 Facebook Marketplace listing at 40-60% of build cost.

`;

const links = `

## Related Pulse Entries

- [[q9668]] -- Pediatric dental practice 2027 (sibling: state-licensed + permit + recurring-revenue health service)
- [[q9667]] -- HVAC company 2027 (sibling: state-licensed + skilled trades + per-ticket service + PE roll-up parallel)
- [[q9666]] -- Compounding pharmacy 2027 (sibling: state + federal regulated specialty service)
- [[q9665]] -- Boutique fitness studio 2027 (sibling: lease-based + recurring-revenue + customer-experience-driven)
- [[q9664]] -- Microbrewery 2027 (DIRECT sibling: regulated + state licensure + specialty equipment + brewery/food-truck symbiosis)
- [[q9663]] -- Self-storage facility 2027 (specialty CRE parallel)
- [[q9662]] -- Mobile IV therapy clinic 2027 (sibling: state-regulated mobile service + cash/insurance mix)
- [[q9661]] -- Veterinary clinic 2027 (sibling: specialty licensed practice + recall + insurance mix)
- [[q9660]] -- Direct primary care DPC clinic 2027 (sibling: cash + insurance + membership service)
- [[q9659]] -- Med spa 2027 (sibling: state licensure + service-membership)
- [[q9658]] -- Service business launch (NEW STRUCTURE sibling)
- [[q9657]] -- Home health agency 2027 (workforce + insurance + Medicaid parallel)
- [[q9650]] -- Assisted living facility 2027 (specialty CRE + state licensure + insurance)
- [[q9601]] -- Fractional CFO operation (operational backbone for multi-truck food brand)
- [[q9576]] -- Adult coding bootcamp 2027 (state regulation framework)
- [[q2117]] -- Post-construction cleanup business (service-business operating pattern)
- [[q1975]] -- Daycare 2027 (sibling: state licensure + parent-customer + child-services parallel)
- [[q1954]] -- Property management 2027 (baseline sibling)
- [[q1953]] -- Virtual assistant 2027 (baseline sibling)
- [[q1952]] -- Podcast network 2027 (baseline sibling)
- [[q1951]] -- Meal prep 2027 (DIRECT sibling: food-prep + recurring + cuisine-driven brand)
- [[q1950]] -- Yoga studio 2027 (baseline sibling)
- [[q1949]] -- Personal training 2027 (baseline sibling)
- [[q1948]] -- Dog walking 2027 (baseline sibling)
- [[q1947]] -- Notary 2027 (baseline sibling)
- [[q1946]] -- Tutoring 2027 (baseline sibling)
- [[q1942]] -- Service business 2027 (baseline sibling)
- [[q1139]] -- Adjacent service business framework
- [[q1127]] -- Adjacent service business framework

`;

const tags = ['food-truck','mobile-food','food-trailer','nfta','commissary','brewery','catering','roaming-hunger','2027'];

const sources = [
  { title: 'National Food Truck Association NFTA', url: 'https://www.nationalfoodtrucks.org' },
  { title: 'National Restaurant Association NRA', url: 'https://www.restaurant.org' },
  { title: 'FDA Food Code', url: 'https://www.fda.gov/food/retail-food-protection/fda-food-code' },
  { title: 'NFPA 96 Commercial Cooking Ventilation Standard', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=96' },
  { title: 'SBA Microloan Program', url: 'https://www.sba.gov/funding-programs/loans/microloans' },
  { title: 'Roaming Hunger Food Truck Booking Marketplace', url: 'https://www.roaminghunger.com' },
  { title: 'Cruising Kitchens Custom Food Truck Builds', url: 'https://www.cruisingkitchens.com' }
];

const notes = {
  s6: 'Added 87 cited sources spanning food truck trade associations (NFTA National Food Truck Association primary US operator trade body + state-level lobbying + NRA National Restaurant Association umbrella with mobile-vending advocacy), federal regulatory (FDA Food Code model code adopted in part by states for mobile food unit regulation + CDC Food Safety federal guidance + NFPA 96 Standard for Ventilation Control + Fire Protection of Commercial Cooking Operations Type-1 hood + Ansul fire suppression compliance + ServSafe Manager Certification accepted in most jurisdictions), city-specific permit programs (NYC DOHMH Mobile Food Vending Permit supervisory license + lottery + 2022 expansion + LA Bureau of Street Services Sidewalk Vending Program + restricted zones + SF Mobile Food Facility permit + restricted zones near restaurants + Austin Public Health food truck permit + zoning + Portland food cart pod model + Miami-Dade Mobile Food Dispensing Vehicle + Chicago two-tier Mobile Food Dispenser/Preparer), industry research (IBISWorld Food Trucks in the US Industry Report + BLS Bureau of Labor Statistics Foodservice), SBA + microloan + crowdfunding lenders (SBA Microloan Program $500-$50K + SBA 7(a) + Accion Opportunity Fund + Justine Petersen + LiftFund Texas + Southwest + CDC Small Business Finance + Pacific Community Ventures CDFI + Live Oak Bank SBA + Huntington National Bank SBA + Wells Fargo SBA), equipment finance (Balboa Capital + Crest Capital + Direct Capital + Beacon Funding truck specialist + National Funding + Bluevine LOC + OnDeck + Kabbage by American Express), crowdfunding (Kickstarter reward-based + Indiegogo reward + equity + Mainvest revenue-share + Honeycomb Credit community), custom truck builders (Cruising Kitchens San Antonio + M&R Specialty Trailers and Trucks Florida + Apollo Custom Manufacturing Texas + United Food Truck Builders + Concession Nation), chassis manufacturers (Freightliner MT45/MT55 step van + Workhorse W42), kitchen equipment (Vulcan Commercial Cooking Equipment 6-burner + Wolf Commercial + Garland Commercial Range + American Range + Pitco Fryer + Frymaster Commercial Fryer + True Refrigeration + Beverage-Air + Turbo Air + Atosa Commercial), fire safety (Ansul R-102 Fire Suppression Johnson Controls wet-chemical kitchen fire suppression), generators (Honda EU7000is Inverter Generator gold-standard quiet + Generac GP7500E), POS (Square for Restaurants dominant single-truck + Toast POS Restaurant + Clover POS by Fiserv + Revel Systems enterprise), booking + corporate catering platforms (Roaming Hunger largest US food truck booking marketplace + BestFoodTrucks + Truckster + MOGL Corporate Catering + Events + Cater2.me + ezCater largest US corporate catering), consumer tracking (Streetfood Finder food truck tracker app), insurance (Progressive Commercial + Geico Commercial + Insure My Food Truck specialty broker + FLIP Food Liability Insurance Program), wedding marketplaces (The Knot + WeddingWire + Zola), resale + asset (UsedVending food truck marketplace + BizBuySell largest US small business marketplace), restaurant operations software (MarketMan inventory + Restaurant365 operations + MarginEdge food cost + QuickBooks Online + Gusto payroll + ADP Run), regulatory (CA Air Resources Board Advanced Clean Fleets zero-emission medium + heavy-duty trucks 2025+), brand examples (Cousins Maine Lobster Franchise 40+ units + The Halal Guys franchise + Kogi BBQ iconic LA Korean BBQ taco truck Roy Choi 2008).',
  s7: 'Added comprehensive numbers block with 9 markdown pipe tables covering: industry size + operator landscape + unit economics (~36,000-42,000 active US food trucks + trailers per IBISWorld + NFTA + state DMV + $2.5B-$3.2B annual segment revenue + $1.05T-$1.15T total US foodservice market per NRA/BLS + 4-7% CAGR + avg revenue per truck $180K-$540K/yr full-time owner-operator + $650K-$1.4M/yr high-volume brand Kogi-tier + Cousins Maine Lobster + avg ticket $11-$18 per POS aggregator Square/Toast + 80-180 covers/shift + 28-38% gross + 10-22% net owner-operator + 12-20% blended EBITDA disciplined mini-fleet 3-5 trucks vs 3-9% spray-and-pray + food cost 28-34% + labor 22-32% + commissary/permits/insurance/fuel/propane/commission 18-26% + 44 of 50 states require commissary affidavit + 30-50% Year 1-3 owner exit rate); service mix by channel economics 7 channels (brewery rotation $1,400-$3,800/shift $0-$50 site fee 28-38% gross 30-45% of revenue + corporate Friday office park $1,800-$4,200/shift 10-20% if platform 30-40% gross 15-30% + wedding catering $1,800-$8,500/event 0-15% if planner 40-55% gross highest margin 15-30% + festival $3,500-$7,500 peak $150-$1,500 booth + 10-20% revenue share 25-38% 10-20% + farmers market $400-$1,800 $35-$150 booth 30-40% 5-15% + street + roaming $500-$1,800 volatile 28-38% 0-15% + DoorDash/Uber Eats hybrid 18-30% commission margin-negative typical 0-5%); capital tier (solo used retrofit $80K-$155K $200K-$450K + solo new custom $200K-$450K $250K-$540K + trailer + tow $55K-$180K $180K-$420K + 2-truck $200K-$500K $400K-$900K + 3-5 truck + central kitchen $500K-$1.5M $900K-$2.5M + BAM conversion + truck brand $400K-$1.5M BAM + 1-3 trucks $1.5M-$5M); truck + equipment + build-out by category 21 line items (used chassis $25K-$65K Freightliner MT45/Workhorse W42/Grumman Olson + used retrofit build-out $40K-$90K + new custom turnkey $80K-$200K Cruising Kitchens/M&R/Apollo/United Food Truck Builders/Concession Nation + trailer $35K-$120K + tow vehicle $20K-$60K Ford F-250/RAM 2500/Chevy 2500 used + 6-burner range Vulcan/Wolf/Garland/American Range $4K-$8K + flat-top $2K-$5K + Pitco/Frymaster fryer $1.5K-$4K + char-broiler optional $1.5K-$4K + convection oven optional $2K-$5K + True/Beverage-Air/Turbo Air/Atosa reach-in $3K-$8K + undercounter $1.5K-$3.5K + prep tables $1.5K-$4K + 3-comp sink + handwash $1K-$3K NSF + Type-1 hood + exhaust $4K-$12K NFPA 96 + Ansul R-102 wet-chemical fire suppression $2K-$5K + propane tank 40-100 lb + regulator + leak detector $400-$800 + fresh + gray water + water heater $1.5K-$3.5K + Honda EU7000is generator $5.5K-$7.5K gold standard + Generac/Champion/Yamaha alternative $3K-$6K + POS hardware Square Stand + KDS $500-$3K + initial inventory $4K-$12K + commissary first month + deposit $800-$4,500 + permits + licenses Year 1 all-in $1.5K-$6K); permit + commissary costs by city tier 4 tiers (Tier 1 coastal NYC/SF/LA/Boston/Seattle $800-$2,500/yr permit + $1,500-$3,000/mo commissary + waitlist + restricted zones + Tier 2 Chicago/Austin/Portland/Miami/DC $400-$1,500/yr + $700-$1,800/mo + permit caps in Austin + pod model in Portland + Tier 3 Nashville/Raleigh/Indianapolis/Phoenix $250-$900/yr + $500-$1,200/mo + Tier 4 small + rural $150-$500/yr + $400-$800/mo commissary may be scarce); payor + booking channel economics 9 channels (brewery rotation $0-$50 site fee + 2-5x/wk + 28-38% margin + corporate Friday direct + via Roaming Hunger/MOGL/BestFoodTrucks 10-20% commission + wedding direct + via The Knot/WeddingWire/planner 0-15% + festival $150-$1,500 + 10-20% rev share + farmers market $35-$150 booth + street + DoorDash/Uber Eats 18-30% commission margin-negative most decline); staff comp 7 roles (owner $28K-$95K Year 1-2 + $55K-$140K Year 3-5 + line cook $15-$22/hr part-time + $32K-$48K FT + prep cook commissary $14-$20/hr 10-25 hrs/wk + weekend service $13-$20/hr + GM/second owner-operator Stage 3+ $48K-$78K + catering account manager Stage 4+ $48K-$72K + commission + marketing outsourced $300-$1,500/mo); 5-year cash flow (Year 1 35-90 covers/day $120K-$280K $15K-$70K take-home to Year 5 mature mini-fleet 2-3 trucks 200-450 covers/day $700K-$1.8M $130K-$320K EBITDA 14-20%); capital stack 7 layers (founder equity $25K-$80K + SBA microloan 8-13% Accion/Justine Petersen/LiftFund/CDC SBF/Pacific Community Ventures + SBA 7(a) rare Live Oak/Huntington/Wells Fargo + equipment finance 9-16% Balboa/Crest/Direct Capital/Beacon/US Capital/National Funding + truck builder in-house Cruising/M&R/Apollo + working capital LOC Prime + 4-9% Bluevine/OnDeck/Kabbage + crowdfunding Kickstarter/Indiegogo/Mainvest/Honeycomb + acquisition financing 70-85% Prime + 2.5-5.0%); marketing channel 10 (Instagram Stories + Reels location-of-the-day owner time highest reach + 5K-30K followers practical + TikTok food content 8-25x reach but national audience + Google Business Profile + reviews 50-200 4.6+ stars decisive + Roaming Hunger/BestFoodTrucks profile free + 10-20% commission critical Year 1-2 + brewery cross-promo 2-4x amplification + festival + farmers market builds organic + wedding planner + venue referral 20-40% mature catering + email + SMS Mailchimp/Klaviyo $20-$100/mo + Yelp ads $25-$80/lead less effective + Google LSA + paid search limited use vs Instagram); exit multiples 6 buyer types (single truck owner-operator sale 1.5-3.0x SDE 2-6 months $45K-$180K + mini-fleet 2-5 trucks 3.0-5.0x SDE/EBITDA 4-10 months $200K-$1.2M + franchise/licensing 5-8% royalty + 2-4% marketing 12-36 months Cousins Maine Lobster path + BAM conversion build cost not multiple 18-30 months + acquihire by restaurant group $150K-$800K + 1-3 yr earn-out 4-9 months + asset wind-down equipment liquidation $25K-$90K 30-90 days).',
  s8: 'Added 14-element counter-case: weather + rain volatility (one rainy Saturday = 50% revenue loss on $3.5K-$7.5K festival or brewery shift + Year 1-2 operators lose 8-22% expected annual revenue + cannot insure against + spoiled prep food + crew already on payroll); seasonality + Northern death zone (Nov-Feb Boston/Chicago/Denver/Minneapolis/Seattle/NYC kills outdoor service + brewery patios close + festivals stop + corporate-park lunch halves + 40-60% revenue concentration in May-Sep typical + winter pivot options commissary catering + indoor pop-ups + mall food court rotations partial + most Northern trucks accept 5-month soft season); permit lottery + city-specific scarcity (NYC Mobile Food Vending Permit ~5,100 cap + multi-year lottery + 2022 expansion ~445/yr through 2032 waitlist still years long + LA Bureau of Street Services restricted zones near brick-and-mortar restaurants + SF Mobile Food Facility restricted zones + Austin permit cap + spacing rules + Portland pod scarcity multi-year waitlist + Chicago two-tier Dispenser/Preparer + plan permit research first 30-day deliverable + dont sign build contract before permits clear); commissary kitchen scarcity + cost (44 of 50 states require commissary affidavit + coastal SF/NYC/LA/Boston/Seattle commissary rent $1,500-$3,000/mo + 12-36 month waitlist at La Cocina SF/Hudson Kitchen NJ/Union Kitchen DC/CommonWealth Kitchen Boston + smaller markets monopoly + price control + scheduling chaos); Roaming Hunger/BestFoodTrucks/platform commission compression (10-20% commission platform-sourced bookings + stacks with credit-card 2.6-3% + payroll taxes 7.65% + workers comp + insurance + commissary + DoorDash + Uber Eats food truck pilots 18-30% + delivery driver wait time + parking + margin-negative for most trucks vs brick-and-mortar + operators must build direct booking Year 2+); brick-and-mortar restaurant lobby + protectionist ordinances (NRA + state restaurant associations lobby against mobile food + SF/LA/Boston/Philadelphia restricted zones 150-300 ft of restaurants + new ordinances 2024-2025 Nashville/Charleston/certain Texas cities tightened + future restaurant-protection legislation real political risk); food cost inflation post-COVID (beef + chicken + dairy + eggs + propane + paper costs +30-60% 2020-2024 + trucks lock menu prices via consumer-expectation inertia + Instagram-photo consistency + margin compression brutal + menu engineering + price increases every 6-9 months + commissary group purchasing + brewery + restaurant supply partnerships partial mitigations); labor shortage + same restaurant-industry pressures (food truck labor pulls from brewery + restaurant pool 30-50% short-staffed in many metros 2022-2026 + line cooks demand $18-$25/hr vs $13-$16/hr 2019 baseline + weekend crew brutal to retain Sat-Sun 10-hour shifts 90°F+ + Year 1-3 line cook turnover 60-100%/yr industry baseline); owner-operator burnout + 14-hour days (60-80 hrs/wk Year 1-2 + 30-50% Year 1-3 exit driven by burnout physical 12-14 hr service days in hot truck cab + mental booking pipeline anxiety + cash flow + permit hassle + crew management + many founders exit Year 2-3 for restaurant employment or career pivot + truck listed Facebook Marketplace 40-60% of build cost); theft + vandalism + parked-truck risk (window break-in + generator theft + propane tank theft + catalytic converter cut $1,500-$3,500/incident 2022-2024 + comprehensive insurance premium $2K-$5K/yr more in high-theft Bay Area/LA/Phoenix/Dallas); generator noise + emissions ordinances (portable generator noise 60 dB+ banned residential after 9pm + EPA Tier 4 emissions + brewery + festival + corporate pads requiring shore power + Honda EU7000is 52-60 dB gold standard + older Generac/Champion 70-85 dB face ordinance enforcement); CA Advanced Clean Fleets EV transition 2025+ (CARB ACF regulation zero-emission medium + heavy-duty truck purchases 2024 drayage + expanding 2027+ fleet + step van EV replacement $40K-$120K vs diesel + CA food trucks 2030-2035 transition capital planning now + NY/NJ/MA/OR/WA following CA lead); Instagram algorithm reach collapse + social fatigue (Instagram organic reach small business -50-80% 2022-2026 as Meta pushed Reels + paid promotion + food truck Stories + grid posts that previously generated foot traffic now require paid boost $15-$50/post or hyper-consistent content schedule + TikTok food content 8-25x reach but national not local + lower foot-traffic conversion + social media hard work that has gotten harder); customer COVID-era preference for delivery + ghost kitchen migration (consumer behavior DoorDash + Uber Eats + Grubhub + ghost-kitchen-only 2020-2024 compressed walk-up + brewery + festival demand + younger Gen Z + millennial delivery-default behavior reduces street-vending impulse + hybrid DoorDash + truck margin-negative + truck operators need brewery + corporate + wedding catering pipeline primary revenue to insulate) -- with honest 8-condition verdict on who should and should not start a food truck business in 2027.',
  s9: 'Cross-linked 29 related Pulse entries: q9668 pediatric dental practice (state-licensed + permit + recurring-revenue health service) + q9667 HVAC company (state-licensed + skilled trades + per-ticket service + PE roll-up parallel) + q9666 compounding pharmacy (state + federal regulated specialty service) + q9665 boutique fitness studio (lease-based + recurring revenue + customer-experience-driven) + q9664 microbrewery DIRECT sibling (regulated + state licensure + specialty equipment + brewery/food-truck symbiosis) + q9663 self-storage (specialty CRE) + q9662 mobile IV therapy clinic (state-regulated mobile service + cash/insurance mix) + q9661 veterinary clinic (specialty licensed practice + recall + insurance mix) + q9660 DPC (cash + insurance + membership service) + q9659 med spa (state licensure + service-membership) + q9658 NEW STRUCTURE sibling + q9657 home health agency (workforce + insurance + Medicaid parallel) + q9650 assisted living (specialty CRE + state licensure + insurance) + q9601 fractional CFO (operational backbone for multi-truck food brand) + q9576 adult coding bootcamp (state regulation framework) + q2117 post-construction cleanup (service-business operating pattern) + q1975 daycare (state licensure + parent-customer + child-services parallel) + q1951 meal prep DIRECT sibling (food-prep + recurring + cuisine-driven brand) + q1942/q1946-q1954 baseline Q&A format siblings + q1127/q1139 service business framework.',
  s10: 'SUBAGENT_VERIFIED. Lean deep baseline of the food truck business startup playbook for 2027 matching actual question "How do you start a food truck business in 2027?" Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,000-10,500 words AIM 8,500-9,500 with tight paragraphs (2-3 sentences max), frequent H3 breaks, no walls of text, no padding. Structure: Bottom Line callout (3 punchy bullets Capital/Margins/Hardest part with bold-tag labels hitting solo owner-operator $80K-$200K used step van retrofit Freightliner MT45/Workhorse W42/Grumman Olson vs $200K-$450K new custom via Cruising Kitchens/M&R/Apollo/United Food Truck Builders + 80-180 covers/day + $11-$18 avg ticket + $180K-$540K/yr revenue + 10-22% net + mature mini-fleet 12-20% blended EBITDA at $600K-$2.5M + sale multiples 1.5-3.0x SDE single + 3.0-5.0x EBITDA mini-fleet + counter-pressures weather + Nov-Feb Northern death zone + NYC/LA/SF/Austin/Portland permit lottery + commissary scarcity $1,500-$3,000/mo coastal + Roaming Hunger/BestFoodTrucks 10-20% commission + DoorDash/Uber Eats 18-30% margin-negative + food cost inflation 30-60% post-COVID + labor shortage + restaurant lobby brick-and-mortar protection + CA Advanced Clean Fleets EV transition 2025+ + Instagram algorithm collapse + owner-operator 14-hr days 30-50% Year 1-3 exit), then 3 short paragraphs distinguishing food truck/trailer ($180K-$540K avg revenue/unit + 10-22% net) from ghost/cloud kitchen (fixed-location delivery-only $300K-$1.2M + 8-18% net) + brick-and-mortar restaurant (lease + dining room + Type-2 facility $650K-$2.4M + 3-12% net far higher capital + risk) + pop-up catering (no mobile unit intermittent event-driven), then TOC block listing 13 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit) with horizontal rule separators, then LEAN H3 deep content sections inside each PART (3-4 sections per PART, tight 2-3 sentence paragraphs, no padding, frequent H3 breaks). flow contains exactly 2 mermaid diagrams (operating journey from concept + cuisine + permits + truck build through commissary + insurance + cookline + refrigeration + Type-1 hood + Ansul + propane + Honda EU7000is generator + POS + capital stack + staff hiring + booking pipeline + tech stack + marketing + stage growth + 6-path strategic exit; decision matrix for truck vs trailer vs mini-fleet vs acquisition AND cuisine + channel selection high-velocity vs niche vs dietary vs avoid-slow vs dessert/beverage with reference operators and exit math). src has 87 cited sources with real URLs covering NFTA + NRA + FDA Food Code + CDC Food Safety + NFPA 96 + ServSafe + NYC DOHMH Mobile Food Vending + LA Bureau of Street Services + SF Mobile Food Facility + Austin Public Health + Portland food cart pod + Miami-Dade Mobile Food Dispensing Vehicle + Chicago Mobile Food Dispenser/Preparer + IBISWorld + BLS + SBA Microloan + SBA 7(a) + Accion Opportunity Fund + Justine Petersen + LiftFund + CDC Small Business Finance + Pacific Community Ventures + Live Oak + Huntington + Wells Fargo + Balboa Capital + Crest Capital + Direct Capital + Beacon Funding + National Funding + Bluevine + OnDeck + Kabbage + Kickstarter + Indiegogo + Mainvest + Honeycomb Credit + Cruising Kitchens + M&R Specialty Trailers + Apollo Custom Manufacturing + United Food Truck Builders + Concession Nation + Freightliner MT45 + Workhorse W42 + Vulcan + Wolf + Garland + American Range + Pitco + Frymaster + True Refrigeration + Beverage-Air + Turbo Air + Atosa + Ansul R-102 + Honda EU7000is + Generac GP7500E + Square for Restaurants + Toast + Clover + Revel + Roaming Hunger + BestFoodTrucks + Truckster + MOGL + Cater2.me + ezCater + Streetfood Finder + Progressive Commercial + Geico Commercial + Insure My Food Truck + FLIP + The Knot + WeddingWire + Zola + UsedVending + BizBuySell + MarketMan + Restaurant365 + MarginEdge + QuickBooks Online + Gusto + ADP Run + CA CARB Advanced Clean Fleets + Cousins Maine Lobster Franchise + The Halal Guys + Kogi BBQ. num is comprehensive 9-table benchmark block (industry size + operator landscape + unit economics + service mix by channel 7 channels + capital tier + truck/equipment/build-out 21 line items + permit + commissary 4 city tiers + payor + booking channel 9 + staff comp 7 roles + 5-year cash flow + capital stack 7 layers + marketing channel 10 + exit multiples 6 buyer types). counter is 14-element counter-case with weather + seasonality + permit lottery + commissary scarcity + commission compression + restaurant lobby + food cost inflation + labor shortage + owner burnout + theft + generator ordinances + CA EV transition + Instagram algorithm + ghost-kitchen consumer migration + honest 8-condition verdict. links cross-references 29 related entries with q9664 microbrewery DIRECT sibling (brewery/food-truck symbiosis) + q1951 meal prep DIRECT sibling (food-prep + cuisine brand). All numbers grounded in real NFTA + IBISWorld + NRA + BLS + Roaming Hunger operator surveys + state DMV registrations + city permit programs + commissary lease realities + Cousins Maine Lobster + Kogi + The Halal Guys franchise/brand examples. ASCII-clean throughout. Lean target 8,500-9,500 words honored.'
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
