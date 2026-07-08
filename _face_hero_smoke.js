#!/usr/bin/env node
/** Smoke test: Face Card & Top Image Generator — first N Movies (mv) entries via API */
const http = require('http');

const BASE = 'http://127.0.0.1:8899';
const KEY = '4444';
const PILLAR = 'mv';
const TARGET = 3;
const POLL_MS = 8000;

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(path, BASE);
    const opts = { hostname: u.hostname, port: u.port, path: u.pathname + u.search, method, headers: { 'Content-Type': 'application/json' } };
    const r = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d || '{}')); } catch (e) { resolve({ raw: d, status: res.statusCode }); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('[smoke] checking face-hero-status…');
  const idle = await req('GET', '/face-hero-status?key=' + KEY);
  if (idle.running) {
    console.log('[smoke] stopping existing run…');
    await req('POST', '/face-hero-stop', { key: KEY });
    await sleep(3000);
  }

  console.log('[smoke] starting pillar=' + PILLAR + ' (Movies)…');
  const start = await req('POST', '/face-hero-start', { key: KEY, pillar: PILLAR });
  console.log('[smoke] start:', JSON.stringify(start));
  if (!start.ok) { process.exit(1); }

  let last = null;
  const t0 = Date.now();
  while (Date.now() - t0 < 20 * 60 * 1000) {
    await sleep(POLL_MS);
    const st = await req('GET', '/face-hero-status?key=' + KEY);
    last = st;
    const line = `[smoke] ${st.entriesDone}/${TARGET} done · ${st.currentId || '-'} · ${st.currentStep || st.phase} · err=${st.errors}`;
    console.log(line);
    if ((st.log || []).slice(0, 3).length) console.log('  log:', (st.log || []).slice(0, 3).join(' | '));
    if (st.entriesDone >= TARGET) {
      console.log('[smoke] target reached — stopping…');
      await req('POST', '/face-hero-stop', { key: KEY });
      await sleep(4000);
      last = await req('GET', '/face-hero-status?key=' + KEY);
      break;
    }
    if (!st.running && st.phase !== 'facehero') {
      console.log('[smoke] job ended early:', st.phase, st.error || '');
      break;
    }
  }

  console.log('\n[smoke] FINAL:', JSON.stringify({
    entriesDone: last.entriesDone,
    coversGenerated: last.coversGenerated,
    fluxJobs: last.fluxJobs,
    errors: last.errors,
    phase: last.phase,
    log: (last.log || []).slice(0, 8),
  }, null, 2));

  process.exit(last && last.errors === 0 && last.entriesDone >= TARGET ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
