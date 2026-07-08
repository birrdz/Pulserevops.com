// _image_dashboard_server.js — Fable v2 image scrub dashboard + picker API (port 8891)
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.csv': 'text/plain; charset=utf-8' };
let scrubChild = null;

function readJ(f, d) { try { return JSON.parse(fs.readFileSync(path.join(WD, f), 'utf8')); } catch (e) { return d; } }
function json(res, code, o) { res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(o)); }
function body(req) { return new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (e) { r({}); } }); }); }

function scrubRunning() { return scrubChild && !scrubChild.killed; }

http.createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }); return res.end(); }

  if (url === '/api/status' && req.method === 'GET') {
    const status = readJ('_image_status.json', null);
    const queue = readJ('_image_picker_queue.json', { waiting: null, history: [] });
    return json(res, 200, { status, queue, scrubRunning: scrubRunning() });
  }
  if (url === '/api/picker/pick' && req.method === 'POST') {
    const b = await body(req);
    const { recordPick } = require('./_image_picker_lib');
    if (!b.id || !Number.isInteger(b.idx)) return json(res, 400, { ok: false, err: 'id+idx required' });
    recordPick(b.id, b.idx, 'pick');
    return json(res, 200, { ok: true });
  }
  if (url === '/api/picker/auto' && req.method === 'POST') {
    const b = await body(req);
    const { recordPick } = require('./_image_picker_lib');
    recordPick(b.id, 0, 'auto');
    return json(res, 200, { ok: true });
  }
  if (url === '/api/picker/none' && req.method === 'POST') {
    const b = await body(req);
    const { recordPick } = require('./_image_picker_lib');
    recordPick(b.id, -1, 'none');
    return json(res, 200, { ok: true });
  }
  if (url === '/api/scrub/start' && req.method === 'POST') {
    if (scrubRunning()) return json(res, 200, { ok: true, msg: 'already running' });
    const b = await body(req);
    const env = Object.assign({}, process.env, { PICK_SCOPE: b.pickScope || 'none', DDG_PACE_MS: String(b.ddgPace || 12000) });
    if (b.pillar) env.PILLAR = String(b.pillar);
    if (b.pillars) env.PILLARS = String(b.pillars);
    if (!env.PILLAR && !env.PILLARS) env.PILLAR = 'gp';
    scrubChild = spawn(process.execPath, [path.join(WD, '_image_scrub.js')], { cwd: WD, env, stdio: 'ignore', detached: false });
    scrubChild.on('exit', () => { scrubChild = null; });
    return json(res, 200, { ok: true, pid: scrubChild.pid });
  }
  if (url === '/api/scrub/stop' && req.method === 'POST') {
    if (scrubChild) { scrubChild.kill('SIGTERM'); scrubChild = null; }
    return json(res, 200, { ok: true });
  }

  let p = url;
  if (p === '/' || p === '/dashboard') p = '/_image_dashboard.html';
  const f = path.join(WD, p.replace(/^\//, '').replace(/\.\./g, ''));
  const norm = f.replace(/\\/g, '/');
  if (!norm.startsWith(WD.replace(/\\/g, '/'))) { res.writeHead(403); return res.end('no'); }
  fs.readFile(f, (e, buf) => {
    if (e) { res.writeHead(404); return res.end('404 ' + p); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(8891, '127.0.0.1', () => console.log('Fable v2 image dashboard → http://localhost:8891/'));
