'use strict';

const FLASH_LITE_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
];

function geminiApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    ''
  );
}

function stripJsonFence(text) {
  return String(text || '')
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
}

/**
 * Call Gemini with model fallback (Flash Lite first).
 * @param {{ system: string, userParts: object[], generationConfig?: object }} opts
 */
async function geminiGenerate(opts) {
  const key = geminiApiKey();
  if (!key) throw new Error('GEMINI_API_KEY not configured');

  const body = {
    systemInstruction: opts.system ? { parts: [{ text: opts.system }] } : undefined,
    contents: [{ role: 'user', parts: opts.userParts }],
    generationConfig: Object.assign(
      { temperature: 0.1, maxOutputTokens: 4096, responseMimeType: 'application/json' },
      opts.generationConfig || {},
    ),
  };

  let lastErr = null;
  for (const model of FLASH_LITE_MODELS) {
    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/' +
      model +
      ':generateContent?key=' +
      encodeURIComponent(key);
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(opts.timeoutMs || 120000),
      });
      if (r.status === 429 || r.status === 404) {
        lastErr = new Error('gemini ' + model + ' ' + r.status);
        continue;
      }
      if (!r.ok) {
        const t = await r.text();
        throw new Error('gemini ' + model + ' ' + r.status + ': ' + t.slice(0, 200));
      }
      const j = await r.json();
      const text =
        j &&
        j.candidates &&
        j.candidates[0] &&
        j.candidates[0].content &&
        j.candidates[0].content.parts &&
        j.candidates[0].content.parts[0] &&
        j.candidates[0].content.parts[0].text;
      if (!text) throw new Error('gemini empty response');
      return { model, text, raw: j };
    } catch (e) {
      lastErr = e;
      if (e && e.message && !/429|404/.test(e.message)) throw e;
    }
  }
  throw lastErr || new Error('all gemini models failed');
}

module.exports = {
  FLASH_LITE_MODELS,
  geminiApiKey,
  geminiGenerate,
  stripJsonFence,
};
