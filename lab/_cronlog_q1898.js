const https = require('https');
const payload = {
  key: 'pulsemachine-writer-2026',
  task: 'goldformat',
  tick: 283,
  ids: ['q1898'],
  summary: 'Gold-upgrade in progress - q1898 (RevOps stack vs AI auto-coaching)'
};
const data = JSON.stringify(payload);
const req = https.request('https://pulserevops.com/.netlify/functions/pulse-cron-log', {
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
