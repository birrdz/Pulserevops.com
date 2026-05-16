// ════════════════════════════════════════════════════════════════════════
// staging-update — owner-only endpoint to update pillar-draft status
// (e.g., mark drafts as published or killed). Auth: ?key=pulsemachine
//
// POST { ids: ["mojrXXX", "mojrYYY"], status: "killed" | "published" }
// → updates the matching entries in _staging_index.json
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const ADMIN_KEY = 'pulsemachine';
const VALID_STATUS = new Set(['pending', 'published', 'killed', 'reviewing']);

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  if (params.key !== ADMIN_KEY) return { statusCode: 403, body: JSON.stringify({ ok: false, err: 'forbidden' }) };
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ ok: false, err: 'POST only' }) };

  let ids = [];
  let status = '';
  let target = 'staging';
  try {
    const body = JSON.parse(event.body || '{}');
    ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
    status = String(body.status || '').toLowerCase();
    if (body.target === 'audits' || body.target === 'staging') target = body.target;
  } catch (e) {}

  // Auto-route based on id prefix when target not explicit
  if (target === 'staging' && ids.length && ids[0].startsWith('audit-')) target = 'audits';

  if (!ids.length || !VALID_STATUS.has(status)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, err: 'need ids[] + valid status (pending|published|killed|reviewing)' }) };
  }

  const store = initStore();
  if (!store) return { statusCode: 500, body: JSON.stringify({ ok: false, err: 'no store' }) };

  const indexKey = target === 'audits' ? '_audits_index.json' : '_staging_index.json';
  const listKey = target === 'audits' ? 'audits' : 'drafts';

  const idx = (await store.get(indexKey, { type: 'json' })) || { [listKey]: [] };
  const idSet = new Set(ids);
  let updated = 0;
  idx[listKey] = (idx[listKey] || []).map(d => {
    if (d && idSet.has(d.id)) {
      updated++;
      return { ...d, status, status_ts: Date.now() };
    }
    return d;
  });

  await store.setJSON(indexKey, idx);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, updated, status, target, ids }),
  };
};
