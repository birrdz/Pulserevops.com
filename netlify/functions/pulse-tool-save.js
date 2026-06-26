// ════════════════════════════════════════════════════════════════════════
// pulse-tool-save — cloud save/load for the free PULSE tools (dashboard
// Locker). Code = 3 letters + 4 digits (e.g. KJW2222 = initials + number).
// Saves the tool inputs/results blob produced by getCurrentProgressData()
// so a visitor can reload it from any device by entering the same code.
//
// POST /.netlify/functions/pulse-tool-save
//   body: { code:"KJW2222", data:{...}, name?:"..." }  -> { ok:true }
// GET  /.netlify/functions/pulse-tool-save?code=KJW2222
//   -> { ok:true, code, name, ts, data:{...} }  (or { ok:false, reason })
// Bucket: tool-saves/<CODE>.json   (same blob store as the library).
// ════════════════════════════════════════════════════════════════════════
let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};
const CODE_RX = /^[A-Z]{3}\d{4}$/;
const MAX_BYTES = 256 * 1024; // cap saved state

function normalizeCode(raw) { return String(raw || '').trim().toUpperCase(); }
function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}
function key(code) { return 'tool-saves/' + code + '.json'; }
const json = (sc, obj) => ({ statusCode: sc, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  const store = initStore();
  if (!store) return json(503, { ok: false, reason: 'store not wired' });

  if (event.httpMethod === 'GET') {
    const code = normalizeCode((event.queryStringParameters || {}).code);
    if (!CODE_RX.test(code)) return json(400, { ok: false, reason: 'bad code (need AAA0000)' });
    const rec = await store.get(key(code), { type: 'json' });
    if (!rec) return json(200, { ok: false, reason: 'not found', code });
    return json(200, { ok: true, code, name: rec.name || '', ts: rec.ts || 0, data: rec.data || {} });
  }

  if (event.httpMethod === 'POST') {
    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { ok: false, reason: 'bad json' }); }
    const code = normalizeCode(body.code);
    if (!CODE_RX.test(code)) return json(400, { ok: false, reason: 'bad code (need AAA0000)' });
    if (body.data == null || typeof body.data !== 'object') return json(400, { ok: false, reason: 'no data' });
    const payload = { code, name: String(body.name || '').slice(0, 80), data: body.data, ts: Date.now() };
    const sized = JSON.stringify(payload);
    if (sized.length > MAX_BYTES) return json(413, { ok: false, reason: 'save too large' });
    await store.set(key(code), sized, { metadata: { ts: payload.ts } });
    try { await require('./_stats').bump({ toolSaves: 1 }); } catch (e) {}
    return json(200, { ok: true, code, ts: payload.ts });
  }

  return json(405, { ok: false, reason: 'method' });
};
