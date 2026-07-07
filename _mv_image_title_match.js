// _mv_image_title_match.js — Criterion #14–#17 checks for mv pillar (title-keyed images + blob hygiene).
'use strict';
const fs = require('fs');
const WD = 'C:/Users/koryj/website';
let sharp;
try { sharp = require('sharp'); } catch (e) {}

const JUNK_MOVIE_IMG = /top[\s_-]?10|top[\s_-]?ten|best[\s_-]?movies?|ranked|listicle|thumbnail|youtube|vs[\s_-]|wallpaper[\s_-]?collection|movie[\s_-]?review[\s_-]?roundup|action[\s_-]?movies[\s_-]?of[\s_-]?20\d{2}/i;
const MOVIE_YEAR_RE = /\((\d{4})\)\s*$/;
const STOP = new Set('the and for with from its our your film movie new best top'.split(' '));
const MOVIE_SLOT_STAMP_PREFIX = 'PULSE_MOVIE=';

function slugify(s) {
  return String(s || '').toLowerCase()
    .replace(/\(\d{4}\)/g, '')
    .replace(/[🏆💎].*$/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseMovieSlot(name) {
  const raw = String(name || '').trim();
  const ym = raw.match(MOVIE_YEAR_RE);
  const year = ym ? ym[1] : null;
  const title = raw.replace(MOVIE_YEAR_RE, '').replace(/[🏆💎].*$/g, '').trim();
  const titleTokens = title.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));
  const slug = slugify(title);
  const slugYear = year ? slug + '-' + year : slug;
  return { raw, title, year, slug, slugYear, titleTokens };
}

function buildMoviePosterSearchQuery(name) {
  const { title, year } = parseMovieSlot(name);
  return year ? title + ' ' + year + ' movie poster' : title + ' movie poster';
}

function movieSlotStamp(movie) {
  return MOVIE_SLOT_STAMP_PREFIX + (movie.slugYear || movie.slug);
}

function isJunkMovieSignal(hay, movie) {
  const h = String(hay || '').toLowerCase();
  if (JUNK_MOVIE_IMG.test(h)) return true;
  if (movie.year) {
    const years = h.match(/\b(19|20)\d{2}\b/g) || [];
    for (const y of years) {
      if (y !== movie.year && Math.abs(parseInt(y, 10) - parseInt(movie.year, 10)) > 1) return true;
    }
  }
  return false;
}

function urlMatchesMovieTitle(url, movie) {
  if (!url || !movie.titleTokens.length) return false;
  const u = String(url).toLowerCase();
  if (movie.slug && u.includes(movie.slug)) return true;
  if (movie.slugYear && u.includes(movie.slugYear)) return true;
  const norm = u.replace(/[^a-z0-9]+/g, ' ');
  let hits = 0;
  for (const t of movie.titleTokens) if (norm.includes(t)) hits++;
  return hits >= Math.min(2, movie.titleTokens.length);
}

function bufferHasMovieStamp(buf, movie) {
  if (!buf || !buf.length) return false;
  try {
    const s = buf.includes(Buffer.from(movieSlotStamp(movie))) || buf.includes(Buffer.from(MOVIE_SLOT_STAMP_PREFIX + movie.slug));
    return s;
  } catch (e) { return false; }
}

async function imageAspectRatio(url) {
  if (!sharp || !url || !/^\/assets\//.test(url)) return null;
  try {
    const meta = await sharp(WD + url).metadata();
    if (!meta.width || !meta.height) return null;
    return meta.width / meta.height;
  } catch (e) { return null; }
}

function posterAspectOk(ar) {
  if (ar == null) return true;
  return ar >= 0.55 && ar <= 0.85;
}

async function verifyMovieSlotImage(url, movieName, opts) {
  opts = opts || {};
  const movie = parseMovieSlot(movieName);
  const hay = url + ' ' + (opts.alt || '') + ' ' + (opts.poolQuery || '');
  if (isJunkMovieSignal(hay, movie)) return { ok: false, flag: 'JUNK_IMAGE' };

  if (/^\/assets\/qa\//.test(url)) {
    try {
      const buf = fs.readFileSync(WD + url);
      if (bufferHasMovieStamp(buf, movie)) {
        const ar = await imageAspectRatio(url);
        if (!posterAspectOk(ar)) return { ok: false, flag: 'LANDSCAPE_POSTER' };
        return { ok: true };
      }
    } catch (e) {}
    if (opts.slotTitle && slugify(opts.slotTitle) === movie.slug) {
      const ar = await imageAspectRatio(url);
      if (!posterAspectOk(ar)) return { ok: false, flag: 'LANDSCAPE_POSTER' };
      return { ok: true };
    }
  }

  if (!urlMatchesMovieTitle(url, movie)) return { ok: false, flag: 'TITLE_MISMATCH' };
  const ar = await imageAspectRatio(url);
  if (!posterAspectOk(ar)) return { ok: false, flag: 'LANDSCAPE_POSTER' };
  return { ok: true };
}

function enumerateProductSlots(body) {
  const slots = [];
  const re = /@@PRODUCT\s+name="([^"]*)"\s+img="([^"]*)"/g;
  let m;
  while ((m = re.exec(String(body || '')))) slots.push({ name: m[1], url: m[2] });
  return slots;
}

async function auditMovieTitleMatch(id, body) {
  const pillar = (String(id).match(/^[a-z]+/) || [''])[0];
  if (pillar !== 'mv') return { total: 0, failed: [] };
  const slots = enumerateProductSlots(body);
  const failed = [];
  for (const s of slots) {
    if (!s.url || /^https?:\/\//i.test(s.url)) {
      failed.push({ url: s.url, name: s.name, flag: 'HOTLINK_OR_EMPTY' });
      continue;
    }
    const r = await verifyMovieSlotImage(s.url, s.name, {});
    if (!r.ok) failed.push({ url: s.url, name: s.name, flag: r.flag });
  }
  return { total: slots.length, failed };
}

const FOREIGN_BOILERPLATE = [
  'Strong track record · Good value · Proven in real deployments',
  'Match features to your team size and integration needs',
  'A solid pick at this rank',
  'Match tank size and maintenance plan',
  'Fit for your tank size',
  'real aquarium setups',
  'day-to-day performance in real business workflows',
  'Honest owner reviews over marketing claims',
  'Proven in real deployments',
  'Match team size, integrations, and security requirements',
];

function auditForeignPillarText(body) {
  const hits = [];
  const b = String(body || '');
  for (const phrase of FOREIGN_BOILERPLATE) if (b.includes(phrase)) hits.push(phrase);
  return hits;
}

function auditTemplateArtifacts(body) {
  const issues = [];
  const b = String(body || '');
  if (/<!--pillar-weave-->|<\!--cro-weave-->/.test(b)) issues.push('weave_marker_in_blob');
  const lines = b.split('\n');
  for (let i = 1; i < lines.length; i++) {
    const a = lines[i].trim();
    const p = lines[i - 1].trim();
    if (a && a === p && a.length > 12) { issues.push('duplicate_caption_line'); break; }
  }
  if (/\bMatch tank size and maintenance plan\b/.test(b)) issues.push('mermaid_aquarium_label');
  return issues;
}

// Sentinels emitted by the generated stub block (buildStubSectionBlock). If any appear in a rank section that ALSO
// carries substantial authored prose, the stub filler was appended alongside real content — the "two Verdicts"
// defect. Structural (co-occurrence of length + sentinel), so rewording the sentinel is caught by updating it here,
// and the generator (all-or-nothing sectionBody) simply never produces this state for authored content.
const STUB_SENTINELS = [
  'earns its spot for **visual storytelling**',
  'earns its spot for **core features**',
  'earns its spot for **build quality**',
  'Iconic direction · Memorable performances · Rewatch value',
  'A definitive pick for fans of',
  'A solid pick at this rank for',
];
function splitRankSections(body) {
  const b = String(body || '');
  const secs = [];
  const re = /^##\s+(\d+)\.[^\n]*$/gm;
  let m, starts = [];
  while ((m = re.exec(b))) starts.push({ rank: parseInt(m[1], 10), at: m.index });
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1].at : b.length;
    secs.push({ rank: starts[i].rank, text: b.slice(starts[i].at, end) });
  }
  return secs;
}
function auditDuplicateFiller(body) {
  const fails = [];
  for (const sec of splitRankSections(body)) {
    const hasStub = STUB_SENTINELS.some((s) => sec.text.includes(s));
    if (!hasStub) continue;
    // A genuine stub-only section is short (~250 chars). Rich authored content + stub sentinel = appended duplicate.
    if (sec.text.length > 420) fails.push('rank_' + sec.rank + '_duplicate_filler_block');
  }
  return fails;
}

// Criterion #22: every image the blob references must resolve. For self-hosted /assets/ paths that means the file
// exists on disk (the detect-fix desync the advisor flagged: repair rewrote files but the page still points at old
// paths → 404). Hotlinks are caught separately by C4/C14; here we flag missing local files. Covers @@PRODUCT img="…"
// and markdown ![alt](url) references.
function enumerateAllImageRefs(body) {
  const refs = [];
  const b = String(body || '');
  let m;
  const prod = /@@PRODUCT\s+[^\n]*\bimg="([^"]*)"/g;
  while ((m = prod.exec(b))) refs.push(m[1]);
  const md = /!\[[^\]]*\]\(([^)\s]+)/g;
  while ((m = md.exec(b))) refs.push(m[1]);
  return refs;
}
function auditImgSrcResolve(body) {
  const missing = [];
  for (const url of enumerateAllImageRefs(body)) {
    if (!url) { missing.push('(empty)'); continue; }
    if (/^https?:\/\//i.test(url)) continue; // hotlink: C4/C14 handle it
    const rel = url.replace(/^\//, '').split(/[?#]/)[0];
    try {
      if (!fs.existsSync(WD + '/' + rel)) missing.push(url);
    } catch (e) { missing.push(url); }
  }
  return missing;
}

function auditRelatedIntegrity(body, idxEntries) {
  const byId = {};
  for (const e of idxEntries || []) if (e && e.id) byId[e.id] = e;
  const fails = [];
  const re = /\[([^\]]+)\]\(\/knowledge\/([a-z]{2,3}\d+)\)/gi;
  let m;
  while ((m = re.exec(String(body || '')))) {
    const linkText = m[1].replace(/\s+$/, '').trim();
    const destId = m[2];
    const dest = byId[destId];
    if (!dest) { fails.push({ linkText, destId, reason: 'dest_missing' }); continue; }
    const destQ = (dest.question || '').replace(/\s+$/, '').trim();
    if (linkText !== destQ) fails.push({ linkText, destId, destQ, reason: 'title_mismatch' });
  }
  return fails;
}

module.exports = {
  parseMovieSlot,
  slugify,
  buildMoviePosterSearchQuery,
  movieSlotStamp,
  verifyMovieSlotImage,
  auditMovieTitleMatch,
  enumerateProductSlots,
  isJunkMovieSignal,
  urlMatchesMovieTitle,
  bufferHasMovieStamp,
  posterAspectOk,
  auditForeignPillarText,
  auditTemplateArtifacts,
  auditDuplicateFiller,
  auditImgSrcResolve,
  auditRelatedIntegrity,
  MOVIE_SLOT_STAMP_PREFIX,
};
