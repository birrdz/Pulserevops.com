// ════════════════════════════════════════════════════════════════════════
// pulse-max-plan-status — manual-sync 5-hour-block usage tracker for the
// Anthropic Claude.ai Max $200/mo plan. Anthropic does not expose Max
// plan usage via any API, so the owner manually logs % usage when they
// check console.anthropic.com.
//
// Block math: 5-hour rolling blocks anchored to a user-set timestamp
// (`block_anchor_ms`). First call auto-anchors to "now". The owner can
// hit "Reset block" anytime to re-anchor to current moment.
//
// GET                       → returns block bounds + last in-block reading
// POST { reset: true }      → re-anchor to now
// POST { pct: 0-100 }       → log a usage reading
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const BLOCK_MS = 5 * 60 * 60 * 1000; // 5h

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
}

// Given a user-set anchor + now, return the current 5h block bounds.
// Blocks roll forward automatically — anchor never has to be touched.
function blockBoundsFromAnchor(nowMs, anchorMs) {
  const sinceAnchor = nowMs - anchorMs;
  const blockIdx = Math.max(0, Math.floor(sinceAnchor / BLOCK_MS));
  const currentStart = anchorMs + blockIdx * BLOCK_MS;
  const nextReset = currentStart + BLOCK_MS;
  return {
    block_anchor_ms: anchorMs,
    current_block_start_ms: currentStart,
    next_reset_ms: nextReset,
    block_index: blockIdx, // how many full blocks since the anchor
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  const store = initStore();
  const now = Date.now();

  // POST
  if (event.httpMethod === 'POST') {
    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (_e) {}

    const cur = (await store.get('max-plan-usage.json', { type: 'json' })) || { readings: [] };
    cur.readings = cur.readings || [];

    // RESET — re-anchor to now (drops the prior reading record but keeps history)
    if (body.reset === true) {
      cur.block_anchor_ms = now;
      cur.last_pct = null;
      cur.last_ts = null;
      cur.last_block_start = now;
      cur.readings.unshift({ event: 'reset', ts: now, block_start: now });
      if (cur.readings.length > 200) cur.readings.length = 200;
      await store.setJSON('max-plan-usage.json', cur);
      const bounds = blockBoundsFromAnchor(now, now);
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true, reset: true, last_pct: null, last_ts: null, stale: false, now_ms: now, ...bounds }),
      };
    }

    // LOG USAGE
    const pct = Number(body.pct);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, reason: 'pct must be a number 0-100, or send { reset: true }' }) };
    }
    // Auto-anchor on first usage log if no anchor yet
    if (!cur.block_anchor_ms) cur.block_anchor_ms = now;
    const bounds = blockBoundsFromAnchor(now, cur.block_anchor_ms);
    cur.last_pct = +pct.toFixed(1);
    cur.last_ts = now;
    cur.last_block_start = bounds.current_block_start_ms;
    cur.readings.unshift({
      pct: +pct.toFixed(1),
      ts: now,
      block_start: bounds.current_block_start_ms,
    });
    if (cur.readings.length > 200) cur.readings.length = 200;
    await store.setJSON('max-plan-usage.json', cur);
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        last_pct: cur.last_pct,
        last_ts: cur.last_ts,
        stale: false,
        now_ms: now,
        ...bounds,
      }),
    };
  }

  // GET
  let cur = (await store.get('max-plan-usage.json', { type: 'json' })) || {};

  // Auto-anchor on first ever GET so the bar isn't dead until first log
  if (!cur.block_anchor_ms) {
    cur = { ...cur, block_anchor_ms: now, last_block_start: now, last_pct: null, last_ts: null, readings: cur.readings || [] };
    cur.readings.unshift({ event: 'auto_anchor', ts: now, block_start: now });
    await store.setJSON('max-plan-usage.json', cur);
  }

  const bounds = blockBoundsFromAnchor(now, cur.block_anchor_ms);
  // Last reading is "in this block" only if its block_start matches current
  const lastInThisBlock = cur.last_block_start === bounds.current_block_start_ms && Number.isFinite(cur.last_pct);

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({
      ok: true,
      last_pct: lastInThisBlock ? cur.last_pct : null,
      last_ts: lastInThisBlock ? cur.last_ts : null,
      stale: !lastInThisBlock,
      now_ms: now,
      ...bounds,
    }),
  };
};
