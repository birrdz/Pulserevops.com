// Shared owner email helper for local drips.
// Prefer Resend DIRECT (local API key) — Netlify pulse-progress-notify has been 502'ing
// and ALERT_FROM_EMAIL=onboarding@resend.dev often never reaches Gmail until the domain
// is verified on Resend.
'use strict';

const SITE = process.env.PULSE_SITE || 'https://pulserevops.com';
const KEY = 'pulsemachine-writer-2026';
const RECIPIENT = process.env.ALERT_TO_EMAIL || 'koryjordanwhite@gmail.com';

function resendKey() {
  return (
    process.env.RESEND_API_KEY ||
    process.env.resendapikey ||
    process.env.RESENDAPIKEY ||
    ''
  );
}

function fromEmail() {
  return process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'Pulse <onboarding@resend.dev>';
}

/**
 * @returns {Promise<{ok:boolean, provider?:string, id?:string, status?:number, detail?:string}>}
 */
async function sendOwnerEmail(subject, html) {
  const sub = String(subject || 'Pulse update').slice(0, 180);
  const bodyHtml = String(html || '<p>(empty)</p>').slice(0, 100000);
  const rs = resendKey();
  const from = fromEmail();

  // 1) Resend direct
  if (rs) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + rs, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: [RECIPIENT],
          subject: sub,
          html: bodyHtml,
          reply_to: RECIPIENT,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const detail = await r.text();
      let id = null;
      try {
        id = JSON.parse(detail).id || null;
      } catch (e) {}
      const out = {
        ok: r.ok,
        provider: 'resend-direct',
        status: r.status,
        id,
        detail: detail.slice(0, 240),
        from,
        to: RECIPIENT,
        subject: sub,
      };
      console.log(JSON.stringify({ email: r.ok ? 'ok' : 'fail', ...out }));
      if (r.ok) return out;
    } catch (e) {
      console.log(
        JSON.stringify({
          email: 'err',
          provider: 'resend-direct',
          err: String(e.message || e).slice(0, 120),
          subject: sub,
        })
      );
    }
  }

  // 2) Netlify notify function fallback
  try {
    const r = await fetch(SITE + '/.netlify/functions/pulse-progress-notify?key=' + KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: sub, html: bodyHtml }),
      signal: AbortSignal.timeout(20000),
    });
    const detail = await r.text();
    const out = {
      ok: r.ok,
      provider: 'notify-fn',
      status: r.status,
      detail: detail.slice(0, 240),
      subject: sub,
    };
    console.log(JSON.stringify({ email: r.ok ? 'ok' : 'fail', ...out }));
    return out;
  } catch (e) {
    const out = { ok: false, provider: 'notify-fn', err: String(e.message || e).slice(0, 120), subject: sub };
    console.log(JSON.stringify({ email: 'err', ...out }));
    return out;
  }
}

module.exports = { sendOwnerEmail, RECIPIENT, fromEmail };
