// Aquariums-only 13/13 scrub via Unicorn server. Force-stops side jobs, locks pillar aq, runs until queue empty.
const fs = require('fs');
const path = require('path');

const KEY = '4444';
const BASE = 'http://localhost:8899';
const PILLAR = 'aq';
const PROGRESS_F = path.join(__dirname, '_aq_13_progress.json');
const LOG_F = path.join(__dirname, '_aq_13_run.log');

const STOP_PATHS = [
  '/force-stop-all',
  '/image-duplicator-force-stop',
  '/image-generator-force-stop',
  '/face-hero-force-stop',
  '/image-rewrite-force-stop',
  '/internal-images-force-stop',
  '/format-fixer-force-stop',
  '/rubric-station-force-stop',
  '/scrub-force-stop',
  '/gen-force-stop',
];

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_F, line + '\n'); } catch (e) {}
}

async function post(route, body = {}) {
  const r = await fetch(BASE + route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, ...body }),
  });
  return r.json().catch(() => ({}));
}

async function get(route) {
  const r = await fetch(BASE + route);
  return r.json().catch(() => ({}));
}

async function writeProgress(extra) {
  extra = extra || {};
  try {
    const [progress, status] = await Promise.all([
      get('/pillar-progress-data'),
      get('/scrub-status'),
    ]);
    const aq = (progress.pillars || []).find(p => p.p === PILLAR) || {};
    const payload = {
      at: new Date().toISOString(),
      pillar: PILLAR,
      pillarName: aq.name || 'Aquariums',
      running: !!(status.running || status.scrubBusy),
      stage: status.stage || status.scrubLive?.stage || null,
      currentId: status.current || status.activeId || status.scrubLive?.id || null,
      currentTitle: status.scrubLive?.title || null,
      certifiedThisRun: status.certified || 0,
      at13: aq.at13 || 0,
      total: aq.total || 0,
      inQueue: aq.inQueue != null ? aq.inQueue : (status.queueByPillar || {})[PILLAR],
      pct13: aq.pct13 || 0,
      extra,
    };
    fs.writeFileSync(PROGRESS_F, JSON.stringify(payload, null, 2));
  } catch (e) {}
}

async function forceStopAll() {
  log('Force-stopping all stations…');
  const r = await post('/force-stop-all');
  log('force-stop-all: ' + JSON.stringify(r.forceStopped || r.ok || r));
  for (const p of STOP_PATHS.slice(1)) {
    try {
      const j = await post(p);
      log(' ' + p + ' ' + JSON.stringify(j.forceStopped || j.ok || j.stopped || j));
    } catch (e) {
      log(' ' + p + ' ERR ' + e.message);
    }
  }
  await new Promise(r => setTimeout(r, 2000));
}

async function waitForDone() {
  log('Waiting for Aquariums 13/13 scrub to finish…');
  let lastStage = '';
  while (true) {
    const [progress, status] = await Promise.all([
      get('/pillar-progress-data'),
      get('/scrub-status'),
    ]);
    const aq = (progress.pillars || []).find(p => p.p === PILLAR) || {};
    const pf = status.scrubPillarFilter;
    const fq = status.queueFilteredLen != null ? status.queueFilteredLen : (aq.inQueue || 0);
    const running = !!(status.running || status.scrubBusy);
    const stage = status.stage || status.scrubLive?.stage || '';
    if (stage !== lastStage) {
      log((stage || (running ? 'running…' : 'idle')) + ' | at13 ' + (aq.at13 || 0) + '/' + (aq.total || 0) + ' | queue ' + fq);
      lastStage = stage;
    }
    await writeProgress({ phase: 'waiting', queueFiltered: fq, stage });
    if (!running && pf === PILLAR && fq === 0) {
      log('Done — aq filtered queue empty');
      return;
    }
    await new Promise(r => setTimeout(r, 10000));
  }
}

(async () => {
  try {
    await fetch(BASE + '/health', { signal: AbortSignal.timeout(8000) });
  } catch (e) {
    console.error('Scrub server not reachable at', BASE);
    process.exit(1);
  }

  await writeProgress({ phase: 'starting' });
  await forceStopAll();

  const r = await post('/pillar-fix-start', { pillar: PILLAR });
  log('pillar-fix-start aq: ' + JSON.stringify(r));
  if (!r.ok) {
    console.error('Failed to start aq scrub:', r.msg || r);
    process.exit(1);
  }

  await writeProgress({ phase: 'running' });
  await waitForDone();
  await writeProgress({ phase: 'complete' });
  log('Aquariums 13/13 run complete.');
})().catch(e => {
  log('FATAL ' + e.message);
  process.exit(1);
});
