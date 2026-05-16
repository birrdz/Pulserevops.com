// Strict proofreader for 10/10 library entries. Uses Gemini 2.0 Flash
// (separate quota from the polish-loop grader so it doesn't interfere).
// POST { key, id } → { ok, id, verdict: 'pass'|'flag', score, issues:[...] }

const { getStore } = require('@netlify/blobs');
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const KEY = 'pulsemachine-writer-2026';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

const RUBRIC = `You are a senior proofreader for a RevOps/SaaS knowledge library entry. Read the entry carefully and flag QUALITY issues a careful editor would catch.

Score 1-10. Return ONLY a single raw JSON object (no markdown fences, no prose):
{"score": <1-10 integer>, "verdict": "pass"|"flag", "issues": ["short specific issue 1", "short specific issue 2", "..."]}

Flag (verdict="flag") if ANY of these are clearly true:
1. Internal contradiction (a number in prose contradicts the table/diagram).
2. Hallucinated vendor or product (a company name that doesn't exist or isn't real in this category).
3. Missing core section (no Direct Answer, no Bottom Line, no sources, no counter-argument, no cross-links).
4. Severe AI tells repeated multiple times: "leverage" as verb, "delve into", "synergy", "best-in-class", "ever-evolving", "in today's fast-paced world", "navigate the complexities of".
5. Direct Answer addresses wrong question.
6. Cross-links to q-IDs that look fabricated or don't match the topic.
7. Broken markdown formatting (unrendered raw markdown, unclosed code fences, malformed tables).
8. Factually wrong by an order of magnitude.

Pass (verdict="pass") if the entry is solid — comprehensively researched, structured, sourced, with risks acknowledged. Minor weaknesses ARE acceptable for pass; flag only on clear issues. Be specific in the issues list; quote exact problem language when possible. Max 5 issues per entry.`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'POST only' };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }
  if (body.key !== KEY) return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad key' }) };

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return { statusCode: 503, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'GEMINI_API_KEY not configured' }) };

  const { id } = body;
  if (!id || !/^q\d+$/.test(id)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad id' }) };

  const tok = process.env.BLOBS_PAT;
  let store;
  try { store = getStore('pulse-machine-library'); }
  catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }

  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { statusCode: 404, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'entry not found' }) };

  // Wider window than the polish-loop grader — proofreader gets to see more
  // of the entry since this is a one-shot quality audit not a hot path.
  const HEAD = 6000;
  const TAIL = 6000;
  const stripped = (entry.answer || '').replace(/```mermaid[\s\S]*?```/g, '[diagram]');
  const entryBody = stripped.length <= HEAD + TAIL
    ? stripped
    : stripped.slice(0, HEAD) + '\n\n…[middle truncated]…\n\n' + stripped.slice(-TAIL);
  const userMsg = `Question: ${entry.question}\n\nAnswer:\n${entryBody}\n\nTags: ${(entry.tags || []).join(', ')}\nSources: ${(entry.sources || []).join(' | ')}`;

  // Try gemini-2.0-flash-lite first (faster, separate daily quota from
  // gemini-2.0-flash which the polish-loop grader is hammering).
  const MODELS = ['gemini-2.0-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
  let r, modelUsed;
  for (const model of MODELS) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(geminiKey);
    try {
      r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: RUBRIC + '\n\nReturn ONLY a single raw JSON object (no markdown fences).' }] },
          contents: [{ role: 'user', parts: [{ text: userMsg }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 500 },
        }),
      });
    } catch (e) { continue; }
    if (r.ok) { modelUsed = model; break; }
    if (r.status === 429 || r.status === 404) continue;
    // Other errors: surface immediately.
    break;
  }
  if (!modelUsed) {
    const errTxt = r ? (await r.text()).slice(0, 250) : 'no model succeeded';
    return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'all gemini models failed', detail: errTxt }) };
  }
  // Re-bind r for the rest of the flow below.
  // (we already have a successful r from the loop)
  // eslint-disable-next-line no-empty
  ;
  try {
    r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: RUBRIC + '\n\nReturn ONLY a single raw JSON object (no markdown fences).' }] },
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 500 },
      }),
    });
  const j = await r.json();
  const text = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text;
  if (!text) return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'gemini empty text' }) };
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  let parsed;
  try { parsed = JSON.parse(cleaned); }
  catch (e) { return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'gemini JSON parse: ' + e.message, raw: cleaned.slice(0, 200) }) }; }

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      id,
      verdict: parsed.verdict === 'pass' ? 'pass' : 'flag',
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 8) : [],
      grader: 'gemini:' + modelUsed,
    }),
  };
};
