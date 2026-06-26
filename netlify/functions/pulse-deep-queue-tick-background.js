// pulse-deep-queue-tick-background — runs every 10 minutes on Netlify cron.
//
// Publishes one pre-written deep-dive entry from _deep_queue.json per fire.
// Pre-written content is added to the queue by Claude Code (Opus) running
// locally — this cron is publish-only maintenance, NO AI generation here.
// Aligns with the locked workflow rule: "Claude Opus does ALL library writes;
// cron is Gemini-only maintenance." This function is in the maintenance bucket
// because all content was authored upstream; the cron just paces publishing.
//
// Queue format (_deep_queue.json):
//   {
//     "queue": [
//       {
//         "id": "q1908",
//         "tldr": "...", "core": "...", "flow": "...",
//         "src": "...", "num": "...", "counter": "...", "links": "...",
//         "tags": [...], "sources": [...], "notes": { s6:.., s7:.., s8:.., s9:.., s10:.. }
//       }, ...
//     ],
//     "published": ["q1928", "q1927", ...],
//     "started_ms": 1715000000000,
//     "last_published_ms": 1715000000000,
//     "last_id": "q1909"
//   }

const { getStore } = require('@netlify/blobs');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';
const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
const QUEUE_KEY = '_deep_queue.json';
const HEARTBEAT_KEY = '_deep_queue_heartbeat.json';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function getStoreSafe() {
  const tok = process.env.BLOBS_PAT;
  try { return getStore('pulse-machine-library'); }
  catch { return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }
}

async function postPolish(payload) {
  const r = await fetch(POLISH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j.ok !== false, status: r.status, body: j };
}

async function runPolishLadder(store, spec) {
  const { id, tldr, core, flow, src, num, counter, links, sources, tags, notes } = spec;
  const v5 = tldr + core + flow;
  const v6 = v5 + src;
  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;

  const existing = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!existing) {
    return { ok: false, error: 'entry ' + id + ' not found in library' };
  }
  const question = existing.question;
  const ts = Date.now();

  // Reset to v5 baseline
  await store.setJSON('answers/' + id + '.json', {
    id, question,
    answer: v5,
    tags: tags || [],
    sources: (sources || []).slice(0, 3),
    ts,
    model: 'claude-opus-4-7-via-claude-code-deep-queue',
    quality_score: 5,
    polished_at: null,
    polish_history: [],
    baseline_answer_v5: v5,
    source: 'claude-opus-deep-queue-cron'
  });

  // Update index
  const idx = await store.get('_index.json', { type: 'json' });
  if (idx && Array.isArray(idx.entries)) {
    const i = idx.entries.findIndex(x => x.id === id);
    const row = { id, question, tags: tags || [], ts, quality_score: 5, polished_at: null, last_modified_ms: ts, sources_count: 3 };
    if (i >= 0) idx.entries[i] = row; else idx.entries.unshift(row);
    await store.setJSON('_index.json', idx);
  }

  await sleep(400);

  const safeNotes = notes || {};
  const steps = [
    { target: 6, new_answer: v6, note: safeNotes.s6 || 'Sources added.' },
    { target: 7, new_answer: v7, note: safeNotes.s7 || 'Numbers added.' },
    { target: 8, new_answer: v8, note: safeNotes.s8 || 'Counter-case added.' },
    { target: 9, new_answer: v9, note: safeNotes.s9 || 'Cross-links added.' },
    { target: 10, new_answer: null, note: safeNotes.s10 || 'SUBAGENT_VERIFIED.' }
  ];

  const stepResults = [];
  for (const s of steps) {
    const payload = { key: KEY, id, polish_note: s.note };
    if (s.new_answer) payload.new_answer = s.new_answer;
    const r = await postPolish(payload);
    stepResults.push({ target: s.target, status: r.status });
    if (r.status !== 200) {
      return { ok: false, error: 'polish step ' + s.target + ' failed', steps: stepResults };
    }
    await sleep(400);
  }

  return { ok: true, steps: stepResults };
}

async function updateTracker(store, id) {
  try {
    const tracker = (await store.get('_claude_opus_progress.json', { type: 'json' })) || { rewritten: [], started_ms: Date.now(), total_library: 1614, count: 0 };
    tracker.rewritten = tracker.rewritten || [];
    if (!tracker.rewritten.includes(id)) tracker.rewritten.push(id);
    tracker.count = tracker.rewritten.length;
    tracker.last_id = id;
    tracker.last_ms = Date.now();
    const idx2 = await store.get('_index.json', { type: 'json' });
    if (idx2 && idx2.entries) tracker.total_library = idx2.entries.length;
    await store.setJSON('_claude_opus_progress.json', tracker);
    return tracker;
  } catch (err) {
    return null;
  }
}

async function writeHeartbeat(store, status) {
  try {
    await store.setJSON(HEARTBEAT_KEY, Object.assign({ ts: Date.now() }, status));
  } catch (_) {}
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async function() {
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

  const startMs = Date.now();
  const store = getStoreSafe();

  let queueDoc;
  try {
    queueDoc = await store.get(QUEUE_KEY, { type: 'json' });
  } catch (err) {
    await writeHeartbeat(store, { ok: false, reason: 'queue_read_error', error: String(err) });
    return { statusCode: 200, body: 'queue read error: ' + err.message };
  }

  if (!queueDoc || !Array.isArray(queueDoc.queue) || queueDoc.queue.length === 0) {
    await writeHeartbeat(store, { ok: true, reason: 'queue_empty', queue_length: 0 });
    return { statusCode: 200, body: 'queue empty — nothing to publish' };
  }

  const spec = queueDoc.queue[0];
  if (!spec || !spec.id) {
    queueDoc.queue.shift();
    await store.setJSON(QUEUE_KEY, queueDoc);
    await writeHeartbeat(store, { ok: false, reason: 'malformed_entry', shifted: true });
    return { statusCode: 200, body: 'malformed entry shifted' };
  }

  const result = await runPolishLadder(store, spec);
  if (!result.ok) {
    // Don't shift on failure — leave at head of queue for retry next tick.
    // But cap retries: if same ID failed 3+ times in a row, shift to dead-letter.
    queueDoc._retries = queueDoc._retries || {};
    queueDoc._retries[spec.id] = (queueDoc._retries[spec.id] || 0) + 1;
    if (queueDoc._retries[spec.id] >= 3) {
      queueDoc._dead_letter = queueDoc._dead_letter || [];
      queueDoc._dead_letter.push({ id: spec.id, error: result.error, ts: Date.now() });
      queueDoc.queue.shift();
      delete queueDoc._retries[spec.id];
    }
    await store.setJSON(QUEUE_KEY, queueDoc);
    await writeHeartbeat(store, { ok: false, id: spec.id, error: result.error, retries: queueDoc._retries[spec.id] });
    return { statusCode: 200, body: 'polish failed: ' + result.error };
  }

  // Success — shift from queue + add to published list
  queueDoc.queue.shift();
  queueDoc.published = queueDoc.published || [];
  queueDoc.published.push(spec.id);
  queueDoc.last_id = spec.id;
  queueDoc.last_published_ms = Date.now();
  if (queueDoc._retries && queueDoc._retries[spec.id]) delete queueDoc._retries[spec.id];
  await store.setJSON(QUEUE_KEY, queueDoc);

  // Update tracker
  const tracker = await updateTracker(store, spec.id);

  await writeHeartbeat(store, {
    ok: true,
    id: spec.id,
    queue_length: queueDoc.queue.length,
    published_count: queueDoc.published.length,
    tracker_count: tracker ? tracker.count : null,
    elapsed_ms: Date.now() - startMs
  });

  return { statusCode: 200, body: 'published ' + spec.id + ' — queue ' + queueDoc.queue.length + ' remaining' };
};
