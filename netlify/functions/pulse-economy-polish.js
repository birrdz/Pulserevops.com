// Queue one Gemini polish — returns 202 immediately; work in pulse-economy-polish-background.
// GET ?id=q11129

const { getStore } = require('@netlify/blobs');
const { setInFlight } = require('./lib/economy-polish-entry');

const SITE = process.env.URL || 'https://pulserevops.com';
const SITE_ID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function initStore() {
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  try {
    return getStore('pulse-machine-library');
  } catch {
    return getStore({ name: 'pulse-machine-library', siteID: SITE_ID, token: tok });
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const params = event.queryStringParameters || {};
  let id = String(params.id || '').trim();
  if (!id && event.body) {
    try {
      id = String(JSON.parse(event.body).id || '').trim();
    } catch (_e) {}
  }

  if (params.diag === '1') {
    const { grokApiKey } = require('./lib/economy-answer-llm');
    const hasGemini = !!(
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY
    );
    const gk = grokApiKey();
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        hasGemini,
        hasGrok: !!gk,
        geminiKeyLen: (process.env.GEMINI_API_KEY || '').length,
        grokKeyLen: gk.length,
        polishOrder: 'grok → groq → gemini (polish default)',
      }),
    };
  }

  if (!/^q\d+$/i.test(id)) {
    return {
      statusCode: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, reason: 'id required (q####)' }),
    };
  }

  const store = initStore();
  if (store) {
    try {
      await setInFlight(store, id, 'polishing', 5);
    } catch (_e) {}
  }

  const bgUrl = `${SITE}/.netlify/functions/pulse-economy-polish-background?id=${encodeURIComponent(id)}`;

  try {
    const res = await fetch(bgUrl, { method: 'GET' });
    if (res.status === 202) {
      return {
        statusCode: 202,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ok: true,
          started: true,
          id,
          message: 'Gemini polish running in background (typically 45–120s). Green halo clears when done.',
        }),
      };
    }
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text.slice(0, 400) };
    }
    return {
      statusCode: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: false,
        id,
        reason: 'background_start_failed',
        error: String(err.message || err).slice(0, 300),
      }),
    };
  }
};
