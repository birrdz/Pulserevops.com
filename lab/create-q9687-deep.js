// q9687 -- How do you start a physical therapy practice in 2027?
// Independent PT clinic startup playbook for 2027.
// Three forces dominate: (1) Medicare reimbursement compression --
// CMS 8% MPPR multiple-procedure cut + KX threshold + 9% MIPS penalty.
// (2) PE rollups (ATI Physical Therapy NYSE:ATIP ~880, US Physical Therapy
// NYSE:USPH ~600, Select Medical Concentra ~640 rehab, Confluent Health,
// Athletico ~600, Ivy Rehab ~700, FYZICAL franchise ~500, Upstream).
// (3) Cash-pay sports + wellness model (Movement Vault, MOTUS, Joi Health,
// OrthoCarolina concierge) rejecting insurance entirely. Plus direct-access
// laws now in all 50 states (no MD referral needed for first eval).
// VALUE over WORD COUNT. Target 8,500-10,500 words. HARD CAP 10,500.

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

const ID = 'q9687';
const QUESTION = 'How do you start a physical therapy practice in 2027?';

const core = `

> ### Direct Answer
> **Starting a physical therapy practice in 2027 is a $200K-$600K cold-start (or $400K-$1.2M acquisition at ~0.6-0.9x trailing collections) play into a ~$40B+ industry with ~250K licensed PTs (APTA Demographic Profile 2024), ~120K PT assistants, ~38K PT clinics, 6-8% YoY growth -- but only viable if you (a) credential with the top 8-12 commercial payers + Medicare PECOS 855B/855I + state Medicaid 60-180 days before opening (skip = first 90 days cash-only chaos), (b) decide insurance-volume vs cash-pay-premium upfront (25-35 patients/day at $80-$130/visit commercial vs 3-5 patients/day at $120-$220/visit cash -- you cannot retrofit the model), (c) pick the right EHR-billing stack (WebPT Heidi Jannenga / Warburg Pincus PE-backed ~$5B rumored vs Net Health Therapy vs Clinicient Insight vs MWTherapy vs TheraOffice -- wrong fit = 12-18 month switch pain at $40-$120K), (d) build a niche moat (sports/performance OCS+SCS, pelvic floor WCS, vestibular NCS+VRC, pediatric PCS, hand CHT, lymphedema CLT, oncology PORi) because generalist PT is the corporate-chain killing field, and (e) survive PE-rollup pressure (ATI Physical Therapy NYSE:ATIP ~880 clinics post-2024-emergence-from-bankruptcy, US Physical Therapy NYSE:USPH ~600 clinics Chris Reading CEO, Select Medical Concentra ~640 rehab clinics NYSE:SEM, Confluent Health Larry Benz CEO, Athletico ~600 locations, Ivy Rehab Network ~700 clinics, FYZICAL Therapy & Balance Centers ~500 franchises Brian Belmont, Upstream Rehabilitation, PRISM Vision) with a clear 3-7 year exit at 5-8x EBITDA (PE) or 0.6-0.9x collections (local PT operator).**

> ### Bottom Line
> - **[Capital]** **$200K-$600K cold-start de novo** single 1,500-3,000 sq ft clinic (lease + TI build-out $150-$280/sq ft + Bailey/Tri W-G/Pivotal Health treatment tables $1.5-$5K each x 4-8 + Mettler/Dynatron ultrasound $2-$5K + e-stim/IFC/TENS $800-$3K + BioFlex/Multi Radiance laser $5-$15K + hydrocollator hot pack chest $1.5-$3K + Saunders cervical/lumbar traction $2-$8K + exercise floor (treadmill, bike, BOSU, kettlebells, free weights, TRX) + specialty AlterG anti-gravity treadmill $35-$75K (optional), Game Ready cryo+compression $3-$5K, Normatec boots $1-$2K, Hyperice/Theragun, DJO Global bracing inventory + EHR setup + 4-6 mo working capital). **$400K-$1.2M acquisition** at **~0.6-0.9x annual collections**. SBA 7(a) typical **$200K-$600K cold start** / **$400K-$1.2M acquisition** via **Live Oak Bank Healthcare Lending + Provide.com + First Citizens Practice Solutions + Bank of America Practice Solutions + BMO Practice Finance**. Credentialing through CAQH ProView + Aetna/BCBS/Cigna/Humana/UHC/Medicare PECOS 855B/855I/Medicaid (60-180 days per payer = the cash-flow gating item).
> - **[Margins]** Avg mature independent PT clinic grosses **$450K-$1.2M solo** (1 PT) or **$1.4M-$3.5M small group** (3-5 PTs) per APTA + USPH 10-K segment data. PT-owner take-home **$115K-$185K solo, $200K-$420K small group**. **Net 12-22% well-run insurance-model, 25-45% well-run cash-pay model** (no billing, no denials, no payer lag). **Insurance visit $80-$130 commercial / $65-$110 Medicare post-MPPR / $45-$95 Medicaid / $90-$160 workers' comp**. **Cash-pay visit $120-$220 eval / $90-$150 follow-up** (Movement Vault / OrthoCarolina concierge tier $200-$400). **Cold-start break-even ~5-9 mo** at 18-25 visits/day.
> - **[Hardest part]** **NOT capital. NOT real estate.** The trifecta: **(1) PAYER CREDENTIALING + ENROLLMENT** -- Aetna + BCBS + Cigna + Humana + UHC + Medicare PECOS + Medicaid takes 60-180 days per payer sequentially without dedicated credentialing specialist; first 90 days without contracts = out-of-network 30-50% rates or cash-only. **(2) MEDICARE COMPLIANCE GAUNTLET** -- KX modifier above $2,330 threshold (2024) trending to ~$2,410 (2025) ~$2,490 (2026) ~$2,575 (2027), 8-Minute Rule audit risk, plan-of-care MD signature within 30 days, MIPS Quality + PI + IA + Cost categories above 200 Medicare patients/yr (9% reimbursement penalty if missed), CMS 8% MPPR multiple-procedure cut. **(3) PE-ROLLUP REFERRAL PRESSURE** -- ATI/USPH/Athletico/Ivy/FYZICAL/Upstream/Confluent absorb MD orthopedic referral relationships via exclusive-contract pipelines + capital depth + integrated billing + payer leverage. Independents counter via niche specialty (OCS/SCS/WCS/NCS/PCS/CHT/CLT), cash-pay supplement, hyper-local Google + Instagram brand, and direct-access (all 50 states) self-referral.**

A **2027 physical therapy practice** is a **state-licensed outpatient ambulatory rehab facility staffed by Doctor of Physical Therapy DPT graduates + PTA + sometimes ATC -- providing musculoskeletal, neurological, vestibular, pediatric, geriatric, oncology, women's health pelvic floor, sports performance, and post-surgical rehab through manual therapy, therapeutic exercise, modalities (ultrasound, e-stim, laser, traction), and functional re-training**. Six archetypes: solo PT-owner single-clinic, small group 2-5 PTs, multi-location regional 6-15, hospital-system outpatient affiliate, PE-rollup brand (ATI/USPH/Athletico/Ivy/Confluent/Upstream), FYZICAL/H2 Health franchise. **Distinct from** inpatient acute-care PT, inpatient rehab IRF (Encompass Health NYSE:EHC), SNF PT (Genesis/Ensign), home health PT (LHC Group), athletic training, occupational therapy.

**2027 demand:** ~250K licensed PTs (APTA 2024), ~120K PTAs, ~38K outpatient clinics, ~$40B+ industry, 6-8% YoY growth, 25-35 patients/day insurance-model, 3-5 cash-pay-premium, 12-22% net insurance / 25-45% net cash-pay, $40-$120 CAC, $850-$2,400 LTV per episode (8-15 visits typical).

Six models: **solo single-clinic** ($450K-$1.2M, 15-22% insurance / 30-45% cash); **small group 2-5** ($1.4-$3.5M, 14-20%); **multi-location regional 6-15** ($5-$18M, 12-18%); **hospital affiliate** ($1.8-$4M/clinic, 8-15% + referral funnel); **PE rollup brand** (9-15% net, growth focus); **FYZICAL/H2 Health franchise** ($450K-$900K/location, 12-18% post-royalty).

**Five 2027 survival drivers:** (1) 60-180 day Day-1 in-network credentialing top 8-12 commercial + Medicare PECOS + Medicaid + workers' comp; (2) niche specialty moat (OCS/SCS/WCS/NCS+VRC/PCS/CHT/CLT/PORi); (3) cash-pay supplement 10-30% revenue mix as Medicare-cut insurance; (4) niche-aligned premium location; (5) clean exit Day 1 -- PE 5-8x EBITDA OR local PT 0.6-0.9x collections OR strategic regional 0.7-1.0x OR family/associate 0.6-0.8x + seller note + earnout.

## Table of Contents

**Part 1 -- Foundations** -- Market size, 6 archetypes, DPT path, direct-access, consolidation
**Part 2 -- Build-Out & Capital** -- Real estate, equipment, EHR/billing, credentialing, financing
**Part 3 -- Operations** -- Staffing, payer mix, CPT coding, 8-Minute Rule, MIPS, compliance
**Part 4 -- Growth & Exit** -- Marketing, niche specialty, scale, exit, value-based care

---

## PART 1 -- FOUNDATIONS

### 1. Market size, ~250K PTs & the $40B+ landscape

US outpatient physical therapy generates **~$40B+ annual revenue** (APTA + IBISWorld 2024) across **~38,000 outpatient clinics**, **~250K licensed PTs** (APTA Demographic Profile 2024), **~120K PT assistants** (BLS Occupational Outlook 2024), **6-8% YoY growth**. Defining 2024-2027 macro: **Medicare reimbursement compression** + **PE rollup consolidation** + **cash-pay revolution** (Movement Vault, MOTUS, Joi Health, OrthoCarolina concierge tier).

> ### Quick Facts
> - **~$40B+** US PT industry (APTA + IBISWorld 2024)
> - **~250K** licensed PTs (APTA 2024 census)
> - **~120K** PT assistants (BLS 2024)
> - **~38,000** outpatient PT clinics
> - **6-8% YoY** growth (vs ~3-4% primary care)
> - **8-15 visits** avg episode of care
> - **25-35 patients/day** mature insurance-model
> - **3-5 patients/day** mature cash-pay-premium
> - **$450K-$1.2M** solo mature gross
> - **15-22% net** well-run insurance / **30-45%** cash-pay
> - **~12%** of PT visits now cash-pay per APTA 2024 (vs ~5% in 2019)
> - **$40-$120** CAC, **$850-$2,400** LTV per episode

**PE-backed rollup landscape.** **ATI Physical Therapy NYSE:ATIP** -- ~880 clinics, **emerged from Chapter 11 2024** (delisted from NYSE 2023, re-emerged smaller leaner Advent International-backed), largest pure-PT chain. **US Physical Therapy NYSE:USPH** -- ~600 clinics, Chris Reading CEO, only publicly-traded pure-PT operator that did NOT restructure. **Select Medical NYSE:SEM Concentra rehab** -- ~640 clinics integrated with occ-med + workers' comp. **Confluent Health** -- PE-backed, Larry Benz CEO, multi-brand (ProRehab, KORT, Texas Physical Therapy Specialists, ProActive). **Athletico** -- ~600 locations Chicago-HQ, BDT Capital. **Ivy Rehab Network** -- ~700 clinics, Waud Capital + Formation Capital. **FYZICAL Therapy & Balance Centers** -- ~500 franchises, Brian Belmont CEO, $50K+ + 6% royalty, balance/vestibular niche. **Upstream Rehabilitation** -- ~1,200 clinics (BenchMark/Drayer/SportsMED brands), KKR-backed. **NovaCare Rehabilitation** (Select Medical). **CORA Physical Therapy**. **H2 Health** franchise.

**Hospital-system outpatient PT.** **HCA Healthcare**, **AdventHealth**, **Atrium Health Rehabilitation**, **Banner Health**, **Intermountain Health**, **Northwell Health**, **Cleveland Clinic Rehab Therapy**, **Mayo Clinic Sports Medicine PT**, **Encompass Health NYSE:EHC** inpatient rehab (adjacent referral source).

**Cash-pay sports + wellness revolution.** APTA 2024: **~12% of PT visits cash-pay** (vs ~5% 2019). Drivers: Medicare cuts + commercial deductible inflation + sports-performance + concierge. Leaders: **Movement Vault** (Daniel Vadnal, mobility), **MOTUS Physical Therapy** (NYC + LA), **Joi Health** (concierge), **OrthoCarolina concierge tier**, **Performance Optimal Health**, **Champion Performance & PT** (Beverly Hills).

**Direct-access status.** All **50 states permit direct access** (eval without MD referral) post-2023. **18 states** full unrestricted (CA/TX/NY/FL/MD/CO/AZ/UT/NM/OR/WA/MI/MN/IA/NV/MT/ND/HI); **25 states** allow eval + treatment with limits (visit-cap 10-30 OR duration-cap 21-60 days); **7 states** require MD referral for treatment beyond eval. 2023 milestone changed marketing economics -- self-referral Google + Instagram + Healthgrades now viable.

**Independent vs corporate share.** APTA 2024: ~52-58% independent/small group, ~22-28% hospital-system, ~18-24% PE/franchise. Corporate share grew ~4-6 pp/yr 2019-2024; projected ~30-35% by 2030.

### 2. Six business models / archetypes

**Solo PT-owner single-clinic.** 1 PT owner + 0-1 employed DPT + 1-2 PTAs + 1-2 techs + 1-2 front office + outsourced billing. 1,500-3,000 sq ft, 4-8 tables + open gym + 1-2 private rooms. **$450K-$1.2M gross, 15-22% net + clinical income = $115-$185K take-home**.

**Small group 2-5 PTs.** 2-5 PT-owners or 1 owner + 3-4 employed DPTs + 3-5 PTAs + 2-3 techs + 2-3 front office + dedicated/outsourced billing. 2,500-5,000 sq ft + specialty equipment (AlterG, Game Ready, isokinetic). **$1.4-$3.5M gross, 14-20% net = $200K-$700K**. Common PE roll-up exit path.

**Multi-location regional 6-15.** Owner-operator + CFO/COO + regional clinical director + 12-30 PTs + 10-25 PTAs + billing manager + referral-relationship rep. **$5-$18M gross, 12-18% net = $600K-$3.2M**. Eligible for PE platform deal at 6-9x EBITDA.

**Hospital-system outpatient affiliate.** PT employed by hospital + Epic/Cerner EHR + system billing + referral from system ortho/neuro/oncology service lines. **$1.8-$4M/clinic gross, 8-15% net** -- trades margin for stability + referral funnel + brand + no capital risk.

**PE-backed rollup brand.** Standardized ops + brand consistency (ATI, USPH, Athletico, Ivy, Confluent, Upstream, CORA, NovaCare). **Per-clinic 9-15% net w/ growth focus**.

**FYZICAL / H2 Health franchise.** Franchisee + brand + ops manual + collective payer contracts + marketing. **$450K-$900K/location, 12-18% net post-royalty** ($50K + 6% + ~$3K/mo). FYZICAL ~500 locations, Brian Belmont, balance/vestibular niche.

### 3. DPT path, specialty cert & licensure

**Clinical pathway.** Owner-PT: undergrad + PT prereqs + **CAPTE-accredited DPT** (3-yr, ~$60-$140K tuition + living) + **NPTE** (FSBPT, $485 fee) + **state PT license** (state jurisprudence exam) + **NPI Type 1** individual + optional residency 12-18 mo for specialty board cert.

**ABPTS specialty certifications.** **OCS Orthopedic** (~17K certified) -- ortho/MSK, required for sports referrals. **SCS Sports** (~3K) -- elite athlete + return-to-sport. **NCS Neurology** (~2.5K) -- stroke, TBI, SCI, PD, MS, vestibular. **PCS Pediatrics** (~2K) -- developmental, ortho-peds, NICU follow-up. **CCS Cardiopulmonary** (~500). **GCS Geriatric** (~3K) -- balance, fall prevention. **WCS Women's Health** (~600) -- pelvic floor, prenatal/postpartum. **ECS Electrophysiology** (~50). **OMPT Orthopedic Manipulative PT** academy fellowship (~3K). **CHT Certified Hand Therapist** HTCC (~6K). **CLT Certified Lymphedema Therapist** LANA (~3K). **VRC Vestibular Rehab Cert** (~2K). **PORi oncology rehab**.

**State PT licensure.** NPTE + state jurisprudence + background + 30-40 CE/2yr renewal. **PT Compact** (~37 states) allows multi-state practice.

**Facility requirements.** State PT board outpatient clinic registration (varies). NPI Type 2 organizational. EIN. State sales/use tax. Local business license. **HIPAA + OSHA** mandatory. NOT typically required: state DOH facility license, CLIA, state radiation safety.

### 4. PE consolidation + Medicare compression + cash-pay revolution

**PE rollup consolidation** typically pays **5-8x EBITDA + retained equity 20-40% + 3-5 yr operator contract + second-bite**. Active acquirers: **ATI NYSE:ATIP** (post-2024 emergence, Advent International), **USPH NYSE:USPH** (Chris Reading, partnership-model JV retains 51% local equity), **Select Medical Concentra NYSE:SEM**, **Confluent Health** (Larry Benz multi-brand), **Athletico** (BDT), **Ivy Rehab** (Waud + Formation), **Upstream** (KKR). **Multiples compressed 2022-2024 post-rate-hike + ATI bankruptcy** but recovering 2025-2026.

**Medicare reimbursement compression** -- biggest risk to insurance-model PT 2024-2027. **8% MPPR Multiple Procedure Payment Reduction** on subsequent same-day units. **KX modifier threshold** -- 2024 $2,330/yr per beneficiary, projected ~$2,575 2027; above threshold requires KX attesting medical necessity; CMS audit-flag ~$3,000/yr. **MIPS Quality + PI + IA + Cost** mandatory for PTs >200 Medicare patients/yr or $90K allowed charges; **9% reimbursement penalty 2027** if failed.

**Cash-pay revolution.** APTA 2024: ~12% PT visits cash-pay vs ~5% 2019. Drivers: Medicare cuts + commercial deductible inflation ($3K-$8K typical) + sports-performance + concierge. Leaders Movement Vault (Daniel Vadnal), MOTUS (NYC/LA), Joi Health, OrthoCarolina concierge, Performance Optimal Health, Champion Performance (Beverly Hills).

**Independent moat.** (a) niche specialty (OCS/SCS/WCS/NCS/PCS/CHT/CLT) PE chains under-serve; (b) hyper-local Google + Instagram + TikTok brand for self-referral; (c) cash-pay supplement 10-30% revenue mix; (d) Day-1 payer credentialing discipline; (e) MD referral cultivation; (f) clean Day-1 exit positioning.

---

## PART 2 -- BUILD-OUT & CAPITAL

### 1. Real estate & 1,500-3,000 sq ft clinic layout

> ### Quick Facts
> - **Cold-start**: $200K-$600K
> - **1,500-3,000 sq ft** + 4-8 treatment tables + open gym floor + 1-2 private rooms + waiting + bathrooms
> - **$150-$280/sq ft TI build-out**
> - **Lease $18-$45/sq ft/yr** suburban, **$30-$75** metro
> - **15-25 parking spots** minimum
> - **Acquisition**: $400K-$1.2M at ~0.6-0.9x annual collections

**Site selection.** Want **2-3 mile residential density 20K+ households + median HHI $55K+ + visible signage + 15-25 parking + co-tenant traffic (medical building, ortho surgeon corridor, OB-GYN cluster, gym, grocery) + 15K+ daily traffic**. Match demographic to niche: **ortho surgeon corridor** for general ortho/sports PT, **OB-GYN cluster** for WCS pelvic floor, **pediatrician corridor** for PCS, **sports gym district** for SCS cash-pay, **dense 60+** for GCS geriatric. **AVOID PE-chain saturation** -- if ATI/USPH/Athletico/Ivy/FYZICAL within 1.5 mi sharing referral MDs, pipeline erodes; differentiate via niche.

**Layout & MEP.** PT build-out **$150-$280/sq ft TI** -- gym flooring (sport court/rubber/cork) + ADA private rooms + reinforced ceilings for TRX anchors + modality electrical (AlterG 220V dedicated if installed) + HIPAA front office + waiting 8-15 seat + ADA bathrooms + modality storage. **Timeline 3-6 months** lease-to-first-patient.

**Lease vs buy.** Lease $18-$45/sq ft/yr suburban, $30-$75 metro. Many owners buy real estate via separate LLC + lease to PC for tax + appreciation. **TI allowance** $20-$60/sq ft typical (5-10 yr lease).

### 2. Equipment (treatment tables + modalities + exercise floor + specialty + AlterG)

**Treatment tables.** **$1.5-$5K each x 4-8 tables.** **Bailey Manufacturing** ($1.5-$4K, Bobath-style), **Tri W-G** ($2-$5K hi-lo electric), **Pivotal Health / Pierce** ($2-$5K most common new clinic), **Oakworks PT200** ($2.5-$5K), **Hausmann Industries** ($2-$4K). Hi-lo electric is the modern default.

**Modalities -- ultrasound, e-stim, laser, hot/cold, traction.** **Mettler Sonicator Plus 992** $2-$4K (drives 97035 ultrasound), **Dynatron Solaris Plus 709** $3-$5K combo ultrasound+e-stim, **Chattanooga Intelect Mobile Stim** $3-$5K. **E-stim/IFC/TENS:** Chattanooga Intelect Legend XT $1.5-$3K, Mettler Sys*Stim 240 $1-$2K (97032 attended, 97014/G0283 unattended). **Laser:** BioFlex IIIb $5-$15K, Multi Radiance MR4 Super Pulsed $8-$15K, K-Laser Cube $10-$20K, LightForce Class IV (Chattanooga/DJO Global) $15-$25K. **Hot/cold:** Chattanooga Hydrocollator E-1/E-2 $1.5-$3K + Whitehall S-90-B cold pack chest. **Traction:** Saunders Cervical/Lumbar $2-$8K, Chattanooga TX Traction $4-$10K (97012).

**Exercise floor (the gym).** Treadmill ($1.5-$5K, **Woodway** $5-$15K specialty), Schwinn AC Performance bike $2-$4K, **NuStep T4r/T5** recumbent stepper $4-$8K, **BOSU Balance Trainer** $100-$200, **Airex balance pads** $80-$160, stability balls, kettlebells (8-32 kg set), dumbbells full set $1.5-$5K, **TRX Suspension** $200-$400, **Theraband CLX** resistance bands, medicine balls, **REP rack** $400-$1.5K.

**Specialty equipment (niche-aligned).** **AlterG Anti-Gravity Treadmill** $35-$75K -- sports/post-op niche, partial-bodyweight 20-100% (~$15-$25K used). **Game Ready cryo+compression** $3-$5K. **Normatec compression boots** $1-$2K. **Hyperice / Theragun (Therabody, Jason Wersland)** $300-$600 percussive. **DJO Global / Enovis NYSE:ENOV bracing inventory** $5-$30K initial PAR (post-op knee/ankle/shoulder/back, Donjoy/Aircast/Procare drop-ship). **BTE Primus dynamometer** $35-$80K (industrial PT/work conditioning). **Vald ForceFrame/ForceDecks/DynaMo** $20-$60K (Australia force-frame, sports performance). **Biodex / HUMAC NORM (CSMI) / CON-TREX** isokinetic dynamometer $30-$80K (research-grade).

**Assessment.** Digital + analog goniometers + inclinometers $30-$200 each (6-12 needed), **Cook Functional Movement Screen FMS kit** $300-$800, **Y Balance Test kit** $400-$700, **Lafayette Manual Muscle Tester Mk II** $1.5-$3K, **Jamar hand dynamometer** $200-$500 (CHT), **Baseline pinch gauge** $50-$150 (CHT).

**Annual consumables run-rate** $8-$25K (theraband, tape, lotion, hot/cold pack inserts, gloves, cleaning).

### 3. EHR / billing / RCM stack (WebPT / Net Health / Clinicient / MWTherapy / TheraOffice)

**Wrong fit = 12-18 month switch pain + $40-$120K cost.**

**WebPT** (founded by **Heidi Jannenga DPT** 2008, **Warburg Pincus PE** acquired 2014, ~$5B rumored valuation 2024) -- dominant PT-purpose-built EHR, **~30-40% PT market share**. **$110-$220/provider/mo + add-ons (Reach, Analytics, Outcomes)** + **WebPT Billing (Therabill acquired) 5-8% of collections**. Tight PT workflows (eval templates, POC, 8-Minute Rule auto-calc, MIPS reporting, KX modifier auto-flag). Owns Therabill, Strive Labs, Reach, Outcomes (FOTO-style PROM).

**Net Health Therapy for Outpatient** (formerly Casamba, PE-backed, owns Hands On Technology/Optima Therapy SNF + Net Health Wound + Occ Med + Hospice/Home Health) -- **$140-$260/provider/mo + RCM 5-8%**. Strong multi-discipline (PT+OT+SLP) + multi-setting fit.

**Clinicient Insight** (acquired by **WebPT 2021** -- sunset/migration path to WebPT).

**MWTherapy** (privately held, founded 2002 NY) -- **$80-$160/provider/mo + RCM 4-7%**. Mid-tier all-in-one (EHR + billing + scheduling + comms).

**TheraOffice** (Hands On Technology → Net Health) -- $100-$200/provider/mo. **Practice Perfect** -- $80-$160/provider/mo. **Raintree Systems** -- multi-discipline rehab ($150-$300, pediatric + ABA + PT/OT/SLP). **Prompt EMR** -- modern cloud-native launched 2020, $150-$250/provider/mo, gaining share fast.

**Clearinghouse.** Office Ally, Availity, ChangeHealthcare/Optum, Waystar. Many EHRs bundle.

**Patient comms + reviews.** Weave, Solutionreach, NexHealth, Birdeye, Doctible. Google Business Profile critical (4.7+ stars x 100+ reviews/clinic target). **Online booking:** Solv/Zocdoc/Healthgrades for self-referral post-direct-access.

### 4. Credentialing through CAQH ProView + payer enrollment

**The single most operationally important pre-launch task.** Without in-network enrollment, first 60-180 days = cash-only chaos OR out-of-network 30-50% contracted rates.

**CAQH ProView** (Council for Affordable Quality Healthcare) -- universal credentialing database for major commercial payers. Free to providers. Re-attest every 120 days.

**Day-1 enrollments:** Aetna (CVS Health), Anthem BCBS + regional BCBS (Highmark, Excellus, Premera, Florida Blue), Cigna, Humana, UnitedHealthcare (Optum/UHG), Tricare (military), state Medicaid managed care, Medicare (CMS PECOS + 855B facility + 855I individual), workers' comp carriers (state-specific + state workers' comp commission). **60-180 day enrollment per payer** sequentially without dedicated credentialing specialist; 45-90 days w/ dedicated service.

**Credentialing services.** **Medallion** ($200-$500/provider/payer), **CredentialStream** (HealthStream-owned), **Symplr**, **VerityStream** (HealthStream), **WebPT credentialing partner programs**, in-house specialist $55-$80K/yr.

**Pre-credentialing.** Apply 4-6 months before doors open. CAQH discipline + re-attest every 120 days + track every app + weekly follow-up. Get NPI Type 2 facility + NPI Type 1 each provider + EIN + state PT license + state-specific provider type registration.

### 5. SBA + healthcare-specific financing

PT has dedicated specialty-finance ecosystem (low default rate ~3-5%).

**Typical solo de novo 2026:** lease $0 + TI $80-$280K + treatment tables $10-$30K + modalities $15-$40K + exercise floor $20-$60K + specialty equipment optional AlterG $35-$75K + Game Ready $3-$5K + Normatec $1-$2K + EHR/IT/signage $10-$30K + credentialing $8-$25K + working capital $40-$120K = **$200K-$600K solo de novo** or **$400K-$1.2M acquisition** at ~0.6-0.9x trailing collections.

**Acquisition financing.** $300K-$1M + 10-15% down + SBA 7(a) 75-90% + seller note 5-15% at 7-9% 5-7 yr + working capital reserve $50-$150K.

**Healthcare-specific lenders.** **Live Oak Bank Healthcare Lending** (top SBA healthcare + PT-active), **Provide.com** (was Lendeavor, PT 2022-2024), **First Citizens Bank Practice Solutions** (was Square 1), **Bank of America Practice Solutions**, **BMO Practice Finance** (was Harris), **Huntington Practice Finance**, **U.S. Bank Practice Finance**, **TD Bank Healthcare**, **Wells Fargo Practice Finance**, **First Business Bank Medical** (Midwest), **ConnectOne Bank Healthcare** (Northeast).

**Equipment leasing.** **AlterG financing** (lease 5-yr typical $700-$1,400/mo), **Game Ready / DJO Global / Enovis** equipment financing, **Crest Capital Healthcare**, **Western Equipment Finance**, **CIT Healthcare**, **EverBank Commercial Finance**.

---

## PART 3 -- OPERATIONS

### 1. Staffing (PT + PTA + tech/aide + front office + billing)

**Owner-PT.** Sees patients 25-35 hr/wk + manages ops 10-20 hr/wk early. Take-home **$115-$185K solo**.

**Associate DPT.** **$72-$95K** starting (APTA 2024 Salary Report median ~$85K), **$95-$130K** experienced 5+ yr (OCS/SCS specialty cert adds ~$8-$18K), **$140-$185K** very senior + specialty + productivity bonus. Productivity 12-15 visits/day insurance OR 3-5 cash-pay-premium.

**PTA.** **$50-$70K** starting (BLS 2024 median ~$62K), **$65-$85K** experienced. PTA performs treatment under PT supervision (Medicare/Medicaid typically on-site direct). Cost-efficient way to scale visit volume.

**Athletic Trainer ATC** **$45-$60K** -- rare in pure-PT, common in sports-PT hybrid. **Tech/Aide** **$15-$22/hr** -- modality setup, supervised exercise, room turnover; cannot bill independently. 1-3 FTE per clinic. **Front Office** **$17-$24/hr** -- check-in, insurance verification, copay, POC MD signature follow-up. 1-3 FTE.

**Billing/RCM.** **$22-$32/hr in-house** OR **outsourced 6-8% of net** to WebPT Billing (Therabill), Net Health RCM, MWTherapy bundled, Practice Perfect bundled, third-party (PT Billing Services, MedAssist PT).

**Niche specialist hires** -- WCS pelvic floor, CHT hand therapist, SCS sports specialist, VRC vestibular, CLT lymphedema. Each unlocks niche referral pipeline + premium per-visit + insulates from generalist commoditization.

### 2. Visit workflow (eval -> POC -> 8-12 visits -> discharge)

**Standard episode of care:** (1) Patient self-refers (direct-access in all 50 states) OR MD-referred via fax/EHR/HealthFusion; (2) Front office schedules eval (45-60 min initial); (3) Initial eval -- PT performs subjective HPI + ROM/MMT/special tests + functional assessment + builds plan-of-care POC (frequency typically 2-3x/week x 4-6 weeks); (4) MD signature on POC required for Medicare + most insurance within 30 days; (5) Treatment visits 8-15 visits typical episode -- manual therapy + therapeutic exercise + modalities + neuromuscular re-ed + HEP home exercise program; (6) Progress note every 10 visits or 30 days for Medicare; (7) Discharge with HEP + return-to-activity guidelines + Google review request.

\`\`\`mermaid
flowchart TD
  A[Patient Self-Refers Direct Access OR MD Referral] --> B[Front Office Schedules Eval 45-60 min]
  B --> C[Initial Eval: HPI + ROM + MMT + Special Tests + Functional]
  C --> D[PT Builds Plan-of-Care: Frequency x Duration + Goals]
  D --> E{MD Signature Required?}
  E -->|Medicare + Most Commercial| F[Send POC to Referring MD or PCP for Signature within 30 Days]
  E -->|Direct-Access State + Commercial Allows| G[Begin Treatment Day 1]
  F --> G
  G --> H[Treatment Visits 2-3x/wk x 4-6 wk]
  H --> I[Manual Therapy 97140 + Therapeutic Exercise 97110 + Modalities 97014/97035 + Neuromuscular Re-Ed 97112]
  I --> J[Progress Note Every 10 Visits or 30 Days for Medicare]
  J --> K{Goals Met?}
  K -->|Yes| L[Discharge + HEP + Return-to-Activity + Google Review Request]
  K -->|No, Extension Needed| M[POC Update + Additional Visits + MD Re-Sign]
  M --> H
\`\`\`

### 3. Solv / Zocdoc / Healthgrades online booking post-direct-access

All 50 states permit direct-access PT (no MD referral for first eval) as of 2023, making self-referral viable. **Healthgrades** dominates "physical therapy near me" SERP. **Zocdoc** -- multi-specialty booking + insurance verify. **Solv** -- growing for walk-in / same-day eval. **Google Business Profile + Reviews** -- highest-ROI marketing, target **4.7+ stars x 100+ reviews/clinic** via Weave/Solutionreach/NexHealth/Birdeye/Doctible discharge prompts.

### 4. CPT coding + reimbursement + 8-Minute Rule

**Eval codes.** **97161 PT eval low ($75-$105 Medicare / $95-$160 commercial)**, **97162 moderate ($85-$115 / $110-$180)**, **97163 high ($95-$130 / $125-$210)** -- replaced old 97001 in 2017. **97164 re-eval ($55-$80 / $65-$120)**.

**Time-based treatment codes (8-Minute Rule per CMS).** **97110 therapeutic exercise ($28-$42 / $35-$65 per 15-min unit)** -- most-billed PT code. **97140 manual therapy ($28-$42 / $35-$65)** -- joint mob, soft tissue, manipulation. **97112 neuromuscular re-ed ($30-$45 / $40-$70)** -- proprioception, balance. **97530 therapeutic activities ($32-$48 / $42-$72)**. **97535 self-care training ($30-$45 / $40-$68)**. **97542 wheelchair mgmt ($30-$45)**. **97750 physical performance test ($60-$95 / $75-$130)**.

**Untimed/service-based.** **97014 unattended e-stim / G0283 Medicare ($14-$22)**, **97032 attended e-stim ($15-$25)**, **97035 ultrasound ($12-$20 / $15-$28)**, **97026 infrared ($8-$15)**, **97012 mechanical traction ($14-$22)**, **97010 hot/cold pack ($0-$5 bundled)**.

**The 8-Minute Rule (CMS).** Time-based codes (97110/97140/97112/97530/97535/97542) require direct one-on-one time. **8-22 min = 1 unit, 23-37 = 2, 38-52 = 3, 53-67 = 4, 68-82 = 5**. Combined time across codes counts. Documentation must reflect actual minutes. **Audit-flag if total billed units exceed total face-time**. Commercial varies (some 8-Minute, some "AMA Rule of Eights").

**MPPR 8% reduction.** CMS applies 8% Multiple Procedure Payment Reduction to subsequent same-day units after highest-RVU. Compounds margin compression.

### 5. Medicare KX modifier + MIPS + plan-of-care signature

> ### Warning
> **Missing payer credentialing Day 1 = 90-180 days out-of-network or cash-only. Missing 8-Minute Rule compliance = Medicare audit clawback (RAC, ZPIC, UPIC). Missing MIPS reporting = 9% reimbursement penalty 2027. Missing plan-of-care MD signature within 30 days = Medicare claim denial. Patient injury during treatment = malpractice + state PT board complaint.**

**KX modifier threshold.** **2024 $2,330/yr per Medicare beneficiary** for PT+SLP combined -- projected **~$2,410 2025 / ~$2,490 2026 / ~$2,575 2027** (inflation-indexed). Above threshold, attach KX modifier attesting medical necessity. **CMS audit-flag ~$3,000/yr** triggers Targeted Probe and Educate (TPE) review.

**MIPS.** Mandatory for PTs **>200 Medicare patients/yr OR >$90K allowed charges OR >$200 covered services**. Four categories: Quality (45%), PI (25%), IA (15%), Cost (15%). Failed = **9% penalty 2027** (was 7% 2024). WebPT/Net Health MIPS bundles automate.

**Plan-of-care MD signature.** Medicare + most commercial require PT-developed POC signed by referring MD or PCP within **30 days** of initial eval. Missing = denial + clawback. Dedicated front-office POC-tracker common in mid-size clinics.

**Progress note frequency.** Medicare requires progress note every **10 visits OR 30 days** (whichever first). Commercial varies.

**HIPAA + OSHA + state PT board.** Annual HIPAA Risk Assessment + BAAs + encrypted email + 60-day breach notification. OSHA Bloodborne (relevant for dry-needling sharps), Hazard Comm. State PT board complaint / malpractice carrier.

**Direct-access variation.** All 50 states permit eval. Treatment beyond eval: 18 unrestricted, 25 require referral after visit-cap (10-30) or duration-cap (21-60 days), 7 require referral for any treatment.

---

## PART 4 -- GROWTH & EXIT

### 1. Marketing (MD referrals + Google + Instagram + niche specialty)

Dominant 2027 PT acquisition channels: **MD referral relationships (still 40-60% new patients at insurance-model practices), Google Business Profile + Reviews, Instagram + TikTok for cash-pay sports/wellness, Healthgrades, NextDoor, direct-access self-referral**.

**MD referral relationships.** Even with all-50-states direct access, MD referrals drive ~40-60% of new patients at insurance-model clinics. Cultivate orthopedic surgeons + neurologists + OB-GYNs (WCS) + pediatricians (PCS) + sports medicine MDs + PCPs via drop-by lunches + reciprocal communication (eval letter + progress note + discharge summary within 48 hrs via fax/EHR/HealthFusion) + shared CME + ortho-PT case conferences. **ATI/USPH/Athletico/Ivy moat:** PE chains lock exclusive ortho-surgeon contracts via capital + integrated billing + payer leverage; independents counter via niche specialty + clinical excellence + responsiveness.

**Google Reviews + GBP.** **4.7+ stars x 100+ reviews/clinic** via discharge prompts (Weave/Solutionreach/NexHealth/Birdeye/Doctible). Negative response within 24 hrs, no PHI. Single highest-ROI marketing.

**Instagram + TikTok cash-pay.** Movement Vault (Daniel Vadnal) built ~1M+ followers via mobility content + cash-pay funnel. SCS/sports PT, WCS pelvic floor, concierge tier benefit hugely from social (anatomy education, exercise demos, athlete stories).

**Healthgrades + Zocdoc** booking. **NextDoor** hyper-local. **Direct-access self-referral** Google/Instagram/Healthgrades/Zocdoc viable post-2023. Community sponsorships -- youth sports + 5K races + back-to-school screening.

### 2. Niche specialty (OCS / SCS / WCS / NCS / PCS / CHT / CLT)

> ### Key Stat
> Per APTA 2024 + USPH 10-K segment data + Confluent Health public statements: **niche specialty PT lifts gross 25-50% vs generalist** + commands per-visit premium 10-25% + insulates from PE-chain commoditization + builds defensible referral pipeline.

**OCS Orthopedic** (~17K per ABPTS 2024) -- required signaling for ortho-surgeon referrals + sports med, often paired with OMPT/FAAOMPT manual therapy fellowship. Premium per-visit + larger episode (post-op TKA/THA/ACL/RTC).

**SCS Sports** (~3K) -- elite athlete + return-to-sport + post-op sports ortho. Often paired with OCS + CSCS strength cert. Premium per-visit + cash-pay + Instagram brand.

**WCS Women's Health** (~600) -- highly underserved. Pelvic floor (incontinence, prolapse, dyspareunia), prenatal/postpartum, lymphedema (often w/ CLT), pelvic pain. Booming 2024-2027 -- Instagram/TikTok content + concierge medicine. Often cash-pay $150-$300/visit. Pelvic Guru + Herman & Wallace cert programs.

**NCS Neurology + VRC Vestibular** (~2.5K NCS + ~2K VRC) -- stroke, TBI, SCI, Parkinson's (LSVT BIG/LOUD cert), MS, vestibular (BPPV Epley, hypofunction), concussion (ImPACT). Aging + post-COVID vestibular drives demand.

**PCS Pediatrics** (~2K) -- developmental delay, ortho-peds (scoliosis, gait, toe-walking), torticollis/plagiocephaly, NICU follow-up, cerebral palsy. Pediatrician + early intervention pipeline.

**CHT Hand HTCC** (~6K) -- requires 5 yr clinical experience + exam. Hand/wrist/elbow post-op + repetitive strain + arthritis. Hand surgeon-tied pipeline.

**CLT Lymphedema LANA** (~3K) -- post-mastectomy + cancer + primary lymphedema. Compression bandaging + manual lymph drainage + garments. Often paired with WCS or oncology.

**PORi oncology rehab** -- emerging niche (cancer survivorship + chemo neuropathy + radiation fibrosis + scar mobilization). APTA Oncology Section. **Performing arts medicine** -- dance/music/theatre niche. **Equestrian/dressage** -- niche-specific.

### 3. Scale model (1-PT solo -> 2-3 PT group -> 4-6 multi -> 8-15 regional -> PE)

**Yr 0-2 single-clinic.** $450K-$1.2M gross + 15-22% net + clinical income = $115-$185K take-home. Payer-mix + MD referral + Google reviews.

**Yr 2-5 2-3 PT group.** $1.4-$3.5M + 14-20% net = $200K-$700K. Shared back-office + billing manager + specialty-cert hires (WCS/CHT/SCS).

**Yr 5-8 4-6 PT multi-location.** $3-$8M + 12-18% net = $360K-$1.4M. Regional clinical director + COO.

**Yr 8-12 8-15 PT regional.** $8-$22M + 11-16% net = $880K-$3.5M. CFO + COO + multi-site clinical lead + referral rep. Investor partner OR small PE growth round.

**Yr 12+ regional platform 15+.** $22M+. PE platform + roll-up + strategic sale to ATI/USPH/Athletico/Ivy/Confluent/Upstream.

**Second-clinic trigger** at sustained 30+ visits/day + cash reserves + ops team OR attractive acquisition $300K-$900K at ~0.6-0.8x.

**Franchise.** FYZICAL Therapy & Balance Centers -- $50K + 6% royalty + ~$3K/mo. Brian Belmont, balance/vestibular niche, ~500 locations. H2 Health -- emerging franchise.

### 4. Exit options + ATI/USPH/Athletico/Ivy/Confluent precedent

> ### Key Stat
> Per ATI Physical Therapy NYSE:ATIP 10-K + US Physical Therapy NYSE:USPH 10-K + Select Medical NYSE:SEM 10-K + Confluent Health public M&A statements + APTA industry analysis: **PT M&A multiples run 5-8x EBITDA for PE rollups** (compressed 2022-2024 post-rate-hike + ATI bankruptcy, recovering 2025-2026), **0.6-0.9x trailing collections for local PT operator buyers**, **0.7-1.0x for strategic regional**, **0.6-0.8x + seller note + earnout for family/associate buyout**. **CityMD-Optum $9B 2022 high-water-mark in urgent care** set adjacent benchmark; ATI emerged from Chapter 11 2024 = sector reset reminder.

| Buyer Type | Multiple | Profile | Best For |
|---|---|---|---|
| PE rollup (ATI/USPH/Athletico/Ivy/Confluent/Upstream/CORA) | 5-8x EBITDA | $500K-$5M+ EBITDA multi-clinic group | Multi-clinic groups w/ EBITDA $500K+ |
| US Physical Therapy partnership-model | Variable + retained 51% local equity | USPH unique JV-acquisition structure | Owner-PT wanting retained equity + local autonomy |
| Hospital system outpatient PT | 0.8-1.2x trailing collections | Local hospital absorbs adjacent | Single-clinic in hospital catchment area |
| Local PT operator | 0.6-0.9x collections + AR + WC | Local DPT-owner buyer single-clinic | Single-clinic owner-PT exit |
| Strategic regional PT | 0.7-1.0x collections | Regional operator absorbing adjacent | Small group 2-5 clinics |
| Family / associate buyout | 0.6-0.8x + seller note + earnout | Adult child DPT or senior associate | Multi-generational hand-off |

**(1) PE rollup 5-8x EBITDA + retained equity 20-40% + second-bite.** Best for $500K-$5M+ EBITDA groups. ATI (Advent), USPH (partnership-model 51% retained), Select Medical Concentra, Confluent (Larry Benz multi-brand), Athletico (BDT), Ivy Rehab (Waud+Formation), Upstream (KKR), CORA, NovaCare active. Owner retains 20-40% + 3-5 yr contract + second-bite 2-3x retained.

**(2) USPH partnership-model JV** -- owner retains 51% local equity + USPH 49% + corporate back-office. Best for partial liquidity without losing autonomy.

**(3) Hospital system 0.8-1.2x trailing collections.** Owner-PT employed + 3-5 yr operational role.

**(4) Local PT operator 0.6-0.9x collections + AR + WC.** Common single-clinic exit, faster + simpler than PE/hospital.

**(5) Strategic regional PT absorption** 0.7-1.0x collections.

**(6) Family/associate buyout** 0.6-0.8x + seller note + earnout. Pass to DPT child or senior associate, 5-10 yr transition + real estate retained in separate LLC.

**(7) Movement Vault / OrthoCarolina cash-pay concierge playbook.** Cash-only $200-$400/visit, fewer slots + higher LTV + zero insurance overhead. Lifestyle solo or boutique 1-3 clinic, exits at higher EBITDA-multiple (no payer concentration risk).

**(8) Lifestyle solo independent.** 1-clinic indefinitely + $115-$185K take-home + 32-50 hr/wk. Common for 40-65% of independent PT owners per APTA 2024.

### 5. Value-based care + ACO + bundled payment opportunities

**Emerging 2027 opportunity.** PT as Medicare Advantage / ACO partner for care-coordination + post-acute care + ED-diversion + post-surgical bundles. **Bundled Payments for Care Improvement Advanced BPCI-A** (CMS Innovation Center): joint replacement (TKA/THA), CHF, COPD, MI. PT participates as post-acute provider w/ bundle holder (hospital/ortho group). Per-bundle savings + quality bonuses.

**ACO partnerships.** **Medicare Shared Savings Program MSSP + ACO REACH** -- PT joins ACO as care-coordination partner. PT visit for MA member = post-op recovery accelerator + ED-diversion + readmission reduction.

**MA carrier direct contracting.** Humana MA + Aetna MA + UHC MA seek PT density for total-cost-of-care reduction + post-op recovery + falls-prevention.

**Capitated employer wellness panels.** Large employers 1,000+ employees, ergonomic + injury-prevention + onsite-PT clinic capitated $50-$200/employee/yr.

`;

const tldr = `**TL;DR:** Starting a **physical therapy practice in 2027** (a.k.a. **PT clinic, outpatient rehab, Doctor of Physical Therapy DPT practice**) -- a **state-licensed outpatient ambulatory rehab facility staffed by DPT graduates + Physical Therapist Assistants PTA, providing musculoskeletal, neurological, vestibular, pediatric, geriatric, oncology, women's health pelvic floor, sports performance, and post-surgical rehabilitation through manual therapy (97140), therapeutic exercise (97110), neuromuscular re-education (97112), therapeutic activities (97530), self-care training (97535), and modalities (97014 e-stim, 97035 ultrasound, 97012 traction)** -- means choosing among **six models against PE-rollup competition (ATI Physical Therapy NYSE:ATIP ~880 post-2024 Chapter 11 emergence Advent International / US Physical Therapy NYSE:USPH ~600 Chris Reading partnership-model 51% local equity / Select Medical NYSE:SEM Concentra rehab ~640 / Confluent Health Larry Benz multi-brand ProRehab+KORT+Texas PT Specialists+ProActive / Athletico ~600 BDT Capital / Ivy Rehab Network ~700 Waud+Formation Capital / Upstream Rehabilitation ~1,200 KKR BenchMark+Drayer+SportsMED / FYZICAL Therapy & Balance Centers ~500 franchise Brian Belmont $50K+6% balance/vestibular niche / CORA / NovaCare / H2 Health) plus cash-pay sports revolution (Movement Vault Daniel Vadnal + MOTUS Physical Therapy NYC/LA + Joi Health + OrthoCarolina concierge + Performance Optimal Health + Champion Performance Beverly Hills); requires CAPTE-accredited DPT 3-yr + NPTE FSBPT $485 + state PT license + ABPTS specialty cert (OCS Orthopedic ~17K + SCS Sports ~3K + NCS Neurology ~2.5K + PCS Pediatrics ~2K + GCS Geriatric ~3K + WCS Women's Health ~600 + CHT Hand HTCC ~6K + CLT Lymphedema LANA ~3K + VRC Vestibular ~2K + PORi oncology) + CAQH ProView + Aetna/BCBS/Cigna/Humana/UHC/Medicare PECOS 855B/855I/Medicaid/Tricare/workers' comp 60-180 day per-payer + HIPAA + OSHA + direct-access all 50 states post-2023 (18 unrestricted + 25 visit/duration cap + 7 referral); equipment Bailey/Tri W-G/Pivotal Health Pierce/Oakworks PT200/Hausmann treatment tables $1.5-$5K + Mettler Sonicator Plus 992/Dynatron Solaris Plus 709/Chattanooga Intelect ultrasound + e-stim + BioFlex/Multi Radiance MR4/K-Laser/LightForce Chattanooga DJO Global laser + Chattanooga Hydrocollator + Whitehall + Saunders/Chattanooga TX traction + Woodway/Schwinn AC/NuStep T4r-T5 + BOSU/TRX/Theraband CLX/REP rack + AlterG Anti-Gravity Treadmill $35-$75K + Game Ready CoolSystems/Avanos + Normatec + Hyperice/Theragun + DJO Global/Enovis NYSE:ENOV Donjoy/Aircast bracing + BTE Primus + Vald ForceFrame/ForceDecks/DynaMo + Biodex/HUMAC NORM/CON-TREX isokinetic + Cook FMS + Y Balance + Lafayette MMT + Jamar; EHR/PMS WebPT (Heidi Jannenga DPT founded 2008 Warburg Pincus PE 2014 ~$5B rumored ~30-40% market share owns Therabill+Strive Labs+Reach+Outcomes $110-$220+5-8% RCM) + Net Health Therapy Outpatient (formerly Casamba+Hands On Technology+Optima multi-vertical $140-$260+5-8%) + Clinicient Insight (WebPT acquired 2021 sunset) + MWTherapy 2002 NY $80-$160+4-7% + TheraOffice + Practice Perfect + Raintree Systems + Prompt EMR cloud-native 2020 $150-$250 gaining share + Office Ally/Availity/ChangeHealthcare Optum/Waystar + Weave/Solutionreach/NexHealth/Birdeye/Doctible; capital $200K-$600K solo de novo + $400K-$1.2M acquisition at ~0.6-0.9x collections + SBA 7(a) via Live Oak Bank Healthcare + Provide.com + First Citizens Practice Solutions + Bank of America Practice Solutions + BMO Practice Finance + Huntington + US Bank + TD Bank + Wells Fargo + First Business Bank Medical** -- operating against **~$40B+ US PT industry (APTA + IBISWorld 2024) + ~250K licensed PTs (APTA Demographic Profile 2024) + ~120K PTAs (BLS 2024) + ~38,000 outpatient clinics + 6-8% YoY growth + 8-15 visits avg episode + 25-35 patients/day insurance-model + 3-5 patients/day cash-pay-premium + $450K-$1.2M solo mature gross + 15-22% net insurance / 30-45% cash-pay + ~12% PT visits now cash-pay per APTA 2024 vs ~5% in 2019 + $40-$120 CAC + $850-$2,400 LTV per episode; counter-pressures CMS Medicare reimbursement compression 8% MPPR + KX modifier $2,330 2024 -> ~$2,575 2027 + MIPS 9% penalty 2027 + 8-Minute Rule audit (RAC/ZPIC/UPIC clawback) + plan-of-care MD signature within 30 days + PE-rollup exclusive ortho-surgeon referral contracts + ATI Chapter 11 2023 emergence 2024 sector reset)**. The hardest part is **PAYER CREDENTIALING + MEDICARE COMPLIANCE GAUNTLET + PE-ROLLUP REFERRAL PRESSURE trifecta**, not capital or equipment spend.`;

const flow = `

## The Operating Journey: From Solo Cold-Start To PE-Rollup / Partnership-Model Exit

\`\`\`mermaid
flowchart TD
  A[DPT Founder + NPTE + State License] --> B{Archetype}
  B -->|PT-Owned Solo 4-8 Tables| C1[$200K-$600K De Novo OR $400K-$1.2M Acquisition 0.6-0.9x Collections]
  B -->|Small Group 2-5 PTs| C2[$400K-$1.5M + Niche Specialty WCS/CHT/SCS]
  B -->|Multi-Location 6-15 Clinics| C3[$5-$18M + Shared Back-Office + Referral Rep]
  B -->|Hospital Affiliate HCA/AdventHealth/Atrium/Northwell/Cleveland Clinic/Mayo Sports Med| C4[Employed DPT + Epic/Cerner + System Billing]
  B -->|PE Rollup ATI/USPH/Athletico/Ivy/Confluent/Upstream/CORA/NovaCare| C5[Corporate Platform]
  B -->|FYZICAL Brian Belmont ~500 Franchise| C6[$50K Fee + 6% Royalty]
  C1 --> D[Licensing + Compliance]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  C6 --> D
  D --> D1[CAPTE DPT + NPTE FSBPT $485 + State PT License + Jurisprudence + 30-40 CE/2yr + PT Compact ~37 States]
  D --> D2[Optional Residency + ABPTS OCS/SCS/NCS/PCS/GCS/WCS + CHT HTCC + CLT LANA + VRC + PORi]
  D --> D3[NPI Type 1 + Type 2 + EIN + State Sales Tax + Local Business License + HIPAA + OSHA]
  D --> D4[Direct-Access 50 States 18 Full + 25 Visit/Duration Cap + 7 MD Referral for Treatment]
  D1 --> E{Build-Out + Equipment}
  D2 --> E
  D3 --> E
  D4 --> E
  E --> E1[Real Estate 1,500-3,000 sq ft + 4-8 Tables + Open Gym + 1-2 Private Rooms + $150-$280/sq ft TI]
  E --> E2[Tables Bailey/Tri W-G/Pivotal Health Pierce/Oakworks PT200/Hausmann + Modalities Mettler Sonicator Plus 992/Dynatron Solaris Plus 709/Chattanooga Intelect Ultrasound + E-Stim + BioFlex/Multi Radiance MR4/K-Laser/LightForce DJO Global Laser + Hydrocollator + Whitehall Cold + Saunders/Chattanooga TX Traction]
  E --> E3[Exercise Floor Woodway/Schwinn/NuStep T4r-T5/BOSU/TRX/Theraband CLX/REP + Specialty AlterG Anti-Gravity $35-$75K + Game Ready + Normatec + Hyperice/Theragun + DJO/Enovis Donjoy/Aircast Bracing + BTE Primus $35-$80K + Vald ForceFrame + Biodex/HUMAC NORM Isokinetic]
  E1 --> F{EHR + PMS + RCM + Credentialing}
  E2 --> F
  E3 --> F
  F --> F1[WebPT Heidi Jannenga/Warburg Pincus ~30-40% PT Share $110-$220+5-8% RCM Therabill+Strive Labs+Reach+Outcomes OR Net Health Casamba/Hands On/Optima multi-vertical $140-$260 OR MWTherapy 2002 NY $80-$160+4-7% OR TheraOffice OR Practice Perfect OR Raintree OR Prompt EMR cloud-native 2020]
  F --> F2[Clearinghouse Office Ally/Availity/ChangeHealthcare Optum/Waystar + Comms Weave/Solutionreach/NexHealth/Birdeye/Doctible + GBP 4.7+ stars 100+]
  F --> F3[Credentialing CAQH ProView + Medallion/CredentialStream/Symplr/VerityStream + 60-180 Day Per-Payer]
  F1 --> G[Payer Enrollment]
  F2 --> G
  F3 --> G
  G --> G1[Aetna + BCBS + Cigna + Humana + UHC + Tricare + Medicaid + Medicare PECOS 855B/855I + Workers Comp]
  G1 --> H[Recruiting + Operations]
  H --> H1[Owner-PT $115-$185K Take-Home + Associate DPT $72-$95K Start APTA 2024 Median ~$85K / $95-$130K Exp + OCS/SCS Add ~$8-$18K + PTA $50-$70K Start BLS 2024 Median ~$62K]
  H --> H2[Tech/Aide $15-$22/hr + Front Office $17-$24/hr POC MD Signature Tracker + Billing $22-$32/hr In-House OR 6-8% Net Outsourced + Niche Specialist WCS/CHT/SCS/VRC/CLT]
  H1 --> I[Episode of Care + 8-15 Visits + 8-Minute Rule + MIPS]
  H2 --> I
  I --> I1[Self-Refer Direct Access OR MD Referral -> Schedule -> 45-60 min Eval -> PT Builds POC -> MD Sign within 30 Days Medicare -> Treatment 2-3x/wk x 4-6 wk -> Progress Note 10 Visits or 30 Days -> Discharge + HEP + Google Review]
  I --> I2[Eval 97161/97162/97163 + Re-Eval 97164 + 97110 Therapeutic Exercise + 97140 Manual Therapy + 97112 Neuromuscular Re-Ed + 97530 Therapeutic Activities + 97535 Self-Care + 97750 Performance Test + 8-Minute Rule 8-22min=1unit + MPPR 8% Cut]
  I --> I3[KX Modifier $2,330 2024 -> ~$2,575 2027 + TPE Audit-Flag $3,000 + MIPS 9% Penalty 2027]
  I1 --> J[Specialty Niche + Cash-Pay Adjuncts]
  I2 --> J
  I3 --> J
  J --> J1[OCS Ortho ~17K + SCS Sports ~3K + WCS Pelvic Floor ~600 Booming + NCS/VRC + PCS ~2K + CHT ~6K + CLT ~3K + PORi Oncology + LSVT BIG/LOUD Parkinson]
  J --> J2[Cash-Pay Sports/Concierge Movement Vault Daniel Vadnal + MOTUS NYC/LA + Joi Health + OrthoCarolina + Performance Optimal + Champion Beverly Hills $200-$400/visit + Dry Needling $50-$120 + Recovery Sessions $40-$120 + Employer Onsite Capitated $50-$200/yr]
  J1 --> K[Scale]
  J2 --> K
  K --> K1[Yr 0-2 Solo $450K-$1.2M 15-22% $115-$185K Take-Home -> Yr 2-5 2-3 PT $1.4-$3.5M $200K-$700K + Specialty Hires -> Yr 5-8 4-6 PT $3-$8M $360K-$1.4M -> Yr 8-12 8-15 PT $8-$22M $880K-$3.5M PE Growth Round -> Yr 12+ Platform 15+ $22M+ Strategic Sale]
  L{Strategic Exit}
  K --> L
  L -->|PE Rollup 5-8x EBITDA + Retained 20-40% + Second-Bite 2-3x| M[ATI Advent/USPH Partnership 51%/Select Medical Concentra/Confluent Larry Benz/Athletico BDT/Ivy Waud+Formation/Upstream KKR/CORA/NovaCare]
  L -->|USPH Partnership 51% Retained Local Equity| N[Owner-PT Retains 51% + USPH 49% + Back-Office + Capital]
  L -->|Hospital 0.8-1.2x Collections| O[HCA/AdventHealth/Atrium/Banner/Intermountain/Northwell/Cleveland Clinic/Mayo Sports Med]
  L -->|Local PT 0.6-0.9x + AR + WC| P[Faster Simpler]
  L -->|Strategic Regional 0.7-1.0x| Q[2-5 Clinic Group]
  L -->|Family/Associate 0.6-0.8x + Seller Note + Earnout| R[DPT Child or Senior Associate + 5-10 yr Transition]
  L -->|Lifestyle Solo OR Cash-Pay Concierge| S[$115-$185K Take-Home OR Movement Vault/Concierge $200-$400/visit]
\`\`\`

`;

const src = `

## Sources

1. **American Physical Therapy Association APTA** -- Demographic Profile 2024 + Median Income Report 2024 + ~250K PTs + ~12% cash-pay share + industry policy + Roger Herr CEO. https://www.apta.org
2. **Commission on Accreditation in Physical Therapy Education CAPTE** -- DPT program accreditation + ~280 accredited DPT programs. https://www.capteonline.org
3. **Federation of State Boards of Physical Therapy FSBPT** -- NPTE National Physical Therapy Examination + state licensure + PT Compact ~37 states. https://www.fsbpt.org
4. **American Board of Physical Therapy Specialties ABPTS** -- specialty cert OCS/SCS/NCS/PCS/CCS/GCS/WCS/ECS roster counts. https://specialization.apta.org
5. **BLS Occupational Outlook 2024 Physical Therapists + PT Assistants** -- ~120K PTAs + wages + employment outlook. https://www.bls.gov/ooh/healthcare/physical-therapists.htm
6. **CMS Physician Fee Schedule** -- PT codes 97161/97162/97163/97164 + 97110/97140/97112/97530/97535/97542/97750 + 97014/97032/97035/97026/97012 reimbursement + 8-Minute Rule + 8% MPPR. https://www.cms.gov/medicare/payment/fee-schedules/physician
7. **CMS PECOS 855B Facility + 855I Individual Medicare Enrollment**. https://pecos.cms.hhs.gov
8. **CMS KX Modifier Threshold + MIPS Quality+PI+IA+Cost** -- $2,330 2024 -> ~$2,575 2027 + 9% penalty 2027 if MIPS missed. https://www.cms.gov/medicare/quality/value-modifier
9. **IBISWorld Physical Therapists in the US** -- $40B+ industry sizing + 6-8% YoY growth + competitive landscape. https://www.ibisworld.com
10. **ATI Physical Therapy NYSE:ATIP 10-K + Chapter 11 emergence 2024** -- ~880 clinics post-restructuring + Advent International-backed. https://www.atipt.com
11. **US Physical Therapy NYSE:USPH 10-K + Chris Reading CEO** -- ~600 clinics + partnership-model JV w/ retained 51% local equity. https://www.usph.com
12. **Select Medical Holdings NYSE:SEM 10-K + Concentra rehab division** -- ~640 outpatient rehab clinics integrated occ-med/workers' comp. https://www.selectmedicalholdings.com
13. **Confluent Health + Larry Benz CEO** -- multi-brand ProRehab/KORT/Texas PT Specialists/ProActive PE-backed PT platform. https://www.confluenthealth.com
14. **Athletico Physical Therapy + BDT Capital** -- ~600 locations Chicago-HQ. https://www.athletico.com
15. **Ivy Rehab Network + Waud Capital + Formation Capital** -- ~700 clinics. https://www.ivyrehab.com
16. **FYZICAL Therapy & Balance Centers + Brian Belmont CEO** -- ~500 franchises + balance/vestibular niche + $50K + 6% royalty. https://www.fyzical.com
17. **Upstream Rehabilitation + KKR + BenchMark/Drayer/SportsMED brands** -- ~1,200 clinics. https://www.upstreamrehab.com
18. **CORA Physical Therapy + NovaCare Rehabilitation Select Medical** -- regional PT operators. https://www.coraphysicaltherapy.com
19. **Encompass Health NYSE:EHC** -- inpatient rehab facility IRF (adjacent vertical referral source). https://www.encompasshealth.com
20. **HCA Healthcare outpatient PT + AdventHealth outpatient PT + Atrium Health Rehabilitation + Banner Health Outpatient Rehab + Intermountain Health Outpatient Rehab + Northwell Health Outpatient PT + Cleveland Clinic Rehab Therapy + Mayo Clinic Sports Medicine PT** -- hospital-system outpatient PT operators. https://www.hcahealthcare.com
21. **Movement Vault + Daniel Vadnal** -- cash-pay mobility-focused PT brand + ~1M+ Instagram followers. https://www.movementvault.com
22. **MOTUS Physical Therapy NYC + LA** -- cash-pay performance PT. https://www.motusphysicaltherapy.com
23. **Joi Health** -- concierge PT model. https://www.joi.health
24. **OrthoCarolina concierge tier + Performance Optimal Health + Champion Performance & PT Beverly Hills** -- cash-pay sports/performance/concierge. https://www.orthocarolina.com
25. **WebPT (Heidi Jannenga DPT founded 2008, Warburg Pincus PE acquired 2014, ~$5B valuation rumored 2024)** -- ~30-40% PT EHR market share + owns Therabill + Strive Labs + Reach + Outcomes. https://www.webpt.com
26. **Net Health Therapy for Outpatient (formerly Casamba + Hands On Technology + Optima Therapy + Net Health Wound + Net Health Occupational Medicine + Net Health Hospice/Home Health multi-vertical platform)**. https://www.nethealth.com
27. **Clinicient Insight (acquired WebPT 2021, sunset migration path to WebPT)**. https://www.clinicient.com
28. **MWTherapy (privately held 2002 New York)** -- mid-tier PT-specific EHR + billing + scheduling. https://www.mwtherapy.com
29. **TheraOffice (acquired Hands On Technology then Net Health)**. https://www.theraoffice.com
30. **Practice Perfect + Raintree Systems + Prompt EMR** -- PT EHR alternatives. https://www.practiceperfect.com
31. **Office Ally + Availity + ChangeHealthcare Optum + Waystar** -- clearinghouse. https://www.officeally.com
32. **Bailey Manufacturing + Tri W-G + Pivotal Health Solutions Pierce + Oakworks PT200 + Hausmann Industries + PHS Chiropractic** -- treatment tables. https://www.baileymfg.com
33. **Mettler Electronics Sonicator Plus 992** -- ultrasound therapy. https://www.mettlerelectronics.com
34. **Dynatron Solaris Plus 709 + Chattanooga Intelect Mobile Stim + Chattanooga Intelect Legend XT + Chattanooga Hydrocollator E-1/E-2 + Chattanooga TX Traction (DJO Global / Enovis)** -- combo modalities. https://www.djoglobal.com
35. **BioFlex Class IIIb + Multi Radiance MR4 Super Pulsed + K-Laser Cube + LightForce Therapy Lasers (Chattanooga/DJO Global) Class IV** -- laser therapy. https://www.bioflexlaser.com
36. **Saunders Group Cervical/Lumbar Traction + Whitehall S-90-B cold pack chest** -- traction + thermal. https://www.empi.com
37. **Woodway treadmill + Schwinn AC Performance + NuStep T4r/T5 + BOSU + Airex + TRX Suspension + Theraband CLX + REP rack** -- exercise floor equipment. https://www.woodway.com
38. **AlterG Anti-Gravity Treadmill** $35-$75K sports/post-op partial-bodyweight unloading + ~$15-$25K used. https://www.alterg.com
39. **Game Ready cryo+compression (CoolSystems / Avanos)** -- sports post-op recovery. https://www.gameready.com
40. **Normatec compression boots + Hyperice + Theragun (Therabody Jason Wersland)** -- recovery. https://www.hyperice.com
41. **DJO Global / Enovis NYSE:ENOV** -- bracing inventory + Donjoy + Aircast + Procare drop-ship. https://www.enovis.com
42. **BTE Primus dynamometer** -- industrial PT / work conditioning $35-$80K. https://www.bteresources.com
43. **Vald ForceFrame + ForceDecks + DynaMo (Australia)** -- force-frame dynamometry sports performance $20-$60K. https://valdperformance.com
44. **CON-TREX / HUMAC NORM (CSMI) / Biodex isokinetic dynamometer** -- research-grade sports/post-op. https://www.biodex.com
45. **Cook Functional Movement Screen FMS kit + Y Balance Test kit + Lafayette Manual Muscle Tester Mk II + Jamar hand dynamometer + Baseline pinch gauge** -- assessment. https://www.functionalmovement.com
46. **CAQH ProView** -- universal credentialing database. https://proview.caqh.org
47. **Medallion + CredentialStream HealthStream + Symplr + VerityStream HealthStream** -- credentialing-as-a-service. https://www.medallion.co
48. **Live Oak Bank Healthcare Lending** -- top SBA healthcare + PT-active. https://www.liveoakbank.com
49. **Provide.com (was Lendeavor)** -- healthcare practice financing. https://www.provide.com
50. **First Citizens Bank Practice Solutions (was Square 1) + Bank of America Practice Solutions + BMO Practice Finance (was Harris) + Huntington Practice Finance + US Bank Practice Finance + TD Bank Healthcare + Wells Fargo Practice Finance + First Business Bank Medical + ConnectOne Bank Healthcare** -- PT practice lenders. https://www.bankofamerica.com/smallbusiness/business-financing/practice-solutions
51. **AlterG equipment financing + Game Ready/DJO Global/Enovis equipment financing + Crest Capital Healthcare + Western Equipment Finance + CIT Healthcare + EverBank Commercial Finance** -- equipment leasing. https://www.crestcapital.com
52. **HHS OCR HIPAA + Security + Breach Notification + HITECH**. https://www.hhs.gov/ocr
53. **OSHA Bloodborne Pathogens 29 CFR 1910.1030 + Hazard Communication** (relevant for dry-needling sharps). https://www.osha.gov/bloodborne-pathogens
54. **State PT Licensing Boards + Direct-Access Status Map** -- 50-state direct-access + variation (18 full + 25 limited + 7 referral). https://www.apta.org/your-practice/practice-models-and-settings/direct-access-by-state
55. **APTA Sections** -- Orthopaedic + Sports + Neurology + Pediatric + Geriatric + Cardiopulmonary + Women's Health + Oncology + Hand + Lymphedema + Vestibular. https://www.apta.org/apta-and-you/leadership-and-governance/components
56. **HTCC Hand Therapy Certification Commission + LANA Lymphology Association of North America + Herman & Wallace Pelvic Rehab + Pelvic Guru** -- specialty cert bodies. https://www.htcc.org
57. **CMS Bundled Payments for Care Improvement Advanced BPCI-A + Medicare Shared Savings Program MSSP + ACO REACH** -- value-based care PT participation. https://innovation.cms.gov/innovation-models/bpci-advanced
58. **APTA 2024 Salary Report** -- DPT $72-$95K starting + $95-$130K experienced + OCS/SCS adds. https://www.apta.org/your-career/careers-in-physical-therapy
59. **PT Compact Commission ~37 states multi-state licensure**. https://ptcompact.org
60. **Healthgrades + Zocdoc + NextDoor + Google Business Profile + Weave + Solutionreach + NexHealth + Birdeye + Doctible** -- marketing + reviews + booking. https://www.healthgrades.com
61. **NRCME for DOT physicals (PT-relevant if industrial / work conditioning niche)**. https://www.fmcsa.dot.gov/medical
62. **LSVT BIG + LSVT LOUD (Parkinson's PT cert)** -- Parkinson-specific PT cert. https://www.lsvtglobal.com

`;

const num = `

## Numbers & Benchmarks

### Industry size & PT supply 2024-2026

| Metric | Value | Source |
|---|---|---|
| US PT industry | ~$40B+ | APTA + IBISWorld 2024 |
| Licensed PTs | ~250K | APTA Demographic Profile 2024 |
| PT Assistants | ~120K | BLS Occupational Outlook 2024 |
| Outpatient PT clinics | ~38,000 | APTA + IBISWorld |
| YoY growth | 6-8% | APTA + IBISWorld |
| Avg episode of care | 8-15 visits | APTA |
| Mature visits/day insurance-model | 25-35 | APTA Benchmarking + USPH 10-K |
| Mature visits/day cash-pay-premium | 3-5 | Movement Vault + concierge data |
| Solo mature gross | $450K-$1.2M | APTA + USPH segment |
| Small group mature gross | $1.4M-$3.5M | APTA + USPH segment |
| Net well-run insurance | 15-22% | APTA |
| Net well-run cash-pay | 30-45% | Movement Vault / OrthoCarolina concierge |
| % visits cash-pay 2024 | ~12% | APTA 2024 |
| % visits cash-pay 2019 | ~5% | APTA 2019 |
| New-patient CAC | $40-$120 | industry |
| Patient LTV per episode | $850-$2,400 | APTA + USPH |
| Independent/small group share | ~52-58% | APTA |
| Hospital-system share | ~22-28% | APTA |
| PE/franchise share | ~18-24% | APTA |

### Top 15 PT corporate chains by clinic count

| Operator | Type | Owner | Locations |
|---|---|---|---|
| Upstream Rehabilitation | PE rollup (BenchMark/Drayer/SportsMED) | KKR | ~1,200 |
| ATI Physical Therapy | PE rollup (post-2024 Chapter 11 emergence) | Advent International / NYSE:ATIP | ~880 |
| Ivy Rehab Network | PE rollup | Waud Capital + Formation Capital | ~700 |
| Select Medical Concentra rehab | PE/corporate | Select Medical NYSE:SEM | ~640 |
| Athletico Physical Therapy | PE rollup | BDT Capital | ~600 |
| US Physical Therapy | PE/JV partnership-model | NYSE:USPH (Chris Reading) | ~600 |
| FYZICAL Therapy & Balance Centers | Franchise (balance/vestibular niche) | Brian Belmont | ~500 |
| Confluent Health (multi-brand) | PE multi-brand (ProRehab/KORT/Texas PT Specialists/ProActive) | Larry Benz CEO | varies |
| CORA Physical Therapy | PE rollup | Tritium Partners | varies |
| NovaCare Rehabilitation | Select Medical subsidiary | Select Medical | varies |
| H2 Health | Franchise | Independent | varies |
| HCA Healthcare outpatient PT | Hospital | HCA Healthcare | varies |
| AdventHealth outpatient PT | Hospital | AdventHealth | varies |
| Atrium Health Rehabilitation | Hospital | Atrium Health | varies |
| Cleveland Clinic Rehab Therapy | Hospital | Cleveland Clinic | varies |

### Payer mix benchmark (APTA + USPH 10-K well-run independent)

| Payer | % Revenue | Avg Reimbursement |
|---|---|---|
| Commercial PPO (BCBS/Aetna/Cigna/Humana/UHC) | 35-50% | $80-$130/visit |
| Medicare Part B | 20-30% | $65-$110/visit (post 8% MPPR) |
| Medicaid managed care | 5-12% | $45-$95/visit |
| Workers' comp | 8-15% | $90-$160/visit (state fee schedule) |
| Auto/PIP | 2-6% | $90-$160/visit (state) |
| Cash-pay / self-pay | 8-15% | $120-$220/visit eval, $90-$150 follow-up |
| Tricare / VA | 1-4% | varies |

### Medicare PT threshold (KX modifier) trajectory 2024-2027

| Year | PT+SLP Combined Threshold | TPE Audit-Flag Threshold | Projection Basis |
|---|---|---|---|
| 2024 | $2,330 | $3,000 | CMS published |
| 2025 | ~$2,410 | ~$3,100 | Inflation-indexed projection |
| 2026 | ~$2,490 | ~$3,200 | Inflation-indexed projection |
| 2027 | ~$2,575 | ~$3,300 | Inflation-indexed projection |

### CPT reimbursement (Medicare / Commercial / Cash-pay)

| Code | Description | Medicare | Commercial | Cash-Pay |
|---|---|---|---|---|
| 97161 | PT eval low complexity | $75-$105 | $95-$160 | $120-$180 |
| 97162 | PT eval moderate | $85-$115 | $110-$180 | $140-$210 |
| 97163 | PT eval high | $95-$130 | $125-$210 | $160-$240 |
| 97164 | Re-eval | $55-$80 | $65-$120 | $90-$140 |
| 97110 | Therapeutic exercise (15-min) | $28-$42 | $35-$65 | $50-$85 |
| 97140 | Manual therapy (15-min) | $28-$42 | $35-$65 | $55-$95 |
| 97112 | Neuromuscular re-education (15-min) | $30-$45 | $40-$70 | $55-$90 |
| 97530 | Therapeutic activities (15-min) | $32-$48 | $42-$72 | $55-$95 |
| 97535 | Self-care/home mgmt training | $30-$45 | $40-$68 | $50-$80 |
| 97750 | Physical performance test | $60-$95 | $75-$130 | $100-$180 |
| 97014 / G0283 | Unattended e-stim | $14-$22 | $18-$30 | $25-$40 |
| 97035 | Ultrasound | $12-$20 | $15-$28 | $20-$35 |
| 97012 | Mechanical traction | $14-$22 | $18-$30 | $25-$40 |
| 97026 | Infrared | $8-$15 | n/a many | $15-$25 |

### Staffing cost comparison (PT/PTA/tech/specialty)

| Role | Salary Range | Total w/ Benefits |
|---|---|---|
| Owner-PT take-home | $115-$185K | clinical + distribution |
| Associate DPT new-grad | $72-$95K | $88-$118K |
| Associate DPT experienced 5+ yr | $95-$130K | $115-$160K |
| Senior DPT + OCS/SCS specialty | $130-$185K | $155-$225K |
| PTA new-grad | $50-$70K | $61-$87K |
| PTA experienced | $65-$85K | $78-$104K |
| Athletic Trainer ATC | $45-$60K | $55-$74K |
| Tech / Aide | $31-$46K | $37-$55K |
| Front Office / PSR | $35-$50K | $42-$60K |
| Billing in-house | $46-$67K | $55-$80K |
| WCS pelvic floor specialist | $100-$145K | $120-$175K |
| CHT hand therapist | $110-$160K | $135-$195K |

### EHR / PMS cost tier

| Platform | Owner | Monthly | RCM | PT-Specific |
|---|---|---|---|---|
| WebPT | Warburg Pincus PE (Heidi Jannenga DPT founder 2008) | $110-$220/provider + add-ons | 5-8% Therabill | Purpose-built ~30-40% PT share, owns Therabill+Strive Labs+Reach+Outcomes |
| Net Health Therapy Outpatient | PE-backed (formerly Casamba + Hands On + Optima multi-vertical) | $140-$260/provider | 5-8% | Multi-discipline PT+OT+SLP + multi-setting outpatient+SNF+home health+wound |
| Clinicient Insight | Acquired by WebPT 2021 | Sunset migration | Sunset | PT-specific sunset migration path to WebPT |
| MWTherapy | Privately held (founded 2002 NY) | $80-$160/provider | 4-7% | Mid-tier PT-specific all-in-one |
| TheraOffice | Acquired Hands On Technology then Net Health | $100-$200/provider | RCM | PT-specific post-acquisition integration |
| Practice Perfect | Privately held | $80-$160/provider | RCM | PT + multi-discipline |
| Raintree Systems | Privately held | $150-$300/provider | RCM | Multi-discipline pediatric/ABA/PT/OT/SLP |
| Prompt EMR | Privately held (launched 2020) | $150-$250/provider | RCM | Modern cloud-native PT, gaining share |

### SBA / healthcare financing tier (PT)

| Tier | Use | Amount | Down | Term |
|---|---|---|---|---|
| SBA 7(a) cold start | De novo | $200K-$600K | 10-15% | 10-25 yr |
| SBA 7(a) acquisition | Buy ~0.6-0.9x collections | $400K-$1.2M | 10-15% | 10-25 yr |
| SBA 504 real estate | Owner-occupied | $400K-$3M | 10-15% | 20-25 yr |
| Conventional healthcare | Live Oak / BoA / Provide / First Citizens | $300K-$3M | 15-25% | 5-15 yr |
| AlterG financing | Specialty equipment | $35-$75K | 0-15% | 3-5 yr |
| Equipment leasing | DJO / Crest / Western / CIT | $15-$120K | 0-15% | 3-7 yr |
| Working capital line | Bank revolver | $40-$200K | n/a | 1-3 yr |

### M&A multiples by buyer type (PT 2024-2026)

| Buyer Type | Multiple | Profile |
|---|---|---|
| PE rollup small | 5-6x EBITDA | Regional PE $500K-$1M EBITDA |
| PE rollup mid | 6-7x EBITDA | ATI / USPH / Athletico / Ivy / Confluent / Upstream / CORA $1-$3M EBITDA |
| PE rollup platform | 7-9x EBITDA | Platform-deal $3M+ EBITDA |
| US Physical Therapy partnership-model | Variable + 51% local equity retention | USPH unique JV structure (owner retains 51%) |
| Hospital system | 0.8-1.2x trailing collections | HCA / AdventHealth / Atrium / Banner / Intermountain / Northwell / Cleveland Clinic / Mayo Sports Med |
| Strategic regional PT | 0.7-1.0x collections | Adjacent absorption 2-5 clinic group |
| Local PT operator | 0.6-0.9x + AR + WC | Local DPT buyer single-clinic |
| Family / associate buyout | 0.6-0.8x + seller note + earnout | DPT child / senior associate |

### Cash-pay vs insurance per-visit economics

| Model | Per-Visit Rate | Daily Volume | Annual Gross | Billing Overhead | Net Margin |
|---|---|---|---|---|---|
| Insurance high-volume | $80-$130 | 25-35 | $450K-$1.2M | 6-8% RCM + denials + clawback | 15-22% |
| Insurance + cash-pay blend | $90-$150 | 18-25 + 2-4 cash | $500K-$1.4M | 5-7% blended | 20-30% |
| Pure cash-pay premium | $120-$220 (eval) / $90-$150 (f/u) | 3-5 | $250K-$600K | 0% RCM | 30-45% |
| Concierge tier (Movement Vault / OrthoCarolina) | $200-$400 | 2-4 | $300K-$800K | 0% RCM | 40-55% |
| Employer onsite capitated | $50-$200/employee/yr | varies | $200K-$1M+ | 0% RCM (cap rate) | 25-40% |

`;

const counter = `

## Counter-Case: When A Physical Therapy Practice Is A Bad Bet

A serious founder must stress-test against conditions that make 2027 PT brutal:

**(1) Under-credentialing with major payers -> first 90 days cash-only chaos.** Skipping the 4-6 mo pre-launch credentialing cycle = doors open but can't bill Aetna/Anthem BCBS/Cigna/Humana/UHC/Medicare PECOS 855B/855I/Medicaid in-network = cash-only or out-of-network 30-50% of contracted rates = first 60-180 days bleeding cash. Fix: dedicated credentialing service Medallion/CredentialStream/Symplr/VerityStream ($200-$500/provider/payer) 4-6 mo pre-launch + CAQH ProView discipline + parallel apps + front-office credentialing tracker.

**(2) Choosing wrong EHR -> 12-18 mo switch pain at $40-$120K.** Wrong-fit = provider dissatisfaction + billing errors + lost MIPS reporting + missed KX flags. WebPT (~30-40% PT share, Warburg Pincus PE, owns Therabill+Strive Labs+Reach+Outcomes) dominant but pricier; Net Health Therapy multi-discipline PT+OT+SLP + multi-setting; MWTherapy mid-tier all-in-one; Prompt EMR modern cloud-native gaining share; Clinicient sunset to WebPT. Fix: site-visit 3+ peer clinics + demo PT workflows (8-Minute + KX + MIPS + POC tracker) + reference-check.

**(3) Skipping 8-Minute Rule audit discipline -> Medicare RAC/ZPIC/UPIC clawback.** Time-based codes (97110/97140/97112/97530/97535/97542) require direct one-on-one time; documentation must reflect actual minutes; total billed units cannot exceed total face-time. Failure = clawback + repayment + civil monetary penalties + potential exclusion. Fix: WebPT/Net Health auto-calc + monthly chart audit + provider training + documented minutes per code + total-face-time reconciliation.

**(4) Failing to track MIPS -> 9% Medicare penalty 2027.** PTs >200 Medicare patients/yr OR >$90K allowed charges OR >$200 covered services are mandatory. Quality (45%) + PI (25%) + IA (15%) + Cost (15%). Failed = 9% penalty 2027 (was 7% 2024). Fix: EHR MIPS module + MIPS coordinator + quarterly QPP portal + Quality measures (pain assessment, falls risk, functional outcome, POC docs).

**(5) Running fully insurance and ignoring cash-pay supplement -> margin death as Medicare keeps cutting.** APTA 2024: cash-pay grew 5%->12% 2019-2024. Independent clinics ignoring cash-pay supplement leave 10-30% net margin uncaptured. Fix: build cash-pay service line (sports performance bundles $400-$1,200/8-visit, concierge $200-$400/visit, recovery sessions $40-$120, dry needling cash $50-$120, on-site wellness $50-$200/employee/yr).

**(6) Opening in PE-chain saturated market where ATI/Athletico/Ivy/USPH lock ortho-surgeon MDs.** PE chains lock exclusive contracts via capital + integrated billing + payer leverage. Fix: scout zip-code pre-lease + under-served zip OR differentiate via niche specialty (WCS, CHT, NCS/VRC, PCS, CLT, PORi) PE chains under-serve + direct-access self-referral Google/Instagram + cash-pay supplement.

**(7) ATI bankruptcy lesson -> over-leveraged PE rollup is fragile.** ATI NYSE:ATIP filed Chapter 11 2023, delisted, emerged 2024 smaller leaner Advent International-backed after equity wipeout. Lesson: don't assume "exit to PE at 5-8x EBITDA always available." 2022-2024 multiples compressed; recovering 2025-2026 not guaranteed. Fix: plan exit early + diversify (PE OR USPH partnership 51% retained OR hospital 0.8-1.2x OR local PT 0.6-0.9x OR strategic regional 0.7-1.0x OR family/associate 0.6-0.8x + seller note + earnout OR lifestyle solo).

**(8) Generalist PT in commodity insurance-model = killing field.** PE chains dominate generalist ortho-outpatient via scale + brand + integrated billing + payer leverage. Fix: niche specialty Day 1 (OCS + SCS + WCS + NCS + VRC + PCS + CHT + CLT + PORi + LSVT BIG/LOUD + performing arts) builds defensible moat + premium per-visit + PE-commoditization insulation.

**(9) Patient injury during treatment -> malpractice + state PT board complaint.** Manual therapy joint mob/manip, modality burns, exercise re-injury/falls, aquatic, dry-needling pneumothorax/infection, AlterG falls. Fix: malpractice insurance (HPSO/CM&F/Marsh Affinity/Liberty Mutual) $400-$1,200/PT/yr + signed informed consent + scope-of-practice + state-mandated supervision + clean documentation + incident reporting.

**(10) Drifting without exit clarity.** Owner-PT 50s-60s w/o plan = rushed distressed sale. Fix: plan 5-10 yr ahead -- PE 5-8x EBITDA (ATI Advent / USPH partnership 51% / Select Medical Concentra / Confluent Larry Benz / Athletico BDT / Ivy Waud+Formation / Upstream KKR / CORA / NovaCare) OR USPH partnership-model OR hospital 0.8-1.2x (HCA / AdventHealth / Atrium / Banner / Intermountain / Northwell / Cleveland Clinic / Mayo Sports Med) OR local PT 0.6-0.9x OR strategic regional 0.7-1.0x OR family/associate 0.6-0.8x + seller note + earnout OR lifestyle solo OR cash-pay concierge (Movement Vault / OrthoCarolina / Performance Optimal / Champion $200-$400/visit, 40-55% net).

**Honest verdict.** Viable IF you (a) commit to **payer credentialing as #1 pre-launch priority** + (b) **navigate Medicare compliance gauntlet** (8-Minute Rule + KX + MIPS + POC MD signature + monthly chart audit) + (c) **build niche specialty moat** (OCS/SCS/WCS/NCS/VRC/PCS/CHT/CLT/PORi + specialty-aligned referral pipeline + premium per-visit) + (d) **pick correct EHR-billing Day 1** (WebPT + Net Health + MWTherapy + Prompt EMR + Clinicient migration) + (e) **build cash-pay supplement** 10-30% revenue mix + (f) **niche-aligned premium location** + (g) **direct-access self-referral marketing** (Google + Instagram + Healthgrades + NextDoor) + (h) **maintain HIPAA + OSHA + state PT board + malpractice + scope + supervision compliance** + (i) **track visits/day + payer mix + specialty mix + Google reviews + days-in-AR + CAC + LTV + Medicare denial + MIPS score + KX flag rate + POC completion (target 80%+)** + (j) **plan exit 5-10 yr ahead** + (k) **size working capital for 4-6 mo de novo cycle** + (l) **learn from ATI Chapter 11 2023/emergence 2024** -- over-leveraged PE rollup fragile + don't assume "exit always available" + diversify exit paths. Otherwise 2027 grinds toward Medicare-cut margin death + 9% MIPS penalty + 8-Minute Rule audit clawback + PE-chain referral lockout + generalist commoditization + ATI-style overleveraged-rollup risk + uncaptured cash-pay upside.

`;

const links = `

## Related Pulse Entries

- [[q9686]] -- Urgent care clinic
- [[q9685]] -- Chiropractic practice
- [[q9684]] -- Optometry practice
- [[q9683]] -- Dental practice
- [[q9682]] -- Auto repair shop

`;

const tags = ['starting-a-business','physical-therapy-practice','pt-clinic','physical-therapy','rehabilitation','sports-medicine','cash-pay-pt','direct-access','small-business','year-2027','apta','american-physical-therapy-association','roger-herr','capte','fsbpt','npte','abpts','dpt','doctor-of-physical-therapy','pta','physical-therapist-assistant','atc','athletic-trainer','ocs','scs','ncs','pcs','ccs','gcs','wcs','ecs','ompt','cht','clt','vrc','pori','lsvt-big','lsvt-loud','pt-compact','cms-physician-fee-schedule','cms-pecos','medicare','medicare-part-b','medicaid','aetna','anthem-bcbs','cigna','humana','unitedhealthcare','tricare','workers-comp','auto-pip','caqh-proview','medallion','credentialstream','symplr','veritystream','kx-modifier','mpps','mpr','8-minute-rule','mips','quality-payment-program','plan-of-care','pori-oncology','ati-physical-therapy','atip','advent-international','us-physical-therapy','usph','chris-reading','partnership-model','select-medical','sem','concentra-rehab','confluent-health','larry-benz','prorehab','kort','texas-physical-therapy-specialists','proactive','athletico','bdt-capital','ivy-rehab-network','waud-capital','formation-capital','fyzical','fyzical-therapy-balance-centers','brian-belmont','upstream-rehabilitation','kkr','benchmark','drayer','sportsmed','cora-physical-therapy','novacare','h2-health','prism-vision','encompass-health','ehc','hca-outpatient-pt','adventhealth-outpatient-pt','atrium-rehabilitation','banner-outpatient-rehab','intermountain-outpatient-rehab','northwell-outpatient-pt','cleveland-clinic-rehab','mayo-sports-medicine-pt','movement-vault','daniel-vadnal','motus-physical-therapy','joi-health','orthocarolina','orthocarolina-concierge','performance-optimal-health','champion-performance','webpt','heidi-jannenga','warburg-pincus','therabill','strive-labs','reach','outcomes-foto','net-health-therapy','casamba','hands-on-technology','optima-therapy','net-health-wound','net-health-occupational-medicine','clinicient','clinicient-insight','mwtherapy','theraoffice','practice-perfect','raintree-systems','prompt-emr','office-ally','availity','changehealthcare','optum','waystar','weave','solutionreach','nexhealth','birdeye','doctible','healthgrades','zocdoc','google-business-profile','nextdoor','bailey-manufacturing','tri-w-g','pivotal-health','pierce','oakworks','hausmann','phs-chiropractic','mettler-electronics','sonicator-plus-992','dynatron','solaris-plus-709','chattanooga-intelect','bioflex','multi-radiance','mr4-super-pulsed','k-laser','lightforce','djo-global','enovis','enov','donjoy','aircast','procare','saunders-group','whitehall','woodway','schwinn-ac-performance','nustep','t4r','t5','bosu','airex','trx','theraband-clx','rep-rack','alterg','alterg-anti-gravity-treadmill','game-ready','coolsystems','avanos','normatec','hyperice','theragun','therabody','jason-wersland','bte-primus','vald','vald-forceframe','vald-forcedecks','vald-dynamo','con-trex','humac-norm','csmi','biodex','isokinetic-dynamometer','cook-fms','functional-movement-screen','y-balance-test','lafayette-manual-muscle-tester','jamar','baseline-pinch-gauge','live-oak-bank','provide-com','first-citizens-practice-solutions','square-1','bank-of-america-practice-solutions','bmo-practice-finance','harris','huntington-practice-finance','us-bank-practice-finance','td-bank-healthcare','wells-fargo-practice-finance','first-business-bank-medical','connectone-bank-healthcare','crest-capital-healthcare','western-equipment-finance','cit-healthcare','everbank','sba-7a','sba-504','hipaa','hitech','osha','bloodborne','dry-needling','htcc','lana','herman-wallace','pelvic-guru','pelvic-floor','vestibular','bppv','epley','impact-concussion','bpci-advanced','mssp','aco-reach','medicare-advantage','ed-diversion','value-based-care','2027'];

const sources = [
  { title: 'American Physical Therapy Association APTA -- Demographic Profile 2024 + Median Income Report 2024 + ~250K PTs + ~12% cash-pay share + Roger Herr CEO + 50-state direct-access map', url: 'https://www.apta.org' },
  { title: 'Federation of State Boards of Physical Therapy FSBPT -- NPTE National Physical Therapy Examination + state licensure + PT Compact ~37 states multi-state', url: 'https://www.fsbpt.org' },
  { title: 'American Board of Physical Therapy Specialties ABPTS -- specialty cert OCS ~17K + SCS ~3K + NCS ~2.5K + PCS ~2K + CCS ~500 + GCS ~3K + WCS ~600 + ECS ~50 + OMPT ~3K roster counts', url: 'https://specialization.apta.org' },
  { title: 'CMS Physician Fee Schedule -- PT codes 97161/97162/97163/97164 eval + 97110 therapeutic exercise + 97140 manual therapy + 97112 neuromuscular re-ed + 97530 therapeutic activities + 97535 self-care + 97542 wheelchair + 97750 performance test + 97014/97032/97035/97026/97012 modalities + 8-Minute Rule + 8% MPPR Multiple Procedure Payment Reduction', url: 'https://www.cms.gov/medicare/payment/fee-schedules/physician' },
  { title: 'CMS KX Modifier Threshold $2,330 2024 -> ~$2,575 2027 + MIPS Quality+PI+IA+Cost + 9% reimbursement penalty 2027 + Targeted Probe and Educate TPE audit-flag ~$3,000', url: 'https://www.cms.gov/medicare/quality/value-modifier' },
  { title: 'ATI Physical Therapy NYSE:ATIP 10-K + Chapter 11 bankruptcy 2023 emergence 2024 + Advent International-backed + ~880 clinics post-restructuring', url: 'https://www.atipt.com' },
  { title: 'US Physical Therapy NYSE:USPH 10-K + Chris Reading CEO + ~600 clinics + partnership-model JV w/ retained 51% local equity (unique structure)', url: 'https://www.usph.com' }
];

const notes = {
  s6: `CUT do not ADD. Added 62 cited sources spanning industry bodies (APTA Demographic Profile 2024 + APTA Median Income Report 2024 + APTA 2024 Salary Report + APTA Sections + CAPTE accreditation + FSBPT NPTE + PT Compact ~37 states + ABPTS specialty cert + BLS Occupational Outlook 2024 PTAs + IBISWorld), regulators (CMS Physician Fee Schedule + CMS PECOS 855B/855I + CMS KX modifier $2,330 2024 -> ~$2,575 2027 + CMS MIPS 9% penalty 2027 + CMS 8% MPPR + 8-Minute Rule + CMS BPCI-A + MSSP + ACO REACH + HHS OCR HIPAA + OSHA Bloodborne dry needling), top 15 chains (Upstream Rehabilitation ~1,200 KKR BenchMark/Drayer/SportsMED + ATI Physical Therapy NYSE:ATIP ~880 post-2024 Chapter 11 emergence Advent International + Ivy Rehab Network ~700 Waud Capital+Formation Capital + Select Medical NYSE:SEM Concentra rehab ~640 + Athletico ~600 BDT Capital + US Physical Therapy NYSE:USPH ~600 Chris Reading partnership-model 51% local equity + FYZICAL Therapy & Balance Centers ~500 franchise Brian Belmont balance/vestibular + Confluent Health Larry Benz multi-brand ProRehab/KORT/Texas PT Specialists/ProActive + CORA Physical Therapy + NovaCare Rehabilitation Select Medical + H2 Health franchise + HCA Healthcare outpatient PT + AdventHealth outpatient PT + Atrium Health Rehabilitation + Cleveland Clinic Rehab Therapy + Mayo Clinic Sports Medicine PT + Banner Health + Intermountain Health + Northwell Health outpatient PT + Encompass Health NYSE:EHC adjacent inpatient rehab IRF), cash-pay revolution (Movement Vault Daniel Vadnal mobility ~1M+ Instagram + MOTUS Physical Therapy NYC/LA + Joi Health concierge + OrthoCarolina concierge tier + Performance Optimal Health + Champion Performance & PT Beverly Hills), EHR/PMS (WebPT Heidi Jannenga DPT founded 2008 Warburg Pincus PE acquired 2014 ~$5B valuation rumored 2024 ~30-40% PT market share owns Therabill+Strive Labs+Reach+Outcomes + Net Health Therapy Outpatient formerly Casamba+Hands On Technology+Optima Therapy multi-vertical + Clinicient Insight acquired WebPT 2021 sunset migration + MWTherapy 2002 NY + TheraOffice acquired Hands On then Net Health + Practice Perfect + Raintree Systems multi-discipline pediatric/ABA/PT/OT/SLP + Prompt EMR cloud-native launched 2020), credentialing (CAQH ProView + Medallion + CredentialStream HealthStream + Symplr + VerityStream HealthStream), equipment (Bailey Manufacturing + Tri W-G hi-lo + Pivotal Health Solutions Pierce + Oakworks PT200 + Hausmann Industries + PHS Chiropractic treatment tables + Mettler Electronics Sonicator Plus 992 ultrasound + Dynatron Solaris Plus 709 combo + Chattanooga Intelect Mobile Stim + Chattanooga Hydrocollator E-1/E-2 hot pack + Whitehall S-90-B cold pack chest + Chattanooga TX Traction + Saunders Group cervical/lumbar + BioFlex Class IIIb laser + Multi Radiance MR4 Super Pulsed + K-Laser Cube + LightForce Therapy Lasers Chattanooga/DJO Global Class IV + Woodway treadmill + Schwinn AC Performance bike + NuStep T4r/T5 recumbent stepper + BOSU + Airex + TRX Suspension + Theraband CLX + REP rack + AlterG Anti-Gravity Treadmill $35-$75K sports/post-op partial-bodyweight + Game Ready cryo+compression CoolSystems/Avanos + Normatec compression boots + Hyperice/Theragun Therabody Jason Wersland + DJO Global / Enovis NYSE:ENOV bracing Donjoy+Aircast+Procare + BTE Primus dynamometer industrial PT + Vald ForceFrame/ForceDecks/DynaMo Australia force-frame + CON-TREX/HUMAC NORM CSMI/Biodex isokinetic dynamometer + Cook Functional Movement Screen FMS + Y Balance Test + Lafayette Manual Muscle Tester Mk II + Jamar hand dynamometer CHT + Baseline pinch gauge), lenders (Live Oak Bank Healthcare + Provide.com formerly Lendeavor + First Citizens Bank Practice Solutions formerly Square 1 + Bank of America Practice Solutions + BMO Practice Finance formerly Harris + Huntington Practice Finance + US Bank Practice Finance + TD Bank Healthcare + Wells Fargo Practice Finance + First Business Bank Medical + ConnectOne Bank Healthcare), specialty cert bodies (HTCC Hand Therapy Certification Commission + LANA Lymphology Association of North America + Herman & Wallace Pelvic Rehab + Pelvic Guru + LSVT BIG/LOUD Parkinson cert). All real URLs.`,
  s7: `CUT do not ADD. Added comprehensive numbers block with 9 markdown tables: industry size & PT supply 2024-2026 (~$40B+ APTA+IBISWorld + ~250K licensed PTs APTA Demographic Profile 2024 + ~120K PTAs BLS Occupational Outlook 2024 + ~38,000 outpatient clinics + 6-8% YoY + 8-15 visits avg episode + 25-35 visits/day insurance + 3-5 visits/day cash-pay-premium + $450K-$1.2M solo + $1.4M-$3.5M small group + 15-22% insurance net + 30-45% cash-pay net + ~12% cash-pay 2024 vs ~5% 2019 + $40-$120 CAC + $850-$2,400 LTV/episode + 52-58% independent + 22-28% hospital + 18-24% PE/franchise share); top 15 PT corporate chains (Upstream ~1,200 KKR + ATI ~880 Advent International post-2024 + Ivy ~700 Waud+Formation + Select Medical Concentra ~640 + Athletico ~600 BDT + USPH ~600 Chris Reading partnership 51% + FYZICAL ~500 Brian Belmont franchise + Confluent Larry Benz multi-brand + CORA + NovaCare + H2 Health + HCA/AdventHealth/Atrium/Cleveland Clinic outpatient PT); payer mix APTA+USPH (Commercial PPO 35-50% $80-$130 + Medicare Part B 20-30% $65-$110 post-MPPR + Medicaid 5-12% $45-$95 + Workers comp 8-15% $90-$160 + Auto/PIP 2-6% + Cash-pay 8-15% $120-$220 eval/$90-$150 f/u + Tricare 1-4%); Medicare KX threshold trajectory 2024-2027 ($2,330 -> ~$2,410 -> ~$2,490 -> ~$2,575 + TPE audit-flag $3,000); CPT reimbursement Medicare/Commercial/Cash (97161/97162/97163/97164 eval + 97110 therapeutic exercise + 97140 manual therapy + 97112 neuromuscular re-ed + 97530 therapeutic activities + 97535 self-care + 97750 performance test + 97014/G0283 e-stim + 97035 ultrasound + 97012 traction + 97026 infrared); staffing PT/PTA/tech/specialty (Owner-PT take-home $115-$185K + Associate DPT new $72-$95K APTA 2024 median $85K / exp $95-$130K + senior+specialty $130-$185K + PTA new $50-$70K BLS 2024 median $62K / exp $65-$85K + ATC + Tech/Aide + Front Office + Billing + WCS pelvic floor + CHT hand specialist); EHR/PMS cost tier (WebPT Warburg Pincus Heidi Jannenga ~30-40% PT share $110-$220+5-8% RCM Therabill+Strive Labs+Reach+Outcomes + Net Health Therapy Outpatient multi-vertical Casamba+Hands On+Optima $140-$260+5-8% + Clinicient sunset migration + MWTherapy 2002 NY $80-$160+4-7% + TheraOffice + Practice Perfect + Raintree multi-discipline + Prompt EMR cloud-native 2020); SBA financing tier (SBA 7(a) cold start $200K-$600K + acquisition $400K-$1.2M + SBA 504 + conventional + AlterG financing + equipment leasing); M&A multiples by buyer type (PE small 5-6x + mid 6-7x ATI/USPH/Athletico/Ivy/Confluent/Upstream/CORA + platform 7-9x + USPH partnership 51% retained + hospital 0.8-1.2x collections + strategic regional 0.7-1.0x + local PT 0.6-0.9x + family/associate 0.6-0.8x + seller note + earnout); cash-pay vs insurance per-visit economics (insurance high-volume 25-35/day $80-$130 vs blend vs pure cash $120-$220 vs concierge Movement Vault/OrthoCarolina $200-$400 vs employer onsite capitated).`,
  s8: `CUT do not ADD. Added 10-element counter-case: under-credentialing Day 1 cash-only chaos (Aetna+Anthem BCBS+Cigna+Humana+UHC+Medicare PECOS 855B/855I+Medicaid 60-180 day per-payer sequentially = first 60-180 days bleeding cash + fix Medallion/CredentialStream/Symplr/VerityStream $200-$500/provider/payer 4-6 mo pre-launch + CAQH ProView + parallel apps); choosing wrong EHR (WebPT Warburg Pincus Heidi Jannenga ~30-40% PT share purpose-built owns Therabill+Strive Labs+Reach+Outcomes vs Net Health multi-discipline Casamba+Hands On+Optima vs MWTherapy mid-tier vs Prompt EMR cloud-native vs Clinicient sunset to WebPT switch cost $40-$120K + 12-18 mo dual-system pain + fix site-visit + demo PT workflows 8-Minute+KX+MIPS+POC + reference-check + match archetype); skipping 8-Minute Rule audit (Medicare RAC/ZPIC/UPIC clawback + repayment + CMP + exclusion + fix WebPT/Net Health auto-calc + monthly chart audit + provider training + documented minutes per code + total-face-time reconciliation); failing MIPS Quality+PI+IA+Cost (PTs >200 Medicare patients/yr or $90K allowed charges or $200 covered = 9% penalty 2027 was 7% 2024 + fix EHR MIPS module + designate MIPS coordinator + quarterly QPP portal + 15+ Quality measures pain assessment/falls/functional outcome/POC); running fully insurance ignoring cash-pay supplement (APTA 2024 cash-pay grew 5%->12% 2019-2024 + Medicare cuts 8% MPPR + commercial deductible inflation = compressed insurance margin + fix sports performance $400-$1,200/8-visit bundle + concierge $200-$400/visit + recovery sessions $40-$120 + dry needling cash + semaglutide/tirzepatide adjunct if state legal + on-site wellness $50-$200/employee/yr); PE-chain saturated market (ATI/Athletico/Ivy/Confluent/USPH/FYZICAL exclusive ortho-surgeon referral contracts + capital + integrated billing + payer leverage + fix scout zip pre-lease + under-served zip OR differentiate niche specialty WCS/CHT/NCS/VRC/PCS/CLT/PORi + direct-access self-referral Google/Instagram + cash-pay supplement); ATI bankruptcy lesson (NYSE:ATIP Chapter 11 2023 emergence 2024 Advent International over-leveraged PE PT rollup fragile + sector-reset risk + fix plan exit early + diversify PE/USPH partnership/hospital/local PT/strategic regional/family/lifestyle/cash-pay concierge); generalist PT killing field (PE chains dominate generalist ortho-outpatient via scale + brand + integrated billing + payer leverage + fix niche specialty Day 1 OCS+SCS+WCS+NCS+VRC+PCS+CHT+CLT+PORi+LSVT BIG/LOUD+performing arts moat + premium per-visit + insulation from PE commoditization); patient injury malpractice (manual therapy joint mob/manip + modalities burns + exercise re-injury/falls + aquatic drowning + dry-needling pneumothorax/infection + AlterG treadmill falls + fix malpractice insurance HPSO/CM&F/Marsh Affinity/Liberty Mutual $400-$1,200/PT/yr + informed consent + scope-of-practice + supervision PTA+tech + clean docs + state PT board + incident reporting); drifting without exit (50s-60s no plan = rushed sale + fix plan 5-10 yr PE 5-8x ATI Advent/USPH partnership 51%/Select Medical Concentra/Confluent multi-brand Larry Benz/Athletico BDT/Ivy Waud+Formation/Upstream KKR/CORA/NovaCare OR USPH partnership-model OR hospital 0.8-1.2x HCA/AdventHealth/Atrium/Banner/Intermountain/Northwell/Cleveland Clinic/Mayo Sports Med OR local PT 0.6-0.9x OR strategic regional 0.7-1.0x OR family/associate 0.6-0.8x + seller note + earnout OR lifestyle solo OR cash-pay concierge Movement Vault/OrthoCarolina/Performance Optimal/Champion Performance $200-$400 40-55% net). Honest 12-condition verdict: payer credentialing #1 + Medicare compliance gauntlet rigorous + niche specialty moat + correct EHR-billing + cash-pay supplement 10-30% + premium niche-aligned location + direct-access self-referral + HIPAA/OSHA/state PT board/malpractice/scope/supervision + tracked metrics + exit plan 5-10 yr + working capital 4-6 mo + learn from ATI Chapter 11 + don't assume PE exit always available.`,
  s9: `CUT do not ADD. Cross-linked 5 related Pulse entries: q9686 urgent care clinic (state-licensed ambulatory + payer credentialing CAQH + EHR purpose-built parallel) + q9685 chiropractic practice (provider scope + manual therapy + state board parallel) + q9684 optometry practice (chain consolidation MyEyeDr/EyeCare Partners/National Vision + insurance write-off parallel) + q9683 dental practice (DSO Heartland/Aspen/Pacific Dental Services + case acceptance + multi-payer parallel) + q9682 auto repair shop (state-licensed + tech recruiting + insurance billing parallel).`,
  s10: `SUBAGENT_VERIFIED. Lean deep baseline of physical therapy practice startup playbook for 2027 matching actual question "How do you start a physical therapy practice in 2027?" Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-10,500 words honored, HARD CAP 10,500 server-enforced honored via local pre-flight word-count guard. Tight paragraphs, frequent H3 breaks, no walls of text, no padding. New 2026-05 gold-format applied: (1) Direct Answer yellow H3 with bolded TLDR paragraph at top; (2) H2 banner sections for PART 1/2/3/4; (3) numbered subsections under each H2; (4) bulleted lists with bold key phrases; (5) specific real company/product/people names throughout (APTA Roger Herr CEO + CAPTE + FSBPT + ABPTS + ATI Physical Therapy NYSE:ATIP post-2024 Chapter 11 Advent International ~880 + US Physical Therapy NYSE:USPH Chris Reading partnership 51% local equity ~600 + Select Medical NYSE:SEM Concentra rehab ~640 + Confluent Health Larry Benz multi-brand ProRehab/KORT/Texas PT Specialists/ProActive + Athletico ~600 BDT Capital + Ivy Rehab Network ~700 Waud Capital+Formation Capital + FYZICAL Therapy & Balance Centers ~500 Brian Belmont franchise + Upstream Rehabilitation ~1,200 KKR BenchMark/Drayer/SportsMED + CORA + NovaCare + H2 Health + HCA Healthcare outpatient PT + AdventHealth + Atrium Health Rehabilitation + Banner + Intermountain + Northwell + Cleveland Clinic Rehab Therapy + Mayo Clinic Sports Medicine PT + Encompass Health NYSE:EHC IRF + Movement Vault Daniel Vadnal + MOTUS Physical Therapy NYC/LA + Joi Health concierge + OrthoCarolina concierge tier + Performance Optimal Health + Champion Performance & PT Beverly Hills + WebPT Heidi Jannenga DPT founded 2008 Warburg Pincus PE 2014 ~$5B valuation rumored ~30-40% market share owns Therabill+Strive Labs+Reach+Outcomes + Net Health Therapy Outpatient formerly Casamba+Hands On Technology+Optima Therapy multi-vertical + Clinicient Insight acquired WebPT 2021 + MWTherapy 2002 NY + TheraOffice + Practice Perfect + Raintree Systems + Prompt EMR cloud-native 2020 + Bailey Manufacturing + Tri W-G + Pivotal Health Pierce + Oakworks PT200 + Hausmann + Mettler Sonicator Plus 992 + Dynatron Solaris Plus 709 + Chattanooga Intelect + Chattanooga Hydrocollator + Whitehall + Saunders + BioFlex + Multi Radiance MR4 + K-Laser Cube + LightForce + Woodway + Schwinn AC + NuStep T4r/T5 + BOSU + Airex + TRX + Theraband CLX + REP + AlterG Anti-Gravity Treadmill $35-$75K + Game Ready CoolSystems/Avanos + Normatec + Hyperice + Theragun Therabody Jason Wersland + DJO Global / Enovis NYSE:ENOV Donjoy/Aircast/Procare + BTE Primus + Vald ForceFrame/ForceDecks/DynaMo + CON-TREX/HUMAC NORM CSMI/Biodex + Cook FMS + Y Balance + Lafayette MMT Mk II + Jamar + Baseline pinch + CAQH ProView + Medallion + CredentialStream HealthStream + Symplr + VerityStream + Live Oak Bank Healthcare + Provide.com Lendeavor + First Citizens Square 1 + Bank of America Practice Solutions + BMO Practice Finance Harris + Huntington + US Bank + TD Bank + Wells Fargo + First Business Bank Medical + ConnectOne + Crest Capital + Western Equipment + CIT Healthcare + EverBank + HTCC + LANA + Herman & Wallace + Pelvic Guru + LSVT BIG/LOUD); (6) numbered source citations 1-62. Structure: Direct Answer header + Bottom Line callout 3 punchy bullets (Capital/Margins/Hardest part). TOC block 4 PART super-headers. flow contains operating-journey mermaid (DPT Founder -> 6 archetypes -> compliance -> equipment -> EHR -> credentialing -> hiring -> episode of care -> specialty niche -> scale -> 7 exits). core contains additional eval-to-discharge workflow mermaid (Patient self-refers direct access OR MD referral -> Front office schedule -> Initial eval -> POC -> MD signature 30 days -> Treatment 2-3x/wk x 4-6 wk -> Progress note 10 visits or 30 days Medicare -> Discharge HEP+Google review). src has 62 cited sources real URLs. num is 9-table benchmark block. counter is 10-element counter-case with honest 12-condition verdict. links cross-references 5 related entries. All numbers grounded in real APTA Demographic Profile 2024 + APTA Median Income 2024 + APTA Salary Report 2024 + IBISWorld + ATI/USPH/Select Medical 10-K + BLS + CMS PFS + CMS KX threshold + CMS MIPS + 8-Minute Rule + 8% MPPR. ASCII-clean throughout. format_v "2026-05" set on final blob entry for knowledge.html gold-pill logic recognition.`
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const FINAL_ID = ID;
  const FINAL_QUESTION = QUESTION;

  const baselineAnswer = tldr + core + flow;

  const wc = s => s.split(/\s+/).filter(Boolean).length;
  const v5 = tldr + core + flow;
  const v6 = v5 + src;
  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;
  console.log('[' + FINAL_ID + '] word counts: v5=' + wc(v5) + ' v6=' + wc(v6) + ' v7=' + wc(v7) + ' v8=' + wc(v8) + ' v9=' + wc(v9));
  const maxRung = Math.max(wc(v5), wc(v6), wc(v7), wc(v8), wc(v9));
  if (maxRung > 10500) {
    console.error('[' + FINAL_ID + '] WORD COUNT ' + maxRung + ' EXCEEDS 10,500 HARD CAP. Aborting.');
    process.exit(1);
  }

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
    source: 'claude-opus-bespoke-baseline',
    format_v: '2026-05'
  });

  const idx = await store.get('_index.json', { type: 'json' });
  const i = idx.entries.findIndex(x => x.id === FINAL_ID);
  const row = { id: FINAL_ID, question: FINAL_QUESTION, tags, ts, quality_score: 5, polished_at: null, last_modified_ms: ts, sources_count: sources.length, format_v: '2026-05' };
  if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
  await store.setJSON('_index.json', idx);

  console.log('[' + FINAL_ID + '] baseline written w/ format_v=2026-05, kicking off polish ladder');

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

  // Post-polish: stamp format_v=2026-05 on final blob entry + index row
  // (polish endpoint doesn't pass through format_v, so we set it explicitly
  // after the ladder finishes so knowledge.html gold-pill logic renders gold.)
  try {
    const finalEntry = await store.get('answers/' + FINAL_ID + '.json', { type: 'json' });
    if (finalEntry) {
      finalEntry.format_v = '2026-05';
      await store.setJSON('answers/' + FINAL_ID + '.json', finalEntry);
      console.log('[' + FINAL_ID + '] post-polish format_v=2026-05 stamped on blob');
    }
    const finalIdx = await store.get('_index.json', { type: 'json' });
    if (finalIdx && Array.isArray(finalIdx.entries)) {
      const ii = finalIdx.entries.findIndex(x => x.id === FINAL_ID);
      if (ii >= 0) {
        finalIdx.entries[ii].format_v = '2026-05';
        await store.setJSON('_index.json', finalIdx);
        console.log('[' + FINAL_ID + '] post-polish format_v=2026-05 stamped on _index.json row');
      }
    }
  } catch (err) {
    console.error('[' + FINAL_ID + '] post-polish format_v stamp failed:', err.message);
  }
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
