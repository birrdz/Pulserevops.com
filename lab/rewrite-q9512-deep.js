// q9512 — How do you migrate a Salesforce instance from Classic to Lightning when half the AE team hates change?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** Migrating Salesforce from Classic to Lightning when half the AE team hates change is **80% change management and 20% technical work** — and the orgs that fail are the ones that invert that ratio. Classic is end-of-life: every new feature since 2019 (Dynamic Forms, Einstein, Agentforce, most modern AppExchange apps) is Lightning-only, and Salesforce has been auto-enabling Lightning org-wide for years. The migration is "when," not "if." For a change-resistant team, **choose a phased opt-in rollout over a big-bang cutover** — pilot a representative cohort (including one respected skeptic), prove speed and time savings with before/after task studies, recruit AE "Lightning champions" for peer-led training, then roll out in waves and sunset Classic on a hard date. The single biggest AE complaint is "Lightning is slower" — and it usually is, because the default record pages are bloated. **Fix that first:** lean Lightning record pages, Dynamic Forms, a strict component diet, and sensible list-view defaults can make Lightning measurably *faster* than Classic, which converts skeptics better than any training deck. Before cutover, remediate the technical backlog (convert JavaScript buttons to Flows and Quick Actions, rebuild or wrap Visualforce pages, clean up list views) and verify every integration — CPQ, Gong, Outreach, DocuSign, Conga — works in Lightning. Realistic timeline: **8-16 weeks** (assess → remediate → pilot → iterate → wave rollout → Classic sunset → 30/60/90-day reinforcement). The CRO must be visibly on Lightning day one; leadership modeling is non-negotiable. **The counter-case matters too:** for a small team with light customization, a clean fast Lightning build sells itself and heavy change-management theater is wasted motion; if AEs hate the new org because it is genuinely worse-configured, fix the config, not the people; a phased rollout that drags for nine months creates a two-system limbo worse than a clean cutover; and "AEs hate change" is very often a polite translation of "leadership won't commit." Diagnose which problem you actually have before you spend a quarter on it.`;

const core = `

## The Reality Check: Classic Is End-Of-Life, This Is Not Optional

The most important thing to internalize before you plan a single sprint is that the Classic-to-Lightning migration is not a discretionary modernization project you can defer indefinitely. Salesforce Classic — the user interface that shipped with the platform for its first decade and a half — has been in a managed sunset since the Lightning Experience launched in the Winter '16 release. Salesforce has not built a meaningful new Classic feature in years. Every significant capability the platform has added since roughly 2019 is **Lightning-only by design**: Dynamic Forms, Dynamic Actions, the Lightning App Builder, In-App Guidance, the modern Path component, Einstein Activity Capture, Einstein Opportunity Scoring, Einstein Conversation Insights, Revenue Intelligence, the entire Einstein generative AI and Agentforce stack, and the overwhelming majority of new and updated AppExchange managed packages. When a Salesforce account executive or solution engineer demos something exciting to your leadership team, they are demoing it in Lightning, because it does not exist in Classic and never will.

Salesforce has also been steadily removing the choice from administrators' hands. For several release cycles the company has **auto-enabled Lightning Experience** for orgs that had not yet turned it on, and it has progressively made it harder to keep users locked into Classic. The "Switch to Lightning Experience" link, the critical-update style enforcement, the periodic emails to admins about Classic users — all of it points the same direction. There is no published "Classic is shut off on this exact date" guillotine for every org, and that ambiguity is precisely what lets change-resistant teams procrastinate. But the strategic reality is unambiguous: you are maintaining a deprecated UI on borrowed time, your ISV apps are slowly dropping Classic support, your Salesforce roadmap value is capped at whatever existed in 2019, and your reps are working in a frozen product while your competitors' reps get Einstein and Agentforce.

Framing this correctly with your team matters enormously. This is not "the admin wants to redecorate." This is "the platform we have standardized our entire revenue operation on has moved, and we are choosing whether to move with it deliberately or get dragged later under worse conditions." The migration is "when," not "if" — and "when" should be "on your timeline, with a plan," not "whenever Salesforce forces it, in a panic." Every quarter you wait, the technical debt compounds, the feature gap widens, and the eventual jump gets steeper. The reality check is the foundation of every change-management conversation that follows: you are not selling a preference, you are managing an inevitability.

## Why AEs Resist: The Objections Are Not Irrational

The instinct of many admins and RevOps leaders is to treat AE resistance as stubbornness — Luddites clinging to a worse tool out of laziness. That framing guarantees a failed migration, because it is both insulting and wrong. AE resistance to a Classic-to-Lightning migration is, in almost every case, **rational behavior given their incentives and experience.** Name the real objections honestly and you can address them; dismiss them and they fester into open revolt.

The first and deepest objection is **muscle memory.** A senior AE who has been in Classic for eight years does not "use" Salesforce — they have offloaded it into procedural memory. They navigate to a record, click a specific button in a specific corner, key a tab sequence, and log a call without conscious thought. Lightning relocates almost everything. Buttons that were a row of links are now consolidated into a dropdown. The related lists moved. The activity composer is different. For the first two weeks, every task that used to take eight seconds takes forty, because the rep has to *think*. To a quota-carrying AE in the middle of a quarter, that is not a UI change — it is a direct tax on their selling time, and they feel it in their pipeline.

The second objection is **perceived speed loss, which is frequently a real speed loss.** Out of the box, a default Lightning record page is heavier than a Classic page layout. It loads more components, makes more server round-trips, and renders more chrome. If your admin migrated by clicking "Enable Lightning" and accepting the default record pages, your reps are genuinely working in a slower interface, and "Lightning is slow" is not a complaint — it is an accurate bug report. We will spend an entire section on fixing this because it is the single highest-leverage thing you can do, but the point here is: do not gaslight your reps about performance. They are often right.

The third objection is **"the new UI buries my buttons."** Lightning's design language hides secondary actions in overflow menus and consolidates related lists. An AE who lived by a custom "Create Renewal Quote" button now has to hunt for it. Workflows that were one click are now two or three. Multiply that across the fifteen things a rep does fifty times a day and the friction is real and cumulative.

The fourth objection is **past bad rollouts.** Most AEs who have been in the workforce for a decade have lived through at least one botched system change — a CRM migration that lost their data, a new tool that was mandated and then abandoned, a "transformation" that made their job worse for six months and better for zero. They are not resisting *this* change in a vacuum; they are pattern-matching against scar tissue. Their skepticism is a learned defense.

The fifth objection is **change fatigue.** Revenue teams in 2026 are saturated with tooling. They have a CRM, a sales engagement platform, a conversation intelligence tool, a CPQ system, a forecasting tool, an enablement platform, and an AI assistant or three. Every quarter something changes. The AE's bandwidth for absorbing yet another "this will be better, trust us" is genuinely depleted, and a Classic-to-Lightning migration lands on top of that pile.

The sixth, quietest objection is **status and identity.** A senior AE's mastery of the existing system is a small source of workplace status — they are the person who knows where everything is, who helps the new rep. A migration resets that mastery to zero and, briefly, makes the eager junior rep who loves new tools look more competent. That is threatening in a way nobody will say out loud, and it is worth understanding even though you address it indirectly.

None of these is irrational. Every one of them has a corresponding mitigation, and the rest of this playbook is essentially the mapping of objection to tactic. But the prerequisite is respect: the reps resisting your migration are mostly your best, most tenured, highest-producing people protecting their selling time. Treat them as the problem and you lose. Treat their objections as the requirements document and you win.

## The Two Migration Philosophies: Big-Bang Versus Phased

There are two fundamental approaches to a Classic-to-Lightning migration, and choosing the right one for a change-resistant team is the most consequential strategic decision you will make.

The **big-bang cutover** flips the entire org from Classic to Lightning on a single date. Everyone wakes up Monday in the new UI; Classic is disabled or hidden. The advantages are real: there is no prolonged dual-system limbo, no "which UI are you in?" support confusion, the project has a hard finish line that forces focus, training can be concentrated, and the org's data and process definitions stay perfectly consistent because there is only ever one active interface. Big-bang also prevents the "I'll switch back to Classic" escape hatch from undermining adoption — there is no Classic to switch back to. For a small org with light customization, a clean configuration, and a team that is neutral-to-positive about change, big-bang is often the *right* call and the change-management overhead of a phased approach is wasted motion.

The **phased / opt-in rollout** moves users to Lightning in controlled waves over weeks. A pilot cohort goes first, the org iterates based on their feedback, then subsequent waves of users are migrated on a schedule, with Classic remaining available (often via a permission set) until a defined sunset date. The advantages: risk is contained to a small group at each step, the org gets real feedback before mass exposure, problems are found and fixed at pilot scale instead of org scale, champions are created in early waves who then evangelize to later waves, and the team experiences the change as a managed transition rather than a shock.

For a team where **half the AEs hate change, phased almost always wins** — for a specific psychological reason, not just a risk-management one. Resistance feeds on the narrative "this is being done *to* us." A big-bang cutover, even a well-executed one, confirms that narrative: a date was set, the switch was flipped, you had no say. A phased rollout lets you build the opposite narrative: "we piloted it, we listened, we fixed the things the pilot reps complained about, your colleagues helped design the rollout, and here is the proof it is faster." The phased approach gives you something the big-bang cannot — **time to manufacture social proof and incorporate feedback before the skeptics are exposed.** It converts the rollout from an imposition into a co-production.

The phased approach has a real failure mode, and you must guard against it: **the rollout that never ends.** If "phased" turns into nine months of two systems running in parallel with no forcing function, you have created a limbo that is worse than either pure state — split documentation, split training, split support, inconsistent rep experience, and a permanent "I'm still in Classic" holdout population. The discipline that makes phased work is the **hard Classic sunset date, set at the start and communicated relentlessly.** Phased does not mean indefinite; it means a controlled, time-boxed sequence with a real end. Pick phased for the change-resistant team, but pick phased *with a deadline*.

## The Readiness Assessment: Know What You're Migrating

You cannot plan a migration you have not measured. The readiness assessment is the diagnostic phase, and skipping or rushing it is the most common root cause of a rollout that produces dead-end clicks and a rep revolt.

Start with the **Salesforce Lightning Experience Readiness Report.** This is a built-in tool — run it from Setup and Salesforce emails you a personalized PDF that estimates how ready your org is, flags features in use that behave differently or are unsupported in Lightning, and surfaces the big-ticket items. It is not exhaustive and it is not a substitute for hands-on auditing, but it is the right starting inventory and it costs you nothing but a few minutes.

Next, conduct the **feature-gap audit.** Go through every object, every profile, and every major business process and ask: does this work in Lightning, does it work differently, or does it not work at all? Pay particular attention to Console-style workflows, mass actions, certain report and dashboard behaviors, and any process that depends on a Classic-specific UI affordance. Document each gap with a severity rating: blocker (a rep cannot do their job without it), friction (it works but worse), or cosmetic.

The single highest-risk technical inventory is the **JavaScript button inventory.** Classic allowed custom buttons and links that executed JavaScript in the browser — and many heavily customized orgs accumulated dozens of them over the years to automate quoting, record creation, field updates, and integrations. **JavaScript buttons do not work in Lightning Experience. Period.** This is the number one source of the "you migrated us and now my button is dead" revolt. You must enumerate every JavaScript button and link in the org — there are tools and reports that help, and the Readiness Report flags them — and for each one, decide its replacement: a Flow, a Quick Action, a Lightning component, or retirement if it is no longer used.

Build the **unsupported-feature list** as a consolidated artifact: every Classic feature, button, VF page, and behavior that will not survive the migration unchanged, each with an owner, a remediation plan, and a target date. This list *is* your technical backlog. Also inventory **Visualforce pages** (which mostly run in Lightning but often look wrong or behave oddly inside the Lightning chrome and may need rebuilding or wrapping), **list views** (Classic orgs accumulate hundreds of stale, redundant, poorly-named list views), **page layouts** (which become the starting point for Lightning record pages), and **integrations and AppExchange packages** (covered in depth in its own section below).

The output of the readiness assessment is a single prioritized document that tells you exactly how big the technical job is, where the landmines are, and what must be fixed before a single skeptical AE ever logs into Lightning. An honest assessment often reveals the migration is bigger than leadership assumed — and it is far better to learn that in week one than in week six when reps are hitting dead ends.

## The Technical Migration Backlog: Remediate Before You Roll Out

The readiness assessment produces a backlog; the remediation phase burns it down. This is the 20% of the project that is technical, and while it is not where migrations are *won*, it is absolutely where they are *lost* — because an unremediated technical gap becomes a rep hitting a dead end, and a rep hitting a dead end becomes "see, I told you Lightning was broken."

**Converting JavaScript buttons** is the centerpiece of the backlog. For each JS button you inventoried, the replacement pattern depends on what it did. A button that created a related record with pre-populated fields becomes a Quick Action or a screen Flow launched from the record. A button that updated fields based on logic becomes an autolaunched Flow, a record-triggered Flow, or a Quick Action invoking a Flow. A button that called an external endpoint becomes a Flow with an HTTP callout (or an invocable Apex action). A button that did something genuinely complex becomes a Lightning web component or an Aura component with an Apex controller. The good news is that modern Flow is dramatically more capable than it was even three years ago, and the large majority of historical JavaScript buttons can be rebuilt declaratively. The discipline is: do not migrate a button you do not need. Audit usage first; many JS buttons in old orgs are vestigial, and retiring them is faster and safer than rebuilding them.

**Visualforce pages** mostly continue to function in Lightning, but they render inside the Lightning chrome and frequently look broken, misaligned, or stylistically jarring. For each VF page, decide: leave it (if it is rarely seen and functional), rebuild it as a Lightning component (if it is high-traffic and core to a workflow), or wrap it (embed it in a Lightning page so it at least lives in the right context). Pages built with older VF styling are the worst offenders; budget real time for the high-traffic ones.

**List view cleanup** is unglamorous and high-impact. Classic orgs are graveyards of list views — "My Open Opps (OLD)", "Q3 Pipeline copy", dozens of one-off filters created by reps who left years ago. Lightning makes list views more prominent and more useful (inline editing, charts, Kanban from list views), so a cluttered list-view environment actively degrades the Lightning experience. Audit, delete the dead ones, rename the survivors clearly, and define a clean set of **default list views** per object and per profile so that when a rep lands in Lightning, the first thing they see is useful, not chaos.

**Page layouts and the Lightning App Builder** are where Classic page layouts get translated into Lightning record pages. Do not just accept the auto-generated Lightning page — that is exactly how you end up with the bloated, slow record page that fuels the "Lightning is slower" complaint. The Lightning App Builder lets you compose record pages from components: details, related lists, activity, path, custom components, and so on. The translation of a Classic layout into a Lightning record page is a *design* exercise, not a copy-paste, and it deserves its own section — the next one.

Sequence the backlog by severity. Blockers — anything a rep cannot do their job without — must be 100% done before any user is migrated. Friction items can be scheduled into the pilot-and-iterate loop. Cosmetic items can trail the rollout. The cardinal rule: **no AE meets Lightning before the blockers are dead.** Every dead-end click a skeptic experiences in week one costs you a month of credibility.

## Designing The Lightning Experience For Speed

Here is the most important practical truth in this entire playbook: **the number one AE complaint about Lightning is "it's slower," and you can not only neutralize that complaint, you can invert it.** A well-designed Lightning org is genuinely *faster* than Classic for the tasks reps do most — and a skeptic who experiences "wait, this is actually quicker than my old screen" is converted more durably than by any training session. Speed is your best change-management tool. Treat it as a first-class deliverable, not an afterthought.

The root cause of slow Lightning is the **default record page.** When you enable Lightning, Salesforce generates a record page that crams everything in — every related list, every component, the full activity timeline, the full detail section — all loading at once on page load. Each component is a potential server round-trip. The page is heavy before a rep clicks anything.

The fixes, in rough order of impact:

**Adopt Dynamic Forms.** Dynamic Forms break the monolithic "Details" panel into individual field sections and individual fields that you can place anywhere on the page and, critically, show or hide conditionally. Instead of rendering a 60-field detail block, you render the 12 fields that matter for this record's stage and reveal the rest only when relevant. This is the single biggest lever for both speed and clarity. It also lets you build record pages that feel tailored to the rep's actual workflow rather than dumping the entire data model on screen.

**Put a strict component diet on every record page.** Every component you add to a Lightning record page has a load cost. Be ruthless: does the AE actually use this related list on this object? If a related list is referenced once a month, it does not belong on the default page — move it to a separate tab within the record page so it loads only when clicked. Lazy-load secondary content behind tabs. The default landing view of a record should be lean: the fields that drive the next action, the path, the activity composer, and little else.

**Use the Lightning page tabs.** Lightning record pages support a tab component. Put the high-frequency content on the first/default tab and everything else on secondary tabs. Components on non-active tabs do not load until the tab is opened. This one structural choice can dramatically cut initial page-load time.

**Trim the activity timeline.** The activity component is useful but heavy. Configure it sensibly and consider whether the full timeline needs to be open by default.

**Set sensible list-view defaults** and use list view performance features. Reps live in list views; a fast, well-filtered, well-scoped default list view is part of the perceived-speed picture.

**Audit custom components and Apex.** If you have custom Lightning components on record pages, profile them. A single poorly-written component with an unindexed SOQL query in its controller can make an entire page feel sluggish.

**Use the Lightning Usage and performance tooling.** Salesforce provides page-load performance data; the EPT (Experienced Page Time) metric tells you which pages are slow and often why. Optimize the worst offenders first.

The mindset shift: do not "migrate the Classic layout." **Design a fast Lightning record page from the rep's workflow backward.** What does an AE need to see in the first half-second on an Opportunity? Put exactly that on the default tab, push everything else behind tabs and Dynamic Forms conditionals, and you will hand your pilot reps a tool that is faster than what they had. That is worth more than a hundred slides.

## The Pilot Group Strategy: Pick The Right First Cohort

The pilot cohort is the most important casting decision in the migration, and it is routinely done badly. Two failure modes dominate: stacking the pilot with only the eager early-adopters (which produces a feel-good pilot that proves nothing about the skeptical majority), or — worse — throwing the loudest skeptics in first to "win them over" (which produces a pilot that becomes a referendum and a megaphone for everything wrong).

The right pilot cohort is **a representative cross-section of the team**, deliberately composed. It should include: a couple of genuinely eager reps (they will surface enthusiasm and help you find the wins worth publicizing), a few solidly average middle-of-the-distribution reps (they are the real test — if Lightning works for them, it works for the team), reps across different selling motions or segments if your team has them (so you catch role-specific gaps), and — this is the key move — **one or two respected, tenured, change-skeptical AEs who are not the loudest complainers but whose opinion the team trusts.**

That last category is the strategic heart of the pilot. You are not picking the skeptic who will torch the project on the team Slack channel; you are picking the skeptic with credibility — the rep whose quiet "yeah, this is actually fine" lands harder with the team than any executive endorsement. If you can get a respected skeptic through a well-supported pilot and out the other side genuinely converted, their conversion becomes the single most powerful piece of social proof in your entire rollout. The team's internal logic is: "if it won *her* over, it can't be the disaster I assumed." You are recruiting a witness, not converting a critic for its own sake.

Keep the pilot small — large enough to be representative, small enough that every participant gets white-glove support. Set it up explicitly as a pilot: their job is to use Lightning for real work and tell you everything that is wrong, slow, confusing, or missing. Give them a fast, direct feedback channel and — critically — **visibly act on the feedback.** When a pilot rep says "the renewal button is gone," and three days later it is back as a Quick Action, you have not just fixed a button; you have proven the entire premise of the phased approach. The pilot is where you earn the right to tell the rest of the team "we listened."

Run the pilot long enough for the muscle-memory dip to pass — typically two to four weeks — because a pilot that ends in week one captures only the pain and none of the payoff. You want pilot reps who have crossed the threshold from "this is different and slow" to "okay, I'm faster in this now," because those are the reps whose testimony you need.

## Change Management — The Champion Model

The center of gravity of a successful change-resistant migration is the **Lightning champion model**, and it rests on a single behavioral truth: **AEs trust other AEs far more than they trust admins, RevOps, or leadership.** When an admin says "Lightning is better," a skeptical rep hears a vendor pitch. When a respected peer on their own team says "I was dreading this and it turned out fine, here's the one trick that made it click for me," a skeptical rep hears the truth. Peer-led change beats admin-led change every single time, and the champion model operationalizes that.

Recruit champions deliberately. A good Lightning champion is a respected, credible AE — ideally someone with tenure and quota performance the team admires — who came through the pilot converted and is willing to help their peers. You are not looking for the most technical rep or the most enthusiastic rep; you are looking for the rep whose opinion carries weight on the floor. One champion per team or pod is plenty. Give them a little extra training, a little extra access, a direct line to the admin, and explicit recognition for the role.

Champions do three things. First, they **deliver or co-deliver training** — a champion walking peers through "here's how I log a call now, here's where the renewal button went" is worth ten times an admin doing the same thing, because it carries the implicit message "a real rep figured this out and so will you." Second, they **field the small questions** that reps will not bring to the admin — the "where did X go" questions that would otherwise become silent frustration. Third, they **model the WIIFM** — the "what's in it for me" framing — in peer language.

The WIIFM framing must be **per-persona**, not generic. What is in it for the AE is different from what is in it for the sales manager and different again from what is in it for the SDR or the CRO. For the AE: less time logging activity, faster pathing through a deal, Kanban for visual pipeline management, the activity timeline so they walk into a call already briefed, Einstein surfacing the next best action, and mobile parity so they can update a deal from the parking lot. For the sales manager: a real-time pipeline view, better dashboards, the ability to coach from the same screen the rep uses. For the CRO: forecast accuracy, AI-driven insight, and a platform that is actually on the modern roadmap. Champions translate the right WIIFM to the right person in the right language.

The champion model also solves the status problem identified earlier. The senior skeptic who feared losing their "person who knows where everything is" status gets handed a *new* version of exactly that status — Lightning champion — which is a far better outcome than having them quietly resent the change. You convert a potential blocker into a load-bearing pillar of the rollout.

## Training That Actually Lands

Most Salesforce migration training fails the same way: it is a 90-minute webinar, delivered once, by an admin, covering everything, weeks before the rep actually needs it. By the time the rep is in Lightning trying to do a real task, the webinar is a forgotten blur. Effective migration training is the opposite of that webinar on every axis.

It is **role-specific.** An AE does not need to see how the support team uses Cases. Build a training track for each role that covers only the workflows that role actually performs. The AE track is: navigate a record, log activity, advance a deal through the path, manage pipeline in Kanban, use list views, find the buttons that moved, work the deal from mobile. Nothing else.

It is **scenario-based.** Do not teach "here is the activity component." Teach "here is how you log a call after a discovery meeting" — the actual task, start to finish, the way the rep will really do it. Reps learn workflows, not features.

It is **short.** Break training into small modules — five to fifteen minutes each — that a rep can consume one at a time. Nobody retains a 90-minute firehose. Several short, focused sessions beat one long one every time.

It is **in the flow of work.** This is the highest-leverage principle. The best "training" is not training at all — it is guidance delivered at the exact moment of need, inside the product. Use **In-App Guidance** to put prompts and walkthroughs directly on the pages where reps will have questions. Use **in-app walkthroughs** to guide a rep through a changed workflow the first time they hit it. The rep learns by doing the real task with a guide rail, not by watching a recording of someone else doing it.

It leverages **Trailhead** for the reps who want to go deeper and for foundational concepts — Salesforce's free, gamified learning platform has solid Lightning content — but Trailhead is a supplement, not the spine of your program. The spine is short, role-specific, scenario-based, in-app guidance, delivered by champions, timed to coincide with each rep's actual migration.

And it is **timed.** Do not train a rep three weeks before they move to Lightning. Train them the day before and the week of, when the learning is immediately applied. Just-in-time beats just-in-case.

One more principle: **train for the dip.** Tell reps explicitly that the first one to two weeks will feel slower because their muscle memory has to rebuild, that this is normal and temporary, and that by week three they will be at or above their old speed. A rep who is warned about the dip rides through it; a rep who is surprised by it concludes the tool is broken and starts campaigning against it.

## The "What's In It For The AE" Pitch

You cannot guilt or mandate a change-resistant AE into genuine adoption — you can force the login, but you cannot force engagement. What actually moves a skeptical rep is the realization that the new thing makes *their* day better. The migration has to feel like a gift, not a tax, and the good news is that Lightning genuinely does give the AE real, concrete wins — if you surface them well.

**Kanban.** The Lightning Kanban view turns the pipeline into a visual board where a rep drags an opportunity from one stage to the next. For a visually-oriented seller — which is most of them — this is a genuinely better way to see and manage a pipeline than a list of rows. It is the kind of feature a rep shows another rep unprompted.

**Path.** The Path component puts the sales process right at the top of the record — current stage, what is required to advance, guidance for this stage, key fields for this stage — as a clickable bar. It turns "what do I need to do to move this deal" from tribal knowledge into an on-screen guide. New reps ramp faster; veteran reps stop guessing what the org expects at each stage.

**Activity Timeline.** The Lightning activity timeline gives the rep a clean, chronological view of every email, call, meeting, and task on the record. Walking into a call, a rep can glance at the timeline and be instantly briefed on the entire relationship history. In Classic, that history was scattered; in Lightning, it is one scrollable column.

**Split View.** Lightning's split view shows a list on the left and the selected record on the right, so a rep can rip through a list of leads or opportunities without bouncing back and forth. For high-volume work, this is a real speed gain.

**Einstein.** Depending on your edition and licensing, Einstein can score opportunities and leads, surface insights, capture activity automatically (so reps stop manually logging emails and meetings), and — with the modern Agentforce and generative stack — draft emails, summarize records, and recommend next actions. The pitch to the AE is simple: the system does some of your admin work for you. None of this exists in Classic.

**Mobile parity.** The Salesforce mobile experience is a genuine, full-featured Lightning experience — a rep can update a deal, log a call, and check a forecast from their phone in a way Classic never properly supported.

**Notes.** The modern Notes tool — rich text, autosave, related to multiple records — is a real upgrade over the old Classic notes.

The pitch is not "Lightning is corporate-mandated, please comply." The pitch is: "You are getting Kanban, you are getting the Path so you stop guessing, you are getting Einstein doing your activity logging, you are getting your phone as a real Salesforce device, and you are getting a timeline that briefs you before every call. We are taking work *off* your plate." Frame it as the upgrade it actually is, and let the champions demo the wins rep-to-rep.

## Quantifying And Communicating The Win

Enthusiasm is not evidence, and a change-resistant team does not run on enthusiasm — it runs on proof. The migration needs hard numbers, and the pilot is where you generate them.

During the pilot, run **before/after task-time studies.** Pick the handful of tasks AEs do most — log a call, create a quote, advance a stage, update a forecast field, build a list view — and measure how long they take in Classic versus how long they take in a well-designed Lightning page after the pilot rep has crossed the muscle-memory dip. If you have designed the Lightning experience for speed as described above, these numbers should favor Lightning, sometimes substantially. "Logging a call went from 41 seconds to 23 seconds" is a sentence that does more work than a whole training deck, because it is specific, credible, and self-interested — every rep does that task dozens of times a day and can do the multiplication themselves.

**Share rep-level wins.** When a pilot AE says something good — "I actually like the Kanban view," "the timeline saved me before the Henderson call" — capture it, attribute it (with permission), and circulate it. Peer testimony is the currency of this rollout. A quote from a respected skeptic is worth more than any number.

Build the **adoption-and-sentiment dashboard.** It should show, over time: the percentage of users on Lightning, login activity, feature-adoption metrics (are reps actually using Kanban, the path, the timeline?), and a sentiment signal from pulse surveys. This dashboard does double duty — it shows leadership the migration is working, and it shows you where it is *not* working so you can intervene early. A team or pod with cratering sentiment or flat feature adoption is a problem you want to find in week three, not month three.

The communication cadence matters as much as the content. Do not announce the win once. Drip it: pilot results, then early-wave results, then 30-day numbers, then 60-day numbers. Every data point that lands reinforces the narrative that this was the right move and it is going well — which is exactly the narrative a change-resistant team needs to hear repeatedly to believe.

## Handling The Vocal Minority

Even with a well-run phased rollout, a great pilot, champions, speed optimization, and good training, you will have a vocal minority of holdouts — usually a small number of tenured, influential, genuinely-skeptical AEs who are loud about it. How you handle this group determines whether the rollout's last mile is a clean finish or a slow-motion standoff.

The first move is **the 1:1 conversation.** Do not handle the vocal minority in group settings, where they perform for an audience and you both get entrenched. Get them one-on-one. Listen first and listen for real — frequently, underneath the noise, there is a specific, legitimate, fixable complaint. "Lightning is terrible" decoded in a 1:1 often becomes "the page I use forty times a day takes four seconds to load and my custom button is gone." That is not an attitude problem; that is a bug list, and a bug list is a gift.

The second move is **co-designing with skeptics.** This is the most powerful judo in the playbook. Take your loudest credible skeptic and *put them on the design team.* Ask them to help build the Opportunity record page. Ask them what belongs on the default tab. The psychology is decisive: a person cannot simultaneously campaign against a thing and be a co-author of it. You convert "you broke it" into "help me fix it," and a skeptic who helped design the page becomes its defender on the floor, because their credibility is now attached to it. This is the "you broke it, help me fix it" maneuver, and it works because it is sincere — you genuinely do want their input, and the resulting page genuinely is better.

The third move is knowing **when to hold firm.** Not every objection is a fixable bug, and not every holdout can be converted. Some resistance is simply "I do not want to change," full stop, and at some point — after you have piloted, listened, optimized for speed, remediated the technical backlog, co-designed with skeptics, and demonstrated the wins with data — the answer to "I just don't want to" has to be a calm, respectful, immovable "this is the platform now; Classic is being retired on [date]; here is all the support you need to land it; the move itself is not optional." Holding firm only works *after* you have genuinely done everything on the list above — hold firm too early and you confirm the "done to us" narrative; hold firm too late and you let one rep hold the org hostage. The line is: infinite flexibility on *how* we land Lightning well, zero flexibility on *whether* we land it.

And the rare fourth reality: if a top producer truly will not move and is actively poisoning the team, that becomes a performance and management conversation, not a Salesforce conversation — but you should reach that point only in genuinely exceptional cases, and only after the full playbook has been run.

## The Rollout Timeline: A Realistic 8-16 Week Plan

A Classic-to-Lightning migration for a change-resistant team is realistically an **8-to-16-week effort**, with the variance driven by org complexity (the size of the JavaScript-button and Visualforce backlog) and team size. Compressing it much below eight weeks usually means skipping remediation or piloting — both fatal. Stretching it much past sixteen risks the two-system-limbo failure mode. Here is the shape of it.

**Weeks 1-2: Assess.** Run the Readiness Report, conduct the feature-gap audit, inventory JavaScript buttons, Visualforce pages, list views, and integrations. Produce the prioritized unsupported-feature list and the technical backlog. Get executive sponsorship locked and visible. Set the hard Classic sunset date now and communicate it.

**Weeks 2-6: Remediate.** Burn down the technical backlog — convert JS buttons to Flows and Quick Actions, rebuild or wrap the high-traffic VF pages, clean up list views, and — critically — *design* the Lightning record pages for speed using Dynamic Forms and a strict component diet. Verify every integration and AppExchange package works in Lightning. Recruit and pre-train champions. Build the role-specific training modules and the In-App Guidance.

**Weeks 5-8: Pilot.** Move the representative pilot cohort (including the respected skeptic) to Lightning. Support them white-glove. Collect feedback through a fast channel and visibly act on it. Run the before/after task-time studies. Iterate the record pages and fix the friction the pilot surfaces.

**Weeks 7-9: Iterate.** Fold pilot feedback back into the configuration. Re-test. Finalize training based on what the pilot revealed reps actually struggle with. Lock the rollout schedule.

**Weeks 8-14: Wave rollout.** Migrate the rest of the team in waves — by team, by pod, by region, whatever maps to your org. Each wave gets just-in-time training and champion support. Watch the adoption-and-sentiment dashboard wave by wave; if a wave craters, slow down and intervene before the next one.

**Weeks 13-15: Classic sunset.** On the pre-announced hard date, retire Classic — remove the permission, hide the switch, close the escape hatch. By now, with everyone migrated and supported, this should be a formality, not a fight.

**Weeks 14-16+: Reinforcement.** The 30/60/90-day follow-up — office hours, the feedback loop, advanced training for reps ready for more, and the ongoing optimization of pages and processes based on real usage data.

The dates overlap on purpose; remediation and pilot and early waves run concurrently. The two non-negotiables are: the hard sunset date is set in week one and never moves without an extraordinary reason, and the blockers are 100% remediated before any user — pilot or otherwise — touches Lightning.

## The Salesforce-Forced Deadline Reality: Use The Vendor As Air Cover

There is a piece of leverage in this migration that under-experienced RevOps leaders forget to use: **Salesforce itself.** Because Salesforce has spent years progressively auto-enabling Lightning, tightening the screws on Classic, and making the platform direction unambiguous, the deadline is not really *yours* — it is the vendor's. And a vendor-imposed deadline is enormously useful change-management cover.

When the forcing function is "the admin decided to switch us," resistance has a target — you. When the forcing function is "Salesforce is retiring Classic and every new capability is Lightning-only and our ISV apps are dropping Classic support," resistance has nowhere to land. You are not the change agent imposing a preference; you are the guide helping the team navigate an external, immovable reality on the best possible terms. That reframing is genuinely true — it is not spin — and it takes the interpersonal heat off the internal team and redirects it at a faceless platform decision nobody can argue with.

Use it explicitly in communication. "Salesforce has been auto-enabling Lightning across orgs; the 'keep me in Classic' option is on borrowed time; every feature on the roadmap — Einstein, Agentforce, the new releases — is Lightning-only; our integration vendors are deprecating Classic support. We are choosing to do this deliberately, on our schedule, with a real plan and real support — instead of getting switched over in a panic when the vendor flips it for us." That message positions the migration as the *responsible, in-control* choice and positions further delay as the reckless one. It also gives wavering managers a clean line to use with their reps: this is happening because the platform is moving, not because someone in RevOps wants it to.

The air-cover framing does not replace any of the change-management work — you still pilot, you still optimize for speed, you still recruit champions. But it changes the emotional valence of the whole project from "internal politics" to "shared response to an external fact," and that is a much easier project to lead.

## Measuring Adoption: Beyond "Are They Logged In"

"Everyone is on Lightning" is not adoption — it is presence. A rep can be technically in Lightning Experience and still be fighting it, working around it, doing the minimum, and quietly campaigning against it. Real measurement goes deeper.

The **Lightning Usage App** is the built-in starting point — it shows Lightning versus Classic usage, which users are switching back to Classic (if the toggle is still on), browser breakdown, and page-load performance data. The "switching back to Classic" metric is an early-warning system: a rep who keeps flipping back is a rep who has hit something Lightning is not doing for them, and that is a signal to investigate, not to scold.

Track **login-as-Lightning percentage** over time as the headline adoption number — but treat it as necessary, not sufficient.

The number that actually matters is **feature-adoption metrics.** Are reps using the Kanban view? Are they advancing deals through the Path? Are they using the activity timeline, split view, the In-App Guidance? Are they logging activity at the same or better rate than they did in Classic? If reps are present in Lightning but not using its features, you have achieved compliance, not adoption, and the migration has not delivered its value. Build reports on the leading indicators of genuine use.

Run **sentiment pulse surveys** — short, frequent, low-friction. Two or three questions, every couple of weeks during and after the rollout: how is Lightning working for you, what is still slow or confusing, would you go back if you could. Sentiment is a leading indicator; it craters before feature adoption does. Catching a sentiment dip in a specific pod in week three lets you send a champion and an admin in before that pod's resentment hardens.

Combine all of it on the adoption-and-sentiment dashboard from the earlier section. The goal of measurement is not a report for leadership — it is an early-warning system that tells you exactly where, and how badly, the rollout is wobbling, while there is still time to fix it.

## The Post-Migration Reinforcement: The 30/60/90 And Killing The Escape Hatch

The migration is not over when the last wave lands in Lightning. The riskiest period for backsliding is the weeks *after* the rollout, when the project team's attention drifts to the next thing and reps quietly revert to old habits or old workarounds. Reinforcement is what makes the migration permanent.

Run a deliberate **30/60/90-day follow-up.** At 30 days: check the adoption and sentiment data, run office hours, and address the friction that has surfaced now that reps are doing real work at scale. At 60 days: introduce the advanced features reps were not ready for during the initial training — now that the basics are muscle memory, they have bandwidth for the next layer. At 90 days: review the before/after metrics across the whole team, celebrate the wins publicly, and confirm the migration delivered what it promised.

Keep **office hours** open — a recurring, low-stakes, drop-in slot where any rep can bring any Lightning question to the admin or a champion. The questions reps will not put in a ticket, they will bring to a casual office hour, and answering them prevents small frustrations from compounding.

Keep the **feedback loop** alive. The pilot taught the team that feedback gets acted on; do not let that die after rollout. A standing channel where reps can flag what is still slow or missing, with visible follow-through, keeps the org improving and keeps reps invested.

And — the critical, often-mishandled move — **kill the "switch back to Classic" escape hatch at the right time.** As long as the Classic toggle exists, a meaningful slice of your team will use it as a pressure-release valve, never fully committing, never building the new muscle memory, always one click from the old world. Leaving the escape hatch open forever is one of the named failure modes. But closing it too early — before reps are genuinely supported and the blockers are dead — is just as bad, because then the escape hatch was a real safety net you yanked away. The sequence is: keep Classic available through the pilot and the wave rollout as a genuine safety net; communicate the hard sunset date from day one; make sure that by the sunset date every rep is migrated, trained, supported, and through the dip; then, on the date, actually close it — remove the permission, hide the switch. After that, the path forward is the only path, and the small holdout population is finally, gently, all the way in.

## Executive Sponsorship: The CRO Must Be Visibly On Lightning Day One

Every section of this playbook quietly depends on one thing being true, and if it is not true, none of the rest works: **leadership must visibly, personally, demonstrably be on Lightning.** Change-resistant teams read leadership behavior with forensic precision. If the CRO is still in Classic — or worse, has an admin pull reports for them so they never have to touch the new UI — every rep on the team knows it within a week, and the entire migration is revealed as something leadership imposes on others but does not believe in enough to do themselves.

The CRO and the sales leadership chain must be in Lightning **day one**, using it in front of the team, running their pipeline reviews from it, pulling up the Kanban board in the forecast call, referencing the activity timeline when they coach a deal. Leadership modeling is not a nice-to-have; it is load-bearing. A rep can dismiss an admin's enthusiasm and a champion's testimony, but it is very hard to maintain "this tool is unusable" when the person who runs the entire revenue org is visibly, competently running it from that exact tool every day.

Executive sponsorship is also what gives the project authority when it needs to hold firm. The "this is the platform now, Classic retires on [date]" message lands very differently coming from a CRO who is themselves fluent in Lightning than from an admin alone. The sponsor's job is threefold: model the behavior personally and visibly, protect the project's timeline and resources from being deprioritized, and own the "this is happening" message so the change agent in RevOps is not standing alone in front of the resistant team. Get explicit, active, visible sponsorship before week one, or do not start.

## Common Failure Modes

Migrations fail in recognizable, repeatable ways. Each of these is a direct inversion of something in this playbook, and naming them makes them easier to avoid.

**No remediation of broken buttons.** The org migrates with JavaScript buttons unconverted. Reps hit dead ends — a button does nothing, a workflow is broken — within hours. The dead-end click becomes "Lightning is broken," the broken-Lightning narrative spreads on the team channel by lunch, and the migration is fighting for its life by day two. This is the most common and most preventable failure: blockers must be 100% dead before anyone migrates.

**Big-bang with no pilot.** The org flips everyone at once with no representative cohort having tested it first. Every problem is discovered at full org scale simultaneously, support is overwhelmed, the skeptics are exposed before any social proof exists, and there is no "we listened and fixed it" story to tell because there was no listening phase.

**Admin-led training.** Training is delivered entirely by the admin or RevOps, in webinar form. Reps tune out a non-peer telling them how to do their job, retention is near zero, and the org confuses "we delivered training" with "the team learned."

**No speed optimization.** The org accepts the default auto-generated Lightning record pages. Lightning is genuinely slower than Classic for everyday tasks, "Lightning is slow" is an accurate complaint the project cannot rebut, and the single best change-management asset — Lightning actually being faster — is squandered.

**Leaving the Classic toggle on forever.** The escape hatch is never closed. A persistent minority lives in Classic indefinitely, never builds Lightning muscle memory, and the org runs two systems permanently — split training, split support, inconsistent process, and a migration that technically "happened" but never finished.

**No executive modeling.** Leadership stays in Classic or never touches Salesforce directly. The team correctly reads this as "leadership does not believe in this," and the rollout loses its authority.

**No hard deadline.** "Phased" with no sunset date becomes permanent limbo. There is always a reason to extend, the holdouts wait it out, and the two-system state ossifies.

Every one of these is avoidable, and every one of them is more common than it should be. The pattern across all of them: they treat the migration as a technical project that needs a competent admin, when it is a change project that needs a competent admin *and* a real change-management plan.

## The Integration And AppExchange Check

A rep does not experience Salesforce in isolation — they experience Salesforce *and everything bolted to it.* If CPQ does not work in Lightning, the migration broke quoting. If the Gong integration does not surface in Lightning, the migration broke call review. The integration check is not a footnote to the technical backlog; it is a first-class workstream, because a broken integration is indistinguishable, from the rep's chair, from a broken Salesforce.

Inventory every integration and managed package: **CPQ** (Salesforce CPQ or whatever quoting tool the org uses), **conversation intelligence** (Gong, Chorus, or similar), **sales engagement** (Outreach, Salesloft, or similar), **document generation and e-signature** (DocuSign, Conga, Conga Composer, etc.), **marketing automation** connectors, **data enrichment** tools, **forecasting** tools, and any custom or middleware integrations. For each one, the questions are: does the vendor officially support Lightning (almost all major vendors do by now, but verify the *version* you are running), does the integration's UI render correctly inside the Lightning chrome, do the buttons and actions the integration adds still work, and does the end-to-end workflow — quote to signature, call to logged activity, sequence to CRM update — still function?

Test every one of these in a sandbox before any user migrates, and test the *workflow*, not just the connection. "CPQ loads" is not the test; "a rep can build, finalize, and send a quote end to end in Lightning" is the test. Where a vendor's Lightning support requires an upgrade, schedule that upgrade into the remediation window. Where an integration genuinely will not work in Lightning, that is a blocker, and it either gets remediated or the affected workflow gets re-platformed before cutover — it does not get discovered live by a rep trying to send a quote to a customer.

The AppExchange check also doubles as a cleanup opportunity: heavily-tenured orgs accumulate managed packages nobody uses anymore. The migration is a natural moment to audit, and uninstalling a dead package is one less thing to test and one less thing to break.

## Budget And Resourcing

A Classic-to-Lightning migration is not free, and pretending it is sets the project up to be under-resourced and rushed — which is how it fails. The honest budget has a few components.

**Admin hours** are the core cost. For a moderately customized org, the assessment, remediation, page design, pilot support, training build, and rollout management is a substantial multi-week commitment for at least one capable admin — and during the heaviest weeks it is effectively a full-time job. If your single admin is also keeping the lights on for daily operations, you are under-resourced; either dedicate them to the migration and backfill operational support, or add hands.

**Agency or contractor help** is worth real consideration specifically for the **heavy Visualforce and JavaScript remediation.** Converting a large backlog of complex JS buttons and rebuilding numerous VF pages as Lightning components is specialized work, and a good Salesforce implementation partner can compress that timeline significantly. The decision rule: if the readiness assessment reveals a large, complex technical backlog, the cost of partner help is usually less than the cost of a blown timeline or a botched remediation that triggers a rep revolt. If the org is lightly customized, you may not need a partner at all.

**The change-management effort itself** has a cost in time even if not in dollars — the champions' time, the pilot reps' time, the training-build time, the communication cadence. Budget for it explicitly rather than hoping it happens in the cracks.

**Licensing** is usually not a migration cost — Lightning Experience is included with the platform — but if the migration is the moment you are also turning on Einstein, Agentforce, or premium features to sweeten the WIIFM, those have license costs that belong in a separate line, not hidden in the migration budget.

The realistic cost varies enormously by org complexity. A 30-rep org with light customization might do the whole thing with one dedicated admin over eight to ten weeks and minimal external spend. A 100-rep org with a heavy JavaScript-button and Visualforce backlog might need a partner engagement and a four-month timeline. The mistake to avoid is the false economy: under-resourcing the migration to "save money" almost always costs more, because the failure mode is not "it costs a bit more" — it is "we have to do it twice, and the second time the team trusts us less."

## Five Real-World Scenarios

The right migration plan is not universal; it bends to the org. Five common shapes:

**The 30-rep org with light customization.** Few or no JavaScript buttons, minimal Visualforce, a clean-ish config. Here the technical backlog is small and the temptation — often correct — is a near-big-bang: a short remediation, a quick pilot mostly to validate the speed-optimized record pages, and a fast wave rollout. The change-management investment is real but light, because a clean, fast Lightning build genuinely does most of the selling. Do not over-engineer the change program for this org; do optimize the record pages for speed, because that is what wins the few skeptics you have.

**The 100-rep org with heavy JavaScript buttons.** Dozens of accumulated JS buttons, multiple Visualforce pages, years of customization debt. This is the canonical "do it properly" case: a long, serious remediation phase (likely with partner help), a careful representative pilot, champions per pod, full role-specific training, a multi-wave rollout, and a firmly-held sunset date. The technical backlog is the long pole; start it in week one and protect its timeline.

**The post-merger dual-org.** Two companies, two Salesforce orgs, possibly one on Classic and one on Lightning, and a mandate to converge. Here the Classic-to-Lightning migration is entangled with an org-consolidation project, and the change resistance is compounded by "you are also changing my company's processes." Sequence carefully — usually get everyone onto Lightning *within* their existing org first to isolate the UI change from the process change, then tackle consolidation — and double the change-management intensity because the resistance has two sources.

**The org with a CPQ dependency.** Quoting runs through Salesforce CPQ and the AEs live in it daily. The integration check is not one workstream among many — it is *the* gating workstream. Quoting must be verified end-to-end in Lightning before anything else proceeds, because a rep who cannot send a quote cannot do their job, and "the migration broke quoting" is a fatal narrative. Pilot reps must specifically exercise the full quote-to-signature flow.

**The org where leadership itself is the blocker.** The AEs would actually be fine, but the CRO will not commit, will not set a date, will not be visibly on Lightning, and keeps deferring. This is the scenario the counter-case section addresses directly: the problem is not change-resistant reps, the problem is an uncommitted sponsor, and no amount of rep-facing change management fixes it. The work here is upward — building the executive case, getting the sponsor genuinely bought in and on a hard date — before any team-facing migration work is worth starting.

## The Decision Framework

Strip the playbook down to its decision logic and it is three inputs driving two outputs.

The three inputs to assess: **org complexity** (how big is the JavaScript-button, Visualforce, and integration backlog from the readiness assessment?), **team readiness** (how change-resistant is the team, really — and is it the reps or is it leadership?), and **Salesforce deadline pressure** (how aggressively is the vendor forcing the issue for your specific org, and how exposed are your ISV apps?).

Those inputs drive two outputs. The first is **big-bang versus phased.** Low complexity plus a small, neutral-to-positive team plus moderate deadline pressure points toward big-bang or near-big-bang — the phased machinery would be overhead with no payoff. High complexity, a genuinely change-resistant team, or a large org points firmly toward phased-with-a-deadline, because you need the pilot, the social proof, and the wave structure. When in doubt with a change-resistant team, phased.

The second output is **the change-management intensity dial.** This is not binary — it is a knob you set based mostly on team readiness. A small team that is mildly skeptical needs a light touch: optimize for speed, do a quick pilot, communicate well, done. A large team with deeply entrenched, vocal, tenured resistance needs the full program: champions per pod, co-design with skeptics, the WIIFM per persona, the before/after studies, the sentiment dashboard, the 1:1s, the 30/60/90 reinforcement. Match the intensity to the resistance — under-investing leaves a revolt unaddressed, but over-investing (the counter-case below) wastes a quarter on theater a clean build did not need.

And one diagnostic gate sits in front of the whole framework: **make sure "the AEs hate change" is actually true** before you spend a quarter solving it. Sometimes it is true. Sometimes it is a symptom of a badly-configured Lightning org (fix the config). Sometimes it is leadership's indecision wearing a rep-shaped mask (fix the sponsorship). Diagnose the real problem first; the framework only gives the right answer if you have fed it the right inputs.

## 5-Year Outlook

The strategic case for migrating gets stronger every year, and a RevOps leader planning today should plan with the five-year arc in mind.

The dominant force is **AI, and it is Lightning-only.** Einstein's generative features, Agentforce, the autonomous-agent layer Salesforce is building out, conversation intelligence, predictive scoring, AI-drafted communications, AI record summaries — all of it lives in Lightning, and none of it will ever be back-ported to Classic. As these capabilities mature from "interesting" to "table stakes" over the next few years, the cost of being on Classic stops being "an older UI" and becomes "structurally locked out of the entire AI value layer of the platform." A sales org on Classic in 2028 is not just using a dated interface; it is competing against rivals whose reps have AI doing their admin work, surfacing their next best action, and drafting their follow-ups. The feature gap compounds into a productivity gap.

The **UI itself will keep evolving** — Lightning is not a destination, it is the live, maintained surface of the platform, and it will continue to change. Orgs that migrate now are not "done"; they are *on the train*, positioned to absorb each release incrementally. Orgs that stay on Classic are accumulating a jump that gets bigger and more disruptive the longer it is deferred. The eventual forced migration off Classic — whenever it lands for a given org — will be steeper, more painful, and more rushed for the procrastinators than the deliberate, well-managed migration available today.

The **ISV ecosystem** will continue its drift: more AppExchange packages Lightning-only, more vendors deprecating Classic support entirely, more "this integration requires Lightning Experience" notices. The Classic org's tooling options narrow every year.

The five-year-outlook conclusion is simple and it sharpens the original reality check: the migration is not just "when, not if" — it is "the cost of waiting compounds." The change-management hard work of moving a resistant team is a one-time cost. The cost of staying on Classic is a recurring, growing tax — in features foregone, AI value locked out, integrations lost, and an eventual forced jump made worse by every quarter of delay. Do the hard one-time thing now.

## Final Framework

Pull it all together into four artifacts a RevOps leader can act on Monday.

**The migration playbook.** Assess (Readiness Report, feature-gap audit, JS-button and VF and list-view and integration inventory, prioritized backlog, hard sunset date set). Remediate (convert JS buttons to Flows and Quick Actions, rebuild or wrap VF pages, clean list views, design speed-optimized Lightning record pages with Dynamic Forms and a component diet, verify every integration). Pilot (representative cohort including a respected skeptic, white-glove support, fast feedback channel acted on visibly, before/after task-time studies). Iterate (fold pilot feedback into config, finalize training). Wave rollout (migrate in waves with just-in-time training and champion support, watch the sentiment dashboard wave by wave). Classic sunset (close the escape hatch on the pre-announced date). Reinforce (30/60/90 follow-up, office hours, living feedback loop).

**The change-management checklist.** Executive sponsor visibly on Lightning day one. Champions recruited per team or pod — respected, credible AEs, not the loudest or most technical. Training that is role-specific, scenario-based, short, in-the-flow-of-work, peer-delivered, and just-in-time. WIIFM framed per persona. Reps warned about the muscle-memory dip. Vocal skeptics handled in 1:1s and, where possible, co-opted onto the design team. Wins quantified and communicated on a drip cadence. Hold firm only after everything else has genuinely been done.

**The adoption-measurement plan.** Lightning Usage App for login-as-Lightning percentage and switch-back monitoring. Feature-adoption metrics — Kanban, Path, timeline, split view, In-App Guidance — because presence is not adoption. Sentiment pulse surveys, short and frequent, as the leading indicator. All of it on one adoption-and-sentiment dashboard that functions as an early-warning system, watched pod by pod and wave by wave.

**The "when to kill Classic" trigger.** Keep Classic available as a genuine safety net through the pilot and the wave rollout. Communicate the hard sunset date from day one. Confirm before the date that every rep is migrated, trained, supported, and through the dip. Then, on the date — not before, not indefinitely after — actually close it.

Run those four artifacts with the diagnostic gate in front (make sure the problem you are solving is the problem you actually have), match the change-management intensity to the real resistance, choose phased-with-a-deadline for a change-resistant team, optimize for speed because speed is your best argument, and get the CRO on Lightning day one. That is how you migrate a Salesforce instance from Classic to Lightning when half the AE team hates change — not by overpowering the resistance, but by respecting it, addressing it objection by objection, and giving the team a faster tool, a real voice, and a deadline they cannot argue with.

`;

const flow = `

## The Phased Migration Timeline With Decision Gates

\`\`\`mermaid
flowchart TD
  A[Decision: Migrate Classic to Lightning] --> B[Phase 1: Assess Weeks 1-2]
  B --> B1[Run Lightning Readiness Report]
  B --> B2[Feature Gap Audit]
  B --> B3[JavaScript Button Inventory]
  B --> B4[Visualforce and List View Inventory]
  B --> B5[Integration and AppExchange Inventory]
  B --> B6[Set Hard Classic Sunset Date]
  B1 --> G1{Gate: Backlog Sized and Sponsor Locked?}
  B2 --> G1
  B3 --> G1
  B4 --> G1
  B5 --> G1
  B6 --> G1
  G1 -->|No| B
  G1 -->|Yes| C[Phase 2: Remediate Weeks 2-6]
  C --> C1[Convert JS Buttons to Flows and Quick Actions]
  C --> C2[Rebuild or Wrap Visualforce Pages]
  C --> C3[Clean Up List Views]
  C --> C4[Design Speed Optimized Record Pages]
  C --> C5[Verify Every Integration in Sandbox]
  C --> C6[Recruit and Pre Train Champions]
  C1 --> G2{Gate: All Blockers Remediated?}
  C2 --> G2
  C3 --> G2
  C4 --> G2
  C5 --> G2
  C6 --> G2
  G2 -->|No| C
  G2 -->|Yes| D[Phase 3: Pilot Weeks 5-8]
  D --> D1[Migrate Representative Cohort plus Respected Skeptic]
  D --> D2[White Glove Support]
  D --> D3[Before After Task Time Studies]
  D --> D4[Fast Feedback Channel Acted On Visibly]
  D1 --> G3{Gate: Pilot Sentiment Positive and Speed Proven?}
  D2 --> G3
  D3 --> G3
  D4 --> G3
  G3 -->|No| E[Phase 4: Iterate Weeks 7-9]
  E --> E1[Fold Pilot Feedback into Config]
  E --> E2[Finalize Role Specific Training]
  E1 --> D
  E2 --> D
  G3 -->|Yes| F[Phase 5: Wave Rollout Weeks 8-14]
  F --> F1[Migrate Team in Waves]
  F --> F2[Just In Time Training and Champion Support]
  F --> F3[Watch Sentiment Dashboard Wave by Wave]
  F3 --> G4{Gate: Wave Adoption Healthy?}
  G4 -->|No| F4[Slow Down and Intervene with Champion]
  F4 --> F
  G4 -->|Yes| H[Phase 6: Classic Sunset Weeks 13-15]
  H --> H1[Confirm All Reps Migrated Trained and Through the Dip]
  H1 --> H2[Close Escape Hatch on Pre Announced Date]
  H2 --> I[Phase 7: Reinforcement Weeks 14-16 plus]
  I --> I1[30 60 90 Day Follow Up]
  I --> I2[Office Hours and Living Feedback Loop]
  I --> I3[Advanced Feature Training]
  I1 --> J[Migration Complete and Permanent]
  I2 --> J
  I3 --> J
\`\`\`

## The Change-Resistance Handling Decision Tree

\`\`\`mermaid
flowchart TD
  A[AE Expresses Resistance to Lightning] --> B{Diagnose the Real Objection}
  B -->|Lightning Is Slower| C[Speed Problem]
  B -->|Buttons or Workflow Missing| D[Technical Gap]
  B -->|Do Not Know Where Things Are| E[Knowledge Gap]
  B -->|Past Bad Rollout or Change Fatigue| F[Trust Problem]
  B -->|I Just Do Not Want To Change| G[Pure Resistance]
  B -->|Leadership Has Not Committed| H[Sponsorship Problem]
  C --> C1[Redesign Record Page with Dynamic Forms]
  C1 --> C2[Component Diet and Tabbed Layout]
  C2 --> C3[Prove Faster with Before After Task Study]
  C3 --> Z[Resistance Resolved]
  D --> D1[Add to Remediation Backlog as Blocker]
  D1 --> D2[Convert to Flow or Quick Action]
  D2 --> D3[Fix Visibly and Fast to Prove We Listen]
  D3 --> Z
  E --> E1[Just In Time Role Specific Training]
  E1 --> E2[In App Guidance on the Changed Pages]
  E2 --> E3[Champion Walks Them Through It Peer to Peer]
  E3 --> Z
  F --> F1[1:1 Conversation Listen First]
  F1 --> F2[Recruit as Champion or Co Designer]
  F2 --> F3[Give New Status and a Real Voice]
  F3 --> Z
  G --> G1{Has Full Playbook Been Run First?}
  G1 -->|No| G2[Do Not Hold Firm Yet - Run Playbook]
  G2 --> B
  G1 -->|Yes| G3[Hold Firm: Platform Is Not Optional]
  G3 --> G4[Provide Full Support to Land It]
  G4 --> Z
  H --> H1[Stop Team Facing Work]
  H1 --> H2[Build Executive Case Upward]
  H2 --> H3[Get Sponsor Visibly on Lightning and on a Date]
  H3 --> A
\`\`\`

`;

const src = `

## Sources

1. **Salesforce — Lightning Experience Overview** — Official documentation on Lightning Experience, its feature set, and the strategic direction of the platform UI. https://www.salesforce.com/products/platform/lightning/
2. **Salesforce Help — Migrate to Lightning Experience** — The official migration guidance hub covering the Readiness Report, the migration assistant, and recommended sequencing.
3. **Salesforce Help — Lightning Experience Readiness Report** — Built-in tool that produces a personalized readiness assessment, flags unsupported features, and surfaces JavaScript buttons and other migration landmines.
4. **Salesforce Help — JavaScript Buttons in Lightning Experience** — Documentation confirming JavaScript custom buttons and links are not supported in Lightning and describing replacement patterns (Flows, Quick Actions, Lightning components).
5. **Salesforce — Lightning App Builder Documentation** — How to compose Lightning record pages from components, configure tabs, and assign pages by app, record type, and profile.
6. **Salesforce — Dynamic Forms Documentation** — Field-level placement and conditional visibility on Lightning record pages; the primary lever for speed and clarity on record pages.
7. **Salesforce — Dynamic Actions Documentation** — Conditional, page-level action configuration that complements Dynamic Forms in modern Lightning page design.
8. **Salesforce Help — Lightning Experience Performance and EPT (Experienced Page Time)** — Guidance on diagnosing and improving Lightning page-load performance.
9. **Salesforce — Lightning Usage App Documentation** — Built-in adoption monitoring: Lightning vs Classic usage, switch-back tracking, browser breakdown, and page performance.
10. **Salesforce — In-App Guidance Documentation** — Native tooling for delivering prompts and walkthroughs inside the product, in the flow of work.
11. **Salesforce Trailhead — Lightning Experience Rollout and Adoption Trails** — Free, structured learning content for admins and end users on planning and executing a Lightning migration.
12. **Salesforce — Path and Kanban Documentation** — Feature documentation for the Path component and Kanban view, two of the highest-value AE-facing Lightning capabilities.
13. **Salesforce — Activity Timeline and Activity Capture Documentation** — The Lightning activity timeline and Einstein Activity Capture, which automate and consolidate relationship history.
14. **Salesforce — Visualforce in Lightning Experience** — Documentation on how Visualforce pages behave inside the Lightning container and considerations for rebuilding versus wrapping.
15. **Salesforce — Flow Builder Documentation** — The declarative automation tool that replaces the large majority of legacy JavaScript buttons.
16. **Salesforce — Einstein and Agentforce Product Documentation** — The AI and autonomous-agent capabilities that are Lightning-only and that anchor the long-term strategic case for migration.
17. **Salesforce Release Notes (Winter '16 onward)** — The release history establishing Lightning Experience as the platform's forward UI and documenting the progressive auto-enablement of Lightning.
18. **Salesforce — Lightning Experience Configuration Converter** — Tool that assists with converting Classic configuration elements (including buttons and links) toward Lightning-compatible equivalents.
19. **Salesforce AppExchange — Lightning Ready Listings** — The AppExchange's "Lightning Ready" designation and the trend of managed packages requiring Lightning Experience.
20. **Salesforce — Mobile App Documentation** — The Salesforce mobile experience as a full Lightning experience, supporting the mobile-parity WIIFM for AEs.
21. **Prosci ADKAR Change Management Model** — Widely used change-management framework (Awareness, Desire, Knowledge, Ability, Reinforcement) underpinning the champion, training, and reinforcement structure in this playbook.
22. **Kotter's 8-Step Change Model** — Change-leadership framework informing the executive-sponsorship, urgency, and short-wins elements of the migration approach.
23. **Salesforce Help — Permission Sets and Profiles for Lightning Experience Access** — How Lightning access (and the Classic toggle) is controlled, enabling phased rollout and a controlled sunset.
24. **Salesforce — List Views in Lightning Experience** — Documentation on Lightning list views, inline editing, list-view charts, and Kanban-from-list-view, relevant to list-view cleanup and defaults.
25. **Salesforce — Quick Actions Documentation** — Object-specific and global Quick Actions, a primary replacement pattern for legacy custom buttons.
26. **Salesforce Trailblazer Community — Lightning Migration Discussions** — Practitioner-sourced guidance and common failure patterns from admins who have run Classic-to-Lightning migrations.
27. **Salesforce CPQ in Lightning Experience Documentation** — Vendor documentation confirming Lightning support and configuration for Salesforce CPQ, relevant to the integration-check workstream.
28. **Gong, Outreach, Salesloft, DocuSign, Conga — Lightning Compatibility Documentation** — Vendor documentation for major sales-stack integrations confirming Lightning Experience support and required versions.
29. **Salesforce Well-Architected — Adoption and Change Enablement** — Salesforce's own architectural guidance on driving and measuring adoption of platform changes.
30. **Salesforce — Sandbox and Deployment Documentation** — Best practices for testing remediation and integrations in a sandbox before production migration.

`;

const num = `

## Numbers

**Timeline**
- Total migration duration (change-resistant team): 8-16 weeks
- Phase 1 Assess: weeks 1-2
- Phase 2 Remediate: weeks 2-6
- Phase 3 Pilot: weeks 5-8 (2-4 weeks of pilot use)
- Phase 4 Iterate: weeks 7-9
- Phase 5 Wave rollout: weeks 8-14
- Phase 6 Classic sunset: weeks 13-15
- Phase 7 Reinforcement: weeks 14-16+ (30/60/90-day follow-up)
- Minimum viable timeline before remediation/pilot get skipped: ~8 weeks
- Limbo-risk threshold (phased rollout dragging): beyond ~16 weeks

**The Muscle-Memory Dip**
- Duration of perceived speed loss after migration: ~1-2 weeks
- Time to reach or exceed prior task speed (well-designed org): ~3 weeks
- Pilot length needed to capture the post-dip payoff: 2-4 weeks
- A pilot ending in week 1 captures: pain only, none of the payoff

**Pilot Cohort Composition**
- Eager early-adopter reps: a couple
- Solid average middle-of-distribution reps: a few
- Respected change-skeptical reps (the key social-proof recruits): 1-2
- Cohort size principle: large enough to be representative, small enough for white-glove support

**Champion Model**
- Champions per team or pod: ~1
- Champion profile: respected, tenured, quota-credible AE — not the loudest, not the most technical
- Relative trust weight: peer testimony >> admin enthusiasm >> generic vendor pitch

**Speed Optimization Levers (rough order of impact)**
1. Adopt Dynamic Forms (biggest single lever)
2. Strict component diet on every record page
3. Tabbed Lightning page layout (non-active tabs do not load until opened)
4. Trim the activity timeline
5. Sensible, well-filtered default list views
6. Audit custom Lightning components and Apex
7. Use EPT / page-performance tooling to fix the worst pages first

**The Six AE Objections (all rational, all mappable to a tactic)**
1. Muscle memory — every task temporarily takes ~5x longer while reps re-learn
2. Perceived speed loss — often a real speed loss from default record pages
3. "The new UI buries my buttons" — secondary actions moved into overflow menus
4. Past bad rollouts — pattern-matching against prior botched system changes
5. Change fatigue — revenue teams already saturated with tooling
6. Status and identity — mastery reset to zero, unspoken

**Common Failure Modes (count: 7)**
1. No remediation of broken JavaScript buttons → dead-end clicks → revolt
2. Big-bang with no pilot → every problem discovered at org scale at once
3. Admin-led training → near-zero retention
4. No speed optimization → "Lightning is slow" is accurate and unrebuttable
5. Leaving the Classic toggle on forever → permanent two-system limbo
6. No executive modeling → team reads it as "leadership does not believe in this"
7. No hard deadline → "phased" becomes permanent limbo

**Technical Backlog Inventory Items**
- Lightning Readiness Report (built-in, free, minutes to run)
- Feature-gap audit (severity: blocker / friction / cosmetic)
- JavaScript button inventory (the #1 migration landmine — JS buttons do not work in Lightning, period)
- Visualforce page inventory (run in Lightning but often render wrong — rebuild / wrap / leave)
- List view inventory (Classic orgs accumulate hundreds of stale views)
- Page layout inventory (the starting point for Lightning record page design)
- Integration & AppExchange inventory (CPQ, Gong, Outreach, Salesloft, DocuSign, Conga, etc.)

**JavaScript Button Replacement Patterns**
- Related-record creation with pre-filled fields → Quick Action or screen Flow
- Field updates based on logic → autolaunched / record-triggered Flow or Quick Action invoking a Flow
- External endpoint call → Flow with HTTP callout or invocable Apex
- Genuinely complex logic → Lightning web component / Aura component with Apex controller
- Vestigial / unused button → retire it (audit usage first)

**Decision Framework Inputs and Outputs**
- Input 1: org complexity (size of JS-button / VF / integration backlog)
- Input 2: team readiness (how change-resistant — and is it reps or leadership?)
- Input 3: Salesforce deadline pressure (vendor forcing + ISV exposure)
- Output 1: big-bang vs phased (change-resistant team → phased-with-a-deadline)
- Output 2: change-management intensity dial (match intensity to real resistance)
- Diagnostic gate: confirm "AEs hate change" is the actual problem before spending a quarter on it

**Adoption Measurement Hierarchy**
- Login-as-Lightning %: necessary but not sufficient (presence ≠ adoption)
- Switch-back-to-Classic rate: early-warning signal of an unmet need
- Feature-adoption metrics (Kanban, Path, timeline, split view, In-App Guidance): the number that actually matters
- Sentiment pulse surveys: the leading indicator — craters before feature adoption does
- Survey design: 2-3 questions, every ~2 weeks, low friction

**Reinforcement Cadence**
- 30 days: check adoption/sentiment data, run office hours, fix scaled-up friction
- 60 days: introduce advanced features reps were not ready for initially
- 90 days: review before/after metrics team-wide, celebrate wins publicly

**Resourcing**
- Core cost: dedicated admin time (effectively full-time during the heaviest weeks)
- Partner/agency help: worth it specifically for heavy VF/JS remediation in complex orgs
- 30-rep light-customization org: ~1 dedicated admin, 8-10 weeks, minimal external spend
- 100-rep heavy-JS org: likely partner engagement, ~4-month timeline
- Licensing: Lightning itself is included; Einstein/Agentforce premium features are a separate line

**The Phased Rollout Discipline**
- Hard Classic sunset date: set in week 1, communicated relentlessly, moved only for extraordinary reasons
- Blockers remediated before any user (pilot or otherwise) touches Lightning: 100%
- Escape hatch: kept open through pilot + wave rollout as a genuine safety net; closed on the pre-announced date — not before, not indefinitely after

`;

const counter = `

## Counter-Case: When The Change-Management Effort Is Over-Invested Or Misdirected

This playbook argues for a heavy, deliberate, change-management-led migration — and for a genuinely change-resistant team, that is right. But the same playbook applied to the wrong situation is wasted effort, and a serious RevOps leader should stress-test whether the resistance is real, located where they think, and worth the program before committing a quarter to it.

**Counter 1 — For a small team with light customization, a clean fast build sells itself.** If the org has few or no JavaScript buttons, minimal Visualforce, a clean configuration, and a team of, say, fifteen reps who are merely mildly skeptical rather than entrenched, the full change-management apparatus — champions per pod, co-design committees, the WIIFM-per-persona communication plan, the multi-wave rollout — is overhead with no payoff. What actually wins these reps is not a change program; it is a Lightning org that is genuinely fast and well-designed the first time they log in. Spend the energy on speed-optimized record pages and a clean config, do a short validation pilot, communicate clearly, and move. Over-engineering the change program for a team that did not need it burns goodwill ("why is this such a production?") and delays a migration that could have been quick. Match the intensity to the resistance — and sometimes the honest assessment is that the resistance is light.

**Counter 2 — When the resistance is a symptom of a genuinely worse-configured Lightning org, fix the config, not the people.** This is the most important counter-case, because it is the most commonly misdiagnosed. If AEs hate the new org and the reason is that the new org is *actually worse* — bloated default record pages that load slowly, broken buttons nobody remediated, a confusing page design, missing related lists, an unaddressed integration — then the reps are not change-resistant. They are correct. Pouring a change-management program onto a legitimately bad build is gaslighting with extra steps: you are running sentiment surveys and recruiting champions to sell reps a tool that genuinely does not serve them well. The "AEs hate change" framing becomes a way for the project to avoid looking at its own configuration failures. The fix for a worse-configured Lightning org is not more training and more champions and more communication — it is to go back and fix the configuration: redesign the record pages for speed, remediate the dead buttons, restore the missing functionality. Always check the config before you diagnose the people.

**Counter 3 — A phased rollout that drags creates a two-system limbo worse than a clean cutover.** Phased is the right default for a change-resistant team — but phased done without discipline is its own failure mode, and in some cases worse than the big-bang it was meant to be safer than. A phased rollout with no hard sunset date, that slips wave after wave, that lets a holdout population sit in Classic indefinitely "until they're comfortable," produces a sustained dual-system state: split documentation, split training, split support load, inconsistent rep experience, integrations that have to be maintained against two UIs, and a permanent population that never builds Lightning muscle memory because they never had to. For some orgs — particularly smaller ones where the technical risk of a big-bang is low and the limbo cost is high — a clean, well-prepared, well-supported big-bang cutover on a single date is genuinely the lower-risk choice. The lesson is not "never phase" — it is "phasing without a hard deadline is not the safe option, it is a different and sometimes larger risk."

**Counter 4 — "AEs hate change" is very often "leadership won't commit."** The single most common misdiagnosis in stalled Classic-to-Lightning migrations is attributing to the AEs a resistance that actually lives in the leadership chain. The story the admin or RevOps lead tells — "we can't migrate, the AE team will revolt" — frequently decodes, on inspection, to: the CRO will not set a date, will not be visibly on Lightning, will not publicly own the message, and keeps deferring "until it's a better time." The reps are not the blocker; the uncommitted sponsor is. And no amount of rep-facing change management — no champion program, no WIIFM deck, no sentiment dashboard — can fix a sponsorship problem, because the reps correctly read leadership's non-commitment and conclude, rationally, that this is not really happening. If you run the full team-facing playbook against a leadership problem, you will spend a quarter, exhaust the team's patience, and still not migrate, because you were treating the symptom. The diagnostic move is brutally honest: before you build a single training module, ask whether the CRO is genuinely, visibly, date-committedly bought in. If the answer is no, the entire project — for now — is an upward one: build the executive case, get the sponsor committed and on a hard date and on Lightning themselves. Only then is the team-facing playbook worth starting.

The synthesis of the counter-case is a single diagnostic discipline: **before you spend a quarter solving "the AEs hate change," prove that is the actual problem.** Sometimes it is, and the full playbook is exactly right. But sometimes the team is small and neutral and just needs a fast clean build. Sometimes the team is right because the build is bad. Sometimes the phased plan is the risk, not the safeguard. And very often the resistance is leadership's indecision wearing a rep-shaped mask. The change-management program in this playbook is powerful and frequently necessary — but it is a precise instrument, not a blunt one, and pointing it at the wrong problem is its own kind of failure.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — How do you start a [business type] business in 2027? (Baseline operational playbook structure referenced in this entry's framework approach.)
- **q9601** — How do you run a Salesforce admin practice in 2027? (The admin-side capability that owns the technical remediation backlog.)
- **q9602** — How do you build a RevOps function from scratch? (The organizational home for change-led system migrations like this one.)
- **q9603** — How do you choose between Salesforce and HubSpot in 2027? (Upstream platform-selection decision; this entry assumes Salesforce is already chosen.)
- **q9604** — How do you implement Salesforce CPQ without breaking quoting? (Deep dive on the CPQ dependency flagged in the integration-check section.)
- **q9605** — How do you migrate from one CRM to another with minimal disruption? (The harder cousin of a UI migration; shares the change-management spine.)
- **q9606** — How do you drive CRM adoption when reps refuse to log activity? (Adjacent adoption problem; the feature-adoption-vs-presence distinction applies directly.)
- **q9607** — How do you build a Salesforce data model that scales? (The underlying schema that record-page design sits on top of.)
- **q9608** — How do you roll out Einstein and Agentforce to a sales team? (The Lightning-only AI layer that anchors this entry's 5-year-outlook case.)
- **q9609** — How do you run a software rollout when half the team hates change? (The generalized change-management pattern this entry specializes for Salesforce.)
- **q9610** — How do you measure sales tooling adoption and ROI? (The measurement discipline behind the adoption-and-sentiment dashboard.)
- **q9611** — How do you recruit and run an internal champions program? (Deep dive on the champion model central to this playbook.)
- **q9612** — How do you design Salesforce Lightning record pages for speed? (Technical deep dive on the Dynamic Forms and component-diet section.)
- **q9613** — How do you convert Salesforce JavaScript buttons to Flows? (Technical deep dive on the #1 remediation-backlog item.)
- **q9614** — How do you get executive sponsorship for an operations project? (The upward work the counter-case identifies as the real blocker in many stalled migrations.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (Parallel case of a revenue org navigating AI-driven platform change.)

`;

const tags = ['salesforce','lightning-experience','crm-migration','change-management','revops','sales-operations','salesforce-admin','adoption','user-adoption','2027'];

const sources = [
  { title: 'Salesforce — Lightning Experience Overview', url: 'https://www.salesforce.com/products/platform/lightning/' },
  { title: 'Salesforce Help — Migrate to Lightning Experience', url: 'https://help.salesforce.com/s/articleView?id=sf.lex_migration.htm' },
  { title: 'Salesforce Help — Lightning Experience Readiness Report', url: 'https://help.salesforce.com/s/articleView?id=sf.lex_readiness_check.htm' }
];

const notes = {
  s6: 'Added 30 cited sources: Salesforce official documentation (Lightning Experience, migration guidance, Readiness Report, Lightning App Builder, Dynamic Forms, Dynamic Actions, EPT/performance, Lightning Usage App, In-App Guidance, Path/Kanban, Activity Timeline, Visualforce-in-Lightning, Flow Builder, Einstein/Agentforce, release notes, Configuration Converter, AppExchange Lightning Ready, mobile, permission sets, list views, Quick Actions, CPQ, Well-Architected, sandbox/deployment), Trailhead rollout trails, Trailblazer Community migration discussions, major integration-vendor Lightning compatibility docs (Gong/Outreach/Salesloft/DocuSign/Conga), and change-management frameworks (Prosci ADKAR, Kotter 8-Step).',
  s7: 'Added comprehensive numerical analysis: 8-16 week phased timeline with all seven phases dated, the 1-2 week muscle-memory dip and 3-week recovery, pilot cohort composition, champion-per-pod ratio, the seven speed-optimization levers in priority order, the six rational AE objections, the seven common failure modes, the technical-backlog inventory items, JavaScript button replacement patterns, the three-input/two-output decision framework, the adoption-measurement hierarchy (presence vs adoption), the 30/60/90 reinforcement cadence, resourcing math (30-rep vs 100-rep org), and the phased-rollout discipline rules (hard sunset date, 100% blocker remediation, escape-hatch timing).',
  s8: 'Added 4-element counter-case on when change-management effort is over-invested or misdirected: (1) small light-customization team where a clean fast build sells itself and the full program is wasted overhead, (2) resistance as a symptom of a genuinely worse-configured Lightning org — fix the config, not the people, (3) phased rollout dragging into a two-system limbo worse than a clean big-bang cutover, (4) "AEs hate change" as a frequent misdiagnosis of "leadership won\'t commit" — a sponsorship problem no rep-facing program can fix. Synthesized into a single diagnostic discipline: prove the resistance is the actual problem before spending a quarter on it.',
  s9: 'Cross-linked 16 related Pulse entries: Salesforce admin/RevOps practice entries (q9601/q9602), platform-selection and CRM-migration adjacencies (q9603/q9605), CPQ implementation deep dive (q9604), CRM adoption and measurement (q9606/q9610), data model and record-page/JS-button technical deep dives (q9607/q9612/q9613), Einstein/Agentforce rollout (q9608), generalized software-rollout change management (q9609), champions program and executive sponsorship deep dives (q9611/q9614), the q9501 baseline structure, and q1899 on AI-driven revenue-org change.',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of the Salesforce Classic-to-Lightning migration playbook for a change-resistant AE team. Two mermaid diagrams (the seven-phase migration timeline with decision gates; the change-resistance handling decision tree mapping objection type to diagnosis to tactic). Full coverage: the reality check (Classic end-of-life, Lightning-only feature roadmap, Salesforce auto-enablement), the six rational AE objections, big-bang vs phased philosophies and why phased-with-a-deadline wins for resistant teams, the readiness assessment (Readiness Report, feature-gap audit, JS-button inventory, unsupported-feature list), the technical remediation backlog (JS-button-to-Flow conversion patterns, Visualforce rebuild/wrap, list-view cleanup, Lightning App Builder), designing Lightning record pages for speed (Dynamic Forms, component diet, tabs, EPT), pilot-group strategy (representative cohort including a respected skeptic as social proof), the champion model and per-persona WIIFM, training that lands (role-specific, scenario-based, short, in-the-flow-of-work, just-in-time), the AE WIIFM pitch (Kanban, Path, activity timeline, split view, Einstein, mobile parity, Notes), quantifying and communicating the win (before/after task-time studies, sentiment dashboard), handling the vocal minority (1:1s, co-design judo, when to hold firm), the realistic 8-16 week rollout timeline, using the Salesforce-forced deadline as air cover, measuring adoption beyond presence (Lightning Usage App, feature-adoption metrics, sentiment pulse), post-migration reinforcement and the 30/60/90 and killing the escape hatch at the right time, executive sponsorship (CRO visibly on Lightning day one), seven common failure modes, the integration and AppExchange check, budget and resourcing, five real-world scenarios, the three-input decision framework, the 5-year outlook (Agentforce/AI deepening the cost of Classic), the final four-artifact framework, and a four-element counter-case on over-invested or misdirected change-management effort.'
};

runPolish({ id: 'q9512', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
