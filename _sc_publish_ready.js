// Publishes any ready Schools sprint drafts: reads _sc_sprint_queue.json, and
// for each entry whose C:/Users/koryj/<id>_answer.md exists, runs _write_sc.js
// (grader-gated). Prints a compact published/rejected summary.
const fs = require('fs');
const { execFileSync } = require('child_process');
const Q = JSON.parse(fs.readFileSync('C:/Users/koryj/_sc_sprint_queue.json', 'utf8'));
let pub = 0, rej = 0, skip = 0;
for (const e of Q) {
  const md = 'C:/Users/koryj/' + e.id + '_answer.md';
  if (!fs.existsSync(md)) { skip++; continue; }
  try {
    const out = execFileSync('node', ['_write_sc.js', e.id, e.title, e.slug], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] });
    const line = out.trim().split('\n').pop();
    if (/"ok":true/.test(line)) { pub++; console.log('PUB  ' + e.id + ' — ' + e.title); }
    else { rej++; console.log('REJ  ' + e.id + ' :: ' + line.slice(0,160)); }
  } catch (err) {
    const msg = (err.stderr || err.stdout || String(err.message) || '').trim().split('\n').pop();
    rej++; console.log('REJ  ' + e.id + ' :: ' + msg.slice(0,160));
  }
}
console.log(`\n— published ${pub}, rejected ${rej}, not-ready ${skip} —`);
