const fs = require('fs');
const https = require('https');

const draftPath = 'C:/Users/koryj/website/lab/_gold_q2144_solo_t229batch.md';
const body = fs.readFileSync(draftPath, 'utf8');

const payload = {
  key: 'pulsemachine-writer-2026',
  id: 'q2144',
  polish_note: 'v15.2 staggered-batch gold-upgrade',
  new_answer: body,
  format_v: '2026-05',
};

const wc = body.trim().split(/\s+/).length;
console.log('id=' + payload.id, 'format_v=' + payload.format_v,
            'new_answer.len=' + body.length, 'words=' + wc,
            'polish_note=' + payload.polish_note);

const data = JSON.stringify(payload);
const req = https.request('https://pulserevops.com/.netlify/functions/pulse-blob-polish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
}, res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => { console.log('HTTP ' + res.statusCode); console.log(b); });
});
req.on('error', e => console.error('ERR ' + e.message));
req.write(data);
req.end();
