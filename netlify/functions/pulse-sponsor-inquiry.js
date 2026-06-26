// pulse-sponsor-inquiry — receives sponsor inquiry form submissions from
// /sponsor and emails them to the owner via Resend (same provider as
// pulse-progress-notify). All fields optional except email.

const https = require('https');

const RESEND_API = process.env.RESEND_API_KEY || '';
const OWNER_EMAIL = 'koryjordanwhite@gmail.com';

function esc(s) {
  return String(s || '').replace(/[<>&"]/g, function (c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
  });
}

function sendEmail(subject, html) {
  return new Promise(function (resolve, reject) {
    if (!RESEND_API) return resolve({ ok: false, reason: 'no api key' });
    var body = JSON.stringify({
      from: 'PULSE Sponsor Inbox <inquiries@pulserevops.com>',
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
        res.on('end', function () { resolve({ ok: res.statusCode < 300, status: res.statusCode, data: data }); });
      }
    );
    req.on('error', function (err) { resolve({ ok: false, reason: String(err.message) }); });
    req.write(body);
    req.end();
  });
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
  catch (e) { return { statusCode: 400, headers: headers, body: JSON.stringify({ ok: false, error: 'bad json' }) }; }

  var email = (body.email || '').trim();
  if (!email || !/.+@.+\..+/.test(email)) {
    return { statusCode: 400, headers: headers, body: JSON.stringify({ ok: false, error: 'valid email required' }) };
  }
  var name = esc((body.name || '').trim() || '—');
  var company = esc((body.company || '').trim() || '—');
  var role = esc((body.role || '').trim() || '—');
  var interest = esc((body.interest || '').trim() || '—');
  var budget = esc((body.budget || '').trim() || '—');
  var message = esc((body.message || '').trim() || '—');

  var ipRaw = (event.headers && (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || '')) || '';
  var ua = (event.headers && event.headers['user-agent']) || '';

  var html =
    '<div style="font-family:system-ui,sans-serif;font-size:14px;color:#222;max-width:620px;">' +
      '<h2 style="color:#FF6B30;margin:0 0 14px;">New sponsor inquiry — ' + company + '</h2>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
        '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#666;width:130px;"><strong>Name</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;">' + name + '</td></tr>' +
        '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#666;"><strong>Email</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;"><a href="mailto:' + esc(email) + '">' + esc(email) + '</a></td></tr>' +
        '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#666;"><strong>Company</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;">' + company + '</td></tr>' +
        '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#666;"><strong>Role</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;">' + role + '</td></tr>' +
        '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#666;"><strong>Interest</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;">' + interest + '</td></tr>' +
        '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#666;"><strong>Budget</strong></td><td style="padding:6px 10px;border-bottom:1px solid #eee;">' + budget + '</td></tr>' +
      '</table>' +
      '<h3 style="margin:20px 0 8px;color:#333;font-size:14px;">Message</h3>' +
      '<div style="background:#f9f9f9;padding:14px 16px;border-radius:8px;white-space:pre-wrap;font-size:13px;line-height:1.5;">' + message + '</div>' +
      '<p style="margin-top:18px;font-size:11px;color:#999;">IP: ' + esc(ipRaw) + ' · UA: ' + esc(ua.slice(0, 120)) + '</p>' +
    '</div>';

  var r = await sendEmail('PULSE Sponsor inquiry: ' + company + ' (' + interest + ')', html);
  return { statusCode: 200, headers: headers, body: JSON.stringify({ ok: r.ok, status: r.status || null }) };
};
