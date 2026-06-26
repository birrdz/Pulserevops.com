// pulse-machine-og — dynamic 1200×630 share cards per library entry.
// PNG at /og/<id>.png for LinkedIn/Facebook (raster only). SVG at /og/<id>.svg
// for Slack/Twitter that accept vector.

const fs = require('fs');

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

let wasmInit = null;
async function getResvgWasm() {
  if (wasmInit) return wasmInit;
  wasmInit = (async () => {
    const { initWasm, Resvg } = require('@resvg/resvg-wasm');
    const wasmPath = require.resolve('@resvg/resvg-wasm/index_bg.wasm');
    await initWasm(fs.readFileSync(wasmPath));
    return Resvg;
  })();
  return wasmInit;
}

function initStore() {
  if (!getStore) return null;
  const tok = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  const sid = process.env.NETLIFY_SITE_ID || 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
  if (tok && sid) { try { return getStore({ name: 'pulse-machine-library', siteID: sid, token: tok }); } catch (e) { return null; } }
  try { return getStore('pulse-machine-library'); } catch (e) { return null; }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrap(text, maxLines, charsPerLine) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) { cur = w; continue; }
    if (cur.length + 1 + w.length > charsPerLine) {
      lines.push(cur); cur = w;
      if (lines.length >= maxLines - 1) break;
    } else cur += ' ' + w;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === maxLines) {
    const lastIdx = lines.length - 1;
    if (lines[lastIdx].length > charsPerLine - 3) lines[lastIdx] = lines[lastIdx].slice(0, charsPerLine - 3) + '…';
    else lines[lastIdx] = lines[lastIdx] + ' …';
  }
  return lines;
}

function wordCountOf(answer) {
  const cleaned = String(answer || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_`~|\-=]/g, ' ')
    .replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned.split(' ').filter(Boolean).length : 0;
}

function parseId(event) {
  let id = null;
  if (event.path) {
    const m = event.path.match(/\/og\/([\w-]+)/);
    if (m) id = m[1].replace(/\.(svg|png|jpe?g)$/i, '');
  }
  if (!id && event.queryStringParameters?.id) {
    id = String(event.queryStringParameters.id).replace(/[^\w-]/g, '');
  }
  return id;
}

function wantsPng(event) {
  if (event.path && /\.png$/i.test(event.path)) return true;
  const fmt = (event.queryStringParameters?.format || '').toLowerCase();
  return fmt === 'png';
}

function buildSvg({ question, wc, rt, qs, tag }) {
  const lines = wrap(question, 4, 28);
  const lineHeight = 78;
  const totalH = lines.length * lineHeight;
  const yStart = 285 - totalH / 2 + lineHeight * 0.75;
  const linesSvg = lines.map((l, i) =>
    `<text x="80" y="${yStart + i * lineHeight}" font-family="Inter, -apple-system, sans-serif" font-size="64" font-weight="900" fill="#F4EEDE" letter-spacing="-1.5">${esc(l)}</text>`
  ).join('');

  const qsColor = qs >= 10 ? '#FFD740' : qs >= 8 ? '#FF8C1A' : qs >= 6 ? '#FFA94D' : '#9CA3AF';
  const qsLabel = qs >= 10 ? 'MACHINE CERTIFIED · 10/10' : `QUALITY ${qs}/10`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0e14"/>
      <stop offset="60%" stop-color="#0f1620"/>
      <stop offset="100%" stop-color="#070a0f"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.85" cy="0.15" r="0.55">
      <stop offset="0%" stop-color="#FF8C1A" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#FF8C1A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.1" cy="0.9" r="0.55">
      <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
    <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
      <polygon points="28,2 52,16 52,36 28,46 4,36 4,16" fill="none" stroke="#E8710A" stroke-width="0.8" opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#hex)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <text x="80" y="98" font-family="JetBrains Mono, SF Mono, monospace" font-size="22" font-weight="900" fill="#FF8C1A" letter-spacing="6">PULSE · KNOWLEDGE LIBRARY</text>
  <rect x="80" y="118" width="${tag.length * 12 + 24}" height="30" rx="15" fill="rgba(255,140,26,0.12)" stroke="#FF8C1A" stroke-opacity="0.4"/>
  <text x="${92}" y="139" font-family="JetBrains Mono, SF Mono, monospace" font-size="14" font-weight="800" fill="#FFB347" letter-spacing="2">${esc(tag)}</text>

  ${linesSvg}

  <line x1="80" y1="528" x2="1120" y2="528" stroke="#FF8C1A" stroke-opacity="0.18"/>

  <g transform="translate(80, 562)">
    <rect width="180" height="42" rx="21" fill="rgba(255,140,26,0.1)" stroke="#FF8C1A" stroke-opacity="0.4"/>
    <text x="90" y="28" font-family="Inter, sans-serif" font-size="17" font-weight="800" fill="#FFB870" text-anchor="middle" letter-spacing="1">${wc.toLocaleString('en-US')} words</text>
  </g>
  <g transform="translate(276, 562)">
    <rect width="160" height="42" rx="21" fill="rgba(123,182,255,0.08)" stroke="#7BB6FF" stroke-opacity="0.3"/>
    <text x="80" y="28" font-family="Inter, sans-serif" font-size="17" font-weight="800" fill="#7BB6FF" text-anchor="middle" letter-spacing="1">${rt} min read</text>
  </g>
  <g transform="translate(452, 562)">
    <rect width="${qsLabel.length * 9 + 32}" height="42" rx="21" fill="${qsColor}" fill-opacity="0.18" stroke="${qsColor}" stroke-opacity="0.6"/>
    <text x="${(qsLabel.length * 9 + 32) / 2}" y="28" font-family="JetBrains Mono, sans-serif" font-size="14" font-weight="900" fill="${qsColor}" text-anchor="middle" letter-spacing="2">${qsLabel}</text>
  </g>
  <text x="1120" y="590" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700" fill="#9A9088" text-anchor="end">pulserevops.com</text>
</svg>`;
}

async function svgToPng(svg) {
  try {
    const Resvg = await getResvgWasm();
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
      font: { loadSystemFonts: true },
    });
    return resvg.render().asPng();
  } catch (e) {
    try {
      const { Resvg } = require('@resvg/resvg-js');
      const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, font: { loadSystemFonts: true } });
      return resvg.render().asPng();
    } catch (e2) {
      return null;
    }
  }
}

exports.handler = async (event) => {
  const id = parseId(event);
  if (!id) return { statusCode: 404, body: 'no id' };

  const store = initStore();
  let entry = null;
  if (store) {
    try { entry = await store.get('answers/' + id + '.json', { type: 'json' }); } catch (e) {}
  }
  const question = entry?.question || 'Pulse RevOps Knowledge Library';
  const wc = wordCountOf(entry?.answer);
  const rt = Math.max(1, Math.round(wc / 220));
  const qs = (typeof entry?.quality_score === 'number') ? entry.quality_score : 5;
  const tag = ((entry?.tags || [])[0] || 'pulse').toUpperCase();

  const svg = buildSvg({ question, wc, rt, qs, tag });
  const asPng = wantsPng(event);

  if (asPng) {
    const png = await svgToPng(svg);
    if (png) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'X-Robots-Tag': 'noindex',
        },
        body: Buffer.from(png).toString('base64'),
        isBase64Encoded: true,
      };
    }
    // Rasterizer unavailable — send crawlers to site-wide share image.
    return {
      statusCode: 302,
      headers: {
        Location: 'https://pulserevops.com/og-themachine.png',
        'Cache-Control': 'public, max-age=300',
      },
      body: '',
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Robots-Tag': 'noindex',
    },
    body: svg,
  };
};
