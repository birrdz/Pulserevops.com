// Image helpers: Gemini Image (paid), Pollinations (free), Gemini query refinement.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { geminiApiKey: resolveGeminiKey } = require('./load-env');

const IMG_DIR = path.join(__dirname, '../../../img/auto');
const PUB_BASE = 'https://pulserevops.com/img/auto/';
const POLL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

// Gemini Image models (Nano Banana) — Imagen predict endpoints are deprecated + paid-only.
const GEMINI_IMAGE_MODELS = [
  'gemini-2.5-flash-image',
  'gemini-3.1-flash-image',
  'gemini-3-pro-image',
];

let IMAGEN_OK = false;
let IMAGEN_STATUS = 'unprobed';
let imagenProbePromise = null;

function geminiKey() {
  return resolveGeminiKey();
}

function imagenStatus() {
  return { ok: IMAGEN_OK, status: IMAGEN_STATUS, keyPresent: !!geminiKey() };
}

function logImagenStatus() {
  const key = geminiKey();
  if (!key) {
    console.log('[gemini-image] GEMINI_API_KEY missing — paid Gemini skipped unless pipeline reaches last resort');
    return;
  }
  if (IMAGEN_OK) {
    console.log('[gemini-image] Gemini Image (paid) available — last-resort slot only per image-pipeline-law');
    return;
  }
  if (IMAGEN_STATUS === 'paid_plan_required') {
    console.log('[gemini-image] Billing required — enable paid plan at https://ai.dev/projects (link GEMINI_API_KEY project to billing)');
  } else if (IMAGEN_STATUS === 'free_tier_quota') {
    console.log('[gemini-image] Key is on free tier (no image quota) — enable billing at https://ai.dev/projects or use a paid-project API key');
  } else {
    console.log(`[gemini-image] Gemini Image unavailable (${IMAGEN_STATUS}) — Pollinations fallback`);
  }
}

function slugFor(q) {
  const base = String(q || 'topic')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 48);
  const h = crypto.createHash('md5').update(String(q)).digest('hex').slice(0, 8);
  return `${base}-${h}`;
}

function canWriteAutoDir() {
  try {
    fs.mkdirSync(IMG_DIR, { recursive: true });
    fs.accessSync(IMG_DIR, fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function coverPrompt(title, prefix) {
  const t = String(title || '').slice(0, 100);
  const topical = {
    dn: 'restaurant dining food photography',
    nl: 'nightlife bar lounge city evening',
    ca: 'automobile car vehicle photography',
    bt: 'boat yacht marine photography',
    er: 'consumer electronics product photography editorial',
    tn: 'town city skyline aerial',
    sc: 'school campus education',
    mv: 'cinema movie film',
    aq: 'aquarium fish tank',
    cg: 'sales coaching session manager rep 1:1',
    st: 'sales training workshop classroom role-play',
    es: 'luxury estate home real estate photography',
    rs: 'luxury resort hotel beach tropical photography',
    tv: 'travel destination resort landscape photography',
    wl: 'wellness spa resort retreat photography',
  };
  const lane = topical[prefix] || 'professional editorial photography';
  return `High-quality ${lane} illustrating "${t}". Realistic, editorial style. No text, no words, no logos, no watermark.`;
}

function productPrompt(name, prefix) {
  const n = String(name || '').slice(0, 80);
  const topical = {
    dn: 'restaurant interior food dish dining room',
    nl: 'bar nightclub lounge interior',
    ca: 'car automobile vehicle',
    bt: 'boat yacht on water',
    er: 'consumer electronics gadget product studio shot',
    cg: 'sales coaching drill framework playbook',
    st: 'sales training drill facilitator guide workshop',
    es: 'luxury home estate gated community waterfront property',
    rs: 'luxury resort pool beach villa hotel exterior',
    tv: 'resort destination hotel room view',
    wl: 'spa wellness resort treatment room',
  };
  if (prefix === 'cg' || prefix === 'st') {
    return `Clean flat vector B2B illustration about "${n}", sales manager coaching a rep, whiteboard and laptop, professional corporate style, no text, no watermark`;
  }
  const lane = topical[prefix] || 'editorial photography';
  return `Professional ${lane} photo representing "${n}". Editorial quality, realistic lighting. No text, no watermark, no logos.`;
}

function parseGeminiImageError(status, bodyText) {
  let msg = '';
  try {
    const j = JSON.parse(bodyText);
    msg = (j.error && j.error.message) || '';
  } catch (e) {
    msg = String(bodyText || '').slice(0, 200);
  }
  const lower = msg.toLowerCase();
  if (status === 400 && (lower.includes('paid plan') || lower.includes('billing'))) {
    return 'paid_plan_required';
  }
  if (status === 403) return 'forbidden';
  if (status === 429 && lower.includes('free_tier')) return 'free_tier_quota';
  if (status === 429) return 'rate_limited';
  if (status === 404) return 'model_not_found';
  return msg ? msg.slice(0, 120) : `http_${status}`;
}

function extractImageBytesFromGenerateContent(j) {
  const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
  for (const p of parts) {
    const b64 = (p.inlineData && p.inlineData.data) || (p.inline_data && p.inline_data.data);
    if (b64) {
      const buf = Buffer.from(b64, 'base64');
      if (buf.length >= 3000) return buf;
    }
  }
  return null;
}

async function genGeminiImageBytes(prompt, modelIdx = 0) {
  const key = geminiKey();
  if (!key || modelIdx >= GEMINI_IMAGE_MODELS.length) return null;
  const model = GEMINI_IMAGE_MODELS[modelIdx];
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: String(prompt).slice(0, 2000) }] }],
          generationConfig: { responseModalities: ['IMAGE'] },
        }),
        signal: AbortSignal.timeout(90000),
      }
    );
    const text = await r.text();
    if (!r.ok) {
      const reason = parseGeminiImageError(r.status, text);
      if (r.status === 400 || r.status === 403 || (r.status === 404 && modelIdx === GEMINI_IMAGE_MODELS.length - 1)) {
        IMAGEN_OK = false;
        IMAGEN_STATUS = reason;
      }
      if (r.status === 429) {
        IMAGEN_STATUS = reason;
        return null;
      }
      return genGeminiImageBytes(prompt, modelIdx + 1);
    }
    let j;
    try {
      j = JSON.parse(text);
    } catch (e) {
      return genGeminiImageBytes(prompt, modelIdx + 1);
    }
    const buf = extractImageBytesFromGenerateContent(j);
    if (buf) return buf;
    return genGeminiImageBytes(prompt, modelIdx + 1);
  } catch (e) {
    return genGeminiImageBytes(prompt, modelIdx + 1);
  }
}

/** Legacy name — now uses Gemini Image generateContent, not Imagen predict. */
async function genImagenBytes(prompt) {
  if (!IMAGEN_OK) return null;
  return genGeminiImageBytes(prompt);
}

async function probeGeminiImage() {
  const key = geminiKey();
  if (!key) {
    IMAGEN_OK = false;
    IMAGEN_STATUS = 'no_key';
    logImagenStatus();
    return false;
  }
  IMAGEN_STATUS = 'probing';
  const buf = await genGeminiImageBytes('flat minimal blue business icon, no text');
  if (buf) {
    IMAGEN_OK = true;
    IMAGEN_STATUS = 'ok';
    logImagenStatus();
    return true;
  }
  if (IMAGEN_STATUS === 'probing') IMAGEN_STATUS = 'probe_failed';
  IMAGEN_OK = false;
  logImagenStatus();
  return false;
}

function ensureImagenProbed() {
  if (!imagenProbePromise) {
    imagenProbePromise = probeGeminiImage().catch(() => {
      IMAGEN_OK = false;
      if (IMAGEN_STATUS === 'probing') IMAGEN_STATUS = 'probe_error';
      logImagenStatus();
      return false;
    });
  }
  return imagenProbePromise;
}

async function genPollinations(prompt, seed, attempt = 0) {
  const MAX = 2;
  const model = attempt % 2 === 0 ? 'sana' : 'flux';
  try {
    const url =
      'https://image.pollinations.ai/prompt/' +
      encodeURIComponent(prompt) +
      `?width=1280&height=720&nologo=true&model=${model}&seed=${(seed + attempt) % 1000000}`;
    const r = await fetch(url, { headers: { 'User-Agent': POLL_UA }, signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error('status ' + r.status);
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('image/')) throw new Error('ct ' + ct);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 3000) throw new Error('tiny');
    return buf;
  } catch (e) {
    if (attempt < MAX) {
      await new Promise((res) => setTimeout(res, 3000 + attempt * 2000));
      return genPollinations(prompt, seed, attempt + 1);
    }
    return null;
  }
}

async function geminiImageSearchQuery(subject, prefix) {
  const key = geminiKey();
  if (!key) return null;
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Return ONE short DuckDuckGo image search query (10 words max) to find a real editorial photo for: "${subject}". Article type: ${prefix || 'top-10'} ranking. Reply with ONLY the query text, no quotes or punctuation.`,
                },
              ],
            },
          ],
        }),
        signal: AbortSignal.timeout(25000),
      }
    );
    if (!r.ok) return null;
    const j = await r.json();
    const text =
      (j.candidates &&
        j.candidates[0] &&
        j.candidates[0].content &&
        j.candidates[0].content.parts &&
        j.candidates[0].content.parts[0] &&
        j.candidates[0].content.parts[0].text) ||
      '';
    const q = String(text)
      .trim()
      .replace(/^["']|["']$/g, '')
      .split('\n')[0]
      .trim();
    return q.length > 3 ? q.slice(0, 120) : null;
  } catch (e) {
    return null;
  }
}

async function hostImageBytes(buf, hint) {
  if (!buf || buf.length < 3000 || !canWriteAutoDir()) return null;
  const slug = slugFor(hint);
  const filePath = path.join(IMG_DIR, `${slug}.jpg`);
  const url = `${PUB_BASE}${slug}.jpg`;
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 3000) return url;
  } catch (e) {}
  fs.writeFileSync(filePath, buf);
  return url;
}

async function generateHostedImage(prompt, hint, opts = {}) {
  if (!canWriteAutoDir()) return null;
  const geminiOnly = !!opts.geminiOnly;
  await ensureImagenProbed();
  const seed = crypto.createHash('md5').update(String(hint || prompt)).digest().readUInt32BE(0);
  let buf = null;
  if (IMAGEN_OK) buf = await genGeminiImageBytes(prompt);
  if (!buf && !geminiOnly) buf = await genPollinations(prompt, seed);
  return hostImageBytes(buf, hint || prompt);
}

async function pollinationsHostedImage(prompt, hint) {
  if (!canWriteAutoDir()) return null;
  const seed = crypto.createHash('md5').update(String(hint || prompt)).digest().readUInt32BE(0);
  const buf = await genPollinations(prompt, seed);
  return hostImageBytes(buf, hint || prompt);
}

async function pollinationsCoverFor(title, id) {
  const pre = (String(id).match(/^([a-z]+)/i) || [])[1] || '';
  return pollinationsHostedImage(coverPrompt(title, pre), `poll-cover-${id}-${title}`);
}

async function pollinationsProductFor(name, id) {
  const pre = (String(id).match(/^([a-z]+)/i) || [])[1] || '';
  return pollinationsHostedImage(productPrompt(name, pre), `poll-product-${id}-${name}`);
}

async function geminiCoverFor(title, id, opts = {}) {
  const pre = (String(id).match(/^([a-z]+)/i) || [])[1] || '';
  if (opts.geminiOnly) {
    await ensureImagenProbed();
    if (!IMAGEN_OK) return null;
    const buf = await genGeminiImageBytes(coverPrompt(title, pre));
    return hostImageBytes(buf, `cover-${id}-${title}`);
  }
  return generateHostedImage(coverPrompt(title, pre), `cover-${id}-${title}`, opts);
}

async function geminiProductFor(name, id, opts = {}) {
  const pre = (String(id).match(/^([a-z]+)/i) || [])[1] || '';
  if (opts.geminiOnly) {
    await ensureImagenProbed();
    if (!IMAGEN_OK) return null;
    const buf = await genGeminiImageBytes(productPrompt(name, pre));
    return hostImageBytes(buf, `product-${id}-${name}`);
  }
  return generateHostedImage(productPrompt(name, pre), `product-${id}-${name}`, opts);
}

module.exports = {
  geminiKey,
  canWriteAutoDir,
  imagenStatus,
  ensureImagenProbed,
  probeGeminiImage,
  geminiImageSearchQuery,
  generateHostedImage,
  genImagenBytes,
  genGeminiImageBytes,
  hostImageBytes,
  geminiCoverFor,
  geminiProductFor,
  pollinationsHostedImage,
  pollinationsCoverFor,
  pollinationsProductFor,
  coverPrompt,
  productPrompt,
  get IMAGEN_OK() {
    return IMAGEN_OK;
  },
};
