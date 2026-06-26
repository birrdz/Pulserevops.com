// POST helper for v15 tick 173 — vq_1uh7n7i rung 5->6
const https = require('https');
const { new_answer } = require('./_qvq_1uh7n7i_r6.js');

const body = JSON.stringify({
  key: 'pulsemachine-writer-2026',
  id: 'vq_1uh7n7i',
  polish_note: 'v15 rung 5->6',
  new_answer,
});

const opts = {
  method: 'POST',
  hostname: 'pulserevops.com',
  path: '/.netlify/functions/pulse-blob-polish',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
  timeout: 90_000,
};

function go() {
  return new Promise((resolve, reject) => {
    const req = https.request(opts, (res) => {
      let buf = '';
      res.on('data', (c) => (buf += c));
      res.on('end', () => resolve({ status: res.statusCode, body: buf }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.write(body);
    req.end();
  });
}

(async () => {
  try {
    const r = await go();
    console.log('STATUS:', r.status);
    console.log('BODY:', r.body);
  } catch (e) {
    console.log('FIRST ATTEMPT FAILED:', e.message, '- retrying once');
    try {
      const r2 = await go();
      console.log('RETRY STATUS:', r2.status);
      console.log('RETRY BODY:', r2.body);
    } catch (e2) {
      console.log('RETRY FAILED:', e2.message);
      process.exit(1);
    }
  }
})();
