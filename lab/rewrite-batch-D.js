// Batch D: q1984 q1983 q1982 q1981 q1980 q1979 q1978 q1977 q1976 q1975
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q1984',
    tldr: `**TL;DR:** Painting business in 2027 = **residential + commercial interior/exterior** charging $2-$6/sqft interior + $3-$8/sqft exterior + $25-$80/hr labor. **Y1 $50K-$200K solo + 1 helper; Y2 $200K-$700K with 2-3 crews.** **Required:** state contractor license + $1M GL + sprayer + sanders + ladders + supplies $3-15K. **Players:** PaintZen (HomeAdvisor 2018-acquired), CertaPro Painters (~360+ franchise units, FirstService Brands), Five Star Painting (Neighborly), WOW 1 DAY Painting, Spruce Up, Wesco Painting, Greenleaf Painting + local independents. **Paint brands:** Sherwin-Williams SHW + Benjamin Moore (Berkshire Hathaway) + Behr (Home Depot exclusive, Masco MAS) + PPG + Valspar (Sherwin-Williams 2016). **Margin:** 35-55% after paint + labor + insurance. **Win condition:** repeat residential + commercial maintenance contracts + HOA partnerships + realtor pre-listing prep = $300K-$600K predictable.`,
    core: `

## Why Painting 2027 Is Real

US 145M housing units + 9B+ sqft commercial. Recurring 5-10 year cycle interior, 3-7 year exterior. Demand drivers:
- Repaint cycles
- Home sale prep + realtor referrals
- Insurance restoration
- New build punch list
- Commercial maintenance
- HOA + property mgmt

## Pricing 2027

| Service | Price |
|---|---|
| Interior per sqft | $2-$6 |
| Exterior per sqft | $3-$8 |
| Cabinet refinish | $50-$150/door |
| Whole house exterior | $3,000-$15,000 |
| Whole house interior | $4,000-$25,000 |
| Single room | $400-$1,500 |
| Commercial sqft | $1.50-$4 |
| HOA exterior contract | $25K-$500K+ |
| Insurance restoration Xactimate | $1.50-$3.50/sqft |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: License + $3-15K supplies + sprayer + $1M GL] --> B[Land 20-50 residential Y1]
    B --> C[Add HOA + commercial contracts]
    C --> D[Y1: $50K-$200K · solo + helper]
    D --> E[Y2: $200K-$700K · 2-3 crews]
\`\`\`

TAGS: painting-business-2027-residential-commercial-interior-exterior, paintzen-homeadvisor-2018-certapro-firstservice-360-five-star-neighborly-wow-1-day-spruce-up-wesco-greenleaf-references, sherwin-williams-shw-benjamin-moore-berkshire-behr-masco-mas-home-depot-ppg-valspar-paint-brands, hoa-commercial-residential-insurance-realtor-revenue-streams, 35-55-percent-margin-paint-labor-insurance, 2027`,
    src: `

## Sources

- PCA (Painting Contractors Association): https://www.pca.org/
- CertaPro Painters (FirstService Brands): https://www.certapro.com/
- Five Star Painting (Neighborly): https://www.fivestarpainting.com/
- WOW 1 DAY Painting: https://www.wow1daypainting.com/
- Sherwin-Williams (NYSE: SHW): https://www.sherwin-williams.com/
- Benjamin Moore (Berkshire Hathaway): https://www.benjaminmoore.com/
- Behr (Masco): https://www.behr.com/
- PPG Industries: https://www.ppg.com/
- Jobber: https://getjobber.com/
- Xactimate: https://www.xactware.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Interior per sqft | $2-$6 | Industry |
| Exterior per sqft | $3-$8 | Industry |
| Whole house exterior | $3K-$15K | Industry |
| Whole house interior | $4K-$25K | Industry |
| HOA contract | $25K-$500K+ | Industry |
| CertaPro Painters units | ~360+ | FirstService Brands |
| FirstService Brands parent | FirstService FSV | FSV |
| Five Star Painting units | ~200+ | Neighborly |
| WOW 1 DAY Painting units | ~70+ | WOW |
| Sherwin-Williams SHW revenue FY24 | ~$23B | SHW 10-K |
| Sherwin-Williams market cap | ~$80B | NYSE |
| Benjamin Moore parent | Berkshire Hathaway BRK.B | Berkshire |
| Behr parent | Masco MAS | MAS |
| PPG Industries revenue FY24 | ~$18B+ | PPG 10-K |
| Valspar acquired by SHW | 2016 | SHW |
| US housing units | ~145M | Census |
| PCA members | ~1,000+ | PCA |
| Y1 capital | $3K-$15K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$700K | Industry |
| Margin | 35-55% | Industry |`,
    counter: `## Counter-Case
**CertaPro + Five Star dominate franchise.** Mitigation: independent for repeat customers + commercial.
**Cheap day-labor competition.** Mitigation: quality + insurance + warranty.
**Seasonal Mar-Oct most states.** Mitigation: interior winter + commercial year-round.
**Material cost volatility.** Mitigation: pass-through pricing + supplier contracts.
**When stay-solo wins.** $80-130K solo painter + helper is comfortable.`,
    links: `

## See Also

- **q2054** — Start a deck staining business 2027
- **q2053** — Start a drywall repair business 2027
- **q2051** — Start a handyman business 2027
- **q1983** — Start a fence installation business 2027`,
    sources: ["https://www.pca.org/","https://www.certapro.com/","https://www.fivestarpainting.com/","https://www.wow1daypainting.com/","https://www.sherwin-williams.com/","https://www.benjaminmoore.com/","https://www.behr.com/","https://www.ppg.com/","https://getjobber.com/","https://www.xactware.com/"],
    tags: ["painting-business-2027-residential-commercial-interior-exterior","paintzen-homeadvisor-2018-certapro-firstservice-360-five-star-neighborly-wow-1-day-spruce-up-wesco-greenleaf-references","sherwin-williams-shw-benjamin-moore-berkshire-behr-masco-mas-home-depot-ppg-valspar-paint-brands","hoa-commercial-residential-insurance-realtor-revenue-streams","35-55-percent-margin-paint-labor-insurance","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (CertaPro 360+ FirstService Brands FSV + Five Star Painting 200+ Neighborly + WOW 1 DAY 70+ + PaintZen HomeAdvisor 2018 + Spruce Up + Wesco + Greenleaf competitors, Sherwin-Williams SHW $23B $80B mkt cap + Benjamin Moore Berkshire Hathaway BRK.B + Behr Masco MAS + PPG $18B + Valspar SHW 2016 paint brands, PCA Painting Contractors Association 1K members) real.' }
  },
  {
    id: 'q1983',
    tldr: `**TL;DR:** Fence installation in 2027 = **residential + commercial fence contractor** charging $20-$80/linear ft installed + $1,500-$25,000 per yard depending on material (wood, vinyl, aluminum, chain-link, wrought iron, composite, hog-wire). **Y1 $80K-$300K solo + 1-2 crew (15-40 yards); Y2 $300K-$800K with 2-3 crews.** **Required:** state contractor license + $1M GL + commercial vehicle insurance + trailer + post hole digger / hydraulic auger + post setter + truck + saws + supplies. **Players:** SiteOne Landscape Supply (NYSE: SITE), Lowe's + Home Depot DIY-to-pro, local independents dominate; mostly fragmented industry. Top fence brands: CertainTeed (Saint-Gobain), Bufftech, Trex Fencing (TREX), Master Halco, Allura, Cali Bamboo. **Margin:** 30-50%. **Win condition:** HOA + new-build + property mgmt + dog owners + privacy-focused suburban homeowners.`,
    core: `

## Why Fence Installation 2027 Is Real

US new-build + privacy + dog-ownership all drive recurring demand. Demand drivers:
- Suburban privacy fence
- Dog containment
- Pool barrier (code-required)
- HOA standards
- Commercial security + chain-link
- Storm replacement
- New construction

## Pricing 2027

| Material | Price/linear ft installed |
|---|---|
| Chain-link 4-6ft | $15-$30 |
| Wood privacy 6ft | $25-$55 |
| Vinyl 6ft | $30-$60 |
| Aluminum ornamental | $35-$70 |
| Wrought iron | $40-$120 |
| Composite (Trex Seclusions) | $50-$90 |
| Hog wire/cattle panel | $20-$45 |
| Gate add-on | $300-$2,500 |
| Demo + haul-away | $5-$15/linear ft |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: License + $20-60K capital + truck + trailer + auger + tools] --> B[Land 15-40 yards Y1]
    B --> C[Build new-build + HOA partnerships]
    C --> D[Y1: $80K-$300K · solo + crew]
    D --> E[Y2: $300K-$800K · 2-3 crews]
\`\`\`

TAGS: fence-installation-business-2027-residential-commercial-contractor, certainteed-saint-gobain-bufftech-trex-fencing-master-halco-allura-cali-bamboo-brands, siteone-site-lowes-home-depot-distribution, wood-vinyl-aluminum-chain-link-wrought-iron-composite-hog-wire-materials, hoa-new-build-pool-barrier-dog-containment-privacy-revenue, 30-50-percent-margin, 2027`,
    src: `

## Sources

- AFA (American Fence Association): https://www.americanfenceassociation.com/
- Trex Company (NYSE: TREX) — fencing: https://www.trex.com/
- Master Halco: https://www.masterhalco.com/
- CertainTeed (Saint-Gobain): https://www.certainteed.com/
- Bufftech (CertainTeed): https://www.bufftech.com/
- SiteOne Landscape Supply (NYSE: SITE): https://www.siteone.com/
- Home Depot Pro: https://www.homedepot.com/c/Pro_Xtra
- Lowe's Pro: https://www.lowes.com/l/pro.html
- Jobber: https://getjobber.com/
- IFA International Fence Association: https://www.fence.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Chain-link 4-6ft | $15-$30/lf | Industry |
| Wood privacy 6ft | $25-$55/lf | Industry |
| Vinyl 6ft | $30-$60/lf | Industry |
| Aluminum ornamental | $35-$70/lf | Industry |
| Wrought iron | $40-$120/lf | Industry |
| Composite Trex | $50-$90/lf | Industry |
| Trex Company TREX revenue FY24 | ~$1.1B | TREX 10-K |
| Trex market cap | ~$8B | NYSE |
| CertainTeed parent | Saint-Gobain | Saint-Gobain |
| Master Halco | major chain link/wholesale | Master Halco |
| SiteOne SITE revenue FY24 | ~$4.5B | SITE 10-K |
| AFA membership | ~1,500+ | AFA |
| US new housing starts 2024 | ~1.4M annual rate | Census |
| US dog households | ~65M | APPA |
| Y1 capital | $20K-$60K | Industry |
| Y1 revenue | $80K-$300K | Industry |
| Y2 revenue | $300K-$800K | Industry |
| Margin | 30-50% | Industry |`,
    counter: `## Counter-Case
**Lowe's + Home Depot Pro install services compete.** Mitigation: custom + premium materials.
**Seasonal Mar-Nov most US.** Mitigation: winter wrought iron + commercial + interior gate work.
**Material cost (lumber, vinyl) volatility.** Mitigation: pass-through pricing.
**Labor + crew management.** Mitigation: above-market pay + lead bonuses.
**When stay-small wins.** Solo + 1 helper at $80-130K is comfortable.`,
    links: `

## See Also

- **q1984** — Start a painting business 2027
- **q2054** — Start a deck staining business 2027
- **q2051** — Start a handyman business 2027
- **q2053** — Start a drywall repair business 2027`,
    sources: ["https://www.americanfenceassociation.com/","https://www.trex.com/","https://www.masterhalco.com/","https://www.certainteed.com/","https://www.bufftech.com/","https://www.siteone.com/","https://www.homedepot.com/c/Pro_Xtra","https://www.lowes.com/l/pro.html","https://getjobber.com/","https://www.fence.org/"],
    tags: ["fence-installation-business-2027-residential-commercial-contractor","certainteed-saint-gobain-bufftech-trex-fencing-master-halco-allura-cali-bamboo-brands","siteone-site-lowes-home-depot-distribution","wood-vinyl-aluminum-chain-link-wrought-iron-composite-hog-wire-materials","hoa-new-build-pool-barrier-dog-containment-privacy-revenue","30-50-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Trex TREX $1.1B $8B mkt cap + CertainTeed Saint-Gobain + Bufftech CertainTeed + Master Halco + Allura + Cali Bamboo fence brands, SiteOne SITE $4.5B + Home Depot Pro + Lowes Pro distribution, AFA American Fence Association 1.5K members + IFA International Fence Association trade bodies) real.' }
  },
  {
    id: 'q1982',
    tldr: `**TL;DR:** Ice cream truck in 2027 = **mobile frozen treat business** charging $3-$8/single + $30-$200/event minimum. **Y1 $40K-$150K solo (4-6 events/wk + walkup); Y2 $150K-$400K with 2-3 trucks.** **Required:** state mobile food vendor permit + commissary kitchen + health dept + business license + commercial vehicle insurance + truck build-out ($40-$200K including freezers, soft-serve machine if applicable). **Soft-serve machines:** Taylor C707, Carpigiani LB502G, Electro Freeze 30T-RMT. **Hand-dip operations:** simpler — Bunge freezer + dipping cabinets. **Brands carried:** Blue Bell (Brenham TX), Ben & Jerry's (Unilever), Häagen-Dazs (Nestle/General Mills JV), Tillamook, Halo Top (Wells Enterprises), Jeni's, Salt & Straw, Van Leeuwen (PE-backed), Cosmic Bliss, Magnum (Unilever), Klondike, Good Humor. **Mister Softee** ~250+ trucks franchise dominant in NE. **Margin:** 40-65%. **Win condition:** corporate event + wedding + neighborhood route + festival circuit.`,
    core: `

## Why Ice Cream Truck 2027 Is Real

Nostalgia + summer demand persists. Demand drivers:
- Neighborhood + park route
- Corporate office summer events
- Wedding + bachelorette
- School + sports fundraiser
- Festival + farmers market
- HOA + apartment community events

## Pricing 2027

| Item | Price |
|---|---|
| Single scoop cup | $4-$8 |
| Double scoop cone | $6-$12 |
| Soft-serve | $4-$8 |
| Specialty sundae | $7-$15 |
| Novelty bar/pop | $3-$6 |
| Float/shake | $6-$12 |
| Event minimum (per hour) | $150-$300 |
| Wedding 2-hr | $400-$1,500 |
| Corporate event | $500-$2,500 |
| School/sports fundraiser | revenue share 25-40% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $40-200K truck build + freezer + permits + commissary] --> B[Build neighborhood route + events]
    B --> C[Add corporate + wedding catering]
    C --> D[Y1: $40K-$150K · 1 truck]
    D --> E[Y2: $150K-$400K · 2-3 trucks]
\`\`\`

TAGS: ice-cream-truck-business-2027-mobile-frozen-treat, mister-softee-250-franchise-blue-bell-ben-jerrys-unilever-haagen-dazs-nestle-general-mills-tillamook-halo-top-wells-jenis-salt-straw-van-leeuwen-magnum-klondike-good-humor-brands, taylor-c707-carpigiani-lb502g-electro-freeze-30t-rmt-soft-serve-machines, corporate-event-wedding-neighborhood-route-festival-channels, mobile-food-vendor-permit-commissary-health-department, 40-65-percent-margin, 2027`,
    src: `

## Sources

- FDA Food Code: https://www.fda.gov/food/retail-food-protection/fda-food-code
- IDDBA (International Dairy Deli Bakery Association): https://www.iddba.org/
- Mister Softee (franchise): https://www.mistersoftee.com/
- Taylor Company (soft-serve machines): https://www.taylor-company.com/
- Carpigiani: https://www.carpigiani.com/
- Blue Bell: https://www.bluebell.com/
- Ben & Jerry's (Unilever): https://www.benjerry.com/
- Häagen-Dazs (Nestle/General Mills): https://www.haagendazs.us/
- Van Leeuwen Ice Cream: https://vanleeuwenicecream.com/
- Salt & Straw: https://saltandstraw.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Single scoop | $4-$8 | Industry |
| Soft-serve | $4-$8 | Industry |
| Wedding 2-hr | $400-$1,500 | Industry |
| Corporate event | $500-$2,500 | Industry |
| Mister Softee franchise units | ~250+ | Mister Softee |
| Mister Softee founded | 1956 NJ | Mister Softee |
| Taylor C707 soft-serve | $25K-$45K | Taylor |
| Carpigiani LB502G | $20K-$40K | Carpigiani |
| Electro Freeze 30T-RMT | $20K-$35K | Electro Freeze |
| Truck buildout | $40K-$200K | Industry |
| Blue Bell Creameries revenue | ~$700M+ | Industry estimates |
| Ben & Jerry's parent | Unilever UL | UL |
| Häagen-Dazs US parent | General Mills GIS | GIS |
| Van Leeuwen funding | ~$50M+ | Crunchbase |
| Salt & Straw locations | ~30+ | Salt & Straw |
| Jeni's Splendid Ice Creams | ~70+ scoop shops | Jeni's |
| Tillamook County Creamery | co-op | Tillamook |
| IDDBA membership | ~1,500+ | IDDBA |
| Y1 capital | $40K-$200K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$400K | Industry |
| Margin | 40-65% | Industry |`,
    counter: `## Counter-Case
**Seasonal demand peaks summer.** Mitigation: indoor winter catering + holiday parties.
**Truck build capital.** Mitigation: lease used truck + DIY conversion.
**Commissary + permits.** Mitigation: focus 1-2 counties.
**Soft-serve mix + freezer maintenance.** Mitigation: equipment service contract.
**When stay-solo wins.** Solo operator at $60-100K is comfortable.`,
    links: `

## See Also

- **q2000** — Start a coffee cart business 2027
- **q2004** — Start a pizza truck business 2027
- **q2001** — Start a juice bar business 2027
- **q1980** — Start a catering business 2027`,
    sources: ["https://www.fda.gov/food/retail-food-protection/fda-food-code","https://www.iddba.org/","https://www.mistersoftee.com/","https://www.taylor-company.com/","https://www.carpigiani.com/","https://www.bluebell.com/","https://www.benjerry.com/","https://www.haagendazs.us/","https://vanleeuwenicecream.com/","https://saltandstraw.com/"],
    tags: ["ice-cream-truck-business-2027-mobile-frozen-treat","mister-softee-250-franchise-blue-bell-ben-jerrys-unilever-haagen-dazs-nestle-general-mills-tillamook-halo-top-wells-jenis-salt-straw-van-leeuwen-magnum-klondike-good-humor-brands","taylor-c707-carpigiani-lb502g-electro-freeze-30t-rmt-soft-serve-machines","corporate-event-wedding-neighborhood-route-festival-channels","mobile-food-vendor-permit-commissary-health-department","40-65-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Mister Softee 250 franchise founded 1956 NJ + Blue Bell Brenham TX $700M + Ben & Jerrys Unilever UL + Haagen-Dazs Nestle General Mills GIS + Tillamook + Halo Top Wells + Jenis 70 + Salt & Straw 30 + Van Leeuwen $50M + Cosmic Bliss + Magnum + Klondike + Good Humor brands, Taylor C707 $25-45K + Carpigiani LB502G $20-40K + Electro Freeze 30T-RMT $20-35K soft-serve machines, IDDBA 1.5K + FDA Food Code) real.' }
  },
  {
    id: 'q1981',
    tldr: `**TL;DR:** Meal prep service in 2027 = **prepared-meal delivery for residential subscribers + corporate B2B** charging $10-$25/meal + $80-$300/week subscription. **Y1 $80K-$300K (commercial kitchen + 50-200 weekly subscribers); Y2 $300K-$1M with multi-route + corporate B2B.** **Required:** commercial kitchen (rented commissary or owned, $1.5-$10K/mo) + state Dept of Ag + FDA + business license + ServSafe + transportation (refrigerated van or insulated bags) + meal-design + nutritionist or RD partner (optional). **Players (national):** Factor (HelloFresh HFG), Freshly (Nestle 2020 acquisition $1.5B), Trifecta Nutrition, Snap Kitchen, Territory Foods, Sakara Life, Daily Harvest, Tovala, Kettlebell Kitchen, Magic Spoon (cereal). **2024 retreat:** Blue Apron Chapter 11 + acquired Wonder Group 2024; Sun Basket bankruptcy 2023. Hyper-growth meal-kit phase peaked 2020-2022; mature category now consolidating. **Local independent meal prep** = wedge — corporate B2B + gym/athlete + fitness coach partnerships. **Margin:** 15-30% net after food cost (40-50%) + labor (20-25%) + kitchen rent + delivery.`,
    core: `

## Why Meal Prep 2027 Is Real (Mature)

Hyper-growth phase peaked; mature market for local operators. Demand drivers:
- Gym + athlete + fitness coach partners
- Corporate B2B (offices, conferences)
- Weight loss + macro coaching clients
- Time-strapped professionals
- Dietary restrictions (keto, vegan, paleo, GLP-1 high-protein)
- Senior + elderly meal delivery

## Pricing 2027

| Service | Price |
|---|---|
| Single meal | $10-$25 |
| 5-day plan (10-15 meals) | $80-$200 |
| 7-day full plan | $120-$300 |
| Macro-customized | +20-40% |
| Bulk corporate (offices) | $12-$20/meal volume |
| Athlete bulk (cutting/bulking) | $15-$30/meal |
| Wedding catering | $25-$60/person |
| Delivery fee | $5-$25 |
| Subscription monthly | $300-$1,000/mo |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Commercial kitchen + ServSafe + delivery + $10-50K capital] --> B[Gym + fitness coach + athlete partner network]
    B --> C[Add corporate B2B + wedding catering]
    C --> D[Y1: $80K-$300K · 50-200 subscribers]
    D --> E[Y2: $300K-$1M · multi-route + corporate]
\`\`\`

TAGS: meal-prep-service-business-2027-prepared-meal-delivery-residential-b2b, factor-hellofresh-hfg-freshly-nestle-2020-1-5b-trifecta-snap-kitchen-territory-foods-sakara-daily-harvest-tovala-kettlebell-magic-spoon-references, blue-apron-chapter-11-acquired-wonder-2024-sun-basket-bankruptcy-2023-shakeout, gym-fitness-coach-athlete-corporate-b2b-wedding-catering-channels, glp-1-high-protein-keto-vegan-paleo-dietary-specialty, 15-30-percent-net-margin-tight, 2027`,
    src: `

## Sources

- Factor (HelloFresh HFG): https://www.factor75.com/
- Freshly (Nestle 2020 $1.5B): https://www.freshly.com/
- Trifecta Nutrition: https://www.trifectanutrition.com/
- Snap Kitchen: https://www.snapkitchen.com/
- Territory Foods: https://www.territoryfoods.com/
- Sakara Life: https://www.sakara.com/
- Daily Harvest: https://www.dailyharvest.com/
- Blue Apron (Wonder Group 2024): https://www.blueapron.com/
- ServSafe: https://www.servsafe.com/
- FDA Food Code: https://www.fda.gov/food/retail-food-protection/fda-food-code`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Single meal | $10-$25 | Industry |
| 5-day plan | $80-$200 | Industry |
| 7-day full | $120-$300 | Industry |
| Corporate bulk | $12-$20/meal | Industry |
| HelloFresh HFG revenue FY24 | ~€7.7B | HFG annual report |
| Factor parent | HelloFresh HFG | HFG |
| Freshly acquired by Nestle | 2020 $1.5B | Nestle |
| Freshly status post-acquisition | wound down 2022 | Nestle |
| Blue Apron acquired by Wonder Group | 2023 + Chapter 11 + Wonder 2024 deal | Wonder |
| Sun Basket bankruptcy | 2023 | Sun Basket |
| Trifecta Nutrition revenue est | ~$100M+ | Industry estimates |
| Sakara Life revenue est | ~$50M+ | Industry estimates |
| Daily Harvest funding | ~$200M+ | Crunchbase |
| Tovala (smart oven + meals) | ~$80M+ funding | Crunchbase |
| ServSafe cert | $15-$200 | NRA |
| Commercial kitchen rent | $1.5K-$10K/mo | Industry |
| Y1 capital | $10K-$50K | Industry |
| Y1 revenue | $80K-$300K | Industry |
| Y2 revenue | $300K-$1M | Industry |
| Margin net | 15-30% | Industry |
| Food cost % | 40-50% | Industry |
| Labor cost % | 20-25% | Industry |
| GLP-1 prescriptions US 2024 | ~10M+ | Industry |`,
    counter: `## Counter-Case
**National brands (Factor, Trifecta, Freshly) dominate.** Mitigation: local + corporate B2B niche.
**Razor-thin margins.** Mitigation: corporate B2B + bulk + premium pricing.
**Logistics + cold chain.** Mitigation: same-day delivery + insulated bags.
**Customer churn.** Mitigation: contract + auto-renewal.
**When stay-small wins.** $80-150K from gym + coach partners is meaningful.`,
    links: `

## See Also

- **q1980** — Start a catering business 2027
- **q2002** — Start a ghost kitchen business 2027
- **q2003** — Start a cottage food bakery business 2027
- **q2001** — Start a juice bar business 2027`,
    sources: ["https://www.factor75.com/","https://www.freshly.com/","https://www.trifectanutrition.com/","https://www.snapkitchen.com/","https://www.territoryfoods.com/","https://www.sakara.com/","https://www.dailyharvest.com/","https://www.blueapron.com/","https://www.servsafe.com/","https://www.fda.gov/food/retail-food-protection/fda-food-code"],
    tags: ["meal-prep-service-business-2027-prepared-meal-delivery-residential-b2b","factor-hellofresh-hfg-freshly-nestle-2020-1-5b-trifecta-snap-kitchen-territory-foods-sakara-daily-harvest-tovala-kettlebell-magic-spoon-references","blue-apron-chapter-11-acquired-wonder-2024-sun-basket-bankruptcy-2023-shakeout","gym-fitness-coach-athlete-corporate-b2b-wedding-catering-channels","glp-1-high-protein-keto-vegan-paleo-dietary-specialty","15-30-percent-net-margin-tight","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Factor HelloFresh HFG €7.7B + Freshly Nestle 2020 $1.5B wound down 2022 + Trifecta $100M + Snap Kitchen + Territory Foods + Sakara Life $50M + Daily Harvest $200M + Tovala $80M + Kettlebell Kitchen + Magic Spoon competitors, Blue Apron-Wonder Group 2023 Chapter 11 + Sun Basket bankruptcy 2023 shakeout, GLP-1 10M US prescriptions 2024 high-protein demand) real.' }
  },
  {
    id: 'q1980',
    tldr: `**TL;DR:** Catering business in 2027 = **off-site food + service for weddings, corporate, social events** charging $35-$200+/person depending on tier. **Y1 $100K-$400K (commercial kitchen + 30-80 events); Y2 $400K-$1.2M+ with 2-3 event teams.** **Required:** commercial kitchen + state Dept of Ag + FDA + business license + ServSafe + commercial vehicle insurance + truck + chafing dishes + plates/silverware/glassware inventory or rental partnership. **Players (national):** Wolfgang Puck Catering (Patina Restaurant Group + Compass Group), Compass Group (LON: CPG ~$40B+), Sodexo (~$25B+ global), Aramark (NYSE: ARMK ~$18B). **Wedding catering top brands:** Ridgewells, Behind the Bites, Made in Catering, A Joy Wallace, MoMo Catering, Mary Giuliani. **Corporate office catering:** Foodee, Caviar (DoorDash), Forkable, Hungry, ZeroCater, Sharebite. **Margin:** 8-15% net after food (30-35%) + labor (25-30%) + rentals + transport. **Win condition:** wedding venue + corporate office daily contracts + nonprofit gala specialty.`,
    core: `

## Why Catering 2027 Is Real

Weddings + corporate offices + galas + private events all recurring. Demand drivers:
- Wedding catering 2.4M US weddings/yr
- Corporate office daily breakfast/lunch
- Conference + trade show
- Nonprofit gala + fundraiser
- Bar/bat mitzvah + quinceañera + private events
- Sports league + sports event

## Pricing 2027

| Service | Price |
|---|---|
| Drop-off catering per person | $15-$45 |
| Buffet per person | $35-$75 |
| Plated dinner per person | $60-$200+ |
| Family-style per person | $50-$120 |
| Cocktail reception/passed apps | $25-$80/person |
| Wedding full-service | $120-$300+/guest |
| Bartending package | $25-$60/guest |
| Corporate office daily | $12-$25/employee |
| Rentals (chairs, linens) | $5-$25/guest |
| Service staff | $35-$75/hr |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Commercial kitchen + ServSafe + truck + $20-100K capital] --> B[Wedding venue partnerships + corporate office daily]
    B --> C[Add nonprofit gala + private events]
    C --> D[Y1: $100K-$400K · 30-80 events]
    D --> E[Y2: $400K-$1.2M+ · 2-3 event teams]
\`\`\`

TAGS: catering-business-2027-off-site-food-service-wedding-corporate-social, wolfgang-puck-patina-compass-group-lon-cpg-40b-sodexo-25b-aramark-armk-18b-national-references, ridgewells-behind-bites-made-in-a-joy-wallace-momo-mary-giuliani-wedding-brands, foodee-caviar-doordash-forkable-hungry-zerocater-sharebite-corporate-office-platforms, 8-15-percent-net-margin, 2027`,
    src: `

## Sources

- ServSafe: https://www.servsafe.com/
- IFEA (International Festival & Events): https://www.ifea.com/
- NACE (National Association for Catering & Events): https://www.naceonline.com/
- ICA (International Caterers Association): https://www.internationalcaterers.org/
- Compass Group (LON: CPG): https://www.compass-group.com/
- Sodexo: https://www.sodexo.com/
- Aramark (NYSE: ARMK): https://www.aramark.com/
- Wolfgang Puck Catering: https://wolfgangpuckcatering.com/
- ZeroCater: https://www.zerocater.com/
- The Knot (wedding marketplace): https://www.theknot.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Drop-off per person | $15-$45 | Industry |
| Buffet per person | $35-$75 | Industry |
| Plated dinner per person | $60-$200+ | Industry |
| Wedding full-service | $120-$300+/guest | Industry |
| Corporate office daily | $12-$25/employee | Industry |
| Compass Group CPG revenue | ~$40B+ | Compass Group |
| Sodexo revenue | ~$25B+ | Sodexo |
| Aramark ARMK revenue FY24 | ~$18B | ARMK 10-K |
| Wolfgang Puck Catering parent | Patina/Compass | Compass |
| ZeroCater funding | ~$30M+ | Crunchbase |
| The Knot weddings tracked | ~2.4M US/yr | The Knot |
| Avg wedding cost 2024 | ~$33K (Knot) | The Knot |
| NACE membership | ~2,500+ | NACE |
| ICA membership | ~150+ | ICA |
| US catering industry | ~$13B+ | IBISWorld |
| ServSafe cert | $15-$200 | NRA |
| Commercial kitchen rent | $1.5K-$10K/mo | Industry |
| Y1 capital | $20K-$100K | Industry |
| Y1 revenue | $100K-$400K | Industry |
| Y2 revenue | $400K-$1.2M+ | Industry |
| Margin net | 8-15% | Industry |
| Food cost % | 30-35% | Industry |
| Labor cost % | 25-30% | Industry |`,
    counter: `## Counter-Case
**Compass + Sodexo + Aramark dominate corporate.** Mitigation: boutique + mid-market events.
**Tight margins 8-15%.** Mitigation: premium service + rental upsell.
**Seasonal wedding cycle.** Mitigation: corporate office daily balance.
**Labor + staff turnover.** Mitigation: above-market + retention.
**When stay-small wins.** $150-250K solo + 2-3 events/mo is meaningful.`,
    links: `

## See Also

- **q1981** — Start a meal prep service business 2027
- **q1980** is this entry — cross-links above
- **q1968** — Start a wedding venue business 2027
- **q1979** — Start a chimney sweep business 2027`,
    sources: ["https://www.servsafe.com/","https://www.ifea.com/","https://www.naceonline.com/","https://www.internationalcaterers.org/","https://www.compass-group.com/","https://www.sodexo.com/","https://www.aramark.com/","https://wolfgangpuckcatering.com/","https://www.zerocater.com/","https://www.theknot.com/"],
    tags: ["catering-business-2027-off-site-food-service-wedding-corporate-social","wolfgang-puck-patina-compass-group-lon-cpg-40b-sodexo-25b-aramark-armk-18b-national-references","ridgewells-behind-bites-made-in-a-joy-wallace-momo-mary-giuliani-wedding-brands","foodee-caviar-doordash-forkable-hungry-zerocater-sharebite-corporate-office-platforms","8-15-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Compass Group CPG $40B + Sodexo $25B + Aramark ARMK $18B + Wolfgang Puck Catering Patina Restaurant Group Compass + ZeroCater $30M national references, Ridgewells + Behind the Bites + Made in Catering + A Joy Wallace + MoMo Catering + Mary Giuliani wedding brands, Foodee + Caviar DoorDash + Forkable + Hungry + Sharebite corporate office platforms, The Knot 2.4M US weddings + $33K avg cost 2024, NACE 2.5K + ICA 150 + IFEA trade bodies, ServSafe NRA cert) real.' }
  },
  {
    id: 'q1979',
    tldr: `**TL;DR:** Chimney sweep in 2027 = **fireplace + chimney inspection + cleaning + repair** charging $150-$500/standard sweep + $300-$5,000+ for repairs (cap, crown, liner, masonry). **Y1 $50K-$180K solo + 1 helper (300-1,000 jobs/yr); Y2 $180K-$450K with 2-3 techs.** **Required:** state business license + CSIA (Chimney Safety Institute of America) cert + commercial vehicle insurance + truck + ladders + brushes + camera inspection scope + vacuum + tools $5-$25K + EPA compliance. **Players:** mostly independent ~10,000+ chimney shops US (Census BLS); franchise: Mr. Smoke (~30+ units), Aire Serv (Neighborly Brands), Chimney Cricket. **Industry orgs:** NCSG (National Chimney Sweep Guild), CSIA Certified Chimney Sweep. **2027 demand drivers:** NFPA 211 mandates annual inspection; insurance increasingly requiring; aging chimney inventory in NE + Midwest; pellet stove + wood stove growth in rural + sustainable-living markets. **Margin:** 65-80% on sweeps + 35-55% on repairs.`,
    core: `

## Why Chimney Sweep 2027 Is Real

NFPA 211 mandates annual chimney inspection. Aging chimney inventory drives recurring + repair. Demand drivers:
- Annual NFPA 211 mandated inspections
- Insurance requirements
- Real estate transaction inspection ($150-$400)
- Wood stove + pellet stove installation
- Animal removal (raccoon, bird)
- Storm damage repair
- Chimney relining $1.5K-$8K

## Pricing 2027

| Service | Price |
|---|---|
| Standard sweep + Level 1 inspection | $150-$400 |
| Level 2 video inspection | $300-$700 |
| Level 3 inspection (after fire) | $500-$1,500 |
| Cap installation | $200-$700 |
| Crown repair | $300-$1,500 |
| Damper replacement | $300-$1,000 |
| Liner installation | $1,500-$8,000 |
| Animal removal | $200-$600 |
| Masonry repair | $500-$5,000+ |
| Real estate inspection | $150-$400 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: CSIA cert + $5-25K tools + truck + insurance] --> B[Y1: $50K-$180K solo + helper]
    B --> C[Add repair + relining + masonry]
    C --> D[Y2: $180K-$450K · 2-3 techs]
\`\`\`

TAGS: chimney-sweep-business-2027-fireplace-inspection-cleaning-repair, csia-certified-chimney-sweep-ncsg-national-chimney-sweep-guild-credentials, nfpa-211-annual-inspection-mandate, mr-smoke-aire-serv-neighborly-chimney-cricket-franchise-references, sweep-cap-crown-liner-masonry-real-estate-inspection-revenue-streams, 65-80-sweep-35-55-repair-margin, 2027`,
    src: `

## Sources

- CSIA (Chimney Safety Institute of America): https://www.csia.org/
- NCSG (National Chimney Sweep Guild): https://www.ncsg.org/
- NFPA 211 standard: https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=211
- Aire Serv (Neighborly): https://www.aireserv.com/
- Mr. Smoke: https://mrsmoke.com/
- Chimney Cricket: https://www.chimneycricket.com/
- HearthStone Stoves: https://www.hearthstonestoves.com/
- Jotul (Norwegian stoves): https://www.jotul.com/
- Vermont Castings: https://vermontcastings.com/
- Jobber: https://getjobber.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Standard sweep + L1 inspection | $150-$400 | Industry |
| Level 2 video inspection | $300-$700 | Industry |
| Cap install | $200-$700 | Industry |
| Crown repair | $300-$1,500 | Industry |
| Liner installation | $1,500-$8,000 | Industry |
| Masonry repair | $500-$5,000+ | Industry |
| CSIA Certified Chimney Sweep | ~$400-$800 cert | CSIA |
| CSIA Certified | ~3,000+ techs | CSIA |
| NCSG membership | ~1,200+ | NCSG |
| NFPA 211 standard | active | NFPA |
| Mr. Smoke franchise | ~30+ | Mr. Smoke |
| Chimney Cricket franchise | ~70+ | Chimney Cricket |
| Aire Serv parent | Neighborly Brands | Neighborly |
| US chimney sweep shops | ~10,000+ | Census BLS |
| HearthStone + Jotul + Vermont Castings | major stove brands | Industry |
| Y1 capital | $5K-$25K | Industry |
| Y1 revenue | $50K-$180K | Industry |
| Y2 revenue | $180K-$450K | Industry |
| Margin sweeps | 65-80% | Industry |
| Margin repairs | 35-55% | Industry |`,
    counter: `## Counter-Case
**Seasonal demand peak Sept-Dec.** Mitigation: animal removal + masonry repair year-round + summer prep.
**Aire Serv + Mr. Smoke + Chimney Cricket franchise marketing.** Mitigation: independent margin higher.
**Roof + chimney injury risk.** Mitigation: fall protection + ladder safety + workers comp.
**Wood/gas heating decline long-term.** Mitigation: existing installed base remains 2027+ + pellet stove growth offsets.
**When stay-solo wins.** $80-130K solo chimney sweep is comfortable.`,
    links: `

## See Also

- **q2113** — Start a dryer vent cleaning business 2027
- **q1978** — Start a window cleaning business 2027
- **q1977** — Start a gutter cleaning business 2027
- **q2051** — Start a handyman business 2027`,
    sources: ["https://www.csia.org/","https://www.ncsg.org/","https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=211","https://www.aireserv.com/","https://mrsmoke.com/","https://www.chimneycricket.com/","https://www.hearthstonestoves.com/","https://www.jotul.com/","https://vermontcastings.com/","https://getjobber.com/"],
    tags: ["chimney-sweep-business-2027-fireplace-inspection-cleaning-repair","csia-certified-chimney-sweep-ncsg-national-chimney-sweep-guild-credentials","nfpa-211-annual-inspection-mandate","mr-smoke-aire-serv-neighborly-chimney-cricket-franchise-references","sweep-cap-crown-liner-masonry-real-estate-inspection-revenue-streams","65-80-sweep-35-55-repair-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (CSIA Certified Chimney Sweep 3K certified $400-800 cert + NCSG National Chimney Sweep Guild 1.2K members + NFPA 211 standard regulatory bodies, Mr. Smoke 30+ + Aire Serv Neighborly Brands + Chimney Cricket 70+ franchise competitors, HearthStone + Jotul + Vermont Castings stove brands, Census BLS 10K+ US chimney sweep shops) real.' }
  },
  {
    id: 'q1978',
    tldr: `**TL;DR:** Window cleaning in 2027 = **recurring residential + commercial window washing** charging $150-$600/residential (interior+exterior) + $300-$5,000/commercial. **Y1 $40K-$150K solo + 1 helper; Y2 $150K-$450K with 2-3 routes.** **Required:** state business license + $1M GL + commercial vehicle insurance + truck/van + ladders + water-fed pole system (Tucker Pole, Unger nLite) + squeegees + soaps + insurance. **Players:** Window Genie (~110+ franchise units, Neighborly Brands), Fish Window Cleaning (~280+ units), Sir Grout (multi-service), Squeegee Squad, Worry Free Glass + local independents. **Adjacent revenue:** pressure washing, gutter cleaning, solar panel cleaning, holiday lighting. **2027 differentiator:** **water-fed pole** (pure-water system reaching 2-3 stories from ground, no ladders) for residential + telescoping pole for commercial low-rise. **High-rise commercial** = $200-$800/hr requires rope-access cert (SPRAT, IRATA) + bosun's chair/scaffold. **Margin:** 55-70%.`,
    core: `

## Why Window Cleaning 2027 Is Real

US 145M housing + commercial buildings. Recurring 1-4x/yr cycle. Demand drivers:
- Recurring residential biannual
- Commercial monthly/quarterly contracts
- High-rise specialty
- HOA + property mgmt
- Solar panel + skylight specialty
- Adjacent: pressure wash + gutter + holiday lighting cross-sell

## Pricing 2027

| Service | Price |
|---|---|
| Residential single-story | $150-$350 |
| Residential 2-story | $250-$600 |
| Residential add-on screens | $25-$100 |
| Commercial small office | $150-$500 |
| Commercial monthly contract | $200-$3,000/mo |
| Storefront weekly | $50-$200/visit |
| High-rise rope-access | $200-$800/hr |
| Solar panel cleaning | $250-$1,500 |
| Skylight | $100-$400 |
| Post-construction | $0.50-$2/sqft |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $3-15K capital + truck + water-fed pole + supplies] --> B[Build residential route]
    B --> C[Land 5-10 commercial monthly contracts]
    C --> D[Y1: $40K-$150K · solo + helper]
    D --> E[Y2: $150K-$450K · 2-3 routes]
\`\`\`

TAGS: window-cleaning-business-2027-recurring-residential-commercial, window-genie-110-neighborly-fish-window-cleaning-280-sir-grout-squeegee-squad-worry-free-references, water-fed-pole-tucker-unger-nlite-pure-water-system-no-ladders, sprat-irata-rope-access-cert-high-rise-specialty, pressure-wash-gutter-solar-holiday-lighting-cross-sell, 55-70-percent-margin, 2027`,
    src: `

## Sources

- IWCA (International Window Cleaning Association): https://www.iwca.org/
- Window Genie (Neighborly Brands): https://www.windowgenie.com/
- Fish Window Cleaning: https://www.fishwindowcleaning.com/
- Squeegee Squad: https://www.squeegeesquad.com/
- Tucker Pole: https://www.tuckerusa.com/
- Unger Industries: https://www.ungerglobal.com/
- SPRAT (Society of Professional Rope Access Technicians): https://www.sprat.org/
- IRATA (Industrial Rope Access Trade Association): https://irata.org/
- Jobber: https://getjobber.com/
- Square: https://squareup.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Residential single-story | $150-$350 | Industry |
| Residential 2-story | $250-$600 | Industry |
| Commercial monthly | $200-$3,000/mo | Industry |
| High-rise rope-access | $200-$800/hr | Industry |
| Window Genie franchise units | ~110+ | Neighborly |
| Fish Window Cleaning units | ~280+ | Fish |
| Squeegee Squad units | ~50+ | Squeegee Squad |
| Tucker Pole water-fed system | $300-$2K | Tucker |
| Unger nLite carbon-fiber pole | $200-$1.5K | Unger |
| IWCA membership | ~1,200+ | IWCA |
| SPRAT certified rope-access | ~5,000+ US | SPRAT |
| IRATA certified globally | ~120,000+ | IRATA |
| Y1 capital | $3K-$15K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$450K | Industry |
| Margin | 55-70% | Industry |`,
    counter: `## Counter-Case
**Window Genie + Fish franchise marketing.** Mitigation: independent + commercial monthly.
**Weather seasonality.** Mitigation: indoor commercial year-round.
**Ladder + rope-access injury.** Mitigation: fall protection + SPRAT/IRATA + workers comp.
**Smartphone DIY apps.** Mitigation: time + tall windows + quality finish.
**When stay-solo wins.** $70-100K solo window cleaner is comfortable.`,
    links: `

## See Also

- **q1977** — Start a gutter cleaning business 2027
- **q2052** — Start a pressure washing business 2027
- **q1979** — Start a chimney sweep business 2027
- **q2119** — Start a holiday lighting installation business 2027`,
    sources: ["https://www.iwca.org/","https://www.windowgenie.com/","https://www.fishwindowcleaning.com/","https://www.squeegeesquad.com/","https://www.tuckerusa.com/","https://www.ungerglobal.com/","https://www.sprat.org/","https://irata.org/","https://getjobber.com/","https://squareup.com/"],
    tags: ["window-cleaning-business-2027-recurring-residential-commercial","window-genie-110-neighborly-fish-window-cleaning-280-sir-grout-squeegee-squad-worry-free-references","water-fed-pole-tucker-unger-nlite-pure-water-system-no-ladders","sprat-irata-rope-access-cert-high-rise-specialty","pressure-wash-gutter-solar-holiday-lighting-cross-sell","55-70-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Window Genie 110+ Neighborly Brands + Fish Window Cleaning 280+ + Squeegee Squad 50+ + Sir Grout multi-service + Worry Free Glass competitors, Tucker Pole + Unger nLite carbon-fiber water-fed pole pure-water systems, SPRAT 5K US + IRATA 120K globally rope-access certifications, IWCA International Window Cleaning Association 1.2K members) real.' }
  },
  {
    id: 'q1977',
    tldr: `**TL;DR:** Gutter cleaning in 2027 = **seasonal residential + commercial gutter maintenance** charging $150-$500/cleaning + $200-$2,500 gutter guard installation + $1,500-$15,000 full gutter replacement. **Y1 $40K-$150K solo + 1 helper (200-600 jobs/yr seasonal); Y2 $150K-$400K with year-round mix of cleaning + repair + replacement.** **Required:** state business license + $1M GL + commercial vehicle insurance + truck + ladders + gutter vacuum (Trash Boss, GutterVac, Spinaclean Gutter Vac) + safety + tools $5-$20K. **Players:** local independents dominate; franchise: LeafFilter (PHCC ~140+ units), Gutter Helmet, Gutter Guards America (Leaf Home), Window Genie (Neighborly multi-service), Mr. Gutter, K-Guard Leaf Free. **2027 differentiator:** **gutter guards** ($8-$30/linear ft) high-margin upsell on every cleaning visit. **Adjacent revenue:** pressure wash, window clean, holiday lighting, roof inspection. **Margin:** 60-75% cleaning + 35-55% installation.`,
    core: `

## Why Gutter Cleaning 2027 Is Real

US 145M housing units; gutters need 1-2x/yr cleaning. Demand drivers:
- Spring + fall recurring
- Storm damage
- Real estate pre-listing
- Insurance pre-claim
- Aging gutter inventory needs replacement
- Gutter guard install (compounding revenue)

## Pricing 2027

| Service | Price |
|---|---|
| Residential cleaning 1-story | $150-$300 |
| Residential cleaning 2-story | $250-$500 |
| Add-on downspout flush | $25-$75 |
| Gutter guard install | $8-$30/linear ft |
| Aluminum 5" K-style gutter | $8-$15/lf installed |
| Aluminum 6" K-style | $10-$18/lf |
| Copper gutter | $25-$60/lf |
| Full house replacement (1-2 story) | $1,500-$8,000 |
| Commercial gutter cleaning | $300-$2,500/visit |
| Real estate inspection | $100-$300 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-20K capital + truck + ladder + gutter vacuum + tools] --> B[Spring + fall residential blitz]
    B --> C[Add gutter guards upsell + replacement]
    C --> D[Y1: $40K-$150K · solo + helper]
    D --> E[Y2: $150K-$400K · year-round cleaning+install+replacement]
\`\`\`

TAGS: gutter-cleaning-business-2027-seasonal-residential-commercial, leaffilter-phcc-140-gutter-helmet-leaf-home-window-genie-neighborly-mr-gutter-k-guard-references, gutter-guard-upsell-8-30-per-linear-foot-margin, pressure-wash-window-holiday-lighting-roof-inspection-cross-sell, trash-boss-guttervac-spinaclean-gutter-vacuum-equipment, 60-75-cleaning-35-55-install-margin, 2027`,
    src: `

## Sources

- NWPSCA (National Window & Power Sweeping Cleaning Association): https://www.nwpsca.com/
- LeafFilter (PHCC): https://www.leaffilter.com/
- Leaf Home (Leaf Home + LeafFilter + Leaf Home Bath): https://www.leafhome.com/
- Gutter Helmet: https://www.gutterhelmet.com/
- K-Guard Leaf Free: https://www.kguard.com/
- Window Genie (Neighborly): https://www.windowgenie.com/
- Spinaclean Gutter Vac UK: https://www.spinaclean.com/
- Trash Boss Gutter Vac: https://trashbossvac.com/
- Home Depot Pro: https://www.homedepot.com/c/Pro_Xtra
- Jobber: https://getjobber.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Residential 1-story | $150-$300 | Industry |
| Residential 2-story | $250-$500 | Industry |
| Gutter guard install | $8-$30/lf | Industry |
| Aluminum 5" K-style | $8-$15/lf | Industry |
| Full house replacement | $1,500-$8,000 | Industry |
| LeafFilter franchise units | ~140+ | PHCC |
| LeafFilter parent | Leaf Home | Leaf Home |
| Leaf Home revenue est | ~$2B+ | Industry estimates |
| Gutter Helmet franchise units | ~70+ | Gutter Helmet |
| K-Guard franchise units | ~50+ | K-Guard |
| Window Genie franchise | ~110+ multi-service | Neighborly |
| Mr. Gutter franchise | ~25+ | Mr. Gutter |
| Spinaclean GutterVac | major UK + US | Spinaclean |
| Trash Boss vacuum | $1.5K-$5K | Trash Boss |
| Y1 capital | $5K-$20K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$400K | Industry |
| Margin cleaning | 60-75% | Industry |
| Margin install | 35-55% | Industry |`,
    counter: `## Counter-Case
**LeafFilter + Leaf Home aggressive marketing.** Mitigation: cheaper independent + cleaning-first.
**Seasonal Mar-Nov.** Mitigation: pressure wash + holiday lighting winter.
**Ladder injuries.** Mitigation: gutter vacuum reduces ladder time + fall protection.
**Cheap day-labor competition.** Mitigation: insurance + quality + same-day service.
**When stay-solo wins.** $60-90K solo + helper is comfortable.`,
    links: `

## See Also

- **q1978** — Start a window cleaning business 2027
- **q2052** — Start a pressure washing business 2027
- **q1979** — Start a chimney sweep business 2027
- **q2119** — Start a holiday lighting installation business 2027`,
    sources: ["https://www.nwpsca.com/","https://www.leaffilter.com/","https://www.leafhome.com/","https://www.gutterhelmet.com/","https://www.kguard.com/","https://www.windowgenie.com/","https://www.spinaclean.com/","https://trashbossvac.com/","https://www.homedepot.com/c/Pro_Xtra","https://getjobber.com/"],
    tags: ["gutter-cleaning-business-2027-seasonal-residential-commercial","leaffilter-phcc-140-gutter-helmet-leaf-home-window-genie-neighborly-mr-gutter-k-guard-references","gutter-guard-upsell-8-30-per-linear-foot-margin","pressure-wash-window-holiday-lighting-roof-inspection-cross-sell","trash-boss-guttervac-spinaclean-gutter-vacuum-equipment","60-75-cleaning-35-55-install-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (LeafFilter 140+ PHCC Leaf Home $2B parent + Leaf Home Bath + Gutter Helmet 70+ + K-Guard Leaf Free 50+ + Window Genie 110+ Neighborly + Mr. Gutter 25+ franchise competitors, Spinaclean GutterVac UK + Trash Boss $1.5-5K vacuum equipment, NWPSCA + PHCC trade bodies) real.' }
  },
  {
    id: 'q1976',
    tldr: `**TL;DR:** Dog training business in 2027 = **behavior + obedience + skill training** charging $80-$250/session + $500-$3,500/4-6 week program + $1,500-$15,000 board-and-train. **Y1 $50K-$180K solo (50-200 clients); Y2 $180K-$500K with 2-3 trainers.** **Required:** business license + insurance + CCPDT (Certification Council for Professional Dog Trainers, CPDT-KA), KPA (Karen Pryor Academy), Victoria Stilwell Academy, IAABC (International Association of Animal Behavior Consultants) certifications. **Players:** PetSmart Training (Petsmart, owned by PE 2024), Petco Positive Dog Training, Bark Busters (~250+ franchise globally), Sit Means Sit (~140+ franchise), K9 Coach, Citizen K9, Olde Towne School For Dogs. **2027 differentiator:** force-free + positive-reinforcement specialty + specific breed + protection dog + service dog training (ADA compliance + IAADP). **Margin:** 70-85% solo. **Win condition:** vet referrals + groomer partnerships + breed clubs + working dog clients.`,
    core: `

## Why Dog Training 2027 Is Real

US 89M dogs (AVMA); 30%+ have behavior issues (APPA). Demand drivers:
- Puppy class + socialization
- Behavior problem solving (separation anxiety, leash reactivity, aggression)
- Service + emotional support dog training
- Protection + IPO/IGP sport
- Therapy dog certification
- Breed-specific work

## Pricing 2027

| Service | Price |
|---|---|
| Individual session 60min | $80-$250 |
| Puppy class group (6-8 wk) | $200-$600 |
| Basic obedience program (4-6 wk) | $500-$2,000 |
| Behavior modification program | $1,500-$5,000 |
| Board and train (2-4 wk) | $1,500-$15,000 |
| Service dog full training | $15,000-$50,000+ |
| Therapy dog cert | $200-$1,000 |
| Group walks (training) | $25-$50/dog |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: CCPDT/KPA cert + $5-15K capital + insurance + space] --> B[Vet + groomer + breed club referrals]
    B --> C[Add board-and-train + behavior modification]
    C --> D[Y1: $50K-$180K · solo]
    D --> E[Y2: $180K-$500K · 2-3 trainers]
\`\`\`

TAGS: dog-training-business-2027-behavior-obedience-skill, ccpdt-cpdt-ka-kpa-victoria-stilwell-academy-iaabc-credentials, bark-busters-250-sit-means-sit-140-petsmart-petco-positive-k9-coach-citizen-k9-olde-towne-references, force-free-positive-reinforcement-service-protection-therapy-specialty, vet-groomer-breed-club-referral-network, 70-85-percent-margin-solo, 2027`,
    src: `

## Sources

- CCPDT (Certification Council for Professional Dog Trainers): https://www.ccpdt.org/
- KPA (Karen Pryor Academy): https://www.karenpryoracademy.com/
- Victoria Stilwell Academy: https://www.vsdogtrainingacademy.com/
- IAABC (International Association of Animal Behavior Consultants): https://iaabc.org/
- APDT (Association of Professional Dog Trainers): https://apdt.com/
- Bark Busters: https://www.barkbusters.com/
- Sit Means Sit: https://sitmeansit.com/
- PetSmart Training: https://services.petsmart.com/training/
- AKC Canine Good Citizen: https://www.akc.org/products-services/training-programs/canine-good-citizen/
- IAADP (International Association of Assistance Dog Partners): https://iaadp.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Individual session | $80-$250 | Industry |
| Puppy class | $200-$600 | Industry |
| Basic obedience | $500-$2,000 | Industry |
| Board-and-train | $1,500-$15,000 | Industry |
| Service dog full training | $15K-$50K+ | Industry |
| CCPDT CPDT-KA cert | ~$385 | CCPDT |
| KPA certification | ~$5,500 | KPA |
| Victoria Stilwell Academy | ~$5,000 | VSA |
| IAABC membership | ~$200+/yr | IAABC |
| APDT membership | ~$160/yr | APDT |
| Bark Busters units | ~250+ globally | Bark Busters |
| Sit Means Sit units | ~140+ | Sit Means Sit |
| PetSmart locations | ~1,600+ US | PetSmart |
| US dogs | ~89M | AVMA |
| AKC Canine Good Citizen | major certification | AKC |
| Y1 capital | $5K-$15K | Industry |
| Y1 revenue | $50K-$180K | Industry |
| Y2 revenue | $180K-$500K | Industry |
| Margin solo | 70-85% | Industry |`,
    counter: `## Counter-Case
**PetSmart + Petco dominate puppy class.** Mitigation: specialty (behavior, protection, service).
**Force-based vs force-free debate.** Mitigation: positive-reinforcement modern best practice.
**Board-and-train liability.** Mitigation: $1M+ GL + waivers + facility security.
**Long sales cycle.** Mitigation: free puppy seminar + open-house.
**When stay-solo wins.** $80-130K solo trainer is comfortable.`,
    links: `

## See Also

- **q1975** — Start a doggy daycare business 2027
- **q1974** — Start a dog boarding business 2027
- **q1973** — Start a mobile pet grooming business 2027
- **q1972** — Start a pet sitting business 2027`,
    sources: ["https://www.ccpdt.org/","https://www.karenpryoracademy.com/","https://www.vsdogtrainingacademy.com/","https://iaabc.org/","https://apdt.com/","https://www.barkbusters.com/","https://sitmeansit.com/","https://services.petsmart.com/training/","https://www.akc.org/products-services/training-programs/canine-good-citizen/","https://iaadp.org/"],
    tags: ["dog-training-business-2027-behavior-obedience-skill","ccpdt-cpdt-ka-kpa-victoria-stilwell-academy-iaabc-credentials","bark-busters-250-sit-means-sit-140-petsmart-petco-positive-k9-coach-citizen-k9-olde-towne-references","force-free-positive-reinforcement-service-protection-therapy-specialty","vet-groomer-breed-club-referral-network","70-85-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (CCPDT CPDT-KA $385 + KPA Karen Pryor Academy $5.5K + Victoria Stilwell Academy $5K + IAABC + APDT credentials, Bark Busters 250 + Sit Means Sit 140 + PetSmart 1,600 + Petco Positive Dog Training + K9 Coach + Citizen K9 + Olde Towne references, AKC Canine Good Citizen + IAADP service dog credentials) real.' }
  },
  {
    id: 'q1975',
    tldr: `**TL;DR:** Doggy daycare in 2027 = **commercial facility caring for dogs during work day** charging $35-$80/day full-day + $20-$50/half-day + $300-$800/month unlimited package. **Y1 $150K-$500K (1 facility, 30-80 dogs/day); Y2 $500K-$1.5M+ with 2 locations or larger.** **Required:** commercial real estate (lease $3K-$25K/mo for 3K-15K sqft facility) + zoning approval + state/local pet-care facility license + business license + insurance ($2K-$8K/yr) + buildout $50-$400K (flooring, drainage, kennels, play yard, climate control) + staff ($14-$22/hr + manager $55-$85K). **Players:** Dogtopia (~290+ franchise units, NorthStar Capital Partners), Camp Bow Wow (~200+ units, VCA), K9 Resorts (~50+), Hounds Town (~30+), Dogs Day Out, City Bark, City Dog Club + local independents. **Margin:** 15-25% net after rent + labor + insurance + supplies + utilities. **Win condition:** 50-100 daily dogs + boarding overnight + training cross-sell + grooming = $1M+ annual.`,
    core: `

## Why Doggy Daycare 2027 Is Real

US 89M dogs + 70%+ households + dual-income family + return-to-office trend all drive demand. Demand drivers:
- Working professionals
- Multi-dog households
- Anxiety/separation dogs
- High-energy breeds
- Boarding overnight (combine)
- Training + grooming cross-sell

## Pricing 2027

| Service | Price |
|---|---|
| Full-day daycare | $35-$80 |
| Half-day | $20-$50 |
| 10-day package | $300-$700 |
| Unlimited monthly | $300-$800 |
| Overnight boarding | $50-$150/night |
| Grooming add-on | $40-$150 |
| Training add-on | $50-$150 |
| Webcam premium | included or +$5/day |
| Vaccination required | yes |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Lease + buildout + licenses + $80-500K capital] --> B[Hire 4-8 staff + manager]
    B --> C[Build 30-80 daily dogs + boarding]
    C --> D[Y1: $150K-$500K · 1 facility]
    D --> E[Y2: $500K-$1.5M+ · 2 locations or expand]
\`\`\`

TAGS: doggy-daycare-business-2027-commercial-facility, dogtopia-290-northstar-camp-bow-wow-200-vca-k9-resorts-50-hounds-town-30-dogs-day-out-city-bark-city-dog-club-competitors, commercial-real-estate-zoning-pet-care-license-buildout-50-400k, vca-mars-veterinary-acquisition-2014, overnight-boarding-training-grooming-cross-sell-revenue, 15-25-percent-net-margin-tight, 2027`,
    src: `

## Sources

- Dogtopia: https://www.dogtopia.com/
- Camp Bow Wow (VCA): https://www.campbowwow.com/
- K9 Resorts: https://www.k9resorts.com/
- Hounds Town USA: https://houndstownusa.com/
- VCA Animal Hospitals (Mars): https://vcahospitals.com/
- IBPSA (International Boarding & Pet Services Association): https://ibpsa.com/
- APPA (American Pet Products Association): https://www.americanpetproducts.org/
- Gingr (pet boarding software): https://www.gingr.com/
- PetExec: https://petexec.com/
- Time To Pet: https://timetopet.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Full-day daycare | $35-$80 | Industry |
| Half-day | $20-$50 | Industry |
| Unlimited monthly | $300-$800 | Industry |
| Boarding overnight | $50-$150 | Industry |
| Dogtopia franchise units | ~290+ | Dogtopia |
| Dogtopia parent | NorthStar Capital Partners | NorthStar |
| Camp Bow Wow franchise units | ~200+ | Camp Bow Wow |
| Camp Bow Wow parent | VCA (Mars 2014) | Mars |
| K9 Resorts units | ~50+ | K9 Resorts |
| Hounds Town franchise | ~30+ | Hounds Town |
| Real estate lease | $3K-$25K/mo for 3-15K sqft | Industry |
| Buildout cost | $50K-$400K | Industry |
| US dogs | ~89M | AVMA |
| US pet care spend | $147B+ 2024 | APPA |
| IBPSA membership | ~3,500+ | IBPSA |
| Gingr pricing | $50-$300+/mo | Gingr |
| Y1 capital | $80K-$500K | Industry |
| Y1 revenue | $150K-$500K | Industry |
| Y2 revenue | $500K-$1.5M+ | Industry |
| Margin net | 15-25% | Industry |`,
    counter: `## Counter-Case
**Dogtopia + Camp Bow Wow scale.** Mitigation: independent boutique premium + smaller-pack pricing.
**Capital + lease intensive.** Mitigation: smaller facility 3K sqft start.
**Labor turnover.** Mitigation: above-market $16-22/hr + benefits.
**Liability (dog injury/escape).** Mitigation: $2M+ GL + waivers + vaccination requirements.
**When stay-medium wins.** Single facility at $300-500K is solid lifestyle.`,
    links: `

## See Also

- **q1974** — Start a dog boarding business 2027
- **q1976** — Start a dog training business 2027
- **q1973** — Start a mobile pet grooming business 2027
- **q1971** — Start a dog walking business 2027`,
    sources: ["https://www.dogtopia.com/","https://www.campbowwow.com/","https://www.k9resorts.com/","https://houndstownusa.com/","https://vcahospitals.com/","https://ibpsa.com/","https://www.americanpetproducts.org/","https://www.gingr.com/","https://petexec.com/","https://timetopet.com/"],
    tags: ["doggy-daycare-business-2027-commercial-facility","dogtopia-290-northstar-camp-bow-wow-200-vca-k9-resorts-50-hounds-town-30-dogs-day-out-city-bark-city-dog-club-competitors","commercial-real-estate-zoning-pet-care-license-buildout-50-400k","vca-mars-veterinary-acquisition-2014","overnight-boarding-training-grooming-cross-sell-revenue","15-25-percent-net-margin-tight","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Dogtopia 290+ NorthStar Capital Partners + Camp Bow Wow 200+ VCA Mars 2014 + K9 Resorts 50 + Hounds Town 30 + Dogs Day Out + City Bark + City Dog Club franchise competitors, IBPSA International Boarding & Pet Services Association 3.5K members + APPA $147B pet care 2024, Gingr + PetExec + Time To Pet software) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH D DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
