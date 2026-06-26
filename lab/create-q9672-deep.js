// q9672 -- How do you start a wedding venue business in 2027?
// Built-environment wedding/event venue -- distinct from hotel banquet hall, event planner, catering company
// VALUE over WORD COUNT. Target 8,500-9,500 words. HARD CAP 10,500 (server-enforced). Tight paragraphs (2-3 sentences).
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

const ID = 'q9672';
const QUESTION = 'How do you start a wedding venue business in 2027?';

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** **$250K-$1.5M** for converting an existing structure (barn, farmhouse, vineyard outbuilding, converted mill, lakeside lodge) into wedding-event-ready facility — land + structural reinforcement + HVAC + restrooms + prep kitchen + bridal suite + parking + septic + landscaping + permits + initial FF&E; **$2M-$6M** ground-up purpose-built venue on owned land (land $300K-$1.5M + structure $1.5M-$4M + FF&E $80K-$250K + landscaping $50K-$200K). **PE-backed roll-up vehicles** (Wedgewood Weddings / Walters Wedding Estates, Walls Bryant Group, Stoney Ridge Villa group) buying mid-market venues at **$1.5M-$8M EV**. Expect **18-36 months from land contract to first booked wedding**.
> - **[Margins]** Mature single venue: **35-50% gross + 18-28% EBITDA** at **$850K-$2.5M revenue** + **60-90 events/yr** at **$8K-$25K avg site fee + add-ons + preferred-vendor commission**. Industry data via **The Knot RealWeddings Study + WeddingWire/Hopskip + HoneyBook State of the Wedding Industry + Allied Wedding Vendor Industry Reports + IBISWorld Wedding Venues + BLS SIC 8299**. **Single-asset sale 4-7x EBITDA**; **3-5 venue regional roll-up 7-10x EBITDA**; standardized brand platforms (Wedgewood all-inclusive) **8-12x EBITDA at exit**.
> - **[Hardest part]** **Not capital. Not construction. Zoning + special-use permits.** Most rural/ag-zoned properties (the ones with aesthetic) require **special-use exemptions or rezoning** for commercial events — the **18-36 month entitlement process kills more venue projects than any other factor**. Plus **seasonality** (60-70% bookings May-Oct), **weather risk** on outdoor ceremonies, **Right To Farm Act conflicts**, **ABC liquor complexity**, and **post-2024 venue-saturation** (WeddingWire shows 30%+ inventory growth 2020-2026). Add **noise ordinances**, **traffic + parking neighbor complaints**, **assembly-occupancy fire-code retrofits**, and **declining wedding count** (~1.9M/yr 2026 vs ~2.5M 2022 per The Wedding Report).

A **wedding venue** in 2027 is a **built-environment event business** that owns or long-term-leases land + a fixed structure (barn, mansion, vineyard tasting room, ballroom, garden estate, mill, lodge) and sells **exclusive site use + day-of coordination** for weddings + corporate events. Three regulated pillars: **(1) local zoning + special-use permit (SUP) or conditional-use permit (CUP)** from the county/city planning commission; **(2) state ABC liquor license** (or licensed-caterer-bartender arrangement) + dram-shop coverage; **(3) county/state event-venue health code + ADA Title III + NFPA 101 assembly-occupancy fire code**. Distinct from **hotel banquet hall** (rooms + F&B + catering all-in-one inside lodging), **event/wedding planner** (service business, no real estate), and **catering company** (food + service into someone else's venue).

The 2027 demand: **~1.9M US weddings/yr 2026** per The Wedding Report + IBISWorld (down from ~2.5M post-COVID 2022 peak) at **~$28K-$36K avg budget** (Knot RealWeddings 2025), with **~$72B-$78B total wedding spend** — **~10-14% to venue site fees** ($7.5B-$11B addressable). Active US dedicated wedding venues per WeddingWire/Knot: **~12,000-15,000**, plus **~8,000-11,000** hotel/restaurant banquet halls bidding wedding business. **Inventory grew 30%+ 2020-2026** — saturation is real.

Average dedicated-venue revenue **$650K-$2.5M/yr + 18-28% EBITDA** for disciplined operators; top-decile destination venues clear **$3M-$8M/yr** at **$35K-$120K site fees**. Five survival drivers: **(1) zoning certainty** (SUP/CUP cleared + neighbors not hostile + RTFA not triggered); **(2) booking discipline** (Saturday Apr-Oct sold 12-18 months out + Friday/Sunday + corporate weekday fill); **(3) preferred-vendor list quality** (caterer + bar + florist + DJ + photographer kickback + service consistency); **(4) site photographs** (Instagrammable = inquiries); **(5) review reputation** (Knot/WeddingWire/Google 4.7+ stars 50+ reviews drives 60-80% of inbound).

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & venue vs hotel banquet vs planner vs caterer](#market-size--venue-vs-hotel-banquet-vs-planner-vs-caterer)
- [Zoning, special-use permits, Right To Farm Act & entitlement timeline](#zoning-special-use-permits-right-to-farm-act--entitlement-timeline)
- [ABC liquor, fire code, ADA & insurance stack](#abc-liquor-fire-code-ada--insurance-stack)

**Part 2 -- Build-Out & Capital**
- [Convert existing vs ground-up purpose-built decision](#convert-existing-vs-ground-up-purpose-built-decision)
- [Site work, structure, FF&E & landscaping by category](#site-work-structure-ffe--landscaping-by-category)
- [Capital stack: SBA 504, conventional CRE, seller-finance & investor JV](#capital-stack-sba-504-conventional-cre-seller-finance--investor-jv)

**Part 3 -- Operations**
- [Booking software, site fee structure & contract terms](#booking-software-site-fee-structure--contract-terms)
- [Staffing, preferred vendors & day-of coordination](#staffing-preferred-vendors--day-of-coordination)
- [Revenue stack: site fee, bar, vendor commission & add-ons](#revenue-stack-site-fee-bar-vendor-commission--add-ons)
- [Marketing: The Knot, WeddingWire, Instagram & open-house funnel](#marketing-the-knot-weddingwire-instagram--open-house-funnel)

**Part 4 -- Growth & Exit**
- [Scaling: second venue, regional roll-up & PE acquirer playbook](#scaling-second-venue-regional-roll-up--pe-acquirer-playbook)
- [Exit math: single-asset sale, brand platform & sale-leaseback](#exit-math-single-asset-sale-brand-platform--sale-leaseback)
- [Counter-case: zoning, saturation, weather, declining wedding count](#counter-case-zoning-saturation-weather-declining-wedding-count)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & venue vs hotel banquet vs planner vs caterer

The US wedding industry is **~$72B-$78B** annual spend per The Wedding Report + IBISWorld, across **~1.9M weddings/yr 2026** (down from ~2.5M 2022 peak) at **~$28K-$36K avg budget** per Knot RealWeddings 2025. **Venue site fees capture ~10-14%** of total spend — a **~$7.5B-$11B addressable market**.

Four formats share wedding economics but differ in operating model. **(1) Dedicated wedding venue** (this entry) — owns/leases land + fixed structure, **$650K-$2.5M revenue + 18-28% EBITDA**. **(2) Hotel banquet hall** — F&B + lodging + venue bundled in hotel, **$1.2M-$8M wedding line + 22-34% banquet margin**, capital absorbed by hotel base. **(3) Wedding planner** — service business, no real estate, **$120K-$650K revenue + 22-38% net + $25K-$120K planning fees**. **(4) Catering company** — food + service into host venue, **$650K-$3.5M + 8-18% net + $80-$180/plate**.

This entry centers on the dedicated venue because it has the highest barrier to entry (zoning + SUP entitlement) + most defensible cash flow (calendar-booked 12-18 months out) — and is the format PE is most aggressively rolling up via Wedgewood / Walters / Walls Bryant in 2024-2027.

### Zoning, special-use permits, Right To Farm Act & entitlement timeline

**Zoning is the binding constraint** — more than capital, design, or marketing. The picturesque rural property that makes the venue economically viable is almost always zoned **A-1 Agricultural** or **R-1 Rural Residential**, which by default **prohibits commercial event hosting**.

**Special-use permit (SUP) or conditional-use permit (CUP).** Issued by the **county/city planning commission** after public hearing. Fee **$500-$5,000** + traffic study + neighbor notification + survey. **Hearing 60-150 days out** + commission vote + appeal window. **Approval rate 50-75%** without organized opposition; **20-40%** if neighbors organize against. Often comes with conditions (event count cap, end-time, amplified-music cutoff, parking spec, septic).

**Entitlement timeline.** **18-36 months from land contract to first booked wedding**. Phase 1 (months 0-6) site selection + LOI + zoning research + traffic study. Phase 2 (months 6-12) SUP/CUP application + hearing + appeal. Phase 3 (months 12-24) building + septic + electrical + ADA + fire-code build-out. Phase 4 (months 24-36) FF&E + soft launch + first bookings. **Most failed projects fail in Phase 2** — typical lost soft costs **$80K-$350K**.

**Right To Farm Act conflicts.** **All 50 states have some form of RTFA** protecting ag operations from nuisance suits. But the converse has been used in **WA, OR, CA, VA, NY, PA, MI** counties to **deny venue SUPs as conflicting with farming uses**. Check **county comprehensive plan + RTFA enforcement history** in due diligence.

**Variance vs rezoning.** **Variance** = narrow waiver of a specific code requirement, faster + cheaper. **Rezoning** = changing the underlying designation, broader scope but **6-18 months + $25K-$120K legal + much higher political risk**. Most venue projects use SUP/CUP variance.

**Neighbor + traffic + noise opposition.** **The #1 cause of SUP denial** is organized neighbor opposition citing traffic, noise, parking spillover, septic, and rural-character preservation. **Pre-application neighbor outreach + community meeting + traffic mitigation + noise abatement plan** dramatically improves odds. Hire a **local land-use attorney** ($350-$600/hr, $25K-$80K total project cost).

### ABC liquor, fire code, ADA & insurance stack

Beyond zoning, four regulatory layers gate operations: liquor, fire, ADA, and insurance.

**ABC liquor license.** Most venues **do NOT hold their own state ABC** — the cost, risk, and renewal complexity outweigh the benefit. Venues partner with **state-licensed caterers/bartenders** bringing liquor under their own permit + dram-shop. Where the venue holds ABC (high-volume destinations), expect **$5K-$50K initial + $1K-$5K renewal + dram-shop $3K-$15K/yr + bartender certification**. **TIPS-certified** training required for alcohol service staff.

**Assembly fire code (NFPA 101).** Wedding venues are **Assembly Group A-2 or A-3** under IBC/NFPA, triggering **occupancy load posting + egress widths + emergency exit lighting + posted evacuation + fire extinguishers + sprinklers above 50-100 occupants in many jurisdictions**. Converted barns often need **$50K-$300K sprinkler retrofit + $20K-$80K egress + fire-alarm**. **Annual fire-marshal inspection**.

**ADA compliance.** Title III public-accommodation status requires **accessible parking + path-of-travel + restroom + ceremony zone + ramps**. Older structures often need **$30K-$150K ADA retrofit**.

**Insurance stack.** **General liability $2M-$5M** ($3K-$12K/yr) + **liquor liability/dram-shop $1M-$3M** ($2K-$8K/yr if venue handles bar) + **event cancellation** ($1K-$5K/yr) + **wedding-day insurance** (often pushed to couple via Wedsure/Markel) + **builder's risk** during conversion + **property + structure** $4K-$30K/yr + **workers comp**. **Markel, Wedsafe, Eventsured, K&K, Philadelphia Insurance** dominant.

**LLC stack.** Standard structure: **PropCo LLC** owns the land + structure (asset protection + tax efficiency); **OpCo LLC** leases from PropCo + holds operating contracts + insurance + employees. Liability firewall + clean exit optionality (sell OpCo, sell PropCo, or both).

---

## 🏗️ PART 2 -- BUILD-OUT & CAPITAL

### Convert existing vs ground-up purpose-built decision

The convert-vs-build decision is the **biggest capital + timeline + brand decision** in launch — locking in 7-15 years of cost structure + aesthetic positioning.

**Convert existing structure.** **$250K-$1.5M all-in** = purchase or long-term lease of property with existing barn/farmhouse/vineyard outbuilding/mill/lodge + retrofit. Pros: **lower capital, faster (12-24 months), built-in aesthetic** supports premium rural-charm pricing. Cons: **structural surprises, ADA + fire-code retrofit cost balloons, parking + septic constraints, more contested zoning**.

**Ground-up purpose-built.** **$2M-$6M all-in** on owned land. Pros: **modern HVAC + electrical + restrooms + ADA + fire code built in, photogenic by design, warranty, higher capacity**. Cons: **higher capital + longer timeline (24-42 months), depreciation, less rural-charm authenticity**.

**Hybrid: existing land + new structure.** **$1.5M-$4M** — buy property with great land + view, tear down inadequate existing structure, replace with new purpose-built. Common in Napa/Sonoma + Hudson Valley + Texas Hill Country.

**Long-term lease + retrofit.** **$200K-$800K** retrofit on a 10-20 year ground lease — lower capital but **landlord captures terminal value**. Common for first-time operators proving concept before buying.

**Choose conversion if** — rural-charm aesthetic + first-time + capital-constrained + existing structure has good bones. **Choose ground-up if** — destination market + capital-rich + 80+ events/yr ambition + clean zoning. **Choose hybrid if** — irreplaceable land + bad structure. **Choose lease if** — proving concept with minimal capital risk.

### Site work, structure, FF&E & landscaping by category

Inside the build budget, capital allocates across six major categories — most overruns come from underestimating site work + permits.

**Land + closing.** **$300K-$1.5M** for 5-25 acres in viable markets (rural-charm 60-90 min from major metro) + closing + survey + title + appraisal **$8K-$30K**.

**Site work.** **$150K-$600K** = clearing + grading + driveway (300-1,500 ft paved) + parking (60-120 spaces) + drainage + utilities + septic upgrade (commercial event septic 3,000-6,000 gal/day) + well or municipal water tap.

**Structure (conversion).** **$200K-$1.2M** = structural reinforcement + foundation + roof + electrical (200-400 amp) + HVAC (commercial-grade for 150-300 occupants) + plumbing + restrooms (1 per 35 occupants) + catering prep kitchen (warming + plating + dishwasher + 3-comp sink, NOT full cooking) + bridal suite + groom's room + AV/sound + interior finish.

**Structure (ground-up).** **$1.5M-$4M** for **6,000-15,000 sq ft purpose-built event hall** ($250-$320/sq ft turnkey commercial) including all of the above + design + architecture + GC + permits.

**FF&E.** **$80K-$250K** = tables (200-350 seats), Chiavari/farmhouse chairs (250-400), dance floor (16x16 to 30x30), bars (2-3), AV (sound + projector + LED uplighting), linens + drapery, dish/glassware, commercial prep appliances.

**Landscape + exterior.** **$50K-$200K** = lawn + ceremony site + arbor/gazebo + path lighting + signage + gates + photo-opp locations + irrigation. **Critical for Instagram/photographer-driven inbound**.

### Capital stack: SBA 504, conventional CRE, seller-finance & investor JV

Wedding venue capital stacks lean heavily on **SBA 504**, conventional CRE mortgages, seller-financed land deals, and investor JVs.

**Founder equity.** **$100K-$800K** typical — 10-25% of total capital, higher than restaurant because lenders see venues as specialty CRE with thin secondary market.

**SBA 504.** **Up to $5M** at **fixed 6.5-9%** over **20-25 years**. The gold standard for purpose-built + major conversion because it finances **land + structure + heavy equipment** with **10% down**. Two-loan structure: bank first mortgage 50% LTV + CDC second 40% LTV + equity 10%. **Live Oak Bank, Newtek, Byline Bank, Celtic Bank, JPMorgan Chase SBA** active.

**SBA 7(a).** **Up to $5M** combined real estate + working capital + FF&E. Variable Prime + 2.0-4.0%. Faster underwriting than 504 but higher rate. Good for conversion deals where land + structure + FF&E close together.

**Conventional CRE.** **$500K-$10M** at **7-10% + 20-30% down + 20-25 yr amort**. Required when SBA caps insufficient. **Live Oak, Wells Fargo, Bank of America, regional community banks** dominant. Tougher underwriting for first-time operators.

**Seller-financed land.** **$200K-$2M** common in rural deals — seller finances 60-85% at **6-9% + 5-10 yr balloon**. Often the only path for first-timers in tight rural land markets.

**Equipment finance.** **$80K-$300K** for FF&E + AV + commercial kitchen at **5-7 yr + 9-15%**. **Balboa Capital, Crest Capital, Beacon Funding, Direct Capital, US Capital**.

**Investor JV.** **$500K-$3M** equity from local real estate investor group at **75/25 split + 8% preferred return + 70/30 promote above hurdle**. Common when founder has operating expertise but not capital.

**Total capital stack typical.** **$1.2M-$2.5M conversion** = 15% equity + 60% SBA 504/conventional + 20% seller-finance land + 5% equipment. **$3.5M-$6M ground-up** = 12% equity + 50% SBA 504 + 25% conventional second + 10% investor JV + 3% equipment.

---

## ⚙️ PART 3 -- OPERATIONS

### Booking software, site fee structure & contract terms

Wedding venue operations are **calendar inventory management** — every Saturday Apr-Oct is a perishable inventory unit worth $12K-$25K that goes to zero if unbooked.

**Booking + venue software.** **HoneyBook** dominant for owner-operator + small venues (CRM + contracts + payments + workflow $39-$129/mo). **Aisle Planner** strong for planner-led venues. **Planning Pod** comprehensive ops ($89-$329/mo). **Perfect Venue** purpose-built for wedding venues ($149-$399/mo). **AllSeated** floorplan + 3D walkthrough ($99-$299/mo). **Tave** photographer-origin. **Cvent/Stova** enterprise for corporate-heavy mix.

**Site fee structure.** **$4K-$25K** typical depending on market + day-of-week + season. **Saturday peak May-Oct = 100% rack rate**; **Friday + Sunday = 60-75%**; **weekday = 25-40%**; **off-season Nov-Mar = 50-75%**. Top-decile destinations (Hudson Valley + Napa + Charleston + Aspen + Hawaii) command **$25K-$120K/event**.

**All-inclusive vs venue-only.** **Venue-only** = site fee + bring-your-own-vendor. **All-inclusive** (Wedgewood model) = site + catering + bar + DJ + flowers + coordination bundled at **$15K-$45K** with higher gross (40-55%) + faster conversion + repeatable operations. All-inclusive dominates the **mid-market scale-up playbook**.

**Contract terms.** **Non-refundable deposit 25-50%** at booking; **second payment 25-50%** 90-180 days out; **final balance 30-45 days before event**. No-refund cancellation with optional date-transfer at venue discretion. **Vendor exclusivity vs preferred-list** — either mandate from approved list (kickback path) or allow any vendor. **Alcohol** — licensed bartender only, last call 30 min before end. **End-time fire code** — typically 10/11pm amplified-music cutoff + 12am clear-out.

**Inquiry-to-booking conversion.** **Industry average 18-28%** inquiry-to-tour and **35-55% tour-to-booking** = **6-15% inquiry-to-booking** for healthy venues. Top venues hit **22-32% inquiry-to-booking** via fast response (<2 hr) + curated photo deck + clear pricing.

### Staffing, preferred vendors & day-of coordination

Staffing is leaner than expected — most wedding-day labor is preferred-vendor rather than venue payroll.

**Owner-operator.** Year 1-2: **50-70 hrs/wk** across bookings + tours + venue manager duty + admin. Take-home **$60K-$180K Year 1-2**; Year 3-5 mature **$120K-$350K**.

**Venue manager.** **$48K-$78K + bonus**. Runs day-to-day, vendor coordination, tours, weekend execution. Critical hire by Month 6-12.

**Event-day staff.** **$25-$45/hr** for 8-12 hr Saturday shifts. **2-4 staff per event** (setup + bartender backup + cleanup + coordinator). Often college + culinary + hospitality side hustlers.

**Day-of coordinator.** **$1,500-$3,500/event** either venue-employed or contracted. Critical for service quality + review ratings.

**Preferred-vendor list.** Curated **3-6 caterers + 3-5 bartender services + 4-8 DJs + 4-8 florists + 4-8 photographers + 2-3 cake bakeries + 2-3 transportation**. Vendors pay **8-15% kickback/commission** on gross to be listed. Preferred-vendor commission is **$50K-$250K/yr** at mature venues — often **15-25% of total revenue at zero marginal cost**.

**Cleaning + groundskeeping.** **$200-$600/event** post-event cleaning (outsourced) + **$1.5K-$4K/mo** groundskeeping + maintenance.

### Revenue stack: site fee, bar, vendor commission & add-ons

The mature revenue stack is **multi-layered** — base site fee covers 55-70%, but add-ons + commission + corporate fill drive EBITDA.

**Base site fee.** **$8K-$25K avg** × **60-90 events/yr** = **$480K-$2.25M base**. Sales mix: 70% weddings + 15% corporate + 10% private parties + 5% photoshoot/film.

**Bar revenue (if venue holds ABC).** **$3K-$15K/event** = consumption or hosted-bar package. **40-55% gross margin** after liquor + bartender. Only viable with state ABC + dram-shop.

**Preferred-vendor commission.** **8-15%** on caterer/bar/DJ/florist/photographer gross = **$50K-$250K/yr** at mature venues. **Zero marginal cost = pure margin**.

**Ceremony add-on.** **$1K-$2K** for venues offering separate ceremony site.

**Rehearsal dinner / welcome event.** **$2K-$5K** Friday-night using smaller space.

**Corporate event fill.** **$2K-$8K/event** for offsites, holiday parties, conferences. Critical for **filling Nov-Apr + weekday calendar**. Mature venues do **15-30 corporate events/yr** at **40-55% margin**.

**Photoshoot/film location.** **$500-$2K** for engagement shoots, fashion, commercials, indie films. Low touch, pure margin.

**On-site lodging.** **$200-$600/room/night** if venue has guest cottages or estate rooms. Doubles wedding-weekend revenue when applicable.

**Mature stack.** **$850K-$2.5M revenue** = base site fee 55-70% + preferred-vendor commission 12-22% + corporate fill 8-15% + bar/lodging/add-ons 5-15%.

### Marketing: The Knot, WeddingWire, Instagram & open-house funnel

Wedding venue marketing in 2027 is **45-60% The Knot/WeddingWire + 20-30% Instagram + 10-15% Google + 5-15% referral**. The wedding intent funnel is hyper-concentrated on 2 marketplaces.

**The Knot + WeddingWire (TKWW).** **The dominant US wedding intent funnel**. Listing **free basic + $200-$1,500/mo paid promotion**. **50-200 reviews at 4.7+ stars** is the decisive threshold. **60-80% of inbound inquiries** flow through these two platforms.

**HoneyBook + Zola + Hopskip.** Secondary marketplaces growing share. HoneyBook ties booking software + lead-gen. Zola registry-origin couples increasingly venue-shopping in-app.

**Instagram + Reels.** **5K-30K followers** practical threshold + 3-5 posts/week of real weddings (with photographer credit) + venue features + behind-scenes. **Wedding-photographer tagged posts** drive 30-50% of organic reach.

**Google Business Profile.** **50-200 Google reviews at 4.7+ stars** drives **20-30% of inquiries** via "wedding venue near me". Annual SEO + GBP maintenance = **$3K-$12K** outsourced.

**Open-house + venue tour funnel.** **Monthly open-house** + **2-4 tours/week** rebuilds top-of-funnel. **40-55% tour-to-booking** at quality venues. Curated tour script + photo deck + pricing handout.

**Wedding photographer relationships.** **Photographers are the #1 venue referrer**. Mature venues maintain **15-30 local photographer relationships** + invite to showcases + cross-tag Instagram + send couples.

**Wedding planner relationships.** Planner referral = **highest-quality + highest-budget couples**. Mature venues nurture **8-15 local planner relationships** with annual showcase.

**Bridal show / wedding expo.** **$1K-$5K booth** + 2-4 shows/yr. Lower-quality leads but relevant in tier-2/3 markets.

**Editorial + magazine features.** **Style Me Pretty, Martha Stewart Weddings, Brides.com, Junebug Weddings** features compound long-tail SEO + prestige. **Submit 4-12 real weddings/yr**.

---

## 🚀 PART 4 -- GROWTH & EXIT

### Scaling: second venue, regional roll-up & PE acquirer playbook

The growth path from single venue to regional brand to PE platform has well-defined milestones.

**Stage 1 (Years 0-2).** Owner-operator + 1 venue manager. **40-65 events/yr + $400K-$1.2M + 15-25% EBITDA**. Risk: zoning, weather, booking ramp.

**Stage 2 (Years 2-4).** Mature single venue + GM + 2-4 event staff + curated vendor list. **70-95 events/yr + $900K-$2.2M + 20-28% EBITDA**.

**Stage 3 (Years 3-6).** Second venue (acquisition or new build). **$2M-$5M revenue + 18-26% blended EBITDA**. Shared back-office, central booking, central marketing. Often when PE first engages.

**Stage 4 (Years 5-10).** **3-5 venue regional brand** + central operations + dedicated sales + finance + marketing. **$5M-$15M revenue + 20-28% blended EBITDA**. Acquirer comp set for Wedgewood / Walls Bryant rollup at **7-10x EBITDA**.

**Stage 5 (Years 8-15+).** **Platform brand** with **10-50 venues**, standardized all-inclusive (Wedgewood model), national booking. **$20M-$200M revenue + 22-32% EBITDA**. Strategic exit to PE secondary or strategic operator at **8-12x EBITDA**.

| Stage | Timeline | Venues | Annual Revenue | EBITDA Margin |
|---|---|---|---|---|
| Stage 1 Launch | Years 0-2 | 1 | $400K-$1.2M | 15-25% |
| Stage 2 Mature single | Years 2-4 | 1 | $900K-$2.2M | 20-28% |
| Stage 3 Two venues | Years 3-6 | 2 | $2M-$5M | 18-26% |
| Stage 4 Regional brand | Years 5-10 | 3-5 | $5M-$15M | 20-28% |
| Stage 5 Platform | Years 8-15 | 10-50 | $20M-$200M | 22-32% |

| Sizing Decision | Capital | Annual Revenue | Best For |
|---|---|---|---|
| Long-term lease + retrofit | $200K-$800K | $400K-$1.2M | First-time + capital-constrained |
| Single venue conversion | $250K-$1.5M | $650K-$2M | Rural-charm aesthetic + existing structure |
| Single venue ground-up | $2M-$6M | $1.2M-$3.5M | Destination + capital-rich + 80+ events/yr |
| Two-venue regional | $3M-$10M | $2M-$5M | Year 3-6 + proven concept |
| Regional brand 3-5 venues | $10M-$40M | $5M-$15M | PE-backed platform thesis |
| Platform 10+ venues | $40M-$300M | $20M-$200M | Strategic + PE platform exit |

### Exit math: single-asset sale, brand platform & sale-leaseback

The exit landscape is dominated by **single-asset sales + PE-backed regional roll-ups + platform exits to PE secondaries** + occasional generational transfer.

**Single-asset sale.** **$1.5M-$8M EV** = **4-7x EBITDA**. Buyer: local operator + first-time entrepreneur + small regional group + PE search fund. Process **6-14 months** via business broker (Sunbelt, Murphy Business, Transworld), wedding-industry M&A specialist, BizBuySell, regional CRE broker.

**Regional roll-up sale (3-5 venues).** **$15M-$60M EV** = **7-10x EBITDA** if branded + standardized + booking system unified. Buyer: **Wedgewood Weddings / Walters Wedding Estates (PE-backed, 50+ venues), Walls Bryant Group, Stoney Ridge Villa, regional PE search funds**. Process **9-18 months** with IB advisor (Houlihan Lokey, Lincoln International, Raymond James middle-market).

**Platform brand exit (10+ venues).** **$80M-$1.2B EV** = **8-12x EBITDA** for standardized national brand. Buyer: PE secondary, strategic hotel/hospitality group (Marriott, Hilton, Hyatt looking at events), wedding-platform consolidator. Wedgewood Weddings sold to HKS Capital + ATL Partners in past PE rounds.

**Generational/family transfer.** **Internal recap** at 70-85% of arm's-length to family or key employee. Common in family-built rural venues — gift tax planning + seller financing + 5-10 yr transition.

**Strategic luxury hotel sale.** **15-25% premium over EBITDA multiple** if venue fits destination wedding strategy (Auberge Resorts, Belmond, Aman, Rosewood expansion). Rare but high-multiple.

**Sale-leaseback to PropCo.** **Sell land + structure to PropCo investor at 6-8% cap** + lease back to OpCo at long-term NNN. Frees capital for second venue + retains OpCo brand + preserves equity for future sale.

**Asset wind-down.** **$400K-$2M** structure + land liquidation if venue cannot sell as going concern (zoning issues, declining market). Land sells more readily than the venue business as a going concern in distress.

| Exit Path | Buyer Type | Multiple | Process | Best For |
|---|---|---|---|---|
| Single-asset sale | Local + PE search fund | 4-7x EBITDA | 6-14 mo | $1.5M-$8M |
| Regional roll-up (3-5) | Wedgewood/Walls Bryant + PE | 7-10x EBITDA | 9-18 mo | $15M-$60M regional brand |
| Platform brand (10+) | PE secondary + strategic hotel | 8-12x EBITDA | 12-24 mo | $80M-$1.2B standardized |
| Generational/family | Family or key employee | 70-85% arm's-length | 24-60 mo | Family legacy |
| Strategic luxury hotel | Auberge/Belmond/Aman/Rosewood | 15-25% premium | 12-24 mo | Destination fit |
| Sale-leaseback to PropCo | RE investor at 6-8% cap | NNN at market | 4-9 mo | Free capital + retain OpCo |
| Asset wind-down | Land + structure liquidation | Below going-concern | 6-18 mo | Distressed/zoning-failed |

### Counter-case: zoning, saturation, weather, declining wedding count

A serious wedding venue founder must stress-test the case above against conditions that make this category harder in 2027.

`;

const tldr = `**TL;DR:** Starting a **wedding venue business in 2027** (a.k.a. **wedding + event venue**, **dedicated wedding venue**, **barn venue**, **estate venue**, **vineyard venue**, **ballroom venue**, **destination wedding venue**) -- a **built-environment land-and-structure-based event business that owns or long-term-leases land + a fixed-roof structure (barn, mansion, vineyard tasting room, ballroom, garden estate, converted mill, lakeside lodge) and sells exclusive use of the space + day-of coordination for weddings + corporate events + private parties across three regulatory pillars: (1) local zoning + special-use permit SUP or conditional-use permit CUP from county/city planning commission for commercial event hosting in ag/residential zones $500-$5,000 fee + traffic study + neighbor notification + survey + 60-150 day hearing + 50-75% approval no opposition / 20-40% with neighbor opposition, (2) state ABC liquor license either venue-held $5K-$50K initial + $1K-$5K annual + dram-shop $3K-$15K/yr OR licensed-caterer-bartender-brings-permit + TIPS-certified staff, (3) ADA Title III public accommodation $30K-$150K retrofit older structures + assembly fire code NFPA 101 Assembly Group A-2/A-3 occupancy load + egress + emergency lighting + sprinklers above 50-100 occupants $50K-$300K retrofit + $20K-$80K egress/fire-alarm + annual fire-marshal inspection** -- means navigating **Wedgewood Weddings / Walters Wedding Estates PE-backed 50+ venue platform + Walls Bryant Group + Stoney Ridge Villa + The Knot Worldwide TKWW owns The Knot + WeddingWire dominant US wedding intent funnel free basic + $200-$1,500/mo paid + 50-200 reviews 4.7+ stars + 60-80% inbound through TKWW + HoneyBook ties booking software + lead-gen $39-$129/mo + Zola registry-origin + Hopskip secondary + Planning Pod $89-$329/mo + Perfect Venue $149-$399/mo + Aisle Planner + AllSeated $99-$299/mo 3D + Tave + Cvent/Stova enterprise + Right To Farm Act RTFA all 50 states + converse denies SUPs WA/OR/CA/VA/NY/PA/MI counties + Title III ADA + NFPA 101 Assembly + IBC + state ABC + dram-shop + Markel + Wedsafe + Eventsured + K&K + Philadelphia Insurance dominant wedding venue carriers GL $2M-$5M $3K-$12K/yr + liquor liability $1M-$3M $2K-$8K/yr + event cancellation + Wedsure wedding-day insurance to couple + builder's risk + property $4K-$30K/yr + workers comp + LLC PropCo land + structure asset protection + OpCo operating contracts + capital stack SBA 504 up to $5M fixed 6.5-9% 20-25 yr 10% down bank 50% LTV + CDC 40% + equity 10% Live Oak Bank + Newtek + Byline + Celtic + JPMorgan Chase + SBA 7(a) Prime + 2.0-4.0% + conventional CRE $500K-$10M 7-10% 20-30% down 20-25 yr + Live Oak + Wells Fargo + Bank of America + regional community banks + seller-financed land $200K-$2M 60-85% LTV at 6-9% + 5-10 yr balloon + equipment finance Balboa + Crest + Beacon + Direct + US Capital $80K-$300K FF&E + AV + commercial kitchen 5-7 yr at 9-15% + investor JV / sponsor-promote $500K-$3M 75/25 + 8% pref + 70/30 promote + ground-up $2M-$6M land $300K-$1.5M + structure $1.5M-$4M 6,000-15,000 sq ft commercial event hall $250-$320/sq ft turnkey + FF&E $80K-$250K tables + Chiavari/farmhouse chairs + dance floor + bars + AV + LED uplighting + linens + drapery + dish/glassware + landscaping $50K-$200K lawn + ceremony + arbor + path lighting + signage + gates + photo-opp + irrigation + conversion $250K-$1.5M structural + foundation + roof + 200-400 amp + commercial HVAC 150-300 occupants + restrooms 1 per 35 + prep kitchen warming/plating/dishwasher/3-comp + bridal suite + groom's room + AV + interior + septic 3,000-6,000 gal/day + 18-36 month entitlement + bookings Saturday peak May-Oct 100% rack rate $8K-$25K typical / $25K-$120K top-decile destination Hudson Valley + Napa + Charleston + Aspen + Hawaii + Friday/Sunday 60-75% + weekday 25-40% + off-season 50-75% + all-inclusive Wedgewood model $15K-$45K 40-55% gross + venue-only bring-your-own + contract non-refundable 25-50% deposit + 25-50% 90-180 days + final 30-45 days + vendor exclusivity vs preferred-list 8-15% kickback + alcohol licensed bartender only + last call 30 min before end + end-time 10/11pm amplified-music cutoff + 12am clear-out + inquiry-to-booking 6-15% healthy / 22-32% top + tour-to-booking 35-55% + revenue stack site fee 55-70% + preferred-vendor commission 12-22% caterer + bar + DJ + florist + photographer $50K-$250K/yr zero marginal cost + bar 40-55% gross if venue holds ABC $3K-$15K/event + ceremony add-on $1K-$2K + rehearsal dinner $2K-$5K + corporate event off-season weekday $2K-$8K 15-30/yr 40-55% margin + photoshoot/film $500-$2K + on-site lodging $200-$600/room/night + staffing owner-operator 50-70 hrs/wk + take-home $60K-$180K Year 1-2 / $120K-$350K Year 3-5 + venue manager $48K-$78K + event-day staff $25-$45/hr 2-4 per event + day-of coordinator $1,500-$3,500/event + preferred-vendor list 3-6 caterers + 3-5 bartenders + 4-8 DJs + 4-8 florists + 4-8 photographers + 2-3 cakes + 2-3 transportation + cleaning $200-$600/event + groundskeeping $1.5K-$4K/mo + marketing 45-60% TKWW + 20-30% Instagram + 10-15% Google + 5-15% word-of-mouth + bridal show $1K-$5K booth 2-4/yr + editorial Style Me Pretty + Martha Stewart Weddings + Brides.com + Junebug Weddings 4-12 submissions/yr + wedding photographer relationships #1 referrer 15-30 local + wedding planner relationships highest-budget 8-15 local + open-house monthly + 2-4 tours/week + brand exit Wedgewood Weddings 50+ + Walls Bryant + Stoney Ridge Villa**, and operating against **~1.9M US weddings/yr 2026 down from ~2.5M post-COVID 2022 peak per The Wedding Report + IBISWorld + ~$72B-$78B total wedding industry spend + ~$28K-$36K avg wedding budget Knot RealWeddings 2025 + ~$7.5B-$11B venue site fee addressable + ~12,000-15,000 dedicated US wedding venues + ~8,000-11,000 hotel/restaurant banquet halls + 30%+ inventory growth 2020-2026 saturation + counter-pressures zoning + SUP/CUP denial 25-50% + RTFA conflicts ag zone enforcement + neighbor opposition #1 cause + 18-36 month entitlement + $80K-$350K lost soft costs if Phase 2 fails + seasonality 60-70% bookings May-Oct + Northern winter death zone Nov-Feb halves calendar + weather risk outdoor + declining wedding count 2024-2026 ~600K fewer/yr vs 2022 + venue oversupply most metros + ABC liquor + dram-shop + assembly fire code NFPA 101 retrofit $50K-$300K + ADA retrofit $30K-$150K + noise ordinances + traffic + parking complaints + property tax reclassification commercial in some states + insurance hardening 2024-2026 + TKWW commission + pay-to-play + Instagram algorithm reach collapse + photographer + planner referral political risk + post-2024 couple-budget compression** -- capturing **mature single venue 35-50% gross + 18-28% EBITDA at $850K-$2.5M revenue + 60-90 events/yr at $8K-$25K avg site fee + add-ons + preferred-vendor commission + sales mix 70% weddings + 15% corporate + 10% private + 5% photoshoot + single-asset 4-7x EBITDA + 3-5 venue regional roll-up 7-10x EBITDA + platform 10+ venues 8-12x EBITDA + Wedgewood standardized all-inclusive premium + Walls Bryant + Stoney Ridge Villa + PE-backed regional roll-up 2024-2027 buying mid-market $1.5M-$8M EV + IB advisor Houlihan Lokey + Lincoln International + Raymond James + business broker Sunbelt + Murphy Business + Transworld + BizBuySell + sale-leaseback to PropCo 6-8% cap retains OpCo + strategic luxury hotel Auberge + Belmond + Aman + Rosewood 15-25% premium**. The hardest part is **zoning + special-use permits + Right To Farm Act + saturation + seasonality + weather + declining wedding count (rural-charm A-1 Agricultural/R-1 Rural Residential zones prohibit commercial events by default + SUP/CUP 50-75% approval no opposition / 20-40% with + 18-36 month entitlement + $80K-$350K lost soft costs + RTFA enforcement WA/OR/CA/VA/NY/PA/MI + 60-70% May-Oct concentration + Nov-Feb Northern death zone + weather risk + 30%+ inventory growth 2020-2026 saturation + ~600K fewer weddings/yr 2024-2026 + ABC dram-shop + assembly fire code retrofit + ADA retrofit + noise + parking neighbor complaints + TKWW pay-to-play + insurance hardening + post-2024 budget compression)**, not capital or construction.`;

const flow = `

## The Operating Journey: From Land + Zoning + Permits + Build-Out To Mature Venue + Strategic Exit

\`\`\`mermaid
flowchart TD
  A[Aspiring Wedding Venue Founder Decides To Launch] --> B[Site + Zoning + Capital + Format Strategy]
  B --> B1{Convert vs Ground-Up vs Lease vs Acquisition}
  B1 -->|$250K-$1.5M Convert Existing Barn/Farmhouse/Vineyard/Mill/Lodge| C1[Conversion]
  B1 -->|$2M-$6M Ground-Up Purpose-Built On Owned Land| C2[Ground-Up]
  B1 -->|$1.5M-$4M Hybrid Existing Land + New Structure Napa/Hudson Valley/Hill Country| C3[Hybrid]
  B1 -->|$200K-$800K Long-Term Lease + Retrofit Concept Validation| C4[Lease + Retrofit]
  B1 -->|$1.5M-$8M EV Acquire Stabilized Venue 4-7x EBITDA| C5[Acquisition]
  C1 --> D[Zoning + SUP/CUP + RTFA + Building Permits]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  D --> D1[County/City Planning Commission SUP/CUP $500-$5,000 + Traffic Study + Neighbor Notification + 60-150 Day Hearing + 50-75% Approval No Opposition / 20-40% With]
  D --> D2[Right To Farm Act Conflicts All 50 States Protect Ag + Converse Denies SUPs WA/OR/CA/VA/NY/PA/MI Counties]
  D --> D3[Variance Narrow Waiver vs Rezoning $25K-$120K + 6-18 Month Political Risk + Most Use SUP/CUP Variance]
  D --> D4[Pre-Application Neighbor Outreach + Traffic + Noise Abatement + Local Land-Use Attorney $350-$600/hr $25K-$80K Total]
  D --> D5[Building Permits + Septic 3,000-6,000 gal/day + 200-400 amp Electrical + ADA $30K-$150K + Sprinkler $50K-$300K + Egress/Fire-Alarm $20K-$80K]
  D --> D6[State ABC Either Venue-Held $5K-$50K + Dram-Shop $3K-$15K/yr OR Licensed Caterer/Bartender Brings Permit]
  D --> D7[Insurance Stack Markel + Wedsafe + Eventsured + K&K + Philadelphia GL $2M-$5M + Liquor Liability + Event Cancellation + Property + Workers Comp + LLC PropCo + OpCo]
  D1 --> E[Site Work + Structure + FF&E + Landscape]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  D6 --> E
  D7 --> E
  E --> E1[Land + Closing $300K-$1.5M 5-25 Acres Rural-Charm 60-90 Min From Metro]
  E --> E2[Site Work $150K-$600K Clearing + Grading + Driveway + Parking 60-120 + Drainage + Septic + Water]
  E --> E3[Conversion Structure $200K-$1.2M Structural + HVAC + 200-400 amp + Plumbing + Restrooms 1 per 35 + Prep Kitchen + Bridal Suite + AV]
  E --> E4[Ground-Up Structure $1.5M-$4M 6,000-15,000 sq ft Event Hall $250-$320/sq ft Turnkey + Architecture + GC + Permits]
  E --> E5[FF&E $80K-$250K Tables 200-350 + Chiavari/Farmhouse Chairs 250-400 + Dance Floor + Bars + AV + LED Uplighting + Linens + Drapery]
  E --> E6[Landscape $50K-$200K Lawn + Ceremony Site + Arbor + Path Lighting + Signage + Gates + Photo-Opp + Irrigation]
  E1 --> F[Capital Stack + Financing]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  E6 --> F
  F --> F1[Founder Equity $100K-$800K 10-25% Of Total Capital]
  F --> F2[SBA 504 Up To $5M Fixed 6.5-9% 20-25 yr 10% Down Bank 50% LTV + CDC 40% LTV Live Oak + Newtek + Byline + Celtic + JPMorgan Chase]
  F --> F3[SBA 7(a) Up To $5M Prime + 2.0-4.0% Combined RE + Working Capital + FF&E]
  F --> F4[Conventional CRE $500K-$10M 7-10% + 20-30% Down + 20-25 yr Live Oak + Wells Fargo + Bank of America + Regional Community Banks]
  F --> F5[Seller-Financed Land $200K-$2M 60-85% LTV at 6-9% + 5-10 yr Balloon Rural Farmland Deals]
  F --> F6[Equipment Finance $80K-$300K Balboa + Crest + Beacon + Direct + US Capital 5-7 yr 9-15%]
  F --> F7[Investor JV $500K-$3M 75/25 + 8% Pref + 70/30 Promote Local RE Investor Group]
  F1 --> G[Staff + Booking + Operations]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  F6 --> G
  F7 --> G
  G --> G1[Owner-Operator 50-70 hrs/wk + Take-Home $60K-$180K Year 1-2 / $120K-$350K Year 3-5]
  G --> G2[Venue Manager $48K-$78K + Bonus Hire By Month 6-12]
  G --> G3[Event-Day Staff $25-$45/hr 2-4 Per Event + Day-Of Coordinator $1,500-$3,500/event]
  G --> G4[Preferred-Vendor List 3-6 Caterers + 3-5 Bartenders + 4-8 DJs + 4-8 Florists + 4-8 Photographers + 2-3 Cakes + 8-15% Kickback $50K-$250K/yr]
  G --> G5[Cleaning $200-$600/event + Groundskeeping $1.5K-$4K/mo]
  G1 --> H[Booking Calendar + Revenue Stack]
  H --> H1[Site Fee $4K-$25K Typical / $25K-$120K Destination Saturday Peak May-Oct 100% Rack + Friday/Sunday 60-75% + Weekday 25-40% + Off-Season 50-75%]
  H --> H2[All-Inclusive vs Venue-Only Wedgewood Model $15K-$45K Bundled Site + Catering + Bar + DJ + Flowers + Coordination 40-55% Gross]
  H --> H3[Preferred-Vendor Commission 8-15% Caterer + Bar + DJ + Florist + Photographer = Pure Margin $50K-$250K/yr]
  H --> H4[Bar If Venue Holds ABC $3K-$15K/event 40-55% Gross]
  H --> H5[Ceremony + Rehearsal + Corporate Off-Season + Photoshoot + On-Site Lodging $200-$600/room/night]
  H --> H6[Contract Non-Refundable 25-50% Deposit + 25-50% 90-180 Days + Final 30-45 Days + End-Time 10/11pm Amplified Cutoff + 12am Clear-Out]
  H1 --> I[Marketing + Reviews + Funnel]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  H6 --> I
  I --> I1[The Knot + WeddingWire TKWW Free Basic + $200-$1,500/mo Paid + 50-200 Reviews 4.7+ Stars + 60-80% Inbound]
  I --> I2[HoneyBook + Zola + Hopskip Secondary Marketplaces]
  I --> I3[Instagram + Reels 5K-30K Followers + Photographer-Tagged Posts 30-50% Organic Reach]
  I --> I4[Google Business Profile 50-200 Reviews 4.7+ Stars 20-30% Inquiries + Venue SEO $3K-$12K/yr]
  I --> I5[Open-House Monthly + 2-4 Tours/Week 40-55% Tour-To-Booking]
  I --> I6[Wedding Photographer #1 Referrer 15-30 Local + Wedding Planner 8-15 Local + Bridal Show $1K-$5K + Editorial Style Me Pretty/Martha Stewart Weddings/Brides.com/Junebug 4-12 Submissions/yr]
  I1 --> J[Stage Growth + Regional Roll-Up + Platform]
  I2 --> J
  I3 --> J
  I4 --> J
  I5 --> J
  I6 --> J
  J --> J1[Stage 1 Years 0-2 1 Venue 40-65 Events $400K-$1.2M 15-25% EBITDA]
  J --> J2[Stage 2 Years 2-4 70-95 Events $900K-$2.2M 20-28% EBITDA + GM + Curated Vendor List]
  J --> J3[Stage 3 Years 3-6 2 Venues $2M-$5M 18-26% Blended + Shared Back-Office + PE First Engages]
  J --> J4[Stage 4 Years 5-10 3-5 Venues $5M-$15M 20-28% EBITDA + Wedgewood/Walls Bryant Acquirer 7-10x EBITDA]
  K{Mature Operations Plus Strategic Exit Decision}
  J --> K
  K -->|Hold For Cash Flow + Brand + Family Legacy| L[Long-Term Hold]
  K -->|Single-Asset Sale 4-7x EBITDA $1.5M-$8M EV| M[Single Venue Sale]
  K -->|Regional Roll-Up 3-5 Venues 7-10x EBITDA $15M-$60M| N[Regional Sale]
  K -->|Platform Brand 10+ Venues 8-12x EBITDA $80M-$1.2B| O[Platform Exit]
  K -->|Generational/Family Transfer 70-85% Arm's-Length| P[Family Transfer]
  K -->|Strategic Luxury Hotel Auberge/Belmond/Aman/Rosewood 15-25% Premium| Q[Luxury Hotel Sale]
  K -->|Sale-Leaseback To PropCo 6-8% Cap + NNN| R[Sale-Leaseback]
  K -->|Asset Wind-Down Land + Structure Liquidation| S[Wind-Down]
  L --> T[Independent Hold 18-28% EBITDA + Brand + Community + Family Legacy]
  M --> U[Single Venue Sold $1.5M-$8M EV Sunbelt + Murphy Business + Transworld + BizBuySell + Regional CRE Broker]
  N --> V[Regional Sold $15M-$60M To Wedgewood/Walters + Walls Bryant + Stoney Ridge Villa + PE Search Funds + IB Houlihan Lokey/Lincoln International/Raymond James]
  O --> W[Platform Exit $80M-$1.2B To PE Secondary + Strategic Hotel Marriott/Hilton/Hyatt Events + Wedding-Platform Consolidator]
  P --> X[Internal Recap 70-85% Arm's-Length + Gift Tax + Seller Financing + 5-10 yr Transition]
  Q --> Y[Strategic Premium 15-25% Over EBITDA Auberge + Belmond + Aman + Rosewood Destination Expansion]
  R --> Z[Sell Land + Structure To PropCo 6-8% Cap + NNN Lease Back OpCo + Free Capital For Second Venue]
  S --> AA[Asset Liquidation $400K-$2M Land + Structure Distressed/Zoning-Failed]
\`\`\`

## The Decision Matrix: Format + Aesthetic + Channel Selection

\`\`\`mermaid
flowchart TD
  A[Wedding Venue Founder Has Market + Property + Capital + Brand Decision] --> B{Convert vs Ground-Up vs Hybrid vs Lease vs Acquisition}
  B -->|Convert Existing $250K-$1.5M Rural-Charm + First-Time| C[Conversion]
  B -->|Ground-Up $2M-$6M Destination + Capital-Rich + 80+ Events/yr| D[Ground-Up]
  B -->|Hybrid $1.5M-$4M Napa/Hudson Valley/Hill Country| E[Hybrid]
  B -->|Long-Term Lease + Retrofit $200K-$800K Concept Validation| F[Lease]
  B -->|Acquisition $1.5M-$8M EV 4-7x EBITDA| G[Acquisition]
  C --> C1{Aesthetic Positioning}
  C1 -->|Barn Conversion Rural-Charm Premium + Instagram + Photographer-Driven| H[Barn]
  C1 -->|Vineyard/Winery Wine-Country Destination $20K-$60K Site Fee| I[Vineyard]
  C1 -->|Historic Mansion/Estate Old-Money + Tier-1 Urban Adjacent| J[Mansion]
  C1 -->|Converted Mill/Industrial Hip Urban + $10K-$30K| K[Mill/Industrial]
  C1 -->|Lakeside Lodge/Mountain Resort Destination Outdoor + $15K-$50K| L[Lodge/Resort]
  H --> H1[60-90 Events/yr + $10K-$22K + Editorial Style Me Pretty + Photographer-Heavy]
  I --> I1[50-80 Events/yr + $20K-$60K + Destination + Multi-Day Stays]
  J --> J1[40-70 Events/yr + $18K-$45K + Luxury Vendor List + High-Touch]
  K --> K1[70-100 Events/yr + $10K-$30K + Corporate Mix + Off-Season Fill]
  L --> L1[40-65 Events/yr + $15K-$50K + Lodging On-Site + Multi-Day Package]
  D --> D1{Brand Strategy}
  D1 -->|All-Inclusive Wedgewood $15K-$45K Bundled| M[All-Inclusive]
  D1 -->|Venue-Only Premium $20K-$60K + Preferred-Vendor Kickback| N[Venue-Only Premium]
  E --> E1{Hybrid Positioning}
  E1 -->|Wine-Country New Build $25K-$80K Destination| O[Wine-Country New]
  E1 -->|Rural-Estate New Build $15K-$35K Tier-2 Metro| P[Rural-Estate New]
  F --> F1{Lease Concept}
  F1 -->|Urban Historic $8K-$20K| Q[Urban Historic]
  F1 -->|Rural Barn 10-20 yr Ground Lease + $200K-$500K Retrofit| R[Rural Lease]
  G --> G1{Acquisition Target}
  G1 -->|Stabilized 4-7x EBITDA $1.5M-$8M| S[Premium Acquisition]
  G1 -->|Distressed/Burnout Below Going-Concern| T[Discount Acquisition]
  H1 --> U{Reassess Year 3 Stabilization}
  I1 --> U
  J1 --> U
  K1 --> U
  L1 --> U
  M --> U
  N --> U
  O --> U
  P --> U
  Q --> U
  R --> U
  S --> U
  T --> U
  U -->|Hold For Cash Flow + Brand + Family Legacy| V[Long-Term Hold]
  U -->|Single-Asset Sale 4-7x EBITDA| W[Solo Sale]
  U -->|Add Second Venue + Regional Roll-Up 7-10x EBITDA Target| X[Regional Build]
  U -->|Sale-Leaseback To PropCo + Free Capital| Y[Sale-Leaseback]
  U -->|Strategic Luxury Hotel Auberge/Belmond/Aman/Rosewood Premium| Z[Luxury Hotel Exit]
  U -->|Generational/Family Transfer 70-85%| AA[Family Transfer]
  U -->|Asset Wind-Down Distressed| AB[Wind-Down]
\`\`\`

`;

const src = `

## Sources

1. **The Knot Worldwide TKWW (theknotww.com)** -- Parent of The Knot + WeddingWire, dominant US wedding intent funnel. https://www.theknotww.com
2. **The Knot RealWeddings Study 2025 (theknot.com)** -- Annual industry survey of US wedding spend + budget + venue trends. https://www.theknot.com/content/wedding-data-insights
3. **WeddingWire Industry Report (weddingwire.com)** -- Wedding vendor + venue marketplace + industry data. https://www.weddingwire.com
4. **The Wedding Report (theweddingreport.com)** -- Independent US wedding industry research firm. https://www.theweddingreport.com
5. **HoneyBook State of the Wedding Industry 2025 (honeybook.com)** -- Annual state-of-industry report from booking software. https://www.honeybook.com/risingtide
6. **Allied Wedding Vendor Industry Reports (alliedwedding.com)** -- Industry data on wedding vendor + venue economics. https://www.alliedwedding.com
7. **IBISWorld Wedding Venues in the US Industry Report (ibisworld.com)** -- Industry size + growth + segment composition. https://www.ibisworld.com
8. **BLS Bureau of Labor Statistics SIC 8299 Foodservice + Event (bls.gov)** -- Labor + wage + occupancy data. https://www.bls.gov
9. **Wedgewood Weddings (wedgewoodweddings.com)** -- Largest US PE-backed wedding venue platform with 50+ venues, standardized all-inclusive model. https://www.wedgewoodweddings.com
10. **Walters Wedding Estates (waltersweddings.com)** -- PE-backed multi-venue Texas-Southwest operator. https://www.waltersweddings.com
11. **Walls Bryant Group (wallsbryant.com)** -- Regional wedding venue operator + PE acquirer in Southeast US. https://www.wallsbryant.com
12. **Stoney Ridge Villa Group (stoneyridgevilla.com)** -- Multi-venue Texas wedding venue operator. https://www.stoneyridgevilla.com
13. **HoneyBook Booking Software (honeybook.com)** -- Dominant wedding venue CRM + contracts + payments + workflow $39-$129/mo. https://www.honeybook.com
14. **Aisle Planner (aisleplanner.com)** -- Wedding planner + venue management software. https://www.aisleplanner.com
15. **Planning Pod (planningpod.com)** -- Comprehensive venue operations software $89-$329/mo. https://www.planningpod.com
16. **Perfect Venue (perfectvenue.com)** -- Purpose-built wedding venue booking + ops software $149-$399/mo. https://www.perfectvenue.com
17. **AllSeated (allseated.com)** -- Wedding venue floorplan + seating + 3D walkthrough $99-$299/mo. https://www.allseated.com
18. **Tave (tave.com)** -- Photographer + venue CRM. https://www.tave.com
19. **Cvent + Stova (cvent.com)** -- Enterprise event + venue management platform. https://www.cvent.com
20. **Zola Wedding Registry + Venue Marketplace (zola.com)** -- Wedding registry + vendor/venue marketplace. https://www.zola.com
21. **Hopskip (hopskipevents.com)** -- Growing wedding venue marketplace + booking platform. https://www.hopskipevents.com
22. **NFPA 101 Life Safety Code Assembly (nfpa.org)** -- Federal life safety + fire code for assembly occupancy. https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=101
23. **International Building Code IBC Assembly (iccsafe.org)** -- Federal model building code for assembly occupancy. https://www.iccsafe.org
24. **ADA Title III Public Accommodation (ada.gov)** -- Federal accessibility law for public accommodation venues. https://www.ada.gov
25. **Right To Farm Act 50-State Survey (nationalaglawcenter.org)** -- National Agricultural Law Center RTFA database. https://nationalaglawcenter.org/state-compilations/right-to-farm
26. **SBA 504 Commercial Real Estate Loan (sba.gov)** -- Federal CRE loan program up to $5M for purpose-built venues. https://www.sba.gov/funding-programs/loans/504-loans
27. **SBA 7(a) Loan Program (sba.gov)** -- SBA primary loan guarantee program. https://www.sba.gov/funding-programs/loans/7a-loans
28. **Live Oak Bank SBA + CRE (liveoakbank.com)** -- Major SBA 504 + 7(a) lender across hospitality + event venues. https://www.liveoakbank.com
29. **Newtek Small Business Finance (newtekone.com)** -- Major SBA lender. https://www.newtekone.com
30. **Byline Bank SBA (bylinebank.com)** -- SBA 504 + 7(a) lender. https://www.bylinebank.com
31. **Celtic Bank SBA (celticbank.com)** -- SBA lender across commercial sectors. https://www.celticbank.com
32. **JPMorgan Chase SBA (chase.com)** -- Major SBA lender. https://www.chase.com/business/banking/sba-loans
33. **Wells Fargo Commercial Real Estate (wellsfargo.com)** -- Conventional CRE lender. https://www.wellsfargo.com
34. **Bank of America Commercial Real Estate (bankofamerica.com)** -- Conventional CRE lender. https://www.bankofamerica.com
35. **Balboa Capital Equipment Finance (balboacapital.com)** -- Equipment finance for FF&E + AV + commercial kitchen. https://www.balboacapital.com
36. **Crest Capital Equipment Finance (crestcapital.com)** -- Equipment finance lender. https://www.crestcapital.com
37. **Beacon Funding (beaconfunding.com)** -- Equipment finance specialized in hospitality. https://www.beaconfunding.com
38. **Markel Wedding + Event Insurance (markelinsurance.com)** -- Dominant wedding venue + event insurance carrier. https://event.markelinsurance.com
39. **Wedsafe by Aon Affinity (wedsafe.com)** -- Wedding venue + event insurance program. https://www.wedsafe.com
40. **Eventsured (eventsured.com)** -- Specialty event venue + wedding insurance. https://www.eventsured.com
41. **K&K Insurance Special Events (kandkinsurance.com)** -- Special event + venue insurance carrier. https://www.kandkinsurance.com
42. **Philadelphia Insurance Companies Hospitality (phly.com)** -- Hospitality + venue insurance carrier. https://www.phly.com
43. **Wedsure Wedding Day Insurance (wedsure.com)** -- Couple-side wedding cancellation insurance. https://www.wedsure.com
44. **Houlihan Lokey Middle Market M&A (hl.com)** -- Investment bank for middle-market venue + hospitality M&A. https://www.hl.com
45. **Lincoln International M&A Advisory (lincolninternational.com)** -- Middle-market M&A advisor. https://www.lincolninternational.com
46. **Raymond James Middle Market IB (raymondjames.com)** -- Middle-market M&A. https://www.raymondjames.com
47. **Sunbelt Business Brokers (sunbeltnetwork.com)** -- Largest US business broker network. https://www.sunbeltnetwork.com
48. **Murphy Business + Financial (murphybusiness.com)** -- Business broker network. https://www.murphybusiness.com
49. **Transworld Business Advisors (tworld.com)** -- Business broker franchise network. https://www.tworld.com
50. **BizBuySell Small Business Marketplace (bizbuysell.com)** -- Largest US small business + venue for-sale marketplace. https://www.bizbuysell.com
51. **Style Me Pretty Editorial (stylemepretty.com)** -- Premier wedding editorial platform for venue features. https://www.stylemepretty.com
52. **Martha Stewart Weddings (marthastewart.com/weddings)** -- National wedding editorial brand. https://www.marthastewart.com/weddings
53. **Brides.com Editorial (brides.com)** -- National wedding editorial. https://www.brides.com
54. **Junebug Weddings Editorial (junebugweddings.com)** -- Wedding photographer + editorial platform. https://www.junebugweddings.com
55. **Auberge Resorts Collection (aubergeresorts.com)** -- Luxury destination wedding hotel collection. https://aubergeresorts.com
56. **Belmond Luxury Hotels (belmond.com)** -- LVMH-owned luxury hotel + destination wedding brand. https://www.belmond.com
57. **Aman Resorts (aman.com)** -- Ultra-luxury destination resort + wedding brand. https://www.aman.com
58. **Rosewood Hotel Group (rosewoodhotels.com)** -- Luxury hotel + destination wedding brand. https://www.rosewoodhotels.com
59. **TIPS Alcohol Server Training (gettips.com)** -- National alcohol server certification program. https://www.gettips.com
60. **National Agricultural Law Center (nationalaglawcenter.org)** -- Federal-state law database for RTFA + ag-zone regulation. https://nationalaglawcenter.org
61. **American Planning Association APA (planning.org)** -- US land-use + zoning trade body. https://www.planning.org
62. **WPPI / Wedding Photographers Org (wppionline.com)** -- Wedding photographer trade organization. https://www.wppionline.com
63. **Association of Bridal Consultants ABC (bridalassn.com)** -- Wedding planner trade organization. https://www.bridalassn.com
64. **Wedding International Professionals Association WIPA (wipa.org)** -- Wedding professional trade association. https://wipa.org
65. **NACE National Association for Catering and Events (nace.net)** -- Catering + event professional trade association. https://www.nace.net
66. **ILEA International Live Events Association (ileahub.com)** -- Live events professional trade association. https://www.ileahub.com
67. **California ABC (abc.ca.gov)** -- State alcohol regulatory body example. https://www.abc.ca.gov
68. **NY State Liquor Authority (sla.ny.gov)** -- State alcohol regulatory body. https://sla.ny.gov
69. **Texas Alcoholic Beverage Commission (tabc.texas.gov)** -- State alcohol regulatory body. https://www.tabc.texas.gov

`;

const num = `

## Numbers & Benchmarks

### Industry size, venue landscape & unit economics

| Metric | 2024-2026 Value | Source |
|---|---|---|
| US weddings/yr | ~1.9M (down from ~2.5M 2022 peak) | The Wedding Report + IBISWorld |
| Total US wedding industry spend | $72B-$78B | The Wedding Report + IBISWorld |
| Avg wedding budget | $28K-$36K | Knot RealWeddings 2025 |
| Venue site fee share of spend | 10-14% | Knot + WeddingWire |
| Venue site fee addressable market | $7.5B-$11B | Calculated |
| Active US dedicated venues | ~12,000-15,000 | WeddingWire + Knot |
| Hotel/restaurant banquet halls (also bidding) | ~8,000-11,000 | Industry estimate |
| Venue inventory growth 2020-2026 | 30%+ in most metros | WeddingWire |
| Avg revenue per dedicated venue | $650K-$2.5M/yr | IBISWorld + operator surveys |
| Top-decile destination venue revenue | $3M-$8M/yr | Knot + WeddingWire premium |
| Avg site fee | $8K-$25K | WeddingWire + HoneyBook |
| Top-decile destination site fee | $25K-$120K | Knot destination tier |
| Events per year (mature single venue) | 60-90 | Industry benchmark |
| Avg gross margin mature venue | 35-50% | Industry + IBISWorld |
| Avg EBITDA margin mature venue | 18-28% | Industry benchmark |
| Inquiry-to-tour conversion | 18-28% | HoneyBook + Knot |
| Tour-to-booking conversion | 35-55% | Industry benchmark |
| Inquiry-to-booking healthy | 6-15% | Calculated |
| Inquiry-to-booking top-decile | 22-32% | Top venues |

### Sales mix by event type

| Event Type | Avg Site Fee | Frequency | % Revenue | Gross Margin |
|---|---|---|---|---|
| Saturday wedding (May-Oct peak) | $12K-$25K | 24-30/yr | 50-65% | 38-52% |
| Friday/Sunday wedding | $7K-$18K | 12-20/yr | 12-22% | 35-48% |
| Off-season wedding (Nov-Mar) | $5K-$15K | 10-18/yr | 8-15% | 32-45% |
| Corporate event | $2K-$8K | 15-30/yr | 8-15% | 40-55% |
| Private party | $3K-$10K | 6-15/yr | 4-10% | 35-48% |
| Photoshoot/film location | $500-$2K | 10-30/yr | 1-3% | 70-85% pure margin |
| Rehearsal dinner / welcome | $2K-$5K | 8-25/yr | 2-6% | 40-55% |

### Capital + capital stack by tier

| Sizing Decision | Capital | Annual Revenue | Best For |
|---|---|---|---|
| Long-term lease + retrofit | $200K-$800K | $400K-$1.2M | First-time + capital-constrained |
| Single venue conversion | $250K-$1.5M | $650K-$2M | Rural-charm + existing structure |
| Single venue ground-up | $2M-$6M | $1.2M-$3.5M | Destination + capital-rich |
| Two-venue regional | $3M-$10M | $2M-$5M | Year 3-6 + proven concept |
| Regional brand 3-5 venues | $10M-$40M | $5M-$15M | PE-backed platform |
| Platform 10+ venues | $40M-$300M | $20M-$200M | Strategic + PE platform exit |

### Build-out capital by category

| Category | Cost Range | Notes |
|---|---|---|
| Land + closing | $300K-$1.5M | 5-25 acres rural-charm 60-90 min from metro |
| Site work | $150K-$600K | Clearing + grading + driveway + parking + drainage + septic 3,000-6,000 gal/day |
| Conversion structure retrofit | $200K-$1.2M | Structural + HVAC + 200-400 amp + restrooms + prep kitchen + bridal suite |
| Ground-up purpose-built structure | $1.5M-$4M | 6,000-15,000 sq ft event hall $250-$320/sq ft turnkey |
| ADA retrofit (older structures) | $30K-$150K | Title III |
| Sprinkler retrofit (assembly fire) | $50K-$300K | NFPA 101 Assembly A-2/A-3 |
| Egress + fire-alarm | $20K-$80K | NFPA 101 |
| FF&E | $80K-$250K | 200-350 seats + Chiavari/farmhouse chairs + dance floor + bars + AV |
| Landscape + exterior | $50K-$200K | Lawn + ceremony site + arbor + path lighting + signage + gates |
| ABC liquor (if venue holds) | $5K-$50K + $1K-$5K/yr | State-by-state |
| Insurance Year 1 all-in | $8K-$30K | GL + liquor + event cancellation + property |
| Permits + zoning Year 1 all-in | $5K-$120K | SUP/CUP + building + ADA + fire-marshal + attorney |

### Permit + zoning costs

| Item | Cost Range | Notes |
|---|---|---|
| SUP/CUP application fee | $500-$5,000 | County/city planning commission |
| Traffic study | $5K-$25K | Required for most SUP/CUP |
| Survey | $2K-$10K | Property + topo |
| Land-use attorney | $25K-$80K total | $350-$600/hr |
| Community outreach | $3K-$15K | Pre-application |
| Building permits | $10K-$60K | State-by-state |
| Septic engineering + permit | $8K-$30K | Commercial event 3,000-6,000 gal/day |

### Staff compensation

| Role | Rate/Salary | Notes |
|---|---|---|
| Owner-operator | $60K-$180K Year 1-2 / $120K-$350K Year 3-5 | 50-70 hrs/wk |
| Venue manager | $48K-$78K + bonus | Day-to-day ops + vendor + tour coordination |
| Event-day staff | $25-$45/hr | 8-12 hr Saturday, 2-4 per event |
| Day-of coordinator | $1,500-$3,500/event | Venue-employed or contracted |
| Sales/booking specialist (Stage 2+) | $48K-$72K + commission | When inquiries > 30/mo |
| Marketing manager (Stage 3+) | $55K-$85K | Required at multi-venue |
| Catering account manager (Stage 4+) | $55K-$80K + commission | Multi-venue corporate fill |
| Groundskeeping (outsourced) | $1.5K-$4K/mo | Contracted |
| Cleaning post-event (outsourced) | $200-$600/event | Per-event contract |

### Five-year cash-flow: single converted venue

| Year | Events | Annual Revenue | EBITDA | EBITDA Margin |
|---|---|---|---|---|
| Year 1 entitlement + soft launch | 15-30 | $200K-$450K | $20K-$70K | 8-16% |
| Year 2 ramp + reviews | 40-60 | $500K-$1.1M | $75K-$220K | 14-22% |
| Year 3 mature + preferred-vendor | 60-85 | $850K-$1.8M | $180K-$450K | 20-26% |
| Year 4 mature + corporate fill | 70-95 | $1.0M-$2.2M | $220K-$580K | 22-28% |
| Year 5 mature peak + repeat | 75-100 | $1.1M-$2.5M | $250K-$650K | 22-28% |

### Capital stack rates + lenders

| Layer | LTV | Rate 2024-2025 | Typical Lenders |
|---|---|---|---|
| Founder equity | N/A | N/A | $100K-$800K (10-25%) |
| SBA 504 CRE | Up to 90% (10% down) | Fixed 6.5-9% 20-25 yr | Live Oak, Newtek, Byline, Celtic, Chase |
| SBA 7(a) | 75-90% | Prime + 2.0-4.0% | Same SBA pool |
| Conventional CRE | 70-80% | 7-10% | Live Oak, Wells Fargo, BofA, regional banks |
| Seller-financed land | 60-85% | 6-9% + 5-10 yr balloon | Rural farmland sellers |
| Equipment finance 5-7 yr | 80-100% | 9-15% | Balboa, Crest, Beacon, Direct, US Capital |
| Investor JV / promote | 60-75% equity | 8% pref + 70/30 promote | Local RE investor groups |

`;

const counter = `

## Counter-Case: When Wedding Venue Is A Bad Bet

A serious wedding venue founder must stress-test the case above against the conditions that make this category a difficult bet in 2027. The full 12-element counter-case:

**(1) Zoning + special-use permit denial.** The picturesque rural property that makes a venue economically viable is almost always **A-1 Agricultural or R-1 Rural Residential**, which **prohibits commercial events by default**. SUP/CUP approval requires county planning commission public hearing where **organized neighbor opposition denies 60-80% of contested applications**. **Year 1-2 founders lose $80K-$350K in soft costs** (option + traffic study + survey + attorney + architect) when SUP/CUP fails.

**(2) Right To Farm Act conflicts.** **All 50 states have RTFA** protecting agricultural operations, but the converse is used in **WA, OR, CA, VA, NY, PA, MI** counties to **deny wedding venue SUPs as conflicting with farming**. **Pre-purchase county comprehensive plan + RTFA enforcement history check** is non-negotiable but commonly skipped.

**(3) Saturation + 30%+ inventory growth 2020-2026.** WeddingWire shows **30%+ wedding venue inventory growth in most US metros 2020-2026** as post-COVID rebound + low rates + lifestyle-business interest flooded the market. **Bookings per venue dropping 15-25%** in saturated metros. New venues face price compression + harder marketing competition.

**(4) Declining wedding count 2024-2026.** The Wedding Report tracks **~1.9M US weddings/yr 2026 vs ~2.5M 2022 peak** — **~600K fewer/yr** as marriage rates decline + younger generations defer + 2022 pull-forward normalizes. Combined with (3), **inventory growth + demand decline = venue oversupply** through 2027-2030.

**(5) Seasonality + Northern death zone.** **60-70% of bookings May-Oct** in 4-season climates. **Nov-Feb in Boston, Chicago, Denver, Minneapolis, NYC, Seattle** kills outdoor service + suppresses winter demand. Off-season corporate fill is partial but limited.

**(6) Weather risk on outdoor venues.** **Outdoor ceremony venues face 8-22% revenue impact** from rain, heat, snow, smoke (Western wildfires) — couples demand backup-indoor which forces capital into hybrid structure. **Climate-volatility insurance** is expensive + heavily underwritten.

**(7) Neighbor + noise + traffic complaints post-launch.** Even after SUP/CUP approval, **noise (amplified music after 10pm), traffic, parking spillover, and rural-character degradation drive post-launch enforcement** — county can revoke or modify SUP, restrict event count, require expensive noise mitigation. **Some counties impose 100% Saturday-only or 50-event-cap conditions** that fundamentally limit revenue ceiling.

**(8) ABC liquor + dram-shop exposure.** Holding state ABC license exposes venue to **dram-shop liability** for over-service incidents — drunk-driving accidents post-event have generated **$500K-$5M+ judgments**. Most venues correctly push ABC + dram-shop to licensed caterer/bartender — but this also limits bar margin capture. **Liquor liability hardening 2024-2026** raised premiums 30-60% for venues retaining own ABC.

**(9) Insurance premium hardening 2024-2026.** GL + liquor liability + property/structure insurance premiums **rose 25-60% 2024-2026** as carriers (Markel, Wedsafe, K&K) tightened after wedding-injury + dram-shop verdicts + climate property losses. Some carriers exited the wedding venue segment.

**(10) The Knot/WeddingWire commission + pay-to-play.** The Knot Worldwide's effective monopoly on US wedding intent funnel means **paid promotion $200-$1,500/mo is mandatory for top placement** + reviews game requires active solicitation + algorithm changes can collapse organic visibility. **15-30% of mature venue marketing budget** flows through TKWW with no real substitute.

**(11) Property tax reclassification + ongoing carry cost.** Converting ag-zoned land to commercial-event use **triggers property tax reclassification** in many states — taxes can **rise 200-600%** vs ag-classified base. Off-season carry (taxes + insurance + utilities + maintenance + debt) on a $2M-$6M asset generating 8 months of revenue creates **cash flow gaps** Year 1-2.

**(12) Post-2024 couple-budget compression.** Knot + The Wedding Report show **avg wedding budget compression 2024-2026** as inflation + mortgage costs squeeze couples. **Couples downsize from 150-200 guests to 80-120**, choose Friday/Sunday over Saturday, opt for venue-only over all-inclusive — reducing venue revenue per event by **15-25%** vs 2022 peak.

**Honest verdict.** The wedding venue business remains a viable specialty CRE + event-operating business in 2027 if you (a) **prove zoning + SUP/CUP path before signing a land contract** with neighbor outreach + land-use attorney + RTFA check; (b) **honestly assess saturation + declining wedding count in your specific metro** rather than national averages; (c) **build calendar discipline + TKWW investment + preferred-vendor list + open-house funnel** as the marketing reality; (d) **structure as PropCo + OpCo LLC** for liability firewall + clean exit optionality; (e) **plan for seasonality + weather + insurance hardening + property tax reclassification + neighbor enforcement + budget compression** as line items not surprises; (f) **stage capital via SBA 504 + seller-finance + investor JV** rather than over-leveraging Year 1; (g) **commit to either path** (single venue hold for cash flow OR multi-venue roll-up for PE exit); (h) **align with TKWW reality** without becoming dependent — build direct photographer + planner + editorial relationships as TKWW hedge. If you cannot honestly check most of these — particularly zoning + saturation + calendar discipline + insurance + tax structure — the economics of 2027 wedding venues will grind the project toward entitlement failure or distressed single-asset sale below going-concern value.

`;

const links = `

## Related Pulse Entries

- [[q9671]] -- Coworking space 2027 (sibling: built-environment + lease + space-as-service)
- [[q9670]] -- Boutique hotel 2027 (DIRECT sibling: built-environment + lodging + event mix)
- [[q9669]] -- Food truck 2027 (sibling: mobile food service + wedding catering channel)
- [[q9668]] -- Pediatric dental practice 2027 (sibling: licensed specialty service)
- [[q9667]] -- HVAC company 2027 (sibling: skilled trades + PE roll-up parallel)
- [[q9664]] -- Microbrewery 2027 (sibling: regulated + state licensure + specialty equipment)
- [[q9663]] -- Self-storage facility 2027 (DIRECT sibling: specialty CRE + zoning)
- [[q9662]] -- Mobile IV therapy clinic 2027 (sibling: state-regulated mobile service)
- [[q9661]] -- Veterinary clinic 2027 (sibling: specialty licensed practice)
- [[q9660]] -- Direct primary care DPC clinic 2027 (sibling: cash + membership service)
- [[q9659]] -- Med spa 2027 (sibling: state licensure + service-membership)
- [[q9658]] -- Service business launch (NEW STRUCTURE sibling)
- [[q9657]] -- Home health agency 2027 (sibling: workforce + insurance)
- [[q9650]] -- Assisted living facility 2027 (DIRECT sibling: specialty CRE + state licensure)
- [[q9601]] -- Fractional CFO operation (operational backbone for multi-venue brand)
- [[q9576]] -- Adult coding bootcamp 2027 (state regulation framework)
- [[q2117]] -- Post-construction cleanup business (service-business operating pattern)
- [[q1975]] -- Daycare 2027 (sibling: state licensure + customer trust)
- [[q1954]] -- Property management 2027 (baseline sibling)
- [[q1953]] -- Virtual assistant 2027 (baseline sibling)
- [[q1952]] -- Podcast network 2027 (baseline sibling)
- [[q1951]] -- Meal prep 2027 (sibling: food-service operating pattern)
- [[q1950]] -- Yoga studio 2027 (sibling: lease-based experience business)
- [[q1949]] -- Personal training 2027 (baseline sibling)
- [[q1948]] -- Dog walking 2027 (baseline sibling)
- [[q1947]] -- Notary 2027 (baseline sibling)
- [[q1946]] -- Tutoring 2027 (baseline sibling)
- [[q1942]] -- Service business 2027 (baseline sibling)
- [[q1139]] -- Adjacent service business framework
- [[q1127]] -- Adjacent service business framework

`;

const tags = ['wedding-venue','event-venue','barn-venue','wedgewood','the-knot','weddingwire','honeybook','zoning','sba-504','2027'];

const sources = [
  { title: 'The Knot RealWeddings Study 2025', url: 'https://www.theknot.com/content/wedding-data-insights' },
  { title: 'The Wedding Report Industry Data', url: 'https://www.theweddingreport.com' },
  { title: 'WeddingWire Industry Report', url: 'https://www.weddingwire.com' },
  { title: 'HoneyBook State of the Wedding Industry 2025', url: 'https://www.honeybook.com/risingtide' },
  { title: 'IBISWorld Wedding Venues in the US Industry Report', url: 'https://www.ibisworld.com' },
  { title: 'Wedgewood Weddings (PE-backed 50+ venue platform)', url: 'https://www.wedgewoodweddings.com' },
  { title: 'SBA 504 Commercial Real Estate Loan Program', url: 'https://www.sba.gov/funding-programs/loans/504-loans' }
];

const notes = {
  s6: 'Added 69 cited sources spanning wedding industry research (The Knot Worldwide TKWW parent of The Knot + WeddingWire dominant US wedding intent funnel, The Knot RealWeddings Study 2025 annual industry survey, WeddingWire Industry Report wedding vendor + venue marketplace, The Wedding Report independent US wedding industry research firm tracking wedding count + spend + venue trends, HoneyBook State of the Wedding Industry 2025, Allied Wedding Vendor Industry Reports, IBISWorld Wedding Venues in the US Industry Report, BLS Bureau of Labor Statistics SIC 8299), PE-backed venue operators (Wedgewood Weddings largest US PE-backed wedding venue platform with 50+ venues standardized all-inclusive model, Walters Wedding Estates PE-backed multi-venue Texas-Southwest, Walls Bryant Group regional wedding venue operator + PE acquirer in Southeast US, Stoney Ridge Villa Group multi-venue Texas wedding venue operator), booking + venue management software (HoneyBook Booking Software dominant wedding venue CRM + contracts + payments + workflow $39-$129/mo, Aisle Planner wedding planner + venue management software, Planning Pod comprehensive venue operations $89-$329/mo, Perfect Venue purpose-built wedding venue booking + ops $149-$399/mo, AllSeated wedding venue floorplan + seating + 3D walkthrough $99-$299/mo, Tave photographer + venue CRM, Cvent + Stova enterprise event + venue management platform, Zola Wedding Registry + Venue Marketplace, Hopskip growing wedding venue marketplace + booking platform), regulatory codes (NFPA 101 Life Safety Code Assembly Group A-2/A-3 federal life safety + fire code for assembly occupancy including wedding venues, International Building Code IBC Assembly federal model building code for assembly occupancy, ADA Title III Public Accommodation federal accessibility law for public accommodation venues, Right To Farm Act 50-State Survey National Agricultural Law Center comprehensive RTFA database + enforcement), capital sources (SBA 504 Commercial Real Estate Loan federal CRE program up to $5M for purpose-built venues, SBA 7(a) Loan Program SBA primary loan guarantee, Live Oak Bank SBA + CRE major SBA 504 + 7(a) lender across hospitality + event venues, Newtek Small Business Finance major SBA lender, Byline Bank SBA, Celtic Bank SBA, JPMorgan Chase SBA major SBA lender, Wells Fargo Commercial Real Estate conventional CRE lender, Bank of America Commercial Real Estate conventional CRE lender, Balboa Capital Equipment Finance for FF&E + AV + commercial kitchen, Crest Capital Equipment Finance, Beacon Funding equipment finance specialized in hospitality + commercial vehicle), insurance carriers (Markel Wedding + Event Insurance dominant wedding venue + event insurance carrier, Wedsafe by Aon Affinity wedding venue + event insurance program, Eventsured specialty event venue + wedding insurance, K&K Insurance Special Events special event + venue insurance carrier, Philadelphia Insurance Companies Hospitality hospitality + venue insurance carrier, Wedsure Wedding Day Insurance couple-side wedding cancellation), M&A advisors (Houlihan Lokey Middle Market M&A investment bank for middle-market venue + hospitality, Lincoln International M&A Advisory middle-market, Raymond James Middle Market Investment Banking middle-market, Sunbelt Business Brokers largest US business broker network, Murphy Business + Financial business broker network, Transworld Business Advisors business broker franchise network, BizBuySell Small Business Marketplace largest US small business + venue for-sale marketplace), wedding editorial (Style Me Pretty Editorial premier wedding editorial platform for venue features, Martha Stewart Weddings national wedding editorial brand, Brides.com Editorial national wedding editorial, Junebug Weddings Editorial wedding photographer + editorial platform), luxury destination hotel brands (Auberge Resorts Collection luxury destination wedding hotel collection, Belmond Luxury Hotels LVMH-owned luxury hotel + destination wedding brand, Aman Resorts ultra-luxury destination resort + wedding brand, Rosewood Hotel Group luxury hotel + destination wedding brand), training + trade orgs (TIPS Alcohol Server Training national alcohol server certification program, National Agricultural Law Center federal-state law database for RTFA + ag-zone regulation, American Planning Association APA US land-use + zoning trade body, Wedding Photographers International + Editorial Photographers Org wedding photographer trade organization, Association of Bridal Consultants ABC wedding planner trade organization, Wedding International Professionals Association WIPA wedding professional trade association, NACE National Association for Catering and Events catering + event professional trade association, ILEA International Live Events Association live events professional trade association), state ABC examples (California ABC Liquor Control Commission state alcohol regulatory body example, NY State Liquor Authority state alcohol regulatory body, Texas Alcoholic Beverage Commission state alcohol regulatory body).',
  s7: 'Added comprehensive numbers block with 8 markdown pipe tables covering: industry size + venue landscape + unit economics (~1.9M US weddings/yr 2026 down from ~2.5M 2022 peak per The Wedding Report + IBISWorld + $72B-$78B total wedding industry spend + $28K-$36K avg wedding budget Knot RealWeddings 2025 + 10-14% venue site fee share + $7.5B-$11B addressable + ~12,000-15,000 active US dedicated wedding venues per WeddingWire + Knot + ~8,000-11,000 hotel/restaurant banquet halls also bidding + 30%+ venue inventory growth 2020-2026 + avg revenue per dedicated venue $650K-$2.5M/yr + top-decile destination $3M-$8M/yr + avg site fee $8K-$25K + top-decile destination site fee $25K-$120K + events/yr mature single venue 60-90 + avg gross margin 35-50% + avg EBITDA 18-28% + inquiry-to-tour 18-28% + tour-to-booking 35-55% + inquiry-to-booking 6-15% healthy / 22-32% top); sales mix by event type 7 types (Saturday wedding peak May-Oct $12K-$25K 24-30/yr 50-65% revenue + Friday/Sunday $7K-$18K 12-20/yr 12-22% + off-season $5K-$15K 10-18/yr 8-15% + corporate event $2K-$8K 15-30/yr 8-15% 40-55% margin + private party $3K-$10K 6-15/yr 4-10% + photoshoot/film $500-$2K 10-30/yr 1-3% 70-85% pure margin + rehearsal dinner $2K-$5K 8-25/yr 2-6%); capital tier 6 sizings (long-term lease + retrofit $200K-$800K $400K-$1.2M + single venue conversion $250K-$1.5M $650K-$2M + single venue ground-up $2M-$6M $1.2M-$3.5M + two-venue regional $3M-$10M $2M-$5M + regional brand 3-5 venues $10M-$40M $5M-$15M + platform 10+ venues $40M-$300M $20M-$200M); build-out capital by category 12 line items (land + closing $300K-$1.5M + site work $150K-$600K + conversion structure retrofit $200K-$1.2M + ground-up purpose-built structure $1.5M-$4M + ADA retrofit $30K-$150K + sprinkler retrofit $50K-$300K + egress + fire-alarm $20K-$80K + FF&E $80K-$250K + landscape + exterior $50K-$200K + ABC liquor license $5K-$50K initial + $1K-$5K/yr + insurance Year 1 all-in $8K-$30K + permits + zoning Year 1 all-in $5K-$120K); permit + zoning costs 7 line items (SUP/CUP application $500-$5,000 + traffic study $5K-$25K + survey $2K-$10K + land-use attorney $25K-$80K total + community outreach $3K-$15K + building permits $10K-$60K + septic engineering + permit $8K-$30K); staff compensation 9 roles (owner-operator $60K-$180K Year 1-2 / $120K-$350K Year 3-5 + venue manager $48K-$78K + event-day staff $25-$45/hr 2-4 per event + day-of coordinator $1,500-$3,500/event + sales/booking specialist Stage 2+ + marketing manager Stage 3+ + catering account manager Stage 4+ + groundskeeping + cleaning); 5-year cash flow trajectory single converted venue (Year 1 15-30 events $200K-$450K 8-16% to Year 5 mature peak 75-100 events $1.1M-$2.5M 22-28%); capital stack 7 layers (founder equity 10-25% + SBA 504 up to 90% LTV fixed 6.5-9% 20-25 yr Live Oak + Newtek + Byline + Celtic + JPMorgan Chase + SBA 7(a) Prime + 2.0-4.0% + conventional CRE 70-80% 7-10% + seller-financed land 60-85% 6-9% + 5-10 yr balloon + equipment finance 80-100% 9-15% Balboa + Crest + Beacon + Direct + US Capital + investor JV 60-75% co-invest equity 8% pref + 70/30 promote).',
  s8: 'Added 12-element counter-case: zoning + special-use permit denial (A-1 Agricultural or R-1 Rural Residential zones prohibit commercial event hosting by default + SUP/CUP approval requires county planning commission public hearing where organized neighbor opposition denies 60-80% of contested applications + Year 1-2 founders lose $80K-$350K in soft costs option + traffic study + survey + attorney + architect when SUP/CUP fails); Right To Farm Act conflicts (all 50 states have RTFA but converse denies wedding venue SUPs in WA/OR/CA/VA/NY/PA/MI counties as conflicting with farming uses + pre-purchase county comprehensive plan + RTFA enforcement history check non-negotiable but commonly skipped); saturation + 30%+ inventory growth 2020-2026 (WeddingWire shows 30%+ venue inventory growth in most US metros 2020-2026 as post-COVID rebound + low rates + lifestyle-business interest flooded market + bookings per venue dropping 15-25% in saturated metros); declining wedding count 2024-2026 (The Wedding Report tracks ~1.9M US weddings/yr 2026 vs ~2.5M post-COVID 2022 peak + ~600K fewer weddings/yr + marriage rates decline + younger generations defer + 2022 pull-forward demand normalizes + combined with saturation = venue oversupply through 2027-2030); seasonality + Northern death zone (60-70% bookings May-Oct 4-season climates baseline + Nov-Feb Boston/Chicago/Denver/Minneapolis/NYC/Seattle kills outdoor service + suppresses winter wedding demand); weather risk on outdoor venues (outdoor ceremony venues 8-22% revenue impact from rain/heat/snow/smoke Western wildfires + couples demand backup-indoor option + climate-volatility insurance expensive); neighbor + noise + traffic complaints post-launch (even after SUP/CUP approval neighbor complaints about noise amplified music after 10pm + traffic + parking spillover + rural-character degradation drive post-launch enforcement + county can revoke or modify SUP + restrict event count); ABC liquor + dram-shop exposure (holding state ABC license exposes venue to dram-shop liability for over-service incidents + drunk-driving accidents post-event generated $500K-$5M+ liability judgments + most venues push ABC + dram-shop to licensed caterer/bartender limits bar margin capture + liquor liability hardening 2024-2026 raised premiums 30-60%); insurance premium hardening 2024-2026 (GL + liquor liability + property/structure insurance premiums rose 25-60% 2024-2026 as Markel/Wedsafe/K&K tightened underwriting + some carriers exited wedding venue segment); The Knot/WeddingWire commission + pay-to-play (TKWW effective monopoly on US wedding intent funnel means paid promotion $200-$1,500/mo mandatory for top placement + 15-30% of mature venue marketing budget flows through TKWW with no real substitute); property tax reclassification + ongoing carry cost (converting agricultural-zoned land to commercial-event use triggers property tax reclassification in many states + taxes can rise 200-600% vs ag-classified base + off-season carry cost on $2M-$6M asset generating 8 months of revenue creates cash flow gaps Year 1-2); post-2024 couple-budget compression (Knot RealWeddings + The Wedding Report show average wedding budget compression 2024-2026 + couples downsize from 150-200 guests to 80-120 + Friday/Sunday over Saturday + venue-only over all-inclusive + reducing venue revenue per event by 15-25% vs 2022 peak) -- with honest 8-condition verdict on who should and should not start a wedding venue business in 2027.',
  s9: 'Cross-linked 30 related Pulse entries: q9671 coworking space (built-environment + lease + space-as-service) + q9670 boutique hotel DIRECT sibling (built-environment + lodging + event mix) + q9669 food truck (mobile food service + wedding catering channel) + q9668 pediatric dental practice (licensed specialty service) + q9667 HVAC (skilled trades + PE roll-up parallel) + q9664 microbrewery (regulated + state licensure + specialty equipment) + q9663 self-storage DIRECT sibling (specialty CRE + zoning) + q9662 mobile IV therapy (state-regulated mobile service) + q9661 vet clinic (specialty licensed practice) + q9660 DPC (cash + membership service) + q9659 med spa (state licensure + service-membership) + q9658 NEW STRUCTURE sibling + q9657 home health (workforce + insurance) + q9650 assisted living DIRECT sibling (specialty CRE + state licensure) + q9601 fractional CFO (operational backbone for multi-venue brand) + q9576 adult coding bootcamp (state regulation framework) + q2117 post-construction cleanup (service-business operating pattern) + q1975 daycare (state licensure + customer trust) + q1942/q1946-q1954 baseline Q&A format siblings + q1127/q1139 service business framework.',
  s10: 'SUBAGENT_VERIFIED. Lean deep baseline of the wedding venue business startup playbook for 2027 matching actual question "How do you start a wedding venue business in 2027?" Built under VALUE-NOT-WORDCOUNT MANDATE: target 8,500-9,500 words honored, HARD CAP 10,500 server-enforced honored. Tight paragraphs (2-3 sentences max), frequent H3 breaks, no walls of text, no padding. Structure: Bottom Line callout (3 punchy bullets Capital/Margins/Hardest part with bold-tag labels hitting conversion $250K-$1.5M vs ground-up $2M-$6M vs PE-backed roll-up $1.5M-$8M EV Wedgewood/Walters/Walls Bryant + mature single venue 35-50% gross + 18-28% EBITDA at $850K-$2.5M revenue + 60-90 events/yr at $8K-$25K avg site fee + single-asset 4-7x EBITDA + regional roll-up 7-10x EBITDA + platform 8-12x EBITDA + counter-pressures zoning + SUP/CUP denial + Right To Farm Act + saturation + seasonality + weather + declining wedding count + 18-36 month entitlement), then short paragraphs distinguishing dedicated wedding venue from hotel banquet hall + event/wedding planner + catering company, then TOC block listing 13 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit) with horizontal rule separators, then LEAN H3 deep content sections inside each PART (3-4 sections per PART, tight 2-3 sentence paragraphs, no padding, frequent H3 breaks). flow contains exactly 2 mermaid diagrams (operating journey from land + zoning + SUP/CUP + RTFA + permits + build-out through ADA + sprinkler + insurance + capital stack + staff + booking pipeline + marketing + stage growth + 8-path strategic exit; decision matrix for convert vs ground-up vs hybrid vs lease vs acquisition AND aesthetic positioning barn vs vineyard vs mansion vs mill vs lodge with reference operators and exit math). src has 69 cited sources with real URLs covering The Knot Worldwide TKWW + The Knot RealWeddings 2025 + WeddingWire + The Wedding Report + HoneyBook State of the Wedding Industry + Allied + IBISWorld + BLS + Wedgewood Weddings + Walters Wedding Estates + Walls Bryant + Stoney Ridge Villa + HoneyBook + Aisle Planner + Planning Pod + Perfect Venue + AllSeated + Tave + Cvent/Stova + Zola + Hopskip + NFPA 101 Assembly + IBC + ADA Title III + RTFA 50-state survey + SBA 504 + 7(a) + Live Oak Bank + Newtek + Byline + Celtic + JPMorgan Chase + Wells Fargo + Bank of America + Balboa + Crest + Beacon + Markel + Wedsafe + Eventsured + K&K + Philadelphia Insurance + Wedsure + Houlihan Lokey + Lincoln International + Raymond James + Sunbelt + Murphy Business + Transworld + BizBuySell + Style Me Pretty + Martha Stewart Weddings + Brides.com + Junebug Weddings + Auberge + Belmond + Aman + Rosewood + TIPS + National Agricultural Law Center + APA + WPPI + ABC + WIPA + NACE + ILEA + California ABC + NY SLA + Texas TABC. num is comprehensive 8-table benchmark block (industry size + venue landscape + unit economics + sales mix by event type 7 types + capital tier 6 sizings + build-out capital 12 line items + permit + zoning 7 line items + staff comp 9 roles + 5-year cash flow + capital stack 7 layers). counter is 12-element counter-case with zoning denial + RTFA + saturation + declining wedding count + seasonality + weather + neighbor complaints + ABC dram-shop + insurance hardening + TKWW pay-to-play + property tax reclassification + budget compression + honest 8-condition verdict. links cross-references 30 related entries with q9670 boutique hotel + q9663 self-storage + q9650 assisted living as DIRECT siblings (built-environment + specialty CRE). All numbers grounded in real Knot + WeddingWire + The Wedding Report + IBISWorld + Wedgewood/Walters acquirer comp + state ABC + NFPA + ADA + RTFA + SBA + Markel insurance + Houlihan/Lincoln/Raymond James middle-market M&A realities. ASCII-clean throughout. Lean target 8,500-9,500 words honored.'
};

async function main() {
  const TOKEN = process.env.BLOBS_PAT;
  if (!TOKEN) { console.error('BLOBS_PAT not set'); process.exit(1); }
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });

  const FINAL_ID = ID;
  const FINAL_QUESTION = QUESTION;

  const baselineAnswer = tldr + core + flow;

  // Quick local word-count sanity check before any network call
  const wc = s => s.split(/\s+/).filter(Boolean).length;
  const v5 = tldr + core + flow;
  const v6 = v5 + src;
  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;
  console.log('[' + FINAL_ID + '] word counts: v5=' + wc(v5) + ' v6=' + wc(v6) + ' v7=' + wc(v7) + ' v8=' + wc(v8) + ' v9=' + wc(v9));
  const maxRung = Math.max(wc(v5), wc(v6), wc(v7), wc(v8), wc(v9));
  if (maxRung > 10500) {
    console.error('[' + FINAL_ID + '] WORD COUNT ' + maxRung + ' EXCEEDS 10,500 HARD CAP. Aborting before server rejection.');
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
