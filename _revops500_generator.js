// Generate 500 unique long-tail RevOps questions per batch (gaps others don't answer well).
function generateBatch(batchNum) {
  const actions = [
    'audit', 'automate', 'benchmark', 'calculate', 'design', 'enforce', 'forecast',
    'govern', 'instrument', 'map', 'measure', 'model', 'prevent', 'reconcile',
    'route', 'score', 'segment', 'standardize', 'stress-test', 'triangulate',
    'validate', 'weight', 'backfill', 'dedupe', 'operationalize',
  ];
  const objects = [
    'pipeline coverage', 'forecast commit accuracy', 'MQL decay curves', 'territory carve rules',
    'commission clawbacks', 'customer health scores', 'lead-to-revenue lifecycle stages',
    'multi-touch attribution', 'usage-based expansion signals', 'champion-change risk',
    'CPQ-to-CRM sync', 'partner co-sell attribution', 'consumption revenue forecasts',
    'sandbagging detection', 'stage slip rates', 'renewal ghosting', 'PLG PQL routing',
    'SDR acceptance SLAs', 'legal redline cycle time', 'mutual action plans',
    'data dictionary fields', 'integration user permissions', 'UTM capture on subdomains',
    'post-merger stage mapping', 'RevOps headcount ratios',
  ];
  const constraints = [
    'Salesforce and HubSpot run in parallel', 'a post-merger CRM consolidation is underway',
    'the company sells both PLG and enterprise sales-led', 'pricing is consumption-based',
    'deals routinely slip past quarter-end', 'SDRs and AEs dispute lead ownership',
    'the board wants one forecast number', 'integration users break field-level security',
    'multi-currency closed-won history must stay auditable', 'only two days a week of exec coverage exist',
    'renewals are owned by CS but sold by AEs', 'marketing refuses default lifecycle stages',
    'Apollo and CRM contact sets disagree', 'dialer activity never lands in CRM',
    'free trials convert outside the CRM', 'channel partners co-sell without resell records',
    'the IPO data room needs revenue metrics', 'Series B just added a second CRM instance',
    'product telemetry and CRM disagree on activation', 'legal adds non-standard MSAs every quarter',
  ];
  const templates = [
    (a, o, c) => `How should RevOps ${a} ${o} when ${c}?`,
    (a, o, c) => `What is the board-ready way to ${a} ${o} when ${c}?`,
    (a, o, c) => `Why do most vendors fail to ${a} ${o} when ${c}?`,
    (a, o, c) => `What CRM-native playbook ${a}s ${o} when ${c}?`,
    (a, o, c) => `What metric proves RevOps successfully ${a}d ${o} when ${c}?`,
  ];

  const combos = [];
  for (let ai = 0; ai < actions.length; ai++) {
    for (let oi = 0; oi < objects.length; oi++) {
      for (let ci = 0; ci < constraints.length; ci++) {
        combos.push({ ai, oi, ci });
      }
    }
  }

  const offset = ((batchNum - 1) * 500) % combos.length;
  const questions = [];
  const seen = new Set();
  for (let n = 0; questions.length < 500 && n < combos.length * 2; n++) {
    const idx = (offset + n) % combos.length;
    const { ai, oi, ci } = combos[idx];
    const tpl = templates[(batchNum + ai + oi + ci) % templates.length];
    const q = tpl(actions[ai], objects[oi], constraints[ci]);
    if (seen.has(q)) continue;
    seen.add(q);
    questions.push(q);
  }

  while (questions.length < 500) {
    const i = questions.length + batchNum * 500;
    questions.push(
      `What RevOps question #${i} do operators ask when ${constraints[i % constraints.length]} but no vendor blog answers it honestly?`
    );
  }
  return questions.slice(0, 500);
}

module.exports = { generateBatch };

if (require.main === module) {
  const b = parseInt(process.argv[2] || '1', 10);
  const qs = generateBatch(b);
  console.log('batch', b, 'count', qs.length, 'sample', qs[0], qs[499]);
}
