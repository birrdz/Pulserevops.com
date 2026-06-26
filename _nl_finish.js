// Post-batch: hub SEO sync, blob SEO stamp, IndexNow batch, SEO verify sample, deploy.
const { execSync } = require('child_process');
const fs = require('fs');

const steps = [
  ['node _nl_seo_sync_hub.js', 'hub SEO sync'],
  ['node _nl_seo_optimize.js --from nl0101', 'blob SEO optimize nl0101+'],
  ['node _verify_seo_batch.js nl0101 nl0400', 'SEO verify range'],
];

(async () => {
  for (const [cmd, label] of steps) {
    console.log('\n===', label, '===');
    try {
      execSync(cmd, { cwd: 'C:/Users/koryj/website', stdio: 'inherit' });
    } catch (e) {
      console.error('WARN', label, e.message);
    }
  }
  console.log('\n=== deploy (if site files changed) ===');
  try {
    execSync('powershell -NoProfile -ExecutionPolicy Bypass -File scripts/nightly-deploy.ps1', {
      cwd: 'C:/Users/koryj/website',
      stdio: 'inherit',
    });
  } catch (e) {
    console.error('deploy:', e.message);
  }
  fs.writeFileSync(
    'C:/Users/koryj/website/_nl_finish_report.json',
    JSON.stringify({ finished: new Date().toISOString(), steps: steps.map((s) => s[1]) }, null, 2)
  );
})();
