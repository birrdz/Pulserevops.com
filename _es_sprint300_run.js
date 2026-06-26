// Generate + publish es0051–es0350 (300 estates Top-10 entries).
// Usage: node _es_sprint300_run.js [startId] [--dry-run]
// Image pipeline: DDG-slow (sequential via _write_es.js) — expect ~2–5 min/entry for Top-10 covers + product cards.
const fs = require('fs');
const { execSync } = require('child_process');
const { buildBody } = require('./_es_sprint300_bodies');
const { createBatchProgressReporter } = require('./_progress_email');

const QUEUE = JSON.parse(fs.readFileSync('C:/Users/koryj/website/_es_sprint300.json', 'utf8'));
const PROG = 'C:/Users/koryj/website/_es_sprint300_progress.json';
const LOG = 'C:/Users/koryj/website/_es_sprint300_run.log';
const DRY = process.argv.includes('--dry-run');
const startArg = process.argv.find((a) => /^es\d+$/i.test(a));

const done = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')).done || [] : [];
const doneSet = new Set(done);
let items = QUEUE.filter((q) => !doneSet.has(q.id));
if (startArg) items = items.filter((q) => q.id >= startArg.toLowerCase());

function log(line) {
  fs.appendFileSync(LOG, line + '\n');
  console.log(line);
}

function publish(id, title, slug, body) {
  const path = `C:/Users/koryj/${id}_answer.md`;
  fs.writeFileSync(path, body);
  const titleEsc = title.replace(/"/g, '\\"');
  const out = execSync(`node _write_es.js ${id} "${titleEsc}" ${slug}`, {
    cwd: 'C:/Users/koryj/website',
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 20 * 1024 * 1024,
  });
  const line = out.trim().split('\n').pop();
  return JSON.parse(line);
}

(async () => {
  const progress = createBatchProgressReporter({
    label: 'PULSE es sprint300',
    total: items.length,
    interval: 10,
    pillarUrl: 'https://pulserevops.com/estates',
  });
  await progress.start(`<p>Publishing <b>${items.length}</b> estates entries (${items[0]?.id || 'none'} → ${items[items.length - 1]?.id || 'none'})</p>`);

  let pub = 0;
  let rej = 0;
  for (const item of items) {
    try {
      const body = buildBody(item.title);
      if (DRY) {
        fs.writeFileSync(`C:/Users/koryj/${item.id}_answer.md`, body);
        log(`DRY ${item.id} ${body.split(/\s+/).length}w`);
        pub++;
      } else {
        const r = publish(item.id, item.title, item.slug, body);
        if (!r.ok) {
          rej++;
          log(`REJ ${item.id} write ${JSON.stringify(r)}`);
          await progress.fail(`${item.id} write failed`);
          continue;
        }
        pub++;
        log(`OK ${item.id} ${r.words || '?'}w ${r.url}`);
      }
      done.push(item.id);
      const onDisk = fs.existsSync(PROG) ? JSON.parse(fs.readFileSync(PROG, 'utf8')).done || [] : [];
      const merged = [...new Set([...onDisk, ...done])];
      fs.writeFileSync(PROG, JSON.stringify({ done: merged, updated: new Date().toISOString() }, null, 2));
      await progress.tick(`${item.id} ${item.title.slice(0, 50)}`);
    } catch (e) {
      rej++;
      log(`ERR ${item.id} ${e.message}`);
      await progress.fail(`${item.id}: ${e.message}`);
    }
  }

  await progress.complete(`<p>Published <b>${pub}</b>, rejected <b>${rej}</b>. Run <code>node _es_finish.js</code> for SEO hub sync + verify + deploy.</p>`);
  log(`DONE published=${pub} rejected=${rej}`);
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
