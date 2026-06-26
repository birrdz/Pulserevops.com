// pulse-audit-background — catch-up until library audited, then new answers only.
// Catch-up: */5 cron, 50 entries/run, unaudited/stale first.
// Steady: 25 newest/changed entries per run (economy posts ~20/hr).
// Economy Q&As (revops-google / economy-mode): structure audit only — no qs=10/polish gate.

const https = require('https');

let getStore = null;
try {
  getStore = require('@netlify/blobs').getStore;
} catch (e) {}

const SITE_ID = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const CATCHUP_PER_RUN = 50;
const STEADY_PER_RUN = 25;
const GROQ_GRADE_CAP = 4;
const FRESHNESS_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;

async function getLibraryStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try {
    return getStore('pulse-machine-library');
  } catch (e) {
    if (tok && SITE_ID) return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
    throw e;
  }
}

function isEconomyEntry(entry) {
  const tags = entry.tags || [];
  return (
    tags.includes('economy-mode') ||
    tags.includes('revops-google') ||
    tags.includes('nil-gtm')
  );
}

function isPublishableQ(row) {
  if (!row || !row.id) return false;
  if (!/^q\d+$/i.test(row.id)) return false;
  if (row.pending) return false;
  if (row.source === 'visitor') return false;
  return true;
}

function entryModMs(entry) {
  return entry.last_modified_ms || entry.polished_at || entry.ts || 0;
}

function needsAudit(row, auditRec) {
  if (!auditRec) return true;
  const mod = row.last_modified_ms || row.polished_at || row.ts || 0;
  return mod > (auditRec.ts || 0);
}

function mechanicalFull(entry) {
  const issues = [];
  const body = String(entry.answer || '');
  const score = typeof entry.quality_score === 'number' ? entry.quality_score : 0;
  const lastMod = entryModMs(entry);

  if (score < 10) issues.push('score:' + score);
  if (!entry.polished_at) issues.push('not-polished');
  if (!/```mermaid/i.test(body)) issues.push('no-mermaid');
  if (!/\|.*\|.*\|/.test(body) || !/\|\s*-+\s*\|/.test(body)) issues.push('no-table');
  if (!Array.isArray(entry.tags) || entry.tags.length < 2) issues.push('few-tags');
  const inlineUrls = (body.match(/https?:\/\/[^\s)\]>"']+/g) || []).length;
  const sourceCount = Array.isArray(entry.sources) ? entry.sources.length : 0;
  if (sourceCount + inlineUrls < 2) issues.push('few-sources');
  if (Date.now() - lastMod > FRESHNESS_WINDOW_MS) issues.push('stale');
  if (!entry.question || entry.question.length < 8) issues.push('bad-question');
  if (body.length < 400) issues.push('short-body');

  const BANNED = [
    'leverage',
    'utilize',
    'delve',
    'synergy',
    'best-in-class',
    'world-class',
    'cutting-edge',
    'streamline',
    'tapestry',
    "in today's",
    'ever-evolving',
    'paradigm shift',
    'game-changer',
  ];
  const lc = body.toLowerCase();
  for (const phrase of BANNED) {
    if (lc.includes(phrase)) {
      issues.push('banned:' + phrase.split(/\s+/)[0]);
      break;
    }
  }

  return { pass: issues.length === 0, issues, profile: 'full' };
}

function mechanicalEconomy(entry) {
  const issues = [];
  const body = String(entry.answer || '');

  if (!entry.question || entry.question.length < 8) issues.push('bad-question');
  if (body.length < 800) issues.push('short-body');
  if (!/```mermaid/i.test(body)) issues.push('no-mermaid');
  if (!/\|.*\|.*\|/.test(body) || !/\|\s*-+\s*\|/.test(body)) issues.push('no-table');
  if (!Array.isArray(entry.tags) || entry.tags.length < 2) issues.push('few-tags');
  const inlineUrls = (body.match(/https?:\/\/[^\s)\]>"']+/g) || []).length;
  const sourceCount = Array.isArray(entry.sources) ? entry.sources.length : 0;
  if (sourceCount + inlineUrls < 1) issues.push('few-sources');

  return { pass: issues.length === 0, issues, profile: 'economy' };
}

function mechanicalAudit(entry) {
  if (isEconomyEntry(entry)) return mechanicalEconomy(entry);
  return mechanicalFull(entry);
}

function postJson(host, path, payloadObj) {
  return new Promise((resolve) => {
    const body = JSON.stringify(payloadObj);
    const req = https.request(
      {
        hostname: host,
        path,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
        timeout: 12000,
      },
      (res) => {
        let data = '';
        res.on('data', (c) => {
          data += c;
        });
        res.on('end', () => {
          try {
            resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(data || '{}') });
          } catch (e) {
            resolve({ ok: false, status: res.statusCode, data: null });
          }
        });
      }
    );
    req.on('error', () => resolve({ ok: false, status: 0, data: null }));
    req.on('timeout', () => {
      try {
        req.destroy();
      } catch (_) {}
      resolve({ ok: false, status: 0, data: null });
    });
    req.write(body);
    req.end();
  });
}

async function groqGrade(id) {
  if (!process.env.GROQ_API_KEY) return null;
  const writerKey = process.env.PULSE_WRITER_KEY || 'pulsemachine-writer-2026';
  const result = await postJson('pulserevops.com', '/.netlify/functions/pulse-grader-groq', {
    key: writerKey,
    id,
  });
  return result.ok ? result.data : null;
}

async function writeAuditStatus(store, patch) {
  try {
    const prev = (await store.get('_audit_status.json', { type: 'json' })) || {};
    const ids = patch.audit_targets || [];
    const next = {
      ...prev,
      id: ids[0] || '',
      id2: ids[1] || '',
      id3: ids[2] || '',
      id4: ids[3] || '',
      id5: ids[4] || '',
      tick_kind: 'audit',
      ts: Date.now(),
      ...patch,
    };
    await store.setJSON('_audit_status.json', next);
  } catch (e) {
    console.error('[audit] status write err', e.message);
  }
}

function buildWorklist(idxEntries, audit, mode, steadyAnchorTs) {
  const publishable = idxEntries.filter(isPublishableQ);
  const backlog = [];
  for (const row of publishable) {
    const rec = audit.entries[row.id];
    if (needsAudit(row, rec)) backlog.push(row);
  }

  if (mode === 'steady') {
    const fresh = backlog.filter((row) => {
      const ts = row.ts || 0;
      return ts >= (steadyAnchorTs || 0) - 120000;
    });
    fresh.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    return { work: fresh.slice(0, STEADY_PER_RUN), backlog: fresh.length, total: publishable.length };
  }

  function catchUpRank(row) {
    const rec = audit.entries[row.id];
    const tags = row.tags || [];
    const isEconomy =
      tags.includes('economy-mode') ||
      tags.includes('revops-google') ||
      tags.includes('nil-gtm');
    if (!rec && isEconomy) return 0;
    if (!rec) return 1;
    if (isEconomy) return 2;
    return 3;
  }
  backlog.sort((a, b) => {
    const ra = catchUpRank(a);
    const rb = catchUpRank(b);
    if (ra !== rb) return ra - rb;
    if (ra <= 2) return (b.ts || 0) - (a.ts || 0);
    const aRec = audit.entries[a.id];
    const bRec = audit.entries[b.id];
    const aTs = aRec ? aRec.ts || 0 : 0;
    const bTs = bRec ? bRec.ts || 0 : 0;
    if (aTs !== bTs) return aTs - bTs;
    return (a.ts || 0) - (b.ts || 0);
  });

  return {
    work: backlog.slice(0, CATCHUP_PER_RUN),
    backlog: backlog.length,
    total: publishable.length,
  };
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async () => {
  /* visitor-priority-injected */
  try {
    let __vp_getStore = null;
    try { __vp_getStore = require('@netlify/blobs').getStore; } catch (_e) {}
    if (__vp_getStore) {
      let __vp_store = null;
      try { __vp_store = __vp_getStore('pulse-machine-library'); }
      catch (_e) {
        const __vp_tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const __vp_sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (__vp_tok && __vp_sid) {
          try { __vp_store = __vp_getStore({ name: 'pulse-machine-library', siteID: __vp_sid, token: __vp_tok }); } catch (_e2) {}
        }
      }
      if (__vp_store && await isVisitorPriorityActive(__vp_store)) {
        return { statusCode: 200, body: JSON.stringify({ ok: true, paused: 'visitor-priority' }) };
      }
    }
  } catch (_e) {}

  let store;
  try {
    store = await getLibraryStore();
  } catch (e) {
    console.error('[audit] store err', e && e.message);
    return { statusCode: 200, body: 'no store' };
  }
  if (!store) return { statusCode: 200, body: 'no store' };

  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries) || !idx.entries.length) {
    return { statusCode: 200, body: 'empty library' };
  }

  const auditState =
    (await store.get('_audit_state.json', { type: 'json' })) || {
      mode: 'catch-up',
      steady_anchor_ts: 0,
      audited_total: 0,
      runs: 0,
    };

  const audit = (await store.get('_audit.json', { type: 'json' })) || { entries: {}, last_run: 0 };
  audit.entries = audit.entries || {};

  const repairQueue = (await store.get('repair_queue.json', { type: 'json' })) || { items: [] };
  repairQueue.items = repairQueue.items || [];

  let mode = auditState.mode === 'steady' ? 'steady' : 'catch-up';
  let { work, backlog, total } = buildWorklist(idx.entries, audit, mode, auditState.steady_anchor_ts || 0);

  if (mode === 'catch-up' && backlog === 0) {
    mode = 'steady';
    auditState.mode = 'steady';
    auditState.steady_anchor_ts = Date.now();
    auditState.caught_up_at = Date.now();
    ({ work, backlog, total } = buildWorklist(idx.entries, audit, mode, auditState.steady_anchor_ts));
  }

  const targetIds = work.map((w) => w.id).slice(0, 5);
  await writeAuditStatus(store, {
    audit_targets: targetIds,
    audit_kind: 'audit',
    mode,
    backlog_remaining: backlog,
    library_q_count: total,
    audited_count: auditState.audited_total || Object.keys(audit.entries).length,
  });

  if (!work.length) {
    auditState.last_run_ms = Date.now();
    await store.setJSON('_audit_state.json', auditState);
    await writeAuditStatus(store, { audit_targets: [], backlog_remaining: 0, mode: 'steady' });
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, mode: 'steady', message: 'nothing to audit', backlog: 0 }),
    };
  }

  let groqCalls = 0;
  let added = 0;
  let passed = 0;
  let economyPass = 0;

  for (const row of work) {
    const entry = await store.get('answers/' + row.id + '.json', { type: 'json' });
    if (!entry) continue;

    const mech = mechanicalAudit(entry);
    let groqVerdict = null;

    if (mech.profile === 'full' && mech.pass && groqCalls < GROQ_GRADE_CAP && entry.quality_score >= 9) {
      const g = await groqGrade(entry.id);
      groqCalls++;
      if (g && g.verdict === 'fail')
        groqVerdict = { verdict: 'fail', issues: g.issues || [], score: g.score };
      else if (g && g.verdict === 'pass') groqVerdict = { verdict: 'pass', score: g.score };
    }

    audit.entries[entry.id] = {
      ts: Date.now(),
      score: entry.quality_score || 0,
      mech_pass: mech.pass,
      issues: mech.issues,
      profile: mech.profile,
      groq: groqVerdict,
    };

    if (mech.pass) {
      passed++;
      if (mech.profile === 'economy') economyPass++;
      const i = repairQueue.items.findIndex((it) => it.id === entry.id);
      if (i >= 0) repairQueue.items.splice(i, 1);
    } else {
      const existing = repairQueue.items.find((it) => it.id === entry.id);
      const reasons = [
        ...mech.issues,
        ...(groqVerdict && groqVerdict.verdict === 'fail'
          ? (groqVerdict.issues || []).map((s) => 'groq:' + String(s).slice(0, 40))
          : []),
      ];
      if (existing) {
        existing.last_seen = Date.now();
        existing.reasons = Array.from(new Set([...(existing.reasons || []), ...reasons])).slice(0, 8);
      } else {
        repairQueue.items.push({
          id: entry.id,
          question: entry.question,
          current_score: entry.quality_score || 0,
          reasons,
          first_seen: Date.now(),
          last_seen: Date.now(),
        });
        added++;
      }
    }
  }

  if (repairQueue.items.length > 2000) repairQueue.items = repairQueue.items.slice(-2000);
  const auditKeys = Object.keys(audit.entries);
  if (auditKeys.length > 8000) {
    auditKeys.sort((a, b) => (audit.entries[a].ts || 0) - (audit.entries[b].ts || 0));
    for (const k of auditKeys.slice(0, auditKeys.length - 8000)) delete audit.entries[k];
  }

  audit.last_run = Date.now();
  auditState.runs = (auditState.runs || 0) + 1;
  auditState.audited_total = (auditState.audited_total || 0) + work.length;
  auditState.last_run_ms = Date.now();
  auditState.last_mode = mode;
  auditState.last_backlog = backlog;

  if (mode === 'catch-up' && backlog <= work.length && work.length > 0) {
    auditState.mode = 'steady';
    auditState.steady_anchor_ts = Date.now();
    auditState.caught_up_at = Date.now();
  }

  await store.setJSON('_audit.json', audit);
  await store.setJSON('repair_queue.json', repairQueue);
  await store.setJSON('_audit_state.json', auditState);

  await writeAuditStatus(store, {
    audit_targets: [],
    mode: auditState.mode,
    backlog_remaining: Math.max(0, backlog - work.length),
    audited_count: auditState.audited_total,
  });

  const summary = {
    ok: true,
    mode,
    next_mode: auditState.mode,
    slice: work.length,
    passed,
    economyPass,
    repair_added: added,
    groqCalls,
    backlog,
    backlog_after: Math.max(0, backlog - work.length),
    total_q: total,
  };
  console.log('[audit]', JSON.stringify(summary));
  return { statusCode: 200, body: JSON.stringify(summary) };
};
