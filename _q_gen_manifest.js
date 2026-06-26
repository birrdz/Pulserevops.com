const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('_q_existing_titles.json', 'utf8'));
const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const seen = new Map();
for (const e of existing) seen.set(norm(e.q), e.id);

// 100 general RevOps Q&As, framed for 2027, each with a short tag set.
// Topics span the full RevOps surface: pipeline, forecasting, data, GTM,
// systems, comp, ops process, AI adoption, CS/retention, PLG, enablement, etc.
const raw = [
  ['How do you build a RevOps team from scratch in 2027?', 'revops-team,org-design,hiring'],
  ['What is the ideal RevOps org structure for a $50M ARR company in 2027?', 'revops-team,org-design'],
  ['Should RevOps report to the CRO, CFO, or COO in 2027?', 'revops-team,reporting-structure'],
  ['How do you write a RevOps charter that executives actually use in 2027?', 'revops-process,charter'],
  ['What RevOps metrics should you report to the board in 2027?', 'metrics,board-reporting'],
  ['How do you calculate and improve pipeline coverage ratio in 2027?', 'pipeline,pipeline-coverage'],
  ['How do you build a lead scoring model that sales trusts in 2027?', 'lead-scoring,marketing-ops'],
  ['How do you fix a leaky sales funnel in 2027?', 'funnel,conversion'],
  ['How do you set sales quotas fairly in 2027?', 'quotas,sales-comp'],
  ['How do you design sales territories in 2027?', 'territories,territory-design'],
  ['How do you reduce CRM data decay in 2027?', 'crm,data-quality'],
  ['How do you run a CRM data hygiene program in 2027?', 'crm,data-quality,data-hygiene'],
  ['How do you measure and improve sales rep productivity in 2027?', 'productivity,sales-efficiency'],
  ['How do you build a deal desk in 2027?', 'deal-desk,deal-process'],
  ['How do you streamline the quote-to-cash process in 2027?', 'quote-to-cash,cpq'],
  ['How do you choose a CPQ tool in 2027?', 'cpq,tech-stack'],
  ['How do you reduce churn with RevOps in 2027?', 'churn,retention,customer-success'],
  ['How do you build a customer health score in 2027?', 'customer-success,health-score'],
  ['How do you operationalize net revenue retention in 2027?', 'nrr,retention,metrics'],
  ['How do you build a renewals process that prevents surprise churn in 2027?', 'renewals,customer-success'],
  ['How do you forecast renewals accurately in 2027?', 'renewals,forecasting'],
  ['How do you measure customer acquisition cost correctly in 2027?', 'cac,unit-economics'],
  ['How do you improve your LTV to CAC ratio in 2027?', 'ltv-cac,unit-economics'],
  ['How do you calculate the CAC payback period in 2027?', 'cac-payback,unit-economics'],
  ['How do you build a marketing attribution model in 2027?', 'attribution,marketing-ops'],
  ['Is multi-touch attribution still worth it in 2027?', 'attribution,marketing-ops'],
  ['How do you measure marketing-sourced vs sales-sourced pipeline in 2027?', 'pipeline,attribution'],
  ['How do you run an effective pipeline review meeting in 2027?', 'pipeline,sales-process'],
  ['How do you implement MEDDICC across a sales team in 2027?', 'sales-methodology,meddicc'],
  ['Which sales methodology should you standardize on in 2027?', 'sales-methodology'],
  ['How do you build a sales enablement function in 2027?', 'enablement,sales-enablement'],
  ['How do you onboard new sales reps faster in 2027?', 'onboarding,enablement'],
  ['How do you reduce ramp time for new AEs in 2027?', 'ramp-time,onboarding'],
  ['How do you build a win-loss analysis program in 2027?', 'win-loss,competitive-intel'],
  ['How do you operationalize competitive intelligence in 2027?', 'competitive-intel'],
  ['How do you set up RevOps for a PLG company in 2027?', 'plg,product-led-growth'],
  ['How do you blend product-led and sales-led growth in 2027?', 'plg,hybrid-gtm'],
  ['How do you score and route product-qualified leads in 2027?', 'pql,plg,lead-routing'],
  ['How do you build a lead routing system in 2027?', 'lead-routing,marketing-ops'],
  ['How do you reduce speed-to-lead in 2027?', 'speed-to-lead,inbound'],
  ['How do you structure an SDR team in 2027?', 'sdr,pipeline-generation'],
  ['How do you set SDR quotas and comp in 2027?', 'sdr,sales-comp'],
  ['How do you measure outbound effectiveness in 2027?', 'outbound,pipeline-generation'],
  ['How do you build an ICP that actually improves win rates in 2027?', 'icp,targeting'],
  ['How do you do account scoring for ABM in 2027?', 'abm,account-scoring'],
  ['How do you operationalize account-based marketing in 2027?', 'abm,marketing-ops'],
  ['How do you align sales and customer success in 2027?', 'alignment,customer-success'],
  ['How do you build a customer handoff process from sales to CS in 2027?', 'handoff,customer-success'],
  ['How do you design a RevOps tech stack in 2027?', 'tech-stack,systems'],
  ['How do you consolidate an overgrown sales tech stack in 2027?', 'tech-stack,consolidation'],
  ['How do you evaluate and buy RevOps software in 2027?', 'tech-stack,procurement'],
  ['How do you calculate ROI on a new sales tool in 2027?', 'tech-stack,roi'],
  ['How do you migrate CRM platforms without losing data in 2027?', 'crm,migration'],
  ['How do you implement a data warehouse for RevOps in 2027?', 'data-warehouse,data-stack'],
  ['Do you need a revenue data platform in 2027?', 'data-platform,data-stack'],
  ['How do you build a single source of truth for revenue data in 2027?', 'data,source-of-truth'],
  ['How do you set up revenue reporting dashboards in 2027?', 'dashboards,reporting'],
  ['How do you measure sales velocity in 2027?', 'sales-velocity,metrics'],
  ['How do you improve average deal size in 2027?', 'deal-size,pricing'],
  ['How do you build a usage-based pricing model in 2027?', 'pricing,usage-based'],
  ['How do you operationalize a pricing change in 2027?', 'pricing,operations'],
  ['How do you reduce discounting across a sales team in 2027?', 'discounting,margin'],
  ['How do you build a sales commission audit process in 2027?', 'commissions,sales-comp'],
  ['How do you handle commission disputes in 2027?', 'commissions,sales-comp'],
  ['How do you forecast new business pipeline in 2027?', 'forecasting,pipeline'],
  ['What forecasting cadence should RevOps run in 2027?', 'forecasting,cadence'],
  ['How do you reduce forecast slippage in 2027?', 'forecasting,slippage'],
  ['How do you build a bottoms-up revenue model in 2027?', 'revenue-model,planning'],
  ['How do you run annual GTM planning in 2027?', 'gtm-planning,planning'],
  ['How do you build a capacity model for sales hiring in 2027?', 'capacity-planning,hiring'],
  ['How do you model headcount for a revenue plan in 2027?', 'headcount,planning'],
  ['How do you measure and reduce sales rep attrition in 2027?', 'attrition,retention'],
  ['How do you build a sales career ladder in 2027?', 'career-ladder,enablement'],
  ['How do you operationalize AI agents in RevOps in 2027?', 'ai,ai-agents'],
  ['Which RevOps tasks should you automate with AI in 2027?', 'ai,automation'],
  ['How do you measure ROI on AI in sales in 2027?', 'ai,roi'],
  ['How do you govern AI use across a revenue team in 2027?', 'ai,governance'],
  ['How do you keep CRM data clean when reps use AI note-takers in 2027?', 'ai,crm,data-quality'],
  ['How do you build a RevOps automation roadmap in 2027?', 'automation,roadmap'],
  ['How do you document RevOps processes so they scale in 2027?', 'documentation,process'],
  ['How do you run a RevOps quarterly business review in 2027?', 'qbr,process'],
  ['How do you build a deal scoring model to predict close in 2027?', 'deal-scoring,forecasting'],
  ['How do you identify and fix pipeline bottlenecks in 2027?', 'pipeline,bottlenecks'],
  ['How do you measure conversion rates at each funnel stage in 2027?', 'conversion,funnel'],
  ['How do you set up closed-loop reporting between marketing and sales in 2027?', 'reporting,alignment'],
  ['How do you build a lead-to-revenue waterfall in 2027?', 'waterfall,funnel'],
  ['How do you operationalize intent data in 2027?', 'intent-data,marketing-ops'],
  ['How do you build a churn early-warning system in 2027?', 'churn,early-warning'],
  ['How do you run a customer expansion playbook in 2027?', 'expansion,upsell'],
  ['How do you measure and improve gross revenue retention in 2027?', 'grr,retention'],
  ['How do you structure incentives for upsell and cross-sell in 2027?', 'incentives,expansion'],
  ['How do you build a partner and channel ops function in 2027?', 'channel,partner-ops'],
  ['How do you measure partner-sourced revenue in 2027?', 'channel,partner-ops'],
  ['How do you onboard a RevOps analyst in 2027?', 'hiring,onboarding'],
  ['What skills should you hire for in a RevOps analyst in 2027?', 'hiring,skills'],
  ['How do you prove the ROI of the RevOps function itself in 2027?', 'revops-roi,value'],
  ['How do you prioritize the RevOps backlog in 2027?', 'prioritization,backlog'],
  ['How do you run RevOps as an internal service team in 2027?', 'revops-process,service'],
  ['How do you prevent shadow spreadsheets from undermining RevOps in 2027?', 'data,governance'],
  ['How do you build a deal approval workflow in 2027?', 'deal-process,approvals'],
  ['How do you handle a sales reorg without losing pipeline in 2027?', 'reorg,change-management'],
];

const out = [];
let collisions = 0;
let nextId = 12847; // first free id (max was q12846)
for (const [q, tags] of raw) {
  const n = norm(q);
  if (seen.has(n)) { console.log('COLLISION:', q, '->', seen.get(n)); collisions++; continue; }
  seen.set(n, 'NEW');
  const id = 'q' + nextId++;
  out.push({ id, title: q.trim(), tags });
}
// internal dup check
const internal = new Map();
for (const it of out) {
  const n = norm(it.title);
  if (internal.has(n)) console.log('INTERNAL DUP:', it.id, it.title);
  internal.set(n, it.id);
}
fs.writeFileSync('_q_batch_manifest.json', JSON.stringify({ items: out }, null, 2));
console.log('\nGenerated', out.length, 'unique items |', collisions, 'collisions dropped');
console.log('ID range:', out[0].id, '->', out[out.length - 1].id);
