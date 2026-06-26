// Shared agent / batch work status for 15-min status emails.
// Usage:
//   const { setAgentWork, clearAgentWork, readAgentWork, collectAgentSessions, buildAgentWorkHtml } = require('./_agent_work_status');
const fs = require('fs');
const path = require('path');

const ROOT = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
const AGENT_WORK_FILE = path.join(ROOT, '_pulse_agent_work.json');
const STALE_MS = 2 * 60 * 60 * 1000; // drop explicit sessions not updated in 2h

const KNOWN_PID_WORKERS = [
  { pidFile: '_ddg_turtle_backfill.pid', label: 'DDG Turtle cover backfill', detail: 'q/st deferred covers via DDG' },
  { pidFile: '_status_email_loop.pid', label: '15-min status email loop', detail: 'Aggregating site + agent progress' },
];

const SPRINT_GLOB_RE = /^_([a-z]{2})_sprint300_progress\.json$/;

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return null;
  }
}

function writeJsonAtomic(file, data) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

function pidAlive(pid) {
  if (!pid || !Number.isFinite(pid)) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (_) {
    return false;
  }
}

function readPidFile(name) {
  try {
    return Number(fs.readFileSync(path.join(ROOT, name), 'utf8').trim());
  } catch (_) {
    return null;
  }
}

function readAgentWork() {
  const j = readJsonSafe(AGENT_WORK_FILE);
  if (!j || !Array.isArray(j.sessions)) return { updatedAt: null, sessions: [] };
  return j;
}

/**
 * @param {{
 *   label: string,
 *   done?: number,
 *   total?: number,
 *   failed?: number,
 *   lastItems?: string[],
 *   detail?: string,
 *   agent?: string,
 *   status?: string,
 *   startedAt?: string,
 * }} opts
 */
function setAgentWork(opts = {}) {
  const label = String(opts.label || '').trim();
  if (!label) return readAgentWork();

  const now = new Date().toISOString();
  const cur = readAgentWork();
  const sessions = (cur.sessions || []).filter((s) => s.label !== label);
  const prev = (cur.sessions || []).find((s) => s.label === label) || {};

  sessions.push({
    label,
    agent: opts.agent || prev.agent || 'cursor-agent',
    status: opts.status || prev.status || 'running',
    done: Number(opts.done ?? prev.done ?? 0),
    total: Number(opts.total ?? prev.total ?? 0),
    failed: Number(opts.failed ?? prev.failed ?? 0),
    lastItems: opts.lastItems || prev.lastItems || [],
    detail: opts.detail ?? prev.detail ?? '',
    startedAt: opts.startedAt || prev.startedAt || now,
    updatedAt: now,
  });

  const out = { updatedAt: now, sessions };
  writeJsonAtomic(AGENT_WORK_FILE, out);
  return out;
}

function clearAgentWork(label) {
  const cur = readAgentWork();
  const now = new Date().toISOString();
  const sessions = (cur.sessions || []).filter((s) => s.label !== label);
  const out = { updatedAt: now, sessions };
  writeJsonAtomic(AGENT_WORK_FILE, out);
  return out;
}

function pct(done, total) {
  if (!total || total <= 0) return null;
  return Math.min(100, Math.round((done / total) * 100));
}

function etaLine(done, total, startedAt) {
  if (!total || !done || done <= 0 || !startedAt) return '';
  const elapsed = Date.now() - new Date(startedAt).getTime();
  if (elapsed <= 0) return '';
  const rate = done / elapsed;
  const left = Math.max(0, total - done);
  const etaMs = left / rate;
  if (!Number.isFinite(etaMs) || etaMs <= 0) return '';
  const mins = Math.round(etaMs / 60000);
  if (mins < 60) return `~${mins}m remaining`;
  const hrs = Math.round(mins / 60);
  return `~${hrs}h remaining`;
}

function scanPidWorkers() {
  const out = [];
  for (const w of KNOWN_PID_WORKERS) {
    const pid = readPidFile(w.pidFile);
    if (!pidAlive(pid)) continue;
    out.push({
      label: w.label,
      agent: 'node-worker',
      status: 'running',
      done: 0,
      total: 0,
      failed: 0,
      lastItems: [`pid ${pid}`],
      detail: w.detail,
      startedAt: null,
      updatedAt: new Date().toISOString(),
      source: 'pid',
    });
  }
  return out;
}

function scanSprintProgress() {
  const out = [];
  let files = [];
  try {
    files = fs.readdirSync(ROOT);
  } catch (_) {
    return out;
  }
  for (const f of files) {
    const m = f.match(SPRINT_GLOB_RE);
    if (!m) continue;
    const prefix = m[1];
    const prog = readJsonSafe(path.join(ROOT, f));
    if (!prog) continue;
    const doneArr = Array.isArray(prog.done) ? prog.done : [];
    const done = doneArr.length;
    const total = Number(prog.total) || 300;
    if (prog.complete || done >= total) continue;
    const updated = prog.updated ? new Date(prog.updated).getTime() : 0;
    if (updated && Date.now() - updated > STALE_MS) continue;
    out.push({
      label: `${prefix.toUpperCase()} sprint300`,
      agent: 'batch-script',
      status: 'running',
      done,
      total,
      failed: Number(prog.failed) || 0,
      lastItems: doneArr.slice(-5),
      detail: `_${prefix}_sprint300_progress.json`,
      startedAt: prog.started || prog.updated || null,
      updatedAt: prog.updated || new Date().toISOString(),
      source: 'sprint-progress',
    });
  }
  return out;
}

function scanEconomyLocal() {
  const out = [];
  for (const [file, label] of [
    ['_economy_cro100_state.json', 'Economy CRO-100 batch'],
    ['_economy_palantir100_state.json', 'Economy Palantir-100 batch'],
    ['_revops500_state.json', 'RevOps-500 batch'],
  ]) {
    const st = readJsonSafe(path.join(ROOT, file));
    if (!st || st.done || st.cancelled) continue;
    const ids = Array.isArray(st.ids) ? st.ids : [];
    const posted = Number(st.posted) || ids.length;
    const total = Number(st.total) || Number(st.target) || 0;
    out.push({
      label,
      agent: 'economy-script',
      status: 'running',
      done: posted,
      total: total || posted + 1,
      failed: 0,
      lastItems: ids.slice(-5),
      detail: file,
      startedAt: st.startedAt || null,
      updatedAt: st.updatedAt || new Date().toISOString(),
      source: 'economy-state',
    });
  }
  return out;
}

function scanPolishProgress() {
  const prog = readJsonSafe(path.join(ROOT, '_economy_quality_polish_progress.json'));
  if (!prog || prog.complete) return [];
  const doneMap = prog.done && typeof prog.done === 'object' ? prog.done : {};
  const ids = Object.keys(doneMap);
  const total = Number(prog.total) || 0;
  if (!ids.length && !total) return [];
  if (total && ids.length >= total) return [];
  const lastItems = ids
    .sort((a, b) => (doneMap[b]?.ts || 0) - (doneMap[a]?.ts || 0))
    .slice(0, 5);
  return [
    {
      label: 'Economy quality polish',
      agent: 'economy-script',
      status: 'running',
      done: ids.length,
      total: total || ids.length + 1,
      failed: 0,
      lastItems,
      detail: '_economy_quality_polish_progress.json',
      startedAt: null,
      updatedAt: new Date().toISOString(),
      source: 'polish-progress',
    },
  ];
}

function mergeSessions(lists) {
  const byLabel = new Map();
  for (const list of lists) {
    for (const s of list) {
      if (!s || !s.label) continue;
      const prev = byLabel.get(s.label);
      if (!prev || String(s.updatedAt || '') > String(prev.updatedAt || '')) {
        byLabel.set(s.label, s);
      }
    }
  }
  return [...byLabel.values()].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function freshExplicitSessions(sessions) {
  const now = Date.now();
  return (sessions || []).filter((s) => {
    if (!s || !s.label) return false;
    if (s.status === 'complete') return false;
    const t = s.updatedAt ? new Date(s.updatedAt).getTime() : 0;
    return !t || now - t < STALE_MS;
  });
}

/** Explicit file + fallback scans (PID, sprint, economy). */
function collectAgentSessions() {
  const explicit = freshExplicitSessions(readAgentWork().sessions);
  const fallbacks = [
    ...scanPidWorkers(),
    ...scanSprintProgress(),
    ...scanEconomyLocal(),
    ...scanPolishProgress(),
  ];
  return mergeSessions([explicit, fallbacks]);
}

function progressBar(p) {
  if (p == null) return '';
  const filled = Math.round(p / 5);
  const empty = 20 - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${p}%`;
}

function sessionBlock(s) {
  const p = pct(s.done, s.total);
  const eta = etaLine(s.done, s.total, s.startedAt);
  const last = (s.lastItems || []).slice(-5).join(', ') || '—';
  const counts =
    s.total > 0
      ? `<b>${s.done}</b> / ${s.total}${s.failed ? ` (failed: ${s.failed})` : ''}`
      : s.done
        ? `<b>${s.done}</b> done`
        : 'active';
  let html = `<div style="border:1px solid #2563eb;border-radius:8px;padding:12px;margin:8px 0;background:#eff6ff;">`;
  html += `<p style="margin:0 0 6px;"><b>${esc(s.label)}</b> — <span style="color:#059669;">${esc(s.status || 'running')}</span>`;
  if (s.agent) html += ` <span style="color:#666;font-size:12px;">(${esc(s.agent)})</span>`;
  html += `</p>`;
  html += `<p style="margin:4px 0;">Progress: ${counts}`;
  if (p != null) html += ` — ${progressBar(p)}`;
  if (eta) html += ` — <i>${esc(eta)}</i>`;
  html += `</p>`;
  if (s.detail) html += `<p style="margin:4px 0;font-size:13px;">${esc(s.detail)}</p>`;
  html += `<p style="margin:4px 0;font-size:13px;">Recent: <code>${esc(last)}</code></p>`;
  if (s.updatedAt) html += `<p style="margin:4px 0 0;font-size:11px;color:#666;">Updated ${esc(s.updatedAt.slice(0, 19).replace('T', ' '))} UTC</p>`;
  html += `</div>`;
  return html;
}

function buildAgentWorkHtml(sessions) {
  const list = sessions || collectAgentSessions();
  if (!list.length) {
    return `<div style="background:#fef3c7;border:2px solid #d97706;border-radius:8px;padding:16px;margin:12px 0;">
  <p style="margin:0;font-size:16px;"><b>⚠️ No active agent sessions detected</b></p>
  <p style="margin:8px 0 0;">Call <code>setAgentWork({ label, done, total, detail })</code> from batch scripts, or check sprint/PID fallbacks.</p>
</div>`;
  }
  let html = `<div style="background:#ecfdf5;border:2px solid #059669;border-radius:8px;padding:16px;margin:12px 0;">`;
  html += `<p style="margin:0 0 10px;font-size:18px;"><b>🤖 Agent work (${list.length} active)</b></p>`;
  for (const s of list.slice(0, 8)) html += sessionBlock(s);
  if (list.length > 8) html += `<p style="margin:8px 0 0;font-size:12px;">+ ${list.length - 8} more sessions…</p>`;
  html += `</div>`;
  return html;
}

module.exports = {
  AGENT_WORK_FILE,
  esc,
  readAgentWork,
  setAgentWork,
  clearAgentWork,
  collectAgentSessions,
  buildAgentWorkHtml,
  pidAlive,
  scanPidWorkers,
};
