// Build 100 deduped Palantir RevOps queue lines. Usage: node _generate_palantir100_queue.js
const fs = require('fs');
const path = require('path');
const { fetchLibrary, checkAgainst, toQuestion } = require('./_economy_post_lib');

const OUT = path.join(__dirname, '_economy_palantir100_queue.txt');
const TARGET = 100;

const products = [
  'Palantir Foundry',
  'Palantir Gotham',
  'Palantir AIP',
  'Palantir Apollo',
  'Palantir Federal Cloud',
  'Palantir MetaConstellation',
];
const crms = ['Salesforce', 'HubSpot', 'Dynamics 365', 'Pipedrive', 'Zoho CRM'];
const motions = [
  'co-sell',
  'compete against',
  'integrate',
  'displace',
  'govern data flows with',
];
const contexts = [
  'federal prime-sub contracts',
  'defense intelligence programs',
  'state and local RFPs',
  'commercial enterprise expansions',
  'partner marketplace referrals',
  'classified deployment environments',
  'multi-agency shared services deals',
  'IDIQ vehicle renewals',
];
const verbs = [
  'forecast',
  'route',
  'attribute',
  'reconcile',
  'audit',
  'score',
  'align',
  'track',
  'standardize',
  'model',
  'measure',
  'prevent',
  'qualify',
  'document',
  'govern',
];
const objects = [
  'pipeline coverage',
  'commission splits',
  'partner registration conflicts',
  'MEDDPICC field completion',
  'loss reason capture',
  'territory overlap',
  'POC stage duration',
  'bookings versus billings timing',
  'multi-thread depth',
  'renewal risk signals',
  'forecast commit rules',
  'next-step hygiene',
  'campaign influence',
  'quota credit',
  'win-loss integrity',
];

const templates = [];
for (const product of products) {
  for (const crm of crms) {
    for (const ctx of contexts) {
      for (let i = 0; i < 3; i++) {
        const v = verbs[(i + product.length + crm.length) % verbs.length];
        const o = objects[(i + ctx.length) % objects.length];
        templates.push(
          `${v} ${o} when ${product} is the buyer-mandated platform in ${ctx} using ${crm}`
        );
      }
    }
  }
}
for (const motion of motions) {
  for (const product of products) {
    for (const crm of crms) {
      templates.push(
        `run RevOps when you ${motion} ${product} on late-stage ${crm} opportunities`
      );
      templates.push(
        `build forecast guardrails when you ${motion} ${product} during federal ${crm} evaluations`
      );
    }
  }
}

// Extra RevOps-specific Palantir angles
const extras = [
  'structure prime-sub RevOps when Palantir holds the platform award and you sell the application layer',
  'run weekly forecast calls when Palantir AIP pilots block stage advancement for 60-plus days',
  'map economic buyer engagement when decisions only surface inside Palantir Gotham workflows',
  'prevent SDR and Palantir field team duplicate outreach on the same federal agency account',
  'sync Palantir Foundry ontology usage signals into HubSpot for expansion plays',
  'design CRM fields that stay compliant when buyers prohibit data outside Palantir environments',
  'attribute co-sell pipeline when Palantir Federal Cloud is already the incumbent analytics stack',
  'score competitive risk when Palantir Foundry expands into your software category',
  'standardize RFP artifacts when Gotham integration is a mandatory evaluation criterion',
  'reconcile sub revenue recognition when Palantir prime contract signature timing slips a quarter',
  'train AEs on Palantir co-sell motions without violating partner registration exclusivity',
  'measure displacement win rate when Palantir is listed as the incumbent in enterprise RFPs',
  'operationalize Palantir partner marketplace lead routing without breaking attribution in Salesforce',
  'weight forecast categories when Palantir-led evaluations extend legal review past 45 days',
  'log deal intelligence in Salesforce when Foundry is the system of record for account planning',
];

async function main() {
  const entries = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));
  const seen = new Set();
  const lines = [];

  const pool = [...extras, ...templates];
  for (let pass = 0; pass < 5 && lines.length < TARGET; pass++) {
    for (let i = 0; i < pool.length && lines.length < TARGET; i++) {
      const topic = pool[(i + pass * 17) % pool.length];
      const question = toQuestion(topic);
      const key = question.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const dup = checkAgainst(entries, question);
      if (!dup.clear) continue;
      lines.push(topic);
      entries.push({ id: `pending-${lines.length}`, question });
    }
  }

  if (lines.length < TARGET) {
    console.error('Only generated', lines.length, 'unique topics; need', TARGET);
    process.exit(1);
  }

  const header = `# Palantir economy queue — ${TARGET} topics — ${new Date().toISOString().slice(0, 10)}\n`;
  fs.writeFileSync(OUT, header + lines.join('\n') + '\n', 'utf8');
  console.log('Wrote', lines.length, 'topics to', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
