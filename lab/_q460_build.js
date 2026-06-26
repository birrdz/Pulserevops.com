// Build rewrite-q460-deep.js by concatenating the pieces.
const fs = require('fs');
const path = require('path');

const dir = __dirname;

const header = `// q460 -- How do you structure in-person vs. virtual kickoffs for maximum engagement?
// Deep rewrite using ADAPTED ANALYTICAL STRUCTURE: Bottom Line + intro paragraphs + TOC + 4 ANALYTICAL PARTs.
const { getStore } = require('@netlify/blobs');
const fs = require('fs');
const path = require('path');
const { runPolish } = require('./polish-helper');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\\r?\\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
if (!process.env.BLOBS_PAT && process.env.NETLIFY_AUTH_TOKEN) process.env.BLOBS_PAT = process.env.NETLIFY_AUTH_TOKEN;

const ID = 'q460';

`;

// Read the current file to extract tldr
const current = fs.readFileSync(path.join(dir, 'rewrite-q460-deep.js'), 'utf8');
// Extract the tldr backtick string
const tldrMatch = current.match(/const tldr = `([\s\S]*?)`;/);
if (!tldrMatch) { console.error('Could not extract tldr from current file'); process.exit(1); }
const tldrBody = tldrMatch[1];

const tldrSection = "const tldr = `" + tldrBody + "`;\n";

let corePart1to3 = fs.readFileSync(path.join(dir, '_q460_core.txt'), 'utf8');
// Strip the trailing closing backtick + semicolon — we need to keep core open so part4 can be appended.
corePart1to3 = corePart1to3.replace(/`;\s*$/, '');
// _q460_core.txt starts with "\n\nconst core = `\n\n..." and ends after PART 3 with "\n---\n\n`;\n"
// But it doesn't have the closing backtick. Let me check structure: it ends with "---\n\n`;\n" actually wait the file is:
//   `\n\nconst core = `\n\n<intro paragraphs>\n<TL;DR>\n<TOC>\n---\n## PART 1...\n...\n## PART 3...\n---\n\n`
// The closing backtick is NOT in _q460_core.txt. The part4 content is in _q460_part4.txt and needs to be appended INSIDE the core backtick.

let part4Body = fs.readFileSync(path.join(dir, '_q460_part4.txt'), 'utf8');
part4Body = part4Body.replace(/`;\s*$/, '');

// part4Body starts with "\n## 📈 PART 4 ..." and ends with "...verdict ...).\n\n"
// We need to close core string after part4.

const coreSection = corePart1to3 + part4Body + "`;\n";

const flowSection = fs.readFileSync(path.join(dir, '_q460_flow.txt'), 'utf8');
const numSection = fs.readFileSync(path.join(dir, '_q460_num.txt'), 'utf8');
const counterSection = fs.readFileSync(path.join(dir, '_q460_counter.txt'), 'utf8');

const combined = header + tldrSection + coreSection + flowSection + numSection + counterSection;

fs.writeFileSync(path.join(dir, 'rewrite-q460-deep.js'), combined, 'utf8');
console.log('Wrote rewrite-q460-deep.js, length:', combined.length);
