// entry-feedback — logs a Y/N "was this helpful" vote on a library entry.
// Writes increments to pulse-machine-feedback blob keyed by entry id.
//
// POST body: { id: string, vote: 'yes'|'no' }
// Returns: { ok, yes, no, total }

const { getStore } = require('@netlify/blobs');

function initBlob(name) {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try { return getStore(name); }
  catch (e1) { if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e2) { return null; } } return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    // Read-only: return tally for the entry
    const id = (event.queryStringParameters || {}).id;
    if (!id || !/^(vq_[a-z0-9]+|[a-z]{1,5}\d+)$/i.test(String(id))) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad id' }) };
    }
    const store = initBlob('pulse-machine-feedback');
    if (!store) return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'blob unavailable' }) };
    const tally = (await store.get(id + '.json', { type: 'json' })) || { yes: 0, no: 0 };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify({ ok: true, yes: tally.yes || 0, no: tally.no || 0, total: (tally.yes || 0) + (tally.no || 0) }),
    };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'POST or GET' }) };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }
  const id = String(body.id || '').trim();
  const vote = String(body.vote || '').toLowerCase();
  if (!id || !/^(vq_[a-z0-9]+|[a-z]{1,5}\d+)$/i.test(id) || (vote !== 'yes' && vote !== 'no')) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'id + vote(yes|no) required' }) };
  }
  const store = initBlob('pulse-machine-feedback');
  if (!store) return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'blob unavailable' }) };

  // Read-modify-write — race tolerant since clicks are infrequent
  const tally = (await store.get(id + '.json', { type: 'json' })) || { yes: 0, no: 0, last_at: 0 };
  tally[vote] = (tally[vote] || 0) + 1;
  tally.last_at = Date.now();
  await store.setJSON(id + '.json', tally);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, yes: tally.yes, no: tally.no, total: tally.yes + tally.no }),
  };
};
