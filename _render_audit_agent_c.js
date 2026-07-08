// Agent C — Cursor gold-template blob auditor (rules-based, no DeepSeek).
// Audits answer BLOBS against locked gold templates + visual-lock law before batch writes.
//
// START (detached):  Start-Process node -ArgumentList '_render_audit_agent_c.js' -WorkingDirectory C:\Users\koryj\website -WindowStyle Hidden
// STOP:             New-Item -ItemType File -Path _render_audit_agent_c_stop.flag -Force
// ONE-SHOT:          node _render_audit_agent_c.js --once
//
// Polls sample blobs every RENDER_AUDIT_INTERVAL_MS (default 3 min).
// Writes lane agentC to _render_audit_status.json; sets templateBlocked + speedupBlocked via shared lib.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
const {
  WD,
  SAMPLE_ENTRIES,
  sleep,
  log,
  logCrossover,
  updateAgentLane,
  cursorBlobGoldAudit,
} = require('./_render_audit_lib');

const STOP = WD + '/_render_audit_agent_c_stop.flag';
const INTERVAL = parseInt(process.env.RENDER_AUDIT_INTERVAL_MS || String(3 * 60 * 1000), 10);
const ONCE = process.argv.includes('--once');

try {
  for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});

async function auditOneEntry(entry) {
  const result = { id: entry.id, url: entry.url, template: entry.template, pass: true, issues: [], metrics: {} };
  try {
    const blob = await store.get('answers/' + entry.id + '.json', { type: 'json' });
    if (!blob || !blob.answer) {
      result.pass = false;
      result.issues.push(entry.id + ': missing answer blob');
      return result;
    }
    const title = blob.question || blob.h1 || entry.id;
    const audit = cursorBlobGoldAudit(entry.id, blob.answer, title);
    result.metrics = audit.metrics;
    result.metrics.classifiedTemplate = audit.route.template;
    result.metrics.goldUrl = audit.route.goldUrl;
    result.issues.push(...audit.issues);
    result.cursorNotes = 'classified=' + audit.route.template + ' gold=' + audit.route.goldId + ' grade=' + audit.metrics.grade + '/13';
    result.issues = [...new Set(result.issues)];
    if (result.issues.length) result.pass = false;
  } catch (e) {
    result.pass = false;
    result.issues.push(entry.id + ': blob audit error ' + e.message);
  }
  return result;
}

async function runPass() {
  log('pass start · blobs=' + SAMPLE_ENTRIES.map((e) => e.id).join(',') + ' · mode=cursor-rules', 'agentC');
  const entries = [];
  const allIssues = [];

  for (const entry of SAMPLE_ENTRIES) {
    if (fs.existsSync(STOP)) break;
    const r = await auditOneEntry(entry);
    entries.push(r);
    allIssues.push(...r.issues);
    log((r.pass ? 'PASS' : 'FAIL') + ' ' + entry.id + ' · tpl=' + (r.metrics.classifiedTemplate || '?') + ' grade=' + (r.metrics.grade || '?'), 'agentC');
    await sleep(400);
  }

  const pass = entries.length > 0 && entries.every((e) => e.pass);
  const st = updateAgentLane('agentC', {
    pass,
    issues: allIssues,
    lastRun: new Date().toISOString(),
    entries,
    mode: 'cursor-rules',
  });

  if (!pass) {
    logCrossover('🔴 **Cursor Agent C FAIL (blob gold)** — ' + allIssues.slice(0, 4).join('; ') + ' · templateBlocked=' + st.templateBlocked);
  } else {
    log('pass OK · all blob gold samples clear', 'agentC');
  }
  return st;
}

(async () => {
  try { fs.unlinkSync(STOP); } catch (e) {}
  log('Agent C up — Cursor gold-template blob auditor · interval=' + (INTERVAL / 1000) + 's', 'agentC');

  do {
    if (fs.existsSync(STOP)) {
      log('stop flag — exiting', 'agentC');
      break;
    }
    try {
      await runPass();
    } catch (e) {
      log('pass error: ' + e.message, 'agentC');
    }
    if (ONCE) break;
    await sleep(INTERVAL);
  } while (!ONCE);
})().catch((e) => {
  log('FATAL ' + e.message, 'agentC');
  process.exit(1);
});
