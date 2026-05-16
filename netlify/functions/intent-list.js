// ════════════════════════════════════════════════════════════════════════
// intent-list — owner-only read endpoint for the intent log.
// Auth: ?key=pulsemachine (same shared secret as /admin)
//
// Returns: { ok, total_today, total_week, top_companies, recent }
//   recent: last N hits with company / domain / city / path / time
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const ADMIN_KEY = 'pulsemachine';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-intent', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-intent'); } catch (e) { return null; }
}

function dayKey(d) { return (d || new Date()).toISOString().slice(0, 10); }

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  if (params.key !== ADMIN_KEY) {
    return { statusCode: 403, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'forbidden' }) };
  }

  const store = initStore();
  if (!store) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, total_today: 0, total_week: 0, top_companies: [], recent: [], note: 'Blob store unavailable' }) };
  }

  const limit = Math.min(parseInt(params.limit, 10) || 100, 500);
  const today = dayKey();

  // Build set of last 7 day-prefixes
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(dayKey(new Date(Date.now() - i * 86400000)));
  }

  // List blobs by day-prefix; collect keys, sort by ts desc
  const allKeys = [];
  for (const d of days) {
    try {
      const list = await store.list({ prefix: d + '/' });
      (list.blobs || []).forEach(b => allKeys.push(b.key));
    } catch (e) {}
  }
  // Newer keys sort lexically later (timestamps in ts36 form), so reverse
  allKeys.sort().reverse();

  // Pull the most-recent N records in parallel
  const sliceKeys = allKeys.slice(0, limit);
  const records = await Promise.all(
    sliceKeys.map(k => store.get(k, { type: 'json' }).catch(() => null))
  );
  const recent = records.filter(Boolean);

  // Stats
  const total_week = allKeys.length;
  const total_today = allKeys.filter(k => k.startsWith(today + '/')).length;

  // Top companies (last 7 days)
  const companyCount = {};
  recent.forEach(r => {
    if (r && r.company) {
      companyCount[r.company] = (companyCount[r.company] || 0) + 1;
    }
  });
  const top_companies = Object.entries(companyCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ ok: true, total_today, total_week, top_companies, recent }),
  };
};
