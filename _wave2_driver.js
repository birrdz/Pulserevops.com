// Combined serial publish driver for wave2 rs/er.
// Loop: find ready (in-queue, has ## Sources, mtime>15s) -> publish each in series
//   -> drop cleared from _held_queue.json + update _held_count.txt -> repeat.
// Exits after IDLE_LIMIT consecutive idle polls (no ready files). Prints JSONL log
// + final SUMMARY. Designed to be run repeatedly; safe/idempotent (queue membership
// is the gate; published ids leave the queue so they won't be retried).
require('./_ds_lib');
const fs = require('fs');
const { publishTextFirst } = require('./_ds_publish');
const QP = 'C:/Users/koryj/website/_held_queue.json';
const CP = 'C:/Users/koryj/website/_held_count.txt';
const DIR = 'C:/Users/koryj';
const IDLE_LIMIT = parseInt(process.env.IDLE_LIMIT || '8', 10); // 8 * 30s = 4 min
const POLL_MS = 30000;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function loadQueue() { return JSON.parse(fs.readFileSync(QP, 'utf8')); }
function inQueueSet(q) { return new Set(q.filter(e => /^(rs|er)\d+$/.test(e.id)).map(e => e.id)); }
function titleMap(q) { const m = {}; for (const e of q) m[e.id] = e.question; return m; }

function findReady(inQ) {
  const now = Date.now();
  const ready = [];
  for (const f of fs.readdirSync(DIR)) {
    const m = f.match(/^((rs|er)\d+)_answer\.md$/);
    if (!m) continue;
    const id = m[1];
    if (!inQ.has(id)) continue;
    const fp = DIR + '/' + f;
    let st, body;
    try { st = fs.statSync(fp); body = fs.readFileSync(fp, 'utf8'); } catch (e) { continue; }
    if ((now - st.mtimeMs) > 15000 && /##\s*Sources/i.test(body)) ready.push(id);
  }
  return ready.sort();
}

function dropFromQueue(ids) {
  if (!ids.length) return;
  let q = loadQueue();
  const drop = new Set(ids);
  q = q.filter(e => !drop.has(e.id));
  fs.writeFileSync(QP, JSON.stringify(q));
  fs.writeFileSync(CP, String(q.length) + '\n');
}

(async () => {
  const okAll = [], rejAll = [];
  let idle = 0;
  while (idle < IDLE_LIMIT) {
    const q = loadQueue();
    const inQ = inQueueSet(q);
    const tmap = titleMap(q);
    const ready = findReady(inQ);
    if (!ready.length) {
      idle++;
      console.log(JSON.stringify({ t: new Date().toISOString().slice(11,19), idle, msg: 'no ready' }));
      await sleep(POLL_MS);
      continue;
    }
    idle = 0;
    const cleared = [];
    for (const id of ready) {
      const title = tmap[id];
      if (!title) { rejAll.push({ id, reason: 'not_in_queue' }); console.log(JSON.stringify({ id, ok: false, reason: 'not_in_queue' })); continue; }
      try {
        const r = await publishTextFirst(id, title);
        console.log(JSON.stringify({ id, ok: r.ok, score: r.score, words: r.words, reason: r.reason || null }));
        if (r.ok) { okAll.push(id); cleared.push(id); }
        else rejAll.push({ id, reason: r.reason || ('score<10(' + r.score + ')') });
      } catch (e) {
        console.log(JSON.stringify({ id, ok: false, reason: 'ERR:' + (e && e.message) }));
        rejAll.push({ id, reason: 'ERR:' + (e && e.message) });
      }
    }
    dropFromQueue(cleared);
  }
  const remaining = loadQueue().filter(e => /^(rs|er)\d+$/.test(e.id)).length;
  console.log('SUMMARY ' + JSON.stringify({ published: okAll.length, ok: okAll, rejects: rejAll, remainingRsEr: remaining }));
})();
