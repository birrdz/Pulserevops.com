// Generate unique fringe / nuance RevOps Q&A topic lines (no LLM).
// Long-tail operator gaps — not CRO hire-help (that lane is already filled).

function toQuestion(line) {
  const t = String(line || '').trim();
  if (/^how do you /i.test(t)) return t.endsWith('?') ? t : t + '?';
  if (/^(what|why|when|where|which|who|can|should|do|does|is|are)\b/i.test(t))
    return t.endsWith('?') ? t : t + '?';
  return 'How do you ' + t.replace(/\.$/, '') + '?';
}

const MOTIONS = [
  'PLG-to-sales handoff',
  'enterprise outbound',
  'channel co-sell',
  'marketplace listings',
  'usage-based pricing',
  'multi-product bundles',
  'land-and-expand',
  'services-led sales',
  'partner-sourced pipeline',
  'event-sourced pipeline',
  'inbound SDR',
  'outbound SDR',
  'AE-led pods',
  'BDR-to-AE split',
  'renewal-only CS motion',
  'consumption ramp deals',
  'multi-year ramp contracts',
];

const CRMS = [
  'Salesforce',
  'HubSpot',
  'Dynamics 365',
  'Pipedrive',
  'Zoho CRM',
];

const CONSTRAINTS = [
  'no dedicated RevOps hire yet',
  'post-merger CRM merge',
  'Series B board reporting',
  'consumption pricing with minimum commits',
  'multi-currency ARR rollups',
  'parent-company rollup reporting',
  'strict IT security review blocks integrations',
  'legacy CPQ still in place',
  'marketing ops on Marketo',
  'customer success on Gainsight',
  'SDRs on Outreach',
  'finance on NetSuite',
  'data warehouse in Snowflake',
  'BI in Looker',
  'no data engineer',
  'legal redlines on order forms',
  'procurement portal mandates',
  'rev rec on multi-element deals',
  'founder still owns largest accounts',
  'AEs refuse new required fields',
];

const PROBLEMS = [
  'forecast sandbagging on consumption deals',
  'MQL decay after subdomain migration',
  'duplicate contacts after acquisition',
  'broken lead routing across brands',
  'territory collisions on partner-sourced opps',
  'commission disputes on split credit',
  'stage inflation without buyer evidence',
  'missing economic buyer fields',
  'renewal ghosting in CRM',
  'expansion white space not in CRM',
  'partner deal registration conflicts',
  'UTM loss across subdomains',
  'product usage not syncing to CRM',
  'Gong calls not tied to opportunities',
  'mutual action plans ignored in stage gates',
  'legal redline cycle time blowing up close dates',
  'procurement black holes after verbal yes',
  'champion job changes mid-quarter',
  'multi-thread gaps on enterprise deals',
  'pricing exception chaos on renewals',
  'SPIF payouts conflicting with clawbacks',
  'ramp quotas on new hires',
  'parent-subsidiary duplicate accounts',
  'sandbox changes breaking production flows',
  'workflow emails firing on closed-lost opps',
  'opportunity teams with wrong credit splits',
  'forecast categories that do not match finance',
  'bookings vs billings timing mismatches',
  'usage true-ups not modeled in pipeline',
  'co-term renewals with partial downgrades',
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
  'alert on',
  'report',
  'debug',
  'document',
  'enforce',
  'prevent',
];

const OUTCOMES = [
  'pipeline coverage',
  'CAC payback',
  'magic number',
  'NRR',
  'GRR',
  'win rate',
  'sales cycle length',
  'stage conversion',
  'quota attainment',
  'forecast accuracy',
  'expansion rate',
  'churn reason integrity',
  'bookings vs billings',
  'ARR waterfall',
  'routed lead SLA',
];

const PALANTIR_TERMS = [
  'Palantir Foundry',
  'Palantir Ontology',
  'Palantir AIP',
  'Palantir pipeline digital twins',
  'Palantir-driven forecast simulations',
  'Palantir Signals for GTM alerts',
];

const DATACENTER_TERMS = [
  'data center leasing pipeline',
  'colo and hyperscaler partner-sourced pipeline',
  'GPU capacity reservation deals',
  'interconnect cross-connect sales ops',
  'multi-site colocation expansion motions',
  'power and cooling constrained enterprise deals',
  'fiber diversity SLA pipeline',
  'data center ESG and PPA reporting',
  'liquid-to-chip cooling colocation SKUs',
  'metro edge pod land-and-expand motions',
  'anchor tenant wholesale capacity blocks',
  'remote hands and smart hands attach revenue',
];

/** Tier 1 — broad, high-search PAA / definition (queue front). */
function buildDataCenterBroadTopics() {
  return [
    'what is a data center and how colocation providers sell capacity to enterprise buyers',
    'what is colocation and how is it different from hyperscale cloud in a B2B sales motion',
    'what is a hyperscaler data center deal and how RevOps should model it in CRM',
    'what is cross-connect revenue in data center and carrier-neutral facility sales',
    'what is PUE in data center operations and why enterprise procurement asks about it',
    'what is a carrier hotel in data center interconnect and partner-sourced pipeline',
    'what is wholesale data center leasing versus retail colocation for sales forecasting',
    'what is a data center interconnection (IX) and how it shows up in enterprise CRM pipeline',
    'what is power density and cooling capacity in data center capacity sales',
    'what is a build-to-suit data center contract and how RevOps tracks multi-year ramps',
    'what is edge data center colocation and how it differs from core campus deals',
    'what is a data center SLA in enterprise contracts and how renewals hit CRM',
    'what is cabinet kW pricing in colocation and how quotes flow into Salesforce',
    'what is a data center N+1 redundancy tier and how it affects deal cycle length',
    'what is a colocation master service agreement and how RevOps handles amendments',
    'what is a data center capacity reservation and how it differs from booked ARR',
    'what is a meet-me room in colocation sales and why channel partners source deals there',
    'what is a data center campus expansion motion and how multi-site opps roll up',
    'what is GPU colocation for AI workloads and how high-density deals change pipeline hygiene',
    'what is a data center broker channel and how partner registration works in CRM',
    'what is a data center lease versus license model for revenue recognition handoffs',
    'what is a data center power usage effectiveness target in RFP scoring',
    'what is a colocation MRR versus NRC split and how finance reconciles CRM bookings',
    'what is a data center remote hands services line item in expansion revenue',
    'what is a subsea or metro fiber extension in data center interconnect sales',
    'what is a data center sustainability PPA clause and how it appears in enterprise renewals',
    'what is a tenant improvement allowance in build-to-suit data center deals',
    'what is a data center vacancy rate metric and how sales leaders use it in forecasting',
    'what is a colocation burst bandwidth charge and how usage true-ups sync to CRM',
    'what is a data center operations handoff from sales to delivery in RevOps',
    'what is a multi-tenant data hall and how opportunity teams split credit in CRM',
    'what is a data center security compliance tier and how it gates enterprise close dates',
    'what is a liquid cooling rack in AI colocation and how SKU mix affects pipeline weighting',
    'what is a data center market tier-1 city strategy for territory design',
    'what is a colocation list price versus negotiated rate card in CPQ workflows',
    'what is a data center customer health score and how CS and sales share one CRM view',
    'what is a fiber cross-connect order cycle and why legal slows data center close dates',
    'what is a data center power license versus metered billing for consumption forecasting',
    'what is a wholesale anchor tenant deal in data center land-and-expand motions',
    'what is a data center RevOps stack when sales uses Salesforce and finance uses NetSuite',
    'what is a data center and why RevOps teams treat kW capacity like ARR',
    'what is a colocation RFP and how procurement scores vendor pipeline',
    'what is a data center interconnect marketplace and how partner deals register in CRM',
    'what is a data center shell versus powered shell in enterprise lease negotiations',
    'what is a data center hot aisle containment choice in facility sales conversations',
    'what is a data center dark fiber IRU and how it affects long-cycle pipeline forecasting',
    'what is a data center OPEX versus CAPEX deal structure for board-ready RevOps reporting',
  ];
}

/** Tier 2 — operational how-to (mid queue). */
function buildDataCenterMidTopics() {
  const out = [];
  const mids = [
    'track data center lease pipeline stages',
    'forecast colocation bookings versus billings timing',
    'attribute partner-sourced data center deals without double-counting',
    'model multi-site data center expansions as parent-child opportunities',
    'standardize data center RFP stages in HubSpot',
    'reconcile colocation NRC and MRC in CRM for board reporting',
    'route inbound data center broker leads across territories',
    'dedupe enterprise accounts across colo brands after acquisition',
    'score data center opportunities by kW and cabinet count',
    'run data center renewal forecasting with partial downgrades',
    'sync data center usage true-ups from billing into pipeline',
    'enforce mutual action plans on enterprise colocation deals',
    'report data center pipeline coverage by metro market',
    'manage commission splits on hyperscaler partner-sourced opps',
    'prevent stage inflation on long-cycle data center builds',
    'document economic buyer fields for colocation procurement',
    'align data center sales stages with finance revenue categories',
    'track cross-connect attach rate on colocation wins',
    'operationalize data center proof-of-concept to production handoffs',
    'audit data center discount exceptions on renewals',
    'model GPU colocation ramp deals with minimum commits',
    'forecast data center channel co-sell pipeline separately from direct',
    'standardize data center redline playbooks in CRM attachments',
    'measure data center win rate by vertical and workload type',
    'fix broken lead routing for data center event-sourced pipeline',
    'prove data center expansion white space with product usage fields',
    'run QBR pipeline reviews for multi-year data center contracts',
    'prevent sandbagging on data center consumption ramp forecasts',
    'integrate data center CPQ quotes with opportunity products',
    'track champion changes on 18-month data center procurements',
  ];
  for (let i = 0; i < mids.length; i++) {
    const m = mids[i];
    const c = CRMS[i % CRMS.length];
    const x = CONSTRAINTS[i % CONSTRAINTS.length];
    out.push(`${m} in ${c} when ${x}`);
    out.push(`${m} on ${c} during enterprise outbound when ${x}`);
  }
  return out;
}

const CHIEF_NETWORK_TERMS = [
  'CHIEF membership renewals',
  'CHIEF Core cohort launches',
  'CHIEF executive forum pipeline',
  'CHIEF private peer advisory referrals',
  "CHIEF women's leadership network sponsorship",
  'CHIEF corporate partnership deals',
  'CHIEF chapter-based community GTM',
  'CHIEF member referral loops',
  'CHIEF summit and salon event pipeline',
  'CHIEF executive introduction requests',
  'CHIEF membership expansion and upsell',
  'CHIEF B2B vendor introductions to members',
];

const REVOPS_CONSPIRACY_KEYWORDS = [
  'dark funnel myth',
  'intent data black-box narrative',
  'attribution model rigging fear',
  'board-ready forecast theater',
  'pipeline laundering accusations',
  'shadow pipeline folklore',
  'CRM field inflation conspiracy',
  'MQL vanity metric cult',
  'MEDDPICC checkbox theater',
  'lead scoring smoke-and-mirrors',
  'commit category sandbagging script',
  'vendor lock-in telemetry panic',
];

function topicKey(question) {
  return question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Skip legacy CRO-hire queue lines still in blob from earlier cadence. */
function isLegacyCroHireTopic(topic) {
  const t = String(topic || '').toLowerCase();
  return (
    /\b(chief revenue officer|fractional cro|interim cro|cro advisory)\b/.test(t) ||
    /^decide if a (fractional|interim|full-time|part-time)/.test(t) ||
    /\bhelp a .* leadership team (scope|write 30|run a chief|measure chief)/.test(t)
  );
}

function buildFringeTemplates() {
  const out = [];
  const n = MOTIONS.length * CRMS.length * CONSTRAINTS.length;
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
        if (variant === 0)
          out.push(`operationalize ${p} during ${m} on ${c} when ${x}`);
        else if (variant === 1)
          out.push(`${v} ${o} for ${m} on ${c} without another point solution when ${x}`);
        else if (variant === 2)
          out.push(`debug ${p} for ${m} RevOps teams on ${c} when ${x}`);
        else if (variant === 3)
          out.push(`prove you fixed ${p} with CRM fields after migrating to ${c} for ${m} when ${x}`);
        else
          out.push(`${v} ${p} when ${x} and leadership only reviews ${o} monthly on ${c} during ${m}`);
      }
    }
  }
  return out;
}
function buildPalantirTemplates() {
  const out = [];
  let k = 0;
  for (let pi = 0; pi < PALANTIR_TERMS.length; pi++) {
    for (let mi = 0; mi < MOTIONS.length; mi++) {
      const p = PROBLEMS[k % PROBLEMS.length];
      const x = CONSTRAINTS[(k * 3) % CONSTRAINTS.length];
      const o = OUTCOMES[(k * 5) % OUTCOMES.length];
      const c = CRMS[(k * 7) % CRMS.length];
      const term = PALANTIR_TERMS[pi];
      if (k % 3 === 0) {
        out.push(`use ${term} to ${VERBS[k % VERBS.length]} ${p} in ${c} during ${MOTIONS[mi]} when ${x}`);
      } else if (k % 3 === 1) {
        out.push(`prove ${term} improved ${o} without creating a new shadow data mart for ${MOTIONS[mi]} teams on ${c} when ${x}`);
      } else {
        out.push(`design a RevOps control tower in ${term} that catches ${p} before weekly commit calls for ${MOTIONS[mi]} with ${x}`);
      }
      k++;
    }
  }
  return out;
}

/** Tier 3 — fringe combinatorial (queue tail). */
function buildDataCenterFringeTemplates() {
  const out = [];
  let k = 0;
  for (let di = 0; di < DATACENTER_TERMS.length; di++) {
    for (let ci = 0; ci < CRMS.length; ci++) {
      const p = PROBLEMS[k % PROBLEMS.length];
      const x = CONSTRAINTS[(k * 2) % CONSTRAINTS.length];
      const o = OUTCOMES[(k * 4) % OUTCOMES.length];
      const m = MOTIONS[(k * 6) % MOTIONS.length];
      const term = DATACENTER_TERMS[di];
      if (k % 3 === 0) {
        out.push(`model ${term} in ${CRMS[ci]} so ${p} does not break ${o} when ${x}`);
      } else if (k % 3 === 1) {
        out.push(`operationalize ${term} handoffs between sales, finance, and delivery when ${x} and leadership only reviews ${o} monthly`);
      } else {
        out.push(`audit ${term} opportunity hygiene in ${CRMS[ci]} during ${m} to prevent ${p} when ${x}`);
      }
      k++;
    }
  }
  return out;
}

function buildDataCenterTemplates() {
  return buildDataCenterBroadTopics()
    .concat(buildDataCenterMidTopics())
    .concat(buildDataCenterFringeTemplates());
}

/**
 * Ordered broad → mid → fringe data-center queue (no shuffle). For owner flushes.
 */
function generateOrderedDataCenterQueue(count, seenKeys, seed = 0) {
  const tiers = [
    buildDataCenterBroadTopics(),
    buildDataCenterMidTopics(),
    buildDataCenterFringeTemplates(),
  ];
  const lines = [];
  let pass = 0;
  while (lines.length < count && pass < 5) {
    for (const pool of tiers) {
      for (let i = 0; i < pool.length && lines.length < count; i++) {
        const topic =
          pass === 0 ? pool[i] : pool[(i + seed + pass * 31) % pool.length];
        if (isLegacyCroHireTopic(topic)) continue;
        const question = toQuestion(topic);
        const key = topicKey(question);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        lines.push(topic);
      }
    }
    pass++;
  }
  return { lines, phaseUsed: 'datacenter-v1', exhausted: lines.length === 0 };
}

function buildChiefNetworkTemplates() {
  const out = [];
  let k = 0;
  for (let hi = 0; hi < CHIEF_NETWORK_TERMS.length; hi++) {
    for (let ci = 0; ci < CRMS.length; ci++) {
      for (let mi = 0; mi < MOTIONS.length; mi++) {
        const term = CHIEF_NETWORK_TERMS[hi];
        const c = CRMS[ci];
        const m = MOTIONS[mi];
        const p = PROBLEMS[k % PROBLEMS.length];
        const x = CONSTRAINTS[(k * 2) % CONSTRAINTS.length];
        const o = OUTCOMES[(k * 4) % OUTCOMES.length];
        if (k % 3 === 0) {
          out.push(
            `attribute ${term} to ${o} in ${c} during ${m} when ${p} breaks reporting and ${x}`
          );
        } else if (k % 3 === 1) {
          out.push(
            `operationalize ${term} handoffs in ${c} for ${m} RevOps teams when ${x} and leadership tracks ${o} monthly`
          );
        } else {
          out.push(
            `prove ${term} improved pipeline coverage in ${c} without double-counting member referrals when ${p} and ${x}`
          );
        }
        k++;
      }
    }
  }
  return out;
}

function buildConspiracyRevopsTemplates() {
  const out = [];
  let k = 0;
  for (let i = 0; i < REVOPS_CONSPIRACY_KEYWORDS.length; i++) {
    const kw = REVOPS_CONSPIRACY_KEYWORDS[i];
    const p = PROBLEMS[k % PROBLEMS.length];
    const x = CONSTRAINTS[(k * 2) % CONSTRAINTS.length];
    const c = CRMS[(k * 5) % CRMS.length];
    const o = OUTCOMES[(k * 7) % OUTCOMES.length];
    out.push(`separate real root causes from the ${kw} when ${p} appears in ${c} under ${x}`);
    out.push(`build an audit trail in ${c} that disproves the ${kw} around ${o} for RevOps teams with ${x}`);
    out.push(`coach executives through ${kw} claims after board review when ${p} is blamed and ${x}`);
    k++;
  }
  return out;
}

const PHASES = [
  { id: 'chief-v1', pool: buildChiefNetworkTemplates() },
  { id: 'palantir-v1', pool: buildPalantirTemplates() },
  { id: 'datacenter-v1', pool: buildDataCenterFringeTemplates().concat(buildDataCenterMidTopics()) },
  { id: 'revops-conspiracy-v1', pool: buildConspiracyRevopsTemplates() },
  { id: 'fringe-rotor-v1', pool: buildFringeTemplates() },
];

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

function nextPhaseId(currentId) {
  const idx = PHASES.findIndex((p) => p.id === currentId);
  if (idx < 0) return PHASES[0].id;
  return PHASES[(idx + 1) % PHASES.length].id;
}

/** Phase label for heartbeat — derived from topic text, not refill generator hops. */
function classifyTopicPhase(topic) {
  const t = String(topic || '').toLowerCase();
  if (/\bchief membership|\bchief core\b|\bchief executive forum|\bwomen's leadership network\b|\bchief chapter\b|\bchief summit\b/.test(t))
    return 'chief-v1';
  if (/\bpalantir|foundry|ontology\b|\baip\b|pipeline digital twin|gtm alerts/.test(t))
    return 'palantir-v1';
  if (
    /data center|colo|colocation|hyperscaler|cross-connect|cross connect|pue\b|carrier hotel|meet-me room|gpu colocation|kwh pricing/.test(
      t
    )
  )
    return 'datacenter-v1';
  if (
    /conspiracy|theater|myth|shadow pipeline|dark funnel|black-box|smoke-and-mirrors|pipeline laundering|vanity metric|checkbox theater/.test(
      t
    )
  )
    return 'revops-conspiracy-v1';
  return 'fringe-rotor-v1';
}

function generateTopicsBatch(count, seenKeys, seed = 0, phaseHint) {
  const lines = [];
  let activePhase = PHASES.find((p) => p.id === phaseHint) || PHASES[0];
  let phaseHops = 0;

  while (lines.length < count && phaseHops < PHASES.length + 2) {
    const pool = shuffle(activePhase.pool);
    let phaseAdded = 0;
    for (let i = 0; i < pool.length && lines.length < count; i++) {
      const idx = (i + seed + phaseHops * 41) % pool.length;
      const topic = pool[idx];
      if (isLegacyCroHireTopic(topic)) continue;
      const question = toQuestion(topic);
      const key = topicKey(question);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      lines.push(topic);
      phaseAdded++;
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
    exhausted: lines.length === 0,
  };
}

function generateTopics(count, seenKeys, seed = 0, phaseHint) {
  return generateTopicsBatch(count, seenKeys, seed, phaseHint).lines;
}

module.exports = {
  generateTopics,
  generateTopicsBatch,
  generateOrderedDataCenterQueue,
  nextPhaseId,
  classifyTopicPhase,
  topicKey,
  isLegacyCroHireTopic,
  toQuestion,
  PHASES: PHASES.map((p) => ({ id: p.id, size: p.pool.length })),
};
