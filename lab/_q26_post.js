// v15 t185 POST helper - replay-safe
// rung 5->6 for q26
const https = require('https');
const fs = require('fs');

const src = fs.readFileSync('lab/_q26_r6.js', 'utf8');
const m = src.match(/= `([\s\S]*)`;\s*$/);
if (!m) { console.error('could not extract body'); process.exit(1); }
const new_answer = m[1];

const payload = JSON.stringify({
  key: 'pulsemachine-writer-2026',
  id: 'q26',
  polish_note: 'v15 rung 5->6',
  new_answer,
});

const opts = {
  method: 'POST',
  hostname: 'pulserevops.com',
  path: '/.netlify/functions/pulse-blob-polish',
  headers: {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(payload),
  },
};

const t0 = Date.now();
const req = https.request(opts, (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => {
    const ms = Date.now() - t0;
    console.log('status:', res.statusCode, 'ms:', ms);
    console.log('body:', data.slice(0, 2000));
    fs.writeFileSync('lab/_q26_post_response.json', data);
  });
});
req.on('error', (e) => {
  console.error('REQ ERROR:', e.message);
});
req.setTimeout(120000, () => {
  console.error('TIMEOUT 120s');
  req.destroy();
});
req.write(payload);
req.end();
