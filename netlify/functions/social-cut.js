// social-cut — POST { id } → returns X thread + LinkedIn post + Reddit comment
// generated from the library entry. Powers the "✨ Social Studio" button on
// /knowledge/q* entry pages. User-triggered (no cron, no autospend) — only
// fires on click, ~$0.005 per generation in Haiku.

const https = require('https');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function stripDense(md) {
  if (!md) return '';
  let s = String(md);
  s = s.replace(/```mermaid[\s\S]*?```/g, '');
  s = s.replace(/```[\s\S]*?```/g, '');
  s = s.replace(/^\|.*\|\s*$/gm, '');
  s = s.replace(/^[\-:\| ]{3,}$/gm, '');
  s = s.replace(/https?:\/\/[^\s)]+/g, '');
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return s.slice(0, 4500);
}

const SYSTEM = `You are a CRO operator who turns dense library answers into platform-perfect social cuts. Output ONLY a JSON object with this shape, no commentary:

{
  "x_thread": ["tweet 1", "tweet 2", ..., "tweet 6 or 7"],
  "linkedin_post": "single multi-paragraph post string",
  "reddit_comment": "single multi-paragraph comment string"
}

Rules:

X THREAD (5-7 tweets):
- Tweet 1: hook with the spiciest, most contrarian operator take from the answer. <240 chars. NO emoji clutter, ONE sentence punch. Make me want to read more.
- Tweets 2-6: the operator math, named companies/numbers/specifics from the source. Each <260 chars.
- Final tweet: bottom-line + soft CTA "(full operator playbook here: pulserevops.com/knowledge/<id>)" — replace <id> with the real id.
- Voice: real-talk operator, no hashtag spam, no MBA jargon. Cite real numbers and named players.
- NEVER use "🚀" or "💡" or "🔥" — clean.

LINKEDIN POST (250-450 words):
- Start with a 2-line hook (story or contrarian claim)
- 3-5 short paragraphs of operator analysis with specific numbers and named companies
- One bullet list of 3-5 takeaways
- End with: a single question to readers + soft link "(full breakdown → pulserevops.com/knowledge/<id>)"
- Voice: same operator-grade as the source, but accessible. NO motivational speaker tone, no "agree?" begging.

REDDIT COMMENT (150-300 words):
- For r/sales / r/RevOps / r/SaaS audience — knowledgeable, slightly skeptical
- No marketing tone. No CTAs except a single "fwiw I broke this down here: pulserevops.com/knowledge/<id>" at the end
- Lead with the operator-judgment piece, not the conclusion
- Cite real specifics, name names

NEVER fabricate data. If the source says "$110/meeting" use exactly that — don't round to "$100."`;

function callClaude(apiKey, question, answer, id) {
  const payload = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2200,
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `Entry id: ${id}\n\nQuestion: ${question}\n\nAnswer (markdown):\n${stripDense(answer)}\n\nGenerate the social cuts as JSON now.`,
    }],
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 30000,
    }, (res) => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body), raw: body }); }
        catch (e) { resolve({ status: res.statusCode, data: null, raw: body }); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(payload);
    req.end();
  });
}

function parseModelJson(text) {
  let t = String(text || '').trim();
  t = t.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  return JSON.parse(t);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'ANTHROPIC_API_KEY not set' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: CORS, body: 'bad json' }; }

  let { id, question, answer } = body;
  if (id && (!question || !answer)) {
    const store = initStore();
    if (!store) {
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, reason: 'blob store unavailable' }) };
    }
    try {
      const entry = await store.get('answers/' + id + '.json', { type: 'json' });
      if (!entry) {
        return { statusCode: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ok: false, reason: 'entry not found' }) };
      }
      question = entry.question;
      answer = entry.answer;
    } catch (e) {
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, reason: 'blob read error: ' + e.message }) };
    }
  }

  if (!answer || !String(answer).trim()) {
    return { statusCode: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'no answer text' }) };
  }

  try {
    const r = await callClaude(apiKey, question || '', answer, id || '');
    if (r.status !== 200) {
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, reason: 'claude error', status: r.status, raw: r.raw.slice(0, 200) }) };
    }
    const text = r.data?.content?.[0]?.text || '';
    let cuts;
    try { cuts = parseModelJson(text); }
    catch (e) {
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, reason: 'invalid model JSON', raw: text.slice(0, 300) }) };
    }
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' },
      body: JSON.stringify({ ok: true, ...cuts }),
    };
  } catch (e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: e.message }) };
  }
};
