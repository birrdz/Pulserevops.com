#!/usr/bin/env node
/**
 * Format Fixer CLI — push Q&As through Format Fixer without hunting the unicorn UI.
 *
 * Why: localhost:8899 is often the SEO dashboard / unicorn splash. This talks to the
 * scrub server on a dedicated port, OR runs Format Fixer directly against blobs.
 *
 * Windows (recommended UI path):
 *   $env:SCRUB_BTN_PORT='8902'; node _scrub_button_server.js
 *   Open: http://127.0.0.1:8902/format-fixer
 *   Tap 🦄 → enter 4444 → pick pillar → ▶ Fix
 *
 * CLI via scrub API (server must be up):
 *   node _run_format_fixer_cli.js --base=http://127.0.0.1:8902 --pillar=tl --limit=3
 *   node _run_format_fixer_cli.js --base=http://127.0.0.1:8902 --id=tl21653,tl21654
 *
 * Direct (no UI server — needs .env.local DeepSeek + BLOBS_PAT):
 *   node _run_format_fixer_cli.js --direct --pillar=tl --limit=3
 *   node _run_format_fixer_cli.js --direct --id=aq1160
 */
'use strict';

const fs = require('fs');
const path = require('path');

const WD = __dirname;
// Prefer local .env.local; also tolerate Windows hardcode used elsewhere
try { require('fs').readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/).forEach((l) => {
  const m = l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}); } catch (e) {}
try {
  const win = 'C:/Users/koryj/website/.env.local';
  if (fs.existsSync(win)) {
    for (const l of fs.readFileSync(win, 'utf8').split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch (e) {}

const KEY = process.env.SCRUB_KEY || '4444';
const args = process.argv.slice(2);
function flag(name, def) {
  const i = args.findIndex((a) => a === '--' + name || a.startsWith('--' + name + '='));
  if (i < 0) return def;
  const a = args[i];
  if (a.includes('=')) return a.split('=').slice(1).join('=');
  return args[i + 1] != null && !String(args[i + 1]).startsWith('--') ? args[i + 1] : '1';
}
const DIRECT = args.includes('--direct');
const BASE = String(flag('base', 'http://127.0.0.1:8902')).replace(/\/$/, '');
const PILLAR = flag('pillar', '');
const LIMIT = parseInt(flag('limit', '0'), 10) || 0;
const ID_RAW = flag('id', '');
const IDS = ID_RAW ? ID_RAW.split(/[,:\s]+/).map((s) => s.trim()).filter(Boolean) : [];
const LOG_F = path.join(WD, '_format_fixer_cli.log');
const PROGRESS_F = path.join(WD, '_format_fixer_cli_progress.json');

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

async function post(route, body) {
  const r = await fetch(BASE + route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ key: KEY }, body || {})),
  });
  const t = await r.text();
  try { return JSON.parse(t); } catch (e) { return { ok: false, raw: t.slice(0, 200), status: r.status }; }
}

async function get(route) {
  const r = await fetch(BASE + route + (route.includes('?') ? '&' : '?') + 'key=' + encodeURIComponent(KEY));
  const t = await r.text();
  try { return JSON.parse(t); } catch (e) { return { ok: false, raw: t.slice(0, 200), status: r.status }; }
}

async function runViaApi() {
  log('Format Fixer CLI → API mode @ ' + BASE);
  // ping
  let ping;
  try { ping = await get('/ping'); } catch (e) { ping = null; }
  if (!ping || !ping.ok) {
    log('ERROR: scrub server not reachable at ' + BASE);
    log('Start it first:');
    log('  $env:SCRUB_BTN_PORT=\'8902\'; node _scrub_button_server.js');
    log('Then open http://127.0.0.1:8902/format-fixer  (🦄 → 4444)');
    process.exit(1);
  }
  log('scrub ping ok · port=' + (ping.port || '?'));

  if (IDS.length) {
    log('NOTE: API mode runs whole pillar; for specific IDs use --direct --id=...');
  }
  if (!PILLAR) {
    log('ERROR: --pillar=xx required in API mode (e.g. --pillar=tl)');
    process.exit(1);
  }

  const started = await post('/format-fixer-start', { pillar: PILLAR });
  if (!started.started && !started.ok) {
    log('start failed: ' + (started.msg || JSON.stringify(started)));
    process.exit(1);
  }
  log('▶ Format Fixer started for pillar=' + PILLAR + (LIMIT ? ' (will stop after ~' + LIMIT + ' done if limit set)' : ''));

  let lastDone = -1;
  for (;;) {
    await new Promise((r) => setTimeout(r, 2000));
    const st = await get('/format-fixer-status');
    const done = st.done || 0;
    const total = st.total || 0;
    const pass = st.entriesPass || 0;
    const fixed = st.entriesFixed || 0;
    if (done !== lastDone) {
      log(`progress ${done}/${total} · pass=${pass} fixed=${fixed} · ${st.currentId || ''} · ${st.phase || ''}`);
      lastDone = done;
      try { fs.writeFileSync(PROGRESS_F, JSON.stringify(st, null, 2)); } catch (e) {}
    }
    if (LIMIT && done >= LIMIT) {
      log('limit reached — stopping Format Fixer');
      await post('/format-fixer-stop', {});
      break;
    }
    if (!st.running && (st.phase === 'done' || st.phase === 'stopped' || st.phase === 'error')) {
      log('finished phase=' + st.phase + ' · pass=' + pass + ' fixed=' + fixed + ' errors=' + (st.errors || 0));
      break;
    }
  }
  log('Format Fixer CLI done. Log: ' + LOG_F);
}

async function runDirect() {
  log('Format Fixer CLI → DIRECT blob mode');
  if (!process.env.BLOBS_PAT && !process.env.NETLIFY_AUTH_TOKEN) {
    log('ERROR: BLOBS_PAT / NETLIFY_AUTH_TOKEN missing (.env.local)');
    process.exit(1);
  }
  if (!process.env.DEEPSEEK_API_KEY && !process.env.ds1) {
    log('ERROR: DEEPSEEK_API_KEY / ds1 missing (.env.local)');
    process.exit(1);
  }

  const { getStore } = require('@netlify/blobs');
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
    token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
  });
  const { formatFixEntry, contentFormatPass, contentRubricAudit } = require('./_format_fixer_lib');
  const { fixEntry } = require('./_v2_components');
  const { dsChat } = require('./_ds_lib');
  const { pillarOf } = require('./netlify/functions/lib/grade-entry');

  const idx = await store.get('_index.json', { type: 'json' });
  const entries = (idx && idx.entries) || [];
  const titleOf = {};
  const byPillar = {};
  for (const e of entries) {
    if (!e || !e.id) continue;
    titleOf[e.id] = e.question || e.title || e.id;
    const p = pillarOf(e.id);
    (byPillar[p] || (byPillar[p] = [])).push(e);
  }
  const valid = new Set(entries.map((e) => e && e.id).filter(Boolean));

  let queue = [];
  if (IDS.length) queue = IDS.slice();
  else if (PILLAR) queue = entries.filter((e) => e && pillarOf(e.id) === PILLAR).map((e) => e.id);
  else {
    log('ERROR: pass --pillar=xx or --id=a,b,c');
    process.exit(1);
  }
  if (LIMIT > 0) queue = queue.slice(0, LIMIT);
  log('queue=' + queue.length + (PILLAR ? ' pillar=' + PILLAR : '') + (IDS.length ? ' ids=' + IDS.join(',') : ''));

  const results = [];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    const title = titleOf[id] || id;
    log(`[${i + 1}/${queue.length}] Format Fixer · ${id} · ${String(title).slice(0, 70)}`);
    const e = await store.get('answers/' + id + '.json', { type: 'json' });
    if (!e || !e.answer) {
      log('  ⏭ no blob');
      results.push({ id, skip: 'noBlob' });
      continue;
    }
    const before = contentRubricAudit(id, e.answer, { valid, title });
    if (before.pass) {
      if (!e.format_fixed_at) {
        await store.setJSON('answers/' + id + '.json', Object.assign({}, e, {
          format_fixed_at: new Date().toISOString(),
        }));
      }
      log('  ✓ already pass · stamped format_fixed_at');
      results.push({ id, pass: true, skipped: true });
      continue;
    }
    const sib = (byPillar[pillarOf(id)] || []).filter((x) => x && x.id !== id).slice(0, 8);
    const r = await formatFixEntry(id, title, e.answer, {
      valid,
      siblings: sib,
      store,
      entryMeta: e,
      fixEntry,
      dsChat,
      deban: (b) => b,
      boldify: (b) => b,
      ensureErFormat: (_id, b) => b,
      enforceCroCardLaw: (b) => b,
      pillarOf,
      maxRounds: 2,
      onProgress: (p) => log('    · ' + (p.phase || 'fix') + ' ' + (p.label || '')),
    });
    const pass = !!(r.after && r.after.pass) || !!r.pass;
    await store.setJSON('answers/' + id + '.json', Object.assign({}, e, {
      answer: r.body || e.answer,
      updated_at: new Date().toISOString(),
      format_fixed_at: pass ? new Date().toISOString() : (e.format_fixed_at || null),
      format_fix_steps: r.steps || [],
    }));
    log(`  ${pass ? '✓ PASS' : '✗ still failing'} · ${(r.steps || []).join('+') || '—'} · failed=${((r.after && r.after.failed) || []).slice(0, 6).join(',')}`);
    results.push({
      id,
      pass,
      steps: r.steps || [],
      failed: (r.after && r.after.failed) || [],
      beforePct: r.before && r.before.rubricPct,
      afterPct: r.after && r.after.rubricPct,
    });
    try { fs.writeFileSync(PROGRESS_F, JSON.stringify({ i: i + 1, total: queue.length, results }, null, 2)); } catch (err) {}
  }
  const passed = results.filter((x) => x.pass).length;
  log(`DONE · ${passed}/${results.length} pass Format Fixer`);
  log('Progress: ' + PROGRESS_F);
}

(async () => {
  if (args.includes('--help') || args.includes('-h')) {
    console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#!.*\n/, '').replace(/^\/\*\*?\n?/, ''));
    process.exit(0);
  }
  if (DIRECT) await runDirect();
  else await runViaApi();
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(2);
});
