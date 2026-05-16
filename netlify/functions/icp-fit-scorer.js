// icp-fit-scorer — given a target company + your ICP definition, return a
// 1-10 fit score + breakdown across 5 dimensions + go/no-go reasons.

const https = require('https');

function callClaude(payload) {
  return new Promise((resolve) => {
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      timeout: 35000,
    }, (res) => {
      let buf = '';
      res.on('data', c => { buf += c; });
      res.on('end', () => {
        try { resolve({ ok: res.statusCode === 200, status: res.statusCode, data: JSON.parse(buf) }); }
        catch (e) { resolve({ ok: false, status: res.statusCode, raw: buf.slice(0, 400) }); }
      });
    });
    req.on('error', (err) => resolve({ ok: false, status: 0, raw: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 0, raw: 'timeout' }); });
    req.write(body); req.end();
  });
}

const SYSTEM = `You are a senior B2B sales strategist. Given a target company + a rep's ICP definition, score the company's fit on a 1-10 scale and break down WHY across 5 dimensions: Size · Vertical · Buying Mode · Tech Stack · Urgency.

Output ONLY valid JSON, no markdown fences, no preamble. Schema:
{
  "score": <1-10 integer>,
  "verdict": "<one sentence go/skip recommendation>",
  "dimensions": {
    "size":         { "score": <1-10>, "note": "<one-sentence specific evidence>" },
    "vertical":     { "score": <1-10>, "note": "<...>" },
    "buying_mode":  { "score": <1-10>, "note": "<...>" },
    "tech_stack":   { "score": <1-10>, "note": "<...>" },
    "urgency":      { "score": <1-10>, "note": "<...>" }
  },
  "buy_signals": ["<specific positive signal>", "<another>", "<another>"],
  "risks": ["<specific risk>", "<another>"],
  "next_move": "<one concrete next step the rep should take this week>"
}

Rules:
- Reference the target company by name; cite specific evidence (industry context, public stage, common buying patterns) — be operator-direct
- If you genuinely don't have evidence on a dimension, give it a 5 with "Insufficient public data" note
- "Buying Mode" = how they procure SaaS (committee, founder-led, procurement-gated, PLG self-serve, RFP-driven)
- "Urgency" = whether they're likely actively in-market vs cold prospect
- Don't pad — short, specific, decisive`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'POST only' }) };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }

  const company = String(body.company || '').slice(0, 120).trim();
  const companyContext = String(body.companyContext || '').slice(0, 600).trim();
  const icp = String(body.icp || '').slice(0, 800).trim();
  if (!company || !icp) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'company + icp required' }) };
  }

  const userPrompt =
    `Target company: ${company}\n`
    + (companyContext ? `What I know / public context about them:\n${companyContext}\n\n` : '')
    + `My ICP definition:\n${icp}\n\n`
    + `Score the fit now.`;

  const resp = await callClaude({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    system: SYSTEM,
    messages: [{ role: 'user', content: userPrompt }],
  });

  if (!resp.ok) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'api ' + (resp.status || 'err') }) };
  }
  const text = resp.data?.content?.[0]?.text?.trim() || '';
  if (!text) return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'empty response' }) };

  let parsed = null;
  try {
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'parse fail', raw_snippet: text.slice(0, 200) }) };
  }
  if (!parsed || typeof parsed.score !== 'number') {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'bad shape', raw_snippet: text.slice(0, 200) }) };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, fit: parsed }),
  };
};
