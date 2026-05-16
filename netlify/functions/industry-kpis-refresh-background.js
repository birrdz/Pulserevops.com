// ═══════════════════════════════════════════════════════════════════════════
// industry-kpis-refresh-background — daily prewarm of the industry-kpis cache.
//
// `-background` filename makes this a Netlify background function (15 min
// timeout, no client response). Runs once a day on the schedule defined in
// netlify.toml ([functions."industry-kpis-refresh-background"] schedule = ...).
//
// Walks all 39 industries, calls Claude web_search for each, writes results
// into the same Netlify Blob store the on-demand industry-kpis.js reads from.
// User-facing /industry-kpis fetches then return instantly from cache.
// ═══════════════════════════════════════════════════════════════════════════
const https = require('https');
const { getStore } = require('@netlify/blobs');

const CACHE_SCHEMA_VERSION = 'v2-2026-04-27';

// (slug, friendly label) for every industry on Site 1.
const INDUSTRIES = [
  ['security',     'Home Security'],
  ['internet',     'Internet / Broadband'],
  ['solar',        'Solar / Energy'],
  ['mortgage',     'Mortgage / Lending'],
  ['insurance',    'Insurance'],
  ['realestate',   'Real Estate'],
  ['saas',         'SaaS / Software'],
  ['gym',          'Fitness / Gym'],
  ['streaming',    'Streaming / Media'],
  ['banking',      'Banking / Fintech'],
  ['healthcare',   'Healthcare'],
  ['auto',         'Auto / Dealership'],
  ['pest',         'Pest Control'],
  ['hvac',         'HVAC / Home Services'],
  ['cable',        'Cable / Satellite TV'],
  ['moving',       'Moving / Storage'],
  ['travel',       'Travel / Hospitality'],
  ['legal',        'Legal / Professional'],
  ['retail',       'Retail / E-commerce'],
  ['staffing',     'Staffing / Recruiting'],
  ['pharma',       'Pharmaceutical / Biotech'],
  ['meddevice',    'Medical Device'],
  ['construction', 'Construction'],
  ['edtech',       'Education / EdTech'],
  ['restaurant',   'Restaurant'],
  ['ecommerce',    'E-commerce / DTC'],
  ['cybersec',     'Cybersecurity'],
  ['logistics',    'Logistics / Freight'],
  ['events',       'Events / Entertainment'],
  ['dental',       'Dental / Ortho'],
  ['veterinary',   'Veterinary'],
  ['cleaning',     'Cleaning / Facilities'],
  ['wellness',     'Wellness / Spa'],
  ['msp',          'IT Services / MSP'],
  ['media',        'Digital Advertising'],
  ['agriculture',  'Agriculture'],
  ['wholesale',    'Wholesale Distribution'],
  ['printing',     'Printing / Signage'],
  ['nonprofit',    'Nonprofit'],
];

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

const PROMPT = (slug, label) => `You are a sales-operations researcher. Use web_search to find CURRENT (2025-2026) public benchmarks for the most-tracked sales / revenue KPIs in the ${label} industry.

Return EXACTLY 9 KPIs that a sales-rep team in ${label} should track monthly, in priority order. For each KPI:
  • name        — short label, ≤ 22 chars
  • perRep      — realistic monthly target PER REP (number, no symbols)
  • isRate      — true if KPI is a rate / percentage / score / ratio. false for count metrics that scale with team size.
  • sourceNote  — one short phrase indicating where the benchmark came from

Output ONLY a valid JSON array of 9 objects, no prose, no markdown fences:

[
  { "name":"New Installs","perRep":4,"isRate":false,"sourceNote":"SEIA 2024" },
  ...
]

Targets must be REALISTIC for ONE rep over ONE month. For rate/% KPIs, perRep is the percentage as a number 0-100. For count/$ KPIs, perRep is the per-rep monthly figure.`;

function parseKpis(raw) {
  let s = String(raw || '').replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  const tryParse = (x) => { try { return JSON.parse(x); } catch (e) { return null; } };
  let parsed = tryParse(s);
  if (!Array.isArray(parsed)) {
    const m = s.match(/\[[\s\S]*\]/);
    if (m) parsed = tryParse(m[0]);
  }
  if (!Array.isArray(parsed)) {
    const m = s.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if (m) parsed = tryParse(m[0]);
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(k => k && typeof k === 'object' && k.name)
    .slice(0, 9)
    .map(k => ({
      name: String(k.name).trim().slice(0, 28),
      perRep: Number.isFinite(+k.perRep) ? +k.perRep : 0,
      isRate: !!k.isRate,
      sourceNote: String(k.sourceNote || '').trim().slice(0, 120),
    }));
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

exports.handler = async (event) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[industry-kpis-refresh] ANTHROPIC_API_KEY not set');
    return { statusCode: 503, body: 'ANTHROPIC_API_KEY missing' };
  }

  let store;
  try { store = getStore('industry-kpis'); } catch(e) { store = null; }
  if (!store) {
    console.error('[industry-kpis-refresh] cannot get blob store');
    return { statusCode: 500, body: 'no blob store' };
  }

  const stats = { ok: 0, empty: 0, error: 0, skipped: 0 };
  const asOf = new Date().toISOString().slice(0, 10);

  // Allow forcing a refresh by passing ?force=1 ; otherwise skip entries
  // that were cached successfully in the last 18 hours (so re-runs are cheap).
  const force = event && event.queryStringParameters && event.queryStringParameters.force === '1';
  const FRESH_WINDOW_MS = 18 * 60 * 60 * 1000;

  for (const [slug, label] of INDUSTRIES) {
    try {
      // Skip if we already have a fresh, non-placeholder cached entry
      if (!force) {
        const existing = await store.get(slug).catch(() => null);
        if (existing) {
          try {
            const c = JSON.parse(existing);
            const realCount = (c.kpis || []).filter(k => k && k.name && !/^KPI\s*\d+$/i.test(String(k.name).trim())).length;
            if (c.schemaVersion === CACHE_SCHEMA_VERSION
                && realCount >= 7
                && c.cachedAt && (Date.now() - c.cachedAt < FRESH_WINDOW_MS)) {
              stats.skipped++;
              continue;
            }
          } catch (e) { /* fall through */ }
        }
      }

      const response = await claudePost({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
        messages: [{ role: 'user', content: PROMPT(slug, label) }],
      });

      const blocks = response?.content || [];
      const textBlock = [...blocks].reverse().find(b => b.type === 'text');
      const kpis = parseKpis(textBlock?.text || '');

      if (!kpis.length) {
        console.warn(`[industry-kpis-refresh] ${slug}: no parseable KPIs returned`);
        stats.empty++;
      } else {
        await store.set(slug, JSON.stringify({
          kpis,
          cachedAt: Date.now(),
          asOf,
          schemaVersion: CACHE_SCHEMA_VERSION,
        }));
        stats.ok++;
        console.log(`[industry-kpis-refresh] ${slug}: ${kpis.length} KPIs cached`);
      }

      // Rate-limit pacing — Claude API + web_search benefits from breathing room
      await sleep(1500);
    } catch (err) {
      console.error(`[industry-kpis-refresh] ${slug} failed:`, err.message);
      stats.error++;
      await sleep(2000);
    }
  }

  console.log('[industry-kpis-refresh] complete:', stats);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, asOf, stats }),
  };
};
