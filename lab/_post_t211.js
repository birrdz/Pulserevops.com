const fs = require('fs');
const https = require('https');

const file = process.argv[2];
const note = process.argv[3];
const p = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!p.polish_note || p.polish_note.length < 8) p.polish_note = note;
console.log('id=' + p.id, 'format_v=' + p.format_v, 'key.len=' + (p.key || '').length,
            'new_answer.len=' + (p.new_answer || '').length, 'polish_note=' + p.polish_note);

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
