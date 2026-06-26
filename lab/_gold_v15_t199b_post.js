// v15.2 t199 Agent B - gold format POST for q223
const https = require('https');
const fs = require('fs');

const new_answer = fs.readFileSync('lab/_gold_v15_t199b_answer.md', 'utf8');
const words = new_answer.trim().split(/\s+/).length;
const chars = new_answer.length;
console.log('Pre-POST verify | chars:', chars, '| words:', words);
if (chars < 800) { console.error('FAIL: <800 chars'); process.exit(1); }
if (words < 9000 || words > 10000) { console.error('WARN: words outside 9000-10000:', words); }

const payload = JSON.stringify({
  key: 'pulsemachine-writer-2026',
  id: 'q223',
  polish_note: 'v15.2 gold-format 2026-05: full rewrite of PLG SDR/AE comp split — 70/30 first conversion, 30/70 expansion within 12mo, 100% AE after 12mo, 30-day sourcing window, whale cap at 2x MBO, Salesforce single source of truth, signed quarterly policy. 21 sections, worked example, edge cases, sources cited.',
  new_answer,
  format_v: '2026-05',
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
    console.log('body:', data.slice(0, 3000));
    fs.writeFileSync('lab/_gold_v15_t199b_response.json', data);
  });
});
req.on('error', (e) => {
  console.error('REQ ERROR:', e.message);
  fs.writeFileSync('lab/_gold_v15_t199b_retry_pending.json', JSON.stringify({error: e.message, ts: Date.now()}));
});
req.setTimeout(180000, () => {
  console.error('TIMEOUT 180s -> RETRY-PENDING');
  fs.writeFileSync('lab/_gold_v15_t199b_retry_pending.json', JSON.stringify({error: 'timeout-180s', ts: Date.now()}));
  req.destroy();
});
req.write(payload);
req.end();
