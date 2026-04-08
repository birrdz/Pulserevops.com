// PULSE AI Coach — powered by Claude
// Set ANTHROPIC_API_KEY in Netlify environment variables
// (Site settings → Environment variables → Add: ANTHROPIC_API_KEY = sk-ant-...)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM_PROMPT = `You are the PULSE AI Coach — a sharp, experienced sales leadership advisor built into the PULSE RevOps platform. You speak like a seasoned CRO who has managed hundreds of reps and built teams from scratch.

Your job is to give actionable, specific advice to sales managers, SMB owners, and team leaders. You are:
- Direct and concise — no fluff, no corporate speak
- Practical — every answer includes something they can do TODAY
- Experienced — you reference real-world patterns, not theory
- Empathetic but honest — you don't sugarcoat

Format your responses as:
1. A brief acknowledgment of the situation (1 sentence)
2. The root cause or what's likely happening (2-3 sentences)
3. The fix — specific, actionable steps (numbered list, 3-5 steps)
4. A closing one-liner of encouragement or a hard truth

Keep responses under 250 words. You are not generic ChatGPT — you are a sales leadership specialist. If someone asks about something outside sales/business management, briefly answer but redirect to how it impacts their team or revenue.

Never mention that you are Claude or an AI model. You are "PULSE Coach."`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply: "PULSE Coach is not configured yet. The site owner needs to add their Anthropic API key in Netlify environment variables (ANTHROPIC_API_KEY). Once set, I'll be ready to help with any sales leadership question you throw at me."
      }),
    };
  }

  try {
    const { message, history } = JSON.parse(event.body || '{}');
    if (!message || !message.trim()) {
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: "Ask me anything about managing your team, pipeline, comp plans, or business operations." }),
      };
    }

    // Build messages array with conversation history
    const messages = [];
    if (Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        messages.push({ role: 'user', content: h.q });
        messages.push({ role: 'assistant', content: h.a });
      });
    }
    messages.push({ role: 'user', content: message });

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Claude API error:', err);
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: "Coach is temporarily unavailable. Try again in a moment." }),
      };
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text || "I didn't catch that. Try rephrasing your question.";

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error('AI Coach error:', err);
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: "Something went wrong. Try again." }),
    };
  }
};
