#!/usr/bin/env node
// _deploy_edit_once.js — ship the owner inline-title-edit feature: index.html + js/pulse-edit.js + the
// secret-gated function. Clean-mirror → DRAFT → verify homepage + entry pages + auth gate → PROMOTE.
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const WD = 'C:/Users/koryj/website', CLEAN = 'C:/Users/koryj/pulse-deploy-clean';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const TOK = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
const FILES = ['index.html', 'js/pulse-edit.js', 'netlify/functions/pulse-title-edit.js'];
const log = m => console.log('[deploy-edit] ' + m);

(async () => {
  if (!TOK) throw new Error('no NETLIFY_AUTH_TOKEN');
  for (const f of FILES) { const dst = path.join(CLEAN, f); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(path.join(WD, f), dst); }
  log('copied ' + FILES.length + ' files into clean mirror');
  const out = execSync('npx --yes netlify-cli deploy --dir=. --no-build --functions=netlify/functions --site=' + SITE + ' --json',
    { cwd: CLEAN, encoding: 'utf8', env: Object.assign({}, process.env, { NETLIFY_AUTH_TOKEN: TOK }), timeout: 900000 });
  const draft = JSON.parse(out.slice(out.indexOf('{')));
  const draftUrl = draft.deploy_url || draft.url, deployId = draft.deploy_id || draft.deployId || (draft.deploy && draft.deploy.id);
  if (!draftUrl || !deployId) throw new Error('no draft url/deploy id');
  log('DRAFT: ' + draftUrl + '  (id ' + deployId + ')');
  const st = u => fetch(u).then(r => r.status).catch(() => 0);
  let bad = 0;
  for (const [n, u] of [['homepage', draftUrl + '/'], ['entry q11133', draftUrl + '/knowledge/q11133'], ['entry sw115', draftUrl + '/software/sw115']]) { const s = await st(u); log((s === 200 ? 'OK  ' : 'FAIL ') + s + '  ' + n); if (s !== 200) bad++; }
  // auth gate: wrong secret → 403; correct secret + fake id → 404 (proves gate + blob path, changes nothing)
  const post = (body) => fetch(draftUrl + '/.netlify/functions/pulse-title-edit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.status).catch(() => 0);
  const s403 = await post({ id: 'zzznotreal', title: 'a test title here', secret: 'WRONG' });
  log((s403 === 403 ? 'OK  ' : 'FAIL ') + s403 + '  auth rejects wrong secret (want 403)'); if (s403 !== 403) bad++;
  let realSecret = ''; try { const { getStore } = require('@netlify/blobs'); const st2 = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || TOK }); realSecret = String(await st2.get('config/edit_secret', { type: 'text' }) || '').trim(); } catch (e) {}
  if (realSecret) { const s404 = await post({ id: 'zzznotreal', title: 'a test title here', secret: realSecret }); log((s404 === 404 ? 'OK  ' : 'WARN ') + s404 + '  correct secret + fake id (want 404 = gate passed, no change)'); }
  if (bad) throw new Error(bad + ' check(s) failed — REFUSING to promote. Nothing changed live.');
  log('all checks passed');
  const r = await fetch('https://api.netlify.com/api/v1/sites/' + SITE + '/deploys/' + deployId + '/restore', { method: 'POST', headers: { Authorization: 'Bearer ' + TOK } });
  if (!r.ok) throw new Error('promote failed ' + r.status + ': ' + (await r.text()).slice(0, 160));
  log('PROMOTED TO PROD ✓  deployId=' + deployId); log('DONE');
})().catch(e => { console.error('[deploy-edit] ABORTED: ' + e.message); process.exit(1); });
