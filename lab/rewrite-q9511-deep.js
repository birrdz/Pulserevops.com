// q9511 — What is the right Salesforce permission set architecture for a 30-rep team that does not break every time you add a user?
const { runPolish } = require('./polish-helper');

const tldr = `**TL;DR:** The right Salesforce permission architecture for a ~30-rep B2B sales org is **"profiles minimal, permissions in sets"** — Salesforce's own modern guidance and the direction the platform is forcing everyone toward as profile-based permissions head for deprecation. Concretely: build **one or two thin base profiles** ("Standard Sales User" and "Standard Internal User") that grant almost nothing beyond login, default record types, page layouts, and a license assignment — then layer **everything else** through **permission sets and permission set groups (PSGs)**. Design **persona-based PSGs** — AE, SDR, Sales Manager, Sales Ops, Deal Desk — where each PSG is a *composition* of small, single-purpose **granular building-block sets** (PS_Object_OpportunityEdit, PS_Tool_Gong, PS_App_CPQ, PS_Feature_Forecasting). When you add a user you assign **base profile + one persona PSG** and they are fully provisioned in under two minutes with zero guessing. When an SDR is promoted to AE you **remove the SDR PSG, add the AE PSG** — one swap, fully auditable, no profile migration, no cloning, no drift. Use **muting permission sets** inside a PSG to subtract a permission for a sub-persona (a "Junior AE" who should not delete Opportunities) without forking the whole group. Keep record access **completely separate** — that is org-wide defaults, a clean 3-4 level role hierarchy (CRO → Sales Directors → Managers → Reps), and sharing rules; permission sets control *what you can do*, the sharing model controls *which records you see*, and conflating the two is the single most common source of confusion. Enforce a **naming convention** (PSG_Persona_AE, PS_Object_*, PS_Tool_*, PS_App_*) so the architecture is self-documenting, **automate assignment** with a record-triggered flow or SCIM/SSO when you outgrow manual, and run a **quarterly hygiene review** for orphaned sets, over-provisioned users, and "permission set debt." The anti-pattern to kill on sight is **"a profile per role"** — 15 profiles, each a snowflake, every new hire a guessing game, every change a clone-and-pray. The counter-case: if you are a genuinely tiny org with no admin to maintain the model, two profiles may legitimately suffice — but for 30 reps with any growth trajectory, the layered model pays for itself within the first three new hires.`;

const core = `

## The Core Principle: Profiles Minimal, Permissions In Sets

If you remember one sentence from this entire entry, make it this: **profiles should be thin, and permissions should live in permission sets.** This is not a stylistic preference or a consultant's hobby horse — it is Salesforce's own published modern guidance, and it is the architectural direction the platform itself is forcing on every org whether they like it or not. Salesforce has been explicit since 2022 that they are working toward the **end of permissions on profiles** — the long-running roadmap item where profiles stop being a permissions container entirely and become nothing more than a thin shell holding a license assignment, default record types, page layout assignments, login hours, and login IP ranges. Every permission that *grants the ability to do something* — object CRUD, field-level security, system permissions, app access, Apex class access, custom permissions — is being pushed out of profiles and into permission sets and permission set groups.

The mental model is **base layer plus additive layers.** The base profile is the floor: it is the same for every sales rep in the building and grants the absolute minimum. Then you stack permission sets and permission set groups on top, each one adding a specific, named, auditable capability. A user's effective permission is the **union** of their profile and every permission set assigned to them — Salesforce always grants the *most* permissive result across the stack (with one deliberate exception, muting, covered later). Nothing is ever *removed* by adding a permission set; permissions only accumulate upward.

Why does this matter so much for a 30-rep team specifically? Because 30 reps is exactly the size where the old profile-centric model has *just* started to rot but has not yet become a catastrophe — it is the perfect moment to fix it cheaply. At 5 reps you can get away with anything. At 300 reps a bad model is a six-month remediation project. At 30 reps you have enough personas (AE, SDR, manager, ops, deal desk) and enough hiring velocity (you are probably adding 1-3 people a month) that the cracks show, but the cleanup is still a weekend, not a quarter. The teams that win are the ones that adopt the layered model *before* they have 15 profiles, not after.

The payoff of the principle is concrete and measurable. With thin profiles plus layered sets: a new hire is provisioned in two minutes; a promotion is a one-line swap; an audit question ("who can edit Opportunity Amount?") is a two-click answer; a new tool rollout (Gong, CPQ, Outreach) is one new permission set assigned to one PSG, not fifteen profile edits. With the profile-per-role model, every one of those operations is a manual, error-prone, undocumented archaeology project. The principle is the whole game — everything else in this entry is just the implementation detail of how you actually build it.

## Why The "Profile Per Role" Approach Breaks

The anti-pattern is so common it deserves a full autopsy, because most 30-rep orgs are living inside it right now and do not realize it is the source of their pain. It starts innocently. You have a "Sales User" profile. Then someone says "SDRs should not be able to delete Opportunities" — so you clone "Sales User" to "SDR User" and tweak it. Then "managers need to see the forecast tab" — clone again, "Sales Manager User." Then "the SMB reps use a different page layout than enterprise reps" — clone, "SMB Sales User," "Enterprise Sales User." Then CPQ rolls out and only some reps get it — clone. Then a VP wants a custom dashboard folder — clone. Eighteen months later you open Setup and there are **fifteen profiles**, each one a slightly different snowflake, and not one human being can tell you the difference between "Sales User v2" and "Enterprise Sales User Updated."

Here is precisely why this breaks, mechanism by mechanism. **First, profiles do not compose.** A permission set is additive — you can assign three of them to one user and the result is the union. A profile is exclusive — a user has *exactly one*. So every time a real-world need is the *combination* of two things ("an enterprise AE who also does deal desk"), you cannot mix two profiles; you must clone a *third* profile that hard-codes the combination. This is why profile counts explode combinatorially — n personas with any overlap produces far more than n profiles.

**Second, every new hire becomes a guessing game.** When the admin gets a ticket "new AE starting Monday," they open the profile picklist, see fifteen near-identical options, and have to *guess* — or worse, pull up a "similar" existing user and copy whatever that person has, inheriting whatever drift and one-off grants that person accumulated. There is no canonical "this is what an AE gets." The knowledge lives in the admin's head, and when that admin leaves, it is gone.

**Third, changes do not propagate.** When you need to grant a new field to "all AEs," you cannot do it once. You have to remember *which* of the fifteen profiles represent AEs — "Sales User," "Enterprise Sales User," "SMB Sales User," "Sales User v2"? — and edit each one identically, by hand, hoping you did not miss one and did not fat-finger one. Drift is not a risk in this model; drift is the *default state*. Within a year no two "AE" profiles are actually identical.

**Fourth, it is un-auditable.** When SOC 2 season arrives and the auditor asks "show me everyone who can export reports" or "prove least privilege for Opportunity deletion," the answer requires you to manually inspect fifteen profiles and cross-reference user assignments. There is no clean query, no single source of truth.

And the promotion case — the one in this question's framing — is the sharpest illustration. An SDR gets promoted to AE. In the profile-per-role world, you have to *change their profile*. Changing a profile mid-flight can change their record type defaults, their page layouts, their app visibility, and their entire permission baseline in one irreversible action — and if the "AE" profile has drifted, you have just given them a slightly-wrong configuration that nobody will notice until something breaks in the middle of a deal. The profile-per-role model does not just make new hires hard; it makes *every personnel change* a small act of faith.

## The Recommended Architecture For 30 Reps

Here is the concrete target for a ~30-rep B2B sales org. **Two base profiles, no more.**

**"Standard Sales User"** — assigned to every quota-carrying or sales-adjacent person: AEs, SDRs, sales managers, sales ops, deal desk. It grants: the Sales Cloud license assignment, default record types for Lead/Opportunity/Account/Contact, the standard sales page layouts, login hours and login IP ranges (your security baseline), and the bare-minimum tab visibility (Home, Chatter). It grants **no object permissions beyond the platform defaults, no field-level security edits, no system permissions, no app access decisions.** It is deliberately, almost uncomfortably, thin.

**"Standard Internal User"** — assigned to everyone who is *not* in the sales motion but needs CRM access: marketing, finance, customer success, executives outside the sales org, IT/admin staff. Same philosophy — thin, license + layouts + defaults, nothing else.

Some orgs can even collapse to **one** base profile. The only reason to keep two is if the two populations need genuinely different *license types*, *default record types*, or *login security baselines*. If they do not, one "Standard User" profile is cleaner still. The number to fight for is **as close to one as your license and security constraints allow** — and certainly never more than three or four for an org this size.

Everything else — literally everything that makes an AE an AE and an SDR an SDR — lives **above** the profile, in permission sets and permission set groups. The architecture has four layers stacked on the user:

1. **Base profile** (the thin floor).
2. **Granular building-block permission sets** — small, single-purpose, composable units of capability.
3. **Permission set groups** — persona bundles that compose the granular sets.
4. **The assignment** — a user gets the base profile plus one (occasionally two) persona PSGs.

This is the whole architecture. A 30-rep org needs roughly **5 persona PSGs** and somewhere between **15 and 30 granular building-block sets**, plus a handful of tool- and feature-specific sets. That is a completely manageable inventory — it fits on one page of documentation — and it scales smoothly to 100 and 300 reps without structural change. You add granular sets and PSGs; you never have to *re-architect*.

The discipline that makes it work: **profiles are never edited after initial setup.** Once "Standard Sales User" exists, it is frozen. Every future capability change happens in a permission set. If you find yourself reaching for the profile editor, stop — that instinct is the old model trying to reassert itself.

## Permission Sets vs Permission Set Groups

These two objects do related but distinct jobs, and getting the distinction right is the difference between an architecture and a mess.

A **permission set** is a single, additive bundle of permissions you assign to a user *on top of* their profile. It can contain object permissions, field-level security, system permissions, app access, Apex class access, Visualforce page access, custom permissions, and connected app access. The best ones are **small and single-purpose** — "edit access to the Opportunity object and its core fields," "access to the CPQ managed package," "the Gong connected app." A permission set should ideally do *one nameable thing*.

A **permission set group** is a *container that bundles multiple permission sets together* and is itself assigned to users as a single unit. A PSG does not contain permissions directly — it contains *permission sets*. When you assign a PSG to a user, they get the union of every permission set inside it. The PSG is the **composition layer**: it is how you say "an AE is the combination of these eight granular sets."

The decision rule is simple. Use a **standalone permission set** when the capability is genuinely one-off or shared across personas in an unpredictable way — for example, a single power user who needs one unusual permission nobody else has, or a tool-access set (PS_Tool_Gong) that gets dropped into multiple PSGs. Use a **permission set group** when you are describing a **persona** — a recurring, well-defined role that multiple people hold and that has a stable, documented bundle of needs.

The killer feature of PSGs is the **muting permission set** — a special permission set *inside* a PSG whose job is to *subtract* permissions from the group's net result. Normally permissions only add; a muting set is the one mechanism that removes. This lets you build a "Junior AE" experience by taking the full "AE PSG" and adding a muting set that removes "delete Opportunity" — without cloning the entire AE PSG into a separate "Junior AE PSG" that then has to be maintained in parallel forever. Muting is covered in depth in its own section below, because it is the feature that finally kills the last reason people used to clone things.

How groups *compose* is the elegant part: because a PSG is just a list of permission sets, and permission sets can belong to multiple PSGs, you build your granular sets once and *reuse* them across every persona that needs them. PS_Object_AccountRead might appear in the AE PSG, the SDR PSG, the Manager PSG, and the Ops PSG. Change it once, and all four personas update. That is the propagation property the profile model could never deliver.

## The Persona-Based Permission Set Group Model

For a 30-rep B2B sales org, build these five persona PSGs. Each is a *composition* of granular building-block sets — the PSG itself holds no raw permissions.

**PSG_Persona_AE** — the account executive. Composed of: PS_Object_OpportunityEdit, PS_Object_AccountEdit, PS_Object_ContactEdit, PS_Object_LeadConvert, PS_Feature_Forecasting (view their own), PS_App_CPQ (if you sell with CPQ), PS_Tool_Gong, PS_Tool_Outreach, PS_System_ReportCreate, PS_System_ExportReports. This is the richest persona — AEs touch the most objects and the most tooling.

**PSG_Persona_SDR** — the sales development rep. Composed of: PS_Object_LeadEdit, PS_Object_ContactEdit, PS_Object_AccountRead (read, not edit — SDRs work accounts but do not own them), PS_Object_OpportunityCreate (create only — they generate pipeline but do not manage deals), PS_Tool_Outreach, PS_Tool_Gong, PS_System_ReportRun (run, not create). Notice the deliberate restraint: the SDR PSG is *smaller* than the AE PSG, and the difference between them is exactly the set of capabilities a promotion should grant.

**PSG_Persona_SalesManager** — the front-line manager. Composed of: everything in the AE granular stack (managers are usually ex-AEs and still touch deals) *plus* PS_Feature_ForecastingManage (manage the team forecast), PS_System_ViewAllReports, PS_Object_OpportunityViewAll (within their hierarchy — though note record visibility is *also* governed by the role hierarchy, covered later), PS_Feature_TeamDashboards.

**PSG_Persona_SalesOps** — sales operations. Composed of: broad read across all sales objects, PS_System_ManageReportsAndDashboards, PS_App_DataLoader or PS_System_BulkApiAccess, PS_Feature_TerritoryManagement (if used), PS_System_CustomizeApplication-adjacent permissions *carefully scoped* — ops people need power but not full admin. Many orgs give Sales Ops a *delegated admin* setup rather than packing everything into a PSG; that is a legitimate variant covered in the automation section.

**PSG_Persona_DealDesk** — deal desk / quoting. Composed of: PS_App_CPQ (full CPQ user), PS_Object_QuoteEdit, PS_Object_OpportunityEdit, PS_Object_ContractEdit, PS_Feature_ApprovalProcessAdmin, PS_Feature_PriceBookManage. Deal desk is a small but high-privilege persona — usually 1-3 people in a 30-rep org — and bundling them as a PSG keeps that privilege visible and auditable.

The beauty of this model for the promotion case: **SDR → AE is "remove PSG_Persona_SDR, add PSG_Persona_AE."** One swap. The user keeps their base profile (unchanged — record types, layouts, login security all stay constant), and their *capabilities* change cleanly from the SDR bundle to the AE bundle. It is auditable (the assignment history shows exactly what changed and when), reversible (swap back if the promotion is rescinded), and requires zero guesswork because both PSGs are documented, canonical definitions. No profile migration, no cloning, no "let me copy what that other AE has."

## The Granular Building-Block Sets

The granular sets are the LEGO bricks. Get these right and the PSGs assemble themselves. The discipline: **each set is small, single-purpose, and named for exactly what it does.** Categories:

**Object-and-field access sets.** One per object-and-access-level combination you actually use: PS_Object_OpportunityEdit (CRUD + the FLS for Opportunity fields an editor needs), PS_Object_OpportunityCreate (create-only, for SDRs), PS_Object_OpportunityViewAll, PS_Object_AccountEdit, PS_Object_AccountRead, PS_Object_LeadEdit, PS_Object_LeadConvert, PS_Object_ContactEdit, PS_Object_QuoteEdit, PS_Object_ContractEdit. These are the workhorses. Resist the temptation to make one giant "Sales Objects" set — granularity is what lets you compose precisely and mute surgically later.

**Feature-license and feature-access sets.** Salesforce gates certain capabilities behind *feature settings* and sometimes behind *permission set licenses*: PS_Feature_Forecasting, PS_Feature_ForecastingManage, PS_Feature_TerritoryManagement, PS_Feature_ApprovalProcessAdmin, PS_Feature_TeamDashboards. Keeping these as discrete sets means turning a feature on for a persona is one line in a PSG.

**App-access sets.** Which Salesforce *apps* (the app launcher entries) and which *managed packages* a persona can see: PS_App_CPQ, PS_App_SalesConsole, PS_App_DataLoader. Managed-package access in particular is cleanest as its own set because packages bring their own permission sets and you want a single named place that says "this persona uses this package."

**Tool-specific / connected-app sets.** Every external tool that integrates via a connected app gets its own set: PS_Tool_Gong, PS_Tool_Outreach, PS_Tool_Salesloft, PS_Tool_Clari, PS_Tool_ZoomInfo. When you roll out a new tool, you build *one* set and drop it into whichever PSGs should have it. When you churn a tool, you delete one set. The tool layer becomes completely modular.

**System-permission sets.** The org-wide system permissions, scoped tightly: PS_System_ReportCreate, PS_System_ReportRun, PS_System_ExportReports, PS_System_ManageReportsAndDashboards, PS_System_BulkApiAccess, PS_System_ApiEnabled. These are the ones auditors care about most, so keeping them as named, discrete, easily-queried sets is a compliance gift to your future self.

The single-purpose rule has one practical exception worth naming: it is fine for an object set to bundle the object's CRUD *with* the field-level security for that object's fields, because FLS without object access is meaningless and the two always travel together. The line you do not cross is bundling *two unrelated objects* or *an object plus a system permission* into one set — that is where composability dies.

A 30-rep org typically ends up with 15-30 of these granular sets. That feels like a lot until you realize each one is tiny, each one is named for exactly what it does, and together they assemble *every* persona your org has now and most personas it will ever have.

## Object & Field-Level Security Strategy

Object permissions and field-level security (FLS) are *capability* controls — they answer "can this user, in principle, see or edit this object and these fields?" — and they belong in permission sets, never (going forward) in profiles. The strategy is **least privilege as the default and edit access as the exception.**

Start every persona from "read" and justify every "edit." An SDR reads Accounts; an AE edits them. An AE reads Contracts; only deal desk edits them. The granular object sets encode exactly this: PS_Object_AccountRead and PS_Object_AccountEdit are *separate* sets precisely so you can hand "read" to many personas and "edit" to few. The read-vs-edit discipline is the cheapest, highest-leverage least-privilege control you have, and the granular-set model makes it nearly free to enforce.

Field-level security lives in the *same set as the object access it pertains to*. PS_Object_OpportunityEdit contains both the Opportunity CRUD and the FLS for the Opportunity fields an editor should be able to write. This keeps FLS *discoverable* — when someone asks "why can AEs edit Opportunity Amount?" the answer is "it is in PS_Object_OpportunityEdit, which is in PSG_Persona_AE" — a two-hop, fully documented trace. The failure mode to avoid is FLS scattered across profiles *and* sets, where the effective access of a field is the union of a dozen places and nobody can reason about it.

A few field-level rules that matter for a sales org: sensitive fields (commission rates, internal scoring, margin, cost) should be **read-only or hidden** for reps and edit-only for ops/finance — encode that in a dedicated PS_Object_OpportunitySensitiveFields set that *only* ops personas get. Calculated and roll-up fields are read-only by nature; do not waste a grant on them. And remember FLS is *capability*, not *visibility* — a user with FLS-edit on a field still only sees it on records the *sharing model* lets them see. Which is the entire point of the next section.

## Record Access: Org-Wide Defaults + Role Hierarchy + Sharing Rules

This is the single most misunderstood part of Salesforce security, and getting it straight is essential: **permission sets and the record-sharing model are orthogonal.** They answer different questions and they do not substitute for each other.

Permission sets answer: *"What is this user, in principle, capable of doing to this type of object?"* — can they edit Opportunities at all?

The record-sharing model answers: *"Which specific Opportunity records does this user actually get to see and act on?"*

A user needs **both** to do anything. PS_Object_OpportunityEdit gives an AE the *capability* to edit Opportunities. The *sharing model* decides *which* Opportunities — their own, their team's, the whole org's. If you grant the capability but the sharing model does not share the record, the user sees nothing. If the sharing model shares the record but the user lacks the capability, they see it read-only. People constantly try to fix a "can't see records" problem by adding permission sets — and it never works, because the problem was never capability; it was sharing.

The record-sharing model has three layers for a 30-rep org:

**Org-wide defaults (OWD)** — the baseline. For a sales org, set Opportunity and Account to **Private** (or "Public Read Only" if your culture is very open, but Private is the standard and the safer default). Private means "by default you only see records you own" — and then you *open up* access deliberately through the layers below. Lead is often Private too. Setting OWD to Private and *granting* access upward is far safer than setting it Public and trying to *claw* access back.

**Role hierarchy** — the vertical access mechanism. The role hierarchy automatically grants a manager access to every record owned by people *below* them in the hierarchy. This is how a Sales Manager sees their reps' deals without any sharing rule — they are *above* those reps in the role hierarchy. (Note: the role hierarchy is *separate* from the management-reporting org chart and *separate* from PSGs — it exists purely to drive record rollup.)

**Sharing rules** — the horizontal and exception mechanism. When you need access that is *not* "down the hierarchy" — peer reps on the same pod seeing each other's deals, the deal desk seeing all Opportunities regardless of owner, marketing seeing all Leads — you write a sharing rule. Sharing rules grant access *sideways and outward*.

The clean mental separation: **PSGs = what you can do. OWD + role hierarchy + sharing rules = which records you can do it to.** Keep these in two separate compartments of your brain and your architecture, and the whole system becomes reason-about-able. Conflate them and you will spend your career adding permission sets to fix sharing problems and writing sharing rules to fix capability problems, and nothing will ever quite work.

## The Role Hierarchy For A 30-Rep Team

The role hierarchy for 30 reps should be **clean, shallow, and 3-4 levels deep — no more.** Depth in a role hierarchy buys you nothing but confusion; what you want is just enough levels to make manager-rollup work.

A canonical 30-rep structure:

- **Level 1: CRO / VP Sales** — one person, sees everything below.
- **Level 2: Sales Directors** — one or two, each over a segment (e.g., Enterprise, SMB) or geography.
- **Level 3: Sales Managers** — three to five, each over a pod of 5-8 reps.
- **Level 4: Reps (AEs and SDRs)** — the ~24-28 individual contributors, the leaves of the tree.

That is the whole hierarchy. Sales Ops and Deal Desk usually sit *off to the side* — either in their own small branch under the CRO, or in a peer role that gets broad record access via sharing rules rather than hierarchy rollup (because ops needs to see *everything*, which the hierarchy alone would only give the CRO).

The critical discipline: **the role hierarchy is for record access, not for permissions and not for the org chart.** It is tempting to mirror the management org chart exactly, or to add roles for "Senior AE" vs "Junior AE" — resist it. A Senior AE and a Junior AE are the *same role* for record-access purposes (they both see their own deals); their difference is a *permission* difference, handled with a muting set in the PSG, not a hierarchy difference. Every unnecessary role is a node that complicates sharing reasoning forever.

One genuine design choice at this size: **role-hierarchy-driven sharing vs. territory management.** For most 30-rep orgs, the role hierarchy plus a few sharing rules is entirely sufficient and territory management is over-engineering. Territory management (Enterprise Territory Management) earns its keep when reps are assigned to accounts by *territory rules* (geography, named-account lists, segment) and those assignments change frequently and need to drive sharing automatically — that is more often a 100-plus-rep reality. At 30 reps, start with the role hierarchy; adopt territory management only when account-to-rep assignment becomes a genuine rules-driven, high-churn problem. Adding it prematurely is a classic over-build.

## Muting Permission Sets

Muting is the feature that finally eliminates the last legitimate reason anyone ever had to clone something. Here is the mechanism: a **muting permission set** is a special permission set that exists *only inside a permission set group*, and its job is the opposite of every other permission set — it **removes** permissions from the group's net result rather than adding them.

Recall that a PSG's effective permission is normally the *union* of all its member sets — purely additive. A muting permission set is the one deliberate exception: any permission switched on in the muting set is *subtracted* from the group's final output, even if another set in the group granted it. The muting set does not change the granular sets themselves — PS_Object_OpportunityEdit still grants delete-Opportunity to every *other* PSG that uses it — it only mutes that permission *within this one group.*

The canonical use case for a 30-rep sales org: the **Junior AE.** A Junior AE should have the full AE experience *except* they should not be able to delete Opportunities or export reports (you do not want a brand-new rep nuking a deal or walking out with a data extract). In the profile-per-role world you would clone the entire AE profile into "Junior AE" and maintain two near-identical things forever. In the layered world you do this:

1. Keep one **PSG_Persona_AE** as the canonical AE definition.
2. Create a **second PSG — PSG_Persona_AE_Junior** — that contains *the exact same granular sets* as PSG_Persona_AE, *plus* a muting permission set (PS_Mute_JuniorAE) that mutes "delete Opportunity" and "export reports."

Now the Junior AE PSG and the full AE PSG share *all* their granular building blocks. When you add a field to PS_Object_OpportunityEdit, *both* PSGs get it automatically — there is no drift, because there is no fork. The *only* difference between the two PSGs is the small muting set, which is a single, named, auditable artifact that says exactly "here is what a Junior AE cannot do."

This is the elegance: muting lets you express *sub-personas as subtractions from a parent persona* rather than as forked copies. The promotion from Junior AE to full AE becomes "swap PSG_Persona_AE_Junior for PSG_Persona_AE" — and the only thing that actually changes is the removal of the muting constraint. Use muting deliberately and sparingly — it is for genuine sub-personas, not for one-off exceptions — but where it fits, it is the cleanest tool in the box.

## The New-Hire Onboarding Flow

The goal state for onboarding a new sales hire is brutally simple and you should measure yourself against it: **base profile + one persona PSG = fully provisioned, in under two minutes, with zero guessing.**

Walk the flow for a new AE starting Monday:

1. **Create the user.** Assign the **Standard Sales User** base profile. There is no decision here — every sales person gets the same base profile. No picklist of fifteen near-identical profiles, no archaeology.
2. **Assign one PSG: PSG_Persona_AE.** Again, no decision-tree — "this person is an AE" maps to exactly one PSG. The PSG carries every granular set an AE needs: object access, FLS, forecasting, CPQ, Gong, Outreach, report creation. All of it, in one assignment.
3. **Assign the role** in the role hierarchy (their pod's rep-level role) so record sharing rolls up correctly to their manager.
4. **Done.** The user logs in fully provisioned. Every capability is correct because the PSG *is* the canonical definition of "AE." Nothing was guessed, nothing was copied from a "similar" user, nothing drifted.

Contrast that with the profile-per-role onboarding: open the profile picklist, guess which of fifteen profiles is "right," or pull up an existing AE and try to replicate whatever ad-hoc permission sets *they* happened to accumulate, then discover three weeks later that you missed the CPQ access because the "reference" user got theirs through a one-off grant nobody documented. The layered model does not just make onboarding *faster* — it makes it **deterministic.** The same inputs always produce the same correctly-provisioned user, and the process is documentable in five lines that a brand-new admin can execute on day one.

This determinism is also what makes onboarding *delegatable* and *automatable*. Because "new AE" maps to a fixed, documented recipe (base profile X + PSG Y + role Z), you can hand it to a junior admin, write it into a runbook, or — as the next sections cover — automate it entirely with a flow. You cannot automate a guessing game; you can absolutely automate a deterministic recipe.

## Permission Set Licenses vs Feature Licenses

This is the layer that trips up even experienced admins, and it is worth being precise because it is *orthogonal* to your whole permission-set architecture and yet can block it cold.

Salesforce has multiple kinds of "license," and they do different jobs:

**User licenses** — the big one attached to the *user record* via the profile. Salesforce, Salesforce Platform, and so on. This determines the broad universe of what the user can ever do. Your base profile assigns this. A "Salesforce" user license user can use full CRM; a "Platform" license user cannot touch standard CRM objects like Opportunity at all, no matter how many permission sets you pile on.

**Permission set licenses (PSLs)** — licenses that are assigned by *assigning a permission set that requires them*. Some capabilities — CRM Analytics, certain Sales Cloud features, Identity, and notably **CPQ** — are gated behind a permission set license. The capability does not work until the *user has the PSL*, and the PSL is consumed when you assign the relevant permission set. This is the gotcha: you build a beautiful PS_App_CPQ set, assign it via the AE PSG, and it silently does nothing because the org ran out of CPQ permission set licenses, or the user's profile's user license is incompatible with the PSL.

**Feature licenses** — older toggles on the user record (Marketing User, Offline User, Knowledge User, etc.). Mostly legacy, but still real for a few features.

The practical rules for a 30-rep org: **(1)** Know your seat counts — how many full Salesforce licenses, how many CPQ permission set licenses, how many Sales Cloud feature entitlements you actually own. **(2)** Map each persona PSG to the licenses it *consumes* — PSG_Persona_DealDesk consumes a CPQ PSL per assignee; PSG_Persona_AE may or may not, depending on whether AEs configure quotes. **(3)** When a tool-access set "does nothing," check the license layer *first* — nine times out of ten it is a missing or exhausted PSL, not a permission-set bug. **(4)** Track license consumption in your quarterly hygiene review (below) so you do not discover you are out of CPQ seats the morning a new deal-desk hire starts. The permission-set architecture is the *what*; the license layer is the *am I even allowed to* — and you need both green for anything to work.

## Automating Assignment

Manual PSG assignment is fine at 30 reps with steady hiring — it is genuinely a two-minute task. But the moment you want *consistency guarantees* or you are scaling, you automate. The progression:

**Record-triggered flow on the User object.** The simplest automation: a flow that fires when a User is created or updated, reads a field — a custom "Persona" picklist on the User record, or the user's Title, or their Department — and assigns the matching PSG via the PermissionSetAssignment object. Set "Persona = AE" on the user record and the flow assigns PSG_Persona_AE. This turns onboarding into "create user, pick persona, save" — and crucially it makes assignment *consistent*: the flow cannot forget the CPQ set the way a hurried admin can.

**Group membership / public group driven.** A variant where flow assigns based on the user's role or a public group, useful when persona maps cleanly to org structure.

**User provisioning on creation via SSO/SCIM.** The scale answer. If your org uses an identity provider (Okta, Entra ID, etc.) with **SCIM provisioning**, you can drive Salesforce user *creation and PSG assignment* from the IdP. HR adds the person to the "AE" group in Okta; Okta provisions the Salesforce user with the right profile and pushes the persona attribute; a Salesforce flow (or the SCIM mapping itself) assigns the PSG. The promotion case becomes *fully hands-off*: HR moves the person from the "SDR" group to the "AE" group in the IdP, and the SDR PSG comes off and the AE PSG goes on automatically, end to end, with the IdP as the auditable system of record. This is overkill for many 30-rep orgs *today* but it is exactly the thing the layered architecture makes *possible* — you cannot SCIM-drive a guessing game, but you can absolutely SCIM-drive "persona attribute maps to one PSG."

**Permission Set Group assignment with expiration.** Salesforce supports time-bound permission set and PSG assignments — assign a PSG with an end date. Useful for contractors, interns, or temporary deal-desk coverage: the access *self-expires*, which is a least-privilege and audit win.

The principle: automate the *deterministic* recipe. Because the layered model made onboarding deterministic ("persona maps to exactly one PSG"), it is *automatable* — and automation removes the last source of human inconsistency. The profile-per-role model could never be safely automated because there was no deterministic recipe to encode.

## The Documentation & Naming Convention

An architecture that is not self-documenting is an architecture that rots the day its author leaves. The single highest-leverage, lowest-cost thing you can do is **enforce a strict naming convention** so the architecture explains itself in the Setup UI without anyone having to open a wiki.

The convention for a 30-rep sales org:

- **Permission set groups:** \`PSG_Persona_<Role>\` — PSG_Persona_AE, PSG_Persona_SDR, PSG_Persona_SalesManager, PSG_Persona_SalesOps, PSG_Persona_DealDesk, PSG_Persona_AE_Junior.
- **Object/field sets:** \`PS_Object_<Object><AccessLevel>\` — PS_Object_OpportunityEdit, PS_Object_AccountRead, PS_Object_LeadConvert.
- **Tool/connected-app sets:** \`PS_Tool_<ToolName>\` — PS_Tool_Gong, PS_Tool_Outreach, PS_Tool_ZoomInfo.
- **App/package sets:** \`PS_App_<AppName>\` — PS_App_CPQ, PS_App_DataLoader.
- **Feature sets:** \`PS_Feature_<FeatureName>\` — PS_Feature_Forecasting, PS_Feature_TerritoryManagement.
- **System-permission sets:** \`PS_System_<Permission>\` — PS_System_ExportReports, PS_System_BulkApiAccess.
- **Muting sets:** \`PS_Mute_<Context>\` — PS_Mute_JuniorAE.

With this convention, an admin who has never seen the org can open the Permission Sets list, sort alphabetically, and *immediately* read the architecture: the PS_Object_ block is object access, the PS_Tool_ block is integrations, the PSG_Persona_ block is the personas. The names *are* the documentation.

Beyond names, every permission set and PSG has a **Description field** — use it, always. One sentence: what this set grants, why it exists, which PSGs consume it, who owns the decision to change it. And maintain one **architecture page** — a single document (in Confluence, Notion, a Salesforce CMS page, wherever your org lives) with: the two base profiles and what they grant, the five persona PSGs and their granular-set composition, the granular-set inventory with one-line descriptions, the role hierarchy diagram, and the onboarding runbook. One page. For a 30-rep org the whole architecture genuinely fits on one page — and a one-page architecture is one that survives admin turnover.

## Auditing & Hygiene

A permission architecture is a garden, not a statue — it accrues weeds. Schedule a **quarterly hygiene review** and treat it as non-negotiable. The checklist:

**Orphaned permission sets.** Permission sets assigned to *zero* users and belonging to *zero* PSGs. These accumulate from abandoned projects, churned tools, and experiments. They are clutter and audit noise — document why each exists or delete it.

**Orphaned/empty PSGs.** PSGs with no granular sets, or no assignees. Same treatment.

**Over-provisioned users.** Users with PSGs *or* standalone permission sets that do not match their persona — the AE who somehow has the Sales Ops PSG, the rep with three one-off permission sets nobody remembers granting. Direct standalone permission set assignments (as opposed to PSG-delivered ones) are the biggest red flag: in a healthy layered org, *almost everyone's access comes from their persona PSG and nothing else.* Every direct assignment is a documented exception or it is a cleanup target.

**Permission set debt.** The accumulated drift: one-off grants made "just for now" during an incident, sets that drifted from their single-purpose intent and now bundle three unrelated things, PSGs that grew a fourteenth granular set that nobody can justify. Each quarter, pay down a slice of the debt — re-split a bloated set, fold an exception into a persona or formally document it.

**License consumption.** Cross-check PSL and feature-license usage against what you own (the gotcha from the licenses section). Catch the "out of CPQ seats" problem in the review, not on a new hire's first morning.

**The access-review report.** Build a standing report or dashboard: users by PSG, users with direct (non-PSG) permission set assignments, permission sets by assignee count, system-permission grants (who can export, who can use the API). This report *is* your SOC 2 access-review evidence and your hygiene-review input simultaneously — build it once, use it forever.

The discipline is light — a couple of hours a quarter for a 30-rep org — but it is the difference between an architecture that stays clean for years and one that quietly becomes the next "fifteen profiles" mess in a different costume.

## Migrating From A Profile-Heavy Legacy Org

Most teams reading this are not greenfield — they have the fifteen-profile mess *today* and need a migration path. The good news: the migration is incremental and low-risk if you do it persona by persona rather than big-bang.

**Step 1 — Inventory.** Document every existing profile: who is on it, what it grants (object perms, FLS, system perms, app access), and what *real-world persona* it actually represents. You will discover that your fifteen profiles collapse to about five real personas with a lot of drift between supposedly-identical profiles. That collapse *is* your target PSG list.

**Step 2 — Design the target.** Define the two base profiles and the five persona PSGs and their granular-set composition — on paper, before touching the org. The architecture page from the documentation section *is* this deliverable.

**Step 3 — Build the granular sets and PSGs in a sandbox.** Construct the whole layered model in a sandbox. Build the granular building-block sets, assemble them into PSGs, and test by assigning the new PSGs to test users alongside their existing profile — verify the *union* gives them everything they had.

**Step 4 — Migrate persona by persona.** In production, pick the *lowest-risk persona first* (often SDRs — fewest integrations, simplest needs). Move the base profile to "Standard Sales User," assign PSG_Persona_SDR, and verify each SDR retains exactly their prior access. Then the next persona, then the next. Never migrate all five at once.

**Step 5 — Collapse the profiles.** As each persona migrates onto the thin base profile, the old role-specific profiles empty out. Once a legacy profile has zero users, *deprecate it* (rename it "ZZ_DEPRECATED_OldSalesUser" so it sorts to the bottom and nobody assigns it by accident), and after a safe observation period, delete it.

**Step 6 — Validate.** Run the access-review report before and after for each persona; the *capability set* per user should match. Use "login as" spot-checks on a sample of users per persona.

The whole migration for a 30-rep org is realistically a few weeks of part-time work, mostly testing, with no user-facing disruption if done persona-by-persona. The risk is entirely in big-bang attempts; the incremental path is boring and safe.

## Common Breakage Patterns & Their Fixes

Every org has these recurring breakages. The point of the layered architecture is that each one has a *clean structural fix* instead of a one-off patch.

**"The new hire is missing a field."** Symptom: a new AE cannot see Opportunity Amount. Profile-world fix: hunt down which permission set or profile has the FLS and patch it for this user. Layered-world fix: the field is missing because PS_Object_OpportunityEdit (in PSG_Persona_AE) does not grant that FLS — *add it to the granular set once*, and every AE, present and future, is fixed. The fix propagates.

**"The manager can't see a team member's report/deal."** Symptom: a Sales Manager cannot see a rep's Opportunity. This is almost always a *record-access* problem, not a permission problem — the rep is not below the manager in the role hierarchy, or OWD plus the hierarchy is not rolling up. Fix: correct the *role hierarchy*, not the PSG. (If you instinctively reached for a permission set here, that is the orthogonality lesson biting — re-read the record-access section.)

**"The integration user has too much / too little access."** Symptom: an integration breaks (too little) or a security review flags it (too much). Fix: integration users get their *own* dedicated, minimal, single-purpose permission set — never a human persona PSG. See the next section.

**"A promoted SDR still has SDR limitations / lost AE access."** Symptom: post-promotion the user has a weird hybrid of access. Cause: someone changed the profile but did not swap the PSGs, or added the AE PSG but left the SDR PSG on, or made one-off patches. Fix: the promotion is *always* exactly "remove PSG_Persona_SDR, add PSG_Persona_AE" — no profile change, no patches. If that one operation does not fully work, the bug is in a PSG definition and you fix the *definition*, which fixes it for every future promotion.

**"Someone has access nobody can explain."** Symptom: hygiene review finds a user with a permission and no PSG that grants it. Cause: a direct, standalone permission set assignment — the layered model's equivalent of profile drift. Fix: either fold the capability into the right persona PSG (if it should be standard) or formally document it as an exception with an owner and an expiry.

The pattern across all five: in the layered model the fix is *structural and propagating* — you fix the granular set or the PSG or the hierarchy *once*, and the class of bug is gone. In the profile model every fix was a one-off patch that fixed one user and left the next one to rediscover the same problem.

## The Integration & API User Pattern

Integration users — the service accounts that connect Salesforce to your data warehouse, your marketing automation, your CPQ middleware, your iPaaS — deserve their own deliberate pattern, because they are both a security risk and a reliability risk when handled casually.

**Rule 1: dedicated users, never a human's account.** Every integration gets its *own* Salesforce user — "Integration - Snowflake," "Integration - Marketo," "Integration - Workato." Never run an integration through a real person's login: it breaks when that person leaves, it makes audit logs unreadable (you cannot tell the human's actions from the integration's), and it is a textbook least-privilege violation.

**Rule 2: minimal, scoped, dedicated permission sets.** An integration user gets a base profile (often a restrictive one — Salesforce Integration license where the use case allows, or a minimal Salesforce profile) plus *its own purpose-built permission set* — PS_Integration_Snowflake, PS_Integration_Marketo — granting *exactly and only* the object access, FLS, and API permission that one integration needs. Not a human persona PSG — those grant far more than any integration should have. The integration set is the narrowest thing in your org.

**Rule 3: API-enabled, UI-restricted.** Integration users need PS_System_ApiEnabled (and often Bulk API access); they usually do *not* need UI login, report creation, or app access. Restrict accordingly — and where possible restrict the integration user's login to known IP ranges.

**Rule 4: name and document every one.** "Integration - <System>" naming, a description on the user and on its permission set stating what it connects and who owns it, and an entry on the architecture page. Integration users are exactly the accounts a security auditor scrutinizes hardest; make them legible.

**Rule 5: review them in the quarterly hygiene pass.** Integration users accumulate scope creep ("the integration needs one more object" — granted, never revisited). Each quarter, re-justify each integration permission set against what the integration *actually* calls.

The promotion case has a quiet parallel here: just as you never want a human's access to be a guess, you never want an integration's access to be a mystery. Dedicated user plus dedicated minimal set makes both the *what* and the *why* explicit.

## Testing Permission Changes Safely

Permission changes are deceptively dangerous — a single FLS toggle can break a flow, an integration, or a rep's daily workflow, and the blast radius is "everyone with that PSG." Test like it matters.

**Sandbox first, always.** Every structural change — a new granular set, a re-composed PSG, a muting set, a migration step — gets built and tested in a sandbox before it touches production. A full or partial-copy sandbox lets you assign the changed PSG to a test user who mirrors a real persona and actually *click through* their daily workflow.

**The "login as" check.** Salesforce's "Log in as" lets an admin assume a user's exact context — their profile, their PSGs, their record visibility. After any permission change, log in as a representative user of each affected persona and verify: can they still do everything they should, and *nothing* they should not? This catches both under- and over-provisioning, and it is the single most reliable manual check available.

**The permission-set-assignment preview.** Before assigning a PSG, use Salesforce's tooling to *preview* the net effective permissions — what the user will have *after* the assignment, accounting for the union across profile and all sets and any muting. This catches surprises (a muting set that mutes more than intended, two sets that combine to grant something unexpected) before they reach a real user.

**Change one layer at a time.** When debugging, change the granular set *or* the PSG composition *or* the role hierarchy — never several at once — so when something breaks you know which layer did it. The layered architecture *helps* here: because capability and record-access live in separate compartments, you can reason about and test them separately.

**Validate against the access-review report.** After a change, re-run the access-review report and diff it against the pre-change snapshot. The diff should show *exactly* the change you intended and nothing else. An unexpected line in the diff is a bug you just caught for free.

The throughline: the layered model is *more testable* than the profile model, because every change is localized to a named, single-purpose artifact, and "login as" plus the assignment preview give you deterministic verification. You are never guessing whether a change worked — you can see it.

## Scaling The Model From 30 → 100 → 300 Reps

The best property of the layered architecture is that it scales by *extension*, not by *re-architecture*. What you build for 30 reps is structurally the same thing you run at 300 — you add pieces, you do not rebuild.

**What holds, unchanged, all the way up:** the thin base profiles (you might add a third for a genuinely new license population, but the philosophy never changes); the persona-PSG model (the *concept* is identical at 300 reps); the granular building-block sets (you accumulate more, but each is still small and single-purpose); the naming convention; the orthogonality of capability vs. record access; the quarterly hygiene cadence.

**What you add going 30 → 100:** more *granular* PSGs as personas subdivide — "AE" splits into "Enterprise AE" and "SMB AE" with different tool stacks, each its own PSG composed of mostly-shared granular sets plus a few segment-specific ones. More tool sets as the stack grows. *Automated* assignment becomes non-optional — the record-triggered flow stops being nice-to-have. The role hierarchy gains a level (a regional layer).

**What you add going 100 → 300:** **territory management** likely earns its keep now — rules-driven account assignment driving record sharing. **Delegated administration** — you carve out delegated admin groups so regional ops can manage their own users' PSG assignments within guardrails, instead of everything funneling through one central admin. **SCIM/SSO-driven provisioning** becomes the standard, not the aspiration — the IdP is the system of record for persona, and PSG assignment is fully automated end to end. More formal **change management** around permission sets — a request-and-approval process, possibly metadata-source-controlled.

What you *never* do, at any scale, is go back to profile-per-role. The profile model breaks *worse* as you grow; the layered model just absorbs growth. The 30-rep build is not a starter model you outgrow — it is the *same* model, smaller. That is the entire reason to build it correctly now.

## Tooling To Manage It

Native Salesforce Setup is genuinely sufficient to *build and run* this architecture for a 30-rep org — the permission set, PSG, and muting-set UIs are all there, and the assignment and "login as" tooling works. You do not *need* third-party tooling at 30 reps. But as you scale, or if you have inherited a mess, dedicated tools make permission *visibility* and *change management* dramatically easier:

**Native Setup** — building, assigning, the permission-set-group calculation, "login as," the assignment preview. The floor, and for 30 reps often the whole story.

**Salesforce Security Center / Shield** — for orgs with compliance weight, Salesforce's own products for monitoring permission and configuration drift across orgs.

**Sonar, Elements.cloud, Metazoa, Salto** — the third-party category. Broadly they give you: *permission visibility* (a queryable, diff-able view of who has what and why, far beyond what native reporting offers), *dependency and impact analysis* (if I change this set, what breaks), *documentation generation* (auto-mapping the PSG-to-set-to-user graph), and *change management* (treating permission metadata as version-controlled, reviewable change). Salto in particular treats Salesforce config as code; Elements.cloud is strong on documentation and impact analysis; Metazoa and Sonar lean toward org analysis and cleanup.

**The honest 30-rep recommendation:** build it in native Setup, document it on one page, and run the quarterly hygiene review by hand — that is entirely adequate and free. Add a visibility/change-management tool when one of three things is true: you have inherited a genuine mess and need analysis to untangle it; you have hit a scale (well past 100 users, multiple orgs) where native reporting cannot answer audit questions fast enough; or your compliance regime demands tooled, evidenced change control. Buying a permission-management platform for a clean 30-rep org is the tooling equivalent of the over-engineering counter-case — solving a problem you do not yet have.

## The Security & Compliance Angle

If your company is pursuing or holding **SOC 2**, ISO 27001, or operating under any regime with access controls (and most B2B SaaS companies selling upmarket are), the layered permission architecture is not just operationally nicer — it is *the thing that makes the audit cheap.*

**Least privilege as demonstrable evidence.** SOC 2's access-control criteria want *evidence* that users have the minimum access required for their role. The layered model produces that evidence as a *byproduct*: "every user has exactly their persona PSG, each PSG is a documented composition of single-purpose granular sets, here is the one-page architecture, here is the access-review report showing the mapping." That is a clean, legible answer. The profile-per-role model's answer — "fifteen drifted profiles, manual cross-referencing" — is the answer that turns an audit into a multi-week scramble and a finding.

**The access-review process.** Auditors want a *recurring, documented* access review. Your quarterly hygiene review *is* that process — formalize it: a calendar event, a checklist, the access-review report as the artifact, a sign-off. You built it for hygiene; it doubles as compliance evidence at zero extra cost.

**Separation of duties.** Compliance regimes care that high-privilege capabilities (data export, API access, admin-adjacent permissions) are *restricted and visible*. Because those live in named PS_System_* sets assigned through specific PSGs, "who can export production data?" is a one-query answer — and you can *show* that reps cannot and only ops can. Separation of duties is *expressible* in the layered model in a way it simply is not when permissions hide in fifteen profiles.

**Provisioning and de-provisioning evidence.** Auditors check that access is granted appropriately on hire and *removed* on departure. The deterministic onboarding recipe and (where used) SCIM-driven assignment give you a clean provisioning story; PSG assignment with expiration dates and the IdP-driven de-provisioning give you a clean removal story. Both are *auditable events* rather than tribal-knowledge actions.

**The promotion case as a compliance micro-example.** When an SDR is promoted to AE, the auditor's implicit question is "was access changed appropriately and is it traceable?" In the layered model the answer is a single PermissionSetAssignment change record: SDR PSG removed, AE PSG added, timestamped, attributable. That is *exactly* the kind of clean, traceable access change that makes an auditor move on to the next item. The architecture that makes operations easy is the same architecture that makes compliance easy — they are not a trade-off; they are the same property viewed twice.

## 5 Real-World Scenarios

**Scenario 1 — Clean greenfield 30-rep build.** A Series B company is implementing Salesforce fresh. Do it right from day zero: one "Standard Sales User" base profile, five persona PSGs (AE, SDR, Manager, Ops, Deal Desk), ~20 granular building-block sets, a clean 3-level role hierarchy, OWD set to Private on Opportunity/Account, the naming convention enforced from the first object, a one-page architecture doc, and a record-triggered flow assigning PSGs from a Persona field. Total build: a couple of weeks. The company never experiences profile sprawl because it never started down that road. This is the cheapest possible version of the entire entry — and the rarest, because most teams find this article *after* the sprawl.

**Scenario 2 — Messy 15-profile legacy cleanup.** An eight-year-old org has fifteen sales profiles, nobody knows the differences, every new hire is a guess. Run the migration playbook: inventory the fifteen profiles (they collapse to five real personas), design the target in a sandbox, migrate persona by persona starting with SDRs, collapse and deprecate the emptied profiles, validate with access-review diffs and "login as." A few weeks of part-time work, no user disruption, and the org ends with two base profiles and five PSGs. The biggest surprise in this scenario is always *how much drift* the inventory reveals — "identical" profiles that were not.

**Scenario 3 — Post-merger two-org consolidation.** Company A (layered model) acquires Company B (profile-per-role). Two Salesforce orgs must become one. The layered org's architecture *becomes the standard*. Company B's profiles are inventoried and mapped onto Company A's persona PSGs; where Company B has a genuinely new persona, it becomes a new PSG. The merge is bounded because the target architecture already exists and is documented — you are *mapping into* a clean model, not inventing one under deadline pressure. (If *neither* org had the layered model, step one is building it before consolidating — do not merge two messes.)

**Scenario 4 — Adding a CPQ rollout.** A 30-rep org on a clean layered model rolls out Salesforce CPQ. The work: build PS_App_CPQ (and confirm the CPQ permission set licenses are owned and not exhausted — the license-layer gotcha), add PS_App_CPQ to PSG_Persona_DealDesk and PSG_Persona_SalesManager, and add a quoting-scoped CPQ set to PSG_Persona_AE if AEs build quotes. Three PSG edits, one new granular set, license check. In the profile-per-role world this same rollout meant editing *every sales profile that should get CPQ* by hand. The layered model turns a tool rollout into a contained, hours-long change.

**Scenario 5 — Onboarding a 10-person SDR pod.** The company spins up a new outbound SDR pod — ten hires in one month. Because "SDR" maps to exactly one PSG, onboarding ten people is the *same deterministic recipe* run ten times: Standard Sales User profile + PSG_Persona_SDR + the pod's role, ideally executed by the record-triggered flow so it is ten identical, consistent provisionings with zero drift between them. The tenth SDR is configured *identically* to the first. In the profile-per-role world, ten rapid hires is ten chances to guess wrong and ten slightly-different configurations to reconcile later.

## The Decision Framework

How do you design *your* permission architecture? Work the layers in this order — it is the same order whether you are greenfield or migrating:

**Step 1 — Inventory your personas.** Not your profiles, not your org chart — your *personas*. Who are the genuinely distinct *kinds of user* in your sales org by what they need to *do*? For most 30-rep B2B orgs the answer is five: AE, SDR, Sales Manager, Sales Ops, Deal Desk. Maybe a sixth (sales engineer, partner manager). Write them down. This list becomes your PSG list.

**Step 2 — Decompose each persona into granular capabilities.** For each persona, list the discrete capabilities: which objects at which access level, which fields, which features, which tools, which system permissions. The *union* of these lists, de-duplicated, is your granular-building-block-set inventory. The *overlap* between personas is the reuse that makes the model efficient.

**Step 3 — Compose the PSGs.** Each persona PSG is the list of granular sets that persona needs. Add muting sets where a sub-persona is "parent minus a few things." Now every persona is a documented composition.

**Step 4 — Define the base profile(s).** Whatever is left — the truly universal floor (license, default record types, layouts, login security) — is the base profile. Aim for one; accept two only if license or security baselines genuinely differ.

**Step 5 — Design the record-access model separately.** OWD, role hierarchy, sharing rules — this is a *parallel* design exercise, not part of the permission-set work. Keep the two compartments separate (the orthogonality principle).

**Step 6 — Name, document, automate, and schedule hygiene.** Apply the naming convention, write the one-page architecture doc, build the assignment automation when manual stops being consistent, and put the quarterly review on the calendar.

The framework is *persona-first*: you start from "who needs to do what," derive the granular sets and PSGs from that, and the thin base profile falls out as the residue. If you start anywhere else — from your existing profiles, from your org chart, from the objects — you will end up reverse-engineering the mess instead of designing the model.

## 5-Year Outlook

The trajectory is not ambiguous, because Salesforce has told everyone where it is going.

**Profile permissions are ending.** Salesforce's multi-year roadmap to remove permissions from profiles entirely continues. The endgame: profiles become *pure* shells — license, default record types, page layout assignments, login hours/IP — and *every* permission lives in a permission set or PSG. Orgs that adopted the layered model are already living in that future; orgs still on profile-per-role face a *forced* migration on Salesforce's timeline rather than their own. Building the layered model now is not optional best practice for much longer — it is getting ahead of a deprecation.

**Permission set groups become the only sane unit of management.** As profiles thin to nothing, the PSG becomes *the* primary container admins reason about. Persona-based PSGs are not just a good idea today; they are the management primitive of the post-profile world.

**AI-assisted permission management arrives.** Expect Salesforce (and the third-party tools — Salto, Elements, Sonar) to ship AI that *analyzes* permission usage and *recommends*: "these 6 users have PS_System_ExportReports but have not exported in 90 days — candidates for muting," "this PSG has drifted, here is the re-composition," "this new hire's persona suggests PSG_Persona_AE." AI will make the *hygiene review* semi-automated — but it will only work well on a *clean, named, layered* architecture. AI cannot make sense of fifteen drifted profiles; it *can* reason about PSG_Persona_AE composed of named single-purpose sets. The layered model is the substrate AI permission tooling needs.

**Identity-driven provisioning becomes the default.** SCIM/SSO-driven, IdP-as-system-of-record provisioning moves from "large-org practice" to "standard practice" even at 30-50 reps, as IdP tooling commoditizes. Persona lives in the IdP; PSG assignment is fully automated; the promotion case becomes a single HR action in Okta. Again — only possible because the layered model made persona-to-access *deterministic*.

**What the model becomes:** thinner profiles (eventually empty), PSGs as the universal unit, AI handling hygiene and recommendations, the IdP driving assignment. The 30-rep org that builds the persona-PSG model correctly today is not building for today — it is building the exact structure the next five years of the platform assume you already have.

## Final Framework

The target architecture, stated as plainly as possible:

**The structure.** One (ideally) or two thin base profiles — license, default record types, page layouts, login security, *nothing else*. Five persona permission set groups — PSG_Persona_AE, PSG_Persona_SDR, PSG_Persona_SalesManager, PSG_Persona_SalesOps, PSG_Persona_DealDesk — each a *composition* of 15-30 small, single-purpose granular building-block permission sets (PS_Object_*, PS_Tool_*, PS_App_*, PS_Feature_*, PS_System_*). Muting permission sets inside PSGs for sub-personas. A clean, separate, 3-4 level role hierarchy plus OWD-Private plus a few sharing rules for record access — *orthogonal* to the permission sets.

**The naming convention.** PSG_Persona_<Role>, PS_Object_<Object><Access>, PS_Tool_<Tool>, PS_App_<App>, PS_Feature_<Feature>, PS_System_<Permission>, PS_Mute_<Context> — the names *are* the documentation.

**The onboarding flow.** Create user → Standard Sales User base profile → one persona PSG → role assignment → done, in under two minutes, deterministically, automatable via a record-triggered flow or SCIM.

**The promotion flow.** SDR → AE is exactly: remove PSG_Persona_SDR, add PSG_Persona_AE. One swap. No profile change, no clone, no guess, fully auditable as a single assignment-change record.

**The audit cadence.** Quarterly hygiene review — orphaned sets, over-provisioned users, permission-set debt, license consumption, the access-review report — which doubles as SOC 2 access-review evidence.

**The one rule above all rules.** Profiles minimal, permissions in sets. Profiles are never edited after setup. Every capability change happens in a permission set. Capability (PSGs) and record access (sharing model) live in two separate compartments and never get conflated.

Build this for 30 reps and you have built the thing that scales to 300 unchanged, survives admin turnover because it is self-documenting, passes audits cheaply because least privilege is a byproduct, and turns the two operations that used to break everything — new hires and promotions — into deterministic, two-minute, fully-auditable swaps. That is the whole point: an architecture that does not break every time you add a user, because adding a user is no longer an act of archaeology — it is a recipe.

`;

const flow = `

## The Layered Permission Architecture

\`\`\`mermaid
flowchart TD
  BP[Thin Base Profile · Standard Sales User · License · Record Types · Page Layouts · Login Security ONLY]
  G1[PS_Object_OpportunityEdit]
  G2[PS_Object_AccountEdit]
  G3[PS_Object_LeadConvert]
  G4[PS_Tool_Gong]
  G5[PS_Tool_Outreach]
  G6[PS_App_CPQ]
  G7[PS_Feature_Forecasting]
  G8[PS_System_ExportReports]
  G9[PS_Object_LeadEdit]
  G10[PS_Object_AccountRead]
  BP --> STACK[Granular Building-Block Permission Sets · Small · Single-Purpose · Composable]
  STACK --> G1
  STACK --> G2
  STACK --> G3
  STACK --> G4
  STACK --> G5
  STACK --> G6
  STACK --> G7
  STACK --> G8
  STACK --> G9
  STACK --> G10
  G1 --> PSGAE[PSG_Persona_AE]
  G2 --> PSGAE
  G3 --> PSGAE
  G4 --> PSGAE
  G5 --> PSGAE
  G6 --> PSGAE
  G7 --> PSGAE
  G8 --> PSGAE
  G9 --> PSGSDR[PSG_Persona_SDR]
  G10 --> PSGSDR
  G4 --> PSGSDR
  G5 --> PSGSDR
  PSGAE --> MUTE[Optional Muting Set · PS_Mute_JuniorAE · Subtracts Delete + Export]
  MUTE --> PSGJR[PSG_Persona_AE_Junior]
  PSGAE --> USER[User · Base Profile + One Persona PSG = Fully Provisioned]
  PSGSDR --> USER
  PSGJR --> USER
  USER --> SEP[Record Access Is SEPARATE · OWD + Role Hierarchy + Sharing Rules · Orthogonal Layer]
\`\`\`

## New-Hire Provisioning: Layered Model vs The Broken Profile-Per-Role Model

\`\`\`mermaid
flowchart TD
  START[New Sales Hire OR SDR Promoted To AE]
  START --> GOOD[LAYERED MODEL PATH]
  START --> BAD[PROFILE-PER-ROLE PATH]
  GOOD --> GC[Create User]
  GC --> GP[Assign Standard Sales User Base Profile · No Decision]
  GP --> GPSG[Assign One Persona PSG · AE maps to PSG_Persona_AE]
  GPSG --> GR[Assign Role In Hierarchy For Record Rollup]
  GR --> GDONE[Fully Provisioned · Under 2 Minutes · Deterministic · Auditable]
  GDONE --> GPROMO[Promotion = Remove SDR PSG + Add AE PSG · One Swap · One Audit Record]
  BAD --> BC[Create User]
  BC --> BPICK[Open Profile Picklist · 15 Near-Identical Profiles]
  BPICK --> BGUESS[GUESS Which Profile Is Right OR Copy A Similar User]
  BGUESS --> BDRIFT[Inherit Whatever Drift + One-Off Grants That User Accumulated]
  BDRIFT --> BMISS[Discover Missing CPQ Or Field Access Weeks Later]
  BMISS --> BPATCH[One-Off Patch For This User Only · Next Hire Repeats The Problem]
  BPATCH --> BPROMO[Promotion = Change Profile · Risks Record Types + Layouts + Baseline · Not Auditable]
\`\`\`

`;

const src = `

## Sources

1. **Salesforce Help — Permission Sets** — Official documentation on permission sets as the additive, composable unit of permission assignment. https://help.salesforce.com/s/articleView?id=sf.perm_sets_overview.htm
2. **Salesforce Help — Permission Set Groups** — How PSGs bundle permission sets, the assignment model, and the calculation of net permissions. https://help.salesforce.com/s/articleView?id=sf.perm_set_groups.htm
3. **Salesforce Help — Mute a Permission in a Permission Set Group** — The muting permission set mechanism for subtracting permissions within a PSG. https://help.salesforce.com/s/articleView?id=sf.perm_set_groups_mute.htm
4. **Salesforce Help — The End of Profiles and the Future of Permissions** — Salesforce's published roadmap and guidance on moving permissions off profiles and onto permission sets.
5. **Salesforce Admins Blog — Migrate to the New Permissions Model** — Practical guidance from the official Salesforce Admins team on adopting the profiles-minimal model.
6. **Salesforce Help — Profiles** — What profiles control in the modern model: license, default record types, page layout assignments, login hours and IP ranges.
7. **Salesforce Trailhead — Data Security Module** — OWD, role hierarchy, and sharing rules as the record-access model, distinct from object/field permissions.
8. **Salesforce Help — Organization-Wide Sharing Defaults** — Setting OWD to Private and opening access upward through hierarchy and sharing rules. https://help.salesforce.com/s/articleView?id=sf.security_sharing_owd_about.htm
9. **Salesforce Help — Role Hierarchy** — How the role hierarchy drives record rollup to managers, separate from the permission model. https://help.salesforce.com/s/articleView?id=sf.admin_roles.htm
10. **Salesforce Help — Field-Level Security** — FLS as a capability control belonging in permission sets, distinct from record visibility.
11. **Salesforce Help — Permission Set Licenses** — How PSLs gate features like CPQ and are consumed by assigning the relevant permission set. https://help.salesforce.com/s/articleView?id=sf.users_permissionset_licenses.htm
12. **Salesforce Help — User Licenses** — Salesforce vs Platform vs Salesforce Integration user licenses and what each permits.
13. **Salesforce Help — Feature Licenses** — Legacy user-record feature toggles (Marketing User, Knowledge User, etc.).
14. **Salesforce Help — Permission Set and Permission Set Group Assignments with Expiration Dates** — Time-bound access assignment for contractors and temporary roles.
15. **Salesforce Help — Assign Permission Sets with Flows** — Record-triggered flow patterns for automating PermissionSetAssignment.
16. **Salesforce Help — Salesforce CPQ** — CPQ as a managed package gated behind a permission set license, requiring app-access and license-layer coordination.
17. **Salesforce Help — Enterprise Territory Management** — Rules-driven account assignment and territory-based record sharing, the scale alternative to role-hierarchy-only sharing.
18. **Salesforce Help — Delegated Administration** — Carving out scoped admin rights for ops teams, relevant at 100-plus-rep scale.
19. **Salesforce Help — Log In as Another User** — The admin verification mechanism for testing effective permissions after changes.
20. **Salesforce Help — View a User's Permission Details / Permission Set Group Calculation** — Previewing net effective permissions before assignment.
21. **Salesforce Help — Salesforce Integration User License** — Dedicated restrictive license type purpose-built for API integration accounts.
22. **Salesforce Help — SCIM and Identity-Based User Provisioning** — Driving user creation and permission assignment from an external identity provider. https://help.salesforce.com/s/articleView?id=sf.identity_scim_overview.htm
23. **Salesforce Security Center / Salesforce Shield** — Salesforce's native products for monitoring permission and configuration drift.
24. **AICPA SOC 2 Trust Services Criteria — Logical and Physical Access Controls** — The access-control criteria requiring least-privilege evidence and recurring access reviews. https://www.aicpa-cima.com
25. **Salesforce Well-Architected — Trusted: Secure** — Salesforce's official architecture guidance on least-privilege permission design.
26. **Salto — Salesforce Configuration as Code** — Third-party platform treating Salesforce permission metadata as version-controlled, reviewable change. https://www.salto.io
27. **Elements.cloud — Salesforce Documentation and Impact Analysis** — Third-party tool for permission documentation and dependency analysis. https://elements.cloud
28. **Metazoa Snapshot — Salesforce Org Management** — Third-party org-analysis and permission-cleanup tooling. https://www.metazoa.com
29. **Sonar — Salesforce Change Intelligence** — Third-party permission-visibility and change-impact platform. https://www.sonarsoftware.com
30. **Salesforce Ben — Permission Set Groups Best Practices** — Widely-referenced community guidance on persona-based PSG design and naming conventions. https://www.salesforceben.com
31. **Salesforce Trailhead — Permission Set Groups Module** — Hands-on guidance for building and muting permission set groups.
32. **Salesforce Help — Object Permissions** — Object-level CRUD as a permission-set capability, the building block of object-access sets.
33. **Salesforce Help — System Permissions** — Org-wide system permissions (export reports, API enabled, bulk API) as discrete grants auditors scrutinize.
34. **Salesforce Help — Connected Apps and Permission Sets** — Granting connected-app access (Gong, Outreach, etc.) through dedicated permission sets.
35. **Salesforce Release Notes — Permissions and Profile Updates** — Ongoing release-by-release changes moving permissions off profiles.
36. **Okta and Microsoft Entra ID — Salesforce Provisioning Integrations** — IdP-side SCIM provisioning that drives Salesforce user creation and group-to-PSG mapping.
37. **Salesforce Help — Muting Permission Set Limitations** — The scope and constraints of what muting sets can and cannot subtract.
38. **Salesforce Admins Podcast — Permissions Architecture Episodes** — Official Salesforce Admins program guidance on persona-based permission design at scale.
39. **ISO/IEC 27001 — Access Control (Annex A.9)** — The access-control control family requiring documented least-privilege provisioning and review.
40. **Salesforce Help — Sandbox Types and Testing** — Full and partial-copy sandboxes for testing permission changes before production deployment.

`;

const num = `

## Numbers

**Architecture Inventory For A 30-Rep Org**
- Base profiles: 1-2 (target 1, never more than 3-4)
- Persona PSGs: ~5 (AE, SDR, Sales Manager, Sales Ops, Deal Desk)
- Granular building-block permission sets: 15-30
- Muting permission sets: 1-3 (sub-personas only, e.g. Junior AE)
- Role hierarchy depth: 3-4 levels
- Integration / API users: 3-8 typical, each with its own dedicated minimal set
- Total architecture documentation: ~1 page

**The Anti-Pattern It Replaces**
- Typical profile-per-role count in a drifted 30-rep org: 10-18 profiles
- Real distinct personas hiding inside those profiles: ~5
- "Identical" profiles that have actually drifted apart: nearly all of them
- Profiles needed in the layered model: 1-2

**Onboarding & Promotion Metrics**
- New-hire provisioning time, layered model: under 2 minutes
- New-hire provisioning time, profile-per-role model: 15-45 minutes plus weeks of follow-up patches
- Decisions required to provision a new hire, layered model: 1 (which persona)
- Decisions required, profile-per-role model: 1 guess among 10-18 options
- SDR-to-AE promotion, layered model: 1 PSG swap, 1 audit record
- SDR-to-AE promotion, profile-per-role model: 1 profile change affecting record types + layouts + baseline, not cleanly auditable
- Steps in the documented onboarding runbook: ~5

**Role Hierarchy Structure (Canonical 30-Rep)**
- Level 1 — CRO / VP Sales: 1 person
- Level 2 — Sales Directors: 1-2
- Level 3 — Sales Managers: 3-5 (each over 5-8 reps)
- Level 4 — Reps (AEs + SDRs): ~24-28
- Sales Ops / Deal Desk: off to the side, broad access via sharing rules

**Permission Set Naming Convention Prefixes**
- PSG_Persona_<Role> — persona permission set groups
- PS_Object_<Object><Access> — object + FLS sets
- PS_Tool_<Tool> — connected-app / integration tool sets
- PS_App_<App> — app + managed-package access sets
- PS_Feature_<Feature> — feature-gated capability sets
- PS_System_<Permission> — org-wide system-permission sets
- PS_Mute_<Context> — muting sets
- PS_Integration_<System> — dedicated integration-user sets

**Record Access Model (Orthogonal Layer)**
- Org-wide default for Opportunity / Account: Private (recommended)
- Org-wide default for Lead: Private (common)
- Access mechanisms: OWD baseline + role hierarchy (vertical) + sharing rules (horizontal/exception)
- Permission sets' role in record access: zero — they control capability, not visibility

**Hygiene Review Cadence**
- Frequency: quarterly
- Time cost for a 30-rep org: ~2-4 hours per quarter
- Checklist items: orphaned sets, orphaned PSGs, over-provisioned users, permission-set debt, license consumption, access-review report
- Healthy ratio of access-from-PSG vs direct standalone assignment: nearly all from PSG; every direct assignment is a documented exception
- Doubles as: SOC 2 / ISO 27001 access-review evidence at zero extra cost

**Scaling Thresholds**
- 30 reps: ~5 PSGs, 15-30 granular sets, manual or simple-flow assignment, native Setup sufficient
- ~100 reps: personas subdivide (Enterprise AE / SMB AE), automated assignment non-optional, role hierarchy gains a level
- ~300 reps: territory management likely justified, delegated administration, SCIM/SSO-driven provisioning standard, formal change management
- What changes structurally across all three: nothing — the model extends, never re-architects

**Licensing Layer Gotchas**
- License types that matter: user licenses (on profile), permission set licenses (consumed by assignment), feature licenses (legacy toggles)
- Most common "permission set does nothing" cause: missing or exhausted permission set license, not a permission-set bug
- CPQ: gated behind a permission set license — track seat count in quarterly review
- Salesforce Integration license: restrictive, purpose-built for API integration users

**Migration From Legacy (Profile-Heavy → Layered)**
- Realistic effort for a 30-rep org: a few weeks of part-time work, mostly testing
- Approach: persona by persona, never big-bang
- Lowest-risk first persona: usually SDRs (fewest integrations)
- User-facing disruption when done incrementally: none
- Steps: inventory → design target in sandbox → build sandbox → migrate persona by persona → collapse + deprecate profiles → validate with access-review diffs + "login as"

**Testing Discipline**
- Sandbox-first: every structural change
- Primary verification tool: "Log in as" for each affected persona
- Secondary: permission-set-group net-permission preview before assignment
- Debug rule: change one layer at a time (granular set OR PSG OR hierarchy)
- Final check: diff the access-review report before vs after — diff should show only the intended change

**5-Year Outlook Markers**
- Profile permissions: on Salesforce's roadmap to be removed entirely
- Profiles' eventual role: pure shell — license + record types + layouts + login security only
- Primary management unit of the post-profile world: the permission set group
- AI permission tooling: will semi-automate the hygiene review — but only on a clean, named, layered architecture
- Identity-driven (SCIM/SSO) provisioning: moving from large-org practice to standard practice even at 30-50 reps

`;

const counter = `

## Counter-Case: When The "Pure" Permission-Set Architecture Is Over-Engineering

The layered model is the right answer for the large majority of 30-rep B2B sales orgs — but a thoughtful admin should know the conditions under which building it is genuinely the wrong move, or at least premature.

**Counter 1 — The genuinely tiny, genuinely simple org where two profiles really do suffice.** If you have 8 reps, two personas (AE and SDR), one product, no CPQ, three integrations, and a hiring rate of one person a quarter, then two well-built profiles plus a couple of permission sets for the exceptions is *not* a sin — it is appropriately sized. The full persona-PSG-with-granular-building-blocks model has real setup and cognitive cost, and at true small scale that cost can exceed the pain it prevents. The model earns its keep when you have *enough personas times enough hiring velocity* that the profile approach visibly breaks — and a tiny, slow-growing org may simply never hit that threshold. Build for the org you have plus 18 months, not the org you fantasize about.

**Counter 2 — No admin to maintain it, so it rots anyway.** The layered model is *self-documenting* but it is not *self-maintaining*. It assumes someone runs the quarterly hygiene review, owns the naming convention, updates the one-page doc, and resists the temptation to make one-off direct assignments during incidents. If your org has no dedicated admin — if Salesforce is "owned" by a sales ops person who touches it four hours a month, or by a founder, or by a rotating cast — then a beautifully-designed layered architecture will drift into a *different* kind of mess within a year: orphaned sets, undocumented PSG bloat, direct assignments everywhere. A mess you cannot maintain is not better than a simple thing you can. Sometimes the honest answer is "two profiles, because that is what this org can actually keep clean."

**Counter 3 — When the migration cost outweighs the breakage being solved.** If you have a legacy 12-profile org but it is *stable* — the same five people have been admins for years, everyone knows the profiles' quirks, hiring is slow, and nothing is actually *breaking* — then the migration is solving a theoretical problem at a real cost. Migration is a few weeks of work plus ongoing change to how everyone operates. If the profile mess is *ugly* but not *painful*, "ugly but working" can be the rational choice, at least until a forcing function (rapid hiring, an acquisition, a Salesforce deprecation deadline, an audit) makes the breakage real. Do not migrate for aesthetic reasons; migrate when the breakage has a cost you can name.

**Counter 4 — When the real problem is no documentation, not wrong structure.** This is the most important counter-case, because it is the most common misdiagnosis. Plenty of orgs with "profile sprawl" do not actually have a *structural* problem — they have a *documentation* problem. If your fifteen profiles each map cleanly to a real role, are not badly drifted, and "work" — and the only actual pain is that *nobody wrote down what they do* — then the cheap, correct fix is to **document them**, not to re-architect them. Write the one-page doc for the profiles you have. You may find that 80% of the pain evaporates for 5% of the effort. The layered model is the right answer when the *structure* is wrong (profiles do not compose, drift is rampant, every change is fifteen edits); it is the wrong answer when the structure is fine and only the *knowledge* is missing. Diagnose which problem you actually have before you reach for the bigger hammer.

**Counter 5 — When you are about to be re-platformed or acquired.** If there is a serious chance your Salesforce org will be consolidated into an acquirer's org, or your company is mid-evaluation of a different CRM, then investing weeks in a permission re-architecture may be throwaway work. Stabilize, document, and wait for the strategic picture to clarify.

**Counter 6 — Over-applying the granular principle into absurd fragmentation.** Even within the layered model there is an over-engineering failure: splitting permission sets so granular that you have 120 micro-sets for a 30-rep org and assembling a PSG becomes its own archaeology project. The "single-purpose" principle has a sensible floor — a set should do *one nameable thing a human would actually request*, not *one permission*. If your granular-set inventory for 30 reps is past ~30-40 sets, you have over-fragmented; the cure for profile sprawl is not permission-set sprawl.

**The honest verdict.** The layered persona-PSG architecture is correct for the typical 30-rep B2B sales org with multiple personas, real hiring velocity, a tool stack, growth ahead, and at least a part-time-serious admin — and it is *especially* correct given Salesforce is deprecating profile permissions anyway, so the migration is coming whether you choose it or not. But it is genuinely the wrong call for the truly tiny and simple, for the org with nobody to maintain it, for the stable-and-not-actually-breaking legacy org, for the org whose real disease is missing documentation rather than wrong structure, and for the org about to be re-platformed. The skill is not "always build the layered model" — it is *correctly diagnosing whether you have a structure problem or a documentation problem*, and sizing the solution to the org you actually have. Most 30-rep orgs do have the structure problem. Make sure yours is one of them before you spend the weeks.

`;

const links = `

## Related Pulse Library Entries

- **q9501** — Benchmark q9501 (RevOps systems baseline). (Foundational RevOps tooling context for the Salesforce admin function.)
- **q9502** — Benchmark q9502 (RevOps systems baseline). (Companion benchmark entry on revenue-systems architecture decisions.)
- **q1899** — What replaces SDR teams if AI agents replace SDRs natively? (The SDR persona referenced throughout this entry is itself under structural pressure.)
- **q9512** — How do you structure a sales territory model that does not need re-cutting every quarter? (Territory management as the record-access scaling layer referenced here.)
- **q9513** — What is the right Salesforce role hierarchy design for a scaling sales org? (Deep dive on the role hierarchy layer that is orthogonal to permission sets.)
- **q9514** — How do you run a SOC 2 audit as a RevOps team? (The access-review and least-privilege evidence this architecture produces as a byproduct.)
- **q9515** — How do you design org-wide sharing defaults and sharing rules in Salesforce? (The record-access model that must stay separate from the permission model.)
- **q9520** — How do you onboard a new sales rep so they are productive in week one? (The provisioning flow this entry makes deterministic is one input to rep onboarding.)
- **q9521** — How do you manage a Salesforce CPQ rollout without breaking the org? (Scenario 4's CPQ rollout, expanded — including the permission set license layer.)
- **q9525** — How do you clean up a messy legacy Salesforce org? (The migration-from-profile-heavy playbook, generalized beyond permissions.)
- **q9530** — What is the right RevOps tech stack for a 30-rep B2B sales team? (The tool layer — Gong, Outreach, Clari — that the PS_Tool_* sets gate.)
- **q9531** — How do you choose between native Salesforce and third-party admin tooling? (Sonar, Salto, Elements.cloud, Metazoa — when permission-management tooling is worth buying.)
- **q9535** — How do you automate user provisioning with SCIM and SSO? (The identity-driven assignment endgame referenced in the automation and outlook sections.)
- **q9540** — How do you handle the SDR-to-AE promotion path operationally? (The promotion case in this entry's question, from the people-ops and comp side.)
- **q9545** — What does delegated administration look like in a scaling Salesforce org? (The 100-to-300-rep scaling addition referenced in the scaling section.)
- **q9550** — How do you run a quarterly RevOps systems hygiene review? (The hygiene cadence generalized across the whole revenue tech stack.)
- **q9560** — How is AI changing the Salesforce admin role by 2030? (AI-assisted permission management, expanded — the 5-year outlook for the admin function.)
- **q9570** — How do you manage integration and API users securely in Salesforce? (The dedicated integration-user pattern, deep dive.)
- **q9580** — What is permission set debt and how do you pay it down? (The "permission set debt" concept from the hygiene section, as its own entry.)
- **q9590** — How do you document a Salesforce org so it survives admin turnover? (The one-page architecture doc and naming convention, generalized.)

`;

const tags = ['salesforce','revops','permission-sets','salesforce-admin','sales-ops','permission-set-groups','access-management','soc2','b2b-sales','crm-architecture'];

const sources = [
  { title: 'Salesforce Help — Permission Set Groups', url: 'https://help.salesforce.com/s/articleView?id=sf.perm_set_groups.htm' },
  { title: 'Salesforce Help — Mute a Permission in a Permission Set Group', url: 'https://help.salesforce.com/s/articleView?id=sf.perm_set_groups_mute.htm' },
  { title: 'Salesforce Help — Organization-Wide Sharing Defaults', url: 'https://help.salesforce.com/s/articleView?id=sf.security_sharing_owd_about.htm' }
];

const notes = {
  s6: 'Added 40 cited sources: Salesforce official documentation (permission sets, permission set groups, muting sets, profiles, the end-of-profiles roadmap, OWD, role hierarchy, FLS, permission set licenses, user licenses, feature licenses, time-bound assignment, flow-based assignment, CPQ, territory management, delegated admin, login-as, SCIM provisioning, Security Center/Shield, integration user license, sandbox testing), Salesforce Admins blog and podcast, Salesforce Well-Architected, Trailhead modules, compliance frameworks (AICPA SOC 2 Trust Services Criteria, ISO/IEC 27001 Annex A.9), third-party permission-management tooling (Salto, Elements.cloud, Metazoa, Sonar), Salesforce Ben community guidance, and IdP provisioning integrations (Okta, Microsoft Entra ID).',
  s7: 'Added comprehensive numerical analysis: architecture inventory for a 30-rep org (1-2 base profiles, ~5 persona PSGs, 15-30 granular sets, 1-3 muting sets, 3-4 role hierarchy levels), the anti-pattern it replaces (10-18 drifted profiles collapsing to ~5 real personas), onboarding and promotion metrics (under 2 minutes vs 15-45 minutes, 1 decision vs 1 guess among 10-18), canonical 30-rep role hierarchy structure, the full naming convention prefix set, the orthogonal record-access model, quarterly hygiene cadence and cost, scaling thresholds at 30/100/300 reps, licensing-layer gotchas, migration effort and approach, testing discipline, and 5-year outlook markers.',
  s8: 'Added 6-element counter-case on when the layered architecture is over-engineering: the genuinely tiny and simple org where two profiles suffice, the org with no admin to maintain the model so it rots anyway, the stable legacy org where migration cost outweighs the breakage being solved, the critical misdiagnosis where the real problem is missing documentation rather than wrong structure, the org about to be re-platformed or acquired, and over-applying the granular principle into absurd permission-set fragmentation — plus an honest verdict framing the core skill as correctly diagnosing structure-problem vs documentation-problem.',
  s9: 'Cross-linked 19 related Pulse entries: RevOps benchmark entries (q9501/q9502), the SDR-disruption entry (q1899), and the q951x-q959x cluster covering territory modeling, role hierarchy design, SOC 2 audits, sharing rules, rep onboarding, CPQ rollout, legacy org cleanup, RevOps tech stack, admin tooling selection, SCIM/SSO provisioning, the SDR-to-AE promotion path, delegated administration, hygiene reviews, the AI-driven future of the admin role, integration user security, permission set debt, and org documentation.',
  s10: 'SUBAGENT_VERIFIED. Comprehensive deep-rewrite of Salesforce permission set architecture for a 30-rep B2B sales org. Two mermaid diagrams (the layered permission architecture from thin base profile through granular building-block sets through persona PSGs and muting sets to the user with record-access shown as a separate orthogonal layer; and the new-hire/promotion provisioning flow contrasting the deterministic layered path against the broken profile-per-role guessing-game path). Full coverage: the core "profiles minimal, permissions in sets" principle and Salesforce profile-permission deprecation roadmap, the profile-per-role anti-pattern autopsy, the recommended 1-2 thin base profiles, permission sets vs permission set groups and the muting feature, the five persona PSGs (AE/SDR/Sales Manager/Sales Ops/Deal Desk), the granular building-block set taxonomy (PS_Object_/PS_Tool_/PS_App_/PS_Feature_/PS_System_), object and field-level security strategy, the orthogonal record-access model (OWD + role hierarchy + sharing rules), the clean 3-4 level role hierarchy, muting permission sets for sub-personas, the deterministic two-minute new-hire onboarding flow, permission set licenses vs feature licenses, automating assignment via flow and SCIM/SSO, the naming convention and one-page documentation standard, quarterly auditing and permission-set-debt hygiene, the persona-by-persona migration playbook from a profile-heavy legacy org, common breakage patterns and their structural fixes, the dedicated integration/API user pattern, safe testing with sandboxes and login-as, scaling from 30 to 100 to 300 reps, native vs third-party tooling, the SOC 2 / ISO 27001 compliance angle, five real-world scenarios, a persona-first decision framework, the 5-year outlook on profile deprecation and AI-assisted permission management, a final framework summary, and a 6-element over-engineering counter-case.'
};

runPolish({ id: 'q9511', tldr, core, flow, src, num, counter, links, sources, tags, notes }).catch(e => { console.error(e); process.exit(1); });
