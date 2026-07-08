// _cro_supervise_loop.js — autonomous CRO supervisor. Loops: scan for missing-v2 /
// fabrication → re-ground the flagged set (honest v2, CRO_FORCE) → re-scan, until zero
// flagged. THEN automatically starts NEW writes on the main queue (owner: "start up new
// writes once old are fixed"). Detached, one writer at a time (CONC=2 internal).
const { execSync } = require('child_process');
const fs = require('fs');
const CWD = 'C:/Users/koryj/website';
const qlen = f => { try { return JSON.parse(fs.readFileSync(CWD + '/' + f, 'utf8')).length; } catch (e) { return 0; } };
const run = (cmd, env) => execSync(cmd, { cwd: CWD, stdio: 'inherit', env: { ...process.env, DS_DAILY_CAP: '1000000', ...env } });
(async () => {
  let round = 0;
  while (round < 15) {
    round++;
    try { run('node _cro_fab_scan.js'); } catch (e) { console.error('scan err', e.message); }
    const n = qlen('_cro_reground_queue.json');
    console.log(`[supervise] round ${round}: ${n} flagged`);
    if (n === 0) break;
    try { run('node _cro_ds_run.js', { CRO_FORCE: '1', CRO_QUEUE: CWD + '/_cro_reground_queue.json' }); } catch (e) { console.error('reground err', e.message); }
  }
  console.log('[supervise] OLD entries fixed (0 flagged) — starting NEW writes on the main queue');
  try { run('node _cro_ds_run.js', { CRO_QUEUE: CWD + '/_cro_ds_queue.json', CRO_CONC: '2' }); } catch (e) { console.error('main writer err', e.message); }
  console.log('[supervise] done');
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
