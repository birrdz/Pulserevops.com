// pulse-trivia-click-notify — emails the owner when a visitor picks a Q&A trivia
// answer and navigates to the next similar entry. Public beacon endpoint (no
// secret — browser can't hold one). CORS open for sendBeacon from entry pages.
const RECIPIENT = 'koryjordanwhite@gmail.com';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };

  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch (e) {}

  const sourceId = String(b.sourceId || '').slice(0, 24);
  const sourceQuestion = String(b.sourceQuestion || '').slice(0, 300);
  const sourceUrl = String(b.sourceUrl || '').slice(0, 400);
  const targetId = String(b.targetId || '').slice(0, 24);
  const targetQuestion = String(b.targetQuestion || '').slice(0, 300);
  const targetUrl = String(b.targetUrl || '').slice(0, 400);
  const picked = String(b.picked || '').slice(0, 300);
  const correct = !!b.correct;
  const uaClient = String(b.ua || '').slice(0, 280);
  const uaHeader = (event.headers && (event.headers['user-agent'] || event.headers['User-Agent'])) || '';
  const ua = uaClient || String(uaHeader).slice(0, 280);
  const ref = (event.headers && (event.headers['referer'] || event.headers['referrer'])) || sourceUrl || '';
  const ts = new Date().toUTCString();

  try { await require('./_stats').bump({ trivia_clicks: 1 }); } catch (e) {}

  const pmToken = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const resendKey = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const fromEmail = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  const subject = `🧠 PULSE trivia → next Q&A: ${sourceId} → ${targetId} (${correct ? 'correct' : 'wrong'})`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#171E14">
    <h2 style="color:#C0531F;margin:0 0 10px">Visitor answered Q&A trivia and moved on</h2>
    <p style="margin:0 0 14px"><strong>Result:</strong> ${correct ? '✅ Correct' : '❌ Wrong'} — picked <em>${esc(picked)}</em></p>
    <table style="border-collapse:collapse;width:100%;max-width:640px;font-size:14px">
      <tr><td style="padding:6px 10px;border:1px solid #e3e1de;background:#FAF8F4;font-weight:700">From</td>
          <td style="padding:6px 10px;border:1px solid #e3e1de"><strong>${esc(sourceId)}</strong><br>${esc(sourceQuestion)}<br><a href="${esc(sourceUrl)}">${esc(sourceUrl)}</a></td></tr>
      <tr><td style="padding:6px 10px;border:1px solid #e3e1de;background:#FAF8F4;font-weight:700">To</td>
          <td style="padding:6px 10px;border:1px solid #e3e1de"><strong>${esc(targetId)}</strong><br>${esc(targetQuestion)}<br><a href="${esc(targetUrl)}">${esc(targetUrl)}</a></td></tr>
    </table>
    <p style="margin:14px 0 0;font-size:13px;color:#55576A">
      <strong>Time:</strong> ${esc(ts)}<br>
      <strong>Referrer:</strong> ${esc(ref || '(n/a)')}<br>
      <strong>User-Agent:</strong> <span style="word-break:break-all">${esc(ua || '(n/a)')}</span>
    </p>
    <p style="color:#8a8ba0;font-size:12px;margin-top:16px">Q&A trivia pop-up — answer click leading to next similar entry.</p>
  </div>`;

  try {
    if (pmToken) {
      const r = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Postmark-Server-Token': pmToken,
        },
        body: JSON.stringify({
          From: fromEmail,
          To: RECIPIENT,
          Subject: subject,
          HtmlBody: html,
          MessageStream: 'outbound',
          Tag: 'trivia-click',
        }),
      });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: r.ok, provider: 'postmark' }) };
    }
    if (resendKey) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromEmail, to: [RECIPIENT], subject, html }),
      });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: r.ok, provider: 'resend' }) };
    }
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'no mail provider configured' }) };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, error: String(e.message || e) }) };
  }
};
