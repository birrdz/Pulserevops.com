// _img_flux_rewrite_lib.js — Pollinator Image Overwrite: force new flux on EVERY rubric image slot.
// Top-10 lists get item-specific prompts (movie/product name) — never generic pool scenes.
const fs = require('fs');
const { runFluxJob, fetchFluxPrompt } = require('./_pollinator_flux_throttle');
const { storeGradedImage, buildFluxFaceQuery, buildFluxSectionQuery, pickTitleSearchQuery, faceCoverQualityOk, FACE_CARD_FRAMING, gradeFaceCardFromBuffer } = require('./_ddg_facecard_lib');
const { isTop10Body, parseTop10Items } = require('./netlify/functions/lib/ensure-entry-images');
const { isKoryCroImg } = require('./_img_flux_lib');

const faceCardPath = id => '/assets/qa/' + id + '.jpg';
const {
  ddgImageSectionTargets, sectionCaption, sectionFileSlot, top10ProductSlot, findSectionImageLine,
} = require('./_img_media_law_lib');

const WD = 'C:/Users/koryj/website', QDIR = WD + '/assets/qa';
if (!fs.existsSync(QDIR)) fs.mkdirSync(QDIR, { recursive: true });
const S = 760;
const clean = s => String(s || '').replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
const hash = id => { let s = 0; for (const c of String(id)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return s; };
const pillarOf = id => (String(id).match(/^[a-z]+/) || [''])[0];

const FLUX_REAL = ', real documentary photograph, no chart no graph no infographic no dashboard, no infomercial, no CGI no futuristic sci-fi neon cyberpunk AI look';

function buildTop10CoverQuery(id, question) {
  const q = clean(question) || id;
  const pillar = pillarOf(id);
  if (pillar === 'mv' || /\bmovie|\bfilm|\bcinema|\bhorror|\bsci-?fi|\baction\b/i.test(q)) {
    return 'cinematic editorial photograph for the list topic "' + q + '", iconic movie atmosphere and film still mood, dramatic lighting, specific to this movie genre, not generic office stock, ' + FACE_CARD_FRAMING + ', no text overlay, no watermark' + FLUX_REAL;
  }
  if (/\bapp|\bsoftware|\btool|\bdevice|\bgear|\bequipment|\bproduct\b/i.test(q) || ['aq', 'er', 'tk', 'es', 'cl', 'pt', 'ca', 'bt', 'tv', 'bo'].includes(pillar)) {
    return 'editorial product photography representing the list "' + q + '", clean studio lighting, recognizable products for this exact topic, not generic business handshake, ' + FACE_CARD_FRAMING + ', no text, no watermark' + FLUX_REAL;
  }
  if (/\bbook|\bsummary\b/i.test(q) || pillar === 'bs') {
    return 'editorial photograph for book list "' + q + '", reading desk with books mood, topic-specific, ' + FACE_CARD_FRAMING + ', no readable text overlay, no watermark' + FLUX_REAL;
  }
  return 'editorial documentary photograph illustrating the exact list topic "' + q + '", specific subject matter for this Top 10 list, not generic stock, ' + FACE_CARD_FRAMING + ', no text, no watermark' + FLUX_REAL;
}

function buildTop10ProductQuery(id, question, item) {
  const listQ = clean(question) || id;
  const name = clean(item.productName || item.heading || listQ);
  const heading = clean(item.heading || name);
  const pillar = pillarOf(id);
  const label = name.length > 4 ? name : heading;
  if (pillar === 'mv' || /\bmovie|\bfilm|\bcinema\b/i.test(listQ + ' ' + label)) {
    return 'cinematic film still from the movie "' + label + '", recognizable scene or iconic visual from this specific film title, dramatic movie photography, must match this exact movie not a generic horror/sci-fi scene, no poster text, no watermark, editorial photograph' + FLUX_REAL;
  }
  if (pillar === 'bs' || /\bbook\b/i.test(listQ)) {
    return 'book "' + label + '" cover or reading scene, editorial photograph, topic-specific, no readable text overlay, no watermark' + FLUX_REAL;
  }
  if (/\bapp\b|\bsoftware\b/i.test(label + ' ' + listQ)) {
    return 'smartphone or laptop showing "' + label + '" app interface mockup style product photo, clean studio, recognizable software product, no fake logos, no watermark' + FLUX_REAL;
  }
  return 'official product photo of "' + label + '" for the list "' + listQ.slice(0, 90) + '", isolated recognizable product, clean background, not generic stock photo, no watermark, editorial photograph' + FLUX_REAL;
}

const FLUX_COVER_MAX_TRY = parseInt(process.env.FLUX_COVER_MAX_TRY || '8', 10);

async function makeCoverForce(id, q, promptOverride, fluxOpts) {
  fluxOpts = fluxOpts || {};
  const attempt = Math.max(0, (fluxOpts.attempt || 1) - 1);
  const shouldStop = fluxOpts.shouldStop || (() => false);
  const dest = QDIR + '/' + id + '.jpg';
  for (let fluxTry = 0; fluxTry < FLUX_COVER_MAX_TRY; fluxTry++) {
    if (shouldStop()) return false;
    const tryAttempt = attempt + fluxTry;
    const titlePick = pickTitleSearchQuery(clean(q) || id, id, tryAttempt);
    if (fluxOpts.onSearch) fluxOpts.onSearch(titlePick);
    const kept = await runFluxJob(async () => {
      const prompt = promptOverride || buildFluxFaceQuery(id, clean(q) || id, tryAttempt, fluxOpts.guideKeywords);
      const seed = hash(id) + tryAttempt * 997 + (hash(prompt) % 99999) + titlePick.idx * 131 + fluxTry * 7919;
      const missMode = tryAttempt > 0 || fluxTry > 0 ? 'dupe' : null;
      const b = await fetchFluxPrompt(prompt, seed, { pool: true, missMode, maxTry: fluxTry > 2 ? 8 : 6 });
      if (!b) return false;
      await gradeFaceCardFromBuffer(b, dest, { question: clean(q) || id, variant: fluxOpts.variant });
      const qc = await faceCoverQualityOk(id, clean(q) || id, fs.readFileSync(dest));
      if (!qc.ok) {
        try { fs.unlinkSync(dest); } catch (e) {}
        if (fluxOpts.onQualityMiss) fluxOpts.onQualityMiss(qc.reason, fluxTry + 1, titlePick);
        return false;
      }
      return true;
    }, 'overwrite-cover:' + id + '-a' + (tryAttempt + 1) + '-f' + (fluxTry + 1), { noCooldown: !!fluxOpts.noCooldown });
    if (kept) return true;
  }
  return false;
}

async function makeSectionForce(id, slot, alt, promptOverride, fluxOpts) {
  fluxOpts = fluxOpts || {};
  const rel = '/assets/qa/' + id + '-' + slot + '.jpg';
  const attempt = Math.max(0, (fluxOpts.attempt || 1) - 1);
  const titlePick = pickTitleSearchQuery(clean(alt) || id, id, attempt);
  if (fluxOpts.onSearch) fluxOpts.onSearch(titlePick);
  return runFluxJob(async () => {
    const prompt = promptOverride || buildFluxSectionQuery(id, alt, slot, attempt, fluxOpts.guideKeywords);
    const seed = hash(id) + slot * 101 + attempt * 997 + (hash(prompt) % 99999) + titlePick.idx * 53;
    const missMode = attempt > 0 ? 'dupe' : null;
    const b = await fetchFluxPrompt(prompt, seed, { pool: true, missMode });
    if (!b) return null;
    await storeGradedImage(b, QDIR + '/' + id + '-' + slot + '.jpg', { width: 1024, bright: false });
    return rel;
  }, 'overwrite-sec:' + id + '-' + slot + '-a' + (attempt + 1), { noCooldown: !!fluxOpts.noCooldown });
}

const COVER_JOB_SLOTS = 1; // one Pollinator flux → /assets/qa/<id>.jpg used for mosaic face-card AND top hero markdown

function countRewriteJobs(body) {
  body = String(body || '');
  if (isTop10Body(body)) {
    const items = parseTop10Items(body);
    return { sections: 0, products: items.length, covers: COVER_JOB_SLOTS, total: COVER_JOB_SLOTS + items.length, top10: true };
  }
  const targets = ddgImageSectionTargets(body.split('\n'), body);
  return { sections: targets.length, products: 0, covers: COVER_JOB_SLOTS, total: COVER_JOB_SLOTS + targets.length, top10: false };
}

/** Paste the face-card file path as the main top hero markdown (same image, no second flux). */
function syncHeroDupesFaceCard(id, question, body) {
  return forceMainTopHero(id, question, body);
}

/** One flux face-card file, then duplicate that path into the answer hero line. */
async function makeFaceCardAndSyncHero(id, question, body, coverPrompt, fluxOpts) {
  if (!(await makeCoverForce(id, question, coverPrompt, fluxOpts))) return { ok: false, body };
  return { ok: true, body: fluxOpts && fluxOpts.coverOnly ? body : syncHeroDupesFaceCard(id, question, body), fluxDone: 1 };
}

/** Drop legacy <!--HERO--> marker + stray intro images before the first ## section (second hero under face-card). */
function stripIntroStrayImages(lines) {
  let out = [];
  for (let i = 0; i < lines.length; i++) {
    const t = String(lines[i] || '').trim();
    if (/^<!--HERO-->\s*$/.test(t)) {
      if (i + 1 < lines.length && lines[i + 1].trim() === '') i++;
      if (i + 1 < lines.length && /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(lines[i + 1])) i++;
      continue;
    }
    out.push(lines[i]);
  }
  const out2 = [];
  let zone = 'pre'; // pre | after-h1 | body
  for (const line of out) {
    const t = String(line || '').trim();
    if (zone === 'pre' && /^#\s+/.test(t) && !/^##\s+/.test(t)) {
      zone = 'after-h1';
      out2.push(line);
      continue;
    }
    if (zone === 'after-h1') {
      if (/^##\s+/.test(t)) {
        zone = 'body';
        out2.push(line);
        continue;
      }
      if (/^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(line)) continue;
      if (t === '') continue;
      zone = 'body';
    }
    out2.push(line);
  }
  return out2;
}

/** Force main top hero markdown to face-card path at document start (strip stale hero/kory lines). */
function forceMainTopHero(id, question, body) {
  const alt = clean(question) || id;
  const heroPath = faceCardPath(id);
  let removed = false;
  const lines = String(body || '').split('\n').filter(line => {
    const k = line.match(/!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (k && isKoryCroImg(k[2])) return false;
    if (!removed) {
      const m = line.match(/^\s*!\[([^\]]*)\]\(([^)\s]+)\)\s*$/);
      if (m && !isKoryCroImg(m[2])) { removed = true; return false; }
    }
    return true;
  });
  const rest = stripIntroStrayImages(lines);
  return '![' + alt + '](' + heroPath + ')\n\n' + rest.join('\n').trimStart();
}

function ensureHeroMarkdown(id, question, body) {
  return syncHeroDupesFaceCard(id, question, body);
}

async function fluxRewriteEntry(id, question, body, opts) {
  opts = opts || {};
  const shouldStop = opts.shouldStop || (() => false);
  const onProgress = opts.onProgress || (() => {});
  question = clean(question) || id;
  body = String(body || '');
  const plan = countRewriteJobs(body);
  let fluxDone = 0;
  const tick = (label, phase) => {
    onProgress({ done: fluxDone, total: plan.total, label, phase, detail: fluxDone + ' / ' + plan.total + ' — ' + label });
  };

  if (shouldStop()) return { body, fluxDone: 0, fluxTotal: plan.total, stopped: true };

  const top10 = plan.top10 || isTop10Body(body);
  tick(top10 ? 'Top-10 face-card + hero · same file' : 'face-card + top hero · same file', 'cover');
  const coverPrompt = top10 ? buildTop10CoverQuery(id, question) : null;
  let lastSearch = null;
  const cover = await makeFaceCardAndSyncHero(id, question, body, coverPrompt, Object.assign({}, opts, {
    onSearch: pick => {
      lastSearch = pick;
      tick('search ' + (pick.idx + 1) + '/' + pick.total + ' · ' + String(pick.query || '').slice(0, 44), 'search');
    },
  }));
  if (!cover.ok) return { body, fluxDone, fluxTotal: plan.total, error: 'face-card failed' };
  fluxDone += cover.fluxDone;
  let bodyStr = cover.body;

  if (top10) {
    const items = parseTop10Items(bodyStr);
    let lines = bodyStr.split('\n');
    for (let pi = 0; pi < items.length; pi++) {
      if (shouldStop()) return { body: lines.join('\n'), fluxDone, fluxTotal: plan.total, stopped: true };
      const it = items[pi];
      const prodName = clean(it.productName || it.heading || question);
      const slot = top10ProductSlot(id, it.idx, it.img);
      const prodPrompt = buildTop10ProductQuery(id, question, it);
      tick('#' + it.idx + ' · ' + prodName.slice(0, 44), 'product');
      const local = await makeSectionForce(id, slot, prodName, prodPrompt, opts);
      fluxDone++;
      if (!local) continue;
      const headRe = new RegExp('^##\\s+' + it.idx + '\\.\\s');
      for (let li = 0; li < lines.length; li++) {
        if (!headRe.test(lines[li])) continue;
        for (let lj = li + 1; lj < lines.length && lj <= li + 6; lj++) {
          const pm = lines[lj].match(/@@PRODUCT\s+name="([^"]*)"\s+img="([^"]+)"\s+site="([^"]*)"/);
          if (pm) {
            lines[lj] = '@@PRODUCT name="' + pm[1].replace(/"/g, '') + '" img="' + local + '" site="' + pm[3].replace(/"/g, '') + '"';
            break;
          }
          if (/^##\s+\d+\./.test(lines[lj])) break;
        }
        break;
      }
    }
    return { body: lines.join('\n'), fluxDone, fluxTotal: plan.total, coverOk: true, top10: true, searchQuery: lastSearch && lastSearch.query, searchIdx: lastSearch && lastSearch.idx };
  }

  let lines = bodyStr.split('\n');
  const targets = ddgImageSectionTargets(lines, bodyStr);
  for (let ti = 0; ti < targets.length; ti++) {
    if (shouldStop()) return { body: lines.join('\n'), fluxDone, fluxTotal: plan.total, stopped: true };
    const idx = targets[ti];
    const sect = lines[idx];
    const secText = sect.replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').trim() + ' ' + question;
    const found = findSectionImageLine(lines, idx);
    const slot = sectionFileSlot(id, ti, found.url);
    tick(sect.replace(/^#{2,3}\s+/, '').slice(0, 48), 'section');
    const local = await makeSectionForce(id, slot, secText, null, opts);
    fluxDone++;
    if (!local) continue;
    const tag = '![' + sectionCaption(question, sect) + '](' + local + ')';
    if (found.line >= 0) lines[found.line] = tag;
    else lines.splice(idx + 1, 0, '', tag, '');
  }

  return { body: lines.join('\n'), fluxDone, fluxTotal: plan.total, coverOk: true, searchQuery: lastSearch && lastSearch.query, searchIdx: lastSearch && lastSearch.idx };
}

/** Pollinator overwrite for section images only — face-card + hero untouched. */
async function fluxRewriteSectionsOnly(id, question, body, opts) {
  opts = opts || {};
  const shouldStop = opts.shouldStop || (() => false);
  const onProgress = opts.onProgress || (() => {});
  question = clean(question) || id;
  body = String(body || '');
  const top10 = isTop10Body(body);
  if (top10) {
    return fluxRewriteEntry(id, question, body, Object.assign({}, opts, {
      onProgress: p => onProgress(Object.assign({}, p, { phase: p.phase || 'top10' })),
    }));
  }
  const targets = ddgImageSectionTargets(body.split('\n'), body);
  const plan = { sections: targets.length, total: targets.length, top10: false };
  let fluxDone = 0;
  const tick = (label, phase) => {
    onProgress({ done: fluxDone, total: plan.total, label, phase, detail: fluxDone + ' / ' + plan.total + ' — ' + label });
  };
  if (!plan.total) return { body, fluxDone: 0, fluxTotal: 0, sectionsOnly: true, skipped: true };
  let lines = body.split('\n');
  for (let ti = 0; ti < targets.length; ti++) {
    if (shouldStop()) return { body: lines.join('\n'), fluxDone, fluxTotal: plan.total, stopped: true, sectionsOnly: true };
    const idx = targets[ti];
    const sect = lines[idx];
    const secText = sect.replace(/^#{2,3}\s+/, '').replace(/[\[\]"]/g, '').trim() + ' ' + question;
    const found = findSectionImageLine(lines, idx);
    const slot = sectionFileSlot(id, ti, found.url);
    tick(sect.replace(/^#{2,3}\s+/, '').slice(0, 48), 'section');
    const local = await makeSectionForce(id, slot, secText, null, opts);
    fluxDone++;
    if (!local) continue;
    const tag = '![' + sectionCaption(question, sect) + '](' + local + ')';
    if (found.line >= 0) lines[found.line] = tag;
    else lines.splice(idx + 1, 0, '', tag, '');
  }
  return { body: lines.join('\n'), fluxDone, fluxTotal: plan.total, sectionsOnly: true };
}

const FACE_HERO_JOB_SLOTS = COVER_JOB_SLOTS;

function countFaceHeroJobs() {
  return { covers: FACE_HERO_JOB_SLOTS, total: FACE_HERO_JOB_SLOTS, top10: false, faceHeroOnly: true };
}

/** Pollinator overwrite for face-card mosaic + main top hero only — one flux file, hero markdown dupes same path. */
async function fluxFaceHeroOnlyEntry(id, question, body, opts) {
  opts = opts || {};
  const shouldStop = opts.shouldStop || (() => false);
  const onProgress = opts.onProgress || (() => {});
  question = clean(question) || id;
  body = String(body || '');
  const plan = countFaceHeroJobs();
  let fluxDone = 0;
  const tick = (label, phase) => {
    onProgress({ done: fluxDone, total: plan.total, label, phase, detail: fluxDone + ' / ' + plan.total + ' — ' + label });
  };

  if (shouldStop()) return { body, fluxDone: 0, fluxTotal: plan.total, stopped: true };

  const top10 = isTop10Body(body);
  tick(top10 ? 'Top-10 face-card + hero · same file' : 'face-card + top hero · same file', 'cover');
  const coverPrompt = top10 ? buildTop10CoverQuery(id, question) : null;
  let lastSearch = null;
  const cover = await makeFaceCardAndSyncHero(id, question, body, coverPrompt, Object.assign({}, opts, {
    shouldStop,
    onSearch: pick => {
      lastSearch = pick;
      tick('search ' + (pick.idx + 1) + '/' + pick.total + ' · ' + String(pick.query || '').slice(0, 44), 'search');
      onProgress({ done: fluxDone, total: plan.total, label: 'search ' + (pick.idx + 1) + '/' + pick.total, phase: 'search', detail: pick.query, searchQuery: pick.query, searchIdx: pick.idx });
    },
    onQualityMiss: (reason, tryN, pick) => {
      tick('reject ' + reason + ' · try ' + tryN + '/' + FLUX_COVER_MAX_TRY, 'quality');
      onProgress({ done: fluxDone, total: plan.total, label: 'quality · ' + reason, phase: 'quality', detail: (pick && pick.query) || reason, searchQuery: pick && pick.query, searchIdx: pick && pick.idx });
      if (opts.onQualityMiss) opts.onQualityMiss(reason, tryN, pick);
    },
  }));
  if (!cover.ok) return { body, fluxDone, fluxTotal: plan.total, error: 'face-card failed' };
  fluxDone += cover.fluxDone;

  return { body: cover.body, fluxDone, fluxTotal: plan.total, coverOk: true, faceHeroOnly: true, top10, heroPath: faceCardPath(id), searchQuery: lastSearch && lastSearch.query, searchIdx: lastSearch && lastSearch.idx };
}

module.exports = {
  fluxRewriteEntry, fluxRewriteSectionsOnly, fluxFaceHeroOnlyEntry, countRewriteJobs, countFaceHeroJobs, makeCoverForce, makeFaceCardAndSyncHero,
  makeSectionForce, forceMainTopHero, stripIntroStrayImages, syncHeroDupesFaceCard, ensureHeroMarkdown,
  buildTop10CoverQuery, buildTop10ProductQuery, COVER_JOB_SLOTS, FACE_HERO_JOB_SLOTS, faceCardPath,
};
