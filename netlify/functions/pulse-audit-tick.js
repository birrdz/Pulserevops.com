// ════════════════════════════════════════════════════════════════════════
// pulse-audit-tick — lightweight one-entry-at-a-time auditor.
//
// POST advances the audit cursor by ONE entry. Picks the next entry in the
// library index (starting from page 1, looping forever), runs cheap text
// checks (mermaid count, word count, section markers, fabricated patterns),
// stamps the result onto the entry, and updates `_audit_state.json`.
//
// No LLM calls. No web fetches. Just blob reads/writes + regex. Designed to
// be hammered by knowledge.html visitors at low frequency (8-15s polling).
// Idempotent — only advances the cursor if at least N seconds have passed
// since the last advance, so spam clicks/multiple tabs don't double-step.
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const DISPLAY_WINDOW_MS = 7000; // keep currently_auditing_id set for ~7s so the halo is actually visible
const STALE_LOCK_MS     = 45000; // hard takeover ceiling if a tick truly hangs

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function getStoreSafe() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try { return getStore('pulse-machine-library'); }
  catch { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

function lightweightAudit(entry) {
  const issues = [];
  const body = String((entry && entry.answer) || '');
  if (!body || body.length < 200) issues.push('body_too_short');

  const mermaidCount = (body.match(/```mermaid/g) || []).length;
  if (mermaidCount === 0) issues.push('no_mermaid');
  else if (mermaidCount !== 2) issues.push(`mermaid_count_${mermaidCount}`);

  // Word count (prose only — strip code blocks + tables + markdown)
  const cleaned = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\|.*$/gm, ' ')
    .replace(/[#>*`_\[\]\(\)\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = cleaned ? cleaned.split(' ').length : 0;
  if (wordCount < 600) issues.push(`words_low_${wordCount}`);
  if (wordCount > 12000) issues.push(`words_high_${wordCount}`);

  // Section markers — gold format needs Direct Answer + FAQ + Sources
  if (!/Direct Answer/i.test(body)) issues.push('no_direct_answer');
  if (!/\bFAQ\b|frequently asked/i.test(body)) issues.push('no_faq');
  if (!/\b(Sources|References|Citations)\b/i.test(body)) issues.push('no_sources');

  // Obvious placeholder / fabricated patterns
  if (/\bTODO\b|\bTBD\b|\bFIXME\b|\bLOREM\b/i.test(body)) issues.push('has_placeholder');
  if (/\[insert[^\]]*\]|\[name[^\]]*\]|\{\{[^}]+\}\}/i.test(body)) issues.push('has_template_placeholder');
  // Triple-backtick mermaid with leftover labels containing parens-with-commas (known mermaid breaker)
  const mermaidBlocks = body.match(/```mermaid[\s\S]*?```/g) || [];
  for (const block of mermaidBlocks) {
    if (/\[[^\]]*,[^\]]*\]/.test(block) && /\([^)]*,[^)]*\)/.test(block)) {
      issues.push('mermaid_paren_comma');
      break;
    }
  }

  return { issues, mermaidCount, wordCount };
}

async function readState(store) {
  try {
    return (await store.get('_audit_state.json', { type: 'json' })) || null;
  } catch (_) { return null; }
}

async function writeState(store, state) {
  try { await store.setJSON('_audit_state.json', state); } catch (_) {}
}

async function appendIssueLog(store, id, issues) {
  if (!issues || issues.length === 0) return;
  try {
    const log = (await store.get('_audit_issues.json', { type: 'json' })) || { entries: [] };
    log.entries = log.entries || [];
    log.entries.unshift({ id, issues, ts: Date.now() });
    if (log.entries.length > 5000) log.entries = log.entries.slice(0, 5000);
    await store.setJSON('_audit_issues.json', log);
  } catch (_) {}
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };

  const store = getStoreSafe();
  const now = Date.now();
  const state = (await readState(store)) || {
    currently_auditing_id: null,
    started_at: 0,
    last_completed_id: null,
    audited_count: 0,
    loop_count: 0,
    issues_found_total: 0,
  };

  // GET (or any other method besides POST) returns the current state — no advance.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ ok: true, state }),
    };
  }

  // Hold the halo: if currently_auditing_id is still inside its display window,
  // skip and let the visitor's UI keep showing the halo on that card. The lock
  // is hard-released only after STALE_LOCK_MS in case a tick truly hung.
  const sinceStart = now - (state.started_at || 0);
  if (state.currently_auditing_id && sinceStart < DISPLAY_WINDOW_MS) {
    return {
      statusCode: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ ok: true, skipped: true, reason: 'halo_window', state }),
    };
  }
  if (state.currently_auditing_id && sinceStart >= STALE_LOCK_MS) {
    // Force-release the stuck lock
    state.currently_auditing_id = null;
  }

  // Pull the index, page-1-first order (newest q-IDs descending — same sort as
  // /knowledge.html), pick the entry that comes after last_completed_id. If we
  // reached the end (or there is no last_completed_id), wrap to position 0.
  let idx;
  try { idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] }; }
  catch (_) {
    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'index err' }) };
  }
  const entries = (idx.entries || []).slice();
  entries.sort((a, b) => {
    const aIsQ = /^q\d+$/.test(a.id || '');
    const bIsQ = /^q\d+$/.test(b.id || '');
    if (aIsQ && bIsQ) return parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10);
    if (aIsQ && !bIsQ) return -1;
    if (!aIsQ && bIsQ) return 1;
    return (b.ts || 0) - (a.ts || 0);
  });
  if (!entries.length) {
    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'no entries' }) };
  }

  // Pick the next entry to audit. Starting cursor uses the previous picked one
  // (currently_auditing_id) as "just finished" so the cursor walks forward.
  const cursorId = state.currently_auditing_id || state.last_completed_id || null;
  let nextPos = 0;
  if (cursorId) {
    const i = entries.findIndex(e => e && e.id === cursorId);
    nextPos = (i === -1 || i + 1 >= entries.length) ? 0 : (i + 1);
  }
  const looped = nextPos === 0 && cursorId ? 1 : 0;
  const picked = entries[nextPos];
  if (!picked || !picked.id) {
    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'no pick' }) };
  }

  // Run the cheap audit
  let entryFull = null;
  try { entryFull = await store.get('answers/' + picked.id + '.json', { type: 'json' }); }
  catch (_) {}
  const audit = entryFull ? lightweightAudit(entryFull) : { issues: ['missing_blob'], mermaidCount: 0, wordCount: 0 };

  // Stamp result on the entry (best-effort — won't fail the tick)
  if (entryFull) {
    try {
      const stamped = {
        ...entryFull,
        last_audited_at: now,
        last_audit_issues: audit.issues,
      };
      await store.setJSON('answers/' + picked.id + '.json', stamped);
    } catch (_) {}
  }
  if (audit.issues.length) await appendIssueLog(store, picked.id, audit.issues);

  // Keep currently_auditing_id = picked.id for the display window so the
  // visitor's poll catches a non-null value and the purple halo is visible.
  // Also bump last_completed_id to the entry we just audited (so the cursor
  // advances correctly on the next tick).
  const finalState = {
    currently_auditing_id: picked.id,
    started_at: now,
    last_completed_id: picked.id,
    last_completed_at: now,
    last_audit_issues: audit.issues,
    last_audit_words: audit.wordCount,
    last_audit_mermaid: audit.mermaidCount,
    audited_count: (state.audited_count || 0) + 1,
    loop_count: (state.loop_count || 0) + looped,
    issues_found_total: (state.issues_found_total || 0) + (audit.issues.length ? 1 : 0),
    total_entries: entries.length,
  };
  await writeState(store, finalState);

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({
      ok: true,
      id: picked.id,
      audit,
      state: finalState,
    }),
  };
};
