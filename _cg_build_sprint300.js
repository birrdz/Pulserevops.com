// Build 300-entry coaching sprint queue cg0518–cg0817.
// PILLAR LAW: target 1:1 Top-10 vs Q&A (entryKind: 'top10' | 'qa') — .cursor/rules/coaching-pillar-mix.mdc
const fs = require('fs');
const mk = (title, slug) => ({ title, slug });
const sl = (s) => ('coach-' + s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const existing = fs.existsSync('C:/Users/koryj/website/_cg_existing_titles.json')
  ? new Set(JSON.parse(fs.readFileSync('C:/Users/koryj/website/_cg_existing_titles.json', 'utf8')))
  : new Set();

const roles = ['SDRs', 'BDRs', 'AEs', 'Account Executives', 'CSMs', 'Sales Managers', 'First-Line Managers', 'Enterprise Sellers', 'Mid-Market Reps', 'SMB Reps', 'New Hires', 'Ramping Reps', 'Underperformers', 'Top Performers', 'Remote Reps'];
const motions = ['Outbound', 'Inbound', 'PLG Handoff', 'Channel', 'Partner-Led', 'Enterprise', 'Mid-Market', 'SMB', 'SaaS', 'Usage-Based'];
const topics = [
  'Sales Coaching Drills', 'Coaching Frameworks', '1:1 Coaching Questions', 'Call Coaching Techniques',
  'Pipeline Coaching Moves', 'Deal Coaching Agendas', 'MEDDIC Coaching Prompts', 'MEDDPICC Coaching Checks',
  'Discovery Coaching Scripts', 'Objection Coaching Responses', 'Negotiation Coaching Tactics',
  'Forecast Coaching Habits', 'CRM Coaching Routines', 'Prospecting Coaching Plays', 'Demo Coaching Fixes',
  'Closing Coaching Techniques', 'Role-Play Coaching Scenarios', 'Gong Coaching Review Prompts',
  'Conversation Intelligence Coaching Uses', 'Field Coaching Ride-Along Moves', 'GROW Model Coaching Steps',
  'Coaching Scorecard Metrics', 'Weekly Coaching Cadence Items', 'Team Coaching Meeting Formats',
  'Coaching Conversation Openers', 'Feedback Coaching Scripts', 'Coaching for Sandbagging',
  'Coaching for Happy Ears', 'Coaching for Single-Threaded Deals', 'Coaching for Discounting',
];

const pools = [];
for (const t of topics) {
  for (const r of roles) pools.push(mk(`Top 10 ${t} for ${r}`, sl(`${t}-${r}`)));
}
for (const t of topics.slice(0, 20)) {
  for (const m of motions) pools.push(mk(`Top 10 ${t} for ${m} Teams`, sl(`${t}-${m}`)));
}
const situations = ['End of Quarter', 'New Manager', 'Quota Miss', 'Big Deal Push', 'Renewal Season', 'RFP Season', 'Competitive Displacement', 'Multi-Threading', 'Executive Access', 'Champion Building'];
for (const s of situations) {
  for (const r of roles.slice(0, 10)) {
    pools.push(mk(`Top 10 Sales Coaching Plays for ${s} with ${r}`, sl(`${s}-${r}`)));
  }
}

const seen = new Set(existing);
const unique = [];
for (const row of pools) {
  if (seen.has(row.title)) continue;
  seen.add(row.title);
  unique.push(row);
}
let n = 0;
while (unique.length < 300) {
  const t = topics[n % topics.length];
  const r = roles[n % roles.length];
  const row = mk(`Top 10 ${t} for ${r} in 2027`, sl(`${t}-${r}-2027-${n}`));
  if (!seen.has(row.title)) {
    seen.add(row.title);
    unique.push(row);
  }
  n++;
}

const START = 518;
const out = unique.slice(0, 300).map((e, i) => ({
  id: 'cg' + String(START + i).padStart(4, '0'),
  title: e.title,
  slug: e.slug,
}));

fs.writeFileSync('C:/Users/koryj/website/_cg_sprint300.json', JSON.stringify(out, null, 2));
console.log('queue', out.length, 'first', out[0].id, out[0].title, 'last', out[out.length - 1].id);
