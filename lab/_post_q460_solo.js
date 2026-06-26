const fs = require('fs');
const https = require('https');

// v15.2 t227 solo gold-upgrade POST for q460.
// Reads the prepared payload (key, id, format_v, polish_note, new_answer)
// and POSTs once to pulse-blob-polish. new_answer body read from the draft.
const p = JSON.parse(fs.readFileSync('_payload_q460_solo.json', 'utf8'));
if (!p.polish_note || p.polish_note.length < 8) p.polish_note = 'v15.2 t227 solo gold-upgrade';
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
