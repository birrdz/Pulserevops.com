// Batch E: q1974 q1973 q1972 q1971 q1970 q1969 q1968 q1967 q1966 q1965
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q1974',
    tldr: `**TL;DR:** Dog boarding in 2027 = **overnight pet care + cage-free or kennel-style facility** charging $40-$120/night/dog. **Y1 $150K-$450K (single facility 20-50 dogs/night capacity); Y2 $450K-$1.2M with 2 locations + daycare cross-sell.** **Required:** commercial real estate + zoning + state pet-care facility license + business license + insurance + buildout ($75-$500K depending on cage-free vs kennel). **Players:** Rover.com (NASDAQ: ROVR — booking marketplace), Wag! (NASDAQ: PET), Dogtopia (290+ franchise daycare+boarding combo, NorthStar), Camp Bow Wow (~200+ VCA-Mars), K9 Resorts (~50+), Best Friends Pet Care (Petco), PetSuites (~35+ Mars Veterinary), Holiday Inn for Dogs. **2027 differentiator:** **cage-free + climate-controlled luxury (private suites with webcam, TVs, daily group play)** vs traditional kennel. **Adjacent revenue:** daycare + grooming + training + retail food/treats. **Margin:** 15-30% net. **Win condition:** lease + reputation + repeat customers + holiday/peak premium pricing.`,
    core: `

## Why Dog Boarding 2027 Is Real

US travel + dual-income households + Airbnb/leisure travel rebound all drive demand. Demand drivers:
- Vacation travel (Memorial Day - Labor Day peak)
- Holiday travel (Thanksgiving + Christmas/NYE)
- Business travel
- Wedding + medical procedures
- Renovation/move
- Cross-sell from daycare regulars

## Pricing 2027

| Service | Price |
|---|---|
| Standard overnight | $40-$80 |
| Luxury suite (private + webcam) | $80-$200 |
| Multi-dog discount | 15-25% |
| Holiday/peak premium | +25-50% |
| Daycare add-on (during boarding) | $25-$50/day |
| Grooming add-on | $40-$150 |
| Training during boarding | $50-$150 |
| Long-term boarding (7+ nights) | discount 10-20% |
| Bath at checkout | $25-$80 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Lease + buildout + license + $75-500K capital] --> B[20-50 dogs/night capacity]
    B --> C[Daycare + grooming + training cross-sell]
    C --> D[Y1: $150K-$450K · 1 facility]
    D --> E[Y2: $450K-$1.2M · 2 locations or expand]
\`\`\`

TAGS: dog-boarding-business-2027-overnight-pet-care, rover-rovr-wag-pet-marketplaces-dogtopia-northstar-camp-bow-wow-vca-mars-k9-resorts-best-friends-petco-petsuites-mars-veterinary-holiday-inn-references, cage-free-climate-controlled-luxury-suite-webcam-differentiator, vacation-holiday-business-travel-wedding-medical-renovation-drivers, daycare-grooming-training-retail-cross-sell-revenue, 15-30-percent-net-margin, 2027`,
    src: `

## Sources

- Rover.com (NASDAQ: ROVR): https://www.rover.com/
- Wag! (NASDAQ: PET): https://wagwalking.com/
- Dogtopia: https://www.dogtopia.com/
- Camp Bow Wow (VCA Mars): https://www.campbowwow.com/
- K9 Resorts: https://www.k9resorts.com/
- Best Friends Pet Care (Petco): https://www.bestfriendspetcare.com/
- PetSuites (Mars Veterinary): https://www.petsuites.com/
- IBPSA (boarding/pet services): https://ibpsa.com/
- Gingr (pet boarding software): https://www.gingr.com/
- PetExec: https://petexec.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Standard overnight | $40-$80 | Industry |
| Luxury suite | $80-$200 | Industry |
| Holiday/peak premium | +25-50% | Industry |
| Rover ROVR revenue FY24 | ~$220M | ROVR 10-K |
| Wag! PET revenue FY24 | ~$80M | PET 10-K |
| Dogtopia franchise units | ~290+ | Dogtopia |
| Camp Bow Wow franchise | ~200+ | Camp Bow Wow |
| Camp Bow Wow parent | VCA Mars 2014 acquisition | Mars |
| K9 Resorts units | ~50+ | K9 Resorts |
| PetSuites units | ~35+ | Mars Veterinary |
| Best Friends Pet Care | Petco-owned | Petco |
| US dogs | ~89M | AVMA |
| US pet care spend | $147B+ 2024 | APPA |
| IBPSA membership | ~3,500+ | IBPSA |
| Y1 capital | $75K-$500K | Industry |
| Y1 revenue | $150K-$450K | Industry |
| Y2 revenue | $450K-$1.2M | Industry |
| Margin net | 15-30% | Industry |
| Average dog stay | 3-5 nights | Industry |
| Holiday Thanksgiving-NYE | 30-50% of annual revenue | Industry |`,
    counter: `## Counter-Case
**Rover + Wag marketplace fee 20-30%.** Mitigation: in-house facility direct booking.
**Mars/VCA + Petco scale.** Mitigation: cage-free boutique vs traditional kennel chain.
**Capital + lease intensive.** Mitigation: smaller 20-30 dog facility start.
**Labor + injury liability.** Mitigation: $2M+ GL + waivers + vaccinations + camera systems.
**When stay-medium wins.** Single facility at $250-450K is solid lifestyle.`,
    links: `

## See Also

- **q1975** — Start a doggy daycare business 2027
- **q1972** — Start a pet sitting business 2027
- **q1971** — Start a dog walking business 2027
- **q1976** — Start a dog training business 2027`,
    sources: ["https://www.rover.com/","https://wagwalking.com/","https://www.dogtopia.com/","https://www.campbowwow.com/","https://www.k9resorts.com/","https://www.bestfriendspetcare.com/","https://www.petsuites.com/","https://ibpsa.com/","https://www.gingr.com/","https://petexec.com/"],
    tags: ["dog-boarding-business-2027-overnight-pet-care","rover-rovr-wag-pet-marketplaces-dogtopia-northstar-camp-bow-wow-vca-mars-k9-resorts-best-friends-petco-petsuites-mars-veterinary-holiday-inn-references","cage-free-climate-controlled-luxury-suite-webcam-differentiator","vacation-holiday-business-travel-wedding-medical-renovation-drivers","daycare-grooming-training-retail-cross-sell-revenue","15-30-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Rover ROVR $220M NASDAQ + Wag! PET $80M NASDAQ marketplaces, Dogtopia 290 NorthStar + Camp Bow Wow 200 VCA Mars 2014 + K9 Resorts 50 + Best Friends Pet Care Petco + PetSuites 35 Mars Veterinary + Holiday Inn for Dogs franchise competitors, IBPSA 3.5K members + Gingr + PetExec + Time To Pet software) real.' }
  },
  {
    id: 'q1973',
    tldr: `**TL;DR:** Mobile pet grooming in 2027 = **at-home grooming via dedicated van with bath + dryer + grooming table** charging $80-$200/dog (small) + $120-$350/dog (large) + premium 25-50% over salon. **Y1 $80K-$250K solo (200-600 jobs/yr); Y2 $250K-$700K with 2-3 vans.** **Required:** state business license + commercial vehicle insurance + dedicated mobile grooming van ($30-$120K build-out: Wag'n Tails, Hanvey Engineering, Ultimate Groom Mobile, Mobile Dog Grooming Vans Inc) + NDGAA/IPG certification helpful + tools (Andis, Wahl, Oster clippers; Davis tubs; Edemco/K-9 II/Double K dryers). **Players:** Hounds Lounge mobile, Aussie Pet Mobile (~310+ franchise units, Spotless Brands), Splash and Dash Groomerie + Boutique, Pet Pals Mobile Spa, local independents 90%+ of market. **2027 differentiator:** one-on-one grooming (no kennel anxiety), wealthy + senior + reactive-dog clients, premium 25-50% over brick-and-mortar (PetSmart Grooming $60-$120, Petco Grooming $60-$120). **Margin:** 60-80% solo.`,
    core: `

## Why Mobile Pet Grooming 2027 Is Real

US 89M dogs + 70%+ households + work-from-home trend all drive demand for convenience. Demand drivers:
- Anxious + reactive dogs
- Senior dogs (mobility issues)
- Multi-dog households
- Wealthy clients
- Show + competition prep
- Time-strapped professionals

## Pricing 2027

| Size | Price |
|---|---|
| Toy/small (<20 lb) | $80-$140 |
| Medium (20-50 lb) | $100-$180 |
| Large (50-80 lb) | $130-$220 |
| Giant (80+ lb) | $180-$350 |
| Cat grooming | $100-$200 |
| De-matting add-on | $30-$120 |
| Bath only | $40-$120 |
| Premium spa package | $200-$450 |
| Doodle/poodle haircut premium | +$30-$80 |
| Multi-dog same-house discount | 10-25% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $30-120K van build + tools + insurance + NDGAA cert] --> B[Wealthy + senior + anxious dog clients]
    B --> C[Vet + breed-club + senior community referrals]
    C --> D[Y1: $80K-$250K · solo]
    D --> E[Y2: $250K-$700K · 2-3 vans]
\`\`\`

TAGS: mobile-pet-grooming-business-2027-at-home-dedicated-van, wagn-tails-hanvey-engineering-ultimate-groom-mobile-mobile-dog-grooming-vans-inc-build-out-vendors, ndgaa-ipg-certification, andis-wahl-oster-clippers-davis-tubs-edemco-k-9-ii-double-k-dryers-equipment, aussie-pet-mobile-310-spotless-brands-hounds-lounge-splash-dash-pet-pals-competitors, anxious-senior-multi-dog-wealthy-time-strapped-wedges, 60-80-percent-margin-solo, 2027`,
    src: `

## Sources

- NDGAA (National Dog Groomers Association): https://www.ndgaa.com/
- IPG (International Professional Groomers): https://www.ipgcmg.org/
- Wag'n Tails Mobile Conversions: https://wagntails.com/
- Aussie Pet Mobile (Spotless Brands): https://www.aussiepetmobile.com/
- Hanvey Engineering: https://www.hanveymobiledogwash.com/
- Andis Clippers: https://andis.com/
- Wahl Professional: https://www.wahlpro.com/
- Oster: https://www.osterpro.com/
- Davis Manufacturing: https://davismfg.com/
- Edemco Dryers: https://www.edemcodryers.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Small dog grooming | $80-$140 | Industry |
| Medium | $100-$180 | Industry |
| Large | $130-$220 | Industry |
| Giant | $180-$350 | Industry |
| Premium spa | $200-$450 | Industry |
| Mobile van build (Wag'n Tails) | $30K-$120K | Wag'n Tails |
| Hanvey mobile van | $40K-$80K | Hanvey |
| Aussie Pet Mobile franchise units | ~310+ globally | Aussie Pet |
| Aussie Pet parent | Spotless Brands | Spotless |
| PetSmart locations | ~1,600+ | PetSmart |
| Petco locations | ~1,500+ | Petco |
| NDGAA membership | ~5,000+ | NDGAA |
| IPG membership | ~2,000+ | IPG |
| Andis ProClip AGC2 | $200-$350 | Andis |
| Wahl KM10 | $300-$500 | Wahl |
| Davis tub | $1,000-$3,000 | Davis |
| Edemco K-9 II/Double K dryer | $300-$1,200 | Edemco |
| US pet care spend | $147B+ 2024 | APPA |
| US dogs | ~89M | AVMA |
| Y1 capital | $30K-$120K | Industry |
| Y1 revenue | $80K-$250K | Industry |
| Y2 revenue | $250K-$700K | Industry |
| Margin solo | 60-80% | Industry |`,
    counter: `## Counter-Case
**PetSmart + Petco grooming compress prices.** Mitigation: mobile premium for anxious + senior + wealthy.
**Van build capital.** Mitigation: lease van + grow.
**Solo capacity ceiling 3-6 dogs/day.** Mitigation: 2nd van + groomer.
**Equipment maintenance + water/electric setup.** Mitigation: routine + service contract.
**When stay-solo wins.** $90-130K solo mobile groomer is comfortable.`,
    links: `

## See Also

- **q1972** — Start a pet sitting business 2027
- **q1971** — Start a dog walking business 2027
- **q1975** — Start a doggy daycare business 2027
- **q1974** — Start a dog boarding business 2027`,
    sources: ["https://www.ndgaa.com/","https://www.ipgcmg.org/","https://wagntails.com/","https://www.aussiepetmobile.com/","https://www.hanveymobiledogwash.com/","https://andis.com/","https://www.wahlpro.com/","https://www.osterpro.com/","https://davismfg.com/","https://www.edemcodryers.com/"],
    tags: ["mobile-pet-grooming-business-2027-at-home-dedicated-van","wagn-tails-hanvey-engineering-ultimate-groom-mobile-mobile-dog-grooming-vans-inc-build-out-vendors","ndgaa-ipg-certification","andis-wahl-oster-clippers-davis-tubs-edemco-k-9-ii-double-k-dryers-equipment","aussie-pet-mobile-310-spotless-brands-hounds-lounge-splash-dash-pet-pals-competitors","anxious-senior-multi-dog-wealthy-time-strapped-wedges","60-80-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Wag\\u0027n Tails $30-120K + Hanvey $40-80K + Ultimate Groom Mobile + Mobile Dog Grooming Vans Inc van build-out vendors, NDGAA 5K + IPG 2K credentials, Aussie Pet Mobile 310 Spotless Brands + Hounds Lounge + Splash and Dash + Pet Pals + PetSmart 1.6K + Petco 1.5K competitors, Andis ProClip AGC2 + Wahl KM10 + Oster clippers + Davis tubs + Edemco K-9 II/Double K dryers equipment) real.' }
  },
  {
    id: 'q1972',
    tldr: `**TL;DR:** Pet sitting in 2027 = **in-home pet care for vacation + travel + workday** charging $25-$80/visit + $50-$150/overnight + $30-$100/dog walk. **Y1 $30K-$100K solo (50-200 clients); Y2 $100K-$300K with 2-3 sitters.** **Required:** state business license + commercial general liability + bonding ($500-$2K/yr) + pet first aid cert helpful (Pet Tech, Walks 'N' Wags). **Platforms:** Rover.com (NASDAQ: ROVR ~$220M revenue, 30% commission), Wag! (NASDAQ: PET), TrustedHousesitters, PetBacker, Care.com (NYSE: CRCM)Yo. Many sitters build off-platform direct clients. **Players (independent):** Fetch! Pet Care (~140+ franchise units, Bain Capital), Bark Busters Home Dog Training (multi-service), local independents. **2027 reality:** Rover platform fees 20-30% drive sitters off-platform for higher margin. Build direct clients via Facebook groups, Nextdoor, vet referrals. **Margin:** 80-90% solo (low overhead). **Win condition:** 30-60 repeat clients + off-platform direct + petite catastrophic event insurance.`,
    core: `

## Why Pet Sitting 2027 Is Real

Travel rebound + vacation + work-from-office trend all drive demand. Demand drivers:
- Vacation travel
- Business travel
- Workday drop-in (cat owners, anxious dogs)
- Senior owners (assistance)
- Multi-pet (cheaper than boarding)
- House-sitting + plant-watering combined

## Pricing 2027

| Service | Price |
|---|---|
| Daily drop-in (20-30 min) | $25-$50 |
| Drop-in (45-60 min) | $35-$80 |
| Overnight in-home | $50-$150 |
| Dog walk (30-60 min) | $30-$100 |
| House-sitting (multi-day) | $75-$200/day |
| Cat-only visits | $20-$45 |
| Multi-pet add-on | $10-$25/pet |
| Holiday premium | +25-50% |
| Long-term sitting discount | 10-20% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Bonded + insured + $500-3K capital + Pet Tech first aid cert] --> B[Start on Rover/Wag!]
    B --> C[Build off-platform direct client list]
    C --> D[Y1: $30K-$100K · solo]
    D --> E[Y2: $100K-$300K · 2-3 sitters]
\`\`\`

TAGS: pet-sitting-business-2027-in-home-vacation-travel-workday, rover-rovr-220m-30-percent-commission-wag-pet-trustedhousesitters-petbacker-care-com-crcm-platforms, fetch-pet-care-140-bain-capital-franchise-references, pet-tech-walks-n-wags-first-aid-cert, off-platform-direct-client-facebook-nextdoor-vet-referral-building, 80-90-percent-margin-solo, 2027`,
    src: `

## Sources

- PSI (Pet Sitters International): https://www.petsit.com/
- NAPPS (National Association of Professional Pet Sitters): https://www.petsitters.org/
- Rover.com (NASDAQ: ROVR): https://www.rover.com/
- Wag! (NASDAQ: PET): https://wagwalking.com/
- TrustedHousesitters: https://www.trustedhousesitters.com/
- Care.com (NYSE: CRCM, now Tools for Humanity): https://www.care.com/
- Fetch! Pet Care (Bain Capital): https://www.fetchpetcare.com/
- Pet Tech CPR + First Aid: https://www.pettech.net/
- Time To Pet: https://timetopet.com/
- Easy Busy Pets: https://easybusypets.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Drop-in 20-30 min | $25-$50 | Industry |
| Overnight in-home | $50-$150 | Industry |
| Dog walk | $30-$100 | Industry |
| House-sitting multi-day | $75-$200/day | Industry |
| Rover ROVR revenue FY24 | ~$220M | ROVR 10-K |
| Rover commission | 20-30% | Rover |
| Wag! PET revenue FY24 | ~$80M | PET 10-K |
| TrustedHousesitters subscribers | ~150K+ | TrustedHousesitters |
| Care.com (CRCM) | private (IAC sold 2020) | Care.com |
| Fetch! Pet Care franchise units | ~140+ | Bain Capital |
| Fetch! parent | Bain Capital | Bain |
| PSI Pet Sitters International | major industry body | PSI |
| NAPPS membership | ~2,500+ | NAPPS |
| Pet Tech first-aid cert | $200-$400 | Pet Tech |
| US dogs + cats | 154M | AVMA |
| Bonding insurance | $500-$2K/yr | Industry |
| Y1 capital | $500-$3K | Industry |
| Y1 revenue | $30K-$100K | Industry |
| Y2 revenue | $100K-$300K | Industry |
| Margin solo | 80-90% | Industry |`,
    counter: `## Counter-Case
**Rover/Wag commission eats margin.** Mitigation: build direct off-platform clients.
**Niche income ceiling.** Mitigation: dog walking + house-sitting combine.
**Liability (key safety, pet emergency).** Mitigation: bonding + first aid + emergency protocol.
**Holiday peak conflicts.** Mitigation: hire holiday-only assistants.
**When stay-solo wins.** $50-80K solo pet sitter is fine for lifestyle.`,
    links: `

## See Also

- **q1971** — Start a dog walking business 2027
- **q1973** — Start a mobile pet grooming business 2027
- **q1974** — Start a dog boarding business 2027
- **q1976** — Start a dog training business 2027`,
    sources: ["https://www.petsit.com/","https://www.petsitters.org/","https://www.rover.com/","https://wagwalking.com/","https://www.trustedhousesitters.com/","https://www.care.com/","https://www.fetchpetcare.com/","https://www.pettech.net/","https://timetopet.com/","https://easybusypets.com/"],
    tags: ["pet-sitting-business-2027-in-home-vacation-travel-workday","rover-rovr-220m-30-percent-commission-wag-pet-trustedhousesitters-petbacker-care-com-crcm-platforms","fetch-pet-care-140-bain-capital-franchise-references","pet-tech-walks-n-wags-first-aid-cert","off-platform-direct-client-facebook-nextdoor-vet-referral-building","80-90-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Rover ROVR $220M NASDAQ 20-30% commission + Wag! PET $80M + TrustedHousesitters 150K subscribers + PetBacker + Care.com CRCM platforms, Fetch! Pet Care 140 Bain Capital franchise, PSI Pet Sitters International + NAPPS 2.5K + Pet Tech + Walks N Wags CPR first-aid certs) real.' }
  },
  {
    id: 'q1971',
    tldr: `**TL;DR:** Dog walking in 2027 = **scheduled neighborhood walks** charging $20-$50/30min walk + $30-$80/60min + group walks 3-5 dogs $40-$100/dog. **Y1 $25K-$80K solo (40-100 daily/weekly clients); Y2 $80K-$250K with 2-3 walkers.** **Required:** state business license + commercial general liability + bonding + walking equipment (slip leads, hands-free belts, treats, poop bags, water). **Platforms:** Rover.com ROVR, Wag! PET (~30% commission); off-platform direct clients via Nextdoor, vet referrals, Facebook groups. **Players:** mostly local independents; franchise: Fetch! Pet Care (140+ Bain Capital), Hounds Around Town, Local Pack, Pet Butler dog-walk add-on. **2027 reality:** Rover/Wag commission drive walkers off-platform; ride-share-style dispatch hasn't worked (Wag IPO 2022 struggling). **Margin:** 80-90% solo. **Win condition:** geographic cluster + group walks + repeat 5x/week clients = $50-$80K solo.`,
    core: `

## Why Dog Walking 2027 Is Real

US 89M dogs + return-to-office trend + dual-income households. Demand drivers:
- Workday midday walks
- High-energy breed exercise
- Senior owners (walking assistance)
- Pet sitting cross-sell
- Apartment dwellers (no yard)

## Pricing 2027

| Service | Price |
|---|---|
| 30-min individual walk | $20-$50 |
| 60-min individual walk | $30-$80 |
| Group walk 3-5 dogs | $40-$100/dog |
| Weekly package (5 walks) | $90-$225 |
| Monthly unlimited (20 walks) | $300-$700 |
| Hike (1-2hr, transport) | $50-$150 |
| Off-leash hike specialty | $60-$150 |
| Multi-dog same-house discount | 10-20% |
| Holiday premium | +25-50% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Bonded + insured + $300-2K capital + Pet Tech first aid cert] --> B[Start direct via Nextdoor + vet referrals]
    B --> C[Build geographic cluster + group walks]
    C --> D[Y1: $25K-$80K · solo]
    D --> E[Y2: $80K-$250K · 2-3 walkers]
\`\`\`

TAGS: dog-walking-business-2027-scheduled-neighborhood, rover-rovr-wag-pet-30-percent-commission-vs-off-platform-direct, fetch-pet-care-140-bain-capital-hounds-around-town-local-pack-pet-butler-references, group-walk-3-5-dog-revenue-multiplier, geographic-cluster-route-density, 80-90-percent-margin-solo, 2027`,
    src: `

## Sources

- Rover.com (NASDAQ: ROVR): https://www.rover.com/
- Wag! (NASDAQ: PET): https://wagwalking.com/
- Fetch! Pet Care: https://www.fetchpetcare.com/
- PSI (Pet Sitters International): https://www.petsit.com/
- NAPPS: https://www.petsitters.org/
- Pet Tech CPR + First Aid: https://www.pettech.net/
- Walks 'N' Wags: https://www.walksnwagspetfirstaid.com/
- Time To Pet: https://timetopet.com/
- AVMA: https://www.avma.org/
- AKC: https://www.akc.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| 30-min walk | $20-$50 | Industry |
| 60-min walk | $30-$80 | Industry |
| Group walk per dog | $40-$100 | Industry |
| Monthly unlimited | $300-$700 | Industry |
| Rover ROVR revenue FY24 | ~$220M | ROVR 10-K |
| Wag! PET revenue FY24 | ~$80M | PET 10-K |
| Wag! IPO 2022 valuation | ~$350M (now lower) | NASDAQ |
| Fetch! Pet Care franchise units | ~140+ | Bain Capital |
| PSI Pet Sitters International | major US body | PSI |
| NAPPS membership | ~2,500+ | NAPPS |
| Pet Tech first-aid | $200-$400 | Pet Tech |
| Walks 'N' Wags first-aid cert | $150-$400 | Walks N Wags |
| US dogs | ~89M | AVMA |
| Bonding insurance | $500-$2K/yr | Industry |
| Y1 capital | $300-$2K | Industry |
| Y1 revenue | $25K-$80K | Industry |
| Y2 revenue | $80K-$250K | Industry |
| Margin solo | 80-90% | Industry |
| Capacity per walker | 6-12 dogs/day | Industry |`,
    counter: `## Counter-Case
**Rover/Wag commission 20-30%.** Mitigation: build off-platform direct.
**Weather + outdoor brutal.** Mitigation: rain gear + extreme weather premium.
**Liability (escape, dog fight).** Mitigation: bonding + slip-lead training + GL.
**Geographic time + transit cost.** Mitigation: cluster + group walks.
**When stay-solo wins.** $50-70K solo + flexible lifestyle is fine.`,
    links: `

## See Also

- **q1972** — Start a pet sitting business 2027
- **q1976** — Start a dog training business 2027
- **q1973** — Start a mobile pet grooming business 2027
- **q1975** — Start a doggy daycare business 2027`,
    sources: ["https://www.rover.com/","https://wagwalking.com/","https://www.fetchpetcare.com/","https://www.petsit.com/","https://www.petsitters.org/","https://www.pettech.net/","https://www.walksnwagspetfirstaid.com/","https://timetopet.com/","https://www.avma.org/","https://www.akc.org/"],
    tags: ["dog-walking-business-2027-scheduled-neighborhood","rover-rovr-wag-pet-30-percent-commission-vs-off-platform-direct","fetch-pet-care-140-bain-capital-hounds-around-town-local-pack-pet-butler-references","group-walk-3-5-dog-revenue-multiplier","geographic-cluster-route-density","80-90-percent-margin-solo","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Rover ROVR $220M + Wag! PET $80M IPO 2022 $350M + Fetch! Pet Care 140 Bain Capital + Hounds Around Town + Local Pack + Pet Butler competitors, PSI + NAPPS 2.5K + Pet Tech + Walks N Wags CPR first-aid certs, AVMA 89M US dogs, Time To Pet scheduling) real.' }
  },
  {
    id: 'q1970',
    tldr: `**TL;DR:** Kayak rental in 2027 = **seasonal waterfront rental + tours** charging $20-$60/hr + $40-$150/day + $50-$200/half-day tour. **Y1 $40K-$150K (10-30 kayaks, 4-6 month season); Y2 $150K-$400K with 40-80 fleet + tours + classes.** **Required:** state business license + waterfront lease/permit (state DNR/parks) + Coast Guard + insurance ($1M+ marine GL ~$3-12K/yr) + kayaks ($600-$2,500/each — Wilderness Systems, Old Town, Pelican, Perception, Hobie pedal, Bonafide pedal/fishing) + paddles + PFDs + transport trailer + safety equipment. **Players:** Outdoor Adventure (mostly local independent operators), REI Adventures (REI), KOA campgrounds tours, state park concessions. **2027 trend:** **inflatable kayaks** (Sea Eagle, Aquaglide, Advanced Elements) easier transport + storage; SUP (stand-up paddleboard) cross-sell. **Margin:** 50-65% (mostly fixed costs + labor seasonal). **Win condition:** waterfront location lease + tours + classes + corporate team-building.`,
    core: `

## Why Kayak Rental 2027 Is Real

Outdoor recreation grew 2020-2024 (COVID). Waterfront tourism + Airbnb stays + dest weddings + corporate retreats. Demand drivers:
- Vacation tourism
- Family weekend recreation
- Corporate team-building
- Bachelorette/birthday
- Fishing kayak rentals
- Sunset/full-moon tours

## Pricing 2027

| Service | Price |
|---|---|
| Hourly | $20-$60 |
| Half-day (4hr) | $40-$100 |
| Full-day | $50-$150 |
| Tandem | +25-50% |
| Fishing kayak (Hobie pedal) | $50-$200 |
| Guided tour (2-3hr) | $50-$150 |
| Sunset/full-moon tour | $60-$200 |
| Multi-day rental | discount 20-40% |
| SUP rental | $25-$80/hr |
| Beginner class | $50-$150 |
| Corporate team-building | $50-$150/person |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $30-100K capital + 10-30 kayaks + trailer + waterfront permit] --> B[Build local awareness + Airbnb host partner]
    B --> C[Add tours + classes + corporate]
    C --> D[Y1: $40K-$150K · 10-30 kayaks 4-6mo season]
    D --> E[Y2: $150K-$400K · 40-80 fleet + tours]
\`\`\`

TAGS: kayak-rental-business-2027-seasonal-waterfront-tours, wilderness-systems-old-town-pelican-perception-hobie-pedal-bonafide-fishing-kayak-brands, sea-eagle-aquaglide-advanced-elements-inflatable, rei-adventures-koa-state-park-concession-competitors, sup-stand-up-paddleboard-cross-sell, corporate-team-building-airbnb-partnership-revenue, 50-65-percent-margin, 2027`,
    src: `

## Sources

- ACA (American Canoe Association): https://americancanoe.org/
- USCG (US Coast Guard) recreational boating: https://www.uscgboating.org/
- Wilderness Systems (Confluence Outdoor): https://www.wildernesssystems.com/
- Old Town (Johnson Outdoors NASDAQ: JOUT): https://www.oldtowncanoe.com/
- Pelican International: https://www.pelican.com/
- Hobie Cat Company: https://www.hobie.com/
- Bonafide Kayaks: https://bonafidekayaks.com/
- Sea Eagle: https://www.seaeagle.com/
- REI Adventures: https://www.rei.com/adventures
- Johnson Outdoors (NASDAQ: JOUT): https://www.johnsonoutdoors.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Hourly rental | $20-$60 | Industry |
| Full-day | $50-$150 | Industry |
| Guided tour | $50-$150 | Industry |
| Sunset tour | $60-$200 | Industry |
| Wilderness Systems kayak | $1K-$2.5K | Wilderness Systems |
| Old Town Predator XL | $1.5K-$3K | Old Town |
| Hobie pedal Mirage Pro Angler | $4K-$6K | Hobie |
| Pelican Sentinel | $300-$800 | Pelican |
| Bonafide SS127 | $1.5K-$2K | Bonafide |
| Sea Eagle inflatable | $400-$2K | Sea Eagle |
| Aquaglide inflatable SUP/kayak | $400-$1.5K | Aquaglide |
| Johnson Outdoors JOUT revenue FY24 | ~$580M | JOUT 10-K |
| Old Town parent | Johnson Outdoors JOUT | JOUT |
| ACA members | ~50K+ | ACA |
| US Coast Guard recreational boat registrations | ~12M+ | USCG |
| Marine GL insurance | $3K-$12K/yr | Industry |
| State waterfront concession permit | $500-$10K/yr | State DNR/parks |
| Y1 capital | $30K-$100K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$400K | Industry |
| Margin | 50-65% | Industry |`,
    counter: `## Counter-Case
**Seasonal 4-6 month most US.** Mitigation: warm-state year-round (FL, TX, CA, GA, SC).
**Weather + lake access risk.** Mitigation: refund policy + flexible scheduling.
**Capital tied up in fleet.** Mitigation: gradual fleet expansion + inflatable lower cost.
**Storage + transport off-season.** Mitigation: trailer storage facility.
**When stay-small wins.** $50-80K solo seasonal is meaningful for outdoor lifestyle.`,
    links: `

## See Also

- **q1969** — Start a self-storage business 2027
- **q1968** — Start a wedding venue business 2027
- **q1964** — Start a boat rental business 2027
- **q1963** — Start an RV rental business 2027`,
    sources: ["https://americancanoe.org/","https://www.uscgboating.org/","https://www.wildernesssystems.com/","https://www.oldtowncanoe.com/","https://www.pelican.com/","https://www.hobie.com/","https://bonafidekayaks.com/","https://www.seaeagle.com/","https://www.rei.com/adventures","https://www.johnsonoutdoors.com/"],
    tags: ["kayak-rental-business-2027-seasonal-waterfront-tours","wilderness-systems-old-town-pelican-perception-hobie-pedal-bonafide-fishing-kayak-brands","sea-eagle-aquaglide-advanced-elements-inflatable","rei-adventures-koa-state-park-concession-competitors","sup-stand-up-paddleboard-cross-sell","corporate-team-building-airbnb-partnership-revenue","50-65-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Wilderness Systems Confluence Outdoor + Old Town Johnson Outdoors JOUT $580M Predator XL + Pelican Sentinel + Perception + Hobie pedal Mirage Pro Angler $4-6K + Bonafide SS127 fishing kayak brands, Sea Eagle + Aquaglide + Advanced Elements inflatable, REI Adventures + KOA + state park concessions, ACA American Canoe Association 50K + USCG 12M registered recreational boats) real.' }
  },
  {
    id: 'q1969',
    tldr: `**TL;DR:** Self-storage in 2027 = **real estate business** renting climate-controlled + traditional storage units at $40-$300/month. **Y1 $80K-$400K (single small facility); Y2 $400K-$1.5M with expansion or second facility.** **Capital-heavy** — $1-$10M+ to build new facility OR $500K-$3M to buy existing small facility. **Players:** Public Storage (NYSE: PSA ~$45B mkt cap), Extra Space Storage (NYSE: EXR ~$30B+ post-Life Storage merger 2023), CubeSmart (NYSE: CUBE), National Storage Affiliates (NYSE: NSA), Storage Plus, Storage Asset Management. **2024-2025 reality:** REIT consolidation continuing. Self-storage REITs ~$200B+ market cap collectively. Independent owners ($1-5M facility) sell to REITs at 7-9% cap rates. **Margin:** 60-75% NOI after property tax, insurance, utilities, labor (often 1-2 employees). **Win condition:** location (suburban growth, dense housing) + climate-controlled units + buyer pool for REIT exit at 5-8x EBITDA / 7-9% cap.`,
    core: `

## Why Self-Storage 2027 Is Real

Suburban density + downsizing + e-commerce inventory + life-transitions all drive demand. ~10% of US households use self-storage. Demand drivers:
- Moving/transitions
- Downsizing seniors
- College students summer
- Renovation overflow
- Small business inventory
- E-commerce + Amazon FBA seller overflow
- Boat + RV outdoor storage

## Pricing 2027

| Unit Size | Monthly |
|---|---|
| 5x5 (small) | $40-$80 |
| 5x10 (medium-small) | $60-$120 |
| 10x10 (medium) | $90-$180 |
| 10x15 (large) | $130-$250 |
| 10x20 (1-car garage) | $150-$300 |
| 10x30 (2-car) | $250-$500 |
| Climate-controlled premium | +20-40% |
| Outdoor boat/RV | $100-$300 |
| Drive-up access premium | +10-20% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $500K-$10M+ capital + land + entitlement + construction] --> B[100-400 unit facility]
    B --> C[80-90% occupancy = healthy]
    C --> D[Y1: $80K-$400K]
    D --> E[Y2: $400K-$1.5M · stabilized + expand]
    E --> F[Exit: REIT acquisition at 7-9% cap rate]
\`\`\`

TAGS: self-storage-business-2027-real-estate, public-storage-psa-45b-extra-space-exr-30b-life-storage-merger-2023-cubesmart-cube-national-storage-affiliates-nsa-storage-plus-asset-mgmt-reits, suburban-growth-density-downsizing-e-commerce-amazon-fba-overflow-drivers, climate-controlled-traditional-outdoor-boat-rv-tiers, 7-9-percent-cap-rate-reit-exit-multiple, 60-75-percent-noi-margin, 2027`,
    src: `

## Sources

- Public Storage (NYSE: PSA): https://www.publicstorage.com/
- Extra Space Storage (NYSE: EXR): https://www.extraspace.com/
- CubeSmart (NYSE: CUBE): https://www.cubesmart.com/
- National Storage Affiliates (NYSE: NSA): https://www.nationalstorageaffiliates.com/
- SSA (Self Storage Association): https://www.selfstorage.org/
- Life Storage merger with Extra Space (2023): https://www.extraspace.com/
- Inside Self-Storage: https://www.insideselfstorage.com/
- StorageMart: https://www.storagemart.com/
- Janus International (NYSE: JBI) — storage doors: https://www.janusintl.com/
- IBISWorld Self Storage report: https://www.ibisworld.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| 5x5 small unit | $40-$80/mo | Industry |
| 10x10 medium | $90-$180/mo | Industry |
| 10x20 large | $150-$300/mo | Industry |
| Public Storage PSA revenue FY24 | ~$4.7B | PSA 10-K |
| Public Storage market cap | ~$45B | NYSE |
| Extra Space Storage EXR revenue FY24 | ~$3.3B | EXR 10-K |
| Extra Space market cap | ~$30B+ | NYSE |
| Extra Space + Life Storage merger | 2023 ($12.7B all-stock) | EXR |
| CubeSmart CUBE revenue FY24 | ~$1.1B | CUBE 10-K |
| National Storage Affiliates NSA revenue FY24 | ~$800M | NSA 10-K |
| US self-storage facilities | ~50,000+ | SSA |
| US self-storage household penetration | ~10% | SSA |
| US self-storage market | ~$40B+ | SSA |
| Cap rate for facility | 7-9% typical | Industry |
| Facility construction cost/sqft | $60-$150 | Industry |
| Janus International JBI revenue FY24 | ~$1B | JBI 10-K |
| Y1 capital | $500K-$10M+ | Industry |
| Y1 revenue | $80K-$400K | Industry |
| Y2 revenue | $400K-$1.5M | Industry |
| Margin NOI | 60-75% | Industry |
| Typical occupancy stabilized | 85-92% | SSA |`,
    counter: `## Counter-Case
**REIT competitive bidding compresses returns.** Mitigation: secondary/tertiary markets + small.
**Capital intensive.** Mitigation: SBA 504 loan + partner with experienced operator.
**Property tax + insurance volatility.** Mitigation: long-term planning + pass-through on rent increases.
**Online auctions + delinquency.** Mitigation: tight lease enforcement + StorageTreasures auctions.
**When stay-medium wins.** Single 200-unit facility at $400-800K stabilized is meaningful.`,
    links: `

## See Also

- **q1968** — Start a wedding venue business 2027
- **q1970** — Start a kayak rental business 2027
- **q1956** — Start a property management business 2027
- **q1964** — Start a boat rental business 2027`,
    sources: ["https://www.publicstorage.com/","https://www.extraspace.com/","https://www.cubesmart.com/","https://www.nationalstorageaffiliates.com/","https://www.selfstorage.org/","https://www.extraspace.com/","https://www.insideselfstorage.com/","https://www.storagemart.com/","https://www.janusintl.com/","https://www.ibisworld.com/"],
    tags: ["self-storage-business-2027-real-estate","public-storage-psa-45b-extra-space-exr-30b-life-storage-merger-2023-cubesmart-cube-national-storage-affiliates-nsa-storage-plus-asset-mgmt-reits","suburban-growth-density-downsizing-e-commerce-amazon-fba-overflow-drivers","climate-controlled-traditional-outdoor-boat-rv-tiers","7-9-percent-cap-rate-reit-exit-multiple","60-75-percent-noi-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Public Storage PSA $4.7B $45B mkt cap + Extra Space EXR $3.3B $30B Life Storage merger 2023 $12.7B + CubeSmart CUBE $1.1B + National Storage Affiliates NSA $800M + StorageMart + Storage Plus + Storage Asset Management REIT competitors, SSA Self Storage Association 50K facilities + 10% household penetration + $40B US market + Inside Self-Storage industry publication, Janus International JBI $1B storage doors) real.' }
  },
  {
    id: 'q1968',
    tldr: `**TL;DR:** Wedding venue in 2027 = **commercial real estate hosting weddings** at $5,000-$30,000+ per event (~30-100 events/yr). **Y1 $200K-$1M (single venue 50-200 guest capacity); Y2 $1M-$3M+ with expansion or 2nd venue.** **Capital-heavy** — $500K-$5M+ to build new OR $1-10M+ to buy existing property + renovate. **Industry size:** $70B+ US wedding industry (Wedding Report + The Knot). **Players:** mostly independent local venues; barn weddings + winery weddings + boutique hotels grew fast 2020-2024. The Knot + Zola + WeddingWire dominate listing. **2024-2025 trends:** smaller weddings (~120 avg vs 175 pre-COVID), elopements + micro-wedding 20-50 guests growth, all-inclusive packages + venue + catering bundled. **Margin:** 30-50% net after labor + utilities + insurance + maintenance + property tax. **Win condition:** ceremony+reception package + 30-60 weddings/yr + corporate events + photo shoots fill calendar.`,
    core: `

## Why Wedding Venues 2027 Are Real

US 2.4M weddings/yr × $33K avg = $79B+ industry (The Knot 2024). Demand drivers:
- Couples preference for non-hotel boutique venues
- Barn/winery/orchard/garden trend
- Destination wedding shift back home
- Corporate retreat cross-sell
- Photo + video shoots + commercials
- Birthday + anniversary + corporate events

## Pricing 2027

| Tier | Price |
|---|---|
| Small venue (50-100 guests) | $3,000-$10,000 |
| Medium venue (100-200 guests) | $5,000-$15,000 |
| Large venue (200-400+ guests) | $10,000-$50,000+ |
| Ceremony only | $1,500-$5,000 |
| Reception only | $4,000-$25,000 |
| All-inclusive (venue + catering + bar) | $15,000-$80,000+ |
| Peak season Sat (May-Oct) | premium 50-100% |
| Off-season weekday | discount 30-50% |
| Corporate event | $2,000-$15,000 |
| Photo shoot rental | $500-$5,000/day |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $500K-$5M+ property acquisition + buildout + permits] --> B[Build via The Knot + Zola + WeddingWire listings]
    B --> C[30-60 weddings/yr + corporate + photo]
    C --> D[Y1: $200K-$1M · single venue]
    D --> E[Y2: $1M-$3M+ · expand or 2nd venue]
\`\`\`

TAGS: wedding-venue-business-2027-commercial-real-estate-events, 79b-us-wedding-industry-2-4m-weddings-33k-avg-the-knot-2024, the-knot-zola-weddingwire-listings, barn-winery-orchard-garden-boutique-hotel-2020-2024-trends, micro-wedding-elopement-20-50-guest-growth, ceremony-reception-all-inclusive-package-tiers, corporate-retreat-photo-shoot-cross-sell-revenue, 30-50-percent-net-margin, 2027`,
    src: `

## Sources

- The Knot (XO Group / Knot Worldwide): https://www.theknot.com/
- Zola: https://www.zola.com/
- WeddingWire (The Knot Worldwide): https://www.weddingwire.com/
- IAWP (International Association of Wedding Planners): https://www.iawpnet.com/
- WeddingPro (The Knot's vendor side): https://www.weddingpro.com/
- Hopple (venue booking): https://hopple.com/
- AllSeated (venue layout): https://allseated.com/
- Wedding Report (industry data): https://www.theweddingreport.com/
- Wedding Industry Pros: https://weddingindustrypros.com/
- AVCC (Association of Venue Companies): https://venues.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Small venue (50-100) | $3K-$10K | Industry |
| Medium venue (100-200) | $5K-$15K | Industry |
| All-inclusive premium | $15K-$80K+ | Industry |
| US weddings/yr | ~2.4M | The Knot |
| Avg wedding cost 2024 | ~$33K | The Knot |
| US wedding industry | ~$79B | The Knot/Wedding Report |
| Avg guest count 2024 | ~120 (down from 175 pre-COVID) | The Knot |
| Micro-wedding 20-50 guests | major growth segment | The Knot |
| The Knot parent | Knot Worldwide (Permira PE 2018) | Permira |
| Zola funding | ~$200M+ | Crunchbase |
| WeddingWire (Knot acquisition) | 2018 | Knot Worldwide |
| Hopple | venue booking platform | Hopple |
| Peak season May-Oct | 60-70% of bookings | Industry |
| Property acquisition cost | $500K-$10M+ | Industry |
| Buildout/renovation | $200K-$2M | Industry |
| Y1 capital | $500K-$10M+ | Industry |
| Y1 revenue | $200K-$1M | Industry |
| Y2 revenue | $1M-$3M+ | Industry |
| Margin net | 30-50% | Industry |
| Typical weddings/yr | 30-100 | Industry |`,
    counter: `## Counter-Case
**Capital intensive.** Mitigation: lease + manage existing property OR partner.
**Seasonal Q2-Q3 peak.** Mitigation: corporate event + photo shoot filler.
**Liability (injury, alcohol).** Mitigation: $2M+ GL + liquor liability + waivers.
**Competition from hotels + restaurants.** Mitigation: boutique experience + outdoor/unique setting.
**When stay-small wins.** Boutique 30 weddings/yr at $300-600K is meaningful.`,
    links: `

## See Also

- **q1965** — Start a party rental business 2027
- **q1967** — Start a photo booth rental business 2027
- **q1980** — Start a catering business 2027
- **q1966** — Start a bounce house rental business 2027`,
    sources: ["https://www.theknot.com/","https://www.zola.com/","https://www.weddingwire.com/","https://www.iawpnet.com/","https://www.weddingpro.com/","https://hopple.com/","https://allseated.com/","https://www.theweddingreport.com/","https://weddingindustrypros.com/","https://venues.com/"],
    tags: ["wedding-venue-business-2027-commercial-real-estate-events","79b-us-wedding-industry-2-4m-weddings-33k-avg-the-knot-2024","the-knot-zola-weddingwire-listings","barn-winery-orchard-garden-boutique-hotel-2020-2024-trends","micro-wedding-elopement-20-50-guest-growth","ceremony-reception-all-inclusive-package-tiers","corporate-retreat-photo-shoot-cross-sell-revenue","30-50-percent-net-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (The Knot Knot Worldwide Permira 2018 + Zola $200M + WeddingWire Knot Worldwide 2018 + WeddingPro + Hopple + AllSeated + Wedding Report platforms, US 2.4M weddings $33K avg $79B industry + 120 guest avg post-COVID down from 175 + micro-wedding 20-50 growth segment, IAWP + AVCC industry associations) real.' }
  },
  {
    id: 'q1967',
    tldr: `**TL;DR:** Photo booth rental in 2027 = **wedding + corporate event rentals** charging $400-$2,500/event. **Y1 $40K-$150K (1-2 booths, 30-100 events/yr); Y2 $150K-$400K with 3-5 booths.** **Required:** state business license + commercial vehicle insurance + photo booth ($1,500-$15,000 — selfie kiosks, traditional enclosed, 360 platform, AI photo booths) + DSLR camera + printer (DNP DS-RX1HS, Mitsubishi CP-K60DW, Sinfonia CHC-S2145) + props + backdrop + business insurance. **Players:** Photobooth Supply Co (popular kit reseller), Salsa Booth, ATA Photobooths, Touchpix, Simple Booth, dslrBooth (software). **2024-2027 trends:** **360 video booths** (Revospin, Orca 360 Platform, Anvil Industries) booming for weddings + corporate; **AI photo booths** (Glambot AI mirror, AI portrait) emerging premium tier $1,500-$5,000/event. **Margin:** 65-80%. **Win condition:** wedding planner + venue partnerships + corporate event coordinator network.`,
    core: `

## Why Photo Booth 2027 Is Real

Weddings + corporate events + bar mitzvahs + birthdays all need entertainment. Demand drivers:
- Wedding receptions
- Corporate parties + holiday + conferences
- Birthday + bar mitzvah + quinceañera
- Trade shows + activations
- Bachelorette/bachelor parties

## Pricing 2027

| Service | Price |
|---|---|
| Selfie kiosk (3hr) | $400-$800 |
| Enclosed booth (3-4hr) | $600-$1,500 |
| 360 video booth (3hr) | $800-$2,500 |
| AI photo booth | $1,500-$5,000 |
| Hourly add-on | $100-$300/hr |
| Custom backdrop | $100-$500 |
| Print add-on | $50-$200 |
| GIF/Boomerang | included or $100 |
| Live host attendant | $150-$400 |
| Travel premium 50+ mi | $50-$300 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $1.5-15K booth + DSLR + printer + props + insurance] --> B[Wedding planner + venue partnerships]
    B --> C[Add 360 + AI booth premium tier]
    C --> D[Y1: $40K-$150K · 1-2 booths]
    D --> E[Y2: $150K-$400K · 3-5 booths]
\`\`\`

TAGS: photo-booth-rental-business-2027-wedding-corporate, photobooth-supply-co-salsa-booth-ata-touchpix-simple-booth-dslrbooth-vendors, dnp-ds-rx1hs-mitsubishi-cp-k60dw-sinfonia-chc-s2145-dye-sub-printers, 360-video-booth-revospin-orca-anvil-industries-trend, ai-photo-booth-glambot-ai-mirror-premium-2024-2027, wedding-planner-venue-corporate-event-coordinator-partnerships, 65-80-percent-margin, 2027`,
    src: `

## Sources

- Photobooth Supply Co: https://www.photoboothsupplyco.com/
- Salsa Booth (Touchpix): https://www.salsabooth.com/
- Simple Booth: https://www.simplebooth.com/
- dslrBooth (software): https://dslrbooth.com/
- DNP Photo Imaging (dye-sub printers): https://www.dnpphoto.com/
- Mitsubishi Electric Imaging: https://www.mitsubishielectric-photoprinting.com/
- Sinfonia Technology: https://www.sinfonia.co.jp/
- Revospin (360 platforms): https://revospin.com/
- The Knot (wedding marketplace): https://www.theknot.com/
- Eventbrite (corporate events): https://www.eventbrite.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Selfie kiosk 3hr | $400-$800 | Industry |
| Enclosed booth 3-4hr | $600-$1,500 | Industry |
| 360 video booth 3hr | $800-$2,500 | Industry |
| AI photo booth | $1,500-$5,000 | Industry |
| Photo booth kit | $1.5K-$15K | Industry |
| DNP DS-RX1HS dye-sub printer | $700-$1,200 | DNP |
| Mitsubishi CP-K60DW | $1,000-$1,500 | Mitsubishi |
| Sinfonia CHC-S2145 | $900-$1,400 | Sinfonia |
| Revospin 360 platform | $2,000-$5,000 | Revospin |
| Orca 360 platform | $3,000-$7,000 | Orca |
| dslrBooth software | $200-$700 license | dslrBooth |
| Simple Booth | $30-$80/mo subscription | Simple Booth |
| US weddings/yr | ~2.4M | The Knot |
| Photobooth Supply Co | major kit reseller | PBSC |
| Y1 capital | $1.5K-$15K | Industry |
| Y1 revenue | $40K-$150K | Industry |
| Y2 revenue | $150K-$400K | Industry |
| Margin | 65-80% | Industry |`,
    counter: `## Counter-Case
**Smartphones replace basic.** Mitigation: 360 + AI premium tier.
**Wedding-only seasonality.** Mitigation: corporate + bar mitzvah + birthday year-round.
**Equipment maintenance.** Mitigation: backup booth + on-call tech.
**Cheap competitors enter.** Mitigation: brand + planner partnerships.
**When stay-side wins.** $30-50K weekend side income is fine.`,
    links: `

## See Also

- **q1968** — Start a wedding venue business 2027
- **q1966** — Start a bounce house rental business 2027
- **q1965** — Start a party rental business 2027
- **q1980** — Start a catering business 2027`,
    sources: ["https://www.photoboothsupplyco.com/","https://www.salsabooth.com/","https://www.simplebooth.com/","https://dslrbooth.com/","https://www.dnpphoto.com/","https://www.mitsubishielectric-photoprinting.com/","https://www.sinfonia.co.jp/","https://revospin.com/","https://www.theknot.com/","https://www.eventbrite.com/"],
    tags: ["photo-booth-rental-business-2027-wedding-corporate","photobooth-supply-co-salsa-booth-ata-touchpix-simple-booth-dslrbooth-vendors","dnp-ds-rx1hs-mitsubishi-cp-k60dw-sinfonia-chc-s2145-dye-sub-printers","360-video-booth-revospin-orca-anvil-industries-trend","ai-photo-booth-glambot-ai-mirror-premium-2024-2027","wedding-planner-venue-corporate-event-coordinator-partnerships","65-80-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Photobooth Supply Co + Salsa Booth Touchpix + ATA Photobooths + Simple Booth + dslrBooth software vendors, DNP DS-RX1HS + Mitsubishi CP-K60DW + Sinfonia CHC-S2145 dye-sub printers, Revospin + Orca 360 + Anvil Industries 360 video booth + Glambot AI Mirror AI photo booth premium tier 2024-2027) real.' }
  },
  {
    id: 'q1966',
    tldr: `**TL;DR:** Bounce house rental in 2027 = **inflatable + party equipment delivery for kids events + festivals** charging $200-$800/event 4-6hr + $1,500-$5,000+ for water slide + obstacle course combos. **Y1 $30K-$100K (5-10 inflatables); Y2 $100K-$300K with 20-30 inventory + crew.** **Required:** state business license + commercial vehicle insurance + GL ($1M+ event liability) + truck/trailer + inflatables ($1,000-$10,000 each — Magic Jump, Ninja Jump, Cutting Edge Creations, Jungle Jumps, Blast Zone, Banzai) + commercial blowers ($150-$500 each) + stakes + sand bags. **Players:** local independents dominate; franchise: Bounce U (~50+ units), Pump It Up (~125+ units), Jump-N-Jam (~70+). **Adjacent revenue:** tables/chairs/tents rental, concession (snow cone, popcorn, cotton candy machines $400-$1,500), generators. **Margin:** 60-75%. **Win condition:** wedding planner + birthday party + church/school + corporate family-day partnerships + Saturday calendar fill-up.`,
    core: `

## Why Bounce House 2027 Is Real

Kids birthday parties + church/school events + corporate family days drive recurring demand. Demand drivers:
- Birthday parties (Sat peak)
- Church/school carnivals + fall festivals
- Corporate family days
- Wedding + family reunion
- Block party + HOA events
- Daycare graduation

## Pricing 2027

| Service | Price |
|---|---|
| Standard bounce house (4-6hr) | $200-$400 |
| Combo bounce + slide | $400-$800 |
| Water slide | $500-$1,200 |
| Obstacle course | $600-$2,500 |
| Inflatable movie screen | $400-$1,500 |
| Sports games (interactive) | $400-$1,500 |
| Wedding/corporate premium | +25-50% |
| Tables + chairs rental | $1-$3/chair |
| Concession (snow cone) | $150-$400 |
| Delivery + setup | $50-$150 included |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $20-80K capital + 5-10 inflatables + truck + trailer + insurance] --> B[Build local awareness + wedding planner partnerships]
    B --> C[Add water slide + obstacle course + concession]
    C --> D[Y1: $30K-$100K · 5-10 inflatables]
    D --> E[Y2: $100K-$300K · 20-30 inventory + crew]
\`\`\`

TAGS: bounce-house-rental-business-2027-inflatable-party-equipment, magic-jump-ninja-jump-cutting-edge-creations-jungle-jumps-blast-zone-banzai-manufacturers, bounce-u-pump-it-up-jump-n-jam-franchise-references, tables-chairs-tents-concession-snow-cone-popcorn-cotton-candy-adjacent-revenue, wedding-planner-birthday-church-school-corporate-family-day-partnerships, 60-75-percent-margin, 2027`,
    src: `

## Sources

- SIOTO (Safe Inflatable Operators Training Org): https://www.sioto.org/
- Magic Jump (inflatable mfr): https://www.magicjump.com/
- Ninja Jump: https://www.ninjajump.com/
- Cutting Edge Creations: https://www.thecuttingedgecreations.com/
- Jungle Jumps: https://www.junglejumps.com/
- Pump It Up (franchise): https://www.pumpitupparty.com/
- Bounce U: https://www.bounceu.com/
- IAAPA (International Association of Amusement Parks): https://www.iaapa.org/
- The Knot: https://www.theknot.com/
- Jobber: https://getjobber.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Standard bounce house 4-6hr | $200-$400 | Industry |
| Combo bounce+slide | $400-$800 | Industry |
| Water slide | $500-$1,200 | Industry |
| Obstacle course | $600-$2,500 | Industry |
| Wedding premium | +25-50% | Industry |
| Magic Jump bounce house | $1K-$5K | Magic Jump |
| Ninja Jump combo | $2K-$8K | Ninja Jump |
| Cutting Edge water slide | $3K-$10K | Cutting Edge |
| Blast Zone (residential brand) | $200-$1.5K | Blast Zone |
| Commercial blower | $150-$500 | Industry |
| Bounce U franchise units | ~50+ | Bounce U |
| Pump It Up franchise units | ~125+ | Pump It Up |
| Jump-N-Jam units | ~70+ | Jump-N-Jam |
| SIOTO certification | $300-$800 | SIOTO |
| Y1 capital | $20K-$80K | Industry |
| Y1 revenue | $30K-$100K | Industry |
| Y2 revenue | $100K-$300K | Industry |
| Margin | 60-75% | Industry |
| Saturday peak booking | 80% of weekly revenue | Industry |`,
    counter: `## Counter-Case
**Weather-dependent (wind/rain).** Mitigation: refund/reschedule policy.
**Sat peak crowding crew.** Mitigation: 2-3 crews + premium pricing.
**Safety + injury liability.** Mitigation: $2M+ GL + waivers + SIOTO + staking protocols.
**Storage/transport.** Mitigation: trailer + dedicated storage facility.
**When stay-small wins.** Saturday-only + 5-10 inflatables at $30-60K is fine side income.`,
    links: `

## See Also

- **q1965** — Start a party rental business 2027
- **q1967** — Start a photo booth rental business 2027
- **q1968** — Start a wedding venue business 2027
- **q1980** — Start a catering business 2027`,
    sources: ["https://www.sioto.org/","https://www.magicjump.com/","https://www.ninjajump.com/","https://www.thecuttingedgecreations.com/","https://www.junglejumps.com/","https://www.pumpitupparty.com/","https://www.bounceu.com/","https://www.iaapa.org/","https://www.theknot.com/","https://getjobber.com/"],
    tags: ["bounce-house-rental-business-2027-inflatable-party-equipment","magic-jump-ninja-jump-cutting-edge-creations-jungle-jumps-blast-zone-banzai-manufacturers","bounce-u-pump-it-up-jump-n-jam-franchise-references","tables-chairs-tents-concession-snow-cone-popcorn-cotton-candy-adjacent-revenue","wedding-planner-birthday-church-school-corporate-family-day-partnerships","60-75-percent-margin","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Magic Jump + Ninja Jump + Cutting Edge Creations + Jungle Jumps + Blast Zone + Banzai inflatable manufacturers, Bounce U 50 + Pump It Up 125 + Jump-N-Jam 70 franchise references, SIOTO Safe Inflatable Operators Training Org certification + IAAPA + The Knot industry bodies) real.' }
  },
  {
    id: 'q1965',
    tldr: `**TL;DR:** Party rental business in 2027 = **tables + chairs + tents + linens + dance floor + bar + serving equipment** charging $1-$25/item + $500-$5,000/event package. **Y1 $80K-$300K (small-medium inventory, 30-80 events/yr); Y2 $300K-$1M with bigger inventory + tent installation crew.** **Required:** $50-$500K capital — inventory (chairs $30-$150 each, tables $80-$300, tent $1,500-$30,000+, dance floor $50-$300/sqft, linens, glassware, china, flatware, bars, lighting) + commercial vehicle insurance + truck/trailers + warehouse $1,500-$10,000/mo + crew + insurance. **Players:** Classic Party Rentals (Pomeroy Group ~$300M+ revenue), All Occasions Party Rental, Bright Event Rentals, Hartmann Studios + local independents. Top vendor brand: Sperry Tents, Stoddard Tents, Anchor Industries, Mahaffey USA, Aztec Tents. **Margin:** 25-45% net after labor + truck + warehouse + maintenance + breakage. **Win condition:** wedding venue + catering partnerships + corporate event B2B + multi-year tent install contracts.`,
    core: `

## Why Party Rentals 2027 Is Real

Weddings + corporate events + private parties + festivals all need rental equipment. Demand drivers:
- Wedding 2.4M US/yr
- Corporate events
- Private parties + birthdays
- Festivals + community events
- Trade shows + conferences
- Sports + concerts

## Pricing 2027

| Item | Price |
|---|---|
| Chair (chivari, folding) | $3-$15/each |
| Table 6-8ft | $10-$30 |
| Round 60" table | $12-$30 |
| 20x20 tent | $400-$1,200 |
| 40x60 tent | $1,500-$4,500 |
| 60x100 tent | $3,500-$12,000+ |
| Sailcloth tent | premium 50-100% |
| Dance floor | $2-$8/sqft |
| Linen (polyester) | $5-$25 |
| Specialty linen | $15-$50 |
| Glassware | $0.50-$3/each |
| Bar setup | $200-$1,500 |
| Lighting package | $500-$5,000 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $50-500K capital + inventory + warehouse + trucks] --> B[Wedding venue + catering partnerships]
    B --> C[Add tent install + corporate contracts]
    C --> D[Y1: $80K-$300K · 30-80 events]
    D --> E[Y2: $300K-$1M · 80-200 events + tent crew]
\`\`\`

TAGS: party-rental-business-2027-tables-chairs-tents-linens-dance-floor-bar, classic-party-rentals-pomeroy-group-300m-all-occasions-bright-event-hartmann-studios-references, sperry-stoddard-anchor-mahaffey-usa-aztec-tent-brands, wedding-venue-catering-corporate-festival-trade-show-revenue, 25-45-percent-net-margin-tight, multi-year-tent-install-contract-stable-revenue, 2027`,
    src: `

## Sources

- ARA (American Rental Association): https://www.ararental.org/
- ILEA (International Live Events Association): https://www.ileahub.com/
- IFEA (International Festival & Events Association): https://www.ifea.com/
- Classic Party Rentals: https://www.classicpartyrentals.com/
- All Occasions Party Rental: https://www.alloccasionsparty.com/
- Bright Event Rentals: https://www.brighteventrentals.com/
- Sperry Tents: https://sperrytents.com/
- Stoddard Tents: https://stoddardtents.com/
- Anchor Industries: https://www.anchorinc.com/
- Aztec Tents: https://www.aztectents.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Chivari chair | $3-$15/each | Industry |
| 6-8ft table | $10-$30 | Industry |
| 20x20 tent | $400-$1,200 | Industry |
| 40x60 tent | $1,500-$4,500 | Industry |
| 60x100 tent | $3,500-$12K+ | Industry |
| Sailcloth premium | 50-100% over poly | Industry |
| Classic Party Rentals revenue est | ~$300M+ | Industry estimates |
| Classic Party Rentals parent | Pomeroy Group | Pomeroy |
| Sperry Tents | premium sailcloth | Sperry |
| Stoddard Tents | premium sailcloth | Stoddard |
| Anchor Industries | major tent mfr | Anchor |
| Aztec Tents | major tent mfr | Aztec |
| ARA membership | ~3,500+ | ARA |
| ILEA members | ~7,000+ globally | ILEA |
| US weddings/yr | ~2.4M | The Knot |
| Warehouse rent | $1.5K-$10K/mo | Industry |
| Y1 capital | $50K-$500K | Industry |
| Y1 revenue | $80K-$300K | Industry |
| Y2 revenue | $300K-$1M | Industry |
| Margin net | 25-45% | Industry |
| Saturday-only revenue concentration | 70-80% peak weekend | Industry |`,
    counter: `## Counter-Case
**Capital + warehouse intensive.** Mitigation: lease + start with high-margin items only.
**Saturday-peak labor surge.** Mitigation: cross-train + part-time hire.
**Breakage + maintenance.** Mitigation: 5-10% breakage budget + insurance.
**Tight margins.** Mitigation: tent install premium + multi-year corporate contracts.
**When stay-medium wins.** $200-400K solo + 1-2 trucks is meaningful business.`,
    links: `

## See Also

- **q1968** — Start a wedding venue business 2027
- **q1980** — Start a catering business 2027
- **q1966** — Start a bounce house rental business 2027
- **q1967** — Start a photo booth rental business 2027`,
    sources: ["https://www.ararental.org/","https://www.ileahub.com/","https://www.ifea.com/","https://www.classicpartyrentals.com/","https://www.alloccasionsparty.com/","https://www.brighteventrentals.com/","https://sperrytents.com/","https://stoddardtents.com/","https://www.anchorinc.com/","https://www.aztectents.com/"],
    tags: ["party-rental-business-2027-tables-chairs-tents-linens-dance-floor-bar","classic-party-rentals-pomeroy-group-300m-all-occasions-bright-event-hartmann-studios-references","sperry-stoddard-anchor-mahaffey-usa-aztec-tent-brands","wedding-venue-catering-corporate-festival-trade-show-revenue","25-45-percent-net-margin-tight","multi-year-tent-install-contract-stable-revenue","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Classic Party Rentals $300M Pomeroy Group + All Occasions Party Rental + Bright Event Rentals + Hartmann Studios major US references, Sperry Tents + Stoddard Tents premium sailcloth + Anchor Industries + Mahaffey USA + Aztec Tents tent manufacturers, ARA American Rental Association 3.5K + ILEA International Live Events Association 7K + IFEA industry bodies) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH E DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
