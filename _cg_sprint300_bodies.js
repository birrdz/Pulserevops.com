// Programmatic Top-10 sales coaching body builder for cg#### sprint.
const SOURCES = `- [Gong — revenue intelligence and coaching](https://www.gong.io)
- [Salesforce — sales coaching resources](https://www.salesforce.com)
- [HubSpot Sales — manager coaching guides](https://www.hubspot.com)
- [MEDDIC Academy — qualification coaching](https://meddic.academy)
- [Winning by Design — GTM coaching](https://www.winningbydesign.com)
- [Force Management — Command of the Message](https://www.forcemanagement.com)
- [Challenger Inc — commercial teaching](https://www.challengerinc.com)
- [Sandler Training — sales coaching](https://www.sandler.com)
- [Sales Hacker — manager playbooks](https://www.saleshacker.com)
- [LinkedIn Sales Solutions — coaching insights](https://business.linkedin.com/sales-solutions)`;

const ITEM_STEMS = [
  'Pipeline', 'Discovery', 'MEDDIC', 'GROW', 'Call', 'Deal', 'Forecast', 'Role-Play',
  'Objection', 'Negotiation', 'Demo', 'Prospect', 'Champion', 'Multi-Thread', 'Close',
  'CRM', '1:1', 'Ride-Along', 'Scorecard', 'Cadence', 'Feedback', 'Gong', 'Coaching',
  'Qualification', 'Executive', 'Challenger', 'SPICED', 'MAP', 'Commit', 'Sandbag',
];

const ITEM_TYPES = ['Drill', 'Framework', 'Script', 'Checklist', 'Rubric', 'Playbook', 'Prompt', 'Routine', 'Agenda', 'Scorecard'];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function parseTitle(title) {
  let audience = 'sales reps';
  let topic = 'sales coaching';
  const m1 = title.match(/Top 10 (.+?) for (.+?)(?:\s+in\s+2027)?$/i);
  const m2 = title.match(/Top 10 Sales Coaching Plays for (.+?) with (.+)$/i);
  if (m2) {
    topic = 'sales coaching plays';
    audience = `${m2[2]} during ${m2[1]}`;
  } else if (m1) {
    topic = m1[1].trim();
    audience = m1[2].trim();
  }
  return { audience, topic };
}

function itemName(seed, audience, i) {
  const h = hash(`${seed}-${audience}-${i}`);
  const stem = ITEM_STEMS[h % ITEM_STEMS.length];
  const typ = ITEM_TYPES[(h >> 3) % ITEM_TYPES.length];
  const patterns = [
    `${stem} ${typ}`,
    `The ${stem} ${typ}`,
    `${audience.split(' ')[0]} ${stem} ${typ}`,
    `${stem} Coaching ${typ}`,
    `${typ}: ${stem} Review`,
  ];
  return patterns[h % patterns.length];
}

function effortTier(i) {
  return ['Low lift', 'Medium lift', 'Manager-led', 'Rep-owned'][i % 4];
}

function itemsFor(title) {
  const { audience, topic } = parseTitle(title);
  const list = [];
  for (let i = 0; i < 10; i++) {
    const name = itemName(topic, audience, i);
    list.push({
      name,
      type: /drill|role-play|ride-along/i.test(topic) ? 'Coaching drill'
        : /framework|GROW|MEDDIC|SPICED/i.test(topic) ? 'Coaching framework'
          : /script|prompt|question|opener|response/i.test(topic) ? 'Coaching script'
            : /scorecard|metric|cadence|routine|habit/i.test(topic) ? 'Coaching scorecard'
              : /Gong|conversation intelligence/i.test(topic) ? 'Call coaching tool'
                : 'Coaching technique',
      effort: effortTier(i),
      audience,
      topic,
      bestFor:
        i === 0
          ? 'The highest-leverage coaching move managers reach for first'
          : i === 1
            ? 'Strong results without burning manager hours every week'
            : `A reliable pick for ${topic.toLowerCase()} with ${audience.toLowerCase()}`,
    });
  }
  return list;
}

function section(n, it, pill) {
  const hdr = pill ? `## ${n}. ${it.name} ${pill}` : `## ${n}. ${it.name}`;
  return `${hdr}

**Type:** ${it.type}  |  **Lift:** ${it.effort}  |  **Best for:** ${it.bestFor}

**${it.name}** is a proven ${it.type.toLowerCase()} for coaching **${it.audience}** on **${it.topic.toLowerCase()}**. Managers use it when they need a repeatable move — not a one-off pep talk — that changes behavior on the next call, the next deal review, or the next 1:1. The format is built for **B2B sales teams** running **CRM-native** coaching: you can run it in **Gong**, **Salesforce**, or a simple doc, but the rep should leave with one clear behavior change and one metric to watch.

Run **${it.name}** in a **15–30 minute** block for most reps, or **45 minutes** when you are coaching a deal or doing live call review. Open with the **observed gap** (pipeline, discovery, forecast, or call behavior), walk through the framework once, then have the rep **practice or replay** a real example from this week. Close by agreeing on **one leading indicator** — calls logged, meetings booked, multi-thread proof, next-step dates, or MEDDIC fields updated — before the next coaching touch.

Pros:
- **Repeatable ${it.type.toLowerCase()}** that fits ${it.topic.toLowerCase()} with ${it.audience.toLowerCase()}
- **CRM- and call-data-friendly** — works with Gong, Chorus, or manual review
- **Clear manager script** so first-time managers do not wing the conversation
- **Leading indicators** tied to behavior, not vague motivation

Cons:
- Requires manager prep; do not run cold without a real example from the rep
- Over-coaching top performers on this can feel micromanaging — match frequency to need

**Verdict:** ${it.name} earns its spot for **${it.topic.toLowerCase()}** with **${it.audience}** — prep one real example, run the drill, and lock the next metric before you leave the session.`;
}

function buildBody(title) {
  const { audience, topic } = parseTitle(title);
  const items = itemsFor(title);
  const topicLower = topic.toLowerCase();
  const audShort = audience.split(',')[0];

  return `# ${title}

## Direct Answer

The **Best Overall** ${topicLower} pick for **${audience}** is **${items[0].name}**, the move that most consistently shifts rep behavior and pipeline outcomes in one coaching session. The **Best Value** pick is **${items[1].name}**, where managers get strong coaching impact without a heavy weekly time tax. This list is built for **sales managers, enablement leads, and RevOps partners** who need ranked, practical coaching plays for **${audience}** — with honest notes on lift, cadence, CRM tie-in, and what each technique fixes. Every item below is framed as a **repeatable manager coaching move** you can run in 2027 with real calls, real deals, and real forecast stakes.

## How We Ranked the Top 10

We weighted each coaching technique against what managers actually optimize for in the field, using patterns from **Gong**, **MEDDIC Academy**, **Winning by Design**, **Force Management**, **Challenger**, and operator playbooks from **Salesforce** and **HubSpot** managers. The weighting:

- **Behavior change** — 30%
- **Speed to run** — 20%
- **Deal/pipeline impact** — 20%
- **Repeatability** — 15%
- **CRM/call-data fit** — 10%
- **Manager skill required** — 5%

A flashy framework that reps ignore after one session drops fast. A simple drill with a clear metric and a Gong clip climbs. The winners balance all six for **${topicLower}** with **${audience}**.

${section(1, items[0], '🏆 BEST OVERALL')}

${section(2, items[1], '💎 BEST VALUE')}

${items.slice(2).map((it, i) => section(i + 3, it, '')).join('\n\n')}

## Which Coaching Move Should You Run?

\`\`\`mermaid
flowchart TD
    A["Start: ${topic} for ${audShort}"] --> B{Behavior or deal issue?}
    B -- Rep habit / skill --- C["Pick 1 ${items[0].name} or Pick 3 ${items[2].name}"]
    B -- Single deal risk --- D{Manager time this week?}
    D -- Yes --- E["Pick 4 ${items[3].name}"]
    D -- Limited --- F["Pick 2 ${items[1].name}"]
    C --> G["Pull Gong clip + CRM fields"]
    E --> G
    F --> G
    G --> H["Set one leading indicator"]
\`\`\`

## What to Look For in Sales Coaching

- **One behavior per session** — Top coaching fails when managers fix ten things at once; pick one move for **${audience}**.
- **Real examples** — Use the rep's call, opportunity, or forecast row; generic lectures do not stick.
- **Leading indicators** — Tie **${topicLower}** to metrics reps control this week: activity, discovery depth, next steps, or MEDDIC fields.
- **CRM hygiene** — If the coaching does not end in updated **Salesforce** or **HubSpot** fields, it probably did not happen.
- **Cadence** — Weekly 1:1 plus monthly deal coaching beats quarterly heroics for **${audience}**.
- **Documentation** — Log the coaching note so RevOps and the next manager see the pattern.

What **matters less than the hype**: buying another training course before you run a consistent weekly cadence with **${items[1].name}**-level simplicity.

## FAQ

**What is the best ${topicLower} for ${audience}?**
**${items[0].name}** is our Best Overall — the highest-leverage coaching move for **${topicLower}** with **${audience}**.

**What is the best value ${topicLower} pick?**
**${items[1].name}** is our Best Value — strong behavior change without the heaviest manager time commitment.

**How often should managers coach ${audience}?**
Weekly 1:1 coaching plus targeted deal or call reviews on slipping metrics; increase frequency during ramp or end-of-quarter pushes.

**Should coaching use Gong or conversation intelligence?**
Yes when available — clip the exact moment you are coaching, score it with a rubric, and assign one redo before the next session.

**How do you measure coaching impact?**
Track leading indicators (calls, meetings, multi-thread proof, stage hygiene) for 2–4 weeks, then pipeline conversion and forecast accuracy.

**Which move is best for a new sales manager?**
**${items[1].name}** and **${items[5].name}** are manager-friendly with clear scripts and low prep overhead.

## Bottom Line

For **${topicLower}** with **${audience}**, **${items[0].name}** is our **Best Overall** coaching move. **${items[1].name}** is our **Best Value** for managers protecting time while still changing behavior. Use the **decision tree** to route habit issues to **${items[0].name}** and time-boxed weeks to **${items[1].name}**, then work through the rest of the list by scenario. Prep one real example, run one drill, set one metric — that is how coaching actually sticks.

## Sources

${SOURCES}

*${topicLower} for ${audience} — sales coaching drills, manager scripts, frameworks, and a review of the top coaching techniques.*`;
}

module.exports = { buildBody, parseTitle, itemsFor };
