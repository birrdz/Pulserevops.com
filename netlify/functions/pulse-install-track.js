// pulse-install-track — fires when a visitor installs the PWA from mobile or
// desktop. Sends the owner a notification email + logs to a blob counter.
// No PII other than UA + referrer (no IP stored).
//
// POST /.netlify/functions/pulse-install-track
//   body: { platform: "ios|android|desktop|unknown", source: "/" }
// → { ok: true }

const https = require('https');
let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const OWNER = 'koryjordanwhite@gmail.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function sendNotify(subject, html) {
  return new Promise(function (resolve) {
    var body = JSON.stringify({ subject: subject, html: html });
    var req = https.request({
      hostname: 'pulserevops.com',
      path: '/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, function (res) { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve({ ok: res.statusCode < 300, status: res.statusCode })); });
    req.on('error', () => resolve({ ok: false }));
    req.write(body); req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_e) {}
  const platform = String(body.platform || 'unknown').slice(0, 32);
  const source = String(body.source || '/').slice(0, 128);
  const ua = String((event.headers && event.headers['user-agent']) || '').slice(0, 320);
  const ref = String((event.headers && event.headers.referer) || '').slice(0, 256);
  const now = Date.now();

  // Counter blob (per-day, all-time) — useful for the dashboard later.
  const store = initStore();
  if (store) {
    try {
      const c = (await store.get('_install_log.json', { type: 'json' })) || { total: 0, by_platform: {}, by_day: {}, recent: [] };
      c.total = (c.total || 0) + 1;
      c.by_platform[platform] = (c.by_platform[platform] || 0) + 1;
      const day = new Date(now).toISOString().slice(0, 10);
      c.by_day[day] = (c.by_day[day] || 0) + 1;
      c.recent = (c.recent || []).slice(-49);
      c.recent.push({ ts: now, platform, source, ua, ref });
      await store.setJSON('_install_log.json', c);
    } catch (_e) { /* logging failure shouldn't block the notification */ }
  }

  // Email owner. Soft-rate-limit: skip the email if we sent one for this
  // platform in the last 30 seconds (handles duplicate fires).
  let shouldEmail = true;
  if (store) {
    try {
      const lock = (await store.get('_install_email_lock.json', { type: 'json' })) || {};
      const last = lock[platform] || 0;
      if (now - last < 30000) shouldEmail = false;
      else {
        lock[platform] = now;
        await store.setJSON('_install_email_lock.json', lock);
      }
    } catch (_e) {}
  }

  let emailResult = { skipped: true };
  if (shouldEmail) {
    const html =
      '<div style="font-family:system-ui,sans-serif;font-size:14px;color:#222;">' +
        '<h3 style="margin:0 0 12px;color:#FF6B30;">📲 New Pulse install</h3>' +
        '<p style="margin:0 0 6px;"><strong>Platform:</strong> ' + platform + '</p>' +
        '<p style="margin:0 0 6px;"><strong>Source page:</strong> ' + source + '</p>' +
        '<p style="margin:0 0 6px;"><strong>Referrer:</strong> ' + (ref || '(direct)') + '</p>' +
        '<p style="margin:0 0 6px;font-size:12px;color:#666;"><strong>UA:</strong> ' + ua + '</p>' +
        '<p style="margin:14px 0 0;font-size:11px;color:#999;">Logged in pulse-machine-library/_install_log.json.</p>' +
      '</div>';
    emailResult = await sendNotify('📲 PULSE install — ' + platform, html);
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, emailed: emailResult.ok === true, skipped: !!emailResult.skipped }),
  };
};
