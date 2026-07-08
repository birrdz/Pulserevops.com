// _sy_supervisor.js — keeps the Style (sy) campaign lanes alive until the queue is
// drained. Adopts already-running instances (no duplicate spawns); respawns a lane
// only if it has died and work remains. Logs progress every cycle.
//   • _sy_ds_run.js   — 2 DeepSeek writers over _sy_sprint_queue500.json
//   • _sy_img_loop.js — fills real per-outfit photos as entries land
// Stop: _sy_sup_stop.flag (also drops _sy_ds_stop.flag + _sy_img_loop_stop.flag).
// Cap-aware: won't respawn the writer once _ds_spend.json >= DS_DAILY_CAP.
const fs = require('fs');
const { execSync, spawn } = require('child_process');
for (const l of fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const DIR = 'C:/Users/koryj/website';
const STOP = DIR + '/_sy_sup_stop.flag';
const LOG = DIR + '/_sy_supervisor.log';
const CAP = parseFloat(process.env.DS_DAILY_CAP || '15');
const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const logln = s => { const line = new Date().toISOString() + ' ' + s; try { fs.appendFileSync(LOG, line + '\n'); } catch (e) {} console.log(line); };

function isRunning(script) {
  try {
    const out = execSync('powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name=\'node.exe\'\\" | Select-Object -ExpandProperty CommandLine"', { encoding: 'utf8' });
    return out.split(/\r?\n/).some(l => l.includes(script));
  } catch (e) { return false; }
}
function launch(script, outlog) {
  const out = fs.openSync(DIR + '/' + outlog, 'a');
  const ch = spawn(process.execPath, [script], { cwd: DIR, detached: true, stdio: ['ignore', out, out] });
  ch.unref();
  logln(`[sup] launched ${script} pid ${ch.pid}`);
}
const capped = () => { try { return (JSON.parse(fs.readFileSync(DIR + '/_ds_spend.json', 'utf8')).spent || 0) >= CAP; } catch (e) { return false; } };

(async () => {
  const queue = JSON.parse(fs.readFileSync(DIR + '/_sy_sprint_queue500.json', 'utf8'));
  logln(`[sup] start — supervising ${queue.length} queued sy topics`);
  while (!fs.existsSync(STOP)) {
    // progress
    let published = 0;
    try {
      const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      const have = new Set(idx.entries.map(e => e.id));
      published = queue.filter(q => have.has(q.id)).length;
    } catch (e) {}
    const remaining = queue.length - published;
    if (remaining <= 0) { logln(`[sup] queue DRAINED — ${published}/${queue.length} published. stopping.`); break; }

    // keep writer alive (unless capped)
    if (capped()) {
      logln(`[sup] DeepSeek daily cap $${CAP} reached — not respawning writer (img loop continues).`);
    } else if (!isRunning('_sy_ds_run.js')) {
      logln(`[sup] writer not running, ${remaining} left → respawn`);
      launch('_sy_ds_run.js', '_sy_ds_run.out.log');
    }
    // keep image loop alive
    if (!isRunning('_sy_img_loop.js')) {
      logln('[sup] img loop not running → respawn');
      launch('_sy_img_loop.js', '_sy_img_loop.out.log');
    }
    logln(`[sup] progress ${published}/${queue.length} (${remaining} left)`);
    await new Promise(r => setTimeout(r, 90000)); // 90s cycle
  }
  if (fs.existsSync(STOP)) { try { fs.writeFileSync(DIR + '/_sy_ds_stop.flag', '1'); fs.writeFileSync(DIR + '/_sy_img_loop_stop.flag', '1'); } catch (e) {} logln('[sup] STOP flag — signaled lanes to halt.'); }
  logln('[sup] supervisor exit');
})().catch(e => { logln('[sup] FATAL ' + e.message); process.exit(1); });
