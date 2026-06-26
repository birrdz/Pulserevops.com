// ════════════════════════════════════════════════════════════════════════
// pulse-machine — "The Machine" Q&A endpoint for the Pulse oracle room.
// Sales / GTM / SaaS / leadership / RevOps SUBJECT-MATTER EXPERT only.
// Off-domain questions get a polite redirect, never an answer.
//
// Uses Claude with the web_search tool so the Machine stays current —
// pricing benchmarks, comp plans, hiring data, named-vendor moves.
//
// POST { message, history?: [{q,a}, ...] }
// →    { reply, sources?: [{title, url}] }
// ════════════════════════════════════════════════════════════════════════
const https = require('https');
const { normalizeQuestion, visitorQuestionId } = require('./lib/visitor-question-id');
const { setVisitorPriority } = require('./lib/visitor-priority');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM_PROMPT = `You are THE MACHINE — the single subject-matter expert for everything in the SALES / GTM / SAAS / REVENUE-LEADERSHIP arena. You are the all-knowing oracle in this domain. Inside this arena, you speak with calm authority — like a CRO with twenty years of rep-walking, deal-closing, board-managing experience.

YOUR DOMAIN — anything business, growth, sales, marketing, ops, leadership, money:
- Sales execution: prospecting, discovery, demos, negotiation, closing, objection handling
- Sales leadership: hiring, onboarding, ramp, coaching, performance management, terminations
- Compensation: comp plans, accelerators, SPIFFs, ramping pay, OTE design
- GTM strategy across ANY vertical: B2B SaaS, services, agencies, ecommerce, retail, restaurants, food trucks, real estate, local businesses, marketplaces, creator businesses, franchises, anything that has customers and revenue
- Pipeline + funnel math, conversion rates, forecasting, deal inspection, marketing attribution
- RevOps + ops: tooling stacks, CRM hygiene, attribution, territory design, capacity planning, hiring, comp
- SaaS metrics + general business metrics: ARR, NRR, CAC, LTV, payback, gross margin, contribution margin, unit economics for any business
- Marketing strategy: positioning, ICP, channels, content, paid acquisition, organic, brand
- Operating questions: pricing, packaging, expansion, partnerships, M&A, fundraising, capital structure
- Industry-specific motions: PLG, enterprise, mid-market, SMB, partner channel, federal, B2C, D2C, local

OFF-DOMAIN (you DECLINE briefly and redirect):
ONLY decline if the question is unambiguously outside business/growth/money — politics, weather, sports scores, recipes for cooking, code that's not about a business problem, personal life, celebrity gossip, current events with no business angle. For those: "The Machine speaks business and revenue — what's the angle for your operation?"
For ANYTHING with a customer-acquisition / pricing / hiring / monetization / margin / growth angle — even if the vertical is food trucks, dog walkers, or a Shopify store — ANSWER IT FULLY through the operator lens.

SHORT QUESTIONS ARE OK:
Even very short questions ("ARR?", "what is CAC", "MEDDPICC", "win rate", "comp plan", "outreach vs salesloft") count as in-arena and get a full answer. Do NOT decline a question just because it's short, single-word, or vague — interpret it generously as a sales/business/RevOps query. Only decline if it is unambiguously off-domain (e.g. "weather", "best pizza recipe").

KNOWLEDGE-SEEKING — CONSTANTLY SCAN THE WEB:
You are not just an oracle of training data — you are constantly tapped into the live web. RUN A WEB SEARCH on almost every meaningful query unless the question is purely about a timeless coaching principle.

Specifically search for:
- Current SaaS / sales benchmarks (CAC, NRR, win rates, ramp times, OTE, CAC payback)
- Named vendors, products, competitors (Apollo, Salesforce, HubSpot, Outreach, Gong, Clari, Salesloft, ZoomInfo, etc.) — recent product moves, pricing changes, layoffs, funding
- Sales-leadership job ads, openings, comp ranges (CRO, VP Sales, Head of Revenue, Sales Director postings on LinkedIn, BuiltIn, Wellfound, etc.)
- Recent industry shifts, M&A, funding rounds in sales tech
- Pricing data for specific products / motions
- Concrete numbers ("median NRR for Series B SaaS in 2025", "AE OTE in NYC fintech")
- Hiring market signals (which companies are hiring sales leaders, which are cutting)
- Conference takeaways, podcast quotes, LinkedIn-thread trends from the last 30 days

Skip search ONLY for: pure coaching scripts, role-play, framework explanations, motivational asks. Everything else — search.

When you cite findings, name the source briefly ("per Pavilion's 2025 comp report…", "Greenhouse postings show…"). Always favor data ≤ 90 days old.

VOICE:
- Direct. Specific. Numbered when actionable.
- Strong opinions, defended with reasoning.
- Names names — vendors, books, frameworks, people — when relevant.
- One closing line that's either a hard truth or a sharp action.

OPERATOR-LED, NOT THOUGHT-LEADER:
Speak like a CRO with a P&L, not a LinkedIn thought-leader. Use the real vocabulary of the discipline — ARR, NRR, GRR, magic number, CAC payback, rule of 40, comp accelerators, OTE design, ramp curves, deal velocity, pipeline coverage, win-rate by segment, attainment curves, gross margin, deal desk, MEDDPICC, Force Management, Challenger, Sandler. Name vendors, books, people. Numbers over adjectives.

BANNED PHRASES — never use any of these:
"landscape" · "tapestry" · "leverage" (as verb — say "use") · "utilize" (say "use") · "in today's digital age" · "in today's rapidly evolving" · "in today's competitive market" · "holistic" · "synergy" · "synergies" · "paradigm shift" · "game-changer" · "game-changing" · "best-in-class" · "world-class" · "cutting-edge" · "state-of-the-art" · "streamline" · "seamless integration" · "robust" (as generic adjective) · "delve" · "delve into" · "dive into" · "navigate the" · "ever-evolving" · "ever-changing" · "unlock value" · "unlock potential" · "drive growth" (as closer) · "let me explain" · "it's important to note" · "it's worth noting" · "needless to say"

If you're tempted to use any of those, rewrite with a concrete claim, a number, or a specific named example instead.

DEPTH IS NON-NEGOTIABLE:
- Aim for **depth and thoroughness on every answer**. The Machine is paid to give the full answer, not the short one. 600–1100 words is the normal floor for any non-trivial question. Brevity is not a virtue here — completeness is. The reader came for the expert, not a summary.
- Show the math, name the trade-offs, give the benchmark numbers, list the failure modes, name the vendors, explain when the answer flips.
- Quick takes are fine to lead with — but always followed by the full breakdown.

RICH MEDIA — every answer must have visual aids:
- **MANDATORY: every answer includes a Mermaid diagram** — fenced \`\`\`mermaid block — that visualizes the answer. Pick the right type: \`flowchart LR\` for processes / pipelines / tech stacks, \`sequenceDiagram\` for handoffs / deal motions / customer journeys, \`gantt\` for ramps / hiring plans / launch timelines, \`stateDiagram-v2\` for deal stages / lifecycle states, \`mindmap\` for framework breakdowns. Keep ~6–14 nodes for readability. The diagram is non-negotiable; even abstract / philosophical questions get a decision-tree or framework-map.
- Use markdown tables for any comparative data (benchmarks, comp ranges, vendor matrices, ratios, segment splits). Two columns minimum, with header row.
- Drop full https:// URLs to authoritative sources inline. The page renders these as clickable link cards. Examples: LinkedIn job postings, vendor pricing pages, Pavilion / Bridge Group / SaaStr reports, Greenhouse postings, podcast episode pages, books on Amazon, founder blog posts.
- When a video is genuinely the best answer (a great podcast clip, a Sam Jacobs talk, a Mark Roberge interview, a sales-engineering demo), paste the YouTube watch URL on its own line — the page embeds it.
- When an image / chart from a source would help (a CAC payback chart from OpenView, a benchmark chart from Pavilion), paste the direct image URL on its own line.
- Format with markdown: \`**bold**\` for emphasis, numbered lists \`1.\`, bullets \`- \`, headings \`## \`. Keep it clean.

Output structure (use it on every answer):
1. **Quick take** — 2-3 sentences, the bottom-line answer
2. **The detail** — full breakdown with subheadings, numbers, named vendors, benchmarks
3. **A Mermaid diagram** — visualizing the framework, decision tree, or process
4. **A markdown table** — when comparative data applies
5. **Sources** — clickable URLs to the data behind the claims
6. **One sharp closer** — the truth or the action

When the user asks a follow-up to a previous answer, build on the prior thread. Reference what was already discussed; go deeper or wider. Don't repeat the lead-in — the visitor is already in the room.

Never mention you are Claude or an AI. You are The Machine.`;

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
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(data), raw: data }); }
        catch (e) { reject(new Error('parse: ' + data.slice(0, 240))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ reply: 'POST only.' }) };
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: "The Machine isn't wired up yet — set ANTHROPIC_API_KEY in Netlify to bring it online." }),
    };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ reply: 'Bad JSON.' }) }; }

  const message = String(body.message || '').trim();
  if (!message) {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: 'Ask The Machine anything in the sales arena.' }),
    };
  }

  // ── LIBRARY-FIRST RETRIEVAL ────────────────────────────────────────
  // Before spending API credits on a fresh research call, check the
  // pre-built knowledge library populated by the hourly snowball cron.
  // Keyword + tag overlap → if a strong match exists, return it instantly
  // with sources. Library answers run on Sonnet 4.6 + 4 web searches, so
  // they're DEEPER than what we'd generate live.
  let libStore = null;
  try {
    if (getStore) {
      const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
      const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
      try { libStore = getStore('pulse-machine-library'); }
      catch (_e1) { if (tok && sid) libStore = getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); }
    }
  } catch (e) { /* no library, fall through */ }

  // ── PER-IP RATE LIMIT ──────────────────────────────────────────────
  // Cap: 20 questions per IP per hour. Prevents traffic-spike surprises
  // (one bot or one curious visitor hitting refresh shouldn't blow budget).
  if (libStore) {
    try {
      const ipRaw = (event.headers && (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || '')).toString().split(',')[0].trim();
      if (ipRaw) {
        const ipKey = 'ratelimit/' + simpleHash(ipRaw) + '.json';
        const nowMs = Date.now();
        const winMs = 60 * 60 * 1000; // 1 hour
        const cur = (await libStore.get(ipKey, { type: 'json' })) || { count: 0, window_start: nowMs };
        // Reset window if expired
        if (!cur.window_start || (nowMs - cur.window_start) > winMs) {
          cur.count = 0; cur.window_start = nowMs;
        }
        cur.count++;
        await libStore.setJSON(ipKey, cur);
        if (cur.count > 20) {
          return {
            statusCode: 200,
            headers: { ...CORS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reply: "The Machine has spoken many times to you this hour. Rest. It will answer again soon.",
              rate_limited: true,
            }),
          };
        }
      }
    } catch (e) { /* rate limit unavailable, fail-open */ }
  }

  // IMMUTABLE LAW (passcode 4444 to change): every visitor question goes
  // into the Knowledge Library at the top of page 1 as a fresh `vq_*`
  // entry, even if a similar entry already exists in the cache. The
  // visitor expects to watch THEIR question land. We always enqueue,
  // always fire the autopilot, and always redirect to the awaiting page.
  // The Claude polish loop can dedupe / cross-link later.
  let visitorId = null;
  if (libStore) {
    try {
      visitorId = await enqueueVisitorQuestion(libStore, message);
    } catch (_e) { /* fall through */ }
  }

  const messages = [];
  if (Array.isArray(body.history)) {
    body.history.slice(-6).forEach(h => {
      if (h && h.q && h.a) {
        messages.push({ role: 'user',      content: String(h.q) });
        messages.push({ role: 'assistant', content: String(h.a) });
      }
    });
  }
  messages.push({ role: 'user', content: message });

  // ── Pull the latest auto-learned feed (populated hourly by
  //    pulse-machine-learn-background.js) so The Machine's answers are
  //    grounded in the freshest sales/GTM signals from the last few hours.
  let feedContext = '';
  try {
    if (getStore) {
      let feedStore = null;
      try { feedStore = getStore('pulse-machine-feed'); }
      catch (_e1) {
        const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
        const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
        if (tok && sid) feedStore = getStore({ name: 'pulse-machine-feed', siteID: sid, token: tok });
      }
      const feed = feedStore && (await feedStore.get('latest.json', { type: 'json' }));
      if (feed && Array.isArray(feed.entries) && feed.entries.length) {
        const top = feed.entries.slice(0, 12);
        feedContext = '\n\nFRESH SCANNED INTEL (last few hours, use when relevant — cite the URL):\n'
          + top.map(e => `- [${e.topic||'misc'}] ${e.headline}${e.url ? ' — ' + e.url : ''}`).join('\n');
      }
    }
  } catch (e) { /* feed not ready, just skip */ }

  // ── IMMEDIATE-ANSWER MODE (AMENDED 2026-06-02 via passcode 4444) ────
  // Per owner: "Change the machine to pump out answers immediately."
  // Synchronous Anthropic call returns the reply inline (~5-15s). The
  // visitor question is still enqueued + the volume-writer is still fired
  // fire-and-forget so the entry lands in the library — but we no longer
  // redirect the visitor away from /themachine. They get the answer NOW.

  // Fire-and-forget the Gemini volume writer so the entry still lands in
  // the library for permanent indexing (parallel to the live Claude call).
  try {
    const host = (event.headers && (event.headers['x-forwarded-host'] || event.headers.host)) || 'pulserevops.com';
    const proto = (event.headers && event.headers['x-forwarded-proto']) || 'https';
    fireAndForget(`${proto}://${host}/.netlify/functions/pulse-volume-gemini`, '{}');
  } catch (err) {
    console.error('[pulse-machine] volume-writer dispatch err', err && err.message);
  }

  if (!visitorId && libStore) {
    try { visitorId = await enqueueVisitorQuestion(libStore, message); } catch (_e) {}
  }
  if (!visitorId) visitorId = visitorQuestionId(message);

  // ── SYNCHRONOUS CLAUDE CALL ────────────────────────────────────────
  // Returns the reply + sources inline so /themachine renders the answer
  // right where the visitor typed the question. No redirect.
  try {
    const claudeResp = await claudePost({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: SYSTEM_PROMPT + feedContext,
      messages,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 }],
    });
    if (claudeResp.ok && claudeResp.data && Array.isArray(claudeResp.data.content)) {
      // Extract the text reply + web_search citations
      let reply = '';
      const sources = [];
      for (const block of claudeResp.data.content) {
        if (block.type === 'text' && typeof block.text === 'string') {
          reply += block.text;
          // Capture web_search_result_location citations
          if (Array.isArray(block.citations)) {
            for (const c of block.citations) {
              if (c.type === 'web_search_result_location' && c.url) {
                sources.push({ title: c.title || c.url, url: c.url });
              }
            }
          }
        }
      }
      // Dedupe sources by url
      const seen = new Set();
      const uniq = [];
      for (const s of sources) { if (!seen.has(s.url)) { seen.add(s.url); uniq.push(s); } }
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reply: reply.trim() || 'The Machine processed your question — see top of the library for the full write-up.',
          sources: uniq,
          visitor_id: visitorId,
          library_url: visitorId ? ('/knowledge/' + visitorId) : '/knowledge',
        }),
      };
    }
    // Claude returned non-200 — fall back to queue-only response
    console.error('[pulse-machine] Claude non-200', claudeResp.status, claudeResp.raw && claudeResp.raw.slice(0, 240));
  } catch (err) {
    console.error('[pulse-machine] Claude call failed', err && err.message);
  }

  // Fallback path — Claude failed or unavailable. Return the legacy queued
  // response so the frontend redirects to /knowledge?awaiting=<vid>.
  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      queued: true,
      visitor_id: visitorId,
      library_url: visitorId ? ('/knowledge/' + visitorId) : '/knowledge',
      reply: 'Your question is at the top of the library — first-draft answer in about a minute.',
    }),
  };
};

// Fire-and-forget POST — kicks the request onto the wire without awaiting
// the response body. Background functions return 202 nearly instantly.
function fireAndForget(url, jsonBody) {
  try {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + (u.search || ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonBody),
      },
      timeout: 5000,
    };
    const lib = u.protocol === 'https:' ? require('https') : require('http');
    const req = lib.request(opts, (res) => { res.on('data', () => {}); res.on('end', () => {}); });
    req.on('error', () => {});
    req.on('timeout', () => { try { req.destroy(); } catch (_) {} });
    req.write(jsonBody);
    req.end();
  } catch (e) { /* swallow */ }
}

// ── Library-match helper ──────────────────────────────────────────────
// Cheap keyword + tag overlap scoring. Returns the best entry above a
// threshold, or null. Threshold tuned to favor recall slightly — we'd
// rather serve a "close enough" library answer than burn a fresh API call.
function findLibraryMatch(query, entries) {
  if (!Array.isArray(entries) || !entries.length) return null;
  const qTerms = tokenize(query);
  if (qTerms.length < 2) return null;
  let best = null;
  let bestScore = 0;
  for (const e of entries) {
    const eTerms = tokenize((e.question || '') + ' ' + (e.tags || []).join(' '));
    let overlap = 0;
    for (const t of qTerms) if (eTerms.includes(t)) overlap++;
    // Score = overlap / max(query terms, 4) — normalized to 0-1
    const score = overlap / Math.max(qTerms.length, 4);
    if (score > bestScore) { bestScore = score; best = e; }
  }
  // Threshold raised to 0.75 — was returning too many weak matches that
  // served stale refusals/deflections to questions about new verticals
  // (arcade, food truck, etc). Tighter match = more fresh API calls but
  // way fewer wrong cache hits.
  if (bestScore >= 0.75) return { id: best.id, score: +bestScore.toFixed(2) };
  return null;
}
function tokenize(s) {
  const STOP = new Set(['the','a','an','is','it','of','to','for','in','on','at','and','or','but','my','i','do','how','what','when','where','why','should','can','could','would','should','my','your','their','this','that','do','does','did','have','has','had']);
  return String(s || '').toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 3 && !STOP.has(t));
}

// Email Kory once when Anthropic credits run out. Throttled to 1 email per
// 12 hours so we don't spam during the credit-out window. Uses the existing
// Resend integration (RESEND_API_KEY + ALERT_TO_EMAIL env vars).
async function notifyCreditLow(store, source) {
  try {
    const apiKey = process.env.RESEND_API_KEY || process.env.resendapikey;
    const to     = process.env.ALERT_TO_EMAIL  || process.env.alert_to_email;
    const from   = process.env.ALERT_FROM_EMAIL || 'onboarding@resend.dev';
    if (!apiKey || !to) return;
    const last = (await store.get('_credit_alert.json', { type: 'json' })) || {};
    const now = Date.now();
    if (last.ts && (now - last.ts) < 12 * 60 * 60 * 1000) return; // 12h throttle
    await store.setJSON('_credit_alert.json', { ts: now, source });
    const subject = '🟠 Pulse Machine credits exhausted';
    const html = '<div style="font-family:-apple-system,sans-serif;max-width:520px;padding:18px 22px;border:1px solid #e5e5e5;border-radius:10px;">'
      + '<h2 style="margin:0 0 10px;font-size:18px;color:#E8710A;">The Machine is out of credits</h2>'
      + '<p style="margin:0 0 8px;color:#333;">' + (source || 'pulse-machine') + ' just got <code>credit balance too low</code> from Anthropic.</p>'
      + '<p style="margin:0 0 14px;color:#333;">Top up at <a href="https://console.anthropic.com/settings/billing">console.anthropic.com</a> to wake the snowball + visitor Q&amp;A.</p>'
      + '<p style="margin:12px 0 0;font-size:12px;color:#888;">Throttled to one alert per 12 hours.</p>'
      + '</div>';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
  } catch (e) { /* silent — the visitor message already covers UX */ }
}

// Tiny non-cryptographic hash for IP (we don't store raw IPs)
function simpleHash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

// Enqueue visitor questions for volume-writer + ghost card on /knowledge.
async function enqueueVisitorQuestion(store, q) {
  const vqId = visitorQuestionId(q);
  try {
    const cur = (await store.get('queue.json', { type: 'json' })) || { items: [] };
    const items = cur.items || [];
    const norm = normalizeQuestion(q);
    if (!norm) return vqId;
    const dupe = items.some(it => normalizeQuestion(it.q) === norm);
    if (!dupe) {
      items.unshift({
        q: String(q).slice(0, 320),
        vq_id: vqId,
        parent_id: null,
        ts: Date.now(),
        priority: 10,
        source: 'visitor',
      });
      if (items.length > 8000) items.splice(8000);
      await store.setJSON('queue.json', { items });
    }
    try {
      const a = (await store.get('_audit_status.json', { type: 'json' })) || {};
      await store.setJSON('_audit_status.json', {
        ...a,
        visitor_target: vqId,
        ts: Date.now(),
      });
    } catch (_e) { /* best effort */ }
    // VISITOR PRIORITY: every background/cron function pauses until this
    // question lands or the 5-min TTL expires.
    try { await setVisitorPriority(store, vqId); } catch (_e) {}
    // API-DIRECT TRIGGER (LOCKED LAW amended 2026-05-31, passcode 4444):
    // "Anytime a user uses the machine, you use the API tokens." Fire the
    // Anthropic API path first (claude-opus-4-8, ~10-30s, $2/day cap). The
    // API function itself falls back to the Gemini autopilot if the kill
    // switch is on, the daily cap is hit, the API key is missing, or the
    // API errors. Either way the visitor gets an answer.
    try {
      const host = (process.env.URL || 'https://pulserevops.com').replace(/\/$/, '');
      // Fire-and-forget — do NOT await. Background functions return 202 instantly.
      fetch(host + '/.netlify/functions/pulse-machine-api-vq-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vq_id: vqId, question: String(q).slice(0, 500) }),
      }).catch(() => {});
    } catch (_e) { /* never block submit on API wake */ }
  } catch (e) { /* best effort */ }
  return vqId;
}
