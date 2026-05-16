// Repair truncated q*.json files (worker quit mid-JSON before closing braces).
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'cheap-100');
const files = fs.readdirSync(dir).filter(f => /^q\d+\.json$/.test(f));
let fixed = 0;
for (const f of files) {
  const p = path.join(dir, f);
  const c = fs.readFileSync(p, 'utf8');
  try { JSON.parse(c); continue; } catch (e) {}
  const trimmed = c.trim();
  if (!trimmed.endsWith('"')) { console.log('skip nonstandard', f); continue; }
  const idMatch = c.match(/"id":\s*"([^"]+)"/);
  if (!idMatch) { console.log('skip noheader', f); continue; }
  const tagMatch = c.match(/TAGS:\s*([^"]+)"$/);
  const tags = tagMatch
    ? tagMatch[1].split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean)
    : [];
  const fixedJson = trimmed +
    ',\n  "tags": ' + JSON.stringify(tags) +
    ',\n  "sources": [],\n  "ts": ' + Date.now() +
    ',\n  "model": "claude-haiku-4-5",\n  "lab_run": "cheap-100"\n}';
  try {
    JSON.parse(fixedJson);
    fs.writeFileSync(p, fixedJson);
    fixed++;
  } catch (e2) { console.log('repair-fail', f, e2.message.slice(0, 100)); }
}
console.log('repaired:', fixed);
