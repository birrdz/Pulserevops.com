// Watch for +10 scrub-one completions, auto-pause, run audit, write report.
const fs = require('fs');
const { execSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
const SCRUBLOG = WD + '/_scrub_run_log.json';
const REPORT = WD + '/_scrub_audit_report.txt';
const TARGET = parseInt(process.argv[2] || '10', 10);
const KEY = '4444';

function logCount() { try { return JSON.parse(fs.readFileSync(SCRUBLOG, 'utf8')).length; } catch (e) { return 0; } }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const baseline = logCount();
  console.log('[watch10] baseline:', baseline, '| waiting for +' + TARGET + ' scrubs…');
  for (let i = 0; i < 200; i++) {
    const lc = logCount();
    const n = lc - baseline;
    const st = await fetch('http://localhost:8899/scrub-status').then(r => r.json()).catch(() => ({}));
    if (i % 2 === 0) console.log('[watch10] +' + n + '/' + TARGET + ' | running=' + !!st.running + ' busy=' + !!st.scrubBusy + ' certified=' + (st.certified || 0));
    if (n >= TARGET) {
      console.log('[watch10] +' + TARGET + ' reached — pausing scrubber…');
      await fetch('http://localhost:8899/scrub-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, action: 'stop' }) }).catch(() => {});
      await sleep(3000);
      let auditOut = '';
      try { auditOut = execSync('node _audit_scrub_last10.js ' + TARGET, { cwd: WD, encoding: 'utf8' }); } catch (e) { auditOut = (e.stdout || '') + (e.stderr || '') + '\nexit ' + (e.status || 1); }
      const log = JSON.parse(fs.readFileSync(SCRUBLOG, 'utf8')).slice(0, TARGET);
      const report = 'SCRUB AUDIT AFTER ' + TARGET + ' RUNS\n' + new Date().toISOString() + '\n\n' + auditOut + '\n\nLOG:\n' + JSON.stringify(log, null, 2);
      fs.writeFileSync(REPORT, report);
      console.log('[watch10] DONE — report at', REPORT);
      console.log(auditOut);
      return;
    }
    await sleep(30000);
  }
  console.log('[watch10] timeout');
})().catch(e => { console.error('[watch10] FAIL', e.message); process.exit(1); });
