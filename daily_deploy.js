#!/usr/bin/env node
/**
 * daily_deploy.js — the once-a-day deploy machine (DEPLOY_LAW.md).
 * Runs from a Windows Scheduled Task at 9 AM. Logic:
 *   1. Find real DEPLOYABLE changes (assets/ · netlify/functions/ · js/ · *.html · *.css · netlify.toml · _redirects),
 *      plus any manual lines in DEPLOY_LAW.md's CODE DEPLOY QUEUE.
 *   2. Empty  -> email "SKIPPED — no code changes", exit.
 *   3. Non-empty -> safe pulse-deploy-clean path: sync changed files -> DRAFT deploy -> verify draft 200
 *      -> PROMOTE via restore-API (never blind --prod). Then email "SHIPPED", append the DEPLOY LOG,
 *      clear the queue. Any failure -> email "FAILED", leave queue intact (retries next day).
 * Owner can also just run `node daily_deploy.js` to deploy on demand.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WD = 'C:/Users/koryj/website';
const CLEAN = 'C:/Users/koryj/pulse-deploy-clean';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const DEPLOY_LAW = WD + '/DEPLOY_LAW.md';
const LOG = WD + '/daily_deploy.log';

for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const TOK = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
const RESEND = process.env.resendapikey || process.env.RESEND_API_KEY;
const logline = m => { const s = new Date().toISOString() + ' ' + m; try { fs.appendFileSync(LOG, s + '\n'); } catch (e) {} console.log('[daily-deploy] ' + m); };

async function email(subject, body) {
  if (!RESEND) { logline('no resend key — skipping email'); return; }
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'PULSE Deploy <onboarding@resend.dev>', to: 'koryjordanwhite@gmail.com', subject, html: '<pre style="font-family:ui-monospace,monospace;font-size:13px">' + String(body).replace(/</g, '&lt;') + '</pre>' }) });
    logline('email "' + subject + '" -> ' + r.status);
  } catch (e) { logline('email failed: ' + e.message); }
}

// STATIC ASSETS ONLY — never auto-ship netlify/functions (stale-local-vs-live regresses the whole site → INCIDENT 2026-07-11).
const DEPLOYABLE = /(^|\/)assets\/|(^|\/)js\/|\.html$|\.css$|(^|\/)netlify\.toml$|(^|\/)_redirects$/i;
function changedDeployable() {
  let out = '';
  try { out = execSync('git -C "' + WD + '" status --short', { encoding: 'utf8' }); } catch (e) { return []; }
  return out.split(/\r?\n/).map(l => l.slice(3).trim()).filter(Boolean)
    .filter(f => !/(^|\/)_[a-z]/.test(f))            // skip scratch _*
    .filter(f => DEPLOYABLE.test(f));
}
function manualQueue() {
  try {
    const md = fs.readFileSync(DEPLOY_LAW, 'utf8');
    const sec = md.split('## CODE DEPLOY QUEUE')[1] || '';
    const body = sec.split('---')[0] || '';
    return body.split(/\r?\n/).filter(l => /^\s*[-*]\s+/.test(l)).map(l => l.replace(/^\s*[-*]\s*/, '').trim())
      .filter(l => l && !/^\(empty\)$/i.test(l));
  } catch (e) { return []; }
}
function clearQueue() {
  try { let md = fs.readFileSync(DEPLOY_LAW, 'utf8');
    md = md.replace(/(## CODE DEPLOY QUEUE[\s\S]*?\n)([\s\S]*?)(\n---)/, '$1_Add a line when you make a CODE/TEMPLATE/ASSET change; clear it when it ships._\n\n- (empty)\n$3');
    fs.writeFileSync(DEPLOY_LAW, md);
  } catch (e) { logline('clearQueue failed: ' + e.message); }
}
function appendDeployLog(what) {
  try { let md = fs.readFileSync(DEPLOY_LAW, 'utf8');
    const row = '| ' + new Date().toISOString().slice(0, 10) + ' | prod | ' + what.replace(/\|/g, '/') + ' |';
    md = md.replace(/(\| Date \| Type \| What shipped \|\n\|[-| ]+\|\n)/, '$1' + row + '\n');
    fs.writeFileSync(DEPLOY_LAW, md);
  } catch (e) { logline('appendDeployLog failed: ' + e.message); }
}

function safeDeploy(files) {
  if (!fs.existsSync(CLEAN)) throw new Error('pulse-deploy-clean not found at ' + CLEAN);
  // 1. sync changed deployable files into the clean snapshot
  for (const f of files) {
    const src = path.join(WD, f), dst = path.join(CLEAN, f);
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
  logline('synced ' + files.length + ' files into pulse-deploy-clean');
  // 2. DRAFT deploy (no --prod)
  // --functions is REQUIRED: netlify-cli v26+ stopped shipping functions under --no-build without it,
  // which made drafts 404 every function-rendered entry page and blocked all promotes (2026-07-17 fix).
  const draftOut = execSync('npx --yes netlify-cli deploy --dir=. --no-build --functions=netlify/functions --site=' + SITE + ' --json', { cwd: CLEAN, encoding: 'utf8', env: Object.assign({}, process.env, { NETLIFY_AUTH_TOKEN: TOK }), timeout: 900000 });
  let draft; try { draft = JSON.parse(draftOut.slice(draftOut.indexOf('{'))); } catch (e) { throw new Error('could not parse draft deploy output'); }
  const draftUrl = draft.deploy_url || draft.url; const deployId = draft.deploy_id || draft.deployId || (draft.deploy && draft.deploy.id);
  if (!draftUrl || !deployId) throw new Error('no draft url/deploy id in output');
  logline('draft: ' + draftUrl + ' (id ' + deployId + ')');
  return { draftUrl, deployId };
}
async function verifyDraft(draftUrl) {
  const home = await fetch(draftUrl).then(r => r.status).catch(() => 0);
  if (home !== 200) throw new Error('draft homepage not 200 (' + home + ')');
  // CRITICAL (INCIDENT 2026-07-11): the homepage is STATIC — it returns 200 even when the renderer functions are
  // broken. Verify FUNCTION-RENDERED entry pages on the draft too; if any 404s, the deploy regressed the renderer
  // → ABORT, never promote.
  for (const p of ['/knowledge/q11133', '/software/sw115']) {
    const s = await fetch(draftUrl + p).then(r => r.status).catch(() => 0);
    if (s !== 200) throw new Error('draft entry page ' + p + ' not 200 (' + s + ') — renderer regressed, refusing to promote');
  }
  logline('draft verified: homepage + entry pages render (200)');
}
async function promote(deployId) {
  const r = await fetch('https://api.netlify.com/api/v1/sites/' + SITE + '/deploys/' + deployId + '/restore', { method: 'POST', headers: { Authorization: 'Bearer ' + TOK } });
  if (!r.ok) throw new Error('restore/promote failed ' + r.status + ': ' + (await r.text()).slice(0, 160));
  logline('PROMOTED to prod (restore ' + r.status + ')');
}

(async () => {
  const files = changedDeployable();
  const manual = manualQueue();
  const queue = [...new Set([...files, ...manual])];
  if (!queue.length) { logline('no deployable changes'); await email('Daily deploy — SKIPPED', 'No code/asset changes queued today. Nothing shipped.\n\n(Content changes go live via Blobs without a deploy.)'); return; }
  logline('deployable changes: ' + queue.length);
  try {
    const { draftUrl, deployId } = safeDeploy(files.length ? files : []);
    await verifyDraft(draftUrl);
    await promote(deployId);
    const what = queue.slice(0, 60).join(', ') + (queue.length > 60 ? ' …(+' + (queue.length - 60) + ')' : '');
    appendDeployLog(what); clearQueue();
    await email('Daily deploy — SHIPPED (' + queue.length + ' files)', 'Promoted to prod ✓\n\nShipped:\n- ' + queue.join('\n- ') + '\n\nDraft: ' + draftUrl);
  } catch (e) {
    logline('DEPLOY FAILED: ' + e.message);
    await email('Daily deploy — FAILED', 'Deploy did NOT complete. Queue left intact for retry.\n\nError: ' + e.message + '\n\nQueued:\n- ' + queue.join('\n- '));
    process.exit(1);
  }
})().catch(e => { logline('FATAL ' + e.message); process.exit(1); });
