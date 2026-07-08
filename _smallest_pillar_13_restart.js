// Start over on the smallest Q&A pillar → full 13/13 scrub + image verify.
// Spawns 3-min progress email; sends completion email when pillar queue hits 0.
// Usage: node _smallest_pillar_13_restart.js [--pillar=fs]
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const WD = 'C:/Users/koryj/website';
const BASE = 'http://127.0.0.1:8899';
const KEY = '4444';
const RECIPIENT = 'koryjordanwhite@gmail.com';
const KEY_CACHE = WD + '/_ask_owner_key.cache';
const SITE = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const QUEUE = WD + '/_scrub_button_queue.json';
const AP = WD + '/_v2_approved.json';
const PROGRESS_F = WD + '/_pillar_13_progress.json';
const EMAIL_STOP = WD + '/_pillar_13_progress_email_stop.flag';
const LOG_F = WD + '/_smallest_pillar_13_restart.log';

const NAMES = {
  tl: 'Pulse Tools / CRO', ca: 'Cars', bt: 'Boats', aq: 'Aquariums', ik: 'Industry KPIs', tk: 'Tech Stacks',
  bs: 'Book Summaries', st: 'Sales Trainings', fr: 'Franchises', co: 'Collectibles', ai: 'AI Infrastructure',
  gb: 'Graphics', bo: 'Buildouts', sy: 'Style', cr: 'Crabbing', fs: 'Fishing', gp: 'GTM Playbooks',
  ra: 'Revenue Architecture', pt: 'Pets', es: 'Espresso', tv: 'TVs', rs: 'Resorts', cl: 'Cologne',
  lv: 'Luxury Vacations', ev: 'Events', ga: 'Gatherings', gm: 'Gaming', mv: 'Movies', wl: 'Wellness',
  dr: 'Drills', dn: 'Dining', nl: 'Nightlife', tn: 'Towns', sc: 'Schools', tc: 'Telco', er: 'Electronics',
  ce: 'Current Events', q: 'Q&A', sw: 'Software', hf: 'Home & Family',
};
const HUB_SEG = {
  pt: 'pets', ce: 'knowledge', cr: 'crabbing', fs: 'fishing', sw: 'software', aq: 'aquariums',
  bt: 'boats', ca: 'cars', dn: 'dining', mv: 'movies', nl: 'nightlife', tn: 'towns', ga: 'gatherings',
  gm: 'gaming', wl: 'wellness', dr: 'drills', ev: 'events', rs: 'resorts', st: 'sales-trainings',
};

for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const { getStore } = require('@netlify/blobs');
const store = getStore({ name: 'pulse-machine-library', siteID: SITE, token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN });
const { gradeEntry } = require('./netlify/functions/lib/grade-entry');
const { auditImages } = require('./netlify/functions/lib/ensure-entry-images');

const args = process.argv.slice(2);
const FORCE_PILLAR = (args.find(a => a.startsWith('--pillar=')) || '').split('=')[1] || '';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

function pName(p) { return NAMES[p] || String(p || '').toUpperCase(); }
function hubUrl(p) { const h = HUB_SEG[p] || 'knowledge'; return 'https://pulserevops.com/' + h; }
function entryUrl(p, id) { const h = HUB_SEG[p] || 'knowledge'; return 'https://pulserevops.com/' + h + '/' + id; }

async function post(path, body = {}) {
  const r = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, ...body }),
  });
  return r.json().catch(() => ({}));
}

async function get(path) {
  const r = await fetch(BASE + path, { signal: AbortSignal.timeout(20000) });
  return r.json().catch(() => ({}));
}

async function scrubUp() {
  try {
    const j = await get('/scrub-status');
    if (j && (j.queueLen != null || j.running != null)) { log('Scrub server already up'); return true; }
  } catch (e) {}
  log('Starting scrub server on :8899…');
  const out = fs.openSync(WD + '/_scrub_button_server.out.log', 'a');
  const err = fs.openSync(WD + '/_scrub_button_server.err.log', 'a');
  const child = spawn('node', ['_scrub_button_server.js'], {
    cwd: WD, detached: true, stdio: ['ignore', out, err], windowsHide: true,
  });
  child.unref();
  for (let i = 0; i < 30; i++) {
    await sleep(2000);
    try {
      const j = await get('/scrub-status');
      if (j && j.queueLen != null) { log('Scrub server ready'); return true; }
    } catch (e) {}
  }
  throw new Error('scrub server did not start on :8899');
}

function spawnEmailLoop() {
  try { fs.unlinkSync(EMAIL_STOP); } catch (e) {}
  const out = fs.openSync(WD + '/_pillar_13_progress_email.out.log', 'a');
  const err = fs.openSync(WD + '/_pillar_13_progress_email.err.log', 'a');
  const child = spawn('node', ['_pillar_13_progress_email.js'], {
    cwd: WD, detached: true, stdio: ['ignore', out, err], windowsHide: true,
    env: Object.assign({}, process.env, { PILLAR_13_EMAIL_MS: String(3 * 60 * 1000) }),
  });
  child.unref();
  log('3-min progress email loop started (pid ' + child.pid + ')');
}

async function findSmallestPillar() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const groups = {};
  for (const e of (idx.entries || [])) {
    if (!e || !e.id || /^vq_/i.test(e.id)) continue;
    const m = String(e.id).match(/^([a-z]{2,3})\d+$/i);
    if (!m) continue;
    const p = m[1].toLowerCase();
    if (p === 'vq') continue;
    (groups[p] = groups[p] || []).push(e.id);
  }
  const sorted = Object.entries(groups).sort((a, b) => a[1].length - b[1].length);
  if (!sorted.length) throw new Error('no pillars in index');
  if (FORCE_PILLAR) {
    const ids = groups[FORCE_PILLAR];
    if (!ids || !ids.length) throw new Error('pillar not found: ' + FORCE_PILLAR);
    return { pillar: FORCE_PILLAR, ids, total: ids.length, order: sorted.map(([p, a]) => p + ':' + a.length) };
  }
  const [pillar, ids] = sorted[0];
  return { pillar, ids, total: ids.length, order: sorted.slice(0, 8).map(([p, a]) => p + ':' + a.length) };
}

async function requeuePillar(pillar, ids) {
  log('Requeue ' + ids.length + ' entries for ' + pillar + ' (start over)');
  let ap = [];
  try { ap = JSON.parse(fs.readFileSync(AP, 'utf8')); } catch (e) {}
  const idSet = new Set(ids);
  ap = ap.filter(id => !idSet.has(id));
  fs.writeFileSync(AP, JSON.stringify(ap));
  let q = [];
  try { q = JSON.parse(fs.readFileSync(QUEUE, 'utf8')); } catch (e) {}
  const rest = q.filter(id => !idSet.has(id));
  const merged = [...ids, ...rest];
  fs.writeFileSync(QUEUE, JSON.stringify(merged));
  log('Queue: ' + ids.length + ' ' + pillar + ' ids prepended · approved cleared for pillar');
}

async function auditPillarImages(pillar, ids) {
  let at13 = 0;
  let imgOk = 0;
  let imgFail = 0;
  const fails = [];
  for (const id of ids) {
    const e = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (!e || !e.answer) continue;
    const g = gradeEntry(id, e.answer);
    if (g.score >= 13) at13++;
    const audit = auditImages(id, e.answer);
    if (audit.compliant) imgOk++;
    else { imgFail++; if (fails.length < 8) fails.push({ id, reason: (audit.needs || []).join(', ') || 'images' }); }
  }
  return { at13, total: ids.length, imgOk, imgFail, fails };
}

async function resendKey() {
  const env = k => {
    try { const m = fs.readFileSync(WD + '/.env.local', 'utf8').match(new RegExp('^' + k + '=(.+)$', 'm')); return m ? m[1].trim() : ''; } catch (e) { return ''; }
  };
  let k = env('resendapikey') || env('RESEND_API_KEY');
  if (k) return k;
  try { k = fs.readFileSync(KEY_CACHE, 'utf8').trim(); if (k) return k; } catch (e) {}
  const TOKEN = env('NETLIFY_AUTH_TOKEN');
  const s = await fetch('https://api.netlify.com/api/v1/sites/' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } }).then(r => r.json());
  const acct = s.account_slug || s.account_name;
  const r = await fetch('https://api.netlify.com/api/v1/accounts/' + acct + '/env/resendapikey?site_id=' + SITE, { headers: { Authorization: 'Bearer ' + TOKEN } });
  const j = await r.json();
  const val = (j.values || []).find(v => v.context === 'all' || v.context === 'production') || (j.values || [])[0];
  k = val && val.value;
  if (!k) throw new Error('no resend key');
  return k;
}

async function sendDoneEmail(pillar, audit, certified) {
  const name = pName(pillar);
  const hub = hubUrl(pillar);
  const failsHtml = audit.fails.length
    ? '<ul>' + audit.fails.map(f => '<li><a href="' + entryUrl(pillar, f.id) + '">' + f.id + '</a> — ' + String(f.reason).slice(0, 80) + '</li>').join('') + '</ul>'
    : '<p>All entries passed image audit.</p>';
  const subject = '✅ DONE · ' + name + ' · ' + audit.at13 + '/' + audit.total + ' at 13/13 · images ' + audit.imgOk + '/' + audit.total;
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.6;color:#15110d">
    <p style="font-size:20px;font-weight:800;margin:0 0 10px">✅ ${name} pillar complete</p>
    <p>Fresh start scrub finished for the <b>smallest Q&amp;A pillar</b> (<code>${pillar}</code>).</p>
    <table style="border-collapse:collapse;font-size:14px;margin:12px 0">
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">13/13 certified</td><td><b>${audit.at13} / ${audit.total}</b></td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Images OK</td><td><b>${audit.imgOk} / ${audit.total}</b>${audit.imgFail ? ' · <span style="color:#c0392b">' + audit.imgFail + ' need attention</span>' : ''}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a7a63">Certified this run</td><td>${certified}</td></tr>
    </table>
    <p style="font-weight:700">Image flags (if any)</p>
    ${failsHtml}
    <p style="margin-top:14px"><a href="${hub}">${name} hub</a> · <a href="http://localhost:8899/pillar-progress">Pillar map</a></p>
    <p style="color:#8a7a63;font-size:12px;margin-top:12px">${new Date().toLocaleString()}</p>
  </div>`;
  const key = await resendKey();
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'PULSE Engine <onboarding@resend.dev>', to: [RECIPIENT], subject, html }),
  });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text()).slice(0, 120));
  log('DONE email sent to ' + RECIPIENT);
}

async function waitForPillarDone(pillar, total) {
  log('Waiting for ' + pillar + ' queue to drain…');
  let lastStage = '';
  while (true) {
    const d = await get('/scrub-status');
    const pf = d.scrubPillarFilter;
    const fq = d.queueFilteredLen != null ? d.queueFilteredLen : (d.queueLen || 0);
    const running = !!(d.running || d.scrubBusy);
    const stage = d.auto?.stage || d.stage || '';
    if (stage !== lastStage) {
      log('  ' + (stage || (running ? 'running' : 'idle')) + ' · queue ' + fq);
      lastStage = stage;
    }
    fs.writeFileSync(PROGRESS_F, JSON.stringify({
      at: new Date().toISOString(),
      activePillar: pillar,
      activePillarName: pName(pillar),
      currentId: d.current || d.activeId || null,
      stage,
      running,
      total,
      pillarTotal: total,
      certifiedThisRun: d.certified || 0,
      phase: 'scrubbing',
    }, null, 2));
    if (!running && pf === pillar && fq === 0) return d.certified || 0;
    await sleep(8000);
  }
}

(async () => {
  const { pillar, ids, total, order } = await findSmallestPillar();
  log('Smallest pillar: ' + pillar + ' (' + pName(pillar) + ') · ' + total + ' entries');
  log('Order: ' + order.join(' '));

  await scrubUp();
  await requeuePillar(pillar, ids);

  const stops = [
    '/force-stop-all', '/image-duplicator-force-stop', '/image-generator-force-stop',
    '/face-hero-force-stop', '/image-rewrite-force-stop', '/internal-images-force-stop',
    '/format-fixer-force-stop', '/gen-force-stop',
  ];
  for (const p of stops) { try { await post(p); } catch (e) {} }
  await sleep(1500);

  spawnEmailLoop();

  const start = await post('/pillar-fix-start', { pillar });
  log('pillar-fix-start: ' + JSON.stringify(start));
  if (!start.ok) throw new Error(start.msg || 'pillar-fix-start failed');

  const certified = await waitForPillarDone(pillar, total);
  const audit = await auditPillarImages(pillar, ids);

  try { fs.writeFileSync(EMAIL_STOP, '1'); } catch (e) {}
  await sendDoneEmail(pillar, audit, certified);
  log('Complete · ' + pillar + ' · 13/13=' + audit.at13 + '/' + total + ' · images=' + audit.imgOk + '/' + total);
})().catch(e => {
  log('FATAL ' + e.message);
  try { fs.writeFileSync(EMAIL_STOP, '1'); } catch (z) {}
  process.exit(1);
});
