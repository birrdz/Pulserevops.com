// Per-page RED LIGHT when a cover/image pass finishes an entry.
// Used by _pexels_image_run.js (and any later image drip). Text finish emails stay separate.
'use strict';

const fs = require('fs');

function loadEnvFile(p) {
  try {
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (_e) {}
}
loadEnvFile('/tmp/aq-drip.env');
loadEnvFile(require('path').join(__dirname, '.env.local'));

const RECIPIENT = process.env.ALERT_TO || process.env.ALERT_TO_EMAIL || 'koryjordanwhite@gmail.com';
const RESEND_KEY = process.env.resendapikey || process.env.RESEND_API_KEY || process.env.RESENDAPIKEY || '';
const RESEND_FROM = process.env.ALERT_FROM_EMAIL || 'PULSE Engine <onboarding@resend.dev>';

function entryUrl(id) {
  const s = String(id || '').toLowerCase();
  if (s.startsWith('tl')) return 'https://pulserevops.com/tools/' + s;
  return 'https://pulserevops.com/knowledge/' + encodeURIComponent(s);
}

/**
 * Email owner when images/cover for one page are done.
 * @returns {{ok:boolean,status?:number,body?:string,reason?:string}}
 */
async function emailImagesDone({ id, title, cover, provider, query }) {
  if (!RESEND_KEY) return { ok: false, reason: 'no_key' };
  const url = entryUrl(id);
  const coverPath = cover || ('/assets/qa/' + String(id).toLowerCase() + '.jpg');
  const subject = `🔴 RED LIGHT — ${id} IMAGES done`;
  const coverAbs = /^https?:\/\//i.test(coverPath)
    ? coverPath
    : 'https://pulserevops.com' + (coverPath.startsWith('/') ? coverPath : '/' + coverPath);
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.5">
    <div style="background:#B91C1C;color:#fff;padding:14px 18px;font-size:20px;font-weight:700">
      🔴 RED LIGHT — Images done
    </div>
    <div style="padding:16px;border:3px solid #B91C1C;background:#FEF2F2">
      <p style="margin:0 0 8px;font-size:18px;font-weight:700">${String(id)}</p>
      <p style="margin:0 0 12px;font-weight:700">${String(title || '').replace(/</g, '&lt;')}</p>
      <p style="margin:0 0 12px"><a href="${url}" style="color:#0b57d0;font-weight:700">${url}</a></p>
      <p style="margin:0 0 12px"><a href="${url}"><img src="${coverAbs}" alt="cover" width="320" style="width:320px;max-width:100%;height:auto;border:2px solid #B91C1C;display:block" /></a></p>
      <p style="margin:0 0 8px;font-size:13px">Cover: <code>${String(coverPath).replace(/</g, '&lt;')}</code>${provider ? ' · ' + String(provider) : ''}${query ? ' · "' + String(query).replace(/</g, '&lt;') + '"' : ''}</p>
      <p style="margin:0;color:#666;font-size:12px">Image pass complete · eligible for homepage mosaic (real cover, not generic cro-cover) · ${new Date().toISOString()}</p>
    </div>
  </div>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [RECIPIENT],
        subject,
        html,
        text: `RED LIGHT ${id} IMAGES done ${url}`,
      }),
    });
    const text = await r.text();
    return { ok: r.ok, status: r.status, body: text.slice(0, 200) };
  } catch (e) {
    return { ok: false, reason: String(e.message || e) };
  }
}

module.exports = { emailImagesDone, entryUrl, RECIPIENT };
