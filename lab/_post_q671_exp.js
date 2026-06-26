const fs = require('fs');
const https = require('https');

const id = 'q671';
const draftFile = 'C:/Users/koryj/website/lab/_gold_q671_solo.md';
const answer = fs.readFileSync(draftFile, 'utf8');

const payload = {
  key: 'pulsemachine-writer-2026',
  id: id,
  format_v: '2026-05',
  polish_note: 'expediter helper POST',
  new_answer: answer,
};

const wc = answer.trim().split(/\s+/).length;
console.log('id=' + id, 'format_v=' + payload.format_v, 'key.len=' + payload.key.length,
            'new_answer.len=' + answer.length, 'words=' + wc);

const data = JSON.stringify(payload);
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
