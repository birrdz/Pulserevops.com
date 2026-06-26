// ════════════════════════════════════════════════════════════════════════
// pulse-cron-log — receive cron-tick summaries from the Claude-Code cron
// rotation and persist them to the `_cron_events.json` blob so the
// Updates panel on /knowledge can show them in the live activity feed.
//
// POST /.netlify/functions/pulse-cron-log
//   body: { key, ts, task, tick, summary, deploy_url? }
//
// Each tick adds one event; log capped at the most recent 600 entries.
// Read by pulse-activity-feed.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const KEY = 'pulsemachine-writer-2026';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_e) { return { statusCode: 400, headers: CORS, body: 'bad json' }; }
  if (body.key !== KEY) return { statusCode: 401, headers: CORS, body: 'bad key' };

  // Batch-mode (used for backfill) — `events: [...]` skips the single-event
  // validation. Otherwise expect a single tick payload.
  let events;
  if (Array.isArray(body.events) && body.events.length) {
    events = body.events.slice(0, 200).map(e => ({
      ts: typeof e.ts === 'number' ? e.ts : Date.now(),
      task: String(e.task || '').slice(0, 32),
      tick: e.tick != null ? Number(e.tick) : null,
      summary: String(e.summary || '').slice(0, 800),
      deploy_url: e.deploy_url ? String(e.deploy_url).slice(0, 400) : null,
      ids: Array.isArray(e.ids) ? e.ids.slice(0, 8).map(String) : [],
    })).filter(e => e.task && e.summary);
    if (!events.length) return { statusCode: 400, headers: CORS, body: 'events array empty after validation' };
  } else {
    const ts      = typeof body.ts === 'number' ? body.ts : Date.now();
    const task    = String(body.task || '').slice(0, 32);
    const tick    = body.tick != null ? Number(body.tick) : null;
    const summary = String(body.summary || '').slice(0, 800);
    const deployUrl = body.deploy_url ? String(body.deploy_url).slice(0, 400) : null;
    const ids = Array.isArray(body.ids) ? body.ids.slice(0, 8).map(String) : [];
    if (!task || !summary) return { statusCode: 400, headers: CORS, body: 'task + summary required' };
    events = [{ ts, task, tick, summary, deploy_url: deployUrl, ids }];
  }

  const store = initStore();
  if (!store) return { statusCode: 503, headers: CORS, body: 'no store' };

  try {
    const log = (await store.get('_cron_events.json', { type: 'json' })) || { events: [] };
    // Append, dedupe by (ts+task+summary), trim to 600.
    const seen = new Set((log.events || []).map(e => e.ts + '|' + e.task + '|' + (e.summary || '').slice(0, 80)));
    events.forEach(ev => {
      const k = ev.ts + '|' + ev.task + '|' + (ev.summary || '').slice(0, 80);
      if (!seen.has(k)) { log.events.push(ev); seen.add(k); }
    });
    log.events.sort((a, b) => a.ts - b.ts);
    if (log.events.length > 600) log.events = log.events.slice(-600);
    await store.setJSON('_cron_events.json', log);
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, total: log.events.length, added: events.length }),
    };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: 'write err: ' + (e && e.message) };
  }
};
