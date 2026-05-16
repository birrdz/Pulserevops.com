// ════════════════════════════════════════════════════════════════════════════
// EMAIL OPEN WEBHOOK — receives Postmark webhook events when a recipient
// opens or clicks a cold email, then pings Kory with a realtime alert.
//
// Wire-up (Postmark dashboard):
//   1. Servers → Default Outbound → Settings → Webhooks → Add Webhook
//   2. URL: https://pulserevops.com/.netlify/functions/email-open-webhook
//   3. Triggers: ✅ Open, ✅ Click   (skip Delivery / Bounce / Spam unless you want them)
//   4. Save. Postmark will start POSTing events as JSON.
//
// Required env: POSTMARK_SERVER_TOKEN (auth-back-channel — function emails the
//   alert *back* through Postmark, so it needs the same token)
// Optional env: ALERT_TO_EMAIL, ALERT_FROM_EMAIL, ALERT_OPEN_WEBHOOK_SECRET
//
// If ALERT_OPEN_WEBHOOK_SECRET is set, requests must include it as a query
// param `?s=<secret>` to prevent random POSTs from spoofing alerts.
// ════════════════════════════════════════════════════════════════════════════

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function fmtTs(ts) {
  if (!ts) return new Date().toISOString();
  try { return new Date(ts).toISOString(); } catch (e) { return String(ts); }
}

function safe(s) {
  return String(s || '—').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'POST only' }) };
  }

  // Optional shared-secret check
  const expectedSecret = process.env.ALERT_OPEN_WEBHOOK_SECRET;
  if (expectedSecret) {
    const params = event.queryStringParameters || {};
    if ((params.s || params.secret) !== expectedSecret) {
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'unauthorized' }) };
    }
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'bad json' }) };
  }

  // Postmark sends RecordType: "Open" or "Click" (and others if you subscribe)
  const recordType = String(body.RecordType || body.Type || '').toLowerCase();
  const recipient = body.Recipient || (body.Email && body.Email) || '';
  const subject = body.Subject || (body.Metadata && body.Metadata.subject) || '(no subject)';
  const tag = body.Tag || '';
  const ts = body.ReceivedAt || body.OpenedAt || body.ClickedAt || Date.now();
  const ua = (body.UserAgent || '').slice(0, 200);
  const geo = body.Geo || {};
  const city = geo.City || '';
  const region = geo.Region || '';
  const country = geo.CountryISOCode || geo.Country || '';
  const messageId = body.MessageID || body.MessageId || '';
  const link = body.OriginalLink || body.Link || '';

  const isOpen = recordType === 'open';
  const isClick = recordType === 'click';

  // Only ping for opens + clicks. Ignore other event types silently.
  if (!isOpen && !isClick) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, ignored: recordType }) };
  }

  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const toEmail = process.env.ALERT_TO_EMAIL || process.env.alert_to_email;
  const fromEmail = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';

  if (!postmarkToken || !toEmail) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, configured: false }) };
  }

  const eventLabel = isClick ? 'CLICKED' : 'OPENED';
  const eventEmoji = isClick ? '🟢' : '🔵';
  const locStr = [city, region, country].filter(Boolean).join(', ') || 'unknown location';
  const subjectLine = `${eventEmoji} ${eventLabel}: ${recipient || 'unknown'} — "${(subject || '').slice(0, 60)}"`;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;color:#222;max-width:560px;">
      <div style="background:${isClick ? '#16a34a' : '#2563eb'};color:#fff;padding:10px 14px;border-radius:8px;margin-bottom:14px;font-weight:800;font-size:15px;letter-spacing:0.04em;">
        ${eventEmoji} ${eventLabel} — Cold email engagement
      </div>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Recipient</td><td style="padding:4px 0;font-weight:700;">${safe(recipient)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Subject</td><td style="padding:4px 0;">${safe(subject)}</td></tr>
        ${tag ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Tag</td><td style="padding:4px 0;font-family:monospace;">${safe(tag)}</td></tr>` : ''}
        ${isClick ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Clicked link</td><td style="padding:4px 0;font-family:monospace;font-size:11px;word-break:break-all;">${safe(link)}</td></tr>` : ''}
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Location</td><td style="padding:4px 0;">${safe(locStr)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Time (UTC)</td><td style="padding:4px 0;">${fmtTs(ts)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Message ID</td><td style="padding:4px 0;font-family:monospace;font-size:11px;">${safe(messageId)}</td></tr>
      </table>
      <div style="margin-top:12px;color:#999;font-size:11px;">UA: ${safe(ua)}</div>
      <div style="margin-top:14px;padding:10px 14px;background:#fff7ed;border-left:3px solid #E8710A;font-size:12px;color:#7c2d12;">
        <b>Cold-pitch signal:</b> ${recipient || 'this prospect'} just ${isClick ? 'clicked a link in' : 'opened'} your email. ${isClick ? 'They\'re actively reading.' : 'High signal — consider a follow-up in 1–2 days.'}
      </div>
    </div>`;

  try {
    const resp = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: toEmail,
        Subject: subjectLine,
        HtmlBody: html,
        MessageStream: 'outbound',
        TrackOpens: false,
        TrackLinks: 'None',
        Tag: 'open-alert',
      }),
    });
    if (!resp.ok) {
      const errTxt = await resp.text();
      console.warn('[email-open-webhook] postmark failed:', resp.status, errTxt);
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'alert send failed' }) };
    }
  } catch (e) {
    console.warn('[email-open-webhook] error:', e && e.message);
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'alert send error' }) };
  }

  return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, alerted: true, type: recordType }) };
};
