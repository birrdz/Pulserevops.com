// new/control.js — THE CONTROL ROOM (2026-07-15). Kory's secret room. No terminal, ever.
// Buttons: open each tool · restart/reset each daemon (Block Builder, Runner, Groundskeeper, Gate).
// Runs local, reachable over Tailscale (100.70.31.31:8923) or LAN. No passwords.
'use strict';
const http = require('http');
const { spawn, exec } = require('child_process');
const WD = 'C:/Users/koryj/website';
const PORT = parseInt(process.env.CTRL_PORT || '8923', 10);

// each service: how to check it + how to (re)start it
const SVC = {
  blockbuilder: { name: '🧱 Block Builder', port: 8921, script: 'new/blockbuilder.js', open: true, env: {} },
  groundskeeper: { name: '🌱 Groundskeeper', port: 8917, script: 'groundskeeper.js', open: true, env: {} },
  runner: { name: '🔄 Staggered Runner', port: 0, script: 'new/gen_runner.js', open: false, env: {} },
  gate: { name: '🚪 Quality Gate', port: 8899, script: '_scrub_button_server.js', open: false, env: { GATE_ONLY: '1', GOLD_SKIP_IMG_GATE: '1', SCRUB_BTN_PORT: '8899' } },
};

const probe = port => new Promise(res => { const r = http.get({ host: '127.0.0.1', port, path: '/', timeout: 2500 }, x => { x.resume(); res(true); }); r.on('error', () => res(false)); r.on('timeout', () => { r.destroy(); res(false); }); });
const runnerUp = () => new Promise(res => { exec('wmic process where "name=\'node.exe\'" get CommandLine', { windowsHide: true }, (e, out) => res(/gen_runner\.js/.test(out || ''))); });
function killPort(port) { return new Promise(r => { if (!port) return r(); exec(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do taskkill /F /PID %a`, { windowsHide: true }, () => r()); }); }
function killScript(script) { return new Promise(r => { exec(`wmic process where "name='node.exe'" get ProcessId,CommandLine`, { windowsHide: true }, (e, out) => { const base = script.split('/').pop(); (out || '').split('\n').forEach(l => { if (l.includes(base)) { const m = l.match(/(\d+)\s*$/); if (m) { try { process.kill(parseInt(m[1]), 'SIGKILL'); } catch (_) {} } } }); setTimeout(r, 500); }); }); }
function startSvc(s) { const env = Object.assign({}, process.env, s.env || {}); const p = spawn(process.execPath, [WD + '/' + s.script], { cwd: WD, env, detached: true, stdio: 'ignore' }); p.unref(); }

// FORCE STOP & CLEAR — kill every generator/feed and empty the pending queue. Built entries are untouched.
const fs = require('fs');
const GENERATORS = ['tl_runner.js', 'gen_runner.js', 'generate.js', 'groundskeeper.js', 'campaign_stats.js', 'digest_email.js', 'batch_chief.js', 'batch_random.js', 'batch_top10.js', 'batch_essays_2027.js', 'upgrade_tl.js', 'upgrade_top10.js', 'bank_fill.js'];
async function forceStopClear() {
  for (const g of GENERATORS) { await killScript(g); }
  try { fs.writeFileSync(WD + '/new/gen_queue.json', JSON.stringify({ items: [] })); } catch (e) {}
  try { fs.writeFileSync(WD + '/new/_tl_target_state.json', JSON.stringify({ target: 0, done: 0 })); } catch (e) {}
}

const PAGE = `<!doctype html><meta name=viewport content="width=device-width,initial-scale=1">
<title>🕹️ Control Room</title>
<style>
body{margin:0;background:#0b0b0e;color:#e8e6e1;font-family:system-ui,Arial;padding:18px;max-width:560px;margin:auto}
h1{font-size:22px;margin:0 0 2px}.sub{color:#8a8680;font-size:13px;margin-bottom:16px}
.svc{background:#141419;border:1px solid #24242a;border-radius:12px;padding:14px 16px;margin:10px 0}
.top{display:flex;align-items:center;gap:10px}.nm{font-weight:800;font-size:16px;flex:1}
.dot{width:11px;height:11px;border-radius:50%;background:#7f1020}.dot.up{background:#22c55e}
.row{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
a.btn,button{font-size:15px;padding:10px 14px;border-radius:9px;border:0;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}
a.open{background:#1e6f3a;color:#fff}button.re{background:#26262e;color:#e8e6e1}button.re:hover{background:#33333d}
.msg{color:#8a8680;font-size:13px;margin-top:8px;min-height:1em}
</style>
<h1>🕹️ Control Room</h1><div class=sub>tap to open a tool or restart a daemon. no terminal, no passwords.</div>
<button onclick=forceStop() style="width:100%;background:#7f1020;color:#fff;font-size:17px;padding:16px;border-radius:12px;font-weight:800;border:0;margin-bottom:6px;cursor:pointer">🛑 FORCE STOP &amp; CLEAR</button>
<div class=msg id=fsmsg style="text-align:center;margin-bottom:12px">stops all generation + clears the pending queue · your built entries are safe</div>
<div id=svcs></div>
<script>
var HOST=location.hostname;
async function forceStop(){if(!confirm('Force stop ALL generation and clear the pending queue?\\n\\nYour published/built entries are NOT touched.'))return;var m=document.getElementById('fsmsg');m.textContent='stopping everything…';try{var r=await(await fetch('/api/forcestop',{method:'POST'})).json();m.textContent=r.ok?'✓ '+r.msg:'✗ '+(r.err||'failed');}catch(e){m.textContent='✗ error';}setTimeout(load,2000);}
async function load(){var d=await(await fetch('/api/status')).json();document.getElementById('svcs').innerHTML=d.services.map(function(s){
  return '<div class=svc><div class=top><span class="dot '+(s.up?'up':'')+'"></span><span class=nm>'+s.name+'</span><span style="color:#8a8680;font-size:12px">'+(s.up?'running':'stopped')+(s.port?' · :'+s.port:'')+'</span></div>'+
    '<div class=row>'+(s.open&&s.port?'<a class="btn open" href="http://'+HOST+':'+s.port+'/" target="_blank">Open</a>':'')+
    '<button class=re onclick="act(this,\\''+s.key+'\\',\\'restart\\')">🔄 Restart</button></div><div class=msg id="m-'+s.key+'"></div></div>';
}).join('');}
async function act(btn,key,what){var m=document.getElementById('m-'+key);m.textContent='working…';btn.disabled=true;
  try{var r=await(await fetch('/api/'+what+'?svc='+key,{method:'POST'})).json();m.textContent=r.ok?'✓ '+(r.msg||'done'):'✗ '+(r.err||'failed');}catch(e){m.textContent='✗ error';}
  btn.disabled=false;setTimeout(load,2500);}
load();setInterval(load,6000);
</script>`;

http.createServer(async (req, res) => {
  const u = req.url.split('?')[0], q = new URLSearchParams(req.url.split('?')[1] || '');
  const send = (c, b, t) => { res.writeHead(c, { 'Content-Type': t || 'application/json' }); res.end(b); };
  try {
    if (u === '/') return send(200, PAGE, 'text/html; charset=utf-8');
    if (u === '/api/status') {
      const services = [];
      for (const key of Object.keys(SVC)) { const s = SVC[key]; const up = s.port ? await probe(s.port) : await runnerUp(); services.push({ key, name: s.name, port: s.port, open: s.open, up }); }
      return send(200, JSON.stringify({ services }));
    }
    if (req.method === 'POST' && u === '/api/forcestop') {
      await forceStopClear();
      return send(200, JSON.stringify({ ok: true, msg: 'all generation stopped + pending queue cleared' }));
    }
    if (req.method === 'POST' && u === '/api/restart') {
      const key = q.get('svc'); const s = SVC[key]; if (!s) return send(200, '{"ok":false,"err":"unknown"}');
      if (s.port) await killPort(s.port); await killScript(s.script);
      await new Promise(r => setTimeout(r, 800));
      startSvc(s);
      // give it a moment, then confirm
      let up = false; for (let i = 0; i < 12; i++) { await new Promise(r => setTimeout(r, 1000)); up = s.port ? await probe(s.port) : await runnerUp(); if (up) break; }
      return send(200, JSON.stringify({ ok: up, msg: up ? 'restarted' : 'started (still coming up)' }));
    }
    return send(404, '{"error":"not found"}');
  } catch (e) { return send(500, JSON.stringify({ error: (e && e.message) || 'err' })); }
}).listen(PORT, () => console.log('[control] Control Room → http://localhost:' + PORT + '  (Tailscale/LAN :' + PORT + ')'));
