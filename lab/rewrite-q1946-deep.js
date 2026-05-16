// q1946 — How do you start a roofing business in 2027?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** To start a roofing business in 2027, the single most important decision is **which of the three roofing markets you enter**, because they are almost entirely different businesses that happen to share a ladder. **Retail/replacement roofing** (homeowner pays, you sell quality and warranty) earns 38-52% gross margin, $9K-$22K average residential job, and compounds through reputation and Google. **Storm/insurance roofing** (insurance carrier pays, you sell speed and claims navigation) earns 45-60% gross margin but lives and dies by hail and wind events, requires aggressive door-knocking crews, and carries serious regulatory and reputational risk. **Commercial roofing** (TPO, EPDM, modified bitumen on flat roofs) earns 22-34% gross margin but $40K-$500K+ jobs, multi-year relationships with property managers and GCs, and far less seasonality. The default-playbook trap that kills most new roofers: **starting as an undercapitalized storm-chaser, burning out after two slow seasons, and never building a real brand**. Realistic startup cost is **$18K-$75K** if you subcontract crews (truck, ladders, basic tools, insurance, bonding, software, marketing) or **$95K-$220K** if you run W-2 crews from day one. Year-1 realistic revenue for a committed owner-operator who sells and subs out installs: **$280K-$650K revenue, $70K-$160K owner take-home**; Year-3 target **$1.4M-$3.5M revenue with 2-4 crews**; Year-5 ceiling **$4M-$12M** before you must choose between staying a lifestyle contractor, scaling into a regional brand, or selling to a private-equity roofing roll-up (multiples run **4.5x-7.5x EBITDA** in the active 2025-2027 consolidation wave). Lead generation is the real game: **retail wins on Google Local Service Ads, GAF/Owens Corning certification, and referral systems; storm wins on canvassing crews and insurance-adjuster relationships; commercial wins on property-manager and GC relationships plus roof-asset-management contracts.** The biggest 2027-specific risks: **(a) material and labor cost volatility, (b) insurance-carrier crackdowns on storm-claim abuse making that model harder, (c) PE roll-ups out-spending you on marketing, and (d) a labor shortage that makes reliable crews your true bottleneck.** Net: roofing is one of the most cash-generative trades a founder can start in 2027, but only if you pick a lane, capitalize properly, treat it as a sales-and-recruiting company that happens to install roofs, and refuse to be a generic storm-chaser.`;

const core = `

## Why Roofing Is a Strong Business to Start in 2027

Roofing in 2027 sits on top of a set of structural tailwinds that make it one of the most durable trades a founder can enter. The first is simply physics and time: every roof in North America is a depreciating asphalt, metal, tile, or membrane system with a finite lifespan, and the enormous wave of housing built during the 1990s and 2000s booms is now hitting the 20-30 year replacement window. The National Roofing Contractors Association and multiple industry trackers put the US roofing market somewhere in the $25-$30B annual range for residential and commercial combined, with steady mid-single-digit growth. Roofs do not get cheaper to ignore — a deferred roof becomes water damage, mold, and structural rot — so demand is among the least discretionary in all of construction.

The second tailwind is weather. Climate volatility has increased the frequency and severity of hail, wind, hurricane, and wildfire-adjacent events. Whatever one believes about long-term climate trends, the insurance and roofing data is unambiguous: insured catastrophe losses tied to severe convective storms have climbed sharply since 2015, and every major hail or wind event triggers a multi-month surge of insurance-funded roof replacements. This makes roofing partially counter-cyclical — a recession can slow housing starts, but it does not stop hailstorms.

The third tailwind is fragmentation and consolidation happening simultaneously. The roofing industry is still overwhelmingly composed of small contractors — tens of thousands of one-to-three-crew operations — which means a disciplined new entrant can take share from disorganized incumbents. At the same time, private equity has discovered roofing: roll-ups backed by firms have been aggressively acquiring profitable regional roofers at 4.5x-7.5x EBITDA, which both validates the asset class and creates a real exit path for a founder who builds something sellable. A new roofing company started correctly in 2027 is being built into a market where someone genuinely wants to buy it in five to eight years.

The fourth and most underrated tailwind is that roofing is a sales-and-operations business, not a craft mystery. The actual installation can be subcontracted to skilled crews. What the owner must be excellent at — selling, recruiting, project management, collections, and marketing — are learnable business skills. That means the ceiling is determined by the founder's discipline, not by whether they personally know how to lay shingles.

## The Three Roofing Businesses: Retail, Storm, and Commercial

The most expensive mistake a new roofer makes is not picking a lane. "Roofing" is three distinct businesses with different customers, sales motions, cash-flow profiles, margins, and risk. Understanding them cold is the foundation of every other decision.

**Retail / replacement roofing** serves homeowners who are paying out of pocket (or financing) for a roof replacement or repair because the roof is old, leaking, or being upgraded before a sale. The customer is choosing you on trust, warranty, reviews, and price. Average residential job runs $9,000-$22,000 depending on region, roof size, and material. Gross margins are healthy at 38-52% because you control pricing and there is no third-party squeezing you. This business compounds — every happy homeowner is a five-star review and two referrals — but it is slow to start and requires real marketing investment.

**Storm / insurance restoration roofing** serves homeowners whose roof was damaged by hail or wind and whose insurance carrier is paying for the replacement. The customer's "decision" is mostly whether their claim gets approved and who they trust to handle it. The roofer's job is to identify damage, help the homeowner file, meet the adjuster, and supplement the claim to a fair scope. Margins can be excellent (45-60% gross) and jobs close fast after a storm, but the model is feast-or-famine, geographically chaotic (you chase storms), heavily dependent on canvassing crews, and under increasing regulatory and insurance-industry scrutiny for abuse.

**Commercial roofing** serves building owners, property managers, REITs, facility managers, and general contractors who need flat or low-slope roof systems — TPO, EPDM, PVC, modified bitumen, built-up roofing, metal — installed, repaired, restored, or maintained on retail centers, warehouses, apartment complexes, schools, and offices. Jobs run $40,000 to well over $500,000. Gross margins are thinner (22-34%) because of competitive bidding and sophisticated buyers, but the work is far less seasonal, relationships are sticky and multi-year, and roof-asset-management and maintenance contracts produce recurring revenue. It requires more capital, bonding capacity, and technical knowledge.

Most successful founders start in retail or commercial and treat storm work as an opportunistic add-on when a major event hits their service area — not as the entire identity of the company.

## The Default-Playbook Trap That Kills New Roofers

There is a depressingly common arc for failed roofing companies, and a new founder should be able to recite it. It goes like this: someone who knocked doors for a storm-chasing roofer for two seasons decides to go out on their own. They have $5,000, a truck, and a belief that the business is "just" knocking doors and subbing the install. They launch right before or right after a storm, ride a six-month wave of insurance jobs, and feel rich. Then the storm work dries up. They have no retail brand, no Google presence, no referral engine, no commercial relationships — they built nothing that compounds. They burn through cash trying to chase the next storm two states away, take on jobs they can't supervise, get hit with a few callbacks and a chargeback, mismanage a supplement, and within 24-36 months they are either out of business or back to knocking doors for someone else.

The trap has four parts. **First, undercapitalization** — they treat $5K as enough when material deposits, payroll float, insurance, and a dry month require $30K-$75K of cushion. **Second, no compounding asset** — pure storm work leaves nothing behind; a brand, a database, and a review profile are the actual assets. **Third, treating it as a trade instead of a company** — they think the skill is roofing, when the skill is selling, recruiting, scheduling, and collecting. **Fourth, geographic incoherence** — chasing storms across state lines means new licensing, no local reputation, crews they can't supervise, and warranty obligations in places they will never return to.

The escape from the trap is straightforward to describe and hard to execute: pick a home service area, build a retail or commercial brand that generates leads independent of weather, treat storm surges as a bonus rather than a foundation, capitalize for a slow quarter, and run the thing like a company with a CRM, a P&L, and SOPs from week one.

## Market Sizing: TAM, SAM, and Your Realistic SOM

The total US roofing market is large and stable. Industry estimates put combined residential and commercial roofing at roughly $25-$30B in annual revenue, split very roughly 60-65% residential and 35-40% commercial, though the mix shifts year to year with storm activity. Reroofing and repair — not new construction — drive the majority of revenue, which is what makes the business resilient: replacement demand is tied to the existing housing and building stock aging, not to new starts.

Your total addressable market is not "$28B." It is the roofing spend inside the metro or set of counties you can physically service with crews you can supervise. A mid-sized metro of 1.5-2.5M people typically contains $300M-$700M of annual roofing demand across retail, storm, and commercial. That is your TAM.

Your serviceable addressable market is narrower — the slice within your chosen lane. If you go retail-residential in that metro, your SAM might be $180M-$400M. If you go commercial, maybe $90M-$220M. Storm SAM is event-dependent and spikes unpredictably.

Your serviceable obtainable market — what you can realistically capture — is humbling and should be. A Year-1 owner-operator who sells well and subs installs might do $280K-$650K, which is well under 1% of even a modest SAM. A strong Year-3 operation with 2-4 crews does $1.4M-$3.5M. A Year-5 regional brand does $4M-$12M. Even a genuinely successful, well-known regional roofer rarely exceeds 3-6% of metro share. This matters because it means the constraint on your growth is almost never "market size" — there is always more roof to install. The constraint is your ability to generate leads, recruit crews, and supervise quality. Founders who blame a "saturated market" are almost always actually constrained by their own sales and recruiting systems.

## ICP Segmentation: Who Actually Pays You and Why

Each lane has a distinct ideal customer, and the marketing, sales script, and operations all flow from getting this right.

**Retail residential ICP.** Homeowner, typically 35-70 years old, owns a single-family home worth enough to justify a quality roof, and the roof is 18-30 years old or visibly failing. They fall into three sub-types: the *proactive replacer* (roof is old, no leak yet, planning ahead — your highest-margin, lowest-stress customer), the *reactive leaker* (active leak, urgent, will pay a premium for speed), and the *transaction-driven* customer (selling or buying a house, roof flagged in inspection, deadline-driven). They find you through Google, neighbors, and yard signs. They choose on reviews, manufacturer certification, warranty, professionalism of the estimate, and financing options. They are not maximally price-sensitive if you present as credible; they are terrified of being scammed by a fly-by-night crew.

**Storm/insurance ICP.** Homeowner in a recently storm-affected area whose roof has hail or wind damage they may not even have noticed. The "buyer" is functionally split: the homeowner must trust you, but the insurance carrier must approve and fund the claim. Your real ICP qualification is "has a legitimate insurance claim, is within the statute of limitations on the storm date, and lives in your serviceable area." The conversation is education — most homeowners do not know they have damage or how claims work.

**Commercial ICP.** This is a B2B sale. The buyer is a property manager, building owner, facilities director, REIT asset manager, school district facilities lead, or a general contractor's PM. They buy on bonding capacity, references, safety record (EMR rating), manufacturer certifications and warranties (especially NDL — no dollar limit — warranties from Carlisle, GAF, Firestone/Holcim, Johns Manville), responsiveness, and price. They want a roofer who can be a long-term roof-asset partner: inspections, maintenance, leak response, and eventual replacement. The sales cycle is long (3-18 months) but the relationship can last decades.

The founder must write a one-paragraph ICP definition for their chosen lane and put it on the wall. Every marketing dollar, every hire, and every job acceptance decision should be checked against it. Saying "we do all roofing for everyone" is how you end up mediocre at three businesses.

## Startup Costs and Capitalization: The Real Numbers

Roofing has a wide startup-cost range depending entirely on whether you run subcontracted crews or W-2 crews, and on which lane you pick.

**Subcontractor model startup (retail or storm), realistic range $18K-$75K.** This is the most common and most capital-efficient launch. The owner sells, project-manages, and collects; independent crews install per job. Costs: a reliable truck or van ($8K-$30K used, or financed), ladders and basic tools ($1.5K-$4K), licensing and permits ($200-$2,500 depending on state), general liability insurance ($1,800-$6,000/yr to start), workers' comp (varies wildly by state and whether you have employees — $4K-$20K/yr, sometimes deferrable with a sub-only model but verify your state's rules), a surety bond if required ($200-$1,000/yr for a modest bond), CRM and estimating software ($150-$600/mo), a website and basic branding ($1,500-$6,000), initial marketing ($3K-$15K), and — critically — operating cushion of $15K-$40K to float material deposits and a slow month.

**W-2 crew model startup (any lane), realistic range $95K-$220K.** Running your own crews adds: payroll float (you pay crews weekly; customers pay you in 2-8 weeks), more trucks and equipment ($40K-$120K for multiple vehicles, a dump trailer, compressors, nail guns, safety equipment, a magnetic sweeper), higher and non-negotiable workers' comp, more insurance, and a larger cash cushion ($40K-$80K). Commercial roofing pushes the high end further because of equipment (cranes, kettles or hot-air welders, larger crews) and bonding capacity requirements.

**Commercial-specific additions.** Commercial often requires performance and payment bonds on individual jobs, which requires a bonding line, which requires a CPA-reviewed or audited financial statement and personal guarantees — plan for a relationship with a surety agent early. Equipment for membrane work (hot-air welders, seam probes, fall-protection systems) and the need to carry larger receivables (commercial pays slower, often 30-60+ days) push working-capital needs to $100K-$300K+.

The single most important capitalization principle: **roofing is a working-capital business that looks like a cash machine and bankrupts you in the gap between paying crews and getting paid.** Underwrite your launch assuming a two-month dry spell and a job that pays 45 days late. Founders who skip the cushion don't fail because the business is bad; they fail because they ran out of cash during a normal slow February.

## Unit Economics: What a Roofing Job Actually Makes

Understanding the economics of a single job is the difference between a roofer who feels busy and a roofer who is actually profitable.

**Retail residential job example.** A typical asphalt shingle replacement: contract price $14,000. Materials (shingles, underlayment, drip edge, vents, nails, flashing) run roughly 30-38% of price — call it $4,800. Labor (subcontracted install crew, paid per square) runs 18-28% — call it $3,200. Other direct costs: dumpster/disposal ($400-$700), permits ($150-$500), crane or special access if needed. That leaves a gross profit around $5,200-$5,800, or roughly 38-42% gross margin. Out of gross profit you pay overhead — your salary, office, marketing, software, insurance, vehicle costs. A well-run retail roofer targets 8-15% net margin after the owner is paid a real salary.

**Storm job example.** Insurance pays the "RCV" (replacement cost value), often via ACV first plus depreciation released on completion, plus approved supplements. A $16,000 storm job might carry similar material and labor percentages, but the upside is in supplements (code upgrades, additional layers discovered, proper ventilation) that a skilled estimator legitimately captures — pushing effective margins to 45-55%. The risk: deductible collection issues, claim denials, and the legal/ethical line on supplementing.

**Commercial job example.** A $120,000 TPO reroof on a warehouse: materials 35-45% (membrane, insulation, fasteners, adhesives, edge metal — insulation alone is a huge line item), labor 20-30%, equipment and logistics 5-10%. Gross margin lands 22-32%. The volume and the maintenance-contract attach rate are what make commercial work; you are not winning on per-job margin.

**The metrics that matter across all lanes:** gross margin per job, jobs per crew per week (a residential crew can do 1.5-3 asphalt roofs per week in season), revenue per crew per year ($500K-$1.2M is a healthy residential crew), marketing cost per acquired job, and the close rate on estimates. Track these or fly blind.

## Pricing Models and How to Quote Without Losing Money

New roofers underprice. They underprice because they're scared, because they only count materials and labor, and because a competitor's lowball number rattles them. Disciplined pricing is a core survival skill.

**Cost-plus / markup pricing** is the foundation. Calculate true job cost — materials, labor, disposal, permits, equipment, warranty reserve — then apply a markup that covers overhead and profit. The classic mistake is confusing markup with margin: a 35% markup is only a 26% gross margin. To hit a 45% gross margin you need an ~82% markup on cost. Build a spreadsheet or use estimating software (Roofr, AccuLynx, JobNimbus, SumoQuote) that does this math so you stop quoting from gut feel.

**Per-square pricing** is the industry shorthand (a "square" is 100 square feet of roof). Knowing your fully loaded cost per square and your target price per square lets you quote fast and consistently. But never let the per-square shortcut hide job-specific costs — steep pitch, multiple layers to tear off, complex roofs with many penetrations, hard access, and tall structures all add real cost.

**Good-better-best presentation** raises both close rate and average ticket. Present three options — a builder-grade shingle, a premium architectural shingle with better warranty, and a designer or impact-resistant option — and a meaningful share of customers move up. This also reframes the conversation from "yes/no on price" to "which option," which closes more deals.

**Value pricing for storm and commercial.** In storm work you are pricing to a legitimate insurance scope, so the discipline is accurate, thorough estimating and proper supplementing, not discounting. In commercial, you price to win the bid while protecting margin, and you make your money on change orders, supplements, and the maintenance contract.

**Financing as a pricing tool.** Offering financing (through GreenSky, Hearth, Service Finance, Sunlight, or similar) on retail jobs measurably increases close rates and average ticket because it converts a $16,000 decision into a $230/month decision. The dealer fee is a real cost — build it into price — but the lift in close rate usually more than pays for it.

The hardest pricing lesson: walking away from a job you'd lose money on is a profit decision. The roofer who quotes everything and wins on price is busy and broke.

## The Equipment, Tooling, and Vehicle Stack

The physical stack scales with your model. Here is the realistic build-out.

**Solo/subcontractor launch.** One reliable truck or cargo van. Extension ladders (a 28-32 ft and a smaller one) and a sturdy ladder rack. A roofing-specific tool kit for repairs and inspections — roofing hatchet/hammer, pry bars, utility knives, chalk lines, tin snips, caulk guns, a cordless drill/impact set. Safety gear is non-negotiable: harnesses, lanyards, roof anchors, hard hats, eye protection. A drone (DJI or similar, $500-$2,000) for roof inspections and measurements is now standard and pays for itself in saved ladder time and better sales presentations. A laser measure and a moisture meter for repairs and commercial. Magnetic sweeper for nail cleanup (callbacks from tire punctures destroy reputations).

**W-2 crew build-out.** Multiple trucks, a dump trailer or dump truck for tear-off debris (or a relationship with a roll-off dumpster supplier), air compressors and pneumatic nailers (multiple sets), generators, more extensive fall-protection systems, ladder hoists or a conveyor for getting material up, and tarps for weather protection. Material handling matters: many roofers have suppliers deliver and rooftop-load material directly, which saves enormous labor.

**Commercial additions.** Hot-air welders for TPO/PVC seams, seam probes, infrared cameras for moisture surveys, possibly a kettle for built-up/mod-bit (less common now), larger fall-protection and OSHA-compliant systems, and access equipment (you'll often rent cranes, boom lifts, and material hoists per job rather than own them).

**The software stack is now part of the toolkit.** A roofing CRM/estimating platform — AccuLynx, JobNimbus, Roofr, or Jobber for smaller operations — to manage leads, estimates, jobs, photos, and crews. Aerial measurement (EagleView, Roofr's measurements, or drone-based) to estimate accurately without climbing. QuickBooks for accounting. A payment processor. Google Local Service Ads and a Google Business Profile. A reviews tool (Podium, NiceJob, or similar) to systematically request reviews. CompanyCam for jobsite photo documentation, which protects you in disputes and impresses customers.

The principle: buy the safety equipment and the software before you buy the shiny truck. Crews get hurt and businesses get sued without the first; businesses stay disorganized and unprofitable without the second.

## Crews, Subcontractors, and the W-2 Decision

How you staff installation is one of the two or three highest-stakes decisions you make, and there is no universally correct answer — but there is a correct way to think about it.

**The subcontractor model.** You contract independent crews (often experienced installers who run their own small operations) to install per job, paid per square or per job. Advantages: low fixed cost, no payroll when there's no work, you can scale crew count up and down with demand, lower workers' comp exposure (though you must verify their coverage and your state's rules — misclassification is a real legal risk). Disadvantages: less control over schedule and quality, crews can disappear mid-season for a better-paying roofer, you're competing for the same good crews everyone wants, and warranty/callback accountability gets murky. This is how most roofers start and how many stay.

**The W-2 crew model.** You employ installers directly. Advantages: control, consistency, quality, loyalty, and the ability to build a real culture and brand experience. Disadvantages: you pay them in slow weeks, workers' comp is mandatory and expensive, you carry HR and management overhead, and a crew sitting idle in February is pure burn.

**The hybrid model** is what most successful mid-sized roofers land on: a core of W-2 crew leads and key installers for consistency and quality control, supplemented by trusted subcontractor crews for surge capacity during storm season and peak months.

**The actual bottleneck is labor, period.** The construction labor shortage is the defining operational constraint of roofing in 2027. The crews are aging, immigration policy affects labor supply, and young workers are hard to recruit into a physically punishing trade. The roofers who win treat recruiting as a permanent marketing function: they pay competitively and on time (paying crews fast and reliably is the single best retention tool), they provide steady work, they treat crews with respect, they invest in safety, and they build a reputation as "the roofer good crews want to work for." A founder who thinks the customer is the only person they need to sell to will lose. You are recruiting crews as hard as you're selling roofs.

## Lead Generation for Retail: The Channels That Compound

Retail roofing is won on a marketing mix that compounds over time. None of these work in isolation; the system is the point.

**Google Local Service Ads (LSA) and Google Ads.** LSAs put you at the very top of Google search with a "Google Guaranteed" badge, and you pay per lead rather than per click. For roofing, LSAs are often the single best paid channel — high intent, local, measurable. Traditional Google Search Ads (pay-per-click) layer underneath. Expect to spend real money: roofing keywords are expensive, and a serious retail roofer might spend $3,000-$15,000+/month on Google in season.

**Google Business Profile and reviews.** Your Google Business Profile, stuffed with photos and a steady stream of recent five-star reviews, drives the free "map pack" results and underpins LSA performance. A systematic review-request process after every job — text the customer a direct link the day after completion — is one of the highest-ROI activities in the entire business. Aim to be the most-reviewed, highest-rated roofer in your service area; it compounds for years.

**Manufacturer certifications.** Becoming a GAF Master Elite, Owens Corning Platinum Preferred, CertainTeed SELECT ShingleMaster, or similar certified contractor does three things: it lets you offer enhanced manufacturer warranties homeowners want, it puts you on the manufacturer's "find a contractor" locator, and it signals legitimacy. These certifications require volume, training, insurance, and good standing — they're a Year-1-to-2 goal.

**Referral and past-customer systems.** A roof lasts decades, so a homeowner isn't a repeat buyer — but they are a referral source and a neighbor influence. Yard signs during and after the job, door-hangers on the surrounding houses ("we're roofing your neighbor's house"), a referral incentive, and an annual touch to past customers all turn one job into more.

**Local SEO and content.** A real website with service-area pages, project galleries, and helpful content ranks over time and feeds every other channel.

**Truck wraps, yard signs, and community presence.** Cheap, local, compounding. A well-wrapped truck parked at a job is a billboard in the exact neighborhood you want.

The retail lead-gen principle: paid channels (LSA/Google) buy you jobs today; reviews, certifications, and referrals build an engine that lowers your cost per lead every year. Fund both.

## Lead Generation for Storm and the Insurance-Claims Dynamic

Storm lead generation is a fundamentally different and more controversial machine, and a founder must understand both how it works and where the lines are.

**Canvassing crews.** After a hail or wind event, storm roofers deploy door-knocking crews into affected neighborhoods. The pitch: "There was a significant hail event in this area; we're offering free roof inspections to see if you have damage that insurance would cover." A skilled canvasser sets inspections; an inspector climbs the roof, documents legitimate damage with photos, and if there's a real claim, helps the homeowner file. This is the engine of the storm model, and it requires recruiting, training, and managing canvassers — a sales-management discipline unto itself.

**The insurance-claims process.** When a homeowner files, the carrier sends an adjuster to inspect. The roofer (or a public adjuster) ideally meets the adjuster on the roof to ensure all legitimate damage is documented. The carrier issues a scope and an estimate, often using Xactimate pricing. The roofer reviews it and **supplements** — submits documentation for legitimate items the carrier's scope missed (code-required upgrades, proper ventilation, additional layers, drip edge, ice-and-water shield where code requires it). The homeowner pays their deductible; the carrier pays the rest, typically ACV up front and recoverable depreciation on completion.

**Where the lines are — and this is critical.** The legitimate version of storm roofing is real: hail and wind genuinely damage roofs, homeowners genuinely have coverage they paid for, and a knowledgeable roofer genuinely helps them get a fair, code-compliant replacement. The abusive version — exaggerating or manufacturing damage, "eating" or rebating deductibles (illegal in most states), inflating supplements, pressuring homeowners, and "assignment of benefits" schemes — is illegal, is being aggressively prosecuted, and is precisely why insurance carriers are tightening claims handling, raising deductibles (separate, higher wind/hail deductibles are now common), and in some states pushing legislative reform. A founder entering storm work must run the legitimate version: document real damage, never touch the deductible, supplement honestly, and treat the carrier relationship as a long-term professional one. The storm roofers getting destroyed in 2025-2027 are the ones who ran the abusive playbook.

**Adjuster and carrier relationships.** Over time, a reputable storm roofer becomes known to local independent adjusters as someone who documents accurately and doesn't fight dirty. That reputation makes every future claim smoother. It is an asset, and it is built by being honest.

## Lead Generation for Commercial: Relationships and Roof-Asset Management

Commercial lead generation looks nothing like retail or storm. It is slow, relationship-driven B2B selling, and it is the most defensible book of business in roofing once built.

**Property managers and building owners.** The core relationship. Commercial property managers oversee portfolios of buildings, each with a roof that will leak, need maintenance, and eventually need replacement. Becoming the trusted roofer for a property-management company means a pipeline of inspections, repairs, and reroofs across their whole portfolio. You win these relationships through referrals, responsiveness (answering a leak call fast and well is the audition), references, and proof of bonding and insurance.

**General contractors.** For reroofs tied to renovations and for new commercial construction, GCs subcontract the roofing. Getting on GCs' bid lists and becoming a reliable, on-schedule sub is a steady channel.

**Roof-asset-management and maintenance contracts.** The strategic prize. Instead of waiting for the building owner to call when there's a leak, you sell a proactive maintenance program: scheduled inspections, minor repairs, documentation, and a budgeted replacement timeline for each roof. This produces recurring revenue, smooths out seasonality, and — crucially — means you are first in line for the big reroof when it comes. A commercial roofer with 40 buildings under maintenance contract has a predictable business; one chasing one-off bids does not.

**Manufacturer relationships and NDL warranties.** Commercial manufacturers (Carlisle, Holcim/Firestone, GAF, Johns Manville, Versico) certify contractors to install systems carrying long-term NDL warranties. Building owners and their insurers want these warranties, so being a certified applicator is often a prerequisite to even bidding serious work.

**Facilities directors, REITs, schools, municipalities.** Institutional buyers run formal bid processes (sometimes requiring prevailing-wage compliance and bonding). They are slower and more paperwork-heavy but loyal and creditworthy.

**Industry presence.** Trade associations, the local roofing contractors association, IFMA (facility managers), and BOMA (building owners and managers) chapters are where commercial relationships are made.

The commercial principle: you are not buying leads, you are building a referable reputation among a small, interconnected community of building professionals. It takes 18-36 months to get traction and then it compounds powerfully.

## The Sales Process: From Lead to Signed Contract

Roofing is a sales business, and a disciplined sales process roughly doubles the close rate of a disorganized one. The retail process is the clearest to map; storm and commercial are variations.

**Speed to lead.** The roofer who responds first wins disproportionately. A lead that sits for four hours is often already talking to a competitor. Set up instant notification and a goal of contacting every lead within minutes during business hours.

**The inspection and assessment.** Whether by drone, ladder, or both, do a thorough inspection and document everything with photos. CompanyCam or your CRM stores the visual record. For retail, you're assessing condition and scoping a replacement; for storm, you're documenting damage; for commercial, you're doing a roof survey.

**The presentation.** This is where deals are won. Sit with the homeowner (in person beats a emailed PDF for retail), walk them through the photos of their actual roof, explain the scope in plain language, present good-better-best options, explain the warranty, present financing, and give a clear written proposal. Professionalism here — showing up on time, looking organized, having a real presentation — separates you from the truck-and-a-ladder competitor.

**Handling objections and price.** The two big objections are price and trust. Price is handled with options, financing, and value framing (warranty, certification, reviews, the cost of doing it wrong). Trust is handled with reviews, references, certifications, insurance proof, and a professional process. Never win on price alone; you'll regret it on the P&L.

**The close and the contract.** A clear, written contract that specifies scope, materials, price, payment terms, warranty, and timeline. E-signature tools speed this up. Collect a deposit appropriate to your state's rules.

**CRM discipline.** Every lead, every estimate, every follow-up logged. The fortune in roofing is in the follow-up — many homeowners say "not yet," and the roofer with a CRM and a follow-up cadence captures them three months later when the competitor has forgotten they exist.

Track close rate by lead source. It tells you which marketing to fund and which salesperson to coach.

## Operational Workflow: From Signed Job to Final Payment

Once a job is sold, operational excellence determines whether it's profitable and whether the customer becomes a five-star review or a chargeback.

**Pre-job: scheduling and material ordering.** Order material to be delivered (ideally rooftop-loaded) on or just before install day. Pull permits where required. Schedule the crew. Confirm with the customer — date, what to expect, where to move cars, pets inside, the noise. Set up the dumpster.

**Install day: supervision.** Someone competent must lay eyes on the job — at minimum a start-of-day check and an end-of-day check, ideally a mid-day check. This is where the subcontractor model is risky: unsupervised crews cut corners. Document progress with photos. Verify tear-off is complete, decking is inspected and bad sheathing replaced, underlayment and flashing are done right, and ventilation is correct.

**Job completion: the quality checklist.** A formal final inspection against a checklist — proper nailing, flashing, sealed penetrations, clean valleys, correct ridge venting. Run the magnetic sweeper for nails — multiple times. Clean the property thoroughly; a clean jobsite is half the customer's impression of the whole job.

**The customer walkthrough and review request.** Walk the finished job with the customer, hand over warranty documentation, and the next day send the review request. Register the manufacturer warranty.

**Invoicing and collections.** Invoice immediately on completion. For retail, collect final payment at completion. For storm, manage the depreciation release and deductible. For commercial, manage the draw schedule and chase the receivable — commercial AR can sink a company that doesn't stay on top of it.

**Callbacks and warranty.** When a callback happens — and it will — respond fast and fix it without drama. How you handle a callback is a bigger reputation event than the original job.

The operational principle: roofing margins are made or lost in the field. A sold job at 42% gross margin becomes a 25% job through poor scheduling, material waste, callbacks, and slow collections. SOPs and supervision protect the margin you sold.

## Licensing, Legal Structure, Insurance, and Bonding

The regulatory and risk-management foundation is unglamorous and absolutely cannot be skipped.

**Licensing varies enormously by state.** Some states have a state contractor's license with a roofing classification (and a trade exam, experience requirement, and bond). Others license at the county or city level. Some have minimal licensing for roofing specifically. A founder must research their exact state, county, and city requirements — and the requirements of every jurisdiction they work in. Operating unlicensed where a license is required is a fast way to lose the business and face penalties.

**Legal structure.** Most roofers operate as an LLC or an S-corp for liability protection and tax treatment. Set this up with an attorney and CPA before doing work. Roofing has real liability exposure — falls, property damage, water intrusion from a botched job — and the entity is your first shield.

**Insurance is non-negotiable.** General liability ($1M/$2M is typical, more for commercial). Commercial auto. Workers' compensation — required in nearly every state if you have employees, and even with subcontractors many states or job sites require it; misclassifying employees as subs to dodge comp is a serious legal and financial risk. An umbrella policy. For commercial work, builder's risk and higher limits. Inland marine for tools and equipment. Expect $8K-$40K+/year in total premiums depending on size, lane, and state.

**Bonding.** A license bond (often required to get licensed) is small and cheap. Performance and payment bonds (required on many commercial and public jobs) are different — they require a bonding line from a surety, which requires reviewed or audited financials, working capital, and personal guarantees. Build a relationship with a surety agent early if commercial is your lane.

**Manufacturer certifications and EMR.** Certifications (covered earlier) often require insurance proof and good standing. Your EMR (Experience Modification Rate, a workers'-comp-based safety score) matters in commercial — a bad safety record raises your insurance cost and disqualifies you from bidding serious work.

**Contracts and compliance.** A solid contract template reviewed by an attorney. Compliance with consumer-protection rules (right-of-rescission, deposit limits), the insurance-claims regulations in storm states, lien laws (know your mechanic's lien rights and deadlines — they're how you get paid when a customer doesn't), and OSHA fall-protection requirements (roofing is one of OSHA's highest-scrutiny trades; falls are the leading cause of construction deaths).

Skipping any of this doesn't save money — it defers a much larger bill, sometimes a business-ending one.

## Competitor Analysis: Who You Are Up Against

A new roofer competes against four distinct types of incumbent, and the strategy against each is different.

**The truck-and-a-ladder solo operator.** The largest category by count. Often a skilled installer with no business systems — no CRM, no real marketing, no reviews discipline, slow to respond, sometimes unlicensed or underinsured. They compete on price and word of mouth. You beat them not on price but on professionalism: faster response, a real presentation, reviews, certifications, financing, and a clean process. There is enormous share to take from this group simply by running like a company.

**The established regional roofer.** A well-run company with crews, a brand, strong reviews, manufacturer certifications, and a marketing budget. They are the real competition. You don't beat them head-on in Year 1; you find an underserved sub-niche (a specific suburb, a material specialty like metal or tile, a service level like premium-only or fast-response repair) and build a beachhead.

**The storm-chaser.** Out-of-area companies that flood in after an event, often with aggressive canvassing and sometimes shady practices. They're a competitor for storm work and a reputational liability for the whole industry. You compete by being the *local, accountable, here-after-the-storm* roofer — the one a homeowner can find next year if there's a problem.

**The private-equity roll-up.** The newest and most formidable competitor. PE-backed platforms are buying up regional roofers, consolidating back-office and marketing, and spending heavily on lead generation. They have capital advantages you can't match on paid ads. You compete against them on the things capital can't buy quickly: genuine local reputation, owner-level relationships, crew loyalty, and service quality. Ironically, they are also your most likely eventual acquirer — building a roofer that competes well against the roll-ups is also building one they'll want to buy.

The competitive principle: do not try to beat everyone at everything. Pick a lane, pick a beachhead within it, and be unambiguously the best at that narrow thing before you broaden.

## Five Named Real-World Scenarios

**Scenario 1 — "Marcus, the retail builder."** Marcus, 34, spent six years as a sales rep for a regional roofer. He launches a retail-residential company in a 1.8M-person Sun Belt metro with $48K (truck, tools, insurance, software, $20K marketing, $15K cushion). He subs installs to two trusted crews. Year 1: heavy investment in Google LSA, a relentless review-request process, and GAF certification by month 10. He does $420K revenue, 11% net, pays himself $95K. Year 3: 3 crews, $1.9M revenue, hires a salesperson and a production manager. Year 5: $4.8M, a known local brand, fielding acquisition interest. Marcus's edge was treating it as a marketing-and-sales company from day one.

**Scenario 2 — "Tanya, the storm operator done right."** Tanya, 41, knocked doors for storm roofers for three seasons. She launches in a hail-prone Midwest/Plains metro with $55K. She builds and trains a canvassing team, but she runs the legitimate playbook: honest damage documentation, never touches deductibles, supplements accurately, builds clean relationships with adjusters. A major hail event in month 7 produces a $900K six-week surge. The discipline: she uses the storm cash to fund a retail brand and Google presence so she's not naked when the storms stop. Year 3: $2.4M blended storm + retail, far more durable than her old bosses' pure-storm shops.

**Scenario 3 — "The Reyes brothers, commercial specialists."** Two brothers, one with 12 years of commercial roofing field experience, one with a finance background. They launch commercial-only with $180K, focused on TPO and EPDM for warehouses and retail centers. Year 1 is slow — $680K, mostly small repairs and one mid-sized reroof — as they build property-manager relationships and a Carlisle certification. They aggressively sell roof-asset-management contracts. By Year 4 they have 55 buildings under maintenance contract, $5.5M revenue, smooth seasonality, and a bonding line that lets them bid school and municipal work.

**Scenario 4 — "Dee, the under-capitalized cautionary tale."** Dee, 29, launches with $6K and a credit card right after a storm. The first three months feel incredible — $140K of insurance work. Then the storm work dries up. She has no retail brand, no Google presence, no cushion. She chases a storm 200 miles away, takes jobs she can't supervise, eats two callbacks and a chargeback, and mismanages a supplement. Month 16: out of business, $40K in debt. Her failure wasn't effort or skill — it was the default-playbook trap: undercapitalized, no compounding asset, pure storm dependence.

**Scenario 5 — "Linda, the lifestyle metal-roof niche."** Linda, 48, a former GC, launches a deliberately small premium niche: standing-seam metal roofs for high-end homes in a mountain region. She stays one crew, charges premium prices, builds a referral-and-reputation engine, and never chases volume. Year 5: $1.3M revenue, ~22% net, $250K+ owner take-home, 35-hour weeks outside peak season. Not every roofer needs to be a roll-up; Linda built exactly the business she wanted.

## Year 1 Through Year 5 Revenue Trajectory

**Year 1 (months 1-12). Goal: $280K-$650K revenue, owner-operator selling and subbing installs.**
- Months 1-3: Form the entity, get licensed and insured, build the website and branding, set up the CRM and estimating software, line up 1-2 subcontractor crews and a supplier account, launch Google LSA. First few jobs from network and early marketing. Revenue: light.
- Months 4-8: Marketing engine ramps, review profile builds, close rate improves, first manufacturer certification in progress. Revenue: building to $30K-$70K/month.
- Months 9-12: Steady lead flow, possibly a small storm surge, a second crew relationship. Year total $280K-$650K, owner take-home $70K-$160K.

**Year 2 (months 13-24). Goal: $700K-$1.6M revenue.**
- Add a dedicated salesperson or a production/project manager (the owner cannot keep doing both forever).
- Manufacturer certification achieved; reviews and referrals now a meaningful lead source.
- 2-3 crews running. Revenue per crew $500K-$1M.

**Year 3 (months 25-36). Goal: $1.4M-$3.5M revenue.**
- Real org chart: owner, sales team, production manager, office/admin, 3-5 crews (mix of W-2 leads and subs).
- Lead-gen diversified: paid, organic, referral, and either storm or commercial relationships maturing.
- Net margin 8-14% with the owner paid a real salary.

**Year 4 (months 37-48). Goal: $2.5M-$6M revenue.**
- Strategic fork: scale toward a regional brand (more crews, more markets, more marketing) or optimize for profit and lifestyle (cap size, raise margin, premium positioning).
- Systems and management depth determine which is possible.

**Year 5 (months 49-60). Goal: $4M-$12M revenue, decision point.**
- Continue scaling into a multi-market regional brand;
- Or run a high-margin lifestyle company;
- Or sell to a PE roll-up or strategic acquirer at 4.5x-7.5x EBITDA (a $6M-revenue roofer at a 12% EBITDA margin = $720K EBITDA; at 5.5x = ~$4M enterprise value).

These ranges assume a committed founder who treats roofing as a company, not a trade. Undercapitalized or unfocused launches routinely do a fraction of this or fail.

## Hiring and Org Structure: Who You Add and When

A roofing company's growth is gated by the founder's willingness to hire ahead of the chaos.

**First hire — administrative/office support (often Year 1).** The owner is selling, project-managing, and collecting; they cannot also do permits, scheduling logistics, answering phones, invoicing, and CRM data entry. A part-time then full-time office coordinator is frequently the highest-ROI first hire because it returns the owner's time to selling, which is the revenue engine.

**Second hire — a salesperson or a production/project manager.** The owner is doing two full-time jobs (selling and running production) and one of them is bottlenecking. If the owner is a strong salesperson, hire a production manager to own crews, scheduling, and quality. If the owner is better at operations, hire a salesperson (commission-heavy comp). Most owners are better salespeople and should hire production first.

**Third hire — crew leads and the W-2 core.** As volume justifies it, bring key crew leads in-house for quality and consistency, supplementing with subs for surge.

**Year 3-5 hires — sales manager, more PMs, office staff, possibly a controller/bookkeeper, a recruiter.** At $2M+ revenue you need management layers and real financial discipline. A bookkeeper or fractional controller who actually closes the books monthly is essential — roofers who fly blind on their numbers make catastrophic pricing and cash-flow mistakes.

**The recruiting function is permanent.** Because crews are the bottleneck, recruiting is never "done." The best roofers have a continuous pipeline for canvassers, sales reps, crew members, and PMs. Treat recruiting like marketing: always-on, with a budget and a process.

**Compensation principles.** Pay crews promptly and competitively — it's the #1 retention lever. Pay salespeople a commission structure that rewards margin, not just revenue (a rep who closes everything by discounting is destroying the company). Give production managers a stake in margin and quality outcomes.

The org-structure principle: the founder's job evolves from doing the work, to managing the people who do the work, to building the systems that manage the people. Founders who refuse that evolution cap out around $1M-$1.5M and burn out.

## Risk Mitigation: What Actually Kills Roofing Companies

**Risk 1 — Running out of cash in the working-capital gap.** The #1 killer. Mitigation: capitalize for a slow quarter and a 45-day-late job; collect deposits and progress payments; invoice instantly; chase receivables relentlessly; keep a line of credit.

**Risk 2 — Material and labor cost volatility.** Shingle, membrane, and insulation prices have swung hard since 2020; labor costs keep climbing. Mitigation: short estimate-validity windows (30 days), price-escalation clauses on commercial jobs, supplier relationships, and never quoting a job months out at today's prices.

**Risk 3 — Crew loss and the labor shortage.** Mitigation: pay fast and fair, provide steady work, build a recruiting pipeline, treat crews as the customer they effectively are, run a hybrid W-2/sub model so you're not fully exposed either way.

**Risk 4 — Quality callbacks and reputation damage.** A bad job goes viral locally. Mitigation: supervision, quality checklists, magnetic-sweep discipline, fast no-drama callback response.

**Risk 5 — Insurance-claims regulatory exposure (storm).** Carriers and regulators are cracking down. Mitigation: run the legitimate playbook only — honest documentation, never touch deductibles, honest supplements, clean adjuster relationships.

**Risk 6 — Underpricing.** Mitigation: estimating software, margin (not markup) discipline, good-better-best, the willingness to lose bad jobs.

**Risk 7 — Safety incidents and OSHA exposure.** Falls kill roofers and end companies. Mitigation: real fall-protection equipment and training, a safety culture, a good EMR, documented procedures.

**Risk 8 — Customer concentration (commercial).** One big property-management client at 30%+ of revenue is a hostage situation. Mitigation: diversify the client base; build many maintenance contracts rather than a few huge ones.

**Risk 9 — Seasonality and weather dependence.** Mitigation: a lane mix that smooths the calendar (commercial and retail are less seasonal than storm), and a cash cushion for the slow months.

**Risk 10 — Founder doing $20/hour work instead of $500/hour work.** Mitigation: hire admin and production support early so the founder stays on sales and strategy.

**Risk 11 — Legal exposure from unlicensed work, misclassified labor, or weak contracts.** Mitigation: license everywhere you work, classify labor correctly, use attorney-reviewed contracts, carry proper insurance.

**Risk 12 — Getting out-marketed by PE roll-ups.** Mitigation: compete on local reputation, relationships, and service quality — and build toward being an acquisition target rather than a roll-up casualty.

## Exit Strategy: What a Roofing Business Sells For

Roofing has become a genuinely attractive acquisition target, and a founder should build with the exit in mind even if they never sell.

**Buyer type 1 — Private-equity roofing roll-ups.** The most active buyers in 2025-2027. PE-backed platforms are consolidating regional roofers to build multi-market brands. They pay 4.5x-7.5x EBITDA for well-run companies, with larger and more systematized businesses at the high end. They want recurring or repeatable revenue, clean financials, a real management team that stays, diversified customers, and processes that survive the founder leaving.

**Buyer type 2 — Strategic acquirers (larger regional or national roofers).** Established roofers buying to enter a new market or add capacity. Multiples similar to PE, sometimes with more earn-out.

**Buyer type 3 — Individual buyers / search funds.** For smaller roofers ($500K-$2M revenue), the buyer is often an individual operator or a search-fund entrepreneur. Multiples are lower (2.5x-4x SDE) and deals are more earn-out and seller-note heavy.

**What drives the multiple up:** EBITDA margin and size, customer and lane diversification (a balanced retail/commercial mix beats pure storm), recurring revenue from maintenance contracts, a management team that runs the company without the founder, clean books, strong online reputation, manufacturer certifications, a defensible local brand, and a healthy backlog.

**What drives the multiple down:** founder-dependence (if the owner *is* the sales engine, the business is worth far less), pure storm dependence (lumpy, regulatory-exposed revenue), customer concentration, messy financials, callback/warranty liabilities, safety record problems, and licensing or legal issues.

**Typical deal structure:** a mix of cash at close, a seller note, an earn-out tied to retained revenue and margin, and often a requirement that the founder stay 12-36 months. Working-capital normalization and a non-compete are standard.

The exit principle is also just a good-management principle: the things that make a roofing company sellable — diversified revenue, recurring contracts, a real team, clean numbers, a brand independent of the founder — are exactly the things that make it a good business to own. Build for the exit and you build a better company even if you keep it.

## Owner Lifestyle: What Running a Roofing Company Actually Feels Like

The honest picture matters because the lifestyle is not what the "trades are easy money" content implies.

**Year 1** is hard. 55-70 hour weeks. The founder is selling, project-managing, collecting, recruiting crews, doing marketing, and learning the regulatory landscape simultaneously. Income is real but volatile — great months and scary months. Stress is high; autonomy is high. Weather dictates the calendar. The founder is on roofs, in driveways selling, on the phone with suppliers, and doing paperwork at night.

**Year 3** at $1.4M-$3.5M with a team feels different. 45-55 hour weeks, less in the off-season. The founder has shifted from doing the work to managing the people doing the work. Income is more predictable and meaningfully larger. The stress shifts from "will I get a job" to "people problems and cash-flow management." Peak season (spring through fall in most markets, post-storm anytime) is intense; winter in cold climates is slower and a real breather.

**Year 5** at scale, *if* the founder built systems and a team, can be a genuine 40-45 hour week with strong six-figure-plus income and the optionality to sell. If the founder never let go of being the bottleneck, Year 5 looks like Year 1 with more zeros and more exhaustion.

**The texture of the work:** roofing is physical-adjacent (you're outside, on roofs, in weather, even as an owner who doesn't install), it's weather-stressed (a rained-out week scrambles everything), it's people-intensive (crews, customers, adjusters, suppliers, inspectors), and it's cash-intensive. It rewards founders who like tangible work, fast feedback, and building a team. It punishes founders who want a quiet desk job or who can't tolerate the chaos of weather and labor.

**Who thrives:** former sales reps, former PMs, former GCs, and disciplined operators who treat it as a company. **Who struggles:** skilled installers who hate selling and managing, founders who can't handle cash-flow volatility, and anyone who launched undercapitalized and unfocused.

## Common Year-1 Mistakes That Sink New Roofers

- **Not picking a lane** — being mediocre at retail, storm, and commercial instead of excellent at one.
- **Undercapitalization** — launching with $5K when the working-capital gap requires $30K-$75K of cushion.
- **Pure storm dependence** — building nothing that compounds, then dying when the storms stop.
- **Confusing markup with margin** — a 35% markup is a 26% margin; quoting this way slowly bankrupts you.
- **No CRM, no follow-up** — losing the 60% of leads that say "not yet" because nobody followed up.
- **Skipping manufacturer certification** — leaving warranty value, locator placement, and credibility on the table.
- **No review system** — not systematically requesting reviews, so the compounding reputation engine never starts.
- **Misclassifying labor** — calling employees subcontractors to dodge workers' comp; a serious legal and financial bomb.
- **Operating unlicensed or underinsured** — saving pennies, risking the whole business.
- **Unsupervised subcontractor crews** — corners get cut, callbacks pile up, reputation craters.
- **Slow collections** — invoicing late and not chasing receivables, then running out of cash.
- **The founder doing $20/hour work** — buried in admin instead of selling, capping growth.
- **Quoting jobs months out at today's prices** — getting crushed when material costs jump.
- **Chasing storms across state lines** — new licensing, no local reputation, unsupervisable crews, warranty obligations you'll never honor.
- **No safety culture** — one fall changes everything.

## A Decision Framework for Choosing Your Roofing Path

A founder deciding whether and how to start a roofing business should work through these questions in order.

**1. Do I have a real capital cushion?** If you cannot put $25K-$75K (sub model) or $95K-$220K (W-2/commercial) behind this, either raise it, start sub-only and lean, or wait. Undercapitalization is the leading cause of death.

**2. Which lane fits my background and market?** Sales background and a stable metro → retail. Storm-canvassing experience and a hail-prone region → storm, run legitimately, with a retail brand built alongside. Commercial field experience plus access to capital and bonding → commercial. Don't pick the lane that sounds exciting; pick the one your skills and market support.

**3. Am I a salesperson or an operator — and have I planned for the other half?** If you're a closer, you must hire production early. If you're an operations person, you must hire or partner for sales. A roofer who is great at neither should reconsider.

**4. Sub crews or W-2 crews to start?** Almost always start sub-heavy for capital efficiency, then add W-2 crew leads as volume justifies. Go straight to W-2 only if you have the capital and a specific quality or commercial reason.

**5. What is my compounding asset?** If the answer is "nothing, I just chase storms," stop and redesign. The asset is a brand, a review profile, a customer database, and relationships. Build one from week one.

**6. Can I tolerate the lifestyle?** Weather chaos, cash-flow swings, people problems, physical-adjacent work, seasonality. If that sounds intolerable, this isn't your business.

**7. What's my 5-year intent?** Lifestyle company, regional scale, or build-to-sell? The answer changes how you hire, what margin you target, and how you structure everything. Decide early; revisit annually.

If the answers line up — capital, a clear lane, a sales-or-operations plan with the gap covered, a compounding asset, lifestyle tolerance, and a 5-year intent — roofing is one of the best cash-generative businesses a founder can start. If they don't line up, the honest move is to fix the gaps before launching, not to launch and hope.

## The Five-Year and AI Outlook for Roofing

**AI changes the office, not the roof.** The physical install will remain human-and-skill-dependent for the foreseeable future — robotic shingle installers and drones-that-roof are experimental, not operational at scale. What AI genuinely changes by 2030 is everything around the install: AI-assisted aerial measurement and estimating get faster and more accurate; AI handles lead intake, scheduling, and customer follow-up; AI drafts supplements and reviews insurance scopes; AI-driven marketing optimizes spend. The roofer who adopts these tools runs leaner; the one who ignores them gets out-operated.

**Consolidation continues.** The PE roll-up wave is not done. Expect more regional roofers acquired, more multi-market brands, and more marketing-spend pressure on independents. This is simultaneously a threat (you're out-spent) and an opportunity (a great exit, and roll-ups create operational messes you can exploit locally).

**Insurance and storm work get harder and cleaner.** Carriers will keep tightening claims handling, raising wind/hail deductibles, and pushing for regulatory reform of abusive practices. Pure storm-chasing gets squeezed; legitimate, relationship-based storm restoration survives. The trend favors honest operators and punishes the abusive playbook.

**Material and labor pressure persists.** Cost volatility and the labor shortage are structural, not transient. The roofers who win will be the best recruiters and the most disciplined estimators.

**Sustainability and new materials grow.** Cool roofs, solar-integrated roofing, more durable and impact-resistant materials, and energy-code requirements expand. Commercial especially sees more roof-as-energy-asset thinking. A roofer who builds capability here has an edge.

**The fundamentals do not change.** Roofs will keep aging and failing. Weather will keep happening. Demand will stay non-discretionary. The business will keep rewarding founders who treat it as a sales-and-recruiting company with disciplined operations and clean cash management. Technology changes the tools; it does not change the thesis.

## A Final Framework: Roofing as a Company, Not a Trade

The single idea a founder must internalize is that a roofing business is not a roofing skill — it is a company that markets, sells, recruits, schedules, supervises, and collects, and that happens to install roofs (often through crews the owner doesn't personally lead). Every failure mode traces back to forgetting this. The undercapitalized founder forgot it's a working-capital business. The storm-chaser forgot it's a brand-and-asset business. The skilled-installer-turned-owner who hates selling forgot it's a sales business. The founder buried in admin forgot it's a leverage business.

The roofers who build something valuable — something that pays them well, runs without them, and someone wants to buy — do six things consistently. They **pick one lane and dominate a beachhead** before broadening. They **capitalize for the slow quarter and the late-paying job.** They **build a compounding asset** — a brand, a review engine, a database, relationships — so leads don't depend on weather. They **treat recruiting as permanent marketing** because crews are the real bottleneck. They **protect margin with disciplined pricing and field supervision**, knowing margin is made or lost after the contract is signed. And they **hire ahead of the chaos** so the founder evolves from doing the work to building the systems.

Roofing in 2027 is a strong bet: durable demand, weather-driven counter-cyclicality, a real exit market, and a low-enough barrier that a disciplined founder can enter. But it is strong *only* for the founder who runs it as a company. The trade is learnable or subcontractable. The company is the hard part — and the company is the whole game.

`;

const flow = `

## Decision Flow: From Founder Profile to Roofing Lane and Launch

\`\`\`mermaid
flowchart TD
  A[Decide To Start A Roofing Business] --> B{Capital Available}
  B -->|Under 25K| B1[Start Sub Only Lean Or Raise More First]
  B -->|25K to 75K| B2[Subcontractor Model Viable]
  B -->|95K to 220K Plus| B3[W2 Crews Or Commercial Viable]
  B1 --> C{Which Lane Fits Background And Market}
  B2 --> C
  B3 --> C
  C -->|Sales Background Stable Metro| C1[Retail Replacement Roofing]
  C -->|Storm Canvassing Experience Hail Region| C2[Storm Insurance Restoration]
  C -->|Commercial Field Experience Plus Bonding| C3[Commercial Flat Roof Systems]
  C1 --> D1[Build Google LSA And Reviews Engine]
  C2 --> D2[Build Canvassing Team Run Legitimate Playbook]
  C3 --> D3[Build Property Manager And GC Relationships]
  D1 --> E[Set Up CRM Estimating Software Supplier Account]
  D2 --> E
  D3 --> E
  E --> F[Form LLC License Insure Bond]
  F --> G{Sub Crews Or W2 Crews}
  G -->|Capital Efficient Start| G1[Subcontractor Crews Supervised]
  G -->|Quality And Control| G2[W2 Crew Core Plus Sub Surge]
  G1 --> H[First Jobs From Network And Early Marketing]
  G2 --> H
  H --> I{Build A Compounding Asset}
  I -->|Yes Brand Reviews Database Relationships| I1[Leads Independent Of Weather]
  I -->|No Pure Storm Dependence| I2[Default Playbook Trap Risk Of Failure]
  I1 --> J[Year 1 280K to 650K Revenue]
  I2 --> J
  J --> K[Hire Admin Then Production Or Sales]
  K --> L[Year 3 1.4M to 3.5M With 2 To 4 Crews]
  L --> M{Five Year Intent}
  M -->|Lifestyle| M1[Cap Size Raise Margin Premium Positioning]
  M -->|Scale| M2[Multi Market Regional Brand]
  M -->|Sell| M3[Build To Sell PE Roll Up 4.5x to 7.5x EBITDA]
\`\`\`

## Comparison Matrix: Retail vs Storm vs Commercial Roofing

\`\`\`mermaid
flowchart TD
  Z[Three Roofing Businesses Compared] --> R[Retail Replacement]
  Z --> S[Storm Insurance]
  Z --> K[Commercial Flat Roof]
  R --> R1[Customer Homeowner Pays Out Of Pocket]
  R --> R2[Gross Margin 38 to 52 Percent]
  R --> R3[Avg Job 9K to 22K Residential]
  R --> R4[Lead Gen Google LSA Reviews Certifications Referrals]
  R --> R5[Seasonality Moderate]
  R --> R6[Risk Slow To Start Needs Marketing Investment]
  R --> R7[Compounds Through Reputation]
  S --> S1[Customer Insurance Carrier Pays]
  S --> S2[Gross Margin 45 to 60 Percent]
  S --> S3[Avg Job 12K to 20K Plus Supplements]
  S --> S4[Lead Gen Canvassing Crews Adjuster Relationships]
  S --> S5[Seasonality Extreme Feast Or Famine]
  S --> S6[Risk Regulatory Crackdown Reputational Exposure]
  S --> S7[Builds Nothing Unless Paired With Retail Brand]
  K --> K1[Customer Property Manager Owner GC REIT]
  K --> K2[Gross Margin 22 to 34 Percent]
  K --> K3[Avg Job 40K to 500K Plus]
  K --> K4[Lead Gen Relationships Maintenance Contracts]
  K --> K5[Seasonality Low Most Durable]
  K --> K6[Risk Needs Capital Bonding Technical Knowledge]
  K --> K7[Recurring Revenue Sticky Multi Year Relationships]
\`\`\`

`;

const src = `

## Sources

1. **National Roofing Contractors Association (NRCA)** — Industry size, market data, technical standards, contractor resources, and roofing-systems guidance. https://www.nrca.net
2. **IBISWorld — Roofing Contractors in the US Industry Report** — Market size, segmentation, competitive landscape, and profitability benchmarks for the US roofing industry.
3. **US Bureau of Labor Statistics — Roofers (OES 47-2181) and Construction Industry Data** — Employment, wage, labor-supply, and occupational-safety data for the roofing trade. https://www.bls.gov/oes/current/oes472181.htm
4. **OSHA — Fall Protection in Roofing and Construction (29 CFR 1926 Subpart M)** — Federal fall-protection requirements; falls are the leading cause of construction fatalities. https://www.osha.gov/fall-protection
5. **GAF Master Elite Contractor Program** — Manufacturer certification requirements, enhanced warranty offerings, and contractor locator. https://www.gaf.com
6. **Owens Corning Platinum Preferred Contractor Program** — Manufacturer certification tiers and warranty structures for residential roofing contractors. https://www.owenscorning.com
7. **CertainTeed SELECT ShingleMaster Program** — Manufacturer certification and warranty program for roofing contractors. https://www.certainteed.com
8. **Carlisle SynTec Systems — Commercial Roofing and Certified Applicator Program** — TPO/EPDM systems, NDL warranties, and commercial applicator certification. https://www.carlislesyntec.com
9. **Holcim / Firestone Building Products (Elevate)** — Commercial membrane roofing systems and contractor certification.
10. **Johns Manville Commercial Roofing Systems** — Commercial roofing membranes, insulation, and contractor programs.
11. **Insurance Information Institute (III) — Catastrophe and Severe Convective Storm Loss Data** — Trends in insured losses from hail and wind events driving storm-restoration demand. https://www.iii.org
12. **National Insurance Crime Bureau (NICB) — Contractor Fraud and Storm-Chasing Advisories** — Documentation of insurance-claim abuse patterns and enforcement trends in storm roofing.
13. **Xactimate (Verisk) — Insurance Claims Estimating Platform** — Industry-standard estimating software used in insurance claim scoping and supplementing.
14. **EagleView — Aerial Roof Measurement** — Aerial measurement reports used for accurate roofing estimates. https://www.eagleview.com
15. **AccuLynx — Roofing CRM and Project Management Software** — Roofing-specific CRM, estimating, and production-management platform. https://www.acculynx.com
16. **JobNimbus — Roofing and Contractor CRM** — CRM, estimating, and workflow software for roofing contractors. https://www.jobnimbus.com
17. **Roofr — Roofing Sales and Measurement Platform** — Aerial measurements, instant estimates, and proposals for roofing contractors. https://www.roofr.com
18. **CompanyCam — Jobsite Photo Documentation** — Photo-documentation tool used for jobsite records, dispute protection, and customer communication. https://www.companycam.com
19. **Google Local Service Ads — Home Services Advertising** — Pay-per-lead advertising and Google Guaranteed badge program for roofing and home-service contractors. https://ads.google.com/local-services-ads
20. **GreenSky, Hearth, Service Finance, Sunlight Financial** — Consumer financing platforms used by roofing contractors to increase close rates and average ticket.
21. **Roofing Contractor Magazine** — Industry trade publication covering market trends, technology, and business practices. https://www.roofingcontractor.com
22. **Roofing Contractor — State of the Industry Reports** — Annual surveys of roofing contractor revenue, margins, challenges, and outlook.
23. **Associated Builders and Contractors (ABC) — Construction Labor Shortage Data** — Workforce and labor-supply analysis affecting roofing crew availability.
24. **US Small Business Administration (SBA)** — Business formation, licensing, financing, and bonding guidance for contracting startups. https://www.sba.gov
25. **State Contractor Licensing Boards (e.g., CSLB California, TDLR Texas, Florida DBPR)** — State-by-state roofing license requirements, exams, and bonding rules.
26. **Surety & Fidelity Association of America (SFAA)** — Performance and payment bond requirements and surety underwriting for contractors. https://www.surety.org
27. **National Association of Home Builders (NAHB)** — Residential construction and remodeling market data relevant to reroofing demand.
28. **Building Owners and Managers Association (BOMA) International** — Commercial building-management community and roofing-procurement context. https://www.boma.org
29. **International Facility Management Association (IFMA)** — Facility-management community relevant to commercial roof-asset-management sales. https://www.ifma.org
30. **Asphalt Roofing Manufacturers Association (ARMA)** — Technical standards and material guidance for asphalt shingle roofing. https://www.asphaltroofing.org
31. **Single Ply Roofing Industry (SPRI)** — Standards and technical guidance for commercial single-ply membrane roofing.
32. **Experience Modification Rate (EMR) — NCCI Workers' Compensation Data** — Safety-score methodology affecting insurance cost and commercial bidding eligibility.
33. **Podium, NiceJob — Reputation and Review Management Platforms** — Tools for systematic review generation in home-service businesses.
34. **JobNimbus / AccuLynx State of Roofing Reports** — Software-vendor industry surveys on roofing contractor operations and growth.
35. **Private Equity Roofing Roll-Up Coverage (industry M&A reporting)** — Reporting on PE-backed roofing consolidation, acquisition multiples, and platform strategies.
36. **QuickBooks for Contractors (Intuit)** — Job-costing and accounting practices for construction and roofing businesses.
37. **FEMA and NOAA Severe Weather Data** — Hail, wind, and hurricane event tracking relevant to storm-restoration demand patterns.
38. **Roofing Industry Mechanic's Lien Resources (state lien law guides)** — Lien rights, deadlines, and payment-protection mechanisms for roofing contractors.

`;

const num = `

## Numbers

**Market Size**
- US roofing market (residential + commercial combined): ~$25-$30B annual revenue
- Residential share of market: ~60-65%; commercial share: ~35-40%
- Reroofing and repair vs new construction: majority of revenue is replacement/repair
- Mid-sized metro (1.5-2.5M people) total roofing demand: ~$300M-$700M/year
- Retail-residential SAM in such a metro: ~$180M-$400M
- Commercial SAM in such a metro: ~$90M-$220M
- Even a successful regional roofer: rarely exceeds 3-6% metro share

**Startup Costs**
- Subcontractor model launch (retail or storm): $18K-$75K total
- W-2 crew model launch (any lane): $95K-$220K total
- Used truck or van: $8K-$30K
- Ladders and basic tools: $1.5K-$4K
- Licensing and permits: $200-$2,500 (state-dependent)
- General liability insurance to start: $1,800-$6,000/year
- Workers' comp: $4K-$20K/year (state and headcount dependent)
- Surety/license bond: $200-$1,000/year (modest bond)
- CRM and estimating software: $150-$600/month
- Website and basic branding: $1,500-$6,000
- Initial marketing: $3K-$15K
- Operating cushion (sub model): $15K-$40K
- Operating cushion (W-2 model): $40K-$80K
- Commercial working-capital needs: $100K-$300K+
- Drone for inspections/measurement: $500-$2,000
- W-2 crew vehicle/equipment build-out: $40K-$120K

**Job Unit Economics — Retail Residential**
- Average residential job: $9,000-$22,000
- Materials as % of price: ~30-38%
- Labor (subcontracted) as % of price: ~18-28%
- Dumpster/disposal: $400-$700
- Permits: $150-$500
- Gross margin: 38-52%
- Target net margin (owner paid a real salary): 8-15%

**Job Unit Economics — Storm/Insurance**
- Average storm job: $12,000-$20,000+ plus supplements
- Gross margin: 45-60% (with legitimate supplementing)
- Carrier pays ACV up front, recoverable depreciation on completion
- Wind/hail deductibles increasingly separate and higher

**Job Unit Economics — Commercial**
- Average commercial job: $40,000-$500,000+
- Materials as % of price: ~35-45% (insulation a major line item)
- Labor as % of price: ~20-30%
- Equipment and logistics: ~5-10%
- Gross margin: 22-34%
- Commercial AR terms: often 30-60+ days

**Pricing Mechanics**
- Markup vs margin: 35% markup = 26% gross margin; ~82% markup needed for 45% margin
- A "square" = 100 square feet of roof
- Estimate validity window (recommended): 30 days
- Good-better-best presentation: measurably lifts close rate and average ticket
- Financing dealer fee: a real cost, build into price

**Crew and Labor Economics**
- Residential crew output in season: 1.5-3 asphalt roofs/week
- Healthy revenue per residential crew per year: $500K-$1.2M
- Subcontractor crews: paid per square or per job
- Paying crews fast and reliably: #1 crew-retention lever

**Marketing**
- Serious retail roofer Google spend in season: $3,000-$15,000+/month
- LSA: pay-per-lead, high-intent, Google Guaranteed badge
- Review system: highest-ROI activity in the business
- Manufacturer certification: Year-1-to-2 goal (requires volume, training, insurance)

**Revenue Trajectory (Realistic, Committed Founder)**
- Year 1: $280K-$650K revenue, owner take-home $70K-$160K
- Year 2: $700K-$1.6M revenue, 2-3 crews
- Year 3: $1.4M-$3.5M revenue, 2-4 crews, net margin 8-14%
- Year 4: $2.5M-$6M revenue
- Year 5: $4M-$12M revenue, decision point

**Insurance and Compliance**
- Total insurance premiums (GL, auto, comp, umbrella): $8K-$40K+/year
- General liability typical limits: $1M/$2M (higher for commercial)
- Workers' comp: required in nearly every state with employees
- Performance/payment bonds: required on many commercial and public jobs
- OSHA: roofing is among the highest-scrutiny trades; falls lead construction deaths
- EMR (Experience Modification Rate): affects insurance cost and commercial bid eligibility

**Exit / Sale Multiples**
- PE roofing roll-ups: 4.5x-7.5x EBITDA for well-run companies
- Strategic acquirers: similar, sometimes more earn-out
- Individual buyers / search funds ($500K-$2M revenue firms): 2.5x-4x SDE
- Example: $6M revenue × 12% EBITDA = $720K EBITDA × 5.5x = ~$4M enterprise value
- Multiple-up drivers: size, margin, diversified lanes, recurring maintenance revenue, real management team, clean books, brand independent of founder
- Multiple-down drivers: founder-dependence, pure storm dependence, customer concentration, messy financials, safety/legal issues

**Competitive Landscape**
- Industry composition: overwhelmingly small (1-3 crew) contractors
- Largest competitor category by count: truck-and-a-ladder solo operators
- Most formidable new competitor: PE-backed roll-ups (capital advantage on marketing)
- Most likely eventual acquirer: also the PE roll-ups

`;

const counter = `

## Counter-Case: Why Starting a Roofing Business in 2027 Might Be a Mistake

The bull case for roofing is genuinely strong, but a serious founder should pressure-test it against the conditions that make this business hard, dangerous, or simply wrong for them. There are real reasons to walk away.

**Counter 1 — It is a brutal working-capital business disguised as a cash machine.** Roofing *looks* like easy money because the jobs are big and the gross margins are fat. But you pay crews and material suppliers long before customers pay you, and the gap is where companies die. A single 45-day-late commercial receivable, a slow February, or one big job gone sideways can drain the account. Many roofers who "feel rich" in month six are insolvent by month eighteen. If you are not genuinely comfortable managing cash flow — not just earning revenue — this business will punish you.

**Counter 2 — The labor shortage may be an unsolvable structural ceiling for you specifically.** Crews are the bottleneck, full stop. The construction labor pool is aging, hard to replenish, and affected by immigration policy. Good crews are fought over. If you cannot recruit and retain reliable installers — and many founders cannot, because it requires paying fast, providing steady work, and earning a reputation as a good roofer to work for — you will be stuck turning down jobs you sold. A founder who is great at selling roofs but cannot field crews has built a lead-generation machine with no engine.

**Counter 3 — Storm work is getting structurally harder and the regulatory risk is real.** If your plan leans on storm/insurance work, understand that insurance carriers are actively tightening claims handling, raising wind/hail deductibles, and pushing legislative reform precisely because the storm-roofing industry earned a bad reputation. Regulators and the NICB are prosecuting fraud. Even legitimate operators face more friction, more denied claims, and more scrutiny. And the temptation to cross ethical lines — rebate the deductible, inflate the supplement — is constant and is exactly what gets businesses shut down. If you do not have the discipline to run the legitimate playbook in a tempting environment, storm work is a liability, not an opportunity.

**Counter 4 — PE roll-ups can out-spend you on the thing that matters most: leads.** The private-equity consolidation wave means you are increasingly competing against well-capitalized platforms that can outbid you on Google, LSAs, and every paid channel, and that can afford to lose money acquiring customers to build market share. Their cost of capital and marketing budget are advantages you cannot match. You are betting that local reputation and relationships beat capital — and sometimes they do, but it is a genuine fight, and in some metros the roll-ups are simply winning.

**Counter 5 — Material and labor cost volatility can vaporize your margin between quote and install.** Shingle, membrane, and insulation prices have swung violently since 2020. If you quote a job and material costs jump 15% before you install, your 42% gross margin can become 28% — and on a fixed-price contract you eat it. Commercial jobs quoted months out are especially exposed. A founder who is not disciplined about short estimate windows and escalation clauses is one supply shock away from a money-losing backlog.

**Counter 6 — Seasonality and weather dependence create income volatility that breaks people.** In cold-climate markets, winter is genuinely slow. Even in the Sun Belt, a rainy stretch scrambles the schedule and the cash flow. Storm-dependent revenue is feast-or-famine by nature. The psychological toll of great months followed by scary months is real, and many founders — especially those who left a steady paycheck — cannot tolerate it. The business does not pay evenly, and pretending it does leads to disaster.

**Counter 7 — The safety and liability exposure is among the highest of any business you could start.** Roofing has one of the highest fatality and injury rates in all of construction; falls are the number-one killer. One serious accident — to a crew member or a customer's property — can trigger litigation, an OSHA investigation, a workers' comp claim cascade, and an insurance-rate spike that ends the business. You are personally responsible for a fundamentally dangerous activity. That weight does not lift, and for some founders it is simply not worth it.

**Counter 8 — It is far more sales-and-management than most aspiring roofers want it to be.** Many people drawn to roofing are tradespeople who like the craft. But the owner's job is selling in driveways, recruiting and managing crews, chasing receivables, handling customer complaints, and doing marketing — not installing. A skilled roofer who hates selling and managing people will be miserable and mediocre as an owner. If you want to be on roofs doing quality work, being an *employee* of a good roofer may genuinely be the better life.

**Counter 9 — Reputation is fragile and the downside is asymmetric.** It takes years of good jobs to build a five-star reputation and one bad job, one botched callback, one nasty review, or one storm-chaser-style complaint to damage it locally. In a connected community, a few bad experiences can outrun a hundred good ones. The asymmetry means the stress of quality control never ends — every single job is a reputational bet.

**Counter 10 — Licensing, classification, and legal complexity are a minefield, especially across jurisdictions.** Requirements vary by state, county, and city. Worker classification rules are strict and misclassifying employees as subcontractors to dodge workers' comp is a serious, business-ending legal risk that many small roofers take anyway. Lien laws, consumer-protection rules, and contract requirements differ everywhere. A founder who is sloppy here is not saving money; they are accumulating a deferred legal bill.

**Counter 11 — Customer concentration in commercial can turn your business into a hostage situation.** The commercial path's appeal is sticky, multi-year relationships. The flip side: if one property-management client becomes 30-40% of revenue, that client effectively controls your company. They can squeeze your pricing, pay slowly, or leave — and any of those can be catastrophic. Building diversified commercial relationships takes years; until then, concentration risk is acute.

**Counter 12 — Better-fit alternatives exist for many founders.** If you have capital and want a less weather-dependent, less safety-intensive trade, HVAC, plumbing, or electrical service businesses have recurring-service revenue and similar consolidation tailwinds without the fall risk and seasonality. If you have a sales background but not a trades background, there are home-service businesses with gentler operations. Roofing is *a* good business — it is not automatically *the* best business for your specific skills, capital, risk tolerance, and geography. Choosing it by default because "roofing makes money" is how founders end up in the wrong business.

**The honest verdict.** Starting a roofing business in 2027 is a strong choice for a founder who: (a) has a real capital cushion for the working-capital gap, (b) is genuinely good at — or willing to hire for — sales and people management, (c) can recruit and retain crews, (d) can tolerate cash-flow and seasonal volatility, (e) will run storm work (if any) on the legitimate playbook only, (f) takes safety and compliance seriously, and (g) is building a compounding asset rather than chasing storms. It is a poor choice for the undercapitalized, the conflict-and-cash-flow-averse, the founder who wants to do the craft rather than run the company, and anyone who would be tempted into the abusive storm playbook. The demand is real and durable; the exit market is real; but roofing rewards disciplined operators and chews up everyone else. Go in with eyes open, or do not go in.

`;

const links = `

## Related Pulse Library Entries

- **q1947** — How do you start a gutter installation business in 2027? (Adjacent exterior trade; common cross-sell and referral partner for roofers.)
- **q1948** — How do you start a siding business in 2027? (Adjacent exterior-restoration trade; storm-restoration overlap.)
- **q1949** — How do you start a general contracting business in 2027? (GCs are a key commercial-roofing referral and subcontracting channel.)
- **q1950** — How do you start an HVAC business in 2027? (Alternative trade with recurring-service revenue and similar consolidation tailwinds.)
- **q1951** — How do you start a plumbing business in 2027? (Alternative trade; lower weather and seasonality exposure.)
- **q1952** — How do you start an electrical contracting business in 2027? (Alternative trade comparison referenced in the counter-case.)
- **q1953** — How do you start a painting business in 2027? (Adjacent residential-exterior service; lower barrier, lower margin.)
- **q1954** — How do you start a solar installation business in 2027? (Roof-integrated solar overlap; emerging cross-sell opportunity.)
- **q9501** — How do you start a home-services business in 2027? (Category-level playbook; lead-gen and operations parallels.)
- **q9502** — How do you start a construction company in 2027? (Broader construction-business framing and capitalization context.)
- **q9505** — How do you scale a home-services business past $1M revenue? (Year-2 to Year-5 scaling tactics relevant here.)
- **q9510** — How do you sell a home-services business? (Exit-strategy detail referenced in the Year-5 trajectory and exit section.)
- **q9601** — How do you start a property management business in 2027? (Commercial-roofing buyer perspective; key client and referral source.)
- **q9602** — How do you start a real estate investing business in 2027? (Building-owner client perspective for commercial roofing.)
- **q9603** — How do you start a restoration company in 2027? (Storm/insurance-restoration ecosystem overlap.)
- **q9604** — How do you start a public adjusting business in 2027? (Insurance-claims ecosystem actor referenced in the storm section.)
- **q9605** — How do you start an insurance agency in 2027? (Carrier-side perspective on the storm-claims dynamic.)
- **q9701** — What is the best CRM for home-services contractors? (AccuLynx vs JobNimbus vs Roofr vs Jobber deep dive.)
- **q9702** — How do you hire and retain construction crews in 2027? (Labor-shortage and crew-recruiting deep dive — the roofing bottleneck.)
- **q9703** — How do you price contracting jobs for profit? (Markup-vs-margin and estimating-discipline deep dive.)
- **q9704** — How do you run Google Local Service Ads for home services? (Primary retail lead-gen channel deep dive.)
- **q9705** — How do you build a referral and review engine for a service business? (Compounding-asset deep dive referenced throughout.)
- **q9706** — How do you handle insurance claims as a contractor? (Storm-roofing claims-and-supplement deep dive.)
- **q9707** — How do you get bonded as a contractor? (Surety-bonding deep dive for commercial roofing.)
- **q9708** — How do you manage subcontractor crews vs W-2 crews? (Staffing-model deep dive referenced in the crews section.)
- **q9709** — How do you manage cash flow in a contracting business? (Working-capital-gap deep dive — the #1 roofing failure mode.)
- **q9710** — How do you get manufacturer certifications as a roofing or exterior contractor? (GAF/Owens Corning/Carlisle certification deep dive.)
- **q9801** — What is the future of the trades in 2030? (Long-term outlook context for skilled-trade businesses.)
- **q9802** — How will AI change home-services businesses by 2030? (AI-outlook context referenced in the five-year outlook section.)
- **q9803** — How do private equity roll-ups change the trades? (PE-consolidation deep dive referenced in competitor analysis and exit strategy.)

`;

const tags = ['roofing','home-services','construction','trades','small-business','storm-restoration','commercial-roofing','contractor','2027','exit-strategy'];

const sources = [
  { title: 'National Roofing Contractors Association (NRCA)', url: 'https://www.nrca.net' },
  { title: 'US Bureau of Labor Statistics — Roofers (OES 47-2181)', url: 'https://www.bls.gov/oes/current/oes472181.htm' },
  { title: 'OSHA — Fall Protection in Construction', url: 'https://www.osha.gov/fall-protection' }
];

const notes = {
  s6: 'Added 38 cited sources: NRCA industry data, IBISWorld roofing report, BLS roofer employment/wage data, OSHA fall-protection standards, manufacturer certification programs (GAF Master Elite, Owens Corning Platinum Preferred, CertainTeed, Carlisle, Holcim/Firestone, Johns Manville), Insurance Information Institute catastrophe-loss data, NICB contractor-fraud advisories, Xactimate/Verisk, roofing CRM and measurement software (AccuLynx, JobNimbus, Roofr, EagleView, CompanyCam), Google Local Service Ads, consumer financing platforms, trade publications (Roofing Contractor Magazine), labor-shortage data (ABC), SBA/state licensing boards, surety associations, and commercial-buyer communities (BOMA, IFMA).',
  s7: 'Added comprehensive numerical analysis: market sizing ($25-$30B US roofing market, metro-level TAM/SAM, 3-6% realistic max share), startup-cost ranges by model ($18K-$75K subcontractor vs $95K-$220K W-2, $100K-$300K+ commercial working capital), per-job unit economics for all three lanes (retail 38-52% GM, storm 45-60% GM, commercial 22-34% GM), pricing mechanics (markup vs margin math, the square unit), crew economics ($500K-$1.2M revenue per crew), marketing spend ($3K-$15K+/month Google in season), 5-year revenue trajectory ($280K-$650K Y1 to $4M-$12M Y5), insurance/compliance costs, and exit multiples (4.5x-7.5x EBITDA for PE roll-ups).',
  s8: 'Added 12-element counter-case: working-capital business disguised as cash machine, labor-shortage structural ceiling, storm work getting structurally harder with real regulatory risk, PE roll-ups out-spending on leads, material/labor cost volatility vaporizing margin between quote and install, seasonality and income volatility breaking founders, highest-tier safety and liability exposure, the sales-and-management reality vs the craft fantasy, fragile reputation with asymmetric downside, licensing/classification/legal minefield, customer-concentration hostage risk in commercial, and better-fit alternative trades (HVAC/plumbing/electrical).',
  s9: 'Cross-linked 30 related Pulse entries: adjacent exterior trades (q1947-q1954 — gutters, siding, GC, HVAC, plumbing, electrical, painting, solar), home-services and construction category playbooks (q9501/q9502/q9505/q9510), commercial-roofing buyer and insurance-ecosystem perspectives (q9601-q9605), operational deep dives (q9701-q9710 — CRM, crew hiring, pricing, LSA, review engine, insurance claims, bonding, staffing models, cash flow, manufacturer certifications), and 2030 outlook entries (q9801-q9803 including the PE roll-up deep dive).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the roofing business startup playbook for 2027. Two mermaid diagrams: (1) a decision flow from founder capital and background through lane selection, staffing model, compounding-asset choice, and 5-year intent; (2) a comparison matrix of retail vs storm vs commercial roofing across customer, margin, job size, lead-gen, seasonality, and risk. Full coverage across 28+ H2 sections: why roofing is strong in 2027, the three roofing businesses (retail/storm/commercial), the default-playbook trap that kills new roofers, market sizing (TAM/SAM/SOM, $25-$30B market), ICP segmentation by lane, startup costs and capitalization ($18K-$220K+), per-job unit economics for all three lanes, pricing models (markup vs margin, good-better-best, financing), the equipment/tooling/vehicle/software stack, the subcontractor vs W-2 crew decision and the labor bottleneck, lead generation for retail (Google LSA, certifications, reviews, referrals), lead generation for storm (canvassing, the insurance-claims process, and where the legal/ethical lines are), lead generation for commercial (property-manager and GC relationships, roof-asset-management contracts), the sales process from lead to contract, operational workflow from signed job to final payment, licensing/legal/insurance/bonding, competitor analysis (solo operators, regional roofers, storm-chasers, PE roll-ups), five named real-world scenarios, Y1-Y5 revenue trajectory, hiring and org structure, 12-element risk mitigation, exit strategy (4.5x-7.5x EBITDA, three buyer types), owner-lifestyle reality by year, common Y1 mistakes, a decision framework, the AI/5-year outlook, and a final "roofing as a company not a trade" framework. Includes tldr opening with TL;DR, comprehensive num block, 12-element counter-case, 30 cross-links, 38 sources, 10 tags, and 3 structured sources.'
};

runPolish({ id: 'q1946', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
