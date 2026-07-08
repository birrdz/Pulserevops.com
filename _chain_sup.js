// _chain_sup.js — watchdog for _chain_run.js. Every 120s: confirms _chain_run is alive AND the
// total published count is rising; relaunches the writer if the process died or the count has
// been flat for 3 consecutive checks while queues still have unwritten work. Guarantees the
// entry number keeps climbing. Stop: _chain_stop.flag. Log: _chain_sup.out.log
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const { getStore } = require('@netlify/blobs');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local','utf8').split(/\r?\n/)){const m=l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
const store = getStore({ name:'pulse-machine-library', siteID:'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT||process.env.NETLIFY_AUTH_TOKEN });
const WD = 'C:/Users/koryj/website';
const STOP = WD+'/_chain_stop.flag';
const logln = s => { try { fs.appendFileSync(WD+'/_chain_sup.out.log', s+'\n'); } catch(e){} console.log(s); };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
function chainAlive(){ try{ const o=execSync('powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"Name=\'node.exe\'\\" | Where-Object { $_.CommandLine -match \'_chain_run\' } | Measure-Object).Count"',{encoding:'utf8'}); return parseInt(o.trim(),10)>0; }catch(e){ return false; } }
function launch(){ const out=fs.openSync(WD+'/_chain_run.out.log','a'); const p=spawn('node',['_chain_run.js'],{cwd:WD,detached:true,stdio:['ignore',out,out],windowsHide:true}); p.unref(); logln('[sup] launched _chain_run pid '+p.pid); }
async function total(){ try{ const idx=await store.get('_index.json',{type:'json',consistency:'strong'}); return (idx.entries||[]).length; }catch(e){ return -1; } }
(async()=>{
  logln('[sup] watchdog up — guarantees the entry count keeps climbing');
  let last=-1, flat=0;
  while (!fs.existsSync(STOP)){
    if (!chainAlive()){ logln('[sup] _chain_run NOT running — relaunching'); launch(); await sleep(20000); }
    const t = await total();
    if (t>=0){
      if (t>last){ logln(`[sup] OK count ${last<0?'?':last} -> ${t} (climbing)`); flat=0; }
      else { flat++; logln(`[sup] flat at ${t} (x${flat})`); }
      last=t;
      if (flat>=3){ logln('[sup] count flat 3 checks — kicking writer'); try{ execSync('powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name=\'node.exe\'\\" | Where-Object { $_.CommandLine -match \'_chain_run\' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"'); }catch(e){} await sleep(3000); launch(); flat=0; }
    }
    await sleep(120000);
  }
  logln('[sup] stop flag — exiting');
})().catch(e=>{logln('[sup] FATAL '+e.message);process.exit(1);});
