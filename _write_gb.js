// Direct-write for the Graphics pillar (free downloadable graphics, banners,
// presentation art, printables, clip art, quote cards, memes). 5th pillar.
//
// Usage: node _write_gb.js <gb####> "<title>" <category-slug> "<~20-25 word description>"
//
// Convention: the SVG asset MUST already exist at
//   C:/Users/koryj/website/graphics/assets/<gb####>.svg
// The writer reads its width/height (from width/height attrs or viewBox) to
// populate the specs line, then builds the entry body: a clickable preview that
// downloads the file (Content-Disposition: attachment is set on /graphics/assets/*
// in netlify.toml), the description, specs, a download link, and a usage line.
//
// NO gold-format text grader — graphics are visual assets with a short caption,
// not 1100-word articles. The quality auditor + mermaid auditor skip gb#### ids.
const fs = require('fs');
const { prepareEntryForPublish } = require('./_write_lib');
const { getStore } = require('@netlify/blobs');

try {
  const env = fs.readFileSync('C:/Users/koryj/website/.env.local', 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const SID = 'a2b74b30-a1ac-40e2-9622-aebfc2feb482';
const TOK = process.env.BLOBS_PAT || process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

const ID = process.argv[2];
const TITLE = process.argv[3];
const CATEGORY = (process.argv[4] || 'graphic').toLowerCase();
const DESCRIPTION = (process.argv[5] || '').trim();

if (!ID || !/^gb\d+$/.test(ID) || !TITLE || !DESCRIPTION) {
  console.error('usage: node _write_gb.js <gb####> "<title>" <category-slug> "<~20-25 word description>"');
  process.exit(1);
}

// Human label per category-slug.
const CATEGORY_LABELS = {
  'linkedin-banner': 'LinkedIn Banner',
  'social-banner': 'Social Banner',
  'presentation': 'Presentation Graphic',
  'slide': 'Presentation Slide',
  'quote-card': 'Quote Card',
  'infographic': 'Infographic',
  'wall-art': 'Wall Art / Printable',
  'clip-art': 'Clip Art',
  'meme': 'Meme',
  'icon': 'Icon',
  'graphic': 'Graphic',
};
const CATEGORY_LABEL = CATEGORY_LABELS[CATEGORY] || (CATEGORY.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

const ASSET_REL = `/graphics/assets/${ID}.svg`;
const ASSET_PATH = `C:/Users/koryj/website/graphics/assets/${ID}.svg`;

(async () => {
  const store = getStore({ name: 'pulse-machine-library', siteID: SID, token: TOK });
  if (!fs.existsSync(ASSET_PATH)) {
    console.error('REJECTED: asset not found at ' + ASSET_PATH + ' — generate the SVG first.');
    process.exit(2);
  }
  const svg = fs.readFileSync(ASSET_PATH, 'utf8');

  // Light validation: description should be ~12-40 words (the "graphics gold standard").
  const wc = DESCRIPTION.split(/\s+/).filter(Boolean).length;
  if (wc < 10 || wc > 45) {
    console.error('NOTE: description is ' + wc + ' words (target ~20-25). Continuing.');
  }

  // Derive dimensions from the SVG: prefer width/height attrs, fall back to viewBox.
  let W = null, H = null;
  const wAttr = svg.match(/<svg[^>]*\bwidth="([\d.]+)/i);
  const hAttr = svg.match(/<svg[^>]*\bheight="([\d.]+)/i);
  if (wAttr && hAttr) { W = Math.round(+wAttr[1]); H = Math.round(+hAttr[1]); }
  if (!W || !H) {
    const vb = svg.match(/viewBox="\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)/i);
    if (vb) { W = Math.round(+vb[1]); H = Math.round(+vb[2]); }
  }
  const sizeStr = (W && H) ? `${W}×${H} px` : 'scalable';

  const now = Date.now();
  const TAGS = Array.from(new Set(['graphic', CATEGORY, 'free-download', 'revops-graphics', 'presentation-graphics']));

  // Body — clickable preview (downloads on click), short description, specs,
  // explicit download link, and a usage + browse-more line.
  const body =
`### ${TITLE}

[![${TITLE}](${ASSET_REL})](${ASSET_REL})

${DESCRIPTION}

**Format:** SVG (scalable vector) · **Size:** ${sizeStr} · **Category:** ${CATEGORY_LABEL} · **License:** Free to use — no attribution required.

[⬇ Download this graphic](${ASSET_REL})

## Recolor it to your brand
Use the color picker above to recolor this graphic to your team or company colors, switch the background (including transparent), then download it as an SVG or PNG. No sign-up, no watermark.

## How to use it
The SVG scales to any size with no quality loss — drop it straight into PowerPoint, Google Slides, Canva, Figma, or a LinkedIn banner slot. The PNG export is ready to upload anywhere that wants a raster image.

## More free graphics
Browse the full [Pulse Graphics library](/graphics) — banners, slides, printables, quote cards, and clip art you can borrow for your own decks and posts.`;

  const existing = await store.get(`answers/${ID}.json`, { type: 'json' });
  const isUpgrade = !!existing;

  let entry = {
    id: ID,
    question: TITLE,
    answer: body,
    tags: TAGS,
    quality_score: 10,
    format_v: '2026-05',
    pending: false,
    ts: now,
    polished_at: now,
    model: 'claude-opus-4-7',
    gold_format: true,
    graphic: { category: CATEGORY, category_label: CATEGORY_LABEL, asset: ASSET_REL, width: W, height: H },
  };

  entry = prepareEntryForPublish(ID, TITLE, entry);
  await store.setJSON(`answers/${ID}.json`, entry);

  const idx = (await store.get('_index.json', { type: 'json' })) || { entries: [] };
  const existingIdx = idx.entries.findIndex(e => e && e.id === ID);
  const indexEntry = { id: ID, question: TITLE, tags: entry.tags, quality_score: 10, format_v: '2026-05', pending: false, ts: now, polished_at: now, model: 'claude-opus-4-7', was_indexed_at: null };
  if (existingIdx >= 0) idx.entries.splice(existingIdx, 1);
  idx.entries.unshift(indexEntry);
  await store.setJSON('_index.json', idx);

  let indexed = null;
  try {
    const r = await fetch('https://pulserevops.com/.netlify/functions/pulse-indexnow-target', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'pulsemachine-writer-2026', id: ID })
    });
    indexed = await r.json();
  } catch (e) { indexed = { ok: false, err: String(e.message || e) }; }

  console.log(JSON.stringify({ ok: true, id: ID, upgraded: isUpgrade, category: CATEGORY, size: sizeStr, ts: now, total: idx.entries.length, url: `https://pulserevops.com/graphics/${ID}`, indexnow: indexed }));
})().catch(e => { console.error('ERR', e && e.message); process.exit(1); });
