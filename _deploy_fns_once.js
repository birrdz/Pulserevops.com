#!/usr/bin/env node
// _deploy_fns_once.js — ship pulse-machine-sitemap.js (502 fix) + pulse-cro-lead.js (!!!! email).
// Clean-mirror → DRAFT → verify homepage + entry pages + the two previously-502 sitemaps now 200 → PROMOTE.
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const WD = 'C:/Users/koryj/website', CLEAN = 'C:/Users/koryj/pulse-deploy-clean';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const TOK = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
const FILES = ['netlify/functions/pulse-machine-sitemap.js', 'netlify/functions/pulse-cro-lead.js'];
const log = m => console.log('[deploy-fns] ' + m);

(async () => {
  if (!TOK) throw new Error('no NETLIFY_AUTH_TOKEN');
  for (const f of FILES) { fs.copyFileSync(path.join(WD, f), path.join(CLEAN, f)); }
  log('copied ' + FILES.length + ' functions into clean mirror');
  const out = execSync('npx --yes netlify-cli deploy --dir=. --no-build --functions=netlify/functions --site=' + SITE + ' --json',
    { cwd: CLEAN, encoding: 'utf8', env: Object.assign({}, process.env, { NETLIFY_AUTH_TOKEN: TOK }), timeout: 900000 });
  const draft = JSON.parse(out.slice(out.indexOf('{')));
  const draftUrl = draft.deploy_url || draft.url, deployId = draft.deploy_id || draft.deployId || (draft.deploy && draft.deploy.id);
  if (!draftUrl || !deployId) throw new Error('no draft url/deploy id');
  log('DRAFT: ' + draftUrl);
  const check = async (name, u, wantLoc) => { const r = await fetch(u).catch(() => null); const s = r ? r.status : 0; let ok = s === 200; let extra = ''; if (ok && wantLoc) { const t = await r.text(); const n = (t.match(/<loc>/g) || []).length; extra = ' · ' + n + ' URLs'; ok = n > 0; } log((ok ? 'OK  ' : 'FAIL ') + s + '  ' + name + extra); return ok; };
  let bad = 0;
  if (!await check('homepage', draftUrl + '/')) bad++;
  if (!await check('entry /knowledge/q11133', draftUrl + '/knowledge/q11133')) bad++;
  if (!await check('entry /software/sw115', draftUrl + '/software/sw115')) bad++;
  if (!await check('sitemap-tools.xml (was 502)', draftUrl + '/sitemap-tools.xml', true)) bad++;
  if (!await check('sitemap-knowledge.xml (was 502)', draftUrl + '/sitemap-knowledge.xml', true)) bad++;
  if (!await check('sitemap-cars.xml (regression check)', draftUrl + '/sitemap-cars.xml', true)) bad++;
  if (bad) throw new Error(bad + ' check(s) failed — REFUSING to promote. Nothing changed live.');
  log('all checks passed');
  const r = await fetch('https://api.netlify.com/api/v1/sites/' + SITE + '/deploys/' + deployId + '/restore', { method: 'POST', headers: { Authorization: 'Bearer ' + TOK } });
  if (!r.ok) throw new Error('promote failed ' + r.status);
  log('PROMOTED TO PROD ✓  deployId=' + deployId); log('DONE');
})().catch(e => { console.error('[deploy-fns] ABORTED: ' + e.message); process.exit(1); });
