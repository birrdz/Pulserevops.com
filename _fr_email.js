// Owner progress email helper for the franchise sprint.
// Usage: node _fr_email.js "Subject" "HTML or plain body"
const https = require('https');
const subject = process.argv[2] || 'Franchise sprint update';
const html = '<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.5">' + (process.argv[3] || '') + '</div>';
const data = JSON.stringify({ subject, html });
const r = https.request(
  'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',
  { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } },
  (res) => { let b=''; res.on('data',c=>b+=c); res.on('end',()=>console.log('EMAIL', res.statusCode, b.slice(0,160))); }
);
r.on('error', e => console.log('EMAIL_ERR', e.message));
r.write(data); r.end();
