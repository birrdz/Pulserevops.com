const fs = require('fs');
const https = require('https');

const draft = fs.readFileSync('C:/Users/koryj/website/lab/_gold_q2145_solo_t229.md', 'utf8');
const p = {
  key: 'pulsemachine-writer-2026',
  id: 'q2145',
  format_v: '2026-05',
  new_answer: draft,
  polish_note: 'v15.2 batch gold-upgrade',
};

console.log('id=' + p.id, 'format_v=' + p.format_v, 'key.len=' + p.key.length,
            'new_answer.len=' + p.new_answer.length, 'polish_note=' + p.polish_note);

const data = JSON.stringify(p);
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
