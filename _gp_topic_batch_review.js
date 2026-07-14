// _gp_topic_batch_review.js — topical face review (GTM / Industry KPIs / …).
// HARD RULE: never show the same Pexels photo twice (global usedPhotos by photo id).
// ✓ Keep · ✗ Trash · Zoom out = wider crop of SAME original → back into pool → returns later.
// Pillar: TOPIC_PILLAR=gp|ik|ra (default gp). Bank: TOPIC_BANK (default 320 = 300+ future).
'use strict';
const fs = require('fs');
const http = require('http');
const path = require('path');
const sharp = require('sharp');
const WD = 'C:/Users/koryj/website';
for (const l of fs.readFileSync(WD + '/.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const { getStore } = require('@netlify/blobs');
const store = getStore({
  name: 'pulse-machine-library',
  siteID: 'a2b74b30-a1ac-40e2-9622-aebfc2feb482',
  token: process.env.BLOBS_PAT || process.env.NETLIFY_AUTH_TOKEN,
});
const crypto = require('crypto');
const flib = require('./_ddg_facecard_lib');
const { queryForTitle, subjectFromTitle, isArchitectureQuery, PEOPLE_FALLBACK, ARCH_FALLBACK } = require('./_gp_topic_image_queries');

/** Short keyword label for square tiles — long Qs become e.g. "best movies Scientology 2027". */
function abbreviateTitleForSquare(title) {
  const raw = String(title || '').trim();
  if (!raw) return '';
  const year = (raw.match(/\b(20\d{2})\b/) || [])[1] || '';
  // Keep signal words (best/top/industry); drop question filler only
  const DROP = new Set(('how what when where why which who whom whose do does did is are was were be been being can could should would will shall may might must you your yours the a an to for of in on at by and or nor but with about into from that this these those there their them they we us our as if then than so such just really very much many more most some any all each every both few other another also only even still already yet ago over under again further then once here there when where why how all both each few more most other some such no nor not only own same so than too very can will just don should now blah etc etcetera something anything everything nothing'.split(/\s+/)));
  const KEEP_SHORT = new Set(['ai', 'hr', 'b2b', 'b2c', 'crm', 'erp', 'saas', 'gtm', 'kpi', 'roi', 'arr', 'iot', 'ml']);
  let words = raw
    .replace(/[—–]/g, ' ')
    .replace(/[^a-zA-Z0-9 &\-/+]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => {
      const l = w.toLowerCase();
      if (/^\d{4}$/.test(l)) return false; // year added once at end
      if (KEEP_SHORT.has(l)) return true;
      if (DROP.has(l)) return false;
      if (l.length <= 2 && !KEEP_SHORT.has(l)) return false;
      return true;
    });
  // Dedupe consecutive repeats
  words = words.filter((w, i) => i === 0 || w.toLowerCase() !== words[i - 1].toLowerCase());
  // Cap length for square readability
  if (words.length > 7) words = words.slice(0, 7);
  let out = words.join(' ').trim();
  if (year && !new RegExp('\\b' + year + '\\b').test(out)) out = (out + ' ' + year).trim();
  // Fallback: subject extractor if we stripped too hard
  if (out.split(/\s+/).filter(Boolean).length < 2) {
    const sub = subjectFromTitle(raw);
    out = sub || raw.slice(0, 48);
    if (year && !new RegExp('\\b' + year + '\\b').test(out)) out = (out + ' ' + year).trim();
  }
  return out;
}
const { syncHeroDupesFaceCard } = require('./_img_flux_rewrite_lib');
const imgSearch = require('./netlify/functions/lib/img-search-lib');
// HARD BAN (owner ×100): topic face rooms = Pexels inventory / Pexels API ONLY.
// Never Pollinator / Flux / pollinations.ai for face or bank fills.
const NO_POLLINATOR = true;
void NO_POLLINATOR;

const PILLAR = String(process.env.TOPIC_PILLAR || 'gp').toLowerCase().replace(/[^a-z]/g, '') || 'gp';
const PILLAR_LABEL = ({ gp: 'GTM Playbooks', ik: 'Industry KPIs', ra: 'Revenue Architecture', st: 'Sales Trainings', bs: 'Book Summaries' })[PILLAR] || PILLAR.toUpperCase();
const PILLAR_RC = ({ gp: 'GTM PLAYBOOKS', ik: 'INDUSTRY KPIS', ra: 'REVENUE ARCHITECTURE', st: 'SALES TRAININGS', bs: 'BOOK SUMMARIES' })[PILLAR] || PILLAR.toUpperCase();
const ID_RE = new RegExp('^' + PILLAR + '\\d', 'i');
const DEFAULT_PORT = ({ gp: 8914, ik: 8917, ra: 8918, st: 8921, bs: 8920 })[PILLAR] || 8914;

const PORT = process.env.GP_TOPIC_PORT ? parseInt(process.env.GP_TOPIC_PORT, 10) : DEFAULT_PORT;
const BANK_TARGET = Math.max(300, parseInt(process.env.TOPIC_BANK || '320', 10) || 320); // 300+ for future
const PAGE = Math.max(BANK_TARGET, parseInt(process.env.TOPIC_PAGE || String(BANK_TARGET), 10) || BANK_TARGET); // all bank in one room
const BATCH = BANK_TARGET;
const ARCH_MAX_RATIO = 0.10; // buildings ≤ 10%
const AHASH_MAX_DIST = (PILLAR === 'bs' || PILLAR === 'st') ? 16 : 10; // stricter near-dupe ban for books + sales meetings

const QA = path.join(WD, 'assets', 'qa');
const STAGE = path.join(QA, PILLAR === 'gp' ? '_gp_topic_stage' : ('_' + PILLAR + '_topic_stage'));
const STATE_F = path.join(WD, PILLAR === 'gp' ? '_gp_topic_review_state.json' : ('_' + PILLAR + '_topic_review_state.json'));
const REWORK_F = path.join(WD, PILLAR === 'gp' ? '_gp_face_rework_pool.json' : ('_' + PILLAR + '_face_rework_pool.json'));
const PEXELS_INV = path.join(QA, '_pexels_stored'); // owner library — prefer before API
const PEXELS = process.env.PEXELS_API_KEY || '';
const FRESH_START = process.env.GP_TOPIC_FRESH === '1' || process.argv.includes('--fresh');
const LOG_TAG = PILLAR + '-topic';

try { fs.mkdirSync(STAGE, { recursive: true }); } catch (e) {}

/** Read local file:// or absolute paths (inventory srcUrl / zoom requeue). */
function readLocalSrc(srcUrl) {
  if (!srcUrl) return null;
  const s = String(srcUrl);
  if (s.startsWith('file:')) {
    let p = decodeURIComponent(s.replace(/^file:\/\//i, ''));
    if (/^\/[A-Za-z]:[\\/]/.test(p)) p = p.slice(1);
    p = p.replace(/\//g, path.sep);
    try { if (fs.existsSync(p)) return fs.readFileSync(p); } catch (e) {}
    return null;
  }
  if (s.startsWith('/') || /^[A-Za-z]:[\\/]/.test(s)) {
    try { if (fs.existsSync(s)) return fs.readFileSync(s); } catch (e) {}
  }
  return null;
}

/** Owner Pexels library index (assets/qa/_pexels_stored). Lazy-loaded once. */
let invIndex = null;
function loadInvIndex() {
  if (invIndex) return invIndex;
  const queryByFile = {};
  try {
    const room = JSON.parse(fs.readFileSync(path.join(WD, 'pexels_room_state.json'), 'utf8'));
    for (const meta of Object.values(room.downloaded || {})) {
      if (meta && meta.file) queryByFile[String(meta.file).toLowerCase()] = String(meta.query || '');
    }
  } catch (e) {}
  invIndex = [];
  try {
    for (const n of fs.readdirSync(PEXELS_INV)) {
      if (!/\.jpe?g$/i.test(n)) continue;
      const fp = path.join(PEXELS_INV, n);
      try { if (fs.statSync(fp).size < 3000) continue; } catch (e) { continue; }
      const m = n.match(/_(\d+)\.jpe?g$/i);
      const photoId = m ? m[1] : ('inv-' + n.replace(/\.jpe?g$/i, ''));
      invIndex.push({
        file: n,
        path: fp,
        photoId,
        // Prefer room query; else slug from filename (query-slug_photoId.jpg)
        query: queryByFile[n.toLowerCase()] || String(n).replace(/_\d+\.jpe?g$/i, '').replace(/[-_]+/g, ' '),
      });
    }
  } catch (e) {}
  console.log('[' + LOG_TAG + '] pexels inv ready', invIndex.length);
  return invIndex;
}

function scoreInvItem(item, tokens) {
  if (!tokens.length) return 0;
  const hay = (item.query + ' ' + item.file).toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (t.length < 3) continue;
    if (hay.includes(t)) s += t.length >= 6 ? 2 : 1;
  }
  return s;
}

const INV_STOP = new Set(('the a an to for of in on and or with your how what top best most common complete operating playbook guide strategy gtm revenue architecture architect operations revops business company industry you should know before investing worth getting started options strategies approach 2026 2027'.split(/\s+/)));

/** Library only on a real title match. No match → null → caller hits Pexels API. */
async function tryFromInventory(entry, usedIds, st, subject, title, titleQuery, meta) {
  const inv = loadInvIndex();
  if (!inv.length) return null;

  // Books / sales-meeting pillars: prefer library files that match the IMAGE theme
  // (not author names from titles like "Challenger Sale Matthew Dixon").
  let tokenSrc = [subject, title, titleQuery].filter(Boolean).join(' ');
  if (meta && meta.booksOnly) {
    tokenSrc = String(titleQuery || '') + ' book books reading library bookshelf hardcover paperback study notebook';
  }
  if (meta && meta.groupOnly) {
    tokenSrc = String(titleQuery || '') + ' sales meeting training workshop team office business conference presentation coaching corporate professionals library bookshelf study classroom seminar learning';
  }

  const tokens = String(tokenSrc)
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !INV_STOP.has(t) && !/^\d+$/.test(t));
  if (!tokens.length) return null;

  const ST_INV_OK = /\b(sales|meeting|training|workshop|team|office|business|conference|presentation|coaching|corporate|professionals?|library|study|classroom|seminar|books?)\b/i;
  const ST_INV_BAN = /\b(esport|gaming|costume|halloween|wedding|party|beach|yoga|gym|restaurant|chef|dog|cat|pet)\b/i;
  const BS_INV_OK = /\b(book|books|reading|library|novel|hardcover|paperback|bookshelf|study|notebook)\b/i;
  const BS_INV_BAN = /\b(esport|gaming|costume|halloween|wedding|party|beach|yoga|gym|restaurant|chef|dog|cat|pet)\b/i;

  const MIN_SCORE = (meta && (meta.groupOnly || meta.booksOnly)) ? 2 : 2;
  const ranked = inv
    .map((it, i) => ({ it, i, sc: scoreInvItem(it, tokens) }))
    .filter((x) => {
      if (usedIds.has(String(x.it.photoId))) return false;
      const hay = (x.it.query + ' ' + x.it.file).toLowerCase();
      if (meta && meta.groupOnly) {
        if (ST_INV_BAN.test(hay)) return false;
        if (!ST_INV_OK.test(hay)) return false;
        // theme match enough — sales/training OR library OK for ST
        if (x.sc < MIN_SCORE && !/\b(sales|meeting|training|library|workshop|seminar)\b/.test(hay)) return false;
      } else if (meta && meta.booksOnly) {
        if (BS_INV_BAN.test(hay)) return false;
        if (!BS_INV_OK.test(hay)) return false;
        // book files always eligible even if score soft — theme match is enough
        if (x.sc < 1 && !/\b(book|reading|library|bookshelf)\b/.test(hay)) return false;
      } else if (x.sc < MIN_SCORE) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.sc - a.sc || a.i - b.i);
  if (!ranked.length) {
    console.log('[' + LOG_TAG + ']', entry.id, 'inv miss → Pexels', tokens.slice(0, 6).join(','));
    return null;
  }

  const maxTries = Math.min(40, ranked.length);
  for (let n = 0; n < maxTries; n++) {
    const it = ranked[n].it;
    usedIds.add(String(it.photoId));
    try {
      const buf = fs.readFileSync(it.path);
      const vis = await acceptUniqueVisualAsync(st, buf, String(it.photoId), entry.id);
      if (!vis.ok) {
        usedIds.delete(String(it.photoId));
        console.log('[' + LOG_TAG + ']', entry.id, 'inv skip', vis.reason, it.file);
        continue;
      }
      rememberVisual(st, entry.id, it.photoId, vis.hash, vis.ahash);
      const srcUrl = 'file:///' + it.path.replace(/\\/g, '/');
      console.log('[' + LOG_TAG + ']', entry.id, 'inv hit score', ranked[n].sc, it.file);
      return stageFromBuffer(entry, buf, {
        query: titleQuery || it.query || subject || 'pexels-inv',
        mode: 'pexels-inv',
        srcUrl,
        photoId: String(it.photoId),
        zoomLevel: 0,
        hash: vis.hash,
        ahash: vis.ahash,
      });
    } catch (e) {
      usedIds.delete(String(it.photoId));
    }
  }
  return null;
}

function loadJSON(f, d) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } }
function saveJSON(f, o) { fs.writeFileSync(f, JSON.stringify(o, null, 1)); }
function saveBankProgress(st) {
  const live = loadState();
  live.bank = st.bank;
  live.usedPhotos = st.usedPhotos;
  live.usedHashes = st.usedHashes || {};
  live.usedAHashes = st.usedAHashes || [];
  live.zoomQueue = st.zoomQueue;
  // NEVER clobber an active review page mid-fill
  saveJSON(STATE_F, live);
  st.batch = live.batch;
  st.approved = live.approved;
  st.trashed = live.trashed;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function photoKey(urlOrId) {
  const s = String(urlOrId || '');
  const m = s.match(/\/photos\/(\d+)\//) || s.match(/^(\d+)$/);
  if (m) return m[1];
  return s.split('?')[0] || '';
}

function freshState() {
  return {
    approved: {},
    trashed: {},
    usedPhotos: {},
    usedHashes: {},
    usedAHashes: [],
    zoomQueue: {},
    bank: [],
    cursor: 0,
    batch: null,
    startedAt: Date.now(),
  };
}

function wipeStage() {
  try {
    for (const f of fs.readdirSync(STAGE)) {
      try { fs.unlinkSync(path.join(STAGE, f)); } catch (e) {}
    }
  } catch (e) {}
}

if (FRESH_START) {
  wipeStage();
  saveJSON(STATE_F, freshState());
  console.log('[gp-topic] FRESH START — wiped stage + review state');
}

function loadState() {
  const s = loadJSON(STATE_F, freshState());
  if (!s.approved) s.approved = {};
  if (!s.trashed) s.trashed = {};
  if (!s.usedPhotos) s.usedPhotos = {};
  if (!s.usedHashes) s.usedHashes = {};
  if (!Array.isArray(s.usedAHashes)) s.usedAHashes = [];
  if (!s.zoomQueue) s.zoomQueue = {};
  if (!Array.isArray(s.bank)) s.bank = [];
  if (typeof s.cursor !== 'number') s.cursor = 0;
  return s;
}

async function aHashBits(buf) {
  const raw = await sharp(buf).rotate().greyscale().resize(8, 8, { fit: 'fill' }).raw().toBuffer();
  let sum = 0;
  for (const v of raw) sum += v;
  const avg = sum / raw.length;
  let bits = '';
  for (const v of raw) bits += v >= avg ? '1' : '0';
  return bits;
}
function hamming(a, b) {
  let d = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) d++;
  return d;
}
function contentHash(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

/** Reject exact + near-duplicate visuals. Returns {ok, hash, ahash} or {ok:false,reason}. */
function acceptUniqueVisual(st, buf, photoId, id) {
  const hash = contentHash(buf);
  if (st.usedHashes[hash] && st.usedHashes[hash] !== id) {
    return { ok: false, reason: 'hash-dupe:' + st.usedHashes[hash] };
  }
  return { ok: true, hash, photoId };
}

async function acceptUniqueVisualAsync(st, buf, photoId, id) {
  const base = acceptUniqueVisual(st, buf, photoId, id);
  if (!base.ok) return base;
  const ah = await aHashBits(buf);
  for (const prev of st.usedAHashes || []) {
    if (hamming(prev, ah) <= AHASH_MAX_DIST) {
      return { ok: false, reason: 'near-dupe-ahash' };
    }
  }
  return { ok: true, hash: base.hash, ahash: ah, photoId };
}

function rememberVisual(st, id, photoId, hash, ahash) {
  if (photoId) st.usedPhotos[String(photoId)] = id;
  if (hash) st.usedHashes[hash] = id;
  if (ahash) {
    st.usedAHashes = st.usedAHashes || [];
    st.usedAHashes.push(ahash);
    if (st.usedAHashes.length > 5000) st.usedAHashes = st.usedAHashes.slice(-4000);
  }
}

function countArchitecture(items) {
  return (items || []).filter((it) => it.mode === 'architecture-fallback' || isArchitectureQuery(it.query)).length;
}

function architectureBudgetOk(st, nextIsArch) {
  if (!nextIsArch) return true;
  const pool = []
    .concat(st.bank || [])
    .concat((st.batch && st.batch.items) || []);
  const arch = countArchitecture(pool);
  const total = Math.max(1, pool.length + 1);
  return (arch / total) < ARCH_MAX_RATIO;
}

function pushRework(id, title) {
  const r = loadJSON(REWORK_F, { pillar: PILLAR, ids: [], log: [] });
  if (!Array.isArray(r.ids)) r.ids = [];
  if (!r.ids.includes(id)) r.ids.push(id);
  r.log = (r.log || []).slice(0, 200);
  r.log.unshift({ id, title: String(title || '').slice(0, 120), at: Date.now(), action: 'trashed→gen-pool' });
  r.updatedAt = Date.now();
  saveJSON(REWORK_F, r);
}

function removeRework(id) {
  const r = loadJSON(REWORK_F, { pillar: PILLAR, ids: [], log: [] });
  r.ids = (r.ids || []).filter((x) => x !== id);
  saveJSON(REWORK_F, r);
}

/** Pexels search — returns [{ id, url }] never duplicates within result set. */
const photoCache = new Map();
async function pexelsSearch(query, page) {
  const key = query + '::' + page;
  if (photoCache.has(key)) return photoCache.get(key);
  if (!PEXELS) return [];
  try {
    const url = 'https://api.pexels.com/v1/search?per_page=30&orientation=landscape'
      + '&page=' + page
      + '&query=' + encodeURIComponent(query);
    const r = await fetch(url, { headers: { Authorization: PEXELS }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) { photoCache.set(key, []); return []; }
    const j = await r.json();
    const seen = new Set();
    const out = [];
    for (const p of j.photos || []) {
      if (!p || !p.id || p.width < 1000) continue;
      const id = String(p.id);
      if (seen.has(id)) continue;
      seen.add(id);
      const u = (p.src && (p.src.original || p.src.large2x || p.src.large)) || '';
      if (!u) continue;
      out.push({ id, url: u });
    }
    photoCache.set(key, out);
    await sleep(250);
    return out;
  } catch (e) {
    photoCache.set(key, []);
    return [];
  }
}

/** Pick first photo whose id is NOT in used. Searches up to 5 pages + architecture fallback. */
async function pickUniquePhoto(query, usedIds, allowFallback) {
  const tryQuery = async (q) => {
    for (let page = 1; page <= 5; page++) {
      const hits = await pexelsSearch(q, page);
      for (const h of hits) {
        if (!usedIds.has(h.id)) return { ...h, query: q };
      }
      if (!hits.length) break;
    }
    return null;
  };
  let hit = await tryQuery(query);
  if (!hit && allowFallback && query !== 'modern architecture building exterior city') {
    hit = await tryQuery('modern architecture building exterior city');
    if (hit) hit.fallback = true;
  }
  return hit;
}

async function listGp() {
  const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
  const rows = (idx.entries || []).filter((e) => e && e.id && ID_RE.test(String(e.id)));
  rows.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  return rows.map((e) => ({ id: String(e.id), title: e.question || e.title || e.id }));
}

/**
 * Optical framing from the ORIGINAL photo.
 * Initial view = WHOLE photo visible (contain) — not a tight cover crop.
 * zoomLevel only kept for requeue bookkeeping; framing stays full-frame contain.
 */
async function writeFramed(id, buf, zoomLevel) {
  const stagePath = path.join(STAGE, id + '.jpg');
  const stageSq = path.join(STAGE, id + '.sq.jpg');
  const rawPath = path.join(STAGE, id + '.raw.jpg');
  fs.writeFileSync(rawPath, buf);
  void zoomLevel;

  const rotated = await sharp(buf).rotate().toBuffer();
  const box = 760;

  // Full original inside the square — subject smaller, scene fully visible (true zoom-out)
  await sharp({
    create: { width: box, height: box, channels: 3, background: { r: 0, g: 0, b: 0 } },
  }).composite([{
    input: await sharp(rotated).resize(box, box, {
      fit: 'inside',
      withoutEnlargement: false,
    }).jpeg({ quality: 90, mozjpeg: true }).toBuffer(),
    gravity: 'centre',
  }]).jpeg({ quality: 86, mozjpeg: true }).toFile(stageSq);

  // Face hero: same whole-photo idea (contain, not cover crop)
  await flib.gradeFaceCardFromBuffer(rotated, stagePath, {
    question: '',
    cropPosition: 'centre',
    fit: 'contain',
  });
  return { stagePath, stageSq };
}

async function stageFromBuffer(entry, buf, meta) {
  const id = entry.id;
  await writeFramed(id, buf, meta.zoomLevel || 0);
  const curFace = path.join(QA, id + '.jpg');
  return {
    id,
    title: entry.title,
    query: meta.query,
    mode: meta.mode,
    proposed: '/stage/' + id + '.jpg',
    browse: '/browse/' + id + '.sq.jpg',
    current: fs.existsSync(curFace) && fs.statSync(curFace).size > 20000 ? '/cur/' + id + '.jpg' : '',
    srcUrl: meta.srcUrl,
    photoId: String(meta.photoId),
    zoomLevel: meta.zoomLevel || 0,
    contentHash: meta.hash || contentHash(buf),
    ahash: meta.ahash || '',
  };
}

async function tryDownloadUnique(st, usedIds, photo, id) {
  if (!photo || usedIds.has(String(photo.id))) return null;
  usedIds.add(String(photo.id));
  try {
    const ir = await fetch(photo.url, { signal: AbortSignal.timeout(30000) });
    if (!ir.ok) { usedIds.delete(String(photo.id)); return null; }
    const buf = Buffer.from(await ir.arrayBuffer());
    const vis = await acceptUniqueVisualAsync(st, buf, String(photo.id), id);
    if (!vis.ok) {
      usedIds.delete(String(photo.id));
      console.log('  skip', photo.id, vis.reason);
      return null;
    }
    return { buf, photoId: String(photo.id), srcUrl: photo.url, hash: vis.hash, ahash: vis.ahash };
  } catch (e) {
    usedIds.delete(String(photo.id));
    return null;
  }
}

async function stageOne(entry, usedIds, zoomHint, st) {
  st = st || loadState();
  const id = entry.id;
  const title = entry.title;

  if (zoomHint && zoomHint.srcUrl && zoomHint.photoId) {
    let buf;
    const rawPath = path.join(STAGE, id + '.raw.jpg');
    if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 5000) {
      buf = fs.readFileSync(rawPath);
    } else {
      const local = readLocalSrc(zoomHint.srcUrl);
      if (local) {
        buf = local;
      } else {
        const ir = await fetch(zoomHint.srcUrl, { signal: AbortSignal.timeout(30000) });
        if (!ir.ok) return null;
        buf = Buffer.from(await ir.arrayBuffer());
      }
    }
    usedIds.add(String(zoomHint.photoId));
    const row = await stageFromBuffer(entry, buf, {
      query: zoomHint.query,
      mode: zoomHint.mode || 'zoom-requeue',
      srcUrl: zoomHint.srcUrl,
      photoId: zoomHint.photoId,
      zoomLevel: zoomHint.zoomLevel || 1,
    });
    return row;
  }

  const meta = queryForTitle(title, { pillar: PILLAR });
  const subject = meta.subject || subjectFromTitle(title);

  // QUALITY PATH (owner ×100): Pexels ONLY · search FROM THE TITLE
  // 1) inventory by title keywords  2) Pexels API by title. Never Pollinator. Never random pile.
  const fromInv = await tryFromInventory(entry, usedIds, st, subject, title, meta.query, meta);
  if (fromInv) return fromInv;

  const queries = [];
  const pushQ = (q, mode, arch) => {
    if (!q || queries.some((x) => x.q === q)) return;
    queries.push({ q, mode: mode || meta.mode, arch: !!arch });
  };
  // Title → Pexels API first
  pushQ(meta.query, meta.mode, isArchitectureQuery(meta.query) || meta.mode === 'architecture-fallback');
  if (PILLAR === 'bs') {
    // Book Summaries: pile more title variants — still Pexels, still from title
    if (subject) {
      pushQ(subject + ' hardcover book', 'bs-title', false);
      pushQ(subject + ' book cover reading', 'bs-title', false);
      pushQ(subject, 'bs-title', false);
    }
  } else {
    if (subject) pushQ(subject + ' people working professionals', 'subject', false);
    if (subject) pushQ(subject + ' workers professionals', 'subject', false);
    // Architecture only if budget allows — last resort (never for books)
    if (architectureBudgetOk(st, true)) pushQ(ARCH_FALLBACK, 'architecture-fallback', true);
  }

  for (const qi of queries) {
    if (qi.arch && !architectureBudgetOk(st, true)) continue;
    for (let page = 1; page <= 6; page++) {
      const hits = await pexelsSearch(qi.q, page);
      for (const h of hits) {
        const got = await tryDownloadUnique(st, usedIds, h, id);
        if (!got) continue;
        rememberVisual(st, id, got.photoId, got.hash, got.ahash);
        const row = await stageFromBuffer(entry, got.buf, {
          query: qi.q,
          mode: qi.mode,
          srcUrl: got.srcUrl,
          photoId: got.photoId,
          zoomLevel: 0,
          hash: got.hash,
          ahash: got.ahash,
        });
        return row;
      }
      if (!hits.length) break;
    }
  }

  console.log('NO UNIQUE PHOTO for', id, meta.query);
  return null;
}

async function fillBank() {
  const st = loadState();
  if (!Array.isArray(st.bank)) st.bank = [];

  // Fold any leftover batch items that were already voted out of view back? keep batch separate.
  const usedIds = new Set(Object.keys(st.usedPhotos));
  for (const it of st.bank) {
    if (it.photoId) usedIds.add(String(it.photoId));
  }
  for (const it of (st.batch && st.batch.items) || []) {
    if (it.photoId) usedIds.add(String(it.photoId));
  }

  const inBank = new Set(st.bank.map((x) => x.id));
  for (const it of (st.batch && st.batch.items) || []) inBank.add(it.id);

  stagingProgress.active = true;
  stagingProgress.total = BANK_TARGET;
  stagingProgress.done = st.bank.length;
  stagingProgress.lastId = '';

  // Zoom-out returns go to front of bank
  for (const zid of Object.keys(st.zoomQueue)) {
    if (st.bank.length >= BANK_TARGET) break;
    if (st.approved[zid] || st.trashed[zid] || inBank.has(zid)) {
      delete st.zoomQueue[zid];
      continue;
    }
    const hint = st.zoomQueue[zid];
    process.stdout.write('[bank-zoom] ' + zid + ' L' + (hint.zoomLevel || 1) + ' … ');
    const row = await stageOne({ id: zid, title: hint.title || zid }, usedIds, hint, st);
    if (row) {
      st.bank.unshift(row);
      inBank.add(zid);
      rememberVisual(st, zid, row.photoId, row.contentHash, row.ahash);
      delete st.zoomQueue[zid];
      stagingProgress.done = st.bank.length;
      stagingProgress.lastId = zid;
      console.log('ok photo', row.photoId);
    } else console.log('FAIL');
  }

  const all = await listGp();
  const pending = all.filter((e) =>
    !st.approved[e.id] && !st.trashed[e.id] && !st.zoomQueue[e.id] && !inBank.has(e.id));

  for (const e of pending) {
    if (st.bank.length >= BANK_TARGET) break;
    process.stdout.write('[bank] ' + e.id + ' … ');
    const row = await stageOne(e, usedIds, null, st);
    if (row) {
      if (st.usedPhotos[row.photoId] && st.usedPhotos[row.photoId] !== row.id) {
        console.log('DUP BLOCKED', row.photoId);
        usedIds.delete(row.photoId);
        continue;
      }
      if (st.bank.some((x) => x.photoId === row.photoId)) {
        console.log('DUP IN BANK BLOCKED', row.photoId);
        continue;
      }
      if (row.mode === 'architecture-fallback' || isArchitectureQuery(row.query)) {
        if (!architectureBudgetOk(st, true)) {
          console.log('ARCH CAP — skip buildings for', e.id);
          continue;
        }
      }
      st.bank.push(row);
      inBank.add(row.id);
      rememberVisual(st, row.id, row.photoId, row.contentHash, row.ahash);
      stagingProgress.done = st.bank.length;
      stagingProgress.lastId = row.id;
      if (st.bank.length % 10 === 0) saveBankProgress(st);
      console.log(row.mode, '·', row.query, '· photo', row.photoId, '· bank', st.bank.length + '/' + BANK_TARGET);
    } else console.log('FAIL');
  }

  saveBankProgress(st);
  stagingProgress.done = st.bank.length;
  stagingProgress.active = false;
  console.log('[' + LOG_TAG + '] bank ready', st.bank.length, '/', BANK_TARGET);
  return st;
}

/** Move up to PAGE cards from bank → current batch for the board. */
function promoteFromBank(st) {
  if (!Array.isArray(st.bank)) st.bank = [];
  const unfinished = ((st.batch && st.batch.items) || []).filter((it) =>
    !st.approved[it.id] && !st.trashed[it.id] && !st.zoomQueue[it.id]);
  if (unfinished.length) return st;

  const take = st.bank.splice(0, PAGE);
  st.batch = { at: Date.now(), items: take };
  saveJSON(STATE_F, st);
  console.log('[' + LOG_TAG + '] promoted', take.length, 'from bank · bank left', st.bank.length);
  return st;
}

async function ensureBatch(forceNew) {
  let st = loadState();
  if (forceNew) {
    // Keep unfinished votes; only clear empty/done batch
    const unfinished = unfinishedCount(st);
    if (!unfinished) {
      st.batch = null;
      saveJSON(STATE_F, st);
    }
  }
  st = promoteFromBank(st);
  if (unfinishedCount(st) === 0 && st.bank.length === 0) {
    // nothing to show yet — fill some then promote
    await fillBank();
    st = loadState();
    st = promoteFromBank(st);
  }
  return st;
}

const stagingProgress = { active: false, done: 0, total: BANK_TARGET, lastId: '', err: '' };
let stagingJob = null;

function unfinishedCount(st) {
  return ((st.batch && st.batch.items) || []).filter((it) =>
    !st.approved[it.id] && !st.trashed[it.id] && !st.zoomQueue[it.id]).length;
}

function bankCount(st) {
  return (st.bank && st.bank.length) || 0;
}

function kickBankFill() {
  if (stagingJob) return stagingJob;
  const st = loadState();
  if (bankCount(st) >= BANK_TARGET) return Promise.resolve(st);
  stagingProgress.active = true;
  stagingProgress.done = bankCount(st);
  stagingProgress.total = BANK_TARGET;
  stagingProgress.err = '';
  stagingJob = fillBank()
    .catch((e) => {
      stagingProgress.err = String(e && e.message || e);
      stagingProgress.active = false;
      console.error('[gp-topic] bank fill failed', e);
    })
    .finally(() => { stagingJob = null; });
  return stagingJob;
}

function kickStage(forceNew) {
  // Back-compat name: refill bank, then ensure a page is promoted
  const p = kickBankFill();
  return Promise.resolve(p).then(() => ensureBatch(!!forceNew));
}

function loadingPage() {
  const st = loadState();
  const d = Math.max(stagingProgress.done, bankCount(st));
  const t = BANK_TARGET;
  const pageN = unfinishedCount(st);
  return `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">
<title>${PILLAR_LABEL} — banking ${d}/${t}</title>
<style>
html,body{margin:0;background:#000;color:#eee;font:16px/1.5 system-ui;min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{max-width:460px;padding:28px;text-align:center}
h1{font:800 1.3rem Georgia,serif;color:#F6C445;margin:0 0 10px}
p{color:#9a958c;margin:0 0 14px}
b{color:#EAC15C}
.bar{height:10px;background:#222;border-radius:6px;overflow:hidden;margin:18px 0}
.fill{height:100%;width:${Math.min(100, Math.round(100 * d / t))}%;background:#EAC15C;transition:width .3s}
</style>
<div class=box>
  <h1>Banking images for review</h1>
  <p>Pulling from your <b>Pexels library</b> first, then generating only if needed.<br>
  Reserve of <b>${t}</b> · <b>${PAGE}</b> on the board.</p>
  <div class=bar><div class=fill id=fill></div></div>
  <p>Bank <b id=n>${d}</b> / <b>${t}</b> · on page <b id=page>${pageN}</b><br><span id=last>${stagingProgress.lastId || '…'}</span></p>
</div>
<script>
async function tick(){
  try{
    const r=await fetch('/status');
    const j=await r.json();
    document.getElementById('n').textContent=j.bank||j.done||0;
    document.getElementById('page').textContent=j.pending||0;
    document.getElementById('fill').style.width=Math.min(100,Math.round(100*(j.bank||j.done||0)/(j.total||${t})))+'%';
    if(j.lastId) document.getElementById('last').textContent=j.lastId;
    if(j.ready){ location.href='/?v='+Date.now(); return; }
    if(j.err){ document.getElementById('last').textContent='Error: '+j.err; }
  }catch(e){}
  setTimeout(tick, 1200);
}
tick();
</script>`;
}

/** Permanent: every ✓ Keep lands in assets/qa/_pexels_stored (owner Pexels library). */
function saveApprovedToPexelsLib(id, item) {
  try {
    fs.mkdirSync(PEXELS_INV, { recursive: true });
  } catch (e) {}
  const rawPath = path.join(STAGE, id + '.raw.jpg');
  const stagePath = path.join(STAGE, id + '.jpg');
  const src = (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 4000)
    ? rawPath
    : stagePath;
  if (!fs.existsSync(src) || fs.statSync(src).size < 4000) return null;
  const pid = String((item && item.photoId) || photoKey(item && item.srcUrl) || id).replace(/[^\w-]+/g, '');
  const qslug = String((item && item.query) || id)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'approved';
  const destName = qslug + '_' + pid + '.jpg';
  const dest = path.join(PEXELS_INV, destName);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 4000) return dest; // already in library
  try {
    fs.copyFileSync(src, dest);
    // Invalidate inv cache so next bank fill can reuse this keep
    invIndex = null;
    console.log('[' + LOG_TAG + '] ✓ → pexels lib', destName);
    return dest;
  } catch (e) {
    console.error('[' + LOG_TAG + '] pexels lib save failed', id, e.message);
    return null;
  }
}

/** ✗ Trash — discard staged files; never write to Pexels library. */
function discardStaged(id) {
  for (const name of [id + '.jpg', id + '.sq.jpg', id + '.raw.jpg']) {
    try { fs.unlinkSync(path.join(STAGE, name)); } catch (e) {}
  }
}

async function applyYes(id) {
  const st = loadState();
  const item = (st.batch && st.batch.items || []).find((x) => x.id === id);
  if (!item) return { ok: false, msg: 'not in batch' };
  const stagePath = path.join(STAGE, id + '.jpg');
  const stageSq = path.join(STAGE, id + '.sq.jpg');
  if (!fs.existsSync(stagePath)) return { ok: false, msg: 'no staged file' };
  fs.copyFileSync(stagePath, flib.coverPath(id));
  if (fs.existsSync(stageSq)) fs.copyFileSync(stageSq, path.join(QA, id + '.sq.jpg'));
  // PERMANENT: approved images always join the Pexels library folder
  const libPath = saveApprovedToPexelsLib(id, item);
  st.approved[id] = {
    at: Date.now(),
    query: item.query,
    mode: item.mode,
    photoId: item.photoId || photoKey(item.srcUrl),
    pexelsLib: libPath || '',
  };
  if (item.photoId) st.usedPhotos[String(item.photoId)] = id;
  delete st.trashed[id];
  delete st.zoomQueue[id];
  removeRework(id);
  saveJSON(STATE_F, st);
  setImmediate(async () => {
    try {
      const cur = await store.get('answers/' + id + '.json', { type: 'json' });
      if (cur) {
        let body = cur.answer || cur.body || '';
        body = syncHeroDupesFaceCard(id, cur.question || item.title, body);
        await store.setJSON('answers/' + id + '.json', Object.assign({}, cur, {
          answer: body,
          cover_src: 'pexels-topic',
          face_title_baked: false,
          img: '/assets/qa/' + id + '.jpg',
        }));
      }
    } catch (e) {}
    try {
      const idx = await store.get('_index.json', { type: 'json', consistency: 'strong' });
      const ent = (idx.entries || []).find((x) => x && x.id === id);
      if (ent) { ent.img = '/assets/qa/' + id + '.jpg'; ent.cover_src = 'pexels-topic'; await store.setJSON('_index.json', idx); }
    } catch (e) {}
  });
  return { ok: true };
}

function applyNo(id) {
  const st = loadState();
  const item = (st.batch && st.batch.items || []).find((x) => x.id === id) || { id, title: id };
  discardStaged(id); // ✗ = discard — never copy into Pexels library
  st.trashed[id] = {
    at: Date.now(),
    query: item.query,
    mode: item.mode,
    photoId: item.photoId || photoKey(item.srcUrl),
  };
  // Keep photo burned — never show this image again on another card
  if (item.photoId) st.usedPhotos[String(item.photoId)] = id;
  delete st.approved[id];
  delete st.zoomQueue[id];
  pushRework(id, item.title);
  saveJSON(STATE_F, st);
  return { ok: true };
}

/** Zoom out: pull back on the SAME original, remove from batch, return later via zoomQueue. */
async function applyZoomOut(id) {
  const st = loadState();
  const item = (st.batch && st.batch.items || []).find((x) => x.id === id);
  if (!item) return { ok: false, msg: 'not in batch' };
  if (!item.srcUrl || !item.photoId) return { ok: false, msg: 'no source photo' };

  const nextLevel = (item.zoomLevel || 0) + 1;
  st.zoomQueue[id] = {
    zoomLevel: nextLevel,
    srcUrl: item.srcUrl,
    photoId: String(item.photoId),
    title: item.title,
    query: item.query,
    mode: item.mode,
    at: Date.now(),
  };
  // Keep photo reserved exclusively for this answer
  st.usedPhotos[String(item.photoId)] = id;
  // Drop from current batch so it re-enters general population
  if (st.batch && Array.isArray(st.batch.items)) {
    st.batch.items = st.batch.items.filter((x) => x.id !== id);
    st.batch.at = Date.now();
  }
  saveJSON(STATE_F, st);
  console.log('[' + LOG_TAG + '] zoom-out requeue', id, 'L' + nextLevel, 'photo', item.photoId);
  return { ok: true, requeued: true, zoomLevel: nextLevel };
}

function page(st) {
  const items = ((st.batch && st.batch.items) || []).filter((it) =>
    !st.approved[it.id] && !st.trashed[it.id] && !st.zoomQueue[it.id]);
  const approvedN = Object.keys(st.approved).length;
  const trashedN = Object.keys(st.trashed).length;
  const pendingInBatch = items.length;
  const usedN = Object.keys(st.usedPhotos || {}).length;
  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const v = (st.batch && st.batch.at) || Date.now();
  // SHOW AS SITE LAW — square face tiles + FULL title under (industry readable, no clamp)
  return `<!doctype html><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">
<title>${PILLAR_LABEL} — check / trash / zoom out</title>
<link rel="stylesheet" href="/css/pulse-mosaic.css">
<style>
html,body{margin:0;background:#0a0a0a;color:#eee;font:14px/1.4 system-ui}
body{padding:14px clamp(12px,3vw,28px) 48px}
h1{font:800 1.15rem Georgia,serif;color:#F6C445;margin:0 0 6px}
.sub{color:#9a958c;margin:0 0 12px}
.bar{display:flex;gap:14px;flex-wrap:wrap;margin:0 0 16px;position:sticky;top:0;background:#0a0a0a;padding:10px 0;z-index:20;border-bottom:1px solid #222}
.bar b{color:#EAC15C}
/* Square tiles — photo is 1:1; full title sits under so nothing is cut off */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px 18px;max-width:1200px;margin:0 auto 20px}
.slot{display:flex;flex-direction:column;gap:10px;min-width:0}
.mm-sq{position:relative;display:block;width:100%;aspect-ratio:1/1;overflow:hidden;background:#1a1a1a;border:1.5px solid #EAC15C;text-decoration:none;cursor:default}
.mm-sq .mm-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;display:block;filter:brightness(1.18) saturate(1.04)}
.mm-sq .mm-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.02) 55%,rgba(0,0,0,.45) 100%);pointer-events:none;z-index:1}
.mm-sq .mm-cat{position:absolute;top:10px;left:10px;z-index:2;font-size:.62rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#FFEB3B;background:rgba(0,0,0,.55);border:1px solid rgba(255,235,59,.45);padding:4px 8px;border-radius:6px;text-shadow:0 1px 2px #000}
/* FULL title — no line-clamp; industry must be readable */
.title-full{margin:0;padding:2px 2px 0;font-family:Inter,system-ui,Arial,sans-serif;font-weight:800;font-size:clamp(1.05rem,2.2vw,1.35rem);line-height:1.25;color:#FFEB3B;text-shadow:0 1px 2px #000;word-wrap:break-word;overflow-wrap:anywhere}
.acts{display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:6px;width:100%;position:relative;z-index:5}
button{border:0;border-radius:8px;padding:12px 6px;font:800 .78rem/1.1 system-ui;cursor:pointer;color:#fff}
.yes{background:#1a8f4c}.no{background:#7a1520}.zoom{background:#1a4a7a}
button:disabled{opacity:.45;cursor:wait}
.qid{font:700 .65rem/1 system-ui;color:#777;text-align:center}
.note{color:#9a958c;margin-top:16px}
</style>
<h1>${PILLAR_LABEL}</h1>
<p class=sub><b>Square</b> face tiles (as on site) · <b>full title under</b> so industry is readable · <b>✓</b> Keep · <b>✗</b> Trash · <b>Zoom out</b></p>
<div class=bar>
  <span>On page <b id=batchn>${pendingInBatch}</b></span>
  <span>✓ <b id=okn>${approvedN}</b></span>
  <span>✗ <b id=non>${trashedN}</b></span>
  <span>Unique photos used <b>${usedN}</b></span>
</div>
<div class="grid" id=grid>
${items.map((e) => {
  const img = (e.browse || e.proposed) + '?v=' + v;
  const title = e.title || e.id;
  return `<div class="slot pending" data-id="${esc(e.id)}" data-vote="pending">
<a class="mm-sq" href="#" onclick="return false" aria-label="${esc(title)}">
  <img class="mm-img" id="img-${esc(e.id)}" src="${img}" alt="">
  <div class="mm-scrim"></div>
  <span class="mm-cat">${esc(PILLAR_RC)}</span>
</a>
<h4 class="title-full">${esc(title)}</h4>
<div class="qid">${esc(e.id)}${e.zoomLevel ? ' · zoom L' + e.zoomLevel : ''}</div>
<div class="acts">
<button type="button" class="yes" data-id="${esc(e.id)}" data-act="yes">✓ Keep</button>
<button type="button" class="no" data-id="${esc(e.id)}" data-act="no">✗ Trash</button>
<button type="button" class="zoom" data-id="${esc(e.id)}" data-act="zoom">Zoom out</button>
</div>
</div>`;
}).join('')}
</div>
<p class=note id=waitNote>Finish all 100 — next 100 autoloads. Or hit <b>Load next 100</b>.</p>
<p style="margin-top:14px">
  <button type="button" id="nextBtn" style="border:0;border-radius:10px;padding:14px 22px;font:800 1rem/1 system-ui;cursor:pointer;background:#EAC15C;color:#000">Load next 100 →</button>
</p>
<script>
function bumpCounts(j) {
  if (j.approvedN != null) document.getElementById('okn').textContent = j.approvedN;
  if (j.trashedN != null) document.getElementById('non').textContent = j.trashedN;
  const left = document.querySelectorAll('.slot').length;
  document.getElementById('batchn').textContent = left;
  if (left === 0) {
    document.getElementById('waitNote').textContent = 'Batch done — loading next 100…';
    var btn = document.getElementById('nextBtn');
    if (btn) btn.style.outline = '3px solid #1a8f4c';
    setTimeout(function () { loadNext(); }, 400);
  }
}
async function vote(id, act) {
  const slot = document.querySelector('.slot[data-id="' + id + '"]');
  if (!slot) return;
  // yes / no / zoom all remove from this page (zoom returns later)
  slot.remove();
  bumpCounts({ pendingInBatch: document.querySelectorAll('.slot').length });
  try {
    const r = await fetch('/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, kind: act })
    });
    const j = await r.json();
    if (!j.ok) {
      alert(j.msg || 'vote failed');
      return;
    }
    bumpCounts(j);
  } catch (err) {
    alert('Network error — refresh and try that card again');
  }
}
async function loadNext() {
  var btn = document.getElementById('nextBtn');
  if (btn._loading) return;
  btn._loading = true;
  btn.disabled = true;
  btn.textContent = 'Loading next 100…';
  try {
    const r = await fetch('/next', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    const j = await r.json();
    if (!j.ok) {
      alert(j.msg || 'could not load next');
      btn.disabled = false;
      btn.textContent = 'Load next 100 →';
      btn._loading = false;
      return;
    }
    location.href = '/?v=' + Date.now();
  } catch (e) {
    alert('Load failed — server may still be staging. Wait and try again.');
    btn.disabled = false;
    btn.textContent = 'Load next 100 →';
    btn._loading = false;
  }
}
document.getElementById('grid').addEventListener('click', function (e) {
  var b = e.target.closest('button[data-act]');
  if (!b) return;
  e.preventDefault();
  e.stopPropagation();
  vote(b.getAttribute('data-id'), b.getAttribute('data-act'));
}, true);
document.getElementById('nextBtn').addEventListener('click', function (e) {
  e.preventDefault();
  loadNext();
});
</script>`;
}

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/css/pulse-mosaic.css') {
      const f = path.join(WD, 'css', 'pulse-mosaic.css');
      if (!fs.existsSync(f)) { res.writeHead(404); return res.end('no mosaic css'); }
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'no-cache' });
      return res.end(fs.readFileSync(f));
    }
    if (u.pathname.startsWith('/browse/')) {
      const id = decodeURIComponent(u.pathname.slice('/browse/'.length)).replace(/\.sq\.jpe?g$/i, '').replace(/\.jpe?g$/i, '').replace(/[^a-z0-9]/gi, '');
      const f = path.join(STAGE, id + '.sq.jpg');
      if (!fs.existsSync(f)) { res.writeHead(404); return res.end('missing browse'); }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache' });
      return res.end(fs.readFileSync(f));
    }
    if (u.pathname.startsWith('/stage/')) {
      const id = decodeURIComponent(u.pathname.slice('/stage/'.length)).replace(/\.jpe?g$/i, '').replace(/[^a-z0-9]/gi, '');
      const f = path.join(STAGE, id + '.jpg');
      if (!fs.existsSync(f)) { res.writeHead(404); return res.end('missing'); }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache' });
      return res.end(fs.readFileSync(f));
    }
    if (u.pathname.startsWith('/cur/')) {
      const id = decodeURIComponent(u.pathname.slice('/cur/'.length)).replace(/\.jpe?g$/i, '').replace(/[^a-z0-9]/gi, '');
      const f = path.join(QA, id + '.jpg');
      if (!fs.existsSync(f)) { res.writeHead(404); return res.end('missing'); }
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache' });
      return res.end(fs.readFileSync(f));
    }
    if (u.pathname === '/vote' && req.method === 'POST') {
      let b = '';
      req.on('data', (c) => (b += c));
      req.on('end', async () => {
        try {
          let d = {};
          try { d = JSON.parse(b || '{}'); } catch (e) {}
          const id = String(d.id || '').replace(/[^a-z0-9]/gi, '');
          const kind = String(d.kind || '');
          let out = { ok: false, msg: 'bad kind' };
          if (kind === 'yes') out = await applyYes(id);
          else if (kind === 'no') out = applyNo(id);
          else if (kind === 'zoom') out = await applyZoomOut(id);
          const st = loadState();
          const items = ((st.batch && st.batch.items) || []).filter((it) =>
            !st.approved[it.id] && !st.trashed[it.id] && !st.zoomQueue[it.id]);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(Object.assign({}, out, {
            approvedN: Object.keys(st.approved).length,
            trashedN: Object.keys(st.trashed).length,
            pendingInBatch: items.length,
          })));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, msg: String(e && e.message || e) }));
        }
      });
      return;
    }
    if (u.pathname === '/status') {
      const st = loadState();
      const n = unfinishedCount(st);
      const bank = bankCount(st);
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(JSON.stringify({
        active: stagingProgress.active || !!stagingJob,
        done: stagingProgress.done,
        total: BANK_TARGET,
        bank,
        lastId: stagingProgress.lastId || '',
        err: stagingProgress.err || '',
        ready: n > 0,
        pending: n,
        bankFull: bank >= BANK_TARGET,
      }));
    }
    if (u.pathname === '/next' && req.method === 'POST') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', async () => {
        try {
          const st0 = loadState();
          const unfinished = unfinishedCount(st0);
          if (unfinished) {
            res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
            return res.end(JSON.stringify({ ok: false, msg: 'Finish the current ' + unfinished + ' cards first (✓ / ✗ / Zoom out)' }));
          }
          // Promote next PAGE from bank (instant if banked); refill bank in background
          st0.batch = null;
          saveJSON(STATE_F, st0);
          let st = promoteFromBank(loadState());
          if (unfinishedCount(st) === 0) {
            console.log('[gp-topic] bank empty — filling then promoting…');
            kickBankFill();
            res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
            return res.end(JSON.stringify({ ok: true, staging: true }));
          }
          kickBankFill(); // top bank back up to 300 behind the scenes
          res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify({ ok: true, n: unfinishedCount(st), bank: bankCount(st) }));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, msg: String(e && e.message || e) }));
        }
      });
      return;
    }
    if (u.pathname === '/' || u.pathname === '/index.html') {
      let st = loadState();
      const n = unfinishedCount(st);
      // Always keep banking toward 300 in the background
      kickBankFill();
      if (n > 0) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(page(st));
      }
      // No page yet — try promote from bank, else show loading
      st = promoteFromBank(st);
      if (unfinishedCount(st) > 0) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(page(st));
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(loadingPage());
    }
    res.writeHead(404);
    res.end('not found');
  } catch (e) {
    res.writeHead(500);
    res.end(String(e && e.message || e));
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log('[' + LOG_TAG + '] http://127.0.0.1:' + PORT + '/  — ' + PAGE + '/page · bank target ' + BANK_TARGET + ' · pillar ' + PILLAR);
  const st0 = loadState();
  if (unfinishedCount(st0) === 0) promoteFromBank(st0);
  kickBankFill();
});
