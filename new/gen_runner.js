// new/gen_runner.js — STAGGERED generation runner (2026-07-15).
// Fires queued questions through generate.js ONE at a time, 5 minutes apart by default.
// Queue = new/gen_queue.json (the Block Builder's "Request batch" writes to it).
'use strict';
const fs = require('fs');
const { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const QF = __dirname + '/gen_queue.json';
const STAGGER_MS = Math.max(1, parseInt(process.env.GEN_STAGGER_MIN || '5', 10)) * 60000;

const q = () => { try { return JSON.parse(fs.readFileSync(QF, 'utf8')); } catch (e) { return { items: [] }; } };
const save = o => { try { fs.writeFileSync(QF, JSON.stringify(o, null, 1)); } catch (e) {} };
let running = false;

function tick() {
  if (running) return;
  const Q = q(); const now = Date.now();
  const due = (Q.items || []).filter(i => i.status === 'queued' && (i.runAt || 0) <= now).sort((a, b) => (a.runAt || 0) - (b.runAt || 0));
  if (!due.length) return;
  const next = due[0];
  running = true; next.status = 'running'; next.startedAt = new Date().toISOString(); save(Q);
  console.log('[runner] firing', next.id, '·', next.question);
  const c = spawn(process.execPath, [__dirname + '/generate.js', next.question], { cwd: WD });
  c.stdout.on('data', d => process.stdout.write('  ' + d));
  c.stderr.on('data', () => {});
  c.on('close', code => { const QQ = q(); const it = (QQ.items || []).find(x => x.id === next.id); if (it) { it.status = code === 0 ? 'done' : 'failed'; it.finishedAt = new Date().toISOString(); } save(QQ); running = false; console.log('[runner]', next.id, 'exit', code); });
  c.on('error', e => { running = false; console.log('[runner] spawn error', e.message); });
}
setInterval(tick, 20000); tick();
console.log('[runner] staggered runner up · one every ' + (STAGGER_MS / 60000) + ' min · queue ' + QF);
