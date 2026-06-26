// One-off progress-notifier — sends an email update to the owner using the
// same Postmark/Resend env vars as visit-alert.js. Hardcoded recipient + small
// shared key so this can't be abused by random callers.
//
// POST /.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026
// body: { subject: "...", html: "..." }
// Recipient fixed to koryjordanwhite@gmail.com.

const RECIPIENT = 'koryjordanwhite@gmail.com';
const SHARED_KEY = 'pulsemachine-writer-2026';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'POST only' }) };
  }
  const params = event.queryStringParameters || {};
  if (params.key !== SHARED_KEY) {
    return { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) {}
  const subject = String(body.subject || 'Pulse progress update').slice(0, 200);
  const html = String(body.html || '<p>No content provided.</p>').slice(0, 100000);

  const pmToken = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const resendKey = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const fromEmail = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';

  if (!pmToken && !resendKey) {
    return { statusCode: 503, body: JSON.stringify({ error: 'no email key configured on server' }) };
  }

  if (pmToken) {
    try {
      const r = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': pmToken,
        },
        body: JSON.stringify({
          From: fromEmail,
          To: RECIPIENT,
          Subject: subject,
          HtmlBody: html,
          MessageStream: 'outbound',
          Tag: 'progress-notify',
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        return { statusCode: 502, body: JSON.stringify({ error: 'postmark', status: r.status, detail: t.slice(0, 400) }) };
      }
      return { statusCode: 200, body: JSON.stringify({ ok: true, provider: 'postmark' }) };
    } catch (e) {
      return { statusCode: 502, body: JSON.stringify({ error: 'postmark exception', detail: String(e.message || e) }) };
    }
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromEmail, to: [RECIPIENT], subject, html }),
    });
    if (!r.ok) {
      const t = await r.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'resend', status: r.status, detail: t.slice(0, 400) }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, provider: 'resend' }) };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: 'resend exception', detail: String(e.message || e) }) };
  }
};
