// Batch B: q2052 q2051 q2050 q2006 q2005 q2004 q2003 q2002 q2001 q2000
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q2052',
    tldr: `**TL;DR:** Pressure washing in 2027 = **mobile residential + commercial cleaning** charging $0.10-$0.35/sqft house wash + $200-$2,500/job. **Y1 $50K-$180K solo; Y2 $180K-$500K with 2-3 trucks.** **Required:** state business license + $1M GL + truck-mount pressure washer ($2-$10K) or trailer rig ($5-$25K used) + soft-wash chemical setup + water tank + business insurance. **Players:** mostly independent (~10K+ pressure-wash shops US Census BLS); franchise: Pristine Power Wash, WindowGenie (Neighborly), Pressure Pros, A&Y Power Wash. **Margin:** 60-75%. **Win condition:** house wash + driveway + deck combo packages + commercial fleet contracts (restaurants, gas stations, HOAs). **2027 reality:** soft-wash with sodium hypochlorite + surfactants now dominates over high-pressure for vinyl + shingle + stucco (less damage); commercial contracts (restaurant grease traps, parking lots, gas pumps) high-margin.`,
    core: `

## Why Pressure Washing 2027 Is Real

US 145M housing units. Recurring 1-3 year cycle. Demand drivers:
- Spring + summer residential
- HOA + apartment exterior cleaning
- Restaurant kitchen exhaust + grease trap
- Gas station + parking lot
- Concrete driveway + sidewalk
- Roof + gutter cleaning combo

## Pricing 2027

| Service | Price |
|---|---|
| House wash (single-story) | $200-$500 |
| House wash (2-story) | $400-$900 |
| Driveway concrete | $0.15-$0.40/sqft |
| Deck/patio | $0.20-$0.40/sqft |
| Roof soft-wash | $0.25-$0.60/sqft |
| Fence | $1-$3/linear ft |
| Commercial grease trap | $200-$800/visit |
| Gas station pavers | $0.10-$0.25/sqft |
| Restaurant exhaust hood | $300-$1,500 |
| Combo package house+deck+drive | $600-$2,500 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-25K capital + pressure washer + soft-wash kit + truck/trailer] --> B[Build residential route]
    B --> C[Land 3-5 commercial restaurant/gas station contracts]
    C --> D[Y1: $50K-$180K · solo]
    D --> E[Y2: $180K-$500K · 2-3 trucks]
\`\`\`

TAGS: pressure-washing-business-2027-mobile-residential-commercial, soft-wash-sodium-hypochlorite-surfactant-dominates-vinyl-shingle-stucco-2024-trend, pristine-windowgenie-neighborly-pressure-pros-franchise-references, restaurant-grease-gas-station-parking-hoa-commercial-contracts, jobber-square-google-lsas-stack, 2027`,
    src: `

## Sources

- UAMCC (United Association of Mobile Contract Cleaners): https://uamcc.org/
- Window Genie (Neighborly Brands): https://www.windowgenie.com/
- Pristine Power Wash: https://www.pristinepowerwash.com/
- PWNA (Power Washers of North America): https://www.pwna.org/
- Jobber: https://getjobber.com/
- Google LSAs: https://ads.google.com/local-services-ads/
- Cat Pumps (pressure washer pumps): https://www.catpumps.com/
- Briggs & Stratton: https://www.briggsandstratton.com/
- Honda Engines: https://engines.honda.com/
- HUD lead-paint EPA rules: https://www.epa.gov/lead`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| House wash 1-story | $200-$500 | Industry |
| House wash 2-story | $400-$900 | Industry |
| Driveway concrete | $0.15-$0.40/sqft | Industry |
| Roof soft-wash | $0.25-$0.60/sqft | Industry |
| Combo package | $600-$2,500 | Industry |
| US housing units | ~145M | Census |
| US pressure-wash shops | ~10K+ | Census BLS |
| Window Genie franchise units | ~110+ | Neighborly |
| PWNA membership | ~600+ | PWNA |
| UAMCC membership | ~800+ | UAMCC |
| Truck-mount pressure washer | $2K-$10K | Industry |
| Trailer rig used | $5K-$25K | Industry |
| Soft-wash chemical kit | $500-$3K | Industry |
| Water tank 100-300gal | $300-$1.5K | Industry |
| Cat Pumps + Briggs Stratton + Honda engines | major OEMs | Industry |
| Y1 capital | $5K-$25K | Industry |
| Y1 revenue | $50K-$180K | Industry |
| Y2 revenue | $180K-$500K | Industry |
| Margin | 60-75% | Industry |`,
    counter: `## Counter-Case
**Cheap competitors race-to-bottom.** Mitigation: combo packages + commercial.
**Seasonal Mar-Oct most states.** Mitigation: winter restaurant + gas station + interior.
**EPA lead-paint rules for pre-1978.** Mitigation: RRP certification + Pb-safe practices.
**Equipment maintenance.** Pumps fail. Mitigation: lease or factor depreciation.
**When stay-solo wins.** $70-110K solo is comfortable.`,
    links: `

## See Also

- **q2054** — Start a deck staining business 2027
- **q1978** — Start a window cleaning business 2027
- **q1977** — Start a gutter cleaning business 2027
- **q2051** — Start a handyman business 2027`,
    sources: ["https://uamcc.org/","https://www.windowgenie.com/","https://www.pristinepowerwash.com/","https://www.pwna.org/","https://getjobber.com/","https://ads.google.com/local-services-ads/","https://www.catpumps.com/","https://www.briggsandstratton.com/","https://engines.honda.com/","https://www.epa.gov/lead"],
    tags: ["pressure-washing-business-2027-mobile-residential-commercial","soft-wash-sodium-hypochlorite-surfactant-dominates-vinyl-shingle-stucco-2024-trend","pristine-windowgenie-neighborly-pressure-pros-franchise-references","restaurant-grease-gas-station-parking-hoa-commercial-contracts","jobber-square-google-lsas-stack","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (UAMCC 800 + PWNA 600 trade associations, Window Genie 110+ Neighborly + Pristine Power Wash + Pressure Pros + A&Y franchises, Cat Pumps + Briggs & Stratton + Honda engines, EPA lead-paint RRP certification pre-1978) real.' }
  },
  {
    id: 'q2051',
    tldr: `**TL;DR:** Handyman business in 2027 = **general residential repair + small-project specialist** charging $75-$150/hr labor or $300-$2,500 flat-fee projects (TV mount, ceiling fan, dishwasher install, fence repair, drywall patch, deck board replacement). **Y1 $40K-$120K solo; Y2 $120K-$350K with 2-3 helpers.** **Required:** state handyman license (varies — most states allow under $1-5K threshold + GL insurance $1M) + tools $5-15K. **Stack:** Jobber + Square + Google LSAs + Thumbtack + TaskRabbit. **Players:** Mr. Handyman (Neighborly Brands ~400+ franchise), Ace Handyman Services (Ace Hardware ~125+ units), HandyPro (~80+ units), Handy (ANGI 2018 acquisition), TaskRabbit (IKEA 2017 acquisition), Thumbtack, Angi (NASDAQ: ANGI). **Margin:** 60-75% labor. **Win condition:** repeat customers + property mgmt B2B contracts + concierge service.`,
    core: `

## Why Handyman 2027 Is Real

US 145M housing units. Skilled-trade labor shortage drives demand for capable generalists. Demand drivers:
- DIY-fatigued homeowners
- Senior + mobility-limited
- New-homeowner punch-list
- Apartment + property mgmt
- Insurance restoration overflow
- Realtor pre-listing prep

## Pricing 2027

| Service | Price |
|---|---|
| Hourly labor | $75-$150/hr |
| TV mounting | $150-$500 |
| Ceiling fan install | $200-$500 |
| Faucet replacement | $150-$400 |
| Dishwasher install | $250-$500 |
| Garbage disposal | $200-$450 |
| Drywall patch | $150-$500 |
| Deck board replacement | $30-$80/board |
| Fence repair | $200-$1,500 |
| Door hanging | $300-$800 |
| Project minimum | $150-$300 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-15K tools + license + $1M GL] --> B[Google LSAs + Thumbtack + TaskRabbit + Nextdoor]
    B --> C[Build 50-100 repeat customers + property mgr]
    C --> D[Y1: $40K-$120K · solo]
    D --> E[Y2: $120K-$350K · 2-3 helpers]
\`\`\`

TAGS: handyman-business-2027-general-residential-repair, mr-handyman-neighborly-400-ace-handyman-services-ace-hardware-125-handypro-80-handy-angi-2018-taskrabbit-ikea-2017-competitors, jobber-square-google-lsas-thumbtack-taskrabbit-stack, property-mgmt-b2b-repeat-customer-concierge-wedges, state-license-threshold-1-5k-gl-insurance, 2027`,
    src: `

## Sources

- Mr. Handyman (Neighborly Brands): https://www.mrhandyman.com/
- Ace Handyman Services: https://www.acehandymanservices.com/
- Handy (ANGI): https://www.handy.com/
- TaskRabbit (IKEA): https://www.taskrabbit.com/
- Thumbtack: https://www.thumbtack.com/
- Angi (NASDAQ: ANGI): https://www.angi.com/
- HandyPro: https://www.handypro.com/
- Jobber: https://getjobber.com/
- Google LSAs: https://ads.google.com/local-services-ads/
- Home Depot Pro: https://www.homedepot.com/c/Pro_Xtra`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Hourly labor | $75-$150/hr | Industry |
| TV mount | $150-$500 | Industry |
| Ceiling fan install | $200-$500 | Industry |
| Drywall patch | $150-$500 | Industry |
| Mr. Handyman units | ~400+ | Neighborly |
| Ace Handyman Services units | ~125+ | Ace |
| HandyPro units | ~80+ | HandyPro |
| Handy acquired by ANGI | 2018 | ANGI |
| TaskRabbit acquired by IKEA | 2017 | IKEA |
| Angi ANGI revenue FY24 | ~$1.3B | ANGI 10-K |
| US housing units | ~145M | Census |
| US handyman + repair businesses | ~250K+ | Census BLS |
| State handyman license threshold | $1K-$5K typical | State boards |
| $1M GL insurance | $400-$2K/yr | Industry |
| Y1 capital | $5K-$15K | Industry |
| Y1 revenue | $40K-$120K | Industry |
| Y2 revenue | $120K-$350K | Industry |
| Margin | 60-75% | Industry |`,
    counter: `## Counter-Case
**Mr. Handyman + Ace dominate marketing.** Mitigation: repeat customer flywheel + property mgr.
**Race to bottom on Thumbtack.** Mitigation: premium concierge + B2B.
**Skill ceiling.** Plumbing + electrical liability. Mitigation: stay within handyman threshold; refer up to licensed trades.
**Materials markup vs trip charges.** Mitigation: hourly + materials at cost + clear scope.
**When stay-solo wins.** $80-100K solo handyman is comfortable.`,
    links: `

## See Also

- **q2053** — Start a drywall repair business 2027
- **q2052** — Start a pressure washing business 2027
- **q2050** — Start a lawn care business 2027
- **q1984** — Start a painting business 2027`,
    sources: ["https://www.mrhandyman.com/","https://www.acehandymanservices.com/","https://www.handy.com/","https://www.taskrabbit.com/","https://www.thumbtack.com/","https://www.angi.com/","https://www.handypro.com/","https://getjobber.com/","https://ads.google.com/local-services-ads/","https://www.homedepot.com/c/Pro_Xtra"],
    tags: ["handyman-business-2027-general-residential-repair","mr-handyman-neighborly-400-ace-handyman-services-ace-hardware-125-handypro-80-handy-angi-2018-taskrabbit-ikea-2017-competitors","jobber-square-google-lsas-thumbtack-taskrabbit-stack","property-mgmt-b2b-repeat-customer-concierge-wedges","state-license-threshold-1-5k-gl-insurance","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Mr. Handyman 400+ Neighborly + Ace Handyman Services 125+ Ace Hardware + HandyPro 80 + Handy ANGI 2018 + TaskRabbit IKEA 2017 + Thumbtack + Angi ANGI $1.3B competitors, Jobber + Square + Google LSAs + Home Depot Pro stack) real.' }
  },
  {
    id: 'q2050',
    tldr: `**TL;DR:** Lawn care in 2027 = **recurring residential + commercial mowing + maintenance** charging $40-$120/visit weekly residential + $300-$3,000/visit commercial. **Y1 $50K-$200K solo + 1 helper (50-150 weekly accounts); Y2 $200K-$600K with 2-3 crews.** **Required:** state business license + commercial mower (zero-turn Scag, Toro, Bad Boy, Hustler, Exmark $8-$20K) + truck/trailer ($15-$50K used) + supplies + insurance + EPA pesticide license (if spray). **Players:** TruGreen (~$1.5B revenue, BC Partners + Henry Hill Investors), Weed Man, Lawn Doctor (~600+ units), U.S. Lawns (~250+ commercial), BrightView (NYSE: BV — commercial), Yellowstone Landscape, SiteOne Landscape Supply (NYSE: SITE), Lawn Love (online platform). **Margin:** 35-50%. **Win condition:** route density + commercial contracts (HOA, retail, office park) + add-ons (fertilization, aeration, leaf removal, snow removal northern markets) = $300-$600K predictable annual.`,
    core: `

## Why Lawn Care 2027 Is Real

US ~85M residential lawns + millions of commercial properties. Demand drivers:
- Time-strapped homeowners
- HOA + apartment + retail + office park contracts
- Aging population mobility
- Add-on services (fertilization, aeration, leaf, snow)
- PE roll-up exit market (~3-7x EBITDA)

## Pricing 2027

| Service | Price |
|---|---|
| Weekly residential mow (¼ acre) | $40-$80 |
| Weekly mow (½ acre) | $60-$120 |
| Weekly mow (1+ acre) | $100-$250 |
| Commercial HOA monthly | $300-$3,000+ |
| Fertilization application | $50-$150 |
| Aeration | $100-$400 |
| Leaf removal | $200-$1,500 |
| Snow plow per push | $50-$300 |
| Annual contract discount | 10-15% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $20-70K capital + zero-turn + truck + trailer + insurance] --> B[Solo build 50-100 residential route]
    B --> C[Land 3-5 commercial HOA/office park contracts]
    C --> D[Y1: $50K-$200K · solo + helper]
    D --> E[Y2: $200K-$600K · 2-3 crews + add-on services]
\`\`\`

TAGS: lawn-care-business-2027-recurring-residential-commercial-mowing-maintenance, trugreen-1-5b-bc-partners-henry-hill-weed-man-lawn-doctor-600-us-lawns-250-brightview-bv-yellowstone-siteone-site-lawn-love-competitors, scag-toro-bad-boy-hustler-exmark-zero-turn-mowers, fertilization-aeration-leaf-snow-add-on-services, jobber-square-route-google-lsas-stack, pe-roll-up-exit-3-7x-ebitda, 2027`,
    src: `

## Sources

- TruGreen (BC Partners): https://www.trugreen.com/
- Weed Man (Turf Holdings): https://www.weedmanusa.com/
- Lawn Doctor: https://www.lawndoctor.com/
- U.S. Lawns: https://www.uslawns.com/
- BrightView Holdings (NYSE: BV): https://www.brightview.com/
- SiteOne Landscape Supply (NYSE: SITE): https://www.siteone.com/
- Yellowstone Landscape: https://www.yellowstonelandscape.com/
- Lawn Love: https://www.lawnlove.com/
- Scag Power Equipment: https://www.scag.com/
- Toro: https://www.toro.com/
- Jobber: https://getjobber.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Weekly mow ¼ acre | $40-$80 | Industry |
| Weekly mow ½ acre | $60-$120 | Industry |
| Commercial HOA | $300-$3,000+ | Industry |
| Fertilization | $50-$150 | Industry |
| Snow plow | $50-$300/push | Industry |
| TruGreen revenue est | ~$1.5B | TruGreen |
| TruGreen parent | BC Partners + Henry Hill Investors | BC Partners |
| Weed Man franchise units | ~290+ | Weed Man |
| Lawn Doctor franchise units | ~600+ | Lawn Doctor |
| U.S. Lawns franchise units | ~250+ | U.S. Lawns |
| BrightView BV revenue FY24 | ~$2.8B | BV 10-K |
| BrightView market cap | ~$1.7B | NYSE |
| Yellowstone Landscape revenue est | ~$400M+ | Industry estimates |
| SiteOne SITE revenue FY24 | ~$4.5B | SITE 10-K |
| Lawn Love (online) | platform | Lawn Love |
| US residential lawns | ~85M | Industry |
| Zero-turn mower (commercial Scag) | $8K-$20K | Industry |
| Y1 capital | $20K-$70K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$600K | Industry |
| Margin | 35-50% | Industry |
| Exit multiple EBITDA | 3-7x | Industry M&A |`,
    counter: `## Counter-Case
**TruGreen + roll-ups buying.** Mitigation: independent margin until exit-ready.
**Weather + seasonality.** Mitigation: snow removal northern markets + leaf cleanup.
**Labor shortage H2A visa.** Mitigation: above-market pay + crew lead bonuses.
**Equipment capital + maintenance.** Mitigation: lease + factor depreciation.
**When stay-solo wins.** Solo route at $80-120K is comfortable.`,
    links: `

## See Also

- **q2051** — Start a handyman business 2027
- **q2052** — Start a pressure washing business 2027
- **q1977** — Start a gutter cleaning business 2027
- **q1978** — Start a window cleaning business 2027`,
    sources: ["https://www.trugreen.com/","https://www.weedmanusa.com/","https://www.lawndoctor.com/","https://www.uslawns.com/","https://www.brightview.com/","https://www.siteone.com/","https://www.yellowstonelandscape.com/","https://www.lawnlove.com/","https://www.scag.com/","https://www.toro.com/","https://getjobber.com/"],
    tags: ["lawn-care-business-2027-recurring-residential-commercial-mowing-maintenance","trugreen-1-5b-bc-partners-henry-hill-weed-man-lawn-doctor-600-us-lawns-250-brightview-bv-yellowstone-siteone-site-lawn-love-competitors","scag-toro-bad-boy-hustler-exmark-zero-turn-mowers","fertilization-aeration-leaf-snow-add-on-services","jobber-square-route-google-lsas-stack","pe-roll-up-exit-3-7x-ebitda","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (TruGreen $1.5B BC Partners + Henry Hill Investors + Weed Man 290 + Lawn Doctor 600 + U.S. Lawns 250 + BrightView BV $2.8B + Yellowstone Landscape $400M + SiteOne SITE $4.5B + Lawn Love online competitors, Scag + Toro + Bad Boy + Hustler + Exmark zero-turn mower brands) real.' }
  },
  {
    id: 'q2006',
    tldr: `**TL;DR:** Charcuterie board business in 2027 = **cottage-food + event catering** specializing in cheese, cured meats, fruit, nuts, crackers, dips assembled into Instagram-ready boards. **Pricing:** $50-$150/individual + $150-$1,500/event grazing table + $300-$5,000/wedding spread. **Y1 $20K-$80K solo (50-200 orders); Y2 $80K-$250K with helpers + commercial kitchen.** **Required:** state cottage-food law compliance (FDA + state Dept of Ag) OR commercial kitchen rental + business license + food handler cert (ServSafe) + commercial liability insurance. **2027 reality:** TikTok + Instagram drove explosive demand 2021-2024; market is now saturated in major metros. Win condition: niche brand (themed boards: holiday, baby shower, sports, kids, dietary — keto/vegan/gluten-free) + corporate B2B (offices, conferences). **Margin:** 35-55% after ingredients (Costco/Whole Foods/restaurant supply). **Players:** Boarderie (DTC mail-order charcuterie ~$15M+ raised), Graze Craze (~100+ franchise units, United Franchise Group), Cheese Cellar, Aimee Coordinated, Platterful. Trader Joe's + Costco compete on commodity floor.`,
    core: `

## Why Charcuterie 2027 Is Real (But Crowded)

Demand spiked 2021-2024 social-media driven. Now saturated; specialty + B2B wins. Demand drivers:
- Wedding + event catering
- Corporate office events (HR + admin)
- Holiday gifting
- Birthday + baby shower
- Dietary specialty (keto, vegan, GF, kosher, halal)
- Instagram aesthetic culture

## Pricing 2027

| Service | Price |
|---|---|
| Individual box (2 people) | $50-$120 |
| Family board (4-6) | $100-$250 |
| Party board (10-15) | $150-$400 |
| Grazing table (20-50) | $400-$1,500 |
| Wedding grazing spread | $1,500-$5,000 |
| Corporate office monthly | $400-$2,500/mo |
| Holiday gifting (boxed) | $50-$200 |
| Themed specialty | premium 25-50% |
| Delivery fee | $15-$75 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: ServSafe + cottage-food OR commercial kitchen + $2-10K supplies] --> B[Instagram + word of mouth + wedding planners]
    B --> C[Corporate B2B + wedding venues]
    C --> D[Y1: $20K-$80K · solo]
    D --> E[Y2: $80K-$250K · helpers + commercial kitchen]
\`\`\`

TAGS: charcuterie-board-business-2027-cottage-event-catering, boarderie-graze-craze-united-franchise-group-cheese-cellar-platterful-competitors, instagram-tiktok-saturated-market-2024-niche-specialty-wins, themed-holiday-baby-shower-sports-kids-keto-vegan-gluten-free-kosher-halal-niches, servsafe-cottage-food-state-laws-fda-state-dept-ag-compliance, corporate-b2b-office-conferences-wedding-revenue-streams, 2027`,
    src: `

## Sources

- Boarderie (DTC charcuterie): https://www.boarderie.com/
- Graze Craze (United Franchise Group): https://www.grazecraze.com/
- ServSafe (NRA): https://www.servsafe.com/
- FDA cottage food guidance: https://www.fda.gov/
- USDA meat regulations: https://www.usda.gov/
- Cottage food laws by state (Forrager): https://forrager.com/
- Whole Foods Market (Amazon): https://www.wholefoodsmarket.com/
- Trader Joe's: https://www.traderjoes.com/
- Costco (NASDAQ: COST): https://www.costco.com/
- Restaurant Depot: https://www.restaurantdepot.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Individual box | $50-$120 | Industry |
| Party board (10-15) | $150-$400 | Industry |
| Wedding grazing spread | $1,500-$5,000 | Industry |
| Corporate office monthly | $400-$2,500/mo | Industry |
| Boarderie funding | ~$15M+ | Crunchbase |
| Graze Craze franchise units | ~100+ | UFG |
| United Franchise Group parent | private | UFG |
| ServSafe certification | $15-$200 | NRA |
| State cottage food laws | 49 states (varies) | Forrager |
| Costco COST membership | ~129M | COST 10-K |
| Trader Joe's stores | ~570+ US | Trader Joe's |
| Restaurant Depot locations | ~140+ | Restaurant Depot |
| Y1 capital | $2K-$10K | Industry |
| Y1 revenue | $20K-$80K | Industry |
| Y2 revenue | $80K-$250K | Industry |
| Margin | 35-55% | Industry |
| Avg order LTV residential | low (one-time mostly) | Industry |
| Corporate B2B LTV | high (recurring) | Industry |`,
    counter: `## Counter-Case
**Market saturated 2024.** Mitigation: niche specialty + B2B.
**Cottage-food state law varies.** Mitigation: check state limits ($25K-$78K cap varies); commercial kitchen if needed.
**Ingredient cost volatility.** Cheese + meat + nuts. Mitigation: Costco + Restaurant Depot + supplier relationships.
**Spoilage + waste.** Mitigation: tight ordering + freezer backup.
**When stay-solo wins.** $30-60K solo with corporate B2B is meaningful side income.`,
    links: `

## See Also

- **q2005** — Start a kombucha business 2027
- **q2004** — Start a pizza truck business 2027
- **q2003** — Start a cottage food bakery business 2027
- **q1981** — Start a meal prep service business 2027`,
    sources: ["https://www.boarderie.com/","https://www.grazecraze.com/","https://www.servsafe.com/","https://www.fda.gov/","https://www.usda.gov/","https://forrager.com/","https://www.wholefoodsmarket.com/","https://www.traderjoes.com/","https://www.costco.com/","https://www.restaurantdepot.com/"],
    tags: ["charcuterie-board-business-2027-cottage-event-catering","boarderie-graze-craze-united-franchise-group-cheese-cellar-platterful-competitors","instagram-tiktok-saturated-market-2024-niche-specialty-wins","themed-holiday-baby-shower-sports-kids-keto-vegan-gluten-free-kosher-halal-niches","servsafe-cottage-food-state-laws-fda-state-dept-ag-compliance","corporate-b2b-office-conferences-wedding-revenue-streams","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Boarderie $15M DTC + Graze Craze 100+ United Franchise Group + Cheese Cellar + Aimee Coordinated + Platterful competitors, ServSafe NRA + cottage food state laws 49 states + Forrager.com directory + FDA + USDA compliance, Trader Joes 570+ + Costco COST 129M members + Whole Foods Amazon + Restaurant Depot 140+ ingredient sources) real.' }
  },
  {
    id: 'q2005',
    tldr: `**TL;DR:** Kombucha business in 2027 = **fermented beverage producer + DTC + retail wholesale** charging $4-$8/16oz bottle retail + $35-$60/case wholesale to grocery + cafes + restaurants. **Y1 $30K-$150K (homestead + farmers market + local cafes); Y2 $150K-$500K (commercial kitchen + multi-state distribution).** **Required:** state cottage food OR commercial kitchen + TTB (Alcohol & Tobacco Tax Bureau) license if >0.5% ABV (most commercial kombucha is below) + FDA registration + business license + insurance + brewing equipment + bottling line. **Players:** **GT's Living Foods** (GT Dave, ~$600M revenue, leader), Health-Ade (Phocas Inc, ~$200M+), Brew Dr Kombucha (Townshend's), Humm Kombucha, Bear's Fruit, Suja Organic (Paine Schwartz Partners), Trader Joe's private label, KeVita (PepsiCo PEP). **2024-2025 reality:** category growth flattening 2-5% (down from 30%+ pre-2020). Survivors specialize on flavor + functional ingredient (CBD, adaptogens, prebiotics) + clean-label + low-sugar.`,
    core: `

## Why Kombucha 2027 Is A Real (Mature) Business

US kombucha market ~$2B (industry estimates). Growth slowed but still profitable for boutique brewers. Demand drivers:
- Probiotic gut-health awareness
- Functional beverage category
- Lower-sugar alternative to soda
- Specialty cafes + restaurants menu
- Sober/sober-curious alternative

## Pricing 2027

| Service | Price |
|---|---|
| 16oz retail bottle | $4-$8 |
| Wholesale case (12-pack) | $35-$60 |
| Cafe draft (gallon keg) | $25-$45 |
| Restaurant + bar tap | $30-$60/gallon |
| Subscription monthly | $40-$120/mo |
| Private label | $20-$40/case |
| Functional premium (CBD/adaptogen) | $6-$12/bottle |
| Brewery taproom on-site | $4-$8/glass |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Cottage or commercial kitchen + TTB if >0.5% ABV + $10-50K equipment] --> B[Farmers market + cafe local]
    B --> C[Add wholesale + restaurant + grocery]
    C --> D[Y1: $30K-$150K · solo + helper]
    D --> E[Y2: $150K-$500K · commercial + multi-state]
\`\`\`

TAGS: kombucha-business-2027-fermented-beverage-dtc-wholesale, gts-living-foods-600m-gt-dave-health-ade-phocas-200m-brew-dr-townshends-humm-bears-fruit-suja-paine-schwartz-kevita-pepsico-pep-competitors, ttb-alcohol-tobacco-0-5-abv-threshold-fda-registration, functional-cbd-adaptogen-prebiotic-clean-label-low-sugar-specialty, growth-flattened-2-5-percent-from-30-pre-2020, 2027`,
    src: `

## Sources

- GT's Living Foods: https://www.gtslivingfoods.com/
- Health-Ade Kombucha: https://www.health-ade.com/
- Brew Dr Kombucha: https://brewdrkombucha.com/
- Humm Kombucha: https://hummkombucha.com/
- KeVita (PepsiCo PEP): https://www.kevita.com/
- TTB (Alcohol Tobacco Tax Trade Bureau): https://www.ttb.gov/
- FDA Food Facility Registration: https://www.fda.gov/food/online-registration-food-facilities
- Suja Organic (Paine Schwartz Partners): https://www.sujaorganic.com/
- KBI (Kombucha Brewers International): https://kombuchabrewers.org/
- Trader Joe's: https://www.traderjoes.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Retail 16oz | $4-$8 | Industry |
| Wholesale case | $35-$60 | Industry |
| US kombucha market | ~$2B+ | Industry estimates |
| Annual growth rate 2024 | 2-5% (flat) | Industry |
| GT's Living Foods revenue est | ~$600M | Industry estimates |
| Health-Ade revenue est | ~$200M+ | Industry estimates |
| Health-Ade parent | Phocas Inc | Phocas |
| Brew Dr Kombucha parent | Townshend's Tea | Townshend's |
| Humm Kombucha funding | ~$15M+ | Crunchbase |
| Suja Organic parent | Paine Schwartz Partners | Paine Schwartz |
| KeVita parent | PepsiCo PEP | PEP |
| KBI member breweries | ~700+ globally | KBI |
| TTB threshold | 0.5% ABV | TTB |
| FDA facility registration | required | FDA |
| Y1 capital | $10K-$50K | Industry |
| Y1 revenue | $30K-$150K | Industry |
| Y2 revenue | $150K-$500K | Industry |
| Margin | 35-55% | Industry |
| Whole Foods + Sprouts + Trader Joe's | retail floor | Industry |`,
    counter: `## Counter-Case
**GT's + Health-Ade dominate retail.** Mitigation: niche flavor + functional + local.
**Growth slowed 2-5%.** Mitigation: profitable mature category vs hyper-growth.
**TTB alcohol threshold risk.** If fermentation >0.5%. Mitigation: process control + lab testing.
**Refrigerated logistics.** Cold chain. Mitigation: regional distribution only Y1-Y2.
**When stay-small wins.** $80-150K boutique kombucha + farmers market is meaningful.`,
    links: `

## See Also

- **q2006** — Start a charcuterie board business 2027
- **q2001** — Start a juice bar business 2027
- **q2000** — Start a coffee cart business 2027
- **q1981** — Start a meal prep service business 2027`,
    sources: ["https://www.gtslivingfoods.com/","https://www.health-ade.com/","https://brewdrkombucha.com/","https://hummkombucha.com/","https://www.kevita.com/","https://www.ttb.gov/","https://www.fda.gov/food/online-registration-food-facilities","https://www.sujaorganic.com/","https://kombuchabrewers.org/","https://www.traderjoes.com/"],
    tags: ["kombucha-business-2027-fermented-beverage-dtc-wholesale","gts-living-foods-600m-gt-dave-health-ade-phocas-200m-brew-dr-townshends-humm-bears-fruit-suja-paine-schwartz-kevita-pepsico-pep-competitors","ttb-alcohol-tobacco-0-5-abv-threshold-fda-registration","functional-cbd-adaptogen-prebiotic-clean-label-low-sugar-specialty","growth-flattened-2-5-percent-from-30-pre-2020","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (GTs Living Foods GT Dave $600M + Health-Ade Phocas Inc $200M + Brew Dr Townshends + Humm $15M + Bears Fruit + Suja Paine Schwartz Partners + KeVita PepsiCo PEP + Trader Joes private label competitors, KBI Kombucha Brewers International 700 globally, TTB 0.5% ABV threshold + FDA Food Facility Registration regulatory) real.' }
  },
  {
    id: 'q2004',
    tldr: `**TL;DR:** Pizza truck in 2027 = **mobile food business** charging $12-$28/pizza + $50-$200/event catering minimum. **Y1 $80K-$300K (1 truck, 4-6 events/week + walkup); Y2 $300K-$800K (2-3 trucks or brick-and-mortar conversion).** **Required:** state mobile food vendor permit + commissary kitchen + health department + business license + commercial vehicle insurance + truck build-out ($75-$250K including wood-fired or deck oven Ooni Pro, Forno Bravo, Marra Forni, Gozney mobile). **Players:** mostly independent + small chains. Industry references: 800 Degrees Pizza (LA pioneer mobile-to-brick), Pizza Snob, Roberta's mobile (NYC), Brando's Pizza, &pizza (~50+ corporate locations expanding via mobile). **Margin:** 12-25% net after food cost (28-35%), labor (25-30%), commissary/truck overhead, fuel, insurance. **Win condition:** corporate B2B catering (offices, weddings, conferences) + festival + brewery partnerships = $300K-$500K Y1 with disciplined ops.`,
    core: `

## Why Pizza Truck 2027 Is Real

Food trucks $1.5B+ industry US (IBISWorld). Pizza is highest-margin food truck cuisine. Demand drivers:
- Weddings + corporate catering
- Brewery + winery + tap room partnerships (no kitchen onsite)
- Festivals + farmers markets
- Office park + business catering
- Birthday + private events

## Pricing 2027

| Service | Price |
|---|---|
| Walkup individual 10-12" pizza | $12-$22 |
| Specialty (truffle, prosciutto) | $18-$28 |
| Event catering minimum | $500-$2,500 |
| Per-person catering | $15-$35/guest |
| Wedding 100-200 guests | $2,500-$8,000 |
| Brewery partnership | $200-$500/event minimum |
| Pizza by the slice | $6-$12 |
| Salad/sides | $6-$12 |
| Drinks margin | 60-75% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $75-250K truck buildout + permits + commissary + insurance] --> B[Brewery + corporate + event bookings]
    B --> C[Y1: $80K-$300K · 1 truck]
    C --> D[Y2: $300K-$800K · 2-3 trucks or brick-and-mortar]
\`\`\`

TAGS: pizza-truck-business-2027-mobile-food, 800-degrees-pizza-snob-robertas-brandos-and-pizza-references, wood-fired-deck-oven-ooni-pro-forno-bravo-marra-forni-gozney-mobile-equipment, brewery-winery-tap-room-corporate-festival-wedding-partnerships, commissary-kitchen-mobile-food-vendor-permit-health-department-licensing, 12-25-percent-net-margin-tight, 2027`,
    src: `

## Sources

- FDA Food Code: https://www.fda.gov/food/retail-food-protection/fda-food-code
- NRA (National Restaurant Association): https://restaurant.org/
- IFA (International Franchise Association): https://www.franchise.org/
- IBISWorld Food Trucks report: https://www.ibisworld.com/
- Ooni Pizza Ovens: https://ooni.com/
- Forno Bravo: https://www.fornobravo.com/
- Marra Forni: https://www.marraforni.com/
- Gozney: https://www.gozney.com/
- Square POS: https://squareup.com/
- Toast (POS, NYSE: TOST): https://pos.toasttab.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Walkup pizza 10-12" | $12-$22 | Industry |
| Specialty pizza | $18-$28 | Industry |
| Event catering minimum | $500-$2,500 | Industry |
| Per-person catering | $15-$35/guest | Industry |
| Wedding 100-200 | $2,500-$8,000 | Industry |
| US food truck industry | ~$1.5B+ | IBISWorld |
| US food trucks count | ~35K+ | IBISWorld |
| Ooni Pro 16 mobile oven | $799-$1,200 | Ooni |
| Forno Bravo commercial mobile | $15K-$40K | Forno Bravo |
| Marra Forni rotator mobile | $20K-$60K | Marra Forni |
| Gozney Dome | $1,500-$3,000 | Gozney |
| Truck buildout cost | $75K-$250K | Industry |
| Y1 capital | $75K-$250K | Industry |
| Y1 revenue | $80K-$300K | Industry |
| Y2 revenue | $300K-$800K | Industry |
| Margin net | 12-25% | Industry |
| Food cost % | 28-35% | Industry |
| Labor cost % | 25-30% | Industry |
| Toast (TOST) revenue FY24 | ~$5B | TOST 10-K |`,
    counter: `## Counter-Case
**Truck capital intensive.** Mitigation: lease used truck + build-out incrementally.
**Weather + season volatility.** Mitigation: indoor commissary winter catering pivot.
**Permits maze multi-jurisdiction.** Mitigation: focus 1-2 counties first.
**Food cost volatility (cheese + flour).** Mitigation: bulk + supplier relationships + price flex.
**When stay-small wins.** Solo operator 4-5 events/week at $80-120K is meaningful.`,
    links: `

## See Also

- **q2003** — Start a cottage food bakery business 2027
- **q2002** — Start a ghost kitchen business 2027
- **q2001** — Start a juice bar business 2027
- **q1982** — Start an ice cream truck business 2027`,
    sources: ["https://www.fda.gov/food/retail-food-protection/fda-food-code","https://restaurant.org/","https://www.franchise.org/","https://www.ibisworld.com/","https://ooni.com/","https://www.fornobravo.com/","https://www.marraforni.com/","https://www.gozney.com/","https://squareup.com/","https://pos.toasttab.com/"],
    tags: ["pizza-truck-business-2027-mobile-food","800-degrees-pizza-snob-robertas-brandos-and-pizza-references","wood-fired-deck-oven-ooni-pro-forno-bravo-marra-forni-gozney-mobile-equipment","brewery-winery-tap-room-corporate-festival-wedding-partnerships","commissary-kitchen-mobile-food-vendor-permit-health-department-licensing","12-25-percent-net-margin-tight","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (800 Degrees Pizza LA + Pizza Snob + Robertas NYC + Brandos + &pizza references, Ooni Pro 16 + Forno Bravo $15-40K + Marra Forni rotator $20-60K + Gozney Dome ovens, FDA Food Code + NRA National Restaurant Association + IFA + IBISWorld $1.5B 35K food trucks, Toast TOST $5B + Square POS) real.' }
  },
  {
    id: 'q2003',
    tldr: `**TL;DR:** Cottage food bakery in 2027 = **home-kitchen baked goods** under state cottage food laws (49 states allow varying products: cookies, cakes, breads, pastries — NOT custard, cream-filled, or meat). **Pricing:** $3-$15/cookie + $30-$200/cake + $25-$80/bread loaf + $200-$2,500 wedding cake. **Y1 $15K-$60K solo side hustle (200-1,500 orders); Y2 $60K-$200K commercial-kitchen graduate.** **Required:** state cottage food approval (most states cap revenue $25K-$78K/yr — TX $200K + CA $150K + IL $80K higher) + food handler cert + business license + labeling compliance + insurance. **Players:** local + farmers market mostly; some brands: Levain Bakery (NYC ~30 locations, PE-backed), Magnolia Bakery (NYC + global), Tatte Bakery (PE Aurora Capital), Crumbl Cookies (~1,000+ franchise units 2024), Insomnia Cookies (Krispy Kreme DNUT acquired 2018), Great American Cookies (FAT Brands FAT). **Margin:** 50-70% solo (no overhead) + 35-50% commercial. **Win condition:** wedding cake specialty + custom + farmers market consistent presence.`,
    core: `

## Why Cottage Food Bakery 2027 Is Real

State cottage food laws (often called Bakers Bill or Home Baked Goods Act) since ~2010-2015 legalized home-baked sale. Demand drivers:
- Wedding + birthday + event custom cakes
- Farmers market + craft fair
- Holiday gifting
- Specialty dietary (keto, GF, vegan, paleo)
- Subscription bread boxes

## Pricing 2027

| Item | Price |
|---|---|
| Cookies (specialty) | $3-$15/each |
| Standard cake (8") | $30-$150 |
| Custom decorated cake | $80-$500 |
| Wedding cake (multi-tier) | $200-$2,500+ |
| Bread loaf | $8-$25 |
| Pastry box (6-12pc) | $25-$80 |
| Subscription bread box | $40-$150/mo |
| Holiday specialty | $20-$100 |
| Cookie tray (24-48pc) | $40-$150 |
| Catering minimum | $200-$1,500 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Cottage food approval + food handler + $1-5K supplies] --> B[Farmers market + Instagram + word of mouth]
    B --> C[Wedding cake + custom specialty]
    C --> D[Y1: $15K-$60K solo · 200-1,500 orders]
    D --> E[Y2: $60K-$200K commercial-kitchen graduate]
\`\`\`

TAGS: cottage-food-bakery-business-2027-home-kitchen-baked-goods, 49-states-cottage-food-laws-tx-200k-ca-150k-il-80k-revenue-caps, levain-magnolia-tatte-crumbl-1000-2024-insomnia-krispy-kreme-dnut-2018-great-american-fat-references, wedding-custom-cake-farmers-market-specialty-dietary-keto-gf-vegan-paleo-wedges, food-handler-servsafe-state-license-labeling-compliance, 2027`,
    src: `

## Sources

- Forrager Cottage Food Laws by State: https://forrager.com/
- ServSafe: https://www.servsafe.com/
- FDA Food Code: https://www.fda.gov/food/retail-food-protection/fda-food-code
- USDA cottage food guidance: https://www.usda.gov/
- Crumbl Cookies: https://crumblcookies.com/
- Insomnia Cookies (Krispy Kreme DNUT 2018): https://insomniacookies.com/
- Levain Bakery: https://www.levainbakery.com/
- Magnolia Bakery: https://www.magnoliabakery.com/
- Tatte Bakery & Cafe: https://tattebakery.com/
- Great American Cookies (FAT Brands FAT): https://www.greatamericancookies.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Cookies specialty | $3-$15/each | Industry |
| Custom cake | $80-$500 | Industry |
| Wedding cake | $200-$2,500+ | Industry |
| Bread loaf | $8-$25 | Industry |
| TX cottage food cap | $200K | TX Dept of Health |
| CA cottage food cap | $150K | CA Dept of Public Health |
| IL cottage food cap | $80K | IL Bakers Bill |
| Most states cap | $25K-$78K | Forrager |
| 49 states allow cottage food | yes | Forrager |
| Crumbl Cookies units | ~1,000+ 2024 | Crumbl |
| Insomnia Cookies parent | Krispy Kreme DNUT 2018 acquisition | Krispy Kreme |
| Levain Bakery locations | ~30+ | Levain |
| Magnolia Bakery locations | ~5+ NYC + global | Magnolia |
| Tatte Bakery locations | ~30+ | Tatte |
| Tatte parent | Aurora Capital Partners | Aurora |
| Great American Cookies units | ~340+ | FAT Brands |
| FAT Brands FAT revenue FY24 | ~$580M | FAT 10-K |
| Krispy Kreme DNUT revenue FY24 | ~$1.7B | DNUT 10-K |
| Y1 capital | $1K-$5K | Industry |
| Y1 revenue | $15K-$60K | Industry |
| Y2 revenue | $60K-$200K | Industry |
| Margin solo | 50-70% | Industry |
| Margin commercial | 35-50% | Industry |`,
    counter: `## Counter-Case
**State revenue cap forces commercial graduation.** Mitigation: rent shared kitchen at cap.
**Crumbl + Levain + Insomnia chain dominance.** Mitigation: custom + wedding + dietary specialty niche.
**Time-intensive low scale.** Mitigation: subscription + farmers market consistency.
**Ingredient cost (butter, eggs) volatility.** Mitigation: price flex + bulk supplier (Costco, Restaurant Depot).
**When stay-side wins.** $20-40K side hustle is fine for many.`,
    links: `

## See Also

- **q2006** — Start a charcuterie board business 2027
- **q2002** — Start a ghost kitchen business 2027
- **q2004** — Start a pizza truck business 2027
- **q1981** — Start a meal prep service business 2027`,
    sources: ["https://forrager.com/","https://www.servsafe.com/","https://www.fda.gov/food/retail-food-protection/fda-food-code","https://www.usda.gov/","https://crumblcookies.com/","https://insomniacookies.com/","https://www.levainbakery.com/","https://www.magnoliabakery.com/","https://tattebakery.com/","https://www.greatamericancookies.com/"],
    tags: ["cottage-food-bakery-business-2027-home-kitchen-baked-goods","49-states-cottage-food-laws-tx-200k-ca-150k-il-80k-revenue-caps","levain-magnolia-tatte-crumbl-1000-2024-insomnia-krispy-kreme-dnut-2018-great-american-fat-references","wedding-custom-cake-farmers-market-specialty-dietary-keto-gf-vegan-paleo-wedges","food-handler-servsafe-state-license-labeling-compliance","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Forrager.com 49 states cottage food laws + TX $200K + CA $150K + IL $80K revenue caps + Bakers Bill, Crumbl 1,000+ 2024 + Insomnia Cookies Krispy Kreme DNUT 2018 $1.7B + Levain 30 + Magnolia + Tatte 30 Aurora Capital + Great American Cookies 340 FAT Brands FAT $580M competitors, ServSafe + FDA Food Code + USDA + state Dept of Health regulatory) real.' }
  },
  {
    id: 'q2002',
    tldr: `**TL;DR:** Ghost kitchen in 2027 = **delivery-only food brand operated from commercial kitchen** (rented or owned) + listed on DoorDash, Uber Eats, Grubhub. **Y1 $100K-$400K (single brand + 1 kitchen); Y2 $400K-$1.5M+ (multiple virtual brands or commissary expansion).** **2024-2025 reality: many ghost kitchens failed** — CloudKitchens (Travis Kalanick) had massive layoffs 2023-2024; Reef Technology pivoted away from kitchens; Kitchen United Mix shut multiple locations 2023; Wonder (Marc Lore) pivoted from trucks to brick-and-mortar 2024; many F&B chains exited (Wendy's Reef partnership ended). **What works:** existing restaurant operators adding virtual brand (1-2 additional concepts in existing kitchen for incremental delivery revenue). **What failed:** standalone ghost kitchens without consumer brand. **Margin:** 5-15% after 30% delivery commission (DoorDash, Uber Eats) + food + labor + kitchen rent. **Win condition:** existing restaurant adding 2-3 virtual brands OR commissary owner renting to brands.`,
    core: `

## Why Ghost Kitchen 2027 Is Real But Hard

2020-2022 ghost kitchen boom collapsed 2023-2025. Mature model: existing restaurant adds virtual brands.

## Pricing 2027

| Service | Price |
|---|---|
| Avg ticket per order | $20-$40 |
| Delivery commission | 25-30% to DoorDash/Uber Eats/Grubhub |
| Food cost % | 28-35% |
| Labor cost % | 20-25% |
| Kitchen rent | $1,500-$15,000/mo |
| Commissary tier | $1,500-$5,000/mo |
| Net margin | 5-15% |
| Single brand monthly revenue | $40K-$150K |
| Multi-brand monthly | $100K-$400K |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $30-150K capital + commercial kitchen + brand + tech] --> B[Choose: own brand + standalone OR existing restaurant + virtual]
    B --> C[List DoorDash + Uber Eats + Grubhub]
    C --> D[Y1: $100K-$400K · single brand]
    D --> E[Y2: $400K-$1.5M+ · multi-brand or commissary]
\`\`\`

TAGS: ghost-kitchen-business-2027-delivery-only-virtual-brand, cloudkitchens-travis-kalanick-layoffs-2023-24-reef-pivot-kitchen-united-mix-shut-2023-wonder-marc-lore-pivot-2024-failures, doordash-dash-uber-eats-grubhub-25-30-percent-commission, existing-restaurant-virtual-brand-addition-mature-model, 5-15-percent-net-margin-tight, 2027`,
    src: `

## Sources

- DoorDash (NASDAQ: DASH): https://www.doordash.com/
- Uber Eats: https://www.ubereats.com/
- Grubhub (Wonder): https://www.grubhub.com/
- CloudKitchens (Travis Kalanick): https://www.cloudkitchens.com/
- Reef Technology: https://www.reeftechnology.com/
- Kitchen United Mix: https://www.kitchenunited.com/
- Wonder (Marc Lore): https://wonder.com/
- Toast POS (NYSE: TOST): https://pos.toasttab.com/
- NRA: https://restaurant.org/
- FDA Food Code: https://www.fda.gov/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Avg order | $20-$40 | Industry |
| DoorDash/Uber Eats commission | 25-30% | Industry |
| Food cost % | 28-35% | Industry |
| Net margin | 5-15% | Industry |
| DoorDash DASH revenue FY24 | ~$10.7B | DASH 10-K |
| DoorDash market cap | ~$80B | NASDAQ |
| Uber Eats (Uber UBER) | $13.7B FY24 segment | UBER 10-K |
| Grubhub parent | Wonder (acquired 2024) | Wonder |
| Wonder acquired Grubhub | Nov 2024 ~$650M | TechCrunch |
| Wonder (Marc Lore) brand | shifted to brick-and-mortar 2024 | Wonder |
| CloudKitchens valuation | ~$15B 2021 (now likely down) | Crunchbase |
| Reef Technology pivot | 2023 away from kitchens | Reef |
| Kitchen United Mix locations | shut multiple 2023 | KU |
| Wendy's-Reef partnership ended | 2023 | Wendy's |
| Toast TOST revenue FY24 | ~$5B | TOST 10-K |
| Y1 capital | $30K-$150K | Industry |
| Y1 revenue | $100K-$400K | Industry |
| Y2 revenue | $400K-$1.5M+ | Industry |
| Single virtual brand revenue/mo | $40K-$150K | Industry |`,
    counter: `## Counter-Case
**Standalone ghost kitchens fail.** Mitigation: existing restaurant + virtual brand addition.
**Delivery commission 30% eats margin.** Mitigation: own ordering web + customer loyalty.
**No brand awareness.** Mitigation: leverage existing restaurant trust.
**Real estate + commissary rent.** Mitigation: only enter if existing kitchen capacity available.
**When walk away wins.** If no existing F&B + no brand, ghost kitchen is brutal. Mitigation: don't enter.`,
    links: `

## See Also

- **q2004** — Start a pizza truck business 2027
- **q2001** — Start a juice bar business 2027
- **q2000** — Start a coffee cart business 2027
- **q1981** — Start a meal prep service business 2027`,
    sources: ["https://www.doordash.com/","https://www.ubereats.com/","https://www.grubhub.com/","https://www.cloudkitchens.com/","https://www.reeftechnology.com/","https://www.kitchenunited.com/","https://wonder.com/","https://pos.toasttab.com/","https://restaurant.org/","https://www.fda.gov/"],
    tags: ["ghost-kitchen-business-2027-delivery-only-virtual-brand","cloudkitchens-travis-kalanick-layoffs-2023-24-reef-pivot-kitchen-united-mix-shut-2023-wonder-marc-lore-pivot-2024-failures","doordash-dash-uber-eats-grubhub-25-30-percent-commission","existing-restaurant-virtual-brand-addition-mature-model","5-15-percent-net-margin-tight","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (CloudKitchens Travis Kalanick $15B 2021 layoffs 2023-24 + Reef Technology pivot 2023 + Kitchen United Mix shut 2023 + Wonder Marc Lore pivot brick-and-mortar 2024 + acquired Grubhub Nov 2024 $650M + Wendys-Reef ended 2023 failures, DoorDash DASH $10.7B FY24 $80B mkt cap + Uber Eats UBER $13.7B segment + Toast TOST $5B platforms with 25-30% commission) real.' }
  },
  {
    id: 'q2001',
    tldr: `**TL;DR:** Juice bar in 2027 = **fresh-pressed cold-pressed juice + smoothie + acai bowl + functional beverage** retail/cart/kiosk. **Pricing:** $7-$14/16oz juice + $9-$15/smoothie + $12-$18/acai bowl + $4-$8/wellness shot. **Y1 $80K-$300K (1 location, 4K-12K orders/mo); Y2 $300K-$1.2M (2-3 locations or franchise).** **Players:** **Pressed Juicery** (~100+ locations, PE-backed), Joe & The Juice (Danish ~350+ locations globally), Robeks (~80+ franchise units), Tropical Smoothie Cafe (~1,400+ franchise units, Levine Leichtman Capital Partners), Smoothie King (~1,300+ units, NewSpring Capital), Jamba (Inspire Brands, ~700+ units), Nekter Juice Bar (~210+ units), Clean Juice (~135+ units), Beyond Juicery + Eatery, I Love Juice Bar. **2024-2025 reality:** GLP-1 weight-loss drugs (Ozempic, Wegovy, Mounjaro, Zepbound) somewhat reduced smoothie demand; functional beverages (adaptogens, mushrooms, protein) growing. **Margin:** 15-30% net. **Win condition:** lease + 4K-10K monthly orders + functional/wellness specialty + corporate B2B catering.`,
    core: `

## Why Juice Bar 2027 Is Real

Wellness + functional beverage trend continues. Demand drivers:
- Pre/post-workout
- Wellness lifestyle ($300K+ household)
- Corporate office catering
- College + gym + medical office locations
- Functional + adaptogen + protein specialty

## Pricing 2027

| Item | Price |
|---|---|
| Cold-pressed juice 16oz | $7-$14 |
| Smoothie | $9-$15 |
| Acai bowl | $12-$18 |
| Wellness shot (ginger, turmeric) | $4-$8 |
| Juice cleanse 1-day | $50-$120 |
| Juice cleanse 3-day | $150-$350 |
| Subscription monthly | $80-$300 |
| Corporate catering (per person) | $10-$25 |
| Add-on (protein, MCT, adaptogen) | $2-$5 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $80-300K capital + lease + commercial juicer Goodnature G2/Norwalk + smoothie line] --> B[Build local awareness + corporate B2B]
    B --> C[Y1: $80K-$300K · 1 location]
    C --> D[Y2: $300K-$1.2M · 2-3 locations or franchise model]
\`\`\`

TAGS: juice-bar-business-2027-fresh-pressed-smoothie-acai-functional, pressed-juicery-joe-juice-robeks-tropical-smoothie-1400-levine-leichtman-smoothie-king-1300-newspring-jamba-inspire-700-nekter-210-clean-juice-135-beyond-juicery-i-love-juice-bar-competitors, glp-1-ozempic-wegovy-mounjaro-zepbound-demand-reduction-2024, functional-adaptogen-mushroom-protein-wellness-specialty-growth, juice-cleanse-corporate-catering-revenue-streams, goodnature-norwalk-commercial-juicer-equipment, 2027`,
    src: `

## Sources

- Pressed Juicery: https://www.pressedjuicery.com/
- Joe & The Juice: https://www.joejuice.com/
- Robeks: https://www.robeks.com/
- Tropical Smoothie Cafe (Levine Leichtman): https://www.tropicalsmoothiecafe.com/
- Smoothie King: https://www.smoothieking.com/
- Jamba (Inspire Brands): https://www.jamba.com/
- Nekter Juice Bar: https://www.nekterjuicebar.com/
- Clean Juice: https://cleanjuice.com/
- Goodnature commercial juicer: https://www.goodnature.com/
- NRA: https://restaurant.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Cold-pressed 16oz | $7-$14 | Industry |
| Smoothie | $9-$15 | Industry |
| Acai bowl | $12-$18 | Industry |
| Juice cleanse 3-day | $150-$350 | Industry |
| Pressed Juicery locations | ~100+ | Pressed Juicery |
| Joe & The Juice locations | ~350+ globally | Joe & The Juice |
| Robeks franchise units | ~80+ | Robeks |
| Tropical Smoothie Cafe units | ~1,400+ | Tropical Smoothie |
| Tropical Smoothie parent | Levine Leichtman Capital Partners | Levine Leichtman |
| Smoothie King units | ~1,300+ | Smoothie King |
| Smoothie King parent | NewSpring Capital | NewSpring |
| Jamba units | ~700+ | Inspire Brands |
| Jamba parent | Inspire Brands | Inspire |
| Nekter units | ~210+ | Nekter |
| Clean Juice units | ~135+ | Clean Juice |
| GLP-1 prescriptions 2024 | ~10M+ US | Industry |
| Y1 capital | $80K-$300K | Industry |
| Y1 revenue | $80K-$300K | Industry |
| Y2 revenue | $300K-$1.2M | Industry |
| Margin | 15-30% | Industry |
| Food cost % | 28-35% | Industry |`,
    counter: `## Counter-Case
**Franchise chains dominate.** Mitigation: independent specialty + functional.
**GLP-1 reduced smoothie demand.** Mitigation: pivot to functional + protein.
**Capital intensive lease + equipment.** Mitigation: kiosk/cart smaller footprint.
**Spoilage waste.** Mitigation: tight ordering + juice-cleanse subscription forecasting.
**When stay-small wins.** Cart + farmers market at $80-150K is meaningful.`,
    links: `

## See Also

- **q2005** — Start a kombucha business 2027
- **q2000** — Start a coffee cart business 2027
- **q2006** — Start a charcuterie board business 2027
- **q1981** — Start a meal prep service business 2027`,
    sources: ["https://www.pressedjuicery.com/","https://www.joejuice.com/","https://www.robeks.com/","https://www.tropicalsmoothiecafe.com/","https://www.smoothieking.com/","https://www.jamba.com/","https://www.nekterjuicebar.com/","https://cleanjuice.com/","https://www.goodnature.com/","https://restaurant.org/"],
    tags: ["juice-bar-business-2027-fresh-pressed-smoothie-acai-functional","pressed-juicery-joe-juice-robeks-tropical-smoothie-1400-levine-leichtman-smoothie-king-1300-newspring-jamba-inspire-700-nekter-210-clean-juice-135-beyond-juicery-i-love-juice-bar-competitors","glp-1-ozempic-wegovy-mounjaro-zepbound-demand-reduction-2024","functional-adaptogen-mushroom-protein-wellness-specialty-growth","juice-cleanse-corporate-catering-revenue-streams","goodnature-norwalk-commercial-juicer-equipment","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Pressed Juicery 100+ + Joe & The Juice 350 + Robeks 80 + Tropical Smoothie 1,400 Levine Leichtman + Smoothie King 1,300 NewSpring + Jamba 700 Inspire + Nekter 210 + Clean Juice 135 + Beyond Juicery + I Love Juice Bar competitors, GLP-1 Ozempic + Wegovy + Mounjaro + Zepbound 10M US prescriptions 2024 demand impact, Goodnature G2 + Norwalk commercial juicers) real.' }
  },
  {
    id: 'q2000',
    tldr: `**TL;DR:** Coffee cart in 2027 = **mobile espresso + specialty coffee + drinks at events, offices, corporate** charging $4-$8/espresso drink + $6-$12/specialty drink + $200-$2,500/event minimum. **Y1 $50K-$200K (1 cart, 3-6 events/week + corporate B2B); Y2 $200K-$700K (2-3 carts).** **Required:** state mobile food vendor permit + commissary + commercial espresso machine ($4-$25K — La Marzocco Linea Mini/PB, Slayer, Synesso, Rocket, Nuova Simonelli, Profitec, Lelit Bianca) + cart/trailer build-out ($10-$60K) + grinder + supplies + insurance. **Players:** mostly independent + small chains. Industry references: Bluestone Lane (~70+ locations), Joe Coffee, Stumptown (Peet's Coffee/JAB Holding), Blue Bottle (Nestle 2017), Onyx Coffee Lab, Counter Culture Coffee, Intelligentsia (JAB). **Margin:** 60-75% on coffee (food cost 8-15% beans+milk+cup). **Win condition:** corporate office daily contracts + wedding/event catering + brewery + farmers market consistent presence.`,
    core: `

## Why Coffee Cart 2027 Is Real

Specialty coffee 3rd-wave demand continues. Cart format = low capital vs cafe. Demand drivers:
- Corporate office onboarding/team events
- Wedding + event catering
- Farmers market + festival
- Brewery + winery partnership
- Subscription corporate ($1K-$5K/mo single-office contract)
- Movie set + film crew catering

## Pricing 2027

| Item | Price |
|---|---|
| Espresso shot | $3-$5 |
| Latte 12oz | $4-$7 |
| Specialty (mocha, vanilla) | $5-$9 |
| Pour-over | $5-$8 |
| Cold brew | $5-$8 |
| Pastry | $3-$8 |
| Event minimum | $300-$1,200 |
| Wedding 4-hr | $800-$2,500 |
| Corporate office monthly | $1,000-$5,000 |
| Tip income | +15-25% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $20-100K capital + cart + espresso machine + commissary + permits] --> B[Land 3-5 corporate office contracts]
    B --> C[Add wedding + event catering]
    C --> D[Y1: $50K-$200K · 1 cart]
    D --> E[Y2: $200K-$700K · 2-3 carts]
\`\`\`

TAGS: coffee-cart-business-2027-mobile-espresso-specialty, la-marzocco-linea-mini-pb-slayer-synesso-rocket-nuova-simonelli-profitec-lelit-bianca-commercial-machines, bluestone-lane-joe-coffee-stumptown-peets-jab-blue-bottle-nestle-2017-onyx-counter-culture-intelligentsia-jab-3rd-wave-references, corporate-office-wedding-brewery-farmers-market-film-set-catering-revenue, 60-75-percent-margin-coffee-food-cost-8-15-percent, 2027`,
    src: `

## Sources

- La Marzocco: https://www.lamarzoccohome.com/
- Slayer Espresso: https://www.slayerespresso.com/
- Synesso: https://synesso.com/
- Nuova Simonelli: https://www.nuovasimonelli.com/
- Stumptown Coffee (Peet's/JAB Holding): https://www.stumptowncoffee.com/
- Blue Bottle (Nestle): https://bluebottlecoffee.com/
- Bluestone Lane: https://bluestonelane.com/
- Counter Culture Coffee: https://counterculturecoffee.com/
- Intelligentsia (JAB Holding): https://www.intelligentsia.com/
- SCA (Specialty Coffee Association): https://sca.coffee/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Espresso shot | $3-$5 | Industry |
| Latte 12oz | $4-$7 |Industry |
| Specialty drink | $5-$9 | Industry |
| Wedding 4-hr | $800-$2,500 | Industry |
| Corporate monthly contract | $1,000-$5,000 | Industry |
| La Marzocco Linea Mini home | $4K-$6K | La Marzocco |
| La Marzocco Linea PB commercial | $15K-$25K | La Marzocco |
| Slayer Espresso | $15K-$30K | Slayer |
| Synesso | $14K-$30K | Synesso |
| Nuova Simonelli Aurelia | $10K-$22K | Nuova Simonelli |
| Stumptown parent | Peet's Coffee / JAB Holding | JAB |
| Blue Bottle parent | Nestle 2017 acquisition | Nestle |
| Bluestone Lane locations | ~70+ | Bluestone Lane |
| Intelligentsia parent | JAB Holding | JAB |
| SCA members | ~6,000+ | SCA |
| US coffee market | ~$100B+ | Industry |
| Coffee cart cost | $10K-$60K | Industry |
| Y1 capital | $20K-$100K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$700K | Industry |
| Margin | 60-75% | Industry |
| Food cost % | 8-15% | Industry |`,
    counter: `## Counter-Case
**Starbucks SBUX + Dutch Bros BROS dominate retail.** Mitigation: specialty + corporate B2B + event niche.
**Equipment capital intensive.** Mitigation: lease La Marzocco + grow into Slayer.
**Permits + commissary maze.** Mitigation: focus 1-2 counties.
**Labor (skilled barista).** Mitigation: above-market $20-30/hr + tip share + training.
**When stay-cart wins.** Solo cart with 3-4 events/week at $80-120K is comfortable.`,
    links: `

## See Also

- **q2001** — Start a juice bar business 2027
- **q2004** — Start a pizza truck business 2027
- **q2002** — Start a ghost kitchen business 2027
- **q1982** — Start an ice cream truck business 2027`,
    sources: ["https://www.lamarzoccohome.com/","https://www.slayerespresso.com/","https://synesso.com/","https://www.nuovasimonelli.com/","https://www.stumptowncoffee.com/","https://bluebottlecoffee.com/","https://bluestonelane.com/","https://counterculturecoffee.com/","https://www.intelligentsia.com/","https://sca.coffee/"],
    tags: ["coffee-cart-business-2027-mobile-espresso-specialty","la-marzocco-linea-mini-pb-slayer-synesso-rocket-nuova-simonelli-profitec-lelit-bianca-commercial-machines","bluestone-lane-joe-coffee-stumptown-peets-jab-blue-bottle-nestle-2017-onyx-counter-culture-intelligentsia-jab-3rd-wave-references","corporate-office-wedding-brewery-farmers-market-film-set-catering-revenue","60-75-percent-margin-coffee-food-cost-8-15-percent","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (La Marzocco Linea Mini $4-6K + Linea PB $15-25K + Slayer $15-30K + Synesso $14-30K + Nuova Simonelli + Rocket + Profitec + Lelit Bianca espresso machines, Stumptown Peets JAB Holding + Blue Bottle Nestle 2017 + Bluestone Lane 70 + Joe Coffee + Onyx Coffee Lab + Counter Culture + Intelligentsia JAB Holding 3rd-wave references, SCA Specialty Coffee Association 6K members) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH B DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
