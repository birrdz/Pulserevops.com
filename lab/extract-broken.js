const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'cheap-100');
const files = fs.readdirSync(dir).filter(f => /^q\d+\.json$/.test(f));
const broken = [];
for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  try { JSON.parse(raw); continue; } catch (e) {}
  const idM = raw.match(/"id":\s*"(q\d+)"/);
  const qM = raw.match(/"question":\s*"((?:[^"\\]|\\.)*)"/);
  if (idM && qM) {
    broken.push({ id: idM[1], q: qM[1].replace(/\\"/g, '"').replace(/\\n/g, ' ') });
  }
}
console.log(JSON.stringify(broken, null, 2));
