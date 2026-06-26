// Visitor-priority lock — when a visitor submits a question via /pulse-machine,
// every background function in this directory should pause and yield the
// CPU/quota to the volume writer until the question lands in the library.
//
// Single blob key: `_visitor_priority.json` in the `pulse-machine-library`
// store. Self-clears after TTL so a stuck flag cannot freeze the engine
// forever.
//
// Usage at the top of every background/cron function:
//
//   const { isVisitorPriorityActive } = require('./lib/visitor-priority');
//   if (await isVisitorPriorityActive(store)) {
//     return { statusCode: 200, body: 'paused: visitor-priority' };
//   }

const FLAG_KEY = '_visitor_priority.json';
// Realistic budget for the autonomous answer flow (research + draft + grader
// pass + publish + IndexNow ping): ~5 min. Anything shorter under-counts on
// dense topics; anything longer makes the UI countdown feel dishonest.
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function isVisitorPriorityActive(store) {
  try {
    if (!store) return false;
    const f = await store.get(FLAG_KEY, { type: 'json' });
    if (!f || !f.active) return false;
    const ttl = (typeof f.ttl_ms === 'number' && f.ttl_ms > 0) ? f.ttl_ms : DEFAULT_TTL_MS;
    const started = f.started_at || 0;
    if (Date.now() - started > ttl) return false; // expired
    return true;
  } catch (_e) {
    return false; // never let a flag-read error break a cron run
  }
}

async function setVisitorPriority(store, vqId, ttlMs) {
  try {
    if (!store) return;
    await store.setJSON(FLAG_KEY, {
      active: true,
      vq_id: vqId || null,
      started_at: Date.now(),
      ttl_ms: ttlMs || DEFAULT_TTL_MS,
    });
  } catch (_e) {}
}

async function clearVisitorPriority(store, vqId) {
  try {
    if (!store) return;
    await store.setJSON(FLAG_KEY, {
      active: false,
      cleared_at: Date.now(),
      cleared_for: vqId || null,
    });
  } catch (_e) {}
}

module.exports = {
  FLAG_KEY,
  DEFAULT_TTL_MS,
  isVisitorPriorityActive,
  setVisitorPriority,
  clearVisitorPriority,
};
