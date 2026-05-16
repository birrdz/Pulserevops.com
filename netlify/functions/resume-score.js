// ════════════════════════════════════════════════════════════════════════
// resume-score — public-facing endpoint that scores Kory White's resume
// against a role described by the visitor. Two scoring lenses:
//   - ATS Score: keyword match, structure, format suitability for ATS filters
//   - Recruiter Score: 5-second-scan impact, standout achievements, fit signals
//
// Powered by Haiku 4.5 (~$0.005/call). Rate-limited per IP via blob to
// prevent abuse. POST only.
//
// Body: { scoreType: "ats" | "recruiter", role, industry?, yearsRequired?,
//         keySkills? }
// Returns: { ok, score: 0-100, summary, strengths[], gaps[],
//            top_keyword_matches[], recommendations[] }
// ════════════════════════════════════════════════════════════════════════

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const HAIKU_MODEL = 'claude-haiku-4-5-20251001';
const RATE_LIMIT_PER_IP_PER_HOUR = 6;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Resume content — kept here so the function is self-contained. Update when
// resume_v26.docx changes substantially.
const RESUME = `KORY WHITE
Chief Revenue Officer | VP of Sales | Regional President | SaaS & Subscription Revenue | Independent Operator
Stevensville, MD · (443) 761-2012 · koryjordanwhite@gmail.com · linkedin.com/in/korywhite · pulserevops.com · theexecutivereview.org

OPEN TO: Relocation Nationwide · No Contingencies · Available Monday–Friday On-Site, Hybrid, or Remote

HEADLINE METRICS:
- $200M+ Subscription ARR Built from Zero
- Independent Operator (not corporate heir)
- #1 National Ranking
- 112% Quota Back-to-Back
- 29% Churn Reduction
- 22-Year Revenue Track Record

RECOGNITION: "Top Trending Private Growth Executives" — Chief Revenue Officer | April 2026 | TheExecutiveReview.org

PROFESSIONAL SUMMARY:
SaaS Revenue Executive · CRO · VP Sales · Regional President · Subscription Revenue & Recurring ARR Operator. SaaS-native revenue executive with 22 years architecting subscription and recurring-revenue businesses — most recently as Regional President at Cellular Sales, an independent authorized Verizon retailer running a subscription-revenue operation (monthly service, expansion revenue, churn economics) and competing head-to-head against corporate-owned stores. Built greenfield territory $0 → $200M+ ARR with full P&L ownership — no corporate safety net, no enterprise marketing machine, no lead flow handed down. Fluent across the full SaaS metric stack (ARR, MRR, NRR, GRR, ACV, LTV, CAC, bookings, expansion, churn) and operating pattern: invent in my market, prove with unit economics, pitch up the chain, adopted company-wide. Outcomes: forecast accuracy within 10%, pipeline tripled to #1 nationally, conversion +35%, 1,250–1,750 net-new SaaS customers per month.

EXECUTIVE IMPACT & CAREER HIGHLIGHTS:

Independent Operator, Not Corporate Heir: Built a $200M+ subscription ARR business as an independent authorized retailer — competing against corporate-owned stores with no brand marketing budget, no enterprise lead flow, no safety net.

#1 National Ranking · 112% Quota Back-to-Back: Youngest Regional President in company history — personally nominated by the CEO after outcompeting 10 internal candidates — drove commercial organization to #1 nationally with back-to-back record-breaking quota attainment.

$200M+ Subscription ARR Built from Zero: Architected a greenfield market $0 → $200M+ ARR across 25+ territories plus B2B, B2C, inside, outside, call center, and event-based channels. Defined ICP, sized TAM, designed GTM motion, delivered $6M+ net profit annually with full P&L ownership and recurring-revenue economics.

P&L Owner · GTM Architecture, M&A, Repeatable Forecasting: Full commercial accountability for $200M+ ARR operation — owning GTM strategy, revenue architecture, investment prioritization, cross-functional alignment, board-level forecasting within 10% accuracy.

AI-Native Revenue Executive · Built The Machine: 1,000+ hours hands-on with Claude Code shipping production GTM tooling, revenue dashboards, branded Sales Revenue Engine demos, and commercial web properties. Flagship: The Machine @ pulserevops.com — autonomous AI subject-matter expert for RevOps that researches one operator question every 30 minutes (Claude Sonnet 4.6 + live web search). Built a free CRM, free RevOps tool suite (Gross Profit Calculator, Pulse Check rep scoring, Recruiting Calculator, Rep Scheduling Matrix), and ~200 indexable knowledge entries. A revenue executive who builds the tooling, not just approves the budget.

$20M+ New Revenue Column · Invented VAR Division: Created first-of-its-kind Value-Added Rebate Division by leveraging manufacturer and vendor partnerships — generating $20M annual revenue added directly to P&L with zero incremental headcount.

Mobile Showroom Events Channel · Adopted Across 40 Markets: Conceived zero-to-one mobile showroom concept — selling direct at trade shows, state fairs, community events. Piloted in my territory for 12 months, proved unit economics, pitched up the chain — adopted across 40 markets producing $150K–$2M annual revenue per market.

$100M+ Aging Inventory Solved · Enterprise Standard: Invented proprietary aging-inventory comp redesign in my market, proved 29% reduction in dead stock, presented at company conference, adopted as the enterprise standard.

22-Year Track Record at Cellular Sales (Verizon Authorized Partner — $3B+ enterprise scale):
- Regional President & Managing Partner (most recent)
- Drove regional org to #1 national ranking, 112% quota back-to-back
- 200+ person org under direct report
- Full P&L ownership across 25+ territories

EDUCATION: University of Louisville

CORE OPERATING DOMAINS: Revenue Operations · Sales Leadership · GTM Architecture · SaaS Metrics · Compensation Plan Design · Pipeline Forecasting · Sales Team Scaling · CRM Hygiene · Salesforce/HubSpot · Discount Governance · Deal Desk · MEDDPICC · Force Management · Compensation Architecture · Sales Hiring · Ramp Curves · Win Rate Engineering · Churn Reduction · Expansion Revenue · NRR · CAC Payback · Magic Number · Rule of 40 · Founder-Led Sales Transition · AI-Native GTM · Claude Code · Anthropic API`;

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function claudePost(payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
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
      timeout: 18000,
    }, (res) => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(buf) }); }
        catch (e) { resolve({ ok: false }); }
      });
    });
    req.on('error', () => resolve({ ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

function buildSystemPrompt(scoreType) {
  const common = `You are scoring a real candidate's resume against a role a visitor is hiring for. Be honest — don't inflate the score, don't soften gaps. The candidate is Kory White, a 22-year revenue executive. The visitor will see your output directly.

Output ONLY valid JSON in this exact shape:
{
  "score": <integer 0-100>,
  "summary": "<one sentence verdict — 15-25 words>",
  "strengths": [
    "<bullet — concrete, ≤18 words, cite a metric/keyword from the resume>",
    "<bullet>",
    "<bullet>",
    "<bullet>"
  ],
  "gaps": [
    "<bullet — what's missing or weak for THIS role, ≤18 words>",
    "<bullet>",
    "<bullet>"
  ],
  "top_keyword_matches": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "recommendations": [
    "<one specific action that would boost the score 5+ points>",
    "<another action>"
  ]
}

NO prose outside the JSON. NO markdown fences around the JSON. NO commentary before or after.`;

  if (scoreType === 'ats') {
    return common + `

YOUR SCORING LENS — ATS (Applicant Tracking System):
You are simulating how Workday, Greenhouse, Lever, and Taleo would parse and rank this resume against the role. Score 0-100 based on:
- Keyword match density (does resume contain the role's required terms verbatim?)
- Title/level alignment (does the candidate's prior title match the role level?)
- Years-of-experience match
- Industry / domain match
- Required-skill coverage
- Section structure (does it have clear Experience, Skills, Education sections an ATS can parse?)
- Format readability (no tables-as-images, no graphics-only achievements)

A 90+ score means: this resume sails through ATS keyword filters AND lands on a recruiter's screen with strong relevance.
A 70-89 means: it gets past ATS but might be filtered by a strict keyword threshold.
A 50-69 means: it makes the long list but not the short list.
Below 50: ATS filters it out before a human sees it.

Be ruthless on keyword gaps — that's how ATS actually filters.`;
  }

  return common + `

YOUR SCORING LENS — Visual Recruiter (5-second scan):
You are simulating a senior recruiter doing the 5-second-scan test. Score 0-100 based on:
- Time-to-impact: can the recruiter understand the candidate's value in 5 seconds?
- Standout headline metrics ($X ARR, X% quota, etc.) visible without scrolling
- Title/title progression alignment with the role
- Pattern-match: does this look like someone who's already done this role?
- Trust/credibility markers: third-party recognition, named results, named companies
- "Wow factor": is there a story that makes the recruiter forward this to the hiring manager?
- Risk signals: gaps, job-hopping, vague claims, unverifiable numbers

A 90+ score means: recruiter forwards to the hiring manager within 30 seconds with "you need to talk to this person."
A 70-89 means: recruiter shortlists, schedules screen.
A 50-69 means: recruiter saves to "maybe pile."
Below 50: recruiter passes.

A real recruiter cares about the hook in the first 1/3 of the resume. Score the hook hard.`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'POST only' }) };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: false, error: 'scorer offline — API key not configured yet' }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) {}

  const scoreType = String(body.scoreType || '').toLowerCase();
  if (scoreType !== 'ats' && scoreType !== 'recruiter') {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'scoreType must be "ats" or "recruiter"' }) };
  }

  const role = String(body.role || '').slice(0, 200).trim();
  if (!role || role.length < 3) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'role required (job title or short description)' }) };
  }

  const industry = String(body.industry || '').slice(0, 80).trim();
  const yearsRequired = String(body.yearsRequired || '').slice(0, 20).trim();
  const keySkills = String(body.keySkills || '').slice(0, 400).trim();

  // Per-IP rate limit (anti-abuse — prevents someone draining the spend cap)
  const ip = event.headers['x-nf-client-connection-ip']
          || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
          || 'unknown';
  const store = initStore();
  if (store) {
    try {
      const hourKey = `_resume_score_rate/${new Date().toISOString().slice(0,13)}.json`;
      const counts = (await store.get(hourKey, { type: 'json' })) || {};
      counts[ip] = (counts[ip] || 0) + 1;
      if (counts[ip] > RATE_LIMIT_PER_IP_PER_HOUR) {
        return { statusCode: 429, headers: CORS, body: JSON.stringify({ error: 'Rate limit — try again in an hour.' }) };
      }
      await store.setJSON(hourKey, counts);
    } catch (e) {}
  }

  const userMsg = `ROLE THE VISITOR IS HIRING FOR:
${role}${industry ? '\nIndustry: ' + industry : ''}${yearsRequired ? '\nYears required: ' + yearsRequired : ''}${keySkills ? '\nKey skills wanted: ' + keySkills : ''}

CANDIDATE RESUME (Kory White):
${RESUME}

Score this candidate against the role above using your assigned lens. Return ONLY the JSON object.`;

  const r = await claudePost({
    model: HAIKU_MODEL,
    max_tokens: 800,
    system: buildSystemPrompt(scoreType),
    messages: [{ role: 'user', content: userMsg }],
  });

  if (!r.ok) {
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'scorer unavailable, try again in a moment' }) };
  }

  const blocks = (r.data && r.data.content) || [];
  let txt = '';
  for (const b of blocks) { if (b.type === 'text' && b.text) txt += b.text; }

  // Attempt to parse JSON — strip any markdown fence in case Haiku wraps it
  txt = txt.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  let parsed;
  try { parsed = JSON.parse(txt); }
  catch (e) {
    // Try to extract first { ... } block
    const m = txt.match(/\{[\s\S]*\}/);
    if (m) { try { parsed = JSON.parse(m[0]); } catch (e2) {} }
  }

  if (!parsed || typeof parsed.score !== 'number') {
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'scorer returned malformed output, retry' }) };
  }

  // Clamp + sanitize
  parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, scoreType, role, ...parsed }),
  };
};
