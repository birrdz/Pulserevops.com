// cold-email-gen — given a prospect + your value prop, return 3 distinct
// email approaches as JSON: { variant, subject, body, why }
//
// POST { prospectName, company, role, valueProp, industry? }

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

const SYSTEM = `You are a senior B2B sales coach who has written tens of thousands of cold emails. Given a prospect + the rep's value proposition, generate THREE distinct cold-email approaches optimized for reply rate.

Output ONLY valid JSON, no markdown fences, no preamble. Schema:
{
  "emails": [
    {
      "variant": "Direct Value",
      "subject": "<7-word max subject line, no clickbait, no questions>",
      "body": "<60-90 word email body, natural professional tone, ONE specific number/claim, ONE clear ask, no buzzwords like 'synergy' 'leverage' 'best-in-class'>",
      "why": "<one sentence on why this approach works for this prospect>"
    },
    {
      "variant": "Mutual Connection / Referral",
      "subject": "...",
      "body": "<imagines a plausible mutual peer-context, ~60-90 words>",
      "why": "..."
    },
    {
      "variant": "Question Hook",
      "subject": "...",
      "body": "<opens with a sharp business question relevant to the role, ~60-90 words>",
      "why": "..."
    }
  ]
}

Rules:
- Reference the prospect's role + company specifically, not generically
- Each body must include ONE specific quantified claim or stat
- No "I hope this finds you well", no "circling back", no "synergy"
- Subject lines are simple, lowercase fine, 7 words max
- The "Question Hook" variant MUST start with a question
- Bodies should sound like a real human wrote them at midnight, not a marketing machine`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'POST only' }) };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }

  const prospectName = String(body.prospectName || '').slice(0, 80).trim();
  const company = String(body.company || '').slice(0, 120).trim();
  const role = String(body.role || '').slice(0, 80).trim();
  const valueProp = String(body.valueProp || '').slice(0, 600).trim();
  const industry = String(body.industry || '').slice(0, 60).trim();
  if (!prospectName || !company || !role || !valueProp) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'prospectName + company + role + valueProp required' }) };
  }

  const userPrompt =
    `Prospect: ${prospectName}\n`
    + `Title/Role: ${role}\n`
    + `Company: ${company}\n`
    + (industry ? `Industry: ${industry}\n` : '')
    + `\nMy value proposition / what I sell:\n${valueProp}\n\n`
    + `Generate the 3 emails now.`;

  const resp = await callClaude({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
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
  if (!parsed || !Array.isArray(parsed.emails) || !parsed.emails.length) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'bad shape', raw_snippet: text.slice(0, 200) }) };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, emails: parsed.emails }),
  };
};
