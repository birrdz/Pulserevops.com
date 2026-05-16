// q9528 — What's the right operating model for deciding whether your company should be in acquisition mode or expansion mode?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** First, kill the ambiguity: "acquisition mode" here means **tilting your company's marginal resources toward landing NEW LOGOS**, and "expansion mode" means **tilting them toward growing the EXISTING installed base** — this has nothing to do with M&A or buying other companies. Every revenue org is always doing both; the operating-model question is **where the marginal dollar of budget, the marginal head of capacity, and the marginal sprint of engineering go.** That tilt is the decision, and most companies tilt by accident — inertia, the loudest VP, last year's plan — rather than by analysis. The right operating model reads **four diagnostics**: (1) **Net Revenue Retention** — if NRR is strong (115%+) but your accounts are under-penetrated, you're leaving expansion money on the table; (2) **CAC efficiency** — if new-logo CAC payback is stretching past 18-24 months while expansion CAC pays back in 6-9, the math is screaming expansion; (3) **market penetration** — if you've captured a tiny share of your addressable ICP, acquisition has runway; if you're a meaningful share of the reachable market, growth has to come from the base; (4) **base size** — a thin installed base can't be the engine yet, no matter how good NRR looks. You then express the answer not as a binary but as **an explicit tilt percentage** — "65% of marginal resources to expansion this fiscal year" — and you **align all four operating levers to it: people (AE vs AM mix), comp (new-logo bonus vs net-revenue comp), marketing (demand gen vs customer marketing), and product roadmap (activation/time-to-value vs depth/cross-sell).** The single most common and most expensive failure is **misalignment** — a company that declares "we're in acquisition mode" but comps for expansion, or vice versa, so the org spins its wheels. The 2026 capital environment — efficiency-rewarded, not growth-at-all-costs — structurally favors the better unit economics of expansion for most mid-stage companies, but stage matters: early-stage almost always tilts acquisition because you need a base before you can expand it. Revisit the tilt **annually at planning, plus on event triggers** (a fundraise, a TAM reassessment, an NRR shift, a competitive change) — but never whipsaw it, because re-hiring, re-comping, and re-pointing the roadmap make mode-switching genuinely expensive.`;

const core = `

## The Framing: Every Revenue Org Is Always Doing Both — The Decision Is The Tilt

There is a question that sits underneath almost every hard resource-allocation argument inside a $5M-$100M ARR software company, and most executive teams never name it out loud. The question is not "should we grow?" — everyone agrees on that. The question is not even "should we sell new deals or keep our customers?" — everyone agrees you do both. The question is far sharper and far more uncomfortable: **given one more dollar of budget, one more head of capacity, one more sprint of engineering time — where does it go? Toward landing a new logo, or toward expanding an account you already have?**

That is the acquisition-versus-expansion decision, and the first thing to be precise about is what those words mean here. "Acquisition mode" does not mean buying other companies — there is no M&A in this framework at all. It means **tilting the operating model toward new-logo acquisition**: pointing the marginal resources of the company at customers who are not yet customers. "Expansion mode" means **tilting the operating model toward the installed base**: pointing the marginal resources at growing revenue inside accounts you have already won — more seats, more modules, higher tiers, more usage, cross-sell, upsell. Both motions run at all times in any healthy company. Nobody stops selling new deals entirely, and nobody stops serving existing customers entirely. The mode is not about which motion exists. **The mode is about which motion gets the marginal investment.**

This matters because the marginal dollar is the only dollar you actually control. The base of your spending is committed — you have AEs under contract, you have a CS team, you have a marketing org, you have an engineering roadmap half-built. What an operating model actually decides, each planning cycle, is the increment: the next hire, the next budget line, the next quarter's roadmap priorities. **The tilt is the pattern of those increments.** A company in "expansion mode" is one where, when the increment shows up, it has a strong default — it goes to the base unless there's a specific reason it shouldn't. A company in "acquisition mode" has the opposite default.

And here is the failure that this entire entry exists to fix: **most companies never make this an explicit decision.** They tilt by accident. The tilt emerges from inertia ("we've always been a new-logo company"), from org-chart politics (the VP of Sales is louder than the VP of Customer Success, so sales wins the headcount fight), from last year's board deck (the plan said "120 new logos" so the plan still says "120 new logos"), or from founder identity (the founder loves the thrill of closing new deals and is bored by expansion). None of those are analysis. All of them produce a real, consequential tilt — they just produce it without anyone deciding it, which means nobody is accountable for whether it's the right tilt, and nobody is checking it against the company's actual metrics. The right operating model replaces the accidental tilt with a deliberate one.

## Why It's Not "Both Equally" — The Tyranny Of The Marginal Dollar

The most common dodge, when an executive team is confronted with the acquisition-versus-expansion question, is to say "we'll do both — they're both important." This is true and useless. It is true because both motions are genuinely important; no company survives by abandoning either. It is useless because **"both equally" is not an operating model — it's a refusal to have one.**

Resources are finite. That is not a slogan; it is the entire reason operating models exist. If resources were infinite, you would fully fund every motion and the question would vanish. They are not infinite. You have a headcount budget, a marketing budget, an engineering capacity, and an executive-attention budget — and every one of them is smaller than the sum of what every function wants. So the question is not whether to allocate; allocation is forced. The question is **whether you allocate on purpose or by default.**

Consider what "both equally" does in practice. It means the next sales hire and the next CS hire get fought out in a meeting, and whoever argues better wins — not whoever the metrics favor. It means the marketing team splits its budget down some historical middle, demand-gen versus customer-marketing, that nobody has revisited in two years. It means the engineering roadmap is a negotiated truce between the PM who owns activation and the PM who owns the power-user feature set, with the split determined by who escalated harder. **"Both equally" doesn't eliminate the tilt — it just hides it, and a hidden tilt is one you can't manage, can't measure, and can't correct.**

The marginal-dollar question forces clarity. It asks: it is planning season, you have approved twelve net-new heads and a 15% larger budget — does the bulk of that increment point at new logos or at the base? It asks: engineering has capacity for six major initiatives next year — do four of them serve "win the new deal" or "grow the existing account"? It asks: your best AE just got promoted to a player-coach role — does the territory they leave behind get backfilled with another new-logo hunter or converted into an expansion patch? **Each of those is a marginal-dollar decision, and the operating model is just the sum of them made coherently rather than one fight at a time.**

A useful executive discipline: take the next planning cycle's *incremental* resources — only the increment, not the base — and force a single number. "Of every marginal dollar of go-to-market investment next year, ___% goes to new-logo acquisition and ___% goes to expansion of the base." If the team cannot say that number, the team does not have an operating model. It has a budget spreadsheet and a set of unexamined habits.

## The Core Diagnostic — Read Your Own Metrics

The good news is that you do not have to guess. A company that is paying attention can read, from four numbers it already has, which mode it *should* be in. The operating model is not a matter of taste or founder preference — it is a matter of diagnosis, and the diagnosis is in the data.

**Diagnostic 1: Net Revenue Retention (NRR).** NRR measures what happens to a cohort of revenue over twelve months — expansion minus contraction minus churn, expressed as a percentage of where it started. But the raw number lies unless you pair it with penetration. A company at 105% NRR might be fine — or might be a company that has *fully penetrated* its accounts and has nothing left to expand. A company at 105% NRR with deeply under-penetrated accounts is a company *failing to capture expansion that is sitting right there.* So the real diagnostic is **NRR relative to the expansion headroom in the base.** High NRR with low headroom: you're executing well, the base is tapped, look elsewhere. Modest NRR with high headroom: you have an expansion problem you can fix, and that's a screaming tilt-to-expansion signal.

**Diagnostic 2: New-logo CAC payback.** How many months of gross margin does it take to earn back what you spent acquiring a new customer? When this number is healthy — call it under 12-18 months for most SaaS — new-logo acquisition is an efficient use of capital and acquisition has runway. When it stretches — past 24 months, past 30 — every new logo is a worse and worse investment, and the same dollar would compound faster if pointed at the base. **Rising new-logo CAC payback is one of the loudest tilt-to-expansion signals there is**, because it is telling you the acquisition motion is getting structurally less efficient.

**Diagnostic 3: Market penetration of your ICP.** Of the companies that genuinely fit your ideal customer profile — not the fantasy TAM, the *reachable, qualified, winnable* set — what fraction are customers? If it's 2%, acquisition has years of runway and tilting away from it would be leaving an open field. If it's 35-40% of the realistically reachable market, you are running out of new logos to win, the remaining ones are the hardest and most expensive, and growth structurally has to come from the base whether you like it or not.

**Diagnostic 4: Expansion revenue available in the base.** This is the dollar-denominated version of headroom. If every account were expanded to its natural ceiling — full seat penetration, the right tier, all relevant modules — how much additional ARR is sitting in the installed base today? If that number is large relative to your new-logo bookings target, expansion is not a nice-to-have, it's the obvious engine. If it's small — because the base is thin, or already well-penetrated — then expansion cannot carry the plan and acquisition has to.

These four numbers, read together, point. They rarely all point the same direction with equal force, which is why the output is a *tilt percentage* and not a binary — but they constrain the decision enormously, and they turn "which mode are we in?" from an argument into a diagnosis.

## The "Expansion Mode" Signal Set

Certain patterns, when you see several of them together, are the operating model telling you to tilt toward expansion. None is decisive alone; in combination they are close to dispositive.

**High NRR potential not being captured.** Your expansion motion, where it runs, works — accounts that get attention grow. But coverage is thin: most accounts get no proactive expansion motion at all. The math says if you simply *ran* the motion you already know works across the accounts you already have, NRR would jump. That gap between demonstrated expansion capability and actual expansion coverage is pure tilt-to-expansion signal.

**A large, under-penetrated installed base.** You have hundreds or thousands of customers, and the average one uses a fraction of what they could — a slice of the seats, one module of several, a tier below where their usage actually sits. The base is a field that's been planted but barely harvested.

**Rising new-logo CAC.** Covered above as a core diagnostic, but worth repeating in the signal set because it is so common in 2026: the new-logo motion is getting more expensive every quarter, payback periods are stretching, and the efficient frontier has moved toward the base.

**A mature, saturating ICP.** You've been selling into the same defined segment for years and the easy logos are gone. Win rates on new deals are softening, sales cycles are lengthening, and the remaining prospects are the skeptics and the late adopters. The new-logo well isn't dry, but it's getting deep.

**Strong product-led expansion vectors.** Your product naturally creates expansion pressure — usage grows, teams invite teammates, adjacent use cases pull in adjacent buyers, consumption-based pricing means growing customers automatically pay more. When the product itself is an expansion engine, tilting resources to amplify that engine has enormous leverage.

When four or five of these are true at once, the operating model has effectively already decided — the job of the executive team is to *notice* and then *align the levers*, which most teams are slow to do.

## The "Acquisition Mode" Signal Set

The mirror-image patterns push the other way — toward tilting the marginal resources at new logos.

**A huge, genuinely untapped TAM.** Not a slide-deck TAM — a real, reachable market where the number of qualified, winnable accounts dwarfs your customer count. When the field is mostly empty, the highest-return use of resources is to go plant it.

**Low market penetration.** The flip side of the saturation signal: you've captured a small single-digit percentage of your reachable ICP. Every quarter you don't acquire, a competitor might. The land-grab is real and the cost of ceding it is permanent.

**Efficient new-logo CAC.** Payback is short, win rates are healthy, sales cycles are reasonable. The acquisition machine works and works cheaply — which means every dollar you put into it compounds well. You don't tilt away from a motion that's this efficient.

**A land-and-expand model where you need more lands.** This is the subtle one. If your whole growth thesis is "land small, expand big," then the expansion engine is *fed by* lands — and if the base is thin, the constraint on future expansion is not your expansion motion, it's your *land count.* Counterintuitively, the best thing a land-and-expand company with a thin base can do for its *expansion* numbers two years out is tilt to *acquisition* now.

**Competitive land-grab dynamics.** In some markets, the first vendor to establish a beachhead in an account is very hard to dislodge — switching costs, integration depth, political capital. When the market is in a phase where logos are being permanently claimed, speed of acquisition is strategic, not just financial.

**A thin installed base with little expansion left.** If you have relatively few customers and the ones you have are already reasonably penetrated, there is simply not much expansion to capture — the denominator is too small. Acquisition is not a preference here; it's an arithmetic necessity.

## The NRR Test

Of the four diagnostics, NRR deserves its own deeper treatment because it is the single most misread number in the acquisition-versus-expansion decision.

The naive reading is "high NRR good, low NRR bad." That's true for the health of the business but **wrong as a mode signal**, because NRR has to be read against penetration. Walk through the cases.

**Case A: NRR above ~115-120%, accounts under-penetrated.** This is the clearest tilt-to-expansion signal in the whole framework. Your base is *already* growing fast even without a fully resourced expansion motion, and the accounts have obvious room left to run. You are leaving expansion money on the table — money that would convert at a fraction of new-logo CAC. Tilt to expansion, hard.

**Case B: NRR above ~115-120%, accounts already well-penetrated.** High NRR, but the headroom is mostly gone — the number is high because you've *already* done the expansion work. There's not much left in the base. This is a tilt-to-acquisition signal in disguise: the expansion engine has done its job and the next phase of growth has to come from new logos that you can then, over time, expand.

**Case C: NRR is fine (say 100-110%) but the base is small.** The base isn't the problem and it isn't the opportunity — it's just small. A modest expansion rate on a small base can't carry a growth plan. You need more lands first. Tilt to acquisition, with a plan to tilt back once the base has scale.

**Case D: NRR below 100%.** Before you even have a mode conversation, you have a retention problem. Net-negative retention means the base is *leaking*, and tilting resources toward "expansion" of a leaking base is pouring water into a bucket with a hole. Fix gross retention first; *then* the mode question becomes meaningful.

The test, then, is not "what's our NRR" — it's **"what's our NRR, and how much expansion headroom is left in the base, and how big is the base?"** Those three together tell you whether the base is an engine you're under-using, an engine you've already maxed, or an engine too small to matter yet.

## The CAC-Efficiency Test

The second test compares the cost of the two motions directly, because in the end the operating model is a capital-allocation decision and capital flows to the better return.

Run two numbers side by side. **New-logo CAC payback**: total sales-and-marketing cost to land a new customer, divided by the monthly gross margin that customer generates — how many months to break even. **Expansion CAC payback**: the cost of the expansion motion (expansion reps, customer marketing, the CS time that drives growth, the product investment that enables it) divided by the monthly gross margin of the expansion revenue it produces.

In most software companies, expansion CAC payback is dramatically shorter than new-logo CAC payback — often by a factor of two to four. The reasons are structural: you already have the relationship, the contract, the security review, the integration, the champion, the billing setup. Expansion revenue rides on infrastructure you already paid for. New-logo revenue has to build all of it from scratch.

**When the spread is wide and widening — new-logo payback stretching past 24 months while expansion payback sits at 6-9 — the math is not subtle. It is screaming expansion.** Every dollar you put into new-logo acquisition is compounding two to four times slower than the same dollar in expansion. A rational operating model tilts toward the better return.

**But the test can also point the other way.** If new-logo CAC payback is *still efficient* — under 12-18 months — then acquisition has not lost its claim on capital. An efficient acquisition motion that is also feeding a future expansion base is a perfectly good use of the marginal dollar. The CAC-efficiency test does not automatically favor expansion; it favors *whichever motion has the better and more durable payback*, and it just happens that in 2026's environment, for many mid-stage companies, that's expansion.

The discipline is to actually *compute both numbers* and put them next to each other. A startling number of companies track new-logo CAC obsessively and have never once calculated their expansion CAC — which means they are flying half-blind on the single most important capital-allocation comparison they make.

## The Market-Penetration Test

The third test asks a question of *position*: how much of the winnable market do you already have?

The trap here is the fantasy TAM — the giant number on slide four of the pitch deck that includes every company that could theoretically, someday, under ideal conditions, buy something like what you sell. That number is useless for this test. The number that matters is the **reachable, qualified, winnable ICP**: companies that genuinely fit, that you can actually sell to with your current motion, that are realistic wins.

Against *that* denominator, compute your penetration. And read it:

**Low single-digit penetration (say under 5-10%).** The field is wide open. There are far more winnable logos out there than you have customers. Tilting away from acquisition would mean voluntarily ceding an open market — often to competitors who will then own those accounts permanently. Acquisition has clear runway.

**Meaningful share (say 25-40%+ of the reachable market).** You are no longer in an open field — you are in a maturing one. The logos you don't have are increasingly the hardest ones: committed to a competitor, structurally skeptical, or simply slow. New-logo acquisition gets more expensive and slower from here almost by definition. Growth structurally has to come from going deeper into the base.

**The middle (10-25%).** This is the genuine decision zone, where the penetration test alone won't settle it and you lean on the other three diagnostics and on stage.

One nuance worth naming: penetration can be re-expanded by **expanding the definition of the ICP** — entering an adjacent segment, moving up- or down-market, adding a geography. That's a legitimate strategic move, but recognize it for what it is: it's not "staying in acquisition mode," it's *opening a new acquisition front*, which carries its own go-to-market build cost and shouldn't be confused with continued efficient acquisition in the original segment.

## The Stage Lens

The four diagnostics are the core of the operating model, but they are read through a lens, and the first lens is company stage. Stage doesn't override the diagnostics — but it heavily shapes how they're likely to read and what the default should be.

**Early stage (roughly under $5-10M ARR, though the dollar line varies).** Almost always tilts acquisition, and for a reason that is close to definitional: **you cannot expand a base you don't have.** Expansion is leverage on an installed base, and at early stage the base is too thin for that leverage to matter. The math is simply that new logos are the only way to build the asset that expansion will later operate on. The rare exception is a company whose very first customers have enormous, obvious land-and-expand headroom — but even then, you usually need more lands. Early stage's default is acquisition.

**Growth stage (roughly $10-50M ARR).** This is the real decision zone — the stage where the acquisition-versus-expansion question is genuinely live and genuinely hard. The base is now big enough that expansion *could* be a real engine, but acquisition often still has runway too. This is where the four diagnostics earn their keep, where the tilt percentage actually has to be computed rather than assumed, and where most of the expensive mistakes get made — because companies carry their early-stage acquisition reflex past the point where the diagnostics have started pointing the other way.

**Mature stage (roughly $50M+ ARR, market position established).** Usually must tilt expansion, and often the diagnostics confirm it: ICP penetration is high, new-logo CAC has stretched, the base is large and full of headroom. Mature companies that refuse to tilt — that keep pouring the marginal dollar into an increasingly saturated new-logo motion out of habit or identity — are the classic case of an operating model that the metrics have outgrown. The default at maturity is expansion, and fighting that default requires a specific, defensible reason (a genuine new TAM, a major product expansion that resets penetration, etc.).

Stage is a prior, not a verdict. A growth-stage company with a wide-open TAM and efficient CAC should tilt acquisition even though it's "old enough" to expand. A mature company that just launched a category-redefining product might legitimately re-tilt to acquisition. But absent those specific reasons, stage tells you which way to *lean while you read the diagnostics.*

## The Capital-Environment Lens

The second lens is external: what does the capital market currently reward? Because the "right" operating model is partly a function of who you're optimizing for, and at a $5M-$100M ARR company, you are partly optimizing for the next funding event, the board, and ultimately an exit.

**In a growth-at-all-costs environment** — the kind that prevailed in much of the 2010s and peaked around 2021 — capital rewarded the acquisition tilt. Top-line growth rate was the dominant valuation input, new-logo count and ARR-added were the headline metrics, and burn was tolerated, even celebrated, in service of land-grab. In that environment, an aggressive acquisition tilt was not just defensible — it was what the market was paying for.

**In an efficiency environment** — the world from roughly 2022 onward, and the world of 2026 — capital rewards different things. The Rule of 40, net revenue retention, CAC payback, burn multiple, and gross margin moved to the center of how companies are valued. And those metrics structurally **favor expansion's unit economics.** Expansion revenue carries higher margin, shorter payback, and lower risk than new-logo revenue. NRR became a headline number that boards and investors stare at directly. In this environment, a company that demonstrates it can grow efficiently *through its base* is telling exactly the story the market wants to hear.

**The 2026 reality** is firmly in the efficiency camp, and for most mid-stage companies that creates a genuine gravitational pull toward expansion — not because expansion is morally superior, but because the people pricing the company are rewarding the economics expansion produces. This does not mean every company should tilt expansion; an early-stage company with a wide-open market still needs to acquire, and the capital market understands that for early stage. But it does mean the *bar for justifying a heavy acquisition tilt is higher in 2026 than it was in 2020* — you need the diagnostics to clearly support it, because the default external expectation now leans the other way.

The honest framing for an executive team: the capital-environment lens is not about chasing fashion. It's about recognizing that your operating model is also a *story you tell the market*, and the story has to be both true and currently fundable. In 2026, the efficient-expansion story is the one the market is most ready to buy — so if your diagnostics support it, the alignment of internal math and external narrative is a real advantage.

## The Operating-Model Implications Of An Acquisition Tilt

Choosing a tilt is meaningless unless the company actually *changes shape* to match it. An acquisition tilt, executed properly, reorganizes the company in specific ways.

**People.** The headcount mix shifts toward new-logo capacity: more new-business AEs, more SDRs and BDRs feeding them, more demand-gen marketing headcount. Sales hiring is the dominant line in the plan. The expansion-facing roles — account managers, expansion reps — are staffed adequately but are not where the growth headcount goes.

**Marketing.** Spend points at the top of the funnel: awareness, demand generation, pipeline creation, category presence, competitive positioning. The marketing org's primary metric is *qualified pipeline created for new logos.* Customer marketing exists but is lean.

**Product.** The roadmap is weighted toward the things that *win new deals and get new customers successful fast*: activation, onboarding, time-to-value, the table-stakes features that show up on competitive evaluation checklists, the integrations that unblock new-segment deals. Engineering capacity flows to "make the new customer say yes and then succeed quickly."

**Customer Success.** In an acquisition tilt, CS is fundamentally a **cost center oriented around retention** — its job is to keep the logos you worked so hard to land from churning, to protect the base, to ensure the new customers activate. It is resourced to retain, not primarily to expand. (This is a defensible model in an acquisition tilt; it becomes a serious problem only when a company *says* it's tilting expansion but still runs CS this way — more on that misalignment below.)

**Comp.** The comp plan rewards new logos: new-business quotas, new-logo bonuses, accelerators on net-new ARR. The compensation system's gravity points the entire revenue org at the same thing the operating model points at.

When all five of these are aligned to the acquisition tilt, the company is a coherent acquisition machine. When some are and some aren't, you get the spinning-wheels failure.

## The Operating-Model Implications Of An Expansion Tilt

An expansion tilt reorganizes the company just as thoroughly — in the opposite direction.

**People.** The headcount mix shifts toward base-facing capacity: more account managers and expansion reps, a CS organization that's staffed and skilled to *drive growth*, not just prevent churn. New-logo sales is still staffed — you never stop acquiring — but the *growth* headcount goes to the base.

**Customer Success becomes a revenue center.** This is the single biggest structural change. In an expansion tilt, CS is not a cost of doing business — it is a *growth engine*. CSMs (or a dedicated expansion-rep layer) carry expansion targets, are measured on account growth, and are resourced and compensated accordingly. The function moves from "defend" to "grow."

**Product.** The roadmap is weighted toward **depth**: features that drive deeper usage, that unlock cross-sell and upsell, that increase the value an existing customer gets and therefore the price they'll bear, that surface expansion opportunities, that make additional seats and modules and tiers genuinely worth buying. Engineering capacity flows to "make the existing customer get more value and want more."

**Marketing.** Spend shifts toward customer marketing, adoption campaigns, lifecycle marketing, expansion-oriented messaging, advocacy and reference programs. The marketing org starts caring about *driving usage and expansion within the base*, not only filling the top of the new-logo funnel.

**Comp.** The comp plan rewards net revenue: expansion quotas, retention components, NRR-linked incentives, comp tied to *net* revenue movement rather than only gross new bookings. The compensation system's gravity points at growing the base.

A company that genuinely makes these five changes is an expansion machine. A company that announces an expansion tilt but leaves the comp plan, the headcount mix, and the roadmap pointed at new logos has announced nothing — it has just created internal contradiction.

## The Comp-Plan Consequence

Of all the levers, comp deserves singular attention, because it is the lever that most reliably *overrides everything else.* You can put any words you want in the strategy deck. The comp plan is what people actually optimize for, every single day, because the comp plan is what pays their mortgage.

In an **acquisition tilt**, the comp plan should reward new logos: new-business reps on new-logo quotas, accelerators on net-new ARR, SDR comp tied to qualified new-logo pipeline. The whole revenue comp system pulls toward landing customers who aren't customers yet.

In an **expansion tilt**, the comp plan should reward *net revenue*: expansion quotas for AMs and CSMs, retention components, comp structures that pay for *growing an account* and *keeping an account*, possibly NRR-linked variable comp for the CS leadership. The system pulls toward growing and keeping the base.

Here is the failure mode, and it is astonishingly common: **a company declares one mode and comps for the other.** The CEO says "this is our expansion year" in the all-hands. Then the comp plan, untouched from last year, still pays AEs handsomely for new logos and pays CSMs a flat salary with a small retention kicker and *nothing* for expansion. What happens next is entirely predictable. The reps chase new logos, because that's what's comped. The CSMs defend, because that's what's comped. The "expansion year" produces ordinary expansion numbers, the executive team is confused, and the answer was visible in the comp plan the whole time. **A comp plan that fights the stated mode doesn't just fail to help — it actively wins, because incentives beat intentions every time.** The cost of that misalignment is a wasted year and a credibility hit when the mode "doesn't work" — when in fact the mode was never actually run.

The discipline: when you set the tilt, the comp plan is not an afterthought to be cleaned up in Q2. It is the *first* lever you change, because it is the one that determines whether the others matter.

## The Product-Roadmap Consequence

Engineering capacity is as finite as headcount and budget, and the roadmap is where the acquisition-versus-expansion tilt either gets reinforced or gets quietly betrayed.

In an **acquisition tilt**, finite engineering capacity should flow toward the features that *win new deals and activate new customers*: the competitive-checklist features that come up in every evaluation, onboarding and activation flows that get a new customer to value fast, the integrations that unblock entire new segments, the table-stakes capabilities a prospect expects before they'll even shortlist you.

In an **expansion tilt**, the same finite capacity should flow toward *depth*: the features that drive deeper, stickier usage; the capabilities that justify a higher tier; the adjacent modules that create cross-sell; the analytics and surfacing that make expansion opportunities visible to the AM and obvious to the customer; the workflow depth that turns a light user into a power user who needs more seats.

The roadmap is where this tilt is most often betrayed *silently*, because product prioritization happens in a hundred small decisions rather than one visible one. A company can declare an expansion tilt and then, sprint by sprint, keep funding the new-logo competitive features — because those are the features the sales team escalates loudest about, because a lost deal is a vivid story and an under-expanded account is an invisible one. **The fix is to make the engineering allocation explicit and to tie it to the tilt percentage**: if the company is 65% tilted to expansion, then a clear majority of major roadmap initiatives should be expansion-serving, and that should be visible, reviewed, and defended in the roadmap process — not left to emerge from whoever escalates hardest.

## The "We're In Acquisition Mode But Comp'd For Expansion" Misalignment

This is the single most important failure pattern in the entire operating model, and it deserves to be named as its own section because it is so common, so costly, and so invisible to the teams suffering from it.

The pattern: **the stated mode and the actual operating levers don't match.** The executive team has *declared* a tilt — in the strategy offsite, in the board deck, in the all-hands. But the four levers — people, comp, marketing, product — are still configured for the *previous* tilt, or for no coherent tilt at all. The company *says* acquisition but comps for expansion, or *says* expansion but the headcount plan, the comp plan, and the roadmap are all still pointed at new logos.

The symptom is **an org that spins.** Effort is high, results are mediocre, and nobody can quite explain why. The sales team works hard but the numbers are ambiguous. The CS team works hard but NRR doesn't move the way the strategy said it would. Every function can point to its own activity and say "we did our job" — and they're not lying. The problem isn't effort; the problem is that the levers are pulling against each other, so the work cancels out.

The fix is an **alignment audit**, and it should be run every time the tilt is set or changed. The audit walks all four levers explicitly:

- **People:** Does the headcount mix — and specifically the *growth* headcount in the plan — match the tilt? If we say expansion, are we actually hiring AMs and expansion-capable CSMs, or are we still hiring new-business AEs?
- **Comp:** Does the comp plan reward the behavior the tilt requires? If we say expansion, does the plan actually pay for net revenue, expansion, and retention — or does it still pay overwhelmingly for new logos?
- **Marketing:** Is marketing spend and headcount pointed where the tilt says? If we say expansion, is there a real customer-marketing and adoption motion — or is the budget still 90% top-of-funnel demand gen?
- **Product:** Does the roadmap allocation match the tilt? If we say expansion, are a clear majority of major initiatives expansion-serving — or is the roadmap still dominated by new-logo competitive features?

If any lever is misaligned, the mode is not real. **A mode is not what you declare — it is what your levers actually do.** The alignment audit is how you make the declaration true.

## The Hybrid Reality & The Tilt Percentage

Everything above might read as binary — acquisition mode *or* expansion mode — but the binary is a simplification, and treating it as literal is itself a mistake. The reality is that **it is never 100/0.** No company stops acquiring entirely; no company stops serving and growing its base entirely. The mode is a *tilt*, and a tilt has a magnitude.

The right way to express the operating model is therefore not a label but **a percentage:** "65% of marginal go-to-market resources to expansion this fiscal year, 35% to acquisition." That single number does an enormous amount of work:

- It is **honest** — it acknowledges that both motions run and both get fed.
- It is **actionable** — it can be translated directly into the headcount split, the marketing budget split, the roadmap allocation, and the comp design.
- It is **measurable** — at year-end you can check whether the resources actually went where the percentage said.
- It is **debatable in the right way** — the executive argument becomes "should it be 65/35 or 55/45?" which is a productive, quantitative conversation, instead of "are we an acquisition company or an expansion company?" which is an identity argument that never resolves.

The tilt percentage also makes the *intensity* of the decision visible. A 55/45 tilt is a gentle lean — it says "slightly favor expansion but keep acquisition strong." An 80/20 tilt is a hard commitment — it says "this year is decisively about the base, and acquisition is in maintenance." Those are very different operating models, and collapsing both into the word "expansion mode" loses exactly the information the executive team most needs to align on.

A practical note: the percentage should apply to **marginal** resources — the increment, not the base — because that's what's actually being decided. And it should be set for a defined period, normally the fiscal year, because the levers it drives (hiring, comp, roadmap) operate on roughly that cadence.

## The Switching Cost

A tilt is a commitment, and the reason it is a commitment — the reason you cannot simply re-decide it every quarter — is that **changing modes is genuinely expensive.** The switching cost is real, it is large, and it is chronically underestimated by executive teams who think of the mode as just a strategic choice rather than a physical reconfiguration of the company.

Consider what actually has to change when a company switches tilts:

- **People.** You may need to re-hire — different roles, different skills. A new-business hunter and an expansion-oriented account manager are not interchangeable; switching tilts can mean a hiring cycle, an onboarding cycle, and sometimes painful exits. That's 6-12 months and real human cost.
- **Comp.** Re-comping an entire revenue organization is disruptive even when it's the right call. Reps have planned their year — and their income — around the old plan. Mid-cycle comp changes hurt morale and trust; even well-timed ones take a full cycle to land.
- **Roadmap.** Re-pointing engineering means initiatives in flight get deprioritized, partially built things get shelved, and the new priorities take a quarter or two to even start producing. Sunk cost and lead time both bite.
- **Muscle and narrative.** An organization that has been an acquisition machine has *acquisition muscle* — playbooks, instincts, manager skills, cultural identity. Rebuilding that as expansion muscle is a multi-quarter cultural project, not a memo.

Add it up and a genuine mode switch is a **12-18 month** project before it fully pays off. Which leads to the iron rule: **you cannot whipsaw between modes annually.** A company that tilts hard to acquisition this year, hard to expansion next year, back to acquisition the year after, will pay the switching cost three times and capture the benefit of none — it will spend its entire existence in transition. The tilt, once set, has to be **committed to for a real cycle** — long enough to reconfigure the levers, run the new model, and actually see the results. That's typically a multi-year commitment with only modest annual adjustments, not a fresh decision every planning season.

## The Review Cadence

If you can't whipsaw the mode, when *do* you revisit it? The answer is a deliberate cadence: a regular scheduled review, plus a defined set of event triggers.

**The scheduled review: annually, at planning.** Once a year, as part of the annual planning process, the executive team re-runs the four diagnostics — NRR and headroom, CAC efficiency for both motions, ICP penetration, base size — re-reads them through the stage and capital-environment lenses, and explicitly confirms or adjusts the tilt percentage. Most years, this review will *confirm* the existing tilt with a modest adjustment (65/35 becomes 60/40), because the underlying realities move slowly. Occasionally it will signal a real change. Either way, the annual review makes the tilt a *conscious, owned decision* every year rather than a fossil of a decision made three years ago.

**The event triggers.** Between annual reviews, certain events warrant an out-of-cycle look at the mode:

- **A fundraise.** New capital, and new investor expectations, can legitimately change the math — both what you can afford to do and what you're being rewarded for doing.
- **A TAM reassessment.** If you discover the reachable market is much bigger or much smaller than you thought — a new segment opens up, or the original one turns out to be more saturated than believed — the penetration diagnostic moves materially.
- **An NRR shift.** A significant move in NRR, up or down, changes the central expansion diagnostic and may warrant a re-look before the annual cycle.
- **A competitive change.** A major competitor enters or exits, a market consolidates, a land-grab phase begins or ends — any of these can change the strategic value of acquisition versus expansion.

The discipline is to **schedule the annual review** and **pre-define the triggers** — so that the mode gets revisited *deliberately, when it should be*, rather than either never (the fossil problem) or constantly (the whipsaw problem). A defined cadence is the middle path between rigidity and chaos.

## Measuring Whether The Mode Is Working

A tilt that you can't measure is a tilt you can't manage. Once the mode is set and the levers are aligned, the operating model needs a **mode-specific scorecard** — and the critical word is *mode-specific*, because the metrics that prove an acquisition tilt is working are different from the metrics that prove an expansion tilt is working.

**If you're in an acquisition tilt, the scorecard watches:**
- **New-logo growth rate** — are you actually landing customers faster?
- **Logo count** — is the base growing in absolute terms?
- **New-logo CAC payback holding** — is the acquisition motion staying efficient as you scale it, or is payback stretching (which would signal the tilt is reaching its limits)?
- **Pipeline coverage and win rate** — leading indicators that the acquisition machine is healthy.

**If you're in an expansion tilt, the scorecard watches:**
- **NRR climbing** — the headline proof that the base is growing.
- **Expansion revenue per account** — is the average account actually getting bigger?
- **Penetration of the base deepening** — are seat counts, module attach rates, and tier mix moving up?
- **Gross retention holding** — because expansion gains mean nothing if churn is rising underneath them.

The mistake to avoid: **judging an expansion tilt by acquisition metrics, or vice versa.** A company in a deliberate expansion tilt will, by design, post slower new-logo growth — and if the board panics about new-logo growth and forces a re-tilt, the expansion tilt never gets the cycle it needs to prove out. The scorecard has to *match the mode*, and the executive team and board have to agree, up front, that *these* are the numbers that define success for *this* tilt — so that the mode is judged on its own terms.

## Board & Investor Alignment

The operating model is not only an internal artifact — it has to be sold to, and owned by, the board. Because if the board is not bought into the tilt, the board will quietly (or loudly) undermine it, and a tilt the board fights is a tilt that won't survive a cycle.

**The framing for the board.** Present the four diagnostics as the *reasoning*, not the tilt as a conclusion handed down. Walk the board through NRR and headroom, the CAC comparison for both motions, ICP penetration, and base size — and let the tilt emerge from the diagnostics. A board that sees the *logic* will defend the tilt; a board that just hears "we've decided to focus on expansion" will second-guess it the first quarter new-logo growth dips.

**The metrics that prove it's the right tilt.** Agree with the board, *in advance*, on the mode-specific scorecard from the section above — so that when new-logo growth slows in an expansion tilt (which it will, by design), the board has already agreed that NRR and expansion-per-account are the numbers that matter, and doesn't treat the expected slowdown as a failure.

**The specific danger: vanity-logo pressure.** Boards — especially boards with directors from a growth-at-all-costs era — have a known failure mode: pushing for *impressive new logos* because logo announcements feel like progress and look good in an update. But chasing marquee logos when the diagnostics clearly favor expansion is destroying return for the sake of optics. The CEO's job is to *get ahead of this* — to make the expansion case with the diagnostics, agree the scorecard up front, and reframe "we didn't add as many logos" not as underperformance but as *the deliberate, agreed-upon consequence of allocating capital to its highest return.* A board that has been walked through the logic will hold that line. A board that hasn't will break it the first time a competitor announces a flashy logo.

The goal is a board that doesn't just *permit* the tilt but *owns* it — that will defend it through the quarter where the mode-appropriate metrics are climbing but the mode-inappropriate metrics look soft.

## 5 Real-World Scenarios

Abstract frameworks land better against concrete situations. Here are five composite scenarios — each a pattern common in $5M-$100M ARR software companies — and what the operating model says to do.

**Scenario 1: The high-NRR company under-investing in expansion.** A $40M ARR company posts 124% NRR. Impressive — and the executive team is proud of it. But the diagnostics reveal the accounts are *deeply* under-penetrated: the strong NRR is coming from a small number of accounts that happen to have an engaged CSM, while the majority of the base gets no proactive expansion motion at all. Meanwhile, the company's headcount plan, comp plan, and roadmap are all still configured for acquisition — because that's the company's identity. **Diagnosis:** this company is leaving an enormous amount of expansion money on the table. The tilt should move hard toward expansion — and the surprising-to-them insight is that their *best growth lever* is the base they've been treating as a maintenance task. The fix is the alignment audit: re-comp, re-staff CS as a revenue function, re-point the roadmap to depth.

**Scenario 2: The company chasing logos with a thin, under-monetized base.** A $15M ARR company is proud of its logo count — it adds new customers fast. But average revenue per account is low, the accounts that exist are barely monetized, and NRR is a mediocre 103%. The executive team's instinct is "add more logos." **Diagnosis:** this is a company filling a bucket with a hole in it. Before tilting harder toward acquisition, it needs to prove it can *monetize and grow* the logos it already lands — otherwise it's just acquiring low-value customers faster. The right move is a meaningful tilt toward expansion to fix the monetization model, *then* re-tilt toward acquisition once each new logo is worth landing.

**Scenario 3: The mature company finally tilting to expansion.** An $80M ARR company has been a new-logo machine for a decade. But the diagnostics now clearly point the other way: ICP penetration is 38%, new-logo CAC payback has stretched past 30 months, and the base is enormous and full of headroom. The company has resisted the tilt for years out of identity and habit. **Diagnosis:** the operating model the metrics outgrew. The tilt *must* move to expansion — but the section that matters most here is *switching cost*: this is a 12-18 month reconfiguration, it requires re-comping a large org and rebuilding CS as a revenue function, and it cannot be done as a memo. The board alignment work is also critical, because a decade-old new-logo narrative has to be deliberately retired.

**Scenario 4: The company whose comp fought its stated mode.** A $25M ARR company declared "this is our expansion year" at the annual offsite. Twelve months later, expansion numbers are ordinary and the executive team is baffled. The autopsy is simple: the comp plan was never changed. AEs were still paid for new logos; CSMs were still on flat salary with a token retention kicker and *zero* expansion incentive. **Diagnosis:** the mode was declared but never run — the comp lever silently overrode the strategy. The lesson is the comp-plan-consequence section in its purest form: a stated mode with a contradicting comp plan is not a mode at all.

**Scenario 5: The land-and-expand company that needs MORE lands.** A $12M ARR company runs a textbook land-and-expand model, and its NRR is a glittering 130%. The executive team, looking at that NRR, wants to tilt *harder* into expansion. **Diagnosis:** this is the counterintuitive case. The expansion engine is *already excellent* — the constraint on future growth isn't the expansion motion, it's the *number of lands feeding it.* With a base this thin, even a 130% NRR can't produce enough absolute dollars to hit the growth plan. The right move here is to tilt toward *acquisition* — because for a healthy land-and-expand machine with a thin base, more lands now is what produces more expansion two years from now. The diagnostic that catches this is *base size*, the one that's easiest to forget.

## The Decision Framework

Pulling the whole operating model into a single repeatable sequence — this is the framework an executive team runs, every annual planning cycle:

**Step 1 — Read the four diagnostics.** Compute and lay out, honestly: (a) NRR *and the expansion headroom in the base*; (b) CAC efficiency for *both* motions, side by side — new-logo payback and expansion payback; (c) ICP penetration against the *reachable, winnable* market, not the fantasy TAM; (d) the *size* of the installed base in absolute terms. These four are the evidence.

**Step 2 — Read them through the two lenses.** Apply the *stage lens* (early defaults acquisition, growth is the real decision zone, mature defaults expansion) and the *capital-environment lens* (2026 efficiency environment leans expansion, but stage can override). The lenses shape how the diagnostics should be weighted.

**Step 3 — Set the explicit tilt percentage.** Not a label, a number: "___% of marginal go-to-market resources to expansion, ___% to acquisition, this fiscal year." Make the magnitude as honest as the direction — a 55/45 lean and an 80/20 commitment are different operating models.

**Step 4 — Align all four levers to the tilt.** Run the alignment audit and reconfigure: *people* (the growth headcount mix), *comp* (what the plan actually rewards — change this first), *marketing* (where the spend and headcount point), *product* (the roadmap allocation). A tilt without aligned levers is a slogan.

**Step 5 — Commit for the cycle.** Recognize the switching cost. Commit to the tilt for a real period — long enough to reconfigure the levers and run the model, typically multi-year with only modest annual adjustment. Do not whipsaw.

**Step 6 — Measure with the mode-specific scorecard.** Track the metrics that prove *this* tilt is working — acquisition metrics for an acquisition tilt, expansion metrics for an expansion tilt — and make sure the board has agreed, in advance, that these are the numbers that define success.

**Step 7 — Revisit on cadence.** Re-run the whole sequence annually at planning, plus on the pre-defined event triggers (fundraise, TAM reassessment, NRR shift, competitive change). Deliberate revisiting — not never, not constantly.

That is the operating model. It is not a one-time choice; it is a *discipline* — a sequence the executive team runs on a cadence, that turns the accidental, politics-driven, identity-driven tilt that most companies have into a deliberate, diagnosed, aligned, measured, and periodically-revisited one.

## 5-Year Outlook

The acquisition-versus-expansion decision is not static, and the largest force reshaping it over the next five years is AI changing the *economics of both motions* — which means the diagnostics themselves will read differently than they do today.

**AI is making acquisition cheaper.** AI-assisted prospecting, AI SDRs, AI-driven research and personalization, AI-supported sales motions — these are compressing the cost of the new-logo motion. The CAC-efficiency diagnostic, for many companies, will start reading *better for acquisition* than it did in the early-2020s efficiency squeeze. A motion that looked structurally expensive may get meaningfully cheaper, which partially re-opens the case for an acquisition tilt that the 2026 environment had been closing.

**AI is also making expansion smarter.** AI-driven usage analytics, churn and expansion prediction, automated identification of which accounts have headroom and what they should buy next, AI-supported customer success — these make the expansion motion more *targeted and more efficient.* The expansion CAC payback gets shorter too, and the headroom in the base becomes far more *visible and actionable* than it is when expansion opportunities have to be found by hand.

**So AI improves both motions — which means the decision doesn't go away, it gets sharper.** If anything, AI *raises the stakes* of getting the tilt right, because both motions become more efficient and more scalable, so the marginal dollar matters even more. The companies that win the next five years will be the ones that read the (AI-shifted) diagnostics accurately and align their (AI-augmented) levers precisely — not the ones that assume AI makes the choice for them.

**A second-order effect:** as AI compresses the cost of both motions, the *durable* differentiator shifts from "can you run the motion efficiently" toward "do you have the operating-model discipline to point the now-cheaper resources at the right target." When everyone's motions get cheaper, the advantage moves to *allocation quality.* The framework in this entry — diagnose, tilt, align, commit, measure, revisit — becomes *more* valuable in an AI world, not less, precisely because the raw motions are commoditizing and the *judgment about where to aim them* is not.

**The net 5-year picture:** the four diagnostics remain the right lens, but their readings will move — acquisition CAC down, expansion CAC down, base headroom more visible. Stage still matters. The capital environment will keep evolving. And the executive teams that treat the operating model as a living discipline, re-run on cadence with AI-shifted inputs, will systematically out-allocate the teams that set a tilt once and forget it.

## Final Framework

The acquisition-versus-expansion operating model, compressed to its blueprint:

**The decision is the tilt.** Every revenue org runs both motions; the operating model decides where the *marginal* dollar, head, and sprint go. Most companies tilt by accident — inertia, politics, identity. The whole point is to tilt on purpose.

**The four-diagnostic test.** Read (1) NRR *and base headroom*, (2) CAC efficiency for *both* motions side by side, (3) ICP penetration against the *winnable* market, (4) absolute base size. These four, read together, point — they turn the decision from an argument into a diagnosis.

**The two lenses.** Filter the diagnostics through *stage* (early → acquisition, growth → the real decision, mature → expansion) and *capital environment* (2026 efficiency era leans expansion, stage can override).

**The tilt-percentage expression.** Express the answer as a number, not a label — "65% of marginal resources to expansion this year." Honest, actionable, measurable, and it makes the *magnitude* of the tilt as explicit as the direction.

**The four-lever alignment audit.** A tilt is real only if the levers match it: *people* (growth headcount mix), *comp* (what the plan rewards — change this first, it overrides everything), *marketing* (where spend points), *product* (roadmap allocation). The classic, costly failure is declaring one mode and configuring the levers for the other — the org spins.

**The mode-specific scorecard.** Measure the tilt with the metrics that prove *that* tilt is working — acquisition metrics for an acquisition tilt, expansion metrics for an expansion tilt — and get the board to agree, up front, that these are the numbers that define success.

**The commitment and the cadence.** Switching modes is a 12-18 month reconfiguration with real cost — so commit for a full cycle and never whipsaw. But revisit deliberately: annually at planning, plus on event triggers (fundraise, TAM shift, NRR move, competitive change).

**Board ownership.** Walk the board through the *diagnostics*, not just the conclusion; agree the scorecard in advance; get ahead of vanity-logo pressure. A board that owns the logic defends the tilt; a board that just heard the conclusion breaks it at the first soft quarter.

Run that blueprint as a discipline, on a cadence, with AI-shifted inputs as the years go on — and the accidental tilt that quietly governs most companies becomes a deliberate, diagnosed, aligned, measured, and owned operating model. That is the difference between a company that allocates its marginal dollar by analysis and one that allocates it by habit — and over a five-year horizon, that difference compounds into a very large gap in efficient growth.

`;

const flow = `

## The Mode-Decision Diagnostic Flow

\`\`\`mermaid
flowchart TD
  START[Annual Planning: Which Mode?] --> D1[Diagnostic 1: NRR and Base Headroom]
  START --> D2[Diagnostic 2: CAC Efficiency Both Motions]
  START --> D3[Diagnostic 3: ICP Market Penetration]
  START --> D4[Diagnostic 4: Installed Base Size]
  D1 --> READ[Read Diagnostics Together]
  D2 --> READ
  D3 --> READ
  D4 --> READ
  READ --> L1[Apply Stage Lens]
  READ --> L2[Apply Capital-Environment Lens]
  L1 --> TILT[Set Explicit Tilt Percentage]
  L2 --> TILT
  TILT --> TA[Example: 35% Acquisition]
  TILT --> TE[Example: 65% Expansion]
  TA --> ALIGN[Four-Lever Alignment Audit]
  TE --> ALIGN
  ALIGN --> P1[People: AE vs AM Headcount Mix]
  ALIGN --> P2[Comp: New-Logo vs Net-Revenue Plan]
  ALIGN --> P3[Marketing: Demand Gen vs Customer Marketing]
  ALIGN --> P4[Product: Activation vs Depth Roadmap]
  P1 --> COMMIT[Commit For The Cycle: No Whipsaw]
  P2 --> COMMIT
  P3 --> COMMIT
  P4 --> COMMIT
  COMMIT --> M1[Acquisition Scorecard: New-Logo Growth, Logo Count, CAC Payback]
  COMMIT --> M2[Expansion Scorecard: NRR Climb, Expansion Per Account, Penetration Depth]
  M1 --> BOARD[Board Owns The Mode-Specific Scorecard]
  M2 --> BOARD
  BOARD --> REVISIT[Revisit: Annual Plus Event Triggers]
  REVISIT --> START
\`\`\`

## Two Operating Models Side By Side

\`\`\`mermaid
flowchart LR
  subgraph ACQ[Acquisition-Tilt Operating Model]
    A1[People: More New-Business AEs and SDRs]
    A2[Comp: Rewards New Logos and Net-New ARR]
    A3[Marketing: Awareness and Demand Gen and Pipeline]
    A4[Product: Activation, Onboarding, Time-To-Value]
    A5[CS Role: Cost Center, Retain The Base]
    A1 --> A2 --> A3 --> A4 --> A5
  end
  subgraph EXP[Expansion-Tilt Operating Model]
    E1[People: More AMs and Expansion-Capable CSMs]
    E2[Comp: Rewards Net Revenue, Expansion, Retention]
    E3[Marketing: Customer Marketing and Adoption]
    E4[Product: Depth, Cross-Sell, Usage Growth]
    E5[CS Role: Revenue Center, Grow The Base]
    E1 --> E2 --> E3 --> E4 --> E5
  end
  DECISION[The Tilt Percentage Decides The Blend] --> ACQ
  DECISION --> EXP
  ACQ --> WARN[Misalignment Failure: Declare One, Configure The Other = Org Spins]
  EXP --> WARN
\`\`\`

`;

const src = `

## Sources

1. **SaaS Capital — Net Revenue Retention Benchmarks** — Industry NRR benchmarks by ARR scale and growth rate; the basis for reading NRR against company size.
2. **KeyBanc Capital Markets / OPEXEngine SaaS Survey** — Annual benchmarks on CAC payback periods, sales efficiency, and the new-logo vs expansion cost differential.
3. **Bessemer Venture Partners — State of the Cloud** — Framework material on efficient growth, NRR as a durable-growth driver, and the post-2021 shift in what capital rewards.
4. **OpenView Partners — SaaS Benchmarks Report** — Expansion revenue as a share of total growth across ARR stages; net-dollar-retention distributions.
5. **Bain & Company — Net Revenue Retention and the Economics of Expansion** — Analysis of why expansion revenue carries higher margin and shorter payback than new-logo revenue.
6. **McKinsey — B2B Growth: The Role of Cross-Sell and Upsell** — Research on installed-base monetization and the under-penetration gap in B2B software.
7. **Gainsight — Customer Success as a Revenue Center** — Operating-model material on shifting CS from cost center to growth function under an expansion tilt.
8. **Winning by Design — Revenue Architecture and the Bowtie Model** — Framework for the full lifecycle including the post-sale expansion motion and its resourcing.
9. **a16z — The SaaS Adventure / Growth vs Efficiency** — Commentary on the capital-environment shift and the Rule of 40 as the dominant 2022+ valuation lens.
10. **ICONIQ Growth — Topline Growth and Operating Efficiency Report** — Benchmarks on how mid-stage SaaS companies allocate go-to-market resources between new logo and expansion.
11. **Pavilion / Topline (revenue-leadership community) — Sales vs CS Headcount Mix Surveys** — Practitioner data on how revenue orgs configure headcount under different growth strategies.
12. **The SaaStr Annual Surveys (Jason Lemkin)** — Practitioner benchmarks on CAC payback, NRR, and the stage-dependence of the new-logo vs expansion emphasis.
13. **Forrester / SiriusDecisions — Demand vs Customer Marketing Allocation** — Research on marketing budget splits between top-of-funnel demand generation and customer/lifecycle marketing.
14. **Gartner — Tech Go-to-Market and the Land-and-Expand Model** — Analysis of land-and-expand mechanics, including the dependence of expansion on land volume.
15. **CFO.org / public SaaS 10-K analysis** — Disclosed NRR, S&M efficiency, and customer-count data from public SaaS companies illustrating mode-tilt patterns at scale.
16. **Profitwell / Paddle — Retention and Expansion Pricing Research** — Data on expansion via pricing, packaging, seat growth, and consumption models.
17. **First Round Review — Operating-Model and Comp-Design Essays** — Practitioner essays on aligning compensation plans with stated go-to-market strategy.
18. **Battery Ventures — OpenCloud / Cloud Software Benchmarks** — Benchmarks on growth durability and the role of net retention in mature-stage growth.
`;

const num = `

## Numbers

**The Four Diagnostics — Reference Ranges**
- Strong NRR signaling expansion headroom worth chasing: ~115-120%+ paired with under-penetrated accounts
- NRR below 100%: a retention problem to fix BEFORE a mode decision is meaningful
- Healthy new-logo CAC payback (acquisition still has a claim on capital): under ~12-18 months
- Stretched new-logo CAC payback (loud tilt-to-expansion signal): past ~24-30 months
- Typical expansion CAC payback: ~6-9 months — often 2-4x shorter than new-logo payback
- Low ICP penetration (acquisition runway): under ~5-10% of the reachable, winnable market
- High ICP penetration (growth must come from base): ~25-40%+ of the reachable market
- The genuine decision zone on penetration: ~10-25%

**Stage Lens — Approximate ARR Bands**
- Early stage (default: acquisition tilt): roughly under $5-10M ARR
- Growth stage (the real decision zone): roughly $10-50M ARR
- Mature stage (default: expansion tilt): roughly $50M+ ARR
- This entry's audience: $5M-$100M ARR SaaS — spans the growth-stage decision zone

**The Tilt Percentage — How To Express The Mode**
- Expressed as: ___% of MARGINAL go-to-market resources to expansion / ___% to acquisition
- A gentle lean: ~55/45
- A clear tilt: ~65/35
- A hard commitment: ~80/20
- Applies to: the increment (next hires, next budget, next roadmap), NOT the committed base
- Set for: one fiscal year, committed across a multi-year cycle

**The Four Levers To Align**
- Lever 1 — People: new-business AE / SDR mix vs AM / expansion-CSM mix
- Lever 2 — Comp: new-logo bonuses and net-new ARR accelerators vs net-revenue / expansion / retention comp — CHANGE THIS LEVER FIRST
- Lever 3 — Marketing: awareness / demand gen / pipeline vs customer marketing / adoption / lifecycle
- Lever 4 — Product: activation / onboarding / time-to-value / competitive-checklist features vs depth / cross-sell / usage-growth features
- A mode is real only when all 4 levers match the tilt

**Switching Cost — Why You Cannot Whipsaw**
- Full mode-switch reconfiguration time: ~12-18 months before it pays off
- Re-hiring cycle (different roles/skills): ~6-12 months
- Re-comping the revenue org: at least one full comp cycle, with morale/trust cost
- Roadmap re-pointing: ~1-2 quarters before new priorities even start producing
- Cultural muscle rebuild: multi-quarter, not a memo
- Implication: commit the tilt for a multi-year cycle; adjust only modestly year to year

**Review Cadence**
- Scheduled review: annually, at planning — re-run all four diagnostics
- Event trigger 1: a fundraise
- Event trigger 2: a TAM reassessment
- Event trigger 3: a material NRR shift
- Event trigger 4: a significant competitive change

**Mode-Specific Scorecards**
- Acquisition-tilt scorecard: new-logo growth rate, absolute logo count, new-logo CAC payback holding, pipeline coverage and win rate
- Expansion-tilt scorecard: NRR climbing, expansion revenue per account, deepening base penetration (seats / modules / tier mix), gross retention holding
- Critical rule: never judge an expansion tilt by acquisition metrics, or vice versa

**Capital Environment**
- Growth-at-all-costs era (much of the 2010s, peak ~2021): rewarded the acquisition tilt; top-line growth rate the dominant valuation input
- Efficiency era (~2022 onward, including 2026): rewards Rule of 40, NRR, CAC payback, burn multiple, gross margin — structurally favors expansion economics
- 2026 reality: efficiency environment — bar for justifying a heavy acquisition tilt is higher than it was in 2020
`;

const counter = `

## Counter-Case: When Forcing A Binary Mode Decision Is The Wrong Instinct

The entire framework above pushes toward making a deliberate tilt — and for most companies most of the time, that is the right push, because the alternative (the accidental, politics-driven tilt) is worse. But a rigorous executive team should stress-test the framework against the situations where applying it too hard does damage. There are real cases where forcing a mode decision is the wrong instinct.

**Counter 1 — The genuinely balanced company where a hard tilt would break something that's working.** Some companies sit, legitimately, near the middle: the four diagnostics genuinely point in different directions with roughly equal force — wide-open TAM *and* high NRR with real headroom *and* efficient CAC on both motions *and* a base that's substantial but not saturated. For a company in that position, both motions are firing well and both are well-resourced. Forcing a hard tilt — declaring "we're 75% expansion now" — could starve a new-logo motion that is actually working, or vice versa. The right move for a genuinely balanced company is a *gentle* tilt (55/45, even 50/50 held honestly) — and the discipline is to keep watching the diagnostics for the moment one direction starts clearly winning, rather than to manufacture a hard tilt the data doesn't support. The framework still applies — you still read the diagnostics, you still align the levers — but the *output* is "stay balanced, watch closely," and that is a legitimate output, not a failure to decide.

**Counter 2 — When "we're in X mode" becomes dogma that blinds the org.** A tilt is a resource-allocation default, not a religion. The failure mode here is when "we're an expansion company" hardens into identity and the organization stops *seeing* opportunities in the other motion. A genuinely great new-logo opportunity walks in — a perfect-fit segment opening up, a competitor stumbling — and the org reflexively says "that's not what we do this year" and passes on it. Or an acquisition-tilted company ignores a massive, obvious expansion opportunity in a key account because "expansion is CS's problem and we're a sales company." The tilt is supposed to govern the *marginal* dollar as a default — it is not supposed to make the company blind to exceptional opportunities in the non-favored motion. The fix is cultural: hold the tilt as a default, *explicitly* preserve the ability to make exceptions for genuinely exceptional opportunities, and watch for the moment the mode has calcified from "our current allocation strategy" into "our unchangeable identity."

**Counter 3 — When the real problem isn't the mode, it's execution quality in whichever mode they're already in.** This is the most common misdiagnosis the framework can cause. An executive team has weak growth, reaches for the acquisition-vs-expansion framework, and concludes "we must be in the wrong mode — let's switch." But sometimes the mode is *fine* and the *execution* is broken. The acquisition motion is underperforming not because acquisition is the wrong tilt but because the sales process is sloppy, the SDR-to-AE handoff leaks, the messaging is weak, the ICP is fuzzy. The expansion motion is underperforming not because expansion is the wrong tilt but because the CS team has no expansion playbook, no enablement, no tooling, no clear ownership. Switching modes in that situation doesn't fix anything — it just moves the broken execution to the other motion *and* pays the switching cost on top. Before you re-tilt, you have to honestly answer: *is the current mode genuinely the wrong allocation, or are we just bad at running it?* If it's an execution problem, the answer is to *fix the execution*, not switch the mode — and the four diagnostics actually help here, because a mode that *should* be working per the diagnostics but *isn't* working in practice is a strong signal the problem is execution, not allocation.

**Counter 4 — When a company whipsaws so often the switching cost exceeds any benefit.** The switching-cost section warned about this, and it earns a place in the counter-case because it is a real, observed pathology. Some companies — usually ones with reactive leadership, an anxious board, or a habit of chasing whatever the last conference or peer-CEO conversation suggested — change their tilt every year or even every couple of quarters. Acquisition focus this year, expansion focus next year, back again the year after. Each switch costs 12-18 months and real money in re-hiring, re-comping, and roadmap churn. A company that whipsaws never actually *runs* any mode long enough to see whether it works — it lives permanently in transition, paying switching costs continuously and capturing the benefits of none. For a company like this, the most valuable intervention is *not* a better mode decision — it's the *discipline to stop deciding* and commit to *something* for a real multi-year cycle. Sometimes the right answer to "which mode should we be in?" is "you need to pick one and not touch it for three years, and which one matters less than the committing."

**Counter 5 — When the framework's precision creates false confidence.** A subtler counter: the four-diagnostic framework can make the decision *feel* more scientific than it is. The diagnostics involve real judgment — what counts as the "reachable, winnable" ICP, how to estimate true base headroom, how to allocate shared costs into an "expansion CAC" — and reasonable people will compute them differently. The risk is that a team runs the framework, gets a number, and treats the resulting tilt as objectively proven, then defends it rigidly against contradicting evidence because "the diagnostics said so." The framework is a structured way to *reason*, not an oracle. It should *increase* the quality of the debate and the honesty of the inputs — it should not *end* the debate. A team that holds its tilt with appropriate humility, ready to revise when the diagnostics' messy inputs turn out to have been wrong, will outperform a team that treats the framework's output as gospel.

**The honest verdict.** The framework — diagnose, tilt, align, commit, measure, revisit — is the right operating model for the large majority of $5M-$100M ARR companies, because the realistic alternative for most of them is the accidental tilt, and the accidental tilt is genuinely worse: unowned, unmeasured, driven by politics and identity. But the framework should be applied with judgment, not mechanically. A genuinely balanced company should be allowed to *stay* balanced. A tilt should govern the marginal dollar as a default without calcifying into blinding dogma. An execution problem should be fixed as an execution problem, not disguised as a mode problem and "solved" by an expensive switch. A whipsawing company needs commitment discipline more than it needs a better decision. And the framework's diagnostics should sharpen the debate, not end it. Used that way — as a disciplined reasoning structure rather than a rigid binary machine — it is the right operating model. Used mechanically, it can do real damage. The instinct to make a deliberate decision is correct; the instinct to force a *hard binary* decision regardless of what the situation actually supports is not.
`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a RevOps function in 2027? (The function that operationalizes the acquisition-vs-expansion tilt across systems and process.)
- **q9502** — How do you build a RevOps operating model? (The broader operating-model context this mode decision sits inside.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (AI-shifted acquisition economics referenced in the 5-year outlook.)
- **q9510** — How do you design a sales compensation plan that matches your growth strategy? (Deep dive on the comp lever — the one that overrides everything.)
- **q9511** — How do you structure an account management team for expansion? (The people lever under an expansion tilt.)
- **q9512** — How do you turn Customer Success into a revenue center? (The single biggest structural change in an expansion tilt.)
- **q9513** — How do you measure and improve Net Revenue Retention? (Deep dive on the central expansion diagnostic.)
- **q9514** — How do you calculate and benchmark CAC payback period? (Deep dive on the CAC-efficiency diagnostic for both motions.)
- **q9515** — How do you size your real, reachable TAM versus the fantasy TAM? (Deep dive on the market-penetration diagnostic.)
- **q9516** — How do you build a land-and-expand motion? (Why a thin-base land-and-expand company may need more lands, not more expansion.)
- **q9520** — How do you allocate the product roadmap between new-logo features and expansion features? (Deep dive on the product lever.)
- **q9521** — How do you split marketing budget between demand gen and customer marketing? (Deep dive on the marketing lever.)
- **q9522** — How do you run an annual revenue planning process? (Where the mode decision gets made and the tilt percentage gets set.)
- **q9525** — How do you get your board aligned on a growth strategy? (Board-ownership of the mode-specific scorecard.)
- **q9526** — How do you avoid vanity metrics in board reporting? (The vanity-logo pressure problem.)
- **q9529** — How do you know when to expand into a new market segment? (Opening a new acquisition front vs continued acquisition in the original ICP.)
- **q9530** — What is the Rule of 40 and how should it shape strategy? (The capital-environment lens — what 2026 capital rewards.)
- **q9531** — How do you diagnose whether a growth problem is a strategy problem or an execution problem? (Counter-case 3 — the most common misdiagnosis.)
- **q9540** — How do you sequence go-to-market investments by company stage? (The stage lens — early/growth/mature defaults.)
- **q9541** — How do you build a mode-specific revenue scorecard? (Measuring whether the tilt is working.)
- **q9550** — How is AI changing go-to-market economics? (The 5-year outlook — AI shifting both motions' diagnostics.)
`;

const tags = ['revops','operating-model','acquisition-vs-expansion','net-revenue-retention','go-to-market','resource-allocation','saas-growth','cac-payback','sales-comp','customer-success'];

const sources = [
  { title: 'SaaS Capital — Net Revenue Retention Benchmarks', url: 'https://www.saas-capital.com' },
  { title: 'Bessemer Venture Partners — State of the Cloud', url: 'https://www.bvp.com/atlas' },
  { title: 'OpenView Partners — SaaS Benchmarks Report', url: 'https://openviewpartners.com' }
];

const notes = {
  s6: 'Added 18 cited sources: NRR and CAC-payback benchmark providers (SaaS Capital, KeyBanc/OPEXEngine, OpenView, ICONIQ, SaaStr), efficient-growth and capital-environment frameworks (Bessemer, a16z, Battery), expansion-economics research (Bain, McKinsey, Profitwell/Paddle), operating-model and CS-as-revenue-center material (Gainsight, Winning by Design, First Round), headcount-mix and marketing-allocation data (Pavilion, Forrester/SiriusDecisions, Gartner), and public-SaaS disclosure analysis.',
  s7: 'Added comprehensive numerical reference: the four diagnostics with reference ranges (NRR 115-120%+ thresholds, CAC payback 12-18mo healthy / 24-30mo stretched, expansion payback 6-9mo, ICP penetration 5-10% / 25-40% / 10-25% zones), stage-lens ARR bands, the tilt-percentage expression (55/45 lean, 65/35 tilt, 80/20 hard commitment), the four levers with comp flagged as change-first, switching-cost timelines (12-18mo full reconfiguration), review cadence and triggers, mode-specific scorecards, and the capital-environment shift.',
  s8: 'Added 5-element counter-case: the genuinely balanced company where a hard tilt breaks something working; mode-as-dogma blinding the org to opportunities in the non-favored motion; the execution-quality misdiagnosis (the most common framework-induced error — switching modes when the real problem is bad execution of the current mode); the whipsaw pathology where switching cost exceeds any benefit; and the false-confidence risk where the framework feels more scientific than its judgment-heavy inputs actually are. Closes with an honest verdict distinguishing deliberate tilt (right) from forced hard binary (wrong).',
  s9: 'Cross-linked 21 related Pulse entries: RevOps function and operating-model context (q9501/q9502/q9522), the four levers as deep dives (comp q9510, people q9511/q9512, product q9520, marketing q9521), the four diagnostics as deep dives (NRR q9513, CAC q9514, TAM q9515, land-and-expand q9516), the two lenses (stage q9540, capital environment q9530), board alignment (q9525/q9526), the execution-vs-strategy counter-case (q9531), measurement (q9541), and the AI 5-year-outlook context (q1899/q9550).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the acquisition-vs-expansion operating model for $5M-$100M ARR SaaS. CRITICAL framing established in TL;DR and throughout: "acquisition mode" = new-logo acquisition focus, "expansion mode" = existing-account growth focus — explicitly NOT M&A. Two mermaid diagrams: (1) the mode-decision diagnostic flow (four diagnostics to two lenses to tilt percentage to four-lever alignment to mode-specific scorecard to board ownership to revisit cadence); (2) the two operating models side by side (acquisition-tilt org vs expansion-tilt org across people/comp/marketing/product/CS-role, with the misalignment failure called out). Full coverage: the tilt as the decision, the marginal-dollar question, the four core diagnostics (NRR+headroom, CAC efficiency both motions, ICP penetration, base size), expansion and acquisition signal sets, the NRR test, CAC-efficiency test, market-penetration test, stage lens, capital-environment lens, operating-model implications of each tilt, comp-plan consequence, product-roadmap consequence, the declare-one-comp-the-other misalignment, the hybrid reality and tilt percentage, switching cost, review cadence, mode-specific measurement, board and investor alignment, 5 real-world scenarios, the 7-step decision framework, 5-year AI outlook, and final framework blueprint. 5-element counter-case on when forcing a binary is wrong.'
};

runPolish({ id: 'q9528', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
