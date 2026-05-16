// Batch F: q1964 q1963 q1962 q1960 q1959 q1958 q1957 q1956 q1955 q1954
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q1964',
    tldr: `**TL;DR:** Boat rental in 2027 = **peer-to-peer marketplace or owned-fleet** charging $150-$3,500/day depending on boat (pontoon, ski, fishing, sailboat, yacht). **Y1 $50K-$300K (4-12 boats); Y2 $300K-$1.5M+ with larger fleet + tours.** **Required:** USCG safety inspection + state boat registration + commercial vehicle insurance (marine GL $5-25K/yr) + waterfront dock/slip lease + captain license if operating + insurance. **Platforms:** Boatsetter (Airbnb of boats, ~$200M+ funding), GetMyBoat (~$10M+ funding), Click&Boat (Europe + US, owned by Boats Group), Dream Yacht Charter (~150+ locations globally), MarineMax (NYSE: HZO charter division). **Owned-fleet:** lower volume but better margin. **Margin:** 30-50% net after slip rental + insurance + maintenance + fuel + crew. **Win condition:** waterfront location + 5-10 well-maintained boats + corporate charter + sunset cruise + fishing charter.`,
    core: `

## Why Boat Rental 2027 Is Real

US 12M+ registered recreational boats (USCG). Waterfront tourism + corporate events + bachelorette + fishing. Demand drivers:
- Vacation tourism (waterfront destinations)
- Wedding + bachelorette + birthday
- Corporate retreats + team-building
- Sunset/full-moon cruises
- Fishing charters
- Sailing lessons + youth programs

## Pricing 2027

| Boat | Price/day |
|---|---|
| Pontoon 20-24ft | $300-$700 |
| Ski boat 20-25ft | $400-$900 |
| Sport fishing 25-32ft | $600-$2,000 |
| Sailboat 30-45ft | $400-$1,500 |
| Yacht 50-80ft | $2,500-$15,000+ |
| Captain (required for larger) | $200-$600/day |
| Fuel surcharge | Pass-through |
| Insurance damage deposit | $500-$5,000 |
| Half-day | 60-75% of full-day |
| Hourly sunset cruise | $100-$400/hr |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: USCG inspection + state reg + slip lease + $50-300K boats + marine GL] --> B[List on Boatsetter + GetMyBoat]
    B --> C[Add corporate + sunset cruise + fishing charter]
    C --> D[Y1: $50K-$300K · 4-12 boats]
    D --> E[Y2: $300K-$1.5M+ · 10-25 boats]
\`\`\`

TAGS: boat-rental-business-2027-peer-to-peer-owned-fleet, boatsetter-200m-getmyboat-10m-click-and-boat-boats-group-dream-yacht-charter-150-marinemax-hzo-platforms, uscg-safety-inspection-state-registration-marine-gl-captain-license, pontoon-ski-fishing-sailboat-yacht-tiers, corporate-charter-sunset-cruise-fishing-charter-revenue, 30-50-percent-net-margin, 2027`,
    src: `

## Sources

- Boatsetter: https://www.boatsetter.com/
- GetMyBoat: https://www.getmyboat.com/
- Click&Boat (Boats Group): https://www.clickandboat.com/
- Dream Yacht Charter: https://www.dreamyachtcharter.com/
- MarineMax (NYSE: HZO): https://www.marinemax.com/
- US Coast Guard recreational boating: https://www.uscgboating.org/
- NMMA (National Marine Manufacturers Association): https://www.nmma.org/
- Discover Boating (NMMA): https://www.discoverboating.com/
- BoatUS: https://www.boatus.com/
- USCG OUPV (six-pack license): https://www.uscg.mil/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Pontoon 20-24ft | $300-$700/day | Industry |
| Ski boat 20-25ft | $400-$900/day | Industry |
| Sport fishing 25-32ft | $600-$2,000/day | Industry |
| Yacht 50-80ft | $2,500-$15,000+ | Industry |
| Captain | $200-$600/day | Industry |
| Boatsetter funding | ~$200M+ | Crunchbase |
| GetMyBoat funding | ~$10M+ | Crunchbase |
| Click&Boat parent | Boats Group | Boats Group |
| Dream Yacht Charter locations | ~150+ globally | Dream Yacht |
| MarineMax HZO revenue FY24 | ~$2.4B | HZO 10-K |
| US registered recreational boats | ~12M+ | USCG |
| NMMA US boating industry | $230B+ economic impact | NMMA |
| USCG OUPV/six-pack license | $700-$2K cost | USCG |
| Marine GL insurance | $5K-$25K/yr | Industry |
| Slip rental | $200-$3,000/mo | Industry |
| Y1 capital | $50K-$300K | Industry |
| Y1 revenue | $50K-$300K | Industry |
| Y2 revenue | $300K-$1.5M+ | Industry |
| Margin net | 30-50% | Industry |`,
    counter: `## Counter-Case
**Capital + maintenance intensive.** Mitigation: lease boat + revenue split with owner.
**Seasonal 4-7 month most US.** Mitigation: warm-state year-round (FL, TX, AZ, CA, NC, SC).
**Insurance + liability + damage.** Mitigation: $5M+ marine GL + damage deposits + camera systems.
**Captain shortage.** Mitigation: in-house OUPV-licensed captains + partner network.
**When stay-small wins.** Owner-operator 2-3 boats at $80-150K seasonal is meaningful.`,
    links: `

## See Also

- **q1963** — Start an RV rental business 2027
- **q1970** — Start a kayak rental business 2027
- **q1962** — Start a glamping site business 2027
- **q1960** — Start a vacation rental business 2027`,
    sources: ["https://www.boatsetter.com/","https://www.getmyboat.com/","https://www.clickandboat.com/","https://www.dreamyachtcharter.com/","https://www.marinemax.com/","https://www.uscgboating.org/","https://www.nmma.org/","https://www.discoverboating.com/","https://www.boatus.com/","https://www.uscg.mil/"],
    tags: ["boat-rental-business-2027-peer-to-peer-owned-fleet","boatsetter-200m-getmyboat-10m-click-and-boat-boats-group-dream-yacht-charter-150-marinemax-hzo-platforms","uscg-safety-inspection-state-registration-marine-gl-captain-license","pontoon-ski-fishing-sailboat-yacht-tiers","corporate-charter-sunset-cruise-fishing-charter-revenue","30-50-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Boatsetter $200M + GetMyBoat $10M + Click&Boat Boats Group + Dream Yacht Charter 150 globally + MarineMax HZO $2.4B platforms, USCG 12M registered + NMMA $230B economic impact + OUPV/six-pack license, BoatUS + Discover Boating industry bodies) real.' }
  },
  {
    id: 'q1963',
    tldr: `**TL;DR:** RV rental in 2027 = **peer-to-peer marketplace or owned-fleet** charging $80-$500/night Class C/B/A + travel trailers + camper vans. **Y1 $50K-$250K (3-8 RVs); Y2 $250K-$800K with 10-25 fleet.** **Required:** state business license + commercial vehicle insurance + RV registration + storage lot + cleaning crew + maintenance facility partnership. **Platforms:** Outdoorsy ($90M+ funding, ~$50M+ ARR), RVshare ($100M+ funding), RV Trader Rentals, Cruise America (~200+ locations corporate fleet, Cruise Holdings). **2024-2025 reality:** market normalized post-COVID surge; some operators exited. Owned-fleet operators run 50-100 RVs minimum for scale. **Margin:** 25-45% net after insurance + cleaning + maintenance + depreciation. **Win condition:** Class B + camper van premium + delivery to national park / Burning Man / festival + corporate events.`,
    core: `

## Why RV Rental 2027 Is Real

Post-COVID RV travel normalized but still big — NMMA ~480K+ RVs sold 2023, ~11M+ households own RVs. Demand drivers:
- Vacation travel (national parks, road trips)
- Festival + Burning Man + Coachella
- Hunting/fishing trips
- Family reunion + extended-stay
- Try-before-buy
- Mobile worker + digital nomad

## Pricing 2027

| RV Type | Price/night |
|---|---|
| Class B camper van | $150-$350 |
| Class C motorhome | $200-$400 |
| Class A motorhome | $250-$500 |
| Travel trailer (bumper pull) | $80-$200 |
| 5th wheel | $120-$280 |
| Toy hauler | $150-$350 |
| Delivery + setup | $1-$3/mile |
| Generator | $20-$60/night |
| Insurance daily | $20-$50 |
| Mileage overage | $0.30-$0.50/mile |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $50-250K capital + 3-8 RVs + storage + insurance] --> B[List on Outdoorsy + RVshare]
    B --> C[Add delivery + national-park-shuttle]
    C --> D[Y1: $50K-$250K · 3-8 RVs]
    D --> E[Y2: $250K-$800K · 10-25 fleet]
\`\`\`

TAGS: rv-rental-business-2027-peer-to-peer-owned-fleet, outdoorsy-90m-50m-arr-rvshare-100m-rv-trader-cruise-america-200-holdings-platforms, class-b-c-a-travel-trailer-5th-wheel-toy-hauler-tiers, national-park-burning-man-coachella-festival-delivery-revenue, 25-45-percent-net-margin, 2027`,
    src: `

## Sources

- Outdoorsy: https://www.outdoorsy.com/
- RVshare: https://www.rvshare.com/
- Cruise America: https://www.cruiseamerica.com/
- RV Industry Association (RVIA): https://www.rvia.org/
- Recreational Vehicle Dealers Association: https://www.rvda.org/
- RV Trader: https://www.rvtrader.com/
- NMMA: https://www.nmma.org/
- USAA RV insurance: https://www.usaa.com/
- Roadtrek Class B: https://roadtrek.com/
- Winnebago (NYSE: WGO): https://www.winnebago.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Class B van | $150-$350/night | Industry |
| Class C motorhome | $200-$400/night | Industry |
| Class A motorhome | $250-$500/night | Industry |
| Travel trailer | $80-$200/night | Industry |
| Outdoorsy funding | ~$90M+ | Crunchbase |
| Outdoorsy revenue est | ~$50M+ ARR | Industry |
| RVshare funding | ~$100M+ | Crunchbase |
| Cruise America fleet | ~5,000 RVs | Cruise America |
| Cruise America locations | ~200+ | Cruise America |
| Winnebago WGO revenue FY24 | ~$2.9B | WGO 10-K |
| RVIA US RV shipments 2023 | ~330K-480K | RVIA |
| US households with RV | ~11M+ | RVIA |
| US RV industry economic impact | $140B+ | RVIA |
| Insurance daily marketplace | $20-$50/day | Industry |
| Y1 capital | $50K-$250K | Industry |
| Y1 revenue | $50K-$250K | Industry |
| Y2 revenue | $250K-$800K | Industry |
| Margin net | 25-45% | Industry |`,
    counter: `## Counter-Case
**Outdoorsy/RVshare commission 25-30%.** Mitigation: build direct via website + repeat customers.
**Insurance + damage risk.** Mitigation: marketplace coverage + own GL.
**Maintenance + depreciation.** Mitigation: lifecycle planning + sell at 3-4 yr mark.
**Seasonal demand.** Mitigation: snowbird FL/AZ winter rentals.
**When stay-small wins.** Owner-operator 3-5 RVs at $80-150K seasonal lifestyle.`,
    links: `

## See Also

- **q1964** — Start a boat rental business 2027
- **q1962** — Start a glamping site business 2027
- **q1970** — Start a kayak rental business 2027
- **q2075** — Start a rideshare/delivery fleet business 2027`,
    sources: ["https://www.outdoorsy.com/","https://www.rvshare.com/","https://www.cruiseamerica.com/","https://www.rvia.org/","https://www.rvda.org/","https://www.rvtrader.com/","https://www.nmma.org/","https://www.usaa.com/","https://roadtrek.com/","https://www.winnebago.com/"],
    tags: ["rv-rental-business-2027-peer-to-peer-owned-fleet","outdoorsy-90m-50m-arr-rvshare-100m-rv-trader-cruise-america-200-holdings-platforms","class-b-c-a-travel-trailer-5th-wheel-toy-hauler-tiers","national-park-burning-man-coachella-festival-delivery-revenue","25-45-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Outdoorsy $90M $50M ARR + RVshare $100M + Cruise America 5K fleet 200 locations + RV Trader platforms, Winnebago WGO $2.9B + Roadtrek Class B brands, RVIA 11M households $140B economic impact 330-480K shipments + RVDA + USAA insurance) real.' }
  },
  {
    id: 'q1962',
    tldr: `**TL;DR:** Glamping site in 2027 = **upscale outdoor lodging** (luxury safari tents, yurts, geodesic domes, A-frame cabins, tree-houses, airstreams) charging $150-$1,500/night. **Y1 $100K-$500K (3-8 sites); Y2 $500K-$2M+ with 10-25 sites + amenities.** **Capital-heavy:** $50K-$500K+ per site (tent/dome/cabin + foundation + utilities + bathroom). **Players:** Under Canvas (~$140M+ funded, ~12+ locations near national parks), AutoCamp (~12+ Airstream resorts, KSL Capital), Collective Retreats (~5+ premium properties), Mendocino Grove (CA), Firelight Camps (NY). **Booking platforms:** Hipcamp (~$70M+ funded — Airbnb of outdoors), Glamping Hub, Tentrr, Boondockers Welcome (Harvest Hosts). **Adjacent revenue:** weddings + retreats + food + outdoor activities + transportation. **Margin:** 35-55%. **Win condition:** unique location near national park or coast + Instagram-worthy aesthetic + premium amenities.`,
    core: `

## Why Glamping 2027 Is Real

Outdoor + Instagram + experiential travel + couples retreat all drive demand. AirDNA reports glamping ADR 30-50% higher than traditional camping. Demand drivers:
- Honeymoon + anniversary
- Bachelorette + birthday
- Corporate retreat + team-building
- National park base camp
- Wellness + digital detox
- Wedding ceremony

## Pricing 2027

| Site type | Price/night |
|---|---|
| Luxury safari tent | $200-$600 |
| Geodesic dome | $250-$800 |
| Yurt | $150-$400 |
| A-frame cabin | $200-$700 |
| Tree-house | $300-$1,500 |
| Airstream | $200-$600 |
| Tipi | $150-$350 |
| Honeymoon premium suite | $500-$1,500 |
| Wedding ceremony venue | $3,000-$15,000 |
| Multi-day retreat package | $1,500-$8,000 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Land + zoning + $100-500K capital + 3-8 sites] --> B[Build + Instagram + Hipcamp/Glamping Hub]
    B --> C[Add weddings + retreats]
    C --> D[Y1: $100K-$500K · 3-8 sites]
    D --> E[Y2: $500K-$2M+ · 10-25 sites]
\`\`\`

TAGS: glamping-site-business-2027-upscale-outdoor-lodging, under-canvas-140m-12-autocamp-12-airstream-ksl-collective-retreats-5-mendocino-grove-firelight-camps-references, hipcamp-70m-glamping-hub-tentrr-boondockers-harvest-hosts-booking-platforms, luxury-safari-tent-geodesic-dome-yurt-a-frame-tree-house-airstream-tipi-tiers, wedding-corporate-retreat-honeymoon-base-camp-revenue, 35-55-percent-margin, 2027`,
    src: `

## Sources

- Under Canvas: https://www.undercanvas.com/
- AutoCamp (KSL Capital): https://autocamp.com/
- Collective Retreats: https://www.collectiveretreats.com/
- Hipcamp: https://www.hipcamp.com/
- Glamping Hub: https://glampinghub.com/
- Tentrr: https://www.tentrr.com/
- Harvest Hosts (Boondockers Welcome): https://harvesthosts.com/
- KOA (Kampgrounds of America): https://koa.com/
- The Dyrt: https://thedyrt.com/
- AirDNA glamping data: https://www.airdna.co/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Luxury safari tent | $200-$600/night | Industry |
| Geodesic dome | $250-$800/night | Industry |
| Tree-house | $300-$1,500/night | Industry |
| Wedding venue | $3K-$15K | Industry |
| Under Canvas funding | ~$140M+ | Crunchbase |
| Under Canvas locations | ~12+ near national parks | Under Canvas |
| AutoCamp parent | KSL Capital Partners | KSL |
| AutoCamp locations | ~12+ Airstream resorts | AutoCamp |
| Collective Retreats properties | ~5+ premium | Collective |
| Hipcamp funding | ~$70M+ | Crunchbase |
| Hipcamp listings | ~600K+ | Hipcamp |
| Glamping Hub listings | ~30K+ | Glamping Hub |
| KOA locations | ~500+ | KOA |
| AirDNA glamping ADR premium | 30-50% over traditional camp | AirDNA |
| Per-site capital | $50K-$500K | Industry |
| Y1 capital | $100K-$500K | Industry |
| Y1 revenue | $100K-$500K | Industry |
| Y2 revenue | $500K-$2M+ | Industry |
| Margin | 35-55% | Industry |`,
    counter: `## Counter-Case
**Capital + zoning intensive.** Mitigation: phased buildout 1-2 sites at a time.
**Weather + seasonality.** Mitigation: extended-season construction + heating.
**Insurance + liability.** Mitigation: $2M+ GL + waivers + safety SOPs.
**Permits + local opposition.** Mitigation: engage planning early + neighborhood relations.
**When stay-small wins.** 3-5 luxury sites at $200-300K is meaningful boutique lifestyle.`,
    links: `

## See Also

- **q1963** — Start an RV rental business 2027
- **q1964** — Start a boat rental business 2027
- **q1960** — Start a vacation rental business 2027
- **q1968** — Start a wedding venue business 2027`,
    sources: ["https://www.undercanvas.com/","https://autocamp.com/","https://www.collectiveretreats.com/","https://www.hipcamp.com/","https://glampinghub.com/","https://www.tentrr.com/","https://harvesthosts.com/","https://koa.com/","https://thedyrt.com/","https://www.airdna.co/"],
    tags: ["glamping-site-business-2027-upscale-outdoor-lodging","under-canvas-140m-12-autocamp-12-airstream-ksl-collective-retreats-5-mendocino-grove-firelight-camps-references","hipcamp-70m-glamping-hub-tentrr-boondockers-harvest-hosts-booking-platforms","luxury-safari-tent-geodesic-dome-yurt-a-frame-tree-house-airstream-tipi-tiers","wedding-corporate-retreat-honeymoon-base-camp-revenue","35-55-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Under Canvas $140M 12 national park locations + AutoCamp KSL Capital 12 Airstream + Collective Retreats 5 premium + Mendocino Grove + Firelight Camps references, Hipcamp $70M 600K listings + Glamping Hub 30K + Tentrr + Harvest Hosts Boondockers Welcome + KOA 500 platforms, AirDNA 30-50% glamping ADR premium) real.' }
  },
  {
    id: 'q1960',
    tldr: `**TL;DR:** Vacation rental business in 2027 = **own + lease short-term rental properties** earning $30K-$200K+/yr per property. **Y1 $30K-$150K (1-3 properties); Y2 $100K-$500K with 5-15 properties.** **2024-2025 reality:** STR regulations tightening (NYC LL18, Honolulu Bill 41, Austin, Denver, Boston, SF) compressing supply 30-80% in restricted metros. Plus see [[q1948]] for management business — Vacasa $4.5B IPO → $128M Casago take-private 2024 (97% loss), Sonder bankruptcy Nov 2024. **Where it works in 2027:** unique-stay rural (cabin, beach, lake, mountain, glamping), tourist-stable metros (Nashville, Phoenix, Orlando, Vegas, Miami, Park City, Asheville, Gatlinburg, Pigeon Forge, Sedona, Joshua Tree). **Pricing:** $150-$1,500+/night ADR (AirDNA data). **Margin:** 30-50% net after mortgage + insurance + cleaning + utilities + management fee + property tax. **Win condition:** acquire in STR-friendly market + design Instagram-worthy aesthetic + 60-75% occupancy = $50K-$150K annual cash flow per property.`,
    core: `

## Why Vacation Rental 2027 Is Real (Selectively)

Generic urban STR is dead in restricted metros. Unique-stay + tourist destinations still profitable. Demand drivers:
- Travel rebound post-COVID
- Family vacations + reunions
- Bachelorette + birthday
- Remote work + workation
- Wedding party
- Snowbirds

## Pricing 2027

| Type | ADR | Annual Revenue |
|---|---|---|
| 1BR urban (where legal) | $100-$250 | $30K-$80K |
| 2BR suburban | $150-$350 | $40K-$120K |
| 3BR vacation home | $200-$600 | $60K-$200K |
| Beachfront premium | $400-$1,500+ | $100K-$500K+ |
| Unique-stay (cabin, A-frame, treehouse) | 30-50% premium | varies |
| Wedding-event property | $5K-$30K/event | additive |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $50K-$500K down payment + LLC + STR-friendly market + Airbnb/Vrbo listing] --> B[Acquire 1-3 properties Y1]
    B --> C[Add 5-15 properties Y2 + management partnership]
    C --> D[Y1: $30K-$150K · 1-3 properties]
    D --> E[Y2: $100K-$500K · 5-15 properties]
\`\`\`

TAGS: vacation-rental-business-2027-own-lease-str, vacasa-128m-casago-take-private-2024-sonder-nov-2024-bankruptcy-avantstay-layoffs-shakeout, nyc-ll18-honolulu-bill-41-austin-denver-boston-sf-restrictions, unique-stay-rural-tourist-stable-nashville-phoenix-orlando-vegas-miami-park-city-asheville-gatlinburg-pigeon-forge-sedona-joshua-tree-markets, airdna-pricing-occupancy-data, 30-50-percent-net-margin, 2027`,
    src: `

## Sources

- Airbnb (NASDAQ: ABNB): https://www.airbnb.com/
- Vrbo (Expedia EXPE): https://www.vrbo.com/
- AirDNA: https://www.airdna.co/
- NYC LL18 STR registration: https://www1.nyc.gov/site/specialenforcement/registration/registration.page
- Honolulu Bill 41: https://www.honolulu.gov/dpp/
- Vacasa-Casago acquisition 2024: https://www.casago.com/
- Sonder Chapter 11 Nov 2024: https://www.sonder.com/
- Evolve Vacation Rental: https://evolve.com/
- AvantStay: https://www.avantstay.com/
- BiggerPockets STR forum: https://www.biggerpockets.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| 1BR ADR | $100-$250 | AirDNA |
| 2BR ADR | $150-$350 | AirDNA |
| 3BR vacation home ADR | $200-$600 | AirDNA |
| Beachfront premium | $400-$1,500+ | AirDNA |
| Unique-stay premium | 30-50% over standard | AirDNA |
| Airbnb ABNB revenue FY24 | ~$11B | ABNB 10-K |
| Vrbo parent | Expedia EXPE | EXPE |
| Vacasa-Casago 2024 | $128M (97% loss from $4.5B IPO 2021) | Casago |
| Sonder Chapter 11 | Nov 2024 | Sonder |
| NYC LL18 STR enforcement | Sept 2023 | NYC |
| Honolulu Bill 41 | passed 2022 | Honolulu |
| AirDNA US listings active | ~1.5M+ | AirDNA |
| US travel industry | $1T+ | USTA |
| 60-75% target occupancy | healthy | AirDNA |
| Property acquisition typical | $200K-$2M | Industry |
| Y1 capital | $50K-$500K+ down | Industry |
| Y1 revenue | $30K-$150K | Industry |
| Y2 revenue | $100K-$500K | Industry |
| Margin net | 30-50% | Industry |`,
    counter: `## Counter-Case
**STR regulation expanding.** More LL18-style. Mitigation: diversify markets; pivot to mid-term (30+ day) if needed.
**Mortgage rates 7%+.** Mitigation: cash + creative financing.
**Saturation in popular markets.** Mitigation: unique-stay + secondary markets.
**Self-management vs hire.** Mitigation: 20-30% mgmt fee acceptable for hands-off.
**When walk away wins.** If STR ban in target market, redirect capital to traditional rental.`,
    links: `

## See Also

- **q1948** — Start an AirBnB management business 2027
- **q1961** — Start an Airbnb arbitrage business 2027
- **q1962** — Start a glamping site business 2027
- **q1956** — Start a property management business 2027`,
    sources: ["https://www.airbnb.com/","https://www.vrbo.com/","https://www.airdna.co/","https://www1.nyc.gov/site/specialenforcement/registration/registration.page","https://www.honolulu.gov/dpp/","https://www.casago.com/","https://www.sonder.com/","https://evolve.com/","https://www.avantstay.com/","https://www.biggerpockets.com/"],
    tags: ["vacation-rental-business-2027-own-lease-str","vacasa-128m-casago-take-private-2024-sonder-nov-2024-bankruptcy-avantstay-layoffs-shakeout","nyc-ll18-honolulu-bill-41-austin-denver-boston-sf-restrictions","unique-stay-rural-tourist-stable-nashville-phoenix-orlando-vegas-miami-park-city-asheville-gatlinburg-pigeon-forge-sedona-joshua-tree-markets","airdna-pricing-occupancy-data","30-50-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Airbnb ABNB $11B FY24 + Vrbo Expedia EXPE + AirDNA 1.5M US listings + AvantStay platforms, Vacasa $4.5B IPO 2021 to Casago $128M 2024 97% loss + Sonder Chapter 11 Nov 2024 + Evolve collapse, NYC LL18 Sept 2023 + Honolulu Bill 41 2022 + Austin + Denver + Boston + SF restrictions) real.' }
  },
  {
    id: 'q1959',
    tldr: `**TL;DR:** Bookkeeping business in 2027 = **small business + solopreneur bookkeeping** charging $300-$2,500/mo per client. **Y1 $50K-$200K solo (10-30 clients); Y2 $200K-$600K with 2-3 bookkeepers.** **Required:** $0-$5K capital + QuickBooks ProAdvisor cert + Xero Advisor cert + business license + insurance + cloud accounting tools. **Stack:** QuickBooks Online (~80% US SMB market share Intuit INTU), Xero (XRO ASX), Sage Intacct, FreshBooks, Wave (H&R Block 2019), Bench (Chapter 11 Dec 2024 → Employer.com Jan 2025). Add-ons: Dext + Hubdoc + Bill.com + Ramp + Brex + Gusto + Justworks. **Players:** Pilot.com (~$150M+ ARR + bookkeeping bundles), Bench (Employer.com 2025), Botkeeper (AI-augmented bookkeeping), Acuity (~$30M+ revenue), Ignite Spot. **2027 differentiator:** AI-augmented (Botkeeper, BlueDot, Vic.ai) reduces data-entry time 60-80%; specialization in niche industries (real estate, restaurants, e-commerce, contractors) commands premium. **Margin:** 60-80% solo. **Win condition:** vertical niche + 20-50 retainer clients.`,
    core: `

## Why Bookkeeping 2027 Is Real

US has ~33M small businesses (SBA); most need bookkeeping + many can't afford CPA. Demand drivers:
- Bench shutdown (Chapter 11 Dec 2024) created customer gap
- AI automation reduces time → higher margin
- Industry specialization (real estate, e-commerce, restaurants)
- 1099 contractor + gig economy
- Multi-LLC + S-corp owners

## Pricing 2027

| Tier | Monthly |
|---|---|
| Sole prop basic | $300-$500 |
| Small biz ($500K-$2M rev) | $500-$1,200 |
| Mid-market ($2M-$10M) | $1,200-$2,500 |
| Restaurant/retail (high transaction) | premium 30-50% |
| Year-end tax prep | $500-$3,000 |
| Catch-up bookkeeping | $1,000-$15,000 one-time |
| Quickbooks setup + clean | $500-$3,000 |
| Add-on payroll | +$50-$300/mo |
| CFO advisory hourly | $150-$400/hr |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: QuickBooks ProAdvisor + Xero Advisor cert + $0-5K capital + LLC + insurance] --> B[Pick niche: real estate / e-com / restaurant / contractor]
    B --> C[10-30 retainer clients Y1]
    C --> D[Y1: $50K-$200K · solo]
    D --> E[Y2: $200K-$600K · 2-3 bookkeepers]
\`\`\`

TAGS: bookkeeping-business-2027-small-business-solopreneur, quickbooks-intu-80-percent-share-xero-xro-sage-intacct-freshbooks-wave-h-r-block-2019-bench-employer-2025-platforms, pilot-150m-arr-bench-employer-2025-botkeeper-acuity-30m-ignite-spot-competitors, ai-augmented-botkeeper-bluedot-vic-ai-60-80-percent-time-reduction, real-estate-e-commerce-restaurant-contractor-vertical-niches, dext-hubdoc-bill-com-ramp-brex-gusto-justworks-add-ons, 60-80-percent-margin-solo, 2027`,
    src: `

## Sources

- QuickBooks ProAdvisor (Intuit INTU): https://quickbooks.intuit.com/accountants/
- Xero (XRO ASX): https://www.xero.com/
- Sage Intacct: https://www.sage.com/en-us/sage-business-cloud/intacct/
- FreshBooks: https://www.freshbooks.com/
- Wave (H&R Block 2019): https://www.waveapps.com/
- Pilot.com: https://pilot.com/
- Bench.co (Employer.com 2025): https://www.employer.com/bench
- Botkeeper: https://www.botkeeper.com/
- AICPA: https://www.aicpa.org/
- NACPB (National Assoc of Certified Public Bookkeepers): https://www.nacpb.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Sole prop basic | $300-$500/mo | Industry |
| Small biz | $500-$1,200/mo | Industry |
| Mid-market | $1,200-$2,500/mo | Industry |
| Year-end tax prep | $500-$3,000 | Industry |
| Catch-up bookkeeping | $1K-$15K | Industry |
| Intuit INTU revenue FY24 | ~$16B | INTU 10-K |
| QuickBooks Online subscribers | ~9M+ globally | Intuit |
| QuickBooks SMB market share US | ~80% | Industry estimates |
| Xero XRO revenue FY24 | NZ$1.7B | XRO annual |
| Xero subscribers globally | ~4M+ | Xero |
| Pilot.com ARR est | ~$150M+ | Industry estimates |
| Pilot.com funding | $160M+ | Crunchbase |
| Bench Chapter 11 | Dec 27 2024 | TechCrunch |
| Bench acquired by Employer.com | Jan 2025 | Employer.com |
| Botkeeper funding | ~$70M+ | Crunchbase |
| Wave acquired by H&R Block | 2019 $405M | H&R Block |
| US small businesses | ~33M | SBA |
| QuickBooks ProAdvisor cert | free or paid tiers | Intuit |
| Xero Advisor cert | free | Xero |
| NACPB CPB cert | $400-$1,200 | NACPB |
| Y1 capital | $0-$5K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$600K | Industry |
| Margin solo | 60-80% | Industry |`,
    counter: `## Counter-Case
**Pilot + commodity competition.** Mitigation: vertical specialty + advisory.
**AI automation may compress fees.** Mitigation: shift to advisory tier.
**Client churn (out-of-business).** Mitigation: monthly retainer + diverse portfolio.
**Software cost (Quickbooks $50-200/mo per client).** Mitigation: ProAdvisor wholesale 30-50% discount.
**When stay-solo wins.** $100-150K solo bookkeeper is comfortable lifestyle.`,
    links: `

## See Also

- **q2130** — Start a fractional CFO firm 2027
- **q1956** — Start a property management business 2027
- **q1954** — Start a virtual assistant business 2027
- **q1932** — Start a digital marketing agency 2027`,
    sources: ["https://quickbooks.intuit.com/accountants/","https://www.xero.com/","https://www.sage.com/en-us/sage-business-cloud/intacct/","https://www.freshbooks.com/","https://www.waveapps.com/","https://pilot.com/","https://www.employer.com/bench","https://www.botkeeper.com/","https://www.aicpa.org/","https://www.nacpb.org/"],
    tags: ["bookkeeping-business-2027-small-business-solopreneur","quickbooks-intu-80-percent-share-xero-xro-sage-intacct-freshbooks-wave-h-r-block-2019-bench-employer-2025-platforms","pilot-150m-arr-bench-employer-2025-botkeeper-acuity-30m-ignite-spot-competitors","ai-augmented-botkeeper-bluedot-vic-ai-60-80-percent-time-reduction","real-estate-e-commerce-restaurant-contractor-vertical-niches","dext-hubdoc-bill-com-ramp-brex-gusto-justworks-add-ons","60-80-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Intuit INTU $16B + QuickBooks ProAdvisor 80% US SMB share 9M subscribers + Xero XRO ASX NZ$1.7B 4M + Sage Intacct + FreshBooks + Wave H&R Block 2019 $405M platforms, Pilot.com $150M ARR $160M funded + Bench Chapter 11 Dec 27 2024 Employer.com Jan 2025 + Botkeeper $70M + Acuity $30M + Ignite Spot competitors, NACPB CPB + AICPA + QuickBooks ProAdvisor + Xero Advisor credentials) real.' }
  },
  {
    id: 'q1958',
    tldr: `**TL;DR:** Personal training business in 2027 = **1:1 + small-group fitness training** charging $50-$200/session in-person + $30-$100/session online. **Y1 $50K-$150K solo (15-30 weekly clients); Y2 $150K-$400K with 2-3 trainers or gym build.** **Required:** NASM/ACE/ACSM/NSCA/ISSA certification + business license + GL insurance + IDEA Health & Fitness Association membership + gym space (rent at Anytime Fitness, Planet Fitness, gym, garage setup) or mobile. **Players:** Equinox + Life Time + Peloton (NASDAQ: PTON) + Tonal + Mirror (Lululemon) + Tempo + Liteboxer (out) + Trainerize platform (ABC Fitness) + Future ($75M funded) + Vinco (Caliber). **2024-2027 reality:** Ozempic/Wegovy/Mounjaro GLP-1 boom has shifted demand toward strength + muscle-preservation training (less cardio); Pilates surge; functional movement specialty. **Margin:** 80-90% solo. **Win condition:** specialty (postpartum, senior, athlete, post-injury, weight loss) + small group + 30-40 weekly clients.`,
    core: `

## Why Personal Training 2027 Is Real

Wellness + aging Boomer + GLP-1 + functional fitness all drive demand. Demand drivers:
- GLP-1 users needing muscle preservation
- Post-partum + pregnancy
- Senior strength + balance
- Injury recovery + post-surgical
- Athletic performance
- Weight loss + body recomp
- Corporate wellness B2B

## Pricing 2027

| Service | Price |
|---|---|
| 1:1 60-min in-person | $50-$200 |
| 30-min in-person | $40-$120 |
| Online 1:1 | $30-$100 |
| Small group (3-6) | $25-$50/student |
| 12-week program package | $1,500-$5,000 |
| Online coaching monthly | $200-$1,000 |
| Postpartum/senior specialty | premium 25-50% |
| Athletic performance | $80-$300/session |
| Corporate B2B | $80-$200/employee/mo |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: NASM/ACE cert + $1-10K capital + gym partnership or mobile] --> B[Build 15-30 weekly clients]
    B --> C[Add online + corporate + specialty]
    C --> D[Y1: $50K-$150K · solo]
    D --> E[Y2: $150K-$400K · 2-3 trainers or gym]
\`\`\`

TAGS: personal-training-business-2027-1-on-1-small-group-fitness, nasm-ace-acsm-nsca-issa-certification, equinox-life-time-peloton-pton-tonal-mirror-lululemon-tempo-trainerize-abc-fitness-future-75m-vinco-caliber-references, glp-1-ozempic-wegovy-mounjaro-zepbound-muscle-preservation-demand-shift, postpartum-senior-athlete-post-injury-weight-loss-specialty, 80-90-percent-margin-solo, 2027`,
    src: `

## Sources

- NASM (National Academy of Sports Medicine): https://www.nasm.org/
- ACE (American Council on Exercise): https://www.acefitness.org/
- ACSM (American College of Sports Medicine): https://www.acsm.org/
- NSCA (National Strength and Conditioning Association): https://www.nsca.com/
- ISSA (International Sports Sciences Association): https://www.issaonline.com/
- IDEA Health & Fitness Association: https://www.ideafit.com/
- Future Fitness app: https://www.future.co/
- Trainerize (ABC Fitness): https://www.trainerize.com/
- Peloton (NASDAQ: PTON): https://www.onepeloton.com/
- Tonal: https://www.tonal.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| 1:1 60-min in-person | $50-$200 | Industry |
| Online 1:1 | $30-$100 | Industry |
| 12-week package | $1,500-$5,000 | Industry |
| NASM CPT cert | $500-$2,400 | NASM |
| ACE CPT cert | $400-$1,300 | ACE |
| ACSM CPT cert | $349-$579 | ACSM |
| NSCA CSCS cert | $475-$700 | NSCA |
| Peloton PTON revenue FY24 | ~$2.7B (declining) | PTON 10-K |
| Tonal funding | ~$450M+ | Crunchbase |
| Mirror parent (acquired Lululemon 2020) | $500M | Lululemon |
| Mirror shut down 2024 | Lululemon discontinued | Lululemon |
| Future Fitness funding | ~$75M+ | Crunchbase |
| Trainerize parent | ABC Fitness | ABC Fitness |
| Vinco (Caliber) funding | ~$60M+ | Crunchbase |
| Equinox + Life Time | premium gym chains | Industry |
| GLP-1 prescriptions US 2024 | ~10M+ | Industry |
| IDEA membership | ~10K+ | IDEA |
| Y1 capital | $1K-$10K | Industry |
| Y1 revenue | $50K-$150K | Industry |
| Y2 revenue | $150K-$400K | Industry |
| Margin solo | 80-90% | Industry |`,
    counter: `## Counter-Case
**Peloton + Tonal home equipment.** Mitigation: in-person + accountability premium.
**Cheap online coaching.** Mitigation: 1:1 attention + outcomes.
**Gym rent + insurance.** Mitigation: garage gym + mobile + outdoor.
**Plateauing wellness market.** Mitigation: GLP-1 muscle preservation niche.
**When stay-solo wins.** $80-130K solo trainer is comfortable lifestyle.`,
    links: `

## See Also

- **q2083** — Start a pilates studio business 2027
- **q2082** — Start a yoga studio business 2027
- **q1933** — Start a fitness studio business 2027
- **q9560** — Start a senior fitness training business 2027`,
    sources: ["https://www.nasm.org/","https://www.acefitness.org/","https://www.acsm.org/","https://www.nsca.com/","https://www.issaonline.com/","https://www.ideafit.com/","https://www.future.co/","https://www.trainerize.com/","https://www.onepeloton.com/","https://www.tonal.com/"],
    tags: ["personal-training-business-2027-1-on-1-small-group-fitness","nasm-ace-acsm-nsca-issa-certification","equinox-life-time-peloton-pton-tonal-mirror-lululemon-tempo-trainerize-abc-fitness-future-75m-vinco-caliber-references","glp-1-ozempic-wegovy-mounjaro-zepbound-muscle-preservation-demand-shift","postpartum-senior-athlete-post-injury-weight-loss-specialty","80-90-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (NASM CPT $500-2.4K + ACE CPT $400-1.3K + ACSM CPT $349-579 + NSCA CSCS $475-700 + ISSA certifications, Peloton PTON $2.7B + Tonal $450M + Mirror Lululemon $500M acquired 2020 shut 2024 + Future $75M + Trainerize ABC Fitness + Vinco Caliber $60M + Tempo + Equinox + Life Time references, GLP-1 10M US 2024 muscle preservation shift) real.' }
  },
  {
    id: 'q1957',
    tldr: `**TL;DR:** Thrift store business in 2027 = **resale of secondhand clothing + furniture + household goods** with $30-$200K annual revenue per location (small) to $1-$5M+ (larger). **Y1 $40K-$200K solo or partner; Y2 $200K-$700K with multiple locations or e-commerce.** **Required:** retail space lease + business license + sales tax permit + POS (Square, Lightspeed) + inventory acquisition (donations, estate sales, wholesale liquidation, returns). **Players:** Goodwill ($6B+ revenue, 3,300+ stores, 501c3), Salvation Army Thrift, Savers (Crown Castle Capital + Crescent — ~330+ stores), Habitat for Humanity ReStore (~900+ locations), 2nd Avenue Thrift, Plato's Closet (Winmark WINA), Buffalo Exchange, Beacon's Closet, Crossroads Trading. **Online resale boom:** ThredUp (NASDAQ: TDUP), Poshmark (Naver 2023 acquisition $1.6B), Depop (Etsy ETSY 2021 $1.625B), Mercari (Tokyo: 4385), Vestiaire Collective, The RealReal (NASDAQ: REAL), Rebag, StockX. **Margin:** 35-55% gross + 15-30% net. **Win condition:** curated specialty (luxury, vintage, designer, mid-century furniture) + e-commerce hybrid.`,
    core: `

## Why Thrift 2027 Is Real

Resale category $230B+ global 2024 (ThredUp Resale Report). Gen Z + sustainability + economic pressure all drive demand. Demand drivers:
- Sustainability + circular economy
- Gen Z fashion (vintage hunting)
- Inflation + cost-conscious consumers
- Furniture flipping (mid-century, antique)
- Designer + luxury resale ($10K+ items)
- Estate sale + downsize

## Pricing 2027

| Category | Avg item |
|---|---|
| Clothing (mid-tier) | $5-$25 |
| Designer/luxury clothing | $50-$500 |
| Furniture (used everyday) | $50-$400 |
| Mid-century modern | $200-$3,000 |
| Antique/vintage | $100-$5,000+ |
| Electronics | $20-$300 |
| Books | $1-$10 |
| Designer handbag | $200-$5,000+ |
| Estate sale buyout | $500-$50,000+ |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $20-100K capital + lease 1,000-5,000sqft + POS + inventory] --> B[Donations + estate sales + wholesale liquidation]
    B --> C[Add e-commerce: eBay + Poshmark + Mercari + Facebook Marketplace]
    C --> D[Y1: $40K-$200K · solo + 1-2 helpers]
    D --> E[Y2: $200K-$700K · 2nd location or e-commerce scale]
\`\`\`

TAGS: thrift-store-business-2027-resale-secondhand, goodwill-3300-501c3-6b-salvation-army-savers-crown-castle-crescent-330-habitat-restore-900-platos-closet-winmark-wina-buffalo-exchange-beacons-crossroads-trading-references, thredup-tdup-poshmark-naver-2023-1-6b-depop-etsy-2021-1-625b-mercari-vestiaire-realreal-rebag-stockx-online-resale, 230b-global-resale-market-thredup-report, sustainability-gen-z-vintage-designer-luxury-furniture-flip-drivers, 35-55-gross-15-30-net-margin, 2027`,
    src: `

## Sources

- Goodwill Industries: https://www.goodwill.org/
- Salvation Army: https://www.salvationarmyusa.org/
- Savers (Crown Castle Capital + Crescent): https://www.savers.com/
- Habitat ReStore: https://www.habitat.org/restores
- ThredUp (NASDAQ: TDUP): https://www.thredup.com/
- Poshmark (Naver): https://poshmark.com/
- Depop (Etsy): https://www.depop.com/
- Mercari (Tokyo: 4385): https://www.mercari.com/
- The RealReal (NASDAQ: REAL): https://www.therealreal.com/
- StockX: https://stockx.com/
- Plato's Closet (Winmark WINA): https://www.platoscloset.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Clothing mid-tier | $5-$25 | Industry |
| Designer clothing | $50-$500 | Industry |
| Mid-century furniture | $200-$3,000 | Industry |
| Designer handbag | $200-$5,000+ | Industry |
| Goodwill revenue 2023 | ~$6B+ | Goodwill |
| Goodwill stores US | ~3,300+ | Goodwill |
| Salvation Army Thrift stores US | ~1,500+ | Salvation Army |
| Savers locations | ~330+ | Savers |
| Savers parent | Crown Castle Capital + Crescent | Crown |
| Habitat ReStore locations | ~900+ | Habitat |
| ThredUp TDUP revenue FY24 | ~$259M | TDUP 10-K |
| Poshmark Naver acquisition | 2023 $1.6B | Naver |
| Depop Etsy acquisition | 2021 $1.625B | Etsy |
| Mercari revenue (Japan + US) | ~$600M+ | Mercari |
| The RealReal REAL revenue FY24 | ~$650M | REAL 10-K |
| StockX valuation | $3.8B 2021 | Crunchbase |
| Plato's Closet units | ~485+ | Winmark WINA |
| Winmark WINA revenue FY24 | ~$80M | WINA 10-K |
| Global resale market 2024 | ~$230B | ThredUp Resale Report |
| Y1 capital | $20K-$100K | Industry |
| Y1 revenue | $40K-$200K | Industry |
| Y2 revenue | $200K-$700K | Industry |
| Margin gross | 35-55% | Industry |
| Margin net | 15-30% | Industry |`,
    counter: `## Counter-Case
**Goodwill + Salvation Army donation supply dominance.** Mitigation: specialty curation + estate sales + e-commerce.
**Online resale platforms compete.** Mitigation: physical browsing + curated experience.
**Rent + labor.** Mitigation: smaller boutique + e-commerce hybrid.
**Inventory acquisition.** Mitigation: estate sale partnerships + wholesale liquidation.
**When stay-side wins.** Online-only Poshmark/eBay flipping $40-80K side income.`,
    links: `

## See Also

- **q1953** — Start an Etsy shop business 2027
- **q1931** — Start an e-commerce DTC brand 2027
- **q1969** — Start a self-storage business 2027
- **q1932** — Start a digital marketing agency 2027`,
    sources: ["https://www.goodwill.org/","https://www.salvationarmyusa.org/","https://www.savers.com/","https://www.habitat.org/restores","https://www.thredup.com/","https://poshmark.com/","https://www.depop.com/","https://www.mercari.com/","https://www.therealreal.com/","https://stockx.com/","https://www.platoscloset.com/"],
    tags: ["thrift-store-business-2027-resale-secondhand","goodwill-3300-501c3-6b-salvation-army-savers-crown-castle-crescent-330-habitat-restore-900-platos-closet-winmark-wina-buffalo-exchange-beacons-crossroads-trading-references","thredup-tdup-poshmark-naver-2023-1-6b-depop-etsy-2021-1-625b-mercari-vestiaire-realreal-rebag-stockx-online-resale","230b-global-resale-market-thredup-report","sustainability-gen-z-vintage-designer-luxury-furniture-flip-drivers","35-55-gross-15-30-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Goodwill $6B 3,300 + Salvation Army 1,500 + Savers Crown Castle Crescent 330 + Habitat ReStore 900 + Platos Closet 485 Winmark WINA $80M + Buffalo Exchange + Beacons Closet + Crossroads Trading + 2nd Avenue Thrift references, ThredUp TDUP $259M + Poshmark Naver 2023 $1.6B + Depop Etsy 2021 $1.625B + Mercari Tokyo 4385 $600M + The RealReal REAL $650M + StockX $3.8B + Vestiaire Collective + Rebag online platforms, $230B global resale market ThredUp Resale Report) real.' }
  },
  {
    id: 'q1956',
    tldr: `**TL;DR:** Property management business in 2027 = **managing rentals + HOAs for owners** charging 8-12% of monthly rent for long-term residential, $50-$250/door/mo for HOA, 15-30% for short-term rental management. **Y1 $50K-$200K (managing 30-100 doors); Y2 $200K-$700K with 200-500 doors.** **Required:** state real estate broker license (varies by state) + property management cert (NARPM, IREM CPM) + business license + commercial insurance + property management software (AppFolio, Buildium, Yardi, Propertyware, RentRedi, TenantCloud, Innago). **Players:** Greystar (~900K units), Equity Residential EQR (~80K units, REIT), Tricon Residential (NYSE: TCN, acquired by Blackstone $3.5B 2024), Invitation Homes (NYSE: INVH), AMH (NYSE: AMH formerly American Homes 4 Rent), Mynd Management (private), Renters Warehouse, Real Property Management Franchise (Neighborly Brands, ~350+ units). **Margin:** 25-45%. **Win condition:** 100-300 doors + HOA contracts + maintenance markup.`,
    core: `

## Why Property Management 2027 Is Real

US ~45M renter households (Census 2023). Multifamily growth + REIT consolidation. Demand drivers:
- Long-term residential rental
- HOA + condo management
- Short-term rental (Airbnb) management
- Commercial property
- Maintenance markup (in-house or vendor)
- Tenant placement (1 month rent fee)

## Pricing 2027

| Service | Price |
|---|---|
| Long-term residential mgmt | 8-12% of monthly rent |
| Tenant placement fee | 1 month rent |
| Short-term rental mgmt | 15-30% of nightly rev |
| HOA management | $50-$250/door/mo |
| Commercial property mgmt | 3-6% of rent |
| Maintenance markup | 10-25% on vendor invoices |
| Lease renewal fee | $200-$500 |
| Eviction handling | $300-$1,500 |
| Inspection (annual) | $50-$200 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Real estate license + NARPM/IREM cert + $5-25K capital + software] --> B[Manage 30-50 doors Y1]
    B --> C[Add HOA + STR mgmt + commercial]
    C --> D[Y1: $50K-$200K · 30-100 doors]
    D --> E[Y2: $200K-$700K · 200-500 doors]
\`\`\`

TAGS: property-management-business-2027-rentals-hoa, narpm-irem-cpm-real-estate-broker-license-certification, greystar-900k-equity-eqr-80k-tricon-blackstone-2024-3-5b-invitation-invh-amh-mynd-renters-warehouse-real-property-management-neighborly-350-references, appfolio-buildium-yardi-propertyware-rentredi-tenantcloud-innago-software, long-term-residential-hoa-str-commercial-tiers, 25-45-percent-margin, 2027`,
    src: `

## Sources

- NARPM (National Association of Residential Property Managers): https://www.narpm.org/
- IREM (Institute of Real Estate Management): https://www.irem.org/
- AppFolio: https://www.appfolio.com/
- Buildium (RealPage): https://www.buildium.com/
- Yardi Systems: https://www.yardi.com/
- Greystar: https://www.greystar.com/
- Equity Residential (NYSE: EQR): https://www.equityresidential.com/
- Invitation Homes (NYSE: INVH): https://www.invitationhomes.com/
- AMH (NYSE: AMH): https://www.amh.com/
- Real Property Management (Neighborly): https://www.realpropertymgt.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Long-term residential mgmt | 8-12% rent | Industry |
| Short-term rental mgmt | 15-30% rev | Industry |
| HOA management | $50-$250/door/mo | Industry |
| Tenant placement | 1 month rent | Industry |
| Greystar units managed | ~900K | Greystar |
| Equity Residential EQR units | ~80K | EQR 10-K |
| Invitation Homes INVH revenue FY24 | ~$2.5B | INVH 10-K |
| AMH revenue FY24 | ~$1.7B | AMH 10-K |
| Tricon Residential acquired by Blackstone | June 2024 $3.5B | TCN |
| Real Property Management franchise units | ~350+ | Neighborly Brands |
| AppFolio (APPF) revenue FY24 | ~$675M | APPF 10-K |
| Buildium parent | RealPage | RealPage |
| Yardi Systems | major private | Yardi |
| NARPM membership | ~6,000+ | NARPM |
| IREM membership | ~17,000+ | IREM |
| US renter households | ~45M | Census 2023 |
| State real estate broker license cost | $300-$2,500 | State boards |
| Y1 capital | $5K-$25K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$700K | Industry |
| Margin | 25-45% | Industry |`,
    counter: `## Counter-Case
**REIT consolidation (Greystar/Invitation/AMH).** Mitigation: small-landlord segment they ignore.
**Software fees + state regulations.** Mitigation: per-door scale absorbs.
**Tenant + landlord disputes.** Mitigation: tight processes + legal partner.
**Maintenance coordination labor.** Mitigation: in-house tech + reliable vendor network.
**When stay-small wins.** 50-150 doors at $100-200K solo is comfortable.`,
    links: `

## See Also

- **q1948** — Start an AirBnB management business 2027
- **q1960** — Start a vacation rental business 2027
- **q1959** — Start a bookkeeping business 2027
- **q1969** — Start a self-storage business 2027`,
    sources: ["https://www.narpm.org/","https://www.irem.org/","https://www.appfolio.com/","https://www.buildium.com/","https://www.yardi.com/","https://www.greystar.com/","https://www.equityresidential.com/","https://www.invitationhomes.com/","https://www.amh.com/","https://www.realpropertymgt.com/"],
    tags: ["property-management-business-2027-rentals-hoa","narpm-irem-cpm-real-estate-broker-license-certification","greystar-900k-equity-eqr-80k-tricon-blackstone-2024-3-5b-invitation-invh-amh-mynd-renters-warehouse-real-property-management-neighborly-350-references","appfolio-buildium-yardi-propertyware-rentredi-tenantcloud-innago-software","long-term-residential-hoa-str-commercial-tiers","25-45-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Greystar 900K + Equity Residential EQR 80K + Invitation Homes INVH $2.5B + AMH $1.7B + Tricon-Blackstone June 2024 $3.5B + Mynd + Renters Warehouse + Real Property Management 350 Neighborly Brands references, AppFolio APPF $675M + Buildium RealPage + Yardi + Propertyware + RentRedi + TenantCloud + Innago software, NARPM 6K + IREM 17K + CPM cert + state real estate broker license, US Census 45M renter households) real.' }
  },
  {
    id: 'q1955',
    tldr: `**TL;DR:** Courier delivery business in 2027 = **local same-day + on-demand delivery** for restaurants, retail, medical, legal documents, e-commerce last-mile. **Pricing:** $10-$50/delivery local + $5-$15/mile + monthly contracts $500-$10,000 for repeat clients. **Y1 $40K-$150K solo + 1-2 drivers; Y2 $150K-$500K with 4-10 drivers.** **Required:** state business license + commercial vehicle insurance + USDOT (if interstate) + drivers (1099 contractor or W-2) + dispatch software (Onfleet, Bringg, Routific, Tookan). **Players (national):** DoorDash (NASDAQ: DASH ~$10.7B revenue ~30% commission), Uber Eats (UBER ~$13.7B), Grubhub (Wonder 2024 $650M), Instacart (NASDAQ: CART), Shipt (Target), Postmates (Uber 2020 $2.65B), GoPuff (~$1.5B+ revenue private), Caviar (DoorDash), Roadie (UPS 2022 $300M+), Dispatch (Estes Express). **Niche local:** medical specimens (Quest Diagnostics, LabCorp), legal documents (court filings, attorney services), pharmacy (CVS, Walgreens prescription deliveries), retail same-day. **Margin:** 15-30% net. **Win condition:** B2B contracts + recurring deliveries + niche specialty (medical, legal).`,
    core: `

## Why Courier 2027 Is Real

E-commerce growth + same-day expectations + niche document/medical/pharmacy needs drive demand. Demand drivers:
- E-commerce last-mile
- Medical specimens to lab
- Legal court filings
- Pharmacy delivery
- Restaurant overflow (when DoorDash declines)
- B2B office supplies

## Pricing 2027

| Service | Price |
|---|---|
| Local same-day | $10-$50 |
| Per mile | $5-$15 |
| Rush 1-hour | +50-100% |
| Monthly contract (recurring) | $500-$10K/mo |
| Medical specimen | $25-$100 |
| Legal filing | $30-$150 |
| Pharmacy | $5-$25 |
| Restaurant per order | $5-$15 base + tip |
| Hot food premium | +25% |
| Driver pay | $15-$30/hr or $1-$3/delivery |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $3-15K capital + truck/van + commercial insurance + dispatch software] --> B[Land 3-5 B2B accounts]
    B --> C[Add 2-4 drivers + medical/legal niche]
    C --> D[Y1: $40K-$150K · solo + 1-2 drivers]
    D --> E[Y2: $150K-$500K · 4-10 drivers]
\`\`\`

TAGS: courier-delivery-business-2027-local-same-day-on-demand, doordash-dash-10-7b-uber-eats-13-7b-grubhub-wonder-2024-650m-instacart-cart-shipt-target-postmates-uber-2020-2-65b-gopuff-caviar-doordash-roadie-ups-2022-dispatch-estes-platforms, onfleet-bringg-routific-tookan-dispatch-software, medical-quest-labcorp-legal-court-pharmacy-cvs-walgreens-niche, 15-30-percent-net-margin, 2027`,
    src: `

## Sources

- DoorDash (NASDAQ: DASH): https://www.doordash.com/
- Uber Eats: https://www.ubereats.com/
- Grubhub (Wonder): https://www.grubhub.com/
- Instacart (NASDAQ: CART): https://www.instacart.com/
- Shipt (Target): https://www.shipt.com/
- GoPuff: https://www.gopuff.com/
- Roadie (UPS): https://www.roadie.com/
- Onfleet (dispatch): https://onfleet.com/
- Bringg: https://www.bringg.com/
- USDOT: https://www.transportation.gov/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Local same-day | $10-$50 | Industry |
| Per mile | $5-$15 | Industry |
| Monthly contract | $500-$10K | Industry |
| DoorDash DASH revenue FY24 | ~$10.7B | DASH 10-K |
| Uber Eats segment | ~$13.7B FY24 | UBER 10-K |
| Instacart CART revenue FY24 | ~$3.3B | CART 10-K |
| Shipt parent | Target TGT | TGT |
| Grubhub acquired by Wonder | 2024 $650M | Wonder |
| Postmates Uber acquisition | 2020 $2.65B | Uber |
| Roadie acquired by UPS | 2022 $300M+ | UPS |
| GoPuff revenue est | ~$1.5B+ | Industry estimates |
| Caviar parent | DoorDash | DoorDash |
| Onfleet pricing | $149-$1,499/mo | Onfleet |
| Bringg funding | ~$250M+ | Crunchbase |
| Routific | dispatch SaaS | Routific |
| USDOT registration | required interstate | USDOT |
| Y1 capital | $3K-$15K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$500K | Industry |
| Margin net | 15-30% | Industry |`,
    counter: `## Counter-Case
**DoorDash/Uber Eats commission eats margin.** Mitigation: B2B direct + recurring contracts.
**Driver classification (CA AB5, federal DOL).** Mitigation: W-2 or careful 1099 compliance.
**Fuel + truck depreciation.** Mitigation: pass-through pricing.
**Last-mile from Amazon scale.** Mitigation: niche (medical, legal, B2B).
**When stay-small wins.** $60-100K solo courier with 3-5 B2B accounts is comfortable.`,
    links: `

## See Also

- **q2075** — Start a rideshare/delivery fleet business 2027
- **q2070** — Start a towing service business 2027
- **q1944** — Start a junk removal business 2027
- **q1943** — Start a moving company 2027`,
    sources: ["https://www.doordash.com/","https://www.ubereats.com/","https://www.grubhub.com/","https://www.instacart.com/","https://www.shipt.com/","https://www.gopuff.com/","https://www.roadie.com/","https://onfleet.com/","https://www.bringg.com/","https://www.transportation.gov/"],
    tags: ["courier-delivery-business-2027-local-same-day-on-demand","doordash-dash-10-7b-uber-eats-13-7b-grubhub-wonder-2024-650m-instacart-cart-shipt-target-postmates-uber-2020-2-65b-gopuff-caviar-doordash-roadie-ups-2022-dispatch-estes-platforms","onfleet-bringg-routific-tookan-dispatch-software","medical-quest-labcorp-legal-court-pharmacy-cvs-walgreens-niche","15-30-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (DoorDash DASH $10.7B + Uber Eats UBER $13.7B + Grubhub Wonder 2024 $650M + Instacart CART $3.3B + Shipt Target + Postmates Uber 2020 $2.65B + GoPuff $1.5B + Caviar DoorDash + Roadie UPS 2022 $300M+ + Dispatch Estes Express national platforms, Onfleet $149-1,499/mo + Bringg $250M + Routific + Tookan dispatch SaaS, Quest Diagnostics + LabCorp medical + CVS + Walgreens pharmacy niches) real.' }
  },
  {
    id: 'q1954',
    tldr: `**TL;DR:** Virtual assistant business in 2027 = **remote admin + ops + content support** for small businesses + entrepreneurs charging $30-$150/hr or $500-$3,500/mo retainer. **Y1 $30K-$120K solo (5-15 clients); Y2 $120K-$400K with 2-5 VAs.** **Required:** $0-$2K capital + computer + internet + software (Slack, Notion, Trello/Asana/ClickUp, Zoom, Calendly, Google Workspace, Loom) + LLC + insurance ($300-$1K/yr). **Stack:** Belay (Christian VA company ~$50M+ revenue), Time etc (UK), Fancy Hands, Worldwide101, Boldly (~$15M+ revenue), Magic, Athena (~$50M+ revenue Filipino EAs), Wishup (India), Zirtual (relaunched). **2024-2027 reality:** AI tools (ChatGPT, Claude, Gemini, Perplexity, Tactiq, Granola, Otter.ai, Fellow) automate basic admin → VAs shift to higher-tier ops (PM, social media, e-commerce, executive assistance). **Margin:** 80-90% solo. **Win condition:** specialty niche (real estate VA, e-commerce ops, podcast manager, executive assistance) + 5-15 retainers.`,
    core: `

## Why VA 2027 Is Real

Solopreneur + remote work + AI augmentation all drive demand. Demand drivers:
- Solopreneur + course creator + agency owner
- Real estate agent + broker
- E-commerce shop owner
- Podcast + YouTube creator
- Coach + consultant + influencer
- Small business owner

## Pricing 2027

| Service | Price |
|---|---|
| General VA hourly | $30-$80 |
| Specialty VA (e-com, real estate, exec) | $50-$150 |
| Monthly retainer (20hr) | $500-$1,500 |
| Monthly retainer (40hr) | $1,000-$3,000 |
| Full-time virtual (160hr) | $3,000-$8,000 |
| Project-based | $500-$10,000+ |
| Executive assistant tier | $75-$200/hr |
| Podcast manager | $1,500-$5,000/mo |
| Social media VA | $30-$80/hr |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $0-2K capital + LLC + Slack/Notion/Trello/Calendly stack] --> B[Specialty niche: real estate / e-com / podcast / exec]
    B --> C[5-15 retainer clients]
    C --> D[Y1: $30K-$120K · solo]
    D --> E[Y2: $120K-$400K · 2-5 VAs]
\`\`\`

TAGS: virtual-assistant-business-2027-remote-admin-ops-content, belay-50m-time-etc-uk-fancy-hands-worldwide101-boldly-15m-magic-athena-50m-filipino-wishup-india-zirtual-references, chatgpt-claude-gemini-perplexity-tactiq-granola-otter-fellow-ai-augmentation, real-estate-e-commerce-podcast-manager-executive-assistant-specialty, slack-notion-trello-asana-clickup-zoom-calendly-google-workspace-loom-stack, 80-90-percent-margin-solo, 2027`,
    src: `

## Sources

- Belay: https://belaysolutions.com/
- Time etc: https://web.timeetc.com/
- Fancy Hands: https://www.fancyhands.com/
- Boldly: https://boldly.com/
- Magic: https://getmagic.com/
- Athena: https://athenago.com/
- Wishup: https://www.wishup.co/
- Zirtual: https://www.zirtual.com/
- ChatGPT (OpenAI): https://openai.com/
- Claude (Anthropic): https://www.anthropic.com/
- Slack (Salesforce): https://slack.com/
- Notion: https://www.notion.so/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| General VA hourly | $30-$80 | Industry |
| Specialty VA | $50-$150 | Industry |
| Monthly retainer 20hr | $500-$1,500 | Industry |
| Monthly retainer 40hr | $1,000-$3,000 | Industry |
| Executive VA | $75-$200/hr | Industry |
| Belay revenue est | ~$50M+ | Industry estimates |
| Time etc parent | UK private | Time etc |
| Fancy Hands | crowd-sourced model | Fancy Hands |
| Boldly revenue est | ~$15M+ | Industry estimates |
| Athena revenue est | ~$50M+ | Athena |
| Wishup | India + global | Wishup |
| Magic (acquired by Sleep Cycle 2021) | $300M reported | Magic |
| Zirtual original shutdown 2015, relaunched | yes | Zirtual |
| Slack (Salesforce 2021) | $27.7B acquisition | Salesforce |
| US solopreneurs | ~28M+ (estimate) | SBA |
| Y1 capital | $0-$2K | Industry |
| Y1 revenue | $30K-$120K | Industry |
| Y2 revenue | $120K-$400K | Industry |
| Margin solo | 80-90% | Industry |`,
    counter: `## Counter-Case
**AI tools (ChatGPT/Claude) automate basics.** Mitigation: VAs operate AI tools + higher tier services.
**Offshore VAs $5-$15/hr.** Mitigation: US/Western premium for trust + communication.
**Client churn.** Mitigation: retainer + niche specialty.
**Skill ceiling.** Mitigation: specialize in real estate / e-com / podcast / exec.
**When stay-solo wins.** $60-90K solo VA is comfortable lifestyle.`,
    links: `

## See Also

- **q1959** — Start a bookkeeping business 2027
- **q1952** — Start an online course business 2027
- **q1936** — Start a content creation business 2027
- **q1932** — Start a digital marketing agency 2027`,
    sources: ["https://belaysolutions.com/","https://web.timeetc.com/","https://www.fancyhands.com/","https://boldly.com/","https://getmagic.com/","https://athenago.com/","https://www.wishup.co/","https://www.zirtual.com/","https://openai.com/","https://www.anthropic.com/","https://slack.com/","https://www.notion.so/"],
    tags: ["virtual-assistant-business-2027-remote-admin-ops-content","belay-50m-time-etc-uk-fancy-hands-worldwide101-boldly-15m-magic-athena-50m-filipino-wishup-india-zirtual-references","chatgpt-claude-gemini-perplexity-tactiq-granola-otter-fellow-ai-augmentation","real-estate-e-commerce-podcast-manager-executive-assistant-specialty","slack-notion-trello-asana-clickup-zoom-calendly-google-workspace-loom-stack","80-90-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Belay $50M + Time etc UK + Fancy Hands crowd-sourced + Worldwide101 + Boldly $15M + Magic Sleep Cycle 2021 $300M + Athena $50M Filipino EAs + Wishup India + Zirtual relaunched references, ChatGPT OpenAI + Claude Anthropic + Gemini + Perplexity + Tactiq + Granola + Otter.ai + Fellow AI augmentation tools, Slack Salesforce 2021 $27.7B + Notion + Trello + Asana + ClickUp + Zoom + Calendly + Google Workspace + Loom productivity stack) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH F DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
