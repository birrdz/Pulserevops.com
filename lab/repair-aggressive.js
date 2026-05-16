// Aggressive JSON repair for tail q*.json files.
// Handles: truncated tails, unescaped newlines in strings, unescaped quotes.
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'cheap-100');
const files = fs.readdirSync(dir).filter(f => /^q\d+\.json$/.test(f));

let ok = 0, repaired = 0;
const dead = [];

for (const f of files) {
  const p = path.join(dir, f);
  const raw = fs.readFileSync(p, 'utf8');
  try { JSON.parse(raw); ok++; continue; } catch (e) {}

  // Try repair sequence:
  let attempt = raw;

  // 1) Trailing-truncation: ends mid-string, no closing braces
  if (!attempt.trim().endsWith('}')) {
    const trimmed = attempt.trim();
    if (trimmed.endsWith('"')) {
      // Append missing fields
      const idM = attempt.match(/"id":\s*"([^"]+)"/);
      const tagsM = attempt.match(/TAGS:\s*([^"]+)"$/);
      const tags = tagsM ? tagsM[1].split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean) : [];
      attempt = trimmed +
        ',\n  "tags": ' + JSON.stringify(tags) +
        ',\n  "sources": [],\n  "ts": ' + Date.now() +
        ',\n  "model": "claude-haiku-4-5",\n  "lab_run": "drip-overnight"\n}';
      try { JSON.parse(attempt); fs.writeFileSync(p, attempt); repaired++; continue; } catch (e) {}
    }
  }

  // 2) Try escaping literal newlines inside the answer string.
  // The answer is the longest field. Find "answer": "..." and escape \n -> \\n inside.
  attempt = raw;
  const ansStart = attempt.indexOf('"answer":');
  if (ansStart !== -1) {
    // Find opening quote of value
    const valStart = attempt.indexOf('"', ansStart + 9);
    if (valStart !== -1) {
      // Find closing quote — first unescaped " followed by , or }
      let i = valStart + 1;
      let escaped = false;
      let valEnd = -1;
      while (i < attempt.length) {
        const ch = attempt[i];
        if (escaped) { escaped = false; i++; continue; }
        if (ch === '\\') { escaped = true; i++; continue; }
        if (ch === '"') {
          // Look ahead: if followed by whitespace + , or whitespace + }, this is end
          let j = i + 1;
          while (j < attempt.length && /\s/.test(attempt[j])) j++;
          if (attempt[j] === ',' || attempt[j] === '}') { valEnd = i; break; }
        }
        i++;
      }
      if (valEnd !== -1) {
        const before = attempt.slice(0, valStart + 1);
        const value = attempt.slice(valStart + 1, valEnd);
        const after = attempt.slice(valEnd);
        // Escape literal newlines, tabs, and unescaped quotes within value
        const fixedValue = value
          .replace(/\\/g, '\\\\')        // first escape existing backslashes
          .replace(/\\\\n/g, '\\n')      // restore intentional \n
          .replace(/\\\\t/g, '\\t')      // restore intentional \t
          .replace(/\\\\"/g, '\\"')      // restore intentional \"
          .replace(/\n/g, '\\n')         // escape literal newlines
          .replace(/\t/g, '\\t')         // escape literal tabs
          .replace(/\r/g, '');           // strip CRs
        attempt = before + fixedValue + after;
        try { JSON.parse(attempt); fs.writeFileSync(p, attempt); repaired++; continue; } catch (e) {}
      }
    }
  }

  // Couldn't repair
  dead.push(f);
}

console.log('files:', files.length);
console.log('ok:', ok);
console.log('repaired:', repaired);
console.log('dead:', dead.length);
if (dead.length && dead.length <= 30) console.log('dead files:', dead.join(', '));
