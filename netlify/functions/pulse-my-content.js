// ════════════════════════════════════════════════════════════════════════
// pulse-my-content — passcode-based "save to my content" for visitors.
// No login. Pick 3 letters + 4 digits (e.g. KJW0514 = your initials + a
// 4-digit number), save any entries to that bucket, recall from any device
// by entering the same code.
//
// POST /.netlify/functions/pulse-my-content
//   body: { code: "KJW0514", action: "add"|"remove", id: "q1234", question: "...", tags: [...] }
//   body: { code: "KJW0514", action: "clear" }
// GET  /.netlify/functions/pulse-my-content?code=KJW0514
//   → { ok: true, code: "KJW0514", entries: [{id, question, tags, ts}] }
//
// Privacy by design: anyone who knows the code can read/write that bucket.
// 3 letters × 4 digits = 17.5M combinations × harder to guess than the old
// 4-digit scheme. Owner cutover 2026-06-04 — old 4-digit buckets are dead.
// Bucket key namespace bumped from my-content/<code>.json to
// my-content-v2/<code>.json so old 4-digit blobs are simply unreachable.
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
const MAX_PER_BUCKET = 500;  // cap entries per code to keep blob small
const MAX_Q_LEN = 320;       // truncate cached question text
// Normalize incoming code: trim + uppercase the letters. Visitors can type
// "kjw0514" and we'll treat it the same as "KJW0514".
function normalizeCode(raw) {
  return String(raw || '').trim().toUpperCase();
}

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) {
    try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; }
  }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function bucketKey(code) {
  return 'my-content-v2/' + code + '.json';
}

function sanitizeEntry(e) {
  if (!e || typeof e !== 'object') return null;
  const id = String(e.id || '').slice(0, 64);
  if (!/^[a-z0-9_-]+$/i.test(id)) return null;
  return {
    id,
    question: String(e.question || '').slice(0, MAX_Q_LEN),
    tags: Array.isArray(e.tags) ? e.tags.slice(0, 8).map(t => String(t).slice(0, 40)) : [],
    ts: Date.now(),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  const store = initStore();
  if (!store) {
    return { statusCode: 503, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'store not wired' }) };
  }

  // ── GET — list saved entries for a code ────────────────────────────
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    const code = normalizeCode(params.code);
    if (!CODE_RX.test(code)) {
      return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'code must be 3 letters + 4 digits (e.g. KJW0514)' }) };
    }
    try {
      const bucket = (await store.get(bucketKey(code), { type: 'json' })) || { code, entries: [] };
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, code, entries: bucket.entries || [] }) };
    } catch (e) {
      return { statusCode: 500, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'read failed' }) };
    }
  }

  // ── POST — add/remove/clear ────────────────────────────────────────
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'POST or GET only' };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (_e) { return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'bad json' }) }; }

  const code = normalizeCode(body.code);
  const action = String(body.action || '').toLowerCase();
  if (!CODE_RX.test(code)) {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'code must be 3 letters + 4 digits (e.g. KJW0514)' }) };
  }

  let bucket;
  try {
    bucket = (await store.get(bucketKey(code), { type: 'json' })) || { code, entries: [] };
  } catch (e) {
    bucket = { code, entries: [] };
  }
  if (!Array.isArray(bucket.entries)) bucket.entries = [];

  if (action === 'add') {
    const cleaned = sanitizeEntry(body);
    if (!cleaned) {
      return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'invalid id' }) };
    }
    // Dedup by id — if already saved, just bump ts to top
    bucket.entries = bucket.entries.filter(e => e && e.id !== cleaned.id);
    bucket.entries.unshift(cleaned);
    if (bucket.entries.length > MAX_PER_BUCKET) bucket.entries = bucket.entries.slice(0, MAX_PER_BUCKET);
  } else if (action === 'remove') {
    const id = String(body.id || '').slice(0, 64);
    bucket.entries = bucket.entries.filter(e => e && e.id !== id);
  } else if (action === 'clear') {
    bucket.entries = [];
  } else {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'action must be add|remove|clear' }) };
  }

  try {
    await store.setJSON(bucketKey(code), bucket);
  } catch (e) {
    return { statusCode: 500, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: 'write failed' }) };
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, code, total: bucket.entries.length }),
  };
};
