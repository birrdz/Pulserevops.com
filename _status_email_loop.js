// Owner status email every 15 min — economy cron, CG sprint, pillar SEO, new rules.
// Usage:
//   node _status_email_loop.js              # loop forever — ACTIVE by default (AFK law)
//   node _status_email_loop.js --active     # explicit active mode (same as default)
//   node _status_email_loop.js --break      # idle heartbeat only (explicit opt-in)
//   node _status_email_loop.js --once       # single send then exit
const fs = require('fs');
const path = require('path');
const { getStore } = require('@netlify/blobs');
const { sendProgressEmail } = require('./_progress_email');
const { listRegisteredPrefixes } = require('./_pillar_seo_registry');
const {
  setAgentWork,
  collectAgentSessions,
  buildAgentWorkHtml,
} = require('./_agent_work_status');

const ROOT = __dirname;
const INTERVAL_MS = 15 * 60 * 1000;
const ONCE = process.argv.includes('--once');
const BREAK_STATE_FILE = path.join(ROOT, '_pulse_agent_break.json');
const PID_FILE = path.join(ROOT, '_status_email_loop.pid');
// AFK law: default ACTIVE — break emails only when --break is explicitly passed
const BREAK_MODE = process.argv.includes('--break');

try {
  const env = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN;

const HF_ONWARD = [
  'hf', 'ik', 'lv', 'mv', 'nl', 'rs', 'ra', 'er', 'st', 'sc', 'sk', 'sp', 'sy', 'tk', 'tl', 'tn', 'tv', 'wl',
];

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

function tailLog(file, lines = 5) {
  try {
    const all = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
    return all.slice(-lines);
  } catch (_) {
    return [];
  }
}

function handoffNewRules() {
  try {
    const raw = fs.readFileSync(path.join(ROOT, 'HANDOFF_PROMPT.md'), 'utf8');
    const marker = '**(Append below this line any new rules, laws, or tasks over time — this is a living command.)**';
    const idx = raw.indexOf(marker);
    if (idx < 0) return '(marker not found)';
    const tail = raw.slice(idx + marker.length).trim();
    return tail || '(none appended yet)';
  } catch (_) {
    return '(HANDOFF_PROMPT.md unreadable)';
  }
}

function cursorRulesSummary() {
  const dir = path.join(ROOT, '.cursor', 'rules');
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdc'));
  } catch (_) {
    return '<li>rules dir missing</li>';
  }
  const now = Date.now();
  return files
    .map((f) => {
      const full = path.join(dir, f);
      const st = fs.statSync(full);
      const ageH = Math.round((now - st.mtimeMs) / 3600000);
      const fresh = ageH < 48 ? ' <b>(updated recently)</b>' : '';
      let desc = '';
      try {
        const head = fs.readFileSync(full, 'utf8').split('\n').slice(0, 6).join(' ');
        const dm = head.match(/description:\s*(.+)/);
        if (dm) desc = ` — ${dm[1].trim()}`;
      } catch (_) {}
      return `<li><code>${esc(f)}</code>${esc(desc)} — mtime ${st.mtime.toISOString().slice(0, 16)} UTC${fresh}</li>`;
    })
    .join('\n');
}

function pillarSeoTable() {
  const registered = new Set(listRegisteredPrefixes());
  const rows = [];
  for (const p of HF_ONWARD) {
    const phraseFile = path.join(ROOT, `_${p}_keyword_phrases.json`);
    let count = '—';
    if (fs.existsSync(phraseFile)) {
      try {
        count = JSON.parse(fs.readFileSync(phraseFile, 'utf8')).length;
      } catch (_) {
        count = '?';
      }
    } else if (p === 'hf' && fs.existsSync(path.join(ROOT, '_hf_lrn_seo_keywords.js'))) {
      count = 'LRN module';
    }
    const reg = registered.has(p) ? 'yes' : 'no';
    const opt = fs.existsSync(path.join(ROOT, `_${p}_seo_optimize.js`)) ? 'yes' : 'no';
    rows.push(`<tr><td>${p}</td><td>${count}</td><td>${reg}</td><td>${opt}</td></tr>`);
  }
  return rows.join('\n');
}

function cgStatus() {
  const prog = readJsonSafe(path.join(ROOT, '_cg_sprint300_progress.json'));
  const logTail = tailLog(path.join(ROOT, '_cg_sprint300_run.log'), 4);
  const done = prog && Array.isArray(prog.done) ? prog.done.length : 0;
  const last = prog && prog.done ? prog.done.slice(-3).join(', ') : '—';
  return { done, last, logTail };
}

async function blobState() {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const st = (await store.get('_economy_cro_infinite_state.json', { type: 'json' })) || {};
  const hb = (await store.get('_economy_cro_infinite_heartbeat.json', { type: 'json' })) || {};
  return { st, hb };
}

function readBreakState() {
  if (!BREAK_MODE) return { onBreak: false };
  try {
    const j = JSON.parse(fs.readFileSync(BREAK_STATE_FILE, 'utf8'));
    return { onBreak: true, ...j };
  } catch (_) {
    return {
      onBreak: true,
      since: new Date().toISOString(),
      note: 'Agent on break — no active projects. 15-min heartbeat only.',
    };
  }
}

function writeActiveState() {
  if (BREAK_MODE) return;
  fs.writeFileSync(
    BREAK_STATE_FILE,
    JSON.stringify({ onBreak: false, lastActive: new Date().toISOString() }, null, 2) + '\n'
  );
}

function writeBreakState() {
  if (!BREAK_MODE) return;
  let state = readBreakState();
  if (!state.since) state.since = new Date().toISOString();
  state.onBreak = true;
  state.note = state.note || 'Agent on break — no active projects. 15-min heartbeat only.';
  state.lastHeartbeat = new Date().toISOString();
  fs.writeFileSync(BREAK_STATE_FILE, JSON.stringify(state, null, 2) + '\n');
}

function buildBreakHtml(ts, tickN) {
  const state = readBreakState();
  writeBreakState();
  return `<p><b>PULSE 15-min heartbeat — ${esc(ts.slice(0, 16).replace('T', ' '))} UTC</b></p>

<div style="background:#f5f0e6;border:2px solid #059669;border-radius:8px;padding:16px;margin:12px 0;">
  <p style="margin:0;font-size:18px;"><b>☕ On break — no active projects</b></p>
  <p style="margin:8px 0 0;">Cursor agent is idle. No batches, sprints, or pillar SEO work running locally.</p>
</div>

<ul>
  <li><b>Status:</b> break mode (tick #${tickN})</li>
  <li><b>Since:</b> ${esc(state.since || ts)}</li>
  <li><b>Site:</b> <a href="https://pulserevops.com">pulserevops.com</a> (live — Netlify crons may still tick)</li>
  <li><b>Resume work:</b> reply in Cursor or run <code>node _status_email_loop.js --active</code></li>
</ul>

<p style="color:#666;font-size:12px;">Break heartbeat via _status_email_loop.js — every 15 min → koryjordanwhite@gmail.com</p>`;
}

async function buildHtml(tickN = 0) {
  const ts = new Date().toISOString();
  if (BREAK_MODE) return buildBreakHtml(ts, tickN);

  setAgentWork({
    label: '15-min status email loop',
    agent: 'status-email-loop',
    status: 'running',
    done: tickN,
    total: 0,
    detail: `Tick #${tickN} — aggregating cron, sprints, pillar SEO, agent sessions`,
    lastItems: [`tick-${tickN}`],
  });

  const agentSessions = collectAgentSessions();
  const agentSection = buildAgentWorkHtml(agentSessions);

  const cg = cgStatus();
  let blob = { st: {}, hb: {} };
  try {
    blob = await blobState();
  } catch (e) {
    blob.err = e.message;
  }
  const st = blob.st || {};
  const hb = blob.hb || {};

  let deployTs = '—';
  try {
    const d = Number(fs.readFileSync(path.join(ROOT, '.last-deploy-ts'), 'utf8'));
    if (d) deployTs = new Date(d).toISOString();
  } catch (_) {}

  const handoff = handoffNewRules();

  return `<p><b>PULSE 15-min status — ${esc(ts.slice(0, 16).replace('T', ' '))} UTC</b></p>

<h3>Agent work</h3>
${agentSection}

<h3>New rules &amp; living command</h3>
<p><b>Cursor workspace rules</b> (.cursor/rules/):</p>
<ul>${cursorRulesSummary()}</ul>
<p><b>HANDOFF_PROMPT append section:</b></p>
<pre style="white-space:pre-wrap;font-size:12px;">${esc(handoff.slice(0, 2000))}</pre>

<h3>Economy Q&amp;A cron (Netlify */2 min)</h3>
<table border="1" cellpadding="6" cellspacing="0">
<tr><td>Posted (blob)</td><td><b>${st.posted ?? '?'}</b></td></tr>
<tr><td>Next ID</td><td><b>q${st.nextId ?? '?'}</b></td></tr>
<tr><td>Topic gen</td><td>${esc(st.topicGen || '—')}</td></tr>
<tr><td>Cancelled</td><td>${st.cancelled ? '<b style="color:red">YES</b>' : 'no'}</td></tr>
<tr><td>Queue left</td><td>${Math.max(0, (st.queue?.length || 0) - (st.cursor || 0))}</td></tr>
</table>
<p><b>Last heartbeat</b> ${hb.ts ? new Date(hb.ts).toISOString() : 'none'} — ok=${hb.ok ?? '—'} id=${hb.id || '—'} reason=${esc(hb.reason || '—')}</p>

<h3>Pulse Coaching sprint (local)</h3>
<ul>
  <li>Progress: <b>${cg.done}</b> / 300 — recent: ${esc(cg.last)}</li>
  <li>Log tail: ${cg.logTail.map((l) => `<code>${esc(l.slice(0, 120))}</code>`).join('<br>') || '—'}</li>
  <li><a href="https://pulserevops.com/coaching">/coaching</a></li>
</ul>

<h3>Pillar SEO index-max (HF → Wellness)</h3>
<p>Target: 200 Google-intent phrases + compete module + hub sync + blob stamp per pillar.</p>
<table border="1" cellpadding="6" cellspacing="0">
<tr><th>Prefix</th><th>Phrases</th><th>Registry</th><th>Optimize script</th></tr>
${pillarSeoTable()}
</table>

<h3>Deploy</h3>
<ul>
  <li>Last deploy stamp: ${esc(deployTs)}</li>
  <li>Site: <a href="https://pulserevops.com">pulserevops.com</a></li>
</ul>

<p style="color:#666;font-size:12px;">Auto-sent by _status_email_loop.js every 15 min → koryjordanwhite@gmail.com</p>`;
}

async function sendOnce(n = 0) {
  const html = await buildHtml(n || 1);
  const sessions = collectAgentSessions();
  const topLabel = sessions[0]?.label;
  const progressHint =
    sessions[0] && sessions[0].total
      ? ` — ${sessions[0].done}/${sessions[0].total}`
      : sessions.length
        ? ` — ${sessions.length} active`
        : '';
  const subject = BREAK_MODE
    ? `PULSE 15-min #${n || 1} — on break, no active projects`
    : topLabel
      ? `PULSE 15-min #${n || 1} — ${topLabel}${progressHint}`
      : `PULSE 15-min status #${n || 1} — agent + cron + SEO`;
  const r = await sendProgressEmail(subject, html);
  console.log(new Date().toISOString(), JSON.stringify(r));
  return r.ok;
}

function writePid() {
  fs.writeFileSync(PID_FILE, String(process.pid));
}

function removePid() {
  try {
    fs.unlinkSync(PID_FILE);
  } catch (_) {}
}

(async () => {
  if (BREAK_MODE) writeBreakState();
  else writeActiveState();

  if (!ONCE) {
    if (fs.existsSync(PID_FILE)) {
      try {
        const old = Number(fs.readFileSync(PID_FILE, 'utf8'));
        process.kill(old, 0);
        console.error('Another _status_email_loop.js is running (pid', old, '). Exiting.');
        process.exit(1);
      } catch (_) {
        /* stale pid file */
      }
    }
    writePid();
    process.on('exit', removePid);
    process.on('SIGINT', () => {
      removePid();
      process.exit(0);
    });
    process.on('SIGTERM', () => {
      removePid();
      process.exit(0);
    });
  }

  let n = 0;
  for (;;) {
    n++;
    const ok = await sendOnce(n);
    if (!ok) console.error('email send failed');
    if (ONCE) break;
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
})().catch((e) => {
  console.error('FATAL', e);
  removePid();
  process.exit(1);
});
