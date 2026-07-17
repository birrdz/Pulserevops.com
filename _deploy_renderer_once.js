#!/usr/bin/env node
/**
 * _deploy_renderer_once.js — ship ONLY the renderer (pulse-machine-entry.js) with the versioned-face fix.
 * Mirrors daily_deploy.js's safe path: copy the one function into the clean mirror -> DRAFT deploy ->
 * verify homepage + function-rendered entry pages + qa image serving (200) -> PROMOTE via restore-API.
 * Aborts before promote if ANY check fails. Fully reversible (rollback.js restores the prior deploy).
 */
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const WD = 'C:/Users/koryj/website', CLEAN = 'C:/Users/koryj/pulse-deploy-clean';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const TOK = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
const REL = 'netlify/functions/pulse-machine-entry.js';
const log = m => console.log('[deploy-renderer] ' + m);

(async () => {
  if (!TOK) throw new Error('no NETLIFY_AUTH_TOKEN');
  // 1. copy ONLY the renderer into the clean mirror
  fs.copyFileSync(path.join(WD, REL), path.join(CLEAN, REL));
  log('copied renderer into clean mirror');
  // 2. DRAFT deploy (no --prod)
  const out = execSync('npx --yes netlify-cli deploy --dir=. --no-build --functions=netlify/functions --site=' + SITE + ' --json',
    { cwd: CLEAN, encoding: 'utf8', env: Object.assign({}, process.env, { NETLIFY_AUTH_TOKEN: TOK }), timeout: 900000 });
  const draft = JSON.parse(out.slice(out.indexOf('{')));
  const draftUrl = draft.deploy_url || draft.url, deployId = draft.deploy_id || draft.deployId || (draft.deploy && draft.deploy.id);
  if (!draftUrl || !deployId) throw new Error('no draft url/deploy id');
  log('DRAFT: ' + draftUrl + '  (id ' + deployId + ')');
  // 3. verify on the DRAFT — homepage, several function-rendered entry pages, and qa image serving
  const st = u => fetch(u).then(r => r.status).catch(() => 0);
  const checks = [
    ['homepage', draftUrl + '/'],
    ['entry /knowledge/q11133', draftUrl + '/knowledge/q11133'],
    ['entry /software/sw115', draftUrl + '/software/sw115'],
    ['entry /wellness/wl119', draftUrl + '/wellness/wl119'],
    ['qa image q11133.jpg', draftUrl + '/assets/qa/q11133.jpg'],
  ];
  let bad = 0;
  for (const [name, u] of checks) { const s = await st(u); log((s === 200 ? 'OK  ' : 'FAIL ') + s + '  ' + name); if (s !== 200) bad++; }
  if (bad) throw new Error(bad + ' draft check(s) failed — REFUSING to promote (renderer would regress). Draft left unpromoted; nothing changed live.');
  log('all draft checks passed');
  // 4. PROMOTE via restore-API (never blind --prod)
  const r = await fetch('https://api.netlify.com/api/v1/sites/' + SITE + '/deploys/' + deployId + '/restore',
    { method: 'POST', headers: { Authorization: 'Bearer ' + TOK } });
  if (!r.ok) throw new Error('promote failed ' + r.status + ': ' + (await r.text()).slice(0, 160));
  log('PROMOTED TO PROD ✓  (restore ' + r.status + ')  deployId=' + deployId);
  log('DONE');
})().catch(e => { console.error('[deploy-renderer] ABORTED: ' + e.message); process.exit(1); });
