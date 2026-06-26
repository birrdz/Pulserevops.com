const fs = require('fs');
const https = require('https');

const body = fs.readFileSync(__dirname + '/_gold_q2143_solo.md', 'utf8');
const p = {
  key: 'pulsemachine-writer-2026',
  id: 'q2143',
  format_v: '2026-05',
  new_answer: body,
  polish_note: 'v15.2 batch gold-upgrade',
};

console.log('id=' + p.id, 'format_v=' + p.format_v, 'key.len=' + p.key.length,
            'new_answer.len=' + p.new_answer.length, 'words=' + p.new_answer.trim().split(/\s+/).length,
            'polish_note=' + p.polish_note);

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
