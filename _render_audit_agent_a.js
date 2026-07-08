// Agent A — Direct Answer + layout/CRO placement rendering auditor.
//
// START (detached):  Start-Process node -ArgumentList '_render_audit_agent_a.js' -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
// STOP:             New-Item -ItemType File -Path _render_audit_agent_a_stop.flag -Force
// ONE-SHOT:          node _render_audit_agent_a.js --once
//
// Polls live pages every RENDER_AUDIT_INTERVAL_MS (default 3 min).
// Writes lane agentA to _render_audit_status.json; sets deployBlocked/speedupBlocked via shared lib.
// DeepSeek evaluates render quality when DEEPSEEK_API_KEY is set; heuristics always run as fallback.
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
  heuristicLayoutAudit,
  dsEvaluateLayout,
} = require('./_render_audit_lib');

const STOP = WD + '/_render_audit_agent_a_stop.flag';
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
    const heur = heuristicLayoutAudit(page.html, entry);
    result.metrics = heur.metrics;
    result.issues.push(...heur.issues);

    const ds = await dsEvaluateLayout(page.html, entry, heur);
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
  log('pass start · samples=' + SAMPLE_ENTRIES.map((e) => e.id).join(',') + ' · ds=' + (hasDeepSeekKey() ? 'on' : 'heuristic-only'), 'agentA');
  const entries = [];
  const allIssues = [];

  for (const entry of SAMPLE_ENTRIES) {
    if (fs.existsSync(STOP)) break;
    const r = await auditOneEntry(entry);
    entries.push(r);
    allIssues.push(...r.issues);
    log((r.pass ? 'PASS' : 'FAIL') + ' ' + entry.id + ' · ' + (r.issues[0] || 'ok'), 'agentA');
    await sleep(800);
  }

  const pass = entries.length > 0 && entries.every((e) => e.pass);
  const st = updateAgentLane('agentA', {
    pass,
    issues: allIssues,
    lastRun: new Date().toISOString(),
    entries,
    mode: hasDeepSeekKey() ? 'deepseek+heuristic' : 'heuristic-only',
  });

  if (!pass) {
    logCrossover('🔴 **Render Agent A FAIL** — ' + allIssues.slice(0, 4).join('; ') + ' · deployBlocked=' + st.deployBlocked);
  } else {
    log('pass OK · all samples clear', 'agentA');
  }
  return st;
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  log('Agent A up — Direct Answer + layout auditor · interval=' + (INTERVAL / 1000) + 's', 'agentA');
  if (!hasDeepSeekKey()) {
    log('DEEPSEEK_API_KEY not set — running heuristic-only until configured in .env.local', 'agentA');
  }

  do {
    if (fs.existsSync(STOP)) {
      log('stop flag — exiting', 'agentA');
      break;
    }
    try {
      await runPass();
    } catch (e) {
      log('pass error: ' + e.message, 'agentA');
    }
    if (ONCE) break;
    await sleep(INTERVAL);
  } while (!ONCE);
})().catch((e) => {
  log('FATAL ' + e.message, 'agentA');
  process.exit(1);
});
