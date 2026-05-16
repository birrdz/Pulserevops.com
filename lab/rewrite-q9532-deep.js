// q9532 — For a founder-led org running two motions, what's the right compensation and title structure?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** A founder-led company running two GTM motions (self-serve/PLG + sales-led, SMB + enterprise, or new-logo + expansion) should **build two separate compensation plans, not one stretched plan**, because the motions have different deal sizes, cycle lengths, skill profiles, and effort curves — a single plan structurally over-rewards the easier motion and under-rewards the harder one. The non-negotiable design principles: **(1) Separate comp plans per motion**, each calibrated to its own deal economics — OTE, base/variable split, quota, and accelerators all tuned to that motion's reality (more base and longer-dated accelerators for long-cycle enterprise, more variable and faster payout for transactional self-serve/SMB). **(2) Calibrate OTE for cross-motion parity** — the *on-target earnings* of a rep hitting plan in Motion A and a rep hitting plan in Motion B should be roughly equal, even though their quotas, deal counts, and day-to-day look nothing alike; parity in outcomes is what kills the arbitrage. **(3) Engineer against rep arbitrage** — if reps can freely choose or move between motions they flood to whichever pays easier, so use specialized roles reps don't casually switch between, calibrate plans so on-target take-home is fair across both, and make the *harder* motion the promotion path. **(4) Pre-define cross-motion deal credit** — when a self-serve account graduates to enterprise or an SMB deal turns out enterprise-sized, the credit-split and handoff-comp rules must be written *before* the deal happens, not litigated after. **(5) Use parallel title ladders with explicit equivalence** — an "AE" in Motion A and an "AE" in Motion B should be understood as equivalent in seniority and comp band even if their work differs; the alternative is a caste system that corrodes the team. **(6) Keep quotas independent per motion** so one motion's over-performance can't mask the other's collapse. The founder-led wrinkle: the founder usually personally runs one motion (typically the higher-touch enterprise/strategic one) while delegating the other — which means the delegated motion needs *more* structural rigor, not less, because it lacks the founder's gravitational pull. The single biggest failure mode is the **"self-serve isn't real selling" status trap**, where the org culturally treats one motion as lesser and the comp/title structure either fights that or cements it. Counter-case: if the "second motion" is really just a handful of opportunistic deals, a full parallel structure is premature over-engineering — and over-formalizing two ladders can manufacture the very caste system it was meant to prevent.`;

const core = `

## The Core Problem

A founder-led company that has organically grown into running two go-to-market motions almost always discovers the problem the same way: through a comp dispute. A self-serve rep and an enterprise rep compare notes at a company offsite, or two AEs realize they have the same title but wildly different quotas, or a deal that started as a free-trial signup turns into a six-figure contract and three people claim the commission. The founder, who has been running comp out of a spreadsheet and instinct, suddenly realizes the structure that worked when there was one motion and eight reps is actively corroding the team now that there are two motions and thirty.

The core problem has three faces, and they compound each other. The first face is **rep arbitrage**: when one comp-and-title structure spans two motions, reps rationally flood toward whichever motion is easier to earn in. If the self-serve motion has warm inbound leads and a thirty-day cycle, and the enterprise motion has cold pipeline and a nine-month cycle, and both carry the same quota-to-OTE ratio, every rep with a choice will angle toward self-serve. The pipeline for the harder motion starves. The second face is **title confusion**: when the org uses the same titles across both motions without defining equivalence, nobody knows what an "Account Executive" actually means. Is the self-serve AE junior to the enterprise AE? Are they peers? Can one become the other, and is that a promotion or a lateral move? The ambiguity poisons hiring, leveling, and internal mobility. The third face is **inequity corrosion**: reps in one motion come to believe — sometimes correctly, sometimes not — that the other motion has it easier or is paid better. That belief, left unaddressed, metastasizes into a two-tribe culture where the motions resent each other instead of complementing each other.

What makes this specifically hard for founder-led companies is that the founder built the first motion with their own hands and often still runs it personally. The comp structure was never *designed* — it accreted. The titles were never *leveled* — they were handed out. And the founder's instinct, when the second motion appears, is to extend the existing structure rather than build a parallel one, because building a parallel one feels like bureaucracy. That instinct is the trap. The right move is not to stretch one structure over two motions; it is to recognize that two motions are two different economic engines and need two different — but carefully *paired* — compensation and title systems.

## Why One Structure For Two Motions Fails

The reason a single comp-and-title structure cannot serve two motions is not philosophical — it is arithmetic. Two genuine GTM motions differ along at least four axes, and each axis breaks a shared plan.

The first axis is **deal size**. A self-serve or SMB motion might close deals at \\$3,000–\\$15,000 annual contract value. An enterprise motion might close at \\$80,000–\\$400,000. If both reps carry a quota expressed as a multiple of OTE, the enterprise rep needs to close a handful of deals and the SMB rep needs to close dozens — but if the *plan* pays a flat percentage of bookings, the enterprise rep's commission per deal is so large that a single deal can make their quarter, while the SMB rep is grinding. Conversely, if you cap or de-emphasize per-deal commission to protect against enterprise windfalls, you crush the SMB rep's upside on the volume they actually produce.

The second axis is **cycle length**. A thirty-day self-serve cycle and a nine-month enterprise cycle cannot share an accelerator structure. Accelerators that kick in after 100% of quota reward consistent quarterly performance — which is achievable in a short-cycle motion and nearly impossible in a long-cycle one, where a rep might book nothing for two quarters and then land three deals in the third. A shared plan either punishes the enterprise rep for the lumpiness inherent to their motion or over-rewards the self-serve rep for consistency that their motion makes trivial.

The third axis is **skill requirement**. The two motions demand genuinely different competencies. Self-serve and SMB selling rewards velocity, efficient qualification, light-touch demos, and high activity volume. Enterprise selling rewards multi-threading, executive navigation, procurement and security-review management, and patience. These are not the same job, and a single title ladder that treats them as the same job will mislevel people constantly — promoting a great volume seller into an enterprise role they will fail at, or capping a brilliant enterprise closer because the ladder was calibrated on deal *count* rather than deal *complexity*.

The fourth axis is **effort profile**. The shape of the work differs. A transactional motion is a steady cadence — many small efforts, frequent closes, fast feedback. A strategic motion is a marathon — sustained effort against a small number of large targets, with long stretches of no closes. A single plan, especially a single *base/variable split*, cannot be right for both. The transactional rep can tolerate — and is motivated by — a high-variable, low-base split because feedback is fast and a bad month is recoverable. The enterprise rep needs a higher base because a bad quarter is structural, not personal, and asking them to live on thin base through a nine-month cycle either bankrupts them or pushes them to discount recklessly to force closes. One base/variable split cannot serve both effort profiles, and so one plan cannot serve both motions.

## The Two Motions Defined

Before designing anything, the founder has to name the two motions precisely, because the comp-and-title answer differs by *which* pairing the company is running. There are four common pairings, and they are not interchangeable.

**Self-serve/PLG plus sales-led.** The company has a product-led motion where users sign up, activate, and often pay without ever talking to a human — and alongside it a sales-led motion where reps work larger or more complex deals, sometimes sourced from the self-serve base, sometimes net-new. The defining tension here is that the self-serve motion's "reps" might not be reps at all in the traditional sense — they might be growth marketers, lifecycle owners, or a sales-assist team that nudges high-intent self-serve users. The comp question becomes whether the self-serve side is even on a quota-carrying plan or on a different incentive model entirely.

**SMB plus enterprise.** Both motions are sales-led, but they serve different customer segments with different deal sizes and cycles. This is the most common two-motion pairing and the one where the caste-system risk is highest, because both sides are unambiguously "sales" and the only difference is the size of customer — which makes it dangerously easy for the org to rank them.

**New-logo plus expansion.** One motion acquires new customers; the other grows existing ones. The reps might be called AEs and Account Managers, or hunters and farmers. The tension is that expansion is often *easier* revenue (lower CAC, warmer relationship, faster cycle) but is culturally treated as lesser — and the comp structure frequently underpays expansion relative to its actual difficulty and value, or overpays it relative to the effort, depending on the company.

**Inbound plus outbound.** Both motions close similar deals, but one works warm demand and the other manufactures cold demand. The arbitrage risk here is the most acute of all four, because the reps are doing nearly the same job — the only difference is lead source — and if inbound reps and outbound reps share a plan, every rep wants the inbound seat.

The comp and title structure must be designed around the specific pairing. A self-serve-plus-sales-led company might not even put the self-serve side on a sales comp plan. An SMB-plus-enterprise company needs aggressive title-equivalence work. A new-logo-plus-expansion company needs to consciously price the difficulty of expansion correctly. An inbound-plus-outbound company needs the strongest anti-arbitrage role separation of all. Naming the pairing is step one and it is not optional.

## Comp Principle 1 — Separate Plans, Not One Plan

The foundational principle is that each motion gets its own compensation plan, fully calibrated to its own deal economics. This is not two slightly different versions of one plan — it is two plans designed from the ground up around two different economic realities.

Each plan independently sets its own OTE, its own base/variable split, its own quota, its own accelerator curve, its own deal-credit rules, and its own clawback and ramp provisions. The self-serve/SMB plan is built around velocity and volume: a quota expressed in number of deals or in revenue achievable through high activity, a base/variable split weighted toward variable because feedback is fast, accelerators that reward consistent over-attainment, and a ramp measured in weeks. The enterprise plan is built around magnitude and patience: a quota expressed in a small number of large deals, a base/variable split weighted toward base because the cycle is long, accelerators that reward the lumpy reality of big-deal closing, and a ramp measured in two or three quarters.

The objection founders raise is fairness — "if we have two plans, won't reps think one is better?" The answer is that two *honestly different* plans, each correct for its motion, is far fairer than one plan that is secretly wrong for both. The single-plan approach *feels* fair because it is uniform, but uniformity is not fairness when the underlying jobs are different. A plan that is identical for a thirty-day-cycle rep and a nine-month-cycle rep is not treating them equally; it is treating two different things as the same thing, which is the definition of inequity. Separate plans, designed with intention and paired carefully, are the honest answer. The fairness work does not happen by making the plans the same — it happens by calibrating the plans so the *outcomes* are fair, which is Principle 2.

The mechanics of separate plans also need separate *ownership*. RevOps builds and maintains both plans, but each plan should have a clear DRI — often the first-line manager of that motion — who owns the calibration and the quarterly review. The two plans are reviewed together, by the comp committee, precisely so the cross-motion parity check (Principle 2) can happen. Separate plans, jointly governed.

## Comp Principle 2 — Calibrate OTE To Motion Economics

Once each motion has its own plan, the central calibration question is OTE — and OTE has to be set two ways at once. First, each motion's OTE has to be *economically correct for that motion*: it has to be a number the unit economics can actually support given that motion's CAC, gross margin, and deal contribution. Second, the two OTEs have to be *calibrated against each other for cross-motion parity*: a rep who hits 100% of plan in Motion A and a rep who hits 100% of plan in Motion B should take home roughly the same money.

These two requirements are in tension and resolving the tension is the core of the design. The enterprise rep's OTE reflects long cycles and big deals — their quota is a small number of large contracts, and their OTE is high in absolute terms but expressed against a quota that might be 3–5x OTE because per-deal margin is large. The self-serve/SMB rep's OTE reflects velocity and volume — their quota is a large number of small deals, their OTE is lower in absolute terms but their quota-to-OTE ratio might be 4–6x because the motion is more efficient. The base/variable split differs too: the long-cycle enterprise rep gets a richer base (often 50/50 or even 60/40 base-heavy) so they can survive the cycle without discounting recklessly; the transactional rep gets a more aggressive variable split (often 60/40 or 70/30 variable-heavy) because fast feedback makes high variable both tolerable and motivating.

The parity check is the discipline that holds it together. After both plans are drafted, the comp committee models: a rep at 80%, 100%, and 120% of plan in each motion — what do they actually earn? If the enterprise rep at 100% earns meaningfully more than the SMB rep at 100%, the org has just told every SMB rep that enterprise is where the money is, and the arbitrage begins. If the SMB rep at 120% earns more than the enterprise rep at 120%, the same thing happens in reverse. The goal is not identical numbers — motions differ, and a small premium for the genuinely harder motion can be intentional and healthy — but the on-target outcomes have to be close enough that no rep looks across the aisle and sees a structurally better deal. OTE parity at on-target attainment is the single most important number in the entire two-motion comp design.

## Comp Principle 3 — Prevent The Arbitrage

Rep arbitrage is the killer problem of two-motion comp, and it deserves its own principle because OTE parity alone does not fully solve it. Even with parity at on-target attainment, if one motion is *easier to hit plan in* — warmer leads, shorter cycle, less competition — reps will still angle toward it, because the *probability* of hitting plan differs even when the *reward* for hitting plan is equal. Three mechanisms, used together, prevent the arbitrage.

The first mechanism is **specialized roles that reps do not freely switch between**. If the company treats self-serve selling and enterprise selling as two specializations — with different hiring profiles, different onboarding, different skill development — then moving between them is a deliberate career decision, not a quarterly seat-swap. Reps are hired *into* a motion. Movement between motions is possible (Principle on growth paths handles this) but it is a structured transition, not a free choice a rep makes to chase easier money. The moment reps can fluidly self-select their motion each quarter, arbitrage is unstoppable; the moment motions are genuine specializations, arbitrage becomes a non-issue for the bulk of the team.

The second mechanism is **calibrating each plan so on-target earnings are genuinely fair** — Principle 2's parity check, enforced. This removes the *reward* side of the arbitrage incentive. If a rep cannot earn more by being in the other motion, half the pull disappears.

The third mechanism is **making the harder motion the promotion path**. This is the most elegant fix. If enterprise is the harder motion, then becoming an enterprise rep is a *promotion* — it carries a higher title, a higher OTE band, and prestige. Now the incentive gradient runs the right way: reps *want* to earn their way into the harder motion, rather than fleeing toward the easier one. The harder motion becomes aspirational instead of avoided. This requires that the title ladder actually be designed so the harder motion sits higher (or at least is reachable as an upward move), which is why the title structure and the comp structure cannot be designed separately — they are one system. When the promotion path points toward the harder motion, the arbitrage doesn't just get suppressed; it gets *inverted* into a healthy ambition.

A fourth, lighter mechanism worth noting: **transparent communication about why the plans differ**. Reps tolerate difference; they do not tolerate difference they suspect is arbitrary or unfair. When leadership openly explains "the enterprise plan has a higher base because the cycle is nine months — here is the math; the SMB plan has a higher accelerator because the motion rewards volume — here is that math," reps can see that neither plan is a better deal, just a different one calibrated to a different reality. Opacity breeds the suspicion that fuels arbitrage; transparency defuses it.

## Comp Principle 4 — Handle The Cross-Motion Deal

The deal that spans both motions is where two-motion comp structures break in practice, and it has to be designed *before* it happens. The two canonical cases: a self-serve or SMB account grows until it warrants the enterprise motion, or an SMB-sized deal turns out, mid-cycle, to be enterprise-sized.

The first design decision is **credit rules for graduation**. When a self-serve account that a growth team nurtured graduates into an enterprise deal closed by an enterprise rep, who gets credit? The wrong answer is "whoever happens to be touching it when it closes," because that produces a land grab. The right answer is a written rule: typically the originating motion gets a defined finder's credit or a partial booking credit, and the closing motion gets the bulk of the credit for the work of actually landing the enterprise contract. The split percentages matter less than the fact that they are *written down and known in advance*. A 20/80 or 25/75 origination/close split is common; the exact number should reflect how much of the value each motion genuinely created.

The second design decision is **handoff comp mechanics**. When a deal crosses motions mid-cycle — an SMB rep working an account that reveals itself as enterprise-sized — there has to be a handoff rule. Either the SMB rep keeps the deal (with enterprise support) and is paid on their plan, or the deal transfers to an enterprise rep and the SMB rep gets a defined handoff credit for the qualification and origination work. Both are valid; what is not valid is leaving it undefined, because undefined handoffs produce the single most poisonous dynamic in two-motion orgs: the "who gets paid" fight. That fight does not just cost the company a clean comp outcome — it teaches reps that *holding onto deals* and *fighting over credit* is rewarded, which is the opposite of the collaborative cross-motion behavior the company needs.

The third design decision is **the anti-hoarding provision**. If SMB reps learn that a deal which graduates to enterprise is taken away from them with no credit, they will hide or slow-walk accounts that should graduate, keeping them small to keep the commission. The credit rules must make graduating an account *worth it* for the originating rep — a real, non-trivial finder's credit — so that the rep's incentive is aligned with the company's interest in moving accounts to the motion that serves them best. Cross-motion deal credit is not an edge case to handle later; it is a core part of the plan, and getting it wrong silently corrupts pipeline behavior across both motions.

## The Title Structure Question

The title question is whether the two motions share one title ladder or have separate ones — and it is genuinely a real decision with real tradeoffs, not a formality.

A **single shared ladder with motion as a specialization** means there is one "Account Executive" level, one "Senior Account Executive" level, one "Principal" level, and a rep's motion is an attribute, not a separate track — an "AE, SMB" and an "AE, Enterprise" are the same level. The advantage is that equivalence is built in by construction: nobody can argue an SMB AE is junior to an enterprise AE because they are literally the same title and level. The disadvantage is that it can paper over real differences in scope and comp band, and it makes it awkward when the motions genuinely need different leveling criteria.

**Parallel ladders with explicit equivalence** means each motion has its own ladder — an SMB ladder and an enterprise ladder — but the levels are explicitly mapped to each other: SMB AE II is defined as equivalent in seniority and comp band to Enterprise AE I, or whatever the honest mapping is. The advantage is that each ladder can have leveling criteria that fit its motion while equivalence is still preserved by an explicit, published mapping. The disadvantage is that the equivalence is a deliberate act of communication that has to be maintained — if leadership stops reinforcing it, the parallel ladders drift into a hierarchy.

The recommendation for most founder-led two-motion companies is **parallel ladders with clear, published equivalence** — or the single ladder with motion as a specialization if the company is small enough that two ladders is overkill. The parallel-ladder approach wins for most companies past roughly thirty reps because the motions' leveling criteria genuinely differ (you cannot level an enterprise rep on deal count or a volume rep on deal complexity), and the explicit equivalence mapping does the fairness work. But the equivalence mapping is load-bearing: it must be written, published internally, referenced in every leveling conversation, and defended by leadership relentlessly. Parallel ladders without enforced equivalence become a caste system within a year.

## Title Principle — Equivalence And Parity

Whatever structure the company chooses, the governing principle is that an "AE" in Motion A and an "AE" in Motion B must be understood as *equivalent in seniority and comp band*, even though their day-to-day work differs. This is the principle that prevents the caste system, and it has to be defended actively because the org's natural gravity pulls against it.

The natural gravity is this: enterprise deals are bigger, enterprise logos are more impressive, enterprise reps present at the board meeting, and so the org *drifts* toward treating enterprise as senior and SMB/self-serve as junior. Left alone, that drift becomes structure: the enterprise AE is "the real AE" and the SMB AE is "the AE you become a real AE from." Once that becomes the unspoken consensus, the SMB motion cannot retain its best people, the SMB pipeline degrades, and the company has hollowed out one of its two engines.

Equivalence is defended through concrete acts. The comp bands for equivalent levels across motions must genuinely overlap — an SMB AE and an enterprise AE at the same mapped level have the same OTE band, even if the *composition* of that OTE differs. The leveling rubrics, while motion-specific in criteria, must be calibrated to the same bar of seniority — "Senior" means the same degree of mastery in both motions, just mastery of different things. Promotions in both motions go through the same committee with the same rigor. Public recognition — the deal-of-the-quarter, the spotlight in the all-hands — must come from both motions, not just enterprise. And leadership language matters: when the founder or CRO refers to "the sales team," they have to visibly mean both motions, every time. Equivalence is not a policy you write once; it is a posture you hold continuously, because the moment you stop holding it, the caste system reasserts itself by default.

## Title Principle — The Growth Path Across Motions

A great SMB rep should be able to become an enterprise rep — but the company has to decide, deliberately, whether that move is a promotion, a lateral, or a different track entirely, and then design the ladder so both motions have real upward paths regardless of the answer.

If the company has decided enterprise is the harder motion and made it the promotion path (Principle 3), then SMB-to-enterprise is an *upward* move — a promotion — and the ladder should reflect that. But this creates a danger: if the *only* way up for an SMB rep is to leave for enterprise, then the SMB motion has no senior roles, no career, and becomes a pure feeder — which guts SMB retention and tells SMB reps their motion is a waystation. So even when enterprise is the promotion path, the SMB ladder must have its own genuine senior rungs: a Senior SMB AE, a Principal SMB AE, an SMB team lead — real, well-compensated destinations for a rep who is excellent at the SMB motion and wants to stay. The growth path across motions must exist *and* the growth path within each motion must exist. A rep should be able to look at the SMB ladder and see a twenty-year career, while *also* being able to see a door into enterprise if that is what they want.

The cross-motion move itself should be structured, not casual. A rep moving from SMB to enterprise gets a ramp, a mentor, a reset quota for the transition period, and explicit acknowledgment that the first few quarters in the new motion are a development investment. Treating the move as "same job, bigger deals" sets the rep up to fail and teaches the org that cross-motion moves don't work — which then ossifies the two motions into separate, non-communicating silos. Done well, the cross-motion path is what keeps the two motions feeling like one company with one career architecture rather than two tribes. And critically: the path should run *both* ways where it makes sense — an enterprise rep who wants the faster feedback and higher activity of the SMB motion, or who is better suited to it, should be able to move without it being treated as a demotion. Motions are specializations, not a hierarchy, and the growth-path design is where that principle either becomes real or becomes hollow.

## The "Self-Serve Isn't Real Selling" Status Trap

The single most dangerous cultural landmine in a two-motion org is the belief — usually unspoken, often held by people who would deny holding it — that one motion is "real selling" and the other is not. In a self-serve-plus-sales-led company it shows up as "the self-serve team just watches a dashboard." In an SMB-plus-enterprise company it shows up as "anyone can close a fifteen-thousand-dollar deal." In a new-logo-plus-expansion company it shows up as "expansion is just account management, not sales." The specific form varies; the corrosive effect is identical.

The status trap matters because the comp and title structure either fights it or cements it, and neutrality is not an option — a structure that does not actively fight the trap will, by default, reinforce it. If the enterprise titles are grander, if the enterprise OTE bands are visibly higher with no parity logic explained, if the all-hands recognition skews enterprise, if the founder spends visible time with the enterprise motion and delegates the other — the structure is *telling* the company that one motion is lesser, regardless of what the values deck says.

Fighting the trap requires the structure to make both motions visibly respected. Title equivalence, enforced. OTE parity at on-target attainment, modeled and communicated. Recognition from both motions in equal measure. Leveling rigor applied equally. And the founder's own attention and language consciously balanced. It also requires naming the trap explicitly — leadership saying, out loud and repeatedly, "the self-serve motion drives X% of revenue at Y% of the CAC; it is not the minor leagues, it is half of how this company wins." The status trap is not defeated by a policy; it is defeated by a structure that consistently encodes equivalence and by leaders who refuse to let the org's natural status-gravity go unchallenged. A founder-led company that gets the comp math right but loses the status battle will still end up with a hollowed-out second motion — because reps go where the respect is, not just where the money is.

## The Manager & Leadership Layer

The two motions almost always need separate first-line management, and this is one of the few near-universal answers in two-motion design. The reason is that first-line managers coach the specific motion — they are deep in the deal mechanics, the cycle rhythm, the skill development of that motion — and a manager cannot be deep in both a thirty-day transactional cadence and a nine-month enterprise cadence at once. An SMB sales manager and an enterprise sales manager are genuinely different jobs, and the company should hire and develop them as such.

Above first-line, the structure converges. The CRO (or the founder acting as de facto CRO) oversees both motions — and the CRO's job is precisely the cross-motion work: enforcing OTE parity, defending title equivalence, adjudicating cross-motion deal disputes, and holding the two motions as one revenue organization. If the two motions report up through entirely separate leadership all the way to the founder, with no shared revenue leader, the parity and equivalence work has no owner and the motions drift into silos. There is one revenue org; it has two motions; it has a single leader at the top of the revenue function whose explicit mandate includes the cross-motion governance.

The title structure for the leadership of each motion should itself reflect equivalence: the SMB sales leader and the enterprise sales leader are peers, at the same level, in the same comp band — not "the enterprise leader and their junior counterpart." If the leadership layer encodes a hierarchy between the motions, every rep sees it, and the caste system is confirmed from the top. The manager and leadership layer is where two-motion equivalence is either institutionalized or quietly abandoned.

## The Founder's Place In This

The founder-led wrinkle reshapes the whole design. In most founder-led two-motion companies, the founder personally runs one motion — almost always the higher-touch one, typically enterprise or strategic deals — while the other motion is delegated to a manager or an early sales leader. This is natural: the founder built the first relationships, carries the strategic deals, and is the best enterprise seller in the company. But it has structural consequences that the comp and title design has to account for.

The first consequence is that **the delegated motion needs more structural rigor, not less**. The founder-run motion has the founder's gravitational pull — the founder's attention, the founder's involvement in deals, the founder's implicit prestige. The delegated motion has none of that, so it has to make up the difference with *structure*: a genuinely well-designed comp plan, a clear title ladder, a strong first-line manager, visible recognition. Founders often do the opposite — they pour design energy into the motion they personally run and leave the delegated motion under-structured because they are not in it daily. That is backwards. The motion the founder is *not* in is the one that most needs the structure to be excellent, because structure is the only thing substituting for the founder's presence.

The second consequence is that **the founder's involvement distorts the founder-run motion's comp and credit**. If the founder personally sources and closes enterprise deals, the enterprise reps' quotas, pipeline, and credit have to account for that — does the founder carry a notional quota, do founder-sourced deals get assigned to reps, how is credit handled when the founder co-sells. Leaving this informal means enterprise reps either get credit for deals they did not really drive (inflating the appearance of the motion) or get nothing for deals they assisted the founder on (demoralizing them). The founder's selling activity has to be formalized into the comp structure, awkward as that feels.

The third consequence is **succession and the eventual handoff**. The founder cannot run a motion forever. The title and comp structure of the founder-run motion should be designed so that a real sales leader can eventually own it — which means the motion needs a defined leadership role *below* the founder even while the founder is still running it, so there is a seat for the eventual successor to grow into. A founder-run motion with no leadership structure beneath the founder is a motion that collapses the day the founder steps back. The founder's place in the two-motion structure is real and should be designed for explicitly — including designing for the founder's eventual exit from the day-to-day.

## Quota Construction Per Motion

Quota math differs fundamentally between the two motions, and the construction has to be done independently for each. An enterprise quota is built from the bottom up on a small number of large deals: expected deal size, expected win rate, expected cycle length, and the resulting number of deals a rep can realistically work and close in a year — then the quota is that deal count times average deal size, with a coverage ratio applied. A self-serve/SMB quota is built on volume: deals per month a rep can process given lead flow and cycle length, times average deal size, annualized. These are different calculations producing quotas that are not comparable as raw numbers — an enterprise quota of \\$1.2M and an SMB quota of \\$600K do not mean the SMB rep is "half as good"; they mean the motions have different unit economics.

The crucial discipline is **keeping each motion's quota independent so one motion's performance cannot mask the other's**. If the company sets a single blended revenue target and lets the two motions collectively chase it, a strong quarter in one motion hides a collapsing quarter in the other, and leadership loses the signal it needs to manage each motion. Each motion carries its own quota, its own attainment reporting, its own pipeline coverage analysis. The company should be able to look at a dashboard and see SMB motion at 94% of plan and enterprise motion at 71% of plan as two separate, clearly visible numbers — because those two numbers demand two completely different management responses. Blended quota reporting is one of the most common and most damaging mistakes in two-motion orgs: it feels simpler, and it destroys the diagnostic clarity that running two motions requires.

Quota construction also has to be re-calibrated at different cadences per motion. A self-serve/SMB quota can be reviewed and adjusted quarterly because the motion's data refreshes fast. An enterprise quota should be reviewed less frequently — annually or semi-annually — because the long cycle means a quarter of data is too noisy to act on. Forcing both motions onto the same quota-review cadence either starves the fast motion of needed adjustments or whipsaws the slow motion on noise.

## The Comp Cost Modeling

Underneath the rep-facing plans is the finance question: what does the total comp structure *cost*, per motion and in aggregate, and is each motion's plan economically sound. This modeling is RevOps and finance work, and it is where a plan that looks fine to reps can turn out to be upside-down on unit economics.

The core metric is **cost of sale per motion** — total compensation cost (base plus variable plus the loaded cost of management and the leadership layer attributed to that motion) divided by the revenue that motion produces. The two motions will have genuinely different cost-of-sale ratios, and that is fine — an enterprise motion typically has a higher cost of sale than a self-serve motion, which is part of why the self-serve motion is valuable. What is *not* fine is a motion whose comp plan makes its cost of sale exceed what the motion's gross margin and deal economics can support. A self-serve plan with accelerators rich enough that top reps earn far more than the motion's contribution margin supports is an upside-down plan, no matter how motivating it feels. An enterprise plan with a base so high and a quota so soft that the motion loses money on every fully-ramped rep is upside-down too.

The modeling has to be done at multiple attainment levels — not just at 100% of plan, but at the 60th, 80th, 100th, and 120th percentile of the rep distribution — because the accelerators mean the cost structure is non-linear. A plan can look healthy at on-target attainment and be ruinous if the team over-performs, or can be fine on average but lose money on every rep who under-performs because the base is too high relative to the floor of production. Finance models the full distribution for each motion and validates that the motion is economically sound across the realistic range of outcomes.

The aggregate view matters too: the blended cost of sale across both motions has to fit the company's overall GTM efficiency targets — the metric the board cares about. A company can run a high-cost enterprise motion *because* it also runs an efficient self-serve motion that pulls the blended number down. The two motions' comp costs are managed as a portfolio, and the comp cost modeling is what gives the founder and CFO the visibility to manage that portfolio rather than discover, a year too late, that one motion's plan was quietly destroying the unit economics.

## The Equity Component

Equity is part of total compensation and it interacts with the two-motion structure in ways cash comp does not. The first question is whether equity grants differ across the two motions' roles. The defensible default is that **equity grants follow level, not motion** — an SMB AE and an enterprise AE at equivalent mapped levels get equivalent equity bands, because equity is a function of seniority and contribution-to-the-company, not of which motion the contribution happens in. Granting systematically more equity to enterprise roles than to equivalent-level SMB roles is another vector by which the caste system gets encoded — it just shows up on a slower timeline than cash.

There are legitimate reasons equity *composition* might differ slightly. Long-cycle enterprise roles sometimes get marginally larger equity grants as a retention mechanism, because the long cycle means a rep's biggest deals might be in flight when they hit a vesting cliff, and the company wants them to stay through the close. But this should be a small, explicitly-reasoned adjustment, not a systematic gap — and it should be framed and communicated as a retention mechanism tied to cycle length, not as a statement about the relative value of the motions.

The retention implications of equity also differ by motion. In a fast transactional motion, equity is a long-term anchor against a job where the cash feedback is fast and a competitor's offer is always tempting. In a long-cycle enterprise motion, equity vesting cadence should be considered against deal-cycle cadence so the company is not creating cliff-edge flight risk right when a rep's pipeline is about to convert. RevOps and the head of people should model the equity component per motion the same way finance models the cash comp per motion — as two related but distinct retention systems that together have to keep both engines staffed with their best people.

## Avoiding The Inequity Corrosion

The morale killer in a two-motion org is the slow corrosion that happens when reps in one motion come to believe the other motion has it easier or is paid better. It is worth treating this as its own design concern because it can quietly destroy a structure that is, on paper, correct.

The corrosion is fed by opacity and by uneven outcomes. Opacity: if reps do not understand *why* the two plans differ, they fill the vacuum with the worst assumption — that the difference is favoritism. Uneven outcomes: if, quarter after quarter, one motion's reps are visibly clearing their numbers while the other's are grinding, the grinding motion concludes the deck is stacked, whether or not it actually is.

Three practices fight the corrosion. The first is **transparency about why the plans differ**: leadership openly walks the whole revenue org through the logic — here is why enterprise has a higher base, here is why SMB has a steeper accelerator, here is the parity math that makes them fair. Reps who see the reasoning extend trust; reps left to guess extend suspicion. The second is the **on-target-earnings parity check, made visible**: not just done by the comp committee in private, but communicated — "a rep at plan in either motion earns within this band of each other, here is the model." When reps can see that the structure was *designed* for parity, the belief that the other motion is a better deal loses its grip. The third is a **periodic fairness audit**: RevOps and the head of people review actual realized earnings across both motions, look for unexplained divergence, and either fix the plan or explain the divergence. If enterprise reps earned 30% more than SMB reps last year, that is either a calibration error to fix or a fact with a reason that needs to be communicated — it cannot just sit there unexamined, because unexamined divergence is exactly the fuel the corrosion runs on.

The corrosion is insidious because it is slow and because it is about *perception* as much as reality — a structure can be genuinely fair and still corrode the team if the fairness is invisible. The defense is to make the fairness legible: show the math, run the audits, name the logic, and never let the question "is the other motion a better deal?" go unanswered.

## The RevOps & Finance Role

Two-motion comp and title structure has clear functional owners, and naming them prevents the structure from becoming an orphan that nobody maintains.

**RevOps owns the plan mechanics and the deal-tagging.** RevOps builds both comp plans, maintains the quota models, runs the attainment reporting per motion, and — critically — owns the *deal-tagging discipline* that keeps the two motions' numbers clean. Every deal has to be unambiguously attributed to a motion, because the entire two-motion structure depends on being able to see each motion's performance, cost, and pipeline separately. If deals are mistagged or untagged, the per-motion reporting blurs, the parity checks become impossible, and the structure loses its diagnostic power. The deal-tagging taxonomy — what makes a deal SMB versus enterprise, how a graduated deal is tagged, how a cross-motion deal is split in the system — is RevOps infrastructure that has to be built deliberately and enforced continuously.

**Finance validates the cost modeling.** Finance owns the cost-of-sale analysis per motion, the multi-attainment-level modeling, and the validation that each motion's plan is economically sound and that the blended structure fits the company's GTM efficiency targets. Finance is the check that prevents a motivating-but-upside-down plan from shipping.

**The comp committee governs the cross-motion decisions.** Plan design, OTE parity calibration, title-equivalence mapping, cross-motion deal-credit rules, and the annual fairness audit are decisions that should not be made by one person in a spreadsheet — they are made by a comp committee that typically includes the CRO or founder, the head of people, finance, and RevOps. The committee is what holds the two motions as one coherent system; it is the forum where the parity check actually gets enforced and where cross-motion disputes get adjudicated against principle rather than politics. For a founder-led company, formalizing even a lightweight comp committee is one of the highest-leverage moves in the whole transition — it takes comp out of the founder's gut and into a governed process, which is exactly what running two motions requires.

## The Evolution As The Org Scales

The two-motion comp and title structure is not a fixed thing — it evolves through predictable stages as the company scales, and trying to skip stages is as much a mistake as failing to evolve at all.

**Early stage:** the company has two nascent motions and a tiny team. At this stage, *one structure stretched across both motions is often the right call* — not because it is ideal, but because the second motion is too small and too unproven to justify a fully separate comp-and-title system, and the overhead of building one would exceed the benefit. The founder runs comp from a spreadsheet, both motions share a rough plan, and that is acceptable. The mistake at this stage is *premature* formalization — building elaborate parallel ladders for a second motion that is six deals and one rep.

**Growth stage:** the second motion has proven itself, the team is scaling past roughly twenty or thirty reps, and the single stretched structure has started actively corroding the team — the arbitrage is visible, the title confusion is real, the comp disputes are happening. This is the stage where the company splits into proper separate structures: two comp plans, parallel title ladders with equivalence, a comp committee, RevOps-owned deal-tagging. This is the transition this entire entry is about, and the signal that it is time is precisely the appearance of the core problems — when you see the arbitrage and the title confusion, the stretched structure has outlived its usefulness.

**Mature stage:** the company has fully specialized ladders, mature per-motion comp plans, robust cross-motion governance — and often, by now, *more than two motions*. The original two-motion structure becomes a template that gets extended: a third motion (a partner/channel motion, a third segment, a renewals motion) gets its own plan and its own ladder rung within the same equivalence framework. The mature-stage discipline is keeping the now-multiple structures coherent — the parity checks and equivalence mappings now span three or four motions instead of two — without letting the whole thing collapse into either one bland uniform plan or a dozen un-governed bespoke ones.

The evolution mistake cuts both ways: founders who formalize too early build bureaucracy around an unproven second motion, and founders who formalize too late let the stretched structure corrode the team for a year longer than it should have. Reading the stage correctly — and specifically recognizing the growth-stage signal — is the meta-skill.

## Board & Leadership Framing

When the founder presents the two-motion comp and title structure to the board or to the broader leadership team, the framing has to do three jobs: justify the cost, explain the fairness logic, and make the anti-arbitrage design legible.

**Justify the cost.** The board will see two comp plans and two cost-of-sale numbers, and the enterprise motion's cost of sale will be higher. The framing has to preempt the "why is enterprise so expensive" question by presenting the *blended* GTM efficiency and showing that the two motions function as a portfolio — the efficient self-serve motion is part of *why* the company can afford a high-touch enterprise motion, and the enterprise motion is part of *why* the company can land the large logos that make the self-serve motion's expansion ceiling so high. The two motions are presented as a deliberate portfolio with a deliberate blended economics, not as one good motion and one expensive one.

**Explain the fairness logic.** The board and leadership should understand the OTE-parity principle and the title-equivalence principle, because these are the things that prevent the second motion from hollowing out — and a hollowed-out motion is a board-level risk. Framing the parity work as *retention and pipeline-durability insurance* puts it in terms the board cares about.

**Make the anti-arbitrage design legible.** The board should understand, at a high level, that the structure is deliberately engineered so reps cannot game their way into the easier motion — specialized roles, parity calibration, and the harder motion as the promotion path. This matters because a board that does not understand the anti-arbitrage design will, at some point, push a well-meaning but destructive simplification ("why not just one plan?"), and the founder needs the board to have already internalized why the two-motion structure is intentional. The board framing is not a reporting formality; it is how the founder builds the organizational backing to *hold* the structure against the constant pressure to collapse it back into something simpler and worse.

## 5 Real-World Scenarios

**Scenario 1 — The PLG company where reps flood the easy motion.** A product-led company adds a sales-led motion to work larger deals, and puts both the sales-assist team (working warm self-serve signups) and the new sales-led AEs on variants of the same plan with the same quota-to-OTE ratio. Within two quarters, every rep is angling for sales-assist seats — the leads are warm, the cycle is short, the quota is identical, so it is simply easier money. The sales-led pipeline starves. The fix: separate plans, OTE parity at on-target attainment so the *reward* is equalized, specialized roles so reps cannot freely seat-swap, and a redesign that makes the sales-led motion the promotion path so reps aspire *toward* it instead of fleeing it.

**Scenario 2 — The SMB-plus-enterprise org with a caste-system title problem.** A company has SMB and enterprise motions, both called "Account Executive," with no defined equivalence. Over eighteen months, an unspoken consensus forms that the enterprise AE is "the real AE." The best SMB reps either leave or push hard for enterprise transfers regardless of fit; SMB retention craters; the SMB pipeline degrades. The fix: parallel ladders with a published equivalence mapping, overlapping comp bands for equivalent levels, genuine senior rungs *within* the SMB ladder, equal recognition at the all-hands, and leadership relentlessly defending the equivalence in language and in leveling decisions.

**Scenario 3 — The cross-motion deal credit fight.** A self-serve account that a growth team nurtured for a year graduates into a \\$200,000 enterprise deal. The growth team, the enterprise AE who closed it, and the enterprise AE's manager all believe they own the credit. The dispute escalates to the founder, consumes weeks, and poisons the relationship between the two motions. The fix, which should have been in place *before* the deal: a written cross-motion credit rule — a defined origination credit to the growth motion, the bulk of the booking credit to the closing motion — known to everyone in advance, so the deal is a clean collaboration instead of a land grab.

**Scenario 4 — The founder running enterprise while SMB is delegated.** A founder personally runs the enterprise motion — sourcing, co-selling, carrying the strategic relationships — while the SMB motion is delegated to a sales manager. The founder pours design attention into the enterprise comp plan and titles, and leaves the SMB structure rough. The SMB motion, lacking both the founder's presence *and* good structure, underperforms and loses people. The fix: recognize that the *delegated* motion needs more structural rigor precisely because it lacks the founder's gravitational pull — invest the comp-and-title design energy into the motion the founder is *not* in, and formalize the founder's selling activity into the enterprise motion's credit and quota mechanics.

**Scenario 5 — The single plan that over-rewarded the easy motion.** A company ran one comp plan across an inbound motion and an outbound motion. The plan paid a flat percentage of bookings. Inbound reps, working warm demand, cleared quota easily and earned large accelerators; outbound reps, manufacturing cold demand, ground against the same plan and rarely reached the accelerator tier. The plan was, in effect, a massive bonus for having the inbound seat. Top outbound talent left. The fix: separate plans calibrated to each motion's difficulty, with the outbound plan's OTE and accelerator structure designed so an outbound rep at plan earns in parity with an inbound rep at plan — and specialized roles so the inbound seats are not simply a prize reps compete to occupy.

## The Decision Framework

The two-motion comp and title structure is built in a defined sequence, and the order matters because each step depends on the one before it.

**Step 1 — Identify and name the two motions precisely.** Self-serve/PLG plus sales-led, SMB plus enterprise, new-logo plus expansion, or inbound plus outbound — the pairing determines everything downstream. Be honest about whether you actually have two motions or one motion and a handful of opportunistic deals (see the counter-case).

**Step 2 — Build a separate comp plan per motion, calibrated to its economics.** Each plan independently sets OTE, base/variable split, quota structure, and accelerator curve from that motion's deal size, cycle length, skill profile, and effort curve. Not two versions of one plan — two plans.

**Step 3 — Set OTE for cross-motion parity.** Model a rep at 80%, 100%, and 120% of plan in each motion. A rep at on-target attainment in either motion should take home roughly the same. Parity in *outcomes*, not uniformity in *plans*.

**Step 4 — Design specialized roles to prevent arbitrage.** Reps are hired into a motion; movement between motions is a structured transition, not a free quarterly choice. Combine this with the parity calibration and with making the harder motion the promotion path so the incentive gradient runs the right way.

**Step 5 — Choose the title structure: parallel ladders with explicit equivalence.** Each motion gets a ladder fitted to its leveling criteria, with a published mapping that defines equivalent levels across motions as equal in seniority and comp band. (Or a single ladder with motion as a specialization if the company is still small.)

**Step 6 — Define cross-motion deal credit before you need it.** Written rules for graduated deals and mid-cycle handoffs — origination credit, closing credit, anti-hoarding provisions — in place before the first cross-motion deal, not litigated after.

**Step 7 — Keep quotas independent per motion.** Separate quota construction, separate attainment reporting, separate pipeline coverage. Never blend, because blending destroys the diagnostic clarity that running two motions requires.

**Step 8 — Audit for inequity.** Transparency about why the plans differ, a visible OTE-parity check, and a periodic fairness audit of realized earnings across both motions. Make the fairness legible, not just real.

**Step 9 — Scale the structure through its stages.** Stretched single structure when the second motion is nascent; proper separate structures at the growth stage when the corrosion appears; fully specialized ladders and cross-motion governance at maturity, extensible to a third or fourth motion.

## 5-Year Outlook

Over the next five years, two forces will reshape two-motion comp and title structure. The first is **AI changing the per-motion economics and skill requirements**. As AI absorbs more of the transactional motion — qualification, light-touch demos, even closing of small deals — the self-serve/SMB motion's headcount shrinks and its remaining roles shift toward orchestration and exception-handling rather than volume selling. This changes the comp math: the transactional motion's quota-per-rep rises sharply as AI leverage increases, the role looks less like classic sales and more like a growth-operations function, and the comp plan may shift from a pure variable-heavy sales plan toward something closer to an ops-plus-bonus structure. Meanwhile the enterprise motion, where the human relationship and judgment are harder to automate, retains its classic structure longer — which means the *gap* between the two motions' comp models may widen, making the parity and equivalence work harder, not easier.

The second force is **motions multiplying and blurring**. The clean two-motion model — one easy, one hard — is already giving way to companies running three, four, or five motions: a PLG motion, a sales-assist motion, an SMB sales motion, an enterprise motion, a partner/channel motion, a renewals-and-expansion motion. As motions multiply, the principles in this entry do not change but the *governance* gets much harder: parity checks across five motions, equivalence mappings across five ladders, deal-credit rules for deals that cross three motions. The companies that win will be the ones that treated the original two-motion structure not as a one-time fix but as an *extensible framework* — a set of principles (separate plans, outcome parity, role specialization, explicit equivalence, independent quotas, governed cross-motion credit) that scales to N motions. The companies that treated two motions as a special case will have to rebuild from scratch every time a motion is added.

The blurring is the subtler challenge. As products get more usage-based and as the customer journey gets less linear, the boundary between motions softens — a customer might be self-serve and enterprise and expansion simultaneously. The comp structure of the future will have to handle a world where "which motion is this deal in" is genuinely ambiguous more often, which makes the deal-tagging discipline and the cross-motion credit rules even more load-bearing than they are today. The founders who get ahead of this will be the ones who, while building their first two-motion structure, build the *credit and tagging infrastructure* to be flexible — because that infrastructure is what the multi-motion, blurred-boundary future runs on.

## Final Framework

The two-motion compensation-and-title blueprint reduces to six load-bearing principles, and a founder-led company that holds all six has a structure that can scale.

**The separate-plans principle.** Two genuine motions are two economic engines. Each gets its own comp plan — its own OTE, base/variable split, quota, and accelerators — calibrated from the ground up to that motion's deal size, cycle length, skill profile, and effort curve. One stretched plan is secretly wrong for both motions; two honest plans, jointly governed, is the fair answer.

**The OTE-parity calibration.** The plans differ but the *outcomes* must not. A rep at on-target attainment in either motion takes home roughly the same. Parity in outcomes — modeled at multiple attainment levels, enforced by the comp committee, made visible to the team — is what removes the reward side of the arbitrage incentive and what keeps neither motion looking like a better deal.

**The anti-arbitrage role design.** Specialized roles reps are hired *into* and do not freely seat-swap between; parity calibration that equalizes the reward; and the harder motion built as the *promotion path* so the incentive gradient runs toward it instead of away. Together these invert arbitrage from a threat into a healthy ambition.

**The title-ladder structure.** Parallel ladders, each fitted to its motion's leveling criteria, bound by a published equivalence mapping that makes equivalent levels equal in seniority and comp band — defended relentlessly by leadership, because the org's natural status-gravity pulls toward a caste system the moment the defense relaxes.

**The cross-motion credit rules.** Written, known-in-advance rules for the deals that span both motions — origination credit, closing credit, handoff mechanics, anti-hoarding provisions — so cross-motion deals are clean collaborations instead of land grabs that teach reps to hoard and fight.

**The inequity audit.** Transparency about why the plans differ, a visible parity check, and a periodic fairness audit of realized earnings — because a structure can be genuinely fair and still corrode the team if the fairness is invisible. Making the fairness legible is the final, continuous discipline.

The founder-led wrinkle threads through all six: the founder usually runs one motion and delegates the other, which means the delegated motion needs *more* structural rigor to substitute for the founder's absent gravity, the founder's own selling has to be formalized into the structure, and the whole system has to be designed for the founder's eventual handoff. Get the six principles right, account for the founder wrinkle, and read the scaling stages correctly — and two motions become one coherent revenue organization with one career architecture, instead of two resentful tribes sharing a logo.

`;

const flow = `

## The Two-Motion Comp-And-Title Structure

\`\`\`mermaid
flowchart TD
  F[Founder-Led Revenue Org] --> CRO[CRO Cross-Motion Governance]
  CRO --> M1[Motion A Self-Serve SMB]
  CRO --> M2[Motion B Enterprise Strategic]

  M1 --> P1[Comp Plan A]
  P1 --> P1a[Lower Base Higher Variable]
  P1 --> P1b[Volume Quota Many Small Deals]
  P1 --> P1c[Fast Accelerators Rewards Consistency]

  M2 --> P2[Comp Plan B]
  P2 --> P2a[Higher Base Lower Variable]
  P2 --> P2b[Magnitude Quota Few Large Deals]
  P2 --> P2c[Lumpy Accelerators Rewards Patience]

  P1c --> PAR{OTE Parity Check}
  P2c --> PAR
  PAR --> PARok[Rep At Plan In Either Motion Earns The Same]

  M1 --> L1[Title Ladder A]
  L1 --> L1a[SMB AE]
  L1a --> L1b[Senior SMB AE]
  L1b --> L1c[Principal SMB AE]

  M2 --> L2[Title Ladder B]
  L2 --> L2a[Enterprise AE]
  L2a --> L2b[Senior Enterprise AE]
  L2b --> L2c[Principal Enterprise AE]

  L1a -. published equivalence .-> L2a
  L1b -. published equivalence .-> L2b
  L1c -. published equivalence .-> L2c

  L1b ==> XOVER[Structured Cross-Motion Move<br/>Ramp Mentor Reset Quota]
  XOVER ==> L2a

  PARok --> SYS[One Revenue Org<br/>Two Calibrated Engines]
  L2c --> SYS
\`\`\`

## The Anti-Arbitrage Design

\`\`\`mermaid
flowchart TD
  RISK[Rep Arbitrage Risk<br/>Reps Flood The Easier Motion] --> WHY[Why It Happens]
  WHY --> WHY1[Easier Motion Warmer Leads Shorter Cycle]
  WHY --> WHY2[Shared Plan Equal Reward Unequal Difficulty]

  WHY1 --> FIX{Three-Part Fix}
  WHY2 --> FIX

  FIX --> FIX1[Specialized Roles]
  FIX1 --> FIX1a[Reps Hired Into A Motion]
  FIX1a --> FIX1b[Movement Is Structured Not A Free Seat-Swap]

  FIX --> FIX2[OTE Parity Calibration]
  FIX2 --> FIX2a[On-Target Earnings Equal Across Motions]
  FIX2a --> FIX2b[Removes The Reward Side Of Arbitrage]

  FIX --> FIX3[Harder Motion Is The Promotion Path]
  FIX3 --> FIX3a[Higher Title Band Prestige]
  FIX3a --> FIX3b[Reps Aspire Toward It Not Away]

  FIX1b --> SUPPORT[Plus Transparency<br/>Explain Why Plans Differ]
  FIX2b --> SUPPORT
  FIX3b --> SUPPORT

  SUPPORT --> RESULT[Arbitrage Inverted]
  RESULT --> R1[Bulk Of Team Stays In Their Specialization]
  RESULT --> R2[No Motion Is A Structurally Better Deal]
  RESULT --> R3[Harder Motion Becomes Aspirational]

  R1 --> ENGINE[Both Motions Fully Staffed<br/>Both Pipelines Healthy]
  R2 --> ENGINE
  R3 --> ENGINE
\`\`\`

`;

const src = `

## Sources

1. **The SaaS CFO — Sales Compensation Plan Design** — Frameworks for OTE, base/variable split, and quota-to-OTE ratios across deal-size segments. https://www.thesaascfo.com
2. **OpenView Partners — Product-Led Growth and Sales-Led Hybrid Models** — Analysis of running PLG and sales-led motions in parallel, including the sales-assist comp question. https://openviewpartners.com
3. **Winning by Design — Bowtie Model and Motion-Specific Revenue Architecture** — Framework for designing distinct GTM motions and the roles within them.
4. **SaaStr — Compensation, Quota, and Two-Motion Scaling** — Founder-facing guidance on SMB vs enterprise comp calibration and the caste-system risk. https://www.saastr.com
5. **Pavilion (formerly Revenue Collective) — RevOps Comp Plan Benchmarks** — Peer benchmarks for OTE, accelerators, and base/variable splits by segment.
6. **Insight Partners — ScaleUp GTM: Segmenting Sales Motions** — Portfolio-company guidance on when and how to split SMB and enterprise motions.
7. **Bessemer Venture Partners — State of the Cloud and GTM Efficiency Metrics** — Blended cost-of-sale and GTM efficiency benchmarks relevant to multi-motion comp cost modeling. https://www.bvp.com
8. **Gong / Sales Hacker — Sales Compensation and Territory Design Library** — Practitioner content on quota construction, ramp, and cross-segment deal credit.
9. **a16z — The New Business of GTM and Hybrid Motions** — Analysis of motions multiplying and blurring, and the implications for org and comp design. https://a16z.com
10. **First Round Review — Founder-Led Sales and the Handoff to a Sales Team** — Guidance on the founder personally running a motion and structuring its eventual handoff. https://review.firstround.com
11. **The Bridge Group — SaaS AE and Sales Development Metrics Reports** — Annual benchmark data on quotas, ramp, OTE, and attainment by segment.
12. **CaptivateIQ / Spiff — Commission Plan Mechanics and Multi-Plan Administration** — Tooling-vendor documentation on running and reconciling multiple distinct comp plans.
13. **Carta — Equity Compensation Benchmarks by Role and Level** — Equity-grant band data supporting the equity-follows-level principle. https://carta.com
14. **Harvard Business Review — Motivating Salespeople: What Really Works** — Research on plan structure, accelerators, and the behavioral effects of base/variable mix.
15. **ICONIQ Growth — Topline Growth and GTM Org Design Reports** — Benchmark data on revenue-org structure, including first-line management ratios by motion.
16. **Notion / Stripe / Atlassian public GTM commentary** — Widely-referenced examples of PLG-plus-sales-led two-motion companies and their org evolution.
17. **CompTeam / Alexander Group — Sales Compensation Consulting Frameworks** — Comp-committee governance models and the fairness-audit practice.
18. **RevOps Co-op — Community Practitioner Guidance** — Crowd-sourced practitioner playbooks on deal-tagging taxonomy and cross-motion attribution.
19. **Tom Tunguz (Theory Ventures) Blog — SaaS Metrics and GTM Motion Economics** — Analysis of motion-specific unit economics and cost of sale. https://tomtunguz.com
20. **Lenny's Newsletter — Growth, PLG, and GTM Org Structure** — Practitioner interviews on sales-assist comp, motion specialization, and career paths across motions. https://www.lennysnewsletter.com

`;

const num = `

## Numbers

**OTE and Base/Variable Split by Motion (illustrative SaaS benchmarks)**
- Self-serve / SMB AE OTE: typically lower absolute band; base/variable split commonly 60/40 to 70/30 variable-weighted
- Enterprise / strategic AE OTE: higher absolute band; base/variable split commonly 50/50 to 60/40 base-weighted
- Sales-assist / PLG-overlay role: sometimes 70/30 or 80/20 base-weighted, or an ops-plus-bonus structure rather than a classic sales plan
- OTE-parity target: a rep at 100% of plan in either motion should land within a tight band of each other (single-digit-percent divergence is healthy; a small premium for the genuinely harder motion can be intentional)

**Quota-to-OTE Ratios by Motion**
- Self-serve / SMB motion: commonly 4x-6x OTE (high efficiency, volume-driven)
- Enterprise motion: commonly 3x-5x OTE (lower ratio reflects long cycles and concentrated deal risk)
- The raw quota numbers are NOT comparable across motions — a higher enterprise quota does not mean a more productive rep

**Deal Economics Contrast (typical pairing)**
- Self-serve / SMB deal size: roughly \\$3K-\\$15K ACV
- Enterprise deal size: roughly \\$80K-\\$400K ACV
- Self-serve / SMB cycle length: roughly 7-45 days
- Enterprise cycle length: roughly 4-12 months
- These four-axis differences (size, cycle, skill, effort) are why one shared plan structurally fails

**Ramp by Motion**
- Self-serve / SMB rep ramp to full productivity: roughly 4-12 weeks
- Enterprise rep ramp to full productivity: roughly 2-3 quarters
- Cross-motion move (SMB to enterprise): treat as a 2-3 quarter development investment with reset transition quota

**Cross-Motion Deal Credit (common splits)**
- Origination credit to the motion that nurtured a graduated account: roughly 20%-25% of booking credit
- Closing credit to the motion that lands the enterprise contract: roughly 75%-80%
- Exact split should reflect genuine value creation; the load-bearing requirement is that it is WRITTEN and KNOWN IN ADVANCE

**Cost of Sale by Motion**
- Enterprise motion cost of sale: structurally higher (high-touch, long cycle, richer base)
- Self-serve / SMB motion cost of sale: structurally lower (efficient, volume-driven)
- Blended cost of sale: the portfolio number the board manages — the efficient motion subsidizes the high-touch motion's ratio
- Cost modeling must run at the 60th, 80th, 100th, and 120th percentile of the rep distribution because accelerators make the cost structure non-linear

**Org Structure Signals**
- First-line management: near-universally separate per motion (a manager cannot coach a 30-day cadence and a 9-month cadence simultaneously)
- Shared revenue leadership: converges at the CRO / founder-as-CRO layer, whose explicit mandate includes cross-motion governance
- Comp committee composition: typically CRO or founder + head of people + finance + RevOps

**Scaling Stage Thresholds (approximate)**
- Early stage: one stretched structure is acceptable while the second motion is nascent (often under ~15-20 reps total, second motion unproven)
- Growth stage: split into separate structures when corrosion appears — typically past ~20-30 reps, when arbitrage and title confusion become visible
- Mature stage: fully specialized ladders and cross-motion governance, often extended to 3+ motions

**Equity**
- Default principle: equity grants follow LEVEL, not motion — equivalent mapped levels get equivalent equity bands
- Defensible exception: a small, explicitly-reasoned equity premium for long-cycle enterprise roles as a retention mechanism tied to cycle length, not a systematic gap

**The Four Common Two-Motion Pairings**
- Self-serve/PLG + sales-led
- SMB + enterprise (most common; highest caste-system risk)
- New-logo + expansion
- Inbound + outbound (highest arbitrage risk — reps doing nearly the same job)

`;

const counter = `

## Counter-Case: When An Elaborate Two-Motion Comp And Title Structure Is The Wrong Move

The entire framework above assumes the company genuinely has two motions worth building two structures around. That assumption is often wrong, and a founder should stress-test it hard before committing to the overhead, because building a full parallel structure for something that is not actually a second motion creates more dysfunction than it cures.

**Counter 1 — The "second motion" is really just a handful of opportunistic deals.** The most common false positive: a company has one real motion and, alongside it, a trickle of larger or different deals that a couple of reps work opportunistically. This is not a second motion — it is variance within one motion. Building a separate comp plan, a parallel title ladder, a comp committee, and a deal-tagging taxonomy around six deals a year is pure over-engineering. It creates administrative drag, it makes the org *feel* more complex than it is, and it often calcifies a "motion" that should have stayed an informal exception or been folded back into the primary motion. The test is volume and repeatability: a second motion is a *repeatable, resourced, intentional* way of going to market with its own pipeline and its own roles — not a pattern you noticed in the deal log. If you cannot point to dedicated headcount, a dedicated pipeline source, and a deliberate decision to run the motion, you do not have a second motion yet, and you should not build a second structure.

**Counter 2 — Over-formalizing two ladders manufactures the caste system it was meant to prevent.** There is a real irony in the title-structure work: the act of building two elaborate, formal, distinct ladders can *create* the very hierarchy the equivalence mapping is supposed to prevent. When the company publishes two separate ladders with two separate names and two separate leveling rubrics, it has made the distinction between the motions *more* salient, more official, more present in every reps' mind — and salience is what status-ranking feeds on. A smaller company is often better served by a single ladder with motion as a lightweight specialization attribute, precisely because it gives the org *less* structure to rank. The parallel-ladder approach is correct at scale, but a founder who reaches for it too early, or who over-engineers the rubrics, can end up institutionalizing a two-tier culture under the banner of preventing one. Formalization is not free — it makes things real, and sometimes the thing it makes real is the hierarchy.

**Counter 3 — The real problem is that one of the two "motions" is not actually viable.** Sometimes the comp-and-title difficulty is a symptom, not the disease. A founder struggles to design a fair two-motion structure, and the reason it is so hard is that one of the two motions does not actually have viable unit economics — the enterprise motion's cost of sale exceeds what the deals can ever support, or the self-serve motion never reaches the efficiency that justifies it, or the expansion motion is not actually producing incremental revenue. In that situation, building an elaborate comp structure is *propping up something that should be cut*. The comp plan becomes a way of paying reps to keep flogging a motion that the business should exit. The honest move is not a better two-motion comp design — it is a hard look at whether both motions deserve to exist. A founder who finds the two-motion structure impossible to make economically coherent should consider that the structure is telling the truth: maybe there should only be one motion. Comp design cannot fix a motion that does not work; it can only disguise it for a while.

**Counter 4 — Premature structure freezes a motion that should still be fluid.** Early-stage motions are supposed to change shape — the company is still learning what the self-serve motion or the enterprise motion even is. Locking in a formal comp plan, a title ladder, and a deal-credit rulebook around a motion that is still being discovered freezes it prematurely. The reps optimize to the plan, the plan was designed around an incomplete understanding of the motion, and now the company has to fight its own structure to let the motion evolve. Sometimes the right answer is to keep the second motion deliberately under-structured — a simple spreadsheet, a founder's judgment call on credit, a flexible title — *until the motion has stopped changing shape*. Structure is for motions that are known; exploration needs looseness.

**Counter 5 — The overhead of dual governance can exceed the benefit at small scale.** A comp committee, a fairness audit, a deal-tagging taxonomy, multi-attainment cost modeling per motion, parity checks, equivalence mappings — this is real ongoing operational work. At a company of two hundred reps it is obviously worth it. At a company of eighteen reps it can consume a disproportionate share of the leadership team's and RevOps' attention for a problem that a founder's good judgment could handle directly. The governance machinery has a fixed cost, and below some scale that fixed cost is simply not earned back. The founder should honestly weigh whether the company is big enough that the structure pays for itself, or whether the structure is being built because it feels like what a "real" company does — which is not a reason.

**The honest verdict.** The two-motion comp and title framework is correct and important for a company that genuinely runs two resourced, repeatable, viable motions and has scaled past the point where a founder's judgment can hold comp together — roughly the growth stage, past twenty or thirty reps, when the arbitrage and title confusion are actually visible. It is the wrong move for a company whose "second motion" is a handful of opportunistic deals, for a company small enough that the governance overhead exceeds the benefit, for a motion that is still changing shape and needs to stay fluid, and — most importantly — for a company where the real problem is that one of the motions is not economically viable and the comp structure would just be propping it up. Before building the structure, the founder should pass three tests: Is the second motion real (resourced, repeatable, intentional)? Is it viable (economically coherent on its own)? Is the company at the scale where founder judgment has genuinely broken down? If all three are yes, build the full structure. If any is no, the elaborate two-motion structure is premature, and the honest move is to wait, simplify, or cut.

`;

const links = `

## Related Pulse Library Entries

- **q9531** — How should a founder-led org structure its first RevOps hire? (The function that owns the two-motion plan mechanics and deal-tagging.)
- **q9533** — When should a founder-led company hire its first CRO? (The role that owns cross-motion governance.)
- **q9501** — How do you design a sales compensation plan from scratch? (Single-motion comp foundations this entry builds on.)
- **q9502** — What is the right base/variable split for a sales rep? (Per-motion calibration detail.)
- **q9510** — How do you construct a sales quota? (Per-motion quota construction referenced here.)
- **q9512** — How do you design sales accelerators and decelerators? (The accelerator-curve differences between motions.)
- **q9515** — How do you handle commission clawbacks and ramp provisions? (Plan mechanics that differ per motion.)
- **q9520** — What is OTE and how do you set it? (The OTE-parity principle's foundation.)
- **q9521** — How do you prevent reps from gaming the comp plan? (The arbitrage problem in a single-motion context.)
- **q9525** — How do you design a sales territory model? (Adjacent structural decision to motion segmentation.)
- **q9530** — When should a company split its sales team into SMB and enterprise? (The decision that creates the two-motion structure.)
- **q9540** — How do you run a product-led growth motion alongside a sales team? (The PLG-plus-sales-led pairing in depth.)
- **q9541** — How do you build a sales-assist motion for self-serve signups? (The sales-assist comp question raised here.)
- **q9542** — How do you structure expansion and renewal compensation? (The new-logo-plus-expansion pairing in depth.)
- **q9545** — How do you handle deal credit and crediting disputes? (Cross-motion deal credit deep dive.)
- **q9550** — How do you design a sales career ladder? (Single-ladder foundations; this entry's parallel-ladder extension.)
- **q9551** — How do you level sales reps fairly? (Leveling rigor referenced in the equivalence principle.)
- **q9555** — How do you prevent a caste system between SMB and enterprise sales? (The status-trap problem in depth.)
- **q9560** — How do you build a sales comp committee? (The governance body referenced here.)
- **q9561** — How do you run a comp plan fairness audit? (The inequity-audit practice.)
- **q9570** — How do you model the cost of sale by segment? (Finance's per-motion cost modeling.)
- **q9580** — How does a founder hand off founder-led sales? (The founder's eventual exit from the day-to-day.)
- **q9581** — How should a founder split their time between two GTM motions? (The founder's-place wrinkle.)
- **q9590** — How do you scale a revenue org from one motion to many? (The evolution-through-stages framework.)
- **q9591** — How do you run three or more GTM motions? (The mature-stage, multi-motion extension.)
- **q9601** — How will AI change the structure of sales teams by 2030? (The 5-year-outlook AI thesis.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Adjacent AI-disruption-of-GTM-roles analysis.)
- **q9610** — How do you design equity compensation for a sales team? (The equity-component deep dive.)
- **q9620** — How do you present GTM strategy to a board? (The board-framing section's broader context.)

`;

const tags = ['compensation','sales-comp','gtm-strategy','two-motions','founder-led','sales-org-design','title-structure','revops','quota','plg'];

const sources = [
  { title: 'SaaStr — Compensation, Quota, and Two-Motion Scaling', url: 'https://www.saastr.com' },
  { title: 'OpenView Partners — Product-Led Growth and Sales-Led Hybrid Models', url: 'https://openviewpartners.com' },
  { title: 'First Round Review — Founder-Led Sales and the Handoff to a Sales Team', url: 'https://review.firstround.com' }
];

const notes = {
  s6: 'Added 20 cited sources spanning sales-comp design frameworks (The SaaS CFO, Winning by Design, Alexander Group), two-motion and PLG-plus-sales-led analysis (OpenView, SaaStr, a16z, Lenny\'s Newsletter), GTM efficiency and cost-of-sale benchmarks (Bessemer, ICONIQ, Tom Tunguz, Bridge Group), founder-led sales handoff guidance (First Round Review), comp-plan tooling and governance (CaptivateIQ, Spiff, CompTeam, Pavilion, RevOps Co-op), and equity benchmarks (Carta).',
  s7: 'Added comprehensive numerical analysis: OTE and base/variable splits by motion (60/40-70/30 variable-weighted for SMB, 50/50-60/40 base-weighted for enterprise), quota-to-OTE ratios per motion (4x-6x SMB, 3x-5x enterprise), deal-economics contrast (deal size, cycle length across the four-axis difference), ramp timelines per motion, cross-motion deal-credit splits (20-25% origination / 75-80% close), cost-of-sale structure and the non-linear multi-attainment-percentile modeling requirement, org-structure signals, scaling-stage thresholds, equity principles, and the four common two-motion pairings.',
  s8: 'Added 5-part counter-case: (1) the "second motion" is really just a handful of opportunistic deals and a full parallel structure is over-engineering, (2) over-formalizing two ladders manufactures the very caste system it was meant to prevent, (3) the real problem is that one of the two motions is not economically viable and the comp structure would just prop it up, (4) premature structure freezes a motion that should still be fluid, (5) dual-governance overhead can exceed the benefit at small scale — with a three-test honest verdict (real, viable, at-scale).',
  s9: 'Cross-linked 28 related Pulse entries: founder-led org structure adjacencies (q9531/q9533), single-motion comp foundations (q9501/q9502/q9510/q9512/q9515/q9520/q9521/q9525), the SMB-enterprise split decision (q9530), motion-specific deep dives (q9540/q9541/q9542/q9545), title and leveling (q9550/q9551/q9555), governance (q9560/q9561/q9570), founder handoff and time-split (q9580/q9581), multi-motion scaling (q9590/q9591), AI-and-GTM outlook (q9601/q1899), and equity and board framing (q9610/q9620).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the two-motion compensation-and-title structure playbook for founder-led companies. Two mermaid diagrams (the two-motion comp-and-title structure showing parallel calibrated plans plus parallel title ladders with published equivalence and the structured cross-over path; the anti-arbitrage design showing how specialized roles plus OTE parity plus the harder-motion-as-promotion-path invert arbitrage into healthy ambition). Full coverage: the core problem (rep arbitrage, title confusion, inequity corrosion), why one structure for two motions fails (the four-axis difference — deal size, cycle, skill, effort), the four common two-motion pairings, six comp-and-title principles (separate plans, OTE-parity calibration, anti-arbitrage role design, cross-motion deal credit, parallel title ladders with equivalence, the inequity audit), the status-trap and caste-system risk, the manager and leadership layer, the founder-led wrinkle (delegated motion needs more rigor, founder selling formalized, succession), per-motion quota construction, comp cost modeling, the equity component, the RevOps and finance and comp-committee ownership, the evolution-through-stages framework, board framing, five real-world scenarios, a nine-step decision framework, a 5-year outlook (AI changing per-motion economics, motions multiplying and blurring), a final six-principle framework, and a five-part counter-case with a three-test verdict.'
};

runPolish({ id: 'q9532', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
