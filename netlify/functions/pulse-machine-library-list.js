// ════════════════════════════════════════════════════════════════════════
// pulse-machine-library-list — public read-only browse endpoint for the
// growing knowledge library. Powers the /knowledge/ hub page.
//
// GET ?recent=N            → top N most recent answers, summary fields only
// GET ?newOnly=1&days=7    → only entries with ts within N days of newest index ts (/recent page)
// GET ?since=<ms>          → only entries with ts >= since (epoch ms)
// GET ?sort=ts             → pure ts descending (skip q/vq pin reorder)
// GET ?id=<id>             → full answer for one entry (question, answer, sources, tags)
// GET ?tag=<tag>&recent=N  → recent N entries that include the given tag
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const { normalizeQuestion, visitorQuestionId } = require('./lib/visitor-question-id');

/** Safe numeric ts — index rows may carry ISO strings or junk that poison Math.max → NaN. */
function entryTs(e) {
  if (!e) return 0;
  for (const k of ['ts', 'last_modified_ms', 'generated_at', 'created_at']) {
    const n = Number(e[k]);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}

function pillarOfEntryId(id) {
  const m = String(id || '').match(/^([a-z]+)/);
  return m ? m[1] : '';
}

function mosaicImgKeyEntry(e) {
  const u = String((e && e.img) || '').replace(/\?.*$/, '').toLowerCase();
  return u || '';
}

/** Mixed homepage mosaic: cap tl + dedupe face URLs so CRO volume cannot dominate. */
function balanceMixedMosaicEntries(entries, cap) {
  cap = Math.max(1, Math.min(parseInt(cap, 10) || 500, 5000));
  const byp = {};
  for (const e of entries || []) {
    if (!e || !e.id) continue;
    const p = pillarOfEntryId(e.id);
    if (p === 'tl' && mosaicImgKeyEntry(e) && /\/assets\/cro-cover-/.test(mosaicImgKeyEntry(e))) continue;
    (byp[p] = byp[p] || []).push(e);
  }
  const pills = Object.keys(byp);
  if (pills.length < 2) return (entries || []).slice(0, cap);
  for (let i = pills.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pills[i], pills[j]] = [pills[j], pills[i]];
  }
  const maxDefault = Math.max(6, Math.ceil(cap / Math.max(pills.length, 8)));
  const maxFor = (p) => (p === 'tl' ? Math.min(3, Math.max(2, Math.floor(cap / 120))) : maxDefault);
  for (const p of pills) {
    byp[p].sort((a, b) => entryTs(b) - entryTs(a));
    const m = maxFor(p);
    if (byp[p].length > m) byp[p] = byp[p].slice(0, m);
  }
  const out = [];
  const cur = {};
  const seenImg = new Set();
  pills.forEach((p) => { cur[p] = 0; });
  while (out.length < cap) {
    let added = false;
    for (const p of pills) {
      if (out.length >= cap) break;
      const lst = byp[p];
      while (cur[p] < lst.length) {
        const row = lst[cur[p]++];
        const ik = mosaicImgKeyEntry(row);
        if (ik && seenImg.has(ik)) continue;
        if (ik) seenImg.add(ik);
        out.push(row);
        added = true;
        break;
      }
    }
    if (!added) break;
  }
  return out;
}

function parseIdParts(id) {
  const m = String(id || '').match(/^([a-z]{2,3})(\d+)$/i);
  if (!m) return null;
  return { prefix: m[1].toLowerCase(), num: parseInt(m[2], 10), pad: m[2].length };
}

/** Blobs written by generateOne may exist before _index.json is updated — probe ids just above each prefix max. */
async function mergeOrphanBlobs(store, entries, opts) {
  if (!opts || (!opts.newOnly && !opts.pillar)) return entries;
  if (opts.mini) return entries;
  const seen = new Set((entries || []).map(e => e && e.id).filter(Boolean));
  const maxByPrefix = {};
  for (const e of entries || []) {
    const p = parseIdParts(e.id);
    if (!p) continue;
    if (!maxByPrefix[p.prefix] || p.num > maxByPrefix[p.prefix].num) maxByPrefix[p.prefix] = p;
  }
  const pillarKey = opts.pillar ? String(opts.pillar).toLowerCase().trim() : '';
  const pillarPrefix = ({ ce: 'ce', 'current-events': 'ce' }[pillarKey] || pillarKey.replace(/[^a-z]/g, ''));
  if (pillarPrefix && !maxByPrefix[pillarPrefix]) {
    maxByPrefix[pillarPrefix] = { prefix: pillarPrefix, num: 0, pad: 4 };
  }
  const prefixes = pillarPrefix ? [pillarPrefix] : Object.keys(maxByPrefix);
  const probes = [];
  for (const prefix of prefixes) {
    const info = maxByPrefix[prefix] || { prefix, num: 0, pad: 4 };
    for (let i = 1; i <= 12; i++) {
      const id = info.prefix + String(info.num + i).padStart(info.pad, '0');
      if (!seen.has(id)) probes.push(id);
    }
  }
  const orphans = [];
  for (const id of probes.slice(0, 24)) {
    try {
      const blob = await store.get('answers/' + id.replace(/[^\w-]/g, '') + '.json', { type: 'json' });
      if (!blob || !blob.question) continue;
      const ans = String(blob.answer || '');
      if (ans.length < 200) continue;
      let qs = typeof blob.quality_score === 'number' ? blob.quality_score : null;
      if (qs == null && blob.quality) {
        const sm = String(blob.quality).match(/^(\d+)/);
        if (sm) qs = parseInt(sm[1], 10);
      }
      if (qs == null || qs < 13) continue;
      if (!blob.img && !blob.cover_src && !blob.images_verified_at && !blob.cc_signed) continue;
      const ts = entryTs(blob);
      orphans.push({
        id: blob.id || id,
        question: blob.question,
        tags: (function () {
          const p = parseIdParts(id)?.prefix || 'q';
          let tags = Array.isArray(blob.tags) && blob.tags.length ? blob.tags.slice() : [p];
          if (p === 'ce') ['current-events', 'current-events-2027', 'pulse-news'].forEach(t => { if (!tags.includes(t)) tags.push(t); });
          if (!tags.includes(p)) tags.unshift(p);
          if ((blob.pipeline_origin === 'generate' || blob.from_pipeline_generator || blob.pending === false) && !tags.includes('pulse-recent')) tags.push('pulse-recent');
          return tags;
        })(),
        ts: ts || Date.now(),
        img: blob.img || null,
        cover_src: blob.cover_src || null,
        quality_score: qs,
        pending: false,
        has_answer: true,
        source: blob.source || 'orphan-probe',
        was_indexed_at: blob.was_indexed_at || null,
      });
    } catch (_e) {}
  }
  if (!orphans.length) return entries;
  // Persist orphans into _index.json so pillar/recent pages stay warm on next request.
  try {
    const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    let touched = false;
    for (const row of orphans.slice(0, 8)) {
      if ((idx.entries || []).some(e => e && e.id === row.id)) continue;
      idx.entries.unshift({
        id: row.id,
        question: row.question,
        tags: row.tags,
        ts: row.ts,
        img: row.img,
        cover_src: row.cover_src,
        quality_score: row.quality_score,
        pending: false,
        was_indexed_at: new Date().toISOString(),
      });
      touched = true;
      try {
        const blob = await store.get('answers/' + row.id + '.json', { type: 'json' });
        if (blob && blob.pending) {
          await store.setJSON('answers/' + row.id + '.json', Object.assign({}, blob, {
            pending: false,
            was_indexed_at: blob.was_indexed_at || new Date().toISOString(),
          }));
        }
      } catch (_e2) {}
    }
    if (touched) {
      idx.entries.sort((a, b) => entryTs(b) - entryTs(a));
      await store.setJSON('_index.json', idx);
    }
  } catch (_e) {}
  const merged = orphans.concat(entries || []);
  const dedup = [];
  const ids = new Set();
  for (const e of merged) {
    if (!e || !e.id || ids.has(e.id)) continue;
    ids.add(e.id);
    dedup.push(e);
  }
  return dedup;
}

function mapListEntry(e) {
  return {
    id: e.id,
    question: e.question,
    // Cap tags in the LIST projection. Some pillars (e.g. tl/tools) carry a
    // 60+ keyword SEO block per entry; returning all of them for an entire
    // pillar (655 tl rows) blew past Netlify's 6 MB function response limit
    // (Function.ResponseSizeTooLarge) and the pillar grid rendered EMPTY.
    // Functional + pillar + sports tags always lead the array, so the first
    // ~20 preserve client search / sports tag-filter; SEO keywords live on the
    // rendered entry page meta (from the blob), not this index API.
    tags: (e.tags || []).slice(0, 12),
    img: e.img || null,   // face-card hero URL (stamped into the index) — powers the mosaic tile boxes
    cover_src: e.cover_src || null,
    face_title_baked: !!e.face_title_baked,
    fully_fixed_visual: !!e.fully_fixed_visual,
    ts: e.ts,
    polished_at: e.polished_at || null,
    quality_score: typeof e.quality_score === 'number' ? e.quality_score : 5,
    was_indexed_at: e.was_indexed_at || null,
    pending: !!e.pending,
    has_answer: e.has_answer !== false,
    source: e.source || null,
    // pinned_until: when API-direct visitor answers land, they pin to top
    // of the library list with a "FRESH" pill for a 24h window. Frontend
    // uses this to render a distinct border-color + tag.
    pinned_until: e.pinned_until || null,
  };
}

/** Visitor queue ghosts only when there is not yet a published answer blob. */
async function mergeVisitorQueue(store, entries, limit) {
  const capped = Math.min(limit, 25000);
  const indexIds = new Set();
  const indexNormQ = new Set();
  for (const e of entries) {
    if (e && e.id) indexIds.add(e.id);
    const n = normalizeQuestion(e && e.question);
    if (n) indexNormQ.add(n);
  }

  let queue = { items: [] };
  try {
    queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
  } catch (_e) {}

  const ghosts = [];
  const items = queue.items || [];
  for (let i = 0; i < items.length && ghosts.length < 48; i++) {
    const item = items[i];
    const q = item && item.q ? String(item.q).trim() : '';
    if (!q) continue;
    const id = item.vq_id || visitorQuestionId(q);
    if (indexIds.has(id)) continue;
    const norm = normalizeQuestion(q);
    if (norm && indexNormQ.has(norm)) continue;

    let hasAnswer = false;
    try {
      const blob = await store.get('answers/' + id + '.json', { type: 'json' });
      hasAnswer = !!(blob && blob.answer && String(blob.answer).trim().length > 200);
    } catch (_e) {}
    if (hasAnswer) continue;

    ghosts.push({
      id,
      question: q,
      tags: ['visitor-asked'],
      ts: item.ts || Date.now(),
      pending: true,
      has_answer: false,
      source: 'visitor',
      quality_score: 5,
    });
    indexIds.add(id);
    if (norm) indexNormQ.add(norm);
  }

  const published = entries.map((e) => ({
    ...e,
    pending: false,
    has_answer: true,
    source: e.source || 'library',
  }));

  // Published newest-first on page 1; visitor ghosts after (not blocking q####).
  return published.concat(ghosts).slice(0, capped);
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=60',
};

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) {
    try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; }
  }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: CORS, body: 'GET only' };

  const store = initStore();
  if (!store) {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'library not yet wired' }),
    };
  }

  const params = event.queryStringParameters || {};

  // ── Staging drafts list (Claude-Code review pipeline) ──────────────
  // GET ?staging=1               → list pending drafts (id, tag, title, ts)
  // GET ?staging=1&id=<draft-id> → full draft body
  if (params.staging) {
    try {
      if (params.id) {
        const d = await store.get('staging/' + String(params.id).replace(/[^\w-]/g, '') + '.json', { type: 'json' });
        if (!d) return { statusCode: 404, headers: CORS, body: 'not found' };
        return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(d) };
      }
      const sIdx = (await store.get('_staging_index.json', { type: 'json' })) || { drafts: [] };
      const pending = (sIdx.drafts || []).filter(d => !d.status || d.status === 'pending').slice(0, 60);
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true, total_drafts: (sIdx.drafts || []).length, pending: pending.length, drafts: pending }),
      };
    } catch (e) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'staging err' }) };
    }
  }

  // ── Site audits list (daily Sonnet auditor pipeline) ───────────────
  // GET ?audits=1               → list pending audits (id, ts, day, rec_count, status)
  // GET ?audits=1&id=<audit-id> → full audit with all recommendations
  if (params.audits) {
    try {
      if (params.id) {
        const a = await store.get('audits/' + String(params.id).replace(/[^\w-]/g, '') + '.json', { type: 'json' });
        if (!a) return { statusCode: 404, headers: CORS, body: 'not found' };
        return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify(a) };
      }
      const aIdx = (await store.get('_audits_index.json', { type: 'json' })) || { audits: [] };
      const pending = (aIdx.audits || []).filter(a => !a.status || a.status === 'pending').slice(0, 30);
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true, total_audits: (aIdx.audits || []).length, pending: pending.length, audits: pending }),
      };
    } catch (e) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'audits err' }) };
    }
  }

  // ── Status-only fetch (cheap probe for the spend dashboard) ────────
  if (params.status) {
    try {
      const meta = (await store.get('_meta.json', { type: 'json' })) || null;
      const idx  = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
      const queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
      // Use NEWEST-entry-ts as "now" instead of server clock, since the server
      // and the workers that write entries can drift relative to each other
      // (especially when crons are disabled and writes come from local lab
      // scripts on a different clock). This makes "today" track the data,
      // not the server, so a 35-entry burst isn't invisible to the dashboard.
      const allEntries = idx.entries || [];
      const newestTs = allEntries.reduce((m, e) => Math.max(m, entryTs(e)), 0);
      const now = newestTs > 0 ? newestTs : Date.now();
      const todayStartMs = (function(){
        if (newestTs <= 0) {
          const td = new Date(); td.setUTCHours(0,0,0,0);
          return td.getTime();
        }
        const d = new Date(newestTs);
        d.setUTCHours(0,0,0,0);
        return d.getTime();
      })();
      const oneHourAgo = now - 3600000;
      const todayCount = allEntries.filter(e => (e.ts || 0) >= todayStartMs).length;
      const lastHourCount = allEntries.filter(e => (e.ts || 0) >= oneHourAgo).length;

      // Run-rate per hour — based on the most recent 12 entries' timestamp spread.
      // If fewer than 2 timestamped recent entries, fall back to lastHourCount.
      const recentTs = allEntries
        .map(e => e.ts || 0)
        .filter(t => t > 0 && t <= now)
        .sort((a, b) => b - a)
        .slice(0, 12);
      let runRatePerHour = lastHourCount;
      if (recentTs.length >= 2) {
        const spanMs = recentTs[0] - recentTs[recentTs.length - 1];
        if (spanMs > 0) {
          runRatePerHour = Math.round(((recentTs.length - 1) * 3600000 / spanMs) * 10) / 10;
        }
      }

      // Score breakdown — how many entries sit at each level
      const scoreBreakdown = { 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };
      let indexedCount = 0;
      let seoOptimizedCount = 0;
      let freshTenCount = 0;  // 10/10 entries polished in the last 30 days
      const thirtyDaysAgo = Date.now() - (30 * 86400000);
      for (const e of allEntries) {
        const s = typeof e.quality_score === 'number' ? e.quality_score : 5;
        const bucket = Math.max(5, Math.min(10, Math.round(s)));
        scoreBreakdown[bucket] = (scoreBreakdown[bucket] || 0) + 1;
        if (e.was_indexed_at) indexedCount++;
        // "SEO optimized" = polished to 10/10 AND indexed (pinged via IndexNow).
        // Both conditions = ready for Google.
        if (s >= 10 && e.was_indexed_at) seoOptimizedCount++;
        // "Fresh 10/10" = polished within the last 30 days. Google rewards
        // recency; entries last touched >30d ago risk ranking decay.
        if (s >= 10 && (e.polished_at || 0) >= thirtyDaysAgo) freshTenCount++;
      }
      const polishingQueueDepth = allEntries.length - (scoreBreakdown[10] || 0);

      // Polish target — the entry the loop is currently working on. Sequential
      // mode: highest q-id with score 6-9 (in-progress); fallback to highest
      // q-id at 5/10. Used by the assembly line and the targeted IndexNow ping.
      let polishTargetId = null;
      let polishTargetScore = null;
      let polishTargetQuestion = null;
      const inProgress = allEntries.filter(e => {
        const s = typeof e.quality_score === 'number' ? e.quality_score : 5;
        return /^q\d+$/.test(e.id) && s > 5 && s < 10;
      }).sort((a, b) => parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10));
      if (inProgress.length > 0) {
        polishTargetId = inProgress[0].id;
        polishTargetScore = inProgress[0].quality_score;
        polishTargetQuestion = inProgress[0].question;
      } else {
        const fives = allEntries.filter(e => {
          const s = typeof e.quality_score === 'number' ? e.quality_score : 5;
          return /^q\d+$/.test(e.id) && s === 5;
        }).sort((a, b) => parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10));
        if (fives.length > 0) {
          polishTargetId = fives[0].id;
          polishTargetScore = 5;
          polishTargetQuestion = fives[0].question;
        }
      }

      // Polish events in the last hour (logged by pulse-blob-polish)
      let polishLastHour = 0;
      let polishRatePerHour = 0;
      let verifiedLastHour = 0;
      let verifiedRatePerHour = 0;
      let polishEventsSinceLastWrite = 0;
      let lastPolishMs = 0;
      try {
        const evs = (await store.get('_polish_events.json', { type: 'json' })) || { events: [] };
        const oneHr = now - 3600000;
        const recent = (evs.events || []).filter(ev => (ev.ts || 0) >= oneHr);
        polishLastHour = recent.length;
        verifiedLastHour = recent.filter(ev => ev.to === 10).length;
        const fourHr = now - 4 * 3600000;
        const recent4 = (evs.events || []).filter(ev => (ev.ts || 0) >= fourHr);
        polishRatePerHour = Math.round((recent4.length / 4) * 10) / 10;
        verifiedRatePerHour = Math.round((recent4.filter(ev => ev.to === 10).length / 4) * 10) / 10;
        polishEventsSinceLastWrite = (evs.events || [])
          .filter(ev => (ev.ts || 0) > newestTs)
          .length;
        lastPolishMs = (evs.events || []).reduce((m, ev) => Math.max(m, ev.ts || 0), 0);
      } catch (_e) {}

      // SEO/index events since last write — drives the 6-slot loop pattern
      // (write-polish-polish-seo-seo-polish, repeat).
      let seoEventsSinceLastWrite = 0;
      let lastSeoMs = 0;
      try {
        const sevs = (await store.get('_seo_events.json', { type: 'json' })) || { events: [] };
        seoEventsSinceLastWrite = (sevs.events || [])
          .filter(ev => (ev.ts || 0) > newestTs)
          .length;
        lastSeoMs = (sevs.events || []).reduce((m, ev) => Math.max(m, ev.ts || 0), 0);
      } catch (_e) {}

      // Compute next slot from the 6-slot pattern.
      // Cycle: WRITE → POLISH → POLISH → SEO → SEO → POLISH → (repeat)
      // After WRITE: P=0, S=0    → next = POLISH
      // After 1 polish: P=1, S=0 → next = POLISH
      // After 2 polish: P=2, S=0 → next = SEO
      // After 2P 1S: P=2, S=1    → next = SEO
      // After 2P 2S: P=2, S=2    → next = POLISH
      // After 3P 2S: P=3, S=2    → next = WRITE
      // 5-slot cycle: WRITE → POLISH → POLISH → INDEX → INDEX → (next WRITE)
      // Variable cadences: W→P 5min, P→P 5min, P→I 2min, I→I 2min, I→W 1min
      let nextSlot = 'POLISH';
      let currentSlot = 1; // 1..5 — slot just completed
      let nextDelaySeconds = 300;
      const P = polishEventsSinceLastWrite;
      const S = seoEventsSinceLastWrite;
      if (P >= 2 && S >= 2)        { nextSlot = 'WRITE';  nextDelaySeconds = 60;  currentSlot = 5; }
      else if (P >= 2 && S === 1)  { nextSlot = 'INDEX';  nextDelaySeconds = 120; currentSlot = 4; }
      else if (P >= 2 && S === 0)  { nextSlot = 'INDEX';  nextDelaySeconds = 120; currentSlot = 3; }
      else if (P === 1 && S === 0) { nextSlot = 'POLISH'; nextDelaySeconds = 300; currentSlot = 2; }
      else                         { nextSlot = 'POLISH'; nextDelaySeconds = 300; currentSlot = 1; }

      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0' },
        body: JSON.stringify({
          ok: true,
          library_total: allEntries.length,
          added_today:   todayCount,
          last_hour:     lastHourCount,
          run_rate_per_hour: runRatePerHour,
          queue_depth:   (queue.items || []).length,
          score_breakdown: scoreBreakdown,
          polishing_queue_depth: polishingQueueDepth,
          ten_of_ten_count: scoreBreakdown[10] || 0,
          indexed_count: indexedCount,
          // Secret-Agent audit progress (lab/audit-all-tens.js writes this blob;
          // cycle's self-heal also updates it incrementally as it scans).
          audit_progress: await (async () => {
            try {
              const a = await store.get('_audit_progress.json', { type: 'json' });
              return a || { total_tens: 0, audited: 0, demoted: 0, kept: 0, in_progress: false, last_run_ms: 0 };
            } catch (_e) { return { total_tens: 0, audited: 0, demoted: 0, kept: 0, in_progress: false, last_run_ms: 0 }; }
          })(),
          // Anthropic Max-plan pace bars — counts of Claude-Opus-authored
          // 10/10 entries inside rolling windows. NOT actual API meter data
          // (Anthropic doesn't expose Max-plan usage), just library throughput
          // as a proxy. Soft caps mirror the recommended 8/hr safe rate so
          // the bars hit ~100% only when you're at the sustained ceiling.
          anthropic_pace: (function(){
            const nowMs = Date.now();
            const cutoffs = {
              hour:  nowMs - 1 * 3600000,
              day:   nowMs - 24 * 3600000,
              week:  nowMs - 7 * 24 * 3600000,
              month: nowMs - 30 * 24 * 3600000,
            };
            const caps = { hour: 8, day: 128, week: 900, month: 3000 };
            const tens = allEntries.filter(e => (e.quality_score || 0) >= 10);
            const cnt = w => tens.filter(e => (e.last_modified_ms || e.ts || 0) >= cutoffs[w]).length;
            return {
              hour:  { count: cnt('hour'),  cap: caps.hour  },
              day:   { count: cnt('day'),   cap: caps.day   },
              week:  { count: cnt('week'),  cap: caps.week  },
              month: { count: cnt('month'), cap: caps.month },
            };
          })(),
          // Claude Opus rewrite progress — bespoke library upgrades authored
          // by Claude Opus 4.7 via the owner's Claude Code session ($200/mo
          // Max plan). Tracked in _claude_opus_progress.json, updated each
          // time lab/save-claude-opus-rewrite.js commits a new entry.
          claude_opus_progress: await (async () => {
            try {
              const c = await store.get('_claude_opus_progress.json', { type: 'json' });
              if (!c) return { count: 0, total_library: allEntries.length, last_id: null, last_ms: 0, rewrites_per_hour: 0, rewrites_last_hour: 0 };
              // Compute rolling rewrites/hour from history array (or fall back to overall avg)
              const now = Date.now();
              const hourAgo = now - 60 * 60 * 1000;
              const history = Array.isArray(c.history) ? c.history : [];
              const recentRewrites = history.filter(h => h && h.ts && h.ts >= hourAgo).length;
              let rewritesPerHour = recentRewrites;
              // If history has < 60 min of data, extrapolate from elapsed time
              if (history.length > 0 && history.length < 10) {
                const earliestTs = Math.min(...history.map(h => h.ts || now));
                const elapsedHours = Math.max((now - earliestTs) / (60 * 60 * 1000), 0.1);
                rewritesPerHour = +(history.length / elapsedHours).toFixed(1);
              } else if (history.length === 0 && c.started_ms && c.count > 0) {
                const elapsedHours = Math.max((now - c.started_ms) / (60 * 60 * 1000), 0.1);
                rewritesPerHour = +(c.count / elapsedHours).toFixed(1);
              }
              return Object.assign({}, c, {
                rewrites_per_hour: rewritesPerHour,
                rewrites_last_hour: recentRewrites,
                nine_k_count: c.nine_k_count || 0,
                nine_k_ids: undefined, // don't ship the whole array to client
              });
            } catch (_e) { return { count: 0, total_library: allEntries.length, last_id: null, last_ms: 0, rewrites_per_hour: 0, rewrites_last_hour: 0 }; }
          })(),
          // Live "Hot Now" activity — written by polish-helper.js at each step.
          // Stale entries (>5 min) get downgraded to idle by the client.
          current_activity: await (async () => {
            try {
              const a = await store.get('_current_activity.json', { type: 'json' });
              return a || null;
            } catch (_e) { return null; }
          })(),
          // Concurrent in-flight rewrites — written by polish-helper.js.
          // Up to 4 when running parallel subagents.
          //   ids:     flat list — drives the live green card highlight on
          //            knowledge.html so the entries being polished light up.
          //   workers: [{ id, action, score, ts }] — per-worker live stage,
          //            drives the Village (/agents.html) so each critter walks
          //            the building matching ITS OWN job.
          in_flight: await (async () => {
            const ACTIVE_MS = 15 * 60 * 1000;
            const now = Date.now();
            const isActive = (w) =>
              w && w.id && (w.action === 'polishing' || w.action === 'writing') && now - (w.ts || 0) < ACTIVE_MS;
            try {
              const a = await store.get('_in_flight.json', { type: 'json' }) || {};
              let workers = (a.workers || []).filter(isActive);
              const activity = await store.get('_current_activity.json', { type: 'json' });
              if (
                activity &&
                activity.target &&
                (activity.action === 'polishing' || activity.action === 'writing') &&
                now - (activity.ts || 0) < ACTIVE_MS &&
                !workers.some((w) => w.id === activity.target)
              ) {
                workers = workers.concat([{
                  id: activity.target,
                  action: activity.action,
                  score: activity.score ?? null,
                  ts: activity.ts || now,
                }]);
              }
              workers = workers.slice(0, 8);
              return { ids: workers.map((w) => w.id), workers, ts: a.ts || now };
            } catch (_e) { return { ids: [], workers: [], ts: 0 }; }
          })(),
          seo_optimized_count: seoOptimizedCount,
          fresh_ten_count: freshTenCount,
          polish_last_hour: polishLastHour,
          polish_rate_per_hour: polishRatePerHour,
          verified_last_hour: verifiedLastHour,
          verified_rate_per_hour: verifiedRatePerHour,
          last_write_ms: newestTs,
          last_polish_ms: lastPolishMs,
          last_seo_ms: lastSeoMs,
          polish_events_since_last_write: polishEventsSinceLastWrite,
          seo_events_since_last_write: seoEventsSinceLastWrite,
          next_slot: nextSlot,
          current_slot: currentSlot,
          next_delay_seconds: nextDelaySeconds,
          polish_target_id: polishTargetId,
          polish_target_score: polishTargetScore,
          polish_target_question: polishTargetQuestion,
          loop_cadence_seconds: nextDelaySeconds,
          loop_pattern: ['WRITE','POLISH','POLISH','INDEX','INDEX'],
          loop_delays_seconds: [300, 300, 120, 120, 60],
          spend_today:   meta && (meta.spend_today || 0),
          runs_today:    meta && (meta.runs_today  || 0),
          last_run_ms:   meta && meta.last_run,
          last_question: meta && meta.last_question,
          day:           meta && meta.day,
        }),
      };
    } catch (e) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'status err' }) };
    }
  }

  // ── Single-entry fetch ──────────────────────────────────────────────
  if (params.id) {
    try {
      const entry = await store.get('answers/' + String(params.id).replace(/[^\w-]/g, '') + '.json', { type: 'json' });
      if (!entry) return { statusCode: 404, headers: CORS, body: 'not found' };
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      };
    } catch (e) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'fetch err' }) };
    }
  }

  // ── List recent (with optional tag filter) ──────────────────────────
  // Cap raised to 12000 so /knowledge.html can render the full library
  // (was 60 — caused empty grid when all top-60 were today's entries).
  const limit = Math.max(1, Math.min(40000, parseInt(params.recent, 10) || 24));
  const tag   = params.tag ? String(params.tag).toLowerCase().trim() : null;
  // pillar filter: training → only st#### entries, kpi → only ik#### entries,
  // knowledge → only q#### entries. Filters by ID prefix because that's
  // authoritative regardless of tag drift.
  const pillar = params.pillar ? String(params.pillar).toLowerCase().trim() : null;
  const PILLAR_ID_RX = {
    // named aliases (legacy)
    training:  /^st\d+$/,
    kpi:       /^ik\d+$/,
    knowledge: /^q\d+$/,
    tech:      /^tk\d+$/,
    graphics:  /^gb\d+$/,
    book:      /^bs\d+$/,
    review:    /^er\d+$/,
    revarch:   /^ra\d+$/,
    gtm:       /^gp\d+$/,
    // short codes (what window.PILLAR_DEFAULT / pillar-page.js sends)
    q:/^q\d+$/, st:/^st\d+$/, ik:/^ik\d+$/, tk:/^tk\d+$/, gb:/^gb\d+$/, bs:/^bs\d+$/,
    er:/^er\d+$/, ra:/^ra\d+$/, gp:/^gp\d+$/, fr:/^fr\d+$/, ca:/^ca\d+$/, tn:/^tn\d+$/,
    sc:/^sc\d+$/, nl:/^nl\d+$/, dn:/^dn\d+$/, bt:/^bt\d+$/, mv:/^mv\d+$/, wl:/^wl\d+$/,
    dr:/^dr\d+$/, tv:/^tv\d+$/, rs:/^rs\d+$/, es:/^es\d+$/, cl:/^cl\d+$/, lv:/^lv\d+$/,
    ev:/^ev\d+$/, sy:/^sy\d+$/, ga:/^ga\d+$/, gm:/^gm\d+$/, sk:/^sk\d+$/, sp:/^sp\d+$/,
    tl:/^tl\d+$/, cg:/^cg\d+$/, co:/^co\d+$/, ai:/^ai\d+$/, bo:/^bo\d+$/, cd:/^cd\d+$/, aq:/^aq\d+$/, hf:/^hf\d+$/, tc:/^tc\d+$/, ce:/^ce\d+$/,
    pt:/^pt\d+$/, sw:/^sw\d+$/, ed:/^ed\d+$/, kw:/^kw\d+$/, cr:/^cr\d+$/, fs:/^fs\d+$/,
    'kory-white-projects':/^kw\d+$/, crabbing:/^cr\d+$/, fishing:/^fs\d+$/,
    // SEG-NAME aliases — the /style, /cars … hubs send the URL seg, not the prefix.
    // Without these the filter no-ops and the hub falls back to the byte-trimmed global
    // list, capping the pillar count (e.g. /style showed 341 of 870). Map seg → prefix rx.
    style:/^sy\d+$/, cars:/^ca\d+$/, aquariums:/^aq\d+$/, boats:/^bt\d+$/, collectibles:/^co\d+$/,
    franchises:/^fr\d+$/, telco:/^tc\d+$/, pets:/^pt\d+$/, software:/^sw\d+$/, tools:/^tl\d+$/,
    coaching:/^cg\d+$/, 'tech-stacks':/^tk\d+$/, graphics:/^gb\d+$/, 'sales-book-summaries':/^bs\d+$/,
    'electronic-reviews':/^er\d+$/, 'revenue-architecture':/^ra\d+$/, 'go-to-market-playbooks':/^gp\d+$/,
    'ai-infrastructure':/^ai\d+$/, 'sales-trainings':/^st\d+$/, 'industry-kpis':/^ik\d+$/,
    schools:/^sc\d+$/, towns:/^tn\d+$/, nightlife:/^nl\d+$/, dining:/^dn\d+$/, movies:/^mv\d+$/,
    wellness:/^wl\d+$/, drills:/^dr\d+$/, travel:/^tv\d+$/, resorts:/^rs\d+$/, estates:/^es\d+$/,
    clubs:/^cl\d+$/, living:/^lv\d+$/, events:/^ev\d+$/, skills:/^sk\d+$/, gatherings:/^ga\d+$/,
    gaming:/^gm\d+$/, buildouts:/^bo\d+$/, 'highschool-football-recruiting':/^hf\d+$/,
    'current-events':/^ce\d+$/,
  };
  // MERGED CATEGORIES (owner IA redesign 2026-06-23): collapse the 37 pillars into
  // a handful of "My Thoughts on…" categories. ?cat=<key> returns all member pillars.
  const CATEGORY_PILLARS = {
    revenue:  ['q','ra','gp'],
    coaching: ['st','cg'],
    metrics:  ['ik'],
    ai:       ['sw','ai','tk'],
    gear:     ['tl','er'],
    books:    ['bs'],
    travel:   ['rs','tv'],
    nightlife:['dn','nl','cl','ev','ga'],
    living:   ['tn','lv','sc'],
    property: ['es','bo','fr'],
    machines: ['ca','bt'],
    pets:     ['pt','aq'],
    style:    ['sy','wl'],
    culture:  ['mv','gm','co','sp','sk','hf'],
    editorials:['ed'],
  };
  const cat = params.cat ? String(params.cat).toLowerCase().trim() : null;
  let meta    = null;

  try {
    const idx = (await store.get('_index.json', { type: 'json', consistency: 'strong' })) || { entries: [] };
    let entries = (idx.entries || []).slice();
    const sortTsEarly = params.sort === 'ts';
    const newOnlyEarly = params.newOnly === '1' || params.newonly === '1';
    entries = await mergeOrphanBlobs(store, entries, {
      newOnly: newOnlyEarly,
      pillar,
      mini: params.mini === '1' || params.mini === 'true',
    });
    if (tag) entries = entries.filter(e => Array.isArray(e.tags) && e.tags.includes(tag));
    if (cat === 'editorials' || cat === 'mythoughts' || cat === 'thoughts') {
      // MY THOUGHTS (owner 2026-06-25): the single home, and FOR NOW it surfaces the
      // WHOLE library (everything is searchable) — entries get upgraded to long-form
      // stories in place over time. No filter: leave `entries` as the full set; the
      // page loads it in mini mode and runs predictive search client-side.
      /* intentionally no filter — show everything */
    } else if (cat && CATEGORY_PILLARS[cat]) {
      const rxs = CATEGORY_PILLARS[cat].map(p => PILLAR_ID_RX[p]).filter(Boolean);
      entries = entries.filter(e => e && e.id && rxs.some(rx => rx.test(e.id)));
    } else if (pillar && PILLAR_ID_RX[pillar]) {
      entries = entries.filter(e => e && e.id && PILLAR_ID_RX[pillar].test(e.id));
      // Trainings pillar: exclude NIL-themed st#### entries (the old st1-st140
      // batch was college-NIL "GTM playbook" content tagged nil/nil-gtm; the
      // sales-trainings page is for generic 1-hr sales meetings only).
      if (pillar === 'training' || pillar === 'st') {
        entries = entries.filter(e => {
          const tags = Array.isArray(e.tags) ? e.tags : [];
          if (tags.includes('nil') || tags.includes('nil-gtm') || tags.includes('nil-2027')) return false;
          return true;
        });
      }
    }
    const sortTs = params.sort === 'ts';
    const newOnly = params.newOnly === '1' || params.newonly === '1';
    const sinceParam = parseInt(params.since, 10) || 0;
    let newSinceMs = null;

    if (sortTs) {
      entries.sort((a, b) => entryTs(b) - entryTs(a));
    } else {
      // Sort priority (top → bottom):
      //   1. pinned_until > now (fresh API-direct visitor answers — 24h window)
      //   2. visitor-asked vq_* IDs (newest-ts first)
      //   3. q#### IDs (newest numeric first)
      //   4. everything else by ts desc
      const nowSort = Date.now();
      entries.sort((a, b) => {
        const aPinned = (a.pinned_until || 0) > nowSort;
        const bPinned = (b.pinned_until || 0) > nowSort;
        if (aPinned && bPinned) return (b.pinned_until || 0) - (a.pinned_until || 0);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        const aIsVQ = /^vq_/i.test(a.id);
        const bIsVQ = /^vq_/i.test(b.id);
        if (aIsVQ && bIsVQ) return (b.ts || 0) - (a.ts || 0);
        if (aIsVQ && !bIsVQ) return -1;
        if (!aIsVQ && bIsVQ) return 1;
        const aIsQ = /^q\d+$/.test(a.id);
        const bIsQ = /^q\d+$/.test(b.id);
        if (aIsQ && bIsQ) return parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10);
        if (aIsQ && !bIsQ) return -1;
        if (!aIsQ && bIsQ) return 1;
        return (b.ts || 0) - (a.ts || 0);
      });
    }

    if (newOnly || sinceParam > 0) {
      newSinceMs = sinceParam > 0 ? sinceParam : 0;
      if (newOnly && !newSinceMs) {
        const days = Math.max(1, Math.min(90, parseInt(params.days, 10) || 7));
        const newestTs = entries.reduce((m, e) => Math.max(m, entryTs(e)), 0);
        newSinceMs = newestTs > 0
          ? newestTs - days * 86400000
          : Date.now() - days * 86400000;
      }
      entries = entries.filter(e => entryTs(e) >= newSinceMs);
    }

    // Per owner 2026-05-26: push entries tagged "negative-leaning" out of the
    // top of the library and into the middle band. Keeps the first impression
    // on page 1 positive-leaning while still surfacing the critical takes for
    // visitors who scroll. Only applies when NOT filtering to a specific tag.
    if (!tag && !newOnly && !sortTs) {
      const isNeg = e => Array.isArray(e.tags) && e.tags.includes('negative-leaning');
      const negatives = entries.filter(isNeg);
      const positives = entries.filter(e => !isNeg(e));
      if (negatives.length && positives.length) {
        const insertAt = Math.floor(positives.length / 2);
        entries = positives.slice(0, insertAt).concat(negatives).concat(positives.slice(insertAt));
      }
    }

    // Full filtered count (after tag/pillar filter, before merge/slice) so
    // callers can read a count cheaply with recent=1 instead of pulling the
    // whole pillar (was the 7.6MB homepage payload bug).
    const matched = entries.length;
    // Compact "mini" mode: id + question only, no visitor-ghost merge / blob
    // reads. Lets the homepage search load the WHOLE library cheaply for
    // autocomplete + Enter keyword search, avoiding the 502s that large
    // full-record `recent` requests hit (payload/memory).
    if (params.mini === '1' || params.mini === 'true') {
      // id + question + a CAPPED tag slice so the homepage predictive search can
      // autofill/match on keywords (pulse-search.js reads e.tags). Cap tags hard
      // (10) — some pillars carry 100+ SEO keyword tags; returning them all for
      // the whole library blew past Netlify's 6 MB response limit → 502 → dead
      // homepage search. Bump the row cap to 40000 so all ~22k entries load.
      const TAG_CAP = 6;
      let slim = entries.slice(0, Math.min(limit, 40000)).map(e => ({
        id: e.id,
        question: e.question,
        tags: Array.isArray(e.tags) ? e.tags.slice(0, TAG_CAP) : undefined,
      }));
      // BYTE-BUDGET guard (matches the full path): returning the WHOLE library can
      // exceed Netlify's ~6 MB response limit → the function returns nothing → dead
      // homepage search. Trim to fit instead of failing, so search always works.
      const miniTotal = (pillar || cat || tag) ? matched : (idx.entries || []).length;
      const MINI_BUDGET = 5200000; // ~5.2 MB, safely under Netlify's 6 MB hard limit
      let miniBody;
      while (true) {
        miniBody = JSON.stringify({ ok: true, total: miniTotal, matched, returned: slim.length, entries: slim });
        if (miniBody.length <= MINI_BUDGET || slim.length <= 500) break;
        slim = slim.slice(0, Math.floor(slim.length * 0.9));
      }
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: miniBody,
      };
    }
    // FULL-record ceiling raised to 10000 (owner: "really big number so we don't keep
    // doing this — like 10,000", sitewide/pillar-wide). The old 1200 cap truncated the
    // grid (40 pages × 30). A hard BYTE-BUDGET guard below makes it 502-proof regardless
    // of per-row size or pillar growth, so we never hit Netlify's ~6 MB limit again.
    const SAFE_FULL = 25000;
    const safeLimit = Math.min(limit, SAFE_FULL);
    // Skip visitor-queue ghosts when a pillar filter is applied — they don't
    // belong on the per-pillar listing pages (trainings / KPIs / etc).
    if (!pillar && !cat && !newOnly) {
      entries = await mergeVisitorQueue(store, entries, safeLimit);
    } else {
      // Honor `recent` for pillar queries too (previously unsliced → returned
      // the entire pillar regardless of limit).
      entries = entries.slice(0, safeLimit);
    }
    try { meta = (await store.get('_meta.json', { type: 'json' })) || null; } catch (_e) {}
    const mixBalance = params.mixBalance === '1' || params.mixbalance === '1'
      || (!pillar && !cat && !tag && sortTs && safeLimit <= 500);
    if (mixBalance && !pillar && !cat && !tag) {
      entries = balanceMixedMosaicEntries(entries, safeLimit);
    } else if (!pillar && !cat && !newOnly) {
      entries = entries.slice(0, safeLimit);
    }
    let mapped = entries.map(mapListEntry);
    const metaOut = meta && { spend_today: meta.spend_today || 0, runs_today: meta.runs_today || 0, last_run: meta.last_run || null };
    const totalOut = (pillar || cat || tag) ? matched : (idx.entries || []).length;
    const BYTE_BUDGET = 5200000; // ~5.2 MB, safely under Netlify's 6 MB hard limit
    let bodyStr;
    while (true) {
      bodyStr = JSON.stringify({
        ok: true,
        total: totalOut,
        matched,
        returned: mapped.length,
        entries: mapped,
        meta: metaOut,
        new_only: !!newOnly,
        new_since_ms: Number.isFinite(newSinceMs) && newSinceMs > 0 ? newSinceMs : undefined,
      });
      if (bodyStr.length <= BYTE_BUDGET || mapped.length <= 200) break;
      mapped = mapped.slice(0, Math.floor(mapped.length * 0.85));
    }
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: bodyStr,
    };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'index err' }) };
  }
};
