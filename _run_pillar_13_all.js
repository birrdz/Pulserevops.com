// Stop all side jobs, then fix each pillar smallest→largest to 13/13 via scrub server.
const KEY = '4444';
const BASE = 'http://localhost:8899';
const PROGRESS_F = require('path').join(__dirname, '_pillar_13_progress.json');
const fs = require('fs');

const STOP_PATHS = [
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

async function post(path, body = {}) {
  const r = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: KEY, ...body }),
  });
  return r.json().catch(() => ({}));
}

async function get(path) {
  const r = await fetch(BASE + path);
  return r.json().catch(() => ({}));
}

async function writeProgress(extra) {
  extra = extra || {};
  try {
    const [pillars, status] = await Promise.all([
      get('/pillars?key=' + KEY),
      get('/scrub-status'),
    ]);
    const pf = status.scrubPillarFilter;
    const payload = {
      at: new Date().toISOString(),
      activePillar: extra.pillar || pf,
      activePillarName: extra.pillarName || status.scrubPillarFilterName,
      currentId: status.current || status.activeId || null,
      stage: status.stage || null,
      running: !!(status.running || status.scrubBusy),
      pillars: (pillars || []).sort((a, b) => (a.n - b.n) || (a.q - b.q)),
      extra: extra || null,
    };
    fs.writeFileSync(PROGRESS_F, JSON.stringify(payload, null, 2));
  } catch (e) {}
}

async function forceStopAll() {
  console.log('⏹ Force-stopping all stations…');
  for (const p of STOP_PATHS) {
    try {
      const j = await post(p);
      console.log(' ', p, j.forceStopped || j.ok || j.stopped || j);
    } catch (e) {
      console.log(' ', p, 'ERR', e.message);
    }
  }
  await new Promise(r => setTimeout(r, 1500));
}

async function waitForPillarDone(pillar, name) {
  console.log(`\n🎯 Pillar ${pillar} (${name}) — waiting for 13/13 scrub to finish…`);
  let lastStage = '';
  while (true) {
    const d = await get('/scrub-status?key=' + KEY);
    const pf = d.scrubPillarFilter;
    const q = d.queueLen || 0;
    const fq = d.queueFilteredLen != null ? d.queueFilteredLen : q;
    const running = !!(d.running || d.scrubBusy || d.imageScrubRunning);
    const stage = d.auto && d.auto.stage ? d.auto.stage : (d.stage || '');
    if (stage !== lastStage) {
      console.log('  ', stage || (running ? 'running…' : 'idle'), '| queue', fq + '/' + q);
      lastStage = stage;
    }
    await writeProgress({ phase: 'waiting', pillar, pillarName: name, queueFiltered: fq, queueTotal: q, stage });
    if (!running && pf === pillar && fq === 0) {
      console.log(`✅ ${name} (${pillar}) — queue empty for this pillar`);
      return;
    }
    if (!running && pf === pillar && !d.auto?.running) {
      const q2 = await get('/scrub-status?key=' + KEY);
      const fq2 = q2.queueFilteredLen != null ? q2.queueFilteredLen : (q2.queueLen || 0);
      if (fq2 === 0) {
        console.log(`✅ ${name} (${pillar}) — scrub idle, filtered queue 0`);
        return;
      }
    }
    await new Promise(r => setTimeout(r, 8000));
  }
}

(async () => {
  const startPillar = process.argv[2] || null; // optional: start at this pillar code
  let pillars;
  try {
    pillars = await get('/pillars?key=' + KEY);
  } catch (e) {
    console.error('Cannot reach scrub server at', BASE, e.message);
    process.exit(1);
  }
  if (!Array.isArray(pillars) || !pillars.length) {
    console.error('No pillars from /pillars');
    process.exit(1);
  }
  // Smallest entry count first; tie-break by queue size then name
  pillars.sort((a, b) => (a.n - b.n) || (a.q - b.q) || a.name.localeCompare(b.name));
  console.log('Pillar order (smallest→largest):');
  pillars.forEach(p => console.log(`  ${p.p} ${p.name} — ${p.n} entries, ${p.q} in queue`));
  await writeProgress({ phase: 'starting', order: pillars.map(p => p.p) });

  await forceStopAll();

  let started = !startPillar;
  for (const p of pillars) {
    if (!started) {
      if (p.p === startPillar) started = true;
      else continue;
    }
    if ((p.q || 0) === 0 && (p.n || 0) > 0) {
      console.log(`⏭ ${p.name} (${p.p}) — 0 in queue, skipping (already certified?)`);
      continue;
    }
    const r = await post('/pillar-fix-start', { pillar: p.p });
    console.log('▶ Started', p.p, r);
    await writeProgress({ phase: 'pillar-start', pillar: p.p, pillarName: p.name });
    if (!r.ok) {
      console.error('Failed to start', p.p, r.msg || r);
      continue;
    }
    await waitForPillarDone(p.p, p.name);
    await forceStopAll();
  }
  console.log('\n🏁 All pillars processed.');
  await writeProgress({ phase: 'complete' });
})();
