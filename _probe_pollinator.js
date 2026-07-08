const fs = require('fs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const k = process.env.POLLINATOR_API_KEY || process.env.POLLINATIONS_TOKEN || process.env.POLLINATIONS_API_KEY || '';
const t0 = Date.now();
fetch('https://image.pollinations.ai/prompt/test%20flux%20probe?width=200&height=200&nologo=true&model=flux&seed=42', {
  headers: k ? { Authorization: 'Bearer ' + k } : {},
  signal: AbortSignal.timeout(30000),
}).then(async r => {
  const b = await r.arrayBuffer();
  console.log(JSON.stringify({ ok: r.ok, status: r.status, bytes: b.byteLength, ms: Date.now() - t0, hasKey: !!k }));
}).catch(e => console.log(JSON.stringify({ ok: false, err: e.message, ms: Date.now() - t0, hasKey: !!k })));
