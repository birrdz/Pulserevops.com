// ════════════════════════════════════════════════════════════════════════
// pulse-edge-guard — Edge Function that wraps every /.netlify/functions/pulse-*
// route with rate limiting + light auth + CORS + observability headers.
//
// Borrowed from Vasilios Syrakis's Atlassian "centralize cross-cutting
// concerns at the edge" pattern (May 2026 video). The single biggest payoff
// for us: bots hammering /pulse-machine-library-list or /pulse-machine-entry
// can no longer blow through our Netlify Functions monthly cap (that exact
// thing happened 2026-05-17 — see feedback_netlify_plan_cap memory).
//
// Runs in Deno at the CDN edge. Edge Function invocations are billed
// separately + much cheaper than regular Function invocations, so even
// adding this layer net-reduces spend.
// ════════════════════════════════════════════════════════════════════════

const WINDOW_MS = 60_000;  // 1 minute sliding window

// Rate limits per IP per function, per minute.
// Reads (anonymous, high volume from any visitor): 60/min
// Writes (key-gated, low expected volume): 120/min — generous since
//   our own cron writes come from here too, and the function itself
//   re-validates the key.
const WRITE_FNS = new Set([
  'pulse-blob-polish',
  'pulse-cron-log',
  'pulse-blob-writer',
  'pulse-blob-reset-scores',
  'pulse-blob-stamp-all-indexed',
  'pulse-blob-seo-tick',
]);

// Per-Edge-instance token buckets. Not globally consistent (Netlify spins
// up many Edge instances geographically), but more than enough to stop
// the casual scraper / runaway-loop case that took us out last week.
const buckets = new Map();

function fnNameFromPath(path) {
  // /.netlify/functions/pulse-machine-entry → pulse-machine-entry
  const m = /\/\.netlify\/functions\/([^/?]+)/.exec(path);
  return m ? m[1] : '';
}

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

export default async (request, context) => {
  const url = new URL(request.url);
  const fnName = fnNameFromPath(url.pathname);

  // Only guard /.netlify/functions/pulse-* — pass everything else straight
  // through. Some pulse-* functions are intentionally exempt: the *background
  // workers run on Netlify's internal scheduler (no incoming traffic to
  // rate-limit) and pulse-cleanup-status is so cheap + so commonly used as
  // a guard-check probe that limiting it would hurt us.
  if (!fnName || !fnName.startsWith('pulse-')) return context.next();
  if (fnName.endsWith('-background')) return context.next();
  if (fnName === 'pulse-cleanup-status') return context.next();
  // Long Gemini rewrites — must not sit behind edge 30s upstream cap.
  if (fnName === 'pulse-economy-polish') return context.next();

  // CORS preflight — answer at the edge, never invoke the function for OPTIONS.
  const origin = request.headers.get('origin') || '';
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors(origin) });
  }

  const ip = context.ip || request.headers.get('x-nf-client-connection-ip') || 'unknown';
  const isWrite = WRITE_FNS.has(fnName);
  const limit = isWrite ? 120 : 60;

  const key = ip + '|' + fnName;
  const now = Date.now();
  let entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
  }
  entry.count++;
  buckets.set(key, entry);

  // Lightweight bucket eviction so memory doesn't grow forever on the
  // edge instance. Sample 1-in-50 requests to garbage-collect expired
  // entries. Cheap; bounded.
  if ((entry.count + Math.floor(now / 1000)) % 50 === 0) {
    for (const [k, v] of buckets) {
      if (now > v.resetAt + WINDOW_MS) buckets.delete(k);
    }
  }

  if (entry.count > limit) {
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return new Response(
      JSON.stringify({
        error: 'rate_limited',
        message: `Too many requests to ${fnName}. Limit ${limit}/min/IP. Retry in ${retryAfterSec}s.`,
        retry_after_seconds: retryAfterSec,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(entry.resetAt / 1000)),
          ...cors(origin),
        },
      }
    );
  }

  // Pass through to the function, then decorate response headers with rate
  // limit telemetry. Visitors / honest bots that read these get to back off
  // before they get blocked.
  let response;
  try {
    response = await context.next();
  } catch (e) {
    console.error('[pulse-edge-guard] upstream error', fnName, e && e.message);
    throw e;
  }

  // Mutate response headers safely — Response.headers is read-only on some
  // runtimes, so clone if needed.
  const newHeaders = new Headers(response.headers);
  newHeaders.set('X-RateLimit-Limit', String(limit));
  newHeaders.set('X-RateLimit-Remaining', String(Math.max(0, limit - entry.count)));
  newHeaders.set('X-RateLimit-Reset', String(Math.floor(entry.resetAt / 1000)));
  // Single source of CORS truth at the edge — overrides anything the function
  // might (or might not) have set. Idempotent + safe.
  for (const [k, v] of Object.entries(cors(origin))) newHeaders.set(k, v);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

export const config = {
  // Match all pulse-* functions. Background workers + cleanup-status are
  // exempted inside the handler (above) so the config can stay simple.
  path: '/.netlify/functions/pulse-*',
};
