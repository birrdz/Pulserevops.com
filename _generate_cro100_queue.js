// Build 100 deduped CRO / fractional CRO hire-help queue lines.
// Usage: node _generate_cro100_queue.js
const fs = require('fs');
const path = require('path');
const { fetchLibrary, checkAgainst, toQuestion } = require('./_economy_post_lib');

const OUT = path.join(__dirname, '_economy_cro100_queue.txt');
const TARGET = 100;

const stages = [
  'Series A',
  'Series B',
  'Series C',
  'post-merger',
  'PE-backed',
  'bootstrapped profitable',
  'founder-led sales',
  'first enterprise motion',
  'usage-based pricing pivot',
  'channel-heavy GTM',
];
const situations = [
  'missed two quarters of quota',
  'pipeline coverage below 2x',
  'board wants a revenue turnaround',
  'founder wants to step back from selling',
  'RevOps exists but no revenue leader',
  'VP Sales is strong but no GTM strategy owner',
  'preparing for fundraise in six months',
  'international expansion next year',
  'sales and marketing are misaligned',
  'churn is rising on enterprise accounts',
];
const hireTypes = [
  'fractional CRO',
  'interim CRO',
  'full-time CRO',
  'fractional Chief Revenue Officer',
  'part-time revenue leader',
  'CRO advisory before a full-time hire',
];
const intents = [
  'evaluate whether you need one',
  'compare fractional vs full-time CRO cost',
  'write a CRO job description that attracts operators',
  'run a CRO interview process without executive search fees',
  'onboard a fractional CRO in the first 30 days',
  'set OKRs a fractional CRO should hit by day 90',
  'transition from fractional CRO to full-time hire',
  'fire a underperforming fractional CRO cleanly',
  'find vetted fractional CROs for B2B SaaS',
  'know what CRO firms actually deliver vs pitch decks',
];
const extras = [
  'know when to hire a fractional CRO instead of another VP Sales',
  'budget for fractional CRO monthly retainer at mid-market ARR',
  'structure fractional CRO scope so board reporting stays honest',
  'hire fractional revenue help when you cannot afford full-time CRO OTE',
  'use a fractional CRO during a CEO transition without losing forecast discipline',
  'pick between fractional CRO syndicates and boutique executive search',
  'get board approval for fractional CRO spend before signing',
  'measure ROI of a fractional CRO engagement in the first quarter',
  'avoid duplicate leadership when CRO and CMO both claim pipeline',
  'ramp a new full-time CRO after a successful fractional phase',
  'staff RevOps under a fractional CRO vs before the hire',
  'run a CRO search when your last VP Sales failed at enterprise',
  'contract fractional CRO hours across US time zones for global deals',
  'define exit criteria for ending a fractional CRO engagement',
  'align comp plan design with a fractional CRO before Q1 starts',
];

const templates = [];
for (const stage of stages) {
  for (const sit of situations) {
    for (const hire of hireTypes) {
      templates.push(
        `decide if a ${hire} is right for a ${stage} company when ${sit}`
      );
    }
  }
}
for (const stage of stages) {
  for (const intent of intents) {
    templates.push(`help a ${stage} leadership team ${intent}`);
  }
}

async function main() {
  const entries = (await fetchLibrary()).filter((e) => /^q\d+$/i.test(e.id));
  const seen = new Set();
  const lines = [];
  const pool = [...extras, ...templates];

  for (let pass = 0; pass < 8 && lines.length < TARGET; pass++) {
    for (let i = 0; i < pool.length && lines.length < TARGET; i++) {
      const topic = pool[(i + pass * 23) % pool.length];
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

  const header = `# CRO / fractional CRO hire-help queue — ${TARGET} topics — ${new Date().toISOString().slice(0, 10)}\n# Intent: operators searching to hire fractional or full-time CRO help (CRO Syndicate funnel)\n`;
  fs.writeFileSync(OUT, header + lines.join('\n') + '\n', 'utf8');
  console.log('Wrote', lines.length, 'topics to', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
