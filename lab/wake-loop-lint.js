// Lint: check word count, structure, banned phrases, TAGS line per entry.
const ENTRIES = require('./wake-loop-data.js');

const BANNED = [
  /\bleverag(e|es|ed|ing)\b/i,
  /\butiliz(e|es|ed|ing)\b/i,
  /\bdelve into\b/i,
  /\bdelv(e|es|ed|ing)\b/i,
  /\bsynerg(y|ies)\b/i,
  /\bbest-in-class\b/i,
  /\bworld-class\b/i,
  /\bcutting-edge\b/i,
  /\bstreamlin(e|es|ed|ing)\b/i,
  /\btapestry\b/i,
  /in today's\b/i,
  /\bever-evolving\b/i,
  /\bparadigm shift\b/i,
  /\bgame-changer\b/i,
  /\bgame-changing\b/i,
  /\bholistic\b/i,
  /\brobust\b/i,
  /\bdive into\b/i,
  /\bnavigate the\b/i,
  /\bunlock value\b/i,
  /\bdrive growth\b/i,
];

let issues = 0;
for (let i = 0; i < ENTRIES.length; i++) {
  const e = ENTRIES[i];
  const wc = e.answer.split(/\s+/).filter(Boolean).length;
  const hasMermaid = /```mermaid/.test(e.answer);
  const hasTable = /\|.*\|.*\n\|\s*[-:]/.test(e.answer);
  const hasTags = /TAGS:/.test(e.answer);
  const sourcesOk = Array.isArray(e.sources) && e.sources.length >= 4;
  const banned = [];
  for (const re of BANNED) {
    const m = e.answer.match(re);
    if (m) banned.push(m[0]);
  }
  const flags = [];
  if (wc < 600) flags.push(`SHORT(${wc})`);
  if (wc > 1500) flags.push(`LONG(${wc})`);
  if (!hasMermaid) flags.push('NO_MERMAID');
  if (!hasTable) flags.push('NO_TABLE');
  if (!hasTags) flags.push('NO_TAGS');
  if (!sourcesOk) flags.push('NEEDS_4_SOURCES');
  if (banned.length) flags.push(`BANNED(${banned.join(',')})`);
  if (flags.length) {
    issues++;
    console.log(`[${i + 1}] ${flags.join(' ')} :: ${e.q.slice(0, 70)}`);
  }
}
console.log(`\n${ENTRIES.length} entries; ${issues} with issues.`);
