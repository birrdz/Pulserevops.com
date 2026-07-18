#!/usr/bin/env node
// _deploy_static_once.js — ship robots.txt + sitemap-index.xml (drop the obsolete 502-ing sitemap-reviews.xml).
'use strict';
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const WD = 'C:/Users/koryj/website', CLEAN = 'C:/Users/koryj/pulse-deploy-clean';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
for (const l of (() => { try { return fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/); } catch (e) { return []; } })()) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const TOK = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
const FILES = ['robots.txt', 'sitemap-index.xml'];
const log = m => console.log('[deploy-static] ' + m);
(async () => {
  if (!TOK) throw new Error('no NETLIFY_AUTH_TOKEN');
  for (const f of FILES) fs.copyFileSync(path.join(WD, f), path.join(CLEAN, f));
  log('copied ' + FILES.length + ' files');
  const out = execSync('npx --yes netlify-cli deploy --dir=. --no-build --functions=netlify/functions --site=' + SITE + ' --json',
    { cwd: CLEAN, encoding: 'utf8', env: Object.assign({}, process.env, { NETLIFY_AUTH_TOKEN: TOK }), timeout: 900000 });
  const draft = JSON.parse(out.slice(out.indexOf('{')));
  const draftUrl = draft.deploy_url || draft.url, deployId = draft.deploy_id || draft.deployId || (draft.deploy && draft.deploy.id);
  log('DRAFT: ' + draftUrl);
  const txt = async u => { const r = await fetch(u).catch(() => null); return { s: r ? r.status : 0, t: r ? await r.text() : '' }; };
  let bad = 0;
  const home = await txt(draftUrl + '/'); if (home.s !== 200) { log('FAIL homepage ' + home.s); bad++; } else log('OK homepage');
  const rob = await txt(draftUrl + '/robots.txt'); if (rob.s !== 200) { log('FAIL robots ' + rob.s); bad++; } else log('OK robots · reviews-line gone=' + !/sitemap-reviews\.xml/.test(rob.t));
  const idx = await txt(draftUrl + '/sitemap-index.xml'); if (idx.s !== 200) { log('FAIL index ' + idx.s); bad++; } else log('OK sitemap-index · reviews gone=' + !/sitemap-reviews\.xml/.test(idx.t) + ' · has tools+knowledge=' + (/sitemap-tools\.xml/.test(idx.t) && /sitemap-knowledge\.xml/.test(idx.t)));
  const tools = await fetch(draftUrl + '/sitemap-tools.xml').then(r => r.status).catch(() => 0); if (tools !== 200) { log('FAIL tools sitemap ' + tools); bad++; } else log('OK tools sitemap still 200');
  if (bad) throw new Error(bad + ' check(s) failed — not promoting');
  const r = await fetch('https://api.netlify.com/api/v1/sites/' + SITE + '/deploys/' + deployId + '/restore', { method: 'POST', headers: { Authorization: 'Bearer ' + TOK } });
  if (!r.ok) throw new Error('promote failed ' + r.status);
  log('PROMOTED ✓ ' + deployId); log('DONE');
})().catch(e => { console.error('[deploy-static] ABORTED: ' + e.message); process.exit(1); });
