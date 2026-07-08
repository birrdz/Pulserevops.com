// 🔒 4444. _cro_weave_loop.js — keep the CRO super-weave running continuously. _cro_weave.js is a
// one-shot (weaves all, exits); the writers keep adding new CRO Q&As, so this re-runs the weave every
// few minutes to interlink freshly-written entries. Idempotent (skips already-woven).
// stop: _cro_weave_loop_stop.flag · log: _cro_weave_loop.out.log
const { spawnSync } = require('child_process');
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_cro_weave_loop_stop.flag';
const LOG = WD + '/_cro_weave_loop.out.log';
const log = s => { try { fs.appendFileSync(LOG, new Date().toISOString() + ' ' + s + '\n'); } catch (e) {} };
(async () => {
  log('[weave-loop] up — re-weaving the CRO cluster every 6 min');
  while (!fs.existsSync(STOP)) {
    try {
      const r = spawnSync('node', ['_cro_weave.js'], { cwd: WD, encoding: 'utf8', timeout: 600000 });
      const out = (r.stdout || '').trim().split('\n').pop() || '';
      log('[weave-loop] pass: ' + out);
    } catch (e) { log('[weave-loop] err ' + e.message); }
    await new Promise(res => setTimeout(res, 360000));
  }
  log('[weave-loop] stop flag — exiting');
})();
