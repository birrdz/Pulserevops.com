'use strict';
/**
 * Keep Fix Machine going until fixRunUntil (9pm Eastern tonight).
 * When a NEXT 30 5/5 batch finishes → skip to next 30 → scan → transform (Claude · 1 URL · all stages).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const WD = __dirname;
const SIM = path.join(WD, 'sim');
const GEN = path.join(WD, 'gen');
const PORT = parseInt(process.env.SIM_PORT || '8904', 10);
const LOG = path.join(SIM, 'cursor_fix_keepgoing.log');

function readJSON(f, d) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; }
}
function log(line) {
  const s = new Date().toISOString() + ' · ' + line;
  console.log(s);
  try { fs.appendFileSync(LOG, s + '\n'); } catch (e) {}
}
function untilMs() {
  const cfg = readJSON(path.join(GEN, 'config.json'), {});
  const sess = readJSON(path.join(SIM, 'cursor_fix_session.json'), {});
  const iso = cfg.fixRunUntil || sess.until;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}
function req(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body != null ? JSON.stringify(body) : null;
    const r = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: urlPath,
      method,
      headers: data
        ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        : {},
      timeout: 30000,
    }, (res) => {
      let b = '';
      res.on('data', (c) => { b += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(b || '{}') }); }
        catch (e) { resolve({ status: res.statusCode, json: {}, raw: b }); }
      });
    });
    r.on('error', reject);
    r.on('timeout', () => { r.destroy(); reject(new Error('timeout')); });
    if (data) r.write(data);
    r.end();
  });
}

async function status() {
  const r = await req('GET', '/api/status');
  return r.json || {};
}

async function ensureGo() {
  const s = await status();
  const st = s.status || {};
  const stage = String(st.stage || 'idle');
  if (s.running || stage === 'scan' || stage === 'transform' || stage === 'verify') {
    return { action: 'wait', stage, currentId: st.currentId, remaining: st.remaining };
  }
  if (stage === 'scan-done') {
    await req('POST', '/api/command', { action: 'transform', scope: 'next30', fixStage: 'all' });
    return { action: 'transform', stage };
  }
  // idle / done / stopped → advance NEXT 30 if last batch finished, then scan
  if (stage === 'done' || stage === 'idle' || stage === 'stopped' || stage === 'error') {
    try {
      await req('POST', '/api/next30', { action: stage === 'done' ? 'skip' : 'take' });
    } catch (e) {}
    await req('POST', '/api/command', { action: 'scan', scope: 'next30' });
    return { action: 'scan', stage };
  }
  return { action: 'noop', stage };
}

async function main() {
  const end = untilMs();
  log('KEEPGO start · until ' + new Date(end).toISOString() + ' · Claude · 1 URL · 5/5 · Pexels images');
  while (Date.now() < end) {
    try {
      const r = await ensureGo();
      log(r.action + ' · stage=' + r.stage + (r.currentId ? (' · ' + r.currentId) : '') + (r.remaining != null ? (' · left ' + r.remaining) : ''));
    } catch (e) {
      log('err ' + ((e && e.message) || e));
    }
    await new Promise((r) => setTimeout(r, 45000));
  }
  // Time up — stop fix machine
  try { await req('POST', '/api/command', { action: 'forcestop' }); } catch (e) {}
  log('KEEPGO stop · past 9pm Eastern — DeepSeek rest window closed; Fix Machine force-stopped');
}

main().catch((e) => {
  log('fatal ' + ((e && e.message) || e));
  process.exit(1);
});
