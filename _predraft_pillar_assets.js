'use strict';
/**
 * Draft-deploy ST (+ optional RA) face assets from pulse-deploy-clean.
 * Usage: node _predraft_pillar_assets.js st
 *        node _predraft_pillar_assets.js st,ra
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
const CLEAN = 'C:/Users/koryj/pulse-deploy-clean';
const pillars = String(process.argv[2] || 'st').toLowerCase().split(/[,+]/).map((s) => s.trim()).filter(Boolean);

for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const TOKEN = process.env.NETLIFY_AUTH_TOKEN;
if (!TOKEN) { console.error('NO_TOKEN'); process.exit(2); }
if (!fs.existsSync(path.join(CLEAN, 'assets', 'qa'))) {
  console.error('NO_DEPLOY_CLEAN');
  process.exit(2);
}

const src = path.join(WD, 'assets', 'qa');
const dst = path.join(CLEAN, 'assets', 'qa');
let copied = 0;
for (const f of fs.readdirSync(src)) {
  const hit = pillars.some((p) => new RegExp('^' + p + '.+\\.jpe?g$', 'i').test(f));
  if (!hit) continue;
  fs.copyFileSync(path.join(src, f), path.join(dst, f));
  copied++;
}
console.log(JSON.stringify({ copied, pillars }));

const msg = 'pre-draft ' + pillars.join('+') + ' face+sq assets';
const out = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['--yes', 'netlify-cli@latest', 'deploy', '--dir=.', '--site=a2b74b30-a1ac-40e2-9622-aebfc2feb482', '--json', '--no-build', '--message=' + msg],
  {
    cwd: CLEAN,
    env: Object.assign({}, process.env, { NETLIFY_AUTH_TOKEN: TOKEN }),
    encoding: 'utf8',
    windowsHide: true,
    timeout: 600000,
  }
);
const text = String(out.stdout || '') + '\n' + String(out.stderr || '');
fs.writeFileSync(path.join(WD, '_predraft_last.json'), text);
console.log('exit', out.status);
const m = text.match(/"deploy_url"\s*:\s*"([^"]+)"/) || text.match(/https:\/\/[a-z0-9-]+--pulserevops\.netlify\.app/);
const id = text.match(/"deploy_id"\s*:\s*"([^"]+)"/) || text.match(/"id"\s*:\s*"([a-f0-9]{20,})"/);
console.log(JSON.stringify({
  ok: out.status === 0,
  deploy_url: m && (m[1] || m[0]),
  deploy_id: id && id[1],
  tail: text.slice(-500),
}, null, 2));
