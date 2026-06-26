// pulse-heartbeat-cron — Netlify SCHEDULED function (every 15 minutes) that
// fires the standing heartbeat status email. The actual logic lives in
// pulse-heartbeat-notify-background.js; a -background function can't also be
// scheduled, so this thin scheduled wrapper invokes its handler on a cron.
// Deploys with `--no-build` (schedule is read from exports.config at function
// deploy time, not the build plugin).
const heartbeat = require('./pulse-heartbeat-notify-background');

exports.handler = async (event, context) => {
  try {
    if (heartbeat && typeof heartbeat.handler === 'function') {
      return await heartbeat.handler(event || {}, context || {});
    }
  } catch (e) {
    console.log('heartbeat-cron error:', e && e.message);
  }
  return { statusCode: 200, body: 'heartbeat tick' };
};

// every 15 minutes, always-on $0 safety-net status email
exports.config = { schedule: '*/15 * * * *' };
