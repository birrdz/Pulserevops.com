// ════════════════════════════════════════════════════════════════════════
// pulse-audit-background — Library-wide quality auditor. Runs hourly.
//
// For each pass: pulls the next slice of entries (oldest-audited first),
// runs mechanical + substantive checks, writes results to _audit.json
// and pushes failures onto repair_queue.json so the wake-loop can fix.
//
// Mechanical checks (free, zero API):
//   - quality_score === 10
//   - polished_at present
//   - mermaid block present (```mermaid)
//   - markdown table present
//   - >= 2 tags
//   - >= 2 sources OR inline URLs in body
//   - last_modified_ms within freshness window
//   - SEO-ready: question + tags resolvable to a slug
//
// Substantive check (Groq free tier, only when mechanical passes):
//   - delegates to pulse-grader-groq endpoint for verdict
//
// Cost: $0. Mechanical = pure logic. Groq grader = free tier (100k/day).
// Anthropic untouched.
// ════════════════════════════════════════════════════════════════════════
const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SITE_ID            = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const AUDIT_PER_RUN      = 20;                              // 20 × 24/day = 480 audits/day
const FRESHNESS_WINDOW_MS = 60 * 24 * 60 * 60 * 1000;       // 60 days — beyond this = stale
const GROQ_GRADE_CAP     = 6;                               // max Groq calls per run (saves daily quota)

async function getLibraryStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try { return getStore('pulse-machine-library'); }
  catch (e) {
    if (tok && SITE_ID) return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
    throw e;
  }
}

function mechanicalAudit(entry) {
  const issues = [];
  const body = String(entry.answer || '');
  const score = typeof entry.quality_score === 'number' ? entry.quality_score : 0;
  const ts = entry.ts || 0;
  const lastMod = entry.last_modified_ms || entry.polished_at || ts;

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

  // Banned-phrase sentinels — quick string contains
  const BANNED = ['leverage', 'utilize', 'delve', 'synergy', 'best-in-class', 'world-class', 'cutting-edge', 'streamline', 'tapestry', 'in today\'s', 'ever-evolving', 'paradigm shift', 'game-changer'];
  const lc = body.toLowerCase();
  for (const phrase of BANNED) {
    if (lc.includes(phrase)) { issues.push('banned:' + phrase.split(/\s+/)[0]); break; }
  }

  return { pass: issues.length === 0, issues, score };
}

function postJson(host, path, payloadObj) {
  return new Promise((resolve) => {
    const body = JSON.stringify(payloadObj);
    const opts = {
      hostname: host, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 12000,
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => { try { resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(data || '{}') }); } catch (e) { resolve({ ok: false, status: res.statusCode, data: null }); } });
    });
    req.on('error', () => resolve({ ok: false, status: 0, data: null }));
    req.on('timeout', () => { try { req.destroy(); } catch (_) {} resolve({ ok: false, status: 0, data: null }); });
    req.write(body);
    req.end();
  });
}

async function groqGrade(id) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const writerKey = process.env.PULSE_WRITER_KEY || 'pulsemachine-writer-2026';
  const host = 'pulserevops.com';
  const result = await postJson(host, '/.netlify/functions/pulse-grader-groq', { key: writerKey, id });
  return result.ok ? result.data : null;
}

exports.handler = async () => {
  let store;
  try { store = await getLibraryStore(); }
  catch (e) { console.error('[audit] store err', e && e.message); return { statusCode: 200, body: 'no store' }; }
  if (!store) return { statusCode: 200, body: 'no store' };

  const idx = await store.get('_index.json', { type: 'json' });
  if (!idx || !Array.isArray(idx.entries) || !idx.entries.length) {
    return { statusCode: 200, body: 'empty library' };
  }

  const auditState = (await store.get('_audit_state.json', { type: 'json' })) || { cursor: 0, day: '', runs_today: 0, audited_today: 0 };
  const today = new Date().toISOString().slice(0, 10);
  if (auditState.day !== today) { auditState.day = today; auditState.runs_today = 0; auditState.audited_today = 0; }

  // Rolling slice
  const total = idx.entries.length;
  const start = auditState.cursor % total;
  const slice = [];
  for (let i = 0; i < Math.min(AUDIT_PER_RUN, total); i++) {
    slice.push(idx.entries[(start + i) % total]);
  }

  const repairQueue = (await store.get('repair_queue.json', { type: 'json' })) || { items: [] };
  const audit       = (await store.get('_audit.json', { type: 'json' })) || { entries: {}, last_run: 0 };

  let groqCalls = 0;
  let added = 0;
  for (const ix of slice) {
    if (!ix || !ix.id) continue;
    const entry = await store.get('answers/' + ix.id + '.json', { type: 'json' });
    if (!entry) continue;

    const mech = mechanicalAudit(entry);
    let groqVerdict = null;
    if (mech.pass && groqCalls < GROQ_GRADE_CAP) {
      // Mechanical passed — verify with Groq second-opinion grader.
      // Only fire if entry has been polished (avoids grading 5/10 drafts).
      if (entry.quality_score >= 9) {
        const g = await groqGrade(entry.id);
        groqCalls++;
        if (g && g.verdict === 'fail') groqVerdict = { verdict: 'fail', issues: g.issues || [], score: g.score };
        else if (g && g.verdict === 'pass') groqVerdict = { verdict: 'pass', score: g.score };
      }
    }

    audit.entries[entry.id] = {
      ts: Date.now(),
      score: entry.quality_score || 0,
      mech_pass: mech.pass,
      issues: mech.issues,
      groq: groqVerdict,
    };

    // Queue repair if mechanical fail OR groq fail
    if (!mech.pass || (groqVerdict && groqVerdict.verdict === 'fail')) {
      const existing = repairQueue.items.find(it => it.id === entry.id);
      const reasons = [...mech.issues, ...(groqVerdict && groqVerdict.verdict === 'fail' ? (groqVerdict.issues || []).map(s => 'groq:' + s.slice(0, 40)) : [])];
      if (existing) {
        existing.last_seen = Date.now();
        existing.reasons = Array.from(new Set([...(existing.reasons || []), ...reasons])).slice(0, 8);
      } else {
        repairQueue.items.push({ id: entry.id, question: entry.question, current_score: entry.quality_score || 0, reasons, first_seen: Date.now(), last_seen: Date.now() });
        added++;
      }
    } else {
      // Clean — remove from repair queue if present
      const i = repairQueue.items.findIndex(it => it.id === entry.id);
      if (i >= 0) repairQueue.items.splice(i, 1);
    }
  }

  // Trim caches
  if (repairQueue.items.length > 2000) repairQueue.items = repairQueue.items.slice(-2000);
  const auditKeys = Object.keys(audit.entries);
  if (auditKeys.length > 6000) {
    auditKeys.sort((a, b) => (audit.entries[a].ts || 0) - (audit.entries[b].ts || 0));
    const drop = auditKeys.slice(0, auditKeys.length - 6000);
    for (const k of drop) delete audit.entries[k];
  }

  audit.last_run = Date.now();
  auditState.cursor = (start + slice.length) % total;
  auditState.runs_today = (auditState.runs_today || 0) + 1;
  auditState.audited_today = (auditState.audited_today || 0) + slice.length;

  await store.setJSON('_audit.json', audit);
  await store.setJSON('repair_queue.json', repairQueue);
  await store.setJSON('_audit_state.json', auditState);

  console.log('[audit] slice=' + slice.length + ' added=' + added + ' groq=' + groqCalls + ' cursor=' + auditState.cursor + '/' + total);
  return { statusCode: 200, body: JSON.stringify({ ok: true, slice: slice.length, added, groqCalls, cursor: auditState.cursor, total }) };
};
