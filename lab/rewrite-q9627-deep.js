// q9627 — How do you start a mobile blasting business in 2027?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** To start a mobile blasting business in 2027, buy or build a trailer-mounted abrasive blasting rig and sell **on-site surface preparation** to customers who cannot or will not haul their work to a fixed blast booth. The winning wedge is **dustless (slurry/vapor) blasting for the 5-200 mile rural-and-suburban radius around a mid-size metro** — focused on three durable verticals: agricultural and heavy equipment restoration, residential exterior projects (decks, masonry, pools, lead-paint removal), and light commercial/industrial maintenance (fleet trucks, structural steel, tanks, fencing). Realistic startup cost: **$18,000-$45,000 for a used-rig lean entry, $65,000-$140,000 for a new turnkey dustless setup** (DustlessBlasting, Graco EcoQuip, or a custom-built pot-and-trailer package). Charge **$150-$275 per hour** or **$3-$9 per square foot** depending on substrate and coating; mobilization fees of **$150-$500** for travel. Year-1 realistic revenue for an owner-operator: **$90,000-$180,000 at 55-70% gross margin**, working 30-45 billable hours/week with heavy seasonality. Year-3 target with one crew truck and a helper: **$320,000-$520,000**; Year-5 ceiling for a 2-3 rig operation: **$700,000-$1.3M** before you must choose between staying a lifestyle business, adding a fixed shop with a blast booth and powder-coat line, or selling (typically **2.2x-3.5x SDE** to a competitor or a regional coatings roll-up). Lead generation is **almost entirely Facebook (Marketplace + local groups + before/after video), Google Business Profile, equipment-dealer and body-shop referrals, and word of mouth** — not paid search, which is expensive and low-trust for this trade. The biggest 2027-specific risks: **(a) silica-dust OSHA enforcement and the near-total regulatory death of open dry silica-sand blasting**, which is why dustless/alternative-media rigs are now the default; **(b) abrasive media and diesel cost volatility** squeezing margin; and **(c) the feast-or-famine sales cycle** that kills undercapitalized operators in their first winter. Net: this is a high-margin, low-competition, equipment-gated trade where a disciplined owner-operator who masters dustless media, OSHA silica compliance, and Facebook video marketing can build a $300K-$500K business within 36 months — but it punishes anyone who under-prices, skips containment, or runs out of cash before spring.`;

const core = `

## Why Mobile Blasting Is a Strong Trade Business to Start in 2027

Mobile abrasive blasting in 2027 sits at the intersection of three trends that make it one of the more defensible owner-operator trades available. First, **the work cannot be offshored, automated away, or dropshipped** — rust, old coatings, graffiti, and failed paint exist physically on heavy equipment, buildings, boats, and steel that must be prepared on-site. A robot cannot back a trailer down a gravel farm lane and strip a 1978 tractor; a person with a rig does. Second, **regulation has quietly killed the cheap competition**. Open-air dry silica sand blasting — the way this trade was done for a century — is now effectively illegal to perform without elaborate engineering controls because of OSHA's respirable crystalline silica standard (29 CFR 1926.1153, PEL of 50 µg/m³). That regulation, fully enforced and tightened through the 2020s, means the guy with a $2,000 used pot and a bag of play sand is no longer a viable competitor. The market has bifurcated into licensed, insured, dustless-capable operators and nobody. Third, **the installed base of things that need blasting keeps growing**: aging farm equipment, a national fleet of work trucks, decades of structural steel, millions of residential decks and masonry surfaces, and an entire restoration and classic-car economy. Demand is durable, geographically distributed, and under-served outside major metros.

The economics are also unusually friendly to a disciplined first-time owner. Gross margins of 55-70% are normal because the two biggest costs — labor and media — are variable and controllable, and the customer is paying primarily for capability and mobilization, not raw materials. A founder who treats this as a real business (insurance, OSHA compliance, written estimates, scheduling discipline, Facebook video marketing) rather than a side hustle with a borrowed compressor can clear $90K-$180K in year one and build toward $400K+ by year three. The trade rewards mechanical aptitude, comfort with dirty physical work, basic business hygiene, and — critically — the cash discipline to survive a slow winter. It punishes the romantics who buy a shiny new rig on a five-year note and discover in January that nobody is restoring tractors in the rain.

## What "Mobile Blasting" Actually Means: Defining the Service

"Mobile blasting" is an umbrella term, and a founder must decide precisely what they are selling before buying a single piece of equipment. The core service is **bringing abrasive surface preparation to the customer's location** instead of requiring them to transport the workpiece to a fixed blast booth. But within that, there are distinct media and process choices, and each implies different equipment, customers, and price points.

**Dry abrasive blasting** propels media (crushed glass, garnet, coal slag, steel grit, aluminum oxide, walnut shells, plastic media, baking soda) with compressed air. It is fast and aggressive but generates a large dust plume — a serious problem near silica and a containment headache everywhere. **Wet or "dustless" blasting** introduces water into the abrasive stream (either as a slurry inside the pot or injected at the nozzle), which suppresses 90-95% of airborne dust, knocks down rebound, and dramatically reduces silica exposure and cleanup. This is the dominant new-entrant choice in 2027 and the one this entry treats as the default. **Soda blasting** uses sodium bicarbonate, a soft non-sparking media good for delicate substrates, food-grade environments, and degreasing. **Vapor/vapor-honing** and **media blasting with specialty abrasives** serve niche restoration and aerospace-adjacent work. There is also **hydroblasting / pressure washing at extreme PSI**, which overlaps but is a different equipment class.

For a 2027 startup, the strategic recommendation is clear: **build around a dustless (wet) blasting capability as the primary offering, with the option to run dry for specific jobs.** Dustless solves the regulatory problem, expands the range of acceptable job sites (you can blast in a residential neighborhood without coating three houses in grit), reduces containment labor, and is the feature customers increasingly ask for by name. Many modern rigs can switch between wet and dry modes, giving you flexibility. Decide this first, because it dictates a $40K-plus equipment fork.

## Market Sizing: TAM, SAM, and the Realistic SOM

The total US market for abrasive blasting and surface preparation services is large but fragmented. Industry trackers put the broad US "blasting and coating services" and "industrial surface prep" category somewhere in the **$4-7 billion annual range**, depending on whether you include in-house industrial operations, marine, and the coatings that follow blasting. That is the TAM, and most of it is captured by fixed-facility industrial contractors, shipyards, and pipeline/infrastructure specialists that a mobile owner-operator will never touch.

The **serviceable available market (SAM)** for a mobile owner-operator is the slice of that demand that is (a) geographically dispersed, (b) too small or too awkward to send to a fixed booth, and (c) within a practical drive radius. Think of it as the surface-prep spend generated by farms, ranches, small fleet operators, body shops without their own booth, general contractors, homeowners, municipalities, marinas, and light-industrial sites within roughly 100-150 miles of your base. In a typical mid-size metro plus its rural hinterland — call it a region of 300,000-800,000 people — that SAM is plausibly **$3-12 million per year** of mobile-appropriate blasting work, spread across hundreds of potential customers and dozens of would-be competitors (most of them part-time or under-equipped).

The **realistic serviceable obtainable market (SOM)** for a single owner-operator rig is small in absolute terms but more than enough: capturing **$120K-$250K per year** in year one to three is realistic, and a well-run 2-3 rig operation can reach **$700K-$1.3M** — still a tiny fraction of regional demand. The takeaway is not that the market is huge; it is that the market is **deep enough that you will never run out of work if you can find it and price it correctly.** The constraint is almost never demand. It is sales, scheduling, weather, cash, and equipment uptime.

## ICP Segmentation: The Five Customer Types That Actually Pay

A mobile blasting business does not have one customer; it has five, and they behave very differently. Knowing which you are chasing changes your equipment, marketing, pricing, and even your truck.

**Segment 1 — Agricultural and heavy equipment owners.** Farmers, ranchers, and small construction outfits with tractors, implements, trailers, dozers, and grain equipment that need rust removal and repaint prep. They are price-aware but value-driven, pay on completion, and refer heavily within tight rural networks. Jobs run $800-$6,000. Seasonal: heavy in late winter and early spring before planting, dead during harvest. This is the **bread-and-butter wedge for most rural-adjacent startups.**

**Segment 2 — Residential homeowners.** Decks, fences, pool cages, brick and masonry, wrought iron, pavers, and — the high-value sub-niche — **lead paint removal on older homes**. They find you on Facebook, want a clean job site, and are sensitive to dust and mess (dustless wins here). Jobs run $500-$5,000. Less seasonal than ag, but weather-dependent. Margins are good; the risk is scope creep and unrealistic expectations.

**Segment 3 — Automotive and restoration.** Body shops without their own booth, hot-rod and classic-car restorers, frame-off projects, motorcycle and trailer work. They want delicate-substrate competence (warp-free panel blasting, soda or plastic media) and reliability. Jobs run $300-$4,000, and these customers become repeat referrers if you do not warp a quarter panel.

**Segment 4 — Light commercial and industrial.** Fleet trucks and trailers, structural steel, storage tanks, fencing for property managers, parking-garage and warehouse maintenance, food-plant equipment (soda blasting), and graffiti removal for municipalities and businesses. Jobs run $1,500-$25,000 and can include recurring contracts. This is the **growth and scale segment** — higher dollar, more predictable, but it demands more insurance, sometimes prevailing-wage paperwork, and professionalism.

**Segment 5 — Marine and recreational.** Boat hulls (bottom paint removal), docks, pontoons, RVs, and trailers, concentrated near lakes and coasts. Seasonal and regional, but high-margin where it exists. Soda and crushed glass dominate here.

A realistic year-one mix for most startups: **50-60% ag/equipment, 20-30% residential, 10-15% automotive/restoration, and an opportunistic 5-15% commercial.** As you scale and add crews, the mix shifts toward commercial because it fills the schedule with bigger, more predictable tickets.

## The Default-Playbook Trap: Why Most New Blasters Stay Broke

The single most common failure pattern in this trade is what we will call the **default playbook**: buy the cheapest rig you can find, post once on Facebook, charge "a little less than the other guy," take whatever job calls first, and quote everything by gut feel. It feels like starting a business. It is actually buying yourself a low-wage, high-risk job with a depreciating asset attached.

The default playbook fails for specific, predictable reasons. **First, it under-prices.** New blasters anchor on their cash cost of media and diesel and forget that the customer is paying for mobilization, capability, insurance, OSHA compliance, equipment capital recovery, and the slow weeks. A $175/hour rate that feels "expensive" is often barely break-even once you account for non-billable time, which in this trade runs 40-55% of the work week (driving, quoting, loading, maintenance, weather days, chasing payment). **Second, it skips compliance.** The default-playbook operator runs dry silica without containment because it is cheaper, and either gets shut down, gets sued, or simply destroys their reputation by coating a customer's neighborhood in grit. **Third, it has no system for finding work**, so it lurches between feast (referral spike) and famine (three weeks of nothing), and the famine weeks eat the feast weeks' profit. **Fourth, it under-capitalizes** and cannot survive the first winter, so it sells the rig at a loss in February.

The escape from the default-playbook trap is not working harder. It is: pick a wedge segment and own it, price on a real cost model with target margin, run dustless and document your OSHA compliance as a selling point, build one reliable lead channel before you need it, and start with at least three to six months of operating cash. Everything else in this entry is detail underneath those five moves.

## Startup Costs: The Lean, Standard, and Premium Builds

There are three credible ways to enter, and the right one depends on your cash, your risk tolerance, and your local market.

**Lean build ($18,000-$45,000).** A used pressure pot (often a 6.5 or 3.5 cubic foot ASME pot), a used or mid-size diesel air compressor (185-375 CFM), a serviceable enclosed or open trailer, hoses, nozzles, deadman valve, blast helmet with supplied breathing air and a CO monitor, water injection kit if going wet, generator, and basic containment supplies. You buy carefully off auctions, Facebook Marketplace, and retiring operators. The risk: used compressors and pots can be money pits, and downtime is revenue lost. The reward: you can be cash-flow positive fast and prove the model before committing real capital.

**Standard turnkey build ($65,000-$110,000).** A new or near-new branded dustless system (DustlessBlasting trailer unit, Graco EcoQuip 2, or a reputable custom pot-and-trailer integrator), a new or low-hour 185-400 CFM diesel compressor, a properly outfitted enclosed trailer or a flatbed setup, full supplied-air respiratory system, water tank and reclaim provisions, media storage, and a starter inventory of abrasive. This is the most common serious-startup path in 2027 because it minimizes downtime risk and looks professional to commercial customers.

**Premium / multi-capability build ($110,000-$140,000+).** Everything above plus a larger compressor (400-750 CFM) for high production, a second media capability (soda system or specialty media), better reclaim and containment, a wrapped truck and trailer, and possibly a service body truck instead of a trailer for tighter job-site access. This makes sense only if you have committed commercial work lined up or you are funding it from an existing business.

Beyond the rig, budget for **insurance ($3,000-$12,000/year), an LLC and accounting setup ($500-$2,000), a website and Facebook/Google presence ($500-$3,000), initial media inventory ($1,500-$5,000), consumables and PPE ($1,000-$3,000), fuel float, and — non-negotiable — three to six months of personal and business operating reserve.** Total realistic all-in to start safely: **$30,000-$60,000 lean, $90,000-$160,000 standard.**

## Equipment Stack: Compressor, Pot, Media, and the Rest of the Rig

The compressor is the heart of the rig and the most common point of failure for under-built operators. Blasting is air-hungry: a 1/4-inch nozzle at 100 PSI can consume 120-160 CFM, and bigger nozzles or simultaneous tools need far more. **Undersizing the compressor is the classic rookie mistake** — it produces slow, frustrating, low-production blasting that destroys your effective hourly rate. For a serious owner-operator, a **185 CFM unit is the practical minimum, 375 CFM is the comfortable standard, and 400-750 CFM unlocks real production** for commercial work. Diesel tow-behind units (Doosan/Ingersoll Rand, Atlas Copco, Sullair) dominate; buy on hours, maintenance records, and a load test, not on price.

The **blast pot** (ASME-coded pressure vessel) holds and meters the abrasive. Pot size (measured in cubic feet) affects how long you blast between refills; 3.5 to 6.5 cubic foot pots are common for mobile work. For dustless, you either run a slurry pot designed to hold a water-abrasive mix or a dry pot with a **water injection ring at the nozzle**. Key components: a quality **deadman valve** (safety-critical — releases pressure the instant the operator lets go), abrasive metering valve, moisture separators and air dryers (wet air in a dry system causes clogs and flash rust), blast hose rated for the pressure, and a range of **nozzles** (venturi-style boron carbide or tungsten carbide; carbide nozzles last far longer and pay for themselves).

**Respiratory and operator safety gear is not optional**: a supplied-air blast helmet (Type CE), an air-purifying or grade-D breathing-air supply with CO monitoring and filtration, blast suit, gloves, hearing protection, and boots. **Containment and reclaim** supplies — tarps, screens, vacuum reclaim units, drop cloths, and tape — protect surroundings and let you recover and reuse media. Add a **generator, water tank and pump for dustless, light tower for early starts, fuel and water transfer equipment, a pressure washer for pre/post rinse, and basic hand tools.** The trailer or truck that carries it all should be sized so the loaded rig is legal, balanced, and durable on rough rural roads. Treat the entire stack as a production system: the slowest, weakest component caps your revenue per day.

## Abrasive Media: Choosing, Costing, and Managing Your Consumable

Media is your largest variable cost and a frequent source of margin leakage. Each abrasive has a profile of aggressiveness, hardness, particle shape, reusability, dust, embedment risk, and cost — and choosing wrong either damages the substrate or torches your profit.

**Crushed recycled glass** is the workhorse for much modern dustless work: low free silica, moderate aggression, no embedment of iron, widely available, and relatively cheap (**roughly $8-$18 per 50 lb bag, often less by the ton/supersack**). **Coal slag and copper slag** are aggressive and inexpensive but single-use and dustier. **Garnet** is a premium, hard, low-dust, recyclable abrasive favored for steel and tougher coatings — more expensive per bag but reusable several times, which changes the real cost math. **Steel grit and shot** are highly recyclable (dozens of cycles) and excellent for heavy steel in a contained setting, but heavy and not suited to most mobile residential work. **Aluminum oxide** is hard and fast for tough jobs and delicate when fine. **Sodium bicarbonate (soda)** is soft, non-sparking, water-soluble, single-use, and relatively expensive, but irreplaceable for delicate substrates, food-grade environments, degreasing, and warp-free panel work. **Walnut shell and plastic media** are gentle for restoration and aircraft-adjacent work. **Silica sand is effectively off the table** for open mobile work in 2027 because of the OSHA respirable-silica standard — do not build a business model around it.

Manage media as inventory and as a cost driver: **buy in bulk (supersacks/totes) once volume justifies it, track consumption per job type, and build media cost into your per-square-foot and hourly pricing with a margin, not at cost.** A job that "should" net $1,200 can net $400 if you blast through three times the media you estimated because you chose an over-aggressive abrasive or ran sloppy technique. Reusable media (garnet, steel grit) genuinely changes unit economics on the right jobs — model it.

## Pricing Models: Hourly, Square-Foot, Per-Project, and Mobilization

Pricing is where most mobile blasters either build a business or build a trap. There are four pricing structures, and a mature operator uses all of them deliberately.

**Hourly pricing ($150-$275/hour, sometimes higher for big-CFM commercial work)** is the safest default when scope is uncertain — heavily layered coatings, unknown rust depth, irregular substrates. It protects you from underestimating, but customers dislike open-ended pricing, so pair it with a "not to exceed" cap or a tight estimate range.

**Square-foot pricing ($3-$9/sq ft typical, with outliers below $2 for easy single-coat work and above $12-$15 for difficult lead paint, multiple coats, or intricate substrates)** is what residential and many commercial customers want because it is predictable. It only works if you have enough job history to estimate production rate (square feet per hour) by substrate and coating accurately. New operators routinely lose money on square-foot bids because they assume a production rate they cannot actually hit.

**Per-project / flat-rate pricing** is built up from estimated hours or square footage plus media, travel, consumables, containment labor, and target margin — then quoted as one number. This is the professional standard for most jobs once you know your numbers.

**Mobilization / travel fees ($150-$500+, scaled by distance)** are separate and non-negotiable. The drive, load, and setup time is real cost; bury it and you subsidize every distant customer. Many operators charge a flat mobilization fee plus a per-mile rate beyond a base radius. Layer **minimum job charges ($350-$750)** so a tiny job still covers a half-day of your capacity. And quote in writing, every time — verbal estimates are how scope creep becomes unpaid labor.

## Unit Economics: What a Single Job and a Single Day Actually Earn

Walk the math on a representative job so the model is concrete. Take a mid-size farm equipment job: stripping rust and old paint from a tractor and two implements, estimated at **two days of on-site blasting** for an owner-operator.

**Revenue.** Quoted flat at $4,200 (built from ~14 billable blasting hours at an effective $235/hr blended, plus a $300 mobilization fee, plus media). **Direct costs.** Media: ~1,400 lbs of crushed glass at bulk pricing, roughly $350-$550. Diesel for the compressor and truck: roughly $180-$320 over two days. Consumables (nozzles wear, hose, PPE amortization, containment supplies): roughly $120-$220. Helper, if used: $200-$360. **Direct cost total: roughly $850-$1,450.** That leaves a **gross profit of ~$2,750-$3,350, or 65-80% on this job** — but that is gross. Out of it must come truck and rig payments or depreciation, insurance, phone, software, marketing, accounting, the non-billable hours spent quoting and driving and maintaining, and the slow weeks.

Now the **day-level view**: a productive billable day for an owner-operator nets **$900-$1,800 gross** depending on job type and efficiency. But the brutal truth is the **billable-hour ratio**. In a 50-hour work week, perhaps 25-35 hours are actually behind the nozzle; the rest is windshield time, estimates, equipment service, loading, weather, and admin. That is why the headline hourly rate must be high: a $200/hour blasting rate across 30 billable hours is $6,000/week of revenue, which after direct costs and overhead is a solid owner-operator income — but the same person mentally pricing as if they bill 50 hours a week will quote at $120/hour and go broke. **Price the rig's capacity, not the clock.**

## Year 1 Through Year 5 Revenue Trajectory

**Year 1 ($90,000-$180,000 revenue).** Owner-operator, one rig, learning curve on estimating and production. Heavy seasonality — likely a strong spring/summer/fall and a thin winter. Most of the year is spent building the lead engine (Facebook video, Google Business Profile, equipment-dealer and body-shop relationships) and refining the cost model. Gross margin 55-70%; owner take-home often modest after debt service and reserve-building. The win condition for year one is **survival with the lead engine running and the cost model proven** — not maximum revenue.

**Year 2 ($180,000-$320,000).** The lead engine compounds, referrals stack, and the operator either adds a part-time helper or a first full-time crew member. Estimating accuracy improves margin. The operator starts saying no to bad jobs (too far, too small, scope-uncertain residential) and yes to repeat commercial. Possible second rig if commercial pipeline justifies it.

**Year 3 ($320,000-$520,000).** Two rigs or one rig plus a strong crew, the owner shifting from full-time nozzle to a blend of blasting, selling, and managing. Commercial and recurring-maintenance contracts now anchor the schedule and smooth seasonality. This is where the business becomes a real asset rather than a job.

**Year 4-5 ($500,000-$1.3M).** A 2-3 rig operation with crews, a dedicated estimator/owner, and possibly a fixed shop with a blast booth and a coatings (paint or powder) line to capture the downstream work and run year-round. At this stage the founder faces the strategic fork covered later: lifestyle plateau, scale further, add coatings, or sell.

Every number above assumes disciplined pricing, real cash reserves, and a working lead channel. Without those, the trajectory flatlines at "expensive job you bought yourself."

## The Lead Generation Engine: Channels That Actually Work

Lead generation in mobile blasting does not look like lead generation in B2B SaaS or even in most home services, because the work is intensely visual and trust-driven. The channels, in rough order of return:

**Facebook (the dominant channel by a wide margin).** Three uses: (1) **Marketplace listings** for the service itself, refreshed regularly; (2) **local buy/sell/farm/equipment/community groups**, where a well-placed before/after post generates direct messages; and (3) an **active business page posting before/after photos and short videos constantly**. Blasting is mesmerizing to watch — rust vanishing in real time — and that video is free, infinitely shareable advertising. The operators who win in 2027 treat Facebook video as their primary marketing job, not an afterthought.

**Google Business Profile + a simple website.** When someone searches "mobile blasting near me" or "dustless blasting [town]," you must appear, with photos, reviews, and a phone number. Reviews are gold; ask for one after every job.

**Equipment-dealer, body-shop, and contractor referrals.** Tractor and equipment dealers, auto body shops without booths, painters, general contractors, fabricators, and welders all encounter customers who need blasting and have nobody to send them to. A handful of warm referral relationships can fill a calendar.

**Word of mouth and the rural network effect.** In ag and small-town markets, one good job in a community generates the next five. Do excellent work, leave the site clean, and the network sells for you.

**Local presence — yard signs, a wrapped truck/trailer, county fairs, farm shows, equipment auctions.** The wrapped rig is a moving billboard parked at every job site.

**What does NOT pay well:** expensive Google Ads (high CPC, low trust for this trade), generic lead-aggregator sites, and untargeted direct mail. Spend the marketing energy on video and relationships, not on buying clicks.

## Operational Workflow: From Inbound Call to Paid Invoice

A repeatable job workflow is what separates a business from chaos. The canonical cycle:

**1. Intake and qualification.** A call or Facebook message comes in. Qualify fast: what is the item/surface, what coating is on it, how big, where is it, what is the timeline, and is this job worth driving to. Disqualify the tiny far-away jobs early.

**2. Estimate.** For small standard jobs, a phone/photo estimate with a range. For anything larger or uncertain, a site visit — measure, identify the coating and substrate, assess access, water and power availability, and containment needs. Quote in writing with scope, price structure, mobilization fee, exclusions, and payment terms.

**3. Schedule and confirm.** Book it, confirm the day before, and pad the calendar for weather. Sequence jobs geographically to cut windshield time.

**4. Mobilize and set up.** Load checklist, fuel and water, drive, position the rig, set up containment, protect what should not be blasted, brief the customer, and do a small test patch to confirm media and pressure.

**5. Execute.** Blast, monitor production rate against estimate, manage media and the operator's air supply, and document with photos/video for marketing and for the customer.

**6. Demobilize.** Reclaim and clean up media (a clean job site is a referral engine), pack out, and walk the customer through the result.

**7. Invoice and collect.** Invoice on completion, take card/ACH/check, and do not let receivables age — under-capitalized blasters die from slow-paying customers as often as from no customers.

**8. Follow up.** Ask for the review and the referral, file the before/after content, and log the job's actual hours and media against the estimate to keep tightening the cost model.

## Hiring and Staffing: From Solo to Crews

For the first 6-18 months most mobile blasting businesses are a one-person show, and that is appropriate — it keeps overhead minimal while the lead engine and cost model mature. But the solo ceiling is real: one operator can only be behind one nozzle, and the non-billable load (driving, quoting, loading, admin) caps revenue somewhere around $120K-$180K no matter how hard they work.

**First hire: a blasting helper / laborer ($18-$28/hour).** Initially part-time, then full-time. The helper handles containment setup, media loading, hose tending, cleanup, and eventually basic blasting under supervision. This single hire can lift production meaningfully because it lets the operator stay behind the nozzle while the helper does the 40% of the job that is not blasting.

**Second hire: a second blaster / lead operator to run a second rig.** This is the jump from job to business — but only make it when commercial pipeline and cash justify a second compressor, pot, and truck. A second rig idle is a fast way to bankrupt a healthy business.

**Later: an estimator/salesperson or office/scheduling support.** As the owner's time gets eaten by quoting and coordination, off-loading either estimating or scheduling/admin is the highest-leverage move to keep growing.

Staffing realities specific to this trade: it is **physically demanding, hot, dirty work** with real safety requirements, so turnover among casual labor is high — hire for reliability and mechanical sense, train hard on the supplied-air and deadman-valve safety protocols, and pay enough to keep good people. Use **1099 subcontractors cautiously** — misclassification is a real liability, and safety-critical work generally argues for W-2 employees you control and train. Workers' comp is a meaningful cost line once you have employees; price it in.

## Licensing, Legal Structure, Permits, and Compliance

Mobile blasting is not heavily licensed at the federal level, but the patchwork of state, local, and environmental requirements is real and varies enormously by location, so a founder must do local homework.

**Entity.** Form an **LLC** (or S-corp election later for tax efficiency) for liability separation — this is non-negotiable in a trade that can damage a customer's property or surroundings. Get an EIN, a business bank account, and clean books from day one.

**Business licensing.** Most states/cities require a general business license; some require a **contractor's license** depending on scope and dollar value of work, and a few classify surface prep under coatings/painting contractor categories. Check your state contractor board.

**Environmental and air-quality permits.** This is the consequential one. Abrasive blasting can be regulated as a source of particulate emissions and waste. Some states and air districts require **air permits or registrations for blasting operations**, and **spent abrasive plus removed coatings can be regulated waste** — old paint may contain **lead, chromium, or cadmium**, which makes the debris hazardous waste with disposal rules and testing (TCLP) obligations. Lead-paint work specifically may require **EPA RRP (Renovation, Repair, and Painting) certification** and lead-safe practices on pre-1978 housing. Ignoring this is how operators get fined into oblivion.

**OSHA.** The respirable crystalline silica standard (29 CFR 1926.1153 / 1910.1053) governs much of how you must operate; more on this below. **DOT** rules apply if your loaded rig crosses weight thresholds — know your GVWR/GCWR, registrations, and whether you need a CDL.

**Insurance** (covered next) is effectively a license to operate for commercial work. Do the local-compliance research before you buy the rig, not after.

## OSHA Silica, Safety Protocols, and Why Dustless Wins

The OSHA respirable crystalline silica rule is the single most important regulatory fact in this trade, and understanding it is both a compliance obligation and a competitive advantage. The standard sets a **permissible exposure limit of 50 µg/m³** of respirable crystalline silica averaged over an 8-hour day and an action level of 25 µg/m³. Abrasive blasting with silica-containing media — or blasting silica-bearing substrates like concrete and masonry — can blow far past those limits in minutes. The standard requires **exposure assessment, engineering and work-practice controls, respiratory protection, a written exposure control plan, medical surveillance for exposed workers, training, and recordkeeping.**

The practical consequence: **open dry silica-sand blasting is essentially a dead business model.** The compliance burden of doing it "right" — containment, ventilation, monitoring, medical surveillance — is so heavy that the rational move is to **eliminate the hazard by switching media and process.** That is exactly why **dustless/wet blasting and low-silica media (crushed glass, garnet, etc.) are the 2027 default.** Wet blasting suppresses 90-95% of airborne dust, dramatically cutting silica exposure and turning a compliance nightmare into a manageable program. You still need a written exposure control plan, respiratory protection, training, and good practices — but the hazard is controlled at the source.

Beyond silica, the safety stack includes: **supplied-air respiratory protection with CO monitoring** (compressor air can carry carbon monoxide — people have died from this), the **deadman valve** that kills pressure instantly when released, hearing and eye protection, blast suits and gloves, **lockout/tagout and pressure-bleed procedures**, electrical safety around water (relevant for dustless), confined-space awareness for tanks, and ladder/fall protection for elevated work. Treat safety as a selling point: commercial customers and their insurers increasingly ask for your written safety program, and "fully OSHA-compliant dustless operation" is a real differentiator against the part-time competition.

## Insurance: The Coverage Stack You Cannot Operate Without

Insurance in mobile blasting is not a formality — it is what makes you a legitimate vendor for commercial work and what stands between a single bad job and the loss of your house. The coverage stack:

**General liability ($1M/$2M typical minimums, often $2M/$4M for commercial clients).** Covers third-party bodily injury and property damage. Critical in this trade because **overspray, media drift, and surface damage are inherent risks** — blast media can pit a customer's windows, etch a vehicle, or coat a neighbor's property. Make sure the policy does not exclude your core operations; some GL policies exclude blasting or have "your work" gaps.

**Inland marine / equipment (tools & equipment) coverage.** Your compressor, pot, trailer, and rig are mobile, valuable, and theft-prone. This covers the equipment itself, including in transit and on job sites.

**Commercial auto.** Covers the truck and the towed trailer; personal auto policies will not.

**Workers' compensation.** Mandatory in nearly every state once you have employees; given the physical, safety-critical nature of the work, premiums are non-trivial — budget for it.

**Pollution / environmental liability.** Often overlooked and genuinely important: spent media and removed lead/chromium coatings can be a pollution event. Some GL policies exclude pollution; a pollution liability endorsement or policy closes that gap.

**Umbrella/excess.** Cheap relative to the limits it adds; commercial clients sometimes require it.

Expect total insurance to run **$3,000-$12,000+/year** for an owner-operator, more with employees and commercial limits. Work with an agent who actually understands surface-prep contractors — generic small-business policies routinely have exclusions that make them worthless for exactly the claims you are most likely to face.

## Competitive Landscape: Who You Are Actually Up Against

The competitive set in mobile blasting is unusual: it is simultaneously crowded with weak players and thin on strong ones. Understanding the layers helps you position.

**Layer 1 — Part-time and under-equipped operators.** People with a small used pot, an undersized compressor, and a Facebook page. They compete on price, often run dry silica without containment, carry no real insurance, and have inconsistent quality and availability. They are numerous and they anchor customers' price expectations downward — but they are not real competition for commercial work, and they regularly go out of business. Your job is to **not be them and to clearly signal you are not them** (insurance, dustless, written estimates, professionalism).

**Layer 2 — Established mobile owner-operators and small fleets.** Properly equipped, insured, dustless-capable, with a reputation and a referral network. These are your real local competitors. There are usually only a handful in any given region, and the market is deep enough that you coexist more than you cannibalize — but they have the head start on relationships and reviews.

**Layer 3 — Fixed-facility blast-and-coat shops.** Blast booths, powder-coat lines, dip tanks. They beat you on weather independence, throughput, and finishing, but they lose every job that cannot or will not be transported. You and they are partly complementary — they sometimes refer the on-site work to you.

**Layer 4 — Franchises and branded systems.** DustlessBlasting and similar have built dealer/owner networks and brand recognition; some operators run as effectively franchised or brand-affiliated businesses. They bring marketing polish and equipment support but charge for it.

**Layer 5 — Large industrial coatings contractors.** They own the big infrastructure, marine, and industrial contracts and are not chasing your farm-equipment and residential work.

The strategic read: **compete on reliability, professionalism, dustless capability, and a strong visual reputation — not on price.** Price competition is a race Layer 1 will always "win" by going broke faster.

## Five Named Real-World Scenarios

**Scenario 1 — "Cody," the rural ag wedge owner-operator.** Buys a $38K lean dustless rig, bases out of a farm town, and goes all-in on agricultural equipment. Facebook farm groups and equipment-dealer referrals fill the calendar from February through November. Year 1: $115K revenue. Year 3: adds a helper and a second rig, $410K, mix still 60% ag but adding fleet trucks. Lifestyle plateau by choice at ~$450K — does not want a fixed shop.

**Scenario 2 — "Maria," the residential dustless specialist in a metro suburb.** Standard $85K turnkey build, focuses on decks, masonry, pool cages, and lead-paint removal (gets EPA RRP certified). All marketing is before/after Facebook and Instagram video; reviews compound fast. Year 1: $140K. Year 3: $360K with two crews, premium pricing because the clean-job-site reputation lets her charge top of market.

**Scenario 3 — "Dale," the under-capitalized cautionary tale.** Buys a new $130K rig on a five-year note, no cash reserve, prices "a little under the other guy," runs dry to save media cost. Strong summer, but the note and insurance eat it; winter is dead; receivables age; he sells the rig at a $40K loss in March. The failure was not the market — it was capitalization and pricing.

**Scenario 4 — "The Nguyen brothers," the commercial scale-up.** Two partners, one estimates/sells while one runs operations. Deliberately chase fleet, structural steel, tank, and property-manager fencing contracts. By Year 4 they run three rigs and crews, add a fixed shop with a blast booth and powder-coat line to capture downstream coating revenue and run year-round, hit ~$1.1M, and are positioned to either keep scaling or sell.

**Scenario 5 — "Tom," the add-on to an existing business.** Already owns a small welding/fabrication shop; adds a mobile blasting rig to capture prep work he was sending away and to upsell existing customers. Blasting is never more than 30% of revenue but it is high-margin, fills gaps in the fab schedule, and wins fabrication jobs by being a one-stop shop. Lowest-risk entry of the five because the customer base and cash cushion already exist.

## Risk Mitigation: What Kills New Blasting Businesses

The failure modes in this trade are well-known and largely preventable. The mitigations:

**Cash and seasonality risk.** Mitigate with **three to six months of operating reserve before launch**, a winter plan (indoor jobs, shop work, commercial contracts, a complementary service, or simply a budgeted slow season), and disciplined receivables collection.

**Under-pricing.** Mitigate with a **real cost model** that includes non-billable time, overhead, capital recovery, and target margin — and the discipline to walk from jobs that will not hit it.

**Equipment downtime.** Mitigate with **preventive maintenance, a spares kit (nozzles, hoses, valves, filters), relationships with compressor service shops, and — eventually — redundancy.** A used-rig entry should budget a repair reserve.

**Property damage claims.** Mitigate with **containment discipline, test patches, written scope and exclusions, customer walk-throughs before and after, photo documentation, and the right GL policy without blasting exclusions.**

**Regulatory/OSHA exposure.** Mitigate by **running dustless/low-silica, maintaining a written exposure control plan and safety program, getting EPA RRP certification for lead work, and researching local air and waste permits before launching.**

**Hazardous waste from lead/chromium coatings.** Mitigate with **substrate/coating assessment up front, TCLP testing where indicated, proper containment and disposal, and pricing the disposal into lead jobs.**

**Key-person and burnout risk.** Mitigate by **hiring the first helper before you are desperate, documenting your processes, and building toward a business that runs without the founder behind every nozzle.**

**Customer-concentration risk.** Mitigate by **keeping no single customer above ~15-20% of revenue** as you add commercial accounts.

## Exit Strategy: What a Mobile Blasting Business Sells For

Most mobile blasting businesses are not built to sell, and that is fine — many founders run them as a lifestyle income for decades or simply wind them down by selling the equipment. But for those who build deliberately, there are real exit paths.

**Asset sale / equipment liquidation.** The floor outcome: sell the rig(s), trailer, and inventory. Well-maintained dustless rigs and good compressors hold value reasonably; you recover a meaningful fraction of capital but get nothing for the "business."

**Sale as a going concern.** A mobile blasting business with documented financials, recurring commercial contracts, a transferable brand and reviews, trained crews, and processes that do not depend entirely on the founder can sell as a business — typically in the range of **2.2x-3.5x SDE (seller's discretionary earnings)**, occasionally higher for a clean, larger, contract-anchored operation, lower for an owner-dependent one-rig job. The multiple is driven by how transferable the cash flow is.

**Strategic acquisition.** A regional coatings or surface-prep company, a fixed blast-and-coat shop wanting mobile capability, or a competitor consolidating the local market may pay a premium for route density, contracts, equipment, and crew. A fabrication or restoration business may buy you to integrate the capability.

**Roll-ups and franchising.** As the trade professionalizes, branded systems and small regional roll-ups are slowly emerging; a well-run multi-rig operation can be an attractive bolt-on.

To maximize exit value, the playbook is consistent: **build recurring commercial revenue, keep clean books, reduce founder dependence (crews, processes, an estimator), maintain the equipment, protect the brand and online reviews, and avoid customer concentration.** The same moves that make the business sellable also make it a better business to own.

## Owner Lifestyle Reality: What the Work Actually Feels Like

A prospective founder should be honest about the day-to-day, because the trade self-selects hard. Mobile blasting is **physically demanding** — hours in a blast suit and supplied-air helmet, often in heat, hauling hose, loading media, setting containment. It is **dirty and loud.** It is **weather-exposed**, so the calendar bends to rain, cold, and wind, which is both a scheduling headache and a source of income volatility. It involves **a lot of driving** — windshield time to dispersed rural and suburban job sites is a real and unpaid-feeling part of the week.

It is also, for the right person, genuinely satisfying work: the results are **immediate and dramatic** (rust and failed coatings vanish in front of you), customers are visibly delighted, the jobs are varied (a tractor today, a pool cage tomorrow, a fleet trailer next week), and the margins reward competence. The owner-operator has real autonomy and, once the lead engine and cash discipline are in place, a comfortable income.

The seasonality cuts both ways: a hard spring-to-fall push followed by a thin winter suits some temperaments and wrecks others. The founders who thrive are mechanically capable, comfortable with physical labor and dirt, disciplined enough to quote and collect and reserve cash, and willing to spend evenings editing before/after video. The founders who struggle want clean, predictable, indoor, year-round work — which is the opposite of this trade. Know which you are before you sign for a rig.

## The Tooling and Software Stack Around the Rig

Beyond the physical blasting equipment, a 2027 mobile blasting business runs on a modest software and tooling stack that punches above its cost.

**Estimating and quoting.** A consistent written-estimate template (even a well-built spreadsheet or a tool like Jobber, Housecall Pro, or ServiceTitan-lite alternatives) that captures scope, substrate, square footage, media, mobilization, exclusions, and price. The estimate template *is* the cost model in practice.

**Scheduling and CRM.** A field-service app (Jobber and Housecall Pro are the common choices for trades this size) to manage the calendar, customer history, job geography, and follow-ups. Even a shared calendar plus a spreadsheet beats memory.

**Invoicing and payments.** Get paid fast: card and ACH acceptance (Square, Stripe, or the field-service app's built-in payments) reduces the receivables aging that kills cash flow.

**Accounting.** QuickBooks (or a bookkeeper) from day one — clean books make tax time, lending, and an eventual sale far easier, and they are how you actually know your margin.

**Marketing tooling.** A smartphone with a decent camera, a basic video editing app, a Facebook business page and Google Business Profile, and a simple website. The marketing "stack" is mostly discipline, not software.

**Job documentation.** Before/after photos and short video on every job — they serve double duty as marketing content and as a record that protects you in a property-damage dispute.

**Maintenance and inventory tracking.** Even a simple log of compressor hours, media inventory, and consumable usage per job feeds the cost model and prevents downtime surprises.

The point is not to over-tool. It is to have *just enough* system that quoting is consistent, the calendar is full, the cash comes in fast, and you actually know your numbers.

## Common Year-One Mistakes That Sink New Operators

The first-year mistakes in this trade are remarkably consistent across operators, which means they are avoidable:

**Undersizing the compressor.** The most common technical mistake — it produces slow, low-production blasting that quietly destroys the effective hourly rate. Buy more CFM than feels necessary.

**Pricing on cash cost instead of a full cost model.** Forgetting non-billable time, overhead, capital recovery, and the slow season — and quoting "a little under the other guy" — is the most common business mistake.

**Skipping or underbuying insurance.** Operating with a generic policy that excludes blasting or pollution, or with no real GL at all, until a media-drift claim ends the business.

**Running dry silica to save money.** A regulatory and reputational time bomb. Run dustless/low-silica.

**No cash reserve.** Launching with the rig financed and zero buffer, then meeting the first slow winter.

**Taking every job.** Driving two hours for a $300 job, accepting scope-uncertain residential work at a flat price, never disqualifying. The schedule fills with low-margin work and there is no room for the good jobs.

**No written estimates.** Verbal quotes become scope creep becomes unpaid labor and disputes.

**Poor containment and dirty job sites.** The single fastest way to destroy referrals and invite property-damage claims.

**No marketing system.** Posting on Facebook once, then waiting for the phone, then panicking. The before/after video engine has to run constantly.

**Letting receivables age.** Doing the work, invoicing late, not collecting — under-capitalized operators die from this as often as from no work.

**Neglecting maintenance.** No spares, no preventive service, then a dead compressor in peak season.

## A Decision Framework: Is Mobile Blasting Right for You?

Before committing capital, run yourself and your market through this framework. Score each honestly.

**1. Capital.** Do you have access to a lean ($30K-$60K all-in) or standard ($90K-$160K all-in) entry *including* three to six months of reserve — without betting the house on a maxed-out equipment note? If no, fix this before anything else.

**2. Market.** Within ~100-150 miles of your base, is there a real concentration of ag equipment, fleets, body shops, contractors, residential masonry/decks, or light industry — and only a handful of strong, professional competitors? Drive the territory and check Facebook before you believe it.

**3. Aptitude and tolerance.** Are you mechanically capable, comfortable with hot, dirty, physical, weather-exposed work and a lot of driving, and disciplined about quoting, collecting, and reserving cash?

**4. Wedge.** Can you name your year-one wedge segment and the one lead channel you will build first? "I'll take whatever calls" is not a plan.

**5. Compliance stomach.** Are you willing to run dustless, build a written safety/exposure plan, get EPA RRP certified for lead work, research local air/waste permits, and carry the right insurance — i.e., do this as a real business?

**6. Seasonality fit.** Does a hard three-season push and a thin, planned winter fit your temperament and finances?

If you score strongly on capital, market, aptitude, and compliance stomach, mobile blasting is a genuinely attractive owner-operator business with high margins and limited serious competition. If you are weak on capital or compliance stomach, either fix those first or choose a different trade — those two gaps are what turn this from a good business into "Dale" from Scenario 3.

## Five-Year and AI Outlook: Where the Trade Goes 2027-2032

The medium-term outlook for mobile blasting is, on balance, favorable for disciplined operators, with a few specific shifts to anticipate.

**Regulation continues to favor the prepared.** OSHA silica enforcement is not loosening, and the regulatory pressure that already killed cheap dry-silica competition will keep professionalizing the trade. Dustless and low-silica media stay the default; written safety programs become more clearly a cost of entry for commercial work. This is good for operators who built it in from the start.

**Equipment keeps improving incrementally.** Better dustless systems, more efficient compressors, improved reclaim and containment, and possibly more electric or hybrid power options as job-site emissions rules tighten. None of this is revolutionary, but it raises the floor on what "professional" looks like.

**AI and automation touch the business, not the nozzle.** The physical act of dragging a hose around a tractor in a field is not getting automated for this market in this window — the work is too varied, unstructured, and site-specific. Where AI shows up is in the *business* layer: AI-assisted estimating from customer photos, scheduling and route optimization, automated review-gathering and marketing-content generation, and AI customer-intake/booking. Operators who adopt these tools will quote faster, route tighter, and market more consistently than those who do not. Fixed-facility and high-volume industrial blasting may see some robotic blasting cells, but that does not threaten the mobile owner-operator's core market.

**Consolidation slowly increases.** Branded systems, regional roll-ups, and fixed shops adding mobile capability will keep professionalizing and consolidating the strong end of the market — which raises both the competitive bar and the exit opportunity for well-built operations.

**Demand stays durable.** The installed base of equipment, structures, fleets, and homes that need surface prep is not shrinking. The constraint on a mobile blasting business in 2032, as in 2027, will not be demand. It will be capital discipline, sales, compliance, and execution.

## Final Framework: The Five Moves That Build the Business

Strip away the detail and a successful 2027 mobile blasting startup is five disciplined moves, in order.

**Move 1 — Capitalize correctly.** Enter lean ($30K-$60K all-in) or standard ($90K-$160K all-in), and *include three to six months of reserve.* Do not bet survival on a maxed equipment note. Under-capitalization, not the market, is the number-one killer.

**Move 2 — Build around dustless and document compliance.** Make wet/dustless, low-silica blasting the core capability, run a written exposure control plan and safety program, get EPA RRP certified for lead, research local air/waste permits, and carry real insurance without blasting/pollution exclusions. Compliance is both a legal floor and a competitive moat.

**Move 3 — Pick a wedge and a lead channel, and own them.** Choose your year-one segment (for most rural-adjacent startups: ag and heavy equipment) and your primary lead engine (almost always Facebook before/after video plus Google Business Profile plus equipment-dealer/body-shop referrals). Build the lead engine *before* you are desperate for work.

**Move 4 — Price the rig's capacity, not the clock.** Use a real cost model — non-billable time, overhead, capital recovery, media with margin, mobilization fees, minimum charges, target margin — quote everything in writing, and walk from jobs that will not hit the number. Charge $150-$275/hour or $3-$9/sq ft, and never compete on price with the part-timers.

**Move 5 — Systematize, then scale or plateau on purpose.** Run a repeatable job workflow, collect receivables fast, document jobs with before/after content, hire the first helper before you are buried, and keep clean books. Then make the strategic choice consciously: a comfortable lifestyle plateau, scaling to multi-rig crews, adding a fixed shop with coatings, or building toward a sellable asset at 2.2x-3.5x SDE.

Execute those five moves with discipline and mobile blasting is one of the more reliable paths to a $300K-$500K owner-operated business in 2027 — a high-margin, low-glamour, equipment-gated trade that rewards exactly the founders willing to do the unglamorous things right.

`;

const flow = `

## Customer Journey: From Surface-Prep Pain to Repeat Customer

\`\`\`mermaid
flowchart TD
  A[Customer Has A Surface Prep Problem] --> A1[Rusted Farm Or Heavy Equipment]
  A --> A2[Residential Deck Masonry Or Lead Paint]
  A --> A3[Body Shop Or Restoration Project]
  A --> A4[Fleet Trucks Steel Or Tanks]
  A --> A5[Marine Hull Or Dock]
  A1 --> B[Discovery Channel]
  A2 --> B
  A3 --> B
  A4 --> B
  A5 --> B
  B --> B1[Facebook Marketplace And Local Groups]
  B --> B2[Before After Video On Facebook Page]
  B --> B3[Google Business Profile Search]
  B --> B4[Equipment Dealer Or Body Shop Referral]
  B --> B5[Word Of Mouth Rural Network]
  B --> B6[Wrapped Truck Or Yard Sign]
  B1 --> C[Intake And Qualification Call]
  B2 --> C
  B3 --> C
  B4 --> C
  B5 --> C
  B6 --> C
  C --> C1[Identify Substrate And Coating]
  C --> C2[Confirm Job Size And Location]
  C --> C3[Disqualify Tiny Far Away Jobs]
  C1 --> D[Estimate Phone Or Site Visit]
  C2 --> D
  C3 --> D
  D --> D1[Measure Assess Access Water Power]
  D --> D2[Written Quote Scope Price Exclusions]
  D --> D3[Mobilization Fee And Minimum Charge]
  D1 --> E[Schedule And Confirm Day Before]
  D2 --> E
  D3 --> E
  E --> F[Mobilize Set Up Containment Test Patch]
  F --> G[Execute Blast Monitor Production Rate]
  G --> G1[Document With Before After Video]
  G --> H[Demobilize Reclaim Media Clean Site]
  G1 --> H
  H --> I[Invoice On Completion Collect Fast]
  I --> J[Ask For Review And Referral]
  J --> K[Repeat And Referral Revenue]
  K --> A
\`\`\`

## Decision Matrix: Lean vs Standard vs Premium Rig Entry

\`\`\`mermaid
flowchart LR
  A[Founder Evaluates Entry Path] --> B{Available Capital Plus Reserve}
  B -->|Under 60K All In| C[Lean Build Path]
  B -->|90K To 160K All In| D[Standard Turnkey Path]
  B -->|Over 160K With Pipeline| E[Premium Multi Capability Path]
  C --> C1[Used Pot And 185 To 375 CFM Compressor]
  C1 --> C2[Used Trailer Wet Injection Kit]
  C2 --> C3[Pro Cash Flow Positive Fast]
  C2 --> C4[Con Downtime Risk Repair Reserve Needed]
  C3 --> F[Prove Model In Season One]
  C4 --> F
  D --> D1[New Branded Dustless System]
  D1 --> D2[New Low Hour 185 To 400 CFM Compressor]
  D2 --> D3[Pro Low Downtime Looks Professional]
  D2 --> D4[Con Higher Debt Service Slower Payback]
  D3 --> G[Most Common Serious Startup Path]
  D4 --> G
  E --> E1[400 To 750 CFM Plus Second Media]
  E1 --> E2[Wrapped Truck Service Body Setup]
  E2 --> E3[Pro High Production Commercial Ready]
  E2 --> E4[Con Only Works With Committed Pipeline]
  E3 --> H[Scale Or Existing Business Add On]
  E4 --> H
  F --> I{Season One Results}
  G --> I
  H --> I
  I -->|Lead Engine Works Margin Proven| J[Add Helper Then Second Rig]
  I -->|Under Priced Or No Cash Buffer| K[Distressed Exit Sell Rig At Loss]
  J --> L[Year 3 Plus 320K To 520K]
  L --> M{Strategic Fork}
  M -->|Stay Solo| N[Lifestyle Plateau 400 To 500K]
  M -->|Scale Crews| O[Multi Rig 700K To 1.3M]
  M -->|Add Coatings| P[Fixed Shop Booth And Powder Line]
  M -->|Sell| Q[Going Concern 2.2x To 3.5x SDE]
\`\`\`

`;

const src = `

## Sources

1. **OSHA Respirable Crystalline Silica Standard for Construction — 29 CFR 1926.1153** — PEL of 50 µg/m³, exposure control plan, engineering controls, medical surveillance requirements governing abrasive blasting. https://www.osha.gov/silica-crystalline/construction
2. **OSHA Respirable Crystalline Silica Standard for General Industry — 29 CFR 1910.1053** — General industry silica requirements applicable to blasting operations.
3. **OSHA Abrasive Blasting Hazards Guidance (OSHA 3697 and related)** — Hazard overview, supplied-air respirator requirements, CO monitoring, deadman valve safety.
4. **NIOSH — Abrasive Blasting and Crystalline Silica Exposure Alerts** — Health hazard documentation driving the shift away from silica sand media.
5. **EPA Renovation, Repair and Painting (RRP) Rule — 40 CFR Part 745** — Lead-safe work practices and certification for pre-1978 housing surface prep. https://www.epa.gov/lead/renovation-repair-and-painting-program
6. **EPA Resource Conservation and Recovery Act (RCRA) — Hazardous Waste Determination** — Spent abrasive plus lead/chromium/cadmium coatings as potentially hazardous waste; TCLP testing context.
7. **EPA / State Air Quality Permitting for Abrasive Blasting Operations** — Particulate emission source registration and permitting requirements varying by state and air district.
8. **DustlessBlasting (MMLJ Inc.) — Equipment and Owner Program Documentation** — Trailer-mounted dustless systems, pricing, and owner-operator business model. https://www.dustlessblasting.com
9. **Graco EcoQuip 2 — Vapor Abrasive Blasting Equipment Documentation** — Wet/vapor blasting equipment specifications and dust-suppression performance. https://www.graco.com
10. **Doosan Portable Power / Ingersoll Rand — Portable Diesel Air Compressor Specifications** — 185-750 CFM tow-behind compressor sizing and CFM-vs-nozzle consumption data.
11. **Atlas Copco and Sullair — Portable Compressor Product Lines** — Alternative portable air compressor specifications for mobile blasting rigs.
12. **SSPC / AMPP (Association for Materials Protection and Performance)** — Surface preparation standards (SP standards), abrasive selection guidance, and contractor certification context. https://www.ampp.org
13. **Clemco Industries — Blast Pot, Nozzle, and Deadman Valve Equipment Documentation** — ASME-coded pressure pot specifications, venturi nozzle and remote control valve standards.
14. **US Bureau of Labor Statistics — Coating, Painting, and Spraying Machine Setters, Operators, and Tenders** — Wage and employment context for blasting and coating labor.
15. **IBISWorld — Sandblasting and Surface Preparation Services Industry Reports** — US market sizing, fragmentation, and competitive structure for blasting services.
16. **Crushed glass abrasive supplier documentation (e.g., recycled glass abrasive producers)** — Media properties, low free silica content, bulk pricing per ton and per bag.
17. **Garnet abrasive supplier documentation (industrial garnet producers)** — Recyclability, hardness, and cost-per-use economics versus single-use media.
18. **Black Beauty / coal slag abrasive product data** — Aggressive single-use slag abrasive properties and pricing.
19. **ARMEX / Sodium Bicarbonate (soda) Blast Media Documentation** — Soft non-sparking media for delicate substrates, food-grade, and degreasing applications.
20. **SBA — Choosing a Business Structure (LLC vs S-Corp)** — Entity selection and liability separation guidance for contractor businesses. https://www.sba.gov
21. **State Contractor Licensing Boards (varies by state)** — Contractor license requirements where surface prep is classified under coatings/painting trades.
22. **FMCSA / DOT — Commercial Vehicle and Trailer Weight Regulations** — GVWR/GCWR thresholds, CDL requirements, and commercial registration for loaded blasting rigs. https://www.fmcsa.dot.gov
23. **Insureon / Next Insurance / The Hartford — Contractor Insurance Guidance** — General liability, inland marine equipment, commercial auto, workers' comp, and pollution liability for blasting contractors.
24. **NASP / Pollution Liability Insurance Resources for Surface Prep Contractors** — Environmental liability coverage addressing spent media and coating debris exposure.
25. **Jobber and Housecall Pro — Field Service Management Software Documentation** — Estimating, scheduling, CRM, and integrated payments for trade-service businesses. https://getjobber.com
26. **QuickBooks — Small Business Accounting for Contractors** — Bookkeeping and financial reporting foundation for trade businesses.
27. **Square / Stripe — Payment Processing for Field Services** — Card and ACH acceptance to reduce receivables aging.
28. **Facebook Marketplace and Local Groups — Small Business Marketing Practices** — Primary lead-generation channel structure for visual trade services.
29. **Google Business Profile — Local Search Optimization for Service Businesses** — Local pack ranking, reviews, and discovery for "near me" trade searches.
30. **BizBuySell — Small Business Valuation and SDE Multiple Benchmarks** — Seller's discretionary earnings multiples for contractor and service-business sales. https://www.bizbuysell.com
31. **EPA Lead Renovation Disposal and Waste Management Guidance** — Containment and disposal of lead-contaminated debris from paint removal.
32. **NIOSH Carbon Monoxide Hazard in Supplied-Air Respirator Systems** — CO poisoning risk and monitoring requirements for compressor-supplied breathing air.
33. **ASME Boiler and Pressure Vessel Code — Section VIII** — Pressure vessel coding standard applicable to blast pots.
34. **State Environmental Agency Abrasive Blasting Best Management Practices (varies)** — Containment, runoff, and waste BMP requirements for outdoor and mobile blasting.
35. **Industrial trade publications on dustless/vapor blasting adoption** — Coverage of the post-silica-rule shift toward wet blasting as the new-entrant default.
36. **OnlineJobs and trades hiring resources** — Labor sourcing context for blasting helpers and second operators.

`;

const num = `

## Numbers

**Market Size**
- US blasting and coating / surface prep services market: ~$4-7B annual range (broad category, TAM)
- Regional SAM for a mobile owner-operator (300K-800K population region): ~$3-12M/year of mobile-appropriate work
- Realistic SOM for a single owner-operator rig: $120K-$250K/year (year 1-3)
- Realistic SOM for a well-run 2-3 rig operation: $700K-$1.3M/year
- The binding constraint is almost never demand — it is sales, scheduling, weather, cash, and equipment uptime

**Startup Costs**
- Lean used-rig build: $18,000-$45,000 (equipment only)
- Standard turnkey dustless build: $65,000-$110,000 (equipment only)
- Premium / multi-capability build: $110,000-$140,000+ (equipment only)
- Insurance (year 1): $3,000-$12,000+
- LLC + accounting setup: $500-$2,000
- Website + Facebook/Google presence: $500-$3,000
- Initial media inventory: $1,500-$5,000
- Consumables + PPE starter: $1,000-$3,000
- All-in safe launch (lean, incl. reserve): $30,000-$60,000
- All-in safe launch (standard, incl. reserve): $90,000-$160,000
- Operating reserve before launch: 3-6 months of personal + business expenses (non-negotiable)

**Equipment Specs**
- Compressor practical minimum: 185 CFM
- Compressor comfortable standard: 375 CFM
- Compressor for real commercial production: 400-750 CFM
- Nozzle air consumption example: 1/4-inch nozzle at 100 PSI ~ 120-160 CFM
- Common blast pot sizes: 3.5-6.5 cubic feet (ASME-coded)
- Carbide nozzles: far longer life than steel — pay for themselves

**Pricing**
- Hourly rate: $150-$275/hour (higher for big-CFM commercial work)
- Square-foot rate: $3-$9/sq ft typical (under $2 easy single-coat; $12-$15+ difficult lead/multi-coat)
- Mobilization / travel fee: $150-$500+ (scaled by distance, often + per-mile beyond base radius)
- Minimum job charge: $350-$750
- Dust suppression with wet/dustless blasting: ~90-95% of airborne dust eliminated

**Media Costs**
- Crushed recycled glass: ~$8-$18 per 50 lb bag (less by ton/supersack)
- Coal/copper slag: inexpensive, single-use, dustier
- Garnet: premium per bag but reusable several times (changes real cost math)
- Steel grit/shot: highly recyclable (dozens of cycles), heavy, contained settings
- Soda (sodium bicarbonate): relatively expensive, single-use, water-soluble, delicate-substrate
- Silica sand: effectively off the table for open mobile work under OSHA silica rule

**Unit Economics (Representative 2-Day Farm Equipment Job)**
- Quoted revenue: ~$4,200 (flat, built from ~14 billable hrs blended ~$235/hr + $300 mobilization + media)
- Media cost: ~$350-$550 (~1,400 lbs crushed glass at bulk)
- Diesel (compressor + truck, 2 days): ~$180-$320
- Consumables (nozzle wear, hose, PPE amortization, containment): ~$120-$220
- Helper (if used): $200-$360
- Direct cost total: ~$850-$1,450
- Gross profit on job: ~$2,750-$3,350 (65-80% gross)
- Productive billable day nets: $900-$1,800 gross
- Billable-hour ratio: only ~25-35 of a 50-hour week is behind the nozzle (40-55% non-billable)

**Revenue Trajectory**
- Year 1: $90,000-$180,000 (owner-operator, one rig, 55-70% gross margin)
- Year 2: $180,000-$320,000 (add helper or first crew member)
- Year 3: $320,000-$520,000 (two rigs or rig + crew; commercial anchors schedule)
- Year 4-5: $500,000-$1.3M (2-3 rigs, crews, possible fixed shop + coatings line)

**OSHA / Regulatory**
- Respirable crystalline silica PEL: 50 µg/m³ (8-hr TWA)
- Silica action level: 25 µg/m³
- EPA RRP certification: required for lead-safe work on pre-1978 housing
- Hazardous coatings of concern: lead, chromium, cadmium (TCLP testing where indicated)
- CO monitoring: required on compressor-supplied breathing air (fatal risk)

**Insurance**
- General liability: $1M/$2M minimum, often $2M/$4M for commercial clients
- Inland marine / equipment coverage: covers compressor, pot, trailer in transit and on site
- Commercial auto: required (personal auto will not cover the rig)
- Workers' comp: mandatory with employees; non-trivial premium given physical/safety-critical work
- Pollution / environmental liability: often excluded from GL — add endorsement or policy
- Total insurance: $3,000-$12,000+/year owner-operator; more with employees + commercial limits

**Hiring**
- First hire (blasting helper / laborer): $18-$28/hour, part-time then full-time
- Second hire: second blaster / lead operator for a second rig (only with pipeline + cash)
- Later: estimator/salesperson or office/scheduling support
- Solo revenue ceiling: ~$120K-$180K (one operator, non-billable load caps it)

**Exit / Sale**
- Asset / equipment liquidation: recover a fraction of capital, nothing for the business
- Going-concern sale: ~2.2x-3.5x SDE (higher for clean, contract-anchored, larger ops; lower for owner-dependent)
- Strategic acquisition: premium possible for route density, contracts, crews, equipment
- Value drivers: recurring commercial revenue, clean books, low founder dependence, maintained equipment, brand/reviews, no customer concentration
- Customer-concentration ceiling: no single customer above ~15-20% of revenue

**Customer Mix (Realistic Year 1)**
- Ag / heavy equipment: 50-60%
- Residential: 20-30%
- Automotive / restoration: 10-15%
- Light commercial / industrial: 5-15% (grows as you scale)

`;

const counter = `

## Counter-Case: Why Starting A Mobile Blasting Business In 2027 Might Be A Mistake

The bull case is real, but a serious founder should stress-test it against the conditions that make this trade unattractive or outright dangerous. There are legitimate reasons to walk away.

**Counter 1 — The capital wall is higher and less forgiving than it looks.** A "standard" turnkey dustless build is $65K-$110K of equipment before insurance, inventory, marketing, and reserve — and the lean used-rig path trades that cash savings for downtime risk that can be just as expensive. Unlike a laptop business, you cannot start for $2,000 and scale into it. The capital is real, much of it is depreciating and specialized (a used blast pot has a thin resale market), and a five-year equipment note turns a slow winter into an existential threat. If you do not have genuine reserve on top of the rig, this is a high-stakes bet, not a side hustle.

**Counter 2 — Seasonality is brutal and chronically underestimated.** This is weather-exposed, often outdoor, often agriculture-linked work. A strong spring-to-fall push followed by a dead winter is the norm in most of the country. Founders look at peak-season weeks and annualize them; the reality is a bimodal year where Q1 and Q4 can be thin enough to wipe out the profit from Q2 and Q3 if you have not reserved cash and built a winter plan. Many failures are simply operators who could not survive their first January.

**Counter 3 — The physical toll is severe and time-limited.** Hours in a blast suit and supplied-air helmet in the heat, hauling hose, loading media, on your knees and overhead. It is genuinely hard on the body, and the operators who romanticize "being your own boss" often underestimate that the boss is the one doing the most physically punishing work. There is a real career-length question here that a desk trade does not have.

**Counter 4 — Regulatory exposure is a permanent overhead, not a one-time setup.** OSHA silica, EPA RRP for lead, hazardous-waste rules for lead/chromium/cadmium debris, state air permits, DOT weight rules — none of this goes away, all of it can generate fines or shutdowns, and the documentation burden (exposure control plans, training records, waste manifests) is ongoing. An operator who is not temperamentally suited to paperwork and compliance will eventually get burned, and "I didn't know" is not a defense.

**Counter 5 — Property-damage liability is inherent to the work, not an edge case.** Media drift pits windows and etches vehicles; over-aggressive blasting warps panels and gouges soft substrates; runoff and spent media create environmental claims. Containment reduces but never eliminates the risk. One bad job near a parking lot full of cars can produce a claim that exceeds a year's profit, and generic insurance policies frequently exclude exactly these scenarios. The risk surface is large and always present.

**Counter 6 — Margins are exposed to input-cost volatility you do not control.** Diesel and abrasive media are the two biggest variable costs, and both are commodity-priced and volatile. A diesel price spike or a media supplier price increase compresses margin on every fixed-price job already on the books. Operators on thin pricing have no buffer for this.

**Counter 7 — The competitive floor is irrational.** Layer-1 part-timers with cheap rigs, no real insurance, and no compliance will undercut you on price, anchor customer expectations downward, and force you to spend marketing energy *educating* customers on why your higher price is legitimate. They go out of business regularly — but there is always a new one, and the price-shopping customer they trained does not magically become sophisticated.

**Counter 8 — It is a job that is hard to turn into an asset.** Many mobile blasting businesses never escape owner-dependence. The founder is the best blaster, the estimator, the salesperson, and the relationship — and a buyer sees that and discounts accordingly. Building something that sells for a real 2.2x-3.5x SDE multiple requires crews, processes, recurring contracts, and clean books that most operators never build. The realistic outcome for the median entrant is a decent income that ends when they stop, not a sellable enterprise.

**Counter 9 — Equipment downtime hits revenue directly and immediately.** When the compressor dies in peak season, you do not bill — and the repair is expensive and the parts may not be local. A lean used-rig entry compounds this risk. There is no SaaS-style "the servers keep running while I sleep"; the business stops when the machine stops.

**Counter 10 — Hiring and retention in dirty, hot, safety-critical labor is genuinely hard.** The first-helper hire is the key to escaping the solo revenue ceiling, but turnover in this kind of labor is high, training on supplied-air and pressure safety is non-trivial, and a careless employee is a liability you carry. Workers' comp is a real cost. Many operators stay solo not by choice but because they cannot keep reliable help.

**Counter 11 — Customer concentration is a seductive trap on the commercial side.** The commercial segment that smooths seasonality and grows revenue also tempts you toward a few big accounts. Land two large fleet or property-manager contracts and they can become 40-50% of revenue — and losing one becomes a crisis. The thing that makes the schedule predictable is also the thing that makes the business fragile.

**Counter 12 — Better-fit alternatives exist for the same person and capital.** Someone with $90K-$160K and a tolerance for trade work could start a fixed blast-and-coat shop (weather-independent, year-round), a different equipment-based trade with less regulatory exposure, or buy an existing cash-flowing service business outright. Mobile blasting is *a* good option for the right operator in the right market — it is not automatically the best use of that capital and risk tolerance, and a founder defaulting to it because the before/after videos look satisfying is making an emotional decision, not an analytical one.

**The honest verdict.** Starting a mobile blasting business in 2027 is a strong move for a founder who is: adequately capitalized with real reserve, mechanically capable, physically suited to hard outdoor work, disciplined about pricing and collections, temperamentally fine with ongoing compliance paperwork, located in a market with genuine equipment/fleet/residential density and only a few strong competitors, and clear-eyed about seasonality. For that person, the high margins and weak serious competition make it genuinely attractive. For anyone weak on capital, compliance stomach, physical fit, or market density, the trade will expose that weakness fast and expensively. Do it if you fit the profile — but go in having honestly answered every counter above, not just the bull case.

`;

const links = `

## Related Pulse Library Entries

- **q9628** — How do you start a powder coating business in 2027? (The natural downstream coatings business; many blasters add powder coating to capture the finishing work.)
- **q9629** — How do you start a rental property bookkeeping business in 2027? (Canonical deep-rewrite structure reference; vertical-specialization playbook parallels.)
- **q9626** — How do you start a pressure washing business in 2027? (Adjacent mobile exterior-services trade with overlapping equipment and customers.)
- **q9625** — How do you start a mobile detailing business in 2027? (Adjacent mobile-services model; similar Facebook-video lead engine.)
- **q9630** — How do you start an auto body shop in 2027? (Key referral partner — body shops without booths send blasting work out.)
- **q9631** — How do you start a welding and fabrication business in 2027? (Both a referral source and a natural add-on host for a blasting rig.)
- **q9632** — How do you start a mobile welding business in 2027? (Closely adjacent mobile trade; shared customer base in ag and fleet.)
- **q9633** — How do you start an equipment restoration business in 2027? (Restoration customers are a core blasting segment.)
- **q1946** — How do you start a real estate investing business in 2027? (Property-investor customers needing exterior surface prep.)
- **q1947** — How do you start a property management business in 2027? (Recurring commercial customer — fencing, structures, parking areas.)
- **q9601** — How do you start a fleet maintenance business in 2027? (Adjacent service capturing the same fleet-truck customers.)
- **q9602** — How do you start a commercial painting business in 2027? (Downstream partner — painters need blasted, prepped surfaces.)
- **q9603** — How do you start a graffiti removal business in 2027? (Overlapping municipal and commercial service line.)
- **q9604** — How do you start a concrete coatings business in 2027? (Adjacent coatings trade; shared substrate-prep knowledge.)
- **q9605** — How do you start a sandblasting shop in 2027? (The fixed-facility counterpart and partial competitor to mobile blasting.)
- **q9606** — How do you start a marine services business in 2027? (Boat-hull and dock blasting segment.)
- **q9607** — How do you start a deck restoration business in 2027? (Residential segment overlap.)
- **q9501** — How do you start a bookkeeping business in 2027? (For setting up the financial back office of a trade business.)
- **q9502** — How do you start a CPA firm in 2027? (Tax and entity-structure support for contractor businesses.)
- **q9701** — How do you price trade-service jobs profitably? (Deep dive on the cost-model and margin discipline referenced throughout.)
- **q9702** — How do you market a home-services business on Facebook? (Deep dive on the before/after video lead engine.)
- **q9703** — How do you use Google Business Profile for local services? (Local-search discovery deep dive.)
- **q9704** — How do you handle OSHA compliance as a small contractor? (Written exposure control plan and safety program deep dive.)
- **q9705** — How do you get contractor insurance without coverage gaps? (GL, inland marine, pollution, and workers' comp deep dive.)
- **q9706** — How do you hire and retain trade labor in 2027? (First-helper and crew-building deep dive.)
- **q9707** — How do you manage seasonality in a trade business? (Winter-plan and cash-reserve deep dive.)
- **q9708** — How do you handle hazardous waste as a small contractor? (Lead/chromium debris and TCLP testing deep dive.)
- **q9709** — How do you choose field service management software? (Jobber vs Housecall Pro deep dive.)
- **q9710** — How do you sell a trade-service business? (Exit-strategy and SDE-multiple deep dive.)
- **q9801** — What is the future of skilled trades in 2030? (Long-term outlook context.)
- **q9802** — How will AI change field-service businesses by 2030? (AI-in-the-business-layer outlook context.)

`;

const tags = ['mobile-blasting','dustless-blasting','sandblasting','surface-prep','trade-business','small-business','osha-silica','equipment-restoration','field-services','2027'];

const sources = [
  { title: 'OSHA Respirable Crystalline Silica Standard for Construction — 29 CFR 1926.1153', url: 'https://www.osha.gov/silica-crystalline/construction' },
  { title: 'EPA Renovation, Repair and Painting (RRP) Rule — 40 CFR Part 745', url: 'https://www.epa.gov/lead/renovation-repair-and-painting-program' },
  { title: 'DustlessBlasting (MMLJ Inc.) — Equipment and Owner Program Documentation', url: 'https://www.dustlessblasting.com' }
];

const notes = {
  s6: 'Added 36 cited sources: OSHA respirable crystalline silica standards (1926.1153 / 1910.1053) and abrasive blasting hazard guidance, NIOSH silica and CO exposure alerts, EPA RRP lead rule and RCRA hazardous-waste determination, state air-permitting context, equipment manufacturer documentation (DustlessBlasting, Graco EcoQuip, Doosan/Ingersoll Rand, Atlas Copco, Sullair, Clemco), abrasive media data (crushed glass, garnet, coal slag, soda), SSPC/AMPP surface-prep standards, ASME pressure-vessel code, SBA entity guidance, FMCSA/DOT weight rules, contractor insurance resources, field-service software docs, and BizBuySell SDE-multiple benchmarks.',
  s7: 'Added comprehensive numbers block: market sizing (TAM ~$4-7B, regional SAM $3-12M, single-rig SOM $120K-$250K, multi-rig $700K-$1.3M), three-tier startup-cost structure ($18K-$45K lean / $65K-$110K standard / $110K-$140K+ premium plus all-in launch figures), equipment specs (185-750 CFM compressor sizing, nozzle air consumption, pot sizes), four-model pricing ($150-$275/hr, $3-$9/sq ft, $150-$500 mobilization, $350-$750 minimums), media cost ranges, a fully worked representative 2-day farm-equipment job ($4,200 revenue, ~$850-$1,450 direct cost, 65-80% gross), the 25-35 billable-hour reality, 5-year revenue trajectory ($90K-$180K Y1 to $500K-$1.3M Y4-5), OSHA/regulatory thresholds (50/25 µg/m³ silica), insurance cost ranges, hiring economics, and exit multiples (2.2x-3.5x SDE).',
  s8: 'Added 12-element counter-case: the high and unforgiving capital wall with thin used-equipment resale, brutal underestimated seasonality, severe physical toll and career-length limits, permanent ongoing regulatory overhead (OSHA/EPA/RCRA/DOT documentation), inherent property-damage liability with frequent insurance exclusions, margin exposure to diesel and media commodity volatility, an irrational price-cutting competitive floor, the difficulty of turning the job into a sellable asset, direct revenue impact of equipment downtime, hard hiring and retention in dirty safety-critical labor, the customer-concentration trap on the commercial side, and better-fit alternative uses of the same capital and risk tolerance — closing with an honest verdict on who should and should not enter.',
  s9: 'Cross-linked 31 related Pulse entries: adjacent mobile and exterior trades (pressure washing, mobile detailing, mobile welding, graffiti removal, deck restoration, marine services), downstream and partner coatings/finishing businesses (powder coating, commercial painting, concrete coatings, sandblasting shop), referral-partner trades (auto body, welding/fabrication, equipment restoration, fleet maintenance), customer-side businesses (real estate investing, property management), back-office entries (bookkeeping, CPA firm), operational deep-dive entries (job pricing, Facebook marketing, Google Business Profile, OSHA compliance, contractor insurance, trade hiring, seasonality, hazardous waste, field-service software, selling a trade business), and 2030 outlook entries.',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the mobile blasting business startup playbook for 2027. Exactly two mermaid diagrams: a customer-journey flowchart (surface-prep pain trigger through discovery channels, qualification, estimate, execution, and repeat/referral revenue) and a lean-vs-standard-vs-premium rig-entry decision matrix (capital gate through season-one results to the scale/plateau/coatings/sell strategic fork). Full coverage of the actual question "How do you start a mobile blasting business in 2027?": service definition (dry vs dustless/wet vs soda vs specialty media), market sizing (TAM/SAM/SOM), five-segment ICP (ag/equipment, residential, automotive/restoration, light commercial/industrial, marine), the default-playbook trap, three-tier startup costs, full equipment stack (compressor/pot/media/respiratory/containment), abrasive media selection and cost management, four pricing models plus mobilization and minimum charges, fully worked unit economics, 5-year revenue trajectory, the Facebook-video-driven lead-generation engine, end-to-end operational workflow, hiring sequence solo to crews, licensing/legal/permits/compliance, the central OSHA respirable-silica standard and why dustless wins, the full insurance coverage stack, competitive landscape (five layers), five named real-world scenarios (rural ag wedge, residential dustless specialist, under-capitalized cautionary tale, commercial scale-up, existing-business add-on), risk mitigation, exit strategy and SDE multiples, owner-lifestyle reality, the surrounding software/tooling stack, common year-one mistakes, a six-question decision framework, a five-year and AI outlook, and a final five-move framework. Includes 36 cited sources, a comprehensive numbers block, a 12-element counter-case, and 31 cross-links.'
};

runPolish({ id: 'q9627', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
