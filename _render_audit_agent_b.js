// Agent B — Image rendering auditor (broken/black images, pollinations, self-hosted paths).
//
// START (detached):  Start-Process node -ArgumentList '_render_audit_agent_b.js' -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
// STOP:             New-Item -ItemType File -Path _render_audit_agent_b_stop.flag -Force
// ONE-SHOT:          node _render_audit_agent_b.js --once
//
// Polls live pages every RENDER_AUDIT_INTERVAL_MS (default 3 min).
// Writes lane agentB to _render_audit_status.json.
// DeepSeek evaluates image quality when DEEPSEEK_API_KEY is set; heuristics + fetch checks always run.
const fs = require('fs');
const {
  WD,
  SAMPLE_ENTRIES,
  sleep,
  log,
  logCrossover,
  hasDeepSeekKey,
  updateAgentLane,
  fetchLiveHtml,
  heuristicImageAudit,
  dsEvaluateImages,
} = require('./_render_audit_lib');

const STOP = WD + '/_render_audit_agent_b_stop.flag';
const INTERVAL = parseInt(process.env.RENDER_AUDIT_INTERVAL_MS || String(3 * 60 * 1000), 10);
const ONCE = process.argv.includes('--once');

async function auditOneEntry(entry) {
  const result = { id: entry.id, url: entry.url, template: entry.template, pass: true, issues: [], metrics: {} };
  try {
    const page = await fetchLiveHtml(entry.url);
    if (!page.ok) {
      result.pass = false;
      result.issues.push(entry.id + ': page fetch failed HTTP ' + page.status);
      return result;
    }
    const heur = await heuristicImageAudit(page.html, entry);
    result.metrics = heur.metrics;
    result.issues.push(...heur.issues);

    const ds = await dsEvaluateImages(entry, heur, heur.metrics.details);
    if (ds) {
      result.dsPass = !!ds.pass;
      result.dsNotes = ds.notes || '';
      if (ds.issues && ds.issues.length) result.issues.push(...ds.issues.map((i) => entry.id + ': ds:' + i));
      if (ds.pass === false) result.pass = false;
    }

    result.issues = [...new Set(result.issues)];
    if (result.issues.length) result.pass = false;
  } catch (e) {
    result.pass = false;
    result.issues.push(entry.id + ': audit error ' + e.message);
  }
  return result;
}

async function runPass() {
  log('pass start · samples=' + SAMPLE_ENTRIES.map((e) => e.id).join(',') + ' · ds=' + (hasDeepSeekKey() ? 'on' : 'heuristic-only'), 'agentB');
  const entries = [];
  const allIssues = [];

  for (const entry of SAMPLE_ENTRIES) {
    if (fs.existsSync(STOP)) break;
    const r = await auditOneEntry(entry);
    entries.push(r);
    allIssues.push(...r.issues);
    log((r.pass ? 'PASS' : 'FAIL') + ' ' + entry.id + ' · imgs=' + (r.metrics.imgCount || 0) + ' broken=' + (r.metrics.broken || 0), 'agentB');
    await sleep(1200);
  }

  const pass = entries.length > 0 && entries.every((e) => e.pass);
  const st = updateAgentLane('agentB', {
    pass,
    issues: allIssues,
    lastRun: new Date().toISOString(),
    entries,
    mode: hasDeepSeekKey() ? 'deepseek+heuristic' : 'heuristic-only',
  });

  if (!pass) {
    logCrossover('🔴 **Render Agent B FAIL** — ' + allIssues.slice(0, 4).join('; ') + ' · speedupBlocked=' + st.speedupBlocked);
  } else {
    log('pass OK · all image samples clear', 'agentB');
  }
  return st;
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  log('Agent B up — image rendering auditor · interval=' + (INTERVAL / 1000) + 's', 'agentB');
  if (!hasDeepSeekKey()) {
    log('DEEPSEEK_API_KEY not set — running heuristic-only until configured in .env.local', 'agentB');
  }

  do {
    if (fs.existsSync(STOP)) {
      log('stop flag — exiting', 'agentB');
      break;
    }
    try {
      await runPass();
    } catch (e) {
      log('pass error: ' + e.message, 'agentB');
    }
    if (ONCE) break;
    await sleep(INTERVAL);
  } while (!ONCE);
})().catch((e) => {
  log('FATAL ' + e.message, 'agentB');
  process.exit(1);
});
