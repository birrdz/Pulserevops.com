// Sequential Image LAW product-card backfills (key prefixes first).
// Usage: node _img_backfill_batch.js
const { spawnSync } = require('child_process');
const fs = require('fs');

const PAIRS = [
  ['ra', '/revenue-architecture'],
  ['gp', '/go-to-market-playbooks'],
  ['bs', '/sales-book-summaries'],
  ['st', '/sales-trainings'],
  ['hf', '/highschool-football-recruiting'],
  ['q', '/knowledge'],
  ['er', '/electronic-reviews'],
  ['ca', '/cars'],
  ['tl', '/tools'],
  ['sc', '/schools'],
  ['bt', '/boats'],
  ['ik', '/industry-kpis'],
  ['dn', '/dining'],
  ['ai', '/ai-infrastructure'],
  ['cl', '/clubs'],
  ['nl', '/nightlife'],
  ['ga', '/gatherings'],
  ['gm', '/gaming'],
  ['ev', '/events'],
  ['wl', '/wellness'],
  ['tn', '/towns'],
];

const results = [];
const started = new Date().toISOString();

for (const [pre, path] of PAIRS) {
  console.log(`\n===== ${new Date().toISOString()} START ${pre} ${path} =====`);
  const t0 = Date.now();
  const r = spawnSync('node', ['_img_backfill_any.js', pre, path], {
    cwd: 'C:/Users/koryj/website',
    stdio: 'inherit',
    env: process.env,
  });
  const elapsed = Math.round((Date.now() - t0) / 1000);
  let summary = { prefix: pre, path, exit: r.status, elapsedSec: elapsed };
  try {
    summary = { ...summary, ...JSON.parse(fs.readFileSync(`C:/Users/koryj/website/_${pre}_ddg_result.json`, 'utf8')) };
  } catch (e) {}
  results.push(summary);
  fs.writeFileSync('C:/Users/koryj/website/_img_backfill_batch_progress.json', JSON.stringify({ started, results }, null, 1));
  if (r.status !== 0) console.error(`WARN ${pre} exited ${r.status}`);
}

fs.writeFileSync('C:/Users/koryj/website/_img_backfill_batch_result.json', JSON.stringify({ started, finished: new Date().toISOString(), results }, null, 1));
console.log('\nBATCH BACKFILLS COMPLETE');
console.log(JSON.stringify(results, null, 2));
