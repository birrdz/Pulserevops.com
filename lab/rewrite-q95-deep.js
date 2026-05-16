// q95 — How do I build a federal / public-sector motion from scratch?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Building a US federal / public-sector motion from scratch is a **2-4 year, $3M-$8M capital commitment** before federal revenue is meaningful — treat it as a separate company stood up inside your company, not a new "vertical" for your existing sales team. The decision gate is brutal and binary: **do not start unless you have (a) 24-36 months of runway you can dedicate to a market that pays nothing in year one, (b) a credible path to a FedRAMP sponsoring agency, and (c) a commercial business healthy enough that you are not betting the company.** The motion sequences in a fixed order: **commit and hire a federal sales lead → secure a sponsoring agency → FedRAMP authorization (Moderate is the default; $500K-$2M, 12-24 months) → land on a contract vehicle (GSA Schedule / MAS is table stakes, plus reseller paper through Carahsoft or immixGroup) → run your first capture (an 18-36 month pursuit) → win an Authority to Operate (ATO), the actual gate that lets an agency switch your product on → recognize revenue.** Sub-markets are not interchangeable: **Civilian agencies** (FedRAMP Moderate, GSA Schedule, ~12-18 month cycles), **DoD** (IL4-IL6, CMMC, 18-36 month cycles, sells through primes), and **SLED** (state/local/education — lower bar, StateRAMP, cooperative purchasing vehicles like NASPO and OMNIA, 6-12 month cycles) each demand a different machine. Almost everyone sells **through** the ecosystem rather than direct: **Carahsoft, immixGroup, DLT and a handful of aggregators** hold the contract paper and take 3-8 points; **systems integrators — Booz Allen, Leidos, SAIC, GDIT, CACI** — own the largest programs and you ride them as a subcontractor. The first federal hire is a **cleared sales leader with real agency relationships and capture experience** ($250K-$450K OTE, found via the GovCon primes, Carahsoft alumni networks, and federal-experienced VPs at peers). Realistic first-3-year spend to stand up the motion: **$3.5M-$7.5M** (FedRAMP + GovCloud + GSA Schedule + 2-4 federal headcount + capture + proposal capability). The payoff that justifies it: **federal revenue is sticky, multi-year, budget-backed, recession-resistant, and expands through option years** — once you are in, you compound. The 2025-2027 wrinkle: **DOGE-era budget scrutiny, contract consolidation, and procurement reform** have made the bar higher for net-new vendors but also created openings as agencies cut bloated incumbents. Net: federal is one of the best long-term revenue bases in software — and one of the most reliable ways to run out of cash if you start it underfunded or out of sequence.`;

const core = `

## Federal vs SLED vs DoD vs Civilian: The Four Distinct Sub-Markets

The single most expensive mistake a CRO or CEO makes entering government is treating "the public sector" as one market. It is at least four, and they share almost nothing operationally — different buyers, different compliance regimes, different contract paper, different cycle lengths, different channel structures. You must pick which one you are building for first, because the machine you build for one will not work for the others.

**US Federal Civilian.** This is the cabinet departments and independent agencies that are not Defense: HHS, DHS, Treasury, VA, State, DOE, USDA, GSA itself, the IRS, SSA, EPA, and dozens more. Annual federal IT spend runs roughly $120B-$130B, with civilian taking a bit over half. The compliance entry ticket is **FedRAMP** — almost always Moderate impact level. The default contract vehicle is the **GSA Multiple Award Schedule (MAS)**. Buying cycles for a net-new vendor run 12-18 months from first serious agency conversation to a funded award, and the buyers are professional contracting officers working inside the Federal Acquisition Regulation (FAR). Civilian is where most SaaS companies should start: the bar is high but knowable, the deals are large, and the path is well-documented.

**Department of Defense.** DoD is its own universe — the Army, Navy, Air Force, Marines, Space Force, the combatant commands, the Fourth Estate agencies (DISA, DLA, DARPA), and the intelligence-adjacent elements. DoD IT spend is roughly $60B-$70B annually. The compliance bar is higher and layered: the **DoD Impact Levels (IL2 through IL6)** sit on top of FedRAMP, with IL4 and IL5 being the common targets for controlled unclassified information and IL6 for classified. Defense contractors handling CUI also face **CMMC (Cybersecurity Maturity Model Certification)**. DoD cycles run 18-36 months, deals frequently route **through prime systems integrators** rather than direct, and you often need cleared personnel and sometimes a facility clearance. DoD is the highest-ceiling sub-market and the slowest, hardest entry. Do not start here unless your product is defense-native.

**Federal Intelligence Community.** The CIA, NSA, NGA, NRO, DIA and the ODNI. This market runs on IL6 and above, requires cleared staff and often a facility clearance, uses classified contract vehicles (the IC's C2E and similar), and is effectively invisible from the outside. It is a specialist motion built years after a civilian or DoD base exists. Most companies reading this should treat the IC as out of scope for the first five years.

**State, Local and Education (SLED).** Fifty states, thousands of counties and municipalities, K-12 districts, and higher education. SLED is the sub-market most underrated by SaaS leaders because the **compliance bar is materially lower** — many states accept SOC 2 or **StateRAMP** rather than full FedRAMP, cycles run 6-12 months, and **cooperative purchasing vehicles (NASPO ValuePoint, OMNIA Partners, Sourcewell, E&I, TIPS)** let one competitive award be reused by thousands of public entities. SLED budgets are smaller per deal but the aggregate is enormous and the entry cost is a fraction of federal. For many companies, **SLED is the right place to start the public-sector motion** — it builds past performance, references, and government muscle memory at one-tenth the capital cost, and that experience de-risks a later federal push.

**Why the distinction is operationally load-bearing.** The reason this matters beyond taxonomy: every component of the go-to-market machine differs by sub-market. The *compliance project* differs (FedRAMP Moderate for civilian, IL4-IL6 plus CMMC for DoD, StateRAMP or SOC 2 for SLED). The *contract paper* differs (GSA Schedule and GWACs for civilian, OTAs and program-of-record IDIQs for DoD, cooperative vehicles for SLED). The *channel* differs (Carahsoft-style aggregators for civilian, prime SIs for large DoD programs, regional VARs for SLED). The *hire* differs (a cleared DoD seller is a different person than a civilian-agency seller is a different person than a SLED regional rep). The *forecast cadence* differs (the federal September 30 surge versus state fiscal years that vary — many states run July-to-June, Texas runs September, New York runs April). A company that builds one motion and then assumes it ports to the next sub-market discovers, expensively, that it has to build a second machine almost from scratch. Pick one sub-market deliberately as the beachhead, build that machine well, and only then decide whether and how to extend — the sequencing decision is itself a major strategic call, not a detail.

## The Compliance Gauntlet: What It Actually Costs To Be Allowed To Sell

Commercial SaaS leaders consistently underestimate this: in government, **compliance is not a checkbox you clear before selling — it is the product gate, and it costs more and takes longer than building the feature set agencies want.** You cannot sell a federal civilian agency a cloud product that processes their data until you carry the right authorization. Budget the gauntlet as a capital project with its own owner, timeline, and burn.

**FedRAMP** is the Federal Risk and Authorization Management Program, the standardized security assessment and authorization framework every cloud service offering must clear to handle federal data. It comes in three impact levels. **FedRAMP Low** (and the lighter "Low Impact SaaS / Li-SaaS / Tailored" path) covers low-sensitivity data and is cheaper and faster but limits which agencies and use cases you can serve. **FedRAMP Moderate** is the workhorse — roughly 80% of authorized offerings are Moderate, and it is what most civilian agencies require. **FedRAMP High** covers high-impact systems (law enforcement, emergency services, financial systems, large PII repositories) and is significantly more expensive and slower. The all-in cost to reach a FedRAMP Moderate authorization typically runs **$500K-$2M+** — third-party assessment fees, a GovCloud environment, a dedicated compliance and security team, documentation labor, and remediation cycles — and the timeline runs **12-24 months** from serious start to authorization. High can run $2M-$4M+ and 18-30 months.

The structural catch that surprises everyone: under the traditional model you generally **need a sponsoring federal agency** to pursue an Agency ATO path, or you pursue the JAB/now-streamlined path. A sponsoring agency is a real federal customer willing to put their name on your authorization package and shepherd it. **No sponsor, no straightforward FedRAMP** — which means your first federal "sale" is actually convincing an agency to sponsor you before you have an authorization, a chicken-and-egg problem we return to later.

**StateRAMP** is the SLED-world analog — a parallel program that lets state and local governments rely on a standardized cloud security authorization. It is less expensive and faster than FedRAMP and is increasingly required by states. **IL2-IL6** are the DoD overlays described above. **CMMC** is the certification defense contractors need to handle CUI, rolling out in tiered levels and increasingly a flow-down requirement in DoD contracts. Each regime is a separate cost center; do not assume one authorization covers another.

**The strategic reframe a CRO must internalize.** In commercial SaaS, you build the product, then you sell it, and compliance (SOC 2, ISO 27001) is a sales-enablement artifact you produce alongside. In government, the order inverts: **the authorization is the thing you are building first, and the commercial product is the input to it.** The FedRAMP project has its own program manager, its own budget line, its own multi-quarter Gantt chart, its own dependency on an external 3PAO and an external sponsoring agency you do not control, and its own permanent operating cost after it finishes. A company that scopes federal as "we'll add a government tier" rather than "we will stand up and fund a compliance program as a capital project" will blow the budget and the timeline. The other trap is treating the authorization as a one-time gate — it is not. Continuous monitoring means the security and compliance organization you stand up to *get* authorized is the same organization you must fund *forever* to *stay* authorized. The right mental model is that you are adding a regulated-industry operating discipline to the company, permanently, in exchange for access to a regulated-industry revenue base. That trade is often worth it — but only if you price the whole trade, not just the entry ticket.

## FedRAMP Deep Dive: The Authorization Process Step By Step

Because FedRAMP is the gate that determines whether a federal motion is even possible, a CRO sponsoring this effort needs to understand the mechanics — not to run it personally, but to scope the budget and timeline honestly and to know when the program is slipping.

**The actors.** A **3PAO (Third Party Assessment Organization)** is an accredited independent assessor that audits your system against the NIST 800-53 control baseline appropriate to your impact level — roughly 325 controls at Moderate. You pay the 3PAO; their assessment fees alone commonly run $250K-$600K across the initial assessment and the work to get to an authorization. The **sponsoring agency** (or the streamlined central authorization body, as FedRAMP modernizes) reviews and grants the authorization. The **FedRAMP PMO** sets the standards and maintains the marketplace of authorized offerings.

**The two historical paths.** The **JAB (Joint Authorization Board) P-ATO** path was a provisional authorization granted by a central board — prestigious, broadly reusable, and very competitive (the JAB prioritized only a small number of products per year). The **Agency ATO** path is an authorization granted by a specific sponsoring agency, which other agencies can then reuse. As of the 2024-2026 FedRAMP modernization effort, the program has been moving away from the rigid JAB construct toward a more streamlined, agency-and-automation-centric model — the practical takeaway for a vendor is that **you still need an agency relationship**, and you should plan for the Agency ATO path as the realistic route.

**The sequence.** Readiness assessment and a Readiness Assessment Report; building the System Security Plan and the full documentation package (hundreds of pages); the formal 3PAO assessment producing a Security Assessment Report; remediation of findings and a Plan of Action and Milestones (POA&M); the agency's review and authorization decision; listing in the FedRAMP Marketplace. Then it never ends: **continuous monitoring (ConMon)** is a permanent operating cost — monthly vulnerability scans, monthly POA&M updates, annual assessments, and significant-change reviews. ConMon alone runs **$200K-$500K+ per year** in tooling, 3PAO annual fees, and dedicated staff. FedRAMP is not a project that finishes; it is a department you stand up and fund forever.

**Where the timeline actually slips.** Knowing the failure modes lets a sponsoring executive spot trouble early. The first slip is *documentation* — the System Security Plan and its appendices are a massive writing effort, and engineering-led teams chronically underestimate it; budget dedicated technical-writing and compliance capacity, not "engineers will do it on the side." The second slip is *remediation* — the 3PAO will find things, and if your architecture was not built with the control baseline in mind, some findings require real engineering rework, not config changes. The third slip is *the sponsoring agency's review queue* — even after your package is clean, the agency's security staff review on their timeline, not yours, and a busy AO's office can sit on a package for months. The fourth, and the one that kills budgets, is *significant-change reviews* — once authorized, shipping a meaningful architecture change or a new sub-service can trigger a significant-change review that gates your roadmap. The practical implication: the FedRAMP program owner should report status against a real plan, the CRO should not book pipeline against a "FedRAMP done by Q3" date until the agency has actually started its review, and engineering leadership must accept that the authorized environment now operates under change-control discipline that the commercial environment does not.

## The Contract Vehicles: How The Government Is Actually Allowed To Buy

Even with an authorization, a federal agency cannot simply put your product on a credit card. Federal purchasing flows through **contract vehicles** — pre-competed contracts that establish terms, ceilings, and eligibility so agencies can buy quickly without running a full open competition each time. Understanding the vehicle landscape is core to the motion because **the vehicle determines who can buy, how fast, and through whom.**

**GSA Multiple Award Schedule (MAS, formerly "GSA Schedule").** The default, broadest vehicle — a long-term governmentwide contract under which GSA pre-negotiates your pricing and terms, and any federal agency (and many SLED entities via the GSA cooperative purchasing provision) can buy off it. Getting on Schedule is effectively table stakes for a civilian motion.

**Governmentwide Acquisition Contracts (GWACs)** like NASA SEWP, NIH CIO-CS, and GSA's Alliant and 8(a) STARS are agency-managed governmentwide vehicles, often IT-focused, frequently used for hardware-plus-software and integration buys. **SEWP** in particular is a heavily used route for product sales.

**Agency-specific IDIQs** (Indefinite Delivery, Indefinite Quantity contracts) are vehicles a single department stands up for its own buying — DHS, the VA, and others run large ones.

**Other Transaction Authorities (OTAs)** are a flexible, FAR-exempt contracting mechanism — heavily used by DoD (through consortia) and increasingly by DHS and others — to move faster, prototype, and engage non-traditional vendors. OTAs are often the fastest way for a startup to land a first DoD-adjacent engagement.

**SBIR/STTR** — the Small Business Innovation Research and Small Business Technology Transfer programs — are the startup on-ramp. A Phase I is a small feasibility award; Phase II funds development; Phase III is the transition to a production contract, and critically Phase III can be **sole-sourced** without further competition. AFWERX (Air Force), the Army, the Navy, and the National Science Foundation all run active SBIR pipelines. For a sub-$50M company, SBIR is often the cleanest first dollar and the cleanest first slice of past performance.

**Sole-source justifications.** Agencies can buy without competition under specific, documented justifications (only-one-responsible-source, urgency, follow-on continuity). It is not a shortcut you can engineer, but understanding it matters because incumbents use it and a strong differentiated product occasionally qualifies.

**How to think about the vehicle landscape strategically.** The vehicle question is not "which one do we get on" — it is "which vehicles let the agencies we are targeting buy us, fastest, through the channel structure we can support." A vendor with no government track record cannot realistically prime a GWAC task order in year one; it can, however, be a product line on Carahsoft's GSA Schedule the week it signs a reseller agreement, and it can pursue a SBIR Phase I in parallel. The mature pattern is a *portfolio* of vehicle access: lead with reseller paper for immediate transactability, pursue your own GSA Schedule for long-term direct-relationship control, use SBIR/OTA as the startup on-ramp and the past-performance generator, and team onto SI-held IDIQs and GWACs for the largest programs. Each vehicle also implies a different *deal motion* — a Schedule buy can be a relatively fast task order, a GWAC competition is a months-long mini-competition, an OTA is a negotiated prototype agreement, and a program-of-record IDIQ is a multi-year capture. The CRO's job is to map the target agency list to the vehicles those agencies actually use (GovWin IQ shows this), then build vehicle access to match — not to collect vehicles for their own sake.

## GSA Schedule Mechanics: Getting On, Staying On, And The Price You Pay In Transparency

Because the GSA Schedule is the foundational civilian vehicle, the motion needs a concrete plan to get on it — and the leadership team needs to understand what carrying a Schedule actually obligates you to.

**Getting on.** You submit an offer to GSA against the MAS solicitation, proposing the products/services, the SINs (Special Item Numbers) they map to, and — the hard part — your pricing. GSA negotiates your rates, and you sign a contract that typically runs a base period with option periods extending up to 20 years total. The realistic timeline from a serious start to an awarded Schedule is **6-12 months**, sometimes longer, and most companies use a **GSA consultant** ($15K-$50K) to prepare the offer. You can also get on Schedule faster by being **added as a product to an existing reseller's Schedule** — which is one major reason companies go through Carahsoft or immixGroup.

**The pricing transparency requirement.** This is the part commercial leaders find genuinely uncomfortable. GSA expects your Schedule pricing to reflect your best commercial pricing — historically governed by the **Commercial Sales Practices (CSP) disclosure and the Price Reductions Clause (PRC)**, which can obligate you to extend price reductions to the government if you cut prices to a tracked commercial customer. The Transactional Data Reporting (TDR) pilot offers an alternative reporting regime, but the principle holds: **being on Schedule means your pricing is visible, audited, and constrained.** You cannot run your normal commercial discounting games against the government. Mispricing the Schedule, or violating the PRC, creates real audit and False Claims Act exposure. Price the Schedule deliberately, with counsel, as a long-term decision.

**The catalog.** Your awarded items live in the GSA catalog (GSA Advantage and related systems). Maintaining it — adding products, refreshing pricing, processing modifications — is ongoing administrative work that needs an owner, usually a contracts administrator or your channel partner.

## The Budget Cycle Reality: Why September 30 Runs Your Forecast

Federal revenue does not arrive on a smooth SaaS curve. It is governed by the **federal fiscal year, which runs October 1 to September 30**, and by a set of appropriations rules that have no commercial analog. A CRO who does not build the forecast around this will be wrong every quarter.

**The Q4 "use it or lose it" surge.** Most federal appropriations are one-year money — if an agency does not obligate it by September 30, it is generally lost. The result is a massive, predictable spending surge in the **fourth fiscal quarter, especially July, August, and the final weeks of September.** A very large share of full-year federal IT awards land in that window. Your federal pipeline and capacity planning should anticipate that a disproportionate fraction of the year's bookings close in a six-to-eight-week sprint.

**Color of money.** Federal funds come in categories — O&M (operations and maintenance), procurement, RDT&E (research, development, test and evaluation), and others — each with its own rules about what it can buy and how long it stays available (one-year, two-year, no-year). Your champion may love your product but be unable to buy it with the money they have. Understanding which "color" funds your deal, and whether it is expiring, is core qualification.

**Appropriations vs continuing resolutions.** Congress is frequently late passing full-year appropriations. When it is, agencies operate under a **Continuing Resolution (CR)** — funding at roughly prior-year levels with restrictions on new starts. Under a CR, **new-vendor and new-program awards stall**; agencies hesitate to start something they may not be able to continue. CRs, government shutdowns, and the threat of them are a recurring drag on the federal sales calendar, and your forecast must carry that risk explicitly. Mature federal sellers track the appropriations calendar as closely as their own pipeline.

## The Buying Roles: Who Actually Says Yes, And Why It Is Nothing Like Commercial

In a commercial enterprise deal you map an economic buyer, a champion, a few influencers, and procurement. Federal has more roles, they are more rigidly defined by regulation, and the person with the budget and the person with signature authority are almost never the same human.

**The Contracting Officer (CO / KO).** The CO is the only person with legal authority to obligate the government and bind it to a contract. They work inside the FAR, they are accountable for the integrity of the procurement, and they are often risk-averse by design. The CO is not your champion — they are the referee — but if the CO is not comfortable, the deal does not happen.

**The Contracting Officer's Representative (COR / COTR).** The COR is the CO's designated technical eyes and ears on a contract — they manage day-to-day performance and are often closer to the using organization. A friendly, engaged COR is enormously valuable.

**The program office.** The program or mission office is where the budget and the requirement actually live — the program manager and their staff are the closest analog to a commercial economic buyer and champion. This is who you spend most of your relationship-building energy on.

**End users / the mission.** The operators who will actually use the product — the analysts, clinicians, logisticians, warfighters. Their advocacy shapes requirements and creates pull, but they cannot buy.

**The difference from commercial.** Procurement is not a final-stage gate you "get past" — it is a regulated process that runs the whole deal. You cannot wine-and-dine your way around the FAR. Lobbying, gifts, and even informal influence are tightly restricted. Relationships still matter enormously, but they are built through legitimate channels — industry days, RFIs, capability briefings, conferences — over years. The motion is relationship-heavy and rules-bound at the same time, which is exactly why it needs specialists.

**The mapping a federal seller actually has to build.** In a commercial deal, the account map is a handful of named people. In a federal pursuit, the map has layers: the *mission/program office* (the program manager and staff who own the requirement and the budget — your relationship center of gravity); the *contracting organization* (the CO and their staff, who must be comfortable but whom you engage through proper channels); the *COR* once one is assigned; the *end-user community* whose advocacy creates pull; the *security organization* (the AO and ISSO who will run your ATO); the *agency CIO/CTO office* which sets technology direction; and frequently an *incumbent* whose contract you are trying to displace and who has the deepest relationships of all. Layer on top the *prime or reseller* through whom the deal will actually transact, and any *teaming partners*. The federal seller's core skill is patiently mapping and developing this multi-layered set of relationships — legitimately, over a multi-year horizon, through industry days and RFI responses and capability briefings — well before the RFP exists. This is why a commercial AE parachuted into federal fails: the job is not running a sales process, it is running a years-long, rules-bound relationship campaign that *positions* you for a process that has not started yet.

## Set-Aside Programs: How Small-Business Rules Shape Who Can Even Bid

A large fraction of federal contract dollars is legally reserved for specific categories of small business, and these **set-aside programs shape the competitive landscape in ways that determine your strategy** — sometimes they are an advantage, sometimes they dictate that you must partner.

The federal government carries small-business contracting goals (a governmentwide goal historically around 23% of eligible dollars, with sub-goals for specific categories). The major designations: **small business** generally; **8(a)** for socially and economically disadvantaged-owned firms (a nine-year development program with sole-source authority up to thresholds); **SDVOSB** (Service-Disabled Veteran-Owned Small Business); **WOSB/EDWOSB** (Women-Owned and Economically Disadvantaged Women-Owned Small Business); and **HUBZone** (firms in Historically Underutilized Business Zones). Many solicitations are issued as **set-asides** — only firms holding the relevant designation may bid.

For most venture-backed SaaS companies, you will **not** qualify for these designations (you are either too large or do not meet the ownership criteria). That has two consequences. First, a meaningful slice of the market is simply not directly addressable by you — it is addressable only through a qualifying partner. Second, **8(a), SDVOSB, and other small-disadvantaged firms become a deliberate channel**: they hold contract vehicles and set-aside eligibility you do not have, and teaming with them (as a subcontractor, or them reselling your product) is a legitimate and common way to reach deals you could never bid on alone. Your channel strategy must explicitly account for the set-aside structure, not treat it as an afterthought.

## Channel Partners And Resellers For GovCon: Why Almost Everyone Sells Through Carahsoft

One of the most counterintuitive facts for a commercial CRO: in federal software, **the overwhelming majority of vendors sell through a small number of specialized aggregators and resellers** rather than transacting directly with agencies. This is not weakness — it is structurally rational, and your motion should assume it from day one.

**Carahsoft** is the dominant government IT solutions aggregator — it holds an enormous portfolio of contract vehicles (GSA Schedule, SEWP, state and local cooperative contracts, and many more) and acts as the "master government aggregator" for hundreds of technology vendors. **immixGroup** (an Arrow company) plays a similar role, with deep experience helping commercial software vendors build a public-sector business. **DLT** (now part of TD SYNNEX) and **GovConnection/Connection** are other established government resellers. There are also countless smaller value-added resellers (VARs), many of them small-business or set-aside-qualified, who carry your product into specific agencies or set-aside opportunities.

**Why go through them.** They already hold the contract vehicles, so an agency can buy your product through Carahsoft's GSA Schedule the day you sign a reseller agreement — no waiting 6-12 months for your own Schedule. They handle the transaction mechanics, the FAR-compliant paper, the catalog maintenance, and often the relationship coverage with contracting shops. They give you instant vehicle access and credibility. **The cost** is margin: aggregators and resellers typically take **3-8 points** (sometimes more for full VAR services), and you give up some direct relationship control. For nearly every company building a federal motion, the math strongly favors leading with a Carahsoft or immixGroup relationship — and most do, while building their own GSA Schedule in parallel for the long term.

## The Systems Integrator Layer: Selling Through The Primes On Large Programs

Above the resellers sits a different kind of partner: the **systems integrators (SIs) and prime contractors** who hold the government's largest programs. On a major modernization program — a multi-hundred-million-dollar agency transformation — the government does not buy thirty point solutions directly. It awards the program to a prime, and the prime assembles a team of subcontractors whose products and labor deliver the work.

The big federal SIs and primes — **Booz Allen Hamilton, Leidos, SAIC, GDIT (General Dynamics Information Technology), CACI, Accenture Federal Services, ManTech, Peraton, and the federal arms of the consultancies** — own these relationships and these programs. For a software vendor, **riding a prime as a subcontractor or technology partner** is often the only realistic way onto the largest deals, and it has real advantages: the prime carries the contract, the past-performance burden, the program-management overhead, and the agency relationship; you provide differentiated technology and ride their flow-down.

The tradeoffs: you are one layer removed from the customer, your margin is set in a subcontract negotiation, and you are dependent on the prime's win and the prime's program health. The motion typically uses **both** layers — reseller/aggregator paper for transactional and mid-size deals where you want the direct relationship, and prime/SI teaming for the largest programs where you cannot realistically prime yourself. Building relationships with the SIs' technology-partner and capture organizations is a distinct, deliberate workstream that should start early.

**How to actually get onto a prime's team.** SIs have formal technology-partner and capture organizations, and getting into them is its own sales motion. The entry points: their partner/alliance programs (most large SIs run one); their capture teams, who are constantly assembling solutions for upcoming bids and need differentiated components; and direct relationships built at the SI/prime conferences and industry days. The pitch to a prime is not "buy our software" — it is "we make your bid more competitive and lower your delivery risk on this specific opportunity." That means you have to be tracking the *same* opportunities the prime is tracking (again, GovWin IQ), and you have to be able to articulate, in capture-team language, why your technology improves their win probability. The risk to manage: a prime may put you on the team for the bid, lose the bid, and you have nothing — or win the bid and then squeeze your subcontract margin hard. Get onto *multiple* primes' teams for the opportunities you care about so you are not betting on a single horse, and treat the prime relationship as a portfolio, not a partnership of one.

## Capture Management And The BD Cycle: The 18-36 Month Pursuit

The single biggest cultural shock for a commercial sales org entering federal is the **length and structure of the pursuit**. A commercial enterprise deal might run 3-9 months from first touch. A federal opportunity routinely runs **18-36 months** from the moment you identify it to a funded award — and the work in that window is a discipline with its own name: **capture management.**

**The BD-to-capture-to-proposal pipeline.** Government business development is a long funnel. **Business development (BD)** identifies opportunities years out — through intelligence tools, agency relationships, industry days, and the published budget. **Capture** is the focused, resourced pursuit of a specific identified opportunity: building relationships with the program office, shaping the requirement legitimately during the RFI/Sources Sought phase, assembling the team (which primes, which subs, which set-aside partners), developing win themes, gathering competitive intelligence, and making the **bid/no-bid decision** at defined gates. **Proposal** is the final sprint of actually writing and submitting the response once the RFP drops.

**Capture plans and gate reviews.** A serious capture is run against a written **capture plan** and reviewed at gates (a common framework runs gates from opportunity identification through bid decision and proposal). At each gate, leadership decides whether to keep spending pursuit dollars. The discipline matters because **capture is expensive** — a single serious capture can consume hundreds of thousands of dollars in B&P (bid and proposal) cost and senior time over 1-2 years — and a disciplined bid/no-bid process is what keeps a federal motion from bleeding cash chasing unwinnable deals.

**Teaming agreements.** Before an RFP drops, the team commits to each other via **teaming agreements** — who primes, who subs, what scope each party owns, exclusivity. Getting onto the right team early, before competitors lock up the obvious partners, is often the real competition. A CRO running this motion must internalize that **the federal sales cycle is not your CRM stages stretched longer — it is a different process entirely, and it needs people who have run it.**

## Proposal Writing And The RFP Response: Sources Sought To Color Teams

When the formal procurement actually starts, it runs through a sequence of documents, and the proposal itself is produced by a specialized team using a specialized process. A commercial "send the deck and the order form" instinct will lose every time.

**The document sequence.** A **Sources Sought** notice or **Request for Information (RFI)** is the government's market research — your chance to influence the eventual requirement and signal your capability. A **draft RFP** sometimes circulates for industry comment. The **Request for Proposal (RFP)** is the formal solicitation with the statement of work, evaluation criteria, and instructions. You respond, the government evaluates, and there may be discussions, a Final Proposal Revision, and an award — sometimes followed by a **protest** from a losing bidder, which can delay everything by months.

**The proposal team.** A real federal proposal is produced by a **capture manager, a proposal manager, technical writers, a pricing/contracts lead, graphics, and subject-matter experts** — often a dozen people for a meaningful bid. The response must comply exactly with the RFP's instructions (Section L) and score well against its evaluation criteria (Section M); **non-compliance can disqualify you regardless of how good your product is.**

**Color team reviews.** The proposal goes through structured internal reviews named by color — **Pink Team** (early draft review of approach and compliance), **Red Team** (a hard, evaluator-perspective review of the near-final draft), **Gold Team** (executive sign-off), and sometimes others. This is a manufacturing process, not a writing exercise.

**Past performance.** Nearly every RFP requires you to document **past performance** — relevant prior contracts, performed well, ideally for similar customers at similar scale. This is the chicken-and-egg problem for net-new vendors, and we address how to bootstrap it later. The proposal capability — whether built in-house or contracted — is a real, ongoing cost center that a federal motion must fund.

## Pricing For Government: Transparency, Audit Risk, And The Reductions Clause

Government pricing is not commercial pricing with a discount — it is a different regime with different rules, different risks, and different math, and getting it wrong creates legal exposure, not just margin loss.

**Pricing transparency.** As covered under the GSA Schedule, your government pricing is disclosed, negotiated, and visible. The **Price Reductions Clause** can require you to pass certain commercial price cuts through to the government; the **Commercial Sales Practices** disclosure requires you to tell GSA how you price your commercial customers. You are, in effect, agreeing to a most-favored-customer-style discipline against a tracked basis of comparison. This constrains how you can discount commercially without triggering obligations.

**Audit risk and the False Claims Act.** Federal contracts come with audit rights (the DCAA, GSA IG, agency IGs). Defective pricing, mischarging, PRC violations, or misrepresentations in your CSP disclosures can become **False Claims Act** matters — with treble damages and whistleblower exposure. This is not a theoretical risk; it is a recurring source of large settlements in GovCon. Government pricing must be set and maintained with contracts counsel, not by a sales leader optimizing a quarter.

**Structural differences from commercial.** Federal buyers often want firm-fixed-price or clearly structured pricing, dislike usage-based models they cannot forecast, and buy in annual increments with **option years** rather than multi-year prepaid commits. Your commercial packaging may not map cleanly — you may need a government price list and government-specific SKUs. Term alignment to the fiscal year, option-year structures, and ceiling values all matter. Build a deliberate government pricing model early; do not improvise it deal by deal.

**The packaging work that has to happen before the first deal.** Concretely, the pricing and packaging team should produce, in advance: a government price list distinct from the commercial one, designed to be defensible under CSP disclosure; government-specific SKUs that map cleanly to how agencies buy (per-user, per-environment, or firm-fixed-price service tiers rather than opaque usage meters); a clear position on the base-period-plus-option-years structure, including how price escalation across option years is handled; ceiling and quantity assumptions for IDIQ and Schedule pricing; and a decision on how the GovCloud premium (the real incremental cost of the separate environment) is reflected. The reason to do this *before* the first deal: the first few federal contracts set precedents — the pricing you accept on deal one becomes the comparison point a CO uses on deal two, and a desperate-for-the-logo discount on an early deal can constrain you for years. Treat government pricing as a deliberate, counsel-reviewed, finance-owned construct, version it, and do not let an individual seller improvise it to close a quarter.

## The First Federal Hire: A Cleared Sales Leader With Relationships

The motion does not start with a process document — it starts with a person. The first federal hire is the most consequential decision in standing up the motion, and it is a profile most commercial CROs do not know how to recruit for.

**The profile.** You want a **federal sales leader with genuine agency relationships, capture experience, and credibility inside the GovCon ecosystem.** Concretely: someone who has carried a federal number, who knows contracting officers and program offices in the agencies you are targeting, who understands FedRAMP and the vehicle landscape, who has run or supported captures, and who is known to Carahsoft, immixGroup, and the relevant primes. Many such people hold or have held **security clearances** — valuable, sometimes necessary, and a signal of having operated in the environment. They are not generic enterprise AEs; they are a specialist breed.

**Where to find them.** They come out of the GovCon ecosystem itself: federal sales orgs at peer software companies, the channel sales teams at Carahsoft/immixGroup/DLT, business development at the SIs and primes, and occasionally from agency or military backgrounds transitioning to industry. Recruiters who specialize in cleared and GovCon talent (the federal practices at the executive search firms, plus boutique cleared-talent firms) are how you actually reach them.

**Compensation.** A credible federal sales lead runs **$250K-$450K OTE**, often higher for someone with a proven federal book and a strong network, and the comp plan must be patient — you cannot put a federal leader on a commercial quota-and-cadence plan when their deals take two years to close. Expect to fund the role for 18-24 months before it produces, structure the plan around pipeline and milestone progress in the early innings, and make sure the CEO and board understand that timeline before the first paycheck. **Hiring the wrong person here — a commercial AE with a federal-sounding resume — wastes two years and a few million dollars.** This hire is worth a slow, careful search.

## Security Clearances: When You Need Cleared Staff, And What It Costs

For civilian-only motions you may never need clearances. For DoD, intelligence, and some DHS work, **cleared personnel and sometimes a cleared facility are hard requirements**, and the leadership team needs to understand the timeline and cost because they are long and non-trivial.

**Personnel clearances.** Clearance levels run Confidential, Secret, and Top Secret, with TS/SCI (Sensitive Compartmented Information) and program accesses above. An individual clearance requires a **sponsor** — you generally cannot get cleared without a contract or facility that requires it — and the investigation and adjudication can take **months to well over a year**, though the government's continuous-vetting reforms have improved timelines somewhat. Hiring **already-cleared people** is faster but they command a premium and are in short supply.

**Facility Clearance (FCL).** To hold classified contracts or work, your company itself needs a **Facility Clearance** — a DCSA process that requires sponsorship (typically by a government customer or a prime on a classified contract), a cleared management team, a FOCI (Foreign Ownership, Control or Influence) review, and the appointment of a Facility Security Officer (FSO). For venture-backed companies, **FOCI is a real obstacle** — foreign LPs in your cap table can complicate or block an FCL, sometimes requiring mitigation instruments. Standing up an FCL is a 6-18 month effort with ongoing compliance overhead.

**The strategic point.** Clearances are a gating cost for the DoD/IC sub-markets and largely irrelevant for civilian and SLED. This is one more reason to **sequence carefully** — civilian-first or SLED-first motions sidestep the clearance burden entirely in the early years, and you take it on only when a defense opportunity justifies the multi-year, six-figure-plus investment of standing up cleared capability and a facility.

## Marketing To Government: GovTech Events, Advisory Firms, And Intel Tools

Government marketing is not commercial demand-gen with a .gov audience filter. The channels, the events, and the intelligence layer are specific, and the motion needs a government-marketing plan distinct from the commercial one.

**Events and communities.** The GovCon calendar has its own anchor events — **AFCEA** chapter events and conferences (West, TechNet), the **ACT-IAC** programs and forums (where industry and government convene), **AWS Summit (Public Sector)** and the hyperscalers' government-focused events, **GovTech and StateScoop/FedScoop events**, agency-specific industry days, and the SI/prime partner conferences. Presence at these is relationship infrastructure, not lead-gen — you go to be known.

**Advisory and analyst firms.** Beyond Gartner/Forrester, the government market has its own influence layer — and **agency relationships, references, and being known to the right SIs and resellers** matter more than analyst placement.

**Market intelligence tools.** This is the one genuinely indispensable spend: **GovWin IQ (Deltek)** is the standard federal/SLED opportunity intelligence platform — it tracks opportunities years out, maps incumbents and expiring contracts, profiles agency budgets, and is how serious BD teams build a pipeline. **Bloomberg Government, GovTribe, USAspending.gov, SAM.gov, and FPDS** round out the intelligence stack. Budget **$15K-$50K+/year** for GovWin and related tools — it is the cost of seeing the market at all. Government marketing's job is to make you credible and visible to a small, specific community over years; measure it on relationships and pipeline shaped, not MQLs.

## The SLED Motion: Lower Bar, Cooperative Vehicles, And The Education Segments

SLED deserves its own treatment because it is both the most accessible entry point and structurally different from federal. For many companies, **SLED is where the public-sector motion should actually start.**

**The lower compliance bar.** Many states and localities accept **SOC 2** or **StateRAMP** rather than full FedRAMP. StateRAMP is cheaper and faster, and a meaningful number of states have not standardized at all — meaning a strong security posture and SOC 2 can get you in the door. The entry cost is a fraction of federal.

**Cooperative purchasing.** The defining SLED mechanism is the **cooperative contract**: one public entity (or a purchasing cooperative) runs a competitive solicitation, makes an award, and then **thousands of other public entities can buy off that same contract without re-competing.** The big cooperatives — **NASPO ValuePoint** (state-led), **OMNIA Partners**, **Sourcewell**, **E&I Cooperative Services** (education-focused), **TIPS**, **GSA cooperative purchasing** for some categories — turn one win into a reusable, nationwide channel. Landing a strong cooperative contract is the SLED equivalent of getting on Schedule, and it is leverage: it makes every subsequent state and local deal a fast transaction.

**The education sub-segments.** K-12 and higher education are large, distinct sub-markets. K-12 buys through districts, is heavily influenced by **E-rate** and state funding cycles, and has its own data-privacy regimes (FERPA, COPPA, state student-privacy laws). Higher ed buys through institutions and consortia, cares about research-data and accessibility requirements, and uses cooperatives like E&I and Internet2. **EdTech is its own motion within SLED** — same cooperative mechanics, different buyers, different compliance overlay.

**Why start here.** SLED builds real government past performance, references, and operational muscle — contract vehicles, public-sector pricing, the rhythm of government buying — at perhaps one-tenth the capital cost of federal, and that experience materially de-risks a later federal push. A company that has run SLED successfully for two years enters federal far less naive.

## Authority To Operate (ATO): The Actual Gate That Switches You On

FedRAMP gets a lot of attention, but the gate that actually lets a specific agency turn your product on for their data is the **Authority to Operate (ATO)** — and the distinction is the source of a lot of confusion and missed forecasts.

**FedRAMP authorization vs the agency ATO.** A FedRAMP authorization means your cloud service offering has been assessed against the standard and listed in the marketplace — it is the reusable baseline. But each individual agency that wants to use you still issues its **own ATO**: the agency's **Authorizing Official (AO)** reviews your authorization package, the agency's specific risk posture, any agency-specific controls, and formally accepts the risk of operating your system with their data. The agency ATO is a signature from a named official accepting risk on behalf of their organization.

**Why it matters to the forecast.** A FedRAMP-authorized vendor still has to walk **every** new agency customer through that agency's ATO process — typically a 3-9 month effort even when your FedRAMP package is clean, because the AO and their security staff do their own review. If your FedRAMP authorization was sponsored by Agency A, Agency B reusing it still issues their own ATO. This means **"FedRAMP authorized" is necessary but not sufficient** — every agency deal carries an ATO timeline, and a CRO who books a deal the day the contract is signed but before the ATO is granted will miss the revenue date. The ATO is the real go-live gate. Build it into every federal deal's timeline explicitly, staff to support customers through it, and make it a stage in the federal pipeline.

## Building The Federal Org Inside Your Company: Structure, Reporting, Incentives

A recurring failure mode is treating federal as a few headcount bolted onto the commercial sales org under the commercial VP of Sales, on the commercial comp plan, measured against commercial metrics. That structure kills the motion within a year. Federal needs to be stood up as a distinct unit with its own structure, reporting, metrics, and incentives — effectively a small company inside the company.

**Reporting line and executive sponsorship.** The federal unit should report to a senior leader — often a dedicated GM or VP of Public Sector — who has a direct line to the CEO and visibility to the board, because the motion's success depends on multi-year capital commitment that only that level can protect. The single most common way federal dies is *quietly*, when a quarterly-pressured commercial CRO defunds it or reassigns its people to "help the number." Insulating the federal unit from that pressure is a structural decision the CEO has to make and defend.

**Metrics that fit the motion.** Commercial metrics — bookings this quarter, pipeline created this month, sales-cycle velocity — are actively misleading for federal in years one and two. The federal unit should be measured on *leading* indicators appropriate to a long-cycle motion: sponsoring-agency relationship progress, FedRAMP milestone completion, contract-vehicle access established, number and quality of captures in pursuit, bid/no-bid discipline, teaming positions secured, and qualified pipeline weighted by capture stage. Revenue is a year-three metric; holding the unit to it earlier just teaches everyone to lie or quit.

**Comp design.** The federal sales leader and early sellers cannot be on a standard annual quota-and-accelerator plan when their deals take two years. The plan needs a larger guaranteed component in the early innings, milestone-based incentives (sponsor secured, FedRAMP authorized, first vehicle award, first ATO), and a quota that ramps in line with the realistic revenue curve. Done wrong, your best federal hire leaves at month 14 with no commission and a damaged reputation; done right, the comp plan itself signals that leadership understands the timeline.

**Cross-functional load.** Federal is not just a sales unit — it pulls on engineering (GovCloud, FedRAMP remediation, two-environment release management), security and compliance (the whole authorization and ConMon operation), legal and contracts (FAR-compliant contracting, PRC/CSP, teaming agreements, OTAs), finance (government pricing, B&P budgeting, the multi-year capital plan), and customer success (walking each agency through its ATO and supporting option-year renewals). Each of those functions needs a named owner for the federal workstream and an allocation of capacity. A federal motion that is "owned" only by sales, with everyone else helping ad hoc, will stall at the first engineering or contracts dependency. Stand up the unit with explicit cross-functional commitments, or do not stand it up.

## The First-Year Operating Plan: What Actually Happens In Months 1-12

It helps to make year one concrete, because the gap between "we decided to do federal" and "we have a functioning motion" is where most of the wasted money goes. Here is what a well-run first twelve months actually looks like — almost none of it is selling.

**Months 1-3: Commit, fund, and hire.** The board formally commits the multi-year capital. Leadership writes the federal business case with the honest cost model and timeline. The search for the federal sales leader begins — a deliberate, specialist search, not a quick req. Finance builds the three-year federal P&L and the B&P budget. Legal and engineering are briefed on what is coming. No revenue, significant burn beginning.

**Months 3-6: Leader onboards, foundations start.** The federal leader joins and immediately starts two things in parallel: developing sponsoring-agency relationships (the gating dependency) and scoping the FedRAMP project with a 3PAO and a compliance owner. Engineering begins the GovCloud environment build. The company starts conversations with Carahsoft/immixGroup about reseller relationships and begins its own GSA Schedule offer prep. The intelligence stack (GovWin IQ) is stood up and the federal leader begins building the target-agency and opportunity map.

**Months 6-9: FedRAMP underway, vehicles in motion, first captures opened.** The FedRAMP readiness assessment and SSP work is in full swing; the GovCloud environment is being built and configured to the control baseline. A reseller agreement is signed, giving immediate (if not yet useful) vehicle access. The GSA Schedule offer is submitted. The federal leader has identified a handful of real opportunities 18-36 months out and has opened formal captures on the best one or two, complete with capture plans and gate reviews. Industry-day attendance and RFI responses begin. Still essentially no revenue.

**Months 9-12: Sponsor locked, captures maturing, the machine taking shape.** Ideally a sponsoring agency relationship is secured and the FedRAMP authorization is in the agency's review pipeline. The captures are progressing — relationships with program offices deepening, teaming conversations underway, bid/no-bid gates being run. A second federal hire (a seller or a capture/proposal capability) is brought on. The first small win — a SBIR Phase I, a pilot off the reseller's vehicle, a modest OTA — may land, valued not for revenue but for past performance. The exit state of year one is: leader hired, sponsor secured, FedRAMP in agency review, vehicles in place, two-to-four real captures in pursuit, intelligence and proposal capability operating. That is success. Anyone expecting meaningful revenue at month 12 has mis-set the entire plan.

## Five Real Case Studies: How Companies Actually Built Federal Motions

**Palantir — federal-first by design.** Palantir built its company on government from the start, beginning with intelligence and defense customers and treating the hardest, most secure end of the market as the foundation. The lesson is not that everyone should be federal-first — most should not — but that a company architected from inception around government security, deployment, and procurement realities can build an extraordinarily durable, sticky, high-value government base. Palantir's federal revenue is multi-year, deeply embedded, and expansion-heavy precisely because the entry was so hard.

**Zscaler — FedRAMP High as a competitive wedge.** Zscaler invested early and aggressively in FedRAMP, including pursuing the higher impact levels, and used that authorization posture as a wedge into civilian and DoD cloud-security modernization (notably riding the federal zero-trust mandate). The lesson: in security especially, **a strong, early, high-impact-level authorization is itself a competitive moat** — it disqualifies competitors who did not make the investment and aligns you with mandated agency initiatives.

**ServiceNow — a dedicated government cloud.** ServiceNow stood up a separate, FedRAMP-authorized government cloud environment as a distinct product line, with the staffing, isolation, and compliance operation that requires. The lesson: at scale, the **government offering becomes its own product with its own P&L, its own environment, and its own roadmap constraints** — you stop bolting government onto the commercial product and run it as a parallel line.

**Salesforce / Slack — GovCloud as a packaged offering.** Salesforce built Government Cloud as an isolated, authorized instance, and after acquiring Slack carried that pattern forward to Slack's government offering. The lesson: a horizontal commercial platform can serve government by **creating an isolated, separately-authorized instance** rather than re-architecting — but that instance is a real, separately-funded operation, not a configuration flag.

**Anduril / a SBIR-to-scale defense path.** A newer cohort of defense-tech companies — Anduril being the most visible — built fast by combining venture capital with the SBIR/OTA on-ramps, prototyping with defense customers through flexible contracting, and scaling into production programs. The lesson for a startup: the **SBIR/STTR and OTA pathways are a legitimate, capital-efficient way to land first defense dollars and first past performance** — but it still takes years and a defense-native product, and it works best with patient capital that understands the timeline.

## The Capital And Patience Requirement: Why It Takes 2-4 Years

The hardest thing to internalize, and the thing that kills the most federal motions, is the **time-to-revenue**. A federal motion built from scratch typically takes **2-4 years before federal revenue is meaningful** to the company, and the leadership team and board must commit to that before the first dollar is spent.

**Where the time goes.** Roughly: 6-12 months to hire the federal leader and secure a sponsoring agency relationship; 12-24 months for FedRAMP authorization (overlapping); 6-12 months to land on contract vehicles (overlapping); 18-36 months for the first real capture to convert; 3-9 months of ATO on top of the first agency deal. These overlap, but the critical path from a standing start to **meaningful, repeatable** federal revenue is realistically **24-48 months**.

**Why VCs are wary.** A federal motion burns millions with near-zero revenue for two-plus years, depresses blended sales efficiency metrics, and does not fit the "land fast, expand fast" SaaS pattern boards are wired for. Many investors have watched companies start federal underfunded, run out of patience at month 18, and write off the investment just before it would have paid. The skepticism is rational — federal is where impatient capital goes to die.

**Why it is worth it anyway.** The payoff is the quality of the revenue. Federal revenue is **multi-year** (base plus option years), **budget-backed** rather than dependent on a customer's cash position, **extremely sticky** (the ATO, the integration, the switching cost, and procurement inertia all work in your favor once you are in), **recession-resistant**, and **expansion-friendly** — agencies grow seats and use cases through option years and follow-on contracts. Net revenue retention in a mature federal base can be exceptional. Federal is a slow, expensive thing to build and a wonderful thing to own. The decision is not "is federal good" — it is "can we fund the gap."

## Cost Model To Stand Up Federal: The Realistic First-3-Year Spend

A CRO or CEO needs a defensible number to bring to the board. Here is a realistic build of the first-three-year cost to stand up a federal civilian motion from scratch (DoD adds clearance and facility costs on top).

**FedRAMP Moderate authorization.** $500K-$2M across 3PAO fees, documentation labor, remediation, and the dedicated compliance/security staff over the 12-24 month authorization period.

**Continuous monitoring (ConMon), once authorized.** $200K-$500K+/year, ongoing — so call it $300K-$1M across the back half of the three-year window.

**GovCloud environment.** A separate, isolated AWS GovCloud / Azure Government / Google Assured Workloads environment — incremental infrastructure, tooling, and engineering to build and run it: commonly $150K-$600K+/year depending on scale.

**GSA Schedule.** $15K-$50K in consultant fees plus internal contracts labor to get on, then ongoing catalog administration.

**Federal headcount.** A federal sales leader ($250K-$450K OTE), plus over three years adding a second seller or two, a contracts/proposal capability (in-house or contracted), and partial sales-engineering and customer-success coverage — realistically **$1.5M-$3.5M in fully-loaded people cost** over three years.

**Capture and proposal (B&P).** Pursuit costs, proposal production, teaming, and the GovWin/intelligence stack — **$300K-$800K+** over three years for a company running a handful of serious captures.

**Channel and marketing.** Reseller margin (3-8 points, a cost of revenue rather than upfront), plus GovCon events, partner enablement, and government marketing — call it $150K-$400K of program spend over three years.

**The realistic total: roughly $3.5M-$7.5M over three years** to stand up a civilian federal motion, with little-to-no offsetting revenue in years one and two. DoD adds clearances and an FCL. This is the number that must be true before you start — and it is why the counter-case below matters.

## GovCloud Infrastructure: The Separate Environment You Have To Build

Commercial SaaS leaders often assume FedRAMP is a paperwork exercise on their existing infrastructure. It is not — it almost always requires a **physically and logically separate cloud environment**, and that is a real engineering and operating cost.

**The three environments.** The hyperscalers run dedicated, isolated government regions: **AWS GovCloud (US)**, **Microsoft Azure Government**, and **Google Cloud's Assured Workloads / government offerings**. These are separate from commercial regions, with access restricted to vetted US persons, additional compliance attestations, and in some cases physical and personnel isolation. The higher DoD impact levels (IL5/IL6) require still more isolation.

**Why you need it.** FedRAMP and the DoD ILs effectively require your government data to live in an environment that meets the personnel, physical, and logical separation requirements — which your commercial production environment does not. So you build a parallel deployment of your product in GovCloud.

**What it costs you beyond dollars.** The environment itself carries higher infrastructure costs and you run a **second production environment** — separate deployment pipelines, separate monitoring, separate on-call, separate release management, often with US-persons-only operational staff. It constrains your roadmap: every feature now ships to two environments under different change-control regimes, and some commercial dependencies (third-party services, SaaS sub-processors) may not be authorized for the government environment, forcing substitutions. Plan for GovCloud as a permanent second product surface with its own engineering and operations budget, not a deployment target.

## Past Performance Bootstrap: Solving The Chicken-And-Egg

The structural trap for every net-new federal vendor: **RFPs require past performance to win, and you need wins to have past performance.** Solving this is a deliberate part of the motion, not something that resolves itself.

**Subcontracting under a prime.** The cleanest path: ride a prime or SI as a subcontractor on a program. Your performance on that subcontract becomes documentable past performance — relevant work, for a federal customer, performed well — that you can cite on future bids where you prime or sub. Primes need differentiated technology partners; this is a mutually beneficial entry.

**SBIR/STTR.** A completed SBIR Phase I and Phase II is past performance — a federal contract, performed, with a government customer who can serve as a reference. SBIR is explicitly designed as the on-ramp, and Phase III's sole-source authority turns it into a transition path.

**Pilots, OTAs, and small first deals.** A small, fast OTA prototype, a pilot bought off a reseller's vehicle, or a modest task order — each creates a referenceable engagement. Pursue small first deals not for the revenue but for the past-performance and reference value; they are an investment in qualifying for the larger deals.

**Commercial and SLED past performance.** Some RFPs accept relevant commercial or SLED past performance, especially for newer technology categories — another reason a SLED-first motion de-risks the federal entry: a body of state-and-local work is citable evidence.

**Team past performance.** Even before the company has its own record, the **past performance of your key personnel** and your teaming partners can be cited. A capture team with individuals who have run similar programs, and a teaming partner with a strong record, can carry a proposal while the company builds its own history. The honest framing for the board: the first 2-3 federal "wins" are really past-performance acquisitions, priced and pursued accordingly.

## The Trump-Era Federal IT Environment: What Changed In 2025-2027

A federal motion built in 2025-2027 operates in a materially different environment than one built in 2021, and a CRO must factor the current dynamics into both strategy and the board conversation.

**Budget scrutiny and DOGE-era cost pressure.** The push to cut federal spending, consolidate contracts, and aggressively review existing vendor relationships has made agencies more cost-conscious and more willing to terminate or de-scope underperforming incumbents. This **cuts both ways**: the bar for net-new vendor spend is higher and procurement is more cautious — but the willingness to displace expensive, underdelivering incumbents creates genuine openings for vendors who can show clear cost-to-value and rapid impact.

**Contract consolidation.** The pressure to reduce the number of contracts and vehicles favors large primes and broad vehicles, and can make it harder for a small vendor to find a clean direct path — reinforcing the channel-and-teaming strategy.

**Procurement reform and speed.** Alongside the cuts, there is continued momentum behind faster contracting — OTAs, commercial-item buying, and the FedRAMP modernization effort aimed at compressing authorization timelines. A vendor who is positioned for the faster pathways (OTA-ready, commercial-item-friendly pricing, moving through a streamlined FedRAMP process) is advantaged.

**Workforce churn.** Significant turnover in the federal workforce means relationships are less stable — your champion or COR may be gone next quarter — which raises the value of institutional relationships (with the program office, with primes, with resellers) over individual ones.

**The net.** The 2025-2027 environment rewards vendors who lead with **demonstrable cost savings and mission impact**, who are **fast and flexible on contracting**, and who have **resilient, institutional relationships**. It punishes vendors who look like expensive, slow, incumbent-style spend. None of this changes the fundamental sequence — it changes the messaging and raises the importance of speed and value proof.

## Five-Year Outlook: Where The Federal Software Market Goes 2027-2032

**AI in government procurement and mission.** Federal AI adoption accelerates across both the mission side (analysis, logistics, citizen services, defense applications) and the procurement side (agencies using AI to evaluate proposals and manage contracts). Vendors with credible, securely-deployable AI — and the authorization posture to run it in government environments — are advantaged. AI-specific authorization and governance frameworks emerge as a distinct compliance overlay.

**FedRAMP modernization matures.** The push to automate and streamline FedRAMP — machine-readable packages, continuous authorization, faster reuse — should compress timelines and costs over the five-year window. It will not make FedRAMP cheap, but the 12-24 month / $500K-$2M figures should improve, lowering the entry barrier somewhat and increasing the population of authorized vendors (and thus competition).

**The SBIR/OTA pipeline as a permanent on-ramp.** The defense-tech wave has proven the SBIR-to-OTA-to-production path, and the government is institutionalizing faster, non-traditional pathways. Expect the startup on-ramp to remain robust and well-funded, with more venture capital comfortable with defense and federal timelines than in 2020.

**GovCloud maturity.** The hyperscaler government environments mature — broader service availability, more authorized third-party services, somewhat lower friction to deploy. The "parallel environment" cost stays real but the gap narrows.

**Consolidation and the channel.** Continued contract consolidation and the strength of the aggregators and SIs mean the channel-led motion remains dominant. Expect more vendors to lead through Carahsoft/immixGroup-style partners and more teaming with primes, not less.

**SLED's StateRAMP standardization.** StateRAMP adoption broadens, more states require it, and the SLED market becomes more uniform and more accessible — strengthening the case for SLED-first entry.

## Final Framework: The Go/No-Go Decision, The Sequence, The Timeline

**The go/no-go gate.** Do not start a federal motion unless you can answer yes to all of these. **Capital:** can you fund $3.5M-$7.5M over three years with little-to-no offsetting revenue, without betting the company? **Runway and patience:** does the board genuinely commit to a 24-48 month time-to-meaningful-revenue, and will they not panic at month 18? **Sponsoring agency path:** do you have a credible, identified route to a FedRAMP sponsoring agency relationship — not a hope, a path? **Commercial health:** is your commercial business strong enough that federal is an expansion bet, not a hail-mary? **Product fit:** does the government actually have a mission need your product uniquely serves, validated by real agency conversations? If any answer is no, the answer is wait or start with SLED.

**The sequence (do not reorder).** 1) Commit at the board level and fund it. 2) Hire the federal sales leader — the right one, slowly. 3) Through that leader, secure a sponsoring agency relationship. 4) Run FedRAMP Moderate authorization (start GovCloud build in parallel). 5) Land on contract vehicles — lead with a Carahsoft/immixGroup reseller relationship for speed, build your own GSA Schedule in parallel. 6) Run your first captures with discipline and a real bid/no-bid process. 7) Win, then drive each agency through its ATO. 8) Recognize revenue, build past performance, and compound. SLED can run as an earlier, cheaper parallel track that de-risks the whole thing.

**The realistic timeline.** Year 1: hire, sponsor, FedRAMP and GovCloud underway, GSA/reseller paper in motion, first captures opened — revenue near zero. Year 2: FedRAMP authorization lands, vehicles in place, captures maturing, first small wins (treat as past-performance acquisition) — revenue small. Years 3-4: first meaningful agency wins convert, ATOs cleared, the motion becomes repeatable, the pipeline compounds — revenue becomes material. Year 5+: federal is a durable, sticky, expanding, recession-resistant revenue base that justifies every dollar and every quarter of patience it took to build.

**The honest summary.** Building a federal motion from scratch is one of the highest-quality revenue bases a software company can own, and one of the most reliable ways to run out of cash if you start it underfunded, out of sequence, or without board-level patience. Pick your sub-market, fund the full gap, hire the specialist, respect the sequence, and treat compliance as the product gate it is. Do that and federal compounds for a decade. Skip any of it and you join the long list of companies that spent $4M to learn the gauntlet is real.

`;

const flow = `

## The Federal Motion Timeline: Decision To Revenue

\`\`\`mermaid
flowchart TD
  A[Board Commits And Funds The Gap] --> B[Hire Federal Sales Leader]
  B --> B1[Cleared GovCon Specialist 250K-450K OTE]
  B1 --> C[Secure Sponsoring Agency Relationship]
  C --> C1{Sponsoring Agency Identified}
  C1 -- No --> C2[Pause Or Pivot To SLED First]
  C1 -- Yes --> D[FedRAMP Moderate Authorization]
  D --> D1[Readiness Assessment And SSP]
  D1 --> D2[3PAO Assessment 250K-600K]
  D2 --> D3[Remediation And POA And M]
  D3 --> D4[Agency Authorization 12-24 Months]
  A --> E[Build GovCloud Environment In Parallel]
  E --> E1[AWS GovCloud Or Azure Government]
  E1 --> D4
  D4 --> F[Land On Contract Vehicles]
  F --> F1[Reseller Paper Carahsoft immixGroup Fast]
  F --> F2[Own GSA Schedule 6-12 Months Parallel]
  F1 --> G[Run First Captures]
  F2 --> G
  G --> G1[BD Identifies Opportunity Years Out]
  G1 --> G2[Capture Plan And Gate Reviews]
  G2 --> G3[Shape Requirement Via RFI Sources Sought]
  G3 --> G4[Teaming Agreements Locked]
  G4 --> G5[Proposal And Color Team Reviews]
  G5 --> H{Award Won}
  H -- No --> G1
  H -- Yes --> I[Agency ATO Process 3-9 Months]
  I --> I1[Authorizing Official Accepts Risk]
  I1 --> J[Go Live And Recognize Revenue]
  J --> K[Build Past Performance]
  K --> L[Option Years And Expansion Compound]
  L --> M[Durable Sticky Federal Revenue Base]
  G2 -.continuous monitoring cost.-> N[ConMon 200K-500K Per Year Forever]
  D4 --> N
\`\`\`

## Contract Vehicle And Channel Decision Tree

\`\`\`mermaid
flowchart TD
  A[Federal Or Public Sector Opportunity] --> B{Which Sub-Market}
  B -- SLED State Local Education --> C[Cooperative Vehicle Path]
  C --> C1[NASPO ValuePoint Or OMNIA Or Sourcewell]
  C1 --> C2[StateRAMP Or SOC 2 Sufficient]
  C2 --> C3[Sell Direct Or Via SLED VAR]
  B -- Federal Civilian --> D{Deal Size And Type}
  B -- DoD --> E{Program Size}
  D -- Transactional Or Mid-Size --> F[Reseller Aggregator Path]
  F --> F1[Carahsoft Or immixGroup GSA Schedule]
  F --> F2[Or SEWP Through Reseller]
  F1 --> F3[3-8 Point Margin Direct Relationship Kept]
  F2 --> F3
  D -- Large Modernization Program --> G[Systems Integrator Path]
  G --> G1[Sub Under Booz Allen Leidos SAIC GDIT CACI]
  G1 --> G2[Prime Carries Contract And Past Performance]
  D -- Set-Aside Solicitation --> H[Small Business Partner Path]
  H --> H1[Team With 8a SDVOSB WOSB HUBZone Firm]
  H1 --> H2[Partner Holds Eligibility You Provide Tech]
  E -- Large Of Record Program --> I[Prime SI Teaming Required]
  I --> I1[IL4-IL6 And CMMC Flow-Down]
  E -- Prototype Or New Entrant --> J[OTA Or SBIR Path]
  J --> J1[Consortium OTA Or SBIR Phase I-II-III]
  J1 --> J2[Phase III Sole-Source Transition]
  F3 --> K[Own GSA Schedule As Long-Term Parallel Track]
  G2 --> K
  H2 --> K
  I1 --> L[Cleared Staff And FCL Required]
  J2 --> L
\`\`\`

`;

const src = `

## Sources

1. **FedRAMP Program — fedramp.gov** — The authoritative source on the Federal Risk and Authorization Management Program: impact levels (Low/Moderate/High), the authorization process, the marketplace of authorized offerings, and the 2024-2026 modernization effort. https://www.fedramp.gov
2. **NIST SP 800-53 — Security and Privacy Controls for Information Systems** — The control catalog underlying FedRAMP and the DoD impact levels; defines the baselines a 3PAO assesses against. https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final
3. **GSA Multiple Award Schedule (MAS) — gsa.gov** — The governmentwide contract vehicle, the offer process, SINs, pricing negotiation, and the GSA Advantage catalog. https://www.gsa.gov/buy-through-us/products-and-services/professional-services/buy-through-the-multiple-award-schedule
4. **Federal Acquisition Regulation (FAR) — acquisition.gov** — The rulebook governing federal procurement, contracting officer authority, competition requirements, and sole-source justifications. https://www.acquisition.gov/far
5. **DoD Cloud Computing Security Requirements Guide (SRG) — Impact Levels IL2-IL6** — The DISA framework layering DoD-specific impact levels on top of FedRAMP for controlled and classified data.
6. **CMMC — Cybersecurity Maturity Model Certification (DoD)** — The certification program for defense contractors handling FCI and CUI, including tiered levels and contract flow-down. https://dodcio.defense.gov/cmmc/
7. **StateRAMP — stateramp.org** — The state-and-local-government analog to FedRAMP for standardized cloud security authorization in the SLED market. https://www.stateramp.org
8. **SBA Contracting Programs — 8(a), SDVOSB, WOSB/EDWOSB, HUBZone** — The Small Business Administration's set-aside and socioeconomic contracting programs and the governmentwide small-business goals. https://www.sba.gov/federal-contracting/contracting-guide
9. **SBIR/STTR — sbir.gov** — The Small Business Innovation Research and Small Business Technology Transfer programs, Phase I/II/III structure, and the Phase III sole-source transition authority. https://www.sbir.gov
10. **SAM.gov — System for Award Management** — The mandatory federal registration system and the portal for federal contract opportunities (formerly FedBizOpps). https://sam.gov
11. **USAspending.gov and FPDS** — Federal spending transparency and the Federal Procurement Data System for tracking awards, incumbents, and contract values. https://www.usaspending.gov
12. **NASA SEWP (Solutions for Enterprise-Wide Procurement)** — A heavily-used governmentwide acquisition contract for IT products and solutions. https://www.sewp.nasa.gov
13. **NIH CIO-CS and GSA Alliant / 8(a) STARS** — Major governmentwide acquisition contracts (GWACs) for IT services and solutions.
14. **Other Transaction Authority (OTA) — DoD and DHS guidance** — The FAR-exempt contracting mechanism used for prototypes and non-traditional vendor engagement, often via consortia.
15. **GSA Price Reductions Clause (PRC) and Commercial Sales Practices (CSP)** — The pricing-transparency and most-favored-customer-style obligations attached to a GSA Schedule, and the Transactional Data Reporting alternative.
16. **DCAA — Defense Contract Audit Agency** — The federal audit authority for contract pricing and cost, relevant to defective-pricing and False Claims Act exposure.
17. **AWS GovCloud (US) — aws.amazon.com/govcloud-us** — Amazon's isolated government cloud regions, access restrictions, and compliance attestations. https://aws.amazon.com/govcloud-us/
18. **Microsoft Azure Government — azure.microsoft.com/global-infrastructure/government** — Microsoft's dedicated government cloud environment and compliance posture. https://azure.microsoft.com/en-us/explore/global-infrastructure/government
19. **Google Cloud Assured Workloads / Government** — Google's compliance-controlled environment offering for US government workloads.
20. **Carahsoft — carahsoft.com** — The dominant government IT solutions aggregator ("master government aggregator"), its contract vehicle portfolio, and reseller model. https://www.carahsoft.com
21. **immixGroup (an Arrow company) — immixgroup.com** — Public-sector aggregator and go-to-market partner for commercial software vendors entering government. https://www.immixgroup.com
22. **TD SYNNEX Public Sector / DLT** — Established government reseller and distributor following the DLT acquisition.
23. **GovWin IQ (Deltek) — deltek.com/govwin** — The standard federal and SLED opportunity-intelligence platform for BD pipeline development, incumbent and budget tracking. https://www.deltek.com/en/products/business-development/govwin-iq
24. **Bloomberg Government and GovTribe** — Federal market intelligence, budget analysis, and opportunity-tracking platforms.
25. **NASPO ValuePoint — naspovaluepoint.org** — The state-led cooperative purchasing program enabling reuse of competitively-awarded contracts across SLED entities. https://www.naspovaluepoint.org
26. **OMNIA Partners, Sourcewell, E&I Cooperative Services, TIPS** — Major cooperative purchasing organizations covering SLED and education procurement.
27. **DCSA — Defense Counterintelligence and Security Agency** — The agency administering personnel security clearances and the Facility Clearance (FCL) process, including FOCI review. https://www.dcsa.mil
28. **3PAO Accreditation — A2LA / FedRAMP** — The accreditation of Third Party Assessment Organizations that perform FedRAMP security assessments.
29. **Shipley Associates — Capture and Proposal Management Methodology** — The widely-used industry framework for capture planning, gate reviews, and color team (Pink/Red/Gold) proposal reviews.
30. **APMP — Association of Proposal Management Professionals** — The professional body and body of knowledge for federal proposal development and capture management.
31. **AFCEA and ACT-IAC** — The major government-industry associations and event ecosystems (AFCEA West, TechNet; ACT-IAC forums) for federal IT relationship-building.
32. **Palantir Technologies — public filings and disclosures** — Reference case for a federal-and-defense-first company-building strategy and the durability of deeply-embedded government revenue.
33. **Zscaler — public disclosures on FedRAMP and federal zero-trust** — Reference case for using high-impact-level FedRAMP authorization as a competitive wedge.
34. **ServiceNow and Salesforce Government Cloud documentation** — Reference cases for standing up a separate, FedRAMP-authorized government cloud as a distinct product line.
35. **Anduril and the defense-tech SBIR/OTA cohort — public reporting** — Reference case for the venture-funded SBIR-to-OTA-to-production defense entry path.
36. **OMB Federal IT Budget and the IT Dashboard** — The Office of Management and Budget's annual federal IT spending data, the basis for the ~$120B-$130B federal IT spend figures.
37. **GAO reports on FedRAMP, IT acquisition, and bid protests** — Government Accountability Office oversight reporting on authorization timelines, procurement, and the protest process.
38. **Continuing Resolution and federal appropriations process — Congressional Budget Office** — Reference for the fiscal-year structure, color of money, and the impact of CRs on new-vendor awards.
39. **FERPA, COPPA, and state student-privacy laws** — The data-privacy regimes governing the K-12 and higher-education SLED sub-segments.
40. **2025-2027 federal procurement reform and DOGE-era reporting** — Public reporting on budget scrutiny, contract consolidation, workforce churn, and procurement-speed initiatives shaping the current vendor environment.

`;

const num = `

## Numbers

**Market Size**
- Total federal IT spend (annual): ~$120B-$130B (OMB)
- Federal civilian IT spend: a bit over half of total federal IT
- DoD IT spend (annual): ~$60B-$70B
- SLED technology market: large and fragmented across 50 states, thousands of localities, K-12 districts, and higher ed
- Federal small-business contracting goal: ~23% of eligible dollars (governmentwide)
- FedRAMP authorized offerings that are Moderate impact level: ~80%

**Compliance Costs And Timelines**
- FedRAMP Moderate authorization: $500K-$2M+ all-in, 12-24 months
- FedRAMP High authorization: $2M-$4M+, 18-30 months
- FedRAMP Low / Li-SaaS: cheaper and faster, narrower use
- 3PAO assessment fees alone: ~$250K-$600K to reach authorization
- NIST 800-53 controls at Moderate baseline: ~325 controls
- Continuous monitoring (ConMon): $200K-$500K+/year, ongoing forever
- StateRAMP: materially cheaper and faster than FedRAMP
- CMMC: tiered certification, increasingly flow-down in DoD contracts

**Contract Vehicles**
- GSA Schedule (MAS): table-stakes civilian vehicle; can run a base plus options up to 20 years total
- GSA Schedule timeline to award: 6-12 months (longer not unusual)
- GSA consultant fees: $15K-$50K
- SBIR: Phase I feasibility, Phase II development, Phase III production (Phase III sole-source-able)
- OTA: FAR-exempt, fastest path for prototypes and non-traditional vendors
- Major GWACs: NASA SEWP, NIH CIO-CS, GSA Alliant / 8(a) STARS

**Buying Cycle Lengths (Net-New Vendor)**
- SLED: ~6-12 months
- Federal civilian: ~12-18 months from serious agency conversation to funded award
- DoD: ~18-36 months
- Capture / BD pursuit window: 18-36 months from opportunity ID to award
- Agency ATO process (on top of a federal deal): 3-9 months
- Full critical path, standing start to meaningful federal revenue: 24-48 months

**Budget Cycle**
- Federal fiscal year: October 1 - September 30
- Q4 surge: July-September, especially final weeks of September ("use it or lose it")
- A disproportionate share of full-year federal IT awards land in the FY-end window
- Color of money: O&M, procurement, RDT&E — each with its own rules and availability period
- Continuing Resolution effect: stalls new-vendor and new-program awards

**Channel Economics**
- Aggregator / reseller margin (Carahsoft, immixGroup, DLT): ~3-8 points (more for full VAR services)
- Major SIs / primes: Booz Allen, Leidos, SAIC, GDIT, CACI, Accenture Federal, ManTech, Peraton
- Prime/SI teaming: only realistic path onto the largest programs as a sub

**The First Federal Hire**
- Federal sales leader compensation: $250K-$450K OTE (higher with a proven book)
- Time to fund the role before it produces: 18-24 months
- Sourced from: peer federal sales orgs, Carahsoft/immixGroup channel teams, SI/prime BD, agency/military transitions

**Security Clearances**
- Clearance levels: Confidential, Secret, Top Secret, TS/SCI and program access above
- Personnel clearance timeline: months to well over a year (improved by continuous vetting)
- Facility Clearance (FCL): 6-18 months to stand up, requires sponsor + cleared management + FOCI review + FSO
- FOCI risk: foreign LPs on the cap table can complicate or block an FCL

**Cost Model To Stand Up Federal (First 3 Years, Civilian)**
- FedRAMP Moderate authorization: $500K-$2M
- ConMon (back half of window): $300K-$1M
- GovCloud environment: $150K-$600K+/year
- GSA Schedule: $15K-$50K consultant + internal contracts labor
- Federal headcount (fully loaded, 3 years): $1.5M-$3.5M
- Capture and proposal (B&P) + intelligence tools: $300K-$800K+
- Channel and government marketing program spend: $150K-$400K
- GovWin IQ and intelligence stack: $15K-$50K+/year
- **Realistic 3-year total to stand up a civilian motion: ~$3.5M-$7.5M**
- DoD adds clearances + FCL on top

**Marketing And Intelligence**
- Indispensable spend: GovWin IQ (Deltek), Bloomberg Government, GovTribe, SAM.gov, USAspending.gov, FPDS
- Anchor events: AFCEA (West, TechNet), ACT-IAC, AWS Public Sector Summit, FedScoop/StateScoop, agency industry days
- Government marketing measured on: relationships and shaped pipeline, not MQLs

**SLED Specifics**
- Compliance bar: SOC 2 or StateRAMP often sufficient (vs full FedRAMP)
- Cooperative vehicles: NASPO ValuePoint, OMNIA Partners, Sourcewell, E&I, TIPS, GSA cooperative purchasing
- Entry cost: roughly one-tenth the capital of a federal motion
- Education sub-segments: K-12 (districts, E-rate, FERPA/COPPA) and higher ed (institutions, consortia, E&I, Internet2)

**Revenue Quality (Why It Is Worth It)**
- Contract structure: base period + option years (multi-year, budget-backed)
- Stickiness drivers: ATO, integration, switching cost, procurement inertia
- Characteristics: recession-resistant, expansion-friendly through option years and follow-ons
- Mature federal base net revenue retention: can be exceptional

**The Go/No-Go Gate (All Must Be Yes)**
- Can fund $3.5M-$7.5M over 3 years without betting the company
- Board commits to 24-48 month time-to-meaningful-revenue
- Credible identified path to a FedRAMP sponsoring agency
- Commercial business healthy enough that federal is an expansion bet
- Validated government mission need for the product

`;

const counter = `

## Counter-Case: When Building A Federal Motion Is The Wrong Move

The bull case for federal — sticky, multi-year, budget-backed, recession-resistant revenue — is real. But it is also the most over-romanticized expansion bet in B2B software, and a disciplined CRO or CEO should stress-test the decision hard before committing. There are real, common situations where starting a federal motion is straightforwardly the wrong call, and recognizing yourself in any of them should stop or delay the effort.

**Counter 1 — Insufficient capital for the 2-4 year ramp.** This is the killer. A federal motion realistically costs $3.5M-$7.5M over three years with little-to-no offsetting revenue before year three. A company with 18 months of runway, or a company that would have to divert capital from a still-unproven commercial motion, simply cannot afford it. The pattern is brutally consistent: a company starts federal, spends $2M-$4M over 18-24 months, the FedRAMP authorization is still not done and the first capture has not converted, the board loses patience or the cash gets tight, and the whole investment is written off — *just before* it would have started to pay. Federal is where underfunded ambition goes to die. If you cannot fund the *full* gap with conviction, do not start.

**Counter 2 — No credible path to a FedRAMP sponsoring agency.** The traditional FedRAMP authorization model effectively requires a sponsoring agency willing to put their name on your package. If you have no agency relationship, no warm path to one, and no realistic plan to develop one, you do not have a federal motion — you have a hope. Companies routinely start the FedRAMP spend (3PAO engagement, GovCloud build, documentation labor) before they have locked a sponsor, and then stall — fully authorized-ready but unable to *get* authorized, burning ConMon-level cost with no path to revenue. No sponsor, no motion. Solve the sponsor question *before* you spend on the gauntlet.

**Counter 3 — The commercial business still has obvious runway.** Federal is an expansion bet, and expansion bets should come from a position of strength. If your commercial business is still finding product-market fit, still has large untapped commercial segments, still has efficient commercial growth available — every dollar and every executive-attention-hour spent on a 2-4 year federal ramp is a dollar and an hour *not* spent compounding a faster, cheaper, proven motion. The opportunity cost is enormous and usually underweighted. Federal should be what you do when commercial growth is *slowing* and you need a new durable base — not when commercial is still the better marginal investment.

**Counter 4 — The compliance cost exceeds the realistic revenue.** Run the actual math. If your realistic federal TAM — the agencies that genuinely need your specific product, at the deal sizes they actually buy — does not comfortably clear the $3.5M-$7.5M standup cost plus the $200K-$500K/year forever ConMon cost plus the channel margin, then federal is value-destructive even if you win. Some products are too narrow, too cheap per seat, or serve too few relevant agencies to ever pay back the gauntlet. A $30K ACV product that can realistically reach a few dozen agency buyers does not justify a $5M standup. Be honest about the denominator.

**Counter 5 — The founder/CEO underestimates the patience required.** This is a temperament problem disguised as a strategy problem. Founders and CEOs wired for the commercial SaaS rhythm — fast cycles, monthly cohorts, weekly pipeline reviews that *move* — frequently cannot tolerate a motion where nothing visible happens for 18 months and the first real win is in year three. They start federal, then at month 14 they reorganize it, defund it, fold it back into the commercial team, or pull the federal leader onto commercial deals to "help the number" — and the motion dies of impatience, not of being wrong. If the CEO and board are not *temperamentally* built for the timeline, the strategy is irrelevant.

**Counter 6 — You would be building it out of sequence.** Plenty of companies start federal by doing the *visible* part first — hiring a couple of "federal AEs," sending them to conferences, putting "FedRAMP: in progress" on the website — without the board commitment, the sponsoring agency, the funded FedRAMP project, or the channel relationships. That is the sequence inverted, and it produces 18 months of activity and zero awards. If you are not prepared to run the sequence in order — commit and fund, hire the leader, secure the sponsor, do FedRAMP, land vehicles, run captures, win, ATO — you are not ready to start.

**Counter 7 — SLED would serve the actual goal better and cheaper.** Often the real goal is "we want durable, public-sector, budget-backed revenue" — and that goal is better served by a SLED motion at one-tenth the cost. If you have not seriously evaluated whether SLED gets you most of the strategic benefit (recession-resistant, multi-year, sticky public-sector revenue) without the FedRAMP gauntlet, you may be reaching for the hardest version of the market when an easier version serves the thesis. Starting federal when SLED was the right answer is an expensive misdiagnosis.

**Counter 8 — Your cap table or corporate structure creates FOCI or compliance blockers.** If your strategy depends on DoD or intelligence work and your cap table has significant foreign ownership, you may face a FOCI obstacle that complicates or blocks a Facility Clearance — a problem you cannot quickly solve and that may require restructuring or mitigation instruments. Discovering this *after* spending on a defense-oriented motion is a painful, avoidable mistake.

**Counter 9 — The window or the macro is wrong for your category.** The 2025-2027 environment — budget scrutiny, contract consolidation, workforce churn, a higher bar for net-new vendor spend — is genuinely harder for some categories than it was in 2021. If your product looks like discretionary, incumbent-style spend rather than demonstrable cost savings or mission impact, you may be entering into a headwind that materially lengthens an already-long ramp.

**The honest verdict.** Building a federal motion from scratch is the right move for a specific profile: a company with a healthy commercial base, conviction-level capital to fund the full multi-year gap, a credible sponsoring-agency path, a genuine validated government mission need, a board that is temperamentally and financially committed to a 24-48 month payoff, and the discipline to run the sequence in order. For that company, federal becomes one of the best revenue bases in software — sticky, expanding, recession-resistant, compounding for a decade. For *any other* profile — underfunded, no sponsor path, commercial still the better bet, math that does not clear the gauntlet, an impatient CEO, an out-of-sequence plan — the right answer is to wait, to fix the missing precondition first, or to start with SLED. The cost of starting federal wrong is not just the wasted $3M-$5M; it is the two years of executive attention and the opportunity cost of the motion you *should* have been building. Go in with eyes open, or do not go in.

`;

const links = `

## Related Pulse Library Entries

- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Sales-motion restructuring; relevant to building a specialist federal motion distinct from the commercial org.)
- **q9501** — How do you start a bookkeeping business in 2027? (Adjacent go-to-market build; sequencing and capital-discipline parallels.)
- **q9502** — How do you start a CPA firm in 2027? (Professional-services build with compliance-gated entry.)
- **q96** — How do I price an enterprise SaaS product for procurement-led buyers? (Government pricing transparency and procurement-led pricing overlap heavily.)
- **q97** — How do I build a channel / partner motion from scratch? (Carahsoft/immixGroup/SI channel strategy is a federal-specific application of channel building.)
- **q98** — How do I structure a capture / pursuit team for long sales cycles? (Capture management, bid/no-bid gates, and the 18-36 month pursuit.)
- **q99** — How do I forecast revenue when deals take 18-36 months to close? (Federal fiscal-year and capture-cycle forecasting.)
- **q100** — How do I build a compliance-as-a-product-gate roadmap? (FedRAMP/StateRAMP/CMMC as a product gate, not a checkbox.)
- **q88** — How do I decide which vertical or segment to expand into next? (The go/no-go framing for federal as an expansion bet.)
- **q89** — How do I sequence international expansion vs new-segment expansion? (Capital-allocation and sequencing decision adjacent to the federal go/no-go.)
- **q90** — How do I build a SLED / state-and-local motion? (The lower-cost public-sector entry point recommended as a federal precursor.)
- **q91** — How do I structure comp plans for sellers with multi-year sales cycles? (Federal sales leader comp and patient quota design.)
- **q92** — How do I hire a first specialist sales leader for a new motion? (The first-federal-hire profile and search.)
- **q93** — How do I work with systems integrators and primes as a software vendor? (The SI/prime teaming layer for large federal programs.)
- **q94** — How do I build past performance and references for a brand-new motion? (The chicken-and-egg past-performance bootstrap.)
- **q101** — How do I stand up a separate compliance-isolated product environment? (GovCloud as a parallel product surface.)
- **q102** — How do I evaluate whether to build, partner, or wait on a new GTM motion? (The build/partner/wait decision applied to federal.)
- **q103** — How do I manage a 2-4 year time-to-revenue investment with my board? (Board patience and the capital-gap conversation.)
- **q104** — How do I read and respond to an RFP / RFI / Sources Sought? (Proposal mechanics and the document sequence.)
- **q105** — How do I think about security clearances and cleared staff as a startup? (When DoD/IC work requires cleared personnel and an FCL.)
- **q1946** — How do you start a government contracting business in 2027? (Client-side / GovCon-native perspective on the same ecosystem.)
- **q1947** — How do you start a B2G SaaS company in 2027? (Government-first company-building, the Palantir-style path.)
- **q9601** — How do you start a fractional CFO business in 2027? (Capital-planning discipline relevant to funding a multi-year motion.)
- **q9701** — What is the best CRM and pipeline setup for long, complex sales cycles? (Tooling for capture-stage federal pipelines.)
- **q9801** — What is the future of government technology procurement in 2030? (Long-term outlook context: FedRAMP modernization, AI in procurement.)
- **q9802** — How will AI change government software buying by 2030? (AI-in-procurement counter and outlook context.)

`;

const tags = ['federal-sales','public-sector','govcon','fedramp','gtm-strategy','sled','dod','procurement','channel-strategy','2027'];

const sources = [
  { title: 'FedRAMP Program — fedramp.gov', url: 'https://www.fedramp.gov' },
  { title: 'GSA Multiple Award Schedule (MAS) — gsa.gov', url: 'https://www.gsa.gov/buy-through-us/products-and-services/professional-services/buy-through-the-multiple-award-schedule' },
  { title: 'Federal Acquisition Regulation (FAR) — acquisition.gov', url: 'https://www.acquisition.gov/far' }
];

const notes = {
  s6: 'Added 40 cited sources covering the federal motion: FedRAMP and NIST 800-53, the GSA Schedule and FAR, DoD impact levels and CMMC, StateRAMP, SBA set-aside programs, SBIR/STTR, the contract-vehicle landscape (SAM.gov, SEWP, GWACs, OTAs), GovCloud environments (AWS/Azure/Google), the channel and aggregator layer (Carahsoft, immixGroup, DLT), market-intelligence tools (GovWin IQ, Bloomberg Government), cooperative purchasing vehicles (NASPO, OMNIA, Sourcewell, E&I), DCSA and clearances, capture/proposal methodology (Shipley, APMP), the GovCon event ecosystem (AFCEA, ACT-IAC), and reference case companies (Palantir, Zscaler, ServiceNow, Salesforce, Anduril).',
  s7: 'Added comprehensive numerical analysis: market sizing ($120B-$130B federal IT, ~$60B-$70B DoD), compliance costs and timelines (FedRAMP Moderate $500K-$2M / 12-24 months, High $2M-$4M, ConMon $200K-$500K/year, 3PAO fees $250K-$600K, ~325 controls at Moderate), buying-cycle lengths by sub-market (SLED 6-12 months, civilian 12-18, DoD 18-36, capture 18-36, ATO 3-9, full critical path 24-48 months), the budget cycle (FY Oct 1-Sept 30, Q4 surge, color of money, CR effects), channel economics (3-8 point reseller margin), the first-federal-hire profile and comp ($250K-$450K OTE), clearance timelines and FCL mechanics, and a full first-3-year cost model totaling ~$3.5M-$7.5M to stand up a civilian motion.',
  s8: 'Added 9-element counter-case: insufficient capital for the 2-4 year ramp (the killer pattern of writing off the investment just before it pays), no credible FedRAMP sponsoring-agency path, commercial business still the better marginal investment, compliance cost exceeding realistic federal TAM, founder/CEO underestimating the patience required (a temperament problem disguised as strategy), building out of sequence (visible part first), SLED serving the actual goal better and cheaper, cap-table FOCI/compliance blockers for DoD/IC work, and a wrong macro window for the category — with an honest verdict on the specific profile federal is right for versus the profiles that should wait, fix the missing precondition, or start with SLED.',
  s9: 'Cross-linked 26 related Pulse entries: sales-motion and channel building (q1899, q97, q98, q99), compliance-as-product-gate (q100, q101), the go/no-go and sequencing decision frame (q88, q89, q102, q103), the SLED precursor motion (q90), specialist hiring and comp for long-cycle motions (q91, q92), SI/prime teaming (q93), past-performance bootstrap (q94), procurement-led pricing (q96), RFP/RFI mechanics (q104), clearances (q105), GovCon-native and B2G company-building (q1946, q1947), capital-planning discipline (q9601), long-cycle CRM tooling (q9701), and 2030 government-procurement outlook (q9801, q9802).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the federal / public-sector go-to-market motion playbook for a $10M-$300M ARR SaaS company. Two mermaid diagrams (the federal motion timeline from board commit through FedRAMP, contract vehicles, capture, ATO, to compounding revenue; and the contract-vehicle-plus-channel decision tree across SLED/civilian/DoD by deal type and agency). Full coverage: the four distinct sub-markets (civilian, DoD, IC, SLED) with budgets and cycle lengths, the compliance gauntlet (FedRAMP Low/Moderate/High, StateRAMP, IL2-IL6, CMMC), a FedRAMP deep dive (3PAO, JAB vs Agency ATO, ConMon), the contract-vehicle landscape (GSA MAS, GWACs/SEWP, IDIQs, OTAs, SBIR/STTR, sole-source), GSA Schedule mechanics and the pricing-transparency/PRC obligations, the federal budget cycle (FY-end surge, color of money, CRs), the buying roles (CO, COR, program office, end users), set-aside programs (8(a), SDVOSB, WOSB, HUBZone), the channel layer (Carahsoft, immixGroup, DLT) and the SI/prime layer (Booz Allen, Leidos, SAIC, GDIT, CACI), capture management and the 18-36 month BD cycle, proposal writing and color teams, government pricing and False Claims Act risk, the first federal hire profile and comp, security clearances and the FCL/FOCI process, government marketing and GovWin intelligence, the SLED motion and cooperative purchasing, the ATO as the real go-live gate, five reference case studies (Palantir, Zscaler, ServiceNow, Salesforce/Slack, Anduril), the capital-and-patience requirement, a realistic first-3-year cost model ($3.5M-$7.5M), GovCloud infrastructure, the past-performance bootstrap, the 2025-2027 DOGE-era environment, a 2027-2032 outlook, a final go/no-go framework and sequence, and a 9-element counter-case.'
};

runPolish({ id: 'q95', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
