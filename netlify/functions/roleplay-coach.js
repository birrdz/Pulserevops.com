// roleplay-coach — multi-turn AE practice conversation. AI plays a prospect
// in a chosen sales scenario; after the rep's 4th turn, returns a final
// scorecard instead of another prospect reply.
//
// POST body:
//   { scenario: string, history: [{role:'user'|'assistant',content:string}, ...] }
// Returns:
//   { ok: true, mode: 'reply' | 'scorecard', text, scoreData? }

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

const SCENARIOS = {
  'cold-call': {
    label: 'Cold Call',
    persona: `You are Alex Reyes, VP of RevOps at a 250-employee mid-market SaaS company. A sales rep just cold-called you. You are mildly skeptical, busy, and have heard 3 similar pitches this month. You give curt, realistic responses (1-2 sentences). You will hang up if rep is generic or doesn't differentiate. You warm up if rep references something specific about your company or asks a sharp question.`,
    opener: `(Phone picks up) Yeah, this is Alex.`,
  },
  'discovery': {
    label: 'Discovery Call',
    persona: `You are Sam Park, Head of Sales at a 400-employee Series C SaaS company. You agreed to a 30-min discovery call. You have a real problem (forecast accuracy is bad — only 60% MoQ accuracy) but you won't volunteer it unless the rep asks layered, smart questions. You answer truthfully but briefly (2-3 sentences). You push back on shallow questions ("Tell me about your team" → "It's a sales team, what specifically?"). You warm up to rep who builds on your answers.`,
    opener: `OK, you've got 30 minutes. What did you want to talk about?`,
  },
  'demo': {
    label: 'Product Demo',
    persona: `You are Jordan Lee, CFO at a 600-employee company evaluating a sales-engagement platform alongside Salesloft and Outreach. You sat in on the demo. You only care about: (1) total cost of ownership, (2) integration complexity with Salesforce, (3) rep adoption rates from similar customers. You ignore feature monologues. You ask hard pointed questions. 2-3 sentence replies max.`,
    opener: `Thanks for the demo. I've got three questions before I bring this to my team.`,
  },
  'negotiation': {
    label: 'Negotiation',
    persona: `You are Riley Chen, Procurement Director at a 800-employee enterprise. The rep's quoted $180K/yr; you're empowered to close at $150K but starting at $120K. You're firm but professional. You use anchoring, silence, and competing offers as leverage. 2-3 sentence replies. You only concede when rep matches with concrete value (not platitudes).`,
    opener: `I'll be direct: your quote came in 35% over budget. Walk me through the value before I take this back to my CFO.`,
  },
  'objection': {
    label: 'Objection Handling',
    persona: `You are Morgan Yates, Director of Operations at a 150-employee growth-stage company. You raise a concrete objection EVERY turn — first about budget, then timing, then "we already use a similar tool", then internal politics. You're not blowing rep off; if they handle objections crisply with proof points, you advance. If rep offers a soft "I hear you" without resolution, you stay stuck.`,
    opener: `Look, this looks fine on paper but honestly we don't have budget for another tool this quarter.`,
  },
};

const REP_TURN_LIMIT = 4;

function buildScorecardPrompt(scenario, history) {
  return `You just played a sales prospect in a ${scenario.label} role-play. The rep made ${REP_TURN_LIMIT} turns. Now switch out of character and act as an honest sales coach. Score the rep on a 1-10 scale and provide structured feedback.

Output EXACTLY this JSON shape, no preamble, no markdown fences:
{
  "score": <1-10 integer>,
  "headline": "<1-sentence summary>",
  "wins": ["<specific thing they did well>", "<another>", "<another>"],
  "improvements": ["<specific thing to work on>", "<another>", "<another>"],
  "next_drill": "<one concrete drill to practice this week>"
}

Reference the rep's actual messages by quoting short phrases. Be operator-direct, not generic.`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'POST only' }) };
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad json' }) }; }

  const scenarioKey = String(body.scenario || '').toLowerCase();
  const scenario = SCENARIOS[scenarioKey];
  if (!scenario) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'unknown scenario', available: Object.keys(SCENARIOS) }) };
  }
  const history = Array.isArray(body.history) ? body.history.slice(-20) : [];
  // Validate shape
  for (const m of history) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'bad history shape' }) };
    }
  }

  // Count rep turns (user messages). After REP_TURN_LIMIT user messages, return scorecard.
  const repTurns = history.filter(m => m.role === 'user').length;
  const isScoreTurn = repTurns >= REP_TURN_LIMIT;

  const system = isScoreTurn
    ? buildScorecardPrompt(scenario, history)
    : scenario.persona + `\n\nRules: stay in character, 1-3 sentence replies, never break character, never reveal you are AI, never coach the rep mid-conversation.`;

  const messages = isScoreTurn
    ? [{ role: 'user', content: 'Score the rep now based on the conversation history. Output the JSON.' }]
    : history.length === 0
      ? [{ role: 'user', content: '(start the role-play)' }]
      : history;

  // For non-score turns, prepend opener as assistant turn if history is empty
  const finalMessages = (!isScoreTurn && history.length === 0)
    ? [{ role: 'user', content: '(start the role-play)' }]
    : messages;

  // For the scoring turn, send full conversation as user content blob so model has all context
  const scoreUserContent = isScoreTurn
    ? 'Conversation transcript:\n' + history.map(m => (m.role === 'user' ? 'REP: ' : 'PROSPECT: ') + m.content).join('\n')
    : null;

  const resp = await callClaude({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: isScoreTurn ? 800 : 250,
    system,
    messages: isScoreTurn
      ? [{ role: 'user', content: scoreUserContent }]
      : finalMessages,
  });

  if (!resp.ok) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'api ' + (resp.status || 'err') }) };
  }
  let text = resp.data?.content?.[0]?.text?.trim() || '';
  if (!text) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'empty response' }) };
  }

  if (isScoreTurn) {
    let scoreData = null;
    try {
      const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      scoreData = JSON.parse(cleaned);
    } catch (e) { /* return text fallback */ }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, mode: 'scorecard', text, scoreData }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, mode: 'reply', text, opener: history.length === 0 ? scenario.opener : null }),
  };
};
