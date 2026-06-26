// Targeted IndexNow ping — submits ONE specific library entry URL to
// Bing/Yandex/Seznam. Used by the wake-loop INDEX phase so the action is
// visibly tied to the entry currently being polished, not a generic batch.
//
// POST { key, id } → pings public URL for q#### | st#### | ik####

const { getStore } = require('@netlify/blobs');
const { pingIndexNowEntry } = require('./lib/indexnow-ping-entry');

const SHARED_KEY = 'pulsemachine-writer-2026';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function getStoreSafe() {
  const tok = process.env.BLOBS_PAT;
  try {
    return getStore('pulse-machine-library');
  } catch {
    return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'POST only' };

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_) {}
  if (body.key !== SHARED_KEY)
    return {
      statusCode: 401,
      headers: corsHeaders(),
      body: JSON.stringify({ ok: false, reason: 'bad key' }),
    };
  const id = body.id;
  if (!id || !(/^(q|st|ik|tk|gb|bs|er|ra|gp|fr|ca|tn|sc|nl|dn|bt|mv|wl|dr|tv|rs|es|cl|lv|ev|sy|ga|gm|sk|sp|tl|cg|co|ai|bo|cd|aq|hf)\d+$/i.test(id) || /^vq_/i.test(id)))
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ ok: false, reason: 'bad id (must be q|st|ik|tk|gb|bs|er|ra|gp|fr|ca|tn|sc|nl|dn|bt|mv|wl|dr|tv|rs|es|cl|lv|ev|sy|ga|gm|sk|tl+digits or vq_*)' }),
    };

  const store = getStoreSafe();
  const result = await pingIndexNowEntry(id, store);

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  };
};
