// ═════════════════════════════════════════════════════════════════════════════
// VISIT ALERT — emails Kory whenever a new visitor lands on pulserevops.com.
// Dedupes by IP per UTC day via Netlify Blobs (one alert per IP per day max).
// City/country from Netlify edge geo header — no external IP lookup needed.
//
// Required Netlify env vars (set in Site → Settings → Environment variables):
//   RESEND_API_KEY    — get from https://resend.com (free tier, 100/day)
//   ALERT_TO_EMAIL    — where the alerts go (e.g. koryjordanwhite@gmail.com)
//   ALERT_FROM_EMAIL  — Resend verified sender (or "onboarding@resend.dev" for testing)
//
// Optional env vars:
//   ALERT_SUBJECT_PREFIX — default "🟠 PULSE visit"
//   ALERT_OWNER_TOKEN    — visitors with cookie "pulse_owner=<token>" are skipped
//
// If RESEND_API_KEY or ALERT_TO_EMAIL are unset, the function silently returns
// 200 — the client never retries, and the deploy works without any setup.
// ═════════════════════════════════════════════════════════════════════════════
const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function decodeGeo(header) {
  if (!header) return null;
  try {
    const json = Buffer.from(header, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch (e) { return null; }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getCookie(headerVal, name) {
  if (!headerVal) return null;
  const m = headerVal.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'POST only' }) };
  }

  // Postmark preferred when POSTMARK_SERVER_TOKEN is set (better deliverability +
  // built-in open/click tracking via webhooks). Falls back to Resend.
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY;
  const apiKey = process.env.RESEND_API_KEY || process.env.resendapikey || process.env.RESENDAPIKEY;
  const toEmail = process.env.ALERT_TO_EMAIL || process.env.alert_to_email;
  const fromEmail = process.env.ALERT_FROM_EMAIL || process.env.alert_from_email || 'onboarding@resend.dev';
  const ownerToken = process.env.ALERT_OWNER_TOKEN || process.env.alert_owner_token;
  const suppressIps = (process.env.ALERT_SUPPRESS_IPS || process.env.alert_suppress_ips || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  const alertDisabled = /^(1|true|yes|on)$/i.test(process.env.ALERT_DISABLE || process.env.alert_disable || '');

  // Hard kill switch — set ALERT_DISABLE=1 in Netlify to silence everything
  if (alertDisabled) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, disabled: true }) };
  }

  // Not yet configured — silent success so the client never retries.
  // Either Postmark or Resend must be set; ALERT_TO_EMAIL is required either way.
  if ((!postmarkToken && !apiKey) || !toEmail) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, configured: false }) };
  }

  // ── Skip the site owner ─────────────────────────────────────────────────
  const cookieHeader = event.headers['cookie'] || event.headers['Cookie'];
  if (ownerToken && getCookie(cookieHeader, 'pulse_owner') === ownerToken) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, owner: true }) };
  }

  // ── Identify visitor ────────────────────────────────────────────────────
  const ip = event.headers['x-nf-client-connection-ip']
          || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || 'unknown';

  // Skip suppressed IPs (user's own home/office IPs set via ALERT_SUPPRESS_IPS)
  if (suppressIps.includes(ip)) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, suppressed_ip: true }) };
  }
  const ua = event.headers['user-agent'] || '';
  const geo = decodeGeo(event.headers['x-nf-geo']) || {};
  const city = (geo.city || '').trim();
  const country = (geo.country && (geo.country.name || geo.country.code)) || '';
  const subdivision = (geo.subdivision && geo.subdivision.name) || '';
  const subdivisionCode = (geo.subdivision && geo.subdivision.code) || '';

  // ── NY/NYC priority flag — owner wants escalated alerts for these visits
  const isNY =
    subdivisionCode.toUpperCase() === 'NY' ||
    /^new york$/i.test(subdivision) ||
    /^new york$/i.test(city) ||
    /^nyc$/i.test(city) ||
    /^manhattan$/i.test(city) ||
    /^brooklyn$/i.test(city) ||
    /^queens$/i.test(city) ||
    /^bronx$/i.test(city);

  // ── Body fields from client ─────────────────────────────────────────────
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) {}
  const referrer = (body.referrer || event.headers['referer'] || '').slice(0, 500);
  const path = (body.path || '/').slice(0, 200);

  // Skip obvious bots AND deploy/monitoring infra (Lighthouse, Netlify post-
  // deploy smoke checks, uptime monitors, etc.) — these cause the deploy spam.
  if (/(bot|crawler|spider|preview|curl|wget|axios|httpx|headless|lighthouse|chrome-lighthouse|netlify|monitor|uptime|pingdom|gtmetrix|webpagetest|webvitals|datadog|newrelic|statuscake|hyperping|fetch\b|node-fetch|python-requests|go-http|java\/)/i.test(ua)) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, bot: true }) };
  }
  // Empty / suspiciously short UA — almost always automated
  if (!ua || ua.length < 30) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, bot: true, reason: 'short_ua' }) };
  }

  // ── Dedupe per IP per UTC day via Netlify Blobs ─────────────────────────
  // Plus track today's NY count so multi-NY-visit alerts can escalate.
  let alreadyAlerted = false;
  let nyCountToday = 0;
  try {
    const store = getStore('visit-alerts');
    const dayKey = `seen-${todayKey()}`;
    const nyKey = `ny-${todayKey()}`;
    const raw = await store.get(dayKey);
    const seen = raw ? JSON.parse(raw) : {};
    if (seen[ip]) {
      alreadyAlerted = true;
    } else {
      seen[ip] = Date.now();
      await store.set(dayKey, JSON.stringify(seen));
    }

    if (isNY) {
      const rawNy = await store.get(nyKey);
      const nySeen = rawNy ? JSON.parse(rawNy) : {};
      if (!nySeen[ip]) {
        nySeen[ip] = { ts: Date.now(), city, subdivision };
        await store.set(nyKey, JSON.stringify(nySeen));
      }
      nyCountToday = Object.keys(nySeen).length;
    }
  } catch (e) {
    console.warn('[visit-alert] blob store failed:', e && e.message);
  }
  if (alreadyAlerted) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, deduped: true, ny: isNY }) };
  }

  // ── Compose email ───────────────────────────────────────────────────────
  const prefix = process.env.ALERT_SUBJECT_PREFIX || '🟠 PULSE visit';
  const locParts = [city, subdivision, country].filter(Boolean);
  const locStr = locParts.length ? locParts.join(', ') : 'unknown location';
  const subject = isNY
    ? (nyCountToday >= 2
        ? `🚨🚨 NYC VISIT #${nyCountToday} TODAY — ${locStr}`
        : `🚨 NYC VISITOR — ${locStr}`)
    : `${prefix} — ${locStr}`;

  const safe = (s) => String(s || '—').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  const nyBanner = isNY
    ? `<div style="background:#dc2626;color:#fff;padding:10px 14px;border-radius:8px;margin-bottom:14px;font-weight:800;font-size:15px;letter-spacing:0.04em;">🚨 NYC VISITOR ${nyCountToday >= 2 ? `· ${nyCountToday} NYC VISITS TODAY` : ''}</div>`
    : '';
  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;color:#222;max-width:520px;">
      ${nyBanner}
      <div style="font-size:18px;font-weight:700;color:#E8710A;margin-bottom:8px;">New visitor on pulserevops.com</div>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">City</td><td style="padding:4px 0;font-weight:600;">${safe(city)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Region</td><td style="padding:4px 0;">${safe(subdivision)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Country</td><td style="padding:4px 0;">${safe(country)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Path</td><td style="padding:4px 0;font-family:monospace;">${safe(path)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Referrer</td><td style="padding:4px 0;font-family:monospace;font-size:12px;">${safe(referrer)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">IP</td><td style="padding:4px 0;font-family:monospace;">${safe(ip)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Time (UTC)</td><td style="padding:4px 0;">${new Date().toISOString()}</td></tr>
      </table>
      <div style="margin-top:12px;color:#999;font-size:11px;">UA: ${safe(ua.slice(0, 240))}</div>
    </div>`;

  // ── Send via Postmark (preferred) or Resend (fallback) ──────────────────
  if (postmarkToken) {
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
          Subject: subject,
          HtmlBody: html,
          MessageStream: 'outbound',
          TrackOpens: true,
          TrackLinks: 'HtmlAndText',
          Tag: isNY ? 'visit-alert-nyc' : 'visit-alert',
        }),
      });
      if (!resp.ok) {
        const errTxt = await resp.text();
        console.warn('[visit-alert] postmark failed:', resp.status, errTxt);
        return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'postmark send failed', status: resp.status }) };
      }
    } catch (e) {
      console.warn('[visit-alert] postmark error:', e && e.message);
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'postmark send error' }) };
    }
  } else {
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: fromEmail, to: [toEmail], subject, html }),
      });
      if (!resp.ok) {
        const errTxt = await resp.text();
        console.warn('[visit-alert] resend failed:', resp.status, errTxt);
        return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'mail send failed', status: resp.status }) };
      }
    } catch (e) {
      console.warn('[visit-alert] resend error:', e && e.message);
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'mail send error' }) };
    }
  }

  return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
};
