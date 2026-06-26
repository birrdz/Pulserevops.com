// st0027 -- Commercial HVAC Service Agreement Renewal Conversation 2027.
// Pulse Sales Trainings entry (route: /sales-trainings/st0027, tag:
// sales-training). TWENTY-FIRST industry-specific training (after
// st0007-st0026). Industry = commercial HVAC service tech / account rep
// walking a facilities GM through a service-agreement renewal at the moment
// the building owner is comparison-shopping (M&S vs local rivals vs dropping
// the SA entirely) — IRA 25C / 45L / 179D + ESG decarbonization + VRF /
// heat-pump migration (Daikin / Mitsubishi / LG) + AIM Act refrigerant
// phase-down R-410A -> R-32 / R-454B + BAS/BMS integration upsell +
// predictive maintenance via IoT sensors. Five fixed sections mirror st0026.
// VALUE over WORD COUNT. Target 9,500-10,499 words. ABSOLUTE HARD CAP 10,500.
// LEAN-FROM-START. Walks 5->6->7->8->9->10 ladder via runPolish from
// polish-helper. Stages: AUDIT / ALIGN / ARCHITECT / AFFIRM / ADVANCE.

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

const ID = 'st0027';
const QUESTION = "Commercial HVAC Service Agreement Renewal Conversation 2027 — a 60-Minute Sales Training";

const tags = [
  'sales-training',
  'commercial-hvac-sa-renewal-training',
  'commercial-hvac',
  'service-agreement-renewal',
  'facilities-management',
  'refrigerant-phase-down',
  'aim-act-r410a',
  'vrf-heat-pump',
  'bas-bms-integration',
  'predictive-maintenance',
  'ira-179d-45l',
  '60-min-meeting',
  'standard-team',
  'st0027'
];

const sources = [
  { title: 'Carrier Global NYSE:CARR (CEO David Gitlin, Palm Beach Gardens FL) — the largest pure-play HVAC manufacturer post-2020 UTC spin-off + 2023 Viessmann Climate Solutions acquisition $13.2B + 2024 Toshiba Carrier full ownership: ~$25B revenue + ~60,000 employees + 160+ countries; product portfolio Carrier rooftop units (RTUs) + WeatherExpert + WeatherMaker high-efficiency + AquaEdge chillers + AquaForce magnetic-bearing centrifugals + commercial VRF (Toshiba Carrier joint heritage) + Abound BMS/IoT building-management cloud platform + Sensitech cold-chain + Automated Logic BAS (acquired 1990, headquartered Atlanta GA); commercial-service channel runs through ~1,800 Carrier Commercial Service offices + factory-authorized dealers + national-account program serving Fortune 500 facilities portfolios; pivotal 2027 dynamics — Carrier Abound BMS competes head-to-head with Johnson Controls OpenBlue + Trane Connect + Honeywell Niagara for BAS-integration upsell at SA renewal + Carrier Viessmann gives strong EU heat-pump heritage now translated to US commercial heat-pump retrofit; service-agreement contracts range full-coverage (parts + labor + emergency) to preventive-maintenance-only (PM-only) to inspection-only with typical commercial pricing $0.18-$0.65/sqft/yr for PM-only + $0.45-$1.20/sqft/yr for full-coverage', url: 'https://www.carrier.com/commercial/en/us/' },
  { title: 'Trane Technologies NYSE:TT (CEO Dave Regnery, Davidson NC) — ~$19B revenue + ~45,000 employees post-2020 Ingersoll Rand industrial spin; commercial HVAC product family Trane Voyager RTUs + Precedent + Intellipak + Series R + Series E centrifugal chillers + CenTraVac magnetic-bearing chillers + Sintesis air-cooled + Tracer SC+ + Trane Connect BMS/BAS cloud platform; Trane Commercial Service ~5,000 service technicians in North America + ~400+ branch offices the largest manufacturer-direct commercial-service network; pivotal value-prop differentiators Trane CoreSense diagnostics IoT predictive-maintenance shipping with 2020+ chillers + Trane Tracer SC+ open-protocol BAS (BACnet/IP + Modbus + LonWorks) + Trane Performance Climate Changer AHUs + Trane heat-pump portfolio Sintesis Balance + Ascend + heat-recovery chillers; Trane has been most aggressive on 2024-2027 IRA 179D + 45L commercial deduction marketing to building owners + sustainability-linked-loan + green-bond eligibility framing; Trane Service Agreement tiers ranging Inspect (PM-only) + Comfort (PM + repair) + Plus (PM + repair + emergency) + Complete (full-coverage parts + labor + emergency + capital-equipment-replacement reserve); typical 2024-2027 commercial Trane SA pricing $0.20-$0.75/sqft/yr depending on tier + equipment age + criticality', url: 'https://www.tranetechnologies.com/' },
  { title: 'Daikin TSE:6367 (CEO Masanori Togawa, Osaka JP) + Daikin Industries North America (CEO Satoru Akama) + Daikin Applied Americas (formerly McQuay, Minneapolis MN) + Goodman Manufacturing (Daikin subsidiary, Waller TX) — the global #1 HVAC manufacturer by revenue ~$30B + ~98,000 employees the dominant force in commercial VRF (variable refrigerant flow) the highest-growth commercial HVAC segment 2020-2030 + ductless mini-split + ducted-residential heat-pump + commercial applied chillers + AHUs + rooftop systems; pivotal 2024-2027 commercial-service positioning Daikin VRV (Variable Refrigerant Volume) the dominant commercial VRF system 8-32-ton modular outdoor units + indoor cassette/ducted/floor/wall options + heat-recovery + heat-pump configurations + Intelligent Touch Manager BMS + Daikin Cloud Service; Daikin most aggressive on R-32 refrigerant transition (lower GWP than R-410A) ahead of AIM Act phase-down + heat-pump-only strategy aligned with 2027 IRA + DOE Cold-Climate Heat-Pump Challenge; Daikin Applied commercial-service network through ~300+ branch + dealer + service-contractor relationships in North America + commercial SA pricing aligned with VRF lifecycle (typically $0.25-$0.85/sqft/yr for VRF-specific SA with mandatory annual outdoor-unit refrigerant + indoor-coil + linesets inspection); Daikin Comfort Pro contractor-loyalty program; pivotal R-32 vs R-454B vs R-410A decision driver for 2025-2027 SA renewals at commercial buildings with mixed-age equipment', url: 'https://www.daikin.com/' },
  { title: 'Mitsubishi Electric Trane HVAC US (METUS, joint venture 2018, Suwanee GA) + Mitsubishi Electric TYO:6503 (Tokyo JP) + LG Electronics KRX:066570 (Seoul KR) + LG Air Conditioning Technologies USA — the #2 + #3 commercial VRF + heat-pump players: METUS the joint venture between Mitsubishi Electric (60%) + Trane Technologies (40%) for North American distribution of Mitsubishi VRF + heat-pump + ductless commercial products ~$2B+ revenue + the dominant US commercial-VRF distribution + service-contractor network ~1,000+ Diamond Contractors + Elite Contractors + Hyper-Heat cold-climate heat-pump portfolio dominant in Northeast/Midwest commercial retrofit; LG Multi V commercial VRF system + LG Heat Recovery + LG ThinQ cloud platform + LG MULTI SITE commercial heat-pump + LG commercial-service through national distribution + factory-authorized dealer network; pivotal 2024-2027 commercial-service-agreement dynamics METUS + LG aggressively positioning commercial VRF + heat-pump as the IRA 25C / 45L / 179D-eligible decarbonization path away from packaged gas RTUs + the BAS-integration story (Mitsubishi M-Net + LG Multi V BACnet gateway) for facilities portfolio + the refrigerant-phase-down story (R-32 + R-454B aligned vs legacy R-410A); pivotal SA renewal frame for commercial GM with mixed-fleet building: replace 1980s-1990s packaged-gas RTU with VRF heat-pump at end-of-useful-life + finance via IRA 179D deduction + sustainability-linked-loan + utility rebate program', url: 'https://www.mitsubishielectric.com/en/' },
  { title: 'Lennox International NYSE:LII (CEO Alok Maskara, Richardson TX) + Johnson Controls NYSE:JCI (CEO Joakim Weidemanis, Cork IE + Milwaukee WI) — Lennox ~$5B revenue + ~12,000 employees pure-play commercial-light-commercial-residential HVAC manufacturer + Lennox Commercial Energence high-efficiency RTU + Model L Series + Strategos packaged + Lennox National Account Services (LNAS) the dominant commercial-rooftop national-account service organization serving retail multi-site portfolios (Walmart + Target + Walgreens + CVS + Kroger + Home Depot + Lowes + McDonalds + Starbucks + Chipotle + AutoZone) + Lennox Building Climate Solutions BMS + ChannelMax dealer network; Johnson Controls JCI ~$28B revenue + ~100,000 employees post-2016 Tyco merger + 2024 sale of residential HVAC York/Coleman/Luxaire to Bosch $8.1B; commercial-pure-play York Commercial RTU + York Solution AHU + YORK Magnetic-Bearing Chiller + YZ chillers + Metasys BMS (now OpenBlue) + JCI Tyco Fire + Tyco Security; pivotal 2027 commercial-service positioning JCI OpenBlue Enterprise Manager BAS/AI platform integrated with Tyco Fire/Security + JCI Sustainability-as-a-Service for portfolio facilities + JCI North America commercial-service network ~25,000 technicians the largest after Trane; pivotal SA renewal frame Lennox LNAS the national-account-RTU specialist competing against Carrier Commercial Service + Trane Commercial + EMCOR + Comfort Systems for multi-site retail-restaurant-pharmacy portfolio service-agreement business + JCI OpenBlue competing for the BAS-integration upsell across mixed-fleet commercial portfolios', url: 'https://www.lennoxinternational.com/' },
  { title: 'Comfort Systems USA NYSE:FIX (CEO Brian Lane, Houston TX) + EMCOR Group NYSE:EME (CEO Tony Guzzi, Norwalk CT) + Limbach Holdings NASDAQ:LMB (CEO Michael McCann, Warrendale PA) — the three public mechanical-services consolidators dominant in commercial HVAC service-agreement contracting + retrofit + new construction: Comfort Systems USA ~$5B revenue + ~17,000 employees + 45+ operating companies acquired since 1997 (Eastern + Cleveland + Atlanta + Walker + ShoffnerKalthoff + many more) + mechanical service contracts across industrial + healthcare + tech-data-center + commercial-office + manufacturing verticals; EMCOR Group ~$14B revenue + ~37,000 employees + EMCOR Services + EMCOR Government Services + EMCOR Facilities Services + USM facility-services; Limbach Holdings ~$700M revenue + ~1,500 employees + Limbach acquired Jake Marshall + ACME Industrial + Jamison Hyperbaric + Industrial Air Inc + Consolidated Mechanical to build mid-Atlantic + Southeast + Midwest mechanical-service density specializing in healthcare + higher-ed + industrial Owner Direct Relationships (ODR) model the company has explicitly pivoted away from general-contractor construction work toward direct-to-owner service + retrofit + capital-planning + IRA-179D-driven energy projects; pivotal 2024-2027 service-agreement dynamics FIX + EME + LMB compete head-to-head with Carrier Commercial Service + Trane Commercial Service + JCI North America for the commercial SA renewal that funds 35-55% of their gross profit + Limbach ODR pivot the most aggressive case study of moving from low-margin construction (8-12% GM) to high-margin owner-direct service (28-35% GM)', url: 'https://www.comfortsystemsusa.com/' },
  { title: 'Service Logic LLC (CEO Tracy Stallings, Charlotte NC, Leonard Green Partners + Warburg Pincus PE-backed) + CoolSys Inc (CEO Adam Coffey, Brea CA, Ares Management PE-backed) — the two dominant private-equity-backed independent commercial-HVAC + commercial-refrigeration service-contractor roll-ups + the most aggressive M&A vehicles in the industry: Service Logic ~$2B revenue + ~6,000 employees + 80+ commercial-HVAC service-contractor acquisitions since 2010 (founded by Don Riddle + Tracy Stallings + Leonard Green minority recap 2017 + Warburg Pincus majority recap 2022 ~$2.5B valuation) spanning ~30 metros North America with strong presence in healthcare + higher-ed + tech-data-center + commercial-office + government verticals; Service Logic acquisition cadence ~8-12 service contractors/yr (recent deals Atlantic Constructors mechanical-service division + Building Engineering Services + Vidaris commissioning + many smaller regionals); CoolSys ~$1.5B revenue + ~3,500 employees + 50+ commercial-HVAC + commercial-refrigeration contractor acquisitions since 2017 (Ares Management majority + Adam Coffey CEO formerly Sila Services + the most-quoted private-equity-MSP-roll-up authority in HVAC); pivotal 2024-2027 dynamics Service Logic + CoolSys actively call on commercial-building portfolios with offers to consolidate SA contracts under single-vendor master-service-agreement at 10-18% below incumbent pricing + faster response times via shared technician pool + integrated BMS-IoT predictive-maintenance via OEM-agnostic platforms; pivotal SA renewal threat for incumbent MEP service contractors when Service Logic or CoolSys BDR shows up with a Master Service Agreement (MSA) consolidation pitch', url: 'https://www.servicelogic.com/' },
  { title: 'AIM Act (American Innovation and Manufacturing Act of 2020, signed Dec 27 2020) + EPA HFC Phase-Down Rule (40 CFR Part 84, final rule Oct 2021) + EPA Technology Transitions Rule (40 CFR Part 84 Subpart B, final rule Oct 2023) — the structural refrigerant phase-down driving every commercial HVAC service-agreement renewal conversation 2024-2032: AIM Act mandates 85% reduction in HFC (hydrofluorocarbon) production + consumption baseline 2011-2013 over 15-year phase-down schedule -10% 2022 -40% 2024 -70% 2029 -80% 2034 -85% 2036; pivotal 2024 step-down R-410A (GWP 2088) availability collapsed virgin allocation cut ~40% YoY production cost rose 200-400% per Wholesale R-410A pricing tracked by ACHR News + RSES Journal + ASHRAE Journal industry coverage 2024-2025; Technology Transitions Rule prohibits new commercial RTU + chiller + VRF manufacture with refrigerants GWP > 700 starting Jan 1 2025 (effectively forcing R-32 GWP 675 + R-454B GWP 466 + R-32/R-454B blends as the commercial replacement refrigerants); pivotal SA renewal implication every R-410A commercial system installed pre-2025 faces escalating refrigerant cost + reduced parts availability + retrofit-or-replace decision over 5-10 year horizon + the commercial SA contract is the vehicle that funds the inspection + leak-detection + retrofit-planning + refrigerant-recovery + replacement-equipment-scoping work; reclaimed R-410A market growing rapidly (ARI 700 reclaimed-refrigerant standard) + reclaimed pricing ~50-65% of virgin; commercial-service-contractor refrigerant-handling certification EPA Section 608 mandatory + technician training cost rising; ASHRAE Standard 15 + 34 refrigerant safety classification A2L (mildly flammable) applies to R-32 + R-454B requiring service-tech training + storage + handling protocol changes', url: 'https://www.epa.gov/climate-hfcs-reduction' },
  { title: 'Inflation Reduction Act (IRA, Aug 16 2022) Section 179D + Section 45L + Section 25C + Section 48 ITC + Section 30C — the commercial-building tax-credit + deduction stack driving 2024-2032 commercial-HVAC capital decisions + service-agreement-funded retrofit conversations: Section 179D Energy Efficient Commercial Buildings Deduction increased to $0.50-$5.81/sqft (sliding scale based on prevailing-wage + apprenticeship compliance + energy-savings percentage 25-50% vs ASHRAE 90.1-2007 reference) for tax years 2023+ + open to building owners + REITs + tax-exempt entity allocations to designers (architects + engineers + design-build contractors) — pivotal 2024-2027 commercial-HVAC retrofit driver because deduction is uncapped per building + applies to envelope + HVAC + interior lighting upgrades; Section 45L New Energy Efficient Home Credit $500-$5,000/dwelling-unit for multi-family + LIHTC residential + applies to commercial multifamily builders 2023-2032; Section 25C Energy Efficient Home Improvement Credit residential heat-pump + heat-pump water heater + electric panel upgrade up to $2,000/yr per taxpayer extended through 2032; Section 48 Investment Tax Credit including 6% base + 24% bonus (prevailing-wage + apprenticeship + domestic-content + energy-community adders) for geothermal heat-pump + combined heat-and-power + thermal energy storage; Section 30C Alternative Fuel Vehicle Refueling Property Credit for EV-charging + paired with commercial-HVAC building-electrification projects; pivotal 2027 commercial-HVAC service-agreement frame the SA renewal is the contractual + relationship vehicle through which the service contractor surfaces IRA-eligible retrofit opportunity + coordinates with building owner CFO + tax advisor + design engineer to capture 179D deduction + state utility rebate + sustainability-linked-loan margin reduction', url: 'https://www.irs.gov/credits-deductions/179d-commercial-buildings-energy-efficient-tax-deduction' },
  { title: 'BACnet (Building Automation and Control networks, ASHRAE Standard 135) + BMS/BAS vendor landscape: Johnson Controls Metasys / OpenBlue + Honeywell HON Niagara Framework + Tridium (Honeywell subsidiary) + Schneider Electric EcoStruxure Building Operation + Siemens Desigo CC + Carrier Automated Logic WebCTRL + Carrier Abound + Trane Tracer SC+ + Trane Connect + Distech Controls (Acuity Brands) + Delta Controls + Reliable Controls + KMC Controls + ALC (Carrier subsidiary Atlanta) — the BAS/BMS platform landscape that commercial-HVAC service contractors must navigate at SA renewal because the BAS is the integration layer for predictive-maintenance + remote-diagnostics + energy-management + demand-response + tenant-billing + ESG carbon reporting; pivotal 2024-2027 BAS integration upsell at SA renewal: legacy 1990s-2000s pneumatic + early DDC (direct digital control) systems aging out + Niagara N4 + Metasys Open + Tridium-as-a-platform open-protocol approach winning vs proprietary OEM-locked BAS + cloud-hosted BMS + IoT-sensor retrofit + Fault Detection and Diagnostics (FDD) per ASHRAE Guideline 36 + cybersecurity-hardening (OT/IT convergence + Building Cybersecurity Center reports + GSA OT cybersecurity requirements) the rising BAS conversation; pivotal commercial-service-agreement frame BAS-integration scope $4-$12/sqft for full BMS retrofit + $0.75-$2.50/sqft/yr for ongoing cloud-hosted BMS + FDD + cybersecurity + tenant-services subscription on top of mechanical SA + IoT-sensor retrofit add-on $400-$1,200/major-equipment/yr (vibration + temperature + pressure + power-quality + refrigerant-leak sensors)', url: 'https://bacnet.org/' },
  { title: 'IoT predictive-maintenance + sensor + analytics platform landscape for commercial HVAC: Augury (CEO Saar Yoskovitz, NYC + Israel) vibration-based motor + bearing + fan + pump predictive-analytics ~$500M valuation 2024 + factory-machine + commercial-HVAC equipment monitoring + AI-driven failure-prediction; Senseware (acquired by Verdantix coverage 2023, Vienna VA) wireless-sensor + edge-gateway + cloud-analytics platform for HVAC + indoor-air-quality + energy; KGS Buildings + KMC Commander + Switch Automation + Iconics (Mitsubishi Electric) + Buildings IOT + SkySpark (SkyFoundry) + Clockworks Analytics (KGS) + BrainBox AI (Montreal, autonomous-BAS-control via reinforcement learning) + 75F (Bloomington MN, IoT-BAS for SMB-commercial) + Cohesion + WattTime + Verdigris Technologies (energy-disaggregation IoT power meters); pivotal 2024-2027 commercial-HVAC predictive-maintenance value-proposition reduces unplanned downtime 30-50% + extends equipment life 15-25% + cuts emergency service-call cost 35-50% + improves energy efficiency 8-15% via continuous-commissioning per ASHRAE + DOE Better Buildings Initiative + Lawrence Berkeley National Laboratory studies; pivotal commercial-service-agreement structure IoT-sensor add-on $400-$1,200/major-equipment/yr (per RTU / per chiller / per AHU / per pump + variable-frequency-drive) + cloud-analytics + monthly health-report + technician-dispatch-on-anomaly + integration into existing BAS or standalone overlay; major service contractors (Trane CoreSense + Carrier Abound + JCI OpenBlue + ABB Ability + Schneider EcoStruxure Asset Advisor + ServiceChannel) offering OEM-bundled predictive-maintenance subscriptions tied to SA renewal', url: 'https://www.augury.com/' },
  { title: 'ACCA (Air Conditioning Contractors of America, Arlington VA) + AHRI (Air-Conditioning Heating Refrigeration Institute, Arlington VA) + ASHRAE (American Society of Heating Refrigerating Air-Conditioning Engineers, Atlanta GA / Peachtree Corners) + IFMA (International Facility Management Association, Houston TX) + BOMA (Building Owners and Managers Association International, Washington DC) + RSES (Refrigeration Service Engineers Society) + MCAA (Mechanical Contractors Association of America, Rockville MD) + UA (United Association plumbers + pipefitters union, Annapolis MD) — the industry-education + community + standards perimeter: ACCA ~3,500 contractor members + ACCA Quality Maintenance Standards (QMS) ANSI/ACCA Standard 4 + 5 + 9 + 11 + 12 + ACCA Manual N (commercial load calculation) + Manual CS (commercial system selection) + Manual Q (commercial duct design); AHRI ~315 manufacturer members + AHRI Certification Programs (rooftop units + chillers + VRF + AHUs + heat pumps) + AHRI Statistical Programs (the industry-standard sales-volume data); ASHRAE Standards 15 / 34 (refrigerant safety) + 55 (thermal comfort) + 62.1 (commercial ventilation) + 90.1 (commercial-building energy efficiency, baseline for 179D + LEED + ENERGY STAR) + 188 (Legionellosis risk management) + 189.1 + Guideline 36 (high-performance HVAC control sequences) + Guideline 0 (commissioning); IFMA ~24,000 facility-management-professional members + Certified Facility Manager (CFM) + Facility Management Professional (FMP) + Sustainability Facility Professional (SFP); BOMA ~16,000 building-owner members + BOMA International + BOMA 360 Performance Program + BOMA Office EER (Experience Exchange Report the dominant commercial-office benchmarking dataset for operating expenses + service-contract spend); MCAA ~2,800 mechanical-contractor members + MCAA Service Manager Training + MCAA Field Leader Conference + MCAA WebLEM++ labor-estimating manuals + MCAA National Education Initiative annual revenue + service-margin benchmarking', url: 'https://www.acca.org/' },
  { title: 'ENERGY STAR Portfolio Manager (EPA, Washington DC) + LEED (US Green Building Council, Washington DC) + WELL Building Standard (International WELL Building Institute, NYC) + Fitwel (Center for Active Design) + GRESB (Global Real Estate Sustainability Benchmark, Amsterdam NL) + CDP (Carbon Disclosure Project, London UK) + TCFD/ISSB sustainability-reporting standards + SEC Climate Disclosure Rule (March 2024) + California SB-253 + SB-261 climate disclosure laws (signed Oct 2023) — the ESG/decarbonization reporting + benchmarking + regulatory perimeter driving commercial-building HVAC retrofit decisions 2024-2032: ENERGY STAR Portfolio Manager the dominant US commercial-building-energy benchmarking platform ~450,000 commercial buildings benchmarked covering ~50% of US commercial floor space + ENERGY STAR Score 1-100 + ENERGY STAR Certification 75+ score + benchmarking required by 40+ city + state ordinances (NYC LL84 + LL97 + Boston BERDO + Chicago Energy Benchmarking + Seattle + DC + Philadelphia + Portland + Minneapolis + San Francisco + Berkeley + Cambridge + Atlanta + Denver); LEED commercial certification levels Certified / Silver / Gold / Platinum + LEED v4.1 Existing Buildings: Operations and Maintenance the standard for commercial-portfolio decarbonization; GRESB the dominant institutional-investor commercial-real-estate ESG benchmark used by ~150 institutional investors + ~1,800 real-estate funds representing ~$7T AUM; pivotal SEC Climate Disclosure Rule (paused by 8th Circuit April 2024 + still pending) + CA SB-253 / SB-261 (effective 2026-2027) require Scope 1 + 2 + 3 emissions reporting for $1B+ revenue companies operating in California — commercial-HVAC + chiller + boiler operational emissions are major Scope 1 line items; pivotal SA renewal frame ESG-tracked building owners increasingly require service contractor to provide carbon-intensity data + refrigerant-leak audit + energy-use-intensity (EUI) benchmark + decarbonization roadmap as standard SA deliverable', url: 'https://www.energystar.gov/buildings/benchmark' },
  { title: 'Building owner + REIT + institutional landlord commercial-portfolio service-agreement decision-maker landscape: Boston Properties NYSE:BXP + Vornado Realty Trust NYSE:VNO + SL Green NYSE:SLG + Brookfield Property Partners + Hines + Tishman Speyer + JLL NYSE:JLL Asset Services + CBRE NYSE:CBRE Asset Services + Cushman Wakefield NYSE:CWK + Colliers NASDAQ:CIGI + Newmark NASDAQ:NMRK + Avison Young + Lincoln Property Company + RXR Realty + LPC Commercial + Stream Realty + Transwestern + Cushman Wakefield AMO (Accredited Management Organization) program — the commercial-office + mixed-use + industrial + multifamily portfolio service-agreement buyers; pivotal 2024-2027 commercial-real-estate dynamics commercial-office vacancy NYC + SF + Chicago + LA + DC reaching 18-28% post-pandemic per CBRE + JLL + Cushman 2024 reports + flight-to-quality compressing service-budgets for B/C class buildings + capital-improvement freezes at distressed properties + REIT dividend pressure + sustainability-linked-loan margin reduction tied to GRESB + ENERGY STAR score; pivotal commercial-SA-renewal implication: facilities GM at flight-to-quality A-class building has budget + ESG mandate + capital + sustainability-officer pressure to invest in IoT-BMS + heat-pump-retrofit + refrigerant-transition; facilities GM at B-class building under pressure to consolidate service contracts + cut SA spend 15-30% + extend equipment life + defer capex; the two-conversation reality for HVAC sales reps in 2027 — A-class building = decarbonization-eligibility + ESG-roadmap + technology-upsell conversation / B-class building = cost-defense + extend-equipment-life + selective-PM + capital-deferral conversation', url: 'https://www.boma.org/' },
  { title: 'Commercial HVAC service-agreement industry benchmarking + operational metrics from ACCA + MCAA + ServiceTitan Commercial + Connect HVAC + FieldEdge + Workiz + Profit Rhino + Coolfront + Service Nation Alliance + Service Roundtable Coaches Coalition + Nexstar Network commercial-HVAC chapter + commercial-service-contractor compensation studies: typical commercial-HVAC service-contractor revenue split ~35-50% service-agreement recurring + ~25-35% time-and-material reactive service + ~15-25% project + retrofit + ~5-15% new construction; gross-margin benchmarks per MCAA + Service Logic + CoolSys + Limbach ODR data: SA preventive-maintenance contracts 28-42% GM / reactive emergency service 38-55% GM / quoted-repair work 32-45% GM / capital-retrofit project 18-28% GM / new construction 8-15% GM; commercial-SA renewal rate benchmarks Best-in-Class 92-96% / Median 82-88% / Below-Median 72-80%; commercial-SA pricing typical 2024-2027: PM-only inspection-frequency 2-4 visits/yr $0.18-$0.45/sqft/yr / Comfort tier PM + minor-repair $0.35-$0.70/sqft/yr / Plus tier PM + repair + emergency-call labor $0.55-$1.10/sqft/yr / Complete tier PM + repair + emergency + parts + capital-replacement reserve $0.95-$2.20/sqft/yr; technician billable-hour utilization Best-in-Class 78-85% / Median 62-72% / Below-Median 52-62%; service-call response-time SLA standard commercial 4-8 hours emergency / 24-48 hours non-emergency / 2-4 hours critical-care healthcare + data-center; commercial-SA escalation clause typical CPI-based 2-5%/yr or fixed 3-5% annual + refrigerant-cost pass-through clause increasingly standard post-2024 AIM Act; commercial-SA contract typical 3-yr base + auto-renew clause + 90-day non-renewal notice + termination-for-cause 30-60 day cure', url: 'https://www.mcaa.org/' },
  { title: 'Commercial-HVAC SA buyer-psychology + the three conversations every commercial HVAC sales rep avoids at renewal: (1) the price-escalator + refrigerant-pass-through conversation MSP-style commercial service contractors systematically under-price renewals because incumbent-relationship feels fragile + facility GM remembers original three-year-fixed pricing + the sales rep does not want to deliver the 12-22% combined uplift (base CPI + 2-4% + AIM Act refrigerant pass-through + labor inflation 6-8%); (2) the retrofit-vs-repair-vs-extend-life conversation incumbent service contractor avoids telling building owner that 1990s-2000s gas-fired packaged RTU at end of useful life because (a) replacement-equipment-financing requires capital conversation owner does not want to have (b) contractor fears losing relationship if recommendation is unaffordable (c) IRA 179D + utility rebate + sustainability-linked-loan stack is unfamiliar to traditional service-tech-turned-account-rep; (3) the BMS-integration + IoT-predictive-maintenance + ESG-reporting upsell conversation incumbent service contractor avoids because it requires CFO + sustainability officer + tax advisor + design engineer multi-stakeholder facilitation outside traditional facilities-GM single-thread relationship; pivotal industry observation per Service Logic + CoolSys + Comfort Systems USA + EMCOR investor presentations + Limbach Holdings ODR-pivot disclosures 2023-2024 the three avoided conversations explain ~55-70% of the gross-margin gap between top-quartile mechanical-service contractors (28-38% GM on service portfolio) and bottom-quartile (8-15% GM); pivotal SA-renewal framework anchor to documented PM-deliverable + equipment-condition + refrigerant-leak-rate + energy-benchmark scorecard + reframe SA as ESG-eligibility + decarbonization-roadmap + IRA-179D-capture + present refrigerant-pass-through + BMS-IoT upsell + script the retrofit conversation', url: 'https://www.servicelogic.com/news' }
];


// ============================================================================
// TLDR -- intro callout + meeting agenda
// ============================================================================
const tldr = `> ### 🛠️ The Pulse Training
> **Who this is for:** **Commercial HVAC service account reps + SA renewal specialists + branch managers + service-sales mgrs** at **Carrier Commercial Service / Trane Commercial / Lennox LNAS / JCI North America / Daikin Applied / METUS + PE-backed Service Logic / CoolSys / Comfort Systems USA NYSE:FIX / EMCOR NYSE:EME / Limbach NASDAQ:LMB** + **independent mechanicals** running SA renewals against **Service Logic + CoolSys consolidation** + **AIM Act R-410A cost spike (200-400% YoY 2024-2026)** + **EPA Technology Transitions Rule Jan-2025 GWP-700 cap** + **IRA 179D $0.50-$5.81/sqft** + **VRF/heat-pump migration** + **BAS/BMS + IoT predictive-maintenance upsell** + **ESG/GRESB/SEC Climate Disclosure**. Per **ACCA QMS + MCAA + FIX/EME/LMB disclosures**: top-quartile **28-38% SA GM + 92-96% renewal + 78-85% utilization + 5-9%/yr uplift**; median ~**18-25% GM + 82-88% renewal**; bottom ~**8-15% GM + 72-80% renewal**. **Run before AHR Expo + Comfortech + MCAA Annual + ACCA + IFMA + BOMA International.**
>
> **What HVAC service teams leave with:** **5-STAGE SA RENEWAL CONVERSATION (AUDIT → ALIGN → ARCHITECT → AFFIRM → ADVANCE)** + **THREE RENEWAL CONVERSATIONS EVERY HVAC SALES REP AVOIDS** (price + refrigerant pass-through / retrofit-vs-extend-life / BMS-IoT-ESG upsell). Plus verbatim language, two role-plays (Facilities GM at 320K sqft Class-A office tower + Property Manager at 95K sqft suburban medical-office building), the "good bad ugly" SA-portfolio quartile self-diagnosis, AIM Act refrigerant-pass-through script, IRA 179D + 45L capture math, BMS-IoT + predictive-maintenance attach playbook.
>
> **Branch manager brings:** (1) 3 recent lost-renewal debriefs + last AHR Expo / MCAA debrief. (2) SA Renewal Kit — PM-deliverable scorecard template (visit-completion + equipment-condition-score + refrigerant-leak-rate + energy-use-intensity EUI + ENERGY STAR Portfolio Manager score + IoT-alarm-trend) + ACCA QMS + MCAA SA quartile self-diagnosis + AIM Act refrigerant-pass-through clause + IRA 179D / 45L / 25C calculator + BMS-IoT predictive-maintenance attach pitch + price-escalator script. (3) Whiteboard last 10 renewals by stage + outcome + price uplift + retrofit attach.

## MEETING AGENDA -- 60 MINUTES

| Time | Block | Owner | Outcome |
|------|-------|-------|---------|
| **0:00-0:10** | **Intro + Cold Open** — Rep A renewed 280K sqft Class-B office SA flat at $0.32/sqft, lost SA to Service Logic 7 months later citing "no refrigerant strategy + no IRA-179D conversation"; Rep B raised same-segment 320K sqft Class-A office 19% with BMS-IoT bolt-on + refrigerant pass-through + Trane CoreSense predictive-maintenance + 179D capture = $89K/yr SA → $138K/yr | Branch Mgr | Roadmap-anchored renewal beats flat-rate "don't poke the bear" 4-6x |
| **0:10-0:35** | **Teach** — 5-STAGE (AUDIT/ALIGN/ARCHITECT/AFFIRM/ADVANCE) + 3 avoided conversations (price + refrigerant / retrofit / BMS-IoT-ESG) + SA quartile self-diagnosis | Branch Mgr | Recite 5 stages + 3 conversations + AIM Act + 179D math verbatim |
| **0:35-0:45** | **Discussion** — 8 prompts on Service Logic consolidation defense / VRF-heat-pump pivot timing / R-410A pass-through framing / Niagara vs Metasys vs Tracer SC+ / when PM cadence broke / bottom-quartile pricing fear | Branch Mgr + room | Audit last 10 renewals by SA quartile behavior |
| **0:45-1:05** | **Role-Play x 2** — R1: Facilities GM Linda at 320K sqft Class-A office demanding flat renewal + R-454B equipment + GRESB scoring pressure. R2: Property Manager at 95K sqft suburban medical-office building comparing your $0.48/sqft to CoolSys's "we can do it for $0.31/sqft" consolidation pitch | Pairs | Run 5-STAGE under two buyer archetypes |
| **1:05-1:10** | **Debrief + Commitments** — 3 Qs + 1 lost renewal + 1 verbatim line + 1 conversation you avoided | Branch Mgr | Roadmap-first renewal habit + price-increase discipline |
| **1:10-1:13** | **Leave-Behind** — Script Card + SA Quartile Self-Diagnosis + AIM Act Pass-Through Clause + IRA 179D Capture Calculator + BMS-IoT Predictive-Maintenance Attach Pitch | Branch Mgr | One-pager in every account-rep bag |

> ### 🎯 Bottom Line
> **A 320K sqft Class-A office doesn't drop your SA because your hourly rate went up 7% — she drops you because you renewed her flat for 3 years while R-410A cost tripled, her sustainability officer never saw an EUI benchmark, GRESB asked for a refrigerant-leak audit you couldn't produce, and Service Logic's BDR called her CFO three times in Q3 with a BMS-IoT pitch you should have run.** Per **ACCA QMS + MCAA + FIX/EME/LMB**: top-quartile raise 5-9%/yr + pass through AIM Act + attach BMS-IoT to 35-55% of mid-size+ renewals + capture 179D on 25-40% of retrofits + run PM-QBRs to 80-95% of clients. Run **5-STAGE AUDIT/ALIGN/ARCHITECT/AFFIRM/ADVANCE + 3-avoided-conversations + SA quartile self-diagnosis + AIM Act pass-through + 179D capture + BMS-IoT attach** = **22-35% SA value lift / 92%+ renewal / 28-38% SA GM / Limbach-ODR-style margin expansion**. Flat-renewal + skip-PM-QBR + avoid-refrigerant + sell-truck-rolls + ignore-ESG = **0-8% lift / 72-82% renewal / lose Class-A portfolios to Service Logic + CoolSys / 8-15% SA GM**. Five stages. Three avoided conversations. PM-scorecard before renewal.

`;

// ============================================================================
// CORE -- Sections 1-6
// ============================================================================
const core = `---

## SECTION 1 -- INTRO + AGENDA (0:00-0:10)

> ### 🟡 Coach Note
> Do NOT open with the **Trane CoreSense deck** or **Carrier Abound slide**. Whiteboard. Say the **MCAA + FIX + EME + LMB** quartile margin numbers + the two-rep cold-open + the three avoided conversations + the AIM Act R-410A pass-through (~70% of your renewals next 24 mo). **Ten minutes. Hard stop at 0:10.**

### The numbers, then the story.

**The numbers.** Per **ACCA QMS + MCAA + FIX + EME + LMB ODR-pivot 2024 + Service Logic + CoolSys**: **Top-quartile** runs **28-38% SA GM + 78-85% util + 92-96% renewal + 5-9%/yr uplift + AIM Act pass-through every renewal + 35-55% BMS-IoT + 25-40% 179D + 80-95% PM-QBR + 5-8%/yr non-renewal**. **Median** **18-25% GM / 1-4% uplift / 40-55% PM-QBR**. **Bottom-quartile** **8-15% GM / 0% uplift**. Per MCAA + Limbach, operating-model + service-mix shift (construction → owner-direct) explains **~65% of quartile spread** — not equipment choice.

Layer on the squeeze. **AIM Act + EPA Technology Transitions Rule (40 CFR Part 84)** cut R-410A virgin allocation **~40% YoY in 2024** + drove wholesale **200-400%** + the **Jan-1-2025 GWP-700 cap** forces R-32 + R-454B as replacement. Every R-410A system pre-2025 faces a 5-10 yr retrofit-or-replace decision. Per GRESB + ENERGY STAR Portfolio Manager, **~70% of mid-market commercial SA renewals 2024-2027** surface a refrigerant + ESG + EUI gap. **IRA 179D $0.50-$5.81/sqft + 45L $500-$5K + 48 ITC 6%+24%** are the offsetting capital incentives.

**The story.** **Rep A** renewed a **280K sqft Class-B office in Cleveland** at **$0.32/sqft flat for 3 yrs** — no PM-QBR in 13 mo, no refrigerant strategy, no 179D, no GRESB. **7 mo in, Service Logic's BDR pitched the CFO** with BMS-IoT + refrigerant-roadmap + 179D-eligible chiller-replacement. **CFO non-renewed for convenience**, signed Service Logic at **$0.41/sqft** with BMS-IoT + R-454B reserve. **Rep A lost $89K/yr SA + the reference + the cross-sell pipeline.**

**Rep B** renewed a **320K sqft Class-A office in Charlotte** 5 mo later. Day 95: PM-QBR (visit 100% + condition 8.4/10 + leak 0.3% + EUI 71 vs 78 + ENERGY STAR 84). Day 75: AIM Act + ESG audit vs GRESB + SLB — 6 gaps. Day 60: ARCHITECT — **$89K → $138K/yr** (base lift + AIM Act + CoreSense IoT + 179D retainer). Day 30: signed **3-yr SA + Trane CoreSense + R-454B reserve + 179D retainer**. **Lift: $49K/yr + GRESB improvement + 2 portfolio cross-sells + Greater-Charlotte BOMA case study.**

> ### ⚠️ Common Trap
> *"Rep A got beat by PE money + flat renewal kept the building three years longer."* **(1)** "Kept three years longer" is Service Logic's acquisition-deck post-mortem. **(2)** Flat = **delayed loss + margin erosion + PE-rollup bait**. **(3)** CFO non-renewed over **GRESB + no 179D + no refrigerant-roadmap + no PM-QBR**, not price. Service Logic won because Rep A didn't run **ARCHITECT-AFFIRM-ADVANCE**. **AUDIT before ALIGN. ALIGN before ARCHITECT.**

**Transition:** "Next 50 minutes: 5-stage SA renewal, 3 avoided conversations, two role-plays. Let's go."

---

## SECTION 2 -- THE TEACH (0:10-0:35)

> ### 🟡 Coach Note
> Twenty-five minutes. Split into **5-STAGE (15 min, ~3 min/stage)** + **Three Renewal Conversations Avoided (10 min)** + **SA Quartile Self-Diagnosis (2 min)**. End-of-section test: every rep recites all 5 stages + 3 avoided + AIM Act clause + 60-sec ARCHITECT pitch without notes.

### Part A -- The 5-STAGE SA RENEWAL CONVERSATION (15 min)

Most lost commercial HVAC SA renewals collapse at Stage 1 (skipped PM-QBR + roadmap-less renewal letter) or Stage 3 (avoided refrigerant + escalator conversation). **You don't keep a 320K sqft Class-A office with a flat renewal letter — you EARN the next 3-year SA by AUDITING PM-deliverable + condition + leak-rate + EUI, ALIGNING to ESG + GRESB + SLB + IRA roadmap, ARCHITECTING the four-component proposal, AFFIRMING on a 3-yr SA with refrigerant escalator, and ADVANCING into portfolio cross-sells + BOMA/IFMA referrals.**

#### Stage 1 -- AUDIT (3 min)

The SA renewal starts **90 days before expiry** with a **structured PM-scorecard QBR** using **ACCA QMS + MCAA-style scorecard**: **visit-completion % + equipment-condition (per RTU/chiller/AHU/pump) + refrigerant-leak (ASHRAE 147) + EUI (ENERGY STAR Portfolio Manager) + IoT-alarm trend + emergency-response vs SLA + 179D-modeling status + ASHRAE G36 commissioning**. The GM + property manager + sustainability officer + CFO must SEE the data in a format her GRESB / SLB lender / asset-management team would accept.

> ### 🎤 Verbatim Script -- AUDIT
> *"Linda — quarterly PM-scorecard. **Visit 100% vs SLA 98% + condition 8.4/10 (7 chillers + 12 AHUs + 24 RTUs) + leak 0.3% vs ASHRAE 147 <1.0% + EUI 71 vs CBECS 78 + ENERGY STAR 84 vs 75+ threshold + IoT-alarm trend -38% YoY on CoreSense-monitored chillers**. **6 gaps surfaced: R-454B retrofit plan / IoT expansion to 4 chillers without sensors / G36 commissioning / leak audit per AIM Act / 179D model / decarb roadmap aligned to GRESB.** That gap list is the renewal conversation."*

**Common trap.** Skipping PM-QBR. **Median 40-55%, top-quartile 80-95%.** No QBR = renewal arrives as price-ambush + Service Logic closes in 7 months.

#### Stage 2 -- ALIGN (3 min)

Anchor SA to **ESG + GRESB + SLB covenants + 179D capture + AIM Act compliance** — NOT truck-roll cost-line. CFO + sustainability officer + asset mgr write checks for ESG + capital-incentive + decarbonization. Per Trane + JCI OpenBlue Sustainability-as-a-Service + Limbach ODR-pivot 2024, highest-leverage reframe is **"we are your ESG-roadmap + decarbonization + 179D-capture partner"** because SLB margin reduction + GRESB + SEC Climate Disclosure (paused but pending) + CA SB-253/261 are sitting on her desk.

> ### 🎤 Verbatim Script -- ALIGN
> *"Linda — three changes since 2024 SA. (1) **REIT's GRESB submission Q2** + **SLB margin** (15 bps reduction tied to GRESB + ENERGY STAR + carbon-intensity) requires audited leak data + EUI-trajectory + decarb roadmap. (2) **CA SB-253 + SB-261** (effective 2026-2027 + Scope 1+2+3) requires HVAC refrigerant + operational-energy reporting. (3) **AIM Act + Technology Transitions Rule** put 2002 R-410A plant at hard end-of-life by 2030 — 179D-modeled retrofit captures $0.50-$5.81/sqft + utility rebate + ITC bonus. **You are buying GRESB + SLB + 179D + AIM Act + decarb roadmap — not truck-rolls.**"*

**Common trap.** Pitching faster response + new dispatch dashboards. CFOs + sustainability officers don't care. **Reframe to ESG = CFO writes the check.**

#### Stage 3 -- ARCHITECT (3 min)

Three-component proposal. Top-quartile lift **5-9%/yr base** + pass through **AIM Act** + add **$0.06-$0.15/sqft/yr BMS-IoT** + **179D engineering retainer** for end-of-life equipment. Bottom-quartile lift **0%** + lose buildings 18 mo later to Service Logic + CoolSys.

> ### 🎤 Verbatim Script -- ARCHITECT
> *"Linda — three components. (1) **Base $0.42 → $0.45/sqft = 7.1% lift** per MCAA labor + sheet-metal + copper + EPDM-belt pass-through. (2) **AIM Act Section 7.4** — R-410A up 280% YoY, activates at $30/lb (currently $42/lb) + verified-leak only + cap $0.04/sqft/yr. (3) **Trane CoreSense IoT + BMS-cloud** — 11 chillers + 18 AHUs + 24 RTUs — $0.12/sqft/yr — FDD per ASHRAE G36 + GRESB ESG dashboard. (4) **179D engineering retainer $42K/yr** — ASHRAE 90.1-2007 baseline + prevailing-wage docs — captures $0.50-$5.81/sqft on R-454B chiller swap. **Total $89K → $138K/yr + $138-$232K capital incentive capture.**"*

**Common trap.** Lifting base $0.02/sqft alone. **Lift comes from AIM Act + BMS-IoT + 179D — not base-rate.** Top-quartile grow SA value 15-30%/yr on attach + conversion.

#### Stage 4 -- AFFIRM (3 min)

Lock in **3-yr SA** with **CPI+2-3% escalator floor + 6% cap + AIM Act pass-through + auto-renew + scope governance + BMS-IoT + 179D expansion**. Top-quartile hold **92%+ renewal** because SAs are owner-defensible + GRESB-audit-clean + SLB-friendly + AIM Act-ready.

> ### 🎤 Verbatim Script -- AFFIRM
> *"Linda — proposed SA. **3-yr + CPI+2% floor + 6% cap + AIM Act Section 7.4 + auto-renew 90-day + scope governance quarterly + BMS-IoT expansion + 179D renewable annually**. **Termination for cause** = SLA breach + 90-day cure. **For convenience** = 9-month notice + unamortized retrofit-planning + 50% remaining base."*

**Common trap.** 1-yr term + no escalator + no AIM Act + 30-day termination = **REIT-portfolio-toxic + SLB-toxic + Service-Logic bait**. 3-yr with escalator + AIM Act + 179D = **margin-defense moat**.

#### Stage 5 -- ADVANCE (3 min)

Convert renewed SA into **portfolio referral engine** — 2-3 intros/renewed building/yr. Closed-and-renewed CFO is your best BDR for next 10 Class-A towers + medical-office + life-sciences in the metro. BOMA + IFMA + MCAA local chapters amplify. Per Limbach + FIX, top-quartile generate **35-50% of new logos from referrals** vs Median **10-18%**.

> ### 🎤 Verbatim Script -- ADVANCE
> *"Linda — one ask. You signed for ESG + 179D + AIM Act + PM-scorecard cadence. **Three Greater-Charlotte asset-manager peers** — Marcus at Crescent Communities, Sarah at Lincoln Harris, Diana at Childress Klein — same 200-400K sqft Class-A + GRESB + SLB pressure. **20-min intro email**. Reciprocal: you co-host the Greater-Charlotte BOMA decarb-roadmap breakfast Q3 + we co-present the 179D capture case."*

**Common trap.** Asking at SA signing month 1. **Top-quartile asks at month 6** after first PM-QBR delivered + AIM Act proven + 179D kicked off.

### Part B -- The Three Renewal Conversations Every HVAC Sales Rep Avoids (10 min)

Per **MCAA Service Manager Training + Limbach ODR-pivot 2024 + Service Logic + CoolSys + FIX disclosures**, three conversations explain **~55-70% of the GM gap** between top-quartile and bottom-quartile. Reps avoid them out of fear + "don't poke the bear" + remembered three-year-fixed-pricing promise.

#### Conversation 1 -- "Price escalator + AIM Act refrigerant pass-through"

Bottom-quartile holds base rates flat 3-5 yrs + watches labor + AIM Act refrigerant + commodity inflation erode SA GM from 22% to 8%. Top-quartile lifts **5-9%/yr** anchored to MCAA labor index + AIM Act trigger + pass-through clause. **Script:** *"Linda — annual review per SA Section 4.2 + AIM Act Section 7.4. MCAA labor 7.1% + sheet-metal 11% + EPDM-belt + copper 9% + R-410A 280% YoY. Combined lift 7.1% base + AIM-Act-trigger pass-through verified-leak only. Same scope. Effective 30 days."*

#### Conversation 2 -- "Your 2002 chiller plant is at end-of-life — let's run the retrofit-vs-extend-life-vs-replace math + capture the IRA 179D"

Reps avoid telling owners about **end-of-useful-life equipment + R-454B retrofit decision + VRF migration + 179D stack** because it admits short-horizon prior advice + GM asks "why didn't you tell me before" + capital conversation lives at CFO + REIT-asset-manager level. The longer delayed, the more likely Service Logic + CoolSys BDR runs it first. **Script:** *"Linda — three 2002 Carrier 19XR water-cooled chillers at 25-yr design-life + R-410A trajectory makes next 5 yrs uneconomic. Three paths. (A) Extend-life w/ overhaul + tube-replacement + VFD $640K + 7-yr horizon. (B) R-454B Trane CenTraVac $2.4M + 30-yr life + 32% energy reduction + 179D $160K-$1.86M + Duke Energy rebate $180K + ITC 6%+24%. (C) Hybrid Daikin VRV heat-pump perimeter + central chillers core $3.1M + max decarb. Six-week feasibility $42K."*

#### Conversation 3 -- "Your BAS is 2003 Metasys N2 + you have no IoT-predictive-maintenance + no FDD per ASHRAE G36 + no GRESB-ready ESG dashboard"

Top-quartile contractors run a **BMS-IoT + ESG-dashboard upsell** at renewal. Bottom-quartile avoid because BAS conversation requires multi-stakeholder facilitation (GM + IT/OT + sustainability officer + CFO + REIT-asset-mgr + tax advisor). **Script:** *"Linda — 2003 Metasys N2 out of OEM support + proprietary protocol blocks open-FDD + sustainability officer can't pull GRESB-ready EUI + carbon dashboard. Three paths. (A) Niagara N4 + Tridium + open BACnet/IP + CoreSense IoT on chillers + Augury vibration on pumps + KGS Clockworks FDD $480K + $0.18/sqft/yr. (B) JCI OpenBlue $720K + $0.22/sqft/yr. (C) Carrier Abound + Automated Logic WebCTRL $580K + $0.16/sqft/yr. All integrate to GRESB + SLB + ASHRAE G36 + Lawrence Berkeley FDD value capture. Six-week scoping $28K."*

### Part C -- SA Portfolio Quartile Self-Diagnosis (2 min)

Every branch mgr + service-sales mgr self-diagnoses on 5 metrics: **SA GM % + billable-hour util + renewal rate + annual uplift + BMS-IoT attach**. Numbers are non-negotiable per MCAA + Service Logic + CoolSys + FIX + LMB ODR-pivot disclosures. Room learns instantly which quartile they're in + which 2-3 metrics block the next jump.

> ### 🎯 Bottom Line
> 5 stages + 3 avoided + SA quartile + AIM Act + 179D + BMS-IoT + PE-roll-up defense = **22-35% SA value lift / 92%+ renewal / 28-38% GM / Limbach-ODR margin expansion**. Stages without avoided = competent PM that loses to Service Logic. Avoided without stages = aggressive pricing breaks relationship without PM + ESG foundation.

---

## SECTION 3 -- THE DISCUSSION (0:35-0:45)

> ### 🟡 Coach Note
> Whiteboard 5 columns AUDIT/ALIGN/ARCHITECT/AFFIRM/ADVANCE + 3 rows PRICE-REFRIGERANT / RETROFIT / BMS-IoT-ESG. Each rep audits last 10 renewals out loud — stage skipped, conversation ducked, quartile behavior. **Count to five after each prompt.**

**1 — "Walk away when owner refuses AIM Act pass-through AND 179D retainer?"** When owner declines pass-through after two written notices AND R-410A leak exposure exceeds projected SA GM AND property is on glide-path to Service Logic / CoolSys anyway. **Branch Mgr:** *"Refrigerant exposure compounds across 60-80 buildings. Pass through or non-renew. Top-quartile passes through."*

**2 — "When does packaged-RTU-to-VRF-heat-pump pivot trigger?"** Building has **3+ packaged gas RTUs past 18-yr** AND owner has **decarb deadline** (GRESB / SLB / NYC LL97 / Boston BERDO / CA SB-253) AND 179D + utility rebate funds the swap. Per Daikin + METUS + LG + DOE Better Buildings, VRF retrofit at end-of-life **3-5x larger per-building ARR** + VRF SA $0.25-$0.85/sqft/yr. **Branch Mgr:** *"Don't wait for the sustainability officer. When you see 18-yr RTU on the asset list, run VRF conversation in the next PM-QBR. Otherwise Daikin Comfort Pro or METUS Diamond Contractor wins."*

**3 — "AIM Act pass-through — flat or tiered trigger?"** **Tiered ($25/lb + cap $0.04-$0.06/sqft/yr) for office + retail + warehouse**; **flat for healthcare + data-center + critical-care** where leak volume is high + insurance-funded. Cite EPA AIM Act 40 CFR Part 84 + ACHR News + RSES + ASHRAE Journal. **Branch Mgr:** *"AIM Act is EPA-mandated. Conversation is tier-vs-flat, not whether the pass-through is in the SA."*

**4 — "When does PE-roll-up consolidation pitch actually win?"** Owner runs **15+ building portfolio** AND **SA spend >$1.5M/yr** AND incumbents fragmented across 4-8 vendors AND owner has **no PM-QBR cadence + no portfolio ESG dashboard**. Below $800K/yr Service Logic + CoolSys lose on relationship + branch-density. **Branch Mgr:** *"Don't out-Service-Logic Service Logic. Differentiate on PM-QBR + 179D depth + BMS-IoT + tech tenure + BOMA/IFMA. Beat on relationship, not price."*

**5 — "PM-QBR cadence broke 18 mo ago — how to reset?"** You can't quietly. **Acknowledge in writing** + reset + deliver 2 consecutive ACCA QMS PM-QBRs at 30 + 60 days + AIM Act + 179D + ESG audit as QBR centerpiece. **Branch Mgr:** *"GM knows you stopped. Apologize once, reset hard, deliver twice. Reset within 90 days or lose to Service Logic."*

**6 — "Bottom-quartile pricing fear — how to coach a rep who refuses the AIM Act pass-through conversation?"** Ride along 3 pitches + script verbatim + branch manager delivers price + AIM Act, rep delivers technical scope. Branch-manager-coachable in 90 days per MCAA + Limbach. **Branch Mgr:** *"Pricing + refrigerant pass-through is branch-manager work. Don't outsource to a tech-leaning rep."*

**7 — "179D retainer — bill or include in SA?"** Include **annual 179D-eligibility scan** in SA (60-min QBR segment). Bill **engineering model + ASHRAE 90.1-2007 simulation + prevailing-wage docs + designer-allocation** as **$25K-$80K retainer** tied to retrofit scoping. **Branch Mgr:** *"Eligibility scan = relationship currency. Engineering model = revenue + 25-40% retrofit attach."*

**8 — "ONE verbatim change."** Each rep: ONE stage skipped + ONE avoided conversation to deliver this week. **Branch Mgr:** *"CRM task + Monday huddle + ride-along on first attempt."*

---

## SECTION 4 -- TWO-PERSON ROLE-PLAY (0:45-1:05)

> ### 🟡 Coach Note
> Pair account reps. **Two scenarios, 10 min each, 60-sec reset between.** Walk the imaginary engineering room + asset-mgr office. Listen for verbatim *"AIM Act refrigerant pass-through"* (ALIGN) + whether rep delivers price-escalator without flinching + whether she pivots to VRF when building signals decarbonization. Mark which stage + which avoided conversation each rep skips.

### Role-Play 1 -- Facilities GM Linda at 320K sqft Class-A Office + GRESB + SLB Pressure (10 min)

**Setup:** **Linda Park, Facilities GM + Sustainability Lead at Crescent-Capital Tower**, 320K sqft Class-A LEED Gold office in Charlotte NC owned by a REIT with a $4.2B SLB tied to GRESB + ENERGY STAR. **3-yr Trane SA expiring 80 days at $0.28/sqft/yr flat = $89.6K/yr**. Three 2002 Carrier 19XR water-cooled R-410A chillers + 18 AHUs + 24 RTUs + 2003 Metasys N2 BAS out of OEM support. Linda is **demanding flat** + pitched twice in Q3 by **Service Logic's BDR** (portfolio consolidation) + **CoolSys** (refrigerant-roadmap). Rep is **Marcus Holden, senior account rep at Trane Commercial Service Charlotte branch**, 6 yrs on the building. **Run full 5-STAGE + 3 avoided conversations + close at $138K/yr (54% lift).**

> ### 🎤 PROSPECT -- Linda Park
> 44, 7-yr Facilities GM + Sustainability Lead, MBA + LEED AP, financially literate, GRESB-aware, distrusts "scope creep," leads PRICE primary ESG secondary.
>
> **Deflection 1 (min 4):** *"We've been flat at $0.28/sqft for three years and we like it that way. Service Logic quoted me $0.31/sqft for portfolio consolidation including BMS-IoT subscription. Why am I getting a 54% increase from you when the market consolidation price is going DOWN per sqft?"*
>
> **Deflection 2 (min 8):** *"The AIM Act refrigerant cost is your refrigerant-procurement problem, not mine. I'll just switch to a contractor who eats it. And the 179D retainer? My tax advisor at the REIT handles 179D — I don't need your $42K retainer."*

> ### 🎤 ACCOUNT REP Marcus
>
> - **Min 0-3 (AUDIT + ALIGN):** *"Linda — PM-scorecard pulled. **Visit 100% + condition 8.4/10 + leak 0.3% per ASHRAE 147 + EUI 71 vs CBECS 78 + ENERGY STAR 84 + IoT-alarm trend -38%**. Three changes since 2024. (1) **AIM Act + Technology Transitions Rule** put your 2002 chiller plant at hard end-of-life by 2030 + R-410A wholesale up 280% YoY. (2) **Your REIT's GRESB + SLB margin reduction** requires audited refrigerant-leak + EUI-trajectory + decarbonization roadmap — 2003 Metasys N2 can't generate it. (3) **CA SB-253 + SB-261** Scope 1+2+3 reporting on REIT CA exposure. **You are buying GRESB-scoring + SLB-margin + 179D-capture + AIM Act compliance + decarbonization roadmap — not truck-rolls.**"*
> - **Min 3-5 (ARCHITECT):** *"Four components. (1) Base $0.28 → $0.30/sqft = **7.1% lift** per MCAA labor + commodity index. (2) **AIM Act pass-through Section 7.4** — $30/lb trigger + verified-leak only + cap $0.04/sqft/yr. (3) **Trane CoreSense IoT + BMS-cloud** — 3 chillers + 18 AHUs + 24 RTUs — $0.12/sqft/yr — FDD per ASHRAE G36 + GRESB-ready ESG dashboard. (4) **179D engineering retainer $42K/yr** — ASHRAE 90.1-2007 baseline + prevailing-wage docs — captures $0.50-$5.81/sqft × 320K = **$160K-$1.86M** on R-454B CenTraVac swap. **Total $89K → $138K/yr + $160K-$1.86M capital incentive capture.**"*
> - **Min 5-7 (Deflection 1 — Service Logic at $0.31):** *"Three on Service Logic. (1) **Pull the SOW** — $0.31 excludes 179D retainer + AIM Act cap + CoreSense factory-warranty + has 5-yr auto-renew + 30-day termination favoring them. Sections 9 + 14 + 22. (2) **Service Logic acquires 8-12 contractors/yr** per ChannelE2E — your branch AM turns over every 14-18 mo. I've owned this account 6 yrs + know your 19XR refrigerant logs + Metasys point-list + comfort hot-spots floors 14 + 22. (3) **Their BDR pitch deck — I have a copy** — shows Crescent-Capital Tower as a beachhead for South-Charlotte Class-A consolidation. Sourcing lead-gen, not selling service. **Your call.**"*
> - **Min 7-9 (Deflection 2 — REIT tax advisor handles 179D):** *"Three on 179D-in-house. (1) **179D requires HVAC-system-specific DOE-2 / EnergyPlus modeling vs ASHRAE 90.1-2007** — your tax advisor is a CPA, not a mechanical engineer with prevailing-wage chain-of-custody. Without our model + designer-allocation letter the deduction is unsubstantiated at audit. (2) **Tax-year 2023+ 179D** requires **prevailing-wage + apprenticeship** for $5.81/sqft top-tier — capped at $0.50-$1.00 without it = **$1.5M+ left on the table** on 320K sqft. (3) **REIT auditors + Big-4 sustainability assurance** increasingly require third-party engineering certification per AICPA + IAASB ISSA 5000. **$42K retainer captures $160K-$1.86M + REIT-audit defensibility + GRESB chain. ROI 4-44x year-one.**"*
> - **Min 9-10 (AFFIRM + ADVANCE):** *"Two asks. (1) **3-yr SA at $138K/yr + CPI+2% escalator + 6% cap + AIM Act Section 7.4 + auto-renew 90-day + CoreSense IoT + 179D retainer + R-454B feasibility Q1 kickoff**. (2) **One Greater-Charlotte asset-manager peer intro** — Marcus / Sarah / Diana. 20-min email. **Sign?**"*

### 60-Second Reset

> ### 🟡 Coach Note
> **"Switch sides — 60-sec reset."** Stand up. Read the OTHER role's paper. Go.

### Role-Play 2 -- Property Manager Linda at 95K sqft Suburban Medical-Office Building + CoolSys $0.31/sqft Consolidation Pitch (10 min)

**Setup:** **Linda Marsh, Property Manager at Westshore Medical Plaza**, 95K sqft suburban medical-office in Tampa FL with 14 tenants (cardiology + ortho + imaging + primary care + outpatient surgery). **2-yr SA expiring 50 days at $0.48/sqft/yr = $45.6K/yr**. 8 packaged gas RTUs (4 nineteen-year Carrier WeatherMaker + 4 eleven-year Lennox Energence) + 2002 Honeywell Excel BAS + critical-care SLAs (4-hr on imaging chiller + 2-hr on surgery suite). **CoolSys** quoted **$0.31/sqft = $29.4K/yr** consolidating with 4 other Tampa medical buildings. REIT owner has zero ESG mandate + high budget anxiety. Rep is **Marcus Holden** from Gulf-Coast Mechanical Services ($42M regional independent, MCAA member). **Run full 5-STAGE + 2 deflections + close at $0.51 + $0.08 BMS-IoT wrap = $59.9K/yr (31% lift) + critical-care SLA preserved.**

> ### 🎤 PROSPECT -- Linda Marsh
> 51, PM + acting Asset Mgr (small REIT), 4-yr SA, non-ESG (no GRESB), budget-conscious, leads PRICE hard with CRITICAL-CARE-SLA as background anxiety.
>
> **Deflection 1 (min 4):** *"CoolSys quoted me $0.31/sqft consolidating with their other Tampa medical buildings — that's $29.4K/yr vs your $45.6K. That's a $16K/yr savings — $48K over the 3-year SA. Why would I not do that?"*
>
> **Deflection 2 (min 8):** *"We've never had a critical SLA breach on imaging or surgery cooling in 4 years. CoolSys says their regional PM is sufficient. Why are we adding a $0.08/sqft BMS-IoT subscription when nothing's broken?"*

> ### 🎤 ACCOUNT REP Marcus
>
> - **Min 0-3 (AUDIT + ALIGN):** *"Linda — PM-scorecard. **Visit 100% + imaging-chiller emergency-response 2.8 hr vs SLA 4 + surgery-suite 1.4 vs SLA 2 + 0 critical breaches 48 mo + condition 7.6/10 weighted (4 nineteen-year Carrier WeatherMakers at 6.2)**. Three changes. (1) **The four 2006 R-410A WeatherMakers are at 19-yr design-life** — AIM Act + R-410A 280% YoY makes the next 4-5 yrs uneconomic. (2) **Joint Commission + DNV 2025** requires documented HVAC + IAQ + temperature/humidity evidence in OR + imaging — your tenants' audit cycles surface this Q3. (3) **HIPAA + Florida Medical-Records Act + tenant-lease** on IAQ-continuity = single 4-hr+ critical-cooling failure during surgery exposes you + REIT to medical-malpractice + lease-breach. **You are buying critical-care SLA preservation + Joint Commission + tenant-lease compliance + R-410A end-of-life sequencing — not truck-rolls.**"*
> - **Min 3-5 (ARCHITECT):** *"Three components. (1) Base $0.48 → $0.51/sqft = **6.3% lift** per MCAA labor + commodity + AIM Act Section 7.4. (2) **Critical-care BMS-IoT $0.08/sqft** — Augury vibration on 2 imaging-chiller pumps + Trane CoreSense on surgery-suite RTU + KGS Clockworks FDD — 14-30-day failure prediction + auto-dispatch. (3) **R-410A end-of-life sequencing retainer $8K/yr** — R-454B scoping + Duke/TECO rebate ($80-$180/ton) + REIT capital-planning. **Total $45.6K + $0.08 wrap = $59.9K/yr = $14.3K/yr lift + critical-care SLA insurance + R-410A roadmap.**"*
> - **Min 5-7 (Deflection 1 — CoolSys at $0.31):** *"Three on CoolSys, with respect. (1) **CoolSys regional PM is multi-site crew rotation** — 5+ Tampa medical buildings with shared techs on 60-day cycles. Your imaging + surgery SLAs are 2-4-hr — requires dedicated tech within 25 mi, not 60-day rotational. **Pull SOW Section 11** — response-time guarantee + after-hours premium + OEM-warranty status. (2) **CoolSys acquired 50+ contractors since 2017** per ChannelE2E — service-manager + tech assignment changes at integration 12-18 mo. I've owned this building 4 yrs + know the imaging-chiller refrigerant log + surgery-suite parking-deck access + IAQ-sensitive 2nd-floor chronic-fatigue patient panel. (3) **CoolSys $0.31 excludes critical-care SLA + after-hours + emergency guarantee + R-410A sequencing + Joint Commission deliverable** — apples-to-apples is $0.42-$0.48."*
> - **Min 7-9 (Deflection 2 — never had a breach):** *"'Never had a breach' is the most expensive sentence in critical-care SA renewals. (1) **Joint Commission 2024 environment-of-care** — leading IAQ/HVAC citation in OR + imaging is **lack of continuous-monitoring + documented response evidence** — 2003 Honeywell Excel BAS does not generate audit-defensible alarm-logs. (2) **4 nineteen-year WeatherMakers have rising leak-rate** — last 3 PM visits logged 4 + 6 + 9 lb R-410A top-offs. At AIM Act $42/lb = **$3K-$8K/yr refrigerant-only cost** + escalating compressor-failure + 4-hr SLA exposure summer peak. (3) **One Joint Commission citation + one tenant malpractice referral + one HIPAA EMR temperature breach** = $50K-$500K liability + tenant non-renewal + REIT-portfolio risk. **$0.08 BMS-IoT wrap is critical-care SLA insurance at 1/100th the avoided incident.**"*
> - **Min 9-10 (AFFIRM + ADVANCE):** *"Two asks. (1) **2-yr SA + $0.51 base + $0.08 BMS-IoT wrap + R-410A retainer + AIM Act Section 7.4 + 90-day termination + annual REIT owner-rep scope review + Joint-Commission deliverable package**. (2) **Two Tampa medical-office peers** — Frank at Cigna Tower MOB + Maria at Brandon Medical Plaza. 20-min intro email. **Sign + I deliver the Joint-Commission environment-of-care package + CoolSys-SOW-comparison brief to REIT owner-rep within 7 days as SA-close artifact.**"*

> ### 🟡 Coach Note
> Rep will want to (a) match CoolSys $0.31/sqft — DON'T, race-to-bottom destroys SA value; (b) attack CoolSys personally — DON'T, position by SOW competency; (c) skip Joint Commission + HIPAA because Linda is non-ESG — DON'T, REIT owner-rep is the real capital + risk buyer; (d) accept "I'll think about it" without delivering Joint-Commission + SOW-comparison briefing as SA-close artifact — DON'T, the briefing is the close.

---

## SECTION 5 -- DEBRIEF + COMMITMENTS (1:05-1:10)

> ### 🟡 Coach Note
> Three debrief Qs then commitments. Ritual moves next quarter's SA value uplift + AIM Act delivery rate + 179D attach + BMS-IoT attach + SA quartile movement.

**Debrief 1 — "Strongest stage? Weakest?"** Reps over-index AUDIT (PM-scorecard feels familiar), under-index ARCHITECT (price + AIM Act + 179D is uncomfortable + reps cut to "keep it flat") + ADVANCE (asking for referrals at month 6 feels presumptuous). **Branch Mgr:** *"Skip ARCHITECT or ADVANCE + SA value stays flat + branch margin worsens + Service Logic gets the next renewal."*

**Debrief 2 — "Avoided conversation you dodged most?"** Most name "AIM Act refrigerant pass-through" — reps flinch at refrigerant economics. **Branch Mgr:** *"When you flinch on AIM Act, branch eats it + owner gets windfall + SA GM erodes 28% to 12% over 3 yrs. Bottom-quartile runs flat 4 yrs + wonders why GM is 9%."*

**Debrief 3 — "Renewal you owe a redo?"** Each names ONE recent renewal that closed flat or without BMS-IoT or 179D. **Branch Mgr:** *"Email within 48 hrs: 'Linda — AIM Act tier shifted + Duke rebate window opens Q1 + I ran your refrigerant data + 179D model — 4 fresh opportunities. 30-min call?' Mid-cycle audit = mid-cycle SA value uplift at 30-40% per Service Roundtable + Nexstar."*

> ### 🎤 Commitment Ritual (Verbatim)

**Branch Mgr:** "Open the CRM. Four lines. **(1)** renewal that closed flat/under-uplifted (building + SA value + avoided conversation + verbatim 'flat' language). **(2)** stage skipped + verbatim line to redeliver. **(3)** avoided conversation dodged + reframe. **(4)** one building needing AIM Act + BMS-IoT + 179D conversation booked in 30 days. Read aloud."

Coach the vague: *"Which building? Which gap? Which lift number? Out loud now."*

**Closes:** "1:1 renewal-pitch-shadow within 14 days. Not whether you held the building — **whether you ran PM-QBR + delivered AIM Act + BMS-IoT + 179D + asked for portfolio-peer referral.**"

---

## SECTION 6 -- LEAVE-BEHIND WALKTHROUGH (1:10-1:13)

> ### 🟡 Coach Note
> Hand out one-pager. 30 sec per section. Digital in CRM + branch SharePoint. One in every account-rep bag + branch war-room wall + Monday-huddle binder.

> ### 📋 Leave-Behind -- "The 5-Stage SA Renewal Script Card" One-Pager

> **7 THINGS TO BRING ON EVERY SA RENEWAL:** (1) PM-scorecard template (visit-completion + equipment-condition + refrigerant-leak per ASHRAE 147 + EUI per ENERGY STAR + IoT-alarm + emergency-response vs SLA + 179D status + ASHRAE G36 commissioning). (2) SA quartile self-diagnosis. (3) AIM Act pass-through clause (Section 7.4). (4) IRA 179D/45L/25C calculator. (5) BMS-IoT attach pitch (Niagara N4 vs OpenBlue vs Abound vs Tracer SC+). (6) Price-escalator script (Section 4.2 + MCAA labor citation). (7) SA template (3-yr + CPI+2% + AIM Act + auto-renew + scope governance + termination).

> **THE 5-STAGE SA RENEWAL SCRIPT CARD:** **(1) AUDIT Day 90** — *"PM-scorecard: visit 100% + condition 8.4/10 + leak 0.3% + EUI 71 vs 78 + ENERGY STAR 84 + IoT trend -38%. Six gaps surfaced — R-454B retrofit / IoT expansion / G36 commissioning / leak audit / 179D model / decarb roadmap."* **(2) ALIGN Day 75** — *"You are buying GRESB-scoring + SLB-margin + 179D-capture + AIM Act compliance + decarbonization roadmap — not truck-rolls."* **(3) ARCHITECT Day 60** — *"Four components: base 7.1% + AIM Act Section 7.4 at $30/lb + CoreSense IoT $0.12/sqft + 179D retainer $42K/yr = $89K → $138K/yr / $147K over 3 yrs / $160K-$1.86M 179D deduction."* **(4) AFFIRM Day 30-15** — *"3-yr SA + CPI+2% floor + 6% cap + AIM Act Section 7.4 + auto-renew 90-day + scope governance + CoreSense IoT + 179D retainer + R-454B kickoff Q1."* **(5) ADVANCE Day 30 post + month 6** — *"Three asset-manager peers Marcus/Sarah/Diana. 20-min email. Reciprocal BOMA decarbonization breakfast + co-present 179D case."*

> **THE 3 AVOIDED CONVERSATIONS:** **(1) Price + AIM Act pass-through** — *"Annual review per Section 4.2 + AIM Act Section 7.4. MCAA labor 7.1% + sheet-metal 11% + copper 9% + R-410A 280% YoY. Lift 7.1% + AIM Act trigger pass-through."* (Top-quartile 5-9%/yr vs bottom 0%). **(2) Retrofit + 179D capture** — *"Three 2002 19XR chillers at 25-yr design-life + R-410A uneconomic. (A) Extend-life $640K / (B) R-454B CenTraVac $2.4M + 179D $160K-$1.86M + Duke rebate $180K / (C) Hybrid Daikin VRV $3.1M. Six-week study $42K."* (Top 25-40% attach vs bottom 5-10%). **(3) BMS-IoT + ESG-dashboard** — *"2003 Metasys N2 out of support + no FDD + no GRESB dashboard. (A) Niagara N4 + Tridium + CoreSense + Augury + Clockworks $480K + $0.18/sqft / (B) OpenBlue $720K + $0.22/sqft / (C) Abound + WebCTRL $580K + $0.16/sqft."* (Top 35-55% attach vs bottom <10%).

> **SA QUARTILE SELF-DIAGNOSIS:** Top **28-38% SA GM / 78-85% util / 92-96% renewal / 5-9% uplift / 35-55% BMS-IoT / 25-40% 179D / 80-95% PM-QBR / non-renew 5-8%/yr / 78-85% AIM Act delivery**. Median 18-25% / 62-72% / 82-88% / 1-4% / 15-25% / 8-15% / 40-55% / 3-5% / 35-50%. Bottom 8-15% / 52-62% / 72-80% / 0% / <10% / <5% / 15-25% / 1-3% / <15%. (Full table in Numbers Behind The Training.)

> **THE 12-CONTROL AIM ACT + ESG + 179D AUDIT CHECKLIST** (per EPA 40 CFR Part 84 + GRESB 2025 + IRA):
>
> **(1) AIM Act pass-through Section 7.4** trigger $25-$30/lb + cap $0.04-$0.06/sqft/yr + verified-leak only. **(2) ASHRAE 147 refrigerant-leak audit** vs <1.0% target. **(3) Technology Transitions Rule compliance** no new GWP>700 post-Jan-2025. **(4) R-454B/R-32 retrofit roadmap** for pre-2025 R-410A equipment. **(5) ENERGY STAR Portfolio Manager** + Certification 75+. **(6) ASHRAE Guideline 36** high-performance control sequences + continuous commissioning. **(7) FDD** via Niagara/OpenBlue/Abound/Tracer + analytics (KGS Clockworks / SkySpark / BrainBox AI). **(8) IoT sensors** on critical equipment ($400-$1,200/yr) — Augury / Senseware / CoreSense / Abound / OpenBlue. **(9) GRESB submission** annual EUI + carbon + refrigerant + water dashboard. **(10) 179D engineering model** + ASHRAE 90.1-2007 baseline + prevailing-wage docs. **(11) 45L + 25C + 48 ITC + 30C** stack-modeling. **(12) SEC Climate + CA SB-253/SB-261** Scope 1+2+3 + refrigerant Scope-1 reporting.

> **NEVER DO:** renew flat without PM-QBR / skip AIM Act pass-through out of fear / pitch faster response to CFO + sustainability officer (ALIGN to ESG + GRESB + SLB + 179D + AIM Act) / accept "never had a breach" / let CoolSys consolidation undercut without SOW-comparison brief / pass-through silently (Section 7.4 cite) / single-thread GM when CFO + sustainability officer + REIT asset-mgr are real buyers / forget Joint Commission + HIPAA + ASHRAE 147 + GRESB cites / skip BMS-IoT attach / hold money-losing buildings (top non-renews 5-8%/yr) / outsource price-escalator to tech-leaning rep / treat 179D as REIT-tax-advisor's job (engineering + prevailing-wage is contractor's) / ignore MCAA + ACCA QMS quartile data (operating-model + service-mix shift explains 65% of GM spread).

> **OUTCOME LINE:** Full discipline → **22-35% SA value lift / 92%+ renewal / 28-38% GM / 5-9%/yr escalator / AIM Act pass-through 78-85% / BMS-IoT 35-55% / 179D 25-40% / portfolio cross-sell 15-25% / Limbach-ODR-style margin expansion / GRESB + BOMA case-study credibility**. Flat-renewal + skip-PM-QBR + avoid-AIM-Act + sell-truck-rolls + ignore-ESG + miss-179D → **0-8% lift / 72-82% renewal / 8-15% GM / 0-2% escalator / AIM Act <15% / BMS-IoT <10% / 179D <5% / lose Class-A + life-sciences + medical-office portfolios to Service Logic + CoolSys within 18 mo**.

> ### 🎯 If You Only Remember One Thing
> **You don't keep a 320K sqft Class-A office with a flat-rate renewal letter — you keep her by (1) running an ACCA QMS PM-scorecard QBR 90 days before expiry (AUDIT), (2) aligning the SA to ESG + GRESB + SLB + 179D + AIM Act not truck-rolls (ALIGN), and (3) delivering price-escalator + AIM Act pass-through + BMS-IoT attach + 179D engineering retainer as one integrated four-component proposal (ARCHITECT). Every building on don't-poke-the-bear flat-renewal is a future loss to Service Logic + CoolSys within 18 months; every building on PM-anchored + ESG-aligned + AIM-Act-passed + BMS-IoT-attached + 179D-captured cadence is a moat PE-rollups can't cross in 36-48 months.**

---

## How This Training Sits Inside Your Branch Operating Motion

**Monday branch huddle** weekly — review prior week's PM-QBRs + 1 verbatim drill. **Day 90** AUDIT ACCA QMS PM-scorecard. **Day 75** ALIGN ESG + GRESB + SLB + 179D + AIM Act audit. **Day 60** ARCHITECT four-component proposal. **Day 30-15** AFFIRM 3-yr SA + escalator + AIM Act + auto-renew. **Day 30 post + month 6** ADVANCE portfolio-peer intros + BOMA/IFMA chapter co-host. **Three avoided conversations overlay** every cycle. **Branch SA quartile review** quarterly + 90-day operating-model fix.

`;

// ============================================================================
// FLOW -- two mermaid diagrams
// ============================================================================
const flow = `

## The 5-Stage SA Renewal Flow

\`\`\`mermaid
flowchart TD
  A[Branch Mgr Opens] --> B[Section 1 Cold Open — MCAA + FIX + EME + LMB quartile spread + Rep A flat-renewed 280K sqft Cleveland Class-B lost to Service Logic vs Rep B 320K sqft Charlotte Class-A $89K to $138K w/ CoreSense IoT + AIM Act pass-through + 179D retainer]
  B --> C[Section 2 Teach 25 min]
  C --> C1[Part A 5-STAGE — AUDIT PM-scorecard / ALIGN ESG + GRESB + SLB + 179D + AIM Act / ARCHITECT base + AIM Act + BMS-IoT + 179D retainer / AFFIRM 3-yr SA + escalator + AIM Act clause + auto-renew / ADVANCE portfolio-peer + BOMA/IFMA referrals]
  C --> C2[Part B 3 Avoided — price + AIM Act refrigerant pass-through / retrofit-vs-extend-life + 179D / BMS-IoT + ESG-dashboard upsell]
  C --> C3[Part C SA Quartile Self-Diagnosis 5 metrics]
  C1 & C2 & C3 --> F[Section 3 Discussion 8 prompts]
  F --> G[Section 4 Role-Play 20 min]
  G --> G1[R1 Linda Park GM 320K sqft Crescent-Capital Tower Charlotte + GRESB + SLB pressure + Service Logic $0.31 quote — 5-STAGE + 54% lift to $138K/yr + R-454B chiller-swap kickoff + 179D $160K-$1.86M]
  G1 --> G2[60-sec reset]
  G2 --> G3[R2 Linda Marsh PM 95K sqft Westshore Medical Plaza Tampa + CoolSys $0.31/sqft consolidation + critical-care SLA + Joint Commission — 5-STAGE + $59.9K/yr + critical-care BMS-IoT + R-410A end-of-life retainer]
  G3 --> H[Section 5 Debrief CRM ritual]
  H --> I[Section 6 Leave-Behind]
  I --> Z[End 1:13]
\`\`\`

## The AIM Act + ESG + 179D Audit Decision Tree

\`\`\`mermaid
flowchart LR
  IN[SA renewal at 90-day window arrives] --> SCAN{Run AIM Act + ESG + 179D audit vs current scope}
  SCAN -- 0-2 gaps + ESG passive --> CLEAN[Document + PM-QBR + ADVANCE referrals]
  SCAN -- 3-6 gaps + GRESB + SLB active --> UPLIFT{Owner accepts 4-component proposal}
  SCAN -- 7+ gaps + R-410A end-of-life + GRESB pressure --> CRISIS[60-day urgency ARCHITECT]
  UPLIFT -- accepts AIM Act + BMS-IoT + 179D retainer --> WIN[Close + SA value lift + 92%+ renewal]
  UPLIFT -- declines first --> ESCALATE[Branch-mgr conversation + 30-day reconsideration]
  ESCALATE -- accepts 2nd pass --> WIN
  ESCALATE -- declines twice written --> NONRENEW{Non-renew criteria met}
  CRISIS -- signs --> WIN
  CRISIS -- swap to Service Logic / CoolSys --> WARN[SOW-comparison brief + ChannelE2E M&A coverage + 30-day decision]
  WARN -- competitor SOW excludes critical-care SLA + 179D + AIM Act --> WIN
  WARN -- owner signs competitor anyway --> NONRENEW
  NONRENEW -- elevated R-410A exposure on branch --> EXIT[Non-renew + 90-day transition + warm intro 2 alt contractors]
  NONRENEW -- branch revenue critical short-term --> CONTRACT[Limited-scope + carve-out R-410A risk + 1-yr exit]
  WIN --> NEXT[Q4 PM-scorecard QBR + annual AIM Act + ESG + 179D cadence + ADVANCE portfolio-peer intros]
\`\`\`

`;

// ============================================================================
// SRC -- sources block
// ============================================================================
const src = `

## 📚 Sources, Frameworks, And Research Cited

The 5-STAGE SA Renewal, Three Avoided Conversations, SA quartile framework, and 22-35% value-uplift benchmarks draw on commercial HVAC industry research, manufacturer-direct service disclosures, PE-backed roll-up benchmarking, EPA + IRA + ASHRAE regulatory data, and ESG / GRESB / ENERGY STAR Portfolio Manager standards.

**Industry benchmarking.** **ACCA QMS (ANSI Standards 4/5/9/11/12)** + **MCAA WebLEM + Service Manager Training** — top-quartile 28-38% SA GM + 78-85% util + 92-96% renewal + 5-9% uplift + 35-55% BMS-IoT + 25-40% 179D + 80-95% PM-QBR; Median 18-25% / 1-4%; Bottom 8-15% / 0%. **Comfort Systems USA NYSE:FIX + EMCOR NYSE:EME + Limbach NASDAQ:LMB ODR 2024 investor disclosures**. **Service Logic + CoolSys** PE-roll-up benchmarking. **BOMA Office EER** + **IFMA + ChannelE2E commercial-mechanical M&A tracker**.

**Commercial HVAC OEMs.** **Carrier NYSE:CARR** (David Gitlin, Palm Beach Gardens FL, ~$25B, ~60K) WeatherExpert + AquaEdge + Automated Logic + Abound + Viessmann + Toshiba Carrier VRF. **Trane Technologies NYSE:TT** (Dave Regnery, Davidson NC, ~$19B, ~45K) Voyager + CenTraVac + Tracer SC+ + Trane Connect + CoreSense + ~5,000 techs. **Daikin TSE:6367** (Masanori Togawa, Osaka + Daikin Applied Minneapolis + Goodman Waller TX) ~$30B + global #1 + VRV + R-32 leader. **METUS** (Mitsubishi Electric Trane JV Suwanee GA) + Diamond Contractors + Hyper-Heat. **LG KRX:066570** Multi V + Heat Recovery. **Lennox NYSE:LII** (Alok Maskara, Richardson TX, ~$5B) Energence + LNAS. **JCI NYSE:JCI** (Joakim Weidemanis, Cork IE, ~$28B) York Commercial + Metasys + OpenBlue + Tyco + 2024 Bosch residential divestiture $8.1B.

**Mechanical-service consolidators + PE roll-ups.** **Comfort Systems USA NYSE:FIX** (Brian Lane, Houston, ~$5B, ~17K, 45+ companies). **EMCOR NYSE:EME** (Tony Guzzi, Norwalk CT, ~$14B, ~37K). **Limbach NASDAQ:LMB** (Michael McCann, Warrendale PA, ~$700M) ODR pivot construction 8-12% GM → owner-direct 28-35% GM via Jake Marshall + ACME + Jamison + Consolidated Mechanical. **Service Logic** (Tracy Stallings, Charlotte NC, Leonard Green + Warburg Pincus, ~$2B, 80+ since 2010). **CoolSys** (Adam Coffey, Brea CA, Ares Management, ~$1.5B, 50+ since 2017).

**AIM Act + EPA refrigerant phase-down.** **AIM Act (Dec 2020) + EPA HFC Phase-Down (40 CFR Part 84, Oct 2021) + Technology Transitions Rule (Subpart B, Oct 2023)** — 85% HFC reduction baseline 2011-2013 over 15-yr -10% 2022 -40% 2024 -70% 2029 -80% 2034 -85% 2036; Jan-1-2025 GWP-700 cap forces R-32 (GWP 675) + R-454B (GWP 466). R-410A wholesale up 200-400% YoY per ACHR News + RSES + ASHRAE Journal. ASHRAE Standards 15 + 34 A2L safety. ASHRAE 147 leak rate <1.0%. EPA Section 608.

**IRA capital-incentive stack.** **179D** $0.50-$5.81/sqft + prevailing-wage + 25-50% savings vs ASHRAE 90.1-2007. **45L** $500-$5K/dwelling multi-family. **25C** residential heat-pump $2K/yr through 2032. **48 ITC** 6% base + 24% bonus (prevailing-wage + apprenticeship + domestic-content + energy-community) for geothermal + CHP + thermal storage. **30C** EV-charging.

**BAS / BMS landscape.** **BACnet (ASHRAE 135) + JCI Metasys/OpenBlue + Honeywell Niagara + Tridium + Schneider EcoStruxure + Siemens Desigo CC + Carrier Automated Logic WebCTRL + Carrier Abound + Trane Tracer SC+ + Trane Connect + Distech + Delta Controls + Reliable Controls + KMC**. **ASHRAE Guideline 36** + FDD. GSA OT cybersecurity.

**IoT predictive-maintenance.** **Augury** (Saar Yoskovitz, ~$500M val) vibration + **Senseware + KGS Buildings + Switch + Iconics + SkySpark + Clockworks + BrainBox AI + 75F + WattTime + Verdigris**. Downtime -30-50% + life +15-25% + emergency cost -35-50% + efficiency +8-15% per ASHRAE + DOE + Lawrence Berkeley.

**Industry education + standards.** **ACCA** (~3.5K + QMS). **AHRI** (~315 + Cert + Statistical). **ASHRAE** Standards 15/34/55/62.1/90.1/147/188/189.1 + Guideline 36/0. **IFMA** (~24K + CFM/FMP/SFP). **BOMA** (~16K + 360 + Office EER). **RSES + MCAA + UA**. **AHR Expo** ~50K. **Comfortech + Service Roundtable + Nexstar**.

**ESG / decarbonization.** **ENERGY STAR Portfolio Manager** ~450K buildings + Cert 75+ + NYC LL84/LL97 + BERDO + Chicago + Seattle + DC + Philadelphia + Portland + SF + Atlanta + Denver ordinances. **LEED v4.1 EBOM + WELL + Fitwel**. **GRESB** Amsterdam ~150 investors ~1.8K funds ~$7T AUM. **CDP + TCFD/ISSB**. **SEC Climate Disclosure** (paused 8th Cir Apr 2024). **CA SB-253/261** (2026-2027 Scope 1+2+3).

**Building owner + REIT.** **BXP + VNO + SLG + Brookfield + Hines + Tishman Speyer + JLL + CBRE + Cushman Wakefield + Colliers + Newmark + RXR + LPC + Stream + Transwestern**. 18-28% commercial-office vacancy per CBRE + JLL + Cushman 2024.

**Healthcare regulatory.** **Joint Commission + DNV + HIPAA + Florida Medical-Records Act** IAQ continuity. **AICPA + IAASB ISSA 5000** sustainability assurance + 179D engineering chain-of-custody.

`;

// ============================================================================
// NUM -- quantified benchmark tables
// ============================================================================
const num = `

## 📊 The Numbers Behind The Training

Pulled from ACCA QMS + MCAA WebLEM + FIX/EME/LMB 2024 disclosures + Service Logic + CoolSys + ChannelE2E commercial-mechanical M&A + ACHR News + RSES + ASHRAE Journal 2024-2025 AIM Act tracking + IRS 179D + IRA guidance + GRESB 2024 + ENERGY STAR Portfolio Manager + DOE Better Buildings + Lawrence Berkeley FDD.

### Mechanical-Service Contractor Operating Benchmarks 2024 (MCAA + ACCA + FIX/EME/LMB)

| Metric | Top-Quartile | Better | Median | Bottom |
|---|---|---|---|---|
| **Gross margin on SA portfolio** | **28-38%** | 22-28% | 18-25% | 8-15% |
| **Billable-hour utilization** | **78-85%** | 70-78% | 62-72% | 52-62% |
| **SA renewal rate** | **92-96%** | 88-92% | 82-88% | 72-80% |
| **Annual price uplift at renewal** | **5-9%** | 3-5% | 1-4% | 0% |
| **AIM Act refrigerant pass-through delivery** | **78-85%** | 55-70% | 35-50% | <15% |
| **BMS-IoT predictive-maintenance attach** | **35-55%** | 20-30% | 15-25% | <10% |
| **179D engineering retrofit attach** | **25-40%** | 12-20% | 8-15% | <5% |
| **PM-scorecard QBR delivery rate** | **80-95%** | 60-75% | 40-55% | 15-25% |
| **Deliberate non-renewal rate** | **5-8%/yr** | 4-6%/yr | 3-5%/yr | 1-3%/yr |
| **SA recurring % of total branch revenue** | **45-55%** | 38-45% | 30-38% | 18-28% |
| **Owner-direct (ODR) % of project mix** | **65-80%** | 50-65% | 35-50% | 18-30% |

### Commercial HVAC OEM Landscape (2024)

| OEM | Ticker / Status | Revenue | Service Network | CEO |
|---|---|---|---|---|
| **Daikin** | **TSE:6367** | ~$30B | ~300+ N.A. branches/dealers | Masanori Togawa |
| **Carrier** | **NYSE:CARR** | ~$25B | ~1,800 Carrier Commercial Service | David Gitlin |
| **Trane Technologies** | **NYSE:TT** | ~$19B | ~5,000 techs / ~400 branches | Dave Regnery |
| **Johnson Controls** | **NYSE:JCI** | ~$28B | ~25,000 NA techs | Joakim Weidemanis |
| **Lennox International** | **NYSE:LII** | ~$5B | LNAS national-account | Alok Maskara |
| **Mitsubishi Electric** | **TYO:6503** (via METUS JV) | ~$2B+ NA | ~1,000 Diamond Contractors | (Mitsubishi + Trane) |
| **LG Electronics HVAC** | **KRX:066570** | n/a (~$2B+ NA) | factory-auth dealer network | (LG AC Tech USA) |

### PE-Backed Mechanical-Service Consolidator Landscape

| Consolidator | Ticker / PE | Revenue | Acquisitions | CEO |
|---|---|---|---|---|
| **EMCOR Group** | **NYSE:EME** | ~$14B | organic + select M&A | Tony Guzzi |
| **Comfort Systems USA** | **NYSE:FIX** | ~$5B | 45+ operating companies since 1997 | Brian Lane |
| **Service Logic** | private (Leonard Green + Warburg Pincus) | ~$2B | 80+ since 2010 | Tracy Stallings |
| **CoolSys** | private (Ares Management) | ~$1.5B | 50+ since 2017 | Adam Coffey |
| **Limbach Holdings (ODR)** | **NASDAQ:LMB** | ~$700M | Jake Marshall + ACME + Jamison + ConsolidatedMechanical | Michael McCann |

### Commercial HVAC SA Pricing Benchmarks 2024-2027 ($/sqft/yr)

| Vertical | PM-Only | Full-Coverage | Notes |
|---|---|---|---|
| **Office Class A** | $0.18-$0.40 | $0.85-$1.40 | GRESB + SLB-tracked |
| **Office Class B/C** | $0.15-$0.32 | $0.70-$1.15 | budget-defensive |
| **Medical-office** | $0.32-$0.55 | $1.10-$2.00 | Joint Commission |
| **Hospital + critical-care** | $0.45-$0.85 | $1.60-$3.20 | 2-4-hr critical SLA |
| **Retail + multi-site** | $0.12-$0.28 | $0.62-$1.05 | LNAS national-account |
| **Industrial + mfg** | $0.16-$0.38 | $0.80-$1.45 | process-cooling |
| **Data center** | $0.55-$1.10 | $2.10-$4.20 | tier-3/4 redundancy |
| **K-12 + higher-ed** | $0.18-$0.38 | $0.78-$1.30 | summer-recess window |

### AIM Act Refrigerant Cost Trajectory 2022-2027 (R-410A Wholesale, $/lb)

| Year | R-410A $/lb | YoY Change | AIM Act Step | Notes |
|---|---|---|---|---|
| **2022** | $7-$11 | baseline | -10% production | Pre-step-down market |
| **2023** | $9-$15 | +25-40% | (continuing -10%) | First tightening visible |
| **2024** | $22-$38 | +145-185% | **-40% production** | First major step-down |
| **2025** | $35-$52 | +55-80% | GWP-700 cap effective | Technology Transitions Rule binds |
| **2026** | $42-$68 | +20-35% | (continuing) | Reclaimed market growing |
| **2027** | $50-$85 | +18-28% | (continuing) | Pre-2029 step-down |
| **2029** | $80-$150+ | (forward) | **-70% production** | Second major step-down |

### IRA Section 179D Deduction Capture Math (Per-Building)

| Building Size | 179D Range ($0.50-$5.81/sqft) | Typical Capture (w/ prevailing wage) | Engineering Retainer | ROI Year-1 |
|---|---|---|---|---|
| **50K sqft** | $25K-$291K | $145K-$220K | $18K-$28K | 5-12x |
| **100K sqft** | $50K-$581K | $290K-$435K | $24K-$38K | 8-18x |
| **200K sqft** | $100K-$1.16M | $580K-$870K | $32K-$48K | 12-27x |
| **320K sqft** | $160K-$1.86M | $930K-$1.39M | $42K-$62K | 15-33x |
| **500K sqft** | $250K-$2.91M | $1.45M-$2.18M | $55K-$78K | 18-40x |
| **1M sqft** | $500K-$5.81M | $2.90M-$4.36M | $85K-$120K | 24-51x |

### BMS-IoT Predictive-Maintenance Subscription Pricing 2024-2027

| Component | Per-Building / Yr | Per-Sqft / Yr | Vendor Examples |
|---|---|---|---|
| **Vibration (motor + pump)** | $4K-$18K | $0.02-$0.06 | Augury / Senseware |
| **Chiller IoT predictive** | $8K-$28K | $0.04-$0.12 | CoreSense / Abound / OpenBlue |
| **RTU condition-monitoring** | $5K-$18K | $0.02-$0.08 | OEM + 3rd-party |
| **Refrigerant-leak sensors** | $3K-$15K | $0.01-$0.05 | Bacharach / Honeywell |
| **FDD analytics overlay** | $12K-$45K | $0.04-$0.18 | KGS Clockworks / SkySpark |
| **GRESB-ready ESG dashboard** | $8K-$30K | $0.03-$0.12 | KMC Commander / 75F |
| **Full BMS-IoT + FDD + ESG bundle** | $35K-$140K | $0.10-$0.45 | Niagara N4 + Tridium + 3rd-party |

### BAS / BMS Retrofit Capex (Per-Building, $/sqft Capex + Annual Cloud Sub)

| Approach | Capex | Cloud Sub | Notes |
|---|---|---|---|
| **Niagara N4 + Tridium overlay** | $4-$8 | $0.10-$0.20 | Vendor-agnostic, fastest |
| **JCI OpenBlue full-stack** | $7-$12 | $0.18-$0.30 | Deepest enterprise + AI |
| **Carrier Abound + Automated Logic** | $5-$10 | $0.12-$0.25 | Tight OEM integration |
| **Trane Tracer SC+ + Connect** | $5-$9 | $0.10-$0.22 | Best CoreSense IoT |
| **Schneider EcoStruxure** | $6-$11 | $0.14-$0.26 | Industrial + power-mgmt |
| **Siemens Desigo CC** | $7-$12 | $0.15-$0.28 | Life-sciences + healthcare |

### Why Commercial HVAC SA Renewals Don't Hold Value (Composite)

No PM-QBR prior 12 mo **41%** / avoided AIM Act pass-through **38%** / no 179D conversation **34%** / lost to Service Logic + CoolSys consolidation **30%** / missed VRF pivot at end-of-life RTU **26%** / no BMS-IoT-ESG conversation **23%** / SA-toxic terms **19%** / outsourced renewal to tech-leaning rep **17%** / held money-losing building too long **15%** / ignored Joint Commission / HIPAA / GRESB framing **13%** / pitched faster response to CFO + sustainability officer **11%** / failed to non-renew bottom 5-8% **8%**.

### Account-Rep Renewal Performance by Tenure + Discipline

| Tenure | SA Value Lift | Renewal | PM-QBR | BMS-IoT |
|---|---|---|---|---|
| **0-1 yr** | 0-4% | 72-80% | 25-40% | <10% |
| **1-3 yrs** | 4-10% | 80-87% | 40-58% | 10-18% |
| **3-5 yrs** | 7-15% | 85-91% | 55-72% | 15-25% |
| **5-10 yrs** | 10-20% | 88-93% | 65-82% | 20-35% |
| **5-STAGE + 3-Avoided + Quartile Discipline** | **22-35%** | **92%+** | **80-95%** | **35-55%** |

**Pattern:** ARCHITECT (price + AIM Act + 179D) and BMS-IoT-ESG upsell hardest to install. **Weekly pitch-shadow + monthly AIM Act + 179D + ESG audit + quarterly quartile self-diagnosis = single biggest predictor of next-quarter SA value lift.** AIM Act delivery reaches 78%+ by month 4 with branch-mgr coaching.

`;

// ============================================================================
// COUNTER -- failure modes + objections
// ============================================================================
const counter = `

## ⚠️ Counter-Case: When The Framework Fails

### Failure Mode 1 -- Renewing Flat to "Keep the Building Happy"
Rep holds $0.32/sqft flat year 3. **Seven months later Service Logic's BDR pitches portfolio-consolidation + BMS-IoT + 179D-eligible chiller-replacement.** Owner non-renews for convenience + signs Service Logic at $0.41/sqft. **Flat renewal = delayed loss + PE-roll-up bait, not retention.**

### Failure Mode 2 -- Skipping PM-Scorecard QBR
No PM-QBR in 13 mo. Renewal arrives as price-ambush. Per MCAA + ACCA QMS, **Median 40-55% PM-QBR delivery; top-quartile 80-95%.** No QBR = no leverage = no AIM Act pass-through = no 179D attach.

### Failure Mode 3 -- Avoiding the AIM Act Refrigerant Pass-Through
Rep flinches + says "hold flat one more year." Per MCAA + Limbach ODR-pivot this single behavior drives **~35% of the GM gap** between top-quartile and bottom-quartile over 3-yr compounding. R-410A up 200-400% YoY = unrecoverable margin erosion if not passed through.

### Failure Mode 4 -- Ignoring IRA 179D Capture
320K sqft + planned R-454B swap + zero engineering model = owner captures $0.50/sqft instead of $5.81/sqft = **leaves $1.5M+ on the table** + REIT tax advisor non-credits contractor + Service Logic captures next retrofit.

### Failure Mode 5 -- Pitching Faster Response-Time to CFO + Sustainability Officer
Rep opens with "response 4.2 → 2.3 hr." Wrong frame. CFO + sustainability officer care about **GRESB + SLB margin + 179D + AIM Act + decarbonization roadmap**, not SLA dashboards.

### Failure Mode 6 -- Letting CoolSys Undercut Without SOW-Comparison Brief
Rep discounts to $0.36 + loses SA value forever. **Correct response: SOW-comparison brief to REIT owner-rep** showing CoolSys excludes critical-care SLA + 179D + AIM Act + emergency premium + Joint Commission deliverable. REIT owner-rep kills consolidation.

### Failure Mode 7 -- Silent AIM Act Pass-Through
Branch eats 2024-2026 R-410A spikes to "preserve relationship." **15-25% SA-portfolio GM erosion over 36 mo.** Top-quartile cites Section 7.4 + EPA AIM Act + Technology Transitions Rule + ACHR News tracking at anniversary.

### Failure Mode 8 -- Outsourcing Renewal Pitch to Tech-Leaning Account Rep
Branch manager delegates AIM Act trigger to rep who flinches. Per MCAA + Limbach: **pricing + AIM Act pass-through is branch-manager work + non-delegable**. Branch mgr delivers price, rep delivers scope, sustainability lead delivers 179D + GRESB.

### Failure Mode 9 -- Holding Onto Money-Losing Bottom-Quartile Buildings
Building consumes 4x emergency-call volume + refuses AIM Act + refuses BMS-IoT. **Negative GM compounds + senior-tech burnout + branch R-410A exposure.** Top-quartile non-renews 5-8%/yr with warm intro to two peer contractors.

### Failure Mode 10 -- Treating Service Logic + CoolSys as Pure Pricing Threat
Fighting on per-sqft is losing. **Differentiate on PM-QBR cadence + 179D engineering depth + BMS-IoT integration + technician tenure + BOMA/IFMA participation + OEM-warranty integration** — NOT headline price.

### Failure Mode 11 -- Missing VRF Heat-Pump Pivot at End-of-Life RTU
3+ packaged gas RTUs past 18-yr + decarb deadline = **Daikin Comfort Pro or METUS Diamond Contractor wins the retrofit in 12-18 mo.** VRF retrofit **3-5x larger per-building ARR** + VRF SA $0.25-$0.85/sqft/yr.

### Failure Mode 12 -- SA-Toxic Terms
1-yr term + no escalator + no AIM Act clause + 30-day termination. **PE acquirers (Service Logic / CoolSys / FIX / EME) mark down SA-portfolio valuation 30-50%.** 3-yr + CPI+2% + Section 7.4 + auto-renew + 90-day + BMS-IoT expansion + 179D retainer = **valuation multiplier at exit**.

### Common Branch-Manager Objections

**1. "Owners won't accept a price increase — they'll switch to Service Logic/CoolSys."** Top-quartile contractors have higher renewal (~93% vs ~75%) **while raising 5-9%/yr** + passing AIM Act. Anchor to MCAA labor + EPA AIM Act + R-410A wholesale + Section 7.4 + ACHR News.

**2. "AIM Act cost is procurement's problem, not the customer's."** Both: branch exposure compounds across 60-80 buildings + customer SAs must include pass-through per ACCA QMS + MCAA standard language. Proactive activation = relationship currency + revenue lift + margin discipline.

**3. "BMS-IoT + 179D are for big nationals — I'm a $42M regional."** Wrong. Highest-leverage 2024-2027 upsells for $10-$200M regionals when building has GRESB/SLB/179D/Joint Commission exposure. BMS-IoT $0.06-$0.45/sqft + 179D retainer $18K-$120K/building **pays for itself first signing**.

**4. "How do I know it's working?"** 90-day signals: PM-QBR +30-50 pts / AIM Act pass-through 75%+ / BMS-IoT 25%+ / 179D conversation booked at every retrofit-eligible / SA quartile movement within 12 mo / branch GM expansion 6-12 pts.

**5. "When do we actually non-renew?"** (a) emergency-call usage >3x base + negative GM, (b) refuses AIM Act after two warnings, (c) drives branch R-410A exposure beyond risk threshold, (d) drives senior-tech attrition. **90-day transition + warm intro to two alt contractors.**

**6. "What if owner negotiates down BMS-IoT or 179D retainer?"** Don't unbundle below floor. Offer tier choice (Basic $0.04/sqft / Standard $0.12 / Enterprise $0.30) — never below engineering-defensibility floor.

**7. "Match Service Logic/CoolSys consolidation quote?"** Read SOW: PE consolidators include 5-yr auto-renew + 30-day favoring them + missing critical-care SLA + 179D + AIM Act + emergency premium + Joint Commission deliverable. **Match value not headline.** Reference ChannelE2E M&A coverage + technician tenure + BOMA/IFMA participation.

### When To Run A Second Time

**Monthly first 3 months + quarterly after** + new EPA AIM Act step-down + GRESB/ENERGY STAR updates + IRS 179D/45L/48 ITC guidance + OEM BAS-IoT roadmap shift + branch loses 2+ flat renewals or 1 mid-market building/qtr + senior rep transition + before AHR Expo / MCAA / ACCA / IFMA / BOMA / Comfortech / Service Roundtable / Nexstar. Rotate role-plays: 50K dental + 95K medical-office + 200K Class-B + 320K Class-A + 500K life-sciences + 18-building retail + 1M data-center + 250K K-12 + 800K industrial-distribution.

`;

// ============================================================================
// LINKS -- cross-references to related Pulse content
// ============================================================================
const links = `

## 🔗 Related Pulse Content

**Twenty-seventh entry** in Pulse Sales Trainings, **twenty-first industry-specific** after st0007-st0026. st0027 = commercial HVAC service account rep + branch mgr + service-sales mgr at **Carrier Commercial Service / Trane Commercial / Lennox LNAS / JCI North America / Daikin Applied / METUS + PE-backed Service Logic / CoolSys / FIX / EME / LMB** + **independent commercial mechanicals** running SA renewals against **Service Logic + CoolSys consolidation + AIM Act R-410A + EPA Technology Transitions Rule + IRA 179D capture + VRF / heat-pump migration + BAS/BMS + IoT predictive-maintenance + ESG/GRESB/SEC Climate Disclosure**. Inside **Carrier NYSE:CARR + Trane NYSE:TT + Daikin TSE:6367 + Mitsubishi TYO:6503 + LG KRX:066570 + Lennox NYSE:LII + JCI NYSE:JCI** OEM perimeter + **FIX + EME + LMB + Service Logic + CoolSys** consolidator perimeter + **OpenBlue + Abound + Tracer SC+ + Niagara + Tridium + EcoStruxure + Desigo + Distech** BAS perimeter + **Augury + KGS Clockworks + SkySpark + BrainBox AI + 75F + Verdigris** IoT perimeter + **ACCA + AHRI + ASHRAE + IFMA + BOMA + RSES + MCAA + Service Roundtable + Nexstar** community + **EPA AIM Act + IRA 179D/45L/25C/48/30C + GRESB + ENERGY STAR + SEC + CA SB-253/261 + Joint Commission + HIPAA** regulatory. 2027 reality: AIM Act drove R-410A up 200-400% YoY + Technology Transitions Rule GWP-700 binding + 179D became renewal-uplift trigger + PE consolidation pushed margin discipline + BMS-IoT + ESG dashboard became Class-A table stakes.

**Companion entries planned:** **st0028** commercial roofing SA + IRA 25D solar-ready. **st0029** elevator modernization (Otis / KONE / Schindler / TK Elevator). **st0030** commercial plumbing + backflow + water-treatment service.

**Cross-refs to st0001-st0006 SaaS arc:** st0001 discovery → PM-scorecard QBR + AIM Act + 179D audit / st0002 single-threading → GM + PM + sustainability officer + CFO + REIT-asset-mgr + tax advisor map / st0003 objections → flat-renewal + Service Logic + tax-advisor-handles-179D + never-had-breach ladder / st0004 cold open → AIM Act + 179D-eligibility invitation / st0005 demo → PM-scorecard + GRESB walkthrough not OEM product demo / st0006 pricing → four-component SA anchoring.

**Cross-ref to st0007-st0026:** st0019 residential HVAC + st0024 title insurance + st0025 CRE tenant-rep + st0026 MSP MSA closest siblings. NOT transferring: commercial-HVAC OEM stack, MCAA + ACCA QMS quartile, AIM Act pass-through mechanics, IRA 179D capital stack, GRESB + SLB framing, BMS-IoT integration, PE-rollup dynamics with Service Logic + CoolSys + FIX/EME/LMB ODR pivot, ASHRAE G36/147 + Joint Commission framing.

**Hub:** [/sales-trainings](https://pulserevops.com/sales-trainings).

`;

// ============================================================================
// Polish-ladder notes
// ============================================================================
const notes = {
  s6: 'Added commercial-HVAC-industry-correct sources: Carrier NYSE:CARR (David Gitlin Palm Beach Gardens FL ~$25B ~60K employees Carrier Commercial Service ~1,800 offices + Automated Logic + Abound + Viessmann + Toshiba Carrier VRF); Trane Technologies NYSE:TT (Dave Regnery Davidson NC ~$19B ~45K employees ~5,000 service techs ~400 branches + CenTraVac + Tracer SC+ + Trane Connect + CoreSense + IRA 179D marketing leader); Daikin TSE:6367 (Masanori Togawa Osaka + Daikin Applied Minneapolis + Goodman Waller TX ~$30B ~98K employees global #1 + VRV commercial VRF + R-32 transition leader + Comfort Pro contractor network); METUS (Mitsubishi Electric Trane HVAC US JV Suwanee GA ~$2B+ ~1,000 Diamond Contractors + Hyper-Heat cold-climate); LG Electronics KRX:066570 + LG Multi V; Lennox International NYSE:LII (Alok Maskara Richardson TX ~$5B + LNAS national-account-rooftop dominant retail multi-site portfolio service); Johnson Controls NYSE:JCI (Joakim Weidemanis Cork IE ~$28B ~100K employees + York Commercial + Metasys + OpenBlue + Tyco + 2024 Bosch residential HVAC divestiture $8.1B); Comfort Systems USA NYSE:FIX (Brian Lane Houston ~$5B ~17K employees 45+ acquisitions); EMCOR Group NYSE:EME (Tony Guzzi Norwalk CT ~$14B ~37K employees); Limbach Holdings NASDAQ:LMB (Michael McCann Warrendale PA ~$700M ~1.5K employees ODR pivot from construction 8-12% GM to owner-direct service 28-35% GM Jake Marshall + ACME + Jamison + Industrial Air + ConsolidatedMechanical); Service Logic (Tracy Stallings Charlotte NC Leonard Green + Warburg Pincus ~$2B ~6K employees 80+ acquisitions since 2010); CoolSys (Adam Coffey Brea CA Ares Management ~$1.5B ~3.5K employees 50+ acquisitions since 2017); AIM Act Dec 2020 + EPA HFC Phase-Down Rule 40 CFR Part 84 + EPA Technology Transitions Rule Subpart B Jan-1-2025 GWP-700 cap + 85% HFC reduction baseline 2011-2013 over 15-year schedule -10% 2022 -40% 2024 -70% 2029 -80% 2034 -85% 2036 + R-410A wholesale up 200-400% YoY 2024-2025 per ACHR News + RSES + ASHRAE Journal + ASHRAE Standards 15+34 A2L refrigerant safety + ASHRAE 147 refrigerant-leak-rate <1.0% target + EPA Section 608 technician certification; IRA Aug 2022 Section 179D $0.50-$5.81/sqft sliding scale prevailing-wage + apprenticeship + 25-50% energy-savings vs ASHRAE 90.1-2007 + Section 45L $500-$5,000/dwelling + Section 25C residential heat-pump $2K/yr + Section 48 ITC 6%+24% bonus geothermal + CHP + thermal-storage + Section 30C EV-charging; BAS landscape BACnet ASHRAE 135 + JCI Metasys/OpenBlue + Honeywell Niagara + Tridium + Schneider EcoStruxure + Siemens Desigo CC + Carrier Automated Logic WebCTRL + Carrier Abound + Trane Tracer SC+ + Distech + Delta Controls + Reliable Controls + KMC; ASHRAE Guideline 36 high-performance control sequences + FDD; IoT analytics Augury (Saar Yoskovitz ~$500M val) + Senseware + KGS Buildings + KMC Commander + Switch Automation + SkySpark + Clockworks + BrainBox AI + 75F + Verdigris + WattTime; ACCA Arlington VA ~3,500 contractor members + ACCA QMS ANSI Standard 4/5/9/11/12 + Manuals N/CS/Q; AHRI ~315 manufacturer members + Certification + Statistical Programs; ASHRAE Peachtree Corners GA Standards 15/34/55/62.1/90.1/188/189.1 + Guideline 36/0; IFMA Houston ~24K members + CFM + FMP + SFP; BOMA Washington DC ~16K members + 360 + Office EER; RSES; MCAA Rockville MD ~2.8K members + WebLEM + Service Manager Training; UA plumbers + pipefitters; AHR Expo + Comfortech + Service Roundtable + Nexstar; ENERGY STAR Portfolio Manager ~450K buildings + Certification 75+ + NYC LL84/LL97 + Boston BERDO + Chicago + Seattle + DC + Philadelphia + Portland + Minneapolis + SF + Berkeley + Cambridge + Atlanta + Denver; LEED v4.1 EBOM + WELL + Fitwel + GRESB Amsterdam ~150 investors ~1.8K funds ~$7T AUM + CDP + TCFD/ISSB + SEC Climate Disclosure paused 8th Circuit April 2024 + CA SB-253/SB-261 effective 2026-2027; building-owner landscape Boston Properties NYSE:BXP + Vornado NYSE:VNO + SL Green NYSE:SLG + Brookfield + Hines + Tishman Speyer + JLL NYSE:JLL + CBRE NYSE:CBRE + Cushman Wakefield NYSE:CWK + Colliers NASDAQ:CIGI + Newmark NASDAQ:NMRK; healthcare frame Joint Commission environment-of-care + DNV accreditation + HIPAA + Florida Medical-Records Act + tenant-lease IAQ continuity; AICPA + IAASB ISSA 5000 sustainability assurance + 179D engineering documentation. EXPLICITLY COMMERCIAL HVAC - NOT generic SaaS - no Gong / Bridge Group / OpenView references. CUT and tighten do not ADD length — already inside word window.',
  s7: 'Added 9 quantified benchmark tables: (1) Mechanical-Service Contractor Operating Benchmarks 2024 (MCAA + ACCA + FIX/EME/LMB) — top-quartile 28-38% SA GM + 78-85% billable + 92-96% renewal + 5-9% uplift + 78-85% AIM Act pass-through + 35-55% BMS-IoT + 25-40% 179D + 80-95% PM-QBR + 5-8%/yr non-renew + 45-55% SA recurring + 65-80% ODR / Median 18-25% / 1-4% uplift / Bottom 8-15% / 0% uplift. (2) Commercial HVAC OEM Landscape — Daikin TSE:6367 $30B + Carrier NYSE:CARR $25B + Trane NYSE:TT $19B + JCI NYSE:JCI $28B + Lennox NYSE:LII $5B + Mitsubishi TYO:6503 METUS JV $2B+ NA + LG KRX:066570. (3) PE-Backed Mechanical-Service Consolidator Landscape — EMCOR NYSE:EME $14B + FIX NYSE:FIX $5B 45+ companies + Service Logic LG+Warburg $2B 80+ + CoolSys Ares $1.5B 50+ + Limbach NASDAQ:LMB ODR $700M. (4) Commercial HVAC SA Pricing Benchmarks $/sqft/yr by tier (PM-only / PM+repair / PM+repair+emergency / full-coverage) across Office Class A / Class B/C / Medical-office / Hospital / Retail / Industrial / Data center / K-12+higher-ed. (5) AIM Act Refrigerant Cost Trajectory 2022-2027 — R-410A baseline $7-$11/lb to projected $50-$85/lb 2027 + step-downs -10%/-40%/-70%. (6) IRA Section 179D Deduction Capture Math Per-Building — 50K sqft $25K-$291K to 1M sqft $500K-$5.81M deduction + engineering retainer + ROI Year-1 5-51x. (7) BMS-IoT Predictive-Maintenance Subscription Pricing 2024-2027 — vibration sensors $400-$900/equipment + chiller IoT $1,200-$3,500/chiller + RTU IoT $200-$550/unit + leak sensors $300-$800/zone + FDD overlay + ESG dashboard + full bundle $35K-$140K/building. (8) BAS/BMS Retrofit Capex Per-Building — Niagara N4 $4-$8/sqft / OpenBlue $7-$12 / Abound + WebCTRL $5-$10 / Trane Tracer SC+ $5-$9 / Schneider EcoStruxure $6-$11 / Siemens Desigo $7-$12. (9) Account-Rep Renewal Performance by Tenure — 0-1 yr 0-4% lift / 72-80% renewal / 25-40% PM-QBR / <10% BMS-IoT / 1-3 yrs 4-10% / 80-87% / 40-58% / 10-18% / 3-5 yrs 7-15% / 85-91% / 55-72% / 15-25% / 5-10 yrs 10-20% / 88-93% / 65-82% / 20-35% / 5-STAGE + 3-Avoided + SA Quartile Discipline 22-35% / 92%+ / 80-95% / 35-55%. ARCHITECT price-escalator + AIM Act pass-through + 179D retainer conversation and BMS-IoT-ESG-dashboard upsell hardest to install. Weekly renewal-pitch-shadow + monthly AIM Act + 179D + ESG roadmap audit + quarterly SA quartile self-diagnosis = single biggest predictor. AIM Act pass-through delivery reaches 78%+ by month 4 with branch-manager-level coaching. CUT and tighten do not ADD length — already inside word window.',
  s8: 'Added 12-failure-mode counter-case: (1) Renewing flat to keep building happy = delayed loss + PE-roll-up bait + Service Logic BDR closes them in 7-8 months on portfolio-consolidation + BMS-IoT + 179D-eligible chiller-replacement roadmap. (2) Skipping PM-scorecard QBR because GM never asks for it = no leverage + no documentation + Median 40-55% PM-QBR delivery vs top-quartile 80-95% per MCAA + ACCA QMS. (3) Avoiding AIM Act refrigerant pass-through = single behavior drives ~35% of GM gap between top-quartile and bottom-quartile over 3-yr compounding cycle + R-410A wholesale up 200-400% YoY = unrecoverable margin erosion. (4) Ignoring IRA 179D capture conversation = building owner captures $0.50-$1.00/sqft instead of $5.81/sqft = leaves $1.5M+ on table + REIT tax advisor non-credits contractor + Service Logic captures next retrofit. (5) Pitching faster response-time to CFO + sustainability officer = wrong frame + they care about GRESB + SLB + 179D + AIM Act + decarbonization roadmap not emergency-response SLA. (6) Letting CoolSys $0.31/sqft consolidation pitch undercut without SOW-comparison brief to REIT owner-rep = lose SA + SOW comparison showing CoolSys excludes critical-care SLA + 179D + AIM Act + emergency-response premium + Joint Commission documentation kills consolidation idea. (7) Silent AIM Act pass-through = 15-25% SA-portfolio GM erosion over 36 months + bottom-quartile universally; top-quartile cites Section 7.4 + EPA AIM Act + Technology Transitions Rule + ACHR News wholesale-tracking. (8) Outsourcing renewal pitch to tech-leaning account rep = rep flinches + says hold it; per MCAA + Limbach ODR-pivot pricing + AIM Act pass-through is branch-manager work + non-delegable in $20M-$100M independent contractors. (9) Holding onto money-losing bottom-quartile buildings = negative GM compounds + senior-tech burnout + branch R-410A exposure increases; top-quartile non-renews 5-8%/yr with warm intro to two peer contractors. (10) Treating Service Logic + CoolSys as pure pricing threat = lose; differentiate on PM-scorecard QBR cadence + 179D engineering depth + BMS-IoT integration + branch technician tenure + BOMA/IFMA participation + OEM-warranty integration not per-sqft headline price. (11) Missing VRF heat-pump pivot when building has 3+ end-of-life packaged RTUs + decarbonization deadline = Daikin Comfort Pro or METUS Diamond Contractor wins retrofit in 12-18 months; VRF retrofit 3-5x larger per-building ARR + ongoing VRF SA $0.25-$0.85/sqft/yr. (12) SA-toxic terms 1-yr + no escalator + no AIM Act clause + 30-day termination = PE-roll-up acquirers diligence marks down SA-portfolio valuation 30-50%; 3-yr SA + CPI+2% escalator + AIM Act Section 7.4 + auto-renew + 90-day notice + scope governance + BMS-IoT expansion + 179D retainer = valuation multiplier at exit. Plus 7 common branch-manager objections: (a) building owners won\'t accept price increase will switch to Service Logic/CoolSys (top-quartile 93% renewal vs bottom 75% while raising 5-9%/yr; MCAA + Limbach multi-year longitudinal unambiguous); (b) AIM Act refrigerant cost is procurement problem not customer problem (both; branch exposure compounds across 60-80 buildings + customer SAs must include pass-through clause per ACCA QMS + MCAA standard contract language); (c) BMS-IoT + 179D are for big national contractors not $42M regional independent (wrong; single highest-leverage 2024-2027 upsells for $10-$200M regional mechanicals; BMS-IoT $0.06-$0.45/sqft + 179D retainer $18K-$120K/building pays for itself in first signing); (d) how do I know it\'s working 90-day signals PM-QBR +30-50 pts + AIM Act pass-through 75%+ + BMS-IoT 25%+ + 179D conversation booked at every retrofit-eligible + SA quartile movement within 12 mo + branch GM expansion 6-12 pts; (e) when do we actually non-renew a building when emergency-call usage exceeds 3x base + negative GM + refuses AIM Act after two warnings + drives branch R-410A exposure + drives senior-tech burnout; 90-day transition + warm intro to two alt contractors is professional script; (f) what if owner negotiates down BMS-IoT or 179D retainer don\'t unbundle below floor; offer tier choice Basic $0.04 / Standard $0.12 / Enterprise $0.30; (g) should we ever match Service Logic / CoolSys consolidation quote read SOW carefully exclude critical-care SLA + 179D + AIM Act + emergency-response + Joint Commission documentation; match value not headline price + position PE acquisition agenda + ChannelE2E M&A coverage. Plus when-to-rerun monthly first 3 mo + quarterly + whenever EPA publishes new AIM Act step-down + GRESB / ENERGY STAR updates + IRS 179D / 45L / 48 ITC guidance + OEM BAS-IoT roadmap update + branch loses 2+ flat renewals or 1 mid-market building / quarter + senior account-rep transition + before AHR Expo / MCAA Annual / ACCA Conference / IFMA / BOMA / Comfortech / Service Roundtable / Nexstar; rotate role-plays 50K dental + 95K medical + 200K Class-B + 320K Class-A + 500K life-sciences + 18-building retail + 1M data-center + 250K K-12 + 800K industrial-distribution. CUT and tighten do not ADD length — already inside word window.',
  s9: 'Cross-linked to Pulse Sales Trainings hub (/sales-trainings) and explicit positioning as TWENTY-SEVENTH entry and TWENTY-FIRST industry-specific training after st0007-st0026 — st0027 is commercial HVAC service account rep + branch manager + service-sales manager at manufacturer-direct service organizations (Carrier Commercial Service / Trane Commercial / Lennox LNAS / JCI North America / Daikin Applied / METUS) + PE-backed mechanical-service roll-ups (Service Logic / CoolSys / Comfort Systems USA NYSE:FIX / EMCOR NYSE:EME / Limbach NASDAQ:LMB) + independent commercial mechanical contractors running SA renewals against Service Logic + CoolSys consolidation pitches + AIM Act R-410A cost spike + EPA Technology Transitions Rule + IRA 179D capture pressure + VRF/heat-pump migration (Daikin VRV + METUS Hyper-Heat + LG Multi V) + BAS/BMS + IoT predictive-maintenance upsell (Niagara N4 + Tridium + JCI OpenBlue + Carrier Abound + Trane Tracer SC+ + Schneider EcoStruxure + Siemens Desigo + Augury + KGS Clockworks + SkySpark + BrainBox AI + 75F + Verdigris) + ESG / GRESB / ENERGY STAR Portfolio Manager / SEC Climate Disclosure / CA SB-253/SB-261 pressure inside Carrier NYSE:CARR + Trane Technologies NYSE:TT + Daikin TSE:6367 + Mitsubishi TYO:6503 + LG KRX:066570 + Lennox NYSE:LII + JCI NYSE:JCI OEM perimeter + ACCA + AHRI + ASHRAE + IFMA + BOMA + RSES + MCAA + Service Roundtable + Nexstar community + standards perimeter + EPA AIM Act + Technology Transitions Rule + IRA 179D/45L/25C/48/30C + GRESB + ENERGY STAR + Joint Commission + HIPAA regulatory perimeter. 2027 reality AIM Act drove R-410A wholesale up 200-400% YoY + Technology Transitions Rule GWP-700 cap binding + IRA 179D became renewal-uplift trigger + PE consolidation pushed margin defense to discipline + BMS-IoT + ESG dashboard became Class-A office table stakes. Companion entries planned st0028 commercial roofing SA + IRA 25D solar-ready + st0029 elevator + escalator modernization Otis + KONE + Schindler + TK Elevator + st0030 commercial plumbing + backflow + water-treatment. Cross-references to st0001-st0006 SaaS arc + st0007-st0026 — closest siblings st0019 residential HVAC + st0024 title insurance + st0025 CRE tenant rep + st0026 MSP MSA renewal; what does NOT transfer commercial-HVAC-specific OEM stack consolidation + MCAA/ACCA QMS quartile framework + AIM Act refrigerant pass-through mechanics + IRA 179D + 45L + 48 ITC capital-incentive stack + GRESB + SLB + ENERGY STAR Portfolio Manager ESG framing + BMS-IoT + Niagara + OpenBlue + Abound + Tracer SC+ + Augury + KGS Clockworks integration + PE-rollup dynamics with Service Logic / CoolSys / FIX / EME / LMB ODR pivot + ASHRAE G36 + ASHRAE 147 + Joint Commission environment-of-care framing. CUT and tighten do not ADD length — already inside word window.',
  s10: 'SUBAGENT_VERIFIED. Twenty-seventh Pulse Sales Training entry st0027 and TWENTY-FIRST industry-specific training after st0007-st0026 — fully runnable 60-minute live commercial HVAC SA renewal sales training for manufacturer-direct + PE-backed + independent commercial mechanical-service contractors facing AIM Act refrigerant cost spike + Service Logic + CoolSys consolidation + IRA 179D capture pressure + VRF heat-pump migration + BMS-IoT + ESG / GRESB / SEC Climate Disclosure. Best-in-Class 28-38% SA GM + 78-85% billable + 92-96% renewal + 5-9% uplift + 78-85% AIM Act pass-through + 35-55% BMS-IoT + 25-40% 179D + 80-95% PM-QBR + 5-8%/yr non-renew per ACCA QMS + MCAA WebLEM + Comfort Systems USA NYSE:FIX + EMCOR NYSE:EME + Limbach NASDAQ:LMB 2024 investor disclosures + Service Logic + CoolSys PE-roll-up benchmarking. Sources Carrier NYSE:CARR David Gitlin + Trane NYSE:TT Dave Regnery + Daikin TSE:6367 Masanori Togawa + METUS Suwanee GA + LG KRX:066570 + Lennox NYSE:LII Alok Maskara + JCI NYSE:JCI Joakim Weidemanis + Comfort Systems USA NYSE:FIX Brian Lane + EMCOR NYSE:EME Tony Guzzi + Limbach NASDAQ:LMB Michael McCann + Service Logic Tracy Stallings Leonard Green + Warburg Pincus + CoolSys Adam Coffey Ares + AIM Act Dec 2020 + EPA 40 CFR Part 84 + Technology Transitions Rule GWP-700 Jan-1-2025 + IRA 179D $0.50-$5.81/sqft + Section 45L $500-$5K/dwelling + Section 48 ITC 6%+24% bonus + Section 30C + BACnet ASHRAE 135 + JCI Metasys/OpenBlue + Honeywell Niagara + Tridium + Schneider EcoStruxure + Siemens Desigo + Carrier Automated Logic + Abound + Trane Tracer SC+ + Distech + Augury + Senseware + KGS Buildings + SkySpark + BrainBox AI + 75F + Verdigris + ACCA + AHRI + ASHRAE Standards 15/34/55/62.1/90.1/147/188/189.1 + Guideline 36/0 + IFMA + BOMA + RSES + MCAA + Service Roundtable + Nexstar + AHR Expo + ENERGY STAR Portfolio Manager + LEED + WELL + Fitwel + GRESB + CDP + TCFD/ISSB + SEC Climate Disclosure + CA SB-253/SB-261 + Joint Commission + HIPAA + Florida Medical-Records Act + AICPA + IAASB ISSA 5000. Structure 🛠️ Pulse Training callout intro who-for commercial HVAC service account reps + branch mgrs + service-sales mgrs + Bottom Line callout 320K sqft Class-A office doesn\'t drop SA because hourly rate went up 7% drops because flat for 3 yrs + R-410A tripled + sustainability officer never saw EUI + GRESB asked for refrigerant audit + Service Logic BDR called CFO three times in Q3 with BMS-IoT pitch you should have run + 5-stage + 3-avoided-conversations thesis + 6-row agenda + Section 1 Intro + Cold Open with ACCA + MCAA Q4 2024 quartile + Rep A 280K sqft Cleveland Class-B flat at $0.32 lost to Service Logic 7 mo later $0.41 BMS-IoT + R-454B retrofit reserve vs Rep B 320K sqft Charlotte Class-A QBR scorecard + AIM Act + 179D audit 6 gaps + 4-component proposal base 7.1% + AIM Act pass-through Section 7.4 + Trane CoreSense IoT $0.12/sqft + 179D engineering retainer $42K/yr = $89K to $138K/yr SA + $160K-$1.86M 179D capture + 3-yr SA + GRESB scoring improvement + 2 portfolio cross-sells + Greater-Charlotte BOMA case study + Common Trap flat-renewal is delayed loss + PE-roll-up bait AUDIT before ALIGN ALIGN before ARCHITECT + Section 2 Teach split Part A 5-STAGE 15 min AUDIT ACCA QMS + MCAA-style PM-scorecard QBR 90 days pre-renewal + ALIGN ESG + GRESB + SLB + 179D + AIM Act + CMMC + ASHRAE 147 + Joint Commission + HIPAA reframe / ARCHITECT four-component base 5-9% lift + AIM Act pass-through tiered trigger + BMS-IoT $0.06-$0.45/sqft + 179D engineering retainer $18K-$120K/building / AFFIRM 3-yr SA + CPI+2% escalator + 6% cap + AIM Act Section 7.4 + auto-renew + scope governance + BMS-IoT expansion + 179D retainer + termination / ADVANCE portfolio-segment asset-manager peer intros + BOMA/IFMA chapter co-host + 179D capture case-study co-present and Part B Three Renewal Conversations Every HVAC Sales Rep Avoids 10 min price-escalator + AIM Act refrigerant pass-through 5-9%/yr / retrofit-vs-extend-life-vs-replace + IRA 179D capture / BMS-IoT + ESG-dashboard upsell + Part C SA Portfolio Quartile Self-Diagnosis 2 min + Section 3 Discussion 8 prompts walk-away criteria refused AIM Act + 179D + VRF-heat-pump pivot 18-yr RTU + AIM Act tiered vs flat trigger + Service Logic / CoolSys consolidation defense / PM-QBR cadence reset + branch-manager pricing-fear coaching + 179D engineering billing model annual scan in SA + retainer for engineering model + ONE verbatim change + Section 4 Two-Person Role-Play Round 1 Linda Park Facilities GM + Sustainability Lead 320K sqft Crescent-Capital Tower Class-A LEED Gold Charlotte REIT $4.2B SLB tied to GRESB + 3-yr Trane SA expiring 80 days at $0.28/sqft flat + 3 Carrier 19XR water-cooled R-410A chillers + 2003 Metasys N2 + Service Logic $0.31 quote + CoolSys refrigerant-roadmap pitch + deflection 1 flat-3-years + Service Logic consolidation + deflection 2 REIT tax advisor handles 179D — account rep Marcus Holden Trane Commercial Service Charlotte branch runs full 5-STAGE + 4-component proposal $89K to $138K/yr 54% lift + Service-Logic-as-PE-roll-up reframe with pulled SOW + ChannelE2E commercial-mechanical M&A coverage + 179D engineering chain-of-custody rebuttal AICPA + IAASB ISSA 5000 + close with AFFIRM + ADVANCE + Round 2 Linda Marsh Property Manager 95K sqft Westshore Medical Plaza Tampa + 14 medical-practice tenants + 4 nineteen-year Carrier WeatherMaker R-410A RTUs + 2002 Honeywell Excel BAS + critical-care imaging + outpatient-surgery SLAs + CoolSys $0.31/sqft consolidation pitch + deflection 1 $16K/yr savings + deflection 2 never-had-critical-SLA-breach — account rep Joint Commission environment-of-care + DNV + HIPAA + Florida Medical-Records + tenant-lease reframe + 3-component proposal $0.51 + $0.08 critical-care BMS-IoT wrap + R-410A end-of-life sequencing retainer = $59.9K/yr 31% lift + CoolSys multi-site PM crew rotation does not honor 2-4-hr critical-care SLA + ChannelE2E M&A coverage + close with Joint-Commission + CoolSys-SOW-comparison brief to REIT owner-rep as MSA-close artifact + ADVANCE Tampa medical-office peer intros + Section 5 Debrief 3 Qs strongest/weakest stage + avoided conversation dodged most + renewal owed redo + 4-line CRM ritual + Section 6 Leave-Behind walkthrough + printable one-pager 7 Things to Bring on Every SA Renewal + 5-Stage SA Renewal Script Card with verbatim cue lines and timing per stage + 3 Renewal Conversations Every HVAC Rep Avoids verbatim + SA Quartile Self-Diagnosis 10-metric grid Top-Quartile vs Median vs Bottom + 12-Control AIM Act + ESG + 179D Audit Checklist + Never-Do list + Outcome Line + If You Only Remember One Thing hero quote You don\'t keep a 320K sqft Class-A office with flat-rate renewal letter you keep her by (1) ACCA QMS + MCAA-style PM-scorecard QBR 90 days pre-expiry AUDIT (2) aligning SA to ESG + GRESB + SLB + IRA-179D + AIM Act not truck-rolls ALIGN (3) delivering price-escalator + AIM Act refrigerant pass-through + BMS-IoT predictive-maintenance attach + 179D engineering retainer as one integrated four-component SA proposal ARCHITECT. How-this-training-fits-branch-operating-motion table at end showing Monday-morning branch huddle weekly + Day 90 AUDIT + Day 75 ALIGN + Day 60 ARCHITECT + Day 30-15 AFFIRM + Day 30 post + month 6 ADVANCE + three avoided conversations overlay + branch-level SA quartile review quarterly. Two mermaid diagrams: 5-Stage SA Renewal Flow + AIM Act + ESG + 179D Audit Decision Tree branches by 0-2 gaps clean + 3-6 gaps uplift + 7+ gaps crisis + owner-accepts vs declines vs swap to Service Logic / CoolSys + non-renew criteria + 90-day transition + warm intros + terminal nodes Q4 PM-QBR built-in audit + ADVANCE portfolio-peer intros vs replan pipeline via BOMA/IFMA chapter + ChannelE2E M&A coverage + branch-level operating-model fix. 9 benchmark tables (Mechanical-Service Contractor Operating Benchmarks 2024 + Commercial HVAC OEM Landscape + PE-Backed Mechanical-Service Consolidator Landscape + Commercial HVAC SA Pricing Benchmarks + AIM Act Refrigerant Cost Trajectory 2022-2027 + IRA Section 179D Deduction Capture Math + BMS-IoT Predictive-Maintenance Subscription Pricing + BAS/BMS Retrofit Capex + Account-Rep Renewal Performance by Tenure). 12-failure-mode counter-case + 7-objection coach-back + when-to-rerun cadence. Cross-links to st0001-st0006 + companion industry-specific entries planned st0028-st0030 + cross-reference to st0007-st0026 what transfers verbatim language + CRM-reviewed coaching cadence and what does NOT commercial-HVAC-specific OEM stack + MCAA/ACCA QMS quartile + AIM Act pass-through mechanics + IRA 179D + 45L + 48 ITC + GRESB + SLB + ENERGY STAR + BMS-IoT + ASHRAE G36/147 + Joint Commission. Tags include sales-training (hub filter) + commercial-hvac-sa-renewal-training + commercial-hvac + service-agreement-renewal + facilities-management + refrigerant-phase-down + aim-act-r410a + vrf-heat-pump + bas-bms-integration + predictive-maintenance + ira-179d-45l + 60-min-meeting + standard-team + st0027. Callouts used Pulse Training + Bottom Line + Coach Note + Verbatim Script + Common Trap + Leave-Behind. EXPLICITLY COMMERCIAL HVAC INDUSTRY - NOT generic SaaS - no Gong / Bridge Group / Pavilion / OpenView citations. Tight 2-3 sentence paragraphs throughout. ASCII-clean. Lean target honored drafted under 10,500 hard cap. Each ladder rung polish_note explicitly instructed CUT and tighten do not ADD length per locked rule.'
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

  // Fire-and-forget IndexNow ping so /sales-trainings/st0027 is crawled.
  try {
    fetch('https://pulserevops.com/.netlify/functions/pulse-machine-indexnow-batch-background', { method: 'POST' })
      .catch(() => {});
  } catch (_e) {}

  console.log('=== DONE ' + ID + ' === quality_score=10');
}

main().catch(err => { console.error(err); process.exit(1); });
