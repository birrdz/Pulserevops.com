// Sends an owner progress email. Usage: node _marathon_email.js "<subject>" "<htmlfile>"
const https = require('https');
const fs = require('fs');
const subject = process.argv[2] || 'Pulse Marathon update';
const htmlFile = process.argv[3];
const html = htmlFile && fs.existsSync(htmlFile) ? fs.readFileSync(htmlFile, 'utf8') : (process.argv[3] || '<p>update</p>');
const body = JSON.stringify({ subject, html });
const req = https.request('https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',
  { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
  res => { let d = ''; res.on('data', c => d += c); res.on('end', () => console.log('notify', res.statusCode, d.slice(0, 120))); });
req.on('error', e => console.log('err', e.message));
req.write(body); req.end();
