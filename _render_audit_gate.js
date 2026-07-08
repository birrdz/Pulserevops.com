// Deploy / batch-speedup gate — reads _render_audit_status.json and refuses progress when blocked.
const fs = require('fs');
const { readStatus, log } = require('./_render_audit_lib');

const WD = 'C:/Users/koryj/website';

function isStale(st) {
  if (!st || !st.updatedAt) return true;
  const ageMs = Date.now() - new Date(st.updatedAt).getTime();
  // If auditors haven't run in 15 min, don't block forever (supervisor may be down).
  const maxAge = parseInt(process.env.RENDER_AUDIT_MAX_AGE_MS || String(15 * 60 * 1000), 10);
  return ageMs > maxAge;
}

function gateSnapshot() {
  const st = readStatus();
  if (isStale(st)) {
  return {
    deployBlocked: false,
    speedupBlocked: false,
    templateBlocked: false,
    stale: true,
    reason: 'audit status stale — auditors may be down',
    issues: [],
    status: st,
  };
  }
  return {
    deployBlocked: !!st.deployBlocked,
    speedupBlocked: !!st.speedupBlocked,
    templateBlocked: !!st.templateBlocked,
    stale: false,
    reason: st.reason || '',
    issues: st.issues || [],
    status: st,
  };
}

function guardDeploy() {
  const g = gateSnapshot();
  if (g.deployBlocked) {
    const msg = 'DEPLOY BLOCKED by render auditors: ' + (g.reason || g.issues.slice(0, 3).join('; '));
    log(msg, 'gate');
    const err = new Error(msg);
    err.code = 'RENDER_AUDIT_DEPLOY_BLOCKED';
    throw err;
  }
  return g;
}

function guardSpeedup(action) {
  const g = gateSnapshot();
  if (g.speedupBlocked) {
    const msg = 'SPEEDUP BLOCKED by render auditors (' + (action || 'batch') + '): ' + (g.reason || g.issues.slice(0, 3).join('; '));
    log(msg, 'gate');
    const err = new Error(msg);
    err.code = 'RENDER_AUDIT_SPEEDUP_BLOCKED';
    throw err;
  }
  return g;
}

function guardBatchProgress() {
  return guardSpeedup('batch-progress');
}

/** Non-throwing check for scripts that want to pause/wait instead of exit. */
function isBlocked() {
  const g = gateSnapshot();
  return { deploy: g.deployBlocked, speedup: g.speedupBlocked, stale: g.stale, reason: g.reason, issues: g.issues };
}

module.exports = {
  gateSnapshot,
  guardDeploy,
  guardSpeedup,
  guardBatchProgress,
  isBlocked,
  isStale,
  WD,
};
