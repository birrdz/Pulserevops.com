// q94 — What's the right ratio of inbound to outbound pipeline at $20M ARR?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** There is no universal "right" inbound:outbound ratio at $20M ARR — the honest answer is **it depends on your motion, ACV, ICP, and GTM maturity** — but the benchmarks still anchor the conversation. **PLG-led companies** healthily run **70-85% inbound** (product and self-serve generate pipeline; outbound is a thin enterprise-expansion layer). **Sales-led mid-market companies** ($15K-$60K ACV) cluster at **40-60% inbound / 40-60% outbound** — the most common and most balanced profile at $20M. **Enterprise / large-ACV companies** ($75K-$250K+ ACV) run **20-40% inbound / 60-80% outbound**, because the buying committee is too small a population to reach through content alone. The reason **$20M ARR is the specific inflection point**: the inbound engine that carried you from $0 to $20M frequently *cannot* carry you to $50M by itself — it hits a natural ceiling set by category awareness and ICP size — so $20M is when most companies face **the outbound build decision**. Build it wrong and you torch a quarter of pipeline; build it right and you add a second, controllable growth lever. The mechanics that matter: **3-4x pipeline coverage of quota**; SDR fully-loaded cost **$80K-$110K**, **8-14 qualified meetings/month** at steady state, **6-9 months of ramp before net contribution**; inbound usually closes **faster at higher win rates (25-35%)** but has a hard ceiling; outbound usually carries **larger ACV but longer cycles and lower win rates (12-22%)**. Do **not** chase a "balanced ratio" as a vanity target — the counter-case is real: if inbound is genuinely uncapped, if you are PLG-native and outbound fights the model, if your real problem is **conversion not pipeline mix**, or if outbound is a band-aid for a **positioning problem**, adding outbound just adds cost. Set YOUR target ratio from motion + ACV + ICP + GTM maturity, then manage the *trend* of the ratio as you scale toward $50M — not a number copied from a benchmark deck.`;

const core = `

## Why "The Right Ratio" Is The Wrong Question

The question "what's the right ratio of inbound to outbound pipeline at $20M ARR?" is asked constantly in board meetings, RevOps reviews, and CRO interviews — and it is subtly the wrong question, or at least an incomplete one. There is no universal correct ratio because pipeline mix is an **output** of a company's motion, average contract value, ideal customer profile, and go-to-market maturity, not an **input** you should target directly. A PLG company forcing itself to a "balanced" 50/50 split would be destroying capital; an enterprise company running 80% inbound at $20M ARR is almost certainly under-built on outbound and about to stall. The ratio that is healthy for one $20M company is a flashing red warning sign for another.

That said, dismissing the question entirely is also wrong. Benchmarks anchor the discussion for a reason: they tell you whether your mix is *plausible* for your category, they give boards and investors a shorthand for GTM health, and they force a diagnostic conversation about *why* your mix looks the way it does. The right way to use a benchmark ratio is as a **hypothesis-generator**, not a **target**. If a sales-led mid-market company is running 85% inbound at $20M, the benchmark doesn't say "you're wrong" — it says "that's unusual, so either you have an extraordinary inbound engine that should be celebrated and protected, or you have a dangerously under-built outbound function and a looming growth cliff. Which is it?"

So the real question underneath the question is a cluster of better questions: *Is our current mix a strength or a fragility? Is our dominant channel approaching its ceiling? Do we have a second growth lever if the first one slows? Is the mix we have the mix we chose, or the mix that happened to us?* At $20M ARR these questions stop being academic. Below $20M, most companies are still riding whatever channel got them their first traction — usually inbound, founder network, or product-led signups — and the mix is simply "whatever worked." At and above $20M, the company is being underwritten by a board and investors against a path to $50M, $100M, and beyond, and "whatever worked" is no longer a strategy. The mix becomes a deliberate portfolio decision. This entry treats the ratio not as a number to hit but as a **diagnostic instrument** — and the bulk of what follows is about reading that instrument correctly for your specific situation.

## Benchmark Ratios By Motion

Benchmarks are only useful when segmented by motion, because the three dominant SaaS motions produce structurally different healthy mixes. Here is the practical anchoring, with the reasoning that makes each defensible.

**PLG-led: 70-85% inbound.** Product-led companies generate the overwhelming majority of pipeline through self-serve signups, product-qualified leads (PQLs), and bottoms-up adoption that later converts to sales-assisted or sales-led deals. At $20M ARR a healthy PLG company is seeing 70-85% of *sales-touched* pipeline originate from product signals and inbound demand — free trials, freemium accounts hitting usage thresholds, in-product upgrade intent. Outbound exists, but it is a narrow, surgical layer: enterprise expansion into accounts that already have organic product adoption, or "account-based" motions targeting logos where champions already use the free product. The reasoning: in PLG, the product *is* the demand-generation engine, and outbound that ignores product signal is fighting the company's core advantage. Datadog, Figma-era growth, and early Notion all looked like this.

**Sales-led mid-market: 40-60% inbound.** This is the most common profile at $20M ARR and the one most "balanced ratio" advice is implicitly written for. ACVs in the $15K-$60K range, a defined buying committee of 3-6 people, sales cycles of 45-90 days. At this profile a healthy company runs roughly 40-60% inbound (content, paid, organic, referral, events) and 40-60% outbound (SDR-sourced and AE self-sourced). The reasoning: the ICP is large enough that content and demand-gen reach a meaningful slice of it, but the deals are valuable enough and considered enough that proactive outbound into named accounts materially expands the reachable market. Neither channel is sufficient alone; both are economically justified.

**Enterprise: 20-40% inbound.** Large-ACV companies ($75K-$250K+, sometimes $500K+) selling to a small population of high-value accounts run 20-40% inbound and 60-80% outbound. The reasoning is mathematical: if your entire addressable market is 4,000 accounts and each deal is worth $150K, you cannot wait for content to attract a buying committee that may "be in market" once every four years. You must proactively, systematically work named accounts with outbound and account-based plays. Inbound still matters — it warms accounts and signals intent — but it is the minority contributor. Snowflake, MongoDB's enterprise tier, and most infrastructure-software companies live here.

The trap is applying the wrong benchmark to your own company. A founder-led company that grew on inbound content to $20M, now selling increasingly large deals, may *be* an enterprise motion while still *benchmarking* itself as mid-market — and conclude its 70% inbound mix is fine when it is actually a symptom of an under-built outbound function relative to where ACV is heading.

## The Pipeline Source Taxonomy

Before you can reason about ratio, you need a clean taxonomy, because "inbound vs outbound" is a two-bucket simplification of what is really a four-or-five-bucket reality. Sloppy taxonomy is the single most common cause of unproductive ratio debates.

**Inbound** encompasses everything where the prospect raised their hand or the demand was pulled toward you. Sub-sources: **organic** (SEO, direct traffic, organic social), **paid** (search ads, paid social, retargeting, sponsored content), **content** (gated assets, webinars, newsletters, podcast), **referral** (customer referrals, word of mouth, review-site traffic from G2/Capterra), and **PLG / PQL** (self-serve signups and product-qualified leads, where applicable). The unifying trait: the prospect initiated, even if marketing engineered the conditions for them to do so.

**Outbound** encompasses everything where your team initiated contact with a prospect who did not raise a hand. Sub-sources: **SDR cold** (SDR-sourced outbound into accounts with no prior engagement), **AE self-sourced** (account executives prospecting their own pipeline, common in enterprise), and **account-based** (coordinated ABM/ABX plays into named target accounts — arguably its own lane, discussed later).

**Partner / channel** is its own bucket and should never be lumped into inbound or outbound. Channel-sourced pipeline — from resellers, SIs, technology partners, marketplace listings — has different economics, different velocity, and different margin. At $20M ARR partner pipeline is often 5-20% of the total and growing; counting it as "inbound" obscures both its contribution and its build-out needs.

**Expansion** is the fourth bucket and the most frequently mis-counted. CS-sourced or AM-sourced expansion pipeline — upsell, cross-sell, seat growth within existing accounts — is *new pipeline* and *new revenue*, but it is neither inbound nor outbound in the new-logo sense. At $20M ARR with healthy net revenue retention, expansion can be 30-50% of *total* new ARR. If you let expansion get folded into "inbound" (because the customer "came to you"), your inbound number is flattered and your new-logo acquisition mix is hidden.

The practical rule: report at least four buckets — new-logo inbound, new-logo outbound, partner-sourced, and expansion — and only *then* compute an inbound:outbound ratio on the new-logo portion. A ratio computed on a clean taxonomy is a diagnostic; a ratio computed on a muddy one is noise.

## Why $20M ARR Is A Specific Inflection Point

$20M ARR is not an arbitrary milestone for this question — it is, for a large fraction of B2B SaaS companies, the specific point where the original growth engine starts showing strain and the second-engine decision becomes unavoidable.

Here is the typical arc. A company gets to roughly $1-3M ARR on founder network, hustle, and a handful of design-partner deals. It gets from $3M to $20M predominantly on **inbound** — content that ranked, a category that was waking up, paid channels that were still efficient, product-led signups, and word of mouth from an initially delighted customer base. For most companies this inbound engine is genuinely good, and it is genuinely *why* they reached $20M. The danger is precisely that it worked: success with one engine creates organizational conviction that the engine is infinite.

It is not infinite. By $20M ARR, several things are usually happening at once. The most reachable, most "in-market" slice of the ICP has largely been harvested. Content that ranked is now competing with the content of better-funded competitors who watched you prove the category. Paid channels that were efficient at $5M are now saturating — CAC is creeping up quarter over quarter. The category awareness that pulled demand toward you has been partly captured by competitors. And the growth rate the board is underwriting — to get from $20M to $50M in a reasonable window — implies an *absolute* pipeline number that the inbound engine, even growing healthily, increasingly struggles to produce alone.

This is **the outbound build decision**. At $20M ARR, the company must honestly assess: can inbound, with continued investment, realistically produce the pipeline required for the next 2-3 years of plan? If yes — and for some genuinely uncapped-inbound companies it is yes — then building outbound may just add cost. But for most sales-led and enterprise-leaning companies the honest answer is no, inbound alone cannot get us to $50M, and the company needs to deliberately stand up a second, controllable growth lever before the first one's deceleration becomes visible in the numbers. The companies that do this *proactively at $20M* enter $50M with two engines. The companies that wait until inbound visibly stalls — often around $30-35M — are building outbound in a panic, under a missed-quarter cloud, which is the worst possible condition for a build that takes 6-9 months to mature.

## The Inbound Ceiling Problem

The single most important concept for reasoning about pipeline mix at $20M ARR is that **inbound has a ceiling, and the ceiling is structural, not a failure of execution**.

Inbound pipeline scales with three things: brand awareness, content surface area, and total market awareness of the category. Each of these compounds — which is why inbound feels magical from $3M to $15M — but each also has a natural asymptote. Brand awareness within a defined ICP cannot exceed 100% of that ICP, and well before 100% the marginal awareness gets very expensive. Content surface area faces diminishing returns: your 400th blog post ranks for thinner and thinner keywords. And total category awareness, the biggest tailwind in the early days, eventually plateaus — the category either matures or it doesn't, and when it matures, "the category waking up" stops being a free growth source.

The result is a curve that looks like rapid early growth, then a bend, then a much flatter slope. The bend frequently lands somewhere between $15M and $30M ARR for B2B SaaS, which is exactly why $20M is the focal point. The flatter slope is not zero — a good inbound engine keeps growing — but it grows at a rate that, for most companies, is below the rate the business plan requires.

Critically, the inbound ceiling is **per-ICP**. If you have saturated awareness within "mid-market RevOps leaders in North America," inbound growth from that segment is structurally limited — but inbound into a *new* ICP (enterprise RevOps, or EMEA, or an adjacent persona) resets the curve. This is why "expand the ICP" and "expand geographically" are legitimate alternatives to "build outbound" — they raise the inbound ceiling rather than adding a different motion. The diagnostic question is not just "is inbound slowing?" but "is inbound slowing *because the ICP is saturated* or *because execution slipped*?" The two have completely different remedies. Saturation means you need either a new ICP or a new motion (outbound). Execution slippage means you fix the inbound engine, not bolt on a new one. Conflating the two leads companies to build expensive outbound teams when they actually just had a content or conversion problem — which is the heart of the counter-case discussed later.

## The Outbound Build Decision

If the diagnosis is genuine inbound-ceiling-against-business-plan, the company faces the outbound build decision in concrete terms: when to stand up an SDR team, what it costs, how long it ramps, and when it realistically contributes.

**When to start.** The earliest sensible trigger is when inbound growth rate, *projected forward*, falls below the pipeline growth rate the plan requires — and you should run this projection 4-6 quarters out, not react to a single soft quarter. The practical timing for most $20M companies is to begin the build at $18-22M ARR so the team is net-contributing by the time the company is at $28-32M. Starting later means building under duress; starting much earlier risks building outbound before product-market fit is sharp enough for cold prospects to convert.

**The cost.** A first real outbound team is not one SDR. It is a pod: 3-5 SDRs, a frontline SDR manager, tooling (sequencer, data, intent), and the AE capacity to actually work the meetings the SDRs book. Fully-loaded, a 4-SDR pod plus manager plus tooling runs roughly $700K-$1.1M annualized before it produces meaningful closed revenue. This is a real bet, and it should be sized and approved as one.

**The ramp.** An individual SDR takes 60-90 days to be booking meetings at a reasonable clip and 4-6 months to be at full productivity. But the *team* takes longer to be net-contributing, because early on the manager is hiring and training rather than optimizing, messaging is being tested and thrown away, and the AE feedback loop on outbound lead quality hasn't tightened yet. The realistic timeline from "we decided to build outbound" to "outbound is reliably contributing a meaningful, forecastable share of pipeline" is **6-9 months**, and 9-12 months to closed revenue given sales-cycle lag on top of ramp.

**The contribution timeline.** In year one, a well-run outbound build might take new-logo outbound from near-zero to 15-25% of new-logo pipeline. In year two it can reach the 40-60% benchmark for a mid-market motion. Boards and CEOs who expect outbound to be 40% of pipeline within two quarters will kill the function before it matures — the most common cause of failed outbound builds is not bad execution, it is **impatient capital**.

## SDR Economics At $20M ARR

You cannot reason about the outbound build decision without the unit economics, because the entire question of "is outbound worth it" reduces to whether the SDR math closes.

**Fully-loaded SDR cost.** Base salary for an SDR in 2026 runs roughly $50K-$70K depending on geography, with OTE (including variable) of $70K-$95K. Fully loaded — benefits, tooling, management overhead allocation, ramp inefficiency — the real cost per SDR is **$80K-$110K/year**. Use the loaded number; the base-salary number flatters the math and misleads the decision.

**Meetings per month.** A ramped outbound SDR books **8-14 qualified meetings per month** in a mid-market motion (fewer, 5-8, in enterprise where accounts are harder; more, 14-20, in lower-ACV velocity motions). "Qualified" is doing real work in that sentence — it means the meeting met the agreed SDR-to-AE handoff criteria, not just that a calendar invite was accepted.

**The conversion chain.** From qualified meeting, the typical mid-market chain is: meeting → opportunity (held + qualified into pipeline) at **50-65%**; opportunity → closed-won at **12-22%** for outbound-sourced (lower than inbound's 25-35% because the prospect didn't self-select intent). So a ramped SDR booking 10 qualified meetings/month produces roughly 5-6.5 opportunities/month, of which roughly 0.7-1.4 close.

**Payback.** Put it together at a $30K mid-market ACV: one SDR generating ~10-14 closed deals/year produces $300K-$420K in new ARR against a fully-loaded cost of $80K-$110K. That is a defensible 3-4x revenue-to-cost ratio at steady state — *after ramp*. During the 6-9 month ramp the same SDR is underwater. The payback period on the *team* build, accounting for ramp drag and the manager and tooling, is typically **9-15 months**. That is the number to underwrite. If the SDR math doesn't close at your ACV — which happens when ACV is too low to support a human-prospected motion, or so high and rare that meetings are impossibly scarce — that is itself a signal that outbound may be the wrong lever, or that it needs to be AE-self-sourced rather than SDR-driven.

## Inbound Economics At $20M ARR

The mirror-image analysis: inbound economics, channel by channel, because "inbound is cheaper" is a half-truth that depends entirely on which inbound channel and how saturated it is.

**CAC by inbound channel.** At $20M ARR, blended inbound CAC is usually below blended outbound CAC — but the spread varies enormously by sub-channel. **Organic / SEO and customer referral** are the cheapest pipeline sources in the company, often a fraction of paid or outbound CAC, because the cost is largely sunk content and product quality rather than marginal spend. **Content and webinar** sit in the middle. **Paid search and paid social** are the most expensive inbound and the most prone to decay.

**Content and SEO compounding.** The reason inbound feels cheap is that organic and content *compound* — a piece of content written in year two is still generating pipeline in year four at near-zero marginal cost. This is real and it is a genuine structural advantage. But compounding is not infinite growth; it is a slowing accrual against the inbound ceiling described earlier. A content engine can compound and still grow too slowly for the plan.

**Paid efficiency decay.** The hard truth about paid inbound at $20M: it almost always decays. The efficient keywords and audiences get bid up — by you scaling spend, and by competitors who entered the category after you proved it. CAC on paid channels typically rises 15-40% year over year at this stage unless you are constantly finding new paid surface area. A company that looks at its *blended* inbound CAC and sees it holding steady may be masking a healthy organic engine subsidizing a decaying paid engine — and when organic hits its ceiling, the blended number falls apart fast.

**The honest comparison.** Inbound is not categorically cheaper than outbound — *organic and referral* are cheaper, *paid* often is not, and the blended number hides the mix. When a CFO says "just do more inbound, it's cheaper," the RevOps-correct response is "which inbound? Organic is near-capped, paid CAC is rising 25% a year, and content takes 6-12 months to contribute. The cheap inbound is the inbound we can't easily buy more of." That sentence reframes the whole ratio debate from "inbound vs outbound" to "which specific levers can we actually pull, and at what marginal cost."

## The Coverage Ratio Concept

The inbound:outbound ratio is downstream of a more fundamental number: **pipeline coverage** — the multiple of quota that must exist in pipeline for the team to hit plan. Get coverage right and the source mix is a portfolio-construction problem; get coverage wrong and no mix saves you.

**The 3-4x rule.** Most B2B SaaS teams need roughly **3-4x pipeline coverage** of quota in a given period — meaning to close $1 you need $3-4 of qualified pipeline, because win rates, slippage, and pushed deals erode the rest. The exact multiple depends on win rate and cycle length: a team with a 30% win rate and tight cycles can run nearer 3x; a team with an 18% win rate and long enterprise cycles needs 4-5x.

**How mix combines to hit coverage.** Here is where ratio and coverage connect. Total required coverage is a *target*; inbound and outbound (and partner and expansion) are the *contributors* that must sum to it. The portfolio question is: given that inbound will produce some amount with relatively high reliability and a ceiling, how much *must* outbound (and partner, and expansion) produce to close the coverage gap? At $20M ARR the math frequently looks like: inbound reliably delivers, say, 2.0-2.4x coverage and is near its ceiling; the plan requires 3.5x; therefore outbound + partner + expansion must reliably deliver the remaining 1.1-1.5x. That gap *is* the outbound build's mandate, expressed in coverage terms rather than as a ratio.

**Why this framing is better than a ratio.** A ratio is a description; a coverage gap is a mandate. Telling an outbound team "we want to be 50/50 inbound:outbound" gives them a vanity target. Telling them "inbound caps at 2.2x coverage, plan needs 3.5x, partner gives 0.3x, expansion gives 0.4x — your job is to reliably produce 0.6x coverage, which at our quota is $X of qualified pipeline per quarter" gives them an accountable number. The ratio then *emerges* from hitting the coverage mandate. Manage coverage; let the ratio be the readout.

## Pipeline Quality By Source

Not all pipeline is equal, and treating an inbound dollar and an outbound dollar as interchangeable in the forecast is a classic RevOps error. Source predicts quality, and quality predicts realized revenue.

**Inbound: higher intent, faster close, higher win rate — but smaller and capped.** Inbound prospects self-selected; they have a problem they are actively trying to solve. The consequences: inbound-sourced opportunities typically **close faster** (often 20-40% shorter cycles than outbound), at **higher win rates** (25-35% common for mid-market inbound), and with **less discounting** because the prospect arrived with intent rather than being convinced of the need. The downsides: inbound deals are frequently **smaller** (the self-serve-curious buyer is often not the enterprise buyer), and inbound volume is capped by the ceiling.

**Outbound: larger ACV, longer cycle, lower win rate — but uncapped and controllable.** Outbound prospects did not raise a hand; the rep created the opportunity. Consequences: outbound-sourced deals often carry **larger ACV** (you targeted bigger accounts deliberately), but **longer cycles** (you must first create awareness and need, then run the deal) and **lower win rates** (12-22% for mid-market outbound) because some prospects were never really in-market. The upside: outbound volume is *controllable* — you can hire your way to more of it — and it reaches accounts inbound never would.

**Partner: variable, often high win rate, slower to ramp.** Partner-sourced deals frequently have **high win rates** (the partner pre-qualified and lent trust) but **unpredictable volume** and **margin implications** (revenue share, referral fees).

**Expansion: highest win rate, shortest cycle, lowest CAC.** Expansion pipeline closes at the highest rates and lowest cost of any source — which is exactly why expansion-heavy companies can tolerate weaker new-logo mixes.

The forecasting implication is direct: **you cannot apply one blended win rate and one blended velocity to a mixed-source pipeline.** A pipeline that is 70% outbound this quarter and 70% inbound next quarter will convert very differently even at identical total dollars. Forecasting accuracy at $20M ARR depends on modeling each source's conversion and velocity separately — covered in the forecasting section below.

## The "Inbound Plateau" Warning Signs

Because the inbound ceiling is structural and gradual, it rarely announces itself with a single bad quarter. It shows up as a cluster of slow-moving indicators. RevOps leaders should monitor these as a dashboard, because catching the plateau 2-3 quarters early is the difference between a proactive outbound build and a panicked one.

**MQL / signup growth flattening.** The top of the inbound funnel — MQLs, demo requests, or product signups — stops growing quarter over quarter even though spend and content output are flat or rising. This is the earliest and clearest signal.

**CAC rising on inbound channels.** Blended inbound CAC creeps up 15%+ year over year, and decomposing it shows paid channels are the culprit while organic is flat (not growing). The organic engine has stopped *adding* and is merely *sustaining*.

**Content ROI declining.** New content produces less pipeline per asset than content from 18 months ago. The keywords are thinner, the competition is denser, the marginal blog post barely ranks.

**Paid saturating.** You can spend more on paid but conversion-to-pipeline per dollar is falling — you are buying lower-intent traffic because the high-intent traffic is already maxed.

**Win rate or ACV drifting down on inbound.** Sometimes the plateau shows up as quality decay rather than volume decay — inbound is still coming but it is lower-intent, smaller, or worse-fit, because you have exhausted the best-fit self-selecting buyers and are now getting the long tail.

**Sales capacity outrunning inbound.** AEs have open capacity and are increasingly self-sourcing or idle, because inbound isn't filling their pipeline. This is the signal that has the most organizational urgency because the cost (under-utilized AEs) is immediate and visible.

Any one of these can be noise. Three or more together, sustained for two quarters, is the inbound plateau — and the correct response is to have *already started* the outbound (or new-ICP) build, because the build takes 6-9 months and the plateau won't wait.

## Building Outbound Without Breaking Inbound

The most expensive mistake in the outbound build is not failing to build it — it is building it in a way that *damages the inbound engine that is still paying the bills*. There are specific anti-patterns and specific safeguards.

**Anti-pattern 1: pulling AEs off inbound to cold-call.** Under pressure, leadership tells existing AEs to "spend 30% of their time prospecting." This breaks both motions. The AEs, who are good at *closing* warm inbound, are mediocre at *cold prospecting* (a different skill), so outbound underperforms. And the time they spend prospecting is time *not* spent converting inbound, so inbound conversion drops. You have degraded your best engine to half-build a new one. The fix: **dedicated SDRs** whose only job is outbound, hired and managed as a distinct function.

**Anti-pattern 2: one team, blended targets.** Putting inbound-response SDRs and outbound-prospecting SDRs under one manager with one blended quota means the team will always favor the easier pipeline (inbound responses) and outbound will quietly never get built. The fix: **separate the motions** — distinct teams (or at minimum distinct roles with distinct, non-fungible quotas), so outbound activity cannot be cannibalized by easier inbound work.

**Anti-pattern 3: shared messaging.** The pitch that converts a high-intent inbound lead is the wrong pitch for a cold outbound prospect — inbound responders already know they have the problem; outbound prospects must first be made aware of it. Forcing one playbook degrades both. The fix: separate playbooks, separate sequences, separate enablement.

**Anti-pattern 4: starving inbound to fund outbound.** When the outbound build's $700K-$1.1M cost lands in the budget, the temptation is to fund it by cutting content and paid. This is self-defeating: you are kneecapping the engine producing 60% of pipeline to fund an engine that won't contribute for 6-9 months. The outbound build should be funded as **incremental investment** against the path to $50M, not a reallocation from inbound — and if it can only be funded by cutting inbound, the company should question whether it can afford the build at all yet.

The principle: outbound is a **second motion**, not a modification of the first. It gets its own people, its own management, its own playbook, its own budget line, and its own ramp expectations. Treated that way, it adds a lever. Treated as a tax on the existing team, it subtracts from one lever to slowly build another.

## The Account-Based Motion As A Third Lane

The two-bucket "inbound vs outbound" framing misses that account-based motion (ABM / ABX) is genuinely a third lane — neither pure inbound nor pure outbound — and at $20M ARR with enterprise ambitions it often deserves its own strategy, budget, and measurement.

**Why it's not outbound.** Classic outbound is volume prospecting — SDRs working large lists of fit accounts with sequences. Account-based motion is the opposite: a *small, named* set of high-value target accounts, worked with coordinated, multi-channel, multi-stakeholder plays involving marketing, sales, and often executives. The unit of work is the *account*, not the *contact*, and the orchestration is deliberate rather than volume-driven.

**Why it's not inbound.** ABM creates demand into specific accounts proactively — the account did not raise a hand. But unlike volume outbound, it uses inbound-style tactics (targeted content, personalized ads, intent data, events) aimed at a tiny named list.

**Where it fits at $20M.** For companies moving upmarket — the common $20M-to-$50M trajectory — ABM is frequently the bridge between a mid-market inbound past and an enterprise outbound future. It lets the company pursue large logos without yet having a full enterprise outbound machine, and it produces the large-ACV deals that change the revenue profile. The contribution is usually modest in *volume* (a handful of accounts) but large in *value* per win.

**Measurement honesty.** ABM wreaks havoc on a clean inbound:outbound ratio because an ABM-sourced deal often has both an inbound touch (the prospect engaged with targeted content) and an outbound touch (an SDR or AE reached out). The practical fix: give ABM its own bucket in the source taxonomy, the way partner and expansion get their own buckets. Trying to force every ABM deal into "inbound" or "outbound" produces exactly the muddy ratio that makes the whole metric useless.

## Marketing-Sourced vs Sales-Sourced Attribution

No discussion of pipeline ratio survives contact with reality without addressing attribution — because "inbound vs outbound" is, organizationally, often a proxy for "marketing's number vs sales' number," and that makes it political.

**The political battle.** Marketing is usually measured on marketing-sourced pipeline; sales (specifically SDR/outbound) on sales-sourced. When an outbound build is funded, there is an immediate incentive question: if an SDR calls an account that *also* downloaded a whitepaper last quarter and the deal closes, whose number is it? Both teams have budget and headcount riding on the answer. Left unmanaged, this produces double-counting (both claim it), gaming (teams structure activity to claim credit), and genuinely bad decisions (a channel gets defunded because its contribution was attributed elsewhere).

**The measurement reality.** Pure single-touch attribution — "first touch" or "last touch" — is always wrong at the edges, and the edges are exactly the contested deals. First-touch over-credits whatever channel happened to be first (often a long-ago content download); last-touch over-credits whatever channel happened to be last (often the SDR call that scheduled the meeting). Neither reflects that the deal was *produced by the combination*.

**Multi-touch attribution — useful but not a cure.** Multi-touch attribution models distribute credit across touches and are directionally better, but they are still models, they require disciplined data hygiene to mean anything, and they do not eliminate the political problem — they just make it more sophisticated. At $20M ARR most companies do not have the data maturity to run multi-touch attribution that anyone fully trusts.

**The pragmatic resolution.** Three practices that work better than chasing perfect attribution: (1) **define source by a clear, agreed rule** — e.g., "sourced = the channel that created the *opportunity*," with a documented tiebreaker — and accept that the rule is a convention, not a truth; (2) **measure influence separately from source** — report both "outbound-sourced" and "outbound-influenced," so the SDR team gets credit for warming deals that close as inbound without double-counting them as sourced; (3) **make AE comp source-neutral** (covered next) so the *closer* doesn't care about the attribution fight, which drains much of the political heat. The goal is not a perfect attribution model — it is a *good-enough, agreed* model that lets the company reason about mix without the metric becoming a weapon.

## SDR Org Design

How you structure the SDR organization materially affects the pipeline mix you can produce — org design is not an afterthought to the ratio, it is an input.

**SDR-to-AE ratio.** The common range is **1 SDR per 1-3 AEs**, depending on motion. Velocity / lower-ACV motions run leaner (1:2 or 1:3) because AEs can handle more pipeline; enterprise motions run richer (1:1 or even 2:1) because the prospecting work per account is heavier. At $20M ARR mid-market, 1 SDR per 2 AEs is a typical starting point.

**Inbound SDRs vs outbound SDRs.** A frequent and important split: **inbound SDRs** (sometimes called MDRs) qualify and route the demand marketing generates; **outbound SDRs** (sometimes called BDRs) prospect cold into named accounts. These are different skills, different day-to-day work, and — critically — should have **different, non-fungible quotas**. Blending them, as noted earlier, lets outbound quietly die. Many companies at $20M formally separate the two roles for exactly this reason.

**Reporting line: marketing or sales?** The perennial debate. **Inbound SDRs reporting to marketing** keeps the lead-to-qualification handoff tight and aligns marketing's incentives to lead *quality* not just volume. **Outbound SDRs reporting to sales** keeps the prospecting motion aligned with the AE motion and the named-account strategy. A common $20M structure: inbound SDRs under marketing (or under a shared "demand" function), outbound SDRs under sales. What matters less is the exact box on the org chart and more that (a) the two motions are not blended into one fungible pool, and (b) whoever owns the SDR team is accountable for a *pipeline* number, not an *activity* number.

**Span of control.** A frontline SDR manager can effectively manage 5-8 SDRs. The first outbound build's pod of 3-5 SDRs needs one dedicated manager — do not expect a sales director to "also manage" the SDRs as a side responsibility; that is a recipe for the build stalling.

## The Ramp Reality For Outbound

The ramp reality deserves its own treatment because misjudging it is the single most common reason outbound builds get killed before they work.

**Individual ramp.** A new outbound SDR: month 1 is onboarding, learning the product, the ICP, the tools. Month 2-3, they are running sequences and booking *some* meetings, but quality is uneven. Month 4-6, they reach steady-state productivity — the 8-14 qualified meetings/month. So an *individual* SDR is roughly 4-6 months to full productivity.

**Team ramp is longer than individual ramp.** This is the part leadership consistently underestimates. When you build the *team* from scratch, the manager spends the first quarter hiring and onboarding rather than optimizing. The messaging and sequences are version 1 — they will be substantially rewritten twice before they work. The list-building and targeting is unrefined. The AE-handoff criteria are not yet calibrated, so early "qualified meetings" get bounced back and the conversion math looks worse than it will be. The intent and data tooling is not yet integrated into a smooth workflow. Stack these and the *team* takes **6-9 months** to be reliably net-contributing to pipeline, and 9-12 months to closed revenue.

**The contribution curve.** Quarter 1 of the build: outbound is a cost, near-zero pipeline contribution. Quarter 2: outbound is producing pipeline but it is lumpy and the conversion rates are still settling. Quarter 3-4: outbound is a reliable, forecastable contributor, climbing toward 15-25% of new-logo pipeline. Year 2: outbound can reach the 40-60% benchmark for a mid-market motion. A board or CEO expecting quarter-2 outbound to look like year-2 outbound will conclude the build failed and cut it — which is why **setting ramp expectations explicitly, in writing, at the time the build is approved** is one of the highest-leverage things a RevOps leader can do.

## Pipeline Forecasting With Mixed Sources

Once a company has a genuinely mixed pipeline, forecasting accuracy depends on respecting that the sources behave differently. A single blended model will be wrong in proportion to how much the source mix shifts quarter to quarter.

**Different conversion rates.** As established: inbound-sourced opportunities convert at 25-35% (mid-market), outbound at 12-22%, partner often higher, expansion highest. A forecast that applies one win rate to total pipeline will over-forecast in outbound-heavy quarters and under-forecast in inbound-heavy ones.

**Different velocities.** Inbound deals close faster; outbound deals take longer to create *and* longer to close. So $1M of inbound pipeline created today and $1M of outbound pipeline created today will *land* in different quarters. A time-to-close model must be source-specific or the timing of the forecast will be wrong even if the totals are right.

**Different predictability.** Inbound volume is relatively predictable quarter to quarter (it moves with the slow ceiling, not abruptly). Early-stage outbound is *lumpy* — a new pod's output swings widely until it matures. Partner pipeline is the least predictable of all. The forecast should carry *different confidence bands* by source, not a single uniform band.

**The practical model.** At $20M ARR the forecasting baseline should be a **source-segmented pipeline model**: for each source bucket (inbound, outbound, partner, expansion), track its own creation rate, its own stage-conversion rates, its own average cycle time, and its own historical forecast accuracy. Roll those up rather than starting from a blend. This is more work, but it is the difference between a forecast that survives a mix shift and one that misses badly the first quarter outbound becomes material. It also produces a side benefit: a source-segmented model *automatically* surfaces the inbound:outbound ratio and its trend as a natural output — you get the diagnostic for free.

## Comp Implications

Compensation design quietly determines whether your pipeline mix strategy actually executes — because reps optimize for what they are paid on, and if comp contradicts the strategy, comp wins.

**SDR comp: meetings vs SQLs vs sourced-revenue.** SDR variable pay can be tied to (a) **meetings booked**, (b) **qualified opportunities accepted** (SQLs), or (c) **sourced revenue** that eventually closes. Paying on *meetings booked* alone produces volume gaming — meetings that should never have been booked. Paying on *sourced revenue* alone introduces a long, noisy feedback loop the SDR can't control and demotivates. The common best practice at $20M: pay primarily on **qualified opportunities accepted by the AE** (which forces quality at the handoff), with a smaller kicker on **sourced closed revenue** (which keeps the SDR caring about fit, not just volume). This structure makes the SDR's incentive align with *real pipeline*, which is exactly what the ratio strategy needs.

**AE comp must be source-neutral.** This is the critical one. If an AE is paid more (or it is easier to hit quota) on inbound deals than on outbound deals — because inbound closes faster and at higher win rates — then AEs will neglect outbound-sourced opportunities, the outbound build will underperform for reasons that look like "outbound leads are bad" but are actually "AEs don't work them," and the ratio strategy fails. The fix: **AE comp and quota credit must be identical regardless of pipeline source.** An outbound-sourced closed deal pays exactly what an inbound-sourced closed deal pays. This removes the AE from the attribution fight entirely and ensures every source of pipeline gets worked with equal effort. Source-neutral AE comp is non-negotiable for any company deliberately diversifying its pipeline mix.

**Marketing and SDR-manager comp.** Marketing variable should be tied to *qualified* pipeline or sourced revenue, not raw MQLs, so the inbound number reflects quality. The SDR manager should be on team-sourced qualified pipeline, aligned with the same accountable coverage number the build was justified by.

## Tooling Stack

The pipeline-mix strategy has a tooling footprint, and at $20M ARR the stack is usually being formalized — moving from "whatever we accumulated" to a deliberate architecture.

**Outbound execution.** **Outreach** and **Salesloft** are the dominant sales engagement platforms — sequencing, cadence management, dialer, activity tracking for the SDR team. At $20M building a real outbound function, one of these is effectively table stakes. Cost runs roughly $100-$160/user/month.

**Intent data.** **6sense** and **Demandbase** are the leading intent / account-based platforms — they tell you which accounts are showing buying signals so outbound and ABM can prioritize. These are significant investments (often $50K-$150K+/year) and are most justified once the outbound and ABM motions are real, not before.

**Contact and account data.** **Apollo**, **ZoomInfo**, and **Cognism** provide the contact data and account intelligence that fuel outbound list-building. ZoomInfo is the enterprise-grade (and enterprise-priced) option; Apollo is the common mid-market choice that also bundles sequencing.

**Inbound / marketing automation.** **HubSpot** and **Marketo** anchor the inbound side — form capture, lead scoring, nurture, MQL routing. The marketing automation platform is usually already in place by $20M; the question at this stage is integration discipline, not selection.

**CRM as the system of record.** **Salesforce** (or HubSpot CRM for some mid-market companies) must be the single source of truth where the source taxonomy actually lives — the source field, the influence tracking, the stage history. If the CRM's source data is sloppy, every ratio and every forecast downstream is sloppy. RevOps's highest-leverage tooling work at $20M is often not buying a new tool — it is enforcing clean source attribution in the CRM the company already has.

**The integration point.** The tools matter less than whether they are wired together so that a lead's full source history — inbound touches, outbound touches, ABM touches — lands in one place. A best-in-class stack with broken integrations produces worse ratio data than a modest stack with disciplined hygiene.

## 5 Real Case Studies

**HubSpot — inbound-heavy, then outbound added.** HubSpot is the canonical inbound company; it literally coined "inbound marketing" and scaled to nine figures of revenue substantially on content, organic, and a free tier. But as HubSpot moved upmarket and the early ICP saturated, it built a substantial outbound and sales-led motion on top of the inbound base. The lesson for a $20M company: an extraordinary inbound engine is a foundation to build *on*, not a reason to never build outbound — even the company that invented inbound eventually needed a second motion to keep climbing.

**Gong — outbound-led from early.** Gong scaled rapidly with a famously aggressive, well-resourced outbound and ABM motion, paired with strong brand and content. It did not wait for inbound to plateau before investing in outbound — outbound was a primary engine early. The lesson: for a category where the buyer (sales leaders) is a definable, reachable population and the ACV supports it, a deliberately outbound-led mix can be the *right* mix well before $20M, not a fallback.

**Snowflake — enterprise outbound at scale.** Snowflake's go-to-market is the enterprise-outbound archetype: large ACVs, named-account targeting, heavy field sales and SDR investment, account-based orchestration. Inbound and brand matter — they warm the accounts — but the motion is fundamentally proactive and outbound-led because the buying population is finite and high-value. The lesson: at large ACV, the "right ratio" tilts heavily to outbound, and a Snowflake-type company running 70% inbound at $20M would be dangerously under-built.

**Datadog — PLG + inbound + land-and-expand.** Datadog scaled on a product-led motion: self-serve adoption, bottoms-up usage, then a sales-assisted layer to land and *expand* within accounts. Its mix has been heavily inbound/product-sourced, with outbound as a targeted enterprise-expansion layer rather than the primary new-logo engine. The lesson: a genuinely strong PLG motion legitimately runs a 70-85%-inbound mix at $20M and beyond — and forcing it toward "balance" would fight its core advantage.

**Klaviyo — inbound-dominant in e-commerce.** Klaviyo scaled in the e-commerce / Shopify ecosystem with an inbound- and partner-dominant motion — a large, definable population of e-commerce merchants reachable through content, the Shopify ecosystem, agency partners, and product-led adoption. Outbound exists but the ICP's size and the partner ecosystem make inbound-plus-partner the efficient core. The lesson: when the ICP is large and there is a strong partner ecosystem, an inbound-dominant mix can persist healthily well past $20M — the right ratio is set by the *market structure*, not by a benchmark.

Across all five: the "right" ratio was a *consequence* of motion, ACV, ICP, and ecosystem — never a target picked first.

## The Diversification Argument

Beyond the per-company "right mix," there is a portfolio-resilience argument that applies to almost every $20M company: **over-reliance on any single pipeline source is a fragility, independent of how well that source is currently performing.**

A company that is 90% inbound at $20M is one algorithm update, one competitor's content blitz, one paid-channel cost spike, or one category-awareness plateau away from a pipeline crisis — with no second lever to pull. A company that is 90% outbound is one deliverability crackdown, one regulatory change, one data-provider disruption, or one SDR-attrition wave away from the same crisis. Concentration risk in pipeline sourcing is real risk, and it is invisible in good times — the single source is working, so the fragility doesn't show up in any metric until the source breaks.

The resilience case for *some* balance is therefore not "50/50 is optimal" — it is "having a *meaningful, maintained* second source means a shock to the first source is a setback, not an existential event." A company that is 65% inbound / 35% outbound can absorb a 30% inbound shock by leaning on outbound while it fixes inbound. A 95% inbound company facing the same shock has nothing to lean on.

This reframes the ratio target one more time. The question is not "what ratio is optimal?" — it is "do I have a *real* second source, maintained at enough scale to matter, so I am not betting the company on one channel?" For a PLG company that genuinely-correct answer might still be 80% inbound — but with a real, functioning 20% outbound/ABM layer that *could be scaled up* if PLG ever stalled. The diversification argument is about **optionality**, not symmetry.

## Cohort Analysis By Source

The ratio conversation usually stops at pipeline creation — but the more sophisticated $20M companies extend it to *retention and expansion*, because pipeline source predicts not just whether a deal closes but how the customer behaves for years afterward.

**Why source-based cohorts matter.** An inbound-sourced customer self-selected; they had a problem and chose you to solve it. An outbound-sourced customer was convinced; the rep created the awareness and the urgency. It would be surprising if these two cohorts retained and expanded identically — and usually they don't. Inbound-sourced cohorts frequently show **higher gross retention and faster early expansion** (they wanted the thing, they adopt it, they grow). Outbound-sourced cohorts sometimes show **higher early churn** (some were convinced into a purchase that wasn't a great fit) but, when well-targeted, can show **larger absolute expansion** (they were bigger accounts to begin with). The pattern varies by company — the point is to *measure it*, not assume it.

**The practical analysis.** Tag every customer with its sourcing channel at close, then track gross retention, net retention, expansion rate, and time-to-first-expansion *by source cohort* over 12, 24, 36 months. This does two things. First, it corrects the CAC math: if outbound-sourced customers churn 50% faster, outbound's *true* cost per *retained* dollar is much higher than the headline CAC suggested, and the build's economics need re-underwriting. Second, it sharpens targeting: if a particular outbound segment retains and expands as well as inbound, that segment should get more outbound investment; if another outbound segment churns badly, the targeting is wrong and should be cut regardless of how cheap the meetings were.

**The mix implication.** Source-cohort analysis can *change the right ratio*. A company might find its outbound-sourced cohorts retain so much worse that the honest LTV-adjusted economics argue for a *more inbound-weighted* mix than the raw pipeline math suggested — or the reverse. The ratio that is "right" on a pipeline-creation basis and the ratio that is "right" on a retained-LTV basis are not always the same number, and the LTV-adjusted one is the truer one.

## Board & Investor Expectations

At $20M ARR the pipeline mix is not just an internal operating metric — it is something the board and investors actively read, because it signals whether the GTM is *scalable* on the path to $50M and beyond.

**What a healthy mix signals.** Investors underwriting the next round (or the next phase of an existing investment) want to see that growth is not dependent on a single, possibly-fragile source. A mix showing a real, contributing outbound (or ABM, or partner) motion *alongside* a healthy inbound base signals a company with *multiple levers* — which de-risks the plan. A company that is 95% inbound at $20M, even if growing well, raises the question every diligence process asks: "what happens when inbound slows, and do they have a proven second motion?" Conversely, a company that is 90% outbound raises: "is this efficient, and is the CAC sustainable?"

**The trend matters more than the snapshot.** Sophisticated boards care less about the exact ratio in a given quarter and more about its *trajectory* and whether it matches the stated strategy. A company that *said* it would build outbound and shows the ratio shifting toward outbound on the expected ramp curve is executing. A company whose ratio is static despite a stated diversification strategy is not executing — and that gap is what good board members probe.

**What investors want to hear from RevOps.** Not "our ratio is X." Rather: "Our mix is X because our motion is Y and our ACV is Z. Inbound is at A% of its addressable ceiling. We are building outbound, which is on month N of a 6-9 month ramp and tracking to contribute B% of pipeline by quarter Q. Here is the coverage math that justifies the build." That answer demonstrates the RevOps leader is treating the ratio as a managed portfolio, not a number that happened. That is what builds board confidence.

**The fundraising implication.** When raising at $20M, the pipeline-source story is part of the growth story. A diversified, deliberately-managed mix supports a higher multiple than an undiversified one, because it lowers the perceived risk of the forward plan. The ratio is, in this sense, a valuation input — not just an operating metric.

## The Path From $20M To $50M

The ratio is not static — and understanding how it *typically shifts* from $20M to $50M is essential, because the right mix at $20M is usually not the right mix at $50M.

**The common trajectory.** A sales-led company arriving at $20M predominantly on inbound (say 70% inbound) typically sees the ratio shift toward outbound as it scales to $50M — often landing somewhere in the 45-60% inbound range. This is not inbound *failing*; inbound usually keeps growing in absolute terms. It is outbound (and partner, and ABM) growing *faster* off a smaller base, because the company deliberately built those motions to clear the inbound ceiling. The ratio shifts because the *incremental* pipeline increasingly comes from the newer motions.

**Why the shift is healthy when it's deliberate.** A ratio shifting toward outbound on the $20M-to-$50M path is a *good* sign *if* it reflects a planned second-engine build clearing a known inbound ceiling. The same shift is a *bad* sign if it reflects inbound *declining* in absolute terms while outbound merely fills the hole — that is a company papering over a broken primary engine, not building a second one. The diagnostic: is inbound's absolute pipeline still growing while its *share* falls? Healthy. Is inbound's absolute pipeline shrinking? Problem.

**ACV usually drifts up.** The $20M-to-$50M journey almost always involves moving somewhat upmarket — larger deals, bigger logos. That ACV drift *itself* pushes the ratio toward outbound and ABM, because larger deals are less reachable through pure inbound. So part of the ratio shift is mechanical: ACV up → mix tilts outbound.

**Partner and expansion grow as a share.** On the path to $50M, well-run companies also see partner-sourced and expansion pipeline grow as a share of the total. The "inbound:outbound" framing increasingly becomes a four-bucket reality, and a $50M company reasoning only in two buckets has outgrown its own metric.

**The planning takeaway.** At $20M, the RevOps leader should not be targeting a static ratio — they should be modeling the *intended trajectory* of the mix to $50M and managing toward that trajectory. The right artifact is not "our target ratio is 50/50" but "here is how we expect the four-bucket mix to evolve quarter by quarter to $50M, here is the build plan that produces it, and here is how we'll know if we're off track."

## 5-Year Outlook

The economics underneath the inbound:outbound question are shifting, and a $20M company setting its mix strategy should set it with a view to where the levers are heading, not just where they are.

**AI SDRs change outbound economics.** The most significant shift: AI-driven outbound — AI SDRs, AI-assisted prospecting, automated personalization at scale — is changing the cost structure of outbound. If a meaningful fraction of the prospecting, list-building, sequencing, and initial personalization can be done by AI at a fraction of human-SDR cost, the *fully-loaded cost per meeting* for outbound drops, which shifts the entire build-decision math. Outbound that didn't pencil at a given ACV may pencil with AI-augmented economics. The five-year direction: outbound becomes *cheaper to operate per unit*, which, all else equal, argues for outbound being a *larger* share of the healthy mix than the current human-SDR-cost benchmarks imply. But the same AI tools are available to competitors, so the *volume* of cold outbound rises industry-wide — which means deliverability, differentiation, and signal-to-noise get harder, partially offsetting the cost gain.

**Intent data matures.** Intent and buying-signal data is getting better and more accessible. As intent data matures, the line between "inbound" and "outbound" blurs further — outbound into an account showing strong intent signals is, functionally, closer to inbound in conversion behavior. The five-year direction: the *binary* of inbound vs outbound becomes less meaningful than a *spectrum* of prospect intent, and the smartest companies will manage their mix by intent-tier rather than by sourced-channel.

**Buyers self-serve more.** B2B buyers increasingly complete more of the buying journey before talking to a vendor — research, comparison, even trials happen before a sales conversation. This generally *raises* the value of inbound and PLG motions and *raises the bar* for outbound (a cold outreach that ignores how much the buyer already knows lands worse than ever). The direction: inbound and product-led signals get *more* important, but outbound that is *intelligently triggered by those signals* remains essential for reaching accounts that haven't self-initiated.

**What shifts the ratio, net.** Pulling these together: AI lowers outbound's unit cost (argues for more outbound), self-serve buying raises inbound's value (argues for more inbound), and intent data blurs the distinction (argues for managing intent, not channel). The net effect for a $20M company over five years is *not* "the right ratio moves to X" — it is "the right *operating model* shifts from managing a two-channel ratio to managing a continuous, intent-graded, partly-AI-operated demand portfolio." The companies that win will be the ones that stopped thinking in two buckets.

## Final Framework

Pulling the entire entry into a usable decision framework — how to set *your* target ratio, and the diagnostic checklist to pressure-test it.

**Step 1: Classify your motion.** PLG-led, sales-led mid-market, or enterprise? This sets your benchmark anchor: ~70-85% inbound for PLG, ~40-60% inbound for sales-led mid-market, ~20-40% inbound for enterprise. The benchmark is a hypothesis, not a target.

**Step 2: Check your ACV against the motion.** If your ACV is drifting upward toward enterprise levels while you still operate like mid-market, your *future* right ratio is more outbound-weighted than your benchmark suggests. Set the ratio for where ACV is *going*, not where it is.

**Step 3: Assess your ICP size and your position against its ceiling.** Estimate how much of your addressable ICP inbound has already reached. If you're far from the ceiling, inbound has room and the build decision can wait. If you're near it, the outbound (or new-ICP) build is urgent.

**Step 4: Assess GTM maturity.** Is your inbound engine actually well-executed, or merely *present*? If inbound is slowing because of execution gaps, fix inbound — don't build outbound to compensate for a problem you could solve in the existing motion.

**Step 5: Compute the coverage gap, not the ratio.** Determine required pipeline coverage (3-4x quota). Determine what inbound reliably delivers and whether it's near its ceiling. The gap between those is the mandate for outbound + partner + expansion. The ratio *emerges* from filling the gap.

**Step 6: Decide the build — and underwrite the ramp honestly.** If the gap requires outbound, build it as a dedicated second motion (own team, own management, own playbook, own budget), underwrite the 6-9 month ramp explicitly, and protect inbound while you build.

**Step 7: Manage the trajectory, not the snapshot.** Model how the four-bucket mix should evolve to $50M and manage toward that trajectory. Report the ratio as a *readout* of the portfolio, not a target you chase.

**The diagnostic checklist — pressure-test your mix by asking:**
- Is our current mix the mix we *chose*, or the mix that *happened to us*?
- Is our dominant source approaching its structural ceiling, or just executed poorly?
- If our dominant source took a 30% shock tomorrow, do we have a *real* second lever?
- Are we computing the ratio on a *clean* four-bucket taxonomy, or a muddy two-bucket one?
- Is our AE comp genuinely source-neutral, so every source gets worked equally?
- Are we forecasting with source-segmented conversion and velocity, or one blended model?
- Does our source-cohort retention analysis change the LTV-adjusted "right" ratio?
- Is the ratio's *trajectory* matching our stated strategy — or is it static despite a diversification plan?

If you can answer those eight questions crisply, you are managing pipeline mix as a portfolio. If you can only quote a number, you are managing a vanity metric. The right ratio is not a number you copy — it is a conclusion you *derive*, from motion plus ACV plus ICP plus GTM maturity, and then *re-derive* as the business scales.

`;

const flow = `

## Decision Tree: From Motion + ACV + GTM Maturity To Target Ratio

\`\`\`mermaid
flowchart TD
  A[Setting Pipeline Mix Strategy at $20M ARR] --> B{What Is The Motion}
  B -->|PLG Led| C[Anchor 70-85% Inbound]
  B -->|Sales Led Mid Market| D[Anchor 40-60% Inbound]
  B -->|Enterprise| E[Anchor 20-40% Inbound]
  C --> F{Is ACV Drifting Upmarket}
  D --> F
  E --> F
  F -->|Yes ACV Rising| G[Shift Target Toward Outbound]
  F -->|No ACV Stable| H[Hold Benchmark Anchor]
  G --> I{Is Inbound Near Its ICP Ceiling}
  H --> I
  I -->|Far From Ceiling| J[Inbound Has Room Build Decision Can Wait]
  I -->|Near Ceiling| K{Why Is Inbound Slowing}
  K -->|Execution Gaps| L[Fix Inbound Engine First Do Not Build Outbound]
  K -->|Genuine ICP Saturation| M{Can A New ICP Or Geo Reset The Curve}
  M -->|Yes| N[Expand ICP Raises Inbound Ceiling]
  M -->|No| O[Outbound Build Decision Is Now Urgent]
  J --> P[Compute Coverage Gap 3-4x Quota]
  L --> P
  N --> P
  O --> P
  P --> Q{Does Inbound Plus Partner Plus Expansion Fill Coverage}
  Q -->|Yes Gap Closed| R[No Outbound Build Needed Yet Protect Existing Engine]
  Q -->|No Gap Remains| S[Build Outbound As Dedicated Second Motion]
  S --> T[Underwrite 6-9 Month Ramp Explicitly]
  T --> U[Own Team Own Manager Own Playbook Own Budget]
  U --> V[Target Ratio Emerges From Filling Coverage Gap]
  R --> V
  V --> W[Manage Ratio Trajectory To $50M Not Static Snapshot]
\`\`\`

## Pipeline Source Contribution Flow: How Sources Combine Into Quota Coverage At $20M ARR

\`\`\`mermaid
flowchart LR
  A[Inbound Sources] --> A1[Organic And SEO]
  A --> A2[Paid Search And Social]
  A --> A3[Content And Webinar]
  A --> A4[Referral And Review Sites]
  A --> A5[PLG And PQL Signals]
  A1 --> B[Inbound Pipeline 25-35% Win Rate Faster Cycle Capped Volume]
  A2 --> B
  A3 --> B
  A4 --> B
  A5 --> B
  C[Outbound Sources] --> C1[SDR Cold Prospecting]
  C --> C2[AE Self Sourced]
  C --> C3[Account Based ABM ABX Plays]
  C1 --> D[Outbound Pipeline 12-22% Win Rate Longer Cycle Uncapped Volume]
  C2 --> D
  C3 --> D
  E[Partner Sources] --> E1[Resellers And SIs]
  E --> E2[Tech Partners And Marketplace]
  E1 --> F[Partner Pipeline High Win Rate Lumpy Volume Margin Share]
  E2 --> F
  G[Expansion Sources] --> G1[CS Sourced Upsell]
  G --> G2[AM Sourced Cross Sell And Seats]
  G1 --> H[Expansion Pipeline Highest Win Rate Shortest Cycle Lowest CAC]
  G2 --> H
  B --> I[Total Qualified Pipeline]
  D --> I
  F --> I
  H --> I
  I --> J{Coverage Check 3-4x Of Quota}
  J -->|Coverage Met| K[Plan Is Underwritten Manage Mix As Portfolio]
  J -->|Coverage Short| L[Scale The Controllable Lever Outbound Or ABM]
  L --> M[Re Underwrite Build Against Remaining Coverage Gap]
  K --> N[Report Inbound Outbound Ratio As Readout Not Target]
  M --> N
\`\`\`

`;

const src = `

## Sources

1. **SaaS Capital — Spending Benchmarks for Private B2B SaaS Companies** — Annual survey data on sales and marketing spend, pipeline source mix, and growth-stage GTM allocation. https://www.saas-capital.com
2. **OpenView Partners — SaaS Benchmarks Report** — Long-running benchmark series on PLG vs sales-led motion economics, ACV bands, and go-to-market efficiency at scale.
3. **KeyBanc Capital Markets (KBCM) SaaS Survey** — Detailed private-SaaS metrics including pipeline coverage, win rates by source, and sales efficiency benchmarks by ARR stage.
4. **Bessemer Venture Partners — State of the Cloud / Scaling to $100M ARR** — Framework material on the growth-engine transitions companies face between $10M and $50M ARR. https://www.bvp.com/atlas
5. **Tomasz Tunguz — Pipeline, Coverage, and Sales Efficiency essays** — Widely cited analysis of pipeline coverage ratios (3-4x quota) and source-segmented forecasting.
6. **Winning by Design — Revenue Architecture and the SaaS Sales Motion Framework** — Canonical material on SDR-to-AE ratios, ramp curves, and motion design.
7. **Pavilion (formerly Revenue Collective) — GTM Benchmarks and CRO Compensation Data** — Practitioner benchmarks on SDR economics, org design, and inbound/outbound mix by motion.
8. **The Bridge Group — SDR Metrics and Sales Development Benchmark Reports** — Authoritative annual data on SDR fully-loaded cost, meetings per month, ramp time, and SDR-to-AE ratios. https://www.bridgegroupinc.com
9. **Gartner — B2B Buying Journey Research** — Research on buyer self-service trends, the size of the modern buying committee, and pre-vendor-contact research behavior.
10. **Forrester — B2B Revenue Waterfall and Attribution Research** — Framework material on multi-touch attribution, marketing-sourced vs sales-sourced pipeline, and influence measurement.
11. **6sense — Account-Based and Intent Data Benchmark Research** — Data on intent-triggered outbound conversion lift and account-based motion performance. https://6sense.com
12. **Demandbase — Account-Based Marketing Benchmark Data** — Practitioner data on ABM/ABX contribution, named-account targeting, and orchestration outcomes.
13. **Outreach — Sales Engagement Benchmark Reports** — Data on outbound sequence performance, meeting-booking rates, and SDR productivity.
14. **Salesloft — Sales Development Benchmark Data** — Comparative data on cadence performance and SDR conversion chains.
15. **HubSpot — Inbound Marketing Methodology and Company GTM History** — Reference for the inbound-led-then-outbound-added archetype; HubSpot's own scaling narrative.
16. **Datadog S-1 and Investor Materials** — Reference for the PLG + inbound + land-and-expand motion archetype at scale.
17. **Snowflake S-1 and Investor Materials** — Reference for the enterprise-outbound, named-account, large-ACV motion archetype.
18. **Gong — Published GTM and Sales Development Practices** — Reference for the outbound-led-from-early motion archetype.
19. **Klaviyo S-1 and Investor Materials** — Reference for the inbound- and partner-dominant e-commerce ecosystem motion archetype.
20. **ZoomInfo and Apollo — B2B Data Platform Documentation** — Contact and account data tooling underpinning outbound list-building. https://www.zoominfo.com
21. **Marketo / Adobe and HubSpot — Marketing Automation Platform Documentation** — Inbound lead capture, scoring, and routing infrastructure reference.
22. **Salesforce — CRM Pipeline and Opportunity Source Field Documentation** — System-of-record reference for clean source attribution and pipeline reporting.
23. **SiriusDecisions / Forrester — Demand Unit Waterfall** — Foundational model for segmenting pipeline by source and stage for forecasting.
24. **ChartMogul and ProfitWell (Paddle) — SaaS Retention and Expansion Benchmark Data** — Reference for net revenue retention and expansion-pipeline contribution at $20M ARR.
25. **Insight Partners and ICONIQ Growth — Scaling GTM Research** — Growth-equity research on the $20M-to-$50M ARR GTM transition and second-engine build decisions.
26. **CRO and RevOps practitioner community data (RevOps Co-op, Wall Street Oasis SaaS threads, Pavilion forums)** — Aggregated practitioner experience on outbound build timing, ramp reality, and comp design.
27. **The SaaS Sales Method / Jacco van der Kooij** — Framework material on source-neutral AE compensation and revenue-source portfolio management.
28. **Capterra and G2 — B2B Buyer Behavior and Review-Site Sourced Traffic Data** — Reference for review-site referral as an inbound sub-channel.
29. **Bain & Company / McKinsey — B2B Go-to-Market and AI in Sales Research** — Outlook material on AI SDRs and the changing cost structure of outbound prospecting.
30. **Crossbeam and Reveal — Partner Ecosystem and Co-Sell Benchmark Data** — Reference for partner-sourced pipeline economics and channel contribution at scale.

`;

const num = `

## Numbers

**Benchmark Inbound Share By Motion (at ~$20M ARR)**
- PLG-led: 70-85% inbound / 15-30% outbound
- Sales-led mid-market ($15K-$60K ACV): 40-60% inbound / 40-60% outbound
- Enterprise ($75K-$250K+ ACV): 20-40% inbound / 60-80% outbound
- Typical $20M-to-$50M shift (sales-led): from ~70% inbound toward ~45-60% inbound

**Pipeline Source Taxonomy (recommended reporting buckets)**
- New-logo inbound: organic, paid, content, referral, PLG/PQL
- New-logo outbound: SDR cold, AE self-sourced, account-based
- Partner / channel sourced: typically 5-20% of total pipeline at $20M, growing
- Expansion (CS/AM sourced): often 30-50% of total new ARR at healthy NRR

**Pipeline Coverage**
- Standard required coverage: 3-4x of quota
- High win rate (~30%) + tight cycles: nearer 3x acceptable
- Low win rate (~18%) + long enterprise cycles: 4-5x needed
- Example $20M coverage gap: inbound delivers ~2.0-2.4x, plan needs ~3.5x, outbound+partner+expansion must deliver ~1.1-1.5x

**SDR Economics**
- SDR base salary (2026): $50K-$70K
- SDR OTE (with variable): $70K-$95K
- SDR fully-loaded cost: $80K-$110K/year
- Ramped SDR qualified meetings/month: 8-14 (mid-market); 5-8 (enterprise); 14-20 (velocity/low-ACV)
- Meeting -> opportunity conversion: 50-65%
- Opportunity -> closed-won (outbound-sourced): 12-22%
- One ramped SDR annual output at $30K ACV: ~$300K-$420K new ARR
- SDR steady-state revenue-to-cost ratio: 3-4x
- Individual SDR ramp to full productivity: 4-6 months
- Outbound team ramp to reliable net contribution: 6-9 months
- Outbound team ramp to closed revenue: 9-12 months
- Team build payback period: 9-15 months

**Outbound Build Cost**
- First outbound pod: 3-5 SDRs + 1 frontline manager + tooling
- Fully-loaded annualized cost of first pod: $700K-$1.1M before meaningful closed revenue
- Recommended build start: $18-22M ARR (net-contributing by $28-32M ARR)
- Year-1 outbound contribution to new-logo pipeline: 15-25%
- Year-2 outbound contribution (mid-market): 40-60%

**Inbound Economics**
- Cheapest inbound sources: organic/SEO and customer referral
- Mid-cost inbound: content and webinar
- Most expensive / decay-prone inbound: paid search and paid social
- Typical paid CAC year-over-year increase at $20M stage: 15-40%
- Content contribution lag: 6-12 months to meaningful pipeline

**Win Rate And Velocity By Source (mid-market reference)**
- Inbound-sourced win rate: 25-35%
- Outbound-sourced win rate: 12-22%
- Partner-sourced win rate: often higher than both (pre-qualified)
- Expansion win rate: highest of any source
- Inbound cycle length vs outbound: 20-40% shorter
- Expansion cycle: shortest of any source; lowest CAC

**SDR Org Design**
- SDR-to-AE ratio (velocity/low-ACV): 1:2 to 1:3
- SDR-to-AE ratio (enterprise): 1:1 to 2:1
- Typical $20M mid-market starting point: 1 SDR per 2 AEs
- Frontline SDR manager span of control: 5-8 SDRs
- Inbound SDR (MDR) typical reporting line: marketing / shared demand
- Outbound SDR (BDR) typical reporting line: sales

**Inbound Plateau Warning Signs (monitor as a dashboard)**
- MQL / signup growth flattening QoQ at flat-or-rising spend
- Blended inbound CAC rising 15%+ YoY (paid the culprit, organic flat)
- Content pipeline-per-asset declining vs 18 months prior
- Paid: more spend, falling conversion-to-pipeline per dollar
- Inbound win rate or ACV drifting down (quality decay)
- AEs with open capacity / increasingly self-sourcing
- Threshold: 3+ signs sustained 2 quarters = confirmed plateau

**Compensation Design**
- SDR variable: primarily on qualified opportunities accepted, smaller kicker on sourced closed revenue
- AE comp: must be 100% source-neutral (outbound deal pays exactly what inbound deal pays)
- Marketing variable: tied to qualified pipeline / sourced revenue, not raw MQLs
- SDR manager: on team-sourced qualified pipeline (the coverage mandate number)

**Tooling Stack Cost Reference**
- Sales engagement (Outreach / Salesloft): ~$100-$160/user/month
- Intent data (6sense / Demandbase): ~$50K-$150K+/year
- Contact data (Apollo / ZoomInfo / Cognism): mid-market to enterprise pricing tiers
- CRM (Salesforce / HubSpot): system of record for source taxonomy

**Case Study Motion Archetypes**
- HubSpot: inbound-led, outbound added at scale moving upmarket
- Gong: outbound-led + ABM from early stage
- Snowflake: enterprise outbound, named-account, large-ACV
- Datadog: PLG + inbound + land-and-expand, outbound as enterprise-expansion layer
- Klaviyo: inbound + partner dominant, large definable ICP + ecosystem

**Diversification / Risk**
- 90%+ single-source pipeline = concentration fragility (invisible until the source breaks)
- Resilient profile: meaningful, maintained second source that *could be scaled* if primary stalls
- 65/35 mix can absorb a 30% primary-source shock; 95/5 cannot

**Cohort Analysis By Source**
- Inbound-sourced cohorts: typically higher gross retention, faster early expansion
- Outbound-sourced cohorts: sometimes higher early churn, but larger absolute expansion when well-targeted
- Track gross retention, NRR, expansion rate, time-to-first-expansion by source cohort at 12/24/36 months
- LTV-adjusted "right ratio" can differ from pipeline-creation "right ratio"

**5-Year Outlook Drivers**
- AI SDRs: lower fully-loaded cost per meeting -> argues for larger outbound share
- AI outbound volume rises industry-wide -> deliverability/differentiation harder (partial offset)
- Intent data maturing -> inbound/outbound distinction blurs into an intent spectrum
- Buyer self-service rising -> raises inbound/PLG value, raises the bar for cold outbound
- Net: shift from managing a 2-channel ratio to managing an intent-graded demand portfolio

`;

const counter = `

## Counter-Case: When Chasing A "Balanced Ratio" Is The Wrong Move

The body of this entry argues for treating pipeline mix as a deliberately managed portfolio — and for most $20M sales-led companies that means building outbound to clear an inbound ceiling. But the "diversify the ratio" instinct is not universally correct, and a serious RevOps leader should stress-test it hard. There are real situations where chasing a more "balanced" inbound:outbound ratio destroys value rather than creating it.

**Counter 1 — Inbound is genuinely uncapped (or nowhere near its ceiling).** The entire outbound-build argument rests on inbound approaching a structural ceiling. But some companies at $20M genuinely are *not* near it. If the addressable ICP is enormous, if the category is still in early-majority adoption rather than maturing, if organic and content are still compounding at a rate that meets or exceeds plan, then the inbound engine has years of runway left. Building outbound in that situation does not add a needed second lever — it adds a $700K-$1.1M cost center to solve a problem you do not have, and it diverts management attention from scaling the engine that is actually working. The test: project inbound's growth rate forward 6-8 quarters against plan. If inbound *alone* clears the plan, the "balanced ratio" is a vanity metric and building outbound to hit it is value-destructive. Some of the best SaaS companies ran inbound-dominant well past $20M precisely because their inbound was genuinely uncapped — forcing "balance" would have been a mistake.

**Counter 2 — The business is PLG-native and outbound fights the model.** For a true product-led company, the product *is* the go-to-market engine. Self-serve adoption, bottoms-up usage, and product-qualified signals are not just the cheapest pipeline — they are the *strategically coherent* pipeline, because they reinforce the low-friction, land-and-expand motion the whole company is built around. Bolting a traditional volume-outbound SDR motion onto a PLG company often fights the model: it introduces a high-friction, high-cost acquisition path that contradicts the low-friction promise, it targets accounts that would have found the product anyway (cannibalizing free signups into expensive sales-touched deals), and it imports a sales-led cost structure into a company whose unit economics depend on *not* having one. A PLG-native company running 80% inbound is not "unbalanced" — it is *correctly configured*. The legitimate outbound layer for a PLG company is narrow and surgical (enterprise expansion into accounts with existing organic adoption), not a general-purpose new-logo machine. Chasing a 50/50 ratio here means dismantling the company's actual advantage to hit a benchmark borrowed from a different motion.

**Counter 3 — The real problem is conversion, not pipeline mix.** This is the most common and most expensive misdiagnosis. A company sees growth slowing, looks at its pipeline, and concludes "we need more pipeline, and since inbound is tapped, we need outbound." But frequently the problem is not pipeline *volume* or pipeline *mix* — it is pipeline *conversion*. If win rates are quietly declining, if sales cycles are stretching, if deals are stalling in late stages, if the AE team is under-ramped or the product has a competitiveness gap, then *more pipeline of any source* just feeds a leaky funnel. Building outbound to fix a conversion problem is like adding water to a bucket with a hole — it costs $700K-$1.1M and 9 months and the fundamental ratio of input-to-output does not improve. The diagnostic discipline: before approving an outbound build, prove that the constraint is *pipeline creation* and not *pipeline conversion*. If stage-conversion rates are healthy and the only problem is not-enough-pipeline-entering-the-top, outbound is a legitimate answer. If stage-conversion rates are deteriorating, outbound is an expensive distraction from the actual fix — and the company should be spending that $700K-$1.1M on enablement, product, pricing, or sales leadership instead.

**Counter 4 — Outbound is being used as a band-aid for a positioning problem.** Sometimes inbound is slowing not because the ICP is saturated and not because of execution, but because the company's *positioning* has gone stale or muddy — the message no longer cuts through, the category narrative has been captured by a competitor, the value proposition is no longer differentiated. In that situation, inbound slows because the *pull* has weakened. Outbound can paper over this for a while — SDRs can push a muddy message into enough accounts to generate *some* meetings — but it does not fix the root cause, and it actually *masks* it: the company sees outbound "working" and concludes positioning is fine, while the underlying pull continues to erode. Worse, outbound built on weak positioning has terrible economics — low conversion, heavy discounting, poor retention — because you are *convincing* prospects rather than *attracting* them, and convinced-not-attracted customers churn. If inbound is slowing because positioning is weak, the answer is to fix positioning (which re-energizes inbound *and* makes any future outbound dramatically more effective), not to build outbound as a workaround. Outbound cannot out-execute a positioning problem; it can only temporarily hide it at significant cost.

**Counter 5 — The ACV cannot support a human-prospected outbound motion.** Outbound SDR economics only close at certain ACV ranges. If the ACV is genuinely low — a high-velocity, low-price product — a fully-loaded $80K-$110K SDR cannot book enough meetings at enough conversion to pay back, and forcing outbound just to "balance the ratio" produces a structurally unprofitable motion. For a low-ACV product, the correct levers are *more inbound*, *more PLG*, *more product-led conversion*, and possibly *AI-assisted low-cost outbound* — not a traditional human SDR pod. Conversely, at extremely high ACV with a tiny account universe, traditional volume-SDR outbound also breaks down (meetings are too scarce) and the right motion is AE-self-sourced enterprise selling and ABM, not an SDR factory. In both tails, a generic "build outbound to balance the ratio" prescription produces the wrong motion. The ratio must follow the ACV-appropriate motion, not the other way around.

**Counter 6 — Concentration on a working channel can beat diversification, for a time.** The diversification argument in the body is real — but it has a cost, and the cost is *focus*. A company that is 90% inbound and *executing inbound brilliantly* may generate more total growth by going *deeper* on inbound (new content surfaces, new inbound sub-channels, new ICPs reachable through inbound, conversion-rate optimization) than by splitting management attention and budget to half-build an outbound function. Diversification is risk management, and risk management has a price. For a company with strong conviction that its primary channel has real remaining runway, *deliberately* concentrating — while keeping a small, real, scalable-on-demand second motion as an option — can outperform premature diversification. The mistake is not concentration itself; the mistake is *unexamined* concentration (the mix that "happened to you") versus *chosen* concentration (the mix you'd defend in a board meeting with the ceiling math to back it).

**The honest synthesis.** Building outbound to diversify pipeline mix at $20M ARR is the *right* call for the *typical* sales-led, mid-market-or-upmarket company facing a genuine inbound ceiling against an ambitious plan — and that is a large fraction of $20M companies, which is why the body of this entry leans that way. But it is the *wrong* call when inbound is genuinely uncapped, when the company is PLG-native and outbound fights the model, when the real constraint is conversion rather than creation, when outbound would just mask a positioning problem, or when the ACV cannot support the motion. The discipline that separates good RevOps leaders from benchmark-followers is this: never build toward a ratio. Diagnose the actual constraint — ceiling, conversion, positioning, ACV-fit — and build toward *fixing the constraint*. If the constraint is genuinely pipeline-creation-against-a-real-ceiling, outbound is the answer and the ratio will shift as a *consequence*. If the constraint is anything else, the ratio is a distraction and chasing it wastes a year and a million dollars. The "right ratio" is never the goal. It is the readout.

`;

const links = `

## Related Pulse Library Entries

- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Direct continuation of the 5-year outlook on AI SDRs changing outbound economics.)
- **q9501** — How do you start a bookkeeping business in 2027? (Reference entry; pipeline-mix discipline parallels for service-business GTM.)
- **q9502** — How do you start a CPA firm in 2027? (Referral-channel-driven GTM as a counterpoint to inbound/outbound SaaS motion.)
- **q1946** — How do you start a real estate investing business in 2027? (Benchmark-format reference entry in the 10/10 series.)
- **q88** — What is healthy pipeline coverage for a B2B SaaS sales team? (Deep dive on the 3-4x coverage concept referenced throughout this entry.)
- **q89** — How do you build an SDR team from scratch? (Operational detail on the outbound build decision and first-pod construction.)
- **q90** — What is the right SDR-to-AE ratio? (Org-design deep dive expanding the SDR org section here.)
- **q91** — How long does it take an SDR to ramp? (Ramp-reality deep dive supporting the 6-9 month team-ramp claim.)
- **q92** — How do you forecast a B2B SaaS sales pipeline? (Source-segmented forecasting methodology referenced in this entry.)
- **q93** — What is multi-touch attribution and is it worth it? (Attribution deep dive supporting the marketing-sourced vs sales-sourced section.)
- **q95** — When should a SaaS company build an outbound motion? (Sister entry; the outbound build decision in full operational detail.)
- **q96** — What is the right pipeline mix for a PLG company? (PLG-specific counterpart to this entry's motion-based benchmarks.)
- **q97** — How do you build an account-based (ABM) motion? (Deep dive on the third-lane account-based motion discussed here.)
- **q98** — What is a healthy CAC by channel for B2B SaaS? (Inbound-economics deep dive supporting the channel-CAC analysis.)
- **q99** — How do you design SDR compensation? (Comp-design deep dive expanding the compensation section.)
- **q100** — How do you design source-neutral AE compensation? (Deep dive on the non-negotiable source-neutral AE comp principle.)
- **q101** — What are the warning signs that inbound is plateauing? (Dashboard deep dive on the inbound-plateau warning signs.)
- **q102** — How do you scale a SaaS company from $20M to $50M ARR? (Stage-transition context for the path-to-$50M section.)
- **q103** — What pipeline metrics should a CRO report to the board? (Board-reporting deep dive supporting the investor-expectations section.)
- **q104** — How do you do cohort analysis by acquisition channel? (Methodology deep dive for the source-cohort retention section.)
- **q105** — What is the right sales and marketing spend ratio at $20M ARR? (Budget-allocation companion to the pipeline-mix question.)
- **q106** — How do AI SDRs change outbound sales economics? (5-year-outlook deep dive on AI-driven outbound cost structure.)
- **q107** — What intent data tools are worth it for a $20M ARR company? (Tooling deep dive on 6sense/Demandbase justification.)
- **q108** — How do you choose between Outreach and Salesloft? (Sales-engagement tooling deep dive.)
- **q109** — What is partner-sourced pipeline and how do you build a channel motion? (Partner-bucket deep dive from the source taxonomy.)
- **q110** — How do you measure expansion pipeline separately from new logo? (Expansion-bucket deep dive from the source taxonomy.)
- **q111** — What does a healthy GTM look like at Series B / $20M ARR? (Stage-context companion entry.)
- **q112** — How do you diagnose whether a growth problem is pipeline or conversion? (Direct support for the counter-case's conversion-not-mix argument.)
- **q113** — How do you know if you have a positioning problem? (Direct support for the counter-case's positioning-band-aid argument.)
- **q114** — What is the right win rate for B2B SaaS by deal source? (Win-rate-by-source deep dive supporting the pipeline-quality section.)

`;

const tags = ['revops','pipeline','inbound','outbound','sdr','gtm-strategy','b2b-saas','20m-arr','sales-development','pipeline-coverage'];

const sources = [
  { title: 'The Bridge Group — SDR Metrics and Sales Development Benchmark Reports', url: 'https://www.bridgegroupinc.com' },
  { title: 'Bessemer Venture Partners — State of the Cloud / Scaling to $100M ARR', url: 'https://www.bvp.com/atlas' },
  { title: 'KeyBanc Capital Markets (KBCM) SaaS Survey', url: 'https://www.key.com' }
];

const notes = {
  s6: 'Added 30 cited sources: SaaS benchmark surveys (SaaS Capital, OpenView, KeyBanc, ICONIQ, Insight Partners), VC scaling frameworks (Bessemer, Tomasz Tunguz, Winning by Design), SDR/sales-development benchmark authorities (The Bridge Group, Pavilion), buyer-behavior and attribution research (Gartner, Forrester, SiriusDecisions Demand Waterfall), intent and ABM data (6sense, Demandbase), sales engagement and data tooling (Outreach, Salesloft, ZoomInfo, Apollo), case-study primary sources (HubSpot, Datadog S-1, Snowflake S-1, Gong, Klaviyo S-1), retention benchmarks (ChartMogul, ProfitWell), partner-ecosystem data (Crossbeam, Reveal), and AI-in-sales outlook research (Bain, McKinsey).',
  s7: 'Added comprehensive numerical analysis: benchmark inbound share by motion (PLG 70-85%, sales-led mid-market 40-60%, enterprise 20-40%), four-bucket pipeline source taxonomy, pipeline coverage math (3-4x quota, worked coverage-gap example), full SDR economics (fully-loaded $80-110K cost, 8-14 meetings/month, 50-65% meeting-to-opp, 12-22% opp-to-close, 3-4x revenue-to-cost, 6-9 month team ramp, 9-15 month payback), outbound build cost ($700K-1.1M first pod), inbound channel economics and paid CAC decay (15-40% YoY), win-rate and velocity by source, SDR org design ratios, inbound-plateau warning-sign thresholds, compensation design parameters, tooling cost reference, case-study motion archetypes, diversification/concentration risk math, source-cohort retention analysis framework, and 5-year-outlook drivers.',
  s8: 'Added 6-part counter-case on when chasing a balanced ratio is wrong: (1) inbound genuinely uncapped or far from ceiling — outbound build solves a non-problem; (2) PLG-native business where volume outbound fights the model and cannibalizes free signups; (3) the real constraint is conversion not creation — more pipeline feeds a leaky funnel; (4) outbound as a band-aid masking a stale-positioning problem; (5) ACV cannot support a human-prospected motion in either the low-ACV or extreme-high-ACV tail; (6) chosen concentration on a working channel can beat premature diversification because focus has value. Closes with the synthesis that one should never build toward a ratio — diagnose the actual constraint (ceiling, conversion, positioning, ACV-fit) and build toward fixing it; the ratio is a readout, never the goal.',
  s9: 'Cross-linked 31 related Pulse entries: the AI-SDR continuation (q1899), benchmark-format reference entries (q9501/q9502/q1946), and a dense cluster of RevOps/GTM deep dives covering pipeline coverage, SDR team building, SDR-to-AE ratio, ramp time, forecasting, attribution, the outbound build decision, PLG pipeline mix, ABM motion, CAC by channel, SDR and source-neutral AE comp, inbound-plateau signals, $20M-to-$50M scaling, board pipeline reporting, channel cohort analysis, S&M spend ratio, AI SDR economics, intent-data and sales-engagement tooling, partner and expansion pipeline, Series B GTM health, pipeline-vs-conversion diagnosis, positioning diagnosis, and win-rate-by-source (q88-q114).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the inbound:outbound pipeline ratio question for a CRO/VP Sales/VP Marketing/RevOps leader at ~$20M ARR SaaS. Two mermaid diagrams: (1) decision tree from motion + ACV + GTM maturity to a derived target ratio via the coverage-gap path; (2) pipeline-source contribution flow showing inbound + outbound + partner + expansion combining into total quota coverage. Full coverage across 27 core sections: why the ratio is the wrong question to target directly, benchmark ratios by motion with reasoning, the four-bucket source taxonomy, why $20M is the specific inflection point, the structural inbound-ceiling problem, the outbound build decision with cost/ramp/timeline, SDR and inbound economics, the coverage-ratio reframe, pipeline quality by source, inbound-plateau warning signs, building outbound without breaking inbound, the account-based third lane, marketing-sourced vs sales-sourced attribution, SDR org design, outbound ramp reality, source-segmented forecasting, compensation implications including non-negotiable source-neutral AE comp, the tooling stack, 5 real case studies (HubSpot, Gong, Snowflake, Datadog, Klaviyo), the diversification/resilience argument, source-cohort retention analysis, board and investor expectations, the path from $20M to $50M, the 5-year outlook (AI SDRs, intent data, buyer self-service), and a final framework with an 8-question diagnostic checklist. Counter-case covers the five-plus situations where chasing a balanced ratio destroys value.'
};

runPolish({ id: 'q94', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
