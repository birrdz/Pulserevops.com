// pulse-subscribe-relay — receives email signups from the exit-intent modal
// and stashes them in the Blobs store at _newsletter_subscribers.json.
// When the owner sets up Beehiiv (or any provider), we can replay the list
// into the provider's import. Until then, every signup is captured + relayed
// via email to the owner.

const https = require('https');
const { getStore } = require('@netlify/blobs');

const RESEND_API = process.env.RESEND_API_KEY || '';
const OWNER_EMAIL = 'koryjordanwhite@gmail.com';

function sendEmail(subject, html) {
  return new Promise(function (resolve) {
    if (!RESEND_API) return resolve({ ok: false, reason: 'no api key' });
    var body = JSON.stringify({
      from: 'PULSE Subscribers <list@pulserevops.com>',
      to: [OWNER_EMAIL],
      subject: subject,
      html: html,
    });
    var req = https.request(
      {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'Authorization': 'Bearer ' + RESEND_API,
        },
      },
      function (res) {
        var data = '';
        res.on('data', function (c) { data += c; });
        res.on('end', function () { resolve({ ok: res.statusCode < 300, status: res.statusCode }); });
      }
    );
    req.on('error', function () { resolve({ ok: false }); });
    req.write(body);
    req.end();
  });
}

function initStore() {
  var tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  var sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  try {
    return (tok && sid)
      ? getStore({ name: 'pulse-machine-library', siteID: sid, token: tok })
      : getStore('pulse-machine-library');
  } catch (_) { return null; }
}

exports.handler = async function (event) {
  var headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: headers, body: JSON.stringify({ ok: false }) };

  var body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: headers, body: JSON.stringify({ ok: false }) }; }

  var email = (body.email || '').trim().toLowerCase();
  if (!email || !/.+@.+\..+/.test(email)) {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ ok: false, error: 'valid email required' }) };
  }
  var source = (body.source || 'unknown').slice(0, 64);
  var page = (body.page || '').slice(0, 256);

  var store = initStore();
  var sub = { email: email, source: source, page: page, ts: Date.now() };

  if (store) {
    try {
      var current = (await store.get('_newsletter_subscribers.json', { type: 'json' })) || { subs: [] };
      // Deduplicate by email
      if (!(current.subs || []).some(function (s) { return s.email === email; })) {
        current.subs = (current.subs || []).concat([sub]);
        await store.setJSON('_newsletter_subscribers.json', current);
      }
    } catch (e) { /* swallow — fall back to email-only */ }
  }

  // Email owner the new sub
  var htmlEmail =
    '<div style="font-family:system-ui,sans-serif;font-size:14px;color:#222;">' +
      '<h3 style="margin:0 0 10px;color:#22C55E;">New newsletter subscriber</h3>' +
      '<p style="margin:0 0 4px;"><strong>Email:</strong> ' + email + '</p>' +
      '<p style="margin:0 0 4px;"><strong>Source:</strong> ' + source + '</p>' +
      '<p style="margin:0 0 4px;"><strong>Page:</strong> ' + page + '</p>' +
      '<p style="margin:10px 0 0;font-size:11px;color:#999;">Stashed in pulse-machine-library/_newsletter_subscribers.json. When Beehiiv is wired, run a one-shot replay to import.</p>' +
    '</div>';
  await sendEmail('New PULSE subscriber: ' + email, htmlEmail);

  return { statusCode: 200, headers: headers, body: JSON.stringify({ ok: true }) };
};
