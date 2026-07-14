#!/usr/bin/env node
'use strict';

// Purge stale face cards whose old titles are baked into pixels, then force clean regeneration.
// Usage:
//   node _purge_stale_baked_titles.js ed0338 q16160 --law-dom-url=http://127.0.0.1:8904/square
//   node _purge_stale_baked_titles.js --ids=ed0338,q16160 --no-regen

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const WD = process.env.PULSE_ROOT || __dirname;
const ENV_FILE = path.join(WD, '.env.local');
if (fs.existsSync(ENV_FILE)) {
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const { getStore } = require('@netlify/blobs');
const {
  coverPath,
  pHash,
  purgeFaceCardRegistry,
  markFaceCardForceRegen,
  faceCardForceRegenPending,
  verifyGradeStamp,
} = require('./_ddg_facecard_lib');
const { requeueSquareBuild } = require('./_square_builder_queue');

const LOCK_FILE = path.join(WD, '_stale_baked_title_purge.lock');
const FLUX_LOCK_FILE = path.join(WD, '_all_flux_facecards.lock');
const REPORT_FILE = path.join(WD, '_stale_baked_title_purge_report.json');

function processAlive(pid) {
  try { process.kill(Number(pid), 0); return true; } catch (e) { return false; }
}

function rejectLiveFluxWriter() {
  if (!fs.existsSync(FLUX_LOCK_FILE)) return;
  try {
    const lock = JSON.parse(fs.readFileSync(FLUX_LOCK_FILE, 'utf8'));
    if (lock.pid && processAlive(lock.pid)) throw new Error('face-card writer is running (pid ' + lock.pid + '); stop it before purge');
  } catch (error) {
    if (/face-card writer is running/.test(error.message)) throw error;
  }
  fs.rmSync(FLUX_LOCK_FILE, { force: true });
}

function acquireLock() {
  rejectLiveFluxWriter();
  let fd;
  try {
    fd = fs.openSync(LOCK_FILE, 'wx');
    fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, at: new Date().toISOString() }));
  } catch (error) {
    throw new Error('stale-title purge already running: ' + LOCK_FILE);
  }
  return () => {
    try { fs.closeSync(fd); } catch (e) {}
    try { fs.rmSync(LOCK_FILE, { force: true }); } catch (e) {}
  };
}

function parseArgs(argv) {
  const csv = argv.find(arg => arg.startsWith('--ids='));
  const ids = [
    ...(csv ? csv.slice(6).split(',') : []),
    ...argv.filter(arg => !arg.startsWith('-')),
  ].map(id => id.trim()).filter(id => /^[a-z]+\d+$/i.test(id));
  return {
    ids: [...new Set(ids)],
    allBaked: argv.includes('--all-baked'),
    regen: !argv.includes('--no-regen'),
    lawDomUrl: ((argv.find(arg => arg.startsWith('--law-dom-url=')) || '').split('=').slice(1).join('=') || process.env.LAW_DOM_URL || '').trim(),
  };
}

function atomicJson(file, value) {
  const tmp = file + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  try { fs.renameSync(tmp, file); }
  catch (error) {
    fs.rmSync(file, { force: true });
    fs.renameSync(tmp, file);
  }
}

function deleteResumeLockfiles(ids) {
  const deleted = [];
  const escaped = ids.map(id => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!escaped.length) return deleted;
  const idPattern = new RegExp('(^|[^a-z0-9_])(?:' + escaped.join('|') + ')(?=$|[^a-z0-9_])', 'i');
  for (const name of fs.readdirSync(WD)) {
    if (!/^_.*(?:resume|lock)/i.test(name)) continue;
    if (name === path.basename(LOCK_FILE)) continue;
    const file = path.join(WD, name);
    let stat;
    try { stat = fs.statSync(file); } catch (e) { continue; }
    if (!stat.isFile() || stat.size > 5 * 1024 * 1024) continue;
    let content = '';
    try { content = fs.readFileSync(file, 'utf8'); } catch (e) { continue; }
    if (!idPattern.test(content)) continue;
    fs.rmSync(file, { force: true });
    deleted.push(name);
  }
  return deleted;
}

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  return candidates.find(candidate => fs.existsSync(candidate)) || '';
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

function verifyRenderedDom(id, expectedTitle, baseUrl) {
  if (!baseUrl) return { pass: false, reason: 'LAW_DOM_URL not supplied' };
  const chrome = chromePath();
  if (!chrome) return { pass: false, reason: 'Chrome/Edge executable not found' };
  const url = new URL(baseUrl);
  url.searchParams.set('qa', id);
  url.searchParams.set('lawDom', String(Date.now()));
  const run = spawnSync(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=12000',
    '--dump-dom', url.href,
  ], { cwd: WD, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 30000 });
  if (run.error || run.status !== 0) return { pass: false, reason: (run.error && run.error.message) || String(run.stderr || 'browser failed').slice(0, 240) };
  const dom = String(run.stdout || '');
  const idAt = Math.max(dom.indexOf('/knowledge/' + id), dom.indexOf('data-id="' + id + '"'), dom.indexOf('data-qa="' + id + '"'));
  if (idAt < 0) return { pass: false, reason: 'rendered DOM has no card for ' + id };
  const card = dom.slice(Math.max(0, idAt - 1500), idAt + 6000);
  const visibleText = decodeHtml(card.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' '));
  const titlePass = visibleText.includes(decodeHtml(expectedTitle));
  const imagePass = new RegExp('/assets/qa/' + id + '\\.jpg(?:\\?[^"\\s<]*)?', 'i').test(card);
  return { pass: titlePass && imagePass, titlePass, imagePass, url: url.href, expectedTitle };
}

async function resetBlobMetadata(store, id) {
  const index = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const row = (index.entries || []).find(entry => entry && entry.id === id);
  if (!row) throw new Error('index row not found: ' + id);
  const title = row.question || row.title || id;
  delete row.img;
  row.cover_src = 'stale-title-purged';
  row.face_title_baked = false;
  row.face_title_purged_at = new Date().toISOString();
  await store.setJSON('_index.json', index);
  const answer = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
  if (answer) {
    await store.setJSON('answers/' + id + '.json', Object.assign({}, answer, {
      cover_src: 'stale-title-purged',
      face_title_baked: false,
      face_title_purged_at: new Date().toISOString(),
    }));
  }
  return title;
}

async function purgeOne(store, id) {
  const file = coverPath(id);
  let stalePh = null, deleted = false;
  if (fs.existsSync(file)) {
    const stale = fs.readFileSync(file);
    stalePh = await pHash(stale);
    fs.rmSync(file, { force: true });
    deleted = true;
  }
  const registry = purgeFaceCardRegistry(id, stalePh);
  markFaceCardForceRegen(id, 'stale baked title pixels purged');
  const title = await resetBlobMetadata(store, id);
  requeueSquareBuild(id, title);
  return { id, title, deleted, stalePh, registry, stampBypass: faceCardForceRegenPending(id) };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.ids.length && !options.allBaked) throw new Error('provide IDs or --all-baked');
  const token = process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN;
  if (!token) throw new Error('BLOBS_PAT/NETLIFY_AUTH_TOKEN missing; run on the local Fixer machine with .env.local');
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token });
  if (options.allBaked) {
    const index = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    options.ids = [...new Set((index.entries || []).filter(entry => entry && entry.id && entry.face_title_baked === true).map(entry => String(entry.id)))];
    console.log('[stale-title-purge] identified ' + options.ids.length + ' face_title_baked entries');
  }
  if (!options.ids.length) {
    console.log('[stale-title-purge] no baked-title entries found');
    return;
  }
  const release = acquireLock();
  const report = { startedAt: new Date().toISOString(), ids: options.ids, purged: [], resumeLocksDeleted: [], regeneration: null, lawDom: [] };
  try {
    for (const id of options.ids) report.purged.push(await purgeOne(store, id));
    report.resumeLocksDeleted = deleteResumeLockfiles(options.ids);
    atomicJson(REPORT_FILE, report);
  } finally {
    release();
  }

  if (options.regen) {
    report.regeneration = [];
    for (let offset = 0; offset < options.ids.length; offset += 100) {
      const pod = options.ids.slice(offset, offset + 100);
      const run = spawnSync(process.execPath, [path.join(WD, '_all_flux_facecards.js')], {
        cwd: WD,
        env: Object.assign({}, process.env, {
          PURGE_REGEN_IDS: pod.join(','),
          FORCE_ALL: '1',
          LIMIT: String(pod.length),
        }),
        stdio: 'inherit',
        timeout: 6 * 60 * 60 * 1000,
      });
      report.regeneration.push({ pod: Math.floor(offset / 100) + 1, ids: pod, status: run.status, signal: run.signal || null, error: run.error ? run.error.message : '' });
      atomicJson(REPORT_FILE, report);
      if (run.error || run.status !== 0) {
        throw new Error('clean regeneration failed in pod ' + (Math.floor(offset / 100) + 1) + '; force-regeneration markers remain active');
      }
    }
    for (const item of report.purged) {
      const file = coverPath(item.id);
      item.regenerated = fs.existsSync(file);
      item.gradeStamp = item.regenerated && await verifyGradeStamp(file);
      if (options.lawDomUrl) report.lawDom.push(Object.assign({ id: item.id }, verifyRenderedDom(item.id, item.title, options.lawDomUrl)));
    }
  }
  report.finishedAt = new Date().toISOString();
  atomicJson(REPORT_FILE, report);
  console.log(JSON.stringify(report, null, 2));
  if (options.regen && options.lawDomUrl && report.lawDom.some(result => !result.pass)) {
    throw new Error('LAW-DOM verification failed; see ' + REPORT_FILE);
  }
}

main().catch(error => {
  console.error('[stale-title-purge]', error.message || error);
  process.exit(1);
});
