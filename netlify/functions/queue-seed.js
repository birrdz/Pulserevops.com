// ════════════════════════════════════════════════════════════════════════
// queue-seed — owner-only endpoint to push priority questions to the
// research queue. Used to steer The Machine toward a topic cluster
// (e.g. CRM) without waiting for the natural snowball drift.
//
// Auth: ?key=pulsemachine
// POST { questions: ["...", "..."], priority?: 100 }
// → prepends to queue.json with high priority so the hourly cron picks
//   them next.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const ADMIN_KEY = 'pulsemachine';

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  if (params.key !== ADMIN_KEY) {
    return { statusCode: 403, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'forbidden' }) };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'POST only' }) };
  }

  let questions = [];
  let priority = 100;
  let source = 'manual-seed';
  try {
    const body = JSON.parse(event.body || '{}');
    questions = Array.isArray(body.questions) ? body.questions : [];
    if (typeof body.priority === 'number') priority = body.priority;
    if (typeof body.source === 'string') source = body.source;
  } catch (e) {}

  questions = questions
    .map(q => String(q || '').trim())
    .filter(q => q.length > 12 && q.length < 380);

  if (!questions.length) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'no valid questions' }) };
  }

  const store = initStore();
  if (!store) return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, err: 'no store' }) };

  // Read existing queue, dedupe against existing items by simple normalization
  const queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
  const existing = new Set((queue.items || []).map(it => String(it.q || '').toLowerCase().replace(/\s+/g, ' ').trim()));

  const ts = Date.now();
  const fresh = questions
    .filter(q => !existing.has(q.toLowerCase().replace(/\s+/g, ' ').trim()))
    .map((q, i) => ({ q, priority, source, parent_id: null, ts: ts + i }));

  queue.items = [...fresh, ...(queue.items || [])];

  await store.setJSON('queue.json', queue);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, added: fresh.length, skipped_dupes: questions.length - fresh.length, total: queue.items.length, priority }),
  };
};
