// ════════════════════════════════════════════════════════════════════════
// pulse-machine-site-audit — daily 09:00 UTC. Produces a small batch of
// structured site-optimization recommendations based on what the library
// is producing, what visitors are asking, and where intent data shows
// real-account interest.
//
// Output is staged to `audits/<id>.json` + `_audits_index.json`. NEVER
// auto-applies anything. Human review via /admin or daily debrief.
//
// Manual trigger: POST /.netlify/functions/pulse-machine-site-audit-background
// (auth via ?key=pulsemachine for one-off runs)
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const SONNET_MODEL = 'claude-sonnet-4-5';
const ESTIMATED_COST_USD = 0.10;
const MAX_RECS = 7;
const DAILY_SPEND_CAP = 5.0; // shared with research cron

function initStore(name) {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name, siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore(name); } catch (e) { return null; }
}

function makeId() { return 'audit-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function dayKey() { return new Date().toISOString().slice(0, 10); }

const SYSTEM_PROMPT = `You are The Machine's Site Auditor for pulserevops.com — a free public RevOps platform. You review what visitors are asking, what the library has been producing, and where the site is leaking attention or authority. You PROPOSE specific changes for human review. You do NOT write content.

The site has these surfaces:
- Homepage (three-doors landing): The Machine card · CRM card · War Room card. Plus secondary links (Knowledge Library, Pillars, Tour, Privacy).
- /themachine — autonomous AI Q&A oracle (gated knowledge offering, then ask).
- /knowledge.html — public library of researched answers + matrix-style code rain.
- /pillars/ — pillar pages drafted by the Machine, human-published. Currently 2 live.
- /how-tos/<industry>.html — 39 industry-specific RevOps playbooks. Vet, Dental, SaaS, HVAC, Real Estate are pattern-broken (Power Header + Trenches + Red Flag Audit). Others still on a templated 5-Moves structure.
- /press/ — press releases.
- /dashboard.html — the free CRM with House Goals, Pulse Check, Coaching, Lightning Rounds, etc.

Your output is JSON. Strict shape:
{
  "recommendations": [
    {
      "type": "faq-add" | "cta-tweak" | "cross-link" | "copy-refine" | "new-howto" | "visitor-friction" | "pillar-candidate" | "dashboard-tweak",
      "target_page": "<URL path>",
      "current_state": "<one sentence describing what's there now or what's missing>",
      "proposed_change": "<one or two sentences describing the specific change>",
      "rationale": "<why — cite the data signal that triggered this>",
      "priority": "high" | "medium" | "low",
      "data_signal": "<which input fed this recommendation>",
      "estimated_effort": "<5min | 15min | 30min | 1hr+>"
    }
  ]
}

Hard rules:
1. Maximum ${MAX_RECS} recommendations per run. Force prioritization.
2. Every recommendation must cite a SPECIFIC data signal (a library entry id/topic, a visitor question, an intent-data company, a path with high traffic, etc.). No speculative proposals.
3. Skip vanity recommendations. Skip "design refresh" / "modernize the look" / generic UX suggestions. Only propose changes with measurable impact on visitor action.
4. Refuse anything that compromises editorial integrity: no affiliate-link injection, no paid placement, no clickbait copy, no SEO-spam keyword stuffing.
5. Prefer SMALL, DEPLOYABLE changes (5-30min of human review/edit) over big rewrites.
6. Match the operator-led brand voice. Banned phrases: landscape, tapestry, leverage (verb), holistic, synergy, paradigm shift, game-changer, best-in-class, cutting-edge, streamline, delve, dive into, ever-evolving, unlock value.

Return ONLY the JSON object. No preamble, no commentary.`;

function claudePost(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      timeout: 50000,
    }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(buf), raw: buf }); }
        catch (e) { reject(new Error('parse: ' + buf.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function pullContext(libStore, intentStore, offeringsStore) {
  const ctx = { libraryRecent: [], visitorOfferings: [], intentTop: [], intentRecent: [] };

  try {
    const idx = (await libStore.get('_index.json', { type: 'json' })) || { entries: [] };
    ctx.libraryRecent = (idx.entries || []).slice(0, 30).map(e => ({
      id: e.id, question: (e.question || '').slice(0, 200), tags: (e.tags || []).slice(0, 4), ts: e.ts,
    }));
  } catch (e) {}

  try {
    if (offeringsStore) {
      const oIdx = (await offeringsStore.get('_index.json', { type: 'json' })) || { entries: [] };
      ctx.visitorOfferings = (oIdx.entries || []).slice(0, 40).map(o => ({
        text: (o.text || '').slice(0, 240), ts: o.ts,
      }));
    }
  } catch (e) {}

  try {
    if (intentStore) {
      const today = dayKey();
      const days = [today];
      for (let i = 1; i <= 6; i++) {
        days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
      }
      const allKeys = [];
      for (const d of days) {
        const list = await intentStore.list({ prefix: d + '/' });
        (list.blobs || []).forEach(b => allKeys.push(b.key));
      }
      allKeys.sort().reverse();
      const recent = await Promise.all(
        allKeys.slice(0, 80).map(k => intentStore.get(k, { type: 'json' }).catch(() => null))
      );
      const recs = recent.filter(Boolean);
      ctx.intentRecent = recs.slice(0, 30).map(r => ({
        company: r.company, path: r.path, referrer: r.referrer, city: r.city, country: r.country,
      }));
      const counts = {};
      recs.forEach(r => { if (r.company) counts[r.company] = (counts[r.company] || 0) + 1; });
      ctx.intentTop = Object.entries(counts).map(([n, c]) => ({ name: n, count: c })).sort((a, b) => b.count - a.count).slice(0, 15);
    }
  } catch (e) {}

  return ctx;
}

const { isVisitorPriorityActive } = require('./lib/visitor-priority');

exports.handler = async (event) => {
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

  if (!process.env.ANTHROPIC_API_KEY) return { statusCode: 200, body: 'no api key' };
  const params = (event && event.queryStringParameters) || {};
  const isManualTrigger = (event && event.httpMethod === 'POST');
  if (isManualTrigger && params.key !== 'pulsemachine') {
    return { statusCode: 403, body: 'forbidden' };
  }

  const libStore = initStore('pulse-machine-library');
  const intentStore = initStore('pulse-intent');
  const offeringsStore = initStore('pulse-machine-offerings');
  if (!libStore) { console.error('[audit] no library store'); return { statusCode: 200, body: 'no store' }; }

  // Reuse the daily-cap meta from the research cron — both share the budget
  let meta = await libStore.get('_meta.json', { type: 'json' }) || { spend_today: 0, day: '', runs_today: 0 };
  const today = dayKey();
  if (meta.day !== today) meta = { spend_today: 0, day: today, runs_today: 0 };
  if (meta.spend_today >= DAILY_SPEND_CAP) {
    console.log('[audit] daily cap hit, skipping', meta.spend_today);
    return { statusCode: 200, body: 'cap reached' };
  }

  const ctx = await pullContext(libStore, intentStore, offeringsStore);

  const userMessage = `Here is the data for today's site audit. Return your JSON only.

LIBRARY · most recent ${ctx.libraryRecent.length} entries:
${ctx.libraryRecent.map(e => `[${e.id}] tags=${(e.tags || []).join(',')} · ${e.question}`).join('\n')}

VISITOR OFFERINGS · last ${ctx.visitorOfferings.length} thoughts visitors shared at the gate:
${ctx.visitorOfferings.map(o => `- ${o.text}`).join('\n') || '(none yet)'}

INTENT · top ${ctx.intentTop.length} companies (last 7 days):
${ctx.intentTop.map(c => `- ${c.name} (${c.count} hits)`).join('\n') || '(none yet)'}

INTENT · recent ${ctx.intentRecent.length} hits:
${ctx.intentRecent.map(r => `- ${r.company || 'unresolved'} [${r.city || '-'} ${r.country || '-'}] -> ${r.path} (ref: ${r.referrer || '-'})`).join('\n') || '(none yet)'}

CURRENT SITE FACTS:
- Homepage three-door cards: The Machine (orange, ECG pulse-line, "Cliffs Notes for RevOps"), CRM (green, "free-to-use, better than the big boys", lists ~11 named tools), War Room (amber, "reports on reports on reports").
- Pattern-broken how-tos: Vet, Dental, SaaS, HVAC, Real Estate. The other ~33 how-to industries still use the templated "5 Moves to Scale Revenue Without Chaos" structure.
- Two pillar pages live: Deal Desk Architecture, Founder-Led Sales Governance Stack.
- Press release live at /press/pulse-machine-launch.html.
- Library is searchable + tag-filterable at /knowledge.html. Per-entry indexable URLs at /knowledge/<id>.

Now return your JSON recommendations.`;

  let response;
  try {
    response = await claudePost({
      model: SONNET_MODEL,
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });
  } catch (e) {
    console.error('[audit] api err', e && e.message);
    return { statusCode: 200, body: 'api err' };
  }

  if (!response.ok) {
    console.error('[audit] api fail', response.status, (response.raw || '').slice(0, 240));
    return { statusCode: 200, body: 'api fail' };
  }

  // Concat text blocks
  let raw = '';
  for (const b of (response.data.content || [])) {
    if (b.type === 'text' && b.text) raw += b.text;
  }
  raw = raw.trim();

  // Strip code-fence wrappers if Sonnet returned ```json ... ```
  const fence = raw.match(/```(?:json)?\n?([\s\S]+?)\n?```/);
  if (fence) raw = fence[1].trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error('[audit] parse fail', e.message, raw.slice(0, 240));
    return { statusCode: 200, body: 'parse fail' };
  }

  const recs = (parsed.recommendations || []).slice(0, MAX_RECS);
  if (!recs.length) {
    console.log('[audit] empty rec list');
    return { statusCode: 200, body: 'no recs' };
  }

  const auditId = makeId();
  const audit = {
    id: auditId,
    ts: Date.now(),
    day: today,
    status: 'pending',
    rec_count: recs.length,
    recommendations: recs,
    context_summary: {
      library_recent_count: ctx.libraryRecent.length,
      visitor_offerings_count: ctx.visitorOfferings.length,
      intent_top_companies: ctx.intentTop.length,
    },
  };

  try {
    await libStore.setJSON('audits/' + auditId + '.json', audit);
    const idx = (await libStore.get('_audits_index.json', { type: 'json' })) || { audits: [] };
    idx.audits = [{ id: auditId, ts: audit.ts, day: today, status: 'pending', rec_count: recs.length }, ...(idx.audits || [])].slice(0, 200);
    await libStore.setJSON('_audits_index.json', idx);
  } catch (e) {
    console.error('[audit] save err', e.message);
  }

  // Update spend tally — this audit shares the research-cron daily cap
  meta.spend_today = +(meta.spend_today + ESTIMATED_COST_USD).toFixed(3);
  meta.runs_today = (meta.runs_today || 0) + 1;
  meta.last_audit_ms = Date.now();
  meta.day = today;
  try { await libStore.setJSON('_meta.json', meta); } catch (e) {}

  console.log('[audit] ok · id=' + auditId + ' recs=' + recs.length + ' spend=$' + meta.spend_today);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, id: auditId, recs: recs.length, spend: meta.spend_today }),
  };
};
