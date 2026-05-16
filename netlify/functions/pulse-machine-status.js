// pulse-machine-status — sync polling endpoint for the async/background job.
// Client polls GET /.netlify/functions/pulse-machine-status?id=<request_id>
// every ~1.5s until { ready: true, reply, sources } comes back.
//
// Background writer: pulse-machine-async-background.js
// Triggering caller: pulse-machine.js (on cache miss)
let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function initBlob(name) {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try { return getStore(name); }
  catch (e1) { if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e2) { return null; } } return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  const id = (event.queryStringParameters && event.queryStringParameters.id) || '';
  if (!id || !/^[a-z0-9_-]{6,64}$/i.test(id)) {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ready: false, error: 'bad id' }) };
  }

  const store = initBlob('pulse-machine-async');
  if (!store) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ready: false, status: 'no-store' }) };
  }

  let rec = null;
  try { rec = await store.get(id + '.json', { type: 'json' }); } catch (e) {}

  if (!rec) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ready: false, status: 'pending' }) };
  }

  if (rec.status === 'running') {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ready: false, status: 'running', started_at: rec.started_at }) };
  }

  if (rec.status === 'error') {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ready: true, error: true, reply: 'The Machine fell silent. Try rephrasing.', reason: rec.reason || 'unknown' }),
    };
  }

  if (rec.status === 'ready') {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ready: true, reply: rec.reply, sources: rec.sources || [], elapsed_ms: rec.elapsed_ms }),
    };
  }

  return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ready: false, status: 'unknown' }) };
};
