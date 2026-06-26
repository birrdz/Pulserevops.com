// Grok Imagine image generation — hosted to img/auto/ like gemini-image-lib.
const { coverPrompt, productPrompt, hostImageBytes } = require('./gemini-image-lib');
const { grokApiKey } = require('./load-env');

const GROK_MODELS = ['grok-imagine-image', 'grok-imagine-image-quality'];

function grokKey() {
  return grokApiKey();
}

async function fetchUrlBytes(url) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!r.ok) return null;
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('image/')) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    return buf.length >= 3000 ? buf : null;
  } catch (e) {
    return null;
  }
}

async function genGrokBytes(prompt, modelIdx = 0) {
  const key = grokKey();
  if (!key || modelIdx >= GROK_MODELS.length) return null;
  const model = GROK_MODELS[modelIdx];
  try {
    const r = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        prompt: String(prompt).slice(0, 2000),
        aspect_ratio: '16:9',
        resolution: '1k',
        response_format: 'b64_json',
        n: 1,
      }),
      signal: AbortSignal.timeout(90000),
    });
    if (!r.ok) {
      if (r.status === 429 || r.status >= 500) {
        await new Promise((res) => setTimeout(res, 2000));
      }
      return genGrokBytes(prompt, modelIdx + 1);
    }
    const j = await r.json();
    const row = j.data && j.data[0];
    if (!row) return genGrokBytes(prompt, modelIdx + 1);
    if (row.b64_json) {
      const buf = Buffer.from(row.b64_json, 'base64');
      return buf.length >= 3000 ? buf : null;
    }
    if (row.url) {
      const buf = await fetchUrlBytes(row.url);
      if (buf) return buf;
    }
    return genGrokBytes(prompt, modelIdx + 1);
  } catch (e) {
    return genGrokBytes(prompt, modelIdx + 1);
  }
}

async function grokHostImage(prompt, hint) {
  const buf = await genGrokBytes(prompt);
  return hostImageBytes(buf, hint || prompt);
}

function prefixOf(id) {
  return (String(id).match(/^([a-z]+)/i) || [])[1] || '';
}

async function grokCoverFor(title, id) {
  const pre = prefixOf(id);
  return grokHostImage(coverPrompt(title, pre), `grok-cover-${id}-${title}`);
}

async function grokProductFor(name, id) {
  const pre = prefixOf(id);
  return grokHostImage(productPrompt(name, pre), `grok-product-${id}-${name}`);
}

module.exports = {
  grokKey,
  genGrokBytes,
  grokHostImage,
  grokCoverFor,
  grokProductFor,
};
