// RevOps Q&A topics ordered for Google search demand (broad → long-tail).
// Batch 1 (~100): highest-intent head terms + PAA. Batch 2+: operator long-tail.

const { capitalizeQuestion } = require('./text-capitalize');

function toQuestion(line) {
  const t = String(line || '').trim();
  let q;
  if (/^how do you /i.test(t)) q = t.endsWith('?') ? t : t + '?';
  else if (/^(what|why|when|where|which|who|can|should|do|does|is|are)\b/i.test(t))
    q = t.endsWith('?') ? t : t + '?';
  else q = 'How do you ' + t.replace(/\.$/, '') + '?';
  return capitalizeQuestion(q);
}

function topicKey(question) {
  return question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isLegacyCroHireTopic(topic) {
  const t = String(topic || '').toLowerCase();
  return (
    /\b(chief revenue officer|fractional cro|interim cro|cro advisory)\b/.test(t) ||
    /^decide if a (fractional|interim|full-time|part-time)/.test(t)
  );
}

/** Batch 1 — most-Googled RevOps head terms & PAA (fixed order, no shuffle). */
function buildGoogleTop100() {
  return [
    'what is RevOps and how is it different from sales operations',
    'what does a revenue operations team do in B2B SaaS',
    'how do you build a sales forecast in Salesforce for a mid-market SaaS company',
    'what is sales pipeline coverage and what ratio should RevOps target',
    'how do you calculate quota attainment and report it in the CRM',
    'what is the difference between bookings ARR and billings in RevOps reporting',
    'how do you design sales stages in HubSpot that match how buyers actually buy',
    'what is MEDDPICC and how do you operationalize it in Salesforce fields',
    'how do you fix duplicate contacts and accounts in Salesforce after an acquisition',
    'what is lead routing and how do you automate it in HubSpot without breaking SLAs',
    'how do you model multi-touch attribution when marketing uses HubSpot and sales uses Salesforce',
    'what is sandbagging in sales forecasting and how do RevOps leaders reduce it',
    'how do you run a weekly forecast call with commit upside and pipeline categories',
    'what is NRR and GRR and how do you report net revenue retention in a board deck',
    'how do you calculate CAC payback and magic number for a SaaS GTM team',
    'what is territory design for enterprise AEs and how do you avoid overlap in CRM',
    'how do you handle commission splits and clawbacks in Salesforce with a CPQ quote',
    'what is a mutual action plan and which CRM fields prove it is being used',
    'how do you hand off product-qualified leads from PLG to sales in HubSpot',
    'what is sales enablement versus RevOps and where should process ownership live',
    'how do you standardize opportunity products in Salesforce for usage-based pricing',
    'what is forecast category hygiene and how do you stop stage inflation',
    'how do you reconcile marketing sourced pipeline with sales accepted opportunities',
    'what is a RevOps tech stack for a Series B company with no data engineer',
    'how do you integrate Snowflake product usage data into Salesforce for expansion signals',
    'what is customer success handoff to sales for renewals and expansion in Gainsight',
    'how do you track renewal risk in the CRM when finance uses NetSuite',
    'what is weighted pipeline and when should RevOps stop using it',
    'how do you build a lead score that SDRs trust in HubSpot',
    'what is an ideal customer profile field strategy in Salesforce for outbound teams',
    'how do you operationalize BANT versus MEDDPICC without checkbox theater',
    'what is sales velocity and which CRM metrics feed the formula',
    'how do you measure win rate by segment without polluting stages',
    'what is a sales capacity model and how do RevOps build headcount plans',
    'how do you run QBR pipeline reviews with executive-ready Salesforce reports',
    'what is partner deal registration and how do you prevent channel conflict in CRM',
    'how do you attribute partner-sourced revenue without double-counting pipeline',
    'what is consumption pricing pipeline hygiene for ramp deals',
    'how do you forecast usage true-ups and minimum commits in Salesforce',
    'what is a sales ops dashboard versus a RevOps operating cadence',
    'how do you audit CRM required fields without slowing AEs down',
    'what is lifecycle stage definition for MQL SQL SAL in HubSpot',
    'how do you fix broken Marketo to Salesforce sync for campaign members',
    'what is an opportunity team and how do you set default credit splits',
    'how do you manage pricing exceptions and discount approvals in CPQ',
    'what is a renewal opportunity type and how do you separate expansion from churn save',
    'how do you calculate sales cycle length by stage in Salesforce reports',
    'what is pipeline generation versus pipeline creation in RevOps metrics',
    'how do you build a board-ready ARR waterfall from CRM and billing data',
    'what is a sales kickoff quota planning process RevOps should own',
    'how do you design SPIFs without breaking the main commission plan',
    'what is ramp quota for new AEs and how do you model it in comp tools',
    'how do you detect champion job changes and trigger plays from CRM',
    'what is multi-threading in enterprise deals and how do you score it in fields',
    'how do you integrate Outreach sequences with Salesforce activity reporting',
    'what is Gong conversation intelligence tied to opportunities in RevOps',
    'how do you prevent closed-lost opportunities from receiving automated emails',
    'what is a data dictionary for Salesforce and who maintains it in RevOps',
    'how do you migrate from Pipedrive to HubSpot without losing pipeline history',
    'what is Dynamics 365 sales pipeline setup for mixed channel GTM',
    'how do you run win loss analysis with structured CRM reason codes',
    'what is a sales methodology rollout that RevOps can actually enforce in CRM',
    'how do you measure SDR productivity beyond meetings booked',
    'what is inbound lead SLA and how do you alert when routing fails',
    'how do you operationalize outbound territory books with Apollo and Salesforce',
    'what is product-led sales assist and how do you score PQLs in the CRM',
    'how do you align marketing UTM strategy with opportunity source fields',
    'what is a parent account hierarchy for global rollups in Salesforce',
    'how do you handle multi-currency opportunities for ARR reporting',
    'what is a sales compensation dispute process tied to CRM opportunity splits',
    'how do you build renewal forecasting separate from new business pipeline',
    'what is customer health score in CRM and how do CS and sales share it',
    'how do you reduce forecast bias when AEs own consumption accounts',
    'what is a commit versus best case versus pipeline forecast tier',
    'how do you implement stage gates that legal and procurement actually follow',
    'what is a RevOps charter for a company with no dedicated RevOps hire yet',
    'how do you prioritize integration projects for a small RevOps team',
    'what is Salesforce Einstein forecasting and when is it worth enabling',
    'how do you structure HubSpot deal pipelines for inbound versus outbound motions',
    'what is an ARR snowball report for investors using CRM snapshots',
    'how do you track expansion white space in accounts with multiple products',
    'what is land and expand motion design in CRM for mid-market SaaS',
    'how do you measure marketing influence on enterprise deals with long cycles',
    'what is a sales funnel conversion report by stage for board reviews',
    'how do you fix orphan opportunities after rep turnover in Salesforce',
    'what is a CRM governance committee cadence RevOps should run',
    'how do you document routing rules for SDR to AE handoff in HubSpot',
    'what is forecast accuracy metric and how do you score RevOps performance',
    'how do you connect billing system invoices to closed-won opportunities',
    'what is a pipeline review hygiene checklist for sales managers',
    'how do you standardize next step and close date fields to improve forecast',
    'what is RevOps role in pricing and packaging changes across the GTM stack',
    'how do you report pipeline by product line when opps have multiple SKUs',
    'what is a sales data quality scorecard for weekly RevOps standups',
    'how do you automate renewal reminders without spamming active opportunities',
    'what is channel partner pipeline visibility for co-sell motions in CRM',
    'how do you build executive dashboards in Looker from Salesforce and Snowflake',
    'what is the difference between sales enablement content and RevOps process design',
    'how do you run a CRM cleanup sprint before fiscal year planning',
    'what is a sales ops ticket intake process for field change requests',
    'how do you measure time in stage and flag stalled deals automatically',
    'what is a RevOps interview question set for hiring the first RevOps manager',
    'how do you set up Salesforce for mixed PLG and sales-led revenue motions',
  ];
}

const MOTIONS = [
  'PLG-to-sales handoff',
  'enterprise outbound',
  'channel co-sell',
  'usage-based pricing',
  'inbound SDR',
  'outbound SDR',
  'AE-led pods',
  'renewal and expansion',
  'services-led sales',
  'marketplace-sourced pipeline',
];

const CRMS = ['Salesforce', 'HubSpot', 'Dynamics 365', 'Pipedrive'];

const CONSTRAINTS = [
  'no dedicated RevOps hire yet',
  'post-merger CRM merge',
  'Series B board reporting',
  'consumption pricing with minimum commits',
  'multi-currency ARR rollups',
  'finance on NetSuite',
  'data warehouse in Snowflake',
  'legacy CPQ still in place',
  'SDRs on Outreach',
  'strict IT security review blocks integrations',
];

const PROBLEMS = [
  'forecast sandbagging',
  'MQL decay',
  'duplicate contacts',
  'broken lead routing',
  'territory collisions',
  'commission disputes',
  'stage inflation',
  'missing economic buyer fields',
  'renewal risk not in CRM',
  'partner deal registration conflicts',
  'product usage not syncing to CRM',
  'mutual action plans ignored',
  'pricing exception chaos',
  'champion job changes',
  'multi-thread gaps',
  'UTM loss across subdomains',
  'bookings versus billings mismatches',
  'SPIF payouts conflicting with clawbacks',
  'sandbox changes breaking flows',
  'workflow emails on closed-lost opps',
];

const VERBS = [
  'measure',
  'fix',
  'model',
  'automate',
  'audit',
  'standardize',
  'forecast',
  'attribute',
  'reconcile',
  'dedupe',
  'route',
  'score',
  'report',
];

const OUTCOMES = [
  'pipeline coverage',
  'CAC payback',
  'magic number',
  'NRR',
  'GRR',
  'win rate',
  'forecast accuracy',
  'quota attainment',
  'sales cycle length',
  'expansion rate',
];

function buildGoogleLongTailTemplates() {
  const out = [];
  let k = 0;
  for (let mi = 0; mi < MOTIONS.length; mi++) {
    for (let ci = 0; ci < CRMS.length; ci++) {
      for (let xi = 0; xi < CONSTRAINTS.length; xi++) {
        const m = MOTIONS[mi];
        const c = CRMS[ci];
        const x = CONSTRAINTS[xi];
        const p = PROBLEMS[k % PROBLEMS.length];
        const v = VERBS[(k * 3) % VERBS.length];
        const o = OUTCOMES[(k * 5) % OUTCOMES.length];
        const variant = k % 5;
        k++;
        if (variant === 0) out.push(`what is the RevOps playbook for ${p} during ${m} on ${c} when ${x}`);
        else if (variant === 1)
          out.push(`how do you ${v} ${o} for ${m} on ${c} without another point solution when ${x}`);
        else if (variant === 2) out.push(`why do most vendors get ${p} wrong for ${m} teams using ${c}`);
        else if (variant === 3)
          out.push(`what CRM fields prove you fixed ${p} after migrating to ${c} for ${m} when ${x}`);
        else out.push(`how do you ${v} ${p} when ${x} and leadership only reviews ${o} monthly on ${c}`);
      }
    }
  }
  return out;
}

const PHASES = [
  { id: 'google-top-v1', pool: buildGoogleTop100(), ordered: true },
  { id: 'google-longtail-v1', pool: buildGoogleLongTailTemplates(), ordered: false },
];

const BATCH_SIZES = [100, 200, 200, 200, 200];

function nextPhaseId(currentId) {
  const idx = PHASES.findIndex((p) => p.id === currentId);
  if (idx < 0) return PHASES[0].id;
  return PHASES[(idx + 1) % PHASES.length].id;
}

function classifyTopicPhase(topic) {
  const t = String(topic || '').toLowerCase();
  const topKeys = buildGoogleTop100().map((line) => topicKey(toQuestion(line)));
  const q = topicKey(toQuestion(topic));
  if (topKeys.includes(q)) return 'google-top-v1';
  return 'google-longtail-v1';
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/**
 * @param {number} count
 * @param {Set<string>} seenKeys
 * @param {number} seed
 * @param {string} [phaseHint]
 * @param {number} [batchIndex] 1-based batch number for heartbeat (batch 1 = top 100)
 */
function generateTopicsBatch(count, seenKeys, seed = 0, phaseHint, batchIndex = 1) {
  const lines = [];
  let activePhase = PHASES.find((p) => p.id === phaseHint) || PHASES[0];

  if (batchIndex > 1 && activePhase.id === 'google-top-v1') {
    activePhase = PHASES.find((p) => p.id === 'google-longtail-v1') || PHASES[1];
  }

  let phaseHops = 0;
  while (lines.length < count && phaseHops < PHASES.length + 2) {
    const pool = activePhase.ordered ? activePhase.pool : shuffle(activePhase.pool);
    let phaseAdded = 0;
    if (activePhase.ordered) {
      const start = Math.max(0, (batchIndex - 1) * BATCH_SIZES[0]);
      for (let i = start; i < pool.length && lines.length < count; i++) {
        const topic = pool[i];
        const question = toQuestion(topic);
        const key = topicKey(question);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        lines.push(topic);
        phaseAdded++;
      }
    } else {
      for (let i = 0; i < pool.length && lines.length < count; i++) {
        const idx = (i + seed + phaseHops * 41) % pool.length;
        const topic = pool[idx];
        const question = toQuestion(topic);
        const key = topicKey(question);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        lines.push(topic);
        phaseAdded++;
      }
    }
    if (phaseAdded === 0) {
      activePhase = PHASES.find((p) => p.id === nextPhaseId(activePhase.id)) || PHASES[0];
      phaseHops++;
      continue;
    }
    break;
  }

  return {
    lines,
    phaseUsed: activePhase.id,
    batchIndex,
    exhausted: lines.length === 0,
  };
}

function generateTopics(count, seenKeys, seed = 0, phaseHint, batchIndex) {
  return generateTopicsBatch(count, seenKeys, seed, phaseHint, batchIndex).lines;
}

/** Write queue file batches for local review: batch N → 100 (N=1) or 200 (N>1) lines. */
function generateQueueFileBatch(batchNum) {
  const n = Math.max(1, parseInt(batchNum, 10) || 1);
  const size = n === 1 ? BATCH_SIZES[0] : BATCH_SIZES[1] || 200;
  const seen = new Set();
  const phase = n === 1 ? 'google-top-v1' : 'google-longtail-v1';
  const seed = (n - 1) * size;
  const { lines } = generateTopicsBatch(size, seen, seed, phase, n);
  return { batch: n, size: lines.length, lines, phase };
}

module.exports = {
  generateTopics,
  generateTopicsBatch,
  generateQueueFileBatch,
  nextPhaseId,
  classifyTopicPhase,
  topicKey,
  toQuestion,
  isLegacyCroHireTopic,
  buildGoogleTop100,
  BATCH_SIZES,
  PHASES: PHASES.map((p) => ({ id: p.id, size: p.pool.length, ordered: !!p.ordered })),
};
