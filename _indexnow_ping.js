const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
for (const l of env.split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { pingIndexNowUrlList } = require('./netlify/functions/lib/indexnow-ping-entry');
const ids = [];
for (let i = 228; i <= 275; i++) ids.push('tk' + String(i).padStart(4, '0'));
const urls = ids.map(id => 'https://pulserevops.com/tech-stacks/' + id);
(async () => {
  const r = await pingIndexNowUrlList(urls);
  console.log(JSON.stringify(r, null, 2));
})();
