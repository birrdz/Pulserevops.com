// Prints exact title for an id from _held_queue.json
const fs = require('fs');
const q = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_held_queue.json', 'utf8'));
const id = process.argv[2];
const e = q.find(x => x.id === id);
if (!e) { process.stderr.write('NOT_IN_QUEUE'); process.exit(3); }
process.stdout.write(e.question);
