// POST script for v15.2 tick 223 — gold-format reformat of q445
// (APAC/EMEA local-AE hiring formula). Reads the draft body from file —
// the 9,451-word body is never inlined. Endpoint: pulse-blob-polish.
// Gold-format pathway requires: key, id, new_answer(>=800), format_v, polish_note(>=8).
// Already POSTed successfully once (HTTP 200, gold_format:true). Do not re-run.
const fs = require('fs');
const https = require('https');

const body = fs.readFileSync(__dirname + '/_gold_v15_t223_draft.md', 'utf8');
const payload = {
  key: 'pulsemachine-writer-2026',
  id: 'q445',
  format_v: '2026-05',
  new_answer: body,
  polish_note: 'v15.2 t223 gold-format reformat — finisher verified all 10 gold elements and real cross-links',
};

console.log('id=' + payload.id, 'format_v=' + payload.format_v,
            'key.len=' + payload.key.length, 'new_answer.len=' + payload.new_answer.length,
            'words=' + body.trim().split(/\s+/).length);

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
