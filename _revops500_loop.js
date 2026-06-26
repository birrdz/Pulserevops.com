// Endless loop: 500 posts → wait 1 hour → next batch (500 new questions). Ctrl+C to stop.
// No LLM usage — template answers via pulse-blob-writer only.
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const STATE = path.join(__dirname, '_revops500_state.json');
const HOUR_MS = 60 * 60 * 1000;

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    return { nextBatch: 1, lastId: 9883, batchesCompleted: 0 };
  }
}
function saveState(s) {
  fs.writeFileSync(STATE, JSON.stringify(s, null, 2), 'utf8');
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd: __dirname, stdio: 'inherit', shell: true });
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('[revops500-loop] No Anthropic tokens — blob writer only. Ctrl+C to stop.\n');
  while (true) {
    const state = loadState();
    const batch = state.nextBatch || 1;
    console.log(`[revops500-loop] === Batch ${batch} === ${new Date().toISOString()}`);

    execSync(`node "${path.join(__dirname, '_generate_revops500_queue.js')}" ${batch}`, {
      stdio: 'inherit',
    });
    await run('node', [path.join(__dirname, '_revops500_run_all.js'), String(batch)]);

    state.nextBatch = batch + 1;
    state.batchesCompleted = (state.batchesCompleted || 0) + 1;
    state.lastLoopAt = new Date().toISOString();
    saveState(state);

    console.log(`[revops500-loop] Batch ${batch} done. Sleeping 1 hour…`);
    await sleep(HOUR_MS);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
