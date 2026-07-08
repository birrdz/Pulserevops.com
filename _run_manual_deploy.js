// one-shot: run the SAFE deploy (pause writers → draft → verify → promote via restore API → resume).
// Reuses doDeploy() from _all_flux_daily_deploy.js so there is exactly one deploy code path.
const { doDeploy } = require('./_all_flux_daily_deploy');
doDeploy()
  .then(() => { console.log('[manual-deploy] doDeploy resolved'); process.exit(0); })
  .catch((e) => { console.log('[manual-deploy] FATAL', e && e.message); process.exit(1); });
