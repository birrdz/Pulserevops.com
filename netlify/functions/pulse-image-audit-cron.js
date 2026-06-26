// pulse-image-audit-cron — Netlify SCHEDULED function (every 20 min) that runs
// the read-only image AUDITOR. The auditor logic lives in
// pulse-image-audit-background.js (a -background fn can't also be scheduled),
// so this thin scheduled wrapper invokes its handler on a cron. It only reads
// the library index and writes the small _img_audit_progress.json blob (NOT
// _index.json) — safe to run continuously alongside content work.
// Deploys with `--no-build` (schedule read from exports.config at fn deploy).
const auditor = require('./pulse-image-audit-background');

exports.handler = async (event, context) => {
  try {
    if (auditor && typeof auditor.handler === 'function') {
      return await auditor.handler(event || {}, context || {});
    }
  } catch (e) {
    console.log('image-audit-cron error:', e && e.message);
  }
  return { statusCode: 200, body: 'image-audit tick' };
};

// every 20 minutes — keep the missing-image audit fresh ($0, read-only)
exports.config = { schedule: '*/20 * * * *' };
