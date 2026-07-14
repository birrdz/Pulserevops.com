'use strict';
/**
 * Daily 1k Pexels → assets/qa/_live_bank — DISABLED by default (owner 2026-07-13).
 * On-demand DD/Fixer search→download→live put owns inventory growth.
 * Nightly burn steals Pexels quota from real allocations.
 * Re-enable: PEXELS_NIGHTLY_BANK=1 node _pexels_live_bank_daily.js
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const WD = __dirname;
const LOG = path.join(WD, '_pexels_live_bank_daily.log');
function log(m) {
  const line = new Date().toISOString() + ' ' + m;
  console.log(line);
  try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {}
}

if (process.env.PEXELS_NIGHTLY_BANK !== '1') {
  log('SKIP nightly bank — quota reserved for DD/Fixer live puts (set PEXELS_NIGHTLY_BANK=1 to force)');
  process.exit(0);
}

log('starting daily bank fill BANK_TARGET=1000');
const child = spawn(process.execPath, ['_pexels_live_bank_fill.js'], {
  cwd: WD,
  env: Object.assign({}, process.env, { BANK_TARGET: '1000' }),
  stdio: 'inherit',
  windowsHide: true,
});
child.on('exit', (code) => {
  log('exit ' + code);
  process.exit(code || 0);
});
