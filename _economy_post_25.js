// Post up to 25 pending lines from _economy_queue.txt (economy-mode). Then stop.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LIMIT = parseInt(process.argv[2] || '25', 10);
const QUEUE = path.join(__dirname, '_economy_queue.txt');
const LOG = path.join(__dirname, '_economy_post_25_log.txt');

const log = [];
for (let i = 0; i < LIMIT; i++) {
  const out = execSync('node _economy_post_one.js', { cwd: __dirname, encoding: 'utf8' });
  const line = out.trim();
  if (line.includes('QUEUE_EMPTY')) {
    log.push(`STOP empty at ${i}`);
    break;
  }
  try {
    const j = JSON.parse(line);
    log.push(`${j.ok ? 'OK' : 'FAIL'}\t${j.id || ''}\t${j.status}\t${(j.question || '').slice(0, 80)}`);
    console.log(j.ok ? `OK ${j.id}` : `FAIL ${j.status} ${j.body}`);
    if (!j.ok) break;
  } catch {
    log.push(`RAW\t${line.slice(0, 120)}`);
  }
}

fs.writeFileSync(LOG, log.join('\n') + '\n', 'utf8');
console.log(`\nWrote ${LOG} (${log.length} lines)`);
