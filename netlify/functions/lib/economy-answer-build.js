// Question-specific economy answers — shared skeleton, unique body per question.

const { FBS, FCS } = require('./economy-nil-d1-schools');

const FBS_SET = new Set(FBS.map((s) => s.toLowerCase()));
const FCS_SET = new Set(FCS.map((s) => s.toLowerCase()));

const POWER4 = new Set(
  [
    'Alabama', 'Auburn', 'Florida', 'Georgia', 'Kentucky', 'LSU', 'Mississippi State', 'Missouri',
    'Oklahoma', 'Ole Miss', 'South Carolina', 'Tennessee', 'Texas', 'Texas A&M', 'Arkansas', 'Vanderbilt',
    'Ohio State', 'Michigan', 'Penn State', 'Wisconsin', 'Iowa', 'Minnesota', 'Nebraska', 'Northwestern',
    'Illinois', 'Indiana', 'Purdue', 'Rutgers', 'Maryland', 'UCLA', 'USC', 'Washington', 'Oregon',
    'Clemson', 'Florida State', 'Miami', 'NC State', 'North Carolina', 'Virginia Tech', 'Virginia', 'Louisville',
    'Pittsburgh', 'Syracuse', 'Boston College', 'Georgia Tech', 'Duke', 'Wake Forest', 'SMU', 'Stanford', 'Cal',
    'Texas Tech', 'Baylor', 'TCU', 'Kansas State', 'Kansas', 'Oklahoma State', 'West Virginia', 'UCF', 'BYU',
    'Colorado', 'Utah', 'Arizona', 'Arizona State', 'Cincinnati', 'Houston', 'Iowa State',
  ].map((s) => s.toLowerCase())
);

function hashSeed(str) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick(seed, arr) {
  return arr[seed % arr.length];
}

function parseSchool(question) {
  const q = String(question || '');
  let m = q.match(/\bfor\s+(.+?)\s+(?:D1|d1)\s+college football/i);
  if (m) return m[1].trim();
  m = q.match(/\bat\s+(.+?)\s+football\b/i);
  if (m) return m[1].trim();
  m = q.match(/\bfor\s+(.+?)\s+football\b/i);
  if (m) return m[1].trim();
  return null;
}

function schoolMeta(school) {
  const name = school || 'the program';
  const key = name.toLowerCase();
  const isFbs = FBS_SET.has(key);
  const isFcs = FCS_SET.has(key);
  const tier = POWER4.has(key) ? 'power4' : isFbs ? 'g5' : isFcs ? 'fcs' : 'd1';
  const seed = hashSeed(name);
  const budgets = {
    power4: ['$18M–$28M', '$22M–$35M', '$15M–$24M'],
    g5: ['$2.5M–$6M', '$4M–$8M', '$1.8M–$4.5M'],
    fcs: ['$350K–$1.2M', '$500K–$1.5M', '$250K–$900K'],
    d1: ['$1M–$5M', '$2M–$8M'],
  };
  return {
    name,
    tier,
    subdivision: isFbs ? 'FBS' : isFcs ? 'FCS' : 'D1',
    budgetBand: pick(seed, budgets[tier] || budgets.d1),
    seed,
  };
}

function parseRevOps(question) {
  const q = question.toLowerCase();
  const crmMatch = q.match(/\b(salesforce|hubspot|dynamics 365|pipedrive|zoho)\b/);
  const crm = crmMatch ? crmMatch[1].replace(/\s+/g, ' ') : 'your CRM';
  const motions = [
    'PLG-to-sales handoff', 'enterprise outbound', 'channel co-sell', 'usage-based pricing',
    'inbound SDR', 'outbound SDR', 'AE-led pods', 'renewal and expansion', 'services-led sales',
  ];
  let motion = '';
  for (const m of motions) {
    if (q.includes(m.toLowerCase())) { motion = m; break; }
  }
  const problems = [
    ['duplicate contacts', /duplicate contacts?/],
    ['forecast sandbagging', /sandbagging|forecast sandbag/],
    ['pricing exception chaos', /pricing exception/],
    ['SPIF payouts conflicting with clawbacks', /spif|clawback/],
    ['missing economic buyer fields', /economic buyer/],
    ['UTM loss across subdomains', /utm loss|utm/],
    ['broken lead routing', /lead routing|routing/],
    ['commission disputes', /commission/],
    ['stage inflation', /stage inflation|stage hygiene/],
    ['MQL decay', /mql/],
    ['pipeline coverage gaps', /pipeline coverage/],
    ['partner deal registration conflicts', /partner deal|channel/],
    ['renewal risk not in CRM', /renewal/],
    ['mutual action plans ignored', /mutual action|map/],
  ];
  let problem = 'the workflow gap named in your question';
  for (const [label, re] of problems) {
    if (re.test(q)) { problem = label; break; }
  }
  const constraints = [
    'no dedicated RevOps hire yet', 'post-merger CRM merge', 'Series B board reporting',
    'finance on NetSuite', 'data warehouse in Snowflake', 'strict IT security review blocks integrations',
  ];
  let constraint = '';
  for (const c of constraints) {
    if (q.includes(c)) { constraint = c; break; }
  }
  const qType = /^why\b/.test(q) ? 'why' : /^what\b/.test(q) ? 'what' : /^how\b/.test(q) ? 'how' : 'how';
  return { crm, motion, problem, constraint, qType, seed: hashSeed(question) };
}

function expandSteps(steps) {
  return steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
}

function buildNilAnswer(question) {
  const school = parseSchool(question) || 'this program';
  const meta = schoolMeta(school);
  const { name, tier, subdivision, budgetBand, seed } = meta;
  const rivals = pick(seed, [
    'in-conference rivals and the next portal class',
    'regional brands that outbid you on social reach',
    'programs one tier up that poach your starters',
  ]);
  const collectiveLabel = tier === 'power4' ? 'the primary collective + alumni venture partners' : 'the collective + foundation-aligned donor club';
  const portalFocus =
    tier === 'power4'
      ? 'December 2026 multi-window retention and spring 2027 plug-and-play targets at premium positions'
      : tier === 'g5'
        ? 'spring 2027 portal fills at OL/LB depth and December retention of top-three producers'
        : 'spring 2027 regional portal adds and keeping captains off the transfer board';

  const direct =
    tier === 'power4'
      ? `**${name}** needs a 2027 NIL GTM plan that treats collectives like a revenue team: capped offer tiers, a donor pipeline with weekly commits, and portal dates owned on one scorecard—not booster dinners that never close. At ${subdivision} scale (${budgetBand} realistic annual deploy), the win is **retention of difference-makers** before ${rivals} reset your depth chart.`
      : tier === 'g5'
        ? `**${name}** (${subdivision}) wins 2027 NIL GTM by concentrating dollars on **eight to twelve roster nodes** that drive wins and local brand, not spreading micro-deals across the roster. With ${budgetBand} in play, GTM is donor sequencing + portal timing—not more group chats.`
        : `**${name}** (${subdivision}) must run NIL GTM like a small-market SaaS launch: one ICP (local businesses + alumni operators), one offer ladder, and brutal focus on ${portalFocus}. Budget reality (${budgetBand}) means you cannot out-spend—you out-process.`;

  const steps = [
    `Publish a 2027 roster grid for ${name}: every scholarship player tagged Keep / Compete / Replace with a max NIL band`,
    `Stand up offer tiers (Tier A game-changers, Tier B rotation, Tier C equity) with written NCAA + state disclosure triggers before any public post`,
    `Build ${collectiveLabel} pipeline stages: Identified → Cultivated → Committed $ → Contracted → Disclosed`,
    `Assign portal owners by position group with offer caps 21 days before each window; no coach DMs without logged tier`,
    `Run weekly ${name} NIL standup: dollars committed vs plan, portal risk list, compliance exceptions`,
    `Ship a monthly board scorecard: $ raised, % roster with active deals, portal net, cost per retained starter`,
  ];
  const offerTable = `| Tier | Who (example at ${name}) | 2027 band | Disclosure |
|------|---------------------------|-----------|------------|
| A | Starting QB / edge rushers | Top of ${budgetBand} | Pre-announcement filing |
| B | Starters on third down | Mid band | 48h before social |
| C | Special teams + depth with local brand | Micro + merch | Batch weekly |`;

  const calendar = `| Window | ${name} GTM focus |
|--------|------------------|
| Jan–May 2026 | Retention commits for captains; quiet donor cultivation |
| Aug–Nov 2026 | Recruit parent education; no public $ promises |
| Dec 2026 portal | Execute Replace list only if Tier A backup signed |
| Jan–Apr 2027 | Spring portal: fill planned gaps, not panic offers |
| Jul 2027 | Pre-camp equity refresh for keepers |`;

  const mermaid = `\`\`\`mermaid
flowchart TD
  A["${name} roster tiers"] --> B["Offer ladder"]
  B --> C["Donor pipeline"]
  C --> D["Collective GTM"]
  D --> E["Portal execution"]
  E --> F["Monthly scorecard"]
\`\`\``;

  const mistakes = [
    `Announcing a ${budgetBand} goal at ${name} without naming which positions get Tier A dollars`,
    'Letting boosters negotiate in parking lots—no tier, no disclosure, no log',
    `Entering ${portalFocus} without a capped offer sheet per target`,
    'Handing marketplace apps the donor relationship with no internal pipeline stage',
  ];

  return `## Direct Answer

${direct}

## Why this matters in 2027

NIL at **${name}** is no longer novelty—it is how you protect wins. Collectives that run GTM with stages and caps beat programs that treat every deal as a one-off. ${tier === 'power4' ? 'Power brokers and portal economics mean you lose starters to organized rivals, not random offers.' : tier === 'g5' ? 'Group-of-Five programs lose margin by funding the long tail of roster instead of win-drivers.' : 'FCS programs lose when captains shop portal offers with no counter-tier ready.'}

## What to do — ${name}

${expandSteps(steps)}

Log every offer in one tracker row (athlete, tier, $, disclosure ID) before any public post.

## Offer ladder (program-specific)

${offerTable}

## Portal & fundraising calendar

${calendar}

## Donor pipeline (use one tracker)

| Stage | Definition | Exit |
|-------|------------|------|
| Identified | Business or donor tied to a position need | Champion contact named |
| Cultivated | Pitch deck + compliance packet sent | Verbal $ range |
| Committed | Soft circle amount for a tier | Contract draft |
| Contracted | Signed + athlete mapped | Disclosure filed |
| Disclosed | Public activation allowed | Logged in scorecard |

## Metrics — ${name} monthly

- **$ committed vs plan** (collective + foundation)
- **% scholarship roster with active, disclosed deal**
- **Portal net** (starters in minus starters out)
- **Cost per retained starter** in Tier A/B
- **Compliance exceptions open** (target zero before camp)

${mermaid}

## What good looks like at ${name}

- Every Tier A athlete has a logged offer sheet before social posts
- Coaches reference the same pipeline stages as the collective GM
- Portal entries are position-owned with pre-approved caps
- Donors hear one ${name} narrative—not mixed messages from staff vs collective

## Common mistakes

${mistakes.map((m) => `- ${m}`).join('\n')}

## Staff roles — who owns what at ${name}

| Role | Owns | Weekly deliverable |
|------|------|-------------------|
| AD / sport admin | Policy, NCAA liaison, coach alignment | Signed tier caps + portal authorization list |
| Collective GM | Donor pipeline, offer sheets, disclosures | Pipeline stage report + $ committed vs plan |
| Compliance | Contract review, disclosure IDs, marketplace rules | Exception log (target zero open items) |
| Football ops / recruiting | Roster tier map, portal targets | Updated tier sheet before any public post |
| Marketing / creative | Asset approval, brand guardrails | Calendar tied to disclosed deals only |

No booster, parent, or agent updates the CRM tracker without compliance copy-paste into the same row.

## Weekly operating rhythm (${name})

- **Monday:** Collective GM reviews donor stages; football ops confirms tier changes from film/medical.
- **Wednesday:** Compliance spot-checks three random disclosures against offer sheets.
- **Friday:** Scorecard published internally—$ committed, % roster disclosed, portal net, open exceptions.
- **Monthly:** AD + collective chairs cut any initiative that did not move retention or planned portal adds.

## Compliance & disclosure checklist

- Offer sheet signed before social posts or public appearances
- Disclosure ID logged the same day the deal becomes active
- Marketplace listings approved by compliance—not auto-published
- Booster contact logged when cultivation moves past verbal range
- Portal entries matched to pre-approved caps and position owner

## Marketplace vs collective coordination

Run **one internal pipeline** even if athletes use third-party apps. ${collectiveLabel} owns the relationship; marketplaces execute transactions after compliance approval. Coaches receive **tier summaries only**—not donor names or dollar amounts—to avoid NCAA indirect inducement issues.

## Recruiting & retention talking points (internal only)

- Parents hear **process and compliance** before dollar ranges; never promise tier placement without compliance sign-off.
- Transfer portal lists are **position-owned** with backup offers signed before public interest.
- ${rivals} will benchmark your public deals—internal scorecard matters more than press releases.
- Film, academics, and injury status feed tier reviews monthly—not only after losses.

## Budget guardrails (${budgetBand})

Allocate **60–70%** of planned spend to Tier A/B win-drivers; cap long-tail stipends that do not change outcomes. Hold **10–15%** discretionary for in-season portal needs. Freeze new donor promises in the final four weeks before signing day unless tied to a retention risk you already modeled. Document every exception in the same tracker row compliance uses for disclosures. Review the scorecard with the head coach monthly so on-field priorities stay aligned with spend.

## Bottom line

**${name}** wins 2027 NIL GTM with a **roster-first offer ladder**, a **logged donor pipeline**, and **portal discipline**—not more announcements. Run the scorecard monthly; cut anything that does not move retention or planned portal adds.`;
}

function buildRevOpsAnswer(question) {
  const p = parseRevOps(question);
  const { crm, motion, problem, constraint, qType, seed } = p;
  const motionPhrase = motion ? ` during **${motion}**` : '';
  const constraintPhrase = constraint ? ` while **${constraint}**` : '';

  let direct;
  if (qType === 'why') {
    direct = `Vendors and agencies usually mishandle **${problem}** on **${crm}**${motionPhrase} because they sell automation before anyone defines **who owns the field, the exception path, and the inspection report**. The failure is not "${crm} can't do it"—it's that nobody made non-compliance visible before forecast week.`;
  } else if (qType === 'what') {
    direct = `The workable playbook for **${problem}** on **${crm}**${motionPhrase}${constraintPhrase} is: **one owner**, **three to five enforced fields or validation rules**, and a **weekly inspection view** managers actually open. Tools matter after the rules are written—not before.`;
  } else {
    direct = `Start by fixing **${problem}** on **${crm}**${motionPhrase}${constraintPhrase} on **one pod or segment** for two weeks. Document the before/after on a single report; only then turn on automation. Most teams automate a broken manual process and wonder why ${problem} persists.`;
  }

  const crmSpecific =
    crm === 'Salesforce'
      ? {
          fields: 'Account/contact duplicate rules, Matching Rules job, Opportunity Contact Role completeness, Campaign Member hygiene',
          fix: 'Turn on duplicate blocking (not just alert), run weekly Duplicate Record Sets review, and block stage advance when primary contact role is missing on Commit opps',
        }
      : crm === 'HubSpot'
        ? {
            fields: 'Contact merge queue, deal stage required properties, workflow enrollment caps, marketing email suppression lists',
            fix: 'Use workflows for routing with explicit “reason assigned” property; suppress closed-lost contacts from sequences within 15 minutes',
          }
        : crm === 'Dynamics 365'
          ? {
              fields: 'Duplicate detection rules, opportunity BPF required steps, connection roles on accounts',
              fix: 'Pair BPF stage gates with required fields for buyer evidence; audit connection roles on enterprise deals weekly',
            }
          : {
              fields: 'Core object required fields, ownership, stage definitions, activity logging',
              fix: 'Pick three required proofs per stage and enforce with validation before save',
            };

  const steps = [
    `Name an owner for **${problem}**; publish a one-page definition of done tied to ${crm} objects`,
    `Baseline the pain: export 30 recent records where **${problem}** showed up in forecast or handoffs`,
    `Configure ${crmSpecific.fields}`,
    `Pilot on one segment${motion ? ` (${motion})` : ''} for 10 business days—no company-wide rollout`,
    `Run manager inspection weekly using one saved report; downgrade or fix records that fail the definition`,
    `Only after fill rate beats 80% on required fields, add automation (routing, alerts, or sync)`,
  ];
  const mermaid = `\`\`\`mermaid
flowchart LR
  A["Define problem"] --> B["${crm} fields"]
  B --> C["Pilot segment"]
  C --> D["Weekly inspection"]
  D --> E["Automation last"]
\`\`\``;

  const metrics = pick(seed, [
    `% opportunities with required evidence fields populated`,
    `Duplicate or routing error queue depth week over week`,
    `Forecast category accuracy vs actuals for the pilot pod`,
    `Lead/opportunity conversion from stage 1 to stage 2 in pilot`,
  ]);

  return `## Direct Answer

${direct}

## Context — tied to your question

You asked about **${problem}**${motionPhrase} on **${crm}**${constraintPhrase}. Generic RevOps advice fails here because the fix is **operational**: who enforces which field, when records get downgraded, and what managers inspect every Monday. ${crmSpecific.fix}

## What to do

${expandSteps(steps)}

## ${crm} configuration focus

- **Objects to touch:** ${crmSpecific.fields}
- **Enforcement:** validation on save beats post-hoc cleanup for **${problem}**
- **Inspection:** one saved report filtered to pilot segment; same view every week

## Metrics (pick one primary)

- **Primary:** ${metrics}
- **Hygiene:** % pilot records passing all required fields
- **Failure signal:** same exception recurring after two inspection cycles

${mermaid}

## What good looks like

- Managers can open one report and see which deals fail **${problem}** standards
- Reps know which fields block saves—no surprise at commit time
- Automation is off until manual discipline holds for two weeks
- ${motion ? `${motion} handoffs use the same definitions as the rest of the org` : 'Handoffs use the same field definitions across teams'}

## Common mistakes

- Buying another point solution before ${crm} rules exist
- Optional fields for **${problem}**—reps skip them under quarter pressure
- Company-wide rollout before the pilot segment proves fill rate
- Inspection meetings that read narratives instead of opening ${crm} records

## Manager inspection script (15 minutes)

Open the pilot saved report in ${crm}. Sort by exception flag. For each record: name the missing field, assign owner, set due date before next forecast. No narrative readouts—only record fixes. Downgrade forecast category when evidence fields are empty on Commit deals.

## Rollout phases

| Phase | Duration | Scope | Exit criteria |
|-------|----------|-------|---------------|
| Baseline | Week 1 | Export 30 failure examples | Written definition of done for **${problem}** |
| Pilot | Weeks 2–3 | One segment${motion ? ` (${motion})` : ''} | ≥80% required field fill rate |
| Expand | Week 4+ | Adjacent teams | Same inspection report, same fields |
| Automate | After expand | Workflows/routing | Automation off if fill rate drops 2 weeks straight |

## Data & integration notes

${constraintPhrase ? `Operating constraint: **${constraint}**. ` : ''}Document which objects sync from warehouse or billing before enabling automation. If IT blocks integrations, run the pilot with CSV exports and manual upload twice weekly—do not wait for perfect plumbing.

## RevOps without a big team

One owner can run this if they have **write access** to ${crm} validation rules and a **manager who enforces** the inspection report. Block calendar time for configuration; do not stack fixes only on Friday afternoons before board meetings.

## Enablement & documentation

Publish a one-page **definition of done** for **${problem}** inside your sales wiki. Link the ${crm} report URL, required fields, and two annotated screenshots. New hires should pass a 10-minute quiz on which fields block saves before receiving live opportunities in the pilot segment.

## Stakeholder alignment

| Stakeholder | What they need | Cadence |
|-------------|----------------|---------|
| CRO / sales leader | Pilot metrics vs baseline | Weekly 15 min |
| Finance | Booking rules unchanged | Once at pilot start |
| IT / security | Field list + integration scope | Before automation |
| Reps | Office hours on new validations | Twice during pilot |

## Discovery questions for your next inspection

Ask the pilot pod: Which deals failed **${problem}** rules two weeks in a row? Which field was empty on every loss? What would have blocked the save if validation were on? Capture answers in ${crm} notes so the definition of done evolves with real failures—not generic enablement slides.

## Post-pilot scale checklist

- Required fields copied to adjacent teams unchanged
- Same saved report URL pinned in the Monday leadership agenda
- Automation tickets list the field API names, not vendor feature names
- Success metric frozen for one quarter before changing again

## ${crm} admin notes (copy/paste ready)

Create a validation rule or required-field set on the object where **${problem}** appears. Name the rule with the problem keyword so admins can find it later. Add a custom field **Exception_Reason__c** (or equivalent) for temporary waivers—managers must fill it or the record cannot reach Commit. Archive waivers monthly; patterns indicate bad rules, not bad reps.

## When leadership pushes back

If executives want a faster rollout, show the pilot fill-rate chart and the forecast error before/after. Offer parallel rollout only after two clean inspection weeks. Buying tools without field discipline repeats **${problem}** at higher license cost.

## Tie to forecasting

Map each required field to a forecast category rule: if economic buyer role is missing, the deal cannot sit in Best Case. Managers downgrade in the same meeting they inspect **${problem}**—do not allow verbal commits without ${crm} evidence. Re-run the baseline export after 30 days to prove the fix held. Share results with finance and RevOps in the same slide.

## Bottom line

Fix **${problem}** on **${crm}** with **owner + enforced fields + weekly inspection**${motionPhrase}. Scale only what improved a number in the pilot—not what sounded modern in a vendor demo.`;
}

function isCannedEconomyAnswer(text, meta) {
  const t = String(text || '');
  const lab = meta && meta.lab_run ? String(meta.lab_run) : '';
  const src = meta && meta.source ? String(meta.source) : '';

  if (/Treat this as \*\*RevOps product work\*\*/i.test(t)) return true;
  if (/focus on \*\*one measurable outcome\*\*, a \*\*single owner\*\*/i.test(t) && /CRM-native implementation/i.test(t)) return true;
  if (/RevOps product work/i.test(t) && /economy-mode depth/i.test(t)) return true;
  if (/RevOps product work/i.test(t) && /CRM fields or reports/i.test(t) && /Manager inspection questions \(use weekly\)/i.test(t)) return true;
  if (lab === 'economy-batch-100' || lab === 'economy-cadence-v3') return true;
  if (src === 'programmatic-v2') return true;
  if (lab && /^economy-llm/.test(lab)) return false;
  if (lab === 'economy-mode-1000w-llm' || lab === 'economy-llm-cadence') return false;
  return false;
}

/** True when the entry should be rewritten with an LLM (not template-only). */
function needsIntelligentRewrite(blob) {
  if (!blob || !blob.question) return false;
  const lab = String(blob.lab_run || '');
  if (/^economy-llm/.test(lab) || lab === 'economy-mode-1000w-llm') return false;
  if (isCannedEconomyAnswer(blob.answer, blob)) return true;
  if (lab === 'economy-cadence-v3' || lab === 'economy-batch-100' || lab === 'economy-reanswer-v2') return true;
  if (blob.source === 'programmatic-v2') return true;
  if (blob.quality_polish_at && !isCannedEconomyAnswer(blob.answer, blob)) return false;
  return !/^economy-llm/.test(lab);
}

function buildAnswer(question) {
  const q = String(question || '');
  if (
    /\bnil\b|college football|transfer portal|nil collective|d1 football|go-to-market strategy for .+ football/i.test(
      q.toLowerCase()
    )
  ) {
    return buildNilAnswer(q);
  }
  return buildRevOpsAnswer(q);
}

module.exports = {
  buildAnswer,
  buildNilAnswer,
  buildRevOpsAnswer,
  isCannedEconomyAnswer,
  needsIntelligentRewrite,
  parseSchool,
  parseRevOps,
  schoolMeta,
};
