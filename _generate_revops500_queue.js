// Generate 500 unique long-tail RevOps questions (batch N).
const fs = require('fs');
const path = require('path');

const batch = parseInt(process.argv[2] || '1', 10);
const OUT = path.join(__dirname, `_revops500_queue_b${batch}.txt`);

const motions = [
  'PLG-to-sales handoff', 'enterprise outbound', 'channel co-sell', 'marketplace listings',
  'usage-based pricing', 'multi-product bundles', 'land-and-expand', 'services-led sales',
  'partner-sourced pipeline', 'event-sourced pipeline', 'inbound SDR', 'outbound SDR',
  'AE-led', 'pod-based selling', 'full-cycle AE', 'BDR-to-AE split',
];
const crms = ['Salesforce', 'HubSpot', 'Dynamics 365', 'Pipedrive', 'Zoho CRM'];
const constraints = [
  'no dedicated RevOps hire yet', 'post-merger integration', 'Series B board reporting',
  'consumption pricing', 'multi-currency ARR', 'parent-company rollup reporting',
  'strict IT security review', 'legacy CPQ still in place', 'marketing ops on Marketo',
  'customer success on Gainsight', 'sales on Outreach', 'finance on NetSuite',
  'data warehouse in Snowflake', 'BI in Looker', 'no data engineer',
];
const problems = [
  'forecast sandbagging', 'MQL decay', 'duplicate contacts', 'broken lead routing',
  'territory collisions', 'commission disputes', 'stage inflation', 'missing champion fields',
  'renewal ghosting', 'expansion white space', 'partner deal registration conflicts',
  'UTM loss across subdomains', 'product usage not in CRM', 'call recordings not tied to opps',
  'mutual action plans ignored', 'legal redline cycle time', 'procurement black holes',
  'champion job changes', 'multi-thread gaps', 'pricing exception chaos',
];
const verbs = [
  'measure', 'fix', 'model', 'automate', 'audit', 'standardize', 'forecast',
  'attribute', 'reconcile', 'dedupe', 'route', 'score', 'alert on', 'report',
];
const outcomes = [
  'pipeline coverage', 'CAC payback', 'magic number', 'NRR', 'GRR', 'win rate',
  'sales cycle length', 'stage conversion', 'quota attainment', 'forecast accuracy',
  'expansion rate', 'churn reason integrity', 'bookings vs billings', 'ARR waterfall',
];

const questions = [];

for (let i = 0; i < 500; i++) {
  const bi = batch;
  const idx = i + bi * 500;
  const m = motions[idx % motions.length];
  const c = crms[(idx * 3) % crms.length];
  const x = constraints[(idx * 5) % constraints.length];
  const p = problems[(idx * 7) % problems.length];
  const v = verbs[(idx * 11) % verbs.length];
  const o = outcomes[(idx * 13) % outcomes.length];
  const variant = idx % 5;

  let q;
  if (variant === 0) q = `What is the RevOps playbook for ${p} during ${m} on ${c} when ${x}`;
  else if (variant === 1)
    q = `How do you ${v} ${o} for ${m} on ${c} without another point solution`;
  else if (variant === 2) q = `Why do most vendors get ${p} wrong for ${m} RevOps teams using ${c}`;
  else if (variant === 3) q = `What CRM fields prove you fixed ${p} after migrating to ${c} for ${m}`;
  else q = `How do you ${v} ${p} when ${x} and leadership only reviews ${o} monthly on ${c}`;

  questions.push(q + '?');
}

const header = `# RevOps 500 batch ${batch} — ${new Date().toISOString().slice(0, 10)}\n`;
fs.writeFileSync(OUT, header + questions.join('\n') + '\n', 'utf8');
console.log('Wrote', questions.length, 'questions to', OUT);
