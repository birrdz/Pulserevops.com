// layout-flow-run-batch.js — sequential runner with 90-sec gap between entries.
// Already processed q9668; this script picks up at q9667 and walks down to the
// 25th entry. Stops immediately on rate-limit (exit code 2) or other fatal
// error. Outputs a JSON summary on stdout at end.

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Top 25 q-IDs (DESC by q-num). q9668 already done — start at q9667.
const IDS = [
  'q9668','q9667','q9666','q9665','q9664','q9663','q9662','q9661','q9660','q9659',
  'q9658','q9657','q9656','q9655','q9654','q9653','q9652','q9651','q9650','q9649',
  'q9648','q9647','q9646','q9645','q9644',
];

const ALREADY = new Set(process.argv.slice(2)); // ids passed on cli are skipped
const SCRIPT = path.join(__dirname, 'layout-flow-pass.js');

const results = [];
const failures = [];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    if (ALREADY.has(id)) { console.log('[skip already-done] ' + id); continue; }
    console.log('\n=== [' + (i + 1) + '/' + IDS.length + '] ' + id + ' ===');
    const r = spawnSync('node', [SCRIPT, id], { encoding: 'utf8', cwd: __dirname });
    const out = (r.stdout || '') + (r.stderr || '');
    process.stdout.write(out);
    // parse last RESULT line
    let parsed = null;
    const m = out.match(/^RESULT\s+(\{.*\})\s*$/m);
    if (m) {
      try { parsed = JSON.parse(m[1]); } catch (_) {}
    }
    if (r.status === 0 && parsed) {
      results.push(parsed);
    } else if (r.status === 2) {
      console.error('\n*** RATE LIMITED at ' + id + ' — STOPPING ***');
      failures.push({ id, reason: 'rate-limited', exit: r.status });
      break;
    } else if (r.status === 3 || r.status === 4) {
      console.log('[soft-skip] ' + id + ' exit=' + r.status);
      failures.push({ id, reason: 'soft-skip', exit: r.status });
      // continue — sleep and move on
    } else {
      console.error('[error] ' + id + ' exit=' + r.status);
      failures.push({ id, reason: 'fatal', exit: r.status });
      // per spec: log and skip, don't retry — break to be safe so we don't
      // burn through 24 with a broken script
      break;
    }
    if (i < IDS.length - 1) {
      console.log('... sleeping 90s ...');
      await sleep(90 * 1000);
    }
  }

  const wordDeltas = results.map(r => r.words.delta_pct);
  const avgDelta = wordDeltas.length ? (wordDeltas.reduce((a,b) => a+b, 0) / wordDeltas.length) : 0;
  console.log('\n\n========== BATCH SUMMARY ==========');
  console.log(JSON.stringify({
    processed: results.length,
    failures,
    avg_word_delta_pct: Number(avgDelta.toFixed(3)),
    results,
  }, null, 2));
  // Persist to a temp file for the agent to read
  const outFile = path.join(__dirname, '..', '..', 'AppData', 'Local', 'Temp', 'layout-flow-batch-summary.json');
  fs.writeFileSync(outFile, JSON.stringify({ processed: results.length, failures, avg_word_delta_pct: avgDelta, results }, null, 2));
  console.log('\nSummary written to ' + outFile);
})();
