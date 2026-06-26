// Scan library index and queue Q&A entries that need a review mirror.
// Usage:
//   node _mirror_reviews_build.js
//   node _mirror_reviews_build.js --audit-only
const fs = require('fs');
const path = require('path');
const { scanMirrorQueue } = require('./_mirror_reviews_lib');

const OUT = path.join(__dirname, '_mirror_reviews_queue.json');
const AUDIT_ONLY = process.argv.includes('--audit-only');

(async () => {
  const report = await scanMirrorQueue();
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.counts, null, 2));
  if (report.harmfulTitleDupes.length) {
    console.log('\nAudit — title ends with "reviews" but not rv mirror (sample):');
    for (const row of report.harmfulTitleDupes.slice(0, 8)) {
      console.log(`  ${row.id}: ${row.question}`);
    }
  }
  if (!AUDIT_ONLY) {
    console.log(`\nWrote ${report.counts.eligible} eligible → ${OUT}`);
    console.log('Run: node _mirror_reviews_run.js --limit 3   (test)');
    console.log('Run: node _mirror_reviews_run.js             (full batch)');
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
