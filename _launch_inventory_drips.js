'use strict';
/**
 * _launch_inventory_drips.js — start forever drips across whole inventory (owner 2026-07-27).
 *   1) Fact flag scan (full match set) + fact drip --forever
 *   2) Image CHECK drip (flag only — never places)
 *   3) IndexNow drip
 *
 *   node _launch_inventory_drips.js
 * Stops: _fact_drip_stop.flag · _image_check_stop.flag · _indexnow_drip_stop.flag
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const WD = __dirname;

function killMatching(re) {
  try {
    const { execSync } = require('child_process');
    const out = execSync('wmic process where "name=\'node.exe\'" get ProcessId,CommandLine /FORMAT:LIST', {
      encoding: 'utf8', windowsHide: true, timeout: 30000,
    });
    const blocks = out.split(/\r?\n\r?\n/);
    for (const b of blocks) {
      const cmd = (b.match(/CommandLine=(.*)/) || [])[1] || '';
      const pid = (b.match(/ProcessId=(\d+)/) || [])[1];
      if (pid && re.test(cmd)) {
        try { process.kill(parseInt(pid, 10)); console.log('stopped', pid, cmd.slice(0, 80)); } catch (e) {}
      }
    }
  } catch (e) {}
}

function start(label, args, envExtra) {
  const child = spawn(process.execPath, args, {
    cwd: WD,
    env: Object.assign({}, process.env, envExtra || {}),
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });
  child.unref();
  console.log('LAUNCHED', label, 'pid=' + child.pid, args.join(' '));
  return child.pid;
}

// clear stop flags
for (const f of ['_fact_drip_stop.flag', '_image_check_stop.flag', '_indexnow_drip_stop.flag']) {
  try { fs.unlinkSync(path.join(WD, f)); } catch (e) {}
}

// stop prior copies of these drips (not hub/crews)
killMatching(/_fact_drip\.js|_fact_flag_scan\.js|_image_check_drip\.js|_indexnow_drip\.js/);

const pids = {};
// 1) Full fact scan then drip forever (scan runs first in this process synchronously via child wait? — spawn scan --live which starts drip)
pids.factScan = start('fact-scan+drip', [path.join(WD, '_fact_flag_scan.js'), '--live'], {
  FACT_SCAN_MAX: '0',
  FACT_FOREVER: '1',
  WRITER_ENGINE: 'deepseek',
  FACT_DRY: '0',
});

// Also start fact drip forever immediately so queue work begins while scan runs
pids.factDrip = start('fact-drip-forever', [path.join(WD, '_fact_drip.js'), '--forever'], {
  FACT_FOREVER: '1',
  WRITER_ENGINE: 'deepseek',
  FACT_DRY: '0',
});

// 2) Image check (flag only)
pids.imgCheck = start('image-check-forever', [path.join(WD, '_image_check_drip.js')], {
  IMG_CHECK_INTERVAL_S: '1800',
});

// 3) IndexNow drip
pids.indexNow = start('indexnow-drip', [path.join(WD, '_indexnow_drip.js')], {
  DRIP_BATCH: '400',
  DRIP_INTERVAL_S: '900',
  DRIP_DAILY_CAP: '20000',
});

fs.writeFileSync(path.join(WD, '_inventory_drips_pids.json'), JSON.stringify({ at: new Date().toISOString(), pids }, null, 2));
console.log(JSON.stringify({ ok: true, pids, note: 'Image drip FLAGS only — no auto placement (law). Fact + IndexNow run forever until stop flags.' }, null, 2));
