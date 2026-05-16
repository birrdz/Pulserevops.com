// Improvement grader — used by the 9→10 gate. Loads the entry's 5/10 baseline
// and the current polished candidate, sends BOTH to Groq Llama 3.3 70B with a
// comparison rubric, returns pass/fail.
//
// "Pass" = the candidate is meaningfully more detailed AND more intelligent
// than the baseline. "Fail" = the candidate is mostly the same depth, just
// rephrased — score stays at 9, baseline kept, gate retries on next polish tick.
//
// POST { key, id } → { ok, id, verdict: 'pass'|'fail', improvement_score, missing:[...] }

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

const RUBRIC = `You are an independent improvement grader. You see TWO versions of the same RevOps/SaaS knowledge entry: BASELINE (the original 5/10 draft) and CURRENT (the polished candidate claiming to deserve 10/10).

Verify CURRENT is meaningfully MORE DETAILED and MORE INTELLIGENT than BASELINE. Specifically:

1. CURRENT must have MORE sourced citations than BASELINE — public URLs that look like they resolve to real, relevant pages.
2. CURRENT must have MORE specific verified numbers (real ARRs, growth rates, valuations) where BASELINE used generic placeholders or hand-waving %s.
3. CURRENT must contain an adversarial counter-argument section that BASELINE lacks — a steelmanned bear case, not a strawman.
4. CURRENT must have ≥4 cross-links to other entries (in the form "See also: q1234") that BASELINE either lacks or has fewer of.
5. The argument in CURRENT must be more nuanced — acknowledges trade-offs, edge cases, dissenting views BASELINE skipped.

If CURRENT is just BASELINE with rephrased sentences, swapped synonyms, or padded length without real depth, return fail.
If CURRENT meaningfully advances BASELINE on ≥4 of the 5 criteria above, return pass.

Return ONLY a single JSON object:
{"verdict":"pass"|"fail","improvement_score":<1-10>,"missing":["criterion that wasn't met","..."]}`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(), body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders(), body: 'POST only' };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }
  if (body.key !== KEY) return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad key' }) };

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return { statusCode: 503, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'GROQ_API_KEY not configured' }) };

  const { id } = body;
  if (!id || !/^q\d+$/.test(id)) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'bad id' }) };

  const tok = process.env.BLOBS_PAT;
  let store;
  try { store = getStore('pulse-machine-library'); }
  catch { store = getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok }); }

  const entry = await store.get('answers/' + id + '.json', { type: 'json' });
  if (!entry) return { statusCode: 404, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'entry not found' }) };

  const baseline = entry.baseline_answer_v5;
  const current  = entry.answer;
  if (!baseline || !current) {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({
      ok: false, reason: 'baseline or current answer missing — cannot compare. Likely a legacy entry from before baseline tracking landed.',
    }) };
  }

  const CAP = 10000;
  const userMsg = `BASELINE (5/10):\n${baseline.slice(0, CAP)}\n\n=====\n\nCURRENT (claims 10/10):\n${current.slice(0, CAP)}`;

  let groqResp;
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + groqKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        max_tokens: 400,
        messages: [
          { role: 'system', content: RUBRIC },
          { role: 'user', content: userMsg },
        ],
        response_format: { type: 'json_object' },
      }),
    });
    if (!r.ok) {
      const txt = await r.text();
      return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'groq error ' + r.status, detail: txt.slice(0, 300) }) };
    }
    groqResp = await r.json();
  } catch (e) {
    return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ ok: false, reason: 'groq fetch failed', detail: String(e).slice(0, 200) }) };
  }

  const raw = groqResp.choices && groqResp.choices[0] && groqResp.choices[0].message && groqResp.choices[0].message.content;
  let parsed;
  try { parsed = JSON.parse(raw || '{}'); }
  catch { return { statusCode: 200, headers: { ...corsHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, id, verdict: 'fail', improvement_score: 0, missing: ['grader returned non-JSON'], raw }) }; }

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      id,
      verdict: parsed.verdict === 'pass' ? 'pass' : 'fail',
      improvement_score: typeof parsed.improvement_score === 'number' ? parsed.improvement_score : 0,
      missing: Array.isArray(parsed.missing) ? parsed.missing.slice(0, 8) : [],
      grader: 'groq:llama-3.3-70b-versatile',
      compared: { baseline_chars: baseline.length, current_chars: current.length },
    }),
  };
};
