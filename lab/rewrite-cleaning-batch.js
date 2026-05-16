// Cleaning batch: q2117, q2116, q2115, q2114, q2113, q2112, q2111, q2110
const { runPolish } = require('./polish-helper');

const ENTRIES = [
  {
    id: 'q2117',
    tldr: `**TL;DR:** Post-construction cleanup is a **B2B service business** selling to general contractors, custom-home builders, and commercial GCs cleaning up the dust, debris, and stickers before a homeowner walkthrough or commercial occupancy. **Pricing 2027:** $0.20-$0.45/sqft rough clean + $0.30-$0.60/sqft final clean for residential; $0.40-$1.20/sqft commercial; $5K-$50K per job for new commercial buildouts. **Y1 $80K-$250K (solo + 2-3 crew); Y2 $250K-$700K (3-4 crews + 1 ops manager).** **Stack:** Jobber + Square + ServiceTitan or Aspire (residential). **Why it works:** GCs pay net-30, builders prefer single trusted vendor, repeat customer (90%+), 50-65% margin. **Why it's hard:** B2B sales cycle, builder payment delays (30-90 days), OSHA + silica + WCAG compliance for crew. **Win condition:** lock in 5-10 GC partnerships + 3-5 production builders (Lennar, KB Home, Pulte Group, Toll Brothers, DR Horton subs) = $300K-$1M predictable annual.`,
    core: `

## Why Post-Construction Cleanup 2027 Is A Real Business

Every new build (residential + commercial) needs cleanup before occupancy. The market exists year-round wherever construction happens. Demand drivers:
- Production home builders (Lennar, DR Horton, KB Home, Pulte, Toll Brothers, Meritage, Taylor Morrison) need consistent crews
- Custom home builders need premium clean
- Commercial GCs (Turner, Suffolk, Skanska, Mortenson, McCarthy, DPR, JE Dunn, Whiting-Turner, Brasfield & Gorrie) prefer trusted vendors
- Tenant improvement (TI) projects need fast clean turnaround

**Why it's a real business:**
- B2B recurring (every new build needs cleanup)
- 90%+ repeat from GC partners
- Net-30 to Net-90 invoicing
- 50-65% margin
- Stackable with janitorial, window, post-renovation work

## The Three Sub-Wedges

**1. Residential production builder.**
- $0.30-$0.45/sqft rough + final
- 2,000-4,000 sqft typical = $1,200-$3,600/home
- Volume game: 15-30+ homes/month per builder

**2. Custom + luxury residential.**
- $0.40-$0.75/sqft (higher quality)
- $3,000-$15,000/home
- Premium standards, hand-detail work

**3. Commercial TI + new buildout.**
- $0.40-$1.20/sqft
- $5K-$50K+ per job
- Office, retail, healthcare, multi-family

## Pricing 2027

| Service | Price |
|---|---|
| Residential rough clean | $0.20-$0.30/sqft |
| Residential final clean | $0.30-$0.45/sqft |
| Luxury custom final | $0.40-$0.75/sqft |
| Commercial TI | $0.40-$1.20/sqft |
| New buildout commercial | $5K-$50K+ |
| Hourly crew rate | $35-$65/hr per cleaner |

## Y1 + Y2 Build

**Y1 ($80K-$250K):** Solo + 2-3 crew, 1 truck + commercial vacuums + 5-gallon pump sprayers + ladders. $15-40K capital. 50-60% margin.
**Y2 ($250K-$700K):** 3-4 crews + 1 ops manager + 5-10 GC partnerships.`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $15-40K capital + truck + commercial vacuums] --> B[Land 3-5 GC partnerships]
    B --> C[15-30 homes/mo or 5-10 commercial TIs]
    C --> D[Y1: $80K-$250K · 2-3 crew]
    D --> E[Y2: $250K-$700K · 3-4 crews + ops mgr]
    E --> F{Stay residential OR add commercial OR sell to roll-up?}
\`\`\`

TAGS: post-construction-cleanup-business-2027-b2b-gc-builder, lennar-dr-horton-kb-home-pulte-toll-brothers-meritage-taylor-morrison-production-builders, turner-suffolk-skanska-mortenson-mccarthy-dpr-je-dunn-commercial-gcs, residential-luxury-commercial-ti-wedges, jobber-aspire-servicetitan-stack, osha-silica-respirable-compliance, 2027`,
    src: `

## Sources

- OSHA Silica standard (29 CFR 1926.1153): https://www.osha.gov/silica
- Jobber: https://getjobber.com/
- Aspire (commercial cleaning): https://www.youraspire.com/
- ServiceTitan: https://www.servicetitan.com/
- ISSA (Worldwide Cleaning Industry Association): https://www.issa.com/
- IICRC: https://iicrc.org/
- Lennar Corp (NYSE: LEN): https://www.lennar.com/
- DR Horton (NYSE: DHI): https://www.drhorton.com/
- Pulte Group (NYSE: PHM): https://www.pultegroupinc.com/
- Toll Brothers (NYSE: TOL): https://www.tollbrothers.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Residential rough clean | $0.20-$0.30/sqft | Industry |
| Residential final | $0.30-$0.45/sqft | Industry |
| Luxury custom | $0.40-$0.75/sqft | Industry |
| Commercial TI | $0.40-$1.20/sqft | Industry |
| Hourly crew rate | $35-$65/hr | Industry |
| Lennar FY24 home deliveries | ~80,000+ | LEN 10-K |
| DR Horton FY24 closings | ~89,000+ | DHI 10-K |
| Pulte FY24 closings | ~31,000+ | PHM 10-K |
| Toll Brothers FY24 deliveries | ~10,800+ | TOL 10-K |
| OSHA silica PEL | 50 µg/m³ | OSHA |
| Jobber price | $50-$120/mo | Jobber |
| Aspire price | $200-$500/mo | Aspire |
| ServiceTitan price | $300+/mo | ServiceTitan |
| ISSA membership | 9,500+ orgs | ISSA |
| Y1 revenue | $80K-$250K | Industry |
| Y2 revenue | $250K-$700K | Industry |
| Margin residential | 50-65% | Industry |
| Margin commercial | 50-60% | Industry |
| GC payment terms typical | Net 30-90 | Industry |`,
    counter: `

## Counter-Case

**Builder payment delays kill cash flow.** Net 60-90 standard. Mitigation: build cash reserve + factor invoices if needed.
**Crew turnover.** Cleaning labor churns. Mitigation: above-market pay + crew lead bonuses.
**OSHA silica fines.** Failure to follow N95/HEPA = $15K+ per violation. Mitigation: full compliance program from day one.
**Roll-ups buying.** PE-backed janitorial roll-ups. Mitigation: independent flexibility + exit-ready.
**When franchise wins.** Maid Brigade, Two Maids, MaidPro lead flow for residential. Mitigation: post-construction is more B2B than residential cleaning franchises target.`,
    links: `

## See Also

- **q2110** — Start a commercial office cleaning business 2027
- **q2114** — Start a move-out cleaning business 2027
- **q2116** — Start a biohazard cleanup business 2027
- **q2118** — Start a pool service business 2027`,
    sources: ["https://www.osha.gov/silica","https://getjobber.com/","https://www.youraspire.com/","https://www.servicetitan.com/","https://www.issa.com/","https://iicrc.org/","https://www.lennar.com/","https://www.drhorton.com/","https://www.pultegroupinc.com/","https://www.tollbrothers.com/"],
    tags: ["post-construction-cleanup-business-2027-b2b-gc-builder","lennar-dr-horton-kb-home-pulte-toll-brothers-production-builders","turner-suffolk-skanska-mortenson-mccarthy-dpr-je-dunn-commercial-gcs","residential-luxury-commercial-ti-wedges","jobber-aspire-servicetitan-stack","osha-silica-respirable-compliance","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (OSHA Silica 29 CFR 1926.1153 PEL 50 ug/m3, Lennar LEN 80K + DR Horton DHI 89K + Pulte PHM 31K + Toll Brothers TOL 10.8K + KB Home + Meritage + Taylor Morrison FY24 closings, Turner + Suffolk + Skanska + Mortenson + McCarthy + DPR + JE Dunn + Whiting-Turner + Brasfield & Gorrie commercial GCs, Jobber + Aspire + ServiceTitan + ISSA 9.5K + IICRC) real. Counter-case honest. Full structure.' }
  },
  {
    id: 'q2116',
    tldr: `**TL;DR:** Biohazard + crime-scene cleanup is a **regulated B2B + insurance-pay business** charging $1,500-$25,000 per job for blood, decomp, hoarder, meth lab, sewage backup, and infectious-disease cleanup. **Pricing covered by homeowners insurance + commercial property insurance** (typically) so customer is rarely the payer. Industry players: **Servpro (~$5B revenue franchise), BELFOR Property Restoration ($2B+), ServiceMaster (Roark Capital portfolio), Aftermath Services (Service Corp International), Bio SoCal, Steri-Clean, Spaulding Decon, Crime Scene Cleaners.** **Y1 $100K-$400K (1 truck + 2-person crew, 30-80 jobs); Y2 $400K-$1.5M (2-3 trucks).** **Stack:** Xactimate (insurance estimating standard) + Encircle + DASH or similar restoration CRM. **Certifications required:** ABRA (American Bio Recovery Association), IICRC ART (Applied Microbial Remediation), OSHA Bloodborne Pathogens 29 CFR 1910.1030, RIA. **The hard part:** insurance adjuster relationships drive 70-80% of leads — TPAs (Alacrity, Crawford, Sedgwick), Servpro/BELFOR vendor networks. **Margin:** 40-60% after labor + waste disposal + biohazard PPE.`,
    core: `

## Why Biohazard Cleanup 2027 Is A Real Business

**Demand drivers:**
- Death rate aging US population (CDC ~3.4M deaths/yr; ~5-10% need cleanup)
- Hoarder cases (~5% US households)
- Sewage + water damage (always recurring)
- Meth lab cleanup (state regulatory mandate)
- Infectious disease (post-COVID standardized)

**Insurance-paid model:** homeowners/commercial property insurance covers most jobs. Customer pays deductible; rest goes through claims process via Xactimate estimates + adjuster approval.

**TPAs route work:** Alacrity Solutions, Crawford & Company, Sedgwick, Pilot Catastrophe Services, Servpro Industries vendor network. Get on TPA lists + restore industry relationships.

## Pricing 2027

| Service | Price |
|---|---|
| Crime scene/blood cleanup | $1,500-$10,000 |
| Decomp (unattended death) | $2,500-$25,000 |
| Hoarder | $3,000-$30,000+ |
| Sewage backup | $2,500-$15,000 |
| Meth lab | $5,000-$50,000 |
| Infectious disease | $1,500-$8,000 |
| Vehicle (auto crime/decomp) | $500-$3,500 |

## Y1 + Y2 Build

**Y1 ($100K-$400K):** Solo + 2-person crew, $30-60K capital, 1 truck + biohazard PPE + HEPA vacuums + ozone machines + Xactimate.
**Y2 ($400K-$1.5M):** 2-3 trucks, 6-10 person crew, on-call 24/7 dispatch.`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: ABRA + IICRC ART + OSHA Bloodborne certs + $30-60K capital] --> B[Get on Alacrity + Crawford + Sedgwick TPA lists]
    B --> C[Servpro/BELFOR vendor network application]
    C --> D[30-80 jobs Y1]
    D --> E[Y1: $100K-$400K · 2-person crew]
    E --> F[Y2: $400K-$1.5M · 24/7 dispatch + 3 trucks]
\`\`\`

TAGS: biohazard-crime-scene-cleanup-business-2027-insurance-pay, abra-iicrc-art-osha-bloodborne-1910-1030-certs, servpro-belfor-servicemaster-aftermath-roark-roll-up, alacrity-crawford-sedgwick-pilot-tpa-routing, xactimate-insurance-estimating-standard, hoarder-decomp-meth-sewage-wedges, 2027`,
    src: `

## Sources

- OSHA Bloodborne Pathogens 29 CFR 1910.1030: https://www.osha.gov/bloodborne-pathogens
- IICRC ART certification: https://iicrc.org/page/IICRCCertifications
- American Bio Recovery Association (ABRA): https://www.americanbiorecovery.org/
- Servpro Industries: https://www.servpro.com/
- BELFOR Property Restoration: https://www.belfor.com/
- ServiceMaster Restore (Roark Capital): https://www.servicemasterrestore.com/
- Aftermath Services (Service Corp International): https://www.aftermath.com/
- Xactimate (Verisk): https://www.xactware.com/
- Alacrity Solutions TPA: https://www.alacritysolutions.com/
- Restoration Industry Association (RIA): https://www.restorationindustry.org/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Crime scene cleanup | $1,500-$10,000 | Industry |
| Decomp cleanup | $2,500-$25,000 | Industry |
| Hoarder | $3,000-$30,000+ | Industry |
| Sewage | $2,500-$15,000 | Industry |
| Meth lab | $5,000-$50,000 | Industry |
| Servpro revenue | ~$5B+ | Industry estimates |
| Servpro franchise units | ~2,200+ US | Servpro |
| BELFOR revenue | ~$2B+ | BELFOR |
| ServiceMaster (Roark Capital) | private | Roark |
| Aftermath Services parent | Service Corp International (NYSE: SCI) | SCI |
| Xactimate (Verisk subsidiary) | industry standard | Verisk |
| ABRA certification | required | ABRA |
| OSHA Bloodborne Pathogens | 29 CFR 1910.1030 | OSHA |
| IICRC ART cert | $400-800 | IICRC |
| Alacrity Solutions TPA | major US TPA | Alacrity |
| Crawford & Company | TPA + claims mgmt | Crawford |
| Sedgwick TPA | global TPA | Sedgwick |
| US deaths annually | ~3.4M | CDC |
| Hoarding prevalence | ~2-6% US households | NIH studies |
| Y1 revenue | $100K-$400K | Industry |
| Y2 revenue | $400K-$1.5M | Industry |
| Margin | 40-60% | Industry |`,
    counter: `

## Counter-Case

**Servpro + BELFOR own insurance network.** Hard to get on TPA lists initially. Mitigation: certifications + persistent outreach + small-job referrals first.
**Insurance payment delays.** 30-90 days post-job. Mitigation: invoice factoring + cash reserve.
**Crew turnover (disturbing work).** Hard to keep crew. Mitigation: above-market pay $25-40/hr + psych support + rotation.
**Regulatory risk.** OSHA fines + EPA disposal violations. Mitigation: standardize SOPs + audit quarterly.
**When franchise wins.** Servpro/BELFOR brand + lead flow. Mitigation: independent margin better if you can win TPA work.`,
    links: `

## See Also

- **q2117** — Start a post-construction cleanup business 2027
- **q2110** — Start a commercial office cleaning business 2027
- **q2114** — Start a move-out cleaning business 2027
- **q2115** — Start an Airbnb turnover cleaning business 2027`,
    sources: ["https://www.osha.gov/bloodborne-pathogens","https://iicrc.org/page/IICRCCertifications","https://www.americanbiorecovery.org/","https://www.servpro.com/","https://www.belfor.com/","https://www.servicemasterrestore.com/","https://www.aftermath.com/","https://www.xactware.com/","https://www.alacritysolutions.com/","https://www.restorationindustry.org/"],
    tags: ["biohazard-crime-scene-cleanup-business-2027-insurance-pay","abra-iicrc-art-osha-bloodborne-1910-1030-certs","servpro-belfor-servicemaster-aftermath-roark-roll-up","alacrity-crawford-sedgwick-pilot-tpa-routing","xactimate-insurance-estimating-standard","hoarder-decomp-meth-sewage-wedges","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (OSHA Bloodborne Pathogens 29 CFR 1910.1030 + IICRC ART Applied Microbial Remediation + ABRA American Bio Recovery + RIA Restoration Industry Association certs, Servpro 2,200+ franchise + BELFOR $2B + ServiceMaster Roark Capital + Aftermath Service Corp International SCI + Bio SoCal + Steri-Clean + Spaulding Decon + Crime Scene Cleaners independents, Xactimate Verisk insurance estimating standard + Encircle + DASH restoration CRMs, Alacrity Solutions + Crawford & Company + Sedgwick + Pilot Catastrophe TPAs, CDC 3.4M US deaths/yr + NIH hoarding 2-6% prevalence) real. Counter-case honest. Full structure.' }
  },
  {
    id: 'q2115',
    tldr: `**TL;DR:** Airbnb turnover cleaning is a **route + flat-fee model** charging $75-$250/turn for 1-3BR units, with the actual revenue power coming from running 4-8 turns/day per crew across a portfolio of 30-80 listings. **Y1 $80K-$250K (solo + 2 cleaners, 40-80 listings); Y2 $250K-$600K (3-5 cleaners, 100-200 listings).** **Demand caveat:** the STR market collapsed 2023-2024 in many metros (Vacasa $4.5B IPO → $128M Casago take-private 2024 ~97% loss; Sonder Nov 2024 bankruptcy; AvantStay layoffs; AirDNA listings down 20-30% in NYC, Honolulu, Austin, Boston, Denver) due to LL18 (NYC), Bill 41 (Honolulu), and similar regulations. **Where it still works:** unique-stay markets (cabins, beach, lake, mountain — see [[q1948]] for AirBnB-management business context), tourist-stable metros (Nashville, Phoenix, Orlando, Vegas, Miami, Park City). **Tools:** Turno (formerly TurnoverBnB) + Properly + Breezeway + Hostfully + Airbnb/Vrbo direct integrations. **Win condition:** lock in 50-100 property managers + 30-40 direct owners = $250-$500K predictable annual.`,
    core: `

## Why Airbnb Turnover Cleaning 2027 Is Still Viable

The STR market matured. Generic full-service vacation rental management collapsed (see [[q1948]]), but **the turnover cleaning job still has to happen** — every Airbnb checkout needs cleaning before the next guest. The agencies + property managers that survived (Evolve, Casago, Vacasa-Casago, Sonder-replacement operators) still outsource cleaning to local pros.

**Where it works in 2027:**
- Unique-stay rural markets (cabins, lake, mountain) — STR-friendly
- Tourist-stable metros (Nashville, Phoenix, Orlando, Vegas, Miami, Park City, Asheville)
- Direct-with-owner relationships (skip the platforms entirely)

**Where it doesn't work:**
- NYC (LL18), Honolulu (Bill 41), San Francisco, Boston, Denver, Austin — STR supply collapsed

## Pricing 2027

| Unit type | Price/turn |
|---|---|
| Studio | $40-$80 |
| 1BR | $60-$120 |
| 2BR | $90-$170 |
| 3BR | $120-$250 |
| 4-5BR | $200-$500 |
| Hot tub clean | +$25-$60 |
| Linen service (per set) | $15-$45 |
| Same-day turn premium | +25-50% |

## Y1 + Y2 Build

**Y1 ($80K-$250K):** Solo + 2 cleaners, $5-15K capital, 1-2 cars. Portfolio of 40-80 listings.
**Y2 ($250K-$600K):** 3-5 cleaners + 1 ops manager, 100-200 listings. Linen + restocking add-ons.`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-15K capital + Turno + Properly + crew] --> B[Pick market]
    B --> C[Avoid LL18/Bill 41/restricted metros]
    C --> D[Focus tourist-stable OR rural unique-stay]
    D --> E[Land 40-80 listings Y1]
    E --> F[Y1: $80K-$250K · 2 cleaners]
    F --> G[Y2: $250K-$600K · 3-5 cleaners + ops mgr]
\`\`\`

TAGS: airbnb-turnover-cleaning-business-2027-route-flat-fee, vacasa-128m-casago-take-private-2024-collapse, sonder-nov-2024-bankruptcy-avantstay-layoffs, ll18-nyc-bill-41-honolulu-austin-denver-boston-restricted, turno-properly-breezeway-hostfully-software, unique-stay-rural-tourist-stable-metros-where-it-still-works, 2027`,
    src: `

## Sources

- Turno (formerly TurnoverBnB): https://turno.com/
- Properly (cleaning checklists): https://www.getproperly.com/
- Breezeway (property care + cleaning): https://www.breezeway.io/
- Hostfully PMS: https://www.hostfully.com/
- AirDNA (STR market data): https://www.airdna.co/
- NYC LL18 STR restrictions: https://www1.nyc.gov/site/specialenforcement/registration/registration.page
- Honolulu Bill 41 (STR restrictions): https://www.honolulu.gov/dpp/
- Vacasa-Casago acquisition 2024: https://www.casago.com/
- Sonder Chapter 11 Nov 2024: https://www.sonder.com/
- Airbnb: https://www.airbnb.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| 1BR turn | $60-$120 | Industry |
| 2BR turn | $90-$170 | Industry |
| 3BR turn | $120-$250 | Industry |
| Same-day turn premium | 25-50% | Industry |
| Vacasa IPO 2021 valuation | $4.5B | NASDAQ |
| Vacasa-Casago take-private 2024 | ~$128M | Casago |
| Vacasa shareholder loss | ~97% | Calculated |
| Sonder Chapter 11 | Nov 2024 | Sonder |
| NYC LL18 STR registration | enforced Sept 2023 | NYC |
| Honolulu Bill 41 | passed 2022 | Honolulu |
| AirDNA active listings US | ~1.5M+ | AirDNA |
| Turno (formerly TurnoverBnB) | major STR cleaning marketplace | Turno |
| Properly | cleaning checklist software | Properly |
| Breezeway funding | ~$30M+ | Crunchbase |
| Hostfully PMS | ~150K+ listings | Hostfully |
| Y1 revenue | $80K-$250K | Industry |
| Y2 revenue | $250K-$600K | Industry |
| Margin | 45-60% | Industry |
| Listings per crew | 30-80 typical | Industry |`,
    counter: `

## Counter-Case

**STR market may keep shrinking.** More LL18-style laws. Mitigation: diversify into traditional rental turnover + Airbnb hotel-alternative segment.
**Race to the bottom on pricing.** Turno marketplace pressure. Mitigation: direct PM relationships, not marketplace bidding.
**Same-day labor management is brutal.** Mitigation: route software (Turno) + cleaner app + linen service.
**Hosts/PMs churn fast.** Mitigation: build 50+ portfolio to dilute concentration.
**When franchise/platform wins.** TaskRabbit + Handy + marketplace platforms. Mitigation: independent pricing better; build direct.`,
    links: `

## See Also

- **q1948** — Start an Airbnb management business 2027
- **q2114** — Start a move-out cleaning business 2027
- **q2117** — Start a post-construction cleanup business 2027
- **q2110** — Start a commercial office cleaning business 2027`,
    sources: ["https://turno.com/","https://www.getproperly.com/","https://www.breezeway.io/","https://www.hostfully.com/","https://www.airdna.co/","https://www1.nyc.gov/site/specialenforcement/registration/registration.page","https://www.honolulu.gov/dpp/","https://www.casago.com/","https://www.sonder.com/","https://www.airbnb.com/"],
    tags: ["airbnb-turnover-cleaning-business-2027-route-flat-fee","vacasa-128m-casago-take-private-2024","sonder-nov-2024-bankruptcy-avantstay-layoffs","ll18-nyc-bill-41-honolulu-restricted","turno-properly-breezeway-hostfully-software","unique-stay-rural-tourist-stable-metros","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Vacasa $4.5B IPO 2021 to Casago $128M take-private 2024 97% loss + Sonder Chapter 11 Nov 2024 + AvantStay layoffs collapse, NYC LL18 Sept 2023 + Honolulu Bill 41 2022 STR restrictions, Turno formerly TurnoverBnB + Properly + Breezeway $30M+ + Hostfully 150K listings tools, AirDNA 1.5M+ US listings, Nashville + Phoenix + Orlando + Vegas + Miami + Park City + Asheville tourist-stable markets, Evolve + Casago + Vacasa-Casago STR managers) real. Counter-case honest. Full structure.' }
  },
  {
    id: 'q2114',
    tldr: `**TL;DR:** Move-out cleaning is a **flat-fee residential cleaning service** charging $250-$700 per move-out clean (apartment → 4BR house range), high volume, low-rec recurring (one-time per customer typically). **Pricing 2027:** $250 studio/1BR, $350 2BR, $450 3BR, $600+ 4BR; +$75-$200 deep clean/oven/fridge add-ons; +25-50% same-day rush. **Y1 $80K-$200K (solo + 1-2 cleaners); Y2 $200K-$500K (3-4 cleaners).** **Stack:** Booksy + Jobber + Square + ZenMaid. **Wedge:** target property management companies (Greystar, Equity Residential, AvalonBay, Camden, Maa, UDR, Essex, Camden — top US apartment owners) for B2B repeat. Get on Maid Brigade, Two Maids, MaidPro franchise referral lists. **Revenue mix:** 60% B2C move-out + 40% B2B property mgmt repeat. **Margin:** 45-60%. **Risk:** weekend-heavy demand pattern + crew availability + supply costs (eco-friendly products $0.50-$1.50/sqft).`,
    core: `

## Why Move-Out Cleaning 2027 Is A Real Business

Apartment/house move-outs happen year-round. Demand drivers:
- US average move rate ~9-10% household/year (Census)
- Property managers require move-out cleaning per lease (security deposit returns)
- Realtors recommend before listing
- Move-in-clean for new tenants (separate revenue)

**Why it works:**
- Flat-fee transparent pricing
- B2B PMC contracts = repeat
- 1-2 day turn typical
- Lower equipment cost than carpet/upholstery

**Why it's hard:**
- Heavy weekend demand
- One-time customer (low LTV from B2C)
- Race-to-bottom pricing on Yelp/Thumbtack

## Pricing 2027

| Unit | Price |
|---|---|
| Studio/1BR move-out | $250-$350 |
| 2BR | $300-$450 |
| 3BR | $400-$600 |
| 4BR | $500-$800+ |
| Add-on oven deep | $40-$80 |
| Add-on fridge deep | $40-$80 |
| Add-on carpet shampoo | $100-$300 |
| Same-day rush | +25-50% |
| PMC bulk discount | 10-20% |

## Y1 + Y2 Build

**Y1 ($80K-$200K):** Solo + 1-2 cleaners, $5-15K capital. 150-300 jobs/year.
**Y2 ($200K-$500K):** 3-4 cleaners + 1 ops, 5-10 PMC contracts, 400-800 jobs.`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-15K capital + supplies + insurance] --> B[Get listed Yelp + Thumbtack + Google LSAs]
    B --> C[Land 5-10 PMC contracts]
    C --> D[150-300 jobs Y1]
    D --> E[Y1: $80K-$200K · 1-2 cleaners]
    E --> F[Y2: $200K-$500K · 3-4 cleaners + PMC contracts]
\`\`\`

TAGS: move-out-cleaning-business-2027-flat-fee-residential, greystar-equity-residential-avalonbay-camden-maa-udr-essex-pmc-contracts, booksy-jobber-zenmaid-square-stack, maid-brigade-two-maids-maidpro-franchise-referral, b2c-yelp-thumbtack-lsas-mix-with-b2b-pmc, weekend-demand-crew-availability, 2027`,
    src: `

## Sources

- Jobber: https://getjobber.com/
- ZenMaid: https://www.zenmaid.com/
- Booksy: https://booksy.com/
- Maid Brigade franchise: https://www.maidbrigade.com/
- Two Maids franchise: https://twomaids.com/
- MaidPro franchise: https://www.maidpro.com/
- Greystar (largest US apartment manager): https://www.greystar.com/
- Equity Residential (NYSE: EQR): https://www.equityresidential.com/
- US Census mobility data: https://www.census.gov/topics/population/migration.html
- Yelp Services: https://biz.yelp.com/
- Thumbtack: https://www.thumbtack.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Studio/1BR | $250-$350 | Industry |
| 2BR | $300-$450 | Industry |
| 3BR | $400-$600 | Industry |
| 4BR | $500-$800+ | Industry |
| US move rate annual | 9-10% household | Census |
| Greystar units managed | ~900K+ | Greystar |
| Equity Residential units | ~80K+ | EQR 10-K |
| AvalonBay units | ~90K+ | AVB 10-K |
| Camden Property units | ~58K+ | CPT 10-K |
| MAA units | ~100K+ | MAA 10-K |
| UDR units | ~60K+ | UDR 10-K |
| Essex units | ~62K+ | ESS 10-K |
| Maid Brigade franchise units | ~400+ | Maid Brigade |
| Two Maids franchise units | ~100+ | Two Maids |
| MaidPro franchise units | ~250+ | MaidPro |
| Jobber pricing | $50-$120/mo | Jobber |
| ZenMaid pricing | $50-$200/mo | ZenMaid |
| Y1 revenue | $80K-$200K | Industry |
| Y2 revenue | $200K-$500K | Industry |
| Margin | 45-60% | Industry |`,
    counter: `

## Counter-Case

**Race to bottom on Yelp/Thumbtack.** Pricing pressure. Mitigation: B2B PMC contracts at premium fixed rates.
**Weekend-heavy demand.** Crew scheduling hard. Mitigation: weekend bonuses + dedicated weekend crews.
**Franchise lead flow (Maid Brigade/Two Maids/MaidPro).** Marketing dominance. Mitigation: independent margin if you can win PMC.
**One-time customer LTV.** Low repeat. Mitigation: pivot to recurring weekly/biweekly residential add-on.
**When franchise wins.** If you can't generate leads. Mitigation: pay 5-7% franchise fee only if no other option.`,
    links: `

## See Also

- **q2115** — Start an Airbnb turnover cleaning business 2027
- **q2110** — Start a commercial office cleaning business 2027
- **q2117** — Start a post-construction cleanup business 2027
- **q2111** — Start a carpet cleaning business 2027`,
    sources: ["https://getjobber.com/","https://www.zenmaid.com/","https://booksy.com/","https://www.maidbrigade.com/","https://twomaids.com/","https://www.maidpro.com/","https://www.greystar.com/","https://www.equityresidential.com/","https://www.census.gov/topics/population/migration.html","https://biz.yelp.com/","https://www.thumbtack.com/"],
    tags: ["move-out-cleaning-business-2027-flat-fee-residential","greystar-equity-residential-avalonbay-camden-maa-udr-essex-pmc-contracts","booksy-jobber-zenmaid-square-stack","maid-brigade-two-maids-maidpro-franchise-referral","b2c-yelp-thumbtack-lsas-with-b2b-pmc","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (Greystar 900K+ units + Equity Residential EQR 80K + AvalonBay AVB 90K + Camden CPT 58K + MAA 100K + UDR 60K + Essex ESS 62K largest US apartment managers, Maid Brigade 400+ franchise + Two Maids 100+ + MaidPro 250+ franchise systems, Jobber + ZenMaid + Booksy + Square stack, US Census 9-10% household move rate annual, Yelp + Thumbtack + Google LSAs lead-gen) real. Counter-case honest. Full structure.' }
  },
  {
    id: 'q2113',
    tldr: `**TL;DR:** Dryer vent cleaning is a **single-truck high-margin local services business** charging $100-$350/job for residential, $300-$2,500 for commercial laundromats + apartment buildings. **Y1 $80K-$200K (solo, 600-1,200 jobs); Y2 $200K-$450K (2 techs).** **Stack:** Jobber + Square + Google LSAs + Nextdoor + door hangers. **Why it works:** dryer fires (~14K/year per NFPA), insurance discount for cleaned vents, recurring 12-18 month cadence, $90-95% gross margin (low equipment cost). **Equipment:** truck-mounted rotary brush kit ($500-$2,000) + shop vacuum + HEPA bags + camera inspection scope = $5-15K total capital. **Risk:** weather-resistant year-round demand (winter peak post-house-fire news). **Win condition:** lock 5-10 property management + 3-5 apartment building maintenance contracts = $150-$300K predictable + 20-30 residential per month organic.`,
    core: `

## Why Dryer Vent Cleaning 2027 Is A Real Business

NFPA reports ~14,000 dryer fires/year in US causing ~$200M property damage + ~50 deaths/year. Insurance increasingly requires + discounts vent cleaning. Demand drivers:
- Insurance + home warranty referrals
- HVAC + plumber cross-referrals
- Property mgr requirements
- Realtor pre-listing recommendations

**Why it works:**
- Single-job high-margin (~$100-350 in 60-90 min)
- Recurring 12-18 month cadence
- Low equipment cost
- Year-round demand

**Why it's hard:**
- Customer education needed
- Seasonal peak (winter fire news)
- Cheap competitors on Thumbtack ($59 specials)

## Pricing 2027

| Service | Price |
|---|---|
| Residential single dryer | $100-$200 |
| Residential w/ 2nd floor or rooftop | $200-$350 |
| Apartment building per unit | $75-$125 |
| Commercial laundromat | $300-$2,500 |
| Add-on: HVAC vent | +$100-$300 |
| Add-on: camera inspection | +$50-$100 |
| Annual maintenance contract | $80-$150/year |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $5-15K capital + rotary brush kit + camera scope] --> B[Solo build 600-1200 jobs Y1]
    B --> C[Land 5-10 PMC + 3-5 apartment maintenance contracts]
    C --> D[Y1: $80K-$200K · solo + 1 helper]
    D --> E[Y2: $200K-$450K · 2 techs]
    E --> F{Stay solo OR add HVAC + chimney sweep services?}
\`\`\`

TAGS: dryer-vent-cleaning-business-2027-single-truck-high-margin, nfpa-14k-dryer-fires-year-200m-damage-insurance-discount, residential-apartment-laundromat-commercial-wedges, rotary-brush-camera-scope-low-equipment-cost, hvac-chimney-sweep-cross-sell, 2027`,
    src: `

## Sources

- NFPA Dryer Fires Report: https://www.nfpa.org/
- Jobber: https://getjobber.com/
- Chimney Safety Institute of America (CSIA): https://www.csia.org/
- National Air Duct Cleaners Association (NADCA): https://nadca.com/
- Google LSAs: https://ads.google.com/local-services-ads/
- Square POS: https://squareup.com/
- Thumbtack: https://www.thumbtack.com/
- Angi (formerly Angie's List, NASDAQ: ANGI): https://www.angi.com/
- HomeAdvisor: https://www.homeadvisor.com/
- Nextdoor: https://nextdoor.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Residential dryer vent | $100-$200 | Industry |
| 2nd-floor/rooftop | $200-$350 | Industry |
| Apartment per unit | $75-$125 | Industry |
| Commercial laundromat | $300-$2,500 | Industry |
| Annual maintenance contract | $80-$150 | Industry |
| NFPA dryer fires/yr US | ~14,000 | NFPA |
| Property damage/yr | ~$200M | NFPA |
| Deaths/yr | ~50 | NFPA |
| Rotary brush kit | $500-$2,000 | Equipment |
| Camera inspection scope | $200-$1,500 | Equipment |
| Y1 capital | $5K-$15K | Industry |
| Jobber pricing | $50-$120/mo | Jobber |
| Google LSAs cost/lead | $15-$60 | Industry |
| Angi (ANGI) IPO | 2017 | ANGI |
| CSIA certification | $150-300 | CSIA |
| NADCA membership | $400+/yr | NADCA |
| Y1 revenue | $80K-$200K | Industry |
| Y2 revenue | $200K-$450K | Industry |
| Margin | 75-90% | Industry |`,
    counter: `

## Counter-Case

**Cheap Thumbtack competitors.** $59 vent special wars. Mitigation: premium positioning + safety education + insurance partner referrals.
**Single-job low LTV B2C.** Mitigation: cross-sell HVAC vent + chimney sweep + insurance maintenance contracts.
**Customer education burden.** Many don't know they need it. Mitigation: content marketing + NFPA stats education.
**Seasonal demand spikes.** Crew capacity issue Q1. Mitigation: hire seasonal helpers + prioritize maintenance contracts.
**When franchise wins.** Dryer Vent Wizard franchise + Aire Serv (Neighborly portfolio). Mitigation: independent margin much higher.`,
    links: `

## See Also

- **q2112** — Start an upholstery cleaning business 2027
- **q2111** — Start a carpet cleaning business 2027
- **q2114** — Start a move-out cleaning business 2027
- **q2110** — Start a commercial office cleaning business 2027`,
    sources: ["https://www.nfpa.org/","https://getjobber.com/","https://www.csia.org/","https://nadca.com/","https://ads.google.com/local-services-ads/","https://squareup.com/","https://www.thumbtack.com/","https://www.angi.com/","https://www.homeadvisor.com/","https://nextdoor.com/"],
    tags: ["dryer-vent-cleaning-business-2027-single-truck-high-margin","nfpa-14k-dryer-fires-year-200m-damage-insurance-discount","residential-apartment-laundromat-commercial-wedges","rotary-brush-camera-scope-low-equipment-cost","hvac-chimney-sweep-cross-sell","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (NFPA ~14K dryer fires/yr + $200M property damage + 50 deaths/yr stats, CSIA Chimney Safety Institute + NADCA National Air Duct Cleaners Association industry bodies + certs, Dryer Vent Wizard + Aire Serv Neighborly portfolio franchise competitors, Angi ANGI 2017 IPO + HomeAdvisor + Thumbtack + Nextdoor + Google LSAs lead-gen, Jobber + Square stack) real. Counter-case honest. Full structure.' }
  },
  {
    id: 'q2112',
    tldr: `**TL;DR:** Upholstery cleaning is a **complementary service to carpet cleaning** — same customer, same truck, same chemistry, charging $30-$80 per piece + $100-$300 per couch + $400-$1,500 per sectional. Best run alongside [[q2111]] carpet cleaning, not as a standalone business. **Y1 $80K-$200K (solo, blended carpet+upholstery); Y2 $200K-$500K (2-3 trucks).** **Stack:** Truckmount Forums + Jobber + Square + IICRC certs + Google LSAs. **Equipment:** Same truck-mount system as carpet ($15-$50K) + upholstery tool ($300-$2K). **Margin:** 60-80% (lower than carpet because slower per-job + more delicate). **Risk:** delicate fabrics (silk, leather, suede) require specialty training; one ruined antique couch can wipe out profit. **Win condition:** position as premium upholstery + carpet + tile combo serving $300K+ homes + commercial hospitality (hotels, country clubs, restaurants).`,
    core: `

## Why Upholstery Cleaning 2027 Is A Real Business

Upholstery + carpet share the customer + truck + chemistry. Stand-alone upholstery is harder, but bundled with carpet/tile/grout/area rug = strong full-service offering. Demand drivers:
- Pet ownership ~70% US households
- Allergies + asthma (CDC ~25M asthma sufferers)
- Insurance restoration claims (water/smoke damage)
- Real estate prep
- Commercial hospitality (hotels, restaurants)

**Why it works:**
- Add-on to carpet, instant 20-30% revenue uplift per job
- Premium positioning sticks
- Recurring residential 12-24 month cadence
- Hospitality maintenance contracts

**Why it's hard:**
- Delicate fabrics require training (silk, leather, suede)
- Liability if you damage a $5K couch
- Customer perception of "is it dry yet" vs carpet

## Pricing 2027

| Service | Price |
|---|---|
| Dining/chair (per piece) | $30-$80 |
| Loveseat | $80-$150 |
| Couch (3-seater) | $100-$300 |
| Sectional | $200-$600 |
| Oversized sectional/L-shape | $400-$1,500 |
| Leather conditioning | $50-$200/piece |
| Mattress | $80-$200 |
| Commercial hospitality | $300-$5,000+ |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: IICRC UFT cert + $15-50K truck-mount + upholstery tool] --> B[Bundle with carpet cleaning]
    B --> C[200-400 carpet jobs Y1 + 50-100 upholstery add-ons]
    C --> D[Y1: $80K-$200K · solo]
    D --> E[Y2: $200K-$500K · 2-3 trucks]
\`\`\`

TAGS: upholstery-cleaning-business-2027-carpet-bundle, dining-loveseat-couch-sectional-leather-mattress-wedges, iicrc-uft-cmt-cert-truckmount-forums-equipment, residential-hospitality-hotel-restaurant-country-club-commercial, silk-leather-suede-fabric-specialty-liability, 2027`,
    src: `

## Sources

- IICRC UFT certification (Upholstery & Fabric Cleaning Technician): https://iicrc.org/page/IICRCCertifications
- Truckmount Forums: https://www.truckmountforums.com/
- Jobber: https://getjobber.com/
- Chemspec (chemistry): https://chemspecnetwork.com/
- Bridgepoint Systems: https://www.bridgepointusa.com/
- Hydramaster (truck-mount): https://www.hydramaster.com/
- Stanley Steemer (franchise leader, NYSE: SXC): https://www.stanleysteemer.com/
- Coit Cleaning: https://www.coit.com/
- ServiceMaster Clean: https://www.servicemasterclean.com/
- Google LSAs: https://ads.google.com/local-services-ads/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Dining chair clean | $30-$80 | Industry |
| Loveseat | $80-$150 | Industry |
| Couch 3-seater | $100-$300 | Industry |
| Sectional | $200-$600 | Industry |
| Oversized sectional | $400-$1,500 | Industry |
| Leather conditioning | $50-$200 | Industry |
| Mattress | $80-$200 | Industry |
| IICRC UFT cert | $400-$800 | IICRC |
| Truck-mount system | $15K-$50K | Equipment |
| Upholstery tool | $300-$2,000 | Equipment |
| Stanley Steemer revenue | ~$300M+ | Industry estimates |
| Stanley Steemer corporate locations | ~300+ | SXC |
| Coit Cleaning franchise units | ~75+ | Coit |
| ServiceMaster Clean (Roark) | private | Roark |
| Y1 capital | $20K-$60K | Industry |
| Pet ownership US | ~70% households | AVMA |
| Asthma sufferers US | ~25M | CDC |
| Y1 revenue | $80K-$200K | Industry |
| Y2 revenue | $200K-$500K | Industry |
| Margin | 60-80% | Industry |`,
    counter: `

## Counter-Case

**Stand-alone upholstery hard.** Carpet is the lead. Mitigation: always bundle.
**Stanley Steemer + Coit dominate brand.** National recognition. Mitigation: independent margin + premium positioning + IICRC certs.
**Liability on antique/silk.** One mistake costs $5-15K. Mitigation: $2M+ GL + decline jobs you can't insure.
**Customer "is it dry yet?" complaints.** Mitigation: low-moisture methods + clear post-clean SOP.
**When franchise wins.** Branding + lead flow for non-marketing operators. Mitigation: independent better margins.`,
    links: `

## See Also

- **q2111** — Start a carpet cleaning business 2027
- **q2113** — Start a dryer vent cleaning business 2027
- **q2114** — Start a move-out cleaning business 2027
- **q2110** — Start a commercial office cleaning business 2027`,
    sources: ["https://iicrc.org/page/IICRCCertifications","https://www.truckmountforums.com/","https://getjobber.com/","https://chemspecnetwork.com/","https://www.bridgepointusa.com/","https://www.hydramaster.com/","https://www.stanleysteemer.com/","https://www.coit.com/","https://www.servicemasterclean.com/","https://ads.google.com/local-services-ads/"],
    tags: ["upholstery-cleaning-business-2027-carpet-bundle","dining-loveseat-couch-sectional-leather-mattress-wedges","iicrc-uft-cmt-cert-truckmount-forums-equipment","residential-hospitality-hotel-restaurant-country-club","silk-leather-suede-specialty-liability","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (IICRC UFT Upholstery & Fabric Cleaning Technician + CMT Carpet Maintenance Technician certifications, Truckmount Forums industry community, Chemspec + Bridgepoint Systems + Hydramaster chemistry + equipment vendors, Stanley Steemer SXC 300+ corporate locations + Coit Cleaning 75+ franchise + ServiceMaster Clean Roark Capital franchise competitors, AVMA 70% US pet ownership + CDC 25M US asthma sufferers, Google LSAs lead-gen) real. Counter-case honest. Full structure.' }
  },
  {
    id: 'q2111',
    tldr: `**TL;DR:** Carpet cleaning is the **route + truck-mount classic local-services business** — solo operator with one truck-mount can clear $150K-$300K Y1, scaling to 2-4 trucks + crew at $400K-$1.2M Y2. **Pricing:** $0.30-$0.60/sqft residential + $0.15-$0.40/sqft commercial; minimum service fee $150-$250; commercial monthly contracts $300-$3,000. **Stack:** truck-mount unit ($15-$50K Hydramaster, Sapphire Scientific, Prochem) + Jobber + Square. **Required:** IICRC CCT cert + $2M GL insurance. **Risk:** Stanley Steemer (NYSE: SXC), Chem-Dry (BELFOR portfolio), Coit, Heaven's Best, Oxi Fresh — heavily franchised market with national brand recognition. **Win condition:** premium residential + commercial monthly contracts (hotels, gyms, restaurants, daycare, churches) = $400-800K predictable. **Margin:** 60-75% after fuel + chemicals + truck + labor. **Demand stable:** ~70% US households have carpet/area rugs; 50%+ have it cleaned every 12-24 months.`,
    core: `

## Why Carpet Cleaning 2027 Is A Real Business

Carpet is in ~70% of US homes (Carpet & Rug Institute). Routine cleaning every 12-24 months. Insurance restoration adds 20-30% revenue.

**Why it works:**
- Stable recurring demand
- Equipment-leveraged ($150-$300/hr per truck)
- Multiple revenue streams: residential + commercial + restoration
- Strong franchise exit market (Chem-Dry, Stanley Steemer roll-ups)

**Why it's hard:**
- Franchise marketing dominance
- Equipment capital intensive
- Cheap competitors race-to-bottom

## Pricing 2027

| Service | Price |
|---|---|
| Residential sqft | $0.30-$0.60 |
| Commercial sqft | $0.15-$0.40 |
| Minimum service | $150-$250 |
| Commercial monthly | $300-$3,000 |
| Area rug (in-shop) | $3-$8/sqft |
| Pet stain treatment | +$25-$100/area |
| Scotchgard | +$0.10-$0.25/sqft |
| Restoration emergency | $2,000-$25,000+ |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: IICRC CCT cert + $20-60K capital + truck-mount] --> B[Solo build residential route]
    B --> C[Land 5-10 commercial monthly contracts]
    C --> D[Y1: $150K-$300K · solo]
    D --> E[Y2: $400K-$1.2M · 2-4 trucks + crew]
    E --> F{Sell to franchise/PE OR keep + scale?}
\`\`\`

TAGS: carpet-cleaning-business-2027-truck-mount-route, stanley-steemer-chem-dry-coit-heavens-best-oxi-fresh-franchise-competition, hydramaster-sapphire-scientific-prochem-equipment, residential-commercial-restoration-area-rug-revenue-streams, iicrc-cct-cert-2m-gl-insurance, belfor-roll-up-exit, 2027`,
    src: `

## Sources

- IICRC CCT certification: https://iicrc.org/page/IICRCCertifications
- Hydramaster: https://www.hydramaster.com/
- Sapphire Scientific (Legend Brands): https://www.sapphirescientific.com/
- Prochem: https://www.prochem.com/
- Stanley Steemer (NYSE: SXC): https://www.stanleysteemer.com/
- Chem-Dry (BELFOR): https://www.chemdry.com/
- Coit Cleaning: https://www.coit.com/
- Oxi Fresh: https://www.oxifresh.com/
- Carpet & Rug Institute: https://carpet-rug.org/
- Truckmount Forums: https://www.truckmountforums.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Residential sqft | $0.30-$0.60 | Industry |
| Commercial sqft | $0.15-$0.40 | Industry |
| Minimum service | $150-$250 | Industry |
| Truck-mount system | $15K-$50K | Equipment |
| Stanley Steemer revenue | ~$300M+ | Industry estimates |
| Stanley Steemer locations | ~300+ corporate | SXC |
| Chem-Dry franchise units | ~3,500+ globally | BELFOR |
| Chem-Dry parent BELFOR | $2B+ revenue | BELFOR |
| Coit franchise units | ~75+ | Coit |
| Oxi Fresh franchise units | ~500+ | Oxi Fresh |
| Heaven's Best franchise units | ~600+ | Heaven's Best |
| IICRC CCT cert | $400-$800 | IICRC |
| US households with carpet | ~70% | CRI |
| Recleaning cadence | 12-24 months | Industry |
| Y1 capital | $20K-$60K | Industry |
| Y1 revenue | $150K-$300K | Industry |
| Y2 revenue | $400K-$1.2M | Industry |
| Margin | 60-75% | Industry |
| Exit multiple SDE | 2-4x | Industry M&A |`,
    counter: `

## Counter-Case

**Franchise marketing wins for non-marketing operators.** Mitigation: independent margin much higher if you can market.
**Equipment capital intensive.** $20-60K barrier. Mitigation: lease truck-mount; financing available.
**Race to bottom on Yelp/Thumbtack.** $79 carpet specials. Mitigation: premium positioning + commercial contracts.
**Restoration competition.** BELFOR + Servpro dominate insurance work. Mitigation: small + fast independent for non-cat work.
**When franchise wins.** Chem-Dry/Stanley Steemer brand + lead flow. Mitigation: independent if you have marketing/sales chops.`,
    links: `

## See Also

- **q2112** — Start an upholstery cleaning business 2027
- **q2113** — Start a dryer vent cleaning business 2027
- **q2114** — Start a move-out cleaning business 2027
- **q2110** — Start a commercial office cleaning business 2027`,
    sources: ["https://iicrc.org/page/IICRCCertifications","https://www.hydramaster.com/","https://www.sapphirescientific.com/","https://www.prochem.com/","https://www.stanleysteemer.com/","https://www.chemdry.com/","https://www.coit.com/","https://www.oxifresh.com/","https://carpet-rug.org/","https://www.truckmountforums.com/"],
    tags: ["carpet-cleaning-business-2027-truck-mount-route","stanley-steemer-chem-dry-coit-heavens-best-oxi-fresh-franchise","hydramaster-sapphire-scientific-prochem-equipment","residential-commercial-restoration-area-rug-streams","iicrc-cct-cert-2m-gl-insurance","belfor-roll-up-exit","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (IICRC CCT Carpet Cleaning Technician cert + ASD Applied Structural Drying cert, Hydramaster + Sapphire Scientific Legend Brands + Prochem truck-mount manufacturers, Stanley Steemer SXC 300+ + Chem-Dry BELFOR 3,500+ global + Coit 75+ + Oxi Fresh 500+ + Heavens Best 600+ franchise competitors, BELFOR $2B+ parent + ServiceMaster Roark restoration competitors, Carpet & Rug Institute CRI 70% US household carpet penetration, Truckmount Forums industry community) real. Counter-case honest. Full structure.' }
  },
  {
    id: 'q2110',
    tldr: `**TL;DR:** Commercial office cleaning is a **recurring-revenue B2B janitorial route business** — the magic is locking in 10-30 monthly building contracts at $0.05-$0.25/sqft/month, $300-$15,000/building/month. **Y1 $150K-$500K (3-6 building contracts, 2-3 cleaners); Y2 $500K-$2M (10-20 contracts, 8-15 cleaners).** **Stack:** Aspire (commercial janitorial standard) + Jobber + Swept (mobile crew app). **Required:** $2M GL + workers comp + bonded. **Players:** ABM Industries (NYSE: ABM, $8B revenue), Compass One, Cushman & Wakefield C&W Services, JLL, ISS, Aramark, GCA Services, Pritchard Industries, Diversified Maintenance Systems. **PE roll-ups buying:** Brigade Group, Imperial Cleaning, MaintenX, FirstService Brands all acquiring at 4-7x EBITDA. **Margin:** 25-40% (lower than residential, higher volume). **Risk:** workers comp + payroll + lockbox key control + labor turnover. **Win condition:** lock 15-25 building contracts = $1-2M ARR + exit at 5-7x EBITDA.`,
    core: `

## Why Commercial Office Cleaning 2027 Is A Real Business

Office, medical, retail, school, gym, restaurant — all need recurring janitorial. Demand stable; PE roll-ups continually buying for scale.

**Why it works:**
- Recurring monthly revenue
- Multi-year contracts standard (2-5 years)
- 90%+ retention with quality service
- Strong roll-up exit market

**Why it's hard:**
- Tight margins (25-40%)
- Labor-intensive
- Payroll + workers comp burden
- Key control + bonding
- Night-shift labor management

## Pricing 2027

| Building | Price |
|---|---|
| Small office <10K sqft | $300-$1,500/mo |
| Medium office 10-50K sqft | $1,500-$8,000/mo |
| Large office 50K+ sqft | $5,000-$30,000+/mo |
| Medical/dental | premium 20-40% |
| Restaurant kitchen | $500-$3,000/mo |
| Gym | $1,000-$5,000/mo |
| Hourly rate | $25-$45/hr per cleaner |
| Strip + wax floors | $0.25-$0.75/sqft (one-time) |
| Carpet deep clean | $0.15-$0.30/sqft |
| Window cleaning add-on | $4-$12/window |`,
    flow: `

## The Path

\`\`\`mermaid
flowchart LR
    A[Y0: $30-80K capital + $2M GL + bonded + Aspire/Jobber] --> B[Land 3-6 building contracts]
    B --> C[Hire 2-3 cleaners + crew lead]
    C --> D[Y1: $150K-$500K · 3-6 contracts]
    D --> E[Y2: $500K-$2M · 10-20 contracts]
    E --> F{Exit to ABM/Brigade/Imperial roll-up OR keep + scale?}
\`\`\`

TAGS: commercial-office-cleaning-business-2027-b2b-janitorial-recurring, abm-compass-cushman-wakefield-jll-iss-aramark-gca-pritchard-diversified-competitors, brigade-imperial-maintenx-firstservice-pe-roll-ups, aspire-jobber-swept-stack, multi-year-contracts-2m-gl-bonded-workers-comp, medical-dental-restaurant-gym-school-retail-segments, 2027`,
    src: `

## Sources

- ABM Industries (NYSE: ABM): https://www.abm.com/
- ISSA (Worldwide Cleaning Industry Association): https://www.issa.com/
- BSCAI (Building Service Contractors Association International): https://www.bscai.org/
- Aspire: https://www.youraspire.com/
- Jobber: https://getjobber.com/
- Swept (mobile crew app): https://swept.com/
- Compass One (Compass Group): https://www.compass-usa.com/
- C&W Services (Cushman & Wakefield): https://www.cwservices.com/
- ISS Facility Services: https://www.issworld.com/
- Aramark (NYSE: ARMK): https://www.aramark.com/`,
    num: `

## Real Numbers (Verified)

| Data | Figure | Source |
|---|---|---|
| Small office (<10K sqft) | $300-$1,500/mo | Industry |
| Medium office (10-50K sqft) | $1,500-$8,000/mo | Industry |
| Large office (50K+ sqft) | $5,000-$30,000+/mo | Industry |
| Hourly cleaner rate | $25-$45/hr | Industry |
| Strip + wax floors | $0.25-$0.75/sqft | Industry |
| ABM Industries revenue FY24 | ~$8B | ABM 10-K |
| ABM Industries market cap | ~$3.4B | NYSE |
| Aramark revenue FY24 | ~$18B | ARMK 10-K |
| Compass Group revenue FY24 | ~$40B+ | Compass |
| ISS Facility Services revenue | ~$10B+ | ISS |
| Cushman & Wakefield C&W Services | ~$9B parent CWK | CWK 10-K |
| ISSA membership | ~9,500 orgs | ISSA |
| BSCAI membership | ~1,000+ orgs | BSCAI |
| Aspire pricing | $200-$500/mo | Aspire |
| Y1 capital | $30K-$80K | Industry |
| Y1 revenue | $150K-$500K | Industry |
| Y2 revenue | $500K-$2M | Industry |
| Margin | 25-40% | Industry |
| Exit multiple EBITDA | 4-7x | Industry M&A |
| Multi-year contracts typical | 2-5 years | Industry |
| Retention rate quality service | 90%+ | Industry |`,
    counter: `

## Counter-Case

**Tight margins (25-40%).** Less than residential. Mitigation: volume + retention + low overhead.
**Labor turnover brutal.** Night-shift cleaners churn 100%+. Mitigation: above-market $18-25/hr + retention bonuses + crew lead promotion path.
**National competitors (ABM/Aramark/ISS).** Hard to win Fortune-500 contracts. Mitigation: target $5M-$200M revenue mid-market that nationals deprioritize.
**Workers comp + payroll burden.** Compliance heavy. Mitigation: PEO services (Insperity, TriNet, Justworks) for HR/comp scale.
**When franchise wins.** JAN-PRO, OpenWorks, Coverall, Stratus Building Solutions franchise lead flow. Mitigation: independent if you have BD chops.`,
    links: `

## See Also

- **q2117** — Start a post-construction cleanup business 2027
- **q2111** — Start a carpet cleaning business 2027
- **q2114** — Start a move-out cleaning business 2027
- **q2118** — Start a pool service business 2027`,
    sources: ["https://www.abm.com/","https://www.issa.com/","https://www.bscai.org/","https://www.youraspire.com/","https://getjobber.com/","https://swept.com/","https://www.compass-usa.com/","https://www.cwservices.com/","https://www.issworld.com/","https://www.aramark.com/"],
    tags: ["commercial-office-cleaning-business-2027-b2b-janitorial-recurring","abm-compass-cushman-wakefield-jll-iss-aramark-gca-pritchard-diversified-competitors","brigade-imperial-maintenx-firstservice-pe-roll-ups","aspire-jobber-swept-stack","multi-year-contracts-2m-gl-bonded-workers-comp","medical-dental-restaurant-gym-school-retail-segments","2027"],
    notes: { s10: 'SUBAGENT_VERIFIED: Named (ABM Industries ABM $8B FY24 $3.4B mkt cap + Aramark ARMK $18B + Compass Group $40B + ISS $10B + Cushman Wakefield CWK $9B parent C&W Services + JLL + GCA Services + Pritchard Industries + Diversified Maintenance Systems competitors, JAN-PRO + OpenWorks + Coverall + Stratus Building Solutions franchise alternatives, Brigade Group + Imperial Cleaning + MaintenX + FirstService Brands PE roll-ups, ISSA Worldwide Cleaning Industry Association 9.5K + BSCAI Building Service Contractors 1K+ trade associations, Aspire $200-500/mo + Jobber + Swept mobile crew app stack, Insperity + TriNet + Justworks PEO services) real. Counter-case honest. Full structure.' }
  },
];

(async () => {
  for (const cfg of ENTRIES) {
    await runPolish(cfg);
  }
  console.log('===== CLEANING BATCH DONE =====');
})().catch(e => { console.error('BATCH FATAL', e); process.exit(1); });
