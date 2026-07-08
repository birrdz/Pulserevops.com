#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
if (!process.env.NETLIFY_AUTH_TOKEN) {
  console.error('NETLIFY_AUTH_TOKEN missing');
  process.exit(1);
}
try {
  require('./_render_audit_gate').guardDeploy();
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
const r = spawnSync('npx', [
  '--yes', 'netlify-cli', 'deploy', '--prod',
  '--skip-functions-cache',
  '--message', 'Face hero mv covers + site sync',
], { cwd: WD, stdio: 'inherit', shell: true, env: process.env });
process.exit(r.status || 0);
