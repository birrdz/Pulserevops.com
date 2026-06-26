// One-off Grok image smoke test — no API keys logged.
const path = require('path');
try {
  require('./netlify/functions/lib/load-env-local').loadEnvLocal(path.join(__dirname));
} catch (_) {
  const fs = require('fs');
  const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const { grokKey, grokCoverFor } = require('./netlify/functions/lib/grok-image-lib');

(async () => {
  const key = grokKey();
  console.log('grokKey present:', !!key, 'len:', key ? key.length : 0);
  if (!key) {
    console.error('FAIL: set GROK_API_KEY or XAI_API_KEY in .env.local');
    process.exit(1);
  }
  const title = 'Top 10 Luxury Beach Resorts in the Maldives';
  console.log('generating resort cover via Grok...');
  const url = await grokCoverFor(title, 'rs0999');
  if (url) {
    console.log('SUCCESS:', url);
    process.exit(0);
  }
  console.error('FAIL: grokCoverFor returned null');
  process.exit(1);
})();
