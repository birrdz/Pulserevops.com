// ═══════════════════════════════════════════════════════════════════════════
// industry-kpis — on-demand industry KPI lookup powered by Claude web_search.
//
// GET /.netlify/functions/industry-kpis?ind=<slug>&label=<friendly name>
//
// Returns 9 current sales KPIs for the requested industry with realistic
// per-rep monthly targets pulled from current (2025-2026) public benchmarks.
// Cached in Netlify Blob for 30 days per slug to avoid repeating expensive
// web-search calls.
//
// Response shape:
//   {
//     ok: true,
//     industry: "solar",
//     kpis: [
//       { name: "New Installs",        perRep: 4,  isRate: false },
//       { name: "Battery Attach Rate", perRep: 25, isRate: true  },
//       ...
//     ],
//     source: "live" | "cache",
//     asOf: "2026-04-27"
//   }
// ═══════════════════════════════════════════════════════════════════════════
const https = require('https');
const { getStore } = require('@netlify/blobs');

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
// Bump this string to invalidate all cached results from prior versions of
// the function (e.g. when the parse logic changes and old cache entries are
// known-bad placeholder padding).
const CACHE_SCHEMA_VERSION = 'v2-2026-04-27';

function claudePost(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const opts = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const PROMPT_TEMPLATE = (industry, label) => `You are a sales-operations researcher. Use web_search to find CURRENT (2025-2026) public benchmarks for the most-tracked sales / revenue KPIs in the ${label || industry} industry.

Then return EXACTLY 9 KPIs that a sales-rep team in ${label || industry} should be tracking monthly, in priority order. For each KPI, give:
  • name        — short label, ≤ 22 chars
  • perRep      — realistic monthly target PER REP (number, no symbols)
  • isRate      — true if the KPI is a rate / percentage / score / ratio (so the value is an absolute target, not multiplied by rep count). false if it's a count metric (units, dollars, calls — value scales with team size).
  • sourceNote  — one short phrase indicating where the benchmark came from (e.g. "ATA 2024 industry report", "RIA association data", or "industry consensus")

Output ONLY a valid JSON array of 9 objects in this exact shape, no prose around it:

[
  { "name":"New Installs","perRep":4,"isRate":false,"sourceNote":"SEIA 2024 dealer survey" },
  { "name":"Battery Attach %","perRep":25,"isRate":true,"sourceNote":"Solar Power World benchmark" },
  ...
]

Rules:
  • Targets must be REALISTIC for one individual rep over one month, not company-wide totals.
  • For rate / % KPIs: perRep should be the actual percentage as a number 0–100 (e.g. 25 means 25%).
  • For count / $ KPIs: perRep should be a SINGLE rep's monthly number (e.g. "8 closings", not "80 closings for the team").
  • Mix leading + lagging indicators (top of funnel + closes + retention).
  • If you can't find a hard published number, use industry-consensus estimates and note that in sourceNote.
  • Do NOT wrap the JSON in markdown fences. Return raw JSON only.`;

exports.handler = async (event) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'ANTHROPIC_API_KEY missing' }),
    };
  }

  const params = event.queryStringParameters || {};
  const ind = String(params.ind || '').trim().toLowerCase();
  const label = String(params.label || ind).trim();
  if (!/^[a-z][a-z0-9-]{0,40}$/.test(ind)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'invalid industry slug' }),
    };
  }

  // ── Cache lookup ──────────────────────────────────────────────────────────
  let store;
  try { store = getStore('industry-kpis'); } catch(e) { store = null; }
  if (store) {
    try {
      const raw = await store.get(ind);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && cached.schemaVersion === CACHE_SCHEMA_VERSION
            && cached.kpis && cached.kpis.length
            && cached.cachedAt && (Date.now() - cached.cachedAt < CACHE_TTL_MS)) {
          // Extra guard: skip cache if every name is a placeholder
          const realCount = cached.kpis.filter(k => k && k.name && !/^KPI\s*\d+$/i.test(String(k.name).trim())).length;
          if (realCount >= 3) {
            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' },
              body: JSON.stringify({
                ok: true,
                industry: ind,
                kpis: cached.kpis,
                source: 'cache',
                asOf: cached.asOf || new Date(cached.cachedAt).toISOString().slice(0, 10),
              }),
            };
          }
        }
      }
    } catch(e) { /* fall through to live lookup */ }
  }

  // ── Live web_search via Claude ────────────────────────────────────────────
  try {
    const response = await claudePost({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
      messages: [{ role: 'user', content: PROMPT_TEMPLATE(ind, label) }],
    });

    const blocks = response?.content || [];
    const textBlock = [...blocks].reverse().find(b => b.type === 'text');
    let raw = textBlock?.text || '';

    // Strip markdown fences if Claude wrapped the JSON in ``` ... ```
    raw = raw.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();

    let kpis = [];
    // Try several extraction strategies: full parse, last array, first array
    const tryParse = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };
    const parsed = tryParse(raw)
      || (() => {
           // last greedy array — most prompts have one big array at the end
           const m = raw.match(/\[[\s\S]*\]/);
           return m ? tryParse(m[0]) : null;
         })()
      || (() => {
           // first balanced array
           const m = raw.match(/\[\s*\{[\s\S]*?\}\s*\]/);
           return m ? tryParse(m[0]) : null;
         })();
    if (Array.isArray(parsed)) kpis = parsed;
    if (!Array.isArray(kpis) || !kpis.length) {
      console.error('[industry-kpis] JSON parse yielded nothing. raw:', raw.slice(0, 600));
    }

    // Normalize + clamp to 9
    kpis = (Array.isArray(kpis) ? kpis : [])
      .filter(k => k && typeof k === 'object' && k.name)
      .slice(0, 9)
      .map(k => ({
        name: String(k.name).trim().slice(0, 28),
        perRep: Number.isFinite(+k.perRep) ? +k.perRep : 0,
        isRate: !!k.isRate,
        sourceNote: String(k.sourceNote || '').trim().slice(0, 120),
      }));

    // If we got NOTHING usable, surface a real failure so the client can fall
    // back to its local INDUSTRY_PRESETS table (instead of rendering 9 empty
    // "KPI N" placeholders that look broken to the user).
    if (!kpis.length) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'web_search returned no parseable KPIs', industry: ind }),
      };
    }

    if (kpis.length < 9) {
      // Partial result — pad to 9 with empty rows but mark the result as partial
      while (kpis.length < 9) {
        kpis.push({ name: 'KPI ' + (kpis.length + 1), perRep: 0, isRate: false, sourceNote: '' });
      }
    }

    const asOf = new Date().toISOString().slice(0, 10);

    if (store) {
      try {
        await store.set(ind, JSON.stringify({ kpis, cachedAt: Date.now(), asOf, schemaVersion: CACHE_SCHEMA_VERSION }));
      } catch(e) { /* non-fatal */ }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' },
      body: JSON.stringify({ ok: true, industry: ind, kpis, source: 'live', asOf }),
    };
  } catch (err) {
    console.error('[industry-kpis] error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: err.message || 'unknown error' }),
    };
  }
};
