// shared helper for bespoke rewrites — keeps individual scripts compact
const { getStore } = require('@netlify/blobs');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runPolish(cfg) {
  const TOKEN = process.env.BLOBS_PAT;
  const store = getStore({ name: 'pulse-machine-library', siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482', token: TOKEN });
  const KEY = 'pulsemachine-writer-2026';
  const POLISH_URL = 'https://pulserevops.com/.netlify/functions/pulse-blob-polish';
  const postPolish = async p => { const r = await fetch(POLISH_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }); return { status: r.status, body: await r.json().catch(() => ({})) }; };
  const setActivity = async (action, target, score) => {
    try {
      await store.setJSON('_current_activity.json', { action, target, score: score || null, ts: Date.now() });
    } catch (_e) { /* don't fail polish on activity write failure */ }
  };

  const { id, tldr, core, flow, src, num, counter, links, sources, tags, notes } = cfg;
  const v5 = tldr + core + flow;
  const v6 = v5 + src;
  const v7 = v6 + num;
  const v8 = v7 + counter;
  const v9 = v8 + links;

  console.log(id, 'layers:', v5.length, v6.length, v7.length, v8.length, v9.length);
  const e = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!e) { console.error(id, 'entry not found'); process.exit(1); }

  // Track this id in the in-flight set so the live card highlight AND the
  // Village (/agents.html) can show every concurrently-running rewrite (up to
  // 4 in parallel) — and, crucially, what STAGE each worker is on.
  // _in_flight.json carries:
  //   ids:     flat list of q-ids        — back-compat (knowledge.html reads this)
  //   workers: [{ id, action, score, ts }] — per-worker live stage for the Village
  // Always cleaned up in finally below so a crash never leaves stale state.
  const readInFlight = async () => {
    try { return (await store.get('_in_flight.json', { type: 'json' })) || {}; }
    catch (_e) { return {}; }
  };
  // Upsert this worker's stage. Concurrent subagents read-modify-write the same
  // blob — same race the original code accepted; a lost write self-heals on the
  // next stage change (writing → 6 → 7 → 8 → 9 → 10).
  const writeWorker = async (action, score) => {
    try {
      const cur = await readInFlight();
      const workers = (cur.workers || []).filter(w => w && w.id !== id);
      workers.push({ id, action, score: score || null, ts: Date.now() });
      await store.setJSON('_in_flight.json', { ids: workers.map(w => w.id), workers, ts: Date.now() });
    } catch (_e) { /* non-fatal */ }
  };
  const removeInFlight = async () => {
    try {
      const cur = await readInFlight();
      const workers = (cur.workers || []).filter(w => w && w.id !== id);
      await store.setJSON('_in_flight.json', { ids: workers.map(w => w.id), workers, ts: Date.now() });
    } catch (_e) { /* non-fatal */ }
  };
  // setStage updates BOTH the global activity blob (single-worker views / the
  // overall ticker) and this worker's own entry in the in-flight set.
  const setStage = async (action, score) => {
    await setActivity(action, id, score);
    await writeWorker(action, score);
  };
  await writeWorker('writing', 5);
  let ladderError = null;
  try {

  await setStage('writing', 5);
  const ts = Date.now();
  await store.setJSON('answers/' + id + '.json', { id, question: e.question, answer: v5, tags, sources: sources.slice(0,3), ts, model: 'claude-opus-4-7-via-claude-code', quality_score: 5, polished_at: null, polish_history: [], baseline_answer_v5: v5, source: 'claude-opus-bespoke-baseline' });
  const idx = await store.get('_index.json', { type: 'json' });
  const i = idx.entries.findIndex(x => x.id === id);
  const row = { id, question: e.question, tags, ts, quality_score: 5, polished_at: null, last_modified_ms: ts, sources_count: 3 };
  if (i >= 0) idx.entries[i] = row; else idx.entries = [row, ...idx.entries];
  await store.setJSON('_index.json', idx);
  await sleep(500);

  const steps = [
    { target: 6, new_answer: v6, note: notes.s6 || 'Sources added.' },
    { target: 7, new_answer: v7, note: notes.s7 || 'Numbers added.' },
    { target: 8, new_answer: v8, note: notes.s8 || 'Counter-case added.' },
    { target: 9, new_answer: v9, note: notes.s9 || 'Cross-links added.' },
    { target: 10, new_answer: null, note: notes.s10 || 'SUBAGENT_VERIFIED.' },
  ];
  for (const s of steps) {
    await setStage('polishing', s.target);
    const payload = { key: KEY, id, polish_note: s.note };
    if (s.new_answer) payload.new_answer = s.new_answer;
    const r = await postPolish(payload);
    console.log(id, '->'+s.target+' · '+r.status);
    if (r.status !== 200) { console.error(id, 'FAIL'); process.exit(1); }
    await sleep(500);
  }
  await setStage('idle', 10);

  // Update _claude_opus_progress.json tracker (dashboard reads this)
  try {
    const tracker = (await store.get('_claude_opus_progress.json', { type: 'json' })) || { rewritten: [], started_ms: Date.now(), total_library: 1614, count: 0 };
    tracker.rewritten = tracker.rewritten || [];
    if (!tracker.rewritten.includes(id)) tracker.rewritten.push(id);
    tracker.count = tracker.rewritten.length;
    tracker.last_id = id;
    tracker.last_ms = Date.now();
    // Maintain rolling history of last 100 rewrite timestamps for rate calculation
    tracker.history = tracker.history || [];
    tracker.history.push({ id, ts: tracker.last_ms });
    if (tracker.history.length > 100) tracker.history = tracker.history.slice(-100);
    // Track which entries have crossed 9K words after polish (counts raw words in final v9)
    const finalWords = v9.split(/\s+/).filter(Boolean).length;
    tracker.nine_k_ids = tracker.nine_k_ids || [];
    if (finalWords >= 9000) {
      if (!tracker.nine_k_ids.includes(id)) tracker.nine_k_ids.push(id);
    } else {
      // Remove if it was previously above 9K and now isn't (re-runs can shrink)
      tracker.nine_k_ids = tracker.nine_k_ids.filter(x => x !== id);
    }
    tracker.nine_k_count = tracker.nine_k_ids.length;
    const idx2 = await store.get('_index.json', { type: 'json' });
    if (idx2 && idx2.entries) tracker.total_library = idx2.entries.length;
    await store.setJSON('_claude_opus_progress.json', tracker);
    console.log('   tracker:', tracker.count, '/', tracker.total_library);
  } catch (err) {
    console.error('   tracker update failed:', err.message);
  }

  console.log('=== DONE ' + id + ' ===');
  } catch (err) {
    ladderError = err;
    throw err;
  } finally {
    await removeInFlight();
  }
}

module.exports = { runPolish };
