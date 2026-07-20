#!/usr/bin/env node
'use strict';

// Keeps local-only control panels alive. It discovers server entrypoints by port,
// health-checks them, restarts failed processes, and exposes one status page.
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.resolve(process.env.LOCAL_SITES_ROOT || __dirname);
const DASH_PORT = Number(process.env.LOCAL_SITES_DAEMON_PORT || 7959);
const INTERVAL_MS = Math.max(3000, Number(process.env.LOCAL_SITES_INTERVAL_MS || 10000));
const RESET_KEY = process.env.LOCAL_SITES_KEY || '4444';
const STATE_DIR = path.join(ROOT, '_local-sites-state');
const LOG_DIR = path.join(STATE_DIR, 'logs');
const LOCK_FILE = path.join(STATE_DIR, 'daemon.lock');
const USER_CONFIG = path.join(ROOT, 'local-sites.user.json');
const DEFAULT_CONFIG = path.join(ROOT, 'local-sites.json');
const args = new Set(process.argv.slice(2));
const once = args.has('--once');
const dryRun = args.has('--dry-run');
const resetAtStart = args.has('--reset');

fs.mkdirSync(LOG_DIR, { recursive: true });

function acquireLock() {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      fs.writeFileSync(LOCK_FILE, String(process.pid), { flag: 'wx' });
      return true;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      const pid = Number(String(readFileSafe(LOCK_FILE)).trim());
      if (pid) {
        try {
          process.kill(pid, 0);
          const daemonPath = path.resolve(__filename).replace(/\\/g, '/').toLowerCase();
          const owner = processRows().find(row => Number(row.pid) === pid);
          if (owner && String(owner.command || '').replace(/\\/g, '/').toLowerCase().includes(daemonPath)) return false;
        } catch (_) {}
      }
      try { fs.unlinkSync(LOCK_FILE); } catch (_) {}
    }
  }
  return false;
}

function readFileSafe(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch (_) { return ''; }
}

function releaseLock() {
  if (String(readFileSafe(LOCK_FILE)).trim() !== String(process.pid)) return;
  try { fs.unlinkSync(LOCK_FILE); } catch (_) {}
}

const DEFAULTS = [
  {
    id: 'machines-manager',
    name: 'PULSE Machines',
    port: 7950,
    required: true,
    discover: true,
    env: {
      CONTENT_BOOSTER_WRITER: 'deepseek',
      BOOSTER_WRITER_ENGINE: 'deepseek',
      CONTENT_WRITER_ENGINE: 'deepseek',
      WRITER_ENGINE: 'deepseek',
      DS_ONLY: '1',
      CLAUDE_ONLY: '0',
      NO_DS: '0',
    },
  },
  { id: 'machine-7900', name: 'Machine worker 7900', port: 7900, discover: true },
  { id: 'machine-7901', name: 'Machine worker 7901', port: 7901, discover: true },
  { id: 'machine-7902', name: 'Machine worker 7902', port: 7902, discover: true },
  { id: 'local-app-7931', name: 'Local app 7931', port: 7931, discover: true },
  {
    id: 'deepseek-content-booster',
    name: 'DeepSeek Content Booster',
    port: 7970,
    script: '_deepseek_content_booster_server.js',
    env: { CONTENT_WRITER_ENGINE: 'deepseek', DS_ONLY: '1', CLAUDE_ONLY: '0', NO_DS: '0' },
  },
  { id: 'pulse-control', name: "Kory's Pulse Control Panel", port: 8904, script: 'dashboard_server.js' },
  { id: 'baton-picker', name: 'Baton Picker', port: 7802, script: 'baton_picker.js' },
  { id: 'fixer', name: "Kory's Fixer", port: 8905, script: 'fixer_panel.js' },
  { id: 'scrub-button', name: 'Scrub Button / Gate', port: 8899, script: '_scrub_button_server.js' },
  { id: 'qa-visualizer', name: 'Q&A Visualizer', port: 8901, script: '_qa_visualizer_server.js' },
  { id: 'image-dashboard', name: 'Image Dashboard', port: 8891, script: '_image_dashboard_server.js' },
  { id: 'pool-picker', name: 'Pool Picker', port: 8791, script: '_pool10_server.js' },
  { id: 'site-preview', name: 'Pulse site preview', port: 8790, script: '_preview_server.js' },
];

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return fallback; }
}

function loadServices() {
  const base = readJson(DEFAULT_CONFIG, DEFAULTS);
  const custom = readJson(USER_CONFIG, []);
  const customList = Array.isArray(custom) ? custom : [];
  const disabledIds = new Set(customList.filter(s => s && s.enabled === false).map(s => s.id).filter(Boolean));
  const disabledPorts = new Set(customList.filter(s => s && s.enabled === false).map(s => Number(s.port)).filter(Number.isInteger));
  const list = customList.filter(s => s && s.enabled !== false)
    .concat(base.filter(s => !disabledIds.has(s.id) && !disabledPorts.has(Number(s.port))));
  const seen = new Set();
  const seenPorts = new Set();
  return list.filter(s => {
    const port = s && Number(s.port);
    if (!s || !s.id || !Number.isInteger(port) || port < 1 || port > 65535 || seen.has(s.id) || seenPorts.has(port)) return false;
    seen.add(s.id);
    seenPorts.add(port);
    return true;
  }).map(s => ({
    healthPath: '/',
    host: '127.0.0.1',
    args: [],
    env: {},
    required: false,
    discover: false,
    ...s,
    port: Number(s.port),
  }));
}

let services = loadServices();
const runtime = new Map(services.map(s => [s.id, {
  child: null, pid: null, status: 'pending', detail: '', failures: 0,
  restarts: 0, lastCheck: null, lastStart: null, command: null,
}]));

function walkCandidates(dir, depth, out) {
  if (depth < 0 || out.length > 2500) return;
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
  const blocked = new Set(['.git', 'node_modules', 'assets', 'img', 'lab', 'archive', 'derby', '_site_deploy']);
  for (const ent of entries) {
    if (ent.name.startsWith('.') && ent.name !== '.guard') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!blocked.has(ent.name)) walkCandidates(full, depth - 1, out);
    } else if (/\.(?:js|cjs|mjs|py|ps1)$/i.test(ent.name)) {
      try {
        const st = fs.statSync(full);
        if (st.size <= 2 * 1024 * 1024) out.push(full);
      } catch (_) {}
    }
  }
}

function discoverScript(port) {
  const files = [];
  walkCandidates(ROOT, 3, files);
  const portRe = new RegExp(`\\b${port}\\b`);
  const serverRe = /\.listen\s*\(|createServer\s*\(|app\.run\s*\(|HTTPListener/i;
  const scored = [];
  for (const file of files) {
    if (path.resolve(file) === path.resolve(__filename)) continue;
    if (/(?:^|[._-])test(?:[._-]|$)|(?:^|[._-])spec(?:[._-]|$)/i.test(path.basename(file))) continue;
    let text = '';
    try { text = fs.readFileSync(file, 'utf8'); } catch (_) { continue; }
    if (!portRe.test(text) || !serverRe.test(text)) continue;
    const name = path.basename(file).toLowerCase();
    let score = 0;
    if (/(manager|server|panel|control|machine|picker|dashboard)/.test(name)) score += 8;
    if (new RegExp(`(?:PORT|port)[^\\n]{0,40}${port}`).test(text)) score += 6;
    if (new RegExp(`listen\\s*\\([^\\n]{0,30}${port}`).test(text)) score += 6;
    if (name.includes('test') || name.includes('bak') || name.includes('preview')) score -= 4;
    scored.push({ file, score });
  }
  scored.sort((a, b) => b.score - a.score || a.file.length - b.file.length);
  return scored[0] ? path.relative(ROOT, scored[0].file) : null;
}

function resolveCommand(service) {
  let script = service.script;
  if ((!script || !fs.existsSync(path.resolve(ROOT, script))) && service.discover) script = discoverScript(service.port);
  if (!script) return null;
  const full = path.resolve(ROOT, script);
  if (!fs.existsSync(full)) return null;
  if (service.command) return { command: service.command, args: [...(service.args || [])], script };
  if (/\.py$/i.test(full)) return { command: process.platform === 'win32' ? 'python' : 'python3', args: [full, ...(service.args || [])], script };
  if (/\.ps1$/i.test(full)) return { command: 'powershell.exe', args: ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', full, ...(service.args || [])], script };
  return { command: process.execPath, args: [full, ...(service.args || [])], script };
}

function probe(service, timeout = 2500) {
  return new Promise(resolve => {
    const req = http.get({
      host: service.host, port: service.port, path: service.healthPath,
      timeout, headers: { Connection: 'close', 'User-Agent': 'pulse-local-sites-daemon/1' },
    }, res => {
      res.resume();
      resolve({ up: res.statusCode < 500, code: res.statusCode, detail: `HTTP ${res.statusCode}` });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', e => resolve({ up: false, code: 0, detail: e.code || e.message }));
  });
}

function log(service, message) {
  const line = `${new Date().toISOString()} ${message}\n`;
  fs.appendFileSync(path.join(LOG_DIR, `${service.id}.log`), line);
  process.stdout.write(`[${service.id}] ${message}\n`);
}

function start(service, state) {
  const spec = resolveCommand(service);
  state.command = spec && spec.script;
  if (!spec) {
    state.status = service.required ? 'missing' : 'not-installed';
    state.detail = service.discover ? `No server entrypoint found for port ${service.port}` : `Missing ${service.script}`;
    return false;
  }
  if (dryRun) {
    state.status = 'would-start';
    state.detail = spec.script;
    return true;
  }
  const out = fs.openSync(path.join(LOG_DIR, `${service.id}.out.log`), 'a');
  const err = fs.openSync(path.join(LOG_DIR, `${service.id}.err.log`), 'a');
  const child = spawn(spec.command, spec.args, {
    cwd: ROOT,
    env: { ...process.env, ...service.env },
    detached: false,
    windowsHide: true,
    stdio: ['ignore', out, err],
  });
  fs.closeSync(out);
  fs.closeSync(err);
  state.child = child;
  state.pid = child.pid;
  state.status = 'starting';
  state.detail = spec.script;
  state.lastStart = new Date().toISOString();
  state.restarts += 1;
  log(service, `started PID ${child.pid}: ${spec.script}`);
  child.once('exit', (code, signal) => {
    state.child = null;
    state.pid = null;
    state.status = 'down';
    state.detail = `exited ${code == null ? signal : code}`;
    log(service, state.detail);
  });
  child.once('error', e => {
    state.child = null;
    state.pid = null;
    state.status = 'down';
    state.detail = e.message;
    log(service, `start failed: ${e.message}`);
  });
  return true;
}

async function inspect(service, allowStart = true) {
  const state = runtime.get(service.id);
  const result = await probe(service);
  state.lastCheck = new Date().toISOString();
  if (result.up) {
    state.status = 'up';
    state.detail = result.detail;
    state.failures = 0;
    return state;
  }
  state.failures += 1;
  state.status = 'down';
  state.detail = result.detail;
  if (state.child && state.failures >= 3) {
    const pid = state.child.pid;
    try {
      state.child.kill('SIGTERM');
      state.status = 'restarting';
      state.detail = `unhealthy ${state.failures} checks; stopped PID ${pid}`;
      log(service, state.detail);
    } catch (_) {}
    return state;
  }
  if (allowStart && !state.child) {
    const stale = servicePids(service);
    if (stale.length) {
      for (const pid of stale) {
        try { process.kill(pid, 'SIGTERM'); log(service, `stopped unresponsive PID ${pid}`); } catch (_) {}
      }
      state.status = 'restarting';
      state.detail = `stopped ${stale.length} unresponsive process${stale.length === 1 ? '' : 'es'}`;
    } else {
      start(service, state);
    }
  }
  return state;
}

async function scan(allowStart = true) {
  services = loadServices();
  for (const service of services) {
    if (!runtime.has(service.id)) runtime.set(service.id, { child: null, pid: null, status: 'pending', detail: '', failures: 0, restarts: 0 });
    await inspect(service, allowStart);
  }
}

function processRows() {
  if (process.platform === 'win32') {
    const ps = spawnSync('powershell.exe', ['-NoProfile', '-Command',
      'Get-CimInstance Win32_Process | Where-Object {$_.Name -match "^(node|python|python3|powershell|pwsh)"} | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress'
    ], { encoding: 'utf8', windowsHide: true });
    const parsed = (() => { try { return JSON.parse(ps.stdout || '[]'); } catch (_) { return []; } })();
    return (Array.isArray(parsed) ? parsed : [parsed]).map(x => ({ pid: x.ProcessId, command: x.CommandLine || '' }));
  }
  const ps = spawnSync('ps', ['-eo', 'pid=,args='], { encoding: 'utf8' });
  return String(ps.stdout || '').split(/\r?\n/).map(line => {
    const m = line.trim().match(/^(\d+)\s+(.+)$/);
    return m ? { pid: Number(m[1]), command: m[2] } : null;
  }).filter(Boolean);
}

function servicePids(service, rows = processRows()) {
  const spec = resolveCommand(service);
  const needle = spec && path.resolve(ROOT, spec.script).replace(/\\/g, '/').toLowerCase();
  if (!needle) return [];
  return rows.filter(row => {
    const command = String(row.command || '').replace(/\\/g, '/').toLowerCase();
    return row.pid !== process.pid && command.includes(needle);
  }).map(row => Number(row.pid)).filter(Boolean);
}

async function resetAll() {
  const rows = processRows();
  for (const service of services) {
    const state = runtime.get(service.id);
    const pids = new Set(servicePids(service, rows));
    if (state && state.pid) pids.add(Number(state.pid));
    for (const pid of pids) {
      try { process.kill(pid, 'SIGTERM'); log(service, `reset stopped PID ${pid}`); } catch (_) {}
    }
    if (state) { state.child = null; state.pid = null; state.status = 'resetting'; }
  }
  await new Promise(r => setTimeout(r, 1200));
  await scan(true);
}

function lanAddresses() {
  const found = [];
  for (const rows of Object.values(os.networkInterfaces())) for (const n of rows || []) {
    if (n.family === 'IPv4' && !n.internal) found.push(n.address);
  }
  return found;
}

function snapshot(publicView = false) {
  const result = {
    ok: true, daemonPort: DASH_PORT, intervalMs: INTERVAL_MS,
    at: new Date().toISOString(), lan: lanAddresses(),
    services: services.map(s => {
      const row = { ...s, ...runtime.get(s.id), child: undefined };
      if (publicView) {
        delete row.env;
        delete row.args;
        delete row.healthPath;
      }
      return row;
    }),
  };
  if (!publicView) result.root = ROOT;
  return result;
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function dashboard() {
  const data = snapshot(true);
  const rows = data.services.map(s => {
    const cls = s.status === 'up' ? 'up' : (s.status === 'not-installed' ? 'skip' : 'down');
    const href = `http://localhost:${s.port}${s.healthPath || '/'}`;
    return `<tr><td><span class="dot ${cls}"></span><b>${esc(s.name)}</b></td><td><a data-port="${s.port}" data-path="${esc(s.healthPath || '/')}" href="${href}" target="_blank">${s.port}</a></td><td>${esc(s.status)}</td><td>${esc(s.command || s.script || 'auto-discover')}</td><td>${esc(s.detail)}</td></tr>`;
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local Sites Reset</title>
<style>body{font:15px system-ui;margin:0;background:#101217;color:#edf1f7}header{padding:24px;background:#b31820}main{padding:22px;max-width:1200px;margin:auto}.bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}button{background:#efbd4d;border:0;border-radius:8px;padding:11px 18px;font-weight:800;cursor:pointer}table{width:100%;border-collapse:collapse;margin-top:18px;background:#191d25}th,td{text-align:left;padding:11px;border-bottom:1px solid #303644}a{color:#efbd4d}.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:8px}.up{background:#28c76f}.down{background:#ef4444}.skip{background:#7d8798}.small{color:#aab3c3;font-size:13px}</style></head>
<body><header><h1>Local Sites Reset</h1><div>7950 PULSE Machines + every localhost/LAN control site</div></header><main><div class="bar"><button onclick="resetAll()">RESET ALL SITES</button><span id="msg">Auto-scan every ${INTERVAL_MS / 1000}s</span></div>
<p class="small">LAN: ${data.lan.map(ip => `http://${esc(ip)}:${DASH_PORT}/`).join(' · ') || 'no LAN address detected'} · daemon ${DASH_PORT}</p>
<table><thead><tr><th>Site</th><th>Port</th><th>Status</th><th>Entrypoint</th><th>Health</th></tr></thead><tbody>${rows}</tbody></table>
<script>document.querySelectorAll('[data-port]').forEach(a=>a.href=location.protocol+'//'+location.hostname+':'+a.dataset.port+a.dataset.path);async function resetAll(){let key=prompt('Reset key');if(!key)return;msg.textContent='Resetting…';let r=await fetch('/api/reset',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({key})});let j=await r.json();msg.textContent=j.ok?'Reset complete':'Reset failed: '+(j.error||r.status);setTimeout(()=>location.reload(),1500)}setTimeout(()=>location.reload(),10000)</script></main></body></html>`;
}

function readBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 10000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch (_) { resolve({}); } });
  });
}

function callRunningDaemon(method, pathname, body) {
  return new Promise((resolve, reject) => {
    const payload = body == null ? '' : JSON.stringify(body);
    const req = http.request({
      host: '127.0.0.1', port: DASH_PORT, path: pathname, method, timeout: 5000,
      headers: payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {},
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (res.statusCode >= 400) return reject(new Error(parsed.error || `HTTP ${res.statusCode}`));
          resolve(parsed);
        } catch (e) { reject(e); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end(payload);
  });
}

function startDashboard() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (req.method === 'GET' && url.pathname === '/api/status') {
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      return res.end(JSON.stringify(snapshot(true), null, 2));
    }
    if (req.method === 'POST' && url.pathname === '/api/reset') {
      const body = await readBody(req);
      if (String(body.key || '') !== RESET_KEY) {
        res.writeHead(403, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: 'bad key' }));
      }
      await resetAll();
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, status: snapshot(true) }));
    }
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      return res.end(dashboard());
    }
    res.writeHead(404);
    res.end('not found');
  }).listen(DASH_PORT, '0.0.0.0', () => {
    console.log(`Local Sites Reset daemon: http://localhost:${DASH_PORT}/`);
    for (const ip of lanAddresses()) console.log(`LAN: http://${ip}:${DASH_PORT}/`);
  });
}

async function main() {
  if (!acquireLock()) {
    if (resetAtStart) {
      const result = await callRunningDaemon('POST', '/api/reset', { key: RESET_KEY });
      console.log(JSON.stringify(result, null, 2));
    } else if (once) {
      const result = await callRunningDaemon('GET', '/api/status');
      console.log(JSON.stringify(result, null, 2));
      process.exitCode = (result.services || []).some(s => s.required && s.status !== 'up' && s.status !== 'starting' && s.status !== 'would-start') ? 1 : 0;
    } else {
      console.log(`Local Sites daemon is already running (lock: ${LOCK_FILE}).`);
    }
    return;
  }
  await scan(true);
  if (resetAtStart) await resetAll();
  if (once) {
    console.log(JSON.stringify(snapshot(), null, 2));
    process.exitCode = snapshot().services.some(s => s.required && s.status !== 'up' && s.status !== 'starting' && s.status !== 'would-start') ? 1 : 0;
    return;
  }
  startDashboard();
  setInterval(() => scan(true).catch(e => console.error(e)), INTERVAL_MS).unref();
}

process.on('exit', releaseLock);
process.on('SIGINT', () => { releaseLock(); process.exit(0); });
process.on('SIGTERM', () => { releaseLock(); process.exit(0); });
main().catch(e => { console.error(e); process.exitCode = 1; });
