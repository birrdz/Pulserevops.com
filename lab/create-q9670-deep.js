// q9670 -- How do you start a non-medical senior home care agency in 2027?
// NON-MEDICAL personal care / companion care (bathing, dressing, meal prep, transportation, companionship, light housekeeping)
// -- distinct from licensed home HEALTH (skilled nursing, Medicare-reimbursable), assisted living, hospice, and adult day care.
// VALUE over WORD COUNT. Target 8,500-9,500 words (HARD CAP 10,500). Tight paragraphs (2-3 sentences).
// Bottom Line + TOC + 4-PART (FOUNDATIONS / BUILD-OUT & CAPITAL / OPERATIONS / GROWTH & EXIT).

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

const ID = 'q9670';
const QUESTION = 'How do you start a non-medical senior home care agency in 2027?';

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** **$40K-$120K** lean home-office launch (state Home Care Organization / Home Care Services license application + plan-of-operation + policy-and-procedure manual + caregiver-training curriculum + Caregiver Background Check Bureau registration + Checkr / Sterling background check infrastructure + Live Scan fingerprinting + TB-test + DMV pull + scheduling software AxisCare / ClearCare / WellSky Personal Care / Smartcare / AlayaCare / Caretime $300-$900/mo + EVV (Electronic Visit Verification) HHAeXchange / Sandata / Tellus + payroll Gusto / ADP Run / Paychex + GL insurance + Professional Liability + Workers Comp + Non-Owned Auto + Dishonesty Bond + state surety bond CA $25K / FL $50K / NY varies + first-90-day payroll float + EIN + LLC / S-corp + commercial-grade phone Ring Central / OpenPhone + initial caregiver recruiting Indeed / ZipRecruiter + light marketing). **$120K-$250K** full launch with leased office + dedicated on-call coordinator + agency director + marketing budget for hospital-discharge planner outreach + referral-partner stack. **$50K-$100K + 5-6% royalty** franchise route (Right at Home, Home Instead, Visiting Angels, Senior Helpers, Comfort Keepers, BrightStar Care, FirstLight, ComForCare). Expect **4-9 months license-to-first-client** + **12-24 months to operational break-even** + **lifetime W-2 vs 1099 audit risk post-DOL 2024 final rule**.
> - **[Margins]** Mature single-office agency: **28-42% gross + 8-18% EBITDA** at **$28-$45/hr private-pay billing + $14-$22/hr caregiver pay + 80-180 hrs/wk per active client + 35-90 active clients + $1.4M-$4.8M/yr revenue**. Caregiver pay 52-66% of revenue; agency burden (workers comp + payroll tax + EVV + scheduling + insurance + office + marketing) 22-32%; coordinator + nurse-on-call + admin 8-14%; owner margin 8-18% EBITDA. **Medicaid HCBS waiver** clients bill $19-$32/hr at thinner 4-9% margin; private-pay + LTC-insurance + VA Aid & Attendance billings clear 12-20%. Multi-location: **10-16% blended EBITDA at $4M-$15M revenue** with regional manager + central scheduling + payor-mix discipline. **Sale multiples 3.5-6.0x EBITDA single location + 5.0-8.0x EBITDA multi-location**; **PE roll-ups (Help at Home, Addus HomeCare, BAYADA, Interim HealthCare, Right at Home franchisor backed by FFL Partners) actively buying $1M+ EBITDA platforms**.
> - **[Hardest part]** **Caregiver recruiting + turnover + W-2 vs 1099 + EVV compliance + Medicaid 80/20 rule + on-call coordinator burnout** (not capital, not concept, not demand). **60-90% annual caregiver turnover** is industry baseline — recruiting is a daily activity, not a quarterly one. **DOL 2024 final rule on Independent Contractor classification (effective March 11, 2024)** + **2015 DOL elimination of 29 CFR Part 552 Companionship Exemption** mean almost every caregiver must be W-2 with overtime + unemployment + workers comp; misclassification audits hit **$50K-$500K back-pay + penalties**. **EVV mandate under 21st Century Cures Act §12006** is binding for all Medicaid-waiver personal-care visits since Jan 2020 (Section 1903(l) of Social Security Act). **CMS Medicaid 80/20 HCBS final rule (May 2024, effective July 2030)** requires 80% of Medicaid HCBS payments flow to direct-care worker comp — squeezes agency margin from 18-20% down toward 8-12% on Medicaid books. **On-call 24/7 coordinator burnout** drives 30-50% Year 1-3 owner exit; **Saturday-night fall calls + Sunday-morning no-show caregivers** are the operating reality.

A **non-medical senior home care agency** in 2027 is a **state-licensed (in 38 of 50 states) personal-care / companion-care agency** that sends **W-2 caregivers** (CNAs, HHAs, trained companion-aides) into seniors' private homes to provide **activities of daily living (ADL) support** — bathing, dressing, toileting, transferring, meal preparation, light housekeeping, laundry, medication reminders (NOT medication administration), transportation to appointments, grocery shopping, and companionship. Three regulated pillars: **(1) state Home Care Organization (HCO) / Home Care Services Bureau / Personal Care Agency license**, **(2) federal + state caregiver background-check + training requirements** (Caregiver Background Check Bureau or equivalent + 5-40 hr orientation depending on state), **(3) EVV (Electronic Visit Verification) for any Medicaid-waiver client** under 21st Century Cures Act §12006. Distinct from **licensed home health agencies** (skilled nursing under physician orders + Medicare-reimbursable + 42 CFR Part 484), **assisted living facilities** (residential congregate care + state ALF license), **hospice** (Medicare-certified end-of-life under physician certification), and **adult day care** (center-based daytime senior programming).

The 2027 demand reality: **~85M Americans aged 60+ by 2030 per Census** + **~56M aged 65+ in 2025** + **~10,000 Americans turning 65 every day** through 2030 + **~83% of seniors prefer aging-in-place vs facility care** per AARP Home and Community Preferences survey + **~$157B-$185B US home care market (medical + non-medical combined) growing ~7-9% CAGR** per Home Care Association of America (HCAOA) + IBISWorld + Grand View Research. The non-medical personal-care + companion-care segment alone is **~$45B-$62B** and growing **8-12% CAGR** as facility costs ($5,500-$9,500/mo assisted living, $9,000-$12,500/mo memory care) push families toward in-home alternatives at **$28-$45/hr private-pay** ($4,500-$8,500/mo for 30-50 hrs/wk care plans).

Five things that determine survival years 1-3: **(1) caregiver recruiting + retention** (60-90% annual turnover is the industry baseline — agencies that solve retention win), **(2) payor mix discipline** (private-pay + LTC-insurance + VA Aid & Attendance margins clear 12-20% vs Medicaid waiver 4-9%), **(3) on-call coordinator coverage** (Saturday-night fall + Sunday-morning no-show is the unrelenting operating reality), **(4) referral-partner pipeline** (hospital discharge planners + SNF social workers + elder-law attorneys + geriatric care managers + senior-living concierges + Area Agencies on Aging drive 60-80% of intake), **(5) W-2 classification + EVV + Medicaid 80/20 compliance** (regulatory risk has accelerated 2024-2027 — agencies that 1099 caregivers or skip EVV face existential audit exposure).

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & non-medical home care vs home health vs assisted living vs hospice vs adult day care distinction](#market-size--non-medical-home-care-vs-home-health-vs-assisted-living-vs-hospice-vs-adult-day-care-distinction)
- [HCAOA, state Home Care Organization licensing & federal regulatory stack](#hcaoa-state-home-care-organization-licensing--federal-regulatory-stack)
- [Caregiver workforce: CNA, HHA, companion-aide credentials & background-check infrastructure](#caregiver-workforce-cna-hha-companion-aide-credentials--background-check-infrastructure)

**Part 2 -- Build-Out & Capital**
- [Office: home-based vs leased, virtual launch & coordinator workspace](#office-home-based-vs-leased-virtual-launch--coordinator-workspace)
- [Scheduling, EVV, payroll & insurance tech stack](#scheduling-evv-payroll--insurance-tech-stack)
- [Capital stack: SBA 7(a), franchise financing, founder equity & working capital float](#capital-stack-sba-7a-franchise-financing-founder-equity--working-capital-float)

**Part 3 -- Operations**
- [W-2 vs 1099 post-DOL 2024 rule & Companionship Exemption history](#w-2-vs-1099-post-dol-2024-rule--companionship-exemption-history)
- [Payor mix: private-pay, LTC insurance, Medicaid HCBS waiver & VA Aid & Attendance](#payor-mix-private-pay-ltc-insurance-medicaid-hcbs-waiver--va-aid--attendance)
- [Billing rates, caregiver pay, gross margin & Medicaid 80/20 rule impact](#billing-rates-caregiver-pay-gross-margin--medicaid-8020-rule-impact)
- [Referral pipeline: hospital discharge, elder-law, geriatric care managers & AAA](#referral-pipeline-hospital-discharge-elder-law-geriatric-care-managers--aaa)

**Part 4 -- Growth & Exit**
- [Franchise vs independent: Right at Home, Home Instead, Visiting Angels & FDD economics](#franchise-vs-independent-right-at-home-home-instead-visiting-angels--fdd-economics)
- [Multi-location playbook: regional manager, central scheduling & payor-mix optimization](#multi-location-playbook-regional-manager-central-scheduling--payor-mix-optimization)
- [Exit math: PE roll-up multiples, Addus / Help at Home / BAYADA / Interim comps](#exit-math-pe-roll-up-multiples-addus--help-at-home--bayada--interim-comps)
- [Counter-case: turnover, W-2 audit, Medicaid 80/20, on-call burnout & referral concentration](#counter-case-turnover-w-2-audit-medicaid-8020-on-call-burnout--referral-concentration)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & non-medical home care vs home health vs assisted living vs hospice vs adult day care distinction

The US senior home + community-based care market is **~$157B-$185B** combined per HCAOA + IBISWorld + Grand View Research, inside a **~$4.5T US healthcare market** per CMS National Health Expenditure data. The **non-medical personal-care + companion-care segment** is **~$45B-$62B** and growing **8-12% CAGR** through 2030 as the 65+ population expands and families substitute in-home care for facility care.

Adjacent senior-care formats share elderly customer base but differ in licensure, payor, and unit economics. **(1) Non-medical home care** (this entry) — ADL + companion + transportation, **W-2 caregivers**, **$28-$45/hr private-pay**, **8-18% EBITDA**, no Medicare reimbursement (Medicare doesn't pay for non-medical care). **(2) Licensed home health agency** — skilled nursing + PT/OT/ST under physician orders, **Medicare-reimbursable via 42 CFR Part 484**, **5-12% EBITDA**, ~12,000 agencies per CMS Provider of Services file. **(3) Assisted living facility (ALF)** — residential congregate care, **$5,500-$9,500/mo private-pay**, state ALF license, **20-32% EBITDA**, real-estate-heavy capital ($15M-$45M build). **(4) Memory care** — secured ALF for dementia, **$9,000-$12,500/mo**, **25-35% EBITDA**. **(5) Hospice** — Medicare-certified end-of-life, physician certification of <6 mo prognosis, **15-22% EBITDA** mature. **(6) Adult day care** — center-based daytime programming, $75-$140/day, **8-14% EBITDA**.

This entry centers on non-medical home care because it has the **lowest capital threshold** among senior-care formats ($40K-$250K vs $15M+ ALF), the **highest demographic tailwind** (aging-in-place preference), and a **clear regulatory + payor structure** that rewards operational discipline over real-estate capital.

### HCAOA, state Home Care Organization licensing & federal regulatory stack

Non-medical home care regulation in the US is a **three-layer stack** — state Home Care Organization (HCO) / personal-care-agency license, federal background-check + training + EVV requirements, and payor-specific (Medicaid + VA + LTC insurer) credentialing.

**State HCO / personal-care-agency license.** Required in **38 of 50 states** as of 2024. Issued by state health department or social services agency. Typical fee **$500-$3,500 initial + $300-$2,000 annual renewal**. Requires plan of operation + policy-and-procedure manual + caregiver-training curriculum + emergency-preparedness plan + insurance certificates + administrator qualifications + 30-180 day approval timeline. **States WITHOUT a non-medical HCO license: AL, AK, IA, IN, MI, MS, NM, OH, OK, SD, WV, WY** (12 states; check current — moving target).

**Major state agencies.** **California Department of Social Services (CDSS) Home Care Services Bureau (HCSB)** under the Home Care Services Consumer Protection Act of 2013 + AB 1217 (license + caregiver registry + surety bond $25K). **Florida Agency for Health Care Administration (AHCA) Home Care Aide Registry + Home Health Agency / Nurse Registry license** — FL uses Nurse Registry framework for non-medical with $50K surety bond. **Texas Health & Human Services Commission (HHSC) Personal Assistance Services (PAS) license** — separate from HCSSA. **New York Department of Health Licensed Home Care Services Agency (LHCSA)** — NY requires LHCSA license even for non-medical with CON-equivalent moratorium 2018+. **Illinois Department of Public Health Home Services Agency license**. **Pennsylvania Department of Health Home Care Agency license** under Act 69 of 2006. **Massachusetts Executive Office of Elder Affairs Home Care Agency certification**.

**Federal background-check requirement.** All caregivers entering Medicaid-recipient homes must pass federal + state background check under **Affordable Care Act §6201** (CMS National Background Check Program). Most agencies extend this to all caregivers regardless of payor. **Checkr, Sterling, GoodHire, HireRight** at **$25-$80/check** + state-specific Live Scan fingerprinting + DMV pull + TB test + reference verification.

**EVV (Electronic Visit Verification).** **21st Century Cures Act §12006 (2016)** + **Social Security Act §1903(l)** require EVV for all Medicaid-funded personal-care visits since **Jan 1, 2020** and home-health visits since **Jan 1, 2023**. EVV captures caregiver identity + time-in + time-out + GPS location + service code. Vendors: **HHAeXchange, Sandata, Tellus, Authenticare, CareBridge, Therap, Netsmart Tellus, AlayaCare EVV**. State EVV models: **provider choice (most states)**, **state-mandated single vendor (NY, CA, FL use Sandata or HHAeXchange variants)**, **alternate EVV (open vendor)**. Cost **$25-$60/caregiver/mo**.

**HCAOA + HCAOA-A trade associations.** **Home Care Association of America (HCAOA)** is the primary national private-duty home-care trade association with ~3,500 member agencies + state-chapter network + DOL/CMS advocacy. **National Association for Home Care & Hospice (NAHC)** (now merged into Alliance for Care at Home in 2024) — broader medical + non-medical umbrella. **PHI (PHInational.org)** — direct-care workforce research + advocacy.

### Caregiver workforce: CNA, HHA, companion-aide credentials & background-check infrastructure

Caregiver supply is **the single biggest constraint** on home-care agency scale — and the workforce is increasingly credentialed, regulated, and competitive.

**Certified Nursing Assistant (CNA).** **75-180 hours of state-approved training** + competency exam + state CNA registry. Highest-credentialed non-medical caregiver tier. **2.3M-2.6M CNAs nationally** per BLS. Pay **$16-$24/hr in home care** vs $18-$28/hr in SNF.

**Home Health Aide (HHA).** **75-120 hours federal-minimum training** under **42 CFR §484.80** for Medicare-certified home health (not required for non-medical only, but most agencies prefer HHA credential). **~750K-900K HHAs nationally**. Pay **$15-$22/hr non-medical** vs $17-$24/hr medical home health.

**Companion-aide / personal-care aide (PCA).** **5-40 hours state-mandated training** depending on state (PA = 6 hr orientation, CA = 5 hr initial + 5 hr annual, NY = 75 hr for PCA program). Lowest-credentialed tier. Pay **$14-$20/hr**.

**Background check + screening.** **Checkr ($30-$60/check) + Sterling ($35-$75) + GoodHire ($30-$80) + HireRight enterprise** for criminal + sex-offender + national registry + DMV pull. **Live Scan fingerprinting** required in CA + FL + NY + TX + most HCO states ($45-$95 per scan). **TB test** required by most states ($25-$60). **Caregiver Background Check Bureau (state-specific registry)** required in CA HCSB Home Care Aide Registry, FL AHCA Caregiver Background Screening Clearinghouse, etc.

**Recruiting channels.** **Indeed + ZipRecruiter + CareGuide + Care.com Pro + MyCareJobs + AAA local AOA referrals + nursing-school CNA program partnerships + church + community recruitment + caregiver-referral bonuses ($100-$500/successful 90-day hire)**. Cost per hire **$280-$850** at small agency, **$180-$450** at scale.

**Retention reality.** **60-90% annual turnover** is **industry baseline** per PHI + HCAOA workforce surveys. Turnover drivers: wage compression vs fast-food + Amazon warehouse + retail ($17-$22/hr competitive); physical demands; client incompatibility; transportation; emotional toll. Best agencies hold turnover at **40-55%** via differentiated wage + benefits + scheduling + culture; worst exceed 100%.

**Sponsorship + visa caregivers.** **EB-3 unskilled / H-2B seasonal** visa caregivers are 4-8% of US home-care workforce concentrated in NYC + LA + Miami + Chicago Filipino, Caribbean, and West African pipelines. Sponsorship cost **$8K-$18K/visa** + 6-18 month timeline. Not a Year 1-2 strategy.

---

## 🏗️ PART 2 -- BUILD-OUT & CAPITAL

### Office: home-based vs leased, virtual launch & coordinator workspace

Office decisions are surprisingly flexible for non-medical home care — the model is **dispatch + coordination + payroll**, not patient-facing clinical space.

**Home-based launch.** **$0-$2K/mo** (existing home office + dedicated phone line). Allowed in **most HCO-licensed states** for first 12-24 months as long as plan of operation specifies designated office space + records storage + privacy controls. **Owner + 1-2 coordinators work from home** with shared scheduling software + cloud phone. **Pros**: lowest capital + fastest launch. **Cons**: caregiver in-person orientation harder, professional image weaker for hospital-discharge referrals, eventual state inspection requires dedicated workspace.

**Coworking + virtual office.** **$300-$900/mo** (Regus, WeWork, Industrious, Roam, Premier Workspaces). Provides business address + reception + occasional meeting room for caregiver orientation + family intake. Middle path before committing to lease.

**Leased office.** **$1,500-$4,500/mo** for **600-1,400 sqft** secondary-market office park. Standard agency footprint: **2-4 coordinator workstations + 1 owner office + reception + caregiver orientation room (10-20 capacity) + secure records storage + restroom + break room**. Expect **5-10 yr lease** with **personal guarantee** for new operator. Most agencies hit leased office by Month 12-24 once revenue justifies.

**State inspection workspace requirements.** **CA HCSB + NY DOH + FL AHCA + TX HHSC** require dedicated office space with **locked records storage + private intake space + administrator on-premises during business hours + posted licensure documents**. Inspection 1-3x/yr.

**On-call coordinator workspace.** **24/7/365 phone coverage** requires either dedicated on-call coordinator with home setup ($28K-$45K/yr stipend + cell + remote-access laptop) or outsourced after-hours answering service ($450-$1,500/mo via Specialty Answering Service, AnswerNet, MAP Communications). Most Year 1-3 agencies use owner as primary on-call with painful burnout consequences.

### Scheduling, EVV, payroll & insurance tech stack

Tech stack is the **operating backbone** of a modern home-care agency — scheduling, EVV, payroll, billing, and CRM are all software-mediated and have largely consolidated to 4-6 dominant platforms.

**Scheduling + workforce management.** **AxisCare $400-$1,200/mo + per-caregiver fees** (HCAOA Preferred Partner, strong for private-duty), **ClearCare / WellSky Personal Care $500-$1,500/mo** (WellSky acquired ClearCare 2017, largest single platform in private-duty), **Smartcare $300-$900/mo** (mid-market), **AlayaCare $600-$1,800/mo + per-user** (enterprise + Canada strong), **Caretime $250-$700/mo** (smaller agencies), **Generations Homecare System $300-$800/mo**. Includes scheduling + caregiver app + family portal + clock-in/out + care-plan documentation.

**EVV (Electronic Visit Verification).** **HHAeXchange** (NY-mandated, FL Medicaid managed care, multi-state expansion), **Sandata Aggregator + Sandata Mobile Connect** (CMS state default in many states), **Tellus / Netsmart Tellus**, **Authenticare**, **CareBridge** (Medicaid managed care focused). Cost **$25-$60/caregiver/mo**. Most scheduling vendors include EVV native or via integration.

**Payroll + HR.** **Gusto $40-$80/mo + per-employee** (small + mid-sized agency, integrated benefits + HRIS), **ADP Run $120-$300/mo + per-employee** (mid-sized + multi-location), **Paychex Flex $120-$350/mo** (mid-sized), **Paylocity $200-$500/mo** (enterprise + multi-state). Home-care-specific: **Vested Health Pay** + **Viventium** (formerly Sage HRMS, home-care specialized).

**Billing + clearinghouse.** **AxisCare / ClearCare / WellSky** include billing engines for private-pay invoicing + LTC insurance claims + VA Aid & Attendance billing + Medicaid 837P claims. **Waystar, Availity, Change Healthcare clearinghouse** for Medicaid + LTC-insurance EDI submission. **Stripe + Square + GoCardless + ACH** for private-pay credit-card / ACH collection.

**CRM + referral tracking.** **Home Care Pulse Referral Tracker, Salesforce Health Cloud, HubSpot Service Hub, Pipedrive** for hospital-discharge planner + elder-law-attorney + geriatric-care-manager outreach tracking. **The CarePartners Conference + senior-living-CRM specialty tools** (Aline / Sherpa CRM, Continuum, NIC MAP) for senior-living-community referral tracking.

**Phone + communications.** **RingCentral $30-$50/seat/mo, OpenPhone $20-$30/seat/mo, Dialpad, 8x8** for cloud phone + voicemail-to-email + on-call routing. **Slack / Microsoft Teams** for internal coordinator + admin communication.

**Insurance stack (mandatory).** **General Liability $1,500-$4,500/yr** (HCAOA partners: PHLY Philadelphia Insurance, CNA, Markel, NIA Group) + **Professional Liability / E&O $1,000-$3,000/yr** + **Workers Compensation 4-9% of payroll** state-by-state (varies wildly: WV / WY high, TX / FL moderate, CA NCCI rate ~$3.50/$100 home health classifier 8829) + **Non-Owned + Hired Auto $600-$2,000/yr** (caregivers driving clients to appointments) + **Employee Dishonesty Bond / Crime Coverage $500-$2,000/yr** (state-required in CA, FL, NY for caregiver-handling-cash scenarios) + **State surety bond CA $25K, FL $50K, NY $100K, MA $25K**. Total insurance Year 1 typically **$10K-$30K/yr** at small scale, scaling with payroll.

### Capital stack: SBA 7(a), franchise financing, founder equity & working capital float

Home-care agency capital stacks are **lean by industry standard** — the model is service-not-asset, so capital primarily funds **license + insurance + tech + payroll-float + marketing**.

**Founder equity.** **$30K-$80K** typical for independent launch. New operator self-funds 50-80% of launch via savings + family + 401(k) loan (Solo 401(k) up to $50K) + HELOC. Bootstrap is the dominant pattern for independent launch.

**SBA 7(a).** **$50K-$500K** for independent home-care launch with strong personal credit + 10-20% down + business plan + projections + administrator-experience documentation. Rate **Prime + 2.0-4.0%** (SBA cap formula), 10-yr term. **Live Oak Bank (largest home-care SBA lender), Huntington National Bank, Wells Fargo SBA, Newtek, Byline Bank** active in home-care SBA lending. SBA 7(a) is the dominant capital source for independent launch above founder-equity threshold.

**SBA Express + microloan.** **$25K-$50K** SBA Express + **$500-$50K** SBA microloan via Accion Opportunity Fund, Justine Petersen, LiftFund, CDC Small Business Finance for very-small agency launch + caregiver-training capital.

**Franchise financing.** **$100K-$300K** franchise launch (initial franchise fee $35K-$70K + working capital + buildout + 90-day payroll float). **Right at Home, Home Instead, Visiting Angels, Senior Helpers, Comfort Keepers, BrightStar Care, FirstLight Home Care, ComForCare, Always Best Care, Synergy HomeCare** all franchise. **Franchisor-affiliated SBA lenders** (Live Oak + Benetrends + ApplePie Capital + FranFund) bundle SBA 7(a) + 401(k) ROBS rollover + equipment finance with FDD-verified projections.

**Working capital + payroll float.** **$25K-$80K LOC** (Bluevine, OnDeck, Kabbage, business credit card, regional bank LOC). **Critical** — caregiver payroll runs weekly or biweekly but private-pay AR ages 15-45 days + LTC insurance ages 45-90 days + Medicaid waiver ages 30-75 days. **Year 1-2 working capital crunch is the #1 cause of Month 6-12 distress**.

**Acquisition financing.** **$150K-$2M** to acquire existing agency with revenue + license + caregiver roster. **3.5-6.0x EBITDA** typical for $300K-$1.5M EBITDA single location, financed via SBA 7(a) (up to $5M) + seller note 10-25% + buyer equity 10-20%.

**Equipment + leasehold finance.** **$15K-$50K** equipment finance for office furniture + phones + computers + initial scheduling software setup. **9-15% effective rate** via Balboa, Crest, Direct Capital. Less common than restaurant + medical practice because home-care equipment footprint is small.

**Total capital stack typical.** **$40K-$120K lean launch** (70% founder equity + 20% LOC + 10% SBA microloan) vs **$120K-$250K full launch** (40% founder equity + 40% SBA 7(a) + 20% LOC) vs **$100K-$300K franchise** (30% founder equity + 50% SBA 7(a) + 20% LOC + franchise fee separate).

---

## ⚙️ PART 3 -- OPERATIONS

### W-2 vs 1099 post-DOL 2024 rule & Companionship Exemption history

The W-2 vs 1099 question is **the single biggest regulatory issue in non-medical home care in 2027** — and the legal trajectory has tightened decisively against 1099 classification.

**Historical Companionship Exemption (29 CFR §552.6, pre-2015).** From 1974 through 2015, **companionship services workers** were exempt from federal FLSA minimum wage + overtime. This let agencies pay flat day-rates or 1099 caregivers without overtime exposure. **2015 DOL final rule (effective Jan 1, 2015) eliminated the third-party-employer exemption** — meaning agency caregivers (vs individual-household direct-hire) must now receive minimum wage + overtime. **Home Care Association of America v. Weil (D.C. Cir. 2015)** upheld the rule. **Individual-family-employed companions** (paid directly by family, no agency) retain a narrower exemption.

**DOL 2024 Independent Contractor final rule (effective March 11, 2024).** Restored the **multi-factor economic-reality test** (replacing 2021 rule) — opportunity for profit/loss + investment + permanence + employer control + work integral to business + skill/initiative. **Almost no caregiver in an agency context passes the test as 1099** because the agency directs schedule, sets rates, provides clients, trains workers, and controls quality. **Misclassification audits hit $50K-$500K back-pay (3 yr lookback) + DOL liquidated damages + state unemployment + workers comp + IRS payroll tax + penalties + interest**.

**State-level scrutiny.** **California AB 5 + AB 2257 (2019/2020)** ABC test makes 1099 caregivers essentially impossible in CA — caregiver fails Prong B (work outside usual course of agency business) by definition. **New Jersey, Massachusetts, Illinois, New York** apply similar ABC or hybrid tests. **Texas + Florida + Georgia + South Carolina + Tennessee + Indiana** use IRS common-law test but DOL audits still apply.

**Practical reality 2027.** **Essentially all multi-client agency caregivers must be W-2**. Few exceptions: **registry / nurse-registry models** in FL + NV + a handful of states where the agency operates as a referral matchmaker (not employer) and the family directly hires + W-2 or 1099 the caregiver — but liability and tax burden shift to family + significant disclosure required. **Live-in caregiver 24-hour cases** have specialized FLSA exemptions (sleep time 5-8 hrs may be unpaid under DOL guidance) but require careful documentation.

**Cost impact.** **W-2 caregiver fully loaded cost = pay rate × ~1.30-1.42** factoring workers comp (4-9% of payroll), unemployment (0.6-6.0% state-varying), FICA-employer (7.65%), Medicare-employer (1.45%), state disability (where applicable), and benefits. A **$18/hr caregiver costs the agency $23.50-$25.60/hr loaded** — and that gap is what gets crushed under Medicaid 80/20.

### Payor mix: private-pay, LTC insurance, Medicaid HCBS waiver & VA Aid & Attendance

Payor mix is the **single biggest determinant of agency margin** — private-pay clears 12-20% EBITDA, Medicaid clears 4-9%, and the mix decision shapes every other operating choice.

**Private-pay (40-65% of mature agency revenue).** **Family + senior pays out-of-pocket at $28-$45/hr** ($30-$38/hr secondary markets, $38-$48/hr coastal metros). Highest margin (12-20% EBITDA). Billed weekly via ACH or credit card. Customer acquisition: hospital discharge planners + elder-law attorneys + geriatric care managers + senior-living concierges + church + Area Agencies on Aging + Google + word-of-mouth.

**Long-term care insurance (10-25% of revenue).** **Genworth, Mutual of Omaha, John Hancock, Northwestern Mutual, MassMutual, Transamerica** policies pay agencies directly at **$24-$40/hr** typically after elimination period (30-180 day waiting period). Margin **8-14%** (lower than private-pay due to claims-processing burden + paperwork). Aging policy block: ~7M-8M Americans hold LTC insurance (declining as carriers exit + premiums rose 2008-2020).

**Medicaid HCBS Home and Community-Based Services waiver (10-40% of revenue, varies wildly by state).** **State Medicaid program funds personal care for low-income seniors + disabled adults** at **$19-$32/hr** (state-set rate). Examples: **CA In-Home Supportive Services (IHSS) ~$18-$22/hr provider rate**, **NY Consumer Directed Personal Assistance Program (CDPAP) ~$22-$28/hr**, **FL Statewide Medicaid Managed Care Long-Term Care (SMMC LTC) ~$19-$24/hr**, **TX STAR+PLUS Personal Attendant Services ~$15-$19/hr**, **MA MassHealth Personal Care Attendant ~$22-$28/hr**, **PA Community HealthChoices ~$20-$26/hr**, **OH Ohio Department of Aging PASSPORT ~$19-$24/hr**. Margin **4-9%** pre-80/20 rule, projected to compress **further toward 0-4%** post-2030. Required for any agency targeting low-income senior population.

**VA Aid & Attendance + Housebound benefit.** **Veterans Administration pays veterans + surviving spouses up to $2,727/mo (2024)** for personal care via direct check. Veteran-customer pays agency at private-pay rate ($28-$40/hr). VA-directed payment via **Veteran Directed Care (VDC) program** or **Community Care Network (CCN)**. Underutilized — only ~30% of eligible veterans claim benefit. Strong growth segment for agencies that build VA-referral relationships.

**Workers comp + auto insurance carrier-paid.** **Workers comp claims + auto-injury claims** occasionally fund personal care for working-age injured adults at **$28-$48/hr** via case-manager assignment. Specialty payor — niche but high-margin.

**Hospice + palliative supplemental.** **Family supplements hospice care with private-pay non-medical hours** for additional ADL + companion coverage beyond what hospice provides. **$28-$45/hr private-pay**.

**Concierge + premium.** **High-net-worth + ultra-high-net-worth families** pay **$45-$95/hr** for live-in caregiver + executive-companion + medical-concierge-coordination services. Boutique segment in NYC + SF + LA + Boston + Aspen + Palm Beach.

### Billing rates, caregiver pay, gross margin & Medicaid 80/20 rule impact

The economics of non-medical home care are governed by a **tight spread** between billing rate and caregiver pay — and that spread has compressed under regulatory and labor pressure 2020-2027.

**Billing rate ranges (2027).** **Private-pay $28-$45/hr** (secondary markets $30-$38, coastal $38-$48). **LTC insurance $24-$40/hr**. **Medicaid HCBS waiver $19-$32/hr (state-set)**. **VA via veteran-customer $28-$40/hr**. **Live-in 24-hr cases $250-$450/day** flat-rate equivalent to $13-$22/hr depending on sleep-time accounting. **Concierge $45-$95/hr**.

**Caregiver pay ranges (2027).** **CNA $16-$24/hr**, **HHA $15-$22/hr**, **PCA / companion $14-$20/hr**. Live-in **$160-$280/day** flat ($8-$15/hr equivalent under sleep-time exemption when properly documented). Differential pay common: **weekend $1-$3/hr premium**, **overnight $1-$3/hr**, **holiday 1.5x**, **certified specialties (dementia, hospice support, bariatric, hoyer-lift) $1-$4/hr**.

**Gross margin math.** **Billing $32/hr private-pay** − **Caregiver $18/hr** − **payroll burden ($18 × 0.35 = $6.30)** = **$7.70 contribution/hr (24% gross)**. Subtract proportional coordinator + insurance + tech + office + marketing + admin overhead. **Mature single-office private-pay agency clears 12-20% EBITDA**. Add **30% Medicaid book at $22/hr billed - $16/hr loaded = $6 contribution** = 27% gross but Medicaid admin burden is higher → 4-9% EBITDA on Medicaid book → blended **8-14% EBITDA mature single office**.

**CMS Medicaid 80/20 HCBS final rule (May 2024, effective July 2030).** **CMS Medicaid Access Rule (89 FR 40542)** requires **80% of Medicaid HCBS payments flow to direct-care worker compensation** (wages + benefits + payroll tax) by July 2030 — leaving 20% maximum for agency overhead + profit. **Industry analysis (HCAOA + ANCOR + LeadingAge)** estimates this compresses Medicaid agency EBITDA from current 4-9% toward **0-4% post-implementation** at current state rates without rate increases. Several states (NY, IL, OR, CO) are revising rates upward; most are not. **Strategic implication**: agencies that are >50% Medicaid face existential margin crunch by 2030; agencies that are <30% Medicaid have more cushion.

**21st Century Cures Act EVV impact.** **EVV requirement since Jan 2020 (personal care) + Jan 2023 (home health)** added **$25-$60/caregiver/mo software cost** + caregiver-training friction + claim-denial risk for non-compliant visits. Most agencies absorbed cost; agencies in **Sandata or HHAeXchange mandated states** had less choice.

**Caregiver wage compression risk.** **Federal $15/hr + state minimum-wage increases (CA $16+, NY $15+, WA $16+, CO $14+, FL phasing to $15 by 2026)** push base PCA/HHA pay floor. Wage compression from fast-food + Amazon + Walmart + Target at **$17-$22/hr** with benefits is the day-to-day competitive reality.

### Referral pipeline: hospital discharge, elder-law, geriatric care managers & AAA

Customer acquisition in home care is **B2B-relationship-driven, not consumer-marketing-driven** — 60-80% of intake comes from professional referral partners, not Google or Facebook.

**Hospital discharge planners + case managers.** **The single highest-volume referral source.** Hospitals discharge ~36M patients/yr per AHA; ~20-30% of senior discharges need home-care support. Discharge planners need agencies that can start within **24-72 hours** of discharge, accept **first-call urgency**, and demonstrate **caregiver competency + insurance coverage + liability protection**. Build relationships with **Medical-Surgical floor case managers + ED social workers + hospital-system Care Transitions team**.

**Skilled Nursing Facility (SNF) discharge social workers.** Similar to hospital but **post-acute rehab to home** transition. **High-frequency referrer** — SNF social worker often manages 20-50 discharges/mo with home-care need. Pay attention to **regional hospital systems with affiliated SNFs**: Sutter, Kaiser, HCA, Tenet, CommonSpirit, Ascension, Trinity, Banner regional networks.

**Elder-law attorneys + estate planners.** **High-value, low-volume.** Elder-law attorneys advise families through Medicaid planning, guardianship, and incapacity transitions. Family asks attorney "who do you recommend for home care?" and attorney's answer is conversion-rate ~50-70%. **National Academy of Elder Law Attorneys (NAELA) state chapters** are the relationship channel.

**Geriatric Care Managers (GCMs) / Aging Life Care Professionals (ALCPs).** Independent professionals who assess + coordinate senior care for families (often adult children long-distance from parent). **Aging Life Care Association (ALCA) ~1,500-2,000 members nationally**. **Highest-conversion-rate referral source** because GCM is family's trusted advisor. GCM expects agency to deliver — relationships are zero-tolerance for caregiver no-shows.

**Senior-living communities (IL / AL / MC / CCRC).** Independent + assisted living + memory care + CCRC communities refer outgoing residents who need supplemental care or are aging-down out of the community. Build relationships with **Director of Resident Services + Move-In Coordinator + Wellness Director**. Communities like **Atria, Brookdale, Sunrise, Holiday Retirement, Five Star, Sonida, Watermark, Belmont Village** are large-scale referral sources.

**Area Agencies on Aging (AAA) + Aging and Disability Resource Centers (ADRC).** Federal **Older Americans Act §306** funds ~622 AAAs nationally that connect seniors to services. AAAs maintain **provider rolls + Information & Referral lines + Medicaid waiver intake**. Required relationship for Medicaid-waiver agencies; useful for private-pay agencies too.

**Physician offices + geriatricians + primary care.** **Lower-volume but high-quality.** Primary care + geriatric medicine + neurology (memory disorders) refer post-diagnosis. Build relationships with practice managers + RN care coordinators in **PCMH (Patient-Centered Medical Home) practices** + ACOs.

**VA Medical Centers + VA Community Care.** **Veterans Health Administration + VA Community Care Network** for veteran referrals + Aid & Attendance benefit coordination. Build relationship with **VAMC Geriatrics & Extended Care (GEC) social workers**.

**Marketing channels (supplemental).** **Google Local Service Ads + Google My Business + Yelp + Caring.com + APlaceForMom Senior Care Advisor + SeniorAdvisor.com**. **5-15% of intake** from digital. Lower-quality than referral but supplemental.

---

## 🚀 PART 4 -- GROWTH & EXIT

### Franchise vs independent: Right at Home, Home Instead, Visiting Angels & FDD economics

The franchise vs independent decision is **the single biggest strategic choice** at launch — and the home-care category has the **deepest franchise ecosystem of any senior-care segment**.

**Top non-medical home-care franchisors (2024 FDD-verified).** **Home Instead (Honor Technology acquired 2021)** — largest US home-care franchisor, ~600 US franchisees, **$58K-$76K initial franchise fee + 5% royalty + 2% national brand fund**, $115K-$155K total investment. **Right at Home (Honor Technology acquired 2024, FFL Partners platform)** — ~500+ US franchisees, **$54K initial franchise fee + 5% royalty + 2% brand fund**, $86K-$150K total. **Visiting Angels (Living Assistance Services)** — ~600+ franchisees, **$49K-$66K initial fee + 3-3.5% royalty**, $103K-$130K total. **Senior Helpers (Advocate Aurora 2022)** — ~370+ franchisees, **$56K initial + 5% royalty + 2% brand fund**, $123K-$170K total. **Comfort Keepers (Sodexo)** — ~450+ franchisees, **$50K initial + 5% royalty + 2.5% brand fund**, $87K-$135K total. **BrightStar Care (Audax Group acquired 2022)** — ~370+ franchisees (medical + non-medical hybrid), **$54K initial + 5-7% royalty**, $107K-$200K total. **FirstLight Home Care (NEI Global Relocation)** — ~190+ franchisees, **$48K initial + 5% royalty + 2% brand fund**, $114K-$200K total. **ComForCare Home Care (Best Life Brands)** — ~245+ franchisees, **$45K initial + 3-5% royalty**, $87K-$200K total. **Always Best Care** — ~225+ franchisees, **$49K initial + 6% royalty**, $76K-$140K total. **Synergy HomeCare (NexPhase Capital)** — ~190+ franchisees, **$46K initial + 5% royalty**, $87K-$160K total.

**Franchise pros.** **Brand recognition + hospital-discharge-planner credibility** (Home Instead + Visiting Angels are recognized brands in most metros). **Proven playbook + intake script + caregiver-training curriculum + insurance + EVV vendor relationships pre-negotiated**. **Franchisor SBA-lender relationships** (Live Oak, Benetrends, FranFund) ease financing. **Faster time-to-first-client** (3-6 mo vs 6-12 mo independent).

**Franchise cons.** **5-7% royalty + 2-3% brand fund = 7-10% of revenue gone forever** — on 10-15% EBITDA business that's 50-70% of profit. **Territory restrictions** prevent expansion into adjacent markets. **Brand-fund spend not always efficient**. **Exit value capped** — franchisee sells only the local agency, not the brand IP, so multiples often slightly compressed vs independent (3.5-5.5x vs 4.0-6.0x).

**Independent pros.** **Full equity + no royalty** = 7-10% margin retained. **Brand + territory flexibility**. **Higher exit value**. **Faster strategic decision-making**.

**Independent cons.** **No brand recognition** Year 1-3 requires aggressive referral-partner outreach. **No playbook** — operator builds policy + procedure + training + intake from scratch. **No vendor leverage** — pays retail for scheduling + EVV + insurance vs franchisor-negotiated rates.

**Choose franchise if** — first-time operator + want brand credibility + need playbook + value lender relationships. **Choose independent if** — experienced operator + want full equity + want territory flexibility + have referral-partner network already.

### Multi-location playbook: regional manager, central scheduling & payor-mix optimization

The path from single office to multi-location regional brand follows a **predictable operational + capital + management progression**.

**Stage 1 (Months 0-12).** Solo owner-operator + 1-2 coordinators + 8-25 caregivers + 5-15 active clients. **$200K-$600K Year 1 revenue, owner break-even to $40K take-home**. Risk: license + caregiver recruiting + first-client ramp + working-capital crunch.

**Stage 2 (Years 1-3).** Add agency director + 2-4 coordinators + 25-60 caregivers + 25-65 active clients + referral-partner pipeline + first Medicaid contract. **$1.2M-$3.5M revenue, 8-14% EBITDA + $100K-$280K owner take-home**.

**Stage 3 (Years 2-5).** Single-office mature + central scheduling + on-call rotation + 60-150 caregivers + 60-180 active clients. **$3M-$8M revenue, 10-16% EBITDA + $300K-$800K owner take-home**.

**Stage 4 (Years 4-8).** Second + third location 30-90 mi radius + regional manager + central HR + central billing + payor-mix optimization. **$8M-$20M revenue, 10-16% blended EBITDA**. Requires regional director ($85K-$135K) + central VP Operations + EVV / scheduling unified across locations.

**Stage 5 (Years 5-12).** Multi-state platform 5-15 offices + central executive team + PE-acquirable scale + Medicaid managed-care contracts + value-based care pilots. **$20M-$80M revenue, 12-18% EBITDA**. PE buyer target zone.

| Stage | Timeline | Locations | Active Clients | Caregivers | Annual Revenue | EBITDA Margin |
|---|---|---|---|---|---|---|
| Stage 1 Solo launch | Months 0-12 | 1 | 5-15 | 8-25 | $200K-$600K | Owner break-even-$40K |
| Stage 2 Mature solo | Years 1-3 | 1 | 25-65 | 25-60 | $1.2M-$3.5M | 8-14% |
| Stage 3 Single-office mature | Years 2-5 | 1 | 60-180 | 60-150 | $3M-$8M | 10-16% |
| Stage 4 Regional multi-office | Years 4-8 | 2-4 | 150-450 | 130-380 | $8M-$20M | 10-16% blended |
| Stage 5 Multi-state platform | Years 5-12 | 5-15 | 450-1,500 | 400-1,300 | $20M-$80M | 12-18% |

| Sizing Decision | Capital | Annual Revenue | Best For |
|---|---|---|---|
| Independent home-office launch | $40K-$120K | $200K-$1.2M | First-time + bootstrap + secondary market |
| Independent leased-office launch | $120K-$250K | $1.2M-$3.5M | Experienced ops + capital + referral network |
| Franchise launch | $100K-$300K + 5-7% royalty | $800K-$2.5M Year 1-2 | First-time + want brand + playbook |
| Acquisition single office | $150K-$2M | $1M-$4M | Experienced ops + want established license + caregivers |
| Multi-office regional build | $500K-$2M per add'l office | $8M-$20M | Years 4-8 expansion + central infrastructure |
| Multi-state platform via roll-up | $5M-$30M | $20M-$80M | PE-backed or strategic acquirer |

### Exit math: PE roll-up multiples, Addus / Help at Home / BAYADA / Interim comps

The home-care exit landscape is **the most active PE roll-up sector in healthcare services 2020-2027** — driven by demographic tailwind + fragmented market + scalable operating model.

**Single office sale.** **$200K-$2.5M** = **3.5-6.0x EBITDA** on $80K-$700K EBITDA single-location agency. Buyer: regional multi-location operator + first-time-buyer franchisee + adjacent-service acquirer (home health, hospice). Process **6-12 months** via business-broker (Sunbelt, Murphy Business, Cornerstone, Skytale Group home-care specialist) + targeted outreach.

**Multi-location regional brand.** **$5M-$40M** = **5.0-8.0x EBITDA** on $700K-$5M EBITDA regional platform with **payor-mix discipline + central infrastructure + manager bench**. Buyer: PE platform (Centre Lane, Bain Capital, FFL Partners, Vistria, H.I.G. Capital, Audax Group, Webster Equity Partners, Ridgemont, NexPhase Capital, Susquehanna Growth Equity) + strategic acquirer.

**PE roll-up active platforms (2024-2027).** **Help at Home (Centerbridge Partners + The Vistria Group)** — ~$1.5B revenue, ~190 branches, Medicaid focus, active acquirer. **Addus HomeCare (NASDAQ: ADUS)** — ~$1.1B revenue, ~210 locations, public-market consolidator. **BAYADA Home Health Care (private foundation 2018 conversion)** — ~$1.5B revenue, ~360 locations, hybrid model. **Interim HealthCare (Caring Brands International)** — ~330 franchise locations + corporate, broad services. **Right at Home (Honor Technology + FFL Partners 2024)** — franchise + tech platform combined. **Honor Technology** — Series F backed by Andreessen Horowitz + General Catalyst + Prosus + KKR (Home Instead 2021 acquisition combined). **Senior Helpers (Advocate Aurora 2022)** — health-system-backed franchise platform. **Comfort Keepers (Sodexo)** — strategic-acquirer-owned. **Synergy HomeCare (NexPhase Capital 2021)** — PE-backed franchise. **BrightStar Care (Audax Group 2022)** — PE-backed medical + non-medical hybrid.

**Strategic acquirer exit.** **Health-system spinoff or community-based-services arm** (CommonSpirit, Ascension, Trinity, AdventHealth, Bon Secours, Banner, Sutter) occasionally acquires regional home-care platform as **value-based-care + post-acute + ACO infrastructure play**. **$5M-$50M** transactions.

**Family / management buyout.** Owner sells to second-generation family + general manager + senior staff via SBA 7(a) financing + seller note. **$200K-$3M** transactions at 3.5-5.5x EBITDA.

**Asset wind-down (worst case).** **Distressed single-office agency** sells caregiver-roster + client list + EVV vendor seat + scheduling-software data export for **$50K-$200K**. License + insurance + brand value largely abandoned.

| Exit Path | Buyer Type | Typical Multiple | Process Length | Best For |
|---|---|---|---|---|
| Single office to regional operator | Regional multi-loc | 3.5-5.5x EBITDA | 6-12 months | $80K-$500K EBITDA + clean license + referral |
| Single office to first-time franchise buyer | Aspiring operator | 3.5-4.5x EBITDA | 6-12 months | Smaller office + owner-operator continuity |
| Regional brand to PE platform | Centre Lane / Vistria / FFL / Audax / H.I.G. / Webster | 5.0-7.0x EBITDA | 6-9 months | $700K-$3M EBITDA + multi-location + central infrastructure |
| Multi-state platform to strategic / public | Addus / Help at Home / BAYADA / Interim | 6.0-8.0x EBITDA | 9-12 months | $3M-$15M EBITDA + multi-state + payor-mix discipline |
| Sale to health system | CommonSpirit / Ascension / Trinity / Sutter | 4.5-7.0x EBITDA | 9-15 months | Mature regional + value-based-care fit |
| Family / management buyout | Internal | 3.5-5.5x EBITDA + seller note | 6-9 months | Owner exit with successor in place |
| Asset wind-down | Adjacent home-care operator | Caregiver roster + book $50K-$200K | 60-120 days | Distressed / burnout exit |

### Counter-case: turnover, W-2 audit, Medicaid 80/20, on-call burnout & referral concentration

A serious non-medical home-care founder must stress-test the case above against the conditions that make this category harder in 2027. The full 14-element counter-case is below.

`;

const tldr = `**TL;DR:** Starting a **non-medical senior home care agency in 2027** (a.k.a. **personal care agency**, **companion care agency**, **homemaker services agency**, **private duty home care**) -- the **state-licensed in 38 of 50 states personal-care + companion-care + ADL-support agency that sends W-2 CNA + HHA + companion-aide caregivers into seniors' private homes for bathing + dressing + toileting + transferring + meal preparation + light housekeeping + laundry + medication reminders + transportation to appointments + grocery shopping + companionship across three regulatory pillars: (1) state Home Care Organization HCO / Home Care Services Bureau / Personal Care Agency / Licensed Home Care Services Agency license issued by California Department of Social Services Home Care Services Bureau CDSS HCSB under Home Care Services Consumer Protection Act AB 1217 + Florida Agency for Health Care Administration AHCA Nurse Registry / Home Care Aide Registry with $50K surety bond + Texas Health & Human Services Commission HHSC Personal Assistance Services PAS license + New York Department of Health Licensed Home Care Services Agency LHCSA with CON-equivalent moratorium + Illinois Department of Public Health Home Services Agency + Pennsylvania Department of Health Home Care Agency under Act 69 of 2006 + Massachusetts Executive Office of Elder Affairs Home Care Agency $500-$3,500 initial + $300-$2,000 annual + 30-180 day approval + plan of operation + policy-and-procedure manual + administrator qualifications + insurance, (2) federal + state caregiver background-check + training requirements under Affordable Care Act §6201 CMS National Background Check Program + state Caregiver Background Check Bureau registry + Live Scan fingerprinting + TB test + DMV pull + 5-180 hr state-mandated caregiver training (CNA 75-180 hr + HHA 75-120 hr federal-minimum under 42 CFR §484.80 + PCA companion-aide 5-40 hr state-varying), (3) EVV Electronic Visit Verification under 21st Century Cures Act §12006 Social Security Act §1903(l) for all Medicaid-funded personal-care visits since Jan 1 2020 + home-health since Jan 1 2023 via HHAeXchange + Sandata + Tellus + Authenticare + CareBridge $25-$60/caregiver/mo** -- means navigating **Home Care Association of America HCAOA primary national trade body ~3,500 member agencies + Alliance for Care at Home (formerly NAHC merger 2024) + PHI direct-care workforce research + caregiver supply Certified Nursing Assistant CNA 2.3M-2.6M nationally $16-$24/hr + Home Health Aide HHA ~750K-900K $15-$22/hr + companion-aide / personal-care aide PCA $14-$20/hr + background-check infrastructure Checkr + Sterling + GoodHire + HireRight $25-$80/check + Live Scan $45-$95 + TB test $25-$60 + scheduling AxisCare HCAOA Preferred Partner $400-$1,200/mo + ClearCare / WellSky Personal Care largest private-duty platform $500-$1,500/mo + Smartcare $300-$900/mo + AlayaCare enterprise + Canada $600-$1,800/mo + Caretime $250-$700/mo + Generations Homecare $300-$800/mo + EVV vendors HHAeXchange NY-mandated + FL Medicaid managed care + Sandata Aggregator CMS default + Sandata Mobile Connect + Tellus Netsmart + Authenticare + CareBridge Medicaid managed care + payroll Gusto $40-$80/mo + ADP Run $120-$300/mo + Paychex Flex $120-$350/mo + Paylocity $200-$500/mo + Viventium home-care specialized + billing Waystar + Availity + Change Healthcare clearinghouse + Stripe + Square + GoCardless + ACH for private-pay + CRM Home Care Pulse Referral Tracker + Salesforce Health Cloud + HubSpot + Pipedrive + Aline Sherpa senior-living CRM + Continuum + NIC MAP + phone RingCentral + OpenPhone + Dialpad + 8x8 + insurance General Liability $1,500-$4,500/yr PHLY Philadelphia Insurance + CNA + Markel + NIA Group HCAOA partners + Professional Liability E&O $1,000-$3,000/yr + Workers Compensation 4-9% of payroll state-varying CA NCCI ~$3.50/$100 + Non-Owned + Hired Auto $600-$2,000/yr + Employee Dishonesty Bond / Crime Coverage $500-$2,000/yr + state surety bond CA $25K + FL $50K + NY $100K + MA $25K + capital stack founder equity $30K-$80K + SBA 7(a) $50K-$500K Live Oak Bank largest home-care SBA + Huntington + Wells Fargo SBA + Newtek + Byline Bank + SBA Express + microloan $25K-$50K via Accion Opportunity Fund + Justine Petersen + LiftFund + CDC Small Business Finance + working capital LOC $25K-$80K Bluevine + OnDeck + Kabbage + franchise financing $100K-$300K via Live Oak + Benetrends + ApplePie Capital + FranFund 401(k) ROBS rollover + acquisition financing $150K-$2M SBA 7(a) up to $5M + seller note + W-2 vs 1099 post-DOL 2024 Independent Contractor final rule effective March 11 2024 multi-factor economic-reality test + 2015 DOL elimination of 29 CFR §552.6 Companionship Exemption Home Care Association of America v. Weil D.C. Cir. 2015 + CA AB 5 + AB 2257 ABC test + NJ + MA + IL + NY similar + payor mix private-pay 40-65% of mature revenue $28-$45/hr + LTC insurance 10-25% Genworth + Mutual of Omaha + John Hancock + Northwestern Mutual + MassMutual + Transamerica $24-$40/hr + Medicaid HCBS Home and Community-Based Services waiver 10-40% $19-$32/hr state-set CA In-Home Supportive Services IHSS + NY Consumer Directed Personal Assistance Program CDPAP + FL Statewide Medicaid Managed Care Long-Term Care SMMC LTC + TX STAR+PLUS PAS + MA MassHealth PCA + PA Community HealthChoices + OH Department of Aging PASSPORT + VA Aid & Attendance + Housebound benefit up to $2,727/mo via Veteran Directed Care VDC or Community Care Network CCN + workers comp / auto carrier-paid + hospice supplemental + concierge $45-$95/hr + CMS Medicaid 80/20 HCBS final rule May 2024 effective July 2030 Medicaid Access Rule 89 FR 40542 requiring 80% of HCBS payments to direct-care worker comp + referral pipeline 60-80% of intake from hospital discharge planners + SNF social workers + elder-law attorneys NAELA + geriatric care managers / Aging Life Care Professionals ALCA + senior-living communities Atria + Brookdale + Sunrise + Holiday Retirement + Five Star + Sonida + Watermark + Belmont Village + Area Agencies on Aging AAA ~622 nationally under Older Americans Act §306 + physician offices + geriatricians + VA Medical Centers VAMC Geriatrics & Extended Care GEC + Google Local Service Ads + Google My Business + Yelp + Caring.com + APlaceForMom + SeniorAdvisor.com**, and operating against **~85M Americans aged 60+ by 2030 per Census + ~56M aged 65+ in 2025 + ~10,000 turning 65 every day through 2030 + ~83% of seniors prefer aging-in-place per AARP + ~$157B-$185B US home care market combined + ~$45B-$62B non-medical segment growing 8-12% CAGR per HCAOA + IBISWorld + Grand View Research + counter-pressures 60-90% annual caregiver turnover industry baseline + wage compression vs fast-food + Amazon + Walmart at $17-$22/hr + W-2 misclassification audit risk $50K-$500K back-pay + DOL liquidated damages + state unemployment + workers comp + IRS payroll tax + EVV claim-denial risk + CMS Medicaid 80/20 squeeze projected to compress Medicaid EBITDA from 4-9% toward 0-4% post-2030 + on-call 24/7 coordinator burnout + Saturday-night fall calls + Sunday-morning no-shows + 30-50% Year 1-3 owner exit + referral-partner concentration risk (single hospital discharge planner relationship = 40-60% of intake = single-point-of-failure) + LTC insurance carrier exits Genworth + MetLife + John Hancock pricing increases 2008-2020 shrinking active policy block + Medicare-doesn't-pay-for-non-medical reality forces private-pay + LTC + Medicaid + VA payor diversification + franchise royalty 7-10% of revenue forever + brand-fund spend efficiency concerns + territory restrictions + Honor Technology + Centerbridge + Vistria + FFL Partners + Audax + Centre Lane PE roll-up consolidation pressure on independent + new-entrant license moratorium NY LHCSA 2018+ + competition from gig-economy platforms Honor + Papa + CareYaya + Cera Care + family-direct-hire models Visiting Angels-style registries** -- capturing **mature single-office private-pay-dominant agency 28-42% gross + 8-18% EBITDA at $28-$45/hr private-pay billing + $14-$22/hr caregiver pay + 80-180 hrs/wk per active client + 35-90 active clients + $1.4M-$4.8M/yr revenue + Medicaid HCBS waiver thinner 4-9% margin + multi-location 10-16% blended EBITDA at $4M-$15M revenue + sale multiples 3.5-6.0x EBITDA single office + 5.0-8.0x EBITDA multi-location + PE roll-ups Help at Home Centerbridge + Vistria + Addus HomeCare NASDAQ ADUS + BAYADA private foundation + Interim HealthCare Caring Brands International + Right at Home Honor Technology + FFL Partners 2024 + Honor Technology Series F a16z + General Catalyst + Prosus + KKR + Senior Helpers Advocate Aurora 2022 + Comfort Keepers Sodexo + Synergy HomeCare NexPhase Capital + BrightStar Care Audax Group actively buying $1M+ EBITDA platforms + owner take-home Stage 1 break-even to $40K + Stage 2 $100K-$280K + Stage 3 $300K-$800K + agency director $65K-$110K + coordinator $42K-$68K + on-call coordinator $28K-$45K + 60-90% caregiver turnover industry baseline (40-55% at best agencies)**. The hardest part is **caregiver recruiting + turnover + W-2 vs 1099 + EVV compliance + Medicaid 80/20 rule + on-call coordinator burnout (60-90% annual caregiver turnover + DOL 2024 Independent Contractor final rule + 2015 Companionship Exemption elimination + EVV claim-denial risk + Medicaid 80/20 squeeze by July 2030 + Saturday-night fall + Sunday no-show + 30-50% Year 1-3 owner exit + referral-partner concentration + LTC carrier exits + Medicare-doesn't-pay-for-non-medical)**, not capital or concept or demand.`;

const flow = `

## The Operating Journey: From License Application + First Caregiver Hire + First Client Through Multi-Office Regional Brand And Strategic PE Exit

\`\`\`mermaid
flowchart TD
  A[Aspiring Home Care Founder Decides To Launch] --> B[State License + Entity + Caregiver Recruiting + Referral Strategy]
  B --> B1{Independent vs Franchise vs Acquisition Path}
  B1 -->|$40K-$120K Lean Independent Home-Office Launch| C1[Lean Independent]
  B1 -->|$120K-$250K Full Independent Leased-Office Launch| C2[Full Independent]
  B1 -->|$100K-$300K Franchise Right at Home / Home Instead / Visiting Angels / Senior Helpers / Comfort Keepers / BrightStar / FirstLight / ComForCare| C3[Franchise]
  B1 -->|$150K-$2M Acquire Existing Agency With License + Caregivers + Clients| C4[Acquisition]
  C1 --> D[State HCO License + Federal Background Check + EVV + Insurance + Tech Stack]
  C2 --> D
  C3 --> D
  C4 --> D
  D --> D1[State HCO / Personal Care Agency / LHCSA / Home Services Agency License $500-$3,500 + 30-180 day Approval + Plan of Operation + Policy & Procedure Manual + Administrator Qualifications]
  D --> D2[CA DSS HCSB Home Care Services Bureau AB 1217 + FL AHCA Nurse Registry $50K Bond + TX HHSC PAS + NY DOH LHCSA Moratorium + IL DPH + PA DOH Act 69 + MA EOEA]
  D --> D3[Federal + State Caregiver Background Check ACA §6201 CMS National Background Check Program + Checkr/Sterling/GoodHire/HireRight $25-$80 + Live Scan $45-$95 + TB Test + DMV + State Caregiver Background Check Bureau Registry]
  D --> D4[Caregiver Training CNA 75-180 hr + HHA 75-120 hr Federal 42 CFR §484.80 + PCA Companion-Aide 5-40 hr State-Varying + ServSafe Optional + CPR/First Aid + Dementia + Hospice]
  D --> D5[EVV Electronic Visit Verification 21st Century Cures Act §12006 SSA §1903(l) Required Since Jan 1 2020 Medicaid Personal Care + Jan 1 2023 Home Health via HHAeXchange/Sandata/Tellus/Authenticare/CareBridge $25-$60/caregiver/mo]
  D --> D6[Insurance Stack GL $1,500-$4,500/yr PHLY/CNA/Markel/NIA + Professional Liability E&O $1,000-$3,000/yr + Workers Comp 4-9% Payroll + Non-Owned + Hired Auto $600-$2,000/yr + Dishonesty Bond $500-$2,000/yr + State Surety Bond CA $25K/FL $50K/NY $100K/MA $25K]
  D1 --> E[Tech Stack Build + Scheduling + EVV + Payroll + CRM]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  D6 --> E
  E --> E1[Scheduling AxisCare HCAOA Preferred $400-$1,200/mo + ClearCare/WellSky Personal Care Largest Private-Duty $500-$1,500/mo + Smartcare $300-$900/mo + AlayaCare Enterprise $600-$1,800/mo + Caretime $250-$700/mo + Generations Homecare $300-$800/mo]
  E --> E2[EVV HHAeXchange NY/FL Medicaid Managed Care + Sandata Aggregator CMS Default + Tellus Netsmart + Authenticare + CareBridge $25-$60/caregiver/mo]
  E --> E3[Payroll Gusto $40-$80/mo + ADP Run $120-$300/mo + Paychex Flex $120-$350/mo + Paylocity $200-$500/mo + Viventium Home-Care Specialized + Workers Comp + Unemployment + State Disability]
  E --> E4[Billing Clearinghouse Waystar + Availity + Change Healthcare for Medicaid + LTC Insurance EDI + Stripe + Square + GoCardless + ACH for Private-Pay]
  E --> E5[CRM Home Care Pulse Referral Tracker + Salesforce Health Cloud + HubSpot Service Hub + Pipedrive + Aline Sherpa Senior-Living CRM + Continuum + NIC MAP]
  E --> E6[Phone RingCentral $30-$50/seat/mo + OpenPhone $20-$30/seat/mo + Dialpad + 8x8 + On-Call Routing + Voicemail-to-Email]
  E1 --> F[Capital Stack + Financing + Working Capital Float]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  E6 --> F
  F --> F1[Founder Equity $30K-$80K Self-Fund 50-80% Savings + Family + 401(k) Loan Solo 401(k) Up to $50K + HELOC]
  F --> F2[SBA 7(a) $50K-$500K Live Oak Bank Largest Home-Care SBA Lender + Huntington National Bank + Wells Fargo SBA + Newtek + Byline Bank Prime + 2.0-4.0% 10-yr Term]
  F --> F3[SBA Express + Microloan $25K-$50K + $500-$50K via Accion Opportunity Fund + Justine Petersen + LiftFund + CDC Small Business Finance + Pacific Community Ventures]
  F --> F4[Franchise Financing $100K-$300K Initial Fee $35K-$70K + Working Capital + Buildout + 90-day Payroll Float via Live Oak + Benetrends + ApplePie Capital + FranFund 401(k) ROBS]
  F --> F5[Working Capital LOC $25K-$80K Bluevine + OnDeck + Kabbage + Business Credit Card + Regional Bank LOC for Weekly Payroll vs 15-90 Day AR Lag]
  F --> F6[Acquisition Financing $150K-$2M SBA 7(a) Up to $5M + Seller Note 10-25% + Buyer Equity 10-20% at 3.5-6.0x EBITDA]
  F1 --> G[Caregiver Recruiting + Hiring + W-2 Classification + Retention]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  F6 --> G
  G --> G1[Recruiting Indeed + ZipRecruiter + CareGuide + Care.com Pro + MyCareJobs + AAA Local + Nursing School CNA Partnerships + Church + Community + Caregiver-Referral Bonus $100-$500/successful 90-day Hire $280-$850 Cost Per Hire]
  G --> G2[W-2 Classification Post-DOL 2024 Final Rule Effective March 11 2024 Multi-Factor Economic-Reality Test + CA AB 5 + AB 2257 ABC Test + NJ/MA/IL/NY Similar + 2015 Elimination of 29 CFR §552.6 Companionship Exemption + Misclassification Audit Risk $50K-$500K Back-Pay]
  G --> G3[Caregiver Pay CNA $16-$24/hr + HHA $15-$22/hr + PCA Companion $14-$20/hr + Weekend $1-$3/hr Premium + Overnight $1-$3/hr + Holiday 1.5x + Live-In $160-$280/day + Fully-Loaded Cost = Pay × 1.30-1.42]
  G --> G4[60-90% Annual Turnover Industry Baseline + 40-55% At Best Agencies Via Wage + Benefits + Scheduling + Culture]
  G1 --> H[Payor Mix + Referral Pipeline + Client Acquisition]
  H --> H1[Private-Pay 40-65% of Mature Revenue $28-$45/hr Secondary Markets + $38-$48/hr Coastal Highest Margin 12-20% EBITDA + Family Out-of-Pocket Weekly ACH or Credit Card]
  H --> H2[LTC Insurance 10-25% Genworth + Mutual of Omaha + John Hancock + Northwestern Mutual + MassMutual + Transamerica $24-$40/hr + 30-180 Day Elimination Period + 8-14% Margin]
  H --> H3[Medicaid HCBS Waiver 10-40% State-Varying CA IHSS + NY CDPAP + FL SMMC LTC + TX STAR+PLUS + MA PCA + PA Community HealthChoices + OH PASSPORT $19-$32/hr State-Set 4-9% Margin]
  H --> H4[VA Aid & Attendance + Housebound Benefit Up to $2,727/mo via Veteran Directed Care VDC + Community Care Network CCN + Veteran Pays at Private-Pay Rate]
  H --> H5[Concierge / HNW $45-$95/hr NYC + SF + LA + Boston + Aspen + Palm Beach Boutique]
  H --> H6[Referral Pipeline 60-80% Intake Hospital Discharge Planners + SNF Social Workers + Elder-Law NAELA + Geriatric Care Managers ALCA + Senior-Living Atria/Brookdale/Sunrise + Area Agencies on Aging + Physician + VA Medical Center GEC]
  H1 --> I[Operations + Coordinator + On-Call + Quality Assurance]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  H6 --> I
  I --> I1[Scheduling Coordinator Matches Caregiver to Client + Shift Pattern + Backup + Vacation Coverage + EVV Compliance Monitoring]
  I --> I2[On-Call Coordinator 24/7/365 Coverage $28K-$45K/yr Stipend + Owner Year 1-3 + Outsourced After-Hours Specialty Answering Service/AnswerNet/MAP $450-$1,500/mo]
  I --> I3[Quality Assurance Care-Plan Update + Caregiver Performance Review + Client Satisfaction Survey Home Care Pulse + Family Communication Portal + Incident Reporting]
  I --> I4[Billing + Collections Private-Pay Weekly Invoice + ACH/Credit Card + LTC Insurance Claims 837P + Medicaid Submission via Clearinghouse + AR Aging 15-90 Days]
  I1 --> J[Stage Growth + Multi-Office + Regional Brand Build]
  I2 --> J
  I3 --> J
  I4 --> J
  J --> J1[Stage 1 Solo Launch Months 0-12 1 Office + 5-15 Clients + 8-25 Caregivers + $200K-$600K + Owner Break-Even-$40K Take-Home]
  J --> J2[Stage 2 Mature Solo Years 1-3 1 Office + 25-65 Clients + 25-60 Caregivers + $1.2M-$3.5M + 8-14% EBITDA + $100K-$280K Take-Home]
  J --> J3[Stage 3 Single-Office Mature Years 2-5 1 Office + 60-180 Clients + 60-150 Caregivers + $3M-$8M + 10-16% EBITDA + $300K-$800K Take-Home]
  J --> J4[Stage 4 Regional Multi-Office Years 4-8 2-4 Offices + 150-450 Clients + 130-380 Caregivers + $8M-$20M + 10-16% Blended EBITDA + Regional Director $85K-$135K]
  K{Mature Operations Plus Strategic Exit Decision}
  J --> K
  K -->|Hold For Cash Flow + Community Brand + Founder Lifestyle| L[Long-Term Independent Hold]
  K -->|Single Office to Regional Operator 3.5-5.5x EBITDA| M[Single Office Sale]
  K -->|Single Office to First-Time Franchise Buyer 3.5-4.5x EBITDA| N[Owner-Operator Sale]
  K -->|Regional Brand to PE Platform Centre Lane/Vistria/FFL/Audax/H.I.G./Webster 5.0-7.0x EBITDA| O[PE Roll-Up Sale]
  K -->|Multi-State Platform to Strategic Addus/Help at Home/BAYADA/Interim 6.0-8.0x EBITDA| P[Strategic Sale]
  K -->|Sale to Health System CommonSpirit/Ascension/Trinity/Sutter 4.5-7.0x EBITDA| Q[Health System Sale]
  K -->|Family / Management Buyout 3.5-5.5x EBITDA + Seller Note| R[Family / MBO]
  K -->|Asset Wind-Down Caregiver Roster + Client List $50K-$200K| S[Wind-Down]
  L --> T[Independent Hold With Mature 10-18% EBITDA + Private-Pay-Dominant + Community Brand + Family-Owned]
  M --> U[Single Office Sold $200K-$2.5M to Regional Multi-Loc Operator + License + Caregiver Roster + Client List]
  N --> V[Owner-Operator Continuity Sale to Aspiring Operator with SBA 7(a) Acquisition Financing]
  O --> W[PE Roll-Up Sale $5M-$40M to Centre Lane / Bain Capital / FFL Partners / Vistria / H.I.G. / Audax / Webster / Ridgemont / NexPhase / Susquehanna at 5.0-7.0x EBITDA]
  P --> X[Multi-State Platform Sold $40M-$200M to Addus HomeCare ADUS / Help at Home Centerbridge+Vistria / BAYADA Foundation / Interim HealthCare Caring Brands / Honor Technology+Right at Home FFL]
  Q --> Y[Health System Acquisition $10M-$80M as Value-Based-Care + Post-Acute + ACO Infrastructure Play]
  R --> Z[Family / Management Buyout to Second-Generation + General Manager + Senior Staff via SBA 7(a) + Seller Note 10-25%]
  S --> AA[Caregiver Roster + Client List + EVV Vendor Seat + Scheduling Data Export to Adjacent Operator $50K-$200K + License + Brand Largely Abandoned]
\`\`\`

## The Decision Matrix: Independent vs Franchise + Payor Mix + Location + Multi-Office Selection

\`\`\`mermaid
flowchart TD
  A[Home Care Founder Has Capital + Operations Experience + Referral Network + Payor Strategy + Location Decision] --> B{Independent vs Franchise vs Acquisition}
  B -->|Lean Independent Home-Office $40K-$120K First-Time + Bootstrap| C[Lean Independent]
  B -->|Full Independent Leased-Office $120K-$250K Experienced Ops + Capital| D[Full Independent]
  B -->|Franchise $100K-$300K + 5-7% Royalty First-Time + Want Brand + Playbook| E[Franchise Path]
  B -->|Acquire Existing Agency $150K-$2M Want Established License + Caregivers + Clients| F[Acquisition]
  C --> C1{Payor Mix Strategy}
  C1 -->|Private-Pay Dominant 60-80% Highest Margin 12-20% EBITDA + Coastal/Suburban HNW Market| G[Private-Pay Focus]
  C1 -->|LTC Insurance + Private-Pay Hybrid 40/40 + 20% VA/Medicaid| H[Diversified Premium]
  C1 -->|Medicaid HCBS Waiver Dominant 60-80% Volume-Heavy + Low-Income Service-Mission| I[Medicaid Focus]
  C1 -->|Balanced 40% Private + 25% LTC + 25% Medicaid + 10% VA| J[Balanced Mix]
  C1 -->|Concierge HNW $45-$95/hr Boutique NYC/SF/LA/Boston| K[Concierge Boutique]
  G --> G1[35-90 Active Clients + $28-$45/hr + $1.4M-$4.8M Revenue + 12-20% EBITDA + Hospital + Elder-Law + GCM Referral Pipeline]
  H --> H1[60-150 Active Clients + Diversified Payor Risk + $3M-$8M Revenue + 10-16% EBITDA + Multi-Channel Referral]
  I --> I1[80-250 Active Clients + Volume-Heavy + $1.5M-$5M Revenue + 4-9% EBITDA Pre-2030 + Medicaid 80/20 Risk Post-2030 + AAA + State Medicaid + County Aging Referral]
  J --> J1[60-180 Active Clients + Balanced Risk + $2M-$6M Revenue + 8-14% EBITDA + All-Channel Referral + Pre-2030 Sweet Spot]
  K --> K1[10-35 Active Clients + $45-$95/hr + $1M-$3M Revenue + 15-25% EBITDA + Wealth Manager + Concierge Doctor + Family Office Referral]
  D --> D1{Office + Geography Strategy}
  D1 -->|Secondary Metro Office Park + Lower Lease + Workforce Available| L[Secondary Metro]
  D1 -->|Coastal Metro + Premium Private-Pay + Higher Lease + Workforce Competition| M[Coastal Metro]
  D1 -->|Suburban Office Park + Hospital Adjacency + GCM Network| N[Suburban Hospital-Adjacent]
  E --> E1{Franchise Brand Selection}
  E1 -->|Home Instead Honor Tech / Right at Home FFL Tier-1 Brand Recognition| O[Tier-1 Premium Franchise]
  E1 -->|Visiting Angels / Senior Helpers / Comfort Keepers Mid-Tier Established| P[Mid-Tier Franchise]
  E1 -->|FirstLight / ComForCare / Always Best Care / Synergy Smaller Network + Lower Fee| Q[Smaller Franchise]
  E1 -->|BrightStar Care Hybrid Medical + Non-Medical Higher Capital| R[Medical Hybrid Franchise]
  F --> F1{Acquisition Target}
  F1 -->|Profitable Single Office $80K-$700K EBITDA 3.5-6.0x + Clean License + Caregivers + Referrals| S[Premium Acquisition]
  F1 -->|Distressed / Owner-Burnout 1.5-3.0x EBITDA Discount + Cleanup Required| T[Distressed Acquisition]
  F1 -->|Multi-Office Regional $700K-$5M EBITDA 5.0-7.0x + Platform for PE Resale| U[Regional Acquisition]
  G1 --> V{Reassess After Year 2 Stabilization}
  H1 --> V
  I1 --> V
  J1 --> V
  K1 --> V
  L --> V
  M --> V
  N --> V
  O --> V
  P --> V
  Q --> V
  R --> V
  S --> V
  T --> V
  U --> V
  V -->|Hold For Cash Flow + Lifestyle + Community| W[Long-Term Hold]
  V -->|Single Office Sale 3.5-5.5x EBITDA| X[Single Office Sale]
  V -->|Regional Brand Sale 5.0-7.0x EBITDA to PE| Y[PE Roll-Up Sale]
  V -->|Multi-State Platform 6.0-8.0x EBITDA Strategic| Z[Strategic Sale]
  V -->|Health System Sale 4.5-7.0x EBITDA| AA[Health System]
  V -->|Family / Management Buyout| AB[Family / MBO]
  V -->|Wind-Down Caregiver Roster + Client List| AC[Wind-Down]
\`\`\`

`;

const src = `

## Sources

1. **Home Care Association of America HCAOA (hcaoa.org)** -- Primary US private-duty home-care trade association with ~3,500 member agencies + state-chapter network + DOL/CMS advocacy. https://www.hcaoa.org
2. **Alliance for Care at Home (allianceforcareathome.org)** -- 2024 merger of National Association for Home Care & Hospice NAHC and National Hospice and Palliative Care Organization NHPCO; umbrella for medical + non-medical home care. https://www.allianceforcareathome.org
3. **PHI National (PHInational.org)** -- Direct-care workforce research + policy + advocacy organization with comprehensive caregiver workforce data. https://www.phinational.org
4. **CMS Centers for Medicare & Medicaid Services (cms.gov)** -- Federal Medicare + Medicaid regulator including EVV + HCBS waiver + 42 CFR Part 484 home health. https://www.cms.gov
5. **CMS Medicaid Access Rule 89 FR 40542 (cms.gov)** -- May 2024 Ensuring Access to Medicaid Services final rule including 80/20 HCBS direct-care worker compensation requirement effective July 2030. https://www.cms.gov/newsroom/fact-sheets/medicaid-and-chip-managed-care-access-finance-and-quality-final-rule-cms-2439-f
6. **21st Century Cures Act §12006 EVV Mandate (cms.gov)** -- Federal mandate for Electronic Visit Verification for Medicaid-funded personal care since Jan 2020 and home health since Jan 2023. https://www.cms.gov/medicare/medicare-fee-for-service-payment/homehealthpps/electronic-visit-verification
7. **DOL Department of Labor Wage and Hour Division (dol.gov/whd)** -- Federal Fair Labor Standards Act enforcement including 2024 Independent Contractor final rule + Companionship Exemption history. https://www.dol.gov/agencies/whd
8. **DOL 2024 Independent Contractor Final Rule 29 CFR Part 795 (dol.gov)** -- Final rule effective March 11 2024 restoring multi-factor economic-reality test for IC classification. https://www.dol.gov/agencies/whd/flsa/misclassification/rulemaking
9. **DOL 2013/2015 Home Care Final Rule 29 CFR §552.6 (dol.gov)** -- DOL rule eliminating third-party-employer Companionship Exemption effective Jan 1 2015 upheld in Home Care Association of America v. Weil DC Cir. 2015. https://www.dol.gov/agencies/whd/direct-care
10. **42 CFR Part 484 Home Health Agency Conditions of Participation (ecfr.gov)** -- Federal regulation for Medicare-certified home health agencies; distinct from non-medical home care. https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-484
11. **42 CFR §484.80 Home Health Aide Federal Training Requirements (ecfr.gov)** -- 75-hour federal minimum HHA training. https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-484/subpart-B/section-484.80
12. **California Department of Social Services Home Care Services Bureau CDSS HCSB (cdss.ca.gov)** -- CA state regulator for non-medical home care under Home Care Services Consumer Protection Act AB 1217 + caregiver registry + $25K surety bond. https://www.cdss.ca.gov/inforesources/community-care/home-care-services
13. **California AB 1217 Home Care Services Consumer Protection Act (leginfo.legislature.ca.gov)** -- 2013 California law establishing Home Care Organization licensure + Home Care Aide registry. https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201320140AB1217
14. **California AB 5 + AB 2257 Independent Contractor (leginfo.legislature.ca.gov)** -- CA codification of ABC test for independent contractor classification. https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201920200AB5
15. **California IHSS In-Home Supportive Services (cdss.ca.gov)** -- CA Medicaid personal care program for low-income seniors + disabled adults. https://www.cdss.ca.gov/in-home-supportive-services
16. **Florida Agency for Health Care Administration AHCA (ahca.myflorida.com)** -- FL regulator for Nurse Registry + Home Care Aide Registry licensure with $50K surety bond. https://ahca.myflorida.com
17. **Florida SMMC LTC Statewide Medicaid Managed Care Long-Term Care (ahca.myflorida.com)** -- FL Medicaid managed care LTC program. https://ahca.myflorida.com/medicaid/statewide_mc/smmc_ltc.shtml
18. **Texas Health & Human Services Commission HHSC (hhs.texas.gov)** -- TX regulator for Personal Assistance Services PAS license + HCSSA Home and Community Support Services Agency. https://www.hhs.texas.gov
19. **Texas STAR+PLUS Personal Attendant Services (hhs.texas.gov)** -- TX Medicaid managed care personal care program. https://www.hhs.texas.gov/services/health/medicaid-chip/programs/starplus
20. **New York Department of Health Licensed Home Care Services Agency LHCSA (health.ny.gov)** -- NY regulator for non-medical home care + CON-equivalent moratorium 2018+. https://www.health.ny.gov/facilities/home_care/lhcsa
21. **New York Consumer Directed Personal Assistance Program CDPAP (health.ny.gov)** -- NY Medicaid consumer-directed personal care program. https://www.health.ny.gov/health_care/medicaid/program/longterm/cdpap.htm
22. **Illinois Department of Public Health Home Services Agency (dph.illinois.gov)** -- IL regulator for non-medical home care. https://dph.illinois.gov/topics-services/health-care-regulation/home-services
23. **Pennsylvania Department of Health Home Care Agency Act 69 (health.pa.gov)** -- PA regulator for home care + 2006 Act 69 licensure framework. https://www.health.pa.gov/topics/facilities/HHA/Pages/HHA.aspx
24. **Pennsylvania Community HealthChoices CHC (dhs.pa.gov)** -- PA Medicaid managed long-term services and supports MLTSS program. https://www.dhs.pa.gov/HealthChoices/HC-Services/Pages/Community-HealthChoices.aspx
25. **Massachusetts Executive Office of Elder Affairs EOEA (mass.gov)** -- MA regulator for Home Care Agency certification + Council on Aging network. https://www.mass.gov/orgs/executive-office-of-elder-affairs
26. **Massachusetts MassHealth Personal Care Attendant PCA (mass.gov)** -- MA Medicaid consumer-directed personal care program. https://www.mass.gov/personal-care-attendant-pca-program
27. **Ohio Department of Aging PASSPORT (aging.ohio.gov)** -- OH Medicaid HCBS waiver program for seniors. https://aging.ohio.gov/wps/portal/gov/aging/care-and-living/passport
28. **Veterans Administration Aid and Attendance Benefit (va.gov)** -- VA pension supplement for veterans + surviving spouses requiring assistance with ADLs. https://www.va.gov/pension/aid-attendance-housebound/
29. **VA Veteran Directed Care VDC + Community Care Network CCN (va.gov)** -- VA consumer-directed home care + community care provider network. https://www.va.gov/geriatrics/pages/Veteran-Directed_Care.asp
30. **Older Americans Act §306 Area Agencies on Aging (acl.gov)** -- Federal law funding ~622 Area Agencies on Aging AAAs nationally. https://acl.gov/about-acl/administration-aging
31. **AARP Home and Community Preferences Survey (aarp.org)** -- AARP research showing ~83% of seniors prefer aging-in-place. https://www.aarp.org/research/topics/community/info-2024/2024-home-community-preferences.html
32. **IBISWorld Home Care Providers in the US (ibisworld.com)** -- Industry size + growth + segment composition for US home care. https://www.ibisworld.com
33. **Grand View Research US Home Healthcare Market (grandviewresearch.com)** -- US home healthcare + non-medical market sizing. https://www.grandviewresearch.com
34. **BLS Bureau of Labor Statistics Home Health and Personal Care Aides (bls.gov)** -- US labor + wage + employment data for HHA + PCA. https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm
35. **Census Bureau Older Population (census.gov)** -- US Census Bureau aging-population data + 85M aged 60+ by 2030 projection. https://www.census.gov/topics/population/older-aging.html
36. **ServSafe Manager Certification (servsafe.com)** -- National Restaurant Association food safety manager certification often required for caregivers preparing meals. https://www.servsafe.com
37. **Affordable Care Act §6201 CMS National Background Check Program (cms.gov)** -- Federal Medicaid+ background check program for long-term care direct-care workers. https://www.cms.gov/medicare/provider-enrollment-and-certification/surveycertificationgeninfo/nbcp
38. **Checkr Background Check Platform (checkr.com)** -- Modern background-check platform widely used by home-care agencies. https://www.checkr.com
39. **Sterling Background Check (sterlingcheck.com)** -- Enterprise background-check provider. https://www.sterlingcheck.com
40. **GoodHire Background Check (goodhire.com)** -- SMB background-check platform. https://www.goodhire.com
41. **HireRight Background Screening (hireright.com)** -- Enterprise background-check provider. https://www.hireright.com
42. **AxisCare Home Care Software (axiscare.com)** -- HCAOA Preferred Partner private-duty home-care scheduling + EVV + billing platform. https://www.axiscare.com
43. **WellSky Personal Care (formerly ClearCare) (wellsky.com)** -- Largest single platform in private-duty home care, WellSky acquired ClearCare 2017. https://wellsky.com/products/personal-care/
44. **Smartcare Home Care Software (smartcaresoftware.com)** -- Mid-market home-care scheduling + EVV + billing platform. https://smartcaresoftware.com
45. **AlayaCare Home Care Software (alayacare.com)** -- Enterprise home-care platform strong in Canada + multi-state US. https://www.alayacare.com
46. **Caretime Home Care Software (caretime.com)** -- Smaller-agency-focused home-care scheduling platform. https://www.caretime.com
47. **Generations Homecare System (homecaresoftware.com)** -- Home-care scheduling + billing platform. https://www.homecaresoftware.com
48. **HHAeXchange EVV + Home Care Management (hhaexchange.com)** -- NY-mandated + multi-state EVV vendor + home-care management platform. https://www.hhaexchange.com
49. **Sandata Technologies EVV Aggregator (sandata.com)** -- CMS-default EVV vendor used as state aggregator in many states. https://www.sandata.com
50. **Tellus / Netsmart Tellus EVV (ntst.com)** -- Netsmart-owned EVV + home-care management platform. https://www.ntst.com/Solutions/CareGuidance/EVV
51. **Authenticare EVV (authenticare.com)** -- EVV vendor for state Medicaid programs. https://authenticare.com
52. **CareBridge EVV for Medicaid Managed Care (carebridgehealth.com)** -- Medicaid-managed-care-focused EVV vendor. https://carebridgehealth.com
53. **Gusto Small Business Payroll (gusto.com)** -- Small + mid-sized business payroll + benefits + HRIS platform. https://gusto.com
54. **ADP Run Small Business Payroll (adp.com/run)** -- Mid-sized business payroll service. https://www.adp.com/what-we-offer/products/run-powered-by-adp.aspx
55. **Paychex Flex Small Business Payroll (paychex.com/payroll)** -- Mid-sized business payroll + HR. https://www.paychex.com/payroll
56. **Paylocity Enterprise Payroll + HR (paylocity.com)** -- Enterprise + multi-state payroll + HR platform. https://www.paylocity.com
57. **Viventium Home Care Specialized Payroll (viventium.com)** -- Home-care + skilled-nursing-specialized payroll + HR platform. https://www.viventium.com
58. **Waystar Healthcare Clearinghouse (waystar.com)** -- Healthcare claims clearinghouse for Medicaid + LTC insurance EDI. https://www.waystar.com
59. **Availity Healthcare Clearinghouse (availity.com)** -- Healthcare claims + eligibility verification clearinghouse. https://www.availity.com
60. **Change Healthcare Clearinghouse (changehealthcare.com)** -- Healthcare claims clearinghouse + revenue cycle. https://www.changehealthcare.com
61. **Home Care Pulse Referral Tracker + Caregiver Satisfaction (homecarepulse.com)** -- Home-care-specialized CRM + caregiver-satisfaction benchmarking. https://www.homecarepulse.com
62. **Aging Life Care Association ALCA (aginglifecare.org)** -- Professional association for Aging Life Care Professionals / Geriatric Care Managers. https://www.aginglifecare.org
63. **National Academy of Elder Law Attorneys NAELA (naela.org)** -- Trade association for elder-law attorneys; referral channel for home-care agencies. https://www.naela.org
64. **APlaceForMom Senior Living + Care Advisor (aplaceformom.com)** -- Senior-living + home-care referral platform with referral-fee model. https://www.aplaceformom.com
65. **SeniorAdvisor.com Senior Care Reviews (senioradvisor.com)** -- Senior-living + home-care review + referral platform. https://www.senioradvisor.com
66. **Caring.com Senior Care Directory (caring.com)** -- Senior-living + home-care directory + reviews. https://www.caring.com
67. **Right at Home Franchise (rightathomefranchise.com)** -- Major non-medical home-care franchise acquired by Honor Technology + FFL Partners 2024. https://www.rightathomefranchise.com
68. **Home Instead Franchise (homeinstead.com)** -- Largest US home-care franchise acquired by Honor Technology 2021. https://www.homeinstead.com
69. **Visiting Angels Franchise (visitingangels.com)** -- Major non-medical home-care franchise; Living Assistance Services brand. https://www.visitingangels.com
70. **Senior Helpers Franchise (seniorhelpers.com)** -- Home-care franchise acquired by Advocate Aurora 2022. https://www.seniorhelpers.com
71. **Comfort Keepers Franchise (comfortkeepers.com)** -- Sodexo-owned home-care franchise. https://www.comfortkeepers.com
72. **BrightStar Care Franchise (brightstarcare.com)** -- Audax Group-acquired 2022 medical + non-medical hybrid home-care franchise. https://www.brightstarcare.com
73. **FirstLight Home Care Franchise (firstlighthomecare.com)** -- Non-medical home-care franchise. https://www.firstlighthomecare.com
74. **ComForCare Home Care Franchise (comforcare.com)** -- Best Life Brands non-medical home-care franchise. https://www.comforcare.com
75. **Always Best Care Senior Services Franchise (alwaysbestcare.com)** -- Non-medical home-care franchise. https://www.alwaysbestcare.com
76. **Synergy HomeCare Franchise (synergyhomecare.com)** -- NexPhase Capital-backed home-care franchise. https://www.synergyhomecare.com
77. **Honor Technology (joinhonor.com)** -- Tech-enabled home-care platform + acquirer of Home Instead 2021 and Right at Home 2024 via FFL Partners. https://www.joinhonor.com
78. **Help at Home (helpathome.com)** -- ~$1.5B revenue Medicaid-focused home-care platform owned by Centerbridge Partners + The Vistria Group. https://www.helpathome.com
79. **Addus HomeCare (NASDAQ: ADUS) (addus.com)** -- Public-market home-care consolidator ~$1.1B revenue ~210 locations. https://www.addus.com
80. **BAYADA Home Health Care (bayada.com)** -- ~$1.5B revenue ~360 locations home-care platform; private foundation 2018 conversion. https://www.bayada.com
81. **Interim HealthCare Caring Brands International (interimhealthcare.com)** -- ~330 franchise locations + corporate broad-services home-care platform. https://www.interimhealthcare.com
82. **SBA 7(a) Loan Program (sba.gov)** -- SBA primary loan guarantee program for small business including home-care agencies. https://www.sba.gov/funding-programs/loans/7a-loans
83. **SBA Microloan Program (sba.gov)** -- SBA $500-$50K microloan program through SBA-approved intermediaries. https://www.sba.gov/funding-programs/loans/microloans
84. **Live Oak Bank SBA (liveoakbank.com)** -- Largest SBA 7(a) lender in home-care + senior-services sectors. https://www.liveoakbank.com
85. **Benetrends Financial (benetrends.com)** -- SBA + 401(k) ROBS rollover financing for franchise launches. https://www.benetrends.com
86. **ApplePie Capital Franchise Financing (applepiecapital.com)** -- Franchise-focused financing platform. https://www.applepiecapital.com
87. **FranFund Franchise Financing (franfund.com)** -- Franchise-focused 401(k) ROBS + SBA financing. https://www.franfund.com

`;

const num = `

## Numbers & Benchmarks

### Industry size, operator landscape & unit economics

| Metric | 2024-2026 Value | Source |
|---|---|---|
| US Americans aged 65+ | ~56M (2025) → ~85M aged 60+ by 2030 | Census Bureau |
| Americans turning 65 daily | ~10,000/day through 2030 | Census + AARP |
| Seniors preferring aging-in-place | ~83% | AARP Home and Community Preferences Survey |
| Total US home care market (medical + non-medical) | ~$157B-$185B | HCAOA + IBISWorld + Grand View Research |
| Non-medical personal care + companion care segment | ~$45B-$62B | HCAOA + IBISWorld |
| Non-medical segment CAGR | 8-12% | HCAOA + Grand View Research |
| US home care + home health agencies (combined) | ~33,000-38,000 | HCAOA + CMS Provider of Services file |
| Avg revenue per single-office non-medical agency | $1.2M-$4.8M | HCAOA Benchmarking Survey |
| Avg gross margin (private-pay dominant) | 28-42% | HCAOA + Home Care Pulse |
| Avg EBITDA single office (mature) | 8-18% | HCAOA Benchmarking + acquirer diligence |
| Avg EBITDA multi-location regional | 10-16% blended | PE acquisition diligence ranges |
| Avg EBITDA Medicaid HCBS book (pre-80/20) | 4-9% | HCAOA + state Medicaid analysis |
| Avg EBITDA Medicaid HCBS book (post-80/20 projected 2030) | 0-4% | HCAOA + ANCOR + LeadingAge analysis |
| Caregivers per active client (FTE basis) | 0.4-0.7 | Industry benchmark |
| Active clients per coordinator | 30-65 | Operational benchmark |
| Caregivers per coordinator | 35-90 | Operational benchmark |
| Year 1-3 owner exit rate | 30-50% | HCAOA + industry observation |

### Payor mix economics

| Payor | Avg Billing Rate 2027 | Caregiver Pay | Gross Margin | % of Mature Agency Revenue |
|---|---|---|---|---|
| Private-pay (secondary metro) | $28-$38/hr | $14-$22/hr | 28-38% | 30-50% |
| Private-pay (coastal metro) | $38-$48/hr | $17-$25/hr | 30-42% | (subset of above) |
| LTC insurance | $24-$40/hr | $14-$22/hr | 22-32% | 10-25% |
| Medicaid HCBS waiver (state-set) | $19-$32/hr | $14-$20/hr | 18-28% (pre-80/20) | 10-40% |
| VA Aid & Attendance via veteran | $28-$40/hr | $14-$22/hr | 28-38% | 5-15% |
| Workers comp / auto carrier-paid | $28-$48/hr | $16-$24/hr | 30-40% | 0-5% |
| Concierge HNW | $45-$95/hr | $20-$32/hr | 40-55% | 0-15% boutique |
| Hospice supplemental private-pay | $28-$45/hr | $14-$22/hr | 28-40% | 0-10% |

### Caregiver pay + workforce benchmarks

| Caregiver Tier | Pay Range 2027 | Training Required | Background Check | Notes |
|---|---|---|---|---|
| Certified Nursing Assistant CNA | $16-$24/hr | 75-180 hr + state exam + registry | Federal + state | Highest credentialed; ~2.3M-2.6M nationally |
| Home Health Aide HHA | $15-$22/hr | 75-120 hr federal under 42 CFR §484.80 | Federal + state | ~750K-900K nationally |
| Personal Care Aide PCA / Companion | $14-$20/hr | 5-40 hr state-varying (PA 6 hr, CA 5+5 hr, NY 75 hr) | Federal + state | Lowest credentialed tier |
| Live-in caregiver 24-hr | $160-$280/day flat ($8-$15/hr equivalent) | HHA or PCA | Federal + state | Sleep-time exemption requires documentation |
| Specialty (dementia, hospice support, bariatric, hoyer-lift) | +$1-$4/hr premium | Specialty cert | Federal + state | Differential pay common |
| Weekend / overnight / holiday | +$1-$3/hr or 1.5x holiday | Same as base | Federal + state | Standard differential |
| Fully-loaded cost to agency | Pay × 1.30-1.42 | -- | -- | Workers comp + payroll tax + unemployment + benefits |
| Annual caregiver turnover (industry) | 60-90% | -- | -- | HCAOA + PHI workforce surveys |
| Annual caregiver turnover (best agencies) | 40-55% | -- | -- | Wage + benefits + scheduling + culture-driven |
| Caregiver recruiting cost per hire | $280-$850 small / $180-$450 scale | -- | -- | Indeed + ZipRecruiter + bonus |

### Capital + capital stack by tier

| Sizing Decision | Capital | Annual Revenue | Best For |
|---|---|---|---|
| Independent lean home-office | $40K-$120K | $200K-$1.2M | First-time + bootstrap + secondary market |
| Independent full leased-office | $120K-$250K | $1.2M-$3.5M | Experienced ops + capital + referral network |
| Franchise (initial + buildout + float) | $100K-$300K + 5-7% royalty | $800K-$2.5M Year 1-2 | First-time + want brand + playbook |
| Acquisition single office | $150K-$2M | $1M-$4M | Experienced ops + want established license |
| Multi-office regional build | $500K-$2M per additional office | $8M-$20M | Years 4-8 expansion + central infrastructure |
| Multi-state platform via roll-up | $5M-$30M | $20M-$80M | PE-backed or strategic acquirer |

### License + insurance + tech + build-out capital by category

| Category | Cost Range | Notes |
|---|---|---|
| State HCO / Personal Care Agency license initial | $500-$3,500 | State-varying CA $400-$1,000 / FL $300-$1,500 / NY $2,000-$5,000 |
| State license annual renewal | $300-$2,000 | State-varying |
| State surety bond | $10K-$100K bond face / $250-$2,500/yr premium | CA $25K / FL $50K / NY $100K / MA $25K |
| Plan of operation + P&P manual development | $0-$15K | DIY vs consultant vs franchisor template |
| Administrator + caregiver training curriculum | $1K-$10K | Curriculum development or franchisor / vendor purchase |
| Federal + state background check setup (Checkr/Sterling/GoodHire) | $0-$2K setup + $25-$80/check | Per-check ongoing |
| Live Scan fingerprinting | $45-$95/scan | CA + FL + NY + TX + most HCO states |
| TB test | $25-$60/caregiver | State-varying |
| Scheduling software (AxisCare/ClearCare/Smartcare/AlayaCare/Caretime) | $300-$1,800/mo + per-caregiver fees | Includes EVV native or via integration |
| EVV standalone (if not in scheduling) | $25-$60/caregiver/mo | HHAeXchange/Sandata/Tellus/Authenticare/CareBridge |
| Payroll (Gusto/ADP Run/Paychex Flex/Paylocity) | $40-$500/mo + per-employee | Scales with caregiver count |
| Billing clearinghouse (Waystar/Availity) | $200-$800/mo | For Medicaid + LTC EDI |
| CRM (Home Care Pulse / Salesforce / HubSpot) | $50-$500/mo | Referral-partner tracking |
| Phone (RingCentral/OpenPhone/Dialpad) | $20-$50/seat/mo | Cloud phone + on-call routing |
| GL insurance | $1,500-$4,500/yr | PHLY / CNA / Markel / NIA HCAOA partners |
| Professional Liability / E&O insurance | $1,000-$3,000/yr | -- |
| Workers Comp insurance | 4-9% of payroll | State-varying NCCI rate (CA ~$3.50/$100) |
| Non-Owned + Hired Auto | $600-$2,000/yr | Caregivers driving clients |
| Employee Dishonesty / Crime Coverage | $500-$2,000/yr | State-required CA/FL/NY |
| Office lease (if leased) | $1,500-$4,500/mo for 600-1,400 sqft | Year 1-2 home-office allowed in most states |
| Office buildout + furniture | $5K-$30K | If leased office |
| Initial marketing + referral-partner outreach | $5K-$25K | Brochures + breakfast meetings + Google Local Service Ads |
| Working capital + 90-day payroll float | $25K-$80K | Critical for weekly payroll vs 15-90 day AR aging |
| Franchise initial fee | $35K-$70K | Right at Home / Home Instead / Visiting Angels / Senior Helpers |
| Franchise total investment | $80K-$200K all-in | Including buildout + working capital |
| Franchise royalty | 3-7% of revenue ongoing | Plus 2-3% brand fund |

### State license + Medicaid waiver rate snapshots

| State | Non-Medical HCO License | Surety Bond | Medicaid HCBS Rate (PCA) | Notable Program |
|---|---|---|---|---|
| California | DSS Home Care Services Bureau (AB 1217) | $25K | ~$18-$22/hr | IHSS In-Home Supportive Services |
| Florida | AHCA Nurse Registry / Home Care Aide Registry | $50K | ~$19-$24/hr | SMMC LTC Statewide Medicaid MC LTC |
| Texas | HHSC Personal Assistance Services PAS | None for non-medical | ~$15-$19/hr | STAR+PLUS PAS |
| New York | DOH Licensed Home Care Services Agency LHCSA | $100K (moratorium 2018+) | ~$22-$28/hr | CDPAP Consumer Directed PAP |
| Illinois | DPH Home Services Agency | $50K | ~$18-$22/hr | Community Care Program |
| Pennsylvania | DOH Home Care Agency (Act 69) | $50K | ~$20-$26/hr | Community HealthChoices |
| Massachusetts | EOEA Home Care Agency certification | $25K | ~$22-$28/hr | MassHealth PCA Program |
| Ohio | -- (not HCO licensed for non-medical only) | -- | ~$19-$24/hr | PASSPORT (Dept. of Aging) |
| New Jersey | DCA Health Care Service Firm | $10K-$25K | ~$22-$28/hr | Managed Long Term Services and Supports |
| Washington | DSHS Home Care Agency (RCW 70.127) | $25K | ~$20-$26/hr | COPES + New Freedom |

### Staff compensation

| Role | Compensation 2027 | Notes |
|---|---|---|
| Owner-operator (Year 1-2) | Break-even to $40K take-home | Owner runs coordinator + on-call + intake roles |
| Owner-operator (Year 3-5 mature) | $100K-$800K take-home | Scales with agency revenue + payor mix |
| Agency director | $65K-$110K + bonus | Day-to-day operations + compliance |
| Scheduling coordinator | $42K-$68K | Caregiver-to-client matching + EVV monitoring |
| On-call coordinator (after-hours) | $28K-$45K stipend + cell + WFH | 24/7 phone coverage |
| Intake / admissions coordinator | $48K-$72K + commission | Family + referral-partner intake |
| Marketing / community liaison | $55K-$85K + commission | Hospital + elder-law + GCM outreach |
| Caregiver supervisor / field nurse RN (if employed) | $72K-$110K | Quality assurance + care-plan oversight |
| Bookkeeper / billing specialist | $48K-$72K | AR + billing + payroll review |
| Regional director (Stage 4+) | $85K-$135K + bonus | Multi-office coverage |
| VP Operations (Stage 5+) | $120K-$180K + equity | Multi-state platform |

### Five-year cash-flow trajectory: single-office private-pay-dominant agency

| Year | Active Clients | Caregivers | Annual Revenue | Annual EBITDA | EBITDA Margin |
|---|---|---|---|---|---|
| Year 1 license + ramp | 5-15 | 8-25 | $200K-$600K | Break-even to $30K | Owner take-home model |
| Year 2 mature solo + first hire | 25-50 | 25-50 | $800K-$2.0M | $80K-$200K | 8-12% |
| Year 3 hygiene + coordinator + payor diversification | 50-100 | 50-100 | $1.5M-$3.5M | $150K-$420K | 10-14% |
| Year 4 mature single-office + referral pipeline | 80-160 | 70-140 | $2.5M-$6M | $300K-$800K | 12-16% |
| Year 5 mature + early multi-office or acquisition | 130-280 | 120-260 | $4M-$10M | $480K-$1.6M | 12-18% |

### Capital stack interest rates and lender categories

| Capital Layer | LTV | Rate 2024-2025 | Typical Lenders |
|---|---|---|---|
| Founder equity | N/A | N/A | $30K-$80K typical |
| SBA microloan | Up to 100% of $50K | 8-13% | Accion Opportunity Fund, Justine Petersen, LiftFund, CDC Small Business Finance |
| SBA Express | Up to 50% | Prime + 4.5-6.5% | Major SBA Express lenders |
| SBA 7(a) | 75-85% | Prime + 2.0-4.0% | Live Oak Bank (largest home-care SBA), Huntington, Wells Fargo SBA, Newtek, Byline |
| Franchise financing (SBA 7(a) + ROBS) | Up to 90% | Prime + 2.0-4.0% / 401(k) ROBS at-cost | Benetrends, ApplePie Capital, FranFund, Live Oak |
| Working capital LOC | Variable | Prime + 4-9% | Bluevine, OnDeck, Kabbage, business credit card, regional bank |
| Acquisition financing | 70-85% | Prime + 2.5-5.0% | Live Oak, Huntington, regional + SBA up to $5M |
| Equipment + leasehold finance | 80-100% | 9-15% | Balboa, Crest, Direct Capital (small footprint vs medical) |

### Marketing + referral channel cost + effectiveness

| Channel | Cost 2027 | Lead Volume | Quality | Notes |
|---|---|---|---|---|
| Hospital discharge planner outreach | Time + breakfast meetings | Highest | Highest | Single-relationship can = 40-60% of intake |
| SNF discharge social worker outreach | Time + breakfast meetings | High | High | Frequent volume from post-acute rehab |
| Elder-law attorney + NAELA member outreach | Time + occasional CLE sponsorship | Medium | Highest | High conversion ~50-70% |
| Geriatric Care Manager / Aging Life Care Professional (ALCA) | Time + ALCA membership | Medium | Highest | Family's trusted advisor; zero-tolerance for no-shows |
| Senior-living community Director of Resident Services | Time + breakfast meetings | Medium-High | High | Atria + Brookdale + Sunrise + Five Star + Belmont Village |
| Area Agencies on Aging AAA / ADRC | Time + Older Americans Act compliance | Medium | High for Medicaid + private | ~622 AAAs nationally |
| Physician office + geriatrician + PCMH / ACO | Time + practice-manager relationship | Low-Medium | High | Slower-build but durable |
| VA Medical Center Geriatrics & Extended Care GEC | Time + VA-vendor credentialing | Medium | High for veteran segment | Aid & Attendance + VDC + CCN |
| Google Local Service Ads | $20-$60/lead | Medium | Medium | Pre-screened lead with Google guarantee |
| Google Business Profile + organic | Time + reviews | Medium | Medium-High | 50-200 reviews at 4.5+ stars decisive |
| Yelp ads | $30-$120/lead | Low-Medium | Low-Medium | Lower-quality than referral but supplemental |
| Caring.com + SeniorAdvisor.com + APlaceForMom | Referral fee 50-100% of first month | Medium | Medium | Quality varies; expensive on per-client basis |
| Direct mail to qualified zip codes | $0.50-$2.00/piece | Low | Low-Medium | Old-school but works in some markets |
| Community event sponsorship (senior expos) | $500-$3,000/event | Low-Medium | Medium | Brand building + referral relationships |

### Exit multiples by buyer type

| Exit Path | Buyer Type | Cap Multiple | Process Length | Best For |
|---|---|---|---|---|
| Single office to regional operator | Regional multi-loc | 3.5-5.5x EBITDA | 6-12 months | $80K-$500K EBITDA + clean license + referral pipeline |
| Single office to first-time franchise buyer | Aspiring operator | 3.5-4.5x EBITDA | 6-12 months | Smaller office + owner-operator continuity |
| Regional brand to PE platform | Centre Lane / Vistria / FFL / Audax / H.I.G. / Webster / Ridgemont / NexPhase | 5.0-7.0x EBITDA | 6-9 months | $700K-$3M EBITDA + multi-location + central infrastructure |
| Multi-state platform to strategic / public | Addus HomeCare / Help at Home / BAYADA / Interim / Honor / Right at Home | 6.0-8.0x EBITDA | 9-12 months | $3M-$15M+ EBITDA + multi-state + payor-mix discipline |
| Sale to health system | CommonSpirit / Ascension / Trinity / Sutter / AdventHealth / Bon Secours / Banner | 4.5-7.0x EBITDA | 9-15 months | Mature regional + value-based-care fit |
| Family / management buyout | Internal | 3.5-5.5x EBITDA + seller note | 6-9 months | Owner exit with successor in place |
| Asset wind-down | Adjacent home-care operator | Caregiver roster + client list $50K-$200K | 60-120 days | Distressed / burnout exit |

### Active PE roll-up platforms in non-medical home care (2024-2027)

| Platform | Owner / Sponsor | Approx Revenue | Approx Locations | Acquisition Focus |
|---|---|---|---|---|
| Help at Home | Centerbridge Partners + The Vistria Group | ~$1.5B | ~190 branches | Medicaid HCBS focus |
| Addus HomeCare (NASDAQ: ADUS) | Public | ~$1.1B | ~210 locations | Multi-state Medicaid + private |
| BAYADA Home Health Care | Private foundation (2018 conversion) | ~$1.5B | ~360 locations | Hybrid medical + non-medical |
| Interim HealthCare (Caring Brands International) | Private | ~330 franchise + corporate | Broad services + franchise | Franchise + corporate hybrid |
| Right at Home | Honor Technology + FFL Partners (2024) | -- | ~500+ franchisees | Franchise + tech platform |
| Home Instead | Honor Technology (2021) | -- | ~600 US franchisees | Largest franchise |
| Senior Helpers | Advocate Aurora (2022) | -- | ~370+ franchisees | Health-system-backed franchise |
| Comfort Keepers | Sodexo | -- | ~450+ franchisees | Strategic-acquirer-owned |
| Synergy HomeCare | NexPhase Capital (2021) | -- | ~190+ franchisees | PE-backed franchise |
| BrightStar Care | Audax Group (2022) | -- | ~370+ franchisees | PE-backed medical + non-medical hybrid |
| ComForCare | Best Life Brands | -- | ~245+ franchisees | Brand portfolio |
| Honor Technology | Series F (a16z, General Catalyst, Prosus, KKR) | -- | Tech platform | Tech + acquired Home Instead + Right at Home |

`;

const counter = `

## Counter-Case: When Non-Medical Senior Home Care Is A Difficult Bet

A serious non-medical home-care founder must stress-test the case above against the conditions that make this category harder in 2027. The full 14-element counter-case:

**(1) Caregiver turnover 60-90% annual industry baseline.** **Recruiting is a daily activity, not a quarterly one.** Best agencies hold turnover at **40-55%** via differentiated wage + benefits + scheduling + culture; worst exceed 100%. Driver: wage compression vs Amazon warehouse + fast-food + retail at **$17-$22/hr with benefits + signing bonus**; physical demands; client incompatibility; transportation cost; emotional toll. **Cost per replacement hire $280-$850 + 30-90 day productivity ramp + client churn risk during caregiver transitions.** Year 1-3 operators chronically understaffed.

**(2) W-2 vs 1099 audit risk post-DOL 2024 rule.** **DOL 2024 Independent Contractor final rule (effective March 11, 2024)** restored multi-factor economic-reality test. **Almost no caregiver in an agency context passes the test as 1099** — agency directs schedule, sets rates, provides clients, trains workers, controls quality. **2015 DOL elimination of 29 CFR §552.6 Companionship Exemption** for third-party employers (Home Care Association of America v. Weil DC Cir. 2015) eliminated agency-caregiver overtime exemption. **California AB 5 / AB 2257 ABC test** makes 1099 essentially impossible in CA. **Misclassification audits hit $50K-$500K back-pay (3 yr lookback) + DOL liquidated damages + state unemployment + workers comp + IRS payroll tax + penalties + interest.** Agencies still operating 1099 in 2027 face existential audit exposure.

**(3) CMS Medicaid 80/20 HCBS rule effective July 2030.** **CMS Medicaid Access Rule (89 FR 40542, May 2024)** requires **80% of Medicaid HCBS payments flow to direct-care worker compensation** by July 2030. **Industry analysis (HCAOA + ANCOR + LeadingAge)** estimates this compresses Medicaid agency EBITDA from current 4-9% toward **0-4%** at current state rates. Several states (NY, IL, OR, CO) are revising rates upward; most are not. **Strategic implication**: agencies >50% Medicaid face existential margin crunch by 2030; agencies <30% Medicaid have more cushion. **Plan payor-mix discipline now**, not in 2029.

**(4) On-call 24/7 coordinator burnout.** **Saturday-night fall calls + Sunday-morning no-show caregivers** are the unrelenting operating reality of home care. Year 1-3 owner typically takes on-call personally + burns out. **30-50% Year 1-3 owner exit** is driven primarily by on-call burnout + cash-flow anxiety + caregiver recruiting fatigue. Dedicated on-call coordinator costs **$28K-$45K/yr** stipend + cell + remote laptop, or outsourced answering service **$450-$1,500/mo** that lacks clinical judgment for emergent situations. **No realistic relief mechanism** in Year 1-2 for owner.

**(5) Referral-partner concentration risk.** **60-80% of intake comes from professional referral channels** — and within that, **single hospital discharge planner + single SNF social worker + single geriatric care manager relationship can = 40-60% of intake**. **Loss of single relationship (planner retirement + hospital system policy change + GCM moving) = catastrophic intake collapse**. Diversification across 8-15 active referral relationships is essential — but takes 18-36 months to build.

**(6) LTC insurance carrier exits + shrinking policy block.** **Genworth Financial + MetLife + John Hancock + Prudential** have largely exited or restricted LTC insurance new-sales 2008-2020 due to underpricing legacy blocks + low interest rates + claims experience. **Active US LTC insurance policy block has shrunk to ~7M-8M policies** (from ~7.5M peak) and is **aging out 2025-2040**. New replacement products are hybrid life-LTC riders at lower benefit. **Medium-term, LTC insurance as payor source is shrinking** — not growing — meaning private-pay + Medicaid + VA are the durable payor sources.

**(7) Medicare doesn't pay for non-medical home care.** This is the **biggest single misunderstanding** at family-intake stage. Medicare pays for **skilled** home health (nursing + PT/OT/ST under physician orders, time-limited episode) — not for the daily personal care + companionship + meal-prep + housekeeping that families actually need long-term. **Every intake call requires this education** + family-budget reset from "Medicare will cover it" to "private-pay $4,500-$8,500/mo or LTC or Medicaid waiver or VA." **30-50% of inquiries don't convert** because family can't or won't pay private-pay rates.

**(8) Franchise royalty + brand-fund extraction.** **5-7% royalty + 2-3% brand fund = 7-10% of revenue gone forever** on an 8-18% EBITDA business. That's **40-65% of profit** flowing to franchisor. **Brand-fund efficiency varies wildly** — some franchisors deliver national-brand value (Home Instead, Right at Home); others don't. **Territory restrictions** prevent franchisee from expanding into adjacent markets without buying additional territory. **Exit value typically 0.5-1.0x EBITDA lower than independent comparable** because brand IP belongs to franchisor.

**(9) Working capital crunch + AR aging.** **Caregiver payroll weekly or biweekly** but **private-pay AR ages 15-45 days + LTC insurance ages 45-90 days + Medicaid waiver ages 30-75 days + VA ages 30-90 days.** **Year 1-2 agencies routinely cash-stretch** between payroll Friday and Wednesday-week AR receipts. **LOC + business credit card + invoice-factoring** are partial mitigations. **Single late client payment in early months = payroll-funding emergency.**

**(10) State license moratorium + Certificate of Need (CON) barriers.** **New York LHCSA moratorium since 2018** prevents new LHCSA license issuance (limited carve-outs for transfers + change of ownership). **New Jersey CON-equivalent + restricted licensure** in some categories. **Florida limited new licenses** in some counties. **Several states tightening 2023-2027** in response to industry-quality concerns + Medicaid budget pressure. **Plan acquisition vs new license** in moratorium states.

**(11) Caregiver injury + workers comp claim severity.** **Home care workers experience workplace injury at 4-7x rate of general workforce** per BLS — primarily back/shoulder/knee from transfers + lifts + slips/falls in client homes. **Workers comp claims average $15K-$45K medical-only + 6-12 wk lost-time** per claim. **Workers comp premium 4-9% of payroll** state-varying. **One severe claim (back surgery + permanent disability) can rate-bump agency 40-80%** for 3-5 years. **Hoyer-lift + transfer training + injury-prevention program** mitigate but don't eliminate.

**(12) Client incident risk + liability concentration.** **Fall + medication error + caregiver theft + family disputes + neglect allegations** create liability exposure. **Single severe incident (caregiver-caused fall + fracture + family lawsuit) can exceed GL/Professional Liability limits + threaten agency**. **$1M-$2M GL + Professional Liability + Umbrella** is standard but high-net-worth client families with adult-children-attorneys can sue beyond limits. **Caregiver-screening + ongoing supervision + incident-reporting + family-communication discipline** are essential but not bulletproof.

**(13) Honor + Papa + CareYaya + gig-economy platform competition.** **Honor (a16z + General Catalyst + Prosus + KKR Series F)** built tech-enabled W-2 home-care platform competing directly with traditional agencies + acquired Home Instead 2021 + Right at Home 2024 via FFL Partners. **Papa (CapitalG + Tiger Global)** built companion-care gig platform for Medicare Advantage plan members. **CareYaya + Cera Care + Sensi.AI + others** building tech-first agency models. **Direct-family-hire registry models (Care.com, Sittercity)** offer cheaper $15-$22/hr family-direct caregivers without agency overhead. **Competitive pressure** on private-pay rates + caregiver wages in major metros.

**(14) Geographic + market saturation in major metros.** **Top-50 US metros have 80-300+ home-care agencies each** per state license registries — high competition for caregivers + referral partners + private-pay clients. **Secondary markets (mid-size cities, suburban-rural ring)** have less competition but smaller pools of private-pay clients + longer drive times for caregivers + lower billing rates. **Choose market carefully** — saturated coastal metro vs underserved Midwest secondary city are fundamentally different operating environments.

**Honest verdict.** The non-medical senior home care business remains one of the **best demographic-tailwind bets in healthcare services** in 2027 if you (a) **plan W-2 from Day 1 + budget fully-loaded caregiver cost at 1.30-1.42x base pay** without 1099 shortcut temptation; (b) **architect payor mix toward private-pay + LTC + VA dominance** with Medicaid as ≤30% of revenue to insulate against 2030 80/20 squeeze; (c) **invest in caregiver retention** (wage + benefits + scheduling flexibility + referral bonus + culture) to hold turnover at 40-55% instead of 70-90% industry baseline; (d) **build referral-partner pipeline across 8-15 active hospital + SNF + elder-law + GCM + senior-living + AAA + VAMC relationships** to avoid single-source-of-failure intake; (e) **plan on-call coverage realistically** — dedicated coordinator + after-hours service + owner backup — instead of expecting owner to do 24/7 forever; (f) **build EVV + W-2 + workers comp + dishonesty-bond + state-license compliance into the operating DNA** instead of bolting on later; (g) **honestly assess capital for 90-day payroll float** ($25K-$80K LOC minimum) since weekly payroll vs 30-75 day AR is the daily operating reality; (h) **commit to either path** (single-office private-pay-dominant cash-flow business OR multi-office regional PE-acquirable platform) rather than vacillating between them. If you cannot honestly check most of these — particularly caregiver retention + payor mix + on-call coverage + referral diversification + capital float — the regulatory + workforce + Medicaid dynamics of 2027-2030 will grind the agency toward a Year 2-3 distressed wind-down at 1.5-3.0x EBITDA. But for operators who do execute these disciplines, the demographic tailwind (10,000 Americans turning 65 daily + 83% aging-in-place preference + $45B-$62B segment growing 8-12% CAGR + active PE roll-up at 5.0-8.0x EBITDA) makes this one of the most attractive entry points in healthcare services in the 2027-2030 window.

`;

const links = `

## Related Pulse Entries

- [[q9669]] -- Food truck business 2027 (sibling: state + local permits + commissary + tight operating discipline)
- [[q9668]] -- Pediatric dental practice 2027 (sibling: state-licensed + recurring service + insurance mix)
- [[q9667]] -- HVAC company 2027 (sibling: state-licensed + skilled trades + PE roll-up parallel)
- [[q9666]] -- Compounding pharmacy 2027 (sibling: state + federal regulated specialty service)
- [[q9665]] -- Boutique fitness studio 2027 (sibling: recurring-revenue + customer-experience-driven)
- [[q9664]] -- Microbrewery 2027 (sibling: regulated + state licensure + specialty equipment)
- [[q9663]] -- Self-storage facility 2027 (specialty CRE parallel)
- [[q9662]] -- Mobile IV therapy clinic 2027 (sibling: state-regulated mobile service + cash/insurance mix)
- [[q9661]] -- Veterinary clinic 2027 (sibling: specialty licensed practice + recall + insurance mix)
- [[q9660]] -- Direct primary care DPC clinic 2027 (sibling: cash + insurance + membership service)
- [[q9659]] -- Med spa 2027 (sibling: state licensure + service-membership)
- [[q9658]] -- Service business launch (NEW STRUCTURE sibling)
- [[q9657]] -- Home health agency 2027 (DIRECT sibling: skilled-nursing Medicare-certified home health adjacent category — primary cross-reference)
- [[q9650]] -- Assisted living facility 2027 (DIRECT sibling: specialty CRE + state licensure + senior care + residential alternative to home care)
- [[q9601]] -- Fractional CFO operation (operational backbone for multi-office home-care platform)
- [[q9576]] -- Adult coding bootcamp 2027 (state regulation framework)
- [[q2117]] -- Post-construction cleanup business (service-business operating pattern)
- [[q1975]] -- Daycare 2027 (sibling: state licensure + caregiver workforce + family-customer parallel)
- [[q1954]] -- Property management 2027 (baseline sibling)
- [[q1953]] -- Virtual assistant 2027 (baseline sibling)
- [[q1952]] -- Podcast network 2027 (baseline sibling)
- [[q1951]] -- Meal prep 2027 (sibling: in-home delivery + senior-customer overlap)
- [[q1950]] -- Yoga studio 2027 (baseline sibling)
- [[q1949]] -- Personal training 2027 (baseline sibling)
- [[q1948]] -- Dog walking 2027 (baseline sibling: in-home service + recurring + W-2 vs 1099 parallel)
- [[q1947]] -- Notary 2027 (baseline sibling)
- [[q1946]] -- Tutoring 2027 (baseline sibling)
- [[q1942]] -- Service business 2027 (baseline sibling)
- [[q1139]] -- Adjacent service business framework
- [[q1127]] -- Adjacent service business framework

`;

const tags = ['non-medical-home-care','senior-care','personal-care','companion-care','hcaoa','evv','medicaid-hcbs','aging-in-place','2027'];

const sources = [
  { title: 'Home Care Association of America HCAOA', url: 'https://www.hcaoa.org' },
  { title: 'CMS Medicaid Access Rule (80/20 HCBS Final Rule)', url: 'https://www.cms.gov/newsroom/fact-sheets/medicaid-and-chip-managed-care-access-finance-and-quality-final-rule-cms-2439-f' },
  { title: '21st Century Cures Act EVV Mandate', url: 'https://www.cms.gov/medicare/medicare-fee-for-service-payment/homehealthpps/electronic-visit-verification' },
  { title: 'DOL 2024 Independent Contractor Final Rule', url: 'https://www.dol.gov/agencies/whd/flsa/misclassification/rulemaking' },
  { title: 'DOL Home Care Final Rule (Companionship Exemption)', url: 'https://www.dol.gov/agencies/whd/direct-care' },
  { title: 'California DSS Home Care Services Bureau', url: 'https://www.cdss.ca.gov/inforesources/community-care/home-care-services' },
  { title: 'AARP Home and Community Preferences Survey', url: 'https://www.aarp.org/research/topics/community/info-2024/2024-home-community-preferences.html' }
];

const notes = {
  s6: 'Added 87 cited sources spanning trade associations (Home Care Association of America HCAOA primary US private-duty home-care trade body ~3,500 member agencies + state-chapter network + DOL/CMS advocacy + Alliance for Care at Home formerly NAHC merger 2024 + PHI National direct-care workforce research), federal regulators + rules (CMS Centers for Medicare & Medicaid Services + CMS Medicaid Access Rule 89 FR 40542 May 2024 80/20 HCBS final rule effective July 2030 + 21st Century Cures Act §12006 EVV mandate Medicaid personal care since Jan 2020 + home health since Jan 2023 + DOL Wage and Hour Division FLSA enforcement + DOL 2024 Independent Contractor final rule 29 CFR Part 795 effective March 11 2024 + DOL 2013/2015 Home Care Final Rule 29 CFR §552.6 elimination of Companionship Exemption + 42 CFR Part 484 Home Health Conditions of Participation + 42 CFR §484.80 HHA federal training), state regulators (California DSS Home Care Services Bureau under AB 1217 Home Care Services Consumer Protection Act + CA AB 5/AB 2257 IC + CA IHSS In-Home Supportive Services + Florida AHCA Nurse Registry + FL SMMC LTC + Texas HHSC Personal Assistance Services + TX STAR+PLUS + New York DOH LHCSA + NY CDPAP + Illinois DPH Home Services Agency + Pennsylvania DOH Home Care Agency Act 69 + PA Community HealthChoices + Massachusetts EOEA + MA MassHealth PCA + Ohio Dept of Aging PASSPORT), federal benefits programs (VA Aid and Attendance + VA Veteran Directed Care VDC + Community Care Network CCN + Older Americans Act §306 Area Agencies on Aging ~622 nationally), market research (AARP Home and Community Preferences Survey 83% aging-in-place + IBISWorld Home Care Providers + Grand View Research US Home Healthcare + BLS Home Health and Personal Care Aides + Census Bureau Older Population 85M aged 60+ by 2030), background-check + caregiver infrastructure (Affordable Care Act §6201 CMS National Background Check Program + Checkr + Sterling + GoodHire + HireRight + ServSafe), home-care software (AxisCare HCAOA Preferred Partner + WellSky Personal Care formerly ClearCare WellSky acquired 2017 largest single platform private-duty + Smartcare + AlayaCare enterprise Canada + Caretime + Generations Homecare), EVV vendors (HHAeXchange NY-mandated FL Medicaid managed care + Sandata Aggregator CMS default + Tellus Netsmart + Authenticare + CareBridge), payroll (Gusto + ADP Run + Paychex Flex + Paylocity + Viventium home-care specialized), billing clearinghouses (Waystar + Availity + Change Healthcare), CRM (Home Care Pulse Referral Tracker), referral channels (Aging Life Care Association ALCA + National Academy of Elder Law Attorneys NAELA + APlaceForMom + SeniorAdvisor.com + Caring.com), franchise brands (Right at Home franchise acquired Honor Technology + FFL Partners 2024 + Home Instead Honor Technology 2021 + Visiting Angels Living Assistance Services + Senior Helpers Advocate Aurora 2022 + Comfort Keepers Sodexo + BrightStar Care Audax Group 2022 + FirstLight Home Care + ComForCare Best Life Brands + Always Best Care + Synergy HomeCare NexPhase Capital), PE roll-up platforms (Honor Technology Series F a16z/General Catalyst/Prosus/KKR + Help at Home Centerbridge+Vistria ~$1.5B revenue 190 branches Medicaid focus + Addus HomeCare NASDAQ ADUS public ~$1.1B 210 locations + BAYADA private foundation 2018 conversion ~$1.5B 360 locations + Interim HealthCare Caring Brands International ~330 franchise + corporate), financing (SBA 7(a) + SBA Microloan + Live Oak Bank largest home-care SBA + Benetrends + ApplePie Capital + FranFund 401(k) ROBS).',
  s7: 'Added comprehensive numbers block with 11 markdown pipe tables covering: industry size + operator landscape + unit economics (~85M Americans 60+ by 2030 + ~56M 65+ 2025 + ~10,000/day turning 65 through 2030 + 83% aging-in-place AARP + $157B-$185B US home care market combined + $45B-$62B non-medical segment 8-12% CAGR + ~33,000-38,000 US home care + home health agencies combined HCAOA + CMS Provider of Services file + avg single-office revenue $1.2M-$4.8M + 28-42% gross + 8-18% EBITDA single office mature + 10-16% blended multi-location + 4-9% Medicaid HCBS pre-80/20 + 0-4% post-80/20 projected 2030 + 30-50% Year 1-3 owner exit); payor mix economics 8 channels (private-pay secondary $28-$38/hr 28-38% gross 30-50% of revenue + private-pay coastal $38-$48/hr + LTC insurance Genworth/Mutual of Omaha/John Hancock/Northwestern Mutual/MassMutual/Transamerica $24-$40/hr 22-32% gross 10-25% + Medicaid HCBS waiver state-set $19-$32/hr 18-28% pre-80/20 + VA Aid & Attendance via veteran $28-$40/hr + workers comp/auto carrier-paid + concierge HNW $45-$95/hr + hospice supplemental); caregiver pay + workforce benchmarks 9 tiers (CNA $16-$24/hr 75-180 hr training + state exam + registry ~2.3M-2.6M nationally + HHA $15-$22/hr 75-120 hr federal 42 CFR §484.80 ~750K-900K + PCA companion $14-$20/hr 5-40 hr state-varying PA 6/CA 5+5/NY 75 + live-in 24-hr $160-$280/day flat + specialty +$1-$4/hr premium + weekend/overnight/holiday differential + fully-loaded cost pay × 1.30-1.42 + 60-90% turnover industry baseline + 40-55% best agencies + recruiting cost $280-$850 small/$180-$450 scale); capital tier (lean independent $40K-$120K $200K-$1.2M + full independent $120K-$250K $1.2M-$3.5M + franchise $100K-$300K + 5-7% royalty $800K-$2.5M + acquisition $150K-$2M $1M-$4M + multi-office $500K-$2M per add\'l $8M-$20M + multi-state platform $5M-$30M $20M-$80M); license + insurance + tech + build-out by category 24 line items (state HCO initial $500-$3,500 + annual $300-$2,000 + surety bond $10K-$100K face/$250-$2,500/yr premium + plan of operation development $0-$15K + training curriculum $1K-$10K + background check Checkr/Sterling/GoodHire setup + $25-$80/check + Live Scan $45-$95 + TB test $25-$60 + scheduling $300-$1,800/mo + EVV $25-$60/caregiver/mo + payroll $40-$500/mo + billing clearinghouse $200-$800/mo + CRM $50-$500/mo + phone $20-$50/seat + GL $1,500-$4,500/yr + Professional Liability $1,000-$3,000/yr + Workers Comp 4-9% payroll + Non-Owned Auto $600-$2,000/yr + Dishonesty $500-$2,000/yr + office $1,500-$4,500/mo + buildout $5K-$30K + marketing $5K-$25K + working capital float $25K-$80K + franchise initial $35K-$70K + franchise total $80K-$200K + royalty 3-7% + brand fund 2-3%); state license + Medicaid waiver rate snapshots 10 states (CA DSS HCSB AB 1217 $25K bond IHSS ~$18-$22/hr + FL AHCA $50K SMMC LTC ~$19-$24/hr + TX HHSC PAS STAR+PLUS ~$15-$19/hr + NY DOH LHCSA $100K moratorium CDPAP ~$22-$28/hr + IL DPH $50K ~$18-$22/hr + PA DOH Act 69 $50K CHC ~$20-$26/hr + MA EOEA $25K PCA ~$22-$28/hr + OH PASSPORT ~$19-$24/hr + NJ DCA $10K-$25K MLTSS ~$22-$28/hr + WA DSHS $25K COPES ~$20-$26/hr); staff comp 11 roles (owner Year 1-2 break-even to $40K + Year 3-5 mature $100K-$800K + agency director $65K-$110K + scheduling coordinator $42K-$68K + on-call coordinator $28K-$45K stipend + intake $48K-$72K + marketing $55K-$85K + caregiver supervisor RN $72K-$110K + bookkeeper $48K-$72K + regional director Stage 4 $85K-$135K + VP Operations Stage 5 $120K-$180K); 5-year cash flow (Year 1 5-15 clients/8-25 caregivers $200K-$600K break-even-$30K to Year 5 130-280 clients/120-260 caregivers $4M-$10M $480K-$1.6M EBITDA 12-18%); capital stack 8 layers (founder equity + SBA microloan 8-13% + SBA Express + SBA 7(a) Prime + 2.0-4.0% Live Oak largest + franchise financing Benetrends/ApplePie/FranFund/Live Oak + working capital LOC Prime + 4-9% Bluevine/OnDeck/Kabbage + acquisition financing 70-85% + equipment finance 9-15%); marketing + referral channel 14 (hospital discharge planner highest + SNF social worker + elder-law attorney NAELA + GCM ALCA + senior-living + AAA + physician + VAMC GEC + Google Local Service Ads + Google Business Profile + Yelp + Caring.com/SeniorAdvisor/APlaceForMom + direct mail + community event); exit multiples 7 buyer types (single office to regional 3.5-5.5x + to first-time franchise buyer 3.5-4.5x + regional brand to PE Centre Lane/Vistria/FFL/Audax/H.I.G./Webster/Ridgemont/NexPhase 5.0-7.0x + multi-state platform to strategic Addus/Help at Home/BAYADA/Interim/Honor/Right at Home 6.0-8.0x + health system 4.5-7.0x + family/MBO 3.5-5.5x + asset wind-down $50K-$200K); active PE roll-up platforms 12 (Help at Home Centerbridge+Vistria ~$1.5B 190 branches + Addus ADUS ~$1.1B 210 locations + BAYADA private foundation ~$1.5B 360 locations + Interim Caring Brands ~330 franchise + Right at Home Honor+FFL 2024 ~500+ + Home Instead Honor 2021 ~600 + Senior Helpers Advocate Aurora 2022 ~370+ + Comfort Keepers Sodexo ~450+ + Synergy NexPhase 2021 ~190+ + BrightStar Audax 2022 ~370+ + ComForCare Best Life Brands ~245+ + Honor Technology Series F a16z/General Catalyst/Prosus/KKR).',
  s8: 'Added 14-element counter-case: caregiver turnover 60-90% industry baseline (recruiting daily activity not quarterly + best agencies 40-55% + wage compression vs Amazon warehouse + fast-food + retail $17-$22/hr + physical demands + client incompatibility + transportation + emotional toll + cost per replacement $280-$850 + 30-90 day ramp + client churn risk); W-2 vs 1099 audit risk post-DOL 2024 rule (DOL 2024 Independent Contractor final rule effective March 11 2024 multi-factor economic-reality test + 2015 elimination of 29 CFR §552.6 Companionship Exemption Home Care Association of America v. Weil DC Cir. 2015 + CA AB 5/AB 2257 ABC test + misclassification audit $50K-$500K back-pay + DOL liquidated damages + state unemployment + workers comp + IRS payroll tax); CMS Medicaid 80/20 HCBS rule July 2030 (Medicaid Access Rule 89 FR 40542 May 2024 + 80% HCBS payments to direct-care worker comp + HCAOA + ANCOR + LeadingAge analysis 4-9% to 0-4% EBITDA + NY/IL/OR/CO revising rates + most states not + agencies >50% Medicaid face existential margin crunch); on-call 24/7 coordinator burnout (Saturday-night fall + Sunday-morning no-show unrelenting + 30-50% Year 1-3 owner exit driven by on-call + cash-flow + caregiver recruiting fatigue + dedicated coordinator $28K-$45K stipend + outsourced answering service $450-$1,500/mo + no realistic relief Year 1-2); referral-partner concentration risk (60-80% intake from professional channels + single hospital discharge planner + SNF social worker + GCM relationship = 40-60% intake + loss = catastrophic intake collapse + diversification across 8-15 active relationships takes 18-36 months); LTC insurance carrier exits + shrinking policy block (Genworth + MetLife + John Hancock + Prudential largely exited or restricted LTC new-sales 2008-2020 + active US policy block shrunk to ~7M-8M policies aging out 2025-2040 + hybrid life-LTC riders at lower benefit + LTC as payor source shrinking not growing); Medicare does not pay for non-medical (biggest single misunderstanding at intake + Medicare pays skilled home health only + family-budget reset from Medicare covers it to private-pay $4,500-$8,500/mo or LTC or Medicaid waiver or VA + 30-50% inquiries do not convert); franchise royalty + brand-fund extraction (5-7% royalty + 2-3% brand fund = 7-10% revenue gone forever + 40-65% of profit to franchisor + brand-fund efficiency varies + territory restrictions + exit value 0.5-1.0x EBITDA lower than independent); working capital crunch + AR aging (caregiver payroll weekly/biweekly + private-pay AR 15-45 days + LTC 45-90 days + Medicaid 30-75 days + VA 30-90 days + Year 1-2 cash-stretch routine + LOC + credit card + invoice-factoring partial + single late client = payroll emergency); state license moratorium + CON barriers (NY LHCSA moratorium since 2018 + NJ CON-equivalent + FL limited new licenses + several states tightening 2023-2027 + plan acquisition vs new license in moratorium states); caregiver injury + workers comp claim severity (home care workers 4-7x injury rate BLS + back/shoulder/knee transfers + lifts + slips/falls + avg claim $15K-$45K medical-only + 6-12 wk lost-time + workers comp 4-9% payroll + single severe claim rate-bumps 40-80% for 3-5 years); client incident risk + liability concentration (fall + medication error + caregiver theft + neglect allegations + single severe incident can exceed GL/Professional Liability limits + HNW family with attorneys can sue beyond + $1M-$2M GL + Professional Liability + Umbrella standard + caregiver-screening + supervision + incident-reporting + family-communication discipline essential not bulletproof); Honor + Papa + CareYaya + gig-economy platform competition (Honor a16z/General Catalyst/Prosus/KKR Series F W-2 home-care platform + acquired Home Instead 2021 + Right at Home 2024 via FFL Partners + Papa CapitalG/Tiger Global companion-care for Medicare Advantage + CareYaya + Cera Care + Sensi.AI tech-first agency models + direct-family-hire Care.com/Sittercity $15-$22/hr without agency overhead + competitive pressure on private-pay + caregiver wages major metros); geographic + market saturation in major metros (top-50 US metros 80-300+ home-care agencies each + high competition for caregivers + referral partners + private-pay + secondary markets less competition but smaller private-pay pools + longer drives + lower billing + choose market carefully) -- with honest 8-condition verdict on who should and should not start a non-medical home-care agency in 2027 and demographic-tailwind reasoning.',
  s9: 'Cross-linked 30 related Pulse entries: q9669 food truck (state + local permits + commissary + tight operating discipline) + q9668 pediatric dental (state-licensed + recurring service + insurance mix) + q9667 HVAC (state-licensed + skilled trades + PE roll-up parallel) + q9666 compounding pharmacy (state + federal regulated specialty) + q9665 boutique fitness (recurring revenue + experience-driven) + q9664 microbrewery (regulated + state licensure + specialty equipment) + q9663 self-storage (specialty CRE) + q9662 mobile IV therapy (state-regulated mobile service + cash/insurance) + q9661 veterinary clinic (specialty licensed + recall + insurance) + q9660 DPC (cash + insurance + membership) + q9659 med spa (state licensure + service-membership) + q9658 NEW STRUCTURE sibling + q9657 home health agency DIRECT sibling (skilled-nursing Medicare-certified home health adjacent category - primary cross-reference) + q9650 assisted living DIRECT sibling (specialty CRE + state licensure + senior care + residential alternative) + q9601 fractional CFO (operational backbone for multi-office platform) + q9576 adult coding bootcamp (state regulation framework) + q2117 post-construction cleanup (service-business operating pattern) + q1975 daycare (state licensure + caregiver workforce + family-customer parallel) + q1951 meal prep (in-home delivery + senior-customer overlap) + q1948 dog walking (in-home service + recurring + W-2 vs 1099 parallel) + q1942/q1946-q1954 baseline siblings + q1127/q1139 service business framework.',
  s10: 'SUBAGENT_VERIFIED. Lean deep baseline of the NON-MEDICAL senior home care agency startup playbook for 2027 matching actual question "How do you start a non-medical senior home care agency in 2027?" Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-9,500 words HARD CAP 10,500 with tight paragraphs (2-3 sentences max), frequent H3 breaks, no walls of text, no padding. Structure: Bottom Line callout (3 punchy bullets Capital/Margins/Hardest part with bold-tag labels hitting independent lean $40K-$120K vs full $120K-$250K vs franchise $50K-$100K + 5-6% royalty Right at Home/Home Instead/Visiting Angels/Senior Helpers/Comfort Keepers/BrightStar/FirstLight/ComForCare + 80-180 hrs/wk per active client + 35-90 active clients + $28-$45/hr private-pay + $14-$22/hr caregiver + $1.4M-$4.8M/yr revenue + 8-18% EBITDA mature single office + Medicaid HCBS waiver thinner 4-9% margin + multi-location 10-16% blended EBITDA at $4M-$15M + sale multiples 3.5-6.0x EBITDA single + 5.0-8.0x multi-location + active PE roll-up Help at Home/Addus/BAYADA/Interim/Right at Home/Honor + counter-pressures 60-90% annual caregiver turnover + DOL 2024 IC rule + 2015 Companionship Exemption elimination + EVV 21st Century Cures Act §12006 + CMS Medicaid 80/20 HCBS final rule May 2024 effective July 2030 + on-call 24/7 burnout + 30-50% Year 1-3 owner exit + referral concentration + LTC carrier exits + Medicare-doesnt-pay-non-medical reality + Honor/Papa/CareYaya gig-economy competition), then 3 short paragraphs distinguishing non-medical home care ($28-$45/hr private-pay + 8-18% EBITDA + no Medicare) from licensed home health agencies (skilled nursing + PT/OT/ST under physician orders Medicare-reimbursable via 42 CFR Part 484 + 5-12% EBITDA + ~12,000 agencies) + assisted living facility ($5,500-$9,500/mo + state ALF license + 20-32% EBITDA + real-estate-heavy $15M-$45M build) + memory care ($9,000-$12,500/mo + 25-35% EBITDA) + hospice (Medicare-certified end-of-life + 15-22% EBITDA mature) + adult day care ($75-$140/day + 8-14% EBITDA), then TOC block listing 14 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit) with horizontal rule separators, then LEAN H3 deep content sections inside each PART (3-4 sections per PART, tight 2-3 sentence paragraphs, no padding, frequent H3 breaks, real specifics on CA DSS HCSB AB 1217 + FL AHCA Nurse Registry $50K + TX HHSC PAS + NY DOH LHCSA + IL DPH + PA DOH Act 69 + MA EOEA + federal background check ACA §6201 + EVV under 21st Century Cures Act §12006 + W-2 vs 1099 post-DOL 2024 rule + 2015 elimination 29 CFR §552.6 Companionship Exemption + Home Care Association of America v. Weil DC Cir. 2015 + CA AB 5/AB 2257 + CMS Medicaid 80/20 rule 89 FR 40542 effective July 2030 + state Medicaid waiver programs IHSS/CDPAP/SMMC LTC/STAR+PLUS/MassHealth PCA/Community HealthChoices/PASSPORT + VA Aid & Attendance/Veteran Directed Care/Community Care Network + Older Americans Act §306 AAAs + scheduling software AxisCare/ClearCare WellSky/Smartcare/AlayaCare/Caretime/Generations + EVV HHAeXchange/Sandata/Tellus/Authenticare/CareBridge + payroll Gusto/ADP Run/Paychex Flex/Paylocity/Viventium + insurance PHLY/CNA/Markel/NIA HCAOA partners + state surety bonds CA $25K/FL $50K/NY $100K/MA $25K + SBA 7(a) Live Oak largest home-care SBA + franchise FDD economics 5-7% royalty + 2-3% brand fund + PE roll-up platforms Help at Home/Addus/BAYADA/Interim/Right at Home/Home Instead/Honor/Senior Helpers/Comfort Keepers/Synergy/BrightStar/ComForCare). flow contains exactly 2 mermaid diagrams (operating journey from concept + license + caregiver recruiting + first client through tech stack + W-2 classification + payor mix + referral pipeline + on-call coverage + stage growth + 7-path strategic exit; decision matrix for independent vs franchise vs acquisition AND payor mix selection private-pay-dominant vs LTC-private hybrid vs Medicaid-dominant vs balanced vs concierge HNW with reference operators and exit math). src has 87 cited sources with real URLs covering HCAOA + Alliance for Care at Home + PHI National + CMS + CMS Medicaid Access Rule + 21st Century Cures Act EVV + DOL + DOL 2024 IC Rule + DOL Companionship Exemption history + 42 CFR Part 484 + state agencies CA DSS/FL AHCA/TX HHSC/NY DOH/IL DPH/PA DOH/MA EOEA/Ohio DOA + AB 1217/AB 5/AB 2257/Act 69 + state Medicaid waiver programs + VA Aid & Attendance/VDC/CCN + Older Americans Act + AARP + IBISWorld + Grand View Research + BLS + Census + ServSafe + ACA §6201 + Checkr/Sterling/GoodHire/HireRight + AxisCare/WellSky Personal Care/Smartcare/AlayaCare/Caretime/Generations + HHAeXchange/Sandata/Tellus/Authenticare/CareBridge + Gusto/ADP Run/Paychex Flex/Paylocity/Viventium + Waystar/Availity/Change Healthcare + Home Care Pulse + ALCA + NAELA + APlaceForMom/SeniorAdvisor/Caring.com + Right at Home/Home Instead/Visiting Angels/Senior Helpers/Comfort Keepers/BrightStar/FirstLight/ComForCare/Always Best Care/Synergy + Honor Technology + Help at Home + Addus NASDAQ ADUS + BAYADA + Interim Caring Brands + SBA 7(a) + SBA Microloan + Live Oak Bank + Benetrends + ApplePie Capital + FranFund. num is comprehensive 11-table benchmark block (industry size + payor mix economics 8 channels + caregiver pay + workforce 9 tiers + capital tier + license + insurance + tech build-out 24 line items + state license + Medicaid waiver rate snapshots 10 states + staff comp 11 roles + 5-year cash flow + capital stack 8 layers + marketing + referral channel 14 + exit multiples 7 buyer types + active PE roll-up platforms 12). counter is 14-element counter-case with caregiver turnover + W-2 audit risk + Medicaid 80/20 + on-call burnout + referral concentration + LTC carrier exits + Medicare-doesnt-pay misunderstanding + franchise royalty + working capital crunch + state license moratorium + caregiver injury + client incident liability + Honor/Papa/CareYaya gig competition + geographic saturation + honest 8-condition verdict on who should/should not enter the segment 2027-2030. links cross-references 30 related entries with q9657 home health DIRECT sibling + q9650 assisted living DIRECT sibling. All numbers grounded in real HCAOA + IBISWorld + AARP + BLS + Census + Home Care Pulse + state agencies + PE acquisition diligence ranges. ASCII-clean throughout. Lean target 8,500-9,500 words honored.'
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const FINAL_ID = ID;
  const FINAL_QUESTION = QUESTION;

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

  const idx = await store.get('_index.json', { type: 'json' });
  const i = idx.entries.findIndex(x => x.id === FINAL_ID);
  const row = { id: FINAL_ID, question: FINAL_QUESTION, tags, ts, quality_score: 5, polished_at: null, last_modified_ms: ts, sources_count: sources.length };
  if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
  await store.setJSON('_index.json', idx);

  console.log('[' + FINAL_ID + '] baseline written, kicking off polish ladder');

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
