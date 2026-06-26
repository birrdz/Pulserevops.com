// Removes the given ids from _held_queue.json and updates _held_count.txt.
//   node _wave2_dropfromqueue.js id1 id2 ...
const fs = require('fs');
const qp = 'C:/Users/koryj/website/_held_queue.json';
const cp = 'C:/Users/koryj/website/_held_count.txt';
const drop = new Set(process.argv.slice(2));
if (!drop.size) { console.log('no ids given'); process.exit(0); }
let q = JSON.parse(fs.readFileSync(qp, 'utf8'));
const before = q.length;
q = q.filter(e => !drop.has(e.id));
fs.writeFileSync(qp, JSON.stringify(q));
fs.writeFileSync(cp, String(q.length) + '\n');
console.log('dropped', before - q.length, 'remaining held:', q.length);
