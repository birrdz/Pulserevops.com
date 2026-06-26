// Newsletter subscriber collection + email-gated download delivery.
//
// POST { email, name?, source?, download? }
//   - Validates + stores to Netlify Blobs (store 'newsletter'), deduplicated.
//   - If RESEND_API_KEY + RESEND_AUDIENCE_ID set: upserts the contact into the
//     Resend Audience so the list lives in Resend for broadcasts.
//   - If RESEND_API_KEY set and `download` names a known gated file: emails the
//     subscriber the download link and returns download_url so the front-end can
//     unlock immediately.
//   - All Resend calls are best-effort: a Resend outage never blocks capture.
// GET ?secret=XXX → returns full subscriber list (admin only).
//
// Required env to light up email features (add in Netlify env vars, NOT in code):
//   RESEND_API_KEY        — from the Resend dashboard
//   RESEND_AUDIENCE_ID    — the Audience to sync contacts into
//   RESEND_FROM           — verified sender, e.g. "Pulse RevOps <updates@pulserevops.com>"
const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ADMIN_SECRET = process.env.NEWSLETTER_ADMIN_SECRET || 'pulse-admin-2025';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '';
const RESEND_FROM = process.env.RESEND_FROM || 'Pulse RevOps <updates@pulserevops.com>';
const SITE = 'https://pulserevops.com';

// Owner alerts — reuses the same env vars as visit-alert.js (Postmark preferred,
// Resend fallback). If ALERT_TO_EMAIL is unset it silently no-ops.
const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_KEY || '';
const ALERT_TO = process.env.ALERT_TO_EMAIL || '';
const ALERT_FROM = process.env.ALERT_FROM_EMAIL || RESEND_FROM;

async function sendOwnerAlert(subject, html) {
  if (!ALERT_TO || (!POSTMARK_TOKEN && !RESEND_API_KEY)) return { sent: false, reason: 'not configured' };
  try {
    if (POSTMARK_TOKEN) {
      const r = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Postmark-Server-Token': POSTMARK_TOKEN },
        body: JSON.stringify({ From: ALERT_FROM, To: ALERT_TO, Subject: subject, HtmlBody: html, MessageStream: 'outbound' }),
      });
      return { sent: r.ok, status: r.status };
    }
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: ALERT_FROM, to: ALERT_TO, subject, html }),
    });
    return { sent: r.ok, status: r.status };
  } catch (e) { return { sent: false, error: String(e.message || e) }; }
}

// Server-side allowlist of gated files. The client sends a file *id* (never a
// URL), so a caller can't coerce delivery of an arbitrary path. Add lead magnets
// here as you publish them; files live under /downloads/ on the static site.
const GATED_FILES = {
  'revops-kpi-cheatsheet': { path: '/downloads/pulse-revops-kpi-cheatsheet.html', title: 'The RevOps KPI & Benchmark Cheat Sheet' },
  // Add more lead magnets here as you publish them (files live under /downloads/).
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function resendAddContact(email, name) {
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) return { synced: false, reason: 'not configured' };
  try {
    const r = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, first_name: name || '', unsubscribed: false }),
    });
    return { synced: r.ok, status: r.status };
  } catch (e) {
    return { synced: false, error: String(e.message || e) };
  }
}

async function resendSendDownload(email, name, file) {
  if (!RESEND_API_KEY) return { sent: false, reason: 'not configured' };
  const url = `${SITE}${file.path}`;
  const hi = name ? `Hi ${name},` : 'Hi,';
  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;color:#0f172a">
      <p>${hi}</p>
      <p>Thanks for grabbing <strong>${file.title}</strong>. Here's your download:</p>
      <p><a href="${url}" style="display:inline-block;background:#06b6d4;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Download ${file.title}</a></p>
      <p style="color:#64748b;font-size:13px">Or paste this link into your browser:<br>${url}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
      <p style="color:#94a3b8;font-size:12px">You're getting this because you requested a download from pulserevops.com. Reply "unsubscribe" to opt out anytime.</p>
    </div>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM, to: email, subject: `Your download: ${file.title}`, html }),
    });
    return { sent: r.ok, status: r.status };
  } catch (e) {
    return { sent: false, error: String(e.message || e) };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  try {
    const store = getStore('newsletter');

    // ── ADMIN: GET all subscribers ──────────────────────────────────────────
    if (event.httpMethod === 'GET') {
      const secret = (event.queryStringParameters || {}).secret;
      if (secret !== ADMIN_SECRET) {
        return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Not found' }) };
      }
      const raw = await store.get('subscribers');
      const subscribers = JSON.parse(raw || '[]');
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: subscribers.length, subscribers }),
      };
    }

    // ── SUBSCRIBE: POST { email, name?, source?, download? } ────────────────
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const email = (body.email || '').trim().toLowerCase();
      const name = (body.name || '').trim().slice(0, 80);
      const downloadId = (body.download || '').trim();

      if (!isValidEmail(email)) {
        return {
          statusCode: 400,
          headers: CORS,
          body: JSON.stringify({ error: 'Invalid email address' }),
        };
      }

      // Resolve the gated file (if any) from the server-side allowlist.
      const file = downloadId ? GATED_FILES[downloadId] : null;
      if (downloadId && !file) {
        return {
          statusCode: 400,
          headers: CORS,
          body: JSON.stringify({ error: 'Unknown download' }),
        };
      }

      const raw = await store.get('subscribers');
      const subscribers = JSON.parse(raw || '[]');
      const existing = subscribers.find(s => s.email === email);

      if (!existing) {
        subscribers.push({
          email,
          name: name || undefined,
          ts: Date.now(),
          source: body.source || (downloadId ? `download:${downloadId}` : 'website'),
          downloads: downloadId ? [downloadId] : [],
        });
        await store.set('subscribers', JSON.stringify(subscribers));
      } else if (downloadId && !(existing.downloads || []).includes(downloadId)) {
        existing.downloads = [...(existing.downloads || []), downloadId];
        await store.set('subscribers', JSON.stringify(subscribers));
      }

      // Best-effort Resend sync + delivery (never blocks capture).
      const audience = await resendAddContact(email, name);
      const delivery = file ? await resendSendDownload(email, name, file) : { sent: false };

      // Owner alert — fire on a new subscriber OR any download attempt.
      const isNew = !existing;
      if (isNew || downloadId) {
        const esc = (s) => String(s || '—').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
        const subject = downloadId
          ? `📥 PULSE download — ${file.title} — ${email}`
          : `📬 PULSE new subscriber — ${email}`;
        const html = `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6;color:#222;max-width:520px;">`
          + `<div style="font-size:17px;font-weight:700;color:#E8710A;margin-bottom:8px;">${downloadId ? 'New download from the gate' : 'New mailing-list subscriber'}</div>`
          + `<table cellpadding="0" cellspacing="0">`
          + `<tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td style="padding:4px 0;font-weight:600;">${esc(email)}</td></tr>`
          + `<tr><td style="padding:4px 12px 4px 0;color:#666;">Name</td><td style="padding:4px 0;">${esc(name)}</td></tr>`
          + (downloadId ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Downloaded</td><td style="padding:4px 0;">${esc(file.title)}</td></tr>` : '')
          + `<tr><td style="padding:4px 12px 4px 0;color:#666;">Source</td><td style="padding:4px 0;font-family:monospace;">${esc(body.source)}</td></tr>`
          + `<tr><td style="padding:4px 12px 4px 0;color:#666;">Status</td><td style="padding:4px 0;">${isNew ? 'NEW to the list' : 'already subscribed'}</td></tr>`
          + `<tr><td style="padding:4px 12px 4px 0;color:#666;">Time (UTC)</td><td style="padding:4px 0;">${new Date().toISOString()}</td></tr>`
          + `</table></div>`;
        await sendOwnerAlert(subject, html);
      }

      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ok: true,
          message: existing ? 'Already subscribed' : 'Subscribed',
          count: subscribers.length,
          download_url: file ? `${SITE}${file.path}` : null,
          resend: { audience, delivery },
        }),
      };
    }

    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  } catch (err) {
    console.error('subscribe fn error:', err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
