// ════════════════════════════════════════════════════════════════════════
// pulse-machine-library-list — public read-only browse endpoint for the
// growing knowledge library. Powers the /knowledge/ hub page.
//
// GET ?recent=N            → top N most recent answers, summary fields only
// GET ?id=<id>             → full answer for one entry (question, answer, sources, tags)
// GET ?tag=<tag>&recent=N  → recent N entries that include the given tag
// ════════════════════════════════════════════════════════════════════════

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

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
      const newestTs = allEntries.reduce((m, e) => Math.max(m, e.ts || 0), 0);
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
            try {
              const a = await store.get('_in_flight.json', { type: 'json' });
              if (!a) return { ids: [], workers: [], ts: 0 };
              // Guard against stale state from a crashed agent — older than
              // 30 min = abandoned.
              if (Date.now() - (a.ts || 0) > 30 * 60 * 1000) return { ids: [], workers: [], ts: a.ts || 0 };
              return { ids: a.ids || [], workers: a.workers || [], ts: a.ts || 0 };
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
  // Cap raised to 5000 so /knowledge.html can render the full library
  // (was 60 — caused empty grid when all top-60 were today's entries).
  const limit = Math.max(1, Math.min(5000, parseInt(params.recent, 10) || 24));
  const tag   = params.tag ? String(params.tag).toLowerCase().trim() : null;
  let meta    = null;

  try {
    const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
    let entries = (idx.entries || []).slice();
    if (tag) entries = entries.filter(e => Array.isArray(e.tags) && e.tags.includes(tag));
    // Sort newest-first by q-ID (descending). Latest writes appear at the top
    // of the library so visitors see what was just added. Non-q-IDs fall back
    // to ts desc.
    entries.sort((a, b) => {
      const aIsQ = /^q\d+$/.test(a.id);
      const bIsQ = /^q\d+$/.test(b.id);
      if (aIsQ && bIsQ) return parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10);
      if (aIsQ && !bIsQ) return -1;
      if (!aIsQ && bIsQ) return 1;
      return (b.ts || 0) - (a.ts || 0);
    });
    entries = entries.slice(0, limit);
    try { meta = (await store.get('_meta.json', { type: 'json' })) || null; } catch (_e) {}
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        total: (idx.entries || []).length,
        returned: entries.length,
        entries: entries.map(e => ({ id: e.id, question: e.question, tags: e.tags || [], ts: e.ts, polished_at: e.polished_at || null, quality_score: typeof e.quality_score === 'number' ? e.quality_score : 5, was_indexed_at: e.was_indexed_at || null })),
        meta: meta && { spend_today: meta.spend_today || 0, runs_today: meta.runs_today || 0, last_run: meta.last_run || null },
      }),
    };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, reason: 'index err' }) };
  }
};
