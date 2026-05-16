// laymanize — POST { id } → returns plain-English rewrite of one library entry.
// Strips jargon, vendor lists, mermaid blocks, tables. Outputs ~150-200 word
// "explain like I'm a small-business owner" version. Used by per-entry pages
// and the knowledge.html grid for the "In Layman's Terms?" button.

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

function stripForLayman(md) {
  if (!md) return '';
  // Remove mermaid blocks, tables, and citation/source URLs to keep prompt small
  let s = String(md);
  s = s.replace(/```mermaid[\s\S]*?```/g, '');
  s = s.replace(/```[\s\S]*?```/g, '');
  s = s.replace(/^\|.*\|\s*$/gm, '');
  s = s.replace(/^[\-:\| ]{3,}$/gm, '');
  s = s.replace(/https?:\/\/[^\s)]+/g, '');
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return s.slice(0, 6000);
}

const SYSTEM = `You translate dense RevOps / B2B / startup-finance writing into plain English for a small-business owner who has NEVER worked at a SaaS company.

Rules:
- 150-220 words, NO LONGER.
- Zero jargon. If a word like "ARR", "NRR", "PLG", "ACV", "deal desk", "GTM" appears, replace it with how a normal person would say it.
- No vendor names. No tool names. No consultant names.
- Use the format: 2-3 sentences explaining the company's actual problem, then 3-5 short bullet "what they should do" steps written like advice from a friend.
- Speak in everyday words: "they're losing customers faster than they sign new ones" not "net revenue retention is sub-100".
- Don't say "in 2026" or reference dates. Just describe the situation as it stands.
- Don't say "in layman's terms" or apologize. Just write the explanation.
- End with one short bottom-line sentence in italics.

Output ONLY the rewritten explanation. No headers, no preamble, no "here's the simplified version".`;

function callClaude(apiKey, question, answer) {
  const payload = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: SYSTEM,
    messages: [{
      role: 'user',
      content: `Question: ${question}\n\nDense answer:\n${stripForLayman(answer)}\n\nRewrite the dense answer in plain English per the rules.`,
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
      timeout: 25000,
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

  // If only id was passed, fetch from blob
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
    const r = await callClaude(apiKey, question || '', answer);
    if (r.status !== 200) {
      return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, reason: 'claude error', status: r.status, raw: r.raw.slice(0, 200) }) };
    }
    const text = r.data?.content?.[0]?.text || '';
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' },
      body: JSON.stringify({ ok: true, simplified: text.trim() }),
    };
  } catch (e) {
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: e.message }) };
  }
};
