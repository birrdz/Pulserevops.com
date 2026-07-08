// _supervisor.js — FRONT crew supervisor (owner 2026-06-30):
//   FRONT (publish/writing): _chain_run.js = 1 DeepSeek writer (STYLE→CRAB→FISH) + 1 DDG (_img_3lane LANE=1)
// BACK (SEO spider) is handled by _v2_supervisor.js — do NOT watch back lanes here (avoids duplicate DDG/imlane2).
// Every 120s it relaunches any of these that died. Stop: _supervisor_stop.flag. Log: _supervisor.out.log
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const STOP = WD+'/_supervisor_stop.flag';
const logln = s => { try { fs.appendFileSync(WD+'/_supervisor.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
// each watched process: match = unique substring of its command line; env merged on launch
const PROCS = [
  { name:'front-writer (1 DeepSeek)', script:'_chain_run.js', match:'_chain_run', env:{ CHAIN_CONC:'1', DS_DAILY_CAP:'1000000', CHAIN_PHASES:'CRAB,FISH,STYLE' } },
  // LANE is passed via env (invisible to WMI CommandLine), so we also append a trackable
  // marker ARG (imglane1) that _img_3lane ignores — lets countAlive distinguish lanes
  // and stop spawning duplicates (the 6-lane proliferation bug).
  { name:'front-DDG', script:'_img_3lane.js', match:'imglane1', arg:'imglane1', env:{ LANE:'1' } },
];
function killMatch(match){ try { execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '${match}' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }"`,{encoding:'utf8',windowsHide:true}); } catch(e){} }
function countAlive(match){ try { const o=execSync(`powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -match '${match}' } | Measure-Object).Count"`,{encoding:'utf8',windowsHide:true}); return parseInt(o.trim(),10)||0; } catch(e){ return 0; } }
function launch(pr){ const out=fs.openSync(WD+'/'+pr.script.replace('.js','')+'.out.log','a'); const env=Object.assign({}, process.env, pr.env||{}); const argv=[pr.script].concat(pr.arg?[pr.arg]:[]); const p=spawn('node',argv,{cwd:WD,detached:true,stdio:['ignore',out,out],windowsHide:true,env}); p.unref(); logln(`[sup] launched ${pr.name} (${pr.script}) pid ${p.pid}`); }
(async()=>{
  logln('[sup] FRONT supervisor up — 1 DeepSeek chain writer + 1 DDG (LANE 1)');
  while (!fs.existsSync(STOP)){
    for (const pr of PROCS){
      const n = countAlive(pr.match);
      if (n > 1){ logln(`[sup] ${pr.name} duplicate (${n}) — killing all, relaunching 1`); killMatch(pr.match); launch(pr); await sleep(8000); }
      else if (n < 1){ logln(`[sup] ${pr.name} down — relaunching`); launch(pr); await sleep(8000); }
    }
    await sleep(120000);
  }
  logln('[sup] stop flag — exiting');
})().catch(e=>{logln('[sup] FATAL '+e.message);process.exit(1);});
