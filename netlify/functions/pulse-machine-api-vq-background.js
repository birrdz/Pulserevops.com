// ════════════════════════════════════════════════════════════════════════
// pulse-machine-api-vq-background — direct Anthropic API answerer for
// visitor questions submitted on /themachine.
//
// LOCKED-WORKFLOW LAW (amended 2026-05-31, passcode 4444):
//   "Anytime a user uses the machine, you use the API tokens."
//   Hard cap: $2/day. Kill switch: ANTHROPIC_VQ_ENABLED=false.
//
// Behavior:
//   1. Receives { vq_id, question } from pulse-machine.js submit handler
//   2. Checks kill switch + API key + daily spend cap
//   3. Fires claude-opus-4-8 with a q11133-format prompt
//   4. Writes entry blob with source='visitor-api', pinned_until=now+24h
//   5. Pops from queue.json, clears _visitor_priority.json, pings IndexNow
//   6. On ANY failure → falls back to pulse-machine-visitor-autopilot-background
//      (existing Gemini path) so the visitor still gets an answer
// ════════════════════════════════════════════════════════════════════════

const { getStore } = require('@netlify/blobs');
const { gradeEntry } = require('./lib/grade-entry');

const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const DAILY_CAP_USD = 2.00;        // Locked law 2026-05-31. Owner must type 4444 to change.
const SOFT_BRAKE_FRAC = 0.80;       // Warn at 80% ($1.60), keep firing
const MODEL = 'claude-opus-4-8';   // Latest Opus per system prompt; same price as 4.7
const PIN_HOURS = 24;              // Fresh-answer pin window on library hub

// Approximate Opus 4 pricing per Anthropic docs
const INPUT_PER_M = 15.00;
const OUTPUT_PER_M = 75.00;

function calcCostUsd(inTok, outTok) {
  return (inTok / 1_000_000) * INPUT_PER_M + (outTok / 1_000_000) * OUTPUT_PER_M;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
}

async function getSpendToday(store) {
  const spend = (await store.get('api-spend.json', { type: 'json' })) || {};
  return spend[todayKey()] || { spent_usd: 0, calls: 0 };
}

async function recordSpend(store, costUsd) {
  const spend = (await store.get('api-spend.json', { type: 'json' })) || {};
  const k = todayKey();
  const cur = spend[k] || { spent_usd: 0, calls: 0, started_at: Date.now() };
  cur.spent_usd = +(cur.spent_usd + costUsd).toFixed(4);
  cur.calls += 1;
  cur.last_at = Date.now();
  spend[k] = cur;
  // Trim to last 60 days
  const keys = Object.keys(spend).sort();
  while (keys.length > 60) delete spend[keys.shift()];
  await store.setJSON('api-spend.json', spend);
  return cur;
}

async function fallbackAutopilot(host, vqId, question, reason) {
  console.log('[api-vq] falling back to autopilot:', reason);
  try {
    await fetch(host + '/.netlify/functions/pulse-machine-visitor-autopilot-background', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vq_id: vqId, question }),
    });
  } catch (_e) {}
}

function buildPrompt(question) {
  return `You are a senior revenue-operations operator writing a Knowledge Library entry for Pulse RevOps. The visitor just asked:

"${question}"

Write a comprehensive, gold-format answer in markdown. Match the locked q11133 template EXACTLY:

## Direct Answer
[2-4 sentence punchline. The first line of the answer. NO "TL;DR" header.]

## 1. [First numbered H2 — substantive section name]
[150-300 words. Bold key terms with **bold**. Cite named companies, specific numbers, real frameworks.]

## 2. [Second numbered H2]
[Same depth.]

## 3. [Continue through 5-7 numbered H2 sections]

## [Mermaid flowchart of the central model]
\`\`\`mermaid
flowchart TD
    [model as flowchart]
\`\`\`

## Frameworks at a Glance
[Bulleted list of named frameworks referenced above]

## [Mermaid flowchart of the operating loop]
\`\`\`mermaid
flowchart LR
    [practical cadence as horizontal flowchart]
\`\`\`

## FAQ
**[Question 1]?** [Answer 1]
**[Question 2]?** [Answer 2]
**[Question 3]?** [Answer 3]
**[Question 4]?** [Answer 4]
**[Question 5]?** [Answer 5]

## Bottom Line
[2-4 sentence Monday-morning takeaway]

## Sources
- [Real named source 1 — e.g. Gartner CSO Insights 2024]
- [Real named source 2 — e.g. Pavilion CRO Benchmark Report]
- [Real named source 3 — e.g. Force Management Command of the Message]
- [8-10 real sources total. Real publications, real research firms, real books.]

HARD REQUIREMENTS:
- 1,200+ words minimum (target 1,400-1,800)
- 6+ "## " H2 headings minimum
- EXACTLY 2 mermaid blocks (flowchart TD + flowchart LR)
- 25+ **bold** spans
- 3+ named companies/people referenced
- "## FAQ" section with 5+ Q&As in "**Question?** Answer" format
- NO TL;DR header (the Direct Answer IS the punchline)
- NO banned phrases: delve, tapestry, landscape, holistic, "in today's", ever-evolving, synergy, paradigm shift, game-changer, cutting-edge, state-of-the-art, seamless integration, drive growth, unlock value, unlock potential, needless to say, it's worth noting, it's important to note
- Senior-operator voice. No AI-tells. No "I hope this helps".

Return ONLY the markdown body starting with "## Direct Answer". No preamble.`;
}

exports.handler = async (event) => {
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_e) {}
  const { vq_id: vqId, question } = body;
  if (!vqId || !question) return { statusCode: 400, body: 'missing vq_id or question' };

  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  const host = (process.env.URL || 'https://pulserevops.com').replace(/\/$/, '');

  // GUARD 1: Kill switch
  if (process.env.ANTHROPIC_VQ_ENABLED === 'false') {
    await fallbackAutopilot(host, vqId, question, 'kill_switch');
    return { statusCode: 200, body: JSON.stringify({ ok: false, fallback: 'kill_switch' }) };
  }

  // GUARD 2: API key present
  if (!process.env.ANTHROPIC_API_KEY) {
    await fallbackAutopilot(host, vqId, question, 'no_api_key');
    return { statusCode: 200, body: JSON.stringify({ ok: false, fallback: 'no_api_key' }) };
  }

  // GUARD 3: Daily spend cap
  const today = await getSpendToday(store);
  if (today.spent_usd >= DAILY_CAP_USD) {
    await fallbackAutopilot(host, vqId, question, `spend_cap_${today.spent_usd}`);
    return { statusCode: 200, body: JSON.stringify({ ok: false, fallback: 'spend_cap', spent_usd: today.spent_usd, cap_usd: DAILY_CAP_USD }) };
  }
  if (today.spent_usd >= DAILY_CAP_USD * SOFT_BRAKE_FRAC) {
    console.warn(`[api-vq] soft brake: $${today.spent_usd} of $${DAILY_CAP_USD} (${Math.round(today.spent_usd/DAILY_CAP_USD*100)}%)`);
  }

  // FIRE THE API
  let answerBody = '';
  let inTok = 0, outTok = 0;
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8000,
        messages: [{ role: 'user', content: buildPrompt(question) }],
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      console.error('[api-vq] API err', resp.status, t.slice(0, 300));
      await fallbackAutopilot(host, vqId, question, `api_${resp.status}`);
      return { statusCode: 200, body: JSON.stringify({ ok: false, fallback: 'api_err', status: resp.status }) };
    }
    const json = await resp.json();
    answerBody = (json.content || []).map((c) => c.text || '').join('\n').trim();
    inTok = (json.usage && json.usage.input_tokens) || 0;
    outTok = (json.usage && json.usage.output_tokens) || 0;
    if (!answerBody) {
      await fallbackAutopilot(host, vqId, question, 'empty_response');
      return { statusCode: 200, body: JSON.stringify({ ok: false, fallback: 'empty_response' }) };
    }
  } catch (e) {
    console.error('[api-vq] API throw', e && e.message);
    await fallbackAutopilot(host, vqId, question, 'api_throw');
    return { statusCode: 200, body: JSON.stringify({ ok: false, fallback: 'api_throw' }) };
  }

  // Record spend (always — we paid for it even if grader doesn't love it)
  const cost = calcCostUsd(inTok, outTok);
  const updatedSpend = await recordSpend(store, cost);

  // Grade — don't reject (we already paid) but record the score truthfully
  const grade = gradeEntry(vqId, answerBody);

  // Write entry blob
  const now = Date.now();
  const entry = {
    id: vqId,
    question,
    answer: answerBody,
    tags: ['visitor-asked', 'revops', 'ai-revops', 'sales-ai', 'gtm-future-2027', 'api-direct'],
    sources: [],
    quality_score: grade.score >= 10 ? 10 : grade.score,
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: MODEL,
    gold_format: grade.score >= 10,
    source: 'visitor-api',
    pinned_until: now + PIN_HOURS * 60 * 60 * 1000,
    api_meta: {
      input_tokens: inTok,
      output_tokens: outTok,
      cost_usd: +cost.toFixed(4),
      grader_score: grade.score,
      grader_missing: grade.missing || [],
    },
  };
  await store.setJSON(`answers/${vqId}.json`, entry);

  // Update index — pin to TOP of list
  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const existingIdx = idx.entries.findIndex((e) => e && e.id === vqId);
  if (existingIdx >= 0) idx.entries.splice(existingIdx, 1);
  idx.entries.unshift({
    id: vqId,
    question,
    tags: entry.tags,
    quality_score: entry.quality_score,
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: MODEL,
    source: 'visitor-api',
    pinned_until: entry.pinned_until,
    was_indexed_at: null,
  });
  await store.setJSON('_index.json', idx);

  // Pop from queue.json
  try {
    const queue = (await store.get('queue.json', { type: 'json' })) || { items: [] };
    const before = queue.items.length;
    queue.items = queue.items.filter((it) => it && it.vq_id !== vqId);
    if (queue.items.length !== before) await store.setJSON('queue.json', queue);
  } catch (_e) {}

  // Clear visitor priority flag
  try {
    await store.setJSON('_visitor_priority.json', { active: false, cleared_at: now, cleared_for: vqId });
  } catch (_e) {}

  // Ping IndexNow
  try {
    await fetch(host + '/.netlify/functions/pulse-indexnow-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: vqId }),
    });
  } catch (_e) {}

  console.log(`[api-vq] OK ${vqId} | ${grade.score}/12 | $${cost.toFixed(4)} | day total $${updatedSpend.spent_usd}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      id: vqId,
      url: `https://pulserevops.com/knowledge/${vqId}`,
      grade_score: grade.score,
      cost_usd: +cost.toFixed(4),
      spent_today_usd: updatedSpend.spent_usd,
      cap_usd: DAILY_CAP_USD,
      pinned_until: entry.pinned_until,
    }),
  };
};
