// _pillar_image_orchestrator.js — pillar image rollout: pilot → report → STOP → approve → deploy → next.
//
// DEPLOY LAW (owner 2026-07-08): NO Netlify deploy mid-pillar or per-entry. One prod deploy only after
// the entire topic pillar is finished, golden-validated, and owner-approved (4444 / APPROVE flag).
//
// Face-card law: promote Top-10 @@PRODUCT or internal section image before provider fetch.
// mv pillar: HARD EXCLUDED.
//
// Usage:
//   node _pillar_image_orchestrator.js --pilot              # smallest real pillar → report → STOP
//   node _pillar_image_orchestrator.js --pillar=hf           # one pillar → report → STOP
//   PILLAR_IMAGE_APPROVE=1 node _pillar_image_orchestrator.js --deploy-approved --pillar=hf
//   PILLAR_IMAGE_APPROVE=1 node _pillar_image_orchestrator.js --continue  # deploy approved pillar, then next
//
// Pause: touch _pillar_image_orchestrator_stop.flag
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const { getStore } = require('@netlify/blobs');
const {
  shouldSkipMv,
  isMvPillar,
  assertNotMv,
  filterOutMv,
  pillarOf,
} = require('./netlify/functions/lib/mv-pillar-guard');
const { ensureFaceCardFromEntryImages } = require('./_entry_image_reuse_lib');
const { validatePillar } = require('./_pillar_golden_validate');
const { deployPillarProd, isApproved, APPROVE_F } = require('./_pillar_image_deploy');

const WD = __dirname;
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const STATE_F = WD + '/_pillar_image_orchestrator_state.json';
const STOP_F = WD + '/_pillar_image_review_stop.flag';
const STOP_RUN_F = WD + '/_pillar_image_orchestrator_stop.flag';
const LOG_F = WD + '/_pillar_image_orchestrator.log';

const VALID_PILLARS = new Set([
  'tl', 'ca', 'bt', 'aq', 'ik', 'tk', 'bs', 'st', 'fr', 'co', 'ai', 'gb', 'bo', 'sy', 'cr', 'fs',
  'gp', 'ra', 'pt', 'es', 'tv', 'rs', 'cl', 'lv', 'ev', 'ga', 'gm', 'wl', 'dr', 'dn', 'nl', 'tn',
  'sc', 'tc', 'er', 'ce', 'q', 'ed', 'hf', 'sw', 'sk', 'sp', 'cg',
]);

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

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_F, 'utf8')); } catch (e) {
    return { completed: [], deployed: [], pilotDone: false, order: [] };
  }
}

function writeState(st) {
  fs.writeFileSync(STATE_F, JSON.stringify(Object.assign(st, { at: new Date().toISOString() }), null, 2));
}

function hubFor(pillar) {
  const map = {
    aq: 'aquariums', ca: 'cars', bt: 'boats', tl: 'tools', ce: 'knowledge', q: 'knowledge',
    er: 'electronicreview', hf: 'knowledge', fs: 'fishing', gm: 'gaming', ga: 'gatherings',
  };
  return map[pillar] || pillar;
}

function filterValidPillarOrder(order, counts) {
  return order.filter((p) => VALID_PILLARS.has(p) && !isMvPillar(p));
}

async function pillarCounts(store) {
  const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
  const counts = {};
  for (const row of filterOutMv(idx.entries || [])) {
    if (!row || !row.id) continue;
    const p = pillarOf(row.id);
    if (!p || isMvPillar(p) || !VALID_PILLARS.has(p)) continue;
    counts[p] = (counts[p] || 0) + 1;
  }
  const order = Object.keys(counts).sort((a, b) => counts[a] - counts[b] || a.localeCompare(b));
  return { counts, order, idx };
}

async function runReusePass(store, idx, pillar) {
  assertNotMv('pillar-image-orchestrator', { pillar });
  const idRe = new RegExp('^' + pillar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\d+$', 'i');
  const rows = filterOutMv((idx.entries || []).filter((e) => e && idRe.test(e.id)));
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  const touched = [];
  let applied = 0;
  let skipped = 0;

  for (const row of rows) {
    if (shouldSkipMv({ id: row.id })) { skipped++; continue; }
    let entry;
    try { entry = await store.get('answers/' + row.id + '.json', { type: 'json' }); } catch (e) { continue; }
    if (!entry || !(entry.answer || entry.body)) continue;
    const title = row.question || entry.question || row.id;
    const body = entry.answer || entry.body;
    log('REUSE ' + row.id);
    try {
      const r = await ensureFaceCardFromEntryImages(row.id, title, body, { store, entryMeta: entry });
      touched.push(row.id);
      if (r.applied) {
        applied++;
        const patch = Object.assign({}, entry, {
          answer: r.body,
          cover_src: r.coverSrc,
          face_title_baked: true,
          image_reuse_at: new Date().toISOString(),
          image_reuse_from: r.sourceUrl,
        });
        await store.setJSON('answers/' + row.id + '.json', patch);
        const i = (idx.entries || []).findIndex((e) => e && e.id === row.id);
        if (i >= 0) {
          idx.entries[i] = Object.assign({}, idx.entries[i], {
            img: '/assets/qa/' + row.id + '.jpg',
            cover_src: r.coverSrc,
            face_title_baked: true,
          });
        }
        log('  ✓ face-card from ' + r.kind + ' ' + r.sourceUrl);
      } else {
        log('  · ' + (r.reason || 'no-change'));
      }
    } catch (e) {
      log('  ✗ ' + e.message);
    }
    await sleep(80);
  }
  if (applied) await store.setJSON('_index.json', idx);
  return { pillar, total: rows.length, applied, skipped, touched };
}

function runSpecValidator() {
  try {
    execSync('node validate-golden.mjs --type qa GOLDEN_TEMPLATE_QA.md', { cwd: WD, stdio: 'pipe' });
    execSync('node validate-golden.mjs --type top10 GOLDEN_TEMPLATE_TOP10.md', { cwd: WD, stdio: 'pipe' });
    return { specOk: true };
  } catch (e) {
    return { specOk: false, error: String(e.message || e).slice(0, 200) };
  }
}

function runFullPillarFix(pillar) {
  if (process.env.PILLAR_IMAGE_SKIP_FIX === '1') {
    log('SKIP full fix (PILLAR_IMAGE_SKIP_FIX=1)');
    return { skipped: true, exitCode: 0 };
  }
  log('▶ FULL FIX node _pillar_image_fix_run.js --pillar=' + pillar);
  const r = spawnSync('node', ['_pillar_image_fix_run.js', '--pillar=' + pillar], {
    cwd: WD,
    stdio: 'inherit',
    env: process.env,
  });
  const exitCode = r.status || 0;
  if (exitCode !== 0) log('⚠ fix_run exit ' + exitCode + ' — continuing to reuse + validate');
  return { exitCode, ok: exitCode === 0 };
}

async function runPillar(pillar) {
  assertNotMv('runPillar', { pillar });
  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
  const { counts, order, idx } = await pillarCounts(store);
  log('▶ PILLAR ' + pillar + ' (' + (PILLAR_NAMES[pillar] || pillar) + ') · entries=' + (counts[pillar] || 0));

  const fixRun = runFullPillarFix(pillar);
  const refreshed = await pillarCounts(store);
  const reuse = await runReusePass(store, refreshed.idx, pillar);
  const golden = await validatePillar(pillar);
  const spec = runSpecValidator();

  const report = {
    at: new Date().toISOString(),
    pillar,
    label: PILLAR_NAMES[pillar] || pillar,
    hub: hubFor(pillar),
    entryCount: counts[pillar] || 0,
    fixRun,
    reuse,
    golden: {
      total: golden.total,
      pass: golden.pass,
      fail: golden.fail,
      sampleFails: (golden.fails || []).slice(0, 15),
    },
    specValidator: spec,
    pillarOrder: filterValidPillarOrder(order, counts),
    stopForReview: true,
    deployPolicy: 'NO deploy until pillar complete + owner approval — then one Netlify --prod',
    note: 'Face-card reuse + q11133 gold + topic query key. mv excluded.',
  };

  const reportF = WD + '/_pillar_image_report_' + pillar + '.json';
  fs.writeFileSync(reportF, JSON.stringify(report, null, 2));
  fs.writeFileSync(STOP_F, JSON.stringify({ pillar, at: report.at, reportF, awaitingDeploy: true }, null, 2));
  try { fs.unlinkSync(APPROVE_F); } catch (e) {}

  log('◀ REPORT ' + reportF);
  log('   golden pass=' + golden.pass + '/' + golden.total + ' · reuse applied=' + reuse.applied);
  log('   STOP — review required. Then: PILLAR_IMAGE_APPROVE=1 node _pillar_image_orchestrator.js --deploy-approved --pillar=' + pillar);

  return report;
}

function pickNextPillar(state, order) {
  const done = new Set(state.completed || []);
  const valid = filterValidPillarOrder(order, {});
  for (const p of valid) {
    if (!done.has(p) && !isMvPillar(p)) return p;
  }
  return null;
}

function readStopPillar() {
  try {
    const stop = JSON.parse(fs.readFileSync(STOP_F, 'utf8'));
    return stop.pillar || '';
  } catch (e) {
    return '';
  }
}

async function deployApprovedPillar(pillar) {
  assertNotMv('deploy', { pillar });
  if (!isApproved()) {
    log('Deploy blocked — set PILLAR_IMAGE_APPROVE=1 or create ' + path.basename(APPROVE_F));
    return { deployed: false, reason: 'not-approved' };
  }
  log('▶ DEPLOY (end of pillar ' + pillar + ') — Netlify prod after owner approval');
  const result = deployPillarProd(pillar);
  if (result.deployed) {
    const state = readState();
    state.deployed = state.deployed || [];
    if (!state.deployed.includes(pillar)) state.deployed.push(pillar);
    state.lastDeploy = result;
    writeState(state);
    try { fs.unlinkSync(STOP_F); } catch (e) {}
    try { fs.unlinkSync(APPROVE_F); } catch (e) {}
    log('✓ prod live — pillar ' + pillar);
  } else {
    log('✗ deploy failed or skipped: ' + (result.error || result.reason || 'unknown'));
  }
  return result;
}

async function main() {
  if (fs.existsSync(STOP_RUN_F) && process.env.PILLAR_IMAGE_FORCE !== '1') {
    console.log('⏸ PAUSED — remove _pillar_image_orchestrator_stop.flag or PILLAR_IMAGE_FORCE=1');
    process.exit(0);
  }

  const args = process.argv.slice(2);
  const pilot = args.includes('--pilot');
  const cont = args.includes('--continue');
  const deployApproved = args.includes('--deploy-approved');
  const onePillar = (args.find((a) => a.startsWith('--pillar=')) || '').split('=')[1]
    || (args.includes('--pillar') ? args[args.indexOf('--pillar') + 1] : '')
    || process.env.PILLAR || '';

  if (deployApproved) {
    const pillar = (onePillar || readStopPillar() || '').toLowerCase();
    if (!pillar) {
      console.error('Usage: PILLAR_IMAGE_APPROVE=1 node _pillar_image_orchestrator.js --deploy-approved --pillar=hf');
      process.exit(1);
    }
    const r = await deployApprovedPillar(pillar);
    process.exit(r.deployed ? 0 : 1);
  }

  if (isMvPillar(onePillar)) {
    console.error('HARD EXCLUSION: mv pillar cannot be processed by this orchestrator.');
    process.exit(2);
  }

  const store = getStore({
    name: 'pulse-machine-library',
    siteID: SITE,
    token: process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN,
  });
  const { order, counts } = await pillarCounts(store);
  let state = readState();
  const validOrder = filterValidPillarOrder(order, counts);
  if (!state.order || !state.order.length) state.order = validOrder;

  if (cont) {
    const approvedPillar = readStopPillar();
    if (approvedPillar && isApproved() && process.env.PILLAR_IMAGE_DEPLOY === '1') {
      await deployApprovedPillar(approvedPillar);
    } else if (approvedPillar && isApproved() && process.env.PILLAR_IMAGE_DEPLOY !== '1') {
      log('Deploy skipped (set PILLAR_IMAGE_DEPLOY=1 when ready) — clearing review stop for ' + approvedPillar);
      try { fs.unlinkSync(STOP_F); } catch (e) {}
      try { fs.unlinkSync(APPROVE_F); } catch (e) {}
    } else if (fs.existsSync(STOP_F) && !isApproved()) {
      console.error('Blocked: approve pillar ' + (approvedPillar || '?') + ' first (PILLAR_IMAGE_APPROVE=1 or ' + path.basename(APPROVE_F) + ')');
      process.exit(3);
    }
  }

  let pillar = onePillar.toLowerCase();
  if (!pillar && pilot) {
    pillar = process.env.PILOT_PILLAR || validOrder[0] || '';
  }
  if (!pillar && cont) {
    pillar = pickNextPillar(state, state.order) || '';
  }
  if (!pillar) {
    console.error('Usage: --pilot | --pillar=xx | --deploy-approved | --continue (after approval)');
    process.exit(1);
  }

  assertNotMv('main', { pillar });
  const report = await runPillar(pillar);
  state.completed = state.completed || [];
  if (!state.completed.includes(pillar)) state.completed.push(pillar);
  if (pilot) state.pilotDone = true;
  state.lastPillar = pillar;
  state.lastReport = '_pillar_image_report_' + pillar + '.json';
  writeState(state);

  const exitCode = report.golden.fail > 0 ? 1 : 0;
  process.exit(exitCode);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
