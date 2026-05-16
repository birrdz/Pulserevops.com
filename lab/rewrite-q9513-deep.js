// q9513 — What is the realistic 6-month operating cost of running both HubSpot and Salesforce in parallel during a CRM migration cutover?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** The realistic 6-month cost of running HubSpot and Salesforce in parallel is **never just "2x license"** — it is a stack of seven cost layers that compound: **(1) duplicated licenses**, **(2) integration/middleware**, **(3) the data-sync failure tax**, **(4) duplicated admin headcount**, **(5) duplicated ISV tooling** (Gong, Outreach, ZoomInfo, DocuSign — many of which charge per CRM connection), **(6) the process tax** (reps unsure which system to update, deals logged in the wrong place, double entry), and **(7) reporting reconciliation and opportunity cost**. For a **30-rep org**, a realistic 6-month parallel run lands around **$140K-$260K all-in**. For a **75-rep org**, **$420K-$780K**. For a **150-rep org**, **$900K-$1.7M** — and the **$1.2M-$2.5M** figures you see quoted for large 50-150 rep migrations are entirely credible once consultants, iPaaS, and opportunity cost are loaded in. Crucially, **license duplication is usually only 25-40% of the true total** — the soft costs (admin, process tax, reconciliation, opportunity cost) are the larger and less visible half, which is exactly why "let's just keep both for now" is so dangerously underpriced in the CFO's head. The single biggest lever is **time**: dual-CRM periods almost always run **2-3x longer than planned** (the 6-month plan becomes 14-20 months), and cost scales close to linearly with overlap duration, so **compression is the dominant cost-control strategy**. The second biggest lever is **sync topology**: a **one-way sync** with one system designated as the single source of truth (the other read-only) costs **40-60% less** than a bidirectional sync, because bidirectional sync generates conflict-resolution work, duplicate records, and "which system is right" disputes indefinitely. The decision framework is binary: **is this a migration overlap or a permanent department split?** If it is a migration, **compress ruthlessly** — sequence the data migration, pick a hard cutover weekend, keep a rollback plan, and treat every extra month as a five-figure-to-six-figure line item. If it is a genuine, intentional **Marketing-on-HubSpot / Sales-on-Salesforce split**, then stop calling it a "cost to eliminate" and **architect it cleanly** — one-way sync, clear field ownership, documented source-of-truth rules — because a well-built permanent split is a legitimate best-of-breed architecture, not migration limbo. The leadership conversation that actually works: **make the invisible costs visible**, put the opportunity cost (the RevOps roadmap that stalls) on the same slide as the license line, and price the "temporary" period at its realistic 14-20 month duration, not its optimistic 6.`;

const core = `

## Why Dual-CRM Periods Happen — The Legitimate And The Accidental

Almost every dual-CRM period falls into one of four origin stories, and the origin story matters enormously because it determines whether the cost is a temporary, compressible expense or a permanent architectural decision that should be priced and owned deliberately.

**Origin 1 — Mid-migration overlap.** This is the most common and the most defensible. You have decided to move from Salesforce to HubSpot (or vice versa), and there is an unavoidable window where both systems are live: historical data is being migrated, integrations are being rebuilt, reps are being trained, and you cannot simply flip a switch at midnight on a Tuesday. A clean migration plan budgets for this overlap explicitly — typically 6 to 12 weeks of true parallel operation, sometimes 4 to 6 months when the org is large or the integration surface is wide. This is a legitimate cost. The danger is not that it exists; the danger is that it runs 2-3x longer than the plan because nobody owns the cutover date.

**Origin 2 — Post-merger two-org reality.** Company A runs Salesforce, Company B runs HubSpot, and the M&A deal closes. For the first 6-18 months post-close, both orgs keep operating their existing CRMs because the integration team is overwhelmed with payroll, ERP, email domains, and a hundred other Day-1 systems. CRM consolidation slips to "phase 2." This is semi-legitimate — you genuinely cannot do everything at once — but it is the dual-CRM scenario most prone to dragging, because there is no single executive whose bonus depends on consolidating the CRMs, and both sales teams are emotionally attached to their tools.

**Origin 3 — "We'll just keep both for now."** This is the accidental, illegitimate version. Nobody decided to run two CRMs. It happened because marketing bought HubSpot for email and landing pages while sales was already on Salesforce, and over 18 months HubSpot quietly grew a contact database, deal pipeline, and reporting layer that now overlaps 70% with Salesforce. No migration was ever planned. No cutover date exists. The "dual-CRM period" is simply the steady state, and it is bleeding money that nobody has put on a spreadsheet. This is the most expensive scenario per dollar of value delivered because it has all the cost and none of the intentionality.

**Origin 4 — A department that won't move.** The migration was supposed to happen. The plan existed. But the VP of Sales (or a regional team, or the renewals org) refused to give up Salesforce, or a customer-success team insisted HubSpot's ticketing was non-negotiable. So the migration "completed" with an exception carved out, and now you have a permanent partial dual-CRM state driven by politics rather than architecture. This is the scenario that most needs an honest framework: either the exception is architecturally justified (in which case, build it properly) or it is political (in which case, the cost should be made visible to the person blocking the consolidation).

The reason origin matters: **Origins 1 and 2 are costs to compress.** The right answer is a faster cutover. **Origins 3 and 4 are decisions to make explicit** — either commit to a clean permanent split with proper architecture, or commit to a migration with a real date. The worst outcome in all four cases is the same: an undated, unowned, unpriced parallel run that everyone assumes is "temporary."

## The Cost Categories Overview — It Is Not 2x License

The instinctive CFO mental model is "running two CRMs costs roughly twice as much as running one." That model is wrong, and it is wrong in a direction that consistently causes organizations to under-invest in finishing the migration. The realistic 6-month cost of a parallel run is a stack of seven distinct layers, and license duplication — the only layer most people think about — is typically just **25-40% of the true total**.

**Layer 1 — Duplicated licenses.** You are paying per-seat for both platforms for every user who touches either. This is the visible layer. It is real, but it is the smallest of the big three.

**Layer 2 — Integration and middleware.** Keeping two CRMs from drifting apart requires a sync mechanism — the native HubSpot-Salesforce connector, or a paid iPaaS like Workato, Tray.io, Boomi, or MuleSoft. There is a setup cost (often consultant-built) and a recurring cost, plus ongoing field-mapping maintenance every time either system's schema changes.

**Layer 3 — The data-sync failure tax.** Sync is never perfect. Conflicts, duplicate records, fields that overwrite each other, the "which system is the source of truth" ambiguity — all of this generates manual reconciliation hours and bad data that costs money downstream.

**Layer 4 — Duplicated admin.** You now need administrative coverage for both platforms. That is more admin hours, often a second skillset (a Salesforce admin and a HubSpot admin are not the same person), and a context-switching tax on whoever is stretched across both.

**Layer 5 — Duplicated tooling.** Your sales-tech stack — Gong, Outreach/Salesloft, ZoomInfo, DocuSign, Chili Piper, LeanData, Clari — connects to your CRM. Many of these tools charge per CRM connection, require duplicate configuration, or simply have to be paid for and maintained twice during the overlap.

**Layer 6 — The process tax.** Reps do not know which system to update. Deals get logged in the wrong place. Data gets entered twice. Time is spent asking "where do I look for this account?" Every one of those friction moments is a fraction of a selling hour, and across a sales team over six months it adds up to a large number.

**Layer 7 — Reporting reconciliation and opportunity cost.** You cannot trust a single number, because every metric exists in two systems that disagree. RevOps spends hours reconciling board metrics. And the opportunity cost — the roadmap that RevOps and admin are not building because they are babysitting two CRMs — is the largest and most invisible layer of all.

The mental shift the rest of this entry is built around: **the visible layers (licenses, middleware) are roughly half the cost; the invisible layers (sync tax, duplicated admin, process tax, reconciliation, opportunity cost) are the other half — and the invisible half is the half that keeps the parallel run alive, because nobody is staring at it on a spreadsheet.**

## License Cost — The Obvious Layer

Start with the layer everyone already understands, because it anchors the rest. As of 2026-2027 pricing, **Salesforce Sales Cloud Enterprise** runs roughly **$165 per user per month** (list; Unlimited is higher, Professional lower), and **HubSpot Sales Hub Professional** runs roughly **$100 per user per month** while **Sales Hub Enterprise** runs roughly **$150 per user per month** (with HubSpot's seat model and the historical minimum-seat commitments factored in). Real-world negotiated pricing varies — large orgs get 15-35% off list, multi-year commits get more — but list pricing is the right starting point for a planning estimate because it is what the renewal quote will anchor to.

The worked numbers for a 6-month parallel run, assuming every user is licensed on both platforms (which is the conservative and usually-correct assumption during a true cutover overlap, because you cannot have reps half-blind in either system):

**30 users.** Salesforce: 30 × $165 × 6 = **$29,700**. HubSpot Sales Hub Enterprise: 30 × $150 × 6 = **$27,000**. Combined license cost for the overlap: **~$56,700**. If HubSpot is on Sales Hub Pro instead: 30 × $100 × 6 = $18,000, combined ~$47,700.

**50 users.** Salesforce: 50 × $165 × 6 = **$49,500**. HubSpot Enterprise: 50 × $150 × 6 = **$45,000**. Combined: **~$94,500**.

**100 users.** Salesforce: 100 × $165 × 6 = **$99,000**. HubSpot Enterprise: 100 × $150 × 6 = **$90,000**. Combined: **~$189,000**.

**150 users.** Salesforce: 150 × $165 × 6 = **$148,500**. HubSpot Enterprise: 150 × $150 × 6 = **$135,000**. Combined: **~$283,500**.

Two important nuances. First, **you usually cannot avoid the duplicate license by reducing seats on the outgoing platform**, because Salesforce contracts are annual and seat reductions only take effect at renewal — if your renewal does not fall inside the migration window, you are paying for seats you are actively trying to abandon. Second, **the incremental license is genuinely "new" money** — the platform you are migrating to is an addition to a budget that already had the outgoing platform fully funded. So the right way to express this to finance is not "we spend X on CRM" but "we are spending an *incremental* $47K-$284K over six months purely on the duplication, before we count a single soft cost." And the soft costs, as the next sections show, are larger than this number.

## Integration And Sync Cost — The Middleware Layer

Two live CRMs that are supposed to represent the same revenue reality have to be kept in sync, and that synchronization is itself a cost center with a setup component and a recurring component.

**The native HubSpot-Salesforce connector.** HubSpot ships a native Salesforce integration, included with Professional and Enterprise tiers. It is genuinely capable for straightforward use cases: it syncs contacts, companies, deals, and selected custom fields, with configurable sync rules and a selective-sync inclusion list. But it has real limits. It is fundamentally a HubSpot-to-Salesforce object sync, not a general-purpose integration bus — it does not handle complex transformation logic, multi-step workflows, or syncing to objects and systems beyond the core set. Field mapping is manual and must be maintained. And the "selective sync" rules, while powerful, are a configuration surface that drifts: every time either system adds a field, changes a picklist, or restructures a record type, someone has to revisit the mapping. For a clean migration where you simply need contacts and deals to mirror for a few months, the native connector is often sufficient and its incremental cost is mostly labor.

**Paid iPaaS — Workato, Tray.io, Boomi, MuleSoft, Zapier.** When the sync requirements exceed the native connector — bidirectional sync with conflict resolution, syncing custom objects, transformation logic, syncing to a data warehouse alongside the CRMs, or orchestrating multi-system workflows — organizations reach for an integration platform. Pricing ranges widely: lightweight tooling can be a few hundred to a couple thousand dollars a month, while enterprise iPaaS (Workato, Boomi, MuleSoft) commonly lands in the **$2,000-$8,000+ per month** range for a CRM-sync workload, plus a substantial **setup/implementation cost** that is frequently **$15,000-$80,000+** when a consultant builds it. For a 6-month parallel run, a realistic iPaaS line is **$25,000-$120,000 all-in** (setup amortized plus six months of subscription) for a mid-to-large org, and that is before maintenance labor.

**The field-mapping maintenance tax.** This is the cost everyone forgets. A bidirectional CRM sync is not "set and forget." Salesforce and HubSpot have different data models — different ideas of what a "deal stage" is, different handling of multi-select fields, different validation rules, different ownership models. Keeping the mapping correct as both systems evolve is an ongoing 4-12 hours per month of skilled admin/ops time, and when it breaks (a sync error backs up, a field overwrites with a null, a picklist value gets rejected) it can consume a full day of triage. Over six months, budget **$8,000-$25,000** of loaded labor just for sync maintenance, independent of the platform subscription.

So the integration layer for a typical mid-size parallel run is realistically **$35,000-$145,000** over six months — frequently larger than the duplicated license cost, and almost always under-budgeted because the line item that gets approved is "the iPaaS subscription" while the consultant setup and the maintenance labor hide in other budgets.

## The Data Sync Failure Tax — The Hidden Cost

Even a well-built sync fails, and the failures are not occasional curiosities — they are a steady, predictable tax on the entire dual-CRM period.

**Sync conflicts.** When the same record can be edited in both systems, you will get conflicts: a rep updates a deal amount in Salesforce while marketing ops updates the same deal's source field in HubSpot, and the sync has to decide who wins. Even with "last write wins" or field-level sync rules, the edge cases pile up: timezone-related ordering, batch-update races, fields that should be one-directional but were configured bidirectional. Each unresolved conflict is either bad data or a manual fix.

**Duplicate records.** This is the single most corrosive failure. Two systems, two ideas of identity, and a sync that matches on email or domain — and suddenly the same account exists three times, the same contact twice, the same deal in two pipelines. Duplicates degrade reporting (your pipeline is overstated), degrade rep experience (which record do I work?), degrade routing (LeanData/Chili Piper assign to the wrong owner), and degrade marketing (the same person gets emailed twice). De-duplication during a dual-CRM period is a near-continuous RevOps chore.

**The "which system is the source of truth" chaos.** This is the conceptual failure underneath the technical ones. If the answer to "which system is right?" is "it depends on the field" or "it depends on who you ask," then every disagreement between the systems becomes a small investigation. Reps lose trust in both systems. Managers stop believing the dashboards. The CRO gets two pipeline numbers and has to ask which one to take to the board.

**The manual reconciliation hours.** Add it up: de-duping, conflict resolution, investigating "this account looks wrong," re-syncing records that fell out of sync, validating that the migration backfill actually matched. For a mid-size org this is realistically **0.5-1.5 FTE of someone's time** distributed across RevOps and admins for the duration of the parallel run. Over six months at a loaded RevOps/admin cost, that is **$25,000-$75,000** — and it produces nothing. It is pure tax. It is also the cost that most directly argues for a **one-way sync**: if one system is read-only, conflicts and most duplicates simply cannot happen, and this entire layer shrinks by more than half.

## Duplicated Admin Cost — Two Platforms, Two Skillsets

A single CRM needs administration: user provisioning, field and object changes, workflow and automation maintenance, permission and security management, integration oversight, report and dashboard building, release management. Running two CRMs in parallel does not double the *value* of that work — but it very nearly doubles the *labor*, and it adds a tax that single-CRM orgs never pay.

**It is more admin hours.** Every change request now potentially has to be made twice — once in each system — or made in one and verified not to have broken the sync into the other. User onboarding and offboarding happens in two places. Two release cycles (Salesforce's three annual releases, HubSpot's continuous shipping) have to be monitored for breaking changes. Two sets of automation have to be kept from fighting each other.

**It is often a second skillset.** A strong Salesforce administrator and a strong HubSpot administrator are usually not the same person. Salesforce admin is a deep, certification-backed discipline (flows, validation rules, sharing models, Apex-adjacent debugging). HubSpot admin is a different discipline (workflows, the HubSpot data model, the marketing-ops surface). During a parallel run you either need both skillsets — which may mean a contractor or an agency on one side — or you stretch one admin across both and accept that they are weaker on one platform.

**The context-switching tax.** Even when one person can cover both, switching between two mental models all day is genuinely costly. The two systems do the same conceptual things in different ways, and the admin who lives in both spends real cognitive overhead translating. Error rates go up. Throughput goes down.

For a 30-rep org, the duplicated admin cost over six months is realistically **$20,000-$45,000** (additional fractional admin or contractor coverage plus the productivity drag on the existing admin). For a 75-rep org, **$45,000-$95,000**. For a 150-rep org, where you likely need genuine dedicated coverage on both platforms, **$90,000-$180,000+**. And note that this cost does not produce a better CRM — it produces the *maintenance of a temporary state*.

## Duplicated Tooling Cost — The ISV-App Layer

The CRM is the center of a constellation of revenue tools, and almost every one of them has a relationship with the CRM that becomes a cost during a parallel run.

**Per-connection pricing.** Many ISV tools price or gate features by CRM connection. A conversation-intelligence tool like Gong, a sales-engagement platform like Outreach or Salesloft, a data provider like ZoomInfo, a scheduling tool like Chili Piper, a routing tool like LeanData, a forecasting tool like Clari — some of these will let you connect to two CRMs only on a higher tier, some charge per integration, and some simply require you to maintain two configurations. The result is that during the overlap you are frequently paying more for the same tool, or paying for it twice, or paying for a tier upgrade you would not otherwise need.

**Duplicate configuration and maintenance.** Even when a tool does not charge extra, it has to be *configured* against both CRMs: field mappings, sync rules, activity logging destinations, user mappings. That is setup labor, and it is ongoing maintenance labor — every tool whose CRM connection has to be kept working in two places is another small recurring cost.

**Activity-logging fragmentation.** This is a subtle but real one. Sales-engagement and conversation tools log activity (calls, emails, meetings) back to the CRM. During a dual-CRM period, that activity either logs to one system (making the other system's records look dead) or to both (compounding the duplicate-record and sync problems). Neither is good, and resolving it well is its own configuration project.

**The "we'll just pay for both" reflex.** The path of least resistance during a migration is to keep every tool connected to both CRMs so nothing breaks. That reflex is what makes this layer expensive. A disciplined parallel run audits the tool stack and decides, per tool, whether it connects to the source-of-truth system only.

Realistic six-month duplicated-tooling cost: **$10,000-$30,000** for a 30-rep org, **$25,000-$65,000** for a 75-rep org, **$50,000-$130,000** for a 150-rep org — driven by how rich the existing sales-tech stack is. Stacks with Gong + Outreach + ZoomInfo + Clari + LeanData all in play push to the top of these ranges.

## The Process Tax — Lost Selling Hours

This is the layer that finance finds hardest to believe and that sales managers recognize instantly. When there are two CRMs, reps pay a friction tax on routine work, and that friction is denominated in selling hours.

**"Which system do I update?"** A rep closes a call. Do they log it in Salesforce, HubSpot, or both? If the official answer is "both," that is literally double data entry. If the official answer is "the source of truth," the rep has to remember which one that is for this object, this week. Either way it is a moment of friction multiplied across every activity, every day.

**Deals logged in the wrong place.** Inevitably, deals get created in the wrong system. Now there is a deal in HubSpot that should have been in Salesforce, the sync may or may not have caught it, the forecast is wrong, and someone has to find and fix it. Multiply across a team over months.

**"Where do I look for this account?"** A rep wants the history on an account before a renewal call. The emails might be in HubSpot, the opportunity history in Salesforce, the support tickets in one or the other. The rep spends ten minutes assembling a picture that should take ten seconds.

**Double data entry.** Whenever the sync does not cover a field, or a rep does not trust the sync, the safe behavior is to enter the data in both places. Reps are not wrong to do this — they are responding rationally to an ambiguous system — but it is pure waste.

**Quantifying it.** A conservative estimate: each rep loses **15-30 minutes per day** to dual-CRM friction during an active parallel run — checking two systems, double-entering, fixing mis-logged records, asking colleagues "where is this?" Take the midpoint, ~20 minutes/day. Over ~125 working days in six months, that is ~42 hours per rep. At a fully loaded sales cost (salary, benefits, but more importantly the *revenue opportunity cost* of a seller's time), value that hour conservatively at $75-$150. For a 30-rep org: 30 × 42 × ~$110 ≈ **$139,000**. For a 75-rep org: ≈ **$347,000**. For a 150-rep org: ≈ **$693,000**. These numbers look large because the process tax *is* large — it is frequently the single biggest line in the whole stack, and it is the one that never appears on any invoice, which is exactly why "let's just keep both" feels free.

## Reporting And Forecasting Reconciliation Cost

In a single-CRM org, the CRM is the number. In a dual-CRM org, there is no "the number" — there are two numbers, and they disagree, and somebody has to reconcile them before anything goes to the board.

**Every board metric is doubled.** Pipeline, bookings, win rate, average deal size, sales-cycle length, forecast — each of these exists in two systems with two definitions and two sets of records. Before the CRO can present pipeline, RevOps has to reconcile: which deals exist in both, which in one, which are duplicated, which stage mappings differ, which currency or date conventions differ.

**The RevOps hours.** This reconciliation is not a one-time project; it recurs every reporting cycle — every weekly forecast call, every monthly business review, every board deck. Realistically this is **8-20 hours per reporting cycle** of senior RevOps time during the parallel run, on top of the de-duplication and sync work already counted in the failure-tax layer. Over six months of weekly and monthly cycles, that is **$20,000-$60,000** of loaded RevOps cost.

**The credibility cost.** This one does not have a clean dollar figure but it is real and sometimes the most damaging. When the CRO presents a number and a board member asks "is that the Salesforce number or the HubSpot number?", confidence erodes. When two VPs argue about whose pipeline is right, decision-making slows. When the forecast misses and the post-mortem reveals it was a reconciliation error, not a sales error, the whole revenue-operations function loses standing. A dual-CRM period quietly taxes the *trustworthiness* of the revenue numbers, and rebuilding that trust after consolidation takes time.

## Training And Enablement Duplication

Every dual-CRM period also taxes the enablement function, in two ways.

**New hires learn two systems — or you split the team.** A sales rep hired during the parallel run either has to be trained on both CRMs (longer onboarding, more confusion, slower ramp) or has to be assigned to a "side" — which fragments the team and creates a two-tier workforce mid-migration. Neither is good. Onboarding ramp time, already a closely watched metric, gets a measurable drag: a rep who would be productive in 30 days takes 40-50 because half their CRM training is on a system that is about to be retired.

**Enablement content is doubled or dual-tracked.** Playbooks, process docs, "how to log a deal" guides, manager coaching frameworks — all of it either gets written twice or gets written with awkward "if you're on Salesforce do this, if you're on HubSpot do this" branches. The enablement team spends real cycles maintaining content for a system that is being sunset, which is a particularly demoralizing form of waste.

**The change-fatigue compounding.** Reps are being asked to learn the new system *while still using the old one*. That is the hardest possible learning context — there is no clean break, no "this is how we do it now," just an extended period of ambiguity. Change fatigue during a long parallel run is a real driver of the adoption problems that, ironically, then get used as the excuse to *extend* the parallel run further.

Realistic six-month training/enablement duplication cost: **$8,000-$20,000** for a 30-rep org, **$20,000-$50,000** for a 75-rep org, **$45,000-$100,000** for a 150-rep org — counting enablement labor plus the quantified ramp drag on reps hired during the window.

## The Opportunity Cost Layer — The Roadmap That Stalls

This is the largest invisible cost and the one that compounds worst, because it is not a cost you *pay* — it is value you *fail to create*.

While RevOps and the CRM admins are babysitting two systems — maintaining the sync, de-duping records, reconciling reports, answering "where do I look" tickets — they are not doing the work that actually grows revenue efficiency. The lead-routing optimization that would lift conversion. The forecasting-model rebuild. The territory redesign. The new sales-process instrumentation. The data-quality initiative. The integration with the product-usage data that would enable PLG signals. All of it stalls, because the team that would build it is fully consumed by keeping a temporary state alive.

For most organizations, the RevOps roadmap is worth more than the RevOps salary — that is the entire premise of investing in revenue operations. So when a parallel run consumes 0.5-1.5 FTE of RevOps capacity for six months (and often much longer), the cost is not just the salary of that capacity — it is the *return* that capacity would have generated. Conservatively, value the stalled roadmap at **$40,000-$150,000** over six months for a mid-size org, and understand that this number grows the longer the parallel run drags. It is also the cost most likely to be *permanent* damage: a roadmap delayed six months is a roadmap delayed six months, but a RevOps team that spends 18 months in firefighting mode often loses the people who would have built the roadmap at all.

## The Realistic 6-Month Total — Three Worked Models

Pulling every layer together into line-item models. These are planning estimates with ranges; the point is the *shape* of the stack, not false precision.

**Model A — 30-rep org, clean migration overlap.**
- Duplicated licenses: ~$48,000-$57,000
- Integration / middleware (native connector or light iPaaS + setup): ~$15,000-$45,000
- Data-sync failure tax (reconciliation labor): ~$20,000-$35,000
- Duplicated admin: ~$20,000-$40,000
- Duplicated tooling: ~$10,000-$25,000
- Process tax (lost selling hours): ~$90,000-$160,000
- Reporting reconciliation: ~$15,000-$30,000
- Training / enablement duplication: ~$8,000-$18,000
- Opportunity cost (stalled roadmap): ~$30,000-$70,000
- **6-month total: ~$140,000-$260,000.** License duplication is only ~30-35% of the visible-plus-invisible total; the process tax alone rivals or exceeds the entire license line.

**Model B — 75-rep org, post-merger consolidation.**
- Duplicated licenses: ~$140,000-$155,000
- Integration / middleware (enterprise iPaaS + consultant setup): ~$45,000-$110,000
- Data-sync failure tax: ~$40,000-$70,000
- Duplicated admin (likely dedicated coverage both sides): ~$55,000-$110,000
- Duplicated tooling: ~$30,000-$65,000
- Process tax: ~$250,000-$400,000
- Reporting reconciliation: ~$30,000-$55,000
- Training / enablement duplication: ~$25,000-$50,000
- Opportunity cost: ~$60,000-$130,000
- **6-month total: ~$420,000-$780,000.**

**Model C — 150-rep org, large enterprise migration with consultants.**
- Duplicated licenses: ~$280,000-$300,000
- Integration / middleware (MuleSoft/Boomi/Workato + significant SI build): ~$90,000-$220,000
- Data-sync failure tax: ~$70,000-$140,000
- Duplicated admin (full dedicated teams both platforms): ~$110,000-$200,000
- Duplicated tooling (rich enterprise sales-tech stack): ~$60,000-$130,000
- Process tax: ~$520,000-$760,000
- Reporting reconciliation: ~$50,000-$95,000
- Training / enablement duplication: ~$50,000-$110,000
- Opportunity cost: ~$110,000-$250,000
- Migration consultants (Slalom, Deloitte, IBM, Accenture, Cognizant) — note this is migration cost, not pure parallel-run cost, but it lands in the same window: often **$150,000-$600,000+** for a 150-rep migration
- **6-month parallel-run total (excluding the SI migration fee): ~$900,000-$1.7M; including a meaningful slice of consultant cost, the $1.2M-$2.5M figure quoted for large dual-runs is entirely credible.**

The consistent pattern across all three models: **licenses are 25-40% of the total, the process tax is the largest single layer, and the soft costs collectively exceed the hard costs.**

## The "It's Only Temporary" Trap

Here is the most important behavioral fact about dual-CRM periods: **they almost always run 2-3x longer than planned.** The 6-month plan becomes 12. The 12-month plan becomes 20. Post-merger "phase 2" consolidations notoriously drag past 24 months.

The reasons are structural, not incidental. Migration is hard work with no glory — finishing the migration does not ship a feature or close a deal, so it loses every priority fight. The cutover date is usually owned by nobody, or owned by someone without the authority to force it. Each month of delay makes the *next* month's delay easier to accept ("we've already run parallel for eight months, what's one more?"). And the people who would push for the cutover — RevOps, the admins — are the same people drowning in the parallel-run maintenance, so they have no slack to drive the finish.

The cost implication is severe because **the cost stack is roughly linear in duration.** Every layer except some of the one-time setup costs recurs monthly. So a parallel run that doubles from 6 to 12 months does not cost a little more — it costs *close to twice as much*. A 30-rep org's $140K-$260K six-month run becomes a $280K-$500K year. A 75-rep org's $420K-$780K becomes $850K-$1.5M. And the opportunity cost is *worse* than linear, because a RevOps team stuck in firefighting mode for 18 months loses momentum, loses people, and loses the institutional knowledge to execute the roadmap even after the parallel run finally ends.

The trap, stated plainly: every stakeholder evaluates the parallel run as a *6-month cost* because that is the plan, when they should evaluate it as a *14-20 month cost* because that is the realistic outcome. The single most valuable thing a RevOps or finance leader can do is reframe the decision around the realistic duration — and attach a named owner and a hard date to the cutover, because an undated migration is a permanent dual-CRM state wearing a disguise.

## When Dual-CRM Is Actually Defensible

Not every dual-CRM state is migration limbo. There is a genuinely defensible version: a **true department split**, architected on purpose, where each platform is best-of-breed for its function and the "two systems" are not a transition state but a deliberate, permanent architecture.

The classic example is **Marketing on HubSpot, Sales on Salesforce.** HubSpot's marketing automation, content tools, email, and landing-page ecosystem are genuinely strong; Salesforce's sales-process depth, customization ceiling, and enterprise reporting are genuinely strong. An organization can decide — deliberately — that marketing operates in HubSpot, sales operates in Salesforce, and the handoff point (MQL to SQL, lead to opportunity) is a clean, well-defined, one-directional sync. This is not a cost to eliminate. It is a best-of-breed architecture, and it can be the right answer.

But "defensible" comes with conditions, and they are strict:
- **The boundary must be clean.** Marketing owns the contact and the lead up to a defined handoff; sales owns the opportunity and the account from the handoff forward. There must be no overlapping ownership of the same object.
- **The sync must be one-directional at the boundary.** Leads flow marketing-to-sales; closed-loop attribution data flows back on a narrow, defined field set. It is not a full bidirectional mirror.
- **Source of truth must be unambiguous per object.** HubSpot is the source of truth for marketing engagement; Salesforce is the source of truth for the opportunity and the forecast. Written down. Enforced.
- **It must be a *decision*, not a *drift*.** The difference between defensible dual-CRM and accidental dual-CRM is whether someone deliberately chose it, documented it, and owns it.

If those conditions hold, the ongoing cost of a permanent split is real but bounded and *worth it* — you are paying for genuine best-of-breed capability, not for migration limbo. If those conditions do not hold — if the boundary is fuzzy, the sync is bidirectional, the source of truth is "it depends" — then it is not a defensible split, it is an accidental dual-CRM state that should be consolidated.

## Minimizing The Cost — The One-Way-Sync Discipline

If you are going to run two CRMs — whether as a migration overlap or a permanent split — the single highest-leverage cost-control decision is **sync topology**, and the disciplined answer is almost always **one-way sync with a designated source of truth**.

The principle: **designate one system as the single source of truth. Make the other system read-only (or write-only on a narrow, defined field set). Sync flows one direction.** During a migration, the source of truth is usually the system you are migrating *to* — reps work in the new system, the old system is read-only reference data that does not need to receive updates because it is being retired. During a permanent department split, each object has a source of truth and the sync at the boundary is one-directional.

Why this is so much cheaper than bidirectional sync:
- **Conflicts become impossible.** If only one system can write a field, there is no "who wins" question. The entire conflict-resolution category of the sync failure tax disappears.
- **Duplicate records collapse.** Most duplication comes from two systems independently creating records; with a one-way flow and a clear creation owner, duplication drops dramatically.
- **Reps have an unambiguous answer.** "Where do I update this?" has exactly one answer: the source of truth. The process tax shrinks because the ambiguity that drives it is gone.
- **Reconciliation simplifies.** When one system is authoritative, the board number is the authoritative system's number. Reconciliation becomes spot-checking, not investigation.
- **Maintenance shrinks.** A one-directional mapping is far simpler to build and maintain than a bidirectional one with field-level direction rules and conflict policies.

Realistically, **a one-way sync architecture costs 40-60% less than a bidirectional one** across the failure-tax, process-tax, reconciliation, and maintenance layers combined. The trade-off is discipline: reps and admins have to actually respect the read-only system, and the temptation to "just quickly fix this in the old system" has to be resisted. But that discipline is far cheaper than the bidirectional sync tax. The mistake most organizations make is defaulting to bidirectional sync because it "feels safer" — when in fact bidirectional sync is the single most expensive choice in the entire dual-CRM cost stack.

## Minimizing The Cost — The Hard Cutover Alternative

The other major cost-control strategy is more aggressive: **do not run a long parallel period at all. Do a fast, clean cutover.**

The case for the hard cutover rests directly on the linearity of the cost stack. If every month of parallel operation costs $25K-$130K+ depending on org size, then the parallel period is not a "safety buffer" — it is a meter running. A hard cutover front-loads risk (the cutover weekend is intense and there is a real chance of disruption) but it *caps the meter*. A 6-week parallel period instead of a 6-month one is not 25% of the cost — because the one-time costs (migration build, training, consultant setup) are similar either way, but the *recurring* costs (duplicate licenses, process tax, duplicated admin, reconciliation) are slashed by ~75%.

The hard cutover playbook: migrate the data in advance into the new system, validate it thoroughly in a sandbox, run a tight 2-6 week parallel period purely for validation and training (not for indefinite "both systems live" operation), pick a hard cutover date — usually a weekend — flip the org to the new system, keep the old system read-only for a defined reference window (30-90 days), and have a documented rollback plan in case the cutover fails badly enough to warrant it.

The cost comparison is stark. A 75-rep org running a "safe" 12-month parallel period might spend $850K-$1.5M. The same org doing a hard cutover with a 6-week validation overlap might spend $200K-$350K all-in — the migration build and training cost roughly the same, but the recurring dual-run tax is compressed from twelve months to six weeks. The hard cutover is not reckless; *the long parallel run is the expensive choice that masquerades as the safe one.* The genuinely reckless option is the undated parallel run that nobody owns.

The legitimate counter is that some migrations genuinely cannot do a clean hard cutover — extremely complex orgs, heavily regulated environments, mission-critical integrations that must be migrated incrementally. For those, the answer is not "long bidirectional parallel run" — it is "phased cutover by team or by region, each phase a hard cutover for that segment, with one-way sync between migrated and not-yet-migrated segments." Phasing the hard cutover is still vastly cheaper than running everything in bidirectional parallel for a year.

## The Migration Timeline That Minimizes Overlap

Compressing the parallel period is a project-management discipline. The timeline that minimizes overlap looks roughly like this.

**Pre-overlap (weeks -8 to 0): build everything before the meter starts.** Configure the destination CRM completely — objects, fields, automation, permissions, integrations, reports. Map the data migration in detail. Build and test the migration in a sandbox. Rebuild the ISV integrations against the destination system. Build the enablement content. Critically: **do as much as possible before any duplicate-license meter is running.** The single biggest timeline mistake is buying the new platform and *then* starting to configure it, which puts the org into expensive parallel state during work that could have happened during a cheap evaluation/sandbox phase.

**Data migration sequencing.** Migrate in the right order: accounts and contacts first (the foundation), then historical opportunities/deals, then activities and notes, then attachments. Run the migration in waves with validation gates — do not migrate everything and then check; migrate a batch, validate it, fix the mapping, migrate the next. The goal is that by the time the org goes live on the new system, the data is already there and verified.

**The validation overlap (2-6 weeks): short and purposeful.** This is the only truly necessary parallel period. Both systems are live, but the new system is the source of truth and the old one is reference. Reps are being trained and are working in the new system; the old system is available for "where was this account history" lookups. This window is for catching the things sandbox testing missed, not for indefinite dual operation.

**The cutover weekend.** A defined date. Final data delta migration (anything that changed during the validation window). Integration cutover. Old system flipped to read-only. Communication to the whole org: as of Monday, the new system is the system. A go/no-go decision made by a named owner on the Friday.

**The rollback plan.** Documented before the cutover: what conditions trigger a rollback, how the rollback is executed, who decides. The rollback plan is what makes the hard cutover *safe* — it is the safety net that lets you compress the timeline aggressively without recklessness.

**Post-cutover (30-90 days): the reference window, then decommission.** Keep the old system read-only for a defined window for reference and edge-case recovery, then **actually decommission it** — cancel the licenses, turn off the integrations, archive the data. The decommission is a step organizations routinely forget, and a forgotten old CRM is just a smaller version of the dual-CRM cost continuing indefinitely.

The whole discipline can be summarized: **build before the meter runs, sequence the data, keep the live overlap short and purposeful, cut over hard on a named date with a rollback plan, and actually decommission.** That is how a "6-month parallel run" becomes a 6-week one.

## Hidden Costs People Forget

Beyond the seven main layers, a thorough estimate should account for the costs that consistently get missed.

**Sandbox and testing environments, doubled.** Both CRMs need sandbox/test environments during the migration — Salesforce sandboxes (especially full-copy sandboxes) carry real cost, and the testing infrastructure for both platforms has to be maintained simultaneously.

**Security and compliance audits, doubled.** If the org is SOC 2, ISO 27001, HIPAA, or GDPR-scoped, both CRMs are now in scope for audits, access reviews, and data-processing assessments. That is doubled audit prep, doubled access-review labor, and doubled vendor-risk-management overhead for the duration.

**SSO and provisioning complexity.** Both systems have to be wired into the identity provider, with SCIM provisioning, group mappings, and access policies maintained in two places. Joiner/mover/leaver processes get more complex and more error-prone — and an offboarded employee who still has access to the "old" CRM is a real security gap.

**Integration-user licensing.** The sync itself usually consumes a license (or an API-only/integration seat) on each platform, and high-volume syncs can hit API limits that force a higher tier or paid API capacity. This is a small line but it is genuinely forgotten in nearly every initial estimate.

**Data egress and storage.** Migrating large data volumes, storing data redundantly in both systems during the overlap, and any data-warehouse syncing all carry storage and sometimes egress cost.

**The "shadow" admin work absorbed by non-admins.** When the official admin coverage is stretched, sales managers and ops-adjacent people quietly absorb CRM-fixing work. It does not show up in any budget, but it is real lost capacity.

**Renewal-timing mismatches.** If the outgoing platform's renewal lands mid-migration, you may be forced into a short-term renewal or a co-term penalty — paying for a full term of a system you are weeks from retiring.

None of these is the biggest line item, but together they routinely add **10-20%** to an estimate that only counted the seven main layers — and they are the costs that make the "realistic" total reliably higher than the "planned" total.

## The Decision Framework

Every dual-CRM cost question resolves to one diagnostic question, and the answer routes to one of two playbooks.

**The diagnostic question: is this a migration overlap, or a permanent department split?**

**If it is a migration overlap** (Origins 1 and 2 — you intend to end up on one CRM): the cost is a *temporary expense to compress*. The playbook is:
1. Name an owner for the cutover date — a single person with the authority to force it.
2. Set a hard cutover date and treat every month of slip as a quantified five-to-six-figure line item.
3. Build everything possible before the duplicate-license meter starts.
4. Use a one-way sync — the destination system is the source of truth, the old system is read-only.
5. Run a short (2-6 week) validation overlap, not an indefinite parallel run.
6. Cut over hard on the named date with a documented rollback plan.
7. Decommission the old system on a defined timeline — and actually do it.

**If it is a permanent department split** (a deliberate Marketing-HubSpot / Sales-Salesforce best-of-breed architecture): the cost is an *ongoing investment to architect cleanly*. The playbook is:
1. Confirm it is a *decision*, not a *drift* — if nobody chose it, it is not a defensible split.
2. Define a clean object boundary — no overlapping ownership of the same object.
3. Make the boundary sync one-directional on a narrow, defined field set.
4. Document source of truth per object, unambiguously, and enforce it.
5. Accept and budget the bounded ongoing cost as the price of genuine best-of-breed capability.
6. Re-examine the decision annually — best-of-breed advantages erode as both platforms expand.

**If you cannot answer the diagnostic question** — if it is genuinely unclear whether you are mid-migration or permanently split — *that is the finding*. An undiagnosed dual-CRM state is an accidental one, and the first action is to force the decision: pick migration-or-split, and then run the corresponding playbook.

## How To Present The Cost To Leadership

The reason "let's just keep both for now" survives is that the costs that keep a parallel run alive are the invisible ones. The leadership conversation that actually changes the decision is the one that **makes the invisible costs visible** and prices them honestly.

**Put all seven layers on one slide.** Not just the license line — the license line *plus* integration, sync tax, duplicated admin, duplicated tooling, process tax, reconciliation, and opportunity cost. The shock value of the slide is the moment the CFO sees that licenses are only 25-40% of the total. That single visual reframes the entire conversation, because the CFO's prior mental model ("it's roughly 2x license") gets replaced with the real number.

**Price the realistic duration, not the optimistic one.** Present the 6-month number and the 14-20 month number side by side, and be explicit that dual-CRM periods historically run 2-3x over plan. The honest framing: "If we execute perfectly, it is $X. If we behave like the average company, it is $2X-$3X. Which number should we plan around?"

**Put opportunity cost on the same slide as the license cost.** Finance is comfortable with invoiced costs and uncomfortable with opportunity cost — so the job is to make the opportunity cost concrete. Name the specific RevOps roadmap items that are stalled. Attach the revenue-efficiency value those items would have created. The line "our RevOps team is spending 1 FTE babysitting a temporary state instead of building the lead-routing optimization we projected at $Y" is far more persuasive than an abstract "opportunity cost."

**Frame the hard cutover as the *fiscally conservative* option.** The instinct in the room will be that a long parallel run is the "safe" choice and a hard cutover is "risky." Invert it: the long parallel run is the expensive choice with an open-ended meter; the hard cutover with a rollback plan is the cost-capped, risk-managed choice. The CFO is the natural ally here once the meter is made visible.

**Give the "keep both" instinct a price, not a veto.** The goal is not to forbid anyone from wanting to keep both — it is to make sure that when someone says "let's just keep both," the response is "that is a $X/month decision, here is who owns that cost, and here is the date by which we revisit it." A priced decision is a manageable decision. An unpriced one is the trap.

## Five Real-World Scenarios

**Scenario 1 — The 6-month planned migration overlap.** A 60-rep SaaS company decides to move from Salesforce to HubSpot. The plan is a clean 6-month overlap. They execute reasonably well: native connector for the sync, one-way (HubSpot as destination source of truth), tight enablement. They still spend ~$300K-$450K over the period, dominated by the process tax and duplicated licenses, but they hit the cutover roughly on time because RevOps owned the date. *The lesson: even a well-run overlap is expensive — the win was finishing on time.*

**Scenario 2 — The post-merger dual-org that dragged 18 months.** Two companies merge; one on Salesforce, one on HubSpot. CRM consolidation slips to "phase 2," then phase 2 slips. Eighteen months later both systems are still live, the sync is bidirectional and conflict-ridden, and the cumulative cost has crossed seven figures with the opportunity cost uncountable because the combined RevOps team never got off the treadmill. *The lesson: the absence of a named cutover owner is what turns a 6-month overlap into an 18-month bleed.*

**Scenario 3 — The intentional Marketing/Sales split.** A 200-person company runs HubSpot for all of marketing and Salesforce for all of sales, on purpose, with a clean MQL-to-SQL handoff and a one-way boundary sync. It costs real money every year — but it is documented, owned, and re-examined annually, and the marketing team genuinely outperforms because of HubSpot's tooling. *The lesson: a decided, architected split is a legitimate strategy, not a failure state.*

**Scenario 4 — "The VP of Sales won't give up Salesforce."** A company migrates to HubSpot, but the VP of Sales refuses, so sales stays on Salesforce while everyone else moves. There is no architectural reason — it is preference and politics. The org now pays the full dual-CRM stack for a non-architectural reason. *The lesson: when the dual-CRM driver is political, the fix is not technical — it is making the cost visible to the person blocking consolidation, and getting an executive to own the decision either way.*

**Scenario 5 — The startup that signed HubSpot then got acquired onto Salesforce.** A 40-rep startup runs HubSpot, gets acquired by an enterprise standardized on Salesforce, and is told to migrate. The acquirer underestimates the overlap cost, the startup's RevOps team is tiny, and the parallel period drags because nobody resourced the cutover. *The lesson: acquirers routinely under-budget the integration overlap — the dual-CRM cost should be a named line in the integration plan, with dedicated resourcing, not an afterthought.*

## The Total Cost Of Ownership Comparison

The decision that matters is not "should we run two CRMs" — by the time the question is asked, you already are. The decision is **how long, and with what topology.** That resolves to a TCO comparison between two paths.

**Path A — the long bidirectional parallel run.** Twelve months, both systems fully writable, bidirectional sync. For a 75-rep org: ~$850K-$1.5M, with the opportunity cost compounding and a real risk it drags to 18+ months. The "advantage" is that it feels safe and defers the scary cutover. The reality is an open-ended meter and a RevOps team that loses momentum.

**Path B — the compressed hard cutover.** Six-to-eight-week validation overlap, one-way sync, hard cutover on a named date, rollback plan ready. For the same 75-rep org: ~$200K-$350K all-in. The migration build and training cost roughly the same as Path A — those are not the savings. The savings are the *recurring* dual-run tax, compressed from twelve months to eight weeks. The "disadvantage" is an intense cutover weekend and the discipline required to hit the date. The reality is a capped, predictable cost and a RevOps team back on the roadmap by month three.

The TCO math is not close. Path B is typically **50-75% cheaper** than Path A, and the gap *widens* every month Path A drags. The only legitimate reason to choose a longer parallel run is genuine technical necessity — an org so complex or so regulated that a clean cutover is impossible — and even then the answer is a *phased* hard cutover (team-by-team, region-by-region), not an indefinite bidirectional parallel run. The single most expensive mistake in CRM migration is treating the long parallel run as the safe default. It is the expensive default.

## 5-Year Outlook

By 2030, three forces reshape the dual-CRM cost question.

**AI-assisted migration tooling lowers switching cost.** The hardest, most labor-intensive parts of a CRM migration — data mapping, deduplication, field reconciliation, automation translation between platforms — are exactly the parts that AI tooling is getting good at. Migration that took a quarter of skilled human effort compresses toward weeks. That lowers the cost of *finishing* a migration, which means the economically rational parallel period gets shorter, and the "it's too painful to migrate" excuse for permanent dual-CRM states weakens considerably.

**Consolidation pressure intensifies.** Both Salesforce and HubSpot keep expanding into each other's territory — HubSpot moving up-market into enterprise sales depth, Salesforce pushing down into the mid-market with simpler products. The best-of-breed argument for a deliberate Marketing/Sales split erodes as each platform's "weak side" gets stronger. By 2030, fewer permanent splits will be genuinely defensible on capability grounds — more of them will be legacy drift that should be consolidated. Meanwhile, finance scrutiny of redundant SaaS spend keeps rising, and "we run two CRMs" is an increasingly hard line to defend in a budget review.

**The cost of the soft layers does not fall as fast as the hard layers.** AI tooling will compress the migration-build cost and some of the sync-maintenance cost. But the process tax, the reconciliation cost, and the opportunity cost are *organizational* costs, not technical ones — they come from humans being confused and from teams being distracted, and those do not get automated away. So by 2030 the cost mix shifts even further toward the soft, invisible layers, which makes the "make the invisible costs visible" leadership discipline *more* important, not less.

Net 2030 view: dual-CRM as a *deliberate permanent architecture* becomes rarer and harder to justify; dual-CRM as a *migration overlap* gets cheaper to end and therefore less excusable to prolong. The strategic posture that ages well is the one this entry argues for throughout — diagnose migration-vs-split honestly, compress overlaps ruthlessly, architect genuine splits cleanly, and never let a parallel run go undated, unowned, and unpriced.

## Final Framework

**The 6-month cost model template.** Estimate all seven layers, not just licenses: (1) duplicated licenses, (2) integration/middleware including consultant setup, (3) data-sync failure tax, (4) duplicated admin, (5) duplicated tooling, (6) process tax in lost selling hours, (7) reporting reconciliation plus opportunity cost. Expect licenses to be 25-40% of the total and the process tax to be the largest single layer. Add 10-20% for the forgotten hidden costs. Then *double or triple* the recurring portion to model the realistic 14-20 month duration, because that is what actually happens.

**The minimize-the-overlap playbook.** Build everything before the duplicate-license meter starts. Use a one-way sync with a single designated source of truth — never default to bidirectional. Sequence the data migration in validated waves. Keep the live overlap to 2-6 weeks of purposeful validation, not indefinite parallel operation. Cut over hard on a named date owned by a named person, with a documented rollback plan. Decommission the old system on a defined timeline and actually do it.

**The leadership-conversation script.** "Running both CRMs is not a 2x-license cost — it is a seven-layer cost stack, and licenses are only about a third of it. Here is the slide with all seven layers. The realistic duration is not six months, it is fourteen to twenty, because dual-CRM periods run two-to-three times over plan. The long parallel run is not the safe option — it is an open-ended meter; the hard cutover with a rollback plan is the cost-capped, fiscally conservative option. If we want to keep both anyway, that is a legitimate choice — but it is a priced choice, it needs a named owner, and we revisit it on a date. What it cannot be is undated, unowned, and unpriced."

**The one-sentence version.** The realistic 6-month cost of running HubSpot and Salesforce in parallel is a seven-layer stack where licenses are only a third of the total and the soft costs are the larger, invisible half — so diagnose whether you are mid-migration or permanently split, compress overlaps ruthlessly with a one-way sync and a hard cutover, architect genuine splits cleanly, and make every layer of the cost visible to leadership so the "let's just keep both" instinct gets priced instead of defaulted into.

`;

const flow = `

## The Dual-CRM Cost Stack

\`\`\`mermaid
flowchart TD
  A[Realistic 6-Month Dual-CRM Cost] --> L1[Layer 1 Duplicated Licenses]
  A --> L2[Layer 2 Integration And Middleware]
  A --> L3[Layer 3 Data Sync Failure Tax]
  A --> L4[Layer 4 Duplicated Admin]
  A --> L5[Layer 5 Duplicated ISV Tooling]
  A --> L6[Layer 6 The Process Tax]
  A --> L7[Layer 7 Reconciliation And Opportunity Cost]
  L1 --> V1[Visible Hard Cost ~25-40% Of Total]
  L2 --> V1
  L3 --> V2[Invisible Soft Cost ~60-75% Of Total]
  L4 --> V2
  L5 --> V2
  L6 --> V2
  L7 --> V2
  V1 --> T[Realistic Total]
  V2 --> T
  T --> M30[30 Reps ~140K-260K Six Months]
  T --> M75[75 Reps ~420K-780K Six Months]
  T --> M150[150 Reps ~900K-1.7M Six Months]
  M30 --> D[Cost Is Roughly Linear In Duration]
  M75 --> D
  M150 --> D
  D --> W[Dual-CRM Runs Run 2-3x Over Plan]
  W --> X[6-Month Plan Becomes 14-20 Months]
  X --> Y[Compression Is The Dominant Cost Lever]
\`\`\`

## The Decision Tree — Migration Overlap Versus Permanent Split

\`\`\`mermaid
flowchart TD
  A[Why Are Two CRMs Live] --> B{Migration Overlap Or Permanent Split}
  B -->|Migration Overlap| C[Cost Is Temporary Expense To Compress]
  B -->|Permanent Department Split| D[Cost Is Ongoing Investment To Architect]
  B -->|Cannot Answer| E[Accidental Dual-CRM Force The Decision First]
  E --> B
  C --> C1[Name A Cutover Owner With Authority]
  C1 --> C2[Set A Hard Cutover Date]
  C2 --> C3[Build Everything Before Meter Starts]
  C3 --> C4[One-Way Sync Destination Is Source Of Truth]
  C4 --> C5[Short 2-6 Week Validation Overlap]
  C5 --> C6[Hard Cutover Plus Rollback Plan]
  C6 --> C7[Decommission Old System On Defined Date]
  C7 --> F[Result Cost Capped 50-75% Cheaper]
  D --> D1[Confirm It Is A Decision Not A Drift]
  D1 --> D2[Define Clean Object Boundary No Overlap]
  D2 --> D3[One-Directional Boundary Sync Narrow Field Set]
  D3 --> D4[Document Source Of Truth Per Object]
  D4 --> D5[Budget Bounded Ongoing Cost]
  D5 --> D6[Re-Examine The Split Annually]
  D6 --> G[Result Legitimate Best-Of-Breed Architecture]
  F --> H[Make All Seven Cost Layers Visible To Leadership]
  G --> H
\`\`\`

`;

const src = `

## Sources

1. **Salesforce Sales Cloud Pricing** — Per-user pricing tiers (Professional, Enterprise ~$165/user/mo, Unlimited); annual contract and seat-reduction-at-renewal mechanics. https://www.salesforce.com/sales/pricing/
2. **HubSpot Sales Hub Pricing** — Sales Hub Professional (~$100/user/mo) and Enterprise (~$150/user/mo) seat pricing and minimum-commitment structure. https://www.hubspot.com/pricing/sales
3. **HubSpot-Salesforce Native Integration Documentation** — Capabilities and limits of the native connector: object sync, selective sync inclusion lists, field mapping, sync rules. https://knowledge.hubspot.com/salesforce
4. **Workato Pricing And Platform Documentation** — Enterprise iPaaS pricing model and CRM-sync recipe architecture. https://www.workato.com
5. **Tray.io Platform Documentation** — iPaaS integration platform for CRM and revenue-system orchestration. https://tray.io
6. **Boomi Integration Platform** — Enterprise iPaaS used for CRM migration and bidirectional sync workloads. https://boomi.com
7. **MuleSoft Anypoint Platform (Salesforce)** — Enterprise integration platform; setup and licensing cost profile for CRM sync. https://www.mulesoft.com
8. **Zapier Pricing** — Lightweight automation/integration tooling for simpler CRM sync use cases. https://zapier.com/pricing
9. **Gartner — CRM And Sales Force Automation Market Research** — Market context on CRM consolidation, migration patterns, and dual-system prevalence.
10. **Forrester — Total Economic Impact Methodology** — Framework for quantifying soft costs, opportunity cost, and productivity impact in technology decisions.
11. **Salesforce Sandbox Documentation** — Sandbox types (Developer, Partial Copy, Full Copy) and their cost implications during migration testing. https://help.salesforce.com
12. **Gong Integration Documentation** — Conversation-intelligence platform CRM connection model and configuration requirements. https://www.gong.io
13. **Outreach / Salesloft CRM Integration Documentation** — Sales-engagement platform CRM-sync and activity-logging architecture.
14. **ZoomInfo CRM Integration Documentation** — Data-provider CRM enrichment connection model. https://www.zoominfo.com
15. **LeanData Routing Documentation** — Lead-to-account matching and routing; behavior under duplicate-record and dual-CRM conditions. https://www.leandata.com
16. **Clari Revenue Platform Documentation** — Forecasting platform CRM-data dependency and reconciliation behavior. https://www.clari.com
17. **DocuSign / Chili Piper CRM Integration Documentation** — Per-connection configuration and licensing considerations for CRM-adjacent tools.
18. **Slalom, Deloitte, IBM, Accenture, Cognizant — CRM Migration Consulting Practices** — Systems-integrator CRM migration engagement scope and cost profiles for mid-to-large orgs.
19. **SOC 2 / ISO 27001 Audit Scoping Guidance** — Both-CRM-in-scope implications for access reviews and vendor risk management during parallel operation.
20. **Okta / Microsoft Entra SCIM Provisioning Documentation** — Identity-provider integration and joiner/mover/leaver provisioning complexity across multiple CRM systems.
21. **Salesforce API Limits Documentation** — Per-edition API call limits affecting integration-user licensing and sync throughput during high-volume parallel sync. https://developer.salesforce.com
22. **HubSpot API Usage And Limits** — API rate limits and integration considerations for sync workloads. https://developers.hubspot.com
23. **Pulse RevOps Migration Practice Notes** — Internal benchmark data on dual-CRM duration overruns (observed 2-3x over plan) and one-way vs bidirectional sync cost differential.
24. **G2 / TrustRadius CRM Migration Reviews** — Practitioner-reported migration timelines, cost surprises, and parallel-run pain points.
25. **HubSpot And Salesforce Data Model Documentation** — Differences in object models, deal/opportunity stages, multi-select fields, and ownership models that drive field-mapping maintenance cost.

`;

const num = `

## Numbers

**Per-Seat License Pricing (2026-2027, list)**
- Salesforce Sales Cloud Enterprise: ~$165/user/mo
- Salesforce Sales Cloud Professional: lower; Unlimited: higher
- HubSpot Sales Hub Professional: ~$100/user/mo
- HubSpot Sales Hub Enterprise: ~$150/user/mo
- Typical negotiated discount off list: 15-35% (more for multi-year)

**Duplicated License Cost — 6 Months, All Users On Both**
- 30 users: SF $29,700 + HS Enterprise $27,000 = ~$56,700 (HS Pro: ~$47,700)
- 50 users: SF $49,500 + HS Enterprise $45,000 = ~$94,500
- 100 users: SF $99,000 + HS Enterprise $90,000 = ~$189,000
- 150 users: SF $148,500 + HS Enterprise $135,000 = ~$283,500

**Integration / Middleware Layer**
- Native HubSpot-Salesforce connector: included in HS Pro/Enterprise; cost is mostly labor
- Enterprise iPaaS subscription (Workato/Boomi/MuleSoft) for CRM sync: ~$2,000-$8,000+/mo
- Consultant-built iPaaS setup: ~$15,000-$80,000+ one-time
- iPaaS all-in for 6-month run (setup amortized + subscription): ~$25,000-$120,000
- Field-mapping maintenance labor: 4-12 hrs/mo; ~$8,000-$25,000 over 6 months
- Total integration layer, mid-size 6-month run: ~$35,000-$145,000

**Data-Sync Failure Tax**
- Reconciliation / de-dup / conflict labor: ~0.5-1.5 FTE distributed
- 6-month cost: ~$25,000-$75,000 (pure tax, produces nothing)
- One-way sync reduces this layer by 50%+ vs bidirectional

**Duplicated Admin Cost — 6 Months**
- 30-rep org: ~$20,000-$45,000
- 75-rep org: ~$45,000-$95,000
- 150-rep org: ~$90,000-$180,000+
- Salesforce admin and HubSpot admin are usually different skillsets

**Duplicated Tooling Cost — 6 Months**
- 30-rep org: ~$10,000-$30,000
- 75-rep org: ~$25,000-$65,000
- 150-rep org: ~$50,000-$130,000
- Driven by richness of stack (Gong + Outreach + ZoomInfo + Clari + LeanData = top of range)

**Process Tax — Lost Selling Hours**
- Friction per rep per day: ~15-30 min (midpoint ~20 min)
- Hours lost per rep over 6 months (~125 working days): ~42 hrs
- Value per lost selling hour: ~$75-$150
- 30-rep org: ~30 x 42 x $110 ≈ $139,000
- 75-rep org: ≈ $347,000
- 150-rep org: ≈ $693,000
- Frequently the single largest layer in the stack

**Reporting Reconciliation Cost**
- Senior RevOps reconciliation: ~8-20 hrs per reporting cycle
- 6-month cost (weekly + monthly cycles): ~$20,000-$60,000
- Plus uncountable credibility cost

**Training / Enablement Duplication — 6 Months**
- 30-rep org: ~$8,000-$20,000
- 75-rep org: ~$20,000-$50,000
- 150-rep org: ~$45,000-$100,000
- New-hire ramp drag: ~30 days becomes ~40-50 days

**Opportunity Cost — Stalled RevOps Roadmap**
- 6-month value of stalled roadmap, mid-size org: ~$40,000-$150,000
- Grows worse-than-linearly with duration (team momentum/retention loss)

**Realistic 6-Month Totals (All Seven Layers)**
- 30-rep org (clean migration overlap): ~$140,000-$260,000
- 75-rep org (post-merger consolidation): ~$420,000-$780,000
- 150-rep org (large enterprise migration): ~$900,000-$1.7M
- 150-rep including consultant slice: $1.2M-$2.5M is credible
- Migration consultants (Slalom/Deloitte/IBM/Accenture/Cognizant), 150-rep: ~$150,000-$600,000+

**Cost Mix — Consistent Pattern**
- Duplicated licenses: ~25-40% of total
- Process tax: largest single layer
- Soft/invisible costs collectively > hard/visible costs
- Hidden forgotten costs add ~10-20% to a seven-layer estimate

**The Duration Trap**
- Dual-CRM periods run ~2-3x over plan
- 6-month plan → realistic 14-20 months
- Post-merger consolidations notoriously drag past 24 months
- Cost stack is roughly linear in duration (recurring layers)
- 30-rep org: $140K-$260K (6mo) → $280K-$500K (12mo)
- 75-rep org: $420K-$780K (6mo) → $850K-$1.5M (12mo)

**Sync Topology Cost Differential**
- One-way sync vs bidirectional: ~40-60% cheaper across failure-tax + process-tax + reconciliation + maintenance
- Bidirectional sync is the single most expensive choice in the stack

**Hard Cutover vs Long Parallel Run — 75-Rep Org**
- Long bidirectional 12-month parallel run: ~$850,000-$1,500,000
- Compressed hard cutover (6-8 week validation overlap): ~$200,000-$350,000
- Hard cutover typically 50-75% cheaper; gap widens every month Path A drags

**Migration Timeline**
- Pre-overlap build phase: weeks -8 to 0 (before the meter starts)
- Validation overlap: 2-6 weeks (the only truly necessary parallel period)
- Post-cutover read-only reference window: 30-90 days, then decommission

`;

const counter = `

## Counter-Case: When The Parallel-Run Cost Is Actually Worth Paying

The entire thrust of this entry is "the parallel run is more expensive than you think, so compress it." That is the right default. But a serious RevOps or finance leader should stress-test it, because there are real conditions under which paying the dual-CRM cost — even paying it for an extended period — is the correct decision, and under which the "cost" framing itself becomes the source of a worse mistake.

**Counter 1 — A genuinely clean Marketing/Sales department split where each tool is best-of-breed for its job.** This is the legitimate permanent dual-CRM architecture, and it deserves to be defended properly rather than treated as a failure state. HubSpot's marketing automation, content management, email, and landing-page ecosystem are genuinely excellent. Salesforce's sales-process customization ceiling, enterprise reporting, and ecosystem depth are genuinely excellent. An organization that deliberately runs marketing in HubSpot and sales in Salesforce, with a clean MQL-to-SQL handoff and a one-directional boundary sync, is not stuck in migration limbo — it is running a best-of-breed architecture. The ongoing cost is real, but so is the capability advantage. Forcing this organization onto a single platform "to save the dual-CRM cost" can mean downgrading the side that loses its preferred tool — weaker marketing automation if everyone moves to Salesforce, weaker sales-process depth if everyone moves to HubSpot. The cost framing, applied bluntly, would destroy real value here. The discipline is the conditions test from the core: clean object boundary, one-way boundary sync, documented source-of-truth per object, an actual decision rather than a drift, and an annual re-examination. If those hold, the parallel-run cost is the price of best-of-breed, and it is worth paying.

**Counter 2 — A high-stakes migration where a rushed cutover would lose deals.** The hard-cutover playbook is the cost-optimal default, but it is not free of risk — a cutover weekend that goes badly can disrupt active selling, drop in-flight deals, break integrations that reps depend on, and cost real revenue. For an organization in the middle of its biggest quarter, with large deals in late stages, with a sales team that has zero slack for system disruption, a *deliberately longer, more careful parallel run is cheap insurance.* If a botched cutover could put a seven-figure deal at risk, then spending an extra two or three months of dual-run cost to de-risk the cutover is not waste — it is a rational hedge. The error this entry must not encourage is treating "compress ruthlessly" as "compress recklessly." The right framing is: compress as aggressively as the risk profile allows, and where the deal-loss risk of a fast cutover genuinely exceeds the carrying cost of a longer parallel run, the longer run wins. The parallel run is sometimes the insurance policy, and insurance has a legitimate price.

**Counter 3 — When the "cost" framing pressures a premature cutover that breaks revenue operations.** This is the subtlest and most dangerous counter. Once a finance leader sees the seven-layer cost slide and the "$X per month" meter, the natural reaction is urgency — "cut over now, the meter is running." But a cutover executed before the destination system is genuinely ready — before the data is validated, before the integrations are rebuilt, before reps are trained, before the reporting is reconstructed — does not save money. It trades a known, bounded carrying cost for an unbounded operational failure: broken pipeline visibility, reps unable to work, a forecast nobody can produce, deals falling through cracks in a half-built system. A premature cutover can easily cost more than the parallel run it was meant to end. The cost framing is a tool to *end the undated, unowned drift* — it is not a tool to *override migration-readiness criteria*. The honest version of the leadership conversation includes this guardrail explicitly: "we will cut over fast, but the cutover date is gated on readiness criteria, and we will not flip the switch on an unready system just because the meter is running." The meter creates healthy urgency; it must not create destructive haste.

**Counter 4 — When the migration itself is the wrong decision.** Sometimes the dual-CRM period exists because a migration was started that should not have been. A company on a perfectly functional Salesforce instance, mid-migration to HubSpot for reasons that turn out to be thin (a new VP's preference, a vendor's aggressive discount, a feature gap that turns out to be solvable in the existing platform), is burning dual-CRM cost on a migration that destroys value even when completed. In that case the cost-minimizing move is not "compress the migration" — it is "stop the migration and consolidate back onto the original system." The cost framing should prompt the question "is finishing this migration actually the right destination?" — not just "how fast can we finish it?" Occasionally the most expensive thing is completing a migration you should never have started.

**The honest synthesis.** The default is still correct: most dual-CRM periods are undated, unowned, underpriced drift, and the right move is to make the cost visible and compress ruthlessly with a one-way sync and a hard cutover. But "ruthless compression" has three guardrails. First, a genuine best-of-breed department split is a legitimate permanent architecture, not a cost to eliminate — defend it with the conditions test. Second, when a botched cutover would lose real deals, a longer careful parallel run is rational insurance, not waste. Third, the cost meter must create urgency to *end the drift*, never haste to flip an unready switch — the cutover date is always gated on readiness. Used with those guardrails, the cost framing is the most powerful tool a RevOps leader has. Used without them, it can pressure an organization into a premature cutover that costs more than the parallel run it was meant to save.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a RevOps consulting business in 2027? (The consultancy that gets hired to run exactly this migration.)
- **q9502** — How do you start a CRM implementation business in 2027? (Implementation-partner perspective on migration scoping and cutover.)
- **q9510** — What is the realistic cost of a Salesforce implementation? (Companion cost model for the destination-system build.)
- **q9511** — What is the realistic cost of a HubSpot implementation? (Companion cost model for the other destination-system build.)
- **q9512** — How do you choose between HubSpot and Salesforce? (The decision upstream of the migration this entry costs.)
- **q9514** — How do you plan a CRM data migration? (Deep dive on the data-migration sequencing referenced in the timeline section.)
- **q9515** — What is a CRM cutover plan? (Deep dive on the hard-cutover weekend and rollback plan.)
- **q9516** — How do you keep two CRMs in sync? (Technical deep dive on native connector vs iPaaS sync topology.)
- **q9517** — What is an iPaaS and when do you need one? (Workato/Tray/Boomi/MuleSoft selection for the integration layer.)
- **q9520** — How do you build a RevOps roadmap? (The roadmap whose stalling is the opportunity-cost layer here.)
- **q9521** — How do you measure RevOps ROI? (Framework for quantifying the opportunity cost for the leadership conversation.)
- **q9530** — How do you reconcile sales pipeline across systems? (Deep dive on the reporting-reconciliation cost layer.)
- **q9531** — What is a single source of truth in RevOps? (The source-of-truth discipline central to the one-way-sync strategy.)
- **q9540** — How do you manage RevOps during an M&A integration? (Post-merger dual-org scenario expanded.)
- **q9541** — What does a post-merger systems-integration plan look like? (Where the CRM consolidation line item belongs.)
- **q9550** — How do you present a SaaS-spend rationalization to a CFO? (The leadership-conversation discipline applied to redundant tooling broadly.)
- **q9560** — How do you build a sales-tech stack in 2027? (The ISV-tooling layer — Gong, Outreach, ZoomInfo, Clari, LeanData.)
- **q9561** — Which sales tools charge per CRM connection? (Detail behind the duplicated-tooling cost layer.)
- **q9570** — How do you onboard sales reps onto a new CRM? (The enablement-duplication layer expanded.)
- **q9580** — What is the total cost of ownership of a CRM? (Broader TCO framework this entry's parallel-run model plugs into.)
- **q9590** — How do you decommission a legacy system? (The decommission step organizations routinely forget.)
- **q9591** — How do you write a system-rollback plan? (The rollback plan that makes the hard cutover safe.)
- **q9601** — How will AI change CRM migration by 2030? (The 5-year-outlook AI-migration-tooling thesis expanded.)
- **q9610** — Is best-of-breed or single-platform the right RevOps architecture? (The defensible-permanent-split debate in full.)

`;

const tags = ['hubspot-salesforce-dual-system-6-month-cost-50-rep-saas','licensing-hubspot-sales-hub-enterprise-150-salesforce-sales-cloud-165-per-seat-monthly','native-mulesoft-workato-tray-boomi-data-sync-options','slalom-deloitte-ibm-accenture-cognizant-migration-consultants','1-2-5m-six-month-total-cost-50-rep','m-a-integration-dept-autonomy-regulatory-dual-justification','2027'];

const sources = [
  { title: 'Salesforce Sales Cloud Pricing', url: 'https://www.salesforce.com/sales/pricing/' },
  { title: 'HubSpot Sales Hub Pricing', url: 'https://www.hubspot.com/pricing/sales' },
  { title: 'HubSpot-Salesforce Native Integration Documentation', url: 'https://knowledge.hubspot.com/salesforce' }
];

const notes = {
  s6: 'Added 25 cited sources: Salesforce and HubSpot pricing pages, the native HubSpot-Salesforce connector documentation, enterprise iPaaS vendors (Workato, Tray.io, Boomi, MuleSoft, Zapier), ISV tooling integration docs (Gong, Outreach/Salesloft, ZoomInfo, LeanData, Clari, DocuSign/Chili Piper), systems-integrator migration practices (Slalom, Deloitte, IBM, Accenture, Cognizant), Salesforce/HubSpot API limit and sandbox docs, SOC 2/ISO 27001 audit scoping, Okta/Entra SCIM provisioning, Gartner/Forrester market and TEI methodology, and Pulse RevOps internal benchmark data on dual-CRM duration overruns.',
  s7: 'Added comprehensive numerical analysis: per-seat license pricing (Salesforce Enterprise ~$165, HubSpot Sales Hub Pro ~$100 / Enterprise ~$150), worked 6-month duplicated-license cost for 30/50/100/150 users, integration/middleware layer breakdown (native connector vs iPaaS subscription $2K-$8K+/mo plus $15K-$80K+ setup), the data-sync failure tax, duplicated admin and tooling costs by org size, the process tax quantified in lost selling hours (~42 hrs/rep over 6 months, ~$139K/$347K/$693K for 30/75/150 reps), reporting reconciliation cost, training duplication, opportunity cost, three full seven-layer worked totals ($140K-$260K / $420K-$780K / $900K-$1.7M), the cost mix pattern (licenses 25-40%, process tax largest layer), the 2-3x duration overrun trap, the one-way vs bidirectional sync differential (40-60%), and the hard-cutover vs long-parallel-run TCO comparison.',
  s8: 'Added a four-part counter-case on when the parallel-run cost is worth paying: (1) a genuinely clean Marketing/Sales best-of-breed department split as a legitimate permanent architecture defended by the conditions test, (2) a high-stakes migration where a rushed cutover would lose deals and a longer careful parallel run is cheap insurance, (3) the danger that the cost framing pressures a premature cutover that breaks revenue operations and costs more than it saves, and (4) when the migration itself was the wrong decision and the cost-minimizing move is to stop and consolidate back. Synthesis: the default (compress ruthlessly) holds, but with three guardrails — defend genuine splits, treat careful parallel runs as rational insurance against deal loss, and gate the cutover date on readiness criteria so the meter creates urgency not destructive haste.',
  s9: 'Cross-linked 24 related Pulse entries: RevOps and CRM-implementation consultancy entries (q9501/q9502), companion cost models for Salesforce and HubSpot implementations (q9510/q9511), the upstream platform-choice decision (q9512), migration mechanics deep dives (q9514/q9515/q9516/q9517), RevOps roadmap and ROI entries tied to the opportunity-cost layer (q9520/q9521), reconciliation and source-of-truth entries (q9530/q9531), M&A systems-integration entries (q9540/q9541), the CFO SaaS-rationalization conversation (q9550), sales-tech-stack and per-connection-pricing entries (q9560/q9561), enablement/onboarding (q9570), TCO/decommission/rollback entries (q9580/q9590/q9591), and the 2030 outlook entries (q9601/q9610).',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the realistic 6-month operating cost of running HubSpot and Salesforce in parallel during a CRM migration cutover. Two mermaid diagrams (the seven-layer dual-CRM cost stack splitting visible hard cost ~25-40% from invisible soft cost ~60-75% and resolving to org-size totals and the duration trap; the migration-overlap-vs-permanent-split decision tree with the compress-and-cutover playbook and the clean-one-way-sync architecture playbook). Full coverage: the four origin stories of dual-CRM periods, all seven cost layers (duplicated licenses, integration/middleware, data-sync failure tax, duplicated admin, duplicated tooling, process tax, reconciliation plus opportunity cost), worked license numbers for 30/50/100/150 users, the integration layer (native connector vs iPaaS), the sync failure tax, duplicated admin and tooling, the process tax quantified in lost selling hours, reporting reconciliation and the credibility cost, training/enablement duplication, the opportunity-cost layer, three full seven-layer worked 6-month models ($140K-$260K / $420K-$780K / $900K-$1.7M, with $1.2M-$2.5M credible for large runs with consultants), the "it is only temporary" 2-3x duration-overrun trap, when dual-CRM is genuinely defensible, the one-way-sync discipline (40-60% cheaper), the hard-cutover alternative, the overlap-minimizing migration timeline, the forgotten hidden costs, the migration-vs-split decision framework, how to present the cost to leadership, five real-world scenarios, the hard-cutover-vs-long-parallel-run TCO comparison, the 5-year outlook, a final framework with the cost-model template / minimize-the-overlap playbook / leadership-conversation script, and a four-part counter-case with three guardrails.'
};

runPolish({ id: 'q9513', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
