// ════════════════════════════════════════════════════════════════════════
// _handoff.js — ONE-COMMAND SESSION HANDOFF for the Pulse gap-fill campaign.
//
//   node _handoff.js            → STATUS ONLY (read-only): live index/net-new,
//                                 active pillar, queue, DS spend, which lanes are
//                                 running vs dead, pending-deploy items, checklist.
//   node _handoff.js --restart  → status + re-spawn any DEAD core lanes (detached,
//                                 dedup-aware: never starts a 2nd copy of a lane).
//   node _handoff.js --restart --dedup-heartbeat
//                               → also kill EXTRA _reconcile_heartbeat.js copies
//                                 down to one (fixes the double-write contention).
//
// Safe to run repeatedly. Spawned lanes survive this process (detached+unref),
// but per the standing note they may die when the terminal/session closes — so
// re-run `node _handoff.js --restart` at the start of each new session.
// ════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const ROOT = 'C:/Users/koryj/website';
const RESTART = process.argv.includes('--restart');
const DEDUP_HB = process.argv.includes('--dedup-heartbeat');

// ── env ────────────────────────────────────────────────────────────────
for (const f of ['.env.local', '.env']) {
  try {
    for (const l of fs.readFileSync(path.join(ROOT, f), 'utf8').split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch (e) {}
}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
const BASELINE = 19851, TARGET = 8730;

const C = { dim: s => '\x1b[2m' + s + '\x1b[0m', g: s => '\x1b[32m' + s + '\x1b[0m', r: s => '\x1b[31m' + s + '\x1b[0m', y: s => '\x1b[33m' + s + '\x1b[0m', b: s => '\x1b[1m' + s + '\x1b[0m' };
const line = () => console.log('─'.repeat(72));

// ── running node lanes (Windows, via PowerShell) ─────────────────────────
function runningLanes() {
  try {
    // Inline -Command using ONLY single-quotes inside (no quote-nesting with the
    // outer double-quotes, and no -ExecutionPolicy/-File needed).
    const ps = "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' } | ForEach-Object { $_.ProcessId.ToString() + '|' + $_.CommandLine }";
    const out = execSync('powershell -NoProfile -Command "' + ps + '"', { encoding: 'utf8', timeout: 30000 });
    const lanes = [];
    for (const ln of out.split(/\r?\n/)) {
      const i = ln.indexOf('|');
      if (i < 0) continue;
      const pid = ln.slice(0, i).trim();
      const cmd = ln.slice(i + 1).trim();
      // A lane started as `node -r ./_loadenv.js REAL.js` lists _loadenv.js FIRST;
      // the real script is the last .js token that isn't the preload wrapper.
      const allJs = cmd.match(/([_A-Za-z0-9]+\.js)\b/g) || [];
      const real = allJs.filter(s => s !== '_loadenv.js');
      const script = (real.length ? real[real.length - 1] : allJs[allJs.length - 1]) || null;
      if (pid && script) lanes.push({ pid, script, cmd });
    }
    return lanes;
  } catch (e) { return null; }
}

// Core lanes we manage. `match` finds them in the running list; `start` spawns them.
const CORE = [
  { name: 'supervisor (writer loop)', script: '_gapfill_forever.js', start: ['node', ['_gapfill_forever.js']] },
  { name: 'reconcile heartbeat',      script: '_reconcile_heartbeat.js', start: ['node', ['-r', './_loadenv.js', '_reconcile_heartbeat.js']], singleton: true },
  { name: 'hourly handoff',           script: '_handoff_hourly.js', start: ['node', ['_handoff_hourly.js']] },
  { name: 'image backfill',           script: '_img_backfill_sitewide.js', start: ['node', ['_img_backfill_sitewide.js']] },
];

function spawnLane(name, bin, args) {
  const log = path.join(ROOT, args[args.length - 1].replace(/\.js$/, '') + '.out.log');
  const fd = fs.openSync(log, 'a');
  const child = spawn(bin, args, { cwd: ROOT, detached: true, stdio: ['ignore', fd, fd], windowsHide: true });
  child.unref();
  return child.pid;
}

// ── main ─────────────────────────────────────────────────────────────────
(async () => {
  console.log('');
  console.log(C.b('  ▶ PULSE CAMPAIGN HANDOFF') + C.dim('  —  ' + new Date().toISOString()));
  line();

  // 1) Live index state
  let idx = null;
  try {
    const { getStore } = require('@netlify/blobs');
    const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
    idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  } catch (e) { console.log(C.r('  ! could not read live index: ' + (e && e.message))); }

  if (idx) {
    const total = idx.entries.length;
    const net = total - BASELINE;
    const pct = (net / TARGET * 100).toFixed(1);
    const cnt = p => idx.entries.filter(e => e && typeof e.id === 'string' && new RegExp('^' + p + '\\d+$', 'i').test(e.id)).length;
    console.log('  ' + C.b('Index:') + ' ' + total.toLocaleString() + ' entries   ' + C.b('net-new:') + ' ' + C.g(net.toLocaleString() + ' / ' + TARGET.toLocaleString()) + ' (' + pct + '%)');
    const watch = ['cl', 'wl', 'ga', 'tl', 'er', 'ik', 'tk', 'sc', 'dn', 'aq', 'ai'];
    console.log('  ' + C.dim('pillars: ' + watch.map(p => p + ':' + cnt(p)).join('  ')));
  }

  // 2) Active pillar + queue + spend
  let activePillar = '(none)';
  try { activePillar = fs.readFileSync(path.join(ROOT, '_current_pillar.txt'), 'utf8').trim(); } catch (e) {}
  let qTotal = 0, qByPfx = {};
  try {
    const q = JSON.parse(fs.readFileSync(path.join(ROOT, '_gapfill_queue.json'), 'utf8'));
    qTotal = q.length;
    for (const it of q) { const p = it.prefix || '?'; qByPfx[p] = (qByPfx[p] || 0) + 1; }
  } catch (e) {}
  let parked = 0;
  try { const pk = JSON.parse(fs.readFileSync(path.join(ROOT, '_gapfill_queue_parked.json'), 'utf8')); parked = (Array.isArray(pk) ? pk : (pk.titles || pk.items || [])).length; } catch (e) {}
  let spend = '?';
  try { const s = JSON.parse(fs.readFileSync(path.join(ROOT, '_ds_spend.json'), 'utf8')); spend = '$' + (s.spent || 0).toFixed(2) + ' (' + (s.calls || 0) + ' calls, ' + (s.date || '') + ')'; } catch (e) {}
  console.log('  ' + C.b('Active pillar:') + ' ' + activePillar + '   ' + C.b('queue:') + ' ' + qTotal + ' ' + C.dim(JSON.stringify(qByPfx)) + '   ' + C.b('parked:') + ' ' + parked);
  console.log('  ' + C.b('DeepSeek spend:') + ' ' + spend);

  // 3) Running vs dead lanes
  line();
  const lanes = runningLanes();
  if (!lanes) { console.log(C.r('  ! could not enumerate node processes')); }
  else {
    const byScript = {};
    for (const l of lanes) (byScript[l.script] = byScript[l.script] || []).push(l.pid);
    console.log('  ' + C.b('LANES:'));
    const missing = [];
    for (const core of CORE) {
      const pids = byScript[core.script] || [];
      if (pids.length === 0) { console.log('   ' + C.r('✗ DOWN') + '  ' + core.name + C.dim('  (' + core.script + ')')); missing.push(core); }
      else if (pids.length > 1 && core.singleton) console.log('   ' + C.y('⚠ ' + pids.length + '×') + '  ' + core.name + C.dim('  PIDs ' + pids.join(',') + ' — DUPLICATE, run --dedup-heartbeat'));
      else console.log('   ' + C.g('✓ up') + '   ' + core.name + C.dim('  (PID ' + pids.join(',') + ')'));
    }

    // 3b) restart dead lanes
    if (RESTART && missing.length) {
      line();
      console.log('  ' + C.b('RESTARTING ' + missing.length + ' dead lane(s)...'));
      for (const core of missing) {
        try { const pid = spawnLane(core.name, core.start[0], core.start[1]); console.log('   ' + C.g('↻ started') + '  ' + core.name + C.dim('  (PID ' + pid + ')')); }
        catch (e) { console.log('   ' + C.r('! failed') + '  ' + core.name + ': ' + (e && e.message)); }
      }
    } else if (RESTART) {
      console.log('  ' + C.g('  all core lanes already up — nothing to restart.'));
    }

    // 3c) dedup heartbeat
    if (DEDUP_HB) {
      const hb = byScript['_reconcile_heartbeat.js'] || [];
      if (hb.length > 1) {
        const kill = hb.slice(1); // keep first, kill the rest
        for (const pid of kill) {
          try { execSync('powershell -NoProfile -Command "Stop-Process -Id ' + pid + ' -Force"', { timeout: 15000 }); console.log('   ' + C.y('✗ killed dup heartbeat') + ' PID ' + pid); }
          catch (e) { console.log('   ' + C.r('! could not kill ' + pid + ': ' + (e && e.message))); }
        }
      } else console.log('  ' + C.dim('  heartbeat already singleton — nothing to dedup.'));
    }
  }

  // 4) Pending owner actions (curated — keep in sync with _HANDOFF_NEXT_CLAUDE.md)
  line();
  console.log('  ' + C.b('PENDING (needs OWNER deploy / decision):'));
  console.log('   • ' + C.y('Sports pillar empty') + ' → deploy js/pillar-page.js (live lacks prefetchSportsTags). No deploy-free path.');
  console.log('   • ' + C.y('CRO ad') + ' → owner will discuss directly (placement TBD). Do not change until then.');
  console.log('   • ' + C.y('Duplicate heartbeat') + ' → run: node _handoff.js --restart --dedup-heartbeat');
  console.log('   • ' + C.dim('Tools 502 already FIXED deploy-free (_tl_tag_trim.js). Gatherings label kept (ga is 50/50, not all-wedding).'));
  console.log('   • ' + C.dim('SEO crawl audit (_sf_crawl_audit.js): weekly --quick --compare; runbook _SF_CRAWL_PROCESS.md'));

  // 5) Next campaign step
  line();
  console.log('  ' + C.b('NEXT CAMPAIGN STEP:'));
  console.log('   Queue drained → pick the smallest open pillar and hand-seed it.');
  console.log('   ' + C.dim('cl/wl/ga are NOT in _gapfill_refill.js (hand-seed via a _seed_<p>.js). Others auto-generate.'));
  console.log('   ' + C.dim('Full detail: _HANDOFF_NEXT_CLAUDE.md  +  memory/project_current_work.md'));
  line();
  console.log('  ' + C.dim(RESTART ? 'Restart pass complete.' : 'Status only. Run `node _handoff.js --restart` to bring up dead lanes.'));
  console.log('');
})().catch(e => { console.error('FATAL', e && e.message); process.exit(1); });
