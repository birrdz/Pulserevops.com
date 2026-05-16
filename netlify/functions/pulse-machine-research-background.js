// ════════════════════════════════════════════════════════════════════════
// pulse-machine-research-background — the SNOWBALL.
//
// Hourly cron. Each run:
//  1. Picks the next-priority question from the queue (or a seed if queue empty)
//  2. Researches via Sonnet 4.6 + web_search (max 4 searches)
//  3. Stores a deeply-grounded answer + cited sources in the library
//  4. Asks Sonnet to spawn 2-3 follow-up questions inspired by the research
//  5. Pushes those follow-ups back into the queue
//
// The queue grows faster than the cron drains it → infinite library.
// Hard daily spend cap so cost can't run away.
//
// Storage layout (Netlify Blob "pulse-machine-library"):
//   answers/<id>.json           — { id, question, answer, tags, sources, ts, model }
//   _index.json                 — { entries: [{ id, question, tags, ts }] } — fast scan
//   queue.json                  — { items: [{ q, parent_id, ts, priority }] }
//   _meta.json                  — { spend_today, day, runs_today, last_run }
// ════════════════════════════════════════════════════════════════════════
const https = require('https');
const SEED_QUESTIONS = require('./pulse-machine-questions.js');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

// ── Config ─────────────────────────────────────────────────────────────
const SONNET_MODEL       = 'claude-sonnet-4-6';
const HAIKU_MODEL        = 'claude-haiku-4-5-20251001';
const MAX_WEB_SEARCHES   = 4;
const MAX_TOKENS_OUT     = 1400;
const SPAWN_COUNT        = 10;            // 5 micro-niche + 3 modern-exec + 2 trunk
const DAILY_SPEND_CAP    = 0;             // 2026-04-30: ALL SPENDING OFF per owner — cap=0 halts every run
const ESTIMATED_COST_USD = 0.063;         // Sonnet answer (~$0.060) + Haiku spawn (~$0.003)

const RESEARCH_SYSTEM = `You are The Machine — the all-knowing subject-matter expert for the SALES / GTM / SAAS / REVENUE-LEADERSHIP arena.

You are about to research and answer a single question for your knowledge library. The page will be read by humans AND scraped by AI search engines (Google's "People Also Ask," Perplexity, ChatGPT) — so structure for both.

REQUIRED STRUCTURE (Answer Engine Optimization):

1. **DIRECT ANSWER BLOCK (first paragraph)** — exactly 40-50 words. Lead with a clear definition or "Yes / No / Here's how" statement. This is "snippet bait" for Google's featured-result boxes. No preamble, no "great question," no scene-setting. Just the answer.

2. **THE DETAIL** (next 200-260 words) — conversational-expert tone (Pavilion-podcast voice, not corporate-filler). Use markdown:
   - Numbered lists (1. 2. 3.) for actionable steps
   - Bulleted lists (-) for key takeaways
   - **Bold** for critical terms / numbers / vendor names
   - Markdown tables for benchmarks
   - Short paragraphs — AI search prefers "clippable" chunks over walls of text

3. **VISUAL (required, always) — pick the shape that BEST FITS the answer. Diversity is secondary.**

Your job is to pick the visual that maps cleanest to the answer's actual structure. If two types both genuinely fit, prefer the less-used one for variety. But never force a "creative" diagram type onto an answer it doesn't fit — wrong shape is worse than predictable shape.

Decision rule, in order:
   (a) Does the answer involve time/sequence/ramp? → \`gantt\`
   (b) Does it involve 2+ roles handing off / interacting? → \`sequenceDiagram\`
   (c) Does it involve discrete states / transitions / tiers? → \`stateDiagram-v2\`
   (d) Does it boil down to "% goes where" / mix breakdown? → \`pie\`
   (e) Is it a taxonomy / "four pillars of X" / framework? → \`mindmap\`
   (f) Is it historical evolution / milestones over years? → \`timeline\`
   (g) Is it a 2x2 / effort×impact / prioritization grid? → \`quadrantChart\`
   (h) Is it process / decision tree / conditional logic? → \`flowchart LR\`
   (i) Is it org chart / escalation path / hiring funnel? → \`flowchart TB\`
   (j) Is it primarily a comparison across rows × columns (e.g., "5 benchmarks across 4 segments")? → **markdown table** (no Mermaid). Tables are better than forcing a diagram.

**Mermaid syntax discipline — the diagram MUST render. Before you submit:**
   - First non-blank line declares the diagram type exactly (no leading words, no commentary)
   - Balance every \`[\`, \`(\`, \`{\` with its closing pair
   - For \`pie\`: every slice is \`"label" : number\` (quotes mandatory, decimals OK)
   - For \`gantt\`: include \`dateFormat YYYY-MM-DD\` on its own line near the top
   - For \`sequenceDiagram\`: declare participants before use; use \`->>\` (sync) or \`-->>\` (async), never \`<-->\` or \`--->>>\`
   - Node labels with parentheses, colons, or quotes must be wrapped in quotes: \`A["Label (with parens)"]\`
   - 6-12 nodes. Output as a \`\`\`mermaid fenced block. Validate it mentally before closing the fence.

A broken Mermaid block fails to render and looks worse than no visual. If you're not confident in the syntax for a complex diagram, fall back to a simpler structure or a markdown table — clarity > ambition. **Skipping the visual entirely is not an option.**

CONTENT RULES:
- DENSE with concrete numbers, named vendors, named frameworks (Pavilion, Bridge Group, OpenView, SaaStr, MEDDPICC, named CROs, etc.)
- CURRENT — use web_search for data ≤ 90 days old when the question touches benchmarks, comp, hiring, vendor moves, or industry shifts
- DIRECT — no hedging, no corporate filler, opinions defended with reasoning

VOICE — OPERATOR-LED, NOT THOUGHT-LEADER:
Speak like a CRO with a P&L, not a thought-leadership LinkedIn post. Use the actual vocabulary of the discipline: ARR, NRR, GRR, magic number, CAC payback, rule of 40, comp accelerators, OTE design, ramp curves, deal velocity, pipeline coverage, win-rate by segment, attainment curves, gross margin, deal desk, MEDDPICC, Force Management, Challenger, Sandler. Name vendors. Name books. Name people. Numbers over adjectives. Specifics over generalities.

BANNED PHRASES — never use any of these (they signal AI ghost-writer, kill credibility on contact):
"landscape" · "tapestry" · "leverage" (as a verb — say "use") · "utilize" (say "use") · "in today's digital age" · "in today's rapidly evolving" · "in today's competitive market" · "holistic" · "synergy" · "synergies" · "paradigm shift" · "game-changer" · "game-changing" · "best-in-class" · "world-class" · "cutting-edge" · "state-of-the-art" · "streamline" · "seamless integration" · "robust" (as a generic adjective) · "delve" · "delve into" · "dive into" · "navigate the" · "ever-evolving" · "ever-changing" · "unlock value" · "unlock potential" · "drive growth" (as a closer) · "let me explain" · "it's important to note" · "it's worth noting" · "needless to say"

If you're tempted to use any of those, REWRITE the sentence with a concrete claim, a number, or a specific named example instead.

Total output: ~340-380 words including the diagram.

After your answer, on a separate line that starts with "TAGS:", list 3-6 short topic tags (lowercase, hyphenated, comma-separated, e.g. "comp,ote,enterprise-ae,series-b").

Do NOT include follow-up questions — those are generated separately by a different model.

Example tail:
TAGS: comp,ote,enterprise-ae,saas,series-b`;

// Haiku spawns 10 follow-ups in three buckets and self-gates with the RevOps Test.
const SPAWN_SYSTEM = `You are The Machine's queue-spawner. You just got an answered research entry. Your job: generate exactly 10 sharp follow-up questions that will become the next research targets.

The 10 follow-ups must split into three buckets:

5 × MICRO_NICHE — deep-dive specifics on the answer just provided. Drill into named vendors, specific numbers, role-specific variants, industry verticals, edge cases. (Example for an OTE answer: "How do enterprise AE accelerators differ between PLG and sales-led companies?")

3 × MODERN_EXEC — how this topic plays in 2026 specifically. Recent vendor moves, AI-tooling integration, hybrid/remote shifts, current funding climate, post-ZIRP comp norms. (Example: "How are CROs adjusting AE comp after the 2025 SaaS efficiency reset?")

2 × TRUNK — high-level "trunk of the sales tree" questions to keep coverage broad and avoid rabbit-hole drift. (Example: "What's the right comp philosophy for a founder-led B2B sales org?")

THE REVOPS TEST — every question you generate MUST pass: "Would a Chief Revenue Officer or VP Sales actually care about this in their day-to-day right now?" If a question would only matter to a niche specialist outside that role, scrap it and write a different one in the same bucket. No 1980s history. No academic theory. No off-domain trivia.

Output ONLY a JSON array of 10 objects in this exact shape, no preamble, no closing prose:

[
  {"q": "<question>", "type": "micro_niche"},
  {"q": "<question>", "type": "micro_niche"},
  {"q": "<question>", "type": "micro_niche"},
  {"q": "<question>", "type": "micro_niche"},
  {"q": "<question>", "type": "micro_niche"},
  {"q": "<question>", "type": "modern_exec"},
  {"q": "<question>", "type": "modern_exec"},
  {"q": "<question>", "type": "modern_exec"},
  {"q": "<question>", "type": "trunk"},
  {"q": "<question>", "type": "trunk"}
]`;

// ── Anthropic API ──────────────────────────────────────────────────────
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
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(data), raw: data }); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Blob store init (auto-context first, explicit token fallback) ──────
function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) {
    try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); }
    catch (e) { return null; }
  }
  try { return getStore('pulse-machine-library'); }
  catch (e) { return null; }
}

// ── Queue + library helpers ────────────────────────────────────────────
async function getQueue(store) {
  try { return (await store.get('queue.json', { type: 'json' })) || { items: [] }; }
  catch (e) { return { items: [] }; }
}
async function getIndex(store) {
  try { return (await store.get('_index.json', { type: 'json' })) || { entries: [] }; }
  catch (e) { return { entries: [] }; }
}
async function getMeta(store) {
  try { return (await store.get('_meta.json', { type: 'json' })) || { spend_today: 0, day: '', runs_today: 0 }; }
  catch (e) { return { spend_today: 0, day: '', runs_today: 0 }; }
}
async function saveJson(store, key, val) {
  try { await store.setJSON(key, val); return true; }
  catch (e) { console.error('[research] save err', key, e && e.message); return false; }
}

function dayKey() { return new Date().toISOString().slice(0, 10); }
function makeId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

// Pick the next question — first from queue, else a seed not yet answered
function pickNextQuestion(queue, indexEntries) {
  const answered = new Set(indexEntries.map(e => normalize(e.question)));
  // Filter queue items that haven't already been answered
  const fresh = (queue.items || []).filter(it => !answered.has(normalize(it.q)));
  if (fresh.length) {
    // Sort: explicit priority first, then oldest-first
    fresh.sort((a, b) => (b.priority || 0) - (a.priority || 0) || (a.ts || 0) - (b.ts || 0));
    return { question: fresh[0].q, source: 'queue', parent_id: fresh[0].parent_id || null, queueItem: fresh[0] };
  }
  // Fallback to seed bank
  const seedsLeft = SEED_QUESTIONS.filter(q => !answered.has(normalize(q)));
  if (!seedsLeft.length) return null;
  const pick = seedsLeft[Math.floor(Math.random() * seedsLeft.length)];
  return { question: pick, source: 'seed', parent_id: null, queueItem: null };
}
function normalize(s) {
  return String(s || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Parse Sonnet's research output: answer body + TAGS line. Follow-ups are
// no longer in this output — they're generated by a separate Haiku call.
// Lenient: accepts case variations, markdown bolding, and alt header words
// (Tags / Topics / Categories / Keywords). The 20% of entries missing tags
// historically all matched a format the strict regex didn't catch.
function parseResearchOutput(raw) {
  const text = String(raw || '').trim();
  // Strip surrounding markdown bold + match a header word + colon + tag list.
  // Examples that now match: "TAGS: a,b,c" · "Tags: a, b" · "**Topics:** a · b"
  // · "Categories: a · b" · "Keywords - a, b". Also handles ` separators.
  const tagMatch = text.match(/(?:^|\n)\s*\**\s*(?:tags?|topics?|categor(?:y|ies)|keywords?)\s*\**\s*[:\-–—]\s*(.+?)(?:\n\n|\n\*|$)/i);
  const answerEnd = tagMatch ? tagMatch.index : text.length;
  const answer = text.slice(0, answerEnd).trim();
  const tags = tagMatch
    ? tagMatch[1]
        .replace(/\*\*/g, '')
        .split(/[,·•|]/)
        .map(t => t.trim().toLowerCase().replace(/^[#-]+/, '').replace(/[\.\s]+$/, ''))
        .filter(t => t && t.length < 50 && /^[a-z0-9-]+$/.test(t.replace(/\s+/g, '-')))
        .map(t => t.replace(/\s+/g, '-'))
        .slice(0, 8)
    : [];
  return { answer, tags };
}

// Haiku fallback — when the primary parse extracts <2 tags, generate tags
// post-hoc from the question + answer. ~$0.001/call. Only fires on miss.
async function fallbackTags(question, answer) {
  try {
    const r = await claudePost({
      model: HAIKU_MODEL,
      max_tokens: 80,
      system: 'You generate 3-6 short topic tags for a Sales/RevOps knowledge-library entry. Output ONLY the tags, lowercase, hyphenated, comma-separated. No prose. Example: comp,ote,enterprise-ae,saas,series-b',
      messages: [{ role: 'user', content: 'QUESTION: ' + String(question).slice(0, 200) + '\n\nANSWER (excerpt):\n' + String(answer).slice(0, 1200) + '\n\nReturn 3-6 tags only.' }],
    });
    if (!r.ok) return [];
    const blocks = (r.data && r.data.content) || [];
    let txt = '';
    for (const b of blocks) { if (b.type === 'text' && b.text) txt += b.text; }
    return txt
      .replace(/\*\*/g, '')
      .replace(/^.*?:\s*/, '') // drop "Tags:" prefix if Haiku adds one
      .split(/[,\n·]/)
      .map(t => t.trim().toLowerCase().replace(/^[#-]+/, '').replace(/[\.\s]+$/, ''))
      .filter(t => t && t.length < 50)
      .map(t => t.replace(/\s+/g, '-'))
      .filter(t => /^[a-z0-9-]+$/.test(t))
      .slice(0, 8);
  } catch (e) { return []; }
}

// Spawn 10 follow-ups via Haiku — cheap, fast, RevOps-gated. Returns array
// of {q, type} objects, or [] on failure.
async function spawnFollowups(question, answer, tags) {
  try {
    const userMsg = 'ORIGINAL QUESTION: ' + question
      + '\n\nANSWER (excerpt):\n' + String(answer).slice(0, 1200)
      + '\n\nTAGS: ' + (tags || []).join(', ');
    const r = await claudePost({
      model: HAIKU_MODEL,
      max_tokens: 800,
      system: SPAWN_SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    });
    if (!r.ok) { console.warn('[research] spawn fail', r.status); return []; }
    const blocks = r.data.content || [];
    let raw = '';
    for (const b of blocks) if (b.type === 'text' && b.text) raw += b.text;
    raw = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
    let arr = null;
    try { arr = JSON.parse(raw); } catch (e) {
      const m = raw.match(/\[[\s\S]*\]/);
      if (m) { try { arr = JSON.parse(m[0]); } catch (e2) {} }
    }
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(it => it && typeof it.q === 'string')
      .map(it => ({
        q:    String(it.q).trim().slice(0, 240),
        type: ['micro_niche','modern_exec','trunk'].includes(String(it.type)) ? String(it.type) : 'micro_niche',
      }))
      .filter(it => it.q.length > 10)
      .slice(0, 10);
  } catch (e) { console.warn('[research] spawn err', e && e.message); return []; }
}

// ── Handler ────────────────────────────────────────────────────────────
exports.handler = async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[research] ANTHROPIC_API_KEY missing');
    return { statusCode: 200, body: 'no key' };
  }
  const store = initStore();
  if (!store) {
    console.error('[research] blob store unavailable — set NETLIFY_BLOBS_TOKEN env var');
    return { statusCode: 200, body: 'no store' };
  }

  // ── Emergency-stop check ────────────────────────────────────────────
  // Admin can flip `_pause.json` { paused: true } via /admin to halt the
  // snowball without redeploying. Useful if costs spike or research goes
  // off-rails.
  try {
    const pause = await store.get('_pause.json', { type: 'json' });
    if (pause && pause.paused) {
      console.log('[research] paused via admin');
      return { statusCode: 200, body: 'paused' };
    }
  } catch (e) {}

  // ── Daily spend cap ─────────────────────────────────────────────────
  const today = dayKey();
  let meta = await getMeta(store);
  if (meta.day !== today) { meta = { spend_today: 0, day: today, runs_today: 0 }; }
  if (meta.spend_today >= DAILY_SPEND_CAP) {
    console.log('[research] daily cap hit:', meta.spend_today);
    return { statusCode: 200, body: 'cap reached' };
  }

  // ── Pick next question ──────────────────────────────────────────────
  const [queue, idx] = await Promise.all([getQueue(store), getIndex(store)]);
  const pick = pickNextQuestion(queue, idx.entries);
  if (!pick) {
    console.log('[research] nothing to answer (queue empty + all seeds done)');
    return { statusCode: 200, body: 'nothing left' };
  }
  const { question, source, parent_id, queueItem } = pick;
  console.log('[research]', source, '→', question.slice(0, 80));

  // ── Research call (Sonnet — answer + tags only, no followups) ──────
  let response;
  try {
    response = await claudePost({
      model: SONNET_MODEL,
      max_tokens: MAX_TOKENS_OUT,
      system: RESEARCH_SYSTEM,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: MAX_WEB_SEARCHES }],
      messages: [{ role: 'user', content: question }],
    });
  } catch (e) {
    console.error('[research] api err', e && e.message);
    return { statusCode: 200, body: 'api err' };
  }
  if (!response.ok) {
    const errSnip = (response.raw || '').toString();
    console.error('[research] api fail', response.status, errSnip.slice(0, 240));
    // Out-of-credit → email Kory once (12h throttled), so they know to top up.
    if (/credit balance.*low|insufficient|quota|billing/i.test(errSnip)) {
      try {
        const apiKey = process.env.RESEND_API_KEY || process.env.resendapikey;
        const to     = process.env.ALERT_TO_EMAIL || process.env.alert_to_email;
        const from   = process.env.ALERT_FROM_EMAIL || 'onboarding@resend.dev';
        const last   = (await store.get('_credit_alert.json', { type: 'json' })) || {};
        if (apiKey && to && (!last.ts || (Date.now() - last.ts) > 12 * 60 * 60 * 1000)) {
          await store.setJSON('_credit_alert.json', { ts: Date.now(), source: 'research-cron' });
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from, to: [to],
              subject: '🟠 Pulse Machine credits exhausted (snowball cron)',
              html: '<div style="font-family:-apple-system,sans-serif;max-width:520px;padding:18px 22px;border:1px solid #e5e5e5;border-radius:10px;"><h2 style="margin:0 0 10px;font-size:18px;color:#E8710A;">The Machine is out of credits</h2><p style="margin:0 0 8px;color:#333;">The hourly research cron just got <code>credit balance too low</code> from Anthropic. The snowball has stopped growing.</p><p style="margin:0 0 14px;color:#333;">Top up at <a href="https://console.anthropic.com/settings/billing">console.anthropic.com</a> to wake it.</p></div>',
            }),
          });
        }
      } catch (_e) {}
    }
    return { statusCode: 200, body: 'api fail' };
  }

  // Concat text blocks; collect web-search citation URLs
  const blocks = response.data.content || [];
  let raw = '';
  const sources = [];
  for (const b of blocks) {
    if (b.type === 'text' && b.text) raw += b.text;
    if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) {
      for (const r of b.content) {
        if (r && r.url && r.title) sources.push({ title: r.title, url: r.url });
      }
    }
  }

  let { answer, tags } = parseResearchOutput(raw);
  if (!answer || answer.length < 60) {
    console.warn('[research] empty/short answer, skip');
    return { statusCode: 200, body: 'empty' };
  }

  // Tag fallback — if primary parse extracted <2 tags, fire a cheap Haiku call
  // to generate them post-hoc. Catches cases where Sonnet forgot the TAGS line
  // or formatted it in a way the regex didn't catch.
  if (tags.length < 2) {
    try {
      const fb = await fallbackTags(question, answer);
      if (fb.length >= 2) {
        console.log('[research] tag fallback ok · got ' + fb.length + ' tags');
        tags = fb;
      }
    } catch (e) { /* keep going with whatever tags we have */ }
  }

  // ── Persist answer to library ───────────────────────────────────────
  const id = makeId();
  const entry = {
    id,
    question,
    answer,
    tags,
    sources: sources.slice(0, 6),
    ts: Date.now(),
    model: SONNET_MODEL,
    parent_id,
  };
  await saveJson(store, 'answers/' + id + '.json', entry);

  // ── Update _index for fast scan ─────────────────────────────────────
  const newIndex = {
    entries: [
      { id, question, tags, ts: entry.ts },
      ...(idx.entries || []),
    ].slice(0, 5000), // cap to keep index light
  };
  await saveJson(store, '_index.json', newIndex);

  // ── Spawn 10 follow-ups via Haiku (cheap, RevOps-gated) ─────────────
  const followups = await spawnFollowups(question, answer, tags);
  console.log('[research] spawned', followups.length, 'followups');

  // ── Update queue: remove this Q, add follow-ups (typed) ─────────────
  // micro_niche / modern_exec / trunk metadata stays on each item so future
  // priority sorting can favor breadth over depth or vice versa.
  let newQueueItems = (queue.items || []).filter(it => normalize(it.q) !== normalize(question));
  for (const fu of followups) {
    if (newQueueItems.some(it => normalize(it.q) === normalize(fu.q))) continue;
    // Trunk questions get higher priority so they pull queue back to broad coverage
    const priority = fu.type === 'trunk' ? 3 : (fu.type === 'modern_exec' ? 2 : 1);
    newQueueItems.push({ q: fu.q, type: fu.type, parent_id: id, ts: Date.now(), priority });
  }
  // Cap queue at 8000 to avoid runaway
  if (newQueueItems.length > 8000) newQueueItems = newQueueItems.slice(-8000);
  await saveJson(store, 'queue.json', { items: newQueueItems });

  // ── Update meta: count today's spend + runs ─────────────────────────
  meta.spend_today = +(meta.spend_today + ESTIMATED_COST_USD).toFixed(3);
  meta.runs_today = (meta.runs_today || 0) + 1;
  meta.last_run = Date.now();
  meta.last_question = question.slice(0, 200);
  await saveJson(store, '_meta.json', meta);

  console.log('[research] ok · id=' + id + ' tags=' + tags.join(',') + ' followups=' + followups.length + ' spend_today=$' + meta.spend_today);
  return { statusCode: 200, body: JSON.stringify({ ok: true, id, tags, followups: followups.length, spend: meta.spend_today }) };
};
