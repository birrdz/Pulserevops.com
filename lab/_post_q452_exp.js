const fs = require('fs');
const https = require('https');

const id = 'q452';
const body = fs.readFileSync(__dirname + '/_gold_' + id + '_solo.md', 'utf8');
const payload = {
  key: 'pulsemachine-writer-2026',
  id: id,
  format_v: '2026-05',
  polish_note: 'expediter helper POST',
  new_answer: body,
};
const words = body.trim().split(/\s+/).length;
console.log('id=' + id, 'new_answer.len=' + body.length, 'words=' + words);

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
