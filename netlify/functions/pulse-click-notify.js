// pulse-click-notify — emails the owner when a visitor clicks the "Curated by
// Kory White" byline or any CRO Syndicate / Kory LinkedIn link, on any page.
// Public beacon endpoint (no secret — client can't hold one). Reuses the same
// Postmark/Resend env as pulse-progress-notify. Recipient fixed.
const RECIPIENT = 'koryjordanwhite@gmail.com';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const KIND_LABEL = { 'curator': 'Kory White name (→ LinkedIn)', 'curator-photo': "Kory White's profile photo (→ LinkedIn)", 'kory-title': "Kory White's title ‘Chief Revenue Officer’ (→ resume)", 'cro-syndicate': 'CRO Syndicate link', 'kory-linkedin': 'Kory White LinkedIn', 'kory-resume': "Kory White's 1-page resume (PDF)", 'hire-cro': "the ‘Hire a Fractional CRO’ button", 'tool': 'a PULSE Tool link', 'followup': 'submitted a follow-up question (→ Machine / DeepSeek)' };

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };
  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch (e) {}
  const kind = String(b.kind || 'unknown').slice(0, 40);
  try { const st = require('./_stats'); await st.bump({ clicks: 1 }); await st.bumpDaily({ clicks: 1 }); } catch (e) {}
  const label = String(b.label || '').slice(0, 200);
  const page = String(b.page || '').slice(0, 300);
  const url = String(b.url || '').slice(0, 400);
  const title = String(b.title || '').slice(0, 200);
  const ref = (event.headers && (event.headers['referer'] || event.headers['referrer'])) || '';
  const fullPage = url || (page ? ('https://pulserevops.com' + page) : '') || ref;
  const what = KIND_LABEL[kind] || kind;
  const note = String(b.note || '').slice(0, 500); // e.g. the follow-up question text
  const noteRow = note ? `<strong>Question / note:</strong> <span style="color:#C8112B">${note.replace(/[<>]/g, '')}</span><br>` : '';

  const pmToken = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const resendKey = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const fromEmail = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  const subject = `🔔 PULSE lead-signal: ${what}`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#171E14">
    <h2 style="color:#C8112B;margin:0 0 8px">A visitor clicked ${what}</h2>
    <p>${noteRow}<strong>Page they were on:</strong> ${fullPage ? `<a href="${fullPage}">${fullPage}</a>` : (page || ref || '(unknown page)')}<br>
    <strong>Page title:</strong> ${title || '(n/a)'}<br>
    <strong>Link/target:</strong> ${label || '(n/a)'}<br>
    <strong>Time:</strong> ${new Date().toUTCString()}</p>
    <p style="color:#8a8ba0;font-size:12px">Low-key lead signal from pulserevops.com. (One alert per visitor per click-type, per session.)</p>
  </div>`;

  try {
    if (pmToken) {
      const r = await fetch('https://api.postmarkapp.com/email', { method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Postmark-Server-Token': pmToken },
        body: JSON.stringify({ From: fromEmail, To: RECIPIENT, Subject: subject, HtmlBody: html, MessageStream: 'outbound' }) });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: r.ok, provider: 'postmark' }) };
    }
    if (resendKey) {
      const r = await fetch('https://api.resend.com/emails', { method: 'POST',
        headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromEmail, to: [RECIPIENT], subject, html }) });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: r.ok, provider: 'resend' }) };
    }
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'no mail provider configured' }) };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, error: String(e.message || e) }) };
  }
};
