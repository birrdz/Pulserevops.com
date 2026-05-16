// q9510 — At what ARR threshold should a Salesforce admin be a full-time hire vs a contractor vs an agency?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** ARR is the *wrong* primary variable for the Salesforce-admin staffing decision — it is a convenient proxy that is correct often enough to feel safe and wrong often enough to be expensive. The real driver is **org complexity** (user count, object count, integration count, automation volume, CPQ/multi-cloud presence) layered against **backlog depth** and **project pipeline**. Rough ARR anchors, used only as a starting sniff test: **under ~$2M ARR**, a fractional contractor (10-25 hrs/month at $75-$150/hr) or a founder-admin handles it; **$2M-$10M**, your first full-time admin ($90K-$135K base, ~$120K-$175K loaded) becomes defensible *if* the org is non-trivial, otherwise a strong contractor still wins; **$10M-$30M**, a full-time admin plus contractor overflow or a part-time senior is the norm; **$30M+**, you run an admin team, or one to two FT admins plus an agency for project work. But a $5M company carrying a brutal CPQ-plus-multi-cloud org needs full-time *immediately*, and a $50M company with a dead-simple single-cloud org can run on a contractor for years. **A full-time admin is for continuous steady-state work**: backlog that never empties, deep institutional knowledge, user enablement, change management, day-to-day support, owning the RevOps systems roadmap. **A contractor is for sub-scale orgs, overflow, specific skill gaps, and bridging the gap before a full-time hire.** **An agency is for builds**: implementations, CPQ rollouts, Classic-to-Lightning migrations, integration projects, multi-cloud — bursty specialist work a generalist admin cannot and should not do. The dominant end-state above ~$20M ARR is the **hybrid model**: a full-time admin owning steady-state, an agency retained for projects. The single most expensive option is the **accidental admin** — your COO, RevOps lead, or a sales-ops generalist doing config work at a fully-loaded cost of $180K-$300K+ while their actual job goes undone. Build vs maintain is the distinction everyone gets wrong: **agencies build, admins maintain**, and hiring a full-time admin to run a greenfield CPQ implementation, or retaining an agency to do daily user admin, both waste money. By 2030, AI-assisted admin work (Agentforce, AI flow builders, natural-language config) compresses the hours a given org needs by an estimated 30-50%, pushing the full-time threshold *upward* and making the fractional and managed-services models structurally stronger.`;

const core = `

## The Three Staffing Models Defined

Before any threshold conversation is useful, you have to be precise about what each of the three staffing models actually delivers, because the words "admin," "contractor," and "agency" hide enormous variance and most bad staffing decisions trace back to a category error — buying one thing while believing you bought another.

**The full-time admin employee.** A W-2 hire whose entire job is your Salesforce org. At the junior end this is someone holding the Salesforce Certified Administrator credential who handles user management, permission sets, page layouts, list views, reports and dashboards, basic flows, data hygiene, and the daily ticket queue from reps and managers. At the senior end — Advanced Administrator plus Platform App Builder, often with a few years of scar tissue — this person owns the data model, designs automation architecture, runs the release process across sandboxes, manages the AppExchange package portfolio, partners with RevOps on roadmap, and is effectively the systems conscience of the revenue org. What you are actually buying with a full-time admin is **continuity, context, and availability**: someone who remembers why the opportunity stage picklist has that weird value, who is in the Slack channel when a rep's deal is stuck, who notices that the new automation is double-firing before it corrupts three weeks of pipeline data. You are not primarily buying raw build throughput. A single full-time admin is a steady, compounding maintenance-and-improvement engine, not a project team.

**The independent contractor.** A 1099 individual — sometimes a moonlighting full-time admin, sometimes a career freelancer, sometimes a boutique solo consultant — engaged for a defined number of hours per month or against a specific scope. Typical engagements run 10-40 hours per month at $75-$150/hr in the US market, higher for CPQ or development-adjacent skills. What you are buying is **elastic, specialist-tunable capacity with no employment overhead**: no benefits, no payroll taxes, no severance risk, no management ladder, and the ability to scale hours up or down month to month. What you are giving up is continuity and ownership. A contractor's knowledge lives in their head and leaves with them; they are rarely in the daily flow of the business; they will not, unless you pay specifically for it, own a roadmap or proactively flag the strategic risks. Contractors are exceptional for sub-scale orgs, overflow, and bridging gaps — and they are dangerous as a permanent substitute for ownership.

**The Salesforce consulting agency or managed-services partner.** A firm — anything from a three-person boutique to a global systems integrator — that fields a *bench* of specialists: solution architects, CPQ specialists, integration developers, QA, project managers, change-management leads. Engagement comes in two shapes. **Project / SOW work**: a fixed-scope, fixed-or-T&M-priced engagement to build something — a new CPQ instance, a Classic-to-Lightning migration, a Marketo or NetSuite integration, a multi-cloud rollout — typically $15K-$150K+ depending on scope. **Managed services**: a monthly retainer ($2K-$15K/month) that buys a blended pool of hours against an SLA, giving you a fraction of an architect, a fraction of an admin, a fraction of a developer, all coordinated. What you are buying from an agency is **depth and burst capacity**: skills no single admin possesses, the ability to throw four people at a deadline, and accountability structured through a statement of work. What you are giving up is cost efficiency on steady-state work and embedded daily context. Agencies build well and maintain expensively.

The category error that drives most waste: hiring a full-time admin to do agency work (a greenfield build), or retaining an agency to do admin work (daily user support), or using a contractor as a permanent stand-in for an owner. Get the model matched to the *type* of work and the ARR question mostly answers itself.

## The ARR Threshold Reality

Here are the rough ARR anchors, offered with a loud caveat: treat them as a first sniff test, not a decision. They are correct often enough to be a reasonable default and wrong often enough that you must always check them against the real drivers in the next section.

**Under ~$2M ARR.** The org is almost always simple — a few dozen users, standard objects, a couple of integrations, light automation. A **fractional contractor** at 10-25 hours per month, or in the earliest stage a **founder or RevOps generalist moonlighting as admin**, covers it. A full-time hire here is almost always premature: you will be inventing work to justify the seat within ninety days. The exception, flagged hard, is the rare sub-$2M company that bought CPQ early or runs a genuinely complex multi-cloud org — that company needs real help immediately, but even then a strong senior contractor often beats a full-time junior.

**$2M-$10M ARR.** This is the band where the **first full-time admin** becomes defensible — but "defensible" is conditional on complexity. A $6M company with 80 users, CPQ, three integrations, and a growing automation footprint clearly needs a full-time admin. A $6M company with 25 users, a stock org, and one integration does not — a 20-30 hour/month contractor is the right call and will be for a while. The honest framing for this band: it is the *decision zone*, where the answer genuinely depends on the org, not the revenue.

**$10M-$30M ARR.** Almost every company here has a full-time admin, and the live question becomes **what surrounds that admin**. The typical configuration is a full-time admin for steady-state plus **contractor overflow** for the spillover the admin cannot absorb, or a second part-time senior. Project work — and there is usually project work at this stage — increasingly goes to an agency rather than being crammed onto the admin's plate.

**$30M+ ARR.** You are running an **admin team** (a lead admin plus one or more admins, often a business analyst, sometimes a platform owner or RevOps-systems manager above them), or one to two full-time admins plus a standing **agency relationship** for project work. The org is complex enough that no single person can hold it, and the question shifts entirely from "what model" to "how to structure the team and the agency relationship."

Notice what the anchors hide. ARR correlates with org complexity, but loosely — and the correlation breaks exactly where the money is at stake. A PLG company at $40M with a self-serve motion and a thin sales org may have a far simpler Salesforce instance than a $7M company running a complex enterprise sales motion with CPQ, partner channels, and four integrations. ARR is a proxy for complexity, and complexity is what actually dictates the staffing decision. Use ARR to form a hypothesis; use the drivers below to test it.

## The Real Drivers (Not ARR) — Org Complexity

The variable that actually dictates the staffing decision is **org complexity**, and it is measurable. Score your org across these dimensions and you will have a far better signal than any revenue number.

**User count.** Not just the license total — the count of *active, daily, business-critical* users, and how many distinct personas they represent. Thirty users in one sales role is light. Thirty users split across SDRs, AEs, CSMs, RevOps, and finance, each with different page layouts, permission sets, and reporting needs, is heavy. User count drives the support ticket queue, the enablement load, and the permission-architecture complexity.

**Object count.** Standard objects only, or a meaningful set of custom objects? Each custom object is a small data model with its own fields, relationships, automation, sharing rules, and reporting surface. An org with five thoughtfully designed custom objects carries more maintenance weight than one with none, and an org with twenty custom objects — many half-built, several redundant — carries a maintenance burden that quietly consumes a full-time person.

**Integration count.** Every integration is a standing liability: it can break, it can change under you when the other system updates, it needs monitoring, error handling, and field-mapping maintenance. Marketing automation, CPQ-to-ERP, data enrichment, CTI, BI/warehouse syncs, e-signature, customer success platforms — count them. Three integrations is manageable for a contractor. Eight integrations, several mission-critical, is full-time territory regardless of ARR.

**CPQ presence.** CPQ (Configure-Price-Quote, whether legacy Salesforce CPQ or Revenue Cloud) is a complexity multiplier all by itself. Price rules, product rules, discount schedules, approval matrices, bundle structures, contract amendments, renewals logic — CPQ is effectively a second application living inside Salesforce, and it does not maintain itself. A company with mature, business-critical CPQ has a structurally higher admin need than a same-ARR company without it.

**Multi-cloud.** Sales Cloud alone is one thing. Sales Cloud plus Service Cloud plus Experience Cloud plus Marketing Cloud Account Engagement is four distinct domains, each with its own configuration model and its own specialist depth. Multi-cloud orgs almost never run well on a single generalist admin past a modest scale.

**Automation volume.** Count the active flows, the legacy process builders and workflow rules not yet migrated, the Apex triggers, the scheduled jobs. Automation is the highest-leverage and highest-risk surface in the org: it is where a small change silently corrupts data at scale, where technical debt compounds, and where a poorly architected estate becomes a maintenance tax on every future change.

Roll these up into a rough **complexity score** — low, moderate, high, severe. A low-complexity org (few users, standard objects, one or two integrations, no CPQ, single cloud, light automation) can run on a fractional contractor well past the ARR levels where the anchors would suggest a full-time hire. A severe-complexity org (hundreds of users across personas, dozens of custom objects, eight-plus integrations, mature CPQ, multi-cloud, heavy automation) needs a full-time admin or a team *regardless of ARR* — even at $4M or $5M. The complexity score is the real input. ARR is just the thing that is easy to look up.

## Cost Comparison — Full-Time Admin

The sticker price of a full-time admin is the number everyone quotes and the number that matters least. In the US market in 2026, a Salesforce administrator's base salary runs roughly **$90K-$135K** for a solid mid-level admin, dropping to $70K-$90K for a junior and rising to $135K-$170K for a genuinely senior admin with Advanced Admin, Platform App Builder, and CPQ or multi-cloud depth. But base salary is the beginning of the cost, not the end.

**The loaded cost.** Add employer payroll taxes, health and dental and vision benefits, 401(k) match, equity, laptop and software, the Salesforce Trailhead and certification budget, and the share of HR, recruiting, and facilities overhead the seat consumes. The standard multiplier is **1.25x to 1.4x base**, which puts a $110K admin at a true cost of roughly **$140K-$155K per year**, and a senior admin near $170K base at a loaded **$210K-$240K**.

**Ramp.** A new admin is not productive on day one. Learning your specific org — its history, its undocumented decisions, its integration quirks, who the difficult stakeholders are — takes a meaningful ramp, typically two to four months before they are operating at full effectiveness, longer for a complex org. Budget the ramp as a real cost: you are paying full freight for partial output during that window.

**Management overhead.** Someone has to manage this person — set priorities, review work, handle career development, run one-on-ones. That is real time from a RevOps leader or manager, and it is a cost that does not exist with a contractor engaged against a scope or an agency engaged against an SOW.

**Certifications and skill maintenance.** Salesforce ships three releases a year. Keeping an admin current — Trailhead time, certification maintenance, Dreamforce or community events — is both a budget line and a time line, and it is the cost of *not* having an admin whose skills quietly decay.

The honest full-time number for a mid-level admin, all-in, is **$140K-$175K per year**, and for a senior admin **$200K-$250K**. That is the bar the alternatives have to clear — or fail to clear.

## Cost Comparison — Contractor

A contractor's cost structure is radically different: it is **purely variable, with no overhead and no tail.**

**The hourly rate.** US-based independent Salesforce admin contractors run roughly **$60-$150/hr**, with the spread driven by seniority and specialization. A competent generalist admin sits around $75-$110/hr; a senior contractor with architecture-level judgment or CPQ depth runs $125-$175/hr; pure development or integration work runs higher still. Offshore and nearshore contractors run materially lower, which is a separate section below.

**Typical engagement size.** Most steady-state contractor engagements run **10-40 hours per month**. At 20 hours/month at $110/hr that is $2,200/month, roughly **$26K/year** — a fraction of a loaded full-time admin. At 40 hours/month at $130/hr it is $5,200/month, about **$62K/year** — still well under a full-time hire, and you are buying senior-level skill you might not get in a single full-time junior.

**No overhead, no tail.** No benefits, no payroll taxes, no equity, no severance, no management ladder, no ramp cost you carry on the books (the contractor absorbs their own learning curve, though you still pay for org-specific onboarding time). You can scale hours up for a busy month and down for a quiet one. If the engagement is not working, you end it with a notice period, not a severance package and a morale event.

**The continuity risk.** This is the cost that does not show up on the invoice. A contractor's knowledge of your org lives in their head. They are juggling other clients; you are not their only priority, and you do not control their calendar. If they get a full-time offer, get sick, or simply decide to move on, you can lose your entire institutional Salesforce knowledge in a two-week notice window. Contractors are also rarely in the daily flow of the business — they will fix what is in the queue, but they are less likely to notice the strategic risk, own the roadmap, or build the relationships that make a full-time admin a force multiplier. The continuity risk is real, it is the contractor model's central weakness, and it is exactly why the model breaks down as orgs grow.

## Cost Comparison — Agency / Managed Services

An agency's cost structure is the most variable of the three and the most often misunderstood, because "agency" covers two genuinely different commercial models.

**The managed-services retainer.** A monthly fee — typically **$2K-$15K/month**, occasionally higher — that buys a blended pool of hours against an SLA. The retainer does not buy you one named person; it buys you a *fraction* of several people: some architect time, some senior admin time, some developer time, coordinated by the firm. A $5K/month managed-services retainer is $60K/year and gets you, very roughly, the equivalent of a third to a half of a full-time admin's hours — but spread across more skill depth than any single admin has. The retainer's value is the bench: when you need an integration debugged you get the integration person; when you need a flow rearchitected you get the architect.

**Project / SOW work.** A fixed-scope engagement to build something specific, priced fixed-fee or time-and-materials, typically **$15K-$150K+** depending on scope. A CPQ implementation might be $80K-$200K. A Classic-to-Lightning migration might be $40K-$120K. A focused integration project might be $15K-$40K. The SOW model is how you buy a *build*: defined deliverables, a timeline, a project manager, a team that disbands when the work ships. You are paying a premium per hour relative to a contractor, but you are buying coordinated specialist depth and accountability you cannot assemble yourself.

**The bench-of-specialists advantage.** This is what you are really paying the agency premium for. No single full-time admin is simultaneously a CPQ expert, an integration developer, a Marketing Cloud specialist, a data-migration lead, and a change-management facilitator. An agency fields all of those and lets you draw on exactly the skill you need for exactly as long as you need it. For bursty, specialized, project-shaped work, that is enormously efficient. For steady-state daily admin work, it is the most expensive way to buy the cheapest kind of labor — which is the whole reason the build-vs-maintain distinction matters so much.

## What A Full-Time Admin Is Right For

A full-time admin is the right answer when the work is **continuous, contextual, and ownership-shaped.** The specific signals:

**A backlog that never empties.** If there is always a meaningful queue of requests — new fields, report changes, automation tweaks, permission adjustments, data fixes — and that queue regenerates as fast as it is cleared, you have continuous work, and continuous work wants a continuous person. A contractor draining a backlog that refills is a contractor you are paying premium rates to do steady-state work.

**Deep org knowledge.** When the cost of *not* knowing the org's history is high — when undocumented decisions, integration quirks, and stakeholder politics make every change risky for an outsider — the embedded knowledge of a full-time admin becomes the asset. They remember why things are the way they are, and that memory prevents expensive mistakes.

**User enablement and day-to-day support.** Reps and managers need someone *available*: someone in the Slack channel, someone who can unblock a stuck deal in ten minutes, someone who runs the training when a new feature ships. This availability is hard to buy from a contractor juggling clients and impossible to buy efficiently from an agency.

**Change management.** Rolling out a new process, a new automation, a new layout is half technical and half human. A full-time admin who knows the people, has credibility with the reps, and can shepherd adoption is doing change-management work that an outsider structurally cannot.

**Becoming the RevOps-systems owner.** The highest-value thing a strong full-time admin becomes is the *owner* of the Salesforce platform as a strategic asset — holding the roadmap, governing technical debt, partnering with RevOps leadership on what the system should become. That ownership is the entire point of the role, and it is precisely what neither a contractor nor an agency will do unless you specifically and expensively contract for it.

## What A Contractor Is Right For

A contractor is the right answer when the work is **sub-scale, intermittent, gap-shaped, or transitional.** The specific signals:

**A sub-scale org.** When the genuine, honest admin workload is 10-30 hours a month, a full-time hire is a seat you will spend energy justifying. A contractor sized to the actual work is the disciplined, correct call — and it stays correct longer than most founders expect.

**Overflow capacity.** When you have a full-time admin but a temporary surge — a busy quarter, a project the admin cannot absorb alongside steady-state — a contractor for overflow is cleaner than burning out your admin or making a premature second full-time hire.

**A specific skill gap.** Your admin is excellent at config but the org needs a flow rearchitected, or a tricky permission model untangled, or a one-time data migration. A contractor with that specific depth, for that specific window, fills the gap without a permanent hire.

**Interim coverage.** Your admin quit, or is on leave. A contractor keeps the lights on while you run the search, preventing the org from drifting into neglect during the gap.

**The pre-full-time bridge.** This is one of the most valuable contractor uses. When you are *approaching* the full-time threshold but not quite there, a contractor at growing hours bridges the gap — and the contractor relationship itself becomes a live data source: when their hours consistently push past 60-80 a month and the backlog still will not clear, you have your evidence that it is time to hire full-time.

## What An Agency Is Right For

An agency is the right answer when the work is **a build: bursty, specialized, project-shaped, and beyond a generalist admin's depth.** The specific signals:

**Big implementations.** Standing up a new cloud, re-architecting the data model, a greenfield org build — these are projects with a defined scope and a defined end, requiring a coordinated team. That is agency work, full stop.

**CPQ rollouts.** Implementing CPQ (or Revenue Cloud) is a specialist discipline. Even a strong generalist admin is rarely the right person to architect a CPQ instance from scratch; the failure modes are too expensive and the specialist depth too valuable. Agencies do this; admins maintain what the agency built.

**Classic-to-Lightning and other migrations.** Platform migrations are large, risky, finite projects with specialist patterns. An agency that has run the migration twenty times will do it faster and safer than an admin running it once.

**Integration projects.** Connecting Salesforce to an ERP, a data warehouse, a marketing platform, a billing system — meaningful integration work is development work, often beyond an admin's skill set and always project-shaped.

**Multi-cloud projects.** Rolling out Service Cloud or Experience Cloud or Marketing Cloud alongside an existing Sales Cloud org pulls in cloud-specific specialist depth that a single admin will not have.

**Specialist skills the full-time admin lacks.** This is the unifying theme. The agency's value is the bench — the ability to put the *right* specialist on the *right* problem for the *right* duration. When the work needs a skill your admin does not have and should not be expected to have, the agency is the efficient answer.

## The Hybrid Model

For most companies above roughly **$20M ARR**, the end-state is not a choice between the three models — it is a deliberate **combination** of two of them, and it is the single most common mature configuration in the market.

The hybrid model is: **a full-time admin (or admin team) owns steady-state, and an agency is retained for projects.** The admin handles the daily queue, user support, enablement, change management, data hygiene, the small continuous improvements, and crucially the *ownership* of the platform and its roadmap. The agency is engaged, project by project, for the bursty specialist builds — the CPQ expansion, the new integration, the multi-cloud rollout, the migration — that the admin should neither be expected to do nor be pulled off steady-state to attempt.

Why this is the dominant end-state: it matches each model to the kind of work it is actually good at. The full-time admin gives you continuity, context, availability, and ownership. The agency gives you depth and burst capacity. You stop paying agency rates for steady-state work and you stop asking a generalist admin to do specialist project work. The admin even gets *better* in this model — they are the internal owner who scopes the agency engagements, holds the agency accountable to the SOW, and absorbs the knowledge transfer when each project ships, which means the org does not become dependent on the agency.

The hybrid model also scales gracefully. As the company grows, the admin function grows into a team and the agency relationship can shift from ad-hoc projects to a standing managed-services retainer for specialist overflow. It is less a single configuration than a stable architecture that flexes with scale.

## The "Founder / RevOps-Lead As Accidental Admin" Anti-Pattern

The most expensive Salesforce staffing option is the one that never appears in a budget line: the **accidental admin** — the founder, COO, RevOps leader, or sales-ops generalist who quietly absorbs the admin work because nobody else is doing it.

The math is brutal once you make it explicit. A RevOps leader's fully-loaded cost is commonly **$180K-$300K+**. If that person is spending even 30% of their time in Salesforce config — building fields, fixing flows, running the report requests, untangling permissions — you are paying **$54K-$90K+ a year** for admin work, executed by someone who is *not a specialist admin*, *more slowly* than a real admin would, and at the direct cost of the strategic RevOps work they were actually hired to do. You are buying the most expensive labor in the building to do the cheapest kind of work, badly, while the expensive work goes undone.

It is worse than the dollar figure suggests, because of the opportunity cost. The RevOps leader who is heads-down in flow builder is not designing the comp plan, not building the forecasting model, not running the pipeline-conversion analysis, not partnering with the CRO on go-to-market strategy. The accidental-admin pattern does not just overpay for admin work — it *starves the function* the person was hired to lead.

It is also a trap that is hard to see from inside. The work feels productive; tickets get closed; the leader feels useful and in control. But "I'll just do it myself" is, at any scale past the very earliest stage, the most expensive sentence in RevOps. The moment you can articulate that a real person is spending real, recurring hours on Salesforce config and *that is not their job*, you have already crossed the threshold for at least a contractor — and the only reason you have not acted is that the cost is hidden inside an existing salary instead of sitting on its own line.

## The Admin-To-User Ratio Heuristic

A useful back-of-envelope check is the **admin-to-user ratio**: roughly **one admin per 30-50 users for a light-touch org**, and **one admin per 20-30 users for a heavily customized org.** A 120-user org with a simple configuration might be fine with two admins or one admin plus a contractor; a 120-user org running CPQ, multi-cloud, and heavy automation might genuinely need three or four admins.

The heuristic is useful precisely because it forces the complexity question. Notice that the ratio *itself* swings by a factor of two based on customization — which is just another way of saying that user count alone does not determine admin need; user count *times complexity* does. The ratio is a sanity check, not a formula.

Its limits matter. The ratio says nothing about project load — an org mid-CPQ-implementation needs far more hands than its steady-state ratio implies, and that surge is agency work, not a permanent admin hire. It says nothing about the *quality* of the org — a clean, well-architected 200-user org may need fewer admins than a messy 100-user org carrying years of technical debt. And it says nothing about integration count, which can quietly consume an admin's week regardless of how many users there are. Use the ratio to pressure-test a staffing plan, never to set it.

## The Certification & Skill Ladder

Understanding the Salesforce skill ladder tells you what you are actually buying at each tier and what it should cost.

**Salesforce Certified Administrator.** The entry credential. An admin at this level handles user management, security and access, page layouts and record types, reports and dashboards, list views, basic flow automation, data import and hygiene, and the daily support queue. This is the floor for a full-time admin and a common contractor profile. Pay band: roughly **$70K-$95K** base for full-time, $60-$95/hr for contract.

**Advanced Administrator.** Deeper command of automation, security architecture, complex reporting, sandbox and release management, and data management at scale. An Advanced Admin can own a non-trivial org without constant escalation. Pay band: roughly **$95K-$130K** base, $90-$140/hr contract.

**Platform App Builder.** A declarative-development credential — designing the data model, building custom applications with custom objects, advanced automation, and Lightning App Builder work. An admin with Advanced Admin *plus* Platform App Builder is operating at near-architect declarative depth. Pay band: combined with Advanced Admin, roughly **$120K-$150K** base.

**Consultant-level and architect.** The Sales Cloud / Service Cloud / CPQ Specialist consultant certifications, and above them the Application and System Architect tracks. This is where you find the people who *design* orgs rather than maintain them — and it is largely the skill profile you rent from an agency rather than hire full-time, unless you are at the scale where a platform owner or solution architect on staff is justified. Pay band: **$140K-$200K+** base for staff architects; agency blended rates effectively higher.

The practical takeaway: a contractor or first full-time hire is usually an Administrator or Advanced Administrator. The specialist and architect tiers are what the agency bench provides. When someone proposes hiring a single full-time person to both maintain the org *and* architect a CPQ build, they are conflating two tiers of the ladder that the market prices very differently for good reason.

## The Build vs Maintain Distinction

If there is one distinction that resolves more Salesforce staffing confusion than any other, it is this: **agencies build, admins maintain — and getting it wrong is the classic, expensive mistake.**

*Building* is project-shaped work: it has a defined scope, a start and an end, it requires coordinated specialist skills, and when it ships the team that did it is no longer needed. Standing up CPQ, migrating Classic to Lightning, architecting a new data model, integrating a new system — these are builds.

*Maintaining* is continuous work: it has no end, it regenerates, it requires context and availability more than specialist depth, and it rewards the embedded knowledge that compounds over years. The daily queue, user support, data hygiene, small improvements, change management, roadmap ownership — these are maintenance.

The two classic mistakes are mirror images. **Mistake one: hiring a full-time admin to do a build.** You hire an admin to "implement CPQ," they have never architected CPQ from scratch, the project takes three times as long as it should, the result is fragile, and now you have a permanent salary attached to a finite project. **Mistake two: retaining an agency to do maintenance.** You put the daily admin queue on a managed-services retainer, you pay agency blended rates for $80/hr-equivalent config work, nobody on the agency side is embedded enough to own the roadmap or know the politics, and you are spending hybrid-model money for sub-contractor-model value.

Match the model to the *shape* of the work. Builds go to agencies. Maintenance goes to admins. The hybrid model exists precisely because most growing companies have both kinds of work at the same time — and the discipline is keeping them in their correct lanes.

## Red Flags You've Outgrown A Contractor

A contractor is the right answer right up until it is not, and the transition is rarely announced. Watch for these signals that you have outgrown the contractor model and need a full-time admin:

**The backlog never shrinks.** The contractor's hours go up, the queue does not go down. The work has become continuous, and continuous work wants a continuous person — you are now paying premium contract rates for steady-state labor.

**Knowledge lives in one external head.** You realize that if the contractor disappeared tomorrow, you would lose your entire understanding of how the org is wired. That concentration of irreplaceable, off-payroll knowledge is a standing business risk, and it grows every month.

**Response time is hurting reps.** The contractor is good but not *available* — a stuck deal waits a day for a fix because you are not their only client. When admin responsiveness starts costing the sales org real time, you need someone in the daily flow.

**Nobody owns the roadmap.** The contractor executes tickets but no one is governing technical debt, holding a forward plan, or partnering with RevOps on what the platform should become. The org is being maintained but not *led*, and the absence of ownership compounds quietly into a mess.

When two or more of these are true, the contractor relationship has done its job and the next move is a full-time hire — often with the same contractor brought along for overflow.

## Red Flags You Hired Full-Time Too Early

The opposite mistake is just as real and just as expensive. Watch for these signals that you made a premature full-time hire:

**The admin is bored.** A good admin with not enough work is a flight risk and a morale problem. If your admin is visibly under-stretched, you bought a seat the org cannot yet fill.

**Utilization is under 50%.** When you honestly account for the genuine admin work, it is filling less than half the week. That is a contractor-sized workload wearing a full-time-salary costume.

**You are inventing work to justify the seat.** This is the clearest tell. When you find yourself green-lighting nice-to-have projects, gold-plating the org, or assigning the admin adjacent work that is not really admin work — all so the hire "makes sense" — you have inverted the logic. The work should justify the seat; the seat should never have to invent the work.

The fix for a premature full-time hire is not always to undo it — sometimes you grow into the seat in a quarter or two. But if the signals persist past a couple of quarters, you are carrying a full-time loaded cost for contractor-shaped work, and the disciplined move is to recognize it.

## The Managed-Services Middle Path

Between the full-time hire and the project agency sits a model that deserves its own consideration: the **Salesforce managed-services provider (MSP)** — a firm that, for a predictable monthly retainer, gives you a blended, SLA-backed pool of hours across admin, architect, and developer skills.

The managed-services model beats a full-time hire when: your steady-state need is real but **sub-full-time** (the classic 15-35 hours/month band where a contractor would also work, but you want more reliability and bench depth than a solo contractor offers); you value **an SLA and a firm behind it** rather than depending on one individual; or your needs are **variable enough** month to month that fixed full-time capacity would be poorly utilized. The MSP absorbs the continuity risk that a solo contractor carries — if their assigned admin leaves, the firm backfills, and the knowledge is supposed to live in the firm's documentation, not one person's head.

The managed-services model beats a project agency when the work is **ongoing rather than project-shaped** — you need a steady hand on the org month after month, not a burst team for a finite build.

Its weaknesses are real and worth naming. You do not get a single embedded person who knows your business deeply and is in your Slack all day; you get a fraction of several people, coordinated. Roadmap ownership is weaker than with a strong full-time admin — the MSP will execute and advise, but the strategic ownership of the platform is harder to outsource than the hours. And the blended rate is higher per hour than a solo contractor. The managed-services middle path is genuinely the right answer for a specific profile — sub-full-time steady-state need, low risk tolerance for single-person dependency, variable load — and a poor fit when what you actually need is embedded ownership.

## Geographic & Offshore Options

The hourly rates quoted above are US-market rates. The global market for Salesforce talent is large, and **offshore and nearshore admins and contractors** run materially cheaper — roughly **$20-$50/hr** for offshore admin work depending on region and seniority, against $75-$150/hr onshore.

The cost savings are real and, for the right work, the quality can be entirely sufficient — there is a deep, genuinely skilled Salesforce talent pool in India, the Philippines, Latin America, and Eastern Europe, much of it certified and experienced. For well-scoped, well-documented, execution-shaped work — a defined backlog of config tasks, a clear project specification — offshore capacity can be excellent value.

The tradeoffs are equally real. **Timezone**: an admin twelve hours offset cannot be in the Slack channel when a US rep's deal is stuck at 2pm Eastern, which makes offshore a poor fit for real-time daily support and a fine fit for overnight queue execution. **Communication**: nuance, context, and the back-and-forth of ambiguous requirements are harder across distance, language, and culture, which raises the premium on crisp written scoping. **Context and ownership**: the same continuity and roadmap-ownership limits that apply to any contractor apply more sharply at distance.

The practical pattern: offshore works best as *execution capacity inside a model owned onshore* — a US-based admin or RevOps lead who owns the org, the roadmap, and the stakeholder relationships, with offshore contractors or an offshore-staffed MSP executing a well-defined backlog underneath that ownership. Offshore as a pure substitute for an embedded, context-rich, real-time admin is where the model tends to disappoint.

## The Total Cost Of Ownership Model

The way to actually decide is to model **total cost of ownership over a three-year horizon** at your real org size — not compare sticker prices for a single month.

**The small org (low complexity, ~$3M-$8M ARR, 20-40 users, simple config).** Full-time admin: ~$140K-$165K/year loaded, so **~$420K-$495K over three years** — and the admin is under-utilized for much of it. Contractor at 20 hrs/month: ~$26K-$32K/year, **~$78K-$96K over three years**. The contractor is the obvious answer, and it is not close. The full-time hire only makes sense here if a build is coming or complexity is about to spike.

**The mid org (moderate complexity, ~$10M-$25M ARR, 60-120 users, some CPQ or integrations).** Full-time admin: ~$150K-$180K/year loaded, **~$450K-$540K over three years**, and now the admin is well-utilized. Add a contractor for overflow at ~$30K/year, or budget an agency project or two at ~$50K-$100K each across the three years. Total hybrid: roughly **$600K-$850K over three years** — and it is money well spent because the admin is the owner and the agency does the builds. A contractor-only model here would underserve the org; an agency-only model would overpay for steady-state.

**The large org (high complexity, ~$30M-$75M ARR, 150+ users, CPQ, multi-cloud, heavy automation).** Admin team: two to three admins plus possibly a platform owner, **~$350K-$600K/year loaded, ~$1.05M-$1.8M over three years**, plus a standing agency relationship or managed-services retainer for specialist project work at **~$150K-$400K over three years**. Total: **~$1.2M-$2.2M over three years.** At this scale the question is never "can we afford an admin" — it is "is the team structured correctly and is the agency relationship governed well."

The TCO lens does two things the sticker-price comparison cannot. It exposes the **under-utilization tax** of a premature full-time hire — the small-org full-time admin costs 4-5x the contractor and the org cannot use the difference. And it exposes the **false economy** of refusing to staff a complex org properly — the mid and large orgs that try to run lean on contractors pay for it in technical debt, slow delivery, and a sales org that loses time to a system nobody owns. Model three years, at your real complexity, and the right answer is usually unambiguous.

## Hiring The First Full-Time Admin — The Profile & Process

When the analysis says hire full-time, the hire itself is where companies stumble. The first full-time admin is a high-leverage hire — they will shape the org for years — and the process should reflect that.

**The profile.** For a first hire owning the whole org, target a **mid-level admin with Advanced Administrator** and ideally Platform App Builder — someone who can operate without constant escalation but is not so senior they will be bored maintaining a mid-size org. Screen for the specific complexity in *your* org: if you run CPQ, CPQ experience is non-negotiable; if you are multi-cloud, you need cross-cloud exposure. Weight **judgment and communication** heavily — the best admins are as much business partners as configurers, and the worst expensive mistakes come from technically competent admins who build exactly what was asked instead of what was needed.

**What to screen for beyond certifications.** Certifications are a floor, not a signal of quality. Probe for: how they think about technical debt and when *not* to automate; how they handle a vague stakeholder request; a time they pushed back on a bad ask; how they manage the release process and protect production. You are screening for someone who will *own* the platform, not just work the queue.

**The practical test.** Always include a hands-on exercise — give them a developer org and a realistic scenario (build this small data model, automate this process, fix this broken flow) and watch *how* they work, not just whether they finish. The practical test catches the gap between someone who can pass a certification exam and someone who can safely operate your org.

**Where to source.** The Salesforce community is unusually strong — the Trailblazer Community, local user groups, Salesforce-specific recruiters and job boards, and referrals from your contractor or agency network (a contractor who knows your org may even *be* the right full-time hire). Avoid sourcing a strategic platform owner purely through a generalist job board with no Salesforce-specific screening.

## Managing An Agency Relationship

An agency relationship that is not actively managed quietly becomes either a cost sink or a dependency trap. The disciplines that keep it healthy:

**SOW discipline.** Every project gets a real statement of work — defined deliverables, acceptance criteria, timeline, and a change-order process for scope creep. Vague SOWs are how time-and-materials engagements drift and how fixed-fee engagements turn adversarial. The SOW is the contract *and* the shared definition of done.

**Knowledge-transfer requirements.** Build knowledge transfer into the SOW as a deliverable, not an afterthought. When the agency ships a CPQ build, your internal admin should come out of the project able to *maintain* it — that means documentation, walkthroughs, and a handoff period are contractually required, not hoped for.

**Avoiding lock-in.** The failure mode is an agency that builds your org in a way only they can maintain — undocumented, idiosyncratic, dependent on their continued engagement. Counter it deliberately: insist on standard patterns, require documentation, keep your internal admin involved *during* the build, and make portability an explicit expectation.

**The documentation clause.** Make documentation a named, accepted deliverable with its own acceptance criteria — data model diagrams, automation inventory, integration specs, configuration rationale. "Documentation" left informal is documentation that does not get done. Written into the SOW with acceptance criteria, it gets done.

The internal owner — usually your full-time admin or RevOps lead — is the linchpin. The agency relationship works when there is a competent internal person scoping the engagements, holding the agency to the SOW, and absorbing the knowledge transfer. Without that internal owner, even a good agency drifts toward dependency.

## The RevOps-Org Context

Where the Salesforce admin *sits* in the org chart shapes how well the function works, and there is no single correct answer — but there are clearly better and worse ones.

**Under RevOps / Sales Ops.** The most common and usually the best home for a revenue-org Salesforce admin. The admin's work *is* revenue operations — the system is the operational backbone of the go-to-market motion, and putting the admin under the leader who owns that motion keeps the platform aligned with the business it serves. The admin becomes the systems arm of RevOps, and RevOps becomes the strategic context for the admin.

**Under IT.** Sometimes structurally necessary — especially in larger or more regulated companies where Salesforce is one of many enterprise systems and governance, security, and integration standards are centralized. The risk is distance from the revenue org: an admin under IT can drift toward treating Salesforce as an IT asset to be governed rather than a revenue asset to be optimized, and the feedback loop with the people who actually use the system gets longer.

**Under Sales directly.** Occasionally seen at smaller companies. The risk is the inverse of the IT problem — the admin becomes a pure order-taker for whatever the loudest sales leader wants this week, with no governance, no roadmap discipline, and a steady accumulation of technical debt.

The reporting line matters because it determines whether the admin is positioned to be an *owner* — with the context, the mandate, and the strategic partnership to govern the platform — or merely a *configurer* executing requests. For most growth-stage revenue orgs, under RevOps, with a dotted line to IT for governance and security standards, is the configuration that gives the admin the best shot at being the owner the role is supposed to be.

## 5 Real-World Scenarios

The frameworks land harder against concrete cases. Five companies, five different right answers.

**The $3M PLG SaaS.** Self-serve motion, a thin 15-person sales team layered on top, simple Sales Cloud org, two integrations, light automation, no CPQ. The right call: a **fractional contractor** at 15-20 hours/month, roughly $24K-$30K/year. A full-time hire here would be 60%+ idle. The contractor stays correct until either the sales motion gets materially more complex or a build appears on the horizon.

**The $12M sales-led SaaS.** 90 users across SDRs, AEs, and CSMs, CPQ in production, four integrations, a real and regenerating backlog. The right call: a **first full-time admin**, mid-level with Advanced Admin and CPQ experience, ~$150K-$175K loaded — plus a contractor kept on call for overflow. The backlog is continuous, the org has real complexity, and the company needs an owner. This is the textbook full-time-threshold case, and notably the ARR is mid-range — it is the *complexity* that makes the call clear.

**The $40M multi-cloud org.** 180 users, Sales Cloud plus Service Cloud plus Marketing Cloud, mature CPQ, eight integrations, heavy automation, and an active project pipeline. The right call: an **admin team** — a lead admin plus two admins, possibly a business analyst — *plus* a standing **agency relationship** for the multi-cloud and integration projects. The hybrid model at team scale. No single person can hold this org, and the project work is specialist-shaped.

**The $100M enterprise.** Hundreds of users, multi-cloud, complex CPQ, a dozen-plus integrations, a formal release process, a project pipeline that never empties. The right call: a **full Salesforce team** with a platform owner or solution architect on staff, multiple admins, possibly an in-house developer — *plus* an agency or a managed-services retainer for surge and deep specialist work. The question at this scale is purely organizational design; the "which model" question is long settled.

**The $8M company post-acquisition.** $8M ARR but just acquired a smaller company, now integrating two Salesforce orgs into one. The right call: an **agency for the migration project** (a finite, specialist, high-risk build) running in parallel with either a **contractor or a first full-time admin** for steady-state, depending on the *combined* org's post-merger complexity. This is the case that most cleanly separates build from maintain — the migration is unambiguously agency work, and the ongoing staffing is a separate decision driven by what the merged org looks like when the dust settles.

Note the pattern across all five: ARR ordered the list, but ARR did not decide a single one of them. Complexity, backlog, and project pipeline did.

## The Decision Framework

Pulling it together into a usable framework. Four inputs, scored honestly:

**1. Org complexity score.** User count and persona spread, object count, integration count, CPQ presence, multi-cloud, automation volume — rolled to low / moderate / high / severe.

**2. Backlog depth.** Is there a continuous, regenerating queue (continuous work → wants a full-time person), an intermittent one (→ contractor or managed services), or effectively none beyond projects (→ no steady-state hire needed)?

**3. Project pipeline.** Is there a build coming — CPQ, migration, integration, multi-cloud? Project pipeline → agency, independent of the steady-state decision.

**4. Budget reality.** What can you actually afford, and — more importantly — modeled over a three-year TCO, what is the *efficient* spend rather than the cheapest sticker price?

The framework resolves roughly like this. **Low complexity + thin backlog + no projects → contractor.** **Low-to-moderate complexity + a real backlog + maybe a project → contractor now, full-time soon, agency for the project.** **Moderate-to-high complexity + continuous backlog + recurring projects → the hybrid model: full-time admin plus agency.** **High-to-severe complexity + relentless backlog + a standing project pipeline → admin team plus agency or managed-services retainer.** And independently, at any complexity: **a sub-full-time but reliability-sensitive steady-state need → consider managed services over a solo contractor.**

ARR enters only as the initial hypothesis — the sniff test that tells you which part of the framework to look at first. The four inputs decide. If the framework and the ARR anchor disagree, the framework is right and the anchor is the proxy showing its seams.

## 5-Year Outlook

The Salesforce-admin staffing decision is being actively reshaped by AI, and a five-year view changes how you should think about every threshold above.

**AI is compressing the hours a given org needs.** Agentforce, AI-assisted flow builders, natural-language configuration, AI-generated documentation, intelligent data hygiene, and AI agents that triage and even resolve routine admin tickets are all real and improving fast. The credible estimate is that AI-assisted tooling compresses the *routine* admin workload of a given org by something like **30-50%** by 2030 — the queue of "add this field, build this report, fix this list view, tweak this flow" work shrinks substantially as natural-language tooling lets business users self-serve and lets admins move faster on what remains.

**What that does to the thresholds.** The full-time threshold moves *upward*. An org that needs a full-time admin at a given complexity today may, in 2030, be served by a contractor plus AI tooling — because the human hours required to maintain the same org have fallen. The fractional and managed-services models get structurally *stronger*, because the steady-state hour count that used to justify a full seat now fits inside a part-time or blended engagement. The accidental-admin anti-pattern gets *somewhat* less punishing at the very low end — a founder with good AI tooling can hold a simple org longer — but it remains a trap the moment complexity appears, because AI compresses routine work and does not replace ownership, judgment, or change management.

**What does not change.** AI compresses *execution*, not *ownership*. Someone still has to decide what the platform should become, govern technical debt, manage change with the humans who use the system, architect the complex builds, and own the roadmap. The work that AI compresses is exactly the work that was most contractor-shaped already; the work AI does not touch — strategic ownership, judgment, stakeholder partnership, complex architecture — is exactly the work that justified a full-time admin or an agency in the first place. So the *shape* of the decision survives. The thresholds shift; the logic does not.

**What the staffing model becomes by 2030.** The likely end-state: a *higher* complexity bar before a full-time hire is justified; a larger and more capable middle of fractional and managed-services arrangements augmented by AI; agencies moving up-market toward the genuinely hard architecture and AI-implementation work and away from commodity config; and the full-time admin role itself evolving — less queue execution, more platform ownership, AI orchestration, and strategic partnership. The admin who thrives in 2030 is the one who was always more owner than configurer. The decision framework in this entry still holds in 2030 — you just run it with AI assumed in the denominator, which moves every threshold up and makes the flexible models the default for a wider band of companies than today.

## Final Framework

The staffing decision, compressed to its load-bearing parts:

**Stop leading with ARR.** ARR is a sniff test, not a decision. It is correct often enough to be a reasonable starting hypothesis and wrong often enough — exactly where the org is unusually simple or unusually complex for its revenue — to be expensive if trusted. Use it to form a guess, then test the guess.

**Decide on complexity, backlog, and project pipeline.** Org complexity (users, objects, integrations, CPQ, multi-cloud, automation) tells you the *weight* of the steady-state need. Backlog depth tells you whether that need is *continuous*. Project pipeline tells you whether there is *build* work — and build work is always agency-shaped, independent of the steady-state answer.

**Match the model to the shape of the work.** Continuous, contextual, ownership-shaped work → full-time admin. Sub-scale, intermittent, gap-shaped, transitional work → contractor. Sub-full-time but reliability-sensitive steady-state → managed services. Bursty, specialist, project-shaped build work → agency. And for most companies past ~$20M ARR with both steady-state and project work, the answer is the **hybrid model** — full-time admin owns steady-state, agency does the builds.

**Avoid the two expensive mistakes.** The accidental admin — a $180K-$300K+ leader doing $80/hr config work while their real job goes undone — is the most expensive option that never appears in a budget. And the build-vs-maintain category error — a full-time admin assigned a greenfield build, or an agency retained for the daily queue — wastes money in both directions. Match the model to the work.

**When to switch models — the triggers.** Switch from contractor to full-time when the backlog stops shrinking, knowledge concentrates in one external head, response time starts costing reps, and nobody owns the roadmap. Switch from a premature full-time hire back toward a leaner model when utilization sits under 50% and you are inventing work to justify the seat. Add an agency the moment a real build appears. Move toward a team when one admin can no longer hold the org. And run the whole framework with AI in the denominator — by 2030 every threshold sits higher than it does today.

The right answer is rarely the same for two companies even at identical ARR. But the *method* is identical: score the complexity, measure the backlog, look at the project pipeline, model three years of TCO, match the model to the shape of the work — and treat ARR as the question's opening hypothesis, never its answer.

`;

const flow = `

## The Staffing Decision Tree

\`\`\`mermaid
flowchart TD
  A[Salesforce Admin Staffing Decision] --> B[Score Org Complexity]
  B --> B1[User Count And Persona Spread]
  B --> B2[Object Count Custom Objects]
  B --> B3[Integration Count]
  B --> B4[CPQ Present]
  B --> B5[Multi Cloud Present]
  B --> B6[Automation Volume]
  B1 --> C[Complexity Score Low To Severe]
  B2 --> C
  B3 --> C
  B4 --> C
  B5 --> C
  B6 --> C
  C --> D[Assess Backlog Depth]
  D --> D1[Continuous Regenerating Queue]
  D --> D2[Intermittent Queue]
  D --> D3[No Steady State Queue]
  D1 --> E[Assess Project Pipeline]
  D2 --> E
  D3 --> E
  E --> E1[Build Coming CPQ Migration Integration]
  E --> E2[No Build On Horizon]
  E1 --> F[Check Budget Over 3 Year TCO]
  E2 --> F
  F --> G{Match Model To Work Shape}
  G -->|Low Complexity Thin Backlog No Project| H1[Fractional Contractor]
  G -->|Low Moderate Complexity Real Backlog| H2[Contractor Now Full Time Soon]
  G -->|Sub Full Time But Reliability Sensitive| H3[Managed Services Retainer]
  G -->|Moderate High Complexity Continuous Backlog Recurring Projects| H4[Hybrid Full Time Admin Plus Agency]
  G -->|High Severe Complexity Relentless Backlog Standing Pipeline| H5[Admin Team Plus Agency]
  G -->|Build Shaped Work Only| H6[Agency SOW Project]
  H1 --> I[Re Score When Complexity Or Backlog Shifts]
  H2 --> I
  H3 --> I
  H4 --> I
  H5 --> I
  H6 --> I
  I --> J{Switch Triggers Fired}
  J -->|Backlog Never Shrinks Knowledge In One Head| K1[Move To Full Time]
  J -->|Utilization Under 50 Percent Inventing Work| K2[Move To Leaner Model]
  J -->|Build Appears| K3[Add Agency]
  J -->|One Admin Cannot Hold Org| K4[Move To Admin Team]
  J -->|No Trigger Fired| K5[Hold Current Model]
\`\`\`

## The 3-Year Total Cost Of Ownership Comparison

\`\`\`mermaid
flowchart LR
  A[3 Year TCO By Org Size] --> B[Small Org Low Complexity 3M-8M ARR]
  A --> C[Mid Org Moderate Complexity 10M-25M ARR]
  A --> D[Large Org High Complexity 30M-75M ARR]
  B --> B1[Contractor 20 Hrs Month 78K-96K]
  B --> B2[Full Time Admin 420K-495K Under Utilized]
  B1 --> B3[Right Call Contractor Wins Clearly]
  B2 --> B3
  B3 --> B4[Under Utilization Tax Exposed]
  C --> C1[Full Time Admin 450K-540K Well Utilized]
  C --> C2[Plus Contractor Overflow Or Agency Projects]
  C1 --> C3[Hybrid Total 600K-850K]
  C2 --> C3
  C3 --> C4[Money Well Spent Admin Owns Agency Builds]
  D --> D1[Admin Team 1.05M-1.8M]
  D --> D2[Plus Agency Or Managed Services 150K-400K]
  D1 --> D3[Total 1.2M-2.2M]
  D2 --> D3
  D3 --> D4[Question Is Team Design Not Which Model]
  B4 --> E[TCO Lens Reveals True Cost Curve]
  C4 --> E
  D4 --> E
  E --> F[Premature Full Time Costs 4-5x Contractor]
  E --> G[Under Staffing Complex Org Pays In Tech Debt]
  F --> H[Model 3 Years At Real Complexity]
  G --> H
  H --> I[AI By 2030 Shifts Every Threshold Upward]
\`\`\`

`;

const src = `

## Sources

1. **Salesforce — Salesforce Administrator Certification** — Credential scope and exam content for the entry-level admin role. https://trailhead.salesforce.com/credentials/administrator
2. **Salesforce — Advanced Administrator Certification** — Credential scope for senior declarative administration. https://trailhead.salesforce.com/credentials/advancedadministrator
3. **Salesforce — Platform App Builder Certification** — Declarative development credential scope. https://trailhead.salesforce.com/credentials/platformappbuilder
4. **Salesforce — Architect Certification Tracks** — Application and System Architect credential paths defining the consultant/architect tier. https://trailhead.salesforce.com/credentials/architectoverview
5. **Mason Frank / Tenth Revolution Group — Salesforce Salary Survey** — Annual compensation benchmarks for Salesforce admins, consultants, and architects across seniority levels. https://www.masonfrank.com/salary-survey
6. **Salesforce Ben — Salesforce Admin Salary Guide** — Independent community salary analysis by role and certification. https://www.salesforceben.com
7. **Robert Half Technology Salary Guide** — US market compensation data for CRM administrators and related roles.
8. **Glassdoor / Levels.fyi — Salesforce Administrator Compensation Data** — Crowd-sourced base salary ranges for full-time Salesforce admins.
9. **Salesforce — Agentforce and AI in the Platform** — Salesforce's AI agent and assisted-configuration roadmap relevant to the 2030 outlook. https://www.salesforce.com/products/agentforce
10. **Salesforce — Flow and Flow Builder Documentation** — Automation tooling scope informing the automation-volume complexity dimension. https://help.salesforce.com
11. **Salesforce — Revenue Cloud / CPQ Documentation** — CPQ product scope underpinning the CPQ-as-complexity-multiplier analysis. https://www.salesforce.com/products/cpq
12. **Salesforce — Release Notes (three releases per year)** — Cadence driving the certification-maintenance and skill-currency cost line. https://help.salesforce.com/s/articleView?id=release-notes.htm
13. **Salesforce AppExchange — Consulting Partner Directory** — Directory of consulting agencies and managed-services partners, illustrating the agency-bench model. https://appexchange.salesforce.com/consulting
14. **Salesforce Partner Program — Consulting Partner Tiers** — Partner tier structure (Base through Summit) used to evaluate agency depth.
15. **US Bureau of Labor Statistics — Computer and Information Systems / IT Occupations** — Loaded-cost and benefits-multiplier context for full-time technical hires. https://www.bls.gov/ooh
16. **US Bureau of Labor Statistics — Employer Costs for Employee Compensation (ECEC)** — Data underpinning the 1.25x-1.4x base-to-loaded-cost multiplier. https://www.bls.gov/ecec
17. **Salesforce Trailblazer Community** — Primary sourcing and community channel for admin hiring and contractor referrals. https://trailblazercommunity.salesforce.com
18. **RevOps Co-op / Wizards of Ops — RevOps Community Resources** — Practitioner discussion of where Salesforce admin functions sit within RevOps org structures.
19. **Salesforce Ben — Salesforce Admin vs Consultant vs Developer** — Community analysis of role boundaries informing the build-vs-maintain distinction. https://www.salesforceben.com
20. **Gartner — CRM and Sales Technology Total Cost of Ownership Research** — Framework context for multi-year TCO modeling of CRM operations staffing.
21. **Forrester — Salesforce Implementation and Operations Cost Analysis** — Industry analysis of implementation (build) versus ongoing operations (maintain) cost structures.
22. **Salesforce — Sandbox and Release Management Documentation** — Release-process scope informing the senior-admin responsibility set.
23. **OnlineJobs.ph, Toptal, Upwork — Salesforce Contractor Marketplaces** — Marketplaces illustrating onshore and offshore contractor rate ranges.
24. **Salesforce Managed Services Provider offerings (e.g., CloudKettle, Coastal, Cloud Coach, Penrod)** — Representative managed-services retainer models and pricing structures.
25. **AICPA / Standard Professional Services SOW Templates** — Statement-of-work discipline and acceptance-criteria language applicable to agency engagements.
26. **Salesforce — Multi-Cloud Product Documentation (Sales, Service, Experience, Marketing Cloud)** — Cloud-specific configuration scope underpinning the multi-cloud complexity dimension.
27. **Salesforce — Data Model and Custom Object Documentation** — Object-architecture scope informing the object-count complexity dimension. https://help.salesforce.com
28. **Salesforce — Integration Patterns and Practices** — Integration architecture scope informing the integration-count liability analysis. https://developer.salesforce.com
29. **Tenth Revolution Group — Careers and Hiring Trends in the Salesforce Ecosystem** — Annual report on demand, supply, and contractor-vs-permanent hiring patterns.
30. **Salesforce — State of the Salesforce Economy / IDC Study** — Ecosystem sizing context for the talent pool and partner market referenced throughout.

`;

const num = `

## Numbers

**Full-Time Admin Cost**
- Junior admin base salary: $70K-$95K
- Mid-level admin base salary: $90K-$135K
- Senior admin base salary: $135K-$170K
- Base-to-loaded-cost multiplier: 1.25x-1.4x
- Mid-level admin all-in loaded cost: $140K-$175K/year
- Senior admin all-in loaded cost: $200K-$250K/year
- Ramp to full effectiveness: 2-4 months (longer for complex orgs)
- Salesforce release cadence driving skill-maintenance cost: 3 per year

**Contractor Cost**
- US generalist admin contractor rate: $75-$110/hr
- US senior / specialist contractor rate: $125-$175/hr
- US contractor rate full range: $60-$150/hr
- Typical steady-state engagement: 10-40 hrs/month
- 20 hrs/month at $110/hr: ~$2,200/month, ~$26K/year
- 40 hrs/month at $130/hr: ~$5,200/month, ~$62K/year
- Offshore / nearshore admin rate: $20-$50/hr

**Agency / Managed Services Cost**
- Managed-services monthly retainer: $2K-$15K/month
- $5K/month retainer annualized: $60K/year
- Project / SOW engagement range: $15K-$150K+
- CPQ implementation project: $80K-$200K
- Classic-to-Lightning migration project: $40K-$120K
- Focused integration project: $15K-$40K

**ARR Threshold Anchors (Sniff Test Only)**
- Under ~$2M ARR: fractional contractor or founder-admin
- $2M-$10M ARR: first full-time admin (if complexity warrants) or strong contractor
- $10M-$30M ARR: full-time admin + contractor overflow / part-time senior
- $30M+ ARR: admin team, or 1-2 FT admins + standing agency

**Org Complexity Dimensions**
- User count and persona spread
- Object count (standard vs custom)
- Integration count (each a standing liability)
- CPQ presence (complexity multiplier)
- Multi-cloud presence (Sales/Service/Experience/Marketing)
- Automation volume (flows, legacy process builders, Apex triggers, scheduled jobs)
- Rolled to: low / moderate / high / severe

**Admin-To-User Ratio Heuristic**
- Light-touch org: ~1 admin per 30-50 users
- Heavily customized org: ~1 admin per 20-30 users
- Ratio swings ~2x based on customization alone

**Certification & Pay Ladder**
- Certified Administrator: $70K-$95K base / $60-$95/hr
- Advanced Administrator: $95K-$130K base / $90-$140/hr
- Advanced Admin + Platform App Builder: $120K-$150K base
- Consultant / Architect tier: $140K-$200K+ base

**Accidental Admin Cost**
- RevOps leader fully-loaded cost: $180K-$300K+
- At 30% time in Salesforce config: $54K-$90K+/year of misallocated cost
- Executed slower, by a non-specialist, while strategic work goes undone

**3-Year TCO By Org Size**
- Small org full-time admin: ~$420K-$495K (under-utilized)
- Small org contractor (20 hrs/mo): ~$78K-$96K
- Mid org full-time admin: ~$450K-$540K (well-utilized)
- Mid org hybrid total (admin + overflow/agency): ~$600K-$850K
- Large org admin team: ~$1.05M-$1.8M
- Large org agency / managed services add-on: ~$150K-$400K
- Large org hybrid total: ~$1.2M-$2.2M
- Premature full-time hire cost vs contractor: 4-5x

**Switch Triggers**
- Contractor to full-time: backlog never shrinks + knowledge in one head + response time hurting reps + no roadmap owner (2+ true)
- Full-time too early: utilization under 50% + inventing work to justify seat
- Add agency: any real build appears
- Move to team: one admin can no longer hold the org

**5-Year (2030) Outlook**
- AI-assisted compression of routine admin workload: ~30-50%
- Effect on full-time threshold: shifts upward
- Effect on fractional / managed-services models: structurally stronger
- What AI does not compress: ownership, judgment, change management, complex architecture

**Hybrid Model Threshold**
- Dominant end-state above: ~$20M ARR
- Configuration: full-time admin (or team) owns steady-state + agency for projects

`;

const counter = `

## Counter-Case: When The ARR-Threshold Framing Itself Misleads

The entire premise of this question — "at what ARR threshold" — deserves to be stress-tested, because the framing itself is where the most expensive mistakes originate. ARR-threshold thinking feels rigorous and is dangerously lossy.

**Counter 1 — The complex org at low ARR that needs full-time immediately.** Consider a $5M ARR company that, for whatever reason — an enterprise sales motion from day one, an early CPQ purchase, a multi-cloud footprint, four mission-critical integrations — runs a brutally complex Salesforce org. Every ARR anchor says "first full-time admin is *maybe* defensible at $5M." The anchors are wrong here. This company needs a full-time admin *now*, possibly a senior one, possibly with contractor support on top — and the company that waits for the "right" ARR threshold accumulates technical debt and operational risk that costs far more to unwind than the salary would have cost. Low ARR does not mean low complexity, and complexity is what generates the work.

**Counter 2 — The simple org at high ARR that a contractor handles fine.** The mirror case: a $50M ARR company with a dead-simple, single-cloud, standard-object, lightly-automated org — perhaps a PLG business where Salesforce is a thin CRM layer over a self-serve motion, perhaps a company with a small high-ACV sales team. ARR anchors scream "admin team." That would be over-staffing. A strong contractor, or at most a single part-time senior admin, genuinely handles this org well, and will for years. Hiring an admin team because "a $50M company should have one" is inventing cost to satisfy a benchmark. High ARR does not mean high complexity either.

**Counter 3 — When the real problem is the absence of a systems roadmap, not the staffing model.** Frequently the company asking "should we hire an admin?" has misdiagnosed its own problem. The symptom — slow Salesforce delivery, a messy org, frustrated reps — is real, but the cause is not understaffing. The cause is that *nobody owns a systems roadmap*: there is no governance, no prioritization, no architectural intent, no plan for what the platform should become. Hiring a full-time admin into that vacuum does not fix it; it just gives the chaos a dedicated executor. The org gets messier *faster*, because now there is throughput without direction. The fix is to establish ownership and a roadmap first — which a strong RevOps leader, a fractional architect, or a well-scoped agency engagement can do — and *then* staff against the actual shape of the work. Throwing a staffing model at a governance problem is a classic and expensive misdiagnosis.

**Counter 4 — When hiring full-time becomes a way to avoid fixing process debt.** Related but distinct: sometimes the full-time hire is an *avoidance* mechanism. The org is a mess because of years of un-refactored process debt — redundant automation, conflicting fields, undocumented integrations, layout sprawl. Fixing that debt is hard, unglamorous, and requires saying no to stakeholders. Hiring a full-time admin can become the comfortable alternative: "we'll hire someone to deal with it." But a new admin inheriting a debt-laden org without a mandate and a remediation plan will spend their first year firefighting symptoms, the debt will keep compounding, and in eighteen months the company concludes "we need a *second* admin" — when the real need was a deliberate debt-paydown project (often agency-shaped) and *then* a right-sized steady-state hire. Headcount as a substitute for confronting process debt is throwing bodies at a problem that needs a decision.

**Counter 5 — When the ARR proxy is "right" for the wrong reasons.** Sometimes the ARR anchor produces the correct staffing answer, but the company adopts it without understanding *why*, and then cannot adapt when conditions change. A company that hired a full-time admin at $8M "because that's the threshold" — and happened to be right because the org was genuinely complex — will not know to add an agency when a CPQ project appears, will not know to move to a team when complexity outgrows one person, and will not recognize the switch triggers, because it never reasoned from complexity and backlog in the first place. Being accidentally right is not the same as having a method, and only a method survives the next decision.

**Counter 6 — When "agency" or "contractor" is chosen to dodge a headcount conversation.** Sometimes the model choice is driven by org politics, not the work. A leader who cannot get headcount approved routes genuine, continuous, ownership-shaped full-time work through a contractor or an agency retainer instead — not because that is the right model, but because contractor spend hides in an opex line while headcount requires a fight. The result is paying premium rates indefinitely for work that wanted an employee, plus the continuity and ownership gaps that come with it. The inverse also happens: a leader who *can* easily get headcount hires full-time for work that was genuinely contractor-shaped, because hiring is the path of least resistance. In both cases the budgeting structure, not the work, drove the decision — and that is its own anti-pattern.

**Counter 7 — When the framework's own inputs are gamed.** The decision framework depends on an *honest* complexity score and an *honest* backlog assessment. Both are easy to distort. A leader who wants a full-time hire can describe the org as more complex than it is and the backlog as more continuous than it is; a finance leader who wants to avoid the cost can do the reverse. The framework is only as good as the honesty of its inputs — which is why the three-year TCO model matters as a check, and why the practical test in hiring and the SOW discipline in agency management matter: they are the places where vague claims meet concrete reality.

**The honest verdict.** ARR-threshold thinking is not useless — it is a reasonable opening hypothesis, and the anchors in this entry are offered in exactly that spirit. But the framing is a trap if it becomes the *decision* rather than the *starting question*. The complex-org-at-low-ARR and simple-org-at-high-ARR cases are common enough that anyone trusting the anchors blindly will eventually get an expensive one wrong. And the deeper traps — misdiagnosing a roadmap problem as a staffing problem, using headcount to avoid confronting process debt, letting budget politics rather than the work choose the model — are not edge cases; they are among the most common ways companies mis-staff Salesforce. The defense is the same in every case: reason from complexity, backlog, and project pipeline; model three years of real TCO; match the model to the *shape* of the work; and treat ARR as the question's first hypothesis, never its answer.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a bookkeeping business in 2027? (Adjacent ops-function staffing economics; build-vs-maintain and fractional-vs-full-time logic parallels.)
- **q9502** — How do you start a CPA firm in 2027? (Professional-services bench model that mirrors the Salesforce agency structure.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (AI-compression-of-headcount logic that parallels the 2030 admin outlook.)
- **q9601** — How do you start a fractional CFO business in 2027? (The fractional model applied to finance leadership; same sub-full-time economics as the fractional admin.)
- **q9602** — How do you start an outsourced controller business in 2027? (Managed-services middle-path model in an adjacent function.)
- **q9701** — What is the best practice management software for bookkeeping firms? (Tooling-governance parallel to Salesforce org governance.)
- **q9702** — How do you hire offshore bookkeepers? (Offshore-staffing tradeoffs that directly parallel the offshore-admin section.)
- **q9505** — How do you scale a bookkeeping firm past $500K revenue? (Team-structure scaling logic relevant to the admin-team transition.)
- **q9801** — What is the future of bookkeeping in 2030? (AI-compression-of-routine-work outlook that parallels the Agentforce analysis.)
- **q9802** — How will AI change bookkeeping by 2030? (Companion AI-disruption analysis for the 5-year outlook section.)
- **q1946** — How do you start a real estate investing business in 2027? (Complexity-vs-revenue mismatch logic in a different domain.)
- **q9603** — How do you start a tax preparation business in 2027? (Seasonal-vs-steady-state capacity planning parallel.)
- **q9604** — How do you start a financial advisor business in 2027? (Advisory-vs-execution role-boundary parallel to admin-vs-architect.)
- **q9629** — How do you start a rental property bookkeeping business in 2027? (Vertical-specialization and TCO-modeling methodology reference.)
- **q9501b** — RevOps tooling stack decisions (CRM-platform ownership and governance context.)

`;

const tags = ['revops','salesforce','salesforce-admin','staffing','hiring','contractor-vs-agency','org-design','total-cost-of-ownership','2027','crm-operations'];

const sources = [
  { title: 'Salesforce — Salesforce Administrator Certification', url: 'https://trailhead.salesforce.com/credentials/administrator' },
  { title: 'Mason Frank / Tenth Revolution Group — Salesforce Salary Survey', url: 'https://www.masonfrank.com/salary-survey' },
  { title: 'Salesforce — Agentforce and AI in the Platform', url: 'https://www.salesforce.com/products/agentforce' }
];

const notes = {
  s6: 'Added 30 cited sources: Salesforce certification documentation (Administrator, Advanced Administrator, Platform App Builder, Architect tracks), compensation benchmarks (Mason Frank/Tenth Revolution salary survey, Salesforce Ben, Robert Half, Glassdoor/Levels.fyi), product documentation (Agentforce, Flow, Revenue Cloud/CPQ, multi-cloud, integration patterns), BLS loaded-cost and ECEC benefits-multiplier data, AppExchange consulting partner directory and partner tiers, contractor marketplaces (Toptal, Upwork, OnlineJobs.ph), managed-services provider models, and Gartner/Forrester TCO and build-vs-maintain cost research.',
  s7: 'Added comprehensive numerical analysis: full-time admin cost ladder ($70K-$170K base, 1.25x-1.4x loaded multiplier, $140K-$250K all-in), contractor rates ($60-$175/hr onshore, $20-$50/hr offshore, 10-40 hrs/month engagements), agency/managed-services pricing ($2K-$15K/month retainers, $15K-$150K+ projects), the four ARR anchors, the six org-complexity dimensions, admin-to-user ratio heuristic (1:30-50 light, 1:20-30 heavy), certification pay ladder, accidental-admin misallocation math ($54K-$90K+ of hidden cost), full 3-year TCO by org size (small/mid/large, $78K to $2.2M), switch triggers, and the 2030 AI-compression estimate (30-50%).',
  s8: 'Added 7-part counter-case stress-testing the ARR-threshold framing itself: the complex-org-at-low-ARR that needs full-time immediately ($5M with CPQ+multi-cloud), the simple-org-at-high-ARR a contractor handles fine ($50M PLG), misdiagnosing an absent-systems-roadmap problem as a staffing problem, hiring full-time to avoid confronting process debt, being accidentally right without a method, choosing contractor/agency/full-time to dodge headcount politics rather than match the work, and gaming the framework inputs — closing with the verdict that ARR is a starting hypothesis, never the answer.',
  s9: 'Cross-linked 15 related Pulse entries: ops-function staffing economics (q9501/q9502/q9505), fractional and managed-services models in adjacent functions (q9601/q9602/q9603), AI-compression-of-headcount outlook (q1899/q9801/q9802), offshore-staffing tradeoffs (q9702), tooling/org governance (q9701), complexity-vs-revenue mismatch parallels (q1946), and vertical-specialization/TCO methodology (q9629).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the Salesforce-admin staffing decision (full-time vs contractor vs agency) for a RevOps/CRO/COO/founder audience. Two mermaid diagrams (the staffing decision tree: complexity score + backlog depth + project pipeline + budget TCO -> contractor/full-time/managed-services/hybrid/admin-team/agency, with switch triggers; and the 3-year TCO comparison across the three models at small/mid/large org sizes). Full coverage: the three staffing models precisely defined, ARR threshold anchors with the loud caveat that ARR is a weak proxy, the six real org-complexity drivers, separate cost-comparison sections for full-time/contractor/agency, what each model is right for, the hybrid model as the dominant >$20M end-state, the accidental-admin anti-pattern, the admin-to-user ratio heuristic and its limits, the certification/pay ladder, the build-vs-maintain distinction, red flags for outgrowing a contractor and for hiring full-time too early, the managed-services middle path, geographic/offshore options, the full 3-year TCO model, hiring the first full-time admin, managing an agency relationship, the RevOps-org reporting-line context, five real-world scenarios ($3M PLG / $12M sales-led / $40M multi-cloud / $100M enterprise / $8M post-acquisition), the four-input decision framework, the 2030 AI-compression outlook, a final compressed framework, and a 7-part counter-case attacking the ARR-threshold framing itself.'
};

runPolish({ id: 'q9510', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
