// q90 — How do I evaluate whether a new vertical is worth the GTM investment?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Evaluating a new industry vertical is a **capital allocation decision disguised as a GTM decision** — treat it like an investment committee memo, not a sales experiment. Score the opportunity on **six weighted factors**: vertical TAM/SAM/SOM (20%), product fit vs. net-new engineering required (25% — the heaviest weight because the "engineering tax" kills more vertical bets than weak demand), competitive density and incumbent switching costs (15%), regulatory complexity and certification cost/timeline (10%), fully-loaded GTM cost to reach first $1M-$3M in vertical ARR (20%), and expansion/retention potential once landed (10%). The **fastest disqualifiers**: you cannot name 10 logo-quality target accounts and have not talked to 5 of them; the product gap requires more than **6-8 engineering-quarters** before a credible v1; regulatory entry (HIPAA, FINRA/SEC, FERPA, SOC 2, FedRAMP) costs more than **$400K-$1.5M and 9-18 months** before you can legally sell; or you have **zero organic customers** in the vertical already. Run the decision through **three staged investment gates** — Gate 1 is research plus 10 customer interviews (~$50K-$150K, 6-10 weeks); Gate 2 is a wedge pilot with 3-5 paying design partners (~$300K-$800K, 2-3 quarters); Gate 3 is a dedicated pod with vertical sales, marketing, and product (~$2M-$5M/year). **Never skip to Gate 3.** The single most expensive mistake is funding a dedicated team before a pilot has proven the wedge — that is how companies burn $3M-$8M and 18 months to "learn" what 10 customer interviews would have told them. The honest base rate: most vertical expansions evaluated look attractive on a TAM slide and fail on engineering tax, incumbent moats, or **focus dilution that quietly degrades the core business**. The right answer is "no" or "not yet" far more often than founders want to hear — and the discipline of saying no on weak verticals is what makes the one "yes" pay off. Frame the bet to your board as **TAM expansion with a capped, gated downside**, not an open-ended strategic adventure.`;

const core = `

## The Vertical Evaluation Framework: The Six-Factor Scorecard

A new vertical is not a marketing campaign you can turn off — it is a multi-year capital commitment that pulls engineering roadmap, sales headcount, marketing budget, executive attention, and brand positioning. The companies that get vertical expansion right treat the decision the way a disciplined investor treats a new position: with an explicit thesis, a written scorecard, pre-committed exit criteria, and an honest accounting of opportunity cost. The companies that get it wrong treat it as an opportunistic "we keep getting inbound from dentists, let's go after dentists" reflex — and discover 18 months and $4M later that dentists wanted three integrations they never built, that the incumbent had a 9-year data moat, and that the core business stalled while the best engineers were chasing the new shiny thing.

The framework that survives contact with reality is a **weighted six-factor scorecard**. Each factor is scored 1-10, multiplied by its weight, and summed to a single number between 1 and 10. The factors and weights:

**Factor 1 — Vertical Market Size (weight 20%).** How many target accounts exist, what is the realistic ACV in this vertical, and what penetration can you actually achieve over five years? This is bottoms-up SOM, not a top-down "the industry spends $40B on software" slide.

**Factor 2 — Product Fit (weight 25%, the heaviest).** What percentage of the vertical's must-have requirements does your current product already meet, and how much net-new engineering is required to close the gap? Product fit gets the heaviest weight because the "engineering tax" — the cost of building vertical-specific data models, integrations, and compliance features — is the single most underestimated line item in vertical expansion and the most common reason vertical bets quietly fail.

**Factor 3 — Competitive Density (weight 15%).** How many credible incumbents already serve this vertical, how deep are their switching costs, and how hard is displacement? A vertical with one sleepy incumbent is very different from a vertical with three well-funded specialists who have spent a decade embedding into customer workflows.

**Factor 4 — Regulatory Complexity (weight 10%).** What certifications, audits, and compliance regimes gate entry — HIPAA, FINRA/SEC, FERPA, SOC 2, FedRAMP, PCI-DSS — and what do they cost in dollars and months before you can legally and credibly sell?

**Factor 5 — GTM Cost (weight 20%).** What is the fully-loaded cost to reach the first $1M-$3M of vertical ARR: vertical sales hires, vertical marketing, conference presence, content, partnerships, and the longer ramp time of selling into an unfamiliar buying center?

**Factor 6 — Expansion & Retention Potential (weight 10%).** Once you land a vertical customer, how sticky are they, how much can you expand, and does the vertical have structural lock-in (regulatory, workflow embedding, data gravity) that protects the revenue?

A composite score above **7.0** is a green light to fund Gate 1. Between **5.5 and 7.0** is a "yellow" that warrants a cheap research gate but not a commitment. Below **5.5** is a no — and the discipline to actually say no on a 4.8-scoring vertical, even when a big customer is dangling a logo in front of you, is what separates companies that compound from companies that scatter. The scorecard's job is not to produce a magic number; its job is to force an honest, written, comparable conversation so the decision is made on evidence rather than on the loudest executive's enthusiasm.

## TAM/SAM/SOM Sizing for a Vertical

Most vertical evaluations die — or worse, proceed wrongly — on the back of a bad market-size slide. The classic failure is the top-down number: "There are 250,000 dental practices in the US and they spend $X billion on software, so the TAM is enormous." That number is true and useless. It tells you nothing about how many accounts you can actually win, at what price, on what timeline.

The discipline is **bottoms-up SOM**, built from three multiplied components: the number of genuinely targetable accounts, the realistic annual contract value in this vertical, and the penetration rate you can credibly achieve over five years.

**Targetable accounts, not total accounts.** Start with the total universe, then subtract relentlessly. Of 250,000 dental practices, how many are multi-location groups large enough to need your product and able to pay your price? Maybe 18,000. How many are in geographies or segments you can actually reach with your GTM motion? Maybe 12,000. How many are not locked into a long-term contract with an incumbent at any given time? Maybe 3,000 are "in window" per year. The targetable, in-window number — not the headline — is what feeds the model.

**Realistic ACV for this vertical specifically.** Vertical ACV is rarely the same as your core ACV. Sometimes it is higher because the vertical has acute pain and budget (financial services, healthcare systems). Sometimes it is structurally lower because the vertical is fragmented and price-sensitive (independent restaurants, small law firms). Build the ACV from the vertical buyer's actual budget reality, the per-unit metric that fits the vertical (per-bed, per-location, per-seat, per-transaction, per-provider), and a defensible expectation of where you land in their stack — anchor tenant or point solution.

**Penetration over five years.** Be honest about the S-curve. A realistic vertical penetration path is something like 0.5% of targetable accounts in year one, 2% by year two, 5% by year three, 9% by year four, 14% by year five — and even 14% of a well-defined targetable base is an aggressive, well-executed outcome. If your model needs 30% penetration to justify the investment, the model is wrong.

The output: SOM = targetable in-window accounts × realistic vertical ACV × five-year penetration curve. If five-year vertical SOM is not at least **$15M-$30M of ARR** — enough to be a real second act, not a rounding error — the vertical is probably too small to justify pulling engineering and executive focus away from the core. The exception is a strategically defensive vertical or one that unlocks a much larger adjacent motion, but those exceptions should be argued explicitly, not assumed.

## Product Fit Assessment

Product fit is the factor that most often determines whether a vertical bet is a quarter-long pivot or a two-year slog, which is why it carries the heaviest weight on the scorecard. The assessment is concrete: enumerate the vertical's must-have requirements, then classify each as **already met**, **configurable** (met with setup, templates, or no-code configuration), or **net-new engineering required**.

Run the exercise as a real audit, not a hand-wave. Pull the top 20-30 requirements a buyer in this vertical will evaluate you on — from RFPs, from competitor feature lists, from the 10 customer interviews you should be doing in Gate 1. For each, assign the classification honestly. The summary statistic that matters: **what percentage of must-haves does the current product meet out of the box, or with configuration only?**

The rough thresholds: if the product meets **80%+** of must-haves with configuration, the vertical is a fast-follow — you can pilot within a quarter. If it meets **60-80%**, you have a real but bounded build — expect 2-4 engineering-quarters before a credible v1. If it meets **less than 60%**, you are not entering a vertical; you are building a new product that happens to share a code base, and the evaluation should be treated as a new-product decision with a far higher bar.

The trap inside product fit is the **"we can configure that" optimism**. Sales and product leaders, eager for the new logo, reclassify net-new engineering as "configuration" because the demo can be faked. The discipline: a requirement is only "configurable" if a customer success engineer can stand it up today, with no engineering ticket, using features that exist in production. Everything else is engineering — and engineering has a cost, a timeline, and an opportunity cost, which is the subject of the next section.

## The "Engineering Tax" Math

Every vertical extracts an engineering tax — the net-new engineering required to build vertical-specific data models, integrations, compliance features, and workflow logic before the product is credible to a real buyer. This tax is the most underestimated number in vertical expansion, and underestimating it is the single most common way vertical bets fail.

The discipline is to enumerate the tax in **engineering-quarters** (one engineer working for one quarter = one eng-quarter) and price it honestly. The categories:

**Vertical data model.** Healthcare needs patient/encounter/claim objects; construction needs project/RFI/submittal/change-order objects; financial services needs account/position/transaction/regulatory-report objects. Retrofitting a vertical's core nouns into a product designed around generic objects is rarely trivial — budget 2-6 eng-quarters depending on how far your existing data model is from the vertical's.

**Vertical integrations.** Every vertical has a small set of systems you must integrate with to be taken seriously — EHRs (Epic, Cerner) in healthcare, the dominant POS in restaurants, the project-management and ERP systems in construction, the core banking and custody systems in finance. Each meaningful integration is 1-3 eng-quarters, and the certified-partner integrations (Epic's App Orchard, for example) carry their own multi-month approval timelines on top of the build.

**Compliance and security features.** Audit logs, data residency, role-based access aligned to the vertical's regulatory roles, encryption standards, retention policies. Budget 1-4 eng-quarters, plus the certification cost covered in the regulatory section.

**Vertical workflow logic.** The business rules, approval chains, and edge cases specific to how the vertical actually operates. This is the long tail that consumes more time than expected — budget 2-5 eng-quarters and expect it to grow.

A typical "real but bounded" vertical entry totals **6-12 eng-quarters** before a credible v1 — call it 3-5 engineers for 6-9 months, fully loaded **$600K-$1.5M**. The critical move is not just totaling the number; it is comparing it against what those same engineering-quarters would produce on the core roadmap. Six eng-quarters spent on a vertical is six eng-quarters not spent on core retention features, core expansion features, or platform reliability. If the vertical's expected return does not clearly beat the core roadmap's expected return on those same quarters, the honest answer is to keep the engineers on core. The engineering tax is not just a cost — it is the clearest expression of opportunity cost in the entire evaluation.

## Competitive Density Analysis

A vertical's competitive density determines how hard you have to fight for every deal and how durable your wins are once you get them. The analysis has three layers.

**Who is already there.** Map the incumbents: the vertical-specialist software companies that built their whole business around this vertical, the horizontal platforms that have a vertical SKU, and the legacy or homegrown systems customers still run. A vertical with one aging incumbent and a lot of spreadsheets is a very different fight than a vertical with three well-funded specialists who raised growth rounds in the last 24 months.

**Switching costs.** How embedded are the incumbents? Switching cost is the real moat — it is built from data gravity (years of historical data in the incumbent's system), workflow embedding (the incumbent is wired into daily operations and adjacent tools), integration depth (the incumbent is the hub other vertical tools connect to), and contractual lock-in (multi-year deals, and the political cost to the buyer of a failed migration). High switching costs do not make a vertical un-winnable, but they do mean every deal is a rip-and-replace with a long cycle, and they should depress the competitive-density score.

**Displacement difficulty.** Given the incumbents and their switching costs, what is your actual path to win? The honest options are: displace on a clearly superior product where the incumbent has stagnated; win the segment the incumbents under-serve (incumbents built for enterprise, you take the mid-market, or vice versa); or win the wedge use case the incumbents treat as an afterthought and expand from there. If you cannot articulate a specific, credible displacement path — not "we have a better UI" but a structural reason customers will switch despite the switching costs — the vertical scores low here regardless of how attractive the TAM looks.

The counterintuitive point: a vertical with **zero credible incumbents** is usually a warning sign, not an opportunity. It often means the vertical does not actually buy software the way you think, the budget is not there, or the pain is not acute enough to drive purchasing. Some competition validates that the vertical is a real market.

## Regulatory Complexity Scoring

Regulatory complexity is the factor most likely to be discovered late and most likely to blow up a timeline. Each regulated vertical gates entry behind a specific set of certifications and compliance regimes, each with a real dollar cost and — more painfully — a real calendar timeline that you cannot compress with money.

**SOC 2 Type II** is the baseline for selling to almost any serious B2B buyer, regulated or not. Budget **$50K-$150K** all-in (auditor, tooling, remediation, internal time) and a **6-12 month** observation period before you hold the report. If you do not already have SOC 2, that is the floor for any new vertical.

**HIPAA (healthcare).** Requires a compliance program, BAAs, technical safeguards, and — practically — the engineering work to support audit logging, access controls, and data handling that withstands a healthcare security review. Budget **$100K-$400K** of program and engineering cost and **6-12 months**, and expect every healthcare deal to run a security review that adds weeks to the cycle.

**FINRA / SEC (financial services).** Recordkeeping rules (e.g., books-and-records and communications-retention requirements), supervision requirements, and data handling that satisfies a regulated buyer's compliance team. Budget **$200K-$800K** and **9-18 months**, and expect the buyer's compliance and legal review to be the longest pole in the sales cycle.

**FERPA (education).** Student-data privacy obligations, contractual data-use restrictions, and increasingly state-level student-privacy laws layered on top. Budget **$75K-$250K** and **6-12 months**.

**FedRAMP (public sector).** The most expensive and slowest of all — budget **$1M-$2M+** and **12-24 months**, often longer. FedRAMP is a strategic, multi-year commitment that should never be undertaken as a side bet.

**PCI-DSS (payments).** Required if you touch cardholder data — budget **$50K-$250K** depending on scope and **6-12 months**.

The scoring move: total the dollar cost and the calendar timeline, and treat the timeline as the binding constraint. A vertical that costs $500K to enter but takes 18 months of certification before you can sell has an 18-month hole in its payback model that the dollar figure alone hides. The honest threshold: if regulatory entry costs more than **~$1M and 18 months** combined, the vertical is a major strategic commitment, not an experiment, and it needs to clear a much higher bar on every other factor.

## GTM Cost Modeling

The GTM cost of a vertical is not "we'll have the existing sales team also sell to this vertical." Selling into a new vertical means selling to an unfamiliar buying center, with unfamiliar objections, against unfamiliar competitors, with no reference customers and no brand permission. That is a different motion, and it costs real money to stand up. Model the fully-loaded cost to reach the first **$1M-$3M of vertical ARR**:

**Vertical sales hires.** You need at least one or two AEs with actual domain credibility in the vertical — people who can speak the buyer's language and bring a network. Vertical specialist AEs are expensive and take **6-9 months to fully ramp** in a new vertical even when experienced. Budget 1-3 reps plus a fraction of a sales-engineering and sales-leadership resource: **$500K-$1.2M/year fully loaded**.

**Vertical marketing.** Vertical-specific positioning, messaging, case studies, and a content engine that speaks to the vertical's pains in the vertical's language. The horizontal brand does not transfer; you are building vertical brand permission from scratch. Budget **$200K-$500K/year**.

**Conference and event presence.** Every vertical has its 2-4 must-attend industry conferences, and presence at them — booth, speakers, sponsorships, the dinners — is table stakes for credibility. Budget **$100K-$300K/year**.

**Content and thought leadership.** Vertical-specific content, benchmark reports, and the slow work of becoming a recognized voice in the vertical. Budget **$50K-$150K/year**.

**Partnerships and channel development.** The cost of recruiting, enabling, and supporting the SIs, resellers, and association relationships the vertical runs on (covered in its own section). Budget **$100K-$300K/year**.

A realistic fully-loaded GTM cost to reach the first few million in vertical ARR is **$1.5M-$3M+ per year for two to three years**. The scorecard move is to compute the implied vertical CAC and CAC-payback from this spend against the modeled SOM and ACV — and to be honest that vertical CAC in year one and two will be **2-4x your blended core CAC**, because you are paying the new-motion tax. If the vertical cannot get to a defensible CAC-payback within roughly **18-24 months** of dedicated investment, the GTM-cost factor scores low.

## The Beachhead Customer Test

The single fastest, cheapest, most predictive test of whether a vertical is real is brutally simple: **Can you name 10 logo-quality target accounts in this vertical, and have you actually talked to 5 of them?**

This test cuts through more bad vertical bets than any spreadsheet. If the team cannot, in a working session, produce a list of 10 specific, named, logo-quality accounts — real companies, not "mid-size hospitals" — then the vertical is an abstraction, not a market. And if the team has named 10 but talked to zero, the entire evaluation is built on assumptions.

The test has two parts. **The naming test** forces specificity: 10 named accounts that would be credible logos, that fit the ICP, that are plausibly reachable. If you can only name three, the targetable universe is probably much smaller than the TAM slide claims, or you do not understand the vertical's segmentation. **The conversation test** forces evidence: have at least five real discovery conversations with buyers in those accounts before spending a dollar on the build. Those conversations answer the questions the scorecard depends on — what are the actual must-have requirements, who is the buying center, what are they using today and why, what would make them switch, what would they pay. Five honest customer conversations routinely kill a vertical bet that looked great on paper, and that is the test working correctly: it is far cheaper to learn "they will never switch off the incumbent" in a 45-minute call than in an 18-month, $4M failed expansion.

Make this test a hard gate. No vertical proceeds past Gate 1 without 10 named accounts and 5 completed conversations, documented. It is the highest-ROI diligence in the entire process.

## Channel & Partnership Availability

Verticals are run by ecosystems, and the availability — or absence — of channel and partnership leverage materially changes both the GTM cost and the speed of a vertical entry. The diligence question: **what existing channels can you ride into this vertical, rather than building distribution from zero?**

**Systems integrators and consultants.** Many verticals have a layer of SIs and specialist consultants who advise buyers on technology decisions and run implementations. In healthcare, construction, and financial services especially, the SI relationships can be the difference between a 12-month and a 4-month sales cycle. If credible SIs exist and are recruitable, that is a major positive on the scorecard.

**Resellers and VARs.** Some verticals have established reseller channels that already have the buyer relationships. A reseller channel can dramatically lower CAC — at the cost of margin and of some control over the customer relationship.

**Industry associations.** Nearly every vertical has trade associations, and association relationships — endorsements, member benefits, conference access, co-marketing — provide brand permission that money cannot easily buy. The presence of an addressable, partnerable association is a real asset.

**Technology and platform partners.** The dominant platforms in a vertical (the leading EHR, the leading POS, the leading vertical ERP) often have marketplaces and partner programs. Being a certified, listed partner in the vertical's dominant platform marketplace is both a credibility signal and a distribution channel.

The scoring logic: a vertical with rich, accessible channel infrastructure can be entered faster and cheaper, and the GTM-cost and time-to-traction estimates should reflect that. A vertical with no usable channels — where you must build every customer relationship directly — is more expensive and slower, and the model should say so. Critically, do not assume channel availability; verify it in Gate 1 by actually talking to two or three potential partners, the same way you talk to potential customers.

## Existing Customer Signal

Before modeling a vertical from scratch, look at the data you already have. **Do you already have organic customers in this vertical, and how are they using the product?** Organic vertical customers — accounts that found you, bought you, and stuck around without any vertical-specific GTM effort — are the single strongest validation signal available, because they are revealed preference, not stated preference.

The diligence: pull every current customer that operates in the candidate vertical, even if they came in through the horizontal motion. For each, understand how they actually use the product, what they have configured or worked around, what integrations they have stitched together, what they have asked for and not gotten, and how their retention and expansion compare to your blended book. A handful of healthy, expanding, organically-acquired vertical customers is worth more than any analyst report — it proves the core product already delivers value in the vertical, it gives you ready-made reference customers and case studies, and it gives you a free, honest source of requirements.

The signal also cuts the other way. If you have *no* organic customers in a vertical despite years of horizontal selling, ask why. Sometimes it is simply that you never marketed there. But often it means the product, as it stands, does not solve the vertical's problem — and that should temper the product-fit score. And if you have organic customers but they are churning, struggling, or stuck at a low usage tier, that is a loud warning that the vertical's needs diverge from what you do well.

Treat existing customer signal as a multiplier on the rest of the scorecard: strong organic signal raises confidence in the product-fit and retention scores; absent or negative signal should lower them.

## The Pilot / Wedge Strategy

The right way to enter a vertical is almost never "build the full vertical product and launch." It is to **land with a narrow wedge** — a specific, painful, well-bounded use case that your product can serve credibly today or with minimal build — prove it with paying customers, and expand from that beachhead into the full vertical footprint.

The wedge has three properties. It is **narrow** enough that you can be unambiguously the best at it without an 18-month build. It is **painful** enough that the vertical buyer will pay for it and adopt it without a heroic change-management effort. And it is **expandable** — winning the wedge use case earns you the relationship, the data, and the credibility to sell the next use case, and the next, until you are the platform.

The strategic logic is risk staging. A wedge pilot lets you validate the vertical with **3-5 paying design partners** for a few hundred thousand dollars and two or three quarters, instead of betting $3M-$5M and 18 months on a full vertical product up front. The pilot answers the questions that no amount of analysis can: will real buyers in this vertical actually pay, actually adopt, actually expand, actually refer? It also produces the assets — reference logos, case studies, refined requirements, a tuned sales pitch — that make the Gate 3 dedicated-team investment dramatically de-risked.

The discipline is to resist the pressure to skip the wedge. Founders and boards, once excited about a vertical, want to "go big" — hire the team, build the product, launch loud. But going big before the wedge is proven is precisely how companies turn a recoverable $500K research-and-pilot cost into an unrecoverable $5M dedicated-team write-off. Land narrow, prove it, then expand.

## Pricing Power in the Vertical

A vertical is more attractive when you can charge more there than you can in your core market — and pricing power is a real, scorable factor, not an afterthought. The questions: **can you command a premium in this vertical, and is there a per-unit pricing metric that fits how the vertical thinks about value?**

**Premium potential.** Some verticals support premium pricing because the pain is acute, the budget is real, the cost of failure is high, and the alternatives are weak — regulated industries and verticals where your product touches revenue-critical workflows often fall here. Other verticals are structurally price-compressed: fragmented, low-margin industries with thin software budgets and a culture of free or near-free tools. The same product can support a 2x ACV in one vertical and a 0.5x ACV in another, and that difference flows straight through the SOM model.

**The per-unit metric.** Vertical buyers want to be priced on a metric they already use to think about their business — per-bed and per-provider in healthcare, per-location and per-seat in restaurants and retail, per-project or per-job in construction, per-account or per-transaction in financial services. A pricing metric that matches the vertical's mental model both raises willingness to pay and makes the value story self-evident. A pricing metric that fights the vertical's mental model creates friction in every deal. The availability of a clean, vertical-native per-unit metric — one that scales with the customer's value and is easy to count — is a genuine positive on the scorecard.

**Pricing power and the moat.** Pricing power and switching costs reinforce each other: a vertical where you can both charge a premium and build structural lock-in is the high-value quadrant, and one where you can do neither is a low-value slog. Score this factor on the realistic, evidenced answer — what comparable vertical software actually charges, what your design-partner conversations reveal about budget — not on the optimistic one.

## Sales Cycle & CAC Expectations

Every vertical has its own sales-cycle physiology, and getting the expectations wrong wrecks both the financial model and the organization's morale. The diligence: **what is the realistic sales-cycle length in this vertical, and what CAC and CAC-payback does that imply?**

**Sales-cycle length.** Vertical sales cycles are driven by the buying center's complexity and the vertical's procurement culture. Selling to independent restaurants is fast; selling to hospital systems, banks, or government agencies is slow — 9-18 months is common, with security reviews, compliance reviews, procurement, and committee dynamics all adding weeks. The cycle in a new vertical is also longer than your steady-state because you have no reference customers and no brand permission in early deals. Budget the first cohort of vertical deals to take **1.5-2x your eventual steady-state cycle**.

**CAC.** Vertical CAC in years one and two runs **2-4x blended core CAC** because you are paying for specialist reps, longer ramps, longer cycles, lower close rates without references, and vertical marketing that has not yet compounded. CAC should decline as references accumulate, the brand earns permission, and the sales motion gets tuned — but the model must fund the expensive early period honestly rather than assuming steady-state CAC from day one.

**CAC-payback.** Combine the longer cycle, the higher early CAC, and the vertical ACV into a CAC-payback projection. A vertical that reaches a defensible **18-24 month CAC-payback** within the first two years of dedicated investment is healthy. A vertical that, even after the early-period tax, cannot get under roughly 24-30 months of payback at scale has an economics problem that volume will not fix — and that should pull the GTM-cost factor's score down hard.

The honest framing for the board: vertical economics look bad before they look good, and the plan must explicitly fund the "look bad" period. Pretending the new vertical will have core-business CAC from quarter one is the most common way vertical financial models lie.

## Retention Expectations

Acquisition gets the attention, but **retention is where vertical bets are actually won or lost** — a vertical with strong structural retention compounds, and a vertical with weak retention turns into a leaky bucket no amount of GTM spend can fill. The diligence: **how sticky is this vertical, and what specifically makes it sticky?**

The sources of vertical retention strength:

**Regulatory lock-in.** In regulated verticals, once you are the system of record for a compliance-critical workflow, switching means re-validating, re-auditing, and re-training under regulatory scrutiny — a cost most buyers will not bear without a severe reason. Regulatory entanglement is painful to build toward, but once built it is among the most durable retention moats available.

**Workflow embedding.** When the product becomes the daily operational tool that the vertical's staff live in — the screen they have open all day — switching cost becomes organizational and human, not just technical.

**Data gravity.** Years of accumulated vertical-specific data in your system — patient histories, project records, transaction ledgers — make migration progressively more painful over time. Data gravity is a retention moat that strengthens automatically the longer a customer stays.

**Integration centrality.** If you become the hub that the vertical's other tools connect to, every integration is another anchor.

The scoring logic: a vertical with multiple structural retention sources should score high on this factor and high on expansion potential, because the same lock-in that retains customers also gives you the relationship to expand into. A vertical where the product is a peripheral, easily-swapped point solution — no regulatory entanglement, no workflow embedding, shallow data, no integration centrality — should score low here, and that low score should make you skeptical of the whole bet, because a vertical you cannot retain is a vertical you are renting, not owning. Validate the retention thesis with the existing-customer signal: how do your organic vertical customers actually retain and expand compared to your book?

## The "Build vs. Buy vs. Partner" Decision

Once a vertical clears the scorecard, there is a second decision: how do you acquire the vertical capability — **build** it organically, **buy** a company that already has it, or **partner** with a vertical player? Each path has a distinct risk, cost, and speed profile.

**Build.** Develop the vertical product, hire the vertical GTM team, and grow into the vertical organically. Build is the default when the engineering tax is bounded (the 6-12 eng-quarter range), when you have strong organic customer signal, and when the vertical's pace allows a multi-quarter ramp. Build keeps full control and full margin; it is slow, and it ties up the engineering and GTM resources whose opportunity cost the scorecard already accounted for.

**Buy.** Acquire a company that already has the vertical product, the vertical customers, the vertical team, and the vertical credibility. Buy is the right call when speed matters — when an incumbent's lead is widening, when a window is closing — and when the engineering tax to build organically is so large (the under-60%-product-fit case) that building is really building a new product. Buy is fast and de-risks the product and GTM questions at once; it is expensive, it carries integration risk, and a botched integration can destroy the very thing you paid for.

**Partner.** Form a commercial or technology partnership with an established vertical player — co-sell, integrate, or white-label — to reach the vertical without owning the full capability. Partner is the right call when the vertical is strategically interesting but not core enough to justify a build or a buy, when you want to test the vertical's pull before committing, or when a partner's channel is the fastest path in. Partner is the cheapest and fastest to start and the easiest to unwind; it gives up margin and control, and partnerships are structurally less durable than owned capability.

The decision framework: bounded engineering tax plus strong organic signal plus a tolerable timeline favors **build**; a closing window plus a large engineering tax plus available, fairly-priced targets favors **buy**; strategic-but-not-core plus a desire to test pull favors **partner**. Many of the best vertical entries are sequenced — partner to test the vertical's pull, then build or buy once the thesis is proven.

## Internal Capability Audit

A vertical bet is only as good as the team's ability to execute it, and the most disciplined scorecard in the world cannot compensate for an organization with no genuine vertical expertise. Before committing, run an honest **internal capability audit**: does the team actually have the domain knowledge to win this vertical, or are you planning to learn the vertical and sell it at the same time?

The audit covers several capability dimensions. **Product and engineering** — does anyone on the team genuinely understand the vertical's workflows, data model, and edge cases well enough to build the right thing, or will the roadmap be a series of expensive guesses? **Sales** — do you have, or can you hire, reps with real credibility and a network in the vertical, or will generalist reps be cold-calling into a buying center whose language they do not speak? **Marketing** — can your team produce content and positioning that a vertical insider finds credible, or will it read as obvious tourism? **Leadership and advisory** — is there an executive sponsor who will own the vertical, and do you have access to advisors, board members, or operating partners with deep vertical experience?

The honest output is usually a mix: some capability exists, some must be hired, some must be bought in via advisors. That is fine — the point of the audit is not to require that the team already be expert, but to **make the capability gap explicit and budget for closing it**. A vertical that requires hiring a whole new layer of domain expertise across product, sales, and marketing is not disqualified, but its cost and timeline are higher than the naive plan, and the scorecard should reflect that. The unforgivable mistake is the unaudited assumption that "we're smart, we'll figure out the vertical as we go" — verticals punish tourists, and the buyers can tell.

## Five Real Case Studies: Verticals Done Right

The pattern behind successful vertical companies is remarkably consistent: land a narrow wedge, build the vertical-specific product and data model, embed into the workflow until switching is unthinkable, then expand into adjacent use cases until you are the vertical's operating system.

**Toast — restaurants, from POS outward.** Toast started with a wedge: a restaurant-specific point-of-sale system, built on hardware and software designed for the realities of a restaurant rather than generic retail. From that beachhead it expanded into payroll, payments, online ordering, loyalty, and capital — becoming the operating platform for the restaurant. The lesson: a narrow, vertical-native wedge with a clear path to expand into the rest of the vertical's workflow is the canonical pattern.

**Veeva — life sciences, on a platform foundation.** Veeva built vertical CRM and content management for the pharmaceutical and life-sciences industry, initially leveraging a platform foundation and then building deep, industry-specific applications around the regulated workflows of pharma sales and clinical operations. The lesson: deep regulatory and workflow specialization in a high-value, high-compliance vertical creates enormous pricing power and retention — the regulatory complexity that scares others away is the moat.

**Procore — construction.** Procore built construction project management — RFIs, submittals, change orders, the document-heavy coordination work of a construction project — for a vertical that horizontal project-management tools never served well. It became the system of record for the jobsite and expanded across the project lifecycle and the stakeholder network. The lesson: a vertical with genuine workflow complexity that horizontal tools ignore is a defensible opening.

**ServiceTitan — home services.** ServiceTitan built an operating system for home-services contractors — HVAC, plumbing, electrical — covering dispatch, scheduling, invoicing, and marketing for a vertical that ran on paper and generic tools. It embedded into the daily operations of the contractor and expanded across the contractor's business. The lesson: a large, fragmented, under-served vertical running on inadequate tools is a real opportunity for a vertical-native platform.

**Samsara — fleet and physical operations.** Samsara built a connected-operations platform for fleets and physical operations — telematics, safety, equipment monitoring — combining hardware and software for industries that horizontal software never reached. The lesson: verticals defined by physical operations and hardware needs can be deeply defensible because the hardware-plus-software combination is hard to displace.

The through-line across all five: each won by being unambiguously vertical-native — the data model, the workflows, the integrations, the go-to-market all built specifically for the vertical — rather than by bolting a vertical SKU onto a horizontal product.

## Five Vertical-Entry Failures: Verticals Done Wrong

For every Toast there are many quieter failures — companies that entered a vertical, spent real money, and retreated. The failures rhyme, and the patterns are as instructive as the successes. These composite patterns reflect the recurring ways vertical bets die:

**The TAM-mirage retreat.** A company is seduced by a huge top-down TAM, funds a dedicated vertical team, and discovers the targetable, in-window, can-actually-pay SOM is a fraction of the headline. The vertical never reaches the revenue the dedicated team's cost requires, and the team is quietly disbanded. Lesson: bottoms-up SOM, or you are building on a fantasy.

**The engineering-tax overrun.** A company estimates a two-quarter build to enter a vertical, ships late and incomplete, keeps funding the build because it has sunk so much in, and reaches a credible product 18 months and triple-budget later — by which point the window has narrowed and the core roadmap has visibly suffered. Lesson: enumerate the engineering tax in eng-quarters honestly, and treat its opportunity cost as real.

**The regulatory-quicksand stall.** A company commits to a regulated vertical without truly scoping the certification cost and timeline, then spends a year and a fortune in compliance before it can sell a single deal, burning runway and morale. Lesson: regulatory timeline is a binding constraint that money cannot compress.

**The incumbent-moat bounce.** A company enters a vertical with a better product but no answer to the incumbent's switching costs — the data gravity, the workflow embedding, the contractual lock-in. Deals stall in "this is great but migration is too risky," win rates stay low, and the company retreats. Lesson: a better product is not a displacement strategy; you need a structural reason customers will switch despite the switching cost.

**The focus-dilution collapse.** A company chases a new vertical and, in doing so, pulls its best engineers, its strongest reps, and its executive attention off the core business. The vertical underperforms and the core — starved of attention — also stalls. The company ends up worse off in both, and the vertical bet is remembered as the thing that broke the core's momentum. Lesson: focus dilution is the most expensive and least visible cost of a vertical bet, and it must be explicitly weighed.

The meta-lesson: vertical failures are rarely caused by one catastrophic error. They are caused by optimistic assumptions on several factors at once — a generous TAM, a light engineering estimate, an underweighted incumbent moat, an unscoped regulatory timeline — that compound. The scorecard's discipline of forcing an honest, evidenced score on each factor is precisely the antidote.

## The Go/No-Go Scorecard

Pull the six factors together into a single weighted Go/No-Go scorecard. Each factor is scored 1-10 on the evidence gathered, multiplied by its weight, and summed:

- **Vertical Market Size — 20%.** Bottoms-up five-year SOM. 8-10: $30M+ SOM with a credible penetration curve. 5-7: $15M-$30M. 1-4: under $15M or top-down-only.
- **Product Fit — 25%.** Percentage of must-haves met with configuration. 8-10: 80%+, pilot within a quarter. 5-7: 60-80%, a bounded 2-4 quarter build. 1-4: under 60%, effectively a new product.
- **Competitive Density — 15%.** Incumbent strength and a credible displacement path. 8-10: weak or stagnant incumbents and a clear displacement wedge. 5-7: real incumbents but an articulable path. 1-4: entrenched incumbents with deep switching costs and no path — or zero incumbents, which is its own warning.
- **Regulatory Complexity — 10%.** Cost and timeline to legally and credibly sell. 8-10: SOC 2 baseline only. 5-7: one significant regime, under ~$500K and 12 months. 1-4: heavy regime(s), over ~$1M and 18 months.
- **GTM Cost — 20%.** Fully-loaded cost to first $1M-$3M ARR and implied CAC-payback. 8-10: rideable channels, payback under ~18 months at scale. 5-7: standard direct build, payback 18-24 months. 1-4: no channels, payback over ~30 months.
- **Expansion & Retention — 10%.** Structural stickiness and expansion potential. 8-10: multiple lock-in sources and a clear expansion path. 5-7: one real source. 1-4: peripheral, easily-swapped point solution.

**Thresholds.** Composite **above 7.0**: Go — fund Gate 1. Composite **5.5-7.0**: conditional — a cheap research gate is justified, but no commitment, and the yellow factors must be the explicit focus of the research. Composite **below 5.5**: No — and say it out loud, because the cost of a disciplined no is a slide deck, while the cost of an undisciplined yes is millions and years.

One override rule: any single factor scoring **1-2** triggers a mandatory review regardless of composite, because a fatal flaw on one dimension — an impossible regulatory timeline, a sub-50% product fit, an unbeatable incumbent — can sink a bet that the weighted average flatters. The scorecard is a forcing function for honest conversation, not a substitute for judgment.

## Staged Investment Gates

The discipline that makes vertical evaluation safe is **staged investment with real gates** — committing capital in tranches, each unlocked only by evidence from the prior stage, so the downside is always capped and the team can never quietly skip from idea to dedicated team.

**Gate 1 — Research and customer discovery.** Scope: build the bottoms-up SOM, run the six-factor scorecard, complete the beachhead test (10 named accounts, 5+ real customer interviews), scope the engineering tax and regulatory cost, and talk to two or three potential channel partners. Cost: **~$50K-$150K**, mostly internal time plus some research. Timeline: **6-10 weeks.** Exit criteria to unlock Gate 2: composite scorecard above threshold, beachhead test passed, a credible wedge identified. Most vertical ideas should die here — and that is the gate working.

**Gate 2 — Wedge pilot with design partners.** Scope: build the minimum wedge product, sign **3-5 paying design partners**, and run the pilot long enough to see real adoption, expansion signal, and referenceability. Cost: **~$300K-$800K** — a small dedicated build team plus a vertical-credible seller. Timeline: **2-3 quarters.** Exit criteria to unlock Gate 3: design partners actually pay, actually adopt, actually expand or commit to expanding, and will act as references; refined economics still clear the bar. A pilot that produces lukewarm adoption is a no, not a "push harder."

**Gate 3 — Dedicated vertical team.** Scope: a standing pod with dedicated vertical product, engineering, sales, and marketing, funded to drive the vertical to a real second-act revenue line. Cost: **~$2M-$5M/year.** Timeline: multi-year. This gate is only unlocked by Gate 2 evidence — never by enthusiasm.

The cardinal rule: **never skip to Gate 3.** Funding a dedicated team before a pilot has proven the wedge is the single most expensive vertical-expansion mistake — it is how companies burn $3M-$8M and 18 months to learn what Gate 1's customer interviews would have told them for $100K. The gates are not bureaucracy; they are the mechanism that converts an unbounded strategic gamble into a series of bounded, evidence-gated bets.

## Opportunity Cost Framing

Every dollar and every engineer-quarter and every executive hour spent on a new vertical is not spent somewhere else, and the most important question in a vertical evaluation is often not "is this vertical good?" but **"is this vertical better than what we would otherwise do with the same resources?"**

The opportunity cost has three components. **Engineering opportunity cost** — the 6-12 eng-quarters of the engineering tax are 6-12 eng-quarters not spent on core retention features, core expansion features, platform reliability, or a different bet. **GTM opportunity cost** — the $1.5M-$3M/year of vertical GTM spend, and the sales and marketing leadership attention it consumes, are not deployed against the core pipeline or a different market. **Executive and organizational opportunity cost** — the hardest to quantify and often the largest: a new vertical consumes the leadership team's attention, the company's narrative, and the organization's focus, and a company can only metabolize so many priorities before everything slows.

The framing discipline is to make opportunity cost an explicit line in the evaluation, not an afterthought. State plainly what does *not* get done if the vertical is funded: "Funding this vertical means the core platform-reliability initiative slips two quarters and we do not pursue the enterprise-tier expansion this year." That sentence, written down and debated, is worth more than another TAM slide. Often a vertical that scores a respectable 6.5 on the absolute scorecard is still the wrong move because the core roadmap's expected return on the same resources is higher — and the only way to see that is to put them side by side. The best vertical decisions are made by comparison, not in isolation.

## Investor Communication

How you frame a vertical bet to your board and investors shapes both whether you get support and how you will be held accountable — and the framing should be honest, gated, and specific, not a sweeping strategic vision.

**Frame it as TAM expansion with a capped, gated downside — not an open-ended adventure.** The compelling investor narrative is: "We have identified a vertical that expands our addressable market by [X], we have evidence it is real [the organic customers, the customer interviews, the scorecard], and we are pursuing it through staged gates so our committed downside at any moment is capped at the current tranche." That is fundable because it is disciplined. "We're going big into healthcare because it's huge" is not, because it offers the board no way to distinguish a good bet from a gamble.

**Pre-commit the gates and the exit criteria.** Tell the board what Gate 1, Gate 2, and Gate 3 cost, what evidence unlocks each, and — critically — what evidence would make you stop. A board that has agreed in advance to the kill criteria is a board that will support a disciplined "no" later, instead of pressuring you to keep funding a failing bet to avoid admitting a mistake.

**Address the focus-dilution concern head-on.** Sophisticated investors' first worry about a vertical bet is that it distracts from the core. Get ahead of it: show the opportunity-cost analysis, show what the core gives up, and explain why the bet is still worth it — or be honest that it is gated precisely so you can pull back if the core suffers. Pretending there is no tension between the vertical and the core makes you look naive.

**Report against the gates, not against vanity metrics.** Once funded, report the vertical's progress against its gate criteria — design-partner adoption, refined CAC-payback, scorecard updates — not against a pipeline number that looks good in a board deck. The gate framing keeps everyone honest, including you.

The meta-point: the way you talk about the vertical bet is itself a signal of how you will manage it. A gated, evidenced, opportunity-cost-aware pitch tells the board you will allocate capital like an investor. A grand-vision pitch tells them you might allocate it like a gambler.

## The Vertical AI Angle

The 2026-and-beyond version of this question has a new dimension: **is there an AI-native entry point into the vertical** — an industry-specific AI agent or AI-driven workflow that can serve as the wedge — and does AI change the engineering-tax and competitive-density math?

AI shifts the vertical-entry calculus in several ways. **AI can be the wedge itself.** Instead of entering a vertical by replicating an incumbent's feature set, you may be able to enter with an AI agent that automates a specific, painful, high-volume vertical workflow — claims review in healthcare, document review in legal, inspection workflows in construction — that the incumbent's older architecture cannot easily match. An AI-native wedge can be narrower, faster to stand up, and more differentiated than a traditional feature wedge.

**AI changes the engineering-tax math — in both directions.** On one hand, AI-assisted development and AI-driven configuration can lower the cost of building vertical-specific logic and integrations. On the other, doing AI well in a regulated vertical adds its own tax: data governance, model validation, auditability, hallucination control, and the compliance scrutiny that regulated buyers apply to AI specifically. Do not assume AI only makes the build cheaper; scope both effects.

**AI changes competitive density.** Incumbents with deep workflow embedding but legacy architectures may be slow to ship credible AI, opening a displacement window — but well-funded AI-native entrants may be crowding into the same vertical for the same reason, so the competitive map is moving fast. The incumbent analysis must now ask not just "who is here" but "who is shipping credible vertical AI, and who cannot."

**The AI angle does not change the gates.** It is tempting to treat an AI vertical wedge as so obviously compelling that it skips straight to a dedicated team. It should not. The same staged gates apply: an AI-native vertical bet still needs the bottoms-up SOM, the beachhead test, the wedge pilot with paying design partners. AI changes what the wedge looks like and what the engineering tax is; it does not repeal the discipline of evidence-gated investment.

Score the AI angle inside the existing factors — it can lift the product-fit score (a faster, more differentiated wedge), shift the competitive-density score (a displacement window or a crowded race), and move the engineering-tax estimate either way. It is a lens on the scorecard, not a reason to bypass it.

## 5-Year Outlook

The strategic context for vertical bets is shifting, and a vertical evaluation made today should account for where the landscape is heading over the next five years.

**Vertical SaaS consolidation continues.** The successful vertical platforms — the Toasts, Procores, ServiceTitans — keep expanding across their verticals' workflows and acquiring adjacent point solutions, raising the bar for what "entering" their vertical requires. A vertical that had room for a point-solution entrant five years ago may now require a platform-grade commitment because the incumbent has consolidated the workflow. The competitive-density analysis must account for this trajectory, not just the current snapshot.

**Hyperscaler industry clouds reshape the baseline.** The major cloud providers have built industry-specific cloud offerings — for healthcare, financial services, manufacturing, retail, and more — that provide compliance scaffolding, industry data models, and partner ecosystems. This cuts both ways for a vertical entrant: it can lower the engineering and compliance tax (you build on industry-cloud primitives rather than from scratch), and it can raise buyer expectations about what an industry-native product looks like. Factor the relevant industry cloud into both the engineering-tax and the competitive-baseline analysis.

**AI verticalization accelerates.** The next five years will see AI-native vertical applications proliferate — industry-specific agents and AI-driven workflows entering verticals that were previously hard to crack. This both opens new AI-native wedges and means the verticals you evaluate will have more AI-native competition over the evaluation horizon. A five-year SOM model built on a pre-AI competitive assumption will be wrong.

**The implication for today's decision.** A vertical evaluation is a five-year bet, and the five-year landscape will be more consolidated, more industry-cloud-scaffolded, and more AI-verticalized than today's. The practical adjustments: weight the durability of your wedge and your retention moat more heavily, because the competitive environment will get harder, not easier; build the SOM curve against a forward competitive picture, not a current one; and prefer verticals where you can credibly become a platform over verticals where you will always be a point solution, because the point-solution position is the one consolidation erodes.

## Final Decision Framework

Pulling it all together, the explicit checklist and scoring rubric for deciding whether a new vertical is worth the GTM investment:

**Step 1 — Run the scorecard.** Score all six factors 1-10 on gathered evidence — Market Size (20%), Product Fit (25%), Competitive Density (15%), Regulatory Complexity (10%), GTM Cost (20%), Expansion & Retention (10%) — and compute the weighted composite. Above 7.0 is Go; 5.5-7.0 is conditional; below 5.5 is No. Any single factor at 1-2 triggers mandatory review.

**Step 2 — Pass the beachhead test.** Name 10 logo-quality target accounts and complete at least 5 real customer interviews. No interviews, no proceeding. This is a hard gate, not a formality.

**Step 3 — Scope the engineering tax honestly.** Enumerate net-new engineering in eng-quarters across data model, integrations, compliance, and workflow logic. If it exceeds 6-12 eng-quarters for a credible v1, treat the bet as a new-product decision with a higher bar.

**Step 4 — Scope the regulatory cost and timeline.** Total the certification dollars and — more importantly — the calendar months before you can legally and credibly sell. Treat the timeline as a binding constraint.

**Step 5 — Model the GTM cost and vertical economics.** Fully-loaded cost to first $1M-$3M ARR, implied vertical CAC at 2-4x core early on, and CAC-payback trending to 18-24 months at scale. If the economics never work, the vertical never works.

**Step 6 — Frame the opportunity cost explicitly.** Write down what the core roadmap and core GTM give up. Decide by comparison: is this vertical better than the best alternative use of the same resources?

**Step 7 — Choose build vs. buy vs. partner.** Bounded tax plus organic signal favors build; closing window plus large tax favors buy; strategic-but-not-core favors partner. Sequencing — partner then build/buy — is often best.

**Step 8 — Commit through staged gates.** Gate 1 research (~$50K-$150K, 6-10 weeks), Gate 2 wedge pilot with 3-5 paying design partners (~$300K-$800K, 2-3 quarters), Gate 3 dedicated team (~$2M-$5M/year). Never skip to Gate 3. Each gate is unlocked only by the prior gate's evidence.

**Step 9 — Communicate it as a capped, gated TAM-expansion bet.** Pre-commit the gates and the kill criteria to the board. Address focus dilution head-on. Report against gates, not vanity metrics.

**The honest base rate.** Most verticals that get evaluated should not get funded past Gate 1, and most that get a Gate 1 should not get a Gate 3. The framework's value is not in helping you say yes — it is in helping you say no cheaply, early, and with evidence, so that the rare vertical that clears every gate gets the focus and capital it needs to actually become a second act. A disciplined no costs a deck. An undisciplined yes costs millions, years, and sometimes the momentum of the core business. Evaluate accordingly.

`;

const flow = `

## The Staged Investment Gate Flow

\`\`\`mermaid
flowchart TD
  A[New Vertical Idea] --> B[Gate 1: Research and Discovery]
  B --> B1[Bottoms-Up SOM Model]
  B --> B2[Six-Factor Scorecard]
  B --> B3[Beachhead Test: 10 Named Accounts 5 Interviews]
  B --> B4[Scope Engineering Tax and Regulatory Cost]
  B1 --> C{Composite Above 7.0 and Beachhead Passed}
  B2 --> C
  B3 --> C
  B4 --> C
  C -->|No| X1[STOP: Cost Capped at 50K-150K]
  C -->|Yes| D[Gate 2: Wedge Pilot]
  D --> D1[Build Minimum Wedge Product]
  D --> D2[Sign 3-5 Paying Design Partners]
  D --> D3[Run Pilot 2-3 Quarters]
  D1 --> E{Design Partners Pay Adopt Expand and Refer}
  D2 --> E
  D3 --> E
  E -->|No| X2[STOP: Cost Capped at 300K-800K]
  E -->|Yes| F[Gate 3: Dedicated Vertical Team]
  F --> F1[Dedicated Product and Engineering Pod]
  F --> F2[Vertical Sales and Marketing]
  F --> F3[2M-5M Per Year Multi-Year Commitment]
  F1 --> G[Scale to Second-Act Revenue Line]
  F2 --> G
  F3 --> G
  G --> H[Vertical Platform: Expand Across Workflow]
  X1 --> Y[Redeploy Resources to Core or Next Vertical Idea]
  X2 --> Y
\`\`\`

## The Six-Factor Weighted Scorecard

\`\`\`mermaid
flowchart LR
  A[Vertical Opportunity] --> F1[Market Size Weight 20]
  A --> F2[Product Fit Weight 25]
  A --> F3[Competitive Density Weight 15]
  A --> F4[Regulatory Complexity Weight 10]
  A --> F5[GTM Cost Weight 20]
  A --> F6[Expansion and Retention Weight 10]
  F1 --> S1[Bottoms-Up Five-Year SOM]
  F2 --> S2[Percent of Must-Haves Met with Config]
  F3 --> S3[Incumbent Moats and Displacement Path]
  F4 --> S4[Certification Cost and Timeline]
  F5 --> S5[Cost to First 1M-3M ARR and CAC Payback]
  F6 --> S6[Structural Lock-In and Expansion Path]
  S1 --> W[Weighted Composite Score 1-10]
  S2 --> W
  S3 --> W
  S4 --> W
  S5 --> W
  S6 --> W
  W --> D{Composite Threshold}
  D -->|Above 7.0| GO[GO: Fund Gate 1]
  D -->|5.5 to 7.0| MAYBE[CONDITIONAL: Cheap Research Gate Only]
  D -->|Below 5.5| NO[NO: Say It Out Loud]
  W --> OV{Any Single Factor at 1-2}
  OV -->|Yes| REVIEW[Mandatory Fatal-Flaw Review]
  GO --> Z[Beachhead Test Is Still a Hard Gate]
  MAYBE --> Z
\`\`\`

`;

const src = `

## Sources

1. **"Crossing the Chasm" — Geoffrey Moore** — Foundational text on beachhead market selection and the discipline of landing a narrow segment before expanding. The wedge strategy in vertical entry is a direct application.
2. **"Play Bigger" — Al Ramadan, Dave Peterson, Christopher Lochhead, Kevin Maney** — Category design and the strategic framing of market expansion bets.
3. **Bessemer Venture Partners — State of the Cloud and Vertical SaaS research** — Bessemer's ongoing analysis of vertical SaaS as a category, including the platform-expansion pattern (POS to payments to payroll) that defines successful vertical companies.
4. **a16z — Vertical SaaS and "The New Business of AI" essays** — Andreessen Horowitz analysis of vertical software economics, AI-native vertical entry points, and why vertical specialization creates defensibility.
5. **OpenView Partners — SaaS Benchmarks and Expansion Strategy research** — Benchmark data on CAC, CAC-payback, sales-cycle length, and net revenue retention used to calibrate vertical economics expectations.
6. **Toast — S-1 filing (SEC EDGAR)** — Primary-source documentation of the restaurant-vertical wedge strategy: POS as the beachhead, expansion into payroll, payments, capital, and online ordering.
7. **Veeva Systems — S-1 and 10-K filings (SEC EDGAR)** — Documentation of the life-sciences vertical strategy built on a platform foundation, and the role of regulatory specialization in pricing power and retention.
8. **Procore Technologies — S-1 filing (SEC EDGAR)** — The construction-vertical case study: workflow-complexity wedge (RFIs, submittals, change orders) that horizontal tools never served.
9. **ServiceTitan — S-1 filing (SEC EDGAR)** — The home-services vertical case study: operating-system positioning for a large, fragmented, under-served vertical.
10. **Samsara — S-1 filing (SEC EDGAR)** — The connected-operations / fleet vertical case study: hardware-plus-software defensibility in physical-operations verticals.
11. **AICPA — SOC 2 framework and Trust Services Criteria** — Authoritative source on SOC 2 Type II scope, observation periods, and cost drivers for the baseline B2B security certification.
12. **HHS — HIPAA Security Rule and HITECH Act guidance** — Primary source on healthcare compliance obligations gating the healthcare vertical.
13. **FINRA Rules 4511 and 3110; SEC Rule 17a-4** — Primary sources on books-and-records, communications-retention, and supervision requirements gating the financial-services vertical.
14. **US Department of Education — FERPA regulations (34 CFR Part 99)** — Primary source on student-data privacy obligations gating the education vertical.
15. **FedRAMP.gov — Authorization process documentation** — Primary source on the cost and multi-year timeline of public-sector cloud authorization.
16. **PCI Security Standards Council — PCI-DSS v4.0** — Primary source on payment-card data handling requirements.
17. **Gartner — Magic Quadrant and Market Guide methodology** — Industry framework for mapping competitive density and incumbent positioning within a vertical.
18. **First Round Review — essays on go-to-market motion and vertical expansion** — Operator-sourced writing on the organizational cost of standing up a new GTM motion.
19. **SaaStr — content on net revenue retention, expansion revenue, and the cost of new GTM motions** — Practitioner benchmarks on retention and expansion economics.
20. **McKinsey & BCG — industry cloud and vertical software market analyses** — Consulting research on hyperscaler industry clouds and vertical SaaS consolidation trends.
21. **AWS, Microsoft, and Google Cloud — industry cloud product documentation** — Primary sources on healthcare, financial-services, retail, and manufacturing industry clouds and their compliance scaffolding.
22. **"The Lean Startup" — Eric Ries** — The validated-learning and staged-investment logic underlying the gate framework.
23. **Harvard Business Review — "Blue Ocean" and market-entry strategy literature** — Academic framing of competitive density and displacement strategy.
24. **CB Insights — startup failure post-mortem analyses** — Aggregated data on why companies fail, including market-sizing errors and focus dilution.
25. **Battery Ventures and ICONIQ — vertical software and growth-stage GTM research** — Growth-equity perspective on vertical SaaS unit economics and scaling.
26. **Epic App Orchard / EHR partner program documentation** — Primary source on the certified-integration approval timelines that add to the healthcare engineering tax.
27. **"Obviously Awesome" — April Dunford** — Positioning methodology relevant to building vertical-specific brand permission.
28. **Public investor letters and shareholder communications from vertical SaaS leaders** — Primary-source framing of how vertical-expansion bets are communicated to investors.
29. **NRF, AHA, AGC, and other industry-association materials** — Examples of the trade-association channel infrastructure that vertical entrants can leverage.
30. **Tomasz Tunguz — blog analyses on SaaS CAC, payback periods, and expansion** — Quantitative benchmarks for calibrating vertical economics.

`;

const num = `

## Numbers

**The Six-Factor Scorecard Weights**
- Product Fit: 25% (heaviest — engineering tax kills the most bets)
- Vertical Market Size: 20%
- GTM Cost: 20%
- Competitive Density: 15%
- Regulatory Complexity: 10%
- Expansion & Retention: 10%
- Composite Go threshold: above 7.0
- Composite conditional band: 5.5-7.0
- Composite No threshold: below 5.5
- Single-factor fatal-flaw trigger: any factor scoring 1-2

**TAM/SAM/SOM Sizing**
- Realistic 5-year vertical penetration curve: ~0.5% Y1, ~2% Y2, ~5% Y3, ~9% Y4, ~14% Y5 of targetable accounts
- Minimum 5-year vertical SOM to justify pulling core focus: $15M-$30M ARR
- "Real second act" SOM threshold: $30M+ ARR
- Targetable in-window accounts as share of total universe: often only 1-5%

**Product Fit Thresholds**
- Fast-follow (pilot within a quarter): 80%+ of must-haves met with configuration
- Real but bounded build: 60-80% of must-haves met, 2-4 eng-quarters to v1
- Effectively a new product (higher bar): under 60% of must-haves met
- Must-have requirements to audit: top 20-30 in the vertical

**The Engineering Tax (in eng-quarters)**
- Vertical data model: 2-6 eng-quarters
- Vertical integrations: 1-3 eng-quarters each
- Compliance & security features: 1-4 eng-quarters
- Vertical workflow logic: 2-5 eng-quarters
- Typical "real but bounded" vertical entry total: 6-12 eng-quarters
- Fully-loaded cost of 6-12 eng-quarters: $600K-$1.5M (3-5 engineers, 6-9 months)

**Regulatory Complexity — Cost and Timeline**
- SOC 2 Type II: $50K-$150K, 6-12 month observation period
- HIPAA (healthcare): $100K-$400K, 6-12 months
- FINRA/SEC (financial services): $200K-$800K, 9-18 months
- FERPA (education): $75K-$250K, 6-12 months
- FedRAMP (public sector): $1M-$2M+, 12-24 months
- PCI-DSS (payments): $50K-$250K, 6-12 months
- "Major strategic commitment" threshold: over ~$1M and 18 months combined

**GTM Cost Modeling (to first $1M-$3M vertical ARR)**
- Vertical sales hires (1-3 reps loaded): $500K-$1.2M/year
- Vertical marketing: $200K-$500K/year
- Conference & event presence: $100K-$300K/year
- Content & thought leadership: $50K-$150K/year
- Partnerships & channel development: $100K-$300K/year
- Total fully-loaded vertical GTM: $1.5M-$3M+/year for 2-3 years
- Vertical AE ramp time in a new vertical: 6-9 months

**Sales Cycle & CAC Expectations**
- Vertical CAC in years 1-2: 2-4x blended core CAC
- First-cohort sales cycle vs. steady-state: 1.5-2x longer
- Slow-vertical sales cycle (hospitals, banks, government): 9-18 months common
- Healthy CAC-payback at scale: 18-24 months
- CAC-payback economics-problem threshold: over 24-30 months at scale

**The Beachhead Test**
- Named logo-quality target accounts required: 10
- Completed real customer interviews required: 5+
- Both required to pass Gate 1 (hard gate)

**Staged Investment Gates**
- Gate 1 (research & discovery): $50K-$150K, 6-10 weeks
- Gate 2 (wedge pilot): $300K-$800K, 2-3 quarters, 3-5 paying design partners
- Gate 3 (dedicated team): $2M-$5M/year, multi-year
- Cost of skipping to Gate 3 and failing: $3M-$8M and 18 months wasted

**Build vs. Buy vs. Partner — Triggers**
- Build: bounded engineering tax (6-12 eng-quarters) + strong organic signal + tolerable timeline
- Buy: closing window + large engineering tax (under-60% product fit) + available fairly-priced targets
- Partner: strategic-but-not-core + desire to test pull before committing

**Opportunity Cost Components**
- Engineering opportunity cost: 6-12 eng-quarters off the core roadmap
- GTM opportunity cost: $1.5M-$3M/year off core pipeline
- Executive/organizational opportunity cost: largest and hardest to quantify

**Base Rates (the honest part)**
- Share of evaluated verticals that should be funded past Gate 1: minority
- Share of Gate 1 verticals that should reach Gate 3: minority of a minority
- Cost of a disciplined "no": one slide deck
- Cost of an undisciplined "yes": millions of dollars, multiple years, sometimes core-business momentum

`;

const counter = `

## Counter-Case: When a Vertical Looks Attractive But Isn't

The scorecard and the gates exist because vertical bets fail in predictable, recurring ways — and almost all of them start with a vertical that looked genuinely attractive. A serious operator should stress-test every promising vertical against these failure patterns before funding even Gate 1.

**The TAM mirage.** The most seductive trap. A vertical presents a huge top-down market — "the industry spends tens of billions on software" — and the number is real, which makes it dangerous. The headline TAM tells you nothing about the targetable, in-window, can-actually-pay SOM, which is routinely a small fraction of the total. Companies fund dedicated teams against the headline, then spend two years discovering the real market is a quarter of what the slide claimed. If the evaluation cannot produce a bottoms-up SOM — named-account-grade, ACV-grounded, penetration-curve-honest — the TAM is a mirage and the bet should not proceed.

**The underestimated engineering tax.** The second-most-common killer. Sales and product leaders, eager for the new logo, classify net-new engineering as "configuration," fake the demo, and commit to a two-quarter build that becomes an 18-month slog. The vertical's real requirements — its data model, its certified integrations, its workflow edge cases — extract a tax that compounds, and by the time the product is credible, the window has narrowed and the core roadmap has visibly suffered. Any vertical where the team is optimistic about the build, rather than rigorous in eng-quarters, should be treated as a red flag, not a green light.

**Regulatory quicksand.** A vertical's regulatory complexity is sometimes a moat you want — but only if you scope it. The failure mode is committing to a regulated vertical without truly understanding that the certification timeline is a binding constraint money cannot compress. The company spends a year and a fortune in compliance before it can sell a single deal, burning runway and morale while the financial model's payback assumptions silently break. A vertical that requires more than ~$1M and 18 months of certification before first revenue is not an experiment; treat it as quicksand unless every other factor is exceptional.

**Incumbent moats that a better product cannot cross.** A vertical can have weak-looking incumbents and still be nearly un-enterable, because the moat is not the incumbent's product — it is the switching cost. Data gravity, workflow embedding, integration centrality, and contractual lock-in mean a customer can fully agree your product is better and still never switch, because the migration risk is unacceptable. "This is great but we can't rip out the incumbent" is the sound of a vertical bet dying slowly. A better product is not a displacement strategy. Without a specific, structural reason customers will switch despite the switching cost, an attractive-looking vertical is a trap.

**Focus dilution killing the core business.** The most expensive failure mode, and the least visible while it is happening. A vertical bet pulls the best engineers, the strongest reps, and — most damagingly — the executive team's attention and the company's narrative. The vertical underperforms, which is bad; but the core business, starved of the focus that was driving its momentum, also stalls, which is worse. The company ends up behind in both, and the vertical is remembered as the bet that broke the core. This cost almost never appears on the scorecard unless it is deliberately forced there through explicit opportunity-cost framing — and a vertical that scores a respectable 6.5 in isolation can still be the wrong move if funding it means the core gives up something more valuable.

**The "zero competition" false positive.** Counterintuitively, a vertical with no credible incumbents is usually a warning, not an opportunity. It often means the vertical does not buy software the way you assume, the budget is not there, or the pain is not acute enough to drive purchasing. Some competition validates the market. A vertical that looks attractive *because* it is wide open deserves extra skepticism about whether it is a market at all.

**The organic-signal vacuum.** A vertical can look great on every analytical dimension and still be missing the one piece of evidence that matters most: organic customers. If years of horizontal selling have produced zero organic customers in the vertical, the optimistic read is "we never marketed there" — but the realistic read is often "the product, as it stands, does not solve their problem." An attractive vertical with no organic signal should have its product-fit and retention scores discounted, not taken on faith.

**The honest verdict.** The uncomfortable truth of vertical evaluation is that the right answer is "no" or "not yet" far more often than founders, boards, and ambitious GTM leaders want to hear. Most verticals that get evaluated look attractive — that is exactly why they get evaluated — and most of them still should not be funded past a cheap research gate. The discipline is not in finding reasons to say yes; it is in saying no early, cheaply, and with evidence, so that organizational energy is not consumed by a slow-motion failure. A vertical bet should clear the scorecard, pass the beachhead test, survive the opportunity-cost comparison, and proceed only through gated investment — and even then, the base rate of success is humbling. The companies that win at vertical expansion are not the ones that say yes the most; they are the ones whose rare yes is backed by the discipline of many disciplined nos. When a vertical looks attractive, assume it might be one of these traps until the evidence proves otherwise.

`;

const links = `

## Related Pulse Library Entries

- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (GTM motion restructuring under AI disruption — relevant to the vertical AI angle.)
- **q88** — How do I decide between going upmarket vs. expanding horizontally? (Adjacent strategic-allocation decision; vertical expansion is one of the options on that menu.)
- **q89** — How do I build a bottoms-up TAM model that a board will believe? (Deep dive on the SOM-sizing discipline that Factor 1 depends on.)
- **q91** — How do I structure a staged-gate process for new strategic bets? (Generalizes the Gate 1/2/3 framework beyond verticals.)
- **q92** — How do I model CAC and CAC-payback for a new go-to-market motion? (The economics modeling behind Factor 5.)
- **q93** — When should we build vs. buy vs. partner for a new capability? (Expands the build/buy/partner decision section.)
- **q94** — How do I scope and budget the "engineering tax" of a new market? (Deep dive on the eng-quarter accounting in Factor 2.)
- **q95** — How do I run a design-partner pilot that actually de-risks a bet? (Operational detail on Gate 2.)
- **q96** — How do I communicate a strategic bet to my board without overpromising? (Expands the investor-communication section.)
- **q97** — How do I think about opportunity cost when allocating the engineering roadmap? (The roadmap-tradeoff lens behind the opportunity-cost section.)
- **q98** — What does a healthy vertical SaaS retention profile look like? (Benchmarks for Factor 6.)
- **q120** — How do I evaluate entering a regulated industry (HIPAA, FINRA, FedRAMP)? (Deep dive on Factor 4's regulatory regimes.)
- **q121** — How do I displace an entrenched incumbent with deep switching costs? (Expands the displacement-path analysis in Factor 3.)
- **q122** — How do I price into a new vertical with a vertical-native metric? (Deep dive on the pricing-power section.)
- **q140** — How do I build vertical-specific brand permission and positioning? (Expands the vertical-marketing portion of GTM cost.)
- **q141** — How do I recruit and enable a channel/SI partner ecosystem? (Deep dive on the channel-and-partnership section.)
- **q160** — What is the AI-native wedge and how do I find one in my market? (Expands the vertical AI angle.)
- **q161** — How will hyperscaler industry clouds reshape vertical SaaS by 2030? (Context for the 5-year outlook.)
- **q180** — How do I run an internal capability audit before a strategic bet? (Operational detail on the capability-audit section.)
- **q181** — How do I avoid focus dilution when expanding beyond the core? (The single biggest counter-case, treated in depth.)
- **q200** — Case study: how Toast expanded from POS to platform. (Deep dive on the Toast case referenced here.)
- **q201** — Case study: how Veeva used regulatory specialization as a moat. (Deep dive on the Veeva case.)
- **q202** — Case study: vertical-entry failures and what they teach. (Deep dive on the failure patterns.)

`;

const tags = ['gtm-strategy','vertical-expansion','market-entry','capital-allocation','product-strategy','tam-sam-som','go-to-market','board-communication','vertical-saas','2027'];

const sources = [
  { title: '"Crossing the Chasm" — Geoffrey Moore', url: 'https://www.harpercollins.com/products/crossing-the-chasm-3rd-edition-geoffrey-a-moore' },
  { title: 'Bessemer Venture Partners — State of the Cloud / Vertical SaaS research', url: 'https://www.bvp.com/atlas' },
  { title: 'a16z — Vertical SaaS and AI essays', url: 'https://a16z.com/' }
];

const notes = {
  s6: 'Added 30 cited sources: foundational strategy texts (Crossing the Chasm, Play Bigger, Lean Startup, Obviously Awesome, Blue Ocean), venture and growth-equity research (Bessemer, a16z, OpenView, Battery, ICONIQ, First Round, SaaStr, Tunguz), primary-source S-1/10-K filings for all five case-study companies (Toast, Veeva, Procore, ServiceTitan, Samsara), regulatory primary sources (AICPA SOC 2, HHS HIPAA, FINRA/SEC recordkeeping rules, DoE FERPA, FedRAMP, PCI-DSS), industry-cloud documentation (AWS/Microsoft/Google, McKinsey/BCG), and competitive-mapping and failure-analysis frameworks (Gartner, CB Insights).',
  s7: 'Added comprehensive numerical analysis: the six-factor scorecard weights (Product Fit 25%, Market Size 20%, GTM Cost 20%, Competitive Density 15%, Regulatory 10%, Expansion/Retention 10%) and thresholds; the 5-year vertical penetration curve and $15M-$30M SOM bar; product-fit percentage thresholds; the engineering tax broken down in eng-quarters by category (6-12 total, $600K-$1.5M); regulatory cost-and-timeline table for SOC 2 / HIPAA / FINRA-SEC / FERPA / FedRAMP / PCI-DSS; GTM cost modeling line items ($1.5M-$3M+/year); sales-cycle and CAC expectations (2-4x core CAC early, 18-24 month healthy payback); the three staged investment gate costs and timelines; build/buy/partner triggers; and the honest base rates.',
  s8: 'Added the counter-case: when a vertical looks attractive but isn\'t. Eight failure patterns stress-tested — the TAM mirage, the underestimated engineering tax, regulatory quicksand, incumbent moats a better product cannot cross, focus dilution killing the core business, the "zero competition" false positive, the organic-signal vacuum — plus the honest verdict that the right answer is "no" or "not yet" far more often than founders want to hear, and that winning at vertical expansion comes from the discipline of many disciplined nos backing the rare yes.',
  s9: 'Cross-linked 23 related Pulse entries: GTM and SDR disruption (q1899), adjacent strategic-allocation decisions (q88-q98 — upmarket vs horizontal, bottoms-up TAM, staged gates, CAC modeling, build/buy/partner, eng tax scoping, design-partner pilots, board communication, vertical retention), regulated-industry and incumbent-displacement deep dives (q120-q122), vertical brand and channel building (q140-q141), AI-native wedge and industry-cloud outlook (q160-q161), capability audit and focus-dilution (q180-q181), and the three case-study deep dives (q200-q202).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the new-vertical GTM-investment evaluation framework for CRO/CEO/head-of-strategy at $10M-$200M ARR SaaS. Two mermaid diagrams (the staged investment gate flow with go/no-go decision points and capped-downside stops; the six-factor weighted scorecard showing how factors combine into go/conditional/no with a fatal-flaw override). Full coverage: the six-factor weighted scorecard (Market Size, Product Fit, Competitive Density, Regulatory Complexity, GTM Cost, Expansion/Retention), bottoms-up TAM/SAM/SOM sizing, product fit assessment, the engineering tax in eng-quarters, competitive density and displacement, regulatory complexity scoring across HIPAA/FINRA-SEC/FERPA/SOC 2/FedRAMP/PCI-DSS, GTM cost modeling, the beachhead customer test, channel and partnership availability, existing customer signal, the pilot/wedge strategy, pricing power, sales cycle and CAC expectations, retention expectations, the build vs buy vs partner decision, internal capability audit, five real case studies (Toast, Veeva, Procore, ServiceTitan, Samsara), five vertical-entry failure patterns, the go/no-go scorecard with thresholds, the three staged investment gates, opportunity cost framing, investor communication, the vertical AI angle, the 5-year outlook (vertical SaaS consolidation, hyperscaler industry clouds, AI verticalization), the final decision framework checklist, and an eight-pattern counter-case.'
};

runPolish({ id: 'q90', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
