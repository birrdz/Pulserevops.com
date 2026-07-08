// _cro_tools_monitor.js — SUPERVISOR for the CRO/tools (tl) pillar.
// Continuously verifies that new tl entries keep RIDING INTO the index and the count
// keeps going UP. Every MON_SECS it reads tl count + max id from _index.json:
//   • count advancing  -> log OK
//   • not advancing for MON_STALL consecutive checks -> the writer is dead/stuck:
//       reconcile the index (heal blob->index lag) AND relaunch the new-write writer.
//   • every 5th check it reconciles anyway, so blob entries always reach the index.
// Background process — DIES on session/host close; relaunch at session start:
//   Start-Process node _cro_tools_monitor.js -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
// Stop: create _cro_tools_monitor_stop.flag . Log: _cro_tools_monitor.log
const fs = require('fs');
const { spawn, execSync } = require('child_process');
const { getStore } = require('@netlify/blobs');
const CWD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(CWD + '/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const MON_SECS = +(process.env.MON_SECS || 120);
const MON_STALL = +(process.env.MON_STALL || 3);
const log = m => { const line = '[' + new Date().toISOString() + '] ' + m; console.log(line); try { fs.appendFileSync(CWD + '/_cro_tools_monitor.log', line + '\n'); } catch (e) {} };
const sleep = () => new Promise(r => setTimeout(r, MON_SECS * 1000));

async function tlState() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const tl = (idx.entries || []).filter(e => /^tl\d+$/.test(e.id));
  let mx = 0; for (const e of tl) { const n = +e.id.slice(2); if (n > mx) mx = n; }
  return { count: tl.length, max: mx };
}
function writerAlive() {
  try { const out = execSync('powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name=\'node.exe\'\\" | Where-Object { $_.CommandLine -match \'_cro_ds_run\' }).Count"', { encoding: 'utf8' }); return parseInt(out.trim(), 10) > 0; } catch (e) { return false; }
}
function relaunchWriter() {
  log('relaunching new-write writer on _cro_ds_queue.json (conc=5, no force)');
  const env = { ...process.env, DS_DAILY_CAP: '1000000', CRO_CONC: process.env.CRO_CONC || '7', CRO_QUEUE: CWD + '/_cro_ds_queue.json' };
  delete env.CRO_FORCE;
  const out = fs.openSync(CWD + '/_cro_newwrites.out.log', 'a');
  const err = fs.openSync(CWD + '/_cro_newwrites.err.log', 'a');
  const p = spawn('node', ['_cro_ds_run.js'], { cwd: CWD, env, detached: true, stdio: ['ignore', out, err] });
  p.unref();
}
function reconcile() {
  log('reconcile tl (heal blob->index lag)');
  const p = spawn('node', ['_index_reconcile_any.js', 'tl'], { cwd: CWD, detached: true, stdio: 'ignore' });
  p.unref();
}

let lastMax = 0, stall = 0, checks = 0;
(async () => {
  log('monitor start (every ' + MON_SECS + 's, stall-relaunch after ' + MON_STALL + ' flat checks)');
  while (true) {
    if (fs.existsSync(CWD + '/_cro_tools_monitor_stop.flag')) { log('stop flag — exiting'); break; }
    checks++;
    let s; try { s = await tlState(); } catch (e) { log('state err ' + e.message); await sleep(); continue; }
    if (s.max > lastMax) { log('OK  tl count=' + s.count + ' maxId=tl' + s.max + ' (+' + (lastMax ? s.max - lastMax : 0) + ')'); lastMax = s.max; stall = 0; }
    else {
      stall++;
      const alive = writerAlive();
      log('FLAT ' + stall + '/' + MON_STALL + '  tl count=' + s.count + ' maxId=tl' + s.max + '  writer=' + (alive ? 'alive' : 'DEAD'));
      if (stall >= MON_STALL) { log('STALLED — reconcile + relaunch writer'); reconcile(); if (!alive) relaunchWriter(); else { log('writer alive but not advancing — relaunching fresh'); relaunchWriter(); } stall = 0; }
    }
    if (checks % 5 === 0) reconcile();
    await sleep();
  }
})().catch(e => { log('FATAL ' + e.message); process.exit(1); });
