// Batch progress emails → koryjordanwhite@gmail.com via pulse-progress-notify.
// LAW: email at least every 15 minutes while a batch/workflow is active (+ start/complete/error).

const NOTIFY_URL =
  'https://pulserevops.com/.netlify/functions/pulse-progress-notify?key=pulsemachine-writer-2026';
// LAW 2026-06-23: COUNT-based is now the PRIMARY trigger — email every 10 work-units
// shipped (10 Q&As / 10 images / 10 regen links). Time schedules kept stopping, so the
// 15-min timer is demoted to a $0 safety-net max-gap, not the main signal.
const DEFAULT_TIME_INTERVAL_MS = 15 * 60 * 1000; // safety-net max gap only
const DEFAULT_ENTRY_INTERVAL = 10; // PRIMARY: email every 10 things done
const RECIPIENT = 'koryjordanwhite@gmail.com';

async function sendProgressEmail(subject, html) {
  // NEUTERED 2026-06-26 (owner: ONE consolidated email only). Batch-progress emails
  // (image lanes, sprint runners) are off; the consolidated gap-fill email uses a
  // different path (pulse-owner-notify). Re-enable by removing this return.
  return { ok: true, skipped: true };
  try {
    const r = await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: String(subject).slice(0, 200), html: String(html).slice(0, 100000) }),
      signal: AbortSignal.timeout(12000),
    });
    const text = await r.text().catch(() => '');
    return { ok: r.ok, status: r.status, body: text.slice(0, 200) };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * @param {{
 *   label?: string,
 *   total?: number,
 *   interval?: number,
 *   timeIntervalMs?: number,
 *   pillarUrl?: string,
 * }} opts
 */
function agentWorkSync() {
  try {
    return require('../../../_agent_work_status');
  } catch (_) {
    return null;
  }
}

function createBatchProgressReporter(opts = {}) {
  const label = opts.label || 'PULSE batch';
  const total = Number(opts.total) || 0;
  const entryInterval = Number(opts.interval ?? opts.entryInterval ?? DEFAULT_ENTRY_INTERVAL);
  const timeIntervalMs =
    opts.timeIntervalMs === 0 ? 0 : Number(opts.timeIntervalMs || DEFAULT_TIME_INTERVAL_MS);
  const pillarUrl = opts.pillarUrl || '';
  const syncAgentWork = opts.agentWork === true;
  let done = 0;
  let failed = 0;
  let skipped = 0;
  const startedAt = Date.now();
  let lastEmailAt = 0;
  let timeTimer = null;
  const recent = [];

  function pushAgentWork(detail, status) {
    if (!syncAgentWork) return;
    const aw = agentWorkSync();
    if (!aw) return;
    aw.setAgentWork({
      label,
      done,
      total,
      failed,
      lastItems: recent.slice(-5),
      detail: detail || '',
      agent: opts.agent || 'batch-reporter',
      status: status || 'running',
      startedAt: new Date(startedAt).toISOString(),
    });
  }

  function summaryHtml(extra = '') {
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    const left = total ? Math.max(0, total - done - failed - skipped) : '?';
    let html = `<p><b>${esc(label)}</b></p>`;
    html += `<p>Done: <b>${done}</b>${total ? ` / ${total}` : ''} | Failed: <b>${failed}</b> | Skipped: ${skipped} | Remaining: ${left}</p>`;
    html += `<p>Elapsed: ${elapsed}s | 15-min law: ${timeIntervalMs ? 'active' : 'off'}</p>`;
    if (recent.length) {
      html += '<p>Recent:</p><ul>';
      for (const r of recent.slice(-5)) {
        html += `<li>${esc(r)}</li>`;
      }
      html += '</ul>';
    }
    if (pillarUrl) html += `<p><a href="${esc(pillarUrl)}">${esc(pillarUrl)}</a></p>`;
    if (extra) html += extra;
    html += `<p><i>${new Date().toISOString()}</i></p>`;
    return html;
  }

  async function emailMilestone(kind, extraHtml = '') {
    lastEmailAt = Date.now();
    const subject = `${label}: ${kind}`;
    return sendProgressEmail(subject, summaryHtml(extraHtml));
  }

  async function maybeTimeEmail(kind) {
    if (!timeIntervalMs) return null;
    if (Date.now() - lastEmailAt < timeIntervalMs) return null;
    const suffix = total ? ` (${done}/${total})` : done ? ` (${done} done)` : '';
    return emailMilestone(kind || `15-min update${suffix}`);
  }

  function startTimeTimer() {
    if (!timeIntervalMs || timeTimer) return;
    timeTimer = setInterval(() => {
      maybeTimeEmail('15-min update (timer)').catch(() => {});
    }, timeIntervalMs);
    if (typeof timeTimer.unref === 'function') timeTimer.unref();
  }

  function stopTimeTimer() {
    if (timeTimer) {
      clearInterval(timeTimer);
      timeTimer = null;
    }
  }

  return {
    get counts() {
      return { done, failed, skipped, total, entryInterval, timeIntervalMs };
    },

    async start(extraHtml = '') {
      lastEmailAt = Date.now();
      startTimeTimer();
      pushAgentWork('started', 'running');
      return emailMilestone(`started${total ? ` (0/${total})` : ''}`, extraHtml);
    },

    /**
     * Call after each successful unit. Also fires on entry interval (if set) and 15-min law.
     */
    async tick(detail) {
      done++;
      if (detail) recent.push(detail);
      if (recent.length > 8) recent.shift();
      pushAgentWork(detail, 'running');
      const isLast = total > 0 && done + failed + skipped >= total;
      let sent = null;
      if (entryInterval > 0 && (done % entryInterval === 0 || isLast)) {
        sent = await emailMilestone(`${done}${total ? `/${total}` : ''} done`);
      } else {
        sent = await maybeTimeEmail();
      }
      if (isLast && !sent) sent = await emailMilestone(`final entry ${done}${total ? `/${total}` : ''}`);
      return sent;
    },

    async skip(detail) {
      skipped++;
      if (detail) recent.push(`SKIP: ${detail}`);
      return maybeTimeEmail();
    },

    async fail(detail) {
      failed++;
      if (detail) recent.push(`FAIL: ${detail}`);
      pushAgentWork(detail, 'running');
      return maybeTimeEmail();
    },

    async complete(extraHtml = '') {
      stopTimeTimer();
      pushAgentWork('complete', 'complete');
      const aw = agentWorkSync();
      if (aw && syncAgentWork) aw.clearAgentWork(label);
      return emailMilestone(`COMPLETE (${done} ok, ${failed} failed)`, extraHtml);
    },

    async error(message) {
      stopTimeTimer();
      pushAgentWork(String(message), 'error');
      return emailMilestone('ERROR', `<p>${esc(message)}</p>`);
    },

    maybeTimeEmail,
    sendProgressEmail,
    summaryHtml,
    stopTimeTimer,
  };
}

module.exports = {
  RECIPIENT,
  DEFAULT_TIME_INTERVAL_MS,
  DEFAULT_ENTRY_INTERVAL,
  /** @deprecated use DEFAULT_ENTRY_INTERVAL */
  DEFAULT_INTERVAL: DEFAULT_ENTRY_INTERVAL,
  NOTIFY_URL,
  sendProgressEmail,
  createBatchProgressReporter,
};
