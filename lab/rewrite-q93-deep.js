// q93 — When does PLG break and need a sales overlay?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Product-led growth does not "break" at a revenue number — it breaks at a **signal threshold**, and the single clearest signal is when **enterprise-shaped demand starts arriving faster than your self-serve funnel can convert it**. Concretely: when **enterprise inbound exceeds ~10% of signups**, when **usage-rich accounts plateau below the revenue they obviously justify**, when **net revenue retention (NRR) flattens at 105-115% instead of climbing toward 120-130%+**, and when **competitors are winning six-figure deals you should have won on product merits** — PLG has hit its ceiling and needs a sales overlay. The mistake most $5M-$50M ARR PLG companies make is treating this as binary ("add a sales team" vs "stay pure PLG") when the right move is to **layer the lightest overlay that the signals justify**: start with **sales-assist** (reps help close stalled self-serve deals, own no motion), graduate to **sales-led expansion** (reps own upsell/expansion on PLG-acquired logos), and only build a **full enterprise overlay** (a separate top-down team selling into accounts PLG cannot reach) once you have a repeatable PQL engine feeding it. The connective tissue is the **Product Qualified Lead (PQL)** — a scored bundle of in-product behaviors (seats added, feature depth, API calls, team invites, integrations connected) that predicts expansion and tells a human exactly when to enter the loop. Get the **sequencing** right and PLG + sales becomes a dual motion where the product plants seeds bottoms-up and sales harvests top-down at 130%+ NRR. Get it wrong — add sales **too early** and the overhead crushes the unit economics that made PLG work, reps fight the free tier, and the founder gets distracted by vanity enterprise logos; add sales **too late** and you leave enterprise revenue on the table, churn your whales from neglect, and hand the segment to a competitor. **The counter-case matters: a sales overlay is the wrong move if PLG still has runway, if the real problem is product activation (not sales coverage), or if the founder is chasing enterprise vanity revenue rather than following the signals.** This entry gives the explicit 7-signal trigger checklist, the three overlay models, PQL scoring mechanics, org and comp design, the attribution framework, the first-hire profile, the cost model, and the tooling stack.`;

const core = `

## The PLG-Breaks Symptoms: How To Recognize The Ceiling Before You Hit It

Product-led growth rarely fails loudly. It decays quietly, and by the time the decay shows up in the quarterly numbers, you have usually already left two to four quarters of enterprise revenue uncaptured. The first and most diagnostic symptom is **self-serve revenue growth decelerating while the top of the funnel stays healthy**. Signups are flat or up, activation looks fine, but new self-serve ARR is growing 4-6% quarter over quarter instead of the 12-20% it did eighteen months ago. The funnel is not broken — it is *saturated* at the deal sizes self-serve can close. You have wrung most of the easy revenue out of the motion that got you here.

The second symptom is **large accounts churning from lack of attention**. A PLG company at $15M-$40M ARR almost always has a power-law revenue distribution: the top 5-10% of accounts produce 40-60% of revenue. Those accounts behave nothing like the median self-serve customer. They have procurement cycles, security reviews, multiple internal champions and detractors, and a renewal that is a *decision*, not a default. When nobody owns those accounts as relationships — when they are just bigger rows in the same lifecycle email sequence everyone else gets — they churn at renewal not because the product failed but because a competitor showed up with a human who understood their roadmap and yours did not.

The third symptom is **expansion stalling inside accounts that should obviously be growing**. You can see a 600-person company with 45 paid seats, deep feature adoption, three connected integrations, and steady week-over-week usage growth — and it has not expanded in three quarters. Self-serve expansion captures the easy land-and-expand inside a team. It does not capture the *cross-team and company-wide* expansion that requires someone to map the org, find the budget owner, and run a deliberate expansion play.

The fourth symptom is **enterprise inbound being ignored** — or worse, mishandled. "Contact us" form fills, security questionnaires arriving over email, RFPs landing in a shared inbox, prospects asking for SSO/SAML, SOC 2 documentation, DPAs, custom MSAs, and volume pricing. In a pure PLG org, these requests route to support, or to a founder's inbox, or nowhere. Each ignored enterprise inbound is a $40K-$300K ACV opportunity that either dies or goes to a competitor who picked up the phone.

The fifth and most quantitative symptom is the **NRR plateau**. Healthy PLG companies climb toward 120-135% NRR as the cohorts mature. When NRR flattens at 105-115% and will not move despite a good product and improving retention, it almost always means the same thing: you have captured all the *self-serve-shaped* expansion and the remaining expansion requires a human. NRR is the single best aggregate signal that PLG has hit its structural ceiling, because it nets churn, contraction, and expansion into one number that tells you whether your installed base is a growth engine or a leaky bucket.

A useful mental model: PLG breaks when **the marginal dollar of growth gets meaningfully more expensive to acquire through the product than it would be to acquire through a human**. That crossover point is what every signal below is really measuring.

## The 7 Trigger Signals For A Sales Overlay

There is no single revenue number at which you "add sales." There is a set of seven signals, and the right rule is: **when three or more are firing simultaneously and have been for two consecutive quarters, you have crossed the threshold.** Two signals is a watch-list; three-plus is a decision.

**Signal 1 — Enterprise inbound exceeds ~10% of signups.** When more than one in ten new accounts looks enterprise-shaped (>500 employees, asks about SSO/security/procurement, lands on the pricing page and clicks "contact sales" instead of "start free"), you have a structural demand stream PLG cannot serve. At 3-5% you can ignore it. At 10%+ you are leaving money on the table every single week.

**Signal 2 — Self-serve accounts hitting expansion ceilings.** When a measurable cohort of accounts reaches a usage level that clearly justifies a larger plan but stalls — they max out the self-serve tier and just sit there — the product has done its job and a human now needs to do theirs. Look for accounts at 80%+ of a plan's seat or usage limit that have not upgraded in 60+ days.

**Signal 3 — Competitors winning big deals you should win.** When you lose six-figure deals in win/loss interviews and the reason is "they had a team that walked us through implementation and security" rather than "their product was better," PLG is structurally disadvantaged in the segment. You are bringing a self-serve motion to a sales fight.

**Signal 4 — Usage-rich accounts not converting to paid.** Free or trial accounts with deep, sustained usage that never convert are the clearest PQL signal of all. If you have a cohort of accounts with high feature depth, multiple active users, and months of engagement that remain unpaid, a human conversation closes a meaningful fraction of them.

**Signal 5 — Security and procurement questions you cannot self-serve answer.** SOC 2, ISO 27001, penetration test results, custom DPAs, vendor security reviews, SAML configuration, data residency, custom MSAs, redlined contracts. When these arrive weekly and there is no human and no process to handle them, every one is a stalled enterprise deal.

**Signal 6 — ACV ceiling on self-serve plans.** When your highest self-serve tier caps at, say, $12K/year and you keep meeting prospects who would happily pay $60K-$150K for the same product with enterprise controls and a relationship, the pricing architecture itself is capping ACV. The product can support more value than the motion can capture.

**Signal 7 — Board pressure for predictable enterprise revenue.** This one is real and should not be dismissed as politics. Self-serve revenue is *probabilistic* — you forecast it from cohort behavior. Enterprise revenue is *committable* — a rep can call a number with a pipeline. As you approach a raise or an IPO path, the board's demand for a forecastable, committed revenue line is a legitimate business signal, not vanity. It becomes a problem only when it is the *only* signal firing (see the counter-case).

The discipline here is to **count the signals, not feel them**. Founders who "feel" ready for sales at $4M ARR with one signal firing are usually chasing logos. Founders who wait until six signals are firing and NRR has been flat for a year have already lost a segment. Three-plus signals, two quarters: that is the rule.

## PLG vs Sales-Led vs PLG+Sales Hybrid

To know when PLG breaks you have to be precise about what the three motions actually are, because they have different economics and different failure modes.

**Pure PLG** acquires, activates, converts, and expands customers through the product itself with minimal or no human intervention in the buying process. The economics are characterized by **low CAC, fast payback (often 6-14 months), high gross margin, and a long, efficient tail** — but a **structural ACV ceiling** and a **structural inability to sell into accounts that buy top-down**. PLG dominates when the product delivers value in a single session, the buyer is also the user, the price point is low enough to expense, and the market is broad. It is the right *primary* motion for developer tools, design tools, productivity software, and most prosumer-to-SMB SaaS.

**Sales-led growth** acquires customers through outbound, marketing-sourced demand, and a human-run sales process; the product is evaluated, not self-served. The economics are the inverse: **high CAC, slow payback (18-30 months), but high ACV, committable forecasts, and the ability to sell into accounts no product tour will ever reach**. Sales-led dominates when the buyer is not the user (a CFO buying for a finance team), the product requires configuration and change management, the price point requires budget approval, and the market is concentrated.

**PLG + sales hybrid** is not a compromise — it is a *sequenced layering*. The product runs the top of the funnel and the SMB/mid-market motion at PLG economics, while a sales overlay handles the enterprise segment and the expansion the product cannot reach, at sales-led economics, **fed by signals the product generates**. The hybrid's defining advantage is **CAC efficiency**: because the product pre-qualifies and pre-warms every account, the sales overlay operates at a far lower CAC than a pure sales-led org would. A hybrid AE walks into conversations where the prospect is already using the product and the only question is scale and terms. That is a fundamentally cheaper sale.

The hybrid dominates — and is the correct end state for nearly every PLG company that survives to $20M+ ARR — when the market has *both* a broad self-serve long tail *and* a concentrated enterprise head. Slack, Figma, Notion, Datadog, Atlassian, HubSpot, and Zoom all converged on the hybrid for exactly this reason: the long tail funds efficient growth and the enterprise head funds the ACV and the forecast. The strategic question is never "PLG or sales" — it is "what is the lightest sales layer the signals justify, and how do I sequence it so it strengthens the PLG engine instead of fighting it."

## The Product Qualified Lead (PQL) Concept

The Product Qualified Lead is the single most important concept in this entire entry, because it is the mechanism that lets a sales overlay strengthen PLG instead of cannibalizing it. A **Marketing Qualified Lead** is someone who *expressed interest* (downloaded a whitepaper, attended a webinar). A **Sales Qualified Lead** is someone a rep *talked to and qualified*. A **Product Qualified Lead** is fundamentally different and far more valuable: it is an account that has **demonstrated value-aligned behavior inside the product** — it has experienced the "aha," it is using the thing, and its usage pattern statistically predicts that it would expand or convert if a human entered the conversation.

The PQL is powerful for three reasons. First, it has **near-zero acquisition cost** — the product already acquired and activated it, so the sales overlay is not paying to generate demand, only to convert it. Second, it has a **dramatically higher conversion rate** than any marketing-sourced lead, because it is grounded in revealed behavior rather than stated intent — a PQL converts at 25-40% in well-run orgs versus 1-5% for an MQL. Third, and most importantly for org health, it **resolves the PLG-vs-sales tension**: reps are not cold-calling and they are not poaching free users; they are reaching out to accounts the product itself flagged as ready, at the moment the product flagged them. The motion *feels* like helpful expansion to the customer, not a sales ambush.

The PQL → sales handoff is the critical operational seam. When an account crosses the PQL threshold, it should fire an event into the CRM with the *context*: which behaviors triggered it, what the account looks like (size, industry, current plan), who the active users are, and what the suggested play is (convert trial, expand seats, upsell to enterprise tier). A rep should be able to open that record and within ninety seconds know exactly why this account is on their list and what to say. The handoff that fails is the one that hands a rep a name and a score with no story — the rep then has to re-discover everything the product already knew, and the efficiency advantage evaporates.

Defining the PQL well is genuinely hard and is the work that most distinguishes PLG companies that successfully add sales from those that bolt on a flailing sales team. It requires honest cohort analysis: go back through the accounts that *did* expand or convert to enterprise, find the behaviors they exhibited 30-90 days *before* the expansion, and reverse-engineer the score from there. The PQL is not a guess. It is a regression.

## PQL Scoring Mechanics

A PQL score is a weighted composite of in-product behaviors that, in your specific historical data, predict expansion or enterprise conversion. The exact weights are company-specific, but the *categories* of predictive signals are remarkably consistent across PLG companies, and they fall into five buckets.

**Seats and users added.** The most universally predictive signal. An account that has grown from 3 to 12 active users in 60 days is on an expansion trajectory; an account flat at 4 users for six months is not. Weight both the *count* and the *velocity* — velocity is often more predictive than absolute number, because it captures momentum.

**Feature depth and breadth.** Accounts that use only the entry-level feature behave like trials; accounts that have adopted three, four, five distinct feature areas have woven the product into a workflow and are structurally stickier and more expansion-ready. Score the *number of distinct features touched* and especially adoption of features associated with paid or enterprise tiers.

**API usage and technical integration.** For any product with an API, sustained and growing API call volume is a powerful expansion predictor because it means the product is embedded in the customer's own systems — switching costs are high and usage scales with the customer's business. Weight API call volume, the number of distinct endpoints used, and the presence of a generated production API key.

**Team invites and collaboration.** Invites sent — especially invites sent to people in *different departments or with senior titles* — signal that the product is spreading inside the org. An invite to a VP or a different team is a leading indicator of company-wide expansion. Score invite volume, invite acceptance rate, and the org-distance of invitees.

**Integrations connected.** Each third-party integration a customer connects (their SSO provider, their data warehouse, their CRM, their Slack) raises switching costs and signals serious intent to operationalize the product. Number of integrations connected is one of the cleanest expansion predictors available and is easy to instrument.

Beyond these five behavioral buckets, layer **firmographic fit** as a multiplier, not an additive component: a 2,000-employee company crossing the behavioral threshold is a different opportunity than a 15-person company crossing the same threshold, and the score should reflect that. The output should not be a single number alone — it should be a number *plus a tier* (e.g., "PQL-Enterprise" vs "PQL-Expansion" vs "PQL-Convert") so the routing logic knows which overlay model and which play the account belongs to. Finally, treat the score as a **living model**: re-fit it every two quarters against fresh closed-won and closed-lost data, because as the product and ICP evolve, the predictive behaviors drift. A stale PQL model quietly sends reps to the wrong accounts.

## The Sales-Assist Model

The sales-assist model is the lightest possible sales overlay, and for most PLG companies firing three or four trigger signals it is the correct *first* layer. In sales-assist, **sales does not own a motion** — it owns *intervention*. The product still runs acquisition, activation, conversion, and the default expansion path. Sales-assist reps step in only at specific friction points: a self-serve deal that stalled in the buying flow, a trial account that hit a wall, a prospect who clicked "contact sales" because they had a procurement question, a customer trying to upgrade who got stuck on billing or contract terms.

The defining characteristic is that **the rep is a closer and an unblocker, not a hunter and not an owner**. They do not have a quota built on a pipeline they generate; they have a quota built on conversion of product-generated PQLs and inbound. Their job is to remove the human-shaped friction from a motion that is otherwise self-serve. A prospect needs a one-page security summary and a 20-minute call — sales-assist handles it. A trial account has 30 active users and a stuck procurement process — sales-assist closes it. A self-serve customer wants to go from the $15K plan to a $70K enterprise arrangement with a custom MSA — sales-assist runs it.

Sales-assist is the right first layer because it is **cheap, low-risk, and reversible**. You can run it with one or two people. It does not require rebuilding comp plans, restructuring the org, or changing the product's free tier. It does not create the "reps fighting the free tier" pathology because the reps are explicitly *helping* the self-serve motion convert, not competing with it. And it generates the data you need to decide whether to build the heavier layers: if sales-assist reps are closing PQLs at 30%+ and the deals are bigger than self-serve, you have proven the model and can graduate. If they are struggling, you have learned something cheaply.

The failure mode of sales-assist is **scope creep into a full sales motion without the supporting infrastructure** — reps start prospecting, start claiming credit for product-driven conversions, start asking for territory. Resist this. Sales-assist is a deliberate, bounded layer. When the signals say it is time for more, you graduate to the next model on purpose, with the comp and org changes that the next model requires.

## The Sales-Led Expansion Model

The second layer up is sales-led expansion, where **sales owns expansion and upsell on PLG-acquired accounts**. This is the layer most PLG companies under-invest in, and it is usually where the largest, fastest ROI sits — because expansion revenue on an installed base is the cheapest revenue in all of SaaS.

In this model, the product still owns acquisition and the initial conversion to paid. But once an account is a paying customer, a human — typically an Account Manager or an Expansion AE — owns the relationship and the growth of that account. They map the org, identify which other teams could use the product, find the budget owner, run deliberate expansion plays, manage the renewal as a real conversation, and upsell to higher tiers. They are fed by the PQL engine, which surfaces *expansion* PQLs: accounts whose behavior says they are ready to grow.

The economics here are exceptional because the CAC is essentially zero — the customer is already acquired — and the expansion AE is operating against revealed demand. A well-run sales-led expansion layer is what moves NRR from a stuck 110% to 125-135%. That delta, compounded across the installed base, is frequently worth more than the entire new-logo motion.

The org placement matters: sales-led expansion AEs should sit close to Customer Success, not be confused with it. CS owns adoption, health, and retention; expansion sales owns *growth* of the account. In smaller orgs one person may wear both hats, but the incentives are different and as you scale you separate them. The comp for an expansion AE is built on net expansion ARR — new seats, tier upgrades, cross-team land — with renewal as a gate, not the primary payout.

The trigger to build this layer is Signal 2 (self-serve accounts hitting expansion ceilings) and Signal 5/6 combined with a flat NRR. If you have a large installed base with demonstrable un-captured expansion and your NRR is stuck, sales-led expansion is almost always a higher-ROI investment than a new-logo enterprise team — and most PLG companies get the sequencing backwards, building the shiny enterprise hunting team before they have harvested their own backyard.

## The Full Enterprise Overlay

The heaviest layer is a full enterprise overlay: a **separate enterprise sales team that sells top-down into accounts PLG cannot reach**. This is not the same as sales-assist or sales-led expansion. Those layers work *with* the product's existing footprint in an account. The enterprise overlay sells into accounts where either there is no product footprint yet, or the footprint is a tiny shadow-IT pocket and the real deal is a top-down, company-wide, multi-year enterprise agreement negotiated with a VP or C-level buyer who has never personally touched the product.

The enterprise overlay has its own AEs (often with SDR support), its own sales engineering, its own deal desk, its own enterprise pricing and packaging, and a genuine outbound capability. It runs a real sales process: discovery, multi-threading, security review, procurement, legal, executive alignment, and a negotiated close. Deal cycles are 3-9 months. ACVs are $75K-$500K+. This is sales-led growth — operating *inside* a PLG company.

The critical discipline is that **the enterprise overlay should be built last and built only once the PQL engine is feeding it**. The reason is CAC. If you stand up an enterprise team that has to generate 100% of its own pipeline from cold outbound, you have just bolted a pure sales-led-growth cost structure onto your company and you will discover that enterprise sales-led CAC is brutal. But if the enterprise overlay's pipeline is *substantially fed by enterprise PQLs* — accounts where the product already has a foothold, where there are active users who can be champions, where you can walk in and say "you have 40 people using this in three departments, let's talk about doing it properly" — then the enterprise motion runs at a fraction of the CAC of a true sales-led competitor. That product-generated warm pipeline is the entire structural advantage of being a PLG company that adds enterprise sales. Companies that build the enterprise overlay before the PQL engine throw that advantage away and just become an expensive sales-led company with a free tier that confuses everyone.

The enterprise overlay also requires the product and the company to actually be enterprise-ready: SSO/SAML, SCIM provisioning, audit logs, role-based access control, SOC 2 and ideally ISO 27001, a real DPA, custom contract capability, an SLA, and a support tier that matches. Building the sales team before the product is enterprise-ready produces a team that loses every deal at the security review and burns out in two quarters.

## Org Design For PLG + Sales

The org design question for PLG + sales has a clean answer that most companies discover the hard way: **the growth team owns the funnel; the sales team owns PQL conversion, expansion, and enterprise.** The boundary is the PQL.

The **growth team** (product managers, growth engineers, lifecycle marketing, product marketing) owns everything up to and including the moment an account becomes a PQL: acquisition, onboarding, activation, the self-serve conversion path, the self-serve expansion path, the pricing page, the in-product upgrade flows, and — critically — the PQL model itself. Growth's job is to maximize the volume and quality of PQLs and to keep the self-serve motion as efficient as possible. Growth is measured on signups, activation rate, self-serve conversion, self-serve-driven NRR, and PQL volume.

The **sales team** owns everything from the PQL forward: converting PQLs that need a human, expanding PLG-acquired accounts, and running the enterprise overlay. Sales is measured on PQL conversion rate, sales-sourced and sales-influenced ARR, net expansion ARR, and enterprise pipeline and bookings.

The two functions are joined by a **shared definition of the PQL and a shared revenue operations function** that owns the data pipeline from product analytics into the CRM, owns the attribution model, and owns the routing logic. RevOps is not optional in a hybrid — it is the connective tissue. Without it, growth and sales argue about definitions and credit instead of compounding each other.

A few hard-won org principles. **Do not put sales in charge of the product's free tier or self-serve pricing** — that is a growth decision, and sales will always be tempted to gate things behind "talk to sales" in ways that throttle the funnel. **Do not let sales prospect into the active free-user base unsupervised** — route everything through the PQL model so reps reach accounts that are *ready*, not accounts that look big. **Keep Customer Success as its own function** with its own leader; do not fold it under sales (it becomes a revenue function and stops protecting retention) or under support (it stops being proactive). And **have one revenue leader** — a CRO or VP Revenue — who owns the whole picture and is accountable for the handoff working, because the most common hybrid failure is two leaders optimizing two halves and a broken seam in the middle.

## Comp Design For PLG + Sales

Comp design is where the PLG + sales hybrid most often goes wrong, because the core tension is unavoidable: **how do you pay reps for revenue that the product, not the rep, substantially generated — without either underpaying them (so you cannot hire) or overpaying them for product-driven growth they did not cause?**

The wrong answers are common. Paying reps full commission on every dollar of a PQL they "closed" overpays them — the product did most of the work, and you have just made your most efficient revenue your most expensive. Paying reps nothing on product-sourced revenue is equally wrong — no good rep will join, and the ones who do will spend all their time on the few cold deals they can claim full credit for, ignoring the PQL queue that is your actual growth engine.

The framework that works has three components. First, **a lower commission rate on PQL-sourced and self-serve-influenced revenue than on rep-sourced revenue.** A rep might earn, say, 6-8% on a PQL they converted versus 12-15% on a deal they sourced cold. This honestly reflects contribution: the rep added real value (they closed it, they handled procurement, they unblocked it) but the product generated the demand. Second, **comp the expansion AE on net expansion ARR with renewal as a gate** — they get paid for growing the account, but they do not get paid at all if the base churns, which aligns them with retention. Third, **for the enterprise overlay, comp closer to a traditional sales-led plan** because that motion genuinely is rep-driven — but still apply a modest haircut on deals where there was a meaningful pre-existing product footprint, because there is a real difference between landing a cold enterprise logo and converting an account with 40 active users.

The deeper principle: comp should make the rep *want* to work the PQL queue. If the comp plan makes cold-sourced deals far more lucrative than PQL conversions, reps will rationally ignore the PQL queue and chase cold deals — and you will have built a sales team that fights your PLG motion instead of riding it. The PQL queue should be the easiest money on the plan: lower rate, but high volume and high conversion, so a rep working it diligently out-earns a rep chasing cold deals. Tune the rates until that is true. Also keep **quotas realistic in year one of any new layer** — a rep on a brand-new motion with an unproven PQL model cannot hit a mature quota, and setting one guarantees turnover that resets your learning to zero.

## The Attribution Problem

Attribution in a PLG + sales hybrid is genuinely hard, politically charged, and important enough that getting it wrong can poison the whole org. The core problem: a given dollar of revenue can plausibly be claimed by the product (it acquired and activated the account), by marketing (it sourced the original signup), and by sales (a rep closed or expanded it). If you let those three functions fight over 100% of the credit, you create a zero-sum culture exactly where you need a compounding one.

The cleanest framework uses **three mutually exclusive categories plus one overlay category**. **Product-sourced** revenue: the account self-served all the way to paid with no human involved — full credit to the product/growth motion. **Sales-sourced** revenue: a rep generated the opportunity through outbound or worked a cold account with no meaningful product footprint — full credit to sales. **Sales-converted (PQL-sourced)** revenue: the product generated the PQL and a rep converted or expanded it — this is *shared* credit, and the org should explicitly report it as shared rather than letting either side claim it whole. Then **sales-influenced** is an *overlay* tag, not a fourth bucket: it marks any product-sourced or PQL-sourced deal that a rep touched in a way that helped, used for understanding rep contribution but never double-counted into the revenue total.

The operational keys: **decide the rules before the quarter, not after** (retroactive attribution debates are toxic); **instrument it in the data pipeline** so attribution is computed from product and CRM events, not argued in a spreadsheet; and **report the shared category proudly** — a healthy hybrid *wants* a large sales-converted number, because it means the product and sales are compounding. Leadership should explicitly celebrate PQL-sourced revenue as a *win for both functions*, not force a clean hand-off of credit. The goal of the attribution model is not to perfectly assign causality — that is impossible — it is to give every function a fair, stable, pre-agreed view of its contribution so that growth and sales spend their energy compounding each other instead of litigating credit.

## When To Hire The First Salesperson

The first sales hire is a decision most PLG founders make either too early (chasing logos with one signal firing) or too late (after a year of flat NRR and lost deals). The disciplined answer combines a **revenue threshold** and a **signal threshold**, and both must be true.

The **revenue threshold** is a proxy for "the PLG engine is real and self-sustaining": typically **$2M-$5M ARR**, growing efficiently, with a healthy self-serve funnel and a payback period that proves the unit economics. Below this, you do not have a PLG engine for sales to overlay — you have a product looking for a motion, and adding sales is premature regardless of inbound. The reason the threshold is a range, not a number, is that it depends on ACV and inbound mix: a company at $2.5M ARR with 15% enterprise inbound is more ready than one at $6M ARR with 2% enterprise inbound.

The **signal threshold** is the 7-signal framework above: **three or more signals firing for two consecutive quarters**, with at least one of them being a *demand* signal (enterprise inbound, usage-rich accounts not converting, or competitors winning) rather than only an *internal* signal (board pressure). Demand signals mean the market is pulling; internal signals alone mean someone is pushing.

When both thresholds are met, hire **one** person — not a team, not a VP first. The sequencing mistake that kills PLG companies is hiring a VP of Sales who then builds a team in their own (usually sales-led) image before anyone has proven the PQL motion converts. Hire one individual contributor, give them the PQL queue and the inbound, and have them prove the motion: what is the PQL conversion rate, what is the deal size, what is the cycle length, what plays work. *Then* you know what to hire next and what the comp plan should be. The first hire is a learning investment as much as a revenue one — they are writing the playbook the team will run.

A practical timing note: the first hire should *follow* a basic PQL definition, not precede it. If you cannot yet articulate which behaviors predict expansion, the first rep will spend three months guessing — better to do the cohort analysis first, ship a v1 PQL score, and then hire someone to work it.

## The First Sales Hire Profile

The profile of the first sales hire is as important as the timing, and it is **not the profile most founders default to**. The instinct is to hire a proven enterprise rep from a sales-led company — someone with a big logo on their resume and a Rolodex. That is usually the wrong hire, because that person's entire skill set and instinct is built for a motion you are not running.

The right first hire is a **PLG-native, consultative, product-fluent AE** with a specific set of traits. They are **consultative, not transactional** — comfortable diagnosing a customer's situation and pointing them to the right tier, even if that is a smaller one, because in a PLG motion trust compounds and pushy closing torches it. They are **product-fluent** — they can actually use the product, speak to its capabilities credibly, and have a real conversation with a technical or design or developer buyer without a sales engineer holding their hand. They are **comfortable with an inbound and PQL-driven motion** — they do not need to generate all their own pipeline and they do not consider working a warm queue "beneath" them; in fact they should find it energizing that the product hands them pre-qualified accounts. They are **collaborative with product and growth** — they will feed insights back ("here is the friction I see in deals," "here is what enterprise prospects ask for") rather than treating those teams as adversaries. And critically, they are **not a cold-outbound hunter** — that is a different motion for a later layer; a hunter dropped into a PQL-conversion role will be bored, will go rogue and start cold-prospecting, and will quietly resent the comp plan.

Where to find this person: often the best first sales hire comes from *another PLG company* one stage ahead of yours, or from a customer-facing role (sales engineering, senior CS, solutions) at a PLG company, or occasionally from a founder/early-employee background where they have had to sell consultatively without a machine behind them. Look for someone who *chose* PLG, not someone who will tolerate it until they can rebuild a "real" sales team. The first hire sets the cultural template for the entire revenue org — hire someone whose instincts you would be happy to see replicated.

## Pricing Tier Architecture For PLG + Sales

A PLG + sales hybrid needs a deliberate pricing architecture with **four altitudes**, and the boundaries between them are where the motion's seams live: **Free → Self-Serve Paid → Sales-Assisted → Enterprise.**

**Free** exists to maximize top-of-funnel and time-to-value. It must deliver a genuine "aha" — a crippled free tier kills the PLG engine — but it should be bounded so that *success* on the free tier naturally creates a reason to pay (a seat cap, a usage cap, a feature gate aligned with the value the product creates). The free tier is a growth instrument, owned by growth, not a sales concession.

**Self-serve paid** is the workhorse: clearly priced, purchasable with a credit card, no human required. This tier should capture the entire SMB and lower-mid-market segment efficiently. Its job is to convert and expand without ever touching sales. It typically has one to three sub-tiers.

**Sales-assisted** is the tier where "talk to sales" first appears as an *option* rather than a *requirement*. This is the tier for accounts that could self-serve but have a reason to want a human: volume pricing, annual contracts, light procurement needs, a security questionnaire. Pricing here is semi-public — a starting point is listed, but the final number is negotiated.

**Enterprise** is "contact sales," with no public price. It bundles the enterprise controls (SSO/SCIM, audit logs, RBAC, advanced security, SLA, dedicated support, custom contract) and is sold by the enterprise overlay. It exists to capture the ACV that the lower tiers structurally cannot.

The architectural discipline is that **each tier boundary should map to a motion boundary**, and the "talk to sales" entry points should be placed where the *customer* genuinely benefits from a human — not sprinkled everywhere to feed the sales team. If "contact sales" appears too low in the architecture, you throttle the self-serve funnel and train customers that the product is "really" a sales-led product. If it appears too high or not at all, enterprise demand has no door to walk through. Get the placement right and the pricing page itself becomes a routing mechanism: small buyers self-serve, mid-market buyers self-serve or opt into help, enterprise buyers find the door — all without a human deciding.

## The "Talk To Sales" Trigger Design

The "talk to sales" trigger is the literal mechanism that routes a self-serve user to a human, and its design is a high-leverage detail most companies under-think. There are two ways it fires: **user-initiated** and **system-initiated**, and a good hybrid uses both.

**User-initiated triggers** are the buttons and forms: "Contact sales," "Talk to an expert," "Get a custom quote," "Request enterprise access." The design principles: make them *visible but not pushy* (present on the pricing page and at relevant in-product moments, never blocking the self-serve path), make them *low-friction* (a short form, not a 12-field interrogation), and make them *fast* (a PLG buyer who clicks "contact sales" expects a response in hours, not days — the speed of follow-up is itself a conversion lever). Route these directly to sales-assist with full product context attached.

**System-initiated triggers** are the more sophisticated half: the product detects a PQL-threshold crossing or a specific high-intent behavior and proactively routes the account to a human — either by surfacing an in-product offer ("It looks like your team is growing — want to talk about a plan that fits?") or by firing a CRM task for a rep to reach out. The behaviors that should fire a system trigger: hitting a plan's seat or usage ceiling, a burst of team invites especially to senior titles, connecting an SSO integration, sustained heavy API usage, multiple users from the same large company signing up independently, or a security/compliance-related support ticket.

The design discipline is **gate as little as possible**. The "talk to sales" trigger should *route*, not *block*. The anti-pattern — putting a "contact sales" wall in front of features or usage that should be self-serve — converts a smooth PLG funnel into a leaky sales funnel and is one of the fastest ways to break PLG while thinking you are scaling it. The trigger's job is to offer a human to the accounts that would benefit from one, at the moment they would benefit, while leaving the self-serve path completely unobstructed for everyone else. Done well, the customer experiences it as the product being helpful; done badly, they experience it as the product being held hostage.

## Customer Success In PLG + Sales

Customer Success in a hybrid has a specific, often-muddled role, and getting it clear is essential because CS is the function most likely to be either neglected (in a pure-PLG holdover org) or distorted into a quota-carrying sales function (in an over-corrected one).

The clean division: **CS owns adoption, health, and retention of PLG-acquired accounts post-conversion; sales-led expansion owns growth of those accounts; and the two are partners, not the same person.** When a self-serve account converts to a paid plan large enough to warrant a relationship, it should get a CSM whose job is to drive adoption, monitor health, run onboarding for the human-touched portion of the account, catch churn risk early, and ensure the customer is getting value. The CSM is the customer's advocate and the early-warning system. The expansion AE, fed by PQL signals, is the one who runs the deliberate growth play. CS surfaces "this account is healthy and adopting fast" and the expansion AE acts on it; CS surfaces "this account is at risk" and CS plus the AE run a save.

The reason not to merge them: if you make the CSM carry an expansion quota, they stop being a trusted advisor and become a salesperson the customer learns to distrust — and you lose your best retention asset. If you make the expansion AE responsible for health and adoption, they neglect it because their comp is on growth. Separate incentives, shared accounts, one shared definition of account health.

For accounts *below* the relationship threshold — the long tail of self-serve customers — "Customer Success" is **the product itself plus pooled/digital CS**: in-app guidance, lifecycle messaging, a help center, community, and a reactive support function. You cannot and should not put a human CSM on a $2K/year account. The hybrid's CS model is therefore *tiered*: digital/product-led CS for the long tail, dedicated human CS for the accounts a relationship pays for, with the PQL and account-value model deciding which tier each account sits in. RevOps owns that segmentation logic so it stays consistent.

## 5 Real Case Studies

**Slack's enterprise overlay.** Slack is the canonical bottoms-up-then-top-down story. It spread virally team-by-team inside companies on a free and self-serve motion, building enormous in-org footprints before any salesperson got involved. Slack then layered an enterprise sales team whose job was explicitly to *convert existing footprint* — to walk into a company with thousands of users across dozens of teams already on Slack and negotiate a top-down enterprise agreement (Slack Enterprise Grid) with the controls, security, and central administration IT required. The enterprise team was not generating cold demand; it was harvesting and consolidating a footprint the product had already planted. That is the textbook full-enterprise-overlay-on-top-of-PLG model.

**Notion's 2022-2024 sales build.** Notion grew for years almost purely on PLG — viral templates, individual and small-team adoption, a generous free tier. As the company scaled and enterprise demand mounted (and as competitors pushed upmarket), Notion deliberately built a go-to-market sales motion through 2022-2024: enterprise plans, an enterprise sales team, and the security and admin features (SSO/SAML, SCIM, audit log, advanced permissions) that enterprise buyers require. Notion is a recent, well-documented example of a PLG-native company adding a sales overlay *after* the product engine was unambiguously proven — sequencing the way the framework above prescribes.

**Figma's enterprise motion.** Figma spread bottoms-up among individual designers and design teams because the product was collaborative by nature — every shared file was a growth loop. On top of that organic spread, Figma built an enterprise motion: enterprise pricing, org-wide plans, admin and security controls, and a sales team that sold design-system-wide and company-wide deals into accounts where Figma was already the daily tool of every designer. Figma's enterprise sales worked precisely because the product had already won the users; sales' job was to formalize and expand, not to convince from zero.

**Datadog's PLG + sales hybrid.** Datadog is one of the clearest examples of a mature, balanced hybrid. Developers and engineering teams adopt Datadog bottoms-up with a free tier and frictionless self-serve onboarding; usage grows naturally as customers instrument more of their infrastructure. On top of that, Datadog runs a substantial enterprise sales organization that lands and expands large accounts, drives multi-product adoption, and negotiates enterprise commitments. Datadog's consistently high net revenue retention is the financial signature of a hybrid where the product-led bottoms-up motion and the sales-led expansion motion compound rather than compete.

**Airtable's sales overlay.** Airtable grew through broad self-serve and viral adoption — flexible enough that individuals and teams adopted it for countless use cases without any sales contact. As Airtable pushed to monetize larger organizations, it added an enterprise sales overlay and enterprise-grade capabilities (admin controls, security, governance) to convert its sprawling self-serve footprint inside big companies into enterprise contracts. Airtable illustrates both the opportunity and the difficulty of the overlay: a huge, diffuse self-serve footprint is fertile ground for an enterprise team, but only if the team can identify *which* footprint is enterprise-convertible — which is exactly the PQL problem.

## 5 PLG-Overlay Failures

The failures are less publicly documented than the successes, but the *patterns* are well known to anyone who has operated in this space, and they are worth naming as archetypes.

**The premature VP of Sales.** A company at $3M ARR with strong PLG metrics but only one or two trigger signals hires a senior VP of Sales from a sales-led background. The VP, doing exactly what they were hired to do, builds a team in their own image: AEs with quotas, SDRs doing outbound, a traditional pipeline. The team has no PQL engine to feed it, so it generates cold pipeline at sales-led CAC, the unit economics blow out, and the board that wanted "predictable revenue" now has an expensive cost center. The fix would have been one IC and a PQL model. The pattern: hiring the *leader* and the *structure* before proving the *motion*.

**The free-tier war.** A company adds a commissioned sales team without re-aligning incentives around the PQL. Reps quickly learn that the free tier is "giving away" deals they could close, and they start lobbying — successfully — to gate features behind "contact sales," shrink the free tier, and route more users to humans. Self-serve conversion drops, the funnel that funded the company chokes, and growth stalls. The pattern: letting sales incentives override growth ownership of the free tier.

**The PQL-less enterprise team.** A company builds the full enterprise overlay first — skipping sales-assist and sales-led expansion — because enterprise logos are exciting. With no PQL engine, the enterprise team cold-prospects, ignores the warm product footprint, and competes against true sales-led companies on their terms and at their CAC. Meanwhile the company's actual advantage — thousands of un-harvested in-product footprints — sits untouched. The pattern: building the heaviest layer first and throwing away the PLG CAC advantage.

**The attribution civil war.** A company adds sales without a pre-agreed attribution model. Marketing, growth, and sales spend every QBR fighting over who gets credit for PQL-sourced revenue. Reps refuse to work PQLs they cannot claim full credit for; growth resents sales "stealing" product-driven wins. The org turns zero-sum exactly where it needed to compound. The pattern: no RevOps, no pre-agreed rules, credit treated as scarce.

**The founder's vanity enterprise pivot.** A founder, often after a competitor announces a big logo or after a board meeting, decides the company is "going enterprise" and redirects roadmap, hiring, and their own time toward a handful of large prospects — while the PLG engine, still 90% of revenue, gets neglected. A few marquee deals close slowly and unprofitably; the self-serve motion decays from inattention; net growth slows. The pattern: chasing enterprise as identity rather than following the signals, and starving the engine that actually works.

## The Risk Of Adding Sales Too Early

Adding a sales overlay before the signals justify it is one of the most expensive mistakes a PLG company can make, and it is expensive in three distinct ways.

**It crushes the unit economics that made PLG work.** PLG's whole financial advantage is low CAC and fast payback. A sales team — salaries, commissions, SDR support, sales tooling, sales engineering, a deal desk — is a large fixed-and-variable cost structure. If you add it before there is enough sales-appropriate demand to keep it productive, your blended CAC balloons, payback stretches from months to years, and the efficient growth story you told investors breaks. You have taken a capital-efficient company and made it capital-intensive before the revenue justified it.

**Reps fight the free tier.** A sales team with quota and no PQL engine will, rationally, look at the free and self-serve base as un-monetized inventory and push to gate it. This is the single most insidious early-sales failure because it is *self-reinforcing*: gating features creates more "contact sales" volume, which makes the sales team look productive, which justifies more sales hiring, which creates more pressure to gate — all while the actual top-of-funnel conversion rate quietly erodes. By the time leadership notices, the PLG engine has been structurally damaged and is hard to rebuild because both the product and the customer expectations have changed.

**The founder gets distracted.** Enterprise deals are seductive. They are big, they are concrete, they come with logos and meetings and the feeling of "real" business. A founder who adds sales too early often gets pulled into being the de facto enterprise closer, spending their highest-leverage time on a handful of slow deals instead of on the product and the PLG engine that is still generating the overwhelming majority of revenue and value. The opportunity cost is enormous and invisible.

The deeper point: adding sales too early is not just "a bit premature" — it can be *irreversible*. You cannot easily un-hire a team, un-change a comp culture, un-gate a free tier, or un-distract a founder. The asymmetry is the whole argument for the disciplined signal threshold: waiting one extra quarter costs you a quarter of enterprise revenue; moving one quarter too early can cost you the engine.

## The Risk Of Adding Sales Too Late

The opposite error is just as real, and because the PLG community culturally over-valorizes "pure" PLG, it is arguably the more *common* error among disciplined operators.

**You leave enterprise revenue on the table — permanently.** Enterprise demand does not wait. When a 3,000-person company has a real need and your funnel offers no door, they do not pause their initiative until you build a sales team. They buy something else. And enterprise switching costs being what they are, once a competitor lands that account top-down, you are likely locked out for years. Every quarter you delay past the real signal threshold is not a deferred opportunity — it is a set of permanently lost accounts.

**You churn your whales from neglect.** The largest accounts in a PLG base are the ones most exposed to "nobody owns the relationship" risk. They have the most stakeholders, the most complex renewals, the most competitive attention. Run them through the same automated lifecycle as a 5-seat account for too long and you will lose them at renewal — and because they are power-law revenue, losing a handful can erase a quarter of net new growth. Adding sales too late often shows up first as a string of "surprising" enterprise churns.

**Competitors capture the segment and then come downmarket.** This is the strategic endgame risk. A competitor that builds the enterprise motion you delayed does not just take the enterprise accounts — they use that revenue and those reference logos to fund a move *down* into your mid-market and SMB core. You wake up to find the company you thought you were beating on product is now beating you on go-to-market across the whole market, having used the enterprise segment you ceded as the beachhead.

**The NRR ceiling becomes a valuation ceiling.** A company stuck at 108% NRR because it never built sales-led expansion is not just leaving revenue uncaptured — it is structurally capped on the metric investors weight most heavily for SaaS. The cost of "too late" eventually shows up not just in lost deals but in a lower multiple on every dollar you do have.

The honest framing: "too early" and "too late" are *both* failure modes, and the disciplined signal threshold exists precisely because the instinct to avoid one error pushes you straight into the other. Pure-PLG-purist culture pushes good operators toward "too late." Logo-envy and board pressure push them toward "too early." The 7-signal, two-quarter, three-plus rule is the antidote to both instincts.

## PLG Metrics That Signal Readiness

Beyond the 7 trigger signals, there is a set of *quantitative* metrics that, watched together, tell you whether the PLG engine is healthy enough to overlay sales on — because adding sales to an *unhealthy* PLG engine just hides the underlying problem behind sales spend.

**Self-serve conversion rate.** The percentage of signups (or activated accounts) that become paying customers without human help. If this is healthy and stable, the engine works and sales is an *addition*. If it is declining, fix the funnel before you add sales — otherwise you are papering over an activation or value problem with expensive humans.

**Time-to-value (TTV).** How fast a new account reaches the "aha." Short, consistent TTV is the foundation of PLG; it is also what makes PQLs trustworthy, because a PQL is only meaningful if accounts reliably *reach* value. Lengthening TTV is a readiness red flag.

**Net revenue retention.** The master metric. Climbing NRR with healthy gross retention says the base is a growth engine and sales-led expansion will amplify it. NRR plateauing despite good product is the signal that the *expansion* you can capture without humans is exhausted — the most reliable single trigger for the sales-led expansion layer.

**Enterprise inbound percentage.** The share of new accounts that are enterprise-shaped. This is both a trigger signal and a readiness metric: it tells you whether there is a real, self-sustaining stream of sales-appropriate demand, which is the precondition for an overlay paying back.

**Usage-without-payment cohorts.** The size and behavior of the cohort of accounts with deep, sustained usage that are not paying (or not paying enough). A large, growing such cohort is simultaneously evidence that the product creates real value and evidence that the *motion* is failing to capture it — which is exactly the gap a sales overlay fills. If this cohort is small, the overlay has little to harvest.

Watched together, these five answer the gating question: *is the PLG engine healthy and is there sales-appropriate demand it cannot capture?* Both must be true. A healthy engine with no un-captured demand means stay pure PLG. An unhealthy engine with lots of "demand" means fix the product/funnel, because that demand is an illusion created by a leaky funnel. A healthy engine *with* genuine un-captured enterprise and expansion demand is the green light.

## The Sales Overlay Cost Model

Before building any overlay layer, model the cost honestly, because the most common financial mistake is treating the first rep's salary as the cost when the real cost is three to five times that.

**The first AE: fully loaded.** Base plus on-target commission is only the start. Add benefits and payroll overhead, ramp time (a new rep in a new motion is often 3-6 months from full productivity, and you pay full freight the whole time), and the management time to onboard and coach them. A first AE with a $120K-$160K base and matching variable realistically costs $250K-$350K all-in in year one once ramp and overhead are included.

**Sales-assist tooling.** A CRM (or a real configuration of the one you have), a sales engagement layer, call recording/conversation intelligence, scheduling, and a deal desk process. This is typically $15K-$50K/year early on and scales with headcount.

**PQL infrastructure.** This is the cost most companies forget and it is foundational: the product analytics instrumentation, the data pipeline from product into the CRM, the PQL scoring model, and the RevOps time to build and maintain it. Depending on whether you build or buy, this is $30K-$150K+ in year one between tooling and the engineering/analytics time it consumes. Critically, **this cost exists whether or not the overlay works** — it is the price of admission, and it should be partially built *before* the first hire.

**Payback timeline.** The honest model: the first overlay layer is usually *net cost-negative for the first two to four quarters*. You are paying for the rep, the tooling, the infrastructure, and the ramp before the converted-PQL revenue catches up. A well-sequenced sales-assist or sales-led expansion layer typically reaches payback in 9-15 months — *if* it is fed by a real PQL engine. A full enterprise overlay built without that engine can take 24-36 months or never pay back at all. The cost model's real purpose is to force the question: *do we have enough PQL volume and enough enterprise demand to make this layer productive fast enough?* If the answer is uncertain, the answer is "start with the lighter layer."

## Tooling For PLG + Sales

The tooling stack for a PLG + sales hybrid has three layers, and the middle layer — the one most companies under-build — is what makes the whole thing work.

**Product analytics and event instrumentation** is the foundation: the system that captures the in-product behaviors (seats added, features used, API calls, invites sent, integrations connected) that the PQL score is built from. Without clean, reliable, well-modeled product event data, every layer above is built on sand.

**The PQL layer** is the connective tissue, and a category of tools exists specifically for it: **Pocus, Endgame, Calixa, HeadsUp, and Correlated** are the prominent examples of "product-led sales" platforms. What they do is sit between product analytics and the CRM: they ingest product usage data, let you define and score PQLs, surface those PQLs to reps with the behavioral context attached, and push the signals and routing into the CRM as tasks and alerts. The build-vs-buy decision here is real — a strong data team can build PQL scoring on the warehouse — but for most companies at the $5M-$50M stage, buying this layer is faster and the vendors have encoded a lot of hard-won pattern knowledge. The non-negotiable is that *some* system owns the PQL definition, scoring, and routing.

**The CRM and sales execution layer** is where reps actually work: the CRM (the system of record for accounts, opportunities, and attribution), the sales engagement tooling, conversation intelligence, and the deal desk/CPQ process for the sales-assisted and enterprise tiers. The critical design requirement is that the CRM must be able to *receive and display* the PQL context — a rep opening an account record should see the score, the triggering behaviors, the account firmographics, and the suggested play, all in one place.

The architecture that ties it together is **the data pipeline from product to CRM**, owned by RevOps. The pipeline's job: product events → analytics → PQL scoring → CRM records and tasks → attribution computation → back to growth and product as feedback. When this pipeline is solid, the hybrid runs as one system. When it is broken or manual, growth and sales operate as two disconnected companies sharing a logo. Invest in the pipeline before you invest in headcount — a rep with a great pipeline of context-rich PQLs is worth three reps guessing.

## The Bottoms-Up + Top-Down Dual Motion

The end state every successful PLG + sales company converges on is a genuine **dual motion**: the product runs bottoms-up, planting footprints across the market at PLG economics; sales runs top-down, harvesting and expanding those footprints into enterprise relationships at sales-led ACVs — and the two are *connected*, each making the other more effective.

What "connected" means in practice. The bottoms-up motion is not just a lead source for the top-down motion — it is what makes the top-down motion *cheap*. Every account the product lands is a warm enterprise prospect: there are users, there are champions, there is usage data, there is a footprint to point at. The top-down motion, in turn, is not just extracting value from the bottoms-up motion — it *strengthens* it: enterprise deals bring SSO, security, admin, and governance features that make the product more adoptable by the *next* enterprise's teams; enterprise reps feed back the objections and requirements that improve the product's enterprise-readiness; enterprise reference logos make the bottoms-up adoption inside other large companies easier.

The flywheel: product plants seeds → seeds grow into footprints → PQL engine identifies which footprints are enterprise-convertible → sales harvests and expands them top-down → enterprise revenue funds more product investment and brings enterprise features → those features make the product land *better* bottoms-up in the next enterprise → more seeds. When this loop is running, the company has the CAC efficiency of PLG *and* the ACV and forecastability of sales-led, which is the structurally strongest position in SaaS go-to-market and is why the hybrid wins at scale.

The reason this is the *end state* and not the *starting point* is the whole thesis of this entry: you cannot build the dual motion all at once. You sequence it. PLG first and alone until the signals fire. Then the lightest overlay the signals justify. Then, as the PQL engine proves out, the heavier layers. The dual motion is what you are *building toward* — and the discipline is to add each layer only when the signals and the PQL engine are ready to support it, so that each layer strengthens the flywheel instead of jamming it.

## 5-Year Outlook

The PLG-breaks calculus is itself changing, and a leadership team making overlay decisions should factor in how the next five years shift the picture.

**AI-driven PLG compresses time-to-value and raises the PLG ceiling.** As AI features make products faster to onboard, more self-configuring, and more capable of guiding a user to value, the *self-serve-able* portion of the market expands. Things that used to require an implementation consultant or a sales engineer can increasingly be self-served. This pushes the PLG ceiling *up* — meaning some companies that would have needed a sales overlay at $10M ARR a few years ago can run pure PLG longer. The signal threshold does not change, but where it gets hit moves.

**Agent-led onboarding changes activation economics.** AI agents that walk a new account through setup, configuration, and integration — answering questions, doing the work — attack exactly the friction that used to require sales-assist. Some of what sales-assist does today (unblocking stuck self-serve deals, answering pre-sales questions, hand-holding through setup) will be absorbed by product-embedded agents. The sales-assist layer does not disappear, but it gets *lighter* and shifts toward the genuinely human parts: relationship, negotiation, complex procurement, executive trust.

**The enterprise overlay stays human — but is better armed.** The parts of enterprise selling that are fundamentally human (trust, multi-threading, navigating politics, negotiating complex contracts) do not get automated away. But AI dramatically improves the *PQL engine* feeding the overlay: better behavioral prediction, better account prioritization, better next-best-action, better research and prep. The enterprise overlay of 2029 is the same size or smaller per dollar of revenue, but far more precisely targeted.

**The PQL becomes more sophisticated and more central.** As AI improves the modeling of in-product behavior, the PQL shifts from a hand-weighted score to a continuously-learning predictive model, and it becomes the central nervous system of the whole revenue org. Companies that built a real PQL engine early will have a compounding data advantage.

**The net effect on the calculus:** the *principle* is unchanged — PLG breaks at a signal threshold, you layer the lightest overlay the signals justify, and you sequence it so it strengthens the engine. But AI pushes the PLG ceiling higher, makes the lighter layers lighter, makes the PQL engine smarter, and keeps the genuinely human parts of enterprise selling human. The companies that win the next five years are the ones that use AI to extend their PLG runway *and* to make their eventual overlay more precise — not the ones that use the AI hype as an excuse to either never add sales or to add it without discipline.

## Final Framework

Pull it together into a single decision framework.

**Step 1 — Run the 7-signal check.** Count, do not feel. (1) Enterprise inbound >10% of signups. (2) Self-serve accounts hitting expansion ceilings. (3) Competitors winning big deals you should win. (4) Usage-rich accounts not converting. (5) Security/procurement questions you cannot self-serve answer. (6) ACV ceiling on self-serve plans. (7) Board pressure for predictable enterprise revenue. **Three or more firing for two consecutive quarters, with at least one demand signal, is the trigger.** Two or fewer: stay pure PLG and keep watching.

**Step 2 — Check the readiness metrics.** Self-serve conversion healthy and stable. TTV short and consistent. NRR's behavior understood. Enterprise inbound % real. Usage-without-payment cohort sized. If the *engine* is unhealthy, fix the funnel first — do not overlay sales on a leaking PLG motion.

**Step 3 — Build the PQL engine before the team.** Do the cohort analysis, ship a v1 PQL score, instrument the product-to-CRM pipeline. The PQL engine is the precondition for every overlay layer; without it you are bolting sales-led economics onto a PLG company.

**Step 4 — Choose the lightest layer the signals justify, and sequence up.** *Sales-assist* first (reps unblock and close stalled self-serve and inbound; own no motion) when the signals are mostly about friction and stalled conversions. *Sales-led expansion* next (reps own growth of PLG-acquired accounts) when NRR is plateaued and there is un-captured expansion in the base. *Full enterprise overlay* last (a separate top-down team) — and only once the PQL engine is feeding it warm enterprise pipeline. Never start with the heaviest layer.

**Step 5 — Hire one PLG-native AE, not a VP and a team.** Revenue threshold ($2M-$5M ARR, efficient) and signal threshold both met. Hire a consultative, product-fluent, inbound/PQL-comfortable AE — not a cold-outbound hunter, not a sales-led VP. Have them prove the motion and write the playbook before you scale.

**Step 6 — Design org, comp, and attribution to compound, not compete.** Growth owns the funnel up to the PQL; sales owns from the PQL forward; RevOps owns the seam. Comp reps at a lower rate on PQL-sourced revenue than rep-sourced, so the PQL queue is the easiest money on the plan. Pre-agree the attribution model — product-sourced, sales-sourced, sales-converted (shared), sales-influenced (overlay tag) — and celebrate the shared bucket.

**Step 7 — Build toward the dual motion.** The end state is product planting bottoms-up and sales harvesting top-down, connected by the PQL engine, each strengthening the other. Get there by sequencing — adding each layer only when the signals and the engine are ready — so every layer strengthens the flywheel.

**And the discipline that holds it all together:** "too early" and "too late" are both failure modes. Too early crushes the unit economics, starts the free-tier war, and distracts the founder — and is hard to reverse. Too late leaves enterprise revenue permanently uncaptured, churns the whales, and cedes the segment to a competitor who then comes downmarket. The 7-signal, two-quarter, three-plus rule, combined with "build the PQL engine first" and "layer the lightest model the signals justify," is the antidote to both instincts. PLG does not break at a revenue number. It breaks at a signal threshold — and the job is to read the signals honestly and respond in proportion.

`;

const flow = `

## The 7 Trigger Signals To Overlay Model Decision Tree

\`\`\`mermaid
flowchart TD
  A[PLG Company $5M-$150M ARR] --> B{Run The 7-Signal Check}
  B --> S1[Signal 1 Enterprise Inbound Over 10 Percent]
  B --> S2[Signal 2 Self-Serve Accounts Hitting Expansion Ceilings]
  B --> S3[Signal 3 Competitors Winning Big Deals You Should Win]
  B --> S4[Signal 4 Usage-Rich Accounts Not Converting]
  B --> S5[Signal 5 Security Procurement Questions Cannot Self-Serve]
  B --> S6[Signal 6 ACV Ceiling On Self-Serve Plans]
  B --> S7[Signal 7 Board Pressure For Predictable Enterprise Revenue]
  S1 --> C{Three Or More Signals Firing Two Quarters}
  S2 --> C
  S3 --> C
  S4 --> C
  S5 --> C
  S6 --> C
  S7 --> C
  C -->|Two Or Fewer| D[Stay Pure PLG Keep Watching Signals]
  C -->|Three Plus With A Demand Signal| E{Check Readiness Metrics}
  E -->|Engine Unhealthy| F[Fix Funnel And Activation First Do Not Overlay Sales]
  E -->|Engine Healthy| G[Build PQL Engine Before Any Hire]
  G --> H{Which Signals Dominate}
  H -->|Friction And Stalled Conversions Signals 1 4 5| I[Sales-Assist Model Reps Unblock And Close Own No Motion]
  H -->|Flat NRR And Un-Captured Expansion Signals 2 6| J[Sales-Led Expansion Model Reps Own Growth Of PLG Accounts]
  H -->|Top-Down Demand PLG Cannot Reach Signals 3 7| K[Full Enterprise Overlay Separate Team Sells Top-Down]
  I --> L[Hire One PLG-Native AE Prove The Motion]
  J --> L
  K --> M{Is PQL Engine Feeding Warm Enterprise Pipeline}
  M -->|No| N[Do Not Build Enterprise Overlay Yet Start Lighter]
  M -->|Yes| L
  L --> O[Design Org Comp Attribution To Compound]
  O --> P[Sequence Up To The Dual Motion]
\`\`\`

## The PQL Flow From Signup To Conversion And Expansion

\`\`\`mermaid
flowchart LR
  A[Product Signup] --> B[Onboarding And Activation]
  B --> C{Reached Time-To-Value Aha}
  C -->|No| C1[Lifecycle Nudges And In-App Guidance]
  C1 --> B
  C -->|Yes| D[Usage Scoring Begins]
  D --> D1[Seats And Users Added Velocity]
  D --> D2[Feature Depth And Breadth]
  D --> D3[API Usage And Endpoints]
  D --> D4[Team Invites Especially Senior Titles]
  D --> D5[Integrations Connected]
  D1 --> E[Composite PQL Score Plus Firmographic Multiplier]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  E --> F{Crossed PQL Threshold}
  F -->|No| F1[Stay In Self-Serve Motion Keep Scoring]
  F1 --> D
  F -->|Yes| G[PQL Fires Into CRM With Behavioral Context]
  G --> H{PQL Tier Routing}
  H -->|PQL-Convert| I[Sales-Assist Rep Closes Stalled Conversion]
  H -->|PQL-Expansion| J[Expansion AE Runs Deliberate Growth Play]
  H -->|PQL-Enterprise| K[Enterprise Overlay Runs Top-Down Process]
  I --> L[Converted To Paid]
  J --> M[Net Expansion ARR Cross-Team Land]
  K --> N[Enterprise Agreement SSO Security Custom Contract]
  L --> O[Attribution Tagged Sales-Converted Shared Credit]
  M --> O
  N --> O
  O --> P[Feedback To Growth And Product Re-Fit PQL Model]
  P --> D
\`\`\`

`;

const src = `

## Sources

1. **OpenView Partners — Product-Led Growth research and the PLG index** — The foundational body of work defining PLG as a go-to-market category, the PLG-to-sales transition, and benchmarks for PLG SaaS companies.
2. **Kyle Poyar — "Growth Unhinged" and OpenView product-led sales writing** — Practitioner analysis of product-led sales, PQL definition, and when PLG companies layer in sales.
3. **Wes Bush — "Product-Led Growth: How to Build a Product That Sells Itself"** — Canonical text on PLG mechanics, free tier design, and the self-serve funnel.
4. **Elena Verna — PLG and growth advisory writing (Reforge, Lenny's Newsletter, Amplitude)** — Practitioner frameworks on PLG ceilings, the product-led sales motion, and growth-vs-sales org design.
5. **Bain & Company / McKinsey — SaaS go-to-market and net revenue retention benchmarks** — Industry data on NRR distributions, expansion economics, and sales efficiency.
6. **SaaS Capital and KeyBanc Capital Markets SaaS Surveys** — Benchmark data on CAC, payback periods, NRR, and growth efficiency across SaaS company stages.
7. **Slack Technologies S-1 Filing (2019)** — Documentation of Slack's bottoms-up adoption model and the layering of Slack Enterprise Grid and an enterprise sales motion.
8. **Notion go-to-market coverage 2022-2024 (press, podcasts, and Notion communications)** — Documentation of Notion's deliberate enterprise sales build and enterprise feature development.
9. **Figma go-to-market analysis and Adobe acquisition disclosures** — Documentation of Figma's collaborative bottoms-up growth loop and enterprise motion.
10. **Datadog Inc. S-1 and quarterly investor materials (NASDAQ: DDOG)** — Documentation of Datadog's PLG + sales hybrid, land-and-expand motion, and net revenue retention.
11. **Atlassian investor materials and go-to-market history** — Long-running example of a low-touch PLG motion later complemented by enterprise sales and channel.
12. **HubSpot investor materials and freemium-to-sales evolution** — Example of a freemium PLG motion layered with a substantial sales organization.
13. **Pocus — Product-led sales platform documentation** — Product category reference for PQL scoring, signal surfacing, and product-to-CRM routing.
14. **Endgame — Product-led sales platform documentation** — Product category reference for account scoring and rep-facing PQL workflows.
15. **Calixa, HeadsUp, and Correlated — Product-led sales tooling** — Additional reference points for the PQL infrastructure tooling category.
16. **Amplitude and Mixpanel — Product analytics platform documentation** — Reference for the product event instrumentation layer underpinning PQL scoring.
17. **Segment / customer data infrastructure documentation** — Reference for the product-to-CRM data pipeline architecture.
18. **Reforge — Growth, monetization, and PLG program materials** — Practitioner curricula on PLG, monetization architecture, and growth-vs-sales organizational design.
19. **First Round Review and a16z go-to-market essays** — Operator and investor essays on sequencing sales into PLG companies and the first sales hire profile.
20. **Lenny's Newsletter — PLG, PQL, and sales-overlay practitioner interviews** — Practitioner case studies on when and how PLG companies add sales.
21. **Gainsight and Customer Success industry research** — Reference for the CS function's role and segmentation in hybrid PLG + sales orgs.
22. **Winning by Design — revenue architecture and bowtie model material** — Framework reference for revenue org design across acquisition, conversion, and expansion.
23. **ProfitWell / Paddle pricing and retention research** — Benchmark data on freemium conversion, pricing tier architecture, and NRR drivers.
24. **SaaStr — go-to-market scaling content** — Practitioner benchmarks on first sales hires, comp design, and scaling revenue orgs in SaaS.

`;

const num = `

## Numbers

**The PLG-Breaks Signal Thresholds**
- Enterprise inbound trigger level: ~10%+ of signups (ignorable at 3-5%)
- Trigger rule: 3 or more of the 7 signals firing for 2 consecutive quarters
- At least 1 of the firing signals should be a demand signal, not only internal
- Self-serve revenue growth at the ceiling: decelerating to ~4-6% QoQ from prior 12-20% QoQ
- Power-law revenue concentration in a typical PLG base: top 5-10% of accounts = 40-60% of revenue
- Stalled-expansion flag: accounts at 80%+ of a plan's seat/usage limit, no upgrade in 60+ days

**NRR Benchmarks**
- Healthy maturing PLG NRR trajectory: climbing toward 120-135%
- The PLG plateau signal: NRR stuck at 105-115% despite a good product
- Sales-led expansion layer impact: can move NRR from a stuck ~110% to 125-135%
- NRR is the single best aggregate trigger because it nets churn, contraction, and expansion

**PQL Economics**
- PQL conversion rate in well-run orgs: 25-40%
- MQL conversion rate for comparison: 1-5%
- PQL acquisition cost: near zero (product already acquired and activated the account)
- PQL handoff standard: a rep should know why the account is on their list within ~90 seconds
- PQL model refresh cadence: re-fit every ~2 quarters against fresh closed-won/closed-lost data
- PQL behavioral buckets: 5 (seats/users, feature depth, API usage, team invites, integrations)
- Firmographic fit applied as a multiplier, not an additive component

**Motion Economics Comparison**
- Pure PLG payback period: typically 6-14 months; low CAC; structural ACV ceiling
- Sales-led payback period: typically 18-30 months; high CAC; high ACV; committable forecast
- PLG + sales hybrid: PLG CAC efficiency on the long tail + sales-led ACV on the enterprise head
- Hybrid advantage: the product pre-qualifies and pre-warms every account the overlay touches

**The Three Overlay Models**
- Sales-assist: lightest layer; reps unblock and close; own no motion; run with 1-2 people
- Sales-led expansion: reps own growth of PLG-acquired accounts; comped on net expansion ARR
- Full enterprise overlay: separate top-down team; own AEs, SE, deal desk; built last
- Enterprise overlay deal cycle: 3-9 months; ACV $75K-$500K+

**First Sales Hire Thresholds**
- Revenue threshold: $2M-$5M ARR, growing efficiently (range depends on ACV and inbound mix)
- Signal threshold: 3+ of 7 signals, 2 consecutive quarters, 1+ demand signal
- Hire count: exactly 1 individual contributor first - not a VP, not a team
- New rep ramp time in a new motion: typically 3-6 months to full productivity
- First hire profile: consultative, product-fluent, inbound/PQL-comfortable, NOT a cold-outbound hunter

**Pricing Tier Architecture**
- 4 altitudes: Free -> Self-Serve Paid -> Sales-Assisted -> Enterprise
- Each tier boundary should map to a motion boundary
- "Talk to sales" appears as an option at the sales-assisted tier, as the only path at enterprise
- Self-serve paid typically has 1-3 sub-tiers

**Comp Design Ratios (illustrative)**
- Commission on PQL-sourced / self-serve-influenced revenue: e.g. ~6-8%
- Commission on rep-sourced cold revenue: e.g. ~12-15%
- Expansion AE: comped on net expansion ARR with renewal as a gate
- Enterprise overlay: closer to traditional sales-led plan, modest haircut for pre-existing footprint
- Design principle: the PQL queue must be the easiest money on the plan (lower rate, high volume/conversion)

**The Attribution Model**
- 3 mutually exclusive categories: product-sourced, sales-sourced, sales-converted (PQL, shared)
- 1 overlay tag: sales-influenced (never double-counted into the revenue total)
- Rule: decide attribution rules before the quarter, not after

**Sales Overlay Cost Model**
- First AE base + variable: ~$120K-$160K base with matching OTE
- First AE fully loaded year one (incl. ramp, overhead, management): ~$250K-$350K
- Sales-assist tooling: ~$15K-$50K/year early, scales with headcount
- PQL infrastructure year one (tooling + eng/analytics time): ~$30K-$150K+
- First overlay layer: net cost-negative for the first ~2-4 quarters
- Well-sequenced sales-assist / sales-led expansion payback: ~9-15 months (if fed by a real PQL engine)
- PQL-less enterprise overlay payback: ~24-36 months or never

**Tooling Stack Layers**
- Layer 1 - product analytics / event instrumentation (e.g. Amplitude, Mixpanel)
- Layer 2 - PQL / product-led sales platform (Pocus, Endgame, Calixa, HeadsUp, Correlated)
- Layer 3 - CRM + sales execution (CRM, sales engagement, conversation intelligence, deal desk/CPQ)
- Connective tissue - the product-to-CRM data pipeline, owned by RevOps
- Build-vs-buy on the PQL layer: most $5M-$50M companies should buy

**Org Design**
- Growth owns: everything up to and including the PQL (acquisition, activation, self-serve conversion/expansion, pricing page, the PQL model)
- Sales owns: everything from the PQL forward (PQL conversion, expansion, enterprise)
- RevOps owns: the seam - data pipeline, attribution model, routing logic
- One revenue leader (CRO / VP Revenue) accountable for the whole handoff working
- Solo-founder operational wall in pure PLG before overlay decisions: usually surfaces $5M-$50M ARR

**Readiness Metrics Gate (all watched together)**
- Self-serve conversion rate: healthy and stable (declining = fix funnel first)
- Time-to-value: short and consistent (lengthening = red flag)
- Net revenue retention: trajectory understood
- Enterprise inbound %: real and self-sustaining
- Usage-without-payment cohort: sized (large + growing = harvestable; small = little to harvest)

**5-Year Outlook Shifts**
- AI-driven PLG: pushes the PLG ceiling UP - some companies run pure PLG longer
- Agent-led onboarding: makes the sales-assist layer lighter
- Enterprise overlay: stays human, but better-targeted by a smarter PQL engine
- PQL: shifts from hand-weighted score to continuously-learning predictive model

`;

const counter = `

## Counter-Case: When Adding A Sales Overlay Is The Wrong Move

The entire thesis above is conditional. The signals, the sequencing, the overlay models — all of it assumes that the underlying conclusion ("PLG has hit its ceiling") is actually true. Very often it is not, and the founder reaching for a sales team is misreading the situation. Here is the honest counter-case: the conditions under which adding a sales overlay is the wrong move, even when it feels right.

**Counter 1 — PLG still has runway and the "ceiling" is an illusion of impatience.** A growth deceleration from 18% to 11% QoQ is still strong growth. A founder who panics at the first derivative bending and concludes "PLG is breaking" is often just watching a healthy company mature. Before declaring the ceiling, ask: have you actually exhausted the PLG levers? Onboarding optimization, activation experiments, pricing and packaging changes, new self-serve expansion paths, new acquisition loops, international self-serve expansion, new product surfaces — these are cheaper, faster, and lower-risk than a sales team, and most PLG companies have not come close to exhausting them. If you can still move the self-serve numbers with product and growth work, PLG has runway and a sales overlay is premature. The signal threshold exists precisely to stop "impatience" from masquerading as "the ceiling."

**Counter 2 — The real problem is product activation, not sales coverage.** This is the most common and most expensive misdiagnosis. The symptoms of "PLG breaking" and the symptoms of "PLG never fully worked" look nearly identical from the revenue line: slow conversion, stalled expansion, accounts that do not grow. But the cause is opposite. If usage-rich accounts are not converting because the product genuinely has not delivered enough value, or if time-to-value is long and inconsistent, or if self-serve conversion is *declining* rather than plateauing — the problem is in the product and the funnel, not in the absence of humans. Adding a sales team here does something insidious: it *hides* the activation problem behind sales spend. Revenue ticks up because reps are manually dragging accounts across the line, leadership concludes "see, we needed sales," and the underlying product weakness never gets fixed — it just gets permanently more expensive to paper over. The diagnostic discipline: if the readiness metrics (self-serve conversion, TTV) are unhealthy, the answer is *never* a sales overlay. Fix the engine first.

**Counter 3 — A sales overlay's overhead breaks the unit economics that made PLG work.** PLG's defining advantage is capital efficiency: low CAC, fast payback, the ability to grow without a massive go-to-market cost structure. A sales overlay is, unavoidably, a large cost structure — and if the sales-appropriate demand is not genuinely there in sufficient volume, that cost structure does not get absorbed. Blended CAC rises, payback stretches, gross margins compress, and the efficient-growth story that made the company attractive (to customers, to investors, to acquirers) breaks. The cruel part is the asymmetry: the costs land immediately and the revenue lands late, so for two to four quarters you are simply a less efficient company, and if the demand was not really there, you never climb back out. A founder should be able to answer, with data, "is there enough sales-appropriate demand to keep an overlay productive fast enough?" — and if the answer is "I think so" rather than "the signals say yes," the overlay is a bet against the thing that was working.

**Counter 4 — The founder is chasing enterprise vanity revenue, not following the signals.** This is the counter-case that is hardest to see from inside, because it does not feel like vanity — it feels like ambition. A competitor announces a marquee logo. A board member asks "what's our enterprise story?" An investor mentions that "the best companies go upmarket." A founder reads about Slack and Figma and wants that arc. None of those are signals. They are *narratives*, and they pull founders into building a sales motion to satisfy an identity ("we're an enterprise company now") rather than to capture demonstrated demand. The tell: the company is adding sales because of what *leadership* wants the company to be, not because of what *the market* is doing — Signal 7 (board pressure) is firing alone, with no demand signal alongside it. The result is predictable: a few slow, unprofitable marquee deals, roadmap and founder attention diverted to a handful of large prospects, and the actual PLG engine — still the overwhelming majority of revenue and the actual source of the company's value — neglected into decay. Enterprise revenue is a fine *outcome* of following signals; it is a destructive *goal* when pursued for the logo.

**Counter 5 — The market genuinely does not have an enterprise head.** Some products serve markets that are broad but structurally shallow — the buyer is always the user, the use case never scales to a company-wide deployment, there is no procurement-driven top-down purchase to be had at any size. For these companies, PLG is not a stage to grow out of; it is the *correct and permanent* motion. Forcing a sales overlay onto a market with no enterprise head produces a sales team with nothing enterprise-shaped to sell, which then — exactly as in the failure patterns above — starts gating the free tier and inventing "enterprise" tiers to justify itself, damaging the PLG engine to feed a motion the market never asked for. The honest question: is there *really* a concentrated, top-down-buying enterprise segment in this market, or is the company just broad? If it is just broad, the answer is to be the best pure-PLG company in that market, not a mediocre hybrid.

**Counter 6 — You have not built the PQL engine, and adding sales without it is adding the wrong thing.** Even when the signals genuinely justify an overlay, adding the *sales team* before the *PQL engine* is a sequencing error severe enough to count as a counter-case. Without the PQL engine, the sales team has no warm pipeline, cold-prospects at sales-led CAC, ignores the product footprint that is the company's actual advantage, and the attribution fights begin immediately. "Add a sales overlay" is shorthand for "build the PQL-fed motion" — and if you are not ready or willing to build the engine first, you are not actually ready to add sales. Adding the team alone is adding the cost without the mechanism.

**The honest verdict.** A sales overlay is the right move when the signals genuinely fire, the PLG engine is healthy, there is a real enterprise head in the market, and you build the PQL engine first and layer the lightest model the signals justify. It is the *wrong* move — and an actively destructive one — when PLG still has runway and you are just impatient, when the real problem is product activation and a sales team would only hide it, when the overhead would break the unit economics because the demand is not really there, when the founder is chasing a logo rather than following the market, when the market has no genuine enterprise head, or when you are not prepared to build the PQL engine that the whole motion depends on. The discipline of the 7-signal threshold is not bureaucracy. It is the specific mechanism that distinguishes "PLG has broken and needs a sales overlay" from "PLG is fine and I am about to break it."

`;

const links = `

## Related Pulse Library Entries

- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (How the prospecting layer of a sales overlay changes as AI absorbs SDR work.)
- **q9501** — How do you start a bookkeeping business in 2027? (Service-business GTM contrast — a fully sales-and-referral-led motion with no PLG analog.)
- **q9502** — How do you start a CPA firm in 2027? (Adjacent professional-services GTM; relationship-led acquisition contrast.)
- **q93-adjacent: PLG fundamentals** — When does a freemium tier help vs hurt growth? (Free-tier design is the foundation the overlay sits on.)
- **NRR and retention** — How do you move net revenue retention from 100% to 130%? (The metric that is the single best sales-overlay trigger.)
- **PQL mechanics** — How do you define and score a Product Qualified Lead? (Deep dive on the engine this entry treats as the connective tissue.)
- **Sales-assist motion** — How do you build a sales-assist team without breaking PLG? (Operational deep dive on the lightest overlay layer.)
- **Enterprise readiness** — What does a product need before it can sell enterprise? (SSO, SCIM, audit logs, SOC 2 — the prerequisites for the enterprise overlay.)
- **First sales hire** — Who should be the first salesperson at a PLG company? (Profile and timing deep dive.)
- **Comp design** — How do you comp reps on product-sourced revenue? (The attribution and commission-rate problem in detail.)
- **GTM attribution** — How do you attribute revenue across product, marketing, and sales? (The three-category-plus-overlay model expanded.)
- **Pricing architecture** — How do you design pricing tiers for a PLG + sales company? (Free to enterprise tier-and-motion mapping.)
- **Customer Success org design** — Should Customer Success report to sales? (The CS-vs-expansion-sales boundary in a hybrid.)
- **RevOps** — When does a company need a RevOps function? (The function that owns the growth-sales seam.)
- **Sales hiring sequence** — When do you hire a VP of Sales vs an IC? (Why the IC comes first in a PLG overlay.)
- **Land and expand** — How do you build a land-and-expand motion? (Sales-led expansion mechanics.)
- **Bottoms-up GTM** — How do you build a bottoms-up go-to-market motion? (The PLG half of the dual motion.)
- **Top-down enterprise sales** — How do you build a top-down enterprise sales motion? (The sales half of the dual motion.)
- **Unit economics** — How do you model CAC and payback for a hybrid GTM company? (The cost-model discipline behind the overlay decision.)
- **AI and GTM** — How will AI agents change SaaS go-to-market by 2030? (The 5-year outlook context for the PLG-breaks calculus.)
- **Board management** — How do you manage board pressure for a GTM pivot? (Handling Signal 7 without letting it become the only signal.)
- **Product activation** — How do you fix a product activation problem? (The counter-case alternative when "PLG breaking" is misdiagnosed.)
- **Churn diagnosis** — Why are my biggest accounts churning? (The "neglected whales" symptom of adding sales too late.)
- **Growth deceleration** — Is my growth deceleration a ceiling or a fixable funnel problem? (The Counter 1 / Counter 2 diagnostic.)

`;

const tags = ['plg','product-led-growth','sales-overlay','go-to-market','pql','product-qualified-lead','saas','enterprise-sales','nrr','revenue-operations'];

const sources = [
  { title: 'OpenView Partners — Product-Led Growth research and the PLG index', url: 'https://openviewpartners.com' },
  { title: 'Wes Bush — Product-Led Growth: How to Build a Product That Sells Itself', url: 'https://productled.com' },
  { title: 'Kyle Poyar — Growth Unhinged (product-led sales and PQL writing)', url: 'https://www.growthunhinged.com' }
];

const notes = {
  s6: 'Added 24 cited sources spanning the PLG canon (OpenView, Wes Bush, Kyle Poyar, Elena Verna, Reforge), SaaS benchmark data (Bain, McKinsey, KeyBanc, SaaS Capital, ProfitWell/Paddle), public-company go-to-market documentation for the five case studies (Slack S-1, Notion 2022-2024 coverage, Figma, Datadog S-1, Atlassian, HubSpot), the product-led sales tooling category (Pocus, Endgame, Calixa, HeadsUp, Correlated), the product analytics and data pipeline layer (Amplitude, Mixpanel, Segment), and operator/investor GTM essays (First Round, a16z, Lenny, SaaStr, Winning by Design, Gainsight).',
  s7: 'Added comprehensive numerical analysis: the 7-signal trigger thresholds (enterprise inbound ~10%+, 3-of-7 for 2 quarters), NRR benchmarks (healthy 120-135%, plateau signal 105-115%, expansion-layer lift to 125-135%), PQL economics (25-40% conversion vs 1-5% MQL, near-zero CAC, ~90-second handoff standard, 2-quarter model refresh), motion economics comparison (PLG 6-14mo payback vs sales-led 18-30mo), the three overlay models, first-hire thresholds ($2M-$5M ARR + signal threshold, 1 IC not a team, 3-6mo ramp), pricing tier architecture (4 altitudes), comp ratios (6-8% PQL vs 12-15% cold), the attribution model (3 categories + 1 overlay tag), the cost model (first AE ~$250K-$350K loaded, PQL infra $30K-$150K+, 9-15mo payback if fed by a PQL engine vs 24-36mo without), tooling stack layers, org-design ownership boundaries, and the readiness-metrics gate.',
  s8: 'Added 6-part counter-case on when a sales overlay is the WRONG move: (1) PLG still has runway and the "ceiling" is impatience misreading healthy maturation; (2) the real problem is product activation not sales coverage, and a sales team dangerously hides the activation problem behind spend; (3) the overlay overhead breaks the unit economics that made PLG work because the sales-appropriate demand is not genuinely there; (4) the founder is chasing enterprise vanity revenue / a marquee logo rather than following the signals (Signal 7 firing alone); (5) the market genuinely has no enterprise head and PLG is the correct permanent motion; (6) the PQL engine has not been built and adding the sales team without it is adding cost without the mechanism. Closes with an honest verdict tying the counter-case back to the 7-signal discipline.',
  s9: 'Cross-linked 24 related Pulse entries spanning PLG fundamentals and free-tier design, NRR/retention, PQL mechanics, the three overlay models (sales-assist, sales-led expansion, enterprise), enterprise readiness, first sales hire profile and timing, comp design, GTM attribution, pricing architecture, Customer Success org design, RevOps, land-and-expand, bottoms-up and top-down GTM, unit economics, the AI-and-GTM 5-year outlook, board management, and the counter-case diagnostics (product activation, churn diagnosis, growth-deceleration triage).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of "When does PLG break and need a sales overlay?" for CEO/CRO/head-of-growth audience at $5M-$150M ARR PLG SaaS companies. Two mermaid diagrams: (1) the 7-trigger-signals decision tree routing to sales-assist / sales-led expansion / full enterprise overlay; (2) the PQL flow from product signup through activation, usage scoring, the PQL threshold, tiered sales handoff, to conversion/expansion and model re-fit. Full coverage: the PLG-breaks symptoms, the 7 trigger signals with the 3-of-7/2-quarter rule, PLG vs sales-led vs hybrid economics, the PQL concept and 5-bucket scoring mechanics, the three overlay models (sales-assist, sales-led expansion, full enterprise overlay), org design (growth owns the funnel, sales owns from the PQL forward, RevOps owns the seam), comp design (lower rate on PQL-sourced revenue so the PQL queue is the easiest money), the attribution problem (3 categories + sales-influenced overlay tag), when and who to hire first (revenue + signal threshold, one PLG-native consultative AE not a sales-led VP), pricing tier architecture and "talk to sales" trigger design, Customer Success in a hybrid, 5 real case studies (Slack, Notion, Figma, Datadog, Airtable), 5 PLG-overlay failure archetypes, the risks of adding sales too early and too late, the readiness metrics, the cost model, the tooling stack, the bottoms-up + top-down dual motion end state, the 5-year AI outlook, a 7-step final framework, and a 6-part counter-case on when the overlay is the wrong move.'
};

runPolish({ id: 'q93', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
