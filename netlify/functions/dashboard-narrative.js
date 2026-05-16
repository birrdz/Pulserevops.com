// dashboard-narrative — given a War Room card's title + extracted text content,
// return a 1-paragraph "what this means in plain English" insight.
// Used by the per-card ✨ Insight button.
//
// POST body: { title: string, content: string, cardId?: string }
// Returns: { ok: true, narrative: string } | { ok: false, reason }

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
      timeout: 30000,
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

const SYSTEM_INSIGHT = `You are a senior RevOps operator helping a sales leader read a War Room dashboard card. Given the card's title + the visible numbers/text, produce ONE concise paragraph (60-90 words) that:

- Names the SPECIFIC numbers from the card (e.g. "your 2.3x pipeline coverage" or "the 47% close rate on Q3 deals")
- Says what the number means (good/bad/normal vs benchmark)
- Surfaces ONE specific action or follow-up question the leader should ask their team
- Skips generic platitudes ("focus on what matters") — be operator-specific
- No lists, no headers, no bold — single flowing paragraph
- Tight voice: direct, no padding, no "this dashboard shows..." preamble — start with the insight

If the card text has no real numbers (e.g. shows placeholder text or empty state), respond with: "Add some data to this dashboard and I'll read it back to you."`;

const SYSTEM_COACHING = `You are a senior sales coach. A manager has a generic coaching action for one Rhythm Level (tier of reps). Rewrite that action so it includes the manager's ACTUAL numbers from their House Goals + Pulse Check matrix — specific quotas, KPI gaps, rep counts, industry context.

Constraints:
- Output ONE flowing paragraph (50-70 words), no bullets or headers
- Lead with a concrete number from their context (e.g. "With your 6 reps targeting $4M house goal...")
- Keep the original action's intent (intervention vs build vs stretch vs lead vs recognize) but make the language specific
- Reference at least one number from the manager's data: house goal, rep count, industry KPI, tier weight
- One concrete next step (a question to ask, a meeting to run, a metric to set)
- Direct operator voice — no platitudes, no "remember to..." padding

If the user data is empty/placeholder, respond with: "Set your House Goals + Pulse Check first — then I can personalize this for your team."`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'POST only' }) };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }

  const title = String(body.title || '').slice(0, 200);
  const content = String(body.content || '').slice(0, 4000);
  const mode = String(body.mode || 'insight').toLowerCase();
  if (!title || !content) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'title + content required' }) };
  }

  const system = mode === 'coaching' ? SYSTEM_COACHING : SYSTEM_INSIGHT;
  const userPrompt = mode === 'coaching'
    ? `Tier / Rhythm Level: ${title}\n\nGeneric coaching action + manager's actual context (House Goals, Pulse Check, rep count, industry):\n${content}\n\nRewrite the action with their specific numbers now.`
    : `Card title: ${title}\n\nCard content (visible text + numbers):\n${content}\n\nWrite the operator insight paragraph now.`;

  const resp = await callClaude({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 350,
    system,
    messages: [{ role: 'user', content: userPrompt }],
  });

  if (!resp.ok) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'api ' + (resp.status || 'err') }) };
  }
  const text = resp.data?.content?.[0]?.text?.trim() || '';
  if (!text) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'empty response' }) };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, narrative: text }),
  };
};
