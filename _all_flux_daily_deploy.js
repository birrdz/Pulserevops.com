// _all_flux_daily_deploy.js — once/day SAFE deploy so newly-generated pollinator covers stop 404ing on live.
// Flow (owner law): pause flux writers → DRAFT deploy (never blind --prod) → VERIFY draft health →
// promote via restore API ONLY if healthy → resume writers → email result. If the draft is unhealthy
// (e.g. Cursor mid-broken-edit), it SKIPS the promote and alerts — never pushes a broken site live.
// Stop: _all_flux_daily_deploy_stop.flag.  First deploy fires INTERVAL after launch (we just deployed).
const fs = require('fs');
const { execSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const DEPLOY_EVERY_PILLARS = parseInt(process.env.DEPLOY_EVERY_PILLARS || '3', 10); // deploy after every 3 pillars complete (owner 2026-07-06)
const POLL_MS = parseInt(process.env.DEPLOY_POLL_MS || String(3 * 60 * 1000), 10);
const BASELINE_F = WD + '/_all_flux_deploy_baseline.json'; // {flux: <count at last deploy>}
const GEN_STOP = WD + '/_all_flux_facecards_stop.flag';
const STOP = WD + '/_all_flux_daily_deploy_stop.flag';
const SCRATCH = 'C:/Users/koryj/AppData/Local/Temp/claude/C--Users-koryj/13770b56-5042-4718-9ba0-6cd6a9b9e409/scratchpad';
const LOG = SCRATCH + '/_all_flux_daily_deploy.log';
const DRAFTLOG = SCRATCH + '/_draft_deploy.log';
const RUNLOG = SCRATCH + '/_all_flux_run.log';
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) { const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
// 🔑 (owner 2026-07-07) This loop is spawned via node→cmd.exe, which has NO `bash` on PATH, so every
// auto-deploy was failing at the draft step ("NO draft id"). Resolve Git Bash by absolute path.
function resolveBash() {
  for (const c of ['C:\\Program Files\\Git\\bin\\bash.exe', 'C:\\Program Files\\Git\\usr\\bin\\bash.exe', 'C:\\Program Files (x86)\\Git\\bin\\bash.exe']) {
    try { if (fs.existsSync(c)) return c; } catch (e) {}
  }
  return 'bash';
}
const BASH = resolveBash();
async function fluxCount() {
  try { const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' }); return (idx.entries || []).filter(e => e && e.id && e.cover_src === 'flux').length; }
  catch (e) { log('fluxCount err ' + e.message); return null; }
}
// Count pillars that are 100% flux (all their Q&A entries have a flux cover).
async function completePillars() {
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const es = (idx.entries || []).filter(e => e && e.id && e.question && /^[a-z]+\d+$/.test(e.id));
    const tot = {}, flux = {};
    for (const e of es) { const p = e.id.match(/^([a-z]+)\d+$/)[1]; tot[p] = (tot[p] || 0) + 1; if (e.cover_src === 'flux') flux[p] = (flux[p] || 0) + 1; }
    const done = Object.keys(tot).filter(p => (flux[p] || 0) >= tot[p]).sort((a, b) => tot[a] - tot[b]);
    return { count: done.length, done };
  } catch (e) { log('completePillars err ' + e.message); return null; }
}
// # of pillars the generator has fully processed THIS run (works even under FORCE_ALL, where completePillars can't tell re-done from done).
function runPillarsDone() { try { return JSON.parse(fs.readFileSync(WD + '/_all_flux_run_pillars.json', 'utf8')).count || 0; } catch (e) { return 0; } }
function readBaseline() { try { return JSON.parse(fs.readFileSync(BASELINE_F, 'utf8')).pillars; } catch (e) { return null; } }
function readBaselineFlux() { try { const v = JSON.parse(fs.readFileSync(BASELINE_F, 'utf8')).flux; return Number.isFinite(v) ? v : null; } catch (e) { return null; } }
function writeBaseline(n, f) { try { fs.writeFileSync(BASELINE_F, JSON.stringify({ pillars: n, flux: (f == null ? null : f), at: new Date().toISOString() })); } catch (e) {} }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function log(m) { const l = new Date().toISOString() + ' ' + m; console.log(l); try { fs.appendFileSync(LOG, l + '\n'); } catch (e) {} }
function env(k) { try { const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm')); return m ? m[1].trim() : ''; } catch (e) { return ''; } }
function token() { return env('NETLIFY_AUTH_TOKEN'); }
async function resendKey() {
  let k = env('resendapikey') || env('RESEND_API_KEY'); if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  return '';
}
async function email(subject, body) {
  try {
    const key = await resendKey(); if (!key) return;
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html: '<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;color:#15110d">' + body + '</div>' }) });
  } catch (e) { log('email err ' + e.message); }
}
async function head(url) { try { const r = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(30000) }); const b = await r.arrayBuffer(); return { code: r.status, size: b.byteLength }; } catch (e) { return { code: 0, size: 0 }; } }
function freshCoverIds(n) {
  try {
    const files = fs.readdirSync(WD + '/assets/qa').filter(f => /^[a-z]+\d+\.jpg$/.test(f));
    return files.map(f => { try { return { id: f.replace(/\.jpg$/, ''), m: fs.statSync(WD + '/assets/qa/' + f).mtimeMs }; } catch (e) { return null; } }).filter(Boolean).sort((a, b) => b.m - a.m).slice(0, n).map(x => x.id);
  } catch (e) { return []; }
}
async function doDeploy() {
  log('=== daily deploy start ===');
  // 1) pause generator (publish-root writer) so it can't churn the hash → 422 / partial cover
  fs.writeFileSync(GEN_STOP, 'daily-deploy ' + new Date().toISOString());
  await sleep(60000); // let any in-flight image finish + generator observe the flag
  // refresh the prebuilt mosaic pool so the homepage/topics surface the newly-made covers
  try { execSync('node _gen_mosaic_pool.js', { cwd: WD, timeout: 120000 }); log('mosaic-pool refreshed'); } catch (e) { log('mosaic-pool regen err ' + (e && e.message)); }
  let deployId = null, draftUrl = null;
  try {
    // 2) DRAFT deploy (parks secrets + _site_deploy, 8 retries for 422 churn)
    execSync('"' + BASH + '" _do_deploy_draft.sh > "' + DRAFTLOG + '" 2>&1', { cwd: WD, timeout: 30 * 60 * 1000 });
    const j = fs.readFileSync(DRAFTLOG, 'utf8');
    const mId = j.match(/"deploy_id":\s*"([a-f0-9]+)"/); const mU = j.match(/"deploy_url":\s*"([^"]+)"/);
    deployId = mId && mId[1]; draftUrl = mU && mU[1];
  } catch (e) { log('draft deploy threw ' + e.message); }
  if (!deployId || !draftUrl) { log('NO draft id — aborting, generator resumes'); fs.existsSync(GEN_STOP) && fs.unlinkSync(GEN_STOP); await email('⚠️ Daily cover deploy FAILED (no draft)', 'The draft deploy did not return a deploy id. Covers not promoted. Generator resumed.'); return; }
  log('draft ' + deployId + ' ' + draftUrl);
  // 3) VERIFY draft health before promoting
  const home = await head(draftUrl + '/');
  const ids = freshCoverIds(4);
  const covers = []; for (const id of ids) covers.push({ id, r: await head(draftUrl + '/assets/qa/' + id + '.jpg') });
  const coversOk = covers.filter(c => c.r.code === 200).length;
  const homeOk = home.code === 200 && home.size > 40000;
  const healthy = homeOk && coversOk >= Math.max(1, Math.ceil(ids.length / 2));
  log('verify: home ' + home.code + '/' + home.size + 'b · covers ' + coversOk + '/' + ids.length + ' · healthy=' + healthy);
  if (!healthy) {
    fs.existsSync(GEN_STOP) && fs.unlinkSync(GEN_STOP);
    await email('⛔ Daily cover deploy — draft UNHEALTHY, NOT promoted', 'Draft <b>' + deployId + '</b> failed health check (home ' + home.code + ', covers ' + coversOk + '/' + ids.length + ') so it was <b>not</b> promoted to production — live site untouched. Likely a mid-edit working tree. Draft: <a href="' + draftUrl + '">' + draftUrl + '</a><br>Generator resumed.');
    log('UNHEALTHY — skipped promote, generator resumed');
    return;
  }
  // 4) promote via restore API
  let promoted = false;
  try {
    const r = execSync('curl -s -o NUL -w "%{http_code}" -X POST -H "Authorization: Bearer ' + token() + '" "https://api.netlify.com/api/v1/sites/' + SITE + '/deploys/' + deployId + '/restore"', { encoding: 'utf8', timeout: 120000 }).trim();
    promoted = r === '200';
    log('promote http ' + r);
  } catch (e) { log('promote threw ' + e.message); }
  if (promoted) { try { fs.writeFileSync(WD + '/.last-deploy-ts', new Date().toISOString()); } catch (e) {} }
  // 5) resume generator
  fs.existsSync(GEN_STOP) && fs.unlinkSync(GEN_STOP);
  // 6) confirm prod + email
  const prod = await head('https://pulserevops.com/assets/qa/' + (ids[0] || 'tl0001') + '.jpg');
  await email(promoted ? '✅ Daily cover deploy — LIVE' : '⚠️ Daily cover deploy — promote failed', 'Draft <b>' + deployId + '</b> ' + (promoted ? 'promoted to production.' : 'verified healthy but promote API did not return 200.') + '<br>Prod check ' + (ids[0] || 'tl0001') + '.jpg → HTTP ' + prod.code + '<br>Generator resumed.');
  log('=== daily deploy done · promoted=' + promoted + ' ===');
}
module.exports = { doDeploy };
if (require.main === module) (async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  // Baseline = # of pillars finished-this-run at the last deploy. Seed from current if unset.
  // Also deploy every N NEW flux covers (owner 2026-07-07): a single-pillar campaign (e.g. tl only) never
  // "finishes a pillar", so the pillar trigger never fires and new covers 404 on live indefinitely. This
  // cover-count trigger surfaces them. Tune via DEPLOY_EVERY_COVERS (higher = fewer deploys = lower cost).
  const COVER_TRIGGER = parseInt(process.env.DEPLOY_EVERY_COVERS || '2000', 10); // 2000 balances tile freshness vs deploy cost + generator pause-time (owner 2026-07-07)
  if (readBaseline() == null || readBaselineFlux() == null) { writeBaseline(runPillarsDone(), await fluxCount()); log('seeded baseline: ' + runPillarsDone() + ' pillars · ' + readBaselineFlux() + ' flux covers'); }
  log('deploy loop up — trigger: every ' + DEPLOY_EVERY_PILLARS + ' pillars OR ' + COVER_TRIGGER + ' new covers · poll ' + Math.round(POLL_MS / 60000) + 'm');
  while (!fs.existsSync(STOP)) {
    for (let i = 0; i < 60 && !fs.existsSync(STOP); i++) await sleep(POLL_MS / 60);
    if (fs.existsSync(STOP)) break;
    const base = readBaseline(); const cur = runPillarsDone();
    if (base == null) continue;
    const baseFlux = readBaselineFlux(); const curFlux = await fluxCount();
    const newly = cur - base;
    const newCovers = (curFlux != null && baseFlux != null) ? curFlux - baseFlux : 0;
    if (newly < DEPLOY_EVERY_PILLARS && newCovers < COVER_TRIGGER) { log('since last deploy: +' + newly + '/' + DEPLOY_EVERY_PILLARS + ' pillars · +' + newCovers + '/' + COVER_TRIGGER + ' covers'); continue; }
    log('threshold hit: +' + newly + ' pillars / +' + newCovers + ' covers → deploying');
    try { await doDeploy(); writeBaseline(runPillarsDone(), await fluxCount()); }
    catch (e) { log('FATAL tick ' + e.message); try { fs.unlinkSync(GEN_STOP); } catch (z) {} }
  }
  log('stop flag — exiting');
})();
