// q9664 -- How do you start a microbrewery (craft brewery) business in 2027?
// Small production brewery with taproom -- distinct from brewpub-only, contract brewing, gypsy brewing
// NEW MANDATE: VALUE over WORD COUNT. Target 8,000-10,500 words. Tight paragraphs.
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

const ID = 'q9664';
const QUESTION = 'How do you start a microbrewery (craft brewery) business in 2027?';

const core = `

> ### 🎯 Bottom Line
> - **[Capital]** **$650K-$1.8M** nano/small 3-7 bbl brewhouse + small taproom (1,500-3,000 sqft leased space at $18-$32/sqft TI + 3-7 bbl brewhouse $150K-$280K + 4-8 fermenters at $12K-$28K each + 1-2 bright tanks + glycol + grain mill + walk-in cooler + minimal canning/kegging + small taproom build-out + TTB Brewer's Notice + state ABC license + working capital); **$1.2M-$3.5M** typical 7-15 bbl production brewery + taproom (5,000-9,000 sqft at $150-$220/sqft build-out + 7-15 bbl brewhouse $250K-$650K + 6-10 fermentation tanks $18K-$45K each + 2-4 bright tanks + glycol chiller + grain handling + mash tun/kettle/whirlpool/lauter tun + QC lab + small canning line $200K-$500K + 2,000-4,000 sqft taproom + branding + licensing); **$3.5M-$9M+** mid-size 15-30 bbl regional brewery + destination taproom (10,000-18,000 sqft at $180-$300/sqft + 15-30 bbl brewhouse $600K-$1.4M + 8-14 fermentation tanks + Wild Goose/Cask/Codi/Pneumatic Scale canning line $300K-$900K + full QC lab + 3,000-6,000 sqft taproom + outdoor beer garden + distribution capability + brand investment). Expect **12-24 months from lease to first pour** and **18-36 months to taproom-led profitability** at 60-75% taproom revenue mix.
> - **[Margins]** Mature taproom-heavy craft brewery: **65-78% gross margin on taproom pints** + **35-45% on self-distribution kegs** + **25-35% on distributor accounts** -- targeting **8-14% EBITDA** at $1.5M-$4M annual revenue per Brewers Association (BA) + Ekos + Beer30 (5th Ingredient) operator benchmarks. Average revenue per barrel **$1,200-$1,800 taproom-heavy mix** vs **$400-$700/bbl distribution-heavy**. COGS structure: malt + hops + yeast + water + utilities **$45-$95/bbl raw**, packaging (cans + carriers + labels) adds **$55-$120/bbl** for canned product. Federal excise tax **$3.50/bbl first 60,000 bbl** under Craft Beverage Modernization Act (CBMA) permanent post-2020 + state excise $1.20-$8.50/bbl. Taproom labor + COGS + rent typically **52-62% of taproom revenue**, distribution gross margin **22-32%** before brand investment + sales rep load.
> - **[Hardest part]** **Differentiated brand + taproom traffic + segment headwinds** (not brewing skill, not capital) -- specifically the **craft volume decline 2021-2024 first time in decades** per BA (down 1-3% annually after 30+ years growth), **hard seltzer cannibalization 2019-2022** (White Claw + Truly + Bud Light Seltzer pulled 8-15% of craft drinkers), **Gen Z lower alcohol consumption** (THC beverages + non-alc + mocktails + functional sodas eroding 18-29 demographic 12-22%), **tap-handle saturation in major markets** (Denver + Portland + Asheville + San Diego + Bend + Grand Rapids 200+ breweries per million population making distribution near-impossible), **distributor consolidation** (Reyes Beverage Group ~$10B revenue + Republic National Distributing + Breakthru Beverage + Manhattan Beer + Columbia Distributing + Ben E. Keith control 65-80% of US beer distribution making new-brand placement difficult), **AB-InBev / Molson Coors / Constellation Brands counter-pressure** (acquisitions of Wicked Weed 2017 controversy + Goose Island 2011 + Founders 2014 minority + Ballast Point Constellation $1B 2015 then sold 2019 + craft-style brand proliferation like Michelob Ultra Pure Gold dilute the category), **aluminum can shortages + cost inflation 2020-2022** ($0.08-$0.12 to $0.15-$0.22 per 16oz can), **glycol + hops + malt cost inflation 30-60% 2021-2024**, **ESG/sustainability pressure** (water usage 5-7 bbl water per 1 bbl beer + spent grain waste + carbon emissions scrutiny), **ABV mislabeling lawsuits 2022-2025**, and **Untappd review-bombing** by competing breweries + amateur critics.

A **microbrewery (craft brewery) business** in 2027 is a **production brewery + on-premise taproom hybrid** -- a **TTB-licensed + state-ABC-licensed** facility producing **<15,000 bbl/year** (BA "microbrewery" definition) of beer in **kegs + cans + occasional bottles**, sold through three federal-three-tier channels: **taproom DTC pints/flights/crowlers (60-75% rev, 70-78% margin) + self-distribution where state law permits (15-25% rev, 35-45% margin) + distributor wholesale (5-15% rev, 25-35% margin)**. Distinct from **brewpub** (25%+ on-site food-dominant), **contract brewing** (no facility ownership), **gypsy/tenant brewing** (rotating contract relationships), and **macro-owned craft-style brands** (Goose Island, Blue Moon, Shock Top, Leinenkugel).

The honest 2027 demand reality: **~9,500-9,800 US craft breweries** per BA + Brewbound -- **down from 2019-2022 peak ~9,700-10,200**. Volume **23-25M bbl craft (~13% of US beer)** generating **$28B-$30B retail**. **~75% produce <1,000 bbl annually** with **median 750-1,200 bbl/year**. The 30-year tailwind flattened: craft volume **-1% 2022 + -1.6% 2023 + -2% 2024 estimated**. Demand drivers remaining: local taproom + experience consumption + premium variety + lifestyle brand affinity. Counter-pressures: hard seltzer + Gen Z lower alcohol + tap-handle saturation + distributor consolidation + AB-InBev pressure + aluminum/hops/malt inflation + ESG + Untappd review-bombing.

Five things that determine whether a microbrewery survives years 1-5: **(1) Taproom traffic + experience + non-beer revenue**; **(2) Brewing program differentiation + brand identity + style-trend sensitivity**; **(3) Distribution discipline + self-distribution where legal**; **(4) Capital efficiency + brewhouse sizing matched to demand**; **(5) Founder runway + community + culture through year 3 trough**.

## 🗺️ Table of Contents

**Part 1 -- Foundations**
- [Market size & microbrewery vs brewpub vs contract vs gypsy vs craft retail](#market-size--microbrewery-vs-brewpub-vs-contract-vs-gypsy-vs-craft-retail)
- [Federal three-tier system, TTB licensing & state ABC regulation](#federal-three-tier-system-ttb-licensing--state-abc-regulation)
- [Brand identity, market entry & demand reality post-2022 plateau](#brand-identity-market-entry--demand-reality-post-2022-plateau)

**Part 2 -- Build-Out & Capital**
- [Brewhouse sizing, fermentation, packaging & QC equipment stack](#brewhouse-sizing-fermentation-packaging--qc-equipment-stack)
- [Facility build-out, taproom design, zoning & permit timeline](#facility-build-out-taproom-design-zoning--permit-timeline)
- [Capital stack: SBA 7(a)/504, equipment finance, friends & family, crowdfunding](#capital-stack-sba-7a504-equipment-finance-friends--family-crowdfunding)

**Part 3 -- Operations**
- [Brewing program, recipe cadence, style trends & QC discipline](#brewing-program-recipe-cadence-style-trends--qc-discipline)
- [Taproom operations, food strategy, events & POS/loyalty stack](#taproom-operations-food-strategy-events--posloyalty-stack)
- [Self-distribution vs distributor wholesale & sales rep economics](#self-distribution-vs-distributor-wholesale--sales-rep-economics)
- [Marketing: Untappd, Instagram, festivals, collabs & local community](#marketing-untappd-instagram-festivals-collabs--local-community)

**Part 4 -- Growth & Exit**
- [Scaling barrels, taproom expansion, satellite locations & 2nd brewery](#scaling-barrels-taproom-expansion-satellite-locations--2nd-brewery)
- [Exit math: strategic acquisition, ESOP, family-office sale & wind-down](#exit-math-strategic-acquisition-esop-family-office-sale--wind-down)
- [Counter-case: craft volume decline, hard seltzer, Gen Z, distributor moat & AB-InBev pressure](#counter-case-craft-volume-decline-hard-seltzer-gen-z-distributor-moat--ab-inbev-pressure)

---

## 📐 PART 1 -- FOUNDATIONS

### Market size & microbrewery vs brewpub vs contract vs gypsy vs craft retail

BA tiers: **microbrewery <15K bbl/year**, **regional craft 15K-6M bbl**, **macro >6M bbl**. "Craft" adds **independence (<25% non-craft-brewer ownership)** + **traditional ingredients**. US craft count **~9,500-9,800** (down from 2019-2022 peak), volume **23-25M bbl (~13% of US beer)**, revenue **$28B-$30B**.

Adjacent beer formats: **(1) Microbrewery** production + taproom, $650K-$9M capital, 65-78% taproom margin. **(2) Brewpub** 25%+ on-site sales, food-dominant. **(3) Contract brewing** (BrewDog Contract, Two Roads, Brew Hub, City Brewing) -- $50K-$300K startup, 12-18% margin, no facility. **(4) Gypsy/tenant brewing** (Mikkeller US, Evil Twin, Pretty Things historic). **(5) Homebrew retail** retail-only. **(6) Macro-owned craft-style** (Goose Island, Blue Moon, Shock Top, Leinenkugel, Elysian, 10 Barrel, Devils Backbone) -- lose BA craft status post-acquisition.

Revenue model engine: taproom DTC pint at 70-78% margin. Losing it to oversupply or weak experience design is the most common failure path.

### Federal three-tier system, TTB licensing & state ABC regulation

Post-Prohibition **three-tier system**: brewer → distributor → retailer. Self-distribution (brewer direct to retailer) is permitted with state-specific volume caps.

**Federal TTB Brewer's Notice** -- application via TTB Permits Online, **3-9 month processing**, requires premises diagram + ownership disclosure + bond. Federal excise tax under **CBMA permanent post-2020**: **$3.50/bbl first 60,000 bbl** (brewers <2M bbl/yr); $16/bbl thereafter; $18/bbl over 6M bbl.

**State ABC variation:** **TX 75,000 bbl** self-distribution + taproom; **CA 60,000 bbl**; **NY 75,000 bbl**; **FL unlimited self-distrib + taproom**; **CO + OR + WA + PA** brewery-friendly; **MS + AL + TN** progressive opening 2017-2023. Engage **alcohol-beverage counsel** (Strike Kerr & Johns, Lehrman Beverage Law, McDermott Will & Emery, Hinman & Carmichael, GrayRobinson).

**Local zoning:** Industrial M-1/M-2 or commercial C-2/C-3 with brewery use-permit. Setbacks 300-500 feet from schools/churches + parking + patio variance + fire marshal + health department add **3-9 month entitlement** beyond TTB + state ABC.

### Brand identity, market entry & demand reality post-2022 plateau

The 2010-2019 "if you build it they will come" craft tailwind ended 2022. New breweries must differentiate on taproom experience + brewing program + community story + visual brand + non-beer offerings to win share in a flat-to-declining category.

**Demand reality:** Craft volume **-1% 2022 + -1.6% 2023 + -2% 2024 estimated** -- first multi-year decline in 40+ years. **Openings ~400-500/yr vs closings ~450-550/yr** with net negative since 2023.

**Saturated markets:** **Denver + Portland OR + Asheville + San Diego + Bend OR + Grand Rapids + Greenville SC + Austin** have **200+ breweries per million population**. New entrants there need measurable distinctiveness on brewing program, taproom experience, or brand identity -- or relocate to underserved secondary markets.

**Market tier selection:** **Saturated hub (200+/M)** = high differentiation bar + low odds. **Growing market (50-150/M)** = best first-time risk-reward. **Underserved (<50/M)** = lower competition + smaller TAM.

---

## 🏗️ PART 2 -- BUILD-OUT & CAPITAL

### Brewhouse sizing, fermentation, packaging & QC equipment stack

Equipment selection is driven by 3-year volume projection + product mix + capital, not founder preference for shiny stainless.

**Brewhouse:** **Nano 1-3 bbl** $40K-$120K (Stout Tanks, Spike Brewing, SS Brewtech, Psycho Brew). **Small 3-7 bbl** $120K-$280K (Premier Stainless, Specific Mechanical, GW Kent). **Mid 7-15 bbl** $250K-$650K (DME, GW Kent, Premier, Specific Mechanical, AAA, Newlands) -- most common production size. **Regional 15-30 bbl** $600K-$1.4M (AAA, Specific, GEA, Krones, Ziemann). Components: mash tun + lauter tun + kettle + whirlpool + heat exchanger + pumps + control panel.

**Fermentation tanks** $18K-$45K (7-15 bbl unitank) up to $45K-$95K (30-60 bbl). **Need 6-12 fermenters** -- ferment + condition takes 14-28 days so fermenter count drives capacity. **Bright tanks** $14K-$38K, 2-4 needed.

**Glycol chiller** $25K-$95K (5-25 ton). **Grain mill** $4K-$18K (RMS, Apollo). **Hot/cold liquor tanks** $8K-$25K each.

**Packaging:** **Kegging** $20K-$95K (Premier, GW Kent, Cask). **Canning** $200K-$900K -- **Wild Goose** dominant at small-craft ($200K-$500K entry, $500K-$900K higher-speed), **Cask** ($250K-$650K), **Codi** ($300K-$800K), **Pneumatic Scale Angelus PSA** ($600K-$1.5M+), **Krones** ($1M-$3M+). Crown + Ball aluminum cans at $0.15-$0.22/16oz.

**QC lab** $25K-$80K -- pH + dissolved oxygen + density (Anton Paar DMA, Mettler-Toledo) + microscopy + ABV (Anton Paar Alcolyzer adds $25K-$45K) + plate count + agar + incubator for microbiology.

**Cellar + walk-in cooler** $25K-$95K. **Forklift** $15K-$45K. **CIP skid** $15K-$45K.

### Facility build-out, taproom design, zoning & permit timeline

Facility build-out is the single biggest single-line cost -- often equaling or exceeding equipment cost.

**Space requirements:** Production 1,500-8,000 sqft + taproom 1,500-4,000 sqft (60-180 seats) + cold storage/warehouse 800-3,500 sqft + office/utility 600-1,500 sqft = **typical total 5,000-15,000 sqft**.

**Build-out cost:** Shell conversion $25-$80/sqft. Full TI $80-$180/sqft production + $180-$300/sqft taproom (bar + finishes + ADA + HVAC + kitchen if food). Greenfield $200-$400/sqft. Typical 7K-10K sqft = **$1.05M-$3M build-out** before equipment.

**Critical infrastructure:** Floor + trench drains with sloped epoxy-coated concrete + 3-phase 200-800A electrical + natural gas or steam boiler ($25K-$95K) + 1-2" water main with backflow prevention + brewing water treatment + **wastewater discharge permits with grease/solids interception** (brewery effluent has high BOD/COD requiring pre-treatment or surcharges).

**Permit timeline:** Brewery use permit + CUP/special exception 3-9 months. TI building permit 8-16 wk plan review + 4-12 month construction. TTB 3-9 months + state ABC 2-6 months concurrent. **Total lease-to-first-pour 12-24 months**, longer in slow-permit jurisdictions.

### Capital stack: SBA 7(a)/504, equipment finance, friends & family, crowdfunding

Microbrewery capital stack is debt-light + equity-heavy vs other CRE -- brewery equipment is specialty depreciating + brand revenue is hard to underwrite.

**SBA 7(a) up to $5M** -- 70-85% lender + 15-30% equity, Prime + 2.5-4.5% floating, 10-25 yr. **Live Oak Bank** dominant brewery lender (~30-40% deal share), plus Newtek, Celtic Bank, Wells Fargo SBA, Byline Bank.

**SBA 504 owner-user** (real estate + equipment <$5M) -- 50% senior bank + 40% SBA debenture (fixed 25-yr) + 10% equity if you own the building.

**Equipment finance/lease** -- $50K-$1M, 5-7 yr at 8-14% effective. North Mill, Channel Partners, Crest Capital, AP Equipment Finance, US Bank Equipment Finance. 100% for used, 80-90% for new.

**Friends & family + founder equity** -- dominant first $200K-$1M via convertible notes + SAFE + LLC interests. Average craft raise **$500K-$1.5M F&F** per BA + Brewbound.

**Reg CF crowdfunding** (Wefunder, Republic, StartEngine) -- $100K-$5M raises. Modern Times ($1.4M Wefunder 2019), BrewDog USA (multiple totaling $25M+) precedents. Pro: community + repeat customers. Con: 200-2,000 micro-shareholders + compliance.

**Local angel/micro-VC** -- regional angel groups + family offices invest $250K-$2M in standout concepts.

---

## ⚙️ PART 3 -- OPERATIONS

### Brewing program, recipe cadence, style trends & QC discipline

**Flagship + rotational mix.** Most taproom-led breweries run **2-4 flagships** (year-round, 35-55% of barrels) + **8-20 rotating seasonals** annually. Flagships build distribution velocity; rotations drive taproom traffic + Untappd engagement.

**2026-2027 style trends:** **Hazy/NEIPA peak passed** (still 18-28% of IPA volume but flat). **West Coast IPA revival** (sharper, drinkable). **Lagers ascending strongly** -- Mexican lager, helles, Italian pilsner, dark lager, festbier all growing. **Pastry stout + smoothie sour peak passed**. **Low-cal/low-ABV growing** (Athletic Brewing non-alc proved demand). **Cold IPA** (lager yeast + IPA hops) novel 2023-2025. **Mexican/domestic lager** strongest growth 2024-2026.

**Ingredients sourcing:** **Hops** -- Yakima Chief Hops, John I. Haas (Barth-Haas), Hopsteiner, Crosby Hop Farm, Roy Farms with 1-3 yr contracts for popular varietals (Citra, Mosaic, Galaxy, Strata, Idaho 7). **Malt** -- Country Malt Group (largest), Brewers Supply Group (BSG), Briess, Great Western, Rahr. **Yeast** -- White Labs, Wyeast Labs, Imperial Yeast, Omega Yeast, GigaYeast, Lallemand dry -- $80-$300/pitch liquid + $25-$80/lb dry. **Packaging** -- Crown Holdings + Ball Corporation cans + G3 closures.

**QC discipline:** Daily pH (4.4-4.6 finished) + dissolved oxygen (<50 ppb packaged) + density/ABV (±0.1%). Weekly microbiology plate counts + sensory panel. Skipping QC produces off-flavors (diacetyl, acetaldehyde, DMS) + infections + ABV mislabeling lawsuits.

### Taproom operations, food strategy, events & POS/loyalty stack

Taproom = the economic engine: 60-75% of revenue at 70-78% margin.

**Hours + staffing:** Thu-Sun heavy (12-10pm Fri-Sat, 12-8pm Sun, 4-9pm Thu). 1-2 beertenders + 1 floor lead for 60-120 seat taproom. Beertender **$15-$22/hr + $50-$300/shift tips**. Taproom manager **$45K-$70K**.

**Food strategy:** **Food truck rotation** dominant (2-4 trucks Thu-Sun, 20-30% rev share or flat rental). **In-house pizza/limited menu** $120K-$350K kitchen build-out adds labor + permits but boosts ticket. **No food + walkable district** option for nano.

**Events:** Trivia + run clubs + yoga + game nights + live music + cask nights + release parties + collabs. Typical brewery runs **80-200 events/year**.

**POS + loyalty:** **Toast** (~30-40% craft share) + **Square for Restaurants** (~25-35%) + **Arryved** (~15-25% specialty) + **Lightspeed** (~5-10%). **Untappd for Business** loyalty + tap list + check-in rewards ($0 free; $99-$299/mo premium).

**Average taproom ticket** $14-$32 (pint $6-$10 + flight $10-$18 + crowler $14-$20). **Revenue/sqft** $400-$900 annually for mature taproom-led brewery.

### Self-distribution vs distributor wholesale & sales rep economics

The wholesale decision: self-distribute where legal vs sign with distributor for scale.

**Self-distribution economics:** Per-keg margin **$80-$140** vs **$40-$70** through distributor. Per-case margin **$14-$28** vs **$7-$14**. Requires van/box truck + warehouse + sales rep **$60K-$95K** + draft line cleanings + retailer relationships.

**State thresholds:** TX 75K bbl + CA 60K + NY 75K + FL unlimited + CO/OR/WA/PA brewery-friendly. Many other states capped at 5K-30K bbl.

**Major distributors** when you sign: **Reyes Beverage Group** (~$10B, dominant IL/CA/FL/DC), **Republic National Distributing (RNDC)** (~$10B), **Breakthru Beverage** ($6B+), **Manhattan Beer** (NY metro), **Columbia Distributing** (PNW), **Ben E. Keith** (TX), **Sheehan Family** (Northeast), Tenco + regional families.

**Franchise law trap:** Most states have beer franchise laws -- you cannot easily terminate or switch without good cause or 6-12 months termination fees. Negotiate hard initially with alcohol-beverage counsel.

**Sales rep load:** Brewery reps $55K-$95K + commission + truck managing 80-180 accounts. Distributor brand managers need brand activation budgets + tap-handle deployments + festival sponsorships.

### Marketing: Untappd, Instagram, festivals, collabs & local community

Craft customer acquisition dominated by **Untappd + Instagram + word-of-mouth + festivals + local press** -- paid advertising has limited ROI.

**Untappd** -- dominant craft-beer review/check-in app with **15M+ users globally, 8M+ US**. New releases get checked-in within hours of pour. Rating drives discovery + retailer-buyer perception. **Untappd for Business** ($0-$299/mo) gives tap-list + venue verification + customer data. **Review-bombing** by competitors/amateur critics is a real reputational risk.

**Instagram + TikTok** -- beer photos + can label art + taproom vibes + brewer behind-the-scenes. Larger breweries (Other Half, Trillium, Tree House, Toppling Goliath) have **100K-500K followers**.

**Festivals:** **Great American Beer Festival (GABF Denver)** -- 60K attendees + 800+ breweries + BA judging. **World Beer Cup + Craft Brewers Conference (CBC)** trade show. Regional weeks (Chicago, NY, SAVOR DC). Festival presence $5K-$25K returns brand awareness + new-account leads.

**Collaboration releases** -- Other Half, Trillium, Burial, Foam Brewers built reputations partly through collab programs.

**Local community + press:** Newspaper food/drink + alt-weekly + city magazine + craft blogs/podcasts. Community partnerships (charity + nonprofit collab ales + run-club hosting).

**Direct + online:** DTC shipping legal in some states (CA, OR, WA, NH) with permits. Online reservation + curbside pickup standard post-2020. SMS list via Tatango/Postscript/Klaviyo for release announcements.

---

## 🚀 PART 4 -- GROWTH & EXIT

### Scaling barrels, taproom expansion, satellite locations & 2nd brewery

The growth path from CO to mature regional brand has category headwinds making each 2027 stage harder than 2010-2019.

**Stage 1 (Year 1 post-CO):** **400-1,200 bbl** typical for 7-15 bbl brewhouse. Revenue **$400K-$1.2M**. Cash burn continues with thin/negative EBITDA.

**Stage 2 (Years 2-3):** **1,200-3,500 bbl** with first canning runs + first distributor relationships. Revenue **$1.0M-$2.8M**. EBITDA **3-8%**.

**Stage 3 (Years 3-5):** **2,500-7,000 bbl** running near capacity. Revenue **$2.0M-$5.5M**. EBITDA **8-14%**. Decision point: scale via additional fermenters + larger brewhouse + satellite + 2nd location -- or stay disciplined.

**Stage 4 (Years 5-8):** **Satellite taprooms** (1,000-2,500 sqft taproom-only pouring main brewery's beer) extend brand without doubling capex. **2nd production brewery** in new metro requires re-licensing + brand-build + 18-36 months to breakeven.

**Stage 5 (Years 7-12):** **5,000-25,000 bbl** thriving regional craft. Revenue **$5M-$22M**. Exit decision: hold, strategic sale, ESOP, family-office, or wind-down.

| Stage | Timeline | Annual Barrels | Annual Revenue | EBITDA Margin |
|---|---|---|---|---|
| Stage 1 Brand build | Year 1 post-CO | 400-1,200 bbl | $400K-$1.2M | Negative to 3% |
| Stage 2 Velocity | Years 2-3 | 1,200-3,500 bbl | $1.0M-$2.8M | 3-8% |
| Stage 3 Mature single | Years 3-5 | 2,500-7,000 bbl | $2.0M-$5.5M | 8-14% |
| Stage 4 Multi-location | Years 5-8 | 4,000-15,000 bbl | $3.5M-$13M | 6-12% (re-investment) |
| Stage 5 Regional craft | Years 7-12 | 5,000-25,000 bbl | $5M-$22M | 10-16% |

| Sizing Decision | Capital | Production Cap | Best For |
|---|---|---|---|
| Nano 1-3 bbl + taproom-only | $400K-$900K | 200-800 bbl | Founder-led + neighborhood + experiment |
| Small 3-7 bbl + small taproom | $650K-$1.5M | 800-2,500 bbl | Taproom-led + minimal distribution |
| Production 7-15 bbl + full taproom | $1.2M-$3.5M | 2,500-7,000 bbl | Most common production microbrewery |
| Mid 15-30 bbl + destination taproom | $3.5M-$9M+ | 7,000-25,000 bbl | Regional craft with distribution ambition |
| Add satellite taproom | $400K-$1.2M | N/A (extends reach) | Mature 3+ year brewery extending brand |
| 2nd production brewery | $1.5M-$8M | Doubles capacity | 5+ year brewery proven at first location |

### Exit math: strategic acquisition, ESOP, family-office sale & wind-down

The microbrewery exit landscape narrowed dramatically post-2017 as the AB-InBev wave generated backlash and macro-craft appetite cooled.

**Strategic acquisition by macro (rare since 2017):** **AB-InBev** acquired Goose Island 2011, Blue Point 2014, 10 Barrel 2014, Elysian 2015, Golden Road 2015, Four Peaks 2015, Devils Backbone 2016, **Wicked Weed 2017 (industry backlash + boycott)**, Karbach 2016. **Heineken** acquired Lagunitas. **Molson Coors** acquired Saint Archer 2015 (resold 2020). **Sapporo** acquired **Stone Brewing $165M 2022**. **Boston Beer Co** acquired **Dogfish Head 2019 $300M**. **Lion (Kirin)** acquired **New Belgium 2019** + Bell's 2021. **Mahou San Miguel** acquired Founders + Avery minority stakes.

**Why macro M&A cooled:** Wicked Weed 2017 backlash included **40+ breweries pulling out of Funkatorium collab fest** + sustained Untappd pressure + distributor revolt + BA independent-craft brand mark campaign. Post-2018 acquisitions are scrutinized harder.

**PE/portfolio aggregator:** **Canarchy Craft Brewery Collective** (Fireman Capital 2015 acquired Oskar Blues + Cigar City + Perrin + Deep Ellum; **sold to Monster Beverage 2022 $330M**). **Tilray Brands** (cannabis-beer hybrid acquiring SweetWater + Alpine + Green Flash + Montauk).

**ESOP:** **New Belgium** (100% ESOP 2013 then sold to Lion 2019), Harpoon, Modern Times, Full Sail, Deschutes, Left Hand. Allow founder liquidity + employee ownership + independence preservation but require 5-15% annual cash service.

**Family-office/local sale:** $2M-$25M at **3-7x EBITDA**. Most common 2020+ exit. Brokered by First Beverage Group, Brewers Resource Group, Cascade Capital, Quarry Hill Advisors.

**Wind-down/asset sale:** Most common 2022-2024 exit -- **~450-550 closures/yr 2023-2024**. Equipment auctioneers (Brewery Equipment Auctions, Premier Stainless used, J Squared Industrial).

| Exit Path | Buyer Type | Typical Multiple | Process Length | Best For |
|---|---|---|---|---|
| Strategic acquisition by macro | AB-InBev/Heineken/Molson Coors/Boston Beer | 8-15x EBITDA historical | 9-18 months | Regional brand 50K+ bbl + clean cap table |
| Strategic acquisition by Japanese | Lion/Sapporo/Mahou | 6-12x EBITDA | 9-15 months | Regional craft + Asian-export potential |
| PE/portfolio aggregator | Canarchy/Tilray/Wagner/family-office PE | 5-9x EBITDA | 6-12 months | 5K-30K bbl regional craft |
| ESOP transition | Employee Stock Ownership Plan | 4-7x EBITDA structured | 12-24 months | Mature operator + culture preservation |
| Family-office or local sale | Local investor / regional family | 3-7x EBITDA | 4-9 months | $2M-$25M small-craft brewery |
| Wind-down / asset sale | Equipment auction + lease assignment | Asset value only | 60-180 days | Distressed or exhausted operator |

### Counter-case: craft volume decline, hard seltzer, Gen Z, distributor moat & AB-InBev pressure

A serious microbrewery founder must stress-test the case above against the conditions that make this category a difficult bet in 2027 -- craft volume decline, hard seltzer + cannabis beverage cannibalization, Gen Z lower-alcohol shift, tap-handle saturation, distributor consolidation moat, AB-InBev/Molson Coors/Constellation counter-pressure, aluminum + hops + malt cost inflation, ESG water/waste pressure, ABV labeling enforcement, Untappd review-bombing, capital intensity vs adjacent food-beverage businesses, and adjacent business models that may fit better (full 12-element counter-case in the Counter-Case section below).

`;

const tldr = `**TL;DR:** Starting a **microbrewery (craft brewery) business in 2027** (a.k.a. **craft brewery**, **production brewery + taproom**, **small/independent brewery**, **<15,000 bbl/year per Brewers Association BA definition**) -- the **TTB-licensed (Federal Tax and Trade Bureau Brewer's Notice) + state-ABC-licensed facility producing beer in nano 1-3 bbl + small 3-7 bbl + production 7-15 bbl + mid 15-30 bbl brewhouse formats packaged in kegs (15.5 gal half-barrel + 7.75 gal sixtel) + cans (12oz + 16oz tallboy + 19.2oz stovepipe via Crown Holdings + Ball Corporation aluminum) + occasional bottles, sold through three federal-three-tier channels: on-premise taproom DTC pints/flights/crowlers (60-75% revenue at 70-78% margin) + self-distribution to local accounts where state law permits (TX 75K bbl + CA 60K + NY 75K + FL unlimited + CO/OR/WA/PA brewery-friendly) at 15-25% revenue + 35-45% margin + wholesale through licensed distributor Reyes Beverage Group $10B + Republic National Distributing + Breakthru + Manhattan Beer + Columbia + Ben E. Keith + Sheehan Family at 5-15% revenue + 25-35% margin** -- means navigating **TTB Brewer's Notice 3-9 month application + Craft Beverage Modernization Act CBMA permanent post-2020 federal excise $3.50/bbl first 60,000 bbl + state ABC 2-6 month + local industrial M-1/M-2 or commercial C-2/C-3 zoning with brewery use permit + CUP for taproom retail + setbacks 300-500 feet from schools/churches + alcohol-beverage counsel (Strike Kerr & Johns + Lehrman Beverage Law + McDermott Will & Emery + Hinman & Carmichael + GrayRobinson) + brewhouse selection (nano $40K-$120K Stout Tanks/Spike/SS Brewtech/Psycho Brew + small $120K-$280K + production $250K-$650K DME/GW Kent/Premier Stainless/Specific Mechanical/AAA Metal Fabrication/Newlands + regional $600K-$1.4M GEA/Krones/Ziemann) + 6-12 fermentation tanks $18K-$45K each + bright tanks $14K-$38K + glycol chiller $25K-$95K + canning line Wild Goose $200K-$900K/Cask $250K-$650K/Codi $300K-$800K/Pneumatic Scale Angelus $600K-$1.5M+ + QC lab Anton Paar + Mettler-Toledo + Alcolyzer ABV + facility build-out 5,000-15,000 sqft at $80-$180/sqft production + $180-$300/sqft taproom + ingredient sourcing Yakima Chief Hops/John I Haas Barth-Haas/Hopsteiner/Crosby Hop Farm + Country Malt Group/BSG/Briess/Great Western/Rahr + White Labs/Wyeast Laboratories/Imperial Yeast/Omega Yeast + capital stack SBA 7(a) up to $5M with Live Oak Bank dominant brewery lender + SBA 504 owner-user + equipment finance North Mill/Channel Partners/Crest Capital + friends-and-family $500K-$1.5M + Reg CF crowdfunding Wefunder/Republic/StartEngine + Toast/Square/Arryved/Lightspeed POS + Untappd for Business loyalty + Ekos/Beer30 5th Ingredient/OrchestratedBeer/Vicinity Brew ERP + 2026-2027 style trends (lagers ascending Mexican/helles/Italian pilsner/festbier + West Coast IPA revival + hazy peak passed + low-cal/non-alc growing Athletic Brewing) + festivals (Great American Beer Festival GABF Denver + Craft Brewers Conference + World Beer Cup) + collaboration releases**, and operating against **~9,500-9,800 US craft breweries down from 2019-2022 peak ~9,700-10,200 + ~23-25M craft bbl (~13% of US beer) generating $28B-$30B retail dollar sales per BA + Brewbound + Beer Marketer's Insights + ~75% produce <1,000 bbl annually + median 750-1,200 bbl/yr + craft volume -1% 2022 + -1.6% 2023 + -2% 2024 estimated first multi-year decline in 40+ years** -- capturing **typical taproom-heavy mature brewery 65-78% gross margin on taproom pints + 35-45% self-distribution + 25-35% distributor + 8-14% EBITDA at $1.5M-$4M revenue + revenue per barrel $1,200-$1,800 taproom-heavy vs $400-$700/bbl distribution-heavy + raw COGS $45-$95/bbl + packaging $55-$120/bbl with reference brewers Yuengling (oldest US 1829) + Sierra Nevada (1980 still independent) + New Belgium (Lion 2019 + Voodoo Ranger) + Stone Brewing (Sapporo $165M 2022) + Dogfish Head (Boston Beer 2019 $300M) + Bell's (Lion 2021) + Allagash + Founders (Mahou San Miguel minority) + Wicked Weed (AB-InBev 2017 controversy) + Russian River (Pliny the Elder) + Other Half + Tree House + Trillium + Toppling Goliath + Cigar City (Canarchy/Monster Beverage $330M 2022) + Athletic Brewing (non-alc leader)**. The hardest part is **differentiated brand + taproom traffic + craft category headwinds (volume -1 to -2% 2022-2024 + hard seltzer cannibalization White Claw/Truly/Bud Light Seltzer + Gen Z lower alcohol + THC beverages + non-alc + mocktails eroding 18-29 demo 12-22% + tap handle saturation Denver/Portland OR/Asheville/San Diego/Bend OR/Grand Rapids/Austin 200+ breweries per million + distributor consolidation Reyes/RNDC/Breakthru control 65-80% US beer distribution + AB-InBev/Molson Coors/Constellation counter-pressure + Wicked Weed 2017 + Stone Sapporo + Constellation Ballast Point $1B 2015 sold 2019 dilute the category + aluminum can cost inflation $0.08-$0.12 to $0.15-$0.22 per 16oz + glycol/hops/malt inflation 30-60% 2021-2024 + ESG water 5-7 bbl water per 1 bbl beer + ABV mislabeling lawsuits 2022-2025 + Untappd review-bombing)**, not brewing skill or capital.`;

const flow = `

## The Operating Journey: From Lease + License To Mature Craft Brewery And Strategic Exit

\`\`\`mermaid
flowchart TD
  A[Founder Decides To Start Microbrewery + Taproom] --> B[Market Tier + Capital + Format Decision]
  B --> B1{Market Tier + Brewhouse + Taproom + Capital Decision}
  B1 -->|$400K-$900K Nano 1-3 bbl Plus Taproom-Only Neighborhood| C1[Nano Taproom Founder]
  B1 -->|$650K-$1.5M Small 3-7 bbl Plus Small Taproom Taproom-Led| C2[Small Taproom-Led Brewery]
  B1 -->|$1.2M-$3.5M Production 7-15 bbl Plus Full Taproom Most Common| C3[Production Microbrewery]
  B1 -->|$3.5M-$9M+ Mid 15-30 bbl Plus Destination Taproom Plus Distribution| C4[Regional Craft With Distribution]
  B1 -->|$50K-$300K Contract Brewing No Facility Ownership| C5[Contract Brewing Brand]
  B1 -->|Acquire Existing Brewery With Operating Track Record| C6[Acquisition Operator]
  C1 --> D[Site Plus Zoning Plus TTB Plus State ABC Plus Local Permits]
  C2 --> D
  C3 --> D
  C4 --> D
  C5 --> D
  C6 --> D
  D --> D1[Industrial M-1/M-2 Or Commercial C-2/C-3 With Brewery Use Permit Plus Conditional Use For Taproom]
  D --> D2[Alcohol-Beverage Counsel Strike Kerr Johns/Lehrman Beverage Law/McDermott Will Emery/Hinman Carmichael/GrayRobinson]
  D --> D3[TTB Brewer's Notice 3-9 Months Federal Tax And Trade Bureau Plus Bond Plus Premises Diagram]
  D --> D4[State ABC License 2-6 Months Concurrent With TTB Plus State Excise Tax Setup]
  D --> D5[Local Setbacks 300-500 Feet From Schools/Churches Plus Parking Plus Patio Variance Plus Health Permit]
  D1 --> E[Capital Stack Plus Equipment Plus Build-Out]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  E --> E1[SBA 7(a) Up To $5M Live Oak Bank Dominant Brewery Lender 70-85% LTV Prime+2.5-4.5%]
  E --> E2[SBA 504 Owner-User If Real Estate 50/40/10 Senior/SBA Debenture/Equity Better Terms]
  E --> E3[Equipment Finance $50K-$1M North Mill/Channel Partners/Crest Capital/BankFinancial 5-7yr 8-14%]
  E --> E4[Friends + Family $500K-$1.5M Convertible Notes/SAFE/LLC Member Interests Average Raise]
  E --> E5[Crowdfunding Wefunder/Republic/StartEngine Reg CF $100K-$5M Builds Community Plus Compliance]
  E --> E6[Local Angel/Micro-VC $250K-$2M For Standout Concepts Less Common Than F&F]
  E1 --> F[Brewhouse + Fermenters + Packaging + Build-Out]
  E2 --> F
  E3 --> F
  E4 --> F
  E5 --> F
  E6 --> F
  F --> F1[Brewhouse Nano $40K-$120K + Small $120K-$280K + Production $250K-$650K + Mid $600K-$1.4M]
  F --> F2[Fermentation 6-12 Unitanks $18K-$45K + Bright Tanks $14K-$38K + Glycol $25K-$95K]
  F --> F3[Canning Wild Goose $200K-$500K + Cask Brewing $250K-$650K + Codi $300K-$800K + Pneumatic Scale]
  F --> F4[Facility Build-Out 5K-15K sqft $80-$180/sqft Production + $180-$300/sqft Taproom + Floor Drains]
  F --> F5[QC Lab Anton Paar + Mettler-Toledo + Microbiology + Alcolyzer ABV Plus Walk-In Cooler + Forklift]
  F1 --> G[Brewing Program + Recipe Cadence + QC + Ingredient Sourcing]
  F2 --> G
  F3 --> G
  F4 --> G
  F5 --> G
  G --> G1[Hops Yakima Chief/Haas/Hopsteiner/Crosby/Roy Farms Contracted 1-3 Years Plus Spot Market]
  G --> G2[Malt Country Malt Group/BSG/Briess/Great Western/Rahr 30-90 Day Terms]
  G --> G3[Yeast White Labs/Wyeast/Imperial/Omega/GigaYeast/Lallemand Liquid $80-$300 + Dry $25-$80/lb]
  G --> G4[QC Daily pH/DO/Density + Weekly Plate Counts/Sensory + Monthly Trend Analysis]
  G --> G5[Flagship 2-4 Beers 35-55% Of Barrels + 8-20 Rotating Seasonals 2026-2027 Lagers Ascending]
  G1 --> H[Taproom Operations + POS + Marketing + Distribution]
  H --> H1[Taproom Thu-Sun Heavy Hours + Beertenders $15-22/hr + Taproom Manager $45K-$70K]
  H --> H2[Food Truck Rotation Dominant + In-House Pizza/Limited Menu If Capital + No Food Nano Option]
  H --> H3[Toast/Square/Arryved/Lightspeed POS + Untappd For Business Loyalty $99-$299/Mo Premium]
  H --> H4[Events 80-200/Year Trivia/Run Clubs/Live Music/Cask Nights/Collab Releases Drives Mid-Week]
  H --> H5[Self-Distribution TX 75K bbl/CA 60K/NY 75K/FL Unlimited + Distributor Reyes/RNDC/Breakthru Wholesale]
  H1 --> I[Marketing + Brand Build + Untappd + Festivals]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  I --> I1[Untappd 15M Users Globally + 8M US + Reviews + Check-Ins Drive Discovery + Review-Bombing Risk]
  I --> I2[Instagram + TikTok 3-5 Posts/Wk + Stories + Behind-Scenes + Larger Breweries 100K-500K Followers]
  I --> I3[GABF Denver 60K Attendees + 800+ Breweries + Craft Brewers Conference + Regional Beer Weeks]
  I --> I4[Collaboration Releases Other Half/Trillium/Burial/Foam Built Reputations Partly Through Collabs]
  I --> I5[Local Press + Community Partnerships + Charity Nights + Nonprofit Collab Ales + Run Club Hosting]
  I1 --> J[Stage Growth + Scaling Decisions]
  I2 --> J
  I3 --> J
  I4 --> J
  I5 --> J
  J --> J1[Stage 1 Year 1 400-1,200 bbl $400K-$1.2M Revenue Negative-To-3% EBITDA]
  J --> J2[Stage 2 Years 2-3 1,200-3,500 bbl $1.0M-$2.8M Revenue 3-8% EBITDA First Canning Runs]
  J --> J3[Stage 3 Years 3-5 2,500-7,000 bbl $2.0M-$5.5M Revenue 8-14% EBITDA Mature Single-Location]
  J --> J4[Stage 4 Years 5-8 Satellite Taprooms + 2nd Brewery + Distribution Expansion]
  K{Mature Operations Plus Strategic Exit Decision}
  J --> K
  K -->|Hold For Cash Flow Plus Brand Plus Community| L[Long-Term Independent Hold]
  K -->|Sell To Macro AB-InBev/Heineken/Molson Coors/Boston Beer 8-15x EBITDA Historical Backlash Risk| M[Macro Strategic Acquisition]
  K -->|Sell To Japanese Lion/Sapporo/Mahou 6-12x Asian-Export Optionality| N[Japanese Strategic Exit]
  K -->|Sell To PE/Aggregator Canarchy/Tilray/Wagner 5-9x Portfolio Premium| O[PE Aggregator Exit]
  K -->|ESOP Transition Employee Ownership 4-7x Structured Brand Independence| P[ESOP Founder Liquidity]
  K -->|Family-Office Or Local Investor Sale 3-7x EBITDA Small-Craft Norm| Q[Family-Office Sale]
  K -->|Wind-Down Equipment Auction + Lease Assignment Distressed Exit| R[Wind-Down/Asset Sale]
  L --> S[Independent Hold With Mature 10-16% EBITDA + Community + Brand Stewardship]
  M --> T[Macro Acquisition With Loss-Of-Craft-Status + Distributor + Consumer Backlash Risk]
  N --> U[Japanese Acquisition With Asian Distribution Expansion + Brand Preservation]
  O --> V[PE Roll-Up Into Multi-Brand Portfolio With Operational Efficiency Push]
  P --> W[Employee Ownership Preserving Brand Independence + Founder Liquidity]
  Q --> X[Local Investor Continuity With Founder Transition + Brand Preservation]
  R --> Y[Asset Liquidation + Equipment To Premier Stainless Used/Brewery Equipment Auctions]
\`\`\`

## The Decision Matrix: Brewhouse Format And Market Tier

\`\`\`mermaid
flowchart TD
  A[Founder Has Capital + Target Market + Brewhouse Size Decision] --> B{Market Tier Plus Capital Plus Brewhouse Plus Format Decision}
  B -->|Saturated Craft Hub 200+ Breweries Per Million Population Denver/Portland/Asheville/San Diego/Bend/Grand Rapids| C[Saturated Market Differentiation Required]
  B -->|Growing Craft Market 50-150 Per Million Best Risk-Reward For First-Time Brewers| D[Growing Market Sweet Spot]
  B -->|Underserved Market <50 Per Million Lower Competition Smaller TAM Lower Craft Per-Capita| E[Underserved Market Lower Comp]
  B -->|Brewpub 25%+ Beer Sold On-Site Restaurant Food-Dominant Economics| F[Brewpub Path Distinct Category]
  B -->|Contract Brewing $50K-$300K No Facility Brand-Build Through Existing Brewery Capacity| G[Contract Brewing Path]
  B -->|Gypsy/Tenant Brewing Rotating Contract Relationships Branded Marketing No Address| H[Gypsy Brewing Path]
  B -->|Acquire Existing Brewery With Track Record Faster Cash Flow Subject To Cap Multiple| I[Acquisition Path]
  C --> C1[Must Differentiate On Brewing Program/Taproom Experience/Brand Or Relocate To Secondary Market]
  C --> C2[Reference Saturated Markets Denver 250+/M + Portland OR 260+/M + Asheville 280+/M + Bend OR 300+/M]
  D --> D1[Best Risk-Reward For First-Time Brewers Plus Healthier Tap-Handle Availability + Distribution Access]
  D --> D2[Reference Growing Markets Charlotte 80/M + Cincinnati 70/M + Pittsburgh 85/M + Nashville 90/M + Kansas City]
  E --> E1[Lower Competition Plus Lower Craft Per-Capita Consumption Smaller TAM Plus Easier Differentiation]
  E --> E2[Reference Underserved Markets Birmingham AL + Memphis + Tulsa + Boise Mid-Size City + Rural Tertiary]
  F --> F1[Food-Dominant Economics + Kitchen Labor + Table Service Lower Per-Customer Beer Ticket Higher Total Ticket]
  F --> F2[Reference Brewpub Operators Brewpub Definition 25%+ On-Site Beer Sales + Restaurant POS Required]
  G --> G1[Contract Brewing With BrewDog Contract/Two Roads/Brew Hub/City Brewing 12-18% Gross Margin Brand-Only]
  G --> G2[No Facility Ownership Plus Lower Capital Plus Faster Launch Plus Constrained By Contract Brewer Capacity]
  H --> H1[Gypsy/Tenant Brewing Rotating Contract Relationships Plus Branded Marketing No Permanent Address]
  H --> H2[Reference Operators Mikkeller US + Evil Twin NYC Origins + Pretty Things Historic + Stillwater]
  I --> I1[Operating Track Record + Existing Customer Base + Faster Cash Flow + Subject To Cap-Rate Comps]
  I --> I2[Subject To Distressed Acquisition Discounts Given 2022-2024 Closure Wave + Buyer-Favorable Market]
  C2 --> J{Reassess After Year 3 Stabilization}
  D2 --> J
  E2 --> J
  F2 --> J
  G2 --> J
  H2 --> J
  I2 --> J
  J -->|Hold For Cash Flow + Brand Stewardship + Community| K[Long-Term Independent Hold]
  J -->|Sell To Macro AB-InBev/Heineken/Molson Coors With Backlash Risk At 8-15x| L[Macro Strategic Acquisition]
  J -->|Sell To Japanese Lion/Sapporo/Mahou At 6-12x With Asian-Export| M[Japanese Strategic Exit]
  J -->|Sell To PE/Aggregator Canarchy/Tilray At 5-9x Portfolio Premium| N[PE Aggregator Roll-Up]
  J -->|ESOP Transition Employee Ownership At 4-7x Structured| O[ESOP Founder Liquidity]
  J -->|Family-Office Or Local Investor Sale At 3-7x Small-Craft Norm| P[Family-Office Sale]
  J -->|Wind-Down + Equipment Auction Distressed| Q[Wind-Down Asset Sale]
  K --> R[Long-Term Independent Hold With Mature 10-16% EBITDA Plus Community + Brand Stewardship]
  L --> S[Macro Acquisition With Loss-Of-Craft-Status + Distributor + Consumer Backlash Risk]
  M --> T[Japanese Acquisition With Asian Distribution + Brand Preservation]
  N --> U[PE Roll-Up Into Multi-Brand Portfolio With Operational Efficiency Push]
  O --> V[Employee Ownership Preserving Brand Independence + Founder Liquidity]
  P --> W[Local Investor Continuity With Founder Transition + Brand Preservation]
  Q --> X[Asset Liquidation Plus Equipment Auction + Lease Assignment + Inventory Disposition]
\`\`\`

`;

const src = `

## Sources

1. **Brewers Association (BA, brewersassociation.org)** -- Primary industry trade association publishing annual craft brewery count, volume share, economic impact, style trends. Defines microbrewery (<15K bbl), regional craft, and "craft" independence requirement. https://www.brewersassociation.org
2. **Brewbound (brewbound.com)** -- Dominant beer industry trade news + M&A tracking + brewery closure data. https://www.brewbound.com
3. **Beer Marketer's Insights (beerinsights.com)** -- Industry data + volume tracking + distributor analytics. https://www.beerinsights.com
4. **TTB Tax and Trade Bureau (ttb.gov)** -- Federal Brewer's Notice application + Craft Beverage Modernization Act CBMA federal excise tax + quarterly reporting. https://www.ttb.gov
5. **TTB Permits Online (permitsonline.ttb.gov)** -- Brewer's Notice application portal. https://www.ttbonline.gov/permitsonline
6. **Craft Beverage Modernization Act CBMA (ttb.gov/craft-beverage-modernization-act)** -- $3.50/bbl first 60K bbl federal excise permanent post-2020. https://www.ttb.gov/craft-beverage-modernization-act
7. **Strike Kerr & Johns (strikekerrandjohns.com)** -- Beverage law firm specializing in TTB + state ABC + distributor agreements. https://www.strikekerrandjohns.com
8. **Lehrman Beverage Law (bevlaw.com)** -- TTB + brewery licensing + label approval law firm. https://www.bevlaw.com
9. **McDermott Will & Emery beverage practice** -- Alcohol beverage regulatory + M&A practice. https://www.mwe.com
10. **Hinman & Carmichael LLP (beveragelaw.com)** -- Alcohol beverage law specialists CA + national. https://www.beveragelaw.com
11. **GrayRobinson alcohol practice** -- Florida + national alcohol beverage law firm. https://www.gray-robinson.com
12. **Live Oak Bank brewery lending (liveoakbank.com)** -- Dominant SBA 7(a) brewery lender ~30-40% market share. https://www.liveoakbank.com
13. **Newtek SBA (newtekbusinessservices.com)** -- SBA 7(a) + 504 brewery lender. https://www.newtekone.com
14. **Celtic Bank SBA (celticbank.com)** -- SBA brewery + small business lender. https://www.celticbank.com
15. **Yakima Chief Hops (yakimachief.com)** -- Dominant US hop supplier + variety origination (Citra + Mosaic + many others). https://www.yakimachief.com
16. **John I. Haas / Barth-Haas (barthhaas.com)** -- Global hop trader + Hopsteiner partnership. https://www.barthhaas.com
17. **Hopsteiner (hopsteiner.com)** -- Hop merchant + variety development. https://www.hopsteiner.com
18. **Crosby Hop Farm (crosbyhops.com)** -- Pacific Northwest hop farm + supplier. https://www.crosbyhops.com
19. **Roy Farms (royfarms.com)** -- Hop farm Pacific Northwest. https://www.royfarms.com
20. **Country Malt Group (countrymaltgroup.com)** -- Largest US malt distributor (Boortmalt + Soufflet partnerships). https://www.countrymaltgroup.com
21. **Brewers Supply Group BSG (bsgcraft.com)** -- Malt + hops + yeast + ingredient distributor. https://www.bsgcraft.com
22. **Briess Malt & Ingredients (brewingwithbriess.com)** -- Specialty malt producer + craft brewing supplier. https://www.brewingwithbriess.com
23. **Great Western Malting (greatwesternmalting.com)** -- Malt producer Pacific Northwest. https://www.greatwesternmalting.com
24. **Rahr Malting (rahr.com)** -- Major US malt producer + supplier. https://www.rahr.com
25. **White Labs (whitelabs.com)** -- Dominant liquid yeast supplier for craft brewing. https://www.whitelabs.com
26. **Wyeast Laboratories (wyeastlab.com)** -- Liquid yeast supplier + bacteria cultures. https://www.wyeastlab.com
27. **Imperial Yeast (imperialyeast.com)** -- Pitch-ready liquid yeast supplier. https://www.imperialyeast.com
28. **Omega Yeast (omegayeast.com)** -- Liquid yeast supplier + specialty strains. https://www.omegayeast.com
29. **GigaYeast (gigayeast.com)** -- Liquid yeast supplier. https://www.gigayeast.com
30. **Lallemand Brewing (lallemandbrewing.com)** -- Dry yeast supplier (LalBrew). https://www.lallemandbrewing.com
31. **DME Brewing Solutions (dme.ca)** -- Mid-size brewhouse equipment manufacturer. https://www.dme.ca
32. **GW Kent (gwkent.com)** -- Brewhouse + cellar + packaging equipment supplier. https://www.gwkent.com
33. **Premier Stainless Systems (premierstainless.com)** -- Brewhouse + fermenter manufacturer. https://www.premierstainless.com
34. **Specific Mechanical Systems (specific.com)** -- Brewhouse + fermenter manufacturer Pacific Northwest. https://www.specific.com
35. **Stout Tanks and Kettles (stouttanks.com)** -- Nano + small brewhouse equipment. https://www.stouttanks.com
36. **Spike Brewing (spikebrewing.com)** -- Homebrew + nano brewhouse equipment. https://www.spikebrewing.com
37. **SS Brewtech (ssbrewtech.com)** -- Nano + small brewing equipment. https://www.ssbrewtech.com
38. **Psycho Brew (psychobrew.com)** -- Custom nano + small brewhouse manufacturer. https://www.psychobrew.com
39. **AAA Metal Fabrication (aaametalfabrication.com)** -- Brewhouse + tank manufacturer. https://www.aaametalfabrication.com
40. **Newlands Systems (newlandssystems.com)** -- Brewhouse manufacturer. https://www.newlandssystems.com
41. **GEA Brewery (gea.com)** -- Large-scale brewing equipment + global supplier. https://www.gea.com
42. **Krones Brewing (krones.com)** -- Large brewhouse + packaging equipment. https://www.krones.com
43. **Ziemann Holvrieka (ziemann-holvrieka.com)** -- Large brewhouse equipment. https://www.ziemann-holvrieka.com
44. **Wild Goose Filling (wildgoosefilling.com)** -- Dominant small-craft canning line manufacturer. https://www.wildgoosefilling.com
45. **Cask Brewing Systems (cask.com)** -- Canning + kegging equipment manufacturer. https://www.cask.com
46. **Codi Manufacturing (codimfg.com)** -- Canning line manufacturer mid-size craft. https://www.codimfg.com
47. **Pneumatic Scale Angelus PSA (pneumaticscale.com)** -- Higher-speed canning + packaging lines. https://www.pneumaticscale.com
48. **Crown Holdings aluminum cans (crowncork.com)** -- Aluminum beverage can manufacturer. https://www.crowncork.com
49. **Ball Corporation aluminum cans (ball.com)** -- Aluminum beverage can manufacturer (dominant craft can supplier). https://www.ball.com
50. **G3 Enterprises (g3enterprises.com)** -- Beverage closures + cork + capsule supplier. https://www.g3enterprises.com
51. **Anton Paar (anton-paar.com)** -- Density meter + Alcolyzer + brewing QC instruments. https://www.anton-paar.com
52. **Mettler-Toledo (mt.com)** -- Lab instruments + brewing QC equipment. https://www.mt.com
53. **Ekos (ekos.com)** -- Production management software for craft breweries (most popular ERP for small-mid craft). https://www.ekos.com
54. **Beer30 / 5th Ingredient (5thingredient.com)** -- Brewery production management software. https://www.5thingredient.com
55. **OrchestratedBeer (orchestratedbeer.com)** -- Brewery management ERP. https://www.orchestratedbeer.com
56. **Vicinity Brew (vicinitybrew.com)** -- Brewery ERP + production planning. https://www.vicinitybrew.com
57. **Toast for Brewery (pos.toasttab.com)** -- Restaurant + bar POS popular with breweries. https://pos.toasttab.com
58. **Square for Restaurants (squareup.com/us/en/point-of-sale/restaurants)** -- POS + payments popular with breweries. https://squareup.com
59. **Arryved POS (arryved.com)** -- Craft brewery-specialty POS + tap list integration. https://www.arryved.com
60. **Lightspeed Restaurant (lightspeedhq.com)** -- Restaurant + bar POS. https://www.lightspeedhq.com
61. **Untappd for Business (untappd.com/business)** -- Craft beer loyalty + check-in + tap list publishing. https://www.untappd.com/business
62. **Reyes Beverage Group (reyesbeveragegroup.com)** -- ~$10B revenue dominant US beer distributor (IL, CA, FL, DC, others). https://www.reyesbeveragegroup.com
63. **Republic National Distributing Company RNDC (rndc-usa.com)** -- ~$10B beer + wine + spirits distributor. https://www.rndc-usa.com
64. **Breakthru Beverage Group (breakthrubev.com)** -- ~$6B+ beer + wine + spirits distributor. https://www.breakthrubev.com
65. **Manhattan Beer Distributors (manhattanbeer.com)** -- NY metro dominant beer distributor. https://www.manhattanbeer.com
66. **Columbia Distributing (coldist.com)** -- Pacific Northwest beer distributor. https://www.coldist.com
67. **Ben E. Keith Beer Division (benekeith.com)** -- Texas dominant beer distributor. https://www.benekeith.com
68. **Sheehan Family Companies (sheehanfamily.com)** -- Northeast beer distributor family. https://www.sheehanfamily.com
69. **Wefunder (wefunder.com)** -- Reg CF crowdfunding platform popular with breweries. https://www.wefunder.com
70. **Republic crowdfunding (republic.com)** -- Reg CF crowdfunding platform. https://www.republic.com
71. **StartEngine (startengine.com)** -- Reg CF + Reg A+ crowdfunding platform. https://www.startengine.com
72. **Great American Beer Festival GABF (greatamericanbeerfestival.com)** -- Dominant US craft beer event Denver 60K attendees + 800+ breweries. https://www.greatamericanbeerfestival.com
73. **World Beer Cup (worldbeercup.org)** -- BA international beer competition. https://www.worldbeercup.org
74. **Craft Brewers Conference CBC (craftbrewersconference.com)** -- BA annual trade show. https://www.craftbrewersconference.com
75. **First Beverage Group (firstbev.com)** -- Beverage M&A advisory firm. https://www.firstbev.com

`;

const num = `

## Numbers & Benchmarks

### Industry size, segment & operator landscape

| Metric | 2024-2026 Value | Source |
|---|---|---|
| US craft brewery count | ~9,500-9,800 | BA + Brewbound + Beer Marketer's Insights |
| US craft brewery count 2019-2022 peak | ~9,700-10,200 | BA |
| Craft volume | 23-25M bbl annually | BA |
| Craft share of total US beer | ~13% | BA (total US ~190M bbl) |
| Industry retail dollar sales | $28B-$30B | BA |
| Craft volume 2022 growth | -1% | BA |
| Craft volume 2023 growth | -1.6% | BA |
| Craft volume 2024 growth (estimated) | -2% | BA |
| % Of craft breweries producing <1,000 bbl | ~75% | BA |
| Median brewery output | 750-1,200 bbl/year | BA + Brewbound |
| Average new openings/year 2023-2024 | ~400-500 | BA + Brewbound |
| Average closings/year 2023-2024 | ~450-550 | BA + Brewbound |
| Saturated craft hub breweries per million population | 200+ /M (Denver, Portland OR, Asheville, Bend, Grand Rapids, Austin) | BA |
| Federal excise tax small brewer | $3.50/bbl first 60,000 bbl | CBMA permanent post-2020 |
| Federal excise tax above small-brewer threshold | $16/bbl 60K-2M, $18/bbl >6M | TTB |

### Self-distribution thresholds by state

| State | Self-Distribution Volume Cap | Taproom Sales | Notes |
|---|---|---|---|
| Texas | 75,000 bbl | Yes | Recent statutory expansion |
| California | 60,000 bbl | Yes | Type 23 small beer manufacturer |
| New York | 75,000 bbl | Yes | Farm brewery + microbrewery licenses |
| Florida | No hard cap | Yes | Brewery direct to retailer allowed |
| Colorado | 1.5M bbl effectively | Yes | Brewery-friendly state |
| Oregon | No hard cap | Yes | Brewery direct to retailer allowed |
| Washington | No hard cap | Yes | Brewery direct sales permitted |
| Pennsylvania | No hard cap | Yes | Direct brewery sales + limited distribution |
| Mississippi | 60,000 bbl | Yes | Opened up 2017 |
| Alabama | 60,000 bbl | Yes | Opened up 2009-2018 |
| Tennessee | 25,000 bbl | Yes | Opened up 2017+ |
| Utah | Low-ABV restricted historical | Yes (DSP-required >3.2%) | Restrictive but evolving |

### Brewhouse format selection by size and capital

| Brewhouse Size | Brewhouse Cost | Annual Production Cap | Best For |
|---|---|---|---|
| Nano 1-3 bbl | $40K-$120K used/new | 200-800 bbl | Taproom-only neighborhood + experimentation |
| Small 3-7 bbl | $120K-$280K | 800-2,500 bbl | Taproom-led + minimal distribution |
| Production 7-15 bbl | $250K-$650K | 2,500-7,000 bbl | Most common production microbrewery |
| Regional 15-30 bbl | $600K-$1.4M | 7,000-25,000 bbl | Regional craft with distribution |
| Large craft 30-60 bbl | $1.2M-$2.8M | 25,000-60,000 bbl | Established regional brand expansion |
| Industrial 60+ bbl | $2.5M-$8M+ | 60,000-300,000 bbl | Large craft + multi-brand |

### Fermentation, bright, glycol, packaging equipment

| Equipment | Cost Range | Notes |
|---|---|---|
| Unitank fermenter 7 bbl | $14K-$28K | Premier/GW Kent/Spike |
| Unitank fermenter 15 bbl | $20K-$38K | Premier/GW Kent/AAA |
| Unitank fermenter 30 bbl | $28K-$55K | Premier/AAA/Specific Mechanical |
| Unitank fermenter 60 bbl | $45K-$85K | Specific/AAA/JV Northwest |
| Bright tank 7-15 bbl | $14K-$38K | Same suppliers |
| Glycol chiller 5-10 ton | $25K-$55K | G&D Chillers/Pro Refrigeration |
| Glycol chiller 10-25 ton | $45K-$95K | G&D Chillers/Pro Refrigeration |
| Grain mill (RMS Roller Mills/Apollo) | $4K-$18K | RMS dominant |
| Wild Goose canning line entry | $200K-$500K | 25-65 cpm |
| Wild Goose canning line higher-speed | $500K-$900K | 80-200 cpm |
| Cask Brewing canning | $250K-$650K | 25-100 cpm |
| Codi Manufacturing canning | $300K-$800K | 50-150 cpm |
| Pneumatic Scale Angelus larger format | $600K-$1.5M+ | 200-500 cpm |
| QC lab basic (pH + DO + density + microbiology) | $25K-$80K | Anton Paar + Mettler-Toledo |
| QC lab with Alcolyzer (ABV) | $50K-$125K | Adds Anton Paar Alcolyzer |
| Walk-in cooler 800-2,000 sqft | $25K-$95K | Polar King/Bally/local refrigeration |

### Startup capital stack by format and configuration

| Configuration | Total Capital | Build-Out | Equipment | Working Capital |
|---|---|---|---|---|
| Nano 1-3 bbl + small taproom | $400K-$900K | $150K-$400K | $100K-$280K | $150K-$220K |
| Small 3-7 bbl + small taproom | $650K-$1.5M | $300K-$700K | $200K-$450K | $150K-$350K |
| Production 7-15 bbl + full taproom | $1.2M-$3.5M | $700K-$2.0M | $400K-$1.0M | $200K-$500K |
| Regional 15-30 bbl + destination taproom + distribution | $3.5M-$9M+ | $1.8M-$4.5M | $1.0M-$3.5M | $500K-$1.0M |
| Contract brewing brand-only | $50K-$300K | None | None | $50K-$300K |
| Acquisition of existing brewery | $750K-$8M | Existing | Existing | Varies |

### Revenue mix at mature taproom-led brewery

| Revenue Stream | % Of Revenue | Gross Margin |
|---|---|---|
| Taproom pints + flights + crowlers/howlers | 50-65% | 70-78% |
| Taproom merchandise + apparel | 4-8% | 45-58% |
| Taproom food revenue (markup on truck/in-house) | 4-12% | 35-55% |
| Self-distribution kegs (where state permits) | 12-20% | 35-45% |
| Self-distribution cans (where state permits) | 4-10% | 30-40% |
| Wholesale through distributor | 5-15% | 25-35% |

### COGS structure per barrel

| Cost Line | Per Barrel Range | Notes |
|---|---|---|
| Malt + grain | $14-$32 | Country Malt/BSG/Briess |
| Hops | $8-$45 | Heavy variance: low-IBU lager vs hop-bomb IPA |
| Yeast + adjuncts | $4-$18 | White Labs/Wyeast + specialty additions |
| Water + utilities | $6-$15 | Brewery water + glycol + electrical + gas |
| Packaging (cans + closures + labels + trays) | $55-$120 if canned | Crown/Ball $0.15-$0.22/can |
| Federal excise tax small brewer | $3.50/bbl first 60K | CBMA |
| State excise tax | $1.20-$8.50/bbl | State variation |
| **Total Raw COGS per Barrel** | **$45-$95 unpacked / $100-$215 canned** | |

### Sales metrics by brewery size

| Annual Production | Annual Revenue Range | Average Revenue per Barrel | Typical EBITDA Margin |
|---|---|---|---|
| 400-1,200 bbl (taproom-only) | $400K-$1.2M | $1,000-$1,400 | Negative to 3% |
| 1,200-3,500 bbl (small distribution) | $1.0M-$2.8M | $750-$1,400 | 3-8% |
| 2,500-7,000 bbl (production microbrewery) | $2.0M-$5.5M | $700-$1,400 | 8-14% |
| 7,000-25,000 bbl (regional craft) | $5M-$22M | $600-$1,200 | 10-16% |
| 25,000-60,000 bbl (large craft) | $20M-$60M | $500-$1,000 | 12-18% |

### Taproom economics

| Metric | Range | Notes |
|---|---|---|
| Average taproom ticket per visitor | $14-$32 | Pint $6-$10 + flight $10-$18 + crowler $14-$20 |
| Taproom pint average price | $6-$10 | Higher for specialty/imperial |
| Taproom revenue per sqft annually | $400-$900 | For mature taproom-led brewery |
| Taproom gross margin | 70-78% | Includes COGS + glassware loss + spillage |
| Taproom labor as % of taproom revenue | 18-28% | Beertenders + manager + events |
| Taproom rent as % of total revenue | 8-15% | Lease cost spread across taproom + production |

### Staff economics

| Role | Annual Compensation | Notes |
|---|---|---|
| Head brewer | $55K-$95K + benefits | Often founder for first 3-5 years |
| Assistant brewer | $40K-$55K + benefits | |
| Cellar/packaging operator | $38K-$52K | |
| Taproom manager | $45K-$70K + bonus | |
| Beertender | $15-$22/hr base + $50-$300/shift tips | Tipped position |
| Sales rep (distribution) | $55K-$95K base + commission + truck/expenses | |
| Marketing/events coordinator | $45K-$70K | Often combined role |
| GM/founder/operator | $0-$120K (often deferred Years 1-3) | |

### Distribution + distributor economics

| Channel | Brewery Net Per Keg | Notes |
|---|---|---|
| Self-distribution direct to retail (half-barrel 15.5 gal) | $135-$210 | After rep + truck costs |
| Distributor wholesale (half-barrel) | $80-$130 | After distributor margin 25-30% |
| Self-distribution case 4/6-pack 16oz cans | $25-$42 | After rep costs |
| Distributor wholesale case | $14-$24 | After distributor margin |
| Brewery taproom pint (16oz pour) | $6.50-$10 | Per pour |
| Brewery taproom flight (4x 5oz) | $10-$18 | Higher margin per oz vs pint |
| Brewery taproom crowler (32oz to-go) | $14-$20 | Filled to order |

### Five-year cash-flow trajectory: production 7-15 bbl brewery

| Year | Annual Bbl | Annual Revenue | Annual EBITDA | EBITDA Margin |
|---|---|---|---|---|
| Year 1 lease-up + brand build | 400-1,200 | $400K-$1.2M | -$100K to +$50K | Negative-3% |
| Year 2 velocity | 1,200-3,000 | $1.0M-$2.5M | +$50K-$200K | 4-8% |
| Year 3 stabilization | 2,500-5,500 | $2.0M-$4.5M | +$180K-$540K | 9-12% |
| Year 4 mature single | 3,500-7,000 | $2.8M-$5.5M | +$300K-$770K | 11-14% |
| Year 5 mature + expansion | 4,500-8,500 | $3.6M-$6.5M | +$430K-$980K | 12-15% |

### Capital stack interest rates and lender categories

| Capital Layer | Loan-To-Value | Interest Rate 2024-2025 | Typical Lenders |
|---|---|---|---|
| SBA 7(a) senior loan | 70-85% LTV | Prime + 2.5-4.5% floating | Live Oak, Newtek, Celtic, Wells Fargo SBA, Byline |
| SBA 504 owner-user senior | 50% LTC | 7.0-8.5% fixed | Local bank + Live Oak |
| SBA 504 debenture | 40% LTC | 6.5-7.5% fixed 25 year | SBA via CDC |
| Equipment finance/lease 5-7 year | 80-100% of cost | 8-14% effective | North Mill, Channel Partners, Crest Capital, AP Equipment Finance, US Bank EF |
| Friends + family equity (convertible notes/SAFE) | N/A | N/A | Founder network |
| Crowdfunding (Reg CF) | N/A | N/A | Wefunder, Republic, StartEngine |
| Local angel/micro-VC | N/A | N/A | Regional angel groups + family offices |

### Exit multiples by buyer type

| Exit Path | Buyer Type | Cap Multiple | Process Length | Best For |
|---|---|---|---|---|
| Macro strategic acquisition | AB-InBev/Heineken/Molson Coors/Boston Beer | 8-15x EBITDA historical (compressed post-2017) | 9-18 months | Regional brand 50K+ bbl + clean cap table |
| Japanese strategic acquisition | Lion (Kirin)/Sapporo/Mahou San Miguel | 6-12x EBITDA | 9-15 months | Regional craft + Asian-export potential |
| PE/portfolio aggregator | Canarchy/Tilray/Wagner/family-office PE | 5-9x EBITDA | 6-12 months | 5K-30K bbl regional craft |
| ESOP transition | Employee Stock Ownership Plan | 4-7x EBITDA structured | 12-24 months | Mature operator + culture preservation |
| Family-office or local sale | Local investor / regional family | 3-7x EBITDA | 4-9 months | $2M-$25M small-craft brewery |
| Wind-down / asset sale | Equipment auction + lease assignment | Asset value only | 60-180 days | Distressed or exhausted operator |

`;

const counter = `

## Counter-Case: When Microbrewery Is A Bad Bet

A serious microbrewery founder must stress-test the case above against the conditions that make this category a difficult bet in 2027. The full 12-element counter-case:

**(1) Craft volume decline 2022-2024 first multi-year drop in 40+ years.** BA reports craft volume **-1% 2022 + -1.6% 2023 + estimated -2% 2024**. After 30+ years of growth, the category is contracting. **Net new brewery openings turned negative 2023-2024** -- more breweries closing than opening. If you require category tailwind to succeed, **do not enter**. Only enter if your differentiation is strong enough to take share in a flat-to-declining market.

**(2) Hard seltzer cannibalization 2019-2022.** White Claw + Truly + Bud Light Seltzer + High Noon pulled **8-15% of craft drinkers** to seltzer occasions 2019-2022. Seltzer growth peaked 2021 but the cannibalization is permanent -- those occasion-level switches did not fully return to craft beer. Hard tea (Twisted Tea, Surfside, Loverboy) and ready-to-drink (RTD) cocktails continue eroding craft occasions.

**(3) Gen Z lower alcohol consumption + THC beverages + non-alc growth.** Gen Z (born 1997-2012) consumes alcohol **20-30% less** than millennials at same age. THC beverages (Cann + Wyld + Pamos + Wynk) growing **40-80% annually** in legal states. Non-alc beer (Athletic Brewing + Brewdog AF + Heineken 0.0 + Lagunitas IPNA) growing 20-40% annually. Mocktails + functional sodas (Olipop + Poppi + Recess) eating share. **18-29 demographic alcohol spend declining 12-22% 2018-2024**.

**(4) Tap-handle saturation in major markets.** **Denver + Portland OR + Asheville + San Diego + Bend OR + Grand Rapids + Greenville SC + Austin** have **200+ breweries per million population** -- historically unprecedented density. New entrants in these markets face **impossible draft-line distribution** + **commoditized taproom experience** + **saturated weekend traffic competition**. Locate elsewhere or accept low odds.

**(5) Distributor consolidation creating moat.** **Reyes Beverage Group $10B + Republic National Distributing + Breakthru Beverage + Manhattan Beer + Columbia Distributing + Ben E. Keith** control **65-80% of US beer distribution**. New brand placement is gated by these distributors -- **months-to-years of relationship-building + brand activation budgets + festival sponsorships + retailer incentives** to earn placement. Self-distribution is the workaround where state law permits, but operationally heavy.

**(6) AB-InBev / Molson Coors / Constellation counter-pressure.** AB-InBev acquired **Goose Island 2011, Blue Point 2014, 10 Barrel 2014, Elysian 2015, Golden Road 2015, Four Peaks 2015, Devils Backbone 2016, Wicked Weed 2017 (industry backlash), Karbach 2016**. Molson Coors acquired Saint Archer 2015 (resold 2020). Constellation Brands acquired Ballast Point $1B 2015 (resold 2019). These acquired brands compete with independent craft + macros also launched **craft-style brand proliferation** (Michelob Ultra Pure Gold, Blue Moon variants, Shock Top, Coors Banquet retro positioning) that dilute the category.

**(7) Aluminum can shortages + cost inflation 2020-2022.** Aluminum 16oz can cost rose from **$0.08-$0.12 to $0.15-$0.22** during 2020-2022 supply disruption. Cans + crown closures + tray board + label cost still **40-60% above 2019 baseline 2024**. For canned-product breweries, packaging cost has compressed gross margins 8-15 percentage points.

**(8) Glycol + hops + malt cost inflation 30-60% 2021-2024.** Hop spot prices for popular varietals (Citra, Mosaic, Galaxy) up **30-50% 2021-2024**. Malt up **30-50%** with European barley shortage + drought. Glycol coolant up **30-60%**. Electrical + natural gas + water utility cost up **15-30%**. Raw COGS per barrel up **25-45% 2021-2024** with limited ability to pass through to consumers in a declining category.

**(9) ESG/sustainability pressure.** **Water usage 5-7 bbl water per 1 bbl beer** standard for brewing -- under increasing scrutiny in drought-affected states (CA + AZ + CO + UT + ID + western NM/TX). **Spent grain waste disposal** + **wastewater discharge BOD/COD treatment** + **carbon emissions** all face emerging regulation + customer scrutiny. ESG reporting starting to be requested by larger retailers + distributors for shelf placement.

**(10) ABV mislabeling lawsuits + TTB enforcement.** Multiple class-action lawsuits 2022-2025 targeting craft breweries for **ABV labeling deviation beyond TTB tolerances** (typically ±0.3% absolute). Bottling lines + canning runs without proper Alcolyzer calibration produce **batch-to-batch variation** that triggers lawsuits + reputation damage + TTB enforcement actions including license suspension. QC lab investment is non-negotiable.

**(11) Untappd review-bombing + social media reputation risk.** Coordinated negative reviews from **competing breweries + amateur critics + offended community members + employee disputes** can tank ratings overnight. Untappd review average affects retailer-buyer perception + Untappd-discovery-driven new-customer acquisition. Reputation management requires **active monitoring + response + community engagement** -- without it, a single viral controversy can permanently damage the brand.

**(12) Capital intensity vs adjacent food-beverage businesses.** $650K-$9M+ per microbrewery is comparable to opening a restaurant or fast-casual chain -- without restaurant's daily lunch + dinner cash flow or franchise system scalability. Adjacent businesses that may fit better: **coffee shop/roastery** ($150K-$500K capital + daily cash flow + faster breakeven), **distillery + tasting room** (similar capital structure but higher margin spirits + longer aging cycle), **cidery** (similar craft positioning + smaller production footprint), **winery/urban winery** (premium pricing + aging-asset positioning), **non-alc craft beverage** (Olipop + Athletic Brewing growing fast), or **food truck/QSR/fast-casual restaurant** (lower capital + faster cash flow). The microbrewery passion premium does not always justify the capital intensity + category headwinds.

**Honest verdict.** Microbrewery remains a viable + meaningful entrepreneurial path in 2027 if you (a) bring **measurable brand + brewing + experience differentiation** -- not "we like beer and our friends say it's good"; (b) **locate in a growing rather than saturated craft market** (50-150 breweries per million population sweet spot, not 200+); (c) underwrite **12-24 month TTB + state ABC + zoning + build-out timeline** without compressing; (d) **size brewhouse to demand + expand later**, not over-build for hypothetical scale (most failures over-build then can't fill fermenters); (e) plan **disciplined capital stack with SBA 7(a) from Live Oak + equipment finance + friends-and-family + minimal speculative debt**; (f) commit to **taproom experience design + non-beer revenue + community programming** as the economic engine (60-75% of revenue at 70-78% margin); (g) implement **professional QC discipline from day 1** (pH + DO + density + microbiology + sensory + Alcolyzer eventually) to avoid lawsuits + off-flavor reputation damage; and (h) plan **realistic exit early** (independent hold + family-office sale + ESOP > macro acquisition rare since 2017 backlash). If you cannot honestly check most of these -- particularly differentiation + market selection + taproom experience -- the macro economics of the 2027 craft category will eventually grind down the operation regardless of how passionate the brewer is about hops + yeast + tradition.

`;

const links = `

## Related Pulse Entries

- [[q9663]] -- How do you start a self-storage facility business in 2027? (sibling: capital-intensive specialty CRE + zoning + entitlement + state-by-state regulation parallel)
- [[q9662]] -- How do you start a mobile IV therapy clinic in 2027? (sibling: licensing + state regulation framework parallel)
- [[q9661]] -- How do you start a veterinary clinic in 2027? (sibling: facility build-out + zoning + workforce parallel)
- [[q9660]] -- How do you start a direct primary care DPC clinic in 2027? (sibling: facility-based recurring-revenue + brand-driven)
- [[q9659]] -- How do you start a med spa in 2027? (sibling: facility build-out + zoning + ICC compliance + community-experience parallel)
- [[q9658]] -- Recent service-business launch entry (NEW STRUCTURE sibling)
- [[q9657]] -- How do you start a home health agency in 2027? (sibling: workforce + insurance framework)
- [[q9656]] -- How do you start a hospice care agency in 2027? (sibling: workforce + state licensure framework)
- [[q9655]] -- How do you start a skilled nursing facility in 2027? (sibling: specialty CRE + state licensure parallel)
- [[q9653]] -- How do you start a memory care facility in 2027? (sibling: specialty CRE + state licensure)
- [[q9650]] -- How do you start an assisted living facility in 2027? (sibling: specialty CRE + state licensure parallel)
- [[q9630]] -- How do you start a senior in-home care service in 2027? (sibling: workforce + insurance framework)
- [[q9628]] -- Recent service-business launch entry (NEW STRUCTURE sibling)
- [[q9629]] -- Recent service-business launch entry (NEW STRUCTURE sibling)
- [[q9620]] -- How do you start a palliative care service in 2027? (sibling: workforce framework)
- [[q9601]] -- How do you set up a fractional CFO operation? (operational backbone applicable to multi-location brewery + multi-state distribution financial reporting + cash management + COGS tracking)
- [[q9576]] -- How do you start an adult coding bootcamp in 2027? (sibling: state regulation + customer acquisition)
- [[q2117]] -- How do you start a post-construction cleanup business? (adjacent service business framework)
- [[q1975]] -- How do you start a daycare in 2027? (sibling: facility + state licensure + zoning parallel)
- [[q1965]] -- How do you start a party rental business in 2027? (sibling: storage + logistics)
- [[q1966]] -- How do you start a bounce house rental business in 2027? (sibling: storage + warehouse + logistics)
- [[q1962]] -- How do you start a glamping business in 2027? (sibling: hospitality CRE + experiential consumption parallel)
- [[q1954]] -- How do you start a property management business in 2027? (Q&A baseline format sibling)
- [[q1953]] -- How do you start a virtual assistant business in 2027? (Q&A baseline format sibling)
- [[q1952]] -- How do you start a podcast network in 2027? (Q&A baseline format sibling)
- [[q1951]] -- How do you start a meal prep business in 2027? (Q&A baseline format sibling)
- [[q1950]] -- How do you start a yoga studio in 2027? (Q&A baseline format sibling)
- [[q1949]] -- How do you start a personal training business in 2027? (Q&A baseline format sibling)
- [[q1948]] -- How do you start a dog walking business in 2027? (Q&A baseline format sibling)
- [[q1947]] -- How do you start a notary business in 2027? (Q&A baseline format sibling)
- [[q1946]] -- How do you start a tutoring business in 2027? (Q&A baseline format sibling)
- [[q1942]] -- How do you start a service business in 2027? (Q&A baseline format sibling)
- [[q1139]] -- Adjacent service business operating framework
- [[q1127]] -- Adjacent service business operating framework

`;

const tags = ['microbrewery','craft-brewery','craft-beer','taproom','beer-distribution','ttb-brewers-notice','brewers-association','three-tier-system','sba-7a','2027'];

const sources = [
  { title: 'Brewers Association (BA)', url: 'https://www.brewersassociation.org' },
  { title: 'Brewbound craft beer industry news', url: 'https://www.brewbound.com' },
  { title: 'TTB Brewer\'s Notice + Craft Beverage Modernization Act', url: 'https://www.ttb.gov' },
  { title: 'Live Oak Bank brewery SBA lending', url: 'https://www.liveoakbank.com' },
  { title: 'Yakima Chief Hops', url: 'https://www.yakimachief.com' },
  { title: 'Wild Goose Canning', url: 'https://www.wildgoosefilling.com' },
  { title: 'Untappd for Business', url: 'https://www.untappd.com/business' }
];

const notes = {
  s6: 'Added 75 cited sources spanning industry trade (Brewers Association BA + Brewbound + Beer Marketer\'s Insights), federal regulation (TTB Tax and Trade Bureau + TTB Permits Online + Craft Beverage Modernization Act CBMA federal excise $3.50/bbl first 60K bbl permanent post-2020), alcohol beverage law (Strike Kerr & Johns + Lehrman Beverage Law + McDermott Will & Emery beverage + Hinman & Carmichael + GrayRobinson alcohol practice), SBA lenders (Live Oak Bank dominant brewery SBA ~30-40% market share + Newtek + Celtic Bank), hops (Yakima Chief Hops dominant US hop supplier + John I. Haas Barth-Haas global + Hopsteiner + Crosby Hop Farm + Roy Farms PNW), malt (Country Malt Group largest distributor + Brewers Supply Group BSG + Briess Malt + Ingredients + Great Western Malting + Rahr Malting), yeast (White Labs dominant liquid yeast + Wyeast Laboratories + Imperial Yeast + Omega Yeast + GigaYeast + Lallemand dry LalBrew), brewhouse equipment (DME Brewing Solutions + GW Kent + Premier Stainless Systems + Specific Mechanical Systems + Stout Tanks and Kettles nano + Spike Brewing + SS Brewtech + Psycho Brew custom + AAA Metal Fabrication + Newlands Systems + GEA Brewery large-scale + Krones Brewing + Ziemann Holvrieka), packaging (Wild Goose Filling dominant small-craft canning + Cask Brewing Systems + Codi Manufacturing + Pneumatic Scale Angelus PSA larger-format + Crown Holdings aluminum cans + Ball Corporation cans + G3 Enterprises closures), QC lab (Anton Paar density + Alcolyzer + Mettler-Toledo lab instruments), brewery ERP/software (Ekos dominant production management + Beer30 5th Ingredient + OrchestratedBeer + Vicinity Brew), POS (Toast for Brewery + Square for Restaurants + Arryved craft brewery-specialty + Lightspeed Restaurant + Untappd for Business loyalty), distributors (Reyes Beverage Group ~$10B dominant + Republic National Distributing RNDC ~$10B + Breakthru Beverage Group ~$6B + Manhattan Beer Distributors NY metro + Columbia Distributing PNW + Ben E. Keith Texas + Sheehan Family Northeast), crowdfunding (Wefunder + Republic + StartEngine Reg CF $100K-$5M), events (Great American Beer Festival GABF Denver 60K attendees + World Beer Cup + Craft Brewers Conference CBC trade show), M&A advisory (First Beverage Group).',
  s7: 'Added comprehensive numbers block with 14 markdown pipe tables covering: industry size and operator landscape (US ~9,500-9,800 craft breweries down from 2019-2022 peak ~9,700-10,200 + 23-25M craft bbl ~13% of US beer ~190M bbl + $28B-$30B retail dollar sales + craft volume -1% 2022 + -1.6% 2023 + -2% 2024 estimated first multi-year decline 40+ years + ~75% produce <1,000 bbl + median 750-1,200 bbl/yr + 400-500 openings vs 450-550 closings + saturated craft hubs 200+/M Denver/Portland/Asheville/Bend/Grand Rapids/Austin + federal excise $3.50/bbl first 60K + $16/bbl thereafter); self-distribution thresholds by state (TX 75K + CA 60K + NY 75K + FL unlimited + CO/OR/WA/PA brewery-friendly + MS/AL/TN opened 2017+ + UT restrictive); brewhouse format selection by size (nano 1-3 $40K-$120K + small 3-7 $120K-$280K + production 7-15 $250K-$650K + regional 15-30 $600K-$1.4M + large 30-60 $1.2M-$2.8M + industrial 60+ $2.5M-$8M+); fermentation/bright/glycol/packaging equipment (unitank 7 bbl $14K-$28K + 15 bbl $20K-$38K + 30 bbl $28K-$55K + 60 bbl $45K-$85K + bright tank + glycol chiller + grain mill + Wild Goose canning $200K-$500K entry to $500K-$900K higher-speed + Cask $250K-$650K + Codi $300K-$800K + Pneumatic Scale $600K-$1.5M+ + QC lab $25K-$80K basic to $50K-$125K with Alcolyzer + walk-in cooler); startup capital stack by 6 configurations (nano $400K-$900K + small $650K-$1.5M + production $1.2M-$3.5M + regional $3.5M-$9M+ + contract brewing $50K-$300K + acquisition $750K-$8M); revenue mix at mature taproom-led brewery (taproom pints 50-65% + merch 4-8% + food 4-12% + self-distrib kegs 12-20% + self-distrib cans 4-10% + distributor wholesale 5-15%); COGS structure per barrel (malt $14-$32 + hops $8-$45 + yeast $4-$18 + water/utilities $6-$15 + packaging $55-$120 if canned + federal excise $3.50 + state $1.20-$8.50 = $45-$95 unpacked or $100-$215 canned); sales metrics by brewery size (400-1,200 bbl $400K-$1.2M to 25K-60K bbl $20M-$60M); taproom economics (ticket $14-$32 + pint $6-$10 + rev/sqft $400-$900 + margin 70-78% + labor 18-28% + rent 8-15%); staff economics (head brewer $55K-$95K + assistant $40K-$55K + taproom manager $45K-$70K + beertenders $15-$22/hr + sales rep $55K-$95K); distribution + distributor economics (self-distrib keg $135-$210 vs distributor $80-$130 + self-distrib case $25-$42 vs distributor $14-$24 + taproom pint $6.50-$10 + flight $10-$18 + crowler $14-$20); 5-year cash-flow trajectory production 7-15 bbl brewery (Year 1 400-1,200 bbl $400K-$1.2M -$100K-+$50K EBITDA to Year 5 4,500-8,500 bbl $3.6M-$6.5M +$430K-$980K EBITDA 12-15%); capital stack interest rates 6 layers (SBA 7(a) Live Oak/Newtek/Celtic + SBA 504 owner-user + equipment finance North Mill/Channel/Crest 8-14% + friends + crowdfunding + angel); exit multiples 6 buyer types (macro AB-InBev/Heineken/Molson Coors 8-15x historical compressed + Japanese Lion/Sapporo/Mahou 6-12x + PE/aggregator Canarchy/Tilray 5-9x + ESOP 4-7x + family-office 3-7x + wind-down asset value only).',
  s8: 'Added 12-element counter-case: craft volume decline 2022-2024 first multi-year drop in 40+ years (-1% 2022 + -1.6% 2023 + -2% 2024 + net new openings turned negative do-not-enter if requiring tailwind); hard seltzer cannibalization 2019-2022 (White Claw + Truly + Bud Light Seltzer + High Noon pulled 8-15% of craft drinkers permanent occasion-level switches + hard tea Twisted Tea/Surfside/Loverboy + RTD cocktails continuing erosion); Gen Z lower alcohol consumption + THC beverages + non-alc growth (20-30% less alcohol consumption vs millennials + THC beverages Cann/Wyld/Pamos/Wynk growing 40-80% annually + non-alc beer Athletic/BrewDog AF/Heineken 0.0/Lagunitas IPNA growing 20-40% + mocktails + Olipop/Poppi/Recess functional sodas + 18-29 alcohol spend -12-22% 2018-2024); tap handle saturation major markets (Denver/Portland OR/Asheville/San Diego/Bend OR/Grand Rapids/Greenville SC/Austin 200+ breweries per million population historically unprecedented + impossible draft-line distribution + commoditized taproom + relocate elsewhere); distributor consolidation creating moat (Reyes Beverage Group $10B + RNDC + Breakthru + Manhattan Beer + Columbia + Ben E. Keith control 65-80% US beer distribution + months-to-years relationship-building + brand activation + festival sponsorships + retailer incentives + self-distribution workaround where state law permits); AB-InBev/Molson Coors/Constellation counter-pressure (AB-InBev Goose Island 2011/Blue Point 2014/10 Barrel 2014/Elysian 2015/Golden Road 2015/Four Peaks 2015/Devils Backbone 2016/Wicked Weed 2017 backlash/Karbach 2016 + Molson Coors Saint Archer 2015 resold 2020 + Constellation Ballast Point $1B 2015 resold 2019 + craft-style brand proliferation Michelob Ultra Pure Gold/Blue Moon/Shock Top dilute category); aluminum can shortages + cost inflation 2020-2022 ($0.08-$0.12 to $0.15-$0.22 per 16oz + cans/crowns/trays/labels 40-60% above 2019 + 8-15pp gross margin compression for canned breweries); glycol + hops + malt cost inflation 30-60% 2021-2024 (Citra/Mosaic/Galaxy 30-50% + malt 30-50% European barley drought + glycol 30-60% + utilities 15-30% + raw COGS per barrel 25-45% with limited pass-through in declining category); ESG sustainability pressure (5-7 bbl water per 1 bbl beer drought scrutiny CA/AZ/CO/UT/ID/western NM-TX + spent grain waste + wastewater BOD/COD + carbon emissions + ESG reporting starting from larger retailers); ABV mislabeling lawsuits + TTB enforcement (multiple class actions 2022-2025 targeting ±0.3% absolute tolerance deviation + bottling/canning without proper Alcolyzer calibration + lawsuits + reputation damage + TTB enforcement license suspension); Untappd review-bombing + social media reputation (coordinated negative reviews from competing breweries + amateur critics + offended community + employee disputes can tank ratings overnight + reputation management requires active monitoring + response + community engagement); capital intensity vs adjacent food-beverage businesses ($650K-$9M+ comparable restaurant/fast-casual without daily cash flow or franchise scalability + adjacent businesses coffee shop/roastery $150K-$500K daily cash flow + distillery higher margin spirits longer aging + cidery similar craft + winery aging-asset + non-alc Olipop/Athletic + food truck/QSR lower capital faster cash flow) -- with honest 8-condition verdict on who should and should not start a microbrewery in 2027.',
  s9: 'Cross-linked 33 related Pulse entries: q9663 self-storage (sibling capital-intensive specialty CRE + zoning + entitlement + state-by-state regulation parallel) + q9662 mobile IV + q9661 veterinary clinic (facility build-out + zoning + workforce parallel) + q9660 DPC (facility-based recurring-revenue brand-driven) + q9659 med spa (facility + zoning + ICC + community-experience parallel) + q9658/q9628/q9629 NEW STRUCTURE siblings + q9657 home health + q9656 hospice + q9655 SNF + q9653 memory care + q9650 assisted living (specialty CRE + state licensure parallel) + q9630 senior in-home + q9620 palliative (workforce framework) + q9601 fractional CFO (operational backbone for multi-location brewery + multi-state distribution financial reporting + cash management + COGS tracking) + q9576 adult coding bootcamp + q2117 post-construction cleanup + q1975 daycare + q1965/q1966 party rental/bounce house (storage + logistics) + q1962 glamping (hospitality CRE + experiential consumption parallel directly relevant to taproom-led microbrewery) + q1942/q1946-q1954 baseline Q&A format siblings + q1127/q1139 service business framework.',
  s10: 'SUBAGENT_VERIFIED. Lean deep baseline of the microbrewery (craft brewery) business startup playbook for 2027 matching the actual question "How do you start a microbrewery (craft brewery) business in 2027?" Built under NEW VALUE-NOT-WORDCOUNT MANDATE: target 8,000-10,500 words with tight paragraphs (2-3 sentences max), frequent H3 breaks, no walls of text. Structure: Bottom Line callout (3 punchy bullets Capital/Margins/Hardest part with bold-tag labels hitting site + TTB Brewer\'s Notice + state ABC + zoning + brewhouse format + Wild Goose canning + craft volume decline 2022-2024 + hard seltzer + Gen Z + tap handle saturation + distributor consolidation Reyes/RNDC/Breakthru + AB-InBev counter-pressure Wicked Weed 2017 controversy + aluminum cost inflation + glycol/hops/malt inflation + ESG water + ABV labeling + Untappd review-bombing + PSA-style brand operators Yuengling/Sierra Nevada/New Belgium Lion 2019/Stone Sapporo $165M 2022/Dogfish Head Boston Beer 2019 $300M/Bell\'s Lion 2021/Founders Mahou minority/Russian River/Other Half/Tree House/Trillium/Toppling Goliath/Cigar City Canarchy Monster Beverage $330M + ingredients Yakima Chief/John I Haas/Hopsteiner/Country Malt Group/BSG/Briess/White Labs/Wyeast/Imperial/Omega + equipment DME/GW Kent/Premier Stainless/Specific Mechanical/Stout Tanks/Spike Brewing/SS Brewtech/AAA + packaging Crown Holdings/Ball Corporation/Wild Goose/Cask/Codi/Pneumatic Scale/Krones + Anton Paar QC + Ekos Beer30 5th Ingredient OrchestratedBeer Vicinity Brew + Toast/Square/Arryved/Lightspeed POS + Untappd for Business + SBA 7(a) Live Oak Bank + equipment finance + Reg CF Wefunder/Republic/StartEngine + GABF Craft Brewers Conference World Beer Cup + collaboration releases + alcohol-beverage counsel Strike Kerr Johns/Lehrman Beverage Law/McDermott Will Emery/Hinman Carmichael/GrayRobinson), then 3 short paragraphs distinguishing microbrewery from brewpub (25%+ on-site food-dominant) + contract brewing (BrewDog Contract/Two Roads/Brew Hub/City Brewing no facility ownership) + gypsy/tenant brewing (Mikkeller US/Evil Twin/Pretty Things) + homebrew retail + craft-style brands owned by macros (Goose Island/Blue Moon/Shock Top/Leinenkugel/Elysian/10 Barrel/Devils Backbone lost BA craft status post-acquisition), then TOC block listing 13 H3 anchor links grouped under 4 PART super-headers, then 4 PART super-headers (Part 1 Foundations / Part 2 Build-Out & Capital / Part 3 Operations / Part 4 Growth & Exit) with horizontal rule separators, then LEAN H3 deep content sections inside each PART (3-4 sections per PART, tight 2-3 sentence paragraphs, no padding). flow contains exactly 2 mermaid diagrams (operating journey from market tier + brewhouse + format decision through TTB + state ABC + zoning + capital stack + brewhouse + fermenters + canning + build-out + ingredients sourcing + QC + taproom + distribution + marketing + Untappd + festivals + stage growth + 7-path strategic exit; decision matrix for market tier saturated craft hub 200+/M vs growing 50-150/M vs underserved <50/M vs brewpub vs contract vs gypsy vs acquisition with reference operators and exit math). src has 75 cited sources with real URLs covering BA + Brewbound + Beer Marketer\'s Insights + TTB + TTB Permits Online + CBMA + Strike Kerr Johns + Lehrman Beverage Law + McDermott Will Emery + Hinman Carmichael + GrayRobinson + Live Oak Bank + Newtek + Celtic Bank + Yakima Chief Hops + John I Haas Barth-Haas + Hopsteiner + Crosby Hop Farm + Roy Farms + Country Malt Group + BSG + Briess + Great Western Malting + Rahr + White Labs + Wyeast + Imperial Yeast + Omega Yeast + GigaYeast + Lallemand + DME + GW Kent + Premier Stainless + Specific Mechanical + Stout Tanks + Spike Brewing + SS Brewtech + Psycho Brew + AAA Metal Fabrication + Newlands + GEA + Krones + Ziemann + Wild Goose + Cask Brewing + Codi + Pneumatic Scale + Crown Holdings + Ball Corporation + G3 Enterprises + Anton Paar + Mettler-Toledo + Ekos + Beer30 5th Ingredient + OrchestratedBeer + Vicinity Brew + Toast + Square + Arryved + Lightspeed + Untappd for Business + Reyes + RNDC + Breakthru + Manhattan Beer + Columbia + Ben E. Keith + Sheehan Family + Wefunder + Republic + StartEngine + GABF + World Beer Cup + CBC + First Beverage Group. num is comprehensive 14-table benchmark block (industry size + self-distribution thresholds 12 states + brewhouse format 6 sizes + fermentation/glycol/packaging equipment + startup capital 6 configurations + revenue mix 6 streams + COGS per barrel 7 lines + sales metrics 5 size brackets + taproom economics 6 metrics + staff 8 roles + distribution economics 7 channels + 5-year cash-flow trajectory + capital stack 6 layers + exit multiples 6 buyer types). counter is 12-element counter-case with craft-volume-decline-2022-2024-first-multi-year + hard-seltzer-cannibalization-2019-2022 + Gen-Z-lower-alcohol-THC-non-alc-growth + tap-handle-saturation-major-markets + distributor-consolidation-moat + AB-InBev-Molson-Coors-Constellation-counter-pressure-Wicked-Weed-controversy + aluminum-can-shortage-cost-inflation + glycol-hops-malt-inflation + ESG-water-waste-sustainability + ABV-mislabeling-lawsuits-TTB-enforcement + Untappd-review-bombing-reputation + capital-intensity-vs-adjacent-businesses failure modes and honest 8-condition verdict. links cross-references 33 related entries with q9663 self-storage as adjacent CRE sibling + q9662 mobile IV + q9661 veterinary + q9660 DPC + q9659 med spa + q9655 SNF + q9650 assisted living (specialty CRE + state licensure parallels) + q9628/q9629/q9658 NEW STRUCTURE + q9601 operational backbone + q1962 glamping experiential consumption parallel + q1942/q1946-q1954 baseline siblings. All numbers grounded in real BA + Brewbound + Beer Marketer\'s Insights + TTB CBMA federal excise + state ABC self-distribution thresholds TX 75K/CA 60K/NY 75K/FL unlimited + brewhouse equipment Stout/Spike/SS Brewtech/Psycho/Premier/GW Kent/DME/Specific/AAA/Newlands/GEA/Krones/Ziemann + canning Wild Goose/Cask/Codi/Pneumatic Scale + Crown/Ball aluminum + Anton Paar/Mettler-Toledo QC + Ekos/Beer30 brewery ERP + Reyes $10B/RNDC/Breakthru distributor consolidation + AB-InBev Wicked Weed 2017 backlash + Stone Sapporo $165M 2022 + Dogfish Head Boston Beer 2019 $300M + New Belgium Lion 2019 + Cigar City Canarchy Monster Beverage $330M 2022 acquisition history + SBA 7(a) Live Oak dominant brewery + GABF Denver 60K attendees. ASCII-clean throughout. Lean target 8,000-10,500 words honored.'
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
