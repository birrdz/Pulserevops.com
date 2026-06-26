// Grade local _answer.md files WITHOUT publishing. Usage: node _q_precheck.js q12853 q12854 ...
const fs = require('fs');
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
for (const id of process.argv.slice(2)) {
  const p = 'C:/Users/koryj/' + id + '_answer.md';
  if (!fs.existsSync(p)) { console.log(id, 'NO FILE'); continue; }
  const body = fs.readFileSync(p, 'utf8');
  const g = gradeEntry(id, body);
  const flags = [];
  if (g.word_count < 1200) flags.push('THIN' + g.word_count);
  if (g.banned_hits.length) flags.push('BAN:' + g.banned_hits.join('/'));
  if (g.mermaid_count < 2) flags.push('mer' + g.mermaid_count);
  if (g.score < 12) flags.push('miss:' + g.missing.join(','));
  console.log(id, 'score=' + g.score + '/12', 'words=' + g.word_count, flags.length ? '<< ' + flags.join(' ') : 'OK>=1200');
}
