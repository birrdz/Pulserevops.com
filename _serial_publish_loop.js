// _serial_publish_loop.js — long-running SERIAL PUBLISHER poll loop.
// Polls C:/Users/koryj for ^(rs|dn|er)\d+_answer\.md$ that:
//   (a) contain "## Sources"
//   (b) NOT modified in last STALE_MS (~15s)  [also tracks ANY .md activity for idle-stop]
//   (c) id IS in _held_queue.json (live-reloaded each pass)
// Publishes ready ids IN SERIES via _publish_one.js.
//   - every 10 successful publishes: reconcile + drop cleared ids + update _held_count.txt + email
//   - stops when no in-queue ready files for ~IDLE_STOP_MS AND no .md activity in that window
//   - then FINAL reconcile, prints summary, exits.
require('./_ds_lib');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const https = require('https');

const HOME = 'C:/Users/koryj';
const WEB = 'C:/Users/koryj/website';
const QUEUE = path.join(WEB, '_held_queue.json');
const COUNT = path.join(WEB, '_held_count.txt');
const STALE_MS = 15000;
const IDLE_STOP_MS = 5 * 60 * 1000; // 5 min
const POLL_MS = 20000;
const RE = /^(rs|dn|er)\d+_answer\.md$/;

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

function loadQueue() {
  try { return JSON.parse(fs.readFileSync(QUEUE, 'utf8')); } catch (e) { return []; }
}
function saveQueue(q) { fs.writeFileSync(QUEUE, JSON.stringify(q)); }
function writeCount(n) { fs.writeFileSync(COUNT, 'held entries: ' + n + '\n'); }

function emailProgress(subject, html) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ subject, html });
    const req = https.request({
      hostname: 'pulserevops.com',
      path: '/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => { res.on('data', () => {}); res.on('end', () => resolve(res.statusCode)); });
    req.on('error', (e) => { log('email err', e.message); resolve(0); });
    req.write(data); req.end();
  });
}

function reconcile() {
  try {
    const out = execFileSync('node', ['_index_reconcile_any.js', 'rs', 'dn', 'er'], { cwd: WEB, encoding: 'utf8' });
    log('RECONCILE:', out.trim().replace(/\n/g, ' | '));
  } catch (e) { log('RECONCILE ERR', ((e.stdout || '') + (e.stderr || '')).slice(-200)); }
}

let totalPublished = 0;
let totalRejected = 0;
const perPillar = { rs: 0, dn: 0, er: 0 };
const rejects = [];
let sinceLastBatch = 0;
let lastActivity = Date.now();

async function batchHousekeeping(clearedIds) {
  reconcile();
  let q = loadQueue();
  const before = q.length;
  const cleared = new Set(clearedIds);
  q = q.filter((e) => !cleared.has(e.id));
  saveQueue(q);
  writeCount(q.length);
  log(`housekeeping: dropped ${before - q.length} cleared, remaining held ${q.length}`);
  const sub = `PULSE — ${totalPublished} regen published (+batch)`;
  const html = `<h3>Grounded regen — serial publisher</h3>
    <p><b>Cleared this run:</b> ${totalPublished} (rs ${perPillar.rs} / dn ${perPillar.dn} / er ${perPillar.er})</p>
    <p><b>Rejected:</b> ${totalRejected}</p>
    <p><b>Remaining held:</b> ${q.length}</p>`;
  const code = await emailProgress(sub, html);
  log('email status', code);
}

function scanReady() {
  const queue = loadQueue();
  const titleOf = new Map(queue.map((q) => [q.id, q.question]));
  const now = Date.now();
  const files = fs.readdirSync(HOME).filter((f) => RE.test(f));
  const ready = [];
  let anyRecentActivity = false;
  for (const f of files) {
    const id = f.replace(/_answer\.md$/, '');
    const full = path.join(HOME, f);
    let st; try { st = fs.statSync(full); } catch (e) { continue; }
    if (now - st.mtimeMs < STALE_MS) { anyRecentActivity = true; continue; }
    if (!titleOf.has(id)) continue;
    const body = fs.readFileSync(full, 'utf8');
    if (!/##\s*Sources/i.test(body)) continue;
    ready.push({ id, title: titleOf.get(id) });
  }
  return { ready, anyRecentActivity, queueLen: queue.length };
}

(async () => {
  log('LOOP START. queue', loadQueue().length);
  while (true) {
    const { ready, anyRecentActivity, queueLen } = scanReady();
    if (anyRecentActivity || ready.length) lastActivity = Date.now();

    if (ready.length) {
      ready.sort((a, b) => a.id.localeCompare(b.id));
      log(`scan: ${ready.length} ready, ${queueLen} held`);
      const clearedThisPass = [];
      for (const { id, title } of ready) {
        try {
          const out = execFileSync('node', ['_publish_one.js', id, title], { cwd: WEB, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
          totalPublished++; sinceLastBatch++;
          const pfx = id.replace(/[0-9]+$/, ''); if (perPillar[pfx] != null) perPillar[pfx]++;
          clearedThisPass.push(id);
          log('PUBLISHED', id, '#' + totalPublished);
          if (sinceLastBatch >= 10) {
            await batchHousekeeping(clearedThisPass.splice(0));
            sinceLastBatch = 0;
          }
        } catch (e) {
          totalRejected++;
          const msg = ((e.stdout || '') + ' ' + (e.stderr || '')).trim().slice(-300);
          rejects.push({ id, reason: msg });
          log('REJECT', id, msg);
        }
      }
      if (clearedThisPass.length) { // flush remainder of this pass into queue cleanup
        reconcile();
        let q = loadQueue().filter((e) => !clearedThisPass.includes(e.id));
        saveQueue(q); writeCount(q.length);
        log('flush: remaining held', q.length);
      }
      lastActivity = Date.now();
      continue; // immediately rescan
    }

    if (Date.now() - lastActivity > IDLE_STOP_MS) {
      log('IDLE > 5min, stopping.');
      break;
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }

  reconcile();
  const q = loadQueue();
  log(JSON.stringify({
    phase: 'FINAL',
    total_published: totalPublished,
    per_pillar: perPillar,
    total_rejected: totalRejected,
    rejects,
    remaining_held: q.length,
  }));
})().catch((e) => { console.error('LOOP ERR', e && e.stack); process.exit(1); });
