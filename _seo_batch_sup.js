// _seo_batch_sup.js — supervisor/watchdog for the SEO back-end (owner 4444: "2 Claude Code + a
// supervisor"). Every 120s: ensures _seo_batch_loop.js is alive; relaunches it if the process
// died. Keeps the spider fixing 24/7. Stop: _seo_batch_stop.flag. Log: _seo_batch_sup.out.log
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const STOP = WD+'/_seo_batch_stop.flag';
const logln = s => { try { fs.appendFileSync(WD+'/_seo_batch_sup.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
function alive(){ try { const o=execSync('powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name=\'node.exe\'\\" | Where-Object { $_.CommandLine -match \'_seo_batch_loop\' } | Measure-Object).Count"',{encoding:'utf8'}); return parseInt(o.trim(),10)>0; } catch(e){ return false; } }
function launch(){ const out=fs.openSync(WD+'/_seo_batch.out.log','a'); const env=Object.assign({}, process.env, { SEO_BATCH:'400', SEO_BATCH_CONC:'2' }); const p=spawn('node',['_seo_batch_loop.js'],{cwd:WD,detached:true,stdio:['ignore',out,out],windowsHide:true,env}); p.unref(); logln('[sup] launched _seo_batch_loop pid '+p.pid); }
(async()=>{
  logln('[sup] SEO back-end watchdog up — keeps the 2x Claude Code spider alive');
  while (!fs.existsSync(STOP)){
    if (!alive()){ logln('[sup] _seo_batch_loop NOT running — relaunching'); launch(); await sleep(20000); }
    else logln('[sup] ok — batch loop alive');
    await sleep(120000);
  }
  logln('[sup] stop flag — exiting');
})().catch(e=>{logln('[sup] FATAL '+e.message);process.exit(1);});
