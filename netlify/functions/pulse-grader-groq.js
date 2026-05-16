// Independent grader using Groq's free Llama 3.3 70B. Used by the polish loop
// at the 9→10 gate as a second opinion (the first is a Claude sub-Agent in
// the wake-loop). 10/10 only when BOTH passes — structurally hard to fake.
//
// Cost: $0 — Groq free tier covers 100k tokens/day on Llama 3.3 70B,
// dwarfing actual usage (~2k tokens per grading pass × ~24 grades/day).
//
// POST { key, id } → { ok, id, verdict: 'pass'|'fail', score, issues:[...] }

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

const RUBRIC = `You are an independent quality grader for a RevOps/SaaS knowledge library entry. The writer has walked this entry up a 5-rung polish ladder and claims it now deserves a 10/10. Your job: pragmatically verify it meets the 10/10 bar.

A 10/10 entry should:
1. Have plausible named numbers (ARR, growth %, ACV, etc.) with no glaring internal contradictions.
2. Reference real (not fictional) vendors and products.
3. Include some form of counter-argument or risk section (look for "Bear Case", "Risks", "Counter", "Mitigation", "Downside", or similar — present near the end of long entries).
4. Have a Direct Answer that addresses the question asked.
5. Cite real domain names for sources (look for a Sources or References section).
6. Not contain blatant AI tells (avoid hard-fail on single occurrences; only fail if pervasive).
7. Be reasonably structured (some combination of headers, bullets, tables, diagrams, bottom line).

Return ONLY a single JSON object, no prose, no markdown fences:
{"verdict":"pass"|"fail","score":<1-10 integer>,"issues":["short reason 1","short reason 2"]}

Be pragmatic, not pedantic. The 10/10 bar is "comprehensively researched, structured, sourced, with risks acknowledged" — not "literary masterpiece". Pass entries that clearly meet the spirit of these criteria even if a single criterion has minor weaknesses. Fail only on clear factual errors, missing core sections, or pervasive AI tells.`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'POST only' };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }

  if (body.key !== KEY) return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad key' }) };

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return { statusCode: 503, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'GROQ_API_KEY not configured — set it in Netlify env vars' }) };

  const { id } = body;
  if (!id || !/^q\d+$/.test(id)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad id' }) };

  const tok = process.env.BLOBS_PAT;
  let store;
  try { store = getStore('pulse-machine-library'); }
  catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }

  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { statusCode: 404, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'entry not found' }) };

  // Strip mermaid blocks (they eat tokens without grading value) then
  // middle-truncate so the head (Direct Answer + Operator Playbook) AND tail
  // (Sources + Bear Case + See Also cross-links) both survive — those are the
  // sections the rubric actually checks. Halving total chars vs. front-only
  // truncation doubles daily grader throughput within the same TPD budget.
  const HEAD_CAP = 4000;
  const TAIL_CAP = 4000;
  const rawAnswer = entry.answer || '';
  const stripped = rawAnswer.replace(/```mermaid[\s\S]*?```/g, '[diagram]');
  const entryBody = stripped.length <= HEAD_CAP + TAIL_CAP
    ? stripped
    : stripped.slice(0, HEAD_CAP) + '\n\n…[middle truncated for grader budget]…\n\n' + stripped.slice(-TAIL_CAP);

  const userMsg = `Question: ${entry.question}\n\nAnswer:\n${entryBody}\n\nTags: ${(entry.tags || []).join(', ')}\nSources: ${(entry.sources || []).join(' | ')}`;

  // Primary: Gemini 2.5 Flash via Workspace Pro tier — free at margin
  // (already paid via Workspace subscription). Fallback: Groq Llama 3.1 8B
  // (free). Anthropic API removed 2026-05-12 per owner — they pay $200/mo
  // for Claude.ai Max (Claude Code) and refuse to be billed twice via the
  // pay-as-you-go API account. Anthropic key stays in env for other
  // functions but the cycle's grader does NOT call it.
  let parsed = null;
  let graderUsed = null;
  let primaryError = null;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const gUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(geminiKey);
      const gr = await fetch(gUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: RUBRIC + '\n\nReturn ONLY a single raw JSON object (no markdown fences, no prose).' }] },
          contents: [{ role: 'user', parts: [{ text: userMsg }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 400 },
        }),
      });
      if (gr.ok) {
        const gj = await gr.json();
        const text = gj && gj.candidates && gj.candidates[0] && gj.candidates[0].content && gj.candidates[0].content.parts && gj.candidates[0].content.parts[0] && gj.candidates[0].content.parts[0].text;
        if (text) {
          const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
          try { parsed = JSON.parse(cleaned); graderUsed = 'gemini:2.5-flash'; }
          catch (e) { primaryError = (primaryError ? primaryError + ' | ' : '') + 'gemini JSON parse: ' + e.message; }
        } else { primaryError = (primaryError ? primaryError + ' | ' : '') + 'gemini empty content'; }
      } else {
        primaryError = (primaryError ? primaryError + ' | ' : '') + 'gemini ' + gr.status;
      }
    } catch (e) { primaryError = (primaryError ? primaryError + ' | ' : '') + 'gemini fetch failed: ' + String(e).slice(0, 200); }
  }

  // Fallback 2: Groq Llama 3.1 8B (free).
  if (!parsed && groqKey) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + groqKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          temperature: 0.1,
          max_tokens: 400,
          messages: [
            { role: 'system', content: RUBRIC },
            { role: 'user', content: userMsg },
          ],
          response_format: { type: 'json_object' },
        }),
      });
      if (r.ok) {
        const j = await r.json();
        const raw = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        try { parsed = JSON.parse(raw || '{}'); graderUsed = 'groq:llama-3.1-8b-instant'; }
        catch { primaryError = (primaryError ? primaryError + ' | ' : '') + 'non-JSON from groq'; }
      } else {
        primaryError = (primaryError ? primaryError + ' | ' : '') + 'groq ' + r.status + ' ' + (await r.text()).slice(0, 200);
      }
    } catch (e) { primaryError = (primaryError ? primaryError + ' | ' : '') + 'groq fetch failed: ' + String(e).slice(0, 200); }
  }

  let fallbackError = null;
  if (!parsed) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) { fallbackError = 'no GEMINI_API_KEY in env'; }
    else {
      try {
        const gUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(geminiKey);
        const gr = await fetch(gUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: RUBRIC + '\n\nReturn ONLY a single raw JSON object (no markdown fences, no prose).' }] },
            contents: [{ role: 'user', parts: [{ text: userMsg }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 400 },
          }),
        });
        if (!gr.ok) {
          const errText = (await gr.text()).slice(0, 300);
          fallbackError = 'gemini ' + gr.status + ' ' + errText;
        } else {
          const gj = await gr.json();
          const text = gj && gj.candidates && gj.candidates[0] && gj.candidates[0].content && gj.candidates[0].content.parts && gj.candidates[0].content.parts[0] && gj.candidates[0].content.parts[0].text;
          if (!text) { fallbackError = 'gemini empty text: ' + JSON.stringify(gj).slice(0, 200); }
          else {
            // Strip optional ```json fences in case the model added them.
            const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
            try { parsed = JSON.parse(cleaned); graderUsed = 'gemini:1.5-flash'; }
            catch (e) { fallbackError = 'gemini JSON parse: ' + e.message + ' raw=' + cleaned.slice(0, 200); }
          }
        }
      } catch (e) { fallbackError = 'gemini fetch failed: ' + String(e).slice(0, 200); }
    }
  }

  if (!parsed) {
    return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'all graders failed', primary: primaryError, fallback: fallbackError }) };
  }

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      id,
      verdict: parsed.verdict === 'pass' ? 'pass' : 'fail',
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 8) : [],
      grader: graderUsed || 'unknown',
    }),
  };
};
