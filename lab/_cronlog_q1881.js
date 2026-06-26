const https = require('https');
const payload = {
  key: 'pulsemachine-writer-2026',
  task: 'goldformat',
  tick: 268,
  ids: ['q1881'],
  summary: 'Gold-upgrade in progress - q1881 (what replaces call recording)'
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
