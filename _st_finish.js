// Post-batch: hub SEO sync, blob SEO stamp, SEO verify, deploy.
const { execSync } = require('child_process');
const fs = require('fs');

const steps = [
  ['node _st_seo_sync_hub.js', 'hub SEO sync'],
  ['node _st_seo_optimize.js', 'blob SEO optimize st0499+'],
  ['node _seo_pillar_verify.js', 'pillar SEO spot-check (st hub + sample)'],
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
    'C:/Users/koryj/website/_st_finish_report.json',
    JSON.stringify({ finished: new Date().toISOString(), steps: steps.map((s) => s[1]) }, null, 2)
  );
})();
