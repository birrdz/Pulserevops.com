// PULSE ENGINE — STEP 1+2 : visitor-interrupt check + pick this tick's slots.
// Stable script (no per-tick values baked in). Cron runs `node _engine_tick.js`,
// reads the JSON plan from stdout, then orchestrates STEP 3 sub-agents.
//
// MODEL (locked 2026-05-22):
//   * Every normal tick fields 5 INSPECTOR SLOTS (the 5 beehive inspector bees).
//   * Each slot is kind "worker" (heavy: gold-reformat / ladder climb) or "audit"
//     (light: read, fix real errors in place, flag findings). Heavy is CAPPED at 2
//     per tick so load stays ~= the old 2-inspector engine; the other >=3 slots are
//     light auditors that "quantify what needs doing" so workers reach it later.
//   * Once per hour a TOP-DETOUR repoints the heavy slots at the newest non-gold.
//   * VISITOR INTERRUPT (highest priority): if a real visitor question (vq_*) is not
//     yet gold, THIS tick drops everything — all hands gold that question now. The
//     normal audit cursor does not advance; normal duties resume next tick.
const fs = require('fs');
const { getStore } = require('@netlify/blobs');
try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

const TOP_SWEEP_MS = 3600000;   // top-detour cadence: once per hour
const HEAVY_CAP = 1;            // 1 POLISHER per tick (heavy: gold-reformat / ladder)
const SLOTS = 2;                // 1 AUDITOR (light) + 1 POLISHER (heavy) per tick
const VQ_MAX_ATTEMPTS = 3;      // stop prioritising a stubborn vq_ after this many tries
const VQ_INFLIGHT_MS = 1500000; // 25 min — a vq_ being golded is not re-interrupted

const DRY = process.argv.includes('--dry');   // --dry : compute + print plan, do NOT write status
const isGold = (e) => !!(e && e.quality_score === 10 && e.format_v === '2026-05');
const qsOf   = (e) => (e && typeof e.quality_score === 'number' ? e.quality_score : 0);
const routeOf = (e) => {
  if (isGold(e)) return 'audit';                 // already gold -> light audit only
  if (qsOf(e) >= 10) return 'gold-reformat';     // qs10 not gold -> heavy reformat
  return 'ladder';                               // qs<10 -> heavy ladder climb
};
const slot = (e, kind, extra) => Object.assign(
  { id: e.id, kind, route: routeOf(e), qs: qsOf(e), gold: isGold(e), question: e.question || '' },
  extra || {});

(async () => {
  // entries via the library-list endpoint — native fetch()+json() (no truncation),
  // cache-busted (endpoint is CDN-cached). Endpoint order is newest-first.
  const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-machine-library-list?recent=5000&_cb=' + Date.now());
  const j = await r.json();
  const entries = j.entries || [];
  if (!entries.length) throw new Error('library-list returned no entries');
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  const status = (await store.get('_audit_status.json', { type: 'json' })) || {};
  const now = Date.now();

  // ---- STEP 0: VISITOR INTERRUPT CHECK ------------------------------------
  // prune the vq_ tracking maps to currently-existing, non-gold visitor questions.
  const liveVq = {};
  for (const e of entries) if (e && typeof e.id === 'string' && e.id.startsWith('vq_') && !isGold(e)) liveVq[e.id] = e;
  const prune = (m) => { const o = {}; for (const k in (m || {})) if (liveVq[k]) o[k] = m[k]; return o; };
  const vqAttempts = prune(status.vq_attempts);
  const vqInflight = prune(status.vq_inflight);
  // endpoint is newest-first, so the first non-gold vq_ in array order is the freshest.
  // skip ones already being golded (in-flight < 25 min) or stuck past the attempt cap.
  const vqNeedsWork = entries.filter(e =>
    e && typeof e.id === 'string' && e.id.startsWith('vq_') && !isGold(e) &&
    (vqAttempts[e.id] || 0) < VQ_MAX_ATTEMPTS &&
    (now - (vqInflight[e.id] || 0)) >= VQ_INFLIGHT_MS);

  if (vqNeedsWork.length) {
    const vq = vqNeedsWork[0];
    const plan = {
      mode: 'visitor', tick_kind: 'visitor', ts: now,
      visitor_target: vq.id, visitor_route: routeOf(vq), visitor_qs: qsOf(vq),
      visitor_question: vq.question || '',
      pending_visitor_count: vqNeedsWork.length,
      slots: [slot(vq, 'worker')],
      top_sweep: false,
      cursor_after: status.last_audited_id || '',
      notes: 'VISITOR INTERRUPT — all hands gold this visitor question; normal duties paused this tick.'
    };
    if (!DRY) await store.setJSON('_audit_status.json', {
      ...status, tick_kind: 'visitor', ts: now,
      id: vq.id, id2: '', id3: '', id4: '', id5: '',
      kinds: ['worker'], w_id: vq.id, w_id2: '', visitor_target: vq.id, walk_last: status.last_audited_id || '',
      vq_attempts: { ...vqAttempts, [vq.id]: (vqAttempts[vq.id] || 0) + 1 },
      vq_inflight: { ...vqInflight, [vq.id]: now }
    });
    console.log(JSON.stringify(plan, null, 2));
    return;
  }

  // ---- STEP 1: AUDIT CURSOR WALK — next 5 entries from the cursor ----------
  let start = entries.findIndex(e => e && e.id === status.last_audited_id);
  const slots = [];
  for (let k = 1; k <= SLOTS; k++) {
    const e = entries[(start + k) % entries.length];
    if (e && e.id) slots.push(slot(e, 'audit'));
  }
  // cursor follows the AUDIT WALK — captured now, before any top-detour swap.
  const walkLast = slots.length ? slots[slots.length - 1].id : (status.last_audited_id || '');

  // ---- STEP 2: promote up to HEAVY_CAP non-gold slots to heavy "worker" ----
  let heavy = 0;
  for (const s of slots) {
    if (heavy < HEAVY_CAP && s.route !== 'audit') { s.kind = 'worker'; heavy++; }
    else s.kind = 'audit';   // light pass: review + flag findings (no heavy rewrite)
  }

  // ---- TOP-DETOUR: hourly — repoint heavy slots at the newest non-gold -----
  let topSweep = false;
  if (now - (status.last_top_sweep || 0) >= TOP_SWEEP_MS) {
    const newestNonGold = [];
    for (let k = 0; k < entries.length && newestNonGold.length < HEAVY_CAP; k++) {
      if (!isGold(entries[k])) newestNonGold.push(entries[k]);
    }
    if (newestNonGold.length) {
      topSweep = true;
      const heavyIdx = slots.map((s, i) => s.kind === 'worker' ? i : -1).filter(i => i >= 0);
      newestNonGold.forEach((e, n) => {
        const t = slot(e, 'worker', { top: true });
        if (n < heavyIdx.length) slots[heavyIdx[n]] = t;
        else if (slots.length < SLOTS) slots.push(t);
        else { slots[SLOTS - 1] = t; }   // ensure both top targets get a slot
      });
    }
  }

  const used = slots.slice(0, SLOTS);
  const ids = ['', '', '', '', ''], kinds = [];
  used.forEach((s, i) => { ids[i] = s.id; kinds[i] = s.kind; });
  const workerIds = used.filter(s => s.kind === 'worker').map(s => s.id);

  if (!DRY) await store.setJSON('_audit_status.json', {
    ...status, tick_kind: 'audit', ts: now,
    id: ids[0], id2: ids[1], id3: ids[2], id4: ids[3], id5: ids[4],
    kinds, w_id: workerIds[0] || '', w_id2: workerIds[1] || '', visitor_target: '',
    walk_last: walkLast,
    vq_attempts: vqAttempts, vq_inflight: vqInflight   // write back pruned maps
  });
  console.log(JSON.stringify({
    mode: 'normal', tick_kind: 'audit', ts: now, visitor_target: null,
    slots: used, top_sweep: topSweep,
    cursor_before: status.last_audited_id || '', cursor_after: walkLast,
    heavy_count: used.filter(s => s.kind === 'worker').length,
    audit_count: used.filter(s => s.kind === 'audit').length,
    audited_count: (typeof status.audited_count === 'number' ? status.audited_count : 0),
    notes: topSweep ? 'Normal tick + hourly top-detour (heavy slot on newest non-gold).'
                    : 'Normal tick: 1 polisher + 1 auditor.'
  }, null, 2));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
