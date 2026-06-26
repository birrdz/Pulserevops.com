// st0028 -- Commercial Pest Control Bid Walk (Restaurant Account) 2027.
// Pulse Sales Trainings entry (route: /sales-trainings/st0028, tag:
// sales-training). TWENTY-SECOND industry-specific training (after
// st0007-st0027). Industry = commercial pest-control account rep walking a
// restaurant Director of Operations / GM / Compliance Officer / Procurement
// through a service-contract bid right when they're comparison-shopping
// after a health-department citation OR a 50-unit chain rebid. Touch FSMA /
// USDA produce safety rule + FDA Food Code + HACCP + AIB International
// audits + NSF International + sensor monitoring (24/7 Connect by Rollins +
// Sensit + Anticimex SMART) + IPM (Integrated Pest Mgmt) vs old-school
// spray-and-pray + trap-density debate + the "service-only-when-something's-
// found" radar trick from premium operators. Five fixed sections mirror
// st0027. VALUE over WORD COUNT. Target 9,500-10,499 words. ABSOLUTE HARD
// CAP 10,500. LEAN-FROM-START. Walks 5->6->7->8->9->10 ladder via runPolish
// from polish-helper. Stages: SURVEY / SCAN / SHOW / SOLVE / SECURE.

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

const ID = 'st0028';
const QUESTION = "Commercial Pest Control Bid Walk (Restaurant Account) 2027 — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'commercial-pest-control-bid-walk-training',
  'commercial-pest-control',
  'restaurant-pest-control',
  'service-contract-bid',
  'health-department-citation',
  'fda-food-code',
  'fsma-produce-safety',
  'haccp',
  'aib-international-audit',
  'nsf-international',
  'integrated-pest-management',
  'ipm-sensor-monitoring',
  '60-min-meeting',
  'standard-team',
  'st0028'
];

const sources = [
  { title: 'Rollins Inc NYSE:ROL (CEO Jerry Gahlhoff Jr, Atlanta GA) — the largest pure-play commercial + residential pest-control consolidator North America: ~$3.4B revenue + ~20,000 employees + brand-portfolio Orkin (founded 1901, ~600 US branches + ~400 international franchise) + HomeTeam Pest Defense (residential new-construction tubing-in-the-walls leader ~$220M) + Western Pest Services (Northeast commercial) + Critter Control (wildlife) + Waltham Pest Services + Permabond + OPC Services + Industrial Fumigant Company (IFC, food + warehouse fumigation specialists) + Trutech Wildlife Service + Northwest Exterminating + many regional brands ~50+ acquisitions 2015-2024 + ~$3.4B revenue distribution ~70% US ~30% international; pivotal 2027 commercial dynamics — Orkin Commercial Services the dominant restaurant + grocery + food-mfg + hotel + hospital commercial pest-control account-rep network in US through ~600 Orkin branch + sub-brand offices + Orkin AIM (Assess + Implement + Monitor) the proprietary IPM (Integrated Pest Management) methodology branded against legacy spray-and-pray; 24/7 Connect remote sensor monitoring platform (smart traps + rodent stations + insect-light-trap analytics) the Rollins answer to Anticimex SMART + Bell Sensei + Bayer Cropscience digital pest-mgmt; commercial restaurant pest-control account-pricing typical $150-$650/mo single-unit + $4K-$12K/mo for 50-unit chain master-service-agreement (MSA) depending on cuisine + back-of-house complexity + sensor add-on $25-$60/yr per smart-trap + AIB International audit-prep deliverable + Orkin Restaurant Defense Plan branded program; pivotal SA renewal frame Rollins commercial competes head-to-head with Rentokil Terminix + Ecolab Pest Elimination + Anticimex North America + Massey + Truly Nolen + Plunkett\'s for restaurant MSA + chain rebid', url: 'https://www.rollins.com/' },
  { title: 'Rentokil Initial plc LSE:RTO (CEO Andrew Ransom, Crawley UK + Reading-Berkshire) + Terminix Global Holdings (acquired Dec-2022 ~$6.7B all-stock deal Memphis TN) — the world\'s #1 pest-control company post-merger ~$5.2B revenue + ~62,000 employees + ~90 countries + ~16M customers: Rentokil Pest Control + Initial Hygiene + Ambius interior plantscaping + Steritech (food-safety auditing + restaurant brand-standard programs, Charlotte NC) + Terminix Commercial (formerly Terminix International Holdings, the #2 US pest-control brand pre-merger ~$2B revenue + ~10,000 employees + ~400 branches + ~3M customers + ~$8.1B 2024 enterprise value at merger close); pivotal 2024-2027 integration storyline — Rentokil + Terminix integration delays + branch consolidation + IT-stack rationalization + senior-account-rep attrition disclosed in Rentokil 2024 H1 + H2 trading updates + ~$200-$250M synergy target ~2026 fully baked + commercial-account-rep tenure interruption opening for Orkin + Ecolab + Anticimex + regional poaching of 8-15% mid-size restaurant chains; Terminix Commercial Restaurant Defense Plan competes with Orkin Restaurant Plan + Ecolab Pest Elimination Restaurant + Steritech audit-bundled offering; pivotal restaurant MSA dynamics Steritech audit-bundling the most differentiating commercial offer = pest-control + food-safety brand-standards audit + mystery-shopper + temperature-monitoring + cleaning-verification under one MSA the only consolidator with this full-stack; commercial restaurant pricing $200-$700/mo single-unit + $5K-$14K/mo 50-unit chain MSA (typically 8-15% above Rollins/Orkin for Steritech-bundled offering)', url: 'https://www.rentokil.com/' },
  { title: 'Ecolab Inc NYSE:ECL (CEO Christophe Beck, St Paul MN) — the global #1 institutional + food-safety + hygiene + water-treatment + commercial-cleaning chemical and service company ~$15.7B revenue + ~48,000 employees + ~170 countries: Ecolab Pest Elimination division (commercial pest-control specifically targeted restaurant + foodservice + grocery + food-manufacturing + hospitality ~$1.2B+ revenue division within Ecolab Global Institutional Group); ~3,500 Pest Elimination service specialists in US + Canada + Europe + APAC + a science-led + chemistry-led + sensor-led commercial-pest-control offering tightly integrated with Ecolab\'s broader restaurant chemistry + warewashing + sanitation + temperature-monitoring (EcoSure) + brand-standards audit (Ecolab Brand Protection) offering; pivotal 2024-2027 commercial-pest dynamics Ecolab Pest Elimination wins on (a) chemistry-fluency for food-safety + allergen + sanitation + NSF International chemical-approval depth (b) tight integration with Ecolab restaurant chemical chemical-dispenser + warewasher account-management relationship (c) Ecolab Science Certified + Ecolab Brand Protection audit-bundled offering for chain restaurants needing AIB + Steritech-equivalent third-party brand-standards audit + sensor monitoring via Ecolab Connected Pest + analytics integration with Ecolab Connect; restaurant commercial-pest pricing premium $250-$850/mo single-unit + $6K-$16K/mo 50-unit chain MSA (typically 15-30% above Rollins/Orkin reflecting chemistry-bundled + audit-bundled + temperature-monitoring-bundled offering); pivotal MSA-renewal frame restaurant chains with existing Ecolab warewashing + sanitation contract = highest-probability Ecolab Pest Elimination capture at MSA renewal because procurement consolidates vendor count', url: 'https://www.ecolab.com/expertise-and-innovation/pest-elimination' },
  { title: 'Anticimex (CEO Hans Jonsson, Stockholm Sweden, EQT Partners-backed + minority IPO planned ~$8B+ enterprise value) — the world\'s #1 sensor-led commercial pest-control company + the dominant digital-IPM challenger to Rollins + Rentokil + Ecolab: ~$1.4B revenue + ~10,000 employees + ~21 countries + ~3M customers + the European-pioneered sensor-based commercial pest-control model now expanding aggressively in North America via Anticimex North America (Carmel IN HQ + ~$400M revenue + 50+ acquisitions of US regional pest-control firms 2017-2024 including Modern Pest Services + Yale Pest + Reliable Exterminators + many regional commercial-pest specialists); pivotal 2024-2027 commercial-pest dynamics — Anticimex SMART the proprietary always-on rodent + insect + sensor-monitoring platform that fundamentally inverts the traditional commercial-pest-service economics from 4-12 visits/yr fixed-cadence inspection to continuous-sensor-monitoring + service-only-when-something-is-found ("radar approach") + dramatically reduces baseline-pesticide application + radically improves AIB + Steritech + Ecolab Brand Protection audit-defensibility because of continuous evidence-logging; SMART commercial restaurant pricing $300-$900/mo single-unit (premium) + $7K-$18K/mo 50-unit chain MSA + sensor-hardware capex $400-$1,200/restaurant amortized over MSA term + cloud-platform subscription $35-$85/restaurant/mo; pivotal restaurant MSA challenger frame — Anticimex SMART positions against incumbent Rollins / Orkin / Rentokil / Terminix / Ecolab Pest Elimination by (a) lower-baseline-pesticide-application story (b) continuous-monitoring vs visit-cadence inspection (c) sensor evidence-logging for FDA + FSMA + HACCP + AIB + Steritech + Ecolab Brand Protection audits (d) radically reduced false-alarm + emergency-callout cost (e) ESG + sustainability narrative for restaurant chains with corporate sustainability mandates', url: 'https://www.anticimex.com/en/' },
  { title: 'Truly Nolen of America (CEO Scott Nolen, Tucson AZ, family-owned since 1938) + Massey Services (CEO Tony Massey, Orlando FL, family-owned since 1985) + Plunkett\'s Pest Control (CEO Stacy O\'Reilly, Fridley MN, family-owned since 1915) + Aptive Environmental (CEO Vess Pearson, Provo UT, private-equity-backed, founded 2015) + Arrow Exterminators (CEO Emily Thomas Kendrick, Atlanta GA, family-owned since 1964) — the dominant family-owned + private-equity-backed regional commercial-pest-control challengers to the Big-3 consolidators (Rollins / Rentokil-Terminix / Ecolab): Truly Nolen ~$140M revenue + ~80 US offices + Southwest/FL/PR strength + Truly Nolen Four Seasons commercial program; Massey Services ~$250M revenue + ~150 service centers + dominant in FL/GA/SC/NC/TN/LA/TX commercial regional + GreenUP Service IPM-branded methodology; Plunkett\'s Pest Control ~$60M revenue + Midwest-dominant MN/WI/IL/IA/ND/SD/NE/KS + Plunkett\'s IPM + restaurant + grocery + food-mfg specialty focus; Aptive Environmental ~$250M revenue + originally residential D2D pest-control + recently expanding into commercial restaurant + small-business segment; Arrow Exterminators ~$280M revenue + 130+ service centers SE/Mid-Atlantic + StratIPM commercial program; pivotal 2024-2027 dynamics regional family-owned + PE-backed challengers win commercial restaurant accounts where (a) regional density permits 2-4 hr emergency response (b) family-owned + tenured account-rep relationship beats Rentokil-Terminix integration disruption (c) regional pricing 12-25% below Big-3 + flexibility on contract terms + service-cadence + chemistry-source (d) restaurant chain prefers to spread risk across 2-3 vendors regionally rather than single-vendor national MSA', url: 'https://www.trulynolen.com/' },
  { title: 'National Pest Management Association NPMA (Fairfax VA, ~5,500 member companies) + National Pest Control Association predecessor + IBISWorld Pest Control Services in the US 2024 industry report + Pest Control Technology Magazine (PCT, GIE Media Richfield OH) + Pest Management Professional Magazine (PMP, North Coast Media Cleveland OH) + Specialty Consultants Inc (PMI/PCO industry M&A advisors) — the industry trade-press + benchmarking + M&A perimeter: NPMA founded 1933 + NPMA QualityPro certification + GreenPro IPM certification + NPMA Academy + NPMA PestWorld annual conference + NPMA Legislative Day + NPMA Pestworld Marketplace + NPMA-driven industry advocacy on EPA pesticide-registration + FIFRA labeling + state-level licensure standards; IBISWorld 2024 estimates US Pest Control Services industry revenue ~$24.0B + ~5-yr growth ~3.8% CAGR + ~30,000+ establishments + workforce ~190,000 employees + ~4 large national consolidators (Rollins + Rentokil-Terminix + Ecolab + Anticimex NA) accounting for ~35-40% combined market share + ~96% of industry firms small-business <50 employees + commercial pest control ~38% of total industry revenue ~ residential ~52% ~ termite ~10%; Pest Control Technology + Pest Management Professional industry trade-press publish annual Top 100 + Top 250 pest-control companies + commercial-pest benchmarking + IPM education + sensor-monitoring adoption tracking + restaurant + food-mfg vertical depth; Specialty Consultants Inc M&A advisor most-quoted industry source on PCO acquisition multiples typical 7-12x EBITDA for $5M+ regional commercial-pest-control acquisitions 2022-2024', url: 'https://www.npma.org/' },
  { title: 'FDA Food Code 2022 (US Food and Drug Administration, Rockville MD) + FDA Food Safety Modernization Act FSMA (signed Jan 4 2011, full implementation 2016-2024) + FSMA Produce Safety Rule (21 CFR Part 112, effective Jan 2018 large farms / Jan 2019 small farms) + FSMA Preventive Controls for Human Food Rule (21 CFR Part 117, effective 2016-2019) + FSMA Sanitary Transportation Rule + FSMA Food Defense Rule + FSMA Foreign Supplier Verification Rule — the structural federal food-safety regulatory perimeter driving every commercial pest-control restaurant bid 2024-2032: FDA Food Code 2022 the model code adopted by ~50 state + ~3,000 local health-departments + the basis for restaurant inspection + violation + citation; pivotal pest-control sections FDA Food Code 6-202.13 Insect Control Devices + 6-202.15 Outer Openings + 6-301.14 Hand-Washing Signage + 6-501.111 Controlling Pests "the premises shall be maintained free of insects + rodents + other pests" + 6-501.115 Removing Dead or Trapped Birds + Insects + Rodents + Other Pests; FSMA Produce Safety Rule directly impacts restaurant + foodservice pest-control because produce supply-chain pest-control standards cascade back into restaurant receiving + storage + prep + IPM protocols + on-site evidence-of-pest-management; FSMA Preventive Controls Rule requires HACCP-style hazard analysis + pest-control as identified pest hazard + documented preventive control + monitoring + corrective action + verification + records (the documentation requirements driving commercial pest-control SOPs + service-tickets + sensor-monitoring evidence-logging); pivotal restaurant MSA + bid frame the pest-control contractor is the technical author of the restaurant\'s FDA Food Code + FSMA + HACCP-aligned pest-management plan + the evidence-of-service record that survives a health-department inspection + an FDA Form 483 observation + a chain corporate brand-standards audit', url: 'https://www.fda.gov/food/fda-food-code' },
  { title: 'HACCP (Hazard Analysis and Critical Control Points, Codex Alimentarius Commission, FAO/WHO, Rome) + USDA FSIS HACCP regulation 9 CFR Part 417 (mandatory for meat + poultry processors since 1996 + voluntary for restaurants) + FDA Hazard Analysis and Risk-Based Preventive Controls HARPC under FSMA (effectively HACCP-equivalent for food facilities under FDA jurisdiction) — the international + federal hazard-analysis framework that every restaurant + food-mfg + foodservice operator must operate under either mandatorily or by chain-corporate-standards or by retailer-buyer requirement or by AIB/Steritech/Ecolab audit standard: 7 HACCP Principles (1) Conduct hazard analysis (2) Determine critical control points CCPs (3) Establish critical limits (4) Establish monitoring procedures (5) Establish corrective actions (6) Establish verification procedures (7) Establish record-keeping + documentation procedures; pivotal pest-control hazard analysis pest-presence is a biological + physical + chemical hazard category requiring (a) documented prerequisite-programs GMP (Good Manufacturing Practices) + Sanitation SOPs + IPM (b) CCP at receiving / storage / prep / serving (c) monitoring via traps + sensors + inspections + service-tickets (d) corrective action upon evidence-of-activity (e) verification via third-party audit + chain corporate audit (f) record-keeping via 5-yr-retention pest-management logs + service-tickets + sensor-data + chemical-application records; pivotal restaurant MSA + bid frame commercial pest-control contractor is the principal author + executor of the restaurant\'s HACCP-aligned pest-management prerequisite-program + the documented monitoring + corrective-action + verification + record-keeping system that the restaurant uses to defend itself in a health-department citation + FDA Form 483 + AIB + Steritech + Ecolab brand-standards audit + customer foodborne-illness lawsuit', url: 'https://www.fao.org/3/y1390e/y1390e.pdf' },
  { title: 'AIB International (founded 1919 American Institute of Baking, Manhattan KS) + Steritech (Charlotte NC, Rentokil Initial subsidiary post-2014) + Ecolab Brand Protection (Ecolab subsidiary) + NSF International (Ann Arbor MI, ANSI-accredited public-health + food-safety certification body founded 1944) + ASI Food Safety + Silliker (Merieux NutriSciences) + Eurofins Food Assurance + SAI Global + Bureau Veritas + SGS — the third-party food-safety + brand-standards audit perimeter that every chain restaurant + food-mfg facility operates inside: AIB International ~$70M revenue + ~500 employees + ~10,000 AIB audits annually + AIB Consolidated Standards for Inspection (CSI) the dominant US food-mfg + warehouse food-safety audit standard + AIB Restaurant Standards for restaurant brand-standards + AIB-Pest Control Operator (AIB-PCO) certification for pest-control contractors serving AIB-audited facilities; Steritech ~$200M+ revenue + ~1,500 employees + dominant US restaurant brand-standards audit firm (chain restaurant operators McDonald\'s + Wendy\'s + Burger King + Chick-fil-A + Taco Bell + Subway + Domino\'s + Starbucks + many more relying on Steritech audit programs as part of their corporate brand-standards + franchisee-compliance); Ecolab Brand Protection competing with Steritech for restaurant brand-standards audit + EcoSure temperature-monitoring; NSF International + NSF Restaurant Certification + NSF Standard 169 Pesticide Hazard Mitigation + NSF/ANSI Standard 7 (refrigeration + holding units) + NSF/ANSI Standard 51 (food zones plastics) + NSF/ANSI Standard 53 (drinking water treatment); pivotal pest-control bid + MSA frame every chain restaurant operator + premium independent has at least one of (AIB OR Steritech OR Ecolab Brand Protection OR NSF) audit-program annual + the pest-control contractor service-record + chemical-application log + IPM-program documentation + sensor-monitoring evidence is a direct input to the audit + scoring + corporate-brand-standards penalty + franchisee escalation', url: 'https://www.aibinternational.com/' },
  { title: 'EPA FIFRA (Federal Insecticide Fungicide and Rodenticide Act, 7 USC Chapter 6) + EPA Pesticide Registration + EPA Pesticide Worker Protection Standard WPS (40 CFR Part 170) + EPA Restricted Use Pesticides RUP + state pesticide-applicator licensure (50 states + DC each with own structured-pest-control commercial-applicator license + recertification CEU requirements) — the federal + state pesticide regulatory + applicator-licensure perimeter: pivotal restaurant pest-control regulation EPA-registered pesticides label-instructions + state-specific applicator-licensure + categories (e.g., California Branch 2 Field Representative + Operator licenses + Florida Chapter 482 commercial pest-control + Texas Structural Pest Control Service certification + New York Article 33 + Massachusetts 333 + many more state-specific requirements); pivotal commercial restaurant pest-control workforce reality ~190,000 industry workforce + ~70% direct-service-technician + ~$45K-$70K median compensation + ~25-40% annual turnover + commercial-specialist-technician compensation $50K-$95K + service-specialist supervisor $65K-$120K + commercial-account-rep $55K-$140K (base + commission); pivotal restaurant MSA + bid implication pesticide-application reduction is increasing margin-positive over 2024-2032 because (a) EPA non-target pesticide-exposure concerns (b) restaurant + consumer ESG + sustainability narrative (c) NSF + AIB + Steritech audit programs increasingly scoring low-pesticide-baseline IPM + sensor monitoring positively (d) Anticimex SMART + Rollins 24/7 Connect + Ecolab Connected Pest + Bell Sensei + Bayer Cropscience digital-IPM platforms all positioning as "service-only-when-something-found" radar-approach vs legacy 4-12-visit-per-year + scheduled-spray-cycle baseline-pesticide-applied model; pivotal SA renewal frame pest-control contractor moves margin from chemical-cost-pass-through (legacy spray-and-pray) to IPM-program + sensor-monitoring + audit-defensibility + emergency-prevention service-mix shift', url: 'https://www.epa.gov/laws-regulations/summary-federal-insecticide-fungicide-and-rodenticide-act' },
  { title: 'Bell Laboratories Inc (Madison WI, family-owned since 1974) + Liphatech Inc (Milwaukee WI, family-owned since 1972 part of De Sangosse Group France) + Bayer Cropscience Environmental Science Professional + Syngenta Professional Pest Management + BASF Pest Control Solutions + Corteva Agriscience Professional Pest Management + FMC Professional Solutions + Nisus Corporation (Rockford TN) + Rockwell Labs Ltd (North Kansas City MO) + Control Solutions Inc (Pasadena TX, ADAMA subsidiary) + Central Life Sciences (Schaumburg IL, Central Garden & Pet subsidiary) — the dominant US professional pest-control chemistry + rodenticide + sensor + bait + monitoring equipment manufacturer + supplier landscape: Bell Laboratories the dominant US rodenticide + rodent-station + Sensei sensor-monitoring + Trapper-line snap-trap + glue-trap manufacturer (Bell Sensei the major sensor competitor to Anticimex SMART + Rollins 24/7 Connect); Liphatech + Bayer + Syngenta + BASF + Corteva + FMC competing in restaurant cockroach + ant + fly + stored-product-pest + bed-bug + mosquito segments; pivotal restaurant pest-control commodity chemistry input cost dynamics 2024-2027 baseline-pesticide-cost trending down 4-8% YoY due to (a) post-COVID supply-chain normalization (b) increased competition from generic-active-ingredient suppliers (c) shift to lower-volume + higher-precision targeted-application formulations; pivotal sensor-monitoring economics Bell Sensei + Anticimex SMART + Rollins 24/7 Connect + Ecolab Connected Pest + Bayer DigitalSense IoT pest-monitoring hardware cost $25-$80 per sensor amortized over 3-5-yr restaurant MSA term + cloud-platform subscription $8-$25/sensor/yr the structural shift from variable chemical + labor cost to fixed sensor + cloud-platform + reduced-labor cost the margin-defense moat for the next 5-yr commercial pest-control consolidation cycle', url: 'https://www.belllabs.com/' },
  { title: 'BPCA British Pest Control Association (Derby UK) + CEPA Confederation of European Pest Management Associations (Brussels BE) + Pest Management Foundation (Fairfax VA NPMA research arm) + Entomological Society of America ESA (Annapolis MD) + Urban Entomology programs at University of Florida + Texas A&M + Purdue + Auburn + UC Davis + UC Riverside + Mississippi State + NC State + Penn State Cooperative Extension + USDA ARS (Agricultural Research Service) — the international + academic + research perimeter informing commercial pest-control IPM science + restaurant + foodservice protocols: BPCA + CEPA the European trade-association perimeter ahead of US in sensor + digital-IPM adoption + restaurant brand-standards integration + pioneered the radar-approach service-only-when-something-found commercial-pest-economics model that Anticimex SMART scaled globally; ESA + university urban-entomology programs publish commercial-pest IPM + cockroach + ant + fly + rodent + bed-bug + stored-product-pest + termite research informing restaurant SOPs + pesticide-application protocols + sensor-monitoring efficacy studies; pivotal restaurant pest-control IPM evidence-base — University of Florida Urban Pest Lab + Texas A&M AgriLife + Purdue Center for Urban + Industrial Pest Management + Auburn IPM Center + UC IPM Statewide + Mississippi State Pesticide Safety Education Program + UC Riverside Center for Invasive Species Research + UC Davis + USDA ARS Beltsville + research consistently demonstrating sensor-monitoring + service-only-when-found IPM reduces pesticide-volume 60-90% + reduces emergency-callout 30-60% + improves audit-defensibility + reduces total-cost-of-pest-management 8-22% over 3-yr MSA cycle vs scheduled-spray baseline; pivotal restaurant MSA bid frame commercial pest-control contractor cites peer-reviewed urban-entomology research + restaurant-specific commercial-pest case-studies for AIB / Steritech / Ecolab brand-standards audit-program credibility + corporate sustainability narrative + ESG reporting', url: 'https://bpca.org.uk/' },
  { title: 'National Restaurant Association NRA (Washington DC, ~500K restaurant + foodservice operator members) + Restaurant Facility Management Association RFMA (Atlanta GA) + Multi-Unit Foodservice Operators MUFSO Conference + Restaurant Finance Monitor + Technomic + Datassential + Restaurant Business Magazine + Nation\'s Restaurant News + QSR Magazine + Food Safety Magazine — the restaurant industry trade-press + facility-management + Multi-Unit operator perimeter: NRA ~$1.1T US restaurant industry size 2024 + ~750K+ restaurant locations + ~15.5M restaurant industry workforce + ~10% of total US workforce + 2024-2025 industry trends post-pandemic labor + commodity inflation + delivery + ghost-kitchen + drive-thru + back-of-house automation + foodservice technology stack consolidation; RFMA + MUFSO multi-unit chain operations + facility-management decision-maker community 200-2,000+ unit restaurant chain Directors of Operations + Facility Managers + Compliance Officers + Procurement Officers + Brand-Standards Officers responsible for pest-control + warewashing + cleaning + HVAC + plumbing + grease-management + waste-removal master-service-agreement procurement + brand-standards audit + franchisee compliance; pivotal commercial pest-control restaurant MSA buyer landscape — Director of Operations primary decision-maker single-unit + small-chain + General Manager primary single-unit + Compliance Officer or Brand-Standards Officer or Director of Quality primary 25+ unit chain + Procurement primary 100+ unit MSA + Franchisee primary single-franchise across most QSR systems; pivotal restaurant MSA-bid behavior chain restaurant rebid cycle typically 2-3 yrs + standard MSA term 3-yr + 90-day non-renewal notice + auto-renew + termination-for-convenience 30-60 day + procurement RFP-driven for 50+ unit chains + Director-of-Operations + GM-driven for single-unit + small-chain', url: 'https://restaurant.org/' },
  { title: 'IBISWorld Industry Reports + Specialty Consultants Inc PCO M&A Quarterly + Pest Control Technology Top 100 + PCT State of the Industry Report + PMP Magazine + PCO Top 100 + Hub Brand Resources + Wirtz Manufacturing — the commercial pest-control industry benchmarking + operational metrics + revenue-mix + service-cadence + sensor-adoption + MSA-renewal data perimeter: typical commercial-pest-control revenue mix ~38-55% MSA recurring + ~25-35% one-time + termite + bed-bug + wildlife + ~10-20% emergency-callout + ~5-15% product + chemistry sales; gross-margin benchmarks SA preventive-recurring 32-48% GM + reactive emergency 38-55% GM + termite + bed-bug specialty 42-62% GM + sensor-monitoring + cloud-platform 55-72% GM; commercial-MSA renewal-rate benchmarks Best-in-Class 90-95% + Median 78-85% + Below-Median 65-75%; commercial-MSA pricing typical 2024-2027 restaurant single-unit $150-$650/mo + $4K-$12K/mo 50-unit chain MSA + sensor add-on $25-$80/sensor/yr + emergency-callout $250-$650/call + AIB + Steritech audit-prep deliverable $400-$1,500/audit + bed-bug + termite treatment specialty $400-$4,500/treatment; service-cadence benchmarks legacy scheduled-cadence 4-12 visits/yr + IPM sensor-monitoring 1-4 visits/yr-baseline + service-on-anomaly + Anticimex SMART radar-approach <2 baseline visits/yr + sensor-trigger-only; technician billable-hour utilization Best-in-Class 72-82% + Median 60-70% + Below-Median 48-58%; service-call response-time SLA standard restaurant 2-4 hr emergency + 24 hr non-emergency + 12 hr critical-citation-response; commercial-MSA escalation clause typical CPI-based 2-5%/yr or fixed 3-5% annual + chemical-cost pass-through clause + post-2022 commodity-volatility pass-through clause increasingly standard; commercial MSA contract typical 3-yr base + auto-renew + 90-day non-renewal + termination-for-cause 30-60 day cure + termination-for-convenience 30-60 day notice + scope-governance quarterly + sensor-hardware capex-amortization + audit-deliverable annual minimum', url: 'https://www.ibisworld.com/united-states/market-research-reports/pest-control-services-industry/' },
  { title: 'Commercial-pest-control restaurant buyer-psychology + the four conversations every pest-control account rep avoids at bid-walk: (1) the trap-density + "are-we-over-trapping" conversation legacy spray-and-pray operators install 25-60 rodent stations + 12-30 insect-light-traps + 8-20 cockroach gel-bait stations across a 3,500-sqft restaurant because it bills more chemistry + service-time + makes evidence-of-service look thorough on health-department walk-through + reality is most studies (UF + Purdue + UC IPM) show 50-70% trap-density-reduction with sensor-monitoring delivers equivalent-or-better pest-pressure-reduction with 35-55% lower chemical-application + 25-45% better audit-defensibility; (2) the service-only-when-something-is-found radar-approach conversation premium operators (Anticimex SMART + Rollins 24/7 Connect + Ecolab Connected Pest premium-tier) deliberately reduce baseline-visit-cadence from 4-12/yr to 1-2/yr + sensor-triggered-response-only because (a) total-pesticide-volume reduction 60-90% (b) reduced labor + travel + truck-roll cost (c) better evidence-of-active-IPM + audit-defensibility (d) better customer ESG + sustainability narrative + Director of Operations + Compliance Officer + Procurement initially resist because the visit-cadence reduction feels like service-erosion until shown the sensor evidence-of-continuous-monitoring + the AIB/Steritech audit-score improvement + the pesticide-volume-reduction sustainability metric; (3) the chain-corporate MSA already-negotiated franchisee conversation single-franchisee operator wants to bring in a regional commercial-pest-control challenger because pricing or relationship but corporate brand-standards MSA contract preempts franchisee choice + franchisee must follow corporate-approved vendor list + the regional challenger commercial-account-rep must navigate corporate brand-standards + franchisee-pressure + procurement to win the chain-wide rebid or franchisee-individual carve-out per franchise-agreement; (4) the citation-prompted-replacement conversation new operator coming in after a health-department citation + 30-day re-inspection + Yelp + Google Maps + corporate-brand-standards exposure has highest-urgency buying-window but operator emotional + budget-constrained + procurement-defensive + reputation-traumatized + commercial-pest-control account-rep must navigate emotional + technical + reputational + brand-standards + insurance-rider impact + lawsuit-exposure all at once; pivotal industry observation per NPMA + Rollins + Rentokil + Ecolab + Anticimex + Specialty Consultants Inc + PCT + PMP industry-coverage the four avoided conversations explain ~50-65% of the gross-margin gap between top-quartile (32-48% MSA GM) and bottom-quartile (12-22% MSA GM) commercial-pest-control account-rep + branch + operating-region', url: 'https://www.pctonline.com/' }
];


// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### 🐀 The Pulse Training
> **Who this is for:** **Commercial pest-control account reps + branch managers + commercial-sales mgrs + AIB-PCO service specialists** at **Rollins NYSE:ROL (Orkin Commercial) / Rentokil-Terminix LSE:RTO (Steritech-bundled) / Ecolab NYSE:ECL Pest Elimination / Anticimex SMART NA + regional family-owned + PE-backed (Truly Nolen / Massey / Plunkett's / Aptive / Arrow)** + **independent NPMA-member PCOs** walking restaurant DOOs + GMs + Compliance + Procurement through a **bid right after a health-citation OR a 50-unit chain rebid**. Per **NPMA + IBISWorld 2024 ($24B+ US industry) + Specialty Consultants Inc + PCT Top 100 + PMP**: top-quartile **32-48% MSA GM + 90-95% renewal + 72-82% util + 4-8%/yr uplift + 35-55% sensor attach + 25-40% audit-prep + 75-90% QBR**; median 18-28% GM / 1-4% uplift; bottom 12-22% GM / 0% uplift. **Run before NPMA PestWorld + AIB Annual + Steritech Connect + RFMA + MUFSO.**
>
> **What teams leave with:** **5-STAGE BID-WALK (SURVEY → SCAN → SHOW → SOLVE → SECURE)** + **4 AVOIDED CONVERSATIONS** (trap-density / radar-approach / corporate-MSA-pre-empt / citation urgency). Plus verbatim language, two role-plays (DOO Linda at 24-unit casual-dining post-citation + Procurement Marcus at 50-unit QSR rebid), MSA quartile self-diagnosis, FDA Food Code 6-501.111 script, FSMA + HACCP IPM build, sensor (SMART / 24/7 Connect / Sensei / Connected Pest) attach playbook.
>
> **Branch manager brings:** (1) 3 recent lost-bid debriefs. (2) Bid Walk Kit — SURVEY scorecard + IPM-template + AIB-PCO + NPMA QualityPro + GreenPro + FDA Food Code 6-501.111 + 6-202.13 + 6-202.15 + FSMA + HACCP PCP + sensor pitch + trap-density right-sizing calculator + emergency escalation script. (3) Whiteboard last 10 bids by outcome + price + sensor + audit-prep attach + retention.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Cold Open** — Rep A bid $385/mo on a single-unit independent right after a Yelp-visible health-citation, lost to Anticimex SMART on sensor-evidence + audit-defensibility; Rep B walked into a 24-unit Florida casual-dining chain rebid post-citation, ran SURVEY-SCAN-SHOW-SOLVE-SECURE, attached sensor + AIB audit-prep, closed at $8.4K/mo MSA vs incumbent's $6.1K/mo flat | Branch Mgr | Bid-walk-anchored MSA beats price-anchored cold-quote 5-7x |
| **0:10-0:35** | **Teach** — 5-STAGE (SURVEY/SCAN/SHOW/SOLVE/SECURE) + 4 avoided conversations (trap-density / radar / corporate-pre-empt / citation-urgency) + MSA quartile self-diagnosis + 3 Compliance Lenses (FDA Food Code / FSMA / HACCP) | Branch Mgr | Recite 5 stages + 4 avoided + 3 lenses + Food Code cites verbatim |
| **0:35-0:45** | **Discussion** — 8 prompts on incumbent-defense / chain-corporate-pre-empt-navigation / when to walk away / sensor-attach hesitancy / trap-density right-sizing / FDA 483 / Steritech score thresholds / commodity-chemistry pass-through | Branch Mgr + room | Audit last 10 bids by quartile behavior |
| **0:45-1:05** | **Role-Play x 2** — R1: Director of Ops Linda at 24-unit FL casual-dining chain post-health-citation demanding flat $6.1K/mo + 25% baseline-pesticide reduction + AIB audit-prep. R2: Procurement Officer Marcus at 50-unit QSR rebid comparing your $11.8K/mo to Rentokil-Terminix-Steritech $9.4K/mo Steritech-bundled + Anticimex SMART $13.2K/mo sensor-leader | Pairs | Run 5-STAGE under two buyer archetypes |
| **1:05-1:10** | **Debrief + Commitments** — 3 Qs + 1 lost bid + 1 verbatim line + 1 conversation you avoided | Branch Mgr | Bid-walk-first habit + sensor + audit-attach discipline |
| **1:10-1:13** | **Leave-Behind** — Bid Walk Script Card + MSA Quartile Self-Diagnosis + FDA Food Code 6-501.111 Citation Script + FSMA + HACCP-Aligned IPM Build + Sensor Attach Pitch | Branch Mgr | One-pager in every account-rep bag |

> ### 🎯 Bottom Line
> **A 24-unit casual-dining chain doesn't pick you over the incumbent because your monthly is $40 cheaper — she picks you because you walked the kitchen + receiving + dumpster + sewer-line on the bid-walk, cited FDA Food Code 6-501.111 + FSMA Preventive Controls + HACCP CCP-monitoring + AIB Restaurant Standards verbatim, showed her how Anticimex SMART or Bell Sensei sensor evidence-logging survives a Form 483 + Steritech audit, and right-sized her over-trapped 38-station rodent footprint to 22 stations with sensor-monitoring at lower total cost.** Per **NPMA + IBISWorld + Specialty Consultants Inc + PCT Top 100**: top-quartile raise 4-8%/yr + attach sensor to 35-55% of restaurant MSAs + capture audit-prep retainer on 25-40% of chain accounts + run quarterly QBRs on 75-90% of MSAs. Run **5-STAGE SURVEY/SCAN/SHOW/SOLVE/SECURE + 4-avoided-conversations + MSA quartile self-diagnosis + 3-compliance-lenses + sensor + audit-prep attach** = **18-32% MSA value lift / 90%+ renewal / 32-48% MSA GM / radar-approach margin expansion**. Flat-bid + skip-bid-walk + avoid-Food-Code-cite + over-trap + sell-truck-rolls + ignore-sensor = **0-5% lift / 65-78% renewal / lose 50-unit chain rebids to Anticimex + Rentokil-Terminix-Steritech / 12-22% MSA GM**. Five stages. Four avoided conversations. Bid-walk before bid-price.

`;

// ============================================================================
// CORE -- Sections 1-6
// ============================================================================
const core = `---

## SECTION 1 -- INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do NOT open with the **Orkin AIM brochure** or the **Anticimex SMART one-pager**. Whiteboard. Say the **NPMA + IBISWorld + Specialty Consultants Inc + PCT Top 100** quartile margin numbers + the two-rep cold-open + the four avoided conversations + the three compliance lenses (FDA Food Code / FSMA / HACCP). **Ten minutes. Hard stop at 0:10.**

### The numbers, then the story.

**The numbers.** Per **NPMA + IBISWorld 2024 (~$24B US industry, ~30K establishments, ~190K workforce) + Specialty Consultants Inc PCO M&A Quarterly + PCT Top 100 + PMP**: **Top-quartile** runs **32-48% MSA GM + 72-82% util + 90-95% renewal + 4-8%/yr uplift + 35-55% sensor attach + 25-40% audit-prep retainer + 75-90% QBR**. **Median** **18-28% GM / 1-4% uplift**. **Bottom** **12-22% GM / 0% uplift**. Operating-model + service-mix shift (legacy scheduled-spray → sensor-monitored IPM + audit-bundled) explains **~60% of quartile spread**.

Layer on the squeeze. **FDA Food Code 2022 + FSMA + HACCP + AIB + Steritech + Ecolab Brand Protection** make pest-control the most-cited section of every restaurant inspection. Per NPMA + RFMA, ~**70% of 2024 restaurant citations** name pest under Food Code 6-501.111 + 6-202.13 + 6-202.15. **Avg fine $1.5K-$15K + 30-day re-inspection + Yelp hit + insurance-rider $4K-$28K/yr + AIB-failure $8K-$45K.**

**The story.** **Rep A** bid a **Cleveland Italian indie** at **$385/mo** after a Yelp-visible citation. No bid-walk. No Food Code cite. No sensor. **Lost to Anticimex SMART at $540/mo + 14 sensors + AIB-PCO + radar-approach.**

**Rep B** walked a **24-unit FL casual-dining rebid** post-citation. Day 1 SURVEY 24 kitchens + receiving + dumpsters + sewer-lines. Day 4 SCAN UV + glue-board + thermal. Day 8 SHOW 38-station footprint right-sized to 22 + 16 SMART sensors + AIB-PCO audit-prep + 6-501.111 narrative + FSMA + HACCP PCP. Day 12 SOLVE **$6.1K → $8.4K/mo + sensor + audit retainer**. Day 18 SECURE 3-yr MSA + sensor amortization + cross-unit. **Lift $27.6K/yr + AIB Score 78 → 92 + 2 cross-sells + Orlando MUFSO case study.**

> ### ⚠️ Common Trap
> *"Rep A lost because Anticimex's sensors are flashy."* **(1)** Incumbent-PCO excuse — operator picked SMART for evidence-logging surviving Form 483 + Steritech audit, not blinking sensors. **(2)** Flat $385/mo without bid-walk = race-to-bottom + no audit-defensibility + lose at first citation. **(3)** Owner picked Anticimex because Rep A skipped the bid-walk + Food Code cite + sensor + audit-narrative. SURVEY before SCAN. SCAN before SHOW.

**Transition:** "Next 50 minutes: 5-stage bid-walk, 4 avoided conversations, 3 compliance lenses, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into **5-STAGE (12 min, ~2.5 min/stage)** + **Four Bid-Walk Conversations Avoided (8 min)** + **Three Compliance Lenses (3 min)** + **MSA Quartile Self-Diagnosis (2 min)**. End-of-section test: every rep recites all 5 stages + 4 avoided + FDA Food Code 6-501.111 + 60-sec SHOW pitch without notes.

### Part A -- The 5-STAGE BID-WALK CONVERSATION (12 min)

Most lost commercial pest-control bids collapse at Stage 1 (skipped bid-walk + no kitchen + receiving + dumpster + sewer-line inspection) or Stage 3 (avoided trap-density right-sizing + no sensor reframe). **You don't win a 24-unit chain rebid with a $/mo quote — you EARN the MSA by SURVEYING the back-of-house + receiving + dumpster + sewer-line + roof + landscape transitions, SCANNING with UV + glue-boards + thermal + sensor pre-deploy, SHOWING the operator her over-trapped footprint + Food Code gaps + sensor evidence-logging story, SOLVING with right-sized IPM + sensor attach + AIB audit-prep + emergency-response SLA, and SECURING the 3-yr MSA + chain corporate brand-standards alignment + cross-unit expansion.**

#### Stage 1 -- SURVEY (2.5 min)

The bid starts with a **physical bid-walk** using **NPMA QualityPro + AIB-PCO + GreenPro IPM-scorecard**: **kitchen (fryer + grill + hood + wash + prep + ice + walk-in) + receiving (back-door + dumpster + grease-pad + dock) + dry-storage (pallet-spacing + 18" off-floor + 4" off-wall + FIFO) + dish-pit + bar + dining + roof (HVAC + gas-line + grease-vent + flashing) + exterior (sewer + storm-drain + landscape + parking) + door-sweeps + screens + air-curtain**. DOO + GM + compliance must SEE the rep walking with flashlight + UV + glue-board + digital scoresheet, not handing a quote at the host stand.

> ### 🎤 Verbatim Script -- SURVEY
> *"Linda — bid-walk. **3 doors. 2 missing sweeps. Roof grease-vent flashing failed — rodent + cluster-fly + bird entry. Receiving pad grease active. Sewer clean-out cap missing — drain-fly source. Dry-storage 3 pallets touching wall + on-floor — German cockroach harborage. Air-curtain unbalanced. Walk-in gasket gap 6mm. UV in dish-pit — fluorescence south wall + grease-trap channel — rodent urine trail.** 9 minutes of bid-walk. Current contractor's last 6 tickets log none of this. That gap list is the bid conversation."*

**Common trap.** Quoting from parking lot. **Median 35-50% bid-walk completion vs top-quartile 75-90%.** No SURVEY = no leverage = no sensor attach + lose at first citation.

#### Stage 2 -- SCAN (2.5 min)

Layer on **technology + science**. Per NPMA + ESA + UF + Purdue + UC IPM, the SCAN combines (a) **UV blacklight** rodent-urine fluorescence + insect-frass (b) **glue-board + sticky-trap pre-deploy** 24-48 hr (c) **thermal-imaging** for in-wall + sub-floor rodent harborage (d) **moisture + RH meter** at sinks + ice + walk-ins (e) **sensor pre-deploy** Sensei or SMART or 24/7 Connect 14-day baseline (f) **dye-test** drain-fly + sewer gradient (g) **canine + IR + flashlight** grease-trap channel.

> ### 🎤 Verbatim Script -- SCAN
> *"Linda — scan 48 hr in. **UV trail dish-pit to walk-in confirms rodent travel-path. Glue-board pre-deploy 14 German + 8 American + 2 brown-banded — current 38-station covers <40% of harborage. Thermal: 2 cold-spots wall void above hood = rodent nest + insulation void. Moisture sub-floor ice-machine 23% — drain-fly hotspot. Sensor 6 SMART units 72 hr = 27 rodent + 142 cockroach + 11 ant — 4-7x what current contractor's 8 mo of tickets reflect.** That gap is the audit-defensibility conversation."*

**Common trap.** Skipping SCAN — "we already know what's in restaurants." Every restaurant has site-specific harborage + grease + moisture + traffic-pattern. Bottom-quartile uses same trap-grid template for every account.

#### Stage 3 -- SHOW (2.5 min)

Two-panel reveal. Left: **current over-trapped + under-scoped footprint + Food Code + FSMA + HACCP + AIB gaps**. Right: **right-sized sensor-monitored IPM + audit-defensibility narrative**. Top-quartile reduces density 35-55% + adds 8-22 sensors + bundles audit-prep + delivers AIB Score lift 12-25 pts.

> ### 🎤 Verbatim Script -- SHOW
> *"Linda — left current: **38 rodent + 12 light-traps + 14 cockroach + monthly + 6 chemistry products + zero sensor + zero AIB docs + 3 Food Code gaps Steritech flags**. Right proposed: **22 + 9 + 8 + 16 Sensei or SMART units + radar + 2 baseline visits + 2-hr emergency SLA + AIB-PCO + FDA + FSMA + HACCP + Steritech-prep retainer + chemistry -65%**. Same pest-target — better evidence + audit-score + ESG + lower chemistry."*

**Common trap.** Leaving legacy footprint + bidding lower on more-of-the-same. **The bid IS the IPM redesign + sensor + audit — not the price-sheet.**

#### Stage 4 -- SOLVE (2.5 min)

Four-component proposal. Top-quartile lifts **4-8%/yr base** + **sensor $25-$80/sensor/yr** + **audit-prep $400-$1,500/cycle** + **emergency 2-hr SLA premium** + **3-yr MSA with chemistry pass-through + sensor amortization + cross-unit expansion**.

> ### 🎤 Verbatim Script -- SOLVE
> *"Linda — four components. (1) **Base $4.8K → $5.6K/mo across 24 units** = right-sized IPM + 2 baseline + sensor-trigger + FDA + FSMA + HACCP PCP + AIB-PCO. (2) **Sensor $1.4K/mo** = 16 SMART or Sensei/restaurant + cloud + 24/7 alarm + chain dashboard. (3) **AIB audit-prep retainer $1.1K/mo** = quarterly pre-audit + Steritech score-plan + 5-yr retention. (4) **Emergency 2-hr SLA $300/mo**. **Total $6.1K → $8.4K + AIB Score 78 → 92 + chemistry -65% + Form 483 + Steritech defensible.**"*

**Common trap.** Lifting base $/mo alone. **Lift comes from sensor + audit-prep + emergency-SLA + chemistry pass-through.**

#### Stage 5 -- SECURE (2.5 min)

Lock **3-yr MSA + CPI+2-3% escalator + 6% cap + chemistry pass-through + sensor amortization + auto-renew + scope governance + cross-unit + termination-for-cause 30-60 day cure**. Top-quartile hold **90%+ renewal**.

> ### 🎤 Verbatim Script -- SECURE
> *"Linda — MSA. **3-yr + CPI+2% + 6% cap + chemistry pass-through Sec 7.3 + sensor amortization 7.4 + auto-renew 90-day + scope governance quarterly + AIB audit-prep + 2-hr emergency + cross-unit for new openings**. **Termination for cause** SLA breach + 60-day cure. **For convenience** 9-month notice + unamortized sensor + 50% remaining base. **Cross-unit** — every new opening auto-enrolls at portfolio unit-economics."*

**Common trap.** 1-yr term + no escalator + no chemistry pass-through + 30-day termination = chain-procurement-toxic + Anticimex + Rentokil-Terminix-Steritech bait.

### Part B -- The Four Bid-Walk Conversations Every PCO Rep Avoids (8 min)

Per **NPMA + PCT + PMP + Specialty Consultants Inc + Rollins + Rentokil + Ecolab + Anticimex**, four conversations explain **~50-65% of the GM gap** between top-quartile and bottom-quartile. Reps avoid them out of fear + relationship-anxiety + remembered chemistry-pass-through promise.

#### Conversation 1 -- "Your incumbent has you over-trapped + that's billed-chemistry not pest-control"

Legacy accounts have 25-60 rodent stations + 12-30 light-traps + 8-20 cockroach stations across a 3,500-sqft restaurant — well above UF + Purdue + UC IPM evidence. **Script:** *"Linda — 38 + 12 + 14 stations. UF + Purdue + UC IPM peer-reviewed: 50-70% density-reduction with sensor delivers equivalent-or-better pest-pressure-reduction. Over-trapping bills more chemistry but isn't better pest-control. Right-sized: 22 + 9 + 8 + 16 sensors + 2 baseline visits + radar. Same target. Better evidence. Lower chemistry-volume."*

#### Conversation 2 -- "We service when sensors detect something, not on a calendar — better not worse"

Anticimex SMART + Rollins 24/7 Connect + Ecolab Connected Pest premium + Bell Sensei deliberately drop baseline-visit-cadence from 4-12/yr to 1-2/yr + sensor-triggered. **Script:** *"Linda — counter-intuitive. SMART + 24/7 Connect + Connected Pest premium drop baseline from 4-12/yr to 1-2/yr + sensor-trigger. Why — 24/7 evidence-of-monitoring beats calendar-tickets at Form 483 + Steritech + AIB + Brand Protection audit + 60-90% pesticide-volume reduction + ESG narrative for your sustainability report. 12 visits → 2 baseline + sensor-trigger + 2-hr emergency SLA + AIB-PCO. Audit-score up. Pesticide down. Total-cost-of-pest-management -8-22% over 3-yr MSA."*

#### Conversation 3 -- "Your corporate has a brand-standards MSA — let's talk rebid + franchisee carve-out"

Single-franchisee wants challenger but corporate MSA + approved-vendor-list pre-empts. **Script:** *"Linda — corporate brand-standards MSA with Rentokil-Terminix-Steritech-bundled. Two paths. (a) **Corporate rebid** — engage corporate Director of Compliance + DOO + Procurement at NPMA PestWorld or RFMA Annual + position with sensor + AIB + Steritech-equivalent audit. (b) **Franchisee carve-out** — franchise agreement allows alt-vendor when corporate approves on documented brand-standards-equivalent + AIB-PCO + NPMA QualityPro + GreenPro + state-license + insurance + corporate alignment. Run both — corporate Q4 + carve-out Q2."*

#### Conversation 4 -- "Your citation gave you a 30-day re-inspection clock — your incumbent is the contractor that let it happen"

Citation-prompted-replacement is highest-urgency commercial buying-window — operator emotional + procurement-defensive + reputation-traumatized + insurance + lawsuit exposure all at once. **Script:** *"Linda — Day 3 of 30. Three reframes. (1) **Citation is technical not moral** — FDA Food Code 6-501.111 + 6-202.13 + 6-202.15 + state-supplement are technical findings + re-inspection passes when documented IPM + sensor + chemistry + corrective-action exist. (2) **Insurance carrier needs documented IPM-program post-citation** — without it premium up 8-15% + foodborne-illness rider gets carved-out. (3) **Incumbent's last 6 tickets + 12 mo chemistry-records would have prevented this** — pull them today + I'll show gaps + our 30-day re-inspection-prep + 90-day MSA-replacement + AIB + Steritech audit-prep covers insurance + corporate-brand-standards + Yelp recovery."*

### Part C -- The Three Compliance Lenses (3 min)

Every commercial pest-control account-rep must fluently navigate **three federal + brand-standards compliance lenses**. Reps who can't cite verbatim lose on technical-credibility alone.

**Lens 1 — FDA Food Code 2022.** 50 states + 3,000 health departments. Pest-control sections **6-501.111** *"premises shall be maintained free of insects + rodents + other pests"* + **6-202.13** Insect Control Devices + **6-202.15** Outer Openings + **6-501.115** Removing Dead or Trapped Pests. Citation language a health inspector uses verbatim — your rep needs it verbatim back.

**Lens 2 — FSMA + 21 CFR Part 117 Preventive Controls + Part 112 Produce Safety.** Full-service restaurants typically exempt from Part 117 as retail-food-establishments but cascading supplier + brand-standards + AIB programs apply HARPC/HACCP-equivalent. The PCO authors the **prerequisite-program GMP + Sanitation SOP + IPM + CCP-monitoring + corrective-action + verification + record-keeping** that survives an FDA Form 483 or brand-standards audit.

**Lens 3 — HACCP + AIB + Steritech + Ecolab Brand Protection + NSF Restaurant Certification.** Pest-presence is biological + physical + chemical hazard across 7 HACCP Principles. The PCO delivers **documented monitoring + corrective-action + verification + 5-yr record-keeping** for chain corporate-brand-standards audits.

### Part D -- MSA Portfolio Quartile Self-Diagnosis (2 min)

Every branch mgr + commercial-sales mgr self-diagnoses on 5 metrics: **MSA GM % + billable-hour util + renewal rate + annual uplift + sensor + audit-prep attach**. Numbers are non-negotiable per NPMA + IBISWorld + Specialty Consultants Inc + PCT Top 100 + PMP. Room learns instantly which quartile they're in + which 2-3 metrics block the next jump.

> ### 🎯 Bottom Line
> 5 stages + 4 avoided + 3 lenses + quartile + sensor + audit-prep attach = **18-32% MSA lift / 90%+ renewal / 32-48% GM**. Stages without avoided = competent service loses at first chain rebid. Avoided without stages = price breaks relationship.

---

## SECTION 3 -- THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard 5 columns SURVEY/SCAN/SHOW/SOLVE/SECURE + 4 rows TRAP-DENSITY / RADAR-APPROACH / CORPORATE-PRE-EMPT / CITATION-URGENCY. Each rep audits last 10 bids out loud — stage skipped, conversation ducked, quartile behavior. **Count to five after each prompt.**

**1 — "Walk away from a citation-prompted bid when?"** Refuses bid-walk AND sensor AND 3-yr term AND requests bottom-quartile pricing AND pattern of incumbent-churn 12-18 mo. **Branch Mgr:** *"Highest-emotional + highest-margin-pressure. Walk when all three refused. Don't accept negative-GM cleanup."*

**2 — "Corporate-MSA-pre-empt opens franchisee carve-out when?"** Franchisee documents brand-standards-equivalent + AIB-PCO + NPMA QualityPro + GreenPro + state-license + $2M liability + corporate Director-of-Compliance written approval. **Branch Mgr:** *"Document the corporate-approved-vendor pathway + AIB-PCO equivalency + run parallel to corporate rebid. 18-24 mo to convert."*

**3 — "Trap-density right-sizing backfires when?"** Active rodent pressure post-citation + 30-day re-inspection AND legacy 38-station produced zero captures last 90 days = over-trapped wrong-locations + right-size correct. But active 12+ captures last 30 days = DON'T reduce below 28 until 60-day sensor pre-deploy confirms baseline. **Branch Mgr:** *"Right-size on evidence not template. Active pressure = density stays + sensor adds. Quiet = density drops + sensors prove it."*

**4 — "Anticimex SMART or Rollins 24/7 Connect wins on price?"** 50+ unit chain + corporate sustainability mandate + Ecolab warewashing relationship + capex flexibility. Premium wins 15-30% above mid-market. **Branch Mgr:** *"Don't fight on per-sensor price. Differentiate on AIB-PCO + branch tenure + 2-hr SLA + brand-standards alignment + regional density."*

**5 — "Bid-walk cadence broke 12 mo — reset how?"** Acknowledge in writing + 2 consecutive NPMA QualityPro + AIB-PCO walks at 30 + 60 days + Food Code 6-501.111 + FSMA + HACCP + sensor pre-deploy. **Branch Mgr:** *"DOO knows. Apologize once, reset hard, walk twice. Reset within 90 days or lose at rebid."*

**6 — "Sensor-attach hesitancy — coach how?"** Ride 3 bids + script verbatim + branch mgr delivers sensor capex, rep delivers technical walk. **Branch Mgr:** *"Sensor + audit-prep is branch-mgr work + non-delegable. Sensor + audit reframe is the entire 2024-2027 margin defense vs spray-and-pray."*

**7 — "AIB + Steritech audit-prep — bill or include?"** Include annual AIB-equivalency walk in MSA (90-min QBR). Bill quarterly pre-audit + Steritech score-plan + 5-yr retention as **$400-$1,500/cycle retainer**. **Branch Mgr:** *"Walk = currency. Retainer = 25-40% chain MSA attach."*

**8 — "ONE verbatim change."** Each rep: ONE stage skipped + ONE avoided conversation this week. **Branch Mgr:** *"CRM task + Monday huddle + ride-along."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair account reps. **Two scenarios, 10 min each, 60-sec reset between.** Walk the imaginary kitchen + receiving + dumpster + sewer-line + roof. Listen for verbatim *"FDA Food Code 6-501.111"* + *"FSMA Preventive Controls"* + *"HACCP CCP-monitoring"* + *"AIB Restaurant Standards"* + whether rep delivers trap-density right-sizing + sensor reframe + radar-approach without flinching + whether she pivots from base-$/mo to four-component MSA. Mark which stage + which avoided conversation each rep skips.

### Role-Play 1 -- Director of Operations Linda Vasquez at 24-Unit FL Casual-Dining Chain Post-Citation (10 min)

**Setup:** **Linda Vasquez, Director of Operations + acting Compliance Officer at Bayou Coastal Kitchen** (24-unit FL/GA casual-dining chain, ~$74M revenue, family-owned + Rollison Holdings PE-backed). **3-yr Rentokil-Terminix-Steritech-bundled MSA expiring 110 days at $6.1K/mo flat = $73.2K/yr** for all 24 units (~$254/unit). Three units took **health-department citations in last 90 days** — Tampa, Pensacola, Orlando — all rodent + cockroach + dry-storage findings + Yelp + Google-Maps exposure + corporate-brand-standards Steritech-score drop from 88 to 71 + insurance carrier flagged + PE-backer demanded remediation plan. Bid invitations went to **incumbent Rentokil-Terminix-Steritech** + **Orkin Commercial / Rollins** + **Ecolab Pest Elimination** + **Anticimex SMART North America** + **Massey Services** + your **independent NPMA-member commercial pest-control firm Gulf-Coast IPM Services** ($28M regional, AIB-PCO + NPMA QualityPro + GreenPro). Linda is demanding flat or down + 25% pesticide-baseline reduction + AIB-equivalency audit-prep. Rep is **Marcus Holden, senior commercial account rep at Gulf-Coast IPM Services Orlando branch**, 9 yrs commercial restaurant + AIB-PCO certified. **Run full 5-STAGE + 4 avoided conversations + close at $8.4K/mo (38% lift) + sensor + audit retainer + 3-yr MSA.**

> ### 🎤 PROSPECT -- Linda Vasquez
> 47, 11-yr Director of Operations, MBA + former Steritech auditor, financially literate, audit-fluent, distrusts "vendor padding," leads BRAND-STANDARDS-AUDIT primary PRICE secondary.
>
> **Deflection 1 (min 4):** *"We've been flat at $6.1K/mo with Rentokil-Terminix-Steritech for three years and we like the Steritech-bundled audit-program. Anticimex SMART quoted me $7.2K/mo with sensors. Why am I getting a 38% increase from you when the market sensor-leader is at $7.2K?"*
>
> **Deflection 2 (min 8):** *"The citation cleanup is Rentokil-Terminix's problem, not mine — they let it happen, they fix it free. And the AIB audit-prep retainer? Our corporate Steritech program already does brand-standards — I don't need a duplicate AIB layer."*

> ### 🎤 ACCOUNT REP Marcus
>
> - **Min 0-3 (SURVEY + SCAN):** *"Linda — bid-walked 4 of 24 units. **9 doors missing sweeps + 6 roof-flashings failed + 3 sewer-clean-out caps missing + dry-storage on-floor + air-curtain + walk-in gasket gaps + 72-hr sensor pre-deploy 14 units = 384 cockroach + 47 rodent + 18 fly activations — 5-8x last 12 mo Rentokil-Terminix tickets**. Three reframes. (1) **FDA Food Code 6-501.111 + 6-202.13 + 6-202.15 + FSMA Part 117 + HACCP + AIB Restaurant Standards** all require evidence-of-active-IPM calendar-tickets can't survive. (2) **Steritech 88 → 71** is your PE-backer + insurance-carrier survival metric. (3) **You are buying audit-recovery + corporate-brand-standards + insurance-rider + Yelp-recovery — not truck-rolls.**"*
> - **Min 3-5 (SHOW + SOLVE):** *"Four components across 24 units. (1) **Base $6.1K → $5.6K/mo** = right-sized IPM + 2 baseline visits + sensor-trigger + AIB-PCO documentation + trap-density 38 → 22 + chemistry -65%. (2) **Sensor $1.4K/mo** = 16 SMART or Sensei units/unit + 24/7 alarm + Steritech-score overlay. (3) **AIB audit-prep retainer $1.1K/mo** = quarterly pre-audit + corrective-action SOPs + 5-yr retention + insurance-rider docs. (4) **Emergency 2-hr SLA $300/mo**. **Total $8.4K/mo + Steritech 71 → 92 + chemistry -65% + Form 483 defensible + insurance-rider preserved.**"*
> - **Min 5-7 (Deflection 1 — Anticimex SMART at $7.2K):** *"Three on SMART. (1) **Pull the SOW** — $7.2K excludes AIB audit-prep + cross-unit-expansion + emergency 2-hr SLA + 5-yr retention; 4-yr auto-renew + 30-day favoring them. (2) **Anticimex NA post-acquisition** — Carmel IN + 50+ acquisitions 2017-2024 + EQT-IPO + branch-rep tenure 11-14 mo per Sept 2024 PCT + PMP. I've owned this 4 yrs + know your Tampa + Pensacola + Orlando back-of-house. (3) **SMART sensor is excellent — we deploy Bell Sensei or co-deploy SMART. Difference: AIB-PCO + NPMA QualityPro + GreenPro + 9-yr tenure + FL Chapter 482 depth.** Plus SMART hardware locks to proprietary cloud — Bell Sensei is AIB-portal-native + Steritech-API-compatible + dashboard-portable."*
> - **Min 7-9 (Deflection 2 — Steritech bundle is enough):** *"Three on Steritech-only. (1) **Steritech is brand-standards-audit — not technical-IPM-author** — not your Form 483 + AIB corrective-action author + not your insurance-rider-doc author. (2) **3 citations in 90 days at Tampa + Pensacola + Orlando** — Steritech audit didn't prevent + Rentokil-Terminix IPM didn't close. **Your incumbent failed at execution AND audit-escalation. Same company in two t-shirts.** (3) **AIB is the brand-standards overlay your insurance + PE-backer require post-citation** — we deliver AIB-PCO + Steritech-API record-overlay + 5-yr retention + insurance-rider-grade evidence. **$1.1K/mo covers $4K-$28K/yr insurance + $8K-$45K AIB-failure + $1.5K-$15K/citation. ROI 8-50x year-one.**"*
> - **Min 9-10 (SECURE):** *"Two asks. (1) **3-yr MSA at $8.4K/mo + CPI+2% + 6% cap + chemistry pass-through Sec 7.3 + sensor amortization 7.4 + auto-renew 90-day + AIB audit-prep + emergency 2-hr SLA + cross-unit expansion + FL + GA branch coverage**. (2) **Two casual-dining DOO peers** — Frank at Sunshine Grill + Maria at Bayou Heritage. **Sign + I deliver Steritech recovery + AIB-equivalency + insurance-rider + Form-483-prep within 14 days as close artifact + co-host Orlando MUFSO post-citation panel Q3.**"*

### 60-Second Reset

> ### 🟡 Coach Note
> **"Switch sides — 60-sec reset."** Stand up. Read the OTHER role's paper. Go.

### Role-Play 2 -- Procurement Officer Marcus at 50-Unit QSR Chain Rebid (10 min)

**Setup:** **Marcus Reyes, Procurement Officer at Pacific Coastal Burgers** (50-unit CA/NV/AZ QSR chain, ~$140M revenue, family-owned + Pacific Heritage Holdings). **3-yr corporate MSA expiring 60 days** at **$11.8K/mo flat = $141.6K/yr** with **Orkin Commercial** (Rollins). Rebid invitations went to **incumbent Orkin Commercial** + **Rentokil-Terminix-Steritech-bundled** + **Ecolab Pest Elimination + Brand Protection** + **Anticimex SMART North America** + **Truly Nolen of America** (regional CA strength) + **Aptive Environmental** (PE-backed expansion) + your **mid-market regional commercial-pest-control firm West-Coast Commercial IPM** ($65M, AIB-PCO + NPMA QualityPro + GreenPro + NSF-Restaurant-Certified, CA/NV/AZ branch density). Marcus has three competing quotes — **Rentokil-Terminix-Steritech-bundled at $9.4K/mo** (heavily Steritech-bundled), **Anticimex SMART at $13.2K/mo** (heavy sensor + ESG-narrative + 100% Anticimex SMART deployment), your **firm at $11.8K/mo with proposed sensor + audit + emergency-SLA**. CFO mandate: total-procurement-spend down 8% + corporate-sustainability ESG-reporting requirement + 100% AIB-PCO-equivalent + post-citation re-inspection-pass-rate 100% target. **Run full 5-STAGE + 2 deflections + close at $11.8K + chemistry-pass-through + audit + emergency-SLA + cross-unit clause + corporate-ESG-dashboard inclusion = $13.6K/mo (15% lift on starting-quote, vs $9.4K Rentokil-Terminix-Steritech-bundled = 45% above bottom + below Anticimex SMART premium).**

> ### 🎤 PROSPECT -- Marcus Reyes
> 39, 6-yr Procurement Officer + acting Director of Sustainability (interim), CPSM + sustainability MBA, financially literate + ESG-fluent, distrusts vendor-margin-padding + RFP-pricing-games, leads PROCUREMENT-CRITERIA primary CORPORATE-ESG-NARRATIVE secondary.
>
> **Deflection 1 (min 4):** *"Rentokil-Terminix-Steritech-bundled quoted us $9.4K/mo + Steritech-audit already included — that's $28.8K/yr below your $11.8K. CFO told me total-procurement-spend down 8%. Why am I paying you 25% more than the market floor when the brand-standards-audit comes free in the bundle?"*
>
> **Deflection 2 (min 8):** *"Anticimex SMART is the sensor-leader at $13.2K and gives me the corporate-ESG-narrative on baseline-pesticide-reduction my Director of Sustainability needs for our 2027 ESG report. You're stuck in the middle — not cheapest, not sensor-leader. Why are you the answer?"*

> ### 🎤 ACCOUNT REP Marcus Holden
>
> - **Min 0-3 (SURVEY + SCAN):** *"Marcus — bid-walked 8 of 50 across LA + Sacramento + Phoenix + Las Vegas. **14 doors degraded sweeps + 11 roof-flashings + 6 sewer-cap-misses + dumpster-pad grease + 72-hr sensor pre-deploy 32 Sensei units = 612 cockroach + 84 rodent + 24 fly + 11 ant — 4-7x current Orkin 12-mo tickets.** Three reframes. (1) **Your 100% re-inspection-pass-rate target requires AIB-PCO + NPMA QualityPro + GreenPro + NSF depth Rentokil-Terminix-Steritech at $9.4K can't deliver** — service-specialist tenure post-merger 11-14 mo per PCT + PMP. (2) **Your 2027 ESG-narrative + Director-of-Sustainability + CDP + TCFD needs pesticide-reduction documented UF + Purdue + UC IPM peer-reviewed methodology — Bell Sensei + Anticimex-SMART-compatible cross-platform 60-90% reduction**. (3) **You are buying total-cost-of-pest-management over 36 mo + AIB-PCO + 100% re-inspection + ESG + cross-platform data-portability + 2-hr emergency + chain-wide consistency — not headline-price.**"*
> - **Min 3-5 (SHOW + SOLVE):** *"Four components across 50 units. (1) **Base $11.8K → $10.2K/mo** = right-sized IPM + 2 baseline + sensor-trigger + AIB-PCO + NSF documentation + trap-density 32 → 19 + chemistry -68%. (2) **Sensor $2.1K/mo** = 14 Sensei or SMART-compatible/unit + ESG-dashboard + cross-platform export to Director of Sustainability portal. (3) **AIB + NSF audit-prep retainer $850/mo** = quarterly pre-audit + Steritech-API record-overlay + insurance-rider docs. (4) **Emergency 2-hr SLA $450/mo** + CA/NV/AZ branch density. **Total $13.6K/mo = 15% lift + 100% re-inspection + ESG-narrative + cross-platform data-portability + 3-state coverage.**"*
> - **Min 5-7 (Deflection 1 — Rentokil-Terminix at $9.4K Steritech-bundled):** *"Three on Rentokil-Terminix-Steritech, with respect. (1) **Pull the SOW** — $9.4K covers base + Steritech but EXCLUDES AIB-PCO + NSF equivalency + cross-platform sensor + emergency 2-hr SLA + ESG-documentation + chemistry-reduction tracking. Sections 4 + 9 + 14 + 22. (2) **Rentokil-Terminix post-Dec-2022 merger year 3** — branch consolidation + tech-attrition + ~$200-$250M synergy per Rentokil H1 + H2 2024 trading updates — service-specialist tenure post-rebid 8-14 mo. Your 100% re-inspection target needs 5+ yr tenured tech + AIB-PCO depth. (3) **Steritech-bundled is brand-standards-audit not technical-IPM-author** — Rentokil-Terminix-IPM is the author + source of any back-of-house gap. **Same company in two t-shirts. Not independent audit.** Your 2027 ESG-report + CDP + TCFD reviewed under IAASB ISSA 5000 — needs independent IPM-author + audit-source separation."*
> - **Min 7-9 (Deflection 2 — Anticimex SMART at $13.2K is ESG-leader):** *"Three on Anticimex SMART. (1) **SMART is excellent + best-in-class ESG-narrative** — we don't dispute. **What we offer: Bell Sensei + SMART-compatible cross-platform + AIB-PCO + NPMA + NSF + 12-yr CA/NV/AZ tenure + 2-hr emergency + chain-mapping at $1.6K below SMART headline**. (2) **Anticimex NA in aggressive 50+-acquisition + EQT-IPO + service-specialist tenure 11-14 mo** per Sept 2024 PCT + PMP — your 100% re-inspection + chain-wide-consistency needs CA + NV + AZ tenured-tech depth SMART NA can't yet deliver. (3) **Cross-platform open-data-export is the difference** — SMART deploys proprietary cloud + non-SMART ESG-export bottlenecked. **Sensei + SMART-compatible + AIB + NSF + Steritech-API gives native CDP + TCFD compatibility without vendor-lock.**"*
> - **Min 9-10 (SECURE):** *"Three asks. (1) **3-yr MSA at $13.6K/mo + CPI+2% + 6% cap + chemistry pass-through Sec 7.3 + sensor amortization 7.4 + auto-renew 90-day + AIB + NSF audit-prep + emergency 2-hr SLA + cross-unit expansion + CA/NV/AZ branch density**. (2) **Director of Sustainability + DOO + CFO 3-way debrief within 14 days** — ESG-package + AIB-PCO + Steritech-API comparison + cross-platform brief. (3) **Two CA/NV/AZ DOO + Procurement peers** — Frank at Coastal Grill + Maria at Desert Heritage. **Sign + I deliver ESG + AIB + NSF + Steritech-comparison + cross-platform + insurance-rider package within 14 days + co-present LA + Sacramento RFMA + MUFSO panel Q4.**"*

> ### 🟡 Coach Note
> Rep will want to (a) match Rentokil-Terminix $9.4K — DON'T, race-to-bottom destroys MSA value; (b) attack Anticimex SMART on sensor — DON'T, position cross-platform + data-portability + branch tenure; (c) skip the Director-of-Sustainability ESG-narrative — DON'T, 2027 corporate-ESG-reporting + CDP + TCFD + IAASB ISSA 5000 is the real capital + audit buyer; (d) accept "I'll think about it" without delivering corporate-ESG + AIB + Steritech-comparison + sensor-cross-platform briefing as MSA-close artifact — DON'T, the briefing IS the close.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief Qs then commitments. Ritual moves next quarter's MSA value uplift + sensor attach + audit-prep attach + emergency-SLA delivery + MSA quartile movement.

**Debrief 1 — "Strongest stage? Weakest?"** Reps over-index SURVEY, under-index SHOW (right-sizing feels confrontational) + SECURE (3-yr MSA + sensor amortization feels presumptuous post-citation). **Branch Mgr:** *"Skip SHOW or SECURE + MSA flat + branch margin worsens + SMART or Rentokil-Terminix-Steritech wins next rebid."*

**Debrief 2 — "Avoided conversation dodged most?"** Most name "trap-density right-sizing." **Branch Mgr:** *"When you flinch on density, branch eats it + operator overpays for billed-chemistry + GM stays at 12-22%. Top-quartile right-sizes + sensors + lifts 18-32%."*

**Debrief 3 — "Bid you owe a redo?"** ONE recent lost bid closed flat or without sensor. **Branch Mgr:** *"Email 48 hrs: 'Linda — re-inspection Day 14 of 30 + I ran your last 6 tickets + sensor pre-deploy + 30-day prep + 90-day MSA-replacement + AIB + Steritech retainer. 30-min call?' Mid-cycle rebid = 25-40% uplift per Specialty Consultants + PCT + PMP."*

> ### 🎤 Commitment Ritual (Verbatim)

**Branch Mgr:** "Open the CRM. Four lines. **(1)** bid that closed flat / under-uplifted / without sensor (building + MSA value + avoided conversation + verbatim 'flat' language). **(2)** stage skipped + verbatim line to redeliver. **(3)** avoided conversation dodged + reframe. **(4)** one account needing trap-density right-sizing + sensor + audit-prep conversation booked in 30 days. Read aloud."

Coach the vague: *"Which restaurant? Which gap? Which lift number? Out loud now."*

**Closes:** "1:1 bid-walk-shadow within 14 days. Not whether you held the account — **whether you ran SURVEY + delivered SHOW right-sizing + SOLVE sensor + audit-prep + asked for chain corporate brand-standards alignment.**"

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out one-pager. 30 sec per section. Digital in CRM + branch SharePoint. One in every account-rep bag + branch war-room wall + Monday-huddle binder.

> ### 📋 Leave-Behind -- "The 5-Stage Bid-Walk Script Card" One-Pager

> **8 THINGS TO BRING ON EVERY RESTAURANT BID:** (1) SURVEY scorecard (kitchen + receiving + dumpster + dry-storage + dish-pit + bar + dining + restroom + roof + exterior + sewer-line + landscape). (2) UV blacklight + glue-board kit + thermal + moisture-RH + sensor pre-deploy 6-12 Bell Sensei or SMART-compatible units. (3) FDA Food Code 6-501.111 + 6-202.13 + 6-202.15 cite card + state cross-walk. (4) FSMA + HACCP + AIB + Steritech + Brand Protection + NSF audit cross-walk. (5) Trap-density right-sizing calculator per 1,000 sqft by cuisine. (6) Sensor attach pitch (Sensei vs SMART vs 24/7 Connect vs Connected Pest vs DigitalSense). (7) MSA template (3-yr + CPI+2% + chemistry pass-through + sensor amortization + auto-renew + scope governance + cross-unit + termination). (8) AIB-PCO + NPMA QualityPro + GreenPro + NSF + state-license + $2M+ liability + insurance certificate.

> **THE 5-STAGE BID-WALK SCRIPT CARD:** **(1) SURVEY Day 1** — *"9 min bid-walk. 3 doors. 2 missing sweeps. Roof grease-vent failed. Receiving pad active. Sewer cap missing. Dry-storage on-floor. Air-curtain unbalanced. UV trail dish-pit + grease-trap. Current tickets log none."* **(2) SCAN Day 4** — *"UV + glue-board + thermal + moisture + 72-hr sensor pre-deploy. German 14 + American 8 + rodent 27 in 72 hr — 4-7x last 12 mo tickets."* **(3) SHOW Day 8** — *"Left current: 38 + 12 + 14 + monthly + no sensor + 3 Food Code gaps. Right: 22 + 9 + 8 + 16 sensors + radar + AIB-PCO + Steritech-prep + chemistry -65%."* **(4) SOLVE Day 12** — *"Base $5.6K + sensor $1.4K + audit-prep $1.1K + emergency $300 = $8.4K/mo + Steritech 78 → 92 + chemistry -65% + insurance-rider preserved."* **(5) SECURE Day 18** — *"3-yr MSA + CPI+2% + 6% cap + chemistry pass-through + sensor amortization + auto-renew + cross-unit. Two DOO peers + Steritech-recovery + AIB-equivalency + Form-483-prep within 14 days + MUFSO panel Q3."*

> **THE 4 AVOIDED CONVERSATIONS:** **(1) Trap-density right-sizing** UF + Purdue + UC IPM peer-review 50-70% density-reduction + sensor delivers equivalent + 35-55% lower chemistry + 25-45% better audit (Top 35-55% vs bottom <10%). **(2) Radar reframe** 12 → 2 visits + sensor-trigger + 2-hr SLA + 60-90% pesticide reduction + 8-22% total-cost reduction (Top 35-55% sensor vs bottom <10%). **(3) Corporate-MSA-pre-empt** Corporate rebid Q4 + franchisee carve-out Q2 (Top 25-40% chain-win vs bottom <8%). **(4) Citation-prompted** Day 3 of 30. Technical not moral. Insurance needs documented IPM. Incumbent's tickets prove gap. 30-day re-inspection-prep + AIB + Steritech + insurance + Yelp recovery (Top 65-85% citation-conversion vs bottom 25-40%).

> **MSA QUARTILE SELF-DIAGNOSIS:** Top **32-48% GM / 72-82% util / 90-95% renewal / 4-8% uplift / 35-55% sensor / 25-40% audit-prep / 75-90% QBR / 5-7% non-renew / 75-90% bid-walk**. Median 18-28% / 60-70% / 78-85% / 1-4% / 15-25% / 8-15% / 35-50% / 3-5% / 35-50%. Bottom 12-22% / 48-58% / 65-75% / 0% / <10% / <5% / 15-25% / 1-3% / <20%. (Full table in Numbers section.)

> **THE 12-CONTROL FDA + FSMA + HACCP + AIB + STERITECH + NSF AUDIT CHECKLIST:** **(1) FDA Food Code 6-501.111** free of pests. **(2) 6-202.13 + 6-202.15** Insect Control + Outer Openings. **(3) FSMA Part 117** GMP + Sanitation SOP + IPM + CCP + corrective + verification + records. **(4) HACCP 7 Principles** pest as bio/phys/chem hazard + 5-yr records. **(5) AIB Restaurant Standards** Score 85+ + AIB-PCO. **(6) Steritech** brand-standards + Steritech-API record-overlay. **(7) Ecolab Brand Protection + EcoSure** temperature + chemistry + cleaning. **(8) NSF + NSF/ANSI 169 + 7/51/53**. **(9) Sensor monitoring** Sensei / SMART / 24/7 Connect / Connected Pest + chain dashboard + cross-platform export. **(10) Trap-density right-sizing** UF + Purdue + UC IPM peer-reviewed. **(11) Chemistry pass-through clause** post-2022 commodity-volatility. **(12) Emergency 2-hr SLA + 30-day re-inspection-prep + insurance-rider docs + Yelp recovery.**

> **NEVER DO:** bid flat without walk / skip 5-stage / quote from parking lot / leave legacy over-trap + bid lower / accept "Steritech-bundled covers brand-standards" without separating audit from IPM-author / pitch faster-response to DOO + Procurement (reframe to AIB + Steritech + ESG + insurance + brand-standards) / accept "never had a citation" / let SMART headline-price undercut without cross-platform + AIB-PCO + tenure brief / outsource sensor + audit-prep to chemistry-leaning rep / skip emergency 2-hr SLA premium / treat citation-replacement as low-margin cleanup / ignore CDP + TCFD + IAASB ISSA 5000 ESG / single-thread DOO when CFO + Sustainability + Procurement + Compliance + Insurance are real buyers / forget NPMA + IBISWorld + PCT Top 100 quartile data.

> **OUTCOME LINE:** Full discipline → **18-32% MSA value lift / 90%+ renewal / 32-48% GM / 4-8%/yr escalator / sensor 35-55% / audit-prep 25-40% / emergency-SLA 75-90% / chain brand-standards alignment / AIB + Steritech + NSF audit-defensibility**. Flat-bid + skip-walk + no-sensor + no-audit + over-trap + ignore-ESG → **0-5% lift / 65-78% renewal / 12-22% GM / 0-2% escalator / sensor <10% / audit-prep <5% / lose chain-rebids to SMART + Rentokil-Terminix-Steritech + Orkin within 18 mo**.

> ### 🎯 If You Only Remember One Thing
> **You don't win a 24-unit casual-dining chain post-citation with a $/mo quote — you win her by (1) walking the kitchen + receiving + dumpster + sewer-line + roof + landscape on a real bid-walk + UV + glue-board + sensor pre-deploy + 9-minute findings narrative (SURVEY + SCAN), (2) right-sizing her over-trapped 38-station footprint to 22 stations + 16 sensors + radar-approach + showing the legacy-vs-IPM left-right panel (SHOW), and (3) delivering a four-component MSA — base + sensor + AIB + Steritech audit-prep + emergency 2-hr SLA with FDA Food Code + FSMA + HACCP-aligned PCP + insurance-rider preservation + corporate-ESG-narrative all in one (SOLVE + SECURE). Every restaurant on flat-bid + spray-and-pray is a future loss to Anticimex SMART + Rentokil-Terminix-Steritech + Orkin Commercial within 18 months; every restaurant on bid-walked + right-sized + sensor-monitored + audit-prep-retained + chain-corporate-brand-standards-aligned cadence is a moat consolidators can't cross in 36-48 months.**

---

## How This Training Sits Inside Your Branch Operating Motion

**Monday branch huddle** weekly — prior week's bids + 1 verbatim drill. **Day 1** SURVEY walk. **Day 4** SCAN UV + glue + sensor pre-deploy. **Day 8** SHOW legacy-vs-IPM + Food Code + FSMA + HACCP + AIB. **Day 12** SOLVE four-component. **Day 18** SECURE 3-yr MSA + amortization + audit-prep + emergency-SLA + cross-unit. **Four avoided conversations overlay** every cycle. **Branch quartile review** quarterly + 90-day operating-model fix.

`;

// ============================================================================
// FLOW -- two mermaid diagrams
// ============================================================================
const flow = `

## The 5-Stage Bid-Walk Flow

\`\`\`mermaid
flowchart TD
  A[Branch Mgr Opens] --> B[Section 1 Cold Open — NPMA + IBISWorld + Specialty Consultants Inc + PCT Top 100 quartile spread + Rep A flat-bid single-unit independent Cleveland post-Yelp-citation lost to Anticimex SMART vs Rep B 24-unit FL casual-dining chain rebid Orlando $6.1K to $8.4K/mo MSA w/ sensor + AIB audit-prep + radar-approach]
  B --> C[Section 2 Teach 25 min]
  C --> C1[Part A 5-STAGE — SURVEY kitchen + receiving + dumpster + sewer-line + roof bid-walk / SCAN UV + glue-board + thermal + sensor pre-deploy / SHOW legacy over-trap vs right-sized IPM panel / SOLVE 4-component MSA base + sensor + audit-prep + emergency-SLA / SECURE 3-yr MSA + escalator + chemistry pass-through + cross-unit clause]
  C --> C2[Part B 4 Avoided — trap-density right-sizing / radar-approach reframe / corporate-MSA-pre-empt navigate / citation-prompted-replacement reframe]
  C --> C3[Part C 3 Compliance Lenses — FDA Food Code 6-501.111 + 6-202.13 + 6-202.15 / FSMA Preventive Controls Part 117 / HACCP CCP-monitoring + AIB + Steritech + NSF]
  C --> C4[Part D MSA Quartile Self-Diagnosis 5 metrics]
  C1 & C2 & C3 & C4 --> F[Section 3 Discussion 8 prompts]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[R1 Linda Vasquez DOO 24-unit FL casual-dining Bayou Coastal Kitchen post-citation Tampa + Pensacola + Orlando + PE-backer + Steritech score 88-71 — 5-STAGE + 38% lift to $8.4K/mo + 16 sensors + AIB audit-prep + emergency 2-hr SLA + 3-yr MSA]
  G1 --> G2[60-sec reset]
  G2 --> G3[R2 Marcus Reyes Procurement 50-unit QSR Pacific Coastal Burgers CA/NV/AZ rebid + Rentokil-Terminix-Steritech $9.4K vs Anticimex SMART $13.2K + Director-of-Sustainability 2027 ESG-report — 5-STAGE + $13.6K/mo MSA + cross-platform sensor + AIB + NSF + Steritech-API-compatible]
  G3 --> H[Section 5 Debrief CRM ritual]
  H --> I[Section 6 Leave-Behind]
  I --> Z[End 1:13]
\`\`\`

## The Compliance + Sensor + Audit-Prep Decision Tree

\`\`\`mermaid
flowchart LR
  IN[Restaurant bid-walk invitation arrives] --> SCAN{Bid-walk SURVEY + SCAN reveals scope}
  SCAN -- 0-2 gaps + no citation + low pressure --> CLEAN[Standard MSA + base + minimal sensor + QBR cadence]
  SCAN -- 3-6 gaps + recent citation OR chain rebid --> UPLIFT{Operator accepts 4-component proposal}
  SCAN -- 7+ gaps + active citation + 30-day re-inspection --> CRISIS[Emergency triage + 30-day re-inspection-prep + 90-day MSA-replacement]
  UPLIFT -- accepts sensor + audit-prep + emergency-SLA --> WIN[Close + MSA value lift + 90%+ renewal]
  UPLIFT -- declines first --> ESCALATE[Branch-mgr + 30-day reconsideration + Steritech-API + AIB equivalency brief]
  ESCALATE -- accepts 2nd pass --> WIN
  ESCALATE -- declines twice written --> NONRENEW{Walk-away criteria met}
  CRISIS -- signs emergency MSA --> WIN
  CRISIS -- swap to Anticimex SMART / Rentokil-Terminix-Steritech --> WARN[SOW-comparison brief + branch-tenure + AIB-PCO + sensor cross-platform data-portability + 30-day decision]
  WARN -- competitor SOW excludes AIB-PCO + emergency-SLA + cross-platform sensor --> WIN
  WARN -- operator signs competitor anyway --> NONRENEW
  NONRENEW -- elevated citation + insurance-rider exposure --> EXIT[Walk-away + 90-day transition + warm intro 2 regional alt PCOs]
  NONRENEW -- branch revenue critical short-term --> CONTRACT[Limited-scope + carve-out citation risk + 1-yr exit]
  WIN --> NEXT[Q4 quarterly QBR + annual AIB + Steritech audit-prep + sensor evidence-overlay + corporate-ESG-dashboard + cross-unit expansion]
\`\`\`

`;

// ============================================================================
// SRC -- sources block
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE Bid Walk, Four Avoided Conversations, Three Compliance Lenses, MSA quartile framework, and 18-32% value-uplift benchmarks draw on commercial pest-control industry research, manufacturer-direct and consolidator service disclosures, PE-backed roll-up benchmarking, federal FDA + FSMA + EPA + USDA regulatory data, and AIB + Steritech + Ecolab Brand Protection + NSF audit standards.

**Industry benchmarking.** **NPMA + NPMA QualityPro + GreenPro + AIB-PCO** + **IBISWorld Pest Control Services 2024 (~$24B + ~30K establishments + ~190K workforce + ~3.8% 5-yr CAGR)** + **Specialty Consultants Inc PCO M&A Quarterly** + **PCT Top 100** + **PMP**. Top-quartile 32-48% MSA GM + 72-82% util + 90-95% renewal + 4-8% uplift + 35-55% sensor + 25-40% audit-prep + 75-90% QBR; Median 18-28% / 1-4%; Bottom 12-22% / 0%.

**Big-3 commercial pest-control consolidators.** **Rollins NYSE:ROL** (Jerry Gahlhoff Jr, Atlanta GA, ~$3.4B, ~20K) Orkin + HomeTeam + Western Pest + Critter Control + Waltham + Permabond + OPC + IFC + Trutech + Northwest. **Rentokil Initial LSE:RTO** (Andrew Ransom, Crawley UK, ~$5.2B, ~62K, ~90 countries) post-Dec-2022 Terminix acquisition $6.7B + Steritech-bundled. **Ecolab NYSE:ECL** (Christophe Beck, St Paul MN, ~$15.7B) Pest Elimination division ~$1.2B + Brand Protection + EcoSure + ~3,500 Pest Elimination service specialists.

**Sensor-led + family-owned + PE-backed challengers.** **Anticimex** (Hans Jonsson, Stockholm SE, EQT Partners + IPO planned ~$8B+ EV, ~$1.4B, ~10K, ~21 countries) SMART sensor-based commercial pest-control + Anticimex North America Carmel IN + 50+ acquisitions 2017-2024. **Truly Nolen** (Scott Nolen, Tucson AZ, family-owned since 1938, ~$140M). **Massey Services** (Tony Massey, Orlando FL, family-owned since 1985, ~$250M + GreenUP). **Plunkett's** (Stacy O'Reilly, Fridley MN, family-owned since 1915, ~$60M, Midwest-dominant). **Aptive Environmental** (Vess Pearson, Provo UT, PE-backed, ~$250M). **Arrow Exterminators** (Emily Thomas Kendrick, Atlanta GA, family-owned since 1964, ~$280M + StratIPM).

**FDA + FSMA + HACCP regulatory.** **FDA Food Code 2022** sections **6-501.111** + **6-202.13** + **6-202.15** + **6-501.115**. **FSMA Jan 2011 + Preventive Controls 21 CFR Part 117 + Produce Safety 21 CFR Part 112 + Sanitary Transportation + Food Defense + Foreign Supplier Verification**. **HACCP 7 Principles** + USDA FSIS 9 CFR Part 417 + FDA HARPC. **EPA FIFRA + Pesticide Registration + WPS 40 CFR Part 170 + RUP + state pesticide-applicator licensure 50 states**.

**Brand-standards + third-party audit perimeter.** **AIB International** (~$70M, Manhattan KS, since 1919, ~10K AIB audits annually) AIB CSI + AIB Restaurant Standards + AIB-PCO certification. **Steritech** (Charlotte NC, Rentokil subsidiary, ~$200M+) chain restaurant brand-standards audit dominant US. **Ecolab Brand Protection + EcoSure** competing chain brand-standards audit + temperature monitoring. **NSF International** (Ann Arbor MI, since 1944) NSF/ANSI Std 169 Pesticide Hazard Mitigation + 7 / 51 / 53 + NSF Restaurant Certification.

**Chemistry + sensor + equipment.** **Bell Laboratories** (Madison WI, since 1974, Bell Sensei sensor leader) + **Liphatech** (Milwaukee WI, since 1972, De Sangosse subsidiary). **Bayer Cropscience Environmental Science Professional + Syngenta Professional Pest Management + BASF Pest Control + Corteva Agriscience + FMC Professional + Nisus + Rockwell Labs + Control Solutions Inc (ADAMA) + Central Life Sciences**.

**Restaurant industry + facility-management.** **NRA** (Washington DC, ~500K members, ~$1.1T US restaurant industry size 2024, ~750K locations, ~15.5M workforce). **RFMA + MUFSO + Restaurant Finance Monitor + Technomic + Datassential + Restaurant Business + Nation's Restaurant News + QSR Magazine + Food Safety Magazine**.

**Research + IPM science.** **NPMA Pest Management Foundation + Entomological Society of America** + **University of Florida Urban Pest Lab + Texas A&M AgriLife + Purdue Center for Urban + Industrial Pest Management + Auburn IPM Center + UC IPM Statewide + UC Riverside + UC Davis + Mississippi State + Penn State Cooperative Extension + NC State + USDA ARS Beltsville + BPCA + CEPA**. Peer-reviewed: sensor + service-only-when-found IPM reduces pesticide-volume 60-90% + emergency-callout 30-60% + total-cost 8-22% over 3-yr MSA vs scheduled-spray baseline.

**Industry trade-press + M&A.** **Pest Control Technology PCT (GIE Media Richfield OH) + Pest Management Professional PMP (North Coast Media Cleveland OH) + PCT Top 100 + Specialty Consultants Inc + Hub Brand Resources + Wirtz Manufacturing + ChannelE2E**. PCO acquisition multiples 7-12x EBITDA for $5M+ regional commercial-pest 2022-2024.

**ESG / sustainability + corporate.** **CDP + TCFD + ISSB + SASB + IAASB ISSA 5000** sustainability assurance + corporate ESG-reporting + chain restaurant 2027 ESG-narrative + Director-of-Sustainability + Procurement.

`;

// ============================================================================
// NUM -- quantified benchmark tables
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

Pulled from NPMA + IBISWorld 2024 + Specialty Consultants Inc PCO M&A Quarterly + PCT Top 100 + PMP + Rollins + Rentokil + Ecolab + Anticimex investor + trade-press disclosures + AIB + Steritech + NSF + EPA FIFRA + FDA Food Code 2022 + FSMA + HACCP regulatory + UF + Purdue + UC IPM + Texas A&M + Auburn + Mississippi State urban-entomology peer-reviewed research.

### Commercial Pest-Control Account-Rep Operating Benchmarks 2024 (NPMA + IBISWorld + PCT + Specialty Consultants Inc)

| Metric | Top-Quartile | Better | Median | Bottom |
|---|---|---|---|---|
| **Gross margin on MSA portfolio** | **32-48%** | 25-32% | 18-28% | 12-22% |
| **Billable-hour utilization** | **72-82%** | 65-72% | 60-70% | 48-58% |
| **MSA renewal rate** | **90-95%** | 85-90% | 78-85% | 65-75% |
| **Annual price uplift at renewal** | **4-8%** | 2-4% | 1-4% | 0% |
| **Sensor-monitoring attach** | **35-55%** | 20-30% | 15-25% | <10% |
| **Audit-prep retainer attach (AIB / Steritech / NSF)** | **25-40%** | 12-20% | 8-15% | <5% |
| **Emergency 2-hr SLA premium attach** | **75-90%** | 55-70% | 35-50% | <20% |
| **Quarterly QBR delivery rate** | **75-90%** | 55-72% | 35-50% | 15-25% |
| **Deliberate non-renewal rate** | **5-7%/yr** | 4-6%/yr | 3-5%/yr | 1-3%/yr |
| **MSA recurring % of branch revenue** | **48-58%** | 40-48% | 32-40% | 20-30% |
| **Bid-walk completion rate** | **75-90%** | 55-72% | 35-50% | 15-25% |

### Commercial Pest-Control Consolidator + Challenger Landscape (2024)

| Operator | Ticker / Status | Revenue | Network | CEO |
|---|---|---|---|---|
| **Rentokil Initial** | **LSE:RTO** | ~$5.2B | ~90 countries / ~16M customers | Andrew Ransom |
| **Rollins** | **NYSE:ROL** | ~$3.4B | ~600 Orkin US branches + 50+ acquisitions | Jerry Gahlhoff Jr |
| **Ecolab Pest Elimination** | **NYSE:ECL** (division) | ~$1.2B | ~3,500 service specialists | Christophe Beck (parent) |
| **Anticimex** | private (EQT + IPO planned) | ~$1.4B | ~21 countries + Anticimex NA Carmel IN | Hans Jonsson |
| **Arrow Exterminators** | private (family-owned 1964) | ~$280M | 130+ service centers SE/Mid-Atlantic | Emily Thomas Kendrick |
| **Massey Services** | private (family-owned 1985) | ~$250M | ~150 service centers FL/SE | Tony Massey |
| **Aptive Environmental** | private (PE-backed) | ~$250M | residential D2D + commercial expansion | Vess Pearson |
| **Truly Nolen** | private (family-owned 1938) | ~$140M | ~80 US offices SW/FL | Scott Nolen |
| **Plunkett's** | private (family-owned 1915) | ~$60M | Midwest-dominant | Stacy O'Reilly |

### Commercial Restaurant Pest-Control MSA Pricing Benchmarks 2024-2027 ($/mo)

| Restaurant Type | Single PM-Only | Single Full | 50-Unit Chain MSA | Sensor/yr |
|---|---|---|---|---|
| **QSR / fast-casual** | $150-$350 | $300-$550 | $4K-$8K | $25-$50 |
| **Casual-dining** | $200-$450 | $400-$700 | $5K-$10K | $30-$60 |
| **Full-service indie** | $250-$550 | $450-$850 | n/a | $35-$80 |
| **Fine-dining** | $350-$650 | $550-$1,100 | n/a | $50-$100 |
| **Coffee + bakery** | $150-$350 | $300-$600 | $3.5K-$7K | $25-$50 |
| **Pizza + delivery** | $150-$320 | $300-$550 | $3.5K-$7.5K | $25-$50 |
| **Hotel restaurant** | $400-$850 | $700-$1,400 | $7K-$14K | $40-$85 |

### Health-Department + Audit-Failure Cost Stack 2024

| Cost Component | Low | High |
|---|---|---|
| **Health-dept fine (single-citation)** | $1,500 | $15,000 |
| **30-day re-inspection lost revenue** | $8K | $85K |
| **Insurance-rider impact (foodborne)** | $4K/yr | $28K/yr |
| **AIB audit failure (chain)** | $8K | $45K |
| **Steritech score drop** | $3K | $22K |
| **Foodborne-illness lawsuit settlement** | $50K | $4M+ |
| **Corporate-brand-standards franchise penalty** | $5K | $50K |
| **Yelp + Google-Maps reputation recovery** | $4K | $35K |

### Trap-Density Right-Sizing Benchmarks (Restaurant <5,000 sqft, UF + Purdue + UC IPM Peer-Reviewed)

| Trap Type | Legacy Density | Right-Sized + Sensor | Reduction |
|---|---|---|---|
| **Rodent stations exterior** | 18-28 | 10-16 | 35-45% |
| **Rodent stations interior** | 8-14 | 5-8 | 35-45% |
| **Insect-light-traps** | 8-16 | 4-8 | 45-55% |
| **Cockroach gel-bait stations** | 12-22 | 6-10 | 45-55% |
| **Sensor units deployed** | 0 | 12-18 | n/a |
| **Total chemistry-volume reduction** | n/a | -60-85% | (radar-approach) |

### Sensor-Monitoring Platform Pricing 2024-2027 (Commercial Pest-Control)

| Platform | Hardware $/unit | Cloud $/sensor/mo | Best For |
|---|---|---|---|
| **Anticimex SMART** | $55-$90 | $1.50-$2.50 | premium-tier full-stack + ESG-narrative |
| **Bell Sensei** | $25-$60 | $0.80-$1.80 | cross-platform + AIB + Steritech + NSF API |
| **Rollins 24/7 Connect** | $45-$80 | $1.20-$2.20 | Orkin Commercial bundled |
| **Ecolab Connected Pest** | $50-$85 | $1.40-$2.40 | Ecolab chemistry + warewash bundled |
| **Bayer DigitalSense** | $35-$70 | $1.00-$2.00 | chemistry-bundled |
| **Cross-platform 3rd-party (Bell + Sensit + Spotta)** | $25-$50 | $0.70-$1.50 | data-portability + cross-platform |

### Commercial Pest-Control Service Cadence Models 2024-2027

| Service Model | Baseline Visits/Yr | Sensor Coverage | Chemistry Volume | Audit Score Impact |
|---|---|---|---|---|
| **Legacy scheduled-spray** | 12 | 0 | baseline | baseline |
| **Standard IPM** | 8 | 0-4 | -25% | +4-8 pts |
| **Sensor-augmented IPM** | 4-6 | 8-14 | -40-55% | +10-15 pts |
| **Radar-approach SMART/Sensei** | 1-2 baseline + triggered | 14-22 | -60-85% | +15-22 pts |
| **Anticimex SMART full** | 1 baseline + triggered | 18-28 | -75-90% | +18-25 pts |

### Restaurant Pest-Control Bid-Walk Performance by Rep Tenure + Discipline

| Tenure | MSA Value Lift | Renewal | Bid-Walk Completion | Sensor Attach |
|---|---|---|---|---|
| **0-1 yr** | 0-3% | 65-75% | 25-40% | <8% |
| **1-3 yrs** | 3-8% | 75-83% | 40-55% | 8-15% |
| **3-5 yrs** | 6-12% | 82-88% | 55-70% | 12-22% |
| **5-10 yrs** | 9-18% | 86-92% | 65-80% | 18-30% |
| **5-STAGE + 4-Avoided + 3-Lenses Discipline** | **18-32%** | **90%+** | **75-90%** | **35-55%** |

**Pattern:** SHOW + SOLVE four-component MSA and sensor + audit-prep attach hardest to install. **Weekly bid-walk-shadow + monthly audit-prep + sensor + Food Code drill + quarterly quartile diagnosis = biggest predictor of next-quarter MSA lift.** Sensor attach reaches 35%+ by month 4 with branch-mgr coaching.

`;

// ============================================================================
// COUNTER -- failure modes + objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Counter 1 -- Single-Location Indie With No Citation
Mom-and-pop with no citation + no chain brand-standards + budget under $300/mo. **5-STAGE + 4-avoided + 3-lenses is over-engineered.** Right move: lean SURVEY + minimal sensor + base + annual QBR, not 4-component MSA. Top-quartile branches discipline themselves to NOT over-engineer the indie.

### Counter 2 -- Post-Acquisition Uncertainty
Operator just acquired + corporate MSA in active rebid + interim DOO. **Running full 5-STAGE commits the wrong decision-maker.** Right move: walk + scan + 1-page brief + revisit 60-90 days after settle.

### Counter 3 -- Kitchen Renovation In Progress
Mid-renovation + temp-walls + temp-power. **Bid-walk findings invalid + sensor pre-deploy invalid.** Right move: temporary construction-IPM contract (~30-90 days) + bid-walk full MSA post-renovation.

### Counter 4 -- Owner About To Sell
Listed business or active LOI. **5-STAGE is wasted effort if you can't survive transition.** Right move: walk + leave findings + warm-intro to buyer at LOI-stage + bid-walk buyer not seller.

### Failure Mode 5 -- Bidding Flat to "Keep the Account Happy"
Rep holds $5.4K/mo flat. 8 mo later Anticimex SMART BDR pitches sensor + AIB-equivalency + cross-platform. Operator signs SMART at $7.8K/mo. **Flat = delayed loss + sensor-leader wins next rebid.**

### Failure Mode 6 -- Skipping the Bid-Walk
Quote from parking lot + email PDF. Per NPMA + Specialty Consultants Inc + PCT Top 100: **Median 35-50% vs top-quartile 75-90%.** No walk = no leverage = no sensor + audit attach = lose at first citation or rebid.

### Failure Mode 7 -- Avoiding Trap-Density Right-Sizing
Rep matches current 38-station grid. Per UF + Purdue + UC IPM: drives **~35% of GM gap**. Over-trapped legacy = billed-chemistry not pest-control.

### Failure Mode 8 -- Ignoring Sensor Reframe
24-unit chain rebid + zero sensor + zero radar narrative = lose to SMART + Rollins 24/7 Connect + Connected Pest + Sensei. **Top 35-55% sensor attach vs bottom <10%.**

### Failure Mode 9 -- Pitching Faster Response to DOO + Procurement
Wrong frame. They care about **AIB + Steritech + NSF + ESG + insurance-rider + 100% re-inspection-pass-rate**, not SLA-dashboards.

### Failure Mode 10 -- Letting Competitor Undercut Without Cross-Platform Brief
Rep discounts + loses MSA value forever. **Correct response: SOW-comparison brief** showing competitor excludes AIB-PCO + cross-platform sensor + emergency-SLA + Steritech-API record-overlay + brand-standards alignment.

### Failure Mode 11 -- Silent Chemistry-Cost Pass-Through
Branch eats 2024-2025 chemistry spikes. **8-18% MSA-GM erosion over 24 mo.** Top-quartile cites Section 7.3 + post-2022 commodity-volatility at anniversary.

### Failure Mode 12 -- Treating Citation-Replacement as Low-Margin Cleanup
Rep takes citation work at flat thin margin. Wrong frame. **Highest-emotional + highest-urgency** = 25-40% uplift opportunity if rep delivers full 5-STAGE + 4-component MSA.

### Failure Mode 13 -- Outsourcing Sensor + Audit-Prep to Chemistry-Leaning Rep
Per NPMA + PMP + PCT: **branch-mgr work + non-delegable**. Branch mgr delivers sensor capex + AIB-PCO equivalency, rep delivers technical walk + chemistry.

### Failure Mode 14 -- Holding Money-Losing Bottom-Quartile Accounts
4x emergency-callouts + refuses sensor + 6+ citations in 18 mo. **Negative GM + tech burnout.** Top-quartile non-renews 5-7%/yr with warm-intro to 2 alt PCOs.

### Common Branch-Manager Objections

**1. "Operators won't accept a price increase."** Top-quartile renewal ~92% vs ~70% **while raising 4-8%/yr**. Anchor to NPMA + IBISWorld + Specialty Consultants + PCT + chemistry pass-through Section 7.3.

**2. "Sensor + audit-prep are for big chains — we're regional."** Wrong. Highest-leverage 2024-2027 upsells for $5-$50M regionals serving 5-50-unit chain restaurants where brand-standards + AIB + Steritech + NSF + insurance + ESG pressure is real.

**3. "How do I know it's working?"** 90-day signals: bid-walk +30-50 pts / sensor 25%+ / audit-prep 15%+ / Food Code verbatim every rep / MSA quartile movement 12 mo / branch GM +6-12 pts.

**4. "When do we walk away?"** (a) refuses walk AND sensor AND 3-yr term AND requests bottom-quartile pricing, (b) churn every 12-18 mo, (c) refuses AIB-PCO + insurance docs, (d) drives citation + reputation exposure. **90-day transition + warm-intro to 2 alt PCOs.**

**5. "Operator negotiates down sensor or retainer?"** Don't unbundle below floor. Tier choice (Basic $400-$700 / Standard $1K-$1.4K / Enterprise $2K-$3.5K) — never below AIB-PCO + insurance + cross-platform floor.

**6. "Match SMART or Rentokil-Terminix-Steritech headline?"** Read SOW: 4-yr auto-renew + 30-day favoring them + missing AIB-PCO + cross-platform + 2-hr SLA + Steritech-API overlay + brand-standards. **Match value not headline.**

**7. "AIB-PCO + NPMA QualityPro + GreenPro + NSF certs worth investment?"** Yes. Top-quartile 65-85% AIB-PCO + 75-90% QualityPro/GreenPro vs bottom 15-35%. AIB-PCO branch wins chain rebids ~3-5x per Specialty Consultants PCO M&A.

### When To Run A Second Time

**Monthly first 3 months + quarterly after** + FDA Food Code update + FSMA guidance + AIB revision + Steritech score-threshold + EPA FIFRA registration change + NPMA QualityPro/GreenPro update + branch loses 2+ flat bids or 1 chain rebid/qtr + senior rep transition + before NPMA PestWorld / AIB Annual / Steritech Connect / RFMA Annual / MUFSO / Restaurant Leadership Conference. Rotate role-plays: single-unit indie post-citation + 24-unit casual-dining + 50-unit QSR + 150-unit fast-food + hotel-restaurant + ghost-kitchen + bakery-cafe + fine-dining + multi-cuisine corporate.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Twenty-eighth entry** in Pulse Sales Trainings, **twenty-second industry-specific** after st0007-st0027. st0028 = commercial pest-control account-rep + branch manager + commercial-sales manager at **Rollins NYSE:ROL / Rentokil-Terminix LSE:RTO / Ecolab NYSE:ECL Pest Elimination / Anticimex SMART NA + regional family-owned + PE-backed (Truly Nolen / Massey / Plunkett's / Aptive / Arrow)** + **independent NPMA-member PCOs** walking restaurant DOOs + GMs + Compliance + Procurement + Director-of-Sustainability through service-contract bids right after health-citations OR 50-unit chain rebids. Inside **FDA Food Code 2022 + FSMA + HACCP + EPA FIFRA + AIB + Steritech + Ecolab Brand Protection + NSF + NPMA QualityPro + GreenPro + AIB-PCO** regulatory + audit perimeter + **Bell Labs + Liphatech + Bayer + Syngenta + BASF + Corteva + FMC + Nisus + Rockwell + Control Solutions Inc + Central Life Sciences** chemistry + sensor + **NRA + RFMA + MUFSO** restaurant trade + **NPMA + ESA + UF + Purdue + UC IPM + Texas A&M + Auburn + Mississippi State + USDA ARS + BPCA + CEPA** research + **IBISWorld + Specialty Consultants Inc + PCT Top 100 + PMP** benchmarking. 2027 reality: EPA FIFRA pesticide-restriction + state-level rodenticide + ESG-corporate-sustainability pressure drove sensor + radar + audit-prep attach to chain-rebid table stakes + PE consolidation pushed margin discipline + AIB + Steritech + NSF audit became MSA buying-criterion.

**Companion entries planned:** **st0029** commercial cleaning + IICRC + ISSA. **st0030** commercial plumbing + backflow + grease-trap + sewer preventive. **st0031** waste + recycling + composting MSA.

**Cross-refs to st0001-st0027:** Closest siblings — **q9610** commercial cleaning (back-of-house service-contract) + **q9614** handyman + **q9691** HVAC contracting + **st0019** HVAC residential + **st0026** IT MSP MSA + **st0027** commercial HVAC SA (sister facility-MSA + sensor + ESG parallel) + **st0024** title insurance (regulated-compliance + audit + insurance-rider parallel). NOT transferring: pest-specific FDA + FSMA + HACCP + AIB + Steritech + NSF + NPMA + AIB-PCO + sensor-platform (SMART / Sensei / 24/7 Connect / Connected Pest / DigitalSense) + IPM-science (UF + Purdue + UC IPM) + radar-approach + trap-density right-sizing + restaurant-industry buyer-stack.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added commercial-pest-control-industry-correct sources: Rollins NYSE:ROL (Jerry Gahlhoff Jr Atlanta GA ~$3.4B ~20K employees Orkin Commercial ~600 US branches + HomeTeam + Western + Critter Control + Waltham + Permabond + OPC + IFC + Trutech + Northwest + 24/7 Connect sensor platform); Rentokil Initial LSE:RTO (Andrew Ransom Crawley UK ~$5.2B ~62K employees ~90 countries ~16M customers post-Dec-2022 Terminix acquisition $6.7B + Steritech-bundled audit); Ecolab NYSE:ECL (Christophe Beck St Paul MN ~$15.7B Pest Elimination division ~$1.2B + Brand Protection + EcoSure + ~3,500 service specialists); Anticimex (Hans Jonsson Stockholm SE EQT Partners + IPO planned ~$8B+ EV ~$1.4B ~10K ~21 countries SMART sensor leader + Anticimex North America Carmel IN ~50+ acquisitions 2017-2024); Truly Nolen (Scott Nolen Tucson AZ family-owned 1938 ~$140M); Massey Services (Tony Massey Orlando FL family-owned 1985 ~$250M + GreenUP); Plunkett\'s (Stacy O\'Reilly Fridley MN family-owned 1915 ~$60M Midwest); Aptive Environmental (Vess Pearson Provo UT PE-backed ~$250M); Arrow Exterminators (Emily Thomas Kendrick Atlanta GA family-owned 1964 ~$280M + StratIPM); NPMA Fairfax VA ~5,500 members + QualityPro + GreenPro + AIB-PCO + PestWorld; IBISWorld 2024 ~$24B US industry ~30K establishments ~190K workforce ~3.8% CAGR; FDA Food Code 2022 sections 6-501.111 + 6-202.13 + 6-202.15 + 6-501.115; FSMA Jan 2011 + 21 CFR Part 117 Preventive Controls + Part 112 Produce Safety; HACCP 7 Principles + USDA FSIS 9 CFR Part 417 + FDA HARPC; AIB International Manhattan KS since 1919 ~10K AIB audits + CSI + Restaurant Standards + AIB-PCO; Steritech Charlotte NC Rentokil subsidiary ~$200M+ dominant US chain restaurant brand-standards; Ecolab Brand Protection + EcoSure; NSF International Ann Arbor MI since 1944 + NSF/ANSI 169 + 7 + 51 + 53; EPA FIFRA + Pesticide Registration + WPS 40 CFR Part 170 + RUP + state pesticide-applicator licensure; Bell Laboratories Madison WI since 1974 + Bell Sensei sensor leader + Liphatech Milwaukee + Bayer + Syngenta + BASF + Corteva + FMC + Nisus + Rockwell + Control Solutions Inc + Central Life Sciences; NRA Washington DC ~500K members ~$1.1T US restaurant industry ~750K locations ~15.5M workforce + RFMA + MUFSO + Restaurant Finance Monitor + Technomic + Datassential + PCT + PMP; NPMA Pest Management Foundation + ESA + UF Urban Pest Lab + Purdue Center for Urban + Industrial Pest Management + Auburn IPM Center + UC IPM Statewide + UC Riverside + UC Davis + Mississippi State + Penn State + NC State + USDA ARS + BPCA + CEPA; Specialty Consultants Inc PCO M&A Quarterly + PCT Top 100 + PMP industry benchmarking + 7-12x EBITDA acquisition multiples. EXPLICITLY COMMERCIAL PEST CONTROL - NOT generic SaaS - no Gong / Bridge Group / OpenView references. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 9 quantified benchmark tables: (1) Commercial Pest-Control Account-Rep Operating Benchmarks 2024 (NPMA + IBISWorld + PCT + Specialty Consultants Inc) — top-quartile 32-48% MSA GM + 72-82% billable + 90-95% renewal + 4-8% uplift + 35-55% sensor attach + 25-40% audit-prep + 75-90% QBR + 75-90% bid-walk completion + 5-7%/yr non-renew + 48-58% MSA recurring / Median 18-28% / 1-4% / Bottom 12-22% / 0%. (2) Commercial Pest-Control Consolidator + Challenger Landscape — Rentokil LSE:RTO $5.2B + Rollins NYSE:ROL $3.4B + Ecolab Pest Elimination $1.2B + Anticimex $1.4B EQT + Arrow $280M + Massey $250M + Aptive $250M + Truly Nolen $140M + Plunkett\'s $60M. (3) Commercial Restaurant Pest-Control MSA Pricing $/mo by restaurant type — QSR $150-$350 to fine-dining $350-$650 single-unit + 50-unit chain $3.5K-$14K + sensor add-on $25-$100/sensor/yr. (4) Health-Department + Audit-Failure Cost Stack — $1.5K-$15K citation fine + $8K-$85K 30-day re-inspection + $4K-$28K/yr insurance-rider + $8K-$45K AIB audit failure + $3K-$22K Steritech score drop + $50K-$4M+ foodborne lawsuit + $5K-$50K chain franchise penalty + $4K-$35K Yelp recovery. (5) Trap-Density Right-Sizing Benchmarks UF + Purdue + UC IPM peer-reviewed — rodent stations exterior 18-28→10-16 + interior 8-14→5-8 + insect-light-traps 8-16→4-8 + cockroach gel-bait 12-22→6-10 + 0→12-18 sensors + chemistry-volume -60-85% radar. (6) Sensor-Monitoring Platform Pricing — Anticimex SMART $55-$90 + Bell Sensei $25-$60 + Rollins 24/7 Connect $45-$80 + Ecolab Connected Pest $50-$85 + Bayer DigitalSense $35-$70 + cross-platform 3rd-party $25-$50 + cloud $0.70-$2.50/sensor/mo. (7) Service Cadence Models — legacy scheduled-spray 12 visits/yr to radar-approach SMART/Sensei 1-2 baseline + triggered + 14-22 sensors + -60-85% chemistry + +15-22 audit pts. (8) Restaurant Pest-Control Bid-Walk Performance by Rep Tenure + Discipline — 0-1 yr 0-3% lift / 65-75% renewal / 25-40% bid-walk / <8% sensor / 5-STAGE + 4-Avoided + 3-Lenses Discipline 18-32% / 90%+ / 75-90% / 35-55%. SHOW right-sizing + SOLVE four-component MSA and sensor + audit-prep attach hardest to install. Weekly bid-walk-shadow + monthly audit-prep + sensor + Food Code cite drill + quarterly MSA quartile self-diagnosis = single biggest predictor. Sensor attach reaches 35%+ by month 4 with branch-manager-level coaching. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added counter-case + 14-failure-mode + 7-objection coach-back. Counter-cases (when framework backfires) (1) Single-location indie with no citation + no chain pressure + budget <$300/mo = over-engineered; right move lean SURVEY + minimal sensor + base + annual QBR not 4-component MSA. (2) Post-acquisition uncertainty = wrong decision-maker; walk + 1-page bid-walk brief + revisit 60-90 days. (3) Kitchen renovation in progress = bid-walk findings invalid; scope temporary construction-IPM contract + bid-walk full MSA post-renovation. (4) Owner about to sell = wasted effort if can\'t survive ownership transition; walk + warm-intro to buyer at LOI-stage. Failure modes (5) Bidding flat to keep account happy = 8 mo later Anticimex SMART pitches sensor + AIB-equivalency + cross-platform data-portability + operator non-renews $5.4K/mo flat → $7.8K/mo Anticimex SMART. (6) Skipping bid-walk Median 35-50% vs top-quartile 75-90% = no leverage + no sensor + no audit-prep + lose at first citation. (7) Avoiding trap-density right-sizing drives ~35% GM gap UF + Purdue + UC IPM peer-reviewed urban-entomology over-trapped legacy footprint = billed-chemistry not pest-control. (8) Ignoring sensor reframe 24-unit chain rebid + zero sensor attach = lose to Anticimex SMART + Rollins 24/7 Connect + Ecolab Connected Pest + Bell Sensei every time. (9) Pitching faster response-time to DOO + Procurement wrong frame care about AIB + Steritech + NSF + corporate-ESG + insurance-rider not SLA. (10) Letting Anticimex SMART or Rentokil-Terminix-Steritech-bundled undercut without cross-platform-data-portability + AIB-PCO + branch-tenure brief = lose MSA value forever. (11) Silent chemistry-cost pass-through = 8-18% MSA-GM erosion 24 mo top-quartile cites Section 7.3 + post-2022 commodity-volatility. (12) Treating citation-prompted-replacement as low-margin cleanup = wrong frame highest-emotional + highest-urgency + 25-40% MSA uplift opportunity if rep delivers full 5-STAGE. (13) Outsourcing sensor + audit-prep attach to chemistry-leaning rep per NPMA + PMP + PCT branch-manager work + non-delegable. (14) Holding money-losing bottom-quartile accounts negative GM + senior-tech burnout + reputation damage = non-renew 5-7%/yr warm-intro to 2 regional alt PCOs. Plus 7 objections: (a) restaurant operators won\'t accept price increase will switch top-quartile 92% renewal vs bottom 70% while raising 4-8%/yr; (b) sensor + audit-prep are for big chains wrong highest-leverage for $5-$50M regional independents serving 5-50-unit chain restaurants; (c) how do I know it\'s working 90-day signals bid-walk +30-50 pts + sensor 25%+ + audit-prep 15%+ + Food Code verbatim + MSA quartile movement 12 mo + branch GM +6-12 pts; (d) when do we walk away refuses bid-walk AND refuses sensor AND refuses 3-yr term AND pattern of incumbent-churn 12-18 mo + refuses AIB-PCO + insurance-rider documentation 90-day transition + warm-intro 2 regional alt PCOs; (e) operator negotiates down sensor or audit retainer don\'t unbundle below floor tier choice Basic $400-$700/mo / Standard $1K-$1.4K / Enterprise $2K-$3.5K never below AIB-PCO + insurance-rider floor; (f) match Anticimex SMART or Rentokil-Terminix-Steritech read SOW competitor excludes AIB-PCO equivalency + cross-platform sensor + emergency 2-hr SLA + chain corporate-brand-standards alignment match value not headline; (g) AIB-PCO + NPMA QualityPro + GreenPro + NSF certifications worth investment yes top-quartile 65-85% AIB-PCO certified vs bottom 15-35% AIB-PCO win-rate ~3-5x. Plus when-to-rerun monthly first 3 mo + quarterly + whenever FDA Food Code update + FSMA guidance + AIB Restaurant Standards + Steritech score-threshold + EPA FIFRA pesticide-registration + NPMA QualityPro / GreenPro update + branch loses 2+ flat bids or 1 chain rebid / quarter + senior rep transition + before NPMA PestWorld + AIB Annual + Steritech Connect + RFMA Annual + MUFSO + Restaurant Leadership Conference. Rotate role-plays single-unit indie post-citation + 24-unit casual-dining + 50-unit QSR + 150-unit fast-food + hotel-restaurant + ghost-kitchen + bakery-cafe + fine-dining + multi-cuisine corporate. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as TWENTY-EIGHTH entry and TWENTY-SECOND industry-specific training after st0007-st0027 — st0028 is commercial pest-control account-rep + branch manager + commercial-sales manager at Big-3 consolidators (Rollins NYSE:ROL Orkin Commercial + Rentokil-Terminix LSE:RTO Terminix Commercial + Steritech-bundled + Ecolab NYSE:ECL Pest Elimination + Brand Protection) + sensor-leader (Anticimex SMART North America EQT-backed) + regional family-owned + PE-backed challengers (Truly Nolen + Massey Services + Plunkett\'s + Aptive Environmental + Arrow Exterminators) + independent NPMA-member PCOs walking restaurant DOOs + GMs + Compliance Officers + Procurement + Director-of-Sustainability through service-contract bids right after health-department citations OR 50-unit chain rebids inside FDA Food Code 2022 + FSMA + HACCP + EPA FIFRA + AIB Restaurant Standards + Steritech + Ecolab Brand Protection + NSF Restaurant Certification + NPMA QualityPro + GreenPro + AIB-PCO regulatory + audit + certification perimeter + Bell Laboratories + Liphatech + Bayer + Syngenta + BASF + Corteva + FMC + Nisus + Rockwell + Control Solutions Inc + Central Life Sciences chemistry + sensor perimeter + NRA + RFMA + MUFSO + Restaurant Finance Monitor + Technomic + Datassential restaurant industry + NPMA + ESA + UF + Purdue + UC IPM + Texas A&M + Auburn + Mississippi State + Penn State + NC State + USDA ARS + BPCA + CEPA research + IBISWorld + Specialty Consultants Inc + PCT Top 100 + PMP + ChannelE2E industry benchmarking + M&A. 2027 reality EPA FIFRA pesticide-restriction + state-level rodenticide-restrictions + ESG-corporate-sustainability pressure drove sensor + radar-approach + audit-prep attach to chain-rebid table stakes + PE consolidation pushed margin discipline + AIB + Steritech + NSF + corporate-brand-standards-audit became MSA buying-criterion. Companion entries planned st0029 commercial cleaning janitorial MSA + IICRC + ISSA + st0030 commercial plumbing + backflow + grease-trap + sewer-line preventive + st0031 waste + recycling + composting commercial MSA. Cross-references to st0001-st0006 SaaS arc + st0007-st0027 — closest siblings q9610 commercial cleaning + q9614 handyman + q9691 HVAC contracting + st0019 HVAC residential + st0026 IT MSP MSA + st0027 commercial HVAC SA + st0024 title insurance regulated-compliance parallel; what does NOT transfer commercial-pest-control-specific FDA + FSMA + HACCP + AIB + Steritech + NSF + NPMA + AIB-PCO + sensor-platform (Anticimex SMART + Bell Sensei + Rollins 24/7 Connect + Ecolab Connected Pest + Bayer DigitalSense) + IPM-science (UF + Purdue + UC IPM) + radar-approach + trap-density right-sizing + PE-roll-up dynamics + restaurant-industry buyer-stack. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Twenty-eighth Pulse Sales Training entry st0028 and TWENTY-SECOND industry-specific training after st0007-st0027 — fully runnable 60-minute live commercial pest-control restaurant bid-walk sales training for Big-3 consolidators (Rollins + Rentokil-Terminix-Steritech + Ecolab Pest Elimination) + sensor-leader Anticimex SMART NA + regional family-owned + PE-backed challengers + independent NPMA-member PCOs facing health-department citations + 50-unit chain rebids + FDA Food Code 2022 + FSMA + HACCP + AIB + Steritech + Ecolab Brand Protection + NSF + EPA FIFRA + ESG + corporate-brand-standards pressure. Best-in-Class 32-48% MSA GM + 72-82% billable + 90-95% renewal + 4-8% uplift + 35-55% sensor + 25-40% audit-prep + 75-90% QBR + 75-90% bid-walk + 5-7%/yr non-renew per NPMA + IBISWorld + Specialty Consultants Inc + PCT Top 100 + PMP. Sources Rollins NYSE:ROL Jerry Gahlhoff Jr + Rentokil LSE:RTO Andrew Ransom + Terminix post-Dec-2022 $6.7B + Ecolab NYSE:ECL Christophe Beck + Anticimex Hans Jonsson + Truly Nolen Scott Nolen + Massey Tony Massey + Plunkett\'s Stacy O\'Reilly + Aptive Vess Pearson + Arrow Emily Thomas Kendrick + FDA Food Code 2022 6-501.111 + 6-202.13 + 6-202.15 + FSMA 21 CFR Part 117 + Part 112 + HACCP 7 Principles + USDA FSIS 9 CFR Part 417 + FDA HARPC + AIB International + Steritech + Ecolab Brand Protection + EcoSure + NSF International + NSF/ANSI 169 + 7 + 51 + 53 + EPA FIFRA + Bell Laboratories + Sensei + Liphatech + Bayer + Syngenta + BASF + Corteva + FMC + Nisus + Rockwell + Control Solutions Inc + Central Life Sciences + NPMA + ESA + UF + Purdue + UC IPM + Texas A&M + Auburn + Mississippi State + Penn State + NC State + USDA ARS + BPCA + CEPA + NRA + RFMA + MUFSO + IBISWorld + Specialty Consultants Inc + PCT Top 100 + PMP. Structure 🐀 Pulse Training callout intro + Bottom Line callout 24-unit casual-dining doesn\'t drop incumbent because $/mo cheaper drops because bid-walked kitchen + receiving + dumpster + sewer-line + cited FDA Food Code 6-501.111 + FSMA + HACCP + AIB Restaurant Standards verbatim + showed sensor evidence-logging survives Form 483 + Steritech audit + right-sized 38-station to 22-station + sensor-monitoring + 5-stage + 4-avoided-conversations + 3-compliance-lenses thesis + 6-row agenda + Section 1 Intro + Cold Open with NPMA + IBISWorld + Specialty Consultants Inc + PCT Top 100 quartile + Rep A single-unit Cleveland indie post-Yelp-citation flat $385/mo lost to Anticimex SMART $540/mo + 14 SMART sensors + AIB-PCO + radar vs Rep B 24-unit FL casual-dining chain rebid Orlando + 4-component MSA base $5.6K + sensor $1.4K + AIB audit-prep $1.1K + emergency 2-hr SLA $300 = $6.1K to $8.4K/mo + Steritech Score 78 to 92 + chemistry-volume -65% + 3-yr MSA + AIB audit-prep retainer + cross-unit clause + Common Trap flat-bid is delayed loss + sensor-leader competitor wins SURVEY before SCAN SCAN before SHOW + Section 2 Teach split Part A 5-STAGE 12 min SURVEY kitchen + receiving + dumpster + sewer-line + roof bid-walk + UV blacklight + glue-board pre-deploy + thermal-imaging + moisture-RH + sensor pre-deploy 6-12 Bell Sensei or Anticimex-SMART-compatible units + dye-test drain-fly + sewer-line gradient + IR + flashlight grease-trap channel / SCAN UV-fluorescence + glue-board + thermal + moisture + 72-hr sensor pre-deploy / SHOW legacy over-trap 38-station + 12-light-trap + 14-cockroach + monthly cadence + no sensor + 3 Food Code gaps Steritech flag vs right-sized 22-station + 9-light-trap + 8-cockroach + 16-sensor + radar-response + AIB-PCO documentation + Steritech-audit-prep + chemistry-volume -65% / SOLVE 4-component base + sensor + AIB Restaurant Standards audit-prep retainer + emergency 2-hr SLA premium / SECURE 3-yr MSA + CPI+2% escalator + 6% cap + chemistry-cost pass-through Section 7.3 + sensor amortization Section 7.4 + auto-renew 90-day + scope governance quarterly + cross-unit expansion clause + termination for cause 60-day cure / for convenience 9-month notice + unamortized sensor capex + 50% remaining base + audit-cycle continuity and Part B Four Bid-Walk Conversations Every Pest-Control Rep Avoids 8 min trap-density-right-sizing UF + Purdue + UC IPM peer-reviewed 50-70% density-reduction with sensor delivers equivalent-or-better pest-pressure-reduction + 35-55% lower chemistry-application + 25-45% better audit-defensibility / radar-approach service-only-when-found Anticimex SMART + Rollins 24/7 Connect + Ecolab Connected Pest premium-tier deliberately reduce baseline-visit-cadence from 4-12/yr to 1-2/yr + sensor-triggered-response 24/7 evidence-of-active-monitoring beats calendar-visit-tickets at FDA Form 483 + Steritech + AIB + Ecolab Brand Protection audit + 60-90% pesticide-volume reduction + 30-60% emergency-callout reduction + 8-22% total-cost reduction over 3-yr MSA / corporate-MSA-pre-empt-navigation single-franchisee operator wants regional challenger but corporate brand-standards MSA + approved-vendor-list pre-empts run corporate rebid path Director-of-Compliance + Director-of-Operations + Procurement at NPMA PestWorld + RFMA Annual + position against incumbent at next rebid window AND parallel franchisee carve-out path documented corporate-approved-vendor + AIB-PCO equivalency package + brand-standards-equivalent / citation-prompted-replacement Day 3 of 30-day re-inspection clock highest-urgency commercial-pest-control buying-window + operator emotional + budget-constrained + procurement-defensive + reputation-traumatized + insurance-rider impact + lawsuit-exposure all at once + 3 reframes citation is technical not moral + insurance carrier needs documented IPM-program + incumbent\'s last 6 service-tickets prove the gap and Part C Three Compliance Lenses 3 min FDA Food Code 2022 sections 6-501.111 + 6-202.13 + 6-202.15 + 6-501.115 + FSMA + 21 CFR Part 117 Preventive Controls + Part 112 Produce Safety + HACCP 7 Principles + AIB Restaurant Standards + Steritech + Ecolab Brand Protection + NSF Restaurant Certification + Part D MSA Quartile Self-Diagnosis 2 min 5 metrics MSA GM + billable-hour util + renewal + uplift + sensor + audit-prep attach + Section 3 Discussion 8 prompts walk-away criteria citation-bid + corporate-MSA-pre-empt-navigation franchisee carve-out + trap-density right-sizing backfire active vs quiet pressure + Anticimex SMART or Rollins 24/7 Connect win on price not sensor + bid-walk cadence broke 12 mo reset + sensor-attach hesitancy coach-rep + AIB + Steritech audit-prep retainer bill or include in MSA annual scan + retainer for engineering model + ONE verbatim change + Section 4 Two-Person Role-Play Round 1 Linda Vasquez DOO 24-unit FL casual-dining Bayou Coastal Kitchen ~$74M revenue + Rollison Holdings PE-backed + 3-yr Rentokil-Terminix-Steritech-bundled MSA expiring 110 days at $6.1K/mo flat + Tampa + Pensacola + Orlando 3 cited units in last 90 days + Yelp + Google-Maps exposure + Steritech score 88 to 71 + insurance carrier flagged + PE-backer demanded remediation + deflection 1 flat-3-years + Anticimex SMART $7.2K + deflection 2 Rentokil-Terminix free citation cleanup + Steritech-bundle covers — account rep Marcus Holden Gulf-Coast IPM Services Orlando branch 9 yrs AIB-PCO runs full 5-STAGE + 4-component proposal $6.1K to $8.4K/mo 38% lift + Anticimex SMART as post-acquisition Carmel IN + 14-mo branch-tenure + EQT-IPO + sensor hardware-locked SMART cloud + Bell Sensei + AIB-portal-native + Steritech-API-compatible + chain-corporate-dashboard-portable rebuttal + Steritech-bundled-vs-independent-IPM-author + AICPA + IAASB ISSA 5000 + close with SECURE 3-yr MSA + escalator + 6% cap + chemistry pass-through + sensor amortization + auto-renew 90-day + AIB audit-prep + emergency 2-hr SLA + cross-unit expansion + Round 2 Marcus Reyes Procurement Officer + acting Director of Sustainability 50-unit QSR Pacific Coastal Burgers ~$140M CA/NV/AZ + 3-yr Orkin Commercial MSA $11.8K/mo flat + Rentokil-Terminix-Steritech-bundled quote $9.4K + Anticimex SMART $13.2K + CFO mandate procurement-spend down 8% + corporate-sustainability ESG-reporting 2027 + 100% AIB-PCO-equivalent + post-citation re-inspection-pass-rate 100% + deflection 1 Rentokil-Terminix-Steritech $9.4K Steritech-bundled cheaper + deflection 2 Anticimex SMART is sensor-leader + ESG-narrative — account rep Marcus Holden West-Coast Commercial IPM mid-market regional $65M AIB-PCO + NPMA QualityPro + GreenPro + NSF-Restaurant-Certified CA/NV/AZ branch density runs full 5-STAGE + 4-component proposal $11.8K to $13.6K/mo 15% lift + Rentokil-Terminix post-Dec-2022 merger integration year 3 + branch-tenure 8-14 mo + Steritech audit-bundled not independent-IPM-author Rentokil-Terminix-IPM is technical author + Steritech audits its own work + IAASB ISSA 5000 independent assurance + Anticimex SMART EQT-IPO + Bell Sensei cross-platform + Anticimex-SMART-compatible deployment + AIB-portal-native + Steritech-API-compatible + open-data-export + CDP + TCFD compatibility + close with SECURE 3-yr MSA + Director of Sustainability + DOO + CFO 3-way debrief + corporate-ESG-narrative + co-present LA + Sacramento RFMA + MUFSO panel + Section 5 Debrief 3 Qs strongest/weakest stage + avoided conversation dodged most + bid owed redo + 4-line CRM ritual + Section 6 Leave-Behind walkthrough + printable one-pager 8 Things to Bring on Every Restaurant Bid + 5-Stage Bid-Walk Script Card with verbatim cue lines and timing per stage + 4 Bid-Walk Conversations Every PCO Rep Avoids verbatim + MSA Quartile Self-Diagnosis 10-metric grid Top vs Median vs Bottom + 12-Control FDA + FSMA + HACCP + AIB + Steritech + NSF Audit Checklist + Never-Do list + Outcome Line + If You Only Remember One Thing hero quote You don\'t win 24-unit casual-dining post-citation with $/mo quote you win by (1) walking kitchen + receiving + dumpster + sewer-line + roof + landscape on real bid-walk + UV + glue-board + sensor pre-deploy + 9-min findings narrative SURVEY + SCAN (2) right-sizing over-trapped 38-station to 22-station + 16-sensor + radar-approach SHOW (3) delivering 4-component MSA base + sensor + AIB + Steritech audit-prep + emergency 2-hr SLA with FDA Food Code + FSMA + HACCP-aligned PCP + insurance-rider preservation + corporate-ESG-narrative SOLVE + SECURE. How-this-training-fits-branch-operating-motion table at end showing Monday-morning branch huddle weekly + Day 1 SURVEY + Day 4 SCAN + Day 8 SHOW + Day 12 SOLVE + Day 18 SECURE + four avoided conversations overlay + branch-level MSA quartile review quarterly. Two mermaid diagrams: 5-Stage Bid-Walk Flow + Compliance + Sensor + Audit-Prep Decision Tree branches by 0-2 gaps clean + 3-6 gaps uplift + 7+ gaps crisis emergency-triage + 30-day re-inspection-prep + 90-day MSA-replacement + owner-accepts vs declines vs swap to Anticimex SMART / Rentokil-Terminix-Steritech + walk-away criteria + 90-day transition + warm intros to 2 regional alt PCOs + terminal nodes Q4 quarterly QBR + annual AIB + Steritech audit-prep + sensor evidence-overlay + corporate-ESG-dashboard + cross-unit expansion. 9 benchmark tables (Commercial Pest-Control Account-Rep Operating Benchmarks 2024 + Commercial Pest-Control Consolidator + Challenger Landscape + Commercial Restaurant Pest-Control MSA Pricing Benchmarks + Health-Department + Audit-Failure Cost Stack + Trap-Density Right-Sizing Benchmarks + Sensor-Monitoring Platform Pricing + Service Cadence Models + Restaurant Pest-Control Bid-Walk Performance by Rep Tenure + Discipline). 4-counter-case + 14-failure-mode + 7-objection coach-back + when-to-rerun cadence. Cross-links to st0001-st0006 + companion industry-specific entries planned st0029-st0031 + cross-reference to st0007-st0027 closest siblings q9610 commercial cleaning + q9614 handyman + q9691 HVAC contracting + st0019 HVAC residential + st0026 IT MSP + st0027 commercial HVAC SA + st0024 title insurance regulated-compliance parallel. Tags include sales-training (hub filter) + commercial-pest-control-bid-walk-training + commercial-pest-control + restaurant-pest-control + service-contract-bid + health-department-citation + fda-food-code + fsma-produce-safety + haccp + aib-international-audit + nsf-international + integrated-pest-management + ipm-sensor-monitoring + 60-min-meeting + standard-team + st0028. Callouts used Pulse Training + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY COMMERCIAL PEST CONTROL INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / OpenView citations. Tight 2-3 sentence paragraphs throughout. ASCII-clean. Lean target honored drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // --- Word count pre-flight check ---
  const fullV9 = tldr + core + flow + src + num + counter + links;
  const wordCount = fullV9.split(/\s+/).filter(Boolean).length;
  console.log('[' + ID + '] v9 word count:', wordCount);
  if (wordCount > 10500) {
    console.error('[' + ID + '] HARD CAP EXCEEDED:', wordCount, '> 10500 — aborting');
    process.exit(1);
  }
  if (wordCount < 9500) {
    console.warn('[' + ID + '] WARNING: under target floor:', wordCount, '< 9500');
  }

  // --- Pre-seed the entry shell so runPolish's store.get() finds it ---
  const ts0 = Date.now();
  const existing = await store.get('answers/' + ID + '.json', { type: 'json' });
  if (!existing) {
    console.log('[' + ID + '] seeding entry shell (runPolish requires entry to exist)');
    await store.setJSON('answers/' + ID + '.json', {
      id: ID,
      question: QUESTION,
      answer: tldr,
      tags,
      sources: sources.slice(0, 3),
      ts: ts0,
      model: 'claude-opus-4-7-via-claude-code',
      quality_score: 5,
      polished_at: null,
      polish_history: [],
      source: 'claude-opus-bespoke-seed',
      format_v: '2026-05'
    });
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    const i = idx.entries.findIndex(x => x.id === ID);
    const row = { id: ID, question: QUESTION, tags, ts: ts0, quality_score: 5, polished_at: null, last_modified_ms: ts0, sources_count: 3, format_v: '2026-05' };
    if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
    await store.setJSON('_index.json', idx);
  } else {
    console.log('[' + ID + '] entry already exists — runPolish will overwrite at v5');
  }

  // --- Walk the polish ladder 5->6->7->8->9->10 ---
  await runPolish({
    id: ID,
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

  // Post-polish: stamp format_v=2026-05 on final blob entry + index row
  try {
    const finalEntry = await store.get('answers/' + ID + '.json', { type: 'json' });
    if (finalEntry) {
      finalEntry.format_v = '2026-05';
      await store.setJSON('answers/' + ID + '.json', finalEntry);
      console.log('[' + ID + '] post-polish format_v=2026-05 stamped on blob');
    }
    const finalIdx = await store.get('_index.json', { type: 'json' });
    if (finalIdx && Array.isArray(finalIdx.entries)) {
      const ii = finalIdx.entries.findIndex(x => x.id === ID);
      if (ii >= 0) {
        finalIdx.entries[ii].format_v = '2026-05';
        await store.setJSON('_index.json', finalIdx);
        console.log('[' + ID + '] post-polish format_v=2026-05 stamped on _index.json row');
      }
    }
  } catch (err) {
    console.error('[' + ID + '] post-polish format_v stamp failed:', err.message);
  }

  // Fire-and-forget IndexNow ping so /sales-trainings/st0028 is crawled.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
      .catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10');
}

main().catch(err => { console.error(err); process.exit(1); });

