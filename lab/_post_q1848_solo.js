// Solo gold-upgrade POST for q1848 — Pulse RevOps staggered batch tick 229.
// Reads the gold draft body from disk, POSTs to pulse-blob-polish.
// gold-format pathway: qs=10 entry + new_answer (>=800 chars) + format_v.
const fs = require('fs');
const https = require('https');

const body = fs.readFileSync('C:/Users/koryj/website/lab/_gold_q1848_solo.md', 'utf8');
const payload = {
  key: 'pulsemachine-writer-2026',
  id: 'q1848',
  format_v: '2026-05',
  new_answer: body,
  polish_note: 'v15.2 staggered-batch gold-upgrade'
};

console.log('id=' + payload.id, 'format_v=' + payload.format_v,
            'key.len=' + payload.key.length,
            'new_answer.len=' + payload.new_answer.length,
            'new_answer.words=' + payload.new_answer.trim().split(/\s+/).length,
            'polish_note=' + payload.polish_note);

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
