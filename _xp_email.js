// POST a progress email to pulse-progress-notify. Usage:
//   node _xp_email.js "Subject" "<html body>"
const https = require('https');
const subject = process.argv[2] || 'PULSE cross-pillar copy progress';
const html = process.argv[3] || '';
const body = JSON.stringify({ subject, html });
const req = https.request({
  hostname: 'pulserevops.com',
  path: '/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
}, (res) => {
  let d = ''; res.on('data', (c) => (d += c));
  res.on('end', () => { console.log('status', res.statusCode, d.slice(0, 300)); });
});
req.on('error', (e) => { console.error('ERR', e.message); });
req.write(body); req.end();
