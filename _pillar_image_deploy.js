// _pillar_image_deploy.js — Netlify prod deploy ONLY after a full pillar is done + owner approved (4444 law).
//
// Never deploy mid-pillar or per-entry. Face-card assets (/assets/qa), mosaic CSS, and renderer
// changes go live in one prod deploy at pillar boundary.
//
// Usage (after review + approval):
//   PILLAR_IMAGE_APPROVE=1 node _pillar_image_deploy.js --pillar=hf
//   node _pillar_image_deploy.js --pillar=hf   # requires _pillar_image_review_approved.flag
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const WD = __dirname;
const APPROVE_F = WD + '/_pillar_image_review_approved.flag';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';

const PILLAR_NAMES = {
  tl: 'Pulse Tools / CRO', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs',
  tk: 'Tech Stacks', bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises',
  co: 'Collectibles', ai: 'AI Infrastructure', gb: 'Graphics', bo: 'Buildouts',
  sy: 'Style', cr: 'Crabbing', fs: 'Fishing', gp: 'GTM Playbooks', ra: 'Revenue Architecture',
  pt: 'Pets', es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne', lv: 'Luxury Vacations',
  ev: 'Events', ga: 'Gatherings', gm: 'Gaming', wl: 'Wellness', dr: 'Drills', dn: 'Dining',
  nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics', ce: 'Current Events',
  q: 'Q&A', ed: 'Education', hf: 'Home Fitness', sw: 'Software', sk: 'Skills', sp: 'Sports', cg: 'Coaching',
};

for (const l of fs.readFileSync(path.join(WD, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

function isApproved() {
  return process.env.PILLAR_IMAGE_APPROVE === '1' || fs.existsSync(APPROVE_F);
}

function deployPillarProd(pillar, opts) {
  opts = opts || {};
  if (process.env.PILLAR_IMAGE_SKIP_DEPLOY === '1') {
    return { deployed: false, skipped: true, reason: 'PILLAR_IMAGE_SKIP_DEPLOY=1' };
  }
  if (!opts.force && !isApproved()) {
    return {
      deployed: false,
      skipped: true,
      reason: 'awaiting-owner-approval',
      hint: 'Create _pillar_image_review_approved.flag or set PILLAR_IMAGE_APPROVE=1 (owner 4444)',
    };
  }
  if (!process.env.NETLIFY_AUTH_TOKEN) {
    return { deployed: false, error: 'NETLIFY_AUTH_TOKEN missing in .env.local' };
  }
  try {
    require('./_render_audit_gate').guardDeploy();
  } catch (e) {
    return { deployed: false, error: 'render-audit-blocked: ' + e.message };
  }

  const label = PILLAR_NAMES[pillar] || pillar;
  const msg = opts.message || ('Pillar image rollout · ' + pillar + ' · ' + label + ' · approved deploy');
  const logF = WD + '/_pillar_image_deploy.log';
  const line = new Date().toISOString() + ' ▶ netlify deploy --prod · ' + msg;
  console.log(line);
  try { fs.appendFileSync(logF, line + '\n'); } catch (e) {}

  const r = spawnSync('npx', [
    '--yes', 'netlify-cli', 'deploy', '--prod',
    '--skip-functions-cache',
    '--message', msg,
  ], { cwd: WD, stdio: 'inherit', shell: true, env: process.env });

  const ok = r.status === 0;
  const result = {
    deployed: ok,
    pillar,
    label,
    siteId: SITE,
    message: msg,
    exitCode: r.status || 0,
    at: new Date().toISOString(),
  };
  fs.writeFileSync(WD + '/_pillar_image_last_deploy.json', JSON.stringify(result, null, 2));
  try { fs.appendFileSync(logF, new Date().toISOString() + (ok ? ' ✓ prod live' : ' ✗ deploy failed') + '\n'); } catch (e) {}
  return result;
}

function main() {
  const args = process.argv.slice(2);
  const pillar = (args.find((a) => a.startsWith('--pillar=')) || '').split('=')[1]
    || (args.includes('--pillar') ? args[args.indexOf('--pillar') + 1] : '')
    || process.env.PILLAR || '';
  if (!pillar) {
    console.error('Usage: PILLAR_IMAGE_APPROVE=1 node _pillar_image_deploy.js --pillar=<prefix>');
    process.exit(1);
  }
  if (/^mv$/i.test(pillar)) {
    console.error('HARD EXCLUSION: mv deploy via this pillar pipeline is blocked.');
    process.exit(2);
  }
  const result = deployPillarProd(pillar.toLowerCase(), { force: args.includes('--force') });
  if (!result.deployed) {
    console.error(result.error || result.reason || 'deploy not run');
    if (result.hint) console.error(result.hint);
    process.exit(result.skipped ? 0 : 1);
  }
  console.log('✓ Netlify prod deploy complete for pillar ' + pillar);
}

if (require.main === module) main();

module.exports = { deployPillarProd, isApproved, APPROVE_F };
