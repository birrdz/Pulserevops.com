// q9587 — How do you start a mobile bike repair business in 2027?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** To start a mobile bike repair business in 2027, run a **van-based, route-dense service** that goes to the customer instead of making the customer come to you — the entire value proposition is convenience, and your margin lives in **labor-only repairs at $95-$145/hour effective rate** with parts marked up 35-55%. Do **not** open a storefront; the whole point is escaping retail rent. The winning ICP is **e-bike commuters and households in dense suburban or urban-adjacent ZIP codes** — e-bikes are now 18-24% of the US bike market and their owners are 3-4x more likely to pay a $50-$120 trip premium because the bikes are heavy, expensive ($1,800-$6,000), and a pain to haul to a shop. Startup cost is **$18,000-$45,000**: a used cargo van or upfitted Sprinter ($8,000-$28,000), a mobile workstand and tool kit ($2,500-$5,000), a starter parts inventory ($2,000-$4,500), insurance and licensing ($1,500-$3,500), and scheduling/payment software ($600-$1,800/year). Price with a **flat trip fee ($35-$75) plus tiered tune-up packages ($95 basic, $165 standard, $285 premium)** and an **e-bike diagnostic surcharge ($45-$95)**. Year-1 realistic revenue solo: **$55,000-$95,000** working 30-40 billable hours/week across 6-10 stops/day; Year-3 with one hired mechanic and a second van: **$180,000-$320,000**; Year-5 ceiling as a 3-4 van fleet: **$450,000-$750,000** before you must decide between staying a regional operator or selling to a local bike-shop group (2.0-3.2x SDE). Lead generation is **route-clustered**: HOA and apartment-complex partnerships, corporate campus "bike day" contracts, Strava/local cycling clubs, Google Local Services, and recurring B2B fleet contracts (e-bike delivery fleets, bike-share operators, hotels, universities). The biggest 2027-specific tailwind is the **e-bike installed base** — millions of out-of-warranty e-bikes whose owners have no local shop willing or trained to service them — and the biggest risk is **route inefficiency**: a mobile mechanic who books badly spends 50% of the day driving, which silently destroys the unit economics that look great on paper.`;

const core = `

## Why Mobile Bike Repair Is a Real Business in 2027, Not a Hobby

Mobile bike repair has quietly graduated from a gig-economy side hustle into a defensible small business, and the reason is structural, not sentimental. Three forces converged between 2022 and 2027. First, **the e-bike installed base exploded** — US e-bike unit sales ran roughly 880K-1.1M per year through the mid-2020s, and the cumulative installed base of e-bikes in American garages is now somewhere between 6M and 9M units. Those bikes weigh 45-75 lbs, cost $1,800-$6,000, and their owners overwhelmingly bought them online (Rad Power, Aventon, Lectric, Ride1Up, Velotric) or at big-box stores with no service department. There is a massive, growing pool of expensive machines with no natural service home. Second, **the traditional bike shop count kept shrinking** — the US independent bike dealer (IBD) count fell from roughly 6,000+ in the early 2010s to an estimated 2,800-3,400 by 2026, accelerated by the post-pandemic demand crash of 2022-2023 that bankrupted or consolidated hundreds of shops. Service deserts opened up across entire suburban counties. Third, **consumer expectations around "comes to me" service hardened** — the same household that gets groceries, packages, and food delivered now expects a mechanic to show up in the driveway, and will pay a premium for it.

The result is a niche where a solo founder with $20K-$40K and mechanical aptitude can build a $60K-$90K Year-1 income, and a disciplined operator can build a $400K-$700K multi-van regional service company within five years. It is not a get-rich-quick business and it is not passive, but it is real. The failure mode is almost never "no demand" — it is poor route discipline, underpricing the trip fee, or trying to be a generalist when the money is in e-bikes and recurring B2B contracts. This answer walks the full operator playbook: market sizing, ICP, the pricing trap most new mobile mechanics fall into, the van and tool stack, lead generation channels that actually fill a route, the daily operational workflow, hiring, the Year-1 through Year-5 trajectory, licensing and insurance, competitors, five named real-world scenarios, risk mitigation, exit options, the owner-lifestyle reality, the common Year-1 mistakes, a decision framework, and the 2027-2032 outlook.

## Market Sizing: TAM, SAM, and the Slice You Can Actually Reach

Start with the top line. The total US bicycle market — new bikes, parts, accessories, and service — runs roughly $7B-$9B annually depending on the year and the source (the post-2021 boom inflated figures, the 2022-2023 correction deflated them). Of that, **service and repair revenue is approximately $1.2B-$1.8B** — call it 15-22% of the total, and that share has been rising as the new-bike segment softened and the installed base aged. That $1.2B-$1.8B service pool is your true addressable market (TAM).

Now segment it. Roughly 55-65% of that service revenue still flows through brick-and-mortar IBDs and the service counters of REI, Trek-owned stores, and Specialized concept stores. Another 10-15% flows through big-box and online-adjacent service (Walmart assembly, Amazon-affiliated mobile assembly networks). That leaves a **serviceable addressable market (SAM) for independent mobile operators of roughly $180M-$320M today, growing 12-20% annually** as the channel matures and the e-bike base ages out of warranty. Mobile is still under 8% of total US bike service revenue in 2027 — in mature urban markets like Portland, Denver, Austin, Seattle, and the SF Bay Area it is closer to 12-18%, which is the leading edge of where every metro is heading.

Your serviceable obtainable market (SOM) — what one operator can actually capture — is geographic and route-bound. A single van working a dense metro can realistically service **a 12-18 mile operating radius** before drive time eats the day. Inside that radius, in a metro of 400K-1M people, you are looking at roughly **35,000-90,000 households that own at least one bike**, of which maybe 8,000-20,000 own an e-bike or a bike worth more than $800 (your real customer). Capturing even 2-4% of that as annual or semi-annual service customers — 300-700 active accounts — is a full solo route. Two vans can cover 600-1,400 accounts. The math is not about market size; it is about route density inside a small radius.

The single most important market-sizing insight: **do not think nationally, think in a 15-mile circle.** Your business is the circle. A founder in a dense, affluent, bike-cultured circle (Boulder, Marin County, Cambridge MA, Bend OR) has a far easier path than one in a sprawling low-density circle, even though the "national TAM" is identical. Pick your circle deliberately.

## ICP Segmentation: Who Actually Pays the Trip Premium

Not every bike owner is your customer. The trip fee — the $35-$75 you charge just to show up — is the filter. Segment the market by willingness to pay that premium.

**Segment 1 — E-bike commuters and recreational e-bike households (your primary wedge).** Owners of $1,800-$6,000 e-bikes, age 35-65, household income $90K-$250K, in dense suburban or urban-adjacent ZIPs. They cannot easily transport a 60 lb e-bike to a shop, the nearest shop may refuse to work on their brand, and they perceive the bike as a serious asset worth maintaining. They will pay a $50-$95 trip fee without blinking and book $165-$350 service tickets. **This is 50-65% of your revenue and you should orient the entire business around them.**

**Segment 2 — Affluent enthusiast cyclists (high-value, lower-frequency).** Owners of $3,000-$12,000 road, gravel, and mountain bikes. They are mechanically literate, they have opinions, and they often do their own basic work — but they will pay you for suspension service, drivetrain overhauls, wheel builds, and pre-event tune-ups because their time is worth more than the wrench work. Average ticket $180-$450. They cluster in cycling clubs and Strava segments. **15-25% of revenue.**

**Segment 3 — Family/casual households (volume, low margin).** Two adults, two kids, four department-store or mid-tier bikes that need brake adjustments, flat repairs, and seasonal tune-ups. Average ticket $90-$180 for a multi-bike visit. The trip fee is more of a hurdle here, so you win them with **multi-bike-visit pricing** ("$45 trip covers up to 4 bikes at one address"). **10-20% of revenue, and great for route density** because one stop services four bikes.

**Segment 4 — B2B recurring fleets (the stability layer).** E-bike delivery fleets (food and parcel), bike-share and scooter-share operators, hotels and resorts with guest-bike fleets, universities, corporate campuses with employee-bike programs, apartment complexes with amenity bike fleets, and municipal/parks bike fleets. These are **contract revenue** — monthly retainers or per-bike service agreements — and they are the difference between a feast-or-famine seasonal business and a stable one. **10-25% of revenue, and you should aggressively grow this to 30-40% by Year 3.**

**Segment 5 — One-time online-purchase assembly (the on-ramp, not the destination).** Someone bought a bike-in-a-box from Amazon or a direct-to-consumer brand and wants it assembled correctly. Flat fee $75-$150. These are not loyal customers, but the assembly visit is a chance to capture them into Segment 1 or 3. Treat it as lead generation, not a business line.

The discipline: **build your route and your marketing around Segments 1 and 4.** Segments 2 and 3 fill the gaps and add density. Segment 5 is a funnel. A founder who chases "anyone with a bike" ends up driving 90 minutes for a $25 flat repair and wondering why the business does not make money.

## The Default-Playbook Trap: Why "Just Be a Cheaper Bike Shop on Wheels" Fails

Here is the single most expensive mistake new mobile bike mechanics make, and it is worth its own section because almost everyone falls into some version of it.

The default playbook goes like this: "Bike shops charge a lot and make you wait two weeks. I will be a mobile mechanic, charge a bit less because I have no rent, offer faster service, and undercut them." It sounds logical. It is a trap, and here is why.

**First, you do have overhead — it is just mobile overhead.** A van costs $400-$900/month in payments, $150-$350/month in fuel, $80-$200/month in maintenance and tires, plus commercial auto insurance at $1,800-$4,500/year. Your "no rent" advantage is largely an illusion; you traded fixed rent for variable vehicle cost, and vehicle cost scales with the miles you drive, which a bike shop never pays.

**Second, you can only do one job at a time.** A bike shop has three mechanics working three stands simultaneously and a service writer at the counter taking in five more bikes. You are one person, one stand, and you cannot take in the next job until you finish and drive to it. Your throughput ceiling is structurally lower, so your hourly rate has to be **higher**, not lower, than the shop's.

**Third, the convenience IS the product — so price for it.** Customers are not paying you to be a cheaper bike shop. They are paying you to not load a 60 lb e-bike into an SUV, drive to a shop, drop it off, arrange a ride home, wait ten days, and arrange a ride back. That entire chain of hassle is worth $50-$120 to the right customer. If you price below the shop, you are leaving the actual value on the table and you are training customers to think of you as the budget option.

The correct playbook inverts the default: **charge a real trip fee, charge an effective labor rate of $95-$145/hour (higher than most local shops), and compete on convenience, responsiveness, and e-bike competence — never on price.** The mobile operators who make $80K+ in Year 1 are almost always the ones who priced like a premium service from day one. The ones who fold in Year 2 are almost always the ones who tried to undercut the shops and discovered that "no rent" did not mean "no costs" and that being a one-person operation meant they could never out-throughput a real shop.

A related sub-trap: **do not try to carry a full shop's inventory in the van.** You cannot. A bike shop stocks thousands of SKUs. Your van carries the 150-300 fastest-moving consumables and common parts; everything else you order and schedule a return visit (which is a second trip fee). Trying to be a "complete shop on wheels" overloads the van, ties up cash in dead inventory, and slows you down.

## Pricing Models: Trip Fee, Tiered Packages, and the E-Bike Surcharge

Pricing is where this business is won or lost. There are four components, and you need all four.

**Component 1 — The trip fee ($35-$75).** This is non-negotiable and it is charged on every visit regardless of what work is done. It covers your drive time, fuel, and the structural reality that you can only be in one place at once. Set it by market: $35-$45 in dense affordable metros, $55-$75 in affluent low-density or premium markets. Make it **waivable above a service threshold** ("trip fee waived on tickets over $200") to encourage bigger jobs, or **multi-bike-shareable** ("$45 covers up to 4 bikes at one address") to encourage household and B2B density. The trip fee is also your route-discipline tool — it makes the math work even on a short job.

**Component 2 — Tiered tune-up packages (the revenue backbone).** Productize three tiers so customers self-select and you stop quoting every job from scratch:
- **Basic Tune ($85-$110):** brake and shift adjustment, tire pressure, drivetrain wipe-down, safety check, lube. 35-45 minutes.
- **Standard Tune ($150-$190):** everything in Basic plus wheel truing, full drivetrain clean and lube, cable tension check, bearing check, minor part adjustment. 60-80 minutes.
- **Premium/Overhaul ($265-$340):** everything in Standard plus hub/bottom-bracket/headset service, full cable and housing replacement option, deep clean, brake bleed (hydraulic). 100-140 minutes.
Parts beyond consumables are extra at marked-up retail.

**Component 3 — The e-bike diagnostic and service surcharge ($45-$95).** E-bikes require a different skill set: motor diagnostics, battery health checks, controller and display troubleshooting, torque-sensor calibration, firmware awareness. Most local shops either will not touch them or do a bad job. This is your highest-margin, most-defensible work. Charge a diagnostic surcharge on top of the tune tier, and charge separately for motor/battery/controller labor at $110-$150/hour. Brand-specific competence (Bosch, Bafang, Shimano STEPS, Hydrive, Yamaha) is worth a premium.

**Component 4 — Parts markup (35-55%).** You buy from distributors (QBP, J&B Importers, Hawley/BTI, Olympic) at wholesale and mark up. Consumables (tubes, cables, brake pads, chains, cassettes) at 45-55%; bigger components at 35-45%. Be transparent about it — customers expect a parts margin — but never pretend you are doing parts at cost.

**On recurring revenue:** offer an **annual membership ($120-$240/year)** that bundles two tune-ups, priority scheduling, and a discounted trip fee. Memberships smooth seasonality and lock in route density. For B2B, price **per-bike monthly service agreements ($8-$25/bike/month depending on usage intensity)** — a 40-bike hotel fleet at $15/bike is $600/month of contracted recurring revenue from one account.

**Effective hourly rate is the number that matters.** Add up trip fee, labor, parts margin, and divide by clock hours including drive time. Healthy is **$95-$145/hour effective** in Year 1 solo. If you are under $80, your routing or pricing is broken.

## Startup Costs and Unit Economics: What $18K-$45K Actually Buys

Here is the realistic startup budget, low and high end.

**The van ($8,000-$28,000).** The single biggest line. Options: a used high-roof cargo van (Ford Transit, Ram ProMaster, Mercedes Sprinter) with 80K-150K miles runs $14,000-$28,000; a used minivan or smaller cargo van (Transit Connect, ProMaster City) runs $8,000-$16,000 and works for a solo operator with a tight tool kit. Buy used. A new upfitted van is $45K-$70K and is a Year-3 decision, not a Year-1 decision. Budget another $1,500-$5,000 for upfit: shelving, a secured workstand mount, lighting, a power station or dual-battery setup, and exterior wrap/signage (the wrap is also your best rolling advertisement — $1,800-$3,500).

**Tools and workstand ($2,500-$5,500).** A pro-grade portable repair stand (Park Tool, Feedback Sports), a full mechanic's tool kit (torque wrenches, bottom bracket and cassette tools, bleed kits for major hydraulic brake brands, a truing stand, a wheel dishing tool), an air compressor or high-volume floor pump, and e-bike-specific diagnostic tools and cables. Do not cheap out on torque wrenches and bleed kits — warranty-quality work depends on them.

**Starter parts inventory ($2,000-$4,500).** The 150-300 fastest movers: tubes in common sizes, tires, brake pads (organic and metallic, common pad shapes), chains, cassettes, cables and housing, bar tape, grips, common bearings, sealant, lube, cleaning supplies. Resist the urge to over-stock.

**Insurance, licensing, and legal ($1,500-$3,500 to start).** Commercial auto insurance, general liability, an LLC formation, a business license, and a sales-tax permit. (Full detail in the licensing section.)

**Software and systems ($600-$1,800/year).** Scheduling and dispatch software, payment processing (a mobile card reader), accounting software, a simple website, and a Google Business Profile. (Detail in the tooling section.)

**Working capital and marketing ($2,000-$5,000).** Three months of cushion plus initial marketing: wrap, business cards, door hangers, club sponsorships, and Google Local Services setup.

**Total: $18,000 lean (smaller van, used everything) to $45,000 comfortable (good Sprinter, full upfit, deeper inventory).** Many operators start at the $20K-$28K mark.

**Unit economics per job.** A Standard Tune at $170 with $25 of parts: subtract ~$8 fuel/vehicle cost allocated, ~$25 parts cost, ~$6 software/processing — gross contribution is roughly $130 on ~75 minutes of work plus ~25 minutes of drive time. That is the engine. Six to ten such jobs a day, 5-6 days a week in season, is the Year-1 business.

## The Van: Buy, Upfit, and Outfit Decisions

The van is your shop, your brand, and your biggest fixed asset, so the decisions matter.

**Size.** A solo operator can run a compact cargo van (Transit Connect, ProMaster City, even a well-organized minivan). It is cheaper to buy, cheaper on fuel, easier to park in dense neighborhoods, and forces inventory discipline. The downside is limited room and you often work outside the van. A full-size high-roof van (Transit, Sprinter, ProMaster) lets you **work inside** in bad weather, carry more inventory, and looks more professional — it is the right call if your market has real winters or if you plan to scale to a fleet and want a consistent vehicle platform. Most operators who plan to grow buy full-size from the start or by van #2.

**New vs used.** Buy used for van #1, full stop. A van with 90K-130K miles and good maintenance records is fine and saves $20K-$40K. Diesel Sprinters have longevity but expensive repairs; gas Transits and ProMasters are cheaper to maintain. Whatever you buy, get a pre-purchase inspection.

**Upfit.** Priorities, in order: (1) a securely mounted, fast-deploy workstand; (2) organized, labeled parts storage that does not become a landslide on every turn; (3) good lighting (LED strip lighting transforms inside-the-van work); (4) power — a portable power station or dual-battery system for the compressor, lights, and device charging; (5) a small awning or pop-up canopy for working outside in sun or light rain; (6) climate consideration — a roof vent fan at minimum. Keep it modular: you want to be able to replicate the upfit on van #2 and #3.

**The wrap.** A full or partial vehicle wrap with your name, services ("Mobile Bike & E-Bike Repair"), phone, and a QR code to book is the single best-value marketing you will ever buy. It advertises in every driveway and at every stoplight. Budget $1,800-$3,500 for a quality wrap. A magnetic-sign-on-a-plain-van look reads as amateur; a real wrap reads as a real business.

## The Tooling and Equipment Stack: Software, Diagnostics, and Systems

Beyond hand tools, the systems stack is what lets a mobile operator run a tight route and not drown in admin.

**Scheduling and dispatch.** This is the operational core. Options range from field-service-management platforms (Jobber, Housecall Pro, ServiceTitan-class tools) to bike-specific or lightweight booking tools. You need: online self-booking, route-aware scheduling (so the system clusters stops geographically), automated reminders, and a customer database with service history per bike (serial numbers, what you did, what is coming due). Budget $40-$200/month.

**Payment processing.** A mobile card reader (Square, Stripe, or your FSM tool's built-in processor), plus the ability to text invoices and take payment links. Tap-to-pay on a phone is now standard. Processing runs ~2.6-3.0%.

**Accounting and tax.** QuickBooks Online or Xero, a separate business bank account, a mileage tracker (this is a big deduction — track every mile), and a relationship with a bookkeeper or accountant by the time you have real revenue.

**Inventory.** Even a small van benefits from simple inventory tracking — many FSM tools include it, or a basic spreadsheet works at first. Know your fastest movers and your reorder points.

**Customer communication.** Automated "on my way" texts, post-service follow-ups, and service-due reminders. The reminder loop ("your e-bike is due for its 6-month service") is a meaningful revenue driver and costs almost nothing.

**Diagnostics for e-bikes.** Brand-specific diagnostic software and cables for the major mid-drive systems (Bosch, Shimano STEPS, Yamaha), plus general battery testing gear and a torque-tool set. Staying current on firmware and service bulletins for the brands in your market is part of the job.

**A website and Google Business Profile.** A simple, fast, mobile-first website with a book-now button, a service-area map, transparent pricing tiers, and reviews. The Google Business Profile is arguably more important than the website for local discovery — keep it complete, photographed, and reviewed.

## Lead Generation: The Channels That Actually Fill a Route

Filling a route is different from "getting customers" — you need customers **clustered geographically** or your drive time destroys you. The channels that work, roughly in order of value:

**Channel 1 — HOA and apartment-complex partnerships.** Pitch property managers and HOA boards on a recurring "bike service day" — you park on-site one day a quarter and residents book slots. One location, a dozen jobs, zero drive time between them. Some complexes will sponsor it as an amenity; others just let you set up. This is the single best route-density tool for a residential operator.

**Channel 2 — B2B recurring contracts.** E-bike delivery fleets, bike-share operators, hotels and resorts, universities, corporate campuses, and parks departments. Cold-pitch fleet managers with a per-bike service agreement. These contracts are revenue stability and route anchors — you build the rest of the day's route around the fleet stop.

**Channel 3 — Google Local Services and Google Business Profile.** When someone searches "mobile bike repair near me," you need to be there with reviews. Google Local Services Ads (the pay-per-lead format) work well for this category. Your GBP with 40+ reviews is a compounding asset.

**Channel 4 — Cycling clubs, Strava, and group rides.** Sponsor a local club, show up at group-ride start points, offer club-member discounts. Enthusiast cyclists (Segment 2) and their networks live here. A mid-ride mechanical support presence at local races and gran fondos is both service revenue and marketing.

**Channel 5 — The van wrap itself.** Every mile you drive is an impression. Park it visibly. A clean, professional wrapped van in affluent neighborhoods generates real inbound.

**Channel 6 — E-bike retailer and direct-to-consumer brand referral.** Many e-bike sellers — local dealers who do not service, and even some DTC brands — have no service answer for customers. Become their referral. Some DTC brands maintain mobile-mechanic networks; get on the list.

**Channel 7 — Neighborhood social (Nextdoor, local Facebook groups, neighborhood newsletters).** Hyper-local, free, and route-relevant. A genuinely helpful presence (not spam) in neighborhood groups converts.

**Channel 8 — Referral and membership flywheel.** Every happy customer in a neighborhood is a node — ask for referrals, offer a referral credit, and the route densifies itself. Memberships lock people in and make referrals more natural.

**Channels that underperform:** broad social-media advertising, billboards, radio, and anything not tied to a tight geography. Newspaper-style awareness advertising is wasted; you need geographically targeted demand.

**Year-1 marketing budget: $3,000-$7,000** — wrap (one-time, ~$2,500), Google Local Services ($150-$400/month), club sponsorships ($300-$1,200), door hangers and print for HOA pushes ($300-$800), and time spent on B2B cold outreach (free but real).

## Operational Workflow: A Day, A Week, A Season on the Route

The daily rhythm of a well-run mobile operation:

**The night before / early morning (20-40 min).** Review the day's booked stops, confirm them with automated texts, check the route order for geographic efficiency, and pull/stage the parts you know you will need. Restock consumables in the van.

**The route (6-10 stops, 6-9 working hours).** Cluster stops tightly. A good day is stops within a 6-12 mile band so drive time between jobs is 8-20 minutes, not 35. Each stop: arrive, assess, confirm scope and price with the customer, work, test, collect payment, log the service history, and send the "on my way" text to the next customer. The discipline is **not overbooking** (which makes you late all day and burns reviews) and **not underbooking** (which wastes the day).

**End of day (20-30 min).** Reconcile payments, note parts used and reorder needs, log any callbacks or follow-ups, and confirm tomorrow.

**Weekly cadence.** One block (often a slower weekday morning or evening) for: ordering parts, invoicing B2B accounts, B2B and HOA outreach, content/reviews, and bookkeeping. One day off — protect it.

**Seasonality is real and must be managed.** In most US markets, March-October is the busy season (50-60% of annual revenue lands in roughly five months) and November-February is slow. Manage it with: (a) B2B contracts that pay year-round, (b) a winter overhaul/storage-prep push ("get it serviced now, skip the spring rush"), (c) indoor-trainer and fit-related services in cold months, (d) memberships that bundle a fall and a spring tune, and (e) simply budgeting — save in season, coast in winter. Operators in Sun Belt markets have a flatter curve; operators in real-winter markets must plan for it deliberately.

## Hiring and Staffing: From Solo to a Two-Van Operation

Year 1 is solo. The first hire is the hardest decision and the biggest inflection point.

**When to hire.** You are ready for a second mechanic when you are consistently turning away work, booked 2-3 weeks out, and your effective hourly rate is healthy enough to absorb a wage. That is usually somewhere in **Month 10-20**.

**Who to hire first.** Two paths. Path A: hire an **experienced mechanic** (from a closing or downsizing shop — there is a steady supply) and put them in van #2 on their own route. Faster revenue, but you are trusting brand quality to someone else immediately and you need a second van. Path B: hire a **part-time helper/apprentice** who rides with you, handles simple work and logistics, and frees you to do more high-value jobs — lower risk, slower scaling. Most operators do Path B first, then Path A.

**Compensation.** Mechanics in this space run **$22-$38/hour** depending on market and skill, sometimes plus a small performance or upsell incentive. Some operators use a commission or revenue-share model per van. Avoid pure commission that incentivizes overselling — it kills the trust that the whole business runs on. Classify correctly: a route mechanic working set hours in your van under your brand is an employee, not a contractor, in almost every jurisdiction. Misclassification is a real liability.

**Van #2.** Each van is its own route and its own P&L. The second van roughly doubles capacity but adds vehicle cost, a wage, and management overhead — net margin per van compresses somewhat versus solo, but total profit grows. The model scales in van increments.

**Roles as you grow.** By the 3-4 van stage you need a **dispatcher/office role** (scheduling, customer service, B2B account management, parts ordering) so the founder is not trying to wrench and run operations simultaneously. This role often pays for itself by raising every van's billable utilization.

## Year 1 Through Year 5: A Realistic Revenue Trajectory

Numbers for a committed founder with solid mechanical skills and good route discipline.

**Year 1 — solo, building the route. Revenue $55,000-$95,000.**
- Months 1-3: van and tools acquired, wrap on, insurance and licensing done, first HOA and B2B pitches out, first 20-50 customers. Revenue light, mostly building.
- Months 4-8: route filling, busy season hits, 5-8 jobs/day, first B2B contract or two, reviews accumulating. This is where most of the year's revenue lands.
- Months 9-12: route established, 6-10 jobs/day in season, slowing for winter, planning the second van. Owner take-home after vehicle and costs: roughly $40K-$70K.

**Year 2 — solo-plus or first hire. Revenue $95,000-$170,000.**
- Route is dense, reputation compounds, memberships and B2B contracts smooth the off-season. First part-time helper or first mechanic hired mid-year. Second van may come online late in the year. Owner take-home: $60K-$110K.

**Year 3 — two vans running. Revenue $180,000-$320,000.**
- Two routes, two mechanics (one may be the founder, increasingly in a hybrid wrench/manage role), B2B contracts now 25-35% of revenue, a real customer database driving reminder revenue. Margins compress with payroll but absolute profit grows. Owner take-home: $90K-$160K.

**Year 4 — three vans, building the back office. Revenue $300,000-$500,000.**
- Third van, a dispatcher/office hire, founder mostly out of the van. Systems and SOPs are now the product. This is the hardest transition — going from "skilled mechanic who owns a van" to "owner of a service company."

**Year 5 — 3-4 van regional operator. Revenue $450,000-$750,000.**
- A small fleet, a stable B2B contract base, a recognized local brand. SDE (seller's discretionary earnings) in the $120K-$280K range depending on how lean it is run. Decision point: stay a lifestyle regional operator, push toward a larger fleet/multi-metro model, or sell.

**The honest caveat:** these are the numbers for operators who price correctly and route well. A founder who underprices the trip fee, chases scattered low-value jobs, and never lands B2B contracts can work just as hard and net $30K — the spread between a good and bad operator in this business is enormous and it is almost entirely about pricing discipline and route density.

## Licensing, Legal, Insurance, and Compliance

Mobile bike repair is a relatively low-regulatory-burden business compared with food or trades like electrical, but the items below are non-optional.

**Business structure.** Form an **LLC** (sometimes an S-corp election later for tax efficiency once profit is solid). It separates personal and business liability and is cheap to maintain.

**Licensing.** A general **business license** in your city/county, a **sales-tax permit/seller's permit** (you sell parts — you must collect and remit sales tax in most states; pure labor is sometimes exempt, sometimes not, depending on the state, so confirm locally), and an **EIN** from the IRS. Some municipalities require a permit for **mobile/vendor businesses operating on streets or in public spaces** — check, especially if you plan to set up at parks, events, or curbside in commercial districts.

**Insurance — the part people skip and regret.**
- **Commercial auto insurance** on the van. Personal auto policies exclude business use; a claim on a personal policy while working will be denied. Budget $1,800-$4,500/year.
- **General liability insurance** — covers property damage and bodily injury claims. A customer trips over your toolbox, a bike falls on a car. $400-$900/year.
- **Garage keepers / tools and equipment coverage** — covers your tools and customers' bikes in your care, custody, and control. Critical: you regularly have $3,000-$6,000 e-bikes in your possession. $300-$800/year.
- **Workers' compensation** — required in almost every state once you have employees. Budget per payroll.
- **Professional liability / errors and omissions** — relevant because bad brake work has real consequences; some operators carry it, especially with employees.

**Liability waivers and documentation.** Use a clear service authorization and a liability acknowledgment, especially for safety-critical work and for declining recommended repairs. Document the bike's condition on arrival (photos), what you did, and what you recommended. This protects you if a customer later claims a failure.

**E-bike specifics.** Battery handling and storage carry real fire risk — follow safe-charging and storage practices, do not stack or store damaged batteries, and know the disposal rules for lithium batteries in your area. Some jurisdictions are tightening e-bike battery regulations; stay current.

**Vehicle and DOT.** A standard cargo van under typical weight thresholds usually does not trigger commercial DMV/DOT requirements, but verify your state's rules on commercial plates, weight, and any mobile-business vehicle requirements.

## Competitor Analysis: Who You Are Actually Up Against

Know your competitive set, because your positioning depends on it.

**Brick-and-mortar independent bike shops (IBDs).** The incumbent. Strengths: full inventory, multiple mechanics, walk-in convenience for some customers, established trust, can sell bikes. Weaknesses: the customer has to come to them, long turnaround in season, many will not or cannot service e-bikes well, shrinking in number. You do not beat them on inventory or price — you beat them on convenience and e-bike competence. Many shops are also potential **partners** (overflow referrals, parts) or **acquirers**.

**Big-box and mass retail service (REI, Trek/Specialized concept stores, Walmart assembly).** REI and brand-owned stores run competent service counters; they are real competition for enthusiast and standard work, less so for the come-to-me e-bike customer. Walmart-style assembly is not real competition for service.

**Other mobile operators.** The category is growing, including small regional independents and some franchise/network models (Beeline Bikes, Velofix, and assorted local franchises and independents have populated this space). In mature metros you will have direct mobile competition. Differentiate on e-bike depth, B2B contracts, responsiveness, and route reliability. In most metros the category is still under-served — there is room.

**DTC brand service networks.** Some e-bike brands run their own mobile or partner-mechanic networks. These can be a competitor or a referral source — often both.

**DIY and YouTube.** A real "competitor" for Segment 2 enthusiasts and for simple work — but it is also a funnel, because DIYers eventually hit a job (suspension service, hydraulic bleed, e-bike motor work, wheel build) they will pay for.

**The honest competitive read:** in 2027, in most US metros, the binding constraint is not competition — it is awareness and route density. The category is young enough that a well-run operator is competing more against "the customer did not know mobile service existed" than against another van.

## Five Named Real-World Scenarios

**Scenario 1 — "Driveway Drivetrain," solo in a dense affluent suburb.** Founder is an ex-shop mechanic, 15 years experience, starts with a used ProMaster City and $24K. Focuses entirely on e-bike households and enthusiast cyclists in a 10-mile radius of affluent ZIPs. Lands two HOA quarterly-service-day partnerships in Month 4. Year 1: ~$78K revenue, ~$58K take-home. Year 2: hires a part-time helper, adds a hotel fleet contract, ~$135K. Year 3: second van and a full-time mechanic, ~$240K. Classic disciplined-niche path.

**Scenario 2 — "Campus Cycle Co.," B2B-anchored from day one.** Founder targets a university town: lands a contract with the campus bike-share-style fleet and two large apartment complexes before even buying inventory. The B2B base covers the van payment and a base income from Month 2; residential work fills the rest of the route. Less feast-or-famine, slower top-end. Year 1: ~$70K but very stable. Year 3: three vans serving three nearby college towns, ~$310K, 40% contract revenue.

**Scenario 3 — "Trailhead Mobile," enthusiast and event focused.** Founder is a mountain-bike racer with a deep suspension-service skill set, in a mountain-town market. Revenue skews high-ticket: suspension overhauls, brake bleeds, race-weekend support. Smaller customer count, higher average ticket ($280+). Strong summer, very slow winter — manages it with a winter ski-town pivot and pre-booked spring overhauls. Year 1: ~$65K. Tops out as a lifestyle solo/duo operation around $160K — deliberately not scaling.

**Scenario 4 — "City Spin Repair," the over-extended cautionary tale.** Founder underprices: $20 trip fee, labor rates below the local shops, takes every job anywhere in a 25-mile radius. Spends half of every day driving. Books too tight, runs late, gets mediocre reviews. Works 55 hours/week and nets ~$34K in Year 1. The lesson: hard work does not fix a broken pricing-and-routing model. Founder either re-prices and tightens the radius in Year 2 — or quits.

**Scenario 5 — "Pedal Fleet Services," the multi-van regional builder.** Founder treats it as a company from the start: full-size Transit, professional wrap, systems-first, hires a mechanic in Month 9, second van Month 14, dispatcher Month 30. Heavy on B2B (delivery e-bike fleets, hotels, two municipal contracts). Year 3: four vans, ~$420K. Year 5: ~$680K, sells to a regional bike-shop group for ~2.6x SDE. The "build to sell" path.

## Risk Mitigation: The Failure Modes and How to Defuse Them

**Risk 1 — Route inefficiency silently eating margin.** The number-one killer. Mitigate with a hard operating radius, route-aware scheduling software, geographic clustering (book by neighborhood-day), HOA/B2B anchors, and a real trip fee. Track drive-time-to-billable-time ratio weekly; if drive time exceeds ~25-30% of the workday, tighten the route.

**Risk 2 — Underpricing.** Mitigate by pricing on convenience from day one, charging an effective $95-$145/hour, never advertising as "cheaper than the shop," and raising rates annually.

**Risk 3 — Seasonality cash crunch.** Mitigate with B2B year-round contracts, memberships, a winter service push, and disciplined in-season saving.

**Risk 4 — The van breaks down.** Your van is a single point of failure. Mitigate with a well-maintained used van, a maintenance reserve, a roadside-assistance plan, and — once you have two vans — built-in redundancy. A backup plan for "van in the shop for three days" matters.

**Risk 5 — E-bike battery fire and liability.** Mitigate with safe charging/storage practices, proper insurance (garage keepers, general liability), staff training, and not taking on damaged-battery work you are not equipped for.

**Risk 6 — Injury to the owner.** It is physical work. A back injury can stop a solo operation cold. Mitigate with good ergonomics (work at proper height, use the stand), disability insurance, and — structurally — building toward a model where the founder is not the only set of hands.

**Risk 7 — Key-customer concentration.** If one B2B contract is 30% of revenue, losing it hurts. Mitigate by diversifying contracts and keeping a healthy residential base.

**Risk 8 — Quality-control drift after hiring.** Your brand is "trustworthy mechanic in the driveway." A sloppy hire damages it fast. Mitigate with documented SOPs, a ride-along training period, callback tracking per mechanic, and a no-overselling compensation structure.

**Risk 9 — Competitor saturation in mature metros.** Mitigate by going deeper on e-bikes and B2B (harder to replicate) rather than competing on generic tune-ups, and by owning a tight geography thoroughly rather than spreading thin.

**Risk 10 — Regulatory change on e-bikes/batteries.** Stay current; it is more likely to create demand (more service, more compliance work) than to kill it, but do not be caught flat-footed.

## Exit Strategy: What This Business Is Worth and to Whom

Most mobile bike repair businesses are **lifestyle businesses** that the founder runs and eventually winds down — and that is a perfectly fine outcome. But there are real exit paths.

**Path 1 — Sell to a local or regional bike-shop group.** A multi-location IBD group may buy a mobile operation to add a service channel, capture e-bike work, and acquire a customer database. Valuation for a small service business like this is typically **2.0-3.2x SDE** — higher if there is recurring B2B contract revenue, a clean customer database, transferable systems, and the business does not depend entirely on the founder's own wrenching.

**Path 2 — Sell to another mobile operator or a regional roll-up.** As the category matures, regional consolidators (and franchise networks) may acquire established routes. Route density, contracts, and brand reputation in a defined geography are what they pay for.

**Path 3 — Owner-operator transition / management buyout.** Train a lead mechanic into a general manager and either sell to them on terms or step back into an absentee-owner role drawing profit. This requires the systems-first build.

**Path 4 — Asset sale / wind-down.** If the business is entirely founder-dependent, the realistic exit is selling the van, tools, and inventory and handing off the customer list — recovering equipment value but not a real multiple.

**What raises the multiple:** recurring revenue (memberships and especially B2B contracts), a documented and transferable operating system, multiple vans not dependent on the founder, a strong reviewed local brand, clean books, and a diversified customer base. A founder thinking about an eventual exit should build for transferability from Year 2 — it costs little and changes the outcome materially.

## Owner Lifestyle: What This Job Actually Feels Like

Be honest with yourself about the day-to-day.

**Solo, Years 1-2.** It is a physical, outdoor-ish, hands-on job. You are driving, lifting bikes, kneeling on driveways, working in heat and cold, talking to a customer at every single stop. It is satisfying for people who like fixing things and like people, and grinding for people who do not. The hours in season are long (45-55 working hours including drive time is common); winter is slower and a relief. Income is real but lumpy. You are the mechanic, the dispatcher, the salesperson, the bookkeeper, and the marketer.

**With a hire, Years 2-3.** The job shifts. You wrench less and manage more — scheduling, training, B2B accounts, quality control, parts. Some founders love this; some miss the simplicity of just being the mechanic. Income is better and the physical toll on you personally is lower.

**Multi-van, Years 4-5.** Now you are running a company. If you built systems, you can be largely out of the van — but you are managing people, vehicles, contracts, and cash. The founders who reach here happily are the ones who actually wanted to build a business, not just a job. The ones who only wanted to wrench often plateau at one or two vans on purpose, and that is a legitimate, good life.

**The freedom question.** The marketing fantasy is "be your own boss, set your own hours." The reality: customers and the route set your hours in season, and the business does not run without you until you have deliberately built it to. The freedom is real but it is earned in Year 3+, not Year 1.

## Common Year-1 Mistakes and How to Avoid Them

**Mistake 1 — No trip fee or a trivial one.** Fix: charge $35-$75 from day one and explain it as the convenience you are selling.

**Mistake 2 — Operating radius too wide.** Fix: pick a tight circle and say no to jobs outside it (or charge a real long-distance surcharge).

**Mistake 3 — Pricing below local shops.** Fix: price at or above shop labor rates; you are a premium convenience service.

**Mistake 4 — Treating e-bikes as a side capability.** Fix: make e-bike competence the core of the brand — it is the durable demand and the premium margin.

**Mistake 5 — Over-stocking the van.** Fix: carry the 150-300 fast movers; order everything else.

**Mistake 6 — No B2B contracts.** Fix: pitch HOAs, complexes, hotels, and fleets in the first 90 days — they anchor the route and smooth the season.

**Mistake 7 — Overbooking the day.** Fix: leave realistic time per job plus drive buffers; running late all day kills reviews.

**Mistake 8 — Skipping commercial insurance.** Fix: get commercial auto, GL, and garage keepers coverage before the first paid job.

**Mistake 9 — No service-history database.** Fix: log every bike and customer; the reminder loop is free recurring revenue.

**Mistake 10 — Personal and business finances mixed.** Fix: separate bank account, accounting software, mileage tracking, LLC, from day one.

**Mistake 11 — Cheap tools on torque-critical work.** Fix: invest in proper torque wrenches and bleed kits; warranty-quality work depends on it.

**Mistake 12 — No winter plan.** Fix: budget for the slow season and build year-round revenue (contracts, memberships, winter overhaul push) before the first November.

## A Decision Framework: Should You Start This Business?

Run yourself through these gates honestly.

**Gate 1 — Skill.** Can you do the full range of bike service competently, including hydraulic brakes, wheel work, and at least basic e-bike motor/battery diagnostics? If not, can you realistically get there fast (formal training, shop experience, manufacturer courses)? If you cannot wrench at a professional level, this is not your business yet.

**Gate 2 — The circle.** Is there a tight, reachable geography near you with enough bike-owning, e-bike-owning, premium-paying households and/or B2B fleet density? Map it. If your circle is low-density and low-income, the model struggles regardless of effort.

**Gate 3 — Capital.** Can you fund $18K-$45K plus 2-4 months of personal runway? Underfunding forces bad decisions (a worse van, no insurance, no marketing).

**Gate 4 — Temperament.** Are you comfortable being the salesperson at every stop, doing physical work in the elements, handling lumpy seasonal income, and running the admin? It is not a quiet workshop job.

**Gate 5 — Ambition fit.** Do you want a solo lifestyle business (great — keep it lean and tight) or a multi-van company (great — build systems from day one)? Either is valid, but know which one you are building.

If you pass all five gates, this is a genuinely good 2027 business with a real tailwind. If you fail Gate 1 or Gate 2, fix that first or pick a different business. If you fail Gate 3, wait and save. If you fail Gate 4, this specific business will make you miserable even if it makes money.

## The 2027-2032 Outlook: AI, E-Bikes, and Where the Category Goes

**The e-bike tailwind keeps blowing.** The installed base is still growing and, critically, **aging out of warranty**. Every year, millions more e-bikes cross from "manufacturer handles it" to "owner needs an independent mechanic." Mid-drive systems are getting more sophisticated and more in need of trained service, not less. This is the durable demand driver through 2032.

**Bike shop consolidation continues.** The IBD count is unlikely to recover to pre-2010s levels. Service deserts persist and spread. Mobile fills the gap — the channel's share of total bike service is likely to roughly double from its current single digits over five years.

**B2B demand grows fastest.** E-bike delivery fleets, micro-mobility operators, and institutional fleets (hotels, universities, municipalities, corporate campuses) are expanding. Fleet service contracts are the highest-growth, most-defensible revenue in the category.

**AI changes the back office, not the wrench.** AI will not fix a bike in a driveway. What it will do: make scheduling and route optimization dramatically better (tighter routes, less drive time — a direct margin gain for disciplined operators), improve diagnostics (AI-assisted fault identification from symptom descriptions and error codes), automate customer communication and reminders, and lower the admin burden that currently caps how many vans one founder can run. The operators who adopt AI scheduling and diagnostics early will out-route the ones who do not. The physical service itself stays human and stays local — which is exactly why this is an AI-resilient business.

**Possible headwinds.** A sharp recession dents discretionary bike spending and slows new e-bike sales (though it can *increase* repair demand as people keep bikes longer). Tightening e-bike battery regulation adds compliance work — net positive for trained operators, a hassle for everyone. Increased mobile competition in mature metros compresses pricing for generic work — which is exactly why depth (e-bikes, B2B, a thoroughly-owned tight geography) beats breadth.

**Net outlook:** mobile bike repair in 2027 sits on a multi-year structural tailwind — a large and growing installed base of service-needy e-bikes, a shrinking traditional service channel, and consumer demand for come-to-me convenience. It is AI-resilient because the core work is physical and local. It is not a passive or easy business, and the gap between a well-run and a poorly-run operation is enormous, but for a skilled mechanic who picks a good circle, prices for convenience, routes with discipline, and builds B2B contracts, it is one of the more attractive small-business starts available going into the 2030s.

## The Final Framework: Five Rules That Decide Whether You Make Money

Everything above compresses into five operating rules. Internalize these and the business works; violate them and it does not, no matter how hard you work.

**Rule 1 — Sell convenience, not discount.** The customer is paying you to come to them. Price like it. Trip fee on every visit, effective labor rate at or above the local shops, never the budget option.

**Rule 2 — Own a tight circle.** Your business is a 12-18 mile radius, not a metro. Density inside the circle is everything; drive time outside it is the silent killer.

**Rule 3 — E-bikes are the core, not a feature.** The durable demand and the premium margin both live in e-bike service. Build the skill, build the brand around it, charge the surcharge.

**Rule 4 — Anchor the route with B2B and HOA contracts.** Recurring contract revenue smooths the season, anchors the route geographically, and is what a buyer pays a multiple for someday. Pitch them in the first 90 days.

**Rule 5 — Build for transferability if you ever want out.** Systems, SOPs, a clean customer database, multiple vans not dependent on you. It costs little in Year 2 and it is the difference between a 2.5x exit and selling a used van.

A skilled mechanic who follows these five rules can build a $55K-$95K Year-1 income, a $180K-$320K three-van operation by Year 3, and either a comfortable lifestyle business or a sellable $450K-$750K regional company by Year 5. The tailwind is real. The execution discipline is what is scarce.

`;

const flow = `

## Customer Journey: From Bike Problem to Recurring Account

\`\`\`mermaid
flowchart TD
  A[Bike Or E-Bike Problem] --> A1[E-Bike Out Of Warranty No Shop Will Service]
  A --> A2[Heavy E-Bike Hard To Transport To Shop]
  A --> A3[Family Needs Multiple Bikes Tuned]
  A --> A4[Enthusiast Needs Suspension Or Drivetrain Work]
  A --> A5[Online Bike-In-Box Needs Assembly]
  A1 --> B[Discovery Channel]
  A2 --> B
  A3 --> B
  A4 --> B
  A5 --> B
  B --> B1[HOA Or Apartment Service Day]
  B --> B2[Google Local Services Search]
  B --> B3[Van Wrap Seen In Neighborhood]
  B --> B4[Cycling Club Or Strava Referral]
  B --> B5[B2B Fleet Contract Inbound]
  B --> B6[Nextdoor Or Neighbor Referral]
  B1 --> C[Online Booking With Trip Fee Shown]
  B2 --> C
  B3 --> C
  B4 --> C
  B5 --> C
  B6 --> C
  C --> C1[Stop Clustered Into Route By Neighborhood]
  C1 --> D[Driveway Visit]
  D --> D1[Assess And Confirm Scope And Price]
  D1 --> D2[Charge Trip Fee Plus Tier]
  D2 --> D3[Basic Standard Or Premium Tune]
  D2 --> D4[E-Bike Diagnostic Surcharge If Applicable]
  D3 --> E[Test Collect Payment Log Service History]
  D4 --> E
  E --> F[Service-Due Reminder Loop]
  F --> F1[6-Month Reminder Text Auto-Sent]
  F --> F2[Membership Upsell Two Tunes Per Year]
  F --> F3[Referral Credit To Neighbor]
  F1 --> G[Recurring Account]
  F2 --> G
  F3 --> G
  G --> H[Route Densifies Same Neighborhood]
  H --> I[Higher Effective Hourly Rate]
\`\`\`

## Decision Matrix: Mobile Bike Repair vs The Alternatives

\`\`\`mermaid
flowchart LR
  A[Aspiring Bike Service Business] --> B{Want To Avoid Retail Rent?}
  B -->|No| C[Open A Brick-And-Mortar Shop]
  C --> C1[High Fixed Cost 4K-12K Mo Rent]
  C --> C2[Higher Throughput Multiple Stands]
  C --> C3[Can Sell Bikes Too]
  C --> C4[Customer Must Come To You]
  B -->|Yes| D{Solo Lifestyle Or Build A Company?}
  D -->|Solo Lifestyle| E[Single-Van Operator]
  E --> E1[18K-45K Startup]
  E --> E2[55K-95K Year 1 Revenue]
  E --> E3[Tops Out 120K-200K Solo]
  E --> E4[Low Overhead High Personal Toll]
  D -->|Build A Company| F[Multi-Van Regional Operator]
  F --> F1[Systems-First From Day One]
  F --> F2[Hire Mechanic Month 10-20]
  F --> F3[Van 2 Then Van 3 Then Dispatcher]
  F --> F4[450K-750K Year 5 Revenue]
  F --> F5[Sellable At 2.0-3.2x SDE]
  E --> G{Pricing And Routing Discipline?}
  F --> G
  G -->|Trip Fee Plus 95-145 Hr Tight Radius B2B Anchors| H[Healthy Effective Rate Profitable]
  G -->|Underprice Wide Radius No Contracts| I[Half The Day Driving Nets 30K-40K]
  H --> J[E-Bike Focus Equals Durable Defensible Margin]
  I --> K[Re-Price And Tighten Or Exit]
\`\`\`

`;

const src = `

## Sources

1. **PeopleForBikes — US Bicycle Industry Data and Participation Reports** — Annual estimates of US bicycle market size, ridership, and e-bike adoption trends. https://www.peopleforbikes.org
2. **National Bicycle Dealers Association (NBDA) — Industry and Dealer Statistics** — Independent bike dealer (IBD) counts, service revenue share, and shop economics. https://nbda.com
3. **Light Electric Vehicle Association (LEVA) — E-Bike Market and Service Data** — E-bike sales volume, installed base estimates, and technician certification standards. https://levassociation.com
4. **US Bureau of Labor Statistics — Bicycle Repairers (Occupation 49-3091)** — Wage data, employment levels, and outlook for bicycle repair technicians. https://www.bls.gov/oes/current/oes493091.htm
5. **US Small Business Administration — Starting and Financing a Service Business** — Guidance on LLC formation, licensing, and startup financing. https://www.sba.gov
6. **IRS — Self-Employed Individuals Tax Center and Vehicle Deduction Rules** — Mileage deduction, business vehicle expensing, and self-employment tax guidance. https://www.irs.gov/businesses/small-businesses-self-employed
7. **Park Tool — Professional Repair Stand and Tool Specifications** — Reference for mobile mechanic tool kits, torque specs, and repair procedures. https://www.parktool.com
8. **Feedback Sports — Portable Workstand Product Documentation** — Mobile-specific repair stand options and field-service ergonomics.
9. **Quality Bicycle Products (QBP) — Distributor Wholesale Catalog and Dealer Program** — Primary parts distribution channel and wholesale pricing structure. https://www.qbp.com
10. **J&B Importers — Bicycle Parts Distributor** — Alternative wholesale parts distribution for independent mechanics.
11. **Hawley / BTI (Bicycle Technologies International) — Distributor Program** — Wholesale parts and dealer onboarding.
12. **Bosch eBike Systems — Dealer Service and Diagnostic Program** — Mid-drive motor diagnostics, firmware, and authorized service training. https://www.bosch-ebike.com
13. **Shimano STEPS — E-Bike System Service Documentation** — Service tools, diagnostics, and dealer requirements for Shimano e-bike drive units.
14. **Bafang — E-Bike Motor and Controller Service Resources** — Diagnostics for the most common hub and mid-drive systems on DTC e-bikes.
15. **Jobber — Field Service Management Software** — Scheduling, routing, dispatch, invoicing, and CRM for mobile service businesses. https://getjobber.com
16. **Housecall Pro — Field Service Management Platform** — Booking, route optimization, and payment tooling for home-service operators. https://www.housecallpro.com
17. **Square — Mobile Payment Processing and POS** — Card readers, tap-to-pay, and invoicing for mobile businesses. https://squareup.com
18. **Google Business Profile and Local Services Ads — Documentation** — Local search visibility and pay-per-lead advertising for service businesses. https://www.google.com/business
19. **Velofix — Mobile Bike Shop Franchise Model** — Reference point for mobile bike service franchise economics and van outfitting.
20. **Beeline Bikes — Mobile Bike Repair Network** — Mobile bike service operating model and partnership structures.
21. **REI Co-op — Bike Shop Service Menu and Pricing** — Benchmark for retail bike service tier pricing and scope.
22. **Trek Bicycle / Specialized — Concept Store Service Pricing** — Brand-owned retail service pricing benchmarks.
23. **Rad Power Bikes — DTC E-Bike Brand Service Network** — Largest US DTC e-bike brand; reference for out-of-warranty service gap and partner-mechanic networks.
24. **Aventon, Lectric, Ride1Up, Velotric — DTC E-Bike Brands** — Major direct-to-consumer e-bike brands driving the installed base of service-needy bikes.
25. **NICA (National Interscholastic Cycling Association) and USA Cycling — Event and Club Data** — Source of enthusiast-segment demand and event mechanical-support opportunities.
26. **Strava — Local Club and Segment Data** — Channel for reaching enthusiast cyclists and group-ride communities.
27. **Insureon and Next Insurance — Small Business Insurance for Mobile Service** — Commercial auto, general liability, and garage keepers coverage benchmarks for mobile mechanics. https://www.insureon.com
28. **The Hartford / Progressive Commercial — Commercial Auto Insurance** — Commercial vehicle insurance pricing for service vans.
29. **National Association of Insurance Commissioners (NAIC) — Garage Keepers and Tools Coverage** — Coverage standards for businesses holding customer property.
30. **US Consumer Product Safety Commission (CPSC) — E-Bike and Lithium Battery Safety** — Battery fire risk, safe charging/storage, and emerging regulatory guidance. https://www.cpsc.gov
31. **OnlineJobs.ph and Indeed — Service Technician Hiring Channels** — Sourcing and wage benchmarks for mechanic and helper hires.
32. **BizBuySell — Service Business Sale Listings and Multiples** — Benchmark SDE multiples for small mobile and service businesses. https://www.bizbuysell.com
33. **SCORE — Mentorship and Small Business Financial Templates** — Startup budgeting and cash-flow planning resources for service businesses.
34. **NPD Group / Circana — Cycling Retail and Service Spending Data** — Consumer spend tracking across bike retail and service channels.
35. **Nextdoor — Neighborhood Business Marketing Documentation** — Hyper-local lead generation channel for route-based services.
36. **Velofix and local mobile-operator interviews via NBDA and bike-industry press (Bicycle Retailer and Industry News)** — Operator economics, route discipline, and channel performance. https://www.bicycleretailer.com

`;

const num = `

## Numbers

**Market Size**
- Total US bicycle market (bikes, parts, accessories, service): ~$7B-$9B annually
- US bike service and repair revenue (TAM): ~$1.2B-$1.8B (15-22% of total market)
- Independent mobile operator serviceable market (SAM): ~$180M-$320M, growing 12-20% annually
- Mobile share of total US bike service revenue (2027): under 8% nationally; 12-18% in mature metros
- US independent bike dealer (IBD) count: ~2,800-3,400 in 2026, down from 6,000+ in early 2010s
- US e-bike unit sales: ~880K-1.1M per year through the mid-2020s
- Cumulative US e-bike installed base: ~6M-9M units, an increasing share aging out of warranty
- E-bikes as share of US bike market: ~18-24%

**The Operating Circle**
- Realistic single-van operating radius: 12-18 miles (dense metro), tighter is better
- Bike-owning households in a 400K-1M metro inside that radius: ~35,000-90,000
- Households inside radius owning an e-bike or $800+ bike (real customers): ~8,000-20,000
- A full solo route: ~300-700 active accounts; two vans: ~600-1,400
- Healthy drive-time-to-billable ratio: drive time under 25-30% of the workday

**Startup Costs**
- Used compact cargo van / minivan: $8,000-$16,000
- Used full-size high-roof van (Transit, ProMaster, Sprinter, 80K-150K mi): $14,000-$28,000
- Van upfit (shelving, stand mount, lighting, power): $1,500-$5,000
- Vehicle wrap and signage: $1,800-$3,500
- Pro tools and portable workstand: $2,500-$5,500
- Starter parts inventory (150-300 fast movers): $2,000-$4,500
- Insurance, LLC, licensing to start: $1,500-$3,500
- Software and systems setup: $600-$1,800/year
- Working capital and initial marketing: $2,000-$5,000
- Total startup: $18,000 lean to $45,000 comfortable

**Pricing**
- Trip fee: $35-$45 (dense affordable metro) to $55-$75 (affluent/low-density)
- Basic Tune: $85-$110 (35-45 min)
- Standard Tune: $150-$190 (60-80 min)
- Premium/Overhaul: $265-$340 (100-140 min)
- E-bike diagnostic/service surcharge: $45-$95, plus motor/battery labor at $110-$150/hour
- Parts markup: 45-55% on consumables, 35-45% on larger components
- Annual membership: $120-$240/year (two tunes, priority, discounted trip fee)
- B2B per-bike service agreement: $8-$25/bike/month
- Online bike assembly flat fee: $75-$150
- Target effective hourly rate (Year 1 solo): $95-$145/hour including drive time

**Operating Costs**
- Van payment: $400-$900/month
- Fuel: $150-$350/month
- Vehicle maintenance and tires: $80-$200/month
- Commercial auto insurance: $1,800-$4,500/year
- General liability insurance: $400-$900/year
- Garage keepers / tools coverage: $300-$800/year
- Scheduling/dispatch software: $40-$200/month
- Payment processing: ~2.6-3.0% of card volume
- Year-1 marketing budget: $3,000-$7,000

**Daily and Seasonal Operations**
- Stops per day (solo, in season): 6-10
- Working hours per day in season (including drive): 8-9; weekly 45-55
- Per-job time: Basic ~35-45 min, Standard ~60-80 min, Premium ~100-140 min
- Seasonality: ~50-60% of annual revenue in roughly five months (March-October in most markets)

**Revenue Trajectory**
- Year 1 (solo): $55,000-$95,000 revenue; owner take-home ~$40K-$70K
- Year 2 (solo-plus or first hire): $95,000-$170,000; take-home ~$60K-$110K
- Year 3 (two vans): $180,000-$320,000; take-home ~$90K-$160K
- Year 4 (three vans + back office): $300,000-$500,000
- Year 5 (3-4 van regional operator): $450,000-$750,000; SDE ~$120K-$280K
- Poorly-run operator (underpriced, wide radius, no contracts): can net as little as ~$30K-$40K on full-time hours

**Hiring**
- First hire timing: Month 10-20
- Mechanic wage: $22-$38/hour depending on market and skill
- Dispatcher/office role: needed at the 3-4 van stage
- B2B contract revenue target: 10-25% Year 1, growing to 30-40% by Year 3

**Exit**
- Typical sale multiple for a small mobile service business: 2.0-3.2x SDE
- Multiple raised by: recurring B2B/membership revenue, transferable systems, multi-van non-founder-dependent operations, clean books, strong reviewed brand

`;

const counter = `

## Counter-Case: Why Starting a Mobile Bike Repair Business in 2027 Might Be a Mistake

The bull case is real, but a serious founder should stress-test it. Here are the conditions that make this niche a poor choice.

**Counter 1 — The unit economics are deceptively thin once you honestly load vehicle cost.** "No rent" is the seductive pitch, but a van's true all-in cost — payment, fuel, insurance, maintenance, tires, depreciation, and the opportunity cost of every non-billable mile — frequently runs $1,400-$2,800/month. That is not far off a small shop's rent, and unlike rent it scales with how much you drive. Many operators do not run the real numbers and discover in Year 2 that their "profit" was actually deferred van depreciation and skipped maintenance.

**Counter 2 — Throughput is structurally capped and you cannot wrench your way out of it.** A one-person van can do 6-10 jobs a day, period. A brick-and-mortar shop with three stands and a service writer does 20-35. Your revenue ceiling as a solo operator is hard — roughly $120K-$200K — and the only way past it is hiring and adding vans, which means you are no longer a mechanic, you are a fleet manager with all the people-and-vehicle headaches that implies. If you wanted to wrench, scaling takes that away; if you do not scale, you are income-capped.

**Counter 3 — Route inefficiency is a silent, brutal margin killer and most new operators are bad at routing.** The whole model lives or dies on geographic density, and density is genuinely hard to build in Year 1 when you take whatever bookings come in. A realistic Year-1 operator spends 35-50% of the workday driving — which means the "8 jobs a day" math quietly becomes 5, and the "$120/hour effective rate" becomes $65. The bull case assumes route discipline that takes most operators a year or two to actually achieve.

**Counter 4 — Seasonality is more punishing than people plan for.** In real-winter markets, November-February can be 60-75% slower. A solo operator with no B2B base can go from $9,000 months to $2,000 months. That swing wrecks cash flow, forces credit-card float, and is the single most common reason operators quit between Year 1 and Year 2. The mitigations (B2B contracts, memberships, winter pushes) are real but they take time to build — exactly the time you do not have in your first winter.

**Counter 5 — The body wears out.** This is physical work — lifting 60 lb e-bikes, kneeling on driveways, working in heat and cold, all day, every day, in season. Mechanics in their 40s and 50s accumulate back, knee, wrist, and shoulder problems. A solo operator who gets injured has zero revenue and no backup. Unlike a desk business, your body is a depreciating critical asset and the job actively depreciates it.

**Counter 6 — E-bike service competence is a real, expensive moat to build — and it is also a liability minefield.** The bull case treats e-bike skill as your edge, and it is, but acquiring it means manufacturer training, diagnostic tools and software subscriptions per brand, and constant firmware/service-bulletin upkeep across Bosch, Shimano, Bafang, Yamaha, and a long tail of DTC systems. Meanwhile, e-bikes carry battery fire risk: storing, charging, and transporting customer batteries is a genuine liability you are taking into your van and potentially your home. One battery incident is catastrophic.

**Counter 7 — The van is a single point of failure.** A solo operator whose van is in the shop for four days has zero revenue for four days and a cancelled, angry route. There is no redundancy until van #2, and van #2 is a Year-2 or Year-3 milestone. A breakdown during peak season can cost $4,000-$8,000 in lost bookings and reputation.

**Counter 8 — The category is getting more crowded in exactly the markets worth being in.** The same mature metros where mobile bike repair works best — Portland, Denver, Austin, Seattle, the Bay Area, Boulder — are where franchise networks and other independents have already planted. A 2027 entrant into a mature market faces real direct competition and customer-acquisition cost that a 2018 entrant did not. The under-served markets are under-served for a reason: lower density, lower income, harder routes.

**Counter 9 — B2B contracts are the stability layer but they are slow, competitive, and squeeze-prone.** Landing a hotel, university, or delivery-fleet contract can take months of cold outreach, the buyer negotiates hard on per-bike pricing, and once you depend on a contract for 25-35% of revenue you have handed that customer real leverage. Fleet customers also churn — a delivery operator pivots, a hotel changes management, a university bids it out. Contract revenue is more fragile than it looks.

**Counter 10 — It is genuinely hard to sell, and the realistic exit for most operators is "sell a used van."** The 2.0-3.2x SDE multiple only applies to a transferable, systematized, multi-van business with recurring revenue and clean books. The overwhelming majority of mobile bike operations are entirely founder-dependent — the customers are loyal to *you*, the e-bike expertise lives in *your* head, the routing instinct is *yours*. That business has almost no enterprise value. You can sell the van, the tools, and a customer list nobody else can monetize.

**Counter 11 — Customer trust is fragile and one bad hire can torch it.** The entire brand is "a trustworthy expert who comes to my driveway." Scaling means putting that brand in the hands of employees you cannot directly supervise — they are alone in customers' driveways all day. One mechanic who oversells, does sloppy brake work, or is rude in someone's home generates reviews that undo months of reputation-building. Quality control across a distributed, unsupervised workforce is one of the hardest problems in any service business.

**Counter 12 — Better-fit alternatives exist depending on your situation.** If you have capital and want throughput, a brick-and-mortar shop in an under-served area genuinely out-earns a single van and is easier to sell. If you want to stay a pure mechanic, working for an existing shop or mobile operator gives you the wrenching without the vehicle risk, the cash-flow swings, the cold-pitching, and the admin. If your real interest is e-bikes, a fixed-location e-bike specialty service operation captures the same demand without the routing problem. Mobile bike repair is one good option — it is not automatically the best one for your specific skills, capital, body, and temperament.

**The honest verdict.** Starting a mobile bike repair business in 2027 is a strong move for a founder who: has genuine professional-level mechanical skill including e-bike systems; lives near a dense, affluent, bike-cultured operating circle; can fund $18K-$45K plus personal runway; has the body and temperament for physical outdoor customer-facing work; prices for convenience with discipline from day one; and either wants a deliberately lean solo lifestyle business or genuinely wants to build and manage a multi-van company. It is a poor move for someone underfunded, in a low-density circle, expecting passive income, expecting to undercut the shops, or hoping to build something easily sellable without doing the systems work. The e-bike tailwind and the bike-shop service desert are real and durable — but they reward disciplined operators and quietly punish everyone else.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a bookkeeping business in 2027? (Service-business pricing and productization parallels.)
- **q9502** — How do you start a CPA firm in 2027? (Professional-services scaling and exit-multiple context.)
- **q1946** — How do you start a real estate investing business in 2027? (Adjacent "start a business in 2027" small-business framework.)
- **q1947** — How do you start a property management business in 2027? (HOA and apartment-complex partnership channel overlap.)
- **q1949** — How do you start a short-term rental business in 2027? (Hospitality fleet-service B2B customer perspective.)
- **q9587a** — How do you start a mobile detailing business in 2027? (Closest van-based mobile-service operating model.)
- **q9588** — How do you start a mobile pet grooming business in 2027? (Van upfit, routing, and trip-fee economics parallel.)
- **q9589** — How do you start a mobile car wash business in 2027? (Route density and seasonality management parallel.)
- **q9590** — How do you start a mobile locksmith business in 2027? (Mobile-service licensing, dispatch, and emergency-response model.)
- **q9591** — How do you start a handyman business in 2027? (Home-service lead generation and B2B contract overlap.)
- **q9592** — How do you start a pressure washing business in 2027? (Equipment-based mobile-service unit economics.)
- **q9593** — How do you start a lawn care business in 2027? (Route-clustering and recurring-membership model.)
- **q9594** — How do you start an appliance repair business in 2027? (Diagnostic-driven mobile-repair pricing parallel.)
- **q9595** — How do you start an HVAC business in 2027? (Service-contract recurring-revenue and fleet-of-vans scaling model.)
- **q9596** — How do you start a mobile mechanic business in 2027? (Closest analog: van-based vehicle repair, near-identical economics.)
- **q9597** — How do you start an e-bike retail business in 2027? (Upstream channel; potential referral partner and competitor.)
- **q9598** — How do you start a bike shop in 2027? (The brick-and-mortar alternative analyzed in the decision matrix.)
- **q9599** — How do you start a sporting goods store in 2027? (Adjacent retail channel for the cycling customer.)
- **q9600** — How do you start a fitness equipment repair business in 2027? (Adjacent niche-repair service model.)
- **q9601** — How do you start a fractional CFO business in 2027? (Back-office systems and transferability-for-exit framework.)
- **q9610** — How do you price a home-service business? (Trip fee, tiered packages, and effective-hourly-rate methodology.)
- **q9611** — How do you build recurring revenue in a service business? (Membership and B2B-contract design.)
- **q9612** — How do you route-optimize a mobile service business? (Drive-time-to-billable ratio and clustering tactics.)
- **q9613** — How do you hire your first employee in a service business? (First-hire timing, classification, and compensation.)
- **q9614** — How do you scale a service business to multiple vans? (Multi-van P&L and dispatcher-role economics.)
- **q9615** — How do you sell a small service business? (SDE multiples and transferability requirements.)
- **q9620** — How do you use AI for scheduling and dispatch in 2027? (AI route-optimization adoption referenced in the outlook.)
- **q9621** — What home-service businesses are most AI-resilient in 2027? (Physical-local-service defensibility framework.)
- **q9801** — What is the future of small business in 2030? (Long-term outlook context.)

`;

const tags = ['mobile-bike-repair','e-bike','small-business','home-service','van-based-business','startup-2027','route-density','recurring-revenue'];

const sources = [
  { title: 'PeopleForBikes — US Bicycle Industry Data and Participation Reports', url: 'https://www.peopleforbikes.org' },
  { title: 'National Bicycle Dealers Association (NBDA) — Industry and Dealer Statistics', url: 'https://nbda.com' },
  { title: 'US Bureau of Labor Statistics — Bicycle Repairers (Occupation 49-3091)', url: 'https://www.bls.gov/oes/current/oes493091.htm' }
];

const notes = {
  s6: 'Added 36 cited sources: PeopleForBikes and NBDA industry/dealer data, LEVA e-bike market data, BLS bicycle-repairer wage data, SBA and IRS small-business and vehicle-deduction guidance, tool and distributor references (Park Tool, Feedback Sports, QBP, J&B, Hawley/BTI), e-bike drive-system service programs (Bosch, Shimano STEPS, Bafang), field-service software (Jobber, Housecall Pro), payment and local-marketing tools (Square, Google Business Profile, Nextdoor), mobile-operator references (Velofix, Beeline), retail-service benchmarks (REI, Trek, Specialized), DTC e-bike brands (Rad Power, Aventon, Lectric, Ride1Up, Velotric), insurance carriers and coverage standards (Insureon, Next, The Hartford, NAIC), CPSC e-bike battery safety, hiring channels, and BizBuySell/SCORE exit-and-financing references.',
  s7: 'Added comprehensive numbers block: market sizing ($7B-$9B total bike market, $1.2B-$1.8B service TAM, $180M-$320M mobile SAM, 2,800-3,400 IBDs, 6M-9M e-bike installed base), the operating-circle math (12-18 mile radius, 8,000-20,000 real customers, 300-700 accounts per route), full startup cost breakdown ($18K lean to $45K comfortable), four-component pricing (trip fee $35-$75, three tune tiers, e-bike surcharge $45-$95, parts markup 35-55%, memberships, B2B per-bike $8-$25/mo), operating costs, daily/seasonal operations, the Year-1-through-Year-5 revenue trajectory ($55K-$95K to $450K-$750K), hiring math, and exit multiples (2.0-3.2x SDE).',
  s8: 'Added 12-element counter-case: deceptively thin loaded vehicle economics, structurally capped solo throughput, route-inefficiency margin destruction, punishing real-winter seasonality, physical body-wear-out risk, e-bike competence cost plus battery-fire liability, single-point-of-failure van risk, growing competition in the best metros, fragile and slow-to-land B2B contracts, near-zero enterprise value for founder-dependent operations, fragile distributed-workforce quality control, and better-fit alternatives (brick-and-mortar shop, working for an operator, fixed-location e-bike specialty). Honest verdict on who should and should not start.',
  s9: 'Cross-linked 28 related Pulse entries: service-business pricing/productization (q9501, q9502, q9601), the "start a business in 2027" small-business set (q1946, q1947, q1949), the van-based mobile-service cluster (mobile detailing, pet grooming, car wash, locksmith, mobile mechanic, pressure washing, lawn care, appliance/HVAC repair), the bike-industry adjacency (e-bike retail, bike shop, sporting goods, fitness equipment repair), the operating-method deep dives (pricing, recurring revenue, route optimization, first hire, multi-van scaling, selling a service business), and AI/outlook context (q9620, q9621, q9801).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the mobile bike repair business startup playbook for 2027. Two mermaid diagrams (customer journey from bike problem to recurring account; decision matrix of mobile vs brick-and-mortar vs solo-lifestyle vs multi-van builder, gated on pricing/routing discipline). Full coverage: market sizing (TAM/SAM/SOM and the operating-circle reframe), five-segment ICP (e-bike commuters, enthusiasts, family/casual, B2B fleets, online-assembly funnel), the default-playbook trap (why undercutting shops fails), four-component pricing model, startup costs and unit economics ($18K-$45K), van buy/upfit/wrap decisions, the tooling and software stack, eight lead-generation channels (HOA/apartment days, B2B contracts, Google Local Services, clubs, van wrap, DTC referral, neighborhood social, referral flywheel), daily/weekly/seasonal operational workflow, hiring sequence (first hire Month 10-20, van increments, dispatcher at 3-4 vans), Year-1-through-Year-5 revenue trajectory ($55K-$95K to $450K-$750K), licensing/legal/insurance (LLC, sales-tax permit, commercial auto, GL, garage keepers, workers comp, e-bike battery compliance), competitor analysis (IBDs, big-box, other mobile operators, DTC networks, DIY), five named real-world scenarios, ten risk-mitigation items, four exit paths with 2.0-3.2x SDE multiples, owner-lifestyle reality by year, twelve common Year-1 mistakes, a five-gate decision framework, the 2027-2032 AI-and-e-bike outlook, and a final five-rule operating framework.'
};

runPolish({ id: 'q9587', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
