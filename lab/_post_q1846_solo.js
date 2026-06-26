const fs = require('fs');
const https = require('https');

const body = fs.readFileSync('_gold_q1846_solo.md', 'utf8');
const payload = {
  key: 'pulsemachine-writer-2026',
  id: 'q1846',
  format_v: '2026-05',
  polish_note: 'v15.2 batch gold-upgrade',
  new_answer: body,
};

const data = JSON.stringify(payload);
console.log('id=' + payload.id, 'format_v=' + payload.format_v,
            'key.len=' + payload.key.length,
            'new_answer.len=' + body.length,
            'word_count~' + body.trim().split(/\s+/).length,
            'polish_note=' + payload.polish_note);

const req = https.request('https://pulserevops.com/.netlify/functions/pulse-blob-polish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
}, res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => { console.log('HTTP ' + res.statusCode); console.log(b); });
});
req.on('error', e => console.error('ERR ' + e.message));
req.write(data);
req.end();
