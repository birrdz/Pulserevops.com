// Logs an SEO/index tick event so the loop can track its position in the
// W-P-P-I-I-P 6-slot cycle. Called by the wake-loop after pinging IndexNow.
// POST { key } → appends {ts, type:"seo"} to _seo_events.json (capped at 200 events).

const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'POST only' };

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  if (body.key !== KEY) return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad key' }) };

  const tok = process.env.BLOBS_PAT;
  let store;
  try { store = getStore('pulse-machine-library'); }
  catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }

  const ts = Date.now();
  const evs = (await store.get('_seo_events.json', { type: 'json' })) || { events: [] };
  evs.events.push({ ts, type: 'seo' });
  if (evs.events.length > 200) evs.events = evs.events.slice(-200);
  await store.setJSON('_seo_events.json', evs);

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, ts, count: evs.events.length }),
  };
};
