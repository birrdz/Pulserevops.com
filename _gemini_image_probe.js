// Probe Gemini Image models (Nano Banana) — never logs key values.
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  for (const l of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const key =
  (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').trim();

const MODELS = [
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image',
  'gemini-3-pro-image',
  'gemini-3.1-flash-image-preview',
  'gemini-3-pro-image-preview',
];

const PROMPT = 'flat minimal blue business icon, no text';

async function probeGeminiImage(model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        generationConfig: { responseModalities: ['IMAGE'] },
      }),
      signal: AbortSignal.timeout(90000),
    });
    const text = await r.text();
    let j;
    try {
      j = JSON.parse(text);
    } catch (e) {
      return { model, status: r.status, ok: false, bytes: 0, errMsg: text.slice(0, 180) };
    }
    if (j.error) {
      return { model, status: r.status, ok: false, bytes: 0, errMsg: (j.error.message || '').slice(0, 180) };
    }
    const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
    for (const p of parts) {
      const b64 = (p.inlineData && p.inlineData.data) || (p.inline_data && p.inline_data.data);
      if (b64) {
        return { model, status: r.status, ok: true, bytes: Buffer.from(b64, 'base64').length, errMsg: '' };
      }
    }
    return { model, status: r.status, ok: false, bytes: 0, errMsg: 'no image part in response' };
  } catch (e) {
    return { model, status: 0, ok: false, bytes: 0, errMsg: String(e.message || e).slice(0, 180) };
  }
}

(async () => {
  if (!key) {
    console.error('No API key');
    process.exit(1);
  }
  for (const model of MODELS) {
    const r = await probeGeminiImage(model);
    console.log(`${r.model}: status=${r.status} ok=${r.ok} bytes=${r.bytes}${r.errMsg ? ' err=' + r.errMsg : ''}`);
  }
})();
