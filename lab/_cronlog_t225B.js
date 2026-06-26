const https = require('https');
const data = JSON.stringify({
  key: 'pulsemachine-writer-2026',
  task: 'goldformat',
  tick: 225,
  summary: 'Gold cycle t225 slot B CLOSER in flight - q446'
});
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
