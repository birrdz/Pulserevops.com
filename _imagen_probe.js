// Probe Imagen models — never logs key values.
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

console.log('GEMINI_API_KEY:', key ? `SET (len=${key.length})` : 'MISSING');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? `SET (len=${process.env.GOOGLE_API_KEY.length})` : 'MISSING');
console.log('GOOGLE_GENERATIVE_AI_API_KEY:', process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'SET' : 'MISSING');

const MODELS = [
  'imagen-4.0-fast-generate-001',
  'imagen-4.0-generate-001',
  'imagen-3.0-generate-002',
  'imagen-3.0-generate-001',
  'imagen-3.0-fast-generate-001',
];

const PROMPT = 'flat minimal blue business icon, no text';

async function probeModel(model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${key}`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' },
      }),
      signal: AbortSignal.timeout(90000),
    });
    const text = await r.text();
    let errMsg = '';
    try {
      const j = JSON.parse(text);
      errMsg = (j.error && j.error.message) || '';
      if (!errMsg && j.predictions && j.predictions[0]) {
        const p = j.predictions[0];
        const b64 = p.bytesBase64Encoded || (p.image && p.image.imageBytes);
        return { model, status: r.status, ok: !!b64, bytes: b64 ? Buffer.from(b64, 'base64').length : 0, errMsg: '' };
      }
    } catch (e) {
      errMsg = text.slice(0, 200);
    }
    return { model, status: r.status, ok: false, bytes: 0, errMsg: errMsg.slice(0, 180) };
  } catch (e) {
    return { model, status: 0, ok: false, bytes: 0, errMsg: String(e.message || e).slice(0, 180) };
  }
}

(async () => {
  if (!key) {
    console.error('No API key found');
    process.exit(1);
  }
  for (const model of MODELS) {
    const r = await probeModel(model);
    console.log(`${r.model}: status=${r.status} ok=${r.ok} bytes=${r.bytes}${r.errMsg ? ' err=' + r.errMsg : ''}`);
  }
})();
