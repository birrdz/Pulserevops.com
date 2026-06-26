// ═════════════════════════════════════════════════════════════════════════════
// VISIT ALERT — DISABLED 2026-06-17.
// This was the original passive, page-load visitor emailer (one email per IP
// per day on every landing). It has been REPLACED by the Human-Interaction
// Gate: client /js/human-gate.js -> function /visitor-alert.js, which only
// emails on a VERIFIED human interaction (real click >2s after load, mouse
// movement, honeypot-filtered, bot-UA filtered, one email per visitor/day).
//
// This stub now does nothing and sends no email, so the old "every visitor"
// alerts stop immediately even if a cached page still pings this endpoint.
// ═════════════════════════════════════════════════════════════════════════════
exports.handler = async () => ({
  statusCode: 204,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  },
  body: '',
});
