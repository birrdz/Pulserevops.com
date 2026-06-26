// ════════════════════════════════════════════════════════════════════════
// pulse-activity-feed — unified "what The Machine has been doing today"
// timeline. Combines polish events (granular ladder ticks), SEO/IndexNow
// pings, and entry creation events into a single newest-first feed.
//
// GET /.netlify/functions/pulse-activity-feed
//   ?day=today       (default — events since local midnight)
//   ?day=24h         (last 24 hours, rolling)
//   ?day=7d          (last 7 days)
//   ?limit=N         (cap, default 500, max 2000)
//
// Powers the "Updates" sheet on /knowledge.
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-store',
};

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function routePrefix(entry) {
  if (!entry) return '/knowledge/';
  if (Array.isArray(entry.tags) && entry.tags.includes('sales-training')) return '/sales-trainings/';
  if (/^st\d+$/i.test(entry.id || '')) return '/sales-trainings/';
  return '/knowledge/';
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  const store = initStore();
  if (!store) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'no store' }) };
  }

  const params = event.queryStringParameters || {};
  const limit  = Math.max(10, Math.min(2000, parseInt(params.limit, 10) || 500));

  // Cutoff: today (since 00:00 UTC), 24h rolling, or 7d rolling.
  const now = Date.now();
  let cutoff;
  if (params.day === '7d') cutoff = now - 7 * 86400000;
  else if (params.day === '24h') cutoff = now - 86400000;
  else { const d = new Date(); d.setUTCHours(0,0,0,0); cutoff = d.getTime(); }

  let idx = null, polishEvs = null, seoEvs = null, cronEvs = null;
  try { idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] }; } catch (_e) {}
  try { polishEvs = (await store.get('_polish_events.json', { type: 'json' })) || { events: [] }; } catch (_e) {}
  try { seoEvs = (await store.get('_seo_events.json', { type: 'json' })) || { events: [] }; } catch (_e) {}
  try { cronEvs = (await store.get('_cron_events.json', { type: 'json' })) || { events: [] }; } catch (_e) {}

  const entries = (idx && idx.entries) || [];
  const byId = {};
  entries.forEach(e => { if (e && e.id) byId[e.id] = e; });

  const events = [];

  // ── Polish events — every 5→6, 6→7, ... ladder step.
  (polishEvs.events || []).forEach(ev => {
    if (!ev || !ev.ts || ev.ts < cutoff) return;
    const e = byId[ev.id];
    const prefix = routePrefix(e);
    const isTen = ev.to === 10;
    events.push({
      ts: ev.ts,
      type: isTen ? 'verified' : 'polish',
      id: ev.id,
      url: prefix + ev.id,
      title: (e && e.question) || ev.id,
      from: ev.from,
      to: ev.to,
      label: isTen ? 'Polished to 10/10 ✓' : `Polished ${ev.from}/10 → ${ev.to}/10`,
    });
  });

  // ── New-entry creation — derived from _index.json.ts.
  entries.forEach(e => {
    if (!e || !e.ts || e.ts < cutoff) return;
    const prefix = routePrefix(e);
    const isTraining = prefix === '/sales-trainings/';
    events.push({
      ts: e.ts,
      type: isTraining ? 'training-created' : 'created',
      id: e.id,
      url: prefix + e.id,
      title: e.question || e.id,
      label: isTraining ? 'Published new sales training' : 'Published new library entry',
    });
  });

  // ── Cron-tick events — every 5-min site-improvement tick (Library / CRM /
  // War Room / Add New / Polish / Sales Training / Live Map). Surfaces UX
  // work and deploys that don't show up in polish/index blob events.
  const TASK_LABEL = {
    library: 'Library UX deploy',
    crm: 'CRM UX deploy',
    warroom: 'War Room UX deploy',
    livemap: 'Live Map deploy',
    addnew: 'Spawned new entry author',
    polish: 'Spawned 3 polish rewrites',
    salestraining: 'Spawned new sales training',
  };
  (cronEvs.events || []).forEach(ev => {
    if (!ev || !ev.ts || ev.ts < cutoff) return;
    const label = TASK_LABEL[ev.task] || ev.task.toUpperCase();
    events.push({
      ts: ev.ts,
      type: 'cron-' + ev.task,
      id: ev.tick != null ? ('t' + ev.tick) : '',
      url: ev.deploy_url || '',
      title: ev.summary || label,
      label: label,
      task: ev.task,
      tick: ev.tick,
      ids: ev.ids || [],
    });
  });

  // ── SEO / IndexNow events.
  (seoEvs.events || []).forEach(ev => {
    if (!ev || !ev.ts || ev.ts < cutoff) return;
    const e = ev.id ? byId[ev.id] : null;
    const prefix = e ? routePrefix(e) : '/knowledge/';
    events.push({
      ts: ev.ts,
      type: 'index',
      id: ev.id || '',
      url: ev.id ? prefix + ev.id : '',
      title: (e && e.question) || ev.id || 'IndexNow batch',
      label: ev.id ? 'Pinged search engines' : 'IndexNow batch push',
    });
  });

  // Newest first, cap at limit.
  events.sort((a, b) => b.ts - a.ts);
  const trimmed = events.slice(0, limit);

  // Rollups for the summary line.
  const counts = {
    total: trimmed.length,
    polish: trimmed.filter(e => e.type === 'polish' || e.type === 'verified').length,
    verified: trimmed.filter(e => e.type === 'verified').length,
    created: trimmed.filter(e => e.type === 'created' || e.type === 'training-created').length,
    index: trimmed.filter(e => e.type === 'index').length,
    cron: trimmed.filter(e => e.type && e.type.indexOf('cron-') === 0).length,
  };

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      now,
      cutoff,
      day: params.day || 'today',
      library_total: entries.length,
      counts,
      events: trimmed,
    }),
  };
};
