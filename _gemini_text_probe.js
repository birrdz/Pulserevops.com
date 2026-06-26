const fs = require('fs');
for (const l of fs.readFileSync(__dirname + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const key = process.env.GEMINI_API_KEY;
(async () => {
  const r = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'say hi in 3 words' }] }] }),
      signal: AbortSignal.timeout(30000),
    }
  );
  const j = await r.json();
  console.log('text status', r.status, 'err', (j.error && j.error.message) || 'ok');
  if (j.candidates) console.log('reply', j.candidates[0].content.parts[0].text);
})();
