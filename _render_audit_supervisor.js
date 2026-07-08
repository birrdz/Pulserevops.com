// _render_audit_supervisor.js — spawns and relaunches all three render-auditor agents.
//
// START (all agents, detached):
//   Remove-Item _render_audit_stop.flag,_render_audit_agent_a_stop.flag,_render_audit_agent_b_stop.flag,_render_audit_agent_c_stop.flag -EA SilentlyContinue
//   Start-Process node -ArgumentList '_render_audit_supervisor.js' -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
//
// STOP ALL:
//   New-Item -ItemType File -Path _render_audit_stop.flag -Force
//
// ONE-SHOT (all agents run once then exit):
//   node _render_audit_supervisor.js --once
//
// Log: _render_audit_supervisor.out.log · Status: _render_audit_status.json
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_render_audit_stop.flag';
const logln = (s) => {
  try { fs.appendFileSync(WD + '/_render_audit_supervisor.out.log', s + '\n'); } catch (e) {}
  console.log(s);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ONCE = process.argv.includes('--once');

const PROCS = [
  { name: 'render-auditor A (layout/DA)', script: '_render_audit_agent_a.js', match: '_render_audit_agent_a', stop: '_render_audit_agent_a_stop.flag' },
  { name: 'render-auditor B (images)', script: '_render_audit_agent_b.js', match: '_render_audit_agent_b', stop: '_render_audit_agent_b_stop.flag' },
  { name: 'render-auditor C (Cursor blob gold)', script: '_render_audit_agent_c.js', match: '_render_audit_agent_c', stop: '_render_audit_agent_c_stop.flag' },
];

function killMatch(match) {
  try {
    execSync(
      `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '${match}' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }"`,
      { encoding: 'utf8', windowsHide: true }
    );
  } catch (e) {}
}

function countAlive(match) {
  try {
    const o = execSync(
      `powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '${match}' } | Measure-Object).Count"`,
      { encoding: 'utf8', windowsHide: true }
    );
    return parseInt(o.trim(), 10) || 0;
  } catch (e) {
    return 0;
  }
}

function launch(pr) {
  try { fs.unlinkSync(WD + '/' + pr.stop); } catch (e) {}
  const out = fs.openSync(WD + '/' + pr.script.replace('.js', '') + '.out.log', 'a');
  const argv = [pr.script];
  if (ONCE) argv.push('--once');
  const p = spawn('node', argv, {
    cwd: WD,
    detached: true,
    stdio: ['ignore', out, out],
    windowsHide: true,
    env: process.env,
  });
  p.unref();
  logln('[render-sup] launched ' + pr.name + ' (' + pr.script + ') pid ' + p.pid);
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  logln('[render-sup] up — 3 auditors (A=layout/DA, B=images, C=Cursor blob gold)' + (ONCE ? ' · --once' : ''));

  for (const pr of PROCS) launch(pr);
  if (ONCE) {
    await sleep(90000);
    logln('[render-sup] --once complete');
    return;
  }

  while (!fs.existsSync(STOP)) {
    for (const pr of PROCS) {
      const n = countAlive(pr.match);
      if (n > 1) {
        logln('[render-sup] ' + pr.name + ' duplicate (' + n + ') — killing all, relaunching 1');
        killMatch(pr.match);
        launch(pr);
        await sleep(8000);
      } else if (n < 1) {
        logln('[render-sup] ' + pr.name + ' down — relaunching');
        launch(pr);
        await sleep(8000);
      }
    }
    await sleep(120000);
  }
  logln('[render-sup] stop flag — exiting');
})().catch((e) => {
  logln('[render-sup] FATAL ' + e.message);
  process.exit(1);
});
