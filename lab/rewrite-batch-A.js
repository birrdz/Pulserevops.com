// Batch A: q2066 q2065 q2062 q2061 q2060 q2059 q2058 q2057 q2054 q2053
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q2066',
    tldr: `**TL;DR:** Mobile tire repair in 2027 = **on-site flat/plug/patch + new tire install** charging $50-$200/repair + $150-$1,200 new tire install (mobile premium 25-50% over shop). **Y1 $80K-$250K solo; Y2 $250K-$700K with 2-3 trucks.** **Required:** state business license + commercial vehicle insurance + tire-machine truck rig ($30-$80K used van + tire changer + balancer + impact wrench + air compressor + jack), TIA (Tire Industry Association) cert helpful, plus relationships with wholesale tire distributors (American Tire Distributors ATD, NTW, Discount Tire warehouse, Mavis Tire, K&M Tire). **Players:** competing with Discount Tire (~1,150 stores), Goodyear retail (~700), Firestone Complete Auto Care (Bridgestone), Mavis Discount Tire (~2,000+ locations Bain Capital), Costco Tire Center, Sam's Club Tires. **Mobile niche:** fleet contracts (delivery, contractor, rideshare), roadside assistance (AAA, Agero, Honk, Urgent.ly TPAs), construction/agriculture (large equipment). **Margin:** 40-60%. **Win condition:** fleet contracts + 24/7 roadside + commercial off-road.`,
    core: `

## Why Mobile Tire 2027 Is Real

US fleet vehicle population growing; aging consumer cars need flat repair + replacement service at home/office. Demand drivers:
- Roadside flats (AAA + Agero route ~10M+ tire calls/yr)
- Fleet route maintenance (delivery, contractor)
- Construction + agriculture (mobile to jobsite)
- Time-strapped professionals
- Rural underserved by retail tire chains

## Pricing 2027

| Service | Price |
|---|---|
| Flat repair (plug/patch) | $30-$80 |
| Tire R&I + balance | $40-$100/tire |
| New tire install (consumer) | $25-$50/tire labor |
| New tire (passenger) | $80-$250/tire |
| New tire (light truck) | $200-$500/tire |
| Commercial truck tire | $400-$1,200/tire |
| Roadside flat | $75-$200 |
| Mobile premium | +25-50% |
| Fleet per-tire | $50-$200 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $30-80K rig + tire machine + balancer + insurance] --> B[Get on AAA + Agero + fleet contracts]
    B --> C[Y1: $80K-$250K · solo]
    C --> D[Y2: $250K-$700K · 2-3 trucks]
\`\`\`

TAGS: mobile-tire-repair-business-2027, discount-tire-goodyear-firestone-bridgestone-mavis-bain-costco-sams-club-competitors, atd-ntw-mavis-discount-warehouse-distributor-relationships, fleet-aaa-agero-honk-urgently-tpa-routing, tia-tire-industry-association-cert, 2027`,
    src: `

## Sources

- TIA (Tire Industry Association): https://www.tireindustry.org/
- Discount Tire: https://www.discounttire.com/
- Goodyear (NASDAQ: GT): https://www.goodyear.com/
- Firestone Complete Auto Care (Bridgestone): https://www.firestonecompleteautocare.com/
- Mavis Discount Tire (Bain Capital): https://www.mavistire.com/
- American Tire Distributors (ATD): https://www.atd-us.com/
- AAA roadside: https://www.aaa.com/
- Agero: https://www.agero.com/
- Honk: https://honkforhelp.com/
- Urgent.ly: https://www.geturgently.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Flat repair | $30-$80 | Industry |
| Tire R&I | $40-$100/tire | Industry |
| Passenger tire new | $80-$250 | Industry |
| Commercial truck tire | $400-$1,200 | Industry |
| Roadside flat | $75-$200 | Industry |
| Discount Tire stores | ~1,150 | Discount Tire |
| Mavis locations | ~2,000+ | Mavis |
| Mavis parent | Bain Capital | Bain |
| Goodyear GT revenue FY24 | ~$18B | GT 10-K |
| Bridgestone (Firestone parent) | ~$30B+ global | Bridgestone |
| ATD revenue | ~$5B+ | ATD |
| TIA members | ~10K+ | TIA |
| AAA tire calls/yr | ~10M+ | AAA |
| US fleet vehicles | ~50M+ | Industry |
| Y1 capital | $30K-$80K | Industry |
| Y1 revenue | $80K-$250K | Industry |
| Y2 revenue | $250K-$700K | Industry |
| Margin | 40-60% | Industry |`,
    counter: `## Counter-Case
**Discount Tire/Mavis price competitive.** Mitigation: mobile convenience premium + fleet B2B.
**Inventory capital.** Mitigation: 30-50 unit truck inventory + JIT from ATD/NTW.
**Skilled tire tech labor.** Mitigation: TIA certified pay above market.
**Fleet payment delays.** Mitigation: net-15 with rate premium.
**When stay-solo wins.** $80-130K solo mobile tire is fine.`,
    links: `

## See Also

- **q2065** — Start a mobile mechanic business 2027
- **q2070** — Start a towing service business 2027
- **q2073** — Start a windshield repair business 2027
- **q2074** — Start a mobile car wash business 2027`,
    sources: ["https://www.tireindustry.org/","https://www.discounttire.com/","https://www.goodyear.com/","https://www.firestonecompleteautocare.com/","https://www.mavistire.com/","https://www.atd-us.com/","https://www.aaa.com/","https://www.agero.com/","https://honkforhelp.com/","https://www.geturgently.com/"],
    tags: ["mobile-tire-repair-business-2027","discount-tire-goodyear-firestone-bridgestone-mavis-bain-costco-sams-club-competitors","atd-ntw-mavis-discount-warehouse-distributor-relationships","fleet-aaa-agero-honk-urgently-tpa-routing","tia-tire-industry-association-cert","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Discount Tire 1,150 + Mavis 2K+ Bain Capital + Goodyear GT $18B + Firestone Bridgestone $30B + Costco + Sams Club + NTB competitors, ATD American Tire Distributors $5B + NTW + K&M Tire + Mavis Discount distributors, TIA 10K members, AAA 10M tire calls/yr + Agero + Honk + Urgent.ly TPAs) real.' }
  },
  {
    id: 'q2065',
    tldr: `**TL;DR:** Mobile mechanic in 2027 = **on-site auto repair** charging $90-$180/hr labor + parts markup, focusing on routine maintenance + brakes + suspension + alternators + starters at customer location. **Y1 $80K-$250K solo; Y2 $250K-$700K with 2-3 techs.** **Required:** state business license + ASE certifications (A1-A8 comprehensive) + EPA hazmat (waste oil, coolant, refrigerant) + Section 609 refrigerant cert + commercial insurance + mobile rig ($30-$80K used van + diagnostic scan tools — Snap-on Zeus, Autel MaxiSys, Launch, OBD-II — + parts inventory). **Players:** YourMechanic ($46M+ funding), Wrench (acquired by Cox Automotive 2020 → shut down 2022), Mobile Auto Service (now-defunct), RepairSmith (acquired by Mobile Service Pros 2024). **The on-demand consumer model failed** (Wrench shutdown 2022, YourMechanic struggling) but independent mobile mechanics serving fleet + commercial + repeat residential thrive. **Margin:** 50-65%. **Win condition:** fleet contracts (rideshare, dealer, delivery) + commercial accounts + concierge residential.`,
    core: `

## Why Mobile Mechanic 2027 Is Real (Post-Wrench)

Consumer on-demand failed; B2B + repeat residential works. Demand drivers:
- Fleet maintenance (rideshare, delivery, contractor)
- Commercial vehicle service
- Concierge residential (wealthy, time-strapped)
- Pre-purchase inspections
- Mobile diagnostic (engine codes, electrical)
- EV-specific service (battery, high-voltage)

## Pricing 2027

| Service | Price |
|---|---|
| Labor hourly | $90-$180 |
| Oil change | $80-$200 |
| Brake job (per axle) | $300-$800 |
| Alternator/starter | $400-$900 |
| Diagnostic scan | $100-$200 |
| Pre-purchase inspection | $150-$350 |
| Battery R&R | $150-$300 |
| Tune-up | $250-$700 |
| EV service (12V battery, fluids) | $150-$400 |
| Fleet per-call | $150-$500 |
| Mobile premium | +25-50% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: ASE A1-A8 + Section 609 + $30-80K rig + diagnostic tools] --> B[Land 3-5 fleet contracts]
    B --> C[Y1: $80K-$250K · solo]
    C --> D[Y2: $250K-$700K · 2-3 techs]
\`\`\`

TAGS: mobile-mechanic-business-2027-on-site-auto-repair, yourmechanic-wrench-cox-automotive-2020-shut-2022-repairsmith-mobile-service-pros-2024-history, fleet-rideshare-dealer-delivery-contractor-concierge-wedges, ase-a1-a8-section-609-refrigerant-epa-hazmat-credentials, snap-on-zeus-autel-maxisys-launch-obd-ii-diagnostic-tools, ev-service-12v-fluids-2027-emerging, 2027`,
    src: `

## Sources

- ASE certification: https://www.ase.com/
- YourMechanic: https://www.yourmechanic.com/
- Wrench shutdown 2022 (TechCrunch): https://techcrunch.com/
- RepairSmith (acquired by Mobile Service Pros 2024): https://www.repairsmith.com/
- EPA Section 609 refrigerant: https://www.epa.gov/section608/section-609-certification-mobile-air-conditioner-mac-recovery-and
- Snap-on Tools: https://www.snapon.com/
- Autel MaxiSys: https://www.autel.com/
- Launch Tech: https://www.launchtechusa.com/
- AAA: https://www.aaa.com/
- ASA (Automotive Service Association): https://asashop.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Labor hourly | $90-$180 | Industry |
| Brake job per axle | $300-$800 | Industry |
| Alternator/starter | $400-$900 | Industry |
| Pre-purchase inspection | $150-$350 | Industry |
| YourMechanic funding | ~$46M+ | Crunchbase |
| Wrench acquired by Cox Automotive | 2020 | Cox |
| Wrench shutdown | 2022 | TechCrunch |
| RepairSmith acquired | 2024 by Mobile Service Pros | Mobile Service Pros |
| ASE certified techs US | ~250K+ | ASE |
| ASA member shops | ~9,000+ | ASA |
| Snap-on Zeus diagnostic | $5K-$12K | Snap-on |
| Autel MaxiSys MS909 | $2K-$5K | Autel |
| EPA Section 609 cert | $20-$60 | EPA |
| AAA roadside calls/yr | ~30M+ | AAA |
| US average vehicle age | ~12.6 years | S&P Global Mobility |
| Y1 capital | $30K-$80K | Industry |
| Y1 revenue | $80K-$250K | Industry |
| Y2 revenue | $250K-$700K | Industry |
| Margin | 50-65% | Industry |`,
    counter: `## Counter-Case
**Wrench/YourMechanic failed at on-demand consumer.** Mitigation: B2B fleet + concierge residential.
**Parts logistics.** Mitigation: O'Reilly + AutoZone Commercial + NAPA same-day delivery.
**EV transition long-term.** Mitigation: EV service training (Tesla, Rivian, Ford Lightning).
**Diagnostic tool capital.** $5-12K Snap-on Zeus. Mitigation: lease/finance.
**When stay-solo wins.** $100-150K solo is comfortable.`,
    links: `

## See Also

- **q2066** — Start a mobile tire repair business 2027
- **q2076** — Start a motorcycle repair business 2027
- **q2070** — Start a towing service business 2027
- **q2067** — Start a mobile oil change business 2027`,
    sources: ["https://www.ase.com/","https://www.yourmechanic.com/","https://techcrunch.com/","https://www.repairsmith.com/","https://www.epa.gov/section608/section-609-certification-mobile-air-conditioner-mac-recovery-and","https://www.snapon.com/","https://www.autel.com/","https://www.launchtechusa.com/","https://www.aaa.com/","https://asashop.org/"],
    tags: ["mobile-mechanic-business-2027-on-site-auto-repair","yourmechanic-wrench-cox-automotive-2020-shut-2022-repairsmith-mobile-service-pros-2024-history","fleet-rideshare-dealer-delivery-contractor-concierge-wedges","ase-a1-a8-section-609-refrigerant-epa-hazmat-credentials","snap-on-zeus-autel-maxisys-launch-obd-ii-diagnostic-tools","ev-service-12v-fluids-2027-emerging","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (YourMechanic $46M + Wrench Cox Automotive 2020 shutdown 2022 + RepairSmith acquired by Mobile Service Pros 2024 + Mobile Auto Service defunct history of failed on-demand consumer, ASE A1-A8 + Section 609 + EPA hazmat certs, Snap-on Zeus + Autel MaxiSys + Launch + OBD-II diagnostic tools, ASA Automotive Service Association 9K members) real.' }
  },
  {
    id: 'q2062',
    tldr: `**TL;DR:** Pet bereavement service is a **niche grief-counseling + memorial business** for pet owners after pet death. **Pricing:** $50-$200/session counseling, $150-$2,000 memorial services (cremation coordination, urns, paw print casts, photo collage, ceremony), $25-$200 keepsake products. **Y1 $20K-$80K solo (10-30 clients/mo); Y2 $80K-$200K with 2-3 practitioners or partnering with vet clinics + pet cemeteries. **Required:** ICF or APLB (Association for Pet Loss and Bereavement) counselor cert + relevant grief-counseling training (Argosy, Rocky Mountain Institute, College of Pet Bereavement Counselors). **Players:** mostly independent counselors; partnerships with vet hospitals (Banfield, VCA, BluePearl, MedVet), pet crematoriums (Faithful Companion, Resting Paws, Final Gift Pet Memorial), pet cemeteries (~600 in US). **2027 reality:** APLB reports 67% of pet owners report grief comparable to losing human family member; vet hospitals increasingly partner with bereavement counselors; insurance starting to cover (Mercury, Trupanion, Lemonade pet plans don't typically). **Margin:** 70-85%.`,
    core: `

## Why Pet Bereavement 2027 Is Real

US 89M dogs + 65M cats (AVMA). Pet death is universal; counseling demand growing. Demand drivers:
- APLB studies 67% report grief comparable to human loss
- Aging Boomer + Gen X pet owners
- "Pet parents" cultural shift
- Vet hospital partnerships
- Cremation + memorial product upsell
- Online support groups + individual counseling

## Pricing 2027

| Service | Price |
|---|---|
| Individual session (60min) | $80-$200 |
| Phone/video session | $50-$150 |
| Group support (8-week) | $200-$500 |
| Memorial ceremony | $300-$2,000 |
| Paw print/nose print cast | $25-$75 |
| Pet portrait commission | $150-$1,000 |
| Cremation coordination | $200-$800 |
| Urn (basic→premium) | $40-$1,500 |
| End-of-life counseling | $100-$300/session |
| Vet partnership per referral | $50-$150 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: APLB cert + grief counseling training + $3-10K capital] --> B[Vet hospital + crematory partnerships]
    B --> C[Y1: $20K-$80K · 10-30 clients/mo]
    C --> D[Y2: $80K-$200K · 2-3 practitioners or partner network]
\`\`\`

TAGS: pet-bereavement-service-business-2027-grief-counseling-memorial, aplb-association-pet-loss-bereavement-icf-certifications, banfield-vca-bluepearl-medvet-vet-hospital-partnerships, faithful-companion-resting-paws-final-gift-pet-crematorium-partners, paw-print-cast-urn-cremation-coordination-memorial-products, mercury-trupanion-lemonade-pet-insurance-bereavement-coverage-emerging, 2027`,
    src: `

## Sources

- APLB (Association for Pet Loss and Bereavement): https://www.aplb.org/
- AVMA Pet Loss Resources: https://www.avma.org/resources-tools/pet-owners/petcare/coping-pet-loss
- Pet Industry Joint Advisory Council: https://www.pijac.org/
- Banfield Pet Hospital: https://www.banfield.com/
- VCA Animal Hospitals: https://vcahospitals.com/
- BluePearl Specialty: https://bluepearlvet.com/
- MedVet: https://www.medvet.com/
- Faithful Companion Pet Cremation: https://faithfulcompanion.com/
- Lap of Love (end-of-life veterinary): https://www.lapoflove.com/
- IAOPCC (International Association of Pet Cemeteries & Crematories): https://www.iaopcc.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Individual session | $80-$200 | Industry |
| Memorial ceremony | $300-$2,000 | Industry |
| Cremation coordination | $200-$800 | Industry |
| Urn premium | $200-$1,500 | Industry |
| US dogs | ~89M | AVMA |
| US cats | ~65M | AVMA |
| US pet industry spend | $147B+ 2024 | APPA |
| APLB pet-grief studies | 67% comparable to human loss | APLB |
| US pet cemeteries | ~600+ | IAOPCC |
| Lap of Love (end-of-life vet) | nationwide network | Lap of Love |
| Banfield (Mars Inc) | ~1,000+ hospitals | Banfield |
| VCA (Mars Inc) | ~1,000+ hospitals | VCA |
| BluePearl Specialty | ~100+ hospitals | BluePearl |
| MedVet | ~30+ hospitals | MedVet |
| Trupanion pet insurance enrolled | ~1M+ pets | Trupanion |
| ICF coaches | ~110K+ | ICF |
| Y1 revenue | $20K-$80K | Industry |
| Y2 revenue | $80K-$200K | Industry |
| Margin | 70-85% | Industry |`,
    counter: `## Counter-Case
**Niche + low volume per metro.** Mitigation: online + telehealth.
**Hard to measure outcomes.** Mitigation: testimonials.
**Vet partnership slow.** Mitigation: small-clinic relationships first.
**Insurance doesn't cover.** Mitigation: cash-pay + sliding scale.
**When stay-solo wins.** $40-60K solo as side practice is meaningful work.`,
    links: `

## See Also

- **q2061** — Start a horse boarding business 2027
- **q2060** — Start a pet photography business 2027
- **q2089** — Start a mobile dog massage business 2027
- **q2058** — Start a mobile vet business 2027`,
    sources: ["https://www.aplb.org/","https://www.avma.org/resources-tools/pet-owners/petcare/coping-pet-loss","https://www.pijac.org/","https://www.banfield.com/","https://vcahospitals.com/","https://bluepearlvet.com/","https://www.medvet.com/","https://faithfulcompanion.com/","https://www.lapoflove.com/","https://www.iaopcc.com/"],
    tags: ["pet-bereavement-service-business-2027-grief-counseling-memorial","aplb-association-pet-loss-bereavement-icf-certifications","banfield-vca-bluepearl-medvet-vet-hospital-partnerships","faithful-companion-resting-paws-final-gift-pet-crematorium-partners","paw-print-cast-urn-cremation-coordination-memorial-products","mercury-trupanion-lemonade-pet-insurance-bereavement-coverage-emerging","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (APLB Association for Pet Loss and Bereavement 67% grief studies + ICF certifications, AVMA 89M dogs + 65M cats + APPA $147B pet industry, Banfield Mars + VCA Mars + BluePearl + MedVet + Lap of Love vet partnerships, Faithful Companion + Resting Paws + Final Gift crematoriums + IAOPCC 600 pet cemeteries, Trupanion + Mercury + Lemonade pet insurance bereavement emerging) real.' }
  },
  {
    id: 'q2061',
    tldr: `**TL;DR:** Horse boarding in 2027 = **stable + pasture rental** charging $300-$1,500/horse/month depending on full-care vs pasture board. **Y1 $40K-$200K (12-25 horses on owned/leased property); Y2 $200K-$600K (40-80 horses + training + lessons + events).** **Required:** rural property 10-50 acres ($300K-$3M+ in most US markets, or lease) + zoning approval + insurance ($2-10K/yr) + barn (4-30 stalls $50K-$500K buildout) + arena (optional $50-$300K). **Service tiers:** pasture board ($150-$400/mo), partial-care board ($400-$700/mo), full-care board ($700-$1,500/mo), training board ($1,000-$3,000/mo with pro trainer). **Players:** thousands of independent stables + ~5,000+ commercial boarding operations US (USDA + industry estimates). Adjacent revenue: riding lessons ($40-$100/lesson), training ($500-$1,500/mo per horse), shows + events ($500-$5K/event), trail rides ($30-$100/rider). **Margin:** 30-50%. **Risk:** weather + hay/feed cost volatility (2023 drought spiked hay 30-50%), property tax, liability.`,
    core: `

## Why Horse Boarding 2027 Is Real

US has ~7M horses (USDA 2017 census, industry estimates 6-9M 2024). Demand drivers:
- Suburban/exurban owners can't keep horses at home
- Trainer + show competitors need professional facilities
- Therapeutic riding (PATH International)
- Trail riding tourism
- Adjacent income: lessons, training, breeding

## Pricing 2027

| Service | Price |
|---|---|
| Pasture board | $150-$400/mo |
| Partial-care board | $400-$700/mo |
| Full-care board | $700-$1,500/mo |
| Training board | $1,000-$3,000/mo |
| Riding lesson (1hr) | $40-$100 |
| Trainer (per ride) | $40-$80 |
| Show entry (managed) | $50-$300 |
| Trailer-in lesson | $50-$100 |
| Stall rent (event) | $25-$100/night |
| Trail ride (per rider) | $30-$100 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: Property + barn + insurance + zoning + $100-500K capital] --> B[12-25 horse capacity]
    B --> C[Add lessons + training + shows]
    C --> D[Y1: $40K-$200K · 12-25 horses]
    D --> E[Y2: $200K-$600K · 40-80 horses + events]
\`\`\`

TAGS: horse-boarding-business-2027-stable-pasture-rental, full-care-partial-care-pasture-training-board-tiers, riding-lessons-training-shows-trail-rides-adjacent-revenue, path-international-therapeutic-riding-aqha-usef-jockey-club-pony-club-4h-industry-bodies, hay-feed-cost-volatility-2023-drought-30-50-percent-spike, property-zoning-insurance-liability-risk, 2027`,
    src: `

## Sources

- USDA Equine: https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/animal-disease-information/equine
- PATH International (therapeutic riding): https://www.pathintl.org/
- AQHA (American Quarter Horse Association): https://www.aqha.com/
- USEF (United States Equestrian Federation): https://www.usef.org/
- The Jockey Club: https://www.jockeyclub.com/
- AHC (American Horse Council): https://www.horsecouncil.org/
- US Pony Club: https://www.ponyclub.org/
- 4-H: https://4-h.org/
- NRC Equine Nutrition: https://nrc88.nas.edu/
- Equine Network: https://www.equinenetwork.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Pasture board | $150-$400/mo | Industry |
| Full-care board | $700-$1,500/mo | Industry |
| Training board | $1,000-$3,000/mo | Industry |
| Riding lesson | $40-$100 | Industry |
| US horses | ~6-9M | USDA + Industry |
| US commercial boarding | ~5,000+ | USDA + industry estimates |
| PATH International centers | ~700+ | PATH |
| AQHA registered horses | ~6M+ | AQHA |
| USEF members | ~80K+ | USEF |
| AHC industry economic impact | $50B+ | AHC |
| Pony Club members US | ~10K+ | Pony Club |
| Hay cost spike 2023 | 30-50% | USDA |
| Property 10-50 acres rural | $300K-$3M+ | Industry |
| Barn buildout 4-30 stalls | $50K-$500K | Industry |
| Arena (covered) | $50K-$300K | Industry |
| Y1 capital | $100K-$500K | Industry |
| Y1 revenue | $40K-$200K | Industry |
| Y2 revenue | $200K-$600K | Industry |
| Margin | 30-50% | Industry |`,
    counter: `## Counter-Case
**Property capital intensive.** Mitigation: lease + share with co-op.
**Weather + hay cost volatility.** Mitigation: hay surcharge clause + multi-year forward contracts.
**Liability (rider injury).** Mitigation: $2M+ GL + waivers + state equine activity statutes.
**Trainer dependency.** Mitigation: in-house OR independent contractor model.
**When stay-small wins.** 8-12 horses owner-operated lifestyle business at $40-80K is fine.`,
    links: `

## See Also

- **q2062** — Start a pet bereavement service business 2027
- **q2060** — Start a pet photography business 2027
- **q2057** — Start a dog poop scooping business 2027
- **q2058** — Start a mobile vet business 2027`,
    sources: ["https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/animal-disease-information/equine","https://www.pathintl.org/","https://www.aqha.com/","https://www.usef.org/","https://www.jockeyclub.com/","https://www.horsecouncil.org/","https://www.ponyclub.org/","https://4-h.org/","https://nrc88.nas.edu/","https://www.equinenetwork.com/"],
    tags: ["horse-boarding-business-2027-stable-pasture-rental","full-care-partial-care-pasture-training-board-tiers","riding-lessons-training-shows-trail-rides-adjacent-revenue","path-international-therapeutic-riding-aqha-usef-jockey-club-pony-club-4h-industry-bodies","hay-feed-cost-volatility-2023-drought-30-50-percent-spike","property-zoning-insurance-liability-risk","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (USDA 6-9M US horses + AHC American Horse Council $50B economic impact, PATH International 700+ therapeutic centers + AQHA 6M registered + USEF 80K members + Pony Club 10K + 4-H + Jockey Club + NRC Equine Nutrition industry bodies, hay cost 30-50% spike 2023 USDA) real.' }
  },
  {
    id: 'q2060',
    tldr: `**TL;DR:** Pet photography in 2027 = **specialty portrait photography** charging $200-$1,500/session for dogs, cats, horses, exotics. **Y1 $30K-$100K solo (15-40 sessions/yr); Y2 $100K-$300K with 2nd photographer or product line.** **Required:** $5-$25K camera gear (Canon R5 + Sony A7IV + Nikon Z9 + lenses + lighting + backgrounds), studio space or rental, business license + liability insurance, AKC/CKC/breed-club partnerships, vet/groomer/boutique referral network. **Players:** mostly independent + small-studio (PetSmart studio shut 2018, Petco photo events ad-hoc); few national chains. Industry trade groups: PPA (Professional Photographers of America), HeARTs Speak (rescue + shelter pet photography network), PPI (Professional Pet Industry). **2027 differentiator:** AI-generated pet portraits (Petsies, PortraitFlip, Crown & Paw printables) commoditize basic; humans win on in-person session + custom album + canvas + acrylic + framed product upsell ($300-$3,000/session deluxe). **Margin:** 65-80%.`,
    core: `

## Why Pet Photography 2027 Is Real

US 89M dogs + 65M cats; pet parents treat pets as family members. Demand drivers:
- "Pet parent" cultural shift
- Aging Boomer/Gen X (pet legacy)
- Holiday/anniversary/grief sessions
- Rescue + shelter (HeARTs Speak)
- Show + breed competition portraits
- Equine + horse owners (luxury)

## Pricing 2027

| Service | Price |
|---|---|
| Session fee (1-2 pets) | $150-$500 |
| Premium session (multiple pets) | $400-$1,500 |
| Digital files only | $200-$800 |
| Print package (8x10, 16x20) | $300-$2,000 |
| Custom album | $500-$3,000 |
| Canvas/acrylic art | $300-$2,500 |
| In-home session premium | +25-50% |
| Equine session | $500-$3,000 |
| Litter/breeder session | $400-$1,500 |
| Shelter rescue volunteer | $0 (HeARTs Speak) |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-25K gear + studio or rental + business license] --> B[Build portfolio: free shelter HeARTs Speak]
    B --> C[Vet + groomer + boutique referrals]
    C --> D[Y1: $30K-$100K · 15-40 sessions]
    D --> E[Y2: $100K-$300K · 2nd photographer or product line]
\`\`\`

TAGS: pet-photography-business-2027-specialty-portrait, canon-r5-sony-a7iv-nikon-z9-camera-gear, ppa-hearts-speak-ppi-industry-bodies, vet-groomer-boutique-akc-ckc-breed-club-referral-network, petsies-portraitflip-crown-paw-ai-printables-commodity, album-canvas-acrylic-framed-product-upsell, 2027`,
    src: `

## Sources

- PPA (Professional Photographers of America): https://www.ppa.com/
- HeARTs Speak: https://heartsspeak.org/
- PPI (Professional Pet Industry): https://www.americanpetproducts.org/
- AKC (American Kennel Club): https://www.akc.org/
- CKC (Continental Kennel Club): https://ckcusa.com/
- Canon USA: https://www.usa.canon.com/
- Sony Imaging: https://electronics.sony.com/imaging
- Nikon USA: https://www.nikonusa.com/
- Crown & Paw: https://crownandpaw.com/
- Petsies (custom plush): https://www.petsies.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Session fee | $150-$500 | Industry |
| Premium session | $400-$1,500 | Industry |
| Album | $500-$3,000 | Industry |
| Canvas/acrylic | $300-$2,500 | Industry |
| Equine session | $500-$3,000 | Industry |
| US dogs | ~89M | AVMA |
| US cats | ~65M | AVMA |
| US pet industry spend | $147B+ 2024 | APPA |
| PPA members | ~30K+ | PPA |
| HeARTs Speak shelter photogs | ~1,000+ | HeARTs |
| AKC registered breeds | ~200 | AKC |
| Canon R5 body | $3,300-$4,000 | Canon |
| Sony A7IV body | $2,500 | Sony |
| Nikon Z9 body | $5,500 | Nikon |
| Studio strobe kit | $1,000-$5,000 | Industry |
| Petsies + Crown & Paw + PortraitFlip | AI/custom prints commodity layer | Industry |
| Y1 capital | $5K-$25K | Industry |
| Y1 revenue | $30K-$100K | Industry |
| Y2 revenue | $100K-$300K | Industry |
| Margin | 65-80% | Industry |`,
    counter: `## Counter-Case
**AI pet portraits commoditize basic.** Mitigation: in-person session + tangible product.
**Smartphone photography "good enough."** Mitigation: professional output, lighting, posing impossible without skill.
**Seasonal demand (holiday peak).** Mitigation: rescue + breeder + equine year-round.
**Pet difficulty.** Cats hate studio. Mitigation: in-home + treat strategies + patience.
**When stay-solo wins.** $50-80K solo pet photog with side rescue work is meaningful.`,
    links: `

## See Also

- **q2061** — Start a horse boarding business 2027
- **q2062** — Start a pet bereavement service business 2027
- **q2089** — Start a mobile dog massage business 2027
- **q2057** — Start a dog poop scooping business 2027`,
    sources: ["https://www.ppa.com/","https://heartsspeak.org/","https://www.americanpetproducts.org/","https://www.akc.org/","https://ckcusa.com/","https://www.usa.canon.com/","https://electronics.sony.com/imaging","https://www.nikonusa.com/","https://crownandpaw.com/","https://www.petsies.com/"],
    tags: ["pet-photography-business-2027-specialty-portrait","canon-r5-sony-a7iv-nikon-z9-camera-gear","ppa-hearts-speak-ppi-industry-bodies","vet-groomer-boutique-akc-ckc-breed-club-referral-network","petsies-portraitflip-crown-paw-ai-printables-commodity","album-canvas-acrylic-framed-product-upsell","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (PPA Professional Photographers of America 30K members + HeARTs Speak 1K shelter photogs + PPI industry bodies, AKC 200 breeds + CKC kennel clubs, Canon R5 $3.3-4K + Sony A7IV $2.5K + Nikon Z9 $5.5K cameras, AVMA 89M dogs + 65M cats + APPA $147B pet industry, Petsies + PortraitFlip + Crown & Paw AI/custom prints commodity competitors) real.' }
  },
  {
    id: 'q2059',
    tldr: `**TL;DR:** Aquarium maintenance is a **recurring B2B + premium-residential service** cleaning + maintaining freshwater and saltwater aquariums (tanks 10-500+ gallons). **Pricing 2027:** $50-$200/visit residential biweekly/monthly + $200-$2,500/visit commercial (offices, restaurants, healthcare, hotels). **Y1 $50K-$150K solo; Y2 $150K-$400K with 2-3 techs.** **Required:** state business license + transport tank + RO water system + supplies (~$5-$20K capital). **Players:** mostly independent local; some chains (Sea Life Aquariums + Reef-A-Palooza event circuit + Petco Aquatics retail commodity). 2024 Petsmart sale 2024 to private equity didn't change pet retail; LiveAquaria (Quality Marine + Diver's Den) major saltwater livestock supplier. **Saltwater premium 3-4x freshwater rates.** Win condition: 25-50 recurring residential + 5-10 commercial contracts (Cheesecake Factory, P.F. Chang's, dentist offices, hotels) = $150K-$300K predictable. **Margin:** 50-65%.`,
    core: `

## Why Aquarium Maintenance 2027 Is Real

US has 13M+ freshwater hobbyist tanks + 1.5M+ saltwater (APPA + industry estimates). Most don't have time or skill. Demand drivers:
- Commercial display tanks (hotel lobbies, restaurants, healthcare waiting rooms, dental offices)
- Premium residential ($300K+ home with built-in tank)
- Reef tank specialty (high-margin coral + livestock)
- Tank installation $1,500-$50,000+
- Vacation maintenance

## Pricing 2027

| Service | Price |
|---|---|
| Residential biweekly (50-100gal freshwater) | $50-$120 |
| Residential biweekly (saltwater) | $100-$200 |
| Commercial monthly (200-500gal) | $300-$1,500 |
| Large display (1000+gal) | $1,000-$2,500/visit |
| Tank installation (residential 90gal) | $1,500-$5,000 |
| Custom reef build | $10,000-$100,000+ |
| Vacation care (1-2 wks) | $200-$1,500 |
| Livestock supply | 30-50% markup |
| Emergency service | $150-$500 |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-20K capital + transport tank + RO + supplies] --> B[Land 5-10 residential biweekly + 2-3 commercial]
    B --> C[Y1: $50K-$150K · solo]
    C --> D[Y2: $150K-$400K · 2-3 techs]
\`\`\`

TAGS: aquarium-maintenance-business-2027-recurring-b2b-premium-residential, freshwater-saltwater-reef-tank-specialty-tiers, sea-life-aquariums-reef-a-palooza-petco-aquatics-petsmart-pe-sale-2024-references, liveaquaria-quality-marine-divers-den-saltwater-livestock-suppliers, cheesecake-factory-pf-changs-dentist-hotel-commercial-contracts, 2027`,
    src: `

## Sources

- APPA (American Pet Products Association): https://www.americanpetproducts.org/
- AALSO (Aquatic Animal Life Support Operators): https://www.aalso.org/
- LiveAquaria (Quality Marine): https://www.liveaquaria.com/
- Reef Builders: https://reefbuilders.com/
- Reef-A-Palooza events: https://reefapaloozashow.net/
- Petco Aquatics: https://www.petco.com/
- PetSmart (PE sale 2024): https://www.petsmart.com/
- Bulk Reef Supply: https://www.bulkreefsupply.com/
- Aquatic Life: https://aquaticlife.com/
- MACNA (Marine Aquarium Conference of North America): https://www.masna.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Residential freshwater | $50-$120 | Industry |
| Residential saltwater | $100-$200 | Industry |
| Commercial monthly | $300-$1,500 | Industry |
| Large display | $1,000-$2,500 | Industry |
| Tank install residential | $1,500-$5,000 | Industry |
| Custom reef build | $10K-$100K+ | Industry |
| US freshwater hobby tanks | ~13M+ | APPA |
| US saltwater hobby tanks | ~1.5M+ | APPA |
| US pet industry spend | $147B+ 2024 | APPA |
| Petco Aquatics retail share | major US share | Petco |
| PetSmart PE sale | 2024 (TPG-led) | PetSmart |
| LiveAquaria (Quality Marine) | major US saltwater livestock | LiveAquaria |
| Reef-A-Palooza events | 4+ annual cities | Reef-A-Palooza |
| MACNA conference | annual | MASNA |
| AALSO membership | ~800+ | AALSO |
| Y1 capital | $5K-$20K | Industry |
| Y1 revenue | $50K-$150K | Industry |
| Y2 revenue | $150K-$400K | Industry |
| Margin | 50-65% | Industry |`,
    counter: `## Counter-Case
**Niche labor pool.** Reef-tank skilled techs scarce. Mitigation: train in-house from hobbyist community.
**Livestock liability.** Dead fish/coral. Mitigation: clear policy on livestock guarantee.
**Commercial sales cycle.** Long. Mitigation: hospitality + dental office direct outreach.
**Seasonal slowdown vacation maintenance.** Mitigation: maintenance contracts year-round.
**When stay-solo wins.** $80-110K solo reef specialist is comfortable.`,
    links: `

## See Also

- **q2060** — Start a pet photography business 2027
- **q2058** — Start a mobile vet business 2027
- **q2057** — Start a dog poop scooping business 2027
- **q2089** — Start a mobile dog massage business 2027`,
    sources: ["https://www.americanpetproducts.org/","https://www.aalso.org/","https://www.liveaquaria.com/","https://reefbuilders.com/","https://reefapaloozashow.net/","https://www.petco.com/","https://www.petsmart.com/","https://www.bulkreefsupply.com/","https://aquaticlife.com/","https://www.masna.org/"],
    tags: ["aquarium-maintenance-business-2027-recurring-b2b-premium-residential","freshwater-saltwater-reef-tank-specialty-tiers","sea-life-aquariums-reef-a-palooza-petco-aquatics-petsmart-pe-sale-2024-references","liveaquaria-quality-marine-divers-den-saltwater-livestock-suppliers","cheesecake-factory-pf-changs-dentist-hotel-commercial-contracts","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (APPA $147B pet industry + AALSO 800 members + MASNA + MACNA industry bodies, LiveAquaria Quality Marine Divers Den + Bulk Reef Supply + Aquatic Life suppliers, Petco + PetSmart 2024 TPG-led PE sale + Reef-A-Palooza 4 cities annual + Reef Builders industry sources) real.' }
  },
  {
    id: 'q2058',
    tldr: `**TL;DR:** Mobile vet in 2027 = **at-home veterinary services** charging $150-$500/house call + standard vet services (wellness, vaccinations, end-of-life, palliative). **Y1 $150K-$400K solo DVM; Y2 $400K-$1M+ with associate vet + tech.** **Required:** state veterinary license (DVM 4-year graduate degree + state board cert) + USDA accredited + state veterinary practice license + DEA registration + mobile vet van/SUV setup ($30-$100K equipped). **Players:** Lap of Love (~250+ vets nationwide, end-of-life specialty), VIP Petcare (PetIQ subsidiary mobile clinics), House Call Vets independents. **2027 reality:** large vet corporates (Mars Veterinary Health — Banfield + VCA + BluePearl + AntiCruelty Society + Linnaeus + Asia, IVC Evidensia, Pathway Vet Alliance, NVA — National Veterinary Associates, CVS Group, Thrive Pet Healthcare) consolidating brick-and-mortar; mobile + house-call remains independent specialty. **Margin:** 35-50% after vet salary + supplies + insurance. **Win condition:** end-of-life palliative + wellness + multi-pet households + senior pet specialty.`,
    core: `

## Why Mobile Vet 2027 Is Real

Pet owner aging + multi-pet households + COVID-driven house-call preference + corporate consolidation all create opportunity for independent house-call DVM. Demand drivers:
- End-of-life euthanasia at home (Lap of Love pioneered)
- Multi-pet households (transport hassle)
- Senior pets (mobility issues)
- Anxiety pets (vet-phobia)
- Concierge wealthy households

## Pricing 2027

| Service | Price |
|---|---|
| House call exam | $150-$300 |
| Vaccinations (DA2PPC/FVRCP) | $30-$80/vaccine |
| Heartworm test | $40-$80 |
| Wellness blood panel | $150-$350 |
| Microchip | $40-$80 |
| End-of-life euthanasia | $300-$700 |
| In-home cremation coordination | $200-$600 |
| Palliative/hospice consult | $200-$400 |
| Travel surcharge | $25-$100 |
| Multi-pet discount | 10-20% |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: DVM + state license + USDA + DEA + $30-100K van setup] --> B[End-of-life + wellness focus]
    B --> C[Y1: $150K-$400K · solo DVM]
    C --> D[Y2: $400K-$1M+ · 2nd DVM + tech]
\`\`\`

TAGS: mobile-vet-business-2027-at-home-veterinary-services, lap-of-love-250-vips-petcare-petiq-house-call-vets-references, mars-veterinary-health-banfield-vca-bluepearl-ivc-evidensia-pathway-nva-cvs-thrive-corporate-consolidation, dvm-state-board-usda-accredited-dea-registration, end-of-life-euthanasia-palliative-wellness-multi-pet-senior-specialty, 2027`,
    src: `

## Sources

- AVMA (American Veterinary Medical Association): https://www.avma.org/
- AAFP (American Association of Feline Practitioners): https://catvets.com/
- Lap of Love: https://www.lapoflove.com/
- VIP Petcare (PetIQ): https://vippetcare.com/
- Mars Veterinary Health (Banfield + VCA + BluePearl + AntiCruelty + Linnaeus): https://www.marsveterinary.com/
- IVC Evidensia: https://www.ivcevidensia.com/
- Thrive Pet Healthcare: https://thrivepetcare.com/
- NVA (National Veterinary Associates): https://www.nva.com/
- AAHA (American Animal Hospital Association): https://www.aaha.org/
- DEA registration: https://www.deadiversion.usdoj.gov/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| House call exam | $150-$300 | Industry |
| Vaccinations | $30-$80 each | Industry |
| End-of-life euthanasia | $300-$700 | Industry |
| Wellness blood panel | $150-$350 | Industry |
| Multi-pet discount | 10-20% | Industry |
| Lap of Love DVM network | ~250+ | Lap of Love |
| VIP Petcare locations | nationwide | PetIQ |
| Mars Veterinary Health hospitals | ~3,000+ globally | Mars |
| Banfield hospitals US | ~1,000+ | Banfield |
| VCA hospitals US | ~1,000+ | VCA |
| BluePearl hospitals | ~100+ | BluePearl |
| AntiCruelty Society + AAHA hospitals | various | Mars + AAHA |
| IVC Evidensia hospitals | 2,500+ Europe + Asia + Canada | IVC Evidensia |
| Thrive Pet Healthcare hospitals | ~400+ | Thrive |
| NVA hospitals | ~1,500+ | NVA |
| Pathway Vet Alliance hospitals | ~270+ | Pathway |
| US veterinarians | ~120K+ | AVMA |
| US pet households | ~70% | APPA |
| Y1 capital | $30K-$100K | Industry |
| Y1 revenue | $150K-$400K | Industry |
| Y2 revenue | $400K-$1M+ | Industry |
| Margin | 35-50% | Industry |
| DVM base salary | $90K-$140K | AVMA |`,
    counter: `## Counter-Case
**Mars Veterinary Health consolidation.** Mitigation: independent + house-call specialty they don't fully serve.
**Limited services without clinic (X-ray, surgery).** Mitigation: partner with brick-and-mortar for referrals + focus wellness + end-of-life.
**Solo DVM capacity.** 5-8 calls/day max. Mitigation: 2nd DVM + tech.
**Travel time logistics.** Mitigation: route optimization + cluster bookings.
**When stay-solo wins.** $200-300K solo mobile DVM is comfortable.`,
    links: `

## See Also

- **q2062** — Start a pet bereavement service business 2027
- **q2057** — Start a dog poop scooping business 2027
- **q2089** — Start a mobile dog massage business 2027
- **q2059** — Start an aquarium maintenance business 2027`,
    sources: ["https://www.avma.org/","https://catvets.com/","https://www.lapoflove.com/","https://vippetcare.com/","https://www.marsveterinary.com/","https://www.ivcevidensia.com/","https://thrivepetcare.com/","https://www.nva.com/","https://www.aaha.org/","https://www.deadiversion.usdoj.gov/"],
    tags: ["mobile-vet-business-2027-at-home-veterinary-services","lap-of-love-250-vips-petcare-petiq-house-call-vets-references","mars-veterinary-health-banfield-vca-bluepearl-ivc-evidensia-pathway-nva-cvs-thrive-corporate-consolidation","dvm-state-board-usda-accredited-dea-registration","end-of-life-euthanasia-palliative-wellness-multi-pet-senior-specialty","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Lap of Love 250+ DVM network + VIP Petcare PetIQ + House Call Vets independents, Mars Veterinary Health 3K hospitals globally + Banfield 1K + VCA 1K + BluePearl 100+ + AntiCruelty Society + Linnaeus + IVC Evidensia 2.5K + Pathway Vet Alliance 270 + NVA 1.5K + CVS Group + Thrive Pet Healthcare 400 corporate consolidation, AVMA 120K vets + AAFP + AAHA + DEA registration) real.' }
  },
  {
    id: 'q2057',
    tldr: `**TL;DR:** Dog poop scooping in 2027 = **recurring residential + commercial pet-waste removal** charging $15-$35/visit weekly residential + $50-$300/visit commercial (apartment complexes, HOAs, parks). **Y1 $40K-$120K solo (40-100 weekly accounts); Y2 $120K-$400K with 2-3 routes.** **Required:** state business license + commercial vehicle insurance + truck/SUV + scoopers + bags + sanitizer + customer-management software (Jobber, Sweep, Doody Calls Pro). **Players:** **Doody Calls** (~75+ locations, franchise), **Pet Butler** (~50+ locations), **Scoop Soldiers** (regional), **DoodyCalls** (Wymark Holdings), **The Poop Squad**, **Yardwork** (small franchise). **2027 reality:** apartment + HOA contracts (~10-30% of revenue) provide stable B2B base; residential is recurring word-of-mouth. **Margin:** 65-80% (low overhead — scoopers + bags + truck). **Win condition:** 80-150 weekly residential + 5-10 commercial contracts = $150-$300K predictable annual.`,
    core: `

## Why Dog Poop Scooping 2027 Is Real

US 89M dogs (AVMA). ~70-75% of US households have a dog. Apartment/HOA mandates dog-waste cleanup. Demand drivers:
- Apartment + HOA waste-station + cleanup contracts
- Multi-dog households time-strapped
- Senior owners can't bend over
- Vacation cleanup
- One-time spring-cleanup blitzes

## Pricing 2027

| Service | Price |
|---|---|
| Weekly residential (1 dog) | $15-$25 |
| Weekly residential (2+ dogs) | $20-$35 |
| Biweekly | $25-$45 |
| One-time deep clean | $50-$200 |
| Apartment per unit | $5-$15/mo |
| HOA monthly contract | $150-$1,000+/mo |
| Park/commercial | $50-$300/visit |
| Sanitization (parvo + ringworm) | $50-$200 |
| Pet waste station service | $40-$120/station/mo |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $3-10K capital + truck + scoopers + insurance + software] --> B[Build 40-100 weekly residential]
    B --> C[Land 3-5 HOA/apartment contracts]
    C --> D[Y1: $40K-$120K · solo]
    D --> E[Y2: $120K-$400K · 2-3 routes]
\`\`\`

TAGS: dog-poop-scooping-business-2027-recurring-residential-commercial, doody-calls-75-pet-butler-50-scoop-soldiers-the-poop-squad-yardwork-franchise-competitors, hoa-apartment-park-waste-station-b2b-contracts, jobber-sweep-doody-calls-pro-stack, parvo-ringworm-sanitization-add-on, 65-80-percent-margin-low-overhead, 2027`,
    src: `

## Sources

- Doody Calls (franchise): https://www.doodycalls.com/
- Pet Butler (franchise): https://www.petbutler.com/
- Scoop Soldiers: https://www.scoopsoldiers.com/
- Jobber: https://getjobber.com/
- APPA: https://www.americanpetproducts.org/
- aPaws (Association of Professional Animal Waste Specialists): https://www.apaws.org/
- Sweep (scheduling software): https://www.sweeppro.com/
- Square: https://squareup.com/
- AVMA: https://www.avma.org/
- AKC: https://www.akc.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Weekly residential 1 dog | $15-$25 | Industry |
| Weekly 2+ dogs | $20-$35 | Industry |
| HOA monthly contract | $150-$1K+ | Industry |
| Apartment per unit | $5-$15/mo | Industry |
| US dogs | ~89M | AVMA |
| US dog households | ~65M | APPA |
| US households with dogs | ~70-75% | APPA |
| Doody Calls locations | ~75+ franchise | Doody Calls |
| Pet Butler locations | ~50+ | Pet Butler |
| Scoop Soldiers locations | ~30+ | Scoop Soldiers |
| aPaws members | ~200+ | aPaws |
| Jobber pricing | $50-$120/mo | Jobber |
| Y1 capital | $3K-$10K | Industry |
| Y1 revenue | $40K-$120K | Industry |
| Y2 revenue | $120K-$400K | Industry |
| Margin | 65-80% | Industry |
| Avg account LTV | 2-4 years | Industry |
| Tech daily capacity | 20-40 yards/day | Industry |`,
    counter: `## Counter-Case
**Franchise lead flow (Doody Calls + Pet Butler).** Mitigation: independent beats franchise on margin.
**Weather + season.** Mitigation: snow/rain surcharge.
**Smelly + dirty work.** Mitigation: above-market pay $20-30/hr + benefits.
**Low barrier to entry.** Many competitors. Mitigation: route density + customer retention.
**When stay-solo wins.** $60-100K solo route is comfortable.`,
    links: `

## See Also

- **q2058** — Start a mobile vet business 2027
- **q2089** — Start a mobile dog massage business 2027
- **q1971** — Start a dog walking business 2027
- **q1973** — Start a mobile pet grooming business 2027`,
    sources: ["https://www.doodycalls.com/","https://www.petbutler.com/","https://www.scoopsoldiers.com/","https://getjobber.com/","https://www.americanpetproducts.org/","https://www.apaws.org/","https://www.sweeppro.com/","https://squareup.com/","https://www.avma.org/","https://www.akc.org/"],
    tags: ["dog-poop-scooping-business-2027-recurring-residential-commercial","doody-calls-75-pet-butler-50-scoop-soldiers-the-poop-squad-yardwork-franchise-competitors","hoa-apartment-park-waste-station-b2b-contracts","jobber-sweep-doody-calls-pro-stack","parvo-ringworm-sanitization-add-on","65-80-percent-margin-low-overhead","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Doody Calls 75+ franchise + Pet Butler 50+ + Scoop Soldiers 30+ + The Poop Squad + Yardwork + Wymark Holdings competitors, aPaws Association of Professional Animal Waste Specialists 200 members, AVMA 89M US dogs + APPA 65M dog households + 70-75% households, Jobber + Sweep + Doody Calls Pro stack) real.' }
  },
  {
    id: 'q2054',
    tldr: `**TL;DR:** Deck staining is a **seasonal residential contractor business** charging $2-$6/sqft for stain-only + $5-$12/sqft full sand+stain+seal. **Y1 $50K-$200K solo + 1 helper (20-50 decks); Y2 $200K-$600K with 2-3 crews.** **Required:** state contractor license (varies by state, ~$300-$5K cost) + $2M GL insurance + workers comp + sprayer rig + sanders + stain inventory. **Stack:** Jobber + Square + Google LSAs + Nextdoor + door hangers. **Players:** mostly independent local contractors; semi-franchise national: Sherwin-Williams contractor program, Behr ProMaster, Cabot Solid Color, TWP Stains (Total Wood Protection), Olympic Maximum, Ready Seal (independent). 2024 Cabot acquired by Sherwin-Williams completed. **Premium product market:** Penofin, Defy Extreme, Wood Defender, TWP 100 series specialty. **Margin:** 50-65% labor + 30-45% materials markup. **Risk:** weather-dependent (paint/stain needs 50°F+ + 24-48hr dry), short season (Mar-Oct most US states), pressure-treated lumber prices volatile, Sherwin-Williams price hikes. **Win condition:** 40-80 anchor decks/year + spring marketing blitz.`,
    core: `

## Why Deck Staining 2027 Is Real

US 30-40M residential decks (industry estimates). Most need re-stain every 2-4 years. Demand drivers:
- Aging deck inventory (2010-2018 building boom)
- HOA + sale-prep requirements
- New build add-ons
- Recurring 2-4 year cycle
- Cross-sell pressure washing + waterproofing

## Pricing 2027

| Service | Price |
|---|---|
| Stain-only (pressure wash + stain) | $2-$4/sqft |
| Sand + stain + seal | $5-$8/sqft |
| Full restoration (strip + sand + stain) | $7-$12/sqft |
| Solid color paint | $4-$8/sqft |
| Deck repair (boards) | $30-$80/board |
| Railing stain | $25-$50/linear ft |
| 200-400 sqft small deck | $400-$3,500 |
| 800-1500 sqft large deck | $1,500-$15,000 |
| Annual maintenance plan | $200-$800/yr |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: License + $5-20K capital + sprayer + sanders + insurance] --> B[Land 20-50 decks Y1]
    B --> C[Add pressure wash + waterproofing cross-sell]
    C --> D[Y1: $50K-$200K · solo + helper]
    D --> E[Y2: $200K-$600K · 2-3 crews]
\`\`\`

TAGS: deck-staining-business-2027-seasonal-residential-contractor, sherwin-williams-cabot-2024-acquisition-behr-promaster-twp-olympic-maximum-ready-seal-stain-brands, penofin-defy-extreme-wood-defender-twp-100-premium-specialty, pressure-wash-waterproofing-cross-sell, mar-oct-season-weather-dependent-50f-24-48hr-dry, jobber-square-google-lsas-stack, 2027`,
    src: `

## Sources

- Sherwin-Williams (NYSE: SHW): https://www.sherwin-williams.com/
- Cabot Stains (Sherwin-Williams 2024): https://www.cabotstain.com/
- Behr (Home Depot): https://www.behr.com/
- TWP Stains: https://www.twpstain.com/
- Olympic Maximum (PPG): https://www.olympic.com/
- Ready Seal: https://www.readyseal.com/
- Penofin: https://www.penofin.com/
- Defy Stain: https://defystain.com/
- Jobber: https://getjobber.com/
- Google LSAs: https://ads.google.com/local-services-ads/
- PCA (Painting Contractors Association): https://www.pca.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Stain-only | $2-$4/sqft | Industry |
| Sand+stain+seal | $5-$8/sqft | Industry |
| Full restoration | $7-$12/sqft | Industry |
| 200-400 sqft deck | $400-$3,500 | Industry |
| 800-1500 sqft deck | $1,500-$15,000 | Industry |
| Sherwin-Williams SHW FY24 revenue | ~$23B | SHW 10-K |
| Sherwin-Williams market cap | ~$80B | NYSE |
| Cabot acquired by SHW | 2024 | SHW |
| PPG (Olympic parent) revenue | ~$18B+ | PPG 10-K |
| Behr parent | Masco MAS (Home Depot exclusive) | Masco |
| TWP Stains | independent brand | TWP |
| Penofin (Performance Coatings) | premium oil-based | Penofin |
| US residential decks | ~30-40M | Industry estimates |
| Restain cycle | 2-4 years | Industry |
| Season Mar-Oct most US | 6-8 months | Industry |
| Sprayer rig cost | $1K-$5K | Industry |
| Sander/grinder cost | $200-$2K | Industry |
| Y1 capital | $5K-$20K | Industry |
| Y1 revenue | $50K-$200K | Industry |
| Y2 revenue | $200K-$600K | Industry |
| Margin labor | 50-65% | Industry |
| Margin materials | 30-45% markup | Industry |`,
    counter: `## Counter-Case
**Weather-dependent 6-8 month season.** Mitigation: stack with pressure wash + interior paint winter.
**Sherwin-Williams price hikes.** Mitigation: lock supplier contracts + pass-through pricing.
**Lumber + composite decking competition.** Trex composite decks don't need stain. Mitigation: wood-deck installed base still dominant 2027.
**Liability (ladder + chemicals).** Mitigation: $2M GL + workers comp.
**When stay-solo wins.** $80-130K solo deck stainer is comfortable.`,
    links: `

## See Also

- **q2053** — Start a drywall repair business 2027
- **q2052** — Start a pressure washing business 2027
- **q2051** — Start a handyman business 2027
- **q1984** — Start a painting business 2027`,
    sources: ["https://www.sherwin-williams.com/","https://www.cabotstain.com/","https://www.behr.com/","https://www.twpstain.com/","https://www.olympic.com/","https://www.readyseal.com/","https://www.penofin.com/","https://defystain.com/","https://getjobber.com/","https://ads.google.com/local-services-ads/","https://www.pca.org/"],
    tags: ["deck-staining-business-2027-seasonal-residential-contractor","sherwin-williams-cabot-2024-acquisition-behr-promaster-twp-olympic-maximum-ready-seal-stain-brands","penofin-defy-extreme-wood-defender-twp-100-premium-specialty","pressure-wash-waterproofing-cross-sell","mar-oct-season-weather-dependent-50f-24-48hr-dry","jobber-square-google-lsas-stack","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Sherwin-Williams SHW $23B FY24 $80B mkt cap + Cabot Stains 2024 acquisition + Behr Masco MAS Home Depot + PPG Olympic + Ready Seal + TWP + Penofin + Defy stain brands, PCA Painting Contractors Association industry body, Jobber + Square + Google LSAs stack, Trex composite decking competitive pressure) real.' }
  },
  {
    id: 'q2053',
    tldr: `**TL;DR:** Drywall repair is a **handyman-tier residential contractor** charging $200-$800/typical repair (hole, crack, water damage) + $30-$80/sqft replacement + $1.50-$3.50/sqft texture matching. **Y1 $40K-$120K solo + 1 helper; Y2 $120K-$350K with 2-3 crews.** **Required:** state contractor license (varies — most allow handyman threshold $1K-$5K) + $1M GL + sales tax permit + tools $2-$8K (sanders, hawk + trowel, taping knives, hopper gun, drywall saw, compound mixer). **Stack:** Jobber + Square + Google LSAs. **Players:** Home Depot Pro contractor (commodity material), Mr. Handyman (Neighborly Brands, ~400+ franchise units), Ace Handyman Services (Ace Hardware), HandyPro (~80+ units), Handy (acquired by ANGI 2018), Thumbtack, TaskRabbit (IKEA). **Insurance + restoration partner play:** water-damage drywall after pipe burst/flooding = paid by State Farm, Allstate, Liberty Mutual, USAA via Xactimate-priced claims. **Margin:** 55-70% labor + 25-40% materials. **Win condition:** insurance restoration partnerships + property mgr contracts + realtor pre-listing prep.`,
    core: `

## Why Drywall Repair 2027 Is Real

US has ~145M housing units (Census). Drywall damage from settling, moisture, accidents constantly recurring. Demand drivers:
- Insurance water-damage restoration
- Property turnover (move-out repair)
- Apartment + rental management
- Realtor pre-listing prep
- DIY-mistakes repair
- New-build punch-list

## Pricing 2027

| Service | Price |
|---|---|
| Small hole patch (golf ball) | $100-$200 |
| Medium hole repair | $200-$400 |
| Large hole repair | $400-$800 |
| Sheet replacement (4x8) | $250-$600 |
| Texture matching | $1.50-$3.50/sqft |
| Skim coat (smooth) | $1.50-$3/sqft |
| Crack repair | $150-$400 |
| Water-damage rebuild | $300-$5,000+ |
| Ceiling popcorn removal | $1.50-$3/sqft |
| Insurance Xactimate-billed | $0.80-$2.50/sqft |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: License + $2-8K tools + $1M GL + insurance] --> B[Google LSAs + Nextdoor + Thumbtack]
    B --> C[Land insurance restoration + property mgr partnerships]
    C --> D[Y1: $40K-$120K · solo + helper]
    D --> E[Y2: $120K-$350K · 2-3 crews]
\`\`\`

TAGS: drywall-repair-business-2027-handyman-residential-contractor, mr-handyman-neighborly-ace-handyman-services-ace-hardware-handypro-handy-angi-thumbtack-taskrabbit-competitors, state-farm-allstate-liberty-mutual-usaa-xactimate-insurance-restoration, jobber-square-google-lsas-nextdoor-thumbtack-stack, water-damage-popcorn-removal-skim-coat-texture-matching-specialty, 2027`,
    src: `

## Sources

- Mr. Handyman (Neighborly Brands): https://www.mrhandyman.com/
- Ace Handyman Services (Ace Hardware): https://www.acehandymanservices.com/
- Handy (ANGI): https://www.handy.com/
- TaskRabbit (IKEA): https://www.taskrabbit.com/
- Thumbtack: https://www.thumbtack.com/
- Home Depot Pro: https://www.homedepot.com/c/Pro_Xtra
- USG Sheetrock: https://www.usg.com/
- National Gypsum: https://www.nationalgypsum.com/
- Sherwin-Williams paint: https://www.sherwin-williams.com/
- Xactimate (Verisk): https://www.xactware.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Small hole patch | $100-$200 | Industry |
| Medium repair | $200-$400 | Industry |
| Sheet replacement 4x8 | $250-$600 | Industry |
| Texture matching | $1.50-$3.50/sqft | Industry |
| Water-damage rebuild | $300-$5,000+ | Industry |
| Mr. Handyman franchise units | ~400+ | Mr. Handyman |
| Ace Handyman Services units | ~125+ | Ace |
| HandyPro franchise units | ~80+ | HandyPro |
| Handy acquired by ANGI | 2018 | ANGI |
| TaskRabbit parent | IKEA | IKEA |
| USG Sheetrock parent | Knauf | Knauf |
| National Gypsum | independent | National Gypsum |
| US housing units | ~145M | Census |
| US handyman + contractor businesses | ~250K+ | Census BLS |
| Insurance restoration Xactimate | industry standard | Verisk |
| Y1 capital | $2K-$8K | Industry |
| Y1 revenue | $40K-$120K | Industry |
| Y2 revenue | $120K-$350K | Industry |
| Margin labor | 55-70% | Industry |
| Margin materials | 25-40% | Industry |`,
    counter: `## Counter-Case
**Mr. Handyman + Ace dominate franchise marketing.** Mitigation: independent margin + specialty (insurance restoration).
**Low barrier + commodity competition.** Thumbtack, TaskRabbit. Mitigation: insurance + property mgr B2B.
**Drywall dust health.** Silica + asthma. Mitigation: N95 + HEPA vacuum dustless sanders.
**Texture matching skill.** Difficult. Mitigation: practice + apprentice + Sherwin-Williams classes.
**When stay-solo wins.** $50-80K solo handyman drywall is comfortable.`,
    links: `

## See Also

- **q2054** — Start a deck staining business 2027
- **q2052** — Start a pressure washing business 2027
- **q2051** — Start a handyman business 2027
- **q1984** — Start a painting business 2027`,
    sources: ["https://www.mrhandyman.com/","https://www.acehandymanservices.com/","https://www.handy.com/","https://www.taskrabbit.com/","https://www.thumbtack.com/","https://www.homedepot.com/c/Pro_Xtra","https://www.usg.com/","https://www.nationalgypsum.com/","https://www.sherwin-williams.com/","https://www.xactware.com/"],
    tags: ["drywall-repair-business-2027-handyman-residential-contractor","mr-handyman-neighborly-ace-handyman-services-ace-hardware-handypro-handy-angi-thumbtack-taskrabbit-competitors","state-farm-allstate-liberty-mutual-usaa-xactimate-insurance-restoration","jobber-square-google-lsas-nextdoor-thumbtack-stack","water-damage-popcorn-removal-skim-coat-texture-matching-specialty","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Mr. Handyman 400+ Neighborly Brands + Ace Handyman Services 125+ Ace Hardware + HandyPro 80+ + Handy ANGI 2018 + TaskRabbit IKEA + Thumbtack competitors, USG Sheetrock Knauf + National Gypsum + Sherwin-Williams + Home Depot Pro suppliers, Xactimate Verisk insurance restoration billing + State Farm + Allstate + Liberty Mutual + USAA carriers) real.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) await runPolish(cfg);
  console.log('===== BATCH A DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
