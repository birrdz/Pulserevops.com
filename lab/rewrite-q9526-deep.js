// q9526 — For a founder still running land-and-expand playbooks alongside new enterprise or mid-market motions, how do you keep the motions from cannibalizing each other?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Running a land-and-expand motion alongside a new enterprise or mid-market motion **sounds additive but the two motions actively fight each other** — for pricing, for product roadmap, for sales attention, for marketing spend, and for the founder's time. The cannibalization is almost always **invisible until it is structural**: by the time you see it in the numbers, it is already baked into your org chart, your price book, and your eng backlog. There are **five cannibalization vectors** to audit: **(1) Pricing** — the land-and-expand low entry price becomes the anchor enterprise procurement throws back at you; **(2) Product roadmap** — SMB-velocity features and enterprise-depth features compete for finite engineering capacity; **(3) Sales attention** — generalist reps chase the faster, easier commission and abandon the grindy enterprise deal; **(4) Marketing** — the bottoms-up self-serve message and the top-down enterprise message conflict on the same website, in the same content, through the same channels; **(5) The founder's time** — split focus dilutes both motions and the founder ends up running neither well. The structural answer is **not "try harder" — it is to specialize the motions**: separate sales teams, separate quotas, separate comp plans, separate (or fenced) pricing, separate marketing programs, and a roadmap-governance process that explicitly allocates engineering capacity by percentage. The motions should **coexist as deliberate architecture, not accident**. The best version of multi-motion is a **graduation path**: land-and-expand seeds accounts that the enterprise motion later expands — the two motions feed each other as a pipeline rather than fighting as competitors, with explicit handoff criteria defining when an account graduates. The honest counter-case: **sometimes running two motions is itself the mistake.** A company at $5M-$15M ARR usually cannot staff two motions well; the elaborate fencing apparatus is over-built; "multi-motion" is too often a euphemism for an unfocused GTM strategy, and no amount of structure fixes the absence of a clear core motion. For many companies the right answer is **sequence, don't parallelize** — run land-and-expand to a durable base, then layer enterprise deliberately. Net: identify the five vectors, specialize the motions structurally, fence pricing and roadmap, design per-motion comp, govern eng capacity, make the founder pick the one motion only they can run, report by segment — or sequence instead.`;

const core = `

## The Core Problem: Why Two Motions Fight Instead of Add

When a founder decides to run a land-and-expand playbook alongside a new enterprise or mid-market motion, the mental model is almost always additive. The pitch to the board, to the team, and to themselves is: "We have a working motion that produces predictable revenue, and we are adding a second motion that opens a larger segment. One plus one equals two — or, with shared infrastructure, maybe one plus one equals two-point-three." This is the wrong model. The correct model is that two GTM motions running through one undifferentiated organization do not add; they **interfere**. They compete for the same finite resources, and because they are optimizing for different things, the competition is not a fair fight — one motion is structurally faster, easier, and more legible, and it wins the internal competition by default while the other motion quietly starves.

The reason this is so dangerous is that the cannibalization is **invisible until it is structural**. In the first two or three quarters of running both motions, the numbers look fine or even good. Land-and-expand keeps producing its predictable expansion revenue. The enterprise motion closes a couple of lighthouse logos that everyone celebrates. The blended pipeline looks healthy. Nobody is alarmed. But underneath the blended numbers, the interference is already compounding: the enterprise deals are taking longer than they should because the reps working them are also being pulled into easier land-and-expand expansions; the roadmap is drifting toward whichever motion shouts loudest in the weekly product meeting; the website is becoming a confused hybrid that converts neither bottoms-up users nor top-down buyers as well as it used to. By the time these problems show up as a number a board would flag — enterprise win rate dropping, expansion net revenue retention softening, CAC creeping up in a way nobody can attribute — the cannibalization is no longer a tactical problem you can fix with a memo. It is structural. It lives in the org chart, the comp plan, the price book, and the engineering backlog. Fixing it now requires re-architecting, not adjusting.

The founder's instinct when they sense something is wrong is usually to push harder: more pipeline reviews, more roadmap prioritization meetings, more "alignment." But you cannot meeting your way out of a structural conflict. If two motions are running through one set of reps, one price book, one roadmap, and one marketing team, then every prioritization decision is a zero-sum fight, and the same motion keeps winning the fight for the same structural reasons. The work of keeping the motions from cannibalizing each other is not the work of refereeing the fight better. It is the work of designing the organization so the fight does not happen — so each motion has its own resources, its own targets, its own incentives, and its own fences. That design work is what this entry is about.

## The Five Cannibalization Vectors

Before you can fix the problem you have to be able to see it, and seeing it means naming the specific channels through which two motions interfere. There are five, and a multi-motion company is almost always being cannibalized through several of them simultaneously.

**Vector 1 — Pricing.** The land-and-expand motion needs a low, frictionless entry price — a per-seat or per-usage price low enough that a team can adopt the product without a procurement process. But that low entry price does not stay contained inside the land-and-expand motion. It leaks. It shows up on your website, in your published price list, in third-party review sites, and in the memory of every buyer who ever saw it. When your enterprise motion then tries to close a six- or seven-figure deal, the enterprise buyer's procurement team has already done the math: "Your website says $30 a seat. We have 4,000 seats. That is $1.44M, and you are quoting us $2.8M. Explain the difference." The land-and-expand price has become the anchor, and the enterprise motion spends its energy fighting an anchor its own company set.

**Vector 2 — Product roadmap.** Land-and-expand wants velocity features: fast onboarding, viral loops, self-serve provisioning, in-product upgrade prompts, lightweight collaboration. Enterprise wants depth features: SSO and SCIM, audit logs, granular admin and permissioning, security and compliance certifications, data residency, advanced reporting, scale and reliability hardening. These are not the same backlog. They are arguably opposite backlogs. And engineering capacity is finite. Every sprint, the roadmap is implicitly allocating capacity between the two motions, and if there is no explicit governance, the allocation is decided by whoever advocates hardest in the room — which means one motion's roadmap consistently starves the other.

**Vector 3 — Sales attention.** If a single rep can sell both motions, the rep will rationally chase the easier one. A land-and-expand expansion is a warm, fast, high-probability deal: an existing happy customer adding seats. An enterprise deal is a cold, slow, multi-stakeholder grind with a real chance of dying in legal or security review. If both deals pay into the same quota and the same commission plan, the rep's incentive is unambiguous — work the land-and-expand deals, treat the enterprise deals as a someday project. The enterprise motion does not fail because the strategy was wrong; it fails because no rep ever actually worked it.

**Vector 4 — Marketing and message.** The land-and-expand motion is bottoms-up: the message is aimed at an individual practitioner or a small team, the channels are product-led and community-led, the content is tactical and self-serve. The enterprise motion is top-down: the message is aimed at an executive economic buyer, the channels are field marketing and ABM and analyst relations, the content is strategic and ROI-framed. Run both through one brand, one website, and one demand-gen team and you get a schizophrenic presence — the homepage tries to say "sign up free in thirty seconds" and "trusted by the Fortune 100" in the same viewport, and it does neither convincingly.

**Vector 5 — The founder's time.** The founder knows the land-and-expand motion. They built it. It is comfortable and it works. The enterprise motion is new, hard, and unproven, and it is exactly the kind of thing that needs founder energy to crack. So the founder is pulled in two directions: maintain the motion they know, or invest in the motion that needs them. Most founders, under pressure, drift back toward the familiar motion and give the new one whatever attention is left over — which is never enough to actually establish it. Split founder focus does not produce two half-built motions; it usually produces one maintained motion and one stalled one.

The rest of this entry takes each vector in turn, then assembles the structural answer.

## Vector 1 Deep Dive — The Pricing Conflict

Pricing is the cannibalization vector that does the most damage the fastest, because price is public, sticky, and remembered. The land-and-expand motion is built on a low entry price by design — the whole point is to remove the friction that would otherwise require a buying committee, so a single team can swipe a card or expense a small monthly amount and get value before anyone in procurement is involved. That low price is a feature of the motion. The problem is that the price does not stay scoped to the motion. It becomes the company's public price, and the public price becomes the reference point for every negotiation the company will ever have, including the enterprise negotiations that are supposed to be a different motion entirely.

Here is the mechanism in detail. Your land-and-expand price is, say, $25 per seat per month, published on your pricing page because publishing it is part of what makes the self-serve motion work. Your enterprise motion is selling a platform deal to a 6,000-person organization, and the value you are delivering — security, administration, integration, SLA, dedicated support, the ability to standardize the whole company on one tool — is worth far more per seat than $25. You quote $55 per seat, or you quote a platform fee plus a reduced per-seat number, and the enterprise procurement team immediately reaches for the anchor: "Your published price is $25. Volume discounts go down, not up. We expect to pay less than $25 because we are buying 6,000 seats." Now the enterprise motion is not selling value; it is defending against its own company's price list. Every enterprise deal becomes a re-litigation of why the big customer should pay more per seat than the small one, which is a genuinely hard argument to win even when it is true.

The fix is **pricing architecture that does not let one motion undercut the other**, and it has three components. First, **separate price books**. The land-and-expand motion has its self-serve, published, low-friction pricing. The enterprise motion has its own price book — quote-based, value-based, not published, built around platform value rather than per-seat arithmetic. These are not the same document with a discount applied; they are different commercial structures. Second, **packaging fences**: the things an enterprise buyer is paying for — SSO, SCIM, audit logs, advanced admin, security review, dedicated support, SLA, data residency — are not available in the land-and-expand tier at any price. The enterprise edition is a genuinely different product surface, not the same product with a bigger number. This is the "enterprise edition wall," and it has to be real, not cosmetic. Third, an explicit **enterprise floor**: a per-seat or per-deal minimum below which the enterprise motion does not go, set above the land-and-expand list price, justified by the packaging differences. When procurement throws the anchor, the rep's answer is structural: "That is a different product. The edition you are buying includes the security, administration, and support architecture your organization requires, and it is not the same SKU as the self-serve tier — here is what it includes and here is why it is priced the way it is."

The companies that get this wrong treat enterprise pricing as "land-and-expand pricing with a volume discount and a couple of extra features." The companies that get it right treat the two as genuinely different commercial products that happen to share a codebase. The shared codebase is an efficiency. The shared price book is a wound.

## Vector 2 Deep Dive — The Product Roadmap Conflict

The roadmap conflict is quieter than the pricing conflict but it compounds for longer. Land-and-expand and enterprise want different products, and they are both pulling on the same finite engineering team.

Look at what each motion actually needs from the roadmap. The land-and-expand motion lives or dies on velocity and virality: time-to-value has to be minutes not weeks, onboarding has to be self-serve, the product has to create natural reasons for one user to pull in another, the upgrade path from free or cheap to paid or more has to be in-product and frictionless, collaboration has to be lightweight. Every one of those is a roadmap item, and they are the roadmap items that keep the land-and-expand flywheel spinning. Starve them and expansion revenue decays.

The enterprise motion needs a different and largely non-overlapping set of things: single sign-on and SCIM provisioning, because no enterprise will roll out a tool that does not integrate with their identity provider; audit logs and admin controls, because security and compliance teams require them; SOC 2, ISO 27001, and increasingly more, because they are table stakes to even enter procurement; granular role-based permissioning; data residency and data handling controls; advanced reporting and analytics for the executive who signed the contract and needs to prove ROI; and a great deal of unglamorous reliability and scale hardening, because an enterprise rollout exposes load patterns the SMB base never did. None of these features make the land-and-expand motion faster. Several of them, built carelessly, make it slower — an SSO-only login path is death to a self-serve signup flow.

So you have two backlogs, they are close to opposite, and engineering capacity is fixed. With no governance, the allocation between them is decided informally — by whoever has the loudest advocate in the product meeting, by which motion had the most recent visible win or loss, by which customer escalation reached the founder most recently. That informal allocation is volatile and it consistently underserves whichever motion is not currently in crisis. The land-and-expand motion is rarely in crisis because it is the established motion, so it tends to lose these informal fights — until expansion metrics soften months later and suddenly it is in crisis and the pendulum swings hard the other way, starving enterprise.

The fix is **explicit roadmap governance**, covered in depth in a later section, but the principle is simple: engineering capacity gets allocated between motions by an explicit percentage, decided deliberately and reviewed on a fixed cadence, not by whoever advocates hardest this week. "This quarter, enterprise gets 60% of feature capacity and land-and-expand gets 40%, here is why, and we revisit at quarter end." That sentence, enforced, is worth more than any number of prioritization meetings.

## Vector 3 Deep Dive — The Sales Attention Conflict

The sales attention conflict is the one founders most often think they can manage with willpower and culture, and they are most often wrong.

Set up the situation honestly. A rep carries a quota. In their territory or book sit two kinds of opportunities. Type one is a land-and-expand expansion: an existing customer who is already getting value, already likes the product, and could add seats or usage or a module. It is a warm conversation, a short cycle, a high close rate, and a real number against quota. Type two is a net-new enterprise deal: a cold or lightly-warmed account, a buying committee of six to twelve people, a security review, a legal review, a procurement process, a three-to-nine-month cycle, and a meaningful probability that after all that work the deal dies in a stage that had nothing to do with the rep's skill. Both types pay into the same quota and the same commission plan.

Ask what a rational rep does. They work the land-and-expand expansions. Not because they are lazy or disloyal — because the comp plan told them to. The expected value per hour of effort is dramatically higher on the easy motion. The enterprise deals get "worked" in the sense that they get a discovery call and a note in the CRM, and then they sit, because every hour spent on the enterprise grind is an hour not spent on the expansion that will actually close this quarter. The enterprise motion does not fail loudly. It fails as a slow leak: pipeline that does not advance, deals that age out, a forecast that is always "next quarter." And the post-mortem usually misdiagnoses it as a strategy problem or a product-gap problem when it was a structural incentive problem the whole time.

The fix is not exhortation. It is **specialization**: do not ask generalist reps to run both motions. The land-and-expand motion gets its own team — call them expansion reps or account managers or growth AEs — with a comp plan, quota, and activity model built around the velocity motion. The enterprise motion gets its own team — enterprise AEs — with a comp plan, quota, longer ramp expectation, and activity model built around the long-cycle motion. A rep on the enterprise team is not allowed to "fall back" on land-and-expand deals when the quarter gets tight, because those deals are not in their book; they belong to the other team. A rep on the expansion team is not handed enterprise deals they will never work. Each rep faces one motion, one comp logic, one definition of a good week. The structural fix for "reps chase the easy motion" is to make sure no rep is choosing between motions in the first place.

This is more expensive than running generalists, and that expense is the real reason companies resist it — which is itself a signal worth heeding, and the counter-case section returns to it. But within the decision to run two motions, generalist reps are not a cost saving; they are a guarantee that one motion gets abandoned.

## Vector 4 Deep Dive — The Marketing and Message Conflict

Marketing cannibalization is the vector that is easiest to see and still routinely mishandled, because the symptom — a confused brand — gets blamed on creative execution when it is actually a structural problem.

The two motions are aimed at different people, through different channels, with different messages, optimizing for different actions. The land-and-expand motion's marketing is bottoms-up. The audience is an individual practitioner or a small team. The message is tactical and immediate: here is a thing that solves your specific problem, you can try it right now, here is how. The channels are product-led — the product itself is the top of funnel — plus community, content SEO, practitioner-oriented social, and word of mouth. The conversion event is a signup or an activation. The enterprise motion's marketing is top-down. The audience is an economic buyer, an executive, a function leader with budget. The message is strategic: here is how this changes the way your organization operates, here is the ROI, here is the risk you are carrying without it. The channels are field marketing, account-based marketing, events, analyst relations, executive content, and a sales-assisted path. The conversion event is a qualified meeting with a buying committee.

Run both through one brand, one website, one demand-gen team with one set of goals, and the output is a presence that does neither job. The homepage cannot simultaneously be optimized for "individual practitioner signs up self-serve in thirty seconds" and "VP of Engineering at a 5,000-person company books a meeting." The content calendar cannot simultaneously serve tactical practitioner SEO and strategic executive thought leadership without one starving the other. The demand-gen team cannot be measured on signup volume and on enterprise pipeline with one budget, because those metrics pull spend in opposite directions, and the team will drift toward whichever number is easier to move — usually signups, because the land-and-expand motion produces faster, more legible marketing feedback.

The fix is to **segment the demand-gen function without fracturing the brand**. The brand — the name, the visual identity, the core value proposition, the company's reason to exist — stays singular. But beneath the brand, you run two distinct marketing programs: separate teams or at least separate owners, separate budgets, separate goals, separate channels, separate content tracks, and ideally separate site paths (a self-serve path optimized for signup, an enterprise path optimized for the qualified meeting, with the homepage routing rather than trying to do both jobs at once). The discipline is "one brand, two programs." The failure mode on each side is over- and under-correcting: companies that never segment get the schizophrenic brand; companies that over-segment build two brands that confuse the market about what the company even is. The target is a single, coherent brand with two clearly-owned, separately-measured demand programs underneath it.

## Vector 5 Deep Dive — The Founder's Time

The fifth vector is the one founders are least honest with themselves about, and it is often the one that matters most, because the founder's attention is the single most leveraged and most constrained resource in the company.

The setup is human and predictable. The founder built the land-and-expand motion. They understand it in their bones — they know its metrics, its failure modes, its levers, its rhythm. It is working, it is producing revenue, and engaging with it is comfortable and immediately productive. The enterprise motion is the opposite: it is new, the founder may not have a deep instinct for it, it is unproven inside this company, the feedback loops are slow, and engaging with it is uncomfortable and not immediately productive. Now put that founder under the normal pressure of running a company — a board meeting coming up, a forecast that needs to hold, a fire somewhere — and watch where their attention goes. It drifts to the familiar motion. Not because the founder decided the enterprise motion does not matter, but because under pressure humans return to the place where their effort produces visible results fastest.

The result is a specific and damaging pattern: the founder spends most of their GTM attention maintaining the motion that least needs them, and gives the motion that most needs founder energy whatever is left. And the new enterprise motion genuinely does need founder energy in a way the mature land-and-expand motion does not. Early enterprise deals need a founder in the room — for the strategic credibility, for the "we will build this for you" commitments, for the relationships with executive buyers who want to look the company's leader in the eye. Early enterprise motion design — the pricing architecture, the first few reference customers, the proof points — is founder-grade work. If the founder is not doing it, it is either not getting done or getting done by someone without the authority to do it well.

The fix is an honest allocation decision, and it is covered in depth later, but the principle is this: **the founder should pick the one motion only they can run, and structurally delegate the other.** In almost every case the motion only the founder can run is the new enterprise motion — the strategic relationships, the early big deals, the credibility — because the mature land-and-expand motion can be handed to a strong operator who runs it by its known playbook. The founder who insists on personally running both is not being diligent; they are guaranteeing that the harder motion gets under-resourced at exactly the moment it needs the most resource.

## The Structural Answer — Specialize the Motions

Every vector above resolves to the same root cause and the same root fix. The root cause is **two motions running through one undifferentiated organization**. The root fix is to **specialize**: stop running both motions through one shared set of people, incentives, prices, and roadmap, and instead give each motion its own dedicated structure.

Specialization is concrete, not philosophical. It means: **separate sales teams**, each carrying only its motion's deals. **Separate quotas**, set by each motion's own economics — the velocity motion's quota is built on volume and short cycles, the enterprise motion's quota on fewer, larger, longer deals. **Separate comp plans**, each one designed so that doing the right thing for that motion is the financially rational thing for the rep — no rep ever arbitraging between motions because no rep has both motions in their plan. **Separate or fenced pricing**, with the land-and-expand price book and the enterprise price book as genuinely distinct commercial structures, packaging fences between them, and an enforced enterprise floor. **Separate marketing programs**, one brand with two owned, separately-budgeted, separately-measured demand engines beneath it. **An explicit roadmap-governance process** that allocates engineering capacity between the motions by deliberate percentage rather than by whoever shouts loudest. And **a founder allocation decision** that puts the founder on the one motion only they can run.

The mental shift is from accident to architecture. In an unspecialized company, the relationship between the two motions is whatever emerges from a thousand small uncoordinated decisions — and what emerges is cannibalization, because the structurally-easier motion wins every uncoordinated contest. In a specialized company, the relationship between the two motions is **designed**: each has its lane, its resources, its targets, its incentives, and the points where they touch — the pricing fence, the roadmap allocation, the account-graduation handoff — are explicit, governed interfaces rather than uncontrolled collisions. The motions still coexist in one company, share one codebase, share one brand, share back-office functions. But they coexist as a deliberate two-engine architecture, not as two motions accidentally grinding against each other inside one engine.

The objection to specialization is always cost: two teams, two comp plans, two marketing programs, governance overhead. That objection is real and the counter-case section takes it seriously. But the objection is an argument against running two motions at this stage — it is not an argument for running two motions through one undifferentiated org. The undifferentiated approach is not the cheap way to run two motions; it is the way to spend the money on two motions and get one and a half.

## Designing the Motion Fences

Specialization raises an immediate practical question: if there are two motions with two teams, **which customers and prospects belong to which motion?** Without an explicit answer, the two teams collide in the field — both motions chasing the same account, an account confused by two different commercial conversations, reps fighting over who owns a logo. The answer is a set of **motion fences**: explicit, written rules that route every account, prospect, and customer to exactly one motion.

The fences are built on segmentation criteria that should be unambiguous enough that two reasonable people routing the same account land in the same place. The usual inputs: company size (employee count, revenue), expected deal size or account potential, buying behavior (did they arrive self-serve or through an outbound or inbound enterprise channel), industry and regulatory profile (a regulated enterprise that will require security review belongs to the enterprise motion regardless of initial deal size), and current relationship (an existing self-serve customer is, until graduation, a land-and-expand account). Write these down. "Accounts under N employees and under $X expected ACV, arriving through self-serve or low-touch channels, are land-and-expand. Accounts over those thresholds, or in regulated industries, or arriving through enterprise channels, are enterprise." The exact thresholds are company-specific; the existence of explicit thresholds is not optional.

Then handle the routing rules and the edge cases, because the edge cases are where fences fail. What happens when a self-serve land-and-expand account starts showing enterprise characteristics — growing seat count, multiple teams adopting, a security questionnaire arriving? You need an explicit **graduation trigger**: a defined set of signals that move an account from the land-and-expand motion to the enterprise motion, with a defined handoff process so the customer experiences a deliberate transition rather than being dropped and re-pitched. What happens when the enterprise motion is working an account and discovers a small team inside it already self-serve? You need a rule for that too — usually the enterprise motion subsumes it, but the rule has to be written so it is not relitigated per deal. What happens when both teams claim an account? There is a routing authority — RevOps, a sales ops function, a deal desk — that adjudicates by the written rules, fast, so field conflict does not fester.

The fence is not bureaucracy for its own sake. It is the thing that lets two specialized motions operate in the same market without the specialization collapsing back into collision. A fence with no edge-case rules is a fence with holes; a fence with no routing authority is a fence nobody enforces. Build all three: the segmentation criteria, the edge-case rules, and the enforcement authority.

## The Land-and-Expand-to-Enterprise Graduation Path

The motion fence prevents the two motions from colliding. But preventing collision is the floor, not the ceiling. The best version of multi-motion is not "two motions that successfully ignore each other." It is **two motions that feed each other** — and the structure that makes that happen is the graduation path.

Here is the model. The land-and-expand motion is, among other things, an extraordinarily efficient account-seeding machine. Every self-serve signup, every small team that adopts the product, every low-friction land is a seed planted inside an organization — often inside an organization that, viewed top-down, is an enterprise target. That seeded account is doing something the enterprise motion would otherwise have to pay for: it is generating product usage, internal champions, proof of value, and a foothold, all at land-and-expand cost-of-acquisition rather than enterprise cost-of-acquisition. When such an account grows — more seats, more teams, the signals in the graduation trigger — it becomes a warm enterprise opportunity that the enterprise motion can expand into a platform deal. The enterprise motion is no longer cold-prospecting that logo; it is harvesting an account the land-and-expand motion already seeded and warmed.

Run this way, the two motions are a **pipeline, not a conflict**. Land-and-expand is the top of the enterprise funnel. The enterprise motion is the expansion stage of the land-and-expand journey for the accounts big enough to warrant it. The cannibalization framing inverts: the land-and-expand low price is not undercutting the enterprise deal — it is the customer-acquisition mechanism that makes the enterprise deal cheaper to win. But — and this is the whole game — this only works if the **handoff is designed**. An undesigned handoff is where graduation paths die: the account grows, nobody notices, the self-serve relationship just continues sub-optimally; or somebody notices and the account is yanked from a happy account manager and cold-handed to an enterprise rep who restarts the relationship from zero and the customer feels demoted rather than upgraded.

A designed handoff has: a clear **trigger** (the graduation criteria from the fence section, monitored automatically so growth gets noticed); a **defined transition process** (a warm introduction, a joint conversation, the land-and-expand relationship owner staying involved through the transition rather than vanishing); a **comp treatment** that pays both sides fairly so the account manager is incentivized to surface and support the graduation rather than hoard the account (covered in the comp section); and a **customer-experience design** so the customer experiences graduation as "you have grown into a relationship that gives you more," not "you have been reassigned." Get the handoff right and the graduation path turns the two motions from competitors for resources into a single compounding system. Get it wrong and you have two motions plus a leaky seam between them.

## Pricing Architecture for Coexistence

The pricing-vector deep dive established the problem; this section is the build spec for the solution. Pricing architecture for two-motion coexistence has four structural elements, and all four have to be real.

**Element one: genuinely separate editions, not one product with tiers.** The land-and-expand edition and the enterprise edition should be experienced as different products that happen to share a codebase. This is not cosmetic tiering where the "enterprise" tier is the same product with a few toggles. The enterprise edition has a different commercial structure (quote-based vs. published), a different buying experience (sales-assisted vs. self-serve), a different support model, a different contract, and a meaningfully different feature surface. When a buyer asks "why is enterprise more expensive per seat," the honest answer is "because it is a different product," and that answer has to be true.

**Element two: real feature fences between the editions.** The capabilities an enterprise pays for — SSO, SCIM, audit logs, advanced admin and permissioning, security and compliance certifications, data residency, SLA, dedicated support, advanced reporting — live in the enterprise edition and are not available in the land-and-expand edition at any price. This is the "enterprise edition wall." The wall has to be defensible: each thing behind it should be something an enterprise genuinely needs and a self-serve practitioner genuinely does not, so the fence reads as natural product segmentation rather than as artificial hostage-taking. A fence that feels arbitrary invites the procurement fight you were trying to avoid; a fence that maps to real buyer needs ends it.

**Element three: the enterprise floor.** A per-seat or per-deal minimum, set above the land-and-expand list price, below which the enterprise motion does not transact. This is the structural answer to the anchoring attack. When procurement points at the self-serve price, the floor — backed by the edition and feature differences — is what the rep stands on. Without an explicit floor, every enterprise deal negotiates down toward the land-and-expand price one concession at a time.

**Element four: a designed migration path from self-serve to enterprise contract.** Because the graduation path is the goal, the pricing has to make graduation smooth, not punitive. A self-serve account that has been paying $25 a seat and graduates to an enterprise contract should experience the move as an upgrade with more value, not as a bill shock that makes them reconsider the whole relationship. That means a thought-through migration: how existing self-serve spend is credited or transitioned, how the contract conversion is framed, how the value of the enterprise edition is made concrete enough that the higher price reads as worth it. The pricing architecture's job is not just to keep the motions from undercutting each other — it is also to make the bridge between them walkable.

## The Comp Design for Multi-Motion

Comp is where motion strategy either gets enforced or gets quietly overridden, because reps optimize for their comp plan with more precision and persistence than they optimize for any strategy memo. Multi-motion comp design has to do four things.

**Separate plans per motion.** The expansion or land-and-expand team is on a plan built for the velocity motion: rewarding volume, expansion, retention, the short-cycle behaviors that motion needs. The enterprise team is on a plan built for the long-cycle motion: larger quotas, longer ramp, accelerators for new logo and platform deals, structures that keep a rep motivated through a six-month cycle. These are different documents because the motions have different economics, and trying to force both motions onto one "fair" plan produces a plan that fits neither.

**Quota math per team, set by each motion's reality.** The expansion team's quota is built on the install base's expansion potential and the team's capacity to work warm deals at velocity. The enterprise team's quota is built on territory potential, average enterprise deal size, realistic win rates, and realistic cycle length — and on an honest ramp curve, because an enterprise rep is not productive in month two. Setting the enterprise quota with land-and-expand assumptions is a common and fatal error: it makes the enterprise motion look like it is failing when it is actually just running on the wrong yardstick.

**Preventing rep arbitrage.** The structural point from the sales-attention vector, made concrete in comp: no single rep should have both motions in their plan, because if they do, the plan itself creates the arbitrage. The whole reason to separate teams is so that no rep is ever choosing between an easy land-and-expand deal and a hard enterprise deal for the same quota credit. If, for headcount reasons, some overlap is unavoidable early on, the comp plan has to deliberately over-weight the harder motion to counteract the natural pull — but the clean answer is separation.

**Handoff and graduation comp credit.** This is the subtle one and the one most often missed. When a land-and-expand account graduates to the enterprise motion, who gets paid? If the answer is "only the enterprise rep," the land-and-expand account manager is incentivized to hoard the account and resist graduation — which kills the graduation path you built. The comp design has to **pay both sides of a graduation**: a graduation or sourcing credit to the land-and-expand owner who seeded and grew the account, and the expansion credit to the enterprise rep who closes the platform deal. The exact split is company-specific, but the principle is non-negotiable: the comp plan must make surfacing and supporting a graduation the financially rational thing for the person who would otherwise hoard the account. Comp is how the graduation path stays alive in practice rather than just on the strategy slide.

## The Roadmap Governance

The roadmap-vector deep dive named the problem; this is the governance mechanism that fixes it. The core idea is to replace informal, advocacy-driven capacity allocation with **explicit, deliberate, reviewed allocation.**

The mechanism is a **product council** — a small standing group with representation from both motions plus product and engineering leadership — whose specific job is to allocate engineering feature capacity between the motions. Not to prioritize individual features in the abstract, but to make and own the higher-order decision: what percentage of feature capacity goes to land-and-expand work and what percentage to enterprise work, this quarter, deliberately. "This quarter enterprise gets 60% and land-and-expand gets 40%, because we have three enterprise deals contingent on SSO and SCIM and we have decided to win them." That allocation is made openly, with the reasoning recorded, on a fixed cadence — quarterly is typical — and it is revisited on that cadence rather than relitigated every week.

Several disciplines make this work. **The percentage is explicit and visible**, so everyone knows the deal and nobody is surprised. **Each motion prioritizes within its own allocation** — the land-and-expand owner decides what the 40% builds, the enterprise owner decides what the 60% builds — so the council is not micromanaging features, just governing the split. **Keep-the-lights-on work is carved out first** so the motion allocation is genuinely about discretionary feature capacity, not contaminated by maintenance. **The allocation can shift between quarters but not within one** — stability inside the quarter is what stops the loudest-voice-this-week dynamic. And the council **reviews outcomes**, not just inputs: did the capacity we gave each motion produce what we expected, and what does that tell us about next quarter's split.

The reason this matters: without explicit governance, the roadmap allocation still happens — it just happens implicitly, volatilely, and in favor of whichever motion is loudest or most recently in crisis. Explicit governance does not eliminate the hard choice between motions; the choice is genuinely hard and genuinely zero-sum at the margin. What it does is make the choice **deliberate, owned, and stable** instead of accidental, unowned, and thrashing. A company can survive allocating 40% to a motion that wanted 70%. It cannot survive a roadmap that reallocates chaotically every time someone escalates.

## The Org Design Question

Specialization implies organizational structure, and the structural questions have to be answered explicitly: when do you actually split into two teams, who leads each, how does leadership oversee both, and which functions are dedicated versus shared?

**When to split.** The split is not free, so it should not be premature, but it should also not wait until cannibalization is already structural. The trigger is roughly: when the second motion has enough validated demand to justify dedicated headcount, and when the evidence of cross-motion interference is visible (reps deprioritizing one motion, roadmap thrash, pricing collisions in deals). Splitting before there is real demand for the second motion builds an expensive empty structure; splitting after the cannibalization is structural means you are now re-architecting under duress. The window in between is the right time.

**Who leads each.** Each motion needs a clear owner with real authority over that motion's plan — its quota, its hiring, its priorities. The land-and-expand motion can usually be led by a strong operator running a known playbook. The enterprise motion, especially early, needs a leader with genuine enterprise-selling experience, because the enterprise motion is not the land-and-expand playbook scaled up — it is a different discipline. A common failure is promoting a great land-and-expand leader to also run enterprise; that is the same generalist mistake made at the leadership level.

**How leadership oversees both.** Above the two motion leaders sits a CRO or equivalent whose job is explicitly to own the interfaces between the motions — the pricing fence, the routing rules, the graduation handoff, the roadmap-council representation — and to arbitrate cross-motion conflict by the written rules. The CRO is not running both motions hands-on; they are governing the seam. If there is no single accountable owner of the seam, the seam is where the cannibalization leaks back in.

**Dedicated versus shared functions.** Some functions should be dedicated per motion: the sales teams, obviously; usually the demand-gen programs; often the sales engineering and customer success functions, because enterprise SE and CS work is materially different from land-and-expand SE and CS work. Other functions are shared: engineering (one codebase, governed by the roadmap council), the brand, product management leadership, and the back office. The design principle is that **the things that determine motion behavior — incentives, targets, customer-facing teams — get dedicated; the things that are genuine shared infrastructure stay shared.** Dedicate too little and the motions re-merge; dedicate too much and you have built two companies and lost the efficiency that justified running both motions in the first place.

## The Founder's Allocation Decision

The founder's-time vector deep dive named the problem; this section is the decision the founder actually has to make, and it requires unusual honesty.

The honest question is: **can the founder run both motions well?** And the honest answer, in almost every case, is no. Not because the founder lacks capacity or work ethic, but because the two motions need different things from the founder and the founder's attention is genuinely finite. The mature land-and-expand motion needs steady operating attention and known-playbook execution. The new enterprise motion needs founder-grade strategic energy — the early big deals, the executive relationships, the credibility in the room, the design of the motion itself. A founder split across both gives each the leftover of the other, and leftover founder attention is not enough to establish a new motion.

So the founder picks. The decision rule: **the founder takes the one motion only they can run, and structurally delegates the other.** In the large majority of cases, the motion only the founder can run is the new enterprise motion — because the early enterprise deals need the founder's strategic credibility and relationship weight, and because the enterprise motion has not yet been turned into a playbook someone else can run. The land-and-expand motion, by contrast, is the one that has a known playbook and can be handed to a strong operator. There are exceptions — if the founder is genuinely not the right person to carry enterprise relationships, the right move may be to hire a serious enterprise leader and have the founder go deep on continuing to evolve the land-and-expand motion — but the default, and the harder-to-admit truth, is that the founder should put themselves on the new, hard, unproven motion and let go of the comfortable one.

"Let go" has to be real. Delegating the land-and-expand motion does not mean checking in on it constantly and pulling rank when uncomfortable; that is not delegation, it is hovering, and it leaves the delegate without real authority while still consuming the founder's attention. Real delegation means a capable owner, clear targets, a clear operating cadence, and the founder genuinely redirecting their attention to the enterprise motion. The founder who cannot let go of the familiar motion is, in effect, choosing to under-resource the motion that most needs them — and doing it for emotional comfort while telling themselves it is diligence. The allocation decision is as much a discipline problem as an analytical one.

## Measuring Cannibalization

You cannot manage what you cannot see, and cannibalization is specifically designed by its nature to be invisible until it is structural. So a multi-motion company needs deliberate instrumentation aimed at the specific channels through which the motions interfere. Concretely, watch for:

**Pricing leakage into enterprise deals.** Track how often, and how forcefully, the land-and-expand published price shows up as an anchor in enterprise negotiations. If enterprise deals are systematically being negotiated down toward the self-serve price, or if win/loss notes repeatedly cite the published price as an objection, the pricing fence is failing. This is observable in deal notes, in discount depth on enterprise deals, and in win/loss interviews — but only if someone is explicitly looking for it.

**Enterprise pipeline starving for product.** Track whether enterprise deals are stalling or dying in stages tied to missing enterprise-depth features — security review, SSO, admin requirements, compliance gaps. A pattern of enterprise deals dying for product-gap reasons is the roadmap cannibalization showing up in the pipeline. Conversely, watch whether land-and-expand activation and expansion metrics are decaying because velocity features are not getting built.

**Reps abandoning the hard motion.** Track activity and pipeline progression by motion, by rep. If reps with both motions available are systematically under-working the enterprise motion — fewer activities, pipeline that does not advance, forecasts that always slip — the sales-attention cannibalization is live. Even with separated teams, watch whether the enterprise team is hitting its activity and progression model or quietly drifting.

**Blended CAC hiding a cross-subsidy.** This is the subtle one and gets its own section below, but the headline: if customer-acquisition cost, payback, and unit economics are reported as one blended number across both motions, that blended number can look healthy while concealing that one motion's economics are strong and subsidizing the other motion's economics, which are broken. You only see it if you compute and report the economics per motion.

**Founder-attention allocation.** Harder to instrument but worth attempting honestly: where is the founder's GTM time actually going, and does it match the allocation decision they made? A founder who decided to own enterprise but whose calendar shows them mostly in land-and-expand operating reviews has a measurement signal worth confronting.

The meta-point: cannibalization metrics are not the same as your normal GTM dashboard. They are a deliberate, separate instrumentation layer aimed at the seams between the motions, and someone — usually RevOps — has to own producing and reviewing them on a cadence, because nobody encounters them by accident.

## The Blended-Metrics Trap

The single most common reason multi-motion cannibalization stays invisible until it is structural is the blended-metrics trap, and it deserves its own treatment because it is both pervasive and seductive.

The trap works like this. The company reports its GTM health as a set of company-level numbers: total new ARR, total net revenue retention, blended CAC, blended payback, overall win rate, total pipeline. Each of those numbers is an average across both motions. And averages hide divergence. A blended net revenue retention of 115% can be a healthy land-and-expand motion at 130% averaged with an enterprise motion at 95% — and the 95% is a serious problem completely concealed by the blend. A blended CAC payback of 14 months can be an efficient land-and-expand motion at 8 months subsidizing an enterprise motion at 26 months that is, in isolation, not viable. A healthy-looking total pipeline can be a land-and-expand pipeline that is overflowing alongside an enterprise pipeline that is empty. The blended number is not lying, exactly — it is just averaging away the exact information you need to manage two motions.

The trap is seductive for three reasons. First, blended numbers are easier to produce — segment-level reporting requires the data infrastructure to attribute every cost and every dollar of revenue to a motion, and that infrastructure takes work. Second, blended numbers usually look better — the healthy motion flatters the struggling one, so the blended view is the comfortable view, and there is a quiet incentive not to look closer. Third, the company started as one motion, so one set of company-level metrics is the inherited habit, and nobody decided to change it.

The discipline that defeats the trap is **segment-level reporting as a standing requirement**: every core GTM metric — new ARR, NRR, CAC, payback, win rate, sales cycle, pipeline coverage, magic number — computed and reported per motion, every period, alongside the blended number, not instead of it. The blended number is still useful for the company-level story. But the per-motion numbers are what tell you whether each motion is actually healthy, and whether one is quietly subsidizing the other. Building the attribution infrastructure to make per-motion reporting possible is one of the highest-leverage investments a multi-motion company can make, because it converts cannibalization from an invisible structural problem into a visible managed one. Until the reporting is segmented, the company is flying a two-engine plane with one combined gauge.

## When to NOT Run Two Motions

Everything above is the playbook for running two motions well. But the most valuable thing this entry can do for some readers is tell them the honest counter-truth: **for a meaningful share of companies, the answer to "how do we keep the two motions from cannibalizing each other" is "stop running two motions."**

The fencing apparatus described above — separate teams, separate comp plans, separate marketing programs, pricing architecture, roadmap governance, org redesign — is substantial. It has real cost in headcount, in management attention, and in coordination overhead. That apparatus is justified when there are genuinely two validated motions with enough demand behind each to warrant dedicated structure. It is not justified, and it actively makes things worse, in three common situations.

**Situation one: the company is too small to staff two motions.** A company at $5M-$15M ARR usually does not have the headcount, the management bench, or the capital to run two genuinely-resourced motions. Attempting it produces two under-resourced motions instead of one well-resourced one. At that stage, the elaborate fencing apparatus is not a solution — it is overhead layered on top of a resourcing problem the structure cannot fix. The honest move is to pick one motion, resource it properly, and revisit the second motion later.

**Situation two: there is really only one motion plus a few opportunistic deals.** Many companies that describe themselves as "multi-motion" actually have one real motion — say, a working land-and-expand motion — plus a handful of inbound enterprise deals that happened to show up. That is not two motions. That is one motion with some opportunistic upside. Building separate teams, comp plans, and pricing architecture to govern a few opportunistic deals is over-engineering: you are constructing a two-engine governance system to manage what is really just occasional good luck. The right move is usually to handle the opportunistic deals pragmatically — maybe with one or two specialist resources — without erecting the full apparatus, and to be honest that you have one motion, not two.

**Situation three: "multi-motion" is a euphemism for an unfocused GTM strategy.** This is the hardest one to admit. Sometimes a company is running "two motions" not because it deliberately chose to expand into a validated second segment, but because it never developed conviction about a single core motion and has been doing a bit of everything. In that case the multi-motion structure is not the cause of the problem and it is not the solution either — the problem is the absence of a clear core motion, and no amount of fencing, governance, or specialization fixes a strategy that lacks a center. Layering structure onto strategic incoherence just makes the incoherence more expensive. The fix is upstream: develop conviction about the core motion first.

The diagnostic question to ask honestly: **do we have two validated motions, each with enough demand to deserve dedicated resourcing, that we deliberately chose to run — or do we have one motion plus drift?** If it is one plus drift, the entire playbook above is the wrong tool, and the right tool is focus.

## The Sequencing Alternative

For the companies that conclude they should not run two motions in parallel right now, the alternative is not "give up the second motion forever." It is **sequence the motions instead of parallelizing them.**

Sequencing means: run the land-and-expand motion first, deliberately, until it has produced a durable base — real revenue, a real install base, real product maturity, real organizational muscle. Then, from that position of strength, layer the enterprise motion deliberately as a second phase, with the resources and the organizational maturity to do it well. The two motions still both exist in the company's eventual future; they just do not both exist as fully-resourced motions at the same early time.

The tradeoffs are real on both sides. Parallelizing has the advantage of speed — if you can pull it off, you are building both engines at once and you reach a true two-motion company sooner. Its disadvantage is exactly this entry's subject: at most company stages, parallelizing two motions through an organization that cannot yet properly resource both produces cannibalization, and you spend the money on two motions to get one and a half. Sequencing has the advantage of focus — each motion gets the organization's full attention and resources during its establishment phase, the land-and-expand base funds and de-risks the later enterprise push, and the company builds organizational maturity on motion one before attempting the harder motion two. Its disadvantage is that it is slower, and a slower path carries its own risk if a competitor establishes the enterprise position first.

The decision between parallelize and sequence comes down to an honest assessment of resourcing and stage. A well-capitalized company with genuine validated demand for both motions and the management bench to run both can parallelize — with the full fencing apparatus. A company that is smaller, more capital-constrained, has only one validated motion, or lacks the management depth should sequence. The expensive mistake is the company in the second category telling itself the story of the first — parallelizing two motions it cannot resource, and then trying to fix the resulting cannibalization with structure, when the actual fix was to sequence in the first place.

## Board and Investor Framing

Running two GTM motions creates a communication challenge with the board and with investors, and how the founder frames it materially affects how the company is perceived and supported. The risk is that multi-motion **reads as focus-loss.** Investors are pattern-matchers, and one of the strongest negative patterns they carry is "company that lost focus and is now doing a bit of everything." If the two motions are presented as just two things the company happens to be doing, that is the pattern investors will match to, and the read will be: scattered, unfocused, spreading thin.

The framing that works is to present the two motions as **one deliberate, sequenced, mutually-reinforcing strategy** — not two separate bets. The narrative elements: this is a deliberate choice, not drift; the two motions are connected by a specific mechanism — the graduation path, where land-and-expand seeds and warms accounts that the enterprise motion expands, so the motions feed each other rather than competing; each motion is resourced and measured on its own segment-level economics, so the company can prove each is healthy on its own terms rather than hiding behind blended numbers; and there is explicit structure — specialized teams, pricing architecture, roadmap governance — that shows the company understands the cannibalization risk and has deliberately engineered against it. That last point matters a lot: an investor who hears "we are running two motions" worries; an investor who hears "we are running two motions, here is exactly how they feed each other, here is the per-motion economics, and here is the specific structure we built so they do not cannibalize each other" sees an operator who understands the hard parts.

The honest version of this framing also requires the founder to have actually done the work — the segment-level reporting, the structure, the graduation-path design. Framing cannot paper over an unfocused strategy; if the company really is one motion plus drift, no board narrative fixes that, and a sophisticated board will see through it. But for a company that has genuinely made a deliberate, structured, two-motion choice, the framing work is essential, because the same underlying reality can read as "lost focus" or as "sophisticated, sequenced GTM" depending entirely on whether the founder tells the connected, structured, segment-proven story or just lists two motions.

## Five Real-World Scenarios

**Scenario one — the PLG company undercut by its own price.** A product-led company with a healthy self-serve, land-and-expand motion adds an enterprise motion. The published self-serve price stays prominently on the website because it drives the self-serve funnel. Six months in, the enterprise team is winning fewer deals than projected, and the win/loss notes are consistent: procurement at every large account anchors hard on the published per-seat price and grinds the enterprise quote down toward it. The enterprise motion is not selling value; it is defending against its own company's price list. The fix: a genuinely separate enterprise edition with real feature fences (SSO, admin, audit, security, SLA, dedicated support all behind the enterprise wall), an explicit enterprise floor above the self-serve list price, and reps trained to answer the anchor structurally — "that is a different product." Until the pricing architecture is separated, every enterprise deal re-litigates the same losing argument.

**Scenario two — the founder doing both badly.** A founder who built and loves the land-and-expand motion adds an enterprise motion and insists on personally running both. A year later, the land-and-expand motion is fine but not better than it was, and the enterprise motion has two lighthouse logos and no real momentum. The diagnosis: the founder, under constant pressure, kept drifting back to the comfortable, legible land-and-expand motion and gave the enterprise motion leftover attention — which was never enough to establish it. The fix: the founder makes the honest allocation decision, hands the land-and-expand motion to a strong operator with real authority, and redirects their own attention fully to the enterprise motion that only they can credibly carry — the early big deals, the executive relationships, the motion design.

**Scenario three — the roadmap war.** A company running both motions has one engineering org and no explicit capacity governance. Every product meeting is a fight between the land-and-expand advocates wanting velocity and virality features and the enterprise advocates wanting SSO, audit logs, and compliance. The fight is won each cycle by whoever escalated most recently, the roadmap thrashes, and both motions feel starved. The fix: a product council that allocates feature capacity between the motions by explicit percentage each quarter, with the reasoning recorded, stable within the quarter, each motion prioritizing within its own allocation. The choice is still hard and still zero-sum at the margin — but it becomes deliberate and stable instead of accidental and thrashing.

**Scenario four — reps fleeing the hard motion.** A company asks its existing generalist reps to sell both motions into the same quota. Two quarters later, enterprise pipeline is not advancing — lots of discovery calls, nothing progressing. The reps are not lazy; they are rational. Every hour on the slow, risky enterprise grind is an hour not spent on the warm, fast land-and-expand expansion that closes this quarter, and both pay the same quota. The fix: specialize. A dedicated enterprise team with its own comp plan, quota, and ramp expectation, and a dedicated expansion team — so no rep is ever choosing between motions, because no rep has both in their plan.

**Scenario five — the graduation path that works.** A company runs the model deliberately. The land-and-expand motion seeds accounts cheaply across the market, including inside large organizations. Graduation triggers are defined and monitored — seat growth, multi-team adoption, a security questionnaire arriving. When an account crosses the triggers, a designed handoff moves it to the enterprise motion: a warm introduction, the land-and-expand owner staying involved through the transition, comp paying both the seeding owner and the closing enterprise rep, and the customer experiencing it as an upgrade. The land-and-expand low price is not undercutting enterprise — it is the acquisition mechanism that makes enterprise deals cheaper to win. The two motions are a single compounding pipeline. This is the target state the other four scenarios are failing to reach.

## The Decision Framework

The full sequence for a founder facing this problem:

**Step one — audit the five cannibalization vectors.** Honestly assess where the two motions are interfering: pricing leakage, roadmap competition, sales-attention drift, marketing-message conflict, founder-time split. Name the specific channels of interference rather than treating "cannibalization" as a vague feeling.

**Step two — make the honest go/no-go call.** Before building the apparatus, answer the diagnostic question: do we have two validated motions each deserving dedicated resourcing, or do we have one motion plus drift? If it is one plus drift, or the company is too small to staff two motions, the answer is sequence, not parallelize — stop here and focus.

**Step three — if parallelizing, specialize the motions structurally.** Separate sales teams, separate quotas, separate comp plans. Stop running both motions through one undifferentiated org.

**Step four — fence pricing and roadmap.** Build the pricing architecture (separate editions, real feature fences, enterprise floor, designed migration path) and stand up roadmap governance (a product council allocating capacity by explicit percentage).

**Step five — design per-motion comp, including the graduation handoff.** Separate plans, quota math per motion's reality, no rep arbitrage, and comp that pays both sides of an account graduation.

**Step six — make the founder pick their motion.** The founder takes the one motion only they can run — usually the new enterprise motion — and genuinely delegates the other to a strong operator with real authority.

**Step seven — report by segment.** Build the attribution infrastructure and report every core GTM metric per motion, every period, so cannibalization becomes visible and managed instead of invisible and structural.

**Step eight — design the graduation path and frame it for the board.** Connect the two motions into a deliberate pipeline where land-and-expand seeds what enterprise expands, and tell that connected, structured, segment-proven story to investors so multi-motion reads as sophisticated GTM rather than focus-loss.

The framework is a sequence, not a menu. The go/no-go call in step two is the gate — most of the failures in this space come from companies that skipped it, parallelized two motions they could not resource, and then tried to fix structural cannibalization with more structure.

## 5-Year Outlook

The economics of running multiple GTM motions are shifting, and the direction of the shift matters for how this problem looks by the end of the decade.

**AI lowers the cost of staffing each motion.** The single biggest constraint on running two motions well today is resourcing — two motions need roughly two of everything, and most companies cannot afford it. As AI tooling makes individual GTM contributors more productive — research, outreach drafting, deal support, content production, pipeline analysis — the headcount cost of staffing a motion falls. That partially relaxes the constraint that today pushes most sub-scale companies toward sequencing. More companies will be able to genuinely resource two motions earlier than they could before. The cannibalization-prevention playbook does not change — you still need the fences, the comp design, the roadmap governance — but the threshold company size at which parallelizing becomes viable drifts downward.

**AI-assisted routing between motions gets sharper.** A lot of the motion-fence problem today is the difficulty of cleanly routing accounts to the right motion and detecting graduation triggers in time. As the tooling for scoring accounts, detecting expansion and graduation signals, and routing dynamically improves, the fences become less manual and the graduation-path handoff becomes more reliable and timely. The seam between the motions — historically where cannibalization leaks back in — gets easier to instrument and govern.

**Segment-level economic reporting becomes the default, not the exception.** The blended-metrics trap persists today partly because per-motion attribution is real infrastructure work. As GTM data tooling matures, computing per-motion CAC, payback, NRR, and win rate becomes closer to standard, and the blended-number comfort blanket gets harder to hide behind. Boards and investors will increasingly expect segment-level economics by default, which is healthy — it makes cannibalization visible structurally.

**The strategic logic stays constant.** What does not change: two motions optimizing for different things will always interfere if run through one undifferentiated structure; specialization will always be the structural answer; the founder will always have to make an honest allocation decision; and the question of whether to parallelize or sequence will always come down to honest resourcing and stage. AI changes the cost and the tooling around the playbook. It does not change the playbook's logic, because the logic is about the structural nature of competing motions, not about the technology of executing them. By 2030, more companies will run two motions, they will run them with leaner teams and sharper routing, they will report them by segment as a matter of course — and the ones that still get cannibalized will still be the ones that skipped the honest go/no-go call and parallelized something they should have sequenced.

## Final Framework

The multi-motion coexistence blueprint, assembled:

**The five-vector audit.** Cannibalization runs through five channels — pricing, product roadmap, sales attention, marketing and message, and the founder's time. Name the specific interference in each before doing anything else. Cannibalization is invisible until it is structural; the audit is how you see it early.

**The go/no-go gate.** Before building anything, answer honestly: two validated motions deserving dedicated resourcing, or one motion plus drift? Too small to staff two motions, only opportunistic deals rather than a real second motion, or "multi-motion" as a euphemism for an unfocused strategy — all three mean the answer is sequence, not parallelize. No amount of structure fixes the absence of a clear core motion.

**The motion-fencing rules.** If parallelizing, define explicit segmentation criteria that route every account to exactly one motion, explicit edge-case and graduation-trigger rules, and an enforcement authority that adjudicates conflict by the written rules.

**The pricing architecture.** Genuinely separate editions, real feature fences (the enterprise wall), an explicit enterprise floor above the land-and-expand list price, and a designed migration path so graduation is an upgrade, not a bill shock.

**The comp design.** Separate plans per motion, quota math built on each motion's own economics, no single rep carrying both motions, and comp that pays both sides of an account graduation so the graduation path stays alive in practice.

**The roadmap governance.** A product council that allocates engineering feature capacity between the motions by explicit, deliberate, recorded percentage each quarter — stable within the quarter, each motion prioritizing within its own share.

**The org design.** Split when the second motion has validated demand and interference is visible; a clear owner with real authority for each motion; a CRO who owns the seam between them; dedicate the things that determine motion behavior, share genuine infrastructure.

**The founder-allocation decision.** The founder takes the one motion only they can run — almost always the new enterprise motion — and genuinely delegates the other. Hovering is not delegating.

**Segment-level reporting.** Every core GTM metric, per motion, every period, alongside the blended number. The attribution infrastructure that makes this possible is one of the highest-leverage investments a multi-motion company can make.

**The graduation path.** The target state: land-and-expand seeds and warms accounts that the enterprise motion expands — the two motions as a single compounding pipeline rather than competitors for resources, joined by a designed handoff with a clear trigger, a warm transition, fair comp on both sides, and a customer experience of upgrade.

**The sequence-vs-parallelize call.** The decision underneath all of it. Parallelize only with genuine validated demand for both motions and the resources and management bench to run both — with the full fencing apparatus. Otherwise sequence: land-and-expand to a durable base, then layer enterprise deliberately. The expensive, recurring mistake is the company that should sequence telling itself the story of the company that can parallelize.

The whole thing reduces to one idea: two GTM motions do not add when run through one undifferentiated organization — they interfere, and the structurally-easier motion wins every uncoordinated contest while the harder one starves. The work is to make the relationship between the motions deliberate architecture instead of accident: specialize the motions, fence the points where they touch, govern the shared resources explicitly, make the founder choose, measure each motion on its own terms — or, if the honest answer is that you cannot resource two motions yet, have the discipline to sequence them instead of parallelizing your way into cannibalization.

`;

const flow = `

## The Five Cannibalization Vectors and Their Structural Fixes

\`\`\`mermaid
flowchart TD
  M[Two GTM Motions In One Company] --> V1[Vector 1 Pricing]
  M --> V2[Vector 2 Product Roadmap]
  M --> V3[Vector 3 Sales Attention]
  M --> V4[Vector 4 Marketing And Message]
  M --> V5[Vector 5 Founder Time]
  V1 --> P1[Land Price Anchors Enterprise Deal]
  V2 --> P2[Velocity Features vs Depth Features Compete]
  V3 --> P3[Reps Chase The Easier Commission]
  V4 --> P4[Bottoms Up And Top Down Message Conflict]
  V5 --> P5[Split Focus Dilutes Both Motions]
  P1 --> F1[Fix Separate Price Books Feature Fences Enterprise Floor]
  P2 --> F2[Fix Roadmap Council Allocates Capacity By Percentage]
  P3 --> F3[Fix Specialized Teams Separate Quotas And Comp]
  P4 --> F4[Fix One Brand Two Owned Demand Programs]
  P5 --> F5[Fix Founder Picks The Motion Only They Can Run]
  F1 --> S[Structural Answer Specialize The Motions]
  F2 --> S
  F3 --> S
  F4 --> S
  F5 --> S
  S --> R[Motions Coexist As Designed Architecture Not Accident]
\`\`\`

## The Graduation Path: Two Motions Feeding Each Other

\`\`\`mermaid
flowchart LR
  A[Land And Expand Motion] --> A1[Low Friction Self Serve Entry]
  A1 --> A2[Seeds Accounts Across The Market]
  A2 --> A3[Generates Usage Champions And Proof Of Value]
  A3 --> B[Account Grows]
  B --> B1[More Seats]
  B --> B2[Multiple Teams Adopt]
  B --> B3[Security Questionnaire Arrives]
  B1 --> C[Graduation Trigger Crossed]
  B2 --> C
  B3 --> C
  C --> D[Designed Handoff]
  D --> D1[Warm Introduction Not Cold Re Pitch]
  D --> D2[Land Owner Stays Involved Through Transition]
  D --> D3[Comp Pays Both Sides Of The Graduation]
  D --> D4[Customer Experiences Upgrade Not Reassignment]
  D1 --> E[Enterprise Motion]
  D2 --> E
  D3 --> E
  D4 --> E
  E --> E1[Expands Account Into Platform Deal]
  E1 --> F[Two Motions As One Compounding Pipeline]
  F --> G[Land And Expand Is Top Of Enterprise Funnel]
  G --> A
\`\`\`

`;

const src = `

## Sources

1. **Bessemer Venture Partners — State of the Cloud and the "Go-To-Market" reports** — Framework material on land-and-expand, product-led growth, and sales-led motions and how they combine. https://www.bvp.com/atlas
2. **OpenView Partners — Product-Led Growth research and the PLG-to-enterprise transition** — Analysis of how self-serve motions add enterprise motions and the friction that creates.
3. **a16z — "The New Era of Efficient Growth" and GTM motion essays** — Material on multi-motion go-to-market and the economics of running PLG alongside sales-led.
4. **SaaStr — Jason Lemkin essays on going upmarket, pricing tiers, and sales team specialization** — Practitioner material on adding enterprise to an existing motion.
5. **Mark Roberge, "The Sales Acceleration Formula"** — Sales team design, specialization, comp plan construction, and quota math principles applied here to multi-motion teams.
6. **Tomasz Tunguz (Theory Ventures) — essays on net revenue retention, segment-level economics, and CAC by motion** — Source for the blended-metrics-trap and segment-level reporting argument.
7. **Kyle Poyar (Growth Unhinged) — PLG and pricing architecture writing** — Material on self-serve vs enterprise pricing, packaging fences, and the enterprise edition wall.
8. **Patrick Campbell / ProfitWell — pricing and packaging research** — Source material on separate price books, value-based enterprise pricing, and pricing-page anchoring effects.
9. **Gainsight and customer-success literature on expansion motions** — Material on account management, expansion comp, and the land-and-expand expansion stage.
10. **First Round Review — founder essays on focus, sequencing, and when to add a second motion** — Practitioner perspective on the sequence-vs-parallelize decision.
11. **Winning by Design — revenue architecture and the "bowtie" model** — Framework material on designing motion-specific revenue processes and handoffs.
12. **Pavilion (formerly Revenue Collective) — CRO and RevOps community material on multi-motion org design** — Practitioner material on dedicated vs shared functions and the CRO's role governing the seam.
13. **The Marketing-Led, Sales-Led, Product-Led motion taxonomy as discussed across GTM literature** — Conceptual basis for the marketing-and-message cannibalization vector.
14. **Andreessen Horowitz and Bessemer benchmarking data on CAC payback and NRR by segment** — Reference for why blended unit economics conceal cross-motion subsidies.
15. **Board and investor communication frameworks from venture-backed-company governance literature** — Basis for the board-framing section on presenting multi-motion as deliberate strategy rather than focus-loss.

`;

const num = `

## Numbers

**The Five Cannibalization Vectors**
- Vector 1 — Pricing: land-and-expand list price anchors enterprise negotiations
- Vector 2 — Product roadmap: velocity features vs enterprise-depth features compete for finite eng capacity
- Vector 3 — Sales attention: generalist reps chase the faster, higher-probability commission
- Vector 4 — Marketing and message: bottoms-up and top-down messages conflict on one brand
- Vector 5 — Founder time: split focus dilutes both motions, usually starving the new one

**Pricing Architecture Elements**
- Element 1: genuinely separate editions (quote-based enterprise vs published self-serve)
- Element 2: real feature fences — SSO, SCIM, audit logs, admin, security/compliance certs, data residency, SLA, dedicated support behind the enterprise wall
- Element 3: explicit enterprise floor set above the land-and-expand list price
- Element 4: designed migration path from self-serve spend to enterprise contract

**Roadmap Governance**
- Mechanism: a product council with representation from both motions plus product/eng leadership
- Allocation method: explicit percentage split of feature capacity between motions
- Cadence: set and reviewed quarterly; stable within the quarter
- Each motion prioritizes within its own allocation; keep-the-lights-on work carved out first

**Comp Design — Four Requirements**
- Separate comp plans per motion
- Quota math built on each motion's own economics and ramp curve
- No single rep carrying both motions (prevents arbitrage)
- Comp pays both sides of an account graduation (sourcing credit + closing credit)

**Org Design**
- Split trigger: second motion has validated demand AND cross-motion interference is visible
- Each motion: one clear owner with real authority over its plan
- A CRO/equivalent owns the seam (pricing fence, routing rules, graduation handoff)
- Dedicate: sales teams, demand-gen programs, often SE and CS
- Share: engineering (one codebase, council-governed), brand, PM leadership, back office

**Motion Fences**
- Routing inputs: company size, expected deal size/ACV, buying behavior, industry/regulatory profile, current relationship
- Required components: segmentation criteria, edge-case rules, graduation trigger, enforcement authority
- Graduation trigger signals: seat growth, multi-team adoption, security questionnaire arrival

**The Graduation Path — Designed Handoff Components**
- A clear, monitored trigger (the fence's graduation criteria)
- A defined transition process (warm introduction, land owner stays involved)
- Comp treatment paying both sides
- Customer-experience design (graduation reads as upgrade, not reassignment)

**The Blended-Metrics Trap — Example Divergences**
- Blended NRR 115% can hide land-and-expand at 130% averaged with enterprise at 95%
- Blended CAC payback 14 months can hide efficient land-and-expand at 8 months subsidizing enterprise at 26 months
- Healthy total pipeline can hide overflowing land-and-expand pipeline plus near-empty enterprise pipeline
- Fix: every core metric (new ARR, NRR, CAC, payback, win rate, cycle, coverage, magic number) reported per motion every period

**When NOT to Run Two Motions — Three Situations**
- Company too small to staff two motions (commonly the $5M-$15M ARR band)
- One real motion plus a few opportunistic deals (not actually two motions)
- "Multi-motion" as a euphemism for an unfocused GTM strategy with no clear core

**The Decision Framework — Eight Steps**
- Step 1: audit the five cannibalization vectors
- Step 2: make the honest go/no-go (parallelize vs sequence) call
- Step 3: if parallelizing, specialize the motions structurally
- Step 4: fence pricing and roadmap
- Step 5: design per-motion comp including the graduation handoff
- Step 6: make the founder pick their motion
- Step 7: report by segment
- Step 8: design the graduation path and frame it for the board

**Five Real-World Scenarios**
- Scenario 1: PLG company undercut by its own published price
- Scenario 2: founder running both motions and doing both badly
- Scenario 3: roadmap war between velocity and depth features
- Scenario 4: generalist reps fleeing the hard enterprise motion
- Scenario 5: a clean graduation-path model that works (the target state)

**5-Year Outlook Shifts**
- AI lowers the headcount cost of staffing each motion; threshold size for viable parallelizing drifts down
- AI-assisted account routing and graduation-trigger detection make motion fences less manual
- Segment-level economic reporting becomes the default expectation, not the exception
- The strategic logic (specialize, fence, govern, founder chooses, sequence-or-parallelize) stays constant

`;

const counter = `

## Counter-Case: When Trying To Run Both Motions Is Itself The Mistake

The entire playbook above assumes the premise is sound — that a company genuinely should be running two motions and the only question is how to keep them from cannibalizing each other. For a meaningful share of companies that premise is false, and the most useful counter-case is the one that attacks the premise rather than the execution.

**Counter 1 — The company is simply too small to staff two motions, and the fencing apparatus cannot fix a resourcing problem.** A company at $5M-$15M ARR usually does not have the headcount, the management bench, or the capital to genuinely resource two motions. Running two motions well means roughly two of everything that determines motion behavior — two sales teams, two comp structures, two demand-gen programs, two motion leaders, governance overhead on top. A company that cannot afford that does not get "two motions" by trying anyway; it gets two under-resourced motions, which is strictly worse than one well-resourced motion. And here is the trap specific to this entry: the elaborate fencing apparatus — separate teams, pricing architecture, roadmap council, org redesign — is overhead. For a company whose actual problem is that it cannot resource two motions, building the apparatus does not solve the problem; it adds cost on top of it. The fencing apparatus is justified only when there are genuinely two validated, demand-backed motions worth dedicated resourcing. Below that bar, the apparatus is over-built, and the honest move is to stop running two motions, not to govern the two motions better.

**Counter 2 — What looks like "two motions" is often one motion plus a few opportunistic deals.** A large number of companies that describe themselves as multi-motion actually have one real, validated motion plus a handful of inbound enterprise deals that happened to walk in the door. That is not a second motion. A second motion is a deliberate, demand-backed, resourced go-to-market into a defined segment. A few opportunistic deals are occasional good luck. The mistake is treating the good luck as if it were a motion and erecting the full two-engine governance apparatus to manage it — separate teams, separate comp plans, separate pricing books, a roadmap council — to govern what amounts to a handful of deals a year. That is not sophistication; it is over-engineering, and it imposes real cost and complexity on the organization for almost no return. The right response to opportunistic enterprise deals is usually pragmatic and lightweight: maybe one or two specialist resources to handle them well, no full apparatus, and organizational honesty that the company has one motion, not two. Building cathedral-grade structure around opportunistic upside is a way to make a small good thing into a large expensive distraction.

**Counter 3 — "Multi-motion" is frequently a euphemism for an unfocused GTM strategy, and structure cannot fix the absence of a core.** This is the hardest counter to accept because it implicates strategy, not execution. Some companies are running "two motions" not because they deliberately chose to expand into a second validated segment from a position of strength in the first, but because they never developed real conviction about a single core motion and have been doing a bit of everything since the start. In that situation, the multi-motion structure is neither the cause of the problem nor its solution. The problem is upstream: there is no clear, conviction-backed core motion, and a company without a center cannot be fixed by adding fences, governance, and specialization around the incoherence. Layering the apparatus onto a strategy that lacks a center just makes the incoherence more expensive and more elaborate — you have spent real money and management attention to build sophisticated structure around the absence of a decision. No pricing architecture, no roadmap council, no comp redesign substitutes for the upstream work of developing conviction about what the company's core motion actually is. If a founder reads the five-vector audit and finds that the honest answer is "we do not really have two motions, we have drift," then the entire playbook above is the wrong tool. The right tool is focus — pick the core motion, resource it properly, develop genuine conviction — and that is a strategy problem, not an org-design problem.

**Counter 4 — The apparatus itself can become the company's center of gravity.** Even for companies that genuinely should run two motions, there is a failure mode where the fencing apparatus becomes so elaborate that managing the apparatus displaces running the business. Pricing councils, roadmap councils, routing-authority adjudications, segment-level reporting infrastructure, motion-fence edge-case rules, graduation-handoff processes, cross-motion comp arbitration — each is justified individually, but a company can end up spending so much management bandwidth governing the interfaces between two motions that neither motion gets enough attention on the actual work of selling and building. The structure is supposed to be in service of the motions; when the company starts to feel like it exists to maintain the structure, something has gone wrong. The discipline is to build the minimum apparatus that actually prevents cannibalization, not the maximum apparatus that theoretically could — and to periodically ask whether each piece of governance is still earning its overhead.

**Counter 5 — Sequencing is usually underrated, and parallelizing is usually overrated, because parallelizing flatters the founder's ambition.** The honest base rate is that more companies should sequence than currently do. Parallelizing is seductive because it tells a bigger, faster story — "we are building both engines at once" sounds more ambitious than "we are establishing one motion and will layer the next deliberately." But the seductive story is exactly the trap. For the company that cannot fully resource two motions, parallelizing does not produce a true two-motion company faster; it produces cannibalization, and the company then spends its energy and capital trying to fix the cannibalization with structure when the actual fix was to sequence in the first place. The bias runs strongly toward parallelizing for reasons that have more to do with founder psychology and board-narrative appeal than with operational reality. A genuinely honest assessment of stage, resourcing, and management bench pushes far more companies toward sequencing than founders want to admit.

**The honest verdict.** This entry's playbook for keeping two motions from cannibalizing each other is the right playbook — but only for the company that has correctly passed the go/no-go gate: two genuinely validated, demand-backed motions, deliberately chosen, with the resources and management bench to run both. For that company, specialize, fence, govern, make the founder choose, report by segment. But a large share of companies asking "how do we keep our two motions from cannibalizing each other" have not passed that gate. They are too small to staff two motions, or they have one motion plus opportunistic deals, or "multi-motion" is a polite name for a strategy with no center. For those companies the question itself is wrong, and the answer is not better fencing — it is to stop running two motions: pick one, resource it, sequence the other, and accept that focus is the structural advantage that no amount of cannibalization-prevention apparatus can replace. The most valuable thing a founder can do with this entry is run the go/no-go gate honestly before building any of the structure — because the expensive, recurring mistake in this whole domain is the company that should have sequenced telling itself the story of the company that could parallelize.

`;

const links = `

## Related Pulse Library Entries

- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Sales-motion restructuring and team specialization under change.)
- **q9501** — How do you start a bookkeeping business in 2027? (Single-motion focus discipline as a counterpoint to multi-motion sprawl.)
- **q9502** — How do you start a CPA firm in 2027? (Service-firm GTM motion design.)
- **q9601** — How do you start a fractional CFO business in 2027? (Segment-level economics and motion-specific pricing.)
- **q9602** — How do you start an outsourced controller business in 2027? (Adjacent service-motion design.)
- **q1946** — How do you start a real estate investing business in 2027? (Sequencing vs parallelizing growth strategies.)
- **q1947** — How do you start a property management business in 2027? (Operational motion design under finite resources.)
- **q1948** — How do you start a real estate syndication business in 2027? (Capital and resource allocation across initiatives.)
- **q1949** — How do you start a short-term rental business in 2027? (Focus vs diversification tradeoffs.)
- **q1950** — How do you start a real estate investment fund in 2027? (Investor framing of a multi-pronged strategy.)
- **q9505** — How do you scale a bookkeeping firm past $500K revenue? (When to add a second service line and how to resource it.)
- **q9510** — How do you sell a bookkeeping firm? (How motion clarity affects exit valuation.)
- **q9701** — What is the best practice management software for bookkeeping firms? (Tooling that supports multi-segment operations.)
- **q9702** — How do you hire offshore bookkeepers? (Resourcing a motion cost-effectively.)
- **q9801** — What is the future of bookkeeping in 2030? (Long-term outlook context for GTM-economics shifts.)
- **q9802** — How will AI change bookkeeping by 2030? (AI lowering the cost of staffing motions.)
- **q9525** — How do you decide between PLG and sales-led go-to-market? (Direct upstream decision to the multi-motion question.)
- **q9527** — How do you take a PLG product upmarket into enterprise? (The specific PLG-to-enterprise transition referenced throughout.)
- **q9528** — How do you design a sales compensation plan? (Deep dive on the comp-design vector.)
- **q9529** — How do you build a pricing and packaging strategy? (Deep dive on the pricing-architecture vector.)
- **q9530** — How do you govern a product roadmap across competing stakeholders? (Deep dive on the roadmap-governance vector.)
- **q9531** — When should a founder hire a CRO? (Org-design and the leader who owns the seam between motions.)
- **q9532** — How do you frame strategy changes to your board? (Deep dive on the board-framing section.)
- **q9533** — How do you measure go-to-market efficiency by segment? (Deep dive on segment-level reporting and the blended-metrics trap.)
- **q9534** — How do you structure a land-and-expand motion? (Foundational detail on one of the two motions.)
- **q9535** — How do you build an enterprise sales motion from scratch? (Foundational detail on the other motion.)

`;

const tags = ['go-to-market','land-and-expand','enterprise-sales','plg','sales-motion','pricing-strategy','revops','founder-strategy','org-design','multi-motion'];

const sources = [
  { title: 'Bessemer Venture Partners — State of the Cloud and Go-To-Market reports', url: 'https://www.bvp.com/atlas' },
  { title: 'OpenView Partners — Product-Led Growth research and the PLG-to-enterprise transition', url: 'https://openviewpartners.com' },
  { title: 'SaaStr — Jason Lemkin essays on going upmarket and sales team specialization', url: 'https://www.saastr.com' }
];

const notes = {
  s6: 'Added 15 cited sources: Bessemer State of the Cloud GTM frameworks, OpenView PLG-to-enterprise research, a16z efficient-growth and multi-motion essays, SaaStr/Jason Lemkin upmarket and specialization writing, Mark Roberge sales team design and comp construction, Tomasz Tunguz on segment-level economics and NRR, Kyle Poyar on PLG pricing architecture, ProfitWell/Patrick Campbell on packaging and price anchoring, Gainsight expansion-motion material, First Round Review founder essays on sequencing, Winning by Design revenue architecture, Pavilion CRO/RevOps community material, the marketing/sales/product-led motion taxonomy, a16z/Bessemer CAC and NRR benchmarking, and venture governance board-communication frameworks.',
  s7: 'Added comprehensive structured numbers: the five cannibalization vectors enumerated, the four pricing-architecture elements, roadmap-governance mechanism and cadence, the four comp-design requirements, org-design split triggers and dedicate-vs-share rules, motion-fence components and graduation-trigger signals, the designed-handoff components, blended-metrics-trap example divergences (NRR 115% hiding 130%/95%, CAC payback 14mo hiding 8mo/26mo), the three "when NOT to run two motions" situations, the eight-step decision framework, the five real-world scenarios, and the four 5-year-outlook shifts.',
  s8: 'Added 5-part counter-case attacking the premise rather than the execution: (1) company too small to staff two motions and the fencing apparatus cannot fix a resourcing problem; (2) what looks like two motions is often one motion plus a few opportunistic deals, making the full apparatus over-engineering; (3) "multi-motion" as a euphemism for an unfocused GTM strategy that structure cannot fix because the problem is the absence of a core motion; (4) the apparatus itself becoming the company center of gravity and displacing the actual business; (5) sequencing being systematically underrated and parallelizing overrated because parallelizing flatters founder ambition. Honest verdict: run the go/no-go gate before building any structure.',
  s9: 'Cross-linked 26 related Pulse entries: SDR/sales-motion restructuring (q1899), single-motion focus counterpoints (q9501/q9502/q9601/q9602/q9505/q9510), sequencing-vs-parallelizing and resource-allocation analogs (q1946-q1950), tooling and resourcing (q9701/q9702), AI/GTM-economics outlook (q9801/q9802), and the direct decision-and-deep-dive cluster (q9525 PLG-vs-sales-led, q9527 PLG upmarket, q9528 comp design, q9529 pricing/packaging, q9530 roadmap governance, q9531 hiring a CRO, q9532 board framing, q9533 segment-level GTM measurement, q9534 land-and-expand motion, q9535 enterprise sales motion).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the multi-motion cannibalization playbook for founders running land-and-expand alongside a new enterprise or mid-market motion. Two mermaid diagrams (the five cannibalization vectors mapped to their structural fixes; the graduation-path model showing the two motions feeding each other as one compounding pipeline). Full coverage: the core problem of invisible-until-structural cannibalization, the five vectors (pricing, roadmap, sales attention, marketing/message, founder time) each with a deep dive, the structural answer of specializing the motions, designing motion fences with segmentation/edge-case/enforcement components, the land-and-expand-to-enterprise graduation path with designed handoff, pricing architecture for coexistence (separate editions, feature fences, enterprise floor, migration path), multi-motion comp design (separate plans, quota math, anti-arbitrage, graduation credit), roadmap governance via a product council allocating capacity by percentage, the org-design question (split timing, motion leaders, CRO owning the seam, dedicate-vs-share), the founder allocation decision, measuring cannibalization, the blended-metrics trap, when NOT to run two motions, the sequencing alternative, board and investor framing, five real-world scenarios, an eight-step decision framework, a 5-year outlook on AI changing motion economics, and a final framework. Counter-case attacks the premise: many companies should sequence not parallelize, and no structure fixes the absence of a clear core motion.'
};

runPolish({ id: 'q9526', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
