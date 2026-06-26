// Publish-guard: enforces 12/12 AND >=1200 words BEFORE invoking _write_<pillar>.js
// Usage: node _pub.js <id> "<question>" "tag1,tag2" [writer]
//   writer defaults to _write_q.js
const fs = require('fs');
const { execFileSync } = require('child_process');
const { gradeEntry } = require('C:/Users/koryj/website/netlify/functions/lib/grade-entry');

const ID = process.argv[2];
const Q = process.argv[3];
const TAGS = process.argv[4] || '';
const WRITER = process.argv[5] || '_write_q.js';
const BODY = `C:/Users/koryj/${ID}_answer.md`;

if (!ID || !Q) { console.error('usage: node _pub.js <id> "<q>" "tags" [writer]'); process.exit(1); }
const body = fs.readFileSync(BODY, 'utf8');
const g = gradeEntry(ID, body);
const LAW = 1200;
if (g.score < 12) { console.error(`BLOCK ${ID}: score ${g.score}/12 missing ${g.missing.join(',')}`); process.exit(2); }
if (g.word_count < LAW) { console.error(`BLOCK ${ID}: ${g.word_count} words < ${LAW} LAW`); process.exit(3); }
if (g.banned_hits.length) { console.error(`BLOCK ${ID}: banned ${g.banned_hits.join(',')}`); process.exit(4); }
console.log(`GATE OK ${ID}: 12/12, ${g.word_count} words`);
const out = execFileSync('node', [`C:/Users/koryj/website/${WRITER}`, ID, Q, TAGS], { encoding: 'utf8' });
process.stdout.write(out);
