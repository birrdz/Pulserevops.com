// _serial_publish_driver.js — SERIAL PUBLISHER for grounded fabrication-regen.
// Scans C:/Users/koryj for ^(rs|dn|er)\d+_answer\.md$ files that:
//   (a) contain "## Sources"
//   (b) NOT modified in the last STALE_MS (~15s)
//   (c) id IS in _held_queue.json
// Publishes each READY id IN SERIES via _publish_one.js logic (publishTextFirst).
// On reject keeps the .md and logs reason. Prints a JSON summary at the end.
//   node _serial_publish_driver.js
require('./_ds_lib');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DIR = 'C:/Users/koryj';
const QUEUE = path.join(DIR, 'website', '_held_queue.json');
const STALE_MS = 15000;
const RE = /^(rs|dn|er)\d+_answer\.md$/;

function loadQueue() {
  return JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
}

(async () => {
  const queue = loadQueue();
  const titleOf = new Map(queue.map((q) => [q.id, q.question]));
  const now = Date.now();

  const files = fs.readdirSync(DIR).filter((f) => RE.test(f));
  const ready = [];
  const notInQueue = [];
  const notStale = [];
  const noSources = [];

  for (const f of files) {
    const id = f.replace(/_answer\.md$/, '');
    const full = path.join(DIR, f);
    let st;
    try { st = fs.statSync(full); } catch (e) { continue; }
    if (now - st.mtimeMs < STALE_MS) { notStale.push(id); continue; }
    if (!titleOf.has(id)) { notInQueue.push(id); continue; }
    const body = fs.readFileSync(full, 'utf8');
    if (!/##\s*Sources/i.test(body)) { noSources.push(id); continue; }
    ready.push(id);
  }

  ready.sort();
  console.log(JSON.stringify({
    phase: 'scan',
    total_md: files.length,
    ready: ready.length,
    ready_ids: ready,
    skipped_not_in_queue: notInQueue,
    skipped_not_stale: notStale,
    skipped_no_sources: noSources,
  }));

  const results = { published: [], rejected: [] };
  for (const id of ready) {
    const title = titleOf.get(id);
    try {
      const out = execFileSync('node', ['_publish_one.js', id, title], {
        cwd: path.join(DIR, 'website'),
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      results.published.push({ id, out: out.trim().slice(-200) });
      console.log('PUBLISHED', id);
    } catch (e) {
      const msg = ((e.stdout || '') + ' ' + (e.stderr || '')).trim().slice(-400);
      results.rejected.push({ id, reason: msg });
      console.log('REJECT', id, msg);
    }
  }

  console.log(JSON.stringify({
    phase: 'done',
    published_count: results.published.length,
    rejected_count: results.rejected.length,
    published_ids: results.published.map((r) => r.id),
    rejected: results.rejected,
  }));
})().catch((e) => { console.error('DRIVER ERR', e && e.message); process.exit(1); });
