// pulse-cleanup-status — exposes the cleanup-pass progress blob to the
// library page's top progress bar. The cleanup loop writes
// _cleanup_progress.json into the pulse-machine-library store; this
// function reads it and returns { active, done, total, current, last_ms }.

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

exports.handler = async () => {
  const store = initStore();
  if (!store) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ ok: true, active: false }) };
  }
  let p = null;
  try { p = await store.get('_cleanup_progress.json', { type: 'json' }); } catch (_e) { p = null; }
  if (!p) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ ok: true, active: false }) };
  }
  // Treat as inactive if last update is older than 10 minutes — the worker
  // probably crashed; hide the bar so it doesn't sit at 47% forever.
  const stale = (Date.now() - (p.last_ms || 0)) > 10 * 60 * 1000;
  const active = !stale && (p.done || 0) < (p.total || 1);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({
      ok: true,
      active: active || ((p.done || 0) < (p.total || 1) && !stale),
      done: p.done || 0,
      total: p.total || 0,
      current: p.current || null,
      last_ms: p.last_ms || 0,
      started_ms: p.started_ms || 0,
    }),
  };
};
