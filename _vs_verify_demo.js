#!/usr/bin/env node
// _vs_verify_demo.js — good vs bad comparison answer examples + gate output.
const { auditComparisonEntry, expertPanelFor } = require('./netlify/functions/lib/vs-expert-verify');
const { spotCheckEntry } = require('./_v2_publish_verify');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');

const GOOD = {
  id: 'q99901',
  title: 'HubSpot vs Salesforce for mid-market RevOps',
  body: `## Direct Answer
**HubSpot** wins when you want fast time-to-value, native marketing + sales on one login, and a team under ~200 seats without a dedicated Salesforce admin. **Salesforce** wins when you need enterprise CPQ, complex territory models, AppExchange depth, and you already have ops headcount to own the platform. Most mid-market RevOps teams pick HubSpot if marketing drives pipeline; pick Salesforce if product-led growth is secondary and finance owns forecasting rigor.

## Context
Both platforms can run a modern RevOps stack — the choice is implementation tax vs ceiling.

\`\`\`compare
a: HubSpot
b: Salesforce
- Time to live | 4–8 weeks typical | 3–6 months with SI
- Admin burden | Low — ops generalist can own | High — often 1+ FTE admin
- Marketing native | Excellent — same CRM | Requires Marketing Cloud or partner stack
- Forecasting depth | Good for SMB/mid | Best-in-class enterprise forecasting
\`\`\`

## FAQ
**Q: Can we migrate later?**
A: Yes, but plan data model mapping early — custom objects hurt both directions.

\`\`\`mermaid
flowchart LR
  A[Pipeline source] --> B{Marketing-led?}
  B -->|Yes| H[HubSpot]
  B -->|No| S[Salesforce]
\`\`\`

## Sources
1. Gartner CRM MQ summaries (public excerpts)
2. HubSpot pricing page
3. Salesforce edition comparison
4. RevOps Co-op community benchmarks
5. PULSE operator interviews

## Related on PULSE
- /knowledge/q10001
- /knowledge/q10002
- /knowledge/q10003

![cover](/assets/qa/demo-cover.jpg)
`,
};

const BAD = {
  id: 'q99902',
  title: 'Gong vs Chorus for sales coaching',
  body: `## Direct Answer
Gong is obviously better for everyone. Chorus is outdated. You should just buy Gong.

## Why Gong wins
Gong has AI. Chorus doesn't. End of story.

\`\`\`compare
a: Gong
b: Chorus
- AI | Great | Bad
\`\`\`

## FAQ
**Q: Is Chorus worth it?**
A: No.

## Sources
1. Vendor blog
2. Random Reddit thread

## Related on PULSE
- /knowledge/q10001

![cover](/assets/qa/demo-cover.jpg)
`,
};

function report(label, sample) {
  const vs = auditComparisonEntry(sample.id, sample.title, sample.body);
  const panel = vs.isComparison ? expertPanelFor(sample.id, sample.title, sample.body) : null;
  const spot = spotCheckEntry(sample.id, sample.body, new Set(), sample.title);
  const grade = gradeEntry(sample.id, sample.body, { imagesDeferred: true, title: sample.title });
  console.log('\n' + '='.repeat(72));
  console.log(label);
  console.log('='.repeat(72));
  console.log('Title:', sample.title);
  if (panel) console.log('Expert panel:', panel.team);
  console.log('Is comparison:', vs.isComparison);
  console.log('Structural pass:', vs.structuralPass);
  if (vs.gaps.length) console.log('Gaps:', vs.gaps.join(', '));
  if (vs.render) console.log('Renders compare table:', vs.render.renders, `(rows=${vs.render.rowCount || 0})`);
  console.log('spotCheckEntry pass:', spot.pass, '| gaps:', spot.gaps.join(', ') || '(none)');
  console.log('gradeEntry score:', grade.score, '| vs_audit:', grade.vs_audit && grade.vs_audit.structuralPass);
}

report('GOOD EXAMPLE (balanced vs, full compare block)', GOOD);
report('BAD EXAMPLE (one-sided, thin compare, missing sections)', BAD);
