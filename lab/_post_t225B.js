const fs = require('fs');
const https = require('https');

const answer = fs.readFileSync('C:/Users/koryj/website/lab/_gold_q446_FINAL.md', 'utf8');
const payload = {
  key: 'pulsemachine-writer-2026',
  id: 'q446',
  format_v: '2026-05',
  new_answer: answer,
  polish_note: 'v15.2 t225 staggered-crew gold reformat - slot B closer assembled 3 blocks'
};

console.log('id=' + payload.id, 'format_v=' + payload.format_v,
            'key.len=' + payload.key.length,
            'new_answer.len=' + payload.new_answer.length,
            'words=' + payload.new_answer.trim().split(/\s+/).length,
            'note.len=' + payload.polish_note.length);

const data = JSON.stringify(payload);
const req = https.request('https://pulserevops.com/.netlify/functions/pulse-blob-polish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
}, res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('HTTP ' + res.statusCode);
    console.log(b);
    fs.writeFileSync('C:/Users/koryj/website/lab/_post_t225B_response.json', b);
  });
});
req.on('error', e => console.error('ERR ' + e.message));
req.write(data);
req.end();
