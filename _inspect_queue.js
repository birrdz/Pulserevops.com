// One-shot diagnostic: read queue, priority flag, and try Gemini directly.
const fs = require('fs');
const path = require('path');
try {
  const envFile = path.join(__dirname, '.env.local');
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
} catch (_e) {}
const { getStore } = require('@netlify/blobs');
const https = require('https');

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

if (!TOK) { console.log('NO TOKEN'); process.exit(1); }

const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: TOK });

(async () => {
  const flag = await store.get('_visitor_priority.json', { type: 'json' });
  console.log('=== PRIORITY FLAG ===');
  console.log(JSON.stringify(flag, null, 2));

  const queue = await store.get('queue.json', { type: 'json' });
  console.log('\n=== QUEUE (top 6) ===');
  if (queue && queue.items) {
    console.log('Total items:', queue.items.length);
    queue.items.slice(0, 6).forEach((it, i) => {
      console.log(`  [${i}] src=${it.source} pri=${it.priority} ts=${new Date(it.ts).toISOString()}`);
      console.log(`        q: ${(it.q||'').slice(0, 140)}`);
      console.log(`        vq_id: ${it.vq_id}`);
    });
  } else {
    console.log('NO QUEUE');
  }

  console.log('\n=== GEMINI DIRECT TEST ===');
  const key = process.env.GEMINI_API_KEY;
  if (!key) { console.log('NO GEMINI_API_KEY in .env.local'); return; }
  const payload = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: 'Say hello in 5 words.' }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 50 },
  });
  await new Promise((resolve) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      timeout: 30000,
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', d.slice(0, 600));
        resolve();
      });
    });
    req.on('error', e => { console.log('ERR:', e.message); resolve(); });
    req.on('timeout', () => { console.log('TIMEOUT'); req.destroy(); resolve(); });
    req.write(payload);
    req.end();
  });
})();
