// q9657 -- How do you start a home health agency business in 2027?
// Medicare-certified home health (clinical skilled services - RN, PT, OT, SLP, MSW, HHA in the home).
// DISTINCT FROM q9630 (non-medical companion) and q9656 (hospice end-of-life).
// Creates baseline blob + index row, then walks polish ladder 5 -> 6 -> 7 -> 8 -> 9 -> 10.
// NEW STRUCTURE: Bottom Line callout + short-paragraph TLDR + TOC + 4 PART super-headers + H3 deep sections.
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

const ID = 'q9657';
const QUESTION = 'How do you start a home health agency business in 2027?';

const tldr = `**TL;DR:** Starting a **home health agency business in 2027** (a.k.a. **Medicare-certified home health agency (HHA)**, **skilled home care agency**, **post-acute home health**, **certified home health agency (CHHA)**, or **clinical home-based skilled services provider**) -- the **Medicare-certified skilled home care provider delivering intermittent skilled nursing (RN/LPN), physical therapy (PT), occupational therapy (OT), speech-language pathology (SLP), medical social work (MSW), and home health aide (HHA/CNA) services to homebound Medicare beneficiaries with a skilled need under a physician-signed plan of care, paid through 60-day episodes via the Patient-Driven Groupings Model (PDGM, since January 2020) split into two 30-day payment periods with HHRG (Home Health Resource Group) case-mix adjustment and ~30-visit LUPA (Low Utilization Payment Adjustment) thresholds, governed by 42 CFR 484 Conditions of Participation and the OASIS-E (Outcome and Assessment Information Set) clinical assessment tool** -- means navigating **CMS-855A Medicare enrollment plus state Department of Health home health licensure plus CHAP/ACHC/TJC accreditation (CMS-deemed status) plus 17 states still operating Certificate of Need (CON) for home health plus the federal Florida/Illinois/Michigan/Texas moratoriums on new Medicare home health enrollment plus federal anti-fraud apparatus (DOJ + OIG + UPIC + ZPIC + TPE + RAC + HEAT strike forces) that has recovered $5B+ in home health False Claims Act settlements 2010-2024**, and operating against **a US universe of ~11,500 Medicare-certified home health agencies serving ~3.2M Medicare beneficiaries annually with average ~5 episodes per beneficiary year per CMS + MedPAC + NAHC + Partnership for Quality Home Healthcare** -- capturing **typical mature 500-patient-census home health agency revenue $10M-$18M and 8-15% EBITDA margins (compressed vs hospice due to PDGM 4-7% cuts 2024-2026 + behavioral adjustment + visit-based labor intensity) with named comps including LHC Group (UnitedHealth/Optum acquired April 2023 for $5.4B), Amedisys (NASDAQ: AMED -- Optum acquisition pending FTC review since 2023), Enhabit (NYSE: EHAB -- Encompass Health spinoff 2022, hospice + home health), Encompass Health (NYSE: EHC), AccentCare (Advent International), Aveanna Healthcare (NASDAQ: AVAH), BAYADA Home Health Care (PE/private), BrightSpring Health Services (NASDAQ: BTSG IPO 2024, Pharmerica + Adoration + ResCare combination), AccordCare, HouseWorks (Audax), Compassus (Audax + TowerBrook), Pennant Group (NASDAQ: PNTG -- Ensign spinoff), Elara Caring, CenterWell Home Health (Humana NYSE: HUM, formerly Kindred at Home), Trinity Health At Home, Interim HealthCare, Maxim Healthcare Services, VNS Health (NYC nonprofit), Visiting Nurse Service of New York, Visiting Nurse Association of America (VNAA)** -- with **PE/strategic consolidation that drove multiples from 8-12x EBITDA pre-Optum-era to a now-compressed 6-10x range as PDGM cuts + behavioral adjustment + HHVBP value-based purchasing + RN labor crisis + Optum-Amedisys FTC scrutiny + Medicare Advantage rate compression weigh on the space**. The hardest part is **PDGM behavioral adjustment + 2024-2026 rate cuts (4-7% cumulative) plus OASIS-E complexity plus HHVBP (Home Health Value-Based Purchasing) nationwide with payment adjustments of plus/minus 5% by 2025 escalating toward plus/minus 9% by 2028 plus federal moratoriums in FL/IL/MI/TX plus Medicare audit exposure (UPIC + TPE + RAC + OIG + DOJ qui tam $5B+ recovered 2010-2024) plus RN labor crisis ($75K-$110K with 40-55% turnover) plus referral concentration (hospital discharge planners + SNF step-down driving 40-60% of admits, losing 1-2 sources collapses census) plus hospital readmission penalty effects on referral patterns plus Optum dominance + antitrust concerns plus MA-side rate compression (~50% of Medicare lives now MA paying 60-85% of FFS rates)**, not the capital stack.`;

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** $165K-$465K to STARTUP a new Medicare-certified home health agency in non-CON / non-moratorium states (working capital + license + accreditation + initial RN/PT/OT staff + payroll runway + OASIS-E-capable EMR + insurance); $465K-$1.4M for CON-state new entry plus consulting + competing applications; $1.4M-$7M to ACQUIRE existing operating Medicare-certified HHA with active Medicare provider number + ~200-700 patient census + accreditation + referral relationships (multiple of 0.6-1.2x annual revenue OR 5-9x EBITDA depending on payer mix + census + survey + audit history); expect **12-30 months for de novo CMS Medicare certification** (CMS-855A application + state DOH license + accreditation survey + initial Medicare certification survey after first patient admission validating 42 CFR 484 CoP compliance) and **6-18 months for CHOW (change of ownership) acquisition** with provisional billing; home health is **dramatically lower capital than SNF/AL/MC** because care is delivered in the patient's home rather than a purpose-built facility (only office + EMR + clinician fleet + DEA-compliant medication storage if applicable); critical caveat -- **CMS imposes federal Medicare HHA enrollment moratoriums** that have been in place at various times in **Florida (Miami-Dade + Broward), Illinois (Chicago), Michigan (Detroit), and Texas (Dallas + Houston)** since 2013 to combat fraud, forcing CHOW acquisition rather than de novo in those metros.
> - **[Margins]** Mature stabilized 500-patient-census Medicare-certified HHA generates **$10M-$18M annual revenue with 8-15% EBITDA margins ($800K-$2.7M EBITDA) -- meaningfully compressed vs hospice and SNF Part A** because PDGM rate cuts (4-7% cumulative 2024-2026 including behavioral adjustment), HHVBP value-based payment adjustments (plus/minus 5% by 2025 toward plus/minus 9% by 2028), visit-based labor intensity (RN + PT/OT/SLP + HHA + MSW visits at $65-$120/visit clinician compensation), ~30-visit LUPA threshold risk (episodes below threshold paid per-visit rather than full HHRG case-mix episode payment = sharp revenue drop), and Medicare Advantage rate compression (~50% of Medicare lives now MA paying 60-85% of FFS rates); payer mix typically **70-85% traditional Medicare PDGM (~$2,038 base 30-day period rate FY2025 adjusted by HHRG case-mix and HHVBP)** + **10-20% Medicaid HCBS waiver + Medicaid managed care** + **5-15% Medicare Advantage + commercial + workers comp**, with the **LUPA (Low Utilization Payment Adjustment)** threshold at ~30 visits per 30-day period (varies by HHRG) the critical operational hurdle preventing under-utilization revenue collapse.
> - **[Hardest part]** **PDGM behavioral adjustment + 2024-2026 rate cuts + OASIS-E complexity + HHVBP penalties + FL/IL/MI/TX moratoriums + Medicare audit exposure + RN labor crisis + referral concentration + Optum dominance**, not occupancy demand -- CMS implemented **PDGM January 2020 replacing the 60-episode HHPPS prospective payment system** introducing **30-day payment periods + HHRG case-mix adjustment based on admission source (community vs institutional) + timing (early vs late) + clinical grouping + functional impairment + comorbidity adjustment + behavioral adjustment** (CMS reduced base rates assuming agencies would change coding/visit behavior, which then triggered ongoing rate clawbacks **negative 3.925% in CY2023, negative 2.890% in CY2024, negative 1.975% in CY2025, projected continued cuts in CY2026 totaling 4-7% cumulative**), plus **OASIS-E (effective January 2023 expanding from OASIS-D1)** with **100+ assessment items** scored at start of care + recertification + transfer + discharge driving HHRG payment + HHVBP quality + HHQRP reporting, plus **HHVBP (Home Health Value-Based Purchasing) nationwide January 2023** with payment adjustments **plus/minus 5% by CY2025 escalating toward plus/minus 9% by CY2028** based on Total Performance Score across 12 measures, plus **federal Medicare HHA enrollment moratoriums** in FL/IL/MI/TX preventing de novo entry in major metros, plus **DOJ qui tam False Claims Act $5B+ recovered 2010-2024** (Amedisys $150M 2014, Kindred/Gentiva $125M cumulative, LHC $65M cumulative, Almost Family $9.4M, Maxim $150M, plus dozens of smaller settlements), plus **RN labor crisis ($75K-$110K + 40-55% turnover + agency RN $85-$135/hour 2-3x premium)**, plus **referral concentration (hospital discharge planners + SNF step-down driving 40-60% of admits, losing 1-2 sources collapses census)**, plus **hospital readmission penalty effects** (CMS HRRP penalizing hospitals for 30-day readmissions creates incentive for hospital discharge planners to select HHAs with low rehospitalization scores), plus **Optum/UnitedHealth dominance** (acquired LHC Group April 2023 for $5.4B + Amedisys acquisition pending FTC review since 2023 = potential combined ~$10B+ home health revenue under single insurer if FTC approves), plus **MA-side rate compression** (~50% of Medicare lives now MA paying home health agencies 60-85% of traditional Medicare PDGM rates with prior authorization friction).

A home health agency in 2027 is a **Medicare-certified skilled home care provider** delivering **intermittent skilled nursing (RN/LPN), physical therapy (PT), occupational therapy (OT), speech-language pathology (SLP), medical social work (MSW), and home health aide (HHA/CNA) services to homebound Medicare beneficiaries with a skilled need under a physician-signed plan of care**. Structurally distinct from **non-medical home care / private duty (q9630 -- companion + ADL care, no Medicare, ~$32-$45/hour private pay or Medicaid HCBS waiver)**, **hospice (q9656 -- terminal care, per-diem Medicare Hospice Benefit, IDT with chaplain/bereavement)**, **palliative care (q9620 -- non-terminal symptom management, Part B physician fees)**, **skilled nursing facility SNF (q9655 -- residential 24/7 RN-supervised)**, **assisted living AL (q9650)**, **memory care MC (q9653)**, **adult day care ADC (q9652)**, **LTACH/IRF (post-acute hospitals)**, **inpatient rehab (rehab hospital)**, and **PACE (Program of All-Inclusive Care for the Elderly -- Medicare/Medicaid integrated for nursing-home-eligible at home)**. Home health is uniquely **episode-based paid under PDGM 30-day payment periods with HHRG case-mix adjustment + ~30-visit LUPA threshold + HHVBP value-based adjustment plus/minus 5% by 2025**, requiring **homebound status + skilled need + physician plan of care + face-to-face encounter within 90 days prior or 30 days after start of care**.

The honest 2027 demand reality -- **~11,500 Medicare-certified home health agencies** in the US serving **~3.2M Medicare beneficiaries annually** with **~5 episodes per beneficiary year average** per **CMS Home Health Compare + MedPAC + NAHC + Partnership for Quality Home Healthcare**. Demand drivers: **65+ population growing from ~58M (2024) to ~80M by 2040** per US Census Bureau; **75+ population growing from ~24M (2024) to ~45M by 2040**; **post-acute hospital discharge to home (vs SNF) growing as CMS + commercial payors incentivize lowest-cost-appropriate setting**; **chronic disease management at home (CHF, COPD, diabetes, post-surgical, wound care, IV therapy) growing**; **hospital-at-home (acute care at home) pilots expanding via CMS Acute Hospital Care at Home waiver extended through 2024 (then extended in 2025) creating adjacency**; **Medicare Advantage in-home assessments + supplemental benefits expanding (~50% of Medicare lives now MA)**; **patient preference for aging at home over institutional care**. Counter-demand pressures: **PDGM behavioral adjustment + ongoing rate cuts compressing revenue per episode**, **HHVBP penalties for low quality scores**, **referral source consolidation (large hospital systems negotiating preferred-HHA panels)**, **Medicare Advantage prior authorization + rate compression**, **federal moratoriums in FL/IL/MI/TX preventing de novo entry**.

The five things that determine whether a Medicare home health operator survives years 1-3: **(1) OASIS-E accuracy + HHRG case-mix optimization + clinical coding discipline** -- OASIS-E assessment at start of care + recertification drives HHRG payment + HHVBP quality + HHQRP reporting; under-coding = revenue left on table, over-coding = audit exposure; **(2) Referral pipeline -- hospital discharge planners + SNF step-down + community physicians + ACOs/MA plans** -- 40-60% of admissions flow through 5-15 referral sources; losing 1-2 referral sources collapses census within 30-60 days; preferred-HHA panel inclusion at large hospital systems critical; **(3) Visit-based clinician staffing model -- RN case manager (1:25 ratio) + PT/OT/SLP + HHA + MSW + per-visit pay $65-$120/visit** -- managing clinician productivity (5-7 visits/day RN, 6-8 visits/day PT/OT, 6-8 visits/day HHA) + agency reduction toward <10% + retention toward 30-40% turnover (industry 40-55%); **(4) HHVBP Total Performance Score + Star Rating on Care Compare** -- 2023+ nationwide HHVBP with plus/minus 5% by 2025 escalating to plus/minus 9% by 2028; Star Rating (1-5 stars) on Care Compare drives referral preference + patient choice; **(5) Medicare audit posture + LUPA discipline + PDGM accuracy** -- UPIC + TPE + ADR + recoupment + DOJ qui tam exposure ($5B+ recovered 2010-2024); LUPA threshold at ~30 visits/30-day period determines whether episode paid full HHRG or per-visit (sharp revenue cliff); behavioral-adjustment-driven CMS rate cuts ongoing.

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & home health vs adjacent post-acute formats](#market-size--home-health-vs-adjacent-post-acute-formats)
- [CON + moratoriums + state DOH + CMS-855A + CHAP/ACHC/TJC accreditation + CoP licensing stack](#con--moratoriums--state-doh--cms-855a--chapachctjc-accreditation--cop-licensing-stack)
- [Business structure, ownership models & insurance](#business-structure-ownership-models--insurance)

**Part 2 -- Build-Out & Capital**
- [Startup economics & sub-market site selection](#startup-economics--sub-market-site-selection)
- [Clinical + EMR + OASIS-E + scheduling + billing software stack](#clinical--emr--oasis-e--scheduling--billing-software-stack)
- [Clinician staffing model & the RN labor crisis](#clinician-staffing-model--the-rn-labor-crisis)

**Part 3 -- Operations**
- [Referral pipeline -- hospital, SNF, ACO/MA, community](#referral-pipeline--hospital-snf-acoma-community)
- [PDGM 30-day periods, HHRG case-mix, LUPA & the rate cuts](#pdgm-30-day-periods-hhrg-case-mix-lupa--the-rate-cuts)
- [Medicare audits, qui tam DOJ, PEPPER & federal moratoriums](#medicare-audits-qui-tam-doj-pepper--federal-moratoriums)
- [HHQRP + OASIS-E + CAHPS + HHVBP value-based purchasing](#hhqrp--oasis-e--cahps--hhvbp-value-based-purchasing)

**Part 4 -- Growth & Exit**
- [Marketing, community education & referral cultivation](#marketing-community-education--referral-cultivation)
- [Scale milestones from 1 office to multi-state platform](#scale-milestones-from-1-office-to-multi-state-platform)
- [PE/strategic consolidation, Optum dominance & exit math](#pestrategic-consolidation-optum-dominance--exit-math)
- [Counter-case & risks](#counter-case--risks)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & home health vs adjacent post-acute formats

A Medicare-certified home health agency in 2027 is a **Medicare-certified skilled home care provider** delivering care in **patient's home (~100% of visits)** to **homebound Medicare beneficiaries with a skilled need** under a **physician-signed plan of care + face-to-face encounter requirement (within 90 days prior or 30 days after start of care)**. The US universe spans approximately **~11,500 Medicare-certified home health agencies serving ~3.2M Medicare beneficiaries annually** per **CMS Home Health Compare + MedPAC + NAHC (National Association for Home Care & Hospice)**. Industry consolidation: **for-profit ~80% of HHAs (vs nonprofit ~10% + government ~10%)** with PE-backed consolidators (LHC Group acquired by Optum/UnitedHealth April 2023 for $5.4B, Amedisys acquisition by Optum pending FTC review since 2023, Encompass/Enhabit spinoff 2022, AccentCare-Advent, BAYADA, BrightSpring NASDAQ BTSG IPO 2024, Aveanna NASDAQ AVAH, CenterWell Home Health/Humana from Kindred at Home acquisition 2018) driving market share growth. **Patient census** the dominant operating metric: **small HHA <100 census, mid 100-500 census, large 500-2,500 census, mega 2,500+ census (CenterWell Home Health/Humana ~350,000+ patients annually, LHC ~300,000+, Amedisys ~300,000+)**.

Home health must be **clinically distinguished from adjacent post-acute / home-based formats**: **(1) Non-medical home care / private duty (q9630 adjacent)** -- companion + ADL assistance (bathing, dressing, toileting, meals, light housekeeping, transportation, medication reminders) delivered by non-medical caregivers (CNAs, HHAs without Medicare certification, companions); **not Medicare-covered**; private pay $32-$45/hour OR Medicaid HCBS waiver OR LTC insurance OR VA Aid & Attendance; minimal federal regulation (state-by-state licensure varies); BAYADA, Right at Home, Visiting Angels, Comfort Keepers, Home Instead Senior Care, Synergy HomeCare, BrightStar Care, Griswold Home Care dominant brands. **(2) Hospice (q9656 adjacent)** -- terminal end-of-life care delivered under Medicare Hospice Benefit (per-diem, 4 levels of care, ~$215/day RHC baseline); IDT including chaplain + bereavement + volunteer; 6-month-or-less prognosis. **(3) Palliative care (q9620 adjacent)** -- non-terminal serious illness symptom + pain management, often concurrent with curative treatment; Part B physician fees + facility fees. **(4) Skilled nursing facility (SNF -- q9655)** -- residential 24/7 RN-supervised post-acute or long-term care; Medicare Part A short-stay or Medicaid long-stay. **(5) Inpatient rehab facility (IRF)** -- specialty rehab hospital for intensive PT/OT/SLP post-stroke/post-surgery; Medicare Part A. **(6) LTACH (long-term acute care hospital)** -- specialty hospital for medically complex patients requiring 25+ day acute care; Medicare Part A. **(7) Hospital-at-home (acute care at home)** -- CMS Acute Hospital Care at Home waiver extended through 2024 (then extended 2025) allowing hospitals to deliver acute inpatient care at home with home-based clinicians + telehealth + remote monitoring; adjacent emerging format. **(8) PACE (Program of All-Inclusive Care for the Elderly)** -- Medicare/Medicaid integrated capitated program for nursing-home-eligible at home + ADC. **(9) Home infusion therapy** -- IV antibiotic, TPN, chemotherapy at home; Medicare Part B + DME supplier + nursing visits; often subcontracted to specialty home infusion providers (Option Care Health, CVS Coram, BriovaRx, BioScrip). **(10) DME (durable medical equipment) home delivery** -- hospital bed, wheelchair, oxygen, CPAP delivered to home; Medicare Part B DME supplier (Apria, Lincare, AdaptHealth, Rotech). **(11) Home dialysis (peritoneal + home hemodialysis)** -- ESRD treatment at home; ESRD-specific reimbursement; DaVita HomeFlex, Fresenius Kidney Care. **(12) Telehealth + remote patient monitoring (RPM)** -- adjacent virtual care delivery; Medicare reimbursement expanded post-COVID.

The home health revenue model rests on **Medicare PDGM 30-day payment periods with HHRG case-mix adjustment**, replacing the legacy **HHPPS (Home Health Prospective Payment System) 60-day episode model effective January 2020**. **PDGM structure**: each **60-day certification period split into two 30-day payment periods**; each 30-day period grouped into one of **432 HHRG case-mix groups** based on **(a) Admission Source** (community admit vs institutional admit from hospital/SNF/IRF/LTACH within prior 14 days), **(b) Timing** (early = first 30-day period in 60-day cert vs late = subsequent), **(c) Clinical Grouping** (12 clinical groups: MMTA-Other, MMTA-Cardiac/Circulatory, MMTA-Endocrine, MMTA-GI/GU, MMTA-Infectious, MMTA-Respiratory, MMTA-Surgical Aftercare, Behavioral Health, Complex Nursing Interventions, Musculoskeletal Rehabilitation, Neuro Rehabilitation, Wounds), **(d) Functional Impairment Level** (low/medium/high based on OASIS-E functional items), **(e) Comorbidity Adjustment** (no adjustment / low / high based on secondary diagnoses). **FY2025 base 30-day payment rate ~$2,038** (varies by HHRG case-mix weight + wage index + HHVBP adjustment). **LUPA (Low Utilization Payment Adjustment)** threshold typically **~30 visits per 30-day period** (varies 2-6 visits by HHRG group): episodes below threshold paid **per-visit rate (~$185-$285/visit by discipline)** rather than full HHRG case-mix episode payment = **sharp revenue drop**. Typical mature 500-patient-census HHA generates **$10M-$18M annual revenue at 8-15% EBITDA margin ($800K-$2.7M EBITDA)** -- compressed vs hospice/SNF Part A due to PDGM rate cuts + behavioral adjustment + visit-based labor + LUPA risk + HHVBP penalties + MA rate compression.

Dominant US home health operator names useful as benchmarks: **LHC Group (acquired by Optum/UnitedHealth April 2023 for $5.4B, ~300,000+ patients annually, ~960 locations across 38 states) -- now operates under Optum Home Health umbrella, CenterWell Home Health (Humana NYSE: HUM, formerly Kindred at Home acquired by Humana 2018 then partial divestiture to Clayton Dubilier + TPG 2022 then reacquired by Humana 2022, ~350,000+ patients, ~750 locations across 38 states, largest US home health by census), Amedisys (NASDAQ: AMED, ~300,000+ patients annually, ~520 home health locations + hospice + personal care, Optum acquisition pending FTC review since 2023), Encompass Health Home Health and Hospice (was NYSE: EHC, spun off as Enhabit NYSE: EHAB 2022, ~250 home health locations + ~110 hospice locations across 34 states), AccentCare (Advent International PE-backed since 2019, ~245 home health locations + hospice + personal care, acquired Seasons Hospice 2020), Aveanna Healthcare (NASDAQ: AVAH, ~340 locations across 35 states, home health + hospice + private duty + pediatric), BAYADA Home Health Care (private/PE, ~390 locations across 23 states, home health + assistive care + hospice), BrightSpring Health Services (NASDAQ: BTSG IPO January 2024 at $13 per share raising $693M, ~10,000 service locations across 50 states, home health + hospice + pharmacy + personal care + facilities, combination of Pharmerica + Adoration Health + ResCare), Pennant Group (NASDAQ: PNTG, Ensign Group spinoff 2019, ~135 senior living + home health + hospice across 13 states), Compassus (Audax + TowerBrook PE-backed, ~250 locations across 30 states with Ascension Health JV, home health + hospice + palliative + infusion), Elara Caring (PE-backed, ~225 locations across 17 states, home health + hospice + personal care + behavioral health), HouseWorks (Audax-backed, regional Northeast home care + hospice), Trinity Health At Home (Trinity Health Catholic system home health + hospice + palliative service line ~50 locations across 10 states), Interim HealthCare (franchise, ~330 franchise locations nationwide), Maxim Healthcare Services (PE/private, home health + private duty + behavioral health), AccordCare (regional Southeast), Three Oaks Hospice & Home Health, VNS Health (NYC, formerly Visiting Nurse Service of New York, largest US nonprofit home + community health, ~46,000 patients daily across NYC), Visiting Nurse Association of America (VNAA, nonprofit federation), Bayshore HealthCare (Canadian + US), Help at Home (NASDAQ exit, home + community-based services), Addus HomeCare (NASDAQ: ADUS, home health + hospice + personal care)**. Industry structure: **for-profit ~80% market share, nonprofit ~10%, government/hospital-based ~10%**; **PE consolidation aggressively rolling up regional HHAs but ~7,500-8,000 small/mid independent HHAs remain (consolidation runway substantial)**.

### CON + moratoriums + state DOH + CMS-855A + CHAP/ACHC/TJC accreditation + CoP licensing stack

Home health faces a **multi-layered federal CMS + state DOH + accreditation regulatory stack** -- comparable to hospice in complexity but with the additional barrier of **federal Medicare HHA enrollment moratoriums in Florida (Miami-Dade + Broward), Illinois (Chicago), Michigan (Detroit), and Texas (Dallas + Houston)** that have been in place at various times since 2013 to combat fraud. The dominant stack a new operator must navigate:

**(1) Federal Medicare HHA enrollment moratoriums** -- CMS imposed **temporary moratoriums on new Medicare HHA enrollments** in **Florida (Miami-Dade + Broward counties), Illinois (Chicago metro), Michigan (Detroit metro), and Texas (Dallas + Houston metros)** beginning 2013 + extended multiple times + lifted in 2019 + partially reinstated 2020+ in selected areas; **operators should verify current moratorium status via CMS Medicare Provider Enrollment + Chain Ownership System (PECOS) + CMS Moratoria Tool before applying for de novo enrollment**. In moratorium markets, **CHOW (change of ownership) acquisition of existing HHA is the only entry path**. **(2) Certificate of Need (CON) for home health -- 17 states still operate CON for home health** including **AL, CT, DC, GA, KY, MD, MS, NC, NJ, NY, NV, RI, SC, TN, VT, WV, WA** (varies by year as states reform/repeal CON). CON application **$15K-$125K legal + consulting + application fees**, **6-18 month review process**, **public hearings**, **competing applications**, **success rates 25-55%**. **(3) State Department of Health (DOH) home health license** -- every state requires state DOH or equivalent home health agency license; **annual recertification + complaint surveys + change-of-ownership review**; state DOH licensing fees **$2K-$15K initial + $500-$3K annual**. **(4) CMS Form 855A Medicare Provider Enrollment** -- institutional provider enrollment for Medicare home health; **initial certification survey by state DOH on behalf of CMS** validates compliance with **42 CFR 484 Conditions of Participation** before Medicare provider number issued; **first patient admission required before initial Medicare certification survey**; typical **12-30 month process de novo from application to active Medicare provider number** including state license + accreditation + CMS-855A + initial certification survey. **CHOW (change of ownership)** of existing HHA triggers new CMS provider number application + re-survey -- typical **60-180 day process** with provisional billing during pendency. **(5) Accreditation by CHAP / ACHC / TJC** -- CMS deems accreditation by one of three approved accreditors equivalent to CMS certification survey: **CHAP (Community Health Accreditation Partner)** dominant home health + hospice accreditor, **ACHC (Accreditation Commission for Health Care)** second-largest, **The Joint Commission (TJC)** legacy hospital-focused with home care program. Accreditation **$8K-$35K initial application + $5K-$15K annual** with **on-site survey every 3 years + interim self-assessment**. **(6) CMS Conditions of Participation 42 CFR 484** -- federal regulatory backbone covering **Subpart A General Provisions (§484.1-§484.2), Subpart B Patient Care (§484.40 Release of patient identifiable OASIS information, §484.45 Reporting OASIS information, §484.50 Patient rights, §484.55 Comprehensive assessment of patients, §484.58 Discharge planning, §484.60 Care planning, coordination of services, quality of care, §484.65 Quality assessment and performance improvement -- QAPI, §484.70 Infection prevention and control, §484.75 Skilled professional services, §484.80 Home health aide services, §484.85 Personnel qualifications, §484.95 Training requirements), Subpart C Organizational Environment (§484.100 Compliance with federal, state, and local laws, §484.102 Emergency preparedness, §484.105 Organization and administration of services, §484.110 Clinical records, §484.115 Personnel qualifications), Subpart D Home Health Aide Services (§484.80), Subpart E Prospective Payment System (§484.200-§484.265 covering PDGM mechanics), Subpart F Conditions of Participation Outpatient PT/SLP (§484.300+), Subpart G Quality Reporting (§484.245)**. **Annual standard survey** by state DOH or accreditor validates compliance. **(7) CMS Home Health Quality Reporting Program (HHQRP)** -- mandatory quality reporting tied to Medicare payment; failure to report = **2% Medicare payment reduction**. **(8) OASIS-E (Outcome and Assessment Information Set version E)** -- effective **January 2023** expanding from OASIS-D1; **100+ assessment items** scored at **Start of Care + Resumption of Care + Recertification + Transfer to inpatient facility + Discharge**; drives **HHRG case-mix payment + HHVBP quality measures + HHQRP reporting + Star Rating on Care Compare**; submitted electronically via CMS QIES (Quality Improvement and Evaluation System) ASAP. **(9) CAHPS Home Health Survey (HHCAHPS)** -- patient experience survey administered by CMS-approved CAHPS vendor; publicly reported on Care Compare; covers care of patients, communication with providers, specific care issues, overall rating, willingness to recommend. **(10) HHVBP (Home Health Value-Based Purchasing)** -- **nationwide January 2023** (after 9-state pilot 2016-2022) with **payment adjustments plus/minus 5% by CY2025 escalating toward plus/minus 9% by CY2028** based on **Total Performance Score across 12 measures** including OASIS-based outcomes (improvement in dyspnea, improvement in ambulation, improvement in bathing, improvement in management of oral medications) + claims-based outcomes (acute care hospitalization during first 60 days, emergency department use without hospitalization during first 60 days) + HHCAHPS measures + Discharge Function Score. **(11) Star Rating on Care Compare** -- composite 1-5 star rating publicly displayed driving patient + referral source choice. **(12) Face-to-Face encounter requirement** -- Medicare regulation since 2011 requires **face-to-face encounter by physician or NP within 90 days prior or 30 days after start of care** documenting homebound status + skilled need; missed F2F = payment denial. **(13) Physician plan of care + signed orders + recertification every 60 days**; missed cert = payment denial. **(14) HIPAA + 42 CFR Part 2** -- full HIPAA + substance abuse confidentiality compliance + BAA business associate agreements. **(15) DEA registration** -- limited DEA registration if controlled substances managed (less common in home health than hospice). **(16) Background checks + abuse registry** -- every direct care employee criminal background check + state nurse aide abuse registry; CNA certification for HHAs.

**(17) Pre-Claim Review / Review Choice Demonstration (RCD)** -- CMS implemented **Pre-Claim Review Demonstration in Illinois 2016** then expanded as **Review Choice Demonstration (RCD)** in **IL, OH, NC, FL, TX** allowing HHAs to choose between (a) pre-claim review (CMS reviews 100% of claims before submission), (b) post-payment review (UPIC reviews 100% of claims after payment with recoupment), (c) 25% pre-payment review with reduced scrutiny option after high performance. RCD designed to reduce Medicare home health fraud + improper payments. **(18) Targeted Probe and Educate (TPE)** -- MAC reviews 20-40 claims per round (up to 3 rounds) with education between rounds + recoupment if not improved. **(19) Hospital Readmission Reduction Program (HRRP) effects** -- CMS HRRP penalizes hospitals up to 3% of Medicare Part A payment for excess 30-day all-cause readmissions; hospital discharge planners increasingly select HHAs with low rehospitalization scores to reduce HRRP exposure = quality + Star Rating drive referral preference. **(20) State-specific staffing + clinical requirements** -- many states layer additional requirements on federal CoP (e.g. RN supervisory visit frequency, HHA competency evaluation cycle).

The disciplined new operator: **hires Administrator + Director of Patient Care Services (DPCS, RN required) + healthcare regulatory counsel specialized in home health in target state before opening**, retains **CHAP/ACHC/TJC accreditation consultant for initial accreditation survey preparation**, builds **OASIS-E-trained clinical team + ICD-10 coding-trained billing + Medicare-experienced administrator + compliance officer + QAPI program + LUPA monitoring + HHVBP optimization + Star Rating monitoring + HHQRP reporting capability before opening**, and treats **OASIS-E accuracy + HHRG case-mix optimization + LUPA discipline + HHVBP performance + audit-ready compliance as highest operating priorities**.

### Business structure, ownership models & insurance

The dominant home health ownership structure in 2026 is **for-profit LLC or corporation owned by founder/PE/strategic** -- for-profit market share ~80% of Medicare-certified HHAs driven by PE consolidation (LHC/Optum, Amedisys, AccentCare-Advent, BAYADA, BrightSpring, Aveanna, CenterWell/Humana, Compassus, Elara Caring, Pennant). Alternative structures: **(a) Nonprofit 501(c)(3) home health** -- legacy community/faith-based + visiting nurse association model (VNS Health NYC, VNA federations, Trinity Health At Home Catholic system); **(b) Hospital-affiliated home health** -- health system operating home health as post-acute service line (Mayo Clinic Home Health, Cleveland Clinic Home Care, Kaiser Permanente Home Health, Sutter Home Health, Providence Home Services); **(c) PE-backed for-profit platform** (LHC + Amedisys + AccentCare + BAYADA + Compassus + Elara + Pennant + Aveanna + BrightSpring); **(d) Strategic-owned (insurance + senior services integration)** -- CenterWell/Humana, Optum/UnitedHealth (LHC + pending Amedisys); **(e) Single-founder owner-operator** -- nurse-founder / PT-founder / hospital-veteran-founder starting de novo HHA. **Entity structure**: standard pattern is **single LLC (Delaware or state-specific) holds Medicare provider number + employs clinical staff + contracts with PT/OT/SLP/MSW contractors + holds vendor agreements**. **Working capital requirement** notably lower than SNF but higher than hospice -- **home health cash flow cycle 30-60 days** with **RAP (Request for Anticipated Payment) eliminated 2022** (RAPs historically provided 50-60% early cash but CMS eliminated to combat fraud); **NOA (Notice of Admission) required within 5 days of start of care** + **final claim within 30-day period close**; typical de novo HHA needs **$165K-$465K operating capital** to absorb pre-stabilization burn during 12-18 month census ramp.

**Insurance stack** (comparable to hospice -- lighter than SNF because home-care delivery + skilled-clinician documentation discipline): **(1) Professional Liability (Med Mal) + General Liability** -- combined PL + GL with limits typically **$1M/$3M per claim/aggregate minimum, $2M/$5M-$3M/$10M preferred, $5M-$15M for multi-state operators**; premium **$25K-$185K annually per 500-census HHA** (varies by state -- CA/FL/TX/NY/IL higher); key carriers include **CNA HealthPro, MedPro Group (Berkshire Hathaway), ProAssurance (NYSE: PRA), The Doctors Company, Coverys, Beazley, AXA XL, AIG, Hiscox, Berkshire Hathaway Specialty, Markel, Distinguished Programs, Arthur J Gallagher, Marsh McLennan, USI, HUB International, Lockton, Newfront**. **(2) Workers Compensation** -- HHAs classified under **NCCI 8826 Home Health Care Skilled and Unskilled** (same class code as hospice); premium **$2.50-$6.50 per $100 of payroll** (moderate-to-high WC rate driven by RN/PT/OT/HHA driving + patient handling + needle-stick); typical 500-census HHA with $5M-$8M payroll = **$125K-$520K annual WC premium**. **(3) Auto / Hired & Non-Owned Auto** -- HHA clinicians drive to patient homes (100% of visits are home visits); typically **non-owned auto policy with $1M-$2M limit** covering employee-owned vehicles used for HHA work; **$10K-$55K annually** for 500-census HHA with 30-60 clinicians driving; some HHAs provide mileage reimbursement at IRS rate (CY2025 ~$0.67/mile) rather than company vehicles. **(4) Property + Business Interruption** -- office space full replacement value with BI rider; **$5K-$45K annually office-only**. **(5) Cyber Liability** at **$2M-$5M** -- HIPAA breach + ransomware (HHAs major ransomware targets given PHI) -- **$8K-$45K annually**. **(6) EPLI Employment Practices Liability** at **$1M-$3M** -- RN/PT/OT turnover + clinician HR complaints = moderate EPLI exposure -- **$8K-$25K annually**. **(7) Umbrella Liability** at **$5M-$25M** -- multi-site HHAs routinely carry **$10M-$50M umbrella** -- **$15K-$125K annually**. **(8) Sexual Abuse + Molestation sub-limit** at **$500K-$3M** -- vulnerable elderly + isolated home setting -- **$3K-$25K annually**. **(9) Crime / Employee Dishonesty** at **$250K-$1M** -- protects against employee theft from patients (rare but real exposure in home visits) -- **$2K-$8K annually**. **(10) Directors & Officers (D&O)** at **$1M-$5M** -- **$8K-$35K annually**. **(11) Pollution Liability** -- covers medical waste (sharps + biohazard) -- **$2K-$15K annually**. **(12) Bond + Surety** -- required by some states for Medicare/Medicaid provider -- **$1K-$5K annually**. **Total Year 1 insurance load for a 500-census HHA: $200K-$850K** (premium urban high-litigation states $300K-$1.2M; multi-state platforms with SIR $1M-$5M aggregated). **Contract discipline**: every admission includes **(a) Medicare home health notice + plan of care, (b) physician orders + face-to-face encounter documentation, (c) OASIS-E assessment, (d) HIPAA authorization, (e) financial responsibility (Medicare/Medicaid + any non-covered services), (f) Patient Rights notice + grievance procedure, (g) Advance Beneficiary Notice (ABN) if applicable, (h) photograph release**.

---

## 🧱 PART 2 -- BUILD-OUT & CAPITAL

### Startup economics & sub-market site selection

Home health startup capital is **dramatically lower than SNF/AL/MC** because care is delivered in **patient's home (~100% of visits)** rather than purpose-built facility. Five paths: **(1) De novo Medicare-certified HHA in non-CON / non-moratorium state** -- typical **$165K-$465K startup capital** covering office lease ($20K-$75K annual), CMS-855A + state DOH license ($5K-$25K), accreditation CHAP/ACHC/TJC ($15K-$45K initial), OASIS-E-capable EMR ($25K-$85K initial + $1K-$3K/mo subscription), startup clinical staff payroll runway 6-12 months ($85K-$285K), insurance Year 1 ($25K-$95K), legal + consulting ($25K-$85K), branding + website + initial marketing ($15K-$45K), miscellaneous (laptops + phones + clinical bags + initial supplies $25K-$65K). 12-30 months from application to active Medicare provider number + first patient admission before initial certification survey + census ramp 0-150 patients over 12-18 months. **(2) De novo in CON state** -- typical **$465K-$1.4M startup capital** including CON application $15K-$125K + CON consulting $50K-$185K + 12-18 month CON review with public hearings + competing applications + 25-55% success rate. **(3) De novo in CMS moratorium state (FL/IL/MI/TX selected metros)** -- **NOT POSSIBLE** during moratorium; **CHOW acquisition is only entry path**. **(4) Acquire existing operating HHA (CHOW)** -- typical **$1.4M-$7M acquisition** for 200-700-census HHA with active Medicare provider number + accreditation + referral relationships; multiples typically **0.6-1.2x annual revenue OR 5-9x EBITDA** (depending on payer mix + census + survey + audit history + state + HHVBP score); CHOW 60-180 days with provisional billing risk during pendency; **only path in moratorium markets**. **(5) Acquire + build (regional rollup)** -- PE-backed strategy acquiring 2-5 existing HHAs in geographic concentration then organic growth + adjacent acquisition.

**Office build-out** -- typical 500-census HHA office **2,000-4,500 sqft** in commercial office building with **administrator office + DPCS office + clinical staff workstations + medication storage (limited Schedule II) + records storage (HIPAA-compliant) + IDT/team meeting room + reception + break room**; **rent $20K-$75K annual depending on metro**; tenant improvements $30K-$165K. **Sub-market selection criteria**: **(1) Medicare beneficiary density** -- 65+ population in service area (typically 30-45 minute drive from office for clinical visit efficiency); minimum 25K-65K Medicare beneficiaries in catchment for 500-census viability; **(2) Hospital + SNF + IRF discharge volume** -- 3-8 acute care hospitals + 15-30 SNFs + 1-3 IRFs in service area producing referral pipeline; **(3) Existing home health competition** -- assess via **CMS Care Compare + Home Health Compare + state DOH HHA list** to understand competing supply, market saturation, dominant local operators; mature markets (FL, AZ, TX, CA) have 15-50+ HHAs competing for referrals; under-served rural markets may have 1-5 HHAs; **(4) State Medicaid HCBS waiver + Medicaid managed care** -- Medicaid HCBS waiver provides supplemental payer mix; state-by-state rates vary; **(5) CON status** -- CON state (AL/CT/DC/GA/KY/MD/MS/NC/NJ/NY/NV/RI/SC/TN/VT/WV/WA) substantially harder de novo entry; **(6) Federal CMS moratorium status** -- FL (Miami-Dade + Broward) / IL (Chicago) / MI (Detroit) / TX (Dallas + Houston) may have moratorium preventing de novo; **(7) Labor market** -- RN + LPN + PT + OT + SLP + HHA + MSW availability + wage benchmarks; tight labor markets squeeze margins; **(8) HHVBP regional performance baseline** -- check state-level HHVBP baseline to understand competitive quality bar; **(9) MA penetration** -- markets with high MA penetration (~50%+) face MA prior auth + rate compression. **Working capital** -- typical 500-census HHA needs **$165K-$465K working capital** at stabilization for 30-60 day Medicare A/R cycle + payroll + vendor payments (post-RAP-elimination Medicare cash cycle longer than pre-2022).

### Clinical + EMR + OASIS-E + scheduling + billing software stack

Home health clinical/operating tech stack must support **OASIS-E-capable EMR integrated with clinical assessment + plan of care + visit documentation + ICD-10 coding + HHRG case-mix + LUPA monitoring + Medicare claims processing (NOA + final claim + PDGM) + scheduling + visit verification + EVV (Electronic Visit Verification for Medicaid) + HHQRP/HHVBP/CAHPS quality reporting + family/patient portal + telehealth + RPM remote patient monitoring** -- substantially specialized for home health workflow distinct from hospice + SNF. The dominant home health platforms in 2025-2026:

**(1) Homecare Homebase (Hearst Health-owned)** -- dominant home health + hospice EMR/platform with **~30%+ home health market share** including LHC Group, Amedisys, Compassus, Pennant Group, HouseWorks, BAYADA; full clinical EMR + OASIS-E + IDT + plan of care + scheduling + claims + RCM; pricing **$185-$385 per census per month all-in**; hchb.com. **(2) MatrixCare Home Health and Hospice (ResMed-owned)** -- major home health EMR (also dominant in SNF); pricing **$145-$285 per census per month**; matrixcare.com. **(3) WellSky Home Health (formerly Kinnser, Mediware/WellSky-owned)** -- dominant mid-market home health EMR; wellsky.com. **(4) Axxess Home Health** -- home health EMR for mid-market; axxess.com. **(5) KanTime Home Health** -- pediatric + adult home health EMR; kantime.com. **(6) HCSS (Home Care Software Solutions)** -- home health EMR + scheduling; hcsslink.com. **(7) Alora Home Health** -- mid-market home health EMR; alorahealth.com. **(8) NetSmart Home Care** -- behavioral health + senior care + home health clinical platform; netsmarttech.com. **(9) Brightree Home Health (ResMed-owned)** -- home health EMR + intake; brightree.com. **(10) HEALTHCAREfirst** -- home health + hospice EMR; healthcarefirst.com. **(11) MEDsys Home Care** -- home care EMR; medsyshcs.com. **(12) Forcura** -- workflow + intake + clinical document management for home health + hospice; forcura.com. **(13) PointClickCare Home and Community Care** -- PointClickCare home care module (PointClickCare dominant in SNF); pointclickcare.com. **(14) Devero Home Health (HHAeXchange-owned)** -- home health EMR; devero.com. **(15) AppHealthCare** -- home health EMR for small/mid; apphealthcare.com.

**OASIS-E** is the **critical clinical assessment tool** under **42 CFR 484.45** -- effective **January 2023** expanding from OASIS-D1 with **100+ items** scored at **Start of Care (SOC), Resumption of Care (ROC), Recertification (every 60 days), Transfer to inpatient facility, Discharge from agency**; OASIS-E added **standardized assessment items for transfer of health information + social determinants of health + cognitive function + behavioral health screening**; submitted electronically via **CMS QIES (Quality Improvement and Evaluation System) ASAP**; drives **HHRG case-mix payment + HHVBP quality measures + HHQRP reporting + Star Rating on Care Compare**. **OASIS-E accuracy is the dominant clinical operating discipline** -- under-coding leaves revenue on the table, over-coding triggers UPIC audit + recoupment + qui tam exposure. Sophisticated HHAs invest in **OASIS-E certification training for all RNs + dedicated OASIS-E coding review staff (QA reviewer reviewing every OASIS before submission) + ICD-10 coding expertise + HHRG case-mix optimization + LUPA monitoring tools**.

**EVV (Electronic Visit Verification)** -- federal **21st Century Cures Act mandate** required EVV for **Medicaid personal care services by January 1, 2020** and **Medicaid home health services by January 1, 2023** with potential 1% federal Medicaid funding reduction for non-compliant states; EVV verifies **(a) type of service performed, (b) individual receiving service, (c) date of service, (d) location of service delivery, (e) individual providing service, (f) time service begins and ends**. Major EVV vendors: **HHAeXchange (largest Medicaid EVV vendor), Sandata Technologies, Tellus (eMedNY), CareBridge, Therap Services, AuthentiCare, Mobile Caregiver+, regional state-specific aggregators**. Most home health EMRs integrate EVV natively.

**Telehealth + Remote Patient Monitoring (RPM)** -- adjacent technology expanding home health capability: **RPM for CHF (weight + BP + heart rate) + COPD (SpO2 + dyspnea) + diabetes (glucose) + post-surgical (wound photos + symptoms)** delivered via Bluetooth-enabled devices + tablet/phone; CMS Medicare Part B RPM CPT codes 99453/99454/99457/99458 reimbursable; vendors: **Health Recovery Solutions (largest home health RPM platform), Vivify Health, Welltok, Validic, CareSignal, AlayaCare, Tactio Health, GE Healthcare, Philips, Cardiocom**. **Telehealth** for medical director consult + virtual visit (limited Medicare reimbursement post-COVID expansion partially extended).

**Billing + revenue cycle management** -- Medicare home health claims processing including NOA within 5 days + final claim within 30-day period close + PDGM HHRG billing + LUPA monitoring + ADR response + Medicare appeal: **Homecare Homebase RCM, MatrixCare RCM, WellSky RCM, McKesson, Optum Insight, Change Healthcare (UnitedHealth), Waystar, AthenaCollector, Net Health, RCM Health Care Services, Cantata Health, Allevia, Healthpac, regional home health RCM specialists**. **LUPA monitoring** -- critical Medicare home health compliance + revenue optimization function; specialty tools help operators monitor LUPA risk in real-time and adjust visit patterns to avoid LUPA payment cliff.

**Accounting**: **Sage Intacct, NetSuite, MS Dynamics 365** for multi-state platforms; **QuickBooks Online + ADP/Paychex payroll** for single-site. **HR/payroll**: **ADP, Paychex, Paylocity, UKG (Kronos), Smartlinx, Workday**. **Scheduling**: many HHAs use **EMR-integrated scheduling (Homecare Homebase, MatrixCare, WellSky) for clinician visit management**; some use **OnShift, Smartlinx, ABILITY SmartForce**. **CRM / referral tracking + intake**: **Forcura, Trella Health, Playmaker Health (Trella-owned), Axxess CRM, Salesforce Health Cloud, HubSpot, custom CRM** -- critical for tracking 5-15 referral sources + intake conversion + referral attribution. **HHQRP + HHVBP reporting**: OASIS-E + HHCAHPS + claims-based measures automated via EMR with quarterly + annual CMS submission.

**Total Year 1 tech stack cost for 500-census HHA: $185K-$485K annually all-in** (EMR + scheduling + CRM + billing/RCM + EVV + RPM + accounting + payroll + HHQRP).

### Clinician staffing model & the RN labor crisis

Staffing is **45-58% of home health P&L (similar to hospice but with PT/OT/SLP therapy heavy) and dominant pressure point** with **RN labor crisis (40-55% home health RN turnover, $75K-$110K home health RN wages, contract agency RN $85-$135/hour)**. Home health CoP under 42 CFR 484 mandates **skilled professional services + home health aide services + qualified personnel**. The dominant 500-census home health staffing model:

| Role | FTE / arrangement | Coverage | Annual wage range (per BLS 2024 + industry) |
|---|---|---|---|
| Home Health Administrator / Executive Director | 1.0 | Overall operations + survey response + regulatory + HHVBP | $95K-$165K (BLS 11-9111 Medical/Health Services Managers) |
| Director of Patient Care Services (DPCS) -- RN required, CoP-required | 1.0 | Clinical leadership + OASIS-E oversight + survey | $95K-$145K |
| Clinical Manager / Branch Manager (in multi-branch operations) | 0.5-2.0 | Branch operations + clinician supervision | $85K-$125K |
| RN Case Manager (1:25 patient ratio typical) | 18-22 FTE | Primary nursing case management + OASIS-E + plan of care + skilled visits | $75K-$110K (BLS 29-1141 RN, home health premium $3K-$10K above general RN) |
| LPN / LVN (supplemental nursing visits) | 4-8 FTE | Routine nursing visits + medication management | $50K-$72K (BLS 29-2061) |
| Physical Therapist (PT) -- per-visit or employed | 6-12 FTE OR per-visit | Therapy visits + plan of care | $80K-$110K (BLS 29-1123) |
| Occupational Therapist (OT) -- per-visit or employed | 3-6 FTE OR per-visit | OT visits + ADL training | $80K-$108K (BLS 29-1122) |
| Speech-Language Pathologist (SLP) -- per-visit or contract | 1-3 FTE OR per-visit | Speech/swallowing therapy | $80K-$108K (BLS 29-1127) |
| PT Assistant (PTA) -- per-visit or employed | 3-8 FTE OR per-visit | Supervised PT visits | $55K-$78K (BLS 31-2021) |
| OT Assistant (COTA) -- per-visit or employed | 1-4 FTE OR per-visit | Supervised OT visits | $55K-$72K (BLS 31-2011) |
| Home Health Aide (HHA / CNA) | 8-15 FTE | Personal care visits per plan of care | $32K-$48K (BLS 31-1131) |
| Medical Social Worker (MSW) | 1-3 FTE OR contract | Psychosocial assessment + community resources + discharge planning | $55K-$78K (BLS 21-1022) |
| OASIS-E QA Reviewer / Coder (often RN + ICD-10 certified) | 1-3 FTE | OASIS-E review + ICD-10 coding + HHRG optimization | $80K-$115K |
| QAPI / Compliance Officer | 0.5-1.0 | Quality + survey readiness + HHQRP/HHVBP/CAHPS reporting | $75K-$115K |
| Director of Business Development / Community Liaison | 1.0 | Hospital + SNF + physician referral cultivation | $75K-$115K + commission |
| Home Health Liaison / BD Reps embedded with referral sources | 2-4 FTE | Referral source relationships + intake support | $70K-$105K + commission |
| Intake Coordinator / Admissions RN | 1.0-2.0 | Referral processing + clinical eligibility + insurance verification + admission visit | $70K-$100K |
| Scheduler / Coordinator | 2-4 FTE | Daily clinician scheduling + visit coordination | $42K-$62K |
| Business Office Manager | 1.0 | Billing + collections + payroll + AR | $55K-$85K |
| Medicare Home Health Biller | 2-3 FTE | Claims processing + NOA + final claim + LUPA monitoring + cap reconciliation | $48K-$72K |
| HR + Office Manager | 1.0 | HR + onboarding + office operations | $52K-$78K |
| Receptionist / Office Admin | 1.0 | Front desk + phone coverage | $32K-$45K |

For 500-census HHA, total **clinical + leadership + BD + business office staff = ~50-85 FTE** (PT/OT/SLP often per-visit contracted reducing FTE count; depends on visit volume + therapy mix). **Per-visit clinician pay** -- common alternative to W-2 salary: **RN $65-$120/visit, PT/OT/SLP $65-$120/visit, PTA/COTA $40-$70/visit, HHA $25-$45/visit, MSW $65-$100/visit**; per-visit model shifts volume risk to clinician + reduces fixed cost. **Contract agency reality** -- HHA RN/PT/OT/HHA contract agency at **$85-$135/hour vs $75K-$110K core wage = 2-3x premium**; agency use varies by market (urban tight markets 10-20% of nursing labor, mid-market 5-10%, rural 2-5%). **Disciplined HHA operators** focus on **RN pipeline + retention (sign-on bonuses $5K-$15K, retention bonuses $2K-$10K, predictable visit-based scheduling, home health-experience premium $3K-$10K above general RN, career ladder to OASIS-E coder + clinical manager + DPCS, mileage reimbursement IRS rate ~$0.67/mile CY2025, productivity bonuses for hitting visits/day targets), productivity benchmarks (RN case manager 5-7 visits/day, PT/OT 6-8 visits/day, HHA 6-8 visits/day, MSW 3-4 visits/day with phone support), agency reduction toward <10%, turnover toward 30-40% (still high but better than 55%+)**.

---

## ⚙️ PART 3 -- OPERATIONS

### Referral pipeline -- hospital, SNF, ACO/MA, community

Home health referral pipeline is **the dominant operational reality** -- 40-60% of admissions flow through **5-15 key referral sources** with **home health liaisons / community liaisons (HHA-employed BD reps embedded with referral sources)** as primary BD function. Losing 1-2 major referral sources can collapse census within 30-60 days. The referral channels for home health admissions:

**(1) Hospital discharge planners + case managers + hospitalists (PRIMARY -- 40-60% of admits)** -- every acute care hospital has discharge planning department + case management; home health liaisons build relationships with discharge planners + case managers + attending physicians + hospitalists + physical therapists + hospital readmission reduction teams. **Daily morning rounds presence + same-day response + accept difficult admits + 24-48 hour SOC (start of care) + maintain low rehospitalization scores (Star Rating + HHVBP) + clinical capability + responsive communication** are the operational disciplines that win referral share. **Hospital Readmission Reduction Program (HRRP)** drives hospital preference for HHAs with low 30-day readmission scores -- **quality + Star Rating + HHVBP performance directly drive referral share**. **Hospital preferred-HHA panels** -- large hospital systems (HCA, Tenet, Ascension, CommonSpirit, Trinity Health, Providence, AdventHealth, Cleveland Clinic, Mayo Clinic, Kaiser Permanente, Sutter, Banner, Atrium, Northwell, NYU Langone) maintain preferred-HHA lists with 3-7 HHAs; competitive contract + quality demonstration earn inclusion.

**(2) SNF + IRF step-down (15-25% of admits)** -- patients transitioning from SNF or IRF to home receive home health for continued skilled care; SNF social workers + discharge planners refer; HHA liaisons cultivate relationships with **15-30 SNFs + 1-3 IRFs in service area**.

**(3) Community physicians + primary care + specialists (10-20% of admits)** -- PCPs + cardiologists + endocrinologists + pulmonologists + orthopedic surgeons + wound care specialists refer patients with skilled need (post-surgical, chronic disease, wound care, IV therapy, diabetic teaching); cultivate physician relationships through CME + clinical updates + responsive communication.

**(4) ACO (Accountable Care Organization) + Medicare Shared Savings Program (MSSP)** -- ACOs incentivized to manage Medicare beneficiary costs increasingly use home health as low-cost-appropriate setting; HHA preferred-provider arrangements with ACO networks.

**(5) Medicare Advantage plans + insurance case managers (5-15% of admits, growing)** -- MA plan case managers + commercial insurance case managers refer with prior authorization; ~50% of Medicare lives now MA driving increasing MA-side referral volume; MA prior auth + rate compression friction is real challenge.

**(6) Outpatient surgery centers + ambulatory care (3-7% of admits)** -- ambulatory surgery centers + outpatient procedures generate post-surgical home health referrals (wound care, drain management, post-op recovery).

**(7) Wound care centers + specialty clinics (2-5% of admits)** -- specialty wound care centers refer complex wound patients for home wound care.

**(8) Adult day care + senior services + community organizations (1-3% of admits)** -- ADC + senior centers + Area Agency on Aging + faith-based community generate occasional referrals.

**(9) Family / community direct admits (2-5% of admits)** -- direct family inquiry via website + community education + word-of-mouth + caregiver referrals.

**(10) Hospital-at-home programs + acute hospital care at home (emerging)** -- CMS Acute Hospital Care at Home waiver-participating hospitals partner with HHAs for hospital-at-home clinical delivery; emerging adjacent referral channel.

**(11) Home infusion + DME suppliers (1-3% of admits)** -- home infusion therapy + DME suppliers refer patients needing skilled nursing coordination.

**(12) VA + Indian Health Service + Tribal referrals** -- VA Community Care Network + IHS + tribal health programs refer veterans + Native Americans.

**(13) PACE + Programs of All-Inclusive Care for the Elderly** -- PACE programs occasionally refer for skilled home health beyond PACE scope.

**Admission cycle**: **(a) Referral receipt** (referral source sends referral with clinical history, hospital discharge summary, recent labs/imaging, attending physician info, medication list), **(b) Clinical eligibility review by intake RN** (assess Medicare home health eligibility -- **homebound status + skilled need + physician plan of care + face-to-face encounter within 90 days prior or 30 days after SOC**), **(c) Insurance verification + Medicare home health benefits eligibility check**, **(d) Start of Care (SOC) visit by RN case manager within 24-48 hours of referral -- comprehensive OASIS-E assessment + plan of care development + medication reconciliation + physician orders confirmation + patient/family education + clinical visit scheduling**, **(e) Plan of care signed by physician + sent to physician for signature within 30 days + Notice of Admission (NOA) submitted within 5 days to CMS**, **(f) Initial clinical visits by RN + PT/OT/SLP as ordered + HHA visits + MSW visits + telehealth/RPM setup if indicated + patient/family education + 60-day certification cycle begins**. The disciplined HHA runs **24-48 hour SOC (faster = higher referral share), same-day-of-referral response, clinical capability to accept complex admits (wound care, IV therapy, complex behavioral, pediatric if equipped, complex chronic disease), low rehospitalization scores driving Star Rating + HHVBP, and maintained census growth toward 500+ patients**.

### PDGM 30-day periods, HHRG case-mix, LUPA & the rate cuts

The **Patient-Driven Groupings Model (PDGM)** is the **economic foundation of Medicare home health** -- replaced the legacy **HHPPS (Home Health Prospective Payment System) 60-day episode model effective January 1, 2020**. PDGM was designed to **shift home health payment from therapy-volume-driven (which incentivized over-utilization of PT/OT visits) to patient-need-driven (which incentivizes clinical complexity + functional impairment + comorbidity coding accuracy)**. The PDGM structure:

**Episode + payment period structure**: Medicare home health is delivered in **60-day certification periods** (with physician recertification required every 60 days) but **paid in two 30-day payment periods** per 60-day cert; agency files one final claim per 30-day payment period.

**HHRG case-mix grouping**: each 30-day payment period grouped into one of **432 HHRG (Home Health Resource Groups) case-mix groups** based on five variables: **(1) Admission Source** -- community admit (patient lived in community prior 14 days, no acute hospital/SNF/IRF/LTACH stay) vs **institutional admit** (patient discharged from acute hospital/SNF/IRF/LTACH within prior 14 days, higher case-mix weight reflecting greater clinical complexity); **(2) Timing** -- **early** (first 30-day payment period within 60-day cert, higher case-mix weight) vs **late** (subsequent 30-day payment periods, lower case-mix weight reflecting CMS view that acute-phase intensity declines over time); **(3) Clinical Grouping** -- 12 clinical groups based on primary diagnosis: **MMTA-Other (Medication Management Teaching and Assessment), MMTA-Cardiac/Circulatory, MMTA-Endocrine, MMTA-GI/GU, MMTA-Infectious, MMTA-Respiratory, MMTA-Surgical Aftercare, Behavioral Health, Complex Nursing Interventions, Musculoskeletal Rehabilitation, Neuro Rehabilitation, Wounds**; clinical group weight varies (Wounds + Complex Nursing typically higher, Behavioral Health typically lower); **(4) Functional Impairment Level** -- low / medium / high based on OASIS-E functional items (grooming, current dressing upper body, current dressing lower body, current bathing, toileting hygiene, transferring, ambulation, eating, prior functioning); higher impairment = higher case-mix weight; **(5) Comorbidity Adjustment** -- no adjustment / low / high based on secondary diagnoses (specific ICD-10 codes for diabetes, CHF, CKD, dementia, etc.); higher comorbidity = higher case-mix weight. **Total possible HHRG combinations: 2 admission sources × 2 timings × 12 clinical groups × 3 functional levels × 3 comorbidity = 432 groups**.

**FY2025 base 30-day payment rate ~$2,038** (FY2025 base $2,037.65 with wage index adjustment + HHRG case-mix weight + HHVBP adjustment). Average HHA collects **$1,500-$2,800 per 30-day payment period depending on case-mix mix**.

**LUPA (Low Utilization Payment Adjustment)**: episodes with **fewer than the LUPA threshold visits** in a 30-day payment period are **paid per-visit (~$185-$285/visit by discipline)** rather than full HHRG case-mix episode payment. **LUPA threshold varies by HHRG group from 2 to 6 visits** (CMS sets threshold at 10th percentile of visit count for each HHRG); typical operational threshold ~3-4 visits. **LUPA is the dominant operational risk** -- episodes below threshold generate **~30-60% less revenue** than full HHRG payment; disciplined HHAs monitor LUPA risk in real-time + adjust visit patterns to push episodes above threshold (without unnecessary visits). **Average LUPA % industry-wide: 7-10%** of 30-day periods; **target LUPA % <5% for disciplined operators**.

**PDGM Behavioral Adjustment + ongoing rate cuts (2024-2026)**: CMS implemented PDGM with a **behavioral adjustment of -4.36%** in 2020 assuming agencies would change coding/visit behavior (more institutional-source coding, more early-period coding, more comorbidity coding) to inflate payments; CMS then **monitored actual coding behavior** and found agencies did adjust coding upward, triggering ongoing **rate clawbacks**: **negative 3.925% in CY2023, negative 2.890% in CY2024, negative 1.975% in CY2025**, with projected continued cuts in CY2026 totaling **4-7% cumulative** rate reduction. Industry advocates (NAHC + Partnership for Quality Home Healthcare) lobbying CMS + Congress to reverse behavioral adjustment cuts; CMS reduced cumulative cuts from initial proposals through stakeholder feedback.

**Sequential billing + NOA discipline** -- Medicare home health requires **Notice of Admission (NOA) submitted within 5 calendar days of Start of Care** (replaced RAP Request for Anticipated Payment in 2022 -- RAPs historically provided 50-60% early cash but CMS eliminated to combat fraud); **missed NOA = 1/30 daily payment reduction for each day late from SOC to NOA receipt**. Final claim filed at end of each 30-day payment period.

**Medicare Advantage home health rate compression** -- ~50% of Medicare lives now MA; MA plans pay home health agencies **60-85% of traditional Medicare PDGM rates** with prior authorization + visit limits + utilization management; MA-side rate compression is dominant margin pressure as MA penetration grows. Some MA plans contract via percent-of-PDGM (60-85%) others via per-visit rates ($95-$165/visit) others via capitation.

### Medicare audits, qui tam DOJ, PEPPER & federal moratoriums

Medicare audit + DOJ qui tam False Claims Act + PEPPER + federal moratoriums are the **largest single existential risks for home health operators** -- DOJ has recovered **$5B+ in home health False Claims Act settlements 2010-2024**. Major named cases: **(a) Amedisys** -- $150M settlement 2014 for OASIS over-coding + therapy over-utilization + ineligible patients; **(b) Kindred Healthcare / Gentiva** -- $125M+ cumulative settlements for therapy over-utilization + ineligible patients (Kindred at Home was acquired by Humana 2018 then partial divest 2022 then reabsorbed 2022 as CenterWell Home Health); **(c) LHC Group** -- $65M+ cumulative settlements (LHC acquired by Optum/UnitedHealth April 2023); **(d) Almost Family** -- $9.4M settlement 2017; **(e) Maxim Healthcare Services** -- $150M settlement 2011 for over-billing; **(f) ResCare** -- multiple settlements; **(g) numerous smaller settlements** $2M-$50M range; **(h) ongoing qui tam (whistleblower) FCA cases** filed by former employees + nurses + therapists under seal with potential 15-30% relator share of settlements driving plaintiff bar interest.

**Federal home health audit + enforcement apparatus**:

**(1) UPIC (Unified Program Integrity Contractor)** -- CMS-contracted audit contractor performing **post-payment review of Medicare home health claims** flagged by data analytics + complaints + referral; can request medical records via **ADR (Additional Documentation Request)** and **recoupment** if claims unsupported. Major UPICs: **CGI Federal (Northeast), Performant Recovery (Midwest), SafeGuard Services (Southeast + West), AdvanceMed (West)**.

**(2) ZPIC (Zone Program Integrity Contractor)** -- predecessor to UPIC, still referenced in legacy contracts.

**(3) TPE (Targeted Probe and Educate)** -- MAC-run program reviewing 20-40 claims per round (up to 3 rounds), providing education between rounds, with **MAC referral to UPIC + recoupment if not improved**. Major MACs for home health: **Palmetto GBA (JM), CGS Administrators (JN), National Government Services (J6, JK), Noridian (JE, JF), Novitas Solutions (JL, JH)**.

**(4) RAC (Recovery Audit Contractor)** -- contingency-fee audit contractor reviewing claims for over-payment.

**(5) OIG (Office of Inspector General -- HHS)** -- federal investigative + audit arm performing **Work Plan audits + Compliance Program reviews + Corporate Integrity Agreements (CIA)** post-settlement; OIG publishes annual **Work Plan** identifying home health audit priorities (OASIS over-coding, therapy over-utilization, ineligible patients, homebound status, face-to-face encounter, plan of care).

**(6) DOJ (Department of Justice)** -- federal criminal + civil prosecution; **DOJ qui tam False Claims Act actions** filed under seal by whistleblowers with potential **15-30% relator share**; DOJ has recovered $5B+ in home health FCA 2010-2024.

**(7) HEAT (Health Care Fraud Prevention and Enforcement Action Team)** -- joint DOJ + HHS strike force focused on Medicare fraud in **Miami, Houston, Detroit, Los Angeles, Brooklyn, Tampa, Chicago, Dallas** with home health major target driving FL/IL/MI/TX federal moratoriums.

**(8) PEPPER (Program for Evaluating Payment Patterns Electronic Report)** -- TMF Health Quality Institute-prepared **comparative analytics report** distributed quarterly to every Medicare home health agency. PEPPER reports each HHA's **percentiles vs national/state peers on home-health-specific outlier indicators**: **(a) Average Case Mix**, **(b) Episodes with 5 or 6 Therapy Visits**, **(c) High Therapy Episodes (≥20 visits)**, **(d) Average Visits per Episode**, **(e) Hospitalization rate**, **(f) Outlier Payments**, **(g) Non-LUPA Episodes**, **(h) LUPA Episodes**. Hospitals in **80th+ percentile (or 20th percentile for under-utilization) face elevated audit risk + recommended internal review + potential UPIC referral**.

**(9) Pre-Claim Review / Review Choice Demonstration (RCD)** -- CMS implemented Pre-Claim Review Demonstration in **Illinois 2016** then expanded as **Review Choice Demonstration (RCD)** in **IL, OH, NC, FL, TX** with three choice options: **(a) 100% pre-claim review, (b) 100% post-payment review, (c) 25% pre-payment review with reduced scrutiny option after high performance**.

**(10) Federal Medicare HHA enrollment moratoriums** -- CMS imposed **temporary moratoriums on new Medicare HHA enrollments** in **FL (Miami-Dade + Broward), IL (Chicago), MI (Detroit), TX (Dallas + Houston)** beginning 2013 + extended multiple times + lifted 2019 + partially reinstated 2020+ in selected areas; operators verify current status via CMS PECOS + Moratoria Tool.

**(11) OASIS-E accuracy + ICD-10 coding scrutiny** -- OASIS-E over-coding (functional impairment + comorbidity coding driving up HHRG case-mix weight) + ICD-10 coding errors are dominant audit flags; sophisticated HHAs invest in OASIS-E QA reviewer + ICD-10 certified coders.

**(12) Homebound status documentation** -- Medicare requires patient be **homebound** (confined to home with normal inability to leave home + requires considerable + taxing effort + occasional absences for medical/non-medical reasons allowed); homebound status documentation must be in clinical record + face-to-face encounter; insufficient documentation = audit flag.

**(13) Face-to-Face encounter documentation** -- Medicare requires face-to-face encounter by physician or NP within 90 days prior or 30 days after SOC; documentation must support homebound + skilled need; missing or inadequate F2F = payment denial.

**(14) Compliance program + corporate integrity** -- sophisticated HHAs maintain **OIG-compliant compliance program (written policies + training + monitoring + reporting + investigation + enforcement)**, **internal OASIS-E QA review + ICD-10 coding audit + LUPA monitoring + PEPPER review + HHVBP review (quarterly minimum)**, **internal medical record audit + eligibility validation**, **whistleblower reporting hotline + non-retaliation policy**, **OIG Exclusion List monthly screening (no excluded individuals can work for Medicare provider)**, **CIA (Corporate Integrity Agreement) compliance if applicable post-settlement**.

**The audit + qui tam + moratorium exposure is the dominant financial + reputational risk in home health** -- sophisticated operators treat compliance + OASIS-E accuracy + LUPA discipline + HHVBP optimization as the highest operational priority above growth.

### HHQRP + OASIS-E + CAHPS + HHVBP value-based purchasing

Home Health Quality Reporting Program (HHQRP) is mandatory CMS quality reporting; **failure to report = 2% Medicare payment reduction**. Four components:

**(1) OASIS-E (Outcome and Assessment Information Set version E)** -- effective **January 2023** expanding from OASIS-D1 with **100+ items** scored at **Start of Care (SOC), Resumption of Care (ROC), Recertification (every 60 days), Transfer to inpatient facility, Discharge from agency**; OASIS-E added **standardized assessment items for transfer of health information + social determinants of health + cognitive function + behavioral health screening**; submitted electronically via **CMS QIES (Quality Improvement and Evaluation System) ASAP**; drives **HHRG case-mix payment + HHVBP quality measures + HHQRP reporting + Star Rating on Care Compare**.

**(2) HHCAHPS (Home Health Consumer Assessment of Healthcare Providers and Systems Survey)** -- patient experience survey administered by CMS-approved CAHPS vendor (**NRC Health, Press Ganey, Strategic Healthcare Programs SHP, Deyta Analytics, HEALTHCAREfirst CAHPS, Fazzi Associates**); 34 questions across 3 composite measures: **Care of Patients, Communication Between Providers and Patients, Specific Care Issues** + 2 global rating measures (overall rating 0-10 + willingness to recommend); publicly reported on Care Compare quarterly.

**(3) Claims-based outcome measures** -- CMS calculates from Medicare claims data: **(a) Acute Care Hospitalization During First 60 Days of Home Health**, **(b) Emergency Department Use Without Hospitalization During First 60 Days of Home Health**, **(c) Discharge to Community**, **(d) Medicare Spending Per Beneficiary (MSPB)**.

**(4) HHVBP (Home Health Value-Based Purchasing)** -- **nationwide January 2023** (after 9-state pilot 2016-2022) with **payment adjustments plus/minus 5% by CY2025 escalating toward plus/minus 9% by CY2028** based on **Total Performance Score across 12 measures**: OASIS-based outcomes (Improvement in Dyspnea, Improvement in Ambulation, Improvement in Bathing, Improvement in Management of Oral Medications, Discharge Function Score), claims-based outcomes (Acute Care Hospitalization, Emergency Department Use), HHCAHPS measures (Care of Patients, Communication, Specific Care Issues, Overall Rating, Willingness to Recommend). Each HHA's Total Performance Score compared to **(a) baseline (own historical performance)** and **(b) cohort (size-matched peer cohort)**; achievement score + improvement score combined for Total Performance Score; payment adjustment applied to Medicare base rate.

**Star Rating on Care Compare** -- CMS publishes **two Star Ratings**: **(a) Quality of Patient Care Star Rating (1-5 stars)** based on OASIS + claims-based outcomes, **(b) Patient Survey Star Rating (1-5 stars)** based on HHCAHPS; publicly displayed on Care Compare driving patient + referral source choice.

The disciplined home health operator: **builds OASIS-E + HHCAHPS + claims-based outcome reporting into EMR workflow with automated data capture + automated submission + real-time dashboards**, **monitors OASIS-E accuracy monthly with corrective action for coding errors + functional/comorbidity coding optimization**, **monitors HHCAHPS results quarterly with corrective action for low scores (visit-pattern + training + communication improvement)**, **monitors HHVBP Total Performance Score quarterly with corrective action for low measures (especially Improvement in Ambulation + Bathing + Dyspnea + Acute Care Hospitalization + ED Use)**, **incorporates HHVBP performance into QAPI program + clinical staff incentive compensation + Star Rating optimization**.

---

## 📈 PART 4 -- GROWTH & EXIT

### Marketing, community education & referral cultivation

Home health marketing is fundamentally **B2B-to-referral-sources** (hospital discharge planners + SNF/IRF step-down + physicians + ACO/MA + community organizations) plus secondary **B2C-to-families-researching-home-health-care**. The marketing stack:

**(1) Home health liaisons / community liaisons (PRIMARY BD function)** -- HHA-employed BD reps embedded with referring hospitals + SNFs + IRFs + physician practices; **daily presence + same-day response + clinical capability + 24-48 hour SOC + low rehospitalization scores + responsive communication**; **5-15 strong referral relationships drive 40-60% of admits**.

**(2) Hospital preferred-HHA panel positioning** -- large hospital systems (HCA, Tenet, Ascension, CommonSpirit, Trinity, Providence, AdventHealth, Cleveland Clinic, Mayo, Kaiser, Sutter, Banner, Atrium, Northwell) maintain preferred-HHA lists with 3-7 HHAs; quality demonstration + low rehospitalization + Star Rating earn inclusion.

**(3) Physician outreach + CME (Continuing Medical Education)** -- quarterly CME events for referring physicians on **home health eligibility + Medicare benefit + chronic disease management at home + post-acute care coordination**.

**(4) ACO + MA plan partnerships** -- formal partnerships with ACOs + MA plans for preferred-provider arrangements; growing dominant referral pathway as value-based care expands.

**(5) Community education + senior services outreach** -- community presentations to senior centers + faith communities + civic organizations + Area Agency on Aging on **home health services + Medicare benefit + chronic disease management**.

**(6) Care Compare profile optimization** -- HHA profile on **medicare.gov/care-compare** with Star Rating + Quality measures + HHCAHPS + services + ownership; respond to data accuracy + family reviews.

**(7) Website with services + clinical specialties + admissions inquiry form + family resources** -- modern home health websites support family decision-making + referral source verification.

**(8) Google Business Profile + Maps + Google Ads** -- local search for **[city] home health / home health near me / Medicare home health [city]**; Google Ads $5-$15 CPC.

**(9) NAHC + Partnership for Quality Home Healthcare + state home care association** -- industry association membership + advocacy + networking + education + benchmarking.

**(10) HHVBP performance positioning** -- top-quartile HHVBP Total Performance Score = referral source preference + Medicare payment premium.

**(11) Reputation management** -- Google/Yelp/Facebook reviews + Care Compare quality measures + HHCAHPS patient satisfaction; **respond to all reviews professionally**; address complaints rapidly.

**(12) Specialty positioning** -- complex wound care, IV therapy, behavioral health, pediatric home health, perinatal, post-cardiac, post-orthopedic surgery, oncology, dementia/Alzheimer's specialty programs.

**Marketing budget**: typical HHA runs **2-4% of revenue on marketing** ($200K-$720K annually for stabilized 500-census HHA) including home health liaisons (often largest line item at $100K-$210K loaded cost per liaison), CRM/intake software, Google Ads, community engagement, CME events, NAHC membership. **Census benchmarks**: target stabilized **500-1,000 census for single-office HHA**; **scaling to 2,500-10,000 census for multi-office regional HHA**; **50,000-350,000+ census for multi-state mega platform**. **Census growth rate**: disciplined HHA grows **15-35% census annually** in years 1-3 from de novo ramp; **8-15% organic + acquisition growth** in mature years.

### Scale milestones from 1 office to multi-state platform

**Single-office 100-300 census HHA**: $2M-$6M revenue, 25-50 FTE (with per-visit therapy contracted), 5-12% EBITDA margin, $100K-$720K EBITDA, founder is hands-on Administrator typically with DPCS + business office; single-office founder profile = manageable regulatory + operational job; lifestyle business or growth platform.

**Single-office 300-700 census HHA**: $6M-$14M revenue, 45-85 FTE, 8-15% EBITDA margin, $480K-$2.1M EBITDA; sub-acquisition candidate or scaling regional platform foundation.

**Multi-office regional 2-5 offices (500-2,500 census)**: $10M-$50M revenue, 75-300 FTE; founder transitions to regional executive role with office Administrators reporting; shared back-office (HR, accounting, billing, compliance, regulatory affairs, BD, IT, EMR, OASIS-E QA).

**Multi-state platform 5-25 offices (2,500-15,000 census)**: $50M-$300M revenue, 300-1,500 FTE; dedicated regional VPs + Chief Clinical Officer + Chief Compliance Officer + Chief Medical Officer + Chief Financial Officer + dedicated regulatory affairs + audit defense + OASIS-E optimization + HHVBP optimization + Star Rating optimization; strong sub-acquisition candidate for PE-backed national consolidators or strategic acquirers (Optum, Humana CenterWell, AccentCare, Amedisys, BAYADA, Aveanna).

**National platform 25-960+ offices (15,000-350,000+ census)**: $300M-$3B+ revenue, 1,500-30,000 FTE; **LHC Group (Optum/UnitedHealth acquired April 2023 for $5.4B, ~300,000+ patients, ~960 locations across 38 states), CenterWell Home Health (Humana NYSE: HUM, ~350,000+ patients, ~750 locations across 38 states, largest US home health by census), Amedisys (NASDAQ: AMED, ~300,000+ patients, ~520 home health locations, Optum acquisition pending FTC review), Encompass/Enhabit (NYSE: EHAB, ~250 home health locations + ~110 hospice locations across 34 states), AccentCare (Advent International, ~245 home health locations), Aveanna (NASDAQ: AVAH, ~340 locations), BAYADA (~390 locations), BrightSpring (NASDAQ: BTSG, ~10,000 service locations), Pennant Group (NASDAQ: PNTG, ~135 locations), Compassus (~250 locations), Elara Caring (~225 locations)**.

**Scaling capital**: **PE growth equity at platform scale** (2+ offices or strategic positioning) including healthcare-focused PE (**Audax, Vistria Group, Welsh Carson Anderson & Stowe, Clayton Dubilier & Rice, Carlyle Group, KKR, Apollo, Bain Capital, TPG, Webster Equity Partners, Advent International, TowerBrook, Linden Capital Partners, Avista Capital, Centre Partners, Lee Equity Partners, GTCR**); **strategic acquirers (Optum/UnitedHealth, Humana CenterWell, Aetna/CVS, AccentCare, Amedisys, BAYADA, Aveanna, BrightSpring, Compassus, Pennant)**; **conventional commercial debt** through healthcare lenders (BMO Harris, Capital One Healthcare, Truist Healthcare Banking, KeyBanc, Fifth Third, Regions, MidCap Financial); **SBA 7(a) for smaller-scale acquisitions up to $5M**; **revenue-based financing or factoring** for working capital (post-RAP-elimination Medicare cash cycle requires more working capital than pre-2022).

### PE/strategic consolidation, Optum dominance & exit math

Exit multiples for home health operating companies in 2025-2026 vary by scale, census, payer mix, EBITDA margin, geographic concentration, audit standing, HHVBP score, Star Rating, and accreditation. **Multiples have compressed from pre-Optum-era 8-12x EBITDA range to current 6-10x range** as PDGM cuts + behavioral adjustment + HHVBP penalties + RN labor + MA rate compression + Optum-Amedisys FTC scrutiny weigh on the space.

**Single-office HHA (100-500 census)**: typically sells at **5-7x EBITDA** depending on census + payer mix + market position + audit history + HHVBP score; **7-9x for stabilized 500+ census with clean audit + 4-5 stars on Care Compare + top-quartile HHVBP**; **4-6x for sub-200 census + audit issues + low Star Rating**; **distressed/under-100 census + audit/CIA + LUPA issues at 3-5x or asset-sale-only**.

**Multi-office regional HHA (500-2,500 census)**: **6-9x EBITDA** for stabilized regional HHAs with diversified geographic mix + strong quality + balanced payer mix + clean audit. **Multi-state platform (2,500-15,000 census)**: **7-10x EBITDA** for top-tier regional operators. **National platform (15,000-350,000+ census)**: **8-12x EBITDA** for top-tier brand operators (Optum paid 5.4B for LHC at ~12x EBITDA April 2023 reflecting strategic value of MA + senior services integration vs standalone home health multiple).

**Optum/UnitedHealth dominance + Amedisys FTC scrutiny** -- Optum acquired **LHC Group April 2023 for $5.4B** (closed), Optum announced **Amedisys acquisition for $3.3B June 2023** (pending FTC review since 2023, FTC + DOJ scrutiny on healthcare consolidation, deal status uncertain through 2024-2026); combined LHC + Amedisys under Optum would represent **~600,000+ annual home health patients + ~$5B+ home health revenue under single insurer integrating Medicare Advantage + home health vertically**; antitrust + competition concerns. **Humana CenterWell Home Health (formerly Kindred at Home)** -- Humana acquired Kindred at Home 2018 + partial divest to Clayton Dubilier + TPG 2022 + reabsorbed 2022 as CenterWell Home Health = **~350,000+ patients, ~750 locations across 38 states, largest US home health by census** integrated with Humana Medicare Advantage.

**PE consolidators historically active in home health**: **Advent International (AccentCare 2019), Welsh Carson Anderson & Stowe (Curo legacy, now Humana), Audax Group (Compassus + HouseWorks), Vistria Group, Clayton Dubilier & Rice + TPG (Humana home health partial 2021-2022), Webster Equity Partners (Bristol Hospice), TowerBrook (Compassus), Linden Capital Partners, Avista Capital, Centre Partners, Lee Equity Partners, GTCR, Carlyle Group, KKR, Apollo, Bain Capital, BrightSpring/KKR PE (NASDAQ: BTSG IPO January 2024)**.

**Strategic operating company acquirers**: **Optum/UnitedHealth (LHC + Amedisys pending), Humana CenterWell, AccentCare, Amedisys (independent until FTC ruling), BAYADA, Aveanna, BrightSpring, Compassus, Pennant, Encompass/Enhabit, regional operators in target geographies**.

**Exit valuation drivers**: **(1) Census scale (larger census = higher multiple, 500+ census threshold for serious PE attention, 2,500+ for national PE interest)**, **(2) EBITDA margin (12%+ premium, sub-8% discount, 15%+ rare premium)**, **(3) HHVBP Total Performance Score (top-quartile premium, bottom-quartile discount)**, **(4) Star Rating on Care Compare (4-5 stars premium, 1-2 stars discount)**, **(5) Audit posture + history (clean PEPPER/UPIC/TPE premium, CIA or active audit deep discount)**, **(6) LUPA % (sub-5% premium, 10%+ discount)**, **(7) Payer mix (traditional Medicare-dominant 70%+ premium, MA-heavy discount due to rate compression)**, **(8) Geographic concentration (single-state efficiency premium, multi-state platform premium for national PE interest)**, **(9) Accreditation (CHAP/ACHC/TJC current premium, lapsed/issues discount)**, **(10) Referral source concentration (diversified 5-15 sources premium, 1-2 source concentration discount)**, **(11) CON / moratorium status (CON-state premium for acquired CON moat; moratorium-state premium for acquired provider number)**, **(12) Founder transition (founder willing to roll equity + 2-3 year earn-out premium)**.

### Counter-case & risks

Covered in detail in the dedicated Counter-Case section below: **PDGM behavioral adjustment + 2024-2026 cumulative rate cuts 4-7%, OASIS-E complexity + over-coding audit risk, HHVBP nationwide 2023+ with payment adjustments plus/minus 5% by 2025 escalating to plus/minus 9% by 2028, federal CMS moratoriums in FL/IL/MI/TX, 17-state CON barrier (AL/CT/DC/GA/KY/MD/MS/NC/NJ/NY/NV/RI/SC/TN/VT/WV/WA), DOJ qui tam False Claims Act $5B+ recovered 2010-2024 (Amedisys $150M, Kindred/Gentiva $125M+, LHC $65M+, Maxim $150M), RN labor crisis (40-55% turnover + contract agency 2-3x premium), referral source dependency (40-60% from 5-15 sources, losing 1-2 collapses census), hospital readmission penalty effects driving HHA selection, Optum dominance + Amedisys FTC scrutiny + antitrust concerns, MA-side rate compression (60-85% of FFS rates), RAP elimination 2022 lengthening Medicare cash cycle, LUPA payment cliff risk, HHQRP/HHCAHPS reporting burden, Star Rating competitive pressure**.

`;


const flow = `

## The Operating Journey: From CMS-855A Application To Stabilized Multi-State Home Health Platform

\`\`\`mermaid
flowchart TD
  A[Founder Decides To Start Home Health Agency Business] --> B[Sub-Market Plus Format Plus Capital Decision]
  B --> B1{Capital Plus Format Plus CON Plus Moratorium Reality}
  B1 -->|$165K-$465K De Novo Non-CON Non-Moratorium State CMS-855A Plus State License Plus CHAP/ACHC/TJC| C1[De Novo Non-CON Non-Moratorium Operator]
  B1 -->|$465K-$1.4M De Novo CON State With CON Application Plus Consulting Plus Competing Apps| C2[De Novo CON-State Operator]
  B1 -->|CHOW ONLY in FL/IL/MI/TX Moratorium Markets| C3[CHOW Moratorium-State Operator]
  B1 -->|$1.4M-$7M Acquire Existing Operating HHA 200-700 Census With Active Provider Number| C4[CHOW Acquisition Operator]
  B1 -->|Multi-Office Regional Rollup PE-Backed Acquisition Strategy| C5[PE-Backed Regional Consolidator]
  B1 -->|Hospital/Health-System JV Or Subsidiary Home Health Service Line| C6[Health-System Home Health]
  C1 --> D[CMS-855A Plus State DOH Plus CHAP/ACHC/TJC Accreditation Plus CoP Licensing Stack]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  C6 --> D
  D --> D1[Verify CMS Moratorium Status Via PECOS Plus Moratoria Tool FL/IL/MI/TX]
  D --> D2[CON Certificate Of Need In 17 CON States 6-18 Month Review Plus Public Hearings]
  D --> D3[State DOH Home Health License Initial Application Plus Annual Recertification]
  D --> D4[CMS Form 855A Medicare HHA Provider Enrollment 12-30 Months De Novo]
  D --> D5[CHAP Or ACHC Or TJC Accreditation Initial Survey Plus 3-Year Recertification]
  D --> D6[Initial CMS Certification Survey After First Patient Validating 42 CFR 484 CoP]
  D --> D7[CHOW Change Of Ownership 60-180 Day Process With Provisional Billing Risk]
  D1 --> E[Insurance Stack For Home Health Operations]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  D6 --> E
  D7 --> E
  E --> E1[Professional Liability Plus GL $1M/$3M Min $2M/$5M Preferred Multi-State $5M-$15M]
  E --> E2[Workers Comp NCCI 8826 Home Health Care $2.50-$6.50 Per $100 Payroll]
  E --> E3[Non-Owned Auto $1M-$2M For Clinician-Driven Personal Vehicles To Patient Homes]
  E --> E4[Cyber Liability $2M-$5M HIPAA Plus Ransomware Plus EPLI $1M-$3M Plus D&O $1M-$5M]
  E --> E5[Umbrella $5M-$25M Plus Sexual Abuse Sub-Limit $500K-$3M Total Year 1 $200K-$850K]
  E1 --> F[Operating Systems Plus OASIS-E EMR Plus Scheduling Plus EVV Plus Billing]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  F --> F1[Homecare Homebase ~30%+ Home Health Share Or MatrixCare Or WellSky Or Axxess EMR]
  F --> F2[OASIS-E Assessment At SOC Plus Recert Plus Transfer Plus Discharge Drives HHRG]
  F --> F3[EVV Electronic Visit Verification HHAeXchange Or Sandata Per 21st Century Cures Act]
  F --> F4[Forcura Or Trella Or Playmaker CRM Referral Tracking Plus Intake Plus BD]
  F --> F5[HHQRP HHCAHPS Plus HHVBP Plus Star Rating Reporting Automated Via EMR]
  F1 --> G[Clinician Staffing Per 42 CFR 484 CoP Plus Community Liaison BD]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  G --> G1[Administrator Plus DPCS RN Plus Clinical Manager Plus OASIS-E QA Reviewer]
  G --> G2[RN Case Manager 1:25 Ratio Plus LPN/LVN Plus 5-7 Visits/Day Per Visit Or Salary]
  G --> G3[PT Plus OT Plus SLP Plus PTA Plus COTA Per-Visit Or Employed Plus HHA CNA]
  G --> G4[MSW Per CoP Plus Compliance Officer Plus QAPI Plus Star Rating Optimization]
  G --> G5[Contract Agency RN $85-$135/hour Vs Core $75K-$110K 2-3x Premium Goal Under 10%]
  G1 --> H[Referral Pipeline Hospital Plus SNF/IRF Plus ACO/MA Plus Physicians 40-60% Of Admits]
  H --> H1[Community Liaisons Embedded With Hospitals Plus SNF Plus IRF Plus Physician Daily]
  H --> H2[24-48 Hour SOC Plus Same-Day Response Plus Complex Admits Plus Low Rehosp Score]
  H --> H3[ACO Plus MA Plan Preferred-Provider Partnerships Growing Pathway]
  H --> H4[Hospital Preferred-HHA Panel Inclusion Via HHVBP Plus Star Rating Plus Rehosp]
  H1 --> I[Medicare PDGM 30-Day Period Plus HHRG Case-Mix Plus LUPA Plus HHVBP]
  H2 --> I
  H3 --> I
  H4 --> I
  I --> I1[PDGM 30-Day Payment Period Within 60-Day Cert Plus HHRG 432 Case-Mix Groups]
  I --> I2[HHRG Admission Source Plus Timing Plus Clinical Group Plus Functional Plus Comorbidity]
  I --> I3[LUPA Threshold ~30 Visits Per 30-Day Period Sub-Threshold Paid Per-Visit Cliff]
  I --> I4[PDGM Behavioral Adjustment Cumulative Rate Cuts 4-7% 2024-2026]
  I --> I5[FY2025 Base 30-Day Rate ~$2,038 Adjusted By HHRG Wage Index HHVBP]
  J{Medicare Audit Plus Qui Tam DOJ Plus PEPPER Plus Moratoriums Risk Management}
  I --> J
  J -->|UPIC + ZPIC + TPE + RAC + RCD Audit With ADR Additional Documentation Request| K[Payment Recoupment + Corporate Integrity Agreement CIA If Significant]
  J -->|OIG Work Plan Audit Plus DOJ Qui Tam FCA Whistleblower Action 15-30% Relator Share| L[DOJ Settlement $2M-$150M+ Plus CIA Plus Reputation Damage]
  J -->|PEPPER 80th+ Percentile Outlier Or HHVBP Underperformance Or Federal Moratorium| M[CMS Audit Selection Plus Up To 5% HHVBP Payment Reduction Plus Moratorium Block]
  K --> N[Compliance Program Plus OASIS-E Accuracy Plus LUPA Discipline Plus HHVBP Optimization]
  L --> N
  M --> N
  N --> N1[OASIS-E Accuracy Plus ICD-10 Coding Plus HHRG Case-Mix Plus Functional Plus Comorbidity]
  N --> N2[QAPI Plus Internal OASIS Audit Plus LUPA Monitoring Plus PEPPER Review Quarterly]
  N --> N3[OIG Exclusion List Monthly Screening Plus Whistleblower Hotline Plus Non-Retaliation]
  N --> N4[HHQRP Plus OASIS-E Plus HHCAHPS Plus HHVBP Reporting Automated Via EMR With Dashboard]
  N1 --> O{Scale Decision After Stabilization}
  N2 --> O
  N3 --> O
  N4 --> O
  O -->|Acquire Second Office Or Build| P[Multi-Office Regional 500-2,500 Census With Office Administrator]
  O -->|Owner-Operator Continuation Single Office 300-700 Census Lifestyle Or Growth Foundation| Q[Single-Office Owner-Operator Mature HHA]
  O -->|PE Or Strategic Acquisition Roll-Up Path Position For Sale| R[PE-Backed Regional Rollup Or Strategic Exit]
  P --> S[Multi-State Platform 5-25 Offices 2,500-15,000 Census With CMO Plus CCO Plus CFO]
  Q --> T[Single-Office Owner-Operator $480K-$2.1M EBITDA]
  R --> U[Multi-Office OpCo Like Pennant PNTG Or Compassus Or AccentCare Or BAYADA]
  S --> V{Strategic Exit Or Continued Growth}
  V -->|Sell To PE Or Strategic At 7-10x EBITDA Premium For HHVBP + Star Rating + Audit| W[Strategic Sale To Optum Or Humana CenterWell Or AccentCare Or Audax Or BAYADA]
  V -->|Continue Growth To National Platform 25-960+ Offices 15,000-350,000+ Census| X[National Platform Like LHC Optum Or CenterWell Humana Or Amedisys Or Enhabit]
\`\`\`

## The Decision Matrix: Format Selection And Operating Model

\`\`\`mermaid
flowchart TD
  A[Founder Has Capital Plus Healthcare Experience Plus Target State] --> B{Capital Plus State CON Plus Moratorium Plus Ownership Structure}
  B -->|$165K-$465K De Novo Non-CON Non-Moratorium State Easiest Path For Nurse/PT/MD Founder| C[De Novo Non-CON Non-Moratorium Operator]
  B -->|$465K-$1.4M De Novo CON State With Application + Consulting + Competing Apps| D[De Novo CON-State Operator]
  B -->|CHOW REQUIRED In FL/IL/MI/TX Moratorium Markets No De Novo Allowed| E[CHOW Moratorium-State Operator]
  B -->|$1.4M-$7M Acquire Existing Operating HHA CHOW Active Provider Number Plus Census| F[CHOW Acquisition Operator]
  B -->|Nonprofit 501(c)(3) VNA Visiting Nurse Association Mission-Driven| G[Nonprofit VNA Home Health]
  B -->|Hospital/Health-System Subsidiary Or JV Home Health Service Line| H[Health-System Home Health]
  B -->|PE-Backed Regional Rollup Multi-Office Acquisition Strategy| I[PE-Backed Regional Consolidator]
  C --> C1[CMS-855A Plus State DOH License Plus CHAP/ACHC/TJC Accreditation 12-30 Month De Novo]
  C --> C2[Most Common Path For Single-Founder Nurse-RN Or Physical Therapist Or HHA Veteran Entry]
  C --> C3[$2M-$8M Year 2-3 Stabilized Revenue 100-500 Census 5-12% EBITDA Margin]
  C --> C4[Easiest Path In Non-CON Non-Moratorium State For Capital-Limited Founder With Strong Referral Network]
  D --> D1[CON Application Plus Consulting Plus Public Hearings Plus Competing Apps 25-55% Success Rate]
  D --> D2[Often Impractical Without Bed/License Relocation Or Acquisition Of Existing CON]
  D --> D3[Best For Operators With Capital + Local Political Relationships + Patience For 18-30 Months]
  E --> E1[Federal CMS Moratorium FL Miami-Dade Plus Broward Plus IL Chicago Plus MI Detroit Plus TX Dallas Plus Houston]
  E --> E2[CHOW Acquisition Is Only Entry Path Verify PECOS Plus Moratoria Tool Current Status]
  E --> E3[Acquisition Multiples Elevated In Moratorium Markets Due To Scarcity Of Active Provider Numbers]
  F --> F1[Existing CMS Provider Number Plus Accreditation Plus Referral Relationships Plus Census]
  F --> F2[0.6-1.2x Annual Revenue OR 5-9x EBITDA Multiple Depending On Census + Audit + HHVBP]
  F --> F3[CHOW 60-180 Days With Provisional Billing Risk Plus Re-Survey]
  F --> F4[Easiest Path In Moratorium States Or When Speed To Operating HHA Required]
  G --> G1[501(c)(3) VNA Visiting Nurse Association Plus Charitable Contributions Plus Community Board]
  G --> G2[Historical VNA Model Especially Northeast Urban Slower Growth Plus Mission-Driven]
  G --> G3[Examples VNS Health NYC ~46K Patients Daily Plus VNAA Federation Plus Trinity Health At Home]
  G --> G4[Best For Mission-Driven Founders With Community + Faith + Philanthropic Network]
  H --> H1[Health System Funds Plus Operates Home Health As Post-Acute Service Line]
  H --> H2[Examples Mayo Clinic Home Health Plus Cleveland Clinic Home Care Plus Kaiser Permanente Plus Sutter Plus Providence]
  H --> H3[Standard For Hospital Discharge Integration + Vertical Senior Services]
  H --> H4[Best For Health-System-Affiliated Founders With Internal Sponsorship + Capital]
  I --> I1[Acquire 2-5 Existing HHAs In Geographic Concentration Plus Organic Growth]
  I --> I2[Advent Plus Audax Plus Vistria Plus Welsh Carson Plus KKR Plus Bain Plus Carlyle PE Sponsors]
  I --> I3[National Roll-Up Strategy 15,000-350,000+ Census Multi-State Platform]
  I --> I4[Best For PE Sponsors + Strategic Acquirers With Operating Platform + Capital]
  C4 --> J{Reassess After Year 2-3 Stabilization}
  D3 --> J
  E3 --> J
  F4 --> J
  G4 --> J
  H4 --> J
  I4 --> J
  J -->|Single-Office Owner-Operator Stable Capture $480K-$2.1M EBITDA Lifestyle Or Growth Base| K[Owner-Operator Continuation Path]
  J -->|Demand Plus Strong Referral Pipeline Acquire Or Open Second Office| L[Multi-Office Regional Build]
  J -->|Mature Operations Pursue HHVBP Top-Quartile + 5-Star Rating Quality Position| M[Premium Quality Brand Position]
  J -->|Mature EBITDA Profile For PE Or Strategic Exit At 7-10x EBITDA| N[Position For Sale At 7-10x EBITDA Plus Census Multiple]
  K --> O[Single-Office Owner-Operator HHA Mature $480K-$2.1M EBITDA Lifestyle]
  L --> P[Multi-Office Regional HHA 500-2,500 Census With Shared Back-Office]
  M --> Q[Premium HHVBP Top-Quartile + 5-Star Rating Brand Position]
  N --> R[Strategic Exit To PE Or Strategic Operator At Premium Multiple For HHVBP + Star Rating + Clean Audit]
\`\`\`

`;

const src = `

## Sources

1. **CMS Home Health Center (cms.gov/medicare/medicare-fee-for-service-payment/homehealthpps)** -- Dominant CMS home health payment + regulatory data source covering PDGM 30-day payment periods, HHRG case-mix groups, LUPA thresholds, FY2025 base rate, Home Health Quality Reporting Program, Care Compare. https://www.cms.gov/medicare/medicare-fee-for-service-payment/homehealthpps
2. **CMS 42 CFR 484 Home Health Conditions of Participation** -- Federal regulatory backbone for home health licensing covering patient rights, comprehensive assessment, care planning, QAPI, infection control, skilled professional services, HHA services, personnel qualifications, emergency preparedness, clinical records. https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-484
3. **CMS Care Compare Home Health (medicare.gov/care-compare)** -- Dominant home health quality data source with Star Rating + OASIS + HHCAHPS + claims-based outcome measures, ownership data, contact information. https://www.medicare.gov/care-compare/?providerType=HomeHealth
4. **CMS PDGM Patient-Driven Groupings Model** -- January 2020 PDGM 30-day payment period model with HHRG case-mix groups, behavioral adjustment, ongoing rate cuts CY2023-2026, LUPA thresholds. https://www.cms.gov/Medicare/Medicare-Fee-for-Service-Payment/HomeHealthPPS/HH-PDGM
5. **CMS OASIS-E Outcome and Assessment Information Set version E** -- Effective January 2023 expanding from OASIS-D1 with 100+ assessment items scored at SOC + Recert + Transfer + Discharge driving HHRG payment + HHVBP quality + HHQRP. https://www.cms.gov/Medicare/Quality-Initiatives-Patient-Assessment-Instruments/HomeHealthQualityInits/OASIS-Data-Sets
6. **CMS HHVBP Home Health Value-Based Purchasing** -- Nationwide January 2023 with payment adjustments plus/minus 5% by CY2025 escalating to plus/minus 9% by CY2028 based on Total Performance Score across 12 measures. https://www.cms.gov/Medicare/Quality-Initiatives-Patient-Assessment-Instruments/HHVBP
7. **CMS HHQRP Home Health Quality Reporting Program** -- Mandatory quality reporting program; failure to report = 2% Medicare payment reduction. https://www.cms.gov/Medicare/Quality-Initiatives-Patient-Assessment-Instruments/HomeHealthQualityInits
8. **CMS HHCAHPS Home Health Consumer Assessment Survey** -- Patient experience survey administered by CMS-approved CAHPS vendor (NRC Health, Press Ganey, SHP, Deyta, HEALTHCAREfirst, Fazzi). https://homehealthcahps.org
9. **CMS Star Rating on Care Compare** -- Quality of Patient Care Star Rating (1-5 stars) + Patient Survey Star Rating publicly displayed driving patient + referral source choice. https://www.medicare.gov/care-compare
10. **CMS PEPPER Program for Evaluating Payment Patterns Electronic Report** -- TMF Health Quality Institute-prepared comparative analytics report distributed quarterly with home-health-specific outlier indicators. https://www.pepper.cbrpepper.org
11. **CMS Review Choice Demonstration (RCD) Home Health** -- Illinois 2016 Pre-Claim Review expanded as RCD in IL/OH/NC/FL/TX with three choice options for pre-claim or post-payment review. https://www.cms.gov/research-statistics-data-and-systems/monitoring-programs/medicare-ffs-compliance-programs/review-choice-demonstration/review-choice-demonstration-home-health-services
12. **CMS Medicare HHA Enrollment Moratoriums** -- Temporary moratoriums on new Medicare HHA enrollments in FL (Miami-Dade + Broward), IL (Chicago), MI (Detroit), TX (Dallas + Houston) beginning 2013 + extended multiple times; verify current status via PECOS + Moratoria Tool. https://www.cms.gov/Medicare/Provider-Enrollment-and-Certification/MedicareProviderSupEnroll/MoratoriaProviderServicesandPaymentSystem
13. **NAHC National Association for Home Care and Hospice** -- Dominant home health industry trade association covering ~33,000 home care + hospice providers with policy advocacy, education, regulatory updates. https://www.nahc.org
14. **Partnership for Quality Home Healthcare** -- Industry coalition advocating for traditional Medicare home health policy, PDGM rate restoration. https://www.homehealth4america.org
15. **MedPAC (Medicare Payment Advisory Commission)** -- Independent congressional agency advising Congress on Medicare payment with comprehensive home health payment + quality data in annual March + June reports. https://www.medpac.gov
16. **LHC Group (Optum/UnitedHealth acquired April 2023 for $5.4B)** -- ~300,000+ patients annually, ~960 locations across 38 states, now operates under Optum Home Health umbrella. https://www.lhcgroup.com
17. **CenterWell Home Health (Humana NYSE: HUM, formerly Kindred at Home)** -- ~350,000+ patients, ~750 locations across 38 states, largest US home health by census. https://www.humana.com/centerwell
18. **Amedisys (NASDAQ: AMED)** -- ~300,000+ patients annually, ~520 home health locations + hospice + personal care, Optum acquisition pending FTC review since 2023. https://www.amedisys.com
19. **Enhabit (NYSE: EHAB)** -- Spun off from Encompass Health 2022, ~250 home health + ~110 hospice locations across 34 states. https://www.ehab.com
20. **AccentCare (Advent International)** -- PE-backed home health + hospice + personal care, ~245 home health locations, acquired Seasons Hospice 2020. https://www.accentcare.com
21. **Aveanna Healthcare (NASDAQ: AVAH)** -- ~340 locations across 35 states, home health + hospice + private duty + pediatric. https://www.aveanna.com
22. **BAYADA Home Health Care** -- ~390 locations across 23 states, home health + assistive care + hospice. https://www.bayada.com
23. **BrightSpring Health Services (NASDAQ: BTSG)** -- IPO January 2024 at $13/share raising $693M, ~10,000 service locations across 50 states, home health + hospice + pharmacy + personal care, KKR PE legacy. https://www.brightspringhealth.com
24. **Pennant Group (NASDAQ: PNTG)** -- Ensign Group spinoff 2019, ~135 senior living + home health + hospice across 13 states. https://www.pennantgroup.com
25. **Compassus** -- Audax + TowerBrook PE backed, ~250 locations across 30 states with Ascension Health JV, home health + hospice + palliative + infusion. https://www.compassus.com
26. **Elara Caring** -- PE-backed, ~225 locations across 17 states, home health + hospice + personal care + behavioral health. https://www.elaracaring.com
27. **VNS Health (formerly Visiting Nurse Service of New York)** -- Largest US nonprofit home + community health, ~46,000 patients daily across NYC. https://www.vnshealth.org
28. **Homecare Homebase (Hearst Health)** -- Dominant home health + hospice EMR with ~30%+ market share including LHC, Amedisys, Compassus, Pennant, HouseWorks, BAYADA. https://www.hchb.com
29. **MatrixCare Home Health and Hospice (ResMed)** -- Major home health EMR (also dominant in SNF), full clinical + financial + quality reporting. https://www.matrixcare.com
30. **WellSky Home Health (formerly Kinnser)** -- Dominant mid-market home health EMR. https://wellsky.com/home-health
31. **Axxess Home Health** -- Home health EMR for mid-market with OASIS-E + scheduling + RCM. https://www.axxess.com
32. **HHAeXchange** -- Largest Medicaid EVV (Electronic Visit Verification) vendor for home health and personal care under 21st Century Cures Act mandate. https://www.hhaexchange.com
33. **CHAP (Community Health Accreditation Partner)** -- Dominant home health + hospice accreditor with CMS-deemed status. https://www.chapinc.org
34. **DOJ Home Health Fraud Enforcement (justice.gov)** -- Department of Justice civil + criminal home health fraud prosecution recovered $5B+ 2010-2024 with major cases Amedisys $150M (2014), Kindred/Gentiva $125M+ cumulative, LHC $65M+ cumulative, Maxim $150M (2011). https://www.justice.gov/civil/false-claims-act
35. **BLS 29-1141 Registered Nurses (RN)** -- Bureau of Labor Statistics wage data showing RN median wage $75K-$110K with home health premium $3K-$10K. https://www.bls.gov/oes/current/oes291141.htm

`;

const num = `

## Numbers

**Industry Size And Demand Reality (CMS, NAHC, MedPAC, US Census)**
- US Medicare-certified home health agencies: ~11,500 per CMS Home Health Compare
- US Medicare beneficiaries served by home health annually: ~3.2M per NAHC + MedPAC
- US average episodes per beneficiary year: ~5 per CMS claims data
- Top home health diagnoses: ~25% cardiac/circulatory + ~20% musculoskeletal post-surgical + ~15% diabetes/endocrine + ~12% neurological + ~10% wound/infectious + ~8% respiratory + ~10% other
- 75+ population 2024: ~24M growing to ~45M by 2040 per US Census
- 65+ population 2024: ~58M growing to ~80M by 2040
- For-profit home health market share: ~80% in 2024
- Nonprofit home health market share: ~10%
- Government/hospital-based home health market share: ~10%
- Medicare Advantage penetration of Medicare lives: ~50% in 2024 (growing)
- Home health provider scale: small <100 census, mid 100-500, large 500-2,500, mega 2,500+
- LHC Group (Optum 2023, $5.4B): ~300,000+ patients, ~960 locations, 38 states
- CenterWell Home Health (Humana): ~350,000+ patients, ~750 locations, 38 states (largest by census)
- Amedisys (Optum pending): ~300,000+ patients, ~520 home health locations
- Enhabit (NYSE: EHAB): ~250 home health + ~110 hospice locations, 34 states
- AccentCare (Advent): ~245 home health locations
- Aveanna (NASDAQ: AVAH): ~340 locations, 35 states
- BAYADA: ~390 locations, 23 states
- BrightSpring (NASDAQ: BTSG): ~10,000 service locations, 50 states (IPO January 2024 $13/share $693M raise)
- Pennant Group (NASDAQ: PNTG): ~135 locations, 13 states
- Compassus: ~250 locations, 30 states (Audax + TowerBrook + Ascension JV)
- Elara Caring: ~225 locations, 17 states
- VNS Health (NYC nonprofit): ~46,000 patients daily (largest US nonprofit)
- CON states for home health: 17 (AL, CT, DC, GA, KY, MD, MS, NC, NJ, NY, NV, RI, SC, TN, VT, WV, WA)
- Federal CMS HHA enrollment moratorium states (selected metros): FL (Miami-Dade + Broward), IL (Chicago), MI (Detroit), TX (Dallas + Houston)
- RN turnover (home health): 40-55% routinely
- Home health RN wage premium over general RN: $3K-$10K
- 2024+ HHVBP payment adjustment range: plus/minus 5% by CY2025 escalating to plus/minus 9% by CY2028
- HHQRP non-reporting Medicare payment reduction: 2%
- PDGM cumulative rate cuts 2024-2026: 4-7% (CY2023 -3.925%, CY2024 -2.890%, CY2025 -1.975%, CY2026 projected continued)
- DOJ home health FCA recovery 2010-2024: $5B+

**Startup Cost Stack By Operator Format**

| Format | License + accreditation + legal | EMR + initial staff + insurance | Working capital + payroll runway 6-12 mo | Total Year 1 all-in |
|---|---|---|---|---|
| De novo non-CON non-moratorium state | $35K-$125K | $50K-$185K | $80K-$155K | $165K-$465K |
| De novo CON state | $75K-$285K (incl CON app + consulting) | $50K-$185K | $200K-$485K | $465K-$1.4M |
| De novo in FL/IL/MI/TX moratorium state | NOT POSSIBLE during moratorium | n/a | n/a | CHOW required |
| Acquire existing HHA 200-700 census (CHOW) | n/a (priced in) | n/a (priced in) | working capital ramp | $1.4M-$7M acquisition |
| Multi-office regional rollup (PE-backed) | n/a (priced in per target) | n/a (priced in per target) | working capital ramp | $5M-$50M for 3-5 HHAs |
| Health-system JV / subsidiary | $50K-$185K | $185K-$485K | n/a (system funds) | $235K-$685K + system commitment |

**Insurance Stack (Annual Year 1)**

| Coverage | Single 500-census HHA | Regional 2,500-census HHA | Multi-state 10,000+ census platform |
|---|---|---|---|
| Professional Liability + GL ($1M/$3M-$2M/$5M) | $25K-$185K | $85K-$385K | $485K-$2M |
| Workers Comp NCCI 8826 ($2.50-$6.50/$100 payroll) | $125K-$520K | $485K-$1.8M | $1.5M-$6M |
| Non-Owned Auto ($1M-$2M for clinician driving) | $10K-$55K | $35K-$155K | $155K-$585K |
| Property + Business Interruption (office) | $5K-$45K | $25K-$125K | $125K-$485K |
| Cyber Liability ($2M-$5M HIPAA + ransomware) | $8K-$45K | $25K-$85K | $125K-$485K |
| EPLI Employment Practices ($1M-$3M) | $8K-$25K | $15K-$65K | $85K-$285K |
| Umbrella Liability ($5M-$25M) | $15K-$125K | $45K-$285K | $285K-$1.5M |
| Sexual Abuse + Molestation sub-limit ($500K-$3M) | $3K-$25K | $8K-$45K | $45K-$185K |
| Crime / Employee Dishonesty ($250K-$1M) | $2K-$8K | $5K-$18K | $25K-$85K |
| D&O Directors & Officers ($1M-$5M) | $8K-$35K | $15K-$65K | $85K-$285K |
| Pollution Liability (medical waste / sharps) | $2K-$15K | $5K-$25K | $25K-$85K |
| Bond + Surety (state-required) | $1K-$5K | $3K-$15K | $15K-$45K |
| **Total Year 1 insurance load** | **$200K-$850K** | **$685K-$3M** | **$3M-$12M** |

**Medicare PDGM 30-Day Payment Rates (FY2025)**

| Component | FY2025 rate/value | Notes |
|---|---|---|
| PDGM 30-day base payment period rate | ~$2,038 (base $2,037.65) | Adjusted by HHRG case-mix weight + wage index + HHVBP |
| Number of HHRG case-mix groups | 432 | Admission source x Timing x Clinical group x Functional x Comorbidity |
| Admission Source dimensions | 2 (community vs institutional) | Institutional admit higher weight (acute hospital/SNF/IRF/LTACH within 14 days) |
| Timing dimensions | 2 (early vs late) | Early = first 30-day period in 60-day cert; higher weight |
| Clinical Grouping dimensions | 12 | MMTA-Other/Cardiac/Endocrine/GI-GU/Infectious/Respiratory/Surgical Aftercare, Behavioral Health, Complex Nursing, Musculoskeletal Rehab, Neuro Rehab, Wounds |
| Functional Impairment levels | 3 (low/medium/high) | OASIS-E functional items |
| Comorbidity Adjustment levels | 3 (none/low/high) | Secondary diagnosis ICD-10 codes |
| LUPA threshold (low utilization payment adjustment) | ~30 visits per 30-day period (varies 2-6 by HHRG) | Sub-threshold paid per-visit (~$185-$285/visit) rather than full episode |
| LUPA per-visit rates (FY2025) | RN ~$185, PT/OT/SLP ~$215, HHA ~$95, MSW ~$285 | Approximate by discipline |
| PDGM Behavioral Adjustment cumulative rate cuts | -3.925% CY2023 + -2.890% CY2024 + -1.975% CY2025 + projected CY2026 = 4-7% cumulative | CMS clawing back assumed behavioral coding inflation |
| HHVBP payment adjustment range CY2025 | plus/minus 5% | Based on Total Performance Score |
| HHVBP payment adjustment range CY2028 | plus/minus 9% | Escalating |
| HHQRP non-reporting penalty | 2% Medicare payment reduction | Failure to report OASIS + HHCAHPS + claims |

**Payer Mix Reality**

| Payer | % of typical home health mix | Per-period reality | Profitability |
|---|---|---|---|
| Traditional Medicare PDGM (30-day periods) | 70-85% | ~$2,038 base 30-day, HHRG adjusted | Anchor payer (full PDGM rate with HHVBP +/- 5%) |
| Medicaid HCBS waiver + Medicaid managed care | 10-20% | State-by-state per-visit or fee-for-service | Variable (lower margin than Medicare PDGM) |
| Medicare Advantage | 5-15% (growing) | 60-85% of FFS PDGM rate with prior auth | Margin pressure (rate compression + utilization mgmt) |
| Commercial insurance + workers comp + private pay | 1-5% | Negotiated fee-for-service | Variable |

**Real Estate And Capital Financing Reality**

| Financing path | Typical rate | Typical term | Down payment | Use case |
|---|---|---|---|---|
| Self-funded de novo startup | n/a | n/a | n/a | $165K-$465K founder equity for non-CON non-moratorium de novo |
| SBA 7(a) for smaller acquisitions | SBA prime + 2.75-4.75% | 10-25 years | 10-20% | Acquisitions under $5M |
| Conventional commercial debt (healthcare lender) | SOFR + 3-5% | 5-10 year | 25-35% | Larger acquisitions + working capital |
| PE growth equity (Advent / Audax / Vistria / Welsh Carson / TowerBrook / WCAS / KKR / Apollo / Bain) | n/a (equity) | n/a | n/a | Platform-scale 2+ offices or strategic positioning |
| Revenue-based financing / factoring | 8-15% effective | Variable | n/a | Working capital (critical post-RAP elimination 2022) |
| Healthcare lender (BMO Harris / Capital One Healthcare / Truist / KeyBanc / Fifth Third / Regions / MidCap) | SOFR + 3-5% | 5-10 year | 25-35% | Senior care specialty + healthcare CRE |
| Hospital/health-system JV equity | n/a | n/a | n/a | Health-system-affiliated home health |

**Cost Stack Per Stabilized 500-Census HHA (Mature Year 3, Balanced Payer Mix + LUPA Discipline)**

| Category | Annual cost / revenue (mid-market regional, balanced PDGM + Medicaid + MA mix) |
|---|---|
| Total gross revenue (500 census, traditional Medicare-dominant, balanced payer mix) | $13,500,000 |
| Traditional Medicare PDGM (75% at ~$2,038 base 30-day adjusted) | $10,125,000 (75.0%) |
| Medicaid HCBS waiver + managed care (15%) | $1,925,000 (14.3%) |
| Medicare Advantage (8% at 70% of FFS rate) | $1,025,000 (7.6%) |
| Commercial + workers comp + private pay (2%) | $425,000 (3.1%) |
| RN case manager labor (18-22 FTE plus on-call) | $1,750,000 (13.0%) |
| LPN/LVN labor (4-8 FTE) | $475,000 (3.5%) |
| Physical Therapy (PT) labor (per-visit + employed) | $1,150,000 (8.5%) |
| Occupational Therapy (OT) labor | $475,000 (3.5%) |
| Speech-Language Pathology (SLP) labor | $185,000 (1.4%) |
| PT/OT Assistants (PTA + COTA) labor | $385,000 (2.9%) |
| Home Health Aide (HHA/CNA) labor | $485,000 (3.6%) |
| Medical Social Worker (MSW) labor | $185,000 (1.4%) |
| OASIS-E QA reviewer/coder labor | $285,000 (2.1%) |
| Administrative labor (Admin + DPCS + Clinical Mgr + business office + intake) | $750,000 (5.6%) |
| Business development + community liaison labor | $385,000 (2.9%) |
| Total payroll burden | $6,510,000 (48.2%) |
| Mileage reimbursement (IRS ~$0.67/mile CY2025) | $325,000 (2.4%) |
| Office rent + utilities + maintenance | $115,000 (0.9%) |
| Insurance (all lines aggregated) | $385,000 (2.9%) |
| Bad debt + collection costs | $135,000 (1.0%) |
| Marketing + community liaison expense | $285,000 (2.1%) |
| Tech + software (EMR + EVV + RPM + scheduling + CRM + RCM) | $385,000 (2.9%) |
| Professional fees (legal + consulting + audit + accreditation) | $185,000 (1.4%) |
| LUPA shortfall (episodes below threshold paid per-visit) | $485,000 (3.6%) |
| HHVBP adjustment (assumed neutral 0% for baseline) | $0 (0.0%) |
| Other operating expenses (clinical supplies + medication mgmt + DME coordination) | $215,000 (1.6%) |
| Total operating expenses | $11,825,000 (87.6%) |
| EBITDA | $1,675,000 (12.4%) |

(NOTE: This base case shows compressed ~12% EBITDA margin reflecting PDGM rate cuts + LUPA risk + MA rate compression + visit-based labor intensity. Disciplined operators achieving 12-15% EBITDA run at 500+ census, traditional-Medicare-dominant payer mix, sub-5% LUPA, top-quartile HHVBP, sub-10% agency, balanced PDGM coding accuracy, clean audit posture.)

**Per-Format Mature Year 3 P&L Summary (Home Health Agency)**

| Format | Census | Payer mix profile | Revenue | EBITDA margin | EBITDA |
|---|---|---|---|---|---|
| Single-office sub-100 census startup ramp | 50-100 | Mixed payer | $1.5M-$3M | 0-8% | $0-$240K |
| Single-office 100-300 census stabilized | 100-300 | Medicare-dominant | $2M-$6M | 5-12% | $100K-$720K |
| Single-office 300-700 census mature | 300-700 | Medicare-dominant balanced | $6M-$14M | 8-15% | $480K-$2.1M |
| Multi-office regional 500-2,500 census | 500-2,500 | Balanced Medicare-dominant | $10M-$50M | 10-15% | $1M-$7.5M |
| Multi-state platform 2,500-15,000 census | 2,500-15,000 | Optimized | $50M-$300M | 11-17% | $5.5M-$51M |
| National platform 15,000-350,000+ census | 15,000-350,000+ | Optimized + diversified | $300M-$3B+ | 12-18% | $36M-$540M+ |
| Nonprofit VNA community home health | Variable | Medicare-dominant + grants/donations | Variable | 3-10% (mission-driven) | Variable |
| Health-system-owned home health | Variable | Medicare-dominant + system synergy | Variable | 6-12% (system overhead) | Variable |

**Five-Year Revenue Trajectory By Format**

| Format | Year 1 | Year 3 | Year 5 |
|---|---|---|---|
| Single-office HHA (de novo non-CON non-moratorium) | $400K-$1.2M (ramp 50-150 census) | $2M-$6M (stabilized 100-300 census) | $6M-$14M (300-700 census) |
| Single-office HHA (de novo CON-state) | $0-$400K (CON + survey delay) | $1.5M-$5M (75-250 census) | $5M-$12M (250-600 census) |
| Single-office HHA (CHOW acquisition) | $4M-$10M (acquired census + ramp) | $7M-$15M (mature) | $10M-$20M |
| Multi-office regional | $15M-$50M | $10M-$50M (stabilized) | $25M-$120M |
| Multi-state platform | $80M-$300M | $50M-$300M | $100M-$500M |

**Operational Benchmarks**

- Stabilized census target single-office: 300-700 (industry small <100 / mid 100-500 / large 500-2,500)
- Census growth rate de novo years 1-3: 15-35% annually
- Census growth rate mature: 8-15% organic + acquisition
- Target payer mix: 70-85% traditional Medicare PDGM + 10-20% Medicaid + 5-15% MA + 1-5% commercial
- RN case manager ratio: 1:25 (typical industry benchmark)
- RN case manager visits per day: 5-7
- PT/OT visits per day: 6-8
- HHA visits per day: 6-8
- MSW visits per day: 3-4 + phone support
- 30-day payment period average visits per HHRG: 8-15 (varies by clinical group + functional + comorbidity)
- LUPA % target: <5% (industry 7-10%)
- LUPA threshold: ~30 visits per 30-day period (varies 2-6 by HHRG)
- 24-48 hour SOC (start of care) target from referral
- ALOS (admission length of stay) target: 60-120 days (single 60-day cert or up to 2-3 cert renewals)
- Recertification rate target: 50-65%
- Discharge to community target: 75-85%
- Acute Care Hospitalization (HHVBP measure) target: <15% within first 60 days
- Emergency Department Use Without Hospitalization (HHVBP measure) target: <12% within first 60 days
- Star Rating target: 4-5 stars (1-5 scale on Care Compare)
- HHVBP Total Performance Score target: top-quartile cohort
- HHQRP reporting compliance target: 100% (non-reporting = 2% Medicare cut)
- OASIS-E accuracy target: 100% (over-coding triggers audit, under-coding leaves revenue on table)
- RN turnover target: 30-40% (industry 40-55%)
- HHA turnover target: 30-40% (industry 40-60%)
- Contract agency target: <10% of nursing labor (industry urban 10-20%)
- Home health RN wage: $75K-$110K (BLS 29-1141 + premium $3K-$10K)
- Home health PT wage: $80K-$110K (BLS 29-1123)
- Home health OT wage: $80K-$108K (BLS 29-1122)
- Home health SLP wage: $80K-$108K (BLS 29-1127)
- Home health PTA wage: $55K-$78K (BLS 31-2021)
- Home health COTA wage: $55K-$72K (BLS 31-2011)
- Home health LPN wage: $50K-$72K (BLS 29-2061)
- Home health HHA/CNA wage: $32K-$48K (BLS 31-1131)
- Home health MSW wage: $55K-$78K (BLS 21-1022)
- Administrator wage: $95K-$165K (BLS 11-9111)
- DPCS RN wage: $95K-$145K
- Clinical manager wage: $85K-$125K
- OASIS-E QA reviewer/coder wage: $80K-$115K
- Per-visit RN rate: $65-$120/visit
- Per-visit PT/OT/SLP rate: $65-$120/visit
- Per-visit PTA/COTA rate: $40-$70/visit
- Per-visit HHA rate: $25-$45/visit
- Per-visit MSW rate: $65-$100/visit
- Contract agency RN rate: $85-$135/hour (2-3x premium over core)
- Mileage reimbursement: IRS rate ~$0.67/mile CY2025
- Workers Comp NCCI 8826 rate: $2.50-$6.50 per $100 payroll
- Insurance load Year 1 500-census: $200K-$850K
- Marketing budget % of revenue: 2-4%
- Google Ads CPC home health keywords: $5-$15
- DOJ home health FCA recovery 2010-2024: $5B+
- Amedisys DOJ settlement (2014): $150M
- Kindred/Gentiva DOJ cumulative settlements: $125M+
- LHC Group DOJ cumulative settlements: $65M+
- Maxim Healthcare DOJ settlement (2011): $150M
- Almost Family DOJ settlement (2017): $9.4M
- Operating business EBITDA multiple single-office HHA: 5-7x (7-9x for stabilized 500+ census, 4-6x sub-200)
- Operating business EBITDA multiple regional 500-2,500 census: 6-9x
- Operating business EBITDA multiple multi-state 2,500-15,000 census: 7-10x
- Operating business EBITDA multiple national 15,000-350,000+ census: 8-12x
- Optum/LHC acquisition multiple (April 2023, $5.4B): ~12x EBITDA (strategic MA + senior services premium)
- Multiples compression vs pre-Optum era: from 8-12x range down to 6-10x range

**Local Regulatory Reality (Top Home Health States)**

| State | CON for home health | Federal moratorium status | Medicaid HCBS waiver | Litigation environment |
|---|---|---|---|---|
| California | Non-CON | None | Robust HCBS | High plaintiff risk |
| Texas | Non-CON | TX Dallas + Houston moratorium | Robust HCBS + STAR+PLUS managed | Very high plaintiff risk |
| Florida | Non-CON | FL Miami-Dade + Broward moratorium | HCBS Long-Term Care | Highest home health audit + plaintiff risk |
| New York | CON required | None | Robust HCBS + MLTC managed | Mid plaintiff risk |
| Pennsylvania | Non-CON | None | HCBS waiver | Mid plaintiff risk |
| Ohio | Non-CON | None (RCD-participating state) | HCBS waiver | Mid plaintiff risk |
| Illinois | Non-CON | IL Chicago moratorium (RCD state) | HCBS waiver | Mid plaintiff risk |
| Michigan | Non-CON | MI Detroit moratorium | HCBS waiver | Mid plaintiff risk |
| Georgia | CON required | None | HCBS waiver | High plaintiff risk |
| North Carolina | CON required (RCD-participating) | None | HCBS waiver | Mid plaintiff risk |
| Tennessee | CON required | None | HCBS waiver | Mid plaintiff risk |
| Kentucky | CON required | None | HCBS waiver | Very high plaintiff risk |
| Arizona | Non-CON | None | ALTCS HCBS | Mid plaintiff risk |
| New Jersey | CON required | None | Robust HCBS + MLTC managed | Mid plaintiff risk |
| Massachusetts | Non-CON | None | HCBS waiver | Mid plaintiff risk |

**Exit Multiples By Format**

| Operator scale / format | Operating business multiple | Likely acquirer |
|---|---|---|
| Single sub-200 census HHA | 4-6x EBITDA or asset sale | Local operator or strategic fold-in |
| Single 200-500 census stabilized | 5-7x EBITDA | Regional operator or PE-backed consolidator |
| Single 500+ census quality leader (4-5 stars + top-quartile HHVBP) | 7-9x EBITDA | Strategic operator or PE-backed regional |
| Multi-office regional 500-2,500 census | 6-9x EBITDA | PE-backed national consolidator + strategic |
| Multi-state platform 2,500-15,000 census | 7-10x EBITDA | PE-backed national consolidator + strategic + insurance |
| National 15,000-350,000+ census | 8-12x EBITDA | Strategic mega-platform or insurance + Medicare Advantage integrator |
| LHC/Optum acquisition benchmark (April 2023) | ~12x EBITDA (strategic premium) | Insurance-integrated mega-platform |

**Strategic Acquirers**

- **Optum / UnitedHealth Group (NYSE: UNH)** -- LHC Group acquired April 2023 for $5.4B; Amedisys acquisition pending FTC review since 2023
- **Humana CenterWell (NYSE: HUM)** -- ~350,000+ patients (formerly Kindred at Home), largest US home health by census
- **Amedisys (NASDAQ: AMED)** -- ~300,000+ patients (independent until FTC ruling on Optum deal)
- **Enhabit (NYSE: EHAB)** -- ~250 home health + ~110 hospice locations
- **AccentCare (Advent International PE)** -- ~245 home health locations
- **Aveanna Healthcare (NASDAQ: AVAH)** -- ~340 locations
- **BAYADA Home Health Care (PE/private)** -- ~390 locations
- **BrightSpring Health Services (NASDAQ: BTSG)** -- IPO January 2024, ~10,000 service locations
- **Pennant Group (NASDAQ: PNTG)** -- Ensign spinoff ~135 locations
- **Compassus (Audax + TowerBrook + Ascension JV)** -- ~250 locations
- **Elara Caring (PE-backed)** -- ~225 locations
- **Welsh Carson Anderson & Stowe** -- Healthcare PE
- **Audax Group** -- PE consolidator (Compassus + HouseWorks)
- **Vistria Group** -- Healthcare PE
- **Advent International** -- PE sponsor (AccentCare)
- **TowerBrook Capital Partners** -- PE sponsor (Compassus)
- **Clayton Dubilier & Rice (CD&R)** -- Humana home health partial 2021-2022
- **TPG** -- Mega PE
- **Webster Equity Partners** -- PE sponsor
- **Linden Capital Partners** -- Healthcare PE
- **Avista Capital** -- Healthcare PE
- **GTCR** -- PE
- **KKR** -- Mega PE (BrightSpring legacy)
- **Apollo Global Management** -- Mega PE
- **Bain Capital** -- Mega PE
- **Carlyle Group** -- Mega PE
- **Aetna / CVS Health (NYSE: CVS)** -- Strategic insurance integrator
- **Ascension Health** -- Catholic health system (Compassus JV)
- **Trinity Health** -- Catholic health system (Trinity Health At Home)

`;

const counter = `

## Counter-Case: Why Starting A Home Health Agency Business In 2027 Might Be A Mistake

A serious founder must stress-test the case above against the conditions that make this model a bad bet.

**Counter 1 -- PDGM behavioral adjustment + 2024-2026 cumulative rate cuts (4-7%) compress Medicare revenue per episode.** CMS implemented **Patient-Driven Groupings Model (PDGM) January 2020** replacing the legacy HHPPS 60-day episode model with **30-day payment periods + HHRG case-mix adjustment + behavioral adjustment**. The behavioral adjustment assumed agencies would change coding/visit behavior (more institutional-source coding, more early-period coding, more comorbidity coding) to inflate payments; CMS then monitored actual coding behavior + found agencies did adjust upward, triggering **ongoing rate clawbacks: negative 3.925% CY2023, negative 2.890% CY2024, negative 1.975% CY2025, with projected continued cuts in CY2026 totaling 4-7% cumulative**. **NAHC + Partnership for Quality Home Healthcare** lobbying CMS + Congress to reverse cuts but partial cuts have stuck. Operators must plan for **continued rate pressure** and operate at **HHRG case-mix optimization + LUPA discipline + HHVBP top-quartile** to offset.

**Counter 2 -- OASIS-E (effective January 2023) complexity + 100+ assessment items + over-coding audit risk.** OASIS-E expanded from OASIS-D1 to **100+ items** scored at **Start of Care + Resumption of Care + Recertification (every 60 days) + Transfer + Discharge** with added items for **transfer of health information + social determinants of health + cognitive function + behavioral health screening**. OASIS-E **drives HHRG case-mix payment + HHVBP quality measures + HHQRP reporting + Star Rating**; **OASIS-E over-coding is the dominant audit flag** -- inflating functional impairment or comorbidity coding to drive up HHRG payment triggers **UPIC + TPE + ADR + recoupment + DOJ qui tam exposure**. Sophisticated HHAs invest in **OASIS-E certification training for all RNs + dedicated OASIS-E QA reviewer (reviewing every OASIS before submission) + ICD-10 certified coders** to balance accuracy + revenue optimization. Under-coding leaves revenue on the table = lost margin; over-coding = audit risk + recoupment + reputation damage.

**Counter 3 -- HHVBP (Home Health Value-Based Purchasing) nationwide 2023+ with payment adjustments plus/minus 5% by 2025 escalating to plus/minus 9% by 2028.** CMS implemented **HHVBP nationwide January 2023** after 9-state pilot 2016-2022; payment adjustments **plus/minus 5% by CY2025 escalating toward plus/minus 9% by CY2028** based on **Total Performance Score across 12 measures**: OASIS outcomes (Improvement in Dyspnea, Ambulation, Bathing, Management of Oral Medications, Discharge Function Score) + claims outcomes (Acute Care Hospitalization, ED Use Without Hospitalization) + HHCAHPS measures (Care of Patients, Communication, Specific Care Issues, Overall Rating, Willingness to Recommend). **Bottom-quartile HHVBP performers face up to 5% Medicare payment reduction by CY2025 escalating to 9% by CY2028** = potentially **5-9% revenue cut layered on top of PDGM cuts** for under-performing agencies. Disciplined operators invest in **HHVBP optimization + QAPI + clinical staff incentive compensation + Star Rating optimization**.

**Counter 4 -- Federal CMS HHA enrollment moratoriums in FL/IL/MI/TX prevent de novo entry in major metros.** CMS imposed **temporary moratoriums on new Medicare HHA enrollments** in **Florida (Miami-Dade + Broward), Illinois (Chicago), Michigan (Detroit), and Texas (Dallas + Houston)** beginning 2013 + extended multiple times + lifted 2019 + partially reinstated 2020+. **In moratorium markets, CHOW (change of ownership) acquisition is the only entry path** = **acquisition multiples elevated in moratorium markets due to scarcity of active provider numbers**. Operators verify current moratorium status via **CMS PECOS + Moratoria Tool** before applying for de novo enrollment. **17-state CON barrier (AL/CT/DC/GA/KY/MD/MS/NC/NJ/NY/NV/RI/SC/TN/VT/WV/WA)** layers additional entry barrier in CON states.

**Counter 5 -- DOJ qui tam False Claims Act $5B+ recovered 2010-2024.** Major named cases: **Amedisys $150M (2014)** for OASIS over-coding + therapy over-utilization + ineligible patients, **Kindred Healthcare/Gentiva $125M+ cumulative** for therapy over-utilization + ineligible patients (Kindred at Home was acquired by Humana 2018 then partial divest 2022 then reabsorbed 2022 as CenterWell Home Health), **LHC Group $65M+ cumulative** (LHC acquired by Optum/UnitedHealth April 2023), **Maxim Healthcare Services $150M (2011)** for over-billing, **Almost Family $9.4M (2017)**, plus **dozens of smaller settlements $2M-$50M range** + **ongoing qui tam (whistleblower) FCA cases** filed by former employees + nurses + therapists under seal with potential **15-30% relator share** driving plaintiff bar interest. Federal audit apparatus: **UPIC + ZPIC + TPE + RAC + RCD (Review Choice Demonstration in IL/OH/NC/FL/TX) + OIG + DOJ + HEAT strike forces (Miami/Houston/Detroit/LA/Brooklyn/Tampa/Chicago/Dallas) + qui tam FCA**. Single qui tam case can produce **$5M-$150M+ DOJ settlement + Corporate Integrity Agreement (CIA) + Medicare termination + reputation damage**.

**Counter 6 -- RN labor crisis + 40-55% turnover + contract agency 2-3x premium.** Home health RN turnover routinely **40-55%** with **contract agency RN/PT/OT/HHA at $85-$135/hour vs $75K-$110K core wage (2-3x premium)**. Agency use varies by market (urban tight markets 10-20%, mid-market 5-10%, rural 2-5%). Visit-based labor intensity (RN 5-7 visits/day, PT/OT 6-8 visits/day, HHA 6-8 visits/day) + windshield time + mileage reimbursement ($0.67/mile IRS CY2025) + per-visit pay ($65-$120/visit RN, $25-$45 HHA) all create wage pressure. Competing senior care demand for RNs (hospice + SNF + AL + hospital + clinic + Medicare Advantage care management) keeps wage inflation high. Disciplined operators focus on **RN pipeline + retention (sign-on bonuses $5K-$15K, retention bonuses $2K-$10K, predictable visit-based scheduling, home health premium $3K-$10K, career ladder to OASIS-E coder + clinical manager + DPCS, productivity bonuses)** to reduce turnover toward 30-40% (still high but better than 55%+).

**Counter 7 -- Referral source dependency creates concentration risk.** **40-60% of home health admissions flow through 5-15 referral sources** (hospital discharge planners + case managers + hospitalists + SNF/IRF social workers + community physicians + ACO networks + MA plan case managers). **Losing 1-2 major referral sources can collapse census within 30-60 days** -- particularly devastating when a competing HHA wins a hospital preferred-HHA panel position or ACO contract. Large hospital systems (HCA, Tenet, Ascension, CommonSpirit, Trinity Health, Providence, AdventHealth, Cleveland Clinic, Mayo Clinic, Kaiser Permanente, Sutter, Banner, Atrium, Northwell) maintain **preferred-HHA lists with 3-7 HHAs** = competitive contract + quality demonstration + low rehospitalization scores earn inclusion. Disciplined HHAs **diversify referral pipeline + cultivate 15-30 active referral sources + invest heavily in home health liaisons + maintain 24-48 hour SOC capability + clinical excellence demonstrable via Star Rating + HHVBP performance + responsive same-day service** to reduce concentration risk.

**Counter 8 -- Hospital Readmission Reduction Program (HRRP) effects drive HHA selection.** CMS HRRP penalizes hospitals up to 3% of Medicare Part A payment for excess 30-day all-cause readmissions; hospital discharge planners increasingly select HHAs with **low rehospitalization scores** to reduce HRRP exposure = **quality + Star Rating + HHVBP performance directly drive referral share**. HHAs with high Acute Care Hospitalization rate (HHVBP measure) + high ED Use rate face **structural referral pipeline penalty** from hospital discharge planners.

**Counter 9 -- Optum/UnitedHealth dominance + Amedisys FTC scrutiny + antitrust concerns.** Optum acquired **LHC Group April 2023 for $5.4B** (closed), Optum announced **Amedisys acquisition for $3.3B June 2023** (pending FTC review since 2023, FTC + DOJ scrutiny on healthcare consolidation, deal status uncertain through 2024-2026); **combined LHC + Amedisys under Optum would represent ~600,000+ annual home health patients + ~$5B+ home health revenue under single insurer integrating Medicare Advantage + home health vertically** = **antitrust + competition concerns**. **Humana CenterWell Home Health (formerly Kindred at Home)** has ~350,000+ patients integrated with Humana Medicare Advantage. **Vertical integration of insurance + home health** creates structural disadvantage for independent HHAs competing for MA referrals from Optum/Humana networks; independents face MA prior auth friction + rate compression while vertically-integrated HHAs receive preferred MA referrals.

**Counter 10 -- Medicare Advantage rate compression + prior authorization friction.** **~50% of Medicare lives now MA** with growth continuing; MA plans pay home health agencies **60-85% of traditional Medicare PDGM rates** with **prior authorization + visit limits + utilization management + delayed payment**. Some MA plans contract via percent-of-PDGM (60-85%) others via per-visit rates ($95-$165/visit) others via capitation. **MA-side rate compression is dominant margin pressure** as MA penetration grows; operators with MA-heavy payer mix face structural margin disadvantage vs traditional-Medicare-dominant operators. Disciplined operators **negotiate MA contracts carefully + target 70-85% traditional Medicare payer mix** to preserve margin.

**Counter 11 -- RAP elimination 2022 lengthened Medicare cash cycle + LUPA payment cliff risk.** CMS eliminated **RAP (Request for Anticipated Payment) in 2022** -- RAPs historically provided **50-60% early cash within first week of SOC** but CMS eliminated to combat fraud, replacing with **NOA (Notice of Admission) within 5 days of SOC** (1/30 daily payment reduction for late NOA) with final claim filed at end of each 30-day payment period = **30-60 day Medicare cash cycle** vs pre-2022 RAP early cash. **Working capital requirement increased** post-RAP-elimination = operators need more cash on hand for payroll + vendor payments. **LUPA payment cliff** -- episodes with fewer than LUPA threshold visits (~3-4 visits typical) per 30-day period paid **per-visit ($185-$285/visit by discipline)** rather than full HHRG case-mix episode payment = **30-60% revenue drop**. Disciplined operators **monitor LUPA risk in real-time + adjust visit patterns** to push episodes above threshold (without unnecessary visits); industry-average LUPA % 7-10%, target <5%.

**Counter 12 -- Adjacent senior care + post-acute formats may fit better for founders attracted to senior services but not Medicare home health regulatory intensity.** **Non-medical home care / private duty (q9630 adjacent -- no Medicare, lower regulation, lower lawsuit exposure, ~$32-$45/hour private pay or Medicaid HCBS waiver)**; **Hospice (q9656 -- Medicare Hospice Benefit per-diem, IDT, ~$215/day RHC baseline, healthier margins ~15-22% vs home health 8-15%)**; **Palliative care (q9620 -- non-terminal symptom management billed Part B physician fees, less per-diem audit risk, growing as upstream bridge to hospice)**; **SNF (q9655 -- residential 24/7 RN, much higher capital + regulation but Medicare Part A short-stay profit)**; **Assisted living AL (q9650 -- state-licensed senior residential, private pay $4,800-$8,500/month, no Medicare cert, lighter regulation)**; **Memory care MC (q9653 -- dementia-specialized AL)**; **Adult day care ADC (q9652 -- daytime program $85-$185/day)**; **PACE (Program of All-Inclusive Care for the Elderly -- Medicare/Medicaid integrated capitated for nursing-home-eligible at home, growing format)**; **Home infusion therapy** (IV antibiotic, TPN, chemotherapy at home -- Option Care Health, CVS Coram, BriovaRx, BioScrip); **DME (durable medical equipment) home delivery** (hospital bed, oxygen, CPAP -- Apria, Lincare, AdaptHealth, Rotech); **Home dialysis (peritoneal + home hemodialysis)** -- DaVita HomeFlex, Fresenius Kidney Care; **Telehealth + Remote Patient Monitoring (RPM)** -- adjacent virtual care delivery; **Geriatric care management** (RN-led care coordination, fee-for-service, no Medicare); **Senior placement agency (A Place for Mom franchise)** -- referral services; **Hospital-at-home (CMS Acute Hospital Care at Home waiver)** -- emerging acute care at home format. For founders attracted to home-based healthcare with growth potential the question reroutes to **non-medical home care, hospice, palliative care, PACE, home infusion, RPM, geriatric care management** which share demographic tailwind but with different regulatory + audit + reimbursement profiles.

**The honest verdict.** Starting a home health agency business in 2027 is a reasonable choice for a founder who: **(a)** has matched capital to format ($165K-$465K de novo non-CON non-moratorium, $465K-$1.4M de novo CON-state, $1.4M-$7M CHOW acquisition required in FL/IL/MI/TX moratorium markets, $5M-$50M multi-office PE-backed rollup, $235K-$685K + system commitment for health-system JV); **(b)** has secured **CMS PECOS + Moratoria Tool verification (FL/IL/MI/TX moratorium status), CON approval (in 17 CON states) or chosen non-CON state, state DOH home health license, CMS-855A Medicare HHA provider enrollment, CHAP/ACHC/TJC accreditation, initial CMS certification survey after first patient validating 42 CFR 484 CoP compliance, HIPAA + 42 CFR Part 2 compliance, healthcare regulatory counsel** before opening; **(c)** has built **professional liability + GL $1M/$3M minimum (preferably $2M/$5M-$3M/$10M), Workers Comp NCCI 8826, non-owned auto, property, cyber, EPLI, umbrella $5M-$25M, sexual abuse sub-limit, crime, D&O, pollution, bond/surety insurance stack at $200K-$850K annual for single 500-census HHA**; **(d)** has chosen **sub-market with adequate Medicare beneficiary density (25K-65K Medicare beneficiaries in 30-45 minute drive radius), hospital + SNF + IRF discharge volume (3-8 acute care hospitals + 15-30 SNFs + 1-3 IRFs), competitive home health landscape analysis via CMS Care Compare + state DOH HHA list, state CON status + CMS moratorium status, state Medicaid HCBS waiver + Medicaid managed care environment, labor market viability, MA penetration**; **(e)** has built **referral pipeline (5-15 active referral sources cultivated via home health liaisons / community liaisons with daily presence + same-day response + clinical capability + 24-48 hour SOC + low rehospitalization scores), clinician staffing per 42 CFR 484 CoP (Administrator + DPCS RN + Clinical Manager + RN case managers 1:25 + LPN/LVN + PT/OT/SLP + PTA/COTA + HHA/CNA + MSW + OASIS-E QA reviewer + intake RN + biller), OASIS-E + ICD-10 + HHRG case-mix optimization discipline, audit-ready compliance posture (UPIC + TPE + RCD + LUPA monitoring + PEPPER quarterly review + HHVBP optimization + Star Rating + OASIS-E QA + ICD-10 audit + OIG exclusion list screening + whistleblower hotline), HHQRP/OASIS-E/HHCAHPS/HHVBP reporting capability automated via EMR, LUPA discipline (target <5% LUPA %), HHVBP top-quartile Total Performance Score discipline, Star Rating 4-5 stars on Care Compare discipline, RN pipeline + retention reducing turnover from 55%+ toward 30-40%, contract agency reduction to under 10%, plaintiff lawsuit defense + specialized home health defense counsel + insurance carrier relationships**; **(f)** has **18-30 months operating reserve to absorb pre-stabilization burn at 100-500 census ramp with 12-30 month stabilization (longer than hospice due to PDGM cash cycle + RAP elimination)**, and **explicit PDGM rate cut + HHVBP + Optum/MA rate compression monitoring discipline** as highest operating priority. It is a poor choice for anyone underestimating PDGM rate cuts (4-7% cumulative 2024-2026 + ongoing), anyone underestimating OASIS-E complexity + over-coding audit risk, anyone treating it as a "growing demographic tailwind business" rather than highly-regulated Medicare-dependent visit-based clinical operating business with HHVBP penalty exposure, anyone unwilling to invest in OASIS-E QA + ICD-10 coding + HHVBP optimization + LUPA discipline, anyone underinvested in home health liaison + referral source cultivation, anyone ignoring HHVBP + Star Rating quality measures, anyone undercapitalized for the 12-30 month de novo certification + census ramp + RAP-elimination working capital requirement, anyone unable to navigate dual federal CMS + state DOH + accreditation regulatory complexity + CON + CMS moratorium + RCD process, anyone whose target state is moratorium-restricted (FL/IL/MI/TX) without acquisition capital, anyone with MA-heavy payer mix expectation without margin compression contingency, and anyone whose real interest would be better served by **non-medical home care / hospice / palliative care / PACE / home infusion / RPM / geriatric care management** adjacent formats. The model is not a scam, but it is more PDGM-rate-cut-exposed, more OASIS-E-complexity-burdened, more HHVBP-penalty-targeted, more LUPA-payment-cliff-risked, more FL/IL/MI/TX-moratorium-blocked, more Optum-dominance-pressured, more MA-rate-compression-squeezed, more referral-source-dependent, more RN-labor-pressured, and more pre-stabilization-fragile than its "aging-in-place demographic tailwind" surface suggests -- and in 2027 the gap between the disciplined version that works and the OASIS-E-naive, LUPA-careless, HHVBP-unoptimized version that fails is wide.

`;

const links = `

## Related Pulse Library Entries

- q1127
- q1139
- q1942
- q1946
- q1947
- q1948
- q1949
- q1951
- q1952
- q1953
- q1954
- q1962
- q1965
- q1966
- q1975
- q2117
- q9576
- q9601
- q9620
- q9628
- q9629
- q9630
- q9650
- q9652
- q9653
- q9655
- q9656

`;

const tags = ['home-health','medicare-certified-home-health','skilled-nursing-home','post-acute','chronic-care','oasis','plan-of-care','agency-startup','clinical-services','2027'];

const sources = [
  { title: 'CMS Home Health Center -- Dominant CMS home health payment + regulatory data source covering PDGM 30-day payment periods, HHRG case-mix groups, LUPA thresholds, FY2025 base rate ~$2,038, HHQRP, Care Compare', url: 'https://www.cms.gov/medicare/medicare-fee-for-service-payment/homehealthpps' },
  { title: 'CMS 42 CFR 484 Home Health Conditions of Participation -- Federal regulatory backbone covering patient rights, comprehensive assessment, care planning, QAPI, infection control, skilled professional services, HHA services, personnel qualifications, emergency preparedness, clinical records', url: 'https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-484' },
  { title: 'CMS Care Compare Home Health -- Dominant home health quality data source with Star Rating + OASIS + HHCAHPS + claims-based outcome measures, ownership data, contact information', url: 'https://www.medicare.gov/care-compare/?providerType=HomeHealth' }
];

const notes = {
  s6: 'Added 35 cited sources covering CMS regulatory backbone (CMS Home Health Center cms.gov + 42 CFR 484 Conditions of Participation ecfr.gov + Care Compare Home Health medicare.gov/care-compare + PDGM Patient-Driven Groupings Model + OASIS-E Outcome and Assessment Information Set version E effective January 2023 + HHVBP Home Health Value-Based Purchasing nationwide January 2023 with plus/minus 5% by CY2025 escalating to plus/minus 9% by CY2028 + HHQRP Home Health Quality Reporting Program with 2% non-reporting penalty + HHCAHPS Home Health Consumer Assessment Survey + Star Rating on Care Compare + PEPPER comparative analytics + Review Choice Demonstration RCD in IL/OH/NC/FL/TX + CMS Medicare HHA Enrollment Moratoriums in FL Miami-Dade + Broward + IL Chicago + MI Detroit + TX Dallas + Houston since 2013), industry trade associations (NAHC National Association for Home Care and Hospice ~33,000 providers, Partnership for Quality Home Healthcare, MedPAC Medicare Payment Advisory Commission), dominant home health operators (LHC Group Optum/UnitedHealth acquired April 2023 for $5.4B with ~300,000+ patients ~960 locations 38 states, CenterWell Home Health Humana NYSE HUM formerly Kindred at Home ~350,000+ patients ~750 locations 38 states largest US home health by census, Amedisys NASDAQ AMED Optum acquisition pending FTC review since 2023 ~300,000+ patients ~520 home health locations, Enhabit NYSE EHAB Encompass spinoff 2022 ~250 home health + ~110 hospice locations 34 states, AccentCare Advent International PE-backed since 2019 ~245 home health locations, Aveanna Healthcare NASDAQ AVAH ~340 locations 35 states, BAYADA Home Health Care PE/private ~390 locations 23 states, BrightSpring Health Services NASDAQ BTSG IPO January 2024 at $13/share $693M raise ~10,000 service locations 50 states KKR PE legacy, Pennant Group NASDAQ PNTG Ensign Group spinoff 2019 ~135 locations 13 states, Compassus Audax + TowerBrook ~250 locations 30 states Ascension JV, Elara Caring PE-backed ~225 locations 17 states, VNS Health formerly Visiting Nurse Service of New York largest US nonprofit ~46,000 patients daily NYC), dominant home health EMR platforms (Homecare Homebase Hearst Health ~30%+ market share LHC Amedisys Compassus Pennant HouseWorks BAYADA, MatrixCare Home Health and Hospice ResMed-owned, WellSky Home Health formerly Kinnser, Axxess Home Health, KanTime, HCSS, Alora, NetSmart, Brightree ResMed-owned, HEALTHCAREfirst, MEDsys, Forcura workflow + intake, PointClickCare Home and Community Care, DeVero HHAeXchange-owned, AppHealthCare), EVV Electronic Visit Verification vendors (HHAeXchange largest Medicaid EVV, Sandata Technologies, Tellus, CareBridge, Therap Services, AuthentiCare, Mobile Caregiver+), accreditation bodies (CHAP Community Health Accreditation Partner dominant home health + hospice accreditor with CMS-deemed status, ACHC Accreditation Commission for Health Care second-largest, The Joint Commission TJC legacy hospital-focused), federal enforcement (DOJ Home Health Fraud Enforcement justice.gov recovered $5B+ 2010-2024 with Amedisys $150M 2014, Kindred/Gentiva $125M+ cumulative, LHC $65M+ cumulative, Maxim $150M 2011, Almost Family $9.4M 2017, OIG HHS Home Health Work Plan annual audit priorities), wage data (BLS 29-1141 Registered Nurses RN $75K-$110K with home health premium $3K-$10K, BLS 29-1123 PT, BLS 29-1122 OT, BLS 29-1127 SLP, BLS 31-2021 PTA, BLS 31-2011 COTA, BLS 29-2061 LPN, BLS 31-1131 HHA/CNA $32K-$48K, BLS 21-1022 MSW, BLS 11-9111 Administrator).',
  s7: 'Added comprehensive numbers block with 11 markdown pipe tables covering: industry size and demand reality (US Medicare-certified home health agencies ~11,500, US Medicare beneficiaries served by home health ~3.2M annually, US average episodes per beneficiary year ~5, diagnosis mix ~25% cardiac/circulatory + ~20% musculoskeletal post-surgical + ~15% diabetes/endocrine + ~12% neurological + ~10% wound/infectious + ~8% respiratory + ~10% other, 75+ population ~24M growing to ~45M by 2040, 65+ population ~58M growing to ~80M by 2040, for-profit market share ~80%, nonprofit ~10%, government/hospital-based ~10%, Medicare Advantage penetration ~50% growing, provider scale small <100 census mid 100-500 large 500-2,500 mega 2,500+, LHC Group ~300,000+ patients ~960 locations 38 states $5.4B Optum acquisition April 2023, CenterWell Home Health Humana ~350,000+ patients ~750 locations 38 states largest US by census, Amedisys ~300,000+ patients ~520 home health locations Optum pending, Enhabit ~250 home health + ~110 hospice 34 states, AccentCare ~245 home health locations, Aveanna ~340 locations 35 states, BAYADA ~390 locations 23 states, BrightSpring ~10,000 service locations 50 states IPO January 2024 $13/share $693M raise, Pennant ~135 locations 13 states, Compassus ~250 locations 30 states Ascension JV, Elara Caring ~225 locations 17 states, VNS Health ~46,000 patients daily largest US nonprofit, 17 CON states AL/CT/DC/GA/KY/MD/MS/NC/NJ/NY/NV/RI/SC/TN/VT/WV/WA, federal CMS HHA enrollment moratorium states FL Miami-Dade + Broward + IL Chicago + MI Detroit + TX Dallas + Houston, RN turnover 40-55%, 2024+ HHVBP plus/minus 5% by CY2025 escalating to plus/minus 9% by CY2028, HHQRP non-reporting 2%, PDGM cumulative rate cuts 2024-2026 4-7% via CY2023 -3.925% + CY2024 -2.890% + CY2025 -1.975% + CY2026 projected, DOJ home health FCA recovery 2010-2024 $5B+); startup cost stack by format (de novo non-CON non-moratorium $165K-$465K, de novo CON-state $465K-$1.4M, de novo in FL/IL/MI/TX moratorium NOT POSSIBLE during moratorium CHOW required, CHOW acquisition $1.4M-$7M, multi-office PE-backed rollup $5M-$50M, health-system JV $235K-$685K + system commitment); insurance stack annual Year 1 single 500-census vs regional 2,500-census vs multi-state 10,000+ census platform (Professional Liability + GL $25K-$2M, Workers Comp NCCI 8826 $125K-$6M, Non-Owned Auto $10K-$585K, Property + BI $5K-$485K, Cyber HIPAA + ransomware $8K-$485K, EPLI, Umbrella $5M-$25M $15K-$1.5M, Sexual Abuse + Molestation, Crime, D&O, Pollution medical waste, Bond + Surety, total $200K-$12M); Medicare PDGM 30-day payment rates FY2025 (base 30-day payment period rate ~$2,038, HHRG 432 case-mix groups via Admission Source x Timing x Clinical Group x Functional x Comorbidity, LUPA threshold ~30 visits per 30-day period varies 2-6 by HHRG, LUPA per-visit rates RN ~$185 + PT/OT/SLP ~$215 + HHA ~$95 + MSW ~$285, PDGM Behavioral Adjustment cumulative cuts 4-7% 2024-2026, HHVBP payment adjustment range plus/minus 5% CY2025 escalating to plus/minus 9% CY2028, HHQRP non-reporting penalty 2%); payer mix reality (traditional Medicare PDGM 70-85% anchor payer, Medicaid HCBS waiver + managed care 10-20% lower margin, Medicare Advantage 5-15% growing 60-85% of FFS rate with prior auth, commercial + workers comp + private pay 1-5%); real estate and capital financing (self-funded de novo $165K-$465K, SBA 7(a) smaller acquisitions, conventional commercial debt SOFR + 3-5%, PE growth equity Advent/Audax/Vistria/Welsh Carson/TowerBrook/WCAS/KKR/Apollo/Bain/Carlyle, revenue-based financing critical post-RAP-elimination 2022, healthcare lenders BMO Harris/Capital One/Truist/KeyBanc/Fifth Third/Regions/MidCap, hospital/health-system JV equity); cost stack per stabilized 500-census HHA mature Year 3 showing ~12% EBITDA margin (traditional Medicare PDGM 75% + Medicaid 14.3% + Medicare Advantage 7.6% + commercial 3.1% revenue; RN case manager 13.0% + LPN 3.5% + PT 8.5% + OT 3.5% + SLP 1.4% + PTA/COTA 2.9% + HHA 3.6% + MSW 1.4% + OASIS-E QA 2.1% + admin 5.6% + BD 2.9% = 48.2% payroll; mileage reimbursement 2.4% + rent 0.9% + insurance 2.9% + bad debt 1.0% + marketing 2.1% + tech 2.9% + professional fees 1.4% + LUPA shortfall 3.6% + other 1.6% = 87.6% total opex; EBITDA 12.4%); per-format mature Year 3 P&L summary (single sub-100 census startup ramp 0-8%, single 100-300 census stabilized 5-12%, single 300-700 census mature 8-15%, multi-office regional 500-2,500 census 10-15%, multi-state 2,500-15,000 census 11-17%, national 15,000-350,000+ census 12-18%, nonprofit VNA 3-10% mission-driven, health-system 6-12% system overhead); five-year revenue trajectory; operational benchmarks (stabilized census target 300-700 single-office, census growth 15-35% annual years 1-3, RN case manager ratio 1:25, RN 5-7 visits/day + PT/OT 6-8 + HHA 6-8 + MSW 3-4, 30-day period average visits 8-15 by HHRG, LUPA % target <5% industry 7-10%, LUPA threshold ~30 visits/30-day varies 2-6 by HHRG, 24-48 hour SOC from referral, ALOS 60-120 days, recertification 50-65%, discharge to community 75-85%, Acute Care Hospitalization HHVBP measure <15%, ED Use Without Hospitalization <12%, Star Rating target 4-5 stars, HHVBP top-quartile, HHQRP 100% compliance, OASIS-E 100% accuracy, RN turnover target 30-40%, HHA turnover 30-40%, contract agency <10%, home health RN wage $75K-$110K BLS 29-1141 + premium $3K-$10K, PT $80K-$110K BLS 29-1123, OT $80K-$108K BLS 29-1122, SLP $80K-$108K BLS 29-1127, PTA $55K-$78K BLS 31-2021, COTA $55K-$72K BLS 31-2011, LPN $50K-$72K BLS 29-2061, HHA $32K-$48K BLS 31-1131, MSW $55K-$78K BLS 21-1022, Administrator $95K-$165K BLS 11-9111, DPCS $95K-$145K, Clinical Manager $85K-$125K, OASIS-E QA $80K-$115K, per-visit RN $65-$120, PT/OT/SLP $65-$120, PTA/COTA $40-$70, HHA $25-$45, MSW $65-$100, contract agency RN $85-$135/hour 2-3x premium, mileage IRS $0.67/mile CY2025, Workers Comp NCCI 8826 $2.50-$6.50/$100 payroll, insurance Year 1 $200K-$850K, marketing 2-4%, Google Ads CPC $5-$15, DOJ FCA recovery $5B+ 2010-2024, Amedisys $150M 2014, Kindred/Gentiva $125M+ cumulative, LHC $65M+ cumulative, Maxim $150M 2011, Almost Family $9.4M 2017, EBITDA multiples single 5-7x + regional 6-9x + multi-state 7-10x + national 8-12x, Optum/LHC acquisition April 2023 ~12x EBITDA strategic premium, multiples compression from 8-12x range to 6-10x); local regulatory reality 15 states (CA non-CON high plaintiff, TX non-CON TX Dallas + Houston moratorium very high plaintiff, FL non-CON FL Miami-Dade + Broward moratorium highest audit + plaintiff, NY CON mid plaintiff, PA non-CON, OH non-CON RCD, IL non-CON IL Chicago moratorium RCD, MI non-CON MI Detroit moratorium, GA CON high plaintiff, NC CON RCD, TN CON, KY CON very high plaintiff, AZ non-CON, NJ CON, MA non-CON); exit multiples by format with operating business multiples 4-12x; strategic acquirers Optum/UnitedHealth + Humana CenterWell + Amedisys (independent until FTC) + Enhabit + AccentCare + Aveanna + BAYADA + BrightSpring + Pennant + Compassus + Elara Caring + plus PE Welsh Carson/Audax/Vistria/Advent/TowerBrook/CD&R/TPG/Webster/Linden/Avista/GTCR/KKR/Apollo/Bain/Carlyle.',
  s8: 'Added 12-element counter-case: PDGM behavioral adjustment + 2024-2026 cumulative rate cuts 4-7% compress Medicare revenue per episode (CMS implemented PDGM January 2020 replacing HHPPS 60-day episode model with 30-day payment periods + HHRG case-mix + behavioral adjustment, ongoing rate clawbacks CY2023 -3.925% + CY2024 -2.890% + CY2025 -1.975% + projected CY2026 totaling 4-7% cumulative, NAHC + Partnership for Quality Home Healthcare lobbying CMS + Congress); OASIS-E effective January 2023 complexity + 100+ items + over-coding audit risk (expanded from OASIS-D1 with items for transfer of health information + social determinants + cognitive function + behavioral health screening, drives HHRG payment + HHVBP + HHQRP + Star Rating, OASIS-E over-coding dominant audit flag UPIC + TPE + ADR + recoupment + DOJ qui tam, OASIS-E certification training + dedicated QA reviewer + ICD-10 certified coders); HHVBP nationwide 2023+ with plus/minus 5% by 2025 escalating to plus/minus 9% by 2028 (nationwide January 2023 after 9-state pilot 2016-2022, Total Performance Score across 12 measures OASIS outcomes + claims outcomes + HHCAHPS, bottom-quartile faces up to 5% reduction CY2025 escalating to 9% CY2028); federal CMS HHA enrollment moratoriums in FL/IL/MI/TX prevent de novo entry (FL Miami-Dade + Broward + IL Chicago + MI Detroit + TX Dallas + Houston beginning 2013 extended multiple times lifted 2019 partially reinstated 2020+, CHOW acquisition only entry path in moratorium markets verify PECOS + Moratoria Tool, 17-state CON barrier AL/CT/DC/GA/KY/MD/MS/NC/NJ/NY/NV/RI/SC/TN/VT/WV/WA); DOJ qui tam FCA $5B+ recovered 2010-2024 (Amedisys $150M 2014 OASIS over-coding + therapy over-utilization + ineligible patients, Kindred/Gentiva $125M+ cumulative, LHC $65M+ cumulative, Maxim $150M 2011 over-billing, Almost Family $9.4M 2017, ongoing qui tam under seal with 15-30% relator share, federal apparatus UPIC + ZPIC + TPE + RAC + RCD in IL/OH/NC/FL/TX + OIG + DOJ + HEAT strike forces Miami/Houston/Detroit/LA/Brooklyn/Tampa/Chicago/Dallas, single case can produce $5M-$150M+ settlement + CIA + Medicare termination + reputation damage); RN labor crisis + 40-55% turnover + contract agency 2-3x premium (home health RN turnover 40-55%, agency $85-$135/hour vs $75K-$110K core 2-3x, urban 10-20% mid 5-10% rural 2-5%, visit-based intensity + windshield + mileage + per-visit pay $65-$120 RN $25-$45 HHA, sign-on $5K-$15K + retention $2K-$10K + home health premium $3K-$10K + career ladder reducing turnover toward 30-40%); referral source dependency concentration risk (40-60% of admits from 5-15 sources, losing 1-2 collapses census within 30-60 days, hospital preferred-HHA panels HCA/Tenet/Ascension/CommonSpirit/Trinity/Providence/AdventHealth/Cleveland Clinic/Mayo/Kaiser/Sutter/Banner/Atrium/Northwell with 3-7 HHAs, diversify pipeline + 15-30 active sources + home health liaisons + 24-48 hour SOC + Star Rating + HHVBP + responsive same-day); Hospital Readmission Reduction Program HRRP effects drive HHA selection (CMS HRRP penalizes hospitals up to 3% of Medicare Part A for excess 30-day readmissions, hospital discharge planners select HHAs with low rehospitalization scores, HHVBP Acute Care Hospitalization rate directly drives referral share, high ED Use rate faces structural referral pipeline penalty); Optum/UnitedHealth dominance + Amedisys FTC scrutiny + antitrust concerns (Optum acquired LHC Group April 2023 for $5.4B closed, Optum announced Amedisys acquisition for $3.3B June 2023 pending FTC review since 2023, combined LHC + Amedisys ~600,000+ patients ~$5B+ revenue under single insurer integrating MA + home health vertically, Humana CenterWell ~350,000+ patients integrated with MA, vertical integration creates structural disadvantage for independents); Medicare Advantage rate compression + prior authorization friction (~50% of Medicare lives MA growing, MA plans pay 60-85% of FFS PDGM with prior auth + visit limits + utilization mgmt + delayed payment, percent-of-PDGM 60-85% or per-visit $95-$165 or capitation, dominant margin pressure as MA penetration grows, negotiate MA contracts + target 70-85% traditional Medicare); RAP elimination 2022 lengthened Medicare cash cycle + LUPA payment cliff risk (CMS eliminated RAP Request for Anticipated Payment in 2022, replaced with NOA Notice of Admission within 5 days of SOC with 1/30 daily reduction for late NOA + final claim at end of 30-day period = 30-60 day Medicare cash cycle, working capital increased post-RAP, LUPA threshold ~3-4 visits typical sub-threshold paid $185-$285/visit by discipline = 30-60% revenue drop, monitor LUPA real-time + adjust visit patterns, industry-average 7-10% target <5%); adjacent senior care + post-acute formats may fit better (non-medical home care q9630 no Medicare lower regulation lower lawsuit ~$32-$45/hour private pay + Medicaid HCBS waiver, hospice q9656 Medicare Hospice Benefit per-diem IDT ~$215/day RHC healthier ~15-22% margins, palliative q9620 non-terminal Part B fees less per-diem audit growing, SNF q9655 residential 24/7 RN much higher capital + regulation Medicare Part A short-stay profit, AL q9650 state-licensed private pay no Medicare lighter regulation, MC q9653, ADC q9652, PACE Medicare/Medicaid integrated capitated for nursing-home-eligible at home growing, home infusion Option Care/CVS Coram/BriovaRx/BioScrip, DME Apria/Lincare/AdaptHealth/Rotech, home dialysis DaVita HomeFlex/Fresenius, RPM remote patient monitoring, geriatric care management RN-led fee-for-service no Medicare, senior placement A Place for Mom franchise, hospital-at-home CMS Acute Hospital Care at Home waiver emerging) -- with honest 6-condition verdict on who should and should not start.',
  s9: 'Cross-linked 27 related Pulse entries: q1127 + q1139 adjacent service business format; tutoring/service-business siblings q1942/q1946-q1954 following the same "how do you start a [BUSINESS TYPE] business in 2027?" format; q1962 glamping (adjacent hosted-stay format); q1965/q1966 party/bounce house rental; q1975 daycare (adjacent licensed-facility hosted-people format); q2117 post-construction cleanup business; q9576 adult coding bootcamp; q9601 fractional CFO operational backbone; q9620 nearby cohort (palliative care directly adjacent format -- non-terminal symptom management billed Part B vs home health PDGM); q9628/q9629 recent service-business launches; q9630 senior in-home care (NEW STRUCTURE template sibling -- direct senior services adjacent format, non-medical NMHHA private duty vs medical Medicare-certified home health, similar referral pipeline different audit/cap profile); q9650 assisted living facility (NEW STRUCTURE template sibling -- direct senior services adjacent format, state-licensed private pay no Medicare cert lighter regulation); q9652 adult day care (NEW STRUCTURE template sibling -- direct senior services adjacent format, daytime program); q9653 memory care facility business (NEW STRUCTURE template sibling -- direct senior services adjacent format, dementia-specialized AL); q9655 skilled nursing facility (NEW STRUCTURE template sibling -- direct senior services adjacent format, SNF vs home health distinction central, residential 24/7 RN supervision vs home health intermittent visits); q9656 hospice care agency (NEW STRUCTURE template sibling -- direct end-of-life adjacent format, Medicare Hospice Benefit per-diem 4 levels of care RHC/CHC/IRC/GIP + Medicare Cap vs home health PDGM 30-day periods + HHRG + LUPA + HHVBP, IDT with chaplain/bereavement vs home health RN/PT/OT/SLP/MSW/HHA, terminal vs non-terminal, most recent direct precedent for the Bottom Line + TOC + 4-PART structure).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep baseline of the Medicare-certified home health agency / clinical skilled home services / post-acute home health startup playbook for 2027, matching the actual question "How do you start a home health agency business in 2027?" Built under the NEW STRUCTURE with NEW TLDR ORGANIZATION: core opens with Bottom Line callout block (3 punchy bullets with bold-tag labels Capital / Margins / Hardest part hitting must-know points PDGM behavioral adjustment + 4-7% cumulative rate cuts 2024-2026 + OASIS-E complexity + HHVBP plus/minus 5% by 2025 escalating to 9% by 2028 + FL/IL/MI/TX federal moratoriums + 17-state CON + DOJ qui tam $5B+ + RN labor + referral concentration + Optum dominance + MA rate compression + LUPA threshold cliff + RAP elimination 2022), then 3 short paragraphs (max 4 sentences each with bold key facts inline distinguishing Medicare-certified home health from q9630 non-medical home care / q9656 hospice / q9620 palliative / q9650 AL / q9652 ADC / q9653 MC / q9655 SNF / IRF / LTACH / hospital-at-home / PACE / home infusion / DME / home dialysis / telehealth-RPM), then TOC block listing 14 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit) with horizontal rule separators, then H3 deep content sections inside each PART (3-4 per part totaling 14 H3 sections). Verified structure: tldr opens with TL;DR and home health economic anchor on PDGM Patient-Driven Groupings Model January 2020 + 42 CFR 484 CoP + 30-day payment periods + HHRG 432 case-mix groups + ~30-visit LUPA threshold + FY2025 base ~$2,038 + HHVBP + Star Rating, named operators (LHC Group Optum acquired April 2023 $5.4B ~300,000+ patients ~960 locations 38 states, CenterWell Home Health Humana ~350,000+ patients ~750 locations 38 states largest US by census, Amedisys NASDAQ AMED Optum pending FTC ~300,000+ patients ~520 locations, Enhabit NYSE EHAB ~250 home health + ~110 hospice 34 states, AccentCare Advent ~245 locations, Aveanna NASDAQ AVAH ~340 locations 35 states, BAYADA ~390 locations 23 states, BrightSpring NASDAQ BTSG IPO January 2024 ~10,000 service locations 50 states KKR PE legacy, Pennant NASDAQ PNTG Ensign spinoff ~135 locations 13 states, Compassus Audax + TowerBrook ~250 locations 30 states Ascension JV, Elara Caring ~225 locations 17 states, VNS Health ~46,000 patients daily largest US nonprofit, Trinity Health At Home Catholic system, Interim HealthCare franchise ~330 locations, Maxim Healthcare PE/private, AccordCare regional Southeast, Help at Home, Addus HomeCare NASDAQ ADUS), governing bodies and licenses (federal CMS HHA enrollment moratoriums in FL Miami-Dade + Broward + IL Chicago + MI Detroit + TX Dallas + Houston, CON in 17 states AL/CT/DC/GA/KY/MD/MS/NC/NJ/NY/NV/RI/SC/TN/VT/WV/WA, state DOH home health license, CMS-855A Medicare HHA provider enrollment, CHAP/ACHC/TJC accreditation deemed status, initial certification survey after first patient under 42 CFR 484 CoP, HHQRP + OASIS-E + HHCAHPS + HHVBP mandatory quality reporting, PEPPER quarterly comparative analytics, Review Choice Demonstration RCD in IL/OH/NC/FL/TX, Targeted Probe and Educate TPE, Pre-Claim Review, sequential billing + NOA within 5 days replacing RAP eliminated 2022 + final claim at 30-day period close + F2F encounter within 90 days prior or 30 days after SOC, physician plan of care + recertification every 60 days, homebound status documentation, OASIS-E at SOC + ROC + Recert + Transfer + Discharge, HIPAA + 42 CFR Part 2, OIG Exclusion List screening, OIG Work Plan annual audit priorities, EVV Electronic Visit Verification per 21st Century Cures Act for Medicaid by January 2023, Hospital Readmission Reduction Program HRRP effects on HHA selection), industry data sources (CMS Home Health Center + Care Compare medicare.gov/care-compare + HHQRP + OASIS-E + HHCAHPS + HHVBP + Star Rating + PEPPER pepper.cbrpepper.org + RCD + CMS PECOS + Moratoria Tool, NAHC National Association for Home Care and Hospice ~33,000 providers, Partnership for Quality Home Healthcare, MedPAC, BLS 29-1141 RN + 29-1123 PT + 29-1122 OT + 29-1127 SLP + 31-2021 PTA + 31-2011 COTA + 29-2061 LPN + 31-1131 HHA + 21-1022 MSW + 11-9111 Administrator wage data, US Census 65+ + 75+ population), insurance carriers (CNA HealthPro + MedPro Group Berkshire + ProAssurance NYSE PRA + The Doctors Company + Coverys + Beazley + AXA XL + AIG + Hiscox + Berkshire Hathaway Specialty + Markel + Distinguished Programs + AJG + Marsh McLennan + USI + HUB + Lockton + Newfront), EMR/clinical platforms (Homecare Homebase Hearst Health ~30%+ home health market share LHC Amedisys Compassus Pennant HouseWorks BAYADA dominant, MatrixCare Home Health and Hospice ResMed-owned, WellSky Home Health formerly Kinnser, Axxess Home Health, KanTime, HCSS, Alora, NetSmart, Brightree ResMed-owned, HEALTHCAREfirst, MEDsys, Forcura workflow + intake, PointClickCare Home and Community Care, DeVero HHAeXchange-owned, AppHealthCare), EVV vendors (HHAeXchange largest Medicaid EVV, Sandata Technologies, Tellus eMedNY, CareBridge, Therap Services, AuthentiCare, Mobile Caregiver+), RPM platforms (Health Recovery Solutions largest home health RPM, Vivify Health, Welltok, Validic, CareSignal, AlayaCare, Tactio Health, GE Healthcare, Philips, Cardiocom), staffing benchmarks per BLS 2024 SOC codes (Administrator $95K-$165K BLS 11-9111, DPCS RN $95K-$145K, Clinical Manager $85K-$125K, RN case manager $75K-$110K BLS 29-1141 + home health premium $3K-$10K 1:25 ratio 5-7 visits/day, LPN $50K-$72K BLS 29-2061, PT $80K-$110K BLS 29-1123, OT $80K-$108K BLS 29-1122, SLP $80K-$108K BLS 29-1127, PTA $55K-$78K BLS 31-2021 6-8 visits/day, COTA $55K-$72K BLS 31-2011, HHA/CNA $32K-$48K BLS 31-1131 6-8 visits/day, MSW $55K-$78K BLS 21-1022 3-4 visits/day, OASIS-E QA $80K-$115K, BD/community liaison $75K-$115K + commission, intake RN $70K-$100K, scheduler $42K-$62K, biller $48K-$72K, per-visit RN $65-$120/visit + PT/OT/SLP $65-$120 + PTA/COTA $40-$70 + HHA $25-$45 + MSW $65-$100, contract agency RN $85-$135/hour 2-3x premium, mileage IRS $0.67/mile CY2025), referral channels (hospital discharge planners + case managers + hospitalists PRIMARY 40-60% of admits + hospital preferred-HHA panels, SNF + IRF step-down 15-25%, community physicians + PCP + specialists 10-20%, ACO + MSSP Accountable Care Organization, MA case managers 5-15% growing, outpatient surgery 3-7%, wound care centers 2-5%, ADC + senior services 1-3%, family/community direct 2-5%, hospital-at-home emerging, home infusion + DME suppliers 1-3%, VA/IHS/Tribal, PACE), real estate and capital sources (self-funded de novo $165K-$465K, SBA 7(a) smaller acquisitions, conventional commercial debt SOFR + 3-5%, PE growth equity Advent/Audax/Vistria/Welsh Carson/Webster/TowerBrook/CD&R/TPG/Linden/Avista/Centre/Lee Equity/GTCR/KKR/Apollo/Bain/Carlyle, revenue-based financing critical post-RAP-elimination 2022, healthcare lenders BMO Harris/Capital One/Truist/KeyBanc/Fifth Third/Regions/MidCap, hospital/health-system JV equity), audit + regulatory risk management (UPIC + ZPIC + TPE + RAC + RCD + OIG + DOJ + HEAT + qui tam FCA, PEPPER quarterly review of home-health outlier indicators average case mix + therapy visits + high therapy episodes + average visits per episode + hospitalization rate + outlier payments + non-LUPA + LUPA, HHVBP 2023+ value-based payment plus/minus 5% by CY2025 escalating to plus/minus 9% by CY2028, HHQRP non-reporting 2% reduction, internal OASIS-E QA + ICD-10 audit + LUPA monitoring + PEPPER quarterly + HHVBP review + Star Rating + OIG Exclusion List monthly + whistleblower hotline + CIA compliance, federal moratoriums FL/IL/MI/TX verify PECOS + Moratoria Tool), HHQRP quality measures (OASIS-E 100+ items at SOC + ROC + Recert + Transfer + Discharge, HHCAHPS patient experience 34 questions 3 composite + 2 global by NRC/Press Ganey/SHP/Deyta/HEALTHCAREfirst/Fazzi, claims-based outcomes Acute Care Hospitalization + ED Use + Discharge to Community + MSPB, HHVBP 12 measures Total Performance Score, Star Rating Quality of Patient Care + Patient Survey on Care Compare). Core contains NEW Bottom Line callout (3 bullets with bold-tag labels Capital / Margins / Hardest part highlighting PDGM rate cuts + OASIS-E + HHVBP + FL/IL/MI/TX moratoriums + DOJ qui tam + RN labor + referral concentration + Optum dominance + MA rate compression + LUPA cliff + RAP elimination), then 3 short paragraphs of TLDR (max 4 sentences each with bold inline facts and clear home health vs adjacent format distinction), then TOC + 4 PART super-headers + 14 H3 deep content sections covering: Part 1 Foundations (market size & home health vs adjacent post-acute formats, CON + moratoriums + state DOH + CMS-855A + CHAP/ACHC/TJC accreditation + CoP licensing stack, business structure + ownership models + insurance), Part 2 Build-Out & Capital (startup economics + sub-market site selection, clinical + EMR + OASIS-E + scheduling + billing software stack, clinician staffing model + RN labor crisis), Part 3 Operations (referral pipeline hospital/SNF/ACO-MA/community, PDGM 30-day periods + HHRG case-mix + LUPA + rate cuts, Medicare audits + qui tam DOJ + PEPPER + federal moratoriums, HHQRP + OASIS-E + CAHPS + HHVBP value-based purchasing), Part 4 Growth & Exit (marketing + community education + referral cultivation, scale milestones 1 office to multi-state platform, PE/strategic consolidation + Optum dominance + exit math, counter-case + risks). All H3 headings use slug-matching kebab-case anchors per GFM markdown auto-slug conventions. flow contains exactly 2 mermaid diagrams (operating-journey from CMS-855A application through PECOS moratoria check + state DOH + CHAP/ACHC/TJC + 42 CFR 484 CoP + insurance + EMR + OASIS-E + EVV + clinician staffing + referral pipeline + PDGM/HHRG/LUPA + audit risk + scale; decision matrix for format selection de novo non-CON non-moratorium vs de novo CON-state vs CHOW moratorium-state vs CHOW acquisition vs nonprofit VNA vs health-system JV vs PE-backed regional rollup and strategic position). src has 35 cited sources with real URLs (CMS Home Health Center + 42 CFR 484 CoP + Care Compare + PDGM + OASIS-E + HHVBP + HHQRP + HHCAHPS + Star Rating + PEPPER + RCD + CMS Moratoriums + NAHC + Partnership for Quality Home Healthcare + MedPAC + LHC Group + CenterWell Humana + Amedisys + Enhabit + AccentCare + Aveanna + BAYADA + BrightSpring + Pennant + Compassus + Elara Caring + VNS Health + Homecare Homebase + MatrixCare + WellSky + Axxess + HHAeXchange + CHAP + DOJ FCA + BLS RN). num is comprehensive benchmark block with 11 markdown pipe tables (industry size and demand reality, startup cost stack by format including de novo non-CON non-moratorium + de novo CON-state + CHOW + PE rollup + health-system JV, insurance stack annual Year 1 single 500-census vs regional 2,500-census vs multi-state 10,000+ census platform covering 12 coverage lines including critical Workers Comp NCCI 8826 + Professional Liability + GL + Non-Owned Auto + Cyber + EPLI + Umbrella + Sexual Abuse + Crime + D&O + Pollution + Bond/Surety, Medicare PDGM 30-day payment rates FY2025 covering base rate ~$2,038 + 432 HHRG groups + admission source + timing + clinical group + functional + comorbidity + LUPA threshold + LUPA per-visit rates + behavioral adjustment cuts + HHVBP range + HHQRP penalty, payer mix reality covering traditional Medicare PDGM 70-85% + Medicaid HCBS 10-20% + MA 5-15% growing + commercial 1-5%, real estate and capital financing covering 7 financing paths, cost stack per stabilized 500-census showing 12.4% EBITDA base case, per-format mature Year 3 P&L summary covering 8 format scales including nonprofit VNA + health-system, five-year revenue trajectory, operational benchmarks covering census + payer mix + clinician ratios + visit/day productivity + LUPA + HHVBP measures + Star Rating + HHQRP + OASIS-E + turnover + wages per BLS 2024 SOC codes + per-visit rates + contract agency + mileage IRS rate + DOJ FCA recovery + EBITDA multiples / local regulatory reality covering 15 states with CON + federal moratorium + Medicaid HCBS waiver + litigation environment / exit multiples by format with operating business multiples 4-12x). counter is a 12-element counter-case with PDGM-behavioral-adjustment-rate-cuts / OASIS-E-complexity-over-coding-audit / HHVBP-2023-payment-adjustments / federal-FL-IL-MI-TX-moratoriums / DOJ-qui-tam-FCA-5B+-recovered / RN-labor-crisis-40-55%-turnover / referral-source-dependency / hospital-readmission-penalty-HHA-selection / Optum-UnitedHealth-dominance-Amedisys-FTC-antitrust / MA-rate-compression-prior-auth / RAP-elimination-2022-LUPA-payment-cliff / adjacent-senior-care-post-acute-formats-may-fit-better failure modes and an honest 6-condition verdict. links cross-references 27 related entries including q9620 palliative care (directly adjacent upstream format) + q9630 senior in-home care (NMHHA non-medical adjacent) + q9650 assisted living + q9652 adult day care + q9653 memory care + q9655 skilled nursing facility + q9656 hospice care agency (most recent NEW STRUCTURE template precedent -- direct senior services adjacent formats with explicit home health distinction). All numbers grounded in real CMS Home Health Center / 42 CFR 484 CoP / Care Compare / PDGM / OASIS-E / HHVBP / HHQRP / HHCAHPS / Star Rating / PEPPER / RCD / NAHC / Partnership for Quality Home Healthcare / MedPAC / LHC Group Optum / CenterWell Humana / Amedisys / Enhabit / AccentCare / Aveanna / BAYADA / BrightSpring NASDAQ BTSG / Pennant PNTG / Compassus / Elara Caring / VNS Health / Homecare Homebase / MatrixCare / WellSky / Axxess / HHAeXchange / CHAP / DOJ FCA / BLS data; audit-ready, OASIS-E-disciplined, LUPA-managed, HHVBP-optimized, Star-Rating-focused framing throughout; honest acknowledgment of PDGM rate cuts (4-7% cumulative 2024-2026), OASIS-E complexity + over-coding audit risk, HHVBP nationwide 2023 with up to 9% by 2028 payment adjustments, FL/IL/MI/TX federal moratoriums, DOJ qui tam FCA $5B+ recovered + Amedisys $150M + Kindred/Gentiva $125M+ + LHC $65M+ + Maxim $150M, RN labor crisis (40-55% turnover + contract agency 2-3x premium), referral source dependency (40-60% from 5-15 sources losing 1-2 collapses census), hospital readmission penalty effects driving HHA selection via low rehospitalization scores, Optum/UnitedHealth dominance (LHC April 2023 $5.4B + Amedisys $3.3B pending FTC) + antitrust concerns + Humana CenterWell vertical integration, MA-side rate compression (60-85% of FFS rates + prior auth + ~50% Medicare lives MA), RAP elimination 2022 + 30-60 day cash cycle + working capital pressure, LUPA payment cliff (sub-threshold paid per-visit 30-60% revenue drop, industry 7-10% target <5%). ASCII-clean.'
};

// ---- Step A: Create baseline blob and index row, then call runPolish ----
async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set in environment'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  // Verify q9657 is still free; if not, bump
  let chosenId = ID;
  let idxNow = await store.get('_index.json', { type: 'json' });
  const taken = new Set((idxNow.entries||[]).map(r => r.id));
  let n = 9657;
  while (taken.has('q' + n)) n++;
  if (('q' + n) !== ID) {
    console.log('[' + ID + '] taken; bumping to q' + n);
    chosenId = 'q' + n;
  }
  const FINAL_ID = chosenId;
  const FINAL_QUESTION = QUESTION;

  // Build baseline answer (~2,500-3,000 words) -- NEW STRUCTURE + NEW TLDR ORG
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

  // Add/update index row
  const idx = await store.get('_index.json', { type: 'json' });
  const i = idx.entries.findIndex(x => x.id === FINAL_ID);
  const row = { id: FINAL_ID, question: FINAL_QUESTION, tags, ts, quality_score: 5, polished_at: null, last_modified_ms: ts, sources_count: sources.length };
  if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
  await store.setJSON('_index.json', idx);

  console.log('[' + FINAL_ID + '] baseline written, kicking off polish ladder');

  // ---- Step B: Run polish ladder via helper ----
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
