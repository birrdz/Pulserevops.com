// POST q257 rung 8->9 to pulse-blob-polish
const https = require('https');
const { body } = require('./_q257_r9.js');

const payload = JSON.stringify({
  key: 'pulsemachine-writer-2026',
  id: 'q257',
  polish_note: 'v15 rung 8->9 single-rung walk',
  new_answer: body
});

const t0 = Date.now();
const req = https.request({
  host: 'pulserevops.com',
  path: '/.netlify/functions/pulse-blob-polish',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  },
  timeout: 60000
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const elapsed = Date.now() - t0;
    console.log('STATUS:', res.statusCode);
    console.log('ELAPSED_MS:', elapsed);
    console.log('BODY:');
    console.log(data);
  });
});

req.on('error', (e) => {
  console.log('ERROR:', e.message);
});

req.on('timeout', () => {
  console.log('TIMEOUT after 60s');
  req.destroy();
});

req.write(payload);
req.end();
