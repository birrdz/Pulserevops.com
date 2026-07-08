// _overnight_supervisor — the "1 supervisor" (owner 4444). Every 15 min: keep all lanes alive
// (relaunch dead ones), watch for bottlenecks/stalls, and EMAIL a status. Stop: _overnight_supervisor_stop.flag.
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const WD = 'C:/Users/koryj/website';
const STOP = WD + '/_overnight_supervisor_stop.flag';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function psList() { try { return execSync('powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name=\'node.exe\'\\" | Select-Object -ExpandProperty CommandLine"', { encoding: 'utf8', timeout: 25000 }); } catch (e) { return ''; } }
function launch(args, env) { try { spawn('node', args, { cwd: WD, detached: true, stdio: 'ignore', env: Object.assign({}, process.env, env || {}) }).unref(); return true; } catch (e) { return false; } }
async function jget(u) { try { const r = await fetch(u, { signal: AbortSignal.timeout(8000) }); return await r.json(); } catch (e) { return null; } }
async function email(subject, message) { try { await fetch('https://pulserevops.com/.netlify/functions/pulse-owner-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'pulsemachine-writer-2026', subject, message }) }); } catch (e) {} }

const LANES = [
  { name: '_overnight_gen.js', match: '_overnight_gen.js', args: ['_overnight_gen.js'] },
  { name: '_image_audit_all.js', match: '_image_audit_all.js', args: ['_image_audit_all.js'], env: { IMG_WORKERS: '2', IMG_PACE: '1200' } },
  { name: 'pollinator s0', match: '_face_any.js 0', args: ['_face_any.js', '0', '4'] },
  { name: 'pollinator s1', match: '_face_any.js 1', args: ['_face_any.js', '1', '4'] },
  { name: 'pollinator s2', match: '_face_any.js 2', args: ['_face_any.js', '2', '4'] },
  { name: 'pollinator s3', match: '_face_any.js 3', args: ['_face_any.js', '3', '4'] },
];

let prevGreen = null, prevToday = null, cycle = 0;

async function tick() {
  cycle++;
  const list = psList();
  const relaunched = [];
  // scrub server (critical) — check via HTTP, relaunch + resume auto if down
  const sc = await jget('http://localhost:8899/scrub-status?key=4444');
  if (!sc) {
    if (!/_scrub_button_server\.js/.test(list)) { launch(['_scrub_button_server.js']); relaunched.push('scrub-server'); await sleep(6000); }
    // only auto-resume the scrub if the owner hasn't manually turned it OFF
    if (!fs.existsSync(WD + '/_scrub_auto_off.flag')) { try { await fetch('http://localhost:8899/scrub-auto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: '4444', action: 'start' }) }); } catch (e) {} }
  }
  for (const L of LANES) { if (!list.includes(L.match)) { if (launch(L.args, L.env)) relaunched.push(L.name); } }
  // status
  const s2 = await jget('http://localhost:8899/scrub-status?key=4444');
  const gen = await jget('http://localhost:8899/gen-status');
  const green = s2 && s2.state ? s2.state.green : null;
  const today = s2 && s2.state ? s2.state.today : null;
  const flags = [];
  if (relaunched.length) flags.push('relaunched: ' + relaunched.join(', '));
  if (prevGreen != null && green != null && green <= prevGreen && prevToday != null && today != null && today <= prevToday) flags.push('⚠️ output stalled (green+today flat) — check DeepSeek/Max-plan limits');
  const genLine = gen && gen.running ? ('writing ' + (gen.pillarName || gen.pillar || '') + ' — ' + ((gen.published || 0) + (gen.pooled || 0)) + '/' + (gen.target || 0)) : 'idle (loop will start next)';
  const msg = 'PULSE overnight supervisor · cycle ' + cycle + '\n\n' +
    'Green (live 12/13+): ' + (green != null ? green.toLocaleString() : '?') + (prevGreen != null ? ('  (+' + (green - prevGreen) + ' since last)') : '') + '\n' +
    'Scrubbed today: ' + (today != null ? today : '?') + '\n' +
    'Generate crew: ' + genLine + '\n' +
    'Lanes: ' + (relaunched.length ? ('relaunched ' + relaunched.join(', ')) : 'all alive') + '\n' +
    (flags.length ? ('\nFLAGS:\n- ' + flags.join('\n- ')) : '\nNo bottlenecks detected.');
  await email('🌙 PULSE overnight #' + cycle + ' · green ' + (green != null ? green.toLocaleString() : '?'), msg);
  prevGreen = green; prevToday = today;
  console.log(new Date().toISOString() + ' cycle ' + cycle + ' green=' + green + ' relaunched=' + relaunched.length);
}

(async () => {
  console.log('[supervisor] up · 15-min bottleneck check + email');
  await tick();
  while (!fs.existsSync(STOP)) { await sleep(900000); if (fs.existsSync(STOP)) break; await tick(); }
  console.log('[supervisor] stopped');
})();
