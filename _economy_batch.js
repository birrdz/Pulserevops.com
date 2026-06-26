const https = require('https');
const fs = require('fs');

const TOPICS = [
  'use Claude to extract and map unstructured call notes to CRM custom objects',
  'trigger Apollo.io sequences based on specific product usage telemetry',
  'deploy a custom RevOps dashboard architecture on Netlify',
  'train LLMs on proprietary sales methodologies for internal coaching bots',
  'automate deduplication of Apollo contacts before CRM sync without third-party tools',
  'use AI to mathematically analyze lost deal reasons across hundreds of transcripts',
  'use generative AI to write highly localized outbound sequences at scale',
  'build automated workflows for updating CRM contact roles from meeting summaries',
  'build predictive churn models using unstructured customer support tickets',
  'bypass native integration limits between AI dialers and legacy CRMs',
  'run a fractional CRO onboarding checklist in the first 30 days of an engagement',
  'structure equity vesting and performance bonuses for fractional CROs',
  'bridge the operational gap between founder-led sales and a new fractional CRO',
  'set clear SLA boundaries between a fractional executive and an outsourced marketing agency',
  'handle legal and operational considerations when sharing playbooks across non-competing clients',
  'measure leading indicators for fractional CRO ROI in the first 90 days',
  'identify transition triggers from fractional revenue leadership to a full-time hire',
  'build a scalable syndicate model for sharing Go-To-Market resources',
  'restructure a misaligned sales compensation plan mid-year as a revenue leader',
  'manage RevOps change management when leadership is only present two days a week',
  'define Pulse metrics for real-time Go-To-Market execution visibility',
  'apply baseball On-Base Percentage philosophy to SDR pipeline generation',
  'measure sales cycle velocity by tracking duration in micro-stages',
  'calculate the true cost of a free trial motion vs a pilot program',
  'correlate executive sponsor involvement with deal size and velocity',
  'track the decay rate of Marketing Qualified Leads by cohort week',
  'analyze the impact of specific legal redlines on sales cycle length',
  'measure conversion from targeted direct mail campaigns to enterprise meetings',
  'track the friction score of a B2B contract signature process',
  'correlate sales rep tenure and prior industry experience with product line success',
  'build scalable sales enablement frameworks without relying on gut feeling',
  'create playbooks for standardizing Mutual Action Plans natively in the CRM',
  'transition veteran sales teams from relationship selling to data-driven execution',
  'align marketing collateral taxonomy with sales enablement platforms',
  'structure a weekly forecast call focused on deal strategy not pipeline reading',
  'measure pipeline impact of a localized sales training rollout',
  'create dynamic battle cards that update from competitor news feeds',
  'develop a certification program that measures pitch comprehension not video completion',
  'standardize the pre-sales engineering handoff to customer success',
  'design curriculum for continuous revenue operations education',
  'structure double-trigger commission payouts for complex M&A scenarios',
  'model commission clawbacks for multi-year consumption-based enterprise contracts',
  'design quota relief policies for reps facing prolonged non-sales technical delays',
  'set territory routing rules for hybrid inbound/outbound SDRs to prevent cherry-picking',
  'decouple Customer Success compensation from direct renewal quotas',
  'design temporary Spiff structures that drive adoption of new CRM fields',
  'transition a sales floor from ARR-based to usage-based compensation',
  'calculate On-Target Earnings ratios for specialized technical sales engineers',
  'benchmark equity vs cash compensation for a first dedicated RevOps hire',
  'structure variable comp for channel partners who co-sell rather than resell',
  'build multi-touch attribution for 18-month B2B enterprise sales cycles',
  'structure CRM campaigns to measure revenue impact of dark social',
  'calculate CAC payback for hybrid PLG and sales-led motions',
  'establish Blended CAC vs Paid CAC benchmarks for Series B B2B SaaS',
  'track and attribute offline event interactions in a digital revenue waterfall',
  'bridge attribution between self-serve trial users and enterprise procurement upgrades',
  'run cohort analysis to isolate B2B expansion revenue by acquisition channel',
  'build a unified lead-to-revenue lifecycle without default CRM lifecycle stages',
  'calculate weighted pipeline value when sales cycles vary by more than six months',
  'map lead status to opportunity stages after a company merger',
  'standardize free-text job titles in legacy CRMs using fuzzy matching',
  'write an enforceable SLA for data entry between marketing and sales',
  'audit automated CRM workflow rules to prevent infinite loops and API limits',
  'archive inactive contacts without losing historical activity timelines',
  'establish a cross-functional data dictionary for revenue metrics before an IPO',
  'reset baseline metrics when historical CRM data is fundamentally flawed',
  'restrict field-level CRM visibility without breaking integration user permissions',
  'design a territory hierarchy that handles mid-year rep reassignments cleanly',
  'quantify the financial cost of bad CRM data in enterprise B2B',
  'create a sandbox testing protocol for RevOps infrastructure changes',
  'decouple gross retention from net revenue retention to find hidden churn',
  'operationalize customer health scores beyond login frequency and NPS',
  'automate data aggregation for Quarterly Business Reviews',
  'set CRM early warning alerts for champion departures or title changes',
  'map white space in enterprise accounts for expansion campaigns',
  'operationalize a customer reference program natively in the CRM',
  'track cost-to-serve enterprise customers against ARR margin',
  'automate workflow triggers from implementation to adoption phases',
  're-engage ghosted renewals without automatic discounting',
  'analyze churn root causes when CRM says budget but telemetry disagrees',
  'adjust CRM forecast categories based on historical stage slip rates',
  'build forecasting models for consumption-based pricing tiers',
  'identify systemic sandbagging using historical closing patterns',
  'build a bottoms-up forecast for a net-new outbound motion',
  'reconcile top-down board goals with bottom-up pipeline reality',
  'triangulate forecasts between manager commits and ML predictions',
  'define pipeline coverage ratios for enterprise vs high-velocity sales',
  'strip happy ears from the sales pipeline before board reporting',
  'forecast impact of a planned price increase on pipeline velocity',
  'model revenue delay from switching payment processors or billing systems',
  'set up PLG billing infrastructure between payment gateways and CRMs',
  'migrate from legacy CPQ to modern tools with zero sales floor downtime',
  'capture UTM parameters in hidden form fields across complex subdomains',
  'build automated de-dup workflows that merge activity history safely',
  'track multi-currency exchange rates in historical closed-won reporting',
  'align RevOps when acquiring a business with a different GTM motion',
  'operationalize state-specific sales tax exemption tracking in the CRM',
  'track non-standard MSA clauses that impact renewals',
  'create a unified customer communication view across support outbound and marketing tools',
  'develop an offboarding protocol that re-routes sequences and pipeline when a rep leaves',
];

function toQuestion(topic) {
  const t = topic.trim();
  if (/^(use|trigger|deploy|train|automate|build|bypass|run|structure|bridge|set|handle|measure|identify|restructure|manage|define|apply|calculate|correlate|track|analyze|create|transition|align|design|develop|standardize|model|decouple|establish|reset|restrict|quantify|archive|write|audit|operationalize|map|forecast|strip|migrate|capture|align)/i.test(t))
    return `How do you ${t}?`;
  return `How do you ${t}?`;
}

function answerFor(question, topic) {
  const slug = topic.split(/\s+/).slice(0, 3).join('-');
  return `## Direct Answer

${question.replace('How do you ', 'To ').replace('?', ',')} focus on **one measurable outcome**, a **single owner** (RevOps or revenue ops), and a **CRM-native implementation** so reporting stays honest. Document the current state, define 3–5 fields or reports that prove progress, pilot on one segment, then scale.

**Steps:** audit tools and data → design the workflow → automate only what is validated manually → train the team → review weekly against a Pulse metric (conversion, cycle time, or data quality).

\`\`\`mermaid
flowchart TD
  A[Audit current state] --> B[Define CRM fields and reports]
  B --> C[Pilot one team or segment]
  C --> D[Automate validated steps]
  D --> E[Measure and iterate]
\`\`\`

## What good looks like

- Clear definition of done (e.g. field fill rate, sequence enrollment, forecast accuracy).
- No shadow spreadsheets — source of truth stays in CRM or your RevOps stack.
- Rollback plan if automation misfires.

## Common mistakes

- Automating before the process works manually.
- Skipping data hygiene (duplicates, bad titles, missing owners).
- Measuring activity instead of revenue outcomes.

## Bottom line

Treat this as **RevOps product work**: small bets, CRM-first, measurable wins. Your polish engine can deepen this entry later; the operational spine is audit → define → pilot → automate → measure.`;
}

function postOne(num, topic) {
  return new Promise((resolve) => {
    const question = toQuestion(topic);
    const answer = answerFor(question, topic);
    const id = 'q' + num;
    const tags = ['revops', 'economy-mode', slugTag(topic)];
    const payload = JSON.stringify({
      key: 'pulsemachine-writer-2026',
      id,
      question,
      answer,
      tags,
      sources: ['Pulse RevOps operational practice'],
      lab_run: 'economy-batch',
    });
    const req = https.request(
      {
        hostname: 'pulserevops.com',
        path: '/.netlify/functions/pulse-blob-writer',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ id, status: res.statusCode, body, question }));
      }
    );
    req.on('error', (e) => resolve({ id, status: 0, body: e.message, question }));
    req.write(payload);
    req.end();
  });
}

function slugTag(topic) {
  return topic.replace(/[^a-z0-9]+/gi, '-').slice(0, 40).toLowerCase();
}

async function main() {
  const log = [];
  let num = 9700;
  for (const topic of TOPICS) {
    let r = await postOne(num, topic);
    while (r.status === 409 && num < 99999) {
      num++;
      r = await postOne(num, topic);
    }
    log.push(`${r.id}\t${r.status}\t${r.question}`);
    console.log(r.id, r.status);
    if (r.status === 200 || r.status === 201) num++;
    await new Promise((x) => setTimeout(x, 400));
  }
  fs.writeFileSync(__dirname + '/_economy_batch_log.txt', log.join('\n'), 'utf8');
}

main();
