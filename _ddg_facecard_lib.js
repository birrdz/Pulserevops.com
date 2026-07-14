// _ddg_facecard_lib.js — face-card COVER generation (DDG real photos + Pollinator flux alternate).
// 🔒 OWNER LAW: alternate DDG ↔ Pollinator per page (id hash); fallback when one throttles/fails.
// Gold title = baked onto face-card covers (brand orange #FF8C1A, Playfair-style italic, bottom gradient).
// Section + pool images stay text-free unless opts.goldTitle is passed.
const FACE_TITLE_ORANGE = process.env.FACE_TITLE_COLOR || '#FFD54F';
const FACE_TITLE_STROKE = process.env.FACE_TITLE_STROKE || '#000000';
// Every cover/section image passes storeGradedImage (grade + EXIF PULSE_GRADE=v_final + self-host).
const fs = require('fs'), sharp = require('sharp');
const WD = 'C:/Users/koryj/website', DIR = WD + '/assets/qa', S = 760;
// Mosaic tile display ratio (pulse-mosaic.css — 1080×360 row). Bake face-cards at this aspect so
// object-fit:cover on the tile shows the subject, not random square-crop edges.
const FACE_CARD_TILE_W = parseInt(process.env.FACE_CARD_TILE_W || '1200', 10);
const FACE_CARD_TILE_H = parseInt(process.env.FACE_CARD_TILE_H || '400', 10);
// Site-wide image law: Pollinator flux ONLY — DuckDuckGo banned (owner 2026-07-05).
// Override (owner 2026-07-07, new movies project): STAGGER_DDG_POLLINATOR=1 re-enables DDG so internal
// images alternate DDG ↔ Pollinator (staggered) via _image_provider_alternate.js. Reversible — unset to restore ban.
const STAGGER_DDG_POLLINATOR = process.env.STAGGER_DDG_POLLINATOR === '1';
const POLLINATOR_IMAGES_ONLY = STAGGER_DDG_POLLINATOR ? false : true;
const DDG_IMAGES_BANNED = STAGGER_DDG_POLLINATOR ? false : true;
let searchRealPhoto = null; try { ({ searchRealPhoto } = require('./netlify/functions/lib/img-search-lib')); } catch (e) { console.log('[ddg-facecard] img-search-lib load fail', e.message); }
const { entryTopicKey, sectionImageSearchQuery, topicKeyMatchesPoolQuery } = require('./netlify/functions/lib/entry-image-query');
// Watermarked / stock-preview domains that must NEVER become a cover.
const STOCK_BLOCK = /dreamstime|shutterstock|istockphoto|\bistock\b|alamy|123rf|depositphotos|gettyimages|stock\.adobe|adobestock|vecteezy|freepik|canstock|bigstock|pond5|watermark|preview\.|\.stock/i;
function coverPath(id) { return DIR + '/' + id + '.jpg'; }
function coverFileOk(id) { try { return fs.statSync(coverPath(id)).size > 40000; } catch (e) { return false; } }
// Rubric gate: valid face-card cover = graded self-hosted file (>40KB) from flux OR entry reuse.
const VALID_FACE_COVER_SRC = new Set(['flux', 'ddg-facecard', 'internal-reuse', 'product-reuse']);
function faceCardCoverOk(id, coverSrc) { return VALID_FACE_COVER_SRC.has(coverSrc) && coverFileOk(id); }
function hasGradeStampInBuf(buf) {
  try { return !!(buf && buf.length && buf.includes(Buffer.from(GRADE_STAMP))); } catch (e) { return false; }
}
// 🔒 FACE-CARD FRAMING (owner): wide mosaic tile crop — attention/salience centered on subject.
const FACE_CARD_FRAMING = 'full subject in frame with generous headroom above heads and faces, no cropped or cut-off heads at top or side edges, centered composition safe for wide homepage mosaic tile crop (3:1), professional documentary photo';
// 🔒 SECTION TILE FRAMING — article ## section slots render as wide 16:9 figures.
const SECTION_TILE_W = 1200;
const SECTION_TILE_H = 675;
const SECTION_TILE_FRAMING = 'wide editorial photograph with full subjects in frame, generous headroom, no cropped heads or faces at top edge, safe for 16:9 crop, documentary composition';
/** Pollinator flux look law — real editorial photos only; ban chart/infomercial/AI-slop clichés. */
const FLUX_REAL_PHOTO_LAW = 'real candid documentary photograph, no chart no graph no diagram no infographic no dashboard screenshot, no infomercial no advertisement no marketing flyer, no CGI no 3D render no sci-fi futuristic no neon cyberpunk no hologram no glowing AI interface';
const FLUX_POISON_RE = /\b(graphs?|charts?|diagrams?|infographics?|dashboards?|spreadsheets?|slide decks?|slides?|org charts?|workflow diagrams?|funnel visualizations?|KPI dashboards?|BI charts?|metrics boards?|control rooms?|user interfaces?|UI mockups?|data visualizations?|infomercials?|holograms?|cyberpunk|futuristic sci-?fi|3D renders?|CGI|heatmaps?|analytics screens?)\b/gi;
function stripFluxPoisonWords(s) {
  return String(s || '').replace(FLUX_POISON_RE, ' ').replace(/\s+/g, ' ').trim();
}
function datedSVG(w, h) {
  h = h || w;
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
    '<defs>' +
    '<radialGradient id="v" cx="0.5" cy="0.47" r="1.08"><stop offset="0.62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a0603" stop-opacity="0.14"/></radialGradient>' +
    '<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.045"/></feComponentTransfer></filter>' +
    '</defs>' +
    '<rect width="' + w + '" height="' + h + '" fill="#c98a2e" opacity="0.07"/>' +   // old-timey golden warmth
    '<rect width="' + w + '" height="' + h + '" fill="url(#v)"/>' +                    // soft wide vignette ~14%
    '<rect width="' + w + '" height="' + h + '" filter="url(#grain)" opacity="0.045"/>' + // visible grain texture ~4.5%
    '</svg>');
}
function goldTitleLayout(w, h, text) {
  w = Math.max(1, Number(w) || S);
  h = Math.max(1, Number(h) || S);
  const clean = String(text || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
  // Keep the title visually identical on legacy 760px squares and wide face cards. The previous
  // max(width,height) formula made a 1200x400 card's font 86px tall and every rebake restored it.
  const lengthScale = clean.length >= 90 ? 0.82 : (clean.length >= 60 ? 0.9 : 1);
  const fontSize = Math.max(24, Math.round(Math.min(w * 0.05, h * 0.095) * lengthScale));
  const maxChars = Math.max(18, Math.floor((w * 0.92) / (fontSize * 0.56)));
  const words = clean.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const word of words) {
    const next = (cur + ' ' + word).trim();
    if (next.length <= maxChars || !cur) {
      cur = next;
      continue;
    }
    lines.push(cur);
    cur = word;
    if (lines.length === 2) break;
  }
  if (cur && lines.length < 3) lines.push(cur);
  const consumed = lines.join(' ').split(/\s+/).filter(Boolean).length;
  if (consumed < words.length && lines.length) {
    const last = lines.length - 1;
    let clipped = lines[last];
    while (clipped.length > maxChars - 1) clipped = clipped.slice(0, -1);
    lines[last] = clipped.replace(/[\s,;:.-]+$/, '') + '…';
  }
  return { clean, lines, fontSize, maxChars };
}
function goldTitleOverlaySVG(w, h, text) {
  const xesc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const layout = goldTitleLayout(w, h, text);
  const L = layout.lines;
  const F = layout.fontSize;
  const lh = Math.round(F * 1.04);
  const y0 = h - Math.round(h * 0.05) - (L.length - 1) * lh;
  const pad = Math.round(w * 0.04);
  const strokeW = Math.max(2, Math.round(F * 0.12));
  const ts = L.map((l, i) => '<text x="' + pad + '" y="' + (y0 + i * lh) + '" font-family="Georgia,\'Playfair Display\',serif" font-style="italic" font-weight="900" font-size="' + F + '" fill="' + FACE_TITLE_ORANGE + '" stroke="' + FACE_TITLE_STROKE + '" stroke-width="' + strokeW + '" stroke-linejoin="round" paint-order="stroke fill">' + xesc(l) + '</text>').join('');
  return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.88"/></linearGradient></defs><rect width="' + w + '" height="' + h + '" fill="url(#gt)"/><g>' + ts + '</g></svg>');
}
// Shared FINAL color pipeline (frozen once approved). Rich-but-warm old-timey editorial:
// saturation ~108%, +10% contrast with LIFTED shadows (filmic), warm cast across highlights+midtones, light sharpen.
function applyCineGrade(pipe, bright) {
  return pipe
    .modulate({ saturation: 1.08, brightness: bright ? 0.98 : 1.01 })
    .linear(1.10, 6)                                                   // +10% contrast, lifted shadows (filmic, not crushed)
    .recomb([[1.07, 0, 0], [0, 1.0, 0], [0, 0, 0.93]])                 // warm cast (highlights + midtones), cool touch in blue
    .sharpen();                                                        // light unsharp mask
}
// 🔒🔒 THE ONE CHOKE POINT (v2 spec) — the ONLY function that writes an image file.
// ALWAYS grades from RAW + stamps EXIF PULSE_GRADE=v_final. Returns {hash,size,w,h,path}.
// opts: {faceCardTile} wide mosaic tile | {square:S} legacy square | {sectionTile} 16:9 | {faceCard:bool}
const GRADE_STAMP = 'PULSE_GRADE=v_final';
function faceCardTileGradeOpts(question, qual, overrides) {
  return Object.assign({
    faceCardTile: true,
    faceCard: true,
    width: FACE_CARD_TILE_W,
    height: FACE_CARD_TILE_H,
    bright: !!(qual && qual.meanB > 175),
    goldTitle: question,
  }, overrides || {});
}
function faceCardSquareGradeOpts(question, qual, overrides) {
  return Object.assign({
    square: S,
    faceCard: true,
    bright: !!(qual && qual.meanB > 175),
    goldTitle: question,
  }, overrides || {});
}
/** Pick sharp cover position from source aspect — keeps faces/products in the visible tile band. */
async function resolveFaceCardCropPosition(rawBuf) {
  try {
    const meta = await sharp(rawBuf, { animated: false }).metadata();
    const w = meta.width || 1;
    const h = meta.height || 1;
    const ar = w / h;
    if (ar < 0.82) return 'north';       // portrait — keep head/top product in wide tile
    if (ar < 1.05) return 'attention';   // square-ish
    if (ar <= 2.4) return 'attention';   // normal landscape
    return 'entropy';                    // ultra-wide — find densest region
  } catch (e) {
    return 'attention';
  }
}
/** Grade any buffer into a mosaic-ready face-card file (/assets/qa/<id>.jpg). */
async function gradeFaceCardFromBuffer(rawBuf, destPath, opts) {
  opts = opts || {};
  const qual = await qualifyPhoto(rawBuf, destPath);
  const cropPosition = opts.cropPosition || await resolveFaceCardCropPosition(rawBuf);
  const title = opts.goldTitle || opts.question || '';
  const variant = String(opts.variant || process.env.FACE_CARD_VARIANT || 'tile').toLowerCase();
  const gradeOpts = variant === 'square' ? faceCardSquareGradeOpts : faceCardTileGradeOpts;
  return storeGradedImage(rawBuf, destPath, gradeOpts(title, qual, {
    cropPosition,
    bright: opts.bright != null ? opts.bright : !!(qual && qual.meanB > 175),
    goldTitle: title || undefined,
  }));
}
function sectionImageGradeOpts(qual) {
  return { sectionTile: true, width: SECTION_TILE_W, height: SECTION_TILE_H, bright: !!(qual && qual.meanB > 175) };
}
function moviePosterGradeOpts(qual) {
  return { posterTile: true, width: 800, height: 1200, bright: !!(qual && qual.meanB > 175) };
}
async function storeGradedImage(rawBuf, destPath, opts = {}) {
  if (!sharp) throw new Error('sharp unavailable');
  const crypto = require('crypto');
  let pipe = sharp(rawBuf, { animated: false }).flatten({ background: '#1a0710' });
  if (opts.faceCardTile) {
    const w = opts.width || FACE_CARD_TILE_W;
    const h = opts.height || FACE_CARD_TILE_H;
    const pos = opts.cropPosition || 'attention';
    pipe = pipe.resize(w, h, { fit: 'cover', position: pos });
  } else if (opts.square) {
    const pos = opts.cropPosition || 'attention';
    pipe = pipe.resize(opts.square, opts.square, { fit: 'cover', position: pos });
  } else if (opts.posterTile) {
    const w = opts.width || 800;
    const h = opts.height || 1200;
    pipe = pipe.resize(w, h, { fit: 'cover', position: opts.cropPosition || 'attention' });
  } else if (opts.sectionTile) {
    const w = opts.width || SECTION_TILE_W;
    const h = opts.height || SECTION_TILE_H;
    pipe = pipe.resize(w, h, { fit: 'cover', position: opts.cropPosition || 'attention' });
  } else if (opts.width) pipe = pipe.resize({ width: opts.width, withoutEnlargement: true });
  const base = await applyCineGrade(pipe, !!opts.bright).toBuffer();       // GRADE FROM RAW ONLY
  const m = await sharp(base).metadata();
  const composites = [{ input: datedSVG(m.width, m.height) }];
  if (opts.goldTitle) composites.push({ input: goldTitleOverlaySVG(m.width, m.height, opts.goldTitle) });
  const gradeDesc = opts.movieSlotStamp || GRADE_STAMP;
  const graded = await sharp(base)
    .composite(composites)
    .jpeg({ quality: 82, mozjpeg: true })
    .withMetadata({ exif: { IFD0: { ImageDescription: gradeDesc } } })   // PROOF-OF-GRADE + optional PULSE_MOVIE stamp
    .toBuffer();
  fs.writeFileSync(destPath, graded);
  return { hash: crypto.createHash('sha256').update(graded).digest('hex'), size: graded.length, w: m.width, h: m.height, path: destPath };
}
// VERIFY GATE — true only if the file carries the grade stamp in EXIF.
async function verifyGradeStamp(pathOrBuf) {
  try { const meta = await sharp(pathOrBuf).metadata(); return !!(meta.exif && Buffer.from(meta.exif).includes(Buffer.from(GRADE_STAMP))); } catch (e) { return false; }
}
async function grab(u) {
  try { const r = await fetch(u, { signal: AbortSignal.timeout(30000) }); if (!(r.ok && (r.headers.get('content-type') || '').startsWith('image'))) return null; const b = Buffer.from(await r.arrayBuffer()); return b.length > 3000 ? b : null; } catch (e) { return null; }
}
// 🔒 IMAGE EXCLUSION RULES (owner 2026-07-04) — enforced on every candidate before it can become a cover.
const LOGO_URL = /logo|icon|clip-?art|sprite|favicon|badge|button|\.svg(\?|$)/i;
async function qualifyPhoto(buf, url) {
  if (LOGO_URL.test(url || '')) return null;                                  // logos / icons / clip art / svg by name
  let meta, stats;
  try { const s = sharp(buf, { animated: false }); meta = await s.metadata(); stats = await s.stats(); } catch (e) { return null; }
  const w = meta.width || 0, h = meta.height || 0;
  if (w < 600 || h < 400) return null;                                        // low-res: blurs when stretched
  const ar = w / h;
  if (ar > 2.5 || ar < 0.4) return null;                                      // extreme aspect: destroyed by cover-crop
  const ch = (stats.channels || []).slice(0, 3);
  if (ch.length < 3) return null;
  const sd = ch.reduce((a, c) => a + (c.stdev || 0), 0) / 3;
  if (sd < 20) return null;                                                   // flat/uniform = logo / clip art / solid graphic
  const meanB = ch.reduce((a, c) => a + (c.mean || 0), 0) / 3;
  const aspect = ar >= 1.35 ? 'landscape' : ar <= 0.74 ? 'portrait' : 'square';
  return { w, h, ar, aspect, meanB, sd, hasAlpha: !!meta.hasAlpha, format: meta.format };
}
// Reject webpage-screenshot / composite / directory grabs (URLs that look like page captures or
// marketing collages) — we want ONE clean subject photo (a person / place / thing), not a screenshot.
const COMPOSITE_BLOCK = /screenshot|screen-shot|screencap|scrn|collage|infographic|template|banner|thumbnail|\/wp-content\/uploads\/\d{4}\/\d{2}\/.*(team|leaders|directory|list)/i;
// POSITIVE TARGETING (spec): append "photo"/"photograph" so DDG returns real photographs, and for
// abstract PEOPLE pillars (whose raw question invites diagrams/screenshots) query the human subject.
const PORTRAIT_PILLARS = new Set(['tl', 'ik', 'gp', 'ra', 'st', 'tk', 'ai', 'sw', 'tc', 'fr', 'q', 'ed']);
// Varied portrait descriptors so PEOPLE pillars don't repeat the same headshot across thousands of pages.
const PORTRAIT_VARIANTS = [
  'confident male business executive headshot portrait photograph, office',
  'professional businesswoman executive headshot portrait photograph, office',
  'senior corporate leader headshot portrait photograph, dark suit',
  'mid-career sales director headshot portrait photograph, professional',
  'female business consultant headshot portrait photograph, corporate',
  'experienced ceo headshot portrait photograph, modern office',
  'young professional manager headshot portrait photograph, suit',
  'corporate executive team leader headshot portrait photograph',
  'business strategist headshot portrait photograph, confident, office',
  'revenue operations leader headshot portrait photograph, professional',
];
const ATTEMPT_SALT = ['', 'corporate', 'office', 'professional', 'business meeting', 'workplace', 'suit portrait'];
// Generic on-topic subject per pillar — the FALLBACK when a specific section query won't resolve.
// DDG can almost always return a clean photo for these, so a slot rarely stays UNRESOLVED.
const PILLAR_SUBJECT = { tl: 'business executive', ik: 'business analytics office', gp: 'business strategy meeting', ra: 'corporate office team', st: 'sales team meeting', tk: 'software technology screen', ai: 'data center servers', sw: 'software on laptop', tc: 'telecom cell tower', fr: 'franchise storefront', q: 'modern business office', ed: 'business advisor meeting', rs: 'luxury resort pool', lv: 'luxury travel destination', tn: 'small town main street', ev: 'event venue crowd', ga: 'people gathering party', nl: 'nightlife bar', sc: 'school campus building', dn: 'restaurant food plated', bo: 'commercial building exterior', ca: 'car on road', bt: 'boat on water', aq: 'reef aquarium tank', es: 'espresso coffee cup', tv: 'flat screen television', cl: 'cologne bottle', co: 'collectible display', er: 'electronics gadget', gm: 'gaming setup', dr: 'power drill tool', sy: 'fashion outfit style', cr: 'crab on beach', fs: 'fishing boat catch', pt: 'happy pet dog', wl: 'wellness spa relaxation', hf: 'family at home', ce: 'business news event', mv: 'cinema movie theater' };
function hashId(id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
/** Q&A upgrade/repair paths may use DDG real photos when Pollinator flux fails (owner alternate law). */
function allowDdgForCall(opts) {
  return !!(opts && (opts.alternateSources || opts.qaUpgradeAlternate || opts.forceDdg));
}
function slotPrefersFlux(id, slot) {
  return (hashId(String(id) + '|slot|' + String(slot || 0)) % 2) === 0;
}
// Per-page base query. Portrait pillars rotate a distinct variant by id-hash; concrete pillars use the question.
function coverQuery(question, id, attempt) {
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const clean = String(question).replace(/[?"]/g, '').trim();
  if (PORTRAIT_PILLARS.has(pillar)) return 'artistic professional business executive portrait dramatic cinematic';
  // HERO embodies the topic, artistically (rotate 3 styles for variety) — top DDG result works.
  const STYLES = [s => 'artistic ' + s + ' dramatic fine art', s => 'cinematic ' + s + ' dramatic', s => 'dramatic ' + s + ' atmospheric photography'];
  return STYLES[(hashId(id) + (attempt || 0)) % STYLES.length](clean);
}
// Pre-download URL/filename reject (spec: reject BEFORE downloading, not after).
const REJECT_URL = /logo|icon|clip-?art|sprite|favicon|badge|banner|watermark|chart|graph|diagram|infographic|screenshot|\.svg(\?|$)/i;
const _bo = ms => new Promise(r => setTimeout(r, ms));
// 🔒 IMAGE REGISTRY + PERCEPTUAL-HASH (owner 2026-07-04). Shared by scrubber + generator.
// Cross-page reuse is ALLOWED for Q&A when topical (owner 4444) — prefer existing library/pool via pickMatchingLibraryImage.
// Pass allowTopicalReuse: true on Q&A fill paths; new Flux/DDG still preferred when no good match.
// Hard-block ONLY within the same Q&A page (same URL or near-identical pHash on one page).
// Mosaic/list pages dedupe at render time so the same image never shows twice on one load.
const REG_F = WD + '/_img_registry.json';
const REG_HAMMING = 8;
let _reg = null, _regDirty = 0, _backfilled = false;
function loadReg() { if (_reg) return _reg; try { _reg = JSON.parse(fs.readFileSync(REG_F, 'utf8')); } catch (e) { _reg = { entries: [] }; } if (!Array.isArray(_reg.entries)) _reg.entries = []; return _reg; }
function flushReg() { if (!_reg) return; _regDirty = 0; try { fs.writeFileSync(REG_F, JSON.stringify(_reg)); } catch (e) {} }
// dHash: grayscale 9x8, compare adjacent pixels -> 64-bit binary string. Robust to the vintage grade only if hashed raw.
async function pHash(buf) {
  try {
    const { data } = await sharp(buf, { animated: false }).grayscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
    let bits = '';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const i = y * 9 + x; bits += data[i] < data[i + 1] ? '1' : '0'; }
    return bits;
  } catch (e) { return null; }
}
function hamming(a, b) { if (!a || !b || a.length !== b.length) return 99; let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d; }
function regHits(ph) { const r = loadReg(); const hits = []; if (!ph) return hits; for (const e of r.entries) if (hamming(e.ph, ph) <= REG_HAMMING) hits.push(e); return hits; }
// Blocked only if this page already uses a near-identical image (same-page law).
function regBlocked(ph, pillar, id, opts) {
  opts = opts || {};
  const excludePh = opts.excludePh || [];
  if (!ph) return false;
  for (const prev of excludePh) {
    if (hamming(prev, ph) <= REG_HAMMING) return true;
  }
  return false;
}
function regAdd(ph, url, w, h, pillar, id, extra) {
  extra = extra || {};
  if (!ph && !url) return;
  const r = loadReg();
  let existing = url ? r.entries.find(e => e.url === url) : null;
  if (!existing && ph) existing = r.entries.find(e => hamming(e.ph, ph) <= REG_HAMMING);
  if (existing) {
    if (extra.pool) existing.pool = true;
    if (extra.poolQuery) existing.poolQuery = extra.poolQuery;
    if (extra.poolSlot != null) existing.poolSlot = extra.poolSlot;
    if (extra.slotTitle) existing.slotTitle = extra.slotTitle;
    if (id && !(existing.pages || []).includes(id)) {
      if (!existing.pages) existing.pages = [];
      existing.pages.push(id);
    }
  } else {
    const row = { ph, url, w, h, pillar, pages: id ? [id] : [] };
    if (extra.pool) { row.pool = true; if (extra.poolQuery) row.poolQuery = extra.poolQuery; if (extra.poolSlot != null) row.poolSlot = extra.poolSlot; }
    if (extra.slotTitle) row.slotTitle = extra.slotTitle;
    r.entries.push(row);
  }
  if (++_regDirty >= 15) flushReg();
}
// BACKFILL (idempotent): hash every existing self-hosted cover into the registry once, skipping files
// already registered by same path (mtime/size not needed — path is the key and files are immutable once made).
async function backfillRegistry() {
  if (_backfilled) return; _backfilled = true;
  try {
    const r = loadReg();
    const known = new Set(r.entries.map(e => e.url));
    const files = fs.readdirSync(DIR).filter(f => /\.jpg$/i.test(f));
    let added = 0;
    for (const f of files) {
      const local = '/assets/qa/' + f;
      if (known.has(local)) continue;
      const poolM = f.match(/^pool-([a-z]{2,3})-(\d+)\.jpg$/i);
      if (poolM) {
        try {
          const buf = fs.readFileSync(DIR + '/' + f);
          const ph = await pHash(buf);
          if (ph) {
            r.entries.push({ ph, url: local, w: 760, h: 760, pillar: poolM[1], pool: true, poolSlot: parseInt(poolM[2], 10), pages: ['_pool-' + poolM[1] + '-' + poolM[2]] });
            added++;
          }
        } catch (e) {}
        continue;
      }
      const id = f.replace(/\.jpg$/i, ''); const pillar = (id.match(/^[a-z]+/) || [''])[0];
      try { const buf = fs.readFileSync(DIR + '/' + f); const ph = await pHash(buf); if (ph) { r.entries.push({ ph, url: local, w: 760, h: 760, pillar, pages: [id] }); added++; } } catch (e) {}
    }
    if (added) flushReg();
    console.log('[img-registry] backfilled ' + added + ' existing covers (total ' + r.entries.length + ')');
  } catch (e) {}
}
// 👁️ VISION GATE (Gemini Flash) — rejects charts/graphs/diagrams/documents that pixel filters can't see.
// This is the ONLY thing that reliably kills charts. Returns true = keep (art/photo), false = reject (chart/etc).
async function isArtNotChart(buf) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return true;   // no key → don't block the run
  try {
    const body = { contents: [{ parts: [
      { text: 'Reply with only YES or NO. YES if this is a real photograph or a piece of artwork of a subject (a person, place, thing, animal, or scene). NO if it is a chart, graph, diagram, infographic, table, map, document, screenshot, logo, or a mostly-text image.' },
      { inlineData: { mimeType: 'image/jpeg', data: buf.toString('base64') } },
    ] }], generationConfig: { maxOutputTokens: 5, temperature: 0 } };
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
    if (!r.ok) return true;   // API hiccup → don't stall
    const j = await r.json();
    const t = String(j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text || '').trim().toUpperCase();
    return t.startsWith('Y');
  } catch (e) { return true; }
}
// Clean DDG photo: photo-refine ON, stock/composite rejected, exclusion gate, THEN the vision gate. Returns {buf,q} or null.
async function ddgCleanPhoto(question, id, opts) {
  if ((POLLINATOR_IMAGES_ONLY || DDG_IMAGES_BANNED) && !allowDdgForCall(opts)) return null;
  if (!searchRealPhoto) return null;
  await backfillRegistry();                                           // hash existing library first (idempotent, once)
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const urlSeen = new Set(loadReg().entries.map(e => e.url));         // fast URL pre-check set
  const BACKOFF = [5000, 15000, 45000];   // spec exponential backoff on DDG throttle
  const sect = opts && opts.sectionText;
  let empties = 0;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const a = (opts && opts.attemptStart != null ? opts.attemptStart : 0) + attempt;
      // 🪜 FALLBACK LADDER (Fable): (1) exact subject → (2) the general thing with NO names
      // ("wedding ceremony photo", not "Taylor Swift wedding") → (3) the pillar's generic subject.
      // Stripping celebrity/brand names dedupes better AND avoids watermarked paparazzi/Getty hits.
      let q;
      if (sect) {
        const clean = String(sect).replace(/[?"]/g, '').trim();
        const salt = ATTEMPT_SALT[a % ATTEMPT_SALT.length] || '';
        // mv pillar: exact "[title] [year] movie poster" — never generic "artistic" queries (owner 2026-07-07 C14).
        if (pillar === 'mv') {
          try {
            const { buildMoviePosterSearchQuery } = require('./_mv_image_title_match');
            q = buildMoviePosterSearchQuery(opts.movieSlot || clean) + (salt ? ' ' + salt : '');
          } catch (e) { q = clean + ' movie poster'; }
        } else {
        const noNames = clean.replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g, ' ').replace(/\s+/g, ' ').trim();  // drop proper/brand names
        const gen = noNames || clean.split(/\s+/).slice(-3).join(' ');
        // 🎨 ROTATE 3 artistic styles (owner-approved) for variety, subject ALWAYS anchored so it never drifts:
        //   A: painting / fine-art  ·  B: cinematic artistic photo  ·  C: moody atmospheric photo.
        const STYLES = [
          s => 'artistic ' + s + ' dramatic fine art',
          s => 'cinematic ' + s + ' photography dramatic',
          s => 'dramatic ' + s + ' photography moody atmospheric',
        ];
        const subj = a < 3 ? clean : (gen || (PILLAR_SUBJECT[pillar] || 'landscape'));
        q = STYLES[(hashId(id) + a) % STYLES.length](subj).trim();
        }
      } else q = coverQuery(question, id, a);
      const pk = await searchRealPhoto(q, id + '-' + a + (opts && opts.dupeSalt ? '-' + opts.dupeSalt : ''), opts && opts.skipAlternateWait ? { skipThrottle: true } : {});     // DuckDuckGo (fast, mass-produce)
      if (!pk || !pk.img) { if (empties < BACKOFF.length) await _bo(BACKOFF[empties]); empties++; continue; }
      if (STOCK_BLOCK.test(pk.img) || COMPOSITE_BLOCK.test(pk.img) || REJECT_URL.test(pk.img)) continue;
      // mv C14 (owner 2026-07-07): validate the SOURCE URL matches the movie BEFORE stamping — the stamp is a
      // cache key, not proof. Reject junk listicle/thumbnail URLs and require the title-slug in the source URL.
      if (pillar === 'mv' && opts.movieSlot) {
        try {
          const { parseMovieSlot, isJunkMovieSignal, urlMatchesMovieTitle } = require('./_mv_image_title_match');
          const movie = parseMovieSlot(opts.movieSlot);
          if (isJunkMovieSignal(pk.img, movie)) { urlSeen.add(pk.img); continue; }
          if (!urlMatchesMovieTitle(pk.img, movie)) { urlSeen.add(pk.img); continue; }
        } catch (e) {}
      }
      if (urlSeen.has(pk.img)) continue;
      const b = await grab(pk.img);
      if (!b) continue;
      const qual = await qualifyPhoto(b, pk.img);
      if (!qual) continue;
      if (!(await isArtNotChart(b))) { urlSeen.add(pk.img); continue; }   // 👁️ vision gate — toss charts/graphs/documents
      const ph = await pHash(b);
      if (regBlocked(ph, pillar, id, opts)) { urlSeen.add(pk.img); continue; }
      regAdd(ph, pk.img, qual.w, qual.h, pillar, id);
      return { buf: b, qual };
    } catch (e) {}
  }
  return null;
}
// Gather up to N distinct graded-ready cover candidates for the picker UI (Fable v2).
async function gatherCoverCandidates(question, id, maxN, stats) {
  maxN = maxN || 10;
  stats = stats || { fetched: 0, graded: 0, dedupedRejected: 0, placeholderHits: 0 };
  if (!searchRealPhoto || !sharp) return [];
  await backfillRegistry();
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const urlSeen = new Set(loadReg().entries.map(e => e.url));
  const phSeen = new Set();
  const out = [];
  const BACKOFF = [5000, 15000, 45000];
  let empties = 0;
  for (let attempt = 0; attempt < 24 && out.length < maxN; attempt++) {
    try {
      const q = coverQuery(question, id, attempt);
      stats.fetched++;
      const pk = await searchRealPhoto(q, id + '-c' + attempt, {});
      if (!pk || !pk.img) { if (empties < BACKOFF.length) { await _bo(BACKOFF[empties]); empties++; } continue; }
      if (STOCK_BLOCK.test(pk.img) || COMPOSITE_BLOCK.test(pk.img) || REJECT_URL.test(pk.img)) { stats.dedupedRejected++; continue; }
      if (urlSeen.has(pk.img)) { stats.dedupedRejected++; continue; }
      const b = await grab(pk.img);
      if (!b) { stats.placeholderHits++; continue; }
      if (b.length < 5000 || String(b.slice(0, 64)).includes('<svg')) { stats.placeholderHits++; continue; }
      const qual = await qualifyPhoto(b, pk.img);
      if (!qual) { stats.dedupedRejected++; continue; }
      if (!(await isArtNotChart(b))) { stats.dedupedRejected++; urlSeen.add(pk.img); continue; }
      const ph = await pHash(b);
      if (regBlocked(ph, pillar, id, { excludePh: [...phSeen] })) { stats.dedupedRejected++; urlSeen.add(pk.img); continue; }
      if ([...phSeen].some(p => hamming(p, ph) <= REG_HAMMING)) { stats.dedupedRejected++; continue; }
      phSeen.add(ph);
      urlSeen.add(pk.img);
      const artistic = /artistic|painting|watercolor|cinematic|moody|fine art|illustration/i.test(q);
      out.push({ buf: b, qual, query: q, artistic });
      stats.graded++;
      await _bo(1200 + Math.floor(Math.random() * 800));
    } catch (e) {}
  }
  out.sort((a, b) => (b.artistic ? 1 : 0) - (a.artistic ? 1 : 0));
  return out.slice(0, maxN);
}
async function makeDdgFaceCover(id, question, opts) {
  opts = opts || {};
  if ((POLLINATOR_IMAGES_ONLY || DDG_IMAGES_BANNED) && !allowDdgForCall(opts)) return 0;
  if (coverFileOk(id)) { try { return fs.statSync(coverPath(id)).size; } catch (e) { return 0; } }
  if (!sharp) return 0;
  const pick = await ddgCleanPhoto(question, id, Object.assign({ qaUpgradeAlternate: true }, opts));
  if (!pick) return 0;
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  // light-dominant images need extra darkening so the gold title reads; transparent PNGs get a solid
  // dark backdrop instead of showing raw page background (animated GIFs already flattened to frame 1).
  // ONE shared vintage grade (spec): ~70% saturation, -15% contrast, warm sepia cast. Never per-image.
  const bright = pick.qual.meanB > 175;
  await gradeFaceCardFromBuffer(pick.buf, coverPath(id), { question, bright });
  try { return fs.statSync(coverPath(id)).size; } catch (e) { return 0; }
}
async function stampCoverProvenance(id, store, src, opts) {
  opts = opts || {};
  if (!VALID_FACE_COVER_SRC.has(src)) return;
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent) {
      ent.img = '/assets/qa/' + id + '.jpg';
      ent.cover_src = src;
      if (opts.faceTitleBaked) ent.face_title_baked = true;
      await store.setJSON('_index.json', idx);
    }
    const cur = await store.get('answers/' + id + '.json', { type: 'json' });
    if (cur) {
      const patch = Object.assign({}, cur, { cover_src: src });
      if (opts.faceTitleBaked) patch.face_title_baked = true;
      await store.setJSON('answers/' + id + '.json', patch);
    }
  } catch (e) {}
}
/** Composite orange Q&A title onto an existing face-card cover (no new flux fetch). */
async function rebakeFaceCardTitle(id, question) {
  if (!sharp || !coverFileOk(id)) return false;
  try {
    const existing = fs.readFileSync(coverPath(id));
    const m = await sharp(existing).metadata();
    const w = m.width || S, h = m.height || S;
    const title = String(question || id || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
    if (!title) return false;
    const graded = await sharp(existing)
      .composite([{ input: goldTitleOverlaySVG(w, h, title) }])
      .jpeg({ quality: 82, mozjpeg: true })
      .withMetadata({ exif: { IFD0: { ImageDescription: GRADE_STAMP } } })
      .toBuffer();
    fs.writeFileSync(coverPath(id), graded);
    return graded.length > 40000;
  } catch (e) { return false; }
}
async function ensureFaceCardOrangeTitle(id, question, store) {
  if (!coverFileOk(id)) return false;
  try {
    const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
    const ent = (idx.entries || []).find(x => x && x.id === id);
    if (ent && ent.face_title_baked) return true;
    const cur = await store.get('answers/' + id + '.json', { type: 'json' }).catch(() => null);
    if (cur && cur.face_title_baked) return true;
    const q = question || (ent && ent.question) || (cur && cur.question) || id;
    const ok = await rebakeFaceCardTitle(id, q);
    if (!ok) return false;
    await stampCoverProvenance(id, store, (ent && ent.cover_src) || 'flux', { faceTitleBaked: true });
    return true;
  } catch (e) { return false; }
}
async function stampDdgProvenance(id, store) { return stampCoverProvenance(id, store, 'ddg-facecard'); }
function coverAltFirst(id) { let h = 0; for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return (h % 2 === 0); }
async function makeFluxFaceCover(id, question, opts) {
  opts = opts || {};
  if (coverFileOk(id)) { try { return fs.statSync(coverPath(id)).size; } catch (e) { return 0; } }
  if (!sharp) return 0;
  const { runFluxJob, fetchFluxPrompt } = require('./_pollinator_flux_throttle');
  return runFluxJob(async () => {
    let seed = 0; for (const ch of String(id)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const prompt = buildFluxFaceQuery(id, question, 0);
    const img = await fetchFluxPrompt(prompt, seed, { pool: true });
    if (!img) return 0;
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
    await gradeFaceCardFromBuffer(img, coverPath(id), { question, bright: false });
    try { return fs.statSync(coverPath(id)).size; } catch (e) { return 0; }
  }, 'face-cover:' + id, { noCooldown: !!opts.skipAlternateWait });
}
// Drop-in replacement for ensureFaceCardCover (same signature) — Pollinator flux only (DDG banned).
async function ensureDdgFaceCover(id, question, store, coverSrc) {
  return ensureAlternateFaceCover(id, question, store, coverSrc);
}
// Face-card covers — Pollinator flux default; DDG alternate when opts.alternateSources (Q&A upgrade).
async function ensureAlternateFaceCover(id, question, store, coverSrc, opts) {
  opts = opts || {};
  try {
    if (faceCardCoverOk(id, coverSrc) && await verifyGradeStamp(coverPath(id))) {
      await ensureFaceCardOrangeTitle(id, question, store);
      return coverSrc;
    }
    const canDdg = allowDdgForCall(Object.assign({ qaUpgradeAlternate: true }, opts));
    const preferred = coverAltFirst(id) ? 'flux' : 'ddg';
    if (!canDdg || !opts.alternateSources) {
      if (await makeFluxFaceCover(id, question, opts)) {
        await stampCoverProvenance(id, store, 'flux', { faceTitleBaked: true });
        return 'flux';
      }
      return coverSrc;
    }
    const { nextAlternateProvider, runProviderJob } = require('./_image_provider_alternate');
    let provider = nextAlternateProvider(preferred);
    if (provider === 'ddg' && !canDdg) provider = 'flux';
    const innerOpts = Object.assign({}, opts, { skipAlternateWait: true });
    if (provider === 'flux') {
      const ok = await runProviderJob('flux', () => makeFluxFaceCover(id, question, innerOpts), 'alt-face-flux:' + id, opts);
      if (ok) {
        await stampCoverProvenance(id, store, 'flux', { faceTitleBaked: true });
        return 'flux';
      }
    } else {
      const ok = await runProviderJob('ddg', () => makeDdgFaceCover(id, question, innerOpts), 'alt-face-ddg:' + id, opts);
      if (ok) {
        await stampCoverProvenance(id, store, 'ddg-facecard', { faceTitleBaked: true });
        return 'ddg-facecard';
      }
    }
    return coverSrc;
  } catch (e) { return coverSrc; }
}
// Prefer an existing self-hosted library image (cross-page reuse OK; excludeUrls = same-page slots).
const FILL_STOP = new Set(['that', 'this', 'with', 'from', 'your', 'have', 'what', 'when', 'where', 'which', 'their', 'about', 'into', 'over', 'after', 'before', 'under', 'between', 'through', 'during', 'without', 'within', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except', 'also', 'just', 'only', 'very', 'more', 'most', 'some', 'such', 'than', 'then', 'them', 'they', 'will', 'would', 'could', 'should', 'been', 'being', 'does', 'done', 'make', 'made', 'like', 'need', 'best', 'good', 'great', 'top', 'guide', 'ranked', 'ranking', 'pulse', 'answer', 'direct']);
function topicTokens(text) {
  const out = [];
  for (const w of String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)) {
    if (w.length < 3 || FILL_STOP.has(w)) continue;
    if (!out.includes(w)) out.push(w);
  }
  return out;
}
function srcIdFromUrl(url) {
  const m = String(url || '').match(/\/assets\/qa\/([a-z]{2,3}\d+)/i);
  if (!m) return '';
  return m[1].replace(/(-\d+.*)$/i, '');
}
function pillarFromImageUrl(url) {
  const u = String(url || '').replace(/\?.*$/, '');
  let m = u.match(/\/assets\/qa\/pool-([a-z]{2,3})-/i);
  if (m) return m[1];
  m = u.match(/\/assets\/qa\/([a-z]{2,3})\d/i);
  if (m) return m[1];
  return '';
}
function entryPillarOf(entry) {
  if (entry && entry.pillar) return String(entry.pillar);
  return pillarFromImageUrl(entry && entry.url);
}
function countTokenOverlap(a, b) {
  const tb = new Set(topicTokens(b));
  if (!tb.size) return 0;
  return topicTokens(a).filter(w => tb.has(w)).length;
}
function isPhExcluded(ph, excludePh) {
  if (!ph || !excludePh || !excludePh.length) return false;
  for (const prev of excludePh) {
    if (hamming(prev, ph) <= REG_HAMMING) return true;
  }
  return false;
}
function isPoolImageUrl(url) {
  return /^\/assets\/qa\/pool-[a-z]{2,3}-\d{3}\.jpg$/i.test(String(url || '').replace(/\?.*$/, ''));
}
function regEntryForUrl(url, urlMap) {
  const u = String(url || '').replace(/\?.*$/, '').trim();
  if (!u) return null;
  if (urlMap) return urlMap.get(u) || null;
  for (const e of loadReg().entries) if (e.url === u) return e;
  return null;
}
/** Pollinator pool slot, flux face-card, or graded flux section — never DDG stock. */
function isPollinatorImageUrl(url, id, opts) {
  const u = String(url || '').replace(/\?.*$/, '').trim();
  if (!u) return false;
  if (isPoolImageUrl(u)) return true;
  const ent = regEntryForUrl(u, opts && opts.regUrlMap);
  if (ent && ent.pool) return true;
  if (u === '/assets/qa/' + id + '.jpg') {
    const cs = opts && opts.coverSrcLookup && opts.coverSrcLookup[id];
    return cs === 'flux';
  }
  if (/^\/assets\/qa\/[a-z]{2,3}\d+-\d+\.jpg$/i.test(u)) {
    try { return hasGradeStampInBuf(fs.readFileSync(WD + u)); } catch (e) { return false; }
  }
  return false;
}
/** Fast check: self-hosted Pollinator / pool image already graded and sized — skip regen. */
function pollinatorImageLooksGoodSync(url, id, opts) {
  opts = opts || {};
  const u = String(url || '').replace(/\?.*$/, '').trim();
  if (!u || /pollinations\.ai|^https?:\/\//i.test(u)) return false;
  if (/placeholder\.svg|\/img\/auto\/|\.svg(\?|$)/i.test(u)) return false;
  let size = 0;
  try { size = fs.statSync(WD + u).size; } catch (e) { return false; }
  if (size < 8000) return false;
  if (isPoolImageUrl(u)) return true;
  const ent = regEntryForUrl(u, opts.regUrlMap);
  if (ent && ent.pool) return true;
  if (u === '/assets/qa/' + id + '.jpg') {
    const cs = opts.coverSrcLookup && opts.coverSrcLookup[id];
    if (cs === 'ddg-facecard') return false;
    if (cs === 'flux' && coverFileOk(id)) return true;
  }
  if (/^\/assets\/qa\/[a-z]{2,3}\d+-\d+\.jpg$/i.test(u)) {
    try { return hasGradeStampInBuf(fs.readFileSync(WD + u)); } catch (e) { return false; }
  }
  return false;
}
/** Async: Pollinator / graded flux section passes audit — keep, do not overwrite. */
async function pollinatorImageLooksGood(url, id, opts) {
  opts = opts || {};
  if (pollinatorImageLooksGoodSync(url, id, opts)) return true;
  const u = String(url || '').replace(/\?.*$/, '').trim();
  if (!/^\/assets\/qa\//.test(u)) return false;
  if (isDdgOrLegacyImageUrl(u, id, opts)) return false;
  try {
    const aud = await auditImage(u, id);
    if (!aud.pass) return false;
    if (u === '/assets/qa/' + id + '.jpg') {
      const cs = opts.coverSrcLookup && opts.coverSrcLookup[id];
      return faceCardCoverOk(id, cs);
    }
    if (/^\/assets\/qa\/[a-z]{2,3}\d+-\d+\.jpg$/i.test(u)) {
      const buf = fs.readFileSync(WD + u);
      return !!(await verifyGradeStamp(buf)) || buf.length > 12000;
    }
  } catch (e) {}
  return false;
}
/** Self-hosted QA image that is DDG / legacy — must be overwritten with Pollinator pool or flux. */
function isDdgOrLegacyImageUrl(url, id, opts) {
  const u = String(url || '').replace(/\?.*$/, '').trim();
  if (!u || /kory-white\.jpg/i.test(u)) return false;
  if (/^https?:\/\//i.test(u)) return true;
  if (/placeholder\.svg|\/img\/auto\/|pollinations\.ai|\.svg(\?|$)/i.test(u)) return false;
  if (isPoolImageUrl(u)) return false;
  if (isPollinatorImageUrl(u, id, opts)) return false;
  if (!/^\/assets\/qa\//.test(u) && !/^\/assets\/cro-cover-/i.test(u)) return false;
  if (u === '/assets/qa/' + id + '.jpg') {
    const cs = opts && opts.coverSrcLookup && opts.coverSrcLookup[id];
    if (cs === 'flux') return false;
    return true;
  }
  if (/^\/assets\/qa\//.test(u)) {
    try { return fs.statSync(WD + u).size > 8000; } catch (e) { return true; }
  }
  return /^\/assets\/cro-cover-/i.test(u);
}
function isFaceCardCoverUrl(url) {
  return /^\/assets\/qa\/[a-z]{2,3}\d+\.jpg$/i.test(String(url || '').replace(/\?.*$/, ''));
}
function poolImageRel(pillar, slot) {
  return '/assets/qa/pool-' + pillar + '-' + String(slot).padStart(3, '0') + '.jpg';
}
function poolImagePath(pillar, slot) {
  return DIR + '/pool-' + pillar + '-' + String(slot).padStart(3, '0') + '.jpg';
}
function countPillarPoolSlots(pillar) {
  let n = 0;
  try {
    const re = new RegExp('^pool-' + pillar + '-(\\d+)\\.jpg$', 'i');
    for (const f of fs.readdirSync(DIR)) {
      if (!re.test(f)) continue;
      try { if (fs.statSync(DIR + '/' + f).size > 8000) n++; } catch (e) {}
    }
  } catch (e) {}
  return n;
}
/** One pass over /assets/qa — count saved pool-{pillar}-NNN.jpg per pillar (Image Fill dupes). */
function pillarPoolInventory() {
  const counts = {};
  try {
    const re = /^pool-([a-z]{2,3})-(\d+)\.jpg$/i;
    for (const f of fs.readdirSync(DIR)) {
      const m = f.match(re);
      if (!m) continue;
      try { if (fs.statSync(DIR + '/' + f).size <= 8000) continue; } catch (e) { continue; }
      const p = m[1].toLowerCase();
      counts[p] = (counts[p] || 0) + 1;
    }
  } catch (e) {}
  return counts;
}
function maxPoolSlot(pillar) {
  let max = 0;
  try {
    const re = new RegExp('^pool-' + pillar + '-(\\d+)\\.jpg$', 'i');
    for (const f of fs.readdirSync(DIR)) {
      const m = f.match(re);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
  } catch (e) {}
  return max;
}
function nextPoolSlot(pillar) {
  for (let i = 1; i <= 999; i++) {
    try { if (fs.statSync(poolImagePath(pillar, i)).size > 8000) continue; } catch (e) { return i; }
  }
  return maxPoolSlot(pillar) + 1;
}
const STAGING_DIR = DIR + '/_pool-staging';
function stagingRel(batchId, idx) {
  return '/assets/qa/_pool-staging/' + batchId + '-' + String(idx).padStart(3, '0') + '.jpg';
}
function stagingPath(batchId, idx) {
  return STAGING_DIR + '/' + batchId + '-' + String(idx).padStart(3, '0') + '.jpg';
}
function ensureStagingDir() {
  if (!fs.existsSync(STAGING_DIR)) fs.mkdirSync(STAGING_DIR, { recursive: true });
}
function discardStagingBatch(batchId, count) {
  for (let i = 1; i <= (count || POOL_BATCH_MAX); i++) {
    try { fs.unlinkSync(stagingPath(batchId, i)); } catch (e) {}
  }
}
async function gradeToStaging(rawBuf, batchId, idx) {
  ensureStagingDir();
  const dest = stagingPath(batchId, idx);
  const qual = await qualifyPhoto(rawBuf, dest);
  if (!qual) return null;
  if (!(await isArtNotChart(rawBuf))) return null;
  const stored = await storeGradedImage(rawBuf, dest, { width: Math.min(1000, qual.w || 1000), bright: qual.meanB > 175 });
  const ph = await pHash(fs.readFileSync(dest));
  return { previewUrl: stagingRel(batchId, idx), ph, w: stored.w, h: stored.h };
}
async function harvestOneToStaging(pillar, batchId, idx, excludePh, triedFiles) {
  const re = new RegExp('^' + pillar + '\\d+-\\d+\\.jpg$', 'i');
  const files = fs.readdirSync(DIR).filter(f => re.test(f) && !triedFiles.has(f)).sort(() => Math.random() - 0.5);
  for (const f of files) {
    triedFiles.add(f);
    const src = DIR + '/' + f;
    try { if (fs.statSync(src).size < 8000) continue; } catch (e) { continue; }
    const buf = fs.readFileSync(src);
    const ph0 = await pHash(buf);
    if (!ph0) continue;
    let dupe = false;
    for (const prev of excludePh) { if (hamming(prev, ph0) <= REG_HAMMING) { dupe = true; break; } }
    if (dupe) continue;
    const graded = await gradeToStaging(buf, batchId, idx);
    if (!graded) continue;
    excludePh.push(graded.ph);
    return { ok: true, previewUrl: graded.previewUrl, source: 'harvest', query: 'harvested:' + f, ph: graded.ph, w: graded.w, h: graded.h };
  }
  return { ok: false };
}
async function generateOneToStaging(pillar, batchId, idx, slotSeed, excludePh, urlSeen) {
  if (POLLINATOR_IMAGES_ONLY || DDG_IMAGES_BANNED) return { ok: false, err: 'ddg banned' };
  if (!searchRealPhoto || !sharp) return { ok: false, err: 'ddg unavailable' };
  const query = buildPoolQuery(pillar, slotSeed);
  const fakeId = '_batch-' + batchId + '-' + String(idx).padStart(3, '0');
  const STYLES = [
    s => 'cinematic ' + s + ' photography dramatic',
    s => 'artistic ' + s + ' dramatic fine art',
    s => 'dramatic ' + s + ' photography moody atmospheric',
    s => 'editorial ' + s + ' photograph professional',
  ];
  for (let attempt = 0; attempt < 14; attempt++) {
    try {
      const styled = STYLES[(hashId(fakeId) + attempt) % STYLES.length](String(query || PILLAR_SUBJECT[pillar] || pillar));
      const pk = await searchRealPhoto(styled + ' photograph', fakeId + '-a' + attempt, {});
      if (!pk || !pk.img) { await _bo(3000); continue; }
      if (STOCK_BLOCK.test(pk.img) || COMPOSITE_BLOCK.test(pk.img) || REJECT_URL.test(pk.img)) continue;
      if (urlSeen.has(pk.img)) continue;
      const b = await grab(pk.img);
      if (!b) continue;
      const graded = await gradeToStaging(b, batchId, idx);
      if (!graded) { urlSeen.add(pk.img); continue; }
      if (regBlocked(graded.ph, pillar, fakeId, { excludePh })) { urlSeen.add(pk.img); try { fs.unlinkSync(stagingPath(batchId, idx)); } catch (e) {} continue; }
      urlSeen.add(pk.img);
      excludePh.push(graded.ph);
      return { ok: true, previewUrl: graded.previewUrl, source: 'ddg', query: query || styled, ph: graded.ph, w: graded.w, h: graded.h };
    } catch (e) {}
    await _bo(4000);
  }
  return { ok: false, err: 'no match after retries' };
}
const POOL_BATCH_MAX = parseInt(process.env.POOL_BATCH_MAX || '250', 10);
const POOL_BATCH_DEFAULT = parseInt(process.env.POOL_BATCH_DEFAULT || '209', 10);
/** Image Fill may cross-reuse pool slots only after this many unique pool-{pillar}-NNN files exist. */
const POOL_REUSE_AFTER = parseInt(process.env.POOL_REUSE_AFTER || '50', 10);
/** Image Fill job: once this fraction of blank slots are filled, reuse URLs already placed in this run. */
const FILL_REUSE_PCT = parseFloat(process.env.FILL_REUSE_PCT || '0.5');
const { getGapMs, fluxStats } = require('./_pollinator_flux_throttle');
const imageProviderAlt = (() => { try { return require('./_image_provider_alternate'); } catch (e) { return null; } })();
const POOL_FLUX_ONLY = true;
function pollinatorBreakSec() { return Math.round(getGapMs() / 1000); }
function pollinatorBreakLabel() {
  if (imageProviderAlt && imageProviderAlt.cooldownLabel) return imageProviderAlt.cooldownLabel();
  const sec = pollinatorBreakSec();
  return sec > 0 ? ('global ' + sec + 's break') : 'back-to-back serial flux';
}
async function _waitStop(ms, shouldStop) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (shouldStop && shouldStop()) return true;
    await _bo(Math.min(400, end - Date.now()));
  }
  return false;
}
async function fluxOneToStaging(pillar, batchId, idx, slotSeed, excludePh, shouldStop, opts) {
  opts = opts || {};
  if (!sharp) return { ok: false, err: 'sharp unavailable', reason: 'sharp' };
  const { runFluxJob, fetchFluxPrompt } = require('./_pollinator_flux_throttle');
  const fakeId = '_batch-' + batchId + '-' + String(idx).padStart(3, '0');
  const usedQueries = opts.usedQueries || null;
  const missStreak = opts.missStreak || 0;
  const branchCursor = opts.branchCursor || 0;
  const MAX_TRY = Math.min(20, 12 + Math.floor(missStreak / 2));
  let lastFail = null;
  let lastPlan = null;
  for (let t = 0; t < MAX_TRY; t++) {
    if (shouldStop && shouldStop()) return { ok: false, err: 'stopped', reason: 'stopped' };
    const plan = planFluxMissRetry(t, lastFail, missStreak, pillar, slotSeed + t * 41, branchCursor + t);
    lastPlan = plan;
    const keywordState = opts.keywordState || { cursor: 0 };
    const kw = takePoolKeyword(pillar, keywordState);
    plan.branch = kw.branch;
    plan.branchLabel = POOL_BRANCH_LABELS[kw.branch] || kw.branch;
    const slot = slotSeed + t * 13 + idx + plan.sceneJump;
    let query = buildPoolQuery(pillar, slot, t + (opts.attemptBase || 0) + missStreak, Object.assign({}, plan, { keywordEntry: kw, modifierIdx: keywordState.cursor }));
    if (usedQueries && usedQueries.has(query)) {
      const kw2 = takePoolKeyword(pillar, keywordState);
      plan.branch = kw2.branch;
      plan.branchLabel = POOL_BRANCH_LABELS[kw2.branch] || kw2.branch;
      query = buildPoolQuery(pillar, slot + 997 + t * 53, t + (opts.attemptBase || 0) + missStreak + t + 1, Object.assign({}, plan, { keywordEntry: kw2, modifierIdx: keywordState.cursor, sceneJump: plan.sceneJump + t + 7, mode: t < 2 ? plan.mode : 'scene_jump' }));
    }
    if (isClichePoolQuery(query)) continue;
    const seed = hashId(fakeId + '|' + query + '|' + t + '|s' + plan.seedSalt);
    let tryFail = null;
    try {
      const result = await runFluxJob(async () => {
        if (shouldStop && shouldStop()) return null;
        const img = await fetchFluxPrompt(query, seed, { pool: true, missMode: plan.missMode, maxTry: lastFail === 'fetch' ? 8 : 6 });
        if (!img) { tryFail = 'fetch'; return null; }
        const graded = await gradeToStaging(img, batchId, idx);
        if (!graded) { tryFail = 'grade'; return null; }
        if (regBlocked(graded.ph, pillar, fakeId, { excludePh })) {
          tryFail = 'dupe';
          try { fs.unlinkSync(stagingPath(batchId, idx)); } catch (e) {}
          return null;
        }
        const stagedBuf = fs.readFileSync(stagingPath(batchId, idx));
        if (!(await poolStagingQualityOk(stagedBuf, pillar, query))) {
          tryFail = 'quality';
          try { fs.unlinkSync(stagingPath(batchId, idx)); } catch (e) {}
          return null;
        }
        excludePh.push(graded.ph);
        if (usedQueries) usedQueries.add(query);
        return { ok: true, previewUrl: graded.previewUrl, source: 'flux', query, ph: graded.ph, w: graded.w, h: graded.h, plan: plan.mode, branch: plan.branch, branchLabel: plan.branchLabel, keyword: kw.keyword, keywordIdx: kw.idx };
      }, 'pool-flux:' + batchId + '-' + idx + '-t' + t + '-' + (plan.branch || 'core') + '-k' + kw.idx);
      if (result && result.ok) return result;
      if (tryFail) lastFail = tryFail;
      else lastFail = 'fetch';
    } catch (e) {
      if (e && e.code === 'SCRUB_STOP') throw e;
      lastFail = 'fetch';
    }
  }
  const nextKw = peekPoolKeyword(pillar, (opts.keywordState && opts.keywordState.cursor) || 0, opts.keywordState);
  const nextPlan = planFluxMissRetry(MAX_TRY, lastFail, missStreak + 1, pillar, slotSeed + MAX_TRY * 41, branchCursor + 1);
  nextPlan.branch = nextKw.branch;
  nextPlan.branchLabel = POOL_BRANCH_LABELS[nextKw.branch] || nextKw.branch;
  const nextQuery = buildPoolQuery(pillar, slotSeed + MAX_TRY * 13, (opts.attemptBase || 0) + missStreak + 1, Object.assign({}, nextPlan, { keywordEntry: nextKw, modifierIdx: (opts.keywordState && opts.keywordState.cursor) || 0 }));
  return {
    ok: false,
    err: lastFail === 'dupe' ? ('dupe after ' + MAX_TRY + ' tries — pool too similar') : ('flux ' + (lastFail || 'failed') + ' after ' + MAX_TRY + ' tries'),
    reason: lastFail || 'failed',
    nextPlan,
    nextQuery,
  };
}
/** Collect batchSize graded candidates to staging — owner reviews before pool commit. */
async function collectPillarPoolBatch(pillar, batchSize, opts) {
  opts = opts || {};
  batchSize = Math.max(1, Math.min(POOL_BATCH_MAX, batchSize || POOL_BATCH_DEFAULT));
  const batchId = pillar + '-' + Date.now().toString(36);
  const candidates = [];
  await backfillRegistry();
  if (opts.onBatchStart) opts.onBatchStart({ batchId, pillar, target: batchSize });
  const excludePh = poolPhExcludeSet(pillar);
  const urlSeen = new Set(loadReg().entries.map(e => e.url));
  const triedFiles = new Set();
  let harvested = 0, generated = 0, fluxGenerated = 0, errors = 0;
  const fluxOnly = opts.fluxOnly != null ? !!opts.fluxOnly : POOL_FLUX_ONLY;
  if (fluxOnly) {
    let attempt = 0;
    let missStreak = 0;
    let branchCursor = 0;
    const guideKeywords = parseGuideKeywords(opts.guideKeywords);
    const keywordState = { cursor: 0 };
    if (guideKeywords.length) keywordState.guideCatalog = guideKeywords.map(kw => ({ keyword: kw }));
    const usedQueries = new Set();
    const kwTotal = keywordState.guideCatalog ? keywordState.guideCatalog.length : pillarKeywordCatalog(pillar).length;
    const fluxNote = pollinatorBreakLabel();
    if (opts.onLog) {
      opts.onLog('batch ' + batchId + ' — Pollinator · ' + pillar + ' · '
        + (keywordState.guideCatalog
          ? ('guide keywords ×' + guideKeywords.length + ' — ' + guideKeywords.slice(0, 4).join(' · ') + (guideKeywords.length > 4 ? '…' : ''))
          : (kwTotal + ' keywords (core+branches)'))
        + ' · new keyword every try · ' + fluxNote + ' · target ' + batchSize);
    }
    while (candidates.length < batchSize) {
      if (opts.shouldStop && opts.shouldStop()) break;
      attempt++;
      const idx = attempt;
      const activeBranch = pickPoolBranch(missStreak, 0, branchCursor);
      let slotSeed = maxPoolSlot(pillar) + candidates.length * 17 + attempt + missStreak * 23 + activeBranch.branchIdx * 41;
      const hintKw = peekPoolKeyword(pillar, keywordState.cursor, keywordState);
      const queryHint = buildPoolQuery(pillar, slotSeed, attempt + missStreak, Object.assign({}, planFluxMissRetry(0, missStreak ? 'dupe' : null, missStreak, pillar, slotSeed, branchCursor), { keywordEntry: hintKw, modifierIdx: keywordState.cursor, mode: 'normal' }));
      const readyIn = fluxStats().fluxReadyInMs || 0;
      if (readyIn > 500 && opts.onProgress) {
        opts.onProgress({ idx: candidates.length + 1, target: batchSize, have: candidates.length, query: 'wait ' + Math.round(readyIn / 1000) + 's', step: 'wait' });
      }
      if (opts.onLog) opts.onLog('🌸 ' + pillar + ' flux ' + (candidates.length + 1) + '/' + batchSize + ' · kw ' + (hintKw.idx + 1) + '/' + (hintKw.total || kwTotal) + ' [' + hintKw.branch + ']' + (missStreak ? (' · miss×' + missStreak) : '') + ' — ' + String(hintKw.keyword).slice(0, 42));
      if (opts.onProgress) opts.onProgress({ idx: candidates.length + 1, target: batchSize, have: candidates.length, query: '🌸 ' + queryHint, step: 'flux' });
      const r = await fluxOneToStaging(pillar, batchId, idx, slotSeed, excludePh, opts.shouldStop, { usedQueries, attemptBase: attempt + missStreak, missStreak, branchCursor, keywordState });
      if (r && r.ok) {
        missStreak = 0;
        branchCursor = (branchCursor + 1) % POOL_BRANCH_ORDER.length;
        fluxGenerated++;
        const cand = { id: 'c' + (candidates.length + 1), idx: candidates.length + 1, previewUrl: r.previewUrl, source: r.source, query: r.query, ph: r.ph, w: r.w, h: r.h, approved: null, branch: r.branch, keyword: r.keyword };
        candidates.push(cand);
        if (opts.onCandidate) opts.onCandidate(cand);
        if (opts.onLog) opts.onLog('✓ ' + candidates.length + '/' + batchSize + ' flux [' + (r.branch || 'core') + '] — ' + String(r.keyword || r.query || '').slice(0, 48));
        if (opts.onProgress) opts.onProgress({ idx: candidates.length, target: batchSize, have: candidates.length, query: r.query, step: 'done' });
      } else {
        errors++;
        missStreak++;
        branchCursor = (branchCursor + 1) % POOL_BRANCH_ORDER.length;
        const np = r && r.nextPlan;
        const nq = (r && r.nextQuery) || '';
        const nkw = peekPoolKeyword(pillar, keywordState.cursor, keywordState);
        if (opts.onLog) opts.onLog('flux miss (' + ((r && r.reason) || '?') + ') → next kw ' + (nkw.idx + 1) + '/' + (nkw.total || kwTotal) + ' [' + nkw.branch + '] — ' + String(nkw.keyword).slice(0, 42));
      }
    }
    return { batchId, pillar, candidates, harvested, generated, fluxGenerated, errors, stopped: !!(opts.shouldStop && opts.shouldStop()) };
  }
  const harvestTarget = Math.min(Math.floor(batchSize * 0.45), 45);
  if (opts.onLog) opts.onLog('batch ' + batchId + ' — finding ' + batchSize + ' candidates (Pollinator ' + pollinatorBreakLabel() + ', graded)');
  for (let i = 1; i <= batchSize; i++) {
    if (opts.shouldStop && opts.shouldStop()) break;
    const slotSeed = maxPoolSlot(pillar) + i;
    const queryHint = buildPoolQuery(pillar, slotSeed);
    if (opts.onProgress) opts.onProgress({ idx: i, target: batchSize, have: candidates.length, query: queryHint, step: 'find' });
    let r = null;
    if (harvested < harvestTarget) r = await harvestOneToStaging(pillar, batchId, i, excludePh, triedFiles);
    if (r && r.ok) harvested++;
    else {
      if (opts.onLog) opts.onLog('🌸 Pollinator flux #' + i + ' — ' + String(queryHint).slice(0, 50));
      if (opts.onProgress) opts.onProgress({ idx: i, target: batchSize, have: candidates.length, query: '🌸 ' + queryHint, step: 'flux' });
      r = await fluxOneToStaging(pillar, batchId, i, slotSeed, excludePh, opts.shouldStop, { usedQueries: new Set(), attemptBase: i });
      if (r && r.ok) fluxGenerated++;
      else if (opts.onLog) {
        const np = planFluxMissRetry(0, 'dupe', 1, pillar, slotSeed + i, 1);
        opts.onLog('flux miss #' + i + ' (dupe/fail) → next: ' + np.label);
      }
      if (!r || !r.ok) {
        r = await generateOneToStaging(pillar, batchId, i, slotSeed, excludePh, urlSeen);
        if (r && r.ok) generated++;
        else { errors++; if (opts.onLog) opts.onLog('✗ candidate ' + i + ' — ' + ((r && r.err) || 'no match')); await _bo(1500); continue; }
      }
    }
    const cand = { id: 'c' + i, idx: i, previewUrl: r.previewUrl, source: r.source, query: r.query, ph: r.ph, w: r.w, h: r.h, approved: null };
    candidates.push(cand);
    if (opts.onCandidate) opts.onCandidate(cand);
    if (opts.onLog) opts.onLog('✓ ' + i + '/' + batchSize + ' ' + r.source + ' — ' + String(r.query || '').slice(0, 50));
    await _bo(2200);
  }
  return { batchId, pillar, candidates, harvested, generated, fluxGenerated, errors, stopped: !!(opts.shouldStop && opts.shouldStop()) };
}
const POOL_CURATE_MIN_SCORE = parseInt(process.env.POOL_CURATE_MIN_SCORE || '35', 10);
const POOL_CURATE_BATCH_HAMMING = parseInt(process.env.POOL_CURATE_BATCH_HAMMING || '6', 10);
async function poolStagingQualityOk(buf, pillar, query) {
  if (!buf || buf.length < 12000) return false;
  if (isClichePoolQuery(query)) return false;
  const qual = await qualifyPhoto(buf, 'pool-staging');
  if (!qual || qual.sd < 22) return false;
  if (!(await isGoodPoolScene(buf, pillar, query))) return false;
  return true;
}
async function isWellFramedForTile(buf, kind) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || process.env.FACE_FRAMING_GEMINI === '0') return true;
  kind = kind || 'square';
  const slot = kind === 'wide' ? 'wide 3:1 homepage mosaic face-card tile' : 'square homepage mosaic face-card tile';
  try {
    const body = { contents: [{ parts: [
      { text: 'Reply only KEEP or REJECT. KEEP only if faces/heads are fully visible with comfortable headroom — nothing important cropped at the top or sides for a ' + slot + '. REJECT if any head, face, or key subject is cut off at the frame edge.' },
      { inlineData: { mimeType: 'image/jpeg', data: buf.toString('base64') } },
    ] }], generationConfig: { maxOutputTokens: 8, temperature: 0 } };
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(18000) });
    if (!r.ok) return true;
    const j = await r.json();
    const t = String(j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text || '').trim().toUpperCase();
    return t.startsWith('KEEP');
  } catch (e) { return true; }
}
async function faceCoverQualityOk(id, question, buf) {
  if (!buf || buf.length < 40000) return { ok: false, reason: 'small' };
  const rel = '/assets/qa/' + id + '.jpg';
  const qual = await qualifyPhoto(buf, rel);
  if (!qual) return { ok: false, reason: 'qual' };
  if (qual.sd < 22) return { ok: false, reason: 'flat' };
  if (!(await isArtNotChart(buf))) return { ok: false, reason: 'chart' };
  if (!(await isGoodFaceCoverScene(buf, question, id))) return { ok: false, reason: 'scene' };
  if (!(await isWellFramedForTile(buf, 'wide'))) return { ok: false, reason: 'framing' };
  return { ok: true, qual };
}
async function isGoodFaceCoverScene(buf, question, id) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || process.env.FACE_COVER_GEMINI === '0') return true;
  try {
    const title = String(question || id).replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
    const body = { contents: [{ parts: [
      { text: 'Reply only KEEP or REJECT. KEEP if this is a real editorial photograph that could illustrate the Q&A topic: "' + title + '". REJECT if chart/diagram/infographic, generic business handshake, stock meeting cliché, or clearly unrelated to the topic.' },
      { inlineData: { mimeType: 'image/jpeg', data: buf.toString('base64') } },
    ] }], generationConfig: { maxOutputTokens: 8, temperature: 0 } };
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(18000) });
    if (!r.ok) return true;
    const j = await r.json();
    const t = String(j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text || '').trim().toUpperCase();
    return t.startsWith('KEEP');
  } catch (e) { return true; }
}
async function isGoodPoolScene(buf, pillar, query) {
  if (isClichePoolQuery(query)) return false;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return true;
  try {
    const topic = PILLAR_SUBJECT[pillar] || pillar;
    const body = { contents: [{ parts: [
      { text: 'Reply only KEEP or REJECT. KEEP if this is a distinct on-topic photograph for "' + topic + '" (equipment, dashboard, workspace, product, place, activity). REJECT if generic business handshake, people shaking hands, generic executive headshot, stock meeting cliché, chart/diagram, or clearly wrong topic.' },
      { inlineData: { mimeType: 'image/jpeg', data: buf.toString('base64') } },
    ] }], generationConfig: { maxOutputTokens: 8, temperature: 0 } };
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(18000) });
    if (!r.ok) return true;
    const j = await r.json();
    const t = String(j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text || '').trim().toUpperCase();
    return t.startsWith('KEEP');
  } catch (e) { return true; }
}
function scorePoolCandidate(pillar, c, qual, ph) {
  let score = 42;
  const reasons = [];
  if (!qual) return { score: -100, reasons: ['unqualified'] };
  if (isClichePoolQuery(c.query)) { score -= 90; reasons.push('cliche prompt'); }
  const scenes = pillarPoolSceneList(pillar);
  const qLower = String(c.query || '').toLowerCase();
  if (scenes.some(s => qLower.includes(String(s).slice(0, 14).toLowerCase()))) { score += 18; reasons.push('pillar scene'); }
  if (qual.sd >= 28) score += 12;
  else if (qual.sd < 22) { score -= 18; reasons.push('flat'); }
  if (qual.meanB >= 85 && qual.meanB <= 195) score += 8;
  if ((qual.w || 0) >= 700 && (qual.h || 0) >= 700) score += 6;
  for (const prev of poolPhExcludeSet(pillar)) {
    const d = hamming(prev, ph);
    if (d <= 4) { score -= 55; reasons.push('pool dupe'); break; }
    if (d <= REG_HAMMING) { score -= 22; reasons.push('pool near-dupe'); break; }
  }
  return { score, reasons };
}
async function autoCuratePoolBatch(pillar, batch, opts) {
  opts = opts || {};
  const candidates = batch.candidates || [];
  const poolPh = poolPhExcludeSet(pillar);
  const enriched = [];
  for (const c of candidates) {
    const staging = WD + c.previewUrl;
    let buf;
    try { buf = fs.readFileSync(staging); } catch (e) {
      enriched.push(Object.assign({}, c, { score: -100, autoReason: 'missing', approved: false, geminiOk: false }));
      continue;
    }
    const ph = c.ph || await pHash(buf);
    const qual = await qualifyPhoto(buf, c.previewUrl);
    const { score, reasons } = scorePoolCandidate(pillar, c, qual, ph);
    let geminiOk = true;
    if (score > 5 && process.env.GEMINI_API_KEY) geminiOk = await isGoodPoolScene(buf, pillar, c.query);
    let finalScore = score;
    if (!geminiOk) { finalScore -= 65; reasons.push('ai reject'); }
    enriched.push(Object.assign({}, c, { ph, score: finalScore, reasons, geminiOk, approved: null }));
    if (opts.onLog && enriched.length % 10 === 0) opts.onLog('🤖 scored ' + enriched.length + '/' + candidates.length);
  }
  enriched.sort((a, b) => b.score - a.score);
  const keptPh = [];
  const approvals = {};
  const stats = { kept: 0, rejected: 0, dupe: 0, cliche: 0, low: 0 };
  for (const c of enriched) {
    let keep = c.score >= POOL_CURATE_MIN_SCORE && c.geminiOk !== false;
    if (keep) {
      for (const ph of keptPh) {
        if (hamming(ph, c.ph) <= POOL_CURATE_BATCH_HAMMING) { keep = false; c.autoReason = 'batch dupe'; stats.dupe++; break; }
      }
    }
    if (!keep && !c.autoReason) {
      if (!c.geminiOk || (c.reasons || []).includes('ai reject')) { c.autoReason = 'cliche/handshake'; stats.cliche++; }
      else if (c.score < POOL_CURATE_MIN_SCORE) { c.autoReason = 'low score'; stats.low++; }
      else { c.autoReason = 'reject'; stats.low++; }
    }
    if (keep) {
      keptPh.push(c.ph);
      approvals[c.id] = true;
      c.approved = true;
      stats.kept++;
    } else {
      approvals[c.id] = false;
      c.approved = false;
      stats.rejected++;
    }
  }
  batch.candidates = enriched;
  return { approvals, stats, candidates: enriched };
}
/** Move owner-approved staging files into pool-{pillar}-NNN slots + registry. */
async function commitPillarPoolBatch(pillar, batch, approvals) {
  approvals = approvals || {};
  let committed = 0, rejected = 0;
  for (const c of (batch.candidates || [])) {
    const staging = WD + c.previewUrl;
    const approved = approvals[c.id] === true;
    if (approved) {
      const slot = nextPoolSlot(pillar);
      const dest = poolImagePath(pillar, slot);
      const rel = poolImageRel(pillar, slot);
      try {
        fs.copyFileSync(staging, dest);
        const buf = fs.readFileSync(dest);
        const ph = await pHash(buf);
        const qual = await qualifyPhoto(buf, rel) || { w: c.w || 760, h: c.h || 760 };
        const fakeId = '_pool-' + pillar + '-' + String(slot).padStart(3, '0');
        regAdd(ph, rel, qual.w, qual.h, pillar, fakeId, { pool: true, poolQuery: c.query, poolSlot: slot });
        committed++;
      } catch (e) { rejected++; }
    } else rejected++;
    try { fs.unlinkSync(staging); } catch (e) {}
  }
  flushReg();
  return { committed, rejected, poolCount: countPillarPoolSlots(pillar) };
}
function discardPillarPoolBatch(batch) {
  if (!batch || !batch.batchId) return;
  discardStagingBatch(batch.batchId, (batch.candidates || []).length || 100);
}
function poolPhExcludeSet(pillar) {
  const out = [];
  for (const e of loadReg().entries) {
    if (e.pillar !== pillar) continue;
    if (e.pool || isPoolImageUrl(e.url)) { if (e.ph) out.push(e.ph); }
  }
  return out;
}
function poolRegistryEntry(url) {
  if (!url) return null;
  return loadReg().entries.find(e => e && e.url === url) || null;
}
/** How many other Q&amp;As already use this pool file (same pillar reuse tracking). */
function poolCrossPageUseCount(url, exceptId) {
  const e = poolRegistryEntry(url);
  if (!e || !e.pages || !e.pages.length) return 0;
  if (!exceptId) return e.pages.length;
  return e.pages.filter(p => p !== exceptId).length;
}
function poolReuseUnlocked(pillar, opts) {
  opts = opts || {};
  if (opts.allowTopicalReuse) return true; // owner: Q&A may recall topical pool/registry matches
  if (opts.jobFillPct != null && opts.jobFillPct >= FILL_REUSE_PCT) return true;
  if (opts.allowFilledReuse) return true;
  return countPillarPoolSlots(pillar) >= POOL_REUSE_AFTER;
}
/** URLs already on this pillar (registry) — seeds Image Fill before cross-reuse unlocks. */
function harvestPillarFilledUrls(pillar) {
  if (!pillar) return [];
  const urls = [], seen = {};
  for (const e of loadReg().entries) {
    if (!e || !e.url) continue;
    const ep = entryPillarOf(e);
    if (ep !== pillar) continue;
    if (isFaceCardCoverUrl(e.url)) continue;
    if (!/^\/assets\/qa\//i.test(e.url)) continue;
    if (seen[e.url]) continue;
    try { if (fs.statSync(WD + e.url).size < 8000) continue; } catch (x) { continue; }
    seen[e.url] = 1;
    urls.push(e.url);
  }
  return urls;
}
function pickFromFilledReuseUrls(id, sectionText, title, exclude, filledReuseUrls, pickSalt) {
  if (!filledReuseUrls || !filledReuseUrls.length) return null;
  const avail = filledReuseUrls.filter(u => u && !exclude.has(u));
  if (!avail.length) return null;
  const seed = hashId(String(id) + '|reuse|' + String(sectionText || '').slice(0, 80) + '|' + String(title || '').slice(0, 60));
  return avail[(seed + (pickSalt || 0)) % avail.length];
}
function isSectionImageUrl(url) {
  const u = String(url || '').replace(/\?.*$/, '');
  return /^\/assets\/qa\/[a-z0-9]+-\d+\.jpg$/i.test(u);
}
function topicMatchScore(pillar, sectionText, title, entry, opts) {
  opts = opts || {};
  const ep = entryPillarOf(entry);
  if (opts.pillarOnly !== false && ep && ep !== pillar) return 0;
  let score = 0;
  if (ep === pillar) score += 4;
  const subject = (PILLAR_SUBJECT[pillar] || '').toLowerCase();
  const needText = sectionText + ' ' + title;
  const sectTokens = topicTokens(needText);
  const subjTokens = topicTokens(subject);
  let overlap = 0;
  for (const w of sectTokens) {
    if (subjTokens.includes(w)) overlap++;
  }
  score += overlap * 3;
  const titleLookup = opts.titleLookup || {};
  const sid = srcIdFromUrl(entry.url);
  if (sid && sid !== pillar && titleLookup[sid]) {
    const srcOv = countTokenOverlap(needText, titleLookup[sid]);
    overlap += srcOv;
    score += srcOv * 5;
  }
  if (entry.poolQuery) {
    const pov = countTokenOverlap(needText, entry.poolQuery);
    overlap += pov;
    score += pov * 2;
  }
  if (opts.topicKey && topicKeyMatchesPoolQuery(title, entry.poolQuery || opts.topicKey)) {
    score += 28;
  } else if (opts.topicKey && entry.poolQuery && String(entry.poolQuery).toLowerCase() === String(opts.topicKey).toLowerCase()) {
    score += 28;
  }
  const sm = String(entry.url || '').match(/\/assets\/qa\/([a-z]+)\d/i);
  if (sm && sm[1] === pillar) score += 2;
  if (isSectionImageUrl(entry.url)) score += 4;
  else if (isFaceCardCoverUrl(entry.url)) score -= 20;
  const isPool = !!(entry.pool || isPoolImageUrl(entry.url));
  if (isPool) {
    if (ep === pillar) score += 22;
    else score -= 6;
  }
  const uses = (entry.pages || []).length;
  score -= Math.min(uses, 24) * 0.85;
  if (uses >= 2 && opts.forSectionFill && !isPool) score -= 6;
  if (uses > 12 && !isPool) score -= 8;
  if (opts.forSectionFill && !isPool) {
    if (overlap < 1 && score < 13) return 0;
  }
  return score;
}
function isFillableImageUrl(url) {
  const u = String(url || '').trim();
  if (!u) return true;
  if (/kory-white\.jpg/i.test(u)) return false;
  if (/^\/assets\/cro-cover-/i.test(u)) return true;
  if (/placeholder\.svg|\/img\/auto\/|pollinations\.ai|\.svg(\?|$)/i.test(u)) return true;
  if (/^https?:\/\//i.test(u)) return true;
  if (/^\/assets\/qa\//.test(u)) {
    try { return fs.statSync(WD + u).size < 8000; } catch (e) { return true; }
  }
  if (/^\/assets\//.test(u)) return false;
  return true;
}
function isUpgradableImageUrl(url, id, pillar, opts) {
  opts = opts || {};
  if (isDdgOrLegacyImageUrl(url, id, opts)) return true;
  if (pollinatorImageLooksGoodSync(url, id, opts)) return false;
  if (isFillableImageUrl(url)) return true;
  if (!opts || !opts.upgradeMode) return false;
  const u = String(url || '').replace(/\?.*$/, '').trim();
  if (u === '/assets/qa/' + id + '.jpg' && isFaceCardCoverUrl(u) && !pollinatorImageLooksGoodSync(u, id, opts)) return true;
  return false;
}
function isBrokenQaImageUrl(url, id, opts) {
  if (isFillableImageUrl(url)) return true;
  opts = opts || {};
  if (pollinatorImageLooksGoodSync(url, id, opts)) return false;
  if (isDdgOrLegacyImageUrl(url, id, opts)) return true;
  return false;
}
function isHeroPoolEntry(entry, pillar) {
  if (!entry || !(entry.pool || isPoolImageUrl(entry.url))) return false;
  return entryPillarOf(entry) === pillar && isPoolImageUrl(entry.url);
}
function isPortraitPoolEntry(entry, pillar) {
  return isHeroPoolEntry(entry, pillar || entry.pillar || '');
}
function heroFaceCardSlot(url, id, lineIdx) {
  if (lineIdx >= 40) return false;
  const u = String(url || '').replace(/\?.*$/, '').trim();
  if (/^\/assets\/cro-cover-/i.test(u)) return true;
  if (u === '/assets/qa/' + id + '.jpg') return true;
  if (/placeholder\.svg|\/img\/auto\/|pollinations\.ai|\.svg(\?|$)/i.test(u)) return true;
  if (/^https?:\/\//i.test(u)) return true;
  return false;
}
function heroFillQuery(pillar, title) {
  const subj = PILLAR_SUBJECT[pillar] || pillar;
  if (pillar === 'tl') return 'business executive portrait ' + title;
  return subj + ' ' + title;
}
async function ensureRegScanCache(pillar, opts) {
  opts = opts || {};
  const forSectionFill = opts.forSectionFill !== false;
  const pillarOnly = opts.pillarOnly !== false;
  const key = pillar + '|' + (forSectionFill ? 's' : 'a') + (pillarOnly ? 'p' : 'a');
  if (!opts._regScan || opts._regScan.key !== key) {
    opts._regScan = { key, rows: null, building: null };
  }
  const scan = opts._regScan;
  if (scan.rows) return scan.rows;
  if (!scan.building) {
    scan.building = (async () => {
      if (!opts.skipBackfill) await backfillRegistry();
      const r = loadReg();
      const rows = [];
      let n = 0;
      for (const e of r.entries) {
        if (!e.url) continue;
        if (/^\/assets\/cro-cover-/i.test(e.url)) continue;
        if (/kory-white\.jpg/i.test(e.url)) continue;
        if (forSectionFill && isFaceCardCoverUrl(e.url)) continue;
        const ep = entryPillarOf(e);
        if (pillarOnly && ep && ep !== pillar) continue;
        const isPool = !!(e.pool || isPoolImageUrl(e.url));
        if (isPool && ep && ep !== pillar) continue;
        if (forSectionFill && !isPool && (e.pages || []).length >= 4) continue;
        let bytes = e.bytes;
        if (bytes == null) {
          try { bytes = fs.statSync(WD + e.url).size; e.bytes = bytes; } catch (x) { continue; }
        }
        if (bytes < 8000) continue;
        rows.push({ e, isPool, ep });
        n++;
        if (n % 256 === 0) await new Promise(res => setImmediate(res));
      }
      scan.rows = rows;
      scan.building = null;
      return rows;
    })();
  }
  return scan.building;
}
async function pickMatchingLibraryImage(id, pillar, sectionText, title, excludeUrls, opts) {
  opts = opts || {};
  const minScore = opts.minScore != null ? opts.minScore : 8;
  const poolMin = opts.poolMinScore != null ? opts.poolMinScore : Math.max(8, minScore - 2);
  const forSectionFill = opts.forSectionFill !== false;
  const pillarOnly = opts.pillarOnly !== false;
  const exclude = new Set(excludeUrls || []);
  exclude.add('/assets/kory-white.jpg');
  exclude.add('/assets/qa/' + id + '.jpg');
  const excludePh = (opts.excludePh || []).slice();
  const titleLookup = opts.titleLookup || {};
  const poolCandidates = [];
  const libCandidates = [];
  const scanRows = await ensureRegScanCache(pillar, opts);
  for (const row of scanRows) {
    const e = row.e;
    if (exclude.has(e.url)) continue;
    if (e.ph && isPhExcluded(e.ph, excludePh)) continue;
    if (opts.portraitPrefer && row.isPool && !isHeroPoolEntry(e, pillar)) continue;
    const scoreOpts = { forSectionFill, titleLookup, pillarOnly };
    const score = topicMatchScore(pillar, sectionText, title, e, scoreOpts);
    const pick = { url: e.url, ph: e.ph, w: e.w, h: e.h, score, pool: row.isPool };
    if (row.isPool) {
      if (score >= poolMin) poolCandidates.push(pick);
    } else if (score >= minScore && !isDdgOrLegacyImageUrl(e.url, id, opts)) {
      libCandidates.push(pick);
    }
  }
  const poolCount = countPillarPoolSlots(pillar);
  const reuseUnlocked = poolReuseUnlocked(pillar, opts);
  if (opts.poolOnly && !poolCandidates.length && scanRows.length) {
    for (const row of scanRows) {
      const e = row.e;
      if (exclude.has(e.url)) continue;
      if (e.ph && isPhExcluded(e.ph, excludePh)) continue;
      if (row.isPool) continue;
      if (row.ep !== pillar) continue;
      if (!isSectionImageUrl(e.url) && !/^\/assets\/qa\/pool-/i.test(e.url)) continue;
      if (isFaceCardCoverUrl(e.url)) continue;
      poolCandidates.push({ url: e.url, ph: e.ph, w: e.w, h: e.h, score: poolMin + 6, pool: false, bootstrap: true });
    }
  }
  if (opts.allowFilledReuse && opts.filledReuseUrls && opts.filledReuseUrls.length) {
    for (const url of opts.filledReuseUrls) {
      if (!url || exclude.has(url)) continue;
      const reg = opts.regUrlMap && opts.regUrlMap.get ? opts.regUrlMap.get(url) : null;
      poolCandidates.push({
        url,
        ph: reg && reg.ph,
        w: reg && reg.w,
        h: reg && reg.h,
        score: 120 + (reuseUnlocked ? 20 : 0),
        pool: isPoolImageUrl(url),
        filledReuse: true,
      });
    }
  }
  if (poolCandidates.length) {
    for (const pick of poolCandidates) {
      const crossUses = poolCrossPageUseCount(pick.url, id);
      if (!reuseUnlocked) {
        if (crossUses > 0) pick.score -= 500;
        else pick.score += 14;
      } else {
        const over = Math.max(0, poolCount - POOL_REUSE_AFTER);
        pick.score += Math.min(32, crossUses * 4 + Math.floor(over / 8));
      }
    }
    if (!reuseUnlocked) {
      const fresh = poolCandidates.filter(p => poolCrossPageUseCount(p.url, id) === 0);
      if (fresh.length) poolCandidates = fresh;
    }
  }
  let candidates = poolCandidates.length ? poolCandidates : libCandidates;
  if (opts.poolOnly) {
    if (!poolCandidates.length) return null;
    candidates = poolCandidates;
  }
  if (!candidates.length) {
    if (opts.allowFilledReuse) {
      const reused = pickFromFilledReuseUrls(id, sectionText, title, exclude, opts.filledReuseUrls, opts.pickSalt);
      if (reused) {
        const ph = await hashLocalImage(reused);
        regAdd(ph, reused, 1024, 768, pillar, id);
        return reused;
      }
    }
    return null;
  }
  // mv C14: title-keyed library only — never fill a movie slot with a different movie (owner 2026-07-07).
  if (opts.requireMovieTitle && opts.movieSlot) {
    try {
      const { verifyMovieSlotImage } = require('./_mv_image_title_match');
      const vetted = [];
      for (const c of candidates) {
        const ent = (opts.regUrlMap && opts.regUrlMap.get) ? opts.regUrlMap.get(c.url) : null;
        const r = await verifyMovieSlotImage(c.url, opts.movieSlot, { slotTitle: ent && ent.slotTitle, poolQuery: ent && (ent.poolQuery || '') });
        if (r.ok) vetted.push(c);
      }
      if (!vetted.length) return null;
      candidates = vetted;
    } catch (e) { return null; }
  }
  candidates.sort((a, b) => b.score - a.score || (b.filledReuse ? 1 : 0) - (a.filledReuse ? 1 : 0) || (b.pool ? 1 : 0) - (a.pool ? 1 : 0));
  const top = candidates.slice(0, Math.min(14, candidates.length));
  const seed = hashId(String(id) + '|' + String(sectionText || '').slice(0, 80) + '|' + String(title || '').slice(0, 60));
  const pick = top[(seed + (opts.pickSalt || 0)) % top.length];
  if (pick) {
    regAdd(pick.ph, pick.url, pick.w, pick.h, pillar, id);
    return pick.url;
  }
  return null;
}
async function pickReusableLibraryImage(id, pillar, sectionText, excludeUrls) {
  return pickMatchingLibraryImage(id, pillar, sectionText, '', excludeUrls, { minScore: 3 });
}
async function pagePhFromUrls(urls) {
  const out = [];
  for (const url of urls || []) {
    const ph = await hashLocalImage(url);
    if (ph) out.push(ph);
  }
  return out;
}
function bodyPageImageUrls(body) {
  const urls = new Set();
  if (!body) return urls;
  const s = String(body);
  let m;
  const pr = /@@PRODUCT[^\n]* img="([^"]+)"/g;
  while ((m = pr.exec(s))) urls.add(m[1]);
  const md = /!\[[^\]]*\]\(([^)\s]+)/g;
  while ((m = md.exec(s))) urls.add(m[1]);
  return urls;
}
function sectionHeadingAt(lines, i) {
  for (let j = i - 1; j >= 0; j--) {
    if (/^#{2,3}\s/.test(lines[j]) && !/^#{2,3}\s+(FAQ|Sources|References|Related on PULSE)/i.test(lines[j])) {
      return lines[j].replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').trim();
    }
  }
  return '';
}
function buildRegUrlMap() {
  const m = new Map();
  for (const e of loadReg().entries) if (e && e.url) m.set(e.url, e);
  return m;
}
/** Fill empty/broken/placeholder image slots — pool-{pillar}-NNN first, then library; never same-page dupes.
 *  upgradeMode: also swap generic/broken face-card heroes with pool or topical library picks.
 *  pollinatorPrefer + poolOnly (Image Fill): upgrade DDG/legacy QA images → pool only, never DDG library picks. */
async function fillEntryMissingImages(id, question, body, opts) {
  opts = opts || {};
  if (!body) return { body, fixed: 0, skipped: 0, slots: 0 };
  await backfillRegistry();
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const qClean = String(question || '').replace(/[\[\]"?]/g, '').trim();
  const topicKey = opts.topicKey || entryTopicKey(question || qClean);
  const minScore = opts.minScore != null ? opts.minScore : 9;
  const upgradeMode = !!opts.upgradeMode;
  const alternateSources = upgradeMode && opts.alternateSources !== false;
  const isTop10Body = /@@PRODUCT[^\n]* img=/i.test(body);
  const fillCtx = Object.assign({}, opts, { regUrlMap: opts.regUrlMap || buildRegUrlMap() });
  const needsFill = (url) => isUpgradableImageUrl(url, id, pillar, upgradeMode ? fillCtx : null);
  let lines = String(body).split('\n');
  let fixed = 0, skipped = 0, slots = 0;
  const exclude = bodyPageImageUrls(body);
  exclude.add('/assets/qa/' + id + '.jpg');
  const excludePh = await pagePhFromUrls([...exclude]);
  const titleLookup = opts.titleLookup || {};
  let hasHeroEarly = false;
  const pickCtx = {
    minScore,
    titleLookup,
    forSectionFill: true,
    pillarOnly: true,
    skipBackfill: false,
    _regScan: null,
    poolOnly: !!opts.poolOnly,
    pollinatorPrefer: !!opts.pollinatorPrefer,
    jobFillPct: opts.jobFillPct,
    filledReuseUrls: (opts.filledReuseUrls || []).slice(),
    allowFilledReuse: !!opts.allowFilledReuse,
    allowTopicalReuse: opts.allowTopicalReuse != null ? !!opts.allowTopicalReuse : !isTop10Body,
    topicKey,
  };
  if (opts.pollinatorPrefer) pickCtx.poolMinScore = 6;
  let entrySlots = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/!\[([^\]]*)\]\(([^)\s]*)\)/);
    if (m && needsFill(m[2])) entrySlots++;
    const pm = lines[i].match(/@@PRODUCT\s+name="([^"]*)"\s+img="([^"]*)"\s+site="([^"]*)"/);
    if (pm && needsFill(pm[2])) entrySlots++;
  }
  for (let i = 0; i < lines.length; i++) {
    if (!/^##\s+\S/.test(lines[i]) || /^##\s+(FAQ|Sources|References|Related on PULSE)/i.test(lines[i])) continue;
    let hasGood = false;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^#{2,3}\s/.test(lines[j])) break;
      const im = lines[j].match(/!\[([^\]]*)\]\(([^)\s]*)\)/);
      if (im && !needsFill(im[2])) { hasGood = true; break; }
    }
    if (!hasGood) entrySlots++;
  }
  const entryFilledUrls = [];
  for (let li = 0; li < Math.min(lines.length, 40); li++) {
    const hm = lines[li].match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (hm && !needsFill(hm[2])) { hasHeroEarly = true; break; }
  }

  async function tryFill(sectionText, pickSalt, portrait) {
    if (opts.onProgress) opts.onProgress({ done: fixed, label: String(sectionText || 'section').slice(0, 42), phase: 'pick' });
    const imageQ = portrait
      ? sectionImageSearchQuery(qClean, qClean)
      : sectionImageSearchQuery(qClean, sectionText);
    pickCtx.skipBackfill = true;
    pickCtx.poolMinScore = portrait ? 6 : 8;
    pickCtx.pickSalt = pickSalt || 0;
    pickCtx.excludePh = excludePh;
    pickCtx.portraitPrefer = !!portrait;
    pickCtx.topicKey = topicKey;
    const entryReuseAt = entrySlots > 0 ? Math.ceil(entrySlots * FILL_REUSE_PCT) : 1;
    pickCtx.allowFilledReuse = !!opts.allowFilledReuse || fixed >= entryReuseAt;
    pickCtx.filledReuseUrls = entryFilledUrls.concat(opts.filledReuseUrls || []);
    let pick = await pickMatchingLibraryImage(id, pillar, imageQ, qClean, [...exclude], pickCtx);
    if (!pick && alternateSources) {
      pick = await ensureAlternateSectionImage(id, fixed + 1, imageQ, Object.assign({}, opts, { topicKey, alternateSources: true, qaUpgradeAlternate: true }));
    }
    if (!pick) { skipped++; return null; }
    exclude.add(pick);
    entryFilledUrls.push(pick);
    const ph = await hashLocalImage(pick);
    if (ph) excludePh.push(ph);
    fixed++;
    if (opts.onProgress) opts.onProgress({ done: fixed, label: String(sectionText || 'section').slice(0, 42) });
    return pick;
  }

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/!\[([^\]]*)\]\(([^)\s]*)\)/);
    if (!m) continue;
    if (!needsFill(m[2])) continue;
    slots++;
    const sect = sectionHeadingAt(lines, i) || qClean;
    const portrait = heroFaceCardSlot(m[2], id, i);
    const pick = await tryFill(portrait ? heroFillQuery(pillar, qClean) : sect, i, portrait);
    if (!pick) continue;
    if (portrait && /^\/assets\//.test(pick)) {
      try {
        await gradeFaceCardFromBuffer(fs.readFileSync(WD + pick), coverPath(id), { question: qClean });
      } catch (e) { /* keep existing cover */ }
    }
    lines[i] = '![' + (m[1] || (qClean.slice(0, 66) + (sect ? (' — ' + sect.slice(0, 56)) : ''))) + '](' + pick + ')';
  }

  const isTop10 = isTop10Body;
  if (!isTop10) {
    let sectCount = 0;
    for (let i = 0; i < lines.length; i++) {
      if (!/^##\s+\S/.test(lines[i]) || /^##\s+(FAQ|Sources|References|Related on PULSE)/i.test(lines[i])) continue;
      if (sectCount >= 9) break;
      const sect = lines[i].replace(/^##\s+/, '').replace(/[\[\]"]/g, '').trim();
      if (hasHeroEarly && sectCount === 0 && /^direct answer/i.test(sect)) continue;
      let hasGood = false;
      for (let j = i + 1; j < lines.length; j++) {
        if (/^#{2,3}\s/.test(lines[j])) break;
        const im = lines[j].match(/!\[([^\]]*)\]\(([^)\s]*)\)/);
        if (im && !needsFill(im[2])) { hasGood = true; break; }
      }
      if (hasGood) continue;
      slots++;
      const pick = await tryFill(sect, 100 + i, false);
      if (!pick) continue;
      const cap = qClean.slice(0, 66) + ' — ' + sect.slice(0, 56);
      lines.splice(i + 1, 0, '', '![' + cap + '](' + pick + ')', '');
      sectCount++;
      i += 3;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/@@PRODUCT\s+name="([^"]*)"\s+img="([^"]*)"\s+site="([^"]*)"/);
    if (!m) continue;
    if (!needsFill(m[2])) continue;
    slots++;
    const name = m[1], site = m[3];
    const pick = await tryFill(name + ' ' + qClean, 200 + i, false);
    if (!pick) continue;
    lines[i] = '@@PRODUCT name="' + name.replace(/"/g, '') + '" img="' + pick + '" site="' + site.replace(/"/g, '') + '"';
  }

  return { body: lines.join('\n'), fixed, skipped, slots, throttleLearn: imageProviderAlt ? imageProviderAlt.providerStats() : null };
}
/** Self-host one section slot — alternate Pollinator flux ↔ DDG real photo (adaptive 20s+ gate). */
async function ensureAlternateSectionImage(id, ti, sectionText, opts) {
  opts = Object.assign({ qaUpgradeAlternate: true }, opts || {});
  const slot = ti || 1;
  const canDdg = allowDdgForCall(opts);
  const preferred = slotPrefersFlux(id, slot) ? 'flux' : 'ddg';
  if (!canDdg) return ensureFluxSectionImage(id, slot, sectionText, opts);
  const { nextAlternateProvider, runProviderJob } = require('./_image_provider_alternate');
  let provider = nextAlternateProvider(preferred);
  if (provider === 'ddg' && !canDdg) provider = 'flux';
  const innerOpts = Object.assign({}, opts, { skipAlternateWait: true });
  if (provider === 'flux') {
    return runProviderJob('flux', () => ensureFluxSectionImage(id, slot, sectionText, innerOpts), 'alt-sec-flux:' + id + '-' + slot, opts);
  }
  return runProviderJob('ddg', () => ensureDdgSectionImage(id, slot, sectionText, Object.assign({}, innerOpts, { forceDdg: true })), 'alt-sec-ddg:' + id + '-' + slot, opts);
}
/** Replace live pollinations/hotlink/broken QA images with self-hosted /assets/qa/ alternates. */
async function repairBrokenQaImages(id, title, body, opts) {
  opts = Object.assign({ alternateSources: true, upgradeMode: true, allowTopicalReuse: true, qaUpgradeAlternate: true }, opts || {});
  if (!body) return { body, fixed: 0, slots: 0 };
  await backfillRegistry();
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const qClean = String(title || '').replace(/[\[\]"?]/g, '').trim();
  const fillCtx = Object.assign({}, opts, { regUrlMap: opts.regUrlMap || buildRegUrlMap() });
  let lines = String(body).split('\n');
  let fixed = 0, slotNum = 0;
  const exclude = bodyPageImageUrls(body);
  exclude.add('/assets/qa/' + id + '.jpg');
  const excludePh = await pagePhFromUrls([...exclude]);
  const pickCtx = {
    minScore: 8,
    poolMinScore: 6,
    titleLookup: opts.titleLookup || {},
    forSectionFill: true,
    pillarOnly: true,
    skipBackfill: false,
    poolOnly: !!opts.poolOnly,
    pollinatorPrefer: !!opts.pollinatorPrefer,
    allowTopicalReuse: opts.allowTopicalReuse !== false,
    excludePh,
    regUrlMap: fillCtx.regUrlMap,
  };

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/!\[([^\]]*)\]\(([^)\s]*)\)/);
    if (!m) continue;
    const alt = m[1], url = m[2];
    if (!isBrokenQaImageUrl(url, id, fillCtx)) continue;
    slotNum++;
    const sect = sectionHeadingAt(lines, i) || qClean;
    const portrait = heroFaceCardSlot(url, id, i);
    if (opts.onProgress) opts.onProgress({ done: fixed, label: sect.slice(0, 42), phase: 'repair' });
    pickCtx.pickSalt = i + slotNum * 7;
    pickCtx.excludePh = excludePh;
    let pick = await pickMatchingLibraryImage(id, pillar, portrait ? heroFillQuery(pillar, qClean) : sect, qClean, [...exclude], pickCtx);
    if (!pick) pick = await ensureAlternateSectionImage(id, slotNum, sect, opts);
    if (!pick) continue;
    exclude.add(pick);
    const ph = await hashLocalImage(pick);
    if (ph) excludePh.push(ph);
    if (portrait && /^\/assets\//.test(pick)) {
      try {
        await gradeFaceCardFromBuffer(fs.readFileSync(WD + pick), coverPath(id), { question: qClean });
      } catch (e) { /* keep existing cover */ }
    }
    const cap = alt || (qClean.slice(0, 66) + (sect ? (' — ' + sect.slice(0, 56)) : ''));
    lines[i] = '![' + cap + '](' + pick + ')';
    fixed++;
    if (opts.onProgress) opts.onProgress({ done: fixed, label: sect.slice(0, 42), phase: 'repaired' });
  }
  return { body: lines.join('\n'), fixed, slots: slotNum, throttleLearn: imageProviderAlt ? imageProviderAlt.providerStats() : null };
}
// mv C14: an existing self-hosted file counts as reusable ONLY if it carries this movie's PULSE_MOVIE stamp.
function movieFileStampOk(out, movieName, sectionText) {
  try {
    const { parseMovieSlot, movieSlotStamp, bufferHasMovieStamp } = require('./_mv_image_title_match');
    const movie = parseMovieSlot(movieName || sectionText);
    const buf = fs.readFileSync(out);
    return bufferHasMovieStamp(buf, movie);
  } catch (e) { return false; }
}
function moviePosterGradeOptsFor(qual, movieName, sectionText) {
  try {
    const { parseMovieSlot, movieSlotStamp } = require('./_mv_image_title_match');
    const movie = parseMovieSlot(movieName || sectionText);
    return {
      posterTile: true, width: 800, height: 1200,
      bright: !!(qual && qual.meanB > 175),
      movieSlotStamp: GRADE_STAMP + '|' + movieSlotStamp(movie),
      _slotTitle: movie.raw,
    };
  } catch (e) { return sectionImageGradeOpts(qual); }
}
// mv PRIMARY SOURCE (owner 2026-07-07): a local, title-keyed poster library (Wikipedia-sourced, keyless).
// Checked BEFORE any live provider — deterministic, correct-by-construction (the file IS this movie's poster),
// instant (no network → cannot hang/timeout). Live DDG/flux fetch only runs for titles absent from the library.
// storeGradedImage upscales the raw poster to an 800x1200 poster tile and applies the PULSE_MOVIE=<slugYear> stamp,
// so the result passes C14 (title match), C22 (resolves), aspect + dimension checks like any graded asset.
const POSTER_LIB = WD + '/assets/qa/_poster-lib';
async function tryPosterLibrary(id, ti, movieName, sectionText, out) {
  if (!sharp) return null;
  try {
    const { parseMovieSlot } = require('./_mv_image_title_match');
    const movie = parseMovieSlot(movieName || sectionText);
    if (!movie.slug) return null;
    const keys = [];
    if (movie.slugYear) keys.push(movie.slugYear);
    keys.push(movie.slug);
    let src = null;
    for (const key of keys) {
      const f = POSTER_LIB + '/' + key + '.jpg';
      try { if (fs.statSync(f).size > 4000) { src = f; break; } } catch (e) {}
    }
    if (!src) return null;
    const rel = '/assets/qa/' + id + '-' + ti + '.jpg';
    const gradeOpts = moviePosterGradeOptsFor(null, movieName, sectionText);
    const stored = await storeGradedImage(fs.readFileSync(src), out, gradeOpts);
    if (!stored) return null;
    try {
      const ph = await pHash(fs.readFileSync(out));
      regAdd(ph, rel, 800, 1200, 'mv', id, gradeOpts._slotTitle ? { slotTitle: gradeOpts._slotTitle } : {});
    } catch (e) {}
    return rel;
  } catch (e) { return null; }
}
// 🔒 SELF-HOST a SECTION image — Pollinator flux when DDG banned (default).
async function ensureFluxSectionImage(id, ti, sectionText, opts) {
  opts = opts || {};
  if (!sharp) return null;
  const out = DIR + '/' + id + '-' + ti + '.jpg';
  const rel = '/assets/qa/' + id + '-' + ti + '.jpg';
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const moviePoster = !!opts.moviePoster || pillar === 'mv';
  // mv: poster library is authoritative — always re-grade from library before reusing stale slot files.
  if (moviePoster) {
    const lib = await tryPosterLibrary(id, ti, opts.movieSlot, sectionText, out);
    if (lib) return lib;
    if (process.env.MV_POSTER_LIBRARY_ONLY === '1') return null;
  }
  if (!opts.forceNew) {
    try {
      const buf = fs.readFileSync(out);
      if (buf.length > 8000 && hasGradeStampInBuf(buf) && (!moviePoster || movieFileStampOk(out, opts.movieSlot, sectionText))) return rel;
    } catch (e) {}
  }
  if (moviePoster && process.env.MV_POSTER_LIBRARY_ONLY === '1') return null;
  const { runFluxJob, fetchFluxPrompt } = require('./_pollinator_flux_throttle');
  const slot = ti || 1;
  const attempt = opts.attempt || 0;
  const q = buildFluxSectionQuery(id, sectionText, slot, attempt, opts.guideKeywords || '');
  const gradeOpts = moviePoster ? moviePosterGradeOptsFor(null, opts.movieSlot, sectionText) : sectionImageGradeOpts(null);
  const ok = await runFluxJob(async () => {
    const img = await fetchFluxPrompt(q, hashId(id + '|fluxsec|' + ti + '|' + attempt), { pool: true });
    if (!img) return false;
    return !!(await storeGradedImage(img, out, gradeOpts));
  }, 'flux-sec:' + id + '-' + ti, { noCooldown: !!(opts && opts.skipAlternateWait) });
  if (!ok) return null;
  try {
    if (fs.statSync(out).size > 8000) {
      const ph = await pHash(fs.readFileSync(out));
      regAdd(ph, rel, gradeOpts.posterTile ? 800 : 1024, gradeOpts.posterTile ? 1200 : 768, pillar, id, gradeOpts._slotTitle ? { slotTitle: gradeOpts._slotTitle } : {});
      return rel;
    }
  } catch (e) {}
  return null;
}
async function ensureDdgSectionImage(id, ti, sectionText, opts) {
  opts = opts || {};
  if ((POLLINATOR_IMAGES_ONLY || DDG_IMAGES_BANNED) && !allowDdgForCall(opts)) {
    return ensureFluxSectionImage(id, ti, sectionText, opts);
  }
  if (!sharp) return null;
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const out = DIR + '/' + id + '-' + ti + '.jpg';
  const rel = '/assets/qa/' + id + '-' + ti + '.jpg';
  const excludeUrls = opts.excludeUrls ? (opts.excludeUrls instanceof Set ? [...opts.excludeUrls] : opts.excludeUrls) : [];
  const moviePoster = !!opts.moviePoster || pillar === 'mv';
  // mv: poster library is authoritative — always re-grade from library before reusing stale slot files.
  if (moviePoster) {
    const lib = await tryPosterLibrary(id, ti, opts.movieSlot, sectionText, out);
    if (lib) return lib;
    if (process.env.MV_POSTER_LIBRARY_ONLY === '1') return null;
  }
  if (!opts.forceNew) {
    try { if (fs.statSync(out).size > 8000 && (!moviePoster || movieFileStampOk(out, opts.movieSlot, sectionText))) return rel; } catch (e) {}
    if (!opts.skipReuse && !moviePoster) {
      const reused = await pickReusableLibraryImage(id, pillar, sectionText, excludeUrls);
      if (reused) return reused;
    }
  }
  if (moviePoster && process.env.MV_POSTER_LIBRARY_ONLY === '1') return null;
  const excludePh = await pagePhFromUrls(excludeUrls);
  const pick = await ddgCleanPhoto(sectionText, id, Object.assign({ sectionText, excludePh, movieSlot: opts.movieSlot }, opts));
  if (!pick) return null;
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  let gradeOpts = sectionImageGradeOpts(pick.qual);
  let regExtra = {};
  if (opts.moviePoster || pillar === 'mv') {
    try {
      const { movieSlotStamp, parseMovieSlot } = require('./_mv_image_title_match');
      const movie = parseMovieSlot(opts.movieSlot || sectionText);
      gradeOpts = moviePosterGradeOpts(pick.qual);
      regExtra = { slotTitle: movie.raw };
      gradeOpts.movieSlotStamp = GRADE_STAMP + '|' + movieSlotStamp(movie);
    } catch (e) {}
  }
  await storeGradedImage(pick.buf, out, gradeOpts);
  try {
    if (fs.statSync(out).size > 8000) {
      const ph = await pHash(pick.buf);
      regAdd(ph, rel, gradeOpts.posterTile ? 800 : SECTION_TILE_W, gradeOpts.posterTile ? 1200 : SECTION_TILE_H, pillar, id, regExtra);
      return rel;
    }
  } catch (e) {}
  return null;
}
// 🔄 Within-page duplicate sweep — same URL or near-identical pHash on ONE page → swap for a different image.
async function hashLocalImage(url) {
  if (!url || !/^\/assets\/qa\//.test(url)) return null;
  try {
    const buf = fs.readFileSync(WD + url);
    if (!buf || buf.length < 5000) return null;
    return pHash(buf);
  } catch (e) { return null; }
}
async function countBodyImageDupes(id, body) {
  const out = { within: 0, cross: 0, total: 0, urls: [] };
  if (!body) return out;
  await backfillRegistry();
  const KORY = '/assets/kory-white.jpg';
  const seenUrl = new Set();
  const pagePh = [];
  function bump(url) {
    if (!url || url === KORY || /kory-white\.jpg/i.test(url)) return;
    if (/^\/assets\/cro-cover-/i.test(url)) return;
    if (out.urls.includes(url)) return;
    out.urls.push(url);
    out.within++;
    out.total++;
  }
  async function inspect(url) {
    if (!url || url === KORY || /kory-white\.jpg/i.test(url) || /^\/assets\/cro-cover-/i.test(url)) return;
    if (seenUrl.has(url)) { bump(url); return; }
    if (/^\/assets\/qa\//.test(url)) {
      const ph = await hashLocalImage(url);
      if (ph) {
        for (const prev of pagePh) {
          if (hamming(prev.ph, ph) <= REG_HAMMING) { bump(url); seenUrl.add(url); return; }
        }
        pagePh.push({ ph, url });
      }
    }
    seenUrl.add(url);
  }
  const lines = String(body).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (m) { await inspect(m[2]); continue; }
    const pm = lines[i].match(/@@PRODUCT[^\n]* img="([^"]+)"/);
    if (pm) await inspect(pm[1]);
  }
  return out;
}
async function sweepTop10DuplicateImages(id, question, body, opts) {
  opts = opts || {};
  if (!sharp || !body || !/@@PRODUCT[^\n]* img=/i.test(body)) return { body, fixed: 0 };
  const lines = String(body).split('\n');
  const seenUrl = new Set();
  const pagePh = [];
  let fixed = 0;
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const qClean = String(question || '').replace(/[\[\]"?]/g, '').trim();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/@@PRODUCT\s+name="([^"]*)"\s+img="([^"]+)"\s+site="([^"]*)"/);
    if (!m) continue;
    const name = m[1], url = m[2], site = m[3];
    if (!url || /pulse-logo\.svg/i.test(url)) continue;
    let isDupe = seenUrl.has(url);
    let ph = null;
    if (!isDupe && /^\/assets\/qa\//.test(url)) {
      ph = await hashLocalImage(url);
      if (ph) {
        for (const prev of pagePh) {
          if (hamming(prev.ph, ph) <= REG_HAMMING) { isDupe = true; break; }
        }
        if (!isDupe) pagePh.push({ ph, url });
      }
    } else if (!isDupe && /^https?:\/\//i.test(url)) {
      isDupe = seenUrl.has(url);
    }
    if (!isDupe) { seenUrl.add(url); continue; }
    const secText = (name || qClean) + ' product photo alternate ' + (fixed + 1);
    const ti = 990 + fixed;
    let local = null;
    if (opts.libraryOnly) {
      local = await pickMatchingLibraryImage(id, pillar, secText, qClean, [...seenUrl], {
        minScore: 8,
        poolMinScore: opts.poolOnly ? 6 : 8,
        pickSalt: fixed + i,
        forSectionFill: true,
        pillarOnly: true,
        poolOnly: !!opts.poolOnly,
        skipBackfill: true,
        _regScan: opts._regScan,
      });
    } else {
      local = await ensureDdgSectionImage(id, ti, secText, {
        forceNew: true,
        skipReuse: true,
        attemptStart: 6 + fixed * 3,
        dupeSalt: 'top10dupe' + fixed,
        sectionText: secText,
        excludeUrls: [...seenUrl],
      });
    }
    if (!local) continue;
    let newPh = await hashLocalImage(local);
    if (newPh) {
      for (const prev of pagePh) {
        if (hamming(prev.ph, newPh) <= REG_HAMMING) { newPh = null; break; }
      }
      if (!newPh) continue;
      pagePh.push({ ph: newPh, url: local });
      regAdd(newPh, local, 760, 760, pillar, id);
    }
    lines[i] = '@@PRODUCT name="' + name.replace(/"/g, '') + '" img="' + local + '" site="' + site.replace(/"/g, '') + '"';
    seenUrl.add(local);
    fixed++;
    if (opts.onProgress) opts.onProgress({ done: fixed, label: 'top10 dupe → ' + (name || 'product').slice(0, 36) });
  }
  return { body: lines.join('\n'), fixed };
}
async function sweepPageDuplicateImages(id, question, body, opts) {
  opts = opts || {};
  if (!sharp || !body) return { body, fixed: 0 };
  const KORY = '/assets/kory-white.jpg';
  const lines = String(body).split('\n');
  const seenUrl = new Set();
  const pagePh = [];
  let fixed = 0;
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  const qClean = String(question || '').replace(/[\[\]"?]/g, '').trim();

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (!m) continue;
    const alt = m[1], url = m[2];
    if (!url || url === KORY || /kory-white\.jpg/i.test(url)) continue;
    if (/^\/assets\/cro-cover-/i.test(url)) continue;

    let isDupe = seenUrl.has(url);
    if (!isDupe && /^\/assets\/qa\//.test(url)) {
      try {
        const buf = fs.readFileSync(WD + url);
        const ph = await pHash(buf);
        if (ph) {
          for (const prev of pagePh) {
            if (hamming(prev.ph, ph) <= REG_HAMMING) { isDupe = true; break; }
          }
          if (!isDupe) pagePh.push({ ph, url });
        }
      } catch (e) {}
    } else if (!isDupe && /^https?:\/\//i.test(url)) {
      isDupe = seenUrl.has(url);
    }
    if (!isDupe) { seenUrl.add(url); continue; }

    let sect = '';
    for (let j = i - 1; j >= 0; j--) {
      if (/^#{2,3}\s/.test(lines[j]) && !/^#{2,3}\s+(FAQ|Sources|References|Related on PULSE)/i.test(lines[j])) {
        sect = lines[j].replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').trim();
        break;
      }
    }
    const secText = (sect || qClean) + ' ' + qClean + ' alternate view variant ' + (fixed + 1);
    const ti = 880 + fixed;
    let local = null;
    if (opts.libraryOnly) {
      local = await pickMatchingLibraryImage(id, pillar, secText, qClean, [...seenUrl], {
        minScore: 8,
        poolMinScore: opts.poolOnly ? 6 : 8,
        pickSalt: fixed + i,
        forSectionFill: true,
        pillarOnly: true,
        poolOnly: !!opts.poolOnly,
        skipBackfill: true,
        _regScan: opts._regScan,
      });
    } else if (POLLINATOR_IMAGES_ONLY) {
      try {
        const { runFluxJob, fetchFluxPrompt } = require('./_pollinator_flux_throttle');
        const dest = DIR + '/' + id + '-' + ti + '.jpg';
        const rel = '/assets/qa/' + id + '-' + ti + '.jpg';
        const q = buildPoolQuery(pillar, ti, fixed) || secText;
        const ok = await runFluxJob(async () => {
          const img = await fetchFluxPrompt(q, hashId(id + '|dupe|' + ti), { pool: true });
          if (!img) return false;
          const stored = await storeGradedImage(img, dest, sectionImageGradeOpts(null));
          return !!stored;
        }, 'dupe-flux:' + id + '-' + ti);
        if (ok) local = rel;
      } catch (e) {}
    } else {
      local = await ensureDdgSectionImage(id, ti, secText, {
        forceNew: true,
        skipReuse: true,
        attemptStart: 4 + fixed * 3,
        dupeSalt: 'dupe' + fixed,
        sectionText: secText,
        excludeUrls: [...seenUrl],
      });
    }
    if (!local) continue;
    let newPh = null;
    try {
      const buf = fs.readFileSync(WD + local);
      newPh = await pHash(buf);
      if (newPh) {
        let stillDupe = false;
        for (const prev of pagePh) {
          if (hamming(prev.ph, newPh) <= REG_HAMMING) { stillDupe = true; break; }
        }
        if (stillDupe) continue;
        pagePh.push({ ph: newPh, url: local });
      }
    } catch (e) { continue; }
    const cap = alt || (qClean.slice(0, 66) + (sect ? (' — ' + sect.slice(0, 56)) : ''));
    lines[i] = '![' + cap + '](' + local + ')';
    seenUrl.add(local);
    fixed++;
    if (newPh) regAdd(newPh, local, 760, 760, pillar, id);
    if (opts.onProgress) opts.onProgress({ done: fixed, label: 'dupe → ' + (sect.slice(0, 40) || 'section') });
  }
  return { body: lines.join('\n'), fixed };
}
/** Full dupe sweep: markdown sections + Top-10 @@PRODUCT cards — within-page only. */
async function sweepAllDuplicateImages(id, question, body, opts) {
  opts = opts || {};
  let fixed = 0;
  let r1 = await sweepPageDuplicateImages(id, question, body, opts);
  body = r1.body;
  fixed += r1.fixed || 0;
  const r2 = await sweepTop10DuplicateImages(id, question, body, opts);
  body = r2.body;
  fixed += r2.fixed || 0;
  return { body, fixed };
}
function harvestRegistryDupeIds() {
  // Cross-page reuse is allowed — only within-page dupes are flagged via countBodyImageDupes.
  return {};
}
// Returns { pass, flag }. A passing self-hosted image is registry-claimed and then skipped forever.
async function auditImage(url, id) {
  if (!url) return { pass: false, flag: 'DEAD' };
  if (/^https?:\/\//i.test(url)) return { pass: false, flag: 'HOTLINKED' };       // live DDG/hotlink = must self-host
  if (/placeholder\.svg|\/img\/auto\/|\.svg(\?|$)/i.test(url)) return { pass: false, flag: 'PLACEHOLDER' };
  if (/^\/assets\/cro-cover-/.test(url)) return { pass: false, flag: 'STANDARD' }; // legacy generic cover
  if (!/^\/assets\/qa\//.test(url)) return { pass: false, flag: 'STANDARD' };      // not our hosting
  try {
    const buf = fs.readFileSync(WD + url);
    if (buf.length < 5000) return { pass: false, flag: 'PLACEHOLDER' };
    const qual = await qualifyPhoto(buf, url);                                     // width>=600, aspect, not flat/logo
    if (!qual) return { pass: false, flag: qual === null ? 'STANDARD' : 'LOWRES' };
    const stamped = await verifyGradeStamp(buf);
    if (!stamped) {
      // Legacy self-hosted files (pre-stamp sweep) still pass audit; retroactive sweep re-grades them.
      if (buf.length > 8000) { const ph = await pHash(buf); regAdd(ph, url, qual.w, qual.h, pillar, id); return { pass: true, flag: null, legacy: true }; }
      return { pass: false, flag: 'GRADE_MISSING' };
    }
    const ph = await pHash(buf);
    const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
    regAdd(ph, url, qual.w, qual.h, pillar, id);
    return { pass: true, flag: null };
  } catch (e) { return { pass: false, flag: 'DEAD' }; }
}
/** Fetch + grade one shared dupe-pool slot (pool-{pillar}-NNN.jpg) for cross-page section reuse. */
async function ensurePillarPoolSlot(pillar, slot, query) {
  if (!sharp) return { ok: false, err: 'sharp unavailable' };
  const rel = poolImageRel(pillar, slot);
  const dest = poolImagePath(pillar, slot);
  const fakeId = '_pool-' + pillar + '-' + String(slot).padStart(3, '0');
  try { if (fs.statSync(dest).size > 8000) return { ok: true, url: rel, skipped: true }; } catch (e) {}
  await backfillRegistry();
  const excludePh = poolPhExcludeSet(pillar);
  if (POLLINATOR_IMAGES_ONLY) {
    const { runFluxJob, fetchFluxPrompt } = require('./_pollinator_flux_throttle');
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        const qq = query || buildPoolQuery(pillar, slot, attempt);
        if (isClichePoolQuery(qq)) continue;
        const seed = hashId(fakeId + '|' + qq + '|' + attempt);
        const result = await runFluxJob(async () => {
          const img = await fetchFluxPrompt(qq, seed, { pool: true });
          if (!img) return null;
          const qual = await qualifyPhoto(img, rel);
          if (!qual) return null;
          if (!(await isArtNotChart(img))) return null;
          const ph = await pHash(img);
          if (regBlocked(ph, pillar, fakeId, { excludePh })) return null;
          if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
          const stored = await storeGradedImage(img, dest, { width: Math.min(1000, qual.w || 1000), bright: qual.meanB > 175 });
          regAdd(ph, rel, stored.w, stored.h, pillar, fakeId, { pool: true, poolQuery: qq, poolSlot: slot });
          flushReg();
          return { ok: true, url: rel, query: qq, harvested: false };
        }, 'pool-slot:' + pillar + '-' + slot);
        if (result && result.ok) return result;
      } catch (e) {}
    }
    return { ok: false, err: 'flux pool slot failed after retries' };
  }
  if (!searchRealPhoto) return { ok: false, err: 'ddg unavailable' };
  const urlSeen = new Set(loadReg().entries.map(e => e.url));
  const STYLES = [
    s => 'cinematic ' + s + ' photography dramatic',
    s => 'artistic ' + s + ' dramatic fine art',
    s => 'dramatic ' + s + ' photography moody atmospheric',
    s => 'editorial ' + s + ' photograph professional',
  ];
  for (let attempt = 0; attempt < 14; attempt++) {
    try {
      const styled = STYLES[(hashId(fakeId) + attempt) % STYLES.length](String(query || PILLAR_SUBJECT[pillar] || pillar));
      const pk = await searchRealPhoto(styled + ' photograph', fakeId + '-a' + attempt, {});
      if (!pk || !pk.img) { await _bo(3000); continue; }
      if (STOCK_BLOCK.test(pk.img) || COMPOSITE_BLOCK.test(pk.img) || REJECT_URL.test(pk.img)) continue;
      if (urlSeen.has(pk.img)) continue;
      const b = await grab(pk.img);
      if (!b) continue;
      const qual = await qualifyPhoto(b, pk.img);
      if (!qual) continue;
      if (!(await isArtNotChart(b))) { urlSeen.add(pk.img); continue; }
      const ph = await pHash(b);
      if (regBlocked(ph, pillar, fakeId, { excludePh })) { urlSeen.add(pk.img); continue; }
      if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
      const stored = await storeGradedImage(b, dest, { width: Math.min(1000, qual.w || 1000), bright: qual.meanB > 175 });
      regAdd(ph, rel, stored.w, stored.h, pillar, fakeId, { pool: true, poolQuery: query || styled, poolSlot: slot });
      flushReg();
      return { ok: true, url: rel, query: query || styled, harvested: false };
    } catch (e) {}
    await _bo(4000);
  }
  return { ok: false, err: 'no match after retries' };
}
/** Copy diverse existing section images from a pillar into pool slots (fast bootstrap). */
async function harvestPillarPoolFromLibrary(pillar, startSlot, maxCopy) {
  startSlot = startSlot || 1;
  maxCopy = maxCopy || 40;
  await backfillRegistry();
  const re = new RegExp('^' + pillar + '\\d+-\\d+\\.jpg$', 'i');
  const files = fs.readdirSync(DIR).filter(f => re.test(f)).sort(() => Math.random() - 0.5);
  const seenPh = poolPhExcludeSet(pillar);
  let slot = startSlot, copied = 0;
  for (const f of files) {
    if (copied >= maxCopy || slot > 100) break;
    const src = DIR + '/' + f;
    try { if (fs.statSync(src).size < 8000) continue; } catch (e) { continue; }
    const buf = fs.readFileSync(src);
    const ph = await pHash(buf);
    if (!ph) continue;
    let dupe = false;
    for (const prev of seenPh) { if (hamming(prev, ph) <= REG_HAMMING) { dupe = true; break; } }
    if (dupe) continue;
    const dest = poolImagePath(pillar, slot);
    const rel = poolImageRel(pillar, slot);
    try { if (fs.statSync(dest).size > 8000) { slot++; continue; } } catch (e) {}
    fs.copyFileSync(src, dest);
    const qual = await qualifyPhoto(buf, rel) || { w: 760, h: 760 };
    const fakeId = '_pool-' + pillar + '-' + String(slot).padStart(3, '0');
    regAdd(ph, rel, qual.w, qual.h, pillar, fakeId, { pool: true, poolQuery: 'harvested:' + f, poolSlot: slot });
    seenPh.push(ph);
    copied++;
    slot++;
  }
  flushReg();
  return { copied, nextSlot: slot };
}
const POOL_SCENE_MODIFIERS = [
  'close-up detail', 'wide establishing shot', 'indoor natural light', 'outdoor golden hour', 'clean workspace',
  'modern minimalist setting', 'warm vintage editorial tone', 'high contrast dramatic lighting', 'soft ambient light',
  'urban environment', 'suburban scene', 'hands-on practical view', 'overhead flat lay', 'side angle perspective',
  'whiteboard planning session', 'solo focused work', 'product in use', 'workspace desk setup',
  'retail storefront exterior', 'interior design detail', 'action moment candid', 'quiet contemplative mood',
  'bright airy atmosphere', 'moody atmospheric scene', 'authentic documentary style',
  'seasonal outdoor scene', 'nighttime illuminated', 'morning light soft shadows', 'macro texture detail',
  'lifestyle context shot', 'equipment close-up', 'process in progress', 'finished result showcase',
  'comparison side by side', 'hands demonstrating task', 'empty space minimalist',
  'colorful vibrant scene', 'neutral toned professional', 'heritage classic style', 'contemporary modern look',
  'behind the scenes candid', 'public venue atmosphere', 'home setting comfortable', 'travel destination vista',
  'craftsmanship detail', 'technology interface screen', 'nature integrated backdrop', 'industrial setting',
];
const POOL_QUERY_CLICHE_RE = /\b(handshake|handshaking|headshot|portrait photograph|portrait suit|team meeting portrait|executive portrait|business meeting|customer interaction|consultant advising|corporate director portrait|CEO modern office portrait|manager presentation room|revenue leader strategy session|fractional advisor coaching|professional woman leader portrait|sales leader team meeting|confident business executive headshot)\b/i;
function isClichePoolQuery(q) {
  // Strip intentional negations (buildPoolQuery + flux tail append "no handshake") before cliché scan.
  const s = String(q || '').replace(/\bno\s+handshak\w*\b/gi, ' ').replace(/\s+/g, ' ').trim();
  return POOL_QUERY_CLICHE_RE.test(s);
}
const POOL_PORTRAIT_PILLARS = new Set(['tl', 'ik', 'gp', 'ra', 'st', 'tk', 'ai', 'sw', 'tc', 'fr', 'q', 'ed']);
// Pillar-specific scene prompts — Image Generator rotates these (not generic exec headshots for every slot).
const PILLAR_POOL_SCENES = {
  tl: ['CRO team reviewing landing page on laptops', 'ecommerce checkout line at retail store', 'UX researcher user testing session with notebook', 'designer sketching wireframes on paper at desk', 'split test sticky notes on office whiteboard', 'shopping cart in grocery aisle candid', 'marketing team standup in bright office', 'open laptop on standing desk natural light', 'mobile phone in hand scrolling on couch', 'product manager working in coffee shop'],
  gp: ['go-to-market whiteboard strategy session', 'sales pipeline review meeting around table', 'founder pitching to small team in office', 'customer onboarding workshop at conference table', 'SDR outbound call floor energy', 'product launch planning table with samples', 'account executive discovery call at desk', 'marketing sales alignment standup', 'pricing strategy discussion over coffee', 'churn review meeting in glass office', 'ICP workshop with sticky notes wall'],
  ra: ['revenue planning session at whiteboard', 'sales and marketing alignment meeting table', 'RevOps team review in modern office', 'territory planning map on wall', 'comp plan discussion at conference table', 'customer lifecycle workshop sticky notes', 'cross-functional revenue meeting standing', 'lead routing review at laptops', 'quota attainment team huddle'],
  st: ['sales training role-play exercise', 'new rep onboarding classroom', 'cold call coaching session', 'objection handling workshop', 'sales manager coaching one on one', 'pitch practice with feedback', 'CRM training at laptops', 'team selling simulation', 'discovery question drill', 'closing techniques whiteboard'],
  ik: ['executive briefing in conference room', 'metrics review meeting at table', 'spreadsheet-free strategy discussion office', 'operational review in bright workspace', 'quarterly business review roundtable', 'data-driven decision meeting whiteboard', 'benchmark discussion over printed notes'],
  ai: ['data center server racks corridor', 'GPU cluster cooling aisle', 'network operations floor wide shot', 'machine learning engineer at server rack', 'fiber optic cable backbone close-up', 'technician at server rack', 'AI compute facility exterior'],
  tk: ['developer at multi-monitor coding setup', 'software architecture whiteboard', 'tech team integration planning session', 'engineering standup huddle', 'API planning notes on whiteboard', 'devops team at laptops', 'cloud deployment terminal room'],
  sw: ['software product demo on laptop', 'code review pair programming', 'mobile app prototype on desk', 'engineering sprint planning board', 'bug triage meeting', 'release planning sticky notes wall'],
  tc: ['cell tower on hill at sunset', '5G network equipment close-up', 'telecom field technician truck', 'network map operations center', 'fiber splice enclosure detail', 'radio base station installation', 'satellite dish array facility'],
  fr: ['franchise storefront opening day', 'franchisee training at location', 'quick service restaurant counter', 'franchise branding uniform team', 'new location construction progress', 'franchise operations manual review'],
  q: ['modern open plan office collaboration', 'knowledge worker focused at desk', 'team brainstorming with sticky notes', 'professional library research', 'conference room presentation', 'mentor advising professional'],
  ed: ['business advisor client meeting table', 'executive coaching session office', 'advisory board roundtable', 'consultant presenting strategy slides', 'mentorship conversation cafe', 'fractional executive video call'],
  rs: ['luxury resort infinity pool ocean view', 'hotel lobby grand entrance', 'spa treatment room serene', 'beach resort aerial coastline', 'fine dining resort restaurant', 'tropical resort cabana'],
  lv: ['luxury travel destination overlook', 'boutique hotel suite interior', 'private villa pool terrace', 'scenic travel adventure trail', 'first class airport lounge', 'exotic travel market street'],
  ca: ['sports car on coastal highway', 'classic car detail chrome', 'electric vehicle charging station', 'car interior dashboard modern', 'auto showroom floor display', 'mechanic engine bay service', 'road trip mountain pass driving'],
  bt: ['sailboat on calm blue water', 'fishing boat harbor morning', 'yacht deck sunset cruise', 'kayak on lake reflection', 'marina dock boats lined up', 'speedboat wake action shot'],
  aq: ['colorful reef fish swimming coral', 'home aquarium planted freshwater', 'public aquarium tunnel walkthrough', 'aquarium maintenance aquascape', 'tropical fish close-up scales', 'coral reef diving scene', 'betta fish vivid colors', 'aquarium store display tanks'],
  es: ['espresso machine pulling shot', 'latte art rosetta cup', 'coffee beans grinder close-up', 'cafe barista steaming milk', 'pour over coffee dripper', 'specialty coffee roastery bags'],
  dn: ['chef plating fine dining dish', 'restaurant kitchen line service', 'farm to table ingredients spread', 'busy restaurant dining room', 'sushi chef precise cut', 'outdoor patio dinner ambiance'],
  pt: ['golden retriever playing park', 'cat lounging sunny windowsill', 'veterinarian examining dog', 'pet grooming salon session', 'puppy training class', 'aquarium fish tank living room'],
  sy: ['street style fashion outfit full length', 'boutique clothing rack curated', 'tailor fitting suit client', 'runway inspired editorial pose', 'sneaker collection display shelf', 'jewelry accessorized close-up'],
  gm: ['gaming setup RGB monitors', 'esports tournament stage lights', 'console controller hands action', 'PC build cable management', 'retro arcade cabinet row', 'VR headset player immersed'],
  fs: ['angler casting fly fishing river', 'fresh catch on boat deck', 'tackle box gear organized', 'sunrise lake fishing quiet', 'deep sea fishing charter', 'fly tying bench close-up'],
  cr: ['crab pot on dock harbor', 'steamed crabs newspaper table', 'crabbing boat working water', 'crab feast outdoor picnic', 'seafood boil pot steaming'],
  er: ['consumer electronics unboxing desk', 'smart home devices table spread', 'repair bench soldering iron', 'headphones premium product shot', 'tablet stylus creative work', 'camera gear flat lay'],
  tv: ['living room large TV wall mounted', 'home theater projector screen', 'sports game on big screen', 'TV showroom retail display', 'streaming remote couch evening'],
  co: ['vintage collectibles display shelf', 'trading cards graded case', 'auction house preview room', 'collector examining rare item', 'comic book collection boxes'],
  cl: ['cologne bottle studio lighting', 'fragrance counter department store', 'perfume ingredients still life', 'mens grooming kit travel'],
  bo: ['commercial kitchen buildout stainless', 'retail store build construction', 'office tenant improvement site', 'restaurant renovation progress', 'custom cabinetry workshop'],
  sc: ['university campus quad autumn', 'classroom students laptops', 'school library study tables', 'graduation cap celebration', 'science lab experiment bench'],
  ev: ['conference keynote stage audience', 'wedding reception dance floor', 'trade show booth crowd', 'outdoor festival stage lights', 'corporate gala ballroom'],
  ga: ['backyard barbecue friends gathering', 'dinner party table candles', 'community block party street', 'holiday family dinner table', 'potluck spread kitchen island'],
  nl: ['nightclub dance floor lights', 'cocktail bar mixology action', 'rooftop bar city skyline night', 'jazz club intimate stage', 'neon sign bar exterior'],
  tn: ['main street small town shops', 'local farmers market stalls', 'town square clock tower', 'historic downtown sidewalk cafe', 'community parade main street'],
  wl: ['spa massage room candles', 'yoga studio morning class', 'meditation garden peaceful', 'wellness smoothie bowl prep', 'infrared sauna interior'],
  hf: ['family kitchen cooking together', 'backyard kids playing lawn', 'home office parent working', 'living room movie night couch', 'garden vegetable harvest'],
  ce: ['newsroom editors meeting screens', 'press conference microphones', 'journalist laptop coffee shop', 'breaking news control room', 'newspaper printing press floor'],
  mv: ['cinema auditorium empty seats', 'film projector booth vintage', 'movie premiere red carpet', 'home theater popcorn evening', 'director monitor on set'],
  dr: ['power drill woodworking bench', 'construction site power tools', 'DIY garage project workbench', 'contractor measuring lumber', 'tool belt jobsite detail'],
  bs: ['book summary notes highlighted', 'library stack reading nook', 'audiobook headphones cozy chair', 'desk stacked business books', 'kindle e-reader coffee morning'],
  gb: ['graphic designer tablet stylus', 'print studio large format printer', 'logo sketch notebook pages', 'color swatch palette fan', 'photography studio lighting setup'],
};
function pillarPoolSceneList(pillar) {
  if (PILLAR_POOL_SCENES[pillar] && PILLAR_POOL_SCENES[pillar].length) return PILLAR_POOL_SCENES[pillar];
  const subj = PILLAR_SUBJECT[pillar] || pillar;
  return POOL_SCENE_MODIFIERS.map(m => subj + ' ' + m);
}
// Thematic branches — on miss, jump to a different visual family (not just re-roll same scene list).
const POOL_BRANCH_ORDER = ['core', 'objects', 'spaces', 'process', 'materials', 'exterior', 'detail_world', 'adjacent'];
const POOL_BRANCH_LABELS = {
  core: 'core pillar scenes',
  guide: 'your guide keywords',
  objects: 'branch → objects & props',
  spaces: 'branch → rooms & spaces',
  process: 'branch → work in progress',
  materials: 'branch → materials & supplies',
  exterior: 'branch → street & exterior',
  detail_world: 'branch → macro detail world',
  adjacent: 'branch → adjacent topic angle',
};
const POOL_BRANCH_TEMPLATES = {
  objects: [
    '{subj} tools arranged on desk', 'equipment and props for {subj} flat lay', 'workstation gear for {subj} close-up',
    'notebook pen laptop {subj} still life', 'industry tools emblematic of {subj}',
  ],
  spaces: [
    'empty unoccupied {subj} workspace interior', '{subj} location building exterior wide', 'vacant {subj} venue before opening',
    'wide shot {subj} office or shop interior', 'architectural space related to {subj}',
  ],
  process: [
    'hands working on {subj} task overhead view no handshake', '{subj} craft work in progress on table', 'assembly or setup step for {subj}',
    'person from behind working at {subj} desk no faces', 'over-shoulder view {subj} screen or bench',
  ],
  materials: [
    'raw materials and supplies for {subj} on table', 'inventory shelf organized for {subj}', 'components parts spread {subj} workshop',
    'packaging samples related to {subj}', 'ingredients or inputs for {subj} overhead',
  ],
  exterior: [
    '{subj} storefront sidewalk daytime', '{subj} city street context establishing shot', 'parking lot and building {subj} exterior',
    'neighborhood block related to {subj}', 'signage storefront window {subj}',
  ],
  detail_world: [
    'macro texture detail emblematic of {subj}', 'small symbolic object representing {subj} close-up', 'label badge sticker related to {subj}',
    'fabric metal wood texture from {subj} context', 'instrument panel gauge detail {subj}',
  ],
  adjacent: [
    'related industry scene supporting {subj} wide angle', 'customer perspective experience of {subj}', 'supply chain moment connected to {subj}',
    'education training context for {subj}', 'community impact scene tied to {subj}',
  ],
};
// Optional per-pillar branch overrides (richer than templates alone).
const PILLAR_BRANCH_SCENES = {
  gp: {
    objects: ['CRM dashboard on laptop close-up', 'printed sales pipeline report on desk', 'GTM sticky notes on glass wall', 'pricing spreadsheet printout', 'outbound dialer headset on desk'],
    spaces: ['empty startup war room whiteboard', 'vacant sales floor office chairs', 'coworking space quiet morning', 'glass conference room before meeting'],
    process: ['founder writing on whiteboard from behind', 'hands typing CRM notes laptop only', 'SDR headset call desk side angle'],
    materials: ['sales playbooks stacked on shelf', 'trade show booth materials in box', 'printed ICP persona cards spread out'],
    exterior: ['SaaS office building downtown sidewalk', 'startup incubator exterior sign', 'business park campus walkway'],
    adjacent: ['customer onboarding welcome packet desk', 'churn dashboard metrics on monitor', 'marketing funnel diagram sketched paper'],
  },
  tl: {
    objects: ['A/B test results printout on desk', 'heatmap mouse on laptop', 'conversion funnel sticky notes', 'UX research consent forms stack'],
    spaces: ['empty usability lab observation room', 'vacant ecommerce fulfillment bench', 'quiet analytics office at night'],
    process: ['designer reviewing landing page on monitor from behind', 'hands adjusting checkout form on screen', 'split test code deploy terminal'],
    materials: ['user interview transcript highlighted pages', 'wireframe sketches spread on table', 'analytics dashboard sticky notes'],
    exterior: ['ecommerce warehouse loading dock exterior', 'digital agency storefront window', 'tech campus walkway banners'],
    adjacent: ['shopping cart on mobile phone close-up', 'email campaign preview on tablet', 'customer review stars product page'],
  },
  aq: {
    objects: ['aquarium test kit bottles arranged', 'fish net and siphon on towel', 'aquascape tweezers and scissors kit', 'water parameter log clipboard'],
    spaces: ['empty fish room rack shelves', 'public aquarium tunnel no people', 'home fish room dim blue light'],
    process: ['hands planting aquarium stem from above', 'water change bucket siphon action', 'aquascape trimming underwater view'],
    materials: ['aquarium substrate bags stacked', 'driftwood stones hardscape layout dry', 'fish food containers organized shelf'],
    exterior: ['aquarium store storefront tanks in window', 'tropical fish market outdoor stalls', 'coastal pier fishing supplies shop'],
    adjacent: ['coral frag rack close-up colors', 'planted tank CO2 bubble counter', 'reef tank cleanup crew shrimp macro'],
  },
};
function branchSceneList(pillar, branch) {
  if (branch === 'core' || !branch) return pillarPoolSceneList(pillar);
  if (PILLAR_BRANCH_SCENES[pillar] && PILLAR_BRANCH_SCENES[pillar][branch] && PILLAR_BRANCH_SCENES[pillar][branch].length) {
    return PILLAR_BRANCH_SCENES[pillar][branch];
  }
  const subj = PILLAR_SUBJECT[pillar] || pillar;
  const tpl = POOL_BRANCH_TEMPLATES[branch] || POOL_BRANCH_TEMPLATES.adjacent;
  return tpl.map(t => t.replace(/\{subj\}/g, subj).replace(/\{pillar\}/g, pillar));
}
const _pillarKeywordCatalogCache = {};
/** Flat deduped keyword list: core PILLAR_POOL_SCENES + every branch list for this pillar. */
function pillarKeywordCatalog(pillar) {
  if (_pillarKeywordCatalogCache[pillar]) return _pillarKeywordCatalogCache[pillar];
  const seen = new Set();
  const out = [];
  function add(list, branch) {
    for (const keyword of list || []) {
      const key = String(keyword).trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push({ keyword: String(keyword).trim(), branch: branch || 'core' });
    }
  }
  add(pillarPoolSceneList(pillar), 'core');
  for (const branch of POOL_BRANCH_ORDER) {
    if (branch === 'core') continue;
    add(branchSceneList(pillar, branch), branch);
  }
  _pillarKeywordCatalogCache[pillar] = out;
  return out;
}
/** Comma/newline/semicolon-separated owner keywords for Image Generator guide mode. */
function parseGuideKeywords(raw) {
  if (!raw) return [];
  return String(raw).split(/[\n,;|]+/).map(s => s.trim()).filter(Boolean).slice(0, 48);
}
function peekPoolKeyword(pillar, cursor, state) {
  if (state && state.guideCatalog && state.guideCatalog.length) {
    const idx = ((cursor || 0) % state.guideCatalog.length + state.guideCatalog.length) % state.guideCatalog.length;
    const kw = state.guideCatalog[idx].keyword || state.guideCatalog[idx];
    return { keyword: kw, branch: 'guide', idx, total: state.guideCatalog.length };
  }
  const catalog = pillarKeywordCatalog(pillar);
  if (!catalog.length) return { keyword: PILLAR_SUBJECT[pillar] || pillar, branch: 'core', idx: 0, total: 0 };
  const idx = ((cursor || 0) % catalog.length + catalog.length) % catalog.length;
  return Object.assign({}, catalog[idx], { idx, total: catalog.length });
}
/** Take next keyword from catalog — call once per flux try. Guide keywords override pillar catalog when set. */
function takePoolKeyword(pillar, state) {
  state = state || { cursor: 0 };
  if (state.guideCatalog && state.guideCatalog.length) {
    const idx = ((state.cursor || 0) % state.guideCatalog.length + state.guideCatalog.length) % state.guideCatalog.length;
    state.cursor = (state.cursor || 0) + 1;
    const kw = state.guideCatalog[idx].keyword || state.guideCatalog[idx];
    const entry = { keyword: kw, branch: 'guide', idx, total: state.guideCatalog.length };
    state.last = entry;
    return entry;
  }
  const entry = peekPoolKeyword(pillar, state.cursor);
  state.cursor = (state.cursor || 0) + 1;
  state.last = entry;
  return entry;
}
function pickPoolBranch(missStreak, tryIdx, branchCursor) {
  const idx = ((branchCursor || 0) + (missStreak || 0) + (tryIdx || 0)) % POOL_BRANCH_ORDER.length;
  const branch = POOL_BRANCH_ORDER[idx];
  return { branch, label: POOL_BRANCH_LABELS[branch] || branch, branchIdx: idx };
}
const POOL_ESCAPE_PREFIXES = [
  'wide angle establishing shot of ',
  'aerial overhead view of ',
  'low angle dramatic view of ',
  'candid side angle photograph of ',
  'through-window view of ',
  'silhouette backlit scene of ',
];
const POOL_FLUX_MISS_PLANS = [
  { mode: 'normal', label: 'rotate scene in branch' },
  { mode: 'scene_jump', label: 'jump scene within branch' },
  { mode: 'escape', label: 'wide escape in branch' },
  { mode: 'detail', label: 'macro detail in branch' },
  { mode: 'minimal', label: 'minimal prompt in branch' },
  { mode: 'night', label: 'different lighting in branch' },
  { mode: 'environment', label: 'empty environment branch' },
  { mode: 'scene_jump', label: 'far scene new branch family' },
];
function planFluxMissRetry(tryIdx, lastReason, missStreak, pillar, slotSeed, branchCursor) {
  let tier = tryIdx + Math.floor((missStreak || 0) / 2);
  if (lastReason === 'dupe') tier = Math.max(tier, 2);
  if (lastReason === 'fetch') tier = Math.max(tier, 1);
  if (lastReason === 'grade') tier = Math.max(tier, 3);
  tier = Math.min(tier, POOL_FLUX_MISS_PLANS.length - 1);
  const plan = Object.assign({}, POOL_FLUX_MISS_PLANS[tier]);
  const branchPick = pickPoolBranch(missStreak, tryIdx, branchCursor);
  plan.branch = branchPick.branch;
  plan.branchLabel = branchPick.label;
  plan.sceneJump = (tryIdx + 1) * 11 + (missStreak || 0) * 19 + (lastReason === 'dupe' ? 37 : 0) + branchPick.branchIdx * 7;
  plan.seedSalt = tryIdx * 997 + (missStreak || 0) * 503 + slotSeed * 3 + tier * 131 + branchPick.branchIdx * 409;
  if (lastReason === 'dupe') plan.missMode = plan.mode === 'normal' ? 'dupe' : plan.mode;
  else if (lastReason === 'fetch') plan.missMode = 'fetch';
  else if (lastReason === 'grade') plan.missMode = 'grade';
  else plan.missMode = plan.branch !== 'core' ? 'branch' : plan.mode;
  return plan;
}
function buildPoolQuery(pillar, slot, attempt, opts) {
  opts = opts || {};
  attempt = attempt || 0;
  const mode = opts.mode || 'normal';
  const kw = opts.keywordEntry || null;
  const branch = (kw && kw.branch) || opts.branch || 'core';
  const modIdx = opts.modifierIdx != null ? opts.modifierIdx : (slot + attempt);
  let scene = (kw && kw.keyword) || opts.keyword || null;
  if (!scene) {
    const scenes = branchSceneList(pillar, branch);
    const sceneJump = opts.sceneJump || 0;
    const h = hashId(pillar + ':' + branch + ':' + slot + ':' + attempt + ':' + mode + ':' + sceneJump);
    let sceneIdx = (h + slot * 3 + sceneJump * 17) % scenes.length;
    if (mode === 'scene_jump') sceneIdx = (slot * 31 + attempt * 7 + sceneJump * 13 + branch.charCodeAt(0)) % scenes.length;
    scene = scenes[sceneIdx];
  }
  scene = stripFluxPoisonWords(scene) || (PILLAR_SUBJECT[pillar] || pillar) + ' workspace documentary scene';
  const h = hashId(pillar + ':' + branch + ':' + String(scene).slice(0, 40) + ':' + attempt + ':' + mode);
  if (mode === 'escape') {
    const pref = POOL_ESCAPE_PREFIXES[(h + attempt + (opts.sceneJump || 0)) % POOL_ESCAPE_PREFIXES.length];
    return pref + scene.toLowerCase().replace(/^(a |an )/, '') + ', documentary photograph, no handshake';
  }
  if (mode === 'detail') {
    return 'extreme close-up detail texture of ' + scene.toLowerCase().replace(/^(a |an )/, '') + ', macro photograph, no handshake';
  }
  if (mode === 'minimal') {
    return scene.split(',')[0].trim() + ', simple photograph, no handshake';
  }
  if (mode === 'night') {
    const mod = POOL_SCENE_MODIFIERS[(modIdx + 5) % POOL_SCENE_MODIFIERS.length];
    return scene + ', ' + mod + ', golden hour or night lighting, documentary photograph, no handshake';
  }
  if (mode === 'environment') {
    return 'empty unoccupied ' + scene.toLowerCase().replace(/^(a |an )/, '') + ', no people, documentary photograph, no handshake';
  }
  const mod = POOL_SCENE_MODIFIERS[(modIdx + pillar.charCodeAt(0)) % POOL_SCENE_MODIFIERS.length];
  return scene + ', ' + mod + ', documentary photograph, no handshake';
}
/** 🔒 TOPICS-PAGE LOOK (owner law): Pollinator images must match /topics hub tiles —
 *  clean documentary editorial photos, warm cinematic grade (storeGradedImage), no flyer/text/stock clichés. */
function pillarOfId(id) { return (String(id).match(/^[a-z]+/) || [''])[0]; }
const TITLE_SEARCH_STOP = new Set('the a an of to in for on at by with and or vs versus is are do does how what which where when why who whom best top ten tools tool guide review list under over your my this that these those it as into from about near i you we should can need cost costs price buy buying hire find get use using'.split(' '));
/** Derive several visual search phrases from a Q&A title before flux (rotates on ✗ Try again). */
function titleFluxSearchQueries(question, id) {
  const raw = String(question || '').replace(/[#*_`>|?"]/g, ' ').replace(/\s+/g, ' ').trim();
  const stripped = raw
    .replace(/^(the\s+)?(\d+\s+)?best\s+/i, '')
    .replace(/\s+in\s+20\d{2}\s*$/i, '')
    .replace(/\s+(guide|review|list|top\s*10|top-10)\s*$/i, '')
    .trim();
  const tokens = stripped.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !TITLE_SEARCH_STOP.has(w) && !/^\d+$/.test(w));
  const topic = tokens.slice(0, 8).join(' ') || stripped.slice(0, 90) || String(id);
  const short = tokens.slice(0, 5).join(' ') || topic;
  const out = [
    topic + ' editorial documentary photograph',
    short + ' real workplace or field environment photo',
    short + ' close-up detail product equipment photograph',
    stripped + ' wide cinematic establishing shot',
    topic + ' professional editorial scene specific to topic',
    short + ' natural light candid documentary photo',
    topic + ' authentic editorial photo not generic stock',
    short + ' award-winning photojournalism style scene',
    topic + ' vivid on-topic editorial photograph high detail',
    short + ' environmental portrait relevant to subject',
  ].map(s => stripFluxPoisonWords(String(s || '').replace(/\s+/g, ' ').trim()).slice(0, 130)).filter(s => s.length > 10);
  const seen = new Set();
  return out.filter(s => { if (seen.has(s)) return false; seen.add(s); return true; });
}
function pickTitleSearchQuery(question, id, attempt) {
  const all = titleFluxSearchQueries(question, id);
  if (!all.length) all.push(stripFluxPoisonWords(String(question || id).slice(0, 100)));
  const idx = ((attempt || 0) % all.length + all.length) % all.length;
  return { query: all[idx], idx, total: all.length, all };
}
function buildFluxFaceQuery(id, question, attempt, guideKeywords) {
  attempt = attempt || 0;
  const guides = parseGuideKeywords(guideKeywords);
  const titlePick = pickTitleSearchQuery(question, id, attempt);
  const titleQ = titlePick.query;
  const pillar = pillarOfId(id);
  const slot = (hashId(id) % 900) + 1 + attempt * 3;
  const poolQ = buildPoolQuery(pillar, slot, attempt + titlePick.idx);
  if (guides.length) {
    const kw = stripFluxPoisonWords(guides[attempt % guides.length]);
    return titleQ + ', ' + kw + ', ' + poolQ + ', ' + FACE_CARD_FRAMING + ', ' + FLUX_REAL_PHOTO_LAW + ', warm cinematic grade';
  }
  if (PORTRAIT_PILLARS.has(pillar)) {
    return titleQ + ', ' + PORTRAIT_VARIANTS[(hashId(id) + attempt + titlePick.idx) % PORTRAIT_VARIANTS.length] + ', ' + poolQ + ', ' + FACE_CARD_FRAMING + ', ' + FLUX_REAL_PHOTO_LAW;
  }
  return titleQ + ', ' + poolQ + ', ' + FACE_CARD_FRAMING + ', ' + FLUX_REAL_PHOTO_LAW;
}
function buildFluxSectionQuery(id, sectionText, slot, attempt, guideKeywords) {
  attempt = attempt || 0;
  const pillar = pillarOfId(id);
  const poolQ = buildPoolQuery(pillar, slot || ((hashId(id) % 900) + 1), attempt);
  const guides = parseGuideKeywords(guideKeywords);
  const hint = stripFluxPoisonWords(String(sectionText || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120));
  const titlePick = pickTitleSearchQuery(hint, id, attempt);
  const titleQ = titlePick.query;
  if (guides.length) {
    const kw = stripFluxPoisonWords(guides[attempt % guides.length]);
    return titleQ + ', ' + kw + ', ' + poolQ + ', ' + SECTION_TILE_FRAMING + ', ' + FLUX_REAL_PHOTO_LAW;
  }
  if (hint && hint.length > 6) return titleQ + ', ' + hint + ', ' + poolQ + ', ' + SECTION_TILE_FRAMING + ', ' + FLUX_REAL_PHOTO_LAW;
  return titleQ + ', ' + poolQ + ', ' + SECTION_TILE_FRAMING + ', ' + FLUX_REAL_PHOTO_LAW;
}
/** Remove pool slots generated from old portrait/handshake cliché prompts so Image Generator can refill. */
function purgeClichePoolImages(pillar, opts) {
  opts = opts || {};
  const pillars = pillar ? [pillar] : [...new Set(loadReg().entries.filter(e => isPoolImageUrl(e.url)).map(e => e.pillar).filter(Boolean))];
  const removed = [];
  const r = loadReg();
  for (const p of pillars) {
    for (const e of [...r.entries]) {
      if (!isPoolImageUrl(e.url) || e.pillar !== p) continue;
      const q = e.poolQuery || '';
      if (!isClichePoolQuery(q) && !opts.aggressive) continue;
      if (opts.aggressive && !q.startsWith('harvested:') && !isClichePoolQuery(q)) {
        const scenes = pillarPoolSceneList(p);
        const sceneHit = scenes.some(s => q.toLowerCase().includes(String(s).slice(0, 12).toLowerCase()));
        if (sceneHit) continue;
      }
      const dest = DIR + '/' + String(e.url).replace(/^\/assets\/qa\//, '');
      if (!opts.dryRun) {
        try { fs.unlinkSync(dest); } catch (err) {}
        r.entries = r.entries.filter(x => x.url !== e.url);
      }
      removed.push({ pillar: p, url: e.url, poolQuery: q });
    }
  }
  if (!opts.dryRun) flushReg();
  return { removed: removed.length, items: removed };
}
async function runPillarPoolBuild(pillar, target, opts) {
  opts = opts || {};
  target = Math.max(1, Math.min(POOL_BATCH_MAX, target || POOL_BATCH_DEFAULT));
  let harvested = 0, generated = 0, errors = 0;
  let have = countPillarPoolSlots(pillar);
  if (opts.onLog) opts.onLog(pillar + ': ' + have + '/' + target + ' pool images');
  if (have < target && opts.harvest !== false) {
    const har = await harvestPillarPoolFromLibrary(pillar, have + 1, Math.min(45, target - have));
    harvested = har.copied || 0;
    have = countPillarPoolSlots(pillar);
    if (opts.onLog) opts.onLog('harvested ' + harvested + ' existing section photos → ' + have + '/' + target);
  }
  for (let slot = 1; slot <= target && have < target; slot++) {
    if (opts.shouldStop && opts.shouldStop()) break;
    try { if (fs.statSync(poolImagePath(pillar, slot)).size > 8000) continue; } catch (e) {}
    const query = buildPoolQuery(pillar, slot);
    if (opts.onProgress) opts.onProgress({ slot, target, have, query, step: 'generate' });
    const r = await ensurePillarPoolSlot(pillar, slot, query);
    if (r.ok && !r.skipped) {
      generated++;
      if (opts.onLog) opts.onLog('✓ pool-' + pillar + '-' + String(slot).padStart(3, '0'));
    } else if (r.ok && r.skipped) {
      /* already exists */
    } else {
      errors++;
      if (opts.onLog) opts.onLog('✗ slot ' + slot + ' — ' + (r.err || 'no match'));
    }
    have = countPillarPoolSlots(pillar);
    if (opts.onSlot) opts.onSlot({ slot, have, target, generated, errors, harvested });
    await _bo(2500);
  }
  flushReg();
  return { pillar, target, count: countPillarPoolSlots(pillar), harvested, generated, errors, stopped: !!(opts.shouldStop && opts.shouldStop()) };
}
/** True when a self-hosted /assets/qa/ file decodes and carries the grade stamp (renders on site). */
async function verifyQaAssetRenders(url, id) {
  const u = String(url || '').replace(/\?.*$/, '').trim();
  if (!u.startsWith('/assets/qa/')) return null;
  const fp = WD + u;
  try {
    const st = fs.statSync(fp);
    if (u === '/assets/qa/' + id + '.jpg') {
      if (!coverFileOk(id)) return false;
    } else if (st.size < 4000) return false;
    const buf = fs.readFileSync(fp);
    if (!sharp) return st.size >= 4000 && !!(await verifyGradeStamp(buf));
    const meta = await sharp(buf, { animated: false }).metadata();
    if (!meta.width || !meta.height || meta.width < 200 || meta.height < 200) return false;
    return !!(await verifyGradeStamp(buf));
  } catch (e) { return false; }
}
module.exports = { tryPosterLibrary, faceCardCoverOk, coverFileOk, ensureDdgFaceCover, ensureAlternateFaceCover, makeDdgFaceCover, makeFluxFaceCover, rebakeFaceCardTitle, ensureFaceCardOrangeTitle, gatherCoverCandidates, ensureDdgSectionImage, ensureAlternateSectionImage, repairBrokenQaImages, pickReusableLibraryImage, pickMatchingLibraryImage, isFillableImageUrl, isUpgradableImageUrl, isBrokenQaImageUrl, isPortraitPoolEntry, isFaceCardCoverUrl, isSectionImageUrl, isPoolImageUrl, isPollinatorImageUrl, pollinatorImageLooksGood, pollinatorImageLooksGoodSync, bodyPageImageUrls, fillEntryMissingImages, sweepPageDuplicateImages, sweepTop10DuplicateImages, sweepAllDuplicateImages, countBodyImageDupes, harvestRegistryDupeIds, harvestPillarFilledUrls, auditImage, backfillRegistry, stampDdgProvenance, stampCoverProvenance, coverPath, coverFileOk2: coverFileOk, STOCK_BLOCK, storeGradedImage, gradeFaceCardFromBuffer, resolveFaceCardCropPosition, faceCardTileGradeOpts, faceCardSquareGradeOpts, goldTitleLayout, goldTitleOverlaySVG, FACE_CARD_TILE_W, FACE_CARD_TILE_H, verifyGradeStamp, verifyQaAssetRenders, applyCineGrade, GRADE_STAMP, FACE_TITLE_ORANGE, FACE_TITLE_STROKE, FACE_CARD_FRAMING, PILLAR_SUBJECT, POLLINATOR_IMAGES_ONLY, POOL_REUSE_AFTER, FILL_REUSE_PCT, poolReuseUnlocked, countPillarPoolSlots, pillarPoolInventory, maxPoolSlot, nextPoolSlot, ensurePillarPoolSlot, harvestPillarPoolFromLibrary, poolImageRel, flushReg, buildPoolQuery, buildFluxFaceQuery, buildFluxSectionQuery, parseGuideKeywords, titleFluxSearchQueries, pickTitleSearchQuery, isClichePoolQuery, purgeClichePoolImages, autoCuratePoolBatch, runPillarPoolBuild, collectPillarPoolBatch, commitPillarPoolBatch, discardPillarPoolBatch, faceCoverQualityOk, poolStagingQualityOk, allowDdgForCall, slotPrefersFlux, coverAltFirst, imageProviderAlt, pollinatorBreakLabel, pollinatorBreakSec };
