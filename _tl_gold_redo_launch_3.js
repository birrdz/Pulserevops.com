// Launch 3 parallel TL gold-redo workers, 1 minute apart (disjoint queue shards).
// Usage: node _tl_gold_redo_launch_3.js [--reapply] [--qa-only]
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const WD = 'C:/Users/koryj/website';
const WORKERS = 3;
const STAGGER_MS = 60 * 1000;
const STOP_ALL = path.join(WD, '_tl_gold_redo_batch_stop.flag');

const args = process.argv.slice(2);
const extra = [];
if (args.includes('--reapply')) extra.push('--reapply');
if (args.includes('--qa-only')) extra.push('--qa-only');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function log(msg) {
  console.log(new Date().toISOString() + ' [tl-launch-3] ' + msg);
}

(async () => {
  // Halt any singleton or prior shard workers
  fs.writeFileSync(STOP_ALL, 'stop-all');
  for (let w = 0; w < WORKERS; w++) {
    try { fs.writeFileSync(path.join(WD, '_tl_gold_redo_batch_stop_w' + w + '.flag'), 'stop'); } catch (e) {}
  }
  log('Stop flags set — waiting 8s for workers to exit…');
  await sleep(8000);

  for (let w = 0; w < WORKERS; w++) {
    try { fs.unlinkSync(path.join(WD, '_tl_gold_redo_batch_stop_w' + w + '.flag')); } catch (e) {}
  }
  try { fs.unlinkSync(STOP_ALL); } catch (e) {}

  const pids = [];
  for (let w = 0; w < WORKERS; w++) {
    if (w > 0) {
      log('Stagger wait ' + (STAGGER_MS / 1000) + 's before worker ' + w + '…');
      await sleep(STAGGER_MS);
    }
    const shardArgs = ['_tl_gold_redo_batch_run.js', '--shard=' + w + '/' + WORKERS, ...extra];
    const out = fs.openSync(path.join(WD, '_tl_gold_redo_batch_w' + w + '.out.log'), 'a');
    const err = fs.openSync(path.join(WD, '_tl_gold_redo_batch_w' + w + '.err.log'), 'a');
    const child = spawn('node', shardArgs, {
      cwd: WD,
      detached: true,
      stdio: ['ignore', out, err],
      windowsHide: true,
      env: Object.assign({}, process.env, {
        TL_SHARD_INDEX: String(w),
        TL_SHARD_COUNT: String(WORKERS),
        BATCH_ENTRY_MS: String(process.env.BATCH_ENTRY_MS || '25000'),
        TL_BATCH_CD_MS: '25000',
      }),
    });
    child.unref();
    pids.push({ shard: w, pid: child.pid });
    log('STARTED shard ' + w + '/' + WORKERS + ' PID ' + child.pid + ' · ' + shardArgs.join(' '));
  }

  const manifest = {
    at: new Date().toISOString(),
    workers: WORKERS,
    staggerSec: STAGGER_MS / 1000,
    pids,
    stopAll: 'New-Item ' + STOP_ALL + ' -Force',
    stopShard: (w) => 'New-Item ' + path.join(WD, '_tl_gold_redo_batch_stop_w' + w + '.flag') + ' -Force',
    progress: (w) => path.join(WD, '_tl_gold_redo_progress_w' + w + '.json'),
    log: (w) => path.join(WD, '_tl_gold_redo_batch_w' + w + '.log'),
  };
  fs.writeFileSync(path.join(WD, '_tl_gold_redo_launch_3.json'), JSON.stringify(manifest, null, 2));
  log('All ' + WORKERS + ' workers launched · manifest _tl_gold_redo_launch_3.json');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
