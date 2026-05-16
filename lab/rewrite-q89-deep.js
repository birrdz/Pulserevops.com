// q89 — What's the trigger to launch an enterprise motion separate from mid-market?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** The trigger to launch a dedicated enterprise motion separate from mid-market is **not a revenue number — it is a pattern of evidence that your existing motion is structurally incapable of capturing demand you are already generating**. The cleanest go-signal is when **four or more of seven trigger signals** fire simultaneously: (1) **inbound enterprise demand exceeds 15% of pipeline** but converts at less than half your mid-market rate; (2) **mid-market reps are repeatedly losing six-figure deals to incumbents** they cannot out-navigate; (3) you have **hit an ACV ceiling** — your top 10% of deals cluster at a number you cannot break through; (4) you are **losing deals on security questionnaires** and SOC 2 / SSO gaps, not on product value; (5) **competitor displacement opportunities** are appearing that need 9-month cycles your reps will not run; (6) the **board is pressuring for logos** and named-account penetration; and (7) the **product is genuinely enterprise-ready** (SSO/SAML/SCIM, audit logs, RBAC, SOC 2 Type II, uptime SLA, DPA). The signal that is **necessary but never sufficient** is product readiness — launching enterprise sales on a product that fails security review just burns AEs and reference equity. The cost structure is steep: an enterprise AE runs **$160K base + $160K variable ($320K OTE)** carrying a **$1.2M–$2M quota**, needs a **solutions engineer at roughly 1:2**, plus deal desk, legal, and a security/compliance function — realistically a **$1.5M–$3M, 12–18 month investment before the team is net-positive**. The correct first-hire sequence is **#1 enterprise AE → SE → enterprise CSM → enterprise sales leader once you reach 4–6 reps**, never a leader first. The dominant failure mode is **launching too early**: a premature enterprise motion starves mid-market of capital and attention, the security investment never gets recouped, enterprise gross margin comes in worse than the blended number, and the founder gets pulled into a swamp of procurement and legal cycles. Net: treat enterprise as a **separate company you are incubating inside your company** — separate comp, separate process, separate hiring bar — and only pull the trigger when the evidence is overwhelming and the product can survive a CISO review.`;

const core = `

## The Definition Problem: What "Enterprise" Actually Means

Before a CRO can decide whether to launch an enterprise motion, the leadership team has to agree on what "enterprise" means — and most teams discover, when they actually write it down, that they have been using the word to mean three or four incompatible things. To one person it means "a big logo." To another it means "a deal over $100K." To a third it means "a company we saw at a conference." None of those are operational definitions, and a motion built on a fuzzy definition will hire the wrong people, build the wrong process, and forecast garbage.

An operational definition of enterprise has five components, and a true enterprise account hits most or all of them. **First, company size: 2,000+ employees** — and increasingly the more useful cut is 5,000+ or the Fortune/Global 2000, because the buying behavior changes qualitatively, not just quantitatively, somewhere in that band. **Second, deal size: $250K+ ACV** as a floor, often $500K–$1M+, with multi-year total contract value frequently in the seven figures. **Third, the buying committee: 8+ stakeholders**, and often 12–20 when you count economic buyer, champion, technical evaluators, security, legal, procurement, IT, finance, and the executive sponsor. **Fourth, cycle length: 6–12 months** from first qualified conversation to signature, sometimes 18 months for net-new category creation. **Fifth, the gauntlet: a mandatory procurement process, a legal/MSA negotiation, and a security and compliance review** that can independently kill the deal regardless of how much the champion loves the product.

The reason the definition matters so much is that **each of those five attributes breaks a specific assumption baked into a mid-market motion**. A mid-market rep is comp'd and coached to run a 30–60 day cycle, work two or three contacts, send an order form, and move on. Drop that rep into an 8-month, 14-stakeholder, procurement-gated deal and they will either abandon it (because their comp plan punishes time spent) or mishandle it (because they have never multi-threaded an org chart or survived a redline negotiation). The definition problem is therefore not academic hair-splitting — **it is the thing that determines whether you need a separate motion at all**. If your "enterprise" deals are really just $80K mid-market deals with a recognizable logo, you do not need an enterprise motion; you need better logos in your existing motion. You only need a separate motion when the deals genuinely have the five attributes above, because only then does the existing motion structurally fail to capture them.

A useful discipline: write the five-attribute definition down, then go pull your last 24 months of closed-won and closed-lost data and tag every deal against it. You will usually find that "enterprise" is 6–12% of deals, that those deals close at a meaningfully lower rate than mid-market, and that the win rate craters specifically at the procurement and security stages. That data set is the foundation for every decision that follows.

## The 7 Trigger Signals: The Evidence That Says "Now"

There is no revenue threshold that tells you to launch enterprise. A $20M company with the wrong product should not, and a $12M company with screaming enterprise demand and a security-ready product probably should. The trigger is a **pattern of evidence**, and the discipline is to require that **four or more of the following seven signals are firing at once** before you commit capital. Any one signal alone is noise; four together is a structural condition.

**Signal 1 — Inbound enterprise demand exceeds 15% of pipeline.** Pull your pipeline and tag it against the five-attribute definition. If genuine enterprise opportunities are consistently 15%+ of inbound — and critically, if they are converting at *less than half* your mid-market rate — you have demand you are already paying to generate and structurally failing to capture. That gap is the single most expensive thing in your funnel, because the marketing cost is sunk and the conversion loss is pure.

**Signal 2 — Mid-market reps are repeatedly losing six-figure deals to incumbents.** Read the closed-lost notes on every deal above $150K. If the pattern is "lost to [incumbent], they had relationships above our champion" or "we never got to the economic buyer," your reps are not losing on product — they are losing because they cannot navigate an enterprise org. That is a motion problem, not a rep-quality problem, and it does not get better with coaching.

**Signal 3 — You have hit an ACV ceiling.** Chart the distribution of your deal sizes. If your top decile clusters tightly at a number — say everything bunches at $60K–$90K and almost nothing breaks $120K — you have a structural ceiling. Mid-market motions have a natural ACV ceiling because the packaging, the pricing, the buyer, and the rep all top out together. Breaking it requires a different motion, not a stretch goal.

**Signal 4 — Repeated security-questionnaire and compliance losses.** If you are losing deals at the security review stage — failing on SOC 2, SSO/SAML, data residency, penetration testing evidence — and the champion is telling you "we love it but security blocked us," that is a flashing signal. It is also a *prerequisite* signal: it tells you both that enterprise demand is real and that you are not yet ready to serve it. (More on this in the Product Prerequisites and Security Investment sections.)

**Signal 5 — Competitor displacement opportunities are appearing.** When prospects start coming to you mid-contract with an incumbent — "we are unhappy with [vendor], our renewal is in 9 months, can you displace them" — those are enterprise-shaped deals by nature: long cycles, heavy proof-of-concept requirements, executive sponsorship, procurement. A mid-market rep will not run a 9-month displacement; their comp plan will not let them. If these opportunities are showing up and dying on the vine, that is signal.

**Signal 6 — Board pressure for logos.** This one is real but dangerous. Boards and investors push for marquee logos because logos drive the next round's narrative and the eventual multiple. Board pressure is a legitimate *input* — it reflects that the market and your investors see an enterprise opportunity — but it must never be the *deciding* signal on its own. Board pressure plus three evidentiary signals is a go. Board pressure alone is how companies launch enterprise motions 18 months too early.

**Signal 7 — Product readiness for enterprise.** The product genuinely supports SSO/SAML/SCIM, audit logs, RBAC, the security certifications, API rate limits appropriate to large deployments, and an uptime SLA you can contractually stand behind. This signal is **necessary but never sufficient** — a ready product with no demand is not a reason to launch, but unready product with screaming demand is a reason to *wait and build*, not to launch and lose.

The decision rule: **count the signals. Fewer than four, keep optimizing mid-market. Four or more, and one of them is product readiness, you have a real trigger.** The mermaid decision tree in the workflow section walks this exact logic.

## The "Accidental Enterprise Deal" Pattern

Long before a company formally debates launching an enterprise motion, it has already run a dozen unintentional experiments — and lost almost all of them. The pattern is so consistent it deserves a name: the **Accidental Enterprise Deal**.

It goes like this. A mid-market rep, working their normal territory, gets an inbound from someone at a 9,000-person company. The rep is thrilled — this is a whale. They run their normal playbook: a demo, a proposal, a follow-up, an order form. For the first three weeks it feels great; the champion is engaged and enthusiastic. Then the deal hits the wall. The champion says, "Great, now I need to get this through security review and procurement." The rep has never seen a security questionnaire with 300 line items. They have never been redlined on an MSA. They do not know what a DPA is, they have never been asked about sub-processors or data residency, and they have no idea that procurement will demand a competitive bid and a 15% discount as a matter of policy. The champion goes quiet for six weeks because they are navigating internal politics the rep cannot see and cannot help with. The rep, whose comp plan rewards velocity, mentally writes the deal off and stops investing. One of two things then happens: **the deal dies** — the champion loses momentum without air cover and the initiative stalls — or, worse, **the deal closes badly** — the rep, desperate to salvage it before quarter-end, caves to procurement's discount demand and signs a $250K-potential account at $70K on a one-year term with no expansion path and a margin-destroying support commitment.

This pattern is itself one of the most important pieces of trigger evidence, for three reasons. First, **it proves the demand is real** — enterprises are finding you organically. Second, **it proves the existing motion cannot capture it** — not because the reps are bad, but because the motion is structurally wrong for the deal. Third, **it quantifies the cost of inaction**: every accidental enterprise deal that dies or under-prices is measurable lost ACV, and once you add it up over 18 months, the number is usually large enough to fund the motion you have been hesitating to build. The accidental enterprise deal is the universe telling you, expensively and repeatedly, what it is telling you.

## Enterprise Motion Cost Structure

The reason "just hire an enterprise rep and see what happens" is bad advice is that the enterprise motion is not a rep — it is a *system*, and the system has a cost structure that has to be funded as a whole or it does not function.

**The enterprise AE.** Compensation runs roughly **$160K base + $160K variable, a $320K OTE**, sometimes higher in competitive talent markets, carrying an annual quota of **$1.2M–$2M**. The variable is structured 50/50 base-to-variable (versus the more aggressive 60/40 or 70/30 splits common in transactional roles) precisely because enterprise cycles are long and lumpy and you cannot ask someone to live on commission with an 8-month cycle.

**The solutions engineer.** Enterprise deals are technical, and the AE cannot run them alone. You need an SE at roughly a **1:2 ratio** (one SE supporting two AEs) early on, sometimes 1:1 in highly technical categories. An enterprise SE costs roughly **$160K–$220K OTE**. Skipping the SE is one of the classic under-hiring mistakes — it does not save money, it just lowers your win rate until the AE quits.

**Deal desk.** Enterprise pricing is bespoke: multi-year terms, ramped deals, custom usage tiers, volume discounts. Someone has to own quote construction, approval workflows, and pricing discipline. Early on this can be a fractional responsibility of a RevOps or finance person, but it is real work and it has to be owned.

**Legal.** Enterprise deals come with MSA negotiations, redlines, DPAs, security addenda, and custom terms. You will need either a dedicated commercial counsel or a reliable outside-counsel relationship with fast turnaround, because legal latency directly extends your cycle and kills momentum.

**Security and compliance.** This is its own function (covered in depth below) — at minimum a security lead, the certification investments, and questionnaire-response capability.

Add it up and the realistic first-year cost of a credible enterprise motion — two AEs, an SE, partial deal desk and legal, and the security function — is **$1.5M–$3M**, and the team will not be net contribution-positive for **12–18 months** because of the cycle length. That is the number leadership has to be willing to commit. A half-funded enterprise motion is worse than no enterprise motion, because it consumes capital and reference equity and produces neither pipeline nor proof.

## The Enterprise AE Profile

The single most expensive mistake in launching enterprise is promoting your best mid-market rep into the first enterprise seat. Top mid-market reps are excellent at velocity, volume, and running a tight transactional process — and almost none of those skills transfer. Enterprise selling is a different job.

The enterprise AE profile: **10+ years of selling experience**, with a track record specifically of closing six- and seven-figure deals, not a long tenure of closing many small ones. Fluency in a structured enterprise qualification methodology — **MEDDPICC or MEDDICC** — not as a buzzword but as a discipline they actually run. **Multi-threading experience**: the ability to build and maintain relationships across an entire buying committee simultaneously, to map an org chart, to find and develop a champion while also cultivating the economic buyer and neutralizing detractors. **Executive presence**: the credibility to sit across from a CIO or CISO and be taken seriously as a peer, because enterprise deals are won and lost in the executive conversations. And — most underrated — **patience and pipeline discipline for long cycles**: the temperament to work a deal for nine months without the dopamine of frequent closes, and the discipline to keep building pipeline 6–9 months ahead because today's empty calendar is next year's missed number.

You hire this person from outside, you pay market, and you accept that they will ramp slowly. Which leads directly to the comp and ramp design covered later.

## Product Prerequisites: The Enterprise-Ready Checklist

An enterprise motion sells what the product can deliver, and enterprise buyers — specifically their IT and security organizations — have a hard checklist. Failing any item on it does not lose you points; it removes you from consideration. Before launching, the product must credibly support:

**Identity and access.** SSO via SAML 2.0, SCIM provisioning for automated user lifecycle management, and granular role-based access control (RBAC). Enterprises will not manually manage users in your app, and they will not accept an app that cannot enforce their access policies.

**Auditability.** Comprehensive audit logs — who did what, when — exportable and ideally streamable to the customer's SIEM. Auditors and security teams require this.

**Security certifications.** SOC 2 Type II at minimum, ISO 27001 increasingly expected especially for international buyers, and **HIPAA or FedRAMP if you sell into healthcare or government** (FedRAMP in particular is a multi-year, multi-million-dollar commitment that should be a deliberate strategic decision, not a reaction to one deal).

**Architecture and reliability.** API rate limits appropriate to large-scale deployments, the option of dedicated or isolated environments for customers who require data segregation, and a contractual **uptime SLA** with credits — enterprises will redline your agreement to insert one if you do not offer it.

**Legal and data.** A **Data Processing Agreement (DPA)** ready to go, a published sub-processor list, and clear data residency options for customers with geographic data-handling requirements.

Two things to internalize. First, **this checklist is the long pole**. The sales motion can be stood up in a quarter; the product and security work to satisfy this list can take 12–18 months. Second, this is why **product readiness is the necessary-but-not-sufficient trigger signal** — if every other signal is screaming but the product fails this checklist, the correct move is to fund the product and security roadmap *now* so that you are ready when you launch, not to launch and burn your first AEs and your first reference accounts losing deals at security review.

## The Security and Compliance Investment

Of all the prerequisites, security and compliance is the one most consistently underestimated, and it deserves its own treatment because it is a function, a budget line, and a timeline — not a checkbox.

**SOC 2 Type II** is the table-stakes certification. Realistically it costs **$30K–$100K** all-in (auditor fees, tooling, internal time, remediation) and takes **6–12 months**, because Type II requires an observation period — you cannot compress it. ISO 27001 is a parallel or follow-on investment, important for international and especially European buyers. **Penetration testing** by a reputable third party, conducted at least annually, is expected, and enterprise buyers will ask for the report (or at least an executive summary).

You will also need to **hire a security function** — at first this might be a single strong security lead or a fractional CISO, but it grows into a team as the enterprise book grows. And you need **questionnaire-response capability**, because enterprise buyers send security questionnaires of 200–500 questions and a slow or sloppy response visibly kills deals. Tooling here — **Vanta, Drata, or SecureFrame** — automates evidence collection for continuous compliance and, critically, builds a reusable knowledge base so that the fortieth security questionnaire takes hours instead of weeks.

The strategic point: **the security investment must be made before, not after, the enterprise motion launches.** If you launch sales first and try to pass security reviews you are not certified for, you will lose deals you cannot get back, burn the credibility of your AEs, and worse — burn reference accounts, because the few enterprises that do sign will have a painful first experience. Security is not the cost of scaling enterprise; it is the cost of *entering* enterprise.

## Pricing Floor and Discount Discipline for Enterprise

Enterprise pricing is a different discipline from mid-market pricing, and the discipline has to be designed and enforced from day one or the motion erodes itself.

**Set a pricing floor.** Enterprise deals should have a minimum ACV — commonly **$250K** — below which the deal either gets restructured or gets routed back to mid-market. The floor protects the unit economics of a motion whose cost-to-serve (SE time, security review, legal, CSM) is structurally high. A $90K "enterprise" deal carries enterprise cost-to-serve on mid-market revenue and loses money.

**Default to multi-year.** Enterprise buyers will sign two- and three-year terms in exchange for price certainty, and multi-year terms dramatically improve your retention, your forecast stability, and your valuation multiple. Build multi-year into the standard motion, not as an exception.

**Discipline the discount.** Enterprise procurement *will* ask for a discount — it is their job, and a 10–20% "procurement discount" is a normal cost of doing business. The discipline is to (a) hold list price as a real anchor, (b) trade discount for something — multi-year term, prepayment, expanded scope, a case study, a reference commitment — never give it for free, and (c) route deep discounts through deal desk and a senior approver.

**Protect the mid-market price.** The most dangerous failure: enterprise discounting that leaks back and cannibalizes the mid-market price book. If enterprise buyers — who should pay *more* per seat for more value, more security, more service — end up paying less per unit than mid-market buyers because of undisciplined discounting, you have inverted your own pricing logic. Enterprise pricing must sit *above* mid-market on a per-unit basis, and the discounting process must be firewalled so it never resets mid-market expectations.

## The Enterprise Sales Process

The enterprise sales process is not a longer mid-market process — it is a structurally different process with stages, artifacts, and disciplines that do not exist in transactional selling.

**MEDDPICC as the operating system.** Metrics, Economic buyer, Decision criteria, Decision process, Paper process, Identify pain, Champion, Competition — every enterprise deal is qualified and inspected against these eight elements at every stage. The "Paper process" element alone — explicitly mapping the procurement, legal, and security path *early* — is what prevents the accidental-enterprise-deal death spiral.

**Mutual Action Plans (MAPs).** A jointly built, written plan with the customer that lays out every step from here to signature and go-live, with owners and dates on both sides. The MAP turns an opaque enterprise cycle into a managed project and is the single best forecasting tool in enterprise sales.

**Executive sponsors.** Enterprise deals need an executive sponsor *on your side* matched to the buyer's executive — a VP or C-level who shows up for the key conversations. Founder/CEO involvement in early enterprise deals is appropriate and expected.

**Proof of concept / pilot.** Enterprise buyers de-risk with a structured POC or paid pilot. The discipline is to make it *time-boxed* and *success-criteria-defined* — an open-ended pilot is a deal that never closes.

**Procurement navigation.** Treat procurement as a stakeholder to be managed, not an obstacle that appears at the end. The AE should know the procurement process, the typical timeline, and the typical asks before the champion ever introduces them.

## The First Enterprise Hire Sequence

The order of hires is one of the highest-leverage decisions, and the correct sequence is counterintuitive to most leadership teams, who instinctively want to "hire a leader to build it."

**Hire #1 — the first enterprise AE.** A senior, proven individual contributor who can both close deals *and* help define the playbook. You learn the motion through this person's real deals.

**Hire #2 — the solutions engineer.** As soon as the first AE has live technical deals, they need SE support. Do not let the AE limp along without it.

**Hire #3 — the enterprise CSM.** Before the first enterprise deals go live, you need a customer success function built for enterprise — because a botched first enterprise implementation poisons your reference pool, and references are everything in enterprise (see the Reference Customer Bootstrap section).

**Hire #4 — the enterprise sales leader, once you reach 4–6 reps.** Only when you have proven the motion with 4–6 carrying reps do you hire a dedicated leader to scale it. Hiring the leader first means paying a senior leader to do an IC's job of discovering the motion, and it means the motion gets defined by someone who is not in the deals. Founder or CRO directly manages the first few reps; the dedicated leader comes in to scale a proven thing.

## Marketing Support for Enterprise

An enterprise motion needs its own marketing support, distinct from the demand-gen engine that feeds mid-market. The core elements: **account-based marketing (ABM)** targeting a defined list of named accounts — coordinated, multi-channel, multi-stakeholder campaigns against the specific logos the enterprise reps are assigned. **Executive events** — intimate dinners, roundtables, and curated gatherings where economic buyers actually show up, which look nothing like the top-of-funnel webinar machine. **Analyst relations** — engaging Gartner and Forrester so that when an enterprise buyer's procurement team does its diligence, you appear in the research (covered in depth below). And a **customer advisory board** — bringing your most strategic customers together both to guide the roadmap and to deepen the relationships that produce references and expansion.

## Customer Success for Enterprise

Enterprise customer success is a different tier of service, and it has to be staffed and designed before the deals land. **Named CSMs** — every enterprise account has a specific person, not a pooled queue. **Quarterly Business Reviews and Executive Business Reviews** — structured, scheduled reviews that demonstrate value to the champion and reconnect with the executive sponsor. A **dedicated support tier** with faster SLAs, because enterprise contracts will specify them. And, for the largest accounts, a **Technical Account Manager (TAM)** role — a technical resource assigned to the account to manage the deployment, integration, and ongoing technical health. Enterprise CS is expensive, and that cost is exactly why the pricing floor exists.

## The Reference Customer Bootstrap

Enterprise buyers do not want to be your first; they want to talk to a peer who already bought. This creates a chicken-and-egg problem: you need enterprise references to win enterprise deals, but you need enterprise deals to get references. Solving it is a deliberate program.

The play is to **land the first 3–5 lighthouse accounts intentionally** — accept that these deals will take longer, require more founder involvement, possibly more concession, and disproportionate CS investment, because their *strategic value as references* exceeds their contract value. Pick lighthouse accounts for recognizability and relevance to your target segment. Then **invest massively in their success** — these accounts must have flawless implementations and visible outcomes. Then **build the reference relationship explicitly** — case studies, willingness to take reference calls, speaking at your events — ideally negotiated into the original deal. The first 3–5 references are the hardest deals you will ever close and the highest-ROI marketing assets you will ever build.

## Analyst Relations Investment

Gartner and Forrester matter in enterprise because enterprise procurement teams use them as a diligence shortcut. Getting into a **Gartner Magic Quadrant** or **Forrester Wave** is a multi-quarter effort — formal briefings, inquiry engagements, reference customers supplied to the analyst, and often paid advisory relationships — and realistically costs in the low-to-mid six figures annually when you count subscriptions, advisory, and the internal AR function. The impact, when it lands, is real: presence in the relevant research removes a category of objection from procurement and shortens the diligence cycle. It is a deliberate investment with a 12–24 month payoff horizon, not a quick win.

## Channel and SI Partnerships for Enterprise

Large enterprises often buy through, or alongside, systems integrators and consultancies — **Accenture, Deloitte, the big SIs, and strong regional integrators**. A co-sell motion with SIs can be a major enterprise accelerant: the SI brings the relationship and the implementation capacity, you bring the product. But channel is its own motion with its own partner managers, enablement, and economics, and it is generally a *second-wave* investment — you build direct enterprise first, prove the motion, and then layer channel on top once you have references and a repeatable deployment. Launching channel and direct enterprise simultaneously usually means doing both poorly.

## 5 Real Case Studies

**HubSpot's enterprise tier.** HubSpot built its entire identity on SMB and mid-market inbound, then deliberately moved upmarket — launching enterprise editions of its products, building out enterprise-grade features (advanced permissions, SSO, more sophisticated reporting), and standing up a sales motion to match. The lesson: a company can move upmarket successfully, but it is a multi-year, deliberate investment in product *and* motion, not a pricing-page change.

**Zoom post-COVID.** Zoom rode a self-serve and SMB explosion, then faced the enterprise reckoning — large customers demanded security (the well-publicized 2020 security scrutiny forced a rapid, serious security investment), compliance, admin controls, and enterprise sales coverage. The lesson: hyper-growth in the lower segments will *generate* enterprise demand whether you are ready or not, and the security/compliance bill comes due.

**Notion's enterprise push (2023).** Notion grew through bottoms-up, viral, individual-and-team adoption, then in 2023 leaned into a formal enterprise effort — enterprise plan, SSO/SAML/SCIM, audit logs, advanced security, and an enterprise sales team — to convert all that grassroots usage into large contracts. The lesson: product-led growth creates enormous enterprise *potential*, but capturing it still requires the explicit enterprise motion, product hardening, and sales team.

**Airtable's enterprise motion.** Airtable followed a similar arc — broad bottoms-up adoption across teams inside large companies, then a deliberate enterprise build-out (Enterprise plan, admin and governance features, security certifications, enterprise sales and CS) to monetize the footprint it already had inside the Fortune 500. The lesson: "we already have users at the logo" is a powerful trigger signal, but users are not contracts until an enterprise motion converts them.

**Figma's enterprise tier.** Figma spread designer-by-designer inside organizations, then built an enterprise offering — org-wide administration, advanced security, SSO, and enterprise sales coverage — to consolidate that scattered adoption into enterprise-wide agreements. The lesson is the consistent one across all five: **bottoms-up adoption is the enterprise trigger, but the trigger only pays off if you actually build the separate motion to pull it.**

What unites all five cases is worth stating directly, because it is the single most important pattern in this entire decision. In every one of these companies, **the demand existed inside the enterprise long before the company had a motion to capture it**. HubSpot had marketers at large companies on its lower tiers. Zoom had users inside the Fortune 500. Notion, Airtable, and Figma all had grassroots, team-by-team footprints inside major enterprises. None of them created enterprise demand with an enterprise sales team — the demand was already there, generated by product and word of mouth, sitting un-monetized. What the enterprise motion did was *convert* an existing footprint into enterprise contracts. This reframes the trigger entirely: you are not asking "should we go create enterprise demand?" — that almost never works — you are asking "do we already have enterprise demand we are failing to capture, and is now the time to build the apparatus to capture it?" The trigger signals in this entry are, fundamentally, the diagnostic test for that exact question. And the corollary is sobering: if you do *not* already have evidence of organic enterprise demand — accidental enterprise deals, inbound from large logos, users inside big companies — then launching an enterprise sales team to manufacture that demand from scratch is the most expensive and lowest-probability version of this move. The motion converts demand; it rarely creates it.

## The Comp Plan Design

Enterprise comp is a different instrument from mid-market comp, and copying the mid-market plan is a classic, motion-breaking error. Enterprise quota lands around **$1.2M–$2M** per rep — higher absolute number, but lower as a multiple of OTE than transactional roles because cycles are long and lumpy. The **base/variable split is roughly 50/50**, not the 60/40 or 70/30 of transactional roles, because you cannot ask someone to survive 8-month cycles on a thin base. **Ramp is 9–12 months** — sometimes longer — and the comp plan must include a ramped quota and ramp guarantees, or you will lose good reps before they ever close. **Accelerators** above quota should be meaningful, because the whole point of an enterprise rep is the occasional outsized deal. And **multi-year deals should be SPIF'd or have favorable comp treatment** so reps are incentivized to land the term structure the business wants. Design the plan around the reality of the motion — long, lumpy, high-value — not around the cadence of the mid-market plan you already have.

## Forecasting Enterprise Pipeline

Enterprise pipeline forecasts differently and has to be inspected differently. Cycles are **longer and lumpier** — a single deal slipping a quarter can swing the number, so the law of large numbers that smooths a mid-market forecast does not apply. **Stage definitions are different** — enterprise stages should be defined by *buyer-verifiable milestones* (economic buyer engaged, security review passed, procurement initiated, MSA in redlines) rather than by seller activity. **Commit and best-case discipline** has to be stricter — every committed enterprise deal should have a MAP, a confirmed paper process, and a date the *buyer* agrees to. And you should forecast enterprise *separately* from mid-market, never blended, because blending hides the lumpiness and lets a soft enterprise quarter get masked by a strong mid-market one until it is too late to react.

## Org Structure: Separate Team, Overlay, or Pod

There are three structural models, and the choice depends on stage. **The overlay model** — enterprise specialists who parachute into deals sourced by the mid-market team — is the lightest-weight start and works when enterprise volume is low, but it creates comp and credit fights and rarely scales. **The pod model** — a self-contained unit of enterprise AE, SE, and CSM working as a team — is a strong middle option and a good way to run the first lighthouse-account phase. **The separate-team model** — a fully distinct enterprise organization with its own leader, its own pipeline, its own comp, its own forecast — is where you end up at scale, and it is the structure that protects the enterprise motion from being culturally and operationally dominated by the higher-velocity mid-market team. The general path: start as a pod (or overlay if volume is very low), and graduate to a separate team as you cross 4–6 reps and hire the dedicated leader.

## The Mistakes

The failure modes of an enterprise launch are well-known and almost always self-inflicted. **Launching too early** — before the product can pass a security review — is the most expensive, because it burns AEs, reference accounts, and capital all at once. **Under-hiring SE support** — making AEs run technical deals alone — quietly suppresses win rate until the AE quits. **Skipping the security investment** — trying to sell into enterprise without SOC 2, SSO, and questionnaire capability — loses deals you can never recover. **Letting mid-market reps keep their accidental enterprise deals** — out of a desire not to take deals away from reps — guarantees those deals die or under-price. **Pricing too low** — no floor, undisciplined discounting — produces a motion that loses money on every deal it wins and cannibalizes the mid-market price book. Every one of these is avoidable, and every one of them is committed constantly.

## When NOT To Launch Enterprise

The discipline of *not* launching is as important as the trigger to launch. Do not launch if **mid-market still has substantial runway** — if you can grow 40%+ by simply executing better in the segment you already win in, enterprise is a distraction from your best opportunity. Do not launch if **the product is not enterprise-ready** — if you fail the prerequisites checklist, fund the roadmap and wait. Do not launch if **you have no security posture** and no funded plan to build one. Do not launch if **you lack the capital** for a 12–18 month ramp — a half-funded enterprise motion is worse than none. And do not launch if **the only signal is board pressure** — board pressure plus evidence is a go; board pressure alone is the single most common reason companies launch 18 months too early.

## Capital Requirements

The honest capital picture: a credible enterprise motion is a **12–18 month investment before it is net-positive**, and the cash required to get there — two AEs, an SE, partial deal desk and legal, the security/compliance function and certifications, ABM and AR — is realistically **$1.5M–$3M** before the team contributes positive net new ARR after fully loaded cost. Leadership has to be willing and able to commit that capital *as a block*, not trickle it in, because a starved enterprise motion does not produce a smaller result — it produces no result, while still consuming the cash. If the company cannot fund the full 12–18 months, the correct decision is to wait until it can.

## 5-Year Outlook for the Enterprise SaaS Motion

The enterprise motion is changing in ways a CRO launching today should plan for. **AI is entering procurement** — enterprise buying teams are increasingly using AI to run vendor diligence, parse security documentation, and compare options, which raises the premium on having clean, structured, machine-readable security and compliance evidence. **The security baseline keeps rising** — what was differentiating (SOC 2) is now table stakes, and the bar moves up every year, meaning the security investment is permanent and growing, not one-time. **Buying committees are getting larger and more risk-averse**, lengthening cycles and raising the value of references and analyst validation. The net for a company deciding today: the enterprise motion is becoming *more* expensive to enter and *more* defensible once entered — which makes the timing decision, and the discipline of the trigger, more important rather than less.

## How the Trigger Decision Plays Out by ARR Stage

The trigger is the same set of signals at every stage, but how it tends to read changes with company size, and a CRO should calibrate expectations accordingly. **At $15M–$30M ARR**, the trigger is most often *premature* when teams want to pull it — the demand signals may be flickering, but the product rarely passes the prerequisites checklist, the capital base cannot absorb a $1.5M–$3M block without starving the core, and the leadership team does not yet have the bench to run two motions. At this stage, the highest-probability correct answer is "not yet — fund the product and security roadmap, keep winning mid-market, and re-run the checklist in two to four quarters." **At $30M–$75M ARR**, the trigger genuinely starts firing for real for a meaningful share of companies — the accidental-enterprise-deal pattern has produced enough lost ACV to be undeniable, the product has usually matured to or near the prerequisites bar, and the company can fund the motion as a block without breaking the core. This is the band where most well-run enterprise launches actually happen. **At $75M–$150M ARR**, the question is usually no longer *whether* but *how fast and how structured* — and the risk shifts from launching too early to launching too sloppily: overlay structures that should have become pods, comp plans copied from mid-market, no enterprise-specific forecast. The discipline at this stage is structural rigor, not timing restraint. Reading the trigger well means knowing which version of the question your company is actually facing.

## Final Trigger Checklist

The explicit go/no-go framework. **Go** when: four or more of the seven trigger signals are firing; one of those signals is genuine product readiness against the prerequisites checklist; you have a funded security and compliance posture or a funded plan to build one; you can commit $1.5M–$3M and 12–18 months as a block; mid-market either lacks runway or can be grown in parallel without starvation; and you have the leadership bandwidth (founder/CRO) to personally manage the first reps and the first lighthouse deals. **No-go** when: fewer than four signals fire; the product fails the prerequisites checklist; there is no security posture and no funded plan; the capital is not committed for the full ramp; mid-market still has large untapped runway; or board pressure is the only real driver. Run the checklist honestly, with the closed-won/closed-lost data in hand, and the trigger decision stops being a debate and becomes a reading.

The deepest discipline in this entire decision is emotional, not analytical. The pull to launch enterprise is strong and constant — it comes from the board, from investors, from competitors' press releases, from the founder's own ambition, and from the entirely real frustration of watching whale deals slip away. Every one of those pressures is pushing in the same direction, and none of them is a substitute for evidence. The job of the CRO is to be the person who insists the decision be made against the data — the tagged pipeline, the closed-lost notes, the ACV distribution, the security-stage loss rate, the honest product-readiness assessment — and not against the emotional gravity of the moment. A company that launches enterprise on evidence, fully funded, with a ready product and a protected mid-market, has made one of the highest-leverage moves available to a growth-stage SaaS business. A company that launches on pressure, half-funded, on an unready product, has made one of the most destructive. The signals are the same; the framework is the same; the difference is entirely in the discipline of waiting until the reading is real.

`;

const flow = `

## Decision Tree: The 7 Trigger Signals to Go/No-Go

\`\`\`mermaid
flowchart TD
  A[Evaluate Enterprise Motion Launch] --> B[Tag Pipeline Against 5-Attribute Definition]
  B --> S1{Signal 1 Inbound Enterprise Over 15 Percent Of Pipeline}
  B --> S2{Signal 2 Mid Market Losing Six Figure Deals To Incumbents}
  B --> S3{Signal 3 ACV Ceiling Hit}
  B --> S4{Signal 4 Repeated Security Questionnaire Losses}
  B --> S5{Signal 5 Competitor Displacement Opportunities Appearing}
  B --> S6{Signal 6 Board Pressure For Logos}
  B --> S7{Signal 7 Product Enterprise Ready}
  S1 --> C[Count Signals Firing]
  S2 --> C
  S3 --> C
  S4 --> C
  S5 --> C
  S6 --> C
  S7 --> C
  C --> D{Four Or More Signals Firing}
  D -->|No| E[No Go Keep Optimizing Mid Market]
  D -->|Yes| F{Is Product Readiness One Of The Signals}
  F -->|No| G[Wait And Fund Product Plus Security Roadmap]
  F -->|Yes| H{Security And Compliance Posture Funded}
  H -->|No| G
  H -->|Yes| I{Capital 1.5M To 3M Committed As A Block}
  I -->|No| J[No Go Wait Until Capital Available]
  I -->|Yes| K{Mid Market Has Runway To Grow In Parallel}
  K -->|No And Mid Market Starved| L[Reassess Sequencing And Capacity]
  K -->|Yes| M{Only Driver Is Board Pressure}
  M -->|Yes| E
  M -->|No| N[GO Launch Dedicated Enterprise Motion]
  N --> O[Begin First Hire Sequence]
\`\`\`

## Enterprise Team Build Sequence: First AE to Net-Positive

\`\`\`mermaid
flowchart LR
  A[Month 0 Trigger Confirmed] --> B[Month 0 To 1 Hire First Enterprise AE]
  B --> B1[Senior 10 Plus Years Proven Six And Seven Figure Closer]
  B --> B2[MEDDPICC Discipline And Multi Thread Experience]
  B1 --> C[Month 1 To 2 Hire Solutions Engineer]
  B2 --> C
  C --> C1[SE Supports AE On Technical Deals 1 To 2 Ratio]
  C1 --> D[Month 2 To 4 Stand Up Process And Lighthouse Pursuit]
  D --> D1[MEDDPICC Mutual Action Plans Executive Sponsors]
  D --> D2[Deal Desk And Legal Coverage Established]
  D --> D3[Founder CRO Personally In First Deals]
  D --> D4[Target First 3 To 5 Lighthouse Reference Accounts]
  D1 --> E[Month 4 To 6 Hire Enterprise CSM]
  D2 --> E
  D3 --> E
  D4 --> E
  E --> E1[Named CSM QBR EBR Dedicated Support Tier]
  E1 --> F[Month 6 To 9 First Enterprise Deals Close]
  F --> F1[Lighthouse Accounts Live Invest In Flawless Implementation]
  F1 --> G[Month 9 To 12 Scale Reps To 4 To 6]
  G --> G1[Add AEs And SEs Build Reference Library And Case Studies]
  G1 --> H[Month 12 Hire Dedicated Enterprise Sales Leader]
  H --> H1[Leader Scales A Proven Motion Not Discovers It]
  H1 --> I[Month 12 To 18 Motion Reaches Net Positive Contribution]
  I --> I1[Separate Team Structure Separate Forecast Separate Comp]
  I1 --> J[Steady State Enterprise As Distinct Organization]
\`\`\`

`;

const src = `

## Sources

1. **MEDDIC / MEDDPICC Sales Qualification Methodology** — The enterprise qualification framework (Metrics, Economic buyer, Decision criteria, Decision process, Paper process, Identify pain, Champion, Competition) referenced throughout this entry. https://meddic.academy
2. **Gartner — Magic Quadrant Research Methodology** — How enterprise buyers use analyst research in vendor diligence and how vendors engage. https://www.gartner.com
3. **Forrester — The Forrester Wave Methodology** — Analyst evaluation framework relevant to enterprise procurement diligence. https://www.forrester.com
4. **AICPA SOC 2 — Trust Services Criteria** — The SOC 2 Type II framework that is table stakes for enterprise SaaS sales. https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2
5. **ISO/IEC 27001 — Information Security Management** — International security certification increasingly expected by enterprise and especially European buyers. https://www.iso.org/standard/27001
6. **FedRAMP — Federal Risk and Authorization Management Program** — The authorization required to sell SaaS into US federal government; a multi-year, multi-million-dollar strategic commitment. https://www.fedramp.gov
7. **Vanta — Continuous Security and Compliance Automation** — Tooling for SOC 2 / ISO 27001 evidence collection and security questionnaire response. https://www.vanta.com
8. **Drata — Compliance Automation Platform** — Alternative continuous-compliance tooling for enterprise readiness. https://www.drata.com
9. **SecureFrame — Security Compliance Automation** — Compliance automation and questionnaire-response tooling. https://www.secureframe.com
10. **SAML 2.0 and SCIM Provisioning Standards** — The identity and access standards (SSO, automated user lifecycle) that are non-negotiable enterprise product prerequisites.
11. **HubSpot Investor Relations — Upmarket Expansion** — HubSpot's documented multi-year move from SMB into mid-market and enterprise editions and motion. https://ir.hubspot.com
12. **Zoom — 90-Day Security Plan (2020)** — Zoom's public, rapid security investment following enterprise scrutiny during pandemic-era hyper-growth. https://blog.zoom.us
13. **Notion — Enterprise Plan and Security Launch (2023)** — Notion's formal enterprise push: enterprise plan, SSO/SAML/SCIM, audit logs, enterprise sales team. https://www.notion.so/product/enterprise
14. **Airtable — Enterprise and Enterprise Hub** — Airtable's enterprise build-out: governance, admin, security, and enterprise sales motion. https://www.airtable.com/solutions/enterprise
15. **Figma — Enterprise Plan and Organization Administration** — Figma's consolidation of bottoms-up adoption into enterprise-wide agreements. https://www.figma.com/enterprise
16. **GDPR — Data Processing Agreements and Sub-Processor Requirements** — The data-processing legal framework underpinning enterprise DPA and data-residency requirements. https://gdpr.eu
17. **OpenView / Insight Partners — SaaS Benchmarks on Enterprise AE Comp and Quota** — Industry benchmark data on enterprise AE OTE ($300K+), quota ($1M-$2M), and base/variable splits.
18. **The Bridge Group — SaaS AE and Sales Metrics Reports** — Benchmark data on ramp time, quota attainment, and SE-to-AE ratios for enterprise sales roles. https://blog.bridgegroupinc.com
19. **Winning by Design — Enterprise Sales Process and Mutual Action Plans** — Framework reference for enterprise sales process design, MAPs, and SE coverage. https://winningbydesign.com
20. **SaaStr — Moving Upmarket: When and How to Launch Enterprise** — Operator commentary on the timing, cost structure, and hiring sequence of standing up an enterprise motion. https://www.saastr.com

`;

const num = `

## Numbers

**The 5-Attribute Enterprise Definition**
- Company size: 2,000+ employees (often 5,000+ or Global 2000 for true behavior change)
- Deal size: $250K+ ACV floor, frequently $500K-$1M+, multi-year TCV often seven figures
- Buying committee: 8+ stakeholders, often 12-20 when fully counted
- Cycle length: 6-12 months typical, up to 18 months for category creation
- The gauntlet: mandatory procurement + legal/MSA + security review, each can independently kill the deal

**The 7 Trigger Signals (require 4+ firing)**
- Signal 1: inbound enterprise demand exceeds 15% of pipeline (and converts at under half mid-market rate)
- Signal 2: repeated six-figure losses to incumbents on navigation, not product
- Signal 3: ACV ceiling — top decile of deals clusters at an unbreakable number
- Signal 4: repeated security-questionnaire / SOC 2 / SSO losses
- Signal 5: competitor displacement opportunities (9-month cycles) appearing and dying
- Signal 6: board pressure for logos (necessary input, never sufficient alone)
- Signal 7: product enterprise-readiness (necessary but not sufficient)

**Enterprise AE Cost and Quota**
- Enterprise AE compensation: ~$160K base + ~$160K variable = ~$320K OTE
- Base/variable split: ~50/50 (vs 60/40 or 70/30 transactional)
- Enterprise AE quota: $1.2M-$2M annually
- Ramp time: 9-12 months, sometimes longer
- Solutions Engineer: ~$160K-$220K OTE
- SE-to-AE ratio: ~1:2 early, sometimes 1:1 in technical categories

**Total Motion Investment**
- First-year cost (2 AEs, SE, partial deal desk + legal, security function): $1.5M-$3M
- Time to net-positive contribution: 12-18 months
- A half-funded enterprise motion: worse than no motion (consumes capital, produces nothing)

**Security and Compliance Investment**
- SOC 2 Type II: $30K-$100K all-in, 6-12 months (observation period cannot be compressed)
- ISO 27001: parallel or follow-on investment, important for international/EU buyers
- Penetration testing: annual, third-party, report shared with enterprise buyers
- FedRAMP (if gov): multi-year, multi-million-dollar strategic commitment
- Security questionnaires from buyers: typically 200-500 questions each
- Tooling: Vanta / Drata / SecureFrame for continuous compliance + reusable questionnaire knowledge base

**Pricing Discipline**
- Enterprise pricing floor: commonly $250K minimum ACV
- Standard term: multi-year (2-3 years) for price certainty and retention/multiple benefit
- Normal procurement discount: 10-20%, always traded for term/prepay/scope/reference
- Hard rule: enterprise per-unit price sits ABOVE mid-market; discounting firewalled from mid-market price book

**First Hire Sequence**
- Hire #1: first enterprise AE (senior IC who closes AND helps define playbook)
- Hire #2: solutions engineer (as soon as first AE has live technical deals)
- Hire #3: enterprise CSM (before first enterprise deals go live)
- Hire #4: enterprise sales leader (only at 4-6 carrying reps)

**Product Prerequisites Checklist**
- Identity: SSO via SAML 2.0, SCIM provisioning, RBAC
- Auditability: comprehensive, exportable audit logs
- Certifications: SOC 2 Type II minimum, ISO 27001, HIPAA/FedRAMP if relevant
- Architecture: API rate limits for scale, dedicated/isolated environment option, contractual uptime SLA with credits
- Legal/data: DPA ready, published sub-processor list, data residency options

**Analyst Relations**
- Gartner Magic Quadrant / Forrester Wave entry: multi-quarter effort
- Cost: low-to-mid six figures annually (subscriptions + advisory + internal AR function)
- Payoff horizon: 12-24 months

**Reference Customer Bootstrap**
- First lighthouse accounts to land intentionally: 3-5
- These deals: longer, more founder involvement, more concession, disproportionate CS investment
- Justification: strategic reference value exceeds contract value

**Org Structure Models**
- Overlay: lightest start, works at low volume, creates credit/comp friction, rarely scales
- Pod: self-contained AE + SE + CSM unit, strong for lighthouse phase
- Separate team: end state at scale, own leader / pipeline / comp / forecast
- Path: pod (or overlay) -> separate team at 4-6 reps + dedicated leader

`;

const counter = `

## Counter-Case: When Launching an Enterprise Motion Destroys the Business

The bull case for launching enterprise is compelling — bigger deals, marquee logos, a stronger valuation narrative. But a CRO should stress-test the decision against the very real conditions under which launching enterprise does not just underperform, it actively damages or destroys the company. These are not hypotheticals; they are the most common ways enterprise launches go wrong.

**Counter 1 — A premature launch starves mid-market of its best fuel.** The enterprise motion does not get its $1.5M-$3M from nowhere. It comes out of the budget, the headcount, and — most damagingly — the *attention* that was funding the mid-market engine that actually works. A company that launches enterprise 18 months early often watches its reliable, profitable, growing mid-market motion stall, because the A-players got reassigned, the product roadmap got hijacked by enterprise feature requests, and leadership's focus drifted to the shiny new thing. You can lose a healthy business chasing a hypothetical one.

**Counter 2 — The security and compliance investment never gets recouped.** SOC 2, ISO 27001, penetration testing, a security hire, compliance tooling, and the ongoing cost of staying certified is a permanent, growing line item. If the enterprise deals do not materialize at the volume and ACV that was forecast — and they frequently do not, or arrive far slower — that investment is a sunk cost with no return. You built a compliance apparatus sized for an enterprise book you never landed.

**Counter 3 — Enterprise gross margin comes in worse than expected.** The enterprise pitch assumes enterprise deals are more profitable. Often they are not, once you fully load the cost to serve: the SE time per deal, the security review labor, the legal and redline cycles, the named CSM and TAM, the dedicated support SLA, the custom work that creeps into deals, and the procurement discount. A $300K enterprise deal with enterprise cost-to-serve can have a *worse* gross margin than a fleet of $40K mid-market deals — and if you did not model that honestly, you scaled a motion that dilutes company margin.

**Counter 4 — The founder gets pulled into a swamp.** Early enterprise deals require founder and CRO involvement — that is correct and unavoidable. But there is a failure mode where it never ends: the founder spends 9 months personally shepherding a single deal through procurement, legal redlines, security questionnaires, and executive politics, while the rest of the company — the part that is actually working — gets less of the founder than it needs. Founder distraction is a real, under-priced cost, and for an early-stage company the founder's attention is the single scarcest resource. An enterprise motion that consumes it can quietly stall everything else.

**Counter 5 — The lumpiness breaks the forecast and the cash plan.** Mid-market revenue is smooth and predictable; enterprise revenue is lumpy and slips. A company that has been running on a reliable mid-market forecast can find its planning broken when a few large enterprise deals — now material to the number — slip a quarter or two. Missed forecasts damage credibility with the board, complicate the next raise, and can force reactive cost-cutting. The motion did not just underperform; it destabilized the financial operating system of the company.

**Counter 6 — You burn your reference equity on the way in.** If you launch before the product is ready and close a handful of enterprise deals anyway, those early accounts get a painful implementation experience. In enterprise, references are everything — and a botched first cohort does not just fail to produce references, it produces *negative* references in a small, well-connected market. You can poison the well before you have drawn from it.

**Counter 7 — The talent does not transfer and the hires do not work out.** Enterprise AEs are expensive, hard to recruit, slow to ramp, and — if the motion is not real, the product is not ready, or the leads are not there — they churn out inside a year having closed little. You will have spent $300K+ per failed hire, lost a year, and learned a lesson you could have learned by reading the trigger checklist honestly.

**Counter 8 — Better alternatives existed.** The opportunity cost is the quietest counter-case. The capital and attention that went into a premature enterprise motion could have gone into deepening the mid-market motion, expanding into an adjacent mid-market segment, improving net revenue retention, or fixing the product's core. For many companies at $15M-$50M ARR, the highest-return investment is *not* enterprise — it is doing the thing they already win at, better. Enterprise is one path; it is rarely the only path, and frequently not the best one.

**The honest verdict.** Launching a separate enterprise motion is the right move for a company where four-plus of the seven signals are genuinely firing, the product can pass a security review, the capital is committed as a block, mid-market is not being starved, and leadership has the bandwidth to manage the first reps and lighthouse deals personally. It is the wrong move — and a genuinely dangerous one — for a company that is launching on board pressure alone, on a product that fails the prerequisites checklist, without a funded security posture, without committed capital, or while mid-market still has large untapped runway. The discipline of the trigger is not bureaucratic caution. It is the recognition that a premature or under-funded enterprise motion does not produce a smaller version of success — it produces a failure that takes a chunk of the healthy business down with it. Run the checklist with the data in hand, and be as willing to say "not yet" as to say "go."

`;

const links = `

## Related Pulse Library Entries

- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Sales motion restructuring under disruption.)
- **q9501** — How do you start a bookkeeping business in 2027? (Vertical-specialization decision-making parallel.)
- **q9502** — How do you start a CPA firm in 2027? (Professional-services motion design.)
- **q90** — How do you structure a comp plan for an enterprise sales team? (Deep dive on the comp design referenced here.)
- **q91** — When should you hire a dedicated sales leader vs let the founder sell? (First-hire-sequence detail.)
- **q92** — How do you build a solutions engineering function? (SE ratio and hiring detail.)
- **q93** — How do you pass enterprise security reviews as an early-stage SaaS company? (Security/compliance deep dive.)
- **q94** — What is MEDDPICC and how do you operationalize it? (Enterprise qualification methodology.)
- **q95** — How do you build a mutual action plan with an enterprise buyer? (Enterprise sales process artifact.)
- **q96** — How do you forecast a lumpy enterprise pipeline? (Forecasting discipline deep dive.)
- **q97** — When should you pursue SOC 2 vs ISO 27001 vs FedRAMP? (Certification sequencing.)
- **q98** — How do you land your first enterprise reference customers? (Lighthouse-account bootstrap deep dive.)
- **q99** — How do you get into a Gartner Magic Quadrant? (Analyst relations deep dive.)
- **q100** — Overlay vs pod vs separate team: how do you structure an enterprise sales org? (Org-structure deep dive.)
- **q101** — How do you build an ABM motion for named accounts? (Enterprise marketing support.)
- **q102** — How do you structure enterprise customer success and the TAM role? (Enterprise CS deep dive.)
- **q103** — How do you set and enforce an enterprise pricing floor? (Pricing discipline deep dive.)
- **q104** — How do you build a co-sell motion with systems integrators? (Channel/SI partnership deep dive.)
- **q105** — How do you run a procurement-gated enterprise deal without losing momentum? (Procurement navigation.)
- **q106** — When should you move upmarket vs deeper into mid-market? (Segment-strategy decision.)
- **q107** — How do you avoid mid-market price cannibalization when you add enterprise? (Pricing-architecture protection.)
- **q108** — What does an enterprise AE profile actually look like? (Hiring-profile deep dive.)
- **q109** — How do you build a deal desk? (Deal-desk function deep dive.)
- **q110** — How do you staff commercial legal for enterprise SaaS deals? (Legal-function deep dive.)
- **q1946** — How do you start a real estate investing business in 2027? (Adjacent GTM-strategy content.)
- **q9505** — How do you scale a bookkeeping firm past $500K revenue? (Scaling-stage parallels.)
- **q9601** — How do you start a fractional CFO business in 2027? (Capital-planning discipline parallel.)
- **q9801** — What is the future of B2B SaaS GTM in 2030? (Long-term outlook context.)
- **q9802** — How will AI change enterprise procurement by 2030? (5-year-outlook context for AI-in-procurement.)

`;

const tags = ['enterprise-sales','gtm-strategy','sales-motion','mid-market','meddpicc','sales-leadership','saas','pricing','sales-comp','org-design'];

const sources = [
  { title: 'MEDDIC / MEDDPICC Sales Qualification Methodology', url: 'https://meddic.academy' },
  { title: 'AICPA SOC 2 — Trust Services Criteria', url: 'https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2' },
  { title: 'SaaStr — Moving Upmarket: When and How to Launch Enterprise', url: 'https://www.saastr.com' }
];

const notes = {
  s6: 'Added 20 cited sources: MEDDIC/MEDDPICC methodology, Gartner Magic Quadrant and Forrester Wave research methodologies, AICPA SOC 2 Trust Services Criteria, ISO 27001, FedRAMP, compliance-automation tooling (Vanta, Drata, SecureFrame), SAML 2.0 / SCIM identity standards, GDPR/DPA framework, five case-study primary sources (HubSpot IR, Zoom 90-day security plan, Notion enterprise, Airtable enterprise, Figma enterprise), and SaaS GTM benchmark sources (OpenView, The Bridge Group, Winning by Design, SaaStr).',
  s7: 'Added comprehensive numerical analysis: the 5-attribute enterprise definition (2,000+ employees, $250K+ ACV, 8+ committee, 6-12 month cycles, procurement+legal+security gauntlet), the 7 trigger signals with 4+ firing threshold, enterprise AE cost structure ($160K base + $160K variable, $1.2M-$2M quota, 9-12 month ramp, 1:2 SE ratio), total motion investment ($1.5M-$3M, 12-18 months to net-positive), security/compliance investment (SOC 2 $30K-$100K and 6-12 months, FedRAMP multi-year), pricing discipline ($250K floor, 10-20% procurement discount, multi-year default), first-hire sequence, product prerequisites checklist, analyst relations cost/timeline, reference-customer bootstrap math, and org-structure models.',
  s8: 'Added 8-element counter-case on when launching an enterprise motion destroys the business: premature launch starving mid-market of capital and attention, security/compliance investment never recouped, enterprise gross margin worse than expected once cost-to-serve is fully loaded, founder distraction swamp, pipeline lumpiness breaking the forecast and cash plan, burning reference equity with a botched first cohort, expensive enterprise hires churning out, and the opportunity cost of better mid-market alternatives — closing with an honest go/no-go verdict.',
  s9: 'Cross-linked 28 related Pulse entries: enterprise-motion deep dives (q90-q110 on comp, SE function, security reviews, MEDDPICC, MAPs, forecasting, certifications, references, analyst relations, org structure, ABM, enterprise CS, pricing floor, channel, procurement, AE profile, deal desk, legal), segment-strategy entries (q106, q107), GTM-disruption content (q1899), adjacent professional-services and scaling content (q9501, q9502, q9505, q9601, q1946), and 2030 outlook entries (q9801, q9802).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the enterprise-motion launch trigger decision for CROs/CEOs/VP Sales at $15M-$150M ARR SaaS. Two mermaid diagrams (decision tree from the 7 trigger signals through go/no-go gates; enterprise team build sequence from first AE hire through net-positive at months 0-18). Full coverage: the definition problem and 5-attribute operational definition of enterprise, the 7 trigger signals with the 4+ firing rule, the accidental-enterprise-deal pattern, enterprise motion cost structure, enterprise AE profile, product prerequisites checklist (SSO/SAML/SCIM, audit logs, RBAC, SOC 2 Type II, ISO 27001, HIPAA/FedRAMP, uptime SLA, DPA), the security and compliance investment, pricing floor and discount discipline, enterprise sales process (MEDDPICC, MAPs, executive sponsors, POC, procurement), the first-hire sequence, marketing support (ABM, executive events, analyst relations, CAB), customer success for enterprise (named CSM, QBR/EBR, TAM), the reference-customer bootstrap, analyst relations investment, channel/SI partnerships, 5 real case studies (HubSpot, Zoom, Notion, Airtable, Figma), comp plan design, enterprise pipeline forecasting, org structure (overlay/pod/separate team), the mistakes, when NOT to launch, capital requirements, 5-year outlook, a final trigger checklist, and an 8-element counter-case on when launching enterprise destroys the business.'
};

runPolish({ id: 'q89', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
